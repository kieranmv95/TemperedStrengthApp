import { WorkoutDetailScrollContent } from '@/src/components/workouts/WorkoutDetailScrollContent';
import { workoutDetailStyles as styles } from '@/src/components/workouts/workoutDetailStyles';
import { Colors } from '@/src/constants/theme';
import { getStandaloneWorkoutById } from '@/src/data/workouts';
import { useSubscription } from '@/src/hooks/use-subscription';
import { asStringId } from '@/src/utils/routeParams';
import {
  getFavoriteWorkouts,
  toggleFavoriteWorkout
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
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
          <TouchableOpacity
            style={styles.lockedCta}
            onPress={handleLockedPress}
          >
            <Text style={styles.lockedCtaText}>Go to Account</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={Colors.textOnAccent}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <WorkoutDetailScrollContent workout={workout} />
      )}
    </SafeAreaView>
  );
}
