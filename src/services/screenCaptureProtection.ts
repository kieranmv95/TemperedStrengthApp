import { Platform } from 'react-native';

type ScreenCaptureModule = typeof import('expo-screen-capture');

const PROTECTION_KEY = 'copyrighted-content';

/** Signed-in accounts that may screenshot and record copyrighted sessions. */
const SCREEN_CAPTURE_EXEMPT_EMAILS = new Set([
  'kieran.venison@icloud.com',
  'charlotte.venison@icloud.com',
]);

export function isScreenCaptureExemptEmail(
  email: string | null | undefined
): boolean {
  if (typeof email !== 'string') return false;
  return SCREEN_CAPTURE_EXEMPT_EMAILS.has(email.trim().toLowerCase());
}

let moduleCache: ScreenCaptureModule | null | undefined;
let holders = 0;
let queue: Promise<void> = Promise.resolve();

/**
 * Screen capture is a native module. Load it on first use so a build that
 * does not include it yet keeps the workout screens usable.
 */
function getScreenCapture(): ScreenCaptureModule | null {
  if (Platform.OS === 'web') {
    return null;
  }
  if (moduleCache !== undefined) {
    return moduleCache;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const loaded = require('expo-screen-capture') as ScreenCaptureModule;
    moduleCache =
      typeof loaded.preventScreenCaptureAsync === 'function' ? loaded : null;
  } catch (error) {
    console.error('Failed to load screen capture protection:', error);
    moduleCache = null;
  }
  return moduleCache;
}

function enqueue(task: () => Promise<void>): void {
  queue = queue.then(task, task);
}

/**
 * Blank screenshots and recordings while protected content is on screen.
 * Holders share one native lock so leaving one screen does not re-enable
 * capture while another protected screen is still visible.
 */
export function holdScreenCaptureProtection(): () => void {
  const screenCapture = getScreenCapture();
  if (!screenCapture) {
    return () => undefined;
  }

  holders += 1;
  if (holders === 1) {
    enqueue(async () => {
      if (holders === 0) return;
      try {
        await screenCapture.preventScreenCaptureAsync(PROTECTION_KEY);
      } catch (error) {
        console.error('Failed to prevent screen capture:', error);
      }
    });
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders -= 1;
    if (holders > 0) return;
    enqueue(async () => {
      if (holders > 0) return;
      try {
        await screenCapture.allowScreenCaptureAsync(PROTECTION_KEY);
      } catch (error) {
        console.error('Failed to allow screen capture:', error);
      }
    });
  };
}

/** Fires when the user takes a screenshot. No-ops when capture detection is unavailable. */
export function subscribeToScreenshots(listener: () => void): () => void {
  const screenCapture = getScreenCapture();
  if (!screenCapture) {
    return () => undefined;
  }
  const subscription = screenCapture.addScreenshotListener(listener);
  return () => subscription.remove();
}

export function resetScreenCaptureProtectionForTests(): void {
  holders = 0;
  queue = Promise.resolve();
  moduleCache = undefined;
}
