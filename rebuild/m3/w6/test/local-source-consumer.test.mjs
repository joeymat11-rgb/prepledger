// P2 S3 IMPORT JOIN - THE END-TO-END WITNESS (CRITICAL-PATH-2026-09-15 section 4
// P2, GATE-AUDIT-SPEC-P2 findings 1 and 5).
//
// An INVENTED synthetic legacy bundle (no owner data, no private path, no
// conform private fixture) is sealed by the REAL rebuild/m3/setup/port/port.cjs,
// carried onto a device through C2b custody (client.importBundle), admitted by
// rebuild/m3/w6/local/source-admission.mjs, and then read back where it has to
// be visible: Today and the gym card, standing on the athlete's own imported
// numbers rather than the preview fixture's. A new workout is saved on top and
// the whole thing survives a force-kill and reopen.
//
// The REAL port never runs on a real ledger here: --source is a file this test
// invents in the OS temp folder and --out is outside every git working tree.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { IDBFactory } from 'fake-indexeddb';
import { webcrypto } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { openTodayOverLocalEra } from '../local/today-bindings.mjs';
import { createLocalSourceController, localSourceCommitCapability } from '../local/source-admission.mjs';
import { createSourcePlatform } from '../local/source-platform.mjs';
import { parseStrictJson } from '../strict-json.mjs';
import Profile from '../../../m4/import/local-source-profile.cjs';
import Capture from '../../../m4/workout/capture.cjs';
import Commands from '../../../m4/workout/commands.cjs';
import Journey from '../host/test/journey-fixture.cjs';
import { createCleanInitState } from '../../w7-preview/today/setup-model.mjs';
import { admittedLocalSourceBasis } from '../../w7-preview/today/local-source-basis.mjs';
import * as Entry from '../../w7-preview/today/today-entry.mjs';
import Setup from '../../w7-preview/today/setup-commands.mjs';
import { EFFORT_CHOICES } from '../../w7-preview/today/gym-model.mjs';
import TodayApp from '../../w7-preview/today/today-app.cjs';
import design from '../../w7-preview/today/design.cjs';

const REPO = fileURLToPath(new URL('../../../../', import.meta.url));
const PORT = path.join(REPO, 'rebuild/m3/setup/port/port.cjs');
const SETUP = JSON.parse(JSON.stringify(Journey.SETUP));
const TAGS = Object.fromEntries(SETUP.exercises.map(e => [e.id, { head: null, secondary: [] }]));
// The imported working loads and the reps beside them. Chosen so that no figure
// below can be confused with the preview fixture's demonstration athlete (whose
// lifts are demo-press/demo-row/demo-leg at 40 lb, reads in the 184s).
const LOADS = { 'db-bench': 45, 'lat-pulldown': 80, 'leg-press': 120 };
const REPS = { 'db-bench': [7, 7, 6], 'lat-pulldown': [11, 10], 'leg-press': [10, 10, 9] };
const IMPORTED_READS = [
  { d: '2026-08-14', w: 178.2, sealed: false, note: 'INVENTED' },
  { d: '2026-08-18', w: 177.6, sealed: false, note: 'INVENTED' },
  { d: '2026-08-24', w: 177.1, sealed: false, note: 'INVENTED' },
  { d: '2026-08-31', w: 176.4, sealed: false, note: 'INVENTED' }];

/* The invented legacy file: this athlete's own week, with a history the device
   has never seen. Built through the ACCEPTED clean-init constructor so that its
   programme is the very one his first run records, which is what admission
   proves before it will admit anything. */
function inventedLegacyState() {
  const state = JSON.parse(JSON.stringify(createCleanInitState({ setup: SETUP })));
  for (const ex of state.exercises) { ex.w = LOADS[ex.id]; ex.last = REPS[ex.id].slice(); }
  const session = type => ({ type, entries: state.exercises.filter(e => e.day === type)
    .map(e => ({ id: e.id, w: LOADS[e.id], reps: REPS[e.id].slice(), rir: 2, sets: e.sets })) });
  state.sessionLog = { '2026-08-14': session('U'), '2026-08-17': session('L'), '2026-08-21': session('U') };
  state.reads = IMPORTED_READS.map(r => ({ ...r }));
  state.model = { anchorISO: '2026-08-14', lean: 132, drip: 0, src: 'EYE' };
  /* A file the old app wrote carries its own smoothed trend; a clean-init state
     does not have the member at all, and a missing one is not a number this
     test may invent on the engine's behalf, so it is carried as the file's. */
  state.trend = 176.9;
  return state;
}

