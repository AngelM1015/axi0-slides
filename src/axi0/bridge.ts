// axi0-slides: the one way this editor talks to the page that frames it (window.parent), by postMessage only.
//
// The editor runs in a sandboxed frame without allow-same-origin: its origin is opaque, so it cannot read the page's
// globals, DOM, storage or cookies, and the page cannot reach into it either. Messages are plain objects
// { axi0: 'axi0-slides', type, ... } and go only to the origin these files were served from (the page's own).
//
// From the page:  load { json, n? }             a deck (the JSON below) to show; the undo history starts again
//                 remote { json, n, ack }       the deck as the room has it now (a shared deck): applied in place,
//                                               the slide on screen, the selection and the typing in a text box kept;
//                                               ignored when it was made before this editor's change number `ack`+1
//                                               reached the page (the page sends a newer one)
//                 mode { edit, live }           edit false: view only (the slide show, nothing sent back);
//                                               live true: undo and redo are the page's (they undo only this person's
//                                               changes, never someone else's)
//                 theme { mode, vars }          'light' | 'dark' and colour values (names in VARS)
//                 locale { locale }             a BCP 47 tag for the document language
//                 command { name, slide? }      'present' | 'exit-present' (the page holds the frame full screen)
//                                               'export-pptx' | 'export-dialog' | 'goto' (slide id: show that slide)
//                 import { file }               a .pptx or the editor's .json: it replaces the deck's slides
//                 flush {}                      send what changed now (the page answers with its save)
// To the page:    ready { version }             once, when the editor can take a deck
//                 change { json, base, k }      the deck after an edit (at most every DEBOUNCE_MS); base = the n of
//                                               the last load/remote applied here, k = this editor's change number
//                 flushed {}                    after a flush
//                 screening { on }              the slide show started or ended
//                 where { slide, i, els, screening }  the slide on screen (id, index) and the selected elements
//                 undo {} | redo {}             in a live deck: the person asked to undo or redo
//
// A deck is upstream's own JSON export ({ title, width, height, theme, slides }) plus { v: 2, kind: 'pptist' }.
// What the editor changes by itself is not an edit: a text box's automatic height (or width, for vertical text)
// follows its text when it is drawn, so opening a deck changes nothing; such a change goes along with the next real one.
import { watch } from 'vue'
import { useMainStore, useScreenStore, useSlidesStore, useSnapshotStore } from '@/store'
import { db } from '@/utils/database'
import useImport from '@/hooks/useImport'
import useExport from '@/hooks/useExport'
import { nanoid } from 'nanoid'

