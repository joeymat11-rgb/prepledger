// Independent reviewer evidence only; no product mutation and no real-C2 claim.
// Candidate ebc4c4e870497199c113c5e5c85bdced679589cf, complete public projection.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash, webcrypto} from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';

assert.match(process.versions.node, /^22\./, 'Reviewer annex requires Node22');
assert.equal(Intl.DateTimeFormat().resolvedOptions().timeZone, 'America/New_York');
assert.ok(process.env.S3_SCRATCH, 'Root supplies the verified copied tree');
const root = path.resolve(process.env.S3_SCRATCH);
const same = (a, b) => process.platform === 'win32' ? a.toLowerCase() === b.toLowerCase() : a === b;
assert.ok(same(fs.realpathSync.native(root), root), 'Scratch root is not redirected');
const sha = value => createHash('sha256').update(value).digest('hex');
const manifestBytes = fs.readFileSync(path.join(root, 'rebuild/m4/spec/s3-portable-sources.json'));
assert.equal(sha(manifestBytes), 'c7623bcaa982182ab2cccd5ca542c450a758a4b8a2be99b0d4c063d55926a15d', 'Exact candidate manifest');
const manifest = JSON.parse(manifestBytes), pins = new Map(manifest.sources.map(row => [row.path, row.sha256]));
assert.equal(manifest.implementationParent, '06c5b4a5d76c9973849d0f4cde51b379bc35be43');
assert.equal(manifest.sourceM, '100820aa47a4f8729642033499eaec0f0ee282e1');
assert.equal(pins.size, 111); assert.equal(manifest.sources.length, 111);
function sourcePath(name) {
  assert.ok(pins.has(name), 'Only a listed public candidate source may load: ' + name);
  const file = path.resolve(root, name), relative = path.relative(root, file);
  assert.ok(relative && !path.isAbsolute(relative) && relative !== '..' && !relative.startsWith('..' + path.sep));
  assert.ok(same(fs.realpathSync.native(file), file), 'Candidate source is not redirected: ' + name);
  return file;
}
for (const [name, expected] of pins) assert.equal(sha(fs.readFileSync(sourcePath(name))), expected, 'Candidate bytes: ' + name);
// This pinned 111-file inventory identifies the candidate without requiring Git
// or reading any private/retained sibling of the copied tree.
const require = createRequire(pathToFileURL(sourcePath('package.json')));
const load = name => require(sourcePath(name));
const loadESM = name => import(pathToFileURL(sourcePath(name)).href);
const Profile = load('rebuild/m4/import/local-source-profile.cjs');
const Provider = load('rebuild/m4/import/engine-provider.cjs');
const F = load('rebuild/m3/w7-preview/fixtures.cjs');
const {createLocalSourceFixture, fixtureSetup} = await loadESM('rebuild/m4/import/test/s3/fixtures.mjs');
const {createCleanInitState} = await loadESM('rebuild/m3/w7-preview/today/setup-model.mjs');
const {createLocalSourceController} = await loadESM('rebuild/m3/w6/local/source-admission.mjs');
const {faultDatabase} = await loadESM('rebuild/m3/w6/test/support.mjs');

function calendar(narrow) {
  const days = narrow ? ['2026-09-03', '2026-09-04'] : ['2026-03-07', '2026-03-08', '2026-03-09', '2026-09-03', '2026-09-04'];
  return {profile:'earned/native-date-compatibility/v1', compatibility_id:'REVIEW-ONLY-invented-calendar',
    zone:'America/New_York', range:{from:narrow ? '2026-09-01' : '2026-01-01', to:narrow ? '2026-09-30' : '2026-12-31'},
    dates:days.map(day => {const [y,m,d] = day.split('-').map(Number), noon = new Date(y,m-1,d,12);
      return {day, noonISO:noon.toISOString(), offsetMinutes:noon.getTimezoneOffset()};})};
}
function context(narrow, state) {
  const materialDigest = sha(JSON.stringify(state));
  const engine = {sha256:Profile.SOURCE_PINS['rebuild/engine/oracle-shim.cjs'], treeSha256:'b'.repeat(64), schemaV:60, path:'rebuild/engine/oracle-shim.cjs'};
  const gate = {clock:'2026-09-03', tz:'America/New_York'};
  const mapping = {profile:'earned/source-producer-mapping/v1', id:'REVIEW-ONLY-synthetic-mapping', construction:'oracle-shim-default/v1',
    engine, gate, public_factory_digest:Profile.PUBLIC_FACTORY_DIGEST, source_pins:Profile.SOURCE_PINS, dependencies:{drafts:'default-empty'},
    executions:[{id:'REVIEW-ONLY-no-C2', material_digest:materialDigest, calendar:calendar(narrow)}]};
  return Profile.createProducerRegistry([mapping], {hash:sha}).qualify({context:{engine, oracle:{gate}}, materialDigest});
}
const source = F.createSyntheticState('2026-03-15');
assert.ok(source.reads.some(row => row.d < '2026-03-08') && source.reads.some(row => row.d > '2026-03-08'));

