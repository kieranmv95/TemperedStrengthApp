# Gym Timers & Clocks — Feature Plan (Tempered Strength)

16 Nov 2026 · @Kieran  
_Refined against the live app: programs, standalone workouts, Tempered Daily, existing rest/session/recovery timers, Explore Tools, and Free/Pro patterns._

---

## Overview

Add gym-style clocks and interval timers to Tempered Strength, on Free and Pro.

One timer **engine** powers every mode. It opens as a full-screen overlay from anywhere, can minimise to a floating blob, and keeps running while the user navigates (reading the WOD, logging, switching tabs).

This is **not** a greenfield clock bolted on from outside. The app already has:

| Existing                                                                           | Role                                           | Relationship to gym clock                                                                      |
| ---------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Rest timer** (`RestTimer`, `RestTimerState`, Live Activity, finish notification) | Between-set countdown on program strength (v1) | Keep as the strength UX; rest mode of the gym clock can share engine later or stay specialised |
| **Session timer** (`SessionTimer` / `ActiveSession`)                               | Workout elapsed time                           | Unrelated — leave alone                                                                        |
| **Recovery block timer** (`RecoveryBlockTimer` + step list)                        | Multi-segment countdown for recovery doses     | Pattern to reuse for segment compilation; do not merge products                                |
| **Conditioning meta** (`ConditioningWorkoutBody.formatBlockMeta`)                  | Shows AMRAP/EMOM/Tabata numbers                | Display only today → add **Start timer**                                                       |

**Goals**

- Any user can set up and run common gym timers manually (Explore → Tools).
- Pro users get one-tap launch from timed content, plus saved presets synced via account backup.
- Look and behave like a wall-mounted gym clock: huge digits, readable across the room, clear beeps/haptics.

---

## Free vs Pro

Both tiers get every timer type. Pro adds **speed** (contextual quick-start from content) and **memory** (saved presets).

| Capability                                                               | Free                                    | Pro  |
| ------------------------------------------------------------------------ | --------------------------------------- | ---- |
| Set up any timer type manually (Tools hub)                               | Yes                                     | Yes  |
| Overlay, minimise, floating blob                                         | Yes                                     | Yes  |
| Quick-start pre-configured timer from workouts / blocks / Tempered Daily | No (show button + Pro badge → paywall)  | Yes  |
| Save custom presets (unlimited)                                          | No                                      | Yes  |
| Between-set rest on program strength                                     | Already shipped (settings: Auto Timers) | Same |

**Upsell:** show contextual “Start timer” everywhere it would work, with a Pro badge that opens `/paywall`. That matches existing lock patterns (`Badge label="PRO"`, Tempered Daily upsell, locked workout CTAs).

Tools today (`src/data/tools.ts`) are free utilities; Timers join that list, with Pro features gated inside.

---

## Timer types

Align names with content we already ship (`WORKOUT_FORMATS`, program v2 `WorkoutBlock` types), not a generic gym-clock product sheet.

| Type                 | What it does                                          | Key settings                                     | Maps from app content                                                  | Status                         |
| -------------------- | ----------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------ |
| **Countdown**        | Counts down to zero                                   | `durationSec`                                    | Rest, caps, recovery-style single block                                | In scope                       |
| **Count up**         | Stopwatch until stopped                               | Optional `capSec`                                | For Time (no structured cap today), duration logs                      | In scope                       |
| **Rounds**           | Fixed work blocks; rest optional                      | `rounds`, `workSec`, `restSec`                   | Program v2 `type: 'rounds'` (+ `restSecondsBetweenRounds`)             | In scope                       |
| **Tabata**           | Work/rest intervals                                   | `rounds`, `workSec`, `restSec`, optional sets    | Program v2 `tabata`; standalone/TD `format: 'Tabata'`                  | In scope                       |
| **EMOM**             | Beep each interval start                              | `rounds` / `minutes`, `intervalSec` (default 60) | Program v2 `emom` (`minutes`); standalone/TD `format: 'EMOM'`          | In scope (core, not optional)  |
| **AMRAP**            | Countdown + tap-to-count rounds                       | `durationSec`                                    | Program v2 `amrap`; `logSchema.kind: 'amrap'` + `timeCapMinutes`       | In scope (core)                |
| **For Time**         | Count up; optional cap; round counter; stop when done | `capSec?`                                        | Program v2 `for_time` (no cap field yet); `format: 'For Time'`         | In scope (core)                |
| **Rest**             | One-tap short countdown                               | Presets 60/90/120 + custom                       | Complements existing program rest timer; Tools + quick rest            | In scope                       |
| **Intervals**        | Named/repeated work–rest sequence                     | Segment list or work/rest × rounds               | `format: 'Intervals'` (~31 workouts); multi-AMRAP / multi-Tabata prose | Phase 2 / as content is tagged |
| **Custom intervals** | Arbitrary segment list                                | Segment list, repeats                            | Partner WODs, E2MOM, “3×4 min AMRAP + 2 min rest”                      | Later                          |

