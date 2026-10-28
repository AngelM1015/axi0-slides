# Third-party notices: axi0-slides

What this repository ships or runs that other people wrote, with each licence. Our own code is the axi0 team's and is not listed here. The README's "Built on" section says the same in prose.

Generated 2026-10-28 by `third-party-notices.mjs` (axi0-network, `scripts/`) from npm lockfiles (production packages, through `npm sbom`), vendored folders and their licence files. The tables "Taken projects", "Vendored folders" (project, version, licence, link) and "Android libraries" are kept by hand; the package and crate tables are rebuilt on every run.

## Taken projects

| Project | Version | Licence | Link | How we take it | Our part |
|---|---|---|---|---|---|
| PPTist | commit 04e06cb | AGPL-3.0 | https://github.com/pipipi-pikachu/PPTist | forked: the whole editor (FORK.md dates every change) | no outside requests, the postMessage bridge, the theme, English interface |
| English interface (DmanADYP/PPTist) | commit ae61a1c | AGPL-3.0 | https://github.com/DmanADYP/PPTist | cherry-picked unchanged | - |
| Instrument Sans and the Latin fonts PPTist ships | - | OFL-1.1 | https://github.com/google/fonts | the editor's fonts (CJK and non-OFL fonts dropped) | - |

## Vendored folders

Folders and files of other projects kept in this repository, each with its licence text.

| Folder | Project | Version | Licence | Link | Licence text |
|---|---|---|---|---|---|
| `src/assets/fonts` | InstrumentSans (fonts) | - | OFL-1.1 | - | `src/assets/fonts/OFL-InstrumentSans.txt` |

## npm packages: `package-lock.json`

Role: bundled into the editor (`./build.sh`)

77 packages, production only (npm sbom --omit dev --package-lock-only).

