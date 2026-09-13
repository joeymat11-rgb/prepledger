// Independent reviewer annex for candidate ebc4c4e870497199c113c5e5c85bdced679589cf.
// Read/run only against a freshly copied S3_SCRATCH tree, with its current-head
// preload. This file is reviewer-owned and is not a candidate manifest member.
// No production data, real C2 provenance, consumer/P1 result or acceptance follows.
//
// Four paired questions, limited to released source-admission code:
// 1. Does Q bind authenticated enrollment namespace rather than a caller label?
//    source-admission.mjs:31-43,168; local-client.mjs:238.
// 2. Does an unexplained current plan withhold qualification, rather than merely
//    joining interpretation_digest? The plan row is an adversarial stored input,
//    not a claim that a current product command produces this shape.
//    source-admission.mjs:26,57,82-92,167.
// 3. Does original captured programme correspondence detect a whole missing lift?
//    Real capture/command algorithms make both captures; source/setup bytes stay
//    fixed. Different historical performed loads are not the refusal condition.
//    source-admission.mjs:142-145; engine-capture.cjs:111-129.
// 4. Does the original-envelope gate enforce the existing kind/target rule?
//    Ops.build's extra hook supplies a committed but unsupported fact target.
//    source-admission.mjs:49-52; ops.cjs:40-41,75.
// No backdated-prefix probe is included: these tests do not invent a date-order
// rule or attempt to adjudicate the boundary between labels and causal order.

import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, realpathSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {createHash, webcrypto} from 'node:crypto';

const MANIFEST = 'rebuild/m4/spec/s3-portable-sources.json';
const MANIFEST_SHA256 = 'c7623bcaa982182ab2cccd5ca542c450a758a4b8a2be99b0d4c063d55926a15d';
const SOURCE_M = '100820aa47a4f8729642033499eaec0f0ee282e1';
const IMPLEMENTATION_PARENT = '06c5b4a5d76c9973849d0f4cde51b379bc35be43';
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const samePath = (a, b) => process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
const inside = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === '' || (!path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep));
};

assert.match(process.versions.node, /^22\./, 'ANNEX_SETUP: exact Node22 family required');
assert.equal(process.env.TZ, 'America/New_York', 'ANNEX_SETUP: explicit TZ required');
assert.equal(Intl.DateTimeFormat().resolvedOptions().timeZone, 'America/New_York', 'ANNEX_SETUP: host calendar must match fixture context');
assert.ok(process.env.S3_SCRATCH, 'ANNEX_SETUP: S3_SCRATCH required');
assert.equal(process.env.S3_MUTATION, undefined, 'ANNEX_SETUP: unmodified candidate only');
const scratch = path.resolve(process.env.S3_SCRATCH);
assert.equal(path.basename(scratch), 'tree', 'ANNEX_SETUP: fresh copied tree required');
assert.ok(samePath(realpathSync.native(scratch), scratch), 'ANNEX_SETUP: scratch cannot be a junction or symlink');

// No candidate module or dependency is imported until the complete fixed manifest
// and all 111 source files have passed this independent verification.
function verifySources() {
  const manifestPath = path.join(scratch, MANIFEST);
  assert.ok(samePath(realpathSync.native(manifestPath), manifestPath), 'ANNEX_SETUP: manifest escape');
  const bytes = readFileSync(manifestPath);
  assert.equal(sha256(bytes), MANIFEST_SHA256, 'ANNEX_SETUP: manifest bytes differ from reviewed candidate');
  const manifest = JSON.parse(bytes.toString('utf8'));
  assert.equal(manifest.profile, 'earned/s3-provisional-public-sources/v1');
  assert.equal(manifest.sourceM, SOURCE_M);
  assert.equal(manifest.implementationParent, IMPLEMENTATION_PARENT);
  assert.equal(manifest.sources.length, 111, 'ANNEX_SETUP: complete 111-source inventory required');
  const names = new Set();
  for (const entry of manifest.sources) {
    assert.equal(typeof entry.path, 'string');
    assert.ok(!entry.path.includes('\\') && !path.posix.isAbsolute(entry.path) && path.posix.normalize(entry.path) === entry.path, 'ANNEX_SETUP: source path must be canonical');
    assert.ok(!names.has(entry.path), 'ANNEX_SETUP: duplicate source');
    names.add(entry.path);
    const file = path.resolve(scratch, entry.path);
    assert.ok(inside(scratch, file) && samePath(realpathSync.native(file), file), 'ANNEX_SETUP: source escape: ' + entry.path);
    assert.equal(sha256(readFileSync(file)), entry.sha256, 'ANNEX_SETUP: source drift: ' + entry.path);
  }
  return names;
}
const sources = verifySources();
after(() => verifySources());
const candidateUrl = name => {
  assert.ok(sources.has(name), 'ANNEX_SETUP: direct import must be in the verified manifest');
  return pathToFileURL(path.join(scratch, name)).href;
};
const fixtureModule = await import(candidateUrl('rebuild/m4/import/test/s3/fixtures.mjs'));
const admission = await import(candidateUrl('rebuild/m3/w6/local/source-admission.mjs'));
const {createLocalSourceFixture, appendCompletedWorkout, fixtureEffective} = fixtureModule;
const dependencyResolver = createRequire(path.join(scratch, 'rebuild/m3/w6/package.json'));
const idbFile = dependencyResolver.resolve('fake-indexeddb');
assert.ok(inside(path.dirname(scratch), realpathSync.native(idbFile)) && idbFile.split(path.sep).includes('node_modules'), 'ANNEX_SETUP: dependency must belong to this scratch run');
const idbModule = await import(pathToFileURL(idbFile).href);
const IDBFactory = idbModule.IDBFactory ?? idbModule.default?.IDBFactory;
assert.equal(typeof IDBFactory, 'function', 'ANNEX_SETUP: installed fake-indexeddb export required');

