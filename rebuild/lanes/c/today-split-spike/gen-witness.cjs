#!/usr/bin/env node
/* gen-witness.cjs - THE WITNESS GENERATOR (S-R19, S-R20).
 *
 * R3's finding, which the PM adopted whole: A GENERATOR CANNOT BE ITS OWN CHECK. cut.cjs
 * constructs the moved bytes by slicing the source, so "the moved bytes equal the source
 * bytes" is true by construction of whatever tree it is pointed at. It was true of a tree
 * with two thirds of the sleep writer's double-write fence removed.
 *
 * The missing thing is a reference point recorded OUTSIDE the run. This takes it: for every
 * region cut.cjs would MOVE or REPLACE, the sha256 of its bytes and its line count, at a
 * NAMED ref, plus the per-file moved-line total at that ref. cut.cjs then compares before it
 * substitutes anything and refuses BY REGION ID.
 *
 * The same content-anchored table serves the chain tip and the S9 lane head, and the two
 * differ (one line in today-app.cjs below :869, and the plan-sentence block in
 * today-model.cjs), so the witness is a MAP of ref name to digest and a region may be
 * witnessed at several refs. cut.cjs accepts a region whose bytes match ANY witnessed ref,
 * and requires every region of one file to agree on the SAME ref.
 *
 * THE DECLARED TEXT (--declared, R1 NOTE-1). The witness above is taken on the PRE-IMAGE.
 * R1 showed the post-image was still unwitnessed: rewriting a substitution row's `to` so the
 * sealed weigh-in reports success whatever the client answered left every moved byte verbatim
 * and the cut exited 0. So --declared records a sha256 per substitution row and per
 * replacement row, and the two row counts. It is not tied to a --ref, because a declaration
 * has no ref: it is authored text, and this is TAMPER EVIDENCE over it, not an oracle. Taking
 * it is a declared act whose result is a one-line-per-row diff in regions.json.
 *
 * Usage:
 *   node gen-witness.cjs --root <worktree> --ref-name tip --ref <sha> --branch <name>
 *                        [--regions regions.json] [--write] [--taken 2026-09-19]
 *   node gen-witness.cjs --declared [--regions regions.json] [--write] [--taken 2026-09-19]
 *
 * Without --write it prints what it would record and changes nothing.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf("--" + n); return i >= 0 ? argv[i + 1] : d; };
const ROOT = opt("root");
const REF_NAME = opt("ref-name");
const REF = opt("ref");
const BRANCH = opt("branch", "");
const TAKEN = opt("taken", new Date().toISOString().slice(0, 10));
const REGIONS = opt("regions", path.join(__dirname, "regions.json"));
const WRITE = argv.includes("--write");
const DECLARED_ONLY = argv.includes("--declared");
if (!DECLARED_ONLY && (!ROOT || !REF_NAME || !REF)) {
  console.error("usage: gen-witness.cjs --root <worktree> --ref-name <name> --ref <sha> [--branch <b>] [--write]");
  console.error("   or: gen-witness.cjs --declared [--write]");
  process.exit(2);
}

const resolveRegion = require("./resolve.cjs");

const table = JSON.parse(fs.readFileSync(REGIONS, "utf8"));
const TODAY = table.today;
const WITNESSED = new Set(["move", "replace"]);

const sha256 = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex");

/* ---- --declared: the DECLARED-TEXT witness (R1 NOTE-1) -------------------------------
 * The canonical serialization is the row's own identity and its two texts, and nothing
 * else: a row's `why`, its note and the order of the rows in the file are free to change
 * without re-taking the witness, and the bytes that reach a product file are not. These
 * two functions are duplicated verbatim in cut.cjs on purpose: the checker must not import
 * its digest from the generator, or the generator is its own check again.                */