| Package | Version | Licence |
|---|---|---|
| [@popperjs/core](https://www.npmjs.com/package/@popperjs/core/v/2.11.8) | 2.11.8 | - |
| [@vue/devtools-api](https://www.npmjs.com/package/@vue/devtools-api/v/7.7.2) | 7.7.2 | - |
| [@vue/devtools-kit](https://www.npmjs.com/package/@vue/devtools-kit/v/7.7.2) | 7.7.2 | - |
| [@vue/devtools-shared](https://www.npmjs.com/package/@vue/devtools-shared/v/7.7.2) | 7.7.2 | - |
| [animate.css](https://www.npmjs.com/package/animate.css/v/4.1.1) | 4.1.1 | - |
| [asynckit](https://www.npmjs.com/package/asynckit/v/0.4.0) | 0.4.0 | - |
| [axios](https://www.npmjs.com/package/axios/v/1.7.9) | 1.7.9 | - |
| [birpc](https://www.npmjs.com/package/birpc/v/0.2.19) | 0.2.19 | - |
| [clipboard](https://www.npmjs.com/package/clipboard/v/2.0.11) | 2.0.11 | - |
| [combined-stream](https://www.npmjs.com/package/combined-stream/v/1.0.8) | 1.0.8 | - |
| [copy-anything](https://www.npmjs.com/package/copy-anything/v/3.0.5) | 3.0.5 | - |
| [core-util-is](https://www.npmjs.com/package/core-util-is/v/1.0.3) | 1.0.3 | - |
| [crypto-js](https://www.npmjs.com/package/crypto-js/v/4.2.0) | 4.2.0 | - |
| [delayed-stream](https://www.npmjs.com/package/delayed-stream/v/1.0.0) | 1.0.0 | - |
| [delegate](https://www.npmjs.com/package/delegate/v/3.2.0) | 3.2.0 | - |
| [dexie](https://www.npmjs.com/package/dexie/v/4.0.11) | 4.0.11 | - |
| [echarts](https://www.npmjs.com/package/echarts/v/6.0.0) | 6.0.0 | - |
| [file-saver](https://www.npmjs.com/package/file-saver/v/2.0.5) | 2.0.5 | - |
| [follow-redirects](https://www.npmjs.com/package/follow-redirects/v/1.15.9) | 1.15.9 | - |
| [form-data](https://www.npmjs.com/package/form-data/v/4.0.1) | 4.0.1 | - |
| [good-listener](https://www.npmjs.com/package/good-listener/v/1.2.2) | 1.2.2 | - |
| [hfmath](https://www.npmjs.com/package/hfmath/v/0.0.2) | 0.0.2 | - |
| [hookable](https://www.npmjs.com/package/hookable/v/5.5.3) | 5.5.3 | - |
| [html-to-image](https://www.npmjs.com/package/html-to-image/v/1.11.13) | 1.11.13 | - |
| [https](https://www.npmjs.com/package/https/v/1.0.0) | 1.0.0 | - |
| [image-size](https://www.npmjs.com/package/image-size/v/1.1.0) | 1.1.0 | - |
| [immediate](https://www.npmjs.com/package/immediate/v/3.0.6) | 3.0.6 | - |
| [is-what](https://www.npmjs.com/package/is-what/v/4.1.16) | 4.1.16 | - |
| [isarray](https://www.npmjs.com/package/isarray/v/1.0.0) | 1.0.0 | - |
| [jsonrepair](https://www.npmjs.com/package/jsonrepair/v/3.13.2) | 3.13.2 | ISC |
| [jszip](https://www.npmjs.com/package/jszip/v/3.10.1) | 3.10.1 | - |
| [lie](https://www.npmjs.com/package/lie/v/3.3.0) | 3.3.0 | - |
| [mime-db](https://www.npmjs.com/package/mime-db/v/1.52.0) | 1.52.0 | - |
| [mime-types](https://www.npmjs.com/package/mime-types/v/2.1.35) | 2.1.35 | - |
| [mitt](https://www.npmjs.com/package/mitt/v/3.0.1) | 3.0.1 | - |
| [nanoid](https://www.npmjs.com/package/nanoid/v/5.0.7) | 5.0.7 | - |
| [number-precision](https://www.npmjs.com/package/number-precision/v/1.6.0) | 1.6.0 | - |
| [orderedmap](https://www.npmjs.com/package/orderedmap/v/2.1.1) | 2.1.1 | - |
| [pako](https://www.npmjs.com/package/pako/v/1.0.11) | 1.0.11 | - |
| [perfect-debounce](https://www.npmjs.com/package/perfect-debounce/v/1.0.0) | 1.0.0 | - |
| [pinia](https://www.npmjs.com/package/pinia/v/3.0.2) | 3.0.2 | - |
| [pptxgenjs](https://www.npmjs.com/package/pptxgenjs/v/3.12.0) | 3.12.0 | - |
| [pptxtojson](https://www.npmjs.com/package/pptxtojson/v/2.2.0) | 2.2.0 | - |
| [process-nextick-args](https://www.npmjs.com/package/process-nextick-args/v/2.0.1) | 2.0.1 | - |
| [prosemirror-commands](https://www.npmjs.com/package/prosemirror-commands/v/1.6.0) | 1.6.0 | - |
| [prosemirror-dropcursor](https://www.npmjs.com/package/prosemirror-dropcursor/v/1.8.1) | 1.8.1 | - |
| [prosemirror-gapcursor](https://www.npmjs.com/package/prosemirror-gapcursor/v/1.3.2) | 1.3.2 | - |
| [prosemirror-history](https://www.npmjs.com/package/prosemirror-history/v/1.3.2) | 1.3.2 | - |
| [prosemirror-inputrules](https://www.npmjs.com/package/prosemirror-inputrules/v/1.4.0) | 1.4.0 | - |
| [prosemirror-keymap](https://www.npmjs.com/package/prosemirror-keymap/v/1.2.2) | 1.2.2 | - |
| [prosemirror-model](https://www.npmjs.com/package/prosemirror-model/v/1.22.2) | 1.22.2 | - |
| [prosemirror-schema-basic](https://www.npmjs.com/package/prosemirror-schema-basic/v/1.2.3) | 1.2.3 | - |
| [prosemirror-schema-list](https://www.npmjs.com/package/prosemirror-schema-list/v/1.4.1) | 1.4.1 | - |
| [prosemirror-state](https://www.npmjs.com/package/prosemirror-state/v/1.4.3) | 1.4.3 | - |
| [prosemirror-transform](https://www.npmjs.com/package/prosemirror-transform/v/1.8.0) | 1.8.0 | - |
| [prosemirror-view](https://www.npmjs.com/package/prosemirror-view/v/1.33.9) | 1.33.9 | - |
| [proxy-from-env](https://www.npmjs.com/package/proxy-from-env/v/1.1.0) | 1.1.0 | - |
| [queue](https://www.npmjs.com/package/queue/v/6.0.2) | 6.0.2 | - |
| [readable-stream](https://www.npmjs.com/package/readable-stream/v/2.3.8) | 2.3.8 | - |
| [rfdc](https://www.npmjs.com/package/rfdc/v/1.4.1) | 1.4.1 | - |
| [rope-sequence](https://www.npmjs.com/package/rope-sequence/v/1.3.4) | 1.3.4 | - |
| [select](https://www.npmjs.com/package/select/v/1.1.2) | 1.1.2 | - |
| [setimmediate](https://www.npmjs.com/package/setimmediate/v/1.0.5) | 1.0.5 | - |
| [sortablejs](https://www.npmjs.com/package/sortablejs/v/1.14.0) | 1.14.0 | - |
| [speakingurl](https://www.npmjs.com/package/speakingurl/v/14.0.1) | 14.0.1 | - |
| [superjson](https://www.npmjs.com/package/superjson/v/2.2.2) | 2.2.2 | - |
| [svg-pathdata](https://www.npmjs.com/package/svg-pathdata/v/7.1.0) | 7.1.0 | - |
| [through2](https://www.npmjs.com/package/through2/v/3.0.2) | 3.0.2 | - |
| [tiny-emitter](https://www.npmjs.com/package/tiny-emitter/v/2.1.0) | 2.1.0 | - |
| [tinycolor2](https://www.npmjs.com/package/tinycolor2/v/1.6.0) | 1.6.0 | - |
| [tippy.js](https://www.npmjs.com/package/tippy.js/v/6.3.7) | 6.3.7 | - |
| [tslib](https://www.npmjs.com/package/tslib/v/2.3.0) | 2.3.0 | - |
| [txml](https://www.npmjs.com/package/txml/v/5.1.1) | 5.1.1 | - |
| [vuedraggable](https://www.npmjs.com/package/vuedraggable/v/4.1.0) | 4.1.0 | - |
| [w3c-keyname](https://www.npmjs.com/package/w3c-keyname/v/2.2.8) | 2.2.8 | - |
| [yerror](https://www.npmjs.com/package/yerror/v/8.0.0) | 8.0.0 | - |
| [zrender](https://www.npmjs.com/package/zrender/v/6.0.0) | 6.0.0 | - |

## Licences counted

Rows per licence in the tables above (vendored folders, packages, crates, libraries).

none recorded: 76; OFL-1.1: 1; ISC: 1

## Where the licence texts are

- Vendored folders: the files named in their row, inside the folder.
- npm packages and Rust crates: each package's own licence file, inside its published archive (the link on its name).
