/* PART2-DOM-LISTENERS.mjs - spec D.2 and D.2b for the big cut, as a runnable artifact.
 *
 * D.2  the built page equal before and after, over every state this harness can drive:
 *      the DOM is serialised with a single normalisation (attributes sorted) and compared
 *      state for state. A state that cannot be driven is listed NOT COVERED with its
 *      reason and judged by the reviewer (H.2 STOP 4: more than three is a STOP).
 * D.2b the listener census: EventTarget.prototype.addEventListener is instrumented for the
 *      duration of each state and a sorted list of <data-slot or tag>:<type>:<count> is
 *      recorded. PASS is that list equal, state for state, before and after. It matters
 *      MORE under this direction, because E.6's shim routes every view listener through
 *      the seal, so every wiring site in the released file is touched.
 *
 * BEFORE is the PRE-CUT today-app.cjs taken from a named ref by `git show`, written into a
 * COPY of the today directory with today-lanes.cjs removed; AFTER is the working tree. The
 * two are mounted in the same process, one after the other, over the same synthetic model.
 *
 * It is not a CI cell and names no CI step. Run it from a farm scratch worktree:
 *   node rebuild/lanes/c/today-split/PART2-DOM-LISTENERS.mjs [<ref>]
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { JSDOM } from "jsdom";

const REF = process.argv[2] || "da9f86839d69a67dfa8c6a59b727aa518bc1164f";
const ROOT = process.cwd();
const TODAY = path.join(ROOT, "rebuild/m3/w7-preview/today");

/* ---- BEFORE and AFTER, BOTH IN PLACE ---------------------------------------------------
 * The two forms are run in the REAL today directory, one after the other, with the file
 * swapped between them and put back in a finally. A copy of the directory elsewhere was
 * tried first and is wrong: today-engine.cjs requires ../browser-engine.cjs and several
 * siblings climb two levels out, so a copy silently stops being the page. Node caches a
 * module by resolved path, so each form is loaded in its own CHILD PROCESS and this file
 * is both the parent and the child (--form before|after).
 */
const TODAY_APP = path.join(TODAY, "today-app.cjs");
const LANES = path.join(TODAY, "today-lanes.cjs");
const FORM = process.argv.includes("--form") ? process.argv[process.argv.indexOf("--form") + 1] : null;

/* ---- the listener census ------------------------------------------------------------- */
function instrument(win) {
  const seen = [];
  const original = win.EventTarget.prototype.addEventListener;
  win.EventTarget.prototype.addEventListener = function (type, fn, opts) {
    const slot = (this && this.dataset && this.dataset.slot)
      || (this && this.tagName ? String(this.tagName).toLowerCase() : String(this));
    seen.push(slot + ":" + type);
    return original.call(this, type, fn, opts);
  };
  return () => {
    win.EventTarget.prototype.addEventListener = original;
    const counts = new Map();
    for (const k of seen) counts.set(k, (counts.get(k) || 0) + 1);
    return [...counts.entries()].map(([k, n]) => k + ":" + n).sort();
  };
}

/* ---- the one normalisation: attributes sorted ----------------------------------------- */
function normalise(node) {
  if (node.nodeType === 3) return JSON.stringify(node.textContent);
  if (node.nodeType !== 1) return "";
  const attrs = [...node.attributes].map((a) => a.name + "=" + JSON.stringify(a.value)).sort();
  const kids = [...node.childNodes].map(normalise).filter(Boolean);
  return "<" + node.tagName.toLowerCase() + (attrs.length ? " " + attrs.join(" ") : "") + ">"
    + kids.join("") + "</" + node.tagName.toLowerCase() + ">";
}

