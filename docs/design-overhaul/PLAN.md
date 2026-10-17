# Tempered Strength: "Forged" design overhaul plan

Status: **Phase 1 (tokens) complete. Waiting at the Phase 1 checkpoint for approval before Phase 2.** See `CHANGELOG.md`.

## Phase 1 findings

- **Barlow Condensed tabular figures are confirmed.** Both weights include the OpenType `tnum` feature, so the `numeric*` styles use it. This still needs an on-device visual check through the token preview.
- **Jest can't render Reanimated 4.7 components yet.** The Reanimated and Worklets mocks, and the Worklets Jest resolver, each hit another native-only code path. Phase 2 must add a working Jest setup before component tests (risk 8). Until then, the token preview has to be checked on a device or simulator.
- **Three test suites already fail on the base commit** (`workoutLogsCodec`, `storageRaces`, `StandaloneWorkoutLogPanel`). This work didn't cause them, but CI on pull requests will fail until they're fixed.
- **Deep links to non-tab routes don't navigate in Expo Go.** `exp://…/--/dev/tokens` reaches the app but stays on Home. This is probably the boot gate in `app/_layout.tsx`, and predates the overhaul. The preview is reachable from You → Settings → Dev settings.
- **The shell's default Node is 16.** Expo CLI needs the `.nvmrc` version (24). Run `nvm use` first.

## Decisions

| Topic                | Decision                                                                 | What it means for the work                                                                                                                                                                                                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Duplicate "Strength" | Keep Discipline "Strength"; relabel the Focus chip **"Strength focus"**  | Display label only, in the filters sheet and active-filters bar. The tag value and filtering are unchanged.                                                                                                                                                                                                                      |
| Legacy palette       | **Remap** `theme.ts` colours to the new palette                          | Out-of-scope screens shift palette. Legacy spacing, size and radius are unchanged. Those screens get a quick visual check.                                                                                                                                                                                                       |
| Old/new comparison   | **No flag.** Per-step commits and the EAS `preview` channel              | Each step is a small, revertible commit                                                                                                                                                                                                                                                                                          |
| Display face         | **Barlow Condensed** (SemiBold and Bold)                                 | `.ttf` files in `assets/fonts/`, loaded via the installed `expo-font` plugin. Used only for display, title1 and numerals. Tabular-figure support gets checked first, with system-font numerals as the fallback.                                                                                                                  |
| Promo-code chip      | **Approved:** `expo-clipboard` plus an optional Sanity `promoCode` field | The chip renders only when the ad has a `promoCode`; otherwise there's no chip. The Sanity schema change happens in the CMS repo.                                                                                                                                                                                                |
| §8 data additions    | **None.** Presentation only.                                             | No phase tag; show "Week N" only, which comes from the day index. No suggested working weight or plate breakdown; `additionalHeader` text shown as-is. No hero duration. Check-in dots come from the existing `loggedCount` / `totalCount` (N dots, `loggedCount` filled, capped with "+k"). No PR count in the session summary. |
| Sponsor carousel     | **Remove auto-advance** and add a scroll indicator                       | A page-dot indicator (current/total, announced as "Ad 1 of 3") plus a visible peek of the next card. No timers.                                                                                                                                                                                                                  |
| Branch               | **`release/3.2.1-test`** (branched from `release/3.2.1`)                 | Commits land here, following the existing message style                                                                                                                                                                                                                                                                          |

---

## 1. Summary

- The app is **Expo SDK 58, React Native 0.88, React 19.3 and TypeScript 6**, using Expo Router and plain `StyleSheet`.
- Every animation and haptics library the brief asks for is **already installed**: Reanimated 4.7.1, Worklets 0.13, Gesture Handler 3.3, `expo-haptics`, `react-native-svg` and `expo-image`. The only new package I propose is `expo-clipboard`, for the "copy promo code" chip. A display font is optional.
- A token system already exists (`src/constants/theme.ts`), and in-scope screens mostly use it. The gaps are literal `lineHeight`, `letterSpacing`, icon sizes and fixed heights, plus a few contrast failures in the current palette.
- **Nothing in the app respects Reduce Motion today.** Only two places animate: the Home "free tier" strip (core `Animated`) and set-row drag-to-reorder (Reanimated).
- Several brief items need **data that doesn't exist yet**: programme phase names, structured percentages for most programmes, session duration estimates, partner promo codes, and per-behaviour check-in status. These are listed in §8 with options, because they cross the "presentation only" guardrail.
- The blue gear button is the Expo Go / dev-client tools button. It doesn't appear anywhere in our source and isn't included in EAS production builds. **I have left it alone, as instructed.**

---

## 2. Stack

