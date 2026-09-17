/* P3-IMPORT-UI - the shared harness for this directory's cells.

   REAL here: the real rebuild/m3/setup/port/port.cjs seal, the encrypted
   repository over fake-indexeddb, the accepted durable local client, the real
   setup lane, C2b custody and the S3 admission controller. Nothing is stubbed.

   SYNTHETIC ONLY. The source file is invented in the OS temp folder from the
   PUBLIC journey fixture through the ACCEPTED clean-init constructor, exactly
   as rebuild/m3/w6/test/local-source-consumer.test.mjs invents its own. No
   private fixture, no ledger and no owner data is read, named or reachable
   from here, and --out is always outside every git working tree. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { webcrypto } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { openTodayOverLocalEra, localDayOf, localOffsetOf } from '../../../w6/local/today-bindings.mjs';
import { createLocalSourceController, localSourceCommitCapability } from '../../../w6/local/source-admission.mjs';
import { createSourcePlatform } from '../../../w6/local/source-platform.mjs';
import { parseStrictJson } from '../../../w6/strict-json.mjs';
import Profile from '../../../../m4/import/local-source-profile.cjs';
import Capture from '../../../../m4/workout/capture.cjs';
import Commands from '../../../../m4/workout/commands.cjs';
import Journey from '../../../w6/host/test/journey-fixture.cjs';
import { createCleanInitState } from '../../today/setup-model.mjs';
import Setup from '../../today/setup-commands.mjs';

export const REPO = fileURLToPath(new URL('../../../../../', import.meta.url));
export const PORT = path.join(REPO, 'rebuild/m3/setup/port/port.cjs');
/* fake-indexeddb is a rebuild/m3/w6 development dependency and is resolved from
   there, exactly as every other suite that needs it does. Nothing is installed
   for this directory. */
export const { IDBFactory } = createRequire(new URL('../../../w6/test/support.mjs', import.meta.url))('fake-indexeddb');
export { webcrypto, localDayOf, localOffsetOf, createSourcePlatform, parseStrictJson, Profile };

export const SETUP = JSON.parse(JSON.stringify(Journey.SETUP));
export const TAGS = Object.fromEntries(SETUP.exercises.map(e => [e.id, { head: null, secondary: [] }]));
/* Invented working loads and reps, chosen so no figure here can be mistaken for
   the preview fixture's demonstration athlete. */
const LOADS = { 'db-bench': 45, 'lat-pulldown': 80, 'leg-press': 120 };
const REPS = { 'db-bench': [7, 7, 6], 'lat-pulldown': [11, 10], 'leg-press': [10, 10, 9] };
export const IMPORTED_LOADS = Object.entries(LOADS).sort();
const READS = [['2026-08-14', 178.2], ['2026-08-18', 177.6], ['2026-08-24', 177.1], ['2026-08-31', 176.4]];

/* The invented legacy file: this athlete's own week with a history the device
   has never seen. Built through the ACCEPTED clean-init constructor so its
   programme is the very one the first run records, which is what admission
   proves before it will admit anything. */
/* The file's own workout days. A cell that needs a file whose LAST workout is
   not before the one on the phone states its own list (LOCAL-CAPTURE-START-
   RESUME); the default is the three days every other cell already pins, in the
   same order, so the sealed bytes are unchanged for all of them. */
const DEFAULT_SESSIONS = [['2026-08-14', 'U'], ['2026-08-17', 'L'], ['2026-08-21', 'U']];
function inventedLegacyState(setup = SETUP, sessions = DEFAULT_SESSIONS) {
  const state = JSON.parse(JSON.stringify(createCleanInitState({ setup })));
  for (const ex of state.exercises) { ex.w = LOADS[ex.id]; ex.last = REPS[ex.id].slice(); }
  const session = type => ({ type, entries: state.exercises.filter(e => e.day === type)
    .map(e => ({ id: e.id, w: LOADS[e.id], reps: REPS[e.id].slice(), rir: 2, sets: e.sets })) });
  state.sessionLog = Object.fromEntries(sessions.map(([day, type]) => [day, session(type)]));
  state.reads = READS.map(([d, w]) => ({ d, w, sealed: false, note: 'INVENTED' }));
  state.model = { anchorISO: '2026-08-14', lean: 132, drip: 0, src: 'EYE' };
  /* A file the old app wrote carries its own smoothed trend; a clean-init state
     has no such member, and a missing one is not a number this harness may
     invent on the engine's behalf, so it is carried as the file's own. */
  state.trend = 176.9;
  return state;
}
export const SOURCE_SESSION_DAYS = ['2026-08-14', '2026-08-17', '2026-08-21'];

