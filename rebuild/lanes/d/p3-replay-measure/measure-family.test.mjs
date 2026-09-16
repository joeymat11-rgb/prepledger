/* P3-REPLAY-MEASURE-FAMILY - the F7 family's own cells, over the REAL
   encrypted repository on fake-indexeddb, the REAL S5 measure producer and the
   REAL admission controller. Nothing is stubbed and nothing is mocked.

   SYNTHETIC ONLY: every operation and every state here comes from the public
   s3 fixture harness (rebuild/m4/import/test/s3/fixtures.mjs), which invents
   its own athlete. No private fixture, no ledger and no owner file is read,
   named or reachable from here. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
/* fake-indexeddb is a rebuild/m3/w6 development dependency; this takes it from
   the ONE place the import lane's own harness already resolves it, so nothing
   is installed for this directory (DECISIONS:456). */
import {IDBFactory} from '../../../m3/w7-preview/import/test/support.mjs';
import {createLocalSourceFixture, fixtureEffective, appendCompletedWorkout}
  from '../../../m4/import/test/s3/fixtures.mjs';
import Measure from '../../../m3/w7-preview/measure/measure-commands.cjs';
import {createMeasureReplayFamily, CODE, FAMILY}
  from '../../../m4/import/measure-replay.cjs';
/* P3-REPLAY-ALL-FAMILIES, RV-G4: the shared class's own code, for a member of
   the class that is not a measure record. See P3-MF3. */
import {CODE as CLASS_CODE} from '../../../m4/import/body-composition-class.cjs';

const DAY = '2026-09-04';
const commands = Measure.createMeasureCommands();
const PROFILES = {waist: Measure.PROFILE, markers: Measure.MARKERS_PROFILE,
  trialStart: Measure.TRIAL_PROFILE};

const fixture = async (t, options = {}) => {
  const f = await createLocalSourceFixture({indexedDB: new IDBFactory(), crypto: webcrypto,
    databaseName: 'p3-measure-family', ...options});
  t.after(() => f.close());
  return f;
};
const admitted = async f => f.controller.view(
  await f.controller.prepareSource(await f.review(), {identityConfirmed: true, prefixAnswer: true}));
const attempt = async f => {
  try {
    return {result: await f.controller.prepareSource(await f.review(),
      {identityConfirmed: true, prefixAnswer: true})};
  } catch (error) { return {error}; }
};
const codesOf = at => at.error ? [at.error.code] : (at.result.issues || []).map(row => row.code);

/* THE THREE RECORDS THE MEASURE SCREEN WRITES, built by the S5 producer itself
   and appended to the installation's own generation exactly as the durable
   client writes them (one op, kind fact, class body-composition-source). */
async function writeMeasureOps(f, {
  trial = '2026-09-03', waist = {date: '2026-09-04', in: 32.5},
  markers = ['db-bench', 'lat-pulldown', 'leg-press'], at = DAY} = {}) {
  const ids = {};
  if (trial !== null) ids.trial = (await f.append('TEST-ONLY-measure-trial',
    {...commands.prepare({action: Measure.TRIAL_ACTION, input: {start: trial}}),
      effective: fixtureEffective(at, 9)})).op_id;
  if (waist !== null) ids.waist = (await f.append('TEST-ONLY-measure-waist',
    {...commands.prepare({action: Measure.ACTION, input: {entry: waist}}),
      effective: fixtureEffective(at, 10)})).op_id;
  if (markers !== null) ids.markers = (await f.append('TEST-ONLY-measure-markers',
    {...commands.prepare({action: Measure.MARKERS_ACTION, input: {markers}}),
      effective: fixtureEffective(at, 11)})).op_id;
  return ids;
}

test('P3-MF1 - the three S5 measure records ADMIT and are RETAINED under F7, in their own dated order',
  async t => {
    const f = await fixture(t), ids = await writeMeasureOps(f);
    const view = await admitted(f);
    assert.equal(view.ready, true, 'the measure records refused the import');
    const rows = view.families.filter(row => row.family === FAMILY);
    assert.equal(rows.length, 3, JSON.stringify(view.families));
    for (const row of rows) assert.equal(row.state, 'retained');
    /* (3) ORDERING: by the record's OWN dated field, then device_seq. The trial
       start is dated 2026-09-03 and was written FIRST; the waist reading and
       the markers pick are both 2026-09-04, so device_seq separates them. */
    assert.deepEqual(rows.map(row => [row.measure, row.dated, row.dated_member]), [
      ['trial-start', '2026-09-03', 'payload.start'],
      ['waist', '2026-09-04', 'payload.entry.date'],
      ['markers', '2026-09-04', 'effective.local_date']]);
    /* Retained VERBATIM: each op is handed back to the caller as it stands. */
    const stored = (await f.repository.load()).generation.collections.ops;
    for (const id of Object.values(ids)) {
      const kept = view.retained.find(op => op.op_id === id);
      assert.ok(kept, 'a measure operation was dropped from the retained originals: ' + id);
      assert.deepEqual(kept, stored[id], 'a retained original was rewritten by replay');
    }
  });

