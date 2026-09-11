// Actual release folder, supported server/headers, synthetic user entries only.
// W7_BROWSER_BIN selects an existing Chromium; this check installs nothing.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { buildSite, composeSite, ROOT } from './build-pwa.mjs';
import { startServer } from './serve-pwa.mjs';

assert(process.env.W7_BROWSER_BIN, 'Set W7_BROWSER_BIN to an existing Chromium.');
const { chromium } = createRequire(new URL('../../m3/w6/package.json', import.meta.url))('playwright-core');
const site = await buildSite();
let server = await startServer({ port:0 });
const port = server.address().port, url = `http://127.0.0.1:${port}/`;
const browser = await chromium.launch({ executablePath:process.env.W7_BROWSER_BIN, headless:true });
const contexts = [], errors = [], measurements = [];
const shots = path.join(ROOT, '.tmp/release-shots');
await fs.mkdir(shots, { recursive:true });
async function fresh(fault = false) {
  const context = await browser.newContext({ viewport:{ width:390, height:844 } });
  contexts.push(context);
  if (fault) await context.addInitScript(() => {
    const put = IDBObjectStore.prototype.put;
    window.releaseFaults = 0;
    IDBObjectStore.prototype.put = function(value, key) {
      if (this.transaction.db.name === 'earned-today-local-local' && this.name === 'markers' && key === 'enrolled') {
        window.releaseFaults++;
        throw new DOMException('Synthetic release review postcommit fault', 'QuotaExceededError');
      }
      return put.apply(this, arguments);
    };
  });
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { if (!r.url().startsWith(url) && !r.url().startsWith('data:')) errors.push('off-origin request'); });
  await page.goto(url);
  await page.getByRole('heading', { name:'Make it yours.' }).waitFor();
  return page;
}
async function layout(page, label) {
  const result = await page.evaluate(() => {
    const phone = document.querySelector('.phone'), view = document.querySelector('#phone');
    return { viewport:innerWidth, document:document.documentElement.scrollWidth,
      view:view.clientWidth, viewScroll:view.scrollWidth, phoneTop:phone.getBoundingClientRect().top + scrollY,
      phoneHeight:phone.getBoundingClientRect().height, radius:getComputedStyle(phone).borderRadius,
      shadow:getComputedStyle(phone).boxShadow, overflow:getComputedStyle(view).overflow,
      fonts:[...view.querySelectorAll('input:not([type=checkbox]),select,textarea')].map(x => parseFloat(getComputedStyle(x).fontSize)) };
  });
  assert.equal(result.document, result.viewport, label + ': outer horizontal overflow');
  assert(result.viewScroll <= result.view, label + ': content horizontal overflow');
  assert.equal(result.radius, '0px'); assert.equal(result.shadow, 'none');
  assert.equal(result.overflow, 'visible');
  assert(result.fonts.every(size => size >= 16), label + ': small input text');
  measurements.push({ label, ...result });
}
async function reachable(page, locator) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox(), viewport = page.viewportSize();
  assert(box && box.y >= 0 && box.y + box.height <= viewport.height + 1 && box.x >= 0 && box.x + box.width <= viewport.width + 1);
  assert(await locator.evaluate(el => {
    const r = el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
  }), 'action is covered');
}
async function schedule(page) {
  await page.getByLabel('Your name', { exact:true }).fill('Synthetic release athlete');
  const day = new Date((await page.getByLabel('Routine starts').inputValue()) + 'T12:00:00').getDay();
  for (let i = 0; i < 7; i++) await page.locator(`[name="day-${i}"]`).selectOption(i === day ? 'U' : i === (day + 2) % 7 ? 'L' : 'REST');
  await page.getByRole('button', { name:'Continue', exact:true }).click();
}
async function exercise(page, id) {
  await page.getByRole('button', { name:'Add an exercise', exact:true }).click();
  await page.getByLabel('Exercise', { exact:true }).selectOption(id);
  await page.getByLabel('Sets per session', { exact:true }).fill('1');
  await page.getByLabel('Rep ceiling', { exact:true }).fill('10');
  await page.getByLabel('Load increase (lb)', { exact:true }).fill('2.5');
  await page.getByLabel('Available loads (lb)', { exact:true }).fill('20, 22.5, 25, 30, 40');
  await page.getByLabel('This is my bilateral exercise.', { exact:false }).check();
  await page.getByRole('button', { name:'Add exercise', exact:true }).click();
}
async function review(page) {
  await page.getByLabel('These entries include my complete current routine', { exact:false }).check();
  await page.getByRole('button', { name:'Review routine', exact:true }).click();
  await page.getByRole('heading', { name:'Ready to save?' }).waitFor();
}
// The built bundle's public default boot reopens the real saved setup. This is an
// observer after enrollment; no model, setup object, calendar or writer is injected.
async function observe(page) {
  await page.evaluate(async () => {
    const entry = await import(document.querySelector('script[type="module"]').src);
    window.releaseApp = await entry.boot();
  });
}
const stored = page => page.evaluate(async () => ({
  setup:(await releaseApp.hosts.initialSetup()).setup,
  deviceId:releaseApp.hosts.deviceId,
  collections:(await releaseApp.hosts.generation()).generation.collections,
}));
async function cacheStatus(page) {
  return page.evaluate(() => new Promise(resolve => {
    const worker = navigator.serviceWorker.controller;
    if (!worker) return resolve(null);
    const channel = new MessageChannel(), timer = setTimeout(() => resolve(null), 1500);
    channel.port1.onmessage = e => { clearTimeout(timer); resolve(e.data); };
    worker.postMessage({ type:'EARNED_CACHE_STATUS' }, [channel.port2]);
  }));
}
async function waitCache(page, name) {
  const end = Date.now() + 20000;
  while (Date.now() < end) {
    const status = await cacheStatus(page);
    if (status?.cache === name && status.ready) return status;
    await new Promise(r => setTimeout(r, 100));
  }
  throw new Error('No verified complete cache: ' + name);
}
try {
  const page = await fresh();
  await layout(page, 'fresh 390x844');
  await page.screenshot({ path:path.join(shots, '02-release-fresh.png'), fullPage:true });
  await page.getByRole('button', { name:'Continue', exact:true }).click();
  assert.equal(await page.locator(':focus').getAttribute('name'), 'athlete_label');
  await reachable(page, page.locator(':focus'));
  await schedule(page);
  for (const id of ['press', 'rows', 'pulldown', 'curl', 'hack', 'extension', 'ham']) await exercise(page, id);
  await review(page);
  assert.equal((await page.locator('#phone').textContent()).match(/Available loads:/g).length, 7);
  for (const viewport of [{ width:390,height:844 }, { width:320,height:568 }, { width:844,height:390 }]) {
    await page.setViewportSize(viewport);
    await layout(page, `seven-exercise review ${viewport.width}x${viewport.height}`);
    const save = page.getByRole('button', { name:'Save my routine', exact:true });
    await reachable(page, save);
    await save.focus(); assert.equal(await page.locator(':focus').textContent(), 'Save my routine');
    await page.screenshot({ path:path.join(shots, `03-review-${viewport.width}.png`) });
  }
  await page.setViewportSize({ width:390,height:844 });
  await page.getByRole('button', { name:'Save my routine', exact:true }).click();
  await page.locator('[data-slot="instruction"]').waitFor();
  assert.match(await page.locator('#today-status').textContent(), /routine is saved/);
  await reachable(page, page.locator('#today-status'));
  await observe(page);
  const initial = await stored(page);
  assert.equal(initial.setup.exercises.length, 7); assert.deepEqual(initial.collections.ops, {});
  await page.reload(); await page.locator('[data-slot="instruction"]').waitFor(); await observe(page);
  assert.deepEqual(await stored(page), initial);
  assert.equal(await page.locator('.setup').count(), 0);
  await page.getByRole('button', { name:'Start UPPER', exact:true }).click();
  await page.getByRole('button', { name:'Log set 1', exact:true }).waitFor();
  await page.getByLabel('Actual weight in pounds', { exact:true }).fill('40');
  await page.getByLabel('Actual reps', { exact:true }).fill('10');
  await page.getByRole('button', { name:'0', exact:true }).click();
  await page.setViewportSize({ width:320,height:390 });
  await layout(page, 'workout with reduced height 320x390');
  await reachable(page, page.getByLabel('Actual reps', { exact:true }));
  await reachable(page, page.getByRole('button', { name:'Log set 1', exact:true }));
  await page.screenshot({ path:path.join(shots, '04-workout-small.png') });
  await waitCache(page, site.cache);
  // A complete second build differs by a comment in its copied stylesheet. Serve
  // it on the same supported origin, then update the real worker while typing.
  const a1 = path.join(ROOT, '.tmp/release-update-a1'), dist = path.join(ROOT, '.tmp/release-update-dist');
  await fs.mkdir(a1, { recursive:true }); await fs.mkdir(dist, { recursive:true });
  for (const name of ['index.html', 'styles.css', 'app.js']) await fs.copyFile(path.join(site.today.dist, name), path.join(a1, name));
  await fs.appendFile(path.join(a1, 'styles.css'), '\n/* synthetic update control */\n');
  const update = await composeSite({ a1:{ dist:a1 } });
  assert.notEqual(update.cache, site.cache);
  for (const [name, bytes] of update.files) await fs.writeFile(path.join(dist, name), bytes);
  await new Promise(r => server.close(r)); server = await startServer({ port, dist });
  await page.evaluate(async () => { await (await navigator.serviceWorker.getRegistration()).update(); });
  await waitCache(page, update.cache);
  await page.waitForFunction(() => document.querySelector('[data-pwa="state"]').getAttribute('data-ready') === 'yes');
  // This check claims takeover/current assets, not deletion of old caches. Record
  // the cache inventory independently of the verified controller response above.
  console.log('UPDATE CACHES', await page.evaluate(async () => {
    const out = [];
    for (const name of await caches.keys()) out.push([name, (await (await caches.open(name)).keys()).length]);
    return out;
  }));
  assert.equal(await page.getByLabel('Actual weight in pounds', { exact:true }).inputValue(), '40');
  assert.equal(await page.getByLabel('Actual reps', { exact:true }).inputValue(), '10');
  await reachable(page, page.getByRole('button', { name:'Log set 1', exact:true }));
  for (let index = 0; index < 4; index++) {
    if (index) {
      await page.getByRole('button', { name:'Ready for set 1', exact:true }).click();
      await page.getByRole('button', { name:'Log set 1', exact:true }).waitFor();
      await page.getByLabel('Actual weight in pounds', { exact:true }).fill('40');
      await page.getByLabel('Actual reps', { exact:true }).fill('10');
      await page.getByRole('button', { name:'0', exact:true }).click();
    }
    await page.getByRole('button', { name:'Log set 1', exact:true }).click();
    await page.locator('[data-slot="saved-title"]').filter({ hasText:'Set 1 logged' }).waitFor();
    assert.equal(Object.values((await stored(page)).collections.ops).filter(x => x.kind === 'session-set').length, index + 1);
  }
  await reachable(page, page.getByRole('button', { name:'Finish this workout', exact:true }));
  await page.getByRole('button', { name:'Finish this workout', exact:true }).click();
  await page.locator('[data-slot="instruction"]').waitFor();
  const finished = await stored(page), ops = Object.values(finished.collections.ops);
  assert.equal(ops.filter(x => x.kind === 'session-start').length, 1);
  assert.equal(ops.filter(x => x.kind === 'session-set').length, 4);
  assert.equal(ops.filter(x => x.kind === 'session-close').length, 1);
  await page.locator('[data-slot="primary"]').click();
  await page.getByLabel('Weight in pounds').waitFor();
  await page.getByLabel('Weight in pounds').fill('170.5');
  await reachable(page, page.getByLabel('Weight in pounds'));
  await reachable(page, page.locator('[role="dialog"] button[type="submit"]'));
  await layout(page, 'weigh-in sheet 320x390');
  await page.locator('[role="dialog"] button[type="submit"]').click();
  await page.locator('[role="dialog"]').waitFor({ state:'detached' });
  await page.waitForFunction(() => /170\.5/.test(document.querySelector('[data-slot="morning"]').textContent));
  const afterWeight = await stored(page);
  await page.context().setOffline(true);
  await page.reload(); await page.locator('[data-slot="instruction"]').waitFor(); await observe(page);
  assert.equal(await page.locator('link[rel="stylesheet"]').first().getAttribute('href'), update.names.styles);
  assert.deepEqual(await stored(page), afterWeight);
  const relaunched = await page.context().newPage();
  await relaunched.goto(url); await relaunched.locator('[data-slot="instruction"]').waitFor(); await observe(relaunched);
  assert.deepEqual(await stored(relaunched), afterWeight);
  await layout(relaunched, 'offline new page 390x844');
  await relaunched.screenshot({ path:path.join(shots, '05-offline-reopened.png'), fullPage:true });
  await relaunched.close(); await page.context().setOffline(false);
  const fault = await fresh(true);
  await schedule(fault); await exercise(fault, 'press'); await exercise(fault, 'hack'); await review(fault);
  await fault.getByRole('button', { name:'Save my routine', exact:true }).click();
  await fault.locator('.setup .error').filter({ hasText:'reopened or restored' }).waitFor();
  assert.equal(await fault.evaluate(() => releaseFaults), 1);
  assert.match(await fault.locator('#today-status').textContent(), /Reopen or restore/);
  assert(await fault.getByRole('button', { name:'Save my routine', exact:true }).isDisabled());
  await reachable(fault, fault.locator('.setup .error'));
  await fault.screenshot({ path:path.join(shots, '06-postcommit-refusal.png') });
  await fault.reload(); await fault.getByRole('heading', { name:'Restore required', exact:true }).waitFor();
  assert.equal(await fault.locator('form').count(), 0);
  await reachable(fault, fault.locator('#today-status')); await layout(fault, 'restore refusal 390x844');
  assert.match(await fault.locator('#today-storage').textContent(), /Nothing can be recorded/);
  await reachable(fault, fault.locator('#today-storage'));
  await fault.screenshot({ path:path.join(shots, '07-restore.png'), fullPage:true });
  const blocked = await browser.newContext({ serviceWorkers:'block', offline:true }); contexts.push(blocked);
  const noWorker = await blocked.newPage();
  await assert.rejects(noWorker.goto(url, { timeout:8000 }), /ERR_INTERNET_DISCONNECTED/);
  assert.deepEqual(errors, []);
  await fs.writeFile(path.join(shots, 'measurements.json'), JSON.stringify(measurements, null, 2));
  console.log('RELEASE BROWSER PASS: real setup (seven exercises), 390/320/landscape layout, focus/reachability, stored setup/workout reopen, four saved sets and finish, weigh-in sheet/save at reduced height, actual worker update preserving typed input, updated assets offline reload/new page, worker-blocked control, real postcommit refusal/restore, no off-origin requests or page exceptions.');
  console.log(JSON.stringify(measurements));
} finally {
  for (const context of contexts) await context.close();
  await browser.close(); await new Promise(r => server.close(r));
}

