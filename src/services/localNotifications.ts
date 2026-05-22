import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

type NotificationsModule = typeof import('expo-notifications');

let moduleCache: NotificationsModule | null | undefined;

/**
 * Local timer notifications are unavailable in Expo Go on Android (SDK 53+).
 * Use a development build to test. Avoid importing expo-notifications at module
 * scope so Expo Go does not throw on app load.
 */
export function canUseLocalNotifications(): boolean {
  return !(isRunningInExpoGo() && Platform.OS === 'android');
}

function getNotificationsModule(): NotificationsModule | null {
  if (!canUseLocalNotifications()) {
    return null;
  }
  if (moduleCache === undefined) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      moduleCache = require('expo-notifications') as NotificationsModule;
    } catch (error) {
      console.error('Failed to load expo-notifications:', error);
      moduleCache = null;
    }
  }
  return moduleCache;
}

export async function setupTimerNotifications(): Promise<void> {
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const status = await Notifications.requestPermissionsAsync();
  if (status.status !== 'granted') {
    console.log('Notification permissions not granted');
  }
}

export async function cancelScheduledNotification(
  identifier: string
): Promise<void> {
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleTimerFinishedNotification(
  durationSeconds: number
): Promise<string | null> {
  const Notifications = getNotificationsModule();
  if (!Notifications) return null;

  const seconds = Math.max(0, durationSeconds);
  if (seconds <= 0) return null;

  const triggerDate = new Date(Date.now() + seconds * 1000);

  return Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Timer Finished — get back to work!',
      body: '',
      data: { timerFinished: true },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}
