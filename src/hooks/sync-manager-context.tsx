import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { SYNC_ENABLED_KEY, SyncManager, type SyncDecision, type SyncConflict } from '@/src/sync';
import { ICloudKvsProvider } from '@/src/sync/providers/ICloudKvsProvider';
import { NoopSyncProvider } from '@/src/sync/providers/NoopSyncProvider';
import { ICloudSyncConflictModal } from '@/src/components/sync/ICloudSyncConflictModal';
import { setRuntimeSyncManager } from '@/src/sync/runtime';

type SyncContextValue = {
  enabled: boolean;
  isAvailable: boolean;
  setEnabled: (enabled: boolean) => Promise<{ isAvailable: boolean }>;
  syncNow: () => Promise<void>;
};

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
  const [enabled, setEnabledState] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  const managerRef = useRef<SyncManager | null>(null);

  const [pendingConflicts, setPendingConflicts] = useState<SyncConflict[] | null>(null);
  const pendingResolverRef = useRef<((decision: SyncDecision) => void) | null>(null);

  const requestConflictDecision = useCallback(async (conflicts: SyncConflict[]) => {
    return await new Promise<SyncDecision>((resolve) => {
      pendingResolverRef.current = resolve;
      setPendingConflicts(conflicts);
    });
  }, []);

  const buildManager = useCallback(
    async (nextEnabled: boolean) => {
      if (!nextEnabled || Platform.OS !== 'ios') {
        managerRef.current = new SyncManager({
          provider: new NoopSyncProvider(),
          requestConflictDecision,
        });
        setRuntimeSyncManager(managerRef.current);
        setIsAvailable(false);
        return false;
      }

      const provider = new ICloudKvsProvider();
      const availability = await provider.getAvailability();
      managerRef.current = new SyncManager({ provider, requestConflictDecision });
      setRuntimeSyncManager(managerRef.current);
      setIsAvailable(availability.available);
      return availability.available;
    },
    [requestConflictDecision]
  );

  const syncNow = useCallback(async () => {
    if (!enabled) return;
    await managerRef.current?.reconcileOnce();
  }, [enabled]);

  const setEnabled = useCallback(
    async (nextEnabled: boolean) => {
      setEnabledState(nextEnabled);
      await AsyncStorage.setItem(SYNC_ENABLED_KEY, nextEnabled ? 'true' : 'false');
      const available = await buildManager(nextEnabled);

      if (nextEnabled) {
        await managerRef.current?.reconcileOnce();
      }
      return { isAvailable: nextEnabled ? available : false };
    },
    [buildManager]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SYNC_ENABLED_KEY);
        const initialEnabled = raw === 'true';
        if (!mounted) return;
        setEnabledState(initialEnabled);
        await buildManager(initialEnabled);
        if (initialEnabled) {
          await managerRef.current?.reconcileOnce();
        }
      } catch (error) {
        console.error('Failed to initialize sync:', error);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [buildManager]);

  useEffect(() => {
    if (!enabled) return;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        syncNow().catch((error) => {
          console.error('Sync on foreground failed:', error);
        });
      }
    });
    return () => subscription.remove();
  }, [enabled, syncNow]);

  const onConflictDecision = useCallback((decision: SyncDecision) => {
    const resolve = pendingResolverRef.current;
    pendingResolverRef.current = null;
    setPendingConflicts(null);
    resolve?.(decision);
  }, []);

  const value = useMemo<SyncContextValue>(
    () => ({ enabled, isAvailable, setEnabled, syncNow }),
    [enabled, isAvailable, setEnabled, syncNow]
  );

  // Android: do not render modal and do not prompt.
  const shouldShowModal = Platform.OS === 'ios' && pendingConflicts !== null;

  return (
    <SyncContext.Provider value={value}>
      {children}
      <ICloudSyncConflictModal
        visible={shouldShowModal}
        conflictCount={pendingConflicts?.length ?? 0}
        onKeepLocal={() => onConflictDecision('keep_local')}
        onKeepICloud={() => onConflictDecision('keep_icloud')}
      />
    </SyncContext.Provider>
  );
}

