'use strict';
const assert = require('node:assert/strict'), crypto = require('node:crypto');
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), cp = require('node:child_process');
const root = path.resolve(__dirname, '../../../..'), base = '66658ccc01b80633fb742b97f56ba41997b9d250';
const sourceFiles = ['rebuild/client/ops.cjs', 'rebuild/client/canonical.cjs',
  'rebuild/authority/validate.cjs', 'rebuild/authority/canonical.cjs', 'rebuild/authority/crypto.cjs'];
for (const file of sourceFiles) {
  const source = cp.spawnSync('git', ['show', base + ':' + file], {cwd: root, windowsHide: true, maxBuffer: 8e6});
  assert.equal(source.status, 0, 'Source base unavailable');
  assert(fs.readFileSync(path.join(root, file)).equals(source.stdout), 'Actual source pin changed: ' + file);
}
const option = process.argv.indexOf('--candidate');
const originalModule = path.join(__dirname, '../schema.cjs');
const candidate = option < 0 ? originalModule : path.resolve(process.argv[option + 1]);
const {validateWorkoutShape: validate} = require(candidate);
const Ops = require(path.join(root, sourceFiles[0])), ClientCanonical = require(path.join(root, sourceFiles[1]));
const Authority = require(path.join(root, sourceFiles[2])), AuthorityCanonical = require(path.join(root, sourceFiles[3]));
const AuthorityCrypto = require(path.join(root, sourceFiles[4]));
const identityKey = crypto.randomBytes(32).toString('hex'); // ephemeral, never printed or written.
const clone = structuredClone, quantity = (value, unit) => ({value, unit});
const load = value => quantity(value, 'lb'), reps = value => quantity(value, 'rep');
const reserveValues = [undefined, ...[0, 1, 2].map(value => ({tag: 'exact', value, unit: 'rep'})),
  {tag: 'at_least', value: 3, unit: 'rep'}, ...['unknown', 'skipped', 'not_asked'].map(tag => ({tag}))];
function make(kind, payload, extra = {}) {
  const fields = {
    'session-start': {planned_split_slot_id: 'AD_HOC', plan_basis: 'NO_ACCEPTED_PLAN'},
    'session-set': {session_start_op_id: 'start-A', logical_set_slot: 'slot-A', lift_lineage_id: 'lift-A'},
    'session-skip': {session_start_op_id: 'start-A', lift_lineage_id: 'lift-A', skip_scope: 'lift'},
    'session-close': {session_start_op_id: 'start-A'},
    correction: {lift_lineage_id: 'lift-A'}, tombstone: {lift_lineage_id: 'lift-A'},
  };
  return Ops.build({op_id: 'synthetic-operation', athlete_id: 'synthetic-athlete', device_id: 'synthetic-device',
    device_seq: 1, predecessor: null, parents: [], class: 'session', kind,
    effective: {local_date: '2026-09-03', local_time: '12:00', utc_offset: '-04:00'},
    schema_version: 2, lease_id: 'synthetic-lease', payload,
    target: ['correction', 'tombstone'].includes(kind) ? 'set-A' : undefined,
    extra: {...fields[kind], ...extra}}, identityKey);
}
const set = () => make('session-set', {load: load(40), reps: reps(8)});
let checks = 0, failures = 0, byteChecks = 0, shapeDifferences = 0;
function check(name, run) {
  checks++;
  try { run(); } catch (error) {
    failures++; console.error('FAIL ' + name + ': ' + (error.code || error.name));
  }
}
function expect(name, input, valid, references) {
  check(name, () => {
    // Malformed but JSON-shaped negative cases get authentic commitments too;
    // no invalid-signature shortcut is used to establish shape refusal.
    input.canonical_content_commitment = Ops.commitmentOf(input, identityKey);
    const bytes = JSON.stringify(input), before = clone(input), old = Authority.validShape(input);
    assert.equal(AuthorityCrypto.commitmentOf(input, identityKey), input.canonical_content_commitment);
    assert.equal(ClientCanonical.encode(input), AuthorityCanonical.canonicalEncode(input));
    const result = validate(input);
    assert.equal(result.valid, valid);
    assert.deepEqual(result.references, valid ? references : []);
    assert.equal(result.errors.length, valid ? 0 : 1);
    assert.deepEqual(input, before); assert.equal(JSON.stringify(input), bytes);
    assert.equal(Authority.validShape(input), old);
    byteChecks++; if (old !== valid) shapeDifferences++;
  });
}
for (const [name, extra] of [['ad-hoc', {}], ['planned', {planned_split_slot_id: 'slot-plan', plan_basis: 'basis-A'}]])
  expect('start/' + name, make('session-start', {}, extra), true, []);
