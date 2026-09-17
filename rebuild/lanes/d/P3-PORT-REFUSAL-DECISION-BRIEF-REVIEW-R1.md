# P3-PORT-REFUSAL: independent review R1

VERDICT: ACCEPT WITH NOTES. The diagnosis is correct and I reproduced it
(11/11 cells green, 35/35 corpus green, no product file touched): the refusal
is source-admission.mjs:146 comparing the bundle's programme split against a
clean init of THIS phone's setup op, and a real phone can only write
split.from = today. The classification (b) stands. What does NOT stand is the
recommendation: OPT-1's promise that "he sees his own history admit" is
refuted by the lane's OWN public fixture, which I measured.

Reviewer: lane D independent, Opus high. Worktree %TEMP%\earned-diag, branch
rebuild/d-p3-port-refusal, HEAD 0d2f3240 on a753b3a8. I wrote no product file
and no cell; every probe below ran from %TEMP%, outside the worktree.

## 1. Re-run: the cells and the corpus are green, and the branch is cells only

    node --test rebuild\lanes\d\p3-port-refusal\owner-route.test.mjs
                rebuild\lanes\d\p3-port-refusal\programme-bracket.test.mjs
    tests 11  pass 11  fail 0  duration_ms 2679.4077

All eleven named cells ran, including D-PRR-1 (360.2ms) and D-PRR-2 (234.5ms).

The corpus the brief says missed this is rebuild/m3/w7-preview/import/test
(support.mjs lives there, not under m4). I ran its five suites:

    node --test rebuild\m3\w7-preview\import\test\{route,refusals,
      refusal-route,live-clock,page-bundle}.test.mjs
    tests 35  pass 35  fail 0  duration_ms 5480.1286

    git diff --stat a753b3a8..0d2f3240
     rebuild/lanes/d/P3-PORT-REFUSAL-DECISION-BRIEF.md   | 120 ++
     .../lanes/d/p3-port-refusal/owner-route.test.mjs     | 124 ++
     .../d/p3-port-refusal/programme-bracket.test.mjs     | 304 ++
     3 files changed, 548 insertions(+)

Confirmed: three lane-D files, no product file, so the corpus MUST still be
green and is.

## 2. Line numbers: all verified but one, and one shape claim is FALSE

`findstr /n` over rebuild/m3/w6/local/source-admission.mjs confirms every
cited line, verbatim:

    140: function programme(source,ops){
    142:  if(setups.length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');const op=setups[0];
    143:  if(op.schema_version!==2||!Setup.validate(op,id=>ops[id]))fail(...)
    146:  if(encode(source.split)!==encode(scratch.split)||source.exercises?.length!==scratch.exercises.length)fail(...)
    147:  for(const ex of scratch.exercises){...for(const key of fields)...}
    148:   const tag=op.payload.tags[ex.id];for(const k of ['head','secondary'])...
    149:  if(encode(source.priority_muscles??[])!==encode(op.payload.setup.priority_muscles))fail(...)
    171:  try{programmeBasis=programme(state,ops);}catch(e){issue(e.code);}
    270/272/273/284: the four fail(...) inside resolveCapturedLayout
    289: }catch(e){issue('LOCAL_SOURCE_WORKOUT_UNRESOLVED');}

`programme()` is reached only through `replay()`, and `replay()` has exactly
one call site, :315 inside `prepareSource`. So the brief's "at CONFIRM, not at
review" is right. (Note for completeness: `reopen` at :373 and `rollback` at
:374 also route through `prepareSource`, so they hit :146 too.)

setup-model.mjs, verbatim:

    622:          sets: answers.sets,
    623:          hi: answers.hi,
    633:        split: { from: today, map },

with the comment at :630-632 "split.from is TODAY'S LOCAL date, always, and the
flow offers no start date". Both claims TRUE.

replay-registry.cjs: the F4 rule runs :61-:63 and :63 is its closing line,
"exist, and anything else refuses LOCAL_SOURCE_PROGRAMME_UNRESOLVED". Citation
acceptable.

MINOR, off by one. The brief cites `import-screen.mjs:100` for
REFUSAL_SENTENCE. It is :101; :100 is the last line of the comment above it.
:93 for `review-refused` is right:

    92:export const RETRACT_REASON = Object.freeze({
    93:  refused: 'review-refused', cancelled: 'athlete-cancelled' });
    101:export const REFUSAL_SENTENCE = Object.freeze({ BUNDLE_AUTH_FAILED: COPY.authFailed });

