/* DECISIONS:631 O-3. ew2b-r39-second-admission's real admission journey,
   with only journeys 3 and 5 inverted; journey 6 is restored from its probe
   (the original pin omitted that control). Invented sealed inputs only.
   Collect failures so both required red journeys run before exit 1.
   The second-admission consequences become non-publication invariants.
   Optional controller URL is a scratch-only candidate, never a product edit. */
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, admit,
  SETUP, carry, material, producerRegistryFor } from '../../../m3/w7-preview/import/test/support.mjs';

const candidate = process.argv[2] ? await import(process.argv[2]) : null;
const CODE = 'LOCAL_SOURCE_SECOND_ADMISSION_REFUSED';
const days = ['2026-09-16', '2026-09-17', '2026-09-18'];
const files = [sealInventedBundle(), sealInventedBundle(SETUP,
  { sessions: [['2026-08-14', 'U'], ['2026-08-18', 'L'], ['2026-08-24', 'U']] }),
sealInventedBundle(SETUP,
  { sessions: [['2026-08-14', 'U'], ['2026-08-17', 'L'], ['2026-08-31', 'U']] })];
const names = { databaseName: 'ew2c-r39', namespace: 'synthetic/ew2c-r39',
  athleteId: 'ath-ew2b', deviceId: 'dev-ew2b' };
async function attempt(era, file, day) {
  try {
    if (!candidate) return await admit(era, file, { day, ...names });
    const { carried, platform } = await carry(era, file);
    if (!carried.imported) return { admitted: false, stage: 'custody', code: carried.code };
    const held = await material(era, platform, carried.name);
    const controller = candidate.createLocalSourceController({ repository: held.repository,
      ...names, platform, asOf: () => day,
      producerRegistry: producerRegistryFor({ platform, ...held }) });
    const review = await controller.reviewSource(carried.name);
    const prepared = await controller.prepareSource(review, { identityConfirmed: true, prefixAnswer: true });
    if (prepared.profile !== 'earned/local-source-qualification/v1')
      return { admitted: false, stage: 'prepare', codes: prepared.issues.map(i => i.code) };
    const cap = candidate.localSourceCommitCapability(prepared);
    await cap.publish();
    return { admitted: true, view: await controller.view(await cap.reconcile()) };
  } catch (e) { return { admitted: false, stage: 'throw', code: e.code || e.message }; }
}
async function record(era) {
  const { generation: g } = await era.generation();
  return { sources: g.metadata.localSources, application: g.metadata.localSourceApplication,
    derived: g.collections.derived.localSource, ops: g.collections.ops, outbox: g.collections.outbox };
}
const results = [];
function check(id, actual, assertions) {
  let ok = true;
  try { assertions(); } catch { ok = false; }
  results.push({ id, ok });
  console.log('J' + id + ' ' + (ok ? 'PASS' : 'RED') + ' actual=' +
    (actual.admitted ? 'ADMITTED' : (actual.code || actual.codes?.[0])));
}
const indexedDB = new IDBFactory();
const era1 = await eraFor({ indexedDB, live: liveAt(days[0] + 'T16:00:00.000Z'), ...names });
await firstRun(era1, days[0]);
const first = await attempt(era1, files[0], days[0]);
const afterA = await record(era1);
check(1, first, () => { assert.equal(first.admitted, true); assert.equal(first.view.ready, true);
  assert.equal(Object.keys(afterA.sources.selections).length, 1);
  assert.equal(afterA.derived.basis.local_selection_id, afterA.sources.active); });
const same = await attempt(era1, files[0], days[1]);
check(2, same, () => { assert.equal(same.admitted, false); assert.equal(same.stage, 'custody');
  assert.equal(same.code, 'LOCAL_IMPORT_ALREADY_PRESENT'); });
const second = await attempt(era1, files[1], days[1]);
const afterB = await record(era1);
check(3, second, () => { assert.equal(second.admitted, false); assert.equal(second.code || second.codes?.[0], CODE);
  assert.deepEqual(afterB, afterA, 'second source must not publish or rewrite an operation'); });
era1.close();
const era2 = await eraFor({ indexedDB, live: liveAt(days[2] + 'T16:00:00.000Z'), ...names });
const sameCold = await attempt(era2, files[0], days[2]);
check(4, sameCold, () => { assert.equal(sameCold.admitted, false); assert.equal(sameCold.stage, 'custody');
  assert.equal(sameCold.code, 'LOCAL_IMPORT_ALREADY_PRESENT'); });
const beforeC = await record(era2);
const third = await attempt(era2, files[2], days[2]);
const afterC = await record(era2);
check(5, third, () => { assert.equal(third.admitted, false); assert.equal(third.code || third.codes?.[0], CODE);
  assert.deepEqual(afterC, beforeC, 'never-carried source must not publish after reload'); });
era2.close();
const fresh = await eraFor({ indexedDB: new IDBFactory(), live: liveAt(days[0] + 'T16:00:00.000Z'), ...names });
await firstRun(fresh, days[0]);
const control = await attempt(fresh, files[1], days[0]);
check(6, control, () => { assert.equal(control.admitted, true); assert.equal(control.view.ready, true); });
fresh.close();
const reds = results.filter(r => !r.ok).map(r => r.id);
console.log('RED journeys: ' + (reds.join(',') || 'none'));
process.exitCode = reds.length ? 1 : 0;