const TAG = 'axi0-slides'
const VERSION = 2
const DEBOUNCE_MS = 400
const SERVED = new URL(window.location.href).origin
const VARS = ['bg', 'panel', 'field', 'hover', 'raise', 'line', 'line2', 'ink', 'text', 'soft', 'mute', 'accent', 'accent-hover', 'on-accent', 'danger', 'font']
const VALUE = /^[#\w\s.,%()"'+-]{1,160}$/

const post = (type: string, data: Record<string, unknown> = {}) => {
  if (window.parent === window) return
  window.parent.postMessage({ axi0: TAG, type, ...data }, SERVED)
}

// the deck without what the editor sets by itself (the automatic side of text boxes)
const signature = (json: string) => JSON.stringify(JSON.parse(json), function (this: any, k: string, v: unknown) {
  if (this && this.type === 'text' && !this.fixedHeight && ((k === 'height' && !this.vertical) || (k === 'width' && this.vertical))) return undefined
  return v
})

export const startBridge = () => {
  const slidesStore = useSlidesStore()
  const snapshotStore = useSnapshotStore()
  const mainStore = useMainStore()
  const screenStore = useScreenStore()
  const { exportPPTX } = useExport()
  const { importPPTXFile, importJSON } = useImport()

  let last = ''          // the deck as last sent or received
  let lastSig = ''       // ...and its signature
  let timer = 0
  let loaded = false
  let base = 0           // the n of the last deck from the page applied here
  let k = 0              // the number of this editor's last change sent
  let editable = true
  let live = false

  const deckJSON = () => JSON.stringify({
    v: 2,
    kind: 'pptist',
    title: slidesStore.title,
    width: slidesStore.viewportSize,
    height: slidesStore.viewportSize * slidesStore.viewportRatio,
    theme: slidesStore.theme,
    slides: slidesStore.slides,
  })
  const settle = () => {
    last = deckJSON()
    lastSig = signature(last)
  }

  // true when a change went to the page
  const sendChange = () => {
    window.clearTimeout(timer)
    timer = 0
    if (!loaded || !editable) return false
    const json = deckJSON()
    if (json === last) return false
    const sig = signature(json)
    if (sig === lastSig) return false
    last = json
    lastSig = sig
    post('change', { json, base, k: ++k })
    return true
  }

  const blank = () => [{ id: nanoid(10), elements: [], background: { type: 'solid', color: '#ffffff' } }]

  const load = async (json: string, n: unknown) => {
    let d: any
    try {
      d = JSON.parse(json)
    }
    catch {
      return
    }
    if (!d || typeof d !== 'object' || !Array.isArray(d.slides)) return
    loaded = false
    window.clearTimeout(timer)
    timer = 0
    const width = Number(d.width) > 0 ? Number(d.width) : 1000
    const height = Number(d.height) > 0 ? Number(d.height) : width * 0.5625
    slidesStore.setTitle(typeof d.title === 'string' ? d.title : '')
    slidesStore.setViewportSize(width)
    slidesStore.setViewportRatio(height / width)
    if (d.theme && typeof d.theme === 'object') slidesStore.setTheme(d.theme)
    slidesStore.setSlides(d.slides.length ? d.slides : blank())
    slidesStore.updateSlideIndex(0)
    mainStore.setActiveElementIdList([])
    await db.snapshots.clear()
    await snapshotStore.initSnapshotDatabase()
    base = Number.isInteger(n) ? (n as number) : 0
    settle()
    loaded = true
    where()
  }

  // the room's deck, in place: unchanged slides keep their objects (nothing redrawn), the slide on screen stays
  const remote = (json: string, n: unknown, ack: unknown) => {
    if (!loaded || !Number.isInteger(n)) return
    if (typeof ack === 'number' && ack < k) return
    if (timer && sendChange()) return
    let d: any
    try {
      d = JSON.parse(json)
    }
    catch {
      return
    }
    if (!d || typeof d !== 'object' || !Array.isArray(d.slides)) return
    if (typeof d.title === 'string' && d.title !== slidesStore.title) slidesStore.setTitle(d.title)
    const width = Number(d.width) > 0 ? Number(d.width) : slidesStore.viewportSize
    const height = Number(d.height) > 0 ? Number(d.height) : width * slidesStore.viewportRatio
    if (width !== slidesStore.viewportSize) slidesStore.setViewportSize(width)
    if (Math.abs(height / width - slidesStore.viewportRatio) > 1e-9) slidesStore.setViewportRatio(height / width)
    if (d.theme && typeof d.theme === 'object' && JSON.stringify(d.theme) !== JSON.stringify(slidesStore.theme)) slidesStore.setTheme(d.theme)
    const now = slidesStore.slides
    const byId = new Map(now.map(s => [s.id, s]))
    const onScreen = now[slidesStore.slideIndex]?.id
    const next = (d.slides.length ? d.slides : blank()).map((s: any) => {
      const o = byId.get(s && s.id)
      return o && JSON.stringify(o) === JSON.stringify(s) ? o : s
    })
    if (next.length !== now.length || next.some((s: any, i: number) => s !== now[i])) {
      slidesStore.setSlides(next)
      const i = next.findIndex((s: any) => s.id === onScreen)
      slidesStore.updateSlideIndex(i >= 0 ? i : Math.min(slidesStore.slideIndex, next.length - 1))
      const ids = new Set((next[slidesStore.slideIndex]?.elements || []).map((e: any) => e.id))
      const keep = mainStore.activeElementIdList.filter(id => ids.has(id))
      if (keep.length !== mainStore.activeElementIdList.length) mainStore.setActiveElementIdList(keep)
    }
    base = n as number
    settle()
  }

  const theme = (mode: unknown, vars: unknown) => {
    const root = document.documentElement
    root.dataset.theme = mode === 'dark' ? 'dark' : 'light'
    if (!vars || typeof vars !== 'object') return
    for (const name of VARS) {
      const v = (vars as Record<string, unknown>)[name]
      if (typeof v === 'string' && VALUE.test(v) && !/url\s*\(/i.test(v)) root.style.setProperty('--ax-' + name, v)
    }
  }

  // view only: the slide show, kept on; live: undo and redo go to the page
  const unDo = snapshotStore.unDo.bind(snapshotStore)
  const reDo = snapshotStore.reDo.bind(snapshotStore)
  snapshotStore.unDo = async () => {
    if (live) post('undo')
    else await unDo()
  }
  snapshotStore.reDo = async () => {
    if (live) post('redo')
    else await reDo()
  }
  const setMode = (edit: unknown, isLive: unknown) => {
    editable = edit !== false
    live = isLive === true
    if (!editable && !screenStore.screening) screenStore.setScreening(true)
  }

  // where this person is: the page shows it to the others (a shared deck)
  let whereKey = ''
  const where = () => {
    if (!loaded) return
    const s = slidesStore.slides[slidesStore.slideIndex]
    const msg = { slide: s ? s.id : '', i: slidesStore.slideIndex, els: mainStore.activeElementIdList.slice(0, 8), screening: !!screenStore.screening }
    const key = JSON.stringify(msg)
    if (key === whereKey) return
    whereKey = key
    post('where', msg)
  }
  watch(() => [slidesStore.slideIndex, mainStore.activeElementIdList.join(','), screenStore.screening], where)

  slidesStore.$subscribe(() => {
    if (!loaded) return
    if (!timer) timer = window.setTimeout(sendChange, DEBOUNCE_MS)
  })

  window.addEventListener('message', e => {
    if (e.source !== window.parent || e.origin !== SERVED) return
    const m = e.data
    if (!m || typeof m !== 'object' || m.axi0 !== TAG || typeof m.type !== 'string') return
    if (m.type === 'load' && typeof m.json === 'string') load(m.json, m.n)
    else if (m.type === 'remote' && typeof m.json === 'string') remote(m.json, m.n, m.ack)
    else if (m.type === 'mode') setMode(m.edit, m.live)
    else if (m.type === 'theme') theme(m.mode, m.vars)
    else if (m.type === 'locale' && typeof m.locale === 'string' && /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{1,8}){0,3}$/.test(m.locale)) document.documentElement.lang = m.locale
    else if (m.type === 'import' && loaded && editable && m.file instanceof File) {
      if (/\.pptx$/i.test(m.file.name)) importPPTXFile([m.file], { cover: true })
      else if (/\.json$/i.test(m.file.name)) importJSON([m.file], true)
    }
    else if (m.type === 'flush') {
      sendChange()
      post('flushed')
    }
    else if (m.type === 'command' && loaded) {
      if (m.name === 'present') {
        slidesStore.updateSlideIndex(0)
        screenStore.setScreening(true)
      }
      else if (m.name === 'exit-present') {
        if (editable) screenStore.setScreening(false)
      }
      else if (m.name === 'goto' && typeof m.slide === 'string') {
        const i = slidesStore.slides.findIndex(s => s.id === m.slide)
        if (i >= 0 && i !== slidesStore.slideIndex) slidesStore.updateSlideIndex(i)
      }
      else if (m.name === 'export-pptx') exportPPTX(slidesStore.slides, true, true)
      else if (m.name === 'export-dialog') mainStore.setDialogForExport('pptx')
    }
  })

  watch(() => screenStore.screening, on => {
    post('screening', { on })
    if (!on && !editable) screenStore.setScreening(true)
  })

  // the last edit is not lost when the page takes the frame away
  window.addEventListener('pagehide', sendChange)
  post('ready', { version: VERSION })
}
