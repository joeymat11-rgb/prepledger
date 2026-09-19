#!/usr/bin/env node
/* cut.cjs - THE CODEMOD (S-R17 (b)), WITH THE WITNESS (S-R19) AND THE EXTENT CHECK (S-R20).
 *
 * Reads regions.json and a worktree; writes the three new sealed modules and the three
 * edited originals into an output directory; prints the WITNESS CHECK.
 *
 * The rule it enforces: a MOVED region's bytes in the output equal its bytes in the source,
 * except for the substitution rows declared in regions.json. Nothing is renamed, nothing is
 * reformatted, nothing is reordered. Regions of kind "seam" are NOT moved: the spike leaves
 * them in the released file on purpose, so that census.cjs names every one of them
 * mechanically as a released reference to a sealed binding (S-R17 (c), (g)). Regions of kind
 * "replace" are the third kind S-R21 rules: released lines replaced IN PLACE by a declared
 * replacement, nothing moved, the pre-image witnessed like a move.
 *
 * WHAT R3 FOUND AND THIS FIXES. The old verbatim check was `if (applied.length === 0 && out
 * !== body) verbatimFails += 1;`, and applySubs returns out === body whenever no row
 * matched, so the counter could never be non-zero for any input. R3 removed two thirds of
 * the sleep writer's double-write fence inside a moved region and the cut exited 0 reporting
 * zero differing regions. A GENERATOR CANNOT BE ITS OWN CHECK (S-R19). The reference point
 * is now OUTSIDE the run: regions.json's witness block, a sha256 and a line count per
 * witnessed region at a NAMED ref, taken by gen-witness.cjs. This compares BOTH, BEFORE any
 * substitution, and refuses BY REGION ID.
 *
 * It REFUSES BY NAME on an anchor that matches zero places, on an anchor whose occurrence
 * index does not exist, on a last anchor it cannot find after the first, on a region whose
 * EXTENT matches no witnessed ref (the last anchor resolved to the wrong line: S-R20), on a
 * region whose BYTES match no witnessed ref (S-R19), on a file whose regions do not agree on
 * one ref, on a per-file moved-line total that is not the recorded one (S-R20), and on two
 * regions that overlap.
 *
 * Usage:
 *   node cut.cjs --root <worktree> --out <dir> [--regions regions.json] [--quiet]
 *                [--witness <ref name>]   restrict the witness to one recorded ref
 *
 * It writes, beside the output files, linemap.json: for every output line, the source file,
 * the source line and the region it came from. census.cjs reads it to report a crossing at
 * its SOURCE line rather than at an output line nobody can look up.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const resolveAnchors = require("./resolve.cjs");

const argv = process.argv.slice(2);
function opt(name, dflt) {
  const i = argv.indexOf("--" + name);
  return i >= 0 ? argv[i + 1] : dflt;
}
const ROOT = opt("root");
const OUT = opt("out");
const REGIONS = opt("regions", path.join(__dirname, "regions.json"));
const QUIET = argv.includes("--quiet");
const WIRE = argv.includes("--wire");
const ONLY_REF = opt("witness", null);
/* --product writes the PRODUCT form of a cut: the authored banner, factory line and return
   line come from regions.json's `product` block instead of the spike's own WRAPPER, and the
   released half gets the `compose` block's declared lines instead of the --wire shim. Every
   authored byte is then in the table, where a reviewer reads it beside the regions it wraps,
   rather than inside an instrument. --only limits the cut to the files named, so a round
   that ships two of the three cuts cannot emit the third by accident. */
const PRODUCT = argv.includes("--product");
/* --no-replace is a MEASUREMENT mode and never a build mode (R1's closing note, "a
   regenerated CROSSINGS.md on the build's own output would be worth more than the prose").
   It witnesses every replace region exactly as usual and then leaves its released lines
   where they are instead of swapping in the declared call. The census over that output is
   the answer to "what did the cut strand BEFORE the interface carried it", which is the
   table a reviewer needs beside the interface; the census over the product output is 0 by
   construction and says only that the interface carries everything. It refuses to combine
   with --product, so it can never write a product file. */
const NO_REPLACE = argv.includes("--no-replace");
if (NO_REPLACE && PRODUCT) {
  console.error("REFUSED: --no-replace is a measurement mode and cannot be combined with --product.");
  process.exit(2);
}
const ONLY = (opt("only", "") || "").split(",").map((s) => s.trim()).filter(Boolean);
if (!ROOT || !OUT) { console.error("usage: cut.cjs --root <worktree> --out <dir>"); process.exit(2); }

/* The DEV instrument: acorn 8, installed by the PM outside the repository. It is never a
   CI dependency and never copied into any node_modules the repository uses; it is required
   by absolute path, and the path is overridable so this can be re-run elsewhere. */
const INSTR = process.env.CENSUS_INSTRUMENT || "/home/claude/farm/tools/census/node_modules";

const table = JSON.parse(fs.readFileSync(REGIONS, "utf8"));
const TODAY = table.today;

/* The factory each sealed module wraps its moved regions in. The parameter lists are the
 * spec's (B.3, B.9, F.1); they are the ONE piece of authored text in the output, and they
 * are here rather than in the moved bytes so the verbatim check stays exact. */
const WRAPPER = {
  "today-lanes.cjs": {
    open: 'function createTodayLanes(doc, model, options, painter) {',
    close: '}\n\nmodule.exports = { createTodayLanes };\n',
    head: '/* GENERATED BY cut.cjs - NOT A PRODUCT FILE. The sealed half of today-app.cjs,\n' +
          '   moved verbatim. It does not run: the crossing census is what says what the\n' +
          '   interface between the two halves would have to contain. */\n',
  },
  "gym-settings-lane.mjs": {
    open: 'export function createGymSettingsLane(doc, model, settings, painter) {',
    close: '}\n',
    head: '/* GENERATED BY cut.cjs - NOT A PRODUCT FILE. */\n',
  },
  "today-readings.cjs": {
    open: 'function createReadingsWriter({ day, readings, adoptedRead, stateFromOps, read, NO_STORE, setMessage }) {',
    close: '  return { weighIn, reopen, ALREADY_RECORDED, OUT_OF_RANGE, FORM_MIN, FORM_MAX };\n}\n\nmodule.exports = { createReadingsWriter };\n',
    head: '"use strict";\n/* GENERATED BY cut.cjs - NOT A PRODUCT FILE. */\n',
  },
};

