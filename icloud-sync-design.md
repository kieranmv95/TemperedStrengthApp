## iCloud Sync (Backup/Restore) – Engineering Design

### Motivation

The app currently persists all user state locally using AsyncStorage in a flat key-value structure. This works well, supports offline use, and must remain fully preserved.

Goal: add an **optional**, **non-breaking** iCloud sync feature on iOS that acts purely as a **backup/restore layer**. AsyncStorage remains the source of truth for all reads/writes; iCloud is only used to mirror local writes and to restore/merge data on app launch/foreground.

Android is in development only and has no deployed users; the feature must be hidden there and silently fall back to local-only behavior.

### Non-goals

- Replacing AsyncStorage as primary storage.
- Changing any existing AsyncStorage **key names** or **value shapes**.
- Forcing users through re-onboarding or migrations.
- Supporting Android cloud sync in this iteration.

### Library choice

Use `expo-icloud-storage`, an Expo module wrapper around Apple’s `NSUbiquitousKeyValueStore` (iOS-only key-value storage).

Notes/limits (Apple KVS constraints):
- Total storage limit is ~1MB and key count is capped (commonly documented as 1024 keys).
- Sync timing is nondeterministic (background sync); it is not a transactional database.

If these constraints become limiting, the design’s provider abstraction allows swapping to an iCloud Drive file-based backup provider later.

### Architecture overview

Introduce a sync subsystem under `src/sync/` built around a provider abstraction.

```mermaid
flowchart TD
  SettingsUI[SettingsUIToggle(iOSOnly)] --> SyncContext[SyncManagerProvider]
  SyncContext --> SyncManager[SyncManager]
  SyncManager --> Provider[SyncProvider]
  Provider --> ICloud[ICloudKvsProvider(iOS)]
  Provider --> Noop[NoopSyncProvider(AndroidOrDisabled)]
  StorageWrites[src/utils/storage.ts+metricService] --> SyncStorage[SyncAwareStorageHelpers]
  SyncStorage --> Async[AsyncStorage(SourceOfTruth)]
  SyncStorage --> SyncManager
  SyncManager --> ConflictModal[ConflictModal(KeepLocalOrICloud)]
```

Key points:
- **All reads remain local** (AsyncStorage).
- **All writes remain local first**, then optionally mirrored to iCloud.
- Sync runs only when explicitly enabled by the user (iOS-only toggle).

### Provider abstraction (future Android extensibility)

Define a `SyncProvider` interface to support multiple backends:
- iOS implementation: `ICloudKvsProvider`
- Android (and disabled): `NoopSyncProvider`
- Future: `GoogleDriveProvider` (or other) can implement the same interface with no changes to middleware or conflict UI.

### Data model (preserve existing keys and shapes)

Local (AsyncStorage):
- Existing keys and values are unchanged.
- Store per-key sync timestamp in **new internal keys**:
  - `__sync_ts__:<key>` → stringified number milliseconds since epoch
  - Missing timestamp is treated as `0` (legacy/migration default).

iCloud:
- Store iCloud mirror entries under the **same logical key name** but with a JSON envelope:
  - `{"v": <string|null>, "ts": <number>, "deleted": <boolean>}`
  - `v` is always the raw string stored in AsyncStorage.
  - `deleted` marks tombstones to prevent “resurrection” of older values.
- Backward compatibility:
  - If iCloud contains a raw string that is not parseable JSON, treat as `v=<rawString>`, `ts=0`.

### Middleware pattern (mirroring local writes)

All local storage mutations are routed through sync-aware helpers:
- `setString(key, value)`
- `removeKey(key)`

Behavior:
- Write to AsyncStorage first.
- If sync is enabled and iCloud is available:
  - `ts = Date.now()`
  - write `__sync_ts__:<key>` to AsyncStorage
  - write `{ v, ts, deleted:false }` to iCloud for `setString`
  - write `{ v:null, ts, deleted:true }` to iCloud for `removeKey` (tombstone)

Internal keys (like `__sync_ts__:*` and the sync preference key) are never mirrored.

### Reconciliation (restore/merge) logic

Runs:
- On app launch (once the SyncManagerProvider mounts), if enabled.
- Optionally on foreground resume (AppState `active`), if enabled.

Inputs per key:
- Local value (string or null)
- Local timestamp \(tsLocal\) from `__sync_ts__:<key>` (default `0`)
- iCloud entry envelope (or legacy raw string)
- iCloud timestamp \(tsCloud\) (default `0`)

Winner selection:
- If one side has data and the other is missing:
  - **iCloud has data and local missing → iCloud wins** (restore).
  - **local has data and iCloud missing → local wins** (backup).
- Else, compare timestamps:
  - **Higher timestamp wins**.
  - If timestamps are equal or undeterminable → **conflict**.

Applying the winner:
- iCloud wins:
  - If iCloud entry is tombstone: remove local key.
  - Else: write iCloud `v` into AsyncStorage as-is.
  - Set local timestamp metadata to iCloud ts.
- local wins:
  - Push local value to iCloud with local ts (or `Date.now()` if local ts is missing/0 and local has data).

### Conflict resolution UX (single modal, apply to all)

If the reconciliation pass detects one or more conflicts:
- Present a simple modal describing the situation and the count of conflicting items.
- User chooses one action for that pass:
  - **Keep Local**: apply local values for all conflicts (push to iCloud).
  - **Keep iCloud**: apply iCloud values for all conflicts (restore to AsyncStorage).

This avoids noisy per-key prompts while still preventing silent data loss when timestamps cannot decide.

### Migration strategy (non-breaking)

Existing production users:
- No existing keys are modified or renamed.
- No value schemas change.
- Timestamps default to `0` when absent.

First enable behavior:
- Immediately run reconciliation.
- Effective result:
  - If iCloud already has data and local is empty: restore from iCloud.
  - If iCloud is empty and local has data: push local snapshot up.

Disabling sync:
- Stops mirroring and reconciliation.
- Does **not** delete iCloud data.

### Platform handling

- iOS:
  - Show the iCloud Sync toggle.
  - Use `ICloudKvsProvider` when enabled.
- Android:
  - Toggle is hidden entirely.
  - Sync subsystem uses `NoopSyncProvider` and performs no network/cloud work.

### Known limitations / risks

- **iCloud KVS limits**: the app’s data may exceed the 1MB/1024-key constraints depending on logs usage. In that case, the feature must be reworked to a file-based backup approach (still compatible with the `SyncProvider` abstraction).
- **Non-instant sync**: iCloud KVS sync timing is best-effort; cross-device updates may be delayed.
- **Entitlements / availability**: users can be signed out of iCloud or have iCloud Drive disabled. The UI should treat iCloud as unavailable and keep local-only behavior without disruption.
- **Deletion semantics**: tombstones are required to avoid resurrecting deleted values, but they also count toward storage usage.

