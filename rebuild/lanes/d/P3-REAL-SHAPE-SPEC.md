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
`patchV32` (`:10746`) writes onto every MIGRATED state, and the owner's file is
a migrated state. Nothing else was needed: the real `prepare.cjs` +
`engine/migrate.cjs` accepted the state and the port sealed it first time.

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
  exactly as it is, as the page's last guard.

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
 function programme(source,ops,{today,documentSets=null}){
   const setups=Object.values(ops).filter(o=>o.payload?.profile===Setup.PROFILE);
   if(setups.length!==1)fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'setup_document'});const op=setups[0];
   if(op.schema_version!==2||!Setup.validate(op,id=>ops[id]))fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'setup_document'});
   const scratch=createCleanInitState({setup:op.payload.setup});
   if(documentSets)for(const ex of scratch.exercises)documentSets.set(ex.id,ex.sets);
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
+  /* P-LABEL. The file's name, when it has one, must be his. */
+  if(Object.hasOwn(source,'athlete_label')&&source.athlete_label!==op.payload.setup.athlete_label)
+    fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'athlete_label'});
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

`normaliseName(n)` is one exported helper: lower case, Unicode NFKD, every run
of non-alphanumeric characters collapsed to a single space, trimmed. It is
stated once and imported by the three readers, so they cannot disagree.
`correspondence(fileLifts, documentLifts)` returns, for each DOCUMENT lift id,
either the one file lift id whose normalised name equals its own, or `null`
where zero or several match.

### 2.4 The label, and the returned basis

```diff
   const documentSets=new Map();
   try{programmeBasis=programme(state,ops,{today:currentDay(),documentSets});}
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
```

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
2. **KEPT UNDER ITS OWN LIFT, ZERO OR SEVERAL MATCHES.** The setup lift is
   appended to the admitted state's `exercises` as an INACTIVE lift, carrying
   the document's `id`, `n`, `mg`, `day`, `sets`, `hi`, `inc`, `steps`, `w:null`
   and a retirement dated the import day (`state.retirements[id]=today`, the old
   app's own tombstone member, `src/app.jsx:551`). His recorded entries stay
   under it and are visible in his history. Nothing is dropped and nothing is
   silently merged into a lift he did not train.
3. **THE PROVENANCE RULE, RESTATED FOR BOTH CASES.**
   - `capture_producer`: unchanged.
   - `capture_lift`: reads the state AFTER re-attachment, and after the retired
     setup lifts have been appended. It therefore refuses only when a slot names
     a lift that is in neither list, which is a corrupt capture.
   - `capture_sets`: UNCHANGED, still against `documentSets` - the programme
     that PRODUCED the capture (P3-PORT-FIX-2, DECISIONS:509 Q1). Re-keying does
     not change the count, so the check is read under the setup id, before the
     re-key, and its refusal still names the setup lift.
   - `capture_membership`: compared over the RE-KEYED ids. The expected pool is
     the engine's own `sessionMembership` on the admitted state for the original
     Start day, PLUS any retired setup lift that the capture itself names and
     whose document day is that day's kind. ORDER is compared only when the two
     programmes list the same lifts; where adoption changed the pool, the SET is
     compared and the order is not, because the file's order is not the order
     the card was built in and an order comparison there would refuse a workout
     he really did. This is the one place the spec relaxes a proof, and it
     relaxes it exactly as far as adoption made it unanswerable. **PM QUESTION
     3** in section 6 puts the alternative.

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
     const expected=Runtime.createEngineRuntime({clock:originalClock}).sessionMembership(state,originalDay);
-    if(!expected||!['U','L'].includes(expected.day)||encode([...counts.keys()])!==encode([...expected.exercise_ids]))
-      fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'capture_membership'});
+    const keyed=[...counts.keys()].map(id=>attach(id)??id);
+    const same=encode([...keyed].sort())===encode([...expected.exercise_ids].sort());
+    const ordered=encode(keyed)===encode([...expected.exercise_ids]);
+    if(!expected||!['U','L'].includes(expected.day)||!same||
+       (keyed.every((id,i)=>id===[...counts.keys()][i])&&!ordered))
+      fail('LOCAL_SOURCE_PROGRAMME_UNRESOLVED',{field:'capture_membership'});
```

The retired setup lifts are appended where the label is written, in `replay()`,
after `programme()` has returned, so `state` is the file's plus exactly the
lifts his own recorded history still needs.

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
+       lift by NORMALISED NAME, which is the same correspondence admission
+       recorded in the programme digest. A row that matches nothing is a lift the
+       import RETIRED, and admission kept that lift in the basis as an inactive
+       one, so it is still found; a row that matches several is a document this
+       companion cannot edit safely and refuses. */
+    const matched = firstRun ? base.exercises[i] : matchByName(base.exercises, row);
+    const e = matched;
+    if (baseIds.has(row.id) || !e) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
+    baseIds.add(row.id);
```

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
D-RS-d: the card's total for the U day is the file's 25 and not the phone's 27.
The setup document supplies nothing. A lift the import retired (2.5 case 2) is
NOT on the card - it is inactive - but its history is his and is kept.

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
- CHANGED by the build: the twelve cells above INVERT. Each one's name says what
  it measures today; the build rewrites the name and the assertion together, the
  way P3-PORT-FIX-2 inverted D-PF-f1.
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
`exercise_id`; a lift with no readable name refuses `exercise_n`; a `sets: 0`
still refuses `sets` with its lift id. Every one retracts and writes nothing.

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
first and must fail with the code and field section 1 records. The twelve cells
in this branch ARE that red-first run, recorded green as measurements; the build
inverts them one at a time and the report states, per cell, which S7 line made
it red.

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
4. **`capture_membership` relaxed to a set comparison** where adoption changed
   the pool (2.5). This is the one proof this spec weakens. **PM QUESTION 3**:
   accept it, or keep the exact order comparison and accept that a phone which
   recorded a workout before importing a file that lists its lifts in a
   different order refuses. My recommendation is to accept the relaxation: the
   order that mattered is the order the card was built in, and that order is
   recorded in the capture itself, which is still compared slot for slot.
5. **Three readers of one rule.** `normaliseName` in one module, imported. If
   the build restates it anywhere, the bug is guaranteed and will be silent.

### 6.3 The three questions for the PM

1. Switch the page's capture producer to `CONFIGURATION_PROFILE` so a `BW` or
   `hold` lift prescribes (recommended, subject to the measurement in 6.2 (1))?
   Without it the owner's LOWER day has no card the morning after a successful
   import.
2. If his file carries more than one split period with different weeks, which
   week governs? Recommendation: the period in force TODAY is what P-A proves
   against, and the earlier periods are retained unexamined as his own history.
   That is a one-line change to P-A and it should be ruled now rather than after
   the next refusal.
3. `capture_membership`: set comparison where adoption changed the pool, or
   exact order always?

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
| the S8 package, the ruled-substitution entries, preflight | 0.5 |
| **total** | **6.5** |

Plus the review round. The two largest items are the capture block and the
corpus re-point, and both are large for the same reason: they are where the
phone's own history meets the file's, which is the one place option A cannot be
"the file wins" and has to be "and nothing of his is lost".
