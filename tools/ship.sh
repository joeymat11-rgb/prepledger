#!/bin/bash
# ship.sh — tests are a wall, not a suggestion. Push cannot happen past a red suite.
set -e
cd /home/claude/build
npx esbuild tools/engine-test.jsx --bundle --platform=node --jsx=automatic --loader:.jsx=jsx --outfile=/tmp/et.js
node /tmp/et.js > /tmp/et.out 2>&1 || { echo "SUITE RED — push blocked:"; grep FAIL /tmp/et.out; exit 1; }
tail -1 /tmp/et.out
node tools/render-smoke.mjs || { echo "RENDER-SMOKE RED — push blocked"; exit 1; }
npx esbuild src/main.jsx --bundle --minify --format=iife --jsx=automatic --loader:.jsx=jsx --define:process.env.NODE_ENV='"production"' --outfile=prep-ledger-pwa/app.js
node tools/smoke2.mjs | grep -q "OK: header renders" || { echo "SMOKE RED — push blocked"; exit 1; }
cp prep-ledger-pwa/app.js prep-ledger-pwa/sw.js /home/claude/repo/
cp src/app.jsx /home/claude/repo/src/ && cp tools/engine-test.jsx /home/claude/repo/tools/
cd /home/claude/repo
git add -A && git commit -q -m "$1"
git pull --rebase -q "https://oauth2:${GH_TOKEN}@github.com/joeymat11-rgb/prepledger.git" main
git push -q "https://oauth2:${GH_TOKEN}@github.com/joeymat11-rgb/prepledger.git" main
echo "SHIPPED: $1"

# ---- beacon gate: every ship now waits for the robot's own confirmation ----
SHIP_SHA=$(cd /home/claude/repo && git rev-parse HEAD)
python3 - << PYEOF
import json, time, urllib.request, base64, os
TOK = os.environ.get("GH_TOKEN"); SHA = "$SHIP_SHA"
for i in range(20):
    time.sleep(9)
    try:
        req = urllib.request.Request("https://api.github.com/repos/joeymat11-rgb/prepledger/contents/ledger/deploy.json?ref=main", headers={"Authorization": "Bearer " + TOK})
        b = json.loads(base64.b64decode(json.loads(urllib.request.urlopen(req).read())["content"]))
        if b.get("sha") == SHA:
            if b["state"] == "published":
                import re as re2
                want = "v" + re2.search(r'APP_V = "([0-9.]+)"', open("/home/claude/build/src/app.jsx").read()).group(1)
                got = str(b.get("version","?"))
                print("DEPLOY CONFIRMED LIVE — " + got + " (" + str((i+1)*9) + "s)")
                if got != want: print("!! SW BUMP MISMATCH: site serves " + got + " but source is " + want + " — PHONES WILL NOT UPDATE. Fix sw.js cache name and re-ship.")
                break
            print("DEPLOY FAILED — robot log tail:"); [print("  " + l) for l in b.get("log", [])[-12:]]; break
    except Exception: pass
else: print("beacon: no confirmation in 3 min — GitHub queue may be slow")
PYEOF
