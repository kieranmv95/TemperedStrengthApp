# Design overhaul changelog

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