**Later nice-to-haves:** lap/split on Count up; plain time-of-day clock; unify program rest timer UI onto the gym-clock engine while keeping Auto Timers / Live Activity behaviour.

**Content reality (why EMOM/AMRAP/For Time are not “recommended extras”)**

Approximate inventory today:

- Standalone + Tempered Daily `format`: For Time ~56, Intervals ~31, Chipper ~30, AMRAP ~27, EMOM ~14, Ladder ~7, Tabata ~5
- Program v2 blocks: `rounds` ~73, `amrap` ~23, `for_time` ~22, `emom` ~13, `tabata` ~9 (HIIT, bootcamp, pilates, etc.)
- Program v1 strength: `restTimeSeconds` — already covered by the shipped rest timer

---

## Configuration

Discriminated union, schema-versioned, so any screen can launch a timer and Pro presets serialize as-is. Prefer field names that match program v2 where possible.

```ts
type GymTimerConfig = {
  v: 1;
  name?: string; // Pro presets, e.g. "Week 3 Tabata"
  leadInSec?: number; // default 10; allow 0 | 5 | 10
  source?: {
    // optional audit / analytics breadcrumb
    kind: 'program_v2' | 'standalone' | 'tempered_daily' | 'manual' | 'preset';
    workoutId?: string;
    blockId?: string;
  };
} & (
  | { type: 'COUNTDOWN'; config: { durationSec: number } }
  | { type: 'COUNTUP'; config: { capSec?: number } }
  | {
      type: 'ROUNDS';
      config: { rounds: number; workSec: number; restSec: number };
    }
  | {
      type: 'TABATA';
      config: {
        rounds: number;
        workSec: number;
        restSec: number;
        sets?: number;
        restBetweenSetsSec?: number;
      };
    }
  | { type: 'EMOM'; config: { rounds: number; intervalSec: number } }
  | { type: 'AMRAP'; config: { durationSec: number } }
  | { type: 'FOR_TIME'; config: { capSec?: number } }
  | {
      type: 'INTERVALS';
      config: {
        segments: {
          phase: 'WORK' | 'REST';
          durationSec: number;
          label?: string;
        }[];
        repeats?: number;
      };
    }
);
```

**Example** (program v2 Tabata → launch payload):

```json
{
  "v": 1,
  "type": "TABATA",
  "config": { "rounds": 8, "workSec": 20, "restSec": 10 },
  "source": { "kind": "program_v2", "blockId": "wod" }
}
```

**Engine tip:** compile every type into a flat segment list  
`{ phase: 'LEAD_IN' | 'WORK' | 'REST', durationSec, round?, label? }`  
before running. Same idea as `getRecoveryTimerSteps` in recovery. New types = new compilers, not new clock logic. Timed rounds with no rest = `ROUNDS` with `restSec: 0`.

**Mappers from existing structured data (high confidence)**

| Source                    | → GymTimerConfig                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| v2 `tabata`               | `TABATA` from `rounds` / `workSeconds` / `restSeconds`                                   |
| v2 `emom`                 | `EMOM` with `rounds: minutes`, `intervalSec: 60` (extend later for E2MOM etc.)           |
| v2 `amrap`                | `AMRAP` with `durationSec: minutes * 60`                                                 |
| v2 `rounds`               | `ROUNDS` with `workSec` TBD if missing — see audit; rest from `restSecondsBetweenRounds` |
| v2 `for_time`             | `FOR_TIME` with `capSec` only once content gains a cap (today: open count-up)            |
| `logSchema.kind: 'amrap'` | `AMRAP` from `timeCapMinutes`                                                            |
| v1 `restTimeSeconds`      | Prefer **existing** rest timer; optional “Open in gym clock” later                       |

---

## Content audit & wiring into workouts / programs / dailies

This is the hard part the external plan under-specified. Timing is **not** uniformly structured across the catalogue.

### Encoding today

