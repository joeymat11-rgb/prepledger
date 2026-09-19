#!/usr/bin/env node
/* blind.cjs - THE BLIND-EDGE TABLE, RE-DERIVED (S-R24).
 *
 * reach.cjs carries its blind-edge table as a HAND-WRITTEN constant: twelve rows a reader
 * typed. R3 found a thirteenth by reading (today-app.cjs:2080, a closure handed to
 * today-entry.mjs through setOnRefresh, which reads the released `screen` and calls the
 * released `render` with no paint, no boot and no gesture on the stack) and a fourteenth
 * beside it (the dynamic import at :2058 that mints the holder). A table a hand types is a
 * table the next hand has to re-read. The PM's answer, S-R24: the blind-edge table is a list
 * the build RE-DERIVES, not one it copies.
 *
 * This derives it. Three classes, each a shape in the syntax and not a name in a list:
 *
 *   dynamic-import    an import() with a literal source. Everything on the other side of it
 *                     is a module this instrument never opens.
 *   foreign-callback  a function literal, or an object literal carrying function literals,
 *                     handed to a call whose callee this file does NOT declare. The foreign
 *                     side holds it and invokes it whenever it likes, so no stack this
 *                     instrument can walk contains it.
 *   deferred          a NAMED function handed to .then / .catch / .finally. It runs a turn
 *                     later, outside whatever gesture started it.
 *
 * Usage: node blind.cjs --root <worktree> [--md BLIND.md] [--json blind.json]
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
const table = JSON.parse(fs.readFileSync(opt("regions", path.join(__dirname, "regions.json")), "utf8"));
if (!ROOT) { console.error("usage: blind.cjs --root <worktree>"); process.exit(2); }

const isFn = (n) => n && (n.type === "ArrowFunctionExpression" || n.type === "FunctionExpression");
const resolveAnchors = require("./resolve.cjs");

function regionsOf(file, lines) {
  return (table.files[file] || []).map((r) => {
    const { start, end } = resolveAnchors(lines, r, file, (m) => { console.error("REFUSED: " + m); process.exit(1); });
    return { id: r.id, kind: r.kind, start, end };
  });
}

const rows = [];
for (const file of Object.keys(table.files)) {
  const src = fs.readFileSync(path.join(ROOT, table.today, file), "utf8");
  const lines = src.split("\n");
  const regions = regionsOf(file, lines);
  const at = (line) => {
    const r = regions.find((x) => line >= x.start && line <= x.end);
    return r ? r.id + " (" + r.kind + ")" : "RELEASED body";
  };
  const ast = acorn.parse(src, { ecmaVersion: 2022, locations: true,
    sourceType: file.endsWith(".mjs") ? "module" : "script" });

  /* Every function this file DECLARES, by name, so a call to one of them is not foreign. */
  const local = new Set();
  walk.full(ast, (n) => {
    if (n.type === "FunctionDeclaration" && n.id) local.add(n.id.name);
    if (n.type === "VariableDeclarator" && n.id.type === "Identifier" && isFn(n.init)) local.add(n.id.name);
  });

  walk.full(ast, (n) => {
    if (n.type === "ImportExpression") {
      const s = n.source && n.source.type === "Literal" ? String(n.source.value) : "<computed>";
      rows.push({ file, line: n.loc.start.line, kind: "dynamic-import", edge: s,
        region: at(n.loc.start.line),
        proof: lines[n.loc.start.line - 1].trim().slice(0, 120) });
      return;
    }
    if (n.type !== "CallExpression") return;
    const callee = n.callee;
    let calleeName = null, foreign = true;
    if (callee.type === "Identifier") { calleeName = callee.name; foreign = !local.has(callee.name); }
    else if (callee.type === "MemberExpression" && callee.property.type === "Identifier") {
      calleeName = (callee.object.type === "Identifier" ? callee.object.name + "." : "") + callee.property.name;
      /* A member call is foreign unless the receiver is a local function's own result; this
         instrument cannot know that, so a member call counts as foreign and the deferred
         class below is the one that catches .then. */
      foreign = true;
    }
    if (!calleeName) return;

    const prop = callee.type === "MemberExpression" && callee.property.type === "Identifier"
      ? callee.property.name : null;
    if (prop === "then" || prop === "catch" || prop === "finally") {
      /* A NAMED function handed to .then is the sharpest case: it is written somewhere else
         in the file and it runs a turn later. An INLINE literal runs a turn later too, and
         is counted separately because it cannot be reached from anywhere but here. */
      const named = n.arguments.filter((a) => a.type === "Identifier");
      if (named.length) {
        rows.push({ file, line: n.loc.start.line, kind: "deferred",
          edge: calleeName + "(" + named.map((a) => a.name).join(", ") + ")",
          region: at(n.loc.start.line),
          proof: lines[n.loc.start.line - 1].trim().slice(0, 120) });
      } else if (n.arguments.some(isFn)) {
        rows.push({ file, line: n.loc.start.line, kind: "deferred-continuation",
          edge: calleeName + "(<inline>)", region: at(n.loc.start.line),
          proof: lines[n.loc.start.line - 1].trim().slice(0, 120) });
      }
      return;
    }
    if (!foreign) return;
    const handed = [];
    for (const a of n.arguments) {
      if (isFn(a)) handed.push("<function literal>");
      else if (a.type === "ObjectExpression") {
        for (const p of a.properties) {
          if (p.type === "Property" && isFn(p.value) && p.key.type === "Identifier") handed.push(p.key.name);
        }
      }
    }
    if (!handed.length) return;
    rows.push({ file, line: n.loc.start.line, kind: "foreign-callback",
      edge: calleeName + " <- " + handed.join(", "),
      region: at(n.loc.start.line),
      proof: lines[n.loc.start.line - 1].trim().slice(0, 120) });
  });
}

