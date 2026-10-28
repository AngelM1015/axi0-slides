# axi0-slides: what we changed in PPTist

axi0-slides is a modified version of [PPTist](https://github.com/pipipi-pikachu/PPTist) (© 2020-PRESENT pipipi-pikachu),
released under the same licence, the GNU Affero General Public License version 3 (see LICENSE). It is the slide editor of
axi0 Slides: the page at search.axi0.io/slides/ shows it in a sandboxed frame and talks to it only by `postMessage`. This
repository holds the editor's complete source: everything in the frame is built from it with `./build.sh`.

Base: PPTist `master` at 04e06cb (2026-10-10). Changes, first made on 2026-10-28:

1. English interface: the commit "translate hardcoded Chinese UI to English" (ae61a1c) by DmanADYP from
   https://github.com/DmanADYP/PPTist (AGPL-3.0), taken as is; conflicts with newer upstream code were in comments only.
2. No outside requests. Removed: the AI deck generator and AI writing (they called the upstream author's server), the
   online image library, audio and video from web addresses, the Google Fonts lookup for fonts named by an imported file,
   the feedback and FAQ links. The templates keep their layouts; their stock photos (hosted on a photo site, under a
   licence we cannot pass on) are dropped. `build.sh` fails when the built files name any other address.
3. Storage: none. The undo history and the pen drawings of a presentation live in memory (src/utils/database.ts);
   recent colours too (src/axi0/memory-storage.ts). The frame has an opaque origin, where IndexedDB and localStorage do
   not exist.
4. The bridge (src/axi0/bridge.ts): the deck comes from the framing page and goes back to it after each edit; the theme
   and the document language come from it too. Messages go only to the origin the files were served from.
5. Theme: the editor's colours are CSS variables (src/axi0/theme.scss, src/assets/styles/variable.scss) with a light and a
   dark set; a build-time pass (axi0/vite-theme.mjs) swaps the fixed light colours of the editor's own style sheets for
   them. Slides keep their own colours.
6. Fonts: the Latin families under the SIL Open Font License stay; the CJK families (40 MB) and two fonts under other
   licences are gone; Instrument Sans (SIL OFL 1.1, src/assets/fonts/OFL-InstrumentSans.txt) is added. Text set in a
   font this browser lacks falls back to the system font.
7. index.html: English, no inline script (the frame's policy allows none), no favicon request; the source link in the
   header points at this repository at the commit that was built (VITE_SOURCE_URL, set by build.sh).

Build: Node 20 or newer, `./build.sh` (npm ci from package-lock.json, type check, vite build into dist/, LICENSE and
SOURCE.txt copied in, the outside-address check).
