# P3-PORT-FIX: independent review R2 (re-check after the fix round)

Lane D, INDEPENDENT REVIEW of the fix round `2ae7e12` on top of my own R1
(`68874ec`), against `rebuild/lanes/d/P3-PORT-FIX-SPEC.md` v2, the three binding
corrections of `-SPEC-REVIEW-R2.md` (B-1, N-1, N-2), and my
`P3-PORT-FIX-REVIEW-R1.md`. I did not write the build. Everything below I ran
myself in this worktree with `TZ=America/New_York` and the pinned node. Every
figure is synthetic; no private fixture, no ledger, no owner file was read or
named. I contacted no remote and read no token.

## VERDICT

**ACCEPT.** The fix round moves NO product file: the diff is three test files
and the report (`+287 / -12`), the twelve deleted lines are a comment sentence,
one helper signature and one call site, and NOTHING was weakened - every change
is an added cell or an added assertion. The lockdown numstat is still empty,
`replay-core.cjs` is still the same blob, the seal is still the same four
product files. All nine bar rows reproduced exactly at **317 / 0**. My one
BLOCKING finding is STILL OPEN IN THE PRODUCT, correctly, and its disposition
(pinned by a new trip-wire, escalated to the PM) is the disposition I asked for
in R1. THE PM GATE IS NOW THE ONLY THING LEFT ON THIS FINDING.

## ONE LINE PER R1 FINDING

| R1 finding | R2 result |
|-----------|-----------|
| **BLOCKING 1.** the owner's real path is still refused at the `capture_sets` check | **STILL OPEN IN THE PRODUCT, DISPOSITION ACCEPTED (not a defect in this diff).** I re-ran the pinning cells on the unchanged product: D-PF-f1 GREEN (the refusal), D-PF-f2 GREEN (the control), and the new **D-PF-f3 GREEN** - same phone, same sealed file, same answers, pre-import workout removed, and the file **ADMITS**. I read the check myself: it is unchanged, and the only edit the ticket ever made to it is the spec-authorised `{field:'capture_sets',exercise_id:id}` on the existing `fail` (`git diff -U0 3d002174..HEAD` hunk `@@ -272,2 +331,2 @@`). The author's refusal to widen it is correct and is what R1 asked for ("it wants its own small ticket") |
| **NOTE 2.** cell (a)'s next morning not read through the booted page | **CLOSED.** D-PRR-2 now asserts `next.booted.workout.gym.read()` BEFORE it opens any host of its own; `next` comes from `reopen()`, which is the real `Entry.boot({document,hosts,now})` over the same `IDBFactory`, and nothing is passed in - no basis, no host, no day. It asserts `phase === 'ready'` and `total === sumSets(FILE,'U')`, with the pre-existing guard that the FILE and the document disagree on that number. Re-run green |
| **NOTE 3.** B-B is a dead line | AGREED, NOT CHANGED, RECORDED in report 11. Correct: the line is spec 1.3's own, removing it would be an unauthorised edit, and the guarantee is delivered by B-A plus the non-empty check |
| **NOTE 4.** the retained numbers are bounded by nothing | **REPRODUCED AND PINNED, NOT CLOSED - accepted as a KNOWN GAP.** New cell **D-PF-n4** re-run green: `sets: 0` and `sets: 40` ADMIT and ride into the adopted basis. The author's added evidence is right and is new: the lane's own builder cannot even construct such a file through `createCleanInitState` (`athlete-state.cjs:126` refuses `sets: 0`), which is exactly the point - the bound lives in the DOCUMENT constructor, which an old app's ledger never went through, and not in admission. The cell says in its own words that a landing bound must rewrite it to assert the refusal, never delete it. PM ticket, as R1 said |
| **NOTE 5.** the `CLEAN_INIT_*` case `detailOf` is written for is unreachable through `programme()` | AGREED, RECORDED. The guard stays and still earns its place on the other call site |
| **NOTE 6.** the one sentence is untrue on an unenrolled phone | AGREED, NOT CHANGED, and WIDENED by the author's own measurement into new open question 5. I verify the copy claim independently below |
| **NOTE 7.** B-C enforced indirectly in admission, directly in the companion | AGREED, RECORDED, no behavioural gap |
| **NOTE 8.** the declared partial cells are declared accurately | Nothing to do; still accurate after the round (cell (f) is now 2 of 6 plus the copy measurement) |