/* Calls to the language's own higher-order helpers are not foreign holders: a map, a filter,
   a sort and a forEach run their callback before the expression finishes. Naming them here
   rather than in the walk keeps the rule visible. */
const NOT_A_HOLDER = /^(?:[A-Za-z_$][\w$]*\.)?(map|filter|forEach|sort|find|findIndex|some|every|reduce|flatMap|replace|replaceAll|matchAll|assign|freeze|defineProperty|from|keys|values|entries|addEventListener|removeEventListener|setTimeout|setInterval|queueMicrotask|requestAnimationFrame)$/;
const kept = rows.filter((r) => !(r.kind === "foreign-callback" && NOT_A_HOLDER.test(r.edge.split(" <- ")[0])));

const byKind = {};
for (const r of kept) byKind[r.kind] = (byKind[r.kind] || 0) + 1;
kept.sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : a.line - b.line));

if (JSONOUT) fs.writeFileSync(JSONOUT, JSON.stringify({ root: ROOT, byKind, rows: kept }, null, 1));
if (MD) {
  const L = ["# BLIND EDGES - re-derived, not copied (S-R24)", "",
    "Every row below is a SHAPE in the syntax, found by walking the three files, not a name a",
    "hand put in a list. reach.cjs's own twelve-row table is a constant inside that script; this",
    "is the derivation S-R24 rules, and the delta between the two is printed by the build report.",
    "", "Worktree: `" + ROOT + "`", "",
    "| rows | " + Object.entries(byKind).map(([k, v]) => k + " " + v).join(" | ") + " |",
    "|---|" + Object.keys(byKind).map(() => "---|").join(""), "| " + kept.length + " |" +
      Object.values(byKind).map((v) => " " + v + " |").join(""), "",
    "| file | line | class | edge | region after the cut | the line that proves it |",
    "|---|---|---|---|---|---|"];
  for (const r of kept) {
    L.push("| `" + r.file + "` | `:" + r.line + "` | " + r.kind + " | `" + r.edge + "` | " +
      r.region + " | `" + r.proof.replace(/\|/g, "\\|") + "` |");
  }
  fs.writeFileSync(MD, L.join("\n") + "\n");
}
console.log("BLIND EDGES re-derived over " + ROOT);
console.log("  rows: " + kept.length + "  (" + Object.entries(byKind).map(([k, v]) => k + " " + v).join(", ") + ")");
for (const r of kept) {
  console.log("    " + r.file.padEnd(16) + ":" + String(r.line).padStart(4) + "  " +
    r.kind.padEnd(17) + r.region.padEnd(20) + r.edge.slice(0, 70));
}
