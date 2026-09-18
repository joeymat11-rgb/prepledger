# P3-REAL-SHAPE-SPEC: the real file's shape, measured, and the rule that admits and adopts it (option A)

Lane D, spec author. Dispatched by DECISIONS:520. Spec + fixture only; no
product file is changed by this ticket.

WHAT IS NEW HERE AND WAS NOT AVAILABLE TO S7. The import corpus had never
sealed a bundle with the OLD app's shape. Every fixture it seals -
`import/test/support.mjs` `inventedLegacyState`, `variedLegacyState`, the
journey fixture, the diagnosis's synthetic bundle - is built by calling the NEW
app's own `createCleanInitState` and then decorating it. So every one of them
carries a two-member split, slug lift ids, an `athlete_label`, a `steps` ladder
on every lift, a positive `inc` on every lift and a numeric working load. The
owner's file carries none of those things. S7 proved the machinery against a
picture of the file, not the file.

THE FIXTURE OF RECORD closes that. `rebuild/lanes/d/p3-real-shape/` builds a
legacy state with the OLD app's shape from the old app's PUBLIC source
(origin/main `src/app.jsx`; `src/history.js` is never opened, on any ref), seals
it through the REAL `rebuild/m3/setup/port/port.cjs`, and walks it onto a
fresh-start phone through the SHIPPED page. Every number in it is synthetic.
The measurement below is that walk, bracketed one variable at a time, and every
row of section 1 is a green cell in this branch against the UNCHANGED S7 tree.

THE PATCH CHAIN, ANSWERED. There is no chain to run. `src/app.jsx:521` sets
`SEED.v = SCHEMA_V` inside the weave, and the seed's own comments say it twice
(`:438`, `:529`): "authored already-current; a fresh install does not run the
patch chain". `PATCHES` (`:11983`) and `migrate` (`:12267`) exist for a state
that is BEHIND 60; a state at 60 takes the `old.v === SCHEMA_V` fast path at
`:12267` and is only settled, not patched. The fixture therefore states `v: 60`
and cites the patch that DEFINES each member it carries rather than executing
it. One member is carried that the seed itself does not have: `targets`, which
`patchV32` (`:10745-:10763`) writes onto a migrated state ONLY where that state
carries an `adjustments` entry with `rid === 'refeed_review'` - the whole body
is inside `if (adj)` - so it is an OPTIONAL member of a migrated state and the
fixture carries an empty one to prove the member rides through (corrected after
review R1, N1; the first cut of this sentence said "every migrated state" and
that is not what the patch does). Nothing on the admission path requires it:
`dayType` guards with `s.targets &&`. Nothing else was needed: the real
`prepare.cjs` + `engine/migrate.cjs` accepted the state and the port sealed it
first time.

WHAT REVIEW R1 CHANGED IN THIS REVISION. The measurement (section 1), the
fixture's SHAPE and the five gaps are unchanged and were accepted in full. Six
blocking defects in the RULE and the FIXTURE are fixed here: a crash in the
capture diff, an order proof pointed at the wrong programme, a lost
one-row-one-lift guarantee, an unasked-for weakening of the FIRST-RUN path, a
contradiction about which setup lifts are kept, and a fixture that carried the
seed athlete's own set counts, rep targets and increments. Section 8 is the
disposition, finding by finding.

---

## 1. THE GAPS, MEASURED

The bracket. Each step changes EXACTLY ONE thing about the file and is a
separate real seal through `port.cjs`. The phone is the same throughout: a
fresh-start install whose first run was driven through the REAL
`createSetupModel` reducer, naming the SAME sixteen lifts by the file's own `n`
names, the same week, one global sets (3) and one global hi (10), as the shipped
screens can and do write. Every row is a cell.

| # | step | variable changed | code / field | where it refuses | admitted | adopted | next-morning card |
|---|------|------------------|--------------|------------------|----------|---------|-------------------|
| 1 | Import this history | none: the file as the old app holds it | `LOCAL_SOURCE_PROGRAMME_UNRESOLVED` / **`split`** | source-admission.mjs:223 (`Object.keys(p).some(k=>k!=='from'&&k!=='map')`) | no | - | setup document; nothing written |
| 2 | " | `why` deleted from every period | " / **`exercise_id`** `lateral-machine` | source-admission.mjs:231 | no | - | setup document |
| 3 | " | file ids rewritten to the phone's slugs | " / **`steps`** `lateral-machine` | source-admission.mjs:254-257 probe -> athlete-state.cjs:132-133 | no | - | setup document |
| 4 | " | a synthetic rung ladder added to every lift | " / **`inc`** `supported-leg-raise-medicine-ball-pad` | source-admission.mjs:254-257 probe -> athlete-state.cjs:130 | no | - | setup document |
| 5 | " | `inc: null` replaced by a positive number | none: **ADMITS** | - | yes | **NO** | setup document, silently (local-source-basis.mjs:54 returns null) |
| 6 | " | `athlete_label` added, equal to the phone's | none | - | yes | **yes** | **the FILE's** lifts, ids, per-lift sets and hi; the U day's card total is the file's, not the phone's |
| 7 | the same walk with ONE Earned session recorded on the phone first, file ids left as handles | - | " / **`exercise_id`** AND " / **`capture_lift`** | source-admission.mjs:231 and :398 | no | - | setup document |
| 8 | the adopted file (row 6) on the day its week calls L | - | **`ENGINE_CAPTURE_LOAD_UNPROVEN`** | engine-capture.cjs:66, because today-bindings.mjs:94 registers `Adapter.PROFILE` (v1) and the old app's `w` can be `BW` or `hold` | yes | yes | **BLOCKED**: no card at all |
| 9 | Edit My Week on an adopted basis whose periods carry `why` | - | **`PLAN_EDIT_ORIGIN_UNPROVEN`** | plan-edit-model.cjs:37-40 (`splitShapeOk` closes over {from,map}) | - | - | the companion will not open |
| 10 | Edit My Week on an adopted basis whose lift ids are the file's handles | - | **`PLAN_EDIT_ORIGIN_UNPROVEN`** | plan-edit-model.cjs:119-120 (`byId.get(row.id)` by the DOCUMENT's id) | - | - | as above |
| 11 | Edit My Week on an adopted basis with no `athlete_label` | - | **`PLAN_EDIT_ORIGIN_UNPROVEN`** | plan-edit-model.cjs:75 | - | - | as above |
| 12 | the `mg` vocabulary | - | none | setup-model.mjs:29-30 and engine/seed.cjs name the same eleven labels | - | - | NOT a gap |
| 13 | the extra exercise members | - | none | - | - | - | NOT a gap: all survive (below) |

### 1.1 What the measurement adds to DECISIONS:520

The PM named three gaps. The walk found **five**, and two of the three named
ones have a second consequence nobody had measured.

- **GAP 1, `why` on the split.** As ruled. Row 1. It also refuses the Edit My
  Week companion (row 9), which the ruling did not say.
- **GAP 2, handle ids vs `slugOf` ids.** As ruled. Row 2. It ALSO refuses the
  capture provenance block for a phone that recorded one Earned session before
  importing (row 7, field `capture_lift`), and it ALSO refuses the companion
  (row 10). So "adopt the file's ids" is not one edit in `programme()`; it is a
  rule about lift correspondence that three readers share.
- **GAP 3, no `athlete_label`.** As ruled. Row 5: it ADMITS and is SILENTLY NOT
  ADOPTED - the owner would see a successful import and the setup document's
  numbers the next morning, with nothing on screen to read. It ALSO refuses the
  companion (row 11).
- **GAP 4, NEW AND UNLISTED: no `steps` and `inc: null`.** Rows 3 and 4. The old
  app has no rung ladder anywhere - `EXERCISES` (`src/app.jsx:386-433`) carries
  none, and no patch mints one - and it writes `inc: null` on a bodyweight lift
  because there is no plate to add. P3-PORT-FIX-2's BOUNDED probe
  (source-admission.mjs:254-257) hands each retained value to
  `createCleanInitState`, whose `checkExercise` requires `steps` to be a
  non-empty ascending list of positive numbers (athlete-state.cjs:132-133) and
  `inc` to be finite and above zero (:130). Both refuse. This gap is invisible
  to every existing fixture because all of them are BUILT by that constructor.
- **GAP 5, NEW AND UNLISTED, AND THE WORST OF THE FIVE: the working load is not
  always a number.** Row 8. The old app's `w` is a number, or the string `BW`,
  or the string `hold`, or `null` for a lift that has never been performed - all
  four appear in `EXERCISES`. The page's gym card composes the v1 capture
  producer (today-bindings.mjs:94, `rule_profile: Adapter.PROFILE`), and
  engine-capture.cjs:66 refuses any card whose `w` is a configuration string
  unless the v2 `CONFIGURATION_PROFILE` is the registered producer. So even
  after the file ADMITS and is ADOPTED, the owner's LOWER day - which is where
  his held hack squat and his bodyweight raise live - has **no card at all**.
  Row 8's control (cell D-RS-h2) isolates it: with every configuration load
  replaced by a number, the same day on the same phone prepares and carries the
  FILE's set count.

