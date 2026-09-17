/* P3-PRODUCER-MAPPING (DECISIONS:475 (3)). THE PRODUCTION MAPPING, EXECUTED.
 *
 * A synthetic bundle sealed by the real rebuild/m3/setup/port/port.cjs is
 * carried into real custody over fake-indexeddb and admitted end to end -
 * reviewSource, prepareSource, publish, reconcile, view - against the
 * PRODUCTION mapping from ../production-mapping.cjs, on a summer date and a
 * winter date. No TEST-ONLY registry appears below; the basis's own engine
 * digest is recomputed from the production mapping to prove which one admitted.
 *
 * Everything is SYNTHETIC. The bundle comes from the public journey fixture
 * through the accepted clean-init constructor, exactly as
 * rebuild/m3/w7-preview/import/test/support.mjs invents its own; no private
 * fixture, no ledger and no owner data is read, named or reachable from here,
 * and every --out is outside every git working tree.
 *
 * Run with TZ=America/New_York. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, carry, material,
  IMPORTED_LOADS, SOURCE_SESSION_DAYS, REPO, PORT, Profile, createSourcePlatform,
  parseStrictJson, durable } from '../../../m3/w7-preview/import/test/support.mjs';
import { createLocalSourceController, localSourceCommitCapability }
  from '../../../m3/w6/local/source-admission.mjs';
import { retractImport } from '../../../m3/w6/local/browser-entry.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';

const require_ = createRequire(import.meta.url);
const Mapping = require_('../production-mapping.cjs');

const SUMMER = { day: '2026-09-16', at: '2026-09-16T16:00:00.000Z' };
const WINTER = { day: '2026-11-20', at: '2026-11-20T17:00:00.000Z' };
const SEALED = sealInventedBundle();

const scope = tag => ({ databaseName: 'p3m-' + tag, namespace: 'joe/p3m-' + tag,
  athleteId: 'ath-p3m', deviceId: 'dev-p3m' });

/* THE REAL CALL SEQUENCE AN IMPORT SCREEN MUST MAKE, with the one registry
   this ticket authors and nothing else injected. */
async function admitWithProductionMapping(era, sealed,
  { day, namespace, athleteId, deviceId, reviewedDigest = null }) {
  const { carried, platform } = await carry(era, sealed);
  if (!carried.imported) return { admitted: false, stage: 'custody', code: carried.code };
  const held = await material(era, platform, carried.name);
  /* THE PRODUCTION WIRING: no material digest at construction. The controller
     derives it privately at qualify time and the row is bound from it there
     (P3-D-FOLLOWONS; both mapping reviews' MAJOR 2). `reviewedDigest` is the
     other shape - the reviewed row pinned by hand - and only P3-P5 uses it. */
  const registry = Mapping.createProductionProducerRegistry({ hash: platform.hash,
    ...(reviewedDigest ? { materialDigest: reviewedDigest } : {}) });
  const controller = createLocalSourceController({ repository: held.repository,
    namespace, athleteId, deviceId, producerRegistry: registry, asOf: () => day, platform });
  let review;
  try { review = await controller.reviewSource(carried.name); }
  catch (error) {
    return { admitted: false, stage: 'review', code: error.code || error.message,
      controller, held, platform };
  }
  const prepared = await controller.prepareSource(review, { identityConfirmed: true });
  if (prepared.profile !== 'earned/local-source-qualification/v1')
    return { admitted: false, stage: 'prepare', controller, held, platform,
      codes: (prepared.issues || []).map(i => i.code) };
  const capability = localSourceCommitCapability(prepared);
  await capability.publish();
  const settled = await capability.reconcile();
  return { admitted: true, controller, held, platform, review,
    view: await controller.view(settled) };
}

/* WHICH MAPPING ADMITTED. basis.engine_digest is the profile's own digest over
   {mapping, execution}; recomputing it from production-mapping.cjs is a direct
   proof that the row that qualified is this file's, not a harness's. */
function productionEngineDigest(platform, materialDigest) {
  const mapping = Mapping.productionMapping({ materialDigest });
  return Profile.digest(platform.hash, 'earned/local-source-engine/v1',
    { mapping, execution: mapping.executions[0] });
}

async function run(tag, when) {
  const indexedDB = new IDBFactory(), names = scope(tag);
  const era = await eraFor({ indexedDB, live: liveAt(when.at), ...names });
  await firstRun(era, when.day);
  return { era, names };
}

