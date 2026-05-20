# EAS Update — Expo web dashboard setup

One-time checklist for **expo.dev** after CLI setup (`expo-updates`, `app.json` `updates` / `runtimeVersion`, `eas.json` channels). Day-to-day publishing is in [OTA.md](./OTA.md).

---

## 1. Sign in and open the project

1. Go to [https://expo.dev](https://expo.dev) and sign in.
2. Open your account (personal or org).
3. Select project **`tempered-strength-app`**.
4. Confirm **Project ID** matches `app.json` → `extra.eas.projectId`:

   `753c3e7a-158d-41ec-b35c-772015ccbaa9`

---

## 2. Project overview

On the project home page, verify:

| Field | Expected |
|-------|----------|
| Slug | `tempered-strength-app` |
| iOS bundle ID | `com.kieranvenison.temperedstrengthapp` |

No OTA-specific action here — sanity check only.

---

## 3. Builds (EAS Build)

1. Sidebar → **Builds** (or **Deploy** → **Builds**).
2. Confirm you have at least one **production** iOS build **after** OTA was enabled in the repo.
3. When inspecting a build, confirm it used profile **`production`** and channel **`production`** (shown on the build detail when `channel` is set in `eas.json`).

**Important:** OTAs only apply to binaries built **with** `expo-updates` and the correct channel. Old 2.5.0 builds without OTA will ignore updates.

---

## 4. Updates (EAS Update)

1. Sidebar → **Updates**.
2. After your first `eas update` command, you should see:
   - **Update groups** with messages and timestamps
   - **Runtime version** (e.g. `2.5.1` when using `appVersion` policy)
   - **Channel** (`production` or `preview`)

### Channels and branches

Expo maps:

- **Channel** `production` → used by production builds
- **Channel** `preview` → used by preview/internal builds

You normally **do not** need to manually create channels in the UI if you use:

- `channel` in `eas.json` build profiles, and
- `eas update --channel <name>`

If the dashboard offers **Branches**, they link to channels automatically when you publish via CLI.

---

## 5. Environment variables (if you use them)

1. Sidebar → **Project settings** → **Environment variables** (or **Secrets** / **Env** depending on UI version).
2. Ensure **`EXPO_PUBLIC_REVENUECAT_API_KEY_IOS`** (and any other `EXPO_PUBLIC_*` vars) exist for:
   - **production**
   - **preview** (if you ship preview OTAs)

OTA bundles can embed public env values available at **publish** time. If a hotfix needs a **new** public env var, add it here before running `eas update`.

---

## 6. Usage and billing

1. Account menu → **Billing** ([expo.dev/settings/billing](https://expo.dev/settings/billing)).
2. Under **Usage**, watch:
   - **EAS Update — Monthly active users (MAUs)**
   - **EAS Update — Global edge bandwidth**
3. **Starter** includes ~3,000 MAUs and 100 GiB bandwidth per month ([pricing](https://expo.dev/pricing)).

Expo emails **Owners/Admins** at 80% and 100% of included usage.

---

## 7. Credentials (iOS)

1. Project → **Credentials** (or **Project settings** → **Credentials**).
2. Confirm iOS distribution credentials exist (same as for EAS Build).

**OTA does not use separate credentials** — only EAS Build/submit do.

---

## 8. Post-setup verification

1. Install a **production** build that includes OTA (v2.5.1+).
2. From your machine:

```bash
eas login
npm run update:production -- --message "OTA dashboard smoke test"
```

3. In **Updates** on expo.dev, confirm the new group appears with:
   - Channel: `production`
   - Runtime: `2.5.1` (or current `app.json` version)
4. On the device: force-quit → reopen (twice if needed) and confirm a visible JS change if you made one.

---

## 9. App Store Connect (not in Expo UI)

For the **first OTA-enabled** store submission:

- **What’s New:** User-facing features (e.g. 2.5.1 changes). You do not need to mention “OTA” unless you want to.
- **App Review Notes (optional):**

  > This build may receive JavaScript-only updates via Expo EAS Update for bug fixes and bundled content. Updates do not install native code or change permissions.

Avoid publishing a large **production** OTA while a new binary is **In Review** unless the change is trivial.

---

## 10. Canceling Starter / downgrading

- Cancellation takes effect at **end of billing period**, then account is **Free**.
- **Updates remain available** on Free within Free MAU/bandwidth limits.
- Installed apps **keep working**; you only lose ability to serve new OTAs beyond limits or if the project is removed.

Details: [OTA.md — Billing and cancellation](./OTA.md#billing-and-cancellation).

---

## Quick links

| Task | Where |
|------|--------|
| See published OTAs | Project → **Updates** |
| See store binaries | Project → **Builds** |
| MAU / bandwidth | **Billing** → Usage |
| Env vars for updates | Project → **Environment variables** |

---

## CLI reference (not in dashboard)

```bash
npx expo install expo-updates   # SDK 54: ~29.0.17
npm run build:ios:production    # channel: production
npm run update:production -- --message "Your message"
```

See [OTA.md](./OTA.md) for full workflow.
