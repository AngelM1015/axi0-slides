// axi0-slides: what upstream kept in localStorage (recent colours) lives in memory: the editor's opaque origin has no storage.
const items = new Map<string, string>()
export const memoryStorage = {
  getItem: (k: string) => (items.has(k) ? (items.get(k) as string) : null),
  setItem: (k: string, v: string) => { items.set(k, String(v)) },
  removeItem: (k: string) => { items.delete(k) },
}
