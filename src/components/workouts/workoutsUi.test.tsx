import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { WorkoutCard } from '@/src/components/workouts/WorkoutCard';
import { WorkoutFiltersSheet } from '@/src/components/workouts/WorkoutFiltersSheet';
import { WorkoutFiltersBarButton } from '@/src/components/workouts/WorkoutSortControls';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import {
  EMPTY_WORKOUT_FILTERS,
  type WorkoutFilterContext,
} from '@/src/utils/workoutFilters';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const FREE_USER: WorkoutFilterContext = {
  favoriteIds: [],
  isPro: false,
  roles: [],
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

  it('lists training disciplines and keeps events and Pro out of them', async () => {
    await renderInProviders(
      <WorkoutFiltersSheet
        visible
        draft={EMPTY_WORKOUT_FILTERS}
        context={FREE_USER}
        onClose={jest.fn()}
        onApply={jest.fn()}
      />
    );

    for (const name of ['Metcon', 'Strength', 'Gymnastics', 'Hyrox']) {
      expect(
        screen.getByRole('button', {
          name: new RegExp(`^${name}, \\d+ workouts?$`),
        })
      ).toBeOnTheScreen();
    }
    expect(screen.queryByRole('button', { name: /^Rainhill, / })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Pro, / })).toBeNull();
    expect(
      screen.getByRole('button', { name: /^Hide locked, / })
    ).toBeOnTheScreen();
  });

  it('shows every time bucket in order, disabling empty ones', async () => {
    await renderInProviders(
      <WorkoutFiltersSheet
        visible
        draft={{ ...EMPTY_WORKOUT_FILTERS, disciplines: ['Skills'] }}
        context={FREE_USER}
        onClose={jest.fn()}
        onApply={jest.fn()}
      />
    );

    const labels = ['Under 15 min', '15–30 min', '30–45 min', '45+ min'];
    for (const label of labels) {
      const escaped = label.replace(/[+]/g, '\\+');
      const chip = screen.getByRole('button', {
        name: new RegExp(`^${escaped}, \\d+ workouts?$`),
      });
      expect(chip).toBeOnTheScreen();
      if (/, 0 workouts$/.test(chip.props.accessibilityLabel)) {
        expect(chip).toBeDisabled();
      }
    }
  });

  it('hides "Hide locked" for Pro users', async () => {
    await renderInProviders(
      <WorkoutFiltersSheet
        visible
        draft={EMPTY_WORKOUT_FILTERS}
        context={{ ...FREE_USER, isPro: true }}
        onClose={jest.fn()}
        onApply={jest.fn()}
      />
    );

    expect(screen.queryByRole('button', { name: /^Hide locked, / })).toBeNull();
  });

  it('disables Reset until something is selected and applies the draft', async () => {
    const onApply = jest.fn();
    await renderInProviders(
      <WorkoutFiltersSheet
        visible
        draft={EMPTY_WORKOUT_FILTERS}
        context={FREE_USER}
        onClose={jest.fn()}
        onApply={onApply}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Reset filters' })
    ).toBeDisabled();

    await fireEvent.press(
      screen.getByRole('button', { name: /^Gymnastics, / })
    );
    await fireEvent.press(screen.getByRole('button', { name: /^Dumbbell, / }));

    expect(
      screen.getByRole('button', { name: /^Gymnastics, / })
    ).toBeSelected();
    expect(screen.getByRole('button', { name: 'Reset filters' })).toBeEnabled();

    await fireEvent.press(
      screen.getByRole('button', { name: /^Show \d+ workouts?$/ })
    );
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({
        disciplines: ['Gymnastics'],
        equipment: ['dumbbell'],
      })
    );
  });
});
