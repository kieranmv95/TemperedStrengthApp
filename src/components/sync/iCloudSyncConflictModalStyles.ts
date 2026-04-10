import { StyleSheet } from 'react-native';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';

export const iCloudSyncConflictModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.backgroundScreen,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.xl,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '800',
    marginBottom: Spacing.md,
  },
  body: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: Colors.tint,
    borderColor: Colors.tint,
  },
  primaryButtonText: {
    color: Colors.backgroundScreen,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: Colors.backgroundDark,
    borderColor: Colors.borderDefault,
  },
  secondaryButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
});