/* ONE REAL SEAL, produced once. --out must be outside every git working tree and
   carry no `rebuild` segment (the port's own guard), so the OS temp folder is
   the only place it can go. */
function sealInventedBundle() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'p2-witness-'));
  const out = path.join(dir, 'out');
  fs.mkdirSync(out);
  const file = path.join(dir, 'invented-legacy-state.json');
  fs.writeFileSync(file, JSON.stringify(inventedLegacyState(), null, 2));
  const run = spawnSync(process.execPath, [PORT, '--source', file, '--out', out],
    { cwd: REPO, encoding: 'utf8', timeout: 600000, windowsHide: true });
  if (run.status !== 0) throw new Error('port.cjs did not seal the invented bundle (status '
    + run.status + '): ' + String(run.stdout).slice(-600) + String(run.stderr).slice(-600));
  const names = fs.readdirSync(out);
  const bundleName = names.find(n => n.endsWith('.json'));
  const passName = names.find(n => n.endsWith('-PASSPHRASE.txt'));
  if (!bundleName || !passName) throw new Error('port.cjs wrote ' + JSON.stringify(names));
  return { dir, sourceFile: file, stdout: run.stdout,
    bytes: new Uint8Array(fs.readFileSync(path.join(out, bundleName))),
    passphrase: fs.readFileSync(path.join(out, passName), 'utf8').trim() };
}
const SEALED = sealInventedBundle();
process.on('exit', () => { try { fs.rmSync(SEALED.dir, { recursive: true, force: true }); } catch {} });

const DB = 'p2-import-witness', NS = 'joe/p2-witness', ATHLETE = 'ath-p2', DEVICE = 'dev-p2';
/* A WINTER day, deliberately. rebuild/m3/w6/local/today-bindings.mjs is pinned
   and stamps every operation this installation writes at 13:00Z / -05:00, so the
   only days on which a real op's recorded offset agrees with America/New_York's
   actual civil offset are the EST ones. An EDT day would make admission refuse
   the installation's own setup operation with LOCAL_SOURCE_CONTEXT_UNRESOLVED,
   which is the pinned binding talking and not this import. The era clock is set
   before 13:00Z so the host's own clock is inside the lease window it mints. */
const DAY = '2026-11-20';
const clockFor = day => ({ now: () => day + 'T08:00:00.000Z', today: () => day,
  tz: '-05:00', monotonicMs: () => 0 });
const openEra = (indexedDB, day = DAY) => openTodayOverLocalEra({ indexedDB, crypto: webcrypto,
  databaseName: DB, namespace: NS, athleteId: ATHLETE, deviceId: DEVICE, clock: clockFor(day) });

/* SYNTHETIC reviewed native-Date evidence for this invented execution calendar:
   each raw input bound to the exact epoch the native implementation produces,
   malformed input to NaN, each epoch to its exact native ISO or invalid outcome. */
const NATIVE_DATE_EVIDENCE = () => ({ profile: 'earned/native-date-capability/v1',
  parse_vectors: [{ input: '2026-03-15T12:00:00.000Z', epoch: 1773576000000 },
    { input: '2026-08-14T12:00:00.000Z', epoch: 1786708800000 },
    { input: '2026-09-03T12:00:00.000Z', epoch: 1788436800000 },
    { input: 'TEST-ONLY not a timestamp', epoch: null }],
  constructor_vectors: [{ epoch: 1786708800001, iso: '2026-08-14T12:00:00.001Z' },
    { epoch: 1788436800001, iso: '2026-09-03T12:00:00.001Z' }, { epoch: 8640000000000001, iso: null }] });

const prescriptionCapture = Capture.createPrescriptionCapture({ parseStrictJson });
const workoutCommands = Commands.createWorkoutCommands({ prescriptionCapture });

async function firstRun(era) {
  const host = await era.createSetupHost({ day: DAY, commands: Setup.createSetupCommands(), profile: Setup.PROFILE });
  const saved = await host.save({ setup: SETUP, tags: TAGS });
  assert.equal(saved.ok, true, 'the first run is recorded: ' + saved.code);
  host.close();
}

