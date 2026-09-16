/* P3-IMPORT-RETRACT (DECISIONS:475 (2)) - THE ATHLETE TAKES A STAGED FILE BACK.

   Fable's constraint (ii): reviewSource reads from custody, so importBundle
   MUST commit before any review or identity question can be shown, and a
   refused or cancelled review used to leave a named entry with
   rebaseRequired: true and IMPORT_REBASE_REQUIRED on every boot, for a file
   that was never adopted. These cells drive the real machinery over the real
   fake-indexeddb store - no stubs, no hand-built generations - and measure the
   durable record before and after every step.

   Everything here is SYNTHETIC: the bundle is sealed by the real port.cjs from
   a file invented through the ACCEPTED clean-init constructor, exactly as
   ../../../m3/w7-preview/import/test/support.mjs does. No ledger, no owner
   data, no private fixture is read, named or reachable from here. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { IDBFactory, sealInventedBundle, liveAt, eraFor, firstRun, durable, carry, admit,
  material, createSourcePlatform, webcrypto, SETUP, STRANGER_SETUP } from '../../../m3/w7-preview/import/test/support.mjs';
import { openTodayOverLocalEra } from '../../../m3/w6/local/today-bindings.mjs';
import { admittedLocalSourceBasis } from '../../../m3/w7-preview/today/local-source-basis.mjs';
import { createCleanInitState } from '../../../m3/w7-preview/today/setup-model.mjs';
import PlanEdit from '../../../m4/workout/plan-edit-model.cjs';
import { retractImport, listImports, listImportRetractions, importRetracted,
  importRetractions, LOCAL_IMPORT_RETRACT_PROFILE } from '../../../m3/w6/local/browser-entry.mjs';

const DAY = '2026-09-16', AT = '2026-09-16T16:00:00.000Z';
const SEALED = sealInventedBundle();
const STRANGER = sealInventedBundle(STRANGER_SETUP);
const REASON = 'review-refused';

const scope = tag => ({ databaseName: 'p3-retract-' + tag, namespace: 'joe/p3x-' + tag,
  athleteId: 'ath-p3x', deviceId: 'dev-p3x' });

/* An enrolled installation with its own first-run operation, so every import
   below lands on a generation that ALREADY holds ops - the fresh-start-then-port
   case (DECISIONS:100), where the import seeds no cache and only flags a rebase. */
async function device(tag, { enrolFirstRun = true, cleanInit } = {}) {
  const names = scope(tag), indexedDB = new IDBFactory();
  const era = await eraFor({ indexedDB, live: liveAt(AT), ...names, ...(cleanInit ? { cleanInit } : {}) });
  if (enrolFirstRun) await firstRun(era, DAY);
  return { era, names, indexedDB };
}

/* EVERY CONSUMER READ, in one record. This is what "the generation is as if the
   file had never been staged" is measured as: the import register, the boot
   flag and its code, the cache the page paints from, the P2 import join that
   Today adopts through, and the plan-edit companion's own presence gate. */
async function consumerView(era, names) {
  const loaded = await era.generation(), booted = await era.client.boot();
  return { imports: (await era.client.imports()).map(entry => entry.name),
    importRebaseRequired: booted.importRebaseRequired, derivedCode: booted.derivedCode,
    derivedStale: booted.derivedStale, derived: booted.derived,
    admittedBasis: admittedLocalSourceBasis(loaded.generation,
      { athleteLabel: SETUP.athlete_label, namespace: names.namespace }),
    companionImportPresent: PlanEdit.importPresentIn(loaded.generation),
    ops: Object.keys(loaded.generation.collections.ops || {}).sort() };
}

/* The raw store, counted by key. "Nothing was deleted" is this list before and
   after, not a claim: the custody record's own key must still be there. */
const storeKeys = (indexedDB, databaseName) => new Promise((resolve, reject) => {
  const request = indexedDB.open(databaseName);
  request.onerror = () => reject(request.error);
  request.onsuccess = () => {
    const db = request.result;
    let keys = null;
    const tx = db.transaction('generations', 'readonly');
    const all = tx.objectStore('generations').getAllKeys();
    all.onsuccess = () => { keys = all.result.map(key => JSON.stringify(key)).sort(); };
    tx.oncomplete = () => { db.close(); resolve(keys); };
    tx.onabort = () => { db.close(); reject(tx.error); };
    tx.onerror = () => {};
  };
});

