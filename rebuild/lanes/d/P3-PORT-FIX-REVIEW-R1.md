# P3-PORT-FIX: independent review R1

Lane D, INDEPENDENT REVIEW of the P3-PORT-FIX BUILD (`54ee8da`, `8a2ac64`,
`05f736c`) on `rebuild/d-p3-port-fix`, against
`rebuild/lanes/d/P3-PORT-FIX-SPEC.md` v2 and the three binding corrections of
`-REVIEW-R2.md` (B-1, N-1, N-2). I did not write the build. Everything below I
ran myself in this worktree, with `TZ=America/New_York` and the pinned node.
Every figure is synthetic; no private fixture, no ledger, no owner file was
read or named.

## VERDICT

**ACCEPT WITH NOTES.** The diff is exactly spec 4.1's four product files,
`replay-core.cjs` is byte-identical, every one of the author's eight pass/fail
counts reproduced exactly (241/0), the guard sweep confirms no third guard, and
cell (a) has no stub on its path; the one BLOCKING finding is not a defect in
this diff but the thing the diff does NOT achieve, and it is finding 1: the
owner's real phone, which recorded a week of Earned workouts before importing,
is STILL refused, now at `source-admission.mjs:273` instead of at `programme()`.
This branch is mergeable; the S7 port retry is not yet safe to promise.

## 1. WHAT I RE-RAN, AND WHAT I GOT

Every run: `node --test <files>` with `TZ=America/New_York` (set with
`set "TZ=..."`, quoted; an unquoted `set TZ=... &&` leaves a trailing space and
makes every `port.cjs` seal fail with the gate message, which is worth knowing).

| suite | mine | author | log |
|-------|------|--------|-----|
| lane `p3-port-fix` (programme-rule, owner-route, capture-codes) | **23 / 0** | 23 / 0 | `%TEMP%\rv-lane.log` |
| `lanes/d/plan-edit/model.test.cjs` (cell (k)) | **54 / 0** | 54 / 0 | `%TEMP%\rv-planedit.log` |
| import corpus (route, refusals, refusal-route, live-clock, page-bundle) | **35 / 0** | 35 / 0 | `%TEMP%\rv-corpus.log` |
| `m3/w6/test/local-source-admission.test.mjs` | **19 / 0** | 19 / 0 | `%TEMP%\rv-w6.log` |
| `lanes/d/import-retract/retract.test.mjs` | **13 / 0** | 13 / 0 | `%TEMP%\rv-retract.log` |
| S6 `m4/import` children (7 files) | **90 / 0** | 90 / 0 | `%TEMP%\rv-m4import.log` |
| S6 `w6/test/local-source-consumer.test.mjs` | **7 / 0** | 7 / 0 | `%TEMP%\rv-consumer.log` |
| **TOTAL** | **241 / 0** | 241 / 0 | |

NO COUNT DIFFERS FROM THE AUTHOR'S. I also ran suites the author did not, to
look for regressions he would not have seen:

| suite | mine | note |
|-------|------|------|
| `lanes/d/plan-edit/durable-host.test.mjs` + `browser-build.test.mjs` | **32 / 0** | the companion HOST and its browser build, green |
| `w6/test/local-source-commit` + `local-import` + `import-custody` | **42 / 0** | green |
| `w6/test/import-custody/engine-join.test.mjs`, `recovery-stage/source-import.test.mjs` | 0 / 2 | NOT regressions: both refuse for a missing `EARNED_*_ROOT` env var and demand their own runner (`run-source-import.cjs`). Harness-gated at this tip either way |

The diagnosis cells are carried forward into `p3-port-fix/` (author deviation 5)
and are inside the 23 above: D-PR-0, D-PR-4 a/b/c, D-PR-6, D-PRR-1, D-PRR-2.
`lanes/d/p3-port-refusal/` does not exist on this branch, so there was nothing
else of theirs to run here.

## 2. FINDINGS

### 1. BLOCKING (for the S7 port retry, not for this diff): the owner's real path is still refused, at `source-admission.mjs:273`

