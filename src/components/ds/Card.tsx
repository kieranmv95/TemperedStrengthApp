import { BorderRadius, Colors, Spacing } from "@/src/constants/theme";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

type CardProps = {
    children: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    accessibilityLabel?: string;
    activeOpacity?: number;
};

export const Card = ({ children, onPress, style, accessibilityLabel, activeOpacity }: CardProps) => {
    if (onPress) {
        return (
            <TouchableOpacity
                accessibilityRole="button"
                style={[styles.card, style]}
                onPress={onPress}
                accessibilityLabel={accessibilityLabel}
                activeOpacity={activeOpacity || 0.7}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.card}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.backgroundCard,
        borderRadius: BorderRadius.xxl,
        borderWidth: 1,
        borderColor: Colors.backgroundElevated,
        padding: Spacing.xxl,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
});