let fixtureNumber = 0;
async function fixture(t, label) {
  const f = await createLocalSourceFixture({indexedDB: new IDBFactory(), crypto: webcrypto,
    databaseName: 's3-independent-' + label + '-' + (++fixtureNumber)});
  t.after(() => f.close());
  return f;
}
async function prepare(f, controller = f.controller) {
  return controller.prepareSource(await controller.reviewSource(f.name), {identityConfirmed: true, prefixAnswer: true});
}
const generationDigest = async f => sha256(JSON.stringify((await f.repository.load()).generation));
async function qualifiedView(f, controller = f.controller) {
  const before = await generationDigest(f);
  const handle = await prepare(f, controller);
  assert.equal(handle?.profile, 'earned/local-source-qualification/v1', 'Positive must produce an owned qualification');
  const view = await controller.view(handle);
  assert.equal(view.ready, true);
  assert.equal(await generationDigest(f), before, 'Preparation/view must preserve the durable generation');
  return view;
}

// Print only synthetic scope labels, booleans, family names and refusal codes.
// Never print a generation, enrollment key, raw operation, source or capture.
async function safeSummary(controller, result) {
  let view = result;
  if (result?.profile === 'earned/local-source-qualification/v1') view = await controller.view(result);
  return {
    result_profile: result?.profile ?? null,
    ready: view?.ready ?? null,
    pending: view?.pending ?? null,
    installation_id: view?.basis?.installation_id ?? null,
    issue_codes: (view?.issues ?? []).map(issue => issue.code),
    families: [...new Set((view?.families ?? []).map(row => row.family))]
  };
}
async function expectRefusal(t, f, controller, codes, label) {
  const before = await generationDigest(f);
  let result, error;
  try { result = await prepare(f, controller); } catch (caught) { error = caught; }
  const summary = error ? {error_code: typeof error.code === 'string' ? error.code : null, error_name: error.name} : await safeSummary(controller, result);
  t.diagnostic(label + ': ' + JSON.stringify(summary));
  assert.equal(await generationDigest(f), before, label + ': qualification attempt must preserve all durable inputs');
  if (error) {
    assert.ok(codes.includes(error.code), label + ': unrelated setup/import/runtime failure is not a semantic refusal: ' + JSON.stringify(summary));
    return;
  }
  assert.ok(result?.ready === false && result?.pending === true && result.issues?.some(issue => codes.includes(issue.code)),
    label + ': expected semantic refusal; candidate returned ' + JSON.stringify(summary));
}
async function enrolledFixture(t, label) {
  const f = await fixture(t, label);
  // The candidate fixture omits this field. The actual local-client enrollment
  // writes metadata.namespace (local-client.mjs:238), so seal it authentically.
  await f.mutate(g => { g.metadata.namespace = f.namespace; });
  return f;
}
function controllerAt(f, namespace) {
  return admission.createLocalSourceController({repository: f.repository, namespace,
    athleteId: f.athleteId, deviceId: f.deviceId, producerRegistry: f.registry,
    asOf: '2026-09-04', platform: f.platform});
}

test('ANNEX-NAMESPACE-POSITIVE: actual authenticated enrollment namespace qualifies', async t => {
  const f = await enrolledFixture(t, 'namespace-positive');
  const view = await qualifiedView(f);
  assert.equal(view.basis.installation_id, f.namespace);
});
test('ANNEX-NAMESPACE-REFUSAL: caller cannot relabel the same authenticated installation', async t => {
  const f = await enrolledFixture(t, 'namespace-refusal');
  await qualifiedView(f);
  const wrong = controllerAt(f, 'TEST-ONLY-wrong-installation');
  t.after(() => wrong.close());
  await expectRefusal(t, f, wrong, ['LOCAL_SOURCE_SCOPE', 'LOCAL_ERA_SCOPE_MISMATCH',
    'LOCAL_SOURCE_INSTALLATION_MISMATCH', 'LOCAL_SOURCE_INSTALLATION_UNPROVEN'], 'Wrong namespace');
});

