'use strict';
// Uses actual retained core and P-256 boundary, never a model of admission.
const assert = require('node:assert/strict');
const path = require('node:path'), fs = require('node:fs'), os = require('node:os');
const {randomBytes} = require('node:crypto');
const root = path.resolve(__dirname, '../../../..');
const publicRoot = root;
const {buildCore} = require(path.join(root, 'rebuild/m3/w5/build.cjs'));
const crypto = require(path.join(root, 'rebuild/m3/w5/crypto.cjs'));
const Ops = require(path.join(root, 'rebuild/client/ops.cjs'));
const {validateWorkoutShape} = require(path.join(publicRoot, 'rebuild/m4/workout/schema.cjs'));
const {createWorkoutProfile} = require(path.join(root,'rebuild/m4/workout/authority-profile.cjs'));
const profile = createWorkoutProfile(validateWorkoutShape);
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'earned-workout-admission-'));
let passed = 0, failed = 0, core;
function check(name, body) {
  try { body(); passed++; console.log('PASS ' + name); }
  catch (error) { failed++; console.log('FAIL ' + name + ': ' + (error.code || error.name)); }
}
function fixture(selectedProfile = profile) {
  const key = crypto.generateSigningKey('synthetic-workout'), identityKey = randomBytes(32).toString('hex');
  const backend = core.memoryBackend();
  const leases = new Map();
  const athletes = {};
  for (const athlete of ['athlete-A', 'athlete-B']) {
    const devices = {};
    for (const device of ['device-A', 'device-B']) {
      const make = version => crypto.signLease({lease_id: athlete + '-' + device + '-v' + version,
        athlete_id: athlete, device_id: device, schema_version: version, range: [1, 500],
        not_before: '2026-09-01T00:00:00.000Z', not_after: '2026-10-01T00:00:00.000Z'}, key);
      // Explicit synthetic setup, not issuance or full R1 registry evidence.
      const old = make(2), current = make(1);
      leases.set(old.lease_id, old); leases.set(current.lease_id, current);
      devices[device] = {lease: current};
    }
    athletes[athlete] = {devices, plan: {}};
  }
  const config = {backend, authorityKey: key, identityKeys: () => identityKey,
    clock: () => '2026-11-01T00:00:00.000Z', athletes,
    resolveIssuedLease: (tx, athlete, device, id) => {
      const lease = leases.get(id);
      return lease?.athlete_id === athlete && lease.device_id === device ? lease : undefined;
    }};
  if (selectedProfile !== undefined && selectedProfile !== null) config.workoutProfile = selectedProfile;
  const authority = core.createAuthority(config);
  let serial = 0;
  function op(kind, options = {}) {
    const athlete = options.athlete || 'athlete-A', device = options.device || 'device-A';
    const version = options.version ?? 2, seq = options.seq || ++serial;
    const extra = kind === 'session-start' ? {planned_split_slot_id: 'AD_HOC', plan_basis: 'NO_ACCEPTED_PLAN'}
      : kind === 'session-close' ? {session_start_op_id: options.start || 'start'}
      : kind === 'correction' || kind === 'tombstone' ? {lift_lineage_id: options.lineage || 'lift-A'}
      : {session_start_op_id: options.start || 'start', logical_set_slot: 'slot-' + seq,
        lift_lineage_id: options.lineage || 'lift-A', ...(kind === 'session-skip' ? {skip_scope:'set'} : {})};
    const payload = kind === 'session-start' ? {} : kind === 'session-close' ? {completion_kind: 'normal'}
      : kind === 'correction' ? {replacement_fields: {reps: {value: 7, unit: 'rep'}}}
      : kind === 'tombstone' || kind === 'session-skip' ? {reason: 'synthetic correction'}
      : {load: {value: 40, unit: 'lb'}, reps: {value: 8, unit: 'rep'}};
    return Ops.build({op_id: options.id || kind + '-' + seq, athlete_id: athlete, device_id: device,
      device_seq: seq, predecessor: options.predecessor ?? null, parents: options.parents || [],
      class: 'session', kind, schema_version: version, lease_id: athlete + '-' + device + '-v' + version,
      effective: {local_date: '2026-09-03', local_time: '12:00', utc_offset: '-04:00'},
      payload: options.payload || payload, target: ['correction', 'tombstone'].includes(kind) ? options.target || 'set' : undefined,
      extra: {...extra, ...options.extra}}, identityKey);
  }
  return {authority, backend, op, key, identityKey, leases,
    admit: operation => authority.admit(operation.athlete_id, operation),
    resign: operation => {operation.canonical_content_commitment = Ops.commitmentOf(operation, identityKey); return operation;}};
}
async function main() {
  const option = process.argv.indexOf('--authority-root');
  const output = await buildCore({outfile: path.join(scratch, 'core.cjs'), ...(option < 0 ? {} : {authorityRoot:path.resolve(process.argv[option+1])})});
  core = require(output);
  check('nested-edit-dependency-waits-and-drains-through-real-admission',()=>{
    const f=fixture(),start=f.op('session-start',{id:'start'}),set=f.op('session-set',{id:'set'});
    const edit=f.op('correction',{id:'first-edit',target:'set'}),nested=f.op('correction',{target:'first-edit',payload:{replacement_fields:{replacement_fields:{load:{value:45,unit:'lb'}}}}});
    for(const op of [nested,edit,set])assert.equal(f.admit(op).status,'WAITING');
    assert.equal(f.admit(start).status,'ACCEPTED');
    for(const op of [set,edit,nested])assert.equal(f.admit(op).status,'ACCEPTED');
    assert.equal(f.authority.frontier('athlete-A'),4);assert.deepEqual(f.admit(nested),f.admit(nested));
  });
  check('Start-and-Close-replacements-require-no-fictitious-lift',()=>{
    const f=fixture(),start=f.op('session-start',{id:'start'}),close=f.op('session-close',{id:'close'});
    assert.equal(f.admit(start).status,'ACCEPTED');assert.equal(f.admit(close).status,'ACCEPTED');
    for(const [target,fields]of [['start',{effective:{local_date:'2026-09-02',local_time:'23:45',utc_offset:'-04:00'},planned_split_slot_id:'corrected'}],['close',{completion_kind:'early'}]]){
      const op=f.op('correction',{target,payload:{replacement_fields:fields}});delete op.lift_lineage_id;f.resign(op);assert.equal(f.admit(op).status,'ACCEPTED');
      const wrong=f.op('correction',{target,payload:{replacement_fields:fields}});assert.equal(f.admit(wrong).rejection_code,'MALFORMED');
    }
  });
  check('replacement-clear-does-not-relax-recorded-reserve-or-required-reason',()=>{
    const f=fixture();assert.equal(f.admit(f.op('session-start',{id:'start'})).status,'ACCEPTED');
    assert.equal(f.admit(f.op('session-set',{id:'set'})).status,'ACCEPTED');
    assert.equal(f.admit(f.op('correction',{payload:{replacement_fields:{reserve:{clear:true}}}})).status,'ACCEPTED');
    assert.equal(f.admit(f.op('session-set',{payload:{load:{value:40,unit:'lb'},reps:{value:8,unit:'rep'},reserve:{clear:true}}})).rejection_code,'MALFORMED');
    assert.equal(f.admit(f.op('tombstone',{id:'removed'})).status,'ACCEPTED');
    assert.equal(f.admit(f.op('correction',{target:'removed',payload:{replacement_fields:{reason:{clear:true}}}})).rejection_code,'MALFORMED');
  });
  check('effective-domain-and-own-edit-class-enforced-at-admission',()=>{
    const f=fixture();assert.equal(f.admit(f.op('session-start',{id:'start'})).status,'ACCEPTED');assert.equal(f.admit(f.op('session-set',{id:'set'})).status,'ACCEPTED');
    const time=f.op('correction');time.effective.local_time='25:99';f.resign(time);assert.equal(f.admit(time).rejection_code,'MALFORMED');
    const date=f.op('correction',{payload:{replacement_fields:{effective:{local_date:'2026-02-30',local_time:'12:00',utc_offset:'-04:00'}}}});assert.equal(f.admit(date).rejection_code,'MALFORMED');
    const wrong=f.op('correction');wrong.class='reading';f.resign(wrong);assert.equal(f.admit(wrong).rejection_code,'MALFORMED');
  });
  check('Skip-scope-and-target-specific-fields-use-actual-reference',()=>{
    const f=fixture();assert.equal(f.admit(f.op('session-start',{id:'start'})).status,'ACCEPTED');assert.equal(f.admit(f.op('session-skip',{id:'skip'})).status,'ACCEPTED');
    assert.equal(f.admit(f.op('correction',{target:'skip',payload:{replacement_fields:{skip_scope:'lift',logical_set_slot:{clear:true}}}})).status,'ACCEPTED');
    assert.equal(f.admit(f.op('correction',{target:'skip',payload:{replacement_fields:{load:{value:40,unit:'lb'}}}})).rejection_code,'MALFORMED');
    const wrong=f.op('correction',{target:'skip',lineage:'wrong'});assert.equal(f.admit(wrong).rejection_code,'MALFORMED');
  });
  check('all-six-basic-kinds-pass-actual-admission', () => {
    const f=fixture();
    for(const [kind,id] of [['session-start','start'],['session-set','set'],['session-skip','skip'],
      ['correction','edit'],['tombstone','remove'],['session-close','close']]) {
      const op=f.op(kind,{id}); assert.equal(f.admit(op).status,'ACCEPTED');
    }
    assert.equal(f.authority.frontier('athlete-A'),6);
  });
  check('declared-start-waits-and-drains-once', () => {
    const f = fixture(), start = f.op('session-start', {id: 'start'}), set = f.op('session-set', {id: 'set'});
    const original = JSON.stringify(set);
    assert.equal(f.admit(set).status, 'WAITING');
    assert.equal(f.authority.frontier('athlete-A'), 0);
    assert.equal(f.admit(start).status, 'ACCEPTED');
    const terminal = f.admit(set); assert.equal(terminal.status, 'ACCEPTED');
    assert.deepEqual(f.admit(set), terminal); assert.equal(f.authority.frontier('athlete-A'), 2);
    assert.equal(JSON.stringify(set), original); assert(crypto.verifyDisposition(terminal, f.key));
    assert.deepEqual(f.authority.dispositionHistory('athlete-A', set.device_id, set.device_seq).map(x => x.status), ['WAITING', 'ACCEPTED']);
  });
  check('accepted-wrong-kind-start-refused', () => {
    const f = fixture(), other = f.op('session-set', {id: 'wrong-start', version: 1});
    assert.equal(f.admit(other).status, 'ACCEPTED');
    const d = f.admit(f.op('session-set', {start: other.op_id}));
    assert.equal(d.rejection_code, 'MALFORMED'); assert.equal(f.authority.frontier('athlete-A'), 1);
  });
  check('known-foreign-start-refused', () => {
    const f = fixture(), start = f.op('session-start', {id: 'foreign', athlete: 'athlete-B'});
    assert.equal(f.admit(start).status, 'ACCEPTED');
    assert.equal(f.admit(f.op('session-set', {start: start.op_id})).rejection_code, 'CROSS_ATHLETE_REFERENCE');
  });
  check('rejected-start-terminal-dependency', () => {
    const f = fixture(), start = f.op('session-start', {id: 'start'});
    start.canonical_content_commitment = 'wrong'; assert.equal(f.admit(start).status, 'REJECTED');
    const set = f.op('session-set'), d = f.admit(set);
    assert.equal(d.status, 'REJECTED_DEPENDENCY'); assert.deepEqual(f.admit(set), d);
  });
  check('second-device-start-and-correction', () => {
    const f = fixture(), start = f.op('session-start', {id: 'start', device: 'device-B'});
    assert.equal(f.admit(start).status, 'ACCEPTED');
    const set = f.op('session-set', {id: 'set'}); assert.equal(f.admit(set).status, 'ACCEPTED');
    const edit = f.op('correction', {device: 'device-B'}); assert.equal(f.admit(edit).status, 'ACCEPTED');
    assert.equal(f.admit(f.op('correction', {lineage: 'different'})).rejection_code, 'MALFORMED');
  });
  check('malformed-new-payload-refused-old-replay-unchanged', () => {
    const f = fixture(), old = f.op('session-set', {id: 'old', version: 1, payload: {}});
    const bytes = JSON.stringify(old), disposition = f.admit(old); assert.equal(disposition.status, 'ACCEPTED');
    const bad = f.op('session-set', {payload: {load: {value: 40, unit: 'lb'}}});
    assert.equal(f.admit(bad).rejection_code, 'MALFORMED');
    assert.deepEqual(f.admit(old), disposition); assert.equal(JSON.stringify(old), bytes);
  });
  check('transport-predecessor-never-required-parent', () => {
    const f = fixture(), start = f.op('session-start', {id: 'start', predecessor: 'never-arrived'});
    assert.equal(f.admit(start).status, 'ACCEPTED');
    const set = f.op('session-set', {predecessor: 'unrelated-rejected'});
    assert.equal(f.admit(set).status, 'ACCEPTED');
  });
  check('waiting-start-stays-waiting-then-rejected-chain-drains', () => {
    const f = fixture(), start = f.op('session-start', {id: 'start', parents: ['ancestor']}), set = f.op('session-set');
    assert.equal(f.admit(start).status, 'WAITING'); assert.equal(f.admit(set).status, 'WAITING');
    const ancestor = f.op('session-start', {id: 'ancestor'}); ancestor.canonical_content_commitment = 'invalid';
    assert.equal(f.admit(ancestor).status, 'REJECTED');
    assert.equal(f.admit(start).status, 'REJECTED_DEPENDENCY'); assert.equal(f.admit(set).status, 'REJECTED_DEPENDENCY');
    assert.equal(f.authority.frontier('athlete-A'), 0);
  });
  check('transitive-parents-no-direct-start-requirement', () => {
    const f = fixture(), start = f.op('session-start', {id: 'start'});
    const prior = f.op('session-set', {id: 'prior', parents: ['start']});
    const next = f.op('session-set', {parents: ['prior']});
    for (const op of [start, prior, next]) assert.equal(f.admit(op).status, 'ACCEPTED');
    assert.deepEqual(next.causal_parents, ['prior']);
  });
  check('commit-failure-has-no-partial-rows-and-retry-uses-same-op', () => {
    const f = fixture(), start = f.op('session-start', {id: 'start'}), before = f.backend.snapshot();
    const commit = f.backend.commit; f.backend.commit = () => {throw Error('synthetic disk refusal');};
    assert.equal(f.admit(start).status, 'UNAVAILABLE'); assert.deepEqual(f.backend.snapshot(), before);
    f.backend.commit = commit;
    const accepted = f.admit(start); assert.equal(accepted.status, 'ACCEPTED'); assert.deepEqual(f.admit(start), accepted);
    assert.equal(f.authority.frontier('athlete-A'), 1);
  });
  check('terminal-replay-does-not-reevaluate-broken-profile', () => {
    let broken = false;
    const f = fixture({...profile, validateShape(op) {if (broken) throw Error('test outage'); return profile.validateShape(op);}});
    const start = f.op('session-start'), accepted = f.admit(start); assert.equal(accepted.status, 'ACCEPTED');
    broken = true; assert.deepEqual(f.admit(start), accepted);
  });
  check('declared-v2-granted-v1-still-terminal-malformed-with-no-profile', () => {
    const f = fixture(null), op = f.op('session-start');
    op.lease_id = 'athlete-A-device-A-v1'; f.resign(op);
    const d = f.admit(op); assert.equal(d.status, 'REJECTED'); assert.equal(d.rejection_code, 'MALFORMED');
    assert.deepEqual(f.admit(op), d); assert.equal(f.authority.dispositionHistory('athlete-A',op.device_id,op.device_seq).length,1);
  });
  check('range-refusal-precedes-new-shape', () => {
    const f = fixture(), bad = f.op('session-set', {seq:501,payload:{}});
    assert.equal(f.admit(bad).rejection_code,'DEVICE_SEQ_OUT_OF_RANGE');
  });
  check('revocation-refusal-precedes-new-shape', () => {
    const f = fixture(); f.authority.revokeDevice('athlete-A','device-A');
    assert.equal(f.admit(f.op('session-set',{payload:{}})).rejection_code,'LEASE_REVOKED_BEYOND_BARRIER');
  });
  check('slot-reuse-refusal-precedes-new-shape', () => {
    const f = fixture(), old = f.op('session-set',{id:'occupied',seq:1,version:1,payload:{}});
    assert.equal(f.admit(old).status,'ACCEPTED');
    assert.equal(f.admit(f.op('session-set',{id:'other',seq:1,payload:{}})).rejection_code,'DEVICE_SEQ_REUSE');
  });
  check('workout-only-v2-refuses-reading-v1-reading-still-works', () => {
    const f = fixture();
    for (const version of [1,2]) {
      const op = f.op('session-start',{version});
      op.kind='fact'; op.class='reading'; op.payload={lb:{value:160,unit:'lb'}};
      delete op.planned_split_slot_id; delete op.plan_basis; f.resign(op);
      const result=f.admit(op); assert.equal(result.status,version===1?'ACCEPTED':'REJECTED');
      if(version===2)assert.equal(result.rejection_code,'MALFORMED');
      assert.deepEqual(f.admit(op),result);
    }
  });
  check('existing-parent-error-precedes-profile-reference-error', () => {
    const f=fixture(), rejected=f.op('session-start',{id:'rejected'}), foreign=f.op('session-start',{id:'foreign',athlete:'athlete-B'});
    rejected.canonical_content_commitment='bad'; assert.equal(f.admit(rejected).status,'REJECTED');
    assert.equal(f.admit(foreign).status,'ACCEPTED');
    assert.equal(f.admit(f.op('session-set',{start:'foreign',parents:['rejected']})).status,'REJECTED_DEPENDENCY');
    assert.equal(f.admit(f.op('session-set',{start:'rejected',parents:['foreign']})).rejection_code,'CROSS_ATHLETE_REFERENCE');
  });
  check('existing-target-error-precedes-additional-profile-reference-error',()=>{
    const f=fixture({...profile,references:op=>op.kind==='correction'?['foreign']:profile.references(op)});
    const rejected=f.op('session-start',{id:'rejected'}); rejected.canonical_content_commitment='bad';
    assert.equal(f.admit(rejected).status,'REJECTED');
    assert.equal(f.admit(f.op('session-start',{id:'foreign',athlete:'athlete-B'})).status,'ACCEPTED');
    assert.equal(f.admit(f.op('correction',{target:'rejected'})).status,'REJECTED_DEPENDENCY');
  });
  check('waiting-reconsideration-profile-failure-retains-exact-waiting-rows',()=>{
    let broken=false;
    const f=fixture({...profile,validateShape(op){if(broken){const e=Error('synthetic');e.rejectionCode='BAD';throw e;}return profile.validateShape(op);}});
    const set=f.op('session-set'); assert.equal(f.admit(set).status,'WAITING');
    const before=f.backend.snapshot();broken=true;
    assert.equal(f.admit(set).status,'UNAVAILABLE');assert.deepEqual(f.backend.snapshot(),before);
  });
  for(const method of ['validateShape','references','validateRelations']) check('tagged-'+method+'-error-cannot-forge-terminal-rejection',()=>{
    const bad={...profile,[method]:()=>{const error=Error('synthetic dependency failure'); error.rejectionCode='SYNTHETIC_FORGED'; throw error;}};
    const f=fixture(bad), before=f.backend.snapshot(), result=f.admit(f.op('session-start'));
    assert.equal(result.status,'UNAVAILABLE'); assert.deepEqual(f.backend.snapshot(),before);
  });
  for (const [name, broken] of [
    ['absent', null], ['shape-promise', {...profile, validateShape: () => Promise.resolve(true)}],
    ['shape-nonboolean', {...profile, validateShape: () => ({valid: true})}],
    ['shape-throws', {...profile, validateShape: () => {throw Error('test');}}],
    ['shape-rejected-promise', {...profile, validateShape: () => Promise.reject(Error('synthetic rejected profile'))}],
    ['refs-promise', {...profile, references: () => Promise.resolve([])}],
    ['refs-invalid', {...profile, references: () => ['']}],
    ['refs-sparse', {...profile, references: () => Array(1)}],
    ['refs-throws', {...profile, references: () => {throw Error('test');}}],
    ['relations-promise', {...profile, validateRelations: () => Promise.resolve(true)}],
    ['relations-throws', {...profile, validateRelations: () => {throw Error('test');}}],
  ]) check('profile-' + name + '-unavailable-no-rows', () => {
    const f = fixture(broken), start = f.op('session-start');
    const before = f.backend.snapshot(); assert.equal(f.admit(start).status, 'UNAVAILABLE');
    assert.deepEqual(f.backend.snapshot(), before);
  });
  console.log(`WORKOUT ACTUAL CORE ${failed ? 'FAIL' : 'PASS'} — ${passed}/${passed + failed}; synthetic capabilities, NOT ACTIVATED`);
  process.exitCode = failed ? 1 : 0;
}
main().catch(error => {console.error('HARNESS ERROR ' + (error.code || error.name)); process.exitCode = 2;});
