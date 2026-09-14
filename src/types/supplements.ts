export type SupplementForm =
  | 'capsule'
  | 'tablet'
  | 'powder'
  | 'liquid'
  | 'gummy'
  | 'other';

export type SupplementDoseUnit =
  | 'g'
  | 'mg'
  | 'mcg'
  | 'ml'
  | 'IU'
  | 'capsule'
  | 'tablet'
  | 'scoop'
  | 'drop';

export type SupplementStatus = 'active' | 'paused' | 'archived';

export type SupplementScheduleType =
  | 'daily'
  | 'specific_days'
  | 'every_n_days'
  | 'cycle'
  | 'as_needed';

export type SupplementSchedule = {
  type: SupplementScheduleType;
  daysOfWeek?: number[];
  intervalDays?: number;
  cycleOnDays?: number;
  cycleOffDays?: number;
  times: string[];
  startDate: string;
  endDate?: string;
};

export type Supplement = {
  id: string;
  name: string;
  brand?: string;
  form: SupplementForm;
  doseAmount: number;
  doseUnit: SupplementDoseUnit;
  notes?: string;
  schedule: SupplementSchedule;
  remindersEnabled: boolean;
  status: SupplementStatus;
  createdAt: string;
};

export type SupplementLogStatus = 'taken' | 'skipped';

export type SupplementLog = {
  date: string;
  supplementId: string;
  scheduledTime: string;
  status: SupplementLogStatus;
  actionedAt: string;
};

export type DerivedDoseStatus = 'pending' | 'taken' | 'skipped' | 'missed';

export type DerivedSupplementDose = {
  supplementId: string;
  name: string;
  scheduledTime: string;
  date: string;
  status: DerivedDoseStatus;
  doseAmount: number;
  doseUnit: SupplementDoseUnit;
};

export type SupplementSeed = {
  name: string;
  form: SupplementForm;
  doseAmount: number;
  doseUnit: SupplementDoseUnit;
};
