import { Colors, FontSize, Spacing } from "@/src/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AwardIcon, { AwardIconVariant } from "./AwardIcon";


type AwardProps = {
    badgeTitle: string;
    title: string;
    description: string;
    variant: AwardIconVariant;
    awardPro?: boolean;
    fontSize?: number;
    granted: boolean;
}

export default function Award({ badgeTitle, title, description, variant, awardPro = false, fontSize, granted }: AwardProps) {
    return (
        <View style={[styles.container, !granted && styles.containerLocked]}>
            <View style={styles.icon}>
                <AwardIcon variant={variant} text={awardPro ? 'Locked' : badgeTitle} size={80} fontSize={fontSize} />
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{awardPro ? 'Locked Award' : title}</Text>
                <Text style={styles.description}>{awardPro ? 'Unlock all awards with a pro subscription' : description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        opacity: 1,
        flexDirection: 'row',
        gap: Spacing.md,
    },
    containerLocked: {
        opacity: 0.5,
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        minWidth: 0,
        flexShrink: 1,
        justifyContent: 'center',
        gap: Spacing.xs,
    },
    title: {
        color: Colors.textPrimary,
        fontSize: FontSize.displaySm,
        fontWeight: '700',
        flexShrink: 1,
    },
    description: {
        color: Colors.accentOverlay,
        fontSize: FontSize.md,
        fontWeight: '400',
        flexShrink: 1,
    },

});