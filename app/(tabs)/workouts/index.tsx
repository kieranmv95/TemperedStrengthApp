import { SectionHeader, StandardLayout } from '@/src/components/ds';
import { HubPromoCard } from '@/src/components/hub/HubPromoRow';
import { DisciplinePill } from '@/src/components/workouts/DisciplinePill';
import {
  DISCIPLINE_TILE_SIZE,
  DisciplineTile,
} from '@/src/components/workouts/DisciplineTile';
import { WorkoutActiveFiltersBar } from '@/src/components/workouts/WorkoutActiveFiltersBar';
import { WorkoutCard } from '@/src/components/workouts/WorkoutCard';
import { WorkoutFiltersSheet } from '@/src/components/workouts/WorkoutFiltersSheet';
import {
  compareWorkouts,
  WorkoutFiltersBarButton,
  WorkoutSortBarButton,
  WorkoutSortPanel,
} from '@/src/components/workouts/WorkoutSortControls';
import {
  type WorkoutSortBy,
  type WorkoutSortDirection,
} from '@/src/components/workouts/workoutsScreenConstants';
import { color, space, typography } from '@/src/constants/tokens';
import {
  visibleEvents,
  visibleTrainingDisciplines,
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
import {
  countActiveWorkoutFilters,
  EMPTY_WORKOUT_FILTERS,
  workoutMatchesFilters,
  type WorkoutFilterContext,
  type WorkoutFilters,
} from '@/src/utils/workoutFilters';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

/** Filter groups and their selected values, as sent to analytics. */
function appliedFilterValues(filters: WorkoutFilters): [string, string[]][] {
  return [
    ['favourites', filters.favouritesOnly ? ['on'] : []],
    ['locked', filters.hideLocked ? ['hidden'] : []],
    ['discipline', filters.disciplines],
    ['time', filters.timeBuckets],
    ['equipment', filters.bodyweightOnly ? ['bodyweight'] : filters.equipment],
    ['format', filters.formats],
    ['focus', filters.bodyFocus],
    ['level', filters.levels],
    ['partner', filters.partnerOnly ? ['on'] : []],
    ['collection', filters.collections],
  ];
}

export default function WorkoutsScreen() {
  const { isPro, roles, isLoading: accessLoading } = useRoles();
  const posthog = usePostHog();
  const [filters, setFilters] = useState<WorkoutFilters>(EMPTY_WORKOUT_FILTERS);
  const searchQuery = filters.searchQuery;
  const [filtersSheetVisible, setFiltersSheetVisible] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortExpanded, setSortExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<WorkoutSortBy>('name');
  const [sortDirection, setSortDirection] =
    useState<WorkoutSortDirection>('asc');

  const captureFilter = useCallback(
    (filterType: string, filterValue: string) => {
      posthog.capture(posthogEventsNames.workout.filtersApplied, {
        filter_type: filterType,
        filter_value: filterValue,
      });
    },
    [posthog]
  );

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    const q = searchQuery.trim();
    if (q.length < 2) {
      return;
    }
    searchDebounceRef.current = setTimeout(() => {
      captureFilter('search', q.slice(0, 120));
    }, 600);
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery, captureFilter]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const favs = await getFavoriteWorkouts();
        setFavorites(favs);
      })();
    }, [])
  );

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

  const handleOpenRecovery = () => {
    router.push('/recovery');
  };

  const handleWorkoutPress = (workout: SingleWorkout) => {
    const source = searchQuery.trim().length > 0 ? 'search' : 'browse';
    router.push({
      pathname: '/workouts/[id]',
      params: { id: workout.id, view_source: source },
    });
  };

  const handleLockedPress = () => {
    router.push('/records');
  };

  const filterContext = useMemo(
    (): WorkoutFilterContext => ({
      favoriteIds: favorites,
      isPro: isPro || accessLoading,
      roles,
    }),
    [favorites, isPro, accessLoading, roles]
  );

  const activeFilterCount = countActiveWorkoutFilters(filters);
  const hasActiveFilters = activeFilterCount > 0;

  const handleResetAllFilters = () => {
    captureFilter('reset', 'all');
    setFilters(EMPTY_WORKOUT_FILTERS);
  };

  const handleApplyFilters = (draft: WorkoutFilters) => {
    setFilters(draft);
    captureFilter('filters_apply', 'sheet');
    for (const [group, values] of appliedFilterValues(draft)) {
      if (values.length > 0) captureFilter(group, values.join(','));
    }
  };

  const handleRemoveFilter = (
    changes: Partial<WorkoutFilters>,
    group: string
  ) => {
    captureFilter(group, 'remove');
    setFilters((prev) => ({ ...prev, ...changes }));
  };

  const filteredWorkouts = useMemo(
    () =>
      allStandaloneWorkouts.filter((workout) =>
        workoutMatchesFilters(workout, filters, filterContext)
      ),
    [filters, filterContext]
  );

  const sortedWorkouts = useMemo(
    () =>
      [...filteredWorkouts].sort((a, b) =>
        compareWorkouts(a, b, sortBy, sortDirection)
      ),
    [filteredWorkouts, sortBy, sortDirection]
  );

  const handleOpenDiscipline = (discipline: Discipline) => {
    posthog.capture(posthogEventsNames.workout.filtersApplied, {
      filter_type: 'discipline',
      filter_value: discipline.tag,
    });
    router.push(`/workouts/tag/${encodeURIComponent(discipline.tag)}`);
  };

  const handleChangeSortBy = (value: WorkoutSortBy) => {
    setSortBy(value);
    captureFilter('sort', `${value}_${sortDirection}`);
  };

  const handleChangeSortDirection = (value: WorkoutSortDirection) => {
    setSortDirection(value);
    captureFilter('sort', `${sortBy}_${value}`);
  };

  return (
    <StandardLayout
      title="Workouts"
      subtitle="Log your workouts and track your progress."
      disableScroll
      edgeToEdgeBody
      filterBarOnly
      filterBarButtons={
        <>
          <WorkoutFiltersBarButton
            activeCount={activeFilterCount}
            onPress={() => {
              setFiltersSheetVisible(true);
              captureFilter('filters', 'panel_open');
            }}
          />
          <WorkoutSortBarButton
            expanded={sortExpanded}
            onPress={() => {
              setSortExpanded((v) => {
                const next = !v;
                if (next) {
                  captureFilter('sort', 'panel_open');
                }
                return next;
              });
            }}
          />
        </>
      }
      filterBarBelowButtons={
        sortExpanded ? (
          <WorkoutSortPanel
            sortBy={sortBy}
            sortDirection={sortDirection}
            onChangeSortBy={handleChangeSortBy}
            onChangeSortDirection={handleChangeSortDirection}
          />
        ) : null
      }
    >
      <WorkoutFiltersSheet
        visible={filtersSheetVisible}
        draft={filters}
        context={filterContext}
        onClose={() => setFiltersSheetVisible(false)}
        onApply={handleApplyFilters}
      />
      <StandardLayout.Body>
        <View style={styles.pageGutter}>
          <WorkoutActiveFiltersBar
            filters={filters}
            onResetAll={handleResetAllFilters}
            onRemove={handleRemoveFilter}
          />
        </View>
        {sortedWorkouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name={
                filters.favouritesOnly ? 'heart-outline' : 'barbell-outline'
              }
              size={48}
              color={color.textTertiary}
            />
            <Text style={styles.emptyTitle} accessibilityRole="header">
              {filters.favouritesOnly
                ? 'No favourites yet'
                : 'No workouts found'}
            </Text>
            <Text style={styles.emptyDescription}>
              {filters.favouritesOnly
                ? 'Tap the heart on any workout to save it here.'
                : searchQuery.trim()
                  ? 'No workouts match your search.'
                  : 'Try a different filter.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedWorkouts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                {hasActiveFilters ? (
                  <Text style={[styles.hiddenNote, styles.pageGutter]}>
                    Mobility &amp; flows, Events, and Disciplines are hidden
                    while filters are on.
                  </Text>
                ) : (
                  <View style={styles.listHeader}>
                    <View style={styles.pageGutter}>
                      <HubPromoCard
                        icon="body-outline"
                        eyebrow="Move & restore"
                        title="Mobility & flows"
                        description="Guided flows to help you recover and move better."
                        onPress={handleOpenRecovery}
                        accessibilityLabel="Opens mobility and recovery flows"
                      />
                    </View>
                    <View style={[styles.sectionHeading, styles.pageGutter]}>
                      <SectionHeader title="Events" />
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.disciplineRow}
                      snapToInterval={DISCIPLINE_TILE_SIZE + space.sm}
                      decelerationRate="fast"
                    >
                      {visibleEvents.map((discipline) => (
                        <DisciplineTile
                          key={discipline.tag}
                          discipline={discipline}
                          onPress={() => handleOpenDiscipline(discipline)}
                        />
                      ))}
                    </ScrollView>
                    <View style={[styles.sectionHeading, styles.pageGutter]}>
                      <SectionHeader title="Disciplines" />
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.disciplinePillRow}
                    >
                      {visibleTrainingDisciplines.map((discipline) => (
                        <DisciplinePill
                          key={discipline.tag}
                          discipline={discipline}
                          onPress={() => handleOpenDiscipline(discipline)}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}

                <View style={[styles.sectionHeading, styles.pageGutter]}>
                  <SectionHeader
                    title={
                      hasActiveFilters ? 'Filtered workouts' : 'All workouts'
                    }
                  />
                  <Text style={styles.sectionDescription}>
                    {hasActiveFilters
                      ? `${sortedWorkouts.length} workout${
                          sortedWorkouts.length === 1 ? '' : 's'
                        } match`
                      : `${allStandaloneWorkouts.length}+ workouts`}
                  </Text>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.pageGutter}>
                <WorkoutCard
                  workout={item}
                  isFavorite={favorites.includes(item.id)}
                  isPro={isPro || accessLoading}
                  roles={roles}
                  onToggleFavorite={handleToggleFavorite}
                  onPress={handleWorkoutPress}
                  onLockedPress={handleLockedPress}
                />
              </View>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  pageGutter: {
    paddingHorizontal: space.md,
  },
  listContent: {
    paddingBottom: space.xxl,
  },
  listHeader: {
    gap: space.md,
    paddingBottom: space.sm,
  },
  sectionHeading: {
    gap: space.xxs,
  },
  sectionDescription: {
    ...typography.callout,
    color: color.textSecondary,
  },
  hiddenNote: {
    ...typography.callout,
    color: color.textSecondary,
  },
  disciplineRow: {
    gap: space.sm,
    paddingHorizontal: space.md,
  },
  disciplinePillRow: {
    gap: space.xs,
    paddingHorizontal: space.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    paddingHorizontal: space.xxl,
  },
  emptyTitle: {
    ...typography.title2,
    color: color.textPrimary,
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
  },
});
