import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/theme';
import type { RestTimerState } from '../types/storage';
import { workoutTimerBarStyles } from './workoutTimerBarStyles';

type RestTimerProps = {
  timer: RestTimerState;
  onDismiss: () => void;
  onComplete: () => void;
  onRestart: () => void;
  onAdjust: (deltaSeconds: number) => void;
};

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
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || remainingSeconds > 0 || completedRef.current) {
      return;
    }
    completedRef.current = true;
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

  return (
    <View style={workoutTimerBarStyles.bar}>
      <View style={workoutTimerBarStyles.timerSection}>
        <View style={workoutTimerBarStyles.dot} />
        {isRunning ? (
          <Text style={workoutTimerBarStyles.timerText}>
            Rest: {formatDuration(remainingSeconds)}
          </Text>
        ) : (
          <Text style={workoutTimerBarStyles.timerText}>Rest Complete</Text>
        )}
      </View>
      <View style={workoutTimerBarStyles.iconButtonGroup}>
        <TouchableOpacity
          style={[workoutTimerBarStyles.iconButton, workoutTimerBarStyles.buttonSize]}
          onPress={onRestart}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Restart rest timer"
          testID="rest-timer-restart"
        >
          <Ionicons name="refresh" size={20} color={Colors.textOnAccent} />
        </TouchableOpacity>
        {isRunning && (
          <>
            <TouchableOpacity
              style={[workoutTimerBarStyles.adjustButton, workoutTimerBarStyles.buttonSize]}
              onPress={() => onAdjust(-15)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Subtract 15 seconds from rest timer"
              testID="rest-timer-minus-15"
            >
              <Text style={workoutTimerBarStyles.adjustButtonText}>-15</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[workoutTimerBarStyles.adjustButton, workoutTimerBarStyles.buttonSize]}
              onPress={() => onAdjust(15)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Add 15 seconds to rest timer"
              testID="rest-timer-plus-15"
            >
              <Text style={workoutTimerBarStyles.adjustButtonText}>+15</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={[workoutTimerBarStyles.iconButton, workoutTimerBarStyles.buttonSize]}
          onPress={onDismiss}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={
            isRunning ? 'Skip rest timer' : 'Dismiss rest timer'
          }
          testID="rest-timer-dismiss"
        >
          <Ionicons name="close" size={20} color={Colors.textOnAccent} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
