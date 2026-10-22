import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

const LIST_BULLET_SIZE = 6;
const NOTES_MIN_HEIGHT = 96;

export const workoutScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
  },
  movingSessionOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: color.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  movingSessionOverlayCard: {
    ...elevation.overlay,
    backgroundColor: color.surface2,
    borderRadius: radius.md,
    paddingVertical: space.md,
    paddingHorizontal: space.xl,
    alignItems: 'center',
  },
  movingSessionOverlayText: {
    ...typography.headline,
    color: color.textPrimary,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
  },
  sections: {
    gap: space.md,
  },
  header: {
    gap: space.xs,
  },
  title: {
    ...typography.title1,
    color: color.textPrimary,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
  },
  card: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.sm,
  },
  cardTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.xs,
  },
  cardTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  intensityValue: {
    ...typography.numericMedium,
    color: color.gold,
  },
  body: {
    ...typography.callout,
    color: color.textSecondary,
  },
  callout: {
    ...typography.callout,
    color: color.textSecondary,
    backgroundColor: color.surface2,
    borderRadius: radius.sm,
    padding: space.sm,
  },
  textButton: {
    alignSelf: 'flex-start',
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
  },
  textButtonLabel: {
    ...typography.calloutStrong,
    color: color.gold,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.md,
  },
  stat: {
    flexGrow: 1,
    gap: space.xxs,
  },
  statValue: {
    ...typography.numericMedium,
    color: color.textPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: color.textTertiary,
  },
  list: {
    gap: space.xs,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xs,
  },
  listBullet: {
    width: LIST_BULLET_SIZE,
    height: LIST_BULLET_SIZE,
    borderRadius: LIST_BULLET_SIZE / 2,
    backgroundColor: color.gold,
    marginTop: space.xs,
  },
  listText: {
    ...typography.callout,
    color: color.textSecondary,
    flex: 1,
  },
  notesInput: {
    ...typography.body,
    color: color.textPrimary,
    backgroundColor: color.surface2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    padding: space.sm,
    minHeight: NOTES_MIN_HEIGHT,
  },
  notesActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.md,
    gap: space.sm,
  },
  loadingText: {
    ...typography.body,
    color: color.textSecondary,
    textAlign: 'center',
  },
  startSessionButton: {
    minHeight: MIN_TARGET_SIZE,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: color.gold,
    marginTop: space.md,
  },
  startSessionButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  keyboardDoneBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.surface2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.borderSubtle,
    paddingHorizontal: space.md,
  },
  keyboardDoneBarSpacer: {
    flex: 1,
  },
  keyboardDoneBtn: {
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.sm,
  },
  keyboardDoneText: {
    ...typography.calloutStrong,
    color: color.gold,
  },
});
