import type { GlossaryTerm } from '@/src/types/brief';

export const searchGlossary = (
  terms: GlossaryTerm[],
  query: string
): GlossaryTerm[] => {
  const lowercaseQuery = query.toLowerCase();
  return terms.filter(
    (term) =>
      term.term.toLowerCase().includes(lowercaseQuery) ||
      term.definition.toLowerCase().includes(lowercaseQuery)
  );
};

export const getGlossaryByCategory = (
  terms: GlossaryTerm[],
  category: GlossaryTerm['category']
): GlossaryTerm[] => {
  return terms.filter((term) => term.category === category);
};

export type { Article, ArticleCategory, ArticleListItem, GlossaryTerm } from '@/src/types/brief';
