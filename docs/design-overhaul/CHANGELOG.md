# Design overhaul changelog

## Phase 3: Program screen

- **Tab bar:** the new `TabBar` replaces the default bar and `HapticTab` across the app.
- **Timer bars:**
  - Tabular Barlow numerals, 44pt buttons and a gold "Finish" pill.
  - The rest timer shows a depleting ring.
  - It announces "Rest timer started, N seconds" (only for a fresh start) and "Rest complete".
- **Date strip:**
  - A gold-tint pill slides to the selected day, and today reads "Today".
  - Completed, skipped and scheduled days show a check, cross or dot, and each is spoken in full.
  - "Jump to today" fades in only when you're away from today.
- **Session body:**
  - A `title1` heading with a "Week N" tag.
  - Session actions and warm-ups are `Collapsible`s that remember their state per day.
  - The intensity bar has a spoken value.
  - Notes become a `Collapsible` with a bordered input.
  - Content crossfades when the day changes.
- **Exercise card:**
  - One meta line, a blue "How to perform" chip, and clamped coaching notes.
  - Labelled set-count, rest and reorder buttons.
- **Set logging:**
  - `NumberField` and `SetCheckButton` rows with real labels, and no fake "0".
  - The next set to log expands with steppers.
  - A "Set logged" toast offers Undo.
  - A new PR pops a "PR" badge with a heavy haptic.
  - Drag handles appear only in reorder mode.
- **Session complete:** a bottom sheet whose numbers count up, with one gold burst (none under Reduce Motion).
- **PB dialog and training maxes:** restyled with header semantics and labelled buttons.
- **Logic change:** `useExerciseCardState.handleClearSetState` was added for Undo.
  - The existing toggle reads set state from its render closure, so an undo created before logging would have logged the set again.
  - The new handler reuses the existing "not logged" save.
- **Not done:**
  - **Swiping between days on the session content.** It would conflict with set-reorder drags and the number inputs; the date strip still scrolls.
  - **Auto-scrolling the next set into view.**
  - **Before and after screenshots.** These need a manual pass, because deep links don't navigate in Expo Go and automation has no accessibility access.

## Phase 2: Core components

All components are in `src/components/ds/`, have tests, and can be tried in the dev-only preview at `/dev/components` (You → Settings → Dev settings).

- **`PressableCard`:** the whole card is the tap target.
  - Press feedback is a scale to 0.98 plus a one-tone surface step, with a light haptic.
  - Variants: `default`, `hero` (gold gradient top edge) and `promo` (partner accent edge).
  - It reads as one button with a combined label.
- **Chip family:**
  - `FilterChip` shows selection with a check icon and a gold edge, as well as the fill, and announces "selected".
  - `ActionChip` (icon plus label), `Tag` (read-only) and `Badge` (filled).
  - Chips look 36pt tall and reach 44pt/48dp through `hitSlop`.
- **`SectionHeader`:** a sentence-case header with an optional action.
- **`Collapsible`:**
  - The header row is the button and announces its expanded state.
  - A rotating chevron and an animated height reveal.
  - Content mounts on first expand and is hidden from screen readers while collapsed.
- **`ProgressBar` and `ProgressRing`:** animate from their previous value and speak a value such as "6 of 16 sessions complete".
- **`AnimatedNumber`:** digits roll using transforms only, and it's read as one value.
- **`Skeleton`:** a gentle pulse, static under Reduce Motion, and hidden unless labelled as the busy element.
- **`NumberField`:**
  - Tabular numerals, a numeric keypad, and −/+ steppers that repeat on long-press with a haptic tick.
  - A unit or suggested placeholder instead of a fake "0".
  - Accessible names include set context, and errors are shown in text.
- **`SetCheckButton`:**
  - A checkbox that fills gold and draws its check on completion.
  - A success haptic only on the change to completed.
  - Failed sets are described in text.
- **`BottomSheet`:**
  - Springs up (crossfades under Reduce Motion).
  - Dismisses by dragging the header, the scrim, the close button, Android back or the iOS escape gesture.
  - Moves focus to the title on open and back to the trigger on close, with a pinned footer.
- **`Toast` and `ToastProvider`** (mounted at the root):
  - One toast at a time, announced to screen readers, including its action.
  - The duration follows the OS accessibility timeout setting.
- **`TabBar` and `TabBarView`:**
  - A sliding gold-tint indicator, an icon bounce on selection, always-visible labels and a selection haptic.
  - Not wired into the app until Phase 3.
- **`useMotion()`** gains `pulse` (skeletons only) and `bounce` (tab icons).
- **Tokens:**
  - `MIN_TARGET_SIZE` is now 44 on iOS and 48 on Android.
  - New `infoTintStrong` and `motion.skeletonCycle` tokens.
- **Testing:**
  - The Reanimated mock, Gesture Handler's Jest setup, an `expo-haptics` mock and loaded icon fonts.
  - Expo Router's `standard-navigation` package is now transformed.

## Phase 1: Tokens

- **Added** `src/constants/tokens.ts` with the "Forged" colour, typography, spacing (4pt grid), radius, elevation and motion tokens.
  - `textTertiary` is `#9A958C` rather than the brief's `#8C8880`, which was 4.04:1 on `surface3`.
  - **New tokens:** `borderStrong` (input outlines and focus rings at 3:1 or better), `textDisabled`, `goldTintStrong`, and the semantic `success` / `warning` / `danger` / `info` colours with tints.
- **Added** `useMotion()` (`src/hooks/useMotion.ts`), which every animation goes through.
  - Under Reduce Motion, movement is instant and fades are capped at 150ms.
  - It reads the launch-time value synchronously and updates live while the app is open.
- **Added** a WCAG contrast check (`src/__tests__/contrast.test.ts`, plus `src/utils/contrast.ts` and its unit test). It runs in CI via Jest and locally with `npm run check:contrast`.
- **Changed** legacy `Colors` in `theme.ts` to reference the new tokens, so every screen shares one palette.
  - The placeholder grey goes from `#666` (2.9:1) to `textTertiary`.
  - Teal `recommended` becomes green `success`.
  - Gold becomes `#D4B97A`.
  - Splash, Android navigation bar and the rest-timer Live Activity colours follow.
- **Added** Barlow Condensed SemiBold and Bold for display, title and numeric styles. They're embedded via the `expo-font` plugin and loaded at boot for Expo Go.
- **Added** `expo-clipboard` for the partner promo-code chip in Phase 3. Dev-client builds need a rebuild.
- **Added** a dev-only token preview at `/dev/tokens`, reachable from You → Settings → Dev settings.
