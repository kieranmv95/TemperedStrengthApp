import { SkillPager } from '@/src/components/skills/SkillPager';
import {
  color,
  elevation,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';

type SkillTipsCarouselProps = {
  tips: string[];
};

export function SkillTipsCarousel({ tips }: SkillTipsCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [tips]);

  if (tips.length === 0) {
    return null;
  }

  const canGoPrev = index > 0;
  const canGoNext = index < tips.length - 1;

  const announceTip = (nextIndex: number) => {
    AccessibilityInfo.announceForAccessibility(
      `Tip ${nextIndex + 1} of ${tips.length}. ${tips[nextIndex]}`
    );
  };

  const handlePrev = () => {
    if (!canGoPrev) {
      return;
    }
    announceTip(index - 1);
    setIndex((current) => current - 1);
  };

  const handleNext = () => {
    if (!canGoNext) {
      return;
    }
    announceTip(index + 1);
    setIndex((current) => current + 1);
  };

  return (
    <View style={[styles.card, elevation.raised]}>
      <View style={styles.tipRow}>
        <Ionicons
          name="bulb-outline"
          size={20}
          color={color.textSecondary}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
        <Text style={styles.tipText}>{tips[index]}</Text>
      </View>

      {tips.length > 1 ? (
        <SkillPager
          positionLabel={`Tip ${index + 1} of ${tips.length}`}
          previousLabel="Previous tip"
          nextLabel="Next tip"
          canGoPrevious={canGoPrev}
          canGoNext={canGoNext}
          onPrevious={handlePrev}
          onNext={handleNext}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: space.md,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
  },
  tipText: {
    ...typography.body,
    color: color.textPrimary,
    flex: 1,
  },
});