test('P3-MF2 - a measure record is NOT session, programme, reading or daily evidence: the replayed '
  + 'state, calculation, programme and workout basis are byte-identical with and without them',
  async t => {
    const without = await admitted(await fixture(t, {databaseName: 'p3-mf2-control'}));
    const f = await fixture(t, {databaseName: 'p3-mf2-measured'});
    await writeMeasureOps(f);
    const with_ = await admitted(f);
    for (const member of ['state', 'calculation', 'order_map', 'workout_facts']) {
      assert.equal(JSON.stringify(with_[member]), JSON.stringify(without[member]),
        'the measure records moved ' + member + ', which they must never do');
    }
    assert.equal(JSON.stringify(with_.workout_baseline.session_log),
      JSON.stringify(without.workout_baseline.session_log));
    /* The basis members a measure record must NEVER move: the programme it
       proves, the engine it proved it under, and the source it proved. */
    for (const member of ['programme_digest', 'engine_digest', 'source_digest', 'material_digest'])
      assert.equal(with_.basis[member], without.basis[member],
        'a measure record moved ' + member);
    /* The members they DO move, honestly: the generation carries three more
       operations, so its operation digest changes and F7 names them in the
       interpretation. That is the WHOLE of their effect. */
    assert.notEqual(with_.basis.operation_digest, without.basis.operation_digest);
    assert.notEqual(with_.basis.interpretation_digest, without.basis.interpretation_digest);
    assert.equal(without.families.some(row => row.family === FAMILY), false);
  });

test('P3-MF3 - a MALFORMED measure record refuses BY NAME - ' + CODE + ' for a measure record, '
  + 'the shared class\'s own code for a member of the class that is not one - and never '
  + 'LOCAL_SOURCE_CONTEXT_UNRESOLVED; nothing is committed', async t => {
    /* P3-REPLAY-ALL-FAMILIES, RV-G4. `body-composition-source` is an ACCEPTED
       A4 class, not this lane's private one: the authority validates a
       lean-source payload of its own under it. Membership is therefore by
       PROFILE, and the ONE case below whose profile is not a measure profile is
       now refused in the CLASS's name rather than in this family's - which says
       what is actually missing, a family, instead of naming a family that never
       had anything to say about it. Every other case here is unchanged, each
       still refuses by a NAMED code, and none reaches the catch-all. */
    const malformed = [
      ['an unknown profile of the measure class',
        {class: 'body-composition-source', kind: 'fact',
          payload: {profile: 'earned/measure-not-a-profile/v1', entry: {date: DAY, in: 32.5}}},
        null, CLASS_CODE],
      ['a waist reading outside the producer\'s own range',
        {class: 'body-composition-source', kind: 'fact',
          payload: {profile: Measure.PROFILE, entry: {date: DAY, in: 900}}}],
      ['a waist reading whose date is not a date',
        {class: 'body-composition-source', kind: 'fact',
          payload: {profile: Measure.PROFILE, entry: {date: 'last Tuesday', in: 32.5}}}],
      ['a markers pick of two lifts',
        {class: 'body-composition-source', kind: 'fact',
          payload: {profile: Measure.MARKERS_PROFILE, markers: ['db-bench', 'leg-press']}}],
      ['a trial start dated AFTER the day admission stands on',
        {class: 'body-composition-source', kind: 'fact',
          payload: {profile: Measure.TRIAL_PROFILE, start: '2026-09-05'}}],
      /* A KIND THIS FAMILY HAS NEVER BEEN TAUGHT. measure-commands.cjs writes
         only facts, so a correction of the measure class is an edit replay
         cannot interpret. It is owned by this family (the class is its own) and
         refused BY NAME rather than ignored - which is what "no measure op may
         be silently dropped" means when the drop would be the easy answer. */
      ['a CORRECTION of the measure class, which the S5 producer never writes',
        {class: 'body-composition-source', kind: 'correction', target: 'TEST-ONLY-measure-waist',
          payload: {replacement_fields: {entry: {date: DAY, in: 33}}}},
        f => writeMeasureOps(f, {trial: null, markers: null})]];
    for (const [index, [what, action, pre, expected = CODE]] of malformed.entries()) {
      const f = await fixture(t, {databaseName: 'p3-mf3-' + index});
      if (pre) await pre(f);
      const before = (await f.repository.load()).generation;
      await f.append('TEST-ONLY-malformed-measure', {...action, effective: fixtureEffective(DAY, 9)});
      const codes = codesOf(await attempt(f));
      assert.ok(codes.includes(expected), what + ' fell to ' + JSON.stringify(codes));
      assert.equal(codes.includes('LOCAL_SOURCE_CONTEXT_UNRESOLVED'), false,
        what + ' still reached the catch-all');
      const after = (await f.repository.load()).generation;
      assert.deepEqual(Object.keys(after.collections.derived || {}), Object.keys(before.collections.derived || {}),
        'a refusal committed something');
      assert.equal(after.metadata.localSourceApplication, undefined);
    }
  });

