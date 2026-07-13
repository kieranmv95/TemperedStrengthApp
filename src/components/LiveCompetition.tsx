import { useLiveCompetition } from '@/src/hooks/useLiveCompetition';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { BorderRadius, FontSize, Spacing } from '../constants/theme';
import { LiveCompetitionCard } from './LiveCompetitionCard';

const styles = StyleSheet.create({
  linkText: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});

export const LiveCompetition = () => {
  const { competition, isLoading } = useLiveCompetition();

  if (isLoading || !competition) {
    return null;
  }

  const { linkText, theme } = competition;

  return (
    <LiveCompetitionCard competition={competition}>
      <TouchableOpacity
        onPress={() => {
          router.push('/competition');
        }}
        accessibilityLabel="View the live competition"
      >
        <Text
          style={[
            styles.linkText,
            { color: theme.linkTextColor, backgroundColor: theme.linkColor },
          ]}
        >
          {linkText}
        </Text>
      </TouchableOpacity>
    </LiveCompetitionCard>
  );
};
