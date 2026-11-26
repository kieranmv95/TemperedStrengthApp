import { gymClock } from '@/src/constants/gymClock';
import { useGymTimer } from '@/src/hooks/gym-timer-context';
import {
  formatGymTimerDigits,
  getDisplay,
  modeLabel,
} from '@/src/utils/gymTimer';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { phaseColor, phaseWord } from './gymTimerLabels';
import { SevenSegmentDigits } from './SevenSegmentDigits';

const CONTROLS_HIDE_MS = 3000;

export function GymTimerOverlay() {
  const {
    runtime,
    begin,
    pause,
    resume,
    reset,
    close,
    minimise,
    bumpRound,
    advanceOpenSegment,
    setMuted,
    forceLandscape,
    setForceLandscape,
  } = useGymTimer();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const windowLandscape = width > height;
  const needsPaintedLandscape = forceLandscape && !windowLandscape;
  const [paintedLandscape, setPaintedLandscape] = useState(false);
  const [prevNeedsPaintedLandscape, setPrevNeedsPaintedLandscape] =
    useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [now, setNow] = useState(0);

  // The app stays portrait. Ask the OS to rotate, and if it cannot (portrait
  // lock in the installed binary), turn the clock view itself after a beat.
  if (needsPaintedLandscape !== prevNeedsPaintedLandscape) {
    setPrevNeedsPaintedLandscape(needsPaintedLandscape);
    setPaintedLandscape(false);
  }

  useEffect(() => {
    if (!needsPaintedLandscape) return;
    const id = setTimeout(() => setPaintedLandscape(true), 400);
    return () => clearTimeout(id);
  }, [needsPaintedLandscape]);

  useEffect(() => {
    if (!runtime || runtime.viewState !== 'open') return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [runtime]);

  useEffect(() => {
    if (!controlsVisible || !runtime || runtime.viewState !== 'open') return;
    const id = setTimeout(() => setControlsVisible(false), CONTROLS_HIDE_MS);
    return () => clearTimeout(id);
  }, [controlsVisible, runtime]);

  if (!runtime || runtime.viewState !== 'open') {
    return null;
  }

  const display = getDisplay(runtime, now);
  const digitColor = phaseColor(runtime.config.type, display.segment?.phase);
  const digits = formatGymTimerDigits(display.displaySec);
  const colonBlink =
    (runtime.lifecycle === 'running' || runtime.lifecycle === 'lead_in') &&
    Math.floor(now / 1000) % 2 === 0;
  const showRounds =
    display.segment?.totalRounds &&
    display.segment.totalRounds > 1 &&
    display.segment.round;
  const showBump =
    runtime.config.type === 'AMRAP' || runtime.config.type === 'FOR_TIME';
  const showNext = display.segment?.openEnded === true;

  const renderedDigits = colonBlink ? digits.replace(':', ' ') : digits;
  const landscape = windowLandscape || paintedLandscape;
  const frameStyle = paintedLandscape
    ? {
        position: 'absolute' as const,
        width: height,
        height: width,
        top: (height - width) / 2,
        left: (width - height) / 2,
        transform: [{ rotate: '90deg' as const }],
        paddingLeft: Math.max(insets.top, 16),
        paddingRight: Math.max(insets.bottom, 16),
        paddingTop: Math.max(insets.right, 16),
        paddingBottom: Math.max(insets.left, 16),
      }
    : [styles.fill, { paddingTop: insets.top, paddingBottom: insets.bottom }];

  return (
    <View style={styles.backdrop} accessibilityViewIsModal>
      {paintedLandscape ? <StatusBar hidden /> : null}
      <View style={[styles.root, frameStyle]}>
        <Pressable
          style={styles.flex}
          onPress={() => setControlsVisible(true)}
          accessibilityLabel="Gym timer"
        >
          <View style={[styles.row, landscape && styles.rowLandscape]}>
            <View style={styles.center}>
              <Text style={styles.mode}>{modeLabel(runtime.config.type)}</Text>
              {showRounds ? (
                <Text style={styles.round}>
                  R {display.segment?.round}/{display.segment?.totalRounds}
                </Text>
              ) : null}
              {showBump && runtime.lifecycle !== 'ready' ? (
                <Text style={styles.round}>
                  Rounds {runtime.completedRounds}
                </Text>
              ) : null}
              <SevenSegmentDigits
                value={renderedDigits}
                color={digitColor}
                fontSize={landscape ? 96 : 88}
                paused={runtime.lifecycle === 'paused'}
                accessibilityLabel={digits}
              />
              <Text style={[styles.phase, { color: digitColor }]}>
                {runtime.lifecycle === 'ready'
                  ? 'READY'
                  : runtime.lifecycle === 'done'
                    ? 'DONE'
                    : runtime.lifecycle === 'paused'
                      ? 'PAUSED'
                      : phaseWord(display.segment?.phase)}
              </Text>
              {runtime.config.name ? (
                <Text style={styles.name} numberOfLines={1}>
                  {runtime.config.name}
                </Text>
              ) : null}
            </View>
            <View style={styles.icons}>
              <Pressable
                onPress={() => setMuted(!runtime.muted)}
                hitSlop={12}
                accessibilityLabel={runtime.muted ? 'Unmute' : 'Mute'}
              >
                <Ionicons
                  name={runtime.muted ? 'volume-mute' : 'volume-high'}
                  size={22}
                  color={gymClock.controlsStrong}
                />
              </Pressable>
            </View>
          </View>
        </Pressable>

        {controlsVisible ? (
          <View
            style={[
              styles.controls,
              {
                paddingBottom: paintedLandscape
                  ? 16
                  : Math.max(insets.bottom, 16),
              },
            ]}
          >
            {runtime.lifecycle === 'ready' ? (
              <ControlButton label="Start" onPress={begin} primary />
            ) : null}
            {runtime.lifecycle === 'running' ||
            runtime.lifecycle === 'lead_in' ? (
              <ControlButton label="Pause" onPress={pause} />
            ) : null}
            {runtime.lifecycle === 'paused' ? (
              <ControlButton label="Resume" onPress={resume} primary />
            ) : null}
            {showNext &&
            (runtime.lifecycle === 'running' ||
              runtime.lifecycle === 'paused') ? (
              <ControlButton
                label="Next"
                onPress={advanceOpenSegment}
                primary
              />
            ) : null}
            {showBump &&
            (runtime.lifecycle === 'running' ||
              runtime.lifecycle === 'paused') ? (
              <ControlButton label="+ Round" onPress={bumpRound} />
            ) : null}
            {runtime.lifecycle === 'done' ? (
              <ControlButton label="Restart" onPress={reset} primary />
            ) : null}
            {runtime.lifecycle !== 'ready' ? (
              <ControlButton label="Reset" onPress={reset} />
            ) : null}
            <ControlButton
              label={forceLandscape ? 'Portrait' : 'Landscape'}
              onPress={() => setForceLandscape(!forceLandscape)}
            />
            <ControlButton label="Minimise" onPress={minimise} />
            <ControlButton label="Close" onPress={close} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

function ControlButton({
  label,
  onPress,
  primary,
}: {
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.controlBtn, primary && styles.controlBtnPrimary]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text
        style={[styles.controlLabel, primary && styles.controlLabelPrimary]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: gymClock.panel,
    zIndex: 1000,
  },
  root: {
    backgroundColor: gymClock.panel,
  },
  fill: { flex: 1 },
  flex: { flex: 1 },
  row: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 12,
  },
  rowLandscape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mode: {
    fontSize: 28,
    fontWeight: '800',
    color: gymClock.mode,
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  round: {
    color: gymClock.round,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  phase: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 3,
  },
  name: {
    marginTop: 8,
    color: gymClock.controls,
    fontSize: 14,
  },
  icons: {
    alignItems: 'flex-end',
    gap: 12,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  controlBtn: {
    minWidth: 88,
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: gymClock.controls,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnPrimary: {
    backgroundColor: gymClock.work,
    borderColor: gymClock.work,
  },
  controlLabel: {
    color: gymClock.controlsStrong,
    fontWeight: '700',
    fontSize: 15,
  },
  controlLabelPrimary: {
    color: '#04140A',
  },
});
