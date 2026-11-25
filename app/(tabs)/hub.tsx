import { AppScrollView, StandardLayout } from '@/src/components/ds';
import { HubPromoRow } from '@/src/components/hub/HubPromoRow';
import { HubToolsSection } from '@/src/components/hub/HubToolsSection';
import { SkillsAndCuesCard } from '@/src/components/hub/SkillsAndCuesCard';
import { space } from '@/src/constants/tokens';
import { type ToolRoute } from '@/src/data/tools';
import { increment } from '@/src/services/metricService';
import { useFocusEffect, router } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

export default function HubScreen() {
  useFocusEffect(
    useCallback(() => {
      increment('brief_visits');
    }, [])
  );

  const handleOpenTool = (route: ToolRoute) => {
    router.push(route);
  };

  const handleOpenShop = () => {
    router.push('/shop');
  };

  const handleOpenSkillsAndCues = () => {
    router.push('/skills-and-cues');
  };

  return (
    <StandardLayout
      title="Explore"
      subtitle="Tools and products to help you train."
      disableScroll
      edgeToEdgeBody
    >
      <StandardLayout.Body>
        <AppScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          <View style={styles.header}>
            <View style={[styles.group, styles.pageGutter]}>
              <SkillsAndCuesCard onPress={handleOpenSkillsAndCues} />
              <HubPromoRow onPressShop={handleOpenShop} />
            </View>

            <HubToolsSection onOpenTool={handleOpenTool} />
          </View>
        </AppScrollView>
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  pageGutter: {
    paddingHorizontal: space.md,
  },
  listContent: {
    paddingTop: space.md,
    paddingBottom: space.xxl,
  },
  header: {
    gap: space.xl,
    paddingBottom: space.sm,
  },
  group: {
    gap: space.sm,
  },
});
