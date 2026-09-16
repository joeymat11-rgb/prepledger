/* P3-IMPORT-UI-2 - THE REAL-EDGE RUN (bar item j).
 *
 * The A1 dist, exactly as A5 ships it, served from a local origin and opened in
 * a REAL headless Edge with the REAL clock and the real time zone: real
 * IndexedDB, real WebCrypto, real file picker, real taps. The bundle is the
 * SYNTHETIC one the rest of this directory uses, sealed by the real port.cjs.
 *
 * What it records, and what the runbook's phone half is then written from: the
 * label on every control the athlete touches, in the order he touches them, and
 * the production mapping's engine revision as the review screen prints it.
 *
 * Exit 2 = BLOCKED (no browser), never a silent pass.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { buildBrowser } from '../../../w6/build-browser.mjs';
import { buildToday } from '../../today/build.mjs';
import { sealInventedBundle, SETUP, TAGS } from './support.mjs';
import Production from '../../../../m4/import/production-mapping.cjs';
import Screen from '../import-screen.mjs';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
let chromium;
try { ({ chromium } = require(process.env.W6_PLAYWRIGHT_DIR || 'playwright-core')); }
catch { console.log('P3 EDGE-ROUTE BLOCKED - pinned playwright-core unavailable'); process.exit(2); }
const executablePath = process.env.W6_BROWSER_BIN;
if (!executablePath || !fs.existsSync(executablePath)) {
  console.log('P3 EDGE-ROUTE BLOCKED - set W6_BROWSER_BIN to an installed Chromium/Edge executable');
  process.exit(2);
}

const SEALED = sealInventedBundle();
const OUT = path.join(REPO, '.tmp/p3-edge-route');
fs.mkdirSync(OUT, { recursive: true });

/* THE SHIPPED PAGE, built by A1 itself. Not a witness bundle: the three assets
   this serves are the three A5 deploys. */
const today = await buildToday({ dist: path.join(OUT, 'dist'), scratch: path.join(OUT, 'scratch') });
/* And the seed module, built by the SAME accepted bundler. */
const seed = await buildBrowser({ outfile: path.join(OUT, 'seed.js'),
  entryPoints: [path.join(HERE, 'edge-seed-entry.mjs')] });

const SEED_HTML = '<!doctype html><meta charset="utf-8"><title>seed</title>'
  + '<script type="module" src="/seed.js"></script>';
const served = new Map([
  ['/index.html', ['text/html', fs.readFileSync(path.join(today.dist, 'index.html'))]],
  ['/styles.css', ['text/css', fs.readFileSync(path.join(today.dist, 'styles.css'))]],
  ['/app.js', ['text/javascript', fs.readFileSync(path.join(today.dist, 'app.js'))]],
  ['/seed.js', ['text/javascript', fs.readFileSync(seed.outfile)]],
  ['/seed.html', ['text/html', Buffer.from(SEED_HTML)]]]);
const server = http.createServer((request, response) => {
  const name = request.url.split('?')[0];
  const hit = served.get(name === '/' ? '/index.html' : name);
  if (!hit) {
    /* A browser asks for /favicon.ico whether or not a document names one, and
       A5's own folder is what carries the icons. A 404 is a page error, and
       page errors are a failure condition here, so the three assets A1 really
       writes are served and anything else asset-shaped is served empty rather
       than quietly tolerated. */
    if (/\.(?:ico|png|svg|webmanifest|woff2)$/.test(name)) {
      response.writeHead(200, { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' });
      response.end('');
      return;
    }
    response.writeHead(404); response.end(); return;
  }
  response.writeHead(200, { 'Content-Type': hit[0], 'Cache-Control': 'no-store' });
  response.end(hit[1]);
});
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const origin = 'http://127.0.0.1:' + server.address().port;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'p3-edge-profile-'));
const errors = [];
const taps = [];

/* The production calendar is New York's and local-source-profile.cjs refuses
   unless the DEVICE resolves to that zone, so the browser is told which zone it
   is standing in rather than inheriting the machine's (P3-D-FOLLOWONS (c), and
   the runbook's own pre-check 7). */
const context = await chromium.launchPersistentContext(profile,
  { executablePath, headless: true, timezoneId: 'America/New_York' });
