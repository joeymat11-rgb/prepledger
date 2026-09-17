# P3-PORT-FIX-SPEC: the programme admission rule, rewritten (OPT-2 + OPT-3)

Lane D, SPEC. Author Opus high. No product file is changed by this branch; the
build is a separate ticket and starts only on the PM's acceptance of this spec.

Facts of record this spec builds on: DECISIONS:472 (a), :506 (the PM ruling),
:507 (the owner's answer and his stated expectation), :439 (the real-world
invariant rows and the stub-free rule), the diagnosis
`rebuild/lanes/d/P3-PORT-REFUSAL-DECISION-BRIEF.md` and its independent review
`...-REVIEW-R1.md`. Every line number below was read in the worktree at
3d002174 and is cited file:line.

VERSION 2, after the independent review `P3-PORT-FIX-SPEC-REVIEW-R1.md`
(verdict REJECT, three BLOCKING findings). What v2 changes: a FOURTH product
file moves, the Edit My Week companion `rebuild/m4/workout/plan-edit-model.cjs`,
because it proves the admitted import against the setup document over exactly
the fields this rule stops proving (new section 1.6, new cell 5 (k)); the
returned basis is projected through its own constant so narrowing the
comparison cannot narrow the programme digest, and `id` is kept in it (1.3);
the shared stranger fixture is ruled on rather than left colliding with itself
(new section 4.4); the period shape is closed (B-C); and the estimate is
2.25 days larger. Section 8 is the finding-by-finding disposition, including
the one finding disputed with evidence.

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
`createCleanInitState` stores it as a PERIOD ARRAY
(`rebuild/m4/workout/athlete-state.cjs:331`, `split: [split],`; the header
comment at `:234` names the document shape it wraps), and so does the engine's
own reader `rebuild/engine/plan.cjs:11-22`, which
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
  the day the rule is evaluated on. That day is `currentDay()`, the controller's
  clock: the device's LOCAL day, and it is the same clock the F1 reading bound
  (`row.date>currentDay()`, `source-admission.mjs:177`) already reads. No UTC
  day and no file-supplied offset is used. `currentDay` is
  `()=>typeof asOf==='function'?asOf():asOf` (`:92`) and the shipped page binds
  a LIVE function (`import-screen.mjs:343`, `asOf: () => day()`), so today it is
  read many times per `replay()` and two reads can straddle a local midnight.
  This spec therefore REQUIRES the build to hoist ONE read and pass it in
  (`programme(state,ops,{today:currentDay()})`, 1.3), so every period of one
  file is bounded against one day. That is a build requirement, not a property
  of the code as it stands, and the cell in 5 (i) executes it.
- B-B. At least one period entry has `from <= today`, which is exactly
  `splitInForceOn` at `rebuild/m3/w6/host/workout-host.mjs:39-41`.
- B-C. SHAPE. Every period entry is an object carrying `from` and `map` and
  NOTHING ELSE (`closed(p,['from','map'])`). The old `encode(source.split)!==
  encode(scratch.split)` was shape-closed by accident: it compared whole period
  objects against `checkSplit`'s normalised output, so an entry carrying a third
  member refused. P-A and B-A alone would not, and that entry would land in
  `state.split` and in the programme digest unexamined. `plan.cjs:11-22` reads
  only `from` and `map`, so there is no engine harm today, but admitting a
  member no rule has looked at is not something this spec does silently. This is
  REVIEW-R1 NOTE 7, adopted as a rule rather than as a sentence.

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
    + /* COMPARED is not PROJECTED. `fields` is what the file must AGREE with the
    +    phone about; PROJECTED_FIELDS is what the admitted basis carries out to
    +    the programme digest at :325, and it keeps `id` and every RETAINED number,
    +    because narrowing the comparison must not narrow the record. */
    + const fields=['day','mg'];
    + const PROJECTED_FIELDS=['id','day','mg','sets','hi','inc','steps','head','secondary'];
    + const periods=Array.isArray(source.split)?source.split:null;
    + const week=scratch.split[0].map;
    + if(!periods||!periods.length)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split'});
    + for(const p of periods){
    +  if(!p||typeof p!=='object'||Array.isArray(p)||
    +     Object.keys(p).some(k=>k!=='from'&&k!=='map'))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split'});
    +  if(encode(p.map)!==encode(week))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split.map'});
    +  if(!validDay(p.from)||p.from>today)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split.from'});
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
    - return {op_id:op.op_id,split:source.split,
    -  exercises:source.exercises.map(ex=>Object.fromEntries([...fields,'head','secondary']
    -    .filter(k=>Object.hasOwn(ex,k)).map(k=>[k,ex[k]]))),
    -  priority_muscles:op.payload.setup.priority_muscles};
    + return {op_id:op.op_id,split:source.split,
    +  exercises:source.exercises.map(ex=>Object.fromEntries(PROJECTED_FIELDS
    +    .filter(k=>Object.hasOwn(ex,k)).map(k=>[k,ex[k]]))),
    +  priority_muscles:source.priority_muscles??[]};
     }

and at the call site:

    -  try{programmeBasis=programme(state,ops);}catch(e){issue(e.code);}
    +  try{programmeBasis=programme(state,ops,{today:currentDay()});}
    +  catch(e){issue(e.code,null,e?.field?{field:e.field,
    +    ...(e.exercise_id?{exercise_id:e.exercise_id}:{})}:undefined);}

