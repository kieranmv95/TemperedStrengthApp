# Design overhaul changelog

## Phase 3: Home, Workouts, Explore

- **Home:**
  - "Good afternoon, {first name}" with today's date, and the account badge beside the name.
  - A hero Today card: session or Rest day, a rolling sessions-left count, animated progress, and "Start session" or "View week".
  - Check-in shows a dot per behaviour with a supplement indicator and a text summary.
  - Open workouts and the shop sit in a two-up bento.
  - Partner ads use the dark theme: a CMS colour accent edge, a "Partner" label, the logo on a contained light panel, two-line copy and a gold CTA.
  - An optional copyable promo code (Sanity `promoCode`) shows a "Code copied" toast.
  - The ad carousel has no auto-advance, peeks the next card and has announced page dots.
  - Cards fade up once on first load, and skeletons show while loading.
- **Workouts:**
  - One header row of chips; Filters shows a rolling, popping count badge.
  - Removable active-filter chips.
  - Discipline tiles have accessible names, skeletons and snap scrolling.
  - Workout cards read as one element; the favourite heart is separately reachable, pops and announces the change.
  - The filters sheet is a `BottomSheet` with FilterChips and counts, "Strength focus", Reset disabled until something is selected, and "Show N" with debounced announcements.
  - "168+ workouts" is bound to the data.
- **Explore:**
  - Skills & Cues is the hero, with thumbnails behind skeletons (new `LoadingImage`).
  - Shop and Discover are a two-up bento.
  - Tools are a peeking row with "See all".
  - Articles use FilterChips with counts and skeletons.
- **Shared:**
  - `StandardLayout variant="forged"` and `titleAccessory` are opt-in, and other screens are unchanged.
  - `useMotion` delays, and `EnterOnMount`.
  - The `logoPanel` token.
- **Not done:**
  - **Home key-lift chips, session duration and a rest-day recovery suggestion.** No data for them (presentation only).
  - **Scaling the centred discipline tile.**
  - **A shared-element transition from workout card to detail.** It stays a standard push.
  - **After screenshots.** These need a manual pass.

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
  - Every set stays on one inline row, with no steppers (a large weight range made stepping tedious). The next set to log has a gold number.
  - A "Set logged" toast offers Undo.
  - A new PR gives a heavy haptic alongside the existing PB dialog. The per-set "PR" badge was removed after review.
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
