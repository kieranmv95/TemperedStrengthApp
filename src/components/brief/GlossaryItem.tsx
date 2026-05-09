import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { GlossaryTerm } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import {
  BorderRadius,
  Colors,
  FontSize,
  Spacing,
} from '../../constants/theme';
import React, { useState } from 'react';
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { usePostHog } from 'posthog-react-native';

type GlossaryItemProps = {
  term: GlossaryTerm;
  variant?: 'compact' | 'expanded';
};

export function GlossaryItem({ term, variant = 'compact' }: GlossaryItemProps) {
  const posthog = usePostHog();
  const [isExpanded, setIsExpanded] = useState(variant === 'expanded');

  const handleToggle = () => {
    if (!isExpanded) {
      posthog.capture(posthogEventsNames.content.glossaryView, {
        term: term.term,
      });
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity
      style={[styles.card, isExpanded && styles.cardExpanded]}
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.termContainer}>
          <Text style={styles.term}>{term.term}</Text>
          {term.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{term.category}</Text>
            </View>
          )}
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.textPlaceholder}
        />
      </View>
      {isExpanded && (
        <View style={styles.definitionContainer}>
          <Text style={styles.definition}>{term.definition}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  cardExpanded: {
    borderColor: Colors.backgroundBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  termContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  term: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  categoryBadge: {
    backgroundColor: Colors.backgroundElevated,
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.xxs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  definitionContainer: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
  },
  definition: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 22,
  },
});