### 1.2 What is NOT a gap, measured

- **`mg`.** Both vocabularies are the engine's own eleven labels
  (setup-model.mjs:29-30 cites `engine/seed.cjs` for every one). Cell D-RS-e.
- **The extra exercise members.** `lastMeta`, `setup`, `setupAt`, `std`, `own`,
  `ownNote`, `first`, `debutNote`, `pendingThird`, `wSets`, `note`, `head`,
  `forks`, `renames`, `rirHist`, `pauseSec`, `wAt`, `incAt`, `setsAt`, `hiAt`
  all survive `port.cjs`, the migration, custody, the replay and the commit.
  Nothing on the admission or the adoption path refuses one or drops one. Three
  are NORMALISED, which is the old app's own behaviour reproduced by the
  accepted migration and is not a loss: `lastMeta` and `last` are rebuilt from
  the file's own `sessionLog` (the entry gains `rir`, `debt` is re-derived,
  `rirSets` carries the logged RIR); `forks` and `renames` gain the engine's own
  `ops` list; and a `steps` ladder that IS present has the lift's own current
  working load inserted into it. Cell D-RS-f.
- **The top-level collection names.** The migrated state carries exactly the
  members the fixture supplies plus one: `suggestionLog`, minted by the accepted
  migration. `targets` survives.
- **The split `from` and the period array.** B-A and B-B pass on the real shape
  unchanged; the only thing the period disagreed about was `why`.

---

## 2. THE RULE, PER DECISIONS:520 OPTION A

### 2.1 What is PROVED, in full, and nothing else

An admitted import is proved to be THIS athlete's file by five things and no
others. Everything not on this list is ADOPTED from the file.

- **P-0, THE ONE SETUP OP.** Exactly one operation carrying
  `earned/first-run-setup/v1`, `schema_version` 2, that `Setup.validate`
  accepts, and that `createCleanInitState` builds a state from. Field
  `setup_document`. UNCHANGED from S7.
- **P-IDENT, THE OWNER'S ANSWER.** `identityConfirmed === true` and, where the
  file and the installation both hold workouts, his Yes to the prefix question.
  UNCHANGED from S7 (DECISIONS:472 (a)).
- **P-A, THE WEEK.** `source.split` is a non-empty array. Each period is a plain
  object whose members are drawn from `{from, map, why}` and which has `from`
  and `map`; `why`, WHEN PRESENT, must be a string (the file's own note, kept,
  never read as a rule and never shown). Each `map` must deep-equal the phone's
  one week. Each `from` must be a valid day not after today, and at least one
  must be in force today. Fields `split`, `split.map`, `split.from`. WIDENED by
  exactly one optional member.
- **P-BOUND, THE RETAINED NUMBERS.** A retained value must be one the athlete's
  own document constructor would accept - but only over the members the file
  actually carries, and only for the two the old app always carries. See 2.3.
  Fields `sets`, `hi`, `inc`.
- **P-CAP, THE CAPTURE PROVENANCE.** Restated in 2.5. Fields `capture_producer`,
  `capture_lift`, `capture_sets`, `capture_membership`.

Plus ONE new proof, which exists to turn today's silent non-adoption into
something the owner can read:

- **P-LABEL, THE NAME ON THE FILE.** If the file carries an `athlete_label` and
  it is not the label this installation's first run recorded, admission REFUSES,
  field `athlete_label`. If the file carries none, admission adopts the phone's
  own first-run label onto the admitted state (2.4). If it carries the same one,
  nothing happens. This replaces the silent `return null` at
  local-source-basis.mjs:54 as the thing the OWNER experiences; that line stays
  exactly as it is, as the page's last guard. It is tested BEFORE the per-lift
  loop in 2.3, so a file that names someone else is refused by THAT name rather
  than by whichever lift member happens to fail first (review R1, N9).

  **SAY THE UNCOMFORTABLE THING OUT LOUD (review R1, N2).** P-LABEL cannot fire
  on any old-app file. The old app has no `athlete_label` anywhere - this spec
  proves that itself (D-RS-0) - so on the entire population this ticket exists
  for, the new refusal is UNREACHABLE and what the rule actually does is stamp
  the phone's label onto whatever file was admitted. Option A also removes the
  per-lift id multiset equality, which under S7 was, accidentally, a content
  guard. The consequence, stated plainly: another old-app athlete's file, on the
  same Sun-U / Mon-L / Thu-U / Fri-L week, with well-formed lifts and in-bounds
  retained numbers, is ADMITTED and ADOPTED on the owner's identity Yes alone,
  with his own name stamped on top. That is INSIDE the PM's ruling
  (DECISIONS:520, ":472 (a) the owner's identity Yes is the identity guard") and
  this spec does not ask for it to be reversed - but the PM should read it here,
  in one sentence, before he answers the questions in section 6: after this
  change the only remaining proof that the file is his is one tap.

### 2.2 What is ADOPTED wholesale from the file

`id`, `n`, `mg`, `day`, `sets`, `hi`, `inc`, `steps`, the tag members
(`head`, `secondary`), `priority_muscles`, the whole split array **including
each period's `why`**, and every extra member of 1.2. The phone's setup
document is retired to what it always was: the thing the file's WEEK was proved
against, kept as an op, RETAINED under F4, and never again consulted by a
screen.

There is NO id comparison and NO lift-count comparison. `fields=['day','mg']`
and the per-lift `exercise_id` multiset equality both go. Where a lift of the
file and a lift of the document are THE SAME LIFT is decided by NAME, and it is
decided in one place that three readers share (2.5).

### 2.3 `programme()`, as the code the build should write

```diff
-function programme(source,ops,{today,documentSets=null}){
+function programme(source,ops,{today,documentSets=null,documentProgramme=null}){
   const setups=Object.values(ops).filter(o=>o.payload?.profile===Setup.PROFILE);
   if(setups.length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'setup_document'});const op=setups[0];
   if(op.schema_version!==2||!Setup.validate(op,id=>ops[id]))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'setup_document'});
   const scratch=createCleanInitState({setup:op.payload.setup});
   if(documentSets)for(const ex of scratch.exercises)documentSets.set(ex.id,ex.sets);
+  /* THE DOCUMENT STATE ITSELF, out of this function by the SAME out-parameter
+     discipline `documentSets` already uses and for the same reason: 2.5 has to
+     ask the engine what the programme that PRODUCED a pre-import capture
+     prescribed on that day, and that programme is this document, not the file.
+     Filled HERE, before any comparison below can refuse, so the capture block
+     reads the document even on a file that never gets past this function. It is
+     NOT a member of the returned basis and therefore not a digest input. */
+  if(documentProgramme)documentProgramme.state=scratch;
+  /* P-LABEL FIRST (review R1, N9). The file's name, when it has one, must be
+     his, and a file that names someone else must be refused BY THAT NAME rather
+     than by whichever lift member the loop below happens to reach first. */
+  if(Object.hasOwn(source,'athlete_label')&&source.athlete_label!==op.payload.setup.athlete_label)
+    fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'athlete_label'});
-  const fields=['day','mg'];
-  const PROJECTED_FIELDS=['id','day','mg','sets','hi','inc','steps','head','secondary'];
-  const BOUNDED_FIELDS=['sets','hi','inc','steps'];
+  /* P3-REAL-SHAPE (DECISIONS:520 option A). NOTHING per lift is COMPARED any
+     more: the file's lifts are the athlete's lifts. PROJECTED_FIELDS is
+     unchanged, so the programme digest still records every adopted member.
+     BOUNDED_FIELDS loses `steps`, because the OLD app has no rung ladder on any
+     lift and a bound on a member the file never carries is a rule the athlete
+     cannot answer (P3-PORT-FIX-SPEC 1.4's own test). */
+  const PROJECTED_FIELDS=['id','n','day','mg','sets','hi','inc','steps','head','secondary'];
+  const BOUNDED_FIELDS=['sets','hi'];
   const periods=Array.isArray(source.split)?source.split:null;
   const week=scratch.split[0].map;
   if(!periods||!periods.length)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split'});
   for(const p of periods){
     if(!p||typeof p!=='object'||Array.isArray(p)||
-       Object.keys(p).some(k=>k!=='from'&&k!=='map'))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split'});
+       Object.keys(p).some(k=>k!=='from'&&k!=='map'&&k!=='why')||
+       !Object.hasOwn(p,'from')||!Object.hasOwn(p,'map')||
+       /* `why` is the file's own provenance note (src/app.jsx:11057, :552). It
+          is RETAINED as an opaque string, never parsed, never shown, never a
+          rule; a non-string one is a malformed period. */
+       (Object.hasOwn(p,'why')&&typeof p.why!=='string'))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split'});
     if(encode(p.map)!==encode(week))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split.map'});
     if(!validDay(p.from)||p.from>today)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split.from'});
   }
   if(!periods.some(p=>p.from<=today))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'split.from'});
-  if(source.exercises?.length!==scratch.exercises.length)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'exercises'});
-  for(const ex of scratch.exercises){
-    const matches=source.exercises.filter(x=>x.id===ex.id);
-    if(matches.length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'exercise_id',exercise_id:ex.id});
-    for(const key of fields)if(encode(matches[0][key])!==encode(ex[key]))
-      fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:key,exercise_id:ex.id});
-    for(const key of BOUNDED_FIELDS)
-      try{createCleanInitState({setup:{...op.payload.setup,
-        exercises:op.payload.setup.exercises.map(d=>d.id===ex.id?{...d,[key]:matches[0][key]}:d)}});}
-      catch{fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:key,exercise_id:ex.id});}
-  }
+  /* THE FILE'S OWN LIFT LIST IS THE ATHLETE'S LIFT LIST. What is still proved
+     about it is only that it is a list of lifts the engine can read at all. */
+  if(!Array.isArray(source.exercises)||!source.exercises.length)
+    fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'exercises'});
+  const seen=new Set();
+  for(const ex of source.exercises){
+    if(typeof ex?.id!=='string'||!ex.id.trim()||seen.has(ex.id))
+      fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'exercise_id',exercise_id:String(ex?.id??'')});
+    seen.add(ex.id);
+    if(typeof ex.n!=='string'||!normaliseName(ex.n))
+      fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'exercise_n',exercise_id:ex.id});
+    if(!['U','L'].includes(ex.day))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'day',exercise_id:ex.id});
+    if(typeof ex.mg!=='string'||!ex.mg.trim())fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'mg',exercise_id:ex.id});
+    /* THE RETAINED-NUMBER BOUND, over the phone's OWN document with ONE member
+       of ONE lift substituted, exactly as P3-PORT-FIX-2 wrote it. The probe now
+       runs against the document's FIRST lift (any valid lift will do: the probe
+       is attributable because only the substituted value can refuse), because
+       there is no longer a document lift that corresponds to this one by id. */
+    for(const key of BOUNDED_FIELDS)
+      try{const first=op.payload.setup.exercises[0];
+        createCleanInitState({setup:{...op.payload.setup,
+          exercises:op.payload.setup.exercises.map(d=>d===first?{...d,[key]:ex[key]}:d)}});}
+      catch{fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:key,exercise_id:ex.id});}
+    /* `inc` is bounded to the OLD APP's own vocabulary: a finite number above
+       zero, OR null, which is what the old app writes where there is no plate
+       to add (src/app.jsx:399, the bodyweight raise). */
+    if(!(typeof ex.inc==='number'&&Number.isFinite(ex.inc)&&ex.inc>0)&&ex.inc!==null)
+      fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'inc',exercise_id:ex.id});
+    /* `steps` is RETAINED and bounded ONLY WHEN PRESENT. A file with no ladder
+       is the normal shape of the old app and is not a fault. */
+    if(Object.hasOwn(ex,'steps')&&!(Array.isArray(ex.steps)&&ex.steps.length&&
+        ex.steps.every((x,i)=>typeof x==='number'&&Number.isFinite(x)&&x>0&&(i===0||x>ex.steps[i-1]))))
+      fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'steps',exercise_id:ex.id});
+  }
   return {op_id:op.op_id,split:source.split,
     exercises:source.exercises.map(ex=>Object.fromEntries(PROJECTED_FIELDS
       .filter(k=>Object.hasOwn(ex,k)).map(k=>[k,ex[k]]))),
-    priority_muscles:source.priority_muscles??[]};
+    priority_muscles:source.priority_muscles??[],
+    /* THE CORRESPONDENCE, RECORDED. Which setup lift each file lift answers
+       for, by normalised name, is part of what was admitted and therefore part
+       of the programme digest at :325. */
+    lift_correspondence:correspondence(source.exercises,scratch.exercises)};
 }
```

