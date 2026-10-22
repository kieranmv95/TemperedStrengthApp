import { Card, PressableCard, StandardLayout } from '@/src/components/ds';
import { WorkoutCard } from '@/src/components/workouts/WorkoutCard';
import { workoutsListStyles as styles } from '@/src/components/workouts/workoutsListStyles';
import { color } from '@/src/constants/tokens';
import {
  disciplines,
  isNoEquipmentDiscipline,
  workoutMatchesDiscipline,
  type Discipline,
} from '@/src/data/disciplines';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import { useRoles } from '@/src/hooks/useRoles';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { SingleWorkout } from '@/src/types/workouts';
import {
  getFavoriteWorkouts,
  toggleFavoriteWorkout,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router, useLocalSearchParams } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Image, Linking, Text, View } from 'react-native';

const EMPTY_ICON_SIZE = 48;

type SponsorCardContentProps = {
  discipline: Discipline;
};

function SponsorCardContent({ discipline }: SponsorCardContentProps) {
  return (
    <View style={styles.sponsorContent}>
      {!!discipline.logo && (
        <Image
          source={discipline.logo.source}
          style={[
            styles.sponsorLogo,
            { width: discipline.logo.width, height: discipline.logo.height },
          ]}
          accessibilityLabel={`${discipline.title} logo`}
        />
      )}
      {!!discipline.description && (
        <Text style={styles.sponsorDescription}>{discipline.description}</Text>
      )}
      {!!discipline.link && (
        <View style={styles.sponsorLinkRow}>
          <Ionicons name="globe-outline" size={16} color={color.gold} />
          <Text style={styles.sponsorLinkText}>View event details</Text>
        </View>
      )}
    </View>
  );
}

export default function WorkoutsByTagScreen() {
  const { isPro, roles, isLoading: accessLoading } = useRoles();
  const posthog = usePostHog();
  const params = useLocalSearchParams<{ tag?: string }>();
  const tag = typeof params.tag === 'string' ? params.tag : '';

  const discipline = disciplines.find((d) => d.tag === tag);
  const showSponsorCard = Boolean(discipline?.isSponsor);

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
      isNoEquipmentDiscipline(tag) || disciplines.some((d) => d.tag === tag);
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

  const handleSponsorPress = () => {
    if (!discipline?.link) return;
    posthog.capture(posthogEventsNames.home.linkPressed, {
      link_id: `sponsor_tag:${tag || 'unknown'}`,
      target: discipline.link,
    });
    Linking.openURL(discipline.link).catch((error) => {
      console.error('Failed to open sponsor URL:', error);
    });
  };

  const renderSponsorCard = () => {
    if (!showSponsorCard || !discipline) {
      return undefined;
    }
    if (!discipline.link) {
      return (
        <Card style={styles.sponsorCard}>
          <SponsorCardContent discipline={discipline} />
        </Card>
      );
    }
    return (
      <PressableCard
        variant="promo"
        accentColor={discipline.theme?.borderColor}
        showChevron={false}
        onPress={handleSponsorPress}
        accessibilityLabel={[
          discipline.title,
          discipline.description,
          'View event details',
        ]
          .filter((part): part is string => !!part)
          .join('. ')}
        accessibilityHint="Opens in your browser"
        style={styles.sponsorCard}
      >
        <SponsorCardContent discipline={discipline} />
      </PressableCard>
    );
  };

  return (
    <StandardLayout
      title={discipline?.title || 'Workouts'}
      onBackPress={() => router.back()}
      disableScroll
      edgeToEdgeBody
    >
      <StandardLayout.Body>
        {filteredWorkouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="barbell-outline"
              size={EMPTY_ICON_SIZE}
              color={color.textTertiary}
            />
            <Text style={styles.emptyTitle} accessibilityRole="header">
              No workouts found
            </Text>
            <Text style={styles.emptyDescription}>
              {tag
                ? 'No workouts match this discipline yet.'
                : 'Missing discipline tag.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredWorkouts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={renderSponsorCard()}
            renderItem={({ item }) => (
              <WorkoutCard
                workout={item}
                isFavorite={favorites.includes(item.id)}
                isPro={isPro || accessLoading}
                roles={roles}
                onToggleFavorite={handleToggleFavorite}
                onPress={handleWorkoutPress}
                onLockedPress={handleLockedPress}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </StandardLayout.Body>
    </StandardLayout>
  );
}
