// BEACON SMOKE — proves the error beacon does its job and, more importantly,
// proves it cannot become the thing that breaks the app.
//
// The beacon is the only channel through which an iOS-Safari-only fault ever
// reaches a future session, so it runs on every launch, on her phone, in the
// path of an app that is already in trouble. A beacon that throws while
// handling an error would turn a recoverable fault into a blank screen.

import esbuild from "esbuild";
import { JSDOM } from "jsdom";
import { at, tmp, ROOT } from "../scripts/lib.mjs";
import fs from "node:fs";

const out = tmp("beacon-smoke.js");
await esbuild.build({
  entryPoints: [at("src", "beacon.js")],
  bundle: true, format: "iife", globalName: "PLB",
  define: { __APP_V__: '"9.9.9-test"' },
  absWorkingDir: ROOT, logLevel: "silent", outfile: out,
});
const bundle = fs.readFileSync(out, "utf8");

function freshWindow() {
  const dom = new JSDOM("<!doctype html><body></body>", {
    url: "https://smoke.local/", runScripts: "outside-only", pretendToBeVisual: true,
  });
  dom.window.eval(bundle);
  return dom.window;
}

let failed = 0;
const check = (ok, label, extra) => {
  console.log(ok ? `  OK: ${label}` : `  FAIL: ${label}${extra ? " — " + extra : ""}`);
  if (!ok) failed++;
};

// 1. Installing must be silent and idempotent.
{
  const w = freshWindow();
  let threw = null;
  try { w.PLB.installBeacon(); w.PLB.installBeacon(); } catch (e) { threw = e; }
  check(!threw, "installBeacon is safe to call twice", threw && threw.message);
  w.close();
}

// 2. A fault is recorded, stamped with the build's version.
{
  const w = freshWindow();
  w.PLB.report(new Error("boom"), "test");
  const buf = w.PLB.__beacon.readBuffer();
  check(buf.length === 1, "one fault recorded", `got ${buf.length}`);
  check(buf[0] && buf[0].msg === "boom", "the message survives");
  check(buf[0] && buf[0].v === "9.9.9-test", "stamped with the app version", buf[0] && buf[0].v);
  w.close();
}

// 3. The same fault twice inside the dedupe window is one entry, counted.
{
  const w = freshWindow();
  w.PLB.report(new Error("same"), "test");
  w.PLB.report(new Error("same"), "test");
  w.PLB.report(new Error("same"), "test");
  const buf = w.PLB.__beacon.readBuffer();
  check(buf.length === 1 && buf[0].n === 3, "repeats are deduped and counted",
        `${buf.length} entries, n=${buf[0] && buf[0].n}`);
  w.close();
}

// 4. A credential must never reach the repo, even inside an error message.
//    This file is committed to a repo, so the string below is a fake.
{
  const w = freshWindow();
  const fake = "github_pat_" + "1A".repeat(20);
  w.localStorage.setItem("prep-ledger-ghtoken", fake);
  w.PLB.report(new Error("fetch failed for " + fake), "test");
  const dump = JSON.stringify(w.PLB.__beacon.readBuffer());
  check(!dump.includes(fake), "the token is redacted out of the payload");
  check(dump.includes("<redacted>"), "redaction actually fired");
  w.close();
}

// 5. The payload carries no ledger data — only these fields, ever.
{
  const ALLOWED = new Set(["print", "at", "last", "n", "v", "kind", "msg", "stack", "ua", "page"]);
  const w = freshWindow();
  w.localStorage.setItem("prep-ledger-v1", JSON.stringify({ reads: [{ w: 214.5 }] }));
  w.PLB.report(new Error("boom"), "test");
  const entry = w.PLB.__beacon.readBuffer()[0] || {};
  const unexpected = Object.keys(entry).filter((k) => !ALLOWED.has(k));
  check(unexpected.length === 0, "no unexpected fields in the payload", unexpected.join(", "));
  check(!JSON.stringify(entry).includes("214.5"), "no health data leaks into a fault report");
  w.close();
}

// 6. THE important one: with storage unavailable — iOS private browsing, a
//    full quota — nothing throws. The app carries on as if the beacon
//    were not there.
{
  const w = freshWindow();
  Object.defineProperty(w, "localStorage", {
    configurable: true,
    get() { throw new Error("storage is blocked"); },
  });
  let threw = null;
  try {
    w.PLB.installBeacon();
    w.PLB.report(new Error("boom"), "test");
    await w.PLB.__beacon.flush();
  } catch (e) { threw = e; }
  check(!threw, "survives localStorage being unavailable", threw && threw.message);
  w.close();
}

// 7. With no token saved, flushing is a silent no-op rather than a crash.
{
  const w = freshWindow();
  w.PLB.report(new Error("boom"), "test");
  let threw = null;
  try { await w.PLB.__beacon.flush(); } catch (e) { threw = e; }
  check(!threw, "flush with no token does not throw", threw && threw.message);
  check(w.PLB.__beacon.readBuffer().length === 1, "and the fault stays buffered for next time");
  w.close();
}

if (failed) {
  console.error(`BEACON-SMOKE: ${failed} failure(s)`);
  process.exit(1);
}
console.log("BEACON-SMOKE: records faults, redacts tokens, and cannot break the app");
process.exit(0);
