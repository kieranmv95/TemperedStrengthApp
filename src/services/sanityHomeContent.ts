import {
  invalidateSanityAppConfigCache,
  loadHomeRemoteNotificationBanner,
  type HomeRemoteNotificationBanner,
} from '@/src/services/sanityAppConfig';
import {
  invalidateSanitySponsorAdsCache,
  loadAllSponsorAds,
  loadHomeSponsorAds,
  type HomeSponsorAd,
} from '@/src/services/sanitySponsorAds';
import {
  invalidateSanitySkillsCache,
  loadSkills,
} from '@/src/services/sanitySkills';
import type { Skill } from '@/src/types/skills';

export type SanityHomeContent = {
  notification: HomeRemoteNotificationBanner | null;
  sponsorAds: HomeSponsorAd[];
  shopAds: HomeSponsorAd[];
  skills: Skill[];
};

/** Clears AsyncStorage caches for notification, sponsor ads, and skills. */
export async function invalidateSanityHomeContentCache(): Promise<void> {
  await Promise.all([
    invalidateSanityAppConfigCache(),
    invalidateSanitySponsorAdsCache(),
    invalidateSanitySkillsCache(),
  ]);
}

/**
 * Clears caches and fetches notification, sponsor ads, and skills from Sanity.
 * Use for dev refresh and after CMS publishes.
 */
export async function refreshSanityHomeContent(): Promise<SanityHomeContent> {
  await invalidateSanityHomeContentCache();
  const [notification, sponsorAds, shopAds, skills] = await Promise.all([
    loadHomeRemoteNotificationBanner({ forceRefresh: true }),
    loadHomeSponsorAds({ forceRefresh: true }),
    loadAllSponsorAds({ forceRefresh: true }),
    loadSkills({ forceRefresh: true }),
  ]);
  return { notification, sponsorAds, shopAds, skills };
}
