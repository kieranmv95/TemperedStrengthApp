import type { Article, GlossaryTerm } from "@/src/types/brief";
import { articles } from "./brief/articles";
import { glossary } from "./brief/glossary";
import { playlists } from "./brief/playlists";

// Helper functions
export const getFeaturedArticle = (): Article | undefined => {
  return articles.find((article) => article.isFeatured);
};

export const getArticleById = (id: string): Article | undefined => {
  return articles.find((article) => article.id === id);
};

export const searchGlossary = (query: string): GlossaryTerm[] => {
  const lowercaseQuery = query.toLowerCase();
  return glossary.filter(
    (term) =>
      term.term.toLowerCase().includes(lowercaseQuery) ||
      term.definition.toLowerCase().includes(lowercaseQuery),
  );
};

export const getGlossaryByCategory = (
  category: GlossaryTerm["category"],
): GlossaryTerm[] => {
  return glossary.filter((term) => term.category === category);
};

// Re-export types and data for consumers
export type { Article, GlossaryTerm, Playlist } from "@/src/types/brief";
export { articles, glossary, playlists };
