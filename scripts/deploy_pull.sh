#!/usr/bin/env bash
# Run ON THE SERVER to publish the current main branch to mel.eval360.tech/b2tw.
#
#   bash scripts/deploy_pull.sh
#
# It pulls, rebuilds the user guide if Node is available, and copies the three
# files the site needs. Nothing else in the repo is served.
set -euo pipefail

TARGET="${TARGET:-/home/vantage/domains/eval360.tech/public_html/mel/b2tw}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$REPO"
echo "→ repo   $REPO"
echo "→ target $TARGET"

git pull --ff-only

# The guide is generated, not committed-and-forgotten. Rebuild it where we can,
# so a change to a screen cannot ship a guide that describes the old one.
if command -v node >/dev/null 2>&1; then
  echo "→ rebuilding the user guide"
  node scripts/build-guide.js
else
  echo "! node not found — shipping the committed guide as-is"
fi

mkdir -p "$TARGET"
for f in index.html b2tw_eval360_demo.html B2TW_Eval360_User_Guide.html; do
  [ -f "$f" ] || { echo "! missing $f"; exit 1; }
  cp -f "$f" "$TARGET/$f"
  printf '  %-34s %6s KB\n' "$f" "$(( $(stat -c%s "$f") / 1024 ))"
done

chmod 644 "$TARGET"/*.html
echo "✓ published → https://mel.eval360.tech/b2tw/"