/* ANOTHER ATHLETE'S FILE. Same three lifts by id, but a week that is not the
   one this installation's first run recorded (one lift carries four sets, not
   three) and a different label. Admission proves the file's programme against
   the very setup document the device holds, so this is what "the wrong
   person's bundle" looks like to the controller. */
export const STRANGER_SETUP = JSON.parse(JSON.stringify(SETUP));
STRANGER_SETUP.athlete_label = 'synthetic-other-identity';
STRANGER_SETUP.exercises[0].sets = 4;

/* ONE REAL SEAL, produced once per test process. --out must be outside every
   git working tree and carry no `rebuild` segment (the port's own guard), so
   the OS temp folder is the only place it can go. */
export function sealInventedBundle(setup = SETUP, { sessions = DEFAULT_SESSIONS } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'imp-out-'));
  const out = path.join(dir, 'out');
  fs.mkdirSync(out);
  const file = path.join(dir, 'invented-legacy-state.json');
  fs.writeFileSync(file, JSON.stringify(inventedLegacyState(setup, sessions), null, 2));
  const run = spawnSync(process.execPath, [PORT, '--source', file, '--out', out],
    { cwd: REPO, encoding: 'utf8', timeout: 600000, windowsHide: true });
  if (run.status !== 0) throw new Error('port.cjs did not seal the invented bundle (status '
    + run.status + '): ' + String(run.stdout).slice(-600) + String(run.stderr).slice(-600));
  const names = fs.readdirSync(out);
  const bundleName = names.find(n => n.endsWith('.json'));
  const passName = names.find(n => n.endsWith('-PASSPHRASE.txt'));
  if (!bundleName || !passName) throw new Error('port.cjs wrote ' + JSON.stringify(names));
  return { dir, stdout: run.stdout,
    bytes: new Uint8Array(fs.readFileSync(path.join(out, bundleName))),
    passphrase: fs.readFileSync(path.join(out, passName), 'utf8').trim() };
}

/* THE PAGE'S OWN CLOCK (S4). `live` is an instant provider, not a day: the era,
   every host under it and every operation it writes take the device's real
   offset at that instant, which is the whole point of the cells below. */
export const liveAt = iso => () => new Date(iso);
export const eraFor = ({ indexedDB, live = null, clock, databaseName, namespace, athleteId, deviceId }) =>
  openTodayOverLocalEra({ indexedDB, crypto: webcrypto, databaseName, namespace,
    athleteId, deviceId, ...(clock ? { clock } : { live }) });

/* THE FIRST RUN, through the real setup lane, on the era's own live day. */
export async function firstRun(era, day) {
  const host = await era.createSetupHost({ day,
    commands: Setup.createSetupCommands(), profile: Setup.PROFILE });
  const saved = await host.save({ setup: SETUP, tags: TAGS });
  host.close();
  if (!saved.ok) throw new Error('the first run was refused: ' + (saved.code || saved.copy));
  return saved;
}

/* THE OPERATION THE INSTALLATION JUST WROTE, as admission will read it. The
   whole live-clock question is whether `utc_offset` is the offset in force on
   the day the op was written, or a year-round constant. */
export async function ownOperations(era) {
  const loaded = await era.generation();
  return Object.values(loaded.generation.collections.ops || {})
    .map(op => ({ op_id: op.op_id, class: op.class,
      local_date: op.effective && op.effective.local_date,
      local_time: op.effective && op.effective.local_time,
      utc_offset: op.effective && op.effective.utc_offset }));
}

/* WHAT THE DEVICE ACTUALLY HOLDS. "Nothing was written" is this record before
   and after, not a promise: the generation's revision, its operation and outbox
   counts, the import entries it has taken custody of, and whether a basis has
   been committed at all. */