test('P3-MF4 - NO MEASURE OPERATION IS EVER SILENTLY DROPPED: every owned record leaves the '
  + 'family as a retained row or as a named refusal, and the family owns exactly its own class',
  async () => {
    const family = createMeasureReplayFamily({commands, profiles: PROFILES});
    const at = {readOperation: () => ({athlete_id: 'TEST-ONLY-athlete'}), asOf: DAY};
    const good = profile => ({op_id: 'ok-' + profile, class: 'body-composition-source', kind: 'fact',
      device_seq: 1, athlete_id: 'TEST-ONLY-athlete', causal_parents: [],
      effective: {local_date: DAY, local_time: '09:00', utc_offset: '-04:00'},
      payload: profile === Measure.PROFILE ? {profile, entry: {date: DAY, in: 32.5}}
        : profile === Measure.MARKERS_PROFILE ? {profile, markers: ['a', 'b', 'c']}
          : {profile, start: DAY}});
    const rows = [good(Measure.PROFILE), good(Measure.MARKERS_PROFILE), good(Measure.TRIAL_PROFILE),
      {...good(Measure.PROFILE), op_id: 'bad-1', payload: {profile: Measure.PROFILE, entry: {}}},
      {...good(Measure.PROFILE), op_id: 'bad-2', kind: 'tombstone'},
      /* Not this family's, and it must not claim them. */
      {op_id: 'reading', class: 'reading', kind: 'fact', payload: {}},
      {op_id: 'session', class: 'session', kind: 'session-start', payload: {}},
      {op_id: 'event', class: 'event', kind: 'fact', payload: {profile: Measure.PROFILE}}];
    const out = family.replay(rows, at);
    assert.equal(out.owned, 5, 'the family claimed an operation that is not of its class');
    assert.equal(out.families.length + out.issues.length, out.owned);
    assert.deepEqual(out.issues.map(row => row.op_id).sort(), ['bad-1', 'bad-2']);
    for (const row of out.issues) assert.equal(row.code, CODE);
    assert.deepEqual(out.families.map(row => row.measure).sort(), ['markers', 'trial-start', 'waist']);
    for (const row of rows) {
      assert.equal(family.owns(row), row.class === 'body-composition-source');
      if (!family.owns(row)) assert.equal(family.read(row, at), null);
    }
    /* The family is constructed against the S5 producer and its three profiles,
       or not at all: no silent default may stand in for either. */
    for (const broken of [{}, {commands}, {profiles: PROFILES},
      {commands, profiles: {...PROFILES, markers: Measure.PROFILE}}])
      assert.throws(() => createMeasureReplayFamily(broken), TypeError);
  });

test('P3-MF5 - a completed NATIVE workout beside the measure records: F3 still projects, the '
  + 'programme proof still stands, and F7 still retains', async t => {
    const f = await fixture(t, {databaseName: 'p3-mf5'});
    for (const e of f.state.exercises) e.w = typeof e.steps[0] === 'number' ? e.steps[0] + 5 : 20;
    const complete = await appendCompletedWorkout(f);
    await writeMeasureOps(f);
    const view = await admitted(f);
    assert.equal(view.ready, true);
    assert.ok(view.families.some(row => row.family === 'F3' && row.state === 'projected'));
    assert.deepEqual(view.workout_facts.sessions.map(s => s.start_op_id), [complete.startId]);
    assert.equal(view.families.filter(row => row.family === FAMILY).length, 3);
  });

test('P3-MF6 - the other families are untouched: F1 readings, F2 food, F4 setup and machine '
  + 'settings, F5 the check-in and F6 the historical decisions all still answer', async t => {
    const f = await fixture(t, {databaseName: 'p3-mf6'});
    await writeMeasureOps(f);
    const view = await admitted(f);
    for (const name of ['F1', 'F2', 'F4', 'F5', 'F6', FAMILY])
      assert.ok(view.families.some(row => row.family === name), name + ' stopped answering');
    assert.equal(view.state.reads.find(r => r.d === '2026-09-04').w, 173.25);
    assert.equal(view.state.dailyLogs['2026-09-04'].cal, 2300);
    assert.equal(view.retained.find(op => op.op_id === 'TEST-ONLY-machine')
      .payload.machine.settings[0].value, 'four');
  });
