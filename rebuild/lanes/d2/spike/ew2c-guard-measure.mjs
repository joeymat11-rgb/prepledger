/* Measured paper only. Candidate modules and diffs live in OS temp.
   No source fixture outside the invented synthetic envelopes is opened here. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, carry,
  material, producerRegistryFor, SETUP, shellWindow, slot, tap, pickBundle,
  parseStrictJson } from './ew2c-synthetic-envelope.mjs';
import * as original from '../../../m3/w6/local/source-admission.mjs';
import { refusalLines, createImportScreen } from '../../../m3/w7-preview/import/import-screen.mjs';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ew2c-'));
const admission = 'rebuild/m3/w6/local/source-admission.mjs';
const screen = 'rebuild/m3/w7-preview/import/import-screen.mjs';
const code = 'LOCAL_SOURCE_SECOND_ADMISSION_REFUSED';
const copy = 'This phone already uses one history file, so importing another is not available yet.';
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const before = { [admission]: read(admission), [screen]: read(screen) };
const prepareAnchor = "  if(identityConfirmed!==true&&!existingSelection)fail('LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED');";
const guard = "  if(!existingSelection&&Object.keys(held.generation.metadata.localSources?.selections||{}).length)fail('" + code + "');";
const reviewAnchor = "  if(entries.length!==1)fail(entries.length?'LOCAL_SOURCE_IMPORT_AMBIGUOUS':'LOCAL_SOURCE_IMPORT_REQUIRED');const entry=entries[0];";
const reviewGuard = "  if(Object.values(held.generation.metadata.localSources?.selections||{}).some(s=>s.name!==name))fail('" + code + "');";
function insert(source, anchor, line) {
  assert.equal(source.split(anchor).length, 2, 'unique anchor');
  return source.replace(anchor, anchor + '\n' + line);
}
const preparedText = insert(before[admission], prepareAnchor, guard);
const reviewedText = insert(before[admission], reviewAnchor, reviewGuard);
const screenText = insert(before[screen], 'export const REFUSAL_SENTENCE = Object.freeze({',
  "  " + code + ": '" + copy + "',");
function count(label, rel, next) {
  const a = path.join(dir, label + '-before.txt'), b = path.join(dir, label + '-after.txt');
  fs.writeFileSync(a, before[rel]); fs.writeFileSync(b, next);
  const result = spawnSync('git', ['diff', '--no-index', '--numstat', '--', a, b],
    { encoding: 'utf8', windowsHide: true });
  assert.equal(result.status, 1);
  const [added, removed] = result.stdout.trim().split(/\s+/).map(Number);
  console.log('COUNT ' + label + ' +' + added + ' -' + removed);
  assert.equal(added, 1); assert.equal(removed, 0);
}
count('prepare', admission, preparedText);
count('review-alternative', admission, reviewedText);
count('sentence', screen, screenText);
const seal = JSON.parse(read('rebuild/m4/spec/acceptance-s8-real-shape.json'));
assert.ok(seal.product && seal.executionPins);
for (const p of [admission, screen]) console.log(p + ' S8-product=' + Object.hasOwn(seal.product, p)
  + ' execution-pin=' + Object.hasOwn(seal.executionPins, p));
function scratchModule(label, rel, source) {
  const base = pathToFileURL(path.join(root, rel));
  const resolved = source.replace(/(\bfrom\s*['"])(\.[^'"]+)(['"])/g,
    (_, a, spec, b) => a + new URL(spec, base).href + b);
  const file = path.join(dir, label + '.mjs'); fs.writeFileSync(file, resolved);
  return pathToFileURL(file).href;
}
const candidateURL = scratchModule('prepare-candidate', admission, preparedText);
const candidate = await import(candidateURL);
const alternative = await import(scratchModule('review-candidate', admission, reviewedText));
const candidateScreen = await import(scratchModule('screen-candidate', screen, screenText));
assert.deepEqual(refusalLines(code, null, null), [code]);
assert.deepEqual(refusalLines('EW2C_NEVER_SEEN_CODE', null, null), ['EW2C_NEVER_SEEN_CODE']);
assert.deepEqual(candidateScreen.refusalLines(code, null, null), [code, copy]);
console.log('UNKNOWN CODE TODAY: ' + refusalLines(code, null, null).join(' '));
console.log('PROPOSED COPY: ' + copy);

const A = sealInventedBundle();
const B = sealInventedBundle(SETUP,
  { sessions: [['2026-08-14', 'U'], ['2026-08-18', 'L'], ['2026-08-24', 'U']] });
for (const fixture of [A, B]) assert.deepEqual(fixture.evidence,
  { oracle: 'synthetic', counts: 'synthetic', producer: 'synthetic' });
console.log('FIXTURE invented envelope; oracle/count metadata and producer evidence are synthetic');
const day = '2026-09-16', at = day + 'T16:00:00.000Z';
const scope = { databaseName: 'ew2c-guard', namespace: 'synthetic/ew2c-guard',
  athleteId: 'ath-ew2b', deviceId: 'dev-ew2b' };
async function boot(indexedDB = new IDBFactory(), enrol = true) {
  const era = await eraFor({ indexedDB, live: liveAt(at), ...scope });
  if (enrol) await firstRun(era, day);
  return era;
}
async function controller(era, file, mod, existingName = null, wrap = x => x) {
  const { carried, platform } = await carry(era, file);
  if (!existingName) assert.equal(carried.imported, true);
  const name = existingName || carried.name;
  const held = await material(era, platform, name);
  const c = mod.createLocalSourceController({ repository: wrap(held.repository), ...scope,
    producerRegistry: producerRegistryFor({ platform, ...held }), asOf: () => day, platform });
  return { c, name, repo: held.repository };
}
const qualify = async ({ c, name }) => c.prepareSource(await c.reviewSource(name),
  { identityConfirmed: true, prefixAnswer: true });
async function publish(mod, h) {
  const cap = mod.localSourceCommitCapability(h); await cap.publish(); return cap.reconcile();
}
const state = async era => (await era.generation()).generation;
const selections = g => g.metadata.localSources?.selections || {};
const absent = g => {
  assert.equal(Object.keys(selections(g)).length, 0);
  assert.equal(g.metadata.localSourceApplication, undefined);
  assert.equal(g.collections.derived?.localSource, undefined);
};

// Render the real refusal box via the screen's own file read error path.
// Fault injection supplies only the novel code; the draw is unmodified.
for (const [label, factory] of [['today', createImportScreen], ['copy-candidate', candidateScreen.createImportScreen]]) {
  const e = await boot(), win = shellWindow(), doc = win.document;
  const root = doc.createElement('main'); doc.body.append(root);
  const ui = factory({ doc, installation: { client: e.client, ...scope }, day: () => day });
  await ui.paint(root);
  assert.ok(doc.getElementById('import-file'));
  pickBundle(win, doc.getElementById('import-file'), new Uint8Array([1]));
  await ui.settled(); await ui.paint(root);
  win.File.prototype.arrayBuffer = async () => { throw Object.assign(new Error('synthetic'), { code }); };
  tap(slot(doc, 'import-unlock'));
  await ui.settled(); await ui.paint(root);
  assert.equal(slot(doc, 'import-refusal').textContent, code + (label === 'today' ? '' : ' ' + copy));
  console.log('DRAW ' + label + ': ' + slot(doc, 'import-refusal').textContent);
  const summary = factory({ doc, installation: { client: e.client, ...scope }, admitted: () => true });
  await summary.paint(root);
  assert.equal(doc.getElementById('import-file'), null);
  e.close(); win.close();
}
console.log('SCREEN admitted=true: chooser absent');

// An actual IndexedDB abort after the active write request succeeds.
const inner = new IDBFactory();
let armed = false, aborts = 0;
const indexedDB = { open(...args) {
  const request = inner.open(...args);
  request.addEventListener('success', () => {
    const db = request.result, transaction = db.transaction.bind(db);
    db.transaction = (...args) => {
      const tx = transaction(...args);
      if (!armed || args[1] !== 'readwrite') return tx;
      const objectStore = tx.objectStore.bind(tx);
      tx.objectStore = name => {
        const store = objectStore(name), put = store.put.bind(store);
        store.put = (value, key) => {
          const req = put(value, key);
          if (armed && key === 'active') {
            armed = false;
            req.addEventListener('success', () => { aborts++; tx.abort(); });
          }
          return req;
        };
        return store;
      };
      return tx;
    };
  });
  return request;
} };
let era = await boot(indexedDB);
let c = await controller(era, A, candidate);
const badReview = await c.c.reviewSource(c.name);
const beforeIdentityRefusal = await era.generation();
await assert.rejects(() => c.c.prepareSource(badReview, { identityConfirmed: false }),
  { code: 'LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED' });
assert.deepEqual(await era.generation(), beforeIdentityRefusal,
  'identity refusal changed the complete loaded generation');
absent(await state(era));
const retract = await era.client.retractImport(c.name, 'review-refused');
assert.equal(retract.retracted, true);
absent(await state(era));
era.close();
era = await boot(indexedDB, false);
absent(await state(era));
c = await controller(era, A, candidate);
const h = await qualify(c), beforeAbort = await state(era);
absent(beforeAbort);
armed = true;
await assert.rejects(() => candidate.localSourceCommitCapability(h).publish(), { code: 'TRANSACTION_ABORTED' });
assert.equal(aborts, 1);
assert.deepEqual(await state(era), beforeAbort);
era.close();
era = await boot(indexedDB, false);
absent(await state(era));
c = await controller(era, A, candidate, c.name);
const retry = await publish(candidate, await qualify(c));
assert.equal((await c.c.view(retry)).ready, true);
const first = await state(era);
assert.equal(Object.keys(selections(first)).length, 1);
era.close();
era = await boot(indexedDB, false);
assert.deepEqual(selections(await state(era)), selections(first));
c = await controller(era, A, candidate, c.name);
assert.equal((await c.c.view(await c.c.reopen(c.name))).ready, true);
const roll = await publish(candidate, await c.c.rollback(first.metadata.localSources.active));
assert.equal((await c.c.view(roll)).ready, true);
assert.equal(Object.keys(selections(await state(era))).length, 2);
const beforeSecondCarry = await era.generation();
const second = await controller(era, B, candidate);
const afterSecondCarry = await era.generation();
assert.equal(afterSecondCarry.revision, beforeSecondCarry.revision + 1);
await assert.rejects(() => qualify(second), { code });
assert.deepEqual(await era.generation(), afterSecondCarry,
  'second-source prepare refusal changed the complete loaded generation');
assert.equal((await era.client.retractImport(second.name, 'review-refused')).retracted, true);
const afterSecondRetract = await era.generation();
const retainedSecond = await second.repo.importCustody({ parseStrictJson,
  validateContext: () => null }).load(second.name);
assert.ok(retainedSecond.sourceBytes.length);
assert.equal(afterSecondRetract.revision, beforeSecondCarry.revision + 2);
assert.deepEqual(afterSecondRetract.generation.metadata.imports,
  beforeSecondCarry.generation.metadata.imports);
assert.equal((afterSecondRetract.generation.metadata.importRetractions || []).length,
  (beforeSecondCarry.generation.metadata.importRetractions || []).length + 1);
assert.deepEqual(afterSecondRetract.generation.metadata.localSources,
  beforeSecondCarry.generation.metadata.localSources);
assert.deepEqual(afterSecondRetract.generation.metadata.localSourceApplication,
  beforeSecondCarry.generation.metadata.localSourceApplication);
assert.deepEqual(afterSecondRetract.generation.collections, beforeSecondCarry.generation.collections);
assert.equal(Object.keys(selections(afterSecondRetract.generation)).length, 2);
era.close();
console.log('PREPARE: failed identity + retraction + reload + retry PASS');
console.log('PREPARE: aborted active write + unchanged generation + reload + retry PASS');
console.log('PREPARE: committed selection survives reload; reopen and same-source rollback PASS');
console.log('PREPARE: second refusal is write-free; carry/retract changes custody and revision only PASS');

// Already-carried B cannot bypass either admission guard. A custody-only guard
// would never run again here: both importBundle calls happen before admission.
for (const [label, mod] of [['baseline', original], ['prepare', candidate], ['review', alternative]]) {
  const e = await boot();
  const a = await controller(e, A, mod), b = await controller(e, B, mod);
  await publish(mod, await qualify(a));
  const g1 = await state(e);
  if (label === 'baseline') {
    await publish(mod, await qualify(b));
    const g2 = await state(e);
    assert.equal(Object.keys(selections(g2)).length, 2);
    assert.notEqual(g2.collections.derived.localSource.basis.source_digest,
      g1.collections.derived.localSource.basis.source_digest);
    for (const s of Object.values(selections(g2))) {
      assert.ok(s.basis.source_digest); assert.ok(s.identity_review);
      assert.equal(s.order_map, null); assert.ok(s.order_input);
    }
    assert.deepEqual(g2.collections.ops, g1.collections.ops);
    assert.deepEqual(g2.collections.outbox, g1.collections.outbox);
  } else {
    await assert.rejects(() => qualify(b), { code });
    assert.deepEqual(await state(e), g1);
    assert.equal((await a.c.view(await a.c.reopen(a.name))).ready, true);
  }
  e.close(); console.log('PRE-CARRIED B ' + label + ': PASS');
}

// A lost reply is not a rollback. Publication happened; the marker must remain.
const ack = await boot();
const ac = await controller(ack, A, candidate, null, repo => ({ ...repo,
  async commit(...args) { await repo.commit(...args); throw Object.assign(new Error('synthetic'), { code: 'EW2C_ACK_LOST' }); } }));
const ah = await qualify(ac);
await assert.rejects(() => candidate.localSourceCommitCapability(ah).publish(), { code: 'EW2C_ACK_LOST' });
assert.equal(Object.keys(selections(await state(ack))).length, 1);
assert.equal((await ac.c.view(await candidate.localSourceCommitCapability(ah).reconcile())).ready, true);
ack.close(); console.log('LOST ACK: selection retained; reconcile PASS');

const race = await boot();
const ra = await controller(race, A, candidate), rb = await controller(race, B, candidate);
const qa = await qualify(ra), qb = await qualify(rb);
await publish(candidate, qa);
const won = await state(race);
await assert.rejects(() => candidate.localSourceCommitCapability(qb).publish(), { code: 'STALE_REVISION' });
assert.deepEqual(await state(race), won);
await assert.rejects(() => qualify(rb), { code });
race.close(); console.log('PREQUALIFIED RACE: stale CAS refused; fresh review refused by new name PASS');
for (const [p, text] of Object.entries(before)) assert.equal(read(p), text);
console.log('PRODUCT BYTES UNCHANGED');
console.log('SCRATCH ' + dir);
console.log('CANDIDATE_URL ' + candidateURL);
