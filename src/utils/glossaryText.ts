import { glossary } from '@/src/data/glossary';
import type { GlossaryTerm } from '@/src/types/brief';

export type GlossaryTextHit = {
  start: number;
  end: number;
  text: string;
  term: GlossaryTerm;
};

export type GlossaryTextSegment =
  | { type: 'text'; text: string }
  | { type: 'term'; text: string; term: GlossaryTerm };

/**
 * Glossary entries that are also ordinary English in coaching copy.
 * "Work in order" is not the rack-sharing term.
 */
const SKIP_TERMS = new Set(['Work In']);

/** Last words that should not grow a plural ("for times", "one rep maxs"). */
const NO_PLURAL = new Set(['max', 'time', 'gym', 'tension']);

const EXTRA_ALIASES: Record<string, readonly string[]> = {
  '1RM': ['one rep max', 'one-rep max', '1-RM'],
  'PR / PB': ['personal record', 'personal best'],
  Periodisation: ['periodization', 'periodised', 'periodized'],
  Kipping: ['kip'],
  Lockout: ['lock out'],
  Bracing: ['brace'],
  'Re-rack': ['rerack'],
  'Pre-workout': ['preworkout'],
  'Post-workout': ['postworkout'],
  'Drop Set': ['dropset'],
  'Warm-up Set': ['warmup set'],
  'Ego Lifting': ['ego lift'],
  'RX / Scaled': ['scaling'],
  Deload: ['de-load'],
  Superset: ['super set'],
  'Top Set / Back-off Set': ['backoff set'],
  'Hip Hinge': ['hinge'],
};

/** Replaces the slash-split aliases so bare "surplus" is not linked. */
const ALIAS_REPLACEMENTS: Record<string, readonly string[]> = {
  'Calorie Deficit / Surplus': ['calorie deficit', 'calorie surplus'],
};

const SET_CUE =
  '(?:a|an|the|each|every|per|this|that|another|one|single|final|last|first|next|same)';

/** Singular "set" followed by these words is the verb, not a group of reps. */
const SET_VERB_FOLLOW =
  '(?!\\s+(?:up|the|your|yourself|a|an|for|them|those|these)\\b)';

type CompiledPattern = {
  regex: RegExp;
  term: GlossaryTerm;
  /**
   * Capture group that is the underlined span. It is a suffix of the full
   * match, so the cue words in front of "set" are not part of the link.
   */
  linkGroup?: number;
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isAcronym(word: string): boolean {
  return /[A-Z]/.test(word) && word === word.toUpperCase();
}

function wordPattern(word: string, pluralize: boolean): string {
  const escaped = escapeRegExp(word);
  if (!pluralize) return escaped;

  const lower = word.toLowerCase();
  if (NO_PLURAL.has(lower)) return escaped;
  if (isAcronym(word)) return `${escaped}s?`;
  if (lower.endsWith('ies') && lower.length > 4) {
    return `${escapeRegExp(word.slice(0, -3))}(?:y|ies)`;
  }
  if (lower.endsWith('s') && !lower.endsWith('ss')) {
    return `${escapeRegExp(word.slice(0, -1))}s?`;
  }
  if (/(?:s|x|z|ch|sh)$/i.test(lower)) {
    return `${escaped}(?:es)?`;
  }
  return `${escaped}s?`;
}

function aliasToSource(alias: string): string {
  const words = alias
    .trim()
    .split(/[\s-]+/)
    .filter((word) => word.length > 0);
  return words
    .map((word, index) => wordPattern(word, index === words.length - 1))
    .join('[-\\s]+');
}

function aliasesFor(term: GlossaryTerm): string[] {
  const replacement = ALIAS_REPLACEMENTS[term.term];
  if (replacement) return [...replacement];

  const aliases: string[] = [];
  const abbreviations: string[] = [];
  const withoutParen = term.term.replace(/\(([^)]+)\)/g, (_, abbr: string) => {
    const trimmed = abbr.trim();
    if (trimmed.length > 0) abbreviations.push(trimmed);
    return ' ';
  });

  for (const part of withoutParen.split('/')) {
    const trimmed = part.replace(/\s+/g, ' ').trim();
    if (trimmed.length > 0) aliases.push(trimmed);
  }

  return [...aliases, ...abbreviations, ...(EXTRA_ALIASES[term.term] ?? [])];
}

function boundarySource(source: string, trailingLookahead = ''): string {
  return `(?<![A-Za-z0-9])(?:${source})${trailingLookahead}(?![A-Za-z0-9])`;
}

function setPatterns(term: GlossaryTerm): CompiledPattern[] {
  return [
    {
      regex: new RegExp(boundarySource('sets'), 'gi'),
      term,
    },
    {
      regex: new RegExp(`${boundarySource('set')}(?=\\s+(?:of\\b|\\d))`, 'gi'),
      term,
    },
    {
      regex: new RegExp(
        `\\b(${SET_CUE}\\s+(?:[A-Za-z]+\\s+){0,2})(set)\\b${SET_VERB_FOLLOW}`,
        'gi'
      ),
      term,
      linkGroup: 2,
    },
  ];
}

function compilePatterns(): CompiledPattern[] {
  const compiled: CompiledPattern[] = [];

  for (const term of glossary) {
    if (SKIP_TERMS.has(term.term)) continue;
    if (term.term === 'Sets') {
      compiled.push(...setPatterns(term));
      continue;
    }

    const seen = new Set<string>();
    for (const alias of aliasesFor(term)) {
      const trailing =
        term.term === 'Box'
          ? '(?!\\s+breathing)'
          : term.term === 'Bail'
            ? '(?!\\s+on\\b)'
            : '';
      const source = boundarySource(aliasToSource(alias), trailing);
      if (seen.has(source)) continue;
      seen.add(source);
      compiled.push({
        regex: new RegExp(source, 'gi'),
        term,
      });
    }
  }

  return compiled;
}

const COMPILED_PATTERNS = compilePatterns();

function collectHits(text: string): GlossaryTextHit[] {
  const hits: GlossaryTextHit[] = [];

  for (const pattern of COMPILED_PATTERNS) {
    pattern.regex.lastIndex = 0;
    for (const match of text.matchAll(pattern.regex)) {
      const full = match[0];
      const linked = pattern.linkGroup ? match[pattern.linkGroup] : full;
      if (!linked || full.length === 0) continue;
      const fullStart = match.index ?? 0;
      const start = fullStart + full.length - linked.length;
      hits.push({
        start,
        end: start + linked.length,
        text: linked,
        term: pattern.term,
      });
    }
  }

  hits.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));

  const chosen: GlossaryTextHit[] = [];
  let cursor = 0;
  for (const hit of hits) {
    if (hit.start < cursor) continue;
    chosen.push(hit);
    cursor = hit.end;
  }
  return chosen;
}

export function findGlossaryHits(text: string): GlossaryTextHit[] {
  if (text.length === 0) return [];
  return collectHits(text);
}

export function segmentGlossaryText(text: string): GlossaryTextSegment[] {
  const hits = findGlossaryHits(text);
  if (hits.length === 0) {
    return [{ type: 'text', text }];
  }

  const segments: GlossaryTextSegment[] = [];
  let cursor = 0;
  for (const hit of hits) {
    if (hit.start > cursor) {
      segments.push({ type: 'text', text: text.slice(cursor, hit.start) });
    }
    segments.push({ type: 'term', text: hit.text, term: hit.term });
    cursor = hit.end;
  }
  if (cursor < text.length) {
    segments.push({ type: 'text', text: text.slice(cursor) });
  }
  return segments;
}
