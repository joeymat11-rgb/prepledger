'use strict';
/* native-load-replay.cjs - THE REPLAY FAMILY FOR THE NATIVE-LOAD YES (F9).
   S11 FC09, PM ruling DECISIONS:878; NATIVE-LOAD-SPEC R9.13 :175-:177 and :228
   (read with `git show 7ef8291:rebuild/coach/NATIVE-LOAD-SPEC.md`).

   WHAT WENT WRONG, FOUND BY A CELL BEFORE A PERSON FOUND IT. The native-load
   "Yes" on Today (today-entry.mjs:245 -> createNativeLoadHost().respond ->
   local-client respondNativeLoad -> t2-stage.cjs nativeRespond) writes ONE
   operation of the plan class, kind proposal-response, payload exactly
   {proposal_id, answer:'accept', issuance} (spec :101), into the very
   generation local source admission replays. Admission had no family for it,
   so source-admission.mjs replay() refused it LOCAL_SOURCE_EFFECT_UNMAPPED at
   its unknown-plan catch and a person who tapped Yes could not import his own
   history (cell P3-EN3; s11-t4-en3-scratch/EN3-DIAG.md). The spec calls that
   exact behaviour the failure FC09 exists to prevent (:228 "import either
   refuses every yes or drops it").

   THE RULES THIS FAMILY STATES, in the shape F7 and F8 state theirs:

   (1) MEMBERSHIP (spec :175). A proposal-response of the plan class belongs to
       this family when it is the native-load producer's: its issuance names the
       producer FC03 exports, or its body the native decision profile, or its
       proposal_id is the native proposal digest of its own body and reason, or
       its proposal_id is one a native accept in the SAME log carries (a
       "matching retained native proposal ID"). Nothing else of the plan class
       is this family's: an unrelated or unclassifiable plan record keeps its
       existing refusal, LOCAL_SOURCE_EFFECT_UNMAPPED, at admission's catch.
   (2) MALFORMED IS REFUSED BY NAME, NEVER DROPPED (spec :175, PM ruling). An
       owned record that is not a well-formed native accept refuses
       LOCAL_SOURCE_NATIVE_LOAD_RECORD_INVALID with NATIVE_LOAD_RECORD_INVALID as
       its detail and the failing member as its field. A missing issuance is
       never consent, and a decline is never written by the shipped page (:101),
       so neither is admitted. FC03's own structural judgement of the record
       (its malformed-in-itself reasons) refuses the same way.
   (3) EVIDENCE ROLE: PROGRAMME EVIDENCE, FOLDED, NOT RETAINED (PM ruling;
       spec :176). The accepted records are handed to FC03
       (rebuild/m4/workout/native-load-effects.cjs, read here, never edited)
       ONCE, at the admitted source cut, over the replayed state as its
       IMMUTABLE base (spec B :96: "base is immutable admitted source/clean
       init, not yesterday's folded state"). The fold's result is read back into
       one row per record - applied, held, retired, compensation, or refused by
       FC03 by name - and a digest of the WHOLE fold (folded programme, effects,
       spend index, issues and coverage) rides on every row, so the
       interpretation digest admission binds into its basis binds the fold.
       The folded state is NOT written back into the admitted state: the page
       folds the same log over the same base on every projection
       (today-bindings.mjs registrar and createNativeLoadHost), and a base that
       already carried the effect would apply it twice (I4 "semantic evidence is
       spent once"; spec :43 "never merge a native-derived programme cache back
       into source material").
   (4) NO TRAP (spec :158). A hold is a projection state, not an import
       refusal: a record FC03 holds (its base moved under the import, a
       correspondence it cannot prove at the new base, a basis needing repair)
       is ADMITTED with outcome 'held' and its codes, and the page offers its
       Undo exactly as it would without an import. Only a record malformed in
       itself, a yes the fold accounts for nowhere, and a fold that refuses or
       throws as a whole are refused, each by name.

   NO ENGINE, NO CLOCK, NO PLATFORM, NO REQUIRE. FC03 is injected by the caller,
   and so are the engine, the source basis and the trend window the fold runs
   in; this module reads operations and a fold, and returns rows. It names the
   plan class only to compare it (P3-EN4: a reader, never a writer). */

const FAMILY = 'F9';
const CODE = 'LOCAL_SOURCE_NATIVE_LOAD_RECORD_INVALID';
const DETAIL = 'NATIVE_LOAD_RECORD_INVALID';
const OP_CLASS = 'plan';
const OP_KIND = 'proposal-response';
const DECISION_PROFILE = 'earned/native-load-decision/v1';
const PAYLOAD_KEYS = ['answer', 'issuance', 'proposal_id'];
const ISSUANCE_KEYS = ['body', 'moment', 'producer', 'reason', 'revision', 'source'];
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
/* FC03 structural() reasons that are the record's OWN malformation, whatever the
   base it is folded over (native-load-effects.cjs structural() and its
   recordShape(), reported as reason 'record shape'). 'lineage' is NOT one: a
   lift the base does not carry is a fact about the base, and FC03 holds that
   lift rather than refusing the programme (spec :155 S1, :158). */