and `RETRACT_REASON.refused` is used at :354, :375 and :395, which is every
post-custody refusal path, so "the screen's label for EVERY refusal after
custody" holds. `refusalLines` at :111-:117 pushes a sentence only when
`REFUSAL_SENTENCE[code]` exists, so the owner does get one machine word and
nothing else. TRUE.

FALSE, and it matters for costing OPT-1. The brief says: "`split` is
`{from, map}`, and `from` is compared." That is the SETUP DOCUMENT's shape.
The value :146 compares is the STATE's `split`, and in the state it is an
ARRAY of split periods. Measured (probe from %TEMP%, importing the shipped
setup-model.mjs and the public journey fixture):

    a.split = [{"from":"2026-08-31","map":{"0":"REST",...,"5":"U","6":"L"}}]
    split isArray? true  len 1

So OPT-1 is not "drop one field". It is "compare the map of each split period
across an array whose length the file controls", and the author must decide
what a file carrying more than one period means. That is not a one line change
and the brief's "one line plus cells, half a day" is priced off a wrong shape.

## 3. The "S5-then-S6 excluded" measurement is true but does not measure what
## the sentence claims

The four (in fact five) setup files are setup-app.mjs, setup-check.mjs,
setup-commands.mjs, setup-host.mjs, setup-model.mjs under
rebuild/m3/w7-preview/today. I ran the diff over all five plus
source-admission.mjs:

    git diff --stat 122f7252 02d3219a -- <the five setup files> source-admission.mjs
     rebuild/m3/w6/local/source-admission.mjs | 189 +++++++++++++++++++++++++--
     1 file changed, 179 insertions(+), 10 deletions(-)

So: the five setup files are EMPTY across that window, as claimed. But the
file that HOLDS the refusing check changed by +179/-10 in the same window, and
the window as a whole is 161 files and 23,744 insertions. "The four setup
files are empty" therefore does not exclude S5-then-S6 as stated.

I did the measurement the claim needs myself. The hunk headers in that diff are
at old lines 5, 92, 120, 131, 169 and 181. `programme()` occupies old lines
~83-94; the only hunk that touches it, `@@ -92,7 +149,10 @@`, contains
`:146`, `:149` and the `return` as CONTEXT lines and changes nothing but the
`replay(held)` signature below it. rebuild/m4/workout/athlete-state.cjs, which
defines `createCleanInitState`, does not appear in the S5 to S6 diff at all.

CONCLUSION: the brief's conclusion survives. `programme()` and
`createCleanInitState` are byte identical across S5 to S6, so S5-then-S6 did
not introduce this refusal. The brief should carry THAT sentence and that
evidence, not the setup-file one.

## 4. Attacking the cells: the REAL page cell is real, but the SETUP SCREEN is
## the one thing on the path it does not run

What I checked and found genuinely unstubbed on the refusal path:

- The page. `shellWindow()` (support.mjs:271) is JSDOM over
  `design.shellHtml()` plus `design.templateHtml()`, and owner-route.test.mjs
  boots it with `Entry.boot({document, hosts: era, now})` where `Entry` is the
  shipped `today-entry.mjs` (support.mjs:268).
- The seal. `sealInventedBundle` (support.mjs:84-108) `spawnSync`s the REAL
  `rebuild/m3/setup/port/port.cjs` with `--source` and `--out` in the OS temp
  folder and reads back the bundle and the passphrase file. Real PBKDF2 and
  AES-GCM, real unseal through the screen's Unlock tap.
- The registry. `import-screen.mjs:343` builds
  `Production.createProductionProducerRegistry({hash: platform.hash})`. This is
  the production mapping, so DECISIONS:472 BLOCKER 2 is discharged and the
  owner-route cells really do run it. (programme-bracket.test.mjs uses the
  TEST-ONLY `producerRegistryFor(..., {days: DAYS})` instead. Fair for a
  controller bracket, but the brief presents all eleven cells as one thing.)
- IndexedDB is fake-indexeddb and the clock is an injected instant. Both are
  the repo's standard harness, not a weakening.
- The file input is simulated: `pickBundle` puts the bytes on the input because
  "jsdom gives no file chooser" (support.mjs:295-298). Disclosed, unavoidable.

