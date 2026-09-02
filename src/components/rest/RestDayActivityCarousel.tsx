import { RestDayActivityCard } from '@/src/components/rest/RestDayActivityCard';
import { restDayCarouselStyles as styles } from '@/src/components/rest/restDayCarouselStyles';
import type { RestDayActivitySuggestion } from '@/src/types/restDaySuggestions';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

type RestDayActivityCarouselProps = {
  activities: RestDayActivitySuggestion[];
};

export function RestDayActivityCarousel({
  activities,
}: RestDayActivityCarouselProps) {
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth * 0.6;
  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>(
    {}
  );

  useEffect(() => {
    setMeasuredHeights({});
  }, [activities]);

  const rowHeight = useMemo(() => {
    if (activities.length === 0) {
      return undefined;
    }

    const heights = activities.map(
      (activity) => measuredHeights[activity.title] ?? 0
    );

    if (heights.some((height) => height === 0)) {
      return undefined;
    }

    return Math.max(...heights);
  }, [activities, measuredHeights]);

  if (activities.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollBleed}
      contentContainerStyle={styles.list}
    >
      {activities.map((activity) => (
        <View
          key={activity.title}
          style={[
            { width: cardWidth },
            rowHeight != null ? { height: rowHeight } : null,
          ]}
          onLayout={(event) => {
            if (rowHeight != null) {
              return;
            }

            const nextHeight = Math.ceil(event.nativeEvent.layout.height);
            setMeasuredHeights((current) => {
              const existing = current[activity.title];
              if (existing === nextHeight) {
                return current;
              }

              return {
                ...current,
                [activity.title]: nextHeight,
              };
            });
          }}
        >
          <RestDayActivityCard
            activity={activity}
            style={[styles.card, rowHeight != null ? styles.cardFill : null]}
          />
        </View>
      ))}
    </ScrollView>
  );
}
