// P2 S3 IMPORT JOIN - THE EDGE HALF OF THE END-TO-END WITNESS.
//
// The same invented synthetic bundle the jsdom witness uses, sealed by the REAL
// port.cjs, carried through C2b custody and admitted INSIDE A REAL BROWSER over
// real IndexedDB and real WebCrypto, then read back off the shipped Today model
// and gym card. The browser process is then KILLED (no graceful flush, which is
// what an iOS tab termination is) and a new one opened over the same profile.
//
// Exit 2 = BLOCKED (no browser), never a silent pass.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { once } from 'node:events';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { builtinModules } from 'node:module';
import Journey from '../host/test/journey-fixture.cjs';
import { createCleanInitState } from '../../w7-preview/today/setup-model.mjs';
import { EFFORT_CHOICES } from '../../w7-preview/today/gym-model.mjs';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../..');
let chromium;
try { ({ chromium } = require(process.env.W6_PLAYWRIGHT_DIR || 'playwright-core')); }
catch { console.log('P2 CONSUMER-BROWSER BLOCKED - pinned playwright-core unavailable'); process.exit(2); }
const executablePath = process.env.W6_BROWSER_BIN;
if (!executablePath || !fs.existsSync(executablePath)) {
  console.log('P2 CONSUMER-BROWSER BLOCKED - set W6_BROWSER_BIN to an installed Chromium/Edge executable');
  process.exit(2);
}
const processName = path.basename(executablePath);
const DAY = '2026-11-20', DB = 'p2-browser-witness', NS = 'joe/p2-browser';
const ATHLETE = 'ath-p2-browser', DEVICE = 'dev-p2-browser';
const SETUP = JSON.parse(JSON.stringify(Journey.SETUP));
const TAGS = Object.fromEntries(SETUP.exercises.map(e => [e.id, { head: null, secondary: [] }]));
const LOADS = { 'db-bench': 45, 'lat-pulldown': 80, 'leg-press': 120 };
const REPS = { 'db-bench': [7, 7, 6], 'lat-pulldown': [11, 10], 'leg-press': [10, 10, 9] };
const READS = [178.2, 177.6, 177.1, 176.4];
const FIXTURE_MARKS = ['demo-press', 'demo-row', 'demo-leg', 'demo-curl', '184.8', '184.4'];

function inventedLegacyState() {
  const state = JSON.parse(JSON.stringify(createCleanInitState({ setup: SETUP })));
  for (const ex of state.exercises) { ex.w = LOADS[ex.id]; ex.last = REPS[ex.id].slice(); }
  const session = type => ({ type, entries: state.exercises.filter(e => e.day === type)
    .map(e => ({ id: e.id, w: LOADS[e.id], reps: REPS[e.id].slice(), rir: 2, sets: e.sets })) });
  state.sessionLog = { '2026-08-14': session('U'), '2026-08-17': session('L'), '2026-08-21': session('U') };
  state.reads = [{ d: '2026-08-14', w: 178.2 }, { d: '2026-08-18', w: 177.6 },
    { d: '2026-08-24', w: 177.1 }, { d: '2026-08-31', w: 176.4 }]
    .map(r => ({ ...r, sealed: false, note: 'INVENTED' }));
  state.model = { anchorISO: '2026-08-14', lean: 132, drip: 0, src: 'EYE' };
  state.trend = 176.9;
  return state;
}
function sealInventedBundle() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'p2-browser-witness-'));
  const out = path.join(dir, 'out');
  fs.mkdirSync(out);
  const file = path.join(dir, 'invented-legacy-state.json');
  fs.writeFileSync(file, JSON.stringify(inventedLegacyState(), null, 2));
  const run = spawnSync(process.execPath, [path.join(REPO, 'rebuild/m3/setup/port/port.cjs'),
    '--source', file, '--out', out], { cwd: REPO, encoding: 'utf8', timeout: 600000, windowsHide: true });
  if (run.status !== 0) throw new Error('port.cjs did not seal the invented bundle: '
    + String(run.stdout).slice(-500) + String(run.stderr).slice(-500));
  const names = fs.readdirSync(out);
  return { dir, stdout: run.stdout,
    bytes: Array.from(fs.readFileSync(path.join(out, names.find(n => n.endsWith('.json'))))),
    passphrase: fs.readFileSync(path.join(out, names.find(n => n.endsWith('-PASSPHRASE.txt'))), 'utf8').trim() };
}
const SEALED = sealInventedBundle();

const days = ['2026-08-14', '2026-08-17', '2026-08-18', '2026-08-21', '2026-08-24', '2026-08-31',
  '2026-09-03', '2026-09-04', DAY];
