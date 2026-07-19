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
  setAccountActive,
} from '@/src/sync/accountStorage';
import {
  clearSyncedLocalData,
  enqueueCurrentLocalData,
  migrateLocalDataToSupabase,
  pullChanges,
  remoteDataExists,
  SyncPayloadTooLargeError,
  syncNow as runSync,
} from '@/src/sync/syncEngine';

type SyncContextValue = {
  isConfigured: boolean;
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
  ) => Promise<{ restored: boolean }>;
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
  const [isReady, setIsReady] = useState(false);
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
    if (!supabase) {
      setIsReady(true);
      return;
    }
    let mounted = true;
    void supabase.auth.getSession().then(async ({ data, error }) => {
      if (error) {
        console.error('Failed to restore account session:', error);
      }
      if (!mounted) return;
      const restoredSession = data.session;
      sessionRef.current = restoredSession;
      setSession(restoredSession);
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
    },
    []
  );

  const verifyOtp = useCallback(
    async (
      email: string,
      token: string,
      intent: AccountIntent
    ): Promise<{ restored: boolean }> => {
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
            await enqueueCurrentLocalData();
            try {
              await runSync(userId);
              setSyncError(null);
            } catch (syncFailure) {
              if (syncFailure instanceof SyncPayloadTooLargeError) {
                setSyncError(syncFailure.message);
              } else {
                throw syncFailure;
              }
            }
          } else {
            await pullChanges(userId, { full: true });
          }
          markLocalDataUpdated();
          return { restored: true };
        }

        await migrateLocalDataToSupabase(userId);
        await setAccountActive(userId);
        await pullChanges(userId, { full: true });
        setSyncError(null);
        markLocalDataUpdated();
        return { restored: false };
      } catch (finalizeError) {
        await client.auth.signOut();
        sessionRef.current = null;
        setSession(null);
        await clearAccountActive();
        throw finalizeError;
      }
    },
    [markLocalDataUpdated]
  );

  const signOut = useCallback(async (): Promise<void> => {
    const { error } = await getSupabaseClient().auth.signOut();
    if (error) throw error;
    sessionRef.current = null;
    setSession(null);
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
