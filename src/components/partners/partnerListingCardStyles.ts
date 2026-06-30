import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const partnerListingCardStyles = StyleSheet.create({
  card: {
    marginBottom: Spacing.lg,
  },
  cardCompact: {
    marginBottom: 0,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  iconTile: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.backgroundSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    marginLeft: Spacing.xl,
    gap: Spacing.xs,
  },
  contentCompact: {
    marginLeft: 0,
    gap: 2,
  },
  kindLabel: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '600',
    lineHeight: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  locationText: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.md,
    flex: 1,
  },
  distanceText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '500',
    flexShrink: 0,
  },
  specialtiesText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    lineHeight: 18,
  },
  description: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    lineHeight: 18,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  statusBadgeOpen: {
    backgroundColor: Colors.recommendedWashFill,
    borderWidth: 1,
    borderColor: Colors.recommendedWashBorder,
  },
  statusBadgeClosed: {
    backgroundColor: Colors.destructiveWashFill,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.25)',
  },
  statusBadgeText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  statusBadgeTextOpen: {
    color: Colors.recommended,
  },
  statusBadgeTextClosed: {
    color: Colors.destructive,
  },
  compactStatus: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    marginLeft: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  compactStatusOpen: {
    color: Colors.recommended,
    backgroundColor: Colors.recommendedWashFill,
    borderWidth: 1,
    borderColor: Colors.recommendedWashBorder,
  },
  compactStatusClosed: {
    color: Colors.destructive,
    backgroundColor: Colors.destructiveWashFill,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.25)',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
