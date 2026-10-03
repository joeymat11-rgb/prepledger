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

/* S11 FC09 round 6 (PM ruling DECISIONS:881 and its round-6 ruling, option (b') of the FC09 Q3 seam design). THE LINEAGE
   RESOLVER: the FOURTH reader of this one rule. A native-load record (NATIVE-LOAD-SPEC) keeps the lift id it was issued
   under, forever; after option A the admitted state may carry that same lift under the FILE's id. The native-load fold
   (m4/workout/native-load-effects.cjs, FC03) resolves every lift JOIN through this one closed map, at read time, and never
   rewrites a record. It is built HERE, from the setup document's lifts and the admitted state's lifts, and both callers
   (m3/w6/local/today-bindings.mjs and m3/w6/local/source-admission.mjs) build it with exactly these two lists.
   AN ID THE STATE CARRIES IS ITSELF: before any import the state IS the document's (its ids are the document's slugs, and a
   lift the athlete later renamed in Edit My Week keeps its id), and after one the file's ids are the state's. Only a
   document id the state does NOT carry is corresponded, by `correspondence` above: DOCUMENT id -> STATE id. With no
   document, or no such id, the pairs are empty: the identity. (An id two different lifts share across the file and the
   document never reaches here: admission refuses it by name, `idCollisions`, before anything is admitted.)
   CLOSED AND REFUSING: a list that is not a list of lifts with unique non-empty ids is refused BY NAME (refused:
   {code, field, lift}); FC03 then refuses its fold, field 'lineage'. A record whose id is neither carried nor corresponded
   is FC03's own S1 refusal, by name. Nothing is resolved by a guess. */
const RESOLVER_PROFILE = 'earned/lift-resolver/v1';
function liftResolver(stateLifts, documentLifts) {
  const refuse = (field, lift = null) => Object.freeze({ profile: RESOLVER_PROFILE, pairs: null,
    refused: Object.freeze({ code: 'LIFT_RESOLVER_REFUSED', field, lift }) });
  const idOf = (row) => (row && typeof row.id === 'string' && row.id ? row.id : null);
  if (!Array.isArray(stateLifts)) return refuse('state');
  if (documentLifts === null || documentLifts === undefined) documentLifts = [];
  if (!Array.isArray(documentLifts)) return refuse('document');
  const ids = new Set(), documentIds = new Set();
  for (const row of stateLifts) { const id = idOf(row); if (!id || ids.has(id)) return refuse('state', id); ids.add(id); }
  for (const row of documentLifts) { const id = idOf(row); if (!id || documentIds.has(id)) return refuse('document', id); documentIds.add(id); }
  const pairs = {}, targets = new Set();
  for (const [doc, file] of Object.entries(correspondence(stateLifts, documentLifts))) {
    if (doc === file || ids.has(doc)) continue;
    // A target that is ANOTHER document lift's own id would merge two lineages into one: ambiguous, refused by name.
    if (!ids.has(file) || targets.has(file) || documentIds.has(file)) return refuse('ambiguous', doc);
    targets.add(file); pairs[doc] = file;
  }
  return Object.freeze({ profile: RESOLVER_PROFILE, pairs: Object.freeze(pairs), refused: null });
}

module.exports = { normaliseName, correspondence, idCollisions, matchByName, liftResolver, RESOLVER_PROFILE };
