'use strict';
// Read-only diagnostic against retained implementations. No issuer, accepted
// schema, scientific claim, durable operation or replacement oracle is supplied.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const {pathToFileURL} = require('node:url');
const {createHash} = require('node:crypto');
const {execFileSync} = require('node:child_process');
const m4 = path.resolve(__dirname, '../../..');
const w6 = path.resolve(process.argv[2] || '../m3-w6-browser-bridge');
const r1 = path.resolve(process.argv[3] || '../m3-w5-r1');
const roots = {m4, w6, r1};
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const files = {
  m4: ['rebuild/m4/workout/schema.cjs', 'rebuild/m4/spec/schema2-boundary.cjs'],
  w6: ['rebuild/m4/workout/schema.cjs', 'rebuild/m4/workout/commands.cjs',
    'rebuild/m4/workout/authority-profile.cjs', 'rebuild/m4/workout/capture.cjs',
    'rebuild/m3/w6/strict-json.mjs'],
  r1: ['rebuild/m4/workout/schema.cjs', 'rebuild/m4/workout/authority-profile.cjs',
    'rebuild/authority/validate.cjs', 'rebuild/m3/w5/reconciliation/codec.cjs',
    'rebuild/m3/w5/reconciliation/issuer.cjs', 'rebuild/m3/w5/source/codec.cjs'],
};
const pins = Object.fromEntries(Object.entries(files).map(([role, names]) => [role,
  Object.fromEntries(names.map(name => [name, sha(fs.readFileSync(path.join(roots[role], name)))]))]));
const heads = Object.fromEntries(Object.entries(roots).map(([role, root]) => [role,
  execFileSync('git', ['rev-parse', 'HEAD'], {cwd: root, encoding: 'utf8', windowsHide: true}).trim()]));