function fail(msg) { console.error("REFUSED: " + msg); process.exit(1); }

/* ---- anchor resolution ------------------------------------------------------------- */
function resolve(lines, region, file) { return resolveAnchors(lines, region, file, fail); }

/* ---- THE WITNESS (S-R19) AND THE EXTENT CHECK (S-R20) -------------------------------
 * A region is MOVED or REPLACED only if its bytes are bytes somebody recorded at a named
 * ref. The witness block is regions.json's, written by gen-witness.cjs; a region may be
 * witnessed at several refs because the one content-anchored table serves the chain tip and
 * the S9 lane head, and the two differ. The order of the two refusals matters and is the
 * order of R3's two attacks: the EXTENT is checked first, because a region that holds the
 * wrong LINES is an ambiguous last anchor and saying "the bytes differ" about it would send
 * the reader to the wrong place; only a region of the right length whose bytes differ is a
 * tampered region.                                                                        */
const WITNESS = table.witness || null;
const WITNESSED_KINDS = new Set(["move", "replace"]);
const REF_NAMES = WITNESS ? WITNESS.refs.map((r) => r.name).filter((n) => !ONLY_REF || n === ONLY_REF) : [];
if (!WITNESS || !REF_NAMES.length) {
  fail("regions.json carries no witness" + (ONLY_REF ? " for ref " + JSON.stringify(ONLY_REF) : "") +
    ". S-R19: a generator cannot be its own check. Run gen-witness.cjs at a named ref first.");
}
function sha256(s) { return crypto.createHash("sha256").update(s, "utf8").digest("hex"); }

/* ---- THE DECLARED-TEXT WITNESS (R1 NOTE-1) ------------------------------------------
 * S-R19 closed "a generator cannot be its own check" on the PRE-IMAGE. R1 showed it was
 * still open on the POST-IMAGE: the reviewer rewrote regions.json's W6d row so its `to`
 * read `setMessage({ ok: true, state: result.state, copy: result.copy });` - which makes
 * the sealed weigh-in report success whatever the client answered - left every moved byte
 * verbatim, and THE CUT EXITED 0 and put the tampered line into today-readings.cjs. The
 * pre-image witness cannot see it, because the pre-image was not touched.
 *
 * So the declared TEXT is witnessed too: a sha256 per substitution row and per replacement
 * row, and the row COUNTS, taken by gen-witness.cjs --declared. cut.cjs refuses BY ROW ID
 * before it opens a single source file.
 *
 * WHAT THIS IS AND IS NOT, said here rather than left for a reviewer to find. The
 * pre-image witness is an INDEPENDENT oracle: its digests come from git objects at a named
 * commit, so re-running the generator against a tampered working tree cannot bless it.
 * The declared text has no such outside source, because the text IS the declaration. This
 * is therefore TAMPER EVIDENCE, not an oracle: re-taking it re-blesses, and the control is
 * that re-taking it is a visible one-line-per-row diff in regions.json that the PM reads
 * beside the row it blesses. What it removes is the SILENT path R1 drove a line through.
 */
function declaredSubSha(row) {
  return sha256(JSON.stringify([row.id, row.file, row.region, row.from, row.to, row.kind || null]));
}
/* `statementRewrite` joined this digest in loop round 1. It is the flag that EXEMPTS a
   replacement row from the control-flow comparison below, so it is an authorization, and an
   authorization outside the witness is a way in: an attacker who could add
   `"statementRewrite": true` to TA-I018 without changing its digest would have bought the
   exemption for free. */
function declaredRepSha(file, r) {
  return sha256(JSON.stringify([r.id, file, r.replacement, r.statementRewrite || null]));
}
/* R2 F4, and it is the same argument one block further out. R1 NOTE-1 closed the SILENT
   path through a substitution's `to`; R2 drove a line through the PRODUCT block instead -
   it removed `Object.freeze(` from gym-settings-lane.mjs's read-only facade, changed no
   source byte, and the cut wrote an unfrozen facade and exited 0. `product` and `compose`
   carry more authored bytes than every substitution row put together (the banner, the
   factory line, the whole return block, and the released half's composition), and for
   part 2's interface over 679 moved lines it is the same hole on a much larger surface.
   These two digests are duplicated verbatim from gen-witness.cjs on purpose, for the
   reason the two above are.                                                             */