test('P3-P0 - the suite really is standing in America/New_York', () => {
  assert.equal(Intl.DateTimeFormat().resolvedOptions().timeZone, 'America/New_York',
    'set TZ=America/New_York: the gate this mapping pins was run in that zone');
  assert.equal(Mapping.MAPPING_ID.includes('TEST-ONLY'), false,
    'the production mapping must not be a TEST-ONLY one');
});

for (const [label, when] of [['SUMMER (EDT)', SUMMER], ['WINTER (EST)', WINTER]])
  test('P3-P1 ' + label + ' - a bundle sealed by port.cjs is admitted end to end '
    + 'against the PRODUCTION mapping on ' + when.day, async () => {
    const { era, names } = await run('admit-' + when.day, when);
    const result = await admitWithProductionMapping(era, SEALED, { day: when.day, ...names });
    assert.deepEqual(result.codes || [], [], 'admission raised no issue');
    assert.equal(result.admitted, true, result.code || 'not admitted');
    assert.equal(result.view.ready, true);
    assert.equal(result.view.basis.engine_digest,
      productionEngineDigest(result.platform, result.held.materialDigest),
      'the basis was qualified by some OTHER mapping than production-mapping.cjs');
    assert.deepEqual(result.view.state.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS);
    assert.deepEqual(Object.keys(result.view.state.sessionLog).sort(), SOURCE_SESSION_DAYS);
    era.close();
  });

/* A BUNDLE FROM A DIFFERENT ENGINE IDENTITY. The whole engine directory is
   copied to the OS temp folder and one comment byte is added to the shim, so
   port.cjs seals a real bundle whose engine sha256 and treeSha256 are both
   someone else's. Nothing in the tree is touched. */
function sealFromAnotherEngine() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'p3m-eng-'));
  const engineDir = path.join(dir, 'engine'), out = path.join(dir, 'out');
  fs.mkdirSync(engineDir); fs.mkdirSync(out);
  const source = path.join(REPO, 'rebuild', 'engine');
  for (const name of fs.readdirSync(source).filter(n => n.endsWith('.cjs')))
    fs.copyFileSync(path.join(source, name), path.join(engineDir, name));
  const shim = path.join(engineDir, 'oracle-shim.cjs');
  fs.writeFileSync(shim, fs.readFileSync(shim, 'utf8')
    + '\n// SYNTHETIC: a different engine identity, for the refusal cell only.\n');
  const file = path.join(dir, 'invented-legacy-state.json');
  fs.copyFileSync(path.join(SEALED.dir, 'invented-legacy-state.json'), file);
  const run = spawnSync(process.execPath, [PORT, '--source', file, '--out', out,
    '--engine', shim], { cwd: REPO, encoding: 'utf8', timeout: 600000, windowsHide: true });
  if (run.status !== 0) throw new Error('port.cjs did not seal from the other engine ('
    + run.status + '): ' + String(run.stdout).slice(-600) + String(run.stderr).slice(-600));
  const names = fs.readdirSync(out);
  const bundleName = names.find(n => n.endsWith('.json'));
  const passName = names.find(n => n.endsWith('-PASSPHRASE.txt'));
  return { dir, bytes: new Uint8Array(fs.readFileSync(path.join(out, bundleName))),
    passphrase: fs.readFileSync(path.join(out, passName), 'utf8').trim() };
}

test('P3-P2 - a bundle sealed from a DIFFERENT engine identity refuses '
  + 'SOURCE_ENGINE_CONTEXT_UNPROVEN, and the mapping that refused is named',
  async () => {
    const other = sealFromAnotherEngine();
    const { era, names } = await run('other-engine', SUMMER);
    const result = await admitWithProductionMapping(era, other,
      { day: SUMMER.day, ...names });
    assert.equal(result.admitted, false);
    assert.equal(result.stage, 'review');
    assert.equal(result.code, 'SOURCE_ENGINE_CONTEXT_UNPROVEN');
    /* NAME IT: the mapping that refused is production-mapping.cjs, and the
       field it refused on is the engine identity it pins by byte. */
    assert.equal(Mapping.MAPPING_ID,
      'earned/import/production-producer-mapping/' + Mapping.ENGINE_REVISION);
    assert.notEqual(result.held.context.engine.sha256, Mapping.ENGINE.sha256,
      'the other bundle should not carry the pinned shim byte');
    assert.notEqual(result.held.context.engine.treeSha256, Mapping.ENGINE.treeSha256);
    era.close();
  });