export async function durable(era) {
  const loaded = await era.generation();
  const g = loaded.generation, c = g.collections || {}, m = g.metadata || {};
  return { revision: loaded.revision, ops: Object.keys(c.ops || {}).length,
    outbox: Object.keys(c.outbox || {}).length,
    imports: (m.imports || []).map(e => e.name).sort(),
    rebaseRequired: (m.imports || []).filter(e => e.rebaseRequired === true).map(e => e.name).sort(),
    applied: m.localSourceApplication ? m.localSourceApplication.core_complete === true : false,
    basis: !!(c.derived && c.derived.localSource) };
}

/* C2b CUSTODY: the sealed bundle carried onto the device, then read back out of
   custody exactly as the S3 controller reads it. Writes the import entry and
   the original; writes no basis. */
export async function carry(era, sealed, { passphrase = sealed.passphrase } = {}) {
  const platform = createSourcePlatform();
  const carried = await era.client.importBundle({ bundleBytes: sealed.bytes, passphrase });
  if (!carried.imported) return { carried, platform, refused: carried.code };
  return { carried, platform, refused: null };
}

const prescriptionCapture = Capture.createPrescriptionCapture({ parseStrictJson });
const workoutCommands = Commands.createWorkoutCommands({ prescriptionCapture });

/* The material the controller qualifies, read back through the same custody
   handle source-admission.mjs uses. */
export async function material(era, platform, name) {
  const repository = (await era.client.hostBindings({ workoutCommands })).repository;
  const custody = repository.importCustody({ parseStrictJson, validateContext: () => null });
  const loaded = await custody.load(name);
  const raw = { source_json: platform.text(loaded.sourceBytes),
    candidate_json: platform.text(loaded.candidateBytes),
    local_json: loaded.localBytes === null ? null : platform.text(loaded.localBytes),
    engine_context_json: loaded.engineContextJson };
  return { repository, raw, context: parseStrictJson(raw.engine_context_json),
    materialDigest: Profile.digest(platform.hash, 'earned/local-source-material/v1', raw) };
}

/* SYNTHETIC reviewed native-Date evidence for this invented execution calendar:
   each raw input bound to the exact epoch the native implementation produces,
   malformed input to NaN, each epoch to its exact native ISO or invalid
   outcome. Copied in shape from P2's own witness; it proves algorithm
   composition, never the provenance of an owner's real execution. */
const NATIVE_DATE_EVIDENCE = () => ({ profile: 'earned/native-date-capability/v1',
  parse_vectors: [{ input: '2026-03-15T12:00:00.000Z', epoch: 1773576000000 },
    { input: '2026-08-14T12:00:00.000Z', epoch: 1786708800000 },
    { input: '2026-09-03T12:00:00.000Z', epoch: 1788436800000 },
    { input: 'TEST-ONLY not a timestamp', epoch: null }],
  constructor_vectors: [{ epoch: 1786708800001, iso: '2026-08-14T12:00:00.001Z' },
    { epoch: 1788436800001, iso: '2026-09-03T12:00:00.001Z' }, { epoch: 8640000000000001, iso: null }] });

/* The execution calendar's own date vectors. Every one is re-verified against
   THIS device's native Date by local-source-profile.cjs clockAt() before the
   mapping qualifies, so an enumerated day that the device disagrees with
   refuses SOURCE_ENGINE_CONTEXT_UNPROVEN rather than passing quietly. Both
   sides of the 2026 US DST boundaries are named for that reason.
   The last three days are LOCAL-CAPTURE-START-RESUME's: 2026-10-16 and
   2026-10-17 are its EDT pair (-04:00, both before DST ends on 2026-11-01) and
   2026-11-21 its EST second day, and an operation on a day this list does not
   name refuses SOURCE_ENGINE_CONTEXT_UNPROVEN rather than being waved through,
   so they are named here for the same reason as the rest. */
const CALENDAR_DAYS = ['2026-03-07', '2026-03-08', '2026-03-09', '2026-08-14', '2026-08-17',
  '2026-08-18', '2026-08-21', '2026-08-24', '2026-08-31', '2026-09-03', '2026-09-04',
  '2026-09-16', '2026-10-31', '2026-11-01', '2026-11-02', '2026-11-20',
  '2026-10-16', '2026-10-17', '2026-11-21'];