| Layer                                          | Structured timing?                | What we have                                                                                                                 |
| ---------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Program v2** (`WorkoutBlock`)                | Yes                               | `minutes`, `workSeconds`, `restSeconds`, `rounds`, `restSecondsBetweenRounds`                                                |
| **Program v1**                                 | Rest only                         | `restTimeSeconds` per exercise; Auto Timers already                                                                          |
| **Standalone** (`src/data/workouts/*`)         | Weak                              | `format` + prose in `name` / `instructions` / `highlightInstructions` / dividers; AMRAP score via `logSchema.timeCapMinutes` |
| **Tempered Daily** (`temperedDaily_weekNN.ts`) | Weak (same `SingleWorkout` shape) | Same as standalone; often multi-piece WODs in prose (“Three 4 min AMRAPs, rest 2 mins”)                                      |

**Do not ship “Start timer” that guesses wrong from free text.** Prefer an explicit optional field on content.

### Proposed content field (forward)

Add optional structured config alongside existing browse metadata (keep `format` for filters/cards):

```ts
// On StandaloneWorkoutSource / SingleWorkout (and optionally TD-only overrides)
timerConfig?: GymTimerConfig; // or a slim content-facing variant without source/name

// Optionally enrich program v2:
// WorkoutBlockForTime & { timeCapSeconds?: number }
// WorkoutBlockEmom & { intervalSec?: number } // for E2MOM / E3MOM
```

Multi-phase WODs (3×AMRAP, 4×Tabata + rest between) use `INTERVALS` / custom segments, not a single format tag.

### Audit process (recommended)

1. **Auto-derive program v2**  
   Script walk of `src/data/programs/**` → candidate configs per block. Highest confidence. Wire **Start timer** on `ConditioningWorkoutBody` first.

2. **Heuristic pass on standalone + Tempered Daily**

   - Inputs: `format`, `logSchema`, block `name`, `highlightInstructions`, divider notes
   - Patterns: `AMRAP (\d+)`, `(\d+)\s*min`, `EMOM`, `(\d+)s (?:work|on)\s*/\s*(\d+)s`, time caps
   - Output: CSV/JSON of `{ id, confidence, proposedConfig, excerpt }`
   - Flag **needs review**: partner, E2MOM, multi-interval, chipper-only, ladder, “rest as needed”

3. **Human confirm → commit `timerConfig`**  
   Same authoring style as weekly TD files. No silent production of wrong clocks.

4. **MVP without full catalogue tagged**

   - Ship engine + Tools hub + all manual types
   - Contextual quick-start only where structured: **all program v2 timed blocks** + standalone/TD with `logSchema.kind: 'amrap'` (and any already-tagged `timerConfig`)
   - Expand deep-links as audit completes

5. **Acceptance for “wired into content”**
   - Every program v2 `amrap` | `emom` | `tabata` | `rounds` block has Start timer
   - ≥ N% of standalone/TD with `format` in AMRAP | EMOM | Tabata | For Time | Intervals have confirmed `timerConfig` (set N in implementation, e.g. 80% before calling the feature “fully rolled out”)
   - Chipper / Ladder: Start timer optional (usually For Time / Count up) — don’t force

### Where contextual Start timer appears

| Surface                   | Screen / component                                                   | Behaviour                                                                           |
| ------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Program conditioning (v2) | `ConditioningWorkoutBody` block cards                                | Primary — structured fields already shown as meta                                   |
| Standalone workout detail | `WorkoutDetailScrollContent` / detail screen near format / WOD block | When `timerConfig` or high-confidence `logSchema` exists                            |
| Tempered Daily day        | Same detail path as standalone                                       | Same; respect Pro lock on TD itself                                                 |
| Program strength (v1)     | `ExerciseCard`                                                       | **Keep existing rest timer**; do not replace with gym overlay in v1 of this feature |
| After logging a set       | Already triggers Auto Rest Timers                                    | Not the main hook for metcons (standalone logs are post-session)                    |

Standalone / TD logging is **post-session** (`StandaloneWorkoutLogPanel`) — there is no mid-set rest prompt. Contextual timer is **before/during** the WOD, not after score entry.

---

## Core mechanics

Shared lifecycle: **Ready → Lead-in → Running (work/rest) → Done**, with pause/reset throughout.

| State   | UI                              | Actions                                        |
| ------- | ------------------------------- | ---------------------------------------------- |
| Ready   | Digits at start; config summary | Start, edit (manual), close                    |
| Lead-in | Amber 10→0; beeps 3-2-1         | Pause, reset                                   |
| Running | Main time, phase, round         | Pause, reset, minimise; AMRAP/For Time: +round |
| Paused  | Digits flash; colon steady      | Resume, reset                                  |
| Done    | Final time / rounds; long beep  | Restart, close                                 |

