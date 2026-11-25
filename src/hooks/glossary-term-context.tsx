import type { GlossaryTerm } from '@/src/types/brief';
import { createContext, useContext } from 'react';

export type GlossaryTermContextValue = {
  openGlossaryTerm: (term: GlossaryTerm) => void;
};

export const GlossaryTermContext =
  createContext<GlossaryTermContextValue | null>(null);

const noopOpen = () => {};

export function useGlossaryTerm(): GlossaryTermContextValue {
  return useContext(GlossaryTermContext) ?? { openGlossaryTerm: noopOpen };
}
