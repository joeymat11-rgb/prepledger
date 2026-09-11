// local-witnesses.mjs — C3's PROOF HARNESS: kill / reboot / restart, executed in
// a real browser against the five unchanged-core witnesses (SCORECARD-W3) and the
// slice's own restart requirements (PLAN-SLICE-v1 §DONE.2).
//
// WHY THIS IS NOT local-browser.mjs. That runner ends a context with
// `context.close()` — a GRACEFUL shutdown, which lets Chromium flush and close
// IndexedDB in an orderly way. A phone never does that: iOS discards the web
// view. Every kill here is `taskkill /F` on the real OS process: no
// beforeunload, no unload handler, no orderly IndexedDB shutdown. It is still
// NOT a power cut — see W-POWER-LOSS below, which says so rather than implying
// coverage.
//
// Every row prints PASS / FAIL / NOT-PROVABLE-HERE with one line of evidence.
// NOT-PROVABLE-HERE is a first-class outcome, not a skip: it is how this file
// says "no desktop browser can decide this". C3-BRIEF.md carries the same rows
// with the reason, and C3-HAND-PROOF.md carries the ones only the phone can do.
//
// Exit 0 = every provable row passed. Exit 1 = a provable row failed.
// Exit 2 = BLOCKED (no pinned playwright-core, or no W6_BROWSER_BIN).
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { buildLocalBrowser } from "../local/build.mjs";
import { startModuleServer } from "./static-modules.mjs";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WIN = process.platform === "win32";

let chromium;
try { ({ chromium } = require(process.env.W6_PLAYWRIGHT_DIR || "playwright-core")); }
catch { console.log("W6 LOCAL-WITNESSES BLOCKED — pinned playwright-core unavailable"); process.exit(2); }
const executablePath = process.env.W6_BROWSER_BIN;
if (!executablePath || !fs.existsSync(executablePath)) {
  console.log("W6 LOCAL-WITNESSES BLOCKED — set W6_BROWSER_BIN to an installed Chromium/Edge executable");
  process.exit(2);
}
const exeName = path.basename(executablePath);

// A hard-killed Chromium leaves lock files behind and one row copies a whole
// profile directory, so profiles live under the OS temp tree, never in the repo.
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "w6-witness-"));
const bundle = path.join(scratch, "local.js");
const built = await buildLocalBrowser({ outfile: bundle });
const INDEX = "<!doctype html><meta charset=\"utf-8\"><title>W6 local-era restart witnesses</title><main id=\"root\"></main>";

// ── --bite : the NEGATIVE CONTROL for W-KILL-AFTER-ACK (review D1) ────────────
//
// A row that says "an acknowledged save survives a kill" is worthless unless it
// can tell that claim apart from "the app said Saved before it saved". So the
// bite builds the page from an ACK-EARLY bundle — the bridge resolves execute()
// without awaiting repository.commit — and requires the row to go RED.
//
// The mutation is applied to the BUILT BUNDLE under %TEMP%, never to the tree.
// esbuild emits bridge.mjs verbatim, so the anchor below is the source line; the
// count is asserted, so a refactor that moves it BLOCKS the bite instead of
// silently passing. The candidate bridge.mjs is hashed before and after to prove
// it was never opened for writing.
const BITE = process.argv.includes("--bite");
const BRIDGE = path.join(root, "bridge.mjs");
const sha256 = value => createHash("sha256").update(value).digest("hex");
const ANCHOR = "const commit = await repository.commit(snapshot, candidate.generation, () => validateCommit(context));";
const ACK_EARLY = "const commit = { revision: snapshot.revision + 1, durability: { requested: \"strict\", actual: \"strict\" } };" +
  " repository.commit(snapshot, candidate.generation, () => validateCommit(context)).catch(() => {});";
const bridgeBefore = sha256(fs.readFileSync(BRIDGE));
let source = fs.readFileSync(bundle, "utf8"), biteBlocked = null;
if (BITE) {
  const hits = source.split(ANCHOR).length - 1;
  if (hits !== 1) biteBlocked = `the ack-ordering anchor appears ${hits} times in the built bundle, not once`;
  else source = source.replace(ANCHOR, ACK_EARLY);
}
const site = await startModuleServer({ root, files: { "/local.js": source }, index: INDEX });
const origin = site.origin;
const DB = "earned-local-witness";
const SETUP = { databaseName: DB, namespace: "joe/phone-A", athleteId: "ath-1", deviceId: "dev-phone-A" };

// Killing a browser under Playwright makes its own in-flight promises reject.
// Those rejections are noise from the kill, not evidence, so they are counted
// and reported rather than allowed to end the process mid-matrix.
const noise = [];
process.on("unhandledRejection", reason => noise.push(String(reason?.message || reason).split("\n")[0]));

const rows = [];
const record = (id, verdict, evidence) => { if (!rows.some(row => row.id === id)) rows.push({ id, verdict, evidence }); };
// A command is one operation unless it reports op_ids (logSession is three).
const opCount = result => (Array.isArray(result?.op_ids) ? result.op_ids.length : 1);
// Requests are attributed to the frame that made them: Edge's own new-tab page
// lives in this browser too, and counting its traffic against the app would be a
// lie in the app's favour as often as against it.
const foreign = [], chrome = [];
let contexts = 0, version = "unknown";
const live = new Set();
const profile = name => { const dir = path.join(scratch, name); fs.mkdirSync(dir, { recursive: true }); return dir; };