The ticket exists so the owner's own history stops being refused. On a phone
that has recorded NO Earned workout, it now succeeds. On a phone that HAS, it
does not. `source-admission.mjs:273`

    for(const [id,count]of counts)if(state.exercises.find(e=>e.id===id).sets!==count)
     fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'capture_sets',exercise_id:id});

compares the slot count of a capture the phone wrote UNDER THE DOCUMENT's one
global set count against `state.exercises[].sets`, which after this ticket is
THE FILE's per-lift count. Those two now disagree BY CONSTRUCTION: the whole
point of the fix is that the file's per-lift numbers are retained. The author's
own cell measures it and it is green:

    D-PF-f1 (the capture_sets code, ON THE OWNER'S PATH) - a phone that recorded
    a workout before importing refuses a file whose set counts differ from the
    document, and now says WHICH check refused ... PASS

and its control D-PF-f2 proves the refusal is the set counts and not the
workout. DECISIONS records that his phone took a full week of pre-import writes
(D-PR-5), and DECISIONS:507 is "per-lift targets vary", so both halves of the
trigger are true of his installation.

This is NOT a defect in the build. Spec 6 does not authorise touching `:273`
and the author correctly did not. It is the ticket's stated purpose left
unmet, surfaced honestly as his open question 1, and it should be a PM
decision BEFORE anyone tells the owner to retry the port after S7. The three
options he lists in report 8.1 are the right shape of question; my own view is
that the capture check is comparing a captured LAYOUT against a programme that
is allowed to have moved since the capture, which is the same category of
mistake `programme()` was just fixed for, and it wants its own small ticket
rather than a widening inside this one.

### 2. NOTE: cell (a)'s next morning is read off the real modules but not through the booted page

Spec 5 (a) asks for "the real `today-entry.mjs` boot, the real adoption chain,
the real `hostForDay` rebase, the real engine. No stub plugin on this path."
STUB-FREE CHECK, done by reading `lanes/d/p3-port-fix/owner-route.test.mjs`
end to end: the setup document is built by the REAL `createSetupModel`
reducer through its own actions (`support.mjs` `shippedSetup`, and PF-0
asserts `split.from === SETUP_DAY` and one `sets` and one `hi` across all
lifts); it is saved through the real setup host (`firstRunWith` ->
`era.createSetupHost` + `Setup.createSetupCommands()`); the bundle is sealed by
the real `port.cjs` (`sealInventedBundle` spawns it, `--out` outside every git
tree); the import is driven on the shipped page (`Entry.boot`, pick, six words,
Unlock, identity Yes, "Import this history"); the next morning re-boots the
page on `liveAt(T+24h)` over the SAME `IDBFactory`. **No stub stands on that
path, so nothing here is BLOCKING.**

What is NOT executed, and is not in the author's deviation list:
`D-PRR-2` reads the gym card by calling `admittedLocalSourceBasis(...)` itself
and then `era.createGymHost({ engineState: adopted })`, rather than reading it
off the page it just booted. Those are real production modules, not stubs, but
`today-app.cjs:2482-2488` `athleteBasisState()` -- the adoption chain the spec
names -- is not the thing under test in this cell. It is covered by
`w6/test/local-source-consumer.test.mjs` (7/0, re-run above). Likewise the
companion is opened by calling `createPlanEditProjector` with
`basisSource:'local-source'` passed in by hand; the author declares this
(deviation 2) and `plan-edit-host.mjs:68-75`'s branch choice on a real admitted
generation is therefore proved only in `lanes/d/plan-edit/durable-host.test.mjs`
(32/0, re-run above), not in cell (a).

### 3. NOTE: B-B is unreachable as written (dead line), in the spec and in the build

`source-admission.mjs`:

     if(!validDay(p.from)||p.from>today)fail(...,{field:'split.from'});   // per period, B-A
    }
    if(!periods.some(p=>p.from<=today))fail(...,{field:'split.from'});    // B-B

