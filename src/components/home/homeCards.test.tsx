import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { HomeCheckinCard } from '@/src/components/home/HomeCheckinCard';
import { HomeTodayCard } from '@/src/components/home/HomeTodayCard';
import { ToastProvider } from '@/src/hooks/toast-context';
import type { HomeProgramSummary } from '@/src/utils/homeProgramSummary';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

const SUMMARY: HomeProgramSummary = {
  programId: 'olympic_advanced_8wk',
  programName: 'Advanced Olympic Performance',
  todaySessionLabel: 'Snatch Day',
  sessionsRemaining: 10,
  sessionsCompleted: 6,
  sessionsSkipped: 0,
  programCompleted: false,
  awaitingProgramStart: false,
  calendarSessionSpanProgress: 0.375,
};

async function renderWithProviders(element: React.ReactElement) {
  await render(
    <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
      <ToastProvider>{element}</ToastProvider>
    </SafeAreaProvider>
  );
  await act(async () => {});
}

describe('HomeTodayCard', () => {
  beforeEach(() => {
    mockReduceMotion(false);
  });

  it('reads as one button and offers Go to today’s session on a training day', async () => {
    await renderWithProviders(
      <HomeTodayCard summary={SUMMARY} onPress={jest.fn()} />
    );

    expect(
      screen.getByRole('button', {
        name: 'Advanced Olympic Performance, Snatch Day, 6 completed · 10 sessions left',
      })
    ).toBeOnTheScreen();
    expect(screen.getByText('Go to today’s session')).toBeOnTheScreen();
  });

  it('shows Rest day in sentence case with Go to program', async () => {
    await renderWithProviders(
      <HomeTodayCard
        summary={{ ...SUMMARY, todaySessionLabel: 'Rest Day' }}
        onPress={jest.fn()}
      />
    );

    expect(screen.getByText('Rest day')).toBeOnTheScreen();
    expect(screen.getByText('Go to program')).toBeOnTheScreen();
  });

  it('asks the user to pick a program when none is active', async () => {
    const onPress = jest.fn();
    await renderWithProviders(
      <HomeTodayCard summary={null} onPress={onPress} />
    );

    await fireEvent.press(
      screen.getByRole('button', { name: 'Pick a program' })
    );
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('HomeCheckinCard', () => {
  beforeEach(() => {
    mockReduceMotion(false);
  });

  it('summarises behaviours and supplements in its label', async () => {
    await renderWithProviders(
      <HomeCheckinCard
        loggedCount={1}
        totalCount={4}
        supplementsDue={1}
        supplementsTotal={2}
        onPress={jest.fn()}
      />
    );

    expect(
      screen.getByRole('button', {
        name: 'Check-in, 1 of 4 behaviours · 1 supplement due',
      })
    ).toBeOnTheScreen();
  });

  it('collapses extra behaviours into a +k label', async () => {
    await renderWithProviders(
      <HomeCheckinCard
        loggedCount={0}
        totalCount={9}
        supplementsDue={0}
        supplementsTotal={0}
        onPress={jest.fn()}
      />
    );

    expect(
      screen.getByText('+3', { includeHiddenElements: true })
    ).toBeTruthy();
  });
});
