import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  const handlePrev = () => {
    if (!canGoPrev) {
      return;
    }
    setIndex((current) => current - 1);
  };

  const handleNext = () => {
    if (!canGoNext) {
      return;
    }
    setIndex((current) => current + 1);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.progress} accessibilityLabel={`Tip ${index + 1} of ${tips.length}`}>
        ({index + 1}/{tips.length})
      </Text>

      <View style={styles.contentRow}>
        <TouchableOpacity
          style={[styles.navButton, !canGoPrev && styles.navButtonDisabled]}
          onPress={handlePrev}
          disabled={!canGoPrev}
          accessibilityRole="button"
          accessibilityLabel="Previous tip"
        >
          <Ionicons name="chevron-back" size={20} color={Colors.accent} />
        </TouchableOpacity>

        <Text style={styles.tipText}>{tips[index]}</Text>

        <TouchableOpacity
          style={[styles.navButton, !canGoNext && styles.navButtonDisabled]}
          onPress={handleNext}
          disabled={!canGoNext}
          accessibilityRole="button"
          accessibilityLabel="Next tip"
        >
          <Ionicons name="chevron-forward" size={20} color={Colors.accent} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.xl,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    minHeight: 120,
  },
  progress: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.accentWashFill,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  tipText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 22,
    textAlign: 'center',
  },
});
