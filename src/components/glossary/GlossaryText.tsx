import { useGlossaryTerm } from '@/src/hooks/glossary-term-context';
import { segmentGlossaryText } from '@/src/utils/glossaryText';
import React from 'react';
import {
  StyleSheet,
  Text,
  type AccessibilityRole,
  type StyleProp,
  type TextStyle,
} from 'react-native';

type GlossaryTextProps = {
  text: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  accessibilityRole?: AccessibilityRole;
};

/**
 * Coaching copy with glossary words underlined. Tapping a word opens its
 * definition. Text with no matches renders as a plain `Text`.
 */
export function GlossaryText({
  text,
  style,
  numberOfLines,
  accessibilityRole,
}: GlossaryTextProps) {
  const { openGlossaryTerm } = useGlossaryTerm();
  const segments = segmentGlossaryText(text);
  const hasTerm = segments.some((segment) => segment.type === 'term');
  const textColor = StyleSheet.flatten(style)?.color;

  if (!hasTerm) {
    return (
      <Text
        style={style}
        numberOfLines={numberOfLines}
        accessibilityRole={accessibilityRole}
      >
        {text}
      </Text>
    );
  }

  return (
    <Text
      style={style}
      numberOfLines={numberOfLines}
      accessibilityRole={accessibilityRole}
    >
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return <Text key={index}>{segment.text}</Text>;
        }

        return (
          <Text
            key={index}
            style={[
              styles.term,
              textColor != null ? { textDecorationColor: textColor } : null,
            ]}
            onPress={() => openGlossaryTerm(segment.term)}
            accessibilityRole="button"
            accessibilityLabel={`${segment.term.term}. Show definition`}
            accessibilityHint={segment.term.definition}
            suppressHighlighting
          >
            {segment.text}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  term: {
    textDecorationLine: 'underline',
  },
});
