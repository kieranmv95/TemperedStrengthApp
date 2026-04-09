# iCloud Sync manual test checklist

Prereqs:
- Install an iOS **development build** (not Expo Go).
- Ensure the device is signed into iCloud and **iCloud Drive** is enabled.
- Install the app on **two devices** signed into the same Apple ID.

## First-time enable
- On Device A, go to `Account` tab.
- Confirm **iCloud Sync** shows **Available**.
- Toggle **Enable Sync** on.
- Tap **Sync now**.
- Confirm `Last synced` updates and `Last error` is empty.

## Cross-device restore
- On Device A, create some state:
  - Select a program (if unset)
  - Log a set
  - Add workout notes for a day
  - Favorite a workout
- Tap **Sync now**.
- On Device B, open `Account`, toggle **Enable Sync** on, then tap **Sync now**.
- Confirm on Device B:
  - Program selection matches
  - Notes/favorites/logs appear

## Concurrent edits merge
- On Device A, add a note on `dayIndex=1`, then Sync.
- On Device B, add a note on `dayIndex=2`, then Sync.
- Sync on both devices again.
- Confirm both notes exist.

## Conflict behavior (same key)
- On both devices, edit the **same** workout note (same `dayIndex`) with different text.
- Sync both devices.\n+- Confirm the value resolves to the device that synced with the newer domain `updatedAt` (last-write-wins at domain leaf conflict level).

## Disable sync
- Toggle **Enable Sync** off on Device A.\n+- Make changes locally.\n+- Confirm no automatic sync happens until re-enabled.\n+- Re-enable and run **Sync now** to upload.

