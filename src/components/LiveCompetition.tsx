import { PressableCard } from '@/src/components/ds';
import { color, space, typography } from '@/src/constants/tokens';
import { useLiveCompetition } from '@/src/hooks/useLiveCompetition';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/**
 * Home entry for the live competition. The CMS theme background is used only
 * as a narrow accent edge; text uses tokens so contrast always passes.
 */
export const LiveCompetition = () => {
  const { competition, isLoading } = useLiveCompetition();

  if (isLoading || !competition) {
    return null;
  }

  const { title, description, linkText, theme } = competition;

  return (
    <PressableCard
      variant="promo"
      accentColor={theme.bgColor}
      onPress={() => {
        router.push('/competition');
      }}
      accessibilityLabel={`${title}, ${description}`}
      accessibilityHint="Opens the live competition leaderboard"
    >
      <View style={styles.content}>
        <View style={styles.overlineRow}>
          <Ionicons name="trophy-outline" size={14} color={color.gold} />
          <Text style={styles.overline}>Live competition</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.linkText}>{linkText}</Text>
      </View>
    </PressableCard>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: space.xxs,
  },
  overlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  overline: {
    ...typography.overline,
    color: color.textTertiary,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
  },
  linkText: {
    ...typography.calloutStrong,
    color: color.gold,
    marginTop: space.xxs,
  },
});