B-A already refuses ANY period with `from > today`, so by the time B-B runs
every period satisfies `from <= today` and `periods` is non-empty, which makes
`some(...)` unconditionally true. The B-B line can never fire. This is
faithful to spec 1.3's diff, which has the same redundancy, so the build is
conformant and nothing is weakened: the guarantee B-B is there for is delivered
by B-A plus the non-empty check. Worth recording so a later reader does not
believe there are two independent bounds when there is one.

### 4. NOTE: the retained numbers are now bounded by nothing, and an absurd one dead-ends the gym card after the import is committed

This is the one thing I found that the spec review did not. Before this ticket,
`sets`, `hi`, `inc` and `steps` had to EQUAL the phone's document, and the
document has been through `createCleanInitState`, so the file's numbers were
incidentally bounded to values the engine accepts. Retaining them drops that
bound and puts nothing in its place. Measured (probe PR7, below): a file whose
`db-bench` carries `sets: 0` and whose `lat-pulldown` carries `sets: 40`
**ADMITS**, is adopted, and the next morning the gym card reads

    blocked / ENGINE_CAPTURE_SESSION_INVALID   start=false

with the import already committed and only a retract to get out of. That is
EXACTLY the shape of dead-end spec 1.2's B-A bound was introduced to make
impossible for `split.from` ("admit such a file and then dead-end the owner at
his first gym visit ... with the import already committed"). The same argument
applies to the retained per-lift numbers and the spec did not carry it across.

Not BLOCKING here: the build implements the rule the spec wrote, and a file
sealed by `port.cjs` from a real old-app ledger is unlikely to carry a zero set
count. But it is a real widening with no floor, it is cheap to close (validate
the file's own exercise rows the way `athlete-state.cjs:236-245` validates the
document's), and it is not authorised by this spec. PM ticket, not a change
inside this branch.

### 5. NOTE: the `CLEAN_INIT_*` case the guarded `detailOf` is written for cannot happen through `programme()`

Spec 1.3's third note motivates `detailOf(e)=>(e?.field?{...}:undefined)` with
"a `CLEAN_INIT_*` from `createCleanInitState` or a TypeError carries no
`field`", and spec 5 (f)'s sixth cell asks for it to be executed. It is
unreachable, which is why no cell could be written: `programme()` reaches
`createCleanInitState` at `:172` only AFTER `Setup.validate(op,...)` at `:171`
has returned true, and `setup-commands.mjs:139-146` `validate` itself calls
`setupOf`, which calls `createCleanInitState` and returns false on any throw --
so an unusable document has already refused with `{field:'setup_document'}`.
The guard is still LIVE and still earns its place on the OTHER call site, the
`:347` catch, where `storedWorkoutHistory`, `projector.project` and the engine
runtime genuinely can throw a fieldless error. Record: the code is right, the
spec's stated example is not reachable, and the missing cell is missing for a
good reason rather than an omission.

### 6. NOTE: the one sentence is untrue on an unenrolled phone, and I agree with leaving it

`route.test.mjs:421` (P3-U5) now asserts the box starts
`LOCAL_SOURCE_PROGRAMME_UNRESOLVED (setup_document)`, and `refusalLines()` then
pushes `COPY.programmeMismatch`, which says "the one you set up on this phone"
to a phone that has been set up with nothing. Spec 3.2 rules exactly one
sentence and the author invented no second, which is the right call under the
spec. The honest fix is a sentence keyed on the FIELD rather than the code
(`setup_document` deserves "This phone has not been set up yet"), which is a
one-line widening of `REFUSAL_SENTENCE` and a spec change. The state is barely
reachable in production, since P3-U5's own claim is that an unenrolled
installation is offered no route at all, so it is a NOTE.

### 7. NOTE: B-C's "carries `from` AND `map`" is enforced indirectly in admission and directly in the companion

`programme()` closes the period over `{from,map}` by rejecting any OTHER key,
but never asserts both are present; a period missing `map` or `from` is caught
downstream (`split.map` / `split.from`) rather than as a shape refusal.
`plan-edit-model.cjs` `splitShapeOk` DOES assert `own(p,'from') && own(p,'map')`.
Measured (PR6): a period with `from` deleted refuses `{field:'split.from'}`; a
period with `map` deleted never reaches the rule at all and refuses
`LOCAL_SOURCE_NON_JSON` upstream. No behavioural gap, so nothing to change; the
asymmetry is worth a line in case a later reader treats the two predicates as
one expression.

### 8. NOTE: the declared partial cells are declared accurately, and I ran the one the author handed to the reviewer

I re-read every deviation in report section 7 against the cells. Cell (f) is 2
of 6 (`capture_sets` and its control), cell (i) is 3 of 7, cell (e)'s third
assertion is absent, cell (a)'s companion is projector-level: all four are
stated, none is overstated, and none hides a red. The author asked the reviewer
to run the one-clock-per-file row of cell (i), since spec 1.2 calls it a BUILD
REQUIREMENT rather than a property of the code. I ran it (probe PR8) and the
result is stronger than the spec expected: see the probe table.

## 3. MY OWN PROBES

Nine probes the author did not write, in two scratch files under `%TEMP%`
(`rv-probe.test.mjs` 8/0, `rv-probe2.test.mjs` 1/0), NOT committed and outside
the worktree. Each drives the real controller over a bundle sealed by the real
`port.cjs`, on a phone whose document came from the real setup reducer.

| probe | what it fed the rule | what happened |
|-------|----------------------|---------------|
| PR1 | two periods, the SECOND period's map differing in one day letter | REFUSED `[{code:LOCAL_SOURCE_PROGRAMME_UNRESOLVED, field:'split.map'}]`. P-A is per period, not just period 0 |
| PR2 | one period carrying a third member (`note`) | REFUSED `{field:'split'}`. B-C holds |
| PR3a | lift ids all match, one lift's `mg` changed | REFUSED `{field:'mg', exercise_id:'db-bench'}`, the PHONE's own id |
| PR3b | count held equal, one id DUPLICATED in the file | REFUSED `{field:'exercise_id', exercise_id:'db-bench'}`. P-B's multiset really is a multiset |
| PR4 | identical in every PROVED field, a stranger's `athlete_label` | ADMITTED at the controller, and `admittedLocalSourceBasis` for THIS phone returned `null` (NOT ADOPTED). The 1.4 widening, independently reproduced |
| PR5 | `split` as the DOCUMENT shape `{from,map}`, and `split: []` | REFUSED `{field:'split'}` both times |
| PR6 | a period with `from` deleted / with `map` deleted | `{field:'split.from'}` / `LOCAL_SOURCE_NON_JSON` upstream (finding 7) |
| PR7 | one lift `sets: 0`, another `sets: 40`, everything proved agreeing | **ADMITTED**, adopted as `db-bench=0 lat-pulldown=40`, and the next morning's gym card is `blocked / ENGINE_CAPTURE_SESSION_INVALID`, `start=false`, with the import committed (finding 4) |
| PR8 | spec 5 (i) ONE CLOCK PER FILE: six periods on six consecutive days, `asOf` advancing one local day per call | THREW `LOCAL_SOURCE_STALE` after two reads. The controller's own `stamp()` carries `asOf` (`source-admission.mjs:111-112`), so a local day that MOVES inside one walk refuses the whole walk before the rule could be bounded against two days. The hoist at `:224` is real and is belt-and-braces; the midnight straddle the spec feared is already impossible |

## 4. SPEC CONFORMANCE, CHECKED LINE BY LINE

- **1.3, the rule.** `programme(source,ops,{today})` at `:159-198` matches spec
  1.3's diff line for line. PROVED: every period `map` (P-A), the lift id
  multiset with each id once per side (P-B), each lift's `day` and `mg` (P-C).
  BOUNDED: closed `{from,map}` (B-C), `validDay(from)` and `from<=today` (B-A),
  the redundant in-force check (B-B, finding 3). `fields=['day','mg']` and
  `PROJECTED_FIELDS` are SEPARATE constants, so the comparison narrows and the
  record does not. The returned `priority_muscles` is the FILE's.
- **ONE hoisted read.** `:224` `programme(state,ops,{today:currentDay()})` is
  the single call site, it is not in a loop, and `programme()` never calls
  `currentDay()` itself. I grepped all twelve `currentDay` hits in the module:
  `:111-112` define it, `:152/:156` are `reviewSource`, `:224` is the rule, and
  every later hit is after the rule returns. Executed as PR8.
- **The seven retained members in the digest input.** PF-a recomputes the digest
  from the admitted state and asserts every lift row carries
  `['id','day','mg','sets','hi','inc','steps']` with the FILE's values, plus
  `head`/`secondary` where present, and that the committed
  `programme_digest` equals `digest(...,'earned/local-source-programme/v1',...)`
  of that. Re-run green.
- **1.6 + B-1.** `P2_ROW` is narrowed IN PLACE to `['id','day','mg']`; no dead
  constant survives; the `:388` trip-wire (now `model.test.cjs:454-462`) is
  retargeted to the live list and is named CHANGED with BEFORE and AFTER. The
  spec's stop rule is honoured: the ONE red in `model.test.cjs` pre-fix that is
  not an added cell is that trip-wire, which the R2 exemption covers.
- **The first-run branch.** Behaviourally byte-for-byte: `!equal(base.split,
  [setup.split])` and `!equal(base.priority_muscles||[], setup.priority_muscles)`
  survive verbatim inside `(localSource ? ... : ...)` and `(!localSource && ...)`,
  `documentRow(e)` and the `firstRun` tag branch are untouched, and
  `basisSource` validation still sits at `:110`, AFTER the origin comparison,
  exactly where it sat. An unknown `basisSource` still takes the strict
  comparison and then refuses `PLAN_EDIT_BASIS_SOURCE_UNKNOWN` (existing PE16
  cell, green). One new cell varies a first-run basis's `sets` and asserts it
  still refuses, which is the guard against narrowing both branches.
- **Spec 6, the lockdown.** `git diff --name-only 3d002174..HEAD` names 18
  files; `git diff --numstat 3d002174..HEAD -- rebuild/authority rebuild/client
  rebuild/engine rebuild/coach rebuild/m3/setup/port rebuild/m3/w6/host
  rebuild/m3/w7-preview/today rebuild/DECISIONS.md` is EMPTY. Identity, custody,
  retract, unseal, the ledger and `setup-model.mjs` are untouched.
- **`replay-core.cjs`.** `git rev-parse 3d002174:rebuild/m4/import/replay-core.cjs`
  and `HEAD:` are the same blob, `f123128d82c55033540a9258ef9e7c387eb145d6`.
  BYTE-IDENTICAL, as 4.1 predicted.
- **4.4, the stranger fixture.** `STRANGER_SETUP` survives byte for byte with a
  corrected comment and is now cell (e)'s admits-then-not-adopted fixture (PR4
  reproduces it); `STRANGER_WEEK_SETUP` is added beside it; all four call sites
  are retargeted and each is named with before and after in report section 4.
  N-2 is upheld by my own run too: `route.test.mjs` is green at 35/0 and its
  `LOCAL_IMPORT_REBASE_REQUIRED` cell never depended on the programme rule.

## 5. THE GUARD SWEEP, REPEATED WITH MY OWN GREPS

Own script (`%TEMP%\rv-sweep.cjs`, a whole-tree walk over `.cjs`/`.mjs`/`.js`
excluding `node_modules`), four passes: `priority_muscles` (40 hits),
`createCleanInitState` (160 hits), `'steps'` as a field-list literal across
`m3`/`m4`/`engine`/`client` (21 hits), and `first-run-setup` across
`m3`/`m4`/`engine` (18 hits).

**NO THIRD GUARD.** The only places that hold BOTH an athlete basis and the
setup document and compare them are `source-admission.mjs` `programme()` and
`plan-edit-model.cjs`'s local-source branch, which are the two this ticket
moves. Everything else classified:

- `today-entry.mjs:130`, `setup-commands.mjs:46`, `athlete-state.cjs:236` are
  the only other production callers of `createCleanInitState`, and each builds
  or validates a document; none holds a basis to compare it to.
- `measure/measure-host.mjs:24,:109` reads the setup op, and I read the call
  site: `firstEnrolledDateIn()` takes its `effective.local_date` and nothing
  else. Consumer, not a guard. Same conclusion as the author for
  `measure-baseline.mjs:42`, reached independently.
- `plan-edit-commands.cjs:45` `EXERCISE` is the DOCUMENT row vocabulary, read by
  the first-run `documentRow` only.
- `lanes/d/plan-edit/f2-tag-adapter.cjs:166` DOES compare a state's `split` and
  `priority_muscles` against a setup document over retained fields, which is the
  closest thing in the tree to a third guard. It is not one: it is the lane's
  byte-identical copy of F2's `setup-tags.cjs` (asserted by PE16 against blob
  `f3e9561`), `m4/workout/setup-tags.cjs` is NOT in this tree at all, and every
  caller passes `createCleanInitState({setup})` -- a clean-init state at setup
  time, never an admitted import basis. If F2 ever merges, `projectSetupTags`
  should be re-checked against this rule; recorded here so it is not lost.

