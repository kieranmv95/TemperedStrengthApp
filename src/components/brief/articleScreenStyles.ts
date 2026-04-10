import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const articleScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  headerBackButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  heroImage: {
    width: '100%',
    height: 220,
    backgroundColor: Colors.backgroundElevated,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    paddingHorizontal: Spacing.xxxl,
    paddingTop: Spacing.xxxl,
  },
  categoryBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  readTimeText: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXl,
    fontWeight: '800',
    lineHeight: 34,
    paddingHorizontal: Spacing.xxxl,
    marginTop: Spacing.xxl,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.xxl,
    lineHeight: 24,
    paddingHorizontal: Spacing.xxxl,
    marginTop: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderDefault,
    marginHorizontal: Spacing.xxxl,
    marginVertical: Spacing.section,
  },
  articleContent: {
    paddingHorizontal: Spacing.xxxl,
  },
  heading2: {
    color: Colors.accent,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    marginTop: Spacing.section,
    marginBottom: Spacing.xl,
  },
  heading3: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxxl,
    fontWeight: '700',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  paragraph: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxl,
    lineHeight: 26,
    marginBottom: Spacing.xs,
  },
  inlineBold: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    paddingLeft: Spacing.md,
  },
  bullet: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    lineHeight: 26,
    marginRight: Spacing.xl,
  },
  numberBullet: {
    color: Colors.accent,
    fontSize: FontSize.xxl,
    fontWeight: '600',
    lineHeight: 26,
    marginRight: Spacing.md,
    width: 24,
  },
  listText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.xxl,
    lineHeight: 26,
  },
  spacer: {
    height: Spacing.xl,
  },
  bottomSpacer: {
    height: 40,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.textMuted,
    fontSize: FontSize.displaySm,
    marginBottom: Spacing.xxl,
  },
  backButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  backButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
