import { AppSafeAreaView } from '@/src/components/AppSafeAreaView';
import { OnboardingOptionCard } from '@/src/components/onboarding/OnboardingOptionCard';
import { OnboardingProgressBar } from '@/src/components/onboarding/OnboardingProgressBar';
import { onboardingStyles as styles } from '@/src/components/onboarding/onboardingStyles';
import { Colors } from '@/src/constants/theme';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import {
  markAccountCreationSkipped,
  markAccountIntroDismissed,
} from '@/src/sync/accountStorage';
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
import { router, type Href, useLocalSearchParams } from 'expo-router';
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
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TOTAL_STEPS = 8;
const ACCOUNT_STEP_INDEX = 6;
const WELCOME_STEP_INDEX = 7;
const ONBOARDING_GENDER_IMAGES = {
  female: require('@/assets/images/onboarding/FEMALE.png'),
  male: require('@/assets/images/onboarding/MALE.png'),
} as const;
const TOTAL_PROGRESS_STEPS = TOTAL_STEPS - 2;

function progressStepForIndex(stepIndex: number): number {
  if (stepIndex <= 0) return 1;
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
      return 'account_backup';
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
  const params = useLocalSearchParams<{
    mode?: string;
    accountCreated?: string;
  }>();
  const bypassAccountChoice =
    params.mode === 'edit' || params.accountCreated === '1';

  const [stepIndex, setStepIndex] = useState(0);
  const [accountChoiceMade, setAccountChoiceMade] =
    useState(bypassAccountChoice);
  const [profile, setProfile] = useState<OnboardingProfile>({});
  const [introDone, setIntroDone] = useState(false);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<OnboardingGender | null>(null);
  const [interests, setInterests] = useState<OnboardingInterest[]>([]);
  const [experienceLevel, setExperienceLevel] =
    useState<OnboardingExperienceLevel | null>(null);
  const [weightUnitStep, setWeightUnitStep] = useState<WeightUnit>('kg');
  const [weightUnitSaving, setWeightUnitSaving] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Preload any existing profile so "Update Preferences" replays with current values.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const existingWeightUnit = await getWeightUnit();
      if (cancelled) return;
      setWeightUnitStep(existingWeightUnit);

      const existing = await getOnboardingProfile();
      if (cancelled) return;
      if (!existing) return;
      setProfile(existing);
      if (existing.name) setName(existing.name);
      if (existing.gender) setGender(existing.gender);
      if (existing.interests) setInterests(existing.interests);
      if (existing.experienceLevel)
        setExperienceLevel(existing.experienceLevel);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (params.accountCreated !== '1') return;
    setAccountChoiceMade(true);
    setIntroDone(true);
    setStepIndex(WELCOME_STEP_INDEX);
  }, [params.accountCreated]);

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

  const finishIntro = useCallback(() => {
    if (introDone || completing) return;
    setIntroDone(true);
    if (accountChoiceMade) {
      animateStepChange(() => setStepIndex(1));
    }
  }, [accountChoiceMade, animateStepChange, completing, introDone]);

  const introVideoPlayer = useVideoPlayer(
    require('../../assets/onboarding.mp4'),
    (player) => {
      player.loop = false;
      player.muted = true;
      player.play();
    }
  );

  useEventListener(introVideoPlayer, 'playToEnd', () => {
    finishIntro();
  });

  const skipIntro = useCallback(() => {
    posthog.capture(posthogEventsNames.onboarding.skip, {
      step_name: 'intro',
    });
    finishIntro();
  }, [posthog, finishIntro]);

  const continueAsNewUser = useCallback(() => {
    setAccountChoiceMade(true);
    animateStepChange(() => setStepIndex(1));
  }, [animateStepChange]);

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
      await markAccountIntroDismissed();
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
    animateStepChange(() => setStepIndex((i) => i + 1));
  };

  const handleSkipStep = () => {
    // Advance without committing this step's field to the profile.
    if (stepIndex === 0) {
      finishIntro();
      return;
    }
    if (stepIndex === ACCOUNT_STEP_INDEX) {
      handleSkipAccount();
      return;
    }
    posthog.capture(posthogEventsNames.onboarding.skip, {
      step_name: onboardingStepName(stepIndex),
    });
    if (stepIndex >= TOTAL_STEPS - 1) {
      completeOnboarding(profile);
      return;
    }
    animateStepChange(() => setStepIndex((i) => i + 1));
  };

  const handleBackStep = () => {
    if (stepIndex <= 1) return;
    animateStepChange(() => setStepIndex((i) => Math.max(1, i - 1)));
  };

  const handleSkipSetup = () => {
    Alert.alert(
      'Skip setup and account creation?',
      'Without an account, your data only lives on this device. If you uninstall the app or lose your phone, it may be gone for good.',
      [
        { text: 'Go back', style: 'cancel' },
        {
          text: 'Skip anyway',
          style: 'destructive',
          onPress: async () => {
            posthog.capture(posthogEventsNames.onboarding.sectionSkip, {
              section_name: 'full_setup',
            });
            await markAccountCreationSkipped();
            await completeOnboarding(profile);
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

  const handleCreateAccount = async () => {
    try {
      await setOnboardingProfile(profile);
      router.push({
        pathname: '/account/create-account',
        params: { intent: 'create', returnTo: '/onboarding' },
      } as unknown as Href);
    } catch (error) {
      console.error('Error saving onboarding profile before account:', error);
      Alert.alert(
        'Something went wrong',
        'We could not save your preferences. Please try again.'
      );
    }
  };

  const handleSkipAccount = () => {
    Alert.alert(
      'Continue without an account?',
      'Your data will only live on this device. If you uninstall the app or lose your phone, it may be gone for good.',
      [
        {
          text: 'Create account',
          onPress: () => {
            void handleCreateAccount();
          },
        },
        {
          text: 'Skip anyway',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              await markAccountCreationSkipped();
              advanceOrFinish(profile);
            })();
          },
        },
      ]
    );
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
              Add a name or nickname so we can make the app feel a bit more
              personal.
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
            <Text style={styles.stepTitle}>Save your progress</Text>
            <Text style={styles.stepSubtitle}>
              Create an account to keep your programs, logs, preferences, and
              personal bests safe across devices.
            </Text>
            <View style={styles.accountCard}>
              <Text style={styles.accountCardTitle}>Local-first backup</Text>
              <Text style={styles.accountCardDescription}>
                The app keeps working offline. When you’re online, signed-in
                devices securely sync your data.
              </Text>
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
          onPress: finishIntro,
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
          label: 'Create account',
          onPress: handleCreateAccount,
          disabled: completing,
        };
      case 7:
        return {
          label: "Let's go",
          onPress: () => completeOnboarding(profile, '/'),
          disabled: completing,
        };
      default:
        return { label: 'Continue', onPress: () => {}, disabled: true };
    }
  };

  const cta = primaryCta();
  const isLastStep = stepIndex === TOTAL_STEPS - 1;
  const canGoBack = stepIndex > 1;
  const showIntro = stepIndex === 0 && !introDone;
  const showAccountChoice = stepIndex === 0 && introDone && !accountChoiceMade;
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
                    style={{
                      color: Colors.textPrimary,
                      fontSize: 16,
                      fontWeight: '700',
                    }}
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ gap: 12 }} />
            </View>
          </View>
        ) : showAccountChoice ? (
          <View style={styles.accountChoiceContainer}>
            <View style={[styles.stepBody, { paddingHorizontal: 24 }]}>
              <Text style={styles.stepTitle}>
                Have you used Tempered Strength before?
              </Text>
              <Text style={styles.stepSubtitle}>
                Sign in to restore your training data, or continue if you’re
                new.
              </Text>
            </View>
            <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() =>
                  router.push({
                    pathname: '/account/create-account',
                    params: { intent: 'restore', returnTo: '/' },
                  } as unknown as Href)
                }
              >
                <Text style={styles.primaryButtonText}>
                  I already have an account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.skipStepButton}
                onPress={continueAsNewUser}
              >
                <Text style={styles.skipStepText}>I’m new</Text>
              </TouchableOpacity>
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

            <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
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
                    disabled={completing || weightUnitSaving}
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
                    isLastStep ? 'Skip this step and finish' : 'Skip this step'
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
