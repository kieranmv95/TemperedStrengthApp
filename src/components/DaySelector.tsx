import {
  ITEM_WIDTH,
  SCROLL_PADDING_H,
} from '@/src/components/daySelectorConstants';
import { DaySelectorDayChip } from '@/src/components/DaySelectorDayChip';
import { daySelectorStyles as styles } from '@/src/components/daySelectorStyles';
import { ActionChip } from '@/src/components/ds';
import { useMotion } from '@/src/hooks/useMotion';
import type { ProgramSessionStatus } from '@/src/types/storage';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentRef,
} from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

type ChipLayout = { x: number; width: number; height: number };

function JumpToTodayButton({ onPress }: { onPress: () => void }) {
  const motionHelpers = useMotion();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.set(motionHelpers.fade(1, 'fast'));
  }, [opacity, motionHelpers]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <Animated.View style={[styles.timelineActionRow, fadeStyle]}>
      <ActionChip
        label="Jump to today"
        icon="today-outline"
        tone="gold"
        onPress={onPress}
      />
    </Animated.View>
  );
}

type DaySelectorProps = {
  startDate: string;
  workoutDayIndices: number[];
  currentDayIndex: number;
  sessionStatuses: Record<number, ProgramSessionStatus>;
  onDaySelect: (dayIndex: number) => void;
};

