export type ArticleCategory =
  | 'Methodology'
  | 'Nutrition'
  | 'Recovery'
  | 'Mindset'
  | 'Technique';

// Returned by GET /api/articles (list) — no id or content
export type ArticleListItem = {
  slug: string;
  title: string;
  subtitle: string;
  category: ArticleCategory;
  readTime: number; // in minutes
  image: string;
};

// Returned by GET /api/articles/[slug] (detail) — full article
export type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ArticleCategory;
  readTime: number; // in minutes
  image: string;
  content: string;
};

export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  category?: 'Movements' | 'Equipment' | 'Training' | 'Nutrition' | 'General';
};
