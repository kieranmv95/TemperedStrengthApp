import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

const NOTIFICATION_CHANNEL_ID = 'rest-timer';
const NOTIFICATION_TITLE = '⏰ Timer Finished — get back to work!';

export function useTimerNotification() {
  const notificationIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const setupNotifications = async () => {
      // Ensure foreground notifications display correctly.
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      // On Android 13+, the OS permission prompt is triggered only after at least
      // one notification channel exists, so create a channel before requesting
      // permissions.
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(
          NOTIFICATION_CHANNEL_ID,
          {
            name: 'Rest Timer',
            importance: Notifications.AndroidImportance.MAX,
          }
        );
      }

      const status = await Notifications.requestPermissionsAsync();

      if (!isMounted) return;
      if (status.status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    };

    setupNotifications().catch((error) => {
      console.error('Error setting up timer notifications:', error);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const cancelTimerNotification = useCallback(async () => {
    const notificationId = notificationIdRef.current;
    if (!notificationId) return;

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      // Cancellation can legitimately fail if the notification already fired.
      console.warn('Failed to cancel scheduled timer notification:', error);
    } finally {
      notificationIdRef.current = null;
    }
  }, []);

  const scheduleTimerNotification = useCallback(
    async (durationSeconds: number) => {
      const seconds = Math.max(0, durationSeconds);
      if (seconds <= 0) return;

      // Avoid duplicate notifications when restarting a timer.
      await cancelTimerNotification();

      const triggerDate = new Date(Date.now() + seconds * 1000);

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: NOTIFICATION_TITLE,
          body: '',
          data: { timerFinished: true },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerDate,
          channelId: NOTIFICATION_CHANNEL_ID,
        },
      });

      notificationIdRef.current = identifier;
    },
    [cancelTimerNotification]
  );

  return {
    scheduleTimerNotification,
    cancelTimerNotification,
  };
}
