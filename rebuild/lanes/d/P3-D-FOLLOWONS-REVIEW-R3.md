# P3-D-FOLLOWONS - final review r3 (Fable 5.1, per DECISIONS:439; admission path)

**VERDICT: ACCEPT.** 0 BLOCKING / 1 MAJOR / 3 MINOR / 4 NOTE. Subject f0aff6f on `rebuild/d-p3-followons`
(Opus r1 e862ce2 ACCEPT read after my own measurements), reviewed in my own detached worktree
`%TEMP%\earned-p3f-rv` with junctions only, SYNTHETIC bundles only (`sealInventedBundle`), my cells under
`%TEMP%\p3f-rv\`, `--out` under `%TEMP%\p3f-out\`. The MAJOR is the retract guard's OTHER direction, which
the ticket's own wording (DECISIONS:477 (b)) prescribed and both reviews missed; it needs a one-sentence
header correction now (docs only, integrator or author, the mapping-r3 MAJOR 1 precedent) and the narrower
rule as a carried item. Nothing here changes an admission verdict, admits a foreign bundle, or weakens a law.

## 1. What I measured myself

**The swap (item 1).** `source-admission.mjs` names `Runtime` twice (:157, :172), both `createEngineRuntime(...)`
and one `.sessionMembership` off the facade; the mirror `engine-runtime-host.cjs:124` exports it and states the
same twelve modules behind literal requires (accepted at 53701cf, equivalence-tested in a0-journeys). My own walk
with the accepted bundler (`%TEMP%\p3f-rv\graph.mjs`, scratch entry = today-entry + createLocalSourceController):
page 121 modules / 1 668 330 B, law PASS; page + admission **133 modules** / 1 927 906 B (byte totals differ from
the author's by the entry path only), delta 12 = entry + merge + migrate + source-admission + source-platform +
reading-history + six `m4/import` files; `engine/seed.cjs`, `engine/index.cjs`, `engine/test/**`,
`rebuild/conform/**`, `m4/workout/engine-runtime.cjs` ABSENT; forbidden names left EXACTLY `engine/merge.cjs`,
`engine/migrate.cjs`, `m4/import/*` (browser-replay, daily-history, engine-provider, local-source-order,
local-source-profile, replay-core); the page's own `assertBundleInputs` REFUSES at `rebuild/engine/migrate.cjs`.
PRE-SWAP (`graph-pre.mjs`, :16 reverted in a scratch copy, specifiers absolutised): build does not complete, 62
errors from `conform/lib/harness.cjs` and `engine/test/*` (the sweep). 133 = row E; A1 PASSES at 121 inputs.

**Same verdict before and after.** P3F-1 (summer, winter) and P3F-2 (native completed workout, the only branch
that calls the runtime) deep-equal the whole qualified view and digests between a pre-swap copy (product file
only READ, every other module the same instance) and the product, 4/4; the suite baselines are green both sides.

**Mapping bound at qualify time (item 2).** `createProductionProducerRegistry({hash})` returns a frozen
`{qualify}` that refuses `SOURCE_ENGINE_CONTEXT_UNPROVEN` unless the request carries a non-empty string
`materialDigest`, then builds the one-row registry from it and qualifies; `{hash, materialDigest}` still pins.
The controller passes exactly `{context, materialDigest}` at :74, derived over the four custody strings AFTER the
four-hash `LOCAL_SOURCE_MATERIAL_MISMATCH` check at :73. My RV3-3 wires a real era with the registry built from
the platform hash ALONE (no `material()` copy), admits end to end, and re-derives the row from the digest read
back out of the committed basis: `engine_digest` equals that row's profile digest, so the row bound is the
controller's own. RV3-4: a reviewed pin to another digest refuses at `reviewSource`, durable record unchanged.
The digest clause is thus not a guard in production (r1 NOTE 3; the mapping header already said so): a foreign
bundle is refused by engine identity, oracle gate, the New York calendar (P3-P2, P3-M11/12/15) and the custody
four-hash check, none of which this ticket touches.

**The retract guard (item 3).** `priorSidecar` now refuses `LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN` when any OTHER
entry of `metadata.imports` (the LIVE register; retract removes from it at :789) is `seeded`. RV-9 reproduced
(RV3-1): two zero-op imports, retract the OLDER: refused, nothing written, both entries live, the cache the
second file seeded untouched. Then the same cell retracts the NEWER: **also refused**, same code (see MAJOR 1).
Mutant (guard disabled, reverted byte-equal, tree clean): P3D-11 and RV3-1 red, 15 green, so the guard is what
refuses. RV-6: P3D-13 green; my RV3-2 retracts three times, every earlier record byte-stable, register empty.

**Runbook (item 4).** +23 lines only: pre-check 7 (America/New_York on the PHONE, three refusing zones, cites
P3-M15 and mapping r3 MINOR 4) and the item-6 paragraph on when the caveat lifts. No other edit.

**Hygiene, drift, seal.** Ten files, all UNDECLARED in packages/S5.json (control `today-bindings.mjs` DECLARED);
0 engine, `today/**`, `today-bindings.mjs` or `m3/w6/host` bytes; added lines 0 CRLF/tabs/trailing WS/em-en
dash/non-ASCII (dashes my scan finds in import-bundle.mjs and the runbook predate this commit). da8b6b6 merges
d-p3-mapping with no overlap; `git diff d4ab43e 7caccb13 -- rebuild/m4/import` is empty. `page-bundle.test.mjs`
relaxes nothing: old P3-B2's fact is now false; B2/B3 assert the swept names absent by deepEqual, the count, and
still RUN the page law. :16 reverted: 7 of 8 red.

## 2. Findings

**MAJOR 1 - two seeded imports can never be retracted again, and the header says otherwise.** The guard
refuses in BOTH directions: with A then B both seeded, retract A is refused because B is seeded (correct: A's
checkpoint is clean-init and would wipe B's cache) and retract B is refused because A is seeded (RV3-1, measured:
`LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN`, both live afterwards). Nothing else removes an entry from
`metadata.imports` (assignments at :573, :646, :789 only), so a zero-op phone that stages two files is locked
with both live for good; `importPresentIn` stays true, LAST-WINS paints B. Retracting B is not an inference:
B's custody checkpoint IS the generation at B's staging, whose DERIVED is the cache A seeded, exactly what P3D-10
restores for one file. So the header sentence "The retract is not lost - retract the other entry first, or
retract this one once the sibling is gone" (import-bundle.mjs :719-721) is false as written and must be
corrected NOW (docs only): say the pair is refused both ways and why. The sound rule is narrower and is a carried
item for P3-IMPORT-UI-2 or S6, with RV3-1's shape as its cell: refuse only when a seeded sibling was staged
AFTER this entry (register order is staging order), so B then A retract cleanly and A-first still refuses RV-9.
The ticket and DECISIONS:477 (b) literally asked for "any other", the author complied and said it was wider on
purpose, and r1 read the same lines; the defect is in the ruling's wording, hence MAJOR carried, not blocking:
on the one port the runbook describes there is one file.

**MINOR 1 - seal base and exit code.** On f0aff6f `b-package --ci --package S5` exits NON-ZERO with `FAIL
SEAL-BASE-IS-NOT-THE-CHAIN-TIP` (the report's "EXIT 0" is a shell artefact; retract r3 saw exit 1). Merged onto
the tip ee5fc3d in a scratch worktree (removed): EXIT 0, SEAL BASE ON THE TIP, 0 unlisted drift, 10/10 children,
PUBLIC CI EVIDENCE PASS. That merge hits add/add conflicts on the three `m4/import` mapping files (the lane was
rebased in as 7caccb13; the author's side is exact); a REBASE of the product commit applies clean (r1 MINOR 2).

**MINOR 2 - "no assertion removed" overstates** (r1 MINOR 1 agreed): P3-M13's `throws({hash})` was inverted by
the ticket itself and old P3-B2's refusal asserts could not survive; both are explained in place. **MINOR 3 -**
`createProductionProducerRegistry({hash, executionId})` with no digest binds a hand-named row id to whatever
digest is presented; no caller does it, but the reviewed `executionId` should require the reviewed digest (S6).
**NOTE 1** the S5 `--ci` green on this branch rides the :473 custody hole, as the author says: S6 must declare
`source-admission.mjs`, `import-bundle.mjs` and enumerate `admission-swap.test.mjs` and `retract.test.mjs` in
rebuild.yml. **NOTE 2** `preSwapCopy()` leaves one temp dir per call under `%TEMP%` (r1 NOTE 4). **NOTE 3** the
runbook's Toronto sentence is right: same offsets, `resolvedOptions().timeZone` differs, P3-M15 refuses.
**NOTE 4** r1 e862ce2 and this file are stacked on f0aff6f, docs only; the integrator carries both.

## 3. Tails (mine, TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03, Node 24)
retract 13/13 | admission-swap 4/4 | production-* 24/24 | w7 import 15/15 | local-source-consumer 6/6 |
m4/import 86/86 | W6 586/586 (8 827 ms) | today-17 by name 666/666 (53 853 ms) | port 65/65 | rig187 PASS |
A1 PASS 3 assets 121 pinned inputs earned-584832560dad | my RV3-1..4 4/4 | mutants: guard off -> P3D-11+RV3-1
red; :16 reverted -> 7/8 red; both restored byte-equal, `git status` clean | b-package --ci S5: f0aff6f exit
non-zero FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP; merged onto ee5fc3d EXIT 0, 0 unlisted drift, 10/10 children,
PUBLIC CI EVIDENCE PASS.