**`normaliseName(n)`, IN FULL (review R1, N4).** One exported helper, stated
once and imported by the three readers so they cannot disagree:
`String(n).normalize('NFKD')`, combining marks removed
(`replace(/\p{M}+/gu,'')`), lower-cased with `toLowerCase()`, then every run
that is not a Unicode LETTER OR DIGIT collapsed to one space
(`replace(/[^\p{L}\p{N}]+/gu,' ')`), then trimmed. The character class is
UNICODE, not `[a-z0-9]`: a lift named in any script the athlete types in
normalises to itself, not to the empty string. A name that survives
normalisation as EMPTY - a lift called `"---"` - refuses the whole import,
field `exercise_n`, with the new sentence in 2.7. That is a strong answer for
an otherwise perfect file and it is the right one: a lift with no readable name
cannot be corresponded to anything, cannot be shown to him, and the alternative
is to guess.

**`correspondence(fileLifts, documentLifts)` IS INJECTIVE BY CONSTRUCTION
(review R1, B3).** It returns, for each DOCUMENT lift id, the ONE file lift id
it answers for, or `null`. A pair is kept only when the normalised name is
unique on BOTH sides: exactly one document lift and exactly one file lift carry
it. Both directions matter and only the file direction was stated before -
several DOCUMENT lifts binding ONE file lift is the direction that would let the
capture block count one lift twice and let the companion edit one basis lift
from two rows. Two document rows typed `"Press"` and `"Press."` normalise alike,
so NEITHER corresponds, both are kept as their own lifts under 2.5 case 2, and
nothing is silently merged.

### 2.4 The label, the kept setup lifts, and the returned basis

```diff
   const documentSets=new Map();
-  try{programmeBasis=programme(state,ops,{today:currentDay(),documentSets});}
+  const documentProgramme={state:null};
+  try{programmeBasis=programme(state,ops,{today:currentDay(),documentSets,documentProgramme});}
   catch(e){issue(e.code,null,detailOf(e));}
+  /* P3-REAL-SHAPE (DECISIONS:520 option A). A FILE WITH NO NAME TAKES HIS.
+     The old app has no athlete_label anywhere, and local-source-basis.mjs:54
+     will not adopt a state whose label is not this installation's - which is
+     why a fully admitted real-shape import left the Train screen on the setup
+     numbers with nothing on screen to read (measured, spec row 5). The owner's
+     identity Yes is the guard (DECISIONS:472 (a)) and P-LABEL above has already
+     refused a file that names someone else, so the only case left here is a
+     file that names nobody. Written onto the REPLAYED state, which is not a
+     digest input (Q hashes operations, interpretation, programme, order map and
+     engine; `state` rides in the view). */
+  if(programmeBasis&&!Object.hasOwn(state,'athlete_label')){
+    const op=ops[programmeBasis.op_id];
+    state.athlete_label=op.payload.setup.athlete_label;
+  }
+  /* AND NOTHING OF HIS IS LOST (2.5 case 2, ruled after review R1 B5). EVERY
+     document lift with no unique correspondent is appended to the admitted
+     state as an INACTIVE lift, whether or not a recorded session names it, and
+     tombstoned under the old app's own `retirements` member. The appended
+     object is the DOCUMENT CONSTRUCTOR'S OWN (documentProgramme.state, built by
+     createCleanInitState at the head of programme()), so it is valid by
+     construction and no member is invented here. It is NOT added to
+     `state.exOrder`: a retired lift leaves the day's pool by `exActive`
+     (engine/plan.cjs:87-95, no date comparison), so the gym card is unchanged
+     (2.8, cell (n6)). */
+  if(programmeBasis&&documentProgramme.state){
+    const held=new Set(state.exercises.map(e=>e.id));
+    for(const row of documentProgramme.state.exercises){
+      /* Corresponded, or already in the file's own list under this very id:
+         either way the lift is there and nothing is appended for it. */
+      if(programmeBasis.lift_correspondence?.[row.id]||held.has(row.id))continue;
+      state.exercises=[...state.exercises,{...row}];
+      state.retirements={...(state.retirements||{}),[row.id]:currentDay()};
+    }
+  }
```

**WHY EVERY UNMATCHED ROW, AND NOT ONLY THE ONES A SESSION NAMES (review R1,
B5).** The first cut of this spec said two things that cannot both hold: 2.5
scoped the append to "exactly the lifts his own recorded history still needs",
and 2.6 relied on every unmatched row still being findable in the basis. The
ordinary case breaks the pair - he typed sixteen lifts, the file holds fifteen,
and he had not yet trained the sixteenth - and the result would have been Edit
My Week refusing `PLAN_EDIT_ORIGIN_UNPROVEN` forever: the exact failure this
ticket exists to remove, moved from admission to the companion. So the rule is
the unconditional one. The state then always contains what BOTH readers expect,
the card is unaffected because the lift is retired, and "nothing of his is lost"
becomes true of the programme as well as of the history. Cell (d2).

**ORDERING, WHICH IS LOAD-BEARING.** The label write and this append happen
immediately after `programme()` returns and BEFORE any family is replayed, so
`capture_lift` (2.5) and every later reader see ONE state. `state` is
reassigned by `applyRead` and by the food projection further down `replay()`;
the build must prove both the label and the appended lifts survive to
`view.state`, not assume it (review R1, N5, and the same concern applies to the
append). And because `source-admission.mjs` is ESM and therefore strict, a
FROZEN candidate state would make both of these THROW rather than refuse, and
the throw is outside the `try` that wraps `programme()`:
`createCleanInitState` freezes deeply, which is precedent enough to measure
rather than assume. Cell (n5).

