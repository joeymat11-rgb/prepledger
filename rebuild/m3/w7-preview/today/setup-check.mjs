// OPTIONAL, PC-only: drive Dad's WHOLE first run in a real Chromium, on a PERSISTENT
// browser profile, and prove the things a Node test cannot:
//   Today with its first-run tile -> screen 1 of 6 -> the six screens tapped through
//   -> "Start using Earned" -> Today, with the tile gone and the route refused,
// across a genuine reload, a genuinely new page, and a genuine PROCESS KILL (the
// browser is closed and relaunched over the same profile directory, so the first run
// has to come back out of this device's own encrypted IndexedDB store).
//
// It also measures what only a browser can: nothing overflows horizontally at 390px
// or at 320px, every input renders at 16px or more, every tap target is at least
// 44px high, the primary action is reachable on every one of the six screens, no
// U+2013 or U+2014 is rendered anywhere, and the page requests nothing off this
// local origin.
//
// THE KILL MID-FLOW, which is the whole point of this check. The six screens hold
// their answers IN MEMORY and write ONE operation at the end (BUILD-BRIEF 2.2). So a
// kill in the middle must leave NO half-written athlete: the relaunch shows the start
// of the flow, never a partly built week, and the generation holds zero operations.
//
// It installs nothing. Point W7_BROWSER_BIN at an existing Chromium/Chrome/Edge
// executable; without it the check says so and exits 0 with a clear NOT RUN line, so
// it can never be mistaken for a pass.
//
//   node rebuild/m3/w7-preview/today/build.mjs
//   set W7_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe
//   node rebuild/m3/w7-preview/today/setup-check.mjs
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { startServer } from "./serve.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const executablePath = process.env.W7_BROWSER_BIN;
if (!executablePath) {
  console.log("A4 FIRST-RUN BROWSER CHECK NOT RUN - set W7_BROWSER_BIN to a Chromium executable. "
    + "This is not a pass.");
  process.exit(0);
}
/* The process this check kills is the one W7_BROWSER_BIN actually names (C4b review
   D3): on a machine whose Chromium is Edge, a literal "chrome.exe" would find
   nothing and the kill would prove nothing. */
const PROCESS_NAME = path.basename(executablePath);
const require = createRequire(path.join(here, "../../w6/package.json"));
const { chromium } = require("playwright-core");

const VIEWPORT = { width: 390, height: 844 };
const NARROW = { width: 320, height: 844 };
const EM = String.fromCharCode(0x2014);
const EN = String.fromCharCode(0x2013);

const profile = fs.mkdtempSync(path.join(os.tmpdir(), "a4-setup-profile-"));
const server = await startServer({ port: 0 });
const url = `http://127.0.0.1:${server.address().port}/`;
const problems = [];
const notes = [];
let kills = 0;

function watch(page) {
  page.on("pageerror", (error) => problems.push("pageerror: " + error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const where = (message.location() && message.location().url) || "";
    if (/favicon/.test(where) || /favicon/.test(message.text())) return;
    problems.push("console: " + message.text() + " @ " + where);
  });
  page.on("request", (request) => {
    if (!request.url().startsWith(url) && !request.url().startsWith("data:")) {
      problems.push("offsite request: " + request.url());
    }
  });
  return page;
}
/* Re-open after a kill, keeping `live` pointing at whatever is actually running. */
async function relaunch(query = "", viewport = VIEWPORT) {
  const opened = await launch(query, viewport);
  live = opened.context;
  return opened;
}
let live = null;
async function launch(query = "", viewport = VIEWPORT) {
  const context = await chromium.launchPersistentContext(profile, { executablePath, headless: true, viewport });
  const page = watch(context.pages()[0] || await context.newPage());
  await page.goto(url + query, { waitUntil: "load" });
  await page.waitForSelector('[data-slot="primary-label"]');
  return { context, page };
}

