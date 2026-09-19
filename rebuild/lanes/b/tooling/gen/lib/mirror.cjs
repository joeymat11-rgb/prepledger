'use strict';
/* SEAL-AUTOMATION / mirror.cjs - the substitution the S7 -> S8 mirror actually made.
   MEASURED, not invented: `git diff --no-index rebuild/m4/workout/test/s7-supersede-X
   rebuild/m4/workout/test/s8-supersede-X` over all five supersede cells and the engine
   files differential shows every changed line is one of six token classes, and nothing
   else moves. The six classes are below. They are applied SIMULTANEOUSLY through one
   alternation, so no replacement is ever fed back into another (a naive sequence of
   replaces would turn the grandparent's name into the parent's and then into the
   child's, and every cell would name the wrong package).

   The one place a mirror cannot decide is an ORDINAL PROSE ENUMERATION - "S3 was the
   child, S4 the grandchild, S5 the great-grandchild, S6 the fourth and S7 the fifth",
   "THIS IS THE FIFTH GENERATION", "the TWENTIETH element". Those are a sentence being
   extended, not a token being swapped. They are left as the parent wrote them and each
   one is reported to TODO.md by name and line, for a human to re-read. */

/* One alternation over every token, longest first, replaced in a single pass. */
function compile(pairs) {
  const seen = new Map();
  for (const [from, to] of pairs) if (!seen.has(from)) seen.set(from, to);
  const keys = [...seen.keys()].sort((a, b) => b.length - a.length);
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  /* An id like S7 is swapped only as a whole token: `S7` in `S7.json`, `S7's` and
     `(S7)` all move, `S70` and `MS7` do not. A slug like `s7-` carries its own hyphen. */
  const body = keys.map(k => (/^[A-Za-z]/.test(k) ? '\\b' : '') + esc(k) + (/[A-Za-z0-9]$/.test(k) ? '\\b' : '')).join('|');
  const re = new RegExp('(' + body + ')', 'g');
  return { re, map: seen, keys };
}

/* ctx.chain is the family youngest-last: [ ... greatGrandparent, grandparent, parent,
   child ], each { id, name, slug, artifactSlug, gateLine }. The mirror shifts every
   generation one step younger, which is exactly what the S7 -> S8 diff did:
     M2-S6-TODAY-CHILD -> M2-S7-PORT-ADMISSION -> M2-S8-REAL-SHAPE
     s6- -> s7- -> s8-          S6 -> S7 -> S8
     :490 -> :514 (the PARENT's GATE-SUPERSESSION line takes the grandparent's place) */
function subsFor(ctx) {
  const c = ctx.chain, pairs = [];
  for (let i = 0; i < c.length - 1; i += 1) {
    const a = c[i], b = c[i + 1];
    if (a.name && b.name) pairs.push([a.name, b.name]);                 // class 1: package id
    if (a.artifactSlug && b.artifactSlug) pairs.push([a.artifactSlug, b.artifactSlug]); // class 2: artifact/review slug
    if (a.slug && b.slug) pairs.push([a.slug + '-', b.slug + '-']);     // class 3: cell file-name prefix
    if (a.id && b.id) pairs.push([a.id, b.id]);                         // class 4: the short id
    if (a.gateLine && b.gateLine) pairs.push([':' + a.gateLine, ':' + b.gateLine]); // class 5: the gate-supersession citation
  }
  if (ctx.dispatchLine && ctx.parentDispatchLine) pairs.push([':' + ctx.parentDispatchLine, ':' + ctx.dispatchLine]); // class 6: the dispatch citation
  return compile(pairs);
}
function mirrorText(text, subs) { return text.replace(subs.re, m => (subs.map.has(m) ? subs.map.get(m) : m)); }

/* Lines a mirror must NOT be trusted on: an ordinal or a counted enumeration. The
   generator still emits its best mirror of them, and names every one in TODO.md.

   R1 N7 narrowed this, and the reason matters more than the regex. TODO.md is the first
   thing the PM reads and it is the generator's whole answer to "what could I not decide";
   a detector that fires on the bare word `second` turns fourteen of sixty-seven entries
   into `second-gate`, "re-run in a second" and "a second, independent source of bytes",
   and teaches the reader to skim the one list that must be read. So:
     STRONG - `fourth` upward, plus `grandchild` / `great-grandchild`: these words only
              appear in this repo when a generation is being counted. They always fire.
     WEAK   - `first`, `second`, `third`, `generation(s)`: they fire only when the word
              stands as a WORD (never inside `second-gate`) and something countable stands
              NEXT TO IT - a digit, an S-id, an M2- name, or a family word. "the second
              gate of the nineteen" fires; "re-run in a second" does not. */
const ORDINAL_STRONG = /\b(fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth|thirteenth|fourteenth|fifteenth|sixteenth|seventeenth|eighteenth|nineteenth|twentieth|twenty-first|great-grandchild|grandchild)\b/i;
const ORDINAL_WEAK = /(?<![-\w])(first|second|third|generations?)(?![-\w])/i;
const COUNTABLE_NEAR = /(\bS\d+\b|\bM2-|\b\d+\b|\b(child|grandchild|generation|package|element|id)s?\b)/i;
const NEAR = 24;                                   // characters either side: "next to it"
function isOrdinalProse(line) {
  if (ORDINAL_STRONG.test(line)) return true;
  const m = ORDINAL_WEAK.exec(line);
  if (!m) return false;
  return COUNTABLE_NEAR.test(line.slice(Math.max(0, m.index - NEAR), m.index + m[0].length + NEAR));
}
function prosePlaces(text, file) {
  const out = [];
  text.split('\n').forEach((l, i) => { if (isOrdinalProse(l)) out.push({ file, line: i + 1, text: l.trim().slice(0, 160) }); });
  return out;
}
module.exports = { compile, subsFor, mirrorText, prosePlaces, isOrdinalProse, ORDINAL_STRONG, ORDINAL_WEAK };