function declaredProdSha(dest, P) {
  return sha256(JSON.stringify([dest, P.head || null, P.open || null, P.close || null]));
}
function declaredCompSha(file, w) {
  return sha256(JSON.stringify([file, w.after || null, w.afterLines || null, w.at || null, w.insert || null]));
}
function checkDeclaredText() {
  const D = WITNESS.declared;
  if (!D) {
    fail("regions.json carries no DECLARED-TEXT witness. S-R19 on the post-image (R1 NOTE-1): " +
      "a substitution's `to` and a replacement's text are authored bytes that reach a product " +
      "file, and nothing outside the table recorded them. Run gen-witness.cjs --declared first.");
  }
  const subs = SUBS.slice();
  if (subs.length !== D.counts.substitutions) {
    fail("the table declares " + subs.length + " substitution rows; the declared-text witness " +
      "records " + D.counts.substitutions + ". A row ADDED to the table reaches a product file " +
      "and nothing witnessed it (R1 NOTE-1).");
  }
  for (const row of subs) {
    const w = (D.substitutions || {})[row.id];
    if (!w) fail("substitution row " + row.id + ": NO DECLARED WITNESS (R1 NOTE-1).");
    const sha = declaredSubSha(row);
    if (w.sha256 !== sha) {
      fail("substitution row " + row.id + " (" + row.file + " " + row.region + "): DECLARED " +
        "TEXT DOES NOT MATCH THE WITNESS. The row now hashes " + sha.slice(0, 16) + "..., the " +
        "witness records " + w.sha256.slice(0, 16) + ". The bytes this row WRITES into a sealed " +
        "product file are not the bytes the spec was reviewed against (R1 NOTE-1).");
    }
  }
  /* Replacement rows. A `replace` region with no `replacement` array at all is refused by
     the structural check further down, which names the region and says what is missing;
     it is skipped here so that the older and more specific message still reaches the
     reader instead of a digest mismatch standing in for it. */
  let nrep = 0;
  for (const [file, regions] of Object.entries(table.files)) {
    for (const r of regions) {
      if (r.kind !== "replace") continue;
      nrep += 1;
      if (!Array.isArray(r.replacement)) continue;
      const w = (D.replacements || {})[r.id];
      if (!w) fail("replacement row " + r.id + " (" + file + "): NO DECLARED WITNESS (R1 NOTE-1).");
      const sha = declaredRepSha(file, r);
      if (w.sha256 !== sha) {
        fail("replacement row " + r.id + " (" + file + "): DECLARED TEXT DOES NOT MATCH THE " +
          "WITNESS. The row now hashes " + sha.slice(0, 16) + "..., the witness records " +
          w.sha256.slice(0, 16) + ". These are released lines a hand replaces with calls into " +
          "the seal, and they are not the lines the spec was reviewed against (R1 NOTE-1).");
      }
    }
  }
  if (nrep !== D.counts.replacements) {
    fail("the table declares " + nrep + " replacement rows with text; the declared-text witness " +
      "records " + D.counts.replacements + " (R1 NOTE-1).");
  }
  /* R2 F4: the product blocks. These are the authored banner, factory line and return
     block of a SEALED product file; a tamper here reaches the shipped file directly. */
  let nprod = 0;
  for (const [dest, P] of Object.entries(table.product || {})) {
    nprod += 1;
    const w = (D.products || {})[dest];
    if (!w) {
      fail("product block " + dest + ": NO DECLARED WITNESS. The banner, the factory line and " +
        "the return block of a sealed product file are authored bytes that reach that file, " +
        "and nothing outside the table recorded them (R2 F4). Run gen-witness.cjs --declared.");
    }
    const sha = declaredProdSha(dest, P);
    if (w.sha256 !== sha) {
      fail("product block " + dest + ": DECLARED TEXT DOES NOT MATCH THE WITNESS. The block now " +
        "hashes " + sha.slice(0, 16) + "..., the witness records " + w.sha256.slice(0, 16) +
        ". These are the authored lines of a SEALED product file - the banner, the factory " +
        "signature and the frozen return block - and they are not the lines the spec was " +
        "reviewed against (R2 F4: dropping Object.freeze( from the read-only facade here " +
        "changed no source byte and exited 0).");
    }
  }
  if (nprod !== D.counts.products) {
    fail("the table declares " + nprod + " product blocks; the declared-text witness records " +
      D.counts.products + ". A product block ADDED to the table writes a whole sealed file and " +
      "nothing witnessed it (R2 F4).");
  }
  /* R2 F4: the compose blocks. These are the RELEASED half's composition lines - the
     require or import, and the factory call that hands the seal its arguments. */
  let ncomp = 0;
  for (const [file, w0] of Object.entries(table.compose || {})) {
    ncomp += 1;
    const w = (D.composes || {})[file];
    if (!w) {
      fail("compose block " + file + ": NO DECLARED WITNESS. The released half's own " +
        "composition lines are authored bytes that reach a released file (R2 F4). Run " +
        "gen-witness.cjs --declared.");
    }
    const sha = declaredCompSha(file, w0);
    if (w.sha256 !== sha) {
      fail("compose block " + file + ": DECLARED TEXT DOES NOT MATCH THE WITNESS. The block now " +
        "hashes " + sha.slice(0, 16) + "..., the witness records " + w.sha256.slice(0, 16) +
        ". These are the lines by which the RELEASED file composes the seal - the require and " +
        "the arguments the factory is handed - and they are not the lines the spec was " +
        "reviewed against (R2 F4).");
    }
  }
  if (ncomp !== D.counts.composes) {
    fail("the table declares " + ncomp + " compose blocks; the declared-text witness records " +
      D.counts.composes + " (R2 F4).");
  }
  return { subs: subs.length, reps: nrep, prods: nprod, comps: ncomp };
}

/* ---- THE CONTROL-FLOW COMPARISON (blind review F6, incremental review F4) -------------
 * The reviewer changed TA-I018's replacement from `    if (!facade.foodLane()) {` to
 * `    if (!facade.foodLane()) { return;`, re-ran the real gen-witness --declared --write on
 * that scratch table, and the cut exited 0 at BOTH named refs. Executing the original guard
 * with no food lane emitted one put(map,"stub-note",...); the changed guard emitted none and
 * returned undefined. A refusal became silence, and every check the cut owned said yes: the
 * digest had just been re-taken over the new text, and the OUTPUT still parsed, because an
 * early return is perfectly good syntax.
 *
 * So the check is not "does it parse" but "is it the transform the table declares". The
 * generated interface rows do ONE thing: a bare read becomes `facade.<name>()` and a call
 * becomes `hooks.<name>(`. That rewrites identifiers and adds parentheses; it cannot add,
 * remove or move a statement. This compares the two texts token-wise over the keywords and
 * punctuators that decide CONTROL FLOW - the jump keywords, the block keywords, the
 * declarators, `{`, `}` and `;` - with strings, template literals and comments removed, and
 * refuses by row id when the multiset differs.
 *
 * A row that DOES rewrite a statement says so: `"statementRewrite": true` in the table,
 * inside the declared-text digest, and listed by id in the cut's own report for the PM's
 * final read (S-R12, S-R17 (g), DECISIONS:584). Measured at both named refs: 282 replace
 * resolutions, 258 preserve their profile and the 24 that do not are exactly the five
 * S-R21 boot seams, the eleven hand-designed B.5 rows and GA-R05 - every one of them
 * already declared and already read line by line. Nothing is exempt that was not exempt.
 *
 * WHAT IT IS NOT: it is not a semantic oracle either, and no comparison of two texts is.
 * `facade.foodLane()` could still be a getter that writes. It closes the ONE hole the
 * reviewer drove a line through - an unruled control-flow change smuggled in behind a
 * re-taken digest - and the independent review of every hunk remains the thing that holds
 * a released file (S-R26).                                                              */
const CF_WORDS = new Set(["return", "throw", "break", "continue", "if", "else", "for",
  "while", "do", "switch", "case", "default", "try", "catch", "finally", "yield", "await",
  "function", "var", "let", "const", "class", "new", "delete", "in", "of", "typeof", "void"]);