/* Carry the sealed bundle onto the device through C2b custody and admit it with
   the S3 controller, exactly as the import screen will. The producer mapping is
   TEST ONLY invented compatibility: it proves algorithm composition, never the
   provenance of an owner's real execution. */
async function admitTheImport(era) {
  const platform = createSourcePlatform();
  const carried = await era.client.importBundle({ bundleBytes: SEALED.bytes, passphrase: SEALED.passphrase });
  assert.equal(carried.imported, true, 'C2b custody adopted the sealed bundle: ' + carried.code);
  const repository = (await era.client.hostBindings({ workoutCommands })).repository;
  const custody = repository.importCustody({ parseStrictJson, validateContext: () => null });
  const material = await custody.load(carried.name);
  const raw = { source_json: platform.text(material.sourceBytes),
    candidate_json: platform.text(material.candidateBytes),
    local_json: material.localBytes === null ? null : platform.text(material.localBytes),
    engine_context_json: material.engineContextJson };
  const materialDigest = Profile.digest(platform.hash, 'earned/local-source-material/v1', raw);
  const context = parseStrictJson(raw.engine_context_json);
  return { platform, repository, context, materialDigest, name: carried.name };
}

function producerRegistryFor({ platform, context, materialDigest }, { range } = {}) {
  const days = ['2026-08-14', '2026-08-17', '2026-08-18', '2026-08-21', '2026-08-24', '2026-08-31',
    '2026-09-03', '2026-09-04', DAY];
  const dates = days.map(day => {
    const [y, m, d] = day.split('-').map(Number), noon = new Date(y, m - 1, d, 12);
    return { day, noonISO: noon.toISOString(), offsetMinutes: noon.getTimezoneOffset() };
  });
  const gate = { clock: context.oracle.gate.clock, tz: context.oracle.gate.tz };
  const mapping = { profile: 'earned/source-producer-mapping/v1', id: 'TEST-ONLY-witness-mapping',
    construction: 'oracle-shim-default/v1', engine: context.engine, gate,
    public_factory_digest: Profile.PUBLIC_FACTORY_DIGEST, source_pins: Profile.SOURCE_PINS,
    dependencies: { drafts: 'default-empty' },
    executions: [{ id: 'TEST-ONLY-witness-run', material_digest: materialDigest,
      calendar: { profile: 'earned/native-date-compatibility/v1', compatibility_id: 'TEST-ONLY-witness-calendar',
        zone: gate.tz, range: range || { from: '2026-01-01', to: '2026-12-31' }, dates,
        native_date: NATIVE_DATE_EVIDENCE() } }] };
  return Profile.createProducerRegistry([mapping], { hash: platform.hash });
}

async function admittedView(era, options = {}) {
  const carried = await admitTheImport(era);
  const controller = createLocalSourceController({ repository: carried.repository, namespace: NS,
    athleteId: ATHLETE, deviceId: DEVICE, producerRegistry: producerRegistryFor(carried, options),
    asOf: () => DAY, platform: carried.platform });
  const review = await controller.reviewSource(carried.name);
  const prepared = await controller.prepareSource(review, { identityConfirmed: true });
  if (prepared.profile !== 'earned/local-source-qualification/v1') {
    throw new Error('the invented import was not admitted: ' + JSON.stringify(prepared.issues || prepared));
  }
  const capability = localSourceCommitCapability(prepared);
  await capability.publish();
  /* The commit moved the generation on, so the handle that proposed it is stale
     by design: reconcile() re-reads the durable record, proves the committed
     marker is the one this selection published, and hands back a current one. */
  const settled = await capability.reconcile();
  const view = await controller.view(settled);
  return { view, controller, repository: carried.repository, name: carried.name };
}

const shellDoc = () => new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
  { url: 'https://example.test/' }).window.document;
const visibleText = doc => (doc.getElementById('phone') || doc.body).textContent.replace(/\s+/g, ' ');
// The preview fixture's own athlete, in the shapes a screen could paint.
const FIXTURE_MARKS = ['demo-press', 'demo-row', 'demo-leg', 'demo-curl', '184.8', '184.4'];

