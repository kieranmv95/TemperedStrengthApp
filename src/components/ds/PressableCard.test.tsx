import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { PressableCard } from '@/src/components/ds/PressableCard';
import { motion } from '@/src/constants/tokens';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import { Text } from 'react-native';
import { withSpring } from 'react-native-reanimated';

async function renderCard(props: Partial<Parameters<typeof PressableCard>[0]>) {
  const onPress = jest.fn();
  await render(
    <PressableCard
      onPress={onPress}
      accessibilityLabel="Advanced Olympic Performance, Rest day, 10 sessions left"
      {...props}
    >
      <Text>Advanced Olympic Performance</Text>
      <Text>Rest day</Text>
    </PressableCard>
  );
  await act(async () => {});
  return { onPress };
}

describe('PressableCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion(false);
  });

  it('reads as one button with the combined label and optional hint', async () => {
    await renderCard({ accessibilityHint: 'Opens your program' });

    const card = screen.getByRole('button', {
      name: 'Advanced Olympic Performance, Rest day, 10 sessions left',
    });
    expect(card).toHaveProp('accessibilityHint', 'Opens your program');
  });

  it('keeps hero and promo decoration out of the accessible name', async () => {
    await renderCard({ variant: 'hero' });
    expect(
      screen.getByRole('button', {
        name: 'Advanced Olympic Performance, Rest day, 10 sessions left',
      })
    ).toBeOnTheScreen();

    await renderCard({ variant: 'promo', accentColor: '#7EC8E3' });
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('calls onPress with a light haptic', async () => {
    const { onPress } = await renderCard({});

    fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Light
    );
  });

  it('skips the haptic when haptic is false', async () => {
    await renderCard({ haptic: false });

    fireEvent.press(screen.getByRole('button'));

    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('exposes the disabled state and ignores presses', async () => {
    const { onPress } = await renderCard({ disabled: true });

    const card = screen.getByRole('button');
    expect(card).toBeDisabled();
    fireEvent.press(card);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('scales on press when motion is allowed', async () => {
    await renderCard({});

    fireEvent(screen.getByRole('button'), 'pressIn');

    expect(withSpring).toHaveBeenCalledWith(
      motion.pressScale,
      expect.objectContaining(motion.spring.snappy)
    );
  });

  it('does not scale under Reduce Motion', async () => {
    mockReduceMotion(true);
    await renderCard({});

    fireEvent(screen.getByRole('button'), 'pressIn');

    expect(withSpring).not.toHaveBeenCalled();
  });
});