/* THE SAME BUNDLE, PROVED ADMISSIBLE. Without this the cell above could be
   passing for any other reason; the only difference between the two runs is
   which engine sealed the file. */
test('P3-P3 - the pinned engine\'s own bundle admits on the same day and the '
  + 'same path, so P3-P2 is about the engine identity and nothing else',
  async () => {
    const { era, names } = await run('control', SUMMER);
    const result = await admitWithProductionMapping(era, SEALED, { day: SUMMER.day, ...names });
    assert.equal(result.admitted, true, result.code || (result.codes || []).join(','));
    assert.equal(result.held.context.engine.sha256, Mapping.ENGINE.sha256);
    assert.equal(result.held.context.engine.treeSha256, Mapping.ENGINE.treeSha256);
    era.close();
  });

/* P3-D-FOLLOWONS, item 2. THE WIRING A PAGE CAN ACTUALLY DO.
 *
 * Both mapping reviews' MAJOR 2: createProductionProducerRegistry used to need
 * the material digest at CONSTRUCTION, but source-admission.mjs takes its
 * registry at ITS construction and derives that digest only later, privately,
 * at :74. The only way to build the registry was to duplicate that private
 * derivation in the page - a sixth copy of a harness line. This cell does the
 * whole admission with NOTHING derived outside the controller: the repository
 * comes from the era's own host bindings and the registry is built from the
 * platform hash alone. `material()` - the harness helper that carries the
 * private copy - is not called at all, and the digest is read back OUT of the
 * basis the controller committed, which is the only place a page would ever
 * see it.
 */
const workoutCommands = require_('../../workout/commands.cjs').createWorkoutCommands({
  prescriptionCapture: require_('../../workout/capture.cjs')
    .createPrescriptionCapture({ parseStrictJson }) });

test('P3-P4 - the production registry is built from the platform hash ALONE and '
  + 'admits end to end: no material digest is derived outside the controller',
  async () => {
    const { era, names } = await run('wired', SUMMER);
    const platform = createSourcePlatform();
    const carried = await era.client.importBundle({ bundleBytes: SEALED.bytes,
      passphrase: SEALED.passphrase });
    assert.equal(carried.imported, true, carried.code);
    const repository = (await era.client.hostBindings({ workoutCommands })).repository;
    /* THE WHOLE PRODUCTION WIRING, in two lines and with no private copy. */
    const registry = Mapping.createProductionProducerRegistry({ hash: platform.hash });
    const controller = createLocalSourceController({ repository, producerRegistry: registry,
      asOf: () => SUMMER.day, platform, namespace: names.namespace,
      athleteId: names.athleteId, deviceId: names.deviceId });
    const review = await controller.reviewSource(carried.name);
    const prepared = await controller.prepareSource(review, { identityConfirmed: true });
    assert.equal(prepared.profile, 'earned/local-source-qualification/v1',
      'the production mapping qualified the bundle with no digest supplied to it');
    const capability = localSourceCommitCapability(prepared);
    await capability.publish();
    const view = await controller.view(await capability.reconcile());
    assert.equal(view.ready, true);
    /* The digest the controller derived, read back out of its own basis, is the
       one the row was bound to - so the qualify-time binding is the real one. */
    assert.equal(view.basis.engine_digest,
      productionEngineDigest(platform, view.basis.material_digest));
    assert.deepEqual(view.state.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS);
    era.close();
  });

/* THE REVIEWED ROW'S RED SIDE. A registry PINNED by hand to some other bundle's
   material digest is the brief's section 5 shape with the wrong number in it,
   and it must refuse rather than admit the file in front of it. P3-P4 above is
   this cell's control: same bundle, same day, same device shape, the only
   difference being which digest the row was bound to. */
test('P3-P5 - a REVIEWED execution row pinned to the wrong material refuses '
  + 'SOURCE_ENGINE_CONTEXT_UNPROVEN at review, and commits nothing', async () => {
  const { era, names } = await run('wrong-digest', SUMMER);
  const before = await durable(era);
  const result = await admitWithProductionMapping(era, SEALED,
    { day: SUMMER.day, ...names, reviewedDigest: 'f'.repeat(64) });
  assert.equal(result.admitted, false);
  assert.equal(result.stage, 'review');
  assert.equal(result.code, 'SOURCE_ENGINE_CONTEXT_UNPROVEN');
  assert.notEqual(result.held.materialDigest, 'f'.repeat(64),
    'the bundle really does present a digest of its own');
  const after = await durable(era);
  assert.equal(after.basis, false, 'no basis was committed');
  assert.equal(after.applied, false);
  assert.equal(after.ops, before.ops, 'and the refusal minted no operation');
  era.close();
});

