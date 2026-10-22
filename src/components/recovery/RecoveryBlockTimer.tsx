import { ProgressRing } from '@/src/components/ds';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { useLargeText } from '@/src/hooks/useLargeText';
import type { RecoveryDose } from '@/src/types/recovery';
import {
  formatCountdownSeconds,
  getRecoveryTimerSteps,
  isTimeBasedRecoveryDose,
  type RecoveryTimerStep,
} from '@/src/utils/recoveryTimer';
import { Ionicons } from '@expo/vector-icons';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  AppState,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const TIMER_RING_SIZE = 168;
const TIMER_RING_STROKE = 6;

type RecoveryBlockTimerProps = {
  dose: RecoveryDose;
};

function describeStep(step: RecoveryTimerStep): string {
  return step.label
    ? `${step.label}, ${step.seconds} seconds`
    : `${step.seconds} seconds`;
}

export function RecoveryBlockTimer({ dose }: RecoveryBlockTimerProps) {
  const largeText = useLargeText();
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
    AccessibilityInfo.announceForAccessibility(
      `Timer started, ${describeStep(steps[0])}`
    );
  };

  const stop = () => {
    reset();
    AccessibilityInfo.announceForAccessibility('Timer stopped');
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
      AccessibilityInfo.announceForAccessibility(
        `Next, ${describeStep(steps[nextIndex])}`
      );
      return;
    }

    setEndTime(null);
    setFinished(true);
    advancingRef.current = false;
    AccessibilityInfo.announceForAccessibility("Time's up");
  }, [isRunning, remainingSeconds, stepIndex, steps]);

  if (steps.length === 0) {
    return null;
  }

  const remainingFraction =
    currentStep && currentStep.seconds > 0 && remainingSeconds !== null
      ? remainingSeconds / currentStep.seconds
      : 0;

  return (
    <View
      style={[
        timerStyles.container,
        isRunning ? timerStyles.containerActive : timerStyles.containerIdle,
      ]}
    >
      {isRunning && remainingSeconds !== null ? (
        <>
          {currentStep?.label ? (
            <Text style={timerStyles.stepLabel}>{currentStep.label}</Text>
          ) : null}
          <ProgressRing
            progress={remainingFraction}
            size={TIMER_RING_SIZE}
            strokeWidth={TIMER_RING_STROKE}
            accessibilityLabel={
              currentStep?.label ? `${currentStep.label} timer` : 'Timer'
            }
            accessibilityValueText={`${remainingSeconds} seconds remaining`}
          >
            {largeText ? null : (
              <Text style={timerStyles.countdown}>
                {formatCountdownSeconds(remainingSeconds)}
              </Text>
            )}
          </ProgressRing>
          {largeText ? (
            <Text
              style={timerStyles.countdown}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              {formatCountdownSeconds(remainingSeconds)}
            </Text>
          ) : null}
          {steps.length > 1 ? (
            <Text style={timerStyles.stepProgress}>
              Step {stepIndex + 1} of {steps.length}
            </Text>
          ) : null}
          <Pressable
            style={({ pressed }) => [
              timerStyles.secondaryButton,
              pressed && timerStyles.secondaryButtonPressed,
            ]}
            onPress={stop}
            accessibilityRole="button"
            accessibilityLabel="Stop timer"
          >
            <Ionicons name="stop" size={16} color={color.textPrimary} />
            <Text style={timerStyles.secondaryButtonText}>Stop</Text>
          </Pressable>
        </>
      ) : finished ? (
        <>
          <View style={timerStyles.completeRow}>
            <Ionicons name="checkmark-circle" size={22} color={color.success} />
            <Text style={timerStyles.completeText}>Time&apos;s up</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              timerStyles.secondaryButton,
              pressed && timerStyles.secondaryButtonPressed,
            ]}
            onPress={start}
            accessibilityRole="button"
            accessibilityLabel="Restart timer"
          >
            <Ionicons name="refresh" size={18} color={color.textPrimary} />
            <Text style={timerStyles.secondaryButtonText}>Restart timer</Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          style={({ pressed }) => [
            timerStyles.startButton,
            pressed && timerStyles.startButtonPressed,
          ]}
          onPress={start}
          accessibilityRole="button"
          accessibilityLabel="Start timer"
        >
          <Ionicons name="play" size={18} color={color.onGold} />
          <Text style={timerStyles.startButtonText}>Start timer</Text>
        </Pressable>
      )}
    </View>
  );
}

const timerStyles = StyleSheet.create({
  container: {
    gap: space.sm,
  },
  containerActive: {
    alignItems: 'center',
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface2,
  },
  containerIdle: {
    alignItems: 'flex-start',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  startButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  startButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  countdown: {
    ...typography.numericLarge,
    color: color.textPrimary,
  },
  stepLabel: {
    ...typography.headline,
    color: color.textPrimary,
    textAlign: 'center',
  },
  stepProgress: {
    ...typography.caption,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  completeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  completeText: {
    ...typography.headline,
    color: color.textPrimary,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  secondaryButtonPressed: {
    backgroundColor: color.surface3,
  },
  secondaryButtonText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
});