export const DaySelector: React.FC<DaySelectorProps> = ({
  startDate,
  workoutDayIndices,
  currentDayIndex,
  sessionStatuses,
  onDaySelect,
}) => {
  const motionHelpers = useMotion();
  const scrollViewRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const lastStartDateRef = useRef<string>(startDate);
  const [isTodayVisible, setIsTodayVisible] = useState(true);
  const chipLayoutsRef = useRef<Map<number, ChipLayout>>(new Map());
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const indicatorHeight = useSharedValue(0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const firstDayIndex =
    workoutDayIndices.length > 0 ? Math.min(...workoutDayIndices) : 0;
  const lastDayIndex =
    workoutDayIndices.length > 0
      ? Math.max(...workoutDayIndices)
      : currentDayIndex;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayDayIndex = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const minDayIndex = Math.min(firstDayIndex, todayDayIndex);
  const maxDayIndex = lastDayIndex;

  const isTodayInRange =
    todayDayIndex >= minDayIndex && todayDayIndex <= maxDayIndex;

  const isTodaySelected = currentDayIndex === todayDayIndex;

  const getDayParts = (dayIndex: number) => {
    const date = new Date(start);
    date.setDate(date.getDate() + dayIndex);
    const day = date.getDate();

    const suffix = ['th', 'st', 'nd', 'rd'][
      day % 10 > 3 || Math.floor((day % 100) / 10) === 1 ? 0 : day % 10
    ];

    return {
      label: `${WEEKDAYS_SHORT[date.getDay()] ?? ''} ${day}${suffix}`,
      accessibleDate: `${WEEKDAYS_LONG[date.getDay()] ?? ''} ${day}${suffix}`,
    };
  };

  const isToday = (dayIndex: number): boolean => {
    const date = new Date(start);
    date.setDate(date.getDate() + dayIndex);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  const hasWorkout = (dayIndex: number): boolean => {
    return workoutDayIndices.includes(dayIndex);
  };

  const days = Array.from(
    { length: maxDayIndex - minDayIndex + 1 },
    (_, i) => minDayIndex + i
  );

  const hasScrolledInitially = useRef(false);
  const screenWidth = Dimensions.get('window').width;

  const chipCenterX = useCallback((dayIndex: number): number | null => {
    const layout = chipLayoutsRef.current.get(dayIndex);
    if (!layout) return null;
    return layout.x + layout.width / 2;
  }, []);

  const scrollToDayCentered = useCallback(
    (dayIndex: number, animated: boolean) => {
      const centerX = chipCenterX(dayIndex);
      if (centerX === null) return false;
      const x = Math.max(0, centerX - screenWidth / 2);
      scrollViewRef.current?.scrollTo({ x, animated });
      return true;
    },
    [chipCenterX, screenWidth]
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isTodayInRange) return;

      const scrollX = event.nativeEvent.contentOffset.x;
      const measuredCenterX = chipCenterX(todayDayIndex);
      const fallbackCenterX =
        (todayDayIndex - minDayIndex) * ITEM_WIDTH +
        SCROLL_PADDING_H +
        ITEM_WIDTH / 2;
      const todayCenterX = measuredCenterX ?? fallbackCenterX;

      const isVisible =
        todayCenterX >= scrollX - ITEM_WIDTH &&
        todayCenterX <= scrollX + screenWidth + ITEM_WIDTH;

      setIsTodayVisible(isVisible);
    },
    [todayDayIndex, minDayIndex, isTodayInRange, screenWidth, chipCenterX]
  );

  const handleJumpToToday = useCallback(() => {
    if (!isTodayInRange) return;

    onDaySelect(todayDayIndex);

    if (!scrollToDayCentered(todayDayIndex, true)) {
      const todayArrayIndex = todayDayIndex - minDayIndex;
      const scrollX =
        todayArrayIndex * ITEM_WIDTH -
        screenWidth / 2 +
        ITEM_WIDTH / 2 +
        SCROLL_PADDING_H;

      scrollViewRef.current?.scrollTo({
        x: Math.max(0, scrollX),
        animated: true,
      });
    }

    setIsTodayVisible(true);
  }, [
    todayDayIndex,
    minDayIndex,
    screenWidth,
    onDaySelect,
    isTodayInRange,
    scrollToDayCentered,
  ]);

  useEffect(() => {
    const startDateChanged = lastStartDateRef.current !== startDate;

    if (startDateChanged) {
      lastStartDateRef.current = startDate;
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
      setIsTodayVisible(true);
    } else if (!hasScrolledInitially.current) {
      hasScrolledInitially.current = true;

      const currentDayArrayIndex = currentDayIndex - minDayIndex;

      if (currentDayArrayIndex >= 0 && currentDayArrayIndex < days.length) {
        const attempt = () => scrollToDayCentered(currentDayIndex, false);

        setTimeout(() => {
          if (attempt()) return;
          // One short retry to wait for layout measurements.
          setTimeout(() => {
            if (attempt()) return;
            const scrollX =
              currentDayArrayIndex * ITEM_WIDTH -
              screenWidth / 2 +
              ITEM_WIDTH / 2 +
              SCROLL_PADDING_H;

            scrollViewRef.current?.scrollTo({
              x: Math.max(0, scrollX),
              animated: false,
            });
          }, 50);
        }, 0);
      }
    }
  }, [
    startDate,
    currentDayIndex,
    minDayIndex,
    days.length,
    screenWidth,
    scrollToDayCentered,
  ]);

  useEffect(() => {
    const layout = chipLayoutsRef.current.get(currentDayIndex);
    if (!layout) return;
    indicatorX.set(motionHelpers.spring(layout.x, 'gentle'));
    indicatorWidth.set(motionHelpers.spring(layout.width, 'gentle'));
    indicatorHeight.set(layout.height);
  }, [
    currentDayIndex,
    indicatorX,
    indicatorWidth,
    indicatorHeight,
    motionHelpers,
  ]);

  const handleChipLayout = (dayIndex: number, event: LayoutChangeEvent) => {
    const { x, width, height } = event.nativeEvent.layout;
    chipLayoutsRef.current.set(dayIndex, { x, width, height });
    if (dayIndex === currentDayIndex) {
      indicatorX.set(x);
      indicatorWidth.set(width);
      indicatorHeight.set(height);
    }
  };

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: indicatorWidth.get() > 0 ? 1 : 0,
    width: indicatorWidth.get(),
    height: indicatorHeight.get(),
    transform: [{ translateX: indicatorX.get() }],
  }));

  const showJumpToToday =
    isTodayInRange && (!isTodayVisible || !isTodaySelected);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Animated.View
          style={[styles.indicator, indicatorStyle]}
          pointerEvents="none"
        />
        {days.map((dayIndex) => {
          const dayHasWorkout = hasWorkout(dayIndex);
          const dayIsToday = isToday(dayIndex);
          const isSelected = dayIndex === currentDayIndex;
          const sessionStatus = sessionStatuses[dayIndex];

          const dotKind = sessionStatus ?? (dayHasWorkout ? 'workout' : 'none');
          const parts = getDayParts(dayIndex);

          return (
            <DaySelectorDayChip
              key={dayIndex}
              label={parts.label}
              accessibleDate={parts.accessibleDate}
              isSelected={isSelected}
              isToday={dayIsToday}
              dotKind={dotKind}
              onPress={() => onDaySelect(dayIndex)}
              onLayout={(e) => handleChipLayout(dayIndex, e)}
            />
          );
        })}
      </ScrollView>
      {showJumpToToday ? (
        <JumpToTodayButton onPress={handleJumpToToday} />
      ) : null}
    </View>
  );
};
