// OPTIONAL, PC-only: open the built Today page in a real browser and prove three things
// that a Node test cannot — the bundle executes, the durable record survives a genuine
// page reload, and no number on screen is one of the approved prototype's fictional
// figures.
//
// It installs nothing. Point W7_BROWSER_BIN at an existing Chromium/Chrome executable;
// without it the check says so and exits 0 with a clear NOT RUN line, so it can never be
// mistaken for a pass. playwright-core comes from rebuild/m3/w6's own dependencies, the
// same ones the W6 browser build uses.
//
//   node rebuild/m3/w7-preview/today/build.mjs
//   set W7_BROWSER_BIN=C:\Users\<you>\AppData\Local\ms-playwright\chromium-1234\chrome-win64\chrome.exe
//   node rebuild/m3/w7-preview/today/browser-check.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "./serve.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const executablePath = process.env.W7_BROWSER_BIN;
if (!executablePath) {
  console.log("A1 TODAY BROWSER CHECK NOT RUN — set W7_BROWSER_BIN to a Chromium executable. "
    + "This is not a pass.");
  process.exit(0);
}

const require = createRequire(path.join(here, "../../w6/package.json"));
const { chromium } = require("playwright-core");

// Figures this synthetic athlete's engine cannot produce. The rounded calorie headline
// really is 2,300 for this fixture, so that one is NOT a prototype tell; the Node view
// tests prove slot by slot where every figure came from.
const FICTIONAL = ["2,252", "2,344", "235 g", "180.9 lb", "181.3 lb", "135 lb", "About 60 min", "9 exercises"];

const server = await startServer({ port: 0 });
const url = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({ executablePath, headless: true });
let failures = 0;
const problems = [];
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on("pageerror", (error) => problems.push("pageerror: " + error.message));
  page.on("console", (message) => {
    // The page ships no icon; a favicon 404 is the browser asking, not the page failing.
    if (message.type() !== "error") return;
    const where = (message.location() && message.location().url) || "";
    if (/favicon/.test(where) || /favicon/.test(message.text())) return;
    problems.push("console: " + message.text() + " @ " + where);
  });
  page.on("requestfailed", (r) => { if (!/favicon/.test(r.url())) problems.push("requestfailed: " + r.url()); });

  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector('[data-slot="instruction"]');

  const first = await page.textContent("#phone");
  assert(!/Today could not open/.test(first), "the page mounted");
  const instruction = await page.textContent('[data-slot="instruction"]');
  const morning = await page.textContent('[data-slot="morning"]');
  assert.equal(morning.trim(), "Not logged yet", "a fresh browser profile holds no reading");

  // Log a weigh-in through the real sheet.
  await page.click('[data-slot="primary"]');
  await page.waitForSelector("#morning-weight");
  await page.fill("#morning-weight", "179.4");
  await page.click('[role="dialog"] button[type="submit"]');
  await page.waitForSelector('[data-slot="morning"]');
  const logged = (await page.textContent('[data-slot="morning"]')).trim();
  assert.equal(logged, "179.4 lb", "the weigh-in reached the screen");
  const trend = (await page.textContent('[data-slot="trend"]')).trim();
  const after = (await page.textContent('[data-slot="instruction"]')).trim();
  assert.notEqual(after, instruction.trim(), "the engine's instruction changed");

  // A REAL reload of a REAL browser.
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-slot="morning"]');
  assert.equal((await page.textContent('[data-slot="morning"]')).trim(), logged, "the reading survived the reload");
  assert.equal((await page.textContent('[data-slot="trend"]')).trim(), trend, "the trend survived the reload");

  // A genuinely new page in the same origin (the app-kill path).
  const relaunched = await context.newPage();
  await relaunched.goto(url, { waitUntil: "load" });
  await relaunched.waitForSelector('[data-slot="morning"]');
  assert.equal((await relaunched.textContent('[data-slot="morning"]')).trim(), logged, "a new page sees the same reading");

  const text = await page.textContent("#phone");
  for (const figure of FICTIONAL) assert(!text.includes(figure), "prototype figure on screen: " + figure);

  // The storage really is this page's own local record.
  const keys = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("earned.today")));
  assert(keys.length > 0, "the durable record is in this origin's local storage");
  assert(keys.some((k) => k.includes(":ops:")), "an operation is stored");

  assert.deepEqual(problems, [], "no page or console error");
  console.log(`A1 TODAY BROWSER CHECK PASS — mounted, weighed in (${logged}), survived a real reload and a new page; `
    + `${keys.length} durable local records; no prototype figure on screen`);
} catch (error) {
  failures = 1;
  console.error("A1 TODAY BROWSER CHECK FAIL — " + error.message);
  for (const problem of problems) console.error("  " + problem);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
process.exitCode = failures;
