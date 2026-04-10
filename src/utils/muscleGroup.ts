const CLEANUP_REGEX = /\s+/g;

const normalizeToken = (value: string) =>
  value.trim().replace(CLEANUP_REGEX, ' ');

/**
 * Normalize an exercise `muscle` string into a stable, high-level group.
 *
 * Notes:
 * - `Exercise.muscle` is user-facing and can contain variants (e.g. "Upper Chest")
 *   and combos (e.g. "Triceps/Chest").
 * - This intentionally returns a single group for ranking swap alternatives.
 */
export const getMuscleGroup = (muscle: string): string => {
  const raw = normalizeToken(muscle);
  if (!raw) return 'Other';

  const lower = raw.toLowerCase();

  // Direct, explicit mappings (most reliable).
  const direct: Record<string, string> = {
    abs: 'Abs',
    obliques: 'Abs',

    chest: 'Chest',
    'upper chest': 'Chest',
    'lower chest': 'Chest',

    back: 'Back',
    lats: 'Back',
    'mid-back': 'Back',
    'lats/mid-back': 'Back',
    'upper body/back': 'Back',
    traps: 'Back',
    'back/traps': 'Back',

    shoulders: 'Shoulders',
    delts: 'Shoulders',
    'rear delts': 'Shoulders',
    'core/shoulder stability': 'Shoulders',

    biceps: 'Arms',
    triceps: 'Arms',
    forearms: 'Arms',
    'biceps/forearms': 'Arms',
    'triceps/chest': 'Arms',

    quadriceps: 'Legs',
    hamstrings: 'Legs',
    glutes: 'Legs',
    adductors: 'Legs',
    calves: 'Legs',
    'glute medius': 'Legs',
    'posterior chain': 'Legs',
    'hamstrings/lower back': 'Legs',
    'quadriceps/glutes': 'Legs',
    'quadriceps/core': 'Legs',
    'shoulders/legs': 'Legs',
    'legs/balance': 'Legs',

    'full body': 'Full Body',
    'full body/back': 'Full Body',
    'full body/shoulders': 'Full Body',
    'full body/traps': 'Full Body',
  };

  if (direct[lower]) return direct[lower];

  // If it's a combo, pick the first recognized token (stable + predictable).
  if (raw.includes('/')) {
    const parts = raw
      .split('/')
      .map((part) => normalizeToken(part))
      .filter(Boolean);

    for (const part of parts) {
      const mapped = direct[part.toLowerCase()];
      if (mapped) return mapped;
    }

    // Fallback: use the first token as the group label.
    return parts[0] ?? 'Other';
  }

  // Last resort: title-case-ish (keep dataset wording).
  return raw;
};
