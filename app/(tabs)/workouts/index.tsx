import { Card, CuratedSection, SmallChevron } from '@/src/components/ds';
import { StandardLayout } from '@/src/components/StandardLayout';
import { WorkoutActiveFiltersBar } from '@/src/components/workouts/WorkoutActiveFiltersBar';
import { WorkoutCard } from '@/src/components/workouts/WorkoutCard';
import {
  WorkoutFiltersSheet,
  type WorkoutFiltersDraft,
} from '@/src/components/workouts/WorkoutFiltersSheet';
import { workoutsListStyles as styles } from '@/src/components/workouts/workoutsListStyles';
import {
  compareWorkouts,
  WorkoutFiltersBarButton,
  WorkoutSortBarButton,
  WorkoutSortPanel,
} from '@/src/components/workouts/WorkoutSortControls';
import {
  type CategoryFilter,
  type WorkoutSortBy,
  type WorkoutSortDirection,
} from '@/src/components/workouts/workoutsScreenConstants';
import { Colors } from '@/src/constants/theme';
import { visibleDisciplines } from '@/src/data/disciplines';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import { useSubscription } from '@/src/hooks/use-subscription';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type {
  SingleWorkout,
  WorkoutEquipment,
  WorkoutFocusTag,
  WorkoutFormatTag,
} from '@/src/types/workouts';
import {
  getFavoriteWorkouts,
  toggleFavoriteWorkout,
} from '@/src/utils/storage';
import {
  countActiveWorkoutFilters,
  workoutMatchesFilters,
  type WorkoutTimeBucket,
} from '@/src/utils/workoutFilters';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function WorkoutsScreen() {
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const posthog = usePostHog();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<CategoryFilter>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<
    WorkoutEquipment[]
  >([]);
  const [noEquipmentOnly, setNoEquipmentOnly] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState<WorkoutFocusTag[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<WorkoutFormatTag[]>([]);
  const [selectedTimeBuckets, setSelectedTimeBuckets] = useState<
    WorkoutTimeBucket[]
  >([]);
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

  const handleSelectCategoryFilter = (filter: CategoryFilter) => {
    captureFilter('category', filter);
    setActiveCategoryFilter(filter);
  };

  const filterCriteria = useMemo(
    () => ({
      searchQuery,
      activeCategoryFilter,
      selectedEquipment,
      noEquipmentOnly,
      selectedFocus,
      selectedFormat,
      selectedTimeBuckets,
      favoriteIds: favorites,
    }),
    [
      searchQuery,
      activeCategoryFilter,
      selectedEquipment,
      noEquipmentOnly,
      selectedFocus,
      selectedFormat,
      selectedTimeBuckets,
      favorites,
    ]
  );

  const sheetFilterCount = useMemo(
    () =>
      countActiveWorkoutFilters({
        searchQuery,
        activeCategoryFilter,
        selectedEquipment,
        noEquipmentOnly,
        selectedFocus,
        selectedFormat,
        selectedTimeBuckets,
      }),
    [
      searchQuery,
      activeCategoryFilter,
      selectedEquipment,
      noEquipmentOnly,
      selectedFocus,
      selectedFormat,
      selectedTimeBuckets,
    ]
  );

  const hasActiveFilters = sheetFilterCount > 0;

  const handleResetAllFilters = () => {
    captureFilter('reset', 'all');
    setSearchQuery('');
    setActiveCategoryFilter('All');
    setSelectedEquipment([]);
    setNoEquipmentOnly(false);
    setSelectedFocus([]);
    setSelectedFormat([]);
    setSelectedTimeBuckets([]);
  };

  const handleApplyFilters = (draft: WorkoutFiltersDraft) => {
    setSearchQuery(draft.searchQuery);
    setActiveCategoryFilter(draft.activeCategoryFilter);
    setSelectedEquipment(draft.selectedEquipment);
    setNoEquipmentOnly(draft.noEquipmentOnly);
    setSelectedFocus(draft.selectedFocus);
    setSelectedFormat(draft.selectedFormat);
    setSelectedTimeBuckets(draft.selectedTimeBuckets);
    captureFilter('filters_apply', 'sheet');
  };

  const filtersDraft = useMemo(
    (): WorkoutFiltersDraft => ({
      searchQuery,
      activeCategoryFilter,
      selectedEquipment,
      noEquipmentOnly,
      selectedFocus,
      selectedFormat,
      selectedTimeBuckets,
    }),
    [
      searchQuery,
      activeCategoryFilter,
      selectedEquipment,
      noEquipmentOnly,
      selectedFocus,
      selectedFormat,
      selectedTimeBuckets,
    ]
  );

  const filteredWorkouts = useMemo(
    () =>
      allStandaloneWorkouts.filter((workout) =>
        workoutMatchesFilters(workout, filterCriteria)
      ),
    [filterCriteria]
  );

  const sortedWorkouts = useMemo(
    () =>
      [...filteredWorkouts].sort((a, b) =>
        compareWorkouts(a, b, sortBy, sortDirection)
      ),
    [filteredWorkouts, sortBy, sortDirection]
  );

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
      filterBarOnly
      filterBarButtons={
        <>
          <WorkoutFiltersBarButton
            activeCount={sheetFilterCount}
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
        draft={filtersDraft}
        favoriteIds={favorites}
        onClose={() => setFiltersSheetVisible(false)}
        onApply={handleApplyFilters}
      />
      <StandardLayout.Body>
        <WorkoutActiveFiltersBar
          searchQuery={searchQuery}
          activeCategoryFilter={activeCategoryFilter}
          selectedEquipment={selectedEquipment}
          noEquipmentOnly={noEquipmentOnly}
          selectedFocus={selectedFocus}
          selectedFormat={selectedFormat}
          selectedTimeBuckets={selectedTimeBuckets}
          onResetAll={handleResetAllFilters}
          onClearSearch={() => {
            captureFilter('search', 'clear');
            setSearchQuery('');
          }}
          onClearCategory={() => handleSelectCategoryFilter('All')}
          onClearNoEquipment={() => {
            captureFilter('equipment', 'all');
            setNoEquipmentOnly(false);
          }}
          onRemoveEquipment={(eq) => {
            setSelectedEquipment((prev) => {
              const next = prev.filter((item) => item !== eq);
              captureFilter(
                'equipment',
                next.length > 0 ? next.join(',') : 'all'
              );
              return next;
            });
          }}
          onRemoveFocus={(tag) => {
            setSelectedFocus((prev) => prev.filter((t) => t !== tag));
            captureFilter('focus', tag);
          }}
          onRemoveFormat={(tag) => {
            setSelectedFormat((prev) => prev.filter((t) => t !== tag));
            captureFilter('format', tag);
          }}
          onRemoveTimeBucket={(bucket) => {
            setSelectedTimeBuckets((prev) => prev.filter((b) => b !== bucket));
            captureFilter('time', bucket);
          }}
        />
        {sortedWorkouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name={
                activeCategoryFilter === 'Favorites'
                  ? 'heart-outline'
                  : 'barbell'
              }
              size={64}
              color={Colors.backgroundSubtle}
            />
            <Text style={styles.emptyTitle}>
              {activeCategoryFilter === 'Favorites'
                ? 'No Favorites Yet'
                : 'No Workouts Found'}
            </Text>
            <Text style={styles.emptyDescription}>
              {activeCategoryFilter === 'Favorites'
                ? 'Tap the heart icon on any workout to save it here.'
                : searchQuery.trim()
                  ? 'No workouts match your search.'
                  : 'Try selecting a different filter.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedWorkouts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              hasActiveFilters && styles.listContentWithActiveFilters,
            ]}
            ListHeaderComponent={
              <View style={styles.curatedSectionList}>
                {hasActiveFilters ? (
                  <Text style={styles.sectionsHiddenNote}>
                    Mobility &amp; flows and Disciplines hidden due to filters
                  </Text>
                ) : (
                  <View>
                    <Card
                      onPress={handleOpenRecovery}
                      accessibilityLabel="Browse recovery flows"
                      style={styles.recoveryCard}
                    >
                      <View style={styles.recoveryVisualTile}>
                        <Ionicons name="body" size={30} color={Colors.accent} />
                      </View>
                      <View style={styles.recoveryCtaTextColumn}>
                        <Text style={styles.shopEyebrow}>
                          Move &amp; restore
                        </Text>
                        <Text style={styles.hubCtaTitle}>
                          Mobility &amp; flows
                        </Text>
                        <Text style={styles.hubCtaDescription}>
                          Guided flows to help you recover and move better.
                        </Text>
                      </View>
                      <SmallChevron />
                    </Card>
                    <CuratedSection
                      title="Disciplines"
                      description="get started with what you already know"
                      size="large"
                      style={styles.titleSpace}
                    />
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.curatedScrollContent}
                    >
                      {visibleDisciplines.map((discipline) => (
                        <TouchableOpacity
                          style={styles.disciplineSection}
                          key={discipline.tag}
                          onPress={() => {
                            posthog.capture(
                              posthogEventsNames.workout.filtersApplied,
                              {
                                filter_type: 'discipline',
                                filter_value: discipline.tag,
                              }
                            );
                            router.push(
                              `/workouts/tag/${encodeURIComponent(discipline.tag)}`
                            );
                          }}
                        >
                          <ImageBackground
                            source={discipline.image}
                            style={styles.disciplineImage}
                            imageStyle={styles.disciplineImageStyle}
                          />
                          <View
                            pointerEvents="none"
                            style={styles.disciplineGoldOverlay}
                          />
                          {discipline.showTitle && (
                            <Text style={styles.disciplineSectionTitle}>
                              {discipline.title}
                            </Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <CuratedSection
                  title={
                    hasActiveFilters ? 'Filtered Workouts' : 'All Workouts'
                  }
                  description={
                    hasActiveFilters
                      ? `${sortedWorkouts.length} Results Found`
                      : `All our workouts, over ${allStandaloneWorkouts.length}+ workouts.`
                  }
                  size="large"
                  style={styles.titleSpace}
                />
              </View>
            }
            renderItem={({ item }) => (
              <WorkoutCard
                workout={item}
                isFavorite={favorites.includes(item.id)}
                isPro={isPro || subscriptionLoading}
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
