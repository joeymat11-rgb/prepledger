#!/usr/bin/env node
/* reach.cjs - THE REACHABILITY TABLE (S-R17 (d)).
 *
 * S-R12 makes the gesture guard's subject list MACHINE-DERIVED: a callback is guarded if
 * and only if it reaches a durable put AND no paint root reaches it. That is a
 * reachability question and this measures it, over the UNCUT source, because the question
 * "which durable writers does a paint root reach TODAY" is about today's code.
 *
 * It builds a call graph over the functions declared in a file, classifies every edge, and
 * walks it from two root sets:
 *   PAINT   - the render/paint entry and every function it reaches, plus the mount body
 *             (the BOOT), which is the other caller a guard would throw under.
 *   LISTENER- every function literal handed to addEventListener, and every function it
 *             reaches.
 * The targets are member calls whose property name is on one of three word lists, which
 * R2 BLOCKING-2 says must be split and S-R12 says E.3 must carry:
 *   PUT       - it may put a row of the athlete's on disk.
 *   STORE     - it reaches a store and stores nothing (a read, an open, a close).
 *   ADOPT     - it replaces an in-memory basis or moves a gate (F.2: not durable).
 *
 * WHAT A STATIC CALL GRAPH CANNOT SEE is not guessed at: those edges are listed by hand in
 * BLIND_EDGES below, each with the line that proves it, and the walk uses them.
 *
 * Usage: node reach.cjs --root <worktree> [--md REACH.md] [--json REACH.json]
 */
"use strict";
const fs = require("fs");
const path = require("path");

const INSTR = process.env.CENSUS_INSTRUMENT || "/home/claude/farm/tools/census/node_modules";
const acorn = require(path.join(INSTR, "acorn"));
const walk = require(path.join(INSTR, "acorn-walk"));

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 ? argv[i + 1] : d; };
const ROOT = opt("root");
const MD = opt("md");
const JSONOUT = opt("json");
if (!ROOT) { console.error("usage: reach.cjs --root <worktree>"); process.exit(2); }
const TODAY = "rebuild/m3/w7-preview/today";

/* ---- the three word lists ----------------------------------------------------------- */
const PUT = new Set(["save", "weighIn", "logSet", "finish", "undo", "start", "forget",
  "recover", "restart", "reopen", "retract", "retractImport", "importBundle",
  "admitLocalSource", "commit"]);
const STORE = new Set(["all", "forDate", "latest", "rows", "refresh", "summary", "recorded",
  "today", "close", "transaction", "objectStore", "admittedLocalSourceState", "listImports",
  "athleteState", "firstRun", "recordedLines", "hostForDay"]);
const ADOPT = new Set(["adoptBasis", "setPendingAdoption", "setFoodDays", "setSleepNights",
  "rebase", "holdForAdoption", "adoptEngineState"]);
/* Receivers that are plainly not a store, so a hit on them is a false positive and is
   reported as one rather than dropped silently. */
const NOT_A_STORE_RECEIVER = new Set(["Promise", "Object", "Array", "JSON", "Math",
  "settingsRead", "settingsInFlight", "settingsErrors", "map", "cache", "rows", "entry",
  "importScreen", "measureScreen", "result", "lines", "answers", "set"]);

