import { Colors } from '@/src/constants/theme';
import { color } from '@/src/constants/tokens';
import {
  CONTRAST_MINIMUMS,
  contrastRatio,
  flattenToHex,
  type ContrastKind,
} from '@/src/utils/contrast';

type ContrastPair = {
  name: string;
  foreground: string;
  background: string;
  kind: ContrastKind;
};

const SURFACES = {
  bg: color.bg,
  surface1: color.surface1,
  surface2: color.surface2,
  surface3: color.surface3,
} as const;

function onEverySurface(
  name: string,
  foreground: string,
  kind: ContrastKind
): ContrastPair[] {
  return Object.entries(SURFACES).map(([surfaceName, background]) => ({
    name: `${name} on ${surfaceName}`,
    foreground,
    background,
    kind,
  }));
}

const selectedChipSurface1 = flattenToHex(color.goldTint, color.surface1);
const selectedChipSurface2 = flattenToHex(color.goldTint, color.surface2);
const pressedChipSurface2 = flattenToHex(color.goldTintStrong, color.surface2);

/**
 * Every foreground/background pair the UI uses. Add a pair here whenever a
 * component introduces a new combination.
 */
const PAIRS: ContrastPair[] = [
  // Text hierarchy
  ...onEverySurface('textPrimary', color.textPrimary, 'text'),
  ...onEverySurface('textSecondary', color.textSecondary, 'text'),
  ...onEverySurface('textTertiary', color.textTertiary, 'text'),

  // Gold accent text and icons
  ...onEverySurface('gold', color.gold, 'text'),
  ...onEverySurface('goldStrong', color.goldStrong, 'text'),
  {
    name: 'gold on selected chip (goldTint over surface1)',
    foreground: color.gold,
    background: selectedChipSurface1,
    kind: 'text',
  },
  {
    name: 'gold on selected chip (goldTint over surface2)',
    foreground: color.gold,
    background: selectedChipSurface2,
    kind: 'text',
  },
  {
    name: 'textPrimary on selected chip (goldTint over surface2)',
    foreground: color.textPrimary,
    background: selectedChipSurface2,
    kind: 'text',
  },
  {
    name: 'gold on pressed chip (goldTintStrong over surface2)',
    foreground: color.gold,
    background: pressedChipSurface2,
    kind: 'text',
  },

  // Text on gold fills (primary buttons, badges)
  {
    name: 'onGold on gold',
    foreground: color.onGold,
    background: color.gold,
    kind: 'text',
  },
  {
    name: 'onGold on goldStrong (pressed)',
    foreground: color.onGold,
    background: color.goldStrong,
    kind: 'text',
  },

  // Semantic text and icons
  ...(['success', 'warning', 'danger', 'info'] as const).flatMap(
    (key): ContrastPair[] => [
      {
        name: `${key} on surface1`,
        foreground: color[key],
        background: color.surface1,
        kind: 'text',
      },
      {
        name: `${key} on surface2`,
        foreground: color[key],
        background: color.surface2,
        kind: 'text',
      },
    ]
  ),
  {
    name: 'success on successTint over surface1 (completed badge)',
    foreground: color.success,
    background: flattenToHex(color.successTint, color.surface1),
    kind: 'text',
  },
  {
    name: 'danger on dangerTint over surface1 (error badge)',
    foreground: color.danger,
    background: flattenToHex(color.dangerTint, color.surface1),
    kind: 'text',
  },
  {
    name: 'info on infoTint over surface1 (media action chip)',
    foreground: color.info,
    background: flattenToHex(color.infoTint, color.surface1),
    kind: 'text',
  },
  {
    name: 'info on infoTintStrong over surface1 (pressed action chip)',
    foreground: color.info,
    background: flattenToHex(color.infoTintStrong, color.surface1),
    kind: 'text',
  },
  {
    name: 'info on infoTint over surface2 (action chip on hero card)',
    foreground: color.info,
    background: flattenToHex(color.infoTint, color.surface2),
    kind: 'text',
  },
  {
    name: 'gold on goldTintStrong over surface1 (pressed gold action chip)',
    foreground: color.gold,
    background: flattenToHex(color.goldTintStrong, color.surface1),
    kind: 'text',
  },

  // Non-text UI (SC 1.4.11)
  {
    name: 'borderStrong (input outline) vs bg',
    foreground: color.borderStrong,
    background: color.bg,
    kind: 'nonText',
  },
  {
    name: 'borderStrong (input outline) vs surface1',
    foreground: color.borderStrong,
    background: color.surface1,
    kind: 'nonText',
  },
  {
    name: 'borderStrong (input outline) vs surface2',
    foreground: color.borderStrong,
    background: color.surface2,
    kind: 'nonText',
  },
  {
    name: 'gold selected border vs surface2',
    foreground: color.gold,
    background: color.surface2,
    kind: 'nonText',
  },
  {
    name: 'gold progress fill vs surface3 track',
    foreground: color.gold,
    background: color.surface3,
    kind: 'nonText',
  },
  {
    name: 'success set-complete fill vs surface2',
    foreground: color.success,
    background: color.surface2,
    kind: 'nonText',
  },
  {
    name: 'textSecondary inactive tab icon vs bg',
    foreground: color.textSecondary,
    background: color.bg,
    kind: 'nonText',
  },
  {
    name: 'gold active tab icon and indicator vs bg',
    foreground: color.gold,
    background: color.bg,
    kind: 'nonText',
  },

  // Legacy `Colors` pairs still used by screens outside the overhaul
  {
    name: 'legacy textMuted on backgroundCard',
    foreground: Colors.textMuted,
    background: Colors.backgroundCard,
    kind: 'text',
  },
  {
    name: 'legacy textPlaceholder on backgroundElevated',
    foreground: Colors.textPlaceholder,
    background: Colors.backgroundElevated,
    kind: 'text',
  },
  {
    name: 'legacy textOnAccent on accent',
    foreground: Colors.textOnAccent,
    background: Colors.accent,
    kind: 'text',
  },
  {
    name: 'legacy textBlack on recommended (programme badge)',
    foreground: Colors.textBlack,
    background: Colors.recommended,
    kind: 'text',
  },
  {
    name: 'legacy destructive on backgroundCard',
    foreground: Colors.destructive,
    background: Colors.backgroundCard,
    kind: 'text',
  },
];

describe('design token contrast (WCAG 2.2 AA)', () => {
  it.each(PAIRS)('$name meets the $kind minimum', (pair) => {
    const ratio = contrastRatio(pair.foreground, pair.background);
    const minimum = CONTRAST_MINIMUMS[pair.kind];
    if (ratio < minimum) {
      throw new Error(
        `${pair.name}: ${ratio.toFixed(2)}:1 is below ${minimum}:1 ` +
          `(${pair.foreground} on ${pair.background})`
      );
    }
  });
});
