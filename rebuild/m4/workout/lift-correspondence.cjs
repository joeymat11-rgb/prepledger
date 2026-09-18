'use strict';
/* P3-REAL-SHAPE 2.3 / 2.5 / 2.6 (DECISIONS:520 option A, DECISIONS:521).

   WHERE A LIFT OF THE FILE AND A LIFT OF THE DOCUMENT ARE THE SAME LIFT.
   After option A the two id spaces are independent: the file's ids are the old
   app's short handles and the document's are slugOf's slugs, so an id is no
   longer an answer. The answer is the NAME, and it is stated ONCE, here,
   because three readers ask it - admission's programme rule, admission's
   capture provenance block, and the Edit My Week companion. A second spelling
   of this rule would be a second rule (spec 2.6), so nothing below may be
   restated at a call site.

   NOTHING IN THIS MODULE READS OR WRITES ANYTHING. It is a pure function of the
   two lift lists it is handed. */

/* normaliseName, IN FULL (spec 2.3, review R1 N4). NFKD, combining marks
   removed, lower-cased, every run that is not a Unicode LETTER OR DIGIT
   collapsed to one space, trimmed. The class is UNICODE and not [a-z0-9]: a
   lift named in any script the athlete types in normalises to itself rather
   than to the empty string. A name that survives as EMPTY - a lift called
   '---' - is a lift that cannot be corresponded to anything and cannot be
   shown to him; admission refuses it by name, field `exercise_n`. */
function normaliseName(n) {
  return String(n).normalize('NFKD').replace(/\p{M}+/gu, '').toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

/* The normalised name of each lift, mapped to the ONE lift that carries it, or
   to null where several do. A lift whose name normalises to empty is in no
   index at all: it names nothing, so it corresponds to nothing. */
function uniqueByName(lifts) {
  const index = new Map();
  for (const row of Array.isArray(lifts) ? lifts : []) {
    const key = normaliseName(row && row.n);
    if (!key) continue;
    index.set(key, index.has(key) ? null : row);
  }
  return index;
}

/* correspondence(fileLifts, documentLifts) IS INJECTIVE BY CONSTRUCTION
   (spec 2.3, review R1 B3). It returns, for each DOCUMENT lift id, the ONE FILE
   lift id it answers for. A pair is kept only when the normalised name is
   unique on BOTH sides: exactly one document lift and exactly one file lift
   carry it. Both directions matter, and only the file direction was stated
   before review R1 - several DOCUMENT lifts binding ONE file lift is the
   direction that would let the capture block count one lift twice and let the
   companion edit one basis lift from two rows. Two document rows typed 'Press'
   and 'Press.' normalise alike, so NEITHER corresponds, both are kept as their
   own lifts under spec 2.5 case 2, and nothing is silently merged. */
function correspondence(fileLifts, documentLifts) {
  const byFile = uniqueByName(fileLifts), byDocument = uniqueByName(documentLifts);
  const out = {};
  for (const row of Array.isArray(documentLifts) ? documentLifts : []) {
    const key = normaliseName(row && row.n);
    if (!key || byDocument.get(key) !== row) continue;
    const file = byFile.get(key);
    if (!file) continue;
    out[row.id] = file.id;
  }
  return out;
}

/* THE ID COLLISION, WHICH AFTER OPTION A IS A REAL CASE (spec review R2, small
   thing 2). Where a FILE lift's id equals a DOCUMENT lift's id but the two are
   not the same lift by NAME, the document row is neither corresponded nor
   appended - admission's `held` skip sees the id already present - and both the
   capture block and the companion's `byId.get(row.id)` branch would bind that
   slot or row to a DIFFERENT lift, silently. `slugOf` makes it improbable
   ('hack-squat' v 'hack') and it is not a regression, but the two id spaces are
   now genuinely independent, so it is REFUSED BY NAME rather than left to bind.
   The tie-break is the correspondence rule itself: an id shared by two lifts
   that do not answer for each other is not an answer.
   Returns the colliding DOCUMENT lift ids, in the document's own order. */
function idCollisions(fileLifts, documentLifts) {
  const byId = new Map();
  for (const row of Array.isArray(fileLifts) ? fileLifts : [])
    if (row && typeof row.id === 'string') byId.set(row.id, row);
  const out = [];
  for (const row of Array.isArray(documentLifts) ? documentLifts : []) {
    const file = row && byId.get(row.id);
    if (!file) continue;
    const key = normaliseName(row.n);
    if (!key || key !== normaliseName(file.n)) out.push(row.id);
  }
  return out;
}

/* THE COMPANION'S HALF (spec 2.6). The basis lift a DOCUMENT row answers for,
   when the row's own id is not in the basis at all. The same rule and the same
   `normaliseName`: the name must be carried by exactly ONE basis lift. Where it
   is not, this returns null and the caller refuses - it never guesses.
   The row's own side of the injectivity is the caller's `boundBasis` set: two
   rows that reach the same basis lift are a document this companion cannot edit
   safely, whichever way they reached it. */
function matchByName(baseLifts, row) {
  const key = normaliseName(row && row.n);
  if (!key) return null;
  const found = uniqueByName(baseLifts).get(key);
  return found || null;
}

module.exports = { normaliseName, correspondence, idCollisions, matchByName };