/* ---- the edges a static call graph cannot see, each with the line that proves it ------ */
const BLIND_EDGES = [
  { file: "today-app.cjs", from: "render", to: "<setup-app.mjs>.done", kind: "foreign-callback",
    proof: ":2301 setup.open({ doc, phone, back, done }) - `done` at :2321 is invoked by setup-app.mjs, not here",
    reaches: ["canAdoptAthleteState", "armAdoptionGate", "adoptAthleteState", "settleAdoption", "render"] },
  { file: "today-app.cjs", from: "render", to: "<checkin-app.mjs>.back", kind: "foreign-callback",
    proof: ":2351 checkin.open({ doc, phone, back: () => render(origin, true) })", reaches: ["render"] },
  { file: "today-app.cjs", from: "render", to: "<gym-app.mjs>.back/checkIn", kind: "foreign-callback",
    proof: ":2364-:2365 workout.open({ back, checkIn }) - checkIn sets checkinOrigin and renders",
    reaches: ["render"] },
  { file: "today-app.cjs", from: "measureDeps", to: "<measure-screen.mjs>.repaint/back", kind: "foreign-callback",
    proof: ":640-:641 repaint and back inside the deps object handed to createMeasureScreen",
    reaches: ["render"] },
  { file: "today-app.cjs", from: "importDeps", to: "<import-screen.mjs>.repaint/back/onAdmitted", kind: "foreign-callback",
    proof: ":696-:700 - onAdmitted: () => adoptAthleteState(), invoked by the import screen when a history is admitted",
    reaches: ["render", "adoptAthleteState"] },
  { file: "today-app.cjs", from: "renderMeasure", to: "<measure-screen.mjs>.paint", kind: "foreign-module",
    proof: ":653 await measureScreen.paint(root, ...) - the foreign screen's own writers are invisible here",
    reaches: [] },
  { file: "today-app.cjs", from: "renderImport", to: "<import-screen.mjs>.paint/reopen", kind: "foreign-module",
    proof: ":718-:719 importScreen.reopen(); await importScreen.paint(root, ...)", reaches: [] },
  { file: "today-app.cjs", from: "openFoodLane", to: "<food-host.mjs>", kind: "dynamic-import",
    proof: ":599-:605 await import(\"./food-host.mjs\") then createFoodHost(...); the lane's .save is that host's",
    reaches: [] },
  { file: "today-app.cjs", from: "openSleepLane", to: "<sleep-host.mjs>", kind: "dynamic-import",
    proof: ":516-:522 the same shape one seam on", reaches: [] },
  { file: "today-app.cjs", from: "settleAdoption", to: "answered", kind: "deferred",
    proof: ":788 chain.then(answered, answered) - it runs a turn later, outside any gesture",
    reaches: ["paintTodayEntry"] },
  { file: "gym-app.mjs", from: "openSettingsLane", to: "<machine-settings-host.mjs>", kind: "dynamic-import",
    proof: ":165-:166 await import(\"./machine-settings-host.mjs\") then createMachineSettingsHost(...)",
    reaches: [] },
  { file: "*", from: "<any released drawing region>", to: "on.<callback>", kind: "AFTER THE CUT",
    proof: "E.6: a callback the sealed half hands the view is, to any static reader, just a function. " +
      "No token scan and no parser can tell on.recordIntake() called from a click listener from the " +
      "same call made at the top of a render function. This instrument cannot see it either, which is " +
      "why the guard is a RUNTIME guard.", reaches: [] },
];

