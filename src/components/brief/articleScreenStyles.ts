import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const ARTICLE_HERO_HEIGHT = 220;
const NUMBER_BULLET_WIDTH = 24;

export const articleScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
  },
  headerBackButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    justifyContent: 'center',
    marginLeft: -space.xs,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: space.xxl,
  },
  heroImage: {
    width: '100%',
    height: ARTICLE_HERO_HEIGHT,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingTop: space.lg,
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  readTimeText: {
    ...typography.caption,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  title: {
    ...typography.title1,
    color: color.textPrimary,
    paddingHorizontal: space.md,
    marginTop: space.sm,
  },
  subtitle: {
    ...typography.body,
    color: color.textSecondary,
    paddingHorizontal: space.md,
    marginTop: space.xs,
  },
  readOnWebButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    marginTop: space.md,
    marginHorizontal: space.md,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  readOnWebButtonPressed: {
    backgroundColor: color.surface3,
  },
  readOnWebText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: color.borderSubtle,
    marginHorizontal: space.md,
    marginVertical: space.xl,
  },
  articleContent: {
    paddingHorizontal: space.md,
  },
  heading2: {
    ...typography.title2,
    color: color.textPrimary,
    marginTop: space.xl,
    marginBottom: space.sm,
  },
  heading3: {
    ...typography.headline,
    color: color.textPrimary,
    marginTop: space.lg,
    marginBottom: space.xs,
  },
  paragraph: {
    ...typography.body,
    color: color.textSecondary,
    marginBottom: space.xs,
  },
  inlineBold: {
    color: color.textPrimary,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: space.xs,
    paddingLeft: space.xxs,
  },
  bullet: {
    ...typography.body,
    color: color.textTertiary,
    marginRight: space.sm,
  },
  numberBullet: {
    ...typography.body,
    fontVariant: ['tabular-nums'],
    color: color.textTertiary,
    marginRight: space.xs,
    width: NUMBER_BULLET_WIDTH,
  },
  listText: {
    ...typography.body,
    flex: 1,
    color: color.textSecondary,
  },
  spacer: {
    height: space.sm,
  },
  loadingContent: {
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingTop: space.lg,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xxl,
    gap: space.sm,
  },
  errorText: {
    ...typography.title2,
    color: color.textPrimary,
    textAlign: 'center',
  },
  backButton: {
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.xl,
    marginTop: space.xs,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  backButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  backButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
});
