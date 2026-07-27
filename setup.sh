#!/usr/bin/env bash
# Prep Ledger — environment bootstrap and end-to-end pipeline check.
# Run once in a new environment:  bash setup.sh
# Verifies prerequisites, runs the full suite, and confirms the deploy beacon.
# Changes nothing and pushes nothing.

set -uo pipefail
ok=0; bad=0
say()  { printf "\n\033[1m%s\033[0m\n" "$1"; }
pass() { printf "  ✓ %s\n" "$1"; ok=$((ok+1)); }
fail() { printf "  ✗ %s\n" "$1"; bad=$((bad+1)); }

say "PREP LEDGER — environment check"

command -v node >/dev/null 2>&1 && pass "node $(node -v)" || fail "node not found — install Node.js"
command -v npx  >/dev/null 2>&1 && pass "npx present"      || fail "npx not found — comes with Node.js"
command -v git  >/dev/null 2>&1 && pass "git $(git --version | awk '{print $3}')" || fail "git not found"
command -v python3 >/dev/null 2>&1 && pass "python3 $(python3 -V 2>&1 | awk '{print $2}')" || fail "python3 not found"

if [ -n "${GH_TOKEN:-}" ]; then pass "GH_TOKEN is set (${#GH_TOKEN} chars)"
else fail "GH_TOKEN not set — export GH_TOKEN=<your token> before shipping"; fi

say "Repo contents"
for f in src/app.jsx tools/engine-test.jsx tools/ship.sh HANDOFF.md CLAUDE.md; do
  [ -f "$f" ] && pass "$f" || fail "$f missing"
done

say "Suite"
if npx --yes esbuild tools/engine-test.jsx --bundle --platform=node --jsx=automatic \
     --loader:.jsx=jsx --outfile=/tmp/pl-test.js >/dev/null 2>&1; then
  pass "test bundle built"
  out=$(node /tmp/pl-test.js 2>&1 | tail -3)
  echo "$out" | grep -q "0 failed" && pass "suite green — $(echo "$out" | grep FINAL | tail -1)" \
                                   || fail "suite RED: $out"
else
  fail "could not build the test bundle"
fi

say "Live deployment"
if [ -n "${GH_TOKEN:-}" ]; then
  ver=$(curl -s -H "Authorization: Bearer $GH_TOKEN" -H "Accept: application/vnd.github.raw" \
        "https://api.github.com/repos/joeymat11-rgb/prepledger/contents/ledger/deploy.json?t=$(date +%s)" | tr -d " \n")
  case "$ver" in *version*) pass "beacon: $ver";; *) fail "beacon unreadable — check the token scope";; esac
else
  printf "  - beacon check skipped (no GH_TOKEN)\n"
fi

say "Result"
if [ "$bad" -eq 0 ]; then
  printf "  All %s checks passed. The pipeline is ready.\n" "$ok"
  printf "  Next: read HANDOFF.md, then make a change and run tools/ship.sh\n\n"
else
  printf "  %s passed, %s need attention (see ✗ above).\n\n" "$ok" "$bad"
fi
exit 0
