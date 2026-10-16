import { isRunningInExpoGo } from 'expo';
import {
  REST_TIMER_ANDROID_NOTIFICATION_ID,
  REST_TIMER_DEEP_LINK,
  type RestTimerSurfacePayload,
  type RestTimerSurfaceStatus,
} from './restTimerSurfaceTypes';

type RestTimerAndroidNotificationProps = {
  label: string;
  untilLabel: string;
  status: RestTimerSurfaceStatus;
};

type CustomNotificationHandle = {
  update: (
    props: RestTimerAndroidNotificationProps,
    options?: Record<string, unknown>
  ) => Promise<void>;
  cancel: () => Promise<void>;
};

type CustomNotificationFactory = {
  post: (
    props: RestTimerAndroidNotificationProps,
    options?: Record<string, unknown>
  ) => Promise<CustomNotificationHandle>;
  get: (id: string) => Promise<CustomNotificationHandle | null>;
  cancelAll: () => Promise<void>;
};

let factoryCache: CustomNotificationFactory | null | undefined;
let activeNotification: CustomNotificationHandle | null = null;

/**
 * Custom lock-screen notifications are unavailable in Expo Go. Use a
 * development build that includes expo-widgets. Avoid importing the widget
 * module at load time so Expo Go does not throw on app start.
 */
function getNotificationFactory(): CustomNotificationFactory | null {
  if (isRunningInExpoGo()) {
    return null;
  }
  if (factoryCache !== undefined) {
    return factoryCache;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    factoryCache = require('@/src/widgets/RestTimerAndroidNotification')
      .default as CustomNotificationFactory;
  } catch (error) {
    console.warn(
      'Rest timer notification unavailable (rebuild the native app with expo-widgets):',
      error
    );
    factoryCache = null;
  }
  return factoryCache;
}

function toProps(
  payload: RestTimerSurfacePayload
): RestTimerAndroidNotificationProps {
  return {
    label: payload.label,
    untilLabel: payload.untilLabel,
    status: payload.status,
  };
}

function remainingMs(endTimeMs: number): number {
  return Math.max(0, endTimeMs - Date.now());
}

export async function startRestTimerSurface(
  payload: RestTimerSurfacePayload
): Promise<void> {
  const factory = getNotificationFactory();
  if (!factory) return;

  try {
    const props = toProps(payload);
    activeNotification = await factory.post(props, {
      id: REST_TIMER_ANDROID_NOTIFICATION_ID,
      ongoing: true,
      autoCancel: false,
      alertOnlyOnce: true,
      title: props.label,
      text:
        props.status === 'complete'
          ? 'Rest complete'
          : `Until ${props.untilLabel}`,
      url: REST_TIMER_DEEP_LINK,
      timeoutAfter: remainingMs(payload.endTimeMs),
    });
  } catch (error) {
    console.warn('Failed to post rest timer notification:', error);
    activeNotification = null;
  }
}

export async function updateRestTimerSurface(
  payload: RestTimerSurfacePayload
): Promise<void> {
  const factory = getNotificationFactory();
  if (!factory) return;

  try {
    const props = toProps(payload);
    const existing =
      activeNotification ??
      (await factory.get(REST_TIMER_ANDROID_NOTIFICATION_ID));

    if (!existing) {
      await startRestTimerSurface(payload);
      return;
    }

    await existing.update(props, {
      ongoing: true,
      autoCancel: false,
      alertOnlyOnce: true,
      title: props.label,
      text:
        props.status === 'complete'
          ? 'Rest complete'
          : `Until ${props.untilLabel}`,
      url: REST_TIMER_DEEP_LINK,
      timeoutAfter: remainingMs(payload.endTimeMs),
    });
    activeNotification = existing;
  } catch (error) {
    console.warn('Failed to update rest timer notification:', error);
    await startRestTimerSurface(payload);
  }
}

export async function endRestTimerSurface(
  _payload?: RestTimerSurfacePayload
): Promise<void> {
  const factory = getNotificationFactory();
  if (!factory) return;

  try {
    const existing =
      activeNotification ??
      (await factory.get(REST_TIMER_ANDROID_NOTIFICATION_ID));
    if (existing) {
      await existing.cancel();
    } else {
      await factory.cancelAll();
    }
  } catch (error) {
    console.warn('Failed to cancel rest timer notification:', error);
  } finally {
    activeNotification = null;
  }
}

export async function syncRestTimerSurface(
  payload: RestTimerSurfacePayload | null
): Promise<void> {
  const factory = getNotificationFactory();
  if (!factory) return;

  if (!payload || payload.status !== 'running') {
    await endRestTimerSurface();
    return;
  }

  if (payload.endTimeMs <= Date.now()) {
    await endRestTimerSurface();
    return;
  }

  try {
    const existing = await factory.get(REST_TIMER_ANDROID_NOTIFICATION_ID);
    activeNotification = existing;
    if (existing) {
      await updateRestTimerSurface(payload);
      return;
    }
    await startRestTimerSurface(payload);
  } catch (error) {
    console.warn('Failed to sync rest timer notification:', error);
  }
}
