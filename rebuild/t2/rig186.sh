#!/bin/bash
# rig186 — cowork's INDEPENDENT bite check on the T2 product: seven one-line breaks in seven product modules, each run
# through the real gate (node run.cjs) with EARNED_CLIENT_DIR pointing at a mutated COPY of the product. Expected: the
# named §B law(s) FAIL and the suite goes INCONSISTENT; the untouched product stays 35 GREEN. The product itself is never
# edited. Verdict is by the runner's own output (classified on exit code + the §B adapters line), not by string hope.
export MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York
HERE=$(cd "$(dirname "$0")" && pwd)
SRC=${EARNED_CLIENT_DIR:-$( [ -f "$HERE/../client/index.cjs" ] && cd "$HERE/../client" && pwd || echo /home/claude/rebuild/client)}
CONF=${EARNED_CONFORM_DIR:-$( [ -f "$HERE/../conform/run.cjs" ] && cd "$HERE/../conform" && pwd || echo /home/claude/conform)}
OUT="$HERE/rig186.log"; : > "$OUT"; echo "rig186 product=$SRC suite=$CONF" | tee -a "$OUT"
pass=0; total=0
run_mut () {  # name · file · sed-expr · expected-law-regex
  local name="$1" file="$2" expr="$3" expect="$4"; total=$((total+1))
  local dir; dir=$(mktemp -d /tmp/t2mut-XXXX); cp -r "$SRC"/. "$dir"/
  sed -i "$expr" "$dir/$file"
  if cmp -s "$SRC/$file" "$dir/$file"; then echo "M$total $name — SED DID NOT APPLY (rig error)" | tee -a "$OUT"; rm -rf "$dir"; return; fi
  local out; out=$(cd "$CONF" && EARNED_CLIENT_DIR="$dir" node run.cjs 2>&1); local code=$?
  local line; line=$(echo "$out" | grep -E "^(OK|BAD) +6 adapters laws/sheet-B-client" | tail -1)
  local fails; fails=$(grep -E "^FAIL +B" "$CONF/run.log" | sed -E 's/^FAIL +//; s/ +\[.*//' | cut -c1-90)
  local hit; hit=$(echo "$fails" | grep -cE "$expect")
  if [ $code -ne 0 ] && echo "$line" | grep -q "^BAD" && [ "$hit" -ge 1 ]; then pass=$((pass+1)); v="BITE"; else v="NO-BITE"; fi
  { echo "M$total $v — $name  [$file]  exit=$code"; echo "     $line"; echo "$fails" | sed 's/^/     FAIL /'; } | tee -a "$OUT"
  rm -rf "$dir"
}
run_mut "frontier = high-water, not contiguous" sync.cjs 's/function contiguous(from, have) { let w = from; while (have.has(w + 1)) w++; return w; }/function contiguous(from, have) { return Math.max(from, ...have); }/' "B-frontier-W-is-the-CONTIGUOUS"
run_mut "canonical: no NFC" canonical.cjs 's/quote(value.normalize("NFC"))/quote(value)/' "B-A1-canonical-v1"
run_mut "state 7 keeps proposals + instruction" face.cjs 's/if (ctx.contractObsolete()) { l2.instruction = null; l2.proposals = \[\]; l2.actionLoci = \[\]; l2.outputs = \[\]; l2.copy = COPY.UPDATE_EARNED; l2.contractCurrent = false; }/if (ctx.contractObsolete()) { l2.copy = COPY.UPDATE_EARNED; l2.contractCurrent = false; }/' "B-state-7|B-precedence"
run_mut "lease: expiry ignored" lease.cjs 's/if (!lease.not_after || now > parseTime(lease.not_after)) return/if (false) return/' "B20-lease-expired|B-precedence"
run_mut "fallback: inherited values not excluded" plan.cjs 's/if (inheritedTaint) { own.add(m.field); excluded.push(m.field); continue; }/if (false) { own.add(m.field); excluded.push(m.field); continue; }/' "B-state-5"
run_mut "store: rollback is a no-op" store.cjs 's/rollback(h) { if (h !== open) return; for (let i = journal.length - 1; i >= 0; i--)/rollback(h) { if (h !== open) return; journal.length = 0; open = null; return; for (let i = journal.length - 1; i >= 0; i--)/' "B-durability|B-state-19"
run_mut "dispositions: signature unverified" sync.cjs 's/d.authority_signature !== signatureOver(authorityKey, DISPOSITION_DOMAIN, d, "authority_signature")) return { ok: false, reason: "signature does not verify" };/false) return { ok: false, reason: "signature does not verify" };/' "B2-drain-point"
echo "== rig186: $pass/$total mutants bitten by the gate (product untouched: $(cd $CONF && node run.cjs >/dev/null 2>&1 && echo 'gate exit 0' || echo 'GATE BROKEN'))" | tee -a "$OUT"
if [ "$pass" -eq "$total" ]; then echo "rig186 ⇒ PASS (every mutant bitten)" | tee -a "$OUT"; else echo "rig186 ⇒ $pass/$total BITE — each NO-BITE is a SUITE GAP to be characterised by its own rig (M6 → rig187: the law never restarts from the store) or a product defect; never both unexamined" | tee -a "$OUT"; fi