const INTRINSIC = new Set(['answer or issuance shape', 'issuance fields', 'issuance body not strict JSON',
  'decision shape', 'proposal digest', 'athlete scope', 'record shape', 'consumed reference absent']);
/* FC03's accept refusals that keep the spend held back, unapplied (its HELD_BACK
   set and the R9.10 LATER HOLD; native-load-effects.cjs:20 and refusedAccept). */
const HELD_BACK = new Set(['NATIVE_LOAD_LEGACY_PENDING', 'NATIVE_LOAD_VECTOR_ADOPTION_UNDEFINED', 'NATIVE_LOAD_TARGET_QUEUED']);

const isMap = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const text = x => typeof x === 'string' && x.length > 0;
const keysAre = (x, keys) => isMap(x) && JSON.stringify(Object.keys(x).sort()) === JSON.stringify(keys);
const canon = x => (Array.isArray(x) ? x.map(canon) : isMap(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, canon(x[k])])) : x);

function createNativeLoadReplayFamily({effects} = {}) {
  if (!effects || typeof effects.foldNativeLoad !== 'function' || typeof effects.proposalDigest !== 'function'
    || typeof effects.sha256Hex !== 'function' || !text(effects.PRODUCER) || !Array.isArray(effects.HOLD_CODES))
    throw new TypeError('The FC03 native-load fold is required');
  const PRODUCER = effects.PRODUCER;
  const HOLDS = new Set(effects.HOLD_CODES);
  const digestOf = (body, reason) => { try { return effects.proposalDigest(PRODUCER, body, reason); } catch { return null; } };
  const envelope = op => !!op && op.class === OP_CLASS && op.kind === OP_KIND && isMap(op.payload);

  /* (1) MEMBERSHIP by the record itself: producer, profile or digest. */
  function producerOwned(op) {
    if (!envelope(op)) return false;
    const iss = op.payload.issuance;
    if (!isMap(iss)) return false;
    if (iss.producer === PRODUCER || (isMap(iss.body) && iss.body.profile === DECISION_PROFILE)) return true;
    return text(op.payload.proposal_id) && op.payload.proposal_id === digestOf(iss.body, iss.reason);
  }
  /* The native proposal IDs one log retains, for (1)'s last arm. */
  function proposals(operations) {
    return new Set((operations || []).filter(producerOwned).map(op => op.payload.proposal_id).filter(text));
  }
  function owns(op, retained) {
    if (producerOwned(op)) return true;
    return envelope(op) && text(op.payload.proposal_id) && !!retained && retained.has(op.payload.proposal_id);
  }

  /* (2) One owned record, read. The first failing member names the field. */
  function read(op, {asOf, athleteId} = {}) {
    if (typeof asOf !== 'string' || !DAY_RE.test(asOf) || !text(athleteId))
      throw new TypeError('The day admission stands on and the athlete are required');
    const refuse = field => ({ok: false, code: CODE, op_id: op.op_id, detail: DETAIL, field});
    if (op.schema_version !== 1) return refuse('schema_version');
    const p = op.payload;
    if (!keysAre(p, PAYLOAD_KEYS)) return refuse('payload');
    if (p.answer !== 'accept') return refuse('answer');
    const iss = p.issuance;
    if (!keysAre(iss, ISSUANCE_KEYS)) return refuse('issuance');
    if (iss.producer !== PRODUCER) return refuse('producer');
    const body = iss.body;
    if (!isMap(body) || body.profile !== DECISION_PROFILE || !text(body.spend_id) || !text(body.lift_lineage_id)) return refuse('body');
    if (![iss.reason, iss.revision, iss.source, iss.moment].every(text) || !Number.isFinite(Date.parse(iss.moment))) return refuse('issuance');
    if (p.proposal_id !== digestOf(body, iss.reason)) return refuse('proposal_id');
    if (!isMap(body.basis) || body.basis.athlete_id !== athleteId) return refuse('athlete_id');
    const day = op.effective && op.effective.local_date;
    if (typeof day !== 'string' || !DAY_RE.test(day) || day > asOf) return refuse('effective');
    return {ok: true, op_id: op.op_id, spend_id: body.spend_id, lift: body.lift_lineage_id, kind: body.kind, device_seq: op.device_seq};
  }

  /* Every owned record leaves here as an accepted row or a named issue; the
     count is asserted so a later edit cannot drop one quietly. Accepted rows
     are not yet family rows: a yes is answered for only once it is folded. */
  function replay(operations, {asOf, athleteId} = {}) {
    const owned = operations || [], accepted = [], issues = [];
    for (const op of owned) {
      const row = read(op, {asOf, athleteId});
      if (row.ok) accepted.push(row);
      else issues.push({code: row.code, op_id: row.op_id, detail: row.detail, field: row.field});
    }
    if (accepted.length + issues.length !== owned.length) throw new Error('NATIVE_LOAD_REPLAY_ACCOUNTING');
    return {accepted, families: [], issues, owned: owned.length};
  }

  /* (3) and (4): the fold, once, inside the caller's window, read back. */
  function fold(accepted, {base, generation, workoutFacts, engine, athleteId, source, lineage, within = run => run()} = {}) {
    if (!accepted || !accepted.length) return {families: [], issues: []};
    const refuseAll = detail => ({families: [], issues: accepted.map(r => ({code: CODE, op_id: r.op_id, detail, field: 'fold'}))});
    let result;
    /* S11 FC09 round 6: the caller's lineage resolver (lift-correspondence.cjs liftResolver), handed through unchanged. */
    try { result = within(() => effects.foldNativeLoad({base, generation, workoutFacts, engine, athleteId, source,
      ...(lineage === undefined ? {} : {lineage})})); }
    catch { return refuseAll(DETAIL); }
    if (!isMap(result) || result.status !== 'ready') {
      const first = isMap(result) && Array.isArray(result.issues) && result.issues[0];
      return refuseAll(first && /^NATIVE_LOAD_[A-Z_]+$/.test(first.code) ? first.code : DETAIL);
    }
    const issues = Array.isArray(result.issues) ? result.issues : [], spent = Array.isArray(result.spent) ? result.spent : [];
    const names = (refs, id) => Array.isArray(refs) && refs.some(r => isMap(r) && r.op_id === id);
    /* S11 FC09 round 3 (PM ruling DECISIONS:879). The digest binds the folded PROGRAMME: the workoutFacts copy FC03
       carries on its state is dropped, exactly as the page drops it before adopting a fold (today-entry.mjs reconcile,
       today-bindings.mjs registrar), because the caller now attaches the legacy-order baseline, whose ids name the
       selection, and the facts are bound by the interpretation's own workout member anyway. */
    const programme = isMap(result.state) ? Object.fromEntries(Object.entries(result.state).filter(([k]) => k !== 'workoutFacts')) : result.state;
    const foldDigest = 'sha256:' + effects.sha256Hex(JSON.stringify(canon({status: result.status, state: programme,
      effects: result.effects, spent, issues, coverage: result.coverage})));
    /* Every active fold issue, the lift-less ones (the governor's) included, so a refusal the fold met anywhere is
       readable in the interpretation and comparable with the page's own projection (FC09-Q1-E). */
    const foldCodes = [...new Set(issues.filter(i => isMap(i) && !i.superseded_by).map(i => i.code))].sort();
    const families = [], refused = [];
    for (const row of accepted) {
      const naming = issues.filter(i => isMap(i) && names(i.refs, row.op_id));
      const intrinsic = naming.find(i => i.code === DETAIL && INTRINSIC.has(i.reason));
      if (intrinsic) { refused.push({code: CODE, op_id: row.op_id, detail: DETAIL, field: text(intrinsic.field) ? intrinsic.field : 'payload'}); continue; }
      const active = naming.filter(i => !i.superseded_by);
      const entry = spent.find(x => isMap(x) && names(x.response_refs, row.op_id));
      const outcome = entry && entry.cancelled_by ? 'retired'
        : active.some(i => HOLDS.has(i.code)) || (entry && active.some(i => HELD_BACK.has(i.code))) ? 'held'
          : entry ? (row.kind === 'compensate' ? 'compensation' : 'applied')
            : active.length ? 'refused' : null;
      if (!outcome) { refused.push({code: CODE, op_id: row.op_id, detail: DETAIL, field: 'fold'}); continue; }
      families.push({family: FAMILY, state: 'folded', op_id: row.op_id, spend_id: row.spend_id, outcome,
        codes: [...new Set(active.map(i => i.code))].sort(), fold_codes: foldCodes, fold_digest: foldDigest});
    }
    return {families, issues: refused};
  }

  return Object.freeze({owns, proposals, read, replay, fold, FAMILY, CODE, DETAIL, OP_CLASS, OP_KIND, DECISION_PROFILE});
}

module.exports = {createNativeLoadReplayFamily, FAMILY, CODE, DETAIL, OP_CLASS, OP_KIND, DECISION_PROFILE};