## WHAT I RE-RAN, AND WHAT I GOT

| suite | mine | author | log |
|-------|------|--------|-----|
| lane `p3-port-fix` (programme-rule, owner-route, capture-codes) | **25 / 0** | 25 / 0 | `%TEMP%\r2-lane.log` |
| `lanes/d/plan-edit/model.test.cjs` (cell (k)) | **54 / 0** | 54 / 0 | `%TEMP%\r2-planedit.log` |
| import corpus (route, refusals, refusal-route, live-clock, page-bundle) | **35 / 0** | 35 / 0 | `%TEMP%\r2-corpus.log` |
| `m3/w6/test/local-source-admission.test.mjs` | **19 / 0** | 19 / 0 | `%TEMP%\r2-w6.log` |
| `lanes/d/import-retract/retract.test.mjs` | **13 / 0** | 13 / 0 | `%TEMP%\r2-retract.log` |
| S6 `m4/import` children (7 files) | **90 / 0** | 90 / 0 | `%TEMP%\r2-m4import.log` |
| S6 `w6/test/local-source-consumer.test.mjs` | **7 / 0** | 7 / 0 | `%TEMP%\r2-consumer.log` |
| **TOTAL** | **243 / 0** | 243 / 0 | |
| my R1 extra row: `plan-edit/durable-host` + `browser-build` | **32 / 0** | 32 / 0 | `%TEMP%\r2-planhost.log` |
| my R1 extra row: `w6/local-source-commit` + `local-import` + `import-custody` | **42 / 0** | 42 / 0 | `%TEMP%\r2-w6extra.log` |
| **GRAND TOTAL** | **317 / 0** | 317 / 0 | |

NO COUNT DIFFERS FROM THE AUTHOR'S. The lane row moved `23 -> 25` by exactly the
two added cells (D-PF-f3, D-PF-n4); D-PF-f1 gained assertions rather than a cell,
which is why the arithmetic is two and not three. `import-custody/engine-join`
and `recovery-stage/source-import` are still harness-gated on a missing
`EARNED_*_ROOT` and are correctly outside the bar.

## NOTHING WAS WEAKENED

I diffed all three changed test files line by line (`git diff 68874ec..HEAD --
rebuild/lanes/d/p3-port-fix/`). There are three deleted lines of code in total
and they are:

- one comment sentence in `capture-codes.test.mjs`, extended rather than removed;
- `async function importAfterAWorkout(tag, sealed)` -> `(tag, sealed, { workout = true } = {})`;
- `await recordAWorkout(era, WORKOUT_DAY)` -> `if (workout) await recordAWorkout(...)`.

The default is `true`, so D-PF-f1 and D-PF-f2 run byte-identically to the
reviewed tree; only the new D-PF-f3 passes `false`. NO assertion was relaxed,
deleted, loosened or made conditional anywhere in the round, and no `skip`,
`todo` or `only` was introduced. D-PF-f3 is a genuine inversion rather than a
tautology: it holds the FILE, the document, the answers and the shape fixed,
removes one thing, and asserts `admitted === true`, with a guard
(`notDeepEqual` on the two `sets` lists) that the file still differs.

## THE NEW COPY BLOCK, CHECKED AGAINST THE SCREEN

D-PF-f1's added block renders through the screen's own exported
`refusalLines()`, not a local copy, and asserts the whole rendered string
equals `LOCAL_SOURCE_PROGRAMME_UNRESOLVED (capture_sets <lift>)` plus the one
sentence, with no dash, no digit, and no label, no start date and no set count
from either side. I read `import-screen.mjs` `COPY.programmeMismatch`,
`REFUSAL_SENTENCE`, `codeLine` and `confirm()`'s detail assembly and the
rendering is faithful. ONE FIDELITY CAVEAT, not a defect: the cell's
hand-assembled `parts` omits `codes.slice(1)`, which `confirm()` prepends. On
this path exactly one code is raised, so the two agree; the cell states in its
own comment that it measures the COPY and not the routing.

