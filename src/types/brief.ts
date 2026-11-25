export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  category?: 'Movements' | 'Equipment' | 'Training' | 'Nutrition' | 'General';
};
