import * as Location from 'expo-location';
import { Alert } from 'react-native';

export type UserCoords = {
  latitude: number;
  longitude: number;
};

function promptForDiscoverLocation(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      'Use your location?',
      'Allow location access to sort nearby listings by distance and show how far each one is from you.',
      [
        { text: 'Not now', style: 'cancel', onPress: () => resolve(false) },
        {
          text: 'Allow',
          onPress: () => {
            void (async () => {
              const { status } =
                await Location.requestForegroundPermissionsAsync();
              resolve(status === Location.PermissionStatus.GRANTED);
            })();
          },
        },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}

export async function resolveDiscoverLocation(): Promise<UserCoords | null> {
  let permission = await Location.getForegroundPermissionsAsync();

  if (permission.status === Location.PermissionStatus.UNDETERMINED) {
    const allowed = await promptForDiscoverLocation();
    if (!allowed) {
      return null;
    }
    permission = await Location.getForegroundPermissionsAsync();
  }

  if (permission.status !== Location.PermissionStatus.GRANTED) {
    return null;
  }

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch {
    return null;
  }
}
