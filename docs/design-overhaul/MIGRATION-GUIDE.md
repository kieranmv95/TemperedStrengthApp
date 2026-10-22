# Migrating a screen to the "Forged" design

Use this guide when bringing any screen onto the new design. Program, Home, Workouts and Explore are finished examples; copy their patterns.

## Rules

- **Presentation only.** Don't change data loading, storage, navigation routes, analytics events or business logic. If a design change seems to need one, stop and report it.
- **Tokens only.** Import from `@/src/constants/tokens` (`color`, `typography`, `space`, `radius`, `elevation`, `motion`, `MIN_TARGET_SIZE`). No hex or rgba literals, and no raw font sizes. Size constants are fine as named consts (for example `const THUMB_SIZE = 72`). Drop `@/src/constants/theme` (`Colors`, `Spacing`, `FontSize`, `BorderRadius`) from files you migrate.
- **Shared components first** (`@/src/components/ds`):
  - `PressableCard` (whole card is the tap target; variants `default`, `hero`, `promo`);
  - `FilterChip` (toggleable, check when selected) and `ActionChip` (icon + label button);
  - `Tag` (read-only) and `Badge` (PRO, level, Completed);
  - `SectionHeader`, `Collapsible`, `ProgressBar` and `ProgressRing`;
  - `AnimatedNumber`, `Skeleton` and `LoadingImage`;
  - `NumberField`, `BottomSheet` and `StandardLayout`;
  - `useToast()` from `@/src/hooks/toast-context`.
  - Don't edit `src/components/ds/*`. If a shared component is missing something, report it.
- **Motion.** Every animation goes through `useMotion()` from `@/src/hooks/useMotion`, using `timing`, `spring`, `fade`, `pulse` or `bounce`. Don't use core `Animated`, LayoutAnimation or Reanimated layout animations directly. Shared values use `.get()` and `.set()`.
- **Type.**
  - Headings use `typography.title1`, `title2` or `headline`.
  - Body text uses `body` or `callout`; meta text uses `caption`.
  - Numbers use `numericLarge`, `numericMedium` or `numericSmall` (tabular).
  - Use sentence case everywhere. `overline` (uppercase) is only for small category labels. Remove `textTransform: 'uppercase'` and heavy letter-spacing elsewhere.
- **Colour.**
  - Surfaces: `bg` (screen), then `surface1` (cards), `surface2` (inputs and chips), `surface3` (pressed). Use elevation, not outlines.
  - Gold is only for primary actions, progress, the selected state and achievements; decorative gold borders go.
  - Text: `textPrimary`, `textSecondary` or `textTertiary` (meta and placeholders).
  - Inputs get a `borderStrong` border.
  - Status colours: `success`, `danger`, `warning` and `info`, with their tints.
- **Buttons.**
  - Primary: gold pill (`radius.pill`, `minHeight: MIN_TARGET_SIZE`, `color.gold` fill, `onGold` text, `goldStrong` when pressed).
  - Secondary: `borderStrong` outline pill.
  - Prefer `Pressable` with a `pressed` style over `TouchableOpacity` with `activeOpacity`.
- **Accessibility, every time:**
  - Every control has an `accessibilityRole` and a meaningful `accessibilityLabel`. Its state (`selected`, `expanded`, `disabled`, `checked`) goes in `accessibilityState`.
  - Targets are at least `MIN_TARGET_SIZE` (use `hitSlop` only for small icons).
  - Screen and section titles get `accessibilityRole="header"`.
  - A card reads as one element, with title and key facts in the label.
  - Decorative icons and images are hidden; images of text get a text label.
  - Inputs have labels.
  - State is never conveyed by colour alone: add an icon or text.
- **Layout.**
  - Allow text to scale. Avoid fixed heights on text containers and `numberOfLines` on essential text.
  - Use `useLargeText()` from `@/src/hooks/useLargeText` to stack side-by-side rows at large text sizes.
- **Loading.** Use `Skeleton` instead of `ActivityIndicator` for content placeholders. A spinner inside a button is fine.

## Checks before handing off

Run with Node 24 (`source ~/.nvm/nvm.sh && nvm use`):

- `npx prettier --write <files you changed>`
- `npx eslint <files you changed>` (no new errors; don't add `eslint-disable`)
- `npx tsc --noEmit`
- `npx jest --ci` (the only failures should be the known pre-existing `storageRaces`, `workoutLogsCodec` and `StandaloneWorkoutLogPanel` suites; update tests only where visible copy changed)
- `npm run check:contrast` (if you introduce a new text/background pair, add it to `src/__tests__/contrast.test.ts`)
