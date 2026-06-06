import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { RecoveryDose } from '@/src/types/recovery';
import {
  formatCountdownSeconds,
  getRecoveryTimerSteps,
  isTimeBasedRecoveryDose,
} from '@/src/utils/recoveryTimer';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RecoveryBlockTimerProps = {
  dose: RecoveryDose;
};

export function RecoveryBlockTimer({ dose }: RecoveryBlockTimerProps) {
  const steps = useMemo(
    () => (isTimeBasedRecoveryDose(dose) ? getRecoveryTimerSteps(dose) : []),
    [dose]
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [finished, setFinished] = useState(false);
  const advancingRef = useRef(false);

  const isRunning = endTime !== null && !finished;

  const remainingSeconds = useMemo(() => {
    if (endTime === null) return null;
    return Math.max(0, Math.ceil((endTime - now) / 1000));
  }, [endTime, now]);

  const currentStep = steps[stepIndex];

  const reset = useCallback(() => {
    setStepIndex(0);
    setEndTime(null);
    setFinished(false);
    setNow(Date.now());
    advancingRef.current = false;
  }, []);

  useEffect(() => {
    reset();
  }, [steps, reset]);

  const start = () => {
    if (steps.length === 0) return;
    advancingRef.current = false;
    setStepIndex(0);
    setFinished(false);
    setEndTime(Date.now() + steps[0].seconds * 1000);
    setNow(Date.now());
  };

  const stop = () => {
    reset();
  };

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setNow(Date.now());
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!isRunning || remainingSeconds === null || remainingSeconds > 0) {
      return;
    }
    if (advancingRef.current) return;
    advancingRef.current = true;

    if (stepIndex < steps.length - 1) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      setEndTime(Date.now() + steps[nextIndex].seconds * 1000);
      setNow(Date.now());
      advancingRef.current = false;
      return;
    }

    setEndTime(null);
    setFinished(true);
    advancingRef.current = false;
  }, [isRunning, remainingSeconds, stepIndex, steps]);

  if (steps.length === 0) {
    return null;
  }

  return (
    <View style={timerStyles.container}>
      {isRunning && remainingSeconds !== null ? (
        <>
          {currentStep?.label ? (
            <Text style={timerStyles.stepLabel}>{currentStep.label}</Text>
          ) : null}
          <Text style={timerStyles.countdown}>
            {formatCountdownSeconds(remainingSeconds)}
          </Text>
          {steps.length > 1 ? (
            <Text style={timerStyles.stepProgress}>
              {stepIndex + 1} / {steps.length}
            </Text>
          ) : null}
          <TouchableOpacity
            style={timerStyles.secondaryButton}
            onPress={stop}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Stop timer"
          >
            <Text style={timerStyles.secondaryButtonText}>Stop</Text>
          </TouchableOpacity>
        </>
      ) : finished ? (
        <>
          <Text style={timerStyles.completeText}>Time&apos;s up</Text>
          <TouchableOpacity
            style={timerStyles.secondaryButton}
            onPress={start}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Restart timer"
          >
            <Ionicons name="refresh" size={18} color={Colors.textPrimary} />
            <Text style={timerStyles.secondaryButtonText}>Restart timer</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={timerStyles.startButton}
          onPress={start}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Start timer"
        >
          <Ionicons name="play" size={18} color={Colors.textOnAccent} />
          <Text style={timerStyles.startButtonText}>Start timer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const timerStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.backgroundElevated,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  startButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.base,
    fontWeight: '700',
  },
  countdown: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXXl,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  stepLabel: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
  stepProgress: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  completeText: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  secondaryButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
