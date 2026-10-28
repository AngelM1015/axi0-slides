// axi0-slides: a build-time pass over the editor's own style sheets (not the slides it draws) that swaps upstream's
// fixed light-theme colours for CSS variables, so the editor follows the light or dark theme the framing page sends
// (src/axi0/theme.scss holds the variables and their defaults). Every rule below is a plain text replacement inside
// style code; the counts are printed at the end of a build.
const INCLUDE = /\/src\/(views\/Editor|views\/Mobile|components|assets\/styles|views\/components\/(?!element|ThumbnailSlide))/
const EXCLUDE = /\/src\/(views\/Editor\/Canvas|views\/Screen|views\/components\/element|views\/components\/ThumbnailSlide|components\/ColorPicker|components\/WritingBoard)/
const STYLE = /(\.vue\?vue&type=style[^/]*|\.s?css(\?.*)?)$/

const RULES = [
  ['panel', /(^|[;{\s])(background(?:-color)?)(\s*:\s*)(#fff|#ffffff|white)\b/gim, '$1$2$3var(--ax-panel)'],
  ['hover', /(^|[;{\s])(background(?:-color)?)(\s*:\s*)(#f9f9f9|#fafafa|#f5f5f5|#f4f4f4|#f3f3f3|#f2f2f2|#f1f1f1|#f0f0f0|#eeeeee|#eee|#efefef|#e9e9e9|#e8e8e8)\b/gim, '$1$2$3var(--ax-hover)'],
  ['text', /(^|[;{\s])(color)(\s*:\s*)(#333333|#333|#41464b|#555555|#555|#000000|#000|#1d1d1d|#222)\b/gim, '$1$2$3var(--ax-text)'],
  ['mute', /(^|[;{\s])(color)(\s*:\s*)(#666666|#666|#777|#888888|#888|#999999|#999|#aaaaaa|#aaa|#bbb|#bfbfbf|#b7b7b7|#ccc)\b/gim, '$1$2$3var(--ax-mute)'],
  ['line', /(^|[;{\s])(border(?:-(?:top|right|bottom|left))?(?:-color)?|outline)(\s*:[^;{}]*?)(#e5e7eb|#d9d9d9|#e1e1e1|#dcdcdc|#dddddd|#ddd|#eeeeee|#eee|#cccccc|#ccc|#f1f1f1|#f0f0f0|#e8e8e8|#e6e6e6)\b/gim, '$1$2$3var(--ax-line)'],
]

export default function axi0Theme() {
  const counts = Object.fromEntries(RULES.map(r => [r[0], 0]))
  return {
    name: 'axi0-theme',
    enforce: 'pre',
    transform(code, id) {
      const path = id.split('\\').join('/')
      if (!STYLE.test(path) || !INCLUDE.test(path) || EXCLUDE.test(path)) return null
      let out = code
      for (const [name, re, to] of RULES) out = out.replace(re, (...m) => { counts[name]++; return to.replace(/\$(\d)/g, (_, i) => m[+i]) })
      return out === code ? null : { code: out, map: null }
    },
    buildEnd() {
      console.log('axi0-theme replacements: ' + Object.entries(counts).map(([k, v]) => k + ' ' + v).join(', '))
    },
  }
}
