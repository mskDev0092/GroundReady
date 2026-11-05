interface MemoryStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  key: (index: number) => string | null;
  readonly length: number;
}

interface InstalledStorage {
  memory: Map<string, string>;
  storage: MemoryStorage;
}

let installed: InstalledStorage | undefined;

/**
 * Minimal in-memory `localStorage` for testing the persisted Zustand store.
 * Call this before dynamically importing `@/store/useUserStore`.
 *
 * The same instance is reused across test files so the storage captured by the
 * Zustand persist middleware stays observable everywhere.
 */
export function installLocalStorage(): InstalledStorage {
  if (installed) return installed;

  const memory = new Map<string, string>();
  const storage: MemoryStorage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => {
      memory.set(key, value);
    },
    removeItem: (key) => {
      memory.delete(key);
    },
    clear: () => memory.clear(),
    key: (index) => [...memory.keys()][index] ?? null,
    get length() {
      return memory.size;
    },
  };

  (globalThis as unknown as { localStorage: MemoryStorage }).localStorage = storage;

  installed = { memory, storage };
  return installed;
}
