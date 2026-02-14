export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: 'Methodology' | 'Nutrition' | 'Recovery' | 'Mindset' | 'Technique';
  readTime: number; // in minutes
  image: string;
  content: string;
  isFeatured?: boolean;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category?: 'Movements' | 'Equipment' | 'Training' | 'Nutrition' | 'General';
}

export interface Playlist {
  id: string;
  title: string;
  subtitle: string;
  artworkUrl: string;
  itunesUrl: string;
}