function declaredSubSha(row) {
  return sha256(JSON.stringify([row.id, row.file, row.region, row.from, row.to, row.kind || null]));
}
function declaredRepSha(file, r) {
  return sha256(JSON.stringify([r.id, file, r.replacement]));
}
if (DECLARED_ONLY) {
  const witness = table.witness || { refs: [], regions: {}, movedLines: {} };
  const declared = { taken: TAKEN, note:
    "R1 NOTE-1. sha256 per substitution row and per replacement row, over [id, file, region, " +
    "from, to, kind] and [id, file, replacement]. TAMPER EVIDENCE over authored text, not an " +
    "independent oracle: re-taking it re-blesses, and the control is that re-taking it is a " +
    "visible diff here, beside the row it blesses.",
    substitutions: {}, replacements: {}, counts: { substitutions: 0, replacements: 0 } };
  for (const row of (table.substitutions || [])) {
    declared.substitutions[row.id] = { sha256: declaredSubSha(row), file: row.file, region: row.region };
    declared.counts.substitutions += 1;
  }
  for (const [file, regions] of Object.entries(table.files)) {
    for (const r of regions) {
      if (r.kind !== "replace" || !Array.isArray(r.replacement)) continue;
      declared.replacements[r.id] = { sha256: declaredRepSha(file, r), file, lines: r.replacement.length };
      declared.counts.replacements += 1;
    }
  }
  witness.declared = declared;
  table.witness = witness;
  console.log("DECLARED-TEXT WITNESS (R1 NOTE-1), taken " + TAKEN);
  console.log("  substitution rows: " + declared.counts.substitutions);
  for (const [id, w] of Object.entries(declared.substitutions)) {
    console.log("    " + id.padEnd(6) + " " + w.file.padEnd(18) + " " + String(w.region).padEnd(8) + " " + w.sha256.slice(0, 16) + "...");
  }
  console.log("  replacement rows: " + declared.counts.replacements);
  for (const [id, w] of Object.entries(declared.replacements)) {
    console.log("    " + id.padEnd(8) + " " + w.file.padEnd(18) + " " + w.lines + " line(s)  " + w.sha256.slice(0, 16) + "...");
  }
  if (WRITE) {
    fs.writeFileSync(REGIONS, JSON.stringify(table, null, 1) + "\n");
    console.log("  written into " + REGIONS);
  } else {
    console.log("  (dry run: pass --write to record it)");
  }
  process.exit(0);
}

const witness = table.witness || { refs: [], regions: {}, movedLines: {} };
witness.refs = (witness.refs || []).filter((r) => r.name !== REF_NAME);
witness.refs.push({ name: REF_NAME, ref: REF, branch: BRANCH, taken: TAKEN });
witness.refs.sort((a, b) => (a.name < b.name ? -1 : 1));
witness.regions = witness.regions || {};
witness.movedLines = witness.movedLines || {};

let n = 0;
for (const [file, regions] of Object.entries(table.files)) {
  const src = fs.readFileSync(path.join(ROOT, TODAY, file), "utf8");
  const lines = src.split("\n");
  let moved = 0;
  for (const r of regions) {
    if (!WITNESSED.has(r.kind)) continue;
    const { start, end } = resolveRegion(lines, r, file, (m) => {
      console.error("REFUSED: " + m); process.exit(1);
    });
    const body = lines.slice(start - 1, end).join("\n");
    const sha = crypto.createHash("sha256").update(body, "utf8").digest("hex");
    const row = witness.regions[r.id] || {};
    row[REF_NAME] = { sha256: sha, lines: end - start + 1, at: [start, end] };
    witness.regions[r.id] = row;
    if (r.kind === "move") moved += end - start + 1;
    n += 1;
  }
  witness.movedLines[REF_NAME] = witness.movedLines[REF_NAME] || {};
  witness.movedLines[REF_NAME][file] = moved;
}

table.witness = witness;
console.log("WITNESS at " + REF_NAME + " = " + REF + (BRANCH ? " (" + BRANCH + ")" : ""));
console.log("  regions witnessed: " + n);
for (const [f, v] of Object.entries(witness.movedLines[REF_NAME])) {
  console.log("    " + f.padEnd(18) + " moved lines " + v);
}
if (WRITE) {
  fs.writeFileSync(REGIONS, JSON.stringify(table, null, 1) + "\n");
  console.log("  written into " + REGIONS);
} else {
  console.log("  (dry run: pass --write to record it)");
}