| Area          | What's in the repo                                                                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework     | Expo SDK 58 (`expo ~58.0.12`), React Native 0.88.0, React 19.3.0, New Architecture                                                                                                                |
| Language      | TypeScript ~6.0.3, strict                                                                                                                                                                         |
| Navigation    | `expo-router ~58.0.21` (file-based), React Navigation 7 bottom tabs, `react-native-screens 4.30`                                                                                                  |
| Styling       | `StyleSheet.create` at module scope, with tokens from `src/constants/theme.ts`. No Tamagui, NativeWind or styled-components. Large screens put styles in sibling `*Styles.ts` files.              |
| Animation     | `react-native-reanimated 4.7.1` + `react-native-worklets 0.13.0` (installed; used only for set-row drag). Core `Animated` is used in `app/(tabs)/index.tsx` and `src/screens/OnboardingFlow.tsx`. |
| Gestures      | `react-native-gesture-handler ~3.3.0` (`GestureHandlerRootView` already at the root)                                                                                                              |
| Haptics       | `expo-haptics ~58.0.6` (used only in `HapticTab`, iOS only)                                                                                                                                       |
| Graphics      | `react-native-svg 15.16` (used for award icons), `expo-image` (used for sponsor ads), `expo-symbols` (SF Symbols on iOS)                                                                          |
| Icons         | `@expo/vector-icons` (Ionicons and MaterialIcons) plus `IconSymbol` (SF Symbols on iOS, Material on Android)                                                                                      |
| Fonts         | System only. `expo-font` is installed but no custom fonts are loaded. `fontVariant: ['tabular-nums']` is already used in the timer bars and the recovery timer.                                   |
| State         | Local state plus a few React contexts (subscription, sync, exercise video, Together We Lift). AsyncStorage and SQLite for persistence.                                                            |
| Content       | Bundled programme/workout data in `src/data/`. Sanity CMS supplies sponsor ads, skills and app config; Supabase supplies sync.                                                                    |
| Tests         | Jest 29 with `jest-expo`, `@testing-library/react-native` 14. CI runs `npm test -- --ci` on pull requests (`.github/workflows/jest.yml`).                                                         |
| Lint/format   | ESLint 9 (`eslint-config-expo` + Prettier), Prettier 3 (single quotes, semicolons, es5 trailing commas)                                                                                           |
| Storybook     | None                                                                                                                                                                                              |
| Feature flags | No flag system. PostHog is installed, but `posthog-react-native` feature flags aren't used. There is one dev-only toggle pattern (`getDevProOverrideEnabled` in `src/utils/storage/settings.ts`). |

### Screen → file map (brief names → repo names)

| Brief                           | Route                           | Implementation                                                                                                   |
| ------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Home                            | `app/(tabs)/index.tsx`          | Inline in the route file, plus `src/components/home/*`                                                           |
| Program (session/logging)       | `app/(tabs)/program.tsx`        | `src/screens/WorkoutScreen.tsx` → `src/components/WorkoutScreenBody.tsx` → `ExerciseCard` / `ExerciseCardSetRow` |
| Workouts (list + Filters sheet) | `app/(tabs)/workouts/index.tsx` | Inline, plus `src/components/workouts/*`                                                                         |
| Explore                         | `app/(tabs)/hub.tsx`            | Inline, plus `src/components/hub/*`                                                                              |
| Tab bar                         | `app/(tabs)/_layout.tsx`        | React Navigation default tab bar, with `HapticTab` as the button                                                 |

Tab order is Program, Workouts, Home, Explore, You.

---

## 3. The blue gear button

- There are no references to a floating gear, dev menu or debug overlay anywhere in `app/` or `src/`.
- It is the Expo Go / `expo-dev-client` tools button. Neither is part of EAS `production` builds (`eas.json`), so it never ships.
- **I won't touch it.** For the accessibility pass and the before/after screenshots, I'll hide it from the dev menu or use a `preview` build, so it doesn't cover content or skew results against SC 2.4.11.

---

## 4. Proposed libraries

| Library                            | Status                       | Why                                                                                                                                            |
| ---------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `react-native-reanimated` 4.7.1    | **Already installed**        | All motion: press scale, layout reveal, tab indicator, progress fills, number roll, sheets. Runs on the UI thread.                             |
| `react-native-gesture-handler` 3.3 | **Already installed**        | Sheet drag-to-dismiss, date-strip swipe, long-press stepper repeat.                                                                            |
| `expo-haptics`                     | **Already installed**        | Press, selection, success and PR feedback, always alongside a visual change.                                                                   |
| `react-native-svg`                 | **Already installed**        | `ProgressRing`, check-draw stroke animation, hero card gradient top border, rest-timer ring. This avoids adding `expo-linear-gradient`.        |
| `expo-image`                       | **Already installed**        | Explore and discipline thumbnails with `placeholder`/`transition`, plus memory/disk caching. This fixes the grey Skills & Cues squares (§7.4). |
| `expo-clipboard`                   | **New, needs approval**      | "TS10 + copy" promo-code chip → "Code copied" toast. Expo-maintained, versioned with SDK 58. Without it, the copy chip has to be dropped.      |
| Display font (asset only)          | **Optional, needs approval** | See §5.2. It can ship as `.ttf` files loaded by the already-installed `expo-font` config plugin, so no new npm package is needed.              |

Libraries I'm deliberately **not** proposing:

- **`@gorhom/bottom-sheet`.** Its compatibility with Reanimated 4.7, Gesture Handler 3.3 and RN 0.88 is unproven. Focus handling also needs custom work either way. A ~200-line in-house `BottomSheet` built on Reanimated, Gesture Handler and `Modal` is lower risk.
- **Reanimated shared-element transitions.** They are still experimental and behind a feature flag in Reanimated 4. Workout card → detail will use a standard push, as the brief allows.
- **Lottie or a confetti library.** The one-off session-complete burst can be done with Reanimated and SVG.

---

## 5. Current token inventory (`src/constants/theme.ts`)

### 5.1 Colour (`Colors`)

