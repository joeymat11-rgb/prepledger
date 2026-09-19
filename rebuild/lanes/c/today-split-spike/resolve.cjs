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
 *   - a last anchor it cannot find at or after the first
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

function resolve(lines, region, file, fail) {
  const wanted = region.first.text;
  const hits = [];
  for (let i = 0; i < lines.length; i += 1) if (lines[i] === wanted) hits.push(i + 1);
  if (hits.length === 0) {
    fail(file + " " + region.id + ": first anchor matches ZERO places: " + JSON.stringify(wanted));
  }
  if (hits.length < region.first.nth) {
    fail(file + " " + region.id + ": first anchor has " + hits.length + " matches, wanted #" +
      region.first.nth + ": " + JSON.stringify(wanted));
  }
  if (hits.length > 1 && region.first.nth === 1 && !region.first.ambiguousOk) {
    fail(file + " " + region.id + ": first anchor matches " + hits.length +
      " places and the table gives no disambiguating index: " + JSON.stringify(wanted));
  }
  const start = hits[region.first.nth - 1];
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

module.exports = resolve;
module.exports.resolve = resolve;