test('ANNEX-PLAN-POSITIVE: empty current-plan collection preserves source/setup agreement', async t => {
  const f = await fixture(t, 'plan-positive');
  await f.mutate(g => { g.collections.plan = {}; });
  const view = await qualifiedView(f);
  assert.ok(view.families.some(row => row.family === 'F4' && row.state === 'retained'));
});
test('ANNEX-PLAN-REFUSAL: an unexplained current plan cannot qualify by being hashed', async t => {
  const f = await fixture(t, 'plan-refusal');
  await f.mutate(g => { g.collections.plan = {}; });
  await qualifiedView(f);
  await f.mutate(g => { g.collections.plan.unexplained = {exercise_id: f.setup.exercises[0].id, sets: 99}; });
  await expectRefusal(t, f, f.controller, ['LOCAL_SOURCE_PROGRAMME_UNRESOLVED', 'LOCAL_SOURCE_EFFECT_UNMAPPED'], 'Unexplained current plan');
});

test('ANNEX-LAYOUT-POSITIVE: complete real native capture agrees with unchanged source/setup', async t => {
  const f = await fixture(t, 'layout-positive');
  const workout = await appendCompletedWorkout(f);
  const view = await qualifiedView(f);
  assert.deepEqual(view.workout_facts.sessions.map(row => row.start_op_id), [workout.startId]);
  assert.ok(workout.capture.slots.length > 1);
});
test('ANNEX-LAYOUT-REFUSAL: a real capture missing an expected lift needs correspondence evidence', async t => {
  const control = await fixture(t, 'layout-control');
  const expected = await appendCompletedWorkout(control);
  await qualifiedView(control);
  const omittedId = expected.capture.slots[0].lift_lineage_id;
  assert.ok(new Set(expected.capture.slots.map(slot => slot.lift_lineage_id)).size > 1, 'Fixture must leave a nonempty workout after omission');
  const f = await fixture(t, 'layout-refusal');
  const sourceBefore = sha256(f.sourceBytes), candidateBefore = sha256(f.candidateBytes);
  assert.ok(f.setup.exercises.some(exercise => exercise.id === omittedId));
  // Alter only the synthetic native capture's input. Custodied source/candidate
  // bytes and the authenticated setup operation are already fixed and unchanged.
  f.state.exercises = f.state.exercises.filter(exercise => exercise.id !== omittedId);
  const workout = await appendCompletedWorkout(f);
  assert.equal(workout.capture.slots.some(slot => slot.lift_lineage_id === omittedId), false);
  assert.equal(sha256(f.sourceBytes), sourceBefore);
  assert.equal(sha256(f.candidateBytes), candidateBefore);
  await expectRefusal(t, f, f.controller, ['LOCAL_SOURCE_PROGRAMME_UNRESOLVED', 'LOCAL_SOURCE_WORKOUT_UNRESOLVED'], 'Missing captured lift');
});

async function addReading(f, illegalTarget) {
  f.setAsOf('2026-09-05');
  const action = {class: 'reading', kind: 'fact', payload: {lb: {value: 174, unit: 'lb'}, source: 'athlete'},
    effective: fixtureEffective('2026-09-05', 8), parents: ['TEST-ONLY-food']};
  if (illegalTarget) action.extra = {target_op_id: 'TEST-ONLY-food'};
  return f.append('TEST-ONLY-annex-reading', action, 1);
}
test('ANNEX-TARGET-POSITIVE: a normal later reading with a known causal parent projects once', async t => {
  const f = await fixture(t, 'target-positive');
  await addReading(f, false);
  const view = await qualifiedView(f);
  assert.equal(view.state.reads.filter(row => row.d === '2026-09-05' && row.w === 174).length, 1);
});
test('ANNEX-TARGET-REFUSAL: a committed fact cannot carry a correction-only target', async t => {
  const f = await fixture(t, 'target-refusal');
  await qualifiedView(f);
  const original = await addReading(f, true);
  assert.equal(original.kind, 'fact');
  assert.equal(original.target_op_id, 'TEST-ONLY-food');
  await expectRefusal(t, f, f.controller, ['LOCAL_SOURCE_ORIGINAL_INVALID', 'LOCAL_SOURCE_READING_UNRESOLVED'], 'Illegal fact target');
});
