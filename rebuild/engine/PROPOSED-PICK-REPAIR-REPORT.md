# PROPOSED-PICK REPAIR: author evidence
Role: commissioned Sol builder. This is author evidence, not acceptance.
Scope: the two clauses authorized by the owner's exact answer in DECISIONS:631.
Spec: EARN-ON-PHONE-OPTIONS-CHECK.md at a731f483, sections 7, 8 and 10.
Refs: base 8c2bc36e91ae346508d31095302eb86a6f708228; red
a2dfa3feb5d9790083d99baee47dc5cf11fd1fe2; head c9780cc4c354db818bf933cebb7bbe1aec36275e.

## Verdict
The authorized two-clause repair is reproduced red first and green at head.
STOP on a third product site: engine-capture.cjs still counts an untapped PROPOSED
entry after genSession selected the classic DEBUT. It is reported, not repaired.
No product or test file changed in this evidence round.

## Red first and repaired head
Node v24.19.0; MEASURED_TEST_NOW=2026-09-03; TZ=America/New_York.
At red a2dfa3f, proposed-pick.test.cjs: 8 tests, 3 pass, 5 fail, exit 1.
Failing rows: EPP-R2, R3, R4, R7 and R8. R1, R5 and R6 pass as controls.
At head c9780cc: 8 tests, 8 pass, 0 fail, exit 0.
R8 proves the import producer road: prepare -> replay-core -> mergeState ->
reconcileSightings/_mintJointEarn -> earnWalk. It mints PROPOSED then DEBUT;
the repaired card and completion both use the classic entry and leave the offer open.
The product diff from red to head is exactly one predicate in today.cjs and one in
writers.cjs; both add state !== "PROPOSED". No other product path changed.

## Public conformance and side-by-side cells
public-conformance.cjs at base and head: exit 0 with byte-identical output:
99 reference GREEN, 99 STRONG, 141 mutants caught, 70 adapter GREEN,
29 RED-as-specified; output sha256 61107dc59f3a0c5e5f5532d196200e9d5f5a9ee2c1214b2a3706f9b0f6e26c.
Safe diagnostic cells defect-witnesses 1 through 4 had identical base/head exits
[0,1,0,0]; the existing witness-2 red is identical. Runtime equivalence is 5/5
at both revisions. Four load-write cells had identical base/head exit/count vectors;
they remain red on stale closed inventory and isolated-copy dependency/byte pins, so
they are comparison evidence only, not a green claim.
The tracked base/head contain no engine-main.cjs or engine-old.cjs. Ignored generated
copies present locally were existence-checked only, never read, copied or executed.

## Sibling sweep
today.cjs pickStructural: correct, excludes PROPOSED before choosing the lift.
today.cjs genSession and writers.cjs completeSession: fixed by the authorized clauses.
writers.cjs takeProposedDebut: correct explicit id plus PROPOSED state, then supersedes
lower entries. Its own/reclaim/ladder lookups are distinct kinds and do not establish
an untapped debut. earn.cjs sites only produce/dedupe entries and store no load.
migrate.cjs mint/reconcile sites either exclude PROPOSED where selecting a classic
entry or only preserve/mint queue state; none establishes or stores working load.
m3 runtime sites only compose the engine. coach has no matching product site.
m4/workout/engine-capture.cjs:69 is the third-site STOP. A producer-driven synthetic
probe minted the real pair; genSession selected one classic entry, while capture counted
two kind matches including PROPOSED and refused ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED.
The retained engine-capture suite is already blocked by a stale source pin, so it does
not close this defect. Scratch probe exit 0 records the counterexample only.

## Owed gates and reproduction
Not run: port oracle on the synthetic fixture, sensitivity, private oracle, full
conformance, seal/package tooling, protected soak, browser, phone and real import.
No private fixture was generated and no protected or athlete-data path was read.
Integrator CI command, under the existing frozen env on both workflow OS jobs:
`node --test rebuild/engine/test/proposed-pick.test.cjs`
Scratch evidence retained at C:/Users/joeym/AppData/Local/Temp/epp-author-20260921-115100.
