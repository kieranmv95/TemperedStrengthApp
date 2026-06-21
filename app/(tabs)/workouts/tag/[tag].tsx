import { WorkoutCard } from '@/src/components/workouts/WorkoutCard';
import { workoutDetailStyles as headerStyles } from '@/src/components/workouts/workoutDetailStyles';
import { workoutsListStyles as styles } from '@/src/components/workouts/workoutsListStyles';
import { Colors, Spacing } from '@/src/constants/theme';
import {
  disciplines,
  isNoEquipmentDiscipline,
  workoutMatchesDiscipline,
} from '@/src/data/disciplines';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import { useSubscription } from '@/src/hooks/use-subscription';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { SingleWorkout } from '@/src/types/workouts';
import {
  getFavoriteWorkouts,
  toggleFavoriteWorkout,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WorkoutsByTagScreen() {
  const { isPro } = useSubscription();
  const posthog = usePostHog();
  const params = useLocalSearchParams<{ tag?: string }>();
  const tag = typeof params.tag === 'string' ? params.tag : '';

  const discipline = disciplines.find((d) => d.tag === tag);
  const showSponsorCard = Boolean(discipline?.isSponsor && discipline?.link);

  const [favorites, setFavorites] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const favs = await getFavoriteWorkouts();
        setFavorites(favs);
      })();
    }, [])
  );

  const filteredWorkouts = useMemo(() => {
    if (!tag) return [];
    const isDisciplineTag =
      isNoEquipmentDiscipline(tag) ||
      disciplines.some((d) => d.tag === tag);
    if (!isDisciplineTag) return [];
    return allStandaloneWorkouts.filter((w) =>
      workoutMatchesDiscipline(w, tag)
    );
  }, [tag]);

  const handleToggleFavorite = async (workout: SingleWorkout) => {
    const newStatus = await toggleFavoriteWorkout(workout.id);
    posthog.capture(posthogEventsNames.workout.favourite, {
      workout_name: workout.title,
      action: newStatus ? 'add' : 'remove',
    });
    if (newStatus) {
      setFavorites([...favorites, workout.id]);
    } else {
      setFavorites(favorites.filter((id) => id !== workout.id));
    }
  };

  const handleWorkoutPress = (workout: SingleWorkout) => {
    router.push({
      pathname: '/workouts/[id]',
      params: { id: workout.id, view_source: `tag:${tag}` },
    });
  };

  const handleLockedPress = () => {
    router.push('/records');
  };

  const handleSponsorPress = useCallback(() => {
    if (!discipline?.link) return;
    posthog.capture(posthogEventsNames.home.linkPressed, {
      link_id: `sponsor_tag:${tag || 'unknown'}`,
      target: discipline.link,
    });
    Linking.openURL(discipline.link).catch((error) => {
      console.error('Failed to open sponsor URL:', error);
    });
  }, [discipline?.link, posthog, tag]);

  return (
    <SafeAreaView
      style={headerStyles.container}
      edges={['top', 'left', 'right']}
    >
      <View style={headerStyles.detailHeader}>
        <TouchableOpacity
          style={headerStyles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={headerStyles.detailTitle} numberOfLines={1}>
          {discipline?.title || 'Workouts'}
        </Text>
        <View style={headerStyles.headerRightSpacer} />
      </View>

      {filteredWorkouts.length === 0 ? (
        <View style={headerStyles.emptyState}>
          <Ionicons name="barbell" size={64} color={Colors.backgroundSubtle} />
          <Text style={headerStyles.emptyTitle}>No Workouts Found</Text>
          <Text style={headerStyles.emptyDescription}>
            {tag
              ? 'No workouts match this discipline yet.'
              : 'Missing discipline tag.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredWorkouts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { padding: Spacing.xxl, paddingTop: Spacing.xxl },
          ]}
          ListHeaderComponent={
            showSponsorCard ? (
              <TouchableOpacity
                style={styles.sponsorCard}
                onPress={handleSponsorPress}
                activeOpacity={0.85}
              >
                {!!discipline?.logo && (
                  <Image
                    source={discipline.logo.source}
                    style={[
                      styles.sponsorLogo,
                      {
                        width: discipline.logo.width,
                        height: discipline.logo.height,
                      },
                    ]}
                  />
                )}
                {!!discipline?.description && (
                  <Text style={styles.sponsorDescription}>
                    {discipline.description}
                  </Text>
                )}
                <View style={styles.sponsorLinkRow}>
                  <Ionicons
                    name="globe-outline"
                    size={16}
                    color={Colors.accent}
                  />
                  <Text style={styles.sponsorLinkText}>View event details</Text>
                </View>
              </TouchableOpacity>
            ) : null
          }
          renderItem={({ item }) => (
            <WorkoutCard
              workout={item}
              isFavorite={favorites.includes(item.id)}
              isPro={isPro}
              onToggleFavorite={handleToggleFavorite}
              onPress={handleWorkoutPress}
              onLockedPress={handleLockedPress}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
