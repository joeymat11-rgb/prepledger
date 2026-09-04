'use strict';

// Frozen v7.56.0 function bodies; cross-module calls resolve through this engine's E.
module.exports = function createPlan(E, { clock, ids }) {
const { RULING_EPOCH, RULED_ORDER, INSERTION_PAIRS } = E;
const mk = (...args) => E.mk(...args);
const isoOf = (...args) => E.isoOf(...args);
const todayStart = (...args) => E.todayStart(...args);

// Copied from frozen src/app.jsx @ fe516c1:656-667.
function dayType(iso, s) {
  const d = mk(iso).getDay();
  const list = (s && s.split) || [];
  let ent = null;
  for (const x of list) if (x && x.from && x.from <= iso) ent = x;
  if (ent && ent.map) { const v = ent.map[d]; return v === "U" || v === "L" ? v : "REST"; }
  if (d === 3) {
    const off = s && s.targets && s.targets.refeedOff;
    return off && iso >= off ? "REST" : "REFEED";
  }
  return d === 1 || d === 4 ? "U" : d === 2 || d === 5 ? "L" : "REST";
}

// Copied from frozen src/app.jsx @ fe516c1:1773-1776.
function forkFrom(s, exId) {
  const fks = forksOf(s, exId);
  return fks.length ? fks[fks.length - 1].from : null;
}

// Copied from frozen src/app.jsx @ fe516c1:1795-1797.
function resetForksOf(s, exId) {
  return forksOf(s, exId).filter((f) => f && (f.kind ? f.kind !== "context" : !f.split));
}

// Copied from frozen src/app.jsx @ fe516c1:1798-1805.
function forksOf(s, exId) {
  try {
    const e9 = ((s && s.exercises) || []).find((x) => x && x.id === exId);
    if (!e9) return [];
    if (Array.isArray(e9.forks)) return e9.forks;
    return e9.fork && e9.fork.from ? [e9.fork] : [];   /* pre-V50 shape, read-compatible */
  } catch (e) { return []; }
}

// Copied from frozen src/app.jsx @ fe516c1:1806-1810.
function eraIdx(forks, d) {
  let i = 0;
  for (const f of (forks || [])) { if (f && f.from <= d) i++; }
  return i;
}

// Copied from frozen src/app.jsx @ fe516c1:1811-1814.
function sameEra(forks, d, at) {
  if (!forks || !forks.length) return true;
  return eraIdx(forks, d) === eraIdx(forks, at);
}

// Copied from frozen src/app.jsx @ fe516c1:1818-1830.
function nameAt(s, exId, d) {
  try {
    const e9 = ((s && s.exercises) || []).find((x) => x && x.id === exId);
    if (!e9) return exId;
    /* FIX 3a — names ride their OWN seams (e.renames[], ascending {from, prevN}),
       independent of the technique forks: four of the six renamed lifts have no
       fork, and forking them to archive a word would have reset instruments that
       measured nothing new. Era k of the NAME history reads renames[k].prevN. */
    const rns = Array.isArray(e9.renames) ? e9.renames : [];
    const i9 = eraIdx(rns, d);
    return i9 < rns.length ? (rns[i9].prevN || e9.n) : e9.n;
  } catch (e) { return exId; }
}

// Copied from frozen src/app.jsx @ fe516c1:1833-1835.
function pinsUnfilled(ex) {
  try { return ((ex && ex.setup ? String(ex.setup).match(/\[PIN\]/g) : null) || []).length; } catch (e) { return 0; }
}

// Copied from frozen src/app.jsx @ fe516c1:1844-1846.
function pinsBornOf(ex) {
  try { return ex && ex.pinsBornAt ? String(ex.pinsBornAt).slice(0, 10) : null; } catch (e) { return null; }
}

// Copied from frozen src/app.jsx @ fe516c1:1858-1858.
function _bornValid(e) { return !!(e && typeof e.sets === "number" && typeof e.hi === "number" && typeof e.setup === "string" && (e.day === "U" || e.day === "L") && typeof e.mg === "string"); }

// Copied from frozen src/app.jsx @ fe516c1:1859-1867.
function exActive(s, id) {
  /* R9 fix-2: quarantine is a RECORD-level fact, not a register entry — see
     patchV51's put(). Both projections answer here. */
  try {
    if (((s && s.retirements) || {})[id]) return false;
    const e9 = ((s && s.exercises) || []).find((x9) => x9 && x9.id === id);
    return !(e9 && e9.quarantined);
  } catch (e) { return true; }
}

// Copied from frozen src/app.jsx @ fe516c1:1876-1987.
function canonicalizePlan(s) {
  /* FIX split-1 (P0-5) — canonicalization is its OWN pass and never stands
     down; only ruled-order enforcement is generation-gated. Deterministic, so
     both merge directions land deeply equal. */
  if (!s) return s;
  /* R9 fix-2 / F1 fix-3 — LEGACY HEALER, now JUDGING BEFORE IT RESTATES:
     round-1 wrote quarantine into the athlete register (key-union merged — the
     poison vector); round-2's healer restated the marker onto WHATEVER record
     was present, so a stale replica's marker stamped a fully VALID fly on both
     sides of a merge and the record-preference rule had no healthy copy left
     to prefer (cowork's executed F1, both orders). The shared predicate rules
     every conversion: marker + VALID record -> heal CLEAN (no flag) · marker +
     invalid record -> flag (earned) · marker + no record -> dropped. */
  for (const [idQ, vQ] of Object.entries(s.retirements || {})) {
    if (String(vQ).indexOf("invalid:") !== 0) continue;
    const eQ = (s.exercises || []).find((x9) => x9 && x9.id === idQ);
    if (eQ && !_bornValid(eQ) && !eQ.quarantined) eQ.quarantined = vQ;
    delete s.retirements[idQ];
  }
  /* F1 generalization — quarantined IFF invalid, enforced at every boundary:
     put() only ever flags records that fail the predicate (and preserves them
     as brought), so a flag on a bornValid record can only be healer poison
     from the defective round-2 bytes or a stale copy — clearing it self-heals
     every state that ran them. Deterministic on record shape, so both merge
     orders converge by construction. */
  for (const eH of (s.exercises || [])) { if (eH && eH.quarantined && _bornValid(eH)) delete eH.quarantined; }
  /* R11-A fix-6 — THE PIN BIRTHDAY, GUARANTEED AT EVERY BOUNDARY. patchV51's
     own backfill only fires for a device crossing v50 -> v51; a v51 backup
     from the interim tips imports through migrate's same-schema fast path
     with birthdays ABSENT, and R11-C's label condition needs the field to be
     well-defined everywhere. Fill-if-absent, never overwritten, idempotent,
     value := the record's own setupAt (else RULING_EPOCH) — the same rule
     patchV51 applies, at the pass that already reaches import, merge, sync and
     restore (verified: a round-2-era poisoned backup heals through this exact
     chain). Deterministic on record shape, so both merge orders agree, and
     the earliest-wins union then reconciles replicas. */
  for (const eB of (s.exercises || [])) {
    if (!eB || eB.pinsBornAt) continue;
    if (pinsUnfilled(eB) > 0 || eB.pinsSeen || eB.calibratedAt) eB.pinsBornAt = eB.setupAt || RULING_EPOCH;
  }
  /* FIX split-1 (P1-2/P1-8) — tombstone cleanup reruns at every boundary: a
     stale replica whose copy of a retired lift wins the wholesale per-lift
     merge cannot restore the standards the retirement already swept. The
     receipt exists (op-guarded); this is the mechanism staying true to it. */
  for (const id9 of Object.keys(s.retirements || {})) {
    const e9 = (s.exercises || []).find((x) => x && x.id === id9);
    if (e9 && (e9.std || e9.own || e9.reclaim)) { e9.std = null; e9.own = false; e9.reclaim = null; }
  }
  /* C2/Q3 — THE INSERTION SEAMS ARE DERIVED HERE, at the one pass boot, merge and import
     all go through. Runs BEFORE the fork housekeeping below so the collapse and sort see
     the derived set. */
  deriveInsertionSeams(s);
  for (const e of (s.exercises || [])) {
    if (!e || !Array.isArray(e.forks) || !e.forks.length) continue;
    /* legacy restatement: a pre-fix runtime insertion fork carried its why but
       no ops identity — the why has always MEANT the operation, so lifting it
       into ops is a restatement, not an invention. Cue seams are untouched. */
    for (const f of e.forks) { if (f && !f.ops && f.why && / inserted upstream$/.test(String(f.why))) { f.ops = [f.why]; f.split = true; } }
    /* C2/Q3 — THE LEGACY RE-DATER IS RETIRED. It pushed a split seam past the latest
       entry on/after it whose `og` was null or < 51 — the in-flight rule, written to keep a
       STORED seam ahead of a session already on the record. Derived seams have no such job:
       the date IS the exposure, computed from sessionLog every time, so a rule that moved
       it could only move it away from the truth. Executed: this rule alone re-dated
       extension/ham/abs/hanging to 08-15 at the next boot and brought the repeats back,
       in both merge directions. Its removal is source-pinned (T5). */
    if (e.forks.length > 1) {
      /* same-OPERATION different-date seams collapse to the EARLIEST sighting
         (two devices firing the same insertion offline saw one event twice);
         then same-date composites union deterministically. */
      const byOp = new Map(); const keep = [];
      for (const f of e.forks.slice().sort((a, b) => (a.from < b.from ? -1 : 1))) {
        const opKey = f && f.split && (f.ops || f.why) ? [...new Set(f.ops || [f.why])].sort().join("+") : null;
        if (opKey == null) { keep.push(f); continue; }
        if (!byOp.has(opKey)) { byOp.set(opKey, f); keep.push(f); }
      }
      /* PROGRESSION-1 FIX-1 (Grok's H2, executed) — A COMPOSITE MAY ONLY EAT ITS OWN CLASS.
         This union was written when every same-date pair was one thing: two devices seeing one
         insertion twice. This round made CROSS-CLASS same-date pairs reachable — a context seam
         now DERIVES at a runtime date (ham's, on the first hip-thrust-and-ham co-performance
         day), and that is exactly the day the athlete is most likely to also change the ham
         setup. The union then built a fresh literal with no `kind` and inherited split from the
         seam, so the athlete's TECHNIQUE fork was absorbed into a kind-less split composite that
         the back-compat cut reads as context — and the next boot's deriver, seeing a context
         fork it did not derive, deleted it. Executed on his live blob: boot 1 absorbed "pause
         added", boot 2 destroyed it, boots 2 and 3 converged on the loss, silently and with no
         receipt. A technique change is athlete-authored protocol history and carries semantics a
         context seam does not (standards retire, the era resets); it is never the union's to eat.
         So: only PROJECTION-class forks composite. A reset-bearing fork — kind "technique", or
         kind-less and unsplit — passes through untouched even when it shares a date with a seam.
         Same-class composites now carry `kind` explicitly, so a genuine two-device double
         sighting of one derived seam stays "context" instead of falling back to the legacy
         kind-less encoding. Two forks on one date is a legal shape (a zero-width era), ordered
         deterministically: by date, then reset-bearing before projection. */
      const isProj9 = (f) => !!(f && (f.kind ? f.kind === "context" : f.split));
      const byFrom = new Map(); const solo9 = [];
      for (const f of keep) {
        if (!isProj9(f)) { solo9.push(f); continue; }   /* a reset-bearing fork is never absorbed */
        if (byFrom.has(f.from)) {
          const p = byFrom.get(f.from);
          const ops = [...new Set([...(p.ops || [p.why]), ...(f.ops || [f.why])])].sort();
          byFrom.set(f.from, { from: f.from, why: ops.join(" + "), ops, prevN: p.prevN || f.prevN, ...((p.kind || f.kind) ? { kind: p.kind || f.kind } : {}), split: p.split || f.split });
        } else byFrom.set(f.from, f);
      }
      e.forks = [...solo9, ...byFrom.values()].sort((a, b) => {
        if (a.from !== b.from) return a.from < b.from ? -1 : 1;
        const pa = isProj9(a) ? 1 : 0, pb = isProj9(b) ? 1 : 0;   /* reset-bearing first on a tie */
        return pa - pb;
      });
    } else e.forks = e.forks.slice().sort((a, b) => (a.from < b.from ? -1 : 1));
  }
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:1988-2007.
function normalizePlan(s) {
  if (!s) return s;
  canonicalizePlan(s);
  if (s.planGen !== 51) return s;   /* ruled-ORDER enforcement alone stands down past the ruling's generation */
  const have = new Set((s.exercises || []).filter((e) => e && exActive(s, e.id)).map((e) => e.id));
  const ord = {};
  for (const day of ["U", "L"]) {
    const ruled = RULED_ORDER[day].filter((id) => have.has(id));
    /* unknown ids are preserved STABLY even without a local record — a foreign
       lift's record can arrive by merge, and dropping its order slot would be
       the walk deciding what exists. Retired ids are the one exclusion. The
       first cut have-filtered BEFORE this step, which made preservation dead
       code; the sweep pin caught ghost9 vanishing. */
    const cur = ((s.exOrder || {})[day] || []).filter((id) => exActive(s, id));
    const unknown = cur.filter((id) => RULED_ORDER.U.indexOf(id) < 0 && RULED_ORDER.L.indexOf(id) < 0);
    ord[day] = [...ruled, ...unknown.filter((id, i, a) => a.indexOf(id) === i)];
  }
  s.exOrder = ord;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:2037-2071.
function deriveInsertionSeams(s) {
  try {
    if (!Array.isArray(s.feed)) s.feed = [];
    /* out first: every context fork and every seam line, whatever wrote them */
    for (const e of (s.exercises || [])) {
      if (!e || !Array.isArray(e.forks)) continue;
      const keep9 = e.forks.filter((f) => f && (f.kind ? f.kind !== "context" : !f.split));
      if (keep9.length !== e.forks.length) e.forks = keep9;
    }
    s.feed = s.feed.filter((f) => !(f && typeof f.op === "string" && f.op.indexOf("seam:") === 0));
    const dates9 = Object.keys((s && s.sessionLog) || {}).sort();
    const didOn9 = (d, id) => (((s.sessionLog[d] || {}).entries) || []).some((e) => e && e.id === id && Array.isArray(e.reps) && e.reps.length);
    for (const [newId, affected] of INSERTION_PAIRS) {
      const marker9 = (s.insertions || {})[newId];
      if (!marker9) continue;                     /* no plan marker: the insertion is not on this state's record */
      const label9 = newId === "fly" ? "machine fly" : newId === "hipthrust" ? "hip thrust" : (((s.exercises || []).find((x) => x && x.id === newId) || {}).n || newId);
      const why9 = newId === "fly" ? "fly inserted upstream" : newId === "hipthrust" ? "hip thrust inserted upstream" : newId + " inserted upstream";
      for (const affId of affected) {
        const e = (s.exercises || []).find((x) => x && x.id === affId);
        if (!e) continue;
        let seamD9 = null;
        for (const d of dates9) { if (d < marker9) continue; if (didOn9(d, newId) && didOn9(d, affId)) { seamD9 = d; break; } }
        if (!seamD9) continue;                    /* never performed together: no fork, no line */
        const fks9 = Array.isArray(e.forks) ? e.forks : [];
        /* the same FIELD ORDER _settleExit's restatement produces, so one logical fork has one
           byte identity whichever path finalised it — boot restates, merge does not, and a
           key-order difference alone made merge(m,m) != m (the SCALE-5/6 lesson, here for forks) */
        fks9.push({ from: seamD9, why: why9, ops: [why9], prevN: e.n, kind: "context", split: true });
        e.forks = fks9.sort((a, b) => (a.from < b.from ? -1 : 1));
        s.feed.unshift({ op: "seam:" + newId + ":" + affId, d: seamD9, t: e.n.toUpperCase() + " — NEW CONTEXT", how: "The " + label9 + " now runs ahead of this lift and works a muscle it shares, so what a session costs here changed. This marks what is comparable — records and stalls read either side of it separately. Nothing is owed and no sighting is lost: the line carries on from where it was." });
      }
    }
  } catch (e) {}
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:2072-2089.
function applyInsertionSeams(s, newId, affected, dateISO) {
  if (!Array.isArray(s.feed)) s.feed = [];
  const why9 = newId === "fly" ? "fly inserted upstream" : newId === "hipthrust" ? "hip thrust inserted upstream" : newId + " inserted upstream";
  const label9 = newId === "fly" ? "machine fly" : newId === "hipthrust" ? "hip thrust" : (((s.exercises || []).find((x) => x && x.id === newId) || {}).n || newId);
  for (const affId of affected) {
    const e = (s.exercises || []).find((x) => x && x.id === affId);
    if (!e) continue;
    const fks = Array.isArray(e.forks) ? e.forks : (e.fork && e.fork.from ? [e.fork] : []);
    if (e.fork) delete e.fork;
    if (!fks.some((f) => f && ((f.ops && f.ops.indexOf(why9) > -1) || f.why === why9))) {
      fks.push({ from: dateISO, why: why9, ops: [why9], prevN: e.n, split: true });
    }
    e.forks = fks.sort((a, b) => (a.from < b.from ? -1 : 1));
    if (!s.feed.some((f9) => f9 && f9.op === "seam:" + newId + ":" + affId)) s.feed.unshift({ op: "seam:" + newId + ":" + affId, d: dateISO, t: e.n.toUpperCase() + " — FRESH BASELINE", how: "The " + label9 + " enters the programme ahead of this lift, so its context changes. History stays on the record under the old order; the instruments start a fresh four-session baseline rather than comparing across the change." });
  }
  s.insertions = { ...(s.insertions || {}), [newId]: (s.insertions || {})[newId] || dateISO };
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:2093-2110.
function eraFresh(s, exId, asOf) {
  /* ERA-AWARE, like everything else: the question is asked OF a date, and the
     answer concerns the era CONTAINING that date. Era 0 is never fresh — its
     behavior must be byte-identical to the pre-fork engine (the suite's pinned
     clock lives there, and so does every frozen fixture). The first cut
     anchored on the LATEST era unconditionally and skipped the earn on
     pre-fork fixtures; six pins caught it before it left the tree. */
  /* C1 — the RESET question reads the TECHNIQUE set only: a context seam (an insertion
     upstream) never makes a lift's next session a fresh baseline. */
  const fks = resetForksOf(s, exId);
  if (!fks.length) return false;
  const ref = asOf || isoOf(todayStart());
  if (eraIdx(fks, ref) === 0) return false;
  for (const d of Object.keys((s && s.sessionLog) || {})) {
    if (d < ref && sameEra(fks, d, ref) && (((s.sessionLog[d] || {}).entries) || []).some((e) => e && e.id === exId)) return false;
  }
  return true;
}

// Copied from frozen src/app.jsx @ fe516c1:2112-2129.
function forkExposures(s, exId) {
  const from = forkFrom(s, exId);
  if (!from) return null;
  /* FIX 3a item 4 — calibration is STATE, not the absence of tokens. Sessions
     logged inside the era but before the pins were filled stay logged and read
     provisional: the comparable window opens at whichever is later. */
  let cntFrom = from;
  try {
    const e9 = ((s && s.exercises) || []).find((x) => x && x.id === exId);
    const cal = e9 && e9.calibratedAt ? String(e9.calibratedAt).slice(0, 10) : null;
    if (cal && cal > cntFrom) cntFrom = cal;
  } catch (e) {}
  let n = 0;
  for (const d of Object.keys((s && s.sessionLog) || {})) {
    if (d >= cntFrom && (((s.sessionLog[d] || {}).entries) || []).some((e) => e && e.id === exId)) n++;
  }
  return n;
}

return {
  dayType, forkFrom, resetForksOf, forksOf, eraIdx, sameEra, nameAt, pinsUnfilled, pinsBornOf, _bornValid, exActive, canonicalizePlan, normalizePlan, deriveInsertionSeams, applyInsertionSeams, eraFresh, forkExposures
};
};
