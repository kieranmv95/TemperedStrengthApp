import { RestDayActivityCard } from '@/src/components/rest/RestDayActivityCard';
import { restDayCarouselStyles as styles } from '@/src/components/rest/restDayCarouselStyles';
import type { RestDayActivitySuggestion } from '@/src/types/restDaySuggestions';
import React from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

type RestDayActivityCarouselProps = {
  activities: RestDayActivitySuggestion[];
};

export function RestDayActivityCarousel({
  activities,
}: RestDayActivityCarouselProps) {
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth * 0.6;

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
        <View key={activity.title} style={{ width: cardWidth }}>
          <RestDayActivityCard activity={activity} style={styles.card} />
        </View>
      ))}
    </ScrollView>
  );
}