// One browser context on a persistent profile, with the page's clock driven by a
// mutable day offset so the lease rows can move time without relaunching.
async function launch(dir, dayOffset = 0, afterGoto = null) {
  const context = await chromium.launchPersistentContext(dir, { executablePath, headless: true });
  live.add(context); contexts++;
  if (version === "unknown") { try { version = context.browser().version(); } catch {} }
  await context.route("**/*", async route => {
    try {
      const url = route.request().url();
      if (!/^https?:/.test(url) || new URL(url).origin === origin) await route.continue();
      else {
        let from = ""; try { from = route.request().frame()?.url() || ""; } catch {}
        (from.startsWith(origin) ? foreign : chrome).push(`${url} (from ${from || "browser chrome"})`);
        await route.abort();
      }
    } catch {}
  });
  const page = await context.newPage();
  await page.goto(origin);
  // Anything that must be in place BEFORE the origin's first IndexedDB use — the
  // quota row's cap, for one: Chromium settles a storage key's quota on first use.
  if (afterGoto) await afterGoto({ context, page });
  await page.evaluate(async ({ setup, offset }) => {
    const { openLocalDurableClient } = await import("/local.js");
    window.__off = offset;
    const at = () => new Date(Date.now() + window.__off * 86400000).toISOString();
    window.__open = () => openLocalDurableClient({ ...setup,
      clock: { now: at, today: () => at().slice(0, 10), tz: "+00:00", monotonicMs: () => performance.now() } });
    window.client = await window.__open();
  }, { setup: SETUP, offset: dayOffset });
  return { context, page };
}

async function shut(session) {
  if (!session?.context) return;
  live.delete(session.context);
  try { await session.context.close(); } catch {}
}

// The OS process table, filtered to browser processes whose command line names
// this profile directory. Playwright exposes no pid for a persistent context, and
// asking the OS is the honest way to find the process we are about to kill.
function processTable() {
  if (WIN) {
    const json = execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command",
      `Get-CimInstance Win32_Process -Filter "Name='${exeName}'" | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress`],
      { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }).trim();
    if (!json) return [];
    const parsed = JSON.parse(json);
    return (Array.isArray(parsed) ? parsed : [parsed]).map(e => ({ pid: e.ProcessId, cmd: e.CommandLine || "" }));
  }
  return execFileSync("ps", ["-eo", "pid=,args="], { encoding: "utf8" }).split("\n")
    .map(line => line.trim()).filter(Boolean)
    .map(line => ({ pid: Number(line.slice(0, line.indexOf(" "))), cmd: line.slice(line.indexOf(" ") + 1) }))
    .filter(entry => entry.cmd.includes(exeName));
}
const norm = value => value.replaceAll("/", "\\").toLowerCase();
const pidsFor = dir => processTable().filter(entry => norm(entry.cmd).includes(norm(dir))).map(entry => entry.pid);