/* ---- the graph ---------------------------------------------------------------------- */
function analyse(file) {
  const src = fs.readFileSync(path.join(ROOT, TODAY, file), "utf8");
  const ast = acorn.parse(src, {
    ecmaVersion: 2022, sourceType: file.endsWith(".mjs") ? "module" : "script",
    locations: true, ranges: true,
  });

  /* every function node, named where a name is derivable */
  const funcs = [];          /* { name, node, start, end, line } */
  const byNode = new Map();
  const ancestorsOf = new Map();
  walk.ancestor(ast, {
    FunctionDeclaration(n, st, anc) { add(n, n.id ? n.id.name : null, anc); },
    FunctionExpression(n, st, anc) { add(n, nameFromParent(anc), anc); },
    ArrowFunctionExpression(n, st, anc) { add(n, nameFromParent(anc), anc); },
  });
  function nameFromParent(anc) {
    const p = anc[anc.length - 2];
    if (!p) return null;
    if (p.type === "VariableDeclarator" && p.id.type === "Identifier") return p.id.name;
    if (p.type === "Property" && p.key && (p.key.name || p.key.value)) return "." + (p.key.name || p.key.value);
    if (p.type === "AssignmentExpression" && p.left.type === "Identifier") return p.left.name;
    return null;
  }
  function add(n, name, anc) {
    const rec = { name: name || ("<anon@" + n.loc.start.line + ">"), node: n,
      start: n.start, end: n.end, line: n.loc.start.line, declared: !!name };
    funcs.push(rec); byNode.set(n, rec);
    ancestorsOf.set(n, anc.slice(0, -1).filter((a) => byNode.has(a)).map((a) => byNode.get(a)));
  }
  /* the MOUNT BODY is a root of its own: the statements the mount runs at construction */
  const byName = new Map();
  for (const f of funcs) if (f.declared && !byName.has(f.name)) byName.set(f.name, f);

  /* innermost enclosing function of a position */
  const sortedFuncs = funcs.slice().sort((a, b) => (b.end - b.start) - (a.end - a.start));
  function enclosing(pos) {
    let best = null;
    for (const f of funcs) {
      if (pos >= f.start && pos < f.end) {
        if (!best || (f.end - f.start) < (best.end - best.start)) best = f;
      }
    }
    return best;
  }
  void sortedFuncs;

  /* edges */
  const edges = [];       /* { from, to, kind, line } */
  const literalEdges = [];/* a function literal handed somewhere: how it will be invoked */
  const listeners = [];   /* function literals handed to addEventListener */
  const writes = [];      /* durable / store / adopt member calls */

  walk.simple(ast, {
    CallExpression(n) {
      const host = enclosing(n.start);
      const from = host ? host.name : "<module body>";
      const line = n.loc.start.line;
      /* direct call of a named function */
      if (n.callee.type === "Identifier" && byName.has(n.callee.name)) {
        edges.push({ from, to: n.callee.name, kind: "sync", line });
      }
      /* member calls: the word lists */
      if (n.callee.type === "MemberExpression" && !n.callee.computed
        && n.callee.property.type === "Identifier") {
        const prop = n.callee.property.name;
        const recv = n.callee.object.type === "Identifier" ? n.callee.object.name
          : n.callee.object.type === "MemberExpression" && n.callee.object.property.type === "Identifier"
            ? n.callee.object.property.name : "<expr>";
        const cls = PUT.has(prop) ? "PUT" : ADOPT.has(prop) ? "ADOPT" : STORE.has(prop) ? "STORE" : null;
        if (cls) {
          writes.push({ file, line, host: from, receiver: recv, property: prop, cls,
            falsePositive: NOT_A_STORE_RECEIVER.has(recv) });
        }
        /* addEventListener */
        if (prop === "addEventListener") {
          const cb = n.arguments[1];
          if (cb && byNode.has(cb)) {
            const rec = byNode.get(cb);
            listeners.push({ file, line, host: from, type: n.arguments[0] && n.arguments[0].value, fn: rec.name });
            literalEdges.push({ from, to: rec.name, kind: "listener", line });
          }
        }
        /* deferred: .then / .catch / .finally */
        if (prop === "then" || prop === "catch" || prop === "finally") {
          for (const a of n.arguments) if (a && byNode.has(a)) {
            literalEdges.push({ from, to: byNode.get(a).name, kind: "deferred", line });
          }
        }
      }
      /* a function literal in an object-literal argument: a foreign module will call it */
      for (const a of n.arguments) {
        if (a && a.type === "ObjectExpression") {
          for (const p of a.properties) {
            if (p.value && byNode.has(p.value)) {
              literalEdges.push({ from, to: byNode.get(p.value).name, kind: "foreign-callback", line });
            }
          }
        }
      }
    },
  });

  /* a nested function literal that is NOT handed anywhere is part of its host's body */
  const handed = new Set(literalEdges.map((e) => e.to));
  for (const f of funcs) {
    if (f.declared) continue;
    if (handed.has(f.name)) continue;
    const anc = ancestorsOf.get(f.node) || [];
    const host = anc.length ? anc[anc.length - 1].name : "<module body>";
    edges.push({ from: host, to: f.name, kind: "sync-literal", line: f.line });
  }
  /* the handed literals become edges of their declared kind */
  for (const e of literalEdges) edges.push(e);

  return { file, funcs, byName, edges, listeners, writes, enclosing };
}

/* ---- the walk ------------------------------------------------------------------------ */
function reach(model, roots, kinds) {
  const out = new Map();   /* name -> shortest path */
  const q = roots.map((r) => ({ name: r, path: [r] }));
  for (const r of roots) out.set(r, [r]);
  while (q.length) {
    const cur = q.shift();
    for (const e of model.edges) {
      if (e.from !== cur.name) continue;
      if (!kinds.has(e.kind)) continue;
      if (out.has(e.to)) continue;
      const p = cur.path.concat([e.kind === "sync" || e.kind === "sync-literal" ? e.to : e.to + " (" + e.kind + ")"]);
      out.set(e.to, p);
      q.push({ name: e.to, path: p });
    }
  }
  return out;
}

const SYNC = new Set(["sync", "sync-literal"]);
/* A paint INSTALLS a listener; it does not RUN it. So the `listener` edge is NOT in the
   closure a paint or a boot reaches - that distinction is the whole of the guard question.
   A deferred `.then` body and a callback a foreign module holds DO run with no gesture on
   the stack, so those are in. */
const NOGESTURE = new Set(["sync", "sync-literal", "deferred", "foreign-callback"]);
const ALL = new Set(["sync", "sync-literal", "deferred", "foreign-callback", "listener"]);

