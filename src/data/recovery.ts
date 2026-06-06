import { recoveryData } from '@/src/data/recovery_data';
import type { Recovery } from '@/src/types/recovery';

export const recoveries: Recovery[] = recoveryData;

export function getRecoveryById(id: string): Recovery | undefined {
  return recoveries.find((r) => r.id === id);
}
