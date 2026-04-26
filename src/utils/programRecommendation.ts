import type {
  OnboardingExperienceLevel,
  OnboardingInterest,
  OnboardingProfile,
} from '@/src/types/onboarding';
import type { Program } from '@/src/types/program';

type ProgramCategory = Program['categories'][number];
type ProgramGoal = Program['goals'][number];
type ProgramDifficulty = Program['difficulty'];

export const INTEREST_TO_CATEGORIES: Record<
  OnboardingInterest,
  ProgramCategory[]
> = {
  crossfit: ['functional', 'conditioning', 'plyometrics'],
  hyrox: ['hyrox', 'conditioning', 'functional'],
  strength: ['strength', 'powerlifting'],
  powerlifting: ['powerlifting', 'strength'],
  bodybuilding: ['bodybuilding'],
  hypertrophy: ['bodybuilding', 'strength'],
  conditioning: ['conditioning', 'hyrox'],
  hiit: ['conditioning', 'functional', 'plyometrics'],
  olympic_lifting: ['olympic'],
  pilates: ['functional'],
  mobility: [],
  endurance: ['conditioning', 'hyrox'],
  fat_loss: ['conditioning', 'hyrox'],
};

export const INTEREST_TO_GOALS: Record<OnboardingInterest, ProgramGoal[]> = {
  crossfit: ['athletic'],
  hyrox: ['endurance', 'athletic'],
  strength: ['stronger'],
  powerlifting: ['stronger'],
  bodybuilding: ['hypertrophy', 'bulking'],
  hypertrophy: ['hypertrophy', 'bulking'],
  conditioning: ['endurance', 'leaner', 'cutting'],
  hiit: ['cutting', 'leaner', 'endurance', 'athletic'],
  olympic_lifting: ['stronger', 'athletic'],
  pilates: ['mobility', 'leaner'],
  mobility: ['mobility'],
  endurance: ['endurance'],
  fat_loss: ['cutting', 'leaner'],
};

/** Interests that imply conditioning, intervals, or body-composition leaning */
const METABOLIC_STYLE_INTERESTS: OnboardingInterest[] = [
  'hiit',
  'fat_loss',
  'conditioning',
  'endurance',
  'hyrox',
  'crossfit',
];

const METABOLIC_PROGRAM_CATEGORIES: ProgramCategory[] = [
  'conditioning',
  'functional',
  'hyrox',
  'plyometrics',
];

const HIIT_STYLE_PROGRAM_CATEGORIES: ProgramCategory[] = [
  'conditioning',
  'functional',
  'plyometrics',
];

const STRENGTH_BAR_INTERESTS: OnboardingInterest[] = [
  'strength',
  'powerlifting',
  'olympic_lifting',
];

const STRENGTH_BAR_CATEGORIES: ProgramCategory[] = [
  'strength',
  'powerlifting',
  'olympic',
];

const PHYSIQUE_INTERESTS: OnboardingInterest[] = [
  'bodybuilding',
  'hypertrophy',
];

const DIFFICULTY_ORDER: Record<ProgramDifficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
};

/** Experience is a tie-breaker only (never negative — avoids wrong picks). */
const experienceBonus = (
  programDifficulty: ProgramDifficulty,
  userLevel: OnboardingExperienceLevel
): number => {
  const diff = Math.abs(
    DIFFICULTY_ORDER[programDifficulty] - DIFFICULTY_ORDER[userLevel]
  );
  if (diff === 0) return 3;
  if (diff === 1) return 1;
  return 0;
};