test('REVIEW-CALENDAR-IN-RANGE: the original provider calculates the same invented DST history with covering evidence', () => {
  const before = sha(JSON.stringify(source)), engine = Provider.createSourceReplayEngine({engineContext:context(false, source)});
  const rate = engine.currentRate(source);
  assert.equal(rate.method, 'regression'); assert.equal(rate.n, 28); assert.equal(rate.measured, true);
  assert.ok(Number.isFinite(rate.scale)); assert.equal(rate.from, source.reads[0].d); assert.equal(rate.to, source.reads.at(-1).d);
  assert.equal(sha(JSON.stringify(source)), before, 'Read-only calculation preserves its exact input');
});
test('REVIEW-CALENDAR-OUTSIDE: September-only compatibility cannot authorize March DST calculations', () => {
  const engine = Provider.createSourceReplayEngine({engineContext:context(true, source)});
  assert.throws(() => engine.currentRate(source), {code:'SOURCE_ENGINE_CONTEXT_UNPROVEN'},
    'Every reached historical calendar date needs covering compatibility evidence, not only the preparation clock');
});

async function controllerFixture(t, narrow) {
  const state = structuredClone(createCleanInitState({setup:fixtureSetup()}));
  for (const field of ['model','trend','reads','dailyLogs','sleep']) state[field] = structuredClone(source[field]);
  state.sessionLog = {}; // Invented input has no workout-order question.
  state.decisions = [{id:'REVIEW-ONLY-history', text:'Invented retained history'}];
  const f = await createLocalSourceFixture({indexedDB:faultDatabase().inner, crypto:webcrypto,
    databaseName:'review-calendar-' + (narrow ? 'outside' : 'inside'), source:state, withFacts:false});
  t.after(() => f.close());
  const mapping = structuredClone(f.mapping); mapping.executions[0].calendar = calendar(narrow);
  const controller = createLocalSourceController({repository:f.repository, namespace:f.namespace, athleteId:f.athleteId,
    deviceId:f.deviceId, platform:f.platform, asOf:'2026-09-04', producerRegistry:Profile.createProducerRegistry([mapping], {hash:f.platform.hash})});
  t.after(() => controller.close());
  return {f, controller, before:sha(JSON.stringify((await f.repository.load()).generation))};
}
test('REVIEW-CALENDAR-CONTROLLER-POSITIVE: covering evidence permits actual custody reproduction and qualification', async t => {
  const {f, controller, before} = await controllerFixture(t, false);
  const handle = await controller.prepareSource(await controller.reviewSource(f.name), {identityConfirmed:true});
  assert.notEqual(handle.ready, false, 'Supported source does not enter pending refusal');
  const view = await controller.view(handle);
  assert.equal(view.ready, true); assert.equal(view.calculation.rate.method, 'regression'); assert.equal(view.calculation.rate.n, 28);
  assert.equal(sha(JSON.stringify((await f.repository.load()).generation)), before, 'Qualification remains inactive');
});
test('REVIEW-CALENDAR-CONTROLLER-OUTSIDE: actual controller withholds a qualified view for uncovered source dates', async t => {
  const {f, controller, before} = await controllerFixture(t, true);
  const outcome = await controller.prepareSource(await controller.reviewSource(f.name), {identityConfirmed:true})
    .then(value => ({value}), error => ({error}));
  if (outcome.value?.profile === 'earned/local-source-qualification/v1') {
    const view = await controller.view(outcome.value), rate = view.calculation?.rate;
    t.diagnostic(JSON.stringify({ready:view.ready, rate:{method:rate?.method, n:rate?.n, from:rate?.from, to:rate?.to}}));
  }
  const refused = outcome.error?.code === 'SOURCE_ENGINE_CONTEXT_UNPROVEN' ||
    (outcome.value?.ready === false && outcome.value.issues?.some(issue =>
      ['SOURCE_ENGINE_CONTEXT_UNPROVEN','LOCAL_SOURCE_CALCULATION_UNRESOLVED','LOCAL_SOURCE_CONTEXT_UNRESOLVED'].includes(issue.code)));
  assert.equal(sha(JSON.stringify((await f.repository.load()).generation)), before, 'Attempt preserves exact durable originals, including when qualification wrongly succeeds');
  assert.equal(refused, true, 'A scoped calendar refusal is required; a successful handle or unrelated exception does not count');
});
