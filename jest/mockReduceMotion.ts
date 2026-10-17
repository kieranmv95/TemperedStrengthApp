import { AccessibilityInfo } from 'react-native';

type ReduceMotionListener = (enabled: boolean) => void;

/**
 * Stubs the OS Reduce Motion setting read by useMotion. Await
 * `act(async () => {})` after rendering so the async check resolves.
 */
export function mockReduceMotion(enabled: boolean) {
  let listener: ReduceMotionListener | null = null;
  jest
    .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
    .mockResolvedValue(enabled);
  jest
    .spyOn(AccessibilityInfo, 'addEventListener')
    .mockImplementation((_event, handler) => {
      listener = handler as ReduceMotionListener;
      return { remove: jest.fn() } as unknown as ReturnType<
        typeof AccessibilityInfo.addEventListener
      >;
    });
  return {
    change: (next: boolean) => listener?.(next),
  };
}
