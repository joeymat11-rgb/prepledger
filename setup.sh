#!/usr/bin/env bash
# Prep Ledger — one command from a bare clone to a proven-green checkout.
#
#   bash setup.sh
#
# This is a thin wrapper. The real work is in scripts/bootstrap.mjs, which is
# plain Node and therefore runs identically in Git Bash, PowerShell, macOS and
# a CI runner. Keeping the logic in Node rather than bash is the whole point:
# the previous version of this file assumed a POSIX shell, /tmp, and python3,
# none of which hold on the Windows machine this project is actually developed
# on.
#
# Changes nothing and pushes nothing. To ship, see: npm run ship

set -uo pipefail
cd "$(dirname "$0")" || exit 1

if ! command -v node >/dev/null 2>&1; then
  printf '\n  node is not on PATH. Install Node 20+ and run this again.\n\n'
  exit 1
fi

exec node scripts/bootstrap.mjs "$@"
