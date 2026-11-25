import { Tag } from '@/src/components/ds';
import { color, space, typography } from '@/src/constants/tokens';
import type { GlossaryTerm } from '@/src/types/brief';
import { StyleSheet, Text, View } from 'react-native';

type GlossaryTermBodyProps = {
  term: GlossaryTerm;
};

/** Category and definition shared by the root sheet and in-popup overlay. */
export function GlossaryTermBody({ term }: GlossaryTermBodyProps) {
  return (
    <View style={styles.body}>
      {term.category ? <Tag label={term.category} /> : null}
      <Text style={styles.definition}>{term.definition}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: space.sm,
  },
  definition: {
    ...typography.body,
    color: color.textSecondary,
  },
});
