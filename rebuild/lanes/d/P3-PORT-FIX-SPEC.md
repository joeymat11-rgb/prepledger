# P3-PORT-FIX-SPEC: the programme admission rule, rewritten (OPT-2 + OPT-3)

Lane D, SPEC. Author Opus high. No product file is changed by this branch; the
build is a separate ticket and starts only on the PM's acceptance of this spec.

Facts of record this spec builds on: DECISIONS:472 (a), :506 (the PM ruling),
:507 (the owner's answer and his stated expectation), :439 (the real-world
invariant rows and the stub-free rule), the diagnosis
`rebuild/lanes/d/P3-PORT-REFUSAL-DECISION-BRIEF.md` and its independent review
`...-REVIEW-R1.md`. Every line number below was read in the worktree at
3d002174 and is cited file:line.

---

## 1. THE RULE, BEFORE AND AFTER

### 1.1 What stands today, verbatim

`rebuild/m3/w6/local/source-admission.mjs:140-150`:

    140| function programme(source,ops){
    141|  const setups=Object.values(ops).filter(o=>o.payload?.profile===Setup.PROFILE);
    142|  if(setups.length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');const op=setups[0];
    143|  if(op.schema_version!==2||!Setup.validate(op,id=>ops[id]))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    144|  const scratch=createCleanInitState({setup:op.payload.setup});
    145|  const fields=['id','day','mg','sets','hi','inc','steps'];
    146|  if(encode(source.split)!==encode(scratch.split)||source.exercises?.length!==scratch.exercises.length)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    147|  for(const ex of scratch.exercises){const matches=source.exercises.filter(x=>x.id===ex.id);if(matches.length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');for(const key of fields)if(encode(matches[0][key])!==encode(ex[key]))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    148|   const tag=op.payload.tags[ex.id];for(const k of ['head','secondary'])if(encode(matches[0][k]??(k==='head'?null:[]))!==encode(tag[k]))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');}
    149|  if(encode(source.priority_muscles??[])!==encode(op.payload.setup.priority_muscles))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    150|  return {op_id:op.op_id,split:source.split,exercises:source.exercises.map(...),priority_muscles:op.payload.setup.priority_muscles};

and its one call site, `:171`:

    171|  try{programmeBasis=programme(state,ops);}catch(e){issue(e.code);}

`source` is the migrated candidate state of the FILE
(`source-admission.mjs:164`, `prep.candidateState()`); `scratch` is a clean
init of THIS phone's own first-run document. The shapes differ: the setup
DOCUMENT carries `split: {from, map}` (`setup-model.mjs:633`) and
`createCleanInitState` stores it as a PERIOD ARRAY,
`athlete-state.cjs:234` and the engine's own reader `plan.cjs:11-22`, which
walks `s.split` as a list and lets the LAST entry with `from <= iso` govern
the day. So `:146` compares an array against an array, and the file controls
its length. `setup-model.mjs:630-633` writes `from: today`, always, with the
flow offering no start date, and `:622-623` writes one global `sets` and one
global `hi` onto every lift. Two independent fields of the comparison are
therefore unanswerable by the shipped flow (REVIEW-R1 section 5, measured:
three surviving `:147` refusals on the lane's own public fixture).

### 1.2 The new rule, in prose

PROVED against the phone's setup op (a disagreement refuses):

- P-A. `source.split` is a non-empty array, and EVERY period entry's `map` is
  deep-equal to the phone's one `scratch.split[0].map`. The period array is the
  file's history of when its week changed; its LENGTH is not proved, because a
  phone that has never edited its week has exactly one period and an old app
  that ran the same week for two years may still carry several entries that
  differ only in `from`. What must hold is that every week the file ever ran is
  the week this phone's owner just described, day letter for day letter.
- P-B. The lift ids: the id multiset of `source.exercises` equals the id
  multiset of `scratch.exercises`, each id appearing exactly once on each side.
  This subsumes and replaces the exercise COUNT test at `:146`, which is kept
  as its own named check so a count disagreement refuses under a field name of
  its own rather than as a missing id.
- P-C. For each id, `day` and `mg` are deep-equal.

BOUNDED (a disagreement refuses, but nothing on the phone is compared):

- B-A. Every period entry's `from` is a valid day (`validDay`) and is NOT AFTER
  the admission's own `currentDay()`. `currentDay()` is the controller's clock,
  the device's LOCAL day under the source engine context already used at `:171`
  and `:292`, taken once per replay, and it is the same clock the F1 reading
  bound (`row.date>currentDay()`, `:177`) already reads. No UTC day and no file-supplied offset is used.
- B-B. At least one period entry has `from <= currentDay()`, which is exactly
  `splitInForceOn` at `workout-host.mjs:39-41`.

What B-A protects. The equality at `:146` was silently doing a safety job:
with the phone's document always dated today, a file whose split starts
TOMORROW could never match, so it could never be admitted. Widening the rule
without a bound would admit such a file and then dead-end the owner at his
first gym visit, `WORKOUT_SPLIT_NOT_IN_FORCE` (`workout-host.mjs:43-48`, whose
reason line reads "no split entry has from <= <day>, so the engine would fall
back to a week this athlete never chose"), with the import already committed
and only a retract to get out of. The bound keeps that impossible by name,
at admission, where nothing has been written yet. This is REVIEW-R1 finding 6
(2), adopted.

RETAINED, not proved (dropped from the comparison entirely; see 1.4 for the
argument on each): `sets`, `hi`, `inc`, `steps`, the `head` and `secondary`
tags, and `priority_muscles`.

### 1.3 The new rule, as the code the build should write

A diff-style block against `source-admission.mjs:140-150`. Names and helpers
are the file's own (`fail`, `encode`, `validDay`, `currentDay`). The build may
spell it differently; what it may not do is prove a field this spec retains or
retain a field this spec proves.

    -function programme(source,ops){
    +/* THE PROGRAMME RULE (P3-PORT-FIX, DECISIONS:506/:507). The imported file is
    +   proved to be THIS athlete's programme by its SHAPE, not by its numbers: the
    +   week he just described, the lifts he just listed, and where each one sits.
    +   His set counts, rep targets, increments, ladders, volume tags and stated
    +   priorities are RETAINED from the file and never proved against the one-number
    +   document the setup flow can write (setup-model.mjs:622-623,:633), because
    +   the flow cannot ask him for them and a rule he cannot answer is not a rule.
    +   Each retention carries its own argument in lanes/d/P3-PORT-FIX-SPEC.md 1.4. */
    +function programme(source,ops,{today}){
      const setups=Object.values(ops).filter(o=>o.payload?.profile===Setup.PROFILE);
    - if(setups.length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');const op=setups[0];
    - if(op.schema_version!==2||!Setup.validate(op,id=>ops[id]))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    + if(setups.length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'setup_document'});const op=setups[0];
    + if(op.schema_version!==2||!Setup.validate(op,id=>ops[id]))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'setup_document'});
      const scratch=createCleanInitState({setup:op.payload.setup});
    - const fields=['id','day','mg','sets','hi','inc','steps'];
    - if(encode(source.split)!==encode(scratch.split)||source.exercises?.length!==scratch.exercises.length)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    + const fields=['day','mg'];
    + const periods=Array.isArray(source.split)?source.split:null;
    + const week=scratch.split[0].map;
    + if(!periods||!periods.length)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split'});
    + for(const p of periods){
    +  if(encode(p?.map)!==encode(week))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split.map'});
    +  if(!validDay(p?.from)||p.from>today)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split.from'});
    + }
    + if(!periods.some(p=>p.from<=today))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split.from'});
    + if(source.exercises?.length!==scratch.exercises.length)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'exercises'});
      for(const ex of scratch.exercises){
    -  const matches=source.exercises.filter(x=>x.id===ex.id);if(matches.length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    -  for(const key of fields)if(encode(matches[0][key])!==encode(ex[key]))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    -  const tag=op.payload.tags[ex.id];for(const k of ['head','secondary'])if(...)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');}
    - if(encode(source.priority_muscles??[])!==encode(op.payload.setup.priority_muscles))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    + const matches=source.exercises.filter(x=>x.id===ex.id);
    + if(matches.length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'exercise_id',exercise_id:ex.id});
    + for(const key of fields)if(encode(matches[0][key])!==encode(ex[key]))
    +  fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:key,exercise_id:ex.id});
    + }
      return {op_id:op.op_id,split:source.split,exercises:source.exercises.map(...),
    -  priority_muscles:op.payload.setup.priority_muscles};
    +  priority_muscles:source.priority_muscles??[]};
     }

