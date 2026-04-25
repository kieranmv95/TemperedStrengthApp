import { OnboardingOptionCard } from '@/src/components/onboarding/OnboardingOptionCard';
import { OnboardingProgressBar } from '@/src/components/onboarding/OnboardingProgressBar';
import { onboardingStyles as styles } from '@/src/components/onboarding/onboardingStyles';
import { Colors } from '@/src/constants/theme';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import type {
  OnboardingExperienceLevel,
  OnboardingGender,
  OnboardingInterest,
  OnboardingProfile,
} from '@/src/types/onboarding';
import {
  getOnboardingProfile,
  getWeightUnit,
  setOnboarded,
  setOnboardingProfile,
  setWeightUnit,
  type WeightUnit,
} from '@/src/utils/storage';
import { ResizeMode, Video, type AVPlaybackStatus } from 'expo-av';
import { router, type Href } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TOTAL_STEPS = 8;
const TOTAL_PROGRESS_STEPS = TOTAL_STEPS - 1;

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
  const { enabled: iCloudSyncEnabled, isAvailable, setEnabled } = useSyncManager();

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
        setICloudStepToggle(iCloudSyncEnabled);
        return;
      }
      setProfile(existing);
      if (existing.name) setName(existing.name);
      if (existing.gender) setGender(existing.gender);
      if (existing.interests) setInterests(existing.interests);
      if (existing.experienceLevel)
        setExperienceLevel(existing.experienceLevel);
      setICloudStepToggle(
        typeof existing.iCloudSyncEnabled === 'boolean'
          ? existing.iCloudSyncEnabled
          : iCloudSyncEnabled
      );
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
    animateStepChange(() => setStepIndex((i) => i + 1));
  };

  const handleSkipStep = () => {
    // Advance without committing this step's field to the profile.
    if (stepIndex === 0) {
      goToNameStep();
      return;
    }
    if (stepIndex >= TOTAL_STEPS - 1) {
      completeOnboarding(profile);
      return;
    }
    animateStepChange(() => setStepIndex((i) => i + 1));
  };

  const handleBackStep = () => {
    if (stepIndex <= 1) return;
    animateStepChange(() => setStepIndex((i) => Math.max(0, i - 1)));
  };

  const handleSkipSetup = () => {
    Alert.alert(
      'Skip setup?',
      'You can run onboarding again any time from Settings.',
      [
        { text: 'Go back', style: 'cancel' },
        {
          text: 'Skip anyway',
          style: 'destructive',
          onPress: () => completeOnboarding(profile),
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
    if (Platform.OS !== 'ios') {
      advanceOrFinish({ ...profile, iCloudSyncEnabled: false });
      return;
    }

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
            <Text style={styles.stepTitle}>
              What can we call you?
            </Text>
            <Text style={styles.stepSubtitle}>
              Add a name so we can make the app feel a bit more yours.
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
            <Text style={styles.stepSubtitle}>
              Pick as many as you like.
            </Text>
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
                <Text style={styles.iCloudToggleLabel}>
                  {Platform.OS === 'ios'
                    ? 'Enable iCloud Sync'
                    : 'iCloud Sync (iOS only)'}
                </Text>
                <Switch
                  value={iCloudStepToggle}
                  onValueChange={setICloudStepToggle}
                  disabled={Platform.OS !== 'ios' || iCloudSaving}
                />
              </View>
              {Platform.OS === 'ios' && iCloudStepToggle && !isAvailable ? (
                <Text style={styles.iCloudUnavailable}>
                  iCloud is currently unavailable on this device/account.
                </Text>
              ) : null}
            </View>
          </View>
        );
      case 7:
        return (
          <View style={styles.stepBody}>
            <Text style={styles.stepTitle}>You’re in.</Text>
            <Text style={styles.stepSubtitle}>
              Time to lift, log, and level up.
            </Text>
            <View style={styles.finalCard}>
              <Text style={styles.finalCardTitle}>What you can do now</Text>
              <View style={styles.finalBullets}>
                <Text style={styles.finalBullet}>
                  Start a program and follow it week by week
                </Text>
                <Text style={styles.finalBullet}>
                  Hit a standalone workout when you want to move today
                </Text>
                <Text style={styles.finalBullet}>
                  Log sets fast and keep training honest
                </Text>
                <Text style={styles.finalBullet}>
                  Chase PBs and watch your numbers climb
                </Text>
              </View>
            </View>

            <View style={styles.finalActions}>
              <TouchableOpacity
                style={styles.finalActionPrimary}
                onPress={() => completeOnboarding(profile, '/')}
                disabled={completing}
                accessibilityRole="button"
                accessibilityLabel="Start a program"
              >
                <Text style={styles.finalActionPrimaryText}>
                  Start a program
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.finalActionSecondary}
                onPress={() => completeOnboarding(profile, '/workouts')}
                disabled={completing}
                accessibilityRole="button"
                accessibilityLabel="Browse workouts"
              >
                <Text style={styles.finalActionSecondaryText}>
                  Browse workouts
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.finalActionSecondary}
                onPress={() => completeOnboarding(profile, '/records')}
                disabled={completing}
                accessibilityRole="button"
                accessibilityLabel="Chase personal bests"
              >
                <Text style={styles.finalActionSecondaryText}>Chase PBs</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.finalFinePrint}>
              You can tweak preferences any time in Account.
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const primaryCta = () => {
    switch (stepIndex) {
      case 0:
        return { label: 'Continue', onPress: goToNameStep, disabled: completing };
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
  const progressCurrent = Math.max(1, Math.min(stepIndex, TOTAL_PROGRESS_STEPS));

  return (
    <SafeAreaView
      style={styles.container}
      edges={showIntro ? ['top', 'left', 'right', 'bottom'] : ['top', 'left', 'right']}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {showIntro ? (
          <View style={{ flex: 1 }}>
            <Video
              source={require('../../assets/onboarding.mp4')}
              style={StyleSheet.absoluteFillObject}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping={false}
              isMuted
              onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                if (!status.isLoaded) return;
                if (status.didJustFinish) goToNameStep();
              }}
              accessibilityLabel="Onboarding intro video"
            />

            <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity
                  onPress={goToNameStep}
                  accessibilityRole="button"
                  accessibilityLabel="Skip intro"
                  disabled={completing}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
                    Skip
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={{ gap: 12 }} />
            </View>
          </View>
        ) : (
          <>
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

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.View style={{ flex: 1, opacity: fade }}>
                {renderStep()}
              </Animated.View>
            </ScrollView>

            <SafeAreaView edges={['bottom']}>
              <View style={styles.footer}>
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
                        isLastStep ? 'Skip this step and finish' : 'Skip this step'
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
            </SafeAreaView>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default OnboardingFlow;
