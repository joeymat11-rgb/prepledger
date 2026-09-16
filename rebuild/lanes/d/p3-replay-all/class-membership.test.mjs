/* P3-REPLAY-ALL-FAMILIES - RV-G4, THE SHARED CLASS JUDGED BY PROFILE.

   `body-composition-source` is an accepted A4 class, not one lane's private
   one: rebuild/authority/validate.cjs validates a LEAN-SOURCE payload of its own
   under it - kind, quantity, provenance, effective_date and a low/high interval
   - which carries NO profile at all. F7 owned the class by class alone, so that
   payload was refused LOCAL_SOURCE_MEASURE_UNRESOLVED: in the name of a family
   that never had anything to say about it. These cells prove the routing, and
   that an edit of a measure record is still the measure family's to refuse.

   SYNTHETIC ONLY: the public s3 fixture harness and invented payloads. No
   private fixture, no ledger and no owner file is read or reachable from here. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {IDBFactory} from '../../../m3/w7-preview/import/test/support.mjs';
import {createLocalSourceFixture, fixtureEffective}
  from '../../../m4/import/test/s3/fixtures.mjs';
import Measure from '../../../m3/w7-preview/measure/measure-commands.cjs';
import {createMeasureReplayFamily, CODE as MEASURE_CODE, FAMILY as MEASURE_FAMILY}
  from '../../../m4/import/measure-replay.cjs';
import {createBodyCompositionClass, CODE as CLASS_CODE, OP_CLASS}
  from '../../../m4/import/body-composition-class.cjs';
import Validate from '../../../authority/validate.cjs';

const DAY = '2026-09-04';
const commands = Measure.createMeasureCommands();
const PROFILES = [Measure.PROFILE, Measure.MARKERS_PROFILE, Measure.TRIAL_PROFILE];
const measureFamily = createMeasureReplayFamily({commands,
  profiles: {waist: Measure.PROFILE, markers: Measure.MARKERS_PROFILE,
    trialStart: Measure.TRIAL_PROFILE}});
const classOf = () => createBodyCompositionClass({members: [{family: MEASURE_FAMILY,
  profiles: PROFILES, replay: measureFamily.replay}]});

/* THE AUTHORITY'S OWN LEAN-SOURCE PAYLOAD for this class, in the shape
   rebuild/authority/validate.cjs payloadValid accepts. Nothing in the shipped
   page writes it today; that is exactly why it must not be judged by a family
   that does not answer for it. */
const LEAN_PAYLOAD = {kind: 'estimate', quantity: 'body_fat_fraction',
  provenance: 'your estimate', effective_date: DAY,
  low: {value: 0.12, unit: 'fraction'}, high: {value: 0.16, unit: 'fraction'},
  point: {value: 0.14, unit: 'fraction'}};

const envelope = (id, payload, extra = {}) => ({op_id: id, class: OP_CLASS, kind: 'fact',
  device_seq: 1, athlete_id: 'TEST-ONLY-athlete', causal_parents: [],
  effective: {local_date: DAY, local_time: '09:00', utc_offset: '-04:00'}, payload, ...extra});
const at = ops => ({readOperation: id => ops[id],
  asOf: DAY});

test('P3-CM1 - the LEAN-SOURCE payload of the shared class is judged by the CLASS, not by the '
  + 'measure family: it refuses ' + CLASS_CODE + ' and names the profile it carried', () => {
    const router = classOf();
    const lean = envelope('lean', LEAN_PAYLOAD);
    /* It really is a valid operation of this class to the authority: what it
       lacks is a family, not a shape. */
    assert.equal(Validate.payloadValid(OP_CLASS, LEAN_PAYLOAD), true,
      'the invented lean payload is not the authority\'s own shape, so this proves nothing');
    const out = router.replay([lean], at({lean}));
    assert.equal(out.owned, 1);
    assert.deepEqual(out.families, []);
    assert.deepEqual(out.issues, [{code: CLASS_CODE, op_id: 'lean', profile: null}]);
    assert.notEqual(out.issues[0].code, MEASURE_CODE,
      'the lean payload is still refused in the measure family\'s name');
    /* And a member of the class under SOME OTHER named profile is refused the
       same way, with the profile it carried, so the refusal says what is
       actually missing: a family, not a valid record. */
    const other = envelope('other', {profile: 'earned/lean-source/v1', entry: {}});
    const two = classOf().replay([other], at({other}));
    assert.deepEqual(two.issues, [{code: CLASS_CODE, op_id: 'other', profile: 'earned/lean-source/v1'}]);
  });