No cell weakens a guard, and D-PRR-1 asserts more than the brief claims: the
durable record before and after, `listImportRetractions` length 1 with reason
`review-refused`, the picker reset, and
`Screen.REFUSAL_SENTENCE.LOCAL_SOURCE_PROGRAMME_UNRESOLVED === undefined`.

THE GAP. Section 4 of the brief says D-PRR-1 runs "setup through the real setup
lane". It does not. `phone()` in owner-route.test.mjs hands a HAND-BUILT
document to `era.createSetupHost(...).save({setup, tags})`. I grepped
setup-host.mjs and setup-commands.mjs for `split`: zero hits in either. The
host accepts ANY start date. The only thing in the tree that forces today is
`setup-model.mjs:633`, and that is exercised in D-PR-6 alone, never composed
with the import route in one cell. The brief's phrase overstates the cell.

## 5. FINDING (MAJOR): split.from is the only differing field IN THE CELL, and
## that is exactly why the cell cannot answer the question OPT-1 turns on

D-PR-2's bracket is honest on its own terms. `FILE_SETUP` and `PHONE_SETUP` are
`clone(SETUP)` with `PHONE_SETUP.split = {from: SETUP_DAY, map: clone(...)}`,
and I measured the two clean-init states:

    split.map equal?    true
    exercises equal?    true
    priority equal?     true
    top-level differing keys: ["blackout","model","split"]

`blackout` and `model` are not compared by `programme()`, so within :146 to
:149 `split.from` IS the only differing field and D-PR-2 would pass under
OPT-1. The bracket is sound.

But `PHONE_SETUP` is not a document a real phone can hold. The public journey
fixture that stands in for the old app carries PER-LIFT variation
(journey-fixture.cjs:17-19):

    db-bench     sets: 3, hi: 10
    lat-pulldown sets: 2, hi: 12
    leg-press    sets: 3, hi: 12

and setup-model.mjs:622-623 writes ONE `answers.sets` and ONE `answers.hi` onto
every lift. So `PHONE_SETUP`, which keeps the fixture's per-lift numbers and
only moves the date, is a document the shipped setup screen could NEVER write.
The same is true of `FILE_SETUP` in D-PR-1 and D-PRR-2. Both "green" cells are
green only against a phone that cannot exist.

I ran :146 to :149 by hand with `split.from` dropped (OPT-1), against the
fixture file and a phone document built the way the screen builds one (global
sets 3, global hi 10, from = 2026-09-16):

    OPT-1 applied, fixture file vs a REAL-screen phone document:
    refusals still firing = ["P5:lat-pulldown.sets","P5:lat-pulldown.hi","P5:leg-press.hi"]
    file  per-lift = db-bench:3/10 lat-pulldown:2/12 leg-press:3/12
    phone per-lift = db-bench:3/10 lat-pulldown:3/10 leg-press:3/10

THREE P5 refusals survive OPT-1 on the lane's OWN fixture. So:

- OPT-1's line "He sees his own history admit on a phone he set up this week"
  is an OVERCLAIM. The brief's own section 2 says the opposite ("A second makes
  the rule unsatisfiable even if `from` were excluded") and its STOPS (1)
  concedes "OPT-1 may be necessary and not sufficient". Section 5 should not
  promise what section 2 denies.
- Per-lift `sets` and `hi` variation is not only POSSIBLE in an old app
  programme, it is what the tree's own public example of one looks like.
  `createCleanInitState` accepts it (I fed it `sets: 4` on one lift and
  `hi: 8` on another; both carried through). `port.cjs` treats `exercises` as
  an opaque array it must not lose (:259, :490); it imposes no uniformity.
  `STRANGER_SETUP` in support.mjs:77-79 is built by varying exactly this field.
- Therefore P5 at :147 refusing right after OPT-1 lands is the EXPECTED case,
  not a tail risk, unless the owner happened to answer the old app with one
  set count and one rep target for every lift.

## 6. Is split.from an identity or a safety fact? Not identity. Not inert.

DECISIONS:472 (a), verbatim, supports the brief exactly: "the bundle carries NO
athlete identity: a bundle differing only by athlete_label ADMITS, programme()
compares only programme fields, and the ONLY identity guard is Joe's own
identityConfirmed answer". So the brief's "`split.from` was never an identity
fact" is TRUE, and the F4 rule at replay-registry.cjs:61-63 says the first-run
document is what the file is proved AGAINST, without naming which fields. OPT-1
does not contradict either.

