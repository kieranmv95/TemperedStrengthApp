import type { WeightUnit } from '@/src/utils/storage';
import { kgToLb, lbToKg, roundLbToNearestWhole } from '@/src/utils/weightUnits';

/** Plain copy, or one prescribed barbell load (men's, or men's and women's). */
export type PrescribedWeightSegment =
  | { type: 'text'; text: string }
  | {
      type: 'weight';
      /** Source text, e.g. `70kg/50kg`, `61/43kg`, `(70m/47.5f)kg`, `50kg`. */
      label: string;
      /** Men's prescribed total, or the only total. */
      male: number;
      /** Women's prescribed total when the copy gives both. */
      female: number | null;
      unit: 'kg' | 'lb';
    };

/**
 * `70kg/50kg`, `61/43kg`, `(70m/47.5f)kg`, or `@ 50kg`.
 * Groups are read in `readMatch`.
 */
const WEIGHT_RE =
  /(?:(\d+(?:\.\d+)?)(kg|lb)\/(\d+(?:\.\d+)?)(kg|lb)|\(?(\d+(?:\.\d+)?)m\/(\d+(?:\.\d+)?)f\)?(kg|lb)|(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)(kg|lb)|@\s*(\d+(?:\.\d+)?)(kg|lb))/gi;

/** Implements the plate loader cannot build. Checked before lift names so "dumbbell snatch" stays plain. */
const NON_BARBELL =
  /\b(?:kettlebells?|dumbbells?|wall\s*balls?|medicine\s*balls?|med\s*balls?|sandbags?|farmers?|goblets?|vests?|devil\s*press(?:es)?|slams?|plates?)\b|\b(?:kb|db|sb)s?\b/i;

/** Lift language that means the number is a bar, not a pair of dumbbells written the same way. */
const BARBELL_CUE =
  /\b(?:barbells?|bars?|deadlifts?|cleans?|snatch(?:es)?|squats?|jerks?|thrusters?|ohs|overhead\s+squats?|shoulder\s+to\s+overhead)\b/i;

/** `2x24kg/16kg`, `2 x 15/10kg`, `1×15/10kg` — one or two implements, not a barbell. */
const IMPLEMENT_COUNT_PREFIX = /[12]\s*[x×]\s*$/i;

type ParsedWeight = {
  start: number;
  end: number;
  label: string;
  male: number;
  female: number | null;
  unit: 'kg' | 'lb';
};

function asUnit(raw: string): 'kg' | 'lb' {
  return raw.toLowerCase() === 'lb' ? 'lb' : 'kg';
}

function clauseAround(text: string, index: number): string {
  const prevBreaks = [
    text.lastIndexOf('\n', Math.max(0, index - 1)),
    text.lastIndexOf('. ', Math.max(0, index - 1)),
    text.lastIndexOf('! ', Math.max(0, index - 1)),
    text.lastIndexOf('? ', Math.max(0, index - 1)),
  ];
  const breakAt = Math.max(...prevBreaks);
  let start = 0;
  if (breakAt >= 0) {
    start = text[breakAt] === '\n' ? breakAt + 1 : breakAt + 2;
  }

  const nextBreaks = ['\n', '. ', '! ', '? '].map((token) => {
    const found = text.indexOf(token, index);
    return found === -1 ? text.length : found;
  });
  const end = Math.min(...nextBreaks);
  return text.slice(start, end);
}

function hasBarbellCue(scope: string): boolean {
  const withoutPullUpBar = scope.replace(/\bpull[-\s]?up bars?\b/gi, ' ');
  return BARBELL_CUE.test(withoutPullUpBar);
}

function readMatch(
  text: string,
  match: RegExpExecArray,
  context: string | undefined
): ParsedWeight | null {
  if (match.index > 0 && /[\d.]/.test(text[match.index - 1] ?? '')) {
    return null;
  }

  const prefix = text.slice(Math.max(0, match.index - 8), match.index);
  if (IMPLEMENT_COUNT_PREFIX.test(prefix)) {
    return null;
  }

  let start = match.index;
  let end = match.index + match[0].length;
  let label = match[0];
  let maleRaw: string | undefined;
  let femaleRaw: string | undefined;
  let unitRaw: string | undefined;
  let otherUnitRaw: string | undefined;
  let explicit = false;

  if (match[1] !== undefined) {
    maleRaw = match[1];
    otherUnitRaw = match[2];
    femaleRaw = match[3];
    unitRaw = match[4];
  } else if (match[5] !== undefined) {
    maleRaw = match[5];
    femaleRaw = match[6];
    unitRaw = match[7];
    explicit = true;
  } else if (match[8] !== undefined) {
    maleRaw = match[8];
    femaleRaw = match[9];
    unitRaw = match[10];
  } else if (match[11] !== undefined && match[12] !== undefined) {
    maleRaw = match[11];
    unitRaw = match[12];
    explicit = true;
    start = end - match[11].length - match[12].length;
    label = text.slice(start, end);
  }

  if (maleRaw === undefined || unitRaw === undefined) {
    return null;
  }
  if (
    otherUnitRaw !== undefined &&
    otherUnitRaw.toLowerCase() !== unitRaw.toLowerCase()
  ) {
    return null;
  }

  const male = Number(maleRaw);
  const female = femaleRaw === undefined ? null : Number(femaleRaw);
  if (!Number.isFinite(male) || male <= 0) {
    return null;
  }
  if (female !== null && (!Number.isFinite(female) || female <= 0)) {
    return null;
  }

  const scope = [context, clauseAround(text, match.index)]
    .filter(
      (part): part is string => typeof part === 'string' && part.length > 0
    )
    .join('\n');

  if (NON_BARBELL.test(scope)) {
    return null;
  }
  if (!explicit && !hasBarbellCue(scope)) {
    return null;
  }

  return {
    start,
    end,
    label,
    male,
    female,
    unit: asUnit(unitRaw),
  };
}

/**
 * Split copy into plain text and prescribed barbell loads.
 * `context` is nearby copy that is not part of `text`, usually the movement name,
 * so a note like `22.5/15kg` on a dumbbell snatch stays plain.
 * Kettlebells, dumbbells, wall balls, medicine balls, sandbags, and plates are left as text.
 */
export function parsePrescribedWeightSegments(
  text: string,
  context?: string
): PrescribedWeightSegment[] {
  const segments: PrescribedWeightSegment[] = [];
  const re = new RegExp(WEIGHT_RE.source, 'gi');
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const parsed = readMatch(text, match, context);
    if (parsed === null) {
      continue;
    }
    if (parsed.start > lastIndex) {
      segments.push({
        type: 'text',
        text: text.slice(lastIndex, parsed.start),
      });
    }
    segments.push({
      type: 'weight',
      label: parsed.label,
      male: parsed.male,
      female: parsed.female,
      unit: parsed.unit,
    });
    lastIndex = parsed.end;
  }

  if (lastIndex === 0) {
    return [{ type: 'text', text }];
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', text: text.slice(lastIndex) });
  }

  return segments;
}

/** Prescribed load in the viewer's display unit. Kg stays exact; pounds round to the pound. */
export function prescribedWeightToDisplay(
  weight: number,
  source: 'kg' | 'lb',
  unit: WeightUnit
): number {
  if (source === 'kg' && unit === 'kg') {
    return weight;
  }
  if (source === 'lb' && unit === 'lb') {
    return roundLbToNearestWhole(weight);
  }
  if (source === 'kg') {
    return roundLbToNearestWhole(kgToLb(weight));
  }
  return Math.round(lbToKg(weight) * 10) / 10;
}
