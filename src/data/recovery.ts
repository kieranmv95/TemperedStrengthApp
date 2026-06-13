import { recoveryData } from '@/src/data/recovery_data';
import {
  recoveryMovements,
  type RecoveryMovementId,
} from '@/src/data/recovery_movements';
import type {
  Recovery,
  RecoveryBlock,
  RecoveryBlockRef,
  RecoveryMovement,
} from '@/src/types/recovery';

export function resolveRecoveryBlock(ref: RecoveryBlockRef): RecoveryBlock {
  const movement = recoveryMovements[ref.movementId as RecoveryMovementId] as
    | RecoveryMovement
    | undefined;
  if (!movement) {
    throw new Error(`Unknown recovery movement: ${ref.movementId}`);
  }

  return {
    name: movement.name,
    videoId: movement.videoId,
    instructions: movement.instructions,
    dose: ref.dose,
  };
}

export function resolveRecoveryBlocks(
  refs: RecoveryBlockRef[]
): RecoveryBlock[] {
  return refs.map(resolveRecoveryBlock);
}

export const recoveries: Recovery[] = recoveryData.map((flow) => ({
  ...flow,
  blocks: resolveRecoveryBlocks(flow.blocks),
}));

export function getRecoveryById(id: string): Recovery | undefined {
  return recoveries.find((r) => r.id === id);
}