Three notes on the returned basis. FIRST, and this is REVIEW-R1 finding 2
adopted: today the return projects through the SAME `fields` array the
comparison used (`source-admission.mjs:150`,
`[...fields,'head','secondary'].filter(k=>Object.hasOwn(ex,k))`), so narrowing
`fields` would silently narrow the record too. The two must be SEPARATE
constants, and the diff above makes them so. `PROJECTED_FIELDS` keeps `id`,
which the comparison no longer names but the record must, or the digest stops
saying WHICH lift each row is and becomes positional; and it keeps `sets`,
`hi`, `inc`, `steps`, `head` and `secondary`, the retained numbers. The return
value is the PROGRAMME DIGEST input at `:325`
(`digest(...,'earned/local-source-programme/v1',replayed.programmeBasis)`),
and a basis that stopped carrying the retained fields would stop binding them,
which would be a real weakening. Only the COMPARISON narrows; the record of
what was admitted does not. A cell asserts this directly (5 (a)): the committed
programme digest's input carries `id` and all seven per-lift members for every
lift, with the FILE's values. SECOND, `priority_muscles` in the returned basis
must move from the phone's setup op to the FILE's value, because after this
change the file's value is the one that lands in the admitted state and the
digest must name what was admitted.

THIRD, the call site's detail spread is GUARDED, and the diff above shows the
guard rather than leaving it to 3.3's prose (REVIEW-R1 NOTE 8, adopted). Not
every throw inside `programme()` is one of the named `fail`s: a `CLEAN_INIT_*`
from `createCleanInitState` or a TypeError carries no `field`, and an
unguarded `{field:e.field,exercise_id:e.exercise_id}` would push
`{code, field:undefined, exercise_id:undefined}` into `issues` and out to the
screen's detail builder. `e?.field?{...}:undefined` means an issue either
carries a field from the closed table of 3.1 or carries none at all, and 3.3's
builder therefore never has an `undefined` to print. A cell in 5 (f) throws a
`CLEAN_INIT_*` through this path and asserts the issue has no `field` member,
not a `field` of `undefined`.

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
  `rebuild/engine/volume.cjs:35`
  (`volBucket = (ex) => (ex && (ex.head || ex.mg)) || null`), which is the
  bucket the weekly hard-set ledger counts into. That is the ONLY engine reader
  of either member: the lend table at `:41` is `const lend = INDIRECT[e.id]`, a
  module constant keyed by LIFT ID, not the exercise's own `secondary` list,
  so the earlier draft's cite for `secondary` was wrong (REVIEW-R1 NOTE 5). A
  tree-wide search for `secondary` in `rebuild/engine` and `rebuild/coach`
  finds no reader of `ex.secondary` at all. `secondary` is therefore INERT in
  the engine, which argues the retention more strongly than the wrong cite did,
  and the one reader that does exist is `plan-edit-model.cjs:90`, which is
  1.6. `mg` is PROVED (P-C) and is
  the fallback bucket, so a file whose `head` is absent still buckets exactly
  where the phone's `mg` says. What is left aside is only the finer region
  label and the lend list, both of which are catalogue enrichment
  (`setup-model.mjs:608-616` and its comment: "the credit WHOLE, head and all")
  rather than an answer the owner gave. A file carrying richer tags than this
  week's catalogue resolved is the normal case, not a suspicious one, and the
  ledger it feeds is a count of his own sets, not a safety gate.
- `priority_muscles`. Ends up on `state.priority_muscles` from the FILE.
  Read by NO ENGINE READER: `rebuild/m4/workout/athlete-state.cjs:313-316`
  carries it verbatim with the comment "No engine reader on the genSession/
  rirPlan path consumes this member", and a tree-wide search finds no reader in
  `rebuild/engine`, `rebuild/coach` or `rebuild/m3/w7-preview/today` outside the
  constructor's own validation (`athlete-state.cjs:243-245`) and this
  comparison. Lane C recorded the same fact independently
  (`lanes/c/dad-first-run/A4-REPORT-ANNEX.md:517`, "consumed by no reader").
  CORRECTION, REVIEW-R1 NOTE 4 ADOPTED: the earlier draft said "Read by
  NOTHING", and that was FALSE. There is exactly one reader outside the engine
  and it is a GUARD, not an inert carry:
  `rebuild/m4/workout/plan-edit-model.cjs:52`,
  `!equal(base.priority_muscles || [], setup.priority_muscles)) fail('PLAN_EDIT_ORIGIN_UNPROVEN')`.
  It is not an engine reader, so it cannot make the file's value WRONG for
  training, and the engine argument for retaining the file's value stands
  unchanged. What it does mean is that dropping `priority_muscles` from
  `programme()` while leaving that guard alone would refuse the athlete's Edit
  My Week on a bundle admission just accepted. That is section 1.6, and it is
  the reason this spec now moves a second file. The general sentence "proving
  an inert field can only refuse; it can never protect anything" holds for the
  ENGINE, and is withdrawn as a claim about the whole tree.

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

### 1.6 THE SECOND GUARD THAT READS THIS RULE: the Edit My Week companion

REVIEW-R1 finding 1, verified independently here and ADOPTED IN FULL. It is the
one finding that changes what this ticket ships.