export function producerRegistryFor({ platform, context, materialDigest }, { days = CALENDAR_DAYS } = {}) {
  const dates = days.map(day => {
    const [y, m, d] = day.split('-').map(Number), noon = new Date(y, m - 1, d, 12);
    return { day, noonISO: noon.toISOString(), offsetMinutes: noon.getTimezoneOffset() };
  });
  const gate = { clock: context.oracle.gate.clock, tz: context.oracle.gate.tz };
  const mapping = { profile: 'earned/source-producer-mapping/v1', id: 'TEST-ONLY-p3-mapping',
    construction: 'oracle-shim-default/v1', engine: context.engine, gate,
    public_factory_digest: Profile.PUBLIC_FACTORY_DIGEST, source_pins: Profile.SOURCE_PINS,
    dependencies: { drafts: 'default-empty' },
    executions: [{ id: 'TEST-ONLY-p3-run', material_digest: materialDigest,
      calendar: { profile: 'earned/native-date-compatibility/v1',
        compatibility_id: 'TEST-ONLY-p3-calendar', zone: gate.tz,
        range: { from: '2026-01-01', to: '2026-12-31' }, dates,
        native_date: NATIVE_DATE_EVIDENCE() } }] };
  return Profile.createProducerRegistry([mapping], { hash: platform.hash });
}

/* THE CALL SEQUENCE A REAL IMPORT SCREEN MUST REPRODUCE, in its own order:
   reviewSource (step 3's review and its identity question), prepareSource with
   the athlete's confirmation (step 3's confirm), publish, reconcile, view.
   `asOf` is the LIVE day the page is standing on, never a frozen one.
   `prefixAnswer` is HIS answer to that same identity question, and the default
   is the Yes the screen sends when he taps Yes; a cell that wants the other
   answer, or no answer at all, says so (LOCAL-CAPTURE-START-RESUME). */
export async function admit(era, sealed, options) {
  const { day, namespace, athleteId, deviceId } = options;
  /* Naming the key with an undefined value is the question he never answered,
     and it must not collapse into the default Yes: that is a different case and
     these cells measure it. */
  const answers = !Object.hasOwn(options, 'prefixAnswer') ? { identityConfirmed: true, prefixAnswer: true }
    : options.prefixAnswer === undefined ? { identityConfirmed: true }
      : { identityConfirmed: true, prefixAnswer: options.prefixAnswer };
  const { carried, platform } = await carry(era, sealed);
  if (!carried.imported) return { admitted: false, stage: 'custody', code: carried.code };
  const held = await material(era, platform, carried.name);
  const controller = createLocalSourceController({ repository: held.repository,
    namespace, athleteId, deviceId,
    producerRegistry: producerRegistryFor({ platform, context: held.context,
      materialDigest: held.materialDigest }),
    asOf: () => day, platform });
  let review;
  try { review = await controller.reviewSource(carried.name); }
  catch (error) { return { admitted: false, stage: 'review', code: error.code || error.message, controller }; }
  const prepared = await controller.prepareSource(review, answers);
  if (prepared.profile !== 'earned/local-source-qualification/v1') {
    return { admitted: false, stage: 'prepare', review, controller, name: carried.name,
      issues: prepared.issues || [], codes: (prepared.issues || []).map(i => i.code) };
  }
  const capability = localSourceCommitCapability(prepared);
  await capability.publish();
  const settled = await capability.reconcile();
  return { admitted: true, review, controller, name: carried.name,
    view: await controller.view(settled) };
}

/* ---------------------------------------------------------------------------
   P3-IMPORT-UI-2 - THE REAL TODAY ROUTE, in jsdom over fake-indexeddb.
   Everything below drives the SHIPPED page: design.shellHtml() with the
   approved templates in it, today-entry.mjs boot(), and the Import route
   today-app.cjs opens by dynamic import. Nothing is stubbed and no screen is
   mounted by hand.
   --------------------------------------------------------------------------- */
import { JSDOM } from 'jsdom';
import design from '../../today/design.cjs';
import * as Entry from '../../today/today-entry.mjs';
export { Entry };