`local-source-basis.mjs` is **not edited**. Its `:54` guard is what makes the
above load-bearing: after adoption the admitted state always carries a label,
and it is always his, so the page adopts. The one change the build makes there
is a comment naming this spec, because a reader of `:49-54` must be told that
the label now arrives from admission and is no longer a reason an import is
silently dropped.

```diff
 /* WHOSE NUMBERS. today-app.cjs's SETUP_NOT_HIS_NUMBERS predicate compares the
    basis label with the label this installation's first run recorded. An import
    that does not carry the same label is NOT adopted here: painting it would
    either show a stranger's numbers as his, or show his own imported numbers
    under the sentence that says they are a sample. Either way the screen would
    be lying, so this returns null and the clean-init path stands. */
+/* P3-REAL-SHAPE. THIS IS NOW THE LAST GUARD, NOT THE FIRST. An admitted import
+   always carries a label: a file that named someone else was refused by name at
+   source-admission.mjs P-LABEL, and a file that named nobody took this
+   installation's own first-run label when it was admitted. Reaching the return
+   below therefore means a generation was assembled by something other than the
+   admission path, and withholding the adoption is still the right answer. */
 if(athleteLabel&&state.athlete_label!==athleteLabel)return null;
```

### 2.5 The pre-import Earned sessions, and the capture provenance block

THE PROBLEM, MEASURED (row 7). A workout the owner recorded on the phone before
importing was prescribed from the SETUP DOCUMENT, so every slot in it names a
setup lift by its slug id. Once the file's own lifts are adopted, the admitted
state carries the file's handles, and source-admission.mjs:398 -
`state.exercises.filter(e=>e.id===slot.lift_lineage_id).length!==1` - refuses
`capture_lift`, naming the athlete's own lift back at him.

THE RULE.

1. **RE-ATTACHED BY NAME, EXACTLY ONE MATCH.** For a slot whose setup lift has
   exactly one file lift with the same normalised name, the slot is RE-KEYED to
   the FILE's lift id in the PROJECTED session. Nothing about what he performed
   changes: the loads, the reps, the effort and the slot count ride in AS
   RECORDED, which is what P3-PORT-FIX-2 already guarantees and this spec does
   not touch. The re-key is a change of ADDRESS, not of content, and it is the
   same move the old app itself made for a renamed lift (`renames`,
   `src/app.jsx:545`).
2. **KEPT UNDER ITS OWN LIFT, ZERO OR SEVERAL MATCHES - ALWAYS, NOT ONLY WHERE
   A SESSION NAMES IT (ruled after review R1, B5).** The setup lift is appended
   to the admitted state's `exercises` as an INACTIVE lift, carrying the
   document constructor's own object (`id`, `n`, `mg`, `day`, `sets`, `hi`,
   `inc`, `steps`, `w:null`, `forks:[]`) and a retirement dated the import day
   (`state.retirements[id]=today`, the old app's own tombstone member,
   `src/app.jsx:551`). This happens for EVERY document lift with no unique
   correspondent, whether or not his recorded history names it, and it happens
   in `replay()` where the label is written (2.4), before any family is
   replayed. His recorded entries stay under it and are visible in his history.
   Nothing is dropped and nothing is silently merged into a lift he did not
   train.
3. **THE PROVENANCE RULE, RESTATED FOR BOTH CASES.**
   - `capture_producer`: unchanged.
   - `capture_lift`: reads the state AFTER re-attachment, and after the retired
     setup lifts have been appended. It therefore refuses only when a slot names
     a lift that is in neither list, which is a corrupt capture.
   - `capture_sets`: UNCHANGED, still against `documentSets` - the programme
     that PRODUCED the capture (P3-PORT-FIX-2, DECISIONS:509 Q1). Re-keying does
     not change the count, so the check is read under the setup id, before the
     re-key, and its refusal still names the setup lift.
   - `capture_membership`: **RE-POINTED AT THE PROGRAMME THAT PRODUCED THE
     CAPTURE, AND NOT RELAXED AT ALL (rewritten after review R1, B1 and B2).**
     Pool AND order are compared, exactly and in order, against the engine's own
     `sessionMembership` run on the DOCUMENT's own state for the original Start
     day - `documentProgramme.state`, the constructor's state built from the
     setup document at the head of `programme()` - because the document is the
     programme the gym card prescribed from when it wrote that capture. This is
     the SAME ruling `capture_sets` already runs under (P3-PORT-FIX-2,
     DECISIONS:509 Q1, and the comment at source-admission.mjs:432-445 says it
     in those words: "The document is the programme that PRODUCED the capture").
     The admitted state is no longer the right-hand side of this comparison, for
     the reason P3-PORT-FIX already gave about `capture_sets`: after option A
     the state is the FILE's, its `exOrder` is the FILE's, and asking a capture
     to match a pool and an order that did not exist when it was written refuses
     a workout he really did.

     THE ADMITTED STATE STILL HAS TO CARRY WHAT THE CAPTURE NAMES, and that is
     `capture_lift`'s job, one slot at a time, over the RE-KEYED id: every named
     lift is either corresponded to a file lift or kept as its own retired lift
     by rule 2, so the check is total and its refusal means a corrupt capture.
     Nothing is proved twice and nothing is dropped.

     WHY THIS IS NOT A RELAXATION. The first cut compared the re-keyed ids with
     the FILE's pool and then withheld the order comparison wherever any slot
     had been re-keyed - which, in the normal option-A case, is every slot, so
     order was never compared at all, for the whole population this ticket
     targets. The rule above compares order EXACTLY, always, against the only
     programme that can answer for it. **PM QUESTION 3 is therefore withdrawn**;
     section 6 records what it was and what replaced it.

```diff
-    const layout=adapter.readLayout(start.prescription_capture),counts=new Map();
-    for(const slot of layout.slots){
-      if(state.exercises.filter(e=>e.id===slot.lift_lineage_id).length!==1)
-        fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'capture_lift',exercise_id:slot.lift_lineage_id});
-      counts.set(slot.lift_lineage_id,(counts.get(slot.lift_lineage_id)||0)+1);
-    }
+    const layout=adapter.readLayout(start.prescription_capture),counts=new Map();
+    /* P3-REAL-SHAPE. `attach` is programmeBasis.lift_correspondence: the
+       DOCUMENT lift id the capture names -> the FILE lift id it answers for, or
+       null where the name matched zero or several file lifts. */
+    const attach=id=>programmeBasis?.lift_correspondence?.[id]??null;
+    for(const slot of layout.slots){
+      const target=attach(slot.lift_lineage_id)??slot.lift_lineage_id;
+      if(state.exercises.filter(e=>e.id===target).length!==1)
+        fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'capture_lift',exercise_id:slot.lift_lineage_id});
+      counts.set(slot.lift_lineage_id,(counts.get(slot.lift_lineage_id)||0)+1);
+    }
     for(const [id,count]of counts)if(documentSets.get(id)!==count)
       fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'capture_sets',exercise_id:id});
     const originalDay=start.effective.local_date,...
-    const expected=Runtime.createEngineRuntime({clock:originalClock}).sessionMembership(state,originalDay);
-    if(!expected||!['U','L'].includes(expected.day)||encode([...counts.keys()])!==encode([...expected.exercise_ids]))
-      fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'capture_membership'});
+    /* P3-REAL-SHAPE. THE PROGRAMME THAT PRODUCED THIS CAPTURE IS THE DOCUMENT,
+       exactly as it is for capture_sets above. `documentProgramme.state` is the
+       state createCleanInitState built from the setup document at the head of
+       programme(), and it is filled before any comparison there can refuse.
+       THE GUARD ORDER IS LOAD-BEARING: sessionMembership returns NULL for any
+       day that is not U or L (engine/today.cjs:83-85), so nothing may be read
+       off it before it has been tested (review R1, B1). */
+    const produced=documentProgramme.state
+      ?Runtime.createEngineRuntime({clock:originalClock}).sessionMembership(documentProgramme.state,originalDay)
+      :null;
+    if(!produced||!['U','L'].includes(produced.day)||
+       encode([...counts.keys()])!==encode([...produced.exercise_ids]))
+      fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'capture_membership'});
```

WHAT THE THREE READERS NOW READ, IN ONE LINE EACH. `capture_sets`: the
DOCUMENT's per-lift count, under the document's own id, before the re-key.
`capture_membership`: the DOCUMENT's pool and order for that day, under the
document's own ids, before the re-key. `capture_lift`: the ADMITTED state,
under the RE-KEYED id, because that is the state the projected session lands
in. Two readers ask the programme that wrote the capture; one asks the state
that will hold it; none of them asks a programme a question it cannot answer.

THE RETIREMENT DATE IS NOT A DATE COMPARISON, AND THAT MATTERS HERE (review R1,
N6). `exActive` (`rebuild/engine/plan.cjs:87-95`) returns false for any id in
`s.retirements` with NO comparison against the day being asked about. So a
setup lift retired on the import day is out of the pool even for a day BEFORE
the import - which is exactly why `capture_membership` cannot be asked about
the admitted state for a pre-import day, and is one more reason the document is
the right-hand side. It is also why the appended lift never reaches the gym
card (2.8).

