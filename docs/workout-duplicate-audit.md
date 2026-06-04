# Workout duplicate audit

Audit of **158** standalone workouts in [`src/data/workouts.json`](../src/data/workouts.json) (June 2026).

## How duplicates were detected

| Check                                                                     | Result                    |
| ------------------------------------------------------------------------- | ------------------------- |
| **Exact title match** (case-insensitive)                                  | **2 groups** (4 workouts) |
| **Near title match** (shared words ≥85%, or one title contains the other) | **5 pairs**               |
| **Identical block/movement content** (full fingerprint)                   | **0**                     |

No two workouts share the same blocks and movement list. Collisions are **naming overlaps** or **similar benchmark names**, not copy-paste duplicates.

### Richness score (for comparison only)

Heuristic used to compare entries in the same group (higher = more data in the template):

- Description length
- Number of tags and equipment entries
- Number of blocks and movements
- Instruction text
- Scaled difficulty variants (`blocks[].scale`)
- Structured `DetailedMovement` objects vs plain strings

**Not** included: log schema quality, premium flag, or whether the workout is “canonical” (e.g. CrossFit benchmark).

---

## Summary

| Group                     | Issue             | Same workout?                                     | Suggested action                    |
| ------------------------- | ----------------- | ------------------------------------------------- | ----------------------------------- |
| Ground & Pound            | `f_18` vs `p_58`  | **No** — different format & movements             | Rename one title (see below)        |
| Double Trouble            | `rh_02` vs `p_72` | **No** — Rainhill chipper vs HIIT AMRAP           | Rename one title (see below)        |
| Grace / Heavy Grace       | `f_34` vs `p_11`  | **No** — benchmark vs heavy variant               | Keep both                           |
| The Chief                 | `f_45` vs `p_02`  | **No** — benchmark vs snatch complex              | Keep both; consider renaming `p_02` |
| The Gauntlet              | `rh_03` vs `p_63` | **No** — 3-block Rainhill vs HIIT AMRAP           | Keep both; rename HIIT if confusing |
| The Ladder                | `rh_04` vs `p_56` | **No** — KB carry ladder vs leg descending ladder | Rename one title                    |
| Ignition / Final Ignition | `p_55` vs `p_75`  | **Related** — same programme arc                  | Keep both (intentional progression) |

---

## 1. Exact title duplicates

### 1.1 Ground & Pound — `f_18` vs `p_58`

**These are not the same session.** Only the title collides (likely from HIIT Shred import vs existing free WOD).

|               | **f_18** (keep as canonical “Ground & Pound”)    | **p_58** (HIIT Shred)                                              |
| ------------- | ------------------------------------------------ | ------------------------------------------------------------------ |
| **Richness**  | **82.9**                                         | 43.8                                                               |
| **Category**  | WOD                                              | Conditioning                                                       |
| **Premium**   | Free                                             | Pro                                                                |
| **Est. time** | 18 min                                           | 25 min                                                             |
| **Tags**      | Full Body, No Equipment, Core                    | HIIT, HIIT Shred, Conditioning, For Time                           |
| **Equipment** | `[]` (bodyweight)                                | dumbbell, barbell, bands, medicine ball                            |
| **Blocks**    | 2 — Warmup + EMOM 10                             | 1 — For-time chipper                                               |
| **Movements** | 14 lines (progressive EMOM push-up / jump squat) | 5 lines (burpees, goblet squat, pull-ups, ball slams, squat jumps) |
| **Logging**   | Default notes (no schema id)                     | `duration` — finish time + PR                                      |

**Richer template:** **`f_18`** — more blocks, more movement detail, warmup, progressive EMOM structure.

**Recommendation:** Keep **`f_18`**. Rename **`p_58`** to something like **“Ground & Pound Chipper”** or **“HIIT Shred: Ground & Pound”** to avoid search/filter confusion.

---

### 1.2 Double Trouble — `rh_02` vs `p_72`

**Completely different workouts.** Rainhill event chipper (3 scales) vs HIIT Shred upper-body AMRAP.

