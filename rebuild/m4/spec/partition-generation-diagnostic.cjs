'use strict';
// Actual unchanged T2 boundary; synthetic in-memory incoming start/plan views.
// No generation mutator, authority-admission claim, engine, browser or private input.
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const crypto = require('node:crypto'), {spawnSync} = require('node:child_process');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const copy = x => JSON.parse(JSON.stringify(x));
const args = process.argv.slice(2), childMode = args[0] === '--child';
const repo = path.resolve((childMode ? args[1] : args[0]) || path.join(__dirname, '../../..'));
const pinFile = path.join(__dirname, 'partition-generation-pins.json');
let phase = 'source-pins';
function load() {
  const pins = JSON.parse(fs.readFileSync(pinFile, 'utf8'));
  assert.equal(pins.format, 'PARTITION-GENERATION-DIAGNOSTIC-1');
  assert.equal(sha(fs.readFileSync(__filename)), pins.scriptSha256);
  assert.equal(Object.keys(pins.sources).length, 14);
  function verify() {
    for (const [name, hash] of Object.entries(pins.sources)) {
      assert.match(name, /^rebuild\/(client|authority)\/[a-z-]+\.cjs$/);
      assert.equal(sha(fs.readFileSync(path.join(repo, name))), hash, 'pinned source mismatch');
    }
    for (const file of Object.keys(require.cache)) {
      if (file === __filename) continue; // This diagnostic is self-pinned above.
      const relative = path.relative(repo, file).split(path.sep).join('/');
      if (relative.startsWith('rebuild/')) assert.ok(Object.hasOwn(pins.sources, relative), 'unpinned loaded module');
    }
  }
  verify();
  const Client = require(path.join(repo, 'rebuild/client/index.cjs'));
  const Signer = require(path.join(repo, 'rebuild/authority/crypto.cjs'));
  verify(); return {Client, Signer, verify, pins};
}
function setup(Client, config, data) {
  const backend = Client.memoryBackend(data), client = Client.createClient({...config, backend,
    clock: {now: () => config.now, today: () => config.date, tz: '+00:00', monotonicMs: () => 1}});
  client.boot(); assert.notEqual(client.stateOf(), 18); return {client, backend};
}
function exportBackend(backend) {
  return Object.fromEntries(backend.collections().map(name => [name,
    Object.fromEntries(backend.keys(name).map(key => [key, backend.get(name, key)]))]));
}
function observe(client) {
  const ambiguity = client.ambiguity(), face = client.face();
  return {hasQuestion: ambiguity.decision === null, progressionBearing: ambiguity.progressionBearing,
    state14: face.state === 14, machineOutputVisible: face.layer2.outputs.some(row => row.id === 'synthetic-session-output'),
    component: ambiguity.component, generation: ambiguity.generation, decision: ambiguity.decision};
}
function preserved(client, backend, expected) {
  assert.equal(JSON.stringify(backend.get('sessionStarts', 's1')), expected.s1);
  assert.equal(JSON.stringify(backend.get('sessionStarts', 's2')), expected.s2);
  assert.equal(JSON.stringify(backend.get('ops', expected.opId)), expected.operation);
  assert.equal(JSON.stringify(backend.get('outbox', expected.opId)), expected.outbox);
  assert.equal(JSON.stringify(backend.get('sessionResolutions', 's1|s2')), expected.decision);
  assert.equal(JSON.stringify(backend.get('sync', 'snapshot')), expected.snapshot);
  assert.equal(JSON.stringify(client.face().acceptedPlan), expected.acceptedPlan);
  assert.equal(backend.keys('ops').length, 1); assert.equal(backend.keys('outbox').length, 1);
  assert.equal(backend.keys('sessionStarts').length, 3);
  assert.equal(backend.get('sessionStarts', 's3').tombstoned, true);
  return true;
}
function main() {
  const {Client, Signer, verify, pins} = load();
  if (childMode) {
    const input = JSON.parse(fs.readFileSync(0, 'utf8'));
    const {client, backend} = setup(Client, input.config, input.data);
    const intact = preserved(client, backend, input.expected), actual = observe(client);
    assert.deepEqual(actual, input.observation); verify();
    process.stdout.write(JSON.stringify({preserved: intact, sameObservation: true,
      state14: actual.state14, progressionBearing: actual.progressionBearing, hasQuestion: actual.hasQuestion})); return;
  }
  assert.ok(args.length === 0 || args.length === 1 || (args.length === 3 && args[1] === '--evidence'));
  const started = performance.now(), rows = [];
  const config = {athleteId: 'synthetic-athlete', deviceId: 'synthetic-observer',
    identityKey: crypto.randomBytes(32).toString('hex'), authorityKey: crypto.randomBytes(32).toString('hex'),
    online: false, standing: 'enrolled', date: '2043-05-04', now: '2043-05-04T12:00:00.000Z'};
  config.lease = Signer.signLease({lease_id: 'synthetic-lease', athlete_id: config.athleteId, device_id: config.deviceId,
    schema_version: 1, range: [1, 100], not_before: '2043-05-01T00:00:00.000Z', not_after: '2043-06-01T00:00:00.000Z'}, config.authorityKey);
  const {client, backend} = setup(Client, config);
  function record(id, status, checks) {
    phase = id; for (const ok of Object.values(checks)) assert.equal(ok, true);
    rows.push({id, status, checks}); console.log(id + ' ' + status);
  }
  // Accepted plan/start VIEW input is assumed at this client seam. No unsigned
  // snapshot here is described as a verified production trust boundary.
  const snapshot = {W: 0, time: config.now, plan: {'synthetic-lift': 41}, planVersion: 'synthetic-plan-v1',
    planProvenance: 'synthetic-assumed-accepted', planTransactionIds: ['synthetic-plan-transaction'],
    outputs: [{id: 'synthetic-session-output', kind: 'next-load', value: 43, unit: 'lb', deps: ['fact:session']}]};
  assert.equal(client.receiveSnapshot(snapshot).stored, true);
  const starts = ['s1', 's2', 's3'].map((start, i) => ({start, device: 'synthetic-source-' + i,
    slot: 'AD_HOC', date: config.date, time: '12:00'})), inputBytes = JSON.stringify(starts);
  assert.equal(client.receiveSessionStarts([starts[0]]).stored, true);
  record('SINGLE-START-OUTPUT-CONTROL', 'CONTROL_PASS', {bearing: client.ambiguity().progressionBearing === true,
    notAmbiguous: client.stateOf() !== 14, actualOutputPresent: observe(client).machineOutputVisible});
  assert.equal(client.receiveSessionStarts([starts[1]]).stored, true);
  const unresolved = observe(client);
  record('INITIAL-COMPONENT-STATE-CONTROL', 'CONTROL_PASS', {question: unresolved.hasQuestion,
    noBearing: unresolved.progressionBearing === false, state14: unresolved.state14});
  record('UNRESOLVED-MACHINE-OUTPUT', 'REQUIREMENT_RED', {state14: unresolved.state14,
    actualSessionOutputStillPresent: unresolved.machineOutputVisible});
  const question = client.ambiguity(), answer = {component: ['s1', 's2'], blocks: [['s1', 's2']],
    bases: ['synthetic-governing-plan'], generation: question.generation};
  const answerBytes = JSON.stringify(answer), chosen = client.resolveAmbiguity(answer);
  assert.equal(typeof chosen.op_id, 'string');
  const decision = backend.get('sessionResolutions', 's1|s2');
  record('LOCAL-DECISION-CONTROL', 'CONTROL_PASS', {actualOperationSaved: !!client.envelope(chosen.op_id),
    actualOutboxEntry: client.outbox().length === 1, locallyResolved: client.ambiguity().decision !== null,
    governingStateLeaves14: client.stateOf() !== 14, noInputRewrite: JSON.stringify(answer) === answerBytes});
  const expected = {s1: JSON.stringify(backend.get('sessionStarts', 's1')), s2: JSON.stringify(backend.get('sessionStarts', 's2')),
    opId: chosen.op_id, operation: JSON.stringify(client.envelope(chosen.op_id)),
    outbox: JSON.stringify(backend.get('outbox', chosen.op_id)), decision: JSON.stringify(decision),
    snapshot: JSON.stringify(backend.get('sync', 'snapshot')), acceptedPlan: JSON.stringify(client.face().acceptedPlan)};
  for (const field of ['s1', 's2', 'operation', 'outbox', 'decision', 'snapshot', 'acceptedPlan']) assert.equal(typeof expected[field], 'string');
  assert.equal(client.receiveSessionStarts([starts[2]]).stored, true);
  const late = observe(client);
  record('LATE-START-QUESTION-CONTROL', 'CONTROL_PASS', {newQuestion: late.hasQuestion,
    threeMembers: late.component.length === 3, noBearing: late.progressionBearing === false, state14: late.state14,
    outputWithdrawn: late.machineOutputVisible === false});
  assert.equal(client.receiveSessionStarts([{...starts[2], tombstoned: true}]).stored, true);
  const returned = observe(client);
  record('SAME-MEMBERS-OLD-ANSWER-REVIVES', 'REQUIREMENT_RED', {sameLiveIds: JSON.stringify(returned.component) === JSON.stringify(['s1', 's2']),
    noNewQuestion: returned.hasQuestion === false, oldDecisionReused: JSON.stringify(returned.decision) === expected.decision,
    oldGenerationReused: returned.generation === question.generation, machineEligibilityReenabled: returned.progressionBearing === true,
    state14Absent: returned.state14 === false, outputStillWithdrawnByPendingSessionEdit: returned.machineOutputVisible === false});
  record('EXACT-PRESERVATION-CONTROL', 'CONTROL_PASS', {allRetained: preserved(client, backend, expected),
    originalViewInputsUnchanged: JSON.stringify(starts) === inputBytes, originalPlanInputUnchanged: JSON.stringify(snapshot) === expected.snapshot});
  const beforeReplay = JSON.stringify(exportBackend(backend));
  assert.equal(client.receiveSessionStarts([{...starts[2], tombstoned: true}]).stored, true);
  assert.equal(JSON.stringify(exportBackend(backend)), beforeReplay);
  record('EXACT-VIEW-REPLAY-CONTROL', 'CONTROL_PASS', {exactStore: true, sameOutput: JSON.stringify(observe(client)) === JSON.stringify(returned)});
  const data = JSON.parse(JSON.stringify(exportBackend(backend)));
  phase = 'fresh-process';
  const fresh = spawnSync(process.execPath, [__filename, '--child', repo], {input: JSON.stringify({config, data, expected, observation: returned}),
    encoding: 'utf8', windowsHide: true, timeout: 15000});
  assert.equal(fresh.status, 0); assert.equal(fresh.stderr, '');
  const reopened = JSON.parse(fresh.stdout);
  record('FRESH-CLIENT-OLD-ANSWER-REVIVES', 'REQUIREMENT_RED', {exactStoredFactsAndDecision: reopened.preserved,
    sameObservation: reopened.sameObservation, noQuestion: reopened.hasQuestion === false,
    bearingReenabled: reopened.progressionBearing === true, state14Absent: reopened.state14 === false});
  verify();
  const controls = rows.filter(row => row.status === 'CONTROL_PASS').length, reds = rows.length - controls;
  const summary = `PARTITION-GENERATION DIAGNOSTIC: ${controls}/${controls} controls PASS; ${reds}/${reds} current requirement witnesses RED; 1 fresh process; no manual generation advance`;
  const result = {status: 'REQUIREMENTS_RED', productAcceptance: false, summary, rows, sourcePins: pins.sources,
    scriptSha256: pins.scriptSha256, node: process.version, elapsedMs: performance.now() - started,
    required: ['R563–570: a live-component change supersedes the prior generation; the old answer cannot automatically revive.',
      'R557–559: unresolved sessions are progression-bearing nowhere and cannot emit a next-load result.',
      'R574–585: preserve accepted plan and immutable start/decision identity; no deletion or rewrite.'],
    limitations: ['Incoming start and plan views are assumed accepted; no authority or transport normalizer is executed.',
      'The resolution is the actual current LOCAL saved operation and remains pending; no forged accepted disposition is supplied. Its known authority generation-schema rejection is not retested or renumbered.',
      'Preservation covers exact received s1/s2 view records, actual stored decision operation/outbox and complete plan snapshot. Canonical original start operations are outside this view API and not claimed verified.',
      'The removed s3 view remains stored as tombstoned; no tombstone operation is minted or admitted by this fixture.',
      'Returned membership wrongly re-enables ambiguity.progressionBearing and leaves state14. Its existing pending resolution still withdraws the dependency-tagged snapshot output; actual post-revival next-load emission is NOT claimed.',
      'The initial unresolved component does expose the supplied session-dependent output despite state14; this is separately reported.',
      'Fresh process reconstructs serialized synchronous memory, not IndexedDB, OS restart or a phone.',
      'No effective-time membership policy, exact generation allocation, concurrent winner, cryptographic combined identity, schema or product repair is selected.']};
  if (args.length === 3) fs.writeFileSync(path.resolve(args[2]), JSON.stringify(result, null, 2) + '\n', {flag: 'wx'});
  console.log(summary); process.exitCode = 2;
}
try { main(); } catch (error) { console.error('PARTITION-GENERATION HARNESS_ERROR: ' + phase + ' ' + (error.code || error.name)); process.exitCode = 3; }
