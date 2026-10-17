import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionChip } from './Chip';
import {
  color,
  MIN_TARGET_SIZE,
  space,
  typography,
} from '@/src/constants/tokens';

type StandardLayoutSectionProps = {
  children?: React.ReactNode;
};

export const StandardLayoutFilters = ({
  children,
}: StandardLayoutSectionProps) => {
  return <>{children}</>;
};

export const StandardLayoutAdvancedFilters = ({
  children,
}: StandardLayoutSectionProps) => {
  return <>{children}</>;
};

export const StandardLayoutBody = ({
  children,
}: StandardLayoutSectionProps) => {
  return <>{children}</>;
};

StandardLayoutFilters.displayName = 'StandardLayout.Filters';
StandardLayoutAdvancedFilters.displayName = 'StandardLayout.AdvancedFilters';
StandardLayoutBody.displayName = 'StandardLayout.Body';

type StandardLayoutProps = {
  title: string;
  subtitle?: string;
  disableScroll?: boolean;
  /** Drop body horizontal padding so nested rows can scroll edge-to-edge. */
  edgeToEdgeBody?: boolean;
  onBackPress?: () => void;
  /** Trailing controls in the title row, beside the back button and title. */
  headerActions?: React.ReactNode;
  /** Show filter bar row (Glossary + filterBarButtons) without expandable advanced filters. */
  filterBarOnly?: boolean;
  /** Extra pills in the filter bar row (e.g. Sort by on Workouts). */
  filterBarButtons?: React.ReactNode;
  /** Content below the filter bar buttons (e.g. expanded sort panel). */
  filterBarBelowButtons?: React.ReactNode;
  /** Shown beside the title, e.g. an account badge. */
  titleAccessory?: React.ReactNode;
  children?: React.ReactNode;
};

type StandardLayoutCompound = React.FC<StandardLayoutProps> & {
  Filters: typeof StandardLayoutFilters;
  AdvancedFilters: typeof StandardLayoutAdvancedFilters;
  Body: typeof StandardLayoutBody;
};