and at the call site:

    -  try{programmeBasis=programme(state,ops);}catch(e){issue(e.code);}
    +  try{programmeBasis=programme(state,ops,{today:currentDay()});}
    +  catch(e){issue(e.code,null,{field:e.field,exercise_id:e.exercise_id});}

Two notes on the returned basis. First, the `fields` list the returned
`exercises` are projected through must KEEP `sets`, `hi`, `inc` and `steps`
(and `head`/`secondary` where present): the return value is the PROGRAMME
DIGEST input at `:325`
(`digest(...,'earned/local-source-programme/v1',replayed.programmeBasis)`),
and a basis that stopped carrying the retained fields would stop binding them,
which would be a real weakening. Only the COMPARISON narrows; the record of
what was admitted does not. Second, `priority_muscles` in the returned basis
must move from the phone's setup op to the FILE's value, because after this
change the file's value is the one that lands in the admitted state and the
digest must name what was admitted.

The helper `fail` is `const fail=code=>{const e=new Error(code);e.code=code;throw e;};`
(`source-admission.mjs:80`). The build widens it to
`const fail=(code,detail)=>{const e=new Error(code);e.code=code;if(detail)Object.assign(e,detail);throw e;};`
which is backwards compatible with all twenty-odd existing call sites.

### 1.4 RETAINED, NOT PROJECTED: the argument for each dropped field

The vocabulary is the replay's own. A family is PROJECTED when its record is
run through an engine call and moves a figure in the admitted state; it is
RETAINED when the record is kept as the athlete's own and nothing downstream is
computed from it (`source-admission.mjs:200-218`, F7 and F8 are the worked
examples). The phone's setup op has always been F4 and RETAINED
(`:195`, `families.push({family:'F4',state:programmeBasis?'retained':'unresolved',...})`):
nothing in `programme()` ever wrote a byte of it into `state`, because `state`
is the FILE's migrated state from `:164` and `programme()` only reads. What
changes here is only WHICH of its fields the file is asked to agree with.
For each one, where its value ends up, who reads it, and why the phone's value
may be left aside.

