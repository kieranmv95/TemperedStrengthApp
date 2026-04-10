import type { SyncManager } from './SyncManager';

let manager: SyncManager | null = null;

export function setRuntimeSyncManager(next: SyncManager | null): void {
  manager = next;
}

export function getRuntimeSyncManager(): SyncManager | null {
  return manager;
}