const FILES = {
  "today-app.cjs": { paint: ["render"], boot: ["mountToday"] },
  "gym-app.mjs": { paint: ["paint"], boot: ["mountGym"] },
  "today-model.cjs": { paint: [], boot: ["createTodayModel"] },
};

const result = { root: ROOT, files: {}, blind: BLIND_EDGES };
for (const [file, cfg] of Object.entries(FILES)) {
  const m = analyse(file);
  const listenerRoots = [...new Set(m.listeners.map((l) => l.fn))];
  /* the blind edges extend the paint and boot closures by hand */
  const extra = BLIND_EDGES.filter((b) => b.file === file).flatMap((b) => b.reaches);
  const paintSync = reach(m, cfg.paint, SYNC);
  const paintAll = reach(m, cfg.paint.concat(extra), NOGESTURE);
  const bootSync = reach(m, cfg.boot, SYNC);
  const bootAll = reach(m, cfg.boot.concat(extra), NOGESTURE);
  const listenSync = reach(m, listenerRoots, SYNC);
  const listenAll = reach(m, listenerRoots, ALL);

  const rows = m.writes.map((w) => ({
    ...w,
    paint: paintSync.has(w.host) ? "SYNC" : paintAll.has(w.host) ? "async/callback" : "-",
    boot: bootSync.has(w.host) ? "SYNC" : bootAll.has(w.host) ? "async/callback" : "-",
    listener: listenSync.has(w.host) ? "SYNC" : listenAll.has(w.host) ? "async/callback" : "-",
    paintPath: paintSync.get(w.host) || paintAll.get(w.host) || null,
  }));
  result.files[file] = {
    functions: m.funcs.length, edges: m.edges.length, listeners: m.listeners.length,
    listenerRoots, writes: rows,
  };
}

if (JSONOUT) fs.writeFileSync(JSONOUT, JSON.stringify(result, null, 1));

const L = [];
L.push("# REACH - what a paint root, a boot and a listener actually reach");
L.push("");
L.push("Worktree: `" + ROOT + "`. Measured by acorn 8 over the UNCUT source.");
L.push("");
L.push("PUT = it may put a row of the athlete's on disk. STORE = it reaches a store and stores");
L.push("nothing. ADOPT = it replaces an in-memory basis or moves a gate (F.2: not durable).");
L.push("The three columns say whether the PAINT entry, the MOUNT BODY (the boot) or a LISTENER");
L.push("reaches the function the call sits in: SYNC through plain calls only, `async/callback`");
L.push("only through a deferred `.then`, a foreign callback or a listener edge.");
L.push("");
for (const [file, r] of Object.entries(result.files)) {
  L.push("## `" + file + "`  (" + r.functions + " functions, " + r.edges + " edges, " +
    r.listeners + " listener installations)");
  L.push("");
  L.push("| line | call | class | sits in | paint | boot | listener |");
  L.push("|---|---|---|---|---|---|---|");
  for (const w of r.writes.sort((a, b) => a.line - b.line)) {
    L.push("| `:" + w.line + "` | `" + w.receiver + "." + w.property + "()` | " +
      w.cls + (w.falsePositive ? " (not a store: false positive)" : "") + " | `" + w.host + "` | " +
      w.paint + " | " + w.boot + " | " + w.listener + " |");
  }
  L.push("");
}
L.push("## What a static call graph cannot see");
L.push("");
L.push("| file | edge | kind | the line that proves it |");
L.push("|---|---|---|---|");
for (const b of BLIND_EDGES) {
  L.push("| `" + b.file + "` | `" + b.from + "` -> `" + b.to + "` | " + b.kind + " | " + b.proof + " |");
}
L.push("");
if (MD) fs.writeFileSync(MD, L.join("\n") + "\n");

/* the console answer to S-R12 */
console.log("REACH over " + ROOT);
for (const [file, r] of Object.entries(result.files)) {
  const puts = r.writes.filter((w) => w.cls === "PUT" && !w.falsePositive);
  const paintReached = puts.filter((w) => w.paint !== "-");
  console.log("  " + file + ": " + puts.length + " PUT call sites, " +
    r.writes.filter((w) => w.cls === "STORE").length + " STORE, " +
    r.writes.filter((w) => w.cls === "ADOPT").length + " ADOPT");
  for (const w of paintReached) {
    console.log("    PAINT REACHES A DURABLE PUT: " + file + ":" + w.line + "  " +
      w.receiver + "." + w.property + "()  in " + w.host + "  [paint " + w.paint +
      ", boot " + w.boot + ", listener " + w.listener + "]");
  }
}
