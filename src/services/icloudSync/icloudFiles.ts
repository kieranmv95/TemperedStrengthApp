import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

type ICloudModule = {
  createDirAsync: (path: string) => Promise<unknown>;
  defaultICloudContainerPath: string | null;
  downloadFileAsync: (path: string, destinationDir: string) => Promise<string>;
  isExistAsync: (path: string, isDirectory: boolean) => Promise<boolean>;
  isICloudAvailableAsync: () => Promise<boolean>;
  uploadFileAsync: (args: { destinationPath: string; filePath: string }) => Promise<unknown>;
};

export class ICloudUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ICloudUnavailableError';
  }
}

const MOCK_PREFIX = 'mock_icloud__';

let cachedICloudModule: ICloudModule | null | undefined;

function shouldForceMockICloud(): boolean {
  // In Expo Go the native module will never be present; avoid requiring it to prevent redbox noise.
  const isExpoGo = Constants.appOwnership === 'expo';
  if (__DEV__ && isExpoGo) return true;

  return false;
}

function mockKey(relativePath: string): string {
  return `${MOCK_PREFIX}${relativePath}`;
}

async function mockReadJsonAsync<T>(relativePath: string): Promise<ReadJsonResult<T>> {
  try {
    const raw = await AsyncStorage.getItem(mockKey(relativePath));
    if (!raw) return { ok: true, value: null };
    return { ok: true, value: JSON.parse(raw) as T };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

async function mockWriteJsonAsync(relativePath: string, json: unknown): Promise<{ ok: true } | { ok: false; error: Error }> {
  try {
    await AsyncStorage.setItem(mockKey(relativePath), JSON.stringify(json));
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

async function loadICloudModuleAsync(): Promise<ICloudModule | null> {
  if (cachedICloudModule !== undefined) return cachedICloudModule ?? null;

  try {
    const mod = await import('@oleg_svetlichnyi/expo-icloud-storage');
    cachedICloudModule = {
      createDirAsync: mod.createDirAsync,
      defaultICloudContainerPath: mod.defaultICloudContainerPath ?? null,
      downloadFileAsync: mod.downloadFileAsync,
      isExistAsync: mod.isExistAsync,
      isICloudAvailableAsync: mod.isICloudAvailableAsync,
      uploadFileAsync: mod.uploadFileAsync,
    };
    return cachedICloudModule;
  } catch {
    cachedICloudModule = null;
    return null;
  }
}

type Backend =
  | { kind: 'mock' }
  | { kind: 'icloud'; mod: ICloudModule; basePath: string };

async function getBackendAsync(): Promise<Backend> {
  if (shouldForceMockICloud()) return { kind: 'mock' };

  const mod = await loadICloudModuleAsync();
  if (!mod) {
    if (__DEV__) return { kind: 'mock' };
    throw new ICloudUnavailableError('iCloud module is not available in this build.');
  }

  const basePath = mod.defaultICloudContainerPath ?? null;
  if (!basePath) {
    if (__DEV__) return { kind: 'mock' };
    throw new ICloudUnavailableError('iCloud container path is unavailable.');
  }

  return { kind: 'icloud', mod, basePath };
}

function remoteFullPath(args: { basePath: string; relativePath: string }): string {
  return `${args.basePath}/Documents/${args.relativePath}`;
}

async function ensureLocalTempDir(): Promise<string> {
  const base = FileSystem.cacheDirectory ?? FileSystem.documentDirectory;
  if (!base) {
    throw new Error('No cache or document directory available.');
  }
  const dir = `${base}icloud-sync/`;
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  return dir;
}

async function writeTempFile(args: {
  filename: string;
  contents: string;
}): Promise<string> {
  const dir = await ensureLocalTempDir();
  const path = `${dir}${args.filename}`;
  await FileSystem.writeAsStringAsync(path, args.contents);
  return path;
}

async function ensureRemoteDirectoryForPath(relativePath: string): Promise<void> {
  const backend = await getBackendAsync();
  if (backend.kind !== 'icloud') return;

  const parts = relativePath.split('/').slice(0, -1);
  if (parts.length === 0) return;

  let current = '';
  for (const part of parts) {
    current = current ? `${current}/${part}` : part;
    await backend.mod.createDirAsync(current);
  }
}

export type ReadJsonResult<T> = { ok: true; value: T | null } | { ok: false; error: Error };

export async function isICloudReadyAsync(): Promise<boolean> {
  try {
    const backend = await getBackendAsync();
    if (backend.kind === 'mock') return true;

    const available = await backend.mod.isICloudAvailableAsync();
    return Boolean(available && backend.basePath);
  } catch {
    return false;
  }
}

export async function readRemoteJsonAsync<T>(args: {
  relativePath: string;
}): Promise<ReadJsonResult<T>> {
  try {
    const backend = await getBackendAsync();
    if (backend.kind === 'mock') return mockReadJsonAsync<T>(args.relativePath);

    const available = await backend.mod.isICloudAvailableAsync();
    if (!available) {
      return { ok: false, error: new ICloudUnavailableError('iCloud is not available.') };
    }

    const exists = await backend.mod.isExistAsync(args.relativePath, false);
    if (!exists) {
      return { ok: true, value: null };
    }

    const downloadDir = await ensureLocalTempDir();
    const fullPath = remoteFullPath({
      basePath: backend.basePath,
      relativePath: args.relativePath,
    });
    const downloadedPath = await backend.mod.downloadFileAsync(fullPath, downloadDir);
    const raw = await FileSystem.readAsStringAsync(downloadedPath);
    return { ok: true, value: JSON.parse(raw) as T };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

export async function writeRemoteJsonAsync(args: {
  relativePath: string;
  json: unknown;
}): Promise<{ ok: true } | { ok: false; error: Error }> {
  try {
    const backend = await getBackendAsync();
    if (backend.kind === 'mock') return mockWriteJsonAsync(args.relativePath, args.json);

    const available = await backend.mod.isICloudAvailableAsync();
    if (!available) {
      return { ok: false, error: new ICloudUnavailableError('iCloud is not available.') };
    }

    await ensureRemoteDirectoryForPath(args.relativePath);
    const contents = JSON.stringify(args.json);
    const filePath = await writeTempFile({
      filename: args.relativePath.replaceAll('/', '__'),
      contents,
    });

    await backend.mod.uploadFileAsync({
      destinationPath: args.relativePath,
      filePath,
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

