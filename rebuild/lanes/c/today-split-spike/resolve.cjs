#!/usr/bin/env node
/* resolve.cjs - the ONE anchor resolver, shared by cut.cjs, census.cjs, capture.cjs and
 * gen-witness.cjs (S-R20, S-R23).
 *
 * Before this file each instrument carried its own copy and only cut.cjs's copy refused
 * anything, so census.cjs resolved a mangled anchor silently. One resolver, one set of
 * refusals, every instrument.
 *
 * WHAT IT REFUSES, by region id:
 *   - a first anchor that matches ZERO places
 *   - a first anchor whose occurrence index does not exist
 *   - a first anchor that matches several places with no disambiguating index
 *   - a first anchor whose number of matches is not the number the table RECORDED
 *   - a last anchor it cannot find at or after the first
 *
 * THE RECORDED OCCURRENCE COUNT (blind review F5, incremental review F1). An anchor with
 * `ambiguousOk` takes occurrence `nth` out of however many there happen to be, and until
 * this check the "however many" was recorded as prose nobody read. The reviewer prepended
 * a five-line helper declaring its OWN `const sleepNightDate` and its own
 * `    const date = sleepNightDate();`; that text became occurrence #1, TA-I042's real
 * target slid to #2, and the cut exited 0 at both named refs having rewritten the WRONG
 * lexical binding - the output returned "SEALED" where the input returned "LOCAL". The
 * one-line digest cannot tell the two apart: they are the same line of text. What tells
 * them apart is that there were two of them at both named refs and now there are three.
 * `first.occurrences` is that number, taken by gen-witness.cjs at both refs, and a count
 * that no longer matches is refused here for every instrument at once. 182 of the 182
 * WITNESSED regions carry it - 41 move and 141 replace; the table's other 20 rows are seams,
 * which are witnessed by nothing because nothing moves them - and only TA-I042 has more than
 * one match. (The earlier "202 of the 202" counted the seams in; loop round 2, D7.)
 *
 * THE WITNESSED ENCLOSING CONTEXT (loop round 2, B1). The count above is not the binding.
 * The reviewer kept the count at the witnessed 2 by ADDING one occurrence and taking one
 * away: prepend a helper holding the same line of text and add ONE LEADING SPACE to the
 * real target, and there are two occurrences again, the ordinal `nth: 1` now names the
 * PLANT, and the cut rewrote the helper and left the real released call bare after its
 * binding had moved into the seal. Measured at both named refs: cut exit 0, the emitted
 * helper returns "SEALED" where the input returned "LOCAL", and the composed page throws
 * "sleepNightDate is not defined" on api.render("sleep").
 *
 * So an anchor that matches more than once is no longer resolved BY ORDINAL at all. It must
 * carry `first.context`: the exact lines immediately BEFORE and AFTER it, and the exact text
 * of the nearest enclosing block header (the first line above it at a smaller indent that
 * opens a block). Exactly one occurrence may match that context; zero and two are both
 * refused BY REGION ID. The ordinal is not consulted when a context is declared. The context
 * is itself witnessed at both named refs from git objects, so a table-side context edited to
 * fit a plant contradicts the witness in cut.cjs (see checkWitness's contextSha).
 *
 * WHAT IT CANNOT REFUSE, said plainly: the LAST anchor's ambiguity is not visible to a
 * resolver or to a parser. 24 of the move regions end on a bare two-space `}`; a
 * statement-aligned line inserted inside a region moves that brace earlier and a space added
 * to the region's own brace moves it later, and BOTH results are structurally well formed -
 * every boundary still falls between statements, `node --check` still passes, and the only
 * thing that changed is WHICH lines the region holds. The check for that is the recorded
 * extent in regions.json's witness block, and cut.cjs makes it (S-R19, S-R20). This resolver
 * returns the occurrence list so cut.cjs can print the competing candidates by line.
 */
"use strict";

function indentOf(s) { let n = 0; while (n < s.length && s[n] === " ") n += 1; return n; }

/* The nearest enclosing block header: the first non-blank line above `line1` whose indent is
   SMALLER than the anchor's and which opens a block. It is the anchor's lexical home said in
   one line of the file's own text, and no parser is needed for it, so census.cjs, capture.cjs
   and gen-witness.cjs hold the same rule cut.cjs holds. */
