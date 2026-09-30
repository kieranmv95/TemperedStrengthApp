import { useSubscription } from '@/src/hooks/use-subscription';
import { useSupplementReminderScheduler } from '@/src/services/supplementReminders';

/**
 * Mounts inside SubscriptionProvider to rebuild supplement reminders on
 * foreground and when Pro entitlement changes.
 */
export function SupplementReminderBridge() {
  const { isPro } = useSubscription();
  useSupplementReminderScheduler(isPro);
  return null;
}
