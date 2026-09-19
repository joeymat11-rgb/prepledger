#!/usr/bin/env node
/* census.cjs - THE MACHINE CENSUS (S-R17 (c)).
 *
 * Two rounds of a HAND census of closure bindings each missed crossings the next reviewer
 * found by reading. This is the same census done by scope analysis instead.
 *
 * The measurement: parse each of the codemod's six OUTPUT files, build its scope tree, and
 * take every reference that RESOLVES TO NOTHING inside that file. Minus the language's own
 * globals, every one of those is a CROSSING: a name one half of the cut uses and the other
 * half declares. The table gives, per crossing: the file it sits in, its line in the SOURCE
 * (through the codemod's linemap), the name, whether it is READ, WRITTEN, UPDATED or CALLED,
 * the region it sits in, and the region that declares it.
 *
 * The declaration index is built from the UNCUT source by the same scope analysis, so
 * "the region that declares it" is a measurement and not a lookup in the spec.
 *
 * Usage:
 *   node census.cjs --root <worktree> --out <cut output dir> [--md CROSSINGS.md] [--json CROSSINGS.json]
 */
"use strict";
const fs = require("fs");
const path = require("path");

const INSTR = process.env.CENSUS_INSTRUMENT || "/home/claude/farm/tools/census/node_modules";
const acorn = require(path.join(INSTR, "acorn"));
const walk = require(path.join(INSTR, "acorn-walk"));
const escope = require(path.join(INSTR, "eslint-scope"));

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 ? argv[i + 1] : d; };
const ROOT = opt("root");
const OUT = opt("out");
const MD = opt("md");
const JSONOUT = opt("json");
if (!ROOT || !OUT) { console.error("usage: census.cjs --root <worktree> --out <cut dir>"); process.exit(2); }

const table = JSON.parse(fs.readFileSync(path.join(__dirname, "regions.json"), "utf8"));
const TODAY = table.today;
const linemap = JSON.parse(fs.readFileSync(path.join(OUT, "linemap.json"), "utf8"));

/* The language's own globals, plus the two the page legitimately reaches. Anything on this
   list is NOT a crossing; anything off it is. The list is stated here so a reader can
   disagree with it in one place. */
const GLOBALS = new Set([
  "Object", "Array", "String", "Number", "Boolean", "Symbol", "Math", "JSON", "Date",
  "RegExp", "Error", "TypeError", "RangeError", "Promise", "Map", "Set", "WeakMap",
  "WeakSet", "Proxy", "Reflect", "Intl", "globalThis", "undefined", "NaN", "Infinity",
  "isNaN", "isFinite", "parseInt", "parseFloat", "encodeURIComponent", "decodeURIComponent",
  "console", "require", "module", "exports", "__dirname", "__filename", "process",
  "setTimeout", "clearTimeout", "setInterval", "clearInterval", "queueMicrotask",
  "URL", "URLSearchParams", "TextEncoder", "TextDecoder", "structuredClone", "Function",
  "arguments", "Array$", "AggregateError", "BigInt",
]);

function parse(file, src) {
  const module_ = file.endsWith(".mjs");
  const ast = acorn.parse(src, {
    ecmaVersion: 2022, sourceType: module_ ? "module" : "script",
    locations: true, ranges: true, allowAwaitOutsideFunction: false, allowReturnOutsideFunction: false,
  });
  const manager = escope.analyze(ast, {
    ecmaVersion: 2022, sourceType: module_ ? "module" : "script",
    nodejsScope: !module_, ignoreEval: true,
  });
  return { ast, manager, module_ };
}

/* Callee identifiers, so a crossing can be reported as CALL rather than READ. */
function calleeLines(ast) {
  const set = new Set();
  walk.simple(ast, {
    CallExpression(n) { if (n.callee.type === "Identifier") set.add(n.callee.start); },
    NewExpression(n) { if (n.callee.type === "Identifier") set.add(n.callee.start); },
  });
  return set;
}

/* ---- the declaration index, from the UNCUT source ---------------------------------- */
function regionsOf(file) { return table.files[file] || []; }
function resolveRegions(file, lines) {
  const out = [];
  for (const r of regionsOf(file)) {
    const hits = [];
    for (let i = 0; i < lines.length; i += 1) if (lines[i] === r.first.text) hits.push(i + 1);
    const start = hits[r.first.nth - 1];
    let seen = 0, end = -1;
    for (let i = start - 1; i < lines.length; i += 1) {
      if (lines[i] === r.last.text) { seen += 1; if (seen === r.last.nthFrom) { end = i + 1; break; } }
    }
    out.push({ ...r, start, end });
  }
  return out;
}
function regionAt(regions, line) {
  for (const r of regions) if (line >= r.start && line <= r.end) return r;
  return null;
}

