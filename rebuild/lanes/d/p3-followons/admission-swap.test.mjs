/* P3-D-FOLLOWONS item 1 (DECISIONS:475, Route 1 step one) - THE IMPORT SWAP,
   PROVED BY RUNNING BOTH RUNTIMES.

   source-admission.mjs:16 now imports the accepted page-safe mirror
   rebuild/m3/w6/host/engine-runtime-host.cjs instead of the accepted
   rebuild/m4/workout/engine-runtime.cjs. What leaves the browser graph is
   measured in rebuild/m3/w7-preview/import/test/page-bundle.test.mjs. What must
   NOT change is behaviour, and "the equivalence test already covers it" is not
   a measurement of THIS module, so these cells measure it here:

   a PRE-SWAP COPY of source-admission.mjs is written to the OS temp folder with
   its ONE import line reverted and every other specifier rewritten to the same
   absolute file it already resolved to - so the copy shares every other module
   instance with the real one, byte for byte - and then BOTH controllers run the
   same admission over the SAME repository and the same custody material. The
   whole qualified view is compared, which means the basis and its five digests:
   operations, interpretation, programme, order map and engine.

   Everything is SYNTHETIC: the bundle is sealed by the real port.cjs from a
   file invented through the ACCEPTED clean-init constructor, exactly as
   ../../../m3/w7-preview/import/test/support.mjs does. No ledger, no owner data
   and no private fixture is read, named or reachable from here; nothing is
   written outside the OS temp folder.

   Run with TZ=America/New_York MEASURED_TEST_NOW=2026-09-03. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, carry, material,
  createSourcePlatform, REPO } from '../../../m3/w7-preview/import/test/support.mjs';
import { createLocalSourceController } from '../../../m3/w6/local/source-admission.mjs';
import { createLocalSourceFixture, appendCompletedWorkout }
  from '../../../m4/import/test/s3/fixtures.mjs';
import { webcrypto } from 'node:crypto';

const require_ = createRequire(import.meta.url);
const Mapping = require_('../../../m4/import/production-mapping.cjs');
const Host = require_('../../../m3/w6/host/engine-runtime-host.cjs');
const Accepted = require_('../../../m4/workout/engine-runtime.cjs');

const LOCAL = path.join(REPO, 'rebuild/m3/w6/local');
const MIRROR = "from '../host/engine-runtime-host.cjs'";
const ACCEPTED_SPECIFIER = '../../../m4/workout/engine-runtime.cjs';
const SEALED = sealInventedBundle();
const SUMMER = { day: '2026-09-16', at: '2026-09-16T16:00:00.000Z' };
const WINTER = { day: '2026-11-20', at: '2026-11-20T17:00:00.000Z' };

/* THE PRE-SWAP MODULE. The product file is never touched: it is READ, its one
   import line is reverted in memory, every relative specifier is rewritten to
   the absolute file it already resolved to (so every OTHER module in the graph
   is the very same instance, not a second copy), and the result is written to
   the OS temp folder. */
function preSwapCopy() {
  const source = fs.readFileSync(path.join(LOCAL, 'source-admission.mjs'), 'utf8');
  assert.equal(source.split(MIRROR).length, 2,
    'source-admission.mjs must import the host mirror exactly once: ' + MIRROR);
  const reverted = source.replace(MIRROR, "from '" + ACCEPTED_SPECIFIER + "'");
  const rewritten = reverted.replace(/from '(\.[^']*)'/g,
    (whole, specifier) => "from '" + pathToFileURL(path.resolve(LOCAL, specifier)).href + "'");
  assert.equal(/from '\.[^']*'/.test(rewritten), false, 'a relative specifier survived');
  assert.equal(rewritten.includes(pathToFileURL(
    path.resolve(LOCAL, ACCEPTED_SPECIFIER)).href), true, 'the revert did not take');
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'p3f-preswap-')),
    'source-admission-pre-swap.mjs');
  fs.writeFileSync(file, rewritten);
  return { file, source, rewritten };
}

