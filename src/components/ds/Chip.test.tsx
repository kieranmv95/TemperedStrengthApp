import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { ActionChip, Badge, FilterChip, Tag } from '@/src/components/ds/Chip';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';

describe('FilterChip', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion(false);
  });

  it('announces label, count and selected state', async () => {
    await render(
      <FilterChip
        label="Strength"
        count={22}
        selected
        onPress={jest.fn()}
        accessibilityLabel="Strength, 22 workouts"
      />
    );
    await act(async () => {});

    const chip = screen.getByRole('button', { name: 'Strength, 22 workouts' });
    expect(chip).toBeSelected();
    expect(screen.getByText('22')).toBeOnTheScreen();
  });

  it('defaults the accessible name to label and count', async () => {
    await render(
      <FilterChip
        label="Hyrox"
        count={9}
        selected={false}
        onPress={jest.fn()}
      />
    );
    await act(async () => {});

    expect(screen.getByRole('button', { name: 'Hyrox, 9' })).not.toBeSelected();
  });

  it('shows a check icon only when selected, so state is not colour alone', async () => {
    const { rerender } = await render(
      <FilterChip label="Core" selected={false} onPress={jest.fn()} />
    );
    await act(async () => {});
    expect(screen.queryByTestId('filter-chip-check')).not.toBeOnTheScreen();

    await rerender(<FilterChip label="Core" selected onPress={jest.fn()} />);
    expect(screen.getByTestId('filter-chip-check')).toBeOnTheScreen();
  });

  it('toggles with a selection haptic', async () => {
    const onPress = jest.fn();
    await render(
      <FilterChip label="EMOM" selected={false} onPress={onPress} />
    );
    await act(async () => {});

    fireEvent.press(screen.getByRole('button', { name: 'EMOM' }));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(Haptics.selectionAsync).toHaveBeenCalledTimes(1);
  });
});

describe('ActionChip', () => {
  it('is a button with its own accessible name', async () => {
    const onPress = jest.fn();
    await render(
      <ActionChip
        label="How to perform"
        icon="play-circle"
        onPress={onPress}
        accessibilityLabel="How to perform, Snatch"
      />
    );

    fireEvent.press(
      screen.getByRole('button', { name: 'How to perform, Snatch' })
    );
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('Tag and Badge', () => {
  it('render read-only labels', async () => {
    await render(
      <>
        <Tag label="Gymnastics" />
        <Badge label="PRO" accessibilityLabel="Pro workout" />
      </>
    );

    expect(screen.getByText('Gymnastics')).toBeOnTheScreen();
    expect(screen.getByLabelText('Pro workout')).toBeOnTheScreen();
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });
});
