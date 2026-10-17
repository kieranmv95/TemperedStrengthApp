# Design overhaul changelog

## Discover search removed

- Explore no longer shows "Explore near you". The shop card is full width, and stays hidden when offline.
- Removed the discover and partner detail screens, the location permission, the listings client, and saved gym, club, and coach favorites.

## Phase 3: Every remaining screen

Every screen now uses `tokens.ts` and the shared ds components. `theme.ts` keeps only the Award icon artwork colours and the remote-notification CMS defaults. The rules screens followed are in `MIGRATION-GUIDE.md`.

- **Shared:**
  - `StandardLayout` always uses the new header; the `variant` prop is removed.
  - `Card`, `Pill`, `SmallChevron` and `CuratedSection` render with tokens, so every screen using them picks up the new look.
  - The iOS keyboard Done bar and sheet bottom padding use tokens.
  - Unused legacy `Spacing`, `BorderRadius`, `FontSize` and palette exports are removed.
- **Onboarding:** header step titles, radio option cards, FilterChip interests, the shared `ProgressBar`, and a `useMotion` step fade. The step now changes immediately and fades in; there's no fade-out first.
- **Program picker:**
  - FilterChip filters, and program cards that read as one element, with PRO, difficulty and "Recommended" badges.
  - Locked Pro programs show a lock icon, not a gold border.
  - The details, start-date and weekday sheets are restyled but stay as Modals, because they open one another.
  - Calendar days are 44pt and read their full date.
- **Program states and modals:**
  - Starting soon, Completed, Rest day, conditioning blocks, intensity levels, copy notes and training max are all restyled.
  - Move session and Swap are now `BottomSheet`s, so they also close by dragging or tapping the scrim.
- **Skills & Cues, articles, glossary and patch notes:**
  - Skeleton loading, with tips, cues and videos in a shared pager that announces its position ("Tip 1 of 2").
  - Videos open in a `BottomSheet`.
  - Article bookmarks are a separate 44pt button.
  - Glossary terms and patch-note versions use `Collapsible`.
- **Workout detail and recovery:**
  - Workout detail is on `StandardLayout`, with a stateful favourite button, and warm-ups use `Collapsible` (`CollapsibleWarmupSection` is deleted).
  - Recovery cards carry real labels.
  - Recovery flows show "Block X of Y" with a progress bar, and the timer sits in a `ProgressRing` and announces each step.
- **Check-in and tools:**
  - Check-in rows, the calendar, the log sheet (now a `BottomSheet`) and the supplement screens are restyled.
  - Calculators use `NumberField`, which accepts a comma as the decimal point ("80,5" is 80.5).
  - Calculators announce their result when you press Calculate.
- **You and account:**
  - Settings, records, awards, email, OTP and redeem-code screens are restyled.
  - Every switch has a label, and kg/lb is a radio-role control.
  - Awards show their status as text, not by fading alone.
- **Shop, partners and competition:**
  - The dark theme, with the CMS colour only as an accent edge and logos on a light panel.
  - The shop and Together We Lift sheets are `BottomSheet`s.
  - The Home competition card is fully tappable.
- **Partner colours:** the collab and sponsor cards on workout detail and the discipline tag list no longer use their CMS background and text colours. They use the brand colour only as an accent edge, following Home.
- **Copy:** sentence case throughout. Typo and punctuation fixes, plus "Visit website" and "Tap to learn more" defaults.
- **Lint:** errors fell from 75 before the overhaul to 58. The remaining errors are `set-state-in-effect` and similar issues in data-loading effects, and fixing them would change logic.
- **Not done:**
  - **Chained sheets.** The program picker sheets, copy notes and training max stay as restyled Modals. `BottomSheet` can't chain sheets, and it has no keyboard avoidance.
  - **Partner card link role.** `PressableCard` can't set an accessibility role, so partner collab cards announce as buttons rather than links.

## Phase 4: Large-text reflow

- **Added** `useLargeText()`: true at an OS font scale of 1.3 or more (`LARGE_TEXT_FONT_SCALE`), updating live.
- **At large text sizes:**
  - Set rows put weight on its own line, with reps and RPE on the next. Each field shows its own label, and the column headers are hidden.
  - The rest-timer controls wrap onto their own line.
  - Two-up tiles on Home and Explore become full-width row cards.
- **Unchanged:** the default text-size layouts.

## Phase 3: Home review changes

- **Removed** partner ad cards from Home, along with everything only they used:
  - `SponsorAdsCarousel`, `SponsorAdCard` and `useHomeSponsorAds`;
  - the Home carousel query, cache key and loader in `sanitySponsorAds`;
  - the `promoCode` field, the `logoPanel` token and the `expo-clipboard` dependency.
- **Kept** for the Shop, which still uses them: the Sanity sponsor ad service and the `home_sponsor_cta_pressed` event.
- **Hero button:** now reads "Go to today's session" on training days, and "Go to program" otherwise.
- **Check-in dots:** the outline turns gold with the fill.
- **Equal heights:** the two-up tiles on Home and Explore now match in height (new `PressableCard` `fill` option).

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
