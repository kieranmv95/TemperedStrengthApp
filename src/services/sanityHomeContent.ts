import {
  invalidateSanityAppConfigCache,
  loadHomeRemoteNotificationBanner,
  type HomeRemoteNotificationBanner,
} from '@/src/services/sanityAppConfig';
import {
  invalidateSanitySponsorAdsCache,
  loadAllSponsorAds,
  type HomeSponsorAd,
} from '@/src/services/sanitySponsorAds';
import {
  invalidateSanitySkillsCache,
  loadSkills,
} from '@/src/services/sanitySkills';
import type { SkillSummary } from '@/src/types/skills';

export type SanityHomeContent = {
  notification: HomeRemoteNotificationBanner | null;
  shopAds: HomeSponsorAd[];
  skills: SkillSummary[];
};

/** Clears AsyncStorage caches for notification, shop ads, and skills. */
export async function invalidateSanityHomeContentCache(): Promise<void> {
  await Promise.all([
    invalidateSanityAppConfigCache(),
    invalidateSanitySponsorAdsCache(),
    invalidateSanitySkillsCache(),
  ]);
}

/**
 * Clears caches and fetches notification, shop ads, and skills from Sanity.
 * Use for dev refresh and after CMS publishes.
 */
export async function refreshSanityHomeContent(): Promise<SanityHomeContent> {
  await invalidateSanityHomeContentCache();
  const [notification, shopAds, skills] = await Promise.all([
    loadHomeRemoteNotificationBanner({ forceRefresh: true }),
    loadAllSponsorAds({ forceRefresh: true }),
    loadSkills({ forceRefresh: true }),
  ]);
  return { notification, shopAds, skills };
}