const names = tag => ({ databaseName: 'p3f-' + tag, namespace: 'joe/p3f-' + tag,
  athleteId: 'ath-p3f', deviceId: 'dev-p3f' });

/* ONE device, ONE custody record, TWO controllers. reviewSource and
   prepareSource write nothing until the commit capability publishes, so both
   controllers qualify the same material at the same revision. */
async function bothViews(tag, when) {
  const scope = names(tag);
  const era = await eraFor({ indexedDB: new IDBFactory(), live: liveAt(when.at), ...scope });
  await firstRun(era, when.day);
  const { carried, platform } = await carry(era, SEALED);
  assert.equal(carried.imported, true, carried.code);
  const held = await material(era, platform, carried.name);
  const make = async create => {
    const controller = create({ repository: held.repository, namespace: scope.namespace,
      athleteId: scope.athleteId, deviceId: scope.deviceId, platform, asOf: () => when.day,
      producerRegistry: Mapping.createProductionProducerRegistry({ hash: platform.hash }) });
    const review = await controller.reviewSource(carried.name);
    const prepared = await controller.prepareSource(review, { identityConfirmed: true });
    assert.equal(prepared.profile, 'earned/local-source-qualification/v1', 'not qualified');
    return { review, view: await controller.view(prepared) };
  };
  const { file } = preSwapCopy();
  const before = await make((await import(pathToFileURL(file).href)).createLocalSourceController);
  const after = await make(createLocalSourceController);
  era.close();
  return { before, after };
}

