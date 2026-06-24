import { OnboardingOptionCard } from '@/src/components/onboarding/OnboardingOptionCard';
import { OnboardingProgressBar } from '@/src/components/onboarding/OnboardingProgressBar';
import { onboardingStyles as styles } from '@/src/components/onboarding/onboardingStyles';
import { Colors } from '@/src/constants/theme';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type {
  OnboardingExperienceLevel,
  OnboardingGender,
  OnboardingInterest,
  OnboardingProfile,
} from '@/src/types/onboarding';
import { isIos } from '@/src/utils/platform';
import {
  getOnboardingProfile,
  getWeightUnit,
  setOnboarded,
  setOnboardingProfile,
  setWeightUnit,
  type WeightUnit,
} from '@/src/utils/storage';
import { useEventListener } from 'expo';
import { router, type Href } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppSafeAreaView } from '@/src/components/AppSafeAreaView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TOTAL_STEPS = 8;
const ICLOUD_STEP_INDEX = 6;
const WELCOME_STEP_INDEX = 7;
const ONBOARDING_GENDER_IMAGES = {
  female: require('@/assets/images/onboarding/FEMALE.png'),
  male: require('@/assets/images/onboarding/MALE.png'),
} as const;
const TOTAL_PROGRESS_STEPS = isIos ? TOTAL_STEPS - 1 : TOTAL_STEPS - 2;

function nextStepIndex(current: number): number {
  if (!isIos && current === ICLOUD_STEP_INDEX - 1) {
    return WELCOME_STEP_INDEX;
  }
  return current + 1;
}

function prevStepIndex(current: number): number {
  if (!isIos && current === WELCOME_STEP_INDEX) {
    return ICLOUD_STEP_INDEX - 1;
  }
  return current - 1;
}

function progressStepForIndex(stepIndex: number): number {
  if (stepIndex <= 0) return 1;
  if (!isIos && stepIndex >= WELCOME_STEP_INDEX) {
    return TOTAL_PROGRESS_STEPS;
  }
  return Math.min(stepIndex, TOTAL_PROGRESS_STEPS);
}

function onboardingStepName(stepIndex: number): string {
  switch (stepIndex) {
    case 1:
      return 'name';
    case 2:
      return 'gender';
    case 3:
      return 'interests';
    case 4:
      return 'experience';
    case 5:
      return 'weight_units';
    case 6:
      return 'icloud_backup';
    case 7:
      return 'welcome_final';
    default:
      return `step_${stepIndex}`;
  }
}

