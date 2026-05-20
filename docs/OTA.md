# EAS Update (OTA) — Tempered Strength

Over-the-air updates ship **JavaScript and assets only** to release builds that include `expo-updates`. Native code and App Store releases are unchanged by this workflow.

**Project:** `tempered-strength-app`  
**EAS project ID:** `753c3e7a-158d-41ec-b35c-772015ccbaa9`  
**Runtime version:** matches `version` in `app.json` (`appVersion` policy)

---

## Prerequisites

- Logged in: `eas login`
- **Node 20+** for Expo CLI (`nvm use 20` if needed)
- A **production** (or **preview**) build created **after** OTA was enabled, with the matching `channel` in `eas.json`
- `app.json` `version` matches the runtime you intend to target (e.g. `2.5.1`)

Users on older store builds **without** `expo-updates` will never receive OTA until they install an OTA-enabled build.

---

## Publish an update (production)

1. Commit your JS/asset changes on the branch you want to ship.
2. Confirm `app.json` → `version` is the runtime users are on (e.g. `2.5.1`).
3. Run:

```bash
npm run update:production -- --message "Short description of the change"
```

Or:

```bash
eas update --channel production --message "Short description of the change"
```

4. On a device with the matching build: **force-quit and reopen** the app (often twice: once to download, once to apply).

---

## Preview channel (TestFlight / internal)

For builds made with the `preview` profile (`channel: preview`):

```bash
npm run update:preview -- --message "QA: describe change"
```

Only **preview-channel** binaries receive these updates.

---

## What you can ship via OTA

| OK | Not via OTA (needs `eas build` + store) |
|----|----------------------------------------|
| UI, screens, hooks | New/changed native modules |
| `src/data/*` (e.g. `workouts.json`) | `app.json` plugins, permissions, entitlements |
| JS bug fixes | Expo SDK upgrade |
| Images/fonts referenced from JS | New native dependency |

---

## How users get updates

1. On launch (online), the app checks EAS Update in the **background**.
2. A matching update downloads for **channel** + **runtime version**.
3. The update applies on the **next cold start** (not mid-workout).

**Offline:** The app runs the bundle already on the device. No network is required for normal use after install or after an update has been applied.

---

## Runtime version

`runtimeVersion` uses the **`appVersion`** policy: it equals `expo.version` in `app.json`.

- OTA published while the repo is at `2.5.1` only goes to binaries built for runtime `2.5.1`.
- When you ship **2.6.0** to the store, bump `version` in `app.json`, build, submit, then publish OTAs for the new runtime.

---

## Formal App Store release (after several OTAs)

1. Merge all OTA’d changes in git (your repo should already reflect them).
2. Bump `version` in `app.json` and `package.json` (e.g. `2.5.1` → `2.6.0`).
3. Add an entry in `app/patch-notes.tsx` and App Store **What’s New**.
4. Build and submit:

```bash
npm run build:ios:production
eas submit --platform ios --profile production
```

Store users get the latest JS **embedded** in the IPA. You usually **do not** need an OTA immediately after a store release unless you fix something before the next binary.

---

## Best practices

- **Native change → store build.** **JS/data/UI only → OTA.**
- Test on **preview** channel + internal build before **production** OTA.
- Avoid large production OTAs during **App Review** for a new binary unless trivial.
- Keep git `main` aligned with what you published.
- Large `workouts.json` changes increase bundle size; still fine within Starter limits for typical usage.
- Document meaningful OTA fixes in **patch notes** on the next **store** version if users should know.

---

## Troubleshooting

| Symptom | Check |
|---------|--------|
| Update never appears | Wrong `channel`; wrong `version`/runtime; old binary without `expo-updates`; try two cold starts |
| Wrong users get update | `production` vs `preview` channel mismatch |
| Crash after OTA | Incompatible native change shipped as OTA — needs store build |

- Expo dashboard → **Updates** for publish history and runtime.
- [EAS Update debugging](https://docs.expo.dev/eas-update/debug)

---

## Billing and cancellation

- **Cancel Starter:** Account moves to **Free** at period end. OTA still works within Free limits (**1,000 MAUs**/month, 100 GiB bandwidth).
- **Installed apps keep working** with the last bundle on device; Expo does not remotely disable the app.
- **Stop publishing OTAs:** Simply don’t run `eas update`; no need to remove `expo-updates` from the binary.

See [Expo pricing](https://expo.dev/pricing) and [billing FAQ](https://docs.expo.dev/billing/faq/).

---

## Starter plan limits (reference)

| Included | Starter |
|----------|---------|
| Update publishes | Unlimited |
| MAUs | 3,000 / month, then usage-based |
| Edge bandwidth | 100 GiB / month, then $0.10/GiB |

---

## Related docs

- [OTA_Setup.md](./OTA_Setup.md) — Expo web dashboard checklist
- [EAS Update docs](https://docs.expo.dev/eas-update/introduction)
