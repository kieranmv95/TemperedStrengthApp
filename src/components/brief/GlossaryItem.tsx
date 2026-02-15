import type { GlossaryTerm } from '@/src/types/brief';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

type GlossaryItemProps = {
  term: GlossaryTerm;
  variant?: 'compact' | 'expanded';
};

export function GlossaryItem({ term, variant = 'compact' }: GlossaryItemProps) {
  const [isExpanded, setIsExpanded] = useState(variant === 'expanded');

  const handleToggle = () => {
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
          color="#666"
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
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  cardExpanded: {
    borderColor: '#3A3A3A',
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
    gap: 10,
  },
  term: {
    color: '#c9b072',
    fontSize: 16,
    fontWeight: '700',
  },
  categoryBadge: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  definitionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  definition: {
    color: '#CCC',
    fontSize: 14,
    lineHeight: 22,
  },
});
