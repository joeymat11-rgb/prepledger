# P6-COACH-WIRE-2 independent review, round 1

VERDICT: ACCEPT (one MAJOR to close before merge, three MINOR, three NOTE)

Reviewer Opus high, read-only worktree %TEMP%\earned-p6wire-rv, subject 54b7e5fb
rebased content-identically onto the current tip c76fb7f (DECISIONS:457) as
8f56cb5 - see NOTE 6. Own cells %TEMP%\wire2-rv\rv.test.cjs (12) + rv2.test.cjs
(1), outside the repo, 13/13 pass.

## Verified myself, not taken from the report
- Receipt: sha256 over the 11559 bytes of rebuild/lanes/b/tooling/receipts/S4.json
  = 171ebcd4d4b3b2b43707d681cf0511c9eb9d609e3fc32e699a94d88ff7f5dcc1, first 16 =
  171ebcd4d4b3b2b4; receipt.packageId = M2-S4-REAL-DAY; rebuild.yml's only
  b-package step is `--ci --package S4`. ENGINE_REVISION matches exactly, and
  engine-revision.cjs imports no fs/path.
- Order and arguments (V2, recording proxy in front of the REAL client): exactly
  two calls, recordIssuance then respond; recordIssuance gets {id, accepted:true,
  instance:null, producer, revision:ENGINE_REVISION}; respond gets (id,"accept",
  issuance) whose keys are exactly body, moment, producer, reason, revision,
  source; moment === today.today, source === the accepting turn_id; the real
  client acknowledges; reasonFor(id) reads back reason, producer, revision ===
  ENGINE_REVISION, source and moment.
- Six mutants (V3): dropping producer, body, reason, revision, source or moment on
  the way to the real client refuses every time, the tool surfaces the refusal, and
  face().answers, consentLedger and acceptedProposals all stay empty.
- stored:false (V4): respond never called, code CONSENT_ISSUANCE_NOT_STORED, copy
  "Your yes could not be recorded on this device. Nothing changed.", no durable
  write, no ledger entry.
- The three pre-existing refusals (CONFIRMATION_REQUIRED, PROPOSAL_NOT_ENGINE_ISSUED,
  CONSENT_SURFACE_ABSENT) are byte-identical to 57d056cb (V6, compared against the
  base blob). 494 added lines carry zero U+2013/U+2014 (V7); files are LF-only.
- Diff confined to custody: rebuild/coach/** plus the lane C report; no pinned path,
  no local-world.mjs, no rebuild/client byte.
- gap test: R1/R2 DELETED with a comment saying why, not inverted or weakened; R3
  untouched and still red-worthy; R4 now pins ENGINE_REVISION as the only revision
  source and attributes every Date site to its enclosing function (verifyCostCap,
  tools.cjs:961). tiers.test.cjs's gap cell was strengthened, not relaxed: three
  `assert.ok(!raw.includes(...))` became positive assertions plus a reasonFor read-back.

## Suite tails I ran at this content
- coach `node --test "rebuild/coach/test/*.test.cjs"`: tests 229, pass 229, fail 0
- client `node --test rebuild/client/test/*.test.cjs`: tests 18, pass 18, fail 0
- `node rebuild\t2\rig187.cjs`: `rig187 => PASS ...`, exit 0
- `node rebuild\lanes\b\tooling\b-package.cjs --ci --package S4`: exit 0, `SEAL BASE
  ON THE TIP; refs/remotes/origin/rebuild/t2-client-core is at c76fb7f and that
  commit is an ancestor of this HEAD`, `0 unlisted drift`, `PUBLIC CI EVIDENCE PASS`;
  no rebuild/coach path in S4's product map
- today 13 by name (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York): tests 645,
  pass 645, fail 0

## Findings
1. MAJOR - tools.cjs:848 still guards only `typeof consent.respond !== "function"`
   while :864 calls `consent.recordIssuance(...)` unconditionally. A consent surface
   with respond and no recordIssuance - the shape the module header calls OPTIONAL
   and the tip tolerated via `typeof consent.recordIssuance === "function"` - now
   throws `TypeError: consent.recordIssuance is not a function` out of
   accept_proposal instead of refusing (my V5). No product caller has that shape
   today, so nothing ships broken, but it is the one path in this tool that raises
   rather than refuses. One-line fix: add `|| typeof consent.recordIssuance !==
   "function"` to the CONSENT_SURFACE_ABSENT guard, leaving its copy bytes untouched.
2. MINOR - report header wrong four ways: "this round's sha 91c30744" (a real but
   different commit; this one is 54b7e5fb); "6 files, +372/-56" (actual vs the tip:
   7 files, +494/-23); tools.cjs "+39/-9" is +31/-8; "engine-revision.test.cjs's 2
   cells" - it has 3. Every suite tail reproduced exactly, so this is header
   arithmetic, not false evidence.
3. MINOR - phantom issuance row: recordIssuance({accepted:true}) running first means
   a respond() the client refuses still leaves a durable issuances record with
   accepted:true and no proposal-response op, surviving a restart (V8). Its only
   reader is rebuild/client/face.cjs:103, which coach proposal ids do not reach.
   Follows the :456 ordering ruling, so a PM item for the next client ticket.
4. MINOR - R4's regex `/revision:\s*(?!ENGINE_REVISION)[a-zA-Z0-9_.]+/` has no quote
   in its class, so a hardcoded `revision: "S9@deadbeef"` would pass that cell.
5. NOTE - accept-proposal-issuance.test.cjs requires fs and path, uses neither.
6. NOTE - at 54b7e5fb my S4 run exited 1 with SEAL-BASE-IS-NOT-THE-CHAIN-TIP purely
   because origin moved to c76fb7f after the author ran it; rebased onto that tip the
   same content exits 0. The PM must rebase before merging; no author defect.
7. NOTE - bar cell (d) asserts PLAN_CONSENT_NOT_ACKNOWLEDGED, which is correct: the
   client's refusal shape carries copy but no code, so the coach's own fallback
   applies and the copy surfaced is the client's own.
