import { CopyrightedContentGuard } from '@/src/components/copyright/CopyrightedContentGuard';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { resetScreenCaptureProtectionForTests } from '@/src/services/screenCaptureProtection';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useIsFocused } from 'expo-router';
import * as ScreenCapture from 'expo-screen-capture';

jest.mock('expo-router', () => ({
  useIsFocused: jest.fn(() => true),
}));

jest.mock('@/src/hooks/sync-manager-context', () => ({
  useSyncManager: jest.fn(),
}));

jest.mock('expo-screen-capture', () => ({
  preventScreenCaptureAsync: jest.fn(() => Promise.resolve()),
  allowScreenCaptureAsync: jest.fn(() => Promise.resolve()),
  addScreenshotListener: jest.fn(() => ({ remove: jest.fn() })),
}));

const useIsFocusedMock = jest.mocked(useIsFocused);
const useSyncManagerMock = jest.mocked(useSyncManager);
const preventScreenCaptureAsync = jest.mocked(
  ScreenCapture.preventScreenCaptureAsync
);
const addScreenshotListener = jest.mocked(ScreenCapture.addScreenshotListener);

async function flush(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe('CopyrightedContentGuard', () => {
  beforeEach(() => {
    resetScreenCaptureProtectionForTests();
    jest.clearAllMocks();
    useIsFocusedMock.mockReturnValue(true);
    useSyncManagerMock.mockReturnValue({
      user: null,
    } as ReturnType<typeof useSyncManager>);
  });

  it('blocks capture while the protected screen is focused', async () => {
    const view = await render(<CopyrightedContentGuard active />);
    await flush();

    expect(preventScreenCaptureAsync).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  it.each([
    'kieran.venison@icloud.com',
    'charlotte.venison@icloud.com',
    'Kieran.Venison@iCloud.com',
  ])('allows capture for signed-in %s', async (email) => {
    useSyncManagerMock.mockReturnValue({
      user: { email },
    } as ReturnType<typeof useSyncManager>);

    await render(<CopyrightedContentGuard active />);
    await flush();

    expect(preventScreenCaptureAsync).not.toHaveBeenCalled();
    expect(addScreenshotListener).not.toHaveBeenCalled();
  });

  it('still blocks capture for other signed-in accounts', async () => {
    useSyncManagerMock.mockReturnValue({
      user: { email: 'someone@example.com' },
    } as ReturnType<typeof useSyncManager>);

    const view = await render(<CopyrightedContentGuard active />);
    await flush();

    expect(preventScreenCaptureAsync).toHaveBeenCalledTimes(1);
    expect(addScreenshotListener).toHaveBeenCalledTimes(1);
    view.unmount();
  });

  it('leaves capture alone when the screen is in the background', async () => {
    useIsFocusedMock.mockReturnValue(false);
    await render(<CopyrightedContentGuard active />);
    await flush();

    expect(preventScreenCaptureAsync).not.toHaveBeenCalled();
    expect(addScreenshotListener).not.toHaveBeenCalled();
  });

  it('covers the screen with a copyright notice after a screenshot', async () => {
    let onScreenshot: (() => void) | undefined;
    addScreenshotListener.mockImplementation((listener) => {
      onScreenshot = listener;
      return { remove: jest.fn() };
    });

    await render(<CopyrightedContentGuard active />);
    await flush();

    expect(screen.queryByText('Copyrighted content')).toBeNull();

    await act(async () => {
      onScreenshot?.();
    });

    expect(
      screen.getByRole('header', { name: 'Copyrighted content' })
    ).toBeTruthy();
    expect(
      screen.getByText('This session can’t be captured or shared.')
    ).toBeTruthy();

    await fireEvent.press(
      screen.getByRole('button', { name: 'Dismiss copyright notice' })
    );
    expect(screen.queryByText('Copyrighted content')).toBeNull();
  });
});
