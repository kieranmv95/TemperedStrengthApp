import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { GlossaryTerm } from '@/src/types/brief';
import { usePostHog } from 'posthog-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { color, space, typography } from '../../constants/tokens';
import { Collapsible, Tag } from '../ds';

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
    setIsExpanded(!isExpanded);
  };

  return (
    <Collapsible
      title={term.term}
      expanded={isExpanded}
      onToggle={handleToggle}
      accessory={term.category ? <Tag label={term.category} /> : null}
      accessibilityLabel={
        term.category ? `${term.term}, ${term.category}` : term.term
      }
      style={styles.card}
    >
      <Text style={styles.definition}>{term.definition}</Text>
    </Collapsible>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: space.sm,
  },
  definition: {
    ...typography.body,
    color: color.textSecondary,
  },
});