### 2.6 The Edit My Week companion

```diff
-const P2_ROW = ['id','day','mg'];
+/* P3-REAL-SHAPE. The document row and the basis lift no longer share an id:
+   the basis is the FILE's and the document is the phone's. What still has to
+   agree is the lift's PLACE in the week. */
+const P2_ROW = ['day','mg'];
 const splitShapeOk = (periods, documentSplit) => Array.isArray(periods) && periods.length > 0 &&
   periods.every(p => p && typeof p === 'object' && !Array.isArray(p) &&
-    Object.keys(p).every(k => k === 'from' || k === 'map') &&
+    /* `why` is the file's own note, retained by admission (P3-REAL-SHAPE 2.3).
+       It is accepted here for the same reason `from` is not compared: it is the
+       file's history of its own week, not a claim this screen adjudicates. */
+    Object.keys(p).every(k => k === 'from' || k === 'map' || k === 'why') &&
+    (!own(p,'why') || typeof p.why === 'string') &&
     own(p,'from') && own(p,'map') && equal(p.map, documentSplit.map));
```

```diff
   if (!Array.isArray(setup.exercises) || !setup.exercises.length ||
-      setup.exercises.length !== base.exercises.length ||
+      /* LOCAL-SOURCE: the file may list more lifts than the document, fewer, or
+         a different set. The count is a FIRST-RUN proof only. */
+      (!localSource && setup.exercises.length !== base.exercises.length) ||
       base.athlete_label !== setup.athlete_label ||
```

```diff
   for (let i = 0; i < setup.exercises.length; i++) {
-    const row = C.exerciseOf(setup.exercises[i]), e = firstRun ? base.exercises[i] : byId.get(row.id);
-    if (baseIds.has(row.id) || !byId.get(row.id) || !e) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
-    baseIds.add(row.id);
+    const row = C.exerciseOf(setup.exercises[i]);
+    /* LOCAL-SOURCE (P3-REAL-SHAPE). The document row is matched to the basis
+       lift BY ITS OWN ID FIRST and then by NORMALISED NAME, which is the same
+       correspondence admission recorded in the programme digest. The id branch
+       is what finds a lift the import RETIRED: admission appended it to the
+       basis under the DOCUMENT's own id (P3-REAL-SHAPE 2.4), so every row is
+       found either way. A row that matches neither, or one whose basis lift a
+       previous row already bound, is a document this companion cannot edit
+       safely and refuses.
+       THE FIRST-RUN BRANCH IS UNTOUCHED, including its `byId.get(row.id)`
+       requirement (review R1, B4): only the local-source branch stops using the
+       id lookup as its binding. */
+    const e = firstRun ? base.exercises[i] : (byId.get(row.id) || matchByName(base.exercises, row));
+    if (baseIds.has(row.id) || !e) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
+    if (firstRun ? !byId.get(row.id) : boundBasis.has(e.id)) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
+    baseIds.add(row.id); boundBasis.add(e.id);
```

```diff
   const baseIds = new Set();
+  /* ONE ROW, ONE BASIS LIFT (review R1, B3). `baseIds` reads as the duplicate
+     guard and WAS one only because the row's id and the basis lift's id were
+     the same id; document ids are unique by construction (`slugOf`
+     disambiguates with a numeric suffix), so on the local-source branch it can
+     never fire and it is the BASIS side that has to be guarded. */
+  const boundBasis = new Set();
   let rowsOk = true, tagsOk = true;
```

`matchByName(base.exercises, row)` returns the basis lift whose normalised name
equals the row's ONLY when that name is unique on both sides - the same
injective rule `correspondence` uses in 2.3, out of the same module. Where it is
not unique, it returns nothing, and the row's own id branch above is what finds
the lift admission kept for it.

The tag key-set check at the end of the loop keys on `row.id` and stays exactly
as it is: it validates the DOCUMENT's own tag map against the DOCUMENT's own
rows and reads nothing from the basis, which is what its comment already says.

`matchByName` uses the SAME `normaliseName` as admission, imported from one
place. The build must not restate it: a second spelling of the rule is a second
rule.

### 2.7 The screen's words

```diff
 export const REFUSAL_FIELD_SENTENCE = Object.freeze({
   capture_sets: COPY.captureSetsMismatch,
-  setup_document: COPY.noSetupDocument });
+  setup_document: COPY.noSetupDocument,
+  athlete_label: COPY.differentName,
+  capture_lift: COPY.captureLiftMissing,
+  exercise_n: COPY.unnamedLift });
```

```diff
+  /* P3-REAL-SHAPE. THREE MORE FIELDS ARRIVE UNDER THE PROGRAMME CODE FOR
+     REASONS "a different training week" DOES NOT DESCRIBE. No value from the
+     file is in any of them; each keeps the second half, which is the fact he
+     most needs and which the screen guarantees by retracting. */
+  differentName: 'This file was saved under a different name than the one you '
+    + 'set up on this phone. Nothing on this phone was changed.',
+  captureLiftMissing: 'A workout you already recorded on this phone names a lift '
+    + 'this file does not have. Nothing on this phone was changed.',
+  unnamedLift: 'A lift in this file has no name Earned can read. Nothing on this '
+    + 'phone was changed.',
```

`refusalLines()` itself is unchanged: it already keys the sentence on the
LEADING issue's field and falls through to the code's sentence for a field it
does not name. The three fields `sets`, `hi` and `inc` keep the programme
sentence, which is true of them.

### 2.8 What the two screens show the next morning

**TRAIN.** The FILE's programme, per lift: its own lifts under its own names,
its own set count, its own rep target, its own increment and its own ladder,
on the day the FILE's split map names. Measured on the shipped page in cell
D-RS-d: the card's total for the U day is the file's 26 and not the phone's 27.
The setup document supplies nothing. A lift the import retired (2.5 case 2) is
NOT on the card - it is inactive, and `exActive` honours `retirements` with no
date comparison at all - but its history is his and is kept.

**AND THE SENTENCE UNDER THE CARD CHANGES (review R1, N7).**
`today-app.cjs:317-320` `setupNoteNeeded(enrolled, athleteLabel, state)` returns
true while `state.athlete_label !== athleteLabel`, and that is what puts "these
are sample numbers" on Today. After the 2.4 label write the adopted state always
carries the phone's label, so the sentence CLEARS on the morning after an
import. That is the right outcome - the numbers on the screen really are his
now - and it is one of the most visible consequences of this ticket, so it gets
its own cell (n7) rather than arriving as a surprise.

SUBJECT TO GAP 5. On a day that carries a lift whose working load is `BW` or
`hold`, there is no card at all until the page's capture producer is the v2
`CONFIGURATION_PROFILE`. See PM QUESTION 1.

**EDIT MY WEEK.** Opens on the file's programme, on the local-source branch,
with the file's `why` retained on each period and the file's lift ids in the
rows. It lists every active lift of the file and every lift the import retired,
the second group marked as retired, so he can see what happened to a lift he
set up on the phone and then did not find in his file.

---

## 3. FILES TOUCHED

### 3.1 Product files the build changes

| file | S7-pinned? | what changes |
|------|-----------|--------------|
| `rebuild/m3/w6/local/source-admission.mjs` | **yes** (S7 receipt `sealedRun.product`) | `programme()` (2.3), the label write and the retired-lift append in `replay()` (2.4, 2.5), the capture block (2.5), three new field names in the closed vocabulary comment |
| `rebuild/m3/w7-preview/today/local-source-basis.mjs` | **NO - not pinned in any package or receipt** | comment only (2.4). It is on the adoption path and must be read by the reviewer even though it is not edited in substance |
| `rebuild/m4/workout/plan-edit-model.cjs` | **yes** | `splitShapeOk`, `P2_ROW`, the count check, the name match (2.6) |
| `rebuild/m3/w7-preview/import/import-screen.mjs` | **yes** | three COPY lines and three `REFUSAL_FIELD_SENTENCE` entries (2.7) |
| `rebuild/m3/w6/local/today-bindings.mjs` | **yes** | `PRODUCER.rule_profile` -> `Adapter.CONFIGURATION_PROFILE`, **only if PM QUESTION 1 is answered yes** |
| a new `rebuild/m4/import/lift-correspondence.cjs` | new file | `normaliseName` and `correspondence`, imported by admission and by the companion so the two cannot disagree |

CORRECTION TO THE DISPATCH. DECISIONS:520 says "all four are pinned". Measured:
`source-admission.mjs`, `plan-edit-model.cjs`, `import-screen.mjs`,
`today-bindings.mjs` and `athlete-state.cjs` ARE in the S7 receipt's product
list; `local-source-basis.mjs`, `setup-model.mjs` and `engine-capture.cjs` are
in **no** package and **no** receipt. The pinned ones ride S8 and need the
ruled-substitution entry that
`rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs`
enforces; the unpinned ones do not. The build must confirm this against the
tooling before it writes, because a wrong answer here fails preflight, not the
cells.

### 3.2 Files this ticket must NOT touch