const CALENDAR = { range: { from: '2026-01-01', to: '2026-12-31' },
  dates: days.map(day => {
    const [y, m, d] = day.split('-').map(Number), noon = new Date(y, m - 1, d, 12);
    return { day, noonISO: noon.toISOString(), offsetMinutes: noon.getTimezoneOffset() };
  }),
  native_date: { profile: 'earned/native-date-capability/v1',
    parse_vectors: [{ input: '2026-03-15T12:00:00.000Z', epoch: 1773576000000 },
      { input: '2026-08-14T12:00:00.000Z', epoch: 1786708800000 },
      { input: '2026-09-03T12:00:00.000Z', epoch: 1788436800000 },
      { input: 'TEST-ONLY not a timestamp', epoch: null }],
    constructor_vectors: [{ epoch: 1786708800001, iso: '2026-08-14T12:00:00.001Z' },
      { epoch: 1788436800001, iso: '2026-09-03T12:00:00.001Z' }, { epoch: 8640000000000001, iso: null }] } };
const design = require('../../w7-preview/today/design.cjs');
const INPUT = { bundleBytes: SEALED.bytes, passphrase: SEALED.passphrase, setup: SETUP, tags: TAGS,
  day: DAY, db: DB, ns: NS, athlete: ATHLETE, device: DEVICE, calendar: CALENDAR,
  effort: EFFORT_CHOICES[0].reserve,
  shellHtml: design.shellHtml().replace('<!-- APPROVED_TEMPLATES -->', design.templateHtml()) };

const out = path.join(HERE, '.tmp', 'p2-consumer-browser');
fs.mkdirSync(out, { recursive: true });
/* The same browser boundary rebuild/m3/w6/build-browser.mjs enforces - no Node
   builtin reaches the phone realm, and only rebuild/client's approved importers
   get the WebCrypto sha256 shim - with ONE addition this witness needs and the
   page build does not. engine-runtime.cjs composes the engine through a single
   computed require (the loop rebuild/m4/import/test/s3/run.mjs pins by byte);
   esbuild answers a computed require by globbing the directory, which in a FULL
   checkout also sweeps in rebuild/engine/test and, through it, rebuild/conform.
   Those are never required at runtime - the loop only ever asks for its twelve
   named modules - so they are stubbed here rather than smuggled into the realm. */
const builtins = new Set(builtinModules.flatMap(name => [name, 'node:' + name.replace(/^node:/, '')]));
const approved = new Set(['ops.cjs', 'plan.cjs']
  .map(name => path.resolve(REPO, 'rebuild/client', name).replaceAll('\\', '/')));
const sweptIn = /rebuild[\\/](?:engine[\\/]test|conform)[\\/]/;
const built = { outfile: path.join(out, 'p2.mjs') };
await build({ absWorkingDir: REPO, entryPoints: [path.join(HERE, 'p2-consumer-browser-entry.mjs')],
  outfile: built.outfile, bundle: true, platform: 'browser', format: 'esm', target: 'es2022',
  logLevel: 'silent', logOverride: { 'unsupported-dynamic-import': 'silent' },
  plugins: [{ name: 'p2-witness-boundary', setup(builder) {
    builder.onResolve({ filter: /.*/ }, args => {
      if (sweptIn.test(args.path) || sweptIn.test(path.resolve(args.resolveDir || REPO, args.path))) {
        return { path: args.path, namespace: 'p2-never-required' };
      }
      if (args.path === 'node:crypto' && approved.has(args.importer.replaceAll('\\', '/'))) {
        return { path: path.resolve(REPO, 'rebuild/m3/w6/node-sha256-browser.mjs') };
      }
      if (builtins.has(args.path)) return { errors: [{ text: 'Unapproved browser Node import ' + args.path }] };
      return undefined;
    });
    builder.onLoad({ filter: /.*/, namespace: 'p2-never-required' },
      () => ({ contents: 'module.exports = {};', loader: 'js' }));
  } }] });
/* No shell markup in the served document: today-entry.mjs auto-boots at module
   load when it finds #phone, and this witness boots it itself, once, over the
   installation it has just imported into. */
const html = '<!doctype html><meta charset="utf-8"><title>P2 import consumer witness</title>'
  + '<script type="module" src="/p2.mjs"></script>';
