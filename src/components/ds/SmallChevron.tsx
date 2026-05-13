import { BorderRadius, Colors } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export const SmallChevron = () => {
    return (
        <View style={styles.cardChevronWrap} pointerEvents="none">
            <Ionicons
                name="chevron-forward"
                size={22}
                color={Colors.accent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    cardChevronWrap: {
        backgroundColor: Colors.accentWashFill,
        justifyContent: 'center',
        alignItems: 'center',
        height: 32,
        width: 32,
        borderRadius: BorderRadius.xxl,
    },
});