# Tempered Strength

A local-first strength training app for running programs and standalone
workouts, tracking progress, and reading practical training content.

Built with Expo, React Native, TypeScript, Expo Router, and RevenueCat.

## Get started

Requires Node 24 (see `.nvmrc`) and npm.

```bash
nvm use
npm install
npm start
```

Use `npm run ios` or `npm run android` to launch a simulator, and
`npm run start-clean` if the Expo cache needs clearing.

## Useful commands

```bash
npm test
npm run lint
npm run format:check
```

Production builds use `npm run build:ios:production` and
`npm run build:android:production`.

## Project layout

- `app/` — Expo Router routes
- `src/screens/` — screen implementations
- `src/components/` — shared UI
- `src/data/` — bundled programs, workouts, exercises, and Brief content
- `src/hooks/`, `src/services/`, `src/sync/` — app logic and integrations
- `src/utils/` — storage, program, and formatting helpers

App data is persisted with AsyncStorage, with optional iCloud sync. Pro
subscriptions are managed through RevenueCat.

Store builds require production RevenueCat keys in EAS:

- `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS`
- `EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID`

In-app purchases and timer notifications require a development or store build,
not Expo Go.

Contributor guidance lives in [AGENTS.md](AGENTS.md) and `.cursor/rules/`.
