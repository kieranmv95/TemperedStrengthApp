import { BottomSheet } from '@/src/components/ds';
import { GlossaryTermBody } from '@/src/components/glossary/GlossaryTermBody';
import { GlossaryTermContext } from '@/src/hooks/glossary-term-context';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { GlossaryTerm } from '@/src/types/brief';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo, useState } from 'react';

/**
 * Glossary sheet for screens that are not already inside a modal. Popups host
 * their own overlay, because a second native modal cannot open over the first.
 */
export function GlossaryTermProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const posthog = usePostHog();
  const [term, setTerm] = useState<GlossaryTerm | null>(null);

  const close = useCallback(() => {
    setTerm(null);
  }, []);

  const openGlossaryTerm = useCallback(
    (next: GlossaryTerm) => {
      setTerm(next);
      posthog?.capture(posthogEventsNames.content.glossaryView, {
        term: next.term,
        source: 'inline',
      });
    },
    [posthog]
  );

  const value = useMemo(() => ({ openGlossaryTerm }), [openGlossaryTerm]);

  return (
    <GlossaryTermContext.Provider value={value}>
      {children}
      <BottomSheet
        visible={term !== null}
        onClose={close}
        title={term?.term ?? 'Glossary'}
      >
        {term ? <GlossaryTermBody term={term} /> : null}
      </BottomSheet>
    </GlossaryTermContext.Provider>
  );
}
