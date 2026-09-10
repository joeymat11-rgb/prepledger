"use strict";

// One canonical, data-free implementation; callers supply state and earned day.
module.exports = function createEarn(E) {
const loadRungs = (...args) => E.loadRungs(...args);
const nextLoad = (...args) => E.nextLoad(...args);
const typicalError = (...args) => E.typicalError(...args);
const beatsNoise = (...args) => E.beatsNoise(...args);

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

return { earnWalk };
};
