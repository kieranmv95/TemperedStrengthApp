import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { workoutTimerBarStyles as styles } from './workoutTimerBarStyles';

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
    <View style={styles.bar}>
      <View
        style={styles.timerSection}
        accessible
        accessibilityLabel={`Session time ${formatElapsed(elapsed)}`}
      >
        <View style={styles.dot} />
        <Text style={styles.timerText}>Session</Text>
        <Text style={styles.timerValue}>{formatElapsed(elapsed)}</Text>
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.finishButton,
          pressed && styles.finishButtonPressed,
        ]}
        onPress={onFinish}
        accessibilityRole="button"
        accessibilityLabel="Finish session"
      >
        <Text style={styles.finishButtonText}>Finish</Text>
      </Pressable>
    </View>
  );
};