for (let i = 0; i < reserveValues.length; i++) {
  const payload = {load: load(40), reps: reps(8)};
  if (reserveValues[i] !== undefined) payload.reserve = clone(reserveValues[i]);
  expect('reserve/' + i, make('session-set', payload), true, ['start-A']);
}
for (const value of [0, 1, Number.MAX_SAFE_INTEGER]) expect('reps/' + value, make('session-set', {load: load(0.5), reps: reps(value)}), true, ['start-A']);
expect('skip/lift', make('session-skip', {}), true, ['start-A']);
expect('skip/set', make('session-skip', {reason: 'synthetic reason'}, {skip_scope: 'set', logical_set_slot: 'slot-A'}), true, ['start-A']);
for (const completion_kind of ['normal', 'early']) expect('close/' + completion_kind, make('session-close', {completion_kind}), true, ['start-A']);
for (let mask = 1; mask < 8; mask++) {
  const all = {load: load(35), reps: reps(9), reserve: {tag: 'unknown'}}, replacement_fields = {};
  Object.keys(all).forEach((key, i) => { if (mask & (1 << i)) replacement_fields[key] = all[key]; });
  expect('correction/subset-' + mask, make('correction', {replacement_fields}), true, ['set-A']);
}
expect('tombstone/set', make('tombstone', {reason: 'synthetic mistaken entry'}), true, ['set-A']);
function reject(name, change, initial = set()) { change(initial); expect('reject/' + name, initial, false, []); }
reject('missing-reps', op => { delete op.payload.reps; });
reject('missing-load', op => { delete op.payload.load; });
reject('zero-load', op => { op.payload.load.value = 0; });
reject('negative-load', op => { op.payload.load.value = -1; });
reject('negative-zero-reps', op => { op.payload.reps = JSON.parse('{"value":-0,"unit":"rep"}'); });
reject('negative-zero-reserve', op => { op.payload.reserve = JSON.parse('{"tag":"exact","value":-0,"unit":"rep"}'); });
reject('negative-zero-load', op => { op.payload.load = JSON.parse('{"value":-0,"unit":"lb"}'); });
reject('wrong-load-unit', op => { op.payload.load.unit = 'kg'; });
reject('string-load', op => { op.payload.load.value = '40'; });
reject('extra-quantity-field', op => { op.payload.load.estimated = true; });
for (const value of [-1, 1.5, Number.MAX_SAFE_INTEGER + 1, '8', null]) reject('reps-domain/' + String(value), op => { op.payload.reps.value = value; });
for (const field of ['session_start_op_id', 'logical_set_slot', 'lift_lineage_id']) {
  reject('missing-' + field, op => { delete op[field]; });
  reject('blank-' + field, op => { op[field] = '  '; });
}
for (const reserve of [null, {tag: 'exact', value: 3, unit: 'rep'}, {tag: 'at_least', value: 4, unit: 'rep'},
  {tag: 'unknown', value: 0}, {tag: 'exact', value: 0}, {tag: 'skipped', reason: 'extra'}, {tag: 'other'}])
  reject('reserve-domain/' + JSON.stringify(reserve), op => { op.payload.reserve = reserve; });
