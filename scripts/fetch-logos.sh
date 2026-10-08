#!/usr/bin/env bash
# Fetch the 4,741 tool logos into public/logos/.
# The logos are NOT stored in git (71MB of binaries). Download the DB zip instead:
#   https://muse.ai/files/1350181631510837/983681317327846/w063pz05hf2tn09g47zld6un/aitoolshub-db-with-images.zip
# (ask the maintainer if the link expired) and unzip its logos/ folder here.
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -n "${1:-}" ]; then
  unzip -q -o "$1" "logos/*" -d /tmp/aitoolshub-logos
  mkdir -p public/logos
  cp -n /tmp/aitoolshub-logos/logos/*.png public/logos/ 2>/dev/null || true
  echo "Logos copied to public/logos/ ($(ls public/logos/*.png 2>/dev/null | wc -l) files)"
else
  echo "Usage: scripts/fetch-logos.sh <path-to-aitoolshub-db-with-images.zip>"
  echo "Without the zip, the site still runs — cards fall back to initial monograms."
fi