But "the enrolment date", the brief's framing, undersells it. Measured:

    a.blackout = {"until":"2026-08-30"}   b.blackout = {"until":"2026-09-15"}
    a.model = {"anchorISO":"2026-08-31",...} b.model = {"anchorISO":"2026-09-16",...}

`split.from` anchors the blackout window and the weight model's anchor. Inside
a single state that is self consistent, and the admitted state is the FILE's
own, so OPT-1 admits a coherent earlier anchor rather than a broken one. No
safety break there.

Two real consequences OPT-1 must answer for:

1. A WIDENING, small but named. Today a stranger's file with the same programme
   AND the same start date already admits (DECISIONS:472 (a)). OPT-1 widens
   that to a stranger with the same programme who started on a different date.
   Acceptable only because :472 (a) has already ruled this is not the identity
   guard, but it should be stated, not waved past.
2. A GUARD THE EQUALITY WAS SILENTLY DOING. setup-model.mjs:630-632 warns that
   "a future `from` passes the constructor and then refuses at the first gym
   visit (workout-host.mjs:39-48 WORKOUT_SPLIT_NOT_IN_FORCE)". Equality with a
   today-dated phone document currently makes a future-dated file impossible.
   Drop it and a file whose split starts tomorrow admits and then dead-ends at
   his first gym visit. OPT-1 should keep a bound (`from` not after today), not
   just delete the field.

## 7. Owner-decidable routes: the dismissal is right, the reasoning is thin

The brief asserts "not owner-decidable" and moves on. I checked the three
routes it should have named and rejected in writing:

- RE-RUNNING SETUP. Ruled out by the code the brief already quotes: P1 at :142
  requires EXACTLY ONE op with `payload.profile === Setup.PROFILE`, so a second
  setup turns one refusal into another. The fact is in the brief's own table
  and never connected to section 5.
- IMPORTING UNENROLLED. Also ruled out by :142 (zero setups fails too), and the
  corpus cell P3-U5 shows an unenrolled installation is offered no route at
  all. So there is no "import first, set up after" order.
- RE-PORTING ON THE PC with `split.from` rewritten to his setup day. This is
  genuinely owner-side, needs no phone code, and the brief never names it. It
  should be named and REJECTED: it falsifies his history's start date, moves
  `blackout.until` and `model.anchorISO` with it, and still leaves the per-lift
  `sets`/`hi` disagreement of finding 5. Silence here reads as "not considered".

A SETUP START-DATE QUESTION is a product change, not an owner route, so the
brief is right to leave it out of "owner-decidable"; but it belongs in the
options list as the alternative to widening :146, because it is the only fix
that keeps the equality rule intact. It does not fix `sets`/`hi` either.

Classification (b) product defect: I agree, and finding 5 strengthens it. Two
independent fields of the comparison are unanswerable by the shipped flow, not
one.

## 8. The :289 renaming claim is TRUE

    289: }catch(e){issue('LOCAL_SOURCE_WORKOUT_UNRESOLVED');}

The `try` opens at :267 and encloses `resolveCapturedLayout`, whose four
`fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED')` calls are at :270, :272, :273 and
:284. The catch binds `e` and never reads `e.code`, so all four are renamed on
the way out. Confirmed defect, correctly scoped as not the owner's.

## 9. "Why the corpus missed it" is right in substance, FALSE in one word

The mechanism is confirmed: support.mjs:56-57 seals from
`createCleanInitState({setup: SETUP})` and support.mjs:112-119 `firstRun()`
saves that SAME `SETUP`, so every admitting cell has an installation whose
setup document IS the file's programme.

But "They never run `setup-model.mjs`" is false as written: support.mjs:27 is
`import { createCleanInitState } from '../../today/setup-model.mjs';`. What
they never run is that file's `document()` builder, which is the only thing
that decides `split.from` and the only thing that flattens `sets`/`hi`. Fix the
wording, because the corrected sentence is the one that explains finding 5 too.

## 10. Smaller notes

- The brief's issue shape in section 1 shows `issues:[{code:...}]` with no
  `op_id`. Confirmed at :171, `issue(e.code)` passes no id, and D-PRR-1 asserts
  the screen shows `{code, detail: null}`.
- The brief says the eleven cells walk "the real Import route". Only the two
  D-PRR cells do; the nine D-PR cells drive `createLocalSourceController`
  directly with a test producer registry. Both are legitimate, they are just
  not the same evidence and are presented as one table.