`rebuild/DECISIONS.md`; `rebuild/engine/**` (the migration and the settle pass
are correct and are what makes 1.2 true); `athlete-state.cjs` (the constructor's
bounds are right for a DOCUMENT and this spec stops asking it about members a
FILE never had); `port.cjs`, `prepare.cjs`, `replay-core.cjs`, `import-bundle.mjs`
(the file sealed and unsealed first time, byte for byte); `setup-model.mjs` (the
setup flow is not changed by this ticket - see 5).

### 3.3 Test files

- NEW (this branch, already written and green against the unchanged tree):
  `rebuild/lanes/d/p3-real-shape/real-shape-walk.test.mjs`,
  `rebuild/lanes/d/p3-real-shape/real-shape-capture.test.mjs`.
- CHANGED by the build: of the FIFTEEN cells this branch carries, ELEVEN INVERT
  and FOUR STAY AS THEY ARE (the count is corrected after review R1, N8; section
  1's thirteen rows are not thirteen cells - rows 9-11 are one cell with three
  assertions, and rows 12-13 are cells that measure a NON-gap). Each inverting
  cell's name says what it measures today; the build rewrites the name and the
  assertion together, the way P3-PORT-FIX-2 inverted D-PF-f1.

  | cell | section 1 row | after the build |
  |------|---------------|-----------------|
  | D-RS-a0 | 1 | INVERTS: admits, no refusal line |
  | D-RS-a | 2 | INVERTS: `why` stripped is no longer the variable that matters |
  | D-RS-b1 | 3 | INVERTS: handle ids admit |
  | D-RS-b2 | 4 | INVERTS: no ladder admits |
  | D-RS-b3 | 4 | INVERTS in its reason: it already admits, but for a new reason; the name changes and the bracket step it seals changes |
  | D-RS-c | 5 | INVERTS: an unlabelled file is ADOPTED under the phone's label |
  | D-RS-d | 6 | STAYS green, with the label now supplied by admission, not by the bracket |
  | D-RS-f | 13 | STAYS: the extra members still survive |
  | D-RS-e | 12 | STAYS: `mg` is still not a gap |
  | D-RS-0 | - | STAYS: the fixture's shape is the measurement's own premise |
  | D-RS-g1 | 7 | INVERTS: the pre-import session admits and is re-keyed |
  | D-RS-g2 | 7 control | STAYS green and gains the re-key assertion |
  | D-RS-h | 8 | INVERTS ONLY IF PM QUESTION 1 is answered yes; otherwise it stays green and becomes the named record of a shipped limitation |
  | D-RS-h2 | 8c | STAYS green |
  | D-RS-k | 9-11 | INVERTS all three assertions |
- RE-POINTED at the real-shape fixture (they seal an invented one today):
  `rebuild/m3/w7-preview/import/test/support.mjs` gains `sealRealShapeBundle`
  beside `sealInventedBundle` - nothing existing is removed, because the
  invented fixture is still the right fixture for the cells that are about the
  MACHINERY rather than about the file. The cells that claim something about the
  OWNER move: `lanes/d/p3-port-fix/owner-route.test.mjs` D-PRR-1 and D-PRR-2,
  `lanes/d/p3-port-fix/capture-codes.test.mjs` D-PF-f1 and D-PF-f4,
  `lanes/d/p3-port-fix/programme-rule.test.mjs` (the P-A and P-B cells),
  `m3/w6/test/local-source-consumer.test.mjs` (the adoption cells),
  `m3/w7-preview/import/test/route.test.mjs` (the composed route cell).
  The refusal-guard cells (`refusals.test.mjs`, `refusal-route.test.mjs`,
  `STRANGER_WEEK_SETUP`) stay on the invented fixture: a stranger's week is a
  stranger's week whatever shape it has, and re-pointing them would weaken a
  negative.

### 3.4 Fixture files

- `rebuild/lanes/d/p3-real-shape/legacy-fixture.cjs` - the legacy state, the
  sixteen lifts, the split entry, the typed setup answers. COMMITTED.
- `rebuild/lanes/d/p3-real-shape/real-shape-support.mjs` - the bracket, the
  seal through the real `port.cjs`, the route walk. COMMITTED.
- The sealed bundle and its passphrase are NOT committed: `sealInventedBundle`
  regenerates both per test process into the OS temp folder, outside every git
  working tree, and the passphrase is the port's own minted one. There is no
  passphrase constant to keep, which is better than keeping a synthetic one.

---

## 4. THE CELL PLAN: THE ACCEPTANCE BAR

Every cell runs the SHIPPED page (`design.shellHtml()`, `today-entry.mjs`
boot(), the real encrypted repository over fake-indexeddb, the real Import
route) on a live clock, against a bundle sealed by the REAL `port.cjs` from the
real-shape fixture. Nothing is mounted by hand and nothing is stubbed.

**(a) THE BAR.** A fresh-start phone whose setup names the same lifts BY NAME
imports the real-shape bundle - `why` on the periods, short-handle ids, no
`athlete_label`, no `steps`, `inc: null` on the bodyweight lift, `BW` and
`hold` working loads - and the screen shows no refusal, takes custody, commits,
and takes nothing back. This is cell D-RS-a0 INVERTED.

**(b) ADOPTED, AND THE MORNING.** The next morning on the same IndexedDB at a
second instant: `admittedLocalSourceBasis` returns the file's state; the PAGE's
own card (not a host the cell opened) carries the FILE's lifts, the FILE's ids,
and each lift's own `sets` and `hi`; the card's total is the file's and not the
document's, on BOTH day kinds. D-RS-d and D-RS-h inverted.

**(c) ONE PRE-IMPORT SESSION UNDER A SLUG ID, RE-ATTACHED.** A phone that
recorded one Earned workout before importing admits, and the projected session's
entries are keyed to the FILE's lift ids, with the slot count still the
DOCUMENT's (as recorded, never rebased) and the loads and reps unchanged. The
session is visible in his history under the file's lift. D-RS-g1 inverted.

**(d) AN AMBIGUOUS NAME, KEPT AS ITS OWN ENTRY.** A phone whose setup names a
lift the file names twice (or not at all): the import still admits, the setup
lift is in the admitted state as an inactive lift with a retirement dated the
import day, the recorded session stays under it, and nothing is dropped. NEW.

**(d2) AN UNMATCHED LIFT WITH NO RECORDED SESSION AT ALL.** The ordinary case:
the phone's setup names sixteen lifts, the file holds fifteen of them, and the
sixteenth was never trained on this phone. The import admits; the sixteenth lift
is in the admitted state as an inactive, tombstoned lift; the gym card's total
is unchanged by it on both day kinds; and **Edit My Week opens**, with that lift
listed as retired. NEW, and it is the cell review R1 (B5) found missing - without
the unconditional append this is a permanent `PLAN_EDIT_ORIGIN_UNPROVEN`.

**(d3) TWO DOCUMENT ROWS, ONE FILE LIFT.** A setup that names `"Press"` and
`"Press."` against a file with one `Press`: NEITHER row corresponds, both are
kept as their own retired lifts, the file's `Press` is bound by no row, the
import admits, and the companion opens with every row bound to a different basis
lift. NEW (review R1, B3). A build that makes `correspondence` injective on only
one side fails this cell.

**(d4) THE CAPTURE'S ORDER IS STILL PROVED.** A pre-import capture whose slot
order does not match the DOCUMENT's own pool order for that day refuses
`capture_membership`, on a file whose lifts all correspond - proving the order
comparison of 2.5 is live and was not lost in the re-key (review R1, B2). Its
control: the same capture, with the file's own `exOrder` shuffled so the FILE's
pool order differs from the document's, still ADMITS, because the file's order
is not what the capture was written against. NEW.

**(d5) A START ON A DAY THE WEEK CALLS REST.** A phone holding one pre-import
Start on a day whose map entry is `REST` refuses `capture_membership` **by
name**, with no `TypeError` anywhere on the path and the whole refusal
retracted. `sessionMembership` returns `null` for any day that is not U or L
(`engine/today.cjs:83-85`), so this cell is the guard-order proof review R1 (B1)
asked for: a diff that reads `expected.exercise_ids` before testing `!expected`
crashes here instead of refusing, and OPT-3's diagnosis-by-field-name fails
exactly when it is needed. NEW.

**(n5) THE WRITE ITSELF, NOT JUST ITS CONSEQUENCE.** The label write and the
retired-lift append of 2.4 are asserted DIRECTLY on `view.state`: the label is
present and equal to the phone's, the appended lifts are present with their
retirements, and both survive the `applyRead` and food-projection reassignments
that follow them in `replay()`. And the negative: if `prep.candidateState()` is
ever frozen, a strict-mode assignment THROWS outside the `try` that wraps
`programme()`, so the build measures whether it is frozen before it writes the
line, and uses a copy rather than a mutation if it is. NEW (review R1, N5).

**(n6) THE APPENDED LIFT STAYS OUT OF THE POOL, AND STAYS OUT.** After a later
boot on a new day, the retired setup lift is still absent from the gym card on
both day kinds, is still absent from `state.exOrder`, and `canonicalizePlan`
has not reinstated it. `exActive` (`engine/plan.cjs:87-95`) honours
`retirements` with no date comparison, which is what makes this true and is
also why 2.5's document-side membership rule is the right one. NEW (review R1,
N6).