/* P3-P6 - M2-S6-TODAY-CHILD BAR ROW 23, EXECUTED AS A CELL.
 *
 * The row: rotating the coach's ENGINE_REVISION constant - which S6's own
 * ff-merge does, once (DECISIONS:456, :465-467) - must not invalidate an import
 * already admitted under the previous one. Round 1 argued it from a whole-tree
 * scan and the review was right that an argument with no red side is not the
 * row. So it is MEASURED here, on the real admission, in the one order that
 * makes it a proof: admit under the STANDING constant by name, rotate the
 * constant, and read the SAME store back through a mapping built after the
 * rotation.
 *
 * THE ROTATION IS REAL AND TOUCHES NO BYTE. rebuild/coach is not edited (this
 * package moves no coach byte and engine-revision.test.cjs must stay green):
 * the constant is substituted in the MODULE CACHE and production-mapping.cjs is
 * re-required over it, which is exactly what the ff-merge does to the running
 * bundle and nothing more. The substituted value is deliberately NOT S6's real
 * one - a literal nobody will ever ship makes the cell independent of whatever
 * the PM pastes into that file.
 *
 * THE RED SIDE IS IN THE CELL. The two digests the rotation moves are asserted
 * to DIFFER, and the admitted record is then asserted to read back unchanged
 * anyway. A qualify() that compared the stored value to the current one would
 * fail the read three lines below, which is the mutant the author report
 * records as applied, run and reverted. */
const ROTATED = 'M2-NOT-A-REAL-PACKAGE@abcdef0123456789';

/* Re-require production-mapping.cjs over a substituted coach constant. Both
   cache entries are restored before this returns to the caller's next line, so
   the rest of the file - and every other suite in the process - keeps the real
   module object it already holds. */
function mappingUnder(revision) {
  const coach = require_.resolve('../../../coach/engine-revision.cjs');
  const mapping = require_.resolve('../production-mapping.cjs');
  const heldCoach = require_.cache[coach], heldMapping = require_.cache[mapping];
  require_.cache[coach] = { id: coach, filename: coach, loaded: true, children: [],
    paths: [], exports: { ENGINE_REVISION: revision } };
  delete require_.cache[mapping];
  try { return require_(mapping); }
  finally {
    if (heldCoach) require_.cache[coach] = heldCoach; else delete require_.cache[coach];
    if (heldMapping) require_.cache[mapping] = heldMapping; else delete require_.cache[mapping];
  }
}

