# Apple HealthKit Integration

## Overview

Allow users to automatically save completed workout sessions to Apple Health as strength training workouts. This is a write-only integration — the app does not need to read any health data. A toggle in Settings controls whether the feature is active.

## Scope

- iOS only (HealthKit is not available on Android)
- Write-only: save workout start time, end time, and workout type
- No calorie estimation — if the user has an Apple Watch, Apple Health will merge heart rate data and calculate calories automatically. Passing an estimated value risks conflicting with real biometric data.
- No user profile or body weight input required

## Dependencies

### New Library

`react-native-health` — the standard React Native wrapper around Apple's HealthKit framework.

This is a native dependency and requires a dev client build (not Expo Go). The project already uses dev client builds via EAS (evidenced by `react-native-purchases`), so no workflow change is needed.

### Apple Developer Portal

Enable the **HealthKit** capability on the App ID (`com.kieranvenison.temperedstrengthapp`) in Certificates, Identifiers & Profiles. EAS Build may handle this automatically with managed credentials, but verify in the portal.

### App Store Connect

Update the app's privacy details to declare HealthKit usage (write access to workout data).

## Configuration Changes

### `app.json`

Add HealthKit entitlement and usage descriptions under `expo.ios`:

```json
"ios": {
  "infoPlist": {
    "NSHealthShareUsageDescription": "Tempered Strength can read your health data to enhance your training insights.",
    "NSHealthUpdateUsageDescription": "Tempered Strength saves your completed workouts to Apple Health so they appear alongside your other fitness data."
  },
  "entitlements": {
    "com.apple.developer.healthkit": true
  }
}
```

Both usage description keys are required by Apple even if only write access is used.

## Data Layer

### New Storage Key

```
const HEALTH_KIT_ENABLED_KEY = 'health_kit_enabled';
```

### New Storage Functions (`src/utils/storage.ts`)

- `getHealthKitEnabled(): Promise<boolean>` — returns the user's preference (defaults to `false`)
- `setHealthKitEnabled(enabled: boolean): Promise<void>` — persists the toggle state

This key should **not** be cleared by `clearProgramData()` — it is a user-level preference, not program-specific data.

## New Utility: `src/utils/healthkit.ts`

Encapsulates all HealthKit interaction behind a clean interface:

```typescript
import { Platform } from 'react-native';
import AppleHealthKit, {
  HealthKitPermissions,
} from 'react-native-health';

const permissions: HealthKitPermissions = {
  permissions: {
    read: [],
    write: [AppleHealthKit.Constants.Permissions.Workout],
  },
};

export const initHealthKit = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (Platform.OS !== 'ios') {
      resolve(false);
      return;
    }
    AppleHealthKit.initHealthKit(permissions, (err) => {
      resolve(!err);
    });
  });
};

export const saveWorkoutToHealthKit = (
  startedAt: number,
  completedAt: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (Platform.OS !== 'ios') {
      resolve();
      return;
    }
    AppleHealthKit.saveWorkout(
      {
        type: AppleHealthKit.Constants.Activities.TraditionalStrengthTraining,
        startDate: new Date(startedAt).toISOString(),
        endDate: new Date(completedAt).toISOString(),
      },
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
};
```

## Settings Screen Changes (`app/(tabs)/settings.tsx`)

Add a new row (iOS only) between the subscription item and the "Change Program" item:

- Title: **"Apple Health"**
- Description: "Save completed workouts to Apple Health"
- A toggle switch (`Switch` component) bound to the `health_kit_enabled` storage value
- On first toggle to `true`:
  1. Call `initHealthKit()` to request permission
  2. If granted, persist `true` to storage
  3. If denied, show an alert guiding the user to Settings > Health > Tempered Strength, and keep the toggle `false`
- On toggle to `false`: persist `false` to storage (does not revoke OS-level permission, just stops the app from writing)
- Wrapped in `Platform.OS === 'ios'` so it never renders on Android

## Workout Session Integration (`src/screens/WorkoutScreen.tsx`)

In the existing `handleFinishSession` handler, after saving the `CompletedSession` and before showing the summary modal:

1. Check if HealthKit is enabled via `getHealthKitEnabled()`
2. If enabled, call `saveWorkoutToHealthKit(activeSession.startedAt, completedAt)`
3. Fire-and-forget — do not block the summary modal on the HealthKit write. Log errors to console but do not show them to the user. The workout completion flow must never fail due to a HealthKit error.

## Platform Gating

All HealthKit code paths must be gated on `Platform.OS === 'ios'`:

- The settings toggle is not rendered on Android
- `healthkit.ts` utility functions return no-ops on non-iOS platforms
- No conditional imports needed — `react-native-health` handles platform checks internally, but the explicit gating avoids unnecessary calls

## App Review Considerations

- Apple requires a clear explanation of why the app uses HealthKit. Since this is write-only for workout data, it is a low-risk integration and typically passes review without issue.
- The `NSHealthUpdateUsageDescription` string should be user-friendly and specific about what data is written.
- Do not request more permissions than needed. Read permissions should stay empty unless a future feature requires them.

## Future Considerations

- **Google Health Connect (Android):** A separate integration using `react-native-health-connect`. Same architectural pattern (settings toggle, write-only, fire-and-forget) but a different library and permission model. Can be added independently.
- **Calorie estimation:** Would require collecting user body weight (settings or onboarding). Use MET-based calculation: `calories = MET * weight_kg * duration_hours`. Map the existing 1-10 intensity scale to MET values (3.5 for light, 6.0 for very hard). Only worth adding if a user profile feature is built.
- **Workout metadata:** HealthKit supports attaching metadata like total energy burned, distance, etc. These could be enriched over time without changing the core integration.

## Files Changed

- `app.json` — add HealthKit entitlement and usage descriptions
- `src/utils/storage.ts` — add `getHealthKitEnabled` / `setHealthKitEnabled`
- **New:** `src/utils/healthkit.ts` — HealthKit init and save functions
- `app/(tabs)/settings.tsx` — add Apple Health toggle (iOS only)
- `src/screens/WorkoutScreen.tsx` — call `saveWorkoutToHealthKit` in finish session flow

## Estimated Effort

1-2 days including config, implementation, and testing on a physical device (HealthKit is not available in Simulator without limitations).