const GENDER_OPTIONS: { value: OnboardingGender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const INTEREST_OPTIONS: { value: OnboardingInterest; label: string }[] = [
  { value: 'crossfit', label: 'CrossFit' },
  { value: 'hyrox', label: 'Hyrox' },
  { value: 'strength', label: 'Strength' },
  { value: 'powerlifting', label: 'Powerlifting' },
  { value: 'bodybuilding', label: 'Bodybuilding' },
  { value: 'hypertrophy', label: 'Build Muscle' },
  { value: 'conditioning', label: 'Conditioning' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'olympic_lifting', label: 'Olympic Lifting' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'fat_loss', label: 'Fat Loss' },
];

const EXPERIENCE_OPTIONS: {
  value: OnboardingExperienceLevel;
  label: string;
}[] = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

function OnboardingFlow() {
  const insets = useSafeAreaInsets();
  const posthog = usePostHog();
  const {
    enabled: iCloudSyncEnabled,
    isAvailable,
    setEnabled,
  } = useSyncManager();

  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<OnboardingProfile>({});
  const [introDone, setIntroDone] = useState(false);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<OnboardingGender | null>(null);
  const [interests, setInterests] = useState<OnboardingInterest[]>([]);
  const [experienceLevel, setExperienceLevel] =
    useState<OnboardingExperienceLevel | null>(null);
  const [iCloudStepToggle, setICloudStepToggle] = useState(false);
  const [iCloudSaving, setICloudSaving] = useState(false);
  const [weightUnitStep, setWeightUnitStep] = useState<WeightUnit>('kg');
  const [weightUnitSaving, setWeightUnitSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Preload any existing profile so "Update Preferences" replays with current values.
  // If no stored preference exists, default the iCloud toggle to the current
  // sync manager state.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const existingWeightUnit = await getWeightUnit();
      if (cancelled) return;
      setWeightUnitStep(existingWeightUnit);

      const existing = await getOnboardingProfile();
      if (cancelled) return;
      if (!existing) {
        if (isIos) {
          setICloudStepToggle(iCloudSyncEnabled);
        }
        return;
      }
      setProfile(existing);
      if (existing.name) setName(existing.name);
      if (existing.gender) setGender(existing.gender);
      if (existing.interests) setInterests(existing.interests);
      if (existing.experienceLevel)
        setExperienceLevel(existing.experienceLevel);
      if (isIos) {
        setICloudStepToggle(
          typeof existing.iCloudSyncEnabled === 'boolean'
            ? existing.iCloudSyncEnabled
            : iCloudSyncEnabled
        );
      }
    })();
    return () => {
      cancelled = true;
    };
    // We intentionally only want to run this on mount; `iCloudSyncEnabled` is
    // only used to pick a sensible default when no preference exists.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fade = useRef(new Animated.Value(1)).current;

  const animateStepChange = useCallback(
    (updateStep: () => void) => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }).start(() => {
        updateStep();
        Animated.timing(fade, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }).start();
      });
    },
    [fade]
  );

  const goToNameStep = useCallback(() => {
    if (introDone || completing) return;
    setIntroDone(true);
    animateStepChange(() => setStepIndex(1));
  }, [animateStepChange, completing, introDone]);

  const introVideoPlayer = useVideoPlayer(
    require('../../assets/onboarding.mp4'),
    (player) => {
      player.loop = false;
      player.muted = true;
      player.play();
    }
  );

  useEventListener(introVideoPlayer, 'playToEnd', () => {
    goToNameStep();
  });

  const skipIntro = useCallback(() => {
    posthog.capture(posthogEventsNames.onboarding.skip, {
      step_name: 'intro',
    });
    goToNameStep();
  }, [posthog, goToNameStep]);

  const toggleInterest = (value: OnboardingInterest) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const completeOnboarding = async (
    finalProfile: OnboardingProfile,
    destination: Href = '/'
  ) => {
    setCompleting(true);
    try {
      await setOnboardingProfile(finalProfile);
      await setOnboarded(true);
      router.replace(destination);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert(
        'Something went wrong',
        'We could not save your preferences. Please try again.'
      );
      setCompleting(false);
    }
  };

  const advanceOrFinish = (nextProfile: OnboardingProfile) => {
    if (stepIndex >= TOTAL_STEPS - 1) {
      completeOnboarding(nextProfile);
      return;
    }
    setProfile(nextProfile);
    animateStepChange(() => setStepIndex((i) => nextStepIndex(i)));
  };

  const handleSkipStep = () => {
    // Advance without committing this step's field to the profile.
    if (stepIndex === 0) {
      goToNameStep();
      return;
    }
    posthog.capture(posthogEventsNames.onboarding.skip, {
      step_name: onboardingStepName(stepIndex),
    });
    if (stepIndex >= TOTAL_STEPS - 1) {
      completeOnboarding(profile);
      return;
    }
    animateStepChange(() => setStepIndex((i) => nextStepIndex(i)));
  };

  const handleBackStep = () => {
    if (stepIndex <= 1) return;
    animateStepChange(() => setStepIndex((i) => Math.max(1, prevStepIndex(i))));
  };

  const handleSkipSetup = () => {
    Alert.alert(
      'Skip setup?',
      'You can run onboarding again any time from Account.',
      [
        { text: 'Go back', style: 'cancel' },
        {
          text: 'Skip anyway',
          style: 'destructive',
          onPress: () => {
            posthog.capture(posthogEventsNames.onboarding.sectionSkip, {
              section_name: 'full_setup',
            });
            completeOnboarding(profile);
          },
        },
      ]
    );
  };

  const handleContinueName = () => {
    const trimmed = name.trim();
    const next: OnboardingProfile = { ...profile };
    if (trimmed.length > 0) {
      next.name = trimmed;
    }
    advanceOrFinish(next);
  };

  const handleContinueGender = () => {
    const next: OnboardingProfile = { ...profile };
    if (gender) next.gender = gender;
    advanceOrFinish(next);
  };

  const handleContinueInterests = () => {
    const next: OnboardingProfile = { ...profile };
    if (interests.length > 0) next.interests = interests;
    advanceOrFinish(next);
  };

  const handleContinueExperience = () => {
    const next: OnboardingProfile = { ...profile };
    if (experienceLevel) next.experienceLevel = experienceLevel;
    advanceOrFinish(next);
  };

  const handleContinueWeightUnit = async () => {
    setWeightUnitSaving(true);
    try {
      await setWeightUnit(weightUnitStep);
      advanceOrFinish(profile);
    } catch (error) {
      console.error('Error saving weight unit during onboarding:', error);
      Alert.alert(
        'Something went wrong',
        'We could not save your weight unit preference. Please try again.'
      );
    } finally {
      setWeightUnitSaving(false);
    }
  };

  const handleContinueICloud = async () => {
    setICloudSaving(true);
    try {
      if (iCloudStepToggle) {
        const result = await setEnabled(true);
        if (!result.isAvailable) {
          Alert.alert(
            'iCloud Unavailable',
            "We couldn't access iCloud on this device/account. Your data will remain local only."
          );
          await setEnabled(false);
          advanceOrFinish({ ...profile, iCloudSyncEnabled: false });
          return;
        }
        advanceOrFinish({ ...profile, iCloudSyncEnabled: true });
      } else {
        if (iCloudSyncEnabled) {
          await setEnabled(false);
        }
        advanceOrFinish({ ...profile, iCloudSyncEnabled: false });
      }
    } catch (error) {
      console.error('Error updating iCloud sync during onboarding:', error);
      Alert.alert(
        'Something went wrong',
        'We could not update iCloud sync. Please try again.'
      );
    } finally {
      setICloudSaving(false);
    }
  };

  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return null;
      case 1:
        return (
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>What can we call you?</Text>
            <Text style={styles.stepSubtitle}>
              Add a name or nickname so we can make the app feel a bit more personal.
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={Colors.textPlaceholder}
              style={styles.textInput}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleContinueName}
              accessibilityLabel="Your name"
              maxLength={40}
            />
          </View>
        );
      case 2:
        return (
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>Gender</Text>
            <Text style={styles.stepSubtitle}>
              This helps us tailor program suggestions.
            </Text>
            <View style={styles.optionList}>
              {GENDER_OPTIONS.map((opt) => (
                <OnboardingOptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={gender === opt.value}
                  onPress={() => setGender(opt.value)}
                />
              ))}
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>What interests you?</Text>
            <Text style={styles.stepSubtitle}>Pick as many as you like.</Text>
            <View style={styles.optionListInline}>
              {INTEREST_OPTIONS.map((opt) => (
                <OnboardingOptionCard
                  key={opt.value}
                  label={opt.label}
                  fullWidth={false}
                  selected={interests.includes(opt.value)}
                  onPress={() => toggleInterest(opt.value)}
                />
              ))}
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>Experience level</Text>
            <Text style={styles.stepSubtitle}>
              How would you describe your training background?
            </Text>
            <View style={styles.optionList}>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <OnboardingOptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={experienceLevel === opt.value}
                  onPress={() => setExperienceLevel(opt.value)}
                />
              ))}
            </View>
          </View>
        );
      case 5:
        return (
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>Weight units</Text>
            <Text style={styles.stepSubtitle}>
              Choose how you want to view and enter weights.
            </Text>
            <View style={styles.optionList}>
              <OnboardingOptionCard
                label="kg"
                selected={weightUnitStep === 'kg'}
                onPress={() => setWeightUnitStep('kg')}
              />
              <OnboardingOptionCard
                label="lb"
                selected={weightUnitStep === 'lb'}
                onPress={() => setWeightUnitStep('lb')}
              />
            </View>
          </View>
        );
      case 6:
        return (
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>Back up to iCloud</Text>
            <Text style={styles.stepSubtitle}>
              Keep your programs, logs, and personal bests safe across devices.
            </Text>
            <View style={styles.iCloudCard}>
              <Text style={styles.iCloudTitle}>iCloud Sync</Text>
              <Text style={styles.iCloudDescription}>
                AsyncStorage stays primary on this device; iCloud is used for
                backup and restore.
              </Text>
              <View style={styles.iCloudRow}>
                <Text style={styles.iCloudToggleLabel}>Enable iCloud Sync</Text>
                <Switch
                  value={iCloudStepToggle}
                  onValueChange={setICloudStepToggle}
                  disabled={iCloudSaving}
                />
              </View>
              {iCloudStepToggle && !isAvailable ? (
                <Text style={styles.iCloudUnavailable}>
                  iCloud is currently unavailable on this device/account.
                </Text>
              ) : null}
            </View>
          </View>
        );
      case 7:
        return (
          <View style={styles.welcomeStepBody}>
            <Text style={styles.welcomeStepTitle}>You’re in.</Text>
            <Text style={styles.welcomeStepSubtitle}>
              Time to lift, log, and level up.
            </Text>
            <Image
              source={
                gender === 'female'
                  ? ONBOARDING_GENDER_IMAGES.female
                  : ONBOARDING_GENDER_IMAGES.male
              }
              style={styles.genderHeroImage}
              resizeMode="contain"
              accessibilityLabel={
                gender === 'female' ? 'Female athlete' : 'Male athlete'
              }
            />
          </View>
        );
      default:
        return null;
    }
  };

  const primaryCta = () => {
    switch (stepIndex) {
      case 0:
        return {
          label: 'Continue',
          onPress: goToNameStep,
          disabled: completing,
        };
      case 1:
        return {
          label: 'Continue',
          onPress: handleContinueName,
          disabled: name.trim().length === 0 || completing,
        };
      case 2:
        return {
          label: 'Continue',
          onPress: handleContinueGender,
          disabled: !gender || completing,
        };
      case 3:
        return {
          label: 'Continue',
          onPress: handleContinueInterests,
          disabled: interests.length === 0 || completing,
        };
      case 4:
        return {
          label: 'Continue',
          onPress: handleContinueExperience,
          disabled: !experienceLevel || completing,
        };
      case 5:
        return {
          label: 'Continue',
          onPress: handleContinueWeightUnit,
          disabled: weightUnitSaving || completing,
        };
      case 6:
        return {
          label: 'Continue',
          onPress: handleContinueICloud,
          disabled: iCloudSaving || completing,
        };
      case 7:
        return {
          label: "Let's go",
          onPress: () => completeOnboarding(profile, '/'),
          disabled: completing,
        };
      default:
        return { label: 'Continue', onPress: () => { }, disabled: true };
    }
  };

  const cta = primaryCta();
  const isLastStep = stepIndex === TOTAL_STEPS - 1;
  const canGoBack = stepIndex > 1;
  const showIntro = stepIndex === 0;
  const progressCurrent = progressStepForIndex(stepIndex);

  const KeyboardWrapper = isIos ? KeyboardAvoidingView : View;

  return (
    <AppSafeAreaView
      style={styles.container}
      edges={
        showIntro
          ? ['top', 'left', 'right', 'bottom']
          : ['top', 'left', 'right']
      }
    >
      <KeyboardWrapper
        style={{ flex: 1 }}
        {...(isIos ? { behavior: 'padding' as const } : {})}
      >
        {showIntro ? (
          <View style={{ flex: 1 }}>
            <VideoView
              player={introVideoPlayer}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
              nativeControls={false}
              accessibilityLabel="Onboarding intro video"
            />

            <View
              style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}
            >
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity
                  onPress={skipIntro}
                  accessibilityRole="button"
                  accessibilityLabel="Skip intro"
                  disabled={completing}
                >
                  <Text
                    style={{ color: Colors.textPrimary, fontSize: 16, fontWeight: '700' }}
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ gap: 12 }} />
            </View>
          </View>
        ) : (
          <View style={styles.stepScreen}>
            <View style={styles.header}>
              <View style={styles.headerRow}>
                <OnboardingProgressBar
                  currentStep={progressCurrent}
                  totalSteps={TOTAL_PROGRESS_STEPS}
                />
                <TouchableOpacity
                  style={styles.skipSetupButton}
                  onPress={handleSkipSetup}
                  accessibilityRole="button"
                  accessibilityLabel="Skip onboarding"
                  disabled={completing}
                >
                  <Text style={styles.skipSetupText}>Skip setup</Text>
                </TouchableOpacity>
              </View>
            </View>

            {stepIndex === WELCOME_STEP_INDEX ? (
              <View style={styles.welcomeStepContainer}>
                <Animated.View style={{ opacity: fade }}>
                  {renderStep()}
                </Animated.View>
              </View>
            ) : (
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                <Animated.View style={{ flex: 1, opacity: fade }}>
                  {renderStep()}
                </Animated.View>
              </ScrollView>
            )}

            <View
              style={[styles.footer, { paddingBottom: insets.bottom }]}
            >
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  cta.disabled && styles.primaryButtonDisabled,
                ]}
                onPress={cta.onPress}
                disabled={cta.disabled}
                accessibilityRole="button"
                accessibilityLabel={cta.label}
              >
                <Text style={styles.primaryButtonText}>{cta.label}</Text>
              </TouchableOpacity>
              {canGoBack ? (
                <View style={styles.footerSecondaryRow}>
                  <TouchableOpacity
                    style={styles.backStepButton}
                    onPress={handleBackStep}
                    disabled={completing || iCloudSaving || weightUnitSaving}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                  >
                    <Text style={styles.skipStepText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.skipStepButton}
                    onPress={handleSkipStep}
                    disabled={completing}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isLastStep
                        ? 'Skip this step and finish'
                        : 'Skip this step'
                    }
                  >
                    <Text style={styles.skipStepText}>Skip</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.skipStepButton}
                  onPress={handleSkipStep}
                  disabled={completing}
                  accessibilityRole="button"
                  accessibilityLabel={
                    isLastStep
                      ? 'Skip this step and finish'
                      : 'Skip this step'
                  }
                >
                  <Text style={styles.skipStepText}>Skip</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </KeyboardWrapper>
    </AppSafeAreaView>
  );
}

export default OnboardingFlow;