- **Lead-in:** default 10s; setting 0 / 5 / 10 (app settings, next to Auto Timers if natural).
- **Accuracy:** timestamps (`startedAt` + accumulated pause), never tick counting — same idea as `RestTimerState.startedAt`.
- **Recovery:** persist running config + timestamps so reload/crash restores (device-local, like `REST_TIMER_KEY`).
- **Reset:** confirm “Reset timer?” → Ready.
- **One active gym timer:** starting another asks “Replace current timer?”. Decide explicitly whether starting a gym timer dismisses an in-progress **program rest timer** (recommend: yes, with confirm, to avoid dual audio/surfaces).
- **History:** finished gym timers are **not** written to workout logs / PBs (same as original decision). Session timer and standalone score logging stay separate.

---

## Display and feedback

Readable across the room; audible over gym music where the OS allows.

- Dominating time digits; phase by **colour + text** (WORK / REST / GET READY).
- Round `R 3/8`; mode label UP / DN / Tb / EM / AR etc.
- Beeps: 3-2-1 before phase changes; distinct work vs rest start; long finish. Mute toggle; haptics via existing `expo-haptics`.
- **Keep awake:** activate `expo-keep-awake` while running (incl. minimised); release on Done/close and after paused timeout. (Dependency already transitive; app code does not use it yet.)
- **Background:** recompute on `AppState` → active from stored timestamps (JS timers pause in background).
- **Audio vs silent switch:** respect iOS silent switch; no play-in-silent-mode. Haptics still fire.
- **Notifications:** rest timer already uses `scheduleTimerFinishedNotification` + Live Activity. Gym clock: prefer in-app beeps while foregrounded/minimised; optional finish notification when backgrounded is a **product decision** — original plan said no local-notification fallback for mid-interval beeps (keep that); a single “timer finished” notification when backgrounded is consistent with rest timer and likely worth allowing.

---

## Overlay and minimise

Must sit **above navigation** so users can minimise mid-WOD and still read programming.

- View states: closed | open (full-screen) | minimised (floating blob).
- Blob: remaining/elapsed time, phase tint; tap to reopen; draggable, edge-snap; avoid tab bar / primary CTAs.
- Pause from blob (long-press or small control).
- Keep running when minimised (phases, beeps, wake lock).

### State architecture (match the app — do **not** introduce Zustand)

Project rule: no Redux/Zustand. Patterns in use:

- React Context at root (`SubscriptionProvider`, `ToastProvider`, …)
- AsyncStorage domain modules under `src/utils/storage/`
- `SYNCED_KEYS` vs `DEVICE_ONLY_WORKOUT_KEYS` in `src/sync/syncedKeys.ts`

**Recommendation**

- `GymTimerProvider` (Context) mounted in `app/_layout.tsx` beside `ToastProvider`
- Persist **running** state device-only (mirror `REST_TIMER_KEY`)
- Persist **Pro presets** under a new key added to `SYNCED_KEYS` (account backup via existing sync — not a separate “Supabase KV product”; same pattern as favorites/settings)
- Overlay + blob rendered once at root; screens only call `startGymTimer(config)` / `openHub()`

Reuse lessons from rest timer surface / Live Activity only if we explicitly extend them to gym modes; v1 can be in-app overlay only.

---

## Platform notes (Expo / RN)

| Requirement               | Approach                                                       |
| ------------------------- | -------------------------------------------------------------- |
| Screen on                 | `expo-keep-awake` while running                                |
| Beeps                     | `expo-audio` (or current Expo audio API) with preloaded shorts |
| Silent switch             | Respect; haptics backup                                        |
| Background accuracy       | Recompute from timestamps on foreground                        |
| Finish while backgrounded | Optional: reuse `localNotifications` pattern from rest timer   |
| Haptics                   | `expo-haptics` (already used widely)                           |
| Landscape                 | Unlock orientation only while overlay open                     |
| Font                      | Bundle seven-segment (e.g. DSEG7) via `expo-font`              |
| Global UI                 | Root layout overlay, not a new tab                             |

---

## Where to access it

Confirm against real IA: tabs are Program · Workouts · Home · **Explore (hub)** · You. Tools live under Explore (`HubToolsSection` + `TOOLS` in `src/data/tools.ts`).

1. **Contextual “Start timer”** (primary for Pro; visible to Free with badge)

   - Program v2 blocks, standalone/TD detail when config exists

2. **Timers hub** (all users) — Explore → Tools → Timers

   - Manual setup for every type; Pro presets list; deep link `/tools/timers`
   - Register like other tools in root stack

