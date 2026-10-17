import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { ExerciseCard } from '@/src/components/ExerciseCard';
import { getAllExercises } from '@/src/data/exercises';
import { closeAppDatabaseForTests, openAppDatabase } from '@/src/db/database';
import { ToastProvider } from '@/src/hooks/toast-context';
import type { Exercise as ProgramExercise } from '@/src/types/program';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

jest.mock('@/src/hooks/use-subscription', () => ({
  useSubscription: () => ({ isPro: true }),
}));
jest.mock('@/src/hooks/exercise-video-context', () => ({
  useExerciseVideo: () => ({ openExerciseVideo: jest.fn() }),
}));
jest.mock('@/src/hooks/useWeightUnit', () => ({
  useWeightUnit: () => ({ unit: 'kg' }),
}));
jest.mock('posthog-react-native', () => ({
  usePostHog: () => ({ capture: jest.fn() }),
}));

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const exercise = getAllExercises().find(
  (candidate) => candidate.logging_type === 'reps_and_weight'
);

if (!exercise) {
  throw new Error('Expected a reps-and-weight exercise in the bundled data');
}

const programExercise: ProgramExercise = {
  type: 'exercise',
  id: exercise.id,
  sets: 2,
  repRange: [5, 5],
  additionalHeader: 'Back squat - 2×5 @ 75%',
};

async function renderCard() {
  await render(
    <GestureHandlerRootView>
      <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
        <ToastProvider>
          <ExerciseCard
            exerciseId={exercise!.id}
            programExercise={programExercise}
            slotNumber={1}
            dayIndex={0}
            slotIndex={0}
            onSwap={jest.fn()}
            onRestStart={jest.fn()}
            onRestDismiss={jest.fn()}
          />
        </ToastProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
  await act(async () => {});
}

describe('ExerciseCard', () => {
  const name = exercise.name;

  beforeEach(async () => {
    mockReduceMotion(false);
    await closeAppDatabaseForTests();
    await openAppDatabase();
  });

  afterEach(async () => {
    await closeAppDatabaseForTests();
  });

  it('shows one meta line, labelled set controls and labelled fields', async () => {
    await renderCard();

    expect(screen.getByRole('header', { name })).toBeOnTheScreen();
    expect(screen.getByText(/Back squat - 2×5 @ 75%/)).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: `Add a set to ${name}` })
    ).toBeOnTheScreen();
    expect(screen.getByLabelText(`${name} set 1 Weight (kg)`)).toHaveProp(
      'placeholder',
      'kg'
    );
    expect(screen.getByLabelText(`${name} set 1 Reps`)).toHaveProp(
      'value',
      '5'
    );
    expect(
      screen.getByRole('checkbox', { name: `${name} set 1, not logged` })
    ).toBeEnabled();
  });

  it('expands only the next set to log with steppers', async () => {
    await renderCard();

    expect(
      screen.getByRole('button', { name: `Increase ${name} set 1 Reps` })
    ).toBeOnTheScreen();
    expect(
      screen.queryByRole('button', { name: `Increase ${name} set 2 Reps` })
    ).not.toBeOnTheScreen();
  });

  it('logs a set, confirms it in a toast, and undoes it', async () => {
    await renderCard();

    await fireEvent.changeText(
      screen.getByLabelText(`${name} set 1 Reps`),
      '5'
    );
    await fireEvent.press(
      screen.getByRole('checkbox', { name: `${name} set 1, not logged` })
    );

    await waitFor(() =>
      expect(screen.getByText(`${name}, set 1 logged`)).toBeOnTheScreen()
    );
    expect(
      screen.getByRole('checkbox', { name: `${name} set 1, completed` })
    ).toBeChecked();
    expect(
      screen.getByRole('button', { name: `Increase ${name} set 2 Reps` })
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Undo' }));

    await waitFor(() =>
      expect(
        screen.getByRole('checkbox', { name: `${name} set 1, not logged` })
      ).not.toBeChecked()
    );
  });

  it('shows drag handles only in reorder mode', async () => {
    await renderCard();

    expect(screen.queryByLabelText('Reorder set 1')).not.toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Reorder sets' }));

    expect(screen.getByRole('button', { name: 'Reorder sets' })).toBeSelected();
    expect(screen.getByLabelText('Reorder set 1')).toBeOnTheScreen();
  });
});