| Token                                                                                           | Value                      | Notes                                                                                                               |
| ----------------------------------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `backgroundScreen`                                                                              | `#121212`                  | App background                                                                                                      |
| `backgroundCard`                                                                                | `#1E1E1E`                  | Default card                                                                                                        |
| `timerBarBackground`                                                                            | `#1A1A1A`                  | Session and rest timer strips                                                                                       |
| `backgroundElevated`                                                                            | `#2A2A2A`                  | Raised surfaces **and** default borders (one token, two roles)                                                      |
| `backgroundSubtle`                                                                              | `#333`                     | Muted fills and soft borders; also used as an empty-state icon colour                                               |
| `backgroundBorder`                                                                              | `#3A3A3A`                  | Borders                                                                                                             |
| `overlay` / `overlayMedium` / `overlayLight`                                                    | black at 0.8 / 0.65 / 0.45 | Scrims                                                                                                              |
| `textPrimary`                                                                                   | `#FFFFFF`                  |                                                                                                                     |
| `textSecondary`                                                                                 | `#CCCCCC`                  |                                                                                                                     |
| `textMuted`                                                                                     | `#888888`                  | 4.70:1 on card. Passes only just, and fails on `backgroundElevated`.                                                |
| `textPlaceholder`                                                                               | `#666666`                  | **2.90:1 on card. Fails.** Used for the set-row "0" and "—" placeholders, the unselected heart and the search icon. |
| `textOnAccent`                                                                                  | `#121212`                  | 8.86:1 on gold                                                                                                      |
| `textOnDark`                                                                                    | `#444444`                  | 1.71:1. Used for the disabled "−" stepper icon (disabled UI is exempt, but it's nearly invisible).                  |
| `accent` / `accentText`                                                                         | `#C9B072`                  | 7.89:1 on card                                                                                                      |
| `accentOverlay`, `accentWashFill` (0.12), `accentWashBorder` (0.25), `accentWashOutline` (0.45) | gold alphas                | Gold outlines appear on many cards at once                                                                          |
| `recommended` (+ wash fill/border)                                                              | `#1abc9c` teal             | "How to perform" pill and the session-completed state. This is the teal the brief wants replaced with `info`.       |
| `destructive` (+ wash fill/border)                                                              | `#FF6B6B`                  | Failed set, skipped session, filled heart                                                                           |
| `tabIconDefault`                                                                                | `#9BA1A6`                  | Cool grey that doesn't match the warm palette                                                                       |
| `remoteNotification*`                                                                           | Various                    | Defaults for the CMS banner                                                                                         |
| `award*`, `AwardIconPalettes`                                                                   | Various                    | Award SVG art. Out of scope.                                                                                        |

### 5.2 Typography

- `FontSize` has 16 steps: `xs 9, xxs 10, sm 11, md 12, base 13, lg 14, xl 15, xxl 16, xxxl 17, displaySm 18, displayMd 20, displayLg 22, displayXl 24, displayXXl 28, displayXXXl 32, hero 36`.
- There are no font weight, line height or letter-spacing tokens. Each style hand-picks them (`'600' | '700' | '800'`, `lineHeight: 17/19/20/22`, `letterSpacing: -0.5 … 1`).
- Body sizes are small. Most descriptions are 12–14pt and meta text is 11pt. The brief's scale has `body 17`, `callout 15` and `caption 13`.
- **No `maxFontSizeMultiplier` or `allowFontScaling={false}` anywhere**, so text already scales with the OS setting. The problem is fixed-height containers and `numberOfLines` (§9).
- `textTransform: 'uppercase'` appears in **30 files**. In scope: `workoutScreenStyles.ts` (7: intensity label, warm-up title, notes link, start button, completed title and stat labels), `exerciseCardStyles.ts` (4: "SETS", column headers, swap button, slot label), `workoutsListStyles.ts` (3), `ProgramSessionStatusControls.tsx` (2: "SESSION ACTIONS", status), `workoutFiltersSheetStyles.ts` (section labels, including **"DISCIPLINE"**, which is the label-case issue in the brief), `HubPromoRow.tsx`, `SkillsAndCuesCard.tsx`, `SessionSummaryModal.tsx`, `WorkoutSortControls.tsx`.

**Display face proposal (decision needed):**

1. **Barlow Condensed, SemiBold and Bold** (SIL OFL). A condensed athletic grotesk that suits "Forged". Used only for `display`, `title1` and the `numeric*` styles. It ships as two `.ttf` files in `assets/fonts/`, registered via the `expo-font` plugin in `app.json`, so there's no npm dependency. Before committing, I'll check that the font's tabular-figure feature (`tnum`) works through `fontVariant: ['tabular-nums']` on both platforms. If it doesn't, numerals stay on the system font.
2. **No display face.** Use system font heavy weights with `tabular-nums` for numbers. No risk, and nothing to load.

My recommendation is option 1 if you want a clear brand shift, and option 2 if you'd rather keep this overhaul to motion and hierarchy.

### 5.3 Spacing, radius, elevation

- `Spacing`: `xxs 3, xs 4, sm 6, md 8, lg 10, xl 12, xxl 16, xxxl 20, section 24, control 14, emptyState 48`. Values 3, 6, 10 and 14 are off the 4pt grid.
- `BorderRadius`: `xs 3, sm 4, md 6, lg 8, xl 10, xxl 12, xxxl 14, full 16, pill 20`. That's nine steps, and `pill` is 20, not fully rounded.
- Elevation has no tokens. Depth comes entirely from `borderWidth: 1` with `backgroundElevated` or a gold wash. The only shadow is on the award art.
- Motion has no tokens. The one duration in use is a hard-coded `320` in Home.

### 5.4 Proposed token approach

The brief suggests `theme/tokens.ts`. To match repo conventions I'll put it at **`src/constants/tokens.ts`**, next to `theme.ts`. It will export `color`, `type`, `space`, `radius`, `elevation` and `motion`, with the values from the brief and the contrast adjustments below.

How existing code relates (decision needed, §11 Q2):

- In-scope screens migrate to the new tokens directly.
- `theme.ts` stays for the ~100 out-of-scope files. I propose **re-pointing its colour values at the new palette**, for example `backgroundScreen → bg` and `backgroundCard → surface1`. That way the You tab, checkin, tools and so on shift to the warmer palette with no per-file edits, and don't look like a different app. Legacy `Spacing`, `FontSize` and `BorderRadius` stay unchanged, so out-of-scope layouts don't move.

---

## 6. Contrast pre-check (computed, WCAG 2.x)

Values from the brief, measured on the surfaces they'll actually sit on:

| Pair                                                      | Ratio       | Verdict                                                                                                     |
| --------------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| `textPrimary #F5F3EE` on any surface                      | 12.9–17.4   | Pass                                                                                                        |
| `textSecondary #B4B0A8` on any surface                    | 6.6–8.9     | Pass                                                                                                        |
| `textTertiary #8C8880` on `surface1` / `surface2`         | 5.07 / 4.65 | Pass                                                                                                        |
| `textTertiary #8C8880` on `surface3`                      | **4.04**    | **Fail.** I propose **`#9A958C`**: 5.52 on `surface2`, 4.79 on `surface3`.                                  |
| `gold #D4B97A` on any surface                             | 7.5–10.1    | Pass                                                                                                        |
| `gold` text on `goldTint` over `surface2` (selected chip) | 6.77        | Pass                                                                                                        |
| `onGold #1A1508` on `gold`                                | 9.54        | Pass                                                                                                        |
| `gold` fill vs `surface3` track                           | 7.49        | Pass (≥3:1 non-text)                                                                                        |
| `surface2` chip vs `surface1` card                        | 1.09        | Not a boundary. Fine for decoration, but **input borders and unselected filter chips need a visible edge.** |
| `borderSubtle` (6% white) vs `surface1`                   | 1.17        | Hairline only. Never used as the only boundary of a control.                                                |

New tokens I'll add so non-text UI passes 3:1:

- **`borderStrong` `#6E6A63`**: 3.33 on `surface1`, 3.05 on `surface2`. Used for input outlines, unselected stepper buttons and focus rings.
- **Semantic colours** (all checked on `surface2`): `success #4CC38A` (7.42), `warning #E8A33D` (7.62), `danger #FF7A70` (6.47) and `info #6CB4EE` (7.35). `info` replaces the teal. `success` is green instead of teal, so "completed" and "how to" are no longer the same colour.

Current failures that the migration fixes: `textPlaceholder #666` (2.90), the Home sponsor card's CMS colours (§7.1) and the disabled stepper icon (1.71).

The contrast check will be a **Jest test** (`src/__tests__/contrast.test.ts`) that reads `tokens.ts` and a declared list of foreground/background pairs, each tagged `text`, `largeText` or `nonText`. It fails below 4.5, 3 or 3 respectively. Because it's a Jest test, the existing `jest.yml` runs it in CI with no workflow change. I'll also add `npm run check:contrast` as a shortcut.

---

## 7. Component inventory per screen

### 7.1 Home (`app/(tabs)/index.tsx`, ~555 lines)

| Element                         | Implementation                                                                                                                                                                                                                                                                | Issues                                                                                                                                                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header                          | `StandardLayout` title `"Afternoon, {name}"` and subtitle `"Tempered Strength, Your training HQ."`                                                                                                                                                                            | Greeting is "Morning/Afternoon/Evening/Hey". The subtitle has a capital "Your" mid-sentence.                                                                                                                               |
| Account badge / free strip      | `planBadgePro`, `welcomeStrip` with core `Animated` fade (320ms, no Reduce Motion)                                                                                                                                                                                            | The PRO badge floats alone. Moves into the header in Phase 3.                                                                                                                                                              |
| CMS banner                      | Inline, with colours from Sanity                                                                                                                                                                                                                                              | Uncontrolled colours, so contrast isn't guaranteed                                                                                                                                                                         |
| `LiveCompetition`               | `src/components/LiveCompetition*.tsx`                                                                                                                                                                                                                                         | Not in the brief. Restyle only.                                                                                                                                                                                            |
| Programme card                  | `ds/Card` + `SmallChevron` + static progress track                                                                                                                                                                                                                            | Becomes the **Today hero**                                                                                                                                                                                                 |
| Check-in                        | `HomeCheckinCard` (`ds/Card` + `SmallChevron`)                                                                                                                                                                                                                                | Text-only status. Dots need data (§8).                                                                                                                                                                                     |
| Open workouts / Browse the shop | `HubPromoCard` (from `hub/HubPromoRow.tsx`): 1.5px gold outline, gold-bordered icon tile, uppercase eyebrow, chevron                                                                                                                                                          | The main "flat hierarchy" offender                                                                                                                                                                                         |
| Partner ads                     | `SponsorAdsCarousel` → `SponsorAdCard`. Colours, logo and layout come from **Sanity** (`bgColor`, `titleColor`, `descriptionColor`, `ctaColor`, `ctaTextColor`). Fixed `SPONSOR_CARD_HEIGHT = 176`. Description `numberOfLines={4}`. **Auto-advances every 6s indefinitely.** | Light-blue background and contrast failure come from CMS data. The fixed height causes the truncation. The auto-advance fails **SC 2.2.2** (no pause control) and ignores Reduce Motion. There's no promo-code field (§8). |
| Streak                          | `HomeStreakCard`                                                                                                                                                                                                                                                              | Not in the brief. Restyle only.                                                                                                                                                                                            |
| Latest PB                       | `ds/Card`, with tabular-ish values but no `tabular-nums`                                                                                                                                                                                                                      | Copy: "Your latest PB from your programs or on the you will show up here." is garbled.                                                                                                                                     |
| Loading                         | `ActivityIndicator`                                                                                                                                                                                                                                                           | Becomes `Skeleton`                                                                                                                                                                                                         |

### 7.2 Program (`WorkoutScreen` → `WorkoutScreenBody`)

| Element                         | File                                                                                                                | Issues                                                                                                                                                                                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date strip                      | `DaySelector.tsx`, `DaySelectorDayChip.tsx`, `daySelectorStyles.ts`, `daySelectorConstants.ts` (fixed `ITEM_WIDTH`) | No selected state for assistive tech; label only says "completed/skipped". "Jump to Today" pops in instantly. Selection and today use the same gold. No swipe between days.                                                                                           |
| Session timer / rest timer      | `SessionTimer.tsx`, `RestTimer.tsx`, `workoutTimerBarStyles.ts`, plus `src/timer/*`                                 | A rest timer **already exists** as a bar. The ring is a restyle; logic is unchanged.                                                                                                                                                                                  |
| Title                           | `workoutScreenStyles.title`                                                                                         | Large and wraps to two lines                                                                                                                                                                                                                                          |
| Training maxes                  | `TrainingMaxesCard.tsx`                                                                                             | Restyle only                                                                                                                                                                                                                                                          |
| Session actions                 | `ProgramSessionStatusControls.tsx`, built on `CollapsibleWarmupSection`                                             | "SESSION ACTIONS" in uppercase gold. A SHOW/HIDE chip nested in a touchable header. The header is **disabled once expanded**. No expanded state for assistive tech. Not remembered.                                                                                   |
| Intensity card                  | Inline in `WorkoutScreenBody`                                                                                       | Static bar fill; uppercase label                                                                                                                                                                                                                                      |
| Warm-up                         | `CollapsibleWarmupSection`                                                                                          | Same issues as Session actions                                                                                                                                                                                                                                        |
| Exercise card                   | `ExerciseCard.tsx`, `exerciseCardStyles.ts`                                                                         | Up to three meta pills: teal "How to perform" (`ExerciseVideoPlayButton`), gold `additionalHeader` (e.g. "Full Snatch - 5×2 @ 80%") and grey PB / rep range. Uppercase "SETS". The set-count stepper has no labels. The rest-timer icon button has no label.          |
| Set row                         | `ExerciseCardSetRow.tsx`                                                                                            | `placeholder="0"` (weight, reps) and `"—"` (RPE) in `#666`. **No accessibility label on inputs, the check button or the drag handle role.** The check is a static icon swap with no haptic and no announcement. Drag handle is "≡" (Reanimated pan after long-press). |
| PB detection                    | `useExerciseCardState` → `PBDetectedModal`                                                                          | **PR detection already exists.** The "PR badge pop" can hook into `pbPrompt` without new logic.                                                                                                                                                                       |
| Notes                           | Inline, with "▼/▶" text glyphs                                                                                      | Text glyphs as icons; no expanded state                                                                                                                                                                                                                               |
| Session complete                | `SessionSummaryModal.tsx` (core `Modal`, fade)                                                                      | Duration, volume and sets only. **No PR count** (§8).                                                                                                                                                                                                                 |
| Rest day / completed / starting | `RestDayScreen`, `ProgramCompletedScreen`, `ProgramStartingInXScreen`                                               | Not in the brief. Out of scope unless you want them included.                                                                                                                                                                                                         |

### 7.3 Workouts (`app/(tabs)/workouts/index.tsx`)

| Element              | File                                                                                                                                      | Issues                                                                                                                                                                                                                                                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header actions       | `StandardLayout` `filterBarOnly` → Glossary + `WorkoutFiltersBarButton` + `WorkoutSortBarButton`                                          | Already one wrapping row. The badge count is static. **`StandardLayout` is shared by about 20 screens**, so header changes must be opt-in.                                                                                                                                                                                       |
| Sort panel           | `WorkoutSortPanel` (`Pill`s)                                                                                                              | Uppercase labels                                                                                                                                                                                                                                                                                                                 |
| Active filters       | `WorkoutActiveFiltersBar.tsx`                                                                                                             | Restyle only                                                                                                                                                                                                                                                                                                                     |
| Mobility & flows     | `ds/Card` + `SmallChevron`                                                                                                                | Becomes a featured `PressableCard`                                                                                                                                                                                                                                                                                               |
| Disciplines carousel | Inline `ScrollView` + `TouchableOpacity` + `ImageBackground` (bundled images)                                                             | No snapping. **No accessibility label.** Logo tiles have `showTitle: false`, so assistive tech reads nothing.                                                                                                                                                                                                                    |
| Section copy         | `CuratedSection`                                                                                                                          | "get started with what you already know" (lowercase). "All our workouts, over {n}+ workouts." The count **is already bound to `allStandaloneWorkouts.length`**; only the wording is wrong.                                                                                                                                       |
| Workout card         | `WorkoutCard.tsx` (`ds/Card`), `workoutsListStyles.ts`, `workoutUiConstants.ts`                                                           | Accessibility label is a generic "Open workout". The heart has **no label or state**, and its hit area is about 40pt. `DIFFICULTY_COLORS` are all `accent`, giving a gold-outlined "Advanced" tag.                                                                                                                               |
| List                 | `FlatList` (virtualised)                                                                                                                  | Keep it virtualised. No layout animations on rows.                                                                                                                                                                                                                                                                               |
| Filters sheet        | `WorkoutFiltersSheet.tsx` (`Modal` `pageSheet`), `workoutFiltersSheetStyles.ts`                                                           | Selected state is colour-only (`accentWashFill` + gold text). `Pill` has **no role or selected state**. Pill height is about 34pt (below 44). The clear-search button has no label. Reset is never disabled. "Show {n}" is computed synchronously with `useMemo` over bundled data, so there's no network call to debounce (§9). |
| Duplicate "Strength" | Discipline uses `CategoryFilter` `'Strength'` (a workout **category**). Focus uses `WORKOUT_FOCUS_TAGS` `'Strength'` (a workout **tag**). | These are genuinely different filters with the same label. Decision in §11 Q1.                                                                                                                                                                                                                                                   |

### 7.4 Explore (`app/(tabs)/hub.tsx`)

| Element                 | File                                                                      | Issues                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skills & Cues           | `hub/SkillsAndCuesCard.tsx`                                               | Thumbnails are **bundled JPGs (~230KB each)** in RN `Image` on a `backgroundElevated` square. The "empty grey squares" are first-render decode of oversized images, not missing assets. Fix: `expo-image` with a placeholder/transition plus resized thumbnails. Copy is 3 sentences and includes "This sections for you". |
| Shop / Explore near you | `hub/HubPromoRow.tsx` (stacked column)                                    | Becomes a two-up bento grid                                                                                                                                                                                                                                                                                                |
| Tools                   | Horizontal `ScrollView` of `Pill variant="card"` from `src/data/tools.ts` | No "See all", no peek affordance, no role/label beyond text                                                                                                                                                                                                                                                                |
| Glossary card           | `ds/Card`                                                                 | Restyle only                                                                                                                                                                                                                                                                                                               |
| Together We Lift banner | `hub/TogetherWeLiftBanner.tsx`                                            | Restyle only                                                                                                                                                                                                                                                                                                               |
| Articles                | `CuratedSection` + `Pill` filters + `ArticleCard` in a `FlatList`         | Not in the brief, but it's on this screen. It gets the new `Chip` and `SectionHeader`; `ArticleCard` gets a light token pass only.                                                                                                                                                                                         |
| Loading                 | `ActivityIndicator`                                                       | Becomes `Skeleton`                                                                                                                                                                                                                                                                                                         |

### 7.5 Tab bar (`app/(tabs)/_layout.tsx`)

- Default React Navigation tab bar with `HapticTab` (iOS-only light impact on press-in).
- Active state is a gold icon with a white label; inactive is the cool grey `#9BA1A6`.
- There's no indicator. Icon sizes are mixed (28, with 24 for "You").
- Plan: a custom `tabBar` renderer (`src/components/ds/TabBar.tsx`) passed to `<Tabs tabBar={…}>`. Routes and screens are unchanged.

### 7.6 Shared primitives (`src/components/ds/`)

| Component                                                   | Today                                                                         | In the overhaul                                                                         |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `Card`                                                      | `TouchableOpacity`, 1px border, row layout, 0.7 opacity press                 | `PressableCard` replaces it on in-scope screens. `Card` stays for out-of-scope screens. |
| `Pill`                                                      | Two variants (`filter`, `card`), colour-only active state, no a11y role/state | `Chip` (filter / tag / badge / action) on in-scope screens                              |
| `SmallChevron`                                              | 32×32 gold-wash "button" (decorative, `pointerEvents="none"`)                 | Becomes an inline 16pt chevron inside `PressableCard`                                   |
| `CuratedSection`                                            | Icon + 24pt title + muted description; `icon as any`                          | `SectionHeader`                                                                         |
| `StandardLayout`                                            | Header (32pt/800 title), filter bar, scroll body; used app-wide               | Gets opt-in props only (§9)                                                             |
| `HapticTab`                                                 | iOS-only haptic                                                               | Folded into `TabBar`                                                                    |
| `AppSafeAreaView`, `IconSymbol`, `IosKeyboardDoneAccessory` | Infrastructure                                                                | Unchanged                                                                               |
| `CollapsibleWarmupSection` (in `src/components/`)           | SHOW/HIDE chip                                                                | Replaced by `ds/Collapsible`                                                            |

---

## 8. Data gaps and conflicts with the "presentation only" guardrail

Each item below needs data or logic that doesn't exist yet. I'll do none of them without a decision.

| Brief asks for                                                         | What exists                                                                                                                                                                                              | Options                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Week 4 · Intensification" tag                                         | Phase names exist **only as code comments** (e.g. `olympic_advanced_8wk.ts`)                                                                                                                             | (a) Add an optional `phases: { fromWeek, toWeek, name }[]` field to `Program` and fill it in per programme. (b) Show "Week 4" only, which is derivable from the day index.                                                                            |
| Single meta line "5×2 @ 80% · 2RM 138kg" and calculated working weight | Structured percentages exist only where `setScheme` (`percentOfTrainingMax`) is used, e.g. 5/3/1 with `requireRmId`. Olympic programmes put "Full Snatch - 5×2 @ 80%" in a free-text `additionalHeader`. | (a) Suggest weights **only for `setScheme` exercises**, using existing training-max maths. Show `additionalHeader` text as-is elsewhere. (b) Add structured percentages to the other programmes (data work). I don't recommend parsing the free text. |
| Plate breakdown                                                        | Nothing                                                                                                                                                                                                  | Optional. It's new logic (bar weight, plate inventory, kg/lb). I suggest deferring it.                                                                                                                                                                |
| Hero "estimated duration" and "key lifts as chips"                     | No duration field. Key lifts can be derived from the session's exercise list.                                                                                                                            | Show key lifts and omit duration, or add `estimatedMinutes` per workout.                                                                                                                                                                              |
| Check-in "four dots"                                                   | `HomeCheckinSummary` has only `loggedCount` / `totalCount`. Users can track **any number** of behaviours, not exactly four.                                                                              | Extend `loadHomeCheckinSummary` to return per-behaviour `{ id, label, done }` (a read-only presentation helper). Show up to N dots with a "+k" overflow.                                                                                              |
| Promo-code chip "TS10"                                                 | Sanity `sponsorAd` has no code field; codes are inside `description` text                                                                                                                                | Add an optional `promoCode` field to the Sanity schema and GROQ query (a CMS change), plus `expo-clipboard`. Until then, no chip.                                                                                                                     |
| Partner card in dark theme                                             | Sanity controls `bgColor` / text colours per ad                                                                                                                                                          | On Home, **ignore CMS background and text colours**. Render on `surface1` with tokens, and use the CMS colour only as a narrow accent edge. The Shop list (out of scope) keeps CMS colours.                                                           |
| Session summary "PRs" count                                            | `SessionSummaryModal` gets duration, volume and sets only                                                                                                                                                | Count PRs that `PBDetectedModal` confirmed during the session (needs a small counter in `useWorkoutScreenController`), or omit PRs from the summary.                                                                                                  |
| Undo via toast                                                         | Toggling a set again already reverts it                                                                                                                                                                  | The undo button calls the existing `handleToggleSetState`. No new logic.                                                                                                                                                                              |
| "Debounce the count query"                                             | The count is a synchronous in-memory filter, not a query                                                                                                                                                 | No debounce needed; I'll animate the digits only. Noting it so it isn't read as skipped.                                                                                                                                                              |
| Remember collapsible state per session                                 | Not persisted                                                                                                                                                                                            | Keep it in memory, keyed by `dayIndex` and section, for the app session. Persisting to AsyncStorage would be a new storage key. Tell me if you want that.                                                                                             |

---

## 9. Risks

1. **Very new versions.** RN 0.88, React 19.3, Reanimated 4.7, Gesture Handler 3.3 and TypeScript 6 are newer than many third-party UI libraries support. That's why the plan uses only what's installed and builds the sheet in-house.
2. **No runtime theme switching.** Styles are created at module load (`StyleSheet.create` reading `Colors`), before AsyncStorage can be read. A runtime old/new toggle would mean refactoring every style file into hooks, which the core rules forbid. Realistic options are in §11 Q3.
3. **Reduce Motion is read once.** Reanimated's `useReducedMotion()` is read synchronously and doesn't update if the setting changes mid-session. `useMotion()` will combine `AccessibilityInfo.isReduceMotionEnabled()` with the `reduceMotionChanged` listener, and also pass `ReduceMotion.System` into Reanimated animation configs.
4. **Large text versus fixed sizes.** `SPONSOR_CARD_HEIGHT 176`, input `height: 48`, search `height: 44/48`, `DaySelector` fixed `ITEM_WIDTH`, `numberOfLines` on the sponsor title (1), description (4) and workout description (1). The set row's four columns can't fit at the largest accessibility sizes, so it will stack weight/reps over RPE/check above a font-scale threshold (via `useWindowDimensions().fontScale`).
5. **`StandardLayout` is shared by about 20 screens.** Header changes for Home, Workouts and Explore will be opt-in props, so out-of-scope screens don't change.
6. **Remapping legacy colours** (if approved) slightly changes out-of-scope screens. That's intended, but those screens need a quick visual check.
7. **The Program screen is a non-virtualised `ScrollView`** with every exercise card mounted. That's existing behaviour and I'll keep it. Set-row animations will be transform/opacity only, with no height animation inside the list. The completion "dim" is opacity. Collapsible height reveal is fine because it's outside the set list.
8. **Jest has no Reanimated or haptics mocks** in `jest.setup.ts`. New component tests will need Reanimated's test setup and an `expo-haptics` mock. This is test-only config.
9. **Auto-advancing sponsor carousel** (SC 2.2.2). The fix is to stop auto-advancing under Reduce Motion and add a visible pause/play control, or remove auto-advance altogether (my recommendation, since it also makes ads less distracting).
10. **Android haptics** are currently iOS-only in `HapticTab`. `expo-haptics` works on Android, but intensity varies by device, which is fine since haptics are supplementary.
11. **Git and conventions.** The current branch is `release/3.2.1`. `AGENTS.md` lists a `commits` rule, but `.cursor/rules/commits.mdc` doesn't exist. I'll follow the existing log style ("Add …", "Refactor …").

---

## 10. Files expected to change, per phase

### Phase 1: Tokens and motion (checkpoint)

New:

- `src/constants/tokens.ts`: colour, type scale, spacing, radius, elevation and motion tokens.
- `src/hooks/useMotion.ts`: Reduce Motion aware timing, spring and fade helpers. Every animation goes through this.
- `src/__tests__/contrast.test.ts`: WCAG pair checks (runs in existing CI).
- `app/dev/tokens.tsx` (thin route) and `src/screens/dev/TokenPreviewScreen.tsx`: the dev-only token preview. It redirects away when `!__DEV__`.
- `assets/fonts/*.ttf`: only if a display face is approved.

Modified:

- `src/constants/theme.ts`: re-point legacy colours at the new palette (if approved). Legacy spacing, size and radius stay.
- `app/_layout.tsx`: register the `dev/tokens` screen.
- `package.json`: `check:contrast` script.
- `app.json`: `expo-font` plugin entry, only if a font is approved.

### Phase 2: Core components (built in the preview route first)

New, in `src/components/ds/`:

- `PressableCard.tsx`, `Chip.tsx`, `SectionHeader.tsx`, `Collapsible.tsx`
- `ProgressBar.tsx`, `ProgressRing.tsx`, `NumberField.tsx` (with stepper), `BottomSheet.tsx`
- `TabBar.tsx`, `Skeleton.tsx`, `AnimatedNumber.tsx` (rolling digits, used by chips, the "Show n" button and the summary), `Toast.tsx` and `src/hooks/toast-context.tsx`

Modified:

- `src/components/ds/index.ts`: exports.
- `src/components/ExerciseCardSetRow.tsx`: becomes the `SetRow` design. It stays where it is, since it's Program-specific.

Tests: `*.test.tsx` beside each new component, querying by role, label and state.

### Phase 3: Screens (Program → Home → Workouts → Explore, one commit each)

**Program**

- `src/screens/WorkoutScreen.tsx`, `src/screens/workoutScreenStyles.ts`
- `src/components/WorkoutScreenBody.tsx`
- `src/components/DaySelector.tsx`, `DaySelectorDayChip.tsx`, `daySelectorStyles.ts`, `daySelectorConstants.ts`
- `src/components/ExerciseCard.tsx`, `ExerciseCardSetRow.tsx`, `exerciseCardStyles.ts`
- `src/components/ProgramSessionStatusControls.tsx`; `CollapsibleWarmupSection.tsx` (replaced by `Collapsible`, then deleted once unused)
- `src/components/exercise/ExerciseVideoPlayButton.tsx`, `exerciseVideoStyles.ts`
- `src/components/RestTimer.tsx`, `SessionTimer.tsx`, `workoutTimerBarStyles.ts`
- `src/components/SessionSummaryModal.tsx`, `PBDetectedModal.tsx` (visual only)
- `src/components/TrainingMaxesCard.tsx` (token pass)
- Only if §8 is approved: `src/types/program.ts`, `src/data/programs/*.ts` (phases), `src/hooks/useWorkoutScreenController.ts` (PR counter)

**Home**

- `app/(tabs)/index.tsx`, `src/components/home/homeScreenStyles.ts`
- `HomeCheckinCard.tsx`, `HomeStreakCard.tsx`, `SponsorAdCard.tsx`, `SponsorAdsCarousel.tsx`
- `src/components/hub/HubPromoRow.tsx` (shared `HubPromoCard`)
- New: `src/components/home/HomeTodayCard.tsx`
- Only if §8 is approved: `src/utils/homeCheckinSummary.ts`, `src/services/sanitySponsorAds.ts` (`promoCode`)

**Workouts**

- `app/(tabs)/workouts/index.tsx`
- `src/components/workouts/WorkoutCard.tsx`, `workoutsListStyles.ts`, `workoutUiConstants.ts`
- `WorkoutFiltersSheet.tsx`, `workoutFiltersSheetStyles.ts`, `WorkoutSortControls.tsx`, `WorkoutActiveFiltersBar.tsx`
- `workoutsScreenConstants.ts` (display label for the "Strength" decision only)
- `src/components/ds/StandardLayout.tsx` (opt-in header props only)

**Explore**

- `app/(tabs)/hub.tsx`
- `src/components/hub/SkillsAndCuesCard.tsx`, `HubPromoRow.tsx`, `TogetherWeLiftBanner.tsx` (token pass)
- `assets/images/skills/thumbnails/*.jpg` (resized copies)

**Tab bar**

- `app/(tabs)/_layout.tsx`; `src/components/ds/HapticTab.tsx` (removed once `TabBar` replaces it)

### Phase 4: Accessibility and docs

- `docs/design-overhaul/A11Y-CHECKLIST.md`
- `docs/design-overhaul/CHANGELOG.md`
- `docs/design-overhaul/screens/` (before/after screenshots)
- Screen-level RNTL tests for Program set logging, the Filters sheet and the Home hero
- `jest.setup.ts`: Reanimated test setup and `expo-haptics` mock

---

## 11. Decisions needed before Phase 1

_All answered. See "Decisions" at the top of this document._

1. **Duplicate "Strength".** Discipline "Strength" is a workout _category_; Focus "Strength" is a workout _tag_. Options: (a) keep Discipline as "Strength" and relabel the Focus chip "Strength focus" (display only); (b) relabel the Discipline chip "Strength training"; (c) remove "Strength" from the Focus list (a filtering behaviour change).
2. **Legacy palette remap.** Re-point `theme.ts` colours at the new palette so out-of-scope screens shift with the rest, or leave them untouched.
3. **Old/new comparison.** A runtime toggle isn't feasible (§9 risk 2). Options: (a) no flag; compare via per-step commits on a `feat/design-overhaul` branch and an EAS `preview` channel; (b) a build-time `EXPO_PUBLIC_FORGED_THEME` env flag that swaps only the colour palette.
4. **Display face.** Barlow Condensed (asset only, no npm dependency) or system font only.
5. **`expo-clipboard`** for the promo-code chip, plus a Sanity `promoCode` field. Approve both, or drop the copy chip.
6. **§8 data items.** Programme phases, `setScheme`-only weight suggestions, per-behaviour check-in summary, PR count in the session summary.
7. **Sponsor carousel auto-advance.** Remove it (recommended) or add a pause control.
8. **Branch.** Work on a new `feat/design-overhaul` branch from `release/3.2.1` (recommended) or elsewhere.
