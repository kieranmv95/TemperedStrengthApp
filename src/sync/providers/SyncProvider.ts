export type SyncProviderAvailability =
  | { available: true }
  | { available: false; reason: string };

export type SyncProviderEntry = {
  key: string;
  value: string | null;
};

export type SyncProvider = {
  /**
   * Providers may be unavailable even on supported platforms, e.g. user not
   * signed into iCloud. The sync system should degrade to local-only.
   */
  getAvailability: () => Promise<SyncProviderAvailability>;

  getAllKeys: () => Promise<string[]>;
  getString: (key: string) => Promise<string | null>;
  setString: (key: string, value: string) => Promise<void>;
  remove: (key: string) => Promise<void>;
};

