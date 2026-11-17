import { GymTimerBlob } from '@/src/components/gymTimer/GymTimerBlob';
import { GymTimerOverlay } from '@/src/components/gymTimer/GymTimerOverlay';
import {
  activateGymTimerKeepAwake,
  cancelGymTimerFinishNotification,
  deactivateGymTimerKeepAwake,
  gymTimerHapticPhaseChange,
  playGymTimerBeep,
  scheduleGymTimerFinishNotification,
} from '@/src/services/gymTimerFeedback';
import {
  endRestTimerSurface,
  syncRestTimerSurface,
} from '@/src/services/restTimerSurface';
import { buildGymTimerSurfacePayload } from '@/src/utils/gymTimer/gymTimerSurfacePayload';
import type {
  GymTimerConfig,
  GymTimerPreset,
  GymTimerRuntime,
  GymTimerSettings,
} from '@/src/types/gymTimer';
import {
  advanceRuntime,
  createReadyRuntime,
  getDisplay,
  nextSegment,
  pauseRuntime,
  resumeRuntime,
  startRuntime,
} from '@/src/utils/gymTimer';
import { registerStrengthRestStarter } from '@/src/utils/gymTimer/strengthRestBridge';
import {
  clearRestTimer,
  getGymTimerPresets,
  getGymTimerRuntime,
  getGymTimerSettings,
  saveGymTimerPresets,
  saveGymTimerRuntime,
  setGymTimerSettings,
  DEFAULT_GYM_TIMER_SETTINGS,
} from '@/src/utils/storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, AppState, type AppStateStatus } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

type GymTimerContextValue = {
  runtime: GymTimerRuntime | null;
  settings: GymTimerSettings;
  presets: GymTimerPreset[];
  /** Opens overlay in Ready. Confirms replace if another gym timer is active. */
  startGymTimer: (config: GymTimerConfig) => void;
  /** Opens and immediately starts (used for strength rest / quick actions). */
  startAndBeginGymTimer: (config: GymTimerConfig) => void;
  begin: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  close: () => void;
  minimise: () => void;
  expand: () => void;
  bumpRound: () => void;
  advanceOpenSegment: () => void;
  setMuted: (muted: boolean) => void;
  /** Turns the open clock to landscape. The rest of the app stays portrait. */
  forceLandscape: boolean;
  setForceLandscape: (forceLandscape: boolean) => void;
  updateSettings: (next: GymTimerSettings) => Promise<void>;
  savePreset: (config: GymTimerConfig) => Promise<void>;
  deletePreset: (id: string) => Promise<void>;
  refreshPresets: () => Promise<void>;
};

const GymTimerContext = createContext<GymTimerContextValue | null>(null);

const TICK_MS = 200;
const PAUSED_KEEP_AWAKE_TIMEOUT_MS = 60_000;

async function dismissProgramRestTimer(): Promise<void> {
  try {
    await endRestTimerSurface();
  } catch {
    // ignore
  }
  try {
    await clearRestTimer();
  } catch {
    // ignore
  }
}

