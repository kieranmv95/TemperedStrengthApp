import { useSubscription } from '@/src/hooks/use-subscription';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import {
  getSupabaseClient,
  isSupabaseConfigured,
} from '@/src/services/supabaseClient';
import { useEffect, useState } from 'react';

export type UseRolesResult = {
  roles: string[];
  isPro: boolean;
  isLoading: boolean;
};

function normalizeRoles(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((role): role is string => typeof role === 'string');
}

/**
 * Resolves app roles from Supabase `user_roles` together with Pro status.
 * `isLoading` stays true until both session/roles and subscription have settled.
 */
export function useRoles(): UseRolesResult {
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const { user, isSessionReady } = useSyncManager();
  const [roles, setRoles] = useState<string[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  useEffect(() => {
    if (!isSessionReady) {
      return;
    }

    let cancelled = false;

    const loadRoles = async () => {
      if (!user?.id || !isSupabaseConfigured) {
        if (!cancelled) {
          setRoles([]);
          setRolesLoading(false);
        }
        return;
      }

      setRolesLoading(true);

      try {
        const { data, error } = await getSupabaseClient()
          .from('user_roles')
          .select('roles')
          .eq('user_id', user.id)
          .is('deleted_at', null)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!cancelled) {
          setRoles(normalizeRoles(data?.roles));
        }
      } catch (error) {
        console.error('Failed to load user roles:', error);
        if (!cancelled) {
          setRoles([]);
        }
      } finally {
        if (!cancelled) {
          setRolesLoading(false);
        }
      }
    };

    void loadRoles();

    return () => {
      cancelled = true;
    };
  }, [isSessionReady, user?.id]);

  return {
    roles,
    isPro,
    isLoading: !isSessionReady || rolesLoading || subscriptionLoading,
  };
}
