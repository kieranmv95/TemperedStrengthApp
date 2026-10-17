import { ProgressRing } from '@/src/components/ds';
import { color } from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  AppState,
  Pressable,
  Text,
  View,
} from 'react-native';
import type { RestTimerState } from '../types/storage';
import {
  TIMER_RING_SIZE,
  workoutTimerBarStyles as styles,
} from './workoutTimerBarStyles';

type RestTimerProps = {
  timer: RestTimerState;
  onDismiss: () => void;
  onComplete: () => void;
  onRestart: () => void;
  onAdjust: (deltaSeconds: number) => void;
};

/** A timer started this recently is announced; older ones are being restored on return. */
const FRESH_START_WINDOW_MS = 2000;

const formatDuration = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}`;
};

export const RestTimer: React.FC<RestTimerProps> = ({
  timer,
  onDismiss,
  onComplete,
  onRestart,
  onAdjust,
}) => {
  const [now, setNow] = useState(Date.now());
  const completedRef = useRef(false);
  const isRunning = timer.status === 'running';

  const remainingSeconds = useMemo(() => {
    const endTime = timer.startedAt + timer.restTimeSeconds * 1000;
    const remaining = Math.ceil((endTime - now) / 1000);
    return Math.max(0, remaining);
  }, [timer.startedAt, timer.restTimeSeconds, now]);

  useEffect(() => {
    setNow(Date.now());
    completedRef.current = false;
  }, [timer.startedAt, timer.status]);

  useEffect(() => {
    if (!isRunning) return;
    if (Date.now() - timer.startedAt < FRESH_START_WINDOW_MS) {
      AccessibilityInfo.announceForAccessibility(
        `Rest timer started, ${timer.restTimeSeconds} seconds`
      );
    }
  }, [isRunning, timer.startedAt, timer.restTimeSeconds]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || remainingSeconds > 0 || completedRef.current) {
      return;
    }
    completedRef.current = true;
    AccessibilityInfo.announceForAccessibility('Rest complete');
    onComplete();
  }, [isRunning, remainingSeconds, onComplete]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setNow(Date.now());
      }
    });
    return () => subscription.remove();
  }, []);

  const remainingFraction =
    isRunning && timer.restTimeSeconds > 0
      ? remainingSeconds / timer.restTimeSeconds
      : 0;

  return (
    <View style={styles.bar}>
      <View style={styles.timerSection}>
        <ProgressRing
          progress={isRunning ? remainingFraction : 1}
          size={TIMER_RING_SIZE}
          strokeWidth={4}
          tone={isRunning ? 'gold' : 'success'}
          accessibilityLabel="Rest timer"
          accessibilityValueText={
            isRunning
              ? `${remainingSeconds} seconds remaining`
              : 'Rest complete'
          }
        />
        {isRunning ? (
          <View style={styles.timerStack}>
            <Text style={styles.timerCaption}>Rest</Text>
            <Text style={styles.timerValue}>
              {formatDuration(remainingSeconds)}
            </Text>
          </View>
        ) : (
          <Text style={[styles.timerText, styles.timerTextComplete]}>
            Rest Complete
          </Text>
        )}
      </View>
      <View style={styles.iconButtonGroup}>
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={onRestart}
          accessibilityRole="button"
          accessibilityLabel="Restart rest timer"
          testID="rest-timer-restart"
        >
          <Ionicons name="refresh" size={20} color={color.textPrimary} />
        </Pressable>
        {isRunning && (
          <>
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed,
              ]}
              onPress={() => onAdjust(-15)}
              accessibilityRole="button"
              accessibilityLabel="Subtract 15 seconds from rest timer"
              testID="rest-timer-minus-15"
            >
              <Text style={styles.adjustButtonText}>−15</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed,
              ]}
              onPress={() => onAdjust(15)}
              accessibilityRole="button"
              accessibilityLabel="Add 15 seconds to rest timer"
              testID="rest-timer-plus-15"
            >
              <Text style={styles.adjustButtonText}>+15</Text>
            </Pressable>
          </>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={
            isRunning ? 'Skip rest timer' : 'Dismiss rest timer'
          }
          testID="rest-timer-dismiss"
        >
          <Ionicons name="close" size={20} color={color.textPrimary} />
        </Pressable>
      </View>
    </View>
  );
};
