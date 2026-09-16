/* P3-REPLAY-ALL-FAMILIES - F8's own cells, over the REAL encrypted repository
   on fake-indexeddb, the REAL N2 sleep producer and the REAL admission
   controller. Nothing is stubbed and nothing is mocked.

   SYNTHETIC ONLY: every operation and every state here comes from the public s3
   fixture harness (rebuild/m4/import/test/s3/fixtures.mjs), which invents its
   own athlete. No private fixture, no ledger and no owner file is read, named or
   reachable from here. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {IDBFactory} from '../../../m3/w7-preview/import/test/support.mjs';
import {createLocalSourceFixture, fixtureEffective, appendCompletedWorkout}
  from '../../../m4/import/test/s3/fixtures.mjs';
import Sleep from '../../../m3/w7-preview/today/sleep-commands.cjs';
import Measure from '../../../m3/w7-preview/measure/measure-commands.cjs';
import {createSleepReplayFamily, CODE, FAMILY, DATED_MEMBER}
  from '../../../m4/import/sleep-replay.cjs';

const DAY = '2026-09-04';
const commands = Sleep.createSleepCommands();

const fixture = async (t, options = {}) => {
  const f = await createLocalSourceFixture({indexedDB: new IDBFactory(), crypto: webcrypto,
    databaseName: 'p3-sleep-family', ...options});
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

/* THE NIGHTS THE SLEEP SCREEN WRITES, built by the N2 producer itself and
   appended to the installation's own generation exactly as the durable client
   writes them (one op per night, kind fact, class sleep). */
const NIGHTS = [{date: '2026-09-02', hours: 7.25},
  {date: '2026-09-01', bed: '23:10', wake: '06:40', awake_min: 15},
  {date: '2026-09-03', hours: 6.5}];
async function writeNights(f, nights = NIGHTS, at = DAY) {
  const ids = [];
  for (const [index, night] of nights.entries())
    ids.push((await f.append('TEST-ONLY-sleep-' + index,
      {...commands.prepare({action: Sleep.ACTION, input: {night}}),
        effective: fixtureEffective(at, 7 + index)})).op_id);
  return ids;
}

test('P3-SF1 - the N2 sleep records ADMIT and are RETAINED under F8, in their own night order',
  async t => {
    const f = await fixture(t), ids = await writeNights(f);
    const view = await admitted(f);
    assert.equal(view.ready, true, 'the recorded nights refused the import');
    const rows = view.families.filter(row => row.family === FAMILY);
    assert.equal(rows.length, NIGHTS.length, JSON.stringify(view.families));
    for (const row of rows) assert.equal(row.state, 'retained');
    /* (3) ORDERING: by the night's OWN date, not by the order it was written
       in. The 09-01 night was recorded SECOND and comes FIRST here. */
    assert.deepEqual(rows.map(row => [row.dated, row.dated_member]),
      [['2026-09-01', DATED_MEMBER], ['2026-09-02', DATED_MEMBER], ['2026-09-03', DATED_MEMBER]]);
    /* Retained VERBATIM: each op is handed back to the caller as it stands. */
    const stored = (await f.repository.load()).generation.collections.ops;
    for (const id of ids) {
      const kept = view.retained.find(op => op.op_id === id);
      assert.ok(kept, 'a sleep operation was dropped from the retained originals: ' + id);
      assert.deepEqual(kept, stored[id], 'a retained original was rewritten by replay');
    }
  });