## 6. COPY

`node` scan for U+2013 and U+2014 over all four changed product files and all
ten changed or added test files: **zero hits in every product file**, and the
product files are pure ASCII. The single hit tree-wide is
`import/test/refusal-route.test.mjs:241`, a `const dash = /[..]/` regex literal
that is the suite's own guard asserting no dash reaches the screen; it is
pre-existing, outside the added lines, and correctly left alone.

The new `COPY.programmeMismatch` exposes nothing: no value, no number, no date,
no label. `refusalLines()` prints the code, then `(field)` and, where the field
is per lift, the lift id, then the sentence. The `field` vocabulary is a closed
set of ten literals chosen by code path and never interpolated; the `exercise_id`
for the `programme()` fields is `ex.id` from `scratch.exercises`, the PHONE's
own (PR3a and PR3b both confirm the phone's id is what comes out). The
`capture_lift` / `capture_sets` ids come from `state.exercises`, which after
admission is the FILE's id list; spec 3.4 names and accepts that widening.
D-PF-g1 reads the rendered box off the real screen and asserts no dash, no
digit, and no label, start date or set count from the bundle; I re-ran it green.

## 7. WHAT I COULD NOT VERIFY

1. **That the owner's real bundle qualifies.** Every admitting cell, mine
   included, qualifies its engine context through a TEST-ONLY producer mapping,
   because DECISIONS:472 BLOCKER 2 is still open and no production producer
   mapping exists in the tree. 241/0 is not a promise that the real file
   qualifies. The author says this; I repeat it because it is the second thing
   that could make the S7 retry fail after finding 1.
2. **The real-midnight rows of cell (i).** I executed the one-clock requirement
   by advancing `asOf` (PR8) rather than by waiting; the moving-clock 60 s wait,
   the true local-midnight rollover and the offline reload are still unexecuted.
   PR8 makes me believe they cannot fail in the way the spec feared, but that is
   an argument, not a run.
3. **Three of cell (f)'s four inner codes.** `capture_producer`,
   `capture_lift` and `capture_membership` are unexecuted. I agree with the
   author's measurement that each needs a hand-built capture, and I did not
   build one, because a stub on the very path the cell claims would be worse
   than the honest gap. They are implemented and readable at `:328-341`.
4. **What was pushed.** I did not contact any remote and read no token, so the
   claim "pushed `eb43fee..05f736c`, no other ref" is unverified here. Locally
   the branch is `rebuild/d-p3-port-fix` at `05f736c` with a clean tree and the
   three commits the report names.
5. **The Train screen's fallback for a stranger's label** (cell (e)'s third
   assertion). PR4 proves the two halves that matter -- admits, not adopted --
   but I did not paint the fallback either.

Reviewer: cowork (Earned PM), lane D independent seat. Probes and logs under
`%TEMP%\rv-*.log`; nothing was committed but this file.
