import { mockReduceMotion } from '@/jest/mockReduceMotion';
import { motion } from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import { act, renderHook } from '@testing-library/react-native';
import { withSpring, withTiming } from 'react-native-reanimated';

async function renderMotion() {
  const hook = await renderHook(() => useMotion());
  // Let the isReduceMotionEnabled() promise resolve.
  await act(async () => {});
  return hook;
}

describe('useMotion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('animates movement with the token duration, easing and spring', async () => {
    mockReduceMotion(false);
    const { result } = await renderMotion();

    expect(result.current.reduceMotion).toBe(false);
    result.current.timing(1, 'fast');
    expect(withTiming).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ duration: motion.duration.fast })
    );

    result.current.spring(1, 'gentle');
    expect(withSpring).toHaveBeenCalledWith(
      1,
      expect.objectContaining(motion.spring.gentle)
    );
  });

  it('makes movement instant under Reduce Motion', async () => {
    mockReduceMotion(true);
    const { result } = await renderMotion();

    expect(result.current.reduceMotion).toBe(true);
    expect(result.current.timing(1, 'slow')).toBe(1);
    expect(result.current.spring(0.98, 'snappy')).toBe(0.98);
    expect(withTiming).not.toHaveBeenCalled();
    expect(withSpring).not.toHaveBeenCalled();
  });

  it('caps fades at 150ms under Reduce Motion', async () => {
    mockReduceMotion(true);
    const { result } = await renderMotion();

    result.current.fade(1, 'celebrate');
    expect(withTiming).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ duration: motion.reducedFadeDuration })
    );
  });

  it('keeps full fade duration when motion is allowed', async () => {
    mockReduceMotion(false);
    const { result } = await renderMotion();

    result.current.fade(1, 'slow');
    expect(withTiming).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ duration: motion.duration.slow })
    );
  });

  it('follows the OS setting when it changes while the app is open', async () => {
    const reduceMotion = mockReduceMotion(false);
    const { result } = await renderMotion();
    expect(result.current.reduceMotion).toBe(false);

    await act(async () => reduceMotion.change(true));
    expect(result.current.reduceMotion).toBe(true);
  });
});
