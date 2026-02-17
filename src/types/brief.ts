export type Article = {
  id: string;
  title: string;
  subtitle: string;
  category: 'Methodology' | 'Nutrition' | 'Recovery' | 'Mindset' | 'Technique';
  readTime: number; // in minutes
  image: string;
  content: string;
  isFeatured?: boolean;
};

export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  category?: 'Movements' | 'Equipment' | 'Training' | 'Nutrition' | 'General';
};

export type Playlist = {
  id: string;
  title: string;
  subtitle: string;
  artworkUrl: string;
  itunesUrl: string;
};
