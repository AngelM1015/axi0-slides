#!/usr/bin/env bash
# Build the editor exactly as it is served: `./build.sh` -> dist/ (static files, relative paths).
# The source address shown in the editor (and asked for by AGPL-3.0 section 13) is this repository at the commit
# being built; set SOURCE_URL to override it.
set -euo pipefail
cd "$(dirname "$0")"
commit=$(git rev-parse HEAD 2>/dev/null || echo unknown)
export VITE_SOURCE_URL="${SOURCE_URL:-https://github.com/AngelM1015/axi0-slides/tree/$commit}"
[ -d node_modules ] || npm ci --ignore-scripts --no-audit --no-fund
rm -rf dist
npx vue-tsc --build --force
npx vite build
# integrity values on the page's own script and style sheet: the frame runs only the bytes built here
node -e '
const fs = require("fs"), crypto = require("crypto"), p = "dist/index.html";
let n = 0;
const h = fs.readFileSync(p, "utf8").replace(/<(script|link)\b([^>]*?)\b(src|href)="(\.\/assets\/[^"]+)"/g, (m, tag, a, attr, url) => {
  n++;
  const d = crypto.createHash("sha384").update(fs.readFileSync("dist/" + url.slice(2))).digest("base64");
  return "<" + tag + a + attr + "=\"" + url + "\" integrity=\"sha384-" + d + "\"";
});
if (n !== 2) { console.error("expected 2 assets in index.html, found " + n); process.exit(1); }
fs.writeFileSync(p, h);
'
cp LICENSE dist/LICENSE.txt
printf '%s\n' "$VITE_SOURCE_URL" > dist/SOURCE.txt
# the build must name no outside address in what runs. Allowed: links to the source and the licence, and the documentation
# addresses some bundled libraries print in their error messages, the XML namespace names a .pptx file carries and one
# URL base for parsing (none is ever fetched; the frame's policy would refuse it); anything else fails the build.
DOCS='github\.com|www\.w3\.org|www\.gnu\.org|animate\.style|clipboardjs\.com|gitbrent\.github\.io|lodash\.com|npms\.io|openjsf\.org|prosemirror\.net|raw\.github\.com|stuk\.github\.io|vuejs\.org|stuartk\.com|underscorejs\.org|opensource\.org|purl\.org|schemas\.microsoft\.com|schemas\.openxmlformats\.org|localhost'
other=$(grep -rhoE "https?://[a-zA-Z0-9.-]+" dist --include=*.js --include=*.html --include=*.css | sed -E 's#^https?://##' | grep -vxE "$DOCS" | sort -u || true)
if [ -n "$other" ]; then echo "outside addresses in dist: $other"; exit 1; fi
echo "built $(find dist -type f | wc -l | tr -d ' ') files, $(du -sh dist | cut -f1), source $VITE_SOURCE_URL"