test('P2-W1 - the REAL port seals an invented legacy bundle with its gate GREEN and no class smaller',
  () => {
    assert.match(SEALED.stdout, /1\. SOURCE\s+PASS/);
    assert.match(SEALED.stdout, /3\. COUNTS\s+PASS/);
    assert.match(SEALED.stdout, /4\. ORACLE\s+PASS\s+frozen 7\/7\s+unfrozen 7\/7/);
    assert.match(SEALED.stdout, /5\. SEAL\s+PASS/);
    assert.match(SEALED.stdout, /dataLossGuard\s+safe=true\s+lost=0/);
    assert.equal(SEALED.passphrase.split(/[\s-]+/).filter(Boolean).length, 6, 'six words and no more');
    assert.ok(SEALED.bytes.length > 1000, 'a sealed bundle, not an empty file');
  });

test('P2-W2 - an ADMITTED import is the athlete\'s own basis on Today and on the gym card', async () => {
  const indexedDB = new IDBFactory();
  const era = await openEra(indexedDB);
  await firstRun(era);
  const admitted = await admittedView(era);
  // What admission itself says it replayed: his imported working loads.
  assert.deepEqual(admitted.view.state.exercises.map(e => [e.id, e.w]),
    [['db-bench', 45], ['lat-pulldown', 80], ['leg-press', 120]]);
  assert.deepEqual(Object.keys(admitted.view.state.sessionLog).sort(),
    ['2026-08-14', '2026-08-17', '2026-08-21']);

  const doc = shellDoc();
  const booted = await Entry.boot({ document: doc, today: DAY, hosts: era });
  assert.deepEqual(booted.failures, [], 'every lane opened over the one generation');
  await booted.api.ready;
  const basis = booted.model.basisState();
  assert.equal(basis.athlete_label, SETUP.athlete_label, 'Today stands on HIS record, not the fixture\'s');
  assert.deepEqual(basis.exercises.map(e => [e.id, e.w]),
    [['db-bench', 45], ['lat-pulldown', 80], ['leg-press', 120]], 'the imported loads ARE the basis');
  assert.deepEqual(basis.reads.map(r => r.w), IMPORTED_READS.map(r => r.w), 'the imported readings came with it');
  assert.equal(TodayApp.setupNoteNeeded(true, booted.setup.athleteLabel(), basis), false,
    'the not-his-numbers sentence is not owed once his own imported state is the basis');
  const text = visibleText(doc);
  for (const mark of FIXTURE_MARKS) assert.ok(!text.includes(mark), 'no fixture figure on Today: ' + mark);
  era.close();
});

