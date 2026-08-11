import {
  loadSkills,
  type LoadSkillsOptions,
} from '@/src/services/sanitySkills';
import type { Skill } from '@/src/types/skills';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

/**
 * Loads Sanity-driven Skills & Cues when the screen is focused.
 * See `loadSkills` for caching behavior (TTL disabled in __DEV__).
 */
export function useSkills(): {
  skills: Skill[];
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => Promise<Skill[]>;
} {
  const [skills, setSkills] = useState<Skill[]>([]);
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
 * Resolves a single skill by slug id from the cached Sanity catalog.
 */
export function useSkill(skillId: string | null): {
  skill: Skill | undefined;
  isLoading: boolean;
} {
  const { skills, isLoading } = useSkills();
  const skill = skillId
    ? skills.find((entry) => entry.id === skillId)
    : undefined;
  return { skill, isLoading };
}
