import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { DaySelector } from '@/src/components/DaySelector';
import { act, fireEvent, render, screen } from '@testing-library/react-native';

/** Program starts Monday 5 January 2026; "today" is Wednesday 7th (day index 2). */
const START_DATE = '2026-01-05T00:00:00';
const TODAY = new Date('2026-01-07T09:00:00');

async function renderSelector(
  currentDayIndex: number,
  onDaySelect = jest.fn()
) {
  await render(
    <DaySelector
      startDate={START_DATE}
      workoutDayIndices={[0, 2, 4]}
      currentDayIndex={currentDayIndex}
      sessionStatuses={{ 0: 'completed' }}
      onDaySelect={onDaySelect}
    />
  );
  await act(async () => {});
  return { onDaySelect };
}

describe('DaySelector', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(TODAY);
    mockReduceMotion(false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('describes each day in words, including status and today', async () => {
    await renderSelector(2);

    expect(
      screen.getByRole('button', { name: 'Monday 5th, completed' })
    ).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'Tuesday 6th, rest day' })
    ).toBeOnTheScreen();
    expect(
      screen.getByRole('button', {
        name: 'Wednesday 7th, today, session scheduled',
      })
    ).toBeSelected();
    expect(screen.getByText('Today')).toBeOnTheScreen();
  });

  it('hides "Jump to today" while today is selected', async () => {
    await renderSelector(2);

    expect(
      screen.queryByRole('button', { name: 'Jump to today' })
    ).not.toBeOnTheScreen();
  });

  it('offers "Jump to today" when another day is selected', async () => {
    const { onDaySelect } = await renderSelector(4);

    await fireEvent.press(
      screen.getByRole('button', { name: 'Jump to today' })
    );

    expect(onDaySelect).toHaveBeenCalledWith(2);
  });

  it('selects a day when pressed', async () => {
    const { onDaySelect } = await renderSelector(2);

    await fireEvent.press(
      screen.getByRole('button', { name: 'Monday 5th, completed' })
    );

    expect(onDaySelect).toHaveBeenCalledWith(0);
  });
});
