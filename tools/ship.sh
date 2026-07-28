#!/usr/bin/env bash
# Kept as a shim so old muscle memory and old notes still work.
#
#   bash tools/ship.sh "what changed"
#
# The real thing is scripts/ship.mjs, reachable as `npm run ship`. The version
# of this file that lived here before hardcoded /home/claude/build and
# /home/claude/repo and wrote to prep-ledger-pwa/ — none of which exist. It had
# been unrunnable for a long time while CLAUDE.md still named it as THE way to
# ship, which is exactly how a project stops being reproducible.

set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
exec node scripts/ship.mjs "$@"