test('P3-P6 - BAR ROW 23: the coach ENGINE_REVISION rotates and an import admitted under the '
  + 'OLD constant is still admitted, still adopted and still retractable', async () => {
  /* 1. THE STANDING CONSTANT, BY NAME. If this line ever has to change, the
        row has to be re-run against whatever replaced it. */
  assert.equal(Mapping.ENGINE_REVISION, 'M2-S5-TODAY-CHILD@0df73b01f3d2d935',
    'the standing coach constant moved: re-run bar row 23 against the new one');
  const { era, names } = await run('row23', SUMMER);
  const admitted = await admitWithProductionMapping(era, SEALED, { day: SUMMER.day, ...names });
  assert.equal(admitted.admitted, true, admitted.code || (admitted.codes || []).join(','));
  const storedDigest = admitted.view.basis.engine_digest;
  const storedBasis = admitted.view.basis;
  const storedState = admitted.view.state;
  assert.equal(storedDigest, productionEngineDigest(admitted.platform, admitted.held.materialDigest),
    'the record was not qualified by production-mapping.cjs at all');

  /* 2. THE ROTATION. Only the suffix moves: the profile path in front of it is
        the mapping's identity and is not a version. */
  const Rotated = mappingUnder(ROTATED);
  assert.equal(Rotated.ENGINE_REVISION, ROTATED, 'the substitution did not take');
  assert.equal(Rotated.MAPPING_ID, 'earned/import/production-producer-mapping/' + ROTATED);
  assert.notEqual(Rotated.MAPPING_ID, Mapping.MAPPING_ID);
  const prefix = id => id.slice(0, id.lastIndexOf('/') + 1);
  assert.equal(prefix(Rotated.MAPPING_ID), prefix(Mapping.MAPPING_ID),
    'the displayed id moved somewhere other than its suffix');
  assert.equal(Mapping.ENGINE_REVISION, 'M2-S5-TODAY-CHILD@0df73b01f3d2d935',
    'the cache restore leaked: the live module object moved');

  /* 3. THE TWO VALUES A ROTATION-SENSITIVE READ WOULD COMPARE, AND THEY DIFFER.
        Without this the rest of the cell could pass because the rotation moves
        nothing at all. */
  const rotatedMapping = Rotated.productionMapping({ materialDigest: admitted.held.materialDigest });
  const rotatedDigest = Profile.digest(admitted.platform.hash, 'earned/local-source-engine/v1',
    { mapping: rotatedMapping, execution: rotatedMapping.executions[0] });
  assert.notEqual(rotatedDigest, storedDigest,
    'the rotation does not move the engine digest, so this cell would prove nothing');
  assert.notEqual(rotatedMapping.id, admitted.view.basis.engine_digest ? Mapping.MAPPING_ID : null);
  assert.equal(rotatedMapping.engine_revision, ROTATED);

  /* 4. STILL ADMITTED, read back through a controller whose registry was built
        AFTER the rotation - the page a rotated bundle would boot. reopen() is
        the real route: it re-qualifies the SAME source through the ROTATED
        registry and refuses unless the recorded selection is still the one in
        front of it, so this is a re-admission under the new constant and not a
        cached read. */
  const recorded = (await era.generation()).generation.metadata.localSources;
  const name = recorded.selections[recorded.active].name;
  const registry = Rotated.createProductionProducerRegistry({ hash: admitted.platform.hash });
  const controller = createLocalSourceController({ repository: admitted.held.repository,
    ...names, producerRegistry: registry, asOf: () => SUMMER.day, platform: admitted.platform });
  const view = await controller.view(await controller.reopen(name));
  assert.equal(view.ready, true, 'the admitted import stopped being ready after the rotation');
  /* AND THE ONE THING THE ROTATION DOES MOVE, MEASURED RATHER THAN GLOSSED. A
     re-qualification names the mapping that qualified IT, so the fresh
     qualification's engine_digest is the ROTATED one - that is what the field is
     for. What matters for the row is that the re-qualification SUCCEEDS instead
     of refusing, and that it commits nothing: the DURABLE record below still
     carries the digest it was admitted under. */
  assert.equal(view.basis.engine_digest, rotatedDigest,
    'the reopened qualification does not name the mapping that qualified it');
  assert.equal(view.basis.source_digest, storedBasis.source_digest,
    'the source the record names moved under a rotation');
  assert.deepEqual(view.state.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS);
  assert.deepEqual(Object.keys(view.state.sessionLog).sort(), SOURCE_SESSION_DAYS);
  assert.deepEqual(view.state, storedState, 'the imported history read differently after the rotation');
  const still = (await era.generation()).generation.metadata.localSources;
  assert.equal(still.active, recorded.active, 'the reopen moved the active selection');
  assert.equal(still.selections[still.active].basis.engine_digest, storedDigest,
    'the DURABLE record was rewritten under the new constant by a read');

  /* 5. STILL ADOPTED: what TODAY reads, off the same generation, by the same
        consumer the page adopts through. */
  const generation = (await era.generation()).generation;
  const adopted = admittedLocalSourceBasis(generation, { namespace: names.namespace });
  assert.ok(adopted, 'Today stopped adopting the imported history after the rotation');
  assert.deepEqual(Object.keys(adopted.sessionLog).sort(), SOURCE_SESSION_DAYS);
  assert.deepEqual(adopted.exercises.map(e => [e.id, e.w]).sort(), IMPORTED_LOADS);

  /* 6. STILL RETRACTABLE, and the word is used the way the product uses it.
        retractImport() REFUSES an admitted import by name (lanes/d P3D-3): his
        history leaves by the other path, rollback(), which re-qualifies the
        recorded selection. Both halves are executed here under the ROTATED
        registry, because either one breaking would mean an athlete could not
        undo an import made before the ff-merge. */
  const refused = await retractImport(era.client, name, 'review-refused');
  assert.equal(refused.retracted, false, 'an admitted import became retractable under a rotation');
  assert.equal(typeof refused.code, 'string', 'the refusal lost its name under a rotation');
  const rolled = await controller.view(await controller.rollback(recorded.active));
  assert.equal(rolled.ready, true, 'the admitted import could not be rolled back after the rotation');
  assert.equal(rolled.basis.source_digest, storedBasis.source_digest,
    'the rollback re-qualified some other source');
  era.close();
});
