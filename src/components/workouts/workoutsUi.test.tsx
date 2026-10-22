import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { WorkoutCard } from '@/src/components/workouts/WorkoutCard';
import {
  WorkoutFiltersSheet,
  type WorkoutFiltersDraft,
} from '@/src/components/workouts/WorkoutFiltersSheet';
import { WorkoutFiltersBarButton } from '@/src/components/workouts/WorkoutSortControls';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const EMPTY_DRAFT: WorkoutFiltersDraft = {
  searchQuery: '',
  activeCategoryFilter: 'All',
  selectedEquipment: [],
  noEquipmentOnly: false,
  selectedFocus: [],
  selectedFormat: [],
  selectedTimeBuckets: [],
};

const freeWorkout = allStandaloneWorkouts.find((w) => !w.isPremium);
const proWorkout = allStandaloneWorkouts.find((w) => w.isPremium);

if (!freeWorkout || !proWorkout) {
  throw new Error('Expected free and Pro workouts in the bundled data');
}

async function renderInProviders(element: React.ReactElement) {
  await render(
    <GestureHandlerRootView>
      <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
        {element}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
  await act(async () => {});
}

describe('WorkoutCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion(false);
  });

  it('reads as one element and keeps the favourite button reachable', async () => {
    const onPress = jest.fn();
    const onToggleFavorite = jest.fn();
    const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    await renderInProviders(
      <WorkoutCard
        workout={freeWorkout}
        isFavorite={false}
        isPro
        onPress={onPress}
        onToggleFavorite={onToggleFavorite}
        onLockedPress={jest.fn()}
      />
    );

    await fireEvent.press(
      screen.getByRole('button', {
        name: new RegExp(
          `^${freeWorkout.title}, .*${freeWorkout.estimatedTime} minutes`
        ),
      })
    );
    expect(onPress).toHaveBeenCalledWith(freeWorkout);

    const favourite = screen.getByRole('button', {
      name: `Favourite ${freeWorkout.title}`,
    });
    expect(favourite).not.toBeSelected();
    await fireEvent.press(favourite);
    expect(onToggleFavorite).toHaveBeenCalledWith(freeWorkout);
    expect(announce).toHaveBeenCalledWith('Added to favourites');
  });

  it('explains locked Pro workouts in text and sends the user to upgrade', async () => {
    const onLockedPress = jest.fn();
    await renderInProviders(
      <WorkoutCard
        workout={proWorkout}
        isFavorite={false}
        isPro={false}
        onPress={jest.fn()}
        onToggleFavorite={jest.fn()}
        onLockedPress={onLockedPress}
      />
    );

    expect(screen.getByText('Unlock with Pro')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: /locked$/ }));
    expect(onLockedPress).toHaveBeenCalledTimes(1);
  });
});

describe('WorkoutFiltersBarButton', () => {
  it('includes the active filter count in its name', async () => {
    mockReduceMotion(false);
    await renderInProviders(
      <WorkoutFiltersBarButton activeCount={2} onPress={jest.fn()} />
    );

    expect(
      screen.getByRole('button', { name: 'Filter workouts, 2 active' })
    ).toBeOnTheScreen();
  });
});

describe('WorkoutFiltersSheet', () => {
  beforeEach(() => {
    mockReduceMotion(false);
  });

  it('labels the focus Strength chip differently from the discipline', async () => {
    await renderInProviders(
      <WorkoutFiltersSheet
        visible
        draft={EMPTY_DRAFT}
        favoriteIds={[]}
        onClose={jest.fn()}
        onApply={jest.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: /^Strength, \d+ workouts?$/ })
    ).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: /^Strength focus, \d+ workouts?$/ })
    ).toBeOnTheScreen();
  });

  it('disables Reset until something is selected and applies the draft', async () => {
    const onApply = jest.fn();
    await renderInProviders(
      <WorkoutFiltersSheet
        visible
        draft={EMPTY_DRAFT}
        favoriteIds={[]}
        onClose={jest.fn()}
        onApply={onApply}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Reset filters' })
    ).toBeDisabled();

    const strengthFocus = screen.getByRole('button', {
      name: /^Strength focus, /,
    });
    await fireEvent.press(strengthFocus);

    expect(
      screen.getByRole('button', { name: /^Strength focus, / })
    ).toBeSelected();
    expect(screen.getByRole('button', { name: 'Reset filters' })).toBeEnabled();

    await fireEvent.press(
      screen.getByRole('button', { name: /^Show \d+ workouts?$/ })
    );
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ selectedFocus: ['Strength'] })
    );
  });
});
