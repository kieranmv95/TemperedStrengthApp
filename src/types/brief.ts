export type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Methodology' | 'Nutrition' | 'Recovery' | 'Mindset' | 'Technique';
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
