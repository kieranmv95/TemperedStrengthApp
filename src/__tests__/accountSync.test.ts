import AsyncStorage from '@react-native-async-storage/async-storage';
import { captureAnalyticsEvent } from '@/src/services/posthogClient';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import {
  HAS_ACCOUNT_KEY,
  SYNC_QUEUE_KEY,
  SYNC_TS_PREFIX,
} from '@/src/sync/constants';
import {
  isSyncValueTooLarge,
  KV_SIZE_WARNING_BYTES,
  MAX_SYNC_VALUE_BYTES,
  recordLocalDelete,
  recordLocalSet,
  resetKvSizeLimitReportsForTests,
  utf8ByteLength,
  type SyncOperation,
} from '@/src/sync/syncEngine';
import {
  ACTIVE_ACCOUNT_USER_ID_KEY,
  clearAccountActive,
  getOtpLastSentAt,
  getOtpResendCooldownRemainingSeconds,
  OTP_RESEND_COOLDOWN_MS,
  recordOtpSent,
} from '@/src/sync/accountStorage';
import { OTP_LAST_SENT_AT_KEY } from '@/src/sync/constants';
import { shouldSync } from '@/src/sync/syncedKeys';

jest.mock('@/src/services/posthogClient', () => ({
  captureAnalyticsEvent: jest.fn(),
}));

describe('account sync local queue', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    resetKvSizeLimitReportsForTests();
    jest.mocked(captureAnalyticsEvent).mockClear();
  });

  it('uses an explicit user-data allowlist', () => {
    expect(shouldSync('onboarding_profile')).toBe(true);
    expect(shouldSync('workout_logs')).toBe(true);
    expect(shouldSync('active_session')).toBe(false);
    expect(shouldSync('rest_timer')).toBe(false);
    expect(shouldSync('sanity_sponsor_ads_v1')).toBe(false);
    expect(shouldSync('__sync_queue__')).toBe(false);
  });

  it('does not queue writes before an account exists', async () => {
    await recordLocalSet('workout_logs', '{"day":1}');

    expect(await AsyncStorage.getItem(SYNC_QUEUE_KEY)).toBeNull();
    expect(
      await AsyncStorage.getItem(`${SYNC_TS_PREFIX}workout_logs`)
    ).not.toBeNull();
  });

  it('collapses pending operations by key', async () => {
    await AsyncStorage.setItem(HAS_ACCOUNT_KEY, 'true');

    await recordLocalSet('workout_logs', '{"day":1}');
    await recordLocalSet('workout_logs', '{"day":2}');
    await recordLocalDelete('workout_logs');

    const raw = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    const queue = JSON.parse(raw ?? '[]') as SyncOperation[];
    expect(queue).toHaveLength(1);
    expect(queue[0]).toMatchObject({
      key: 'workout_logs',
      op: 'delete',
    });
  });

  it('measures UTF-8 payload size and rejects oversized values', () => {
    expect(utf8ByteLength('abc')).toBe(3);
    expect(utf8ByteLength('🏋️')).toBeGreaterThan('🏋️'.length);
    expect(isSyncValueTooLarge('a'.repeat(MAX_SYNC_VALUE_BYTES))).toBe(false);
    expect(isSyncValueTooLarge('a'.repeat(MAX_SYNC_VALUE_BYTES + 1))).toBe(
      true
    );
  });

  it('alerts PostHog once when a synced value exceeds the 30% KV warning', async () => {
    const underWarning = 'a'.repeat(KV_SIZE_WARNING_BYTES);
    const overWarning = 'a'.repeat(KV_SIZE_WARNING_BYTES + 1);

    await recordLocalSet('workout_logs', underWarning);
    expect(captureAnalyticsEvent).not.toHaveBeenCalled();

    await recordLocalSet('workout_logs', overWarning);
    await recordLocalSet('workout_logs', overWarning);

    expect(captureAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(captureAnalyticsEvent).toHaveBeenCalledWith(
      posthogEventsNames.sync.kvSizeLimit,
      {
        key: 'workout_logs',
        size_bytes: KV_SIZE_WARNING_BYTES + 1,
        warning_bytes: KV_SIZE_WARNING_BYTES,
        max_bytes: MAX_SYNC_VALUE_BYTES,
        source: 'local_write',
      }
    );
  });

  it('forgets the previous account identity after account deletion', async () => {
    await AsyncStorage.setItem(ACTIVE_ACCOUNT_USER_ID_KEY, 'user-id');

    await clearAccountActive({ forgetUser: true });

    await expect(
      AsyncStorage.getItem(ACTIVE_ACCOUNT_USER_ID_KEY)
    ).resolves.toBeNull();
  });

  it('tracks OTP resend cooldown by wall-clock time', async () => {
    const email = 'user@example.com';
    const sentAt = Date.now() - 25_000;

    await recordOtpSent(email);
    const stored = await AsyncStorage.getItem(OTP_LAST_SENT_AT_KEY);
    expect(stored).not.toBeNull();

    const parsed = JSON.parse(stored ?? '{}') as {
      email: string;
      sentAt: number;
    };
    expect(parsed.email).toBe(email);

    expect(getOtpResendCooldownRemainingSeconds(sentAt, sentAt + 25_000)).toBe(
      Math.ceil((OTP_RESEND_COOLDOWN_MS - 25_000) / 1000)
    );
    expect(getOtpResendCooldownRemainingSeconds(sentAt, sentAt + 70_000)).toBe(
      0
    );
    expect(await getOtpLastSentAt('other@example.com')).toBeNull();
    expect(await getOtpLastSentAt(email)).toBe(parsed.sentAt);
  });
});