async function main() {
  const M = require(path.join(m4, 'rebuild/m4/workout/schema.cjs'));
  const R = require(path.join(r1, 'rebuild/m4/workout/schema.cjs'));
  const W = require(path.join(w6, 'rebuild/m4/workout/schema.cjs'));
  const RP = require(path.join(r1, 'rebuild/m4/workout/authority-profile.cjs'));
  const V = require(path.join(r1, 'rebuild/authority/validate.cjs'));
  const C = require(path.join(r1, 'rebuild/m3/w5/reconciliation/codec.cjs'));
  const Source = require(path.join(r1, 'rebuild/m3/w5/source/codec.cjs'));
  const {parseStrictJson} = await import(pathToFileURL(path.join(w6, 'rebuild/m3/w6/strict-json.mjs')).href);
  const capture = require(path.join(w6, 'rebuild/m4/workout/capture.cjs')).createPrescriptionCapture({parseStrictJson});
  const commands = require(path.join(w6, 'rebuild/m4/workout/commands.cjs')).createWorkoutCommands({prescriptionCapture: capture});
  const results = [], check = (name, work) => { const observed = work(); results.push({name, observed}); console.log('PASS ' + name); };
  const common = {op_id: 'synthetic-operation', athlete_id: 'synthetic-athlete', device_id: 'synthetic-device',
    device_seq: 1, device_predecessor_op_id: null, causal_parents: [], class: 'session',
    effective: {local_date: '2026-09-09', local_time: '12:00', utc_offset: '-04:00'},
    schema_version: 2, lease_id: 'synthetic-unissued', canonical_content_commitment: 'synthetic-not-a-signature'};
  const start = {...common, kind: 'session-start', planned_split_slot_id: 'AD_HOC', plan_basis: 'NO_ACCEPTED_PLAN', payload: {}};
  const unknown = () => ({state: 'unknown', display: 'Unknown synthetic instruction', source_json: null});
  const captured = {...start, prescription_capture: {profile: capture.profile,
    producer: {app_build: 'synthetic', engine_build: 'synthetic', rule_profile: 'synthetic', source_schema: 'synthetic'},
    basis: {plan_basis: start.plan_basis, input_basis: 'synthetic-unqualified-basis', source_revision: 1},
    session: {instruction: unknown(), reason: unknown(), confidence: unknown()},
    slots: [{logical_set_slot: 'slot-1', lift_lineage_id: 'lift-1', label: 'Synthetic lift',
      load: unknown(), reps: unknown(), effort: unknown(), setup: unknown(), reason: unknown(), confidence: unknown()}]}};
  const matrix = op => [M.validateWorkoutShape(op).valid, R.validateWorkoutShape(op).valid,
    W.validateWorkoutShape(op).valid, W.validateWorkoutShape(op, {prescriptionCapture: capture}).valid];
  const original = JSON.stringify([start, captured]);
  check('basic Start differs from configured captured Start', () => {
    const seen = matrix(start); assert.deepEqual(seen, [true, true, true, false]); return seen;
  });
  check('captured Start accepted only by capture-configured W6 shape', () => {
    const seen = matrix(captured); assert.deepEqual(seen, [false, false, false, true]); return seen;
  });
  check('actual W6 command retains capture and empty payload', () => {
    const {prescription_capture, planned_split_slot_id, plan_basis} = captured;
    const action = commands.prepare({action: 'start', input: {prescription_capture, planned_split_slot_id, plan_basis}});
    assert.equal(JSON.stringify(action.payload), '{}');
    assert.equal(JSON.stringify(action.extra.prescription_capture), JSON.stringify(prescription_capture));
    assert.equal(commands.validate(captured, () => undefined), true);
    return 'Shape/command only; producer, lease and basis are explicitly synthetic';
  });
  const set = {...common, kind: 'session-set', session_start_op_id: start.op_id,
    lift_lineage_id: 'lift-1', logical_set_slot: 'slot-1', payload: {load: {value: 42.5, unit: 'lb'}, reps: {value: 0, unit: 'rep'}, reserve: {tag: 'unknown'}}};
  check('existing numeric set component agrees across configurations', () => {
    const seen = matrix(set); assert.deepEqual(seen, [true, true, true, true]); return seen;
  });
  check('ordinary v2 reading has no complete-profile dispatch', () => {
    const reading = {...common, class: 'reading', kind: 'fact', payload: {lb: {value: 160, unit: 'lb'}}};
    const seen = {genericLegacyShape: V.validShape(reading), components: matrix(reading)};
    assert.equal(seen.genericLegacyShape, true); assert.deepEqual(seen.components, [false, false, false, false]); return seen;
  });
  check('legacy Start reference does not establish new basis or capture', () => {
    const legacy = {...common, schema_version: 1, kind: 'session-start', payload: {slot: 'legacy-slot'}};
    assert.equal(V.validShape(legacy), true);
    const relation = RP.createWorkoutProfile(R.validateWorkoutShape).validateRelations(set, () => legacy);
    assert.equal(relation, true); assert.equal(legacy.plan_basis, undefined); assert.equal(legacy.prescription_capture, undefined);
    return 'Existing typed relation passes; missing historical basis remains unknown';
  });
  check('real route codec preserves v1 request and refuses requested v2', () => {
    const request = {intent_id: 'synthetic-enroll', schema_version: 1, nonce: Buffer.alloc(32, 7).toString('base64url')};
    assert.equal(C.validateRouteRequest('/enrol/create', request), request);
    assert.throws(() => C.validateRouteRequest('/enrol/create', {...request, schema_version: 2}), {code: 'INVALID_R1_REQUEST'});
    return 'Request validation only; no D1 or enrollment invoked';
  });
  check('source activation intent also has an explicit original-schema boundary', () => {
    const op = {...common, schema_version: 1, class: 'event', kind: 'fact', payload: {
      type: 'source-import-intent', interval: {start: '2026-09-09', end: '2026-09-09'},
      source_id: 'synthetic-source', material_digest: 'synthetic-digest'}};
    assert.doesNotThrow(() => Source.intent(op, 'activate', 'synthetic-source', 'synthetic-digest'));
    assert.throws(() => Source.intent({...op, schema_version: 2}, 'activate', 'synthetic-source', 'synthetic-digest'), {code: 'SOURCE_INTENT'});
    return 'Intent subvalidator only; no material, authentication or activation supplied';
  });
  check('original synthetic inputs and all consumed sources unchanged', () => {
    assert.equal(JSON.stringify([start, captured]), original);
    for (const [role, list] of Object.entries(pins)) for (const [name, hash] of Object.entries(list))
      assert.equal(sha(fs.readFileSync(path.join(roots[role], name))), hash, role + '/' + name);
    return true;
  });
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-schema2-boundary-'));
  const artifact = path.join(output, 'evidence.json');
  fs.writeFileSync(artifact, JSON.stringify({profile: 'earned/schema2-existing-boundary/v1', roots, heads, pins,
    matrixOrder: ['M4 basic', 'R1 basic', 'W6 basic', 'W6 captured'], results,
    limits: 'Synthetic read-only shapes/commands/route validation. No signatures, real issuance, admission, recovery, activation, resource or scientific qualification.'}, null, 2) + '\n');
  console.log('SCHEMA2 EXISTING BOUNDARY ' + results.length + ' PASS\n' + artifact + '\nSHA256 ' + sha(fs.readFileSync(artifact)));
}
main().catch(error => {console.error(error); process.exitCode = 1;});
