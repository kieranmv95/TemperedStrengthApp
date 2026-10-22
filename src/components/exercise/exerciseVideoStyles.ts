import { color, radius, space, typography } from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const exerciseVideoStyles = StyleSheet.create({
  videoContainer: {
    alignSelf: 'stretch',
    aspectRatio: 16 / 9,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: color.surface2,
  },
  videoContainerFill: {
    flex: 1,
    aspectRatio: undefined,
  },
  webView: {
    flex: 1,
    backgroundColor: color.surface2,
  },
  description: {
    ...typography.body,
    color: color.textSecondary,
  },
  playButtonBanner: {
    alignSelf: 'stretch',
    marginBottom: space.md,
  },
  playButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  playButtonLabel: {
    ...typography.headline,
    color: color.textPrimary,
  },
  playButtonSubLabel: {
    ...typography.caption,
    color: color.textSecondary,
  },
  playButtonTextBlock: {
    flex: 1,
    minWidth: 0,
  },
});
