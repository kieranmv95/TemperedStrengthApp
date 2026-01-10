import { initializeRevenueCat } from "@/src/services/revenueCatService";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  useEffect(() => {
    // Initialize RevenueCat when app starts
    initializeRevenueCat().catch((error) => {
      console.error("Failed to initialize RevenueCat:", error);
    });
  }, []);

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
        <Stack.Screen
          name="paywall"
          options={{ presentation: "modal", title: "Upgrade to Pro" }}
        />
        <Stack.Screen
          name="customer-center"
          options={{ presentation: "modal", title: "Subscription" }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
