import NetInfo from '@react-native-community/netinfo';
import type { Session, User } from '@supabase/supabase-js';
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  supabase,
} from '@/src/services/supabaseClient';
import {
  clearAccountActive,
  getActiveAccountUserId,
  recordOtpSent,
  setAccountActive,
} from '@/src/sync/accountStorage';
import {
  clearSyncedLocalData,
  enqueueCurrentLocalData,
  migrateLocalDataToSupabase,
  pullChanges,
  remoteDataExists,
  syncNow as runSync,
} from '@/src/sync/syncEngine';
import { ensurePersonalBestsCloudMigrated } from '@/src/sync/domains/personalBests';
import { ensureWorkoutLogsCloudMigrated } from '@/src/sync/domains/workoutLogs';

type SyncContextValue = {
  isConfigured: boolean;
  /**
   * True once getSession() has resolved (before account KV sync finishes).
   * Use for auth-dependent SDK binding (e.g. RevenueCat identity).
   */
  isSessionReady: boolean;
  /** True once initial session restore + first sync attempt have finished. */
  isReady: boolean;
  /** Increments after local storage is updated by account sync/pull. */
  dataRevision: number;
  syncError: string | null;
  session: Session | null;
  user: User | null;
  syncNow: () => Promise<void>;
  sendOtp: (email: string, intent: AccountIntent) => Promise<void>;
  verifyOtp: (
    email: string,
    token: string,
    intent: AccountIntent
  ) => Promise<{ restored: boolean; backupError: string | null }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
};

export type AccountIntent = 'create' | 'restore';

export class AccountRestoreEmptyError extends Error {
  constructor() {
    super(
      'This account does not have any backed-up data yet. Your local data has not been changed.'
    );
    this.name = 'AccountRestoreEmptyError';
  }
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.trim().length > 0
  ) {
    return error.message;
  }
  return fallback;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function useSyncManager(): SyncContextValue {
  const ctx = React.useContext(SyncContext);
  if (!ctx) {
    throw new Error('useSyncManager must be used within SyncManagerProvider');
  }
  return ctx;
}

type SyncManagerProviderProps = {
  children: React.ReactNode;
};