- `sets`. Ends up on `state.exercises[i].sets` from the FILE. Read by
  `engine/today.cjs:111` (the target array is `new Array(Math.max(1,e.sets||1))`),
  `:128-129` (the previous session's lines are sliced and padded to `e.sets`)
  and `:182` (the runway says "arming: N of M sets on file"), and by
  `source-admission.mjs:273` when a recorded capture's slot count is checked.
  The phone's value is one number the setup flow wrote onto every lift
  (`setup-model.mjs:622`); it is not an answer about this lift at all. Leaving
  it aside costs nothing to identity, because a set count is not a name, and
  nothing to safety, because the file's own count is what its own recorded
  sessions were performed under, which is exactly what `:273` verifies.
- `hi`. Ends up on `state.exercises[i].hi` from the FILE. Read by
  `engine/today.cjs:129` (the pad-down floor for a missing line) and
  `engine/volume.cjs:28` (`coarseLifts` reports `hi` as the top of the rep
  window). It is the rep target, and the setup flow writes one global value for
  every lift (`setup-model.mjs:623`). Same argument as `sets`: the owner
  confirmed at DECISIONS:507 that his real programme carries different rep
  targets per lift, so the phone's single value is the LESS true of the two and
  proving against it refuses the truth.
- `inc`. Ends up on `state.exercises[i].inc` from the FILE. Read by
  `engine/progression.cjs:325`, `:370`, `:382` and `:416`, which is the whole
  of the next-load arithmetic when a lift has no explicit ladder. It is the
  plate increment of the owner's actual equipment. The setup flow asks for it
  per lift (`setup-model.mjs:606,:624`), so the phone's value is not fabricated,
  but it is an answer typed this week about equipment the FILE has been using
  for months; the file's own value is the one its own recorded loads move by,
  and admitting a state whose `inc` disagrees with its own load history would
  make the first proposed step wrong. Retaining the file's value is the safer
  of the two, not the looser.
- `steps`. Ends up on `state.exercises[i].steps` from the FILE. Read by
  `engine/progression.cjs:313` (a lift with two or more rungs already has a
  ladder and is left alone) and `:347` (`loadRungs`). Same argument as `inc`
  and stronger: the file's ladder is the set of loads that actually exist on
  his rack and that his own history already sits on. A clean init built from
  `setup-model.mjs:625` writes `rungs.length ? rungs.slice() : [first]`, so a
  phone whose owner skipped the ladder question carries a one-element array
  that would refuse every real ladder in the file.
- `head` and `secondary` (the volume tags). End up on
  `state.exercises[i].head` / `.secondary` from the FILE. Read by
  `engine/volume.cjs:35` (`volBucket = (ex) => (ex && (ex.head || ex.mg)) || null`),
  which is the bucket the weekly hard-set ledger counts into, and by the lend
  table at `:41` for the half-credit convention. `mg` is PROVED (P-C) and is
  the fallback bucket, so a file whose `head` is absent still buckets exactly
  where the phone's `mg` says. What is left aside is only the finer region
  label and the lend list, both of which are catalogue enrichment
  (`setup-model.mjs:608-616` and its comment: "the credit WHOLE, head and all")
  rather than an answer the owner gave. A file carrying richer tags than this
  week's catalogue resolved is the normal case, not a suspicious one, and the
  ledger it feeds is a count of his own sets, not a safety gate.
- `priority_muscles`. Ends up on `state.priority_muscles` from the FILE.
  Read by NOTHING: `athlete-state.cjs:313-316` carries it verbatim with the
  comment "No engine reader on the genSession/rirPlan path consumes this
  member", and a tree-wide `git grep priority_muscles` finds no reader in
  `rebuild/engine`, `rebuild/coach`, `rebuild/m3/w7-preview/today` or
  `rebuild/m4` outside the constructor's own validation
  (`athlete-state.cjs:243-245`) and this comparison. Lane C recorded the same
  fact independently (`lanes/c/dad-first-run/A4-REPORT-ANNEX.md:517`,
  "consumed by no reader"). Proving an inert field can only refuse; it can
  never protect anything.

The widening this accepts, stated and not waved past (REVIEW-R1 finding 6 (1)):
a stranger's file that happens to carry the same week, the same lift ids and
the same day and mg already admits today (DECISIONS:472 (a): "the bundle
carries NO athlete identity ... the ONLY identity guard is Joe's own
identityConfirmed answer"). This rule widens that to a stranger whose file
also differs in start date, set counts, rep targets, increments, ladders, tags
and priorities. That is a real widening of a guard that was never the identity
guard, and it is acceptable only because :472 (a) already ruled where the
identity guard lives. Nothing in this ticket touches that guard: see section 6.

### 1.5 The F4 family evidence rule, restated

`rebuild/m4/import/replay-registry.cjs:58-63`, verbatim:

    58|  Object.freeze({module: 'rebuild/m3/w7-preview/today/setup-commands.mjs', class: 'event',
    59|    kinds: Object.freeze(['fact']), profiles: Object.freeze(['earned/first-run-setup/v1']),
    60|    disposition: 'family', family: 'F4',
    61|    rule: 'programme evidence: the first-run document is the programme admission proves the '
    62|      + 'imported file against, and is RETAINED once that proof stands; exactly one may '
    63|      + 'exist, and anything else refuses LOCAL_SOURCE_PROGRAMME_UNRESOLVED'}),

The rule has three clauses and the new comparison satisfies all three.

1. "the first-run document is the programme admission proves the imported file
   against". Still true and still the ONLY thing it is proved against: P-A,
   P-B and P-C all read `scratch`, the clean init of that one document, and
   nothing else. No other record, and no default, becomes evidence. What
   narrows is the set of fields, not the source of the evidence.
2. "and is RETAINED once that proof stands". Unchanged: `:195` still pushes
   `{family:'F4',state:programmeBasis?'retained':'unresolved'}` for the setup
   op, and the op is still never projected into state.
3. "exactly one may exist, and anything else refuses
   LOCAL_SOURCE_PROGRAMME_UNRESOLVED". Unchanged: `:142` still refuses zero or
   two, now under `field:'setup_document'`, and the code is the same code.

The build MUST restate clause 1's field list in the rule text itself, so the
registry stops implying a comparison it no longer describes. Proposed text,
replacing `:61-63`:

    rule: 'programme evidence: the first-run document is the programme admission '
      + 'proves the imported file against, and is RETAINED once that proof stands. '
      + 'The proof is the SHAPE of the programme and nothing else: every split '
      + 'period map, the lift ids, and each lift day and mg, with every split '
      + 'from bounded not after today. Set counts, rep targets, increments, '
      + 'ladders, volume tags and priority muscles are RETAINED from the file, '
      + 'never proved, because the first-run flow cannot state them per lift. '
      + 'Exactly one document may exist, and anything else refuses '
      + 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED'

---

## 2. WHICH PROGRAMME GOVERNS AFTER IMPORT

### 2.1 The trace, end to end

1. `source-admission.mjs:164`: `let state=prep.candidateState()`. This is the
   FILE's migrated state, produced by `m4/import/replay-core.cjs`
   `createImportPreparation`. Its `split`, its `exercises` and their `sets`,
   `hi`, `inc`, `steps`, `head`, `secondary` and its `priority_muscles` are the
   OLD APP's, not the phone's.
2. `replay()` mutates that state only by PROJECTING the phone's own native
   records onto it: reads at `:179`, food at `:219-222`, workouts through the
   projector at `:286`. No step of `replay()` writes any part of the phone's
   setup DOCUMENT onto `state`. `programme()` only reads; `programmeBasis` is
   consumed at exactly one place, `:325`, as a digest input.
3. `prepareSource` builds the view at `:327`: `view = {ready:true, basis:Q,
   order_map:M, state:replayed.state, ...}` and commits it at `:364`:
   `next.collections.derived.localSource={basis:copy(Q),view:copy(view)}`.
4. `today/local-source-basis.mjs:46`: `const state=view.state;` and `:55`
   `return clone(state);`. This is `admittedLocalSourceBasis`, the one join
   between the committed import and the page.
5. `today/today-app.cjs:2482-2488`, `athleteBasisState()`:
   `module.admittedLocalSourceState(setup)` then
   `.then((imported)=>{importAdmitted=!!imported; return imported||setup.athleteState();})`.
   The imported state WINS; the clean init built from the setup document is the
   fallback for when there is no admitted import. The comment at `:2476` says
   it in the file's own words: "When one is there, it IS the basis, and the
   clean-init state built from the setup document is what stands when it is not."
6. `today-model.cjs:374-382`, `adoptBasis(state)`: `basis=clone(state)`. The
   Today model's basis is now the file's state.
7. `today-app.cjs:2495-2500` rebases the gym card through `hostForDay(day)`,
   which `gym-model.mjs:96-110` documents as rereading `model.stateFromOps()`
   at call time, "so calling it after adoption is what puts the athlete's own
   exercises on the card".
8. The engine then reads that state and nothing else: `engine/plan.cjs:11-22`
   `dayType(iso,s)` walks `s.split` as a period array and lets the last entry
   with `from <= iso` name the day; `engine/today.cjs:82-86` `sessionMembership`
   and `:89-95` `genSession` build the day's pool from
   `s.exercises.filter(e=>e.day===dt && exActive(s,e.id))`; `engine/today.cjs:111`
   sizes the target array from `e.sets`; `:128-129` pads from `e.hi`;
   `engine/progression.cjs:325,347,370,382,416` price the next load from
   `e.inc` and `e.steps`.

### 2.2 What the Train screen shows the next morning

THE FILE'S PROGRAMME, per lift. On the morning after an admitted import the
gym card is built from the file's own `exercises`: each lift's own set count
(`e.sets`), its own rep target (`e.hi`), its own increment and its own ladder.
The day (upper, lower or rest) is the file's own split map. The phone's setup
document supplies NOTHING to that screen once an import is admitted: it is not
merged, not preferred, and not consulted; it remains an op in the ops
collection, RETAINED under F4, and the only thing it is used for is being the
thing the file was proved against.

This is exactly the owner's stated expectation at DECISIONS:507, in his own
words "The exact program from old app". It is met, and it is met by machinery
that already ships: the adoption chain at `today-app.cjs:2482-2488` has
preferred the imported state over the setup document since P2 S3, and lane C's
cells in `today/test/local-source-consumer.test.mjs` already prove it. The only
reason he has not seen it is that `programme()` refuses before anything is
committed. This ticket removes that refusal and changes nothing about who wins.

TWO PRECONDITIONS the spec names because they sit on the same path and would
each produce a different morning if they failed. Both must be cells (5 (a)).

- The file's `state.athlete_label` must equal the label this installation's
  first run recorded, or `local-source-basis.mjs:55` returns null and the page
  silently falls back to the clean init: he would see the setup document's
  single numbers the morning after a SUCCESSFUL import, with no refusal to read.
  The comment at `:49-54` states why (an import that does not carry the same
  label is not adopted, because painting it would be a lie either way). The
  label is one of the setup answers he types, so this is a real failure mode for
  a fresh-start owner who typed his name differently on the phone than the old
  app held it. It is NOT part of the programme rule and must not become one;
  it is a cell and, if it fails on his real bundle, a PM question, not a code
  change inside this ticket.
- At least one of the file's split periods must be in force on the day he next
  opens the gym card, or `workout-host.mjs:39-48` refuses
  `WORKOUT_SPLIT_NOT_IN_FORCE` at the first preparation. B-B makes that
  impossible to admit in the first place, which is the whole point of the bound.

### 2.3 Is there a fork? No fork on the question he asked

The PM's dispatch anticipated a product-taste fork between "the setup document
is overwritten by the file's programme" and "the file's per-lift targets are
adopted only for history and the phone's setup governs tomorrow". Measured, the
second branch DOES NOT EXIST in the shipped tree and would have to be built:
`today-app.cjs:2488` returns `imported || setup.athleteState()`, so there is no
seam where the setup document could be made to govern tomorrow while the file
governs history, and no ticket has ever asked for one. Building that branch
would be a new feature, contrary to the owner's stated expectation, and this
spec does not propose it.

What IS true, and is a statement of fact rather than a fork, is the consequence
he should hear in one sentence before the build ships:

> The set counts and rep targets you typed into Earned during setup stop being
> used the moment your old history is imported. From that morning on, the Train
> screen shows each lift exactly as your old app had it: its own number of sets
> and its own rep target. Your setup answers are kept as the record of what you
> told us, and they are what your file is checked against, but they are not
> what you train on.

RECOMMENDATION: no fork goes to the owner. Recording this sentence as a
confirmation (a "this is what will happen" line in the PM chat, not a question
with two buttons) is sufficient and is the honest thing to do, because the
outcome is the one he asked for and the only surprise in it is a good one. If
the PM prefers to put it to him anyway, it should be put as confirmation, not
as a choice, because the alternative is unbuilt.

ONE SMALLER MATTER THE PM MAY WANT TO CARRY, also not a fork inside this lane:
the setup flow asks for a set count, a rep target and a ladder that a
fresh-start owner who is about to import will never train on. That is a
sequencing wart in the first-run flow (offer the import before or during setup,
or say plainly that these answers are replaced by an import), not a defect in
admission, and it belongs in its own ticket after S7. Naming it here so it is
not mistaken for something this spec left undone.

---

## 3. OPT-3: THE DETAIL, THE SENTENCE, AND THE RENAMED CODES

### 3.1 The issue shape

Today: `const issue=(code,id)=>{issues.push({code,...(id?{op_id:id}:{})});};`
(`source-admission.mjs:157`), and `:171` calls `issue(e.code)` with no id and
no detail, so the screen receives `[{code:'LOCAL_SOURCE_PROGRAMME_UNRESOLVED'}]`
and nothing more (confirmed by the diagnosis cell D-PRR-1, which asserts the
screen shows `{code, detail:null}`).

New shape, additive only:

    { code: 'LOCAL_SOURCE_PROGRAMME_UNRESOLVED',
      field: <one of a CLOSED vocabulary>,
      exercise_id: <a lift id, only for the per-lift fields>,
      op_id: <unchanged, where the existing code already passes one> }

The `field` vocabulary is closed and is the following six values and nothing
else, so no value from the file can ever ride out on it:

| field | raised at | means |
|-------|-----------|-------|
| `setup_document` | :142, :143 | zero or two first-run documents on this phone, or one that does not validate |
| `split` | P-A guard | the file's split is not a non-empty period array |
| `split.map` | P-A | a period of the file's week is not the week this phone describes |
| `split.from` | B-A, B-B | a period starts after today, or no period is in force today |
| `exercises` | P-B count | the file lists a different number of lifts |
| `exercise_id` | P-B match | a lift this phone lists is missing from the file, or listed twice |
| `day` | P-C | a lift sits on a different training day |
| `mg` | P-C | a lift is filed under a different muscle group |

`exercise_id` carries a lift id, and the id it carries is ALWAYS the PHONE's
own (`ex.id`, from `scratch.exercises`), never one read off the file. For `day`
and `mg` both sides hold the id, so this is the same string either way; for a
missing lift the phone's id is the only one there is to name. Nothing from the
file reaches the screen. `field` is a literal from the table above, chosen by
the code path, never interpolated.

The `issue` helper widens to `(code,id,detail)` and spreads `detail` when
present; every existing call site keeps its meaning.

### 3.2 The refusal sentence

`import-screen.mjs:101` today:

    export const REFUSAL_SENTENCE = Object.freeze({ BUNDLE_AUTH_FAILED: COPY.authFailed });

The build adds one entry, and one COPY line for it. Proposed text, plain
English, no U+2013 and no U+2014:

    programmeMismatch:
      'This file was written by a different training week than the one you set '
      + 'up on this phone. Nothing on this phone was changed.'

    export const REFUSAL_SENTENCE = Object.freeze({
      BUNDLE_AUTH_FAILED: COPY.authFailed,
      LOCAL_SOURCE_PROGRAMME_UNRESOLVED: COPY.programmeMismatch });

The sentence says "training week", not "programme", because under the new rule
the only things that can disagree ARE the week, the lift list and where each
lift sits: set counts and rep targets no longer refuse anything, so a sentence
promising "a different programme" would be wider than the rule. The second
half repeats the one fact the athlete most needs after a refusal and which the
screen already guarantees by retracting (`import-screen.mjs:375`).

`refusalLines(code,detail)` at `:112-117` needs no change: it already pushes
`REFUSAL_SENTENCE[code]` when the map knows the code.

### 3.3 Rendering the detail on the screen

`confirm()` at `:363-398` builds the refusal today as:

    370|  const codes = [...new Set((prepared.issues || []).map(issue => issue.code))];
    374|  fail(codes[0] || 'LOCAL_SOURCE_NOT_READY', codes.slice(1).join(' ') || null);

The detail argument of `fail` is "what the machinery said BESIDES the code"
(`:371-373` and the comment at `:103-108`), so the field and the lift belong
exactly there. The build changes `:370-374` to compute, from the SAME issues
array, a detail string that is the joined remaining codes as today PLUS, for
each issue carrying one, `field` and `exercise_id`, in that order, space
separated, deduplicated, and never repeating the leading code (the `codeLine`
guard at `:109-110` already refuses a detail equal to the code).

The rendered line for the owner's own case would read:

    LOCAL_SOURCE_PROGRAMME_UNRESOLVED (split.map)
    This file was written by a different training week than the one you set up
    on this phone. Nothing on this phone was changed.

and for a lift on the wrong day:

    LOCAL_SOURCE_PROGRAMME_UNRESOLVED (day incline-press)
    This file was written by a different training week ...

What is NOT exposed: no value, no day letter, no count, no label, no date.
The athlete learns WHICH field disagreed and, where it is per lift, WHICH of
his own lifts, and that is the whole of it. `RETRACT_REASON` stays a label and
is untouched (`:92-93`): the alphabet at `import-bundle.mjs:675` exists
precisely so no value rides out on a reason, and nothing here rides on one.

### 3.4 The :289 catch

    267|  if(rows.some(op=>op.class==='session')&&resumeStated)try{
    ...
    270|    ...if(![EngineCapture.PROFILE,...].includes(producer.rule_profile))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    272|    ...if(state.exercises.filter(e=>e.id===slot.lift_lineage_id).length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    273|    for(const [id,count]of counts)if(state.exercises.find(e=>e.id===id).sets!==count)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    284|    if(!expected||...)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED');
    289|  }catch(e){issue('LOCAL_SOURCE_WORKOUT_UNRESOLVED');}

The catch binds `e` and never reads `e.code`, so all four inner refusals are
renamed on the way out. The fix, one line:

    -  }catch(e){issue('LOCAL_SOURCE_WORKOUT_UNRESOLVED');}
    +  }catch(e){issue(KNOWN_REPLAY_CODES.has(e?.code)?e.code:'LOCAL_SOURCE_WORKOUT_UNRESOLVED',
    +    null,e?.field?{field:e.field,...(e.exercise_id?{exercise_id:e.exercise_id}:{})}:undefined);}

`KNOWN_REPLAY_CODES` is a frozen Set declared beside `fail` holding exactly the
codes this module raises. The allowlist matters: the `try` also encloses
`storedWorkoutHistory`, `projector.project` and the engine runtime, which can
throw errors this module did not name, and a bare `e.code` would let a foreign
code (or an absent one) become the athlete's refusal. Anything not on the list
keeps `LOCAL_SOURCE_WORKOUT_UNRESOLVED`, exactly as today.

The four inner `fail` calls should also carry a field, so the rename fix is
worth having: `:270` `{field:'capture_producer'}`, `:272`
`{field:'capture_lift', exercise_id:slot.lift_lineage_id}`, `:273`
`{field:'capture_sets', exercise_id:id}`, `:284` `{field:'capture_membership'}`.
These four extend the closed vocabulary of 3.1 and are subject to the same
rule: `capture_lift` and `capture_sets` name a lift id that `state.exercises`
holds, which after admission is the FILE's own id list. That is a real, if
small, widening of what the screen can print, and it is accepted because by
that point the athlete is being told about HIS OWN recorded Earned workout, not
about the file.

---

## 4. FILES TOUCHED

Pinned status measured with `findstr /n` over
`rebuild/lanes/b/tooling/packages/S6.json` in this worktree; the line number is
where the path is declared.

### 4.1 Product files the build changes

| file | pinned in packages/S6.json | what changes |
|------|---------------------------|--------------|
| `rebuild/m3/w6/local/source-admission.mjs` | YES (S6.json:318) | `programme()` :140-150 rewritten; `fail` :80 widened; `issue` :157 widened; call site :171; the `:289` catch and the four inner `fail`s at :270,:272,:273,:284 |
| `rebuild/m3/w7-preview/import/import-screen.mjs` | YES (S6.json:363) | one `COPY` line, one `REFUSAL_SENTENCE` entry :101, the detail build in `confirm()` :370-374 |
| `rebuild/m4/import/replay-registry.cjs` | YES (S6.json:983) | the F4 rule text :61-63, restated per 1.5 |
| `rebuild/m4/import/replay-core.cjs` | YES (S6.json:643) | NO CHANGE EXPECTED. Named by the :506 ruling and checked here: `createImportPreparation` produces the candidate state and is upstream of every line this ticket touches. If the build finds no edit it needs, the file does not move, and the spec says so rather than inventing one. |

All three files that DO move are pinned, so the change is a SEALED one and
rides S7 through the :501 chain exactly as DECISIONS:506 ruled. No unpinned
product file is touched, so there is no second, separately merging half.

### 4.2 Files this ticket must NOT touch

`rebuild/m3/w7-preview/today/setup-model.mjs` (the one-number document and the
today-dated `from` are left exactly as they are: the fix is in what admission
COMPARES, not in what setup writes), `today-app.cjs` (pinned, S6.json:583),
`today-model.cjs`, `local-source-basis.mjs` (not pinned; not touched either),
`gym-model.mjs`, `workout-host.mjs`, `engine/*`, `port.cjs`, anything under
`rebuild/authority` or `rebuild/client`.

### 4.3 Test files added or changed

| file | pinned | what |
|------|--------|------|
| `rebuild/m3/w6/test/local-source-admission.test.mjs` | YES (S6.json:338) | CHANGED: any cell asserting the old field-by-field equality is rewritten to the new rule; new negatives for `split.from` and `mg` |
| `rebuild/m3/w7-preview/import/test/support.mjs` | YES (S6.json:403) | CHANGED: a second builder beside `firstRun()` that drives the REAL `setup-model.mjs document()` reducer, plus a `sealVariedBundle()` that seals per-lift varied `sets`/`hi` and an older `split.from`. `firstRun()` itself and `SETUP` stay, so no existing cell moves |
| `.../import/test/route.test.mjs` | YES (S6.json:398) | ADDED cells (a) and (h) |
| `.../import/test/refusals.test.mjs` | YES (S6.json:393) | ADDED cells (b) to (f) |
| `.../import/test/refusal-route.test.mjs` | YES (S6.json:388) | ADDED cell (g) |
| `.../import/test/live-clock.test.mjs` | YES (S6.json:378) | ADDED the moving-clock and rollover rows of cell (i) |
| `.../import/test/page-bundle.test.mjs` | YES (S6.json:383) | UNCHANGED unless the module graph moves; re-measured, not re-summed |
| `rebuild/lanes/d/p3-port-fix/*.test.mjs` | NO (new lane files) | the lane's own cells, including the two REWRITTEN brief cells of 5 (h) |

`rebuild/lanes/d/p3-port-refusal/owner-route.test.mjs` and
`programme-bracket.test.mjs` live on `rebuild/d-p3-port-refusal` and are the
diagnosis's own record. The build does not edit them in place; it carries the
eleven cells forward into `lanes/d/p3-port-fix/` with the two rewrites named in
5 (h), so the diagnosis branch stays readable as what it was.

---

## 5. CELL PLAN: THE ACCEPTANCE BAR

A cell claiming a path must be stub-free on that path (DECISIONS:439 (2)).
Where a cell cannot be stub-free, it says which stub stands and why.

### (a) COMPOSED OWNER PATH, the bar cell

One IndexedDB, one era. Built, in this order, with nothing hand-written:

1. The phone's setup document comes from the REAL setup screen reducer:
   `setup-model.mjs` `document()`, driven through the real setup lane's actions
   on a LIVE clock (not a frozen one, not a literal). The cell asserts, before
   anything else, that what came back has `split.from === <today>` and that
   `new Set(document.setup.exercises.map(e=>e.sets)).size === 1` and the same
   for `hi`, so the cell proves it is testing the document the shipped screen
   actually produces. This is the addition REVIEW-R1 finding 10 asked for.
2. That document is saved through the real setup host
   (`era.createSetupHost` + `Setup.createSetupCommands()`, as
   `import/test/support.mjs:111-115` already does), on the era's own live day.
3. The bundle is sealed by the REAL `rebuild/m3/setup/port/port.cjs`
   (`support.mjs:31`), over a legacy state whose programme carries the SAME
   week, the SAME lift ids and the SAME day and mg as the document, and:
   - `split[0].from` strictly EARLIER than the setup day (at least 60 days),
   - per-lift variation: at least three lifts with `sets` in {2,3,4,5} not all
     equal, and at least three distinct `hi` values,
   - `inc`, `steps`, `head`, `secondary` and `priority_muscles` all differing
     from the document's.
   Synthetic figures only. No value from the owner's real file appears.
4. The import is driven on the SHIPPED page booted by `today-entry.mjs`,
   through its Import route: pick the file, the six words, Unlock, the identity
   question answered Yes, then "Import this history". This is the D-PRR route,
   not the controller-direct route.

ASSERTIONS:
- ADMITS. `prepared.profile === 'earned/local-source-qualification/v1'`,
  `issues` empty, the screen reaches step `done`, no `review-refused` entry.
- The F4 family row for the setup op is `retained`, not `unresolved`.
- The durable record after `publish` + `reconcile` carries
  `localSourceApplication.core_complete === true`.
- THE NEXT MORNING (the section 2 claim, executed): re-boot the page on the
  following local day and read the gym card. For EVERY lift, the card's set
  count equals the FILE's `sets` for that lift and not the document's, and the
  rep target equals the FILE's `hi`. The day letter is the file's split map.
  The three lifts whose `sets` differ from the document are checked by name.
  Stub-free: the real `today-entry.mjs` boot, the real adoption chain, the real
  `hostForDay` rebase, the real engine. No stub plugin on this path.
- `state.priority_muscles` after adoption is the FILE's array.

### (b) A LIFT THE PHONE LISTS IS MISSING FROM THE FILE

Same as (a), with one lift removed from the sealed bundle's programme.
REFUSED with exactly one issue:
`{code:'LOCAL_SOURCE_PROGRAMME_UNRESOLVED', field:'exercises'}` if the count
differs, and with `field:'exercise_id', exercise_id:<the phone's id>` when the
count is held equal by substituting a different id. Both variants are cells.
Nothing is written: revision and token unchanged, one `review-refused` entry,
the picker reset.

### (c) SAME MAP, ONE LIFT ON A DIFFERENT DAY

Same as (a), with one lift's `day` flipped from U to L in the sealed bundle
(and the split map left identical, so only P-C can fire). REFUSED with
`{field:'day', exercise_id:<that lift>}`, one issue, nothing written. A sibling
cell flips `mg` instead and asserts `{field:'mg', exercise_id:...}`.

### (d) FUTURE-DATED split.from

Same as (a), with the bundle's single split period dated TOMORROW relative to
the admission's `currentDay()`. REFUSED with `{field:'split.from'}`, nothing
written. A second variant carries TWO periods, one in force and one dated
tomorrow, and is also refused: the bound is per period, not per state.
A third variant carries a period dated exactly TODAY and ADMITS, which is the
boundary and must be executed so the bound is proved to be "not after", not
"strictly before".

### (e) A STRANGER'S PROGRAMME

Same as (a), with a bundle whose split MAP differs in one day letter (the
existing `STRANGER_SETUP` pattern at `support.mjs:77-79` varies `sets`, which
under the new rule no longer refuses, so the cell must vary the MAP instead and
must say in a comment that the old stranger fixture is no longer a refusal).
REFUSED with `{field:'split.map'}`, nothing written.

A second stranger cell is REQUIRED and is a NEGATIVE RESULT that must be
written down rather than hidden: a bundle differing ONLY in `athlete_label`
and in the retained fields ADMITS at the controller, exactly as DECISIONS:472
(a) records, and is then NOT ADOPTED by the page
(`local-source-basis.mjs:55` returns null on the label). The cell asserts both
halves. This is the widening of 1.4 executed, so a reviewer can see its size.

### (f) THE FOUR INNER CODES SURFACE UNDER THEIR OWN NAMES

Four cells, one per `fail` at `:270`, `:272`, `:273`, `:284`, each driven by a
recorded native workout whose capture breaks exactly that one precondition
(wrong producer rule profile; a slot naming a lift the state does not hold; a
slot count that disagrees with the lift's `sets`; a day whose membership
disagrees). Each asserts the issue's `code` is
`LOCAL_SOURCE_PROGRAMME_UNRESOLVED` with its own `field`, and NOT
`LOCAL_SOURCE_WORKOUT_UNRESOLVED`. A fifth cell throws a foreign error inside
the same `try` (an error with no `code`, and one with a `code` not on the
allowlist) and asserts it still surfaces as `LOCAL_SOURCE_WORKOUT_UNRESOLVED`,
so the allowlist is proved to be an allowlist.

### (g) THE REFUSAL SENTENCE RENDERS

On the REAL page (the refusal-route path), cell (c)'s refusal is driven to the
screen and the rendered text is read off it verbatim: two lines, the first
`LOCAL_SOURCE_PROGRAMME_UNRESOLVED (day <lift id>)`, the second the sentence of
3.2 exactly. Asserted additionally: the rendered text contains no U+2013 and no
U+2014, contains no number, and contains no string from the bundle other than
the lift id. A sibling cell drives the `split.map` refusal and asserts the
detail is `(split.map)` with no lift id.

### (h) THE EXISTING CORPUS AND THE LANE CELLS STAY GREEN

- `rebuild/m3/w7-preview/import/test` five suites, 35 cells at the tip
  (route, refusals, refusal-route, live-clock, page-bundle), measured green by
  REVIEW-R1. All 35 must still pass. Any cell that goes red because it asserted
  the OLD comparison must be rewritten to the new rule and named in the build
  report, not deleted.
- The eleven lane-D diagnosis cells (D-PR-1, D-PR-2, D-PR-3, D-PR-4 a/b/c,
  D-PR-5, D-PR-6, D-PRR-1, D-PRR-2) carried into `lanes/d/p3-port-fix/`.
  Under the new rule their expected results INVERT where the rule changed, and
  that inversion is the point: D-PR-2, D-PR-4 a/b/c and D-PRR-1 must now
  ADMIT (they differ only in `split.from`, earlier than today), and D-PR-3 and
  D-PR-5's delta must be re-measured because a one-lift `sets` difference no
  longer refuses.
- THE TWO CELLS THAT WERE GREEN ONLY AGAINST AN UNPRODUCIBLE SETUP DOCUMENT
  ARE D-PR-1 AND D-PRR-2, the two ADMITS cells, each of which gives the phone
  a document whose `split.from` is the file's date and whose per-lift `sets`
  and `hi` are the file's. The shipped screen cannot write either
  (`setup-model.mjs:622-623,:633`). BOTH ARE REWRITTEN to build the phone's
  document through the real `document()` reducer of cell (a), which makes
  D-PR-1 a controller-level duplicate of (a) and D-PRR-2 a route-level one.
  After the rewrite, no cell in this lane admits against a document the screen
  cannot produce.

### (i) REAL-WORLD INVARIANT ROWS (DECISIONS:439 (1))

Run against cell (a)'s composed path, on the shipped page.

| row | assertion | stub-free on this path |
|-----|-----------|------------------------|
| today's real date | the admission's `currentDay()` is the device's real local day, and the B-A bound is evaluated against it | YES |
| moving clock | two `currentDay()` reads across a 60 s real wait agree; a bundle dated today admits before and after | YES |
| device timezone offset | the offset on every stamped op matches the device offset (the `:165-170` check) under a non-UTC zone (America/New_York) | YES |
| force-close and reopen | after `publish` + `reconcile`, force-close the page, reopen, and the gym card still shows the file's per-lift numbers | YES |
| local-midnight rollover | admit before local midnight, cross it, reopen: the next day's card is the file's split map's letter for the NEW day, and the :451 bound holds | YES |
| offline reload | reload with the network down: Today renders, the adopted basis is still the file's | YES |

THE ONE STUB THAT STANDS, named rather than hidden: every admitting cell still
qualifies its engine context through a TEST-ONLY producer mapping, because
DECISIONS:472 BLOCKER 2 is not closed by this ticket and no production producer
mapping exists in the tree. So these cells prove the RULE on the real path and
do NOT prove that the owner's real bundle will qualify: that is the separate
S3-R3 context capability, and the port retry after S7 still depends on it.
The build report must repeat this sentence; a green bar here is not a promise
that the retry succeeds.

### (j) RED-FIRST

Every cell in (b) to (g) must be shown RED against the pre-fix tree (or, where
the pre-fix tree refuses for the OLD reason, shown to refuse under the OLD
undifferentiated code and GREEN only after the fix). Cell (a) must be shown RED
against the pre-fix tree with exactly `LOCAL_SOURCE_PROGRAMME_UNRESOLVED`,
which is the owner's own refusal reproduced, and green after. The build runs
the reviewer's probe set itself before hand-off (DECISIONS:439 (3)).

---

## 6. NOT CHANGED

- IDENTITY. The athlete's own answer before custody is untouched:
  `prepareSource` still refuses `LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED`
  without `identityConfirmed===true` (`:298`), the prefix question at `:80` is
  word for word the same, and DECISIONS:472 (a) still describes where the
  identity guard lives. This ticket does not move it and does not add one.
- CUSTODY AND RETRACT. `importBundle` still commits first, `reviewSource`
  still reads from custody, and a refused entry is still retracted by the
  screen under the label `review-refused` (`import-screen.mjs:93,:375`). The
  :472 (b) constraint stands unchanged.
- THE SIX-WORD UNSEAL. `BUNDLE_AUTH_FAILED`, its sentence and the sealed
  bundle's sha 17216d9c are untouched; the owner needs nothing new from his
  side after S7.
- THE OTHER FAMILIES. F1 reads, F2 food, F3 workouts and their order law,
  F5 check-ins, F6 historical decisions, F7 measure and F8 sleep keep their
  rules, their codes and their projected/retained dispositions exactly. Only
  F4's field list narrows, and only in `programme()`.
- THE /ledger LOCKDOWN. No ledger path is read, written or referenced by this
  ticket. Every figure in every cell is synthetic.
- `setup-model.mjs`. The setup flow keeps its one-number answers and its
  today-dated `from`. Adding a start-date question is a different ticket and
  this spec does not ask for one.

---

## 7. RISKS AND ESTIMATE

### 7.1 Risks, in the order I would worry about them

1. THE CORPUS REWRITE IS BIGGER THAN THE FIX. `support.mjs` is the shared
   fixture of all five pinned suites, and adding a real-`document()` builder to
   it is the one change that can turn 35 green cells red for reasons unrelated
   to the rule. Mitigation: ADD beside `firstRun()`, never replace it, and
   require the build to show all 35 green before and after.
2. THE WIDENING IS REAL AND IS THE THING A REVIEWER SHOULD PUSH ON. After this
   change a file agreeing only on the week, the lift ids, the days and the
   muscle groups admits. Cell (e)'s second half exists so the size of that is
   measured rather than argued. If the PM decides the widening is too large,
   the lever is NOT to restore the old equality (it is unsatisfiable) but to
   add a setup start-date question and a per-lift setup flow, which is a much
   larger product change and a different ticket.
3. THE PERIOD ARRAY. The rule proves every period's map. A file whose owner
   genuinely changed his week at some point in the past carries two maps and
   will refuse under `split.map` even though it is his own file. I believe that
   is correct (he described ONE week on the phone, and admitting a history that
   ran a different week would make `dayType` answer a letter his phone never
   named), but it is the judgement in this spec I am least certain of, and the
   PM should know it is a judgement. If the owner's real bundle refuses on
   `split.map` after S7, this is the first thing to look at, and OPT-3's detail
   is what will tell us, which is part of why OPT-3 ships with OPT-2.
4. `replay-core.cjs` not moving means the S7 package declaration must not
   assume it did. A lane B tooling detail, but one that has bitten before.
5. The label precondition of 2.2 is invisible to the athlete. If his phone's
   label and his file's label differ, the import succeeds and the morning is
   wrong with no refusal anywhere. It is out of scope here, it is a cell, and
   if the cell shows it matters it becomes its own ticket.

### 7.2 Estimate, in working days

| step | days |
|------|------|
| build: the three product files, the corpus additions, the lane cells, red-first on each, the reviewer's probe set run before hand-off | 2.5 |
| independent review, Opus high, blind and told to disagree, including its own re-run of the 35 + the lane cells | 1.0 |
| one fix round with the same reviewer | 0.5 |
| Fable final (DECISIONS:439 (a): this is a package on the owner's data path) | 0.5 |
| TOTAL to an accepted, unsealed branch | 4.5 |

The S7 seal chain (:501) that carries this to the phone is the PM's and is not
estimated here.