**(n7) THE SAMPLE-NUMBERS SENTENCE CLEARS.** On the morning after an adopted
import, `setupNoteNeeded` is false and the sentence is not on Today - and on a
phone whose import was REFUSED it is still there. NEW (review R1, N7).

**(e) THE LABEL, BOTH WAYS.** Absent in the file: admitted, and the admitted
state carries the PHONE's first-run label, and the page adopts (D-RS-c
inverted). Different from the phone's: REFUSED by name, field `athlete_label`,
and the screen renders exactly
`LOCAL_SOURCE_PROGRAMME_UNRESOLVED (athlete_label)` plus the one new sentence,
with no number, no en dash, no em dash and no value from the file in it. NEW.

**(f) THE NEGATIVES, ON THE REAL SHAPE.** A stranger's week (one day letter
different) still refuses `split.map` and names no lift; a future-dated
`split.from` still refuses `split.from`; a period array that is not an array
still refuses `split`; a file with two lifts sharing one id refuses
`exercise_id`; a lift whose name normalises to nothing at all
(`"---"`) refuses `exercise_n`; a `sets: 0` still refuses `sets` with its lift
id. And the control review R1 (N4) asked for: a lift named in a NON-LATIN
script admits and corresponds normally, because `normaliseName`'s class is
`\p{L}\p{N}` and not `[a-z0-9]`. Every refusal retracts and writes nothing.

**(g) THE COMPANION.** Edit My Week opens on the adopted real-shape basis -
`why` retained, handle ids, the phone's label - and lists both the file's active
lifts and any retired setup lift. D-RS-k inverted.

**(h) THE EXISTING CORPUS.** Every S7 cell green. The cells listed in 3.3 that
move to the real-shape fixture are named in the build's report, one line each,
with what changed in the assertion and why. The refusal-guard cells that stay
on the invented fixture are named too, with why.

**(i) THE INVARIANT ROWS (DECISIONS:439 (1)).** On the real-shape fixture: the
device writes nothing on any refusal (revision, op count, outbox count and
import entries identical before and after); every refusal retracts with reason
`review-refused`; no byte leaves the device (the `installTraps` recorder fires
nothing on the whole walk); the passphrase never appears in any rendered text;
no value from the file rides out on a refusal line.

**(j) RED FIRST.** Each cell of (a) to (g) is run against the UNCHANGED tree
first and must fail with the code and field section 1 records. The FIFTEEN cells
in this branch ARE that red-first run, recorded green as measurements; ELEVEN of
them invert and FOUR stay (the table in 3.3 says which, corrected after review
R1, N8). The build inverts them one at a time and the report states, per cell,
which S7 line made it red. The cells added by this revision - (d2), (d3), (d4),
(d5), (n5), (n6), (n7) - are NEW and have no red-first line in this branch; each
one's report line says instead which rule of section 2 it holds to account.

---

## 5. NOT CHANGED

- **The setup flow.** `setup-model.mjs` is untouched. A fresh-start owner who is
  about to import still types a set count, a rep target and a ladder he will not
  train on. That is the sequencing wart P3-PORT-FIX-SPEC 2.3 named and it stays
  its own ticket. The one honest thing this ticket could add - a sentence on
  screen 6 saying the answers are replaced by an import - is copy on a screen
  this ticket does not otherwise open, and it is left out deliberately.
- **`slugOf`.** The phone keeps minting slugs. The file's handles win on
  adoption; nothing renames anything on the phone.
- **The engine, the migration, the settle pass, the port and the bundle
  format.** All correct on the real shape, measured.
- **`athlete-state.cjs`.** The constructor's bounds are right for a document.
- **THE COMPANION'S FIRST-RUN BRANCH, INCLUDING ITS ID LOOKUP.** 2.6 changes the
  LOCAL-SOURCE branch only. `firstRun` still binds `base.exercises[i]` AND still
  requires `byId.get(row.id)` to exist, so a document row whose id is absent
  from a clean-init basis still fails the proof it fails today. The first cut of
  the 2.6 diff dropped that requirement from both branches, which review R1 (B4)
  caught; a build that leaves it dropped weakens a path this ticket never asked
  to touch.
- **The identity question and the retract path.** Untouched.
- **Who wins after an import.** `today-app.cjs:2488` already returns
  `imported || setup.athleteState()`. No seam is added and no fork is built.
- **The invented fixtures.** `sealInventedBundle` and the journey fixture stay;
  the real-shape fixture is added beside them.

---

## 6. RISKS, AND THE OPEN QUESTIONS

### 6.1 What the REAL file might still carry that this fixture does not

The fixture is the SEED's shape. The owner's file is the seed's shape plus
every edit he has made since, and it is a MIGRATED state rather than an authored
one. Three classes of difference are plausible and none of them can be looked
for, because his file is never opened by this lane:

1. **A second split period.** He has changed his week at least once
   (`patchV40`'s note is dated, and a live state accumulates entries). P-A
   requires EVERY period's map to equal the phone's ONE week, so a file whose
   week changed in the past cannot be admitted by any fresh-start setup at all.
   This is the single most likely next refusal, it is field `split.map`, and
   this spec does NOT fix it. **PM QUESTION 2.**
2. **A lift the phone's setup does not name, or a name typed differently.**
   Handled: the file wins, and 2.5 keeps his own recorded sessions.
3. **A member of an exercise or of the state that no fixture has.** Handled
   structurally: nothing on the path enumerates members (1.2), so an unknown one
   rides through.

**HOW TO FIND OUT WITHOUT READING THE FILE.** The next retry. OPT-3 already
makes the screen print the machinery's own FIELD beside the code, from a closed
vocabulary that no value from the file can ride out on (import-screen.mjs:435-446,
P3-PORT-FIX-SPEC 3.1). So the owner's next attempt - after this build ships -
either succeeds or shows exactly one field name, and that field name is the
whole diagnosis. The PM should ask for the screenshot and nothing else. If it
reads `split.map`, it is (1) above and the answer is a PM ruling about which
week governs, not a code change guessed in the dark.

### 6.2 The other risks, in the order I would worry about them

1. **GAP 5 and the capture producer (PM QUESTION 1).** Moving
   `today-bindings.mjs` to `Adapter.CONFIGURATION_PROFILE` is the only way a
   `BW` or `hold` lift prescribes, and it changes the layout profile the page
   WRITES (`earned/captured-lift-layout/v2`). `engine-capture.cjs` refuses to
   read a v1 layout under a v2 adapter and vice versa
   (`m4/workout/test/configuration-capture.test.cjs:52-53`), so any capture the
   owner's phone already wrote under v1 must still be readable. The build must
   MEASURE that before it changes the line: a phone with one v1 capture, then
   the producer switched, then the card read and the import run. If it does not
   hold, the fallback is to leave the page on v1 and REFUSE the import by name
   on a configuration load, which is worse for the owner and must go back to the
   PM. Do not change this line on the strength of this paragraph.
2. **The correspondence rule is a rule about NAMES, and names are typed.** A
   one-character difference between what he typed on the phone and what the old
   app holds makes a lift ambiguous, and 2.5 case 2 then retires the setup lift
   and keeps his session under it. That is the safe failure and it loses
   nothing, but it produces a state with more lifts than either programme, which
   the companion and the Train screen both have to show honestly. Cell (d).
3. **`programme_digest` changes shape** (`lift_correspondence` is a new member,
   `n` joins `PROJECTED_FIELDS`). Every recorded basis on a device in the field
   is bound to the OLD shape. There are no such devices - the owner's import has
   never been committed - but the build must confirm that with `listImports` on
   his installation before it ships, not assume it.
4. **`capture_membership` is no longer relaxed at all, and PM QUESTION 3 is
   WITHDRAWN.** The first cut compared the re-keyed ids against the FILE's pool
   and dropped the order comparison wherever a slot had been re-keyed - which is
   every slot in the case this ticket targets, so order would never have been
   compared, and the question put to the PM described a narrower relaxation than
   the code performed (review R1, B2). 2.5 now compares pool AND order exactly,
   against the DOCUMENT's own membership for that day, which is the programme
   that wrote the capture and the same right-hand side `capture_sets` already
   uses. Nothing is weakened and there is nothing left to rule. The residual
   risk is the one `capture_sets` already carries and DECISIONS:509 Q1 already
   ruled on: if the athlete EDITED his week on the phone before importing, the
   document is no longer exactly the programme that prescribed, and both checks
   would refuse. That is a known, named, pre-existing bound, not a new one.

5. **THE ONLY REMAINING PROOF THAT THE FILE IS HIS IS ONE TAP (review R1, N2).**
   P-LABEL is unreachable on every old-app file (none carries a label), and
   option A removes the per-lift id multiset equality that was, accidentally,
   S7's last content guard. A different old-app athlete's file on the same week
   is admitted and adopted on the identity Yes alone, with this phone's name
   written onto it. Inside DECISIONS:520's ruling, recorded here so the PM reads
   it before he answers, and stated in 2.1.

6. **A BUNDLE IS PORTABLE AND THE LABEL IS NOT IN IT (review R1, N3).** The
   bundle carries no name of its own, so with 2.4 an unlabelled old-app file
   takes the label of WHATEVER installation imports it. The same bundle imported
   on a second athlete's phone comes out bearing that athlete's name, is
   adopted, and is thereafter indistinguishable from his own record. Harmless
   today - there is one such file and one such phone, and the identity Yes and
   P-LABEL stand in front of it - and not harmless the moment two installations
   exist and a bundle is ever relayed. If the PM wants it covered, the cell
   belongs in lane C's dad-first-run corpus (a second athlete importing the same
   bundle), not here.