test('P3-SF2 - a night is NOT session or programme evidence: the replayed state, its sleep '
  + 'nights, the calculation, the programme and the workout basis are byte-identical with '
  + 'and without them', async t => {
    const without = await admitted(await fixture(t, {databaseName: 'p3-sf2-control'}));
    const f = await fixture(t, {databaseName: 'p3-sf2-slept'});
    await writeNights(f);
    const with_ = await admitted(f);
    for (const member of ['state', 'calculation', 'order_map', 'workout_facts'])
      assert.equal(JSON.stringify(with_[member]), JSON.stringify(without[member]),
        'the nights moved ' + member + ', which they must never do');
    /* (4) NEITHER CONTRADICTED NOR ABSORBED. The imported history's own nights
       are what the state carries, unchanged, and the native nights - all of them
       dated BEFORE the import's last day - neither overwrite one nor add one. */
    assert.equal(JSON.stringify(with_.state.sleep), JSON.stringify(without.state.sleep),
      'a native night reached state.sleep.nights');
    const imported = (without.state.sleep?.nights || []).map(n => n.d);
    assert.ok(imported.length > 0, 'the imported history holds no nights, so this proves nothing');
    for (const night of NIGHTS) assert.ok(night.date <= imported[imported.length - 1]
      || night.date < '2026-09-04', 'the invented nights are not before the import\'s last day');
    for (const member of ['programme_digest', 'engine_digest', 'source_digest', 'material_digest'])
      assert.equal(with_.basis[member], without.basis[member], 'a night moved ' + member);
    /* The members they DO move, honestly: three more operations really are in
       the generation, and F8 names them in the interpretation. */
    assert.notEqual(with_.basis.operation_digest, without.basis.operation_digest);
    assert.notEqual(with_.basis.interpretation_digest, without.basis.interpretation_digest);
    assert.equal(without.families.some(row => row.family === FAMILY), false);
  });

test('P3-SF3 - a MALFORMED night refuses ' + CODE + ', by name, and never '
  + 'LOCAL_SOURCE_CONTEXT_UNRESOLVED; nothing is committed', async t => {
    const malformed = [
      ['an unknown profile of the sleep class',
        {class: 'sleep', kind: 'fact',
          payload: {profile: 'earned/sleep-not-a-profile/v1', night: {date: '2026-09-02', hours: 7}}}],
      ['a duration outside the producer\'s own 0..24 bounds',
        {class: 'sleep', kind: 'fact',
          payload: {profile: Sleep.PROFILE, night: {date: '2026-09-02', hours: 30}}}],
      ['a night whose date is not a date',
        {class: 'sleep', kind: 'fact',
          payload: {profile: Sleep.PROFILE, night: {date: 'last Tuesday', hours: 7}}}],
      ['BOTH shapes at once, a duration and a clock pair',
        {class: 'sleep', kind: 'fact', payload: {profile: Sleep.PROFILE,
          night: {date: '2026-09-02', hours: 7, bed: '23:00', wake: '06:00'}}}],
      ['a night that has NOT FINISHED on the day it was recorded',
        {class: 'sleep', kind: 'fact',
          payload: {profile: Sleep.PROFILE, night: {date: DAY, hours: 7}}}],
      ['a night claiming a check-in this athlete never answered',
        {class: 'sleep', kind: 'fact', payload: {profile: Sleep.PROFILE,
          night: {date: '2026-09-02', hours: 7, from_checkin_op_id: 'TEST-ONLY-food'}}}],
      /* A KIND THIS FAMILY HAS NEVER BEEN TAUGHT. sleep-commands.cjs writes only
         facts - a correction IS a new fact for the same night - so a tombstone
         of the sleep class is an edit replay cannot interpret. It is owned by
         this family and refused BY NAME rather than ignored. */
      ['a TOMBSTONE of the sleep class, which the N2 producer never writes',
        {class: 'sleep', kind: 'tombstone', target: 'TEST-ONLY-sleep-0',
          payload: {reason: 'Synthetic removal the producer never writes'}},
        f => writeNights(f, [NIGHTS[0]])]];
    for (const [index, [what, action, pre]] of malformed.entries()) {
      const f = await fixture(t, {databaseName: 'p3-sf3-' + index});
      if (pre) await pre(f);
      const before = (await f.repository.load()).generation;
      await f.append('TEST-ONLY-malformed-sleep',
        {...action, effective: fixtureEffective(DAY, 9), ...(action.target ? {parents: [action.target]} : {})});
      const codes = codesOf(await attempt(f));
      assert.ok(codes.includes(CODE), what + ' fell to ' + JSON.stringify(codes));
      assert.equal(codes.includes('LOCAL_SOURCE_CONTEXT_UNRESOLVED'), false,
        what + ' still reached the catch-all');
      const after = (await f.repository.load()).generation;
      assert.deepEqual(Object.keys(after.collections.derived || {}),
        Object.keys(before.collections.derived || {}), 'a refusal committed something');
      assert.equal(after.metadata.localSourceApplication, undefined);
    }
  });