reject('start-payload-alias', () => {}, make('session-start', {slot: 'AD_HOC'}));
reject('start-payload-capture', () => {}, make('session-start', {capture: {}}));
reject('missing-basis', op => { delete op.plan_basis; }, make('session-start', {}));
reject('missing-planned-slot', op => { delete op.planned_split_slot_id; }, make('session-start', {}));
reject('set-target-field', op => { op.target_op_id = 'unexpected'; });
reject('legacy-payload-alias', op => { op.payload.session_start_id = op.session_start_op_id; delete op.session_start_op_id; });
reject('unknown-envelope-field', op => { op.hidden = true; });
reject('missing-common-lease', op => { delete op.lease_id; });
reject('duplicate-parent', op => { op.causal_parents = ['x', 'x']; });
reject('wrong-offset-shape', op => { op.effective.utc_offset = 'UTC'; });
reject('empty-effective-date', op => { op.effective.local_date = ''; });
reject('zero-sequence', op => { op.device_seq = 0; });
reject('wrong-class', op => { op.class = 'reading'; });
reject('wrong-version', op => { op.schema_version = 1; });
reject('unknown-kind', op => { op.kind = 'future-kind'; });
reject('non-string-kind', op => { op.kind = {}; });
reject('skip-set-no-slot', () => {}, make('session-skip', {}, {skip_scope: 'set'}));
reject('skip-lift-with-slot', () => {}, make('session-skip', {}, {logical_set_slot: 'unexpected'}));
reject('skip-unknown-scope', () => {}, make('session-skip', {}, {skip_scope: 'all'}));
reject('skip-load', () => {}, make('session-skip', {load: load(40)}));
reject('empty-skip-reason', () => {}, make('session-skip', {reason: ''}));
reject('close-no-kind', () => {}, make('session-close', {}));
reject('close-legacy-flag', () => {}, make('session-close', {closed: quantity(1, 'flag')}));
reject('close-set-slot', () => {}, make('session-close', {completion_kind: 'normal'}, {logical_set_slot: 'unexpected'}));
reject('empty-correction', () => {}, make('correction', {replacement_fields: {}}));
reject('clear-reserve', () => {}, make('correction', {replacement_fields: {reserve: null}}));
reject('effective-time-correction', () => {}, make('correction', {replacement_fields: {effective: {local_date: '2026-09-04'}}}));
reject('tombstone-no-reason', () => {}, make('tombstone', {}));
check('legacy-v1-is-not-reinterpreted', () => {
  const old = make('session-start', {slot: 'AD_HOC'}); old.schema_version = 1;
  delete old.planned_split_slot_id; delete old.plan_basis;
  old.canonical_content_commitment = Ops.commitmentOf(old, identityKey);
  const bytes = JSON.stringify(old); assert.equal(Authority.validShape(old), true);
  assert.deepEqual(validate(old), {valid: false, errors: ['UNSUPPORTED_PROFILE'], references: []});
  assert.equal(JSON.stringify(old), bytes); assert.equal(Authority.validShape(old), true);
});
check('references-are-not-relationship-proof', () => {
  const op = set(); op.device_id = 'another-synthetic-device'; op.causal_parents = [];
  assert.deepEqual(validate(op).references, ['start-A']); // No direct-parent or same-device rule invented.
  const first = validate(op); first.references[0] = 'changed'; first.errors.push('changed');
  assert.deepEqual(validate(op), {valid: true, errors: [], references: ['start-A']});
});
check('null-prototype-and-shared-json-values', () => {
  const op = set(), copy = Object.assign(Object.create(null), op);
  copy.payload = Object.assign(Object.create(null), op.payload);
  assert.equal(validate(copy).valid, true);
  const q = reps(2); copy.payload.reps = q; copy.payload.reserve = {tag: 'exact', ...q};
  assert.equal(validate(copy).valid, true);
  copy.extraA = q; copy.extraB = q;
  // Shared object identity is valid JSON data; these extra envelope fields are
  // rejected at FIELDS, not falsely reported as a cycle at JSON_SHAPE.
  assert.deepEqual(validate(copy).errors, ['INVALID_FIELDS']);
});
check('json-shape-and-no-getter-execution', () => {
  let calls = 0;
  const bad = [undefined, NaN, Infinity, 1n, () => {}, new Date(), new Map(), /x/];
  for (const value of bad) { const op = set(); op.extra = value; assert.deepEqual(validate(op).errors, ['INVALID_JSON_SHAPE']); }
  for (const install of [
    op => Object.defineProperty(op.payload, 'reps', {enumerable: true, get() { calls++; throw Error('getter'); }}),
    op => Object.defineProperty(op, 'hidden', {value: true}),
    op => { op[Symbol('hidden')] = true; },
    op => { op.payload = Object.create({load: load(40)}); },
    op => { op.causal_parents = new Array(2); },
    op => { op.causal_parents.extra = 'x'; },
    op => { op.payload.cycle = op; },
  ]) { const op = set(); install(op); assert.deepEqual(validate(op).errors, ['INVALID_JSON_SHAPE']); }
  assert.equal(calls, 0);
});
check('diagnostic-precedence', () => {
  const op = set(); op.schema_version = 99; op.device_seq = 0; delete op.session_start_op_id; op.payload = null;
  Object.defineProperty(op, 'bad', {enumerable: true, configurable: true, get() { throw Error('must not run'); }});
  assert.deepEqual(validate(op).errors, ['INVALID_JSON_SHAPE']); delete op.bad;
  assert.deepEqual(validate(op).errors, ['UNSUPPORTED_PROFILE']); op.schema_version = 2;
  assert.deepEqual(validate(op).errors, ['INVALID_COMMON']); op.device_seq = 1;
  assert.deepEqual(validate(op).errors, ['INVALID_FIELDS']); op.session_start_op_id = 'start-A';
  assert.deepEqual(validate(op).errors, ['INVALID_PAYLOAD']);
});
console.log(`WORKOUT BASIC SHAPE ${failures ? 'FAIL' : 'PASS'} — ${checks - failures}/${checks} checks; ${byteChecks} actual primitive/unchanged-byte controls; ${shapeDifferences} shape differences (not all defect rulings); NOT ACTIVATED`);
if (failures) process.exit(1);
if (process.argv.includes('--bite')) {
  assert.equal(option, -1, '--bite cannot be combined with --candidate');
  const before = fs.readFileSync(originalModule), hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-workout-shape-')), file = path.join(dir, 'schema.cjs');
  const needle = "return keys(payload, ['load', 'reps'], ['reserve'])";
  assert.equal(before.toString().split(needle).length, 2, 'Effective fault site changed');
  fs.writeFileSync(file, before.toString().replace(needle, "return !own(payload, 'reps') || keys(payload, ['load', 'reps'], ['reserve'])"));
  const run = () => cp.spawnSync(process.execPath, [__filename, '--candidate', file], {cwd: root, windowsHide: true, encoding: 'utf8', maxBuffer: 8e6});
  const broken = run(), output = broken.stdout + broken.stderr;
  assert.equal(broken.status, 1, 'Fault did not fail'); assert.match(output, /FAIL reject\/missing-reps:/);
  console.log('WORKOUT BASIC SHAPE BITE EFFECTIVE — FAIL reject/missing-reps; native1');
  fs.writeFileSync(file, before); assert.equal(hash(fs.readFileSync(file)), hash(before));
  const restored = run(); assert.equal(restored.status, 0, 'Restored copy failed');
  assert(fs.readFileSync(originalModule).equals(before), 'Original module changed');
  console.log('WORKOUT BASIC SHAPE RESTORED PASS — sha256 ' + hash(before));
}
