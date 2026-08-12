import {
  loadSkillById,
  loadSkills,
  type LoadSkillsOptions,
} from '@/src/services/sanitySkills';
import type { Skill, SkillSummary } from '@/src/types/skills';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

/**
 * Loads Sanity-driven Skills & Cues summaries when the screen is focused.
 * List payloads include counts only (no tip/cue bodies).
 * See `loadSkills` for caching behavior (TTL disabled in __DEV__).
 */
export function useSkills(): {
  skills: SkillSummary[];
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => Promise<SkillSummary[]>;
} {
  const [skills, setSkills] = useState<SkillSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);

  const fetchSkills = useCallback(async (options?: LoadSkillsOptions) => {
    return loadSkills(options);
  }, []);

  const refetch = useCallback(async () => {
    setIsRefetching(true);
    try {
      const next = await fetchSkills({ forceRefresh: true });
      setSkills(next);
      return next;
    } finally {
      setIsRefetching(false);
    }
  }, [fetchSkills]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void (async () => {
        try {
          const next = await fetchSkills();
          if (!cancelled) {
            setSkills(next);
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [fetchSkills])
  );

  return { skills, isLoading, isRefetching, refetch };
}

/**
 * Loads one full skill (including tips/cues) by slug id.
 */
export function useSkill(skillId: string | null): {
  skill: Skill | undefined;
  isLoading: boolean;
} {
  const [skill, setSkill] = useState<Skill | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(Boolean(skillId));

  useFocusEffect(
    useCallback(() => {
      if (!skillId) {
        setSkill(undefined);
        setIsLoading(false);
        return;
      }

      let cancelled = false;
      setIsLoading(true);
      void (async () => {
        try {
          const next = await loadSkillById(skillId);
          if (!cancelled) {
            setSkill(next);
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [skillId])
  );

  return { skill, isLoading };
}
