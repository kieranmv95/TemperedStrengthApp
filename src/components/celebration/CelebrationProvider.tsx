import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View } from 'react-native';
import { ConfettiCelebration } from '@/src/components/ConfettiCelebration';
import {
  getCelebrationEffectsEnabled,
  setCelebrationEffectsEnabled,
} from '@/src/utils/storage';

type CelebrationContextValue = {
  celebrateConfetti: () => void;
  celebrationEffectsEnabled: boolean;
  setCelebrationEffectsEnabled: (enabled: boolean) => Promise<void>;
};

const CelebrationContext = createContext<CelebrationContextValue | null>(null);

export function CelebrationProvider({ children }: { children: React.ReactNode }) {
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [celebrationEffectsEnabled, setCelebrationEffectsEnabledState] =
    useState(true);

  useEffect(() => {
    let cancelled = false;
    getCelebrationEffectsEnabled()
      .then((enabled) => {
        if (cancelled) return;
        setCelebrationEffectsEnabledState(enabled);
      })
      .catch(() => {
        // Default already true
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const celebrateConfetti = useCallback(() => {
    if (!celebrationEffectsEnabled) return;
    setConfettiTrigger((t) => t + 1);
  }, [celebrationEffectsEnabled]);

  const saveEnabled = useCallback(async (enabled: boolean) => {
    setCelebrationEffectsEnabledState(enabled);
    await setCelebrationEffectsEnabled(enabled);
  }, []);

  const value = useMemo(
    () => ({
      celebrateConfetti,
      celebrationEffectsEnabled,
      setCelebrationEffectsEnabled: saveEnabled,
    }),
    [celebrateConfetti, celebrationEffectsEnabled, saveEnabled]
  );

  return (
    <CelebrationContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        {celebrationEffectsEnabled ? (
          <ConfettiCelebration
            trigger={confettiTrigger}
            pieces={80}
            durationMs={2200}
          />
        ) : null}
      </View>
    </CelebrationContext.Provider>
  );
}

export function useCelebration() {
  const ctx = useContext(CelebrationContext);
  if (!ctx) {
    throw new Error('useCelebration must be used within CelebrationProvider');
  }
  return ctx;
}

