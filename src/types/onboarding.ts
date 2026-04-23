export type OnboardingGender = 'male' | 'female' | 'prefer_not_to_say';

export type OnboardingInterest =
  | 'crossfit'
  | 'hyrox'
  | 'strength'
  | 'powerlifting'
  | 'conditioning'
  | 'olympic_lifting'
  | 'mobility'
  | 'endurance';

export type OnboardingExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type OnboardingProfile = {
  name?: string;
  gender?: OnboardingGender;
  interests?: OnboardingInterest[];
  experienceLevel?: OnboardingExperienceLevel;
  iCloudSyncEnabled?: boolean;
};