|               | **rh_02**                                                          | **p_72**                                                        |
| ------------- | ------------------------------------------------------------------ | --------------------------------------------------------------- |
| **Richness**  | **175.2**                                                          | 44.1                                                            |
| **Category**  | Rainhill                                                           | Conditioning                                                    |
| **Premium**   | Free                                                               | Pro                                                             |
| **Est. time** | 11 min cap                                                         | 20 min AMRAP                                                    |
| **Tags**      | Rainhill, Chipper, For Time, Dumbbells, Gymnastics, Jump Rope      | HIIT, HIIT Shred, Conditioning, AMRAP                           |
| **Equipment** | dumbbell, barbell, skipping rope, rower                            | dumbbell, rower, medicine ball, pull-up bar                     |
| **Blocks**    | **3 scaled variants** (ROCKET / KENNEDY / WOOD), each full chipper | 1 AMRAP block                                                   |
| **Movements** | 33+ per scale (DU, HSPU, row, DB thrusters, …)                     | 5 (push-ups, chin-ups, DB push press, inverted row, ball slams) |
| **Logging**   | `duration` — finish time                                           | `amrap` — 20 min cap                                            |

**Richer template:** **`rh_02`** by a large margin — scaled prescriptions, full chipper, event-specific loads.

**Recommendation:** Keep **`rh_02`** for Rainhill. Rename **`p_72`** to **“Double Trouble AMRAP”** or **“HIIT Shred: Double Trouble”**.

---

## 2. Near-title pairs (not exact duplicates)

### 2.1 Grace — `f_34` vs Heavy Grace — `p_11`

|               | **f_34 Grace**                                   | **p_11 Heavy Grace**                      |
| ------------- | ------------------------------------------------ | ----------------------------------------- |
| **Richness**  | **38.3**                                         | 29.1                                      |
| **Same WOD?** | Classic **30 C&J for time** (60/40 kg suggested) | **30 C&J for time** at **61/43 kg**       |
| **Blocks**    | Warmup + For Time                                | Warmup + 30 Reps                          |
| **Tags**      | CrossFit, Benchmark, For Time, …                 | CrossFit, Barbell, Power (no “Benchmark”) |
| **Logging**   | `duration`                                       | `duration`                                |

**Richer template:** **`f_34`** — benchmark tagging, row warmup, explicit rep scheme in instructions.

**Recommendation:** **Keep both** — intentional free vs pro weight variant. Optionally add “Benchmark” tag to `p_11`.

---

### 2.2 The Chief — `f_45` vs Olympic Complex: The Chief — `p_02`

|               | **f_45 The Chief**                                                  | **p_02 Olympic Complex: The Chief** |
| ------------- | ------------------------------------------------------------------- | ----------------------------------- |
| **Richness**  | **46.2**                                                            | 29.1                                |
| **Same WOD?** | **Yes** — 5 × 3 min AMRAP (3 PC, 6 push-ups, 9 squats) + 1 min rest | **No** — EMOM 15 snatch complex     |
| **Category**  | WOD                                                                 | Strength                            |
| **Logging**   | `max_reps` — total rounds                                           | Default notes                       |

**Richer template:** **`f_45`** for the actual “Chief” benchmark.

**Recommendation:** **Keep both** but **`p_02` is misnamed** — rename to e.g. **“Olympic Complex: Snatch EMOM”** so it is not confused with the Chief benchmark.

---

### 2.3 The Gauntlet — `rh_03` vs `p_63`

|               | **rh_03 Seeding: The Gauntlet**                                                      | **p_63 The Gauntlet**                     |
| ------------- | ------------------------------------------------------------------------------------ | ----------------------------------------- |
| **Richness**  | **116.5**                                                                            | 43.7                                      |
| **Same WOD?** | **No** — three timed chippers (6/5/4 min caps), wall ball + KB, box/pull, burpee BJO | **No** — single 15 min AMRAP, 5 movements |
| **Blocks**    | 3 sequential blocks                                                                  | 1 WOD block                               |
| **Logging**   | `duration` per block (Rainhill notes)                                                | `amrap` 15 min                            |

