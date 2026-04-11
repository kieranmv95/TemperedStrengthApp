import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { workoutTimerBarStyles } from './workoutTimerBarStyles';

type SessionTimerProps = {
  startedAt: number;
  onFinish: () => void;
};

const formatElapsed = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
};

export const SessionTimer: React.FC<SessionTimerProps> = ({
  startedAt,
  onFinish,
}) => {
  const [elapsed, setElapsed] = useState(() => Date.now() - startedAt);

  useEffect(() => {
    setElapsed(Date.now() - startedAt);
    const interval = setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  return (
    <View style={workoutTimerBarStyles.bar}>
      <View style={workoutTimerBarStyles.timerSection}>
        <View style={workoutTimerBarStyles.dot} />
        <Text style={workoutTimerBarStyles.timerText}>
          {formatElapsed(elapsed)}
        </Text>
      </View>
      <TouchableOpacity
        style={workoutTimerBarStyles.finishButton}
        onPress={onFinish}
        activeOpacity={0.7}
      >
        <Text style={workoutTimerBarStyles.finishButtonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
};