test('P3-SF4 - NO NIGHT IS EVER SILENTLY DROPPED: every owned record leaves the family as a '
  + 'retained row or as a named refusal, and the family owns exactly its own class', async () => {
    const family = createSleepReplayFamily({commands, profile: Sleep.PROFILE});
    const at = {readOperation: () => ({athlete_id: 'TEST-ONLY-athlete'}), asOf: DAY};
    const good = (id, date, hours) => ({op_id: id, class: 'sleep', kind: 'fact', device_seq: 1,
      athlete_id: 'TEST-ONLY-athlete', causal_parents: [],
      effective: {local_date: DAY, local_time: '07:00', utc_offset: '-04:00'},
      payload: {profile: Sleep.PROFILE, night: {date, hours}}});
    const rows = [good('ok-1', '2026-09-02', 7.25), good('ok-2', '2026-09-01', 6),
      {...good('bad-1', '2026-09-02', 7.25), payload: {profile: Sleep.PROFILE, night: {}}},
      {...good('bad-2', '2026-09-02', 7.25), kind: 'correction', target_op_id: 'ok-1'},
      /* Not this family's, and it must not claim them. */
      {op_id: 'reading', class: 'reading', kind: 'fact', payload: {}},
      {op_id: 'session', class: 'session', kind: 'session-start', payload: {}},
      {op_id: 'event', class: 'event', kind: 'fact', payload: {profile: Sleep.PROFILE}}];
    const out = family.replay(rows, at);
    assert.equal(out.owned, 4, 'the family claimed an operation that is not of its class');
    assert.equal(out.families.length + out.issues.length, out.owned);
    assert.deepEqual(out.issues.map(row => row.op_id).sort(), ['bad-1', 'bad-2']);
    for (const row of out.issues) assert.equal(row.code, CODE);
    assert.deepEqual(out.families.map(row => row.dated), ['2026-09-01', '2026-09-02']);
    for (const row of rows) {
      assert.equal(family.owns(row), row.class === 'sleep');
      if (!family.owns(row)) assert.equal(family.read(row, at), null);
    }
    /* Ties on the same night fall to device_seq, and the order is the family's
       account only - it never re-orders the store. */
    const tied = [{...good('late', '2026-09-02', 7), device_seq: 9},
      {...good('early', '2026-09-02', 6), device_seq: 2}];
    assert.deepEqual(family.replay(tied, at).families.map(row => row.op_id), ['early', 'late']);
    /* The family is constructed against the N2 producer and its profile, or not
       at all: no silent default may stand in for either. */
    for (const broken of [{}, {commands}, {profile: Sleep.PROFILE}, {commands, profile: ''}])
      assert.throws(() => createSleepReplayFamily(broken), TypeError);
  });

test('P3-SF5 - the other families are untouched with nights present: F1, F2, F3, F4, F5, F6 and '
  + 'F7 all still answer, and a completed NATIVE workout still proves the programme', async t => {
    const f = await fixture(t, {databaseName: 'p3-sf5'});
    for (const e of f.state.exercises) e.w = typeof e.steps[0] === 'number' ? e.steps[0] + 5 : 20;
    const complete = await appendCompletedWorkout(f);
    await writeNights(f);
    /* And the measure records beside them, so the two athlete-record families
       are proved to answer for their own class and only their own. */
    await f.append('TEST-ONLY-measure-waist',
      {...Measure.createMeasureCommands().prepare({action: Measure.ACTION,
        input: {entry: {date: DAY, in: 32.5}}}), effective: fixtureEffective(DAY, 11)});
    const view = await admitted(f);
    assert.equal(view.ready, true);
    for (const name of ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', FAMILY])
      assert.ok(view.families.some(row => row.family === name), name + ' stopped answering');
    assert.ok(view.families.some(row => row.family === 'F3' && row.state === 'projected'));
    assert.deepEqual(view.workout_facts.sessions.map(s => s.start_op_id), [complete.startId]);
    assert.equal(view.state.reads.find(r => r.d === '2026-09-04').w, 173.25);
    assert.equal(view.state.dailyLogs['2026-09-04'].cal, 2300);
  });