test('P3F-0 - the swap is the ONE line it claims to be, and the two runtimes '
  + 'agree on the surface this module uses', () => {
  const { source, rewritten } = preSwapCopy();
  const changed = source.split('\n').filter((line, i) => line !== rewritten.split('\n')[i]);
  assert.equal(changed.length,
    source.split('\n').filter(line => /from '\./.test(line)).length,
    'only import specifiers were rewritten');
  assert.equal(changed.filter(line => /engine-runtime/.test(line)).length, 1,
    'exactly one runtime import exists to swap');
  /* The mirror is a BINDING: the same twelve modules in the same order behind
     literal requires, and the same frozen five-name facade. */
  assert.deepEqual([...Host.COMPOSITION.modules], [...Accepted.COMPOSITION.modules]);
  assert.deepEqual([...Host.COMPOSITION.exposed], [...Accepted.COMPOSITION.exposed]);
  assert.equal(Host.COMPOSITION.mirrorOf, 'rebuild/m4/workout/engine-runtime.cjs');
  const clock = Object.freeze({ today: () => '2026-09-16', hour: () => 12, dow: () => 3,
    nowISO: () => '2026-09-16T16:00:00.000Z', nowMs: () => Date.parse('2026-09-16T16:00:00.000Z') });
  assert.deepEqual(Object.keys(Host.createEngineRuntime({ clock })).sort(),
    Object.keys(Accepted.createEngineRuntime({ clock })).sort());
});

for (const [label, when] of [['SUMMER (EDT)', SUMMER], ['WINTER (EST)', WINTER]])
  test('P3F-1 ' + label + ' - the swapped module and the PRE-SWAP module qualify the '
    + 'same bundle to the byte-identical basis on ' + when.day, async () => {
    const { before, after } = await bothViews('ab-' + when.day, when);
    /* THE FIVE DIGESTS, named one by one before the whole-object compare, so a
       failure says WHICH statement about his history moved. */
    for (const field of ['operation_digest', 'interpretation_digest', 'programme_digest',
      'order_map_digest', 'engine_digest', 'material_digest', 'source_digest',
      'checkpoint_digest', 'local_selection_id'])
      assert.equal(after.view.basis[field], before.view.basis[field], field + ' moved');
    assert.deepEqual(after.view.basis, before.view.basis, 'the whole basis');
    assert.deepEqual(after.view.families, before.view.families, 'the family verdicts');
    assert.deepEqual(after.view.state, before.view.state, 'the state his screens paint');
    assert.deepEqual(after.view.calculation, before.view.calculation);
    assert.deepEqual(after.view.workout_facts, before.view.workout_facts,
      'the reproduced sessions, entries and slots');
    assert.deepEqual(after.view.retained, before.view.retained);
    assert.deepEqual(after.review, before.review, 'and the review screen, including :80');
    assert.deepEqual(after.view, before.view, 'the whole qualified view');
    /* Not vacuous: this bundle really does carry the athlete's history, and
       the whole replay ran. The NATIVE session branch - the one place this
       module calls the runtime at all - is exercised by P3F-2 below, which is
       the fresh-start-then-port shape this device does not have. */
    assert.deepEqual(Object.keys(after.view.state.sessionLog).sort(),
      ['2026-08-14', '2026-08-17', '2026-08-21']);
    assert.equal(after.view.families.some(f => f.family === 'F4'), true,
      'the installation\'s own programme was resolved against the file');
    assert.equal(after.view.workout_facts, null,
      'no native session here: see P3F-2 for the branch that calls the runtime');
  });

/* THE BRANCH THAT ACTUALLY CALLS THE RUNTIME. source-admission.mjs names
   Runtime in exactly one place: replay()'s native-session branch, where
   resolveCapturedLayout asks createEngineRuntime(...).sessionMembership for the
   complete ordered pool of the ORIGINAL Start day and refuses
   LOCAL_SOURCE_PROGRAMME_UNRESOLVED on any disagreement. That branch is only
   reached when the device already holds a session operation of its own - the
   fresh-start-then-port case - so it gets its own A/B, over the accepted S3
   fixture that the W6 admission suite uses for the same purpose. */
test('P3F-2 - with a NATIVE completed workout on the device, the swapped module '
  + 'and the PRE-SWAP module reproduce the identical workout facts', async t => {
  const fixture = await createLocalSourceFixture({ indexedDB: new IDBFactory(),
    crypto: webcrypto, databaseName: 'p3f-native-session' });
  t.after(() => fixture.close());
  for (const exercise of fixture.state.exercises)
    exercise.w = typeof exercise.steps[0] === 'number' ? exercise.steps[0] + 5 : 20;
  const completed = await appendCompletedWorkout(fixture);
  const make = async create => {
    const controller = create({ repository: fixture.repository, namespace: fixture.namespace,
      athleteId: fixture.athleteId, deviceId: fixture.deviceId, platform: fixture.platform,
      producerRegistry: fixture.registry, asOf: '2026-09-04' });
    const prepared = await controller.prepareSource(
      await controller.reviewSource(fixture.name), { identityConfirmed: true, prefixAnswer: true });
    assert.equal(prepared.profile, 'earned/local-source-qualification/v1', 'not qualified');
    return controller.view(prepared);
  };
  const { file } = preSwapCopy();
  const before = await make((await import(pathToFileURL(file).href)).createLocalSourceController);
  const after = await make(createLocalSourceController);
  /* NOT VACUOUS: the runtime was asked, and its answer is in the basis. */
  assert.deepEqual(after.workout_facts.sessions.map(s => s.start_op_id), [completed.startId]);
  assert.equal(after.families.some(f => f.family === 'F3' && f.state === 'projected'), true);
  assert.deepEqual(after.workout_facts, before.workout_facts,
    'the reproduced session, its entries and every slot');
  assert.equal(after.basis.interpretation_digest, before.basis.interpretation_digest);
  assert.equal(after.basis.programme_digest, before.basis.programme_digest);
  assert.deepEqual(after.basis, before.basis, 'the whole basis');
  assert.deepEqual(after, before, 'the whole qualified view');
});
