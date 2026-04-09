import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, FontSize, Spacing } from '../constants/theme';

type StandardLayoutSectionProps = {
    children?: React.ReactNode;
};

export const StandardLayoutFilters = ({ children }: StandardLayoutSectionProps) => {
    return <>{children}</>;
};

export const StandardLayoutBody = ({ children }: StandardLayoutSectionProps) => {
    return <>{children}</>;
};

type StandardLayoutProps = {
    title: string;
    subtitle?: string;
    disableScroll?: boolean;
    children?: React.ReactNode;
};

type StandardLayoutCompound = React.FC<StandardLayoutProps> & {
    Filters: typeof StandardLayoutFilters;
    Body: typeof StandardLayoutBody;
};

const StandardLayoutBase: React.FC<StandardLayoutProps> = ({
    title,
    subtitle,
    disableScroll = false,
    children,
}) => {
    const insets = useSafeAreaInsets();

    let filters: React.ReactNode = null;
    let body: React.ReactNode = null;
    const rest: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
        if (!React.isValidElement(child)) {
            if (child !== null && child !== undefined && child !== false) rest.push(child);
            return;
        }

        if (child.type === StandardLayoutFilters) {
            const el = child as React.ReactElement<StandardLayoutSectionProps>;
            filters = el.props.children;
            return;
        }

        if (child.type === StandardLayoutBody) {
            const el = child as React.ReactElement<StandardLayoutSectionProps>;
            body = el.props.children;
            return;
        }

        rest.push(child);
    });

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
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
                {filters ? <StandardLayoutFilters>{filters}</StandardLayoutFilters> : null}
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