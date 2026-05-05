import { StandardLayout } from '@/src/components/StandardLayout';
import { settingsScreenStyles as styles } from '@/src/components/settings/settingsScreenStyles';
import { getOnboardingProfile } from '@/src/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function HomeTabScreen() {
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const profile = await getOnboardingProfile();
      const trimmed = profile?.name?.trim();
      setDisplayName(trimmed && trimmed.length > 0 ? trimmed : null);
    } catch (error) {
      console.error('Error loading onboarding profile for home:', error);
      setDisplayName(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadProfile();
    }, [loadProfile])
  );

  if (loading) {
    return null;
  }

  const greetingTitle = displayName ? `Hi, ${displayName}` : 'Hi';

  return (
    <StandardLayout title={greetingTitle}>
      <StandardLayout.Body>
        <View style={styles.settingsList}>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/settings')}
            accessibilityRole="button"
            accessibilityLabel="Open account"
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Account</Text>
              <Text style={styles.settingDescription}>
                Subscription, preferences, and program settings.
              </Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}
