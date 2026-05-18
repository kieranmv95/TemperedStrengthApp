import {
  invalidateSanityAppConfigCache,
  loadHomeRemoteNotificationBanner,
  type HomeRemoteNotificationBanner,
} from '@/src/services/sanityAppConfig';
import {
  invalidateSanitySponsorAdsCache,
  loadHomeSponsorAds,
  type HomeSponsorAd,
} from '@/src/services/sanitySponsorAds';

export type SanityHomeContent = {
  notification: HomeRemoteNotificationBanner | null;
  sponsorAds: HomeSponsorAd[];
};

/** Clears AsyncStorage caches for notification + sponsor ads. */
export async function invalidateSanityHomeContentCache(): Promise<void> {
  await Promise.all([
    invalidateSanityAppConfigCache(),
    invalidateSanitySponsorAdsCache(),
  ]);
}

/**
 * Clears caches and fetches notification + sponsor ads from Sanity.
 * Use for dev refresh and after CMS publishes.
 */
export async function refreshSanityHomeContent(): Promise<SanityHomeContent> {
  await invalidateSanityHomeContentCache();
  const [notification, sponsorAds] = await Promise.all([
    loadHomeRemoteNotificationBanner({ forceRefresh: true }),
    loadHomeSponsorAds({ forceRefresh: true }),
  ]);
  return { notification, sponsorAds };
}