test('P3-CM2 - the three measure profiles still route to F7, and an EDIT of a measure record is '
  + 'still the measure family\'s to refuse - by its own name, through its target', () => {
    const waist = envelope('waist', {profile: Measure.PROFILE, entry: {date: DAY, in: 32.5}});
    const markers = envelope('markers', {profile: Measure.MARKERS_PROFILE, markers: ['a', 'b', 'c']});
    const trial = envelope('trial', {profile: Measure.TRIAL_PROFILE, start: DAY});
    const ops = {waist, markers, trial};
    const out = classOf().replay([waist, markers, trial], at(ops));
    assert.equal(out.owned, 3);
    assert.deepEqual(out.issues, []);
    assert.deepEqual(out.families.map(row => row.family), [MEASURE_FAMILY, MEASURE_FAMILY, MEASURE_FAMILY]);
    /* A correction of the waist reading carries no profile of its own. It is
       routed by its TARGET, so the family that owns the record it edits is the
       family that refuses it - LOCAL_SOURCE_MEASURE_UNRESOLVED, exactly as
       P3-MF3 pins on the base. */
    const edit = envelope('edit', {replacement_fields: {entry: {date: DAY, in: 33}}},
      {kind: 'correction', target_op_id: 'waist'});
    const edited = classOf().replay([edit], at({...ops, edit}));
    assert.deepEqual(edited.issues, [{code: MEASURE_CODE, op_id: 'edit'}]);
    /* An edit whose target is not of this class has no profile to be judged
       under, and is refused by the class rather than guessed at. */
    const orphan = envelope('orphan', {reason: 'Synthetic'},
      {kind: 'tombstone', target_op_id: 'not-in-this-generation'});
    assert.deepEqual(classOf().replay([orphan], at({orphan})).issues,
      [{code: CLASS_CODE, op_id: 'orphan', profile: null}]);
  });

test('P3-CM3 - NOTHING OF THE CLASS IS DROPPED and membership cannot be ambiguous: the router '
  + 'accounts for every owned operation and refuses two families claiming one profile', () => {
    const router = classOf();
    const rows = [envelope('a', {profile: Measure.PROFILE, entry: {date: DAY, in: 32.5}}),
      envelope('b', {profile: Measure.PROFILE, entry: {}}),
      envelope('c', LEAN_PAYLOAD),
      {op_id: 'reading', class: 'reading', kind: 'fact', payload: {}},
      {op_id: 'sleep', class: 'sleep', kind: 'fact', payload: {}}];
    const ops = Object.fromEntries(rows.map(op => [op.op_id, op]));
    const out = router.replay(rows, at(ops));
    assert.equal(out.owned, 3, 'the router claimed an operation that is not of its class');
    assert.equal(out.families.length + out.issues.length, out.owned);
    for (const row of rows) assert.equal(router.owns(row), row.class === OP_CLASS);
    assert.deepEqual(router.profiles.slice().sort(), PROFILES.slice().sort());
    /* Two families claiming one profile is not a routing decision this module
       may take, so it is refused at construction rather than resolved. */
    assert.throws(() => createBodyCompositionClass({members: [
      {family: 'F7', profiles: [Measure.PROFILE], replay: measureFamily.replay},
      {family: 'F9', profiles: [Measure.PROFILE], replay: measureFamily.replay}]}), TypeError);
    for (const broken of [{}, {members: []}, {members: [{family: 'F7', profiles: PROFILES}]},
      {members: [{family: '', profiles: PROFILES, replay: measureFamily.replay}]},
      {members: [{family: 'F7', profiles: [], replay: measureFamily.replay}]}])
      assert.throws(() => createBodyCompositionClass(broken), TypeError);
    assert.throws(() => router.replay(rows, {asOf: DAY}), TypeError);
  });

test('P3-CM4 - through the REAL controller: a member of the shared class under a profile no '
  + 'family claims refuses ' + CLASS_CODE + ' by name, never the catch-all, and commits nothing',
  async t => {
    const f = await createLocalSourceFixture({indexedDB: new IDBFactory(), crypto: webcrypto,
      databaseName: 'p3-cm4'});
    t.after(() => f.close());
    const before = (await f.repository.load()).generation;
    await f.append('TEST-ONLY-lean-source',
      {class: OP_CLASS, kind: 'fact', payload: LEAN_PAYLOAD, effective: fixtureEffective(DAY, 9)});
    let codes;
    try {
      const result = await f.controller.prepareSource(await f.review(),
        {identityConfirmed: true, prefixAnswer: true});
      codes = (result.issues || []).map(row => row.code);
    } catch (error) { codes = [error.code]; }
    assert.ok(codes.includes(CLASS_CODE), JSON.stringify(codes));
    assert.equal(codes.includes('LOCAL_SOURCE_CONTEXT_UNRESOLVED'), false,
      'the lean-source payload still reached the catch-all');
    assert.equal(codes.includes(MEASURE_CODE), false,
      'the lean-source payload is still refused in the measure family\'s name');
    const after = (await f.repository.load()).generation;
    assert.deepEqual(Object.keys(after.collections.derived || {}),
      Object.keys(before.collections.derived || {}), 'a refusal committed something');
    assert.equal(after.metadata.localSourceApplication, undefined);
  });
