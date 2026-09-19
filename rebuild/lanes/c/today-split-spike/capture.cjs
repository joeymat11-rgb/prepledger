#!/usr/bin/env node
/* capture.cjs - THE FOURTH INSTRUMENT (S-R23).
 *
 * census.cjs measures references that resolve to NOTHING in the output file. This measures
 * the silent twin: a reference that STILL resolves, but to a DIFFERENT declaration than it
 * resolved to in the source. That is name capture. `node --check` passes, the census is
 * quiet, and the binding has changed underneath the code.
 *
 * R3 wrote the first one of these and reported ZERO captures at both refs, which is a result
 * in the cut's favour and the reason it is kept: once the interface EXISTS - a facade, a
 * callback table and a paint handle declared at factory scope - a moved region that happens
 * to declare the same name shadows the table for the length of that scope, and neither
 * census.cjs (a shadowed reference resolves locally, so it is not a crossing) nor a token
 * scan can see it. R3 found exactly that with the spec's own chosen name: `on` occurs in
 * code position twice at today-app.cjs:2027-:2028, inside the MOVE region TA-S33.
 *
 * This is written from that description, not copied: it runs on ANY output directory, it
 * lives without a line map, it takes its pairs from regions.json's own `dest` map instead of
 * six hard-wired file names, and it carries the NAME CENSUS the interface names are chosen
 * by (S-R23), which R3's did not have.
 *
 * Usage:
 *   node capture.cjs --root <uncut worktree> --out <dir of output files>
 *                    [--pairs out.cjs=src.cjs,...]   override the pairs
 *                    [--names facade,on,painter]     the NAME CENSUS: occurrences in CODE
 *                                                    POSITION, per output file
 *
 * A directory with no linemap.json (the build's own output, for instance) runs in NO-MAP
 * mode: the capture comparison needs a line map and says so, and the name census does not.
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
const NAMES = (opt("names", "") || "").split(",").map((s) => s.trim()).filter(Boolean);
const REGIONS = opt("regions", path.join(__dirname, "regions.json"));
if (!OUT) { console.error("usage: capture.cjs --root <worktree> --out <dir> [--names a,b,c]"); process.exit(2); }

const table = JSON.parse(fs.readFileSync(REGIONS, "utf8"));

/* ---- the pairs, DERIVED (S-R23, NOTE-2) ---------------------------------------------
 * census.cjs and this instrument both used to carry a hard-coded list of the six filenames
 * cut.cjs writes, so neither could be pointed at the build round's own output, which H.2
 * STOP 11 and H.3 both require. The pairs are the table's own `dest` map: each source file
 * pairs with itself (the released half keeps its name) and with its destination.            */
function defaultPairs() {
  const out = [];
  for (const [src, dest] of Object.entries(table.dest)) { out.push([src, src]); out.push([dest, src]); }
  return out;
}
const PAIRS = opt("pairs", null)
  ? opt("pairs").split(",").map((s) => s.split("=").map((x) => x.trim()))
  : defaultPairs();

function analyse(file, src) {
  const module_ = file.endsWith(".mjs");
  const ast = acorn.parse(src, { ecmaVersion: 2022, sourceType: module_ ? "module" : "script",
    locations: true, ranges: true });
  const manager = escope.analyze(ast, { ecmaVersion: 2022, sourceType: module_ ? "module" : "script",
    nodejsScope: !module_, ignoreEval: true });
  const refs = [];
  for (const scope of manager.scopes) {
    for (const ref of scope.references) {
      const v = ref.resolved;
      refs.push({ name: ref.identifier.name, line: ref.identifier.loc.start.line,
        start: ref.identifier.start,
        declLine: v && v.defs.length ? v.defs[0].name.loc.start.line : null });
    }
  }
  refs.sort((a, b) => a.start - b.start);
  return { ast, refs };
}

/* ---- THE NAME CENSUS (S-R23) ---------------------------------------------------------
 * A name is FREE for an interface object only if it occurs in CODE POSITION nowhere in any
 * output file: a property key (`{ on: ... }`) and a non-computed member name (`x.on`) cannot
 * shadow anything, an identifier in code position can. This is the measurement B.3 asserted
 * and got wrong.                                                                            */
function codePositionHits(ast, names, map) {
  const want = new Set(names);
  const hits = { code: [], key: [], member: [], wrapper: [] };
  const keyStarts = new Set();
  const memberStarts = new Set();
  walk.full(ast, (n) => {
    if (n.type === "Property" && !n.computed && n.key && n.key.type === "Identifier") keyStarts.add(n.key.start);
    if (n.type === "MemberExpression" && !n.computed && n.property && n.property.type === "Identifier") {
      memberStarts.add(n.property.start);
    }
    if (n.type === "MethodDefinition" && !n.computed && n.key && n.key.type === "Identifier") keyStarts.add(n.key.start);
  });
  walk.full(ast, (n) => {
    if (n.type !== "Identifier" || !want.has(n.name)) return;
    const row = { name: n.name, line: n.loc.start.line };
    if (keyStarts.has(n.start)) hits.key.push(row);
    else if (memberStarts.has(n.start)) hits.member.push(row);
    /* A line the codemod GENERATED - the factory's own parameter list - is the interface
       itself, not a name the source already used. It is counted separately or the census
       would report every interface name as colliding with itself. */
    else if (map && !(map[row.line - 1] && map[row.line - 1].line)) hits.wrapper.push(row);
    else hits.code.push(row);
  });
  return hits;
}

