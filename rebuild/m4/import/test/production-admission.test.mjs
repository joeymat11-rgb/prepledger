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
  IMPORTED_LOADS, SOURCE_SESSION_DAYS, REPO, PORT, Profile }
  from '../../../m3/w7-preview/import/test/support.mjs';
import { createLocalSourceController, localSourceCommitCapability }
  from '../../../m3/w6/local/source-admission.mjs';

const require_ = createRequire(import.meta.url);
const Mapping = require_('../production-mapping.cjs');

const SUMMER = { day: '2026-09-16', at: '2026-09-16T16:00:00.000Z' };
const WINTER = { day: '2026-11-20', at: '2026-11-20T17:00:00.000Z' };
const SEALED = sealInventedBundle();

const scope = tag => ({ databaseName: 'p3m-' + tag, namespace: 'joe/p3m-' + tag,
  athleteId: 'ath-p3m', deviceId: 'dev-p3m' });

/* THE REAL CALL SEQUENCE AN IMPORT SCREEN MUST MAKE, with the one registry
   this ticket authors and nothing else injected. */
async function admitWithProductionMapping(era, sealed, { day, namespace, athleteId, deviceId }) {
  const { carried, platform } = await carry(era, sealed);
  if (!carried.imported) return { admitted: false, stage: 'custody', code: carried.code };
  const held = await material(era, platform, carried.name);
  const registry = Mapping.createProductionProducerRegistry({ hash: platform.hash,
    materialDigest: held.materialDigest });
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
