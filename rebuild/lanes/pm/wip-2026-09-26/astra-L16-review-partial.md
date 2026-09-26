# NATIVE-LOAD build review L16
Reviewer: Astra (Codex), commissioned by the Claude Opus 5.5 PM under DECISIONS:777-794; blind review, round 16; highest effort; engine tier
Head checked: bd7654a798592a7dae421b9d68fec850fb0993d1
SHA256 rebuild/m4/spec/native-load-options.test.cjs: b6f2aa3e7a3b96386403ce0a3daa6e87f2d088085ff109cea3e068cf0c11ee84
SHA256 rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs: dd099f2ed9f470dee4e3cd0d83c31d84e24489df8f0d20ae8c5e0820981c8316
SHA256 rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md: 7d8fb0011de3819543f9668d8f98e9d1b44434a2604b4e2097ec8875e28104de
VERDICT: REJECT

Review in progress. No acceptance is asserted until the required measurements finish.

## 1. PRODUCT BYTES
142/142 selected public package files equal bd7654a byte-for-byte and by SHA256. Forbidden modules were excluded. Scratch product-hashes.json records both full digests per path.
Spec 7ef8291 matches the named remote spec blob: eb619d959c6dbc3d3285852c91b4fcbc2807985144eda7e684a3b75efe079dbb.
FC12 +551/-0; FA03 +187/-0. Author report unread.
## 2. L15 BLOCKERS
Whole head FC12 267/267; whole head FA03 56/56, no unselected row. Retained own checks 10/10 plus L15 7/7 and actual-host 2/2. Zero unexpected accesses. All ten required replays completed: each overlay fails a specified-outcome assertion. ALV overlays leave FA03 green because it does not execute admission.

| Overlay | FC12 passing | FA03 passing | Outcome row |
| --- | --- | --- | --- |
| L14-M01-absent-weight | 263/267 | 54/56 | L14-B1-ABSENT-W-PROJECTION, L14-B1-ABSENT-W-UNDO, R22L2-UNLOCK-OVER-ABSENT-W, R22L3-EVERY-ENTRY-OVER-NULL |
| L14-M02-null-queue-vector | 266/267 | 56/56 | L14-B2-EXPLICIT-NULL-NEWWSETS |
| L14-M03-first-slot-anchor | 264/267 | 56/56 | L14-B3-SHIFT-ANCHOR-FIRST-BELOW-W, L14-B3b-SHIFT-ANCHOR-ALL-BELOW-W, L14-B3b-SHIFT-ANCHOR-ALL-BELOW-W-FRACTIONAL |
| L14-M10-round-shift | 264/267 | 56/56 | L14-B3-SHIFT-ANCHOR-FIRST-BELOW-W, L14-B4-FRACTIONAL-ALV, L15-B4-EVERY-ENTRY-ALV |
| L15-N02 | 265/267 | 56/56 | L15-B1-SIGNED-DELTA-ALV, L15-B2-NEGATIVE-SHIFT-NOT-CLAMPED |
| L15-N09 | 266/267 | 56/56 | L15-B2-NEGATIVE-SHIFT-NOT-CLAMPED |
| L15-N10 | 266/267 | 56/56 | L15-B3-ELEMENT-TYPE-ALV |
| L15-N12 | 265/267 | 56/56 | L15-B4-HISTORY-THEN-PENDING-ALV, L15-B4-EVERY-ENTRY-ALV |
| L15-N13 | 266/267 | 55/56 | L15-B5-NONSTRING-MARKER-HIDDEN |
| L15-N14 | 266/267 | 55/56 | L15-B6-FINISHED-ENTRY-SHOWN |

## 3. SPEC FIDELITY
Pending.
## 4. OWN NEW MUTANTS
19 fresh, single-clause overlays prepared with unique anchors; execution in progress. Independent head controls 10/10 plus host 1/1. A scratch-only host evidence-array initialization error was corrected before the head control passed; no product or submitted test was changed.
## 5. PROPERTY WALK
Pending.
## 6. WHAT IS OWED
Pending.
## BLOCKING
B1 - Zero target conversion is unpinned (T07, source-admission.mjs:854). Input w 5, wSets [5,5,5], legacy debut newW 0. P and the finite-number definition admit it. Head writes and captures [0,0,0], keeping w 5. Adding q.newW<=0 to the skip condition leaves newWSets absent and refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. Mutant passes all 267 FC12 and 56 FA03 rows; independent ZERO_TARGET is red. This is a test-coverage blocker; head is correct.
B2 - Admission legacy-marker type is unpinned (T08, source-admission.mjs:853). Input w 100, wSets [100,100,95], pending debut newW 105, native_load_spend null. Head writes/captures [105,105,100]; treating every present marker as native leaves newWSets absent and refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. Mutant passes 267/267 and 56/56; independent ALV_MARKER is red. The new L15-B5 rows test projection, not this admission predicate. Head also passes markers 0/false.
B3 - One out-of-P entry stops conversion of a different lift (T09, source-admission.mjs:858). Queue order: L-day press w 100, vector [100,105], newW 105; then U-day row w 40, vector [40,35,35], newW 45. Head names only press, leaves it unchanged and converts/captures row [45,40,40]. Replacing continue with break leaves row scalar and refuses its U-day capture. Mutant passes 267/267 and 56/56; BAD_THEN_VALID and traversal checks fail. This violates (iv) for each qualifying q; head is correct.

B4 - P has no per-element lower bound (T12, source-admission.mjs:857). Input w 5, wSets [-1,5,0], legacy debut newW 10. Head writes/captures [4,10,5], names nothing, preserves every other byte. Adding x>=0 to P names the entry, leaves it scalar and refuses ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED. Mutant passes 267/267 and 56/56; NEGATIVE_INPUT fails. L15-B2 tests a negative output from nonnegative input, so it cannot detect this extra input restriction.

B5 - Empty-array conversion is unpinned (T13, source-admission.mjs:856). Input w 100, wSets [], pending legacy debut newW 105. The array satisfies P vacuously. Head writes newWSets []; a new nonempty-array restriction leaves it absent. Both captures refuse LOAD_MAPPING_REQUIRED, but the mutant violates (iv)'s conversion and admission invariant. It passes all 267 FC12 and 56 FA03 rows; EMPTY_VECTOR distinguishes the specified state result. Head is correct.

B6 - The host default projection can retain a stale basis without detection (T19, today-bindings.mjs:674). Open the real durable host with engineState:()=>basis at w 40; replace that immutable basis with w 55; call project() again. Head returns 55; caching first returns 40. All 267 FC12 and 56 FA03 rows still pass. Independent host CURRENT_BASIS fails (0/1); head passes through cold reopen at 55 (1/1). The host promises to read the current basis (FC08:623-626; spec :164-165), and FA02 passes hostBase at :397 and calls project() at :199. This is a changed host result, not a claimed physical-phone observation.

## NAMED DEBTS
Pending.
## Mutation table
Pending.
## What I did not verify
All unexecuted checks remain unverified.
