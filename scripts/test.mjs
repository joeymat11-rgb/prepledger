#!/usr/bin/env node
// The whole suite, in one command, on any machine.
//
//   npm test
//
// Three layers, cheapest first:
//   1. engine suite  — ~389 assertions over the rules engine (tools/engine-test.jsx)
//   2. render smoke  — every tab, in three states, must render without
//                      "undefined" / "NaN" / an empty screen
//   3. dom smoke     — the *committed* app.js (the exact bytes Netlify serves)
//                      must boot in a DOM and seed its state
//
// Layer 3 deliberately tests the shipped artifact rather than a fresh build:
// if app.js were stale, layers 1 and 2 would still pass while production was
// broken. scripts/check.mjs closes that gap from the other side.

import esbuild from "esbuild";
import { ROOT, at, tmp, isMain, head, pass, fail, note, node, bold, red, green, dim } from "./lib.mjs";

// The engine suite stood at 591 assertions when this floor was last raised.
// Adding assertions is expected; losing them silently is the failure this
// guards. Raise the floor whenever the suite grows — a floor left far below the
// real count stops guarding anything, which is exactly what happened: it sat at
// 380 while the suite ran 591, so a change that silently dropped a third of the
// assertions would still have shipped green.
const MIN_ASSERTIONS = 815;

async function engineSuite() {
  const out = tmp("engine-test.cjs");
  try {
    await esbuild.build({
      entryPoints: [at("tools", "engine-test.jsx")],
      bundle: true,
      platform: "node",
      jsx: "automatic",
      loader: { ".jsx": "jsx" },
      outfile: out,
      absWorkingDir: ROOT,
      logLevel: "silent",
    });
  } catch (e) {
    return { ok: false, detail: "test bundle would not build — " + (e && e.message) };
  }

  const r = await node([out]);

  // The suite prints a running tally per section and a grand total at the end.
  // Take the LAST match, never the first — matching the first reported "29
  // passed, 0 failed" as the whole result, which would have hidden every
  // failure in the other 330 assertions.
  const all = [...r.out.matchAll(/(\d+)\s+passed,\s+(\d+)\s+failed/g)];
  if (!all.length) {
    return { ok: false, detail: "suite produced no result line", log: r.out.slice(-2500) };
  }
  const [, passed, failedN] = all[all.length - 1];

  if (Number(failedN) > 0 || r.code !== 0) {
    const fails = r.out.split("\n").filter((l) => /FAIL/.test(l)).slice(0, 25).join("\n");
    return { ok: false, detail: `${passed} passed, ${failedN} failed`, log: fails };
  }

  // A suite that quietly stops running most of its assertions is a broken
  // suite that reports green. Hold the line at the count we know exists.
  if (Number(passed) < MIN_ASSERTIONS) {
    return {
      ok: false,
      detail: `only ${passed} assertions ran — expected at least ${MIN_ASSERTIONS}. ` +
              `Either the suite is being cut short, or it genuinely shrank and ` +
              `MIN_ASSERTIONS in scripts/test.mjs needs updating on purpose.`,
    };
  }
  return { ok: true, detail: `${passed} assertions passed` };
}

function child(rel, label) {
  return async () => {
    const r = await node([at(...rel.split("/"))]);
    if (r.code !== 0) return { ok: false, detail: `${label} failed`, log: r.out.slice(-2500) };
    const last = r.out.trim().split("\n").filter(Boolean).pop() || label;
    return { ok: true, detail: last.trim() };
  };
}

const SUITES = [
  ["engine suite", engineSuite],
  ["render smoke", child("tools/render-smoke.mjs", "render smoke")],
  ["dom smoke", child("tools/dom-smoke.mjs", "dom smoke")],
  ["beacon smoke", child("tools/beacon-smoke.mjs", "beacon smoke")],
];

/** Run everything. Returns true when all green. */
export async function runTests() {
  head("Suite");
  let allGreen = true;
  for (const [name, fn] of SUITES) {
    let res;
    try {
      res = await fn();
    } catch (e) {
      res = { ok: false, detail: String((e && e.message) || e) };
    }
    if (res.ok) {
      pass(`${name} — ${res.detail}`);
    } else {
      allGreen = false;
      fail(`${name} — ${res.detail}`);
      if (res.log) console.log(dim(res.log.split("\n").map((l) => "        " + l).join("\n")));
    }
  }
  return allGreen;
}

if (isMain(import.meta.url)) {
  const green_ = await runTests();
  console.log(green_ ? `\n${green(bold("Suite green."))}` : `\n${red(bold("Suite RED."))}`);
  process.exit(green_ ? 0 : 1);
}