`rebuild/m4/workout/plan-edit-model.cjs` (pinned, `packages/S6.json:803`) is
the plan-edit companion's projector. When the installation is on an ADMITTED
IMPORT it is constructed with `basisSource:'local-source'` and `basisState` =
the FILE's replayed state (`rebuild/m3/w6/host/plan-edit-host.mjs:68-75`:
`const source = Model.importPresentIn(generation) ? 'local-source' : 'first-run'`,
then `createPlanEditProjector({..., basisSource:source, admittedBasisOf:g =>
admittedLocalSourceBasis(g,{athleteLabel, namespace})})`). Its `setupOperation`
is the phone's first-run document. So on the local-source branch it compares
the SAME two things `programme()` compares, and it does so with THESE lines,
read verbatim in the worktree:

    22| const P2_ROW = ['id','day','mg','sets','hi','inc','steps'];
    51|      base.athlete_label !== setup.athlete_label || !equal(base.split, [setup.split]) ||
    52|      !equal(base.priority_muscles || [], setup.priority_muscles)) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
    88|    } else if (!equal(Object.fromEntries(P2_ROW.map(k => [k, e[k]])), Object.fromEntries(P2_ROW.map(k => [k, row[k]])))
    90|    if (!firstRun) { if (!equal({ head: e.head ?? null, secondary: e.secondary ?? [] }, tags)) tagsOk = false; }

and it says in its own comment (`:62-66`) exactly where that field list came
from:

    62|     LOCAL-SOURCE (P2). local-source-basis.mjs admittedLocalSourceState -> the
    63|     admitted import's own replayed state. Its correspondence predicate is not
    64|     ours to invent: source-admission.mjs `programme()` is what admission itself
    65|     proved, over id/day/mg/sets/hi/inc/steps and the setup tag snapshot, MATCHED
    66|     BY ID and NOT over `n` ...

THE DEFECT, on this spec's own cell (a) fixture. The bundle of 5 (a) carries a
`split[0].from` at least 60 days earlier than the setup day, per-lift varied
`sets` and `hi`, and differing `inc`, `steps`, `head`, `secondary` and
`priority_muscles`. Under the new `programme()` it ADMITS. The athlete then
opens Edit My Week and the companion refuses: `:51` because
`equal(base.split,[setup.split])` is false on the earlier `from` alone (and on
the array length for a two-period file), `:52` because `priority_muscles`
differs and 1.3 makes the returned basis carry the FILE's value on purpose,
`:88` on every lift whose `sets`, `hi`, `inc` or `steps` this spec retains, and
`:90` on every lift whose tags it retains, which is `PLAN_EDIT_TAG_BASIS_UNPROVEN`.
Nothing in the existing corpus catches this: `lanes/d/plan-edit/model.test.cjs`
(pinned, `S6.json:228`) builds its local-source basis from a state that agrees
with the document, so it stays green while the owner's own path breaks. It
would first appear on his phone, after S7.

THE RULING THIS SPEC MAKES. Option (i) of the review, the honest one: the
companion's local-source predicate moves WITH the admission rule, in the same
ticket, under the same seal. The module is pinned in the SAME package as
`source-admission.mjs`, so it costs no second merge. The argument is the
module's own: its predicate "is not ours to invent: source-admission.mjs
`programme()` is what admission itself proved". When `programme()` narrows, the
companion narrows BY ITS OWN STATED LAW. This spec is not inventing a new
correspondence for the companion; it is holding the companion to the sentence
already written in it.

THE NEW LOCAL-SOURCE PREDICATE, field by field. The FIRST-RUN branch is
UNCHANGED in every particular: a clean-init state that has moved is still not a
clean-init state, and nothing below touches `firstRun === true`.

| line | first-run | local-source, today | local-source, after |
|------|-----------|---------------------|---------------------|
| `:50` count | unchanged | `setup.exercises.length === base.exercises.length` | UNCHANGED (this is P-B's count) |
| `:51` label | unchanged | `base.athlete_label === setup.athlete_label` | UNCHANGED (this is the adoption precondition of 2.2, and `local-source-basis.mjs:54` has already enforced it upstream) |
| `:51` split | unchanged | `equal(base.split, [setup.split])` | REPLACED by P-A + B-C: `base.split` is a non-empty array, every entry is closed over `{from,map}`, and every entry's `map` deep-equals `setup.split.map`. `from` is NOT compared: it is the file's own history of when its week changed, retained exactly as admission retains it. The B-A "not after today" bound is NOT re-evaluated here, because admission already applied it at admission time and a committed import must not start refusing the athlete's editor because a clock moved |
| `:52` priority_muscles | unchanged | `equal(base.priority_muscles || [], setup.priority_muscles)` | DROPPED for local-source. Retained, per 1.4 |
| `:88` `P2_ROW` | unchanged (`documentRow`, all eight members) | `['id','day','mg','sets','hi','inc','steps']` | NARROWED to `P2_SHAPE_ROW = ['id','day','mg']`, which is exactly what admission proved. The `typeof e.n === 'string' && e.n.trim()` check on the same line STAYS: the athlete's own name for the lift travels with his import and must still be a name |
| `:90` tag snapshot | unchanged | `equal({head, secondary}, tags)` | DROPPED for local-source. Retained, per 1.4. `C.tagsOf(row, tags, validateTags)` on the line above STAYS (it validates the DOCUMENT's own tag shape and reads nothing from the basis), and so does the key-set check at `:91-93` |

WHAT MUST NOT MOVE in that file, stated so the build cannot drift: the
`COLLECTIONS` trip-wire at `:20-21`, `importPresentIn` at `:30-35`, the
`basisSource` validation at `:78`, `PLAN_EDIT_BASIS_SOURCE_CHANGED` in the host
(`plan-edit-host.mjs:72`), the basis hash (`:38-43`), `inspect()`, and every
line of the first-run branch. Only the four local-source comparisons above
change, and `P2_ROW` is kept under its own name for whatever else reads it
while `P2_SHAPE_ROW` is added beside it.

WHAT THIS COSTS THE COMPANION'S GUARANTEE, said plainly. Before: the companion
would refuse to edit a plan whose basis disagreed with the setup document on
any of eight members. After, on an admitted import: it refuses on the week, the
lift ids, the day and the muscle group, and it edits a plan whose set counts,
rep targets, increments, ladders and tags are the FILE's. That is the same
trade the admission rule makes, for the same reason, and it is the ONLY answer
consistent with the owner's :507 expectation: a companion that refuses to edit
the programme he was just told he would train on would be the defect, not the
guard.

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
  first run recorded, or `local-source-basis.mjs:54`
  (`if(athleteLabel&&state.athlete_label!==athleteLabel)return null;`; `:55` is
  the successful `return clone(state);`) returns null and the page
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
  opens the gym card, or `rebuild/m3/w6/host/workout-host.mjs:39-48` refuses
  `WORKOUT_SPLIT_NOT_IN_FORCE` at the first preparation. B-B makes that
  impossible to admit in the first place, which is the whole point of the bound.

A THIRD thing sits on this path and is NOT a precondition but a DEFECT this
spec would have shipped: the Edit My Week companion refuses on the very basis
the morning above adopts. It is section 1.6, it is fixed inside this ticket,
and it is a cell (5 (k)). What section 2 claims about the TRAIN screen is
unaffected by it: `today-app.cjs` never calls the companion's projector, so the
gym card the owner sees the next morning is the file's programme either way.
The companion is the screen he would reach for to CHANGE that programme.

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
| `rebuild/m4/workout/plan-edit-model.cjs` | YES (S6.json:803) | the LOCAL-SOURCE branch only: the split comparison inside :51, the `priority_muscles` comparison at :52, the `P2_ROW` row comparison at :88 and the tag-snapshot comparison at :90, each per the table in 1.6; `P2_SHAPE_ROW` added beside `P2_ROW` at :22; the comment at :62-66 restated to the new field list. The FIRST-RUN branch and everything named in 1.6's "WHAT MUST NOT MOVE" are untouched |
| `rebuild/m4/import/replay-registry.cjs` | YES (S6.json:983) | the F4 rule text :61-63, restated per 1.5 |
| `rebuild/m4/import/replay-core.cjs` | YES (S6.json:643) | NO CHANGE EXPECTED. Named by the :506 ruling and checked here: `createImportPreparation` produces the candidate state and is upstream of every line this ticket touches. If the build finds no edit it needs, the file does not move, and the spec says so rather than inventing one. |

All FOUR files that DO move are pinned, so the change is a SEALED one and
rides S7 through the :501 chain exactly as DECISIONS:506 ruled. No unpinned
product file is touched, so there is no second, separately merging half.
`plan-edit-host.mjs` is also pinned (S6.json:1003) and does NOT move: it
chooses the branch and passes the basis, and 1.6 changes neither.

### 4.2 Files this ticket must NOT touch

`rebuild/m3/w7-preview/today/setup-model.mjs` (the one-number document and the
today-dated `from` are left exactly as they are: the fix is in what admission
COMPARES, not in what setup writes), `today-app.cjs` (pinned, S6.json:583),
`today-model.cjs`, `local-source-basis.mjs` (not pinned; not touched either),
`gym-model.mjs`, `rebuild/m3/w6/host/workout-host.mjs`, `engine/*`,
`rebuild/m3/setup/port/port.cjs`, `rebuild/m3/w6/host/plan-edit-host.mjs`
(pinned, S6.json:1003), `rebuild/m4/workout/plan-edit-commands.cjs`, anything
under `rebuild/authority` or `rebuild/client`.

### 4.3 Test files added or changed

| file | pinned | what |
|------|--------|------|
| `rebuild/m3/w6/test/local-source-admission.test.mjs` | YES (S6.json:338) | CHANGED: any cell asserting the old field-by-field equality is rewritten to the new rule; new negatives for `split.from` and `mg` |
| `rebuild/m3/w7-preview/import/test/support.mjs` | YES (S6.json:403) | CHANGED: a second builder beside `firstRun()` that drives the REAL `setup-model.mjs document()` reducer, plus a `sealVariedBundle()` that seals per-lift varied `sets`/`hi` and an older `split.from`, plus `STRANGER_WEEK_SETUP` per 4.4. `firstRun()`, `SETUP` and `STRANGER_SETUP` itself all stay |
| `.../import/test/route.test.mjs` | YES (S6.json:398) | CHANGED and ADDED. ADDED: cells (a) and (h). CHANGED: the rebase cell at :264, which seals from `STRANGER_SETUP` and asserts a refusal that the new rule no longer produces (4.4) |
| `.../import/test/refusals.test.mjs` | YES (S6.json:393) | CHANGED and ADDED. ADDED: cells (b) to (f). CHANGED: the stranger refusal built from `STRANGER_SETUP` at :20 (4.4) |
| `.../import/test/refusal-route.test.mjs` | YES (S6.json:388) | CHANGED and ADDED. ADDED: cell (g). CHANGED: the stranger refusal built from `STRANGER_SETUP` at :23 (4.4) |
| `rebuild/lanes/d/import-retract/retract.test.mjs` | YES (S6.json:183, child `d-import-retract` at :1282-1286) | CHANGED. REVIEW-R1 finding 3 (a), adopted: it seals a `STRANGER_SETUP` bundle at :28 to drive a refused-then-retracted path, and under the new rule that bundle ADMITS, so the retract path it exists to exercise would stop being exercised. Retargeted to `STRANGER_WEEK_SETUP` per 4.4. Nothing else in the suite moves; it was missing from both lists in round 1 |
| `rebuild/lanes/d/plan-edit/model.test.cjs` | YES (S6.json:228, child `d-plan-edit` at :1251) | CHANGED and ADDED. Its local-source cells build a basis that agrees with the setup document on all eight members, so they stay green under 1.6 and must: the narrowed predicate is a WIDENING, and a cell that passed before must pass after. ADDED: the local-source cells of 5 (k), red-first against the pre-fix model |
| `.../import/test/live-clock.test.mjs` | YES (S6.json:378) | ADDED the moving-clock and rollover rows of cell (i) |
| `.../import/test/page-bundle.test.mjs` | YES (S6.json:383) | UNCHANGED unless the module graph moves; re-measured, not re-summed |
| `rebuild/lanes/d/p3-port-fix/*.test.mjs` | NO (new lane files) | the lane's own cells, including the two REWRITTEN brief cells of 5 (h) |

`rebuild/lanes/d/p3-port-refusal/owner-route.test.mjs` and
`programme-bracket.test.mjs` live on `rebuild/d-p3-port-refusal` and are the
diagnosis's own record. The build does not edit them in place; it carries the
eleven cells forward into `lanes/d/p3-port-fix/` with the two rewrites named in
5 (h), so the diagnosis branch stays readable as what it was.

### 4.4 THE STRANGER FIXTURE: one ruling, four call sites

REVIEW-R1 finding 3, adopted. `STRANGER_SETUP`
(`rebuild/m3/w7-preview/import/test/support.mjs:77-79`) is a clone of `SETUP`
varying exactly two things: `athlete_label = 'synthetic-other-identity'` and
`exercises[0].sets = 4`. `athlete_label` is compared by NEITHER rule
(DECISIONS:472 (a)) and `sets` is RETAINED by the new one, so under this ticket
the stranger bundle ADMITS. Four suites seal a bundle from it and assert a
refusal, and all four go red:

    rebuild/m3/w7-preview/import/test/refusals.test.mjs:20
    rebuild/m3/w7-preview/import/test/refusal-route.test.mjs:23
    rebuild/m3/w7-preview/import/test/route.test.mjs:264
    rebuild/lanes/d/import-retract/retract.test.mjs:28        (pinned, S6.json:183)

Round 1 said "ADD beside `firstRun()`, never replace it" (7.1.1) and also said
cell (e) "must vary the MAP instead", which for this fixture is a REPLACE. The
two collided. THE RULING, which resolves it in favour of 7.1.1:

1. `STRANGER_SETUP` STAYS, byte for byte. It does not become a refusal fixture
   with different numbers; it becomes the fixture of the NEGATIVE RESULT in
   5 (e): a bundle that differs only in label and in retained fields, which
   ADMITS at the controller and is then NOT ADOPTED by the page. That is the
   widening of 1.4, executed, and it needs a fixture of exactly this shape.
2. Its COMMENT at `:72-76` is corrected, because it currently says this is
   "what the wrong person's bundle looks like to the controller", which stops
   being true. Correcting a comment that a rule change falsifies is not
   replacing a fixture.
3. `STRANGER_WEEK_SETUP` is ADDED beside it: a clone of `SETUP` whose
   `split.map` differs in one day letter, which is what a stranger's bundle
   looks like to the NEW rule. It carries the different `athlete_label` too, so
   it is a strict superset of what the old fixture proved.
4. The FOUR call sites above are rewritten BY NAME to seal from
   `STRANGER_WEEK_SETUP`. Each rewrite is a named line in the build report with
   its before and after, because these are refusal-guard cells and that is the
   category where a reviewer most needs to see both. The refusal each asserts
   is unchanged in kind; only the reason the bundle is a stranger's moves from
   a set count to a day letter.

These four rewrites, plus the pinned lane suite in (a) of 4.3, are the cost
REVIEW-R1 finding 3 measured and round 1's estimate did not carry. 7.2 is
re-estimated.

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
  HOW "the following local day" IS REACHED, because REVIEW-R1 is right that on
  a live clock this is a wait and not a step: the cell uses the technique
  `.../import/test/live-clock.test.mjs` already uses for the era's own clock
  (`support.mjs` `liveAt(iso)`, an INSTANT PROVIDER the era and every host under
  it read, so the device offset is real at that instant). The first boot runs on
  `liveAt(T)`, the re-boot on `liveAt(T + 24h)`, over the SAME IndexedDB. That
  is not a frozen clock and it is not a 24-hour wait: it is the same live
  binding read at a second instant, which is exactly what the next morning is.
  The cell states this in a comment, so it does not quietly become a row it is
  not. The moving-clock and rollover rows of (i) are the ones that use a real
  wait, and they say so there.
- `state.priority_muscles` after adoption is the FILE's array.
- THE PROGRAMME DIGEST INPUT (1.3, finding 2 executed): the committed
  `replayed.programmeBasis` carries, for EVERY lift, `id` plus `day`, `mg`,
  `sets`, `hi`, `inc`, `steps` and the tags the file holds, with the FILE's
  values. A cell that asserted only the compared fields would let the
  projection narrow silently, which is the defect finding 2 caught.
- THE COMPANION DOES NOT REFUSE (1.6, finding 1 executed, and the one assertion
  whose absence hid the whole of it): on the SAME admitted generation, open the
  Edit My Week companion through the real `plan-edit-host.mjs` with the real
  `athleteLabel` and namespace, and assert that construction SUCCEEDS, that
  `basisSource` resolved to `local-source`, and that a read of the current day
  returns a plan whose rows carry the FILE's `sets` and `hi`. Specifically
  asserted NOT raised: `PLAN_EDIT_ORIGIN_UNPROVEN` and
  `PLAN_EDIT_TAG_BASIS_UNPROVEN`. This cell is RED against the pre-fix
  `plan-edit-model.cjs` even with the new `programme()` in place, which is what
  makes it the finding-1 cell rather than a restatement of (a).

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

Same as (a), sealed from the NEW `STRANGER_WEEK_SETUP` of 4.4, whose split MAP
differs in one day letter. REFUSED with `{field:'split.map'}`, nothing written.

A second stranger cell is REQUIRED and is a NEGATIVE RESULT that must be
written down rather than hidden: a bundle sealed from the UNCHANGED
`STRANGER_SETUP`, differing only in `athlete_label` and in the retained fields,
ADMITS at the controller, exactly as DECISIONS:472 (a) records, and is then NOT
ADOPTED by the page (`local-source-basis.mjs:54`,
`if(athleteLabel&&state.athlete_label!==athleteLabel)return null;`). The cell
asserts both halves, and a third: that the Train screen the next morning
therefore shows the SETUP DOCUMENT's single numbers, silently, with no refusal
anywhere. That is the 2.2 label precondition executed on the one fixture that
produces it. This is the widening of 1.4 measured, so a reviewer can see its
size instead of taking the argument on trust. The 4.4 ruling exists so that
this cell and the four refusal call sites stop sharing one fixture.

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
so the allowlist is proved to be an allowlist. A SIXTH cell covers 1.3's third
note: a `CLEAN_INIT_*` thrown out of `createCleanInitState` inside `programme()`
surfaces as an issue with NO `field` member at all, asserted with
`Object.hasOwn(issue,'field') === false`, not as `field: undefined`, and the
rendered detail on the screen contains no "undefined".

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
  REVIEW-R1 and to be RE-MEASURED by the build rather than taken from this
  spec. All must still pass. Any cell that goes red because it asserted the OLD
  comparison must be rewritten to the new rule and named in the build report,
  not deleted. THREE of them are already known to go red and are named here
  rather than discovered later: the stranger refusals at `refusals.test.mjs:20`,
  `refusal-route.test.mjs:23` and `route.test.mjs:264`, rewritten per 4.4.
- `rebuild/lanes/d/import-retract/retract.test.mjs` (pinned, S6.json:183) and
  `rebuild/lanes/d/plan-edit/model.test.cjs` (pinned, S6.json:228) are run in
  full, before and after. The first has one known red cell (4.4); the second
  must have NONE from 1.6, because 1.6 only widens what the companion accepts.
  A red cell in `model.test.cjs` means 1.6 was implemented as something other
  than a widening and the build stops.
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
| local-midnight rollover | admit before local midnight, cross it, reopen: the next day's card is the file's split map's letter for the NEW day, and the B-A bound (1.2) still holds because it can only loosen as the clock advances. The earlier draft cited "the :451 bound", which names nothing in any file this spec touches and is withdrawn (REVIEW-R1 review item 4) | YES |
| one clock per file | the B-A build requirement of 1.2 executed: a single bundle whose two periods are bounded across a real local midnight is bounded against ONE day, because `currentDay()` is read once and passed in. Asserted by admitting a two-period bundle while the era's live instant crosses midnight between the two period checks would have fired | YES |
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

### (k) THE COMPANION'S NEW LOCAL-SOURCE PREDICATE (section 1.6)

Model-level cells in `rebuild/lanes/d/plan-edit/model.test.cjs`, beside the
existing local-source cells, each constructed with `basisSource:'local-source'`,
a `basisState` that is an admitted import's replayed state, and the phone's own
first-run document as `setupOperation`. Every one of them is RED against the
pre-fix `plan-edit-model.cjs` and GREEN after; that red-first is what proves
these cells are the finding and not a description of it.

ACCEPTS (each was `PLAN_EDIT_ORIGIN_UNPROVEN` or `PLAN_EDIT_TAG_BASIS_UNPROVEN`
before, one cell per row, each varying ONE thing):
- `base.split[0].from` 60 days earlier than the document's.
- `base.split` of length 2, both periods carrying the same map.
- `base.priority_muscles` differing from the document's.
- one lift's `sets` differing; one lift's `hi`; one lift's `inc`; one lift's
  `steps`.
- one lift's `head` and `secondary` differing from the document's tag snapshot.

STILL REFUSES (the predicate is narrowed, not removed; each asserts the code):
- a period whose `map` differs in one day letter: `PLAN_EDIT_ORIGIN_UNPROVEN`.
- `base.split` not an array, or empty, or a period carrying a third member:
  `PLAN_EDIT_ORIGIN_UNPROVEN`.
- a lift id in the document that the basis does not hold, and the reverse:
  `PLAN_EDIT_ORIGIN_UNPROVEN`.
- one lift's `day` or `mg` differing: `PLAN_EDIT_ORIGIN_UNPROVEN`.
- a lift whose `n` is absent, empty or not a string: `PLAN_EDIT_ORIGIN_UNPROVEN`.
- a document tag map whose key set is not the basis's id set: unchanged,
  `PLAN_EDIT_TAG_BASIS_UNPROVEN`.
- `base.athlete_label` differing from the document's:
  `PLAN_EDIT_ORIGIN_UNPROVEN`, unchanged.

THE FIRST-RUN BRANCH IS UNTOUCHED, and a cell proves it: every existing
first-run cell in the suite runs unchanged and green, and one new cell varies a
single lift's `sets` on a FIRST-RUN basis and asserts it still refuses
`PLAN_EDIT_ORIGIN_UNPROVEN`. Without that cell, a build could satisfy the
ACCEPTS rows by narrowing both branches, which would be a real loss.

ROUTE-LEVEL, one cell, the composed one: the companion assertion inside cell
(a). That is the cell that would have caught finding 1 and it is the one that
matters most; these model cells are what make the fix reviewable line by line.

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
  rules, their codes and their projected/retained dispositions exactly. F4's
  field list narrows, in `programme()` and in the ONE other guard that derives
  its predicate from `programme()` by its own written statement, the Edit My
  Week companion's local-source branch (section 1.6). Round 1 said "only in
  `programme()`" and that was FALSE, measured by REVIEW-R1 finding 1 and
  confirmed here at `rebuild/m4/workout/plan-edit-model.cjs:51,:52,:88,:90`.
  The narrowing is observed in exactly two files and both are named in 4.1.
- THE /ledger LOCKDOWN. No ledger path is read, written or referenced by this
  ticket. Every figure in every cell is synthetic.
- `setup-model.mjs`. The setup flow keeps its one-number answers and its
  today-dated `from`. Adding a start-date question is a different ticket and
  this spec does not ask for one.

---

## 7. RISKS AND ESTIMATE

### 7.1 Risks, in the order I would worry about them

0. A THIRD GUARD SOMEWHERE ELSE READS THIS RULE AND NOBODY HAS FOUND IT YET.
   This is now the top risk, because round 1 shipped with exactly that mistake
   and an independent reviewer found it by reading rather than by running
   (finding 1, section 1.6). The countermeasure is not an argument, it is a
   procedure the build MUST run and report: a tree-wide search for each
   RETAINED field name (`sets`, `hi`, `inc`, `steps`, `head`, `secondary`,
   `priority_muscles`) and for `split` compared against a setup document,
   across `rebuild/m3`, `rebuild/m4`, `rebuild/engine` and `rebuild/coach`,
   with EVERY hit classified as engine reader, inert carry or GUARD, and every
   guard named in the build report with its file:line and its disposition. Two
   are known (`source-admission.mjs` `programme()` and
   `plan-edit-model.cjs`'s local-source branch); the report must say whether
   there is a third and must not leave the question implicit.
1. THE CORPUS REWRITE IS BIGGER THAN THE FIX, and bigger than round 1 said.
   `support.mjs` is the shared fixture of all five pinned import suites AND of
   the pinned lane suite `lanes/d/import-retract/retract.test.mjs`, so a change
   to it reaches six suites, not five. Six refusal-guard cells are already
   known to move (the four `STRANGER_SETUP` call sites of 4.4 plus the two
   diagnosis rewrites of 5 (h)). Mitigation: ADD beside `firstRun()` and beside
   `STRANGER_SETUP`, never replace either (4.4), and require the build to show
   every suite green before and after, with each moved cell named.
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
   is what will tell us, which is part of why OPT-3 ships with OPT-2. ONE POINT
   IN THE RULE'S FAVOUR ROUND 1 DID NOT MAKE, supplied by REVIEW-R1: because
   P-A proves EVERY period's map equal, a multi-period file is semantically
   INERT past "is one in force", so `dayType`'s last-entry-wins walk
   (`plan.cjs:11-22`) cannot answer a letter the phone never named, whichever
   period it lands on. The risk is therefore a risk of REFUSING his own file,
   never of training him on a week he did not describe, and that is the right
   direction for it to point.
4. `replay-core.cjs` not moving means the S7 package declaration must not
   assume it did. A lane B tooling detail, but one that has bitten before.
5. The label precondition of 2.2 is invisible to the athlete. If his phone's
   label and his file's label differ, the import succeeds and the morning is
   wrong with no refusal anywhere. It is out of scope here, it is a cell, and
   if the cell shows it matters it becomes its own ticket.

### 7.2 Estimate, in working days

RE-ESTIMATED after REVIEW-R1. Round 1 said 2.5 build days and the review is
right that findings 1 and 3 were not inside that number: the companion is a
fourth product file with its own branch, its own cells and its own red-first,
and the stranger fixture is four named call-site rewrites across four suites,
one of them a pinned lane suite.

| step | days |
|------|------|
| build A: `source-admission.mjs`, `import-screen.mjs`, `replay-registry.cjs`, the corpus additions, cells (a) to (j), red-first on each | 2.5 |
| build B: `plan-edit-model.cjs`'s local-source branch (1.6) and cell (k), model-level red-first plus the companion assertion inside cell (a) | 1.0 |
| build C: the 4.4 stranger fixture and its four named call-site rewrites, plus a full before/after run of all six affected suites | 0.5 |
| build D: the risk-0 guard sweep and its report section | 0.25 |
| the reviewer's probe set run before hand-off (DECISIONS:439 (3)) | included above |
| independent review, Opus high, blind and told to disagree, including its own re-run of every suite named in 4.3 and its own execution of cell (a) plus one companion open (which REVIEW-R1 could not do) | 1.25 |
| one fix round with the same reviewer | 0.75 |
| Fable final (DECISIONS:439 (a): this is a package on the owner's data path) | 0.5 |
| TOTAL to an accepted, unsealed branch | 6.75 |

That is 2.25 days more than round 1 claimed. The difference is the cost of
finding 1 and finding 3, and it is stated rather than absorbed, because a build
that discovers the companion halfway through would either overrun silently or
drop cell (k).

The S7 seal chain (:501) that carries this to the phone is the PM's and is not
estimated here.

---

## 8. REVIEW DISPOSITION (R1)

Reviewer: lane D, independent, Opus high, blind, told to disagree. Verdict
REJECT, three BLOCKING findings and six NOTEs. Every finding below was
re-measured in this worktree at 3d002174 by the author before disposition; the
reviewer ran nothing, and finding 1 in particular was a code reading, so it was
re-read line by line rather than accepted on the summary.

| # | kind | disposition | where |
|---|------|-------------|-------|
| 1 | BLOCKING | FIXED, option (i). Verified: `plan-edit-model.cjs:51,:52,:88,:90` and the comment at `:62-66` are exactly as the reviewer quotes, and `plan-edit-host.mjs:68-75` binds `basisSource:'local-source'` on an admitted import. The companion is now a fourth touched product file with its own predicate, its own cells and its own red-first | 1.4 (correction), 1.6, 2.2, 4.1, 4.3, 5 (a), 5 (k), 6, 7.1.0, 7.2 |
| 2 | BLOCKING | FIXED. Verified: `source-admission.mjs:150` projects through `[...fields,'head','secondary']`, so narrowing `fields` narrows the digest, and both readings dropped `id`. The diff now carries a separate `PROJECTED_FIELDS` that keeps `id` and every retained member, and the prose no longer contradicts it. A cell asserts the digest input | 1.3, 5 (a) |
| 3 | BLOCKING | FIXED. Verified: `STRANGER_SETUP` varies only `athlete_label` and `exercises[0].sets`, and four suites seal from it, including the pinned `lanes/d/import-retract/retract.test.mjs:28` (S6.json:183). New section 4.4 rules the collision in favour of 7.1.1: the fixture stays, `STRANGER_WEEK_SETUP` is added, four call sites are rewritten by name. 4.3 now marks the three import suites CHANGED and names both missing pinned suites | 4.3, 4.4, 5 (e), 5 (h), 7.1.1, 7.2 |
| 4 | NOTE | FIXED. "`priority_muscles` read by nothing" was false; `plan-edit-model.cjs:52` is a reader and a guard. The claim is now scoped to the engine and the guard is named | 1.4 |
| 5 | NOTE | FIXED. `volume.cjs:41` is `INDIRECT[e.id]`, keyed by lift id, not `ex.secondary`. The cite is corrected and the stronger conclusion (no engine reader of `ex.secondary` at all) is stated | 1.4 |
| 6 | NOTE | PARTLY FIXED, PARTLY DISPUTED. `athlete-state.cjs:234` is the header comment and the array wrap is `:331`: FIXED. `local-source-basis.mjs`'s label guard is `:54`, not `:55`: FIXED in both places. Bare paths for `athlete-state.cjs`, `workout-host.mjs`, `volume.cjs`, `plan.cjs` and `port.cjs`: FIXED. The third bullet is DISPUTED, see below | 1.1, 1.2, 2.2, 4.2, 5 (e) |
| 7 | NOTE | FIXED, and promoted from a sentence to a rule: B-C closes the period shape over `{from,map}` and the diff carries the check | 1.2, 1.3 |
| 8 | NOTE | FIXED. The detail spread is guarded in the diff itself, not only in 3.3's prose, and a cell asserts an issue with no `field` member rather than `field: undefined` | 1.3, 5 (f) |
| 9 | NOTE | FIXED. "taken once per replay" was a build requirement stated as a fact; B-A now says so explicitly, cites `:92` and `import-screen.mjs:343`, and 5 (i) gains a row that executes it | 1.2, 5 (i) |

Reviewer R1 finding 6, third bullet: DISPUTED because the line is right as
round 1 had it. The reviewer says "2.1 step 2: 'reads at `:179`'. `applyRead`
is at `source-admission.mjs:178`; `:179` is the F1 family push." Measured in
this worktree at 3d002174, `rebuild/m3/w6/local/source-admission.mjs:178` is
`days.add(row.date);last=row.date;`, `:179` is
`if(row.local.state==='included')try{state=engineFor(row.date,hour).applyRead(...)`,
and `:180` is `families.push({family:'F1',...})`. So `applyRead` IS at `:179`
and the F1 push is at `:180`; the reviewer is off by one and the spec's cite
stands unchanged. Nothing else in NOTE 6 is disputed.

Three of the reviewer's other observations were adopted without being findings,
and are named so the next round can see they were not missed: the multi-period
inertness argument (now 7.1.3), the live-clock technique for "the next morning"
(now in 5 (a)), and the withdrawal of the bare ":451" cite (now in 5 (i)).

WHAT THIS ROUND DID NOT DO. It did not run anything either: this is a spec
branch and no product file is modified by it. Finding 1 remains a code reading
by two people rather than an executed failure, and the build's FIRST task is to
execute cell (a) with the companion assertion against the pre-fix
`plan-edit-model.cjs` and confirm it is red. If it is green, 1.6 is wrong and
the build stops and says so instead of implementing it.