- D-PR-6 proves `split.from === today` through the real reducer but asserts
  nothing about `sets`/`hi`, which is the field pair that decides OPT-1's
  sufficiency. A one line addition to that cell
  (`new Set(built.setup.exercises.map(e => e.sets)).size === 1`) would have
  caught finding 5 inside the lane.
- No cell composes the real setup MODEL with the real import ROUTE. That
  composition is the missing red cell, and it is the cell that would go green
  the day a sufficient fix lands.

## RECOMMENDATION: OPT-1 + OPT-3, in ONE build, with OPT-3 non-negotiable

Not OPT-1 alone, and not OPT-2 outright.

WHY NOT OPT-1 ALONE. Finding 5 measures it: on the lane's own fixture, OPT-1
leaves three P5 refusals. His file cannot be read by anyone, so nobody knows
whether his old programme used one set count and one rep target across every
lift. If it did not, OPT-1 alone sends him back to the phone to receive the
SAME bare word a second time, and we learn NOTHING from the retry. That is the
expensive failure: a retry cycle that produces no evidence, after which we are
exactly where we are now and have spent his patience.

WHY NOT OPT-2 OUTRIGHT. OPT-2 costs two to three days of review on the data
path, and every widened field needs its own retained-not-projected argument
against replay-registry.cjs:61-63. We do not yet know that any of it is needed
beyond `sets` and `hi`. Buying it blind is paying days for a guess.

WHY OPT-1 + OPT-3. OPT-3 is the cheap instrument that makes the retry a
MEASUREMENT instead of a coin flip. Put the disagreeing field name on the issue
and a sentence under the code, and his next tap either admits or tells us
exactly which fields differ, WITHOUT anyone opening his ledger. That is the
only way to size OPT-2 honestly. OPT-3 also fixes a defect that stands on its
own: today, per D-PR-3, a stranger's file and the owner's own history produce
the identical word, so the screen cannot tell him "this is not your file" from
"you set this phone up today".

Do them together, in one build, so one retry carries both the fix and the
instrument. Add to OPT-1, from findings 2 and 6: compare the split MAP across
the array of periods (not a `.from` deletion), and keep a bound that `from` is
not after today so a future-dated file does not admit and then dead-end at
WORKOUT_SPLIT_NOT_IN_FORCE.

COST OF THE WRONG CHOICE. OPT-1 alone: one owner retry cycle on the phone that
returns no information, then this decision again. OPT-2 outright: two to three
days of data-path review, some of it certainly unnecessary. The first is
cheaper in hours and dearer in his trust; OPT-1 + OPT-3 avoids both, because
its worst case is a retry that comes back naming the field.

## What I could not verify, and why

1. WHICH FIELDS OF HIS FILE ACTUALLY DISAGREE. Reading his bundle or his
   ledger is forbidden by this ticket and I did not attempt it. Every number in
   this review comes from the PUBLIC journey fixture and from the shipped
   modules. So finding 5 proves that OPT-1 CAN be insufficient and that the
   tree's own example of an old programme makes it insufficient; it does not
   prove his file does. That is precisely why I want OPT-3 in the same build.
2. WHETHER THE OLD APP'S UI LET HIM VARY sets/hi PER LIFT. The old app is not
   in this tree. I established that the STATE SHAPE permits it, that
   `createCleanInitState` accepts it, that `port.cjs` preserves it without any
   uniformity check, and that the tree's own fixture of an old programme uses
   it. I could not establish what his old screens offered.
3. THE REAL FILE CHOOSER. `pickBundle` puts bytes on the input because jsdom
   has none. Everything after the input is real, but nothing here exercises a
   phone's actual file picker.
4. MULTI-PERIOD SPLITS. I confirmed the state's `split` is an array and that
   clean init produces exactly one period. I did not find the writer that would
   ever append a second, so I cannot say whether a real old-app file can carry
   more than one. OPT-1's author must answer that before writing the
   comparison.
5. THE FULL S5 TO S6 WINDOW. It is 161 files and 23,744 insertions. I verified
   that `programme()`, `createCleanInitState` and the five setup files are
   unchanged across it, which is what this refusal turns on. I did not read the
   other 155 files.
6. THE OWNER'S OWN RETRY. Nothing here was run on a phone. Everything is jsdom
   over fake-indexeddb on the PC.
