import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

let handlerConfigured = false;
let channelConfigured = false;

const ensureNotificationHandler = () => {
  if (handlerConfigured) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  handlerConfigured = true;
};

const ensureAndroidChannel = async () => {
  if (Platform.OS !== "android" || channelConfigured) return;
  await Notifications.setNotificationChannelAsync("rest-timer", {
    name: "Rest Timer",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
  channelConfigured = true;
};

export const requestRestTimerPermissions = async (): Promise<boolean> => {
  ensureNotificationHandler();
  await ensureAndroidChannel();

  const settings = await Notifications.getPermissionsAsync();
  if (settings.status === "granted") {
    return true;
  }

  const request = await Notifications.requestPermissionsAsync();
  return request.status === "granted";
};

export const scheduleRestTimerNotification = async (
  durationSeconds: number,
  exerciseName?: string
): Promise<string | null> => {
  const hasPermission = await requestRestTimerPermissions();
  if (!hasPermission) return null;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Rest complete",
      body: exerciseName
        ? `${exerciseName} is ready for the next set.`
        : "Ready for the next set.",
      sound: "default",
    },
    trigger: {
      seconds: Math.max(1, Math.round(durationSeconds)),
      channelId: "rest-timer",
    },
  });
};

export const cancelRestTimerNotification = async (
  notificationId?: string | null
): Promise<void> => {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error("Error cancelling rest timer notification:", error);
  }
};
