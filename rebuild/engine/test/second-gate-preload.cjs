"use strict";
// Read-only harness observer plus deterministic randomness and closed mock I/O.
// No assertion, expected value, fixture or candidate result is replaced here.
const fs = require("node:fs"), crypto = require("node:crypto");
const key = Symbol.for("measured.m2.second-gate");
const context = { assertions: [], exportReads: new Set(), missing: new Set(), randomCalls: 0,
  networkCalls: 0, pending: new Set(), violations: [], carrierReads: new Set() };
globalThis[key] = context;
let seed = 0x4d320007;
context.random = () => { context.randomCalls++; seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
Math.random = context.random;
const sourceFrames = stack => String(stack).split("\n").flatMap(line => {
  const m = line.match(/[\\/]tools[\\/](engine-test\.jsx|closure-sf[12]\.mjs):(\d+):(\d+)/);
  return m ? [{ file: "tools/" + m[1], line: +m[2], column: +m[3] }] : [];
});
const currentSite = () => sourceFrames(new Error().stack).find(f => !(f.file === "tools/engine-test.jsx" && f.line === 27));
function violate(reason) { context.violations.push(reason); throw Error("Second gate blocked unmocked I/O"); }
let mockFetch = null, mockStore;
const guardedFetch = (url, options) => {
  if (!mockFetch) return Promise.reject((() => { try { violate("fetch without declared harness mock"); } catch(e) { return e; } })());
  const u = String(url), method = options?.method || "GET";
  if (!/^https:\/\/api\.github\.com\/repos\/joeymat11-rgb\/prepledger\/contents\/ledger\/(state\.json(?:\?t=\d+)?|snapshots\/state-\d{4}-\d{2}-\d{2}\.json)$/.test(u) || !["GET", "PUT"].includes(method)) {
    return Promise.reject((() => { try { violate("request outside declared synthetic upload boundary"); } catch(e) { return e; } })());
  }
  context.networkCalls++;
  // The only callable delegate is the exact harness's in-memory mock. Neither
  // the native fetch nor an external networking implementation is retained.
  const pending = Promise.resolve().then(() => mockFetch(url, options));
  context.pending.add(pending);
  pending.then(() => context.pending.delete(pending), () => context.pending.delete(pending));
  return pending;
};
Object.defineProperty(globalThis, "fetch", { configurable: false, enumerable: true,
  get: () => guardedFetch,
  set(value) {
    const site = currentSite();
    if (site?.file !== "tools/closure-sf2.mjs" || ![3187,3195].includes(site.line)) violate("fetch mock assignment outside pinned closure");
    if (value === guardedFetch) { if (context.pending.size) violate("mock restored before pending requests settled"); mockFetch = null; return; }
    const text = Function.prototype.toString.call(value);
    if (!text.includes("caught.snap") || !text.includes("caught.ledger") || !text.includes("404")) violate("unexpected fetch delegate");
    mockFetch = value;
  }
});
Object.defineProperty(globalThis, "localStorage", { configurable: false, enumerable: true,
  get: () => mockStore,
  set(value) {
    const site = currentSite();
    const allowed = site && ((site.file === "tools/closure-sf2.mjs" && [3184,3195].includes(site.line)) ||
      (site.file === "tools/engine-test.jsx" && [8460,8465].includes(site.line)));
    if (!allowed) violate("storage assignment outside pinned synthetic harness");
    mockStore = value;
  }
});
const originalLog = console.log;
console.log = (...args) => {
  if (typeof args[0] === "string" && /^(PASS|FAIL) — /.test(args[0])) {
    const site = currentSite();
    if (!site) context.violations.push("assertion source site missing");
    context.assertions.push({ ...site, outcome: args[0].startsWith("PASS") ? "PASS" : "FAIL" });
  }
  return Reflect.apply(originalLog, console, args);
};
process.on("exit", () => {
  if (context.pending.size) context.violations.push("pending mock request at exit");
  if (mockFetch || mockStore !== undefined) context.violations.push("harness mock not restored");
  const metadata = { assertions: context.assertions, exportReads: [...context.exportReads].sort(),
    missing: [...context.missing].sort(), carrierReads: [...context.carrierReads].sort(),
    randomCalls: context.randomCalls, networkCalls: context.networkCalls, pendingRequests: context.pending.size,
    violations: context.violations, randomFinalState: seed };
  try { fs.writeFileSync(process.env.M2_SECOND_GATE_META, JSON.stringify(metadata, null, 2) + "\n"); }
  catch (_) { process.exitCode = 1; }
  if (context.violations.length || context.missing.size) process.exitCode = 1;
});
