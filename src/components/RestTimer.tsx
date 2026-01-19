import React, { useEffect, useMemo, useRef, useState } from "react";
import { AppState, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { RestTimerState } from "../utils/storage";

interface RestTimerProps {
  timer: RestTimerState;
  onDismiss: () => void;
  onComplete: () => void;
}

const formatDuration = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const RestTimer: React.FC<RestTimerProps> = ({
  timer,
  onDismiss,
  onComplete,
}) => {
  const [now, setNow] = useState(Date.now());
  const completedRef = useRef(false);
  const isRunning = timer.status === "running";

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
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        setNow(Date.now());
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Rest Timer</Text>
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <Text style={styles.dismissText}>{isRunning ? "Skip" : "Dismiss"}</Text>
        </TouchableOpacity>
      </View>
      {isRunning ? (
        <Text style={styles.timerText}>{formatDuration(remainingSeconds)}</Text>
      ) : (
        <Text style={styles.completeText}>Rest complete</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dismissButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#333",
  },
  dismissText: {
    color: "#CCC",
    fontSize: 12,
    fontWeight: "600",
  },
  timerText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  completeText: {
    color: "#c9b072",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
