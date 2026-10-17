import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const partnerDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.md - space.xs,
    paddingTop: space.xs,
  },
  headerButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: space.md,
    paddingTop: space.xs,
    paddingBottom: space.xxl,
    gap: space.md,
  },
  heading: {
    gap: space.xxs,
  },
  kindLabel: {
    ...typography.overline,
    color: color.textTertiary,
  },
  title: {
    ...typography.title1,
    color: color.textPrimary,
  },
  statusRow: {
    marginTop: space.xxs,
  },
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    paddingVertical: space.xxs,
  },
  tabPanel: {
    gap: space.md,
  },
  contentBlock: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.sm,
    ...elevation.raised,
  },
  linkList: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...elevation.raised,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  description: {
    ...typography.body,
    color: color.textSecondary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE + space.xs,
    paddingHorizontal: space.md,
  },
  linkRowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.borderSubtle,
  },
  linkRowPressed: {
    backgroundColor: color.surface2,
  },
  linkText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
    flex: 1,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE,
    marginHorizontal: -space.xs,
    paddingHorizontal: space.xs,
    borderRadius: radius.sm,
  },
  contactRowPressed: {
    backgroundColor: color.surface2,
  },
  contactValue: {
    ...typography.callout,
    color: color.textPrimary,
    flex: 1,
  },
  gymLeadMediaFrame: {
    alignSelf: 'stretch',
    aspectRatio: 16 / 9,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: color.surface2,
  },
  sectionTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  sectionBody: {
    ...typography.callout,
    color: color.textSecondary,
  },
  addressBody: {
    ...typography.callout,
    color: color.textSecondary,
  },
  hoursRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: space.sm,
    paddingVertical: space.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.borderSubtle,
  },
  hoursDay: {
    ...typography.callout,
    color: color.textPrimary,
  },
  hoursValue: {
    ...typography.callout,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  loading: {
    paddingHorizontal: space.md,
    paddingTop: space.xs,
    gap: space.sm,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xxl,
    gap: space.xs,
  },
  errorTitle: {
    ...typography.title2,
    color: color.textPrimary,
    textAlign: 'center',
  },
  backButton: {
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    marginTop: space.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  backButtonPressed: {
    backgroundColor: color.surface3,
  },
  backButtonText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
});