const files = [...new Set(PAIRS.map((p) => p[0]))];
const parsed = {};
for (const f of files) {
  const p = path.join(OUT, f);
  if (!fs.existsSync(p)) continue;
  parsed[f] = analyse(f, fs.readFileSync(p, "utf8"));
}

const NAME_MAP = fs.existsSync(path.join(OUT, "linemap.json"))
  ? JSON.parse(fs.readFileSync(path.join(OUT, "linemap.json"), "utf8")) : {};
if (NAMES.length) {
  console.log("NAME CENSUS over " + OUT + "  (S-R23: a name is free only at ZERO in code position)");
  const total = {};
  for (const n of NAMES) total[n] = { code: 0, key: 0, member: 0, wrapper: 0, where: [] };
  for (const f of files) {
    if (!parsed[f]) continue;
    const h = codePositionHits(parsed[f].ast, NAMES, NAME_MAP[f]);
    for (const kind of ["code", "key", "member", "wrapper"]) {
      for (const r of h[kind]) {
        total[r.name][kind] += 1;
        if (kind === "code") total[r.name].where.push(f + ":" + r.line);
      }
    }
  }
  console.log("  | name | CODE POSITION | property key | member name | the wrapper's own | free? |");
  console.log("  |---|---|---|---|---|---|");
  for (const n of NAMES) {
    const t = total[n];
    console.log("  | " + n + " | " + t.code + " | " + t.key + " | " + t.member + " | " + t.wrapper + " | " +
      (t.code === 0 ? "FREE" : "NOT FREE: " + t.where.slice(0, 6).join(" ")) + " |");
  }
}

/* ---- the capture comparison ----------------------------------------------------------- */
if (!ROOT) { if (!NAMES.length) console.error("capture: --root is needed for the capture comparison"); process.exit(0); }
const mapPath = path.join(OUT, "linemap.json");
if (!fs.existsSync(mapPath)) {
  console.log("CAPTURE CHECK over " + OUT);
  console.log("  NO LINE MAP in this directory, so a reference cannot be carried back to a");
  console.log("  source line and the capture comparison is not run. The name census above is.");
  process.exit(0);
}
const linemap = JSON.parse(fs.readFileSync(mapPath, "utf8"));

function keyedSource(refs) {
  const out = new Map();
  const seen = new Map();
  for (const r of refs) {
    const k = r.line + "|" + r.name;
    const n = seen.get(k) || 0; seen.set(k, n + 1);
    out.set(k + "|" + n, r.declLine);
  }
  return out;
}
const srcKeys = {};
for (const f of Object.keys(table.files)) {
  const p = path.join(ROOT, table.today, f);
  if (!fs.existsSync(p)) continue;
  srcKeys[f] = keyedSource(analyse(f, fs.readFileSync(p, "utf8")).refs);
}

let checked = 0, stranded = 0;
const captures = [];
for (const [outFile, srcFile] of PAIRS) {
  if (!parsed[outFile] || !srcKeys[srcFile] || !linemap[outFile]) continue;
  const map = linemap[outFile];
  const seen = new Map();
  for (const r of parsed[outFile].refs) {
    const where = map[r.line - 1];
    if (!where || !where.line) continue;            /* wrapper, comment, WIRE or REPLACE line */
    const k = where.line + "|" + r.name;
    const n = seen.get(k) || 0; seen.set(k, n + 1);
    const srcDecl = srcKeys[srcFile].get(k + "|" + n);
    if (srcDecl === undefined) continue;
    checked += 1;
    if (r.declLine === null) { stranded += 1; continue; }        /* census.cjs's rows */
    const dwhere = map[r.declLine - 1];
    if (!dwhere || !dwhere.line) continue;                       /* resolved to a wrapper name */
    if (dwhere.line !== srcDecl) {
      captures.push({ outFile, name: r.name, sourceLine: where.line,
        was: srcDecl, now: dwhere.line });
    }
  }
}
console.log("CAPTURE CHECK over " + OUT);
console.log("  references compared: " + checked + "; stranded (census.cjs's rows): " + stranded);
console.log("  NAME CAPTURES (resolves to a different declaration after the cut): " + captures.length);
for (const c of captures.slice(0, 40)) {
  console.log("    " + c.outFile + "  " + c.name + "  at source :" + c.sourceLine +
    "  was :" + c.was + "  now :" + c.now);
}
if (captures.length) process.exitCode = 1;