export function shellWindow() {
  const dom = new JSDOM(design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()),
    { url: 'https://example.test/' });
  /* A PHONE'S WINDOW HAS WebCrypto. jsdom's has a `crypto` with getRandomValues
     and NO `subtle`, so a page that unseals a bundle would refuse
     LOCAL_CRYPTO_UNAVAILABLE here for a reason that exists nowhere on a device.
     Node's own WebCrypto is the same standard implementation the browser
     exposes, and it is what the accepted W6 browser boundary already
     substitutes; nothing else about the window is changed. */
  Object.defineProperty(dom.window, 'crypto', { configurable: true, value: webcrypto });
  return dom.window;
}

export const textOf = doc => (doc.getElementById('phone') || doc.body).textContent.replace(/\s+/g, ' ');
export const slot = (doc, name) => doc.querySelector('[data-slot="' + name + '"]');
export const slots = (doc, name) => [...doc.querySelectorAll('[data-slot="' + name + '"]')];
export const tap = node => { node.dispatchEvent(new node.ownerDocument.defaultView.Event('click', { bubbles: true })); };
export function type(node, value) {
  node.value = value;
  const view = node.ownerDocument.defaultView;
  node.dispatchEvent(new view.Event('input', { bubbles: true }));
  node.dispatchEvent(new view.Event('change', { bubbles: true }));
}

/* THE ATHLETE PICKING A FILE. jsdom gives no file chooser, so the bytes are put
   on the real <input type="file"> the screen rendered and its own change event
   is fired: everything after this point is the shipped code path. */
export function pickBundle(win, input, bytes, name = 'earned-port-2026-09-16.json') {
  const file = new win.File([bytes], name, { type: 'application/json' });
  Object.defineProperty(input, 'files', { configurable: true, value: [file] });
  input.dispatchEvent(new win.Event('change', { bubbles: true }));
  return file;
}

/* THE TRAPS (bar item g). Every way a page could send a byte off the device or
   hand it to the operating system, replaced by a recorder. Installed BEFORE the
   route is opened and read after; the route must never touch one. */
export function installTraps(win) {
  const fired = [];
  const record = name => (...args) => { fired.push(name); throw new Error('TRAP ' + name); };
  win.fetch = record('fetch');
  win.XMLHttpRequest = function () { fired.push('XMLHttpRequest'); throw new Error('TRAP xhr'); };
  win.navigator.share = record('navigator.share');
  win.open = record('window.open');
  if (!win.URL.createObjectURL) win.URL.createObjectURL = record('createObjectURL');
  else win.URL.createObjectURL = record('createObjectURL');
  const click = win.HTMLAnchorElement.prototype.click;
  win.HTMLAnchorElement.prototype.click = function () {
    if (this.hasAttribute('download')) fired.push('download');
    return click.apply(this, arguments);
  };
  return { fired: () => fired.slice() };
}

/* ---------------------------------------------------------------------------
   THE PHONE'S OWN CONFIGURATION (round 2, review r1 finding 1).

   A phone has ONE IndexedDB and ONE installation. Every other helper above
   opens the page on a per-cell database name, which keeps cells independent but
   also puts the measure lane - which always opens gym-host.mjs's DEFAULT
   database and namespace (measure-screen.mjs:70 passes neither) - BESIDE the
   page's installation instead of inside it. That difference is not cosmetic: it
   decides whether the measure lane's operations are in the generation admission
   replays. So the cells that make a claim about what an athlete gets open the
   page THIS way, through gym-host.mjs's own openTodayHosts with its own
   defaults, and the IDBFactory is put on the window as well so the measure lane
   finds the same store.
   --------------------------------------------------------------------------- */
export async function phoneDevice({ at, day, firstRun: enrol = true } = {}) {
  const { openTodayHosts } = await import('../../today/gym-host.mjs');
  const indexedDB = new IDBFactory();
  const win = shellWindow();
  Object.defineProperty(win, 'indexedDB', { configurable: true, value: indexedDB });
  const era = await openTodayHosts({ indexedDB, crypto: win.crypto, live: liveAt(at) });
  if (enrol) await firstRun(era, day);
  const booted = await Entry.boot({ document: win.document, hosts: era, now: liveAt(at) });
  await booted.api.ready;
  return { indexedDB, win, doc: win.document, era, booted,
    close: () => { booted.rollover.stop(); booted.teardown(); era.close(); } };
}
