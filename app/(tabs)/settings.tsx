import { useSubscription } from "@/hooks/use-subscription";
import { getProgramById, Program } from "@/src/utils/program";
import { clearProgramData, getActiveProgramId } from "@/src/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const [hasProgram, setHasProgram] = useState<boolean>(false);
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const {  isPro, isLoading: subscriptionLoading, refresh } = useSubscription();

  const checkProgramStatus = async () => {
    try {
      const programId = await getActiveProgramId();
      const hasActiveProgram = !!programId;
      setHasProgram(hasActiveProgram);

      if (hasActiveProgram && programId) {
        const program = getProgramById(programId);
        setActiveProgram(program || null);
      } else {
        setActiveProgram(null);
      }
    } catch (error) {
      console.error("Error checking program status:", error);
      setHasProgram(false);
      setActiveProgram(null);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkProgramStatus();
      refresh(); // Refresh subscription status when screen is focused
    }, [refresh])
  );

  const handleSubscriptionPress = () => {
    if (isPro) {
      // Open Customer Center for Pro users
      router.push("/customer-center");
    } else {
      // Open Paywall for non-Pro users
      router.push("/paywall");
    }
  };

  const handleChangeProgram = () => {
    Alert.alert(
      "Change Program",
      "Changing your program will lose all progress on your current program, including your workout logs and exercise swaps.\n\nFinishing a program to completion is the best approach for achieving your fitness goals.\n\nAre you sure you want to change programs?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Change Program",
          style: "destructive",
          onPress: async () => {
            try {
              await clearProgramData();
              setHasProgram(false);
              setActiveProgram(null);
              // Navigate back to Program tab (index)
              router.replace("/");
            } catch (error) {
              console.error("Error changing program:", error);
              Alert.alert(
                "Error",
                "Failed to change program. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete ALL stored data including:\n\n• Program progress\n• Workout logs\n• Exercise swaps\n• Custom set counts\n• Exercise cache\n\nThis action cannot be undone.\n\nAre you sure you want to clear all data?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All Data",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setHasProgram(false);
              setActiveProgram(null);
              // Navigate back to Program tab (index)
              router.replace("/");
              Alert.alert("Success", "All data has been cleared.");
            } catch (error) {
              console.error("Error clearing all data:", error);
              Alert.alert(
                "Error",
                "Failed to clear all data. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.settingsList}>
          <TouchableOpacity
            style={[styles.settingItem, isPro && styles.proItem]}
            onPress={handleSubscriptionPress}
            disabled={subscriptionLoading}
          >
            <View style={styles.settingContent}>
              <View style={styles.settingTitleRow}>
                <Text style={styles.settingTitle}>
                  {isPro ? "Tempered Strength Pro" : "Upgrade to Pro"}
                </Text>
                {isPro && (
                  <View style={styles.proBadge}>
                    <Text style={styles.proBadgeText}>ACTIVE</Text>
                  </View>
                )}
              </View>
              <Text style={styles.settingDescription}>
                {isPro
                  ? "Manage your subscription and access Pro features"
                  : "Unlock all premium features with a subscription"}
              </Text>
              {isPro && (
                <View style={styles.proFeaturesList}>
                  <Text style={styles.proTitle}>Your Pro features include:</Text>
                  <Text style={styles.proFeatureItem}>- All programs access</Text>
                  <Text style={styles.proFeatureItem}>- All workout access</Text>
                  <Text style={styles.proFeatureItem}>- Unlimited exercise swaps</Text>
                  <Text style={styles.proFeatureItem}>- Early access to new features</Text>
                </View>
              )}
            </View>
            <Text style={[styles.settingArrow, isPro && styles.proArrow]}>
              →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.settingItem,
              !hasProgram && styles.settingItemDisabled,
            ]}
            onPress={handleChangeProgram}
            disabled={!hasProgram}
          >
            <View style={styles.settingContent}>
              <Text
                style={[
                  styles.settingTitle,
                  !hasProgram && styles.settingTitleDisabled,
                ]}
              >
                Change Program
              </Text>
              <Text style={styles.settingDescription}>
                {hasProgram && activeProgram
                  ? activeProgram.name
                  : "Select a different program"}
              </Text>
            </View>
            <Text
              style={[
                styles.settingArrow,
                !hasProgram && styles.settingArrowDisabled,
              ]}
            >
              →
            </Text>
          </TouchableOpacity>

          {__DEV__ && (
            <TouchableOpacity
              style={[styles.settingItem, styles.dangerItem]}
              onPress={handleClearAllData}
            >
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, styles.dangerText]}>
                  Clear All Data
                </Text>
                <Text style={styles.settingDescription}>
                  Permanently delete all stored data
                </Text>
              </View>
              <Text style={[styles.settingArrow, styles.dangerText]}>→</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  settingTitleDisabled: {
    color: "#888",
  },
  settingDescription: {
    color: "#888",
    fontSize: 14,
    lineHeight: 20,
  },
  settingArrow: {
    color: "#c9b072",
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 12,
  },
  settingArrowDisabled: {
    color: "#666",
  },
  dangerItem: {
    borderColor: "#FF4444",
  },
  dangerText: {
    color: "#FF4444",
  },
  proItem: {
    borderColor: "#c9b072",
  },
  proArrow: {
    color: "#c9b072",
  },
  settingTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  proBadge: {
    backgroundColor: "#c9b072",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proBadgeText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  proTitle: {
    color: "#c9b072",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  proFeaturesList: {
    marginTop: 8,
    gap: 4,
  },
  proFeatureItem: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
});
