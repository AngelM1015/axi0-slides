// axi0-slides: the one way this editor talks to the page that frames it (window.parent), by postMessage only.
//
// The editor runs in a sandboxed frame without allow-same-origin: its origin is opaque, so it cannot read the page's
// globals, DOM, storage or cookies, and the page cannot reach into it either. Messages are plain objects
// { axi0: 'axi0-slides', type, ... } and go only to the origin these files were served from (the page's own).
//
// From the page:  load { json }                 a deck (the JSON below) to show; the undo history starts again
//                 theme { mode, vars }          'light' | 'dark' and colour values (names in VARS)
//                 locale { locale }             a BCP 47 tag for the document language
//                 command { name }              'present' | 'export-pptx' | 'export-dialog'
//                 flush {}                      send what changed now (the page answers with its save)
// To the page:    ready { version }             once, when the editor can take a deck
//                 change { json }               the deck after an edit (at most every DEBOUNCE_MS)
//                 flushed {}                    after a flush
//
// A deck is upstream's own JSON export ({ title, width, height, theme, slides }) plus { v: 2, kind: 'pptist' }.
import { useMainStore, useSlidesStore, useSnapshotStore } from '@/store'
import { db } from '@/utils/database'
import useScreening from '@/hooks/useScreening'
import useExport from '@/hooks/useExport'
import { nanoid } from 'nanoid'

const TAG = 'axi0-slides'
const VERSION = 1
const DEBOUNCE_MS = 400
const SERVED = new URL(window.location.href).origin
const VARS = ['bg', 'panel', 'field', 'hover', 'raise', 'line', 'line2', 'ink', 'text', 'soft', 'mute', 'accent', 'accent-hover', 'on-accent', 'danger', 'font']
const VALUE = /^[#\w\s.,%()"'+-]{1,160}$/

const post = (type: string, data: Record<string, unknown> = {}) => {
  if (window.parent === window) return
  window.parent.postMessage({ axi0: TAG, type, ...data }, SERVED)
}

export const startBridge = () => {
  const slidesStore = useSlidesStore()
  const snapshotStore = useSnapshotStore()
  const mainStore = useMainStore()
  const { enterScreeningFromStart } = useScreening()
  const { exportPPTX } = useExport()

  let last = ''
  let timer = 0
  let loaded = false

  const deckJSON = () => JSON.stringify({
    v: 2,
    kind: 'pptist',
    title: slidesStore.title,
    width: slidesStore.viewportSize,
    height: slidesStore.viewportSize * slidesStore.viewportRatio,
    theme: slidesStore.theme,
    slides: slidesStore.slides,
  })

  const sendChange = () => {
    window.clearTimeout(timer)
    timer = 0
    if (!loaded) return
    const json = deckJSON()
    if (json === last) return
    last = json
    post('change', { json })
  }

  const load = async (json: string) => {
    let d: any
    try {
      d = JSON.parse(json)
    }
    catch {
      return
    }
    if (!d || typeof d !== 'object' || !Array.isArray(d.slides)) return
    loaded = false
    const width = Number(d.width) > 0 ? Number(d.width) : 1000
    const height = Number(d.height) > 0 ? Number(d.height) : width * 0.5625
    slidesStore.setTitle(typeof d.title === 'string' ? d.title : '')
    slidesStore.setViewportSize(width)
    slidesStore.setViewportRatio(height / width)
    if (d.theme && typeof d.theme === 'object') slidesStore.setTheme(d.theme)
    slidesStore.setSlides(d.slides.length ? d.slides : [{ id: nanoid(10), elements: [], background: { type: 'solid', color: '#ffffff' } }])
    slidesStore.updateSlideIndex(0)
    mainStore.setActiveElementIdList([])
    await db.snapshots.clear()
    await snapshotStore.initSnapshotDatabase()
    last = deckJSON()
    loaded = true
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

  slidesStore.$subscribe(() => {
    if (!loaded) return
    if (!timer) timer = window.setTimeout(sendChange, DEBOUNCE_MS)
  })

  window.addEventListener('message', e => {
    if (e.source !== window.parent || e.origin !== SERVED) return
    const m = e.data
    if (!m || typeof m !== 'object' || m.axi0 !== TAG || typeof m.type !== 'string') return
    if (m.type === 'load' && typeof m.json === 'string') load(m.json)
    else if (m.type === 'theme') theme(m.mode, m.vars)
    else if (m.type === 'locale' && typeof m.locale === 'string' && /^[a-zA-Z]{2,3}(-[a-zA-Z0-9]{1,8}){0,3}$/.test(m.locale)) document.documentElement.lang = m.locale
    else if (m.type === 'flush') {
      sendChange()
      post('flushed')
    }
    else if (m.type === 'command' && loaded) {
      if (m.name === 'present') enterScreeningFromStart()
      else if (m.name === 'export-pptx') exportPPTX(slidesStore.slides, true, true)
      else if (m.name === 'export-dialog') mainStore.setDialogForExport('pptx')
    }
  })

  // the last edit is not lost when the page takes the frame away
  window.addEventListener('pagehide', sendChange)
  post('ready', { version: VERSION })
}