export function SyncManagerProvider({ children }: SyncManagerProviderProps) {
  // Without Supabase there is no session to restore, so we are ready at once.
  const [isSessionReady, setIsSessionReady] = useState(!supabase);
  const [isReady, setIsReady] = useState(!supabase);
  const [dataRevision, setDataRevision] = useState(0);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const sessionRef = useRef<Session | null>(null);

  const markLocalDataUpdated = useCallback(() => {
    setDataRevision((value) => value + 1);
  }, []);

  const syncNow = useCallback(async () => {
    const userId = sessionRef.current?.user.id;
    if (!userId) return;
    try {
      await runSync(userId);
      setSyncError(null);
      markLocalDataUpdated();
    } catch (error) {
      setSyncError(
        error instanceof Error ? error.message : 'Account backup failed.'
      );
      console.error('Account sync failed; changes will retry later:', error);
    }
  }, [markLocalDataUpdated]);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    void supabase.auth.getSession().then(async ({ data, error }) => {
      if (error) {
        console.error('Failed to restore account session:', error);
      }
      if (!mounted) return;
      const restoredSession = data.session;
      sessionRef.current = restoredSession;
      setSession(restoredSession);
      // Session is known — allow RevenueCat identity bind before KV sync.
      setIsSessionReady(true);
      if (restoredSession) {
        await setAccountActive(restoredSession.user.id);
        await syncNow();
      }
      if (mounted) setIsReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        sessionRef.current = nextSession;
        setSession(nextSession);
      }
    );
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [syncNow]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        supabase?.auth.startAutoRefresh();
        void syncNow();
      } else {
        supabase?.auth.stopAutoRefresh();
      }
    });
    return () => subscription.remove();
  }, [syncNow]);

  useEffect(() => {
    let wasConnected: boolean | null = null;
    return NetInfo.addEventListener((state) => {
      const connected = state.isConnected === true;
      if (connected && wasConnected === false) void syncNow();
      wasConnected = connected;
    });
  }, [syncNow]);

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(
      () => {
        if (AppState.currentState === 'active') void syncNow();
      },
      5 * 60 * 1000
    );
    return () => clearInterval(interval);
  }, [session, syncNow]);

  const sendOtp = useCallback(
    async (email: string, intent: AccountIntent): Promise<void> => {
      const { error } = await getSupabaseClient().auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: intent === 'create' },
      });
      if (error) throw error;
      await recordOtpSent(email);
    },
    []
  );

  const verifyOtp = useCallback(
    async (
      email: string,
      token: string,
      intent: AccountIntent
    ): Promise<{ restored: boolean; backupError: string | null }> => {
      const client = getSupabaseClient();
      const { data, error } = await client.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: token.trim(),
        type: 'email',
      });
      if (error) throw error;
      if (!data.session || !data.user) {
        throw new Error('Supabase did not return an authenticated session.');
      }

      sessionRef.current = data.session;
      setSession(data.session);
      const userId = data.user.id;

      const keepSessionWithBackupError = async (
        backupFailure: unknown,
        restored: boolean
      ): Promise<{ restored: boolean; backupError: string }> => {
        try {
          await setAccountActive(userId);
        } catch (activeError) {
          console.error('Failed to mark account active:', activeError);
        }
        const message = errorMessage(backupFailure, 'Account backup failed.');
        setSyncError(message);
        console.error('Account backup failed after sign-in:', backupFailure);
        return { restored, backupError: message };
      };

      try {
        const previousUserId = await getActiveAccountUserId();
        const hasRemoteData = await remoteDataExists(userId);

        if (intent === 'restore' && !hasRemoteData) {
          throw new AccountRestoreEmptyError();
        }

        if (hasRemoteData || intent === 'restore') {
          if (previousUserId !== userId) {
            await clearSyncedLocalData();
          }
          await setAccountActive(userId);
          if (previousUserId === userId) {
            // Sign-out keeps the user id, so this device still has its data.
            // Pushing it must not undo a code Supabase already accepted.
            await enqueueCurrentLocalData();
            try {
              await runSync(userId);
              setSyncError(null);
            } catch (syncFailure) {
              markLocalDataUpdated();
              return keepSessionWithBackupError(syncFailure, true);
            }
          } else {
            await pullChanges(userId, { full: true });
            // Structured domains (rows, not KV).
            await ensurePersonalBestsCloudMigrated(userId);
            await ensureWorkoutLogsCloudMigrated(userId);
          }
          markLocalDataUpdated();
          return { restored: true, backupError: null };
        }

        await migrateLocalDataToSupabase(userId);
        await setAccountActive(userId);
        await pullChanges(userId, { full: true });
        setSyncError(null);
        markLocalDataUpdated();
        return { restored: false, backupError: null };
      } catch (finalizeError) {
        if (finalizeError instanceof AccountRestoreEmptyError) {
          await client.auth
            .signOut({ scope: 'local' })
            .catch((signOutError) => {
              console.error(
                'Failed to roll back empty restore session:',
                signOutError
              );
            });
          sessionRef.current = null;
          setSession(null);
          await clearAccountActive();
          throw finalizeError;
        }
        return keepSessionWithBackupError(finalizeError, false);
      }
    },
    [markLocalDataUpdated]
  );

  const signOut = useCallback(async (): Promise<void> => {
    const client = getSupabaseClient();
    try {
      const { error } = await client.auth.signOut();
      if (error) {
        // A dead refresh token can fail the global revoke after the local
        // session is already gone. Drop it locally so sign-in can start clean.
        await client.auth.signOut({ scope: 'local' });
      }
    } catch (signOutError) {
      console.error('Failed to sign out:', signOutError);
      try {
        await client.auth.signOut({ scope: 'local' });
      } catch (localError) {
        console.error('Failed to clear local session:', localError);
      }
    }
    sessionRef.current = null;
    setSession(null);
    setSyncError(null);
    await clearAccountActive();
  }, []);

  const deleteAccount = useCallback(async (): Promise<void> => {
    const client = getSupabaseClient();
    const { error } = await client.rpc('delete_own_account');
    if (error) throw error;
    await client.auth.signOut({ scope: 'local' });
    sessionRef.current = null;
    setSession(null);
    setSyncError(null);
    await clearAccountActive({ forgetUser: true });
  }, []);

  const value = useMemo<SyncContextValue>(
    () => ({
      isConfigured: isSupabaseConfigured,
      isSessionReady,
      isReady,
      dataRevision,
      syncError,
      session,
      user: session?.user ?? null,
      syncNow,
      sendOtp,
      verifyOtp,
      signOut,
      deleteAccount,
    }),
    [
      dataRevision,
      deleteAccount,
      isReady,
      isSessionReady,
      sendOtp,
      session,
      signOut,
      syncError,
      syncNow,
      verifyOtp,
    ]
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}