function controlProfile(text) {
  let s = String(text);
  s = s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");
  s = s.replace(/"(?:[^"\\\n]|\\.)*"/g, " S ").replace(/'(?:[^'\\\n]|\\.)*'/g, " S ");
  s = s.replace(/`(?:[^`\\]|\\.)*`/g, " S ");
  const p = Object.create(null);
  for (const w of s.match(/[A-Za-z_$][A-Za-z0-9_$]*/g) || []) if (CF_WORDS.has(w)) p[w] = (p[w] || 0) + 1;
  for (const ch of s) if (ch === "{" || ch === "}" || ch === ";") p[ch] = (p[ch] || 0) + 1;
  return p;
}
function profileDiff(a, b) {
  const out = [];
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if ((a[k] || 0) !== (b[k] || 0)) out.push(k + ": pre-image " + (a[k] || 0) + ", replacement " + (b[k] || 0));
  }
  return out.sort();
}
function checkControlFlow(file, region, pre) {
  const post = (region.replacement || []).join("\n");
  const d = profileDiff(controlProfile(pre), controlProfile(post));
  if (!d.length) return false;
  if (region.statementRewrite) return true;
  fail(file + " " + region.id + ": THE REPLACEMENT CHANGES CONTROL FLOW and the row does not " +
    "declare a statement rewrite. " + d.join("; ") + ". A generated interface row rewrites a " +
    "bare read into facade.<name>() or a call into hooks.<name>(; it does not add, remove or " +
    "move a statement, and an added `return` turns a refusal into silence while the output " +
    "still parses and a re-taken digest still matches (blind review F6, incremental review " +
    "F4). If this row is meant to rewrite a statement, declare \"statementRewrite\": true on " +
    "it, re-take the declared-text witness, and it is listed by id in the cut's report for " +
    "the PM's read (S-R12, S-R17 (g), DECISIONS:584).\n  PRE-IMAGE:   " +
    JSON.stringify(pre) + "\n  REPLACEMENT: " + JSON.stringify(post));
  return true;
}

function checkWitness(file, region, start, end, body, lastHits, firstHits) {
  const w = WITNESS.regions[region.id];
  if (!w) {
    fail(file + " " + region.id + ": NO WITNESS. Every " + region.kind +
      " region must carry a sha256 and a line count at a named ref (S-R19).");
  }
  /* THE FIRST ANCHOR'S OCCURRENCE COUNT, witnessed at the named refs from git objects
     (blind review F5, incremental review F1). resolve.cjs enforces the same number from the
     table so that census.cjs and capture.cjs, which hold no witness, refuse too; this is the
     copy with an outside oracle behind it, and a table field bumped to match a plant does
     not get past it. */
  const recorded = REF_NAMES.filter((n) => w[n] && typeof w[n].occurrences === "number");
  if (recorded.length && !recorded.some((n) => w[n].occurrences === firstHits.length)) {
    fail(file + " " + region.id + ": THE FIRST ANCHOR MATCHES " + firstHits.length +
      " PLACES; the witness records " + recorded.map((n) => n + "=" + w[n].occurrences).join(", ") +
      " at :" + firstHits.join(" :") + ". A competing occurrence of an anchor's own text binds " +
      "this region to a DIFFERENT declaration, and a digest of one line cannot tell the two " +
      "apart because they ARE the same line (blind review F5, incremental review F1): " +
      JSON.stringify(region.first.text));
  }
  const lines = end - start + 1;
  const byExtent = REF_NAMES.filter((n) => w[n] && w[n].lines === lines);
  if (!byExtent.length) {
    const want = REF_NAMES.filter((n) => w[n]).map((n) => n + "=" + w[n].lines + " lines").join(", ");
    const near = lastHits.filter((l) => l >= start && l <= start + 400).slice(0, 8).join(" :");
    fail(file + " " + region.id + ": LAST ANCHOR IS AMBIGUOUS. The table's occurrence #" +
      region.last.nthFrom + " of " + JSON.stringify(region.last.text) + " resolves to :" + end +
      ", which makes the region " + lines + " lines; the witness records " + want +
      ". Candidate occurrences at or after :" + start + " are :" + near +
      ". Re-anchor the region or re-take the witness with gen-witness.cjs (S-R20).");
  }
  const sha = sha256(body);
  const byBytes = byExtent.filter((n) => w[n].sha256 === sha);
  if (!byBytes.length) {
    fail(file + " " + region.id + ": BYTES DO NOT MATCH THE WITNESS. " + lines +
      " lines at :" + start + "-:" + end + " hash " + sha.slice(0, 16) + "..., the witness records " +
      byExtent.map((n) => n + "=" + w[n].sha256.slice(0, 16) + "...").join(", ") +
      ". This region is not the region the spec was reviewed against (S-R19).");
  }
  return byBytes;
}

/* ---- substitutions ----------------------------------------------------------------- */
const SUBS = table.substitutions || [];
function applySubs(file, region, text) {
  const applied = [];
  let out = text;
  for (const row of SUBS) {
    if (row.file !== file) continue;
    if (row.region !== "*" && row.region !== region.id) continue;
    const parts = out.split(row.from);
    const n = parts.length - 1;
    /* A declared row that matches NOTHING is not an error - D.1's W5 family is declared and
       deliberately not used (build report STOP 2), and a row can be made redundant by a
       broader row applied before it - but it was invisible, so it is reported now and the
       build report accounts for every one of them. */
    if (n === 0) { report.unappliedSubstitutions.push({ file, region: region.id, id: row.id, from: row.from }); continue; }
    out = parts.join(row.to);
    applied.push({ id: row.id, from: row.from, to: row.to, count: n, kind: row.kind, why: row.why });
  }
  return { out, applied };
}

/* ---- the cut ------------------------------------------------------------------------ */
fs.mkdirSync(OUT, { recursive: true });
/* R1 NOTE-1: the declared TEXT is checked BEFORE a single source file is opened, so a
   tampered `to` refuses by row id and never reaches an output byte. */
const DECLARED = checkDeclaredText();
const report = { root: ROOT, files: {}, substitutions: [], seams: [], drift: [],
  machineSeams: [], alignedSeams: [], witness: { refsOffered: REF_NAMES, byFile: {} },
  replacements: [], statementRewrites: [], unappliedSubstitutions: [] };
const linemap = {};

for (const [file, regions] of Object.entries(table.files)) {
  if (ONLY.length && !ONLY.includes(file)) continue;
  const srcPath = path.join(ROOT, TODAY, file);
  const src = fs.readFileSync(srcPath, "utf8");
  const lines = src.split("\n");
  const resolved = regions.map((r) => ({ r, ...resolve(lines, r, file) }));

  /* overlap. ORDER-INDEPENDENT since loop round 1 (incremental review F5, blind review's
     earlier-findings table F5). The sort was `a.start - b.start` alone and the containment
     test looked only at the PREVIOUS element, so the answer depended on the order the rows
     happen to sit in the file: reversing files["today-app.cjs"] and changing nothing else
     turned an accepted cut into
     `REFUSED: regions TA-I004 [718,718] and TA-M03 [718,719] OVERLAP`, because the nested
     replace then sorted ahead of the seam that encloses it and became the `prev` of the
     pair. A table's acceptance must not depend on the order of its rows. The tie order is
     now total and deterministic - by start, then by widest extent, then seam before move
     before replace, then by id - and containment is decided against EVERY seam of the file
     rather than against whichever row happens to be adjacent. */
  const KIND_RANK = { seam: 0, move: 1, replace: 2 };
  const sorted = resolved.slice().sort((a, b) =>
    a.start - b.start || b.end - a.end ||
    (KIND_RANK[a.r.kind] || 9) - (KIND_RANK[b.r.kind] || 9) ||
    (a.r.id < b.r.id ? -1 : a.r.id > b.r.id ? 1 : 0));
  /* Two regions may not overlap, with ONE declared exception: a `replace` region nested
     wholly inside a `seam` region. A seam is an annotation - cut.cjs leaves every seam line
     where it is - so a replace inside one is not two claims on the same bytes, it is the
     seam saying which of its own lines the interface rewrites. gym-app.mjs's SEAM G1
     (recordSettings, :286-:318) is the case: the function stays released and byte-identical
     apart from the two declared rows that reach the sealed lane. The nesting is recorded. */
  report.nested = report.nested || [];
  const seamsHere = sorted.filter((x) => x.r.kind === "seam");
  const enclosing = new Map();
  for (const x of sorted) {
    if (x.r.kind !== "replace") continue;
    const s = seamsHere.find((q) => q.start <= x.start && x.end <= q.end);
    if (s) enclosing.set(x, s);
  }
  for (const [x, s] of enclosing) {
    report.nested.push({ file, seam: s.r.id, replace: x.r.id, lines: [x.start, x.end] });
  }
  const flat = sorted.filter((x) => !enclosing.has(x));
  for (let i = 1; i < flat.length; i += 1) {
    const prev = flat[i - 1], here = flat[i];
    if (here.start > prev.end) continue;
    fail(file + ": regions " + prev.r.id + " [" + prev.start + "," + prev.end + "] and " +
      here.r.id + " [" + here.start + "," + here.end + "] OVERLAP");
  }
  for (const x of sorted) {
    if (x.start !== x.r.tipLines[0] || x.end !== x.r.tipLines[1]) {
      report.drift.push({ file, id: x.r.id, tip: x.r.tipLines, here: [x.start, x.end] });
    }
    if (x.r.kind === "seam") report.seams.push({ file, id: x.r.id, lines: [x.start, x.end], note: x.r.note });
  }

  /* THE WITNESS, BEFORE ANY SUBSTITUTION (S-R19, S-R20). Every witnessed region of this
     file must match one recorded ref, and they must all match the SAME one: a table half at
     the tip and half at S9 is a table nobody took at any ref. */
  let agree = REF_NAMES.slice();
  for (const x of sorted) {
    if (!WITNESSED_KINDS.has(x.r.kind)) continue;
    const body = lines.slice(x.start - 1, x.end).join("\n");
    const ok = checkWitness(file, x.r, x.start, x.end, body, x.lastHits, x.firstHits);
    const next = agree.filter((n) => ok.includes(n));
    if (!next.length) {
      fail(file + " " + x.r.id + ": the file's regions do not agree on one witnessed ref. " +
        "This region matches " + ok.join(", ") + "; the regions before it matched " +
        agree.join(", ") + " (S-R19).");
    }
    agree = next;
  }
  report.witness.byFile[file] = agree;

  /* ---- THE ALIGNMENT CHECK ----------------------------------------------------------
   * A region boundary that falls INSIDE a statement is the failure `node --check` cannot
   * catch, because both halves of a cut declaration can still parse. (Measured: F.1 gives
   * OUT_OF_RANGE as `today-model.cjs:373`; the declaration runs to :374, and a region cut
   * at :373 leaves `+ " lb, ...";` behind as a valid unary-plus expression statement.)
   * So every region must begin and end on a statement boundary, and this refuses by name
   * when one does not. */
  {
    const acorn = require(path.join(INSTR, "acorn"));
    const ast = acorn.parse(src, { ecmaVersion: 2022, locations: true,
      sourceType: file.endsWith(".mjs") ? "module" : "script" });
    const stmts = [];
    (function collect(n) {
      if (!n || typeof n !== "object") return;
      if (n.type && /Statement|Declaration/.test(n.type) && n.loc) {
        stmts.push([n.loc.start.line, n.loc.end.line, n.type]);
      }
      for (const k of Object.keys(n)) {
        const v = n[k];
        if (Array.isArray(v)) v.forEach(collect); else if (v && typeof v === "object" && v.type) collect(v);
      }
    })(ast);
    for (const x of sorted) {
      let straddles = null;
      for (const [a, b, t] of stmts) {
        /* An ENCLOSING statement (mountToday itself) contains the whole region and is
           fine. Only a statement that OVERLAPS a boundary is a cut through a statement. */
        if (a < x.start && x.start <= b && b < x.end) straddles = { end: "STARTS", a, b, t, at: x.start };
        if (x.start <= a && a <= x.end && x.end < b) straddles = { end: "ENDS", a, b, t, at: x.end };
      }
      /* THIS IS WHAT A SEAM IS, MECHANICALLY: a region whose boundary falls inside a
         statement cannot be a pure move, because a cut there leaves half a statement in
         the released file. A region whose boundaries align CAN be a pure move. So the
         seam list is the machine's, not the author's (S-R17 (g)).
         PART 2: THE RULE IS A MOVE'S, NOT A REPLACE'S, and the difference is exact. A move
         takes lines OUT of one file and puts them in another, so a boundary inside a
         statement leaves half of it behind and the other half in the seal. A `replace` row
         takes lines out and puts its own lines back AT THE SAME POSITION, so no half is
         left anywhere; the interface rows of part 2 rewrite lines like
         `if (!foodLane) {`, which open a block deliberately and whose replacement opens the
         same block. What has to hold for a replace is that the OUTPUT still parses, and
         that is checked directly below, on the bytes the cut actually writes, which is a
         stronger statement than this one and not a weaker one. */
      if (straddles && x.r.kind === "move") {
        fail(file + " " + x.r.id + ": region " + straddles.end + " at :" + straddles.at +
          " inside a " + straddles.t + " that runs :" + straddles.a + "-:" + straddles.b +
          ". A cut there leaves half a statement behind, so this is a SEAM, not a move.");
      }
      if (straddles) report.machineSeams.push({ file, id: x.r.id, boundary: straddles.end,
        at: straddles.at, statement: straddles.t, statementLines: [straddles.a, straddles.b] });
      else if (x.r.kind === "seam") report.alignedSeams.push({ file, id: x.r.id, lines: [x.start, x.end] });
    }
  }

  const moves = sorted.filter((x) => x.r.kind === "move");
  const dest = table.dest[file];

  /* the sealed module */
  const P = PRODUCT ? (table.product || {})[dest] : null;
  if (PRODUCT && !P) {
    fail(file + ": --product, but regions.json declares no product block for " + dest +
      ". A product file's authored lines are declared in the table, never invented by the" +
      " instrument. Use --only to leave this cut out of the round.");
  }
  const W = WRAPPER[dest];
  const sealedLines = [];
  const sealedMap = [];
  const pushLine = (t, src_) => { sealedLines.push(t); sealedMap.push(src_ || null); };
  if (P) {
    for (const l of P.head) pushLine(l);
    /* `open` is a STRING for a factory whose signature fits on one line and an ARRAY for
       one that does not. today-lanes.cjs's takes eighteen injected names and four
       parameters, so it is four lines plus the three declarations that are not moved
       bytes; keeping them as separate entries keeps the line map one to one, which is
       what census.cjs reports a crossing's SOURCE line through. */
    if (Array.isArray(P.open)) { for (const l of P.open) pushLine(l); } else { pushLine(P.open); }
  } else {
    for (const l of W.head.split("\n").slice(0, -1)) pushLine(l);
    pushLine("");
    pushLine(W.open);
  }
  let subCount = 0, verbatimFails = 0;
  for (const m of moves) {
    const body = lines.slice(m.start - 1, m.end).join("\n");
    const { out, applied } = applySubs(file, m.r, body);
    for (const a of applied) { subCount += a.count; report.substitutions.push({ file, region: m.r.id, ...a }); }
    /* R3's BLOCKING-1: the old check here was `if (applied.length === 0 && out !== body)
       verbatimFails += 1;`, and applySubs returns out === body whenever no row matched, so
       the counter was unreachable for every possible input. The real check is the witness
       above, taken before applySubs ran. This counter is kept at zero only so the report's
       shape does not change under a reader who knew the old one. */
    void body;
    pushLine("  /* " + m.r.id + "  " + file + ":" + m.start + "-" + m.end + " */");
    const outLines = out.split("\n");
    for (let i = 0; i < outLines.length; i += 1) {
      pushLine(outLines[i], { file, line: m.start + i, region: m.r.id });
    }
    pushLine("");
  }
  if (P) { for (const l of P.close) pushLine(l); pushLine(""); }
  else for (const l of W.close.split("\n")) pushLine(l);
  const destPath = path.join(OUT, dest);
  fs.writeFileSync(destPath, sealedLines.join("\n"));
  linemap[dest] = sealedMap;

  /* the edited original: the moved lines removed, everything else byte-identical, and the
     REPLACE regions (S-R21) swapped for their declared replacement. A replace region is the
     third kind: it moves nothing into the seal and it is not left alone either - its
     released lines are replaced IN PLACE by the declared rows, which is what the five boot
     seams are. R3's BLOCKING-5 is that a `kind` flip from move to seam cannot express them:
     with TA-S38 a seam, `let ready = settleAdoption(...)` stays declared released, read
     released and stops crossing, which is the opposite of the design B.3 describes. */
  const replaces = sorted.filter((x) => x.r.kind === "replace");
  for (const rp of replaces) {
    if (!Array.isArray(rp.r.replacement)) {
      fail(file + " " + rp.r.id + ": kind \"replace\" with no declared `replacement` row (S-R21).");
    }
    const pre = lines.slice(rp.start - 1, rp.end).join("\n");
    const rewrote = checkControlFlow(file, rp.r, pre);
    if (rewrote) {
      report.statementRewrites.push({ file, id: rp.r.id, lines: [rp.start, rp.end],
        diff: profileDiff(controlProfile(pre), controlProfile(rp.r.replacement.join("\n"))),
        from: lines.slice(rp.start - 1, rp.end), to: rp.r.replacement, why: rp.r.note });
    }
    report.replacements.push({ file, id: rp.r.id, lines: [rp.start, rp.end],
      removed: rp.end - rp.start + 1, inserted: rp.r.replacement.length,
      from: lines.slice(rp.start - 1, rp.end), to: rp.r.replacement,
      statementRewrite: !!rp.r.statementRewrite,
      kind: "statement rewrite (S-R17 (g) STOP, declared in advance)", why: rp.r.note });
  }
  const drop = new Set();
  for (const m of moves) for (let n = m.start; n <= m.end; n += 1) drop.add(n);
  const replaceAt = new Map();
  if (!NO_REPLACE) for (const rp of replaces) {
    replaceAt.set(rp.start, rp.r.replacement);
    for (let n = rp.start; n <= rp.end; n += 1) drop.add(n);
  }
  /* --wire: the ONE authored shim per file, declared in regions.json's `wiring` block, so
     the output can actually be required and the suites can be run against it. Without it
     the output is a PURE MOVE that node --check passes and node cannot run, which is the
     spike's default and the state the census is measured in. */
  const wiring = PRODUCT ? (table.compose || {})[file] : (WIRE ? (table.wiring || {})[file] : null);
  if (PRODUCT && !wiring) {
    fail(file + ": --product, but regions.json declares no compose block for it. The released" +
      " half's composition lines are declared in the table too (S-R25: the PM reads exactly" +
      " the hand-written lines).");
  }
  const keptLines = [];
  const keptMap = [];
  for (let n = 1; n <= lines.length; n += 1) {
    /* PRODUCT: the module-level lines the released half gains, anchored by exact text. */
    if (wiring && wiring.after && lines[n - 1] === wiring.after) {
      keptLines.push(lines[n - 1]); keptMap.push({ file, line: n, region: null });
      for (const l of wiring.afterLines) { keptLines.push(l); keptMap.push({ file, line: 0, region: "COMPOSE" }); }
      continue;
    }
    if (wiring && drop.has(n)) {
      const at = moves.find((m) => m.r.id === wiring.at);
      if (at && n === at.start) for (const l of wiring.insert) { keptLines.push(l); keptMap.push({ file, line: 0, region: "WIRE" }); }
    }
    if (replaceAt.has(n)) {
      for (const l of replaceAt.get(n)) { keptLines.push(l); keptMap.push({ file, line: 0, region: "REPLACE" }); }
    }
    if (drop.has(n)) continue;
    keptLines.push(lines[n - 1]);
    keptMap.push({ file, line: n, region: null });
  }
  const editedPath = path.join(OUT, file);
  fs.writeFileSync(editedPath, keptLines.join("\n"));
  linemap[file] = keptMap;

  /* ---- THE PARSE CHECK, ON THE BYTES THIS RUN WROTE (part 2) -----------------------
   * The alignment check above is about a MOVE's boundary. A `replace` row's failure mode
   * is different and this is its check: a replacement that drops a brace, an unbalanced
   * parenthesis or a stray comma produces a file that does not parse, and the cut must
   * refuse by region rather than hand a broken product file to the suite. It runs over the
   * OUTPUT, so it covers the sealed file's wrapper and the released file's replacements
   * together, and it names the replace rows of the file it failed on so a reader has
   * somewhere to look. */
  {
    const acorn2 = require(path.join(INSTR, "acorn"));
    for (const [p, who] of [[editedPath, file], [destPath, dest]]) {
      const text = fs.readFileSync(p, "utf8");
      try {
        acorn2.parse(text, { ecmaVersion: 2022,
          sourceType: who.endsWith(".mjs") ? "module" : "script", allowReturnOutsideFunction: false });
      } catch (e) {
        const ids = replaces.map((x) => x.r.id).join(", ") || "(none)";
        fail(who + ": THE OUTPUT DOES NOT PARSE. " + e.message +
          ". A move cannot cause this (its boundaries are statement-aligned and checked" +
          " above), so look at this file's declared `replace` rows: " + ids);
      }
    }
  }

  /* THE PER-FILE MOVED-LINE TOTAL, ASSERTED (S-R20). R3's second and third attacks both
     left every anchor resolvable and every boundary statement-aligned, and the ONE number
     that moved was this one: 673 and 695 against 685. Nothing asserted it, so the only
     signal was a LINE DRIFT row, and drift is the normal output at the S9 ref where 30
     regions drift. It is asserted here, per ref, against the witness. */
  let movedLines = 0;
  for (const m of moves) movedLines += m.end - m.start + 1;
  const totals = agree.filter((n) => (WITNESS.movedLines[n] || {})[file] === movedLines);
  if (!totals.length) {
    fail(file + ": moved " + movedLines + " lines in " + moves.length +
      " move regions; the witness records " +
      agree.map((n) => n + "=" + (WITNESS.movedLines[n] || {})[file]).join(", ") +
      ". A per-file moved-line total that is not the recorded one is a region holding the" +
      " wrong lines (S-R20).");
  }
  report.witness.byFile[file] = totals;
  report.files[file] = {
    dest, sourceLines: lines.length, regions: regions.length,
    moveRegions: moves.length, replaceRegions: replaces.length,
    seamRegions: sorted.length - moves.length - replaces.length,
    movedLines, releasedLines: keptLines.length, witnessedAt: totals,
    substitutionsApplied: subCount, verbatimFailures: verbatimFails,
  };
}

/* ---- THE BOOT ORDER ------------------------------------------------------------------
 * A region that is an EXECUTABLE STATEMENT at the mount's own top level does not only
 * change file when it moves: it changes WHEN IT RUNS, because everything inside the
 * factory runs at the one point the factory is called. This lists the mount's direct
 * statements in source order, marked moved or released and declaration or executable, so
 * the order the cut would impose can be compared with the order the source has.          */
{
  const acorn = require(path.join(INSTR, "acorn"));
  const MOUNTS = { "today-app.cjs": "mountToday", "gym-app.mjs": "mountGym", "today-model.cjs": "createTodayModel" };
  report.bootOrder = {};
  report.bootCrossings = {};
  for (const [file, regions] of Object.entries(table.files)) {
    if (ONLY.length && !ONLY.includes(file)) continue;
    const src = fs.readFileSync(path.join(ROOT, TODAY, file), "utf8");
    const lines = src.split("\n");
    const resolved = regions.map((r) => ({ r, ...resolve(lines, r, file) }))
      .filter((x) => WITNESSED_KINDS.has(x.r.kind));
    const ast = acorn.parse(src, { ecmaVersion: 2022, locations: true,
      sourceType: file.endsWith(".mjs") ? "module" : "script" });
    let body = null;
    (function find(n) {
      if (!n || typeof n !== "object" || body) return;
      if ((n.type === "FunctionDeclaration") && n.id && n.id.name === MOUNTS[file]) { body = n.body.body; return; }
      for (const k of Object.keys(n)) {
        const v = n[k];
        if (Array.isArray(v)) v.forEach(find); else if (v && typeof v === "object" && v.type) find(v);
      }
    })(ast);
    if (!body) continue;
    const rows = body.map((st) => {
      const line = st.loc.start.line;
      const inRegion = resolved.find((x) => line >= x.start && line <= x.end);
      /* WHAT COUNTS AS EXECUTABLE, corrected in loop round 1 by blind review F2.
         The rule used to treat a `VariableDeclaration` whose initializer is a
         LogicalExpression as inert, so `let sleepLane = options.sleep || null;` at :432 was
         not in this list at all. It is not inert: it READS A PROPERTY OF AN INJECTED
         OBJECT, and after the cut it runs at the factory's one call site instead of where
         it stands. The reviewer measured the consequence on the two REAL composed pages:
         with model.setFoodDays assigning options.sleep (the documented boot seam
         hooks.bootFoodDays stands on), PRE api.sleepLane() is the injected lane and POST is
         null, because the POST factory evaluated options.sleep BEFORE bootFoodDays ran.
         An initializer is inert only if it reads nothing from anywhere: no call, no `new`,
         no tagged template, no await, and no member access. */
      let reads = false;
      (function scan(n) {
        if (!n || typeof n !== "object" || reads) return;
        /* A function body does not run when the declaration is evaluated, so it is not part
           of the initializer's reads. Without this, every `const f = () => model.x()` at the
           mount's top level is a false crossing, and three of them are. */
        if (n.type === "ArrowFunctionExpression" || n.type === "FunctionExpression") return;
        if (n.type === "CallExpression" || n.type === "NewExpression"
          || n.type === "TaggedTemplateExpression" || n.type === "AwaitExpression"
          || n.type === "MemberExpression") { reads = true; return; }
        for (const k of Object.keys(n)) {
          const v = n[k];
          if (Array.isArray(v)) v.forEach(scan); else if (v && typeof v === "object" && v.type) scan(v);
        }
      })(st.type === "VariableDeclaration" ? { type: "X", d: st.declarations.map((d) => d.init).filter(Boolean) } : null);
      const exec = !(st.type === "FunctionDeclaration"
        || (st.type === "VariableDeclaration" && !reads));
      return { line, type: st.type, exec, reads, region: inRegion ? inRegion.r.id : null,
        regionKind: inRegion ? inRegion.r.kind : null };
    });
    report.bootOrder[file] = rows.filter((r) => r.exec);
    /* THE CROSSINGS THE BOOT SEAMS DO NOT COVER (blind review F2). The five S-R21 boot
       seams keep the seven boot STATEMENTS where they stand. They do not keep a moved
       INITIALIZER where it stands: everything inside the factory runs at the factory's one
       call site, which is above every boot seam. This lists, by physical line, every moved
       executable statement that stands AFTER a boot seam in the source and will run BEFORE
       it after the cut. It is a DECLARED list, printed by the cut and read by the PM, and
       the instruments' cell asserts that the list is the one the table declares, so a new
       crossing cannot appear silently. It is not a refusal: the disposition of these lines
       is the PM's, and the build report costs both corrections the reviewer names. */
    const seams = rows.filter((r) => r.exec && r.regionKind === "replace").map((r) => r.line);
    const firstSeam = seams.length ? Math.min.apply(null, seams) : Infinity;
    report.bootCrossings[file] = rows
      .filter((r) => r.exec && r.regionKind === "move" && r.line > firstSeam)
      .map((r) => ({ line: r.line, region: r.region, type: r.type,
        text: lines[r.line - 1],
        seamsCrossed: seams.filter((s) => s < r.line) }));
  }
}

fs.writeFileSync(path.join(OUT, "linemap.json"), JSON.stringify(linemap));
fs.writeFileSync(path.join(OUT, "cut-report.json"), JSON.stringify(report, null, 1));

if (!QUIET) {
  console.log("CUT at " + ROOT);
  for (const [f, r] of Object.entries(report.files)) {
    console.log("  " + f.padEnd(18) + " -> " + r.dest.padEnd(24) +
      " moved " + String(r.movedLines).padStart(4) + " lines in " + String(r.moveRegions).padStart(2) +
      " regions; " + String(r.replaceRegions).padStart(2) + " replace; " +
      String(r.seamRegions).padStart(2) + " seams left released;" +
      " released file " + r.releasedLines + " lines");
  }
  const witnessed = Object.values(report.files).reduce((a, b) => a + b.moveRegions + b.replaceRegions, 0);
  console.log("  WITNESS CHECK (S-R19, S-R20): " + witnessed +
    " regions compared against regions.json's recorded sha256 and line count BEFORE any" +
    " substitution; every one matched, every file agreed on one ref, and every per-file" +
    " moved-line total is the recorded one.");
  for (const [f, r] of Object.entries(report.files)) {
    console.log("    " + f.padEnd(18) + " witnessed at " + r.witnessedAt.join(" or ") +
      "; moved lines " + r.movedLines);
  }
  console.log("  DECLARED-TEXT WITNESS (R1 NOTE-1): " + DECLARED.subs + " substitution rows and " +
    DECLARED.reps + " replacement rows, " + DECLARED.prods + " product blocks and " +
    DECLARED.comps + " compose blocks (R2 F4) compared against regions.json's recorded sha256 " +
    "per row and the recorded counts, BEFORE any source file was opened; every one matched.");
  console.log("  SUBSTITUTIONS: " + report.substitutions.length +
    " rows / " + Object.values(report.files).reduce((a, b) => a + b.substitutionsApplied, 0) +
    " occurrences applied after the witness passed");
  if (report.replacements.length) {
    console.log("  REPLACEMENTS (S-R21, each an S-R17 (g) STOP declared in advance): " +
      report.replacements.length + " rows");
    for (const rp of report.replacements) {
      console.log("    " + rp.file + " " + rp.id + " :" + rp.lines[0] + "-:" + rp.lines[1] +
        "  " + rp.removed + " released line(s) -> " + rp.inserted + " call line(s)");
      for (const l of rp.to) console.log("        + " + l);
    }
  }
  if (report.drift.length) {
    console.log("  LINE DRIFT from the tip cross-check (content anchors still resolved):");
    for (const d of report.drift) console.log("    " + d.file + " " + d.id + " tip " + d.tip.join("-") + " -> " + d.here.join("-"));
  } else {
    console.log("  LINE DRIFT: none; every region resolved at its tip line numbers");
  }
  for (const [file, rows] of Object.entries(report.bootOrder || {})) {
    const moved = rows.filter((r) => r.region);
    if (!moved.length) continue;
    console.log("  BOOT ORDER in " + file + ": " + rows.length +
      " executable statements at the mount's own top level, " + moved.length + " of them moved");
    for (const r of rows) {
      console.log("    :" + String(r.line).padStart(4) + "  " +
        (r.region ? (r.regionKind === "replace" ? "REPLACE " : "MOVED   ") + r.region : "released") +
        "  " + r.type);
    }
  }
}