/* The durable import-lane record count: live entries plus retract records. The
   register is APPEND-ONLY in this number - a retract adds its own record and
   carries the superseded entry inside it, so the count only ever grows. */
async function register(era) {
  const g = (await era.generation()).generation;
  return { entries: (g.metadata.imports || []).length,
    retractions: importRetractions(g).length,
    records: (g.metadata.imports || []).length + importRetractions(g).length };
}

const sourceJsonOf = async (era, name) =>
  (await material(era, createSourcePlatform(), name)).raw.source_json;

test('P3D-1 - stage -> REFUSED AT REVIEW -> retract: every consumer read is the pre-stage one',
  async () => {
    const { era, names } = await device('review-refused');
    const before = await consumerView(era, names), beforeDurable = await durable(era);
    const attempt = await admit(era, STRANGER, { day: DAY, ...names });
    assert.equal(attempt.admitted, false, 'a stranger file is refused by the machinery, not by a stub');
    assert.equal(attempt.stage, 'prepare');
    assert.ok(attempt.codes.includes('LOCAL_SOURCE_PROGRAMME_UNRESOLVED'), attempt.codes.join());
    const staged = await consumerView(era, names);
    assert.equal(staged.imports.length, 1, 'THE RESIDUE: the refused review leaves the entry');
    assert.equal(staged.importRebaseRequired, true);
    assert.equal(staged.derivedCode, 'IMPORT_REBASE_REQUIRED');
    assert.equal(staged.companionImportPresent, true, 'and the companion refuses a clean-init basis');
    const result = await retractImport(era.client, staged.imports[0], REASON);
    assert.equal(result.retracted, true);
    assert.equal(result.code, 'LOCAL_IMPORT_RETRACTED');
    assert.equal(result.reason, REASON);
    assert.deepEqual(await consumerView(era, names), before,
      'listImports, the boot flag, derivedCode, the cache, the P2 join and the companion gate');
    assert.equal((await durable(era)).revision, beforeDurable.revision + 2,
      'two durable commits: the import and the retract that supersedes it');
    era.close();
  });

test('P3D-2 - stage -> CANCELLED before any review -> retract: the same return', async () => {
  const { era, names } = await device('cancelled');
  const before = await consumerView(era, names);
  const carried = (await carry(era, SEALED)).carried;
  assert.equal(carried.imported, true);
  assert.equal(carried.code, 'LOCAL_IMPORT_REBASE_REQUIRED');
  assert.equal((await consumerView(era, names)).importRebaseRequired, true);
  const result = await retractImport(era.client, carried.name, 'athlete-cancelled');
  assert.equal(result.retracted, true);
  assert.equal(result.name, carried.name);
  assert.deepEqual(await consumerView(era, names), before);
  assert.deepEqual(await listImports(era.client), [], 'listImports HIDES a retracted entry');
  const history = await listImportRetractions(era.client);
  assert.equal(history.length, 1);
  assert.equal(history[0].name, carried.name);
  assert.equal(history[0].reason, 'athlete-cancelled', 'the reason is kept, for the host to show');
  era.close();
});

test('P3D-3 - retract of an ADMITTED import is REFUSED: his history leaves by another path',
  async () => {
    const { era, names } = await device('admitted');
    const admitted = await admit(era, SEALED, { day: DAY, ...names });
    assert.equal(admitted.admitted, true, 'the real controller admitted the invented bundle');
    const before = await durable(era), view = await consumerView(era, names);
    assert.equal(view.admittedBasis === null, false, 'the P2 join now returns his imported state');
    const result = await retractImport(era.client, admitted.name, REASON);
    assert.equal(result.retracted, false);
    assert.equal(result.code, 'LOCAL_IMPORT_RETRACT_REFUSED_ADMITTED');
    assert.equal(result.state, 3);
    assert.deepEqual(await durable(era), before, 'the refusal writes nothing at all');
    assert.deepEqual((await listImports(era.client)).map(e => e.name), [admitted.name]);
    assert.deepEqual(await listImportRetractions(era.client), []);
    era.close();
  });

test('P3D-4 - retracting TWICE refuses idempotently with a named code and writes nothing',
  async () => {
    const { era } = await device('twice');
    const carried = (await carry(era, SEALED)).carried;
    assert.equal((await retractImport(era.client, carried.name, REASON)).retracted, true);
    const settled = await durable(era);
    const again = await retractImport(era.client, carried.name, REASON);
    assert.equal(again.retracted, false);
    assert.equal(again.code, 'LOCAL_IMPORT_ALREADY_RETRACTED');
    assert.equal(again.state, null, 'nothing failed: the store is already in the asked-for state');
    assert.equal(again.name, carried.name);
    assert.deepEqual(await durable(era), settled, 'no second retract record, no new revision');
    assert.equal((await listImportRetractions(era.client)).length, 1);
    const unknown = await retractImport(era.client, 'port:0000000000000000', REASON);
    assert.equal(unknown.code, 'LOCAL_IMPORT_UNKNOWN', 'a name that was never here is NOT "already"');
    assert.equal(unknown.state, 3);
    era.close();
  });

test('P3D-5 - a RELOAD after a retract keeps the retracted state', async () => {
  const { era, names, indexedDB } = await device('reload');
  const carried = (await carry(era, SEALED)).carried;
  await retractImport(era.client, carried.name, REASON);
  const settled = await consumerView(era, names);
  era.close();
  const reopened = await eraFor({ indexedDB, live: liveAt(AT), ...names });
  const after = await consumerView(reopened, names);
  assert.deepEqual(after, settled, 'the retract is durable, not a session fact');
  assert.equal(after.importRebaseRequired, false, 'the boot flag stays cleared across a reload');
  assert.deepEqual(await listImports(reopened.client), []);
  assert.equal((await listImportRetractions(reopened.client))[0].name, carried.name);
  reopened.close();
});

test('P3D-6 - a LATER RE-IMPORT of the same bundle stages FRESH, not ALREADY_PRESENT',
  async () => {
    const { era, names } = await device('re-import');
    const first = (await carry(era, SEALED)).carried;
    await retractImport(era.client, first.name, REASON);
    const again = (await carry(era, SEALED)).carried;
    assert.equal(again.imported, true, 'a retracted name is free again');
    assert.equal(again.code, 'LOCAL_IMPORT_REBASE_REQUIRED');
    assert.notEqual(again.code, 'LOCAL_IMPORT_ALREADY_PRESENT');
    assert.equal(again.name, first.name, 'the same bundle derives the same name');
    assert.deepEqual((await listImports(era.client)).map(e => e.name), [first.name]);
    assert.equal((await consumerView(era, names)).importRebaseRequired, true,
      'the file is staged again, so the flag is honestly back');
    assert.equal(importRetracted((await era.generation()).generation, first.name), false,
      'a live entry outranks the retract record that precedes it');
    assert.equal((await listImportRetractions(era.client)).length, 1, 'the history is kept');
    const original = await era.client.importOriginal(first.name);
    assert.equal(original.sourceBytes.length > 0, true, 'and the original reads again');
    era.close();
  });

test('P3D-7 - NOTHING IS DELETED: the store keys, the custody bytes and the register',
  async () => {
    const { era, names, indexedDB } = await device('append-only');
    const carried = (await carry(era, SEALED)).carried;
    const keys = await storeKeys(indexedDB, names.databaseName);
    const bytes = await sourceJsonOf(era, carried.name);
    const before = await register(era), ops = (await consumerView(era, names)).ops;
    const entry = (await era.generation()).generation.metadata.imports[0];
    const revision = (await durable(era)).revision;
    await retractImport(era.client, carried.name, REASON);
    assert.deepEqual(await storeKeys(indexedDB, names.databaseName), keys,
      'the custody record key is still in the generations store');
    assert.equal(await sourceJsonOf(era, carried.name), bytes, 'byte for byte, under the device key');
    const after = await register(era);
    assert.equal(after.retractions, before.retractions + 1, 'EXACTLY one retract op was added');
    assert.equal((await durable(era)).revision, revision + 1, 'in EXACTLY one durable commit');
    assert.deepEqual([after.entries, after.retractions], [0, 1]);
    assert.deepEqual(importRetractions((await era.generation()).generation)[0].entry, entry,
      'and the entry it superseded is inside it, verbatim: the account is complete');
    assert.deepEqual((await consumerView(era, names)).ops, ops, 'and it mints no operation of its own');
    era.close();
  });

test('P3D-8 - importOriginal REFUSES a retracted entry, while the bytes stay in custody',
  async () => {
    const { era } = await device('original');
    const carried = (await carry(era, SEALED)).carried;
    const kept = await sourceJsonOf(era, carried.name);
    await retractImport(era.client, carried.name, REASON);
    await assert.rejects(era.client.importOriginal(carried.name),
      { code: 'LOCAL_IMPORT_ENTRY_RETRACTED' }, 'named, never "missing"');
    assert.equal(await sourceJsonOf(era, carried.name), kept, 'nothing was deleted to achieve that');
    const record = importRetractions((await era.generation()).generation)[0];
    assert.equal(record.profile, LOCAL_IMPORT_RETRACT_PROFILE, 'the retract op has its own kind');
    assert.equal(record.entry.name, carried.name, 'and carries the superseded entry verbatim');
    assert.equal(record.entry.rebaseRequired, true);
    assert.equal(typeof record.retractedAt, 'string');
    era.close();
  });

test('P3D-9 - the selector, the reason and the fences', async () => {
  const { era } = await device('inputs');
  const carried = (await carry(era, SEALED)).carried;
  const entry = (await listImports(era.client))[0];
  for (const carrier of ['176.9 lb on 2026-08-31', 'weight 176.9', 'note: he said he was ill',
    '2026-08-31', 'db-bench 45x7', '', ' ', 'x'.repeat(65)])
    assert.equal((await retractImport(era.client, carried.name, carrier)).code,
      'LOCAL_IMPORT_RETRACT_REASON_INVALID',
      'a reason is a LABEL: no digits, no dots, no colons, no spaces, so a ledger '
      + 'value cannot ride out of his history on it - ' + JSON.stringify(carrier));
  assert.equal((await retractImport(era.client, 'not a name', REASON)).code, 'LOCAL_IMPORT_NAME_INVALID');
  assert.equal((await listImports(era.client)).length, 1, 'every refusal above wrote nothing');
  const bySha = await retractImport(era.client, entry.sourceSha256, REASON);
  assert.equal(bySha.retracted, true, 'sourceSha256 selects the same entry as the entry id');
  assert.equal(bySha.name, carried.name);
  era.client.close();
  assert.equal((await retractImport(era.client, carried.name, REASON)).code, 'LOCAL_CLIENT_CLOSED',
    'fenced exactly like importBundle: a closed client writes nothing');
  era.close();
});

/* THE ONE CASE WHERE AN IMPORT TOUCHES THE CACHE. On a ZERO-OP generation
   importBundle replaces derived.value with the migrated state (the cache
   described nothing, so seeding it invented nothing). Retracting THAT import
   must put the cache back, or the screens keep painting a history he took
   back - and the only authenticated copy of the pre-stage cache in the store is
   the checkpoint the custody record took when it kept the original. */
test('P3D-10 - retracting a SEEDED import restores the cache the custody record checkpointed',
  async () => {
    const clean = createCleanInitState({ setup: SETUP }), names = scope('seeded');
    /* Opened directly rather than through the harness's eraFor, which does not
       forward cleanInit: the whole point here is a cache with something in it. */
    const era = await openTodayOverLocalEra({ indexedDB: new IDBFactory(), crypto: webcrypto,
      live: liveAt(AT), cleanInit: clean, ...names });
    const before = await consumerView(era, names);
    assert.deepEqual(before.ops, [], 'a zero-op generation: nothing has been logged here yet');
    assert.deepEqual(before.derived, clean, 'the cache is the clean-init one enrolment wrote');
    const carried = (await carry(era, SEALED)).carried;
    assert.equal(carried.code, 'LOCAL_IMPORT_SEEDED');
    const seeded = await consumerView(era, names);
    assert.notDeepEqual(seeded.derived, clean, 'the imported state IS the cache now');
    assert.equal(seeded.importRebaseRequired, false, 'a seeded import needs no rebase');
    const result = await retractImport(era.client, carried.name, 'athlete-cancelled');
    assert.equal(result.retracted, true);
    assert.deepEqual(await consumerView(era, names), before,
      'the cache, the register and every other consumer read are the pre-stage ones');
    assert.equal(await sourceJsonOf(era, carried.name) === null, false, 'and the bytes are still kept');
    era.close();
  });

/* P3-D-FOLLOWONS, item 3. THE SEEDED SIBLING (independent review r1, MAJOR 1,
   its RV-9). Two zero-op imports on the same device are LAST-WINS: the cache
   belongs to whichever was staged last. Retracting the OLDER used to restore
   that entry's own checkpoint - the clean-init cache - over a cache the LIVE
   entry seeded, leaving a state belonging to no entry in the register:
   importPresentIn true, so the companion demands an imported basis, while
   Today paints clean-init. It now refuses instead. */
test('P3D-11 - with another SEEDED entry live, retracting refuses '
  + 'LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN and cannot wipe the cache it seeded',
  async () => {
    const clean = createCleanInitState({ setup: SETUP }), names = scope('seeded-sibling');
    const era = await openTodayOverLocalEra({ indexedDB: new IDBFactory(), crypto: webcrypto,
      live: liveAt(AT), cleanInit: clean, ...names });
    const first = (await carry(era, SEALED)).carried;
    assert.equal(first.code, 'LOCAL_IMPORT_SEEDED');
    const second = (await carry(era, STRANGER)).carried;
    assert.equal(second.code, 'LOCAL_IMPORT_SEEDED', 'both files seeded: this is LAST-WINS');
    assert.notEqual(second.name, first.name, 'two different bundles, two different entries');
    const staged = await consumerView(era, names), settled = await durable(era);
    assert.notDeepEqual(staged.derived, clean, 'the SECOND file is the cache now');
    const result = await retractImport(era.client, first.name, REASON);
    assert.equal(result.retracted, false);
    assert.equal(result.code, 'LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN');
    assert.equal(result.state, 3);
    assert.deepEqual(await durable(era), settled, 'the refusal writes nothing at all');
    assert.deepEqual(await consumerView(era, names), staged,
      'the cache the LIVE entry seeded is untouched, and both entries are still live');
    assert.deepEqual(await listImportRetractions(era.client), []);
    era.close();
  });

/* THE RED SIDE, run on the same path with the sibling taken away: the guard
   above is what refuses, not the checkpoint rule underneath it. */
test('P3D-12 - RED SIDE: the same retract of the same file SUCCEEDS once no other '
  + 'seeded entry is live, and restores the checkpointed cache', async () => {
  const clean = createCleanInitState({ setup: SETUP }), names = scope('seeded-alone');
  const era = await openTodayOverLocalEra({ indexedDB: new IDBFactory(), crypto: webcrypto,
    live: liveAt(AT), cleanInit: clean, ...names });
  const before = await consumerView(era, names);
  const only = (await carry(era, SEALED)).carried;
  assert.equal(only.code, 'LOCAL_IMPORT_SEEDED');
  const result = await retractImport(era.client, only.name, REASON);
  assert.equal(result.retracted, true, 'the ONLY difference from P3D-11 is the sibling');
  assert.equal(result.code, 'LOCAL_IMPORT_RETRACTED');
  assert.deepEqual(await consumerView(era, names), before);
  assert.deepEqual((await consumerView(era, names)).derived, clean);
  era.close();
});

/* P3-D-FOLLOWONS, item 3. THE REVIEWER'S RV-6, carried in as a lane cell
   (Fable r3 MINOR 2). The suite above proves ONE retract record is appended;
   mutant M7 - the register dropping its history on a second retract - left all
   ten cells green. Two retracts of the same name, with a live re-import in
   between, is the shape that catches it: the register only ever grows. */
test('P3D-13 - retract, re-import, retract again: TWO records, and the first is '
  + 'still the first', async () => {
  const { era, names } = await device('twice-over');
  const first = (await carry(era, SEALED)).carried;
  assert.equal((await retractImport(era.client, first.name, REASON)).retracted, true);
  const one = importRetractions((await era.generation()).generation);
  assert.equal(one.length, 1);
  const again = (await carry(era, SEALED)).carried;
  assert.equal(again.imported, true, 'the same bundle stages fresh under the same name');
  const second = await retractImport(era.client, again.name, 'athlete-cancelled');
  assert.equal(second.retracted, true, 'and it can be taken back again');
  const both = importRetractions((await era.generation()).generation);
  assert.equal(both.length, 2, 'THE REGISTER IS APPEND-ONLY ACROSS TWO RETRACTS');
  assert.deepEqual(both[0], one[0], 'the first record is unchanged, not rewritten');
  assert.deepEqual(both.map(r => r.reason), [REASON, 'athlete-cancelled']);
  assert.deepEqual(both.map(r => r.name), [first.name, first.name]);
  assert.equal((await listImportRetractions(era.client)).length, 2);
  assert.deepEqual(await listImports(era.client), [], 'and nothing is live afterwards');
  assert.equal((await consumerView(era, names)).importRebaseRequired, false);
  era.close();
});