// SIGKILL, not a close. No beforeunload, no unload handler, no orderly IndexedDB
// shutdown — the closest a desktop gets to iOS discarding a web view.
//
// REVIEW D1. The kill is split in two because LATENCY IS THE WHOLE POINT of
// W-KILL-AFTER-ACK. `pidsFor()` spawns PowerShell and costs ~355 ms measured, and
// `taskkill` is another ~97 ms per spawn: a kill that begins with a process-table
// lookup lands about half a second after the event it is supposed to interrupt,
// by which time any transaction has finished. So a row that cares about the
// instant resolves its pid list FIRST and then calls `killPids`, which is
// `process.kill` — TerminateProcess through libuv, an in-process syscall with no
// spawn at all. `sweep()` is the slower belt-and-braces pass for anything the
// first pass orphaned, and `settle()` runs it if the profile is still held.
function killPids(pids) {
  for (const pid of pids) { try { process.kill(pid, "SIGKILL"); } catch {} }
  return pids;
}
function sweep(pids) {
  if (!WIN) return killPids(pids);
  for (const pid of pids) { try { execFileSync("taskkill", ["/F", "/T", "/PID", String(pid)], { stdio: "ignore" }); } catch {} }
  return pids;
}
function hardKill(session, dir) {
  const pids = pidsFor(dir);
  killPids(pids); sweep(pids);
  if (session?.context) live.delete(session.context);
  return pids;
}
async function settle(dir, ms = 10000) {
  const until = Date.now() + ms, sweepAt = Date.now() + ms * 0.3;
  let swept = false;
  while (Date.now() < until) {
    const alive = pidsFor(dir);
    if (!alive.length) return true;
    if (!swept && Date.now() > sweepAt) { sweep(alive); swept = true; }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return pidsFor(dir).length === 0;
}
const act = async (ids, body) => {
  try { await body(); }
  catch (error) {
    // A failed row has to say what it saw, not just that it failed: an assertion
    // prints actual vs expected and the line it fired on.
    const where = String(error?.stack || "").split("\n").find(line => line.includes("local-witnesses.mjs")) || "";
    const detail = error?.code === "ERR_ASSERTION" && error.generatedMessage
      ? `actual ${JSON.stringify(error.actual)} !== expected ${JSON.stringify(error.expected)}`
      : String(error?.message || error).split("\n")[0];
    for (const id of ids) record(id, "FAIL", `${detail.slice(0, 240)}${where ? "  @" + where.trim().slice(-60) : ""}`);
  }
};

// The negative control — and, as it turned out, the MEASUREMENT that decided what
// W-KILL-AFTER-ACK is allowed to claim.
//
// All five attempts always run: the point is the RATE, not a first success. Four
// recorded runs went 1/5, 0/5, 0/5 and 2/5 — THREE REDS IN TWENTY, about 15 %.
// A control that fires one attempt in seven is not a control, so this is not FAIL when
// nothing goes red — it is NOT-PROVABLE-HERE, the same first-class outcome the
// rest of this file uses, and the standing consequence is written into the row:
// W-KILL-AFTER-ACK is WITNESS-ONLY, and local-bite.cjs's durability-gate bite is
// what proves the ordering.
async function runBite() {
  if (biteBlocked) { record("BITE-KILL-AFTER-ACK", "FAIL", `bite BLOCKED — ${biteBlocked}`); return; }
  console.log(`W6 WITNESS BITE — ack-early bundle; candidate bridge.mjs sha256 BEFORE ${bridgeBefore}`);
  let red = 0, attempts = 0, lastGap = null, log = [];
  for (let attempt = 1; attempt <= 5; attempt++) {
    const dir = profile(`bite-${attempt}`);
    attempts = attempt;
    let s = await launch(dir);
    assert.equal((await s.page.evaluate(() => client.enroll({ profile: "host-clean-init" }))).enrolled, true);
    const armed = pidsFor(dir);                       // pre-warmed: no lookup in the path
    const acked = await s.page.evaluate(() => client.execute("weighIn", { lb: 170.6 }));
    const resolved = Date.now();
    killPids(armed);
    lastGap = Date.now() - resolved;
    live.delete(s.context);
    assert.equal(await settle(dir), true);
    s = await launch(dir);
    const after = await s.page.evaluate(() => client.boot());
    const held = acked.acknowledged === true && after.revision === acked.durableRevision && after.ops === 1;
    if (!held) red++;
    log.push(`attempt ${attempt}: ack rev ${acked.durableRevision}, kill +${lastGap} ms, relaunch rev ${after.revision} ops ${after.ops} -> ${held ? "survived" : "RED"}`);
    console.log(`  ${log[log.length - 1]}`);
    await shut(s);
  }
  const bridgeAfter = sha256(fs.readFileSync(BRIDGE));
  console.log(`W6 WITNESS BITE — candidate bridge.mjs sha256 AFTER  ${bridgeAfter}`);
  assert.equal(bridgeAfter, bridgeBefore, "the candidate bridge.mjs changed during the bite");
  record("BITE-KILL-AFTER-ACK", red ? "PASS" : "NOT-PROVABLE-HERE",
    `${red} of ${attempts} attempts went RED against an ack-early bundle at a ~${lastGap} ms kill. ` +
    (red
      ? `When it fires, the killed profile comes back WITHOUT the operation the app had already called Saved, so the row CAN discriminate ack-before-durable — but only some of the time, because the ack-early commit usually still finishes inside that millisecond. `
      : `Every ack-early commit finished before the process died, so this run could not discriminate ack-before-durable at all. `) +
    `MEASURED ACROSS THE RECORDED RUNS: 3 reds in 20 attempts, about 15%. A control that fires one attempt in seven is not a control, so W-KILL-AFTER-ACK is WITNESS-ONLY — it witnesses that an acknowledged save is on disk after a hard kill, and it does NOT prove the publish-after-commit ordering. That ordering is proved deterministically by local-bite.cjs's durability-gate bite, which removes the gate and watches C1's own case go red. ` +
    (log.join(" | ")));
  // The in-flight row asserts ATOMICITY, which ack-early does not break, so it is
  // expected to stay green here. Running it anyway is how that is a measurement.
  const dir = profile("bite-inflight");
  let s = await launch(dir);
  assert.equal((await s.page.evaluate(() => client.enroll({ profile: "host-clean-init" }))).enrolled, true);
  const armed = pidsFor(dir);
  await s.page.evaluate(() => { window.__pending = client.execute("weighIn", { lb: 171.9 }); return true; });
  killPids(armed); live.delete(s.context);
  assert.equal(await settle(dir), true);
  s = await launch(dir);
  const torn = await s.page.evaluate(() => client.boot());
  const atomic = torn.ready && (torn.ops === 0 || torn.ops === 1) && (torn.ops === 1) === (torn.revision === 2);
  record("BITE-KILL-INFLIGHT", atomic ? "PASS" : "FAIL", atomic
    ? `ack-early bundle, killed in flight: ops ${torn.ops} revision ${torn.revision} — still atomic-or-absent, as EXPECTED. This row asserts atomicity, not ordering, so it does not and cannot discriminate ack-before-durable; that is W-KILL-AFTER-ACK's job and the bite above is its control`
    : `ack-early bundle, killed in flight: ops ${torn.ops} revision ${torn.revision} — NOT atomic-or-absent`);
  await shut(s);
}

try {
  if (BITE) await runBite();
  else {
  // ── ACT A — the kill rows, on one profile ────────────────────────────────────
  const pA = profile("kill");
  await act(["W-KILL-IDLE", "W-REBOOT-PROCESS", "W-CONTINUITY-FLAG", "W-KILL-AFTER-ACK", "W-KILL-INFLIGHT"], async () => {
    let s = await launch(pA);
    const before = pidsFor(pA);
    assert.equal((await s.page.evaluate(() => client.enroll({ profile: "host-clean-init" }))).enrolled, true);
    const weigh = await s.page.evaluate(() => client.execute("weighIn", { lb: 170.6 }));
    assert.equal(weigh.acknowledged, true);
    const set = await s.page.evaluate(() => client.execute("logSet", { lift: "squat", load: 200, reps: 5 }));
    assert.equal(set.acknowledged, true);
    assert.equal(set.durableRevision, 3);
    const seeded = opCount(weigh) + opCount(set);

    const killed = hardKill(s, pA);
    assert.ok(killed.length > 0, "no browser process matched the profile directory");
    assert.equal(await settle(pA), true, "a browser process survived taskkill /F");
    s = await launch(pA);
    const after = pidsFor(pA);
    const booted = await s.page.evaluate(() => client.boot());
    assert.equal(booted.ready, true);
    assert.equal(booted.revision, 3);
    assert.equal(booted.ops, seeded);
    assert.deepEqual(booted.view.layer1.reads.map(read => read.lb), [170.6]);
    const resumed = await s.page.evaluate(() => client.resumeAfterKill());
    assert.equal(resumed.ghost, false);
    assert.match(resumed.line, /squat/);
    record("W-KILL-IDLE", "PASS", `${killed.length} process(es) taskkill /F while idle; relaunch on the same profile: revision ${booted.revision}, ${booted.ops} operations, resume "${resumed.line}", ghost false; durability ${JSON.stringify(weigh.durability)}`);
    record("W-REBOOT-PROCESS", "PASS", `pids ${before.join(",")} -> ${after.join(",")} on one profile directory: not one process survived, every operation did — a reboot's NEW-PROCESS half, not its power-cycle half`);
    // REVIEW D2. This row used to PRINT the key list and assert nothing, so a
    // boot() that grew `continuityFlag` printed it inside the sentence denying it
    // existed — and passed. Both key sets are now EXACT: boot()'s payload, and the
    // raw sealed record, so a continuity field cannot be added to the payload or
    // parked beside the ciphertext. What is INSIDE the ciphertext is asserted by
    // local-witnesses.test.mjs (it decrypts through the repository); the browser
    // has no device key to read it with, and this row says so rather than implying
    // it checked.
    assert.deepEqual(Object.keys(booted).sort(), ["derived", "derivedCode", "derivedStale", "eraId", "leaseExpired",
      "leaseId", "leaseRenewalCode", "leaseRenewedUntil", "notAfter", "notBefore", "ops", "ready", "revision", "view"]);
    const sealed = await s.page.evaluate(db => new Promise((resolve, reject) => {
      const request = indexedDB.open(db);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const handle = request.result, tx = handle.transaction("generations", "readonly");
        const read = tx.objectStore("generations").get("active");
        tx.oncomplete = () => { handle.close(); resolve(Object.keys(read.result).sort()); };
        tx.onabort = () => { handle.close(); reject(tx.error); };
      };
    }), DB);
    assert.deepEqual(sealed, ["ciphertext", "format", "iv", "namespace", "revision"]);
    record("W-CONTINUITY-FLAG", "PASS", `RED WITNESS 2 REPRODUCED — boot() reports EXACTLY [${Object.keys(booted).sort().join(" ")}] and the sealed record EXACTLY [${sealed.join(" ")}], both asserted: no continuity flag, boot identity or wall high-water exists anywhere the browser can see, so the restart is invisible to the client and there is nothing for it to ignore or trust. The sealed METADATA's own key set is asserted by the node case, which has the device key`);

    // Killed the instant execute() resolved Saved. REVIEW D1: the pid list is
    // resolved BEFORE the save, so the kill is one in-process TerminateProcess
    // rather than a ~355 ms process-table lookup followed by a ~97 ms spawn. Run
    // `--bite` for the negative control that decides what this row can tell apart.
    const armed = pidsFor(pA);
    const acked = await s.page.evaluate(() => client.execute("weighIn", { lb: 171.1 }));
    const resolvedAt = Date.now();
    killPids(armed);
    const gap = Date.now() - resolvedAt;
    live.delete(s.context);
    assert.equal(acked.acknowledged, true);
    assert.equal(await settle(pA), true);
    s = await launch(pA);
    const survived = await s.page.evaluate(() => client.boot());
    assert.equal(survived.revision, acked.durableRevision);
    assert.equal(survived.ops, seeded + opCount(acked));
    record("W-KILL-AFTER-ACK", "PASS", `WITNESS-ONLY. "Saved" at revision ${acked.durableRevision}, then SIGKILL ${gap} ms later (pid list pre-warmed; process.kill, no spawn, no graceful close): the relaunched profile reads revision ${survived.revision} with ${survived.ops} operations — an acknowledged save is on disk after a hard kill. It does NOT prove publish-after-commit ORDERING: --bite measured 3 reds in 20 attempts (~15%) against an ack-early bundle, because the commit usually finishes inside the millisecond. The ordering is proved by local-bite.cjs's durability-gate bite`);

    // Killed with a commit IN FLIGHT: the promise is never awaited on this side.
    // C1 exposes no slow-transaction hook, so the landing side is not chosen. What
    // is asserted is the property that must hold either way: ATOMIC OR ABSENT.
    // REVIEW D3: the landing side is a sample, not a schedule. With the review's
    // ~450 ms kill it COMMITTED in 4 of 4 observed runs; with the pre-warmed 1-2 ms
    // kill the ABSENT side became reachable. The row reports which side it landed
    // on AND which side it therefore did not observe.
    const baseOps = survived.ops, baseRev = survived.revision;
    const loaded = pidsFor(pA);
    await s.page.evaluate(() => { window.__pending = client.execute("weighIn", { lb: 171.9 }); return true; });
    killPids(loaded); live.delete(s.context);
    assert.equal(await settle(pA), true);
    s = await launch(pA);
    const torn = await s.page.evaluate(() => client.boot());
    assert.equal(torn.ready, true);
    assert.ok(torn.ops === baseOps || torn.ops === baseOps + 1, `ops ${torn.ops} is neither ${baseOps} nor ${baseOps + 1}`);
    assert.equal(torn.ops === baseOps + 1, torn.revision === baseRev + 1, "ops and revision disagree after the kill");
    const next = await s.page.evaluate(() => client.execute("weighIn", { lb: 172 }));
    assert.equal(next.acknowledged, true);
    assert.equal(next.op_id, `op-dev-phone-A-${torn.ops + 1}`);
    const landed = torn.ops === baseOps + 1;
    record("W-KILL-INFLIGHT", "PASS", `killed with a commit in flight: the batch ${landed ? "COMMITTED" : "did NOT commit"} (ops ${baseOps} -> ${torn.ops}, revision ${baseRev} -> ${torn.revision}) — atomic or absent, never half, and the next save takes ${next.op_id} with no gap. WHAT IT SHOWS: op count and revision move together, and no sequence is stranded. WHAT IT DOES NOT: the ${landed ? "ABSENT" : "COMMITTED"} side has not been observed on this platform, the landing side is not chosen by the harness, ordering is not tested here (that is W-KILL-AFTER-ACK and --bite), and power-loss durability is not tested at all (W-POWER-LOSS)`);
    await shut(s);
  });

  // ── ACT B — the clock rows: a day's gap, renewal, past the cliff ─────────────
  const pB = profile("clock");
  await act(["W-DAY-GAP", "W-RENEW-200", "W-PAST-CLIFF"], async () => {
    let s = await launch(pB);
    const era = await s.page.evaluate(() => client.enroll({ profile: "host-clean-init" }));
    assert.equal(era.enrolled, true);
    assert.equal((await s.page.evaluate(() => client.execute("weighIn", { lb: 170.6 }))).acknowledged, true);
    hardKill(s, pB); assert.equal(await settle(pB), true);

    s = await launch(pB, 1);
    const tomorrow = await s.page.evaluate(() => client.boot());
    assert.equal(tomorrow.ready, true);
    assert.equal(tomorrow.revision, 2);
    assert.deepEqual(tomorrow.view.layer1.reads.map(read => read.lb), [170.6]);
    const second = await s.page.evaluate(() => client.execute("weighIn", { lb: 170.4 }));
    assert.equal(second.op_id, "op-dev-phone-A-2");
    record("W-DAY-GAP", "PASS", `killed on day 0 and reopened with the page clock on day 1: revision 2 and the 170.6 read intact, the next save takes ${second.op_id} — a day's gap changes nothing`);
    await shut(s);

    s = await launch(pB, 201);
    const renewed = await s.page.evaluate(() => client.boot());
    assert.equal(renewed.ready, true);
    assert.equal(renewed.leaseRenewalCode, null);
    assert.ok(Date.parse(renewed.leaseRenewedUntil) > Date.parse(era.notAfter));
    assert.equal(renewed.leaseId, era.leaseId);
    assert.equal((await s.page.evaluate(() => client.execute("weighIn", { lb: 170.2 }))).acknowledged, true);
    record("W-RENEW-200", "PASS", `day 201 on the same profile: the still-valid lease is re-signed to ${renewed.leaseRenewedUntil} in a real durable commit (revision ${renewed.revision}), same lease id ${renewed.leaseId}, and the save works`);
    await shut(s);

    s = await launch(pB, 402);
    const past = await s.page.evaluate(() => client.boot());
    assert.equal(past.ready, true);
    const write = await s.page.evaluate(() => client.execute("weighIn", { lb: 170 }));
    assert.equal(write.acknowledged, true);
    record("W-PAST-CLIFF", "PASS", `day 402 — past the original 400-day cliff — boots ready with ${past.ops} operations and saves ${write.op_id}: opening the app on day 201 is what kept writing alive`);
    await shut(s);
  });

  // ── ACT C — the lapse, the rollback that undoes it, and the disagreeing face ─
  const pC = profile("lapse");
  await act(["W-LAPSE-400", "W-CLOCK-ROLLBACK", "W-FACE-DISAGREES"], async () => {
    let s = await launch(pC);
    assert.equal((await s.page.evaluate(() => client.enroll({ profile: "host-clean-init" }))).enrolled, true);
    assert.equal((await s.page.evaluate(() => client.execute("weighIn", { lb: 170.6 }))).acknowledged, true);
    hardKill(s, pC); assert.equal(await settle(pC), true);

    s = await launch(pC, 401);
    assert.deepEqual(await s.page.evaluate(() => client.status()), { state: "restore-required", code: "LOCAL_LEASE_EXPIRED" });
    const lapsed = await s.page.evaluate(() => client.boot());
    assert.equal(lapsed.ready, false);
    assert.equal(lapsed.readable, true);
    assert.equal(lapsed.leaseExpired, true);
    assert.equal(lapsed.state, 20);
    assert.equal(lapsed.code, "LOCAL_LEASE_EXPIRED");
    assert.equal(lapsed.revision, 2);
    const refused = await s.page.evaluate(() => client.execute("weighIn", { lb: 169.9 }));
    assert.equal(refused.acknowledged, false);
    assert.equal(refused.state, 20);
    record("W-LAPSE-400", "PASS", `an era left unopened for 401 days: status restore-required/LOCAL_LEASE_EXPIRED, boot readable:true leaseExpired:true state 20 at revision 2 with the read still visible, execute refused state 20 — the data is intact, only writing stopped`);
    await shut(s);

    s = await launch(pC, 0);
    assert.deepEqual(await s.page.evaluate(() => client.status()), { state: "ready", code: "LOCAL_PRESENT" });
    assert.equal((await s.page.evaluate(() => client.boot())).ready, true);
    const wrote = await s.page.evaluate(() => client.execute("weighIn", { lb: 169.8 }));
    assert.equal(wrote.acknowledged, true);
    record("W-CLOCK-ROLLBACK", "PASS", `RED WITNESS 1 REPRODUCED — the installation that refused every write at day 401 accepts ${wrote.op_id} the moment the page clock reads day 0 again. Nothing in the unchanged core persists a wall high-water, so rolling the clock back reopens expiry; the local era has no trusted time to appeal to`);

    // The face is a cached observation. Crossing not_after mid-session makes it
    // disagree with the very next write — and C1 is what names the disagreement.
    const stale = await s.page.evaluate(() => { window.__off = 401; return client.status(); });
    assert.equal(stale.state, "ready");
    const mid = await s.page.evaluate(() => client.execute("weighIn", { lb: 169.7 }));
    assert.equal(mid.acknowledged, false);
    assert.equal(mid.state, 20);
    assert.equal(mid.code, "LOCAL_LEASE_EXPIRED");
    assert.deepEqual(await s.page.evaluate(() => client.status()), { state: "restore-required", code: "LOCAL_LEASE_EXPIRED" });
    record("W-FACE-DISAGREES", "PASS", `RED WITNESS 5 REPRODUCED (expiry variant) — status() answered "${stale.state}/${stale.code}" while the very next execute() refused state 20; the face is a cached observation, not a permission. C1 reads the sealed lease on the refusal path and names it LOCAL_LEASE_EXPIRED, and only then does status() agree`);
    await shut(s);
  });

  // ── ACT D — two tabs of one installation racing one revision ────────────────
  const pD = profile("tabs");
  await act(["W-TWO-TABS"], async () => {
    const s = await launch(pD);
    assert.equal((await s.page.evaluate(() => client.enroll({ profile: "host-clean-init" }))).enrolled, true);
    const second = await s.context.newPage();
    await second.goto(origin);
    await second.evaluate(async setup => {
      const { openLocalDurableClient } = await import("/local.js");
      const at = () => new Date().toISOString();
      window.client = await openLocalDurableClient({ ...setup,
        clock: { now: at, today: () => at().slice(0, 10), tz: "+00:00", monotonicMs: () => performance.now() } });
    }, SETUP);
    const race = await Promise.all([[s.page, 171.1], [second, 171.2]].map(([target, lb]) =>
      target.evaluate(value => client.execute("weighIn", { lb: value }), lb)));
    assert.deepEqual(race.map(result => result.acknowledged), [true, true]);
    const after = await s.page.evaluate(() => client.boot());
    assert.equal(after.ops, 2);
    assert.deepEqual(after.view.layer1.reads.map(read => read.lb).sort(), [171.1, 171.2]);
    record("W-TWO-TABS", "PASS", `two tabs on one profile, each with its own factory, raced one revision: both acknowledged (${race.map(r => r.op_id).join(", ")}), revision ${after.revision}, ${after.ops} operations, neither lost`);
    await shut(s);
  });

  // ── ACT E — site data cleared: whole erasure is indistinguishable from fresh ─
  const pE = profile("erased"), pF = profile("virgin");
  await act(["W-ERASE-ALL"], async () => {
    let s = await launch(pE);
    assert.equal((await s.page.evaluate(() => client.enroll({ profile: "host-clean-init" }))).enrolled, true);
    assert.equal((await s.page.evaluate(() => client.execute("weighIn", { lb: 170.6 }))).acknowledged, true);
    const wiped = await s.page.evaluate(async db => {
      client.close();
      const drop = name => new Promise(resolve => {
        const request = indexedDB.deleteDatabase(name);
        request.onsuccess = request.onerror = request.onblocked = () => resolve();
      });
      await drop(db); await drop(db + "-keys"); await drop(db + "-local");
      window.client = await window.__open();
      return client.status();
    }, DB);
    assert.deepEqual(wiped, { state: "first-run", code: "LOCAL_FIRST_RUN" });
    await shut(s);
    const fresh = await launch(pF);
    const virgin = await fresh.page.evaluate(() => client.status());
    assert.deepEqual(virgin, wiped);
    record("W-ERASE-ALL", "PASS", `RED WITNESS 3 REPRODUCED — with all three origin databases deleted the installation reports ${JSON.stringify(wiped)}, identical to a profile that never held anything. Erasure and first run are the same observation; nothing survives to say a history ever existed, so the app cannot warn and must not`);
    await shut(fresh);
  });

  // ── ACT F — PARTIAL erasure never reads as fresh ────────────────────────────
  const pG = profile("partial");
  await act(["W-ERASE-PARTIAL"], async () => {
    const s = await launch(pG);
    assert.equal((await s.page.evaluate(() => client.enroll({ profile: "host-clean-init" }))).enrolled, true);
    assert.equal((await s.page.evaluate(() => client.execute("weighIn", { lb: 170.6 }))).acknowledged, true);
    const probe = await s.page.evaluate(async db => {
      const drop = name => new Promise(resolve => {
        const request = indexedDB.deleteDatabase(name);
        request.onsuccess = request.onerror = request.onblocked = () => resolve();
      });
      const reopen = async () => {
        window.client = await window.__open();
        const booted = await client.boot();
        return { status: client.status(), ready: booted.ready, state: booted.state,
          enrolled: (await client.enroll()).enrolled };
      };
      client.close(); await drop(db + "-local");
      const marker = await reopen();
      client.close(); await drop(db + "-keys");
      return { marker, keyless: await reopen() };
    }, DB);
    assert.deepEqual(probe.marker.status, { state: "restore-required", code: "ENROLLMENT_MARKER_MISSING" });
    assert.equal(probe.marker.ready, false);
    assert.equal(probe.marker.enrolled, false);
    assert.deepEqual(probe.keyless.status, { state: "restore-required", code: "KEY_MISSING" });
    assert.equal(probe.keyless.enrolled, false);
    record("W-ERASE-PARTIAL", "PASS", `partial erasure never reads as fresh: enrollment marker gone -> ENROLLMENT_MARKER_MISSING, device key gone -> KEY_MISSING; boot() refuses and enroll() is refused both times, so nothing can reseed on top of data that still exists`);
    await shut(s);
  });

  // ── ACT G — a COHERENT OLD RESTORE of the whole profile ─────────────────────
  const pH = profile("restore"), snapshot = path.join(scratch, "restore-snapshot");
  await act(["W-OLD-RESTORE"], async () => {
    let s = await launch(pH);
    assert.equal((await s.page.evaluate(() => client.enroll({ profile: "host-clean-init" }))).enrolled, true);
    const first = await s.page.evaluate(() => client.execute("weighIn", { lb: 170.6 }));
    assert.equal(first.op_id, "op-dev-phone-A-1");
    await shut(s);                                   // graceful: the backup must be coherent
    assert.equal(await settle(pH), true);
    try { fs.cpSync(pH, snapshot, { recursive: true }); }
    catch (error) {
      record("W-OLD-RESTORE", "NOT-PROVABLE-HERE", `the whole-profile copy failed on this machine (${error?.code || error?.message}); this row needs a coherent copy of the browser profile directory`);
      return;
    }
    s = await launch(pH);
    assert.equal((await s.page.evaluate(() => client.execute("weighIn", { lb: 171.1 }))).op_id, "op-dev-phone-A-2");
    assert.equal((await s.page.evaluate(() => client.execute("weighIn", { lb: 171.2 }))).op_id, "op-dev-phone-A-3");
    await shut(s);
    assert.equal(await settle(pH), true);
    fs.rmSync(pH, { recursive: true, force: true });
    fs.cpSync(snapshot, pH, { recursive: true });

    s = await launch(pH);
    const restored = await s.page.evaluate(() => client.boot());
    assert.equal(restored.ready, true);
    assert.equal(restored.revision, 2);
    assert.equal(restored.ops, 1);
    const collision = await s.page.evaluate(() => client.execute("weighIn", { lb: 177.7 }));
    assert.equal(collision.acknowledged, true);
    assert.equal(collision.op_id, "op-dev-phone-A-2");
    record("W-OLD-RESTORE", "PASS", `RED WITNESS 4 REPRODUCED — a whole browser profile restored from a backup taken at revision 2 boots ready at revision 2 with 1 operation, and the very next save re-issues ${collision.op_id} for 177.7 lb, a slot already spent on 171.1 lb. Offline nothing can tell the two apart; a hosted authority would see IDENTITY_COLLISION, and 171.2 lb is simply gone`);
    await shut(s);
  });

  // ── ACT H — real storage pressure: a capped origin quota, genuinely filled ───
  const pI = profile("quota");
  await act(["W-QUOTA"], async () => {
    // The real quota is a share of free disk and cannot be filled in a test, so the
    // browser is asked to enforce a small one BEFORE the origin touches IndexedDB —
    // Chromium settles a storage key's quota on first use and a later override does
    // not disturb it. The QuotaExceededError below is then the browser's own, not a
    // fault injected into product code. The CDP session is held for the whole row:
    // a detached client loses its overrides.
    let cdp = null, capFailure = null;
    const s = await launch(pI, 0, async ({ context, page }) => {
      try {
        cdp = await context.newCDPSession(page);
        await cdp.send("Storage.overrideQuotaForOrigin", { origin, quotaSize: 12 * 1024 * 1024 });
        await page.evaluate(() => navigator.storage.estimate());
      } catch (error) { capFailure = String(error?.message || error).split("\n")[0]; }
    });
    if (capFailure) {
      record("W-QUOTA", "NOT-PROVABLE-HERE", `this browser refused Storage.overrideQuotaForOrigin (${capFailure}), and the real origin quota is a share of free disk`);
      await shut(s); return;
    }
    assert.equal((await s.page.evaluate(() => client.enroll({ profile: "host-clean-init" }))).enrolled, true);
    const seed = await s.page.evaluate(() => client.execute("weighIn", { lb: 170.6 }));
    assert.equal(seed.acknowledged, true);
    // REVIEW D4. "Byte-exact" has to mean bytes. The sealed record is read raw and
    // hashed in the page (iv + ciphertext + the envelope fields), before and after
    // the refused save, and the two digests are compared.
    const digest = () => s.page.evaluate(db => new Promise((resolve, reject) => {
      const request = indexedDB.open(db);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const handle = request.result, tx = handle.transaction("generations", "readonly");
        const read = tx.objectStore("generations").get("active");
        tx.oncomplete = async () => {
          handle.close();
          const record = read.result;
          const bytes = new Blob([record.format, record.namespace, String(record.revision),
            record.iv, record.ciphertext]);
          const hash = await crypto.subtle.digest("SHA-256", await bytes.arrayBuffer());
          resolve([...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join(""));
        };
        tx.onabort = () => { handle.close(); reject(tx.error); };
      };
    }), DB);
    const beforeBytes = await digest();
    const filled = await s.page.evaluate(async () => {
      const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open("w6-quota-filler", 1);
        request.onupgradeneeded = () => request.result.createObjectStore("junk");
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      // A ladder, not one chunk size. Filling with 1 MiB blocks leaves up to 1 MiB
      // free, which is far more than one sealed generation needs — the origin has
      // to be full to within less than a save, or the save simply fits.
      let written = 0, error = null, bottomedOut = false;
      const put = async size => {
        const chunk = new Uint8Array(size);
        for (let at = 0; at < size; at += 65536) crypto.getRandomValues(chunk.subarray(at, Math.min(at + 65536, size)));
        await new Promise((resolve, reject) => {
          const tx = db.transaction("junk", "readwrite");
          tx.objectStore("junk").put(chunk, `chunk-${size}-${written}-${Math.random()}`);
          tx.oncomplete = () => resolve();
          tx.onabort = () => reject(tx.error || new Error("abort"));
          tx.onerror = () => {};
        });
        written += size;
      };
      for (const size of [1048576, 131072, 16384, 2048, 256]) {
        let hit = false;
        for (let i = 0; i < 400 && !hit; i++) {
          try { await put(size); }
          catch (failure) { error = failure?.name || String(failure); hit = error === "QuotaExceededError"; }
        }
        if (!hit) { bottomedOut = true; break; }
      }
      // REVIEW D4. The headroom claim is only true if the SMALLEST write still
      // fails at the end, so it is confirmed rather than inferred from the ladder.
      let headroom = null;
      try { await put(256); headroom = ">= 256"; }
      catch (failure) { headroom = (failure?.name === "QuotaExceededError") ? "< 256" : `unknown (${failure?.name})`; }
      db.close();
      return { mib: +(written / 1048576).toFixed(2), error, headroom, bottomedOut };
    });

    if (filled.error !== "QuotaExceededError" || filled.headroom !== "< 256") {
      record("W-QUOTA", "NOT-PROVABLE-HERE", `wrote ${filled.mib} MiB of junk into the origin; last error ${filled.error || "none"}, confirmed free space ${filled.headroom}${filled.bottomedOut ? ", ladder bottomed out without a final refusal" : ""} — the capped quota was not enforced tightly enough to squeeze a save, so this row decides nothing`);
      await shut(s); return;
    }
    const refused = await s.page.evaluate(() => client.execute("weighIn", { lb: 171.4 }));
    assert.equal(refused.acknowledged, false);
    assert.equal(refused.state, 3);
    assert.equal(refused.code, "TRANSACTION_ABORTED");
    const afterBytes = await digest();
    assert.equal(afterBytes, beforeBytes, "the sealed generation changed across a refused save");
    const held = await s.page.evaluate(() => client.boot());
    assert.equal(held.revision, seed.durableRevision);
    assert.equal(held.ops, 1);
    assert.deepEqual(held.view.layer1.reads.map(read => read.lb), [170.6]);
    await s.page.evaluate(() => new Promise(resolve => {
      const request = indexedDB.deleteDatabase("w6-quota-filler");
      request.onsuccess = request.onerror = request.onblocked = () => resolve();
    }));
    const next = await s.page.evaluate(() => client.execute("weighIn", { lb: 171.5 }));
    assert.equal(next.acknowledged, true);
    assert.equal(next.op_id, "op-dev-phone-A-2");
    record("W-QUOTA", "PASS", `origin quota capped at 12 MiB and filled until a confirmed ${filled.headroom} bytes remained (${filled.mib} MiB of junk, then the browser's OWN QuotaExceededError — no fault injected into product code): the save is refused ${refused.state}/${refused.code}, the sealed record is BYTE-IDENTICAL across the refusal (sha256 ${beforeBytes.slice(0, 16)}… before and after), the generation holds at revision ${held.revision} with ${held.ops} operation and the 170.6 read intact, and once the junk is dropped the next save still takes ${next.op_id} — the refused batch spent no sequence`);
    try { await cdp.detach(); } catch {}
    await shut(s);
  });

  // ── The rows no desktop browser can decide, stated rather than skipped ───────
  record("W-NO-NETWORK", foreign.length === 0 ? "PASS" : "FAIL",
    `${foreign.length} non-origin request from the app's own frames across ${contexts} browser contexts${foreign.length ? ": " + foreign.slice(0, 5).join(" ") : ""} — the local era asks nothing of the network, so airplane mode changes nothing. (${chrome.length} request(s) came from the browser's own new-tab chrome, outside the page: ${[...new Set(chrome)].slice(0, 2).join(" ") || "none"})`);
  record("W-POWER-LOSS", "NOT-PROVABLE-HERE",
    "taskkill /F ends the process; it does not cut power mid-fsync. The repository asks for durability:\"strict\" and reports {requested, actual} — whether the platform honoured it is the platform's claim, not ours. Only pulling a battery would test it, and no browser can");
  record("W-REAL-ELAPSED", "NOT-PROVABLE-HERE",
    "days 1 / 201 / 401 / 402 are an injected page clock, not waiting. Nothing here has been left for a year, and no browser can prove how much time passed while the process was absent (SCORECARD-W3 C1-C11-RESTART)");
  record("W-IOS-EVICTION", "NOT-PROVABLE-HERE",
    "a scripted deleteDatabase is not iOS deciding to reclaim site data under pressure. W-ERASE-ALL shows the SHAPE that results; nothing can force, predict or survive the decision itself, and the app cannot tell the browser's erasure from the athlete's");
  record("W-IOS-SAFARI", "NOT-PROVABLE-HERE",
    "every row above ran on Chromium (Edge). Safari's IndexedDB has its own transaction and eviction behaviour; that is C3-HAND-PROOF.md, on Joe's phone, by hand");
  record("W-PHONE-REBOOT", "NOT-PROVABLE-HERE",
    "W-REBOOT-PROCESS proves the new-process half on one machine. A phone reboot also power-cycles the storage stack and re-runs iOS's own recovery; only the phone row proves that");
  record("W-SEQ-EXHAUSTION", "NOT-PROVABLE-HERE",
    "RESIDUAL AGAINST DECISIONS:24 — the ruling bounds offline writes after an unproven restart by a wall-clock AND a sequence budget. The local era implements the wall-clock half (the 400-day self-renewing lease) and NO slot budget, by the lane lead's explicit C1 decision: the ruling bounds writes RELATIVE TO A RECONCILED AUTHORITY, and the local era has no authority to reconcile with, so a budget would refuse the owner's own saves with nothing to refill them. The PM is asked to confirm or overrule. The exhaustion FACE is therefore unreachable here, and the node case pins that so it fails the day a budget arrives");
  }
} finally {
  for (const context of live) { try { await context.close(); } catch {} }
  await site.close();
  for (const name of fs.readdirSync(scratch)) { try { hardKill(null, path.join(scratch, name)); } catch {} }
  await new Promise(resolve => setTimeout(resolve, 500));
  try { fs.rmSync(scratch, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch {}
}

const width = Math.max(...rows.map(row => row.id.length));
for (const row of rows) console.log(`${row.verdict.padEnd(18)} ${row.id.padEnd(width)}  ${row.evidence}`);
const failed = rows.filter(row => row.verdict === "FAIL");
const proved = rows.filter(row => row.verdict === "PASS");
const open = rows.filter(row => row.verdict === "NOT-PROVABLE-HERE");
if (noise.length) console.log(`(${noise.length} Playwright rejection(s) from the kills, ignored: ${[...new Set(noise)].slice(0, 3).join(" | ")})`);
console.log(BITE
  ? `W6 LOCAL-WITNESSES BITE ${failed.length ? "INCONCLUSIVE" : "PASS"} — ${proved.length} control(s) as designed, ${failed.length} not; ` +
    `candidate bridge.mjs unchanged (${bridgeBefore.slice(0, 12)}…); ${version}; ${contexts} browser contexts`
  : `W6 LOCAL-WITNESSES ${failed.length ? "FAIL" : "PASS"} — ${proved.length} proved, ${failed.length} failed, ` +
    `${open.length} not provable in any desktop browser; ${version}; ${contexts} browser contexts; ${built.inventory.length} pinned bundle inputs`);
console.log("W6 iPhone / iOS Safari acceptance NOT RUN — Chromium-family evidence only; the phone rows are rebuild/lanes/c/C3-HAND-PROOF.md");
process.exitCode = failed.length ? 1 : 0;
