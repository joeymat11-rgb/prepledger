"use strict";

// Complete frozen merge range; instance-local bindings, including overlapping migration helpers.
module.exports = function createMerge(E, { clock }) {
const _skinSeriesKey = (...args) => E._skinSeriesKey(...args);
const normalizePlan = (...args) => E.normalizePlan(...args);
const reconcileDebutQueue = (...args) => E.reconcileDebutQueue(...args);
const reconcileEraTransitions = (...args) => E.reconcileEraTransitions(...args);
const reconcileReadReceipts = (...args) => E.reconcileReadReceipts(...args);
const reconcileSightings = (...args) => E.reconcileSightings(...args);
const reconcileSuggestionEffects = (...args) => E.reconcileSuggestionEffects(...args);
const reconcileTrendChain = (...args) => E.reconcileTrendChain(...args);

// BEGIN frozen src/app.jsx @ fe516c1:13371-14452 (only _stampCorr clock injection).
function _mergeScore(v) { try { if (v && Array.isArray(v.entries)) { const b9 = v.corrLog ? { ...v, corrLog: undefined } : v; return v.entries.length * 1e6 + JSON.stringify(b9).length; } return JSON.stringify(v == null ? "" : v).length; } catch (e) { return 0; } }   /* v7.54.0 — the score measures the BODY. corrLog is metadata about corrections, not evidence of a richer session, and counting its bytes would let a record win a length tie for carrying the very corrections the replay is about to apply anyway. */
function _richer(x, y) { return _mergeScore(y) >= _mergeScore(x) ? y : x; }   // ties -> local (y)
/* SCALE-6 — the read authority rule, hoisted: the SAME total order picks a day's read at
   the MERGE and at every SETTLE (Sol's pass-4 B1c: an imported state with two reads for
   one date booted carrying both and replayed both; its first self-merge collapsed them —
   the boot was not a fixed point). Class first (clean > sealed > late), then record
   length, then the canonical byte tie — transitive, direction-free. */
const _readRank9 = (r) => (r && r.sealed ? 1 : r && r.offWindow ? 0 : 2);
const _readPick = (a, b) => {
  const ra = _readRank9(a), rb = _readRank9(b);
  if (ra !== rb) return ra > rb ? a : b;
  const la = JSON.stringify(a).length, lb = JSON.stringify(b).length;
  if (la !== lb) return la > lb ? a : b;
  return _canonJ(a) <= _canonJ(b) ? a : b;
};
/* CORRECTION_MERGE — how a deliberate correction survives a sync.

   _mergeScore is entries.length * 1e6 + json length, so a record with MORE entries always
   wins. That is refuse-to-shrink and it is correct for ordinary syncs. But a correction
   REMOVES an entry, so it scores a full million lower and loses to any device still
   holding the uncorrected copy. Measured on the real 2026-07-31 record: phone 548,
   corrected 491. Two repairs were made and both were silently reverted by the phone.

   Joe: "never lose data" had quietly become "never admit a mistake". The record could not
   be corrected downward at all, which is a data-integrity hole in an app whose entire
   claim is that the record is honest.

   A correction therefore carries an EXPLICIT stamp, written only by the two correction
   controls. Nothing is inferred from a count going down: an unmarked shrink still loses,
   exactly as before. The rules, in order:

     1. neither stamped                 -> _richer, unchanged. Refuse-to-shrink holds.
     2. one stamped, other NOT newer    -> the stamped side wins. The broken case.
     3. one stamped, other IS newer     -> the OTHER side wins. A stale correction must
        never revert work logged after it — that would eat a session, which is worse than
        the bug being fixed.
     4. both stamped                    -> later corr.at; equal at -> higher rev; equal
        both -> _richer; tie -> local. Stated in full because an undefined tiebreak in a
        merge rule is how this class of bug returns.

   KNOWN LIMITATION, deliberately not fixed: a session is replaced WHOLESALE per date, so
   if two devices correct the same session the loser's correction is discarded rather than
   combined. Fixing that means entry-level reconciliation inside a session — a much larger
   change to the merge shape, and it earns nothing for one athlete on one phone. If you
   came here to improve this, that is the trade you would be making.

   Additive: `corr` absent means unstamped, so no SCHEMA_V bump (the `pace` precedent). */
/* _stampCorr — mark a session record as DELIBERATELY corrected. Both correction controls
   go through this so they cannot drift apart, and nothing else may call it: the stamp is
   the difference between a correction and a shrink, and inferring it would defeat the
   whole rule. rev increments so two corrections from one device stay ordered. */
function _stampCorr(rec) {
  const prev = rec && rec.corr && typeof rec.corr === "object" ? rec.corr : null;
  rec.corr = { at: clock.nowISO(), rev: (prev && isFinite(+prev.rev) ? +prev.rev : 0) + 1 };
  return rec;
}

function _corrOf(v) {
  const c = v && v.corr;
  if (!c || typeof c !== "object") return null;
  const at = typeof c.at === "string" && c.at ? c.at : null;
  if (!at || !isFinite(Date.parse(at))) return null;        // malformed -> unstamped, falls to rule 1
  const rev = isFinite(+c.rev) ? +c.rev : 0;
  return { at, rev };
}
/* LEG 3 FIX 4 — the canonical missing-value serializer for the stamped-field
   tie-break. undefined is UNORDERABLE against a string, so it must be given a
   value that loses to every present one: "". Shared by every STAMPED_FIELDS
   row, because the same hole sits under all of them. */
function _valOr(x) { return x === undefined ? "" : JSON.stringify(x); }
/* leg 7 — `last` RIDES THE LOAD. ex.last means "the reps last done at THIS
   load, or null: a deliberate reseed" — it is meaningful only beside the w it
   describes. It carries no stamp of its own, so it used to ride whichever
   whole record won the merge: an adopting replica (last nulled by the reseed)
   and a stale replica (last still live at the old load) then disagreed BY
   MERGE ORDER on an unstamped field — the exact class the deep order-equality
   pins exist to kill, re-manufactured by leg 7's own null. When w moves on
   its stamp, the winner's last state moves with it, including an absent key —
   the pair travels together, exactly as steps was made to travel in leg 2. */
function _takeStamped(w2, other, f9, at9) {
  const n2 = { ...w2, [f9]: other[f9], [at9]: other[at9] };
  if (f9 === "w") for (const c9 of CACHE_RIDERS) { if (c9 in other) n2[c9] = other[c9]; else delete n2[c9]; }
  return n2;
}
/* THE CACHES THAT RIDE THE LOAD. Both are denormalised copies of the lift's
   newest logged line, both are written together by completeSession, and NEITHER
   carries a stamp of its own — so each rides whichever whole record wins the
   merge. That is safe only while the boot can re-derive them, and it cannot
   when the lift has no logged line left: deriveLastMeta returns null, the heal
   does `continue`, and the cache keeps whatever the merge happened to hand it.
   FOUND BY THE HARNESS (v7.54.0 leg 2, aimed seed 14413): after a lift's only
   session entry was skipped away, the two merge orders settled with different
   lastMeta.rir and lastMeta.rirSets on the same lift. `last` was given this
   treatment in leg 7 for the identical reason; lastMeta is its twin and was
   simply not noticed then. */
const CACHE_RIDERS = ["last", "lastMeta"];
/* ---------- THE SESSION-MERGE LAW (v7.54.0) — PER-CORRECTION PROVENANCE ----------
   WHY THIS EXISTS, measured, twice. A session record's `corr` is ONE (at, rev)
   scalar, and the 8/09 record carries TWO independent corrections: the ✕ that
   marked Pronated EZ curl skipped, and the strike of the un-attested arm tails.
   No rev value orders one without colliding the other — executed during the
   load round, stamping the un-ordered replica so it could compete made the pair
   TIE, _richer picked the 9-entry side, and the athlete's skip was REVERTED in
   BOTH merge orders, past dataLossGuard (which only refuses shrinks). And
   because a replica that never learned a correction is always "richer" — more
   entries, longer tails — an un-struck copy beats a struck one whenever the
   stamps do not separate them. That is the resurrection mechanism found live.

   So corrections stop sharing one scalar. Each deliberate correction files its
   own keyed, append-only entry; the union of both sides' entries is replayed
   over the richer body. Because the entries are keyed and each replay is a
   restatement of a value, the result is the same from either direction — the
   body no longer decides which corrections survive.

   `corr` (at, rev) is UNCHANGED and still orders the record; it simply no
   longer decides the entry set.

   THE RITUAL, permanently — the same shape as the wCorrAt ritual: any writer
   that deliberately changes an already-logged session files a corrLog entry in
   the same breath, and an entry that REMOVES something carries what it removed
   (`to`), because a replay that cannot restore is a delete wearing a
   correction's name. THE RITUAL EXTENDS (v7.54.1) to any writer that REWRITES
   an already-logged entry: it files an `amend` in the same breath, so a later
   re-log can be ordered against an earlier correction's payload instead of
   racing it.

   THE KEY NAMES AN ACT, NOT A STATE (v7.54.1). It used to be
   `<kind>:<date>:<id>`, so a third deliberate act on one lift COLLIDED with
   the first and was dropped: skip, un-skip, skip replayed to un-skipped and the
   record contradicted the athlete's last word. The instant is part of the key
   now. The same act sighted on two devices is the same object with the same
   instant, so it still collapses to one entry, and the derived backfill
   produces the same key everywhere. */
const CORR_KINDS = ["skip", "unskip", "strike", "amend"];
/* live: true means an act happening NOW, through a handler, on a device whose
   clock cannot be trusted to move forward. A PATCH filing is a historical
   restatement — several ops sharing one instant is that record's history, not a
   clock fault — so it files at the record's own stamp, bumps nothing, and never
   touches rec.corr. Without this split a boot REWROTE his correction stamps
   (8/09 …31.672Z -> …31.673Z, 8/14 …13.968Z -> …13.970Z) because the backfill
   files several ops at one at: idempotent, but a boot must not rewrite an
   athlete stamp, and a migrated replica would out-order an un-migrated one on
   at alone. */
function _fileCorr(rec, op, kind, id, at, to, opts) {   /* op is a REQUEST: on a LIVE act _fileCorr owns the effective stamp and rebuilds the key from it when the record's own history forces one */
  try {
    if (!rec || typeof rec !== "object" || !op || CORR_KINDS.indexOf(kind) < 0) return rec;
    let at9 = typeof at === "string" && isFinite(Date.parse(at)) ? at : ((rec.corr && rec.corr.at) || null);
    if (!at9) return rec;
    const log9 = Array.isArray(rec.corrLog) ? rec.corrLog.slice() : [];
    /* v7.54.4 — THE RECORD'S OWN HISTORY IS THE CLOCK. Replay orders corrections
       by `at`, and `at` comes from new Date() — but a device's clock is not
       monotone: an NTP correction or a hand-set clock gives a LATER act an
       EARLIER stamp, and then the device's own body disagrees with the replay of
       its own corrLog. Found by --explore: seed 883544's replica skipped rows at
       08-20 and un-skipped it at 08-09, ended with rows logged (last act wins on
       the device), and replayed to skipped — every merge from then on carried
       the contradiction. 17 of 17 remaining explore hits were this one class.
       So a new act on a record is at least one millisecond after the latest act
       already on it. Cross-device first-sighting is untouched: that path is
       value-keyed on the op and returns before this. */
    const latest9 = log9.reduce((m9, c9) => (c9 && String(c9.at || "") > m9 ? String(c9.at) : m9), "");
    if ((opts && opts.live) && latest9 && String(at9) <= latest9) {
      at9 = new Date(Date.parse(latest9) + 1).toISOString();
      /* AND THE KEY CARRIES THE EFFECTIVE STAMP. The bump used to happen AFTER
         the caller had already built the op from its RAW wall stamp, and the
         dedup matched on that key — so a third act repeating the first raw
         stamp collided with it and was DROPPED: two ops filed for three acts,
         and the record's body said skipped while a replay of its own corrLog
         said logged. The monotone rule has to reach the identity of the act,
         not just its sort position, or the last word is lost.
         Only rebuilt when the bump actually fires, so every key already on a
         device stays exactly as it was. */
      op = String(op).split(":").slice(0, 3).join(":") + ":" + at9;
      /* and the record-level stamp agrees with its own newest act */
      if (rec.corr && typeof rec.corr === "object" && String(rec.corr.at || "") < at9) rec.corr = { ...rec.corr, at: at9 };
    }
    const i9 = log9.findIndex((c9) => c9 && c9.op === op);
    if (i9 > -1) {
      /* a correction is a FIRST SIGHTING, like pinsBornAt: the earliest witness
         wins, so a device that learns it late cannot re-date it. */
      if (String(at9) < String(log9[i9].at || "")) log9[i9] = { ...log9[i9], at: at9 };
      else return rec;
    } else {
      log9.push({ op, kind, ...(id ? { id } : {}), at: at9, ...(to === undefined ? {} : { to }) });
    }
    log9.sort((a9, b9) => (String(a9.at) + "|" + a9.op < String(b9.at) + "|" + b9.op ? -1 : 1));
    rec.corrLog = log9;
  } catch (e) {}
  return rec;
}
function _unionCorrLog(x, y) {
  const out9 = [];
  const seen9 = new Map();
  for (const c9 of [...(Array.isArray(x && x.corrLog) ? x.corrLog : []), ...(Array.isArray(y && y.corrLog) ? y.corrLog : [])]) {
    if (!c9 || !c9.op) continue;
    const p9 = seen9.get(c9.op);
    if (!p9) { seen9.set(c9.op, { ...c9 }); continue; }
    if (String(c9.at || "") < String(p9.at || "")) p9.at = c9.at;                 /* earliest at wins — the tiebreak, now that the key names the act */
    /* COMMUTATIVE BY CONSTRUCTION. "first seen keeps its payload" is not: the
       same key arriving with two different payloads resolved by ARRIVAL, so
       union(x,y).to and union(y,x).to differed (executed: [11,10] vs [6,6]).
       Resolve by canonical value instead, the same direction-free rule the
       stamped fields use. */
    if (c9.to !== undefined) {
      if (p9.to === undefined) p9.to = c9.to;
      else if (_canonJ(c9.to) > _canonJ(p9.to)) p9.to = c9.to;
    }
  }
  for (const v9 of seen9.values()) out9.push(v9);
  out9.sort((a9, b9) => (String(a9.at) + "|" + a9.op < String(b9.at) + "|" + b9.op ? -1 : 1));   /* THE SORT IS THE SEMANTICS, not cosmetics: chronological then op is what makes a later act restate an earlier one, and it is why the key must name the act. */
  return out9;
}
/* canonical serialisation — key order is not information, so a value compare
   must not depend on it. */
/* the record stripped of everything a merge can grow — what is left is stable
   under accumulation, so a tie broken on it is associative. */
function _tieKey(rec) {
  try { const { entries, skipped, corrLog, dropped, ...rest } = rec || {}; return _canonJ(rest); } catch (e) { return ""; }   /* dropped is merge provenance, not athlete metadata — a key that includes it changes with the grouping */
}
function _canonJ(v) {
  const c9 = (x) => { if (Array.isArray(x)) return x.map(c9); if (x && typeof x === "object") { const o = {}; for (const k of Object.keys(x).sort()) o[k] = c9(x[k]); return o; } return x; };
  try { return JSON.stringify(c9(v)); } catch (e) { return ""; }
}
function _replayCorrections(rec) {
  try {
    const log9 = Array.isArray(rec && rec.corrLog) ? rec.corrLog : [];
    if (!log9.length) return rec;
    let ents = Array.isArray(rec.entries) ? rec.entries.slice() : [];
    let skip = Array.isArray(rec.skipped) ? rec.skipped.slice() : [];
    for (const c9 of log9) {
      if (!c9) continue;
      if (c9.kind === "skip" && c9.id) {
        ents = ents.filter((e9) => !(e9 && e9.id === c9.id));
        if (!skip.some((z9) => z9 && z9.id === c9.id)) skip = [...skip, { id: c9.id }];
      } else if (c9.kind === "unskip" && c9.id) {
        skip = skip.filter((z9) => !(z9 && z9.id === c9.id));
        /* THE PAYLOAD IS AUTHORITATIVE, inserting when absent and RESTATING
           when present — the same shape strike and amend already have. It used
           to insert only when no entry existed, so against a base that still
           held a stale copy of the lift the reps he typed by hand were quietly
           ignored (executed: a stale [6,6] survived an un-skip carrying
           [11,10,9]). A removal that cannot restore is a delete wearing a
           correction's name, and a restore that cannot overwrite is the same
           thing one step later.
           THE TENSION, named rather than hidden: a plain re-log of that lift
           AFTER the un-skip carries no correction, so chronology cannot order
           it against this payload and the payload would win. THE RITUAL
           EXTENDS to cover it — any writer that rewrites an already-logged
           entry files an amend in the same breath — which is the ritual this
           header already declares, applied to the one writer that did not yet
           observe it. */
        if (c9.to && c9.to.id) {
          if (!ents.some((e9) => e9 && e9.id === c9.id)) ents = [...ents, JSON.parse(JSON.stringify(c9.to))];
          else ents = ents.map((e9) => (e9 && e9.id === c9.id ? { ...e9, ...JSON.parse(JSON.stringify(c9.to)) } : e9));
        }
      } else if ((c9.kind === "strike" || c9.kind === "amend") && Array.isArray(c9.to)) {
        for (const t9 of c9.to) {
          if (!t9 || !t9.id) continue;
          ents = ents.map((e9) => {
            if (!e9 || e9.id !== t9.id) return e9;
            const n9 = { ...e9 };
            for (const f9 of ["reps", "rirSets", "w"]) if (t9[f9] !== undefined) n9[f9] = JSON.parse(JSON.stringify(t9[f9]));
            return n9;
          });
        }
      }
    }
    rec.entries = ents;
    /* CANONICAL SHAPE, and the harness is why: an empty `skipped` array and an
       absent one carry the same information, but replay produced one or the
       other depending on which grouping ran — so three replicas converged
       semantically and differed structurally, and law 2 caught it on seed
       11021. Absent is the canonical "nothing skipped". */
    if (skip.length) rec.skipped = skip; else delete rec.skipped;
    return rec;
  } catch (e) { return rec; }
}
/* the pick sessionLog actually uses: the ordering law chooses the BODY, then
   every correction either side knows about is replayed over it. */
function _mergeSession(x, y) {
  const cx9 = _corrOf(x), cy9 = _corrOf(y);
  const base = _richerSession(x, y);
  const union = _unionCorrLog(x, y);
  /* THE LAW IS THE SAME EVERYWHERE NOW. This returned early whenever neither
     side carried a correction — "leave the uncorrected path alone" — and that
     instinct preserved the exact data loss the round was built to kill: two
     devices that each logged a DIFFERENT session on one date fell to the
     pre-round record-level pick, so one session was simply gone, in BOTH
     orders, against mergeState's own promise of a superset. It was not
     associative either.
     IDENTICAL BODIES STILL SHORT-CIRCUIT, order preserved — that is what keeps
     his fourteen real records byte-identical through a phone/cloud merge, and
     it is pinned. Differing bodies accumulate and resolve per lift. */
  const bodyOf9 = (v9) => _canonJ({ e: (Array.isArray(v9 && v9.entries) ? v9.entries : []), s: (Array.isArray(v9 && v9.skipped) ? v9.skipped : []) });
  const sameBody9 = bodyOf9(x) === bodyOf9(y);
  /* IDENTICAL BODIES ARE RETURNED VERBATIM ON EVERY PATH — order and all.
     This short-circuit only guarded the no-correction path, so a CORRECTED
     record whose two copies were already identical still went through replay
     and the id-sort, and every sync reordered five of his real sessions:
     8/14's entries came back [abs, extension, …] instead of [hack, extension,
     …] and its skipped list flipped to [calves, hipthrust]. Sol's id-order
     ruling was for DIFFERING bodies on the tie path; nothing about it asked a
     merge to rewrite a record both sides already agree on. The corrLog union
     still travels — dropping it would lose a correction one side had learned —
     but the body is not touched. */
  /* FIX-13/14 — THE CARVE LEAVES A RECEIPT, AND THE RECEIPT IS CURRENT STATE.
     dropped = every lift id this date has EVER carried on any copy that is not
     on the record now — (ids of both bodies ∪ both sides' dropped) minus the ids
     of the result. Sol (pass 3) executed the previous form (a union that only
     grew) and found the dropped set could name a lift the winner carries once
     an exact-authority tie let the winner change between groupings; as
     "seen minus present" it is a function of the SET of inputs and the final
     body, so every grouping and both orders agree, and a lift that comes back
     (a modern replica's correction restating it) leaves the receipt. */
  const idsOf9 = (v9) => new Set([...(Array.isArray(v9 && v9.entries) ? v9.entries : []), ...(Array.isArray(v9 && v9.skipped) ? v9.skipped : [])].map((e9) => e9 && e9.id).filter((i9) => i9 != null).map(String));
  const seen9 = new Set([...idsOf9(x), ...idsOf9(y), ...(Array.isArray(x && x.dropped) ? x.dropped : []), ...(Array.isArray(y && y.dropped) ? y.dropped : [])].map(String));
  const finish9 = (rec9) => {
    const have9 = idsOf9(rec9); const dr9 = [...seen9].filter((i9) => !have9.has(i9)).sort();
    const cur9 = Array.isArray(rec9 && rec9.dropped) ? rec9.dropped : [];
    if (JSON.stringify(cur9) === JSON.stringify(dr9)) return rec9;                 /* nothing to say that is not already said — the record is returned as it is (byte-identity for a merge with oneself) */
    const o9 = JSON.parse(JSON.stringify(rec9)); if (dr9.length) o9.dropped = dr9; else delete o9.dropped; return o9;
  };
  if (sameBody9) return finish9(union.length ? { ...JSON.parse(JSON.stringify(base)), corrLog: union } : base);
  if (!union.length) {
    /* A RECORD-LEVEL corr WITH NO OPS IS STILL AN AUTHORITY. Measured the hard
       way: accumulating here resurrected the very phantom a pre-corrLog
       correction had removed — the stamp is the only evidence such a record
       carries, and it says "this body is the corrected one". Only when NEITHER
       side claims a correction is there no author, and only then do the bodies
       accumulate. */
    /* THE SUPERSET EXCEPTION, named so it stays visible.
       WHAT IT PROTECTS: a pre-corrLog correction carries no ops, so the record
       cannot tell a phantom it deliberately removed from a lift the other side
       concurrently logged — accumulating resurrects the phantom, the harm this
       whole round exists to stop.
       WHAT IT COSTS: a plain replica's UNRELATED extra lift is lost against
       such a record. That is a real hole in mergeState's superset promise, and
       the session-superset law asserts the exemption is only ever taken in
       exactly this shape.
       HOW BIG THE CLASS IS on his ledger: one record, 2026-08-10 — the only one
       carrying a corr with no derivable ops. Every correction made from v58
       forward files its own op and never reaches this branch. */
    if (cx9 || cy9) return finish9(base);
  }
  /* THE BODY ACCUMULATES, THE CORRECTIONS DECIDE — the round's own slogan,
     finally true. Replaying over a body that one side WON meant every lift the
     winning side happened not to have was silently gone: executed on his real
     8/14 record against a pre-correction backup carrying ONE new correction,
     two lifts he had ✕'d came back and two hand-added entries were deleted —
     7 entries to 5 — and because the loss is deterministic BOTH orders agreed,
     so the convergence law reported green over it and dataLossGuard, which
     counts sessionLog dates, never looked inside.
     So a lift present on EITHER side survives into the base, and only a
     correction may remove it. _richerSession still picks the per-lift winner on
     a genuine collision; the tie is broken by canonical value, never by side,
     because _richer ties to its second argument and that is merge order. */
  const merged = JSON.parse(JSON.stringify(base));
  if (union.length) merged.corrLog = union; else delete merged.corrLog;   /* an EMPTY corrLog is not a correction ledger — writing [] onto a record that has none is a shape the rest of the app never produces */
  /* ACCUMULATE WITHOUT OVERRIDING. The base is still the record the ordering
     law chose, and on a lift BOTH sides carry, the base's copy stands — that is
     what keeps a correction to an entry (a rating, a restated load) from being
     out-voted lift-by-lift by a longer stale copy. The other side contributes
     only the lifts the base does not have, which is the whole loss this fixes.
     Order-free by construction: the base is chosen order-free, and the
     contributed set is a pure union. */
  const byId = (arr9) => { const m9 = new Map(); for (const e9 of (Array.isArray(arr9) ? arr9 : [])) if (e9 && e9.id != null) m9.set(e9.id, e9); return m9; };
  const other9 = base === x ? y : x;
  const addMissing = (field9) => {
    const have9 = byId(base && base[field9]), extra9 = byId(other9 && other9[field9]);
    const add9 = [...extra9.keys()].filter((k9) => !have9.has(k9)).sort();
    if (!add9.length) return Array.isArray(base[field9]) ? base[field9].slice() : undefined;
    return [...(Array.isArray(base[field9]) ? base[field9] : []), ...add9.map((k9) => JSON.parse(JSON.stringify(extra9.get(k9))))];
  };
  /* THE TIE PATH RESOLVES PER LIFT. A shared lift takes the canonical max of
     the two copies — max is associative and commutative, which a record-level
     pick stops being the moment the record it compares has grown — and the rest
     is the union either side has.
     ENTRY ORDER, and the choice is deliberate: plain id order. The merged
     sequence must be a function of the SET of copies, not of which side was
     base, and id order is exactly that. The alternative — the day's plan order
     — reads better on the card, but it depends on exOrder, which is itself
     merged and can differ by grouping, so it would reintroduce the defect it
     was meant to dress. Checked before choosing: nothing computes on entry
     POSITION (the only positional read in the file is the skinfold series);
     two display maps render in array order, and this branch fires only when two
     devices corrected the same record to an exact (at, rev) tie — which no
     record of his has ever been in. */
  /* per-lift resolution whenever no side is the clear author of the body: an
     (at,rev) tie, or no correction anywhere. Both are cases where a
     record-level pick would be arbitrary, and arbitrary is what stops a
     three-way merge being associative. */
  const tie9 = (cx9 && cy9 && cx9.at === cy9.at && cx9.rev === cy9.rev) || (!cx9 && !cy9);
  if (tie9) {
    const perLift = (field9) => {
      const m9 = new Map();
      for (const side9 of [x, y]) for (const e9 of (Array.isArray(side9 && side9[field9]) ? side9[field9] : [])) {
        if (!e9 || e9.id == null) continue;
        const prev9 = m9.get(e9.id);
        if (prev9 === undefined || _canonJ(e9) > _canonJ(prev9)) m9.set(e9.id, e9);
      }
      return [...m9.keys()].sort().map((k9) => JSON.parse(JSON.stringify(m9.get(k9))));
    };
    merged.entries = perLift("entries");
    const sk9 = perLift("skipped");
    if (sk9.length) merged.skipped = sk9; else delete merged.skipped;
  } else {
    const ents9 = addMissing("entries"); if (ents9 !== undefined) merged.entries = ents9;
    const skip9 = addMissing("skipped"); if (skip9 !== undefined) merged.skipped = skip9;
  }
  const out9 = _replayCorrections(merged);
  /* MUTUAL EXCLUSION, and it is a SEMANTICS CALL so here is the choice and the
     reason. entries and skipped accumulate independently, and replay only moves
     the lifts a correction names — so a lift skipped on one side and logged on
     the other, with no op either way (both INITIAL, per FIX 1), survived into
     BOTH arrays: a record saying he did and did not do the same lift, which the
     non-shrink law then dutifully protected as if the phantom were data.
     THE RULE: a correction decides placement where one exists — replay has
     already applied it, so the arrays it touched are right. Otherwise the lift
     stays where the BASE put it, the base being the order-free pick from FIX 4.
     Never "whichever array was filled last", and never dropped from both: a
     lift present on either side must remain present somewhere, which is the
     non-shrink law's whole point and is correct. */
  try {
    const ents = Array.isArray(out9.entries) ? out9.entries : [];
    const skips = Array.isArray(out9.skipped) ? out9.skipped : [];
    const dup9 = ents.filter((e9) => e9 && skips.some((z9) => z9 && z9.id === e9.id)).map((e9) => e9.id);
    if (dup9.length) {
      /* ONLY A PLACEMENT CORRECTION DECIDES PLACEMENT. "any correction naming
         this lift" swept in strike and amend, which restate VALUES and say
         nothing about where the lift sits — so an amend on a lift that one side
         had skipped and the other had logged was read as having settled the
         question, and it left the lift in BOTH arrays. */
      const named9 = new Set((out9.corrLog || []).filter((c9) => c9 && (c9.kind === "skip" || c9.kind === "unskip")).map((c9) => c9.id).filter(Boolean));
      for (const id9 of dup9) {
        if (named9.has(id9)) continue;                                             /* a correction already decided this one */
        /* R-1 — LOGGED WINS, and never the base. "the base decides" read
           _richerSession, whose last tie returns its FIRST argument on an exact
           tieKey tie — argument order, i.e. merge order: executed, rows came
           back skipped one way and logged the other. With no placement op on
           either side there is no evidence a correction ever moved this lift,
           and a skip nothing vouches for is the ABSENCE of evidence, not a
           record of removal — so the reps stay, which is refuse-to-shrink
           applied at lift grain. A function of the two bodies, so order-free
           and associative by construction. */
        out9.skipped = out9.skipped.filter((z9) => !(z9 && z9.id === id9));
      }
      /* CANONICAL, UNCONDITIONALLY. This asked whether the BASE had a skip list
         — which is a question about which side arrived, so an emptied list came
         out as [] one way and absent the other. Absent is the canonical
         "nothing skipped"; leg 3 learned this once at the replay and it is the
         same rule here. */
      if (Array.isArray(out9.skipped) && !out9.skipped.length) delete out9.skipped;
    }
  } catch (e) {}
  return finish9(out9);
}
function _sessionAtMs(v) { const n = v && +v.at; return isFinite(n) ? n : 0; }
function _richerSession(x, y) {
  const cx = _corrOf(x), cy = _corrOf(y);
  if (!cx && !cy) return _tieKey(x) >= _tieKey(y) ? x : y;                     // 1 — FIX-13: the same order-free rule as the tie; see the note below
  if (cx && cy) {                                                              // 4
    if (cx.at !== cy.at) return cx.at > cy.at ? x : y;
    if (cx.rev !== cy.rev) return cx.rev > cy.rev ? x : y;
    /* v7.54.5 — ON A TIE, SIZE IS NOT EVIDENCE. This consulted _mergeScore
       first, and once bodies ACCUMULATE that is a function of the grouping, not
       of the records: with three corrected replicas, the intermediate record
       has more entries than any single input, so it won the base by size and
       which pair merged first decided both the shared lift's copy and the entry
       order. (A+B)+C gave curl [12,12,9] and A+(B+C) gave [12,12,8] — order-free
       pairwise, not associative once a compared body had grown.
       So the tie is resolved on a view accumulation cannot change: the record
       WITHOUT its entries, skipped and corrLog. That picks the non-body fields
       deterministically; the body itself is resolved per LIFT by _mergeSession,
       because a canonical max per lift is associative and a record-level pick
       is not.
       FIX-13 (Sol, closure pass 2): case 1 now takes the SAME rule. It kept
       _mergeScore — "no correction exists, refuse-to-shrink is the law" — but
       refuse-to-shrink is carried by the per-lift accumulate below, so the
       score's only remaining job was choosing the NON-BODY fields (note, at,
       niggles, dips, pace) — by the body's size, which is a function of the
       grouping once an intermediate has accumulated two lifts, and by argument
       order on a tie. Executed: three uncorrected copies with equal-length
       bodies, notes A/B/A — (A+B)+C carried "B", A+(B+C) carried "A"; and two
       copies with the SAME body and equal-length notes disagreed by direction.
       _tieKey is a total order on exactly the fields the pick decides, so it is
       associative and commutative; in practice it prefers the later completion
       (at sorts first in the canonical key). */
    /* FIX-14 (Sol, pass 3): two legacy corrected copies with EQUAL (at, rev) AND
       equal non-body fields but different bodies — the exact-authority tie.
       ">= ? x : y" answered by ARGUMENT position, and the carve then returned
       that whole record: merge(A,B) kept rows and dropped curl, merge(B,A) the
       reverse. A stable canonical order on the BODY is a function of the two
       records; the per-lift path is not used here on purpose (a legacy carve
       must not accumulate — that resurrects the phantom it exists to suppress). */
    const kx9 = _tieKey(x), ky9 = _tieKey(y);
    if (kx9 !== ky9) return kx9 > ky9 ? x : y;
    const bx9 = _canonJ({ e: Array.isArray(x && x.entries) ? x.entries : [], s: Array.isArray(x && x.skipped) ? x.skipped : [] }), by9 = _canonJ({ e: Array.isArray(y && y.entries) ? y.entries : [], s: Array.isArray(y && y.skipped) ? y.skipped : [] });
    return bx9 >= by9 ? x : y;                                                    /* equal bodies too → the records are the same body under the same authority; either is the base */
  }
  const stamped = cx ? x : y, plain = cx ? y : x, c = cx || cy;
  return _sessionAtMs(plain) > Date.parse(c.at) ? plain : stamped;             // 3 : 2
}

function _unionBy(remoteArr, localArr, keyOf) {
  const m = new Map();
  const add = (x) => { try { const k = keyOf(x); if (k == null) return; if (!m.has(k)) m.set(k, x); else m.set(k, _richer(m.get(k), x)); } catch (e) {} };
  (Array.isArray(remoteArr) ? remoteArr : []).forEach(add);
  (Array.isArray(localArr) ? localArr : []).forEach(add);
  return [...m.values()];
}
function _unionObj(remoteObj, localObj, pick) {
  const out = { ...(remoteObj && typeof remoteObj === "object" ? remoteObj : {}) };
  const l = localObj && typeof localObj === "object" ? localObj : {};
  const p = pick || _richer;
  for (const k of Object.keys(l)) out[k] = (k in out) ? p(out[k], l[k]) : l[k];
  return out;
}
function _unionMulti(remoteArr, localArr, keyOf) {
  // max-multiset union for KEYLESS logs (feed) where identical entries can legitimately repeat and
  // there is no id: keep, per identity, the side with MORE occurrences — so within-side repeats
  // survive and only the cross-side overlap collapses. Never shrinks either side.
  const group = (arr) => { const m = new Map(); (Array.isArray(arr) ? arr : []).forEach((x) => { let k; try { k = keyOf(x); } catch (e) { k = null; } if (k == null) return; const b = m.get(k); if (b) b.push(x); else m.set(k, [x]); }); return m; };
  const R = group(remoteArr), L = group(localArr), out = [];
  for (const k of new Set([...R.keys(), ...L.keys()])) { const l = L.get(k) || [], r = R.get(k) || []; (l.length >= r.length ? l : r).forEach((x) => out.push(x)); }
  return out;
}
/* ---------- mergeState v6.2 — reconcile STORED per-lift progression state ----------
   exercises[] and queue are NOT append-only: completeSession() rewrites a lift's lastMeta and
   flips a queue item's done/state in place. Unioning them like the append-only collections is not
   enough — on an id collision we must keep the RIGHT copy, and "richer/longer" is wrong (a stale
   entry is the same shape as a fresh one). This was the blind spot behind the lift clobber:
   exercises/queue fell through {...remote,...local}, so the writing client won wholesale and a
   phone that had not trained legs since 7/21 rolled the correct 7/28 lower lifts back on sync.
   Fix: reconcile per id. For a lift, the entry whose lastMeta is NEWEST wins (ISO dates sort
   lexically; a dated entry beats an undated one). For a queue item, the more-advanced state wins —
   done is terminal and irreversible, so a done item can never be reopened by a stale not-done copy.
   Ties fall to local (the writing client's view); an id on only one side is always kept (union, so
   |merged| >= both). This generalises refuse-to-shrink from record COUNTS to progression STATE:
   once every client runs it the lifts self-heal per id, from either write order. */
function _isoOr(x) { return (typeof x === "string" && x) ? x : ""; }
function _exDate(e) { return e && e.lastMeta ? _isoOr(e.lastMeta.d) : ""; }   // a lift's newest real session
function _queueRank(q) { return q && q.done ? 1 : 0; }                        // done is terminal — it wins
function _adjRank(a) { return ((a && a.undone) ? "2" : (a && a.dismissed) ? "1" : "0") + "|" + _canonJ(a); }   /* SCALE-5 — undone (the athlete's word) outranks dismissed (a derivation the reconciler recomputes anyway), and equal ranks settle by canonical body, never by which side was local: the pass-3 witness had merge(U,D) keep {undone} and merge(D,U) keep {dismissed} */
/* SCALE-8 (Sol's pass 6, P1) — ONE COMPARABLE INSTANT for every adjustment source:
   `at` parses to epoch ms; a legacy id's embedded _freshId timestamp (base36, the eight
   chars after the prefix, sanity-windowed 2001–2096) parses to the SAME scale — the old
   writer always recorded its instant there. A row with neither returns null and falls
   to its recovered storage position (`ord`, minted at the boot exit under exactly this
   predicate, so no row is ever left with neither an instant nor a position). */
function _adjInstant(x) {
  if (x && x.at) { const t7 = Date.parse(x.at); if (isFinite(t7)) return t7; }
  const m7 = x && x.id ? /^adj_([0-9a-z]{8})/.exec(String(x.id)) : null;
  if (m7) { const t7 = parseInt(m7[1], 36); if (t7 >= 1e12 && t7 < 4e12) return t7; }
  return null;
}
function _sugRank(x) { const d9 = String((x && x.d) || "").replace(/-/g, ""); return (/^\d{8}$/.test(d9) ? String(99999999 - +d9).padStart(8, "0") : "00000000") + "|" + (x && x.undone ? "1" : "0") + "|" + (x && x.orphan ? "0" : "1") + "|" + _canonJ(x); }   /* SCALE-7 — the true row outranks its absorbed tombstone: an orphan is a stand-in, never the record's better copy */   /* SCALE-5 — within a day, the undone copy of a decision outranks its not-yet-undone twin: the athlete's undo is monotone, a stale device cannot resurrect the effect */   /* SCALE-1 — earlier decision outranks later; same day: canonical body; compared as strings by _unionKeyed */     // v7.2.0 audit — an UNDONE/declined adjustment is TERMINAL: a stale not-undone copy can never resurrect it (mirrors _queueRank)
function _unionKeyed(remoteArr, localArr, keyOf, scoreOf) {
  // keyed union for non-append-only state: on a collision the higher score wins, ties -> local.
  // score is any value comparable with > / === (an ISO date string OR a numeric rank). Ids on only
  // one side are kept, so this can never shrink a lift roster or drop a queued structural change.
  const m = new Map();
  const consider = (x, local) => {
    let k; try { k = keyOf(x); } catch (e) { return; }
    if (k == null) return;
    if (!m.has(k)) { m.set(k, x); return; }
    let sx, sc; try { sx = scoreOf(x); sc = scoreOf(m.get(k)); } catch (e) { return; }
    if (sx > sc || (sx === sc && local)) m.set(k, x);
  };
  (Array.isArray(remoteArr) ? remoteArr : []).forEach((x) => consider(x, false));
  (Array.isArray(localArr) ? localArr : []).forEach((x) => consider(x, true));
  return [...m.values()];
}
/* ---------- mergeState v7.2.0 (Slice 3) — reconcile the synced PLAN object ----------
   s.plan carries self-authored goals + if-then intentions AND two behaviour-governing POLICY
   SCALARS: apMode (which corridor slice Auto-Pilot steers to) and, new in v7.2.0, autonomy (how
   much Auto-Pilot may handle on its own). Until now s.plan was in NONE of the MERGE_* maps, so it
   fell through {...remote,...local} in mergeState — LOCAL WINS WHOLESALE, the exact clobber class
   as the v6.2 exercises/queue bug: a stale phone could roll back a goal the other device added, or
   revert a deliberate mode/autonomy change. Fix, mirroring the v6.2 per-lift reconcile:
     · goals[] / ifthen[] -> KEYED UNION by stable id (an id on either side survives; ties -> local),
       so neither device can DROP the other's entry: |merged.goals| >= max(remote, local).
     · apMode / autonomy   -> NEWEST DELIBERATE CHANGE WINS. These are policy, not progression, so
       "most-advanced/richer" is the wrong rule and so is bare last-writer-wins. Each deliberate
       change stamps plan.setAt[field] with an ISO timestamp (savePlan) and bumps plan.rev; on merge
       the side with the NEWER stamp wins. Ties AND both-unstamped fall to LOCAL (the writing client).
       A stamped change always outranks an unstamped default, so a migration default can never clobber
       a real choice — and a stale client can neither REVERT a newer setting nor LOSE one, in EITHER
       write order (the adversarial property the gate asserts).
   Everything else on plan (share, per-day dismiss guards) rides the {...R,...L} base unchanged. */
const PLAN_POLICY_SCALARS = ["apMode", "autonomy", "phase", "brk"];   // v7.4.0 Slice 5 — the committed macro-phase + the current diet-break decision are policy, newest-deliberate-wins
/* _unionExOrder — reconcile the per-day lift ORDER. An ordering cannot be keyed-unioned:
   the order IS the data, so there is no per-entry winner to pick. It also cannot ride the
   wholesale {...remote, ...local}, which is what it did — local wins entirely, so a sync
   from a device that had not seen the reorder silently reverted it. Same clobber class the
   code already documents for exercises/queue.

   Two rules, in order:
     MUST-NOT-REVERT — a deliberate reorder carries an ISO stamp (setAt, per day key,
       written by the reorder control exactly as savePlan stamps its policy scalars). The
       strictly newer stamp wins. One side stamped and the other not means only one side
       made a deliberate choice, so that side wins regardless of which is local.
     MUST-NOT-LOSE — whichever order wins, any lift id present on the other side and
       missing from it is appended rather than dropped. A lift can never fall out of the
       running order because two devices disagreed about position.

   No schema bump: a historical exOrder has no knowable setAt, and the only honest value
   for one is absent. That is the `pace` precedent in CLAUDE.md — bump when old data can be
   RESTATED into the new shape, skip when the only honest answer is "we don't know".
   Absent reads as unstamped at every call site here. */
function _unionExOrder(remote, local) {
  const R = remote && typeof remote === "object" ? remote : null;
  const L2 = local && typeof local === "object" ? local : null;
  if (!R) return L2 || R;
  if (!L2) return R;
  const rSet = (R.setAt && typeof R.setAt === "object") ? R.setAt : {};
  const lSet = (L2.setAt && typeof L2.setAt === "object") ? L2.setAt : {};
  const days = Array.from(new Set([...Object.keys(R), ...Object.keys(L2)])).filter((k) => k !== "setAt");
  const out = {}, outSet = { ...rSet, ...lSet };
  for (const d of days) {
    const ra = Array.isArray(R[d]) ? R[d] : null, la = Array.isArray(L2[d]) ? L2[d] : null;
    if (!ra && !la) continue;
    if (!ra) { out[d] = la.slice(); continue; }
    if (!la) { out[d] = ra.slice(); continue; }
    const rs = rSet[d] || "", ls = lSet[d] || "";
    const winner = rs > ls ? ra : ls > rs ? la : la;   // newer deliberate change; tie/unstamped -> local
    const loser = winner === ra ? la : ra;
    const merged = winner.slice();
    for (const id of loser) if (!merged.includes(id)) merged.push(id);   // MUST-NOT-LOSE
    out[d] = merged;
    outSet[d] = rs > ls ? rs : (ls || rs);
  }
  if (Object.keys(outSet).length) out.setAt = outSet;
  return out;
}

function _unionPlan(remote, local) {
  const R = remote && typeof remote === "object" ? remote : {};
  const L = local && typeof local === "object" ? local : {};
  const out = { ...R, ...L };                                   // keep every plan field; policy scalars reconciled below
  // goals / ifthen — keyed union by id: never drop an entry from either side (ties -> local)
  out.goals  = _unionKeyed(R.goals,  L.goals,  (g) => g && g.id, () => 0);
  out.ifthen = _unionKeyed(R.ifthen, L.ifthen, (p) => p && p.id, () => 0);
  out.phaseLog = _unionKeyed(R.phaseLog, L.phaseLog, (e) => e && e.id, () => 0);   // v7.4.0 Slice 5 — append-only phase-transition log; never drop an entry from either side
  // policy scalars — newest DELIBERATE change wins (per-field ISO stamp); tie / both-unstamped -> local
  const rSet = (R.setAt && typeof R.setAt === "object") ? R.setAt : {};
  const lSet = (L.setAt && typeof L.setAt === "object") ? L.setAt : {};
  const outSet = { ...rSet, ...lSet };
  for (const f of PLAN_POLICY_SCALARS) {
    const rs = rSet[f] || "", ls = lSet[f] || "";
    if (rs > ls) { if (f in R) out[f] = R[f]; outSet[f] = rs; }        // remote's change is strictly newer -> take it (MUST-NOT-REVERT)
    else { if (f in L) out[f] = L[f]; else if (f in R) out[f] = R[f]; outSet[f] = ls || rs; }   // ties / absent -> local (MUST-NOT-LOSE)
  }
  if (Object.keys(outSet).length) out.setAt = outSet;
  out.rev = Math.max((+R.rev || 0), (+L.rev || 0));             // monotonic revision, carried for visibility
  return out;
}
/* ---------- mergeState v7.3.0 (Slice 4) — reconcile the synced LEARNED store ----------
   s.learned carries the n-of-1 learning history: a TDEE drift series (by date) and the BF/DEXA anchor
   log (by id). Both are APPEND-ONLY and load-bearing (tdeeLearned smooths the series; partitionPrior +
   energyDensity narrow off the anchors; adaptationSignal reads observed-vs-mass-predicted over time), so
   — exactly like s.plan — s.learned must NOT ride {...remote,...local} wholesale (the same v6.2 clobber
   class). Each sub-collection is a keyed union that NEVER drops an entry from either side: |merged| >= both
   from EITHER write order, so a stale device can neither LOSE nor REVERT learned history. */
function _unionLearned(remote, local) {
  const R = remote && typeof remote === "object" ? remote : {};
  const L = local && typeof local === "object" ? local : {};
  const out = { ...R, ...L };
  out.tdee    = _unionKeyed(R.tdee,    L.tdee,    (x) => x && x.d,  () => 0);   // by date — never drop; exact-key tie -> local
  out.anchors = _unionKeyed(R.anchors, L.anchors, (a) => a && a.id, () => 0);   // by id — never drop; tie -> local (ids are _freshId-unique, so no real collision)
  return out;
}
const MERGE_KEYED = {   // STORED, non-append-only per-lift state — reconcile per id (newest / most-advanced wins)
  exercises: { keyOf: (e) => e && e.id, scoreOf: _exDate },
  queue:     { keyOf: (q) => q && q.id, scoreOf: _queueRank },
  // v7.2.0 audit — s.adjustments/s.proposals were in NO MERGE_* map: they rode {...remote,...local}
  // (wholesale local-wins), the SAME clobber class as the v6.2 exercises/queue bug. Slice 3 makes the
  // decision log LOAD-BEARING (track record + undo + once/day guard + multi-device Run-it append), so:
  //   adjustments — keyed union by stable id (legacy fallback rid|d), TERMINAL (undone/dismissed) wins;
  //                 an id on only one side survives, so a stale device can neither LOSE nor REVERT one.
  //   proposals   — never-drop union (id, else rid): an armed inbox item on one device is never clobbered
  //                 by a stale-device sync; collision -> local (scoreOf 0 -> ties fall to local), i.e. the
  //                 prior local-wins semantics unchanged, only never-lose added (no undo/re-open regression).
  adjustments: { keyOf: (a) => a && (a.id || (a.rid + "|" + a.d)), scoreOf: _adjRank },
  proposals:   { keyOf: (p) => p && (p.id || p.rid || JSON.stringify(p)), scoreOf: () => 0 },
  /* SCALE-1 — the analyst-card DECISIONS (s.suggestionLog) were in no MERGE_* map
     either: the same wholesale local-wins class, found live 2026-08-19 — a card
     decided on one device came back undecided on the ledger when a stale device
     synced after it, and re-appeared there. Keyed union by sid, never lose; the same
     card decided on two devices offline: the EARLIER day's decision stands (the
     athlete's first word), equal days by canonical body — direction-free. */
  suggestionLog: { keyOf: (x) => x && x.sid, scoreOf: _sugRank },
};
const MERGE_ARR = {   // one logical entry per key (date / id) — the richer copy wins on a collision
  reads: (r) => r && r.d, waist: (w) => w && w.d, photos: (p) => p && (p.d || p.id || JSON.stringify(p)),
  caffLog: (c) => c && (c.d + "|" + (c.at || "")), medsLog: (mm) => mm && (mm.d + "|" + (mm.at || "")),
  /* R5 — keyed on DATE + SERIES IDENTITY, not date alone. Two readings on one day with
     different site sets are different measurements, not a collision to resolve. */
  skinfolds: (x) => x && (x.d + "|" + _skinSeriesKey(x)),
  temp: (t) => t && t.d, pulse: (p) => p && p.d, soreness: (x) => x && x.d, energy: (x) => x && x.d, grip: (x) => x && x.d,
  events: (e) => e && (e.id || e.d + "|" + e.t), trials: (t) => t && (t.id || t.d),
  agentProposals: (a) => a && a.id, weekly: (w) => w && w.wk,
};
/* MERGE_MULTI — keyless: identical entries may legitimately repeat, so preserve multiplicity.
   IDENTITY IS CANONICAL (Sol, pass 6): keyed on raw JSON.stringify, a line that is
   canonically equal but carries its keys in another order counted as a SECOND
   identity, so the max-multiset union of two copies against one canonically-equal
   copy emitted three — in the feed and in forecasts — and the inflation was
   permanent (every later merge carried all three). Key order is not information
   anywhere else in the merge; it is not identity here either. */
const MERGE_MULTI = { feed: (f) => _canonJ(f), forecasts: (f) => _canonJ(f) };
const MERGE_OBJ = ["dailyLogs", "sessionLog", "dayCtx", "labSeen"];
/* _feedSorted — THE FEED'S ONE CANONICAL ORDER: newest-first by d, stable (so
   within-day emitted order survives). Every path that can write a feed line
   ends by calling this — a merge (after its receipts AND after
   reconcileEraTransitions, whose replay/adoptshift lines are dated in the past)
   and a boot (after its patches and reconcilers) — so a settled or merged state
   is a fixed point of the next merge and the renderer's array order is the
   order every unshift assumes. Sol's pass-3 hunt: a receipt filed AFTER the
   sort put an 8/09 line above an 8/18 one; CC's leg-15 finding: patchV55's
   unshift did the same at a v54 boot; cowork's probe: reconcileEraTransitions'
   adoptshift line did it at merge. One sort, last, on every path. */
/* _feedDayOrder — WITHIN A DAY, ONE ORDER TOO. _feedSorted keeps a day's lines in
   arrival order (the athlete's own chronology on one device), but the union
   puts the remote side first, so two devices that each wrote a DIFFERENT line
   on the same day came out reversed by merge direction (Sol, pass 4: [B, A]
   one way, [A, B] the other — a whole-state convergence failure the harness
   could not form because no seed gave two replicas distinct same-day lines).
   THE RULE: for each day, if both sides carry the SAME sequence (judged
   canonically — FIX-18), keep it — that is every merge on his ledger, and it
   preserves the within-day chronology his story reads in; if only ONE side
   carries the day (FIX-18), keep that side's sequence — there is nothing to
   reconcile; if they differ, the day is put in one canonical order (the line's
   canonical JSON), the one case where no chronology exists to keep — and that
   includes the everyday push-again shape (a device merging with its own
   earlier push of the same day), which no rule without a per-line stamp can
   order: main scrambles it by grouping, this puts it in one order. Symmetric by
   construction; associative because "differ" is sticky and an empty side is
   the rule's identity — the merged day is a function of the distinct
   non-empty sequences seen: one, kept; more than one, canonical over the
   max-multiset. A stable per-line stamp on NEW lines is the stronger long-run
   design and belongs to the writer sweep.
   PROJECTIONS NEVER ENTER THE DAY RULE (FIX-19 — Sol, pass 7): the carve and
   adoptshift lines are DERIVED state, re-derived from the merged record by the
   writers that run after this (the carve projection after the op-dedup, the
   adoptshift projection in reconcileEraTransitions), so they are set aside
   from the comparison and the ordering here — on both sides and in the union
   — and ride through to those writers untouched, which own their lifecycle
   (remove every one, re-derive exactly what the merged state warrants). A
   stale one carried by ONE replica made two otherwise identical days
   "differ", the differ branch canonicalised the athlete's permanent lines,
   and the writer then removed the stale line correctly — the chronology
   damage outlived it. */
const _isFeedProjection = (f) => !!(f && ((typeof f.op === "string" && (f.op.indexOf("carve:") === 0 || f.op.indexOf("adoptshift:") === 0 || f.op.indexOf("lateread:") === 0 || f.op.indexOf("sug:") === 0 || f.op.indexOf("seam:") === 0 || f.op === "patch59:scale")) || f.t === "EVENING READ — SET ASIDE" || f.t === "LATE READ — SET ASIDE" || f.t === "ANALYST SUGGESTION APPLIED" || f.t === "ANALYST SUGGESTION DISMISSED" || f.t === "ANALYST SUGGESTION NOTED" || f.t === "ANALYST SUGGESTION UNDONE" || (typeof f.t === "string" && (f.t.indexOf("MORNING READ MISSED") === 0 || f.t.indexOf("READ GAP") === 0))));   /* SCALE-2 — the READ RECEIPTS join the projection class: set-aside lines (either vintage's spelling) and missed/gap lines are machine receipts that reconcileReadReceipts removes or re-derives from reads[], so they may neither manufacture a day disagreement (the rig101 class, via a stale receipt on one replica) nor be canonicalised with the athlete's permanent lines; they ride through to the reconciler exactly as the carve and adoptshift lines ride to their writers */
/* SCALE-4 — the projection class SPLITS for the guard (Sol's pass 2, new row 1, which
   refuted this build's own A2 claim on the record). _isFeedProjection is the DAY-ORDER
   class: any machine line that must not manufacture a day disagreement or be
   canonicalised with athlete lines. _isFeedDerived is the strictly smaller GUARD class:
   only lines a reconciler genuinely recreates from the store they describe. MISSED/GAP
   summaries are projections for day-order but NOT derived — their bodies price the
   moment they were filed and nothing can recompute them — so the guard protects their
   days cross-state instead of not counting them at all. The patch59 receipt is derived
   exactly when its marked reads are present to derive from. */
function _isFeedDerived(f, st) {
  if (!f) return false;
  if (typeof f.op === "string" && (f.op.indexOf("carve:") === 0 || f.op.indexOf("adoptshift:") === 0 || f.op.indexOf("lateread:") === 0 || f.op.indexOf("sug:") === 0 || f.op.indexOf("seam:") === 0)) return true;   /* C2 (PROGRESSION-1) — the insertion seam line is a PROJECTION: deriveInsertionSeams removes and re-derives it from the plan marker, the pair table and actual exposure at every boundary, so counting it as history made the guard refuse the very correction the round ships (the same lesson the read receipts taught at SCALE-3) */
  if (f.t === "EVENING READ — SET ASIDE" || f.t === "LATE READ — SET ASIDE") return true;
  if (f.t === "ANALYST SUGGESTION APPLIED" || f.t === "ANALYST SUGGESTION DISMISSED" || f.t === "ANALYST SUGGESTION NOTED" || f.t === "ANALYST SUGGESTION UNDONE") return true;
  if (f.op === "patch59:scale" && st && ((Array.isArray(st.reclassLog) && st.reclassLog.length) || (Array.isArray(st.reads) && st.reads.some((r) => r && r.reclassed)))) return true;   /* SCALE-5 — the attestation store is the authority; the legacy flag test stays for in-flight states */
  return false;
}
function _feedDayOrder(remoteFeed, localFeed, unioned) {
  try {
    const days = (arr) => { const m = new Map(); for (const f of (Array.isArray(arr) ? arr : [])) { if (_isFeedProjection(f)) continue; const d = String((f && f.d) || ""); if (!m.has(d)) m.set(d, []); m.get(d).push(f); } return m; };
    const dr = days(remoteFeed), dl = days(localFeed), du = days(unioned);
    const out = [];
    for (const [d, ls] of du) {
      /* FIX-17 (Sol, pass 5): the SAME sequence is kept AS THE SIDES CARRY IT, not
         as the union groups it. _unionMulti groups a day's lines by identity
         before emitting them, so an interleaved repeat — [X, Y, X], which the
         keyless feed explicitly allows — came out [X, X, Y]: merge(A,A) rewrote
         it, and A=[Y,Y,X] · B=[Y,X,Y] · C=[Y,X,Y] settled differently by
         grouping. Either side is valid here; the branch has just proved them
         byte-identical. */
      const rd = dr.get(d) || [], ld = dl.get(d) || [];
      /* FIX-18 — "the same sequence" is judged CANONICALLY, like the union's identity
         (Sol, pass 6): two devices carrying one day's lines with their keys in
         different orders carry the same chronology. */
      if (_canonJ(rd) === _canonJ(ld)) { out.push(...rd); continue; }
      /* FIX-18 (cowork, while generalising the identity repair) — A DAY ONLY ONE SIDE
         CARRIES IS NOT A DISAGREEMENT. It took the differ branch and was put in
         canonical (alphabetical) order: the most common sync there is — one device a
         day ahead of the other — rewrote the athlete's own within-day chronology,
         and the rewrite was sticky (the day came back canonical to the device that
         wrote it). Executed on his ledger: the live copy against the branch's older
         copy moved the order of every day only the live copy carried. There is
         nothing to reconcile when the other side is silent: that side's sequence
         stands. Still symmetric; still associative — an empty side is the identity
         of the day rule, so the merged day is a function of the DISTINCT non-empty
         sequences seen: one, kept; more than one, canonical over the max-multiset. */
      if (!rd.length || !ld.length) { out.push(...(rd.length ? rd : ld)); continue; }
      out.push(...ls.slice().sort((a, b) => { const ka = _canonJ(a), kb = _canonJ(b); return ka < kb ? -1 : ka > kb ? 1 : 0; }));
    }
    /* FIX-19 — the projections ride through: set aside from the day rule, not from
       the feed. The carve writer and the adoptshift writer below remove every one
       and re-derive what the merged record warrants; nothing here is history. */
    for (const f of (Array.isArray(unioned) ? unioned : [])) if (_isFeedProjection(f)) out.push(f);
    return out;
  } catch (e) { return unioned; }
}
function _feedSorted(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map((x, i) => [x, i]).sort((a, b) => String((b[0] || {}).d || "").localeCompare(String((a[0] || {}).d || "")) || a[1] - b[1]).map((p) => p[0]);
}
/* _sugSorted — THE DECISIONS' ONE ORDER (SCALE-1): day, then card, then body. The
   keyed union emits the remote side's entries first, so two devices carrying
   different extra cards came out in two orders by merge direction — same set, two
   stories. Applied on the merge path AND at both boot exits, like the feed's sort
   (FIX-15), so a booted state is a fixed point of the next merge. */
function _sugSorted(arr) {
  if (!Array.isArray(arr)) return arr;
  /* SCALE-6 (Sol's pass 4, new row) — the athlete's ORDER is his tap order, never sid
     spelling: two same-day approvals sorted by sid let the alphabetically-later card
     lose the effect it had just won at the writer. The instant (at) orders same-day
     rows; legacy unstamped rows sort first within their day (sid, then body, as
     before). And every row is materialized in canonical key order — re-keying the same
     production row on another replica used to yield canonically-equal but
     byte-different merges that no boot repaired. */
  /* SCALE-7 (Sol's pass 5, P1) — RECOVER the single-writer legacy order before any
     sort destroys it: every production row predating the stamped writers was appended
     in decision order, so the array position at the FIRST settle IS the recoverable
     causal order. A row lacking `at` gets a durable `ord` from that position — minted
     at the BOOT exit only (_settleExit), never here: this sort also runs on merge
     outputs, whose arrival order depends on merge direction, and an ord minted there
     would break byte convergence. The day then orders by instant for stamped rows
     ("1"+at) and by recovered position for legacy rows ("0"+ord), never by sid
     spelling. Legacy rows minted concurrently on two replicas collide on ord and fall
     to sid/body — deterministic, byte-convergent, and never CLAIMED as the athlete's
     order (that claim is lastUndoable's, which carries orderSure for exactly this). */
  const k9 = (x) => String((x && x.d) || "") + "|" + (x && x.at ? "1" + String(x.at) : "0" + String((x && x.ord) || "")) + "|" + String((x && x.sid) || "") + "|" + _canonJ(x);
  return arr.slice().sort((a, b) => { const ka = k9(a), kb = k9(b); return ka < kb ? -1 : ka > kb ? 1 : 0; }).map((x) => (x && typeof x === "object" && !Array.isArray(x) ? JSON.parse(_canonJ(x)) : x));
}
function mergeState(local, remote) {
  if (!remote || typeof remote !== "object") return local;   // no remote / junk remote -> keep local
  if (!local || typeof local !== "object") return remote;    // never write junk over a real remote
  const out = { ...remote, ...local };                       // scalars: local wins; remote-only keys kept
  for (const k of Object.keys(MERGE_ARR)) out[k] = _unionBy(remote[k], local[k], MERGE_ARR[k]);
  /* SCALE-2 (hunt H2) gave the clean copy the tie at the same weight; SCALE-4 (Sol's
     pass 2, H2 re-opened) makes the whole selection ONE TOTAL ORDER. The pass-2 witness:
     clean-beats-late applied only at equal weight and record length decided everything
     else, so A beat B by class, B beat C and C beat A by length — a non-transitive
     cycle, and three replicas merged in different groupings kept different reads.
     Authority is now lexicographic and total: CLASS first (clean > sealed > late — the
     in-window read is the instrument, whatever the number says), then record length
     (richness, _mergeScore's own proxy), then the canonical byte tie — transitive, so
     the day's read is the same from every grouping and every direction. */
  if (Array.isArray(out.reads)) {
    const byD9 = new Map();
    for (const src9 of [remote.reads, local.reads]) for (const r9 of (Array.isArray(src9) ? src9 : [])) {
      if (!r9 || r9.d == null) continue;
      const cur9 = byD9.get(r9.d);
      if (!cur9) { byD9.set(r9.d, r9); continue; }
      byD9.set(r9.d, _readPick(cur9, r9));
    }
    out.reads = [...byD9.values()];
  }
  { const rl = [...new Set([...(Array.isArray(remote.reclassLog) ? remote.reclassLog : []), ...(Array.isArray(local.reclassLog) ? local.reclassLog : [])].map(String))].sort(); if (rl.length) out.reclassLog = rl; }   /* SCALE-5 — the attestation store merges by SET UNION: monotone, direction-free, cannot shrink */
  reconcileTrendChain(out);   /* SCALE-2 row 3a — trend, pt chain and weekly follow the merged reads */
  for (const k of Object.keys(MERGE_MULTI)) out[k] = _unionMulti(remote[k], local[k], MERGE_MULTI[k]);
  if (Array.isArray(out.feed)) out.feed = _feedDayOrder(remote.feed, local.feed, out.feed);   /* FIX-16 — a day's order is a function of the two sides, never of which arrived first */
  for (const k of MERGE_OBJ) out[k] = _unionObj(remote[k], local[k], k === "sessionLog" ? _mergeSession : _richer);   // CORRECTION_MERGE — only sessionLog knows about deliberate corrections. v7.54.0: _mergeSession = the ordering law for the BODY + a keyed replay of every correction either side knows about, so the entry set no longer rides on which copy happened to be richer.
  /* FIX split-1 (P1-8) — OP-KEYED RECEIPTS RECONCILE TO ONE: two devices firing
     the same operation offline (a seam, a retirement, an insertion receipt, an
     adoption, a standard retirement) each minted a receipt; post-merge the
     operation still happened ONCE. Keep the EARLIEST sighting; d-tie breaks to
     the CANONICALLY smaller entry — direction-free, and (FIX-18) spelling-free.
     Op-less lines are history and keep their multiplicity. */
  if (Array.isArray(out.feed)) {
    const opBest = new Map();
    for (const f9 of out.feed) {
      if (!(f9 && f9.op != null)) continue;
      const cur = opBest.get(f9.op);
      if (!cur || String(f9.d || "") < String(cur.d || "") || (String(f9.d || "") === String(cur.d || "") && _canonJ(f9) < _canonJ(cur))) opBest.set(f9.op, f9);   /* FIX-18 — the d-tie breaks on the CANONICAL entry: once the union's identity is canonical, ONE spelling of a line reaches this tie — whichever the day rule and the union carried forward (the remote side's on an equal day, the local side's copies on a differing one) — and a raw comparison made the pick a function of grouping (three replicas, one receipt in two key orders against a different telling of the same op: one grouping kept the one, the other grouping the other) */
    }
    out.feed = out.feed.filter((f9) => !(f9 && f9.op != null) || opBest.get(f9.op) === f9);
  }
  /* FIX-13/14/16 — A CARVE IS TOLD, NOT SWALLOWED, TOLD TRUTHFULLY, AND TOLD
     ONCE FROM THE RECORD. For every date, the feed's carve line is a PROJECTION
     of the merged record and nothing else: every existing "carve:<date>" line
     is removed, and exactly one is written back if the record still has a
     dropped set — none if it does not (a lift that came back leaves the
     receipt with it). Sol, pass 4: the previous writer skipped records whose
     dropped set had emptied (the obsolete line stayed, and it was false), and
     it trusted the FIRST matching line it found (a stale duplicate from the
     other side survived the op-dedup by its unrelated tie rule, so the receipt
     differed by merge direction and changed on self-merge). Placed AFTER the
     op-dedup, so nothing can re-select a stale line; before
     reconcileEraTransitions and the final sort. Dated at the record's date: a
     merge has no clock. */
  try {
    const feed8 = Array.isArray(out.feed) ? out.feed : [];
    const dates8 = new Set([...Object.keys(out.sessionLog || {}), ...feed8.filter((f8) => f8 && typeof f8.op === "string" && f8.op.indexOf("carve:") === 0).map((f8) => f8.op.slice(6))]);
    let next8 = feed8;
    for (const d8 of dates8) {
      const op8 = "carve:" + d8, r8 = (out.sessionLog || {})[d8];
      const rest8 = next8.filter((f8) => !(f8 && f8.op === op8));
      const ids8 = r8 && Array.isArray(r8.dropped) ? r8.dropped.slice() : [];
      if (!ids8.length) { next8 = rest8; continue; }
      const kept8 = r8.corr ? "corrected" : "later";
      const how8 = kept8 === "corrected" ? "Two copies of this session disagreed. One was a correction made before the app kept correction receipts, so the merge could not combine them lift by lift; it kept the corrected copy whole. The other copy carried " + ids8.join(", ") + ", which were not added. If they were real, log them again." : "Two copies of this session disagreed. One carried a correction made before the app kept correction receipts; the other was completed after that correction, so the merge kept the later copy whole. The corrected copy carried " + ids8.join(", ") + ", which were not added. If they were real, log them again.";
      next8 = [{ op: op8, d: d8, ids: ids8, kept: kept8, t: "MERGE KEPT ONE WHOLE SESSION — " + d8, how: how8 }, ...rest8];
    }
    out.feed = next8;
  } catch (e) {}
  for (const k of Object.keys(MERGE_KEYED)) out[k] = _unionKeyed(remote[k], local[k], MERGE_KEYED[k].keyOf, MERGE_KEYED[k].scoreOf);   // exercises/queue: reconcile per lift, never wholesale
  out.suggestionLog = _sugSorted(out.suggestionLog);   /* SCALE-1 — one order for the decisions, last, on the merge path (see _sugSorted) */
  /* AUDIT G (volume lever) — ex.sets must SURVIVE the wholesale per-lift merge. _unionKeyed
     keeps ONE whole exercise object per id, judged by lastMeta.d — the right clock for
     progression state, the WRONG one for a deliberate set-count change: a stale-count device
     that merely TRAINS the lift after the change carries the newer lastMeta.d and resurrects
     the old count wholesale. So sets rides its own field stamp, the plan.setAt / exOrder.setAt
     discipline at field grain: setsAt is a full ISO string written by every sets mutator;
     stamped beats unstamped, newer stamp wins, exact tie keeps the wholesale winner (local).
     Historical lifts have no knowable stamp, so there is no schema patch (the pace precedent):
     absent reads as unstamped, and one honest stamped write wins from BOTH merge orders.
     v7.52.0 — hi/inc/setup join sets under the same law (hiAt/incAt/setupAt): the
     executed loss mode had a device that merely TRAINED a lift revert another
     device's deliberate hi ruling, setup edit and increment, because only sets had
     field grain. Every LIVE mutator of these fields stamps; historical patches
     stay unstamped on purpose (pre-stamp era, exactly like patchV18's sets). */
  {
    const pick = (arr, id) => (Array.isArray(arr) ? arr.find((e) => e && e.id === id) : null);
    /* v7.52.0 — the setsAt discipline, generalized to every deliberate-config
       field. Each field rides its OWN stamp and is judged INDEPENDENTLY: a
       device can hold the newer set count while the other holds the newer rep
       ceiling, and both survive. Stamped beats unstamped, newer stamp wins,
       exact tie keeps the wholesale winner. rirHist is deliberately NOT here
       this round (filed): it is a series, not a scalar, and needs a union, not
       a stamp. */
    const STAMPED_FIELDS = [["sets", "setsAt"], ["hi", "hiAt"], ["inc", "incAt"], ["setup", "setupAt"], ["w", "wAt"], ["steps", "stepsAt"]];   /* SPLIT item c — the load joins the discipline; legacy absent stamps behave exactly as the other four. LEG 2 — the LADDER joins it too: w moved on its stamp while steps stayed with the merge base, so a stale-first merge returned a working load that is not on its own ladder (snapLoad(200) -> 190, and every snapper downstream reads a weight the machine does not make). Whole-field-by-stamp is the accepted trade, the same one the other five make: two devices adding different rungs offline resolve to the newer writer's whole ladder. A keyed union is REJECTED because it cannot express a deliberate DELETION — the cleared ladder would resurrect on every merge. */
    out.exercises = (out.exercises || []).map((w) => {
      if (!w || w.id == null) return w;
      const r0 = pick(remote.exercises, w.id), l0 = pick(local.exercises, w.id);
      const other = w === r0 ? l0 : r0;
      if (!other) return w;
      let w2 = w;
      /* R11 fix-4 — the pin BIRTHDAY merges EARLIEST-WINS: it is a first
         sighting, like the insertion registry's date, and one replica that
         learned the pinned cue later must never move it forward. */
      if (_isoOr(other.pinsBornAt) !== "" && (_isoOr(w2.pinsBornAt) === "" || _isoOr(other.pinsBornAt) < _isoOr(w2.pinsBornAt))) w2 = { ...w2, pinsBornAt: other.pinsBornAt };
      /* R9 fix-2 — HEALTH BEATS QUARANTINE, direction-free: when exactly one
         side's copy of a lift is quarantined, the unquarantined copy prevails
         wholesale — a valid record existing anywhere proves the lift walkable,
         and the wholesale winner must not smuggle the corrupt flag past it.
         (The round's own closure pin caught this step designed but unwritten:
         merge order decided whether the healthy fly survived.) */
      if (w2.quarantined && !other.quarantined) w2 = { ...other };
      for (const [f9, at9] of STAMPED_FIELDS) {
        if (_isoOr(other[at9]) > _isoOr(w2[at9])) w2 = _takeStamped(w2, other, f9, at9);
        else if (_isoOr(other[at9]) !== "" && _isoOr(other[at9]) === _isoOr(w2[at9]) && _valOr(other[f9]) > _valOr(w2[f9])) w2 = _takeStamped(w2, other, f9, at9);   /* FIX split-1: equal stamps resolve by VALUE, direction-free — "local wins" flips with merge order. LEG 3 FIX 4: through _valOr, because JSON.stringify(undefined) is undefined and EVERY comparison with it is false — so on equal stamps the merge BASE always won and a cleared ladder kept whichever side it started from. Absent serializes as "", so the PRESENT value wins a tie, direction-free. A DELETION therefore needs a STRICTLY newer stamp, which is the doctrine the cleared-ladder pin already asserts. */
      }
      /* FIX 3a — forks are UNION-BY-SEAM: a technique era is history, and a
         stale device that never learned a seam must not erase it. Keyed by
         from; first writer's why/prevN stand. */
      {
        const fA = Array.isArray(w2.forks) ? w2.forks : (w2.fork && w2.fork.from ? [w2.fork] : []);
        const fB = Array.isArray(other.forks) ? other.forks : (other.fork && other.fork.from ? [other.fork] : []);
        if (fA.length || fB.length) {
          /* PROGRESSION-1 FIX-1 — KEYED BY DATE **AND CLASS**. This union predates fork kinds:
             it assumed every same-date pair was one event seen twice. A derived context seam
             and an athlete-authored TECHNIQUE fork can now legitimately share a date, and
             keying on `from` alone composited them into one record — the same defect Grok's H2
             found in canonicalizePlan's union, on the other path. A reset-bearing fork carries
             semantics a context seam does not, and it is athlete-authored history besides; the
             two never merge into each other. Same-class pairs still union deterministically,
             and now carry their kind rather than falling back to the legacy kind-less shape. */
          const cls9 = (f9) => (f9 && (f9.kind ? f9.kind === "context" : !!f9.split)) ? "ctx" : "tech";
          const byFrom = new Map();
          for (const f9 of [...fB, ...fA]) {
            if (!(f9 && f9.from)) continue;
            const key9 = f9.from + "|" + cls9(f9);
            if (byFrom.has(key9)) {
              /* FIX split-1 (P0-5): same-date metadata unions DETERMINISTICALLY —
                 ops set-union, why derived from ops, scalar conflicts to the
                 lexicographically greater value (direction-free, like the
                 stamp tie rule) instead of whichever side was local. */
              const p9 = byFrom.get(key9);
              const ops9 = [...new Set([...(p9.ops || (p9.why ? [p9.why] : [])), ...(f9.ops || (f9.why ? [f9.why] : []))])].sort();
              byFrom.set(key9, { from: f9.from, why: ops9.length > 1 ? ops9.join(" + ") : (p9.why === f9.why ? p9.why : (String(p9.why || "") > String(f9.why || "") ? p9.why : f9.why)), ...(ops9.length ? { ops: ops9 } : {}), prevN: p9.prevN === f9.prevN ? p9.prevN : (String(p9.prevN || "") > String(f9.prevN || "") ? p9.prevN : f9.prevN), ...((p9.kind || f9.kind) ? { kind: p9.kind || f9.kind } : {}), ...(p9.split || f9.split ? { split: true } : {}) });
            } else byFrom.set(key9, f9);
          }
          w2 = { ...w2, forks: [...byFrom.values()].sort((a9, b9) => {
            if (a9.from !== b9.from) return a9.from < b9.from ? -1 : 1;
            return (cls9(a9) === "ctx" ? 1 : 0) - (cls9(b9) === "ctx" ? 1 : 0);   /* reset-bearing first on a tie, as canonicalizePlan orders it */
          }) };
        }
        const rA = Array.isArray(w2.renames) ? w2.renames : [], rB = Array.isArray(other.renames) ? other.renames : [];
        if (rA.length || rB.length) {
          const byF2 = new Map();
          for (const r9 of [...rB, ...rA]) { if (r9 && r9.from) byF2.set(r9.from, r9); }
          w2 = { ...w2, renames: [...byF2.values()].sort((a9, b9) => (a9.from < b9.from ? -1 : 1)) };
        }
      }
      /* AND WHEN NEITHER SIDE WON THE LOAD, the caches did not ride with it —
         so they are still whichever base arrived first, which is merge ORDER.
         Normally harmless because the boot re-derives them from the log; but
         when the lift has no logged line left (its only entry was skipped away)
         deriveLastMeta returns null, the heal does `continue`, and the arrival
         order survives into the settled state. Resolve them the way this app
         already resolves every other tie: by VALUE, direction-free, through
         _valOr. Arbitrary between two equally stale claims — but DETERMINISTIC,
         which is the whole property, and the boot still overrides both the
         moment the log can say anything at all.
         FOUND BY THE HARNESS, aimed seed 14413. */
      if (_isoOr(other.wAt) === _isoOr(w2.wAt) && _valOr(other.w) === _valOr(w2.w)) {
        for (const c9 of CACHE_RIDERS) if (_valOr(other[c9]) > _valOr(w2[c9])) w2 = { ...w2, [c9]: other[c9] };
      }
      /* THE MERGE IS PURE (v7.54.3). This returned ensureLoadOnLadder(w2), so
         every BINARY merge repaired the pair — and a repair that writes at an
         intermediate step is not associative: with three replicas, B+C inserted
         a rung for a load that only existed in that transient pair, and the rung
         outlived the load, so (A+B)+C and A+(B+C) settled with different
         ladders and the persistent state depended on sync topology.
         The invariant is not lost: boot runs the same repair across every lift
         on the SETTLED state, and every merged state is booted before use —
         ghSync migrates the merge result, and the reconcile boundary repairs
         there. One repair, on the final pair, is both sufficient and
         order-free; a repair per intermediate pair is neither. */
      return w2;
    });
  }
  /* FIX 3a — the insertion registry unions too: once fired anywhere, fired
     everywhere, or a stale device would re-run the insertion sweep.
     R8-rider fix-2: the DATE resolves earliest-wins (the first sighting of the
     event), identically from both directions — it was local-wins on conflict. */
  out.insertions = (() => {
    const m9 = { ...(remote.insertions || {}) };
    for (const [k9, v9] of Object.entries(local.insertions || {})) { if (!(k9 in m9) || String(v9) < String(m9[k9])) m9[k9] = v9; }
    return m9;
  })();
  const rn = (remote.sleep && remote.sleep.nights) || [], ln = (local.sleep && local.sleep.nights) || [];
  out.sleep = { ...(remote.sleep || {}), ...(local.sleep || {}), nights: _unionBy(rn, ln, (n) => n && n.d) };
  out.plan = _unionPlan(remote.plan, local.plan);   // v7.2.0 Slice 3 — goals/ifthen keyed-union + policy scalars newest-deliberate-wins (was wholesale local-wins)
  out.learned = _unionLearned(remote.learned, local.learned);   // v7.3.0 Slice 4 — learned TDEE series + anchor log keyed-union (never clobbered by a stale sync)
  out.exOrder = _unionExOrder(remote.exOrder, local.exOrder);
  /* SPLIT item f — { planGen, exOrder } are ONE register: the higher
     generation's order payload wins TOGETHER, independent of wall clock or
     merge direction. Equal generations keep the union above. */
  {
    const gL = (local && local.planGen) || 0, gR = (remote && remote.planGen) || 0;
    if (gL !== gR) { const win = gL > gR ? local : remote; out.planGen = win.planGen; out.exOrder = JSON.parse(JSON.stringify(win.exOrder || {})); }
    else if (gL) out.planGen = gL;
  }
  /* SPLIT item d — the retirement register unions by key; absence never
     resurrects (a device that never learned the ruling contributes nothing). */
  out.retirements = { ...(remote.retirements || {}), ...(local.retirements || {}) };   // QUEUED #2 E — was riding the wholesale local-wins spread; an ordering needs newest-deliberate-wins + never-lose-a-lift
  /* R5 fix-2 (was P0-5) — every merge boundary NORMALIZES by construction:
     seams canonicalize always, and ruled-ORDER enforcement runs exactly where
     it is lawful (planGen 51 — a 52 custom order passes through unrepaired).
     Round 1 returned through canonicalizePlan alone, so a poisoned 51 order
     survived every merge and sync upload until the next sweep. */
  /* THE FEED MERGE BURIED NOVEL ENTRIES AT THE TAIL (pre-existing, v6.2 era; surfaced in
     production by the withdrawal receipt). _unionMulti iterates remote keys first, so every
     identity the remote knew rendered in remote order and LOCAL-ONLY entries appended at the
     tail: the 2026-08-06 CARD WITHDRAWN receipt sat at index 189 of 191, under July lines,
     and the feed head was 08-04. Every unshift assumes newest-first; one sync against a
     stale remote destroyed it — the withdrawal convention held in STATE and failed in
     DISPLAY, which is where he reads. Stable sort by d descending, scoped to feed, and LAST — after every writer this function runs (the carve receipt, the op-dedup, reconcileEraTransitions' replay and adoptshift lines, all of which unshift a line dated in the past): every
     feed line carries d, JS sort is stable so within-day emitted order survives, and the
     order-dependent consumer is the renderer. forecasts joins by date and does not care. */
  reconcileEraTransitions(normalizePlan(out));
  reconcileSightings(out, { mint: true });   /* A6 — the sighting record derives at the MERGE exit, and the joint-sighting mint fires HERE ONLY (a boot over legacy data can never mint) */
  reconcileDebutQueue(out);                  /* FIX-4 §6 — two devices, one graduation, one load on the bar */
  reconcileReadReceipts(out);          /* SCALE-2 — the read receipts re-derive from the merged reads */
  reconcileSuggestionEffects(out);     /* SCALE-2 — the suggestion effects re-derive from the merged log */
  if (Array.isArray(out.feed)) out.feed = _feedSorted(out.feed);
  return out;
}

/* ---------- derived ---------- */
/* `clean` is the PERFORMANCE question — see DEBT_NOTE — and now answers it with
   the threshold the performance literature uses. `run`/`at` stay as the TARGET
   question, which is what the sleep score and the lean-mass line ask. */
// END frozen src/app.jsx @ fe516c1:13371-14452.
return { _mergeScore, _richer, _readRank9, _readPick, _stampCorr, _corrOf, _valOr, _takeStamped, CACHE_RIDERS, CORR_KINDS, _fileCorr, _unionCorrLog, _tieKey, _canonJ, _replayCorrections, _mergeSession, _sessionAtMs, _richerSession, _unionBy, _unionObj, _unionMulti, _isoOr, _exDate, _queueRank, _adjRank, _adjInstant, _sugRank, _unionKeyed, PLAN_POLICY_SCALARS, _unionExOrder, _unionPlan, _unionLearned, MERGE_KEYED, MERGE_ARR, MERGE_MULTI, MERGE_OBJ, _isFeedProjection, _isFeedDerived, _feedDayOrder, _feedSorted, _sugSorted, mergeState };
};