/* A REAL PROCESS KILL. context.close() is a graceful shutdown: the browser gets to
   flush everything it was holding, which is exactly the case that HIDES the defect
   this check exists to catch. */
function chromeProcessesForProfile() {
  const script = "Get-CimInstance Win32_Process -Filter \"Name='" + PROCESS_NAME + "'\" | "
    + "Where-Object { $_.CommandLine -like '*" + profile.replace(/'/g, "''") + "*' } | "
    + "Select-Object -ExpandProperty ProcessId";
  try {
    const out = execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script],
      { encoding: "utf8", timeout: 30000 });
    return out.split(/\r?\n/).map(line => Number(line.trim())).filter(Number.isSafeInteger).filter(pid => pid > 0);
  } catch (_) { return []; }
}
async function hardKill(context) {
  const pids = chromeProcessesForProfile();
  assert(pids.length > 0,
    "no " + PROCESS_NAME + " process was found for this profile - the kill would prove nothing");
  for (const pid of pids) {
    try { execFileSync("taskkill.exe", ["/F", "/T", "/PID", String(pid)], { stdio: "ignore", timeout: 30000 }); }
    catch (_) { /* a child may already be gone with its parent */ }
  }
  for (let tick = 0; tick < 100; tick++) {
    if (chromeProcessesForProfile().length === 0) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.equal(chromeProcessesForProfile().length, 0, "the browser survived taskkill /F /T");
  try { await context.close(); } catch (_) { /* already gone - that is the point */ }
  kills += 1;
  await new Promise(resolve => setTimeout(resolve, 250));
}

const phone = page => page.textContent("#phone").then(v => v || "");
const tap = (page, label) => page.evaluate(l => {
  const b = [...document.querySelectorAll("#phone .option")].find(x => x.textContent.trim() === l);
  if (!b) throw new Error("no chip " + l);
  b.click();
}, label);
const tapLink = (page, label) => page.evaluate(l => {
  const b = [...document.querySelectorAll("#phone button")].find(x => x.textContent.trim() === l);
  if (!b) throw new Error("no control " + l);
  b.click();
}, label);
const next = async (page) => { await page.click('#phone [data-slot="primary"]'); };
/* Today's first-run tile sits in the approved design's bottom block, which the
   phone frame scrolls; dispatch the click the way a tap does rather than asking
   playwright to scroll a sticky container into a stable position. */
const openSetup = (page) => page.evaluate(() => {
  const tile = document.querySelector('[data-go="setup"]');
  if (!tile) throw new Error("no first-run tile");
  tile.click();
});

/* Reachability, MEASURED, never asserted: the primary action must be fully visible
   once it is scrolled to, and the page must never scroll sideways. */
async function reachable(page, label) {
  const box = await page.evaluate(() => {
    const view = document.querySelector(".view");
    const cta = document.querySelector('#phone [data-slot="primary"]');
    if (!cta) return null;
    cta.scrollIntoView({ block: "end" });
    const rect = cta.getBoundingClientRect(), frame = view.getBoundingClientRect();
    return { top: Math.round(rect.top - frame.top), bottom: Math.round(rect.bottom - frame.top),
      viewport: Math.round(view.clientHeight), content: Math.round(view.scrollHeight),
      overflow: Math.round(view.scrollWidth - view.clientWidth) };
  });
  assert(box, label + ": no primary action on screen");
  assert(box.bottom <= box.viewport + 1, `${label}: the primary action is not fully visible (${box.bottom} > ${box.viewport})`);
  assert(box.top >= 0, `${label}: the primary action is cut off at the top`);
  assert(box.overflow <= 0, `${label}: the screen scrolls sideways by ${box.overflow}px`);
  notes.push(`${label}: content ${box.content}px in a ${box.viewport}px viewport, no sideways scroll`);
  return box;
}
/* C3 (review round 1): which screens were REALLY measured. The first version of
   this check called inputsAreLargeEnough on three of the six and its PASS line
   said "every screen"; the count is now derived from the calls that ran, so the
   line cannot claim coverage the run did not have. */
const measured = new Set();
async function inputsAreLargeEnough(page, label) {
  measured.add(label.replace(/,.*$/, "").trim());
  const sizes = await page.evaluate(() => [...document.querySelectorAll("#phone input, #phone select, #phone textarea")]
    .map(el => ({ id: el.id || el.tagName, size: Math.round(parseFloat(getComputedStyle(el).fontSize)) })));
  for (const entry of sizes) assert(entry.size >= 16, `${label}: ${entry.id} renders at ${entry.size}px`);
  const targets = await page.evaluate(() => [...document.querySelectorAll("#phone button")]
    .filter(el => !el.hidden && el.offsetParent !== null)
    .map(el => ({ id: el.textContent.trim().slice(0, 24), h: Math.round(el.getBoundingClientRect().height) })));
  for (const entry of targets) assert(entry.h >= 44, `${label}: tap target "${entry.id}" is ${entry.h}px high`);
  return { inputs: sizes.length, targets: targets.length };
}
/* THE OWNER'S RULE, AT RENDER TIME (S23 b, DECISIONS:114 (1)).
   SCOPED TO A4'S OWN SCREENS, deliberately. The merged A1/A2/A3 Today still
   carries "spike - damped in trend", "- not wired yet" and the en-dashed
   calorie range, and sweeping those is the PM's P1 item
   (rebuild/slice/P1-NO-DASHES-BRIEF.md), not A4's to churn (BUILD-BRIEF 6).
   What A4 owns on Today is exactly one string, the first-run tile, and
   dashOnTile() below checks that one. */
async function noDashes(page, label) {
  /* The two marks are passed in as code points, so this FILE stays free of them
     too: the rule is about the UI, and a check that had to spell them would be a
     tempting place for one to survive. */
  const hits = await page.evaluate(([em, en]) => {
    const bad = [];
    for (const node of document.querySelectorAll("#phone *")) {
      for (const value of [node.textContent, node.getAttribute("placeholder"),
        node.getAttribute("aria-label"), node.getAttribute("title")]) {
        if (value && (value.includes(em) || value.includes(en))) bad.push(value.slice(0, 60));
      }
    }
    return [...new Set(bad)];
  }, [EM, EN]);
  assert.deepEqual(hits, [], label + " renders an ai dash: " + hits.join(" | "));
}
/* The one string A4 puts on Today. */
async function dashOnTile(page) {
  const label = await page.textContent('[data-slot="setup-entry-label"]');
  assert.equal((label || "").includes(EM) || (label || "").includes(EN), false,
    "the first-run tile carries an ai dash: " + label);
}

/* The six screens, tapped through as Dad would. Stops where `stopAt` says. */
async function runFlow(page, stopAt = 6) {
  await page.waitForSelector("#phone article.page");
  assert.match(await phone(page), /Let’s set up your week\./);
  assert.match(await phone(page), /1 of 6/);
  await reachable(page, "screen 1");
  await inputsAreLargeEnough(page, "screen 1");
  await noDashes(page, "screen 1");
  await page.fill("#setup-name", "Dad");
  if (stopAt === 1) return;

  await next(page);                                    // -> 2
  await page.waitForFunction(() => document.querySelector("#phone").textContent.includes("2 of 6"));
  /* Scoped to the weekday's own block: every chosen day offers BOTH kinds, so a
     document-wide search for "Lower body" would answer the wrong day. */
  const dayKind = (day, kind) => page.evaluate(([d, k]) => {
    const block = [...document.querySelectorAll("#phone fieldset.question")]
      .find(f => f.querySelector("legend") && f.querySelector("legend").textContent.trim() === d);
    if (!block) throw new Error("no weekday block " + d);
    const b = [...block.querySelectorAll(".option")].find(x => x.textContent.trim() === k);
    if (!b) throw new Error("no control " + k + " under " + d);
    b.click();
  }, [day, kind]);
  await dayKind("Monday", "Monday"); await dayKind("Monday", "Upper body");
  await dayKind("Thursday", "Thursday"); await dayKind("Thursday", "Lower body");
  await reachable(page, "screen 2");
  await inputsAreLargeEnough(page, "screen 2");
  await noDashes(page, "screen 2");
  assert.match(await phone(page), /Earned plans two kinds of day so far: upper body and lower body\./);
  if (stopAt === 2) return;

  await next(page);                                    // -> 3
  await page.waitForFunction(() => document.querySelector("#phone").textContent.includes("3 of 6"));
  const standard = await phone(page);
  assert.match(standard, /Earned’s standard start/);
  assert.match(standard, /3 sets, aim for 10 reps\./);
  assert.equal(await page.evaluate(() =>
    [...document.querySelectorAll("#phone .option")].filter(b => b.getAttribute("aria-pressed") === "true")
      .map(b => b.textContent.trim()).join(",")), "3,10",
  "the standard start is PROPOSED and pre-selected, and nothing else is");
  assert.doesNotMatch(standard, /not sure/i, "the removed refusal is gone (DECISIONS:114 (2))");
  /* One lift under each session kind his split contains: a kind with an empty
     list is a NAMED missing answer, which is screen 6's job to say. */
  /* Each step re-queries the live DOM: every tap repaints the screen, so a node
     held across one is a node that is no longer on the page. */
  const inList = (kind, what) => page.evaluate(([k, w]) => {
    const block = [...document.querySelectorAll("#phone fieldset.question")]
      .find(f => f.querySelector("legend") && f.querySelector("legend").textContent.trim() === k);
    if (!block) throw new Error("no list for " + k);
    if (w.add) {
      const add = [...block.querySelectorAll("button.text-link")]
        .find(x => x.textContent.trim() === "Add an exercise");
      if (!add) throw new Error("no add control under " + k);
      return add.click();
    }
    const rows = [...block.querySelectorAll(".followup")];
    const row = rows[rows.length - 1];
    if (!row) throw new Error("no exercise row under " + k);
    if (w.name !== undefined) {
      const input = row.querySelector("input");
      input.value = w.name;
      return input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const chip = [...row.querySelectorAll(".option")].find(x => x.textContent.trim() === w.mg);
    if (!chip) throw new Error("no chip " + w.mg);
    return chip.click();
  }, [kind, what]);
  const addLift = async (kind, name, mg) => {
    await inList(kind, { add: true });
    await inList(kind, { name });
    await inList(kind, { mg });
  };
  /* The chip SHOWS the gloss and STORES the bare label (DECISIONS:115, S25):
     "quads (front of thigh)" is what the athlete taps, "quads" is what is
     written. The read-back on screen 6 is what proves the second half. */
  await addLift("Upper body", "Chest press", "chest");
  await addLift("Lower body", "Leg press", "quads (front of thigh)");
  await reachable(page, "screen 3");
  await inputsAreLargeEnough(page, "screen 3");
  await noDashes(page, "screen 3");
  if (stopAt === 3) return;

  await next(page);                                    // -> 4
  await page.waitForFunction(() => document.querySelector("#phone").textContent.includes("4 of 6"));
  const loads = await phone(page);
  assert.match(loads, /What the weights do\./);
  assert.match(loads, /Leave the jump blank and Earned uses 5 lb, its standard step\./);
  assert.doesNotMatch(loads, /starting (weight|load)/i, "no starting load is collected (S20)");
  await page.evaluate(() => {
    const boxes = [...document.querySelectorAll("#phone input[id^='setup-first-']")];
    boxes.forEach((box, at) => {
      box.value = String(20 + at * 25);
      box.dispatchEvent(new Event("input", { bubbles: true }));
    });
  });
  await reachable(page, "screen 4");
  await inputsAreLargeEnough(page, "screen 4");
  await noDashes(page, "screen 4");
  if (stopAt === 4) return;

  await next(page);                                    // -> 5
  await page.waitForFunction(() => document.querySelector("#phone").textContent.includes("5 of 6"));
  assert.match(await phone(page), /It does not change your sessions yet\./);
  assert.equal(await page.evaluate(() =>
    [...document.querySelectorAll("#phone .option")].filter(b => b.getAttribute("aria-pressed") === "true").length),
  0, "screen 5 starts with nothing selected");
  await tap(page, "chest");
  await reachable(page, "screen 5");
  await inputsAreLargeEnough(page, "screen 5");
  await noDashes(page, "screen 5");
  if (stopAt === 5) return;

  await next(page);                                    // -> 6
  await page.waitForFunction(() => document.querySelector("#phone").textContent.includes("6 of 6"));
  const summary = await phone(page);
  assert.match(summary, /Here’s your week\./);
  assert.match(summary, /Chest press/);
  assert.match(summary, /Monday/);
  assert.match(summary, /jump: 5 lb, Earned’s standard step/);
  assert.match(summary, /We have not put a weight on anything\./);
  assert.doesNotMatch(summary, /Earned can’t build your week yet/, "nothing is missing");
  await reachable(page, "screen 6");
  await inputsAreLargeEnough(page, "screen 6");
  await noDashes(page, "screen 6");
}

const opsInStore = (page) => page.evaluate(async () => {
  const mod = await import(new URL("app.js", location.href).href);
  const booted = await mod.boot({ document });
  const rows = booted.setup ? await booted.setup.host.all() : [];
  const out = { rows: rows.length, enrolled: booted.setup ? !booted.setup.firstRun() : null,
    label: rows.length ? rows[0].setup.athlete_label : null };
  booted.hosts.close();
  return out;
});

/* `live` (declared above) is the context that is actually running, held outside
   the try so a THROWN check still shuts its browser down: a failed run that
   stranded a persistent context left dozens of msedge processes behind and made
   the next run's kill count meaningless. */
let failures = 0;
try {
  /* ---------- launch 1: Today offers the first run, and the flow is reachable ---------- */
  let { context, page } = await launch();
  live = context;
  assert.equal(await page.evaluate(() =>
    document.querySelector('[data-slot="setup-entry"]').hidden), false,
  "a fresh installation is offered its first run");
  assert.equal(await page.textContent('[data-slot="setup-entry-label"]'), "Set up your week");
  await dashOnTile(page);
  await openSetup(page);

  /* ---------- the KILL MID-FLOW: no half-written athlete ---------- */
  await runFlow(page, 4);
  notes.push("four screens answered, then the browser is killed");
  await hardKill(context);
  ({ context, page } = await relaunch("?screen=setup"));
  const afterKill = await phone(page);
  assert.match(afterKill, /1 of 6/, "the relaunch shows the START of the flow, never a half-built week");
  assert.doesNotMatch(afterKill, /Chest press/, "nothing he typed mid-flow was written anywhere");
  const empty = await opsInStore(page);
  assert.equal(empty.rows, 0, "the generation holds NO first-run operation: " + JSON.stringify(empty));
  assert.equal(empty.enrolled, false);
  notes.push("a real taskkill mid-flow left zero operations and no partial athlete");

  /* ---------- the whole flow, then the ONE write ----------
     Back to the plain URL: this launch came up on ?screen=setup, and a reload
     would keep that query rather than landing on Today. */
  await page.goto(url, { waitUntil: "load" });
  await page.waitForSelector('[data-slot="primary-label"]');
  await openSetup(page);
  await runFlow(page, 6);
  await next(page);
  await page.waitForFunction(() => !!document.querySelector('#phone [data-slot="recovery-state"]'));
  notes.push("the six screens finished and the page landed on Today");

  /* C1 (review round 1). The Today he LANDS ON says, in his own words, that his
     week is recorded and the figures on this screen are still the preview's
     sample athlete. Without it the man who has just typed his real week is shown
     a stranger's weight trend in silence, which is S19's named silent failure. */
  const landing = await phone(page);
  assert.match(landing, /Your week is saved on this device\./);
  assert.match(landing, /still the preview’s sample athlete/);
  assert.equal(await page.evaluate(() =>
    document.querySelector('[data-slot="setup-note"]').hidden), false,
  "the first-run note is rendered on the Today the flow lands on");
  notes.push("the landing Today says the figures on it are not his yet");

  /* ---------- the tile is gone, and the route refuses ---------- */
  assert.equal(await page.evaluate(() =>
    document.querySelector('[data-slot="setup-entry"]').hidden), true,
  "a device that has been set up is never invited to be set up again");

  const recorded = await opsInStore(page);
  assert.equal(recorded.rows, 1, "ONE operation for six screens: " + JSON.stringify(recorded));
  assert.equal(recorded.label, "Dad");

  /* ---------- the reload ---------- */
  await page.reload({ waitUntil: "load" });
  await page.waitForSelector('[data-slot="primary-label"]');
  assert.equal(await page.evaluate(() => document.querySelector('[data-slot="setup-entry"]').hidden), true);
  assert.equal((await opsInStore(page)).rows, 1, "the reload wrote nothing");

  /* ---------- a genuinely new page, and the URL that names the setup screen ---------- */
  const second = watch(await context.newPage());
  await second.goto(url + "?screen=setup", { waitUntil: "load" });
  await second.waitForSelector('[data-slot="primary-label"]');
  assert.doesNotMatch(await phone(second), /1 of 6/,
    "?screen=setup on a device that is already set up lands on Today, not on a second enrolment");
  await second.close();

  /* ---------- THE PROCESS KILL, after the write ---------- */
  await hardKill(context);
  ({ context, page } = await relaunch());
  const afterSecondKill = await opsInStore(page);
  assert.equal(afterSecondKill.rows, 1, "the first run did not survive a real process kill");
  assert.equal(afterSecondKill.label, "Dad");
  assert.equal(await page.evaluate(() => document.querySelector('[data-slot="setup-entry"]').hidden), true);
  notes.push("survived a real taskkill /F /T with exactly one operation");

  /* ---------- 320px: the narrow phone ---------- */
  await hardKill(context);
  ({ context, page } = await relaunch("", NARROW));
  const narrow = await page.evaluate(() => {
    const view = document.querySelector(".view");
    return Math.round(view.scrollWidth - view.clientWidth);
  });
  assert(narrow <= 0, "Today scrolls sideways by " + narrow + "px at 320px");
  notes.push("no horizontal overflow at 320px either");
  await hardKill(context);
} catch (error) {
  failures += 1;
  problems.push(error && error.message ? error.message : String(error));
} finally {
  try { if (live) await live.close(); } catch (_) { /* already killed, which is the point */ }
  await new Promise(resolve => server.close(resolve));
  try { fs.rmSync(profile, { recursive: true, force: true }); } catch (_) {}
}

if (problems.length || failures) {
  console.error("A4 FIRST-RUN BROWSER CHECK FAIL:\n  " + problems.join("\n  "));
  process.exitCode = 1;
} else {
  console.log("A4 FIRST-RUN BROWSER CHECK PASS - Today's first-run tile -> six screens tapped "
    + "through -> a REAL KILL MID-FLOW leaving zero operations and no partial athlete -> the "
    + "flow again -> ONE operation written -> Today with the tile gone and ?screen=setup "
    + `refused -> reload -> new page -> ${kills} REAL PROCESS KILLS (taskkill /F /T, each `
    + "verified dead); no off-origin request, no horizontal overflow at 390px or 320px, "
    + `every input >= 16px and every tap target >= 44px MEASURED ON ${measured.size} OF THE SIX `
    + "SCREENS, the primary action reachable on every screen, and no U+2013 or U+2014 "
    + "rendered anywhere on them.\n  " + notes.join("\n  "));
}
