'use strict';
// Dated programme projection only. The caller authenticates the generation;
// this layer proves structural correspondence and refuses unqualified history.
const { encode: canonical } = require('../../client/canonical.cjs');
const C = require('./plan-edit-commands.cjs');
const own = (o, k) => Object.hasOwn(o, k);
const fail = (code = 'PLAN_EDIT_HISTORY_UNPROVEN') => C.fail(code);
const equal = (a, b) => canonical(a) === canonical(b);
const clone = v => C.plain(v);
function freeze(v) { if (v && typeof v === 'object') { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
const put = (o, k, value) => Object.defineProperty(o, k, { value, enumerable: true, configurable: true, writable: true });
const documentRow = e => Object.fromEntries(C.EXERCISE.map(k => [k, e[k]]));
/* Every collection rebuild/m3/w6/local/local-client.mjs COLLECTIONS seals, plus
   `derived`, which rebuild/m3/w6/local/source-admission.mjs adds when an import
   is admitted (its own COLLECTIONS set is this list). Anything else in a
   generation is an effect this companion cannot map, so it refuses rather than
   project a plan over a store shape nobody has admitted. planEditCollections
   below is a trip-wire: the lane's cells recompute it from that module. */
const COLLECTIONS = ['ops','outbox','dispositions','rejected','receipts','planTxns','plan',
  'planTransactions','planHistory','suspensions','issuances','sessionStarts','sessionResolutions',
  'drafts','sync','meta','derived'];
/* THE LOCAL-SOURCE ROW, narrowed by P3-PORT-FIX to exactly what admission now
   proves (source-admission.mjs programme(), P3-PORT-FIX-SPEC 1.6). It is
   narrowed IN PLACE rather than kept beside a new name, because a constant whose
   only remaining reader is the assertion about it is a trip-wire pointing at
   nothing (spec review R2, BINDING CORRECTION B-1). The lane's cell
   lanes/d/plan-edit/model.test.cjs recomputes this list against that rule.
   BEFORE P3-PORT-FIX: ['id','day','mg','sets','hi','inc','steps']. */
/* P3-REAL-SHAPE (DECISIONS:520 option A, accepted :521). `id` GOES. The document
   row and the basis lift no longer share an id: the basis is the FILE's, whose
   ids are the old app's short handles, and the document is the phone's, whose
   ids slugOf minted.
   BEFORE P3-REAL-SHAPE: ['id','day','mg'].
   AND THEN `day` AND `mg` GO TOO (review R1 BLOCKING 2). Admission DELETED the
   per-lift comparison in the same ticket and this predicate did not follow, so a
   file that put a corresponded lift on the other day was ADMITTED, ADOPTED and
   painted on the Train screen, and Edit My Week then refused
   PLAN_EDIT_ORIGIN_UNPROVEN for good - the failure MOVED rather than removed,
   which is the one property this ticket had to protect. The narrowing is
   FORCED by the sentence eight lines above, not chosen: this predicate is
   derived from source-admission.mjs programme() and follows it down. Under
   option A the FILE's day and the FILE's muscle group are the athlete's, they
   are what the engine reads and what the card paints, and the document row's
   copy is never shown: `apply()` below edits the BASIS lift, found by
   `edit.exercise_id` in the basis state. Refusing the whole editor over a
   member the screen does not show and admission does not prove would be a rule
   the athlete cannot answer.
   WHAT REMAINS PROVED is the BINDING and not the content: every document row
   must reach exactly one basis lift, no two rows may reach the same one, and
   that lift must carry a usable name. `day` and `mg` are still proved about the
   FILE ITSELF at admission (source-admission.mjs, fields `day` and `mg`), so
   neither is unbounded - it is simply not compared across two id spaces any
   more. Cells: lanes/d/p3-real-shape/r1-fixes.test.mjs D-RS-R1-b2a/b2b (both
   directions admit AND open) and b2c (the binding still refuses).
   THE CONSTANT STAYS AND STAYS READ, empty, because it is the ONE mechanism
   tying this predicate to admission's proved set: PE16 in
   lanes/d/plan-edit/model.test.cjs recomputes it against that rule, and if
   admission ever proves a per-lift member again this comparison comes alive
   with no other edit. */
const P2_ROW = [];
/* THE SAME `normaliseName` ADMISSION USES, imported from the one place that
   states it (P3-REAL-SHAPE 2.3/2.6). It must not be restated here: a second
   spelling of the rule is a second rule, and the bug would be silent. */
const { matchByName } = require('./lift-correspondence.cjs');
/* THE PERIOD SHAPE the local-source branch accepts, which is admission's own
   P-A plus B-C: a non-empty array of periods, each closed over {from, map}, each
   map deep-equal to the document's one week. `from` is NOT compared: it is the
   file's own history of when its week changed, retained exactly as admission
   retains it. The "not after today" bound admission applies is NOT re-evaluated
   here, because admission already applied it at admission time and a committed
   import must not start refusing the athlete's editor because a clock moved. */
/* P3-REAL-SHAPE (spec 2.6, and PM QUESTION 2 at DECISIONS:521). TWO CHANGES.
   `why` is accepted, for the same reason `from` is not compared: it is the
   file's own history of its own week, not a claim this screen adjudicates.
   And the map comparison follows admission's own Q2 rule - the period IN FORCE
   is what P-A proved, and the earlier periods are retained unexamined - which
   this screen states as "at least one period's map is the document's week",
   because it has no clock and must not re-evaluate one. It is exactly as strong
   as admission and no stronger: a basis admission accepted cannot be refused
   here, which is the failure this ticket exists to remove rather than move. */
const splitShapeOk = (periods, documentSplit) => Array.isArray(periods) && periods.length > 0 &&
  periods.every(p => p && typeof p === 'object' && !Array.isArray(p) &&
    Object.keys(p).every(k => k === 'from' || k === 'map' || k === 'why') &&
    (!own(p,'why') || typeof p.why === 'string') &&
    own(p,'from') && own(p,'map')) &&
  periods.some(p => equal(p.map, documentSplit.map));
/* Does this generation carry a source import AT ALL - admitted or not? The four
   places source-admission.mjs / import-bundle.mjs leave one: the import entry
   list, the selection record, the commit marker and the derived replay. Presence
   alone decides WHICH basis a caller must have adopted; local-source-basis.mjs
   decides whether that import is ADMITTED. Kept here so the host and the
   projector cannot disagree about what counts as an import. */
function importPresentIn(generation) {
  const metadata = generation?.metadata || {}, collections = generation?.collections || {};
  return (Array.isArray(metadata.imports) && metadata.imports.length > 0) ||
    !!metadata.localSources || !!metadata.localSourceApplication ||
    !!(collections.derived && collections.derived.localSource);
}
/* S17 (PM ruling): HAS A WORKOUT OF `date` STARTED on this record (before device_seq `before`, when given)? A
   session-start operation of that local date, whatever became of it after (logged, closed, edited or abandoned):
   a workout that began keeps the basis it began on. The one reader the saving host and the projector share, so
   they cannot disagree about what counts as a begun day. */
function startedOn(ops, date, before = Infinity) {
  return (Array.isArray(ops) ? ops : Object.values(ops || {})).some(o => o && o.class === 'session' &&
    o.kind === 'session-start' && o.effective && o.effective.local_date === date &&
    Number.isSafeInteger(o.device_seq) && o.device_seq < before);
}
function createPlanEditProjector({ basisState, setupOperation, validateTags, projectNewExerciseTags,
  hashBasis, admittedBasisOf, basisSource = 'first-run' } = {}) {
  if (typeof hashBasis !== 'function') fail('PLAN_EDIT_BASIS_HASH_UNAVAILABLE');
  const hash = value => {
    const digest = hashBasis(canonical(value));
    if (typeof digest !== 'string' || !/^[a-f0-9]{64}$/.test(digest)) fail('PLAN_EDIT_BASIS_HASH_INVALID');
    return 'earned/plan-edit-basis/v1:' + digest;
  };
  const base = clone(basisState), origin = clone(setupOperation), commands = C.createPlanEditCommands({ validateTags });
  if (!base || !Array.isArray(base.exercises) || !origin || origin.kind !== 'fact' || origin.class !== 'event' ||
      origin.payload?.profile !== 'earned/first-run-setup/v1' || !origin.payload.setup ||
      !/^[a-f0-9]{64}$/.test(origin.canonical_content_commitment)) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
  C.text(origin.op_id); C.text(origin.athlete_id); C.text(origin.device_id); C.dateOf(origin.effective?.local_date);
  const setup = origin.payload.setup;
  C.exact(setup, ['athlete_label','split','exercises','priority_muscles']);
  /* WHICH BRANCH the split and priority comparisons below are on. Read here only
     to CHOOSE the comparison; the DECLARATION is validated at its own line
     further down, and an unknown value still refuses there, exactly as it did
     before P3-PORT-FIX: an unknown basisSource takes the strict first-run
     comparison here, which is the comparison it took before this line existed. */
  const localSource = basisSource === 'local-source';
  /* P3-REAL-SHAPE (spec 2.6). THE COUNT IS A FIRST-RUN PROOF ONLY. On the
     local-source branch the file may list more lifts than the document, fewer,
     or a different set - and admission appends every unmatched document lift to
     the basis as a retired one, so the basis is routinely LONGER than the
     document by construction. The label comparison on the next line is
     UNCHANGED and is still the guard it always was. */
  if (!Array.isArray(setup.exercises) || !setup.exercises.length ||
      (!localSource && setup.exercises.length !== base.exercises.length) ||
      base.athlete_label !== setup.athlete_label ||
      (localSource ? !splitShapeOk(base.split, setup.split) : !equal(base.split, [setup.split])) ||
      /* PRIORITY MUSCLES are RETAINED from the file on an admitted import
         (P3-PORT-FIX-SPEC 1.4): the file's value is what admission admits and
         what the athlete trains on, and proving it here would refuse the Edit My
         Week screen on a bundle just accepted. The FIRST-RUN branch is unchanged. */
      (!localSource && !equal(base.priority_muscles || [], setup.priority_muscles))) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
  /* WHICH BASIS THIS IS, and what proves it corresponds to this installation's
     own first run. today-app.cjs adoptAthleteState (P0-B) adopts ONE of two
     states and the companion edits whichever one it was handed:

     FIRST-RUN. setup.athleteState() -> createCleanInitState({setup}) over the
     stored setup document. Correspondence is exact on all eight plan members
     plus the F2 tag marker, with no rename and no retirement: a clean-init
     state that has moved is not a clean-init state.

     LOCAL-SOURCE (P2). local-source-basis.mjs admittedLocalSourceState -> the
     admitted import's own replayed state. Its correspondence predicate is not
     ours to invent: source-admission.mjs `programme()` is what admission itself
     proved. RESTATED BY P3-PORT-FIX, because that rule narrowed and this
     predicate moves WITH it, by the sentence above (P3-PORT-FIX-SPEC 1.6): the
     proof is now the SHAPE of the programme and nothing else, over every split
     period map, the lift ids, and each lift day and mg, MATCHED BY ID. Set
     counts, rep targets, increments, ladders, the tag snapshot and priority
     muscles are RETAINED from the file, never proved, because the first-run flow
     cannot state them per lift (setup-model.mjs:622-623,:633) and a rule the
     athlete cannot answer is not a rule. Still NOT over `n` as a value (the
     athlete's own name for the lift travels with his import, and only its shape
     is checked) and not over history. Renames and retirements the import
     replayed are his facts, so they are carried, not refused.

     `basisSource` DECLARES which one was handed over and is validated exactly
     here, at construction, before any projection exists. It cannot be a lie:
     inspect() reads the generation and refuses a declaration that generation
     does not carry, so a clean-init shape can never stand in for an unadmitted
     import and an import can never be adopted without its admission marker
     being in the same generation the operations are replayed from. */
  if (basisSource !== 'first-run' && basisSource !== 'local-source') fail('PLAN_EDIT_BASIS_SOURCE_UNKNOWN');
  const firstRun = basisSource === 'first-run';
  const baseIds = new Set();
  /* ONE ROW, ONE BASIS LIFT (P3-REAL-SHAPE, review R1 B3). `baseIds` reads as
     the duplicate guard and WAS one only because the row's id and the basis
     lift's id were the same id; document ids are unique by construction
     (`slugOf` disambiguates with a numeric suffix), so on the local-source
     branch it can never fire and it is the BASIS side that has to be guarded.
     Two rows that reach the same basis lift - by id, by name, or one of each -
     are a document this companion cannot edit safely, and it refuses. */
  const boundBasis = new Set();
  let rowsOk = true, tagsOk = true;
  const byId = new Map(base.exercises.map(e => [e && e.id, e]));
  if (byId.size !== base.exercises.length) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
  for (let i = 0; i < setup.exercises.length; i++) {
    const row = C.exerciseOf(setup.exercises[i]);
    /* LOCAL-SOURCE (P3-REAL-SHAPE 2.6). The document row is matched to the basis
       lift BY ITS OWN ID FIRST and then by NORMALISED NAME, which is the same
       correspondence admission recorded in the programme digest. The id branch
       is what finds a lift the import RETIRED: admission appended it to the
       basis under the DOCUMENT's own id (spec 2.4), so every row is found
       either way. The ORDER is load-bearing: a retired document lift shares its
       NAME with the file lifts that made it ambiguous, so `matchByName` returns
       nothing for it and only its own id finds it. A row that matches neither,
       or one whose basis lift a previous row already bound, is a document this
       companion cannot edit safely and refuses.
       THE FIRST-RUN BRANCH IS UNTOUCHED, including its `byId.get(row.id)`
       requirement (review R1 B4): only the local-source branch stops using the
       id lookup as its binding. */
    const e = firstRun ? base.exercises[i] : (byId.get(row.id) || matchByName(base.exercises, row));
    if (baseIds.has(row.id) || !e) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
    if (firstRun ? !byId.get(row.id) : boundBasis.has(e.id)) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
    baseIds.add(row.id); boundBasis.add(e.id);
    if (firstRun) {
      if (!equal(documentRow(e), row) || e.renames?.length || (base.retirements || {})[row.id]) rowsOk = false;
    } else if (P2_ROW.some(k => !equal(e[k], row[k]))
        || typeof e.n !== 'string' || !e.n.trim()) rowsOk = false;
    if (origin.payload.tags !== undefined) {
      const tags = origin.payload.tags[row.id]; C.tagsOf(row, tags, validateTags);
      /* LOCAL-SOURCE: the tag snapshot is RETAINED from the file and no longer
         compared (P3-PORT-FIX-SPEC 1.4, 1.6). C.tagsOf on the line above STAYS:
         it validates the DOCUMENT's own tag shape and reads nothing from the
         basis, and so does the key-set check below. */
      if (!firstRun) { /* retained, not proved */ }
      else if (own(e, 'head') || own(e, 'secondary') || own(e, 'volumeTags')) {
        if (!equal({ head: e.head ?? null, secondary: e.secondary }, tags) ||
            e.volumeTags?.profile !== 'earned/setup-volume-tags/v1' || e.volumeTags.op_id !== origin.op_id ||
            e.volumeTags.date !== origin.effective.local_date) tagsOk = false;
      } else tagsOk = false;
    } else if (own(e, 'volumeTags')) tagsOk = false;
  }
  if (!rowsOk) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
  if (!tagsOk) fail('PLAN_EDIT_TAG_BASIS_UNPROVEN');
  if (origin.payload.tags !== undefined && (Object.keys(origin.payload.tags).length !== baseIds.size ||
      Object.keys(origin.payload.tags).some(id => !baseIds.has(id)))) fail('PLAN_EDIT_TAG_BASIS_UNPROVEN');
  const coreOrigin = { op_id: origin.op_id, commitment: origin.canonical_content_commitment, setup: origin.payload,
    athlete_id: origin.athlete_id, device_id: origin.device_id };
  function inspect(raw) {
    const generation = clone(raw), collections = generation?.collections;
    if (!collections || typeof collections !== 'object' || Array.isArray(collections)) fail();
    if (Object.keys(collections).some(k => !COLLECTIONS.includes(k)) ||
        (collections.sync?.frontier?.W ?? 0) !== 0 ||
        collections.sync?.snapshot?.recoveryPlan || Object.keys(collections.sync?.snapshot?.plan || {}).length) fail('PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE');
    /* THE ADOPTED BASIS, decided by this generation and not by the caller.
       `admittedBasisOf` is local-source-basis.mjs admittedLocalSourceBasis, the
       SAME join Today adopts through, injected because it is ESM and this layer
       is not. An import that is present but not admitted - still to be rebased,
       still pending, carrying an unresolved issue, or belonging to another
       installation or label - is a context this companion cannot edit, and it
       never substitutes a clean-init state for it. */
    if (importPresentIn(generation) !== !firstRun) fail('PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE');
    if (!firstRun) {
      const adopted = typeof admittedBasisOf === 'function' ? admittedBasisOf(generation) : null;
      if (!adopted) fail('PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE');
      // The state handed to this projector IS the admitted one, byte for byte.
      if (!equal(adopted, base)) fail('PLAN_EDIT_IMPORTED_BASIS_MISMATCH');
    }
    if (Object.keys(collections.plan || {}).length || Object.keys(collections.planTransactions || {}).length)
      fail('PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT');
    const ops = collections.ops || {}, rejected = collections.rejected ?? {};
    if (!rejected || typeof rejected !== 'object' || Array.isArray(rejected)) fail('PLAN_EDIT_REJECTION_UNPROVEN');
    /* WHOSE REJECTION IS THIS COMPANION'S BUSINESS: a PLAN operation's, and only
       that. This generation's own setup descriptor, a plan-mutation, or a
       tombstone over one. A rejected food entry or weigh-in belongs to the
       machinery that owns it and says nothing about the plan, so refusing the
       whole plan read over it would be fail-closed reaching past its own
       subject, and once this installation syncs it would dark-screen Edit my
       week over somebody else's record. An op this generation does not carry
       cannot be SHOWN to be unrelated, and neither can a tombstone cycle, so
       both count as plan-class and still refuse.
       A plan-class rejection then REFUSES, and is never acted on: this
       companion admits only the local installation context, its existing host
       refuses inbound authority dispositions and ciphertext cannot supply one,
       so a record here is an index entry and never proof, WHATEVER shape it
       has. The records are kept intact; nothing excludes an operation. Because
       no plan rejection can be admitted, this companion has no `rejected`
       status to project: the branches that would have carried one are retired
       rather than left behind as unreachable code with an opinion. */
    const planClass = id => { const seen = new Set();
      for (let op = ops[id]; ; op = ops[op.target_op_id]) {
        if (!op || seen.has(op.op_id) || op.op_id === origin.op_id || op.kind === 'plan-mutation') return true;
        if (op.kind !== 'tombstone') return false;
        seen.add(op.op_id);
      } };
    if (Object.keys(rejected).some(planClass)) fail('PLAN_EDIT_REJECTION_UNPROVEN');
    if (!equal(ops[origin.op_id], origin)) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
    const rows = Object.entries(ops).map(([id, op]) => {
      if (!op || op.op_id !== id || op.athlete_id !== origin.athlete_id || op.device_id !== origin.device_id ||
          !Number.isSafeInteger(op.device_seq) || op.device_seq < 1 || !Array.isArray(op.causal_parents) ||
          new Set(op.causal_parents).size !== op.causal_parents.length || !/^[a-f0-9]{64}$/.test(op.canonical_content_commitment)) fail();
      return op;
    }).sort((a, b) => a.device_seq - b.device_seq);
    if (new Set(rows.map(op => op.device_seq)).size !== rows.length) fail();
    for (const op of rows) {
      for (const id of op.causal_parents) if (!ops[id] || ops[id].device_seq >= op.device_seq) fail();
      if (op.device_predecessor_op_id !== null && (!ops[op.device_predecessor_op_id] || ops[op.device_predecessor_op_id].device_seq >= op.device_seq)) fail();
    }
    if (rows.filter(op => op.payload?.profile === origin.payload.profile).length !== 1) fail('PLAN_EDIT_ORIGIN_UNPROVEN');
    const edits = rows.filter(op => op.kind === 'plan-mutation');
    if (edits.some(op => op.conflict_domain_id !== 'training')) fail('PLAN_EDIT_UNSUPPORTED_PLAN_CONTEXT');
    for (const op of edits) if (!commands.validate(op, id => ops[id])) fail();
    const relevant = new Set([origin.op_id, ...edits.map(op => op.op_id)]);
    const tombstones = rows.filter(op => op.kind === 'tombstone' && relevant.has(op.target_op_id));
    for (const op of tombstones) {
      if (op.target_op_id === origin.op_id || !op.causal_parents.includes(op.target_op_id) ||
          op.device_seq <= ops[op.target_op_id].device_seq ||
          rows.some(o => o.kind === 'tombstone' && o.target_op_id === op.op_id)) fail('PLAN_EDIT_TOMBSTONE_UNPROVEN');
    }
    const dead = new Set(tombstones.map(op => op.target_op_id));
    /* S15 F10, PM ruling option B (the F4 precedent): AN IMPORT REPLACES THE ROUTINE. A routine change saved
       before the import is kept on record and no longer applied; a change saved after it applies as normal.
       WHICH changes the import superseded is not decided here: it is admission's own verdict, the F10 rows of
       the admitted view (source-admission.mjs replay()), read off the SAME generation whose admission marker
       admittedBasisOf proved above. A row that names anything but a routine change on this record refuses. */
    const superseded = new Set();
    if (!firstRun) {
      const families = collections.derived?.localSource?.view?.families;
      for (const row of Array.isArray(families) ? families : []) {
        if (!row || row.family !== 'F10') continue;
        if (row.state !== 'superseded' || !edits.some(op => op.op_id === row.op_id) || superseded.has(row.op_id))
          fail('PLAN_EDIT_IMPORTED_CONTEXT_UNAVAILABLE');
        superseded.add(row.op_id);
      }
    }
    const statuses = new Map(edits.map(op => [op.op_id,
      dead.has(op.op_id) ? 'tombstoned' : superseded.has(op.op_id) ? 'superseded' : 'active']));
    const intents = new Set(), added = new Set(baseIds), starts = new Map();
    for (const op of edits) {
      const value = op.members[0].value;
      if (intents.has(value.intent_id)) fail('PLAN_EDIT_DUPLICATE_INTENT'); intents.add(value.intent_id);
      if (value.edit.exercise) { if (added.has(value.edit.exercise.id)) fail('PLAN_EDIT_ID_REUSED'); added.add(value.edit.exercise.id); }
      if (statuses.get(op.op_id) === 'active' && op.causal_parents.some(id => statuses.has(id) && statuses.get(id) !== 'active')) fail('PLAN_EDIT_BASIS_INVALIDATED');
      /* S17 (PM ruling on Fable l1 D1): A SAME-DAY CHANGE NEVER REACHES A WORKOUT ALREADY BEGUN THAT DAY. A change dated
         for its own authored day applies from that day only when no workout of that day had started before it was
         recorded: no session-start of that date earlier on this device's record, and no session of that date in the
         basis's own history. The saving host refuses such a save; on EVERY replay a record that has one anyway is
         DEFERRED, deterministically, to the next local date - exactly as a next-day change would apply - so the begun
         day keeps its basis, the read never refuses, the change is never dropped and nothing new is recorded. */
      const recorded = value.starts_on;
      starts.set(op.op_id, recorded === op.effective.local_date && (startedOn(rows, recorded, op.device_seq) ||
        Object.hasOwn(base.sessionLog || {}, recorded)) ? C.nextLocalDate(recorded) : recorded);
    }
    const basisAt = before => hash({ origin: coreOrigin,
      edits: edits.filter(op => op.device_seq < before).map(op => ({ op_id: op.op_id, commitment: op.canonical_content_commitment,
        status: statuses.get(op.op_id) })),
      tombstones: tombstones.filter(op => op.device_seq < before).map(op => ({ op_id: op.op_id, commitment: op.canonical_content_commitment, target: op.target_op_id })) });
    const active = edits.filter(op => statuses.get(op.op_id) === 'active');
    for (let i = 0; i < active.length; i++) {
      const op = active[i], parents = [origin.op_id, ...active.slice(0, i).map(o => o.op_id)];
      if (!equal([...op.causal_parents].sort(), [...parents].sort()) || op.seen_plan_basis !== basisAt(op.device_seq)) fail('PLAN_EDIT_BASIS_INVALIDATED');
      // Judged on the date each change applies from (S17: a deferred same-day change applies from the next date).
      if (i && starts.get(active[i - 1].op_id) > starts.get(op.op_id)) fail('PLAN_EDIT_DATE_ORDER_UNPROVEN');
    }
    return { generation, edits, active, statuses, starts, basis: basisAt(Infinity), parents: [origin.op_id, ...active.map(op => op.op_id)], added };
  }
  function orderOf(state) {
    const order = state.exOrder || (state.exOrder = {});
    for (const e of state.exercises) if (!own(order, e.day)) put(order, e.day, []);
    return order;
  }
  function apply(state, edit, starts_on, op) {
    const target = edit.exercise_id === undefined ? null : state.exercises.find(e => e.id === edit.exercise_id);
    if (edit.exercise_id !== undefined && (!target || (state.retirements || {})[target.id])) fail('PLAN_EDIT_TARGET_UNAVAILABLE');
    const order = orderOf(state), oldDay = target?.day;
    const covered = day => {
      let split = null; for (const row of state.split || []) if (row.from <= starts_on) split = row;
      const family = day === 'U' || day === 'L', days = Object.values(split?.map || {});
      if (!split || !family || !(days.includes(day) || days.includes('F'))) fail('PLAN_EDIT_DAY_UNCOVERED');
    };
    /* S15 R2 (PM ruling 2). A workout kind that has a day in the week in force on
       starts_on keeps at least one lift in the week. Checked after an edit, only
       for the kinds that edit touched, so a basis that already broke it never
       blocks an unrelated change. */
    const staffed = kind => {
      let split = null; for (const row of state.split || []) if (row && row.from <= starts_on) split = row;
      if ((kind !== 'U' && kind !== 'L') || !Object.values(split?.map || {}).includes(kind)) return;
      const retired = state.retirements || {};
      if (!state.exercises.some(e => e.day === kind && !retired[e.id])) fail('PLAN_EDIT_WORKOUT_EMPTY');
    };
    if (edit.kind === 'update') {
      if (Object.entries(edit.changes).every(([k, value]) => equal(target[k], value))) fail('PLAN_EDIT_NO_CHANGE');
      if (own(edit.changes, 'day')) covered(edit.changes.day);
      if (own(edit.changes, 'n') && target.n !== edit.changes.n) {
        (target.renames || (target.renames = [])).push({ from: starts_on, prevN: target.n });
      }
      for (const [k, value] of Object.entries(edit.changes)) put(target, k, clone(value));
      if (target.day !== oldDay) {
        put(order, oldDay, (order[oldDay] || []).filter(id => id !== target.id));
        if (!own(order, target.day)) put(order, target.day, []); order[target.day].push(target.id);
      }
    } else if (edit.kind === 'remove') {
      const remaining = state.exercises.filter(e => e.id !== target.id && !(state.retirements || {})[e.id]);
      if (!remaining.length) fail('PLAN_EDIT_WEEK_EMPTY');
      const retirements = state.retirements || (state.retirements = {}); put(retirements, target.id, op?.op_id || 'preview');
      put(order, oldDay, (order[oldDay] || []).filter(id => id !== target.id));
    } else if (edit.kind === 'reorder') {
      /* S15. The new order must name exactly this workout's lifts that are still
         in the week. The comparison is the order the engine serves today
         (rebuild/engine/today.cjs _sessionPool: exOrder index, unknown last,
         stable), so an order that changes nothing refuses rather than writes. */
      const retired = state.retirements || {};
      const pool = state.exercises.filter(e => e.day === edit.day && !retired[e.id]);
      const ids = new Set(pool.map(e => e.id));
      if (edit.order.length !== ids.size || edit.order.some(id => !ids.has(id))) fail('PLAN_EDIT_ORDER_MISMATCH');
      const current = order[edit.day] || [];
      const rank = id => { const i = current.indexOf(id); return i === -1 ? 99 : i; };
      const served = pool.slice().sort((a, b) => rank(a.id) - rank(b.id)).map(e => e.id);
      if (equal(served, edit.order)) fail('PLAN_EDIT_NO_CHANGE');
      put(order, edit.day, edit.order.slice());
    } else if (edit.kind === 'split') {
      /* S15. A new dated period from starts_on; every earlier period is kept as
         it is, so days before the change still read the week they had. Two
         saves for the same start date leave one period, the later map. */
      const split = Array.isArray(state.split) ? state.split : (state.split = []);
      let inForce = null; for (const row of split) if (row && row.from <= starts_on) inForce = row;
      const served = inForce && inForce.map && Object.fromEntries(C.WEEKDAYS.map(k =>
        [k, inForce.map[k] === 'U' || inForce.map[k] === 'L' ? inForce.map[k] : 'REST']));
      if (served && equal(served, edit.map)) fail('PLAN_EDIT_NO_CHANGE');
      const kinds = Object.values(edit.map), retired = state.retirements || {};
      if (state.exercises.some(e => !retired[e.id] && !kinds.includes(e.day))) fail('PLAN_EDIT_DAY_UNCOVERED');
      const last = split[split.length - 1];
      if (last && last.from === starts_on) put(last, 'map', clone(edit.map));
      else split.push({ from: starts_on, map: clone(edit.map) });
    } else {
      const row = clone(edit.exercise); covered(row.day);
      if (state.exercises.some(e => e.id === row.id)) fail('PLAN_EDIT_ID_REUSED');
      let next = { ...row, w: null, forks: [] };
      if (op) {
        if (typeof projectNewExerciseTags !== 'function') fail('PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE');
        next = clone(projectNewExerciseTags(clone(row), clone(edit.tags), { op_id: op.op_id, date: starts_on }));
        const allowed = [...C.EXERCISE, 'w','forks','head','secondary','volumeTags']; C.exact(next, allowed);
        if (!equal(documentRow(next), row) || next.w !== null || !equal(next.forks, []) ||
            !equal({ head: next.head, secondary: next.secondary }, edit.tags) ||
            next.volumeTags?.profile !== 'earned/setup-volume-tags/v1' || next.volumeTags.op_id !== op.op_id ||
            next.volumeTags.date !== starts_on) fail('PLAN_EDIT_NEW_TAG_PROJECTION_INVALID');
        C.exact(next.volumeTags, ['profile','op_id','date','regionsByMuscle']);
      } else { next.head = edit.tags.head; next.secondary = clone(edit.tags.secondary); }
      state.exercises.push(next);
      if (!own(order, row.day)) put(order, row.day, []);
      if (target) {
        const index = (order[oldDay] || []).indexOf(target.id);
        put(state.retirements || (state.retirements = {}), target.id, op?.op_id || 'preview');
        put(order, oldDay, (order[oldDay] || []).filter(id => id !== target.id));
        if (oldDay === row.day && index >= 0) order[row.day].splice(index, 0, row.id); else order[row.day].push(row.id);
      } else order[row.day].push(row.id);
    }
    /* The no-empty-workout rule judges a NEW edit (preview, op null) only: an
       operation already on the record is replayed as recorded, so a rule added
       later can never make the stored history unreadable. */
    if (!op) {
      if (edit.kind === 'split') { staffed('U'); staffed('L'); }
      else if (target && (edit.kind !== 'update' || target.day !== oldDay)) staffed(oldDay);
    }
    return state;
  }
  function result(info, date) {
    C.dateOf(date); let state = clone(base); const applied = [], pending = new Set();
    // Validate the entire pending composition too: invalid later edits cannot
    // supply a trusted seen basis just because the current date precedes them.
    const complete = clone(base);
    for (const op of info.active) {
      const value = op.members[0].value, from = info.starts.get(op.op_id); apply(complete, value.edit, from, op);
      if (from <= date) { state = clone(complete); applied.push(op.op_id); }
      else pending.add(from);
    }
    return freeze({ state, plan_basis: info.basis, causal_parents: info.parents.slice(),
      pending_dates: [...pending].sort(), applied_ids: applied,
      intents: info.edits.map(op => ({ op_id: op.op_id, ...clone(op.members[0].value), status: info.statuses.get(op.op_id) })) });
  }
  function read(generation, date) { return result(inspect(generation), date); }
  function preview(generation, starts_on, value) {
    const input = C.validateInput(value, { validateTags }), info = inspect(generation);
    if (input.starts_on !== starts_on || input.seen_plan_basis !== info.basis ||
        !equal([...input.causal_parents].sort(), [...info.parents].sort())) fail('PLAN_EDIT_STALE_BASIS');
    if (info.edits.some(op => op.members[0].value.intent_id === input.intent_id)) fail('PLAN_EDIT_DUPLICATE_INTENT');
    if (input.edit.exercise && info.added.has(input.edit.exercise.id)) fail('PLAN_EDIT_ID_REUSED');
    if (input.edit.exercise && typeof projectNewExerciseTags !== 'function') fail('PLAN_EDIT_NEW_TAG_PROJECTION_UNAVAILABLE');
    const current = result(info, starts_on), state = clone(current.state);
    apply(state, input.edit, starts_on, null);
    return freeze({ ...current, state });
  }
  return Object.freeze({ read, preview });
}
module.exports = { createPlanEditProjector, importPresentIn, startedOn,
  planEditCollections: () => COLLECTIONS.slice(), P2_ROW: P2_ROW.slice() };