const server = http.createServer((request, response) => {
  if (request.url === '/') { response.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-store' }); response.end(html); }
  else if (request.url === '/p2.mjs') { response.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-store' }); response.end(fs.readFileSync(built.outfile)); }
  /* The approved shell markup links a stylesheet and an icon. This witness reads
     the screen's TEXT, not its paint, so those are served empty rather than left
     to 404: a missing resource is a page error, and page errors are a failure
     condition here, so nothing may be quietly tolerated. */
  else if (/\.(?:css|svg|png|ico|webmanifest|woff2)$/.test(request.url)) {
    response.writeHead(200, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' });
    response.end('');
  } else { response.writeHead(404); response.end(); }
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const origin = 'http://127.0.0.1:' + server.address().port + '/';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'p2-consumer-profile-'));
const errors = [];
let context = null;

async function open() {
  context = await chromium.launchPersistentContext(profile, { executablePath, headless: true });
  const page = context.pages()[0] || await context.newPage();
  page.on('pageerror', error => errors.push(String(error && error.message ? error.message : error)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(origin, { waitUntil: 'load' });
  await page.waitForFunction('typeof window.P2 === "object"');
  return page;
}
/* A REAL PROCESS KILL, not context.close(): a graceful shutdown lets the browser
   flush what it was holding, which is the case this witness exists to rule out. */
function killOwned() {
  try { execFileSync('taskkill', ['/F', '/T', '/IM', processName], { stdio: 'ignore' }); }
  catch { /* nothing of ours was left running */ }
  context = null;
}

let cells = 0;
try {
  const page = await open();
  const first = await page.evaluate(input => window.P2.first(input), INPUT);
  assert.deepEqual(first.admitted, [['db-bench', 45], ['lat-pulldown', 80], ['leg-press', 120]],
    'the admission replayed the imported working loads in the browser');
  /* LOCAL-CAPTURE-START-RESUME closed the last entry, so the list is EMPTY
     here too; the new reason stands where the old one did. */
  assert.deepEqual(first.integration_pending, []);
  assert.equal(first.label, SETUP.athlete_label, 'Today stands on his own record');
  assert.deepEqual(first.basisLoads, [['db-bench', 45], ['lat-pulldown', 80], ['leg-press', 120]],
    'the imported loads ARE the basis the shipped model reads');
  assert.deepEqual(first.reads, READS, 'the imported readings came with it');
  assert.deepEqual(first.sessions, ['2026-08-14', '2026-08-17', '2026-08-21']);
  assert.equal(first.cardPhase, 'ready');
  assert.equal(first.cardLift, 'db-bench', 'the gym card opens on his own first lift');
  assert.equal(first.cardCount, 2, 'his two upper-body lifts, not the fixture\'s four');
  assert.match(first.cardLine, /^45 lb/, 'and prescribes from the IMPORTED working load');
  for (const mark of FIXTURE_MARKS) {
    assert.ok(!first.cardJson.includes(mark), 'no fixture lift on the card: ' + mark);
    assert.ok(!first.text.includes(mark), 'no fixture figure on the screen: ' + mark);
  }
  assert.equal(first.storage, 0, 'nothing of this landed in localStorage');
  assert.ok(first.logged > 0, 'a new workout was saved on top of the imported history');
  cells += first.cells;

  killOwned();
  const reopened = await open();
  const after = await reopened.evaluate(input => window.P2.reopen(input), INPUT);
  assert.equal(after.admitted, true, 'the admitted import survived the kill');
  assert.deepEqual(after.basisLoads, [['db-bench', 45], ['lat-pulldown', 80], ['leg-press', 120]],
    'and is still the basis');
  assert.deepEqual(after.reads, READS);
  assert.deepEqual(after.sessions, ['2026-08-14', '2026-08-17', '2026-08-21']);
  assert.equal(after.sessionOps.filter(kind => kind === 'session-start').length, 1,
    'the new Start is still on disk: ' + JSON.stringify(after.sessionOps));
  assert.ok(after.sessionOps.length >= first.logged + 1, 'with every set he saved');
  assert.equal(after.cardPhase, 'finished', 'the reopened card knows the workout happened');
  assert.equal(after.cardSets, first.logged);
  for (const mark of FIXTURE_MARKS) assert.ok(!after.text.includes(mark), 'still no fixture figure');
  cells += after.cells;
  if (errors.length) throw new Error('P2_BROWSER_PAGE_ERRORS ' + errors.join('|'));
  console.log('P2 CONSUMER-BROWSER PASS - ' + cells + ' checks in real Edge; sealed by the real port, '
    + 'unsealed through C2b custody, admitted, visible on Today and the gym card, and still there after a force-kill');
} finally {
  killOwned();
  server.close();
  try { fs.rmSync(SEALED.dir, { recursive: true, force: true }); } catch { /* scratch only */ }
}