test('P2-W3 - the gym card opens on the imported lifts, and a new set saved on top survives a force-kill',
  async () => {
    const indexedDB = new IDBFactory();
    const era = await openEra(indexedDB);
    await firstRun(era);
    await admittedView(era);
    const doc = shellDoc();
    const booted = await Entry.boot({ document: doc, today: DAY, hosts: era });
    await booted.api.ready;
    const gym = booted.workout.gym;
    const ready = await gym.read();
    assert.equal(ready.phase, 'ready', 'the card opens on his own training day: ' + (ready.code || ''));
    const card = JSON.stringify(ready);
    assert.equal(ready.lift.id, 'db-bench', 'the card opens on the athlete\'s own first lift');
    assert.equal(ready.lift.label, 'Dumbbell bench press');
    assert.equal(ready.lift.count, 2, 'his two upper-body lifts, not the fixture\'s four');
    assert.ok(card.includes('Lat pulldown'), 'his second lift is the one the card reasons about');
    for (const mark of FIXTURE_MARKS) assert.ok(!card.includes(mark), 'no fixture lift on the card: ' + mark);
    assert.match(ready.prescription.line, /^45 lb/,
      'the card prescribes from the IMPORTED working load, not from a blank clean-init lift');

    assert.equal((await gym.start()).ok, true, 'Start is open once the adoption has settled');
    let logged = 0;
    for (let guard = 0; guard < 12; guard++) {
      const view = await gym.read();
      if (view.phase === 'saved') { if (view.complete) break; gym.forget(); continue; }
      if (view.phase !== 'active') break;
      const result = await gym.logSet({ startId: view.startId, slot: view.set.slot, lift: view.set.lift,
        load: String(view.entry.load), reps: String(view.entry.reps), effort: EFFORT_CHOICES[0].reserve });
      assert.ok(result.ok, 'the set was refused: ' + result.code);
      logged += 1;
      gym.forget();
    }
    assert.ok(logged > 0, 'at least one real set was saved on top of the imported history');
    const closing = await gym.read();
    assert.equal(closing.complete, true, 'every prescribed set of his own session is logged');
    const finished = await gym.finish({ startId: closing.startId });
    assert.ok(finished.ok, 'the session closes: ' + JSON.stringify(finished));
    era.close();

    // FORCE-KILL AND REOPEN: a brand new installation handle over the same store,
    // with nothing carried in memory, exactly as reopening the app builds it.
    const again = await openEra(indexedDB);
    const reDoc = shellDoc();
    const reBooted = await Entry.boot({ document: reDoc, today: DAY, hosts: again });
    await reBooted.api.ready;
    const basis = reBooted.model.basisState();
    assert.deepEqual(basis.exercises.map(e => [e.id, e.w]),
      [['db-bench', 45], ['lat-pulldown', 80], ['leg-press', 120]], 'the imported history is still the basis');
    assert.deepEqual(Object.keys(basis.sessionLog).sort(), ['2026-08-14', '2026-08-17', '2026-08-21']);
    const ops = Object.values((await again.generation()).generation.collections.ops);
    const sessionOps = ops.filter(op => op.class === 'session');
    assert.equal(sessionOps.filter(op => op.kind === 'session-start').length, 1,
      'the Start is on disk: ' + JSON.stringify(ops.map(op => op.class + '/' + op.kind)));
    assert.ok(sessionOps.length >= logged + 1, 'every saved set is still on disk: '
      + JSON.stringify(sessionOps.map(op => op.kind)));
    /* And the card itself, reopened over the same store, reports the day the
       athlete just trained rather than offering it again. */
    const reCard = await reBooted.workout.gym.read();
    assert.equal(reCard.phase, 'finished', 'the reopened card knows the workout happened: ' + reCard.phase);
    assert.equal(reCard.sets, logged, 'with every set he actually saved');
    for (const mark of FIXTURE_MARKS) assert.ok(!visibleText(reDoc).includes(mark), 'still no fixture figure');
    again.close();
  });

test('P2-W4 - only an ADMITTED import of THIS installation and THIS athlete is ever adopted', async () => {
  const indexedDB = new IDBFactory();
  const era = await openEra(indexedDB);
  const empty = (await era.generation()).generation;
  assert.equal(admittedLocalSourceBasis(empty, { athleteLabel: SETUP.athlete_label, namespace: NS }), null,
    'a generation with no import adopts nothing');
  await firstRun(era);
  const admitted = await admittedView(era);
  const generation = (await era.generation()).generation;
  const label = SETUP.athlete_label;
  const good = admittedLocalSourceBasis(generation, { athleteLabel: label, namespace: NS });
  assert.ok(good && good.exercises.length === 3, 'the admitted import IS adopted');
  assert.equal(good.exercises.find(e => e.id === 'db-bench').w, 45);
  /* today-gym-consumers was closed by this file; local-capture-start-resume was
     closed by its own ticket, so the list this cell pins is now EMPTY. The new
     reason stands where the old one did: nothing about an admitted import is
     still waiting on another lane. */
  assert.deepEqual(admitted.view.integration_pending, []);

  const spoil = change => {
    const copy = JSON.parse(JSON.stringify(generation));
    change(copy);
    return admittedLocalSourceBasis(copy, { athleteLabel: label, namespace: NS });
  };
  assert.equal(spoil(g => { g.metadata.localSourceApplication.core_complete = false; }), null,
    'an incomplete application is not an admitted import');
  assert.equal(spoil(g => { g.metadata.localSources.active = 'local-source:something-else'; }), null,
    'a selection that is not the active one is not adopted');
  assert.equal(spoil(g => { g.collections.derived.localSource.view.ready = false; }), null,
    'a view that is not ready is not adopted');
  assert.equal(spoil(g => { g.collections.derived.localSource.view.issues = [{ code: 'LOCAL_SOURCE_READING_UNRESOLVED' }]; }),
    null, 'a replay that raised an issue is not adopted');
  assert.equal(spoil(g => { g.collections.derived.localSource.basis.source_digest = 'f'.repeat(64); }), null,
    'three copies of the committed basis that disagree are not one admitted import');
  assert.equal(spoil(g => { g.collections.derived.localSource.view.state = null; }), null,
    'an empty replayed state is not a basis');
  assert.equal(admittedLocalSourceBasis(generation, { athleteLabel: label, namespace: 'someone/else' }), null,
    'another installation\'s import is never painted here');
  assert.equal(admittedLocalSourceBasis(generation, { athleteLabel: 'Someone Else', namespace: NS }), null,
    'an import that does not carry THIS athlete\'s label is never painted as his');
  era.close();
});