3. **Global shortcut** (tertiary)

   - Optional header action or Home section tile — not a new bottom tab
   - Long-press home tab only if we already use that pattern elsewhere (we don’t — prefer Tools + contextual)

4. **Rest**

   - Program strength: keep Auto Timers + `RestTimer`
   - Tools: Rest 60/90/120 quick starts for everyone
   - Do **not** invent a second “after log set” prompt on standalone WODs

5. **Later:** home-screen quick actions (“Rest 90s”, “Start Tabata”)

---

## Visual design: gym clock look

Overlay deliberately breaks app theme (separate `gymClock` palette, ignore light/dark tokens for the panel).

- Full-bleed black panel; optional glass sheen
- Seven-segment digits with ghost-8 unlit segments + soft glow
- ~80% width; `MM:SS` → `H:MM:SS` past 99:59; colon blinks when running
- Mode label blue; lead-in amber; work green; rest red; plain countdown/up default red
- Landscape: hardware row `[MODE] [TIME]` + status icons
- Portrait: mode/round top, huge time, phase word below
- Controls auto-hide after ~3s; large hit targets

---

## Phased delivery

| Phase  | Ship                                                                                                              | Content                           |
| ------ | ----------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **P0** | Engine + overlay/blob + Tools hub manual types (Countdown, Count up, Rounds, Tabata, EMOM, AMRAP, For Time, Rest) | None required                     |
| **P1** | Contextual Start on program v2 conditioning blocks; Free badge → paywall; Pro presets + sync key                  | Auto-map v2                       |
| **P2** | Standalone + Tempered Daily `timerConfig` + Start on detail; audit heuristic + human pass                         | Tag high-traffic / TD weeks first |
| **P3** | Intervals / multi-segment; optional rest-timer engine unification; Live Activity for gym modes; device shortcuts  | Remaining catalogue               |

---

## Open questions

### Decided (aligned with app)

- Timed rounds = `ROUNDS` with zero rest when applicable
- iOS + Android via Expo
- Beeps respect silent switch
- Lead-in default 10s, configurable
- Finished gym timers not logged to workout history
- Pro presets unlimited; sync via existing AsyncStorage + `SYNCED_KEYS` account backup (not a new store)
- Free gets full overlay / minimise
- No mid-interval beep via local notifications when backgrounded

### Still open / refine in build

- [ ] Confirm hub entry: **Explore → Tools → Timers** (recommended) vs You
- [ ] Global header shortcut in v1 or defer
- [ ] Replace/dismiss behaviour when gym timer starts while program **rest timer** (or Live Activity) is active
- [ ] Finish notification when gym timer completes in background — yes/no
- [ ] Whether program v2 `for_time` / `emom` gain optional `timeCapSeconds` / `intervalSec` in types during P1
- [ ] Confidence threshold before showing Free/Pro Start on heuristically tagged standalone (recommend: only after human-confirmed `timerConfig`)
- [ ] Unify vs parallel: keep `RestTimer` UI for strength indefinitely, or migrate to gym-clock countdown with same Auto Timers settings later

---

## Implementation touchpoints (cheat sheet)

| Concern                          | Likely home                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| Types                            | `src/types/gymTimer.ts` (new)                                                           |
| Compile + tick engine            | `src/utils/gymTimer/` (new)                                                             |
| Context + persist                | `src/hooks/gym-timer-context.tsx`, `src/utils/storage/gymTimer.ts`, keys + `syncedKeys` |
| Overlay / blob UI                | `src/components/gymTimer/`                                                              |
| Tools hub                        | `src/data/tools.ts` + `app/tools/timers.tsx` + screen under `src/screens/tools/`        |
| Program v2 CTA                   | `ConditioningWorkoutBody.tsx`                                                           |
| Standalone / TD CTA              | `WorkoutDetailScrollContent.tsx` / detail screen                                        |
| Paywall                          | existing `/paywall` + `Badge`                                                           |
| Settings (lead-in, mute default) | account/program or general settings near Auto Timers                                    |
| Audit script                     | `scripts/` or one-off under `src/data/` tests — generate candidates, do not auto-commit |

---

## Summary

Ship a single segment-based gym clock as a root overlay, exposed first via **Explore → Tools**, then wire **Start timer** from **program v2** (structured) and progressively from **standalone / Tempered Daily** via an explicit `timerConfig` after an audited content pass. Keep the existing **program rest timer** for strength. Gate contextual launch + presets behind Pro using current paywall patterns; persist running state device-local and presets through the existing sync key list — **no Zustand**.
