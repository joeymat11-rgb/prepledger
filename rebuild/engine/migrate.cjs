"use strict";

// Frozen migration/reconciliation closure. Every mutable binding belongs to this engine.
module.exports = function createMigrate(E, { clock, ids, drafts }) {
const localStorage = drafts;
const { AUTONOMY_LEVELS, DAY, INSERTION_PAIRS, LATE_READ_HOW, PLAN_POLICY_SCALARS, SCHEMA_V, SEED } = E;
const _bornValid = (...args) => E._bornValid(...args);
const _deriveSightingFull = (...args) => E._deriveSightingFull(...args);
const _formerNames = (...args) => E._formerNames(...args);
const applyInsertionSeams = (...args) => E.applyInsertionSeams(...args);
const atTopOfWindow = (...args) => E.atTopOfWindow(...args);
const beatsNoise = (...args) => E.beatsNoise(...args);
const bfEst = (...args) => E.bfEst(...args);
const deriveLastMeta = (...args) => E.deriveLastMeta(...args);
const deriveSighting = (...args) => E.deriveSighting(...args);
const exActive = (...args) => E.exActive(...args);
const exById = (...args) => E.exById(...args);
const isoOf = (...args) => E.isoOf(...args);
const loadRungs = (...args) => E.loadRungs(...args);
const mk = (...args) => E.mk(...args);
const nextLoad = (...args) => E.nextLoad(...args);
const normalizePlan = (...args) => E.normalizePlan(...args);
const pinsUnfilled = (...args) => E.pinsUnfilled(...args);
const todayStart = (...args) => E.todayStart(...args);
const typicalError = (...args) => E.typicalError(...args);
const weeksBetween = (...args) => E.weeksBetween(...args);

// Copied from frozen src/app.jsx @ fe516c1:375-375.
function _freshId(prefix) { if (!ids || typeof ids.fresh !== "function") throw new TypeError("An injected ids.fresh() is required for new engine identities"); return ids.fresh(prefix || ""); }

// Copied from frozen src/app.jsx @ fe516c1:2277-2318.
function _mintJointEarn(s, ex) {
  try {
    if (!ex || typeof ex.w !== "number") return false;   /* FIX-4 §1 — the RUN is not a second gate: the trace below is the one source of truth, so the mint cannot pass a test the derivation failed */
    if (String(ex.topAt) !== String(ex.w)) return false;
    const upNext9 = nextLoad(ex);
    if (upNext9 == null) return false;
    if ((s.queue || []).some((q9) => q9 && q9.exId === ex.id && q9.kind === "debut" && !q9.done)) return false;
    const names9 = _formerNames(ex).map((n9) => n9.toUpperCase());   /* FIX-4c §2 (rig185 W2) — the PROVISIONAL scan reads the whole name family: a day-1 line filed under a FORMER name is the same walk's receipt, and matching the current name only left the merged pair unminted while the serial walk earned */
    /* FIX-4 §1 — THE MINT CONSUMES THE DERIVATION'S OWN TENURE-BOUNDED TRACE. It used to rescan
       every session at the current load and pair the last two tops, so any two PROVISIONAL days
       paired whatever lay between them — a load excursion, an earn, an era boundary. The run and
       the pair now come from the same walk that produced the counter, so the mint cannot fire on
       a pair the derivation did not count. */
    const full9 = _deriveSightingFull(s, ex);
    const tdays9 = full9.tops || [];
    if (tdays9.length < 2 || String(full9.topAt) !== String(ex.w)) return false;
    const entOn9 = (d9) => (((s.sessionLog[d9] || {}).entries) || []).find((e9) => e9 && e9.id === ex.id && Array.isArray(e9.reps) && e9.reps.length);
    const dPrev9 = tdays9[tdays9.length - 2], dK9 = tdays9[tdays9.length - 1];
    const enPrev9 = entOn9(dPrev9), enK9 = entOn9(dK9);
    if (!enPrev9 || !enK9) return false;
    const lineOn9 = (d9, re9) => (s.feed || []).some((f9) => f9 && String(f9.d) === String(d9) && typeof f9.t === "string" && names9.some((n9) => f9.t.indexOf(n9) === 0) && re9.test(f9.t));
    const prov9 = /(TOP OF WINDOW, PROVISIONAL|NO NEXT LOAD ON FILE)$/;
    if (!lineOn9(dPrev9, prov9) || !lineOn9(dK9, prov9)) return false;          /* both walks saw a first sighting */
    if (lineOn9(dK9, / EARNED$/) || lineOn9(dK9, /BUT HOT$/)) return false;      /* neither already decided */
    if (enK9.rir === 0) return false;                                            /* a grind is not an earn */
    const exR9 = { ...ex, topAt: ex.w, topRun: tdays9.length - 1, sets: enK9.reps.length || ex.sets };   /* FIX-4 §1 — the run the walk should SEE is the one before this session, off the derivation trace */
    const lines9 = [];
    earnWalk(s, exR9, enK9, enK9.reps.map((x9) => Number(x9) || 0), { w: enPrev9.w, reps: enPrev9.reps }, (t9, how9) => lines9.push({ t: t9, how: how9 }), dK9);
    for (const l9 of lines9) {
      const op9 = "replay:" + dK9 + ":" + ex.id + ":" + String(l9.t).slice(0, 32);
      /* FIX-4 §2 (Sol A6-2, P0) — DEDUPE BY FACT IDENTITY, NEVER BY THE SENTENCE IT PRINTS.
         "PRESS 255 EARNED" is a display title, and a lift that graduates to 255, runs it,
         deloads and earns 255 again prints exactly the same words — so the title test silently
         suppressed a LEGITIMATE re-earn and left the record unspent, one honest session from
         buying the load a second time. The op is dated, so the same fact dedupes and a new
         fact files. */
      if ((s.feed || []).some((f9) => f9 && f9.op === op9)) continue;
      s.feed.unshift({ d: dK9, t: l9.t, how: l9.how, op: op9 });
    }
    return lines9.length > 0;
  } catch (e) { return false; }
}

// Copied from frozen src/app.jsx @ fe516c1:2321-2335.
function reconcileSightings(s, opts) {
  try {
    for (const ex of ((s && s.exercises) || [])) {
      if (!ex || !exActive(s, ex.id)) continue;
      const d9 = deriveSighting(s, ex);
      if (d9.topAt == null) { if (ex.topAt != null) ex.topAt = null; if ((ex.topRun || 0) !== 0) ex.topRun = 0; }
      else { ex.topAt = d9.topAt; ex.topRun = d9.topRun; }
      if (opts && opts.mint && _mintJointEarn(s, ex)) {
        const d2 = deriveSighting(s, ex);                    /* the earn spends the record — re-derive */
        if (d2.topAt == null) { ex.topAt = null; ex.topRun = 0; } else { ex.topAt = d2.topAt; ex.topRun = d2.topRun; }
      }
    }
  } catch (e) {}
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:2362-2380.
function reconcileDebutQueue(s) {
  try {
    const best9 = new Map();
    for (const q9 of ((s && s.queue) || [])) {
      if (!q9 || q9.done || q9.kind !== "debut" || q9.state === "PROPOSED") continue;
      if (q9.exId == null || typeof q9.newW !== "number") continue;
      const k9 = String(q9.exId) + "|" + String(q9.newW);
      const cur9 = best9.get(k9);
      if (!cur9 || String(q9.id) < String(cur9.id)) best9.set(k9, q9);
    }
    for (const q9 of ((s && s.queue) || [])) {
      if (!q9 || q9.done || q9.kind !== "debut" || q9.state === "PROPOSED") continue;
      if (q9.exId == null || typeof q9.newW !== "number") continue;
      const k9 = String(q9.exId) + "|" + String(q9.newW);
      if (best9.get(k9) !== q9) { q9.done = true; q9.state = "SUPERSEDED"; }
    }
  } catch (e) {}
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:2381-2453.
function reconcileEraTransitions(s) {
  try {
    for (const ex of ((s && s.exercises) || [])) {
      if (!ex || !Array.isArray(ex.forks) || !ex.forks.length) continue;
      /* A6 (FIX-2) — THE REPLAY ARM IS RETIRED. It cleared and replayed the sighting record
         off a split seam; this round proved it unreachable (a technique fork never carries
         split) and then SUPERSEDED it outright — deriveSighting recomputes the record from the
         session log and the walk's receipts at every exit, for every lift, which is what this
         arm was reaching for and never generalised to. The adoption-story half of this
         function below is untouched and stays live. */
      const lastFk = null;
      if (!lastFk) continue;
      const days = Object.keys(s.sessionLog || {}).filter((d) => d >= lastFk.from && (((s.sessionLog[d] || {}).entries) || []).some((e) => e && e.id === ex.id)).sort();
      if (days.length < 2) continue;
      ex.topAt = null; ex.topRun = 0;   /* the fold owns the era's sighting record */
      for (let i = 1; i < days.length; i++) {
        const en = (((s.sessionLog[days[i]] || {}).entries) || []).find((e) => e && e.id === ex.id);
        const prevEn = (((s.sessionLog[days[i - 1]] || {}).entries) || []).find((e) => e && e.id === ex.id);
        if (!en || !Array.isArray(en.reps) || !en.reps.length) continue;
        const r = en.reps.map((x) => Number(x) || 0);
        try {
          /* the walk runs against a per-session PROJECTION (the load and slot
             count the session was actually performed at); only the sighting
             record folds back. No live field is reassigned, so the stamp
             discipline holds by construction. */
          const exR = { ...ex, w: (typeof en.w === "number" ? en.w : ex.w), sets: r.length || ex.sets };
          if (typeof exR.w === "number" && atTopOfWindow(r, exR, s, days[i])) {
            const lines9 = [];
            earnWalk(s, exR, en, r, prevEn ? { w: prevEn.w, reps: prevEn.reps } : null, (t9, how9) => lines9.push({ t: t9, how: how9 }), days[i]);
            for (const l9 of lines9) {
              const op9 = "replay:" + days[i] + ":" + ex.id + ":" + String(l9.t).slice(0, 32);
              if ((s.feed || []).some((f9) => f9 && f9.op === op9)) continue;
              s.feed.unshift({ d: days[i], t: l9.t, how: l9.how, op: op9 });
            }
          } else if (typeof exR.w === "number" && String(exR.topAt) === String(exR.w)) exR.topRun = 0;   /* falling off the top resets the run, exactly as the walk does */
          /* CONSUMPTION: when the queue already holds the non-proposed debut
             this sighting run would earn (minted serially, or by an earlier
             fold), the earn is a FACT and the walk's own zeroing already
             happened on the device that minted it — the fold consumes the run
             the same way, or a self-merge would resurrect a spent sighting. */
          const upC = typeof exR.w === "number" ? nextLoad(exR) : null;
          if (upC != null && (s.queue || []).some((q9) => q9 && q9.exId === ex.id && q9.kind === "debut" && q9.state !== "PROPOSED" && String(q9.newW) === String(upC))) { exR.topAt = null; exR.topRun = 0; }
          ex.topAt = exR.topAt; ex.topRun = exR.topRun;
        } catch (e9) {}
      }
    }
    /* THE ADOPTION STORY CONVERGES: the kept (earliest) adopt receipt names
       its load; when the stamped config ended elsewhere (a second device
       adopted a different first load offline), the transition is told once,
       in the CAGE register the serial run would have used.
       FIX-18 — AND IT IS A PROJECTION, the carve receipt's rule (Sol, pass 4)
       applied to the merge's other receipt: every adoptshift line is dropped
       here and re-derived from the merged state — the kept adopt receipt
       against the working load — so the line stands iff its warrant does. An
       intermediate merge's pick can be overturned by a later merge (the
       op-dedup is a min over every input's receipts), and the line it filed
       then described a receipt that no longer stood: (A+B)+C carried it and
       A+(B+C) never filed it (cowork, leg 19, by enumeration). Re-filed at the
       front of its day, where a merge-time receipt always lands. */
    if (Array.isArray(s.feed)) s.feed = s.feed.filter((x9) => !(x9 && typeof x9.op === "string" && x9.op.indexOf("adoptshift:") === 0));
    for (const f of (s.feed || []).slice()) {
      if (!(f && f.op && String(f.op).indexOf("adopt:") === 0 && typeof f.w === "number")) continue;
      const idA = String(f.op).slice(6);
      const eA = (s.exercises || []).find((x9) => x9 && x9.id === idA);
      if (!eA || typeof eA.w !== "number" || eA.w === f.w) continue;
      const tA = eA.n.toUpperCase() + " — LOGGED AT " + eA.w + " (plan said " + f.w + ")";
      const opA = "adoptshift:" + idA + ":" + eA.w;
      if ((s.feed || []).some((x9) => x9 && (x9.t === tA || x9.op === opA))) continue;
      s.feed.unshift({ d: String(eA.wAt || "").slice(0, 10) || (Object.keys(s.sessionLog || {}).sort().pop() || ""), t: tA, how: "Reality outranks the filed plan: two devices adopted different first loads offline; the newer stamp holds the working load, and the story reconciles here. Every session stays on the record at the load it was lifted.", op: opA });
    }
  } catch (e) {}
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:2466-2558.
function earnWalk(s, ex, en, r, prevMeta, push, dEarn) {
  const grad9 = String(dEarn || (en && en.d) || "");
  const upNext = nextLoad(ex);
  if (upNext == null) {
      const topRun0 = String(ex.topAt) === String(ex.w) ? (ex.topRun || 0) + 1 : 1;
      ex.topAt = ex.w; ex.topRun = topRun0;
      if (!loadRungs(ex)) push(ex.n.toUpperCase() + " — TOP OF WINDOW, NO NEXT LOAD ON FILE", ex.w + "×" + r.join(",") + " tops the window (sighting " + topRun0 + " banked). No next weight is on file for this machine — answer the next-load ask and this sighting already counts toward the earn.");
    }
  if (upNext != null) {
      /* R18 fix — PROPOSED items neither block the classic earn nor survive it: an
         untapped offer is superseded the moment the two-for-two law earns the same
         lift's debut properly. Consent stays with the tap; the floor stays automatic. */
      const already = s.queue.some((x) => x.exId === ex.id && !x.done && x.kind === "debut" && x.state !== "PROPOSED");
      /* Two-for-two, from measurement error rather than sleep. Topping the rep
         window once at a given load can be a good day: Mitter 2022 puts a single
         set's prediction error at 0.9-1.4 reps, and his own repeats put it at
         0.75, so the last rep of a window is routinely inside the noise. Two
         sightings at the same load is the ACSM rule (Ratamess 2009) and is the
         only published precedent — applied there, as here, with no readiness
         qualifier. The escape hatch is size: a session that clears the previous
         line by two standard errors of the session total is not a good day, it
         is a different capacity, and it banks on the spot. */
      /* SIGHTING-WINDOW LAW (R18 fix round, ruled with Cowork): a sighting is a claim
         about a specific window — any writer that moves ex.hi MUST reset topAt/topRun.
         No live hi-writer exists today (only a frozen patch); the law binds the next one. */
      const topRun = String(ex.topAt) === String(ex.w) ? (ex.topRun || 0) + 1 : 1;
      ex.topAt = ex.w; ex.topRun = topRun;
      const bn = beatsNoise(s, ex.id, r, (prevMeta && String(prevMeta.w) === String(en.w) && prevMeta.reps) || null);
      const confirmed = topRun >= 2 || bn.clear;
      /* Q7c (PROGRESSION-1) — "HOT" MEANS THE OPENER WAS HOT. `en.rir` IS the opener's
         rating; the prescribed terminal set goes to 0 BY DESIGN (rirPlan tapers 2...0), and
         a terminal 0 must never gate the earn — it is the instrument that SIZES the step.
         The two are different questions and the copy used to conflate them. */
      const openRir9 = en.rir;   /* the OPENER's rating — never the terminal set's */
      if (openRir9 === 0 || ex.holdFlag) {
        /* Hunt 3 (Grok, executed) — THE LINE MAY ONLY CLAIM WHAT THE RECORD HOLDS. This arm
           fires for two different reasons — a hot opener, or the governor's hold — and it said
           "with the opener at RIR 0" for both. Under a hold with no opener rating on file
           (rirSets [null, null, 2]) that is a claim the record does not support. Say which
           reason actually fired. */
        const openKnown9 = openRir9 === 0 || (Array.isArray(en.rirSets) && en.rirSets[0] === 0);
        if (!already) push(`${ex.n.toUpperCase()} — TOP OF WINDOW, BUT HOT`, openKnown9
          ? `${r.join(",")} with the opener at RIR 0 — a grind is not an earn; repeat it honest and the load queues itself`
          : `${r.join(",")} at the top of the window, but the load is held — one honest opener releases it and the load queues itself`);
        /* Q7c, owner ruled YES — a hot OPENER blocks the automatic earn, but if the
           TERMINAL set still reported two or more in reserve at the top of the window, the
           R18d one-sighting offer is still made: the athlete consents by tapping it. The
           automatic earn keeps waiting for an honest opener, and the
           hold-after-two-grind-openers governor is untouched. Live witnesses: 08-03 rows
           [9,9] rirSets [0,2], 07-31 hack [11,10,11] [0,null,2], 07-31 extension [10,9] [0,2]. */
        const rirH9 = (() => { const a9 = Array.isArray(en.rirSets) ? en.rirSets : []; const v9 = a9.length ? a9[a9.length - 1] : null; return v9 != null ? v9 : (en.rirEnd != null ? en.rirEnd : null); })();
        if (!already && rirH9 != null && rirH9 >= 2 && upNext != null && !s.queue.some((x) => x.exId === ex.id && !x.done && (x.kind === "debut" || x.kind === "unlock"))) {
          s.queue.push({ id: `q_${ex.id}_${upNext}_${grad9}_1s`, kind: "debut", exId: ex.id, newW: upNext, ...(Array.isArray(ex.wSets) && typeof ex.w === "number" && typeof upNext === "number" ? { newWSets: ex.wSets.map((x9) => x9 + (upNext - ex.w)) } : {}), done: false, state: "PROPOSED", t: `${ex.n.toUpperCase()} ${upNext} — EARN PROPOSED OFF ONE SIGHTING`, rule: "Rides only on your tap — the automatic earn still waits for an honest opener.", gate: `Top of the window at ${ex.w}, terminal set with ${rirH9} in reserve — the line was there even though the opener was a grind. Your call: tap to take it, or repeat it honest and it queues itself.` });
          push(`${ex.n.toUpperCase()} ${upNext} — EARN PROPOSED OFF ONE SIGHTING`, `${ex.w}×${r.join(",")} — the opener ran hot, so this does not queue itself; the terminal set had ${rirH9} in reserve at the top of the window, so the offer stands on your tap.`);
        }
      } else if (confirmed && !already) {
        ex.topRun = 0; ex.topAt = null;
        /* R18d — THE JUMP SIZES ITSELF, but only where a measured ladder exists and only
           as a PROPOSAL when it goes beyond today's behaviour. Terminal RIR (the failure
           set's answer): 1-2 → one rung, exactly as before. ≥3 with a rung ladder → the
           TWO-rung debut MAY be proposed — the athlete consents by tapping it, the
           structural budget is untouched, and even-inc lifts keep today's behaviour
           byte-identical. Never prescribe below what was delivered. */
        const rirT9 = (() => { const a9 = Array.isArray(en.rirSets) ? en.rirSets : []; const v9 = a9.length ? a9[a9.length - 1] : null; return v9 != null ? v9 : (en.rirEnd != null ? en.rirEnd : null); })();
        const rung2 = loadRungs(ex) && rirT9 != null && rirT9 >= 3 ? nextLoad(ex, upNext) : null;
        const how = bn.clear && topRun < 2
          ? `${ex.w}×${r.join(",")} — ${bn.margin} reps clear of last time, and two standard errors of the new-minus-old difference (both sessions carry error) is ${bn.need}. That is outside the noise, so it banks on one sighting.`
          : `${ex.w}×${r.join(",")} — second session at the top of the window at this load. One is inside your ±${(typicalError(s, ex.id).reps).toFixed(2)}-rep spread; two is not.`;
        s.queue.forEach((x) => { if (x.exId === ex.id && x.state === "PROPOSED" && !x.done) { x.done = true; x.state = "SUPERSEDED"; } });   /* the classic earn outranks any standing offer */
        if (rung2 != null) s.queue.push({ id: `q_${ex.id}_${rung2}_${grad9}_2r`, kind: "debut", exId: ex.id, newW: rung2, ...(Array.isArray(ex.wSets) && typeof ex.w === "number" && typeof rung2 === "number" ? { newWSets: ex.wSets.map((x9) => x9 + (rung2 - ex.w)) } : {}), done: false, rule: "Rides only on your tap — the single-rung debut queues automatically either way.", t: `${ex.n.toUpperCase()} ${rung2} — TWO-RUNG DEBUT PROPOSED`, state: "PROPOSED", gate: `Terminal set had ${rirT9} in reserve at the top of the window — the one-rung jump underprices what was delivered. Your call: this rides only if you tap it, and the ${upNext} single-rung debut queues either way.` });
        /* Hunt 4 (Grok, executed) — THE VECTOR ADVANCES WITH THE LOAD. genSession has a
           per-slot debut arm that reads q.newWSets, and nothing ever wrote it: the curl earned
           60, the card rendered at 60, and after the debut completed ex.wSets was STILL
           [55,55,50] — the lift's per-set line frozen a load behind its own working weight. The
           earn now mints the vector the same way the owner ruled the graduation: uniformly, by
           the load's own step (55·55·50 + 5 = 60·60·55). A lift with no wSets mints nothing and
           is byte-identical to today. */
        s.queue.push({ id: `q_${ex.id}_${upNext}_${grad9}`, kind: "debut", exId: ex.id, newW: upNext, ...(Array.isArray(ex.wSets) && typeof ex.w === "number" && typeof upNext === "number" ? { newWSets: ex.wSets.map((x9) => x9 + (upNext - ex.w)) } : {}), t: `${ex.n.toUpperCase()} ${upNext} DEBUT`, state: "DEBUT", gate: `Earned via ${ex.w}×${r.join(",")}`, rule: "Auto-queued — runs when it wins the structural slot", done: false });
        push(`${ex.n.toUpperCase()} ${upNext} EARNED`, how + (loadRungs(ex) ? " Next rung this machine makes." : " Confirm the rung: does this machine actually make " + upNext + " next? If not, fix the ladder in SETUP (uneven ✎) before the debut."));   /* R18c — the EARNED banner asks for rung confirmation where no ladder is on file */
      } else if (!already) {
        /* R18d AMENDMENT (Joe's ruling, 2026-08-10): at the top of the window with the
           terminal set reporting ≥2 in reserve, ONE sighting may earn — as a PROPOSAL.
           The two-for-two law stands for the automatic queue; this arm only offers, and
           only when the athlete's own terminal answer says the top was not a grind. */
        const rirT8 = (() => { const a9 = Array.isArray(en.rirSets) ? en.rirSets : []; const v9 = a9.length ? a9[a9.length - 1] : null; return v9 != null ? v9 : (en.rirEnd != null ? en.rirEnd : null); })();
        if (rirT8 != null && rirT8 >= 2) {
          s.queue.push({ id: `q_${ex.id}_${upNext}_${grad9}_1s`, kind: "debut", exId: ex.id, newW: upNext, ...(Array.isArray(ex.wSets) && typeof ex.w === "number" && typeof upNext === "number" ? { newWSets: ex.wSets.map((x9) => x9 + (upNext - ex.w)) } : {}), done: false, rule: "Rides only on your tap — untapped, the two-for-two law runs as always.", t: `${ex.n.toUpperCase()} ${upNext} — EARN PROPOSED OFF ONE SIGHTING`, state: "PROPOSED", gate: `${ex.w}×${r.join(",")} tops the window with ${rirT8} in reserve on the failure set. One sighting is inside your own spread, so the automatic earn still waits for the second — but an honest top with reps in reserve is your call to take early. Tap it and ${upNext} debuts; skip it and the two-for-two law runs as always.` });
        }
        const te = typicalError(s, ex.id);
        push(`${ex.n.toUpperCase()} — TOP OF WINDOW, PROVISIONAL`, `${r.join(",")} tops the window${bn.margin > 0 ? `, ${bn.margin} rep${bn.margin === 1 ? "" : "s"} up on last time` : ""} — but your own set-to-set spread is ±${te.reps.toFixed(2)} reps (${te.src}), so one sighting cannot be told apart from a good day. Repeat it and the load queues itself. Sleep does not enter into it.`);
      }
  }
}

// Copied from frozen src/app.jsx @ fe516c1:10298-10353.
function reconcileReadReceipts(s) {
  if (!Array.isArray(s.feed) || !Array.isArray(s.reads)) return s;
  const lateD = []; const cleanD = new Set();
  for (const r of s.reads) { if (!r || !r.d) continue; if (r.offWindow && !r.sealed) { if (lateD.indexOf(r.d) < 0) lateD.push(r.d); } else if (!r.offWindow) cleanD.add(r.d); }   /* SCALE-5 (Sol's pass 3, new row 1) — a SEALED morning read disproves a missed/gap line too: sealing sets the value aside from the trend, it does not mean the weigh-in was missed — readWindow.hasRead and runAdaptive.todayRead already say so, and only this reconciler and the guard disagreed */
  /* the whole receipt family comes OUT and the warranted members go back at ONE
     canonical position (their day's tail, in one order) — the merge's ride-through
     appends projections while a boot leaves stored positions; without the
     re-position, boot(m) and merge(m,m) disagreed on a MISSED line's slot. */
  const kept9 = [];
  s.feed = s.feed.filter((f) => {
    if (!f) return false;
    if (typeof f.op === "string" && f.op.indexOf("lateread:") === 0) return false;
    if (f.t === "LATE READ — SET ASIDE" || f.t === "EVENING READ — SET ASIDE") return false;
    if (typeof f.t === "string" && (f.t.indexOf("MORNING READ MISSED") === 0 || f.t.indexOf("READ GAP") === 0)) {
      if (!cleanD.has(f.d)) kept9.push(f);   /* warranted: no clean read disproves it */
      return false;
    }
    return true;
  });
  for (const d of lateD) kept9.push({ d, op: "lateread:" + d, t: "LATE READ — SET ASIDE", how: LATE_READ_HOW });
  /* SCALE-4 (Sol's pass 2, new row 1b) — ONE summary line per missed day. Two replicas
     that priced the same absence from different vantages (a MORNING READ MISSED beside a
     READ GAP) both survived the merge as contradictory receipts for one day; the
     warranted family now keeps exactly one line per day, canonical pick — the bodies
     cannot be re-derived (they price the moment they were filed), so the day keeps a
     line, deterministically, and the durability guard protects the DAY, not the byte. */
  const missBy9 = new Map(); const rest9 = [];
  for (const f of kept9) {
    if (typeof f.t === "string" && (f.t.indexOf("MORNING READ MISSED") === 0 || f.t.indexOf("READ GAP") === 0)) {
      const d9 = String(f.d); const cur9 = missBy9.get(d9);
      if (!cur9 || _canonJ(f) < _canonJ(cur9)) missBy9.set(d9, f);
    } else rest9.push(f);
  }
  const kept10 = [...rest9, ...missBy9.values()];
  /* SCALE-4 (Sol's pass 2, new row 2) — the patch59 receipt is a PROJECTION of the
     re-classed reads. The patch authored its body from each replica's local hits and the
     op-dedup then kept whichever body sorted lower — a receipt claiming one read could
     outlive a union that carried three. The re-class now marks its reads (r.reclassed),
     and the receipt body derives from the marked reads in the MERGED state. States with
     the op line but no marked reads (none ship — v7.55.x never deployed) keep the line
     as found: an underivable receipt is preserved, never guessed. */
  const rc9 = (Array.isArray(s.reclassLog) ? s.reclassLog : []).filter((d9) => s.reads.some((r) => r && r.d === d9)).sort();   /* SCALE-5 — the receipt claims the attested dates whose reads are PRESENT in this state */
  if (rc9.length) {
    for (let i9 = kept10.length - 1; i9 >= 0; i9--) if (kept10[i9] && kept10[i9].op === "patch59:scale") kept10.splice(i9, 1);
    s.feed = s.feed.filter((f) => !(f && f.op === "patch59:scale"));
    const dd9 = (iso) => +iso.slice(5, 7) + "/" + +iso.slice(8, 10);
    const one9 = rc9.length === 1;
    kept10.push({ d: "2026-08-19", op: "patch59:scale",
      t: (one9 ? "A MORNING READ" : rc9.length + " MORNING READS") + " RE-CLASSED — " + rc9.map(dd9).join(", "),
      how: "The window rule read ‘today's numbers are typed’ as ‘breakfast happened’ and set " + (one9 ? "a" : "these") + " morning weigh-in" + (one9 ? "" : "s") + " aside as evening reads; the owner attested on 2026-08-19 that " + (one9 ? "it was" : "all were") + " morning reads. " + (one9 ? "It counts" : "They count") + " now: the trend replays to " + s.trend + "; the false receipts from " + (one9 ? "that morning" : "those mornings") + " are removed. Forecasts and the TDEE log keep what the app said on the day." });
  }
  kept10.sort((a, b) => { const ka = String(a.d) + "|" + String(a.t) + "|" + _canonJ(a), kb = String(b.d) + "|" + String(b.t) + "|" + _canonJ(b); return ka < kb ? -1 : ka > kb ? 1 : 0; });
  const seen9 = new Set();
  for (const f of kept10) { const k9 = _canonJ(f); if (seen9.has(k9)) continue; seen9.add(k9); s.feed.push(f); }
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10370-10426.
function reconcileTrendChain(s) {
  if (!Array.isArray(s.reads)) return s;
  /* SCALE-6 (Sol's pass 4) — no early return may skip a normalization: the store
     normalized only when reads existed, the canonical re-key only when a pt-bearing
     read existed, and the date-fold not at all — three ways a supported import booted
     as a state its first self-merge rewrote. Everything below runs unconditionally;
     only the CHAIN itself needs a pt-bearing read. */
  /* SCALE-5 (Sol's pass 3) — TWO normalizations at the chain's head, the one choke point
     that runs at merge AND every boot exit.
     (1) THE ATTESTATION IS UNLOSABLE. The re-class travelled as a flag on the read body
     (r.reclassed) and an old client's union strips it — a mixed-version merge turned the
     owner-attested 8/10 morning read back into an evening read and the receipt claimed
     one fewer correction. The record now lives in s.reclassLog (a date set, merged by
     set-union — monotone), absorbed here from any in-flight flags AND re-derived
     value-keyed from the shipped SCALE1_RECLASS table, and ENFORCED here: a read at an
     attested date that has come back offWindow is re-classed again, every settle. The
     flag itself is retired from the read body.
     (2) CANONICAL BYTES. The read union returns a winning OPERAND, so one logical read
     in two key orders merged to different bytes by direction. Every read is materialized
     in canonical key order here, so merge and boot agree byte-for-byte. */
  const rl9 = new Set(Array.isArray(s.reclassLog) ? s.reclassLog.map(String) : []);
  for (const r of s.reads) if (r && r.reclassed && r.d) rl9.add(String(r.d));
  for (const f of (Array.isArray(s.feed) ? s.feed : [])) if (f && typeof f.op === "string" && f.op.indexOf("reclass:") === 0) rl9.add(f.op.slice(8));
  for (const k of SCALE1_RECLASS) { const r = s.reads.find((x) => x && x.d === k.d && x.w === k.w); if (r) rl9.add(k.d); }   /* the (d,w) pair IS the attested read — matched regardless of classification */   /* SCALE-6 (Sol's pass 4, blocker 3) — the attestation FACTS: op-keyed permanent feed lines patchV59 files, one per attested date. They ride EVERY old client's feed union (the max-multiset preserves op lines regardless of spread direction), so the store re-derives even through the braid that lost it: the executed witness had an alternate 164.1 late body win the old by-date union — the (d,w) table could no longer match, the store rode the old spread, and the owner's 8/10 word reversed. A fact line cannot be unsaid by an older copy of the app. */   /* the (d,w) pair IS the attested read — matched regardless of classification, so the attestation survives even a replica that lost both the store and the mis-filed shape (the re-class ACTION below still fires only on an offWindow copy) */
  for (const r of s.reads) {
    if (!r) continue;
    if (r.reclassed) delete r.reclassed;
    if (rl9.has(String(r.d)) && r.offWindow && !r.sealed) { delete r.offWindow; r.note = String(r.note || "").split(" · ").filter((x) => x && !/set aside/.test(x)).join(" · "); }
  }
  if (rl9.size) s.reclassLog = [...rl9].sort(); else delete s.reclassLog;
  /* the DATE-FOLD (B1c): one read per day is the merge's own law — the settle applies
     the same _readPick authority, so an import carrying two bodies for one date boots
     to what its first merge would have made of it */
  { const byDF9 = new Map(); for (const r of s.reads) { if (!r || r.d == null) continue; const c9 = byDF9.get(r.d); byDF9.set(r.d, c9 ? _readPick(c9, r) : r); } s.reads = [...byDF9.values()]; }
  s.reads = s.reads.slice().sort((a, b) => { const ka = String((a && a.d) || ""), kb = String((b && b.d) || ""); return ka < kb ? -1 : ka > kb ? 1 : 0; });
  const step9 = (t9, w9) => +(t9 + 0.3 * Math.max(-1.5, Math.min(1.5, w9 - t9))).toFixed(1);
  const i0 = s.reads.findIndex((r) => r && typeof r.pt === "number" && typeof r.w === "number");
  const after9 = {};
  if (i0 >= 0) {
    let t9 = s.reads[i0].pt;
    for (let i = i0; i < s.reads.length; i++) { const r = s.reads[i]; if (!r || typeof r.w !== "number") continue; r.pt = t9; if (!r.sealed && !r.offWindow) { t9 = step9(t9, r.w); after9[r.d] = t9; } }
    if (typeof s.trend === "number") s.trend = t9;
  }
  /* the canonical re-key runs AFTER the chain writes pt and UNCONDITIONALLY (B6: a
     valid no-pt read — all 39 SEED reads ship without pt — kept its operand key order
     forever because the re-key sat behind the pt-bearing early return) */
  s.reads = s.reads.map((r) => (r && typeof r === "object" && !Array.isArray(r) ? JSON.parse(_canonJ(r)) : r));
  if (i0 >= 0) {
    const start9 = s.reads[i0].d;
    for (const w of (Array.isArray(s.weekly) ? s.weekly : [])) {
      if (!w || typeof w.wk !== "string") continue;
      const first = s.reads.find((r) => r && !r.sealed && !r.offWindow && typeof r.w === "number" && r.d >= w.wk && weeksBetween(w.wk, r.d) < 1);
      if (first && first.d >= start9 && after9[first.d] != null) w.trend = after9[first.d];
    }
  }
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10439-10654.
function reconcileSuggestionEffects(s) {
  /* SCALE-6 (Sol's pass 4, B1a) — the settle applies the MERGE'S OWN keyed reduction
     first: an import carrying two rows for one sid booted with both (and the wrong
     effect) until its first self-merge collapsed them. Same for a duplicated
     adjustment id. */
  if (Array.isArray(s.suggestionLog)) s.suggestionLog = _unionKeyed(s.suggestionLog, [], (x) => x && x.sid, _sugRank);
  if (Array.isArray(s.adjustments)) s.adjustments = _unionKeyed(s.adjustments, [], (a) => a && (a.id || (a.rid + "|" + a.d)), _adjRank);
  /* SCALE-7 (Sol's pass 5, P0 — CONFIRMED end to end on the real f72dbf7 engine: the
     old client's wholesale suggestionLog spread erased a decided row while its keyed
     adjustments union carried the undo flag on, the old dataLossGuard called the push
     safe, the fresh device re-offered the card, and a re-approval was killed at its
     next settle by the stale undone adjustment). ORPHAN ABSORPTION, before any
     pending/effect derivation: an undo whose decision row is gone re-materializes as a
     canonical tombstone row, from evidence that measurably survives every braid — the
     keyed adjustment (never-drop union on every client since v7.2.0) plus the sid's
     op-keyed feed line (the `sug:` receipt, or the `sugundo:` FACT the undo writer now
     files). Without one of those ops the rid is not provably suggestion-origin and is
     not ours to invent — a tombstone on a proposal-family rid would print an analyst
     line over an engine record. The tombstone is approved+undone: the card stays
     decided, a re-approval stays refused, the UNDONE receipt re-derives below, the
     feedop guard keeps its op alive, and the true row outranks the tombstone in the
     union (the non-orphan bit in _sugRank) the moment any replica still carrying it
     syncs. */
  { const sids7 = new Set(); for (const x of (Array.isArray(s.suggestionLog) ? s.suggestionLog : [])) if (x && x.sid) sids7.add(x.sid);
    const ops7 = new Map();
    for (const f of (Array.isArray(s.feed) ? s.feed : [])) {
      if (!f || typeof f.op !== "string") continue;
      if (f.op.indexOf("sugundo:") === 0) ops7.set(f.op.slice(8), f);
      else if (f.op.indexOf("sug:") === 0) { const k7 = f.op.slice(4); if (!ops7.has(k7)) ops7.set(k7, f); }
    }
    for (const a of (Array.isArray(s.adjustments) ? s.adjustments : [])) {
      if (!a || !a.undone || a.rid == null) continue;
      const sid7 = String(a.rid);
      if (sids7.has(sid7) || !ops7.has(sid7)) continue;
      s.suggestionLog.push({ sid: sid7, decided: "approved", undone: true, orphan: true, d: a.d, ...(a.at ? { at: a.at } : {}), title: a.title || "" });
      sids7.add(sid7);
    }
    for (const [sid7, f7] of ops7) {   /* FACT-only belt: the undo attestation alone proves an approved-then-undone decision */
      if (sids7.has(sid7) || String(f7.op || "").indexOf("sugundo:") !== 0) continue;
      s.suggestionLog.push({ sid: sid7, decided: "approved", undone: true, orphan: true, d: f7.d, title: f7.ti != null ? String(f7.ti) : "" });
      sids7.add(sid7);
    }
  }
  /* SCALE-6 (Sol's pass 4, B4 — his required belt, shipped although his exact witness
     REFUTED on the real v7.54.18 engine: the old client's suggestionLog spread is
     measured REMOTE-wins wholesale, which preserves the cloud's undone flag. The belt
     is transport-independent recovery: the adjustment's undone flag — which every old
     client's keyed adjustments union preserves as terminal — restores the decision
     row's undone through ANY braid, and it honors historical undo taps filed before
     the undo learned to land on the row. */
  { const byS0 = new Map();
    for (const x of (Array.isArray(s.suggestionLog) ? s.suggestionLog : [])) if (x && x.sid) byS0.set(x.sid, x);
    for (const a of (Array.isArray(s.adjustments) ? s.adjustments : [])) {
      if (!a || !a.undone || a.rid == null) continue;
      const r0 = byS0.get(a.rid);
      if (r0 && r0.decided === "approved" && !r0.undone) r0.undone = true;
    } }
  const log9 = Array.isArray(s.suggestionLog) ? _sugSorted(s.suggestionLog) : [];
  const K9 = { protein: "proteinG", sleep: "sleepH", dietbreak: "dietBreak", progression: "progression" };
  const seen9 = {}; const last9 = {};
  for (const x of log9) {
    if (!x || !x.apply || !K9[x.apply.kind]) continue;
    const f9 = K9[x.apply.kind];
    seen9[f9] = true;   /* the kind is on the log's record (note/dismiss rows carry it too, so a losing approval reverses) */
    if (x.decided !== "approved" || x.undone) continue;   /* SCALE-5 — an undone approval's effect is OFF; the kind stays seen, so the reversal derives */
    const a9 = x.apply;
    if (a9.kind === "protein" && a9.to != null) last9.proteinG = a9.to;
    else if (a9.kind === "sleep" && a9.to != null) last9.sleepH = a9.to;
    else if (a9.kind === "dietbreak") last9.dietBreak = x.d;
    else if (a9.kind === "progression") last9.progression = a9.to || true;
  }
  s.targets = s.targets || {};
  /* a kind the log has NEVER mentioned is left alone — a restored pre-log state's scalar
     is not the derivation's to delete; every production write of these four keys files a
     log row, so mentioned-kinds cover every live path */
  for (const k9 of ["proteinG", "sleepH", "dietBreak", "progression"]) { if (k9 in last9) s.targets[k9] = last9[k9]; else if (seen9[k9]) delete s.targets[k9]; }
  /* SCALE-4 — canonical key order: targets rides the scalar spread, so two directions
     insert its keys in different orders and the merged states differ in bytes alone. */
  { const t9 = s.targets; const out9 = {};
    for (const k9 of ["proteinG", "sleepH", "dietBreak", "progression"]) if (k9 in t9) out9[k9] = t9[k9];
    for (const k9 of Object.keys(t9).sort()) if (!(k9 in out9)) out9[k9] = t9[k9];
    s.targets = out9; }
  const bySid9 = new Map(); for (const x of log9) if (x && x.sid) bySid9.set(x.sid, x);
  /* SCALE-4 (Sol's pass 2, row 4) — the adjustment's dismissed flag is a DERIVATION of
     the decision log, BOTH ways. The pass-2 witness: an intermediate merge marked C's
     adjustment dismissed, _adjRank made it terminal, and the old one-way rule (set,
     never clear) could not repair it when the earlier winning approval arrived in the
     other grouping — (A+B)+C and A+(B+C) disagreed. Now: rid in the log and the row not
     approved → dismissed; row approved → exactly ONE adjustment per sid stands (the one
     filed on the winning decision's day, canonical tie), the losing device's duplicate
     is dismissed. An adjustment whose rid the log never mentions — the engine-proposal
     decline records born dismissed — is not the derivation's to touch. undone stays the
     athlete's word, untouched. */
  const groups9 = new Map();
  for (const adj of (Array.isArray(s.adjustments) ? s.adjustments : [])) {
    if (!adj || adj.undone) continue;
    const row9 = adj.rid != null ? bySid9.get(adj.rid) : null;
    if (!row9) continue;
    if (row9.decided !== "approved" || row9.undone) { adj.dismissed = true; continue; }   /* SCALE-5 — a duplicate of an undone move is as terminal as one of a dismissed move */
    if (!groups9.has(adj.rid)) groups9.set(adj.rid, []);
    groups9.get(adj.rid).push(adj);
  }
  for (const [sid9, rows9] of groups9) {
    const row9 = bySid9.get(sid9);
    /* SCALE-5 (Sol's pass 3) — the winner is coupled to the DECISION, not just its day:
       two same-day approvals for one sid (200 vs 210) left the losing device's
       "Protein 200" adjustment active under a 210 decision. Title fingerprints the
       decision body the writers share; day narrows first, then title, then canonical. */
    const dMatch9 = rows9.filter((a) => String(a.d) === String(row9.d));
    const tMatch9 = dMatch9.filter((a) => String(a.title || "") === String(row9.title || ""));
    const pool9 = tMatch9.length ? tMatch9 : (dMatch9.length ? dMatch9 : rows9);
    let win9 = pool9[0];
    for (const a of pool9) { if (String(a.d) + "|" + String(a.id || "") < String(win9.d) + "|" + String(win9.id || "")) win9 = a; }
    for (const a of rows9) { if (a === win9) delete a.dismissed; else a.dismissed = true; }
  }
  /* SCALE-4 (row 4, the receipts) — the ANALYST SUGGESTION feed lines are a PROJECTION
     of the decision log, exactly as the read receipts are of reads[]. The pass-2
     witness: a winning dismissal reversed the target and dismissed the adjustment while
     the feed kept "ANALYST SUGGESTION APPLIED — protein target set to 200 g/day" — the
     record contradicted the decision it described. One op-keyed line per decided sid,
     body derived from the winning row; legacy op-less lines (any vintage) are swept. */
  if (Array.isArray(s.feed)) {
    const SUGT9 = { approved: "ANALYST SUGGESTION APPLIED", dismissed: "ANALYST SUGGESTION DISMISSED", noted: "ANALYST SUGGESTION NOTED", undone: "ANALYST SUGGESTION UNDONE" };
    s.feed = s.feed.filter((f) => !(f && ((typeof f.op === "string" && f.op.indexOf("sug:") === 0) || f.t === SUGT9.approved || f.t === SUGT9.dismissed || f.t === SUGT9.noted || f.t === SUGT9.undone)));
    const mk9 = [];
    for (const x of log9) {
      if (!x || !x.sid || !SUGT9[x.decided]) continue;
      const a9 = x.apply || {};
      let how9 = x.title;
      if (x.decided === "approved" && x.undone) {
        mk9.push({ d: x.d, op: "sug:" + x.sid, t: SUGT9.undone, how: x.title + " — approved, then reversed by one tap; the target it set is off" });
        continue;
      }
      if (x.decided === "approved") {
        let arm9 = x.title;
        if (a9.kind === "protein" && a9.to != null) arm9 = "protein target set to " + a9.to + " g/day";
        else if (a9.kind === "sleep" && a9.to != null) arm9 = "sleep target set to " + a9.to + " h";
        else if (a9.kind === "cal") arm9 = "logged only — the engine owns the calorie band, so no analyst suggestion moves it";
        else if (a9.kind === "dietbreak") arm9 = "diet break armed — hold at maintenance this week";
        else if (a9.kind === "progression") arm9 = "training progression noted — coach territory";
        how9 = x.title + " — " + arm9;
      } else if (x.decided === "noted") how9 = x.title + " — an observation, filed; approving it would have changed nothing, so nothing wears an apply button";
      mk9.push({ d: x.d, op: "sug:" + x.sid, t: SUGT9[x.decided], how: how9 });
    }
    mk9.sort((a, b) => { const ka = String(a.d) + "|" + String(a.t) + "|" + _canonJ(a), kb = String(b.d) + "|" + String(b.t) + "|" + _canonJ(b); return ka < kb ? -1 : ka > kb ? 1 : 0; });
    const seenR9 = new Set();
    for (const f of mk9) { const k9 = _canonJ(f); if (seenR9.has(k9)) continue; seenR9.add(k9); s.feed.push(f); }
  }
  /* SCALE-4 (row 4, the undo door) — the adjustment ledger's ORDER is canonical, so
     lastUndoable's tail scan offers the SAME move from either merge direction. The
     pass-2 witness: the keyed union emitted arrival order, so one direction offered the
     older protein card and the other the newer sleep card. Day, then rid, then id —
     deterministic, latest day last. */
  if (Array.isArray(s.adjustments)) {
    /* SCALE-7 (Sol's pass 5, P1 — CONFIRMED with the real f72dbf7 writer: two same-day
       applyProposal taps whose rid spelling opposed call order upgraded into a new
       client whose Undo reversed the FIRST tap while the old device's own Undo got the
       second). The old writer never stamped `at` — but it always recorded its instant
       INSIDE the id (_freshId embeds Date.now in base36, lexically monotone), so the
       causal order Sol requires preserved was on every row all along; the sort just
       compared rid first and threw it away. The day now orders by provenance class:
       "2"+at (stamped tap), else "1"+id (the legacy writer's own embedded instant, per
       device), else "0"+ord (array position recovered at first settle — the 13 id-less
       suggestion-era records). Cross-class and cross-device order is deterministic and
       byte-convergent, and where it is not the athlete's proven order, lastUndoable
       says so (orderSure) instead of claiming "last". `ord` is minted at the BOOT
       exit only (_settleExit) — this function also runs on the merge path, where
       arrival order depends on direction and a mint would break byte convergence. */
    /* SCALE-8 (Sol's pass 6, P1 — CONFIRMED at 2e92fd0, and STRONGER than his witness:
       three current writers file no `at` either, so a 9am suggestion approval and a 5pm
       proposal tap on ONE v7.55.6 device already picked the 9am move as "last". The
       provenance CLASS was ranking above recoverable TIME. Every source is now
       normalized onto ONE comparable instant before ordering: `at` parses to epoch ms;
       a legacy id's embedded _freshId timestamp (base36, chars 4–12, sanity-windowed
       2001–2096) parses to the SAME scale; only a row with neither falls to its
       recovered storage position. Stamped and legacy taps interleave by when they
       actually happened, as recorded by their own writer. */
    /* SCALE-9 (Sol's pass 7, P1 — CONFIRMED at 3ecf189, rig128 A1): SCALE-8 retired the
       at-vs-id class ladder but left an instant-vs-ord one. A day holding BOTH an
       instant-bearing row and a no-instant row compared epoch milliseconds ("1"+ms)
       against a storage position ("0"+ord) — so the ord row always sorted first
       whatever the recovered sequence said, and a row written FIRST was offered as the
       last move. The classes are no longer compared: ONE rank per day, chosen by what
       the whole day can support. Every row in a day whose instants are complete orders
       by instant; if ANY row in that day lacks a derivable instant, the WHOLE day
       orders by its persisted storage rank (ord, minted for every row at the boot exit
       — see _settleExit), which is the one scale every row in that sequence shares.
       Never a ladder between the two. */
    /* SCALE-10 (Sol's pass 8, his third item — CONFIRMED at 5c25ace, rig129 C): the mode
       was decided over EVERY row on the day, so a no-instant row that was added and then
       UNDONE left its day in recovered-sequence mode forever, permanently reversing the
       timed rows that remained. His own refutation clause names the fix: mode selection
       runs over the EXACT ACTIVE CANDIDATE SET — the rows that can still be selected. A
       day whose only fallback row has been undone or dismissed returns to its instants; a
       day with no active rows at all keeps the whole-day reading, so the stored order of
       a fully-retired day stays stable. */
    const act10 = s.adjustments.filter((x) => x && !x.undone && !x.dismissed);
    const byD10 = new Map();
    for (const x of act10) { const d = String((x && x.d) || ""); if (!byD10.has(d)) byD10.set(d, []); byD10.get(d).push(x); }
    const mixed9 = new Set();
    for (const a of s.adjustments) {
      if (!a) continue;
      const d = String((a && a.d) || "");
      const pool = byD10.has(d) ? byD10.get(d) : s.adjustments.filter((x) => x && String((x && x.d) || "") === d);
      if (pool.some((x) => _adjInstant(x) == null)) mixed9.add(d);
    }
    const c7 = (x) => { const d9 = String((x && x.d) || ""); const t7 = _adjInstant(x);
      return (mixed9.has(d9) || t7 == null) ? "0" + String((x && x.ord) || "") : "1" + String(t7).padStart(15, "0"); };
    s.adjustments = s.adjustments.slice().sort((a, b) => {
      const ka = String((a && a.d) || "") + "|" + c7(a) + "|" + String((a && a.rid) || "") + "|" + String((a && a.id) || "");
      const kb = String((b && b.d) || "") + "|" + c7(b) + "|" + String((b && b.rid) || "") + "|" + String((b && b.id) || "");
      return ka < kb ? -1 : ka > kb ? 1 : 0;
    }).map((a) => (a && typeof a === "object" && !Array.isArray(a) ? JSON.parse(_canonJ(a)) : a));   /* SCALE-6 — the instant orders the day (lastUndoable's tail = the LAST TAP, not the last rid alphabetically); canonical bytes for every row */
  }
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10657-10672.
function anchorDexa(state, pct) {
  const s = JSON.parse(JSON.stringify(state));
  const eyeNow = bfEst(s).pct;
  s.dexaRecon = { d: isoOf(todayStart()), eye: eyeNow, dexa: pct, delta: +(pct - eyeNow).toFixed(1) };
  s.model = { lean: +(s.trend * (1 - pct / 100)).toFixed(1), anchorISO: isoOf(todayStart()), drip: s.model.drip, src: "DEXA", err: "±1" };
  /* v7.3.0 Slice 4 — record the DEXA in the learned-anchor history (append-only, synced) so partitionPrior
     narrows the p-ratio range and energyDensity personalises kcal/lb as REAL anchors accumulate over months.
     bfEst already collapses the protein RANGE off the tighter DEXA band; this makes the anchor COUNTABLE. */
  s.learned = (s.learned && typeof s.learned === "object") ? s.learned : { tdee: [], anchors: [] };
  if (!Array.isArray(s.learned.anchors)) s.learned.anchors = [];
  if (!Array.isArray(s.learned.tdee)) s.learned.tdee = [];
  s.learned.anchors.push({ id: _freshId("dexa_"), d: isoOf(todayStart()), src: "DEXA", bf: pct, lean: s.model.lean, trend: s.trend });
  const q = s.queue.find((x) => x.id === "q_dexa"); if (q) { q.done = true; q.state = "ANCHORED"; }
  s.feed.unshift({ d: isoOf(todayStart()), t: "DEXA ANCHORED", how: `${pct}% at trend ${s.trend} → lean ${s.model.lean}. Every estimate and ETA now runs off measured ground truth.` });
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10675-10680.
function patchV4(s) {
  s.waist = s.waist || [];
  (s.exercises || []).forEach((e) => { e.rirHist = e.rirHist || []; });
  s.v = 4;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10681-10691.
function patchV5(s) {
  SEED.exercises.forEach((se, i) => {
    if (!s.exercises.some((e) => e.id === se.id)) s.exercises.splice(Math.min(i, s.exercises.length), 0, JSON.parse(JSON.stringify(se)));
  });
  if (!s.exOrder) s.exOrder = JSON.parse(JSON.stringify(SEED.exOrder));
  /* SPLIT item d — retired lifts leave every ACTIVE projection (the raw record
     is never filtered): the pool below is order-driven, so the order filter is
     the one gate. */
  s.v = 5;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10692-10699.
function patchV6(s) {
  SEED.exercises.forEach((se) => {
    const e = s.exercises.find((x) => x.id === se.id);
    if (e) { e.setup = se.setup; e.n = se.n; }
  });
  s.v = 6;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10700-10704.
function patchV7(s) {
  SEED.exercises.forEach((se) => { const e = s.exercises.find((x) => x.id === se.id); if (e) { e.setup = se.setup; e.n = se.n; } });
  s.v = 7;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10705-10718.
function patchV8(s) {
  const logDates = Object.keys(s.sessionLog || {}).sort().reverse();
  s.exercises.forEach((e) => {
    if (e.lastMeta) return;
    for (const d of logDates) {
      const en = (s.sessionLog[d].entries || []).find((x) => x.id === e.id);
      if (en && en.reps && en.reps.length) { e.lastMeta = { d, w: e.w, reps: en.reps.slice(), rir: en.rir ?? null }; return; }
    }
    const se = SEED.exercises.find((x) => x.id === e.id);
    if (se && se.lastMeta) e.lastMeta = JSON.parse(JSON.stringify(se.lastMeta));
  });
  s.v = 8;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10719-10724.
function patchV9(s) {
  s.photos = s.photos || [];
  s.sync = s.sync || { last: null, status: "" };
  s.v = 9;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10725-10730.
function patchV10(s) {
  if (s.creatine === undefined) s.creatine = null;
  SEED.exercises.forEach((se) => { const e = s.exercises.find((x) => x.id === se.id); if (e && se.mg) e.mg = se.mg; });
  s.v = 10;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10731-10745.
function patchV31(s) {
  /* `rir` has always been the OPENER's value, so lifting it into rirSets[0] is a
     lossless restatement of what was already recorded — not a guess. Every other
     slot stays null: the app did not ask for those sets, so it does not know. */
  const lift = (o) => {
    if (!o || Array.isArray(o.rirSets)) return;
    const len = ((o.reps) || []).length;
    const arr = new Array(len).fill(null);
    if (len && o.rir != null) arr[0] = o.rir;
    o.rirSets = arr;
  };
  Object.values(s.sessionLog || {}).forEach((sl) => (sl.entries || []).forEach(lift));
  (s.exercises || []).forEach((e) => lift(e.lastMeta));
  s.v = 31; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10746-10764.
function patchV32(s) {
  /* He applied the refeed-retirement proposal on a build where applying it did
     nothing but write a feed line — the proposal carried { kind: "note" }, so
     `dayType` never heard about it and Wednesday stayed a refeed day in all 34
     places it is called. The tap was real and his intent was recorded in
     `adjustments`; only the effect was missing. This honours it rather than
     asking him to tap a card he has already dismissed.

     Dated from the adjustment, not from today, so the retirement starts where he
     actually made it and every Wednesday before that stays a refeed on the
     record — which is what the refeed-bump line and the post-refeed water flag
     need in order to keep reading history truthfully. */
  const adj = (s.adjustments || []).find((a) => a.rid === "refeed_review");
  if (adj) {
    s.targets = s.targets || {};
    if (!s.targets.refeedOff) s.targets.refeedOff = adj.d || isoOf(todayStart());
  }
  s.v = 32; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10765-10792.
function patchV33(s) {
  /* The drip goes to zero — see DRIP_NOTE. Not a preference: the app's own
     arithmetic was claiming 4,402 kcal liberated per pound of scale weight
     against 4,282 in pure lipid, which is impossible, and every population-
     matched study puts lean mass flat to falling in a deficit this size.

     Kept as a field rather than deleted, because a DEXA re-anchor may one day
     give it a measured value. Assumed values are what this replaces. */
  if (s.model && s.model.drip !== 0) { s.model.dripWas = s.model.drip; s.model.drip = 0; }
  /* Deltoid heads, separated. Pelland 2025 classifies anterior, lateral and
     posterior deltoid as different muscles with different exercises — pooling
     them made a 17-set bucket that is not comparable to any per-muscle band, and
     that pooling is what produced a set-reallocation recommendation the same
     paper's own detection threshold says is indistinguishable from zero. */
  (s.exercises || []).forEach((e) => {
    if (e.head) return;
    if (e.id === "lateral") e.head = "delts_side";
    else if (e.id === "rearDelt") e.head = "delts_rear";
  });
  /* Retract the reallocation card if it is still open and unacted-on. It was
     built on the pooled bucket and sized below the literature's noise floor;
     leaving it up would be leaving a recommendation I know to be wrong. */
  (s.proposals || []).filter((p) => p.rid && p.rid.indexOf("volstruct_") === 0 && !p.resolved).forEach((p) => {
    p.resolved = true; p.stoodDown = true; p.retracted = true;
    (s.feed || []).unshift({ d: isoOf(todayStart()), t: "SET-REALLOCATION CARD WITHDRAWN", how: "It counted your three deltoid heads as one muscle, which made 17 sets look excessive when split by head it is 5-7 each — the high-return tier. And the move it proposed was worth about 0.5 percentage points of growth against a smallest-detectable-effect of 2.05%. It was a recommendation the evidence cannot distinguish from zero, so it is withdrawn rather than left standing." });
  });
  s.v = 33; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10804-10884.
function patchV34(s) {
  let touched = 0;
  /* ---------- The rule that makes this migration safe ----------
     A DONE queue item's gate field is not a gate any more — it is a RECEIPT.
     q_hack3 on his live state reads "Debuted 7,8,7", the actual result of the
     set, and the queue renders exactly that string on the win card. The first
     version of this function overwrote it unconditionally with future-tense
     text about a set he had already done, which is data loss on a hard
     guardrail. Nothing here touches a finished item, ever. */
  const rewrite = (str) => str
    .replace(/ on a clean day/gi, "")
    .replace(/ on a clean-sleep day/gi, "")
    .replace(/ on debt/gi, "")
    .replace(/\s*·\s*deferred \d+\s*[×x] for sleep/gi, "")
    .replace(/LOCKED\s*—\s*runs unless a true\s*<?\s*[\d.]+\s*h night/gi, "Runs when it wins the day's structural slot")
    .replace(/Gate passed\s*—\s*runs unless a true\s*<?\s*[\d.]+\s*h night/gi, "Gate passed — runs when it wins the day's structural slot")
    .replace(/\s{2,}/g, " ")
    .trim();
  (s.queue || []).forEach((q) => {
    if (q.done) return;                       /* finished items are receipts */
    ["gate", "rule"].forEach((k) => {
      if (typeof q[k] !== "string") return;
      const was = q[k], now = rewrite(was);
      if (now !== was) { q[k] = now; touched++; }
    });
  });
  /* The press OWN gate is the one whose remaining text needs a real sentence
     rather than a deletion — "Repeat 8,8,7 (last: 8,7,6)" with the sleep clause
     stripped reads like the app forgot why it was asking. Only if still open. */
  const pw = (s.queue || []).find((x) => x.id === "q_press_own");
  if (pw && !pw.done && /8,8,7/.test(pw.gate || "")) {
    const want = "Repeat 8,8,7 — the repeat is the confirmation";
    if (pw.gate !== want) { pw.gate = want; touched++; }
  }
  /* ---------- The diet exit reaches his phone ----------
     The seed changed q_pivot to kind:"exit" with the maintenance-first plan.
     Without this his saved copy keeps kind:"phase" and keeps printing the
     authored "Fast reverse (~1-2 wk to ~2,450) → lean surplus 2,700-2,950 ·
     MRV build" — the exact text the DIET_EXIT note says was deleted, rendering
     through a branch that describes a different card entirely. */
  /* The triceps question, closed on his answer. Same lesson as q_pivot: the
     seed is not the state. It was also waiting on a "build phase" that has no
     date and that he has not chosen — a gate on an undecided phase never
     resolves, it just sits there implying an unfinished decision. */
  const pg = (s.queue || []).find((x) => x.id === "q_peg");
  if (pg && !pg.done && /bottom-peg|BOTTOM-PEG/i.test(pg.t + " " + (pg.gate || "") + " " + (pg.rule || ""))) {
    pg.t = "TRICEP SETUP — SETTLED";
    pg.gate = "Your call: the Prime 3-peg stays";
    pg.rule = "Closed — the app stops raising this";
    pg.done = true;
    pg.state = "PARKED";
    touched++;
    (s.feed || []).unshift({ d: isoOf(todayStart()), t: "TRICEP QUESTION CLOSED",
      how: "This sat in your queue waiting for a build phase that has no date and that you have not decided on. It was also a confused question: the research says overhead beats pushdown for the long head at d = 0.54-0.61, because the long head crosses the shoulder — but the Prime's peg changes the RESISTANCE PROFILE, not the shoulder angle, so no peg setting could ever have bought that effect. Different variables. Asked directly, you chose to keep the Prime, and that holds up: it is the lift you will actually do, adherence is the biggest lever in the literature, triceps are one muscle of about ten, and your pressing already loads them indirectly. Closed. The app will not raise it again." });
  }
  const pv = (s.queue || []).find((x) => x.id === "q_pivot");
  if (pv && !pv.done && pv.kind !== "exit") {
    pv.kind = "exit";
    pv.t = "THE DIET EXIT";
    pv.gate = "When you and your coach call it — no date";
    pv.rule = "One step to your MEASURED maintenance, hold, then decide";
    touched++;
    (s.feed || []).unshift({ d: isoOf(todayStart()), t: "THE EXIT PLAN IS NOW YOURS",
      how: "It used to read 'fast reverse to ~2,450, then a lean surplus and an MRV build'. You said straight to maintenance, hold, then decide — so that is what it says now, and the number is your own measured maintenance rather than an authored 2,450, which sits about a hundred calories under it. Stepping up to a maintenance that is not your maintenance is just a smaller cut with a better name. No ramp: reverse dieting as a protocol has no controlled trial behind it. No surplus assumed: the hold exists so that decision has data under it." });
  }
  (s.exercises || []).forEach((e) => {
    if (e.ownNote && /clean day|sleep-clean|on debt/i.test(e.ownNote)) {
      const was = e.ownNote;
      e.ownNote = rewrite(was);
      if (e.ownNote !== was) touched++;
    }
  });
  /* The rirOverride flag has nothing left to override. Kept on the record
     rather than deleted — it is a decision he made, and this app does not
     rewrite history. It is simply no longer read by anything. */
  if (touched) {
    (s.feed || []).unshift({ d: isoOf(todayStart()), t: "THE CLEAN-SLEEP GATE IS GONE",
      how: "It was retired in the engine earlier but survived in three places that decided what you lift: the prescription desk held every lift on a short night, the set plan pulled your last set off failure, and the queue still told you sleep decided before your muscles did. None of that had evidence behind it — a short night costs about 2.85% on strength, which is smaller than your own set-to-set spread. Sleep still matters enormously, just for a different thing: at a matched deficit it decides how much of what you lose comes off muscle instead of fat. It is now on your sleep card as that, and nothing anywhere gates a rep on it." });
  }
  s.v = 34; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10885-10888.
function patchV30(s) {
  s.medsLog = s.medsLog || [];
  s.v = 30; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10889-10892.
function patchV29(s) {
  s.energy = s.energy || []; s.soreness = s.soreness || []; s.grip = s.grip || [];
  s.v = 29; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10893-10896.
function patchV28(s) {
  s.caffLog = s.caffLog || [];
  s.v = 28; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10897-10902.
function patchV27(s) {
  const had = (s.agentProposals || []).some((ap) => ap.kind === "volume");
  s.agentProposals = (s.agentProposals || []).filter((ap) => ap.kind !== "volume");
  if (had && !(s.feed || []).some((f) => f && f.t === "VOLUME PROPOSALS RECALLED")) { s.feed = s.feed || []; s.feed.unshift({ d: isoOf(todayStart()), t: "VOLUME PROPOSALS RECALLED", how: "cold-start misfire — the ledger compared your first logged week against a week before this app existed. It now waits for 14 full days of your logs and speaks on Sundays, two proposals at most." }); }
  s.v = 27; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10903-10913.
function patchV26(s) {
  (s.exercises || []).forEach((ex) => {
    if (ex.id === "hack") return;
    if (typeof ex.inc === "number" && ex.inc > 5) ex.inc = 5;
  });
  s.feed = s.feed || [];
  if (!s.feed.some((f) => f.t && f.t.indexOf("RULING — SMALLEST STEP, EVERY LIFT") === 0)) {
    s.feed.unshift({ d: isoOf(todayStart()), t: "RULING — SMALLEST STEP, EVERY LIFT", how: "every increment audited: stack machines take 5s (pulldown and ham curl were jumping 10); the hack stays 10 as plate-loaded; jump size is now editable on any card via the pencil" });
  }
  s.v = 26; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10914-10927.
function patchV25(s) {
  const cv = (s.exercises || []).find((x) => x.id === "calves");
  if (cv) cv.inc = 5;
  (s.queue || []).forEach((q) => {
    if (q.exId === "calves" && q.kind === "debut" && !q.done && typeof q.newW === "number" && q.newW > 320) {
      q.newW = 320; q.t = "CALVES 320 DEBUT"; q.gate = (q.gate || "") + " · rewritten to the machine's smallest step";
    }
  });
  s.feed = s.feed || [];
  if (!s.feed.some((f) => f.t && f.t.indexOf("RULING — SMALLEST HONEST INCREMENT") === 0)) {
    s.feed.unshift({ d: isoOf(todayStart()), t: "RULING — SMALLEST HONEST INCREMENT", how: "weight jumps take the machine's smallest step (calves 315 → 320, not 330) and debut targets expect to keep almost every rep — small steps, fast rebuilds, more honest sets near the top" });
  }
  s.v = 25; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10928-10948.
function patchV24(s) {
  const hk = (s.exercises || []).find((x) => x.id === "hack");
  /* IDEMPOTENCY (maxed-ladder fix round) — this null was correct ONCE and destructive on
     every replay (migrate reruns the whole reduce each bump; it erased the banked delivery
     for weeks). The audited w-inequality guard does NOT mark that first firing — at
     v24-time hack's w was the STRING "hold" on both sides (the +20 lived in the plates,
     not the field; the v3.63 fixtures prove it) — so the patch keys on ITS OWN EFFECT:
     hi !== 12 means the ruling has not applied yet; hi === 12 means this is a replay and
     the mutation is a no-op. Idempotent by construction. */
  /* RETIRED 2026-08-10 (the round the standing rule was written for): the effect key
     hi !== 12 re-asserted the v24 ruling on every chain replay, which would overwrite
     the owner's 6-10 ruling (patchV43) forever. The mutation now also stops at the NEW
     ruling's value, so a replayed chain lands where the newest ruling left it — and
     patchV43 runs after this in every chain anyway, keying on the 12 this writes. */
  if (hk && hk.hi !== 12 && hk.hi !== 10) { hk.hi = 12; hk.last = null; }
  s.feed = s.feed || [];
  if (!s.feed.some((f) => f.t && f.t.indexOf("RULING — HACK LOADED UP") === 0)) {
    s.feed.unshift({ d: isoOf(todayStart()), t: "RULING — HACK LOADED UP +20", how: "when breathing fails before the quads, the weight rises and the reps drop — athlete call on the gym floor; rep ceiling now 12, fresh targets seeded at the new load" });
  }
  s.v = 24; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10949-10949.
function patchV23(s) { s.dayCtx = s.dayCtx || {}; s.v = 23; return s; }

// Copied from frozen src/app.jsx @ fe516c1:10950-10950.
function patchV22(s) { s.agentProposals = s.agentProposals || []; s.v = 22; return s; }

// Copied from frozen src/app.jsx @ fe516c1:10951-10951.
function patchV21(s) { s.temp = s.temp || []; s.v = 21; return s; }

// Copied from frozen src/app.jsx @ fe516c1:10952-10952.
function patchV20(s) { s.trials = s.trials || []; s.v = 20; return s; }

// Copied from frozen src/app.jsx @ fe516c1:10953-10953.
function patchV19(s) { s.pulse = s.pulse || []; s.v = 19; return s; }

// Copied from frozen src/app.jsx @ fe516c1:10954-10964.
function patchV18(s) {
  const rd = s.exercises.find((x) => x.id === "rearDelt");
  if (rd && rd.sets < 3) {
    rd.sets = 3;
    rd.n = "Rear-delt fly (cable · uni)";
    rd.note = "honest 10s — no hot opener · 3 sets per side, log the weaker side";
    s.feed.unshift({ d: isoOf(todayStart()), t: "REAR-DELT → 3×/SIDE (UNI)", how: "user-called mid-session 7/23 · log one number per round = the weaker side · third structural move today — the whole batch flags for the coach Monday" });
  }
  s.v = 18;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10965-10969.
function patchV17(s) {
  if (s.rirOverride === undefined) s.rirOverride = "2026-07-23";
  s.v = 17;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10970-10978.
function patchV16(s) {
  const lat = s.exercises.find((x) => x.id === "lateral");
  if (lat && lat.sets < 4) {
    lat.sets = 4;
    s.feed.unshift({ d: isoOf(todayStart()), t: "LATERAL 4TH SET — USER-CALLED", how: "added mid-session 7/23 · reference: last set ran 13 · rides beside today's rows debut — two structural moves in one day, flagged for the coach Monday" });
  }
  s.v = 16;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10979-10983.
function patchV15(s) {
  (s.queue || []).forEach((q) => { if (q.rule && q.rule.indexOf("LOCKED — runs unless") === 0) q.rule = q.rule.replace("LOCKED — runs unless", "Gate passed — runs unless"); });
  s.v = 15;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10984-10984.
function patchV14(s) { s.sleep.anchor = s.sleep.anchor || { wake: "06:45", inBed: 8.25 }; if (!s.sleep.anchor.asleepTarget) s.sleep.anchor.asleepTarget = 8; s.v = 14; return s; }

// Copied from frozen src/app.jsx @ fe516c1:10985-10985.
function patchV13(s) { s.forecasts = s.forecasts || []; s.v = 13; return s; }

// Copied from frozen src/app.jsx @ fe516c1:10986-10986.
function patchV12(s) { s.labSeen = s.labSeen || {}; s.v = 12; return s; }

// Copied from frozen src/app.jsx @ fe516c1:10987-10993.
function patchV11(s) {
  s.sleep.anchor = s.sleep.anchor || { wake: "06:45", inBed: 8.25 };
  if (s.sleep.caffMg === undefined) s.sleep.caffMg = null;
  s.sleep.melaExp = s.sleep.melaExp || { started: "2026-07-23", arm: "none", baseline: "5 mg most nights · ~6 h wakes" };
  s.v = 11;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10997-11008.
function patchV35(s) {
  /* v2 adherence PLAN — self-authored process goals and if-then implementation
     intentions, plus the opt-in one-human share. Additive only, and safe to run on
     a state that already has it (the v1/v2 path replays the whole chain over a fresh
     seed). No existing field is read or rewritten, so no history can move. */
  s.plan = s.plan || { goals: [], ifthen: [], share: false };
  if (!Array.isArray(s.plan.goals)) s.plan.goals = [];
  if (!Array.isArray(s.plan.ifthen)) s.plan.ifthen = [];
  if (typeof s.plan.share !== "boolean") s.plan.share = false;
  s.v = 35;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11014-11018.
function _hashId(prefix, str) {
  let h = 5381; const s = String(str == null ? "" : str);
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return prefix + (h >>> 0).toString(36);
}

// Copied from frozen src/app.jsx @ fe516c1:11019-11036.
function patchV36(s) {
  /* v7.2.0 Slice 3 — the graduated-autonomy dial lands in s.plan (the FIRST synced-state touch),
     so this is where s.plan gains its default policy field and its entries gain stable keys for the
     new keyed-union merge. ADDITIVE + idempotent: default the autonomy scalar to the most-supervised
     level, and backfill a CONTENT-derived id on any legacy goal / if-then entry that predates ids (so
     the union has a globally-stable key on every entry — never an index that collides across devices).
     No existing field is read for meaning or rewritten — no history can move, and replaying the whole
     chain over a fresh seed is a no-op (SEED already carries autonomy:"propose"). */
  s.plan = s.plan || { goals: [], ifthen: [], share: false, autonomy: "propose" };
  if (!Array.isArray(s.plan.goals)) s.plan.goals = [];
  if (!Array.isArray(s.plan.ifthen)) s.plan.ifthen = [];
  if (typeof s.plan.share !== "boolean") s.plan.share = false;
  if (AUTONOMY_LEVELS.indexOf(s.plan.autonomy) < 0) s.plan.autonomy = "propose";   // default: most supervised (never auto-promote)
  s.plan.goals.forEach((g) => { if (g && g.id == null) g.id = _hashId("g_v36_", g.text); });
  s.plan.ifthen.forEach((p) => { if (p && p.id == null) p.id = _hashId("p_v36_", (p.cue || "") + "|" + (p.action || "") + "|" + (p.text || "")); });
  s.v = 36;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11037-11049.
function patchV37(s) {
  /* v7.3.0 Slice 4 — the n-of-1 LEARNING store lands as a synced, engine-owned collection (the first
     real schema patch of this arc; Slice 3 already consumed patchV36/SCHEMA 36, so this is patchV37/37).
     ADDITIVE + idempotent: seed the learned sub-collections empty (never rewrite history), so a fresh SEED
     === a migrated state and replaying the whole chain over a fresh seed is a no-op. No existing field is
     read for meaning or rewritten — no history can move. Registered in MERGE_* (_unionLearned) so a stale
     device can't clobber the learned series; rollback-safety (v>SCHEMA_V untouched) preserved by migrate. */
  s.learned = (s.learned && typeof s.learned === "object") ? s.learned : {};
  if (!Array.isArray(s.learned.tdee)) s.learned.tdee = [];
  if (!Array.isArray(s.learned.anchors)) s.learned.anchors = [];
  s.v = 37;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11052-11052.
function patchV39(s) { s.skinfolds = s.skinfolds || []; s.v = 39; return s; }

// Copied from frozen src/app.jsx @ fe516c1:11053-11071.
function patchV40(s) {
  /* R19c — the athlete's split, stated 2026-08-09 (his message is the consent on the
     record): Sun UPPER · Mon LOWER · Tue/Wed REST · Thu UPPER · Fri LOWER · Sat REST.
     Dated from the day he said it; every earlier day keeps the legacy reading. */
  s.split = s.split || [{ from: "2026-08-09", map: { 0: "U", 1: "L", 2: "REST", 3: "REST", 4: "U", 5: "L", 6: "REST" }, why: "athlete-stated 2026-08-09 — Sun U · Mon L · Thu U · Fri L (consent relayed on the record, R19)" }];
  /* R19d — DATE HONESTY, one-time restatement with the athlete's confirmation: his
     Sunday 8/09 session was filed under 8/10 because the old hardcode called Sunday
     REST and dateSel borrowed the next training day. The workout ran Sunday. Move the
     entry to the day it happened — nothing deleted, the row changes address. Keyed on
     content (8/10 present, 8/09 absent) so replay is a no-op and a device that never
     had the mislabel is untouched. */
  if (s.sessionLog && s.sessionLog["2026-08-10"] && !s.sessionLog["2026-08-09"]) {
    s.sessionLog["2026-08-09"] = s.sessionLog["2026-08-10"];
    delete s.sessionLog["2026-08-10"];
    for (const ex9 of s.exercises || []) { if (ex9 && ex9.lastMeta && ex9.lastMeta.d === "2026-08-10") ex9.lastMeta.d = "2026-08-09"; }
    if (s.feed && s.feed.unshift) s.feed.unshift({ d: "2026-08-09", t: "RECORD RESTATED — Sunday's session moved 8/10 → 8/09", how: "the workout ran Sunday 2026-08-09; the old fixed split called Sunday REST and borrowed Monday's date. Nothing deleted — the entry moved to the day it happened, with Joe's confirmation on the record." });
  }
  s.v = 40; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11072-11099.
function patchV41(s) {
  /* v7.38.1 H4 — RECORD CORRECTION, content-keyed, athlete-attested. Joe, tonight, on
     the record: "I didn't do the 3rd set of arms"; "I don't remember my lifts almost
     at all, but the first ones look correct" — strike what nothing attests. Unattested
     tail slots (banked by the pre-per-set belt) leave three 8/09 entries; the terminal
     RIR answer reassigns to the true last set. Keyed on the EXACT current content: if
     any entry no longer matches, that edit no-ops (replay-safe, restore-safe). If Joe
     later attests tricep's third set was real, it restores by this same mechanism. */
  const rec = s.sessionLog && s.sessionLog["2026-08-09"];
  if (rec && rec.entries) {
    const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    let moved = false;
    for (const e of rec.entries) {
      if (e.id === "tricep" && eq(e.reps, [12, 12, 11, 10]) && eq(e.rirSets, [null, null, null, null])) { e.reps = [12, 12]; e.rirSets = [null, null]; moved = true; }
      if (e.id === "curl" && eq(e.reps, [11, 10, 10, 9]) && eq(e.rirSets, [2, null, null, null])) { e.reps = [11, 10, 10]; e.rirSets = [2, null, null]; moved = true; }
      if (e.id === "rows" && eq(e.reps, [9, 9, 8]) && eq(e.rirSets, [1, null, 0])) { e.reps = [9, 9]; e.rirSets = [1, 0]; moved = true; }
    }
    if (moved) {
      /* recompute the caches through the existing reconcile machinery — never hand-edit */
      for (const id9 of ["tricep", "curl", "rows"]) {
        const exL = (s.exercises || []).find((z) => z.id === id9);
        if (exL) { const dm = deriveLastMeta(s, id9); if (dm) { exL.lastMeta = dm; exL.last = dm.reps.slice(); } }
      }
      if (s.feed && s.feed.unshift) s.feed.unshift({ d: "2026-08-09", t: "RECORD CORRECTED — unattested sets struck from Sunday's re-log", how: "Joe, on the record: 'I didn't do the 3rd set of arms' · 'the first ones look correct'. Tail slots nothing attested left tricep, curl and rows; the terminal RIR moved to the true last set. If a struck set was real, saying so restores it by the same mechanism." });
    }
  }
  s.v = 41; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11100-11124.
function patchV42(s) {
  /* CONSENT HYGIENE (2026-08-10). Joe: "I accepted two today that I didn't really
     understand... We need to audit and fix." The approved hand-back card ("Hand back
     this morning's five set additions — keep Friday's three") was kind:note — Approve
     enacted NOTHING. This is the enactment, content-keyed on the exact counts the desk
     left behind; if a count has already moved, that lift no-ops. Friday's owner's-call
     three (hams/chest/rearDelt) STAND. Consent: the approved card + Joe's audit ruling,
     both on the record. */
  const back9 = [["rows", 3, 2], ["hack", 4, 3], ["tricep", 4, 3], ["curl", 4, 3], ["abs", 4, 3]];
  const moved9 = [];
  for (const [id9, from9, to9] of back9) {
    const e9 = (s.exercises || []).find((x) => x.id === id9);
    if (e9 && e9.sets === from9) { e9.sets = to9; e9.setsAt = "2026-08-10T12:00:00.000Z"; moved9.push(id9 + " " + from9 + "\u2192" + to9); }
  }
  if (moved9.length && s.feed && s.feed.unshift) s.feed.unshift({ d: "2026-08-10", t: "THE HAND-BACK, ENACTED — " + moved9.join(" · "), how: "The card you approved on 8/09 said this and did nothing (its apply was a note). Done now, exactly as it read: the morning five go back, Friday's three stand. On the record: that approval, and your audit ruling — 'we need to audit and fix.'" });
  /* the desk's standing offers are recalled at source: the two delts cards and every
     other pending +1 (the desk is hard-gated until R18f, so a standing offer is noise),
     plus the coach card that proposed against the engine-owned calorie band. */
  const drop9 = (s.agentProposals || []).filter((p) => p && (p.kind === "volume" || p.kind === "coach"));
  if (drop9.length) {
    s.agentProposals = (s.agentProposals || []).filter((p) => !(p && (p.kind === "volume" || p.kind === "coach")));
    if (s.feed && s.feed.unshift) s.feed.unshift({ d: "2026-08-10", t: "DESK OFFERS RECALLED — " + drop9.length + " card" + (drop9.length === 1 ? "" : "s"), how: "The volume desk is quiet until its routing is rebuilt (one chooser, house gates); its standing offers left with it. The coach card proposing a calorie band is recalled too — the engine owns that number and derives it from your own maintenance." });
  }
  s.v = 42; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11125-11143.
function patchV43(s) {
  /* OWNER'S RULING, 2026-08-10: hack squats move to a 6-10 rep range — round two of
     the on-record HACK LOADED UP pattern (breathing fails before the quads; the weight
     rises, the reps drop; his call, and it worked). hi 12 → 10, content-keyed on the
     12 the old ruling holds. hack.last is DELIBERATELY untouched: 12,11,13 at 160
     stands, reads as over the new top, and the banked sighting + two-for-two carry
     forward toward whatever rung the ladder holds when the top comes. windowFor derives the floor: the
     160→170 ladder at ceiling 10 yields exactly 6-10. */
  const hk = (s.exercises || []).find((x) => x.id === "hack");
  if (hk && hk.hi === 12) {
    hk.hi = 10;
    /* THE RECEIPT MAY NOT PREDICT (the R18e overclaim law, applied to patch receipts):
       the patch runs on whatever state the phone holds at patch time — Joe jumped to
       180 past both rungs the same day this was written. Every clause derives. */
    const nx43 = nextLoad(hk);
    if (s.feed && s.feed.unshift) s.feed.unshift({ d: "2026-08-10", t: "HACK — REP RANGE MOVES TO 6-10", how: "Your ruling, on the record: breathing fails before the quads, so the weight rises and the reps drop — round two of the pattern that already worked." + (hk.last && hk.last.length ? " Your " + hk.last.join(",") + " at " + hk.w + " stands untouched and reads against the new window." : "") + (nx43 != null ? " The next rung on file is " + nx43 + "." : " No next rung is on file above " + hk.w + " — file the ladder and the next earn has a price.") });
  }
  s.v = 43; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11144-11171.
function patchV44(s) {
  /* THE WRONG RECORD (Joe's attestation, verbatim, 2026-08-10: 'I just hit hack 180
     for 9 (2 RIR), 9, 10 (0 RIR)'). The phone logged the PRE-FILLED PLAN — 160 ×
     12,12,13 — because the weight editor walked the filed ladder only and 180 was
     unrepresentable; his honest RIR answers then attested phantom reps, and the earn
     machinery banked 'hack squat 170 earned' off them. Content-keyed on the exact
     synced record; replay-safe; nothing deleted — the record changes to what happened. */
  const rec = s.sessionLog && s.sessionLog["2026-08-10"];
  const en = rec && rec.entries ? rec.entries.find((e) => e && e.id === "hack") : null;
  if (en && en.w === 160 && JSON.stringify(en.reps) === "[12,12,13]" && JSON.stringify(en.rirSets) === "[2,null,0]") {
    en.w = 180; en.reps = [9, 9, 10];   /* the rir answers stand — they were his, and they were about THESE sets */
    _stampCorr(rec);
    const ex = (s.exercises || []).find((x) => x.id === "hack");
    if (ex) {
      ex.w = 180;
      const dm = deriveLastMeta(s, "hack");
      if (dm) { ex.lastMeta = dm; ex.last = dm.reps.slice(); }
      ex.topAt = null; ex.topRun = 0;   /* the phantom sighting cannot survive its reps; the honest 9,9,10 opener is under the 10,9,8 line, so nothing re-banks */
    }
    const q = (s.queue || []).find((x) => x && x.id === "q_hack_170" && !x.done);
    if (q) { q.done = true; q.state = "RETRACTED"; q.gate = "Earned on reps since corrected — retracted, on the record."; }
    if (s.feed && s.feed.unshift) {
      s.feed.unshift({ d: "2026-08-10", t: "HACK 170 EARN RETRACTED", how: "The earn was banked on the pre-filled plan (160 × 12,12,13), not the day. Corrected below; retracted, on the record." });
      s.feed.unshift({ d: "2026-08-10", t: "RECORD CORRECTED — HACK 180 × 9,9,10", how: "Your attestation, verbatim: 'I just hit hack 180 for 9 (2 RIR), 9, 10 (0 RIR).' The phone had logged the plan (160 × 12,12,13) because the weight editor walked the filed ladder only — 180 had no way in. The record now says what you did; every read derives from it, and the best-ever claim restates with it." });
    }
  }
  s.v = 44; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11172-11189.
function patchV45(s) {
  /* OWNER'S RULING (Joe, verbatim, 2026-08-10): 'Calves 11, rows 9, press stays.'
     Felt-fatigue calls the evidence prices at zero (range-equivalence near failure;
     Carlson 2022 for the deficit case). PRESS IS EXPLICITLY UNTOUCHED — the ruling,
     not an omission. last untouched on both; receipts DERIVE (the binding law); no
     sighting is seeded — neither lift was at top under the OLD ceiling, so the next
     session topping the new line banks sighting one honestly. */
  const rule45 = (id, fromHi, toHi) => {
    const ex = (s.exercises || []).find((x) => x.id === id);
    if (!ex || ex.hi !== fromHi) return;
    ex.hi = toHi;
    const nx = nextLoad(ex);
    if (s.feed && s.feed.unshift) s.feed.unshift({ d: "2026-08-10", t: ex.n.toUpperCase() + " — REP CEILING MOVES TO " + toHi, how: "Your ruling, on the record: the felt-fatigue call the evidence prices at zero — range-equivalence near failure holds in a deficit." + (ex.last && ex.last.length ? " Your " + ex.last.join(",") + " at " + ex.w + " stands untouched and reads against the new line." : "") + (nx != null ? " The next load on file is " + nx + "." : " No next load is on file above " + ex.w + " — file the ladder and the next earn has a price.") });
  };
  rule45("calves", 13, 11);
  rule45("rows", 10, 9);
  s.v = 45; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11201-11218.
const KNOWN_CORR = [
  /* the ✕ corrections the feed names, whose records carry a corr stamp */
  { d: "2026-07-23", kind: "skip", id: "pronated", why: "RECORD AMENDED — Pronated EZ curl marked skipped on Thu 7/23" },
  { d: "2026-07-31", kind: "skip", id: "ham", why: "RECORD AMENDED — Ham curl marked skipped on Fri 7/31" },
  /* the two ↩ corrections on 8/14 — real acts, and they had no op either */
  { d: "2026-08-14", kind: "unskip", id: "abs", why: "RECORD AMENDED — Prime abdominal crunch UN-SKIPPED on Fri 8/14" },
  { d: "2026-08-14", kind: "unskip", id: "hanging", why: "RECORD AMENDED — Supported leg raise UN-SKIPPED on Fri 8/14" },
  /* 8/04 — THE RULING, stated because it is a judgement call. This record
     PREDATES the corr stamp, so its receipts are the only witness. They are
     still witnesses: each names the lift and the act explicitly, which is the
     same standard 7/23 and 7/31 are held to — the difference is only that the
     instant was never recorded, so the honest floor is the day the app itself
     filed. Without ops these two corrections resurrect exactly like the others,
     which is the harm this fix exists to stop, so they are filed. The stamp is
     used only to order acts within this record. */
  { d: "2026-08-04", kind: "skip", id: "extension", at: "2026-08-04T23:59:59.999Z", why: "RECORD AMENDED — Leg extension marked skipped on Tue 8/4 (record predates corr; day-resolution stamp)" },
  { d: "2026-08-04", kind: "unskip", id: "ham", at: "2026-08-04T23:59:59.999Z", why: "RECORD AMENDED — Ham curl UN-SKIPPED on Tue 8/4 (same)" },
];

// Copied from frozen src/app.jsx @ fe516c1:11219-11238.
function _fileKnownCorr(s) {
  const log9 = (s && s.sessionLog) || {};
  for (const k9 of KNOWN_CORR) {
    const rec9 = log9[k9.d];
    if (!rec9 || !Array.isArray(rec9.entries)) continue;
    const inE9 = rec9.entries.some((e9) => e9 && e9.id === k9.id);
    const inS9 = (rec9.skipped || []).some((z9) => z9 && z9.id === k9.id);
    /* VALUE-KEYED: the op is filed only while the record still shows the shape
       that correction produced. A skip that has since been undone, or an
       un-skip since re-skipped, takes nothing — the record no longer proves it. */
    if (k9.kind === "skip" && !(inS9 && !inE9)) continue;
    if (k9.kind === "unskip" && !(inE9 && !inS9)) continue;
    const at9 = k9.at || ((rec9.corr && typeof rec9.corr.at === "string" && isFinite(Date.parse(rec9.corr.at))) ? rec9.corr.at : null);
    if (!at9) continue;
    if ((rec9.corrLog || []).some((c9) => c9 && c9.kind === k9.kind && c9.id === k9.id)) continue;   /* one act, one entry */
    const to9 = k9.kind === "unskip" ? JSON.parse(JSON.stringify(rec9.entries.find((e9) => e9 && e9.id === k9.id))) : undefined;
    _fileCorr(rec9, k9.kind + ":" + k9.d + ":" + k9.id + ":" + at9, k9.kind, k9.id, at9, to9);
  }
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11258-11258.
const SCALE1_RECLASS = [{ d: "2026-08-08", w: 163.1 }, { d: "2026-08-10", w: 164 }, { d: "2026-08-18", w: 163.2 }];

// Copied from frozen src/app.jsx @ fe516c1:11259-11309.
function patchV59(s) {
  try {
    const reads = Array.isArray(s.reads) ? s.reads : [];
    const hit = (k) => reads.find((r) => r && r.d === k.d && r.w === k.w && r.offWindow === true && typeof r.pt === "number");
    const hits = SCALE1_RECLASS.filter((k) => hit(k));
    if (hits.length) {
      const before9 = s.trend;
      for (const k of hits) { const r = hit(k); delete r.offWindow; r.note = String(r.note || "").split(" · ").filter((x) => x && !/set aside/.test(x)).join(" · "); }
      s.reclassLog = [...new Set([...(Array.isArray(s.reclassLog) ? s.reclassLog : []), ...hits.map((k) => k.d)])].sort();
      for (const k of hits) {   /* SCALE-6 — one op-keyed FACT line per attested date: permanent history the feedop clause guards and every old client's feed union preserves, so the attestation re-derives even through a braid that lost the store and the (d,w) body */
        if (!(s.feed || []).some((f) => f && f.op === "reclass:" + k.d))
          s.feed.unshift({ d: "2026-08-19", op: "reclass:" + k.d, t: "MORNING READ ATTESTED — " + (+k.d.slice(5, 7)) + "/" + (+k.d.slice(8, 10)), how: "The owner attested on 2026-08-19 that this weigh-in was a morning read. This line is the record of that word — it travels with the data, so no older copy of the app can unsay it." });
      }   /* SCALE-5 (Sol's pass 3, new row 2) — the attestation lives in a MONOTONE store, not a flag on a read body an old client's union can strip: reclassLog merges by set-union and the settle re-enforces it (SCALE-4's r.reclassed marker was losable and could reverse the owner's word) */
      /* the replay: date order, from the earliest re-classed read, its stored pt the start */
      const from = hits.map((k) => k.d).sort()[0];
      const ordered = reads.filter((r) => r && r.d >= from && typeof r.w === "number").slice().sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0));
      const step9 = (t9, w9) => +(t9 + 0.3 * Math.max(-1.5, Math.min(1.5, w9 - t9))).toFixed(1);
      const run = () => { let t9 = ordered[0].pt; const after = {}; for (const r of ordered) { const clean = !r.sealed && !r.offWindow; r.pt = t9; if (clean) { t9 = step9(t9, r.w); after[r.d] = t9; } } return { t: t9, after }; };
      const now9 = run();
      /* DERIVE-FIRST: the trend IS the replay of the reads (its only writers are
         applyRead's step and undoRead's restore), so the replayed value is the trend —
         on his ledger the stored chain replays to exactly the stored 164.1 before the
         re-class, and a replica whose scalar had gone stale behind its own reads (the
         scalar merges local-wins) is healed to its reads rather than carried. */
      s.trend = now9.t;
      /* weekly snapshots: the trend after the week's first clean read, re-derived for every
         week on or after the first re-classed read that has such a read */
      const mondayOf = (iso) => { const d = mk(iso); const off = (d.getDay() + 6) % 7; return isoOf(new Date(d - off * DAY)); };
      const fromMon = mondayOf(from);
      const allSorted = reads.filter((r) => r && typeof r.d === "string").slice().sort((a, b) => (a.d < b.d ? -1 : a.d > b.d ? 1 : 0));
      const weeklyMoved = [];
      for (const w of (Array.isArray(s.weekly) ? s.weekly : [])) {
        if (!w || typeof w.wk !== "string" || w.wk < fromMon) continue;
        /* the week's FIRST clean read, over every read — a week whose first clean read
           precedes the replay keeps its snapshot (nothing upstream of it moved) */
        const first = allSorted.find((r) => !r.sealed && !r.offWindow && r.d >= w.wk && weeksBetween(w.wk, r.d) < 1);
        if (first && first.d >= from && now9.after[first.d] != null && w.trend !== now9.after[first.d]) { weeklyMoved.push(w.wk + " " + w.trend + "→" + now9.after[first.d]); w.trend = now9.after[first.d]; }
      }
      /* the false receipts */
      const dates = new Set(hits.map((k) => k.d));
      const missedOn = new Set(hits.filter((k) => k.d !== "2026-08-18").map((k) => k.d));   /* 8/8 and 8/10 filed a MORNING READ MISSED before the read; 8/18 did not */
      const n0 = (s.feed || []).length;
      s.feed = (s.feed || []).filter((f) => !(f && dates.has(f.d) && (f.t === "EVENING READ — SET ASIDE" || f.t === "LATE READ — SET ASIDE" || (typeof f.op === "string" && f.op.indexOf("lateread:") === 0 && dates.has(f.op.slice(9))))) && !(f && missedOn.has(f.d) && typeof f.t === "string" && f.t.indexOf("MORNING READ MISSED") === 0));
      const removed = n0 - s.feed.length;
      const dd = (iso) => +iso.slice(5, 7) + "/" + +iso.slice(8, 10);
      if (!(s.feed || []).some((f) => f && f.op === "patch59:scale"))
        s.feed.unshift({ d: "2026-08-19", op: "patch59:scale", t: (hits.length === 1 ? "A MORNING READ" : hits.length + " MORNING READS") + " RE-CLASSED — " + hits.map((k) => dd(k.d)).join(", "), how: "The window rule read ‘today's numbers are typed’ as ‘breakfast happened’ and set " + (hits.length === 1 ? "a" : "these") + " morning weigh-in" + (hits.length === 1 ? "" : "s") + " aside as evening reads; the owner attested on 2026-08-19 that " + (hits.length === 1 ? "it was" : "all were") + " morning reads. " + (hits.length === 1 ? "It counts" : "They count") + " now: the trend replays " + before9 + " → " + s.trend + (weeklyMoved.length ? ", " + weeklyMoved.length + " weekly snapshot" + (weeklyMoved.length > 1 ? "s move" : " moves") + " with it (" + weeklyMoved.join(", ") + ")" : "") + "; " + removed + " false receipt" + (removed === 1 ? "" : "s") + " from " + (hits.length === 1 ? "that morning" : "those mornings") + " removed. Forecasts and the TDEE log keep what the app said on the day." });
    }
  } catch (e) {}
  s.v = 59; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11322-11403.
function patchV60(s) {
  try {
    /* the stored seams, whatever wrote them (the derivation re-creates the warranted set) */
    let hits9 = 0;
    for (const e of (s.exercises || [])) {
      if (!e || !Array.isArray(e.forks)) continue;
      /* A3 (Sol) — DELETE BY IDENTITY, NOT BY DATE. A date plus a split marker is not
         provenance: a fork that merely happens to sit on 2026-08-17 and carry split would be
         swept with the eleven. No writer can produce that shape today (kind did not exist at
         v59, and split is written only by the insertion writers — both real states hold 11 of
         11 insertion seams on that date), so this is doctrine rather than a live defect. The
         patch now requires the insertion IDENTITY the seams actually carry. */
      const isSeam9 = (f) => !!(f && f.split && String(f.from) === "2026-08-17"
        && [...(f.ops || (f.why ? [f.why] : []))].some((o) => / inserted upstream$/.test(String(o))));
      const keep9 = e.forks.filter((f) => !isSeam9(f));
      if (keep9.length !== e.forks.length) { hits9 += e.forks.length - keep9.length; e.forks = keep9; }
    }
    const n0 = (s.feed || []).length;
    if (Array.isArray(s.feed)) s.feed = s.feed.filter((f) => !(f && typeof f.op === "string" && f.op.indexOf("seam:") === 0 && String(f.d) === "2026-08-17"));
    const gone9 = n0 - ((s.feed || []).length);
    /* the plan marker means "the plan changed on", nothing else — the 08-17 marker IS the
       clock defect. SEED's own dates are the plan's dates. */
    /* CORRECT an existing marker; never MINT one. The 08-17 marker is the clock defect and
       this patch lowers it to the plan's own date — but a state that carries no marker at all
       is a state where the insertion has not been recorded, and R9b's law stands: an INVALID
       birth fires no seams and no insertion marker. Minting here would have handed a
       quarantined fly the very registry entry the quarantine exists to withhold. */
    const ins9 = { ...(s.insertions || {}) };
    for (const k9 of ["fly", "hipthrust"]) {
      const seed9 = ((SEED || {}).insertions || {})[k9];
      if (seed9 && ins9[k9] != null && String(ins9[k9]) > String(seed9)) ins9[k9] = seed9;
    }
    s.insertions = ins9;
    /* C5 — curl's string load becomes a number with a per-set vector, value-keyed. */
    /* C5 — curl becomes numeric with its per-set vector beside it. TWO shapes reach this
       patch and both are his: the frozen 08-15 preimage still carries the STRING config
       ("55·55·50"), while his live ledger has already adopted a numeric 55 through the CAGE
       (reality outranks the filed ladder) and kept the ladder marker. The vector is never
       invented — it is RESTATED from what was recorded: his 2026-08-16 entry carries
       wKey "55·55·50", and a patch may only restate what the record already holds. A curl
       with no such record anywhere keeps whatever it has and gains no phantom vector. */
    const cu9 = (s.exercises || []).find((x) => x && x.id === "curl");
    if (cu9) {
      const vecOf9 = (v) => {
        if (v == null || typeof v === "number") return null;
        const parts9 = String(v).split("·");
        if (parts9.length < 2) return null;
        const nums9 = parts9.map((x) => Number(String(x).trim()));
        return nums9.every((n) => isFinite(n) && n > 0) ? nums9 : null;
      };
      let vec9 = vecOf9(cu9.w);
      if (!vec9) {
        for (const d9 of Object.keys(s.sessionLog || {}).sort().reverse()) {
          const en9 = (((s.sessionLog[d9] || {}).entries) || []).find((e) => e && e.id === "curl");
          const v9 = en9 && (vecOf9(en9.w) || vecOf9(en9.wKey));
          if (v9) { vec9 = v9; break; }
        }
      }
      /* A9 (Sol, live-race relevant) — THE RESTATEMENT MAY NEVER LOWER A LIVE LOAD. Executed
         on his v59 blob with curl already advanced to a numeric 60: the patch rewrote 60 back
         to 55 and installed the older string's vector. If he logs a curl at a new load before
         this deploys, the deploy rolls him back. A restatement is only honest while the record
         it restates still describes the CURRENT load: either ex.w IS the string vector, or ex.w
         is numeric and the vector's own opener equals it. The vector must also fit the set
         count. The ladder goes regardless — the walk owns the graduation now. */
      const fits9 = !!(vec9 && vec9.length === cu9.sets);
      const tied9 = !!(vec9 && (vecOf9(cu9.w) || (typeof cu9.w === "number" && vec9[0] === cu9.w)));
      if (vec9 && fits9 && tied9) { cu9.w = vec9[0]; cu9.wSets = vec9.slice(); }
      if (cu9.ladder) delete cu9.ladder;
    }
    for (const q9 of (s.queue || [])) {
      if (q9 && q9.id === "q_curl_grad" && !q9.done) {
        q9.done = true; q9.state = "SUPERSEDED";
        if (!(s.feed || []).some((f) => f && f.op === "patch60:curlgrad"))
          (s.feed = s.feed || []).unshift({ d: "2026-08-19", op: "patch60:curlgrad", t: "CURL GRADUATION — THE WALK OWNS IT NOW", how: "The curl's per-set loads are numbers from this version on, so the same earn walk every other lift runs now runs here: two sessions at the top of the window bank the graduation and price the next line at 60·60·55. The coach flag is superseded — nothing is lost, the rule just stopped being a human's to carry." });
      }
    }
    if ((hits9 || gone9) && !(s.feed || []).some((f) => f && f.op === "patch60:seams"))
      (s.feed = s.feed || []).unshift({ d: "2026-08-19", op: "patch60:seams", t: "INSERTION SEAMS RE-DERIVED", how: "The eleven seams stamped 8/17 by the day the code ran are retired; a seam now starts when the new lift is actually performed with the lift it affects, and only where the two share a working muscle (hip thrust → ham curl). Today that is none: the fly shares no working muscle with what follows it, and the hip thrust has not been performed. Ruled by the owner on 2026-08-19 on two independent audits." });
  } catch (e) {}
  s.v = 60; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11404-11416.
function patchV58(s) {
  /* THE OTHER HALF OF LEG 4. That leg stopped fabricating corrections from
     membership — correctly, it was inventing them for initial skips. But it
     also left the REAL ones unfiled: two ✕ corrections (7/23 pronated, 7/31
     ham) and two ↩ corrections (8/14 abs, hanging) that the feed names outright.
     Executed on his ledger: a stale replica that never learned the ✕, re-saved
     after the correction instant, takes the base by _richerSession's own rule
     and RESURRECTS both — while 8/09's pronated, which has its op, holds. The
     control is the whole argument: provenance is what saves it, and nothing
     else. */
  _fileKnownCorr(s);
  s.v = 58; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11417-11450.
function patchV57(s) {
  /* THE BACKFILL COMPLETED, and derived rather than listed. patchV56 named
     three ops by hand and covered 2 of the 5 records that carry corr: 7/23,
     7/31 and 8/10 were replayable not at all, and 8/14 carried rev 4 — four
     deliberate corrections — with exactly one replayable. A record whose
     corrections cannot be replayed loses them to the first merge with a device
     that never learned them.
     (The paragraph that stood here claimed deriving from every skipped[]
     member was safe. It was not, and the explanation of why sits immediately
     below — a stale claim living one screen above its own refutation.) */
  /* ROLLED BACK, AND THE ROLLBACK IS THE POINT. skipped[] holds TWO DIFFERENT
     THINGS wearing one shape: an INITIAL skip, written by completeSession while
     the session was logged (no correction, no provenance, part of the body),
     and a CORRECTION skip, written by the ✕ handler as a deliberate later act.
     Membership cannot tell them apart, so a sweep over skipped[] invents
     corrections for the first kind — and it fired on his REAL data: 8/16 holds
     rows and sulek, both initial (the feed says "SKIPPED — Prime seated row,
     Sulek wrist curl", not "RECORD AMENDED"), and 8/14's hipthrust is initial
     too. One unrelated correction to such a record would file skip ops dated to
     that unrelated act, and a fabricated skip stamped LATER than a genuine
     un-skip deletes the athlete's only real word on the lift, in both orders.
     That is this round's own bug pointed the other way: last leg a stale
     replica RESURRECTED a struck lift; here a fabricated skip DELETES a real
     un-skip. Both are membership read as provenance.
     So nothing is derived. The specific, value-keyed backfills stay in
     patchV56 — they name known historical corrections and are provable by
     shape. From v57 forward every genuine correction-skip files its own op
     through the ✕ handler and needs no backfill; an initial skip is part of the
     session body, sits in skipped[] on every replica, and survives a merge
     because of that — it never needed an op, and giving it one is the
     fabrication. SCHEMA_V stays 57: the step still exists, it just no longer
     claims to know something the record cannot prove. */
  s.v = 57; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11451-11493.
function patchV56(s) {
  /* THE BACKFILL (v7.54.0) — corrections made before corrLog existed get their
     entry, derived from what is KNOWABLE and stamped idempotently. Value-keyed,
     per the leg-4 lesson: provenance is earned by what the record CARRIES, never
     by its date or its route. A record whose shape does not match takes nothing,
     so a device that never had the correction is untouched and a restored backup
     is judged on its own contents. _fileCorr is first-sighting, so a replay
     never re-dates an entry it already has. */
  const rec9 = ((s && s.sessionLog) || {})["2026-08-09"];
  if (rec9 && Array.isArray(rec9.entries)) {
    const at9 = (rec9.corr && typeof rec9.corr.at === "string" && isFinite(Date.parse(rec9.corr.at))) ? rec9.corr.at : "2026-08-09T21:56:31.672Z";
    const eq9 = (a9, b9) => JSON.stringify(a9) === JSON.stringify(b9);
    /* the ✕ that marked Pronated EZ curl skipped — keyed on the record still
       carrying that skip, and on the lift NOT being logged that day. */
    if ((rec9.skipped || []).some((z9) => z9 && z9.id === "pronated") && !rec9.entries.some((e9) => e9 && e9.id === "pronated")) {
      _fileCorr(rec9, "skip:2026-08-09:pronated", "skip", "pronated", at9);
    }
    /* the arm strike — keyed on all three tails standing at the attested values */
    const ATT9 = [["rows", [9, 9], [1, 0]], ["tricep", [12, 12], [null, null]], ["curl", [11, 10, 10], [2, null, null]]];
    let ok9 = 0;
    for (const [id9, r9] of ATT9) {
      const e9 = rec9.entries.find((z9) => z9 && z9.id === id9);
      if (!e9) continue;
      if (!eq9(e9.reps, r9)) { ok9 = -1; break; }
      ok9++;
    }
    if (ok9 > 0) _fileCorr(rec9, "restrike:2026-08-09:arms", "strike", null, at9, ATT9.map(([id9, r9, rs9]) => ({ id: id9, reps: r9.slice(), rirSets: rs9.slice() })));
  }
  /* the 8/14 load amendment (patchV52) — value-keyed the same way */
  const rec8 = ((s && s.sessionLog) || {})["2026-08-14"];
  if (rec8 && Array.isArray(rec8.entries)) {
    const AMD9 = [["hack", 200], ["extension", 160]];
    let hit9 = 0;
    for (const [id9, w9] of AMD9) {
      const e9 = rec8.entries.find((z9) => z9 && z9.id === id9);
      if (!e9) continue;
      if (e9.w !== w9) { hit9 = -1; break; }
      hit9++;
    }
    if (hit9 > 0) _fileCorr(rec8, "amend:2026-08-14:loads", "amend", null, "2026-08-14T21:57:13.968Z", AMD9.map(([id9, w9]) => ({ id: id9, w: w9 })));
  }
  s.v = 56; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11494-11542.
function patchV55(s) {
  /* THE RE-STRIKE (leg 8) — finish the attested correction IN THE LOG,
     durably. patchV41 struck these exact tails on Joe's attestation ("I
     didn't do the 3rd set of arms"), and a later mergeState "richer session
     wins" resurrected them in the LOG while the caches kept the strike — a
     half-applied correction the shipped reconcileLiftCaches tolerated because
     it never re-reads the log. Derive-first (legs 5-7) is correct to trust
     the log, so the LOG itself must be made to agree with the attestation,
     or the boot resurrects sets he said he did not do. Same content-keyed
     pattern as patchV41, re-applied at the current schema: an entry that no
     longer carries the exact phantom shape no-ops (replay-safe,
     restore-safe, and a device that never had the phantom is untouched).
     THE DEEPER CLASS IS NOT BUILT HERE: a session merge must not let a
     richer replica resurrect a tail struck under a corr stamp — that is the
     convergence harness round's session-merge law. This patch heals the live
     instance.
     DETERMINISM: the corr bump keeps the record's OWN at and raises rev —
     equal at, higher rev wins CORRECTION_MERGE, so this strike beats any
     lingering un-struck replica by ordering without a wall-clock stamp
     (which under the frozen suite clock would LOSE to the 8/09 at). */
  const rec55 = ((s && s.sessionLog) || {})["2026-08-09"];
  if (rec55 && Array.isArray(rec55.entries)) {
    const eq55 = (a9, b9) => JSON.stringify(a9) === JSON.stringify(b9);
    const STRIKE55 = [
      ["rows", [9, 9, 8], [1, null, 0], [9, 9], [1, 0]],
      ["tricep", [12, 12, 11, 10], [null, null, null, null], [12, 12], [null, null]],
      ["curl", [11, 10, 10, 9], [2, null, null, null], [11, 10, 10], [2, null, null]],
    ];
    let moved55 = false;
    for (const [id9, pr9, ps9, ar9, as9] of STRIKE55) {
      const e9 = rec55.entries.find((z9) => z9 && z9.id === id9);
      if (e9 && eq55(e9.reps, pr9) && eq55(e9.rirSets, ps9)) { e9.reps = ar9.slice(); e9.rirSets = as9.slice(); moved55 = true; }
    }
    if (moved55) {
      /* recompute the caches through the existing machinery — never hand-edit */
      for (const id9 of ["rows", "tricep", "curl"]) {
        const exL9 = (s.exercises || []).find((z9) => z9 && z9.id === id9);
        if (exL9) { const dm9 = deriveLastMeta(s, id9); if (dm9) { exL9.lastMeta = dm9; exL9.last = dm9.reps.slice(); } }
      }
      const prev9 = rec55.corr && typeof rec55.corr === "object" && typeof rec55.corr.at === "string" && isFinite(Date.parse(rec55.corr.at)) ? rec55.corr : null;
      rec55.corr = { at: prev9 ? prev9.at : "2026-08-09T21:56:31.672Z", rev: (prev9 && isFinite(+prev9.rev) ? +prev9.rev : 0) + 1 };
      if (!Array.isArray(s.feed)) s.feed = [];
      const op9 = "restrike:2026-08-09:arms";
      if (!s.feed.some((f9) => f9 && f9.op === op9)) s.feed.unshift({ op: op9, d: "2026-08-09", t: "RECORD RE-STRUCK — Sunday 8/09 arm tails a merge had resurrected are removed again", how: "On the standing attestation: 'I didn't do the 3rd set of arms'. Reps match what you logged." });
      _fileCorr(rec55, op9, "strike", null, rec55.corr.at, STRIKE55.map(([id9, , , ar9, as9]) => ({ id: id9, reps: ar9.slice(), rirSets: as9.slice() })));   /* v7.54.0 THE RITUAL — a patch that corrects a logged session files its correction, carrying the attested values, so a merge can restate it instead of losing to a richer un-struck replica. This is the same class the wCorrAt ritual closed for loads. */
    }
  }
  s.v = 55; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11543-11579.
function patchV54(s) {
  /* PER-ENTRY LOAD-CORRECTION PROVENANCE (leg 3). patchV52 amended the two
     attested 2026-08-14 loads; the reconciler now keys on the ENTRY that was
     amended rather than on the session's correction stamp, because the session
     stamp is also written by skip corrections that change no load. This stamps
     the two entries patchV52 changed, with the record's own correction instant
     — a deterministic literal, and later than hack's pre-correction wAt
     (21:52:54.838Z) by five minutes, which is what makes the adoption legal.
     Absent-only, so it is idempotent; a device whose ledger never held the
     session takes nothing.

     THE RITUAL, permanently: a data patch that changes an entry's w stamps
     that entry's wCorrAt in the same breath — and stamps it ONLY on an entry
     carrying the load the amendment attests. The attestation is about the
     VALUE on the record; an entry that contradicts it earns no provenance,
     because the plan may only follow a correction that says which load it
     corrected. */
  const AT54 = "2026-08-14T21:57:13.968Z";
  /* LEG 4 — THE GUARD IS THE VALUE, NOT THE ID. An ID-based stamp fabricated
     provenance no amendment ever earned: an entry the athlete had himself
     diverged to 210 (which patchV52's stale-value guard rightly leaves alone)
     still received wCorrAt, and the reconciler then moved the config 190 -> 210
     with a receipt claiming the corrected record said so. The attestation is
     about the VALUE on the record — hack at 200, extension at 160 — so an
     entry carrying anything else earns nothing. An entry the athlete
     coincidentally typed at 200 is stamped, and that is the honest reading:
     it is indistinguishable from, and identical to, what the attestation says. */
  const ATTESTED54 = [["hack", 200], ["extension", 160]];
  const rec54 = ((s && s.sessionLog) || {})["2026-08-14"];
  if (rec54 && Array.isArray(rec54.entries)) {
    for (const [id54, w54] of ATTESTED54) {
      const en54 = rec54.entries.find((e9) => e9 && e9.id === id54);
      if (en54 && en54.w === w54 && !en54.wCorrAt) en54.wCorrAt = AT54;
    }
  }
  s.v = 54; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11580-11637.
function patchV53(s) {
  /* THE TERMINAL-SET AMENDMENT — owner attestation, 2026-08-14. The debrief
     asked: "2 lifts have no last-set rating (Prime abdominal crunch,
     Supported leg raise) — those default to the smallest step until the
     terminal set is on file." Joe answered: "The lifts on record were at 0
     RIR." Both lifts reached the log through the ↩ un-skip control, which
     writes rir null and an all-null rirSets under an honest receipt ("RIR is
     left unrecorded because it was never captured"). It is captured now — for
     the TERMINAL set, which is the set the question was about.

     WHAT THIS WRITES, AND WHAT IT REFUSES TO WRITE:
     · the terminal rirSets slot becomes 0. Every other slot stays null.
     · en.rir stays NULL. That field is the OPENER's rating, and the opener
       was never asked. Writing 0 there would manufacture a grind reading —
       openerRir === 0 is the hot-opener load-freeze signal — from an
       attestation that was only ever about the last set.
     · reps, w, og, wKey, skipped[], every other entry, every other date and
       every config: byte-identical.

     IDEMPOTENT BY CONSTRUCTION: the guard is the NULL terminal slot itself,
     so a rerun, a device that took the amendment through a merge, or a fresh
     install whose ledger never held the 8/14 session all take nothing. */
  const rec53 = ((s && s.sessionLog) || {})["2026-08-14"];
  if (rec53 && Array.isArray(rec53.entries)) {
    const moved53 = [];
    for (const id53 of ["abs", "hanging"]) {
      const en53 = rec53.entries.find((e9) => e9 && e9.id === id53);
      const len53 = en53 && Array.isArray(en53.reps) ? en53.reps.length : 0;
      if (!len53) continue;
      /* shaped exactly as rirSetsOf shapes it — sliced to the rep count and
         padded with nulls — but WITHOUT its opener mirroring, which is a read
         convenience and must never be persisted into the record. */
      const arr53 = (Array.isArray(en53.rirSets) ? en53.rirSets.slice(0, len53) : []);
      while (arr53.length < len53) arr53.push(null);
      if (arr53[len53 - 1] != null) continue;   /* already rated — the guard */
      arr53[len53 - 1] = 0;
      en53.rirSets = arr53;
      moved53.push(id53);
    }
    if (moved53.length) {
      /* the CORRECTION_MERGE stamp, refreshed: a replica carrying the
         v52-corrected-but-unrated copy must lose from both directions. */
      _stampCorr(rec53);
      if (!Array.isArray(s.feed)) s.feed = [];
      for (const id53 of moved53) {
        /* the cache discipline the correction handlers follow: progressStep
           and the debrief read lastMeta/ex.last, not the log, so a stale
           all-null copy would keep them saying "nothing rated last time". */
        const ex53 = (s.exercises || []).find((e9) => e9 && e9.id === id53);
        if (ex53) { const dm53 = deriveLastMeta(s, id53); if (dm53) { ex53.lastMeta = dm53; ex53.last = dm53.reps.slice(); } }
        const nm53 = ex53 && ex53.n ? String(ex53.n).toUpperCase() : id53.toUpperCase();
        const op53 = "amend:2026-08-14:" + id53 + ":rir";
        if (!s.feed.some((f9) => f9 && f9.op === op53)) s.feed.unshift({ op: op53, d: "2026-08-14", t: "RECORD AMENDED — " + nm53 + " 2026-08-14: the last set ran to failure (0 RIR)", how: "on the owner's word. Reps and weight untouched; the opener stays unrated because it was never asked." });
      }
    }
  }
  s.v = 53; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11638-11702.
function patchV52(s) {
  /* THE DATA AMENDMENT — owner attestation, 2026-08-14 (the standing precedent:
     a chat attestation corrects the record). On the 2026-08-14 session Joe
     lifted the hack squat at 200 and the leg extension at 160; the session
     banked 190 and 155 — he answered the ladder ask with 200 and reasonably
     expected it to carry into the session. Reps, RIR and every effort answer
     are CORRECT as logged and are not touched here.

     WHAT THIS PATCH DELIBERATELY DOES NOT DO:
     · it never touches skipped[] or any lift's skip state. Joe is un-skipping
       two lifts in-app through the ↩ control, before or after this runs, and a
       patch racing an athlete's own correction is how a record gets a value
       nobody chose. Whatever state those lifts are in when this runs is his.
     · it never touches the CONFIG w. hack's config stays where it is; the
       earn and prescription machinery reads the corrected ENTRY and does its
       own honest work next session, and the ladder he saved already carries
       200 as the next rung. A patch that also moved the config would be
       deciding a progression he did not attest to.
     · it amends ONE date and TWO entries. Any other date, any other lift, and
       every other field of these two entries stay byte-identical. */
  /* LEG 3 — THE RITUAL THIS PATCH SET THE PRECEDENT FOR: a patch that changes
     an entry's w must also stamp that entry's wCorrAt, which is what the load
     reconciler keys on. LEG 4 completes it: the stamp lands only where the
     entry carries the attested VALUE. This patch's own stale-value guard is
     the same rule one step earlier — an entry the athlete has since diverged
     is left alone, and must not then be handed provenance it never earned.
     patchV54 does both for these two entries retroactively; a future amendment
     does them inline. */
  const AMEND52 = [["hack", 190, 200], ["extension", 155, 160]];
  const rec52 = ((s && s.sessionLog) || {})["2026-08-14"];
  if (rec52 && Array.isArray(rec52.entries)) {
    const moved52 = [];
    for (const [id52, from52, to52] of AMEND52) {
      const en52 = rec52.entries.find((e9) => e9 && e9.id === id52);
      /* IDEMPOTENT BY CONSTRUCTION: the guard is the stale value itself, so a
         rerun (or a device that already took the amendment through a merge)
         finds 200/160, amends nothing and files nothing. An absent entry —
         a session that never carried this lift, or one the athlete has since
         corrected himself — is also left alone. */
      if (!en52 || en52.w !== from52) continue;
      en52.w = to52;
      moved52.push([id52, from52, to52]);
    }
    if (moved52.length) {
      /* the CORRECTION_MERGE stamp: without it this is an unmarked change and
         a replica carrying the old copy reverts it on the next sync. rev
         orders it against any other correction on the same record. */
      _stampCorr(rec52);
      if (!Array.isArray(s.feed)) s.feed = [];
      for (const [id52, from52, to52] of moved52) {
        /* THE CACHE DISCIPLINE the ✕ and ↩ handlers already follow: lastMeta
           and ex.last are denormalised copies of the log that progressStep and
           targetsFor actually read. Re-derived here, or a stale 190/155 keeps
           driving a target — the exact class the earlier ledger repairs
           missed. deriveLastMeta reads the log and invents nothing. */
        const ex52 = (s.exercises || []).find((e9) => e9 && e9.id === id52);
        if (ex52) { const dm52 = deriveLastMeta(s, id52); if (dm52) { ex52.lastMeta = dm52; ex52.last = dm52.reps.slice(); } }
        const nm52 = ex52 && ex52.n ? String(ex52.n).toUpperCase() : id52.toUpperCase();
        const op52 = "amend:2026-08-14:" + id52;
        if (!s.feed.some((f9) => f9 && f9.op === op52)) s.feed.unshift({ op: op52, d: "2026-08-14", t: "RECORD AMENDED — " + nm52 + " 2026-08-14 logged " + from52 + " → " + to52, how: "the weight actually lifted. Corrected on the owner's word; reps and effort answers untouched." });
      }
    }
  }
  s.v = 52; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11703-11832.
function patchV51(s) {
  /* THE SPLIT PATCH (owner-ruled 8/12). Deterministic: canonical dates, never
     fire-time; every authored field stamped at RULING_EPOCH; the eleven seams
     appended by THIS patch (not the runtime registry) so bodies and bytes are
     identical whichever device migrates first. */
  const EP = "2026-08-12T00:00:00.000Z";
  if (!Array.isArray(s.feed)) s.feed = [];   /* FIX split-1 (P1-7): heal a hostile/missing container before any receipt lands */
  const exs = s.exercises || (s.exercises = []);
  /* the shared canonical-birth validity predicate: what a walkable record of
     this lift must carry. Consulted here, by exActive's projection sites via
     the quarantine marker, and by normalization. */
  const bornValid = _bornValid;   /* F1: the ONE predicate — the healer judges with the same rule this flags with */
  const put = (spec, afterId) => {
    const have = exs.find((x) => x && x.id === spec.id);
    if (have) {
      /* FIX split-1 (P1-4): never trust a pre-existing object wearing the new
         id. Compatibility is judged on what the object BROUGHT. Compatible →
         FILL-ONLY repair. Incompatible → repaired for shape but INACTIVE.
         R9 fix-2: the marker rides the RECORD, never s.retirements — the
         athlete tombstone register is key-union merged, so one corrupt replica
         would have retired every healthy device's valid fly FOREVER. On the
         record, the wholesale per-lift merge lets a healthy replica's valid
         copy simply win. An invalid birth also returns false so the caller
         fires NO seams, insertion markers or FRESH BASELINE receipts. */
      const wasValid = bornValid(have);
      if (!wasValid) { have.quarantined = "invalid:" + "2026-08-12"; return false; }   /* F1: preserved AS BROUGHT — filling a flagged record would manufacture the very shape the healer's clearing pass trusts (quarantined IFF invalid) */
      for (const k of Object.keys(spec)) { if (have[k] == null) have[k] = spec[k]; }
      return true;
    }
    const i = exs.findIndex((x) => x && x.id === afterId);
    exs.splice(i < 0 ? exs.length : i + 1, 0, spec);
    return true;
  };
  const flyBorn = put({ id: "fly", mg: "chest", n: "Machine fly", day: "U", w: null, wAt: EP, inc: 5, incAt: EP, sets: 2, setsAt: EP, hi: 20, hiAt: EP, last: null, pinsBornAt: EP,
    setup: "SET · fly mode · seat [PIN] · start [PIN] · resistance profile [PIN]\nKeep back on pad and elbows at the same bend through your full pain-free range · open and close to the same endpoints—no bounce", setupAt: EP }, "press");
  const htBorn = put({ id: "hipthrust", mg: "glutes", n: "Hip thrust machine", day: "L", w: null, wAt: EP, inc: 5, incAt: EP, sets: 3, setsAt: EP, hi: 12, hiAt: EP, last: null, pinsBornAt: EP,
    setup: "SET · machine setting [PIN] · belt/pad landmark [PIN] · foot marks [PIN]\nUse your full pain-free hip range to the same depth and finish height · keep upper back on pad—do not arch the low back to finish", setupAt: EP }, "hack");
  /* R11 fix-4 — PINS-BORN BACKFILL, fill-if-absent and idempotent. A record
     whose cue carries [PIN]s (or which has already been seen with them, or
     stamped calibrated) gets its birthday := the record's CURRENT setupAt —
     honest for every live state, because no pin-fill surface has ever existed
     on a device and the only .setup writers in the tree are schema patches, so
     today's setupAt IS when the pinned cue arrived. Never rewritten
     afterwards, by anything. */
  for (const eB of exs) {
    if (!eB || eB.pinsBornAt) continue;
    if (pinsUnfilled(eB) > 0 || eB.pinsSeen || eB.calibratedAt) eB.pinsBornAt = eB.setupAt || EP;
  }
  /* THE RULING-WRITE RULE (item e): a target lands only where the field's stamp
     is absent or pre-epoch; an athlete's at-or-after-epoch word survives. Live
     evidence (cowork, executed): pulldown setsAt ABSENT, calves ABSENT,
     rearDelt 2026-08-07 (pre-ruling) — all three take the ruling; lateral's
     8/13 stamp is untouched by construction. */
  for (const [id51, n51] of [["pulldown", 3], ["rearDelt", 3], ["calves", 3]]) {
    const e = exs.find((x) => x && x.id === id51);
    if (e && (!e.setsAt || e.setsAt < EP)) { e.sets = n51; e.setsAt = EP; }
  }
  /* THE RETIREMENT (item d): tombstone at the canonical ruling date; immediate
     sweep of active obligations; the record itself untouched forever. */
  s.retirements = { ...(s.retirements || {}), pronated: "2026-08-12" };
  const pr = exs.find((x) => x && x.id === "pronated");
  if (pr && !s.feed.some((f9) => f9 && f9.op === "retire:pronated")) {
    /* FIX split-1 (P1-2): UNCONDITIONAL — the live pronated carries no armed
       standards, and the conditional receipt left the retirement unreceipted
       on the very state it shipped for. Standards, when armed, ride the body. */
    const hadStd = !!(pr.std || pr.own || pr.reclaim);
    s.feed.unshift({ op: "retire:pronated", d: "2026-08-12", t: "PRONATED EZ CURL — RETIRED", how: "The split ruling retires the lift" + (hadStd ? "; the standard" + (pr.reclaim ? " and the reclaim line" : "") + " it carried retire with it, preserved here: std " + JSON.stringify(pr.std) + ", reclaim " + JSON.stringify(pr.reclaim) : "") + ". Every logged session stays on the record, and the record never closes." });
    pr.std = null; pr.own = false; pr.reclaim = null;
  }
  /* THE ELEVEN SEAMS + the registry (item i): canonical date, split-tagged so
     normalization may re-date each lift's boundary past its own last old-order
     entry. prevN = the current display name (the name the closing era used). */
  /* FIX split-1 (P0-3, day-granular): the seam sits past today's persisted
     session AND any persisted in-flight draft — both were performed (or are
     mid-performance) under the OLD order, wherever deploy day lands. Canonical
     floor 2026-08-14; canonicalizePlan keeps re-dating past og<51 entries
     thereafter (the draft self-heals through its og when it completes). */
  const seamFrom = (() => {
    let d0 = "2026-08-14";
    const bump = (dd) => { const nd = new Date(dd + "T12:00:00Z"); nd.setUTCDate(nd.getUTCDate() + 1); return nd.toISOString().slice(0, 10); };
    try { const t9 = isoOf(todayStart()); if ((s.sessionLog || {})[t9] && bump(t9) > d0) d0 = bump(t9); } catch (e9) {}
    try {
      for (let i9 = 0; i9 < localStorage.length; i9++) {
        const k9 = localStorage.key(i9);
        if (!k9 || (k9.indexOf("prep-ledger-draft-") !== 0 && k9.indexOf("prep-ledger-gymdraft-") !== 0)) continue;
        const dd = k9.slice(-10);
        if (/^\d{4}-\d{2}-\d{2}$/.test(dd) && bump(dd) > d0) d0 = bump(dd);   /* R3(a) fix-2: round 1 shipped this as /^d{4}-…/ — the surgery script's template literal ate the backslashes and no date ever matched */
      }
    } catch (e9) {}
    return d0;
  })();
  /* FIX split-1 (P1-3): the seams go through the ONE implementation.
     R9 fix-2: an INVALID birth fires nothing — no seams, no registry marker,
     no receipts; round 1 fired all eleven unconditionally. */
  /* Hunt 1 (Grok) — THE BIRTH CALLERS TAKE THEIR AFFECTED LISTS FROM THE RULED TABLE. These
     two are birth-gated and their output is dead on arrival — the deriver strips any mint in
     the same boot, measured — so this is hardening, not a stop-the-line. But a caller carrying
     the OLD six-lift fly list is a second source of truth about which lifts an insertion
     touches, and this round made INSERTION_PAIRS the only one. Even the transient mint now
     obeys it. */
  const pairsOf9 = (id9) => (INSERTION_PAIRS.find((p9) => p9[0] === id9) || [id9, []])[1];
  if (flyBorn) applyInsertionSeams(s, "fly", pairsOf9("fly"), seamFrom);
  if (htBorn) applyInsertionSeams(s, "hipthrust", pairsOf9("hipthrust"), seamFrom);
  /* FIX split-1 (P0-4) — the pending pre-split ORDER-DERIVED offers are swept
     with honest reasons: each proposed set counts through a chooser that
     reasoned about the plan this ruling replaced (7 volume offers on the live
     state). The calorie-band coach card is NOT order-derived and stands —
     closing a live nutrition decision with a false reason would be the
     refeed_review defect again. Adjudicated, on the record. */
  {
    const apKeep = [];
    for (const ap of (s.agentProposals || [])) {
      if (ap && ap.pg == null && ap.kind === "volume") {   /* R4 fix-2: resets are stall-derived and survive; only the chooser's volume offers reasoned about the replaced plan */
        s.feed.unshift({ op: "supersede:" + (ap.id || ap.kind), d: "2026-08-12", t: "OFFER SUPERSEDED — " + String(ap.title || ap.kind).slice(0, 48), how: "This offer was derived from the pre-split plan — its set counts and its chooser both reasoned about an order this ruling replaced. It closes without effect; anything still earned re-files under the current plan on the next sweep." });
      } else apKeep.push(ap);
    }
    if (Array.isArray(s.agentProposals)) s.agentProposals = apKeep;
    for (const p of (s.proposals || [])) {
      if (p && !p.resolved && p.pg == null && p.apply && p.apply.kind === "sets" && !p.apply.owner) {   /* R4 fix-2: owner's-call decisions survive the migration sweep */
        p.resolved = true; p.superseded = true;
        s.feed.unshift({ op: "supersede:" + (p.rid || p.id), d: "2026-08-12", t: "OFFER SUPERSEDED — " + String(p.title || p.rid).slice(0, 48), how: "This card was derived from the pre-split plan; the ruling changed the plan it reasoned about, so it closes without effect. Anything still earned re-files under the current plan." });
      }
    }
  }
  /* THE PLAN REGISTER (item f): generation 51, ruled orders; normalizePlan
     (sweep-run) keeps them lawful thereafter. */
  s.planGen = 51;
  s.exOrder = { U: ["lateral", "press", "fly", "pulldown", "rows", "rearDelt", "curl", "tricep", "sulek"], L: ["hack", "hipthrust", "extension", "ham", "abs", "hanging", "calves"] };
  s.v = 51; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11833-11853.
function patchV50(s) {
  /* FIX 3a — ERAS BECOME PLURAL AND NAMES BECOME ERA-TRUTHFUL. fork → forks[]
     (additive restatement); the 8/13 seams record the name their old era used
     (prevN), so a July "Rows (strapless)" session can never re-render under the
     hooks name; the calf pause becomes a structured field. */
  const PREV_N = { pulldown: "Pulldown", rows: "Rows (strapless)", calves: "Calves" };
  const RENAMED = { rows: "Rows (strapless)", rearDelt: "Rear-delt fly (cable · uni)", curl: "Curls", sulek: "Sulek curl (forearm)", abs: "Abs", hanging: "Hanging raise" };
  for (const e of (s.exercises || [])) {
    if (!e) continue;
    if (!Array.isArray(e.forks) && e.fork && e.fork.from) e.forks = [e.fork];
    if (e.fork) delete e.fork;
    if (Array.isArray(e.forks)) {
      for (const f9 of e.forks) { if (f9 && f9.from === "2026-08-13" && !f9.prevN && PREV_N[e.id]) f9.prevN = PREV_N[e.id]; }
    }
    /* the NAME seams: all six renamed lifts, dated the adoption, archived
       wording exact — a July session renders under the name July used */
    if (RENAMED[e.id] && !Array.isArray(e.renames)) e.renames = [{ from: "2026-08-13", prevN: RENAMED[e.id] }];
    if (e.id === "calves" && e.pauseSec == null) e.pauseSec = 2;
  }
  s.v = 50; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11854-11866.
function patchV49(s) {
  /* v7.53.0 — THE BASELINE FORKS (R1 + R2). Only the technique changes that are
     real TODAY fork: hooks on both pulls, the 2s calf pause. The A3 insertion
     table (fly / hip thrust) is ARMED in runAdaptive and fires when those lifts
     actually enter the programme — forking on a change that has not happened
     would archive history against nothing. History before the fork is retained,
     never deleted; the instruments simply stop comparing across the seam. */
  [["pulldown", "hooks standardized"], ["rows", "hooks standardized"], ["calves", "2 s pause replaces 5 s"]].forEach(([id9, why9]) => {
    const e = (s.exercises || []).find((x) => x && x.id === id9);
    if (e && !e.fork) e.fork = { from: "2026-08-13", why: why9 };
  });
  s.v = 49; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11867-11900.
function patchV48(s) {
  /* v7.53.0 JOB 2 — THE WORD BUNDLE reaches migrated states. SELF-CONTAINED on
     purpose: the first cut copied from module-level SEED, and SEED is a MUTABLE
     global — the suite caught it, because an earlier test block's mutation
     changed what this patch wrote. A patch's input must be its own immutable
     literal; the two seed-shape assertions prove the literal and SEED agree.
     Every write stamps setupAt with the fixed adoption ISO — the first real
     setup writers under the v7.52.0 stamp discipline, which is what stops a
     stale device's merely-trained copy resurrecting the old cue wholesale.
     Loads, sets, records: untouched by construction. */
  const CUES48 = {
    lateral: { n: "Lateral machine", setup: "SET · resistance profile 5 · seat 5\nRaise elbow-first through your full pain-free arc to the same height · keep torso fixed—no swing or late-rep shoulder hike" },
    rearDelt: { n: "Rear-delt fly (cable, unilateral)", setup: "SET · unilateral · cable highest · handle [PIN] · stance [PIN]\nSweep through your full pain-free arc to the same endpoint · keep torso fixed—no twist or swing" },
    rows: { n: "Prime seated row (hooks)", setup: "SET · seat 4 · chest pad 7 · resistance profile 1 · grip [PIN] · Gymreapers hooks fitted the same way\nUse your full pain-free reach and finish at the same points with chest on pad · keep torso still—no pad lift" },
    curl: { n: "Curls (preacher)", setup: "SET · resistance profile 5 · seat 3\nKeep upper arms on the pad through your full pain-free elbow range · stop before a shoulder roll starts" },
    press: { n: "Press", setup: "SET · cam 5 · lowest seat · neutral grip\nLower through your full pain-free range to the same depth with upper back on pad · press on the same elbow path—no bounce" },
    pulldown: { n: "Pulldown", setup: "SET · silver bar · Gymreapers hooks fitted the same way · thumbs at the same marks\nUse your full pain-free reach at the top and pull to the same body landmark · keep torso angle fixed—no swing" },
    sulek: { n: "Sulek wrist curl (high cable)", setup: "SET · cable highest rung · straight bar · grip [PIN]\nBend only the wrists—palms curl toward the inner forearm through your full pain-free range · elbows still at sides, no swing" },
    tricep: { n: "Tricep", setup: "SET · seat 4 · back pad fully forward · middle peg\nKeep upper arms supported through your full pain-free elbow range · stop before shoulder roll or bounce" },
    pronated: { n: "Pronated EZ curl", setup: "SET · EZ bar, pronated grip\nElbows pinned to sides, zero swing · wrists locked—don't let them bend back under load" },
    calves: { n: "Calves", setup: "SET · shoulder height 4 · foot placement [PIN]\nWith the same near-straight knee angle, pause 2 s (gym-mode timed) at the same deepest pain-free point · rise to the same top height—no bounce" },
    abs: { n: "Prime abdominal crunch", setup: "SET · resistance profile [PIN] · back pad A · seat 6\nCurl ribs toward pelvis through your full pain-free range · keep hips on pad" },
    hanging: { n: "Supported leg raise (medicine-ball pad)", setup: "SET · bodyweight · medicine-ball pad at [PIN] · knee bend [PIN]\nStart with low back rounded against the pad and raise through your full pain-free range to the same height · keep knee bend fixed—no swing" },
    hack: { n: "Hack squat", setup: "SET · foot placement = pinned photo\nMatch the photo and descend through your full pain-free range to the same depth · keep feet, hips, and back contact unchanged" },
    extension: { n: "Leg extension", setup: "SET · shin pad A · start range 3 · seat fully reclined · load peg/profile [PIN]\nKeep hips and back on pad through your full pain-free knee range · extend smoothly—no kick or lockout jerk" },
    ham: { n: "Ham curl", setup: "SET · back 5 · thigh pad [PIN] · calf pad C · start range 3 · resistance profile 5\nKeep hips down through your full pain-free knee range · stop before lift-off or shortened late reps" },
  };
  for (const [id48, c48] of Object.entries(CUES48)) {
    const e = (s.exercises || []).find((x) => x && x.id === id48);
    if (!e) continue;
    e.n = c48.n; e.setup = c48.setup; e.setupAt = "2026-08-13T12:00:00.000Z";
  }
  s.v = 48; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11901-11927.
function patchV47(s) {
  /* v7.53.0 JOB 1 — THE FAILURE A/B RETIRES (Joe's ruling, before it began).
     Three restatements, all content-keyed and safe under the one-shot runner:
     the pending consent card is withdrawn (a card proposing a retired
     experiment is a card that lies); any approved-but-unrun trial is marked
     declined + retired rather than deleted — the tap was athlete history, the
     disarm is the retirement; and ONE receipt files the ruling in the house
     voice. Readers all filter !declined, so the mark alone silences every
     surface. */
  s.agentProposals = (s.agentProposals || []).filter((ap9) => !(ap9 && ap9.kind === "trial" && ap9.custom && ap9.custom.abId === "failureAB1"));
  for (const t9 of (s.trials || [])) {
    if (t9 && !t9.declined && t9.custom && t9.custom.abId === "failureAB1") { t9.declined = true; t9.retired = "2026-08-13"; }
  }
  if (!(s.feed || []).some((f9) => f9 && f9.t === "FAILURE EXPERIMENT RETIRED")) {
    /* FIX 3a item 5 — the receipt states THIS ledger's truth, not the spec's
       assumption: a stale device that approved and trained files the count. */
    let ran47 = 0;
    try {
      const tr47 = (s.trials || []).find((t9) => t9 && t9.custom && t9.custom.abId === "failureAB1" && t9.started);
      if (tr47) { for (const d47 of Object.keys(s.sessionLog || {})) { if (d47 >= tr47.started && ((s.sessionLog[d47] || {}).entries || []).some((e47) => e47 && (e47.id === "tricep" || e47.id === "sulek"))) ran47++; } }
    } catch (e47) {}
    s.feed.unshift({ d: "2026-08-13", t: "FAILURE EXPERIMENT RETIRED", how: ran47 === 0
      ? "Your call, before it began. The research default stands: train 1–2 reps shy; an occasional all-out last set keeps your effort reporting honest. No session ever ran under the experiment, so nothing is lost."
      : "Your call. " + ran47 + " session" + (ran47 === 1 ? "" : "s") + " ran under the experiment before retirement; those sessions stay on the record and count normally. The research default stands: train 1–2 reps shy; an occasional all-out last set keeps your effort reporting honest." });
  }
  s.v = 47; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11928-11957.
function patchV46(s) {
  /* THE DEDUPE (v7.52.0, Joe's ruling: "dedupe once"). The OLD runner replayed the
     whole chain on every bump, and each replay re-minted the feed entries some
     patches author — these three titles accumulated byte-identical copies on his
     live phone. One-time, content-exact removal: for EXACTLY these titles, drop
     entries that are JSON-equal to an earlier entry, keep the first occurrence.
     JSON-equal, not title-equal — two entries with the same title but different
     dates or bodies are different receipts and BOTH survive. Touches nothing else.
     Under the new runner this executes once and never again; it is also that
     runner's first live proof — a v45 state receives ONLY this patch. */
  const DUP_TITLES = ["RULING — SMALLEST HONEST INCREMENT", "RULING — SMALLEST STEP, EVERY LIFT", "VOLUME PROPOSALS RECALLED"];
  if (Array.isArray(s.feed)) {
    const seen = new Set();
    const kept = [];
    let removed = 0;
    for (const f of s.feed) {
      if (f && DUP_TITLES.includes(f.t)) {
        const key = JSON.stringify(f);
        if (seen.has(key)) { removed++; continue; }
        seen.add(key);
      }
      kept.push(f);
    }
    if (removed > 0) {
      s.feed = kept;
      s.feed.unshift({ d: "2026-08-12", t: "FEED DEDUPED — " + removed + " historical replay duplicate" + (removed === 1 ? "" : "s") + " removed", how: "The old migration runner replayed every patch on every schema bump, and each replay re-minted these receipts: " + DUP_TITLES.join(" · ") + ". Byte-identical copies are gone; the first of each stays. Nothing else was touched." });
    }
  }
  s.v = 46; return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11958-11971.
function patchV38(s) {
  /* v7.4.0 Slice 5 — the PHASE ARC lands its decisions in the already-hardened s.plan (a planned diet
     break + phase transitions). ADDITIVE + idempotent: default the append-only phase-transition LOG to
     empty so the keyed-union merge has a list to reconcile; the current-phase and current-break POLICY
     SCALARS (s.plan.phase / s.plan.brk) are left ABSENT by default — absent phase reads as the derived
     cut, absent brk reads as no break — so a fresh SEED === a migrated state and replaying the whole chain
     over a fresh seed is a no-op. No existing field is read for meaning or rewritten; no history can move.
     Registered in _unionPlan (phase/brk newest-deliberate-wins, phaseLog keyed-union) so a stale device can
     neither REVERT nor LOSE a phase decision; rollback-safety (v>SCHEMA_V untouched) is preserved by migrate. */
  s.plan = (s.plan && typeof s.plan === "object") ? s.plan : { goals: [], ifthen: [], share: false, autonomy: "propose" };
  if (!Array.isArray(s.plan.phaseLog)) s.plan.phaseLog = [];
  s.v = 38;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:11983-11983.
const PATCHES = [[4, patchV4], [5, patchV5], [6, patchV6], [7, patchV7], [8, patchV8], [9, patchV9], [10, patchV10], [11, patchV11], [12, patchV12], [13, patchV13], [14, patchV14], [15, patchV15], [16, patchV16], [17, patchV17], [18, patchV18], [19, patchV19], [20, patchV20], [21, patchV21], [22, patchV22], [23, patchV23], [24, patchV24], [25, patchV25], [26, patchV26], [27, patchV27], [28, patchV28], [29, patchV29], [30, patchV30], [31, patchV31], [32, patchV32], [33, patchV33], [34, patchV34], [35, patchV35], [36, patchV36], [37, patchV37], [38, patchV38], [39, patchV39], [40, patchV40], [41, patchV41], [42, patchV42], [43, patchV43], [44, patchV44], [45, patchV45], [46, patchV46], [47, patchV47], [48, patchV48], [49, patchV49], [50, patchV50], [51, patchV51], [52, patchV52], [53, patchV53], [54, patchV54], [55, patchV55], [56, patchV56], [57, patchV57], [58, patchV58], [59, patchV59], [60, patchV60]];

// Copied from frozen src/app.jsx @ fe516c1:12001-12044.
function reconcileLiftCaches(s) {
  let healed = 0;
  for (const ex of ((s && s.exercises) || [])) {
    if (!ex) continue;
    const lm0 = ex.lastMeta;
    /* MAXED-LADDER FIX ROUND — THE SAME-LOAD NULL IS A STALE CACHE, NEVER A RESEED.
       patchV24 nulled hack.last unguarded, and migrate() replays every patch on every
       schema bump — so each bump re-erased the banked 11·11·10 and the card regressed to
       the hi-2 fill (the 02:15 photograph's TRUE mechanism; the hi-clamp was the second
       one). The weight editor and RESET both change w BEFORE nulling, so a deliberate
       reseed always carries lastMeta.w ≠ w and survives untouched. This runs after the
       patch reduce, so it self-heals after ANY future replay — a restatement of the log,
       lawful under the migration law. */
    /* numeric loads only: on a string-load lift ("hold", per-set strings) the load lives
       OUTSIDE the field, so lastMeta.w equality proves nothing about staleness — the v24
       ruling's own deliberate null had "hold" === "hold". Where w is a number, a same-load
       null is definitionally stale: every deliberate reseed changes w first. */
    /* v7.53.7 FIX A — SAME-LOAD IS JUDGED BY THE LOG, NOT BY THE CACHE'S OWN
       CLAIM. This sweep runs BEFORE reconcileCorrectedLoads, so it used to
       read a lie before derive-first could correct it: executed at 6b633c7,
       a config set to 210 in the editor (newer wAt, last nulled for the
       reseed) beside a stale lastMeta claiming {8/14, w 210, reps [7,7,8]}
       matched "same load" against the CLAIM, refilled [7,7,8], and the card
       then prescribed the old load's reps at the new one — derive-first
       healed lastMeta a moment later, but last was live by then and followed
       the log. Leg 7's law was right and simply ran second. Now BOTH
       authorities read the same source, so exactly one answer is possible:
       the derived line decides whether this null is a stale cache or a
       deliberate reseed. (The pin on this branch has always SAID "healed
       from the log"; now it is literally true.) */
    if (typeof ex.w === "number" && ex.last == null) {
      const dm0 = deriveLastMeta(s, ex.id);
      if (dm0 && Array.isArray(dm0.reps) && dm0.reps.length && String(dm0.w) === String(ex.w)) { ex.last = dm0.reps.slice(); healed++; }
      continue;
    }
    if (!ex.last || !Array.isArray(ex.last)) continue;
    const lm = ex.lastMeta;
    if (!lm || !Array.isArray(lm.reps) || !lm.reps.length) continue;
    if (JSON.stringify(ex.last) === JSON.stringify(lm.reps)) continue;
    ex.last = lm.reps.slice();
    healed++;
  }
  return healed;
}

// Copied from frozen src/app.jsx @ fe516c1:12057-12068.
function ensureLoadOnLadder(ex) {
  try {
    if (!ex || typeof ex.w !== "number") return ex;
    const r9 = loadRungs(ex);
    if (!r9 || r9.indexOf(ex.w) > -1) return ex;
    const steps9 = [...new Set([...r9, ex.w])].sort((a9, b9) => a9 - b9);
    /* the ladder now carries a rung the load's own stamp vouches for, so the
       ladder is at least as recent as the load: max(stepsAt, wAt). */
    const later9 = String(ex.stepsAt || "") > String(ex.wAt || "") ? ex.stepsAt : ex.wAt;
    return later9 == null ? { ...ex, steps: steps9 } : { ...ex, steps: steps9, stepsAt: later9 };
  } catch (e) { return ex; }
}

// Copied from frozen src/app.jsx @ fe516c1:12099-12214.
function reconcileCorrectedLoads(s) {
  let filed9 = false;
  try {
    const log = (s && s.sessionLog) || {};
    for (const ex of ((s && s.exercises) || [])) {
      if (!ex || typeof ex.w !== "number") continue;                    /* "BW" and other configs have no load to reconcile */
      /* v7.53.5 leg 6 — TRUTH FIRST; then everything reads the truth. The
         sweep let the CACHE choose the date: it healed a stale lastMeta and
         then kept adjudicating on the PRE-HEAL entry. Executed at 42f429c,
         both shapes: a newer Aug-15 session (210) was dragged BACKWARD to the
         stamped Aug-14 amendment's 200 with a receipt calling it
         reconciliation — and in the mismatch shape the heal DID re-derive the
         cache to Aug-15 @ 210 while the adoption still used the old entry,
         leaving the state self-contradictory (cache 8/15 @ 210 beside config
         200). The match shape is the deeper defect: a stale cache date
         bypasses the newest session with no heal involved at all. So the log
         is derived FIRST and the derived date is THE date; the cache never
         chooses the entry again. THE DOCTRINE: an amendment governs the plan
         only while the amended session is still the lift's newest word — a
         newer session already spoke for itself (the CAGE handled it at
         completion), so an older stamped correction is history, not
         authority. */
      const dm = deriveLastMeta(s, ex.id);
      if (!dm) continue;                                                /* no logged line with reps — nothing to reconcile against */
      /* CACHE HONESTY — unconditional-VERIFIED now, not mismatch-triggered.
         lastMeta is a DENORMALISED COPY of the log; when it disagrees with
         what the log derives it is stale or foreign, and it must not survive
         the boot — every downstream reader (progressStep, the anchor, the
         debrief) reads the cache, not the log. Silent by design (it restates
         the record, which the migration law permits without a receipt) and
         deterministic: derived from the log, so a replayed migrate lands the
         same bytes. */
      /* leg 7 — THE HEAL OWNS lastMeta; ex.last FOLLOWS THE SAME-LOAD LAW.
         Leg 6 wrote ex.last unconditionally and defeated the app's own reseed
         law: a null last is a DECISION — the weight editor Save, RESET and
         the CAGE all null it on a load change so targets reseed at the new
         load. Executed at 8c70af8: an editor-set 210 (newer wAt, last null)
         booted, the sweep resurrected last from the 8/14 line, and the card
         prescribed the OLD load's reps at the new load — the reseed silently
         defeated, no receipt. reconcileLiftCaches already states the law: a
         deliberate reseed always changes w BEFORE nulling, so a null last
         beside a derived line at the SAME load is definitionally stale and
         refills — while A NULL last AT A LOAD THE LOG DOES NOT DESCRIBE IS A
         DECISION, NOT A GAP, and it is preserved. */
      if (JSON.stringify(ex.lastMeta) !== JSON.stringify(dm)) ex.lastMeta = dm;             /* the cache must describe the log — unconditional */
      if (ex.last != null) { if (JSON.stringify(ex.last) !== JSON.stringify(dm.reps)) ex.last = dm.reps.slice(); }   /* a live cache follows the log — and it follows the HEALED lastMeta, which is why this is not the same statement reconcileLiftCaches ran */
      /* leg 9 — THE NULL-REFILL LIVES IN EXACTLY ONE PLACE, AND IT IS NOT HERE.
         A same-load refill also stood here, byte-identical in effect to
         reconcileLiftCaches' branch, which runs FIRST on every boundary with
         the same inputs and the same numeric-w gate — so it could never fire.
         Two copies of one rule is how the rule drifts: the leg-9 audit found
         the pair shadowing each other so completely that deleting either one
         alone left the whole suite green. The reseed decision now has one
         author, and it reads the log. */
      const rec = log[dm.d];
      /* FIX 1 (leg 3) — THE GATE KEYS ON PER-ENTRY LOAD PROVENANCE, not the
         session stamp. A session's corr is written by ✕ and ↩ too, which
         change no load at all — so (executed) a deliberate editor set of hack
         200 -> 190 at 09:00 followed by an UNRELATED un-skip at 10:00 made the
         sweep re-adopt 200 over the athlete's own word, with a receipt claiming
         the record said so. The session corr stays exactly what it is —
         CORRECTION_MERGE ordering for the RECORD — and is no longer adoption
         authority. Only an amendment that changed THIS ENTRY'S LOAD stamps
         wCorrAt, so a skip-correction can never trigger an adoption again.
         THE RITUAL, permanently: any future data patch that changes an entry's
         w MUST stamp that entry's wCorrAt (see patchV54). */
      const enC = rec && Array.isArray(rec.entries) ? rec.entries.find((e9) => e9 && e9.id === ex.id) : null;
      if (!enC || typeof enC.w !== "number") continue;                  /* the derived line exists here by construction; a non-numeric entry has no load to adopt */
      const at = typeof enC.wCorrAt === "string" && isFinite(Date.parse(enC.wCorrAt)) ? enC.wCorrAt : null;
      if (!at) continue;                                                /* only a LOAD-corrected entry may lead the plan */
      /* v7.53.5 — THE AUTHORITY'S VALUE IS THE AUTHORITY. The sweep verified
         the ENTRY'S stamp and then adopted the CACHE'S number: executed at the
         shipped tip, a stamped 200 entry beside a lastMeta of 210 moved the
         config to 210 and filed "190 → 210" — the stamp vouched for 200, the
         plan took 210, and the receipt said something untrue. The comparison
         and the adoption both read the entry the stamp actually covers.
         (Cowork could not reach the completing shape through the shipped
         mergeState in two attempts; this round has already produced four
         "unreachable" shapes that were later reached, so it ships on the
         mechanism. The live ledger was inspected and is clean — hardening,
         not remediation.) */
      if (enC.w === ex.w) continue;                                     /* the equality guard IS the idempotence guard, now against the ENTRY */
      if (!(at > String(ex.wAt || ""))) continue;                       /* absent wAt reads as the epoch and loses; a newer athlete edit wins */
      const from = ex.w;
      const rungs = loadRungs(ex);
      /* FIX 2 (leg 3) — THE STAMP NEVER MOVES BACKWARD. Writing the correction's
         at unconditionally RESTAMPED a newer athlete ladder with an older date
         (executed: an Aug-15 15:00 ladder restamped to Aug-14 21:57, after which
         an OLDER 220-rung replica beat his own newer decision in the merge).
         max(existing, at) — still a pure function of state, so migrate-twice
         stays byte-identical. */
      if (rungs) { ex.steps = [...new Set([...rungs, enC.w])].sort((a9, b9) => a9 - b9); ex.stepsAt = String(ex.stepsAt || "") > at ? ex.stepsAt : at; }   /* merge, never erase — the ladder law */
      ex.w = enC.w; ex.wAt = at;                                        /* every w-writer stamps, and this one stamps deterministically */
      ex.last = null;                                                   /* leg 7 — the load MOVED: the same event class as the editor Save and the CAGE, so the same consequence — the corrected load reseeds. The NEXT boot's same-load rule refills from the log, which at the adopted load is the honest anchor. */
      if (ex.topAt != null || (ex.topRun || 0) !== 0) { ex.topAt = null; ex.topRun = 0; }   /* a new load starts its own sighting record — but only WRITE when there is a sighting to clear. Writing null/0 over absent keys is semantically identical and merge-visibly different: topAt/topRun are unstamped, so they ride whichever whole record wins, and manufacturing them made the two merge orders differ on a lift that had never banked a sighting. Deep order-equality is the stronger claim; this is what makes it true. */
      if (!Array.isArray(s.feed)) s.feed = [];
      const op = "adopt:corr:" + ex.id + ":" + dm.d;
      if (!s.feed.some((f9) => f9 && f9.op === op)) { filed9 = true; s.feed.unshift({ op, d: dm.d, t: "WORKING LOAD RECONCILED — " + String(ex.n || ex.id).toUpperCase() + " " + from + " → " + enC.w, how: "The corrected record says " + enC.w + " was lifted on " + dm.d + "; the plan follows the record." + (rungs ? " The rung joined the ladder." : "") }); }   /* the receipt names the STAMPED value — receipt truth is the law this defect broke */
    }
    /* v7.54.1 — AND THE FEED KEEPS THE ORDER THE MERGE GIVES IT. Receipts are
       unshifted as they are filed, but mergeState sorts the feed by date; so a
       boot that files a receipt left the feed in a shape the NEXT merge would
       reorder, and merge-then-settle stopped being a fixed point at the first
       depth (measured: stable at depth 1 before this round's accumulating base
       made a second adoption reachable, stable only at depth 2 after). Applying
       the merge's own stable sort here costs nothing when nothing was filed and
       keeps the two paths agreeing. */
    if (filed9 && Array.isArray(s.feed)) s.feed = _feedSorted(s.feed);
    /* FIX 3 — every lift self-heals at the boundary, adopted or not: a hybrid
       that a past merge already wrote into the state is repaired the next time
       it is loaded, not left for a future snapper to trip over. */
    const exs9 = (s && s.exercises) || [];
    for (let i9 = 0; i9 < exs9.length; i9++) exs9[i9] = ensureLoadOnLadder(exs9[i9]);
  } catch (e) {}
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:12222-12262.
function _settleExit(st) {
  reconcileLiftCaches(st); reconcileCorrectedLoads(st);
  reconcileEraTransitions(normalizePlan(st));
  if (!Array.isArray(st.suggestionLog)) st.suggestionLog = [];
  /* SCALE-7 (Sol's pass 5, P1) — recover the single-writer legacy order HERE, at the
     boot exit, before any sort ever runs on the stored arrays: every production row
     predating the stamped writers was appended in decision order, so storage position
     at first boot IS the recoverable causal order. Minted once, idempotently, and only
     here — the merge path's arrival order depends on direction, so a mint there would
     break byte convergence (a raw pin-state merged without booting simply keeps the
     old deterministic sid/rid tie until its first boot). */
  st.suggestionLog.forEach((x, i) => { if (x && typeof x === "object" && !Array.isArray(x) && !x.at && x.ord == null) x.ord = String(i).padStart(4, "0"); });
  if (Array.isArray(st.adjustments)) st.adjustments.forEach((a, i) => { if (a && typeof a === "object" && !Array.isArray(a) && a.ord == null) a.ord = String(i).padStart(4, "0"); });   /* SCALE-9 (Sol's pass 7) — EVERY row gets its storage rank, not just the no-instant ones: a mixed day must order all of its rows on ONE scale, so the rank has to exist on the instant-bearing rows too (SCALE-8 minted only where _adjInstant was null, which is what left the ladder). Padded, so position 10 never sorts before 9. */
  /* the merge's own canonical shapes, mirrored at boot: every fork carries its ops
     identity (the why has always MEANT the operation — the fork union restates it the
     same way), and the plan carries the per-field stamp map and revision the plan union
     always emits. Without these a boot differed from its own self-merge in bytes that
     no reconciler owned. */
  for (const e9 of (Array.isArray(st.exercises) ? st.exercises : [])) {
    if (!e9 || !Array.isArray(e9.forks)) continue;
    e9.forks = e9.forks.map((f9) => {
      if (!f9) return f9;
      /* the fork union's OWN math, not a paraphrase (Sol's pass-3 witness: an imported
         fork with ops ["z","a"] booted unchanged, then the first self-merge sorted the
         set and rewrote why — boot and merge must run the same restatement) */
      const ops9 = [...new Set(Array.isArray(f9.ops) && f9.ops.length ? f9.ops.map(String) : (f9.why ? [String(f9.why)] : []))].sort();
      const why9 = ops9.length > 1 ? ops9.join(" + ") : (f9.why != null ? f9.why : ops9[0]);
      return { from: f9.from, why: why9, ...(ops9.length ? { ops: ops9 } : {}), prevN: f9.prevN, ...(f9.kind ? { kind: f9.kind } : {}), ...(f9.split ? { split: true } : {}) };   /* C1 (PROGRESSION-1) — the restatement must carry the fork KIND: it is the first-class classifier now, and rebuilding a fork from a fixed key set silently dropped it. split still carries the back-compat reading, so this was benign today and fragile tomorrow. */
    });
  }
  if (st.plan && typeof st.plan === "object") {
    const set9 = { ...((st.plan.setAt && typeof st.plan.setAt === "object") ? st.plan.setAt : {}) };
    for (const f9 of PLAN_POLICY_SCALARS) set9[f9] = set9[f9] || "";
    st.plan.setAt = set9;
    st.plan.rev = +st.plan.rev || 0;
  }
  reconcileTrendChain(st); reconcileReadReceipts(st); reconcileSuggestionEffects(st); reconcileSightings(st); reconcileDebutQueue(st);   /* A6 — the sighting record derives at the BOOT exit; FIX-4 §6 — and one graduation keeps one active debut */
  if (Array.isArray(st.feed)) st.feed = _feedSorted(st.feed);
  st.suggestionLog = _sugSorted(st.suggestionLog);
  return st;
}

// Copied from frozen src/app.jsx @ fe516c1:12263-12311.
function migrate(old) {
  /* RB-6 — the one-line container heal: a malformed store missing a container must
     not crash the chain; the arrays it holds stay exactly as found. */
  if (old && typeof old === "object") { old.sleep = old.sleep || { nights: [], needed: 3 }; old.sleep.nights = old.sleep.nights || []; old.dailyLogs = old.dailyLogs || {}; old.sessionLog = old.sessionLog || {}; old.reads = old.reads || []; }
  if (old && old.v === SCHEMA_V) { return _settleExit(old); }   /* R5 fix-4: the SAME-SCHEMA entry boundary normalizes too — this fast path IS the import path (doImport = migrate(parse) -> save), and a poisoned planGen-51 backup used to render and persist verbatim until the next sweep. Idempotent; the ruled-order half stands down at planGen 52. */
  /* A state NEWER than this build — he upgraded, then the app was rolled back.
     Hand it back untouched: no patch here understands schema n+1, and the only
     other exit below is a fresh SEED, which would wipe every read, night,
     dailyLog, session and queue item and then sync the wipe up. Some instruments
     may read oddly on fields this code does not know; re-upgrading restores full
     function. A visible misbehaviour is recoverable — a wipe is not. */
  if (old && old.v > SCHEMA_V) return old;
  if (old && old.v >= 3 && old.v < SCHEMA_V) { return _settleExit(PATCHES.filter(([n]) => n > old.v).reduce((s, [, p]) => p(s), JSON.parse(JSON.stringify(old)))); }   /* FIX-15 — A BOOT ENDS WITH THE FEED IN ITS ONE ORDER. A patch unshifts its receipt at the head regardless of date (patchV55's 8/09 re-strike line landed above 8/17 seams on the branch's own v54 ledger copy — CC's leg-15 finding), and the next sync would move it: the boot was not a fixed point of the merge. Same sort, last, both exits. */
  const s = JSON.parse(JSON.stringify(SEED));
  /* SCALE-5 (Sol's pass 3, row 2) — the FOURTH exit. loadState's fresh install and the
     reset both land here (migrate(null) → raw SEED), and the raw seed was not a fixed
     point of its first self-merge: fork ops, plan stamps, suggestionLog and targets all
     moved. Every reachable exit settles — this one too. */
  if (!old || (old.v !== 1 && old.v !== 2)) return _settleExit(s);
  ["feed", "sessionLog", "events", "boosts", "thesisConfirms", "lastThesisWk", "zeroComp", "fixWindow"].forEach((k) => { if (old[k] !== undefined) s[k] = old[k]; });
  (old.reads || []).forEach((r) => { if (!s.reads.some((x) => x.d === r.d)) s.reads.push(r); });
  s.reads.sort((a, b) => (a.d < b.d ? -1 : 1));
  s.reads.filter((r) => !r.sealed && !r.offWindow && r.d > "2026-07-21").forEach((r) => { const dCl = Math.max(-1.5, Math.min(1.5, r.w - s.trend)); s.trend = +(s.trend + 0.3 * dCl).toFixed(1); });
  ((old.sleep && old.sleep.nights) || []).forEach((n) => { if (!s.sleep.nights.some((x) => x.d === n.d)) s.sleep.nights.push(n); });
  s.sleep.nights.sort((a, b) => (a.d < b.d ? -1 : 1));
  Object.entries(old.dailyLogs || {}).forEach(([d, v]) => { s.dailyLogs[d] = v; });
  if (old.v === 2) {
    if (old.exercises) s.exercises = old.exercises;
    if (old.queue) s.queue = old.queue;
    if (old.proposals) s.proposals = old.proposals;
    if (old.adjustments) s.adjustments = old.adjustments;
    if (old.phase) s.phase = old.phase;
  }
  if (old.v === 1 && old.queue) old.queue.filter((q) => q.done).forEach((oq) => {
    if (oq.id === "rows180") { const e = exById(s, "rows"); e.w = 180; s.queue.find((x) => x.id === "q_rows180").done = true; }
    if (oq.id === "press245") { const e = exById(s, "press"); e.own = false; e.std = null; s.queue.find((x) => x.id === "q_press_own").done = true; }
    if (oq.id === "hack3") { const e = exById(s, "hack"); e.pendingThird = false; e.sets = 3; e.setsAt = clock.nowISO(); s.queue.find((x) => x.id === "q_hack3").done = true; }
    if (oq.id === "abs100") { s.queue.find((x) => x.id === "q_abs").done = true; }
    if (oq.id === "calf315") { const e = exById(s, "calves"); e.reclaim = null; s.queue.find((x) => x.id === "q_calves").done = true; }
    if (oq.id === "ext150") { const e = exById(s, "extension"); e.own = false; e.std = null; s.queue.find((x) => x.id === "q_ext").done = true; }
    if (oq.id === "dexa") { s.queue.find((x) => x.id === "q_dexa").state = "BOOKED"; }
  });
  const s2 = PATCHES.reduce((acc, [, p]) => p(acc), s);
  /* SCALE-4 (Sol's pass 2, row 2) — EVERY migrate exit settles the same way. This v1/v2
     exit ran the patch chain but skipped the three reconcilers the other two exits run,
     so a legacy state could boot carrying a receipt its first self-merge would rewrite —
     the boot was not a fixed point of the merge. Same settle, all three exits. */
  return _settleExit(s2);   /* v1/v2 only: a legacy state predates every patch, so the full chain over a fresh seed is correct here — this is also why idempotency stays demanded */
}

// Copied from frozen src/app.jsx @ fe516c1:13233-13241.
function isPristineSeed(s) {
  try {
    const same = (a, b) => (a || []).length === (b || []).length;
    return same(s.reads, SEED.reads) && same(s.sleep.nights, SEED.sleep.nights)
      && Object.keys(s.dailyLogs || {}).length === Object.keys(SEED.dailyLogs || {}).length
      && Object.keys(s.sessionLog || {}).length === Object.keys(SEED.sessionLog || {}).length
      && ((s.reads || [])[ (s.reads || []).length - 1] || {}).d === ((SEED.reads || [])[(SEED.reads || []).length - 1] || {}).d;
  } catch (e) { return false; }
}

// Copied from frozen src/app.jsx @ fe516c1:13289-13327.
function recordCounts(st) {
  if (!st || typeof st !== "object") return null;
  const arr = (x) => (Array.isArray(x) ? x.length : 0);
  const keys = (x) => (x && typeof x === "object" ? Object.keys(x).length : 0);
  return {
    reads: (Array.isArray(st.reads) ? new Set(st.reads.filter((r9) => r9 && r9.d != null).map((r9) => String(r9.d))).size : 0),   /* SCALE-6 — one read per day is the app's own law, so the guard counts DAYS: the settle's date-fold (an import carrying two bodies for one date collapses to the merge's pick) is tidying, not loss; deleting a whole day still refuses */
    nights: arr(st.sleep && st.sleep.nights),
    dailyLogs: keys(st.dailyLogs),
    sessionLog: keys(st.sessionLog),
    waist: arr(st.waist),
    photos: arr(st.photos),
    /* v7.55.2 stopped the guard counting machine receipts (patchV59's sweep read as data
       loss and the app refused its own migration — v7.55.x could not reach his phone).
       v7.55.3 (Sol's pass 2, new rows 1 + 3) refines WHAT counts, three classes:
       - FULLY DERIVED lines (_isFeedDerived: carve/adoptshift/lateread/sug ops, the
         set-aside and analyst-suggestion receipts, a patch59 receipt whose marked reads
         are present) — excluded: a reconciler recreates every warranted one from the
         store it describes, so their count is not history.
       - MISSED/GAP summaries — NOT counted here (their priced bodies cannot be
         re-derived), guarded instead by dataLossGuard's missed-day clause below: the
         DAY keeps its line unless a clean read disproves it.
       - PERMANENT lines: op-keyed ones count as DISTINCT OPS (the merge legitimately
         collapses two bodies for one op to one line — a logical record, not a loss:
         pass-2 new row 3 had that dedup refused as "feed 11→10"); op-less athlete
         lines keep raw multiplicity. */
    feed: (() => { if (!Array.isArray(st.feed)) return 0; let n9 = 0;
      for (const f9 of st.feed) {
        if (!f9 || _isFeedDerived(f9, st)) continue;
        if (typeof f9.t === "string" && (f9.t.indexOf("MORNING READ MISSED") === 0 || f9.t.indexOf("READ GAP") === 0)) continue;
        if (typeof f9.op === "string" && f9.op) continue;   /* op-keyed lines are guarded by PRESENCE (the feedop clause in dataLossGuard), not by count: their derived-ness is state-dependent (an old client can strip the marks that make a receipt derivable), so a count that mixes classes flips when the classification does */
        n9++;
      }
      return n9; })(),
    adjustments: arr(st.adjustments),   // v7.2.0 audit — the Auto-Pilot decision log is load-bearing (track record + undo + once/day guard) and only grows; guard it like the other append-only records so a shrink can't be silent
    learnedTdee: arr(st.learned && st.learned.tdee),      // v7.3.0 Slice 4 — the learned TDEE drift series only grows; a stale device must not shrink it
    learnedAnchors: arr(st.learned && st.learned.anchors), // v7.3.0 Slice 4 — DEXA anchor history only grows; guard it too
    corrections: Object.values((st.sessionLog && typeof st.sessionLog === "object") ? st.sessionLog : {}).reduce((n9, r9) => n9 + ((r9 && Array.isArray(r9.corrLog)) ? r9.corrLog.length : 0), 0),   // v7.54.1 — the correction ledger is APPEND-ONLY and was protected by nothing: every corrLog entry in his state could be deleted and dataLossGuard still returned {safe:true,lost:[]}, because it counts sessionLog DATES and never looks inside a record. A promise no guard enforces is a comment.
  };
}

// Copied from frozen src/app.jsx @ fe516c1:13328-13361.
function dataLossGuard(prev, next) {
  const a = recordCounts(prev);
  if (!a) return { safe: true, lost: [] };            // nothing to protect yet
  const b = recordCounts(next);
  if (!b) return { safe: false, lost: ["state"] };    // never write a non-object over data
  const lost = [];
  for (const k of Object.keys(a)) if (b[k] < a[k]) lost.push(`${k} ${a[k]}→${b[k]}`);
  /* SCALE-4 — THE MISSED-DAY CLAUSE (Sol's pass 2, new row 1). The summaries' bodies
     cannot be re-derived, so they left the count above — but that made them silently
     deletable: on the live ledger the warranted 8/07 MORNING READ MISSED could be
     removed, the guard said safe, and no reconciler brought it back. A count cannot see
     a warrant, so this clause reads both states: a day carrying a missed/gap line in
     prev must either still carry one in next, or carry the clean read that disproves it.
     Healing stays free (the disproof IS the clean read); deletion is named and refused. */
  /* SCALE-4 — THE FEEDOP CLAUSE. An op-keyed permanent line is a LOGICAL record: the
     merge may legitimately collapse two bodies for one op (pass-2 new row 3 had that
     refused as a count shrink), and a receipt's derived-ness can flip when an old client
     strips the marks it derives from — so op-keyed history is guarded by PRESENCE: every
     op a non-derived line carries in prev must still name SOME line in next. */
  const prevOps9 = new Set();
  for (const f9 of ((prev && Array.isArray(prev.feed)) ? prev.feed : [])) {
    if (!f9 || typeof f9.op !== "string" || !f9.op || _isFeedDerived(f9, prev)) continue;
    if (typeof f9.t === "string" && (f9.t.indexOf("MORNING READ MISSED") === 0 || f9.t.indexOf("READ GAP") === 0)) continue;
    prevOps9.add(f9.op);
  }
  const nextOps9 = new Set();
  for (const f9 of ((next && Array.isArray(next.feed)) ? next.feed : [])) if (f9 && typeof f9.op === "string" && f9.op) nextOps9.add(f9.op);
  for (const op9 of prevOps9) if (!nextOps9.has(op9)) lost.push(`feedop ${op9}`);
  const _missD9 = (st) => { const m9 = new Set(); for (const f9 of ((st && Array.isArray(st.feed)) ? st.feed : [])) if (f9 && typeof f9.t === "string" && (f9.t.indexOf("MORNING READ MISSED") === 0 || f9.t.indexOf("READ GAP") === 0)) m9.add(String(f9.d)); return m9; };
  const nextMiss9 = _missD9(next);
  const nextClean9 = new Set(); for (const r9 of ((next && Array.isArray(next.reads)) ? next.reads : [])) if (r9 && r9.d && !r9.offWindow) nextClean9.add(String(r9.d));   /* SCALE-5 — sealed included: the read happened */
  for (const d9 of _missD9(prev)) if (!nextMiss9.has(d9) && !nextClean9.has(d9)) lost.push(`missedday ${d9}`);
  return { safe: lost.length === 0, lost };
}

// Copied from frozen src/app.jsx @ fe516c1:13378-13378.
const _readRank9 = (r) => (r && r.sealed ? 1 : r && r.offWindow ? 0 : 2);

// Copied from frozen src/app.jsx @ fe516c1:13379-13385.
const _readPick = (a, b) => {
  const ra = _readRank9(a), rb = _readRank9(b);
  if (ra !== rb) return ra > rb ? a : b;
  const la = JSON.stringify(a).length, lb = JSON.stringify(b).length;
  if (la !== lb) return la > lb ? a : b;
  return _canonJ(a) <= _canonJ(b) ? a : b;
};

// Copied from frozen src/app.jsx @ fe516c1:13422-13426.
function _stampCorr(rec) {
  const prev = rec && rec.corr && typeof rec.corr === "object" ? rec.corr : null;
  rec.corr = { at: clock.nowISO(), rev: (prev && isFinite(+prev.rev) ? +prev.rev : 0) + 1 };
  return rec;
}

// Copied from frozen src/app.jsx @ fe516c1:13504-13504.
const CORR_KINDS = ["skip", "unskip", "strike", "amend"];

// Copied from frozen src/app.jsx @ fe516c1:13514-13560.
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

// Copied from frozen src/app.jsx @ fe516c1:13590-13593.
function _canonJ(v) {
  const c9 = (x) => { if (Array.isArray(x)) return x.map(c9); if (x && typeof x === "object") { const o = {}; for (const k of Object.keys(x).sort()) o[k] = c9(x[k]); return o; } return x; };
  try { return JSON.stringify(c9(v)); } catch (e) { return ""; }
}

// Copied from frozen src/app.jsx @ fe516c1:13913-13913.
function _adjRank(a) { return ((a && a.undone) ? "2" : (a && a.dismissed) ? "1" : "0") + "|" + _canonJ(a); }

// Copied from frozen src/app.jsx @ fe516c1:13920-13925.
function _adjInstant(x) {
  if (x && x.at) { const t7 = Date.parse(x.at); if (isFinite(t7)) return t7; }
  const m7 = x && x.id ? /^adj_([0-9a-z]{8})/.exec(String(x.id)) : null;
  if (m7) { const t7 = parseInt(m7[1], 36); if (t7 >= 1e12 && t7 < 4e12) return t7; }
  return null;
}

// Copied from frozen src/app.jsx @ fe516c1:13926-13926.
function _sugRank(x) { const d9 = String((x && x.d) || "").replace(/-/g, ""); return (/^\d{8}$/.test(d9) ? String(99999999 - +d9).padStart(8, "0") : "00000000") + "|" + (x && x.undone ? "1" : "0") + "|" + (x && x.orphan ? "0" : "1") + "|" + _canonJ(x); }

// Copied from frozen src/app.jsx @ fe516c1:13927-13942.
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

// Copied from frozen src/app.jsx @ fe516c1:14133-14140.
function _isFeedDerived(f, st) {
  if (!f) return false;
  if (typeof f.op === "string" && (f.op.indexOf("carve:") === 0 || f.op.indexOf("adoptshift:") === 0 || f.op.indexOf("lateread:") === 0 || f.op.indexOf("sug:") === 0 || f.op.indexOf("seam:") === 0)) return true;   /* C2 (PROGRESSION-1) — the insertion seam line is a PROJECTION: deriveInsertionSeams removes and re-derives it from the plan marker, the pair table and actual exposure at every boundary, so counting it as history made the guard refuse the very correction the round ships (the same lesson the read receipts taught at SCALE-3) */
  if (f.t === "EVENING READ — SET ASIDE" || f.t === "LATE READ — SET ASIDE") return true;
  if (f.t === "ANALYST SUGGESTION APPLIED" || f.t === "ANALYST SUGGESTION DISMISSED" || f.t === "ANALYST SUGGESTION NOTED" || f.t === "ANALYST SUGGESTION UNDONE") return true;
  if (f.op === "patch59:scale" && st && ((Array.isArray(st.reclassLog) && st.reclassLog.length) || (Array.isArray(st.reads) && st.reads.some((r) => r && r.reclassed)))) return true;   /* SCALE-5 — the attestation store is the authority; the legacy flag test stays for in-flight states */
  return false;
}

// Copied from frozen src/app.jsx @ fe516c1:14180-14183.
function _feedSorted(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map((x, i) => [x, i]).sort((a, b) => String((b[0] || {}).d || "").localeCompare(String((a[0] || {}).d || "")) || a[1] - b[1]).map((p) => p[0]);
}

// Copied from frozen src/app.jsx @ fe516c1:14189-14211.
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

return { _freshId, _mintJointEarn, reconcileSightings, reconcileDebutQueue, reconcileEraTransitions, earnWalk, reconcileReadReceipts, reconcileTrendChain, reconcileSuggestionEffects, anchorDexa, patchV4, patchV5, patchV6, patchV7, patchV8, patchV9, patchV10, patchV31, patchV32, patchV33, patchV34, patchV30, patchV29, patchV28, patchV27, patchV26, patchV25, patchV24, patchV23, patchV22, patchV21, patchV20, patchV19, patchV18, patchV17, patchV16, patchV15, patchV14, patchV13, patchV12, patchV11, patchV35, _hashId, patchV36, patchV37, patchV39, patchV40, patchV41, patchV42, patchV43, patchV44, patchV45, KNOWN_CORR, _fileKnownCorr, SCALE1_RECLASS, patchV59, patchV60, patchV58, patchV57, patchV56, patchV55, patchV54, patchV53, patchV52, patchV51, patchV50, patchV49, patchV48, patchV47, patchV46, patchV38, PATCHES, reconcileLiftCaches, ensureLoadOnLadder, reconcileCorrectedLoads, _settleExit, migrate, isPristineSeed, recordCounts, dataLossGuard, _readRank9, _readPick, _stampCorr, CORR_KINDS, _fileCorr, _canonJ, _adjRank, _adjInstant, _sugRank, _unionKeyed, _isFeedDerived, _feedSorted, _sugSorted };
};