function passesIntentGates(
  program: Program,
  interests: OnboardingInterest[]
): boolean {
  const selected = new Set(interests);

  const hasMetabolicStyle = METABOLIC_STYLE_INTERESTS.some((k) =>
    selected.has(k)
  );
  if (hasMetabolicStyle) {
    const hasMetabolicCategory = program.categories.some((c) =>
      METABOLIC_PROGRAM_CATEGORIES.includes(c)
    );
    const hasMetabolicGoal = program.goals.some((g) =>
      ['cutting', 'leaner', 'endurance'].includes(g)
    );
    const crossfitPath =
      selected.has('crossfit') &&
      program.categories.some((c) =>
        [
          'plyometrics',
          'functional',
          'conditioning',
          'strength',
          'powerlifting',
          'olympic',
        ].includes(c)
      );
    if (!hasMetabolicCategory && !hasMetabolicGoal && !crossfitPath) {
      return false;
    }
  }

  if (selected.has('fat_loss')) {
    if (!program.goals.some((g) => g === 'cutting' || g === 'leaner')) {
      return false;
    }
  }

  if (selected.has('hiit')) {
    const hiitCategoryOk = program.categories.some((c) =>
      HIIT_STYLE_PROGRAM_CATEGORIES.includes(c)
    );
    if (!hiitCategoryOk) {
      return false;
    }
  }

  const hasStrengthBar = STRENGTH_BAR_INTERESTS.some((k) => selected.has(k));
  const hasMetabolicForStrengthContext = METABOLIC_STYLE_INTERESTS.some((k) =>
    selected.has(k)
  );
  if (hasStrengthBar && !hasMetabolicForStrengthContext) {
    const strengthBarOk = program.categories.some((c) =>
      STRENGTH_BAR_CATEGORIES.includes(c)
    );
    if (!strengthBarOk) {
      return false;
    }
  }

  const hasPhysique = PHYSIQUE_INTERESTS.some((k) => selected.has(k));
  if (hasPhysique && !hasMetabolicForStrengthContext) {
    const physiqueOk =
      program.categories.includes('bodybuilding') ||
      program.goals.includes('hypertrophy');
    if (!physiqueOk) {
      return false;
    }
  }

  if (selected.has('pilates')) {
    const pilatesOk =
      program.categories.includes('functional') &&
      program.goals.some((g) => g === 'mobility' || g === 'leaner');
    if (!pilatesOk) {
      return false;
    }
  }

  if (selected.has('mobility') && !selected.has('pilates')) {
    if (!program.goals.includes('mobility')) {
      return false;
    }
  }

  if (selected.has('olympic_lifting')) {
    if (!program.categories.includes('olympic')) {
      return false;
    }
  }

  return true;
}

function interestBodyScore(
  program: Program,
  interests: OnboardingInterest[]
): number {
  const wantedCategories = new Set<ProgramCategory>();
  const wantedGoals = new Set<ProgramGoal>();
  for (const interest of interests) {
    for (const c of INTEREST_TO_CATEGORIES[interest]) {
      wantedCategories.add(c);
    }
    for (const g of INTEREST_TO_GOALS[interest]) {
      wantedGoals.add(g);
    }
  }

  let score = 0;
  for (const category of program.categories) {
    if (wantedCategories.has(category)) {
      score += 2;
    }
  }
  for (const goal of program.goals) {
    if (wantedGoals.has(goal)) {
      score += 1;
    }
  }
  return score;
}

export type ProgramScore = {
  score: number;
  isRecommended: boolean;
};

export const scoreProgram = (
  program: Program,
  profile: OnboardingProfile | null
): ProgramScore => {
  if (!profile) {
    return { score: 0, isRecommended: false };
  }

  const interests = profile.interests ?? [];
  const experienceLevel = profile.experienceLevel;

  if (interests.length === 0 || !experienceLevel) {
    return { score: 0, isRecommended: false };
  }

  if (!passesIntentGates(program, interests)) {
    return { score: 0, isRecommended: false };
  }

  const body = interestBodyScore(program, interests);
  const exp = experienceBonus(program.difficulty, experienceLevel);
  const sortScore = body * 10 + exp;

  const meetsThreshold = body >= 4;

  return { score: sortScore, isRecommended: meetsThreshold };
};

export type RecommendedProgram = {
  program: Program;
  isRecommended: boolean;
  score: number;
};

export const sortProgramsByRecommendation = (
  programs: Program[],
  profile: OnboardingProfile | null
): RecommendedProgram[] => {
  const scored = programs.map((program, index) => {
    const { score, isRecommended: meetsThreshold } = scoreProgram(
      program,
      profile
    );
    return { program, meetsThreshold, score, index };
  });

  let bestFreeIndex: number | null = null;
  let bestProIndex: number | null = null;
  for (const entry of scored) {
    if (!entry.meetsThreshold) continue;
    if (entry.program.isPro) {
      if (
        bestProIndex === null ||
        entry.score > scored[bestProIndex].score ||
        (entry.score === scored[bestProIndex].score &&
          entry.index < scored[bestProIndex].index)
      ) {
        bestProIndex = entry.index;
      }
    } else {
      if (
        bestFreeIndex === null ||
        entry.score > scored[bestFreeIndex].score ||
        (entry.score === scored[bestFreeIndex].score &&
          entry.index < scored[bestFreeIndex].index)
      ) {
        bestFreeIndex = entry.index;
      }
    }
  }

  const withRecommendation = scored.map((entry) => ({
    ...entry,
    isRecommended:
      entry.index === bestFreeIndex || entry.index === bestProIndex,
  }));

  withRecommendation.sort((a, b) => {
    if (a.isRecommended !== b.isRecommended) {
      return a.isRecommended ? -1 : 1;
    }
    if (a.isRecommended && b.isRecommended) {
      if (a.program.isPro !== b.program.isPro) {
        return a.program.isPro ? 1 : -1;
      }
    }
    return a.index - b.index;
  });

  return withRecommendation.map(({ program, isRecommended, score }) => ({
    program,
    isRecommended,
    score,
  }));
};
