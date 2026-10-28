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
cp LICENSE dist/LICENSE.txt
printf '%s\n' "$VITE_SOURCE_URL" > dist/SOURCE.txt
# the build must name no outside address in what runs. Allowed: links to the source and the licence, and the documentation
# addresses some bundled libraries print in their error messages (never fetched); anything else fails the build.
DOCS='github\.com|www\.w3\.org|www\.gnu\.org|animate\.style|clipboardjs\.com|gitbrent\.github\.io|lodash\.com|npms\.io|openjsf\.org|prosemirror\.net|raw\.github\.com|stuk\.github\.io|vuejs\.org'
other=$(grep -rhoE "https?://[a-zA-Z0-9.-]+" dist --include=*.js --include=*.html --include=*.css | sed -E 's#^https?://##' | grep -vxE "$DOCS" | sort -u || true)
if [ -n "$other" ]; then echo "outside addresses in dist: $other"; exit 1; fi
echo "built $(find dist -type f | wc -l | tr -d ' ') files, $(du -sh dist | cut -f1), source $VITE_SOURCE_URL"
