import { StandaloneWorkoutLogPanel } from '@/src/components/StandaloneWorkoutLogPanel';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { getStandaloneWorkoutById } from '@/src/data/workouts';
import { useSubscription } from '@/src/hooks/use-subscription';
import type { SingleWorkout, WorkoutCategory } from '@/src/types/workouts';
import {
  getFavoriteWorkouts,
  toggleFavoriteWorkout,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORY_ICONS: Record<WorkoutCategory, string> = {
  Strength: 'barbell',
  WOD: 'timer',
  Hyrox: 'fitness',
  Conditioning: 'heart',
  Mobility: 'body',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: Colors.accent,
  Intermediate: Colors.accent,
  Advanced: Colors.accent,
};

function asStringId(idParam: unknown): string | null {
  if (typeof idParam === 'string') return idParam;
  if (Array.isArray(idParam) && typeof idParam[0] === 'string') return idParam[0];
  return null;
}

export default function WorkoutDetailScreen() {
  const { id: idParam } = useLocalSearchParams();
  const workoutId = asStringId(idParam);
  const workout = useMemo(() => {
    if (!workoutId) return undefined;
    return getStandaloneWorkoutById(workoutId);
  }, [workoutId]);

  const { isPro } = useSubscription();
  const [favorites, setFavorites] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const favs = await getFavoriteWorkouts();
    setFavorites(favs);
  };

  const handleToggleFavorite = async (id: string) => {
    const newStatus = await toggleFavoriteWorkout(id);
    if (newStatus) {
      setFavorites((prev) => [...prev, id]);
    } else {
      setFavorites((prev) => prev.filter((x) => x !== id));
    }
  };

  const handleLockedPress = () => {
    router.push('/settings');
  };

  if (!workoutId || !workout) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.detailHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.detailTitle} numberOfLines={1}>
            Workout
          </Text>
          <View style={styles.headerRightSpacer} />
        </View>

        <View style={styles.emptyState}>
          <Ionicons name="barbell" size={64} color={Colors.backgroundSubtle} />
          <Text style={styles.emptyTitle}>Workout not found</Text>
          <Text style={styles.emptyDescription}>
            This workout may have been removed or the link is invalid.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isLocked = workout.isPremium && !isPro;
  const isFavorite = favorites.includes(workout.id);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.detailHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.detailTitle} numberOfLines={1}>
          {workout.title}
        </Text>
        <TouchableOpacity
          style={styles.detailFavoriteButton}
          onPress={() => handleToggleFavorite(workout.id)}
          disabled={isLocked}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={
              isLocked
                ? Colors.textPlaceholder
                : isFavorite
                  ? Colors.destructive
                  : Colors.textPrimary
            }
          />
        </TouchableOpacity>
      </View>

      {isLocked ? (
        <View style={styles.lockedState}>
          <Ionicons name="lock-closed" size={44} color={Colors.accent} />
          <Text style={styles.lockedTitle}>Pro workout</Text>
          <Text style={styles.lockedDescription}>
            Upgrade to Pro to unlock this workout.
          </Text>
          <TouchableOpacity style={styles.lockedCta} onPress={handleLockedPress}>
            <Text style={styles.lockedCtaText}>Go to Settings</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textOnAccent} />
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.detailContent}
          contentContainerStyle={styles.detailContentContainer}
        >
          <View style={styles.detailMetaRow}>
            <View style={styles.detailCategoryBadge}>
              <Ionicons
                name={CATEGORY_ICONS[workout.category] as any}
                size={14}
                color={Colors.accent}
              />
              <Text style={styles.detailCategoryText}>{workout.category}</Text>
            </View>
            <View style={styles.detailMetaItem}>
              <Ionicons
                name="time-outline"
                size={16}
                color={Colors.textMuted}
              />
              <Text style={styles.detailMetaText}>{workout.estimatedTime} min</Text>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                { borderColor: DIFFICULTY_COLORS[workout.difficulty] },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: DIFFICULTY_COLORS[workout.difficulty] },
                ]}
              >
                {workout.difficulty}
              </Text>
            </View>
          </View>

          <Text style={styles.detailDescription}>{workout.description}</Text>

          <View style={styles.detailTagsContainer}>
            {workout.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {workout.blocks.map((block, blockIndex) => (
            <View key={blockIndex} style={styles.blockContainer}>
              <Text style={styles.blockName}>{block.name}</Text>
              {block.instructions && (
                <Text style={styles.blockInstructions}>{block.instructions}</Text>
              )}
              <View style={styles.movementsList}>
                {block.movements.map((movement, movementIndex) => {
                  const movementText =
                    typeof movement === 'string'
                      ? movement
                      : `${movement.name}: ${movement.value}${
                          movement.note ? ` (${movement.note})` : ''
                        }`;
                  return (
                    <View key={movementIndex} style={styles.movementItem}>
                      <Text style={styles.movementBullet}>•</Text>
                      <Text style={styles.movementText}>{movementText}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}

          <StandaloneWorkoutLogPanel workout={workout as SingleWorkout} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  backButton: {
    padding: Spacing.md,
    marginRight: Spacing.md,
  },
  detailTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
  },
  headerRightSpacer: {
    width: 44,
  },
  detailFavoriteButton: {
    padding: Spacing.md,
  },
  lockedState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    gap: Spacing.xl,
  },
  lockedTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '800',
    textAlign: 'center',
  },
  lockedDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
    textAlign: 'center',
  },
  lockedCta: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  lockedCtaText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.base,
    fontWeight: '700',
  },
  detailContent: {
    flex: 1,
  },
  detailContentContainer: {
    padding: Spacing.xxxl,
  },
  detailMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  detailCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundElevated,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  detailCategoryText: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  detailMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailMetaText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  detailDescription: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxl,
    lineHeight: 24,
    marginBottom: Spacing.xxl,
  },
  detailTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.section,
  },
  tag: {
    backgroundColor: Colors.backgroundElevated,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xxl,
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  blockContainer: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  blockName: {
    color: Colors.accent,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  blockInstructions: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontStyle: 'italic',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  movementsList: {
    gap: Spacing.md,
  },
  movementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  movementBullet: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '600',
    marginTop: 2,
  },
  movementText: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    lineHeight: 22,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
    textAlign: 'center',
  },
});