7. **Three readers of one rule.** `normaliseName` in one module, imported. If
   the build restates it anywhere, the bug is guaranteed and will be silent.

### 6.3 The questions for the PM: TWO, not three

1. Switch the page's capture producer to `CONFIGURATION_PROFILE` so a `BW` or
   `hold` lift prescribes (recommended, subject to the measurement in 6.2 (1))?
   Without it the owner's LOWER day has no card the morning after a successful
   import.
2. If his file carries more than one split period with different weeks, which
   week governs? Recommendation: the period in force TODAY is what P-A proves
   against, and the earlier periods are retained unexamined as his own history.
   That is a one-line change to P-A and it should be ruled now rather than after
   the next refusal.
3. ~~`capture_membership`: set comparison where adoption changed the pool, or
   exact order always?~~ **WITHDRAWN after review R1 (B2).** The question was
   put against a relaxation the code did not perform, and the honest fix needs
   no ruling: 2.5 compares pool and order exactly, against the programme that
   produced the capture. Nothing for the PM to decide. If he wants one thing
   from this paragraph it is the sentence in 6.2 (5), which is about identity,
   not order.

AND ONE THING TO READ RATHER THAN ANSWER: 6.2 (5). After this ticket the only
proof that an imported file is his is the identity Yes. That is his own ruling
(DECISIONS:520, :472 (a)) and this spec implements it; it is written down here
so it is a decision he keeps making rather than one he made once.

---

## 7. ESTIMATE

In working days, for one Opus builder with an independent reviewer and one fix
round, the way S7 ran.

| | |
|---|---|
| `lift-correspondence.cjs` + `programme()` + the label write + the retired-lift append | 1.0 |
| the capture block (2.5) and its cells | 1.0 |
| the companion (2.6) and its cells | 0.5 |
| the screen's three sentences and their cells | 0.25 |
| PM QUESTION 1: the producer measurement, then the change or the fallback | 0.75 |
| re-pointing the corpus cells named in 3.3 and keeping every S7 cell green | 1.0 |
| the bar cells (a) to (j), red-first | 1.5 |
| the seven cells this revision adds - (d2), (d3), (d4), (d5), (n5), (n6), (n7) | 0.75 |
| the S8 package, the ruled-substitution entries, preflight | 0.5 |
| **total** | **7.25** |

Plus the review round. The two largest items are the capture block and the
corpus re-point, and both are large for the same reason: they are where the
phone's own history meets the file's, which is the one place option A cannot be
"the file wins" and has to be "and nothing of his is lost".

---

## 8. REVIEW DISPOSITION (R1)

Reviewed independently at `e35c296` and REJECTED with one fix round; the
measurement half was accepted as it stands and is carried into this revision
unchanged, as the reviewer asked. Every blocking finding is FIXED. Nothing is
disputed. Each one below says where the fix is and what a build should look at
to confirm it landed.

### The six blocking findings

**B1. `capture_membership` dereferenced `expected` before the `!expected`
guard. FIXED (2.5).** Verified first: `sessionMembership` returns `null` for any
day that is not U or L (`rebuild/engine/today.cjs:83-85`), so a Start on a day
the adopted week calls REST would have thrown a `TypeError` inside `replay()`
instead of refusing by name. The rewritten diff tests `!produced` before it
reads anything off it, and cell (d5) is the proof: a pre-import Start on a REST
day must refuse `capture_membership` by name, with no throw on the path.

**B2. The order test implemented "no slot was re-keyed", not what the prose
said, and PM QUESTION 3 asked about a different relaxation. FIXED (2.5), by a
different fix than the one recommended, and the finding is accepted in full.**
The recommendation - compare order whenever the two lists are the same SET -
would refuse a real workout in the ordinary case, because the order it would
compare against is the FILE's `exOrder` and the capture was written against the
DOCUMENT's. So this revision re-points the comparison instead: pool AND order,
exact and unrelaxed, against `sessionMembership` on the DOCUMENT's own state for
that day, which is the programme that produced the capture and the same
right-hand side `capture_sets` has used since P3-PORT-FIX-2 (DECISIONS:509 Q1).
The proof is now STRONGER than either the first cut or the recommendation, the
admitted state keeps its own job through `capture_lift`, and PM QUESTION 3 is
withdrawn rather than restated. `documentProgramme` is a new out-parameter of
`programme()`, filled beside `documentSets` and for the same stated reason; it
is not a member of the returned basis, so the digest is unaffected by it. Cell
(d4) proves the order comparison is live; its control proves the file's own
order is NOT what a capture is asked to match.

**B3. The name match lost one-row-one-lift. FIXED (2.3 and 2.6).**
`correspondence` is now injective BY CONSTRUCTION - a pair is kept only where
the normalised name is unique on BOTH sides - and 2.3 says so. The companion
adds `boundBasis` and refuses a second row binding a basis lift an earlier row
already bound. Cell (d3) is the case the reviewer named: `"Press"` and
`"Press."`, which normalise alike, now correspond to nothing and are both kept
as their own lifts rather than both editing one file lift.

**B4. The 2.6 diff weakened the FIRST-RUN path. FIXED (2.6, and stated in 5).**
The id lookup stays on the first-run branch; only the local-source branch stops
using it as its binding. Section 5 now names this explicitly so a build cannot
lose it again.

**B5. 2.5 and 2.6 contradicted each other about which setup lifts are kept.
FIXED, and RULED the way the reviewer recommended (2.4, 2.5 case 2).** EVERY
document lift with no unique correspondent is appended as an inactive,
tombstoned lift, whether or not a recorded session names it. The state then
always contains what both readers expect; the card is unaffected because
`exActive` honours `retirements`; and Edit My Week opens for the ordinary case
the first cut would have refused forever. Cell (d2) is the missing cell, and it
is the one that would have caught this.

**B6. The fixture carried the seed athlete's own `sets`, `hi` and `inc`. FIXED
(`legacy-fixture.cjs`).** Re-measured against `EXERCISES` (:386-:433) as amended
by the weave (`hack.hi`, `calves.hi`, `rows.hi` at :545-:547): the reviewer's
count was right. Every one of the sixteen lifts now carries a set count, a rep
target and an increment chosen for this fixture; none is the seed's value for
that lift. The single value kept is `inc: null` on the bodyweight raise, which
is a TYPE and is the whole point of gap 4 - it is declared in the header rather
than hidden. The file's totals still disagree with the phone's (26 v 27 on U,
22 v 21 on L), so D-RS-d and D-RS-h2 keep the disagreement they measure, and
all fifteen cells are still green. The header's absolute claim is rewritten so
it is true of the file as committed, including the reviewer's lower-severity
point about the dates, which are kept as shape and now said to be kept.

### The notes

- **N1 `patchV32`.** FIXED in the spec header and in `legacy-fixture.cjs`:
  `targets` is written only inside `if (adj)`, so it is an OPTIONAL member of a
  migrated state. Read at `src/app.jsx:10745-10763` and confirmed.
- **N2 P-LABEL is unreachable, and option A removes the last content guard.**
  FIXED: 2.1 says it in the reviewer's own terms, and 6.2 (5) is the risk line
  he asked for, placed before the PM's questions.
- **N3 a relayed bundle takes whatever phone's label.** FIXED: 6.2 (6), with
  the cell placed in lane C's corpus rather than invented here.
- **N4 `normaliseName`'s character class.** FIXED: the class is Unicode
  (`\p{L}\p{N}`), stated in full with the NFKD and combining-mark steps, and a
  name that normalises to empty refuses `exercise_n`. Cell (f) gains both the
  empty-name refusal and the non-Latin control.
- **N5 the label write in a strict-mode module.** FIXED as a cell: (n5) asserts
  the write and the append directly on `view.state` and requires the build to
  measure whether `candidateState()` is frozen before writing the line.
- **N6 the engine is safe, and no cell said so.** FIXED: cell (n6), plus the
  paragraph in 2.5 saying out loud that `exActive` ignores the retirement DATE -
  which is what makes the document-side membership rule necessary as well as
  correct.
- **N7 the sample-numbers sentence clears.** FIXED: 2.8 and cell (n7).
- **N8 the cell count.** FIXED: fifteen cells, eleven invert, four stay, in a
  table in 3.3; (j) matches it.
- **N9 P-LABEL fires late.** FIXED: the test moves above the per-lift loop in
  2.3.
- **N10 what could not be verified.** Unchanged and still true of this
  revision: the owner's file is never opened, PM QUESTION 1's v1/v2 measurement
  is the build's to make before it changes `today-bindings.mjs`, and whether
  `prep.candidateState()` is frozen is now cell (n5) rather than an assumption.
