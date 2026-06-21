import { Card, SmallChevron } from '@/src/components/ds';
import { Pill } from '@/src/components/pill';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { getAllExercises } from '@/src/data/exercises';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import type { Exercise } from '@/src/types/exercise';
import { listPersonalBestSummaryLines } from '@/src/utils/personalBests';
import { getPersonalBestsStore } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export function YouPersonalBestsScreen() {
  const { unit: weightUnit } = useWeightUnit();

  const repsExercises = useMemo(
    () => getAllExercises().filter((e) => e.logging_type === 'reps_and_weight'),
    []
  );

  const muscleOptions = useMemo(() => {
    const muscles = new Set(repsExercises.map((e) => e.muscle));
    return ['All', ...Array.from(muscles).sort()];
  }, [repsExercises]);

  const [pbStore, setPbStore] = useState<Awaited<
    ReturnType<typeof getPersonalBestsStore>
  > | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string>('All');

  const loadPbStore = useCallback(async () => {
    try {
      const store = await getPersonalBestsStore();
      setPbStore(store);
    } catch (error) {
      console.error('Error loading personal bests:', error);
      setPbStore({});
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPbStore();
    }, [loadPbStore])
  );

  const filteredPbExercises = useMemo(() => {
    return repsExercises.filter((ex) => {
      if (muscleFilter !== 'All' && ex.muscle !== muscleFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        if (
          !ex.name.toLowerCase().includes(q) &&
          !ex.muscle.toLowerCase().includes(q) &&
          !ex.pattern.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [repsExercises, muscleFilter, searchQuery]);

  const renderPbRow = useCallback(
    ({ item }: { item: Exercise }) => {
      const pbLines = listPersonalBestSummaryLines(
        pbStore?.[item.id] ?? {},
        weightUnit
      );
      return (
        <Card
          onPress={() => router.push(`/records/${item.id}`)}
          accessibilityLabel={`Open personal bests for ${item.name}`}
        >
          <View style={styles.pbRowText}>
            <Text style={styles.pbRowTitle}>{item.name}</Text>
            <Text style={styles.pbRowMeta}>{item.muscle}</Text>
            {pbLines.length === 0 ? (
              <Text style={[styles.pbRowSummary, styles.pbRowSummaryEmpty]}>
                No PBs logged
              </Text>
            ) : (
              <View style={styles.pbRowPills}>
                {pbLines.map((line) => (
                  <Pill
                    key={`${item.id}-${line.tier}`}
                    label={line.label}
                    isActive={true}
                    onPress={() => {}}
                    disabled
                  />
                ))}
              </View>
            )}
          </View>
          <SmallChevron />
        </Card>
      );
    },
    [pbStore, weightUnit]
  );

  return (
    <StandardLayout
      title="Personal Bests"
      subtitle="Your personal records by exercise"
      disableScroll
      onBackPress={() => router.back()}
    >
      <StandardLayout.Filters>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color={Colors.textPlaceholder}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={Colors.textPlaceholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityLabel="Clear search"
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.textPlaceholder}
              />
            </TouchableOpacity>
          )}
        </View>
      </StandardLayout.Filters>
      <StandardLayout.AdvancedFilters>
        <View style={styles.pbFilters}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.muscleScroll}
          >
            {muscleOptions.map((m) => (
              <Pill
                key={m}
                label={m}
                isActive={muscleFilter === m}
                onPress={() => setMuscleFilter(m)}
              />
            ))}
          </ScrollView>
        </View>
      </StandardLayout.AdvancedFilters>

      <StandardLayout.Body>
        {pbStore === null ? (
          <ActivityIndicator color={Colors.textMuted} />
        ) : (
          <FlatList
            data={filteredPbExercises}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderPbRow}
            contentContainerStyle={styles.pbListContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyStateText}>
                No exercises match your filters.
              </Text>
            }
          />
        )}
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  pbFilters: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    paddingVertical: Spacing.xs,
  },
  muscleScroll: {
    gap: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  pbListContent: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.xl,
  },
  pbRowText: {
    flex: 1,
    gap: Spacing.xs,
  },
  pbRowTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  pbRowMeta: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
  },
  pbRowPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  pbRowSummary: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  pbRowSummaryEmpty: {
    color: Colors.textPlaceholder,
    fontStyle: 'italic',
  },
  emptyStateText: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.lg,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
});