The author's open question 5 is correct and I endorse it: on this path the week,
the lift ids, the days and the muscle groups all agreed, and what refused was
the athlete's own recorded session's slot count, so the sentence he reads is
untrue of his file. That is the same defect as R1 note 6's `setup_document`
sentence, it is copy, and copy is the PM's. Taking both as one decision is right.

## SPEC CONFORMANCE AND THE LOCKDOWN, RE-CHECKED AT THE NEW TIP

- `git diff --name-only 3d002174..HEAD` names the SAME 19 files as at R1, of
  which four are product: `m3/w6/local/source-admission.mjs`,
  `m3/w7-preview/import/import-screen.mjs`, `m4/import/replay-registry.cjs`,
  `m4/workout/plan-edit-model.cjs`. Spec 4.1 exactly.
- `git diff --numstat 3d002174..HEAD -- rebuild/authority rebuild/client
  rebuild/engine rebuild/coach rebuild/m3/setup/port rebuild/m3/w6/host
  rebuild/m3/w7-preview/today rebuild/DECISIONS.md` is **EMPTY**.
- `git diff --numstat 05f736c..HEAD -- rebuild/m3 rebuild/m4` is **EMPTY**: no
  product file and no pinned suite moved in the review or the fix round.
- `replay-core.cjs` is still `f123128d82c55033540a9258ef9e7c387eb145d6` at both
  `3d002174` and `HEAD`. BYTE-IDENTICAL.
- B-1 and N-1 still hold (re-checked at R1, unchanged here). N-2 still holds: the
  import corpus is green at 35 / 0.
- Tree clean, branch `rebuild/d-p3-port-fix`, HEAD `2ae7e12`.

## A CORRECTION TO MY OWN R1 CITE

R1 called the check `source-admission.mjs:273`, which is its line number on the
BASE `3d002174`, and the spec uses the same number. At this tip the same line is
**`source-admission.mjs:332`**, because `programme()` was inserted above it. The
author carried R1's number forward faithfully, so both numbers appear in the
report; they are one line, and a PM ticket should cite `:332`.

## WHAT I STILL COULD NOT VERIFY

Unchanged from R1 section 7, and I re-state it because none of it moved:

1. **That the owner's real bundle qualifies.** Every admitting cell still
   qualifies its engine context through a TEST-ONLY producer mapping, because
   DECISIONS:472 BLOCKER 2 is open. 317 / 0 is not a promise that the real file
   qualifies, and this is the SECOND thing standing between the owner and a
   successful S7 retry.
2. **The real-midnight and offline rows of cell (i)**, and three of cell (f)'s
   four inner codes (`capture_producer`, `capture_lift`, `capture_membership`).
   Still declared, still unexecuted, still correctly declared.
3. **What was pushed.** I contacted no remote and read no token, so
   "pushed `05f736c..2ae7e12` to `rebuild/d-p3-port-fix` only" is unverified
   here. Locally the branch is at `2ae7e12` with a clean tree.

## THE ONE THING THE PM MUST DO BEFORE THE S7 RETRY IS PROMISED

Rule open question 1. The owner's installation satisfies BOTH halves of the
trigger D-PF-f3 now pins - DECISIONS D-PR-5 records a week of pre-import writes,
and DECISIONS:507 is "per-lift targets vary" - so on the evidence in this tree
his file is still refused after this branch merges, at a different line and with
a different message than before. This branch is mergeable and should merge; it
is the retry that is not yet safe to promise.

Reviewer: cowork (Earned PM), lane D independent seat. Logs under `%TEMP%\r2-*.log`;
nothing was committed but this file, and nothing was pushed.