const StandardLayoutBase: React.FC<StandardLayoutProps> = ({
  title,
  subtitle,
  disableScroll = false,
  edgeToEdgeBody = false,
  onBackPress,
  headerActions,
  filterBarOnly = false,
  filterBarButtons,
  filterBarBelowButtons,
  titleAccessory,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const [filtersExpanded, setFiltersExpanded] = React.useState(false);

  let filters: React.ReactNode = null;
  let advancedFilters: React.ReactNode = null;
  let body: React.ReactNode = null;

  const rest: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      if (child !== null && child !== undefined && child !== false)
        rest.push(child);
      return;
    }

    const childType = child.type as any;

    if (
      child.type === StandardLayoutFilters ||
      childType?.displayName === StandardLayoutFilters.displayName
    ) {
      const el = child as React.ReactElement<StandardLayoutSectionProps>;
      filters = el.props.children;
      return;
    }

    if (
      childType === StandardLayoutAdvancedFilters ||
      childType?.displayName === StandardLayoutAdvancedFilters.displayName
    ) {
      const el = child as React.ReactElement<StandardLayoutSectionProps>;
      advancedFilters = el.props.children;
      return;
    }

    if (
      child.type === StandardLayoutBody ||
      childType?.displayName === StandardLayoutBody.displayName
    ) {
      const el = child as React.ReactElement<StandardLayoutSectionProps>;
      body = el.props.children;
      return;
    }

    rest.push(child);
  });

  const hasFilters = !!filters;
  const hasAdvancedFilters = !!advancedFilters;
  const showFilterBar = hasAdvancedFilters || filterBarOnly;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.header}>
        {onBackPress ? (
          <View style={styles.headerRow}>
            <Pressable
              style={styles.backButton}
              onPress={onBackPress}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <Ionicons name="arrow-back" size={24} color={color.textPrimary} />
            </Pressable>
            <Text
              style={[styles.title, styles.titleInRow]}
              numberOfLines={2}
              accessibilityRole="header"
            >
              {title}
            </Text>
            {titleAccessory}
          </View>
        ) : (
          <View style={titleAccessory ? styles.titleRow : null}>
            <Text
              style={[
                styles.title,
                titleAccessory ? styles.titleBesideAccessory : null,
              ]}
              accessibilityRole="header"
            >
              {title}
            </Text>
            {titleAccessory}
          </View>
        )}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {headerActions ? (
          <View style={styles.headerActions}>{headerActions}</View>
        ) : null}
        {hasFilters ? (
          <View style={styles.filtersContainer}>
            <StandardLayoutFilters>{filters}</StandardLayoutFilters>
          </View>
        ) : null}
        {showFilterBar ? (
          <View style={styles.filterBar}>
            <View style={styles.filterBarButtons}>
              {hasAdvancedFilters ? (
                <ActionChip
                  label={filtersExpanded ? 'Hide filters' : 'Show filters'}
                  icon="options-outline"
                  tone={filtersExpanded ? 'gold' : 'neutral'}
                  onPress={() => setFiltersExpanded((v) => !v)}
                  accessibilityLabel="Filters"
                  accessibilityState={{ expanded: filtersExpanded }}
                />
              ) : null}
              <ActionChip
                label="Glossary"
                icon="book-outline"
                tone="neutral"
                onPress={() => router.push('/glossary')}
                accessibilityLabel="Open the glossary"
              />
              {filterBarButtons}
            </View>
            {filterBarBelowButtons}
            {hasAdvancedFilters && filtersExpanded ? (
              <StandardLayoutAdvancedFilters>
                {advancedFilters}
              </StandardLayoutAdvancedFilters>
            ) : null}
          </View>
        ) : null}
      </View>
      {disableScroll ? (
        <View
          style={[
            styles.content,
            styles.nonScrollContent,
            edgeToEdgeBody ? styles.edgeToEdgeBody : null,
          ]}
        >
          {body ? <StandardLayoutBody>{body}</StandardLayoutBody> : null}
          {rest.length > 0 ? <View>{rest}</View> : null}
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            edgeToEdgeBody ? styles.edgeToEdgeBody : null,
            { paddingBottom: insets.bottom + space.xl },
          ]}
        >
          {body ? <StandardLayoutBody>{body}</StandardLayoutBody> : null}
          {rest.length > 0 ? <View>{rest}</View> : null}
        </ScrollView>
      )}
    </View>
  );
};

export const StandardLayout: StandardLayoutCompound = Object.assign(
  StandardLayoutBase,
  {
    Filters: StandardLayoutFilters,
    AdvancedFilters: StandardLayoutAdvancedFilters,
    Body: StandardLayoutBody,
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bg,
  },
  header: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    paddingBottom: space.sm,
    gap: space.xxs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  backButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    justifyContent: 'center',
    marginLeft: -space.xs,
  },
  title: {
    ...typography.title1,
    color: color.textPrimary,
  },
  titleInRow: {
    flex: 1,
    minWidth: 0,
  },
  titleBesideAccessory: {
    flexShrink: 1,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Baseline, not centre: the display font sits low in its line box, so a
    // centred badge looks raised next to the title.
    alignItems: 'baseline',
    gap: space.xs,
  },
  subtitle: {
    ...typography.callout,
    color: color.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xs,
    marginTop: space.xs,
  },
  filtersContainer: {
    marginTop: space.sm,
    gap: space.xs,
  },
  filterBar: {
    marginTop: space.sm,
    gap: space.xs,
  },
  filterBarButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xs,
  },
  scrollView: {
    flex: 1,
    backgroundColor: color.bg,
  },
  content: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    flexGrow: 1,
  },
  scrollContent: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    flexGrow: 1,
  },
  nonScrollContent: {
    paddingTop: 0,
    paddingHorizontal: space.md,
    flex: 1,
  },
  edgeToEdgeBody: {
    paddingHorizontal: 0,
  },
});
