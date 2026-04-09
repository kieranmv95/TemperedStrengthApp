import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ICloudDomainName } from './domains';

const DIRTY_PREFIX = 'icloud_dirty__';

function dirtyKey(domain: ICloudDomainName): string {
  return `${DIRTY_PREFIX}${domain}`;
}

export async function markDirty(domain: ICloudDomainName): Promise<void> {
  await AsyncStorage.setItem(dirtyKey(domain), '1');
}

export async function clearDirty(domain: ICloudDomainName): Promise<void> {
  await AsyncStorage.removeItem(dirtyKey(domain));
}

export async function isDirty(domain: ICloudDomainName): Promise<boolean> {
  const v = await AsyncStorage.getItem(dirtyKey(domain));
  return v === '1';
}

export async function listDirty(domains: ICloudDomainName[]): Promise<ICloudDomainName[]> {
  const pairs = await AsyncStorage.multiGet(domains.map(dirtyKey));
  const out: ICloudDomainName[] = [];
  for (let i = 0; i < domains.length; i++) {
    if (pairs[i]?.[1] === '1') out.push(domains[i]);
  }
  return out;
}

