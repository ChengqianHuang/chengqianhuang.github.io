// Storage is optional. Keep progress usable for this page if access or quota fails.
export function createSafeStore(resolve = () => globalThis.localStorage) {
  const memory = new Map();
  return {
    get(key) {
      if (memory.has(key)) return memory.get(key);
      try { return resolve()?.getItem(key) ?? null; } catch { return null; }
    },
    set(key, value) {
      value = String(value);
      try { const storage=resolve(); if(!storage)throw Error("unavailable"); storage.setItem(key,value); memory.delete(key); return true; } catch { memory.set(key,value); return false; }
    }
  };
}
export const gameStore = createSafeStore();
