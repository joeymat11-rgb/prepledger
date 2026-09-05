"use strict";
// Optional desktop boundary check. Install Playwright outside the frozen app;
// CLOCK_PLAYWRIGHT_MODULE may point to an existing installation. No iOS verdict.
const { chromium } = require(process.env.CLOCK_PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path");
const http = require("node:http"), os = require("node:os");
const root = path.resolve(__dirname, ".."), profile = fs.mkdtempSync(path.join(os.tmpdir(), "earned-w3-browser-"));
const allowed = new Set(["index.html", "app.mjs", "store.mjs", "styles.css", "manifest.webmanifest",
  "service-worker.js", "icon.svg", "icon-180.png", "icon-192.png", "icon-512.png"]);
const mime = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript",
  ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
let requests = 0, context;
const server = http.createServer((req, res) => {
  requests++;
  const name = new URL(req.url, "http://localhost").pathname.slice(1) || "index.html";
  if (!allowed.has(name) || !fs.existsSync(path.join(root, name))) { res.writeHead(404); res.end(); return; }
  res.setHeader("Content-Type", mime[path.extname(name)] || "application/octet-stream");
  res.end(fs.readFileSync(path.join(root, name)));
});
async function launch() {
  const c = await chromium.launchPersistentContext(profile, { channel: "chrome", headless: true,
    viewport: { width: 402, height: 874 }, serviceWorkers: "allow" });
  // Only emulate the display-mode detection. This is not Safari or A2HS evidence.
  await c.addInitScript(() => Object.defineProperty(navigator, "standalone", { get: () => true }));
  return c;
}
(async () => {
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${server.address().port}/index.html`;
  context = await launch(); let page = await context.newPage();
  const external = [];
  context.on("request", req => { if (!req.url().startsWith(new URL(url).origin)) external.push(req.url()); });
  await page.goto(url);
  await page.locator("#setup").waitFor({ state: "visible" });
  await page.locator("#setup summary").click(); await page.locator("#confirm").check();
  await page.locator("#initialize").click();
  await page.waitForFunction(() => document.querySelector("#counter").textContent === "1");
  const initial = JSON.parse(await page.locator("#receipt").inputValue());
  assert.equal(initial.diagnosticState, 20); assert.equal(initial.leasePermission, false);
  await page.locator("#capture").click();
  await page.waitForFunction(() => document.querySelector("#counter").textContent === "2");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.equal(await page.locator("#label").evaluate(el => getComputedStyle(el).fontSize), "16px");
  console.log("PASS browser: explicit initialize, real IndexedDB commit/readback, counter2, narrow layout,16px controls");
  await context.close(); context = await launch(); await context.setOffline(true);
  page = await context.newPage(); const beforeOffline = requests;
  await page.goto(url);
  await page.waitForFunction(() => document.querySelector("#counter").textContent === "3");
  const reopened = JSON.parse(await page.locator("#receipt").inputValue());
  assert.equal(reopened.run.runId, initial.run.runId);
  assert.deepEqual(reopened.run.observations[0], initial.run.observations[0]);
  assert.equal(reopened.run.counter, 3); assert.equal(requests, beforeOffline);
  assert.equal(reopened.leasePermission, false);
  console.log("PASS browser: closed/reopened Chromium, offline shell, original baseline retained, counter3; zero server requests offline");
  // Corrupt only this synthetic local browser profile, never any athlete store.
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      const request = indexedDB.open("earned-clock-diagnostic-v1", 1);
      request.onerror = reject;
      request.onsuccess = () => {
        const db = request.result, tx = db.transaction("diagnostic", "readwrite"), store = tx.objectStore("diagnostic");
        const read = store.get("run"); read.onsuccess = () => { const value = read.result; value.counter += 100; store.put(value, "run"); };
        tx.oncomplete = () => { db.close(); resolve(); }; tx.onabort = reject;
      };
    });
  });
  await page.locator("#capture").click();
  await page.waitForFunction(() => document.querySelector("#status").textContent.includes("STATE 18"));
  assert.equal(await page.locator("#result").isHidden(), true);
  await page.reload(); await page.waitForFunction(() => document.querySelector("#status").textContent.includes("STATE 18"));
  assert.equal(await page.locator("#setup").isHidden(), true);
  assert.equal(await page.locator("#result").isHidden(), true);
  assert.deepEqual(external, []);
  console.log("PASS browser: mid-session tamper and reopen refuse state18; no silent initialization, no external app requests");
  console.log("PROBE-BROWSER PASS (desktop Chromium only; installed iPhone/Safari NOT RUN)");
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  if (context) await context.close(); server.close();
  // Preserve the isolated synthetic profile for local inspection; do not delete.
});