**Richer template:** **`rh_03`** — multi-block event structure, caps, progression notes.

**Recommendation:** **Keep both.** Rename **`p_63`** to **“The Gauntlet AMRAP”** if you want clearer separation from Rainhill.

---

### 2.4 The Ladder — `rh_04` vs `p_56`

|               | **rh_04 The Ladder Carry**                                      | **p_56 The Ladder**                                                      |
| ------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Richness**  | **163.4**                                                       | 34.2                                                                     |
| **Same WOD?** | **No** — 8 min ascending AMRAP, carries, lunges, T2B (3 scales) | **No** — descending **for-time** ladder: squat jumps, lunges, ball slams |
| **Title**     | Already distinct (“Ladder **Carry**”)                           | Short “The Ladder”                                                       |

**Richer template:** **`rh_04`** — scales, dividers, detailed progression.

**Recommendation:** **Keep both.** Titles are already partially distinct; optional rename **`p_56`** → **“The Descending Ladder”** (matches program label).

---

### 2.5 Ignition — `p_55` vs Final Ignition — `p_75`

|                  | **p_55 Ignition**                              | **p_75 Final Ignition**             |
| ---------------- | ---------------------------------------------- | ----------------------------------- |
| **Richness**     | 32.1                                           | **43.1**                            |
| **Same WOD?**    | **No** — AMRAP **10** (burpee, squat, push-up) | AMRAP **25**, 5 movements (broader) |
| **Relationship** | HIIT Shred week 1 opener                       | Week 6 finale — deliberate bookend  |

**Richer template:** **`p_75`** (longer cap, more movements); **`p_55`** is simpler week-1 version.

**Recommendation:** **Keep both** — programme progression, not a duplicate. Names are intentionally related.

---

## 3. Related note: “Tabata” tag overlap (not title duplicates)

Three workouts use tabata-style work but **different titles**:

- `f_13` — Four Minutes of Fury
- `p_57` — Push Storm (HIIT Shred)
- `p_68` — Pull Everything (HIIT Shred)

No action required unless you want stricter tag uniqueness.

---

## 4. Recommended renames (if you dedupe confusion only)

| Current id | Current title              | Suggested title                      |
| ---------- | -------------------------- | ------------------------------------ |
| `p_58`     | Ground & Pound             | **Ground & Pound Chipper**           |
| `p_72`     | Double Trouble             | **Double Trouble AMRAP**             |
| `p_02`     | Olympic Complex: The Chief | **Olympic Complex: Snatch EMOM**     |
| `p_56`     | The Ladder                 | **The Descending Ladder** (optional) |
| `p_63`     | The Gauntlet               | **The Gauntlet AMRAP** (optional)    |

Renaming is optional for catalog clarity; **no workouts should be deleted** based on this audit except after you confirm you do not want two different sessions under the same name.

---

## 5. Deletion guidance

| Id               | Delete?                                                            | Reason                                |
| ---------------- | ------------------------------------------------------------------ | ------------------------------------- |
| `f_18`           | **No**                                                             | Richer, unique no-equipment EMOM      |
| `p_58`           | Only if you drop HIIT import duplicate **name** — rename preferred | Different pro chipper                 |
| `rh_02`          | **No**                                                             | Flagship Rainhill content with scales |
| `p_72`           | **No**                                                             | Valid HIIT AMRAP; rename preferred    |
| `f_34` / `p_11`  | **No**                                                             | Benchmark + heavy variant             |
| `f_45` / `p_02`  | **No**                                                             | Different sessions; rename `p_02`     |
| `rh_03` / `p_63` | **No**                                                             | Different events                      |
| `rh_04` / `p_56` | **No**                                                             | Different movements                   |
| `p_55` / `p_75`  | **No**                                                             | Programme arc                         |

---

_Generated by automated scan of `workouts.json`. Re-run after large imports or title changes._