async function run(dir) {
  const app = await import(path.join(dir, "today-app.cjs"));
  const TodayModel = await import(path.join(dir, "today-model.cjs"));
  const design = await import(path.join(dir, "design.cjs"));
  const { mountToday } = app.default;
  const { createTodayModel, SYNTHETIC_DAY } = TodayModel.default;
  const shell = design.default.shellHtml()
    .replace("<!-- APPROVED_TEMPLATES -->", design.default.templateHtml());
  const out = {};
  const notCovered = [];
  for (const screen of ["today", "why", "nutrition", "recovery", "coach", "weigh", "workout"]) {
    const dom = new JSDOM(shell, { url: "http://127.0.0.1:4178/" });
    const stop = instrument(dom.window);
    let api = null;
    try {
      api = mountToday(dom.window.document, createTodayModel({ today: SYNTHETIC_DAY }), {});
      if (typeof api.render === "function" && screen !== "today") await api.render(screen, true);
      await new Promise((r) => setTimeout(r, 0));
      out[screen] = { dom: normalise(dom.window.document.getElementById("phone")), listeners: stop() };
    } catch (e) {
      stop();
      notCovered.push({ screen, reason: e.message });
    }
  }
  return { out, notCovered };
}

if (FORM) {
  /* THE CHILD: measure whichever form is on disk right now and print it as JSON. */
  const measured = await run(TODAY);
  process.stdout.write("\u0001" + JSON.stringify(measured) + "\u0001");
  process.exit(0);
}

/* THE PARENT. */
const afterSrc = fs.readFileSync(TODAY_APP, "utf8");
const lanesSrc = fs.existsSync(LANES) ? fs.readFileSync(LANES, "utf8") : null;
const beforeSrc = execFileSync("git", ["-C", ROOT, "show",
  REF + ":rebuild/m3/w7-preview/today/today-app.cjs"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
function child(label) {
  const out = execFileSync(process.execPath, [process.argv[1], REF, "--form", label],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, cwd: ROOT });
  const parts = out.split("\u0001");
  return JSON.parse(parts[1]);
}
let A = null, B = null;
try {
  B = child("after");
  fs.writeFileSync(TODAY_APP, beforeSrc);
  if (lanesSrc !== null) fs.rmSync(LANES);
  A = child("before");
} finally {
  fs.writeFileSync(TODAY_APP, afterSrc);
  if (lanesSrc !== null) fs.writeFileSync(LANES, lanesSrc);
}

let domDiff = 0, listenerDiff = 0;
const states = [...new Set([...Object.keys(A.out), ...Object.keys(B.out)])].sort();
console.log("D.2 / D.2b over " + states.length + " driven states, BEFORE = " + REF.slice(0, 12));
for (const s of states) {
  const a = A.out[s], b = B.out[s];
  if (!a || !b) { console.log("  " + s.padEnd(12) + " NOT COVERED on one side"); continue; }
  const dom = a.dom === b.dom, lis = JSON.stringify(a.listeners) === JSON.stringify(b.listeners);
  if (!dom) domDiff += 1;
  if (!lis) listenerDiff += 1;
  console.log("  " + s.padEnd(12) + " DOM " + (dom ? "EQUAL" : "DIFFERS (" + a.dom.length +
    " vs " + b.dom.length + " chars)") + " | listeners " +
    (lis ? "EQUAL (" + a.listeners.length + " kinds)" : "DIFFER"));
  if (!lis) {
    const only = (x, y) => x.filter((k) => !y.includes(k));
    console.log("      before only: " + only(a.listeners, b.listeners).join(", "));
    console.log("      after  only: " + only(b.listeners, a.listeners).join(", "));
  }
  if (!dom) {
    for (let i = 0; i < Math.max(a.dom.length, b.dom.length); i += 1) {
      if (a.dom[i] !== b.dom[i]) {
        console.log("      first difference at " + i + ":");
        console.log("        before ..." + a.dom.slice(Math.max(0, i - 60), i + 90));
        console.log("        after  ..." + b.dom.slice(Math.max(0, i - 60), i + 90));
        break;
      }
    }
  }
}
for (const n of [...A.notCovered, ...B.notCovered]) {
  console.log("  NOT COVERED " + n.screen + ": " + n.reason.slice(0, 160));
}
console.log("D.2 states differing: " + domDiff + " | D.2b listener censuses differing: " + listenerDiff);
console.log("NOT COVERED: " + (A.notCovered.length + B.notCovered.length) +
  " (H.2 STOP 4 fires above three)");