const page = context.pages()[0] || await context.newPage();
page.on('pageerror', error => errors.push(String(error && error.message ? error.message : error)));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

let failure = null;
let before = null;
try {
  /* 1. THE FIRST RUN, on the same origin, before the page is ever opened. */
  await page.goto(origin + '/seed.html', { waitUntil: 'load' });
  await page.waitForFunction('typeof window.SEED === "function"');
  const seeded = await page.evaluate(input => window.SEED(input), { setup: SETUP, tags: TAGS });
  assert.equal(seeded.ok, true, 'the first run was refused in the browser: ' + seeded.code);
  taps.push(['Device zone and offset', seeded.zone + ' ' + seeded.offsetMinutes]);
  taps.push(['Installation first run', seeded.day + ' ' + JSON.stringify(seeded.ops)]);

  /* 2. THE SHIPPED PAGE, AND THE ENTRY LINK ON TODAY, CLICKED. Round 2 (review
     r1 finding 1): this run used to navigate straight to ?screen=import, so the
     entry itself was never taken in a browser. It is taken here, from the Today
     screen, which is the entry the runbook now sends the operator to and the
     only one on this page that can admit.

     NOT through the Measure screen, for a reason this run is what found (see
     the report's open item 1, P3-X9 and P3-X10): the first render of Measure
     writes this installation's trial-start operations, and the S3 admission
     replay has no family for them, so an import attempted after Measure has
     been opened refuses LOCAL_SOURCE_CONTEXT_UNRESOLVED. The Measure link's own
     two labels are read off the served page in step 8 and step 9. */
  await page.goto(origin + '/index.html', { waitUntil: 'load' });
  const entry = page.locator('[data-slot="import-entry"]');
  await entry.waitFor({ state: 'visible', timeout: 20000 });
  taps.push(['Today entry link', await entry.textContent()]);
  assert.equal(await entry.evaluate(node => Math.round(node.getBoundingClientRect().height) >= 44), true,
    'the served entry link is under the 44 px tap minimum');
  await entry.click();

  /* 3. PICK THE FILE. A real <input type="file"> and a real file. */
  const pick = page.locator('#import-file');
  await pick.waitFor({ state: 'attached', timeout: 20000 });
  taps.push(['Step 1, file label', await page.locator('label[for="import-file"]').textContent()]);
  await pick.setInputFiles({ name: 'earned-port-synthetic.json',
    mimeType: 'application/json', buffer: Buffer.from(SEALED.bytes) });

  /* 4. THE SIX WORDS, typed, and Unlock. */
  const words = page.locator('#import-passphrase');
  await words.waitFor({ state: 'visible', timeout: 20000 });
  taps.push(['Step 2, passphrase label', await page.locator('label[for="import-passphrase"]').textContent()]);
  assert.equal(await words.getAttribute('autocapitalize'), 'off');
  assert.equal(await words.getAttribute('autocorrect'), 'off');
  assert.equal(await words.evaluate(node => getComputedStyle(node).fontSize), '16px',
    'the served stylesheet does not give the passphrase box 16 px');
  await words.fill(SEALED.passphrase);
  const unlock = page.locator('[data-slot="import-unlock"]');
  taps.push(['Step 2, control', await unlock.textContent()]);
  await unlock.click();

  /* 5. THE IDENTITY QUESTION, read off the served page. */
  const question = page.locator('[data-slot="import-identity-question"]');
  await question.waitFor({ state: 'visible', timeout: 20000 });
  const asked = await question.textContent();
  assert.equal(asked, Screen.IDENTITY_QUESTION, 'the served page asks a different question');
  taps.push(['Step 3, identity question', asked]);
  const yes = page.locator('[data-slot="import-identity-yes"]');
  taps.push(['Step 3, answer', await yes.textContent()]);
  await yes.click();

  /* 6. THE REVIEW, and the confirm. */
  const reviewQuestion = page.locator('[data-slot="import-review-question"]');
  await reviewQuestion.waitFor({ state: 'visible', timeout: 30000 });
  assert.equal(await reviewQuestion.textContent(), Screen.IDENTITY_QUESTION);
  const engine = await page.locator('[data-slot="import-review-engine"]').textContent();
  assert.ok(engine.includes(Production.ENGINE_REVISION),
    'the review does not print the production mapping\'s engine revision: ' + engine);
  taps.push(['Step 3, engine revision', Screen.ENGINE_REVISION_LABEL + ' ' + Production.ENGINE_REVISION]);
  const confirm = page.locator('[data-slot="import-confirm"]');
  taps.push(['Step 3, confirm', await confirm.textContent()]);
  await confirm.click();

  /* 7. DONE, and the read-only summary beneath it. The wait is for EITHER the
     confirmation or a refusal, so a refused run reports the machinery's own
     code instead of timing out with nothing to say. */
  await page.waitForFunction(
    'document.querySelector(\'[data-slot="import-done"]\') || document.querySelector(\'[data-slot="import-refusal"]\')',
    null, { timeout: 120000 });
  const refused = await page.locator('[data-slot="import-refusal"]').count();
  assert.equal(refused, 0, 'the route refused: '
    + (refused ? await page.locator('[data-slot="import-refusal"]').textContent() : ''));
  const done = page.locator('[data-slot="import-done"]');
  await done.waitFor({ state: 'visible', timeout: 20000 });
  taps.push(['Step 4, confirmation', await done.textContent()]);
  const summary = await page.locator('[data-slot="import-summary"]').textContent();
  assert.ok(summary.includes('port:'), 'the summary names no import: ' + summary);
  taps.push(['Step 4, summary heading', Screen.COPY.summaryHead]);

  /* 8. AND ON MEASURE, the link has changed its words. */
  await page.goto(origin + '/index.html?screen=measure', { waitUntil: 'load' });
  const again = page.locator('[data-slot="import-entry"]');
  await again.waitFor({ state: 'visible', timeout: 20000 });
  const label = await again.textContent();
  assert.equal(label, Screen.COPY.entryDone, 'the link still offers an import that has happened');
  taps.push(['Measure screen, entry link after admission', label]);
  assert.deepEqual(errors, [], 'the page reported errors');

  /* 9. THE SAME LINK BEFORE ANY IMPORT, read off the served page in a SECOND,
     untouched installation - the words the athlete actually sees on the day. */
  before = await chromium.launchPersistentContext(
    fs.mkdtempSync(path.join(os.tmpdir(), 'p3-edge-before-')),
    { executablePath, headless: true, timezoneId: 'America/New_York' });
  const fresh = before.pages()[0] || await before.newPage();
  await fresh.goto(origin + '/seed.html', { waitUntil: 'load' });
  await fresh.waitForFunction('typeof window.SEED === "function"');
  await fresh.evaluate(input => window.SEED(input), { setup: SETUP, tags: TAGS });
  await fresh.goto(origin + '/index.html?screen=measure', { waitUntil: 'load' });
  const first = fresh.locator('[data-slot="import-entry"]');
  await first.waitFor({ state: 'visible', timeout: 20000 });
  taps.push(['Measure screen, entry link before any import', await first.textContent()]);
  taps.push(['Measure screen, the line it sits on',
    await fresh.locator('[data-slot="measure-marker-pick"] h2').textContent()
      .catch(() => '(the markers pick stands before the comparison)')]);
} catch (error) {
  failure = error;
  try { failure.screen = (await page.locator('#phone').textContent()).replace(/\s+/g, ' ').slice(0, 600); }
  catch (_) { /* the page is gone; the message is all there is */ }
}

await context.close();
if (before) await before.close();
server.close();
try { fs.rmSync(SEALED.dir, { recursive: true, force: true }); } catch {}
try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
try { fs.rmSync(OUT, { recursive: true, force: true }); } catch {}

if (failure) {
  console.error('P3 EDGE-ROUTE FAIL: ' + failure.message);
  if (failure.screen) console.error('  screen: ' + failure.screen);
  for (const [where, label] of taps) console.error('  ' + where + ': ' + JSON.stringify(label));
  for (const line of errors.slice(0, 5)) console.error('  page error: ' + line);
  process.exitCode = 1;
} else {
  console.log('P3 EDGE-ROUTE PASS - the shipped A1 dist, real ' + path.basename(executablePath)
    + ', real clock, America/New_York, ' + taps.length + ' labels recorded:');
  for (const [where, label] of taps) console.log('  ' + where + ': ' + JSON.stringify(label));
}