function enclosingHeader(lines, line1) {
  const ind = indentOf(lines[line1 - 1]);
  for (let i = line1 - 2; i >= 0; i -= 1) {
    const l = lines[i];
    if (!l.trim()) continue;
    if (indentOf(l) < ind && /\{\s*$/.test(l)) return l;
  }
  return null;
}

function contextAt(lines, line1, ctx) {
  const before = ctx.before || [];
  const after = ctx.after || [];
  for (let k = 0; k < before.length; k += 1) {
    if (lines[line1 - 1 - before.length + k] !== before[k]) return false;
  }
  for (let k = 0; k < after.length; k += 1) {
    if (lines[line1 + k] !== after[k]) return false;
  }
  if (typeof ctx.enclosing === "string" && enclosingHeader(lines, line1) !== ctx.enclosing) return false;
  return true;
}

function resolve(lines, region, file, fail) {
  const wanted = region.first.text;
  const hits = [];
  for (let i = 0; i < lines.length; i += 1) if (lines[i] === wanted) hits.push(i + 1);
  if (hits.length === 0) {
    fail(file + " " + region.id + ": first anchor matches ZERO places: " + JSON.stringify(wanted));
  }
  if (typeof region.first.occurrences === "number" && hits.length !== region.first.occurrences) {
    fail(file + " " + region.id + ": first anchor matches " + hits.length + " places and the " +
      "table RECORDED " + region.first.occurrences + " at its named refs. A competing " +
      "occurrence of an anchor's own text binds the region to a DIFFERENT declaration and " +
      "no digest of one line can see it (blind review F5, incremental review F1): " +
      JSON.stringify(wanted));
  }
  if (hits.length < region.first.nth) {
    fail(file + " " + region.id + ": first anchor has " + hits.length + " matches, wanted #" +
      region.first.nth + ": " + JSON.stringify(wanted));
  }
  if (hits.length > 1 && region.first.nth === 1 && !region.first.ambiguousOk) {
    fail(file + " " + region.id + ": first anchor matches " + hits.length +
      " places and the table gives no disambiguating index: " + JSON.stringify(wanted));
  }
  /* LOOP ROUND 2, B1: an anchor that matches more than once is bound by its WITNESSED
     ENCLOSING CONTEXT and never by its ordinal. */
  const ctx = region.first.context;
  let start;
  if (hits.length > 1 || ctx) {
    if (!ctx) {
      fail(file + " " + region.id + ": first anchor matches " + hits.length + " places and the " +
        "row declares NO `first.context`. An ordinal among identical lines does not identify a " +
        "binding: one occurrence added and one leading space on the real target keep the count " +
        "and hand the ordinal to the plant (loop round 2, B1). Declare the lines before and " +
        "after it and its enclosing block header: " + JSON.stringify(wanted));
    }
    const keep = hits.filter((h) => contextAt(lines, h, ctx));
    if (keep.length !== 1) {
      fail(file + " " + region.id + ": the declared `first.context` matches " + keep.length +
        " of the " + hits.length + " occurrences at :" + hits.join(" :") + " (matching: :" +
        (keep.join(" :") || "none") + "). Exactly one occurrence of an ambiguous anchor may " +
        "sit in the witnessed context - before " + JSON.stringify(ctx.before || []) + ", after " +
        JSON.stringify(ctx.after || []) + ", inside " + JSON.stringify(ctx.enclosing || null) +
        " - and the ordinal is not consulted (loop round 2, B1): " + JSON.stringify(wanted));
    }
    start = keep[0];
  } else {
    start = hits[region.first.nth - 1];
  }
  const lastText = region.last.text;
  const lastHits = [];
  for (let i = start - 1; i < lines.length; i += 1) if (lines[i] === lastText) lastHits.push(i + 1);
  if (lastHits.length < region.last.nthFrom) {
    fail(file + " " + region.id + ": last anchor #" + region.last.nthFrom +
      " not found after line " + start + ": " + JSON.stringify(lastText));
  }
  const end = lastHits[region.last.nthFrom - 1];
  return { start, end, firstHits: hits, lastHits };
}

/* The canonical serialization of an anchor's ACTUAL context in a source, taken at the line
   the resolver chose. gen-witness.cjs records its sha256 at each named ref; cut.cjs
   recomputes it on the tree it is cutting and refuses when the two differ, so a `context`
   edited in the table to fit a plant contradicts an outside oracle (loop round 2, B1). */
function contextText(lines, line1, ctx) {
  const nb = (ctx.before || []).length;
  const na = (ctx.after || []).length;
  const before = [];
  for (let k = 0; k < nb; k += 1) before.push(lines[line1 - 1 - nb + k]);
  const after = [];
  for (let k = 0; k < na; k += 1) after.push(lines[line1 + k]);
  return JSON.stringify([before, lines[line1 - 1], after, enclosingHeader(lines, line1)]);
}

module.exports = resolve;
module.exports.resolve = resolve;
module.exports.contextText = contextText;
module.exports.enclosingHeader = enclosingHeader;
