import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing } from '../constants/theme';

type StandardLayoutSectionProps = {
    children?: React.ReactNode;
};

export const StandardLayoutFilters = ({ children }: StandardLayoutSectionProps) => {
    return <>{children}</>;
};

export const StandardLayoutAdvancedFilters = ({ children }: StandardLayoutSectionProps) => {
    return <>{children}</>;
};

export const StandardLayoutBody = ({ children }: StandardLayoutSectionProps) => {
    return <>{children}</>;
};

StandardLayoutFilters.displayName = 'StandardLayout.Filters';
StandardLayoutAdvancedFilters.displayName = 'StandardLayout.AdvancedFilters';
StandardLayoutBody.displayName = 'StandardLayout.Body';

type StandardLayoutProps = {
    title: string;
    subtitle?: string;
    disableScroll?: boolean;
    onBackPress?: () => void;
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
    onBackPress,
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
            if (child !== null && child !== undefined && child !== false) rest.push(child);
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

        if (childType === StandardLayoutAdvancedFilters ||
            childType?.displayName === StandardLayoutAdvancedFilters.displayName
        ) {
            const el = child as React.ReactElement<StandardLayoutSectionProps>;
            advancedFilters = el.props.children;
            return;
        }

        if (child.type === StandardLayoutBody || childType?.displayName === StandardLayoutBody.displayName) {
            const el = child as React.ReactElement<StandardLayoutSectionProps>;
            body = el.props.children;
            return;
        }

        rest.push(child);
    });

    const hasFilters = !!filters;
    const hasAdvancedFilters = !!advancedFilters;

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
            <View style={styles.headerContainer}>
                {onBackPress ? (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onBackPress}
                        accessibilityRole="button"
                        accessibilityLabel="Back"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                    </TouchableOpacity>
                ) : null}
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                {hasFilters ? (
                    <View style={styles.filtersContainer}>
                        <StandardLayoutFilters>{filters}</StandardLayoutFilters>
                    </View>
                ) : null}
                <View>
                    {hasAdvancedFilters ? (
                        <View style={styles.advancedFiltersContainer}>
                            <View style={styles.advancedFiltersButtons}>
                                <TouchableOpacity
                                    style={styles.filtersToggle}
                                    onPress={() => setFiltersExpanded((v) => !v)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.filtersToggleText}>
                                        {filtersExpanded ? 'Hide filters' : 'Show filters'}
                                    </Text>
                                    <Ionicons name="filter" size={16} color={Colors.textMuted} />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.filtersToggle}
                                    onPress={() => router.push('/glossary')}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.filtersToggleText}>
                                        Glossary
                                    </Text>
                                    <Ionicons name="book" size={16} color={Colors.textMuted} />
                                </TouchableOpacity>
                            </View>
                            {filtersExpanded ? (
                                <View style={styles.advancedFiltersContent}>
                                    <StandardLayoutAdvancedFilters>{advancedFilters}</StandardLayoutAdvancedFilters>
                                </View>
                            ) : null}
                        </View>
                    ) : null}

                </View>
            </View>
            {disableScroll ? (
                <View style={[styles.content, styles.nonScrollContent]}>
                    {body ? <StandardLayoutBody>{body}</StandardLayoutBody> : null}
                    {rest.length > 0 ? <View>{rest}</View> : null}
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                >
                    {body ? <StandardLayoutBody>{body}</StandardLayoutBody> : null}
                    {rest.length > 0 ? <View>{rest}</View> : null}
                </ScrollView>
            )}
        </View>
    );
};

export const StandardLayout: StandardLayoutCompound = Object.assign(StandardLayoutBase, {
    Filters: StandardLayoutFilters,
    AdvancedFilters: StandardLayoutAdvancedFilters,
    Body: StandardLayoutBody,
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundScreen,
    },
    title: {
        color: Colors.textPrimary,
        fontSize: FontSize.displayXXXl,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    subtitle: {
        color: Colors.textPlaceholder,
        fontSize: FontSize.lg,
        fontWeight: '500',
    },
    headerContainer: {
        paddingHorizontal: Spacing.xxl,
        paddingTop: Spacing.xxl,
        paddingBottom: Spacing.xxl,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderDefault,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: Spacing.md,
        paddingVertical: Spacing.xs,
    },
    filtersContainer: {
        marginTop: Spacing.xl,
        gap: Spacing.md,
    },
    advancedFiltersContainer: {
        marginTop: Spacing.xl,
    },
    filtersToggle: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: Spacing.sm,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: 12,
        backgroundColor: Colors.backgroundCard,
        borderWidth: 1,
        borderColor: Colors.borderDefault,
    },
    filtersToggleText: {
        color: Colors.textPrimary,
        fontSize: FontSize.base,
        fontWeight: '700',
    },
    filtersContent: {
        paddingTop: Spacing.sm,
    },
    advancedFiltersContent: {
        paddingTop: 0,
    },
    advancedFiltersButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    scrollView: {
        flex: 1,
        backgroundColor: Colors.backgroundScreen,
    },
    content: {
        padding: Spacing.xxl,
        flexGrow: 1,
    },
    nonScrollContent: {
        paddingTop: 0,
        flex: 1,
    },
});