test('P2-W5 - the pending gate still covers every fixture-derived figure while the import is being adopted',
  async () => {
    const indexedDB = new IDBFactory();
    const era = await openEra(indexedDB);
    await firstRun(era);
    await admittedView(era);
    const doc = shellDoc();
    /* NOT awaited: this is the synchronous first paint, before the adoption this
       ticket added in front of setup.athleteState() can possibly have settled. */
    const booting = Entry.boot({ document: doc, today: DAY, hosts: era });
    const booted = await booting;
    const first = booted.model.read();
    assert.deepEqual(first.calorieTarget, { gated: true }, 'no fixture calorie target on the held frame');
    // read() clones through JSON, so the held NaN arrives as null; either way it
    // is not a number the fixture supplied.
    assert.ok(first.proteinTarget.g === null || Number.isNaN(first.proteinTarget.g),
      'no fixture protein target either');
    assert.equal(first.workout.exerciseCount, null, 'no fixture exercise count');
    assert.deepEqual(first.marchingOrder, {}, 'no fixture order');
    const held = visibleText(doc);
    for (const mark of FIXTURE_MARKS) assert.ok(!held.includes(mark), 'no fixture figure while held: ' + mark);
    await booted.api.ready;
    const settled = booted.model.read();
    assert.notDeepEqual(settled.calorieTarget, { gated: true }, 'the gate lifts on his own imported state');
    era.close();
  });

/* AN HONEST LIMIT, EXECUTED RATHER THAN ASSUMED, and a finding for the PM.
   rebuild/m3/w6/local/today-bindings.mjs is PINNED and stamps every operation
   this installation writes with a fixed tz of "-05:00" (clientClockFor, :166).
   America/New_York is on -04:00 from March to November, so on a SUMMER day the
   offset a real operation records disagrees with the offset the execution
   calendar computes for that very date, and admission correctly refuses to
   interpret it. The page's own SYNTHETIC_DAY (2030-02-04) is a winter day, so
   nothing shipped is affected today; a real clock in summer would be, and P3
   runs in September. Naming it here with its exact code so it cannot be
   mistaken for a fault in the import. */
test('P2-W6 - a summer-stamped installation refuses the same import, and says exactly why', async () => {
  const indexedDB = new IDBFactory();
  const summer = '2026-09-04';
  const era = await openTodayOverLocalEra({ indexedDB, crypto: webcrypto, databaseName: 'p2-summer',
    namespace: NS, athleteId: ATHLETE, deviceId: DEVICE, clock: clockFor(summer) });
  const host = await era.createSetupHost({ day: summer, commands: Setup.createSetupCommands(), profile: Setup.PROFILE });
  assert.equal((await host.save({ setup: SETUP, tags: TAGS })).ok, true);
  host.close();
  const carried = await admitTheImport(era);
  const ops = Object.values((await era.generation()).generation.collections.ops);
  assert.equal(ops[0].effective.utc_offset, '-05:00', 'the pinned binding stamped a summer day at -05:00');
  const controller = createLocalSourceController({ repository: carried.repository, namespace: NS,
    athleteId: ATHLETE, deviceId: DEVICE, producerRegistry: producerRegistryFor(carried),
    asOf: () => summer, platform: carried.platform });
  const prepared = await controller.prepareSource(await controller.reviewSource(carried.name),
    { identityConfirmed: true });
  assert.equal(prepared.ready, false, 'the import is withheld, not silently admitted');
  assert.deepEqual([...new Set(prepared.issues.map(i => i.code))], ['LOCAL_SOURCE_CONTEXT_UNRESOLVED'],
    'and the one reason is the recorded offset, not anything in the file');
  era.close();
});
