import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const zoneScreenStyles = StyleSheet.create({
  list: {
    gap: space.lg,
  },
  section: {
    gap: space.xs,
  },
  card: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.sm,
  },
  cardTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  body: {
    ...typography.callout,
    color: color.textSecondary,
  },
  bodyStrong: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  caption: {
    ...typography.caption,
    color: color.textTertiary,
  },
  errorText: {
    ...typography.callout,
    color: color.danger,
  },
  headerButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  methodToggle: {
    flex: 1,
    flexDirection: 'row',
    padding: space.xxs,
    gap: space.xxs,
    backgroundColor: color.surface1,
    borderRadius: radius.pill,
    ...elevation.raised,
  },
  methodOption: {
    flex: 1,
    minHeight: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xs,
    borderRadius: radius.pill,
  },
  methodOptionPressed: {
    backgroundColor: color.surface2,
  },
  methodOptionActive: {
    backgroundColor: color.gold,
  },
  methodOptionText: {
    ...typography.calloutStrong,
    color: color.textSecondary,
    textAlign: 'center',
  },
  methodOptionTextActive: {
    color: color.onGold,
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.xs,
  },
  zoneRowStacked: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  zoneRowText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  zoneName: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  zonePercent: {
    ...typography.caption,
    color: color.textSecondary,
  },
  zoneBpm: {
    ...typography.numericSmall,
    color: color.textPrimary,
  },
  zoneBpmEmpty: {
    ...typography.numericSmall,
    color: color.textTertiary,
  },
  linkButton: {
    alignSelf: 'flex-start',
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
  },
  linkText: {
    ...typography.calloutStrong,
    color: color.gold,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  btnPrimary: {
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryPressed: {
    backgroundColor: color.goldStrong,
  },
  btnPrimaryDisabled: {
    backgroundColor: color.surface3,
  },
  btnPrimaryText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  btnPrimaryTextDisabled: {
    color: color.textDisabled,
  },
  btnGhost: {
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhostPressed: {
    backgroundColor: color.surface3,
  },
  btnGhostText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  sheetFields: {
    gap: space.md,
  },
});
