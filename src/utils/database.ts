// axi0-slides: the undo history and the pen drawings of a presentation live in this document's memory only. The editor
// runs in a sandboxed frame with an opaque origin, where IndexedDB and localStorage do not exist; the page that frames
// it keeps decks (sealed) and nothing here outlives the frame. Same calls as the Dexie tables they replace.
import type { Slide } from '@/types/slides'

export interface writingBoardImg {
  id: string
  dataURL: string
}

export interface Snapshot {
  id: number
  index: number
  slides: Slide[]
}

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x))

class MemoryTable<T extends { id: any }> {
  private rows: T[] = []
  private next = 1
  constructor(private autoIncrement: boolean) {}
  async add(row: Omit<T, 'id'> | T) {
    const r = clone(row) as T
    if (this.autoIncrement) (r as any).id = this.next++
    this.rows.push(r)
    return r.id
  }
  orderBy(_key: 'id') {
    const sorted = () => [...this.rows].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    return {
      keys: async () => sorted().map(r => r.id),
      toArray: async () => clone(sorted()),
    }
  }
  where(key: keyof T) {
    return { equals: (v: any) => ({ toArray: async () => clone(this.rows.filter(r => r[key] === v)) }) }
  }
  async update(keyOrRow: any, changes: Partial<T>) {
    const id = keyOrRow && typeof keyOrRow === 'object' ? keyOrRow.id : keyOrRow
    const r = this.rows.find(x => x.id === id)
    if (!r) return 0
    Object.assign(r, clone(changes))
    return 1
  }
  async bulkDelete(ids: any[]) {
    const drop = new Set(ids)
    this.rows = this.rows.filter(r => !drop.has(r.id))
  }
  async clear() {
    this.rows = []
  }
}

export const deleteDiscardedDB = async () => undefined

const db = {
  snapshots: new MemoryTable<Snapshot>(true),
  writingBoardImgs: new MemoryTable<writingBoardImg>(false),
}

export { db }
