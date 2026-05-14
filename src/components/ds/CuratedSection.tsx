import { Colors, FontSize, Spacing } from "@/src/constants/theme";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

type CuratedSectionProps = {
    title: string;
    description: string;
    size: 'large' | 'medium' | 'small'
    style?: StyleProp<ViewStyle>;
    icon?: string;
    iconSizeOverride?: number;
    theme?: 'gold';
};

export const CuratedSection = ({ title, description, size, style, icon, iconSizeOverride, theme }: CuratedSectionProps) => {
    const iconSize = () => {
        if (iconSizeOverride) {
            return iconSizeOverride;
        }

        switch (size) {
            case 'large':
                return 28;
            case 'medium':
                return 24;
            case 'small':
                return 20;
            default:
                return 20;
        }
    }
    return (
        <View style={[styles.header, style]}>
            <View style={styles.titleRow}>
                {icon && (
                    <Ionicons
                        name={icon as any}
                        size={iconSize()}
                        color={Colors.accent}
                    />
                )}
                <Text style={[styles.title, styles[`title_${size}`], theme && styles[`title_${theme}`]]}>{title}</Text>
            </View>
            <Text style={styles.description}>
                {description}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        borderLeftWidth: 1,
        borderLeftColor: Colors.accent,
        paddingLeft: Spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    title: {
        color: Colors.textPrimary,
        fontWeight: '800',
        marginBottom: 4,
    },
    title_gold: { color: Colors.accent },
    title_large: { fontSize: FontSize.displayXl, },
    title_medium: { fontSize: FontSize.displaySm, },
    title_small: { fontSize: FontSize.xl, },
    description: {
        color: Colors.textMuted,
        fontSize: FontSize.lg,
        lineHeight: 20,
    },
})