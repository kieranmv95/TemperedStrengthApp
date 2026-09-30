import {
  canUseLocalNotifications,
  cancelScheduledNotification,
} from '@/src/services/localNotifications';
import { formatLocalYMD } from '@/src/services/streakService';
import type { Supplement } from '@/src/types/supplements';
import { isSupplementEditable } from '@/src/utils/checkin/caps';
import { addLocalDays, expectedTimesForDate } from '@/src/utils/checkin/schedule';
import {
  getCheckinSettings,
  getSupplements,
} from '@/src/utils/storage/checkin';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

const SUPPLEMENT_NOTIF_PREFIX = 'checkin_supp_';
/** Reserve headroom under iOS 64 for the rest timer and other one-offs. */
const MAX_SUPPLEMENT_PENDING = 50;
const ROLLING_DAYS = 7;

type NotificationsModule = typeof import('expo-notifications');

function getNotificationsModule(): NotificationsModule | null {
  if (!canUseLocalNotifications()) {
    return null;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-notifications') as NotificationsModule;
  } catch {
    return null;
  }
}

export function supplementNotificationId(
  supplementId: string,
  date: string,
  time: string
): string {
  return `${SUPPLEMENT_NOTIF_PREFIX}${supplementId}_${date}_${time}`;
}

export function isSupplementNotificationId(id: string): boolean {
  return id.startsWith(SUPPLEMENT_NOTIF_PREFIX);
}

export async function getNotificationPermissionStatus(): Promise<
  'granted' | 'denied' | 'undetermined' | 'unavailable'
> {
  const Notifications = getNotificationsModule();
  if (!Notifications) return 'unavailable';
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return 'granted';
  if (settings.canAskAgain === false) return 'denied';
  return settings.status === 'undetermined' ? 'undetermined' : 'denied';
}

/**
 * Request permission when the user first enables reminders.
 * Returns true if granted.
 */
export async function requestSupplementReminderPermission(): Promise<boolean> {
  const Notifications = getNotificationsModule();
  if (!Notifications) return false;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  const status = await Notifications.requestPermissionsAsync();
  return status.status === 'granted';
}

async function cancelAllSupplementNotifications(): Promise<void> {
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  const pending = await Notifications.getAllScheduledNotificationsAsync();
  for (const item of pending) {
    if (isSupplementNotificationId(item.identifier)) {
      await cancelScheduledNotification(item.identifier);
    }
  }
}

function parseLocalDateTime(date: string, time: string): Date | null {
  const [ys, ms, ds] = date.split('-');
  const [hs, mins] = time.split(':');
  const y = Number(ys);
  const m = Number(ms);
  const d = Number(ds);
  const h = Number(hs);
  const min = Number(mins);
  if (
    ![y, m, d, h, min].every((n) => Number.isFinite(n)) ||
    m < 1 ||
    m > 12 ||
    d < 1 ||
    d > 31 ||
    h < 0 ||
    h > 23 ||
    min < 0 ||
    min > 59
  ) {
    return null;
  }
  return new Date(y, m - 1, d, h, min, 0, 0);
}

function shouldScheduleSupplement(
  supplement: Supplement,
  isPro: boolean,
  lapsePending: boolean,
  editableSupplementId: string | null
): boolean {
  if (!supplement.remindersEnabled) return false;
  if (supplement.status !== 'active') return false;
  return isSupplementEditable({
    isPro,
    supplementId: supplement.id,
    status: supplement.status,
    lapsePending,
    editableSupplementId,
  });
}

/**
 * Cancel and rebuild the rolling window of supplement reminders.
 * Safe to call often (foreground, after edits). No-ops without permission.
 */
export async function rebuildSupplementReminders(input?: {
  isPro?: boolean;
}): Promise<void> {
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  const permission = await getNotificationPermissionStatus();
  if (permission !== 'granted') {
    await cancelAllSupplementNotifications();
    return;
  }

  const [supplements, settings] = await Promise.all([
    getSupplements(),
    getCheckinSettings(),
  ]);
  const isPro = input?.isPro === true;

  await cancelAllSupplementNotifications();

  const today = formatLocalYMD(new Date());
  const now = Date.now();
  type Planned = {
    id: string;
    supplement: Supplement;
    date: string;
    time: string;
    trigger: Date;
  };
  const planned: Planned[] = [];

  for (let dayOffset = 0; dayOffset < ROLLING_DAYS; dayOffset++) {
    const date = addLocalDays(today, dayOffset);
    for (const supplement of supplements) {
      if (
        !shouldScheduleSupplement(
          supplement,
          isPro,
          settings.lapsePending,
          settings.editableSupplementId
        )
      ) {
        continue;
      }
      const times = expectedTimesForDate(supplement.schedule, date);
      for (const time of times) {
        const trigger = parseLocalDateTime(date, time);
        if (!trigger || trigger.getTime() <= now) {
          continue;
        }
        planned.push({
          id: supplementNotificationId(supplement.id, date, time),
          supplement,
          date,
          time,
          trigger,
        });
      }
    }
  }

  planned.sort((a, b) => a.trigger.getTime() - b.trigger.getTime());
  const toSchedule = planned.slice(0, MAX_SUPPLEMENT_PENDING);

  for (const item of toSchedule) {
    await Notifications.scheduleNotificationAsync({
      identifier: item.id,
      content: {
        title: 'Supplement reminder',
        body: `${item.supplement.name} — ${item.time}`,
        data: {
          type: 'checkin_supplement',
          supplementId: item.supplement.id,
          date: item.date,
          time: item.time,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: item.trigger,
      },
    });
  }
}

let responseListenerAttached = false;

export function setupSupplementNotificationResponseListener(): void {
  if (responseListenerAttached) return;
  const Notifications = getNotificationsModule();
  if (!Notifications) return;

  responseListenerAttached = true;
  Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as {
      type?: string;
    } | null;
    if (data?.type === 'checkin_supplement') {
      router.push('/checkin');
    }
  });
}

/**
 * Hook: rebuild reminders on foreground. Pass isPro from subscription context.
 */
export function useSupplementReminderScheduler(isPro: boolean): void {
  const isProRef = useRef(isPro);
  isProRef.current = isPro;

  useEffect(() => {
    setupSupplementNotificationResponseListener();
    void rebuildSupplementReminders({ isPro: isProRef.current });

    const onChange = (state: AppStateStatus) => {
      if (state === 'active') {
        void rebuildSupplementReminders({ isPro: isProRef.current });
      }
    };
    const sub = AppState.addEventListener('change', onChange);
    return () => {
      sub.remove();
    };
  }, [isPro]);
}
