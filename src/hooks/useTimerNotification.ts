import {
  cancelScheduledNotification,
  scheduleTimerFinishedNotification,
  setupTimerNotifications,
} from '@/src/services/localNotifications';
import { useCallback, useEffect, useRef } from 'react';

export function useTimerNotification() {
  const notificationIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    setupTimerNotifications().catch((error) => {
      if (isMounted) {
        console.error('Error setting up timer notifications:', error);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const cancelTimerNotification = useCallback(async () => {
    const notificationId = notificationIdRef.current;
    if (!notificationId) return;

    try {
      await cancelScheduledNotification(notificationId);
    } catch (error) {
      console.warn('Failed to cancel scheduled timer notification:', error);
    } finally {
      notificationIdRef.current = null;
    }
  }, []);

  const scheduleTimerNotification = useCallback(
    async (durationSeconds: number) => {
      await cancelTimerNotification();

      const identifier = await scheduleTimerFinishedNotification(durationSeconds);
      notificationIdRef.current = identifier;
    },
    [cancelTimerNotification]
  );

  return {
    scheduleTimerNotification,
    cancelTimerNotification,
  };
}