const declIndex = {};   /* file -> name -> { line, scopeKind, region, dest } */
const srcRegions = {};
for (const file of Object.keys(table.files)) {
  const src = fs.readFileSync(path.join(ROOT, TODAY, file), "utf8");
  const lines = src.split("\n");
  const regions = resolveRegions(file, lines);
  srcRegions[file] = regions;
  const { manager } = parse(file, src);
  const index = {};
  for (const scope of manager.scopes) {
    for (const v of scope.variables) {
      if (!v.defs.length) continue;
      const d = v.defs[0];
      const line = d.name.loc.start.line;
      const r = regionAt(regions, line);
      const prev = index[v.name];
      const row = {
        line, scopeKind: scope.type,
        /* With nodejsScope a .cjs file's top level is a FUNCTION scope whose block is the
           Program node (the CommonJS wrapper). That is module level, not a closure. */
        functionName: (scope.type === "module" || scope.type === "global"
          || (scope.block && scope.block.type === "Program")) ? "<module>"
          : (scope.block && scope.block.id ? scope.block.id.name : "<anonymous>"),
        region: r ? r.id : null,
        dest: r ? (r.kind === "move" ? "SEALED:" + r.dest : "SEAM:" + r.id) : "RELEASED",
      };
      /* Keep the declaration the cut can strand: a declaration INSIDE a region wins over
         one outside it (a same-named parameter of an unrelated top-level helper), and
         otherwise the outermost wins. */
      const depth = scopeDepth(scope);
      const better = !prev || (r && !prev._region) || (!!r === !!prev._region && depth < prev._depth);
      if (better) index[v.name] = Object.assign(row, { _depth: depth, _region: !!r });
    }
  }
  declIndex[file] = index;
}
function scopeDepth(scope) { let d = 0, s = scope; while (s.upper) { d += 1; s = s.upper; } return d; }

/* ---- the census over the OUTPUT ------------------------------------------------------ */
const OUTPUT_PAIRS = [
  ["today-app.cjs", "today-lanes.cjs", "today-app.cjs"],
  ["today-lanes.cjs", "today-app.cjs", "today-app.cjs"],
  ["gym-app.mjs", "gym-settings-lane.mjs", "gym-app.mjs"],
  ["gym-settings-lane.mjs", "gym-app.mjs", "gym-app.mjs"],
  ["today-model.cjs", "today-readings.cjs", "today-model.cjs"],
  ["today-readings.cjs", "today-model.cjs", "today-model.cjs"],
];

const crossings = [];
const unexplained = [];
for (const [outFile, partner, srcFile] of OUTPUT_PAIRS) {
  const p = path.join(OUT, outFile);
  if (!fs.existsSync(p)) continue;
  const src = fs.readFileSync(p, "utf8");
  const { ast, manager } = parse(outFile, src);
  const callees = calleeLines(ast);
  const map = linemap[outFile];
  const globalScope = manager.globalScope;
  const seen = new Set();
  for (const ref of globalScope.through) {
    const name = ref.identifier.name;
    if (GLOBALS.has(name)) continue;
    const outLine = ref.identifier.loc.start.line;
    const where = map[outLine - 1] || null;
    const kind = ref.isWriteOnly() ? "write" : ref.isReadWrite() ? "update"
      : callees.has(ref.identifier.start) ? "call" : "read";
    const decl = declIndex[srcFile][name] || null;
    const sitsIn = where && where.region ? where.region
      : (where ? regionIdAt(srcFile, where.line) : null);
    const row = {
      outFile, name, kind,
      sourceFile: where ? where.file : null,
      sourceLine: where ? where.line : null,
      sitsIn: sitsIn || "RELEASED-body",
      declaredIn: decl ? decl.region : null,
      declaredAt: decl ? decl.line : null,
      declaredDest: decl ? decl.dest : "NOT-DECLARED-IN-THIS-FILE",
      declScope: decl ? decl.functionName : null,
    };
    const key = [outFile, name, kind, row.sourceLine].join("|");
    if (seen.has(key)) continue;
    seen.add(key);
    if (!decl) { unexplained.push(row); continue; }
    crossings.push(row);
  }
}
function regionIdAt(file, line) {
  const r = regionAt(srcRegions[file] || [], line);
  return r ? r.id : null;
}

