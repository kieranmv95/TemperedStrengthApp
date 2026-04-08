import { BorderRadius, Colors, FontSize, Spacing } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type PillProps = {
    onPress: () => void;
    isActive: boolean;
    label: string;
    icon?: string;
    count?: number;
};

export const Pill = ({ onPress, isActive, label, icon, count }: PillProps) => {
    return (
        <TouchableOpacity
            style={[styles.filterTab, isActive && styles.filterTabActive]}
            onPress={onPress}
        >
            {icon && (
                <Ionicons
                    name={icon as any}
                    size={14}
                    color={isActive ? Colors.textOnAccent : Colors.textMuted}
                    style={styles.filterIcon}
                />
            )}
            <Text
                style={[
                    styles.filterTabText,
                    isActive && styles.filterTabTextActive,
                ]}
            >
                {label}
            </Text>
            {count && (
                <Text
                    style={[
                        styles.filterCount,
                        isActive && styles.filterCountActive,
                    ]}
                >
                    {count}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.pill,
        backgroundColor: Colors.backgroundCard,
        borderWidth: 1,
        borderColor: Colors.borderDefault,
    },
    filterTabActive: {
        backgroundColor: Colors.accent,
        borderColor: Colors.accent,
    },
    filterIcon: {
        marginRight: Spacing.xs,
    },
    filterTabText: {
        color: Colors.textMuted,
        fontSize: FontSize.lg,
        fontWeight: '600',
    },
    filterTabTextActive: {
        color: Colors.textOnAccent,
    },
    filterCount: {
        color: Colors.textPlaceholder,
        fontSize: FontSize.md,
        fontWeight: '600',
        marginLeft: Spacing.sm,
    },
    filterCountActive: {
        color: Colors.textOnAccent,
        opacity: 0.7,
    },
});