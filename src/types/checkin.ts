export type BehaviourResponseType =
  | 'boolean'
  | 'scale_1_5'
  | 'choice'
  | 'quantity';

export type BehaviourCategory =
  | 'training'
  | 'nutrition'
  | 'movement'
  | 'sleep_recovery'
  | 'mind'
  | 'body'
  | 'womens_health';

export type CatalogueBehaviour = {
  id: string;
  category: BehaviourCategory;
  label: string;
  description?: string;
  responseType: BehaviourResponseType;
  options?: string[];
  unit?: string;
  quantityStep?: number;
  quantityMax?: number;
  scaleLabels?: { low: string; high: string };
  goalable: boolean;
  goalDirection?: 'at_least' | 'at_most';
  autofillable: boolean;
  sensitive: boolean;
  sortOrder: number;
  deprecated: boolean;
};

export type CatalogueCategory = {
  id: BehaviourCategory;
  label: string;
  sortOrder: number;
  sensitive: boolean;
};

export type BehaviourCatalogue = {
  catalogueVersion: number;
  updatedAt: string;
  weekStartsOn: number;
  categories: CatalogueCategory[];
  behaviours: CatalogueBehaviour[];
};

export type BehaviourEntrySource = 'manual' | 'auto' | 'imported';

export type BehaviourEntry = {
  date: string;
  behaviourId: string;
  value: boolean | number | string;
  loggedAt: string;
  source: BehaviourEntrySource;
};

export type TrackedBehaviour = {
  id: string;
  behaviourId: string;
  sortOrder: number;
  sensitive: boolean;
};

export type CheckinSettings = {
  womensHealthVisible: boolean;
  healthSyncOptIn: boolean;
  lapsePending: boolean;
  editableBehaviourIds: string[] | null;
  editableSupplementId: string | null;
};