/* ---- classify ------------------------------------------------------------------------ */
for (const c of crossings) {
  const sealedSide = c.outFile.endsWith("lanes.cjs") || c.outFile.endsWith("lane.mjs") || c.outFile.endsWith("readings.cjs");
  c.direction = sealedSide ? "SEALED -> RELEASED" : "RELEASED -> SEALED";
  c.moduleLevel = c.declScope === "<module>";
  c.class = c.moduleLevel ? "module-constant (a require or a copy constant: the sealed module re-requires it)"
    : c.direction === "RELEASED -> SEALED"
      ? (c.kind === "write" || c.kind === "update" ? "RELEASED ASSIGNS A SEALED BINDING"
        : c.kind === "call" ? "released calls a sealed function" : "released reads a sealed binding")
      : (c.kind === "write" || c.kind === "update" ? "SEALED ASSIGNS A RELEASED BINDING"
        : c.kind === "call" ? "sealed calls a released function" : "sealed reads a released binding");
}

/* ---- output -------------------------------------------------------------------------- */
const byClass = {};
for (const c of crossings) byClass[c.class] = (byClass[c.class] || 0) + 1;
const names = {};
for (const c of crossings) {
  const k = c.direction + " | " + c.name;
  (names[k] = names[k] || []).push(c);
}

const summary = {
  root: ROOT, out: OUT,
  crossings: crossings.length,
  distinctNames: Object.keys(names).length,
  byClass,
  unexplained: unexplained.length,
  unexplainedNames: [...new Set(unexplained.map((u) => u.name))].sort(),
};
if (JSONOUT) fs.writeFileSync(JSONOUT, JSON.stringify({ summary, crossings, unexplained }, null, 1));

if (MD) {
  const L = [];
  L.push("# CROSSINGS - the machine census over the codemod's output");
  L.push("");
  L.push("Measured by scope analysis (acorn 8 + eslint-scope 8) over the six files `cut.cjs`");
  L.push("writes. A row is a reference that resolves to no declaration in the file it sits in:");
  L.push("the cut stranded it, so it is a crossing and the interface has to carry it.");
  L.push("");
  L.push("Worktree: `" + ROOT + "`");
  L.push("");
  L.push("| crossings | distinct names | unresolved and not declared in the source file either |");
  L.push("|---|---|---|");
  L.push("| " + crossings.length + " | " + Object.keys(names).length + " | " + unexplained.length + " |");
  L.push("");
  L.push("## By class");
  L.push("");
  L.push("| class | rows |");
  L.push("|---|---|");
  for (const [k, v] of Object.entries(byClass).sort((a, b) => b[1] - a[1])) L.push("| " + k + " | " + v + " |");
  L.push("");
  for (const dir of ["RELEASED -> SEALED", "SEALED -> RELEASED"]) {
    L.push("## " + dir);
    L.push("");
    L.push("| name | kind | source | sits in | declared in | declared at |");
    L.push("|---|---|---|---|---|---|");
    const rows = crossings.filter((c) => c.direction === dir && !c.moduleLevel)
      .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : a.sourceLine - b.sourceLine));
    for (const c of rows) {
      L.push("| `" + c.name + "` | " + c.kind + " | `" + c.sourceFile + ":" + c.sourceLine + "` | " +
        c.sitsIn + " | " + (c.declaredIn || "RELEASED body") + " | `:" + c.declaredAt + "` |");
    }
    L.push("");
    const mod = crossings.filter((c) => c.direction === dir && c.moduleLevel);
    if (mod.length) {
      L.push("### module-level names the sealed half must re-require (" + mod.length + " references, " +
        new Set(mod.map((m) => m.name)).size + " names)");
      L.push("");
      L.push("`" + [...new Set(mod.map((m) => m.name))].sort().join("`, `") + "`");
      L.push("");
    }
  }
  if (unexplained.length) {
    L.push("## Unresolved AND not declared in the source file (the instrument's own residue)");
    L.push("");
    L.push("`" + summary.unexplainedNames.join("`, `") + "`");
    L.push("");
  }
  fs.writeFileSync(MD, L.join("\n") + "\n");
}

console.log("CENSUS over " + OUT);
console.log("  crossings: " + crossings.length + " references, " + Object.keys(names).length + " distinct direction+name");
for (const [k, v] of Object.entries(byClass).sort((a, b) => b[1] - a[1])) console.log("    " + String(v).padStart(4) + "  " + k);
if (unexplained.length) console.log("  unresolved and not declared in the source file either: " +
  unexplained.length + " (" + summary.unexplainedNames.join(", ") + ")");