export function GymTimerProvider({ children }: { children: React.ReactNode }) {
  const [runtime, setRuntime] = useState<GymTimerRuntime | null>(null);
  const [settings, setSettings] = useState<GymTimerSettings>(
    DEFAULT_GYM_TIMER_SETTINGS
  );
  const [presets, setPresets] = useState<GymTimerPreset[]>([]);
  const [forceLandscape, setForceLandscape] = useState(false);
  const runtimeRef = useRef<GymTimerRuntime | null>(null);
  const lastBeepSecRef = useRef<number | null>(null);
  const pausedKeepAwakeTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    runtimeRef.current = runtime;
  }, [runtime]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [storedSettings, storedRuntime, storedPresets] = await Promise.all([
        getGymTimerSettings(),
        getGymTimerRuntime(),
        getGymTimerPresets(),
      ]);
      if (cancelled) return;
      setSettings(storedSettings);
      setPresets(storedPresets);
      if (storedRuntime && storedRuntime.viewState !== 'closed') {
        setRuntime(storedRuntime);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback(async (next: GymTimerRuntime | null) => {
    await saveGymTimerRuntime(next);
  }, []);

  const applyRuntime = useCallback(
    (next: GymTimerRuntime | null) => {
      setRuntime(next);
      void persist(next);
    },
    [persist]
  );

  const clearPausedKeepAwakeTimer = useCallback(() => {
    if (pausedKeepAwakeTimer.current) {
      clearTimeout(pausedKeepAwakeTimer.current);
      pausedKeepAwakeTimer.current = null;
    }
  }, []);

  const syncKeepAwake = useCallback(
    (next: GymTimerRuntime | null) => {
      clearPausedKeepAwakeTimer();
      const active =
        next &&
        next.viewState !== 'closed' &&
        (next.lifecycle === 'running' ||
          next.lifecycle === 'lead_in' ||
          next.lifecycle === 'ready');
      if (active) {
        void activateGymTimerKeepAwake();
        return;
      }
      if (next?.lifecycle === 'paused') {
        void activateGymTimerKeepAwake();
        pausedKeepAwakeTimer.current = setTimeout(() => {
          void deactivateGymTimerKeepAwake();
        }, PAUSED_KEEP_AWAKE_TIMEOUT_MS);
        return;
      }
      void deactivateGymTimerKeepAwake();
    },
    [clearPausedKeepAwakeTimer]
  );

  useEffect(() => {
    syncKeepAwake(runtime);
  }, [runtime, syncKeepAwake]);

  // Live Activity / Android ongoing notification for countdown segments.
  useEffect(() => {
    if (!runtime || runtime.viewState === 'closed') {
      void endRestTimerSurface();
      return;
    }
    if (runtime.lifecycle === 'paused' || runtime.lifecycle === 'ready') {
      void endRestTimerSurface();
      return;
    }
    const payload = buildGymTimerSurfacePayload(runtime);
    if (!payload) {
      void endRestTimerSurface();
      return;
    }
    if (payload.status === 'complete') {
      void endRestTimerSurface(payload);
      return;
    }
    void syncRestTimerSurface(payload);
  }, [runtime]);

  // Only touch orientation while a gym timer overlay is open. Calling
  // lockAsync on every cold start races ScreenOrientationRegistry and can
  // crash; app.json already defaults to portrait.
  useEffect(() => {
    if (!runtime || runtime.viewState !== 'open') {
      return;
    }
    void ScreenOrientation.lockAsync(
      forceLandscape
        ? ScreenOrientation.OrientationLock.LANDSCAPE
        : ScreenOrientation.OrientationLock.PORTRAIT_UP
    ).catch(() => {
      // A portrait-only binary cannot rotate. The clock paints landscape
      // itself when the window stays portrait.
    });
  }, [runtime?.viewState, forceLandscape]);

  useEffect(() => {
    if (!runtime || runtime.viewState !== 'open') {
      return;
    }
    return () => {
      void ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      ).catch(() => {
        // Ignore. The overlay is already gone.
      });
    };
  }, [runtime?.viewState]);

  useEffect(() => {
    if (runtime && runtime.viewState !== 'closed') return;
    setForceLandscape(false);
  }, [runtime]);

  const handleSegmentCross = useCallback(
    async (next: GymTimerRuntime, finished: boolean) => {
      const segment = next.segments[next.segmentIndex];
      if (finished) {
        await playGymTimerBeep('finish', next.muted);
        await gymTimerHapticPhaseChange();
        await cancelGymTimerFinishNotification();
        return;
      }
      if (!segment) return;
      if (segment.phase === 'REST') {
        await playGymTimerBeep('rest', next.muted);
      } else if (segment.phase === 'WORK') {
        await playGymTimerBeep('work', next.muted);
      }
      await gymTimerHapticPhaseChange();
      lastBeepSecRef.current = null;
    },
    []
  );

  // Tick loop + 3-2-1 beeps
  useEffect(() => {
    const lifecycle = runtime?.lifecycle;
    if (lifecycle !== 'running' && lifecycle !== 'lead_in') {
      return;
    }
    const id = setInterval(() => {
      const current = runtimeRef.current;
      if (!current) return;
      if (current.lifecycle !== 'running' && current.lifecycle !== 'lead_in') {
        return;
      }
      const display = getDisplay(current);
      const remaining = display.remainingSecInSegment;
      if (
        remaining !== null &&
        remaining <= 3 &&
        remaining >= 1 &&
        lastBeepSecRef.current !== remaining
      ) {
        lastBeepSecRef.current = remaining;
        void playGymTimerBeep('tick', current.muted);
      }
      const {
        runtime: advanced,
        crossedSegment,
        finished,
      } = advanceRuntime(current);
      if (crossedSegment || finished) {
        applyRuntime(advanced);
        void handleSegmentCross(advanced, finished);
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [runtime?.lifecycle, applyRuntime, handleSegmentCross]);

  // AppState recompute + finish notification while backgrounded
  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      const current = runtimeRef.current;
      if (!current) return;
      if (state === 'active') {
        void cancelGymTimerFinishNotification();
        const {
          runtime: advanced,
          crossedSegment,
          finished,
        } = advanceRuntime(current);
        if (crossedSegment || finished || advanced !== current) {
          applyRuntime(advanced);
          if (crossedSegment || finished) {
            void handleSegmentCross(advanced, finished);
          }
        }
        return;
      }
      if (state === 'background' || state === 'inactive') {
        const display = getDisplay(current);
        if (
          display.remainingSecInSegment !== null &&
          display.remainingSecInSegment > 0 &&
          (current.lifecycle === 'running' || current.lifecycle === 'lead_in')
        ) {
          void scheduleGymTimerFinishNotification(
            display.remainingSecInSegment
          );
        }
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => sub.remove();
  }, [applyRuntime, handleSegmentCross]);

  const launchReady = useCallback(
    async (config: GymTimerConfig, autoBegin: boolean) => {
      // Strength-rest launches skip dismissing when replacing ourselves; always
      // clear the legacy rest timer / Live Activity so only one clock runs.
      if (config.source?.kind !== 'strength_rest') {
        await dismissProgramRestTimer();
      } else {
        await dismissProgramRestTimer();
      }
      let next = createReadyRuntime(config, settings);
      lastBeepSecRef.current = null;
      if (autoBegin) {
        next = startRuntime(next);
        const segment = next.segments[0];
        if (segment?.phase === 'LEAD_IN') {
          void playGymTimerBeep('tick', next.muted);
        } else if (segment?.phase === 'WORK') {
          void playGymTimerBeep('work', next.muted);
        }
      }
      // Between-set rest stays as the floating blob so the program screen stays usable.
      if (config.source?.kind === 'strength_rest') {
        next = { ...next, viewState: 'minimised' };
      }
      applyRuntime(next);
    },
    [applyRuntime, settings]
  );

  const startGymTimer = useCallback(
    (config: GymTimerConfig) => {
      const current = runtimeRef.current;
      const busy =
        current &&
        current.viewState !== 'closed' &&
        current.lifecycle !== 'done' &&
        current.lifecycle !== 'ready';

      if (busy) {
        Alert.alert(
          'Replace current timer?',
          'A gym timer is already running.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Replace',
              style: 'destructive',
              onPress: () => {
                void launchReady(config, false);
              },
            },
          ]
        );
        return;
      }
      void launchReady(config, false);
    },
    [launchReady]
  );

  const startAndBeginGymTimer = useCallback(
    (config: GymTimerConfig) => {
      const current = runtimeRef.current;
      const busy =
        current &&
        current.viewState !== 'closed' &&
        current.lifecycle !== 'done' &&
        current.lifecycle !== 'ready';
      if (busy && config.source?.kind !== 'strength_rest') {
        Alert.alert(
          'Replace current timer?',
          'A gym timer is already running.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Replace',
              style: 'destructive',
              onPress: () => {
                void launchReady(config, true);
              },
            },
          ]
        );
        return;
      }
      void launchReady(config, true);
    },
    [launchReady]
  );

  const begin = useCallback(() => {
    const current = runtimeRef.current;
    if (!current || current.lifecycle !== 'ready') return;
    const next = startRuntime(current);
    applyRuntime(next);
    const segment = next.segments[0];
    if (segment?.phase === 'LEAD_IN') {
      void playGymTimerBeep('tick', next.muted);
    } else if (segment?.phase === 'WORK') {
      void playGymTimerBeep('work', next.muted);
    }
  }, [applyRuntime]);

  const pause = useCallback(() => {
    const current = runtimeRef.current;
    if (!current) return;
    applyRuntime(pauseRuntime(current));
    void cancelGymTimerFinishNotification();
  }, [applyRuntime]);

  const resume = useCallback(() => {
    const current = runtimeRef.current;
    if (!current) return;
    applyRuntime(resumeRuntime(current));
  }, [applyRuntime]);

  const reset = useCallback(() => {
    const current = runtimeRef.current;
    if (!current) return;
    Alert.alert('Reset timer?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          const next = createReadyRuntime(current.config, settings);
          lastBeepSecRef.current = null;
          applyRuntime(next);
          void cancelGymTimerFinishNotification();
        },
      },
    ]);
  }, [applyRuntime, settings]);

  const close = useCallback(() => {
    lastBeepSecRef.current = null;
    applyRuntime(null);
    void cancelGymTimerFinishNotification();
    void deactivateGymTimerKeepAwake();
  }, [applyRuntime]);

  const minimise = useCallback(() => {
    const current = runtimeRef.current;
    if (!current) return;
    applyRuntime({ ...current, viewState: 'minimised' });
  }, [applyRuntime]);

  const expand = useCallback(() => {
    const current = runtimeRef.current;
    if (!current) return;
    applyRuntime({ ...current, viewState: 'open' });
  }, [applyRuntime]);

  const bumpRound = useCallback(() => {
    const current = runtimeRef.current;
    if (!current) return;
    if (current.config.type !== 'AMRAP' && current.config.type !== 'FOR_TIME') {
      return;
    }
    applyRuntime({
      ...current,
      completedRounds: current.completedRounds + 1,
    });
    void gymTimerHapticPhaseChange();
  }, [applyRuntime]);

  const advanceOpenSegment = useCallback(() => {
    const current = runtimeRef.current;
    if (!current) return;
    const segment = current.segments[current.segmentIndex];
    if (!segment?.openEnded) return;
    const next = nextSegment(current);
    applyRuntime(next);
    void handleSegmentCross(next, next.lifecycle === 'done');
  }, [applyRuntime, handleSegmentCross]);

  const setMuted = useCallback(
    (muted: boolean) => {
      const current = runtimeRef.current;
      if (!current) return;
      applyRuntime({ ...current, muted });
    },
    [applyRuntime]
  );

  const updateSettings = useCallback(async (next: GymTimerSettings) => {
    setSettings(next);
    await setGymTimerSettings(next);
  }, []);

  const refreshPresets = useCallback(async () => {
    setPresets(await getGymTimerPresets());
  }, []);

  const savePreset = useCallback(async (config: GymTimerConfig) => {
    const now = Date.now();
    const preset: GymTimerPreset = {
      id: `preset_${now}`,
      createdAt: now,
      updatedAt: now,
      config: {
        ...config,
        source: { kind: 'preset' },
      },
    };
    const next = [preset, ...(await getGymTimerPresets())];
    await saveGymTimerPresets(next);
    setPresets(next);
  }, []);

  const deletePreset = useCallback(async (id: string) => {
    const next = (await getGymTimerPresets()).filter((p) => p.id !== id);
    await saveGymTimerPresets(next);
    setPresets(next);
  }, []);

  useEffect(() => {
    registerStrengthRestStarter((durationSec) => {
      startAndBeginGymTimer({
        v: 1,
        leadInSec: 0,
        name: 'Rest',
        source: { kind: 'strength_rest' },
        type: 'REST',
        config: { durationSec },
      });
    });
    return () => registerStrengthRestStarter(null);
  }, [startAndBeginGymTimer]);

  const value = useMemo<GymTimerContextValue>(
    () => ({
      runtime,
      settings,
      presets,
      startGymTimer,
      startAndBeginGymTimer,
      begin,
      pause,
      resume,
      reset,
      close,
      minimise,
      expand,
      bumpRound,
      advanceOpenSegment,
      setMuted,
      forceLandscape,
      setForceLandscape,
      updateSettings,
      savePreset,
      deletePreset,
      refreshPresets,
    }),
    [
      runtime,
      settings,
      presets,
      startGymTimer,
      startAndBeginGymTimer,
      begin,
      pause,
      resume,
      reset,
      close,
      minimise,
      expand,
      bumpRound,
      advanceOpenSegment,
      setMuted,
      forceLandscape,
      setForceLandscape,
      updateSettings,
      savePreset,
      deletePreset,
      refreshPresets,
    ]
  );

  return (
    <GymTimerContext.Provider value={value}>
      {children}
      <GymTimerOverlay />
      <GymTimerBlob />
    </GymTimerContext.Provider>
  );
}

export function useGymTimer(): GymTimerContextValue {
  const ctx = useContext(GymTimerContext);
  if (!ctx) {
    throw new Error('useGymTimer must be used within GymTimerProvider');
  }
  return ctx;
}
