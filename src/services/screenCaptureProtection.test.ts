import {
  holdScreenCaptureProtection,
  resetScreenCaptureProtectionForTests,
  subscribeToScreenshots,
} from '@/src/services/screenCaptureProtection';
import * as ScreenCapture from 'expo-screen-capture';
import { Platform } from 'react-native';

jest.mock('expo-screen-capture', () => ({
  preventScreenCaptureAsync: jest.fn(() => Promise.resolve()),
  allowScreenCaptureAsync: jest.fn(() => Promise.resolve()),
  addScreenshotListener: jest.fn(() => ({ remove: jest.fn() })),
}));

const preventScreenCaptureAsync = jest.mocked(
  ScreenCapture.preventScreenCaptureAsync
);
const allowScreenCaptureAsync = jest.mocked(
  ScreenCapture.allowScreenCaptureAsync
);
const addScreenshotListener = jest.mocked(ScreenCapture.addScreenshotListener);

async function flush(): Promise<void> {
  for (let step = 0; step < 8; step += 1) {
    await Promise.resolve();
  }
}

describe('screenCaptureProtection', () => {
  beforeEach(() => {
    resetScreenCaptureProtectionForTests();
    jest.clearAllMocks();
  });

  it('keeps capture blocked until the last protected screen releases it', async () => {
    const releaseFirst = holdScreenCaptureProtection();
    const releaseSecond = holdScreenCaptureProtection();
    await flush();

    expect(preventScreenCaptureAsync).toHaveBeenCalledTimes(1);
    expect(preventScreenCaptureAsync).toHaveBeenCalledWith(
      'copyrighted-content'
    );

    releaseFirst();
    await flush();
    expect(allowScreenCaptureAsync).not.toHaveBeenCalled();

    releaseSecond();
    await flush();
    expect(allowScreenCaptureAsync).toHaveBeenCalledTimes(1);
    expect(allowScreenCaptureAsync).toHaveBeenCalledWith('copyrighted-content');
  });

  it('does not block capture when protection is released before it starts', async () => {
    const release = holdScreenCaptureProtection();
    release();
    await flush();

    expect(preventScreenCaptureAsync).not.toHaveBeenCalled();
    expect(allowScreenCaptureAsync).toHaveBeenCalledTimes(1);
  });

  it('logs a failed block and still releases later', async () => {
    const error = new Error('native unavailable');
    preventScreenCaptureAsync.mockRejectedValueOnce(error);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const release = holdScreenCaptureProtection();
    await flush();
    expect(errorSpy).toHaveBeenCalledWith(
      'Failed to prevent screen capture:',
      error
    );

    release();
    await flush();
    expect(allowScreenCaptureAsync).toHaveBeenCalledTimes(1);
    errorSpy.mockRestore();
  });

  it('forwards screenshot listeners', () => {
    const listener = jest.fn();
    const remove = jest.fn();
    addScreenshotListener.mockReturnValueOnce({ remove });

    const unsubscribe = subscribeToScreenshots(listener);
    expect(addScreenshotListener).toHaveBeenCalledWith(listener);

    unsubscribe();
    expect(remove).toHaveBeenCalledTimes(1);
  });

  it('does nothing on web', async () => {
    const os = jest.replaceProperty(Platform, 'OS', 'web');

    const release = holdScreenCaptureProtection();
    release();
    await flush();
    subscribeToScreenshots(jest.fn())();

    expect(preventScreenCaptureAsync).not.toHaveBeenCalled();
    expect(allowScreenCaptureAsync).not.toHaveBeenCalled();
    expect(addScreenshotListener).not.toHaveBeenCalled();
    os.restore();
  });
});
