/* PanResponder stores gesture state in refs and exposes handlers that must be
 * spread during render — the RN API. The React Compiler refs rule rejects that. */
/* eslint-disable react-hooks/refs */
import { gymClockFont } from '@/src/constants/gymClock';
import { useGymTimer } from '@/src/hooks/gym-timer-context';
import {
  formatGymTimerDigits,
  getDisplay,
} from '@/src/utils/gymTimer';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { phaseColor } from './gymTimerLabels';

const BLOB_SIZE = 88;
const TAB_BAR_GUARD = 72;

type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
};

export function GymTimerBlob() {
  const { runtime, expand, pause, resume } = useGymTimer();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [now, setNow] = useState(0);

  const minX = 8;
  const maxX = Math.max(minX, width - BLOB_SIZE - 8);
  const minY = insets.top + 8;
  const maxY = Math.max(
    minY,
    height - BLOB_SIZE - Math.max(insets.bottom, 8) - TAB_BAR_GUARD
  );

  const [position, setPosition] = useState({ x: maxX, y: maxY });
  const dragOrigin = useRef({ x: maxX, y: maxY });
  const positionRef = useRef(position);
  const boundsRef = useRef<Bounds>({ minX, maxX, minY, maxY, width });

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    boundsRef.current = { minX, maxX, minY, maxY, width };
  }, [minX, maxX, minY, maxY, width]);

  useEffect(() => {
    if (!runtime || runtime.viewState !== 'minimised') return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [runtime]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_e, gesture) =>
        Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4,
      onPanResponderGrant: () => {
        dragOrigin.current = { ...positionRef.current };
      },
      onPanResponderMove: (_e, gesture) => {
        const b = boundsRef.current;
        const origin = dragOrigin.current;
        setPosition({
          x: Math.min(b.maxX, Math.max(b.minX, origin.x + gesture.dx)),
          y: Math.min(b.maxY, Math.max(b.minY, origin.y + gesture.dy)),
        });
      },
      onPanResponderRelease: (_e, gesture) => {
        const b = boundsRef.current;
        const origin = dragOrigin.current;
        const nextX = Math.min(
          b.maxX,
          Math.max(b.minX, origin.x + gesture.dx)
        );
        const nextY = Math.min(
          b.maxY,
          Math.max(b.minY, origin.y + gesture.dy)
        );
        const snapLeft = nextX + BLOB_SIZE / 2 < b.width / 2;
        setPosition({
          x: snapLeft ? b.minX : b.maxX,
          y: nextY,
        });
      },
    })
  ).current;

  if (!runtime || runtime.viewState !== 'minimised') {
    return null;
  }

  const x = Math.min(maxX, Math.max(minX, position.x));
  const y = Math.min(maxY, Math.max(minY, position.y));
  const display = getDisplay(runtime, now);
  const tint = phaseColor(runtime.config.type, display.segment?.phase);
  const digits = formatGymTimerDigits(display.displaySec);

  return (
    <View
      style={[styles.blob, { backgroundColor: tint, left: x, top: y }]}
      {...panResponder.panHandlers}
    >
      <Pressable
        style={styles.press}
        onPress={expand}
        onLongPress={() => {
          if (
            runtime.lifecycle === 'running' ||
            runtime.lifecycle === 'lead_in'
          ) {
            pause();
          } else if (runtime.lifecycle === 'paused') {
            resume();
          }
        }}
        accessibilityLabel={`Gym timer ${digits}. Tap to open. Long press to pause or resume. Drag to move.`}
      >
        <Text style={styles.digits} numberOfLines={1}>
          {digits}
        </Text>
        <View style={styles.pauseHint}>
          <Ionicons
            name={runtime.lifecycle === 'paused' ? 'play' : 'pause'}
            size={14}
            color="#04140A"
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: BLOB_SIZE,
    height: BLOB_SIZE,
    borderRadius: BLOB_SIZE / 2,
    zIndex: 999,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  press: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  digits: {
    fontFamily: gymClockFont.digits,
    fontSize: 16,
    color: '#04140A',
    fontWeight: '700',
  },
  pauseHint: {
    marginTop: 2,
    opacity: 0.8,
  },
});
