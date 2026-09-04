'use strict';

// Frozen v7.56.0 readers; cyclic calls and memo caches belong to this engine.
module.exports = function createToday(E, { clock, ids }) {
const { AUTONOMY_META, DAY, DEFICIT_CEILING, NOW_DOORS, SET_REALLOCATIONS } = E;
const _padFrom9 = (...args) => E._padFrom9(...args);
const apModeOf = (...args) => E.apModeOf(...args);
const atSleepTarget = (...args) => E.atSleepTarget(...args);
const autoPilot = (...args) => E.autoPilot(...args);
const autoPilotPolicy = (...args) => E.autoPilotPolicy(...args);
const autonomyOf = (...args) => E.autonomyOf(...args);
const bfEst = (...args) => E.bfEst(...args);
const cap = (...args) => E.cap(...args);
const currentRate = (...args) => E.currentRate(...args);
const cutRateBand = (...args) => E.cutRateBand(...args);
const dayType = (...args) => E.dayType(...args);
const daysUntil = (...args) => E.daysUntil(...args);
const debutDebit = (...args) => E.debutDebit(...args);
const energyBalanceTarget = (...args) => E.energyBalanceTarget(...args);
const eraFresh = (...args) => E.eraFresh(...args);
const escalation = (...args) => E.escalation(...args);
const exActive = (...args) => E.exActive(...args);
const exById = (...args) => E.exById(...args);
const fmtShort = (...args) => E.fmtShort(...args);
const isoOf = (...args) => E.isoOf(...args);
const loadRungs = (...args) => E.loadRungs(...args);
const memoOnState = (...args) => E.memoOnState(...args);
const mk = (...args) => E.mk(...args);
const nextLoad = (...args) => E.nextLoad(...args);
const owedNights = (...args) => E.owedNights(...args);
const paceProjection = (...args) => E.paceProjection(...args);
const progressStep = (...args) => E.progressStep(...args);
const progressionTrend = (...args) => E.progressionTrend(...args);
const proteinHit = (...args) => E.proteinHit(...args);
const proteinTarget = (...args) => E.proteinTarget(...args);
const readRecency = (...args) => E.readRecency(...args);
const readWindow = (...args) => E.readWindow(...args);
const safeCrossing = (...args) => E.safeCrossing(...args);
const signalReadCopy = (...args) => E.signalReadCopy(...args);
const signalState = (...args) => E.signalState(...args);
const stepTarget = (...args) => E.stepTarget(...args);
const structuralMovesThisWeek = (...args) => E.structuralMovesThisWeek(...args);
const targetsFor = (...args) => E.targetsFor(...args);
const todayStart = (...args) => E.todayStart(...args);
const typicalError = (...args) => E.typicalError(...args);
const weekDay = (...args) => E.weekDay(...args);
const weightNoise = (...args) => E.weightNoise(...args);
const windowFor = (...args) => E.windowFor(...args);

// Copied from frozen src/app.jsx @ fe516c1:1471-1478.
function pickStructural(s, iso, slp) {
  const dt = dayType(iso, s);
  const candidates = s.queue.filter((q) => !q.done && q.state !== "PROPOSED" && (q.kind === "debut" || q.kind === "unlock") && q.exId && exActive(s, q.exId) && exById(s, q.exId) && exById(s, q.exId).day === dt);   /* FIX split-1 (P1-1): a retired lift wins no structural slot */
  const passes = candidates.filter((q) => !(q.exId === "hack" && slp.last && slp.last.h < 4.5));
  const main = passes.find((q) => !q.coApproved) || null;
  const riders = passes.filter((q) => q.coApproved && q !== main);
  return { main, riders, deferred: candidates.filter((q) => !passes.includes(q)) };
}

// Copied from frozen src/app.jsx @ fe516c1:1481-1595.
function genSession(s, iso, slp) {
  const dt = dayType(iso, s);
  if (dt !== "U" && dt !== "L") return null;
  const { main, riders } = pickStructural(s, iso, slp);
  const active = new Set([main, ...riders].filter(Boolean).map((q) => q.exId));
  const ord = (s.exOrder && s.exOrder[dt]) || [];
  const pool = s.exercises.filter((e) => e.day === dt && exActive(s, e.id)).sort((a, b) => {   /* SPLIT item d — retired lifts leave the day pool; the raw record is never filtered */
    const ia = ord.indexOf(a.id), ib = ord.indexOf(b.id);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  const ex = pool.map((e) => {
    const isDebutNow = active.has(e.id);
    const q = isDebutNow ? s.queue.find((x) => x.exId === e.id && !x.done && (x.kind === "debut" || x.kind === "unlock")) : null;
    const w = q && q.newW != null ? q.newW : e.w;
    let tgt, note, baselineAsk = false;
    if (e.w == null) {   /* R2 fix-2: was gated on !lastMeta && !last, so a BLANK completion (honest log, no load) dropped the next card into hi-2 chase targets; the ask stands until a load exists */
      /* FIX split-1 (P0-2) — THE DEBUT/BASELINE ASK (R20b register): a lift
         with no completed entry and no working load gets NO numeric chase
         targets — hi-2 would be a fabricated prescription for a machine never
         touched. The slots render open, the load entry renders in both session
         modes, and the first completed entry carries the load through the REAL
         flow (completeSession's adoption branch stamps it). */
      baselineAsk = true;
      tgt = new Array(Math.max(1, e.sets || 1)).fill(0);
      note = "DEBUT — find the working weight: pick a load you can control for about " + (e.hi != null ? e.hi : "the target") + " reps, enter the load and log what it gives. Zero expectations — everything banks.";
    }
    else if (e.id === "hack" && e.pendingThird && isDebutNow) { tgt = [...targetsFor(e, s), Math.max(8, e.hi - 3)]; note = "DEBUT — third set banks whatever it gives"; }
    else if (q && q.kind === "debut" && e.last) {
      /* C12 — FIT THE PRIOR LINE TO THE SET COUNT FIRST. e.last is the line at the OLD
         load and may carry a different number of sets than this lift now runs: a 4-set
         last line on a 5-set lift produced four targets. Same pad-and-truncate rule the
         anchor path uses.
         C13 (Q8a) — THEN DEBIT BY THE SIZE OF THE JUMP. A debut line is a 2-RIR opener's
         line, not a failure-set table, so the textbook 2.5-3%-per-rep slope over-debits it;
         his own measured slope over seven non-calves load jumps is about ONE REP PER 5% OF
         LOAD (that debit's per-set error is 0.00 mean / 0.50 MAE). The old flat -1 floored
         at 6 was wrong in both directions: it under-debited an 11% jump (hack 180->200 was
         asked [8,8,9] and delivered [7,7,8]) and the floor could ask a COLLAPSED set for
         MORE at a heavier load (press [8,9,8,4] -> [7,8,7,6]). The floor of 6 is deleted;
         every target still floors at 1. */
      const base9 = e.last.slice(0, e.sets);
      while (base9.length < e.sets) base9.push(Math.max(1, _padFrom9(base9, e.hi) - 1));
      const vecOld9 = Array.isArray(e.wSets) ? e.wSets : null;
      const vecNew9 = Array.isArray(q.newWSets) ? q.newWSets : null;
      const d9 = debutDebit(e.w, w);
      tgt = base9.map((r, i) => {
        const di9 = (vecOld9 && vecNew9 && vecOld9[i] != null && vecNew9[i] != null) ? debutDebit(vecOld9[i], vecNew9[i]) : d9;
        return Math.max(1, r - di9);
      });
      const pct9 = (typeof e.w === "number" && typeof w === "number" && e.w > 0) ? Math.round(100 * (w - e.w) / e.w * 10) / 10 : null;
      note = d9 <= 1
        ? `DEBUT at ${w} — smallest honest jump: expect to keep almost every rep`
        : `DEBUT at ${w} — honest jump: about ${d9} fewer per set${pct9 != null ? " at +" + pct9 + "%" : ""}`;
    }
    else if (q && !e.last) { tgt = targetsFor(e, s); note = e.debutNote || `DEBUT at ${w}`; }
    else { tgt = targetsFor(e, s); note = e.own ? `OWN-IT — ${e.ownNote}` : e.reclaim ? "RECLAIM — the exact standard" : e.ladder ? `set ${e.ladder.set + 1} is the ladder — top of rung ${e.ladder.top}` : e.note; }
    /* C7/Q5 (PROGRESSION-1, the owner's exact words) — ONE LINE FOR THE RULED REALLOCATION.
       Calves shows three sets where its last delivered line has four, and the card said
       nothing: the fourth set was deliberately moved to the hip thrust in the approved
       split, and a silent drop reads as a mistake. Display only — the 08-10 line is not
       rewritten and the set does not come back. It retires itself the moment a three-set
       line exists, because then the card and the record agree without explanation. */
    const realloc9 = SET_REALLOCATIONS.find((x) => x.id === e.id && String(e.setsAt || "") === x.setsAt);
    if (realloc9 && e.sets < ((e.last || []).length || 0)) note = realloc9.line;
    if (e.holdFlag) note = "HELD — opener ran 0 RIR twice · one honest session releases it";
    const live = (() => {
      if (baselineAsk) return "baseline ask — enter the load you used; what it gives today IS the line";
      if (e.holdFlag) return "HELD — one honest opener (RIR ≥1) releases the load";
      if (isDebutNow && q) return `debut at ${w} — log what it gives, zero expectations`;
      if (e.std && e.own) return `${e.std.join(",")} clean owns it — honest opener, controlled every rep`;
      if (e.reclaim) return `reclaim the exact ${e.reclaim.join(",")} — ${e.reclaim.reduce((a, b) => a + b, 0)} honest reps buys the increment`;
      if (e.ladder) return `set ${e.ladder.set + 1} is the money set — ${e.last ? e.last[e.ladder.set] : "?"} → ${e.ladder.top} finishes the rung`;
      return `chase ${tgt.join(",")} — ${progressStep(e, s).why}`;
    })();
    /* R18a — THE RUNWAY, VISIBLE. Every numeric lift names its next load and the measured
       distance to it — derived ONLY from fields that already exist (nextLoad, windowFor,
       e.last, topRun, typicalError). No new math: the distance is the same top-of-window
       line the earn block already tests, restated as reps remaining. */
    const runway = (() => {
      if (typeof e.w !== "number") return null;
      /* Q7d (PROGRESSION-1) — a DEBUT card's runway priced the OLD load: the distance was
         computed from e.last (the previous load's line) against e.w, so the 87.5 debut card
         itself read "87.5 EARNS AT THE TOP OF THE WINDOW ... you are there". Nothing is
         earned on the session that sets a new line. Short-circuit before any distance
         arithmetic. */
      if (isDebutNow && q) return `DEBUT at ${w} — this session sets the line at the new load; the runway prices itself after it lands`;
      if (e.holdFlag) return "HELD — an honest opener (RIR ≥1) releases the load; the runway resumes where it left off";
      const up9 = nextLoad(e);
      const win9 = windowFor(e);
      /* D4 — the distance uses atTopOfWindow's OWN predicate (top - i, unfloored):
         flooring at window-lo printed 4 where the earn needed 3. And a lift whose last
         session logged fewer sets than it now runs cannot evaluate the window at all —
         it names the arming condition instead of implying tonight can earn. */
      const base9 = e.last && e.last.length ? e.last : tgt;
      if (e.last && e.last.length && e.sets && e.last.length < e.sets) return "arming: " + e.last.length + " of " + e.sets + " sets on file — the window reads only a full " + e.sets + "-set session; log one and the runway prices itself";
      const dist9 = base9.reduce((a9, v9, i9) => a9 + Math.max(0, ((win9.hi || 0) - i9) - (v9 || 0)), 0);
      if (up9 == null) return loadRungs(e)
        ? "no rung above " + e.w + " is on file — if the machine makes more, answer the ask on TRAIN (or SETUP ✎) and the next earn has a price; if this is the top of the stack, reps are the ladder from here"
        : "no next load on file — answer the ask on TRAIN and the sighting you already banked counts toward the earn";
      const sight9 = String(e.topAt) === String(e.w) && (e.topRun || 0) >= 1;
      const te9 = (() => { try { return typicalError(s, e.id).reps.toFixed(2); } catch (err) { return null; } })();
      const rungsUp9 = loadRungs(e) ? loadRungs(e).filter((x) => x > e.w).length : null;
      const blind9 = rungsUp9 != null && rungsUp9 <= 1 ? " · the ladder goes blind above " + up9 + " — file the machine's next rungs in SETUP (uneven ✎) so the earn after this one has a price" : "";
      return up9 + " EARNS AT THE TOP OF THE WINDOW (" + win9.lo + "-" + win9.hi + ") — " + (dist9 === 0 ? "you are there" : "you are " + dist9 + " rep" + (dist9 === 1 ? "" : "s") + " away") + " · " + (sight9 ? "one sighting banked — one more banks it" : "two sightings bank it") + (te9 ? ", or one that beats your ±" + te9 + " spread" : "") + blind9;
    })();
    return { id: e.id, n: e.n, w, tgt, note, isDebutNow, ...(baselineAsk ? { baselineAsk: true } : {}), setup: e.setup, live, runway, prev: eraFresh(s, e.id) ? null : e.lastMeta };   /* FIX 3c — a fresh era has no "last time" to beat; the baseline banner carries the why */
  });
  /* R18a — the header's no-debut claim carries a receipt: the nearest earn on THIS card,
     named with its measured distance, so "rep progression day" reads as a location. */
  const nearest = (() => {
    const c9 = ex.map((l9) => { const m9 = l9.runway && l9.runway.match(/^(\S+) EARNS AT THE TOP OF THE WINDOW \([^)]*\) — you are (\d+) rep/); return m9 ? { n: l9.n, up: m9[1], d: +m9[2] } : (l9.runway && /you are there/.test(l9.runway) ? { n: l9.n, up: (l9.runway.split(" ")[0]), d: 0 } : null); }).filter(Boolean).sort((a9, b9) => a9.d - b9.d);
    return c9.length ? " · closest to a new weight: " + c9[0].n + ", " + (c9[0].d === 0 ? "at the line" : c9[0].d + " rep" + (c9[0].d === 1 ? "" : "s") + " away from " + c9[0].up) : "";
  })();
  return { name: dt === "U" ? "UPPER" : "LOWER", structural: main ? main.t : "none queued — rep progression day" + nearest, structuralId: main ? main.id : null, riderIds: riders.map((r) => r.id), ex };
}

// Copied from frozen src/app.jsx @ fe516c1:8436-8476.
function nowFocus(s, hour) {
  const h = typeof hour === "number" ? hour : clock.hour();
  const tISO = isoOf(todayStart());
  const owed = [];
  /* morning: the two inputs the whole engine reads */
  const nightOwed = owedNights(s, h).length > 0;
  const weighed = (s.reads || []).some((r) => r.d === tISO);
  const rw9 = readWindow(s, h);
  if (nightOwed) owed.push({ k: "night", t: "Log last night", why: "bed, wake, and how long you took to drop off — the body-composition read leans on this harder than anything else you enter" });
  /* MISSED-READ RIDER — the rung RETIRES when the window closes: the move never asks for
     the impossible; the priced feed line (runAdaptive) says what the miss cost instead. */
  if (!weighed && rw9.open) {
    const lastLive = [...(s.reads || [])].reverse().find((r) => r && !r.sealed && !r.offWindow);
    const gapD = lastLive ? Math.round((mk(tISO) - mk(lastLive.d)) / DAY) : 0;
    owed.push({ k: "weight", t: "Log the scale", why: "one number, fasted — the trend absorbs the noise so a single morning never moves a decision" + (gapD >= 2 ? " First read after a gap: it carries " + gapD + " days of information — expect a bit more wobble; the trend knows." : "") });
  }
  /* evening: the day's numbers */
  const dl = (s.dailyLogs || {})[tISO];
  const dayOpen = !dl || dl.cal == null;
  /* his own pattern: the hour by which he has historically closed the day.
     Falls back to 17:00 only until there is enough of his own record. */
  const eveningFrom = 17;
  if (dayOpen && h >= eveningFrom) owed.push({ k: "day", t: "Close the day", why: "calories, protein, steps — three numbers, then it is done" });
  const yISO = isoOf(new Date(todayStart().getTime() - DAY));
  const yOpen = Object.keys(s.dailyLogs || {}).length > 0 && !(s.dailyLogs || {})[yISO];
  if (yOpen) owed.push({ k: "yesterday", t: "Yesterday never closed", why: "same numbers, honest timestamp — the ledger marks it logged-late, which is a fact rather than a fault" });

  const phase = h < 12 ? "MORNING" : h < eveningFrom ? "MIDDAY" : "EVENING";
  return {
    phase, hour: h, owed,
    clear: owed.length === 0,
    /* the single line at the top of the page */
    lead: owed.length
      ? { t: owed[0].t, sub: owed[0].why, more: owed.length - 1 }
      : phase === "MORNING"
        ? { t: "Morning's in", sub: "nothing owed until tonight — everything below is reading, not doing", more: 0 }
        : phase === "MIDDAY"
          ? { t: "Nothing owed right now", sub: "the day's numbers close it tonight", more: 0 }
          : { t: "Books closed", sub: "everything the analysts need is in", more: 0 },
  };
}

// Copied from frozen src/app.jsx @ fe516c1:8489-8539.
function fiveLevers(s) {
  const tISO = isoOf(todayStart());
  const sealed = !!(s.blackout && daysUntil(s.blackout.until) > 0);
  // DEFICIT — is the measured trend losing inside his own target band?
  const cr = currentRate(s);
  const band = cutRateBand(s).band;   // v6.2.1 — the DEFICIT lever now reads the selected mode's slice
  const floor = cutRateBand(s).floor;   /* R3 - %BW-derived; was a raw authored 0.8 lb */
  const redline = cutRateBand(s).redline;   /* R3 - %BW-derived; was a raw authored 1.9 lb */
  let deficit;
  if (sealed) deficit = { label: "DEFICIT", state: "quiet", detail: "scale sealed" };
  else if (!cr.measured) deficit = { label: "DEFICIT", state: "quiet", detail: "counting only" };
  else {
    const r = cr.scale;
    const st = r > redline ? "limit" : (r >= band[0] && r <= band[1]) ? "good" : "caution";
    deficit = { label: "DEFICIT", state: st, detail: `${r > 0 ? "−" : "+"}${Math.abs(r).toFixed(1)} lb/wk` };
  }
  // PROTEIN — hits at or above the floor over the last seven logged days
  const pt = proteinTarget(s);
  const proRows = Object.entries(s.dailyLogs || {}).filter(([, v]) => v && v.pro != null)
    .sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(-7).map(([, v]) => v.pro);
  const proHitN = proRows.filter((p) => proteinHit(pt.lo, p)).length;
  const protein = !proRows.length
    ? { label: "PROTEIN", state: "quiet", detail: "counting only" }
    : { label: "PROTEIN", state: proHitN >= proRows.length - 1 ? "good" : "caution", detail: `${proHitN}/${proRows.length}` };
  // TRAINING — sessions banked in the last seven days against the four-day split
  const wk7 = Object.keys(s.sessionLog || {}).filter((d) => { const g = (mk(tISO) - mk(d)) / DAY; return g >= 0 && g < 7; }).length;
  // Progress, not a fault: a logged session reads neutral (a rolling count that sits at 1-3
  // most of the week is not something to "adjust" — Part 1a fix). ✓ only at the weekly target.
  const training = wk7 >= 4
    ? { label: "TRAINING", state: "good", detail: `${wk7} of 4 · complete` }
    : { label: "TRAINING", state: "quiet", detail: wk7 === 0 ? "none logged yet" : `${wk7} of 4 this week` };
  // SLEEP — is he on his clean-night target run?
  // SLEEP — but ONLY if the record is current: three dark nights must not read as a
  // clean week. The run atSleepTarget reports ended whenever the nights end; when the
  // newest night is older than yesterday, the honest state is quiet (counting-only).
  const sl = atSleepTarget(s, null);
  const newestN = (s.sleep.nights || [])[(s.sleep.nights || []).length - 1];
  const darkD = newestN ? Math.round((mk(tISO) - mk(newestN.d)) / DAY) - 1 : 99;
  const sleep = darkD >= 1
    ? { label: "SLEEP", state: "quiet", detail: `${darkD} night${darkD === 1 ? "" : "s"} dark — can't read` }
    : { label: "SLEEP", state: sl.at ? "good" : "caution", detail: `${sl.run}/${s.sleep.needed} clean` };
  // STEPS — today's steps against his own measured floor
  const stg = stepTarget(s);
  const todaySteps = (s.dailyLogs[tISO] || {}).steps;
  const steps = stg.gated
    ? { label: "STEPS", state: "quiet", detail: "counting only" }
    : todaySteps == null
      ? { label: "STEPS", state: "quiet", detail: `target ${Math.round(stg.lo / 1000)}–${Math.round(stg.hi / 1000)}k` }
      : { label: "STEPS", state: todaySteps >= stg.lo ? "good" : "caution", detail: `${(todaySteps / 1000).toFixed(1)}k/${Math.round(stg.lo / 1000)}k` };
  return { deficit, protein, training, sleep, steps, list: [deficit, protein, training, sleep, steps] };
}

// Copied from frozen src/app.jsx @ fe516c1:8540-8580.
function theOneFix(s, levers) {
  const L = levers || fiveLevers(s);
  const owed = nowFocus(s).owed || [];
  const sealed = !!(s.blackout && daysUntil(s.blackout.until) > 0);
  const floor = cutRateBand(s).floor;   /* R3 - %BW-derived; was a raw authored 0.8 lb */
  // Rung 1 — verify logging: a clean ledger is the cheapest lever there is
  if (owed.length) return { rung: "logging", lever: "LOGGING", state: "caution",
    title: "Close the books first",
    /* MISSED-READ RIDER — the queued S1 fix, landed in its engine window: the owed titles
       are already imperative ("Log the scale"), so no verb is prepended — the doubled
       "Log log" class dies at its source (the surface's _plain9 collapse stays as belt). */
    body: `${owed[0].t.charAt(0).toUpperCase() + owed[0].t.slice(1)} — the read leans on your own numbers harder than any calorie cut, and an honest ledger is the cheapest lever there is. Nothing to change until the day is closed.`,
    whyNot: null };
  // Rung 2 — steps / NEAT before touching food
  if (L.steps.state === "caution") return { rung: "steps", lever: "STEPS", state: "caution",
    title: "Add a walk today",
    body: "Steps are the lever here, not your calories — more NEAT widens the deficit without spending recovery or lean mass. No calorie cut needed; that rung comes later, and only if the trend stalls.",
    whyNot: "A deeper cut buys the same energy a walk gives for free, and spends recovery and lean mass to do it. Steps sit above calories on the ladder for exactly that reason — food comes down only once the cheaper levers are used up." };
  // Rung 3 — protect sleep before touching food
  if (L.sleep.state === "caution") return { rung: "sleep", lever: "SLEEP", state: "caution",
    title: "Protect tonight's sleep",
    body: "Short sleep pushes more of the loss onto lean mass instead of fat (Nedeltcheva 2010), so a good night is worth more than a smaller plate right now. Guard lights-out before you touch the deficit.",
    whyNot: "On short sleep a deeper cut spends muscle; a full night keeps the loss coming off fat. Sleep is the lever tonight, not food." };
  // Rungs 4/5 — only once logging, steps and sleep are covered AND the trend has stalled
  const cr = currentRate(s);
  const stalled = !sealed && cr.measured && cr.scale < floor;
  const longCut = weekDay().wk >= 10;
  if (stalled && longCut) return { rung: "break", lever: "DEFICIT", state: "caution",
    title: "A diet break has earned its place",
    body: "You've held the deficit for weeks and the trend has flattened. A full week at maintenance is the intervention with real adherence evidence here — not a deeper cut. A planned pause, not a lapse.",
    whyNot: null };
  if (stalled) return { rung: "calories", lever: "DEFICIT", state: "caution",
    title: "Now a small calorie trim earns its place",
    body: "Logging, steps and sleep are all covered and the trend has flattened — this is the rung where a modest cut is finally the honest move. Keep it small; " + DEFICIT_CEILING.line() + ".",
    whyNot: null };
  // Everything covered, trend doing its job — the good, quiet state
  return { rung: "hold", lever: null, state: "good",
    title: "Nothing to fix — hold the line",
    body: "The five are covered and the trend is doing its job. Silence is a valid state here; there's no lever worth pulling today.",
    whyNot: null };
}

// Copied from frozen src/app.jsx @ fe516c1:8593-8626.
function whyDecompose(s) {
  const sig = signalState(s);
  const clean = (s.reads || []).filter((r) => r && !r.sealed && !r.offWindow && r.w != null);
  if (clean.length < 5) return { show: false, sig };
  const last = clean[clean.length - 1];
  const wn = weightNoise(clean);
  const trend = s.trend != null ? s.trend : last.w;
  const gap = +(last.w - trend).toFixed(1);
  const refeedRecent = [1, 2, 3].some((d) => dayType(isoOf(new Date(todayStart().getTime() - d * DAY)), s) === "REFEED");
  const floor = cutRateBand(s).floor;   /* R3 - %BW-derived; was a raw authored 0.8 lb */
  const rate = currentRate(s);
  const realStall = rate.measured && rate.scale < floor && sig.state !== "reversed";
  const show = gap >= Math.max(0.4, wn.sd) || refeedRecent || realStall;
  if (!show) return { show: false, sig };
  // The REAL share tracks the measured trend: on-pace -> mostly water; a measured
  // stall -> a real slice earns its place. Water leans on a recent refeed (glycogen)
  // vs the baseline sodium+gut swing. Estimates, carried with a margin.
  let real = realStall ? 0.35 : sig.state === "reversed" ? 0.45 : 0.15;
  let refeed = refeedRecent ? 0.40 : 0.10;
  let sodium = Math.max(0.1, 1 - real - refeed);
  const norm = real + refeed + sodium;
  const pc = (x) => Math.round((x / norm) * 100);
  const parts = [
    { key: "refeed", label: "water · refeed glycogen", pct: pc(refeed), tone: "gauge" },
    { key: "sodium", label: "water · sodium + gut", pct: pc(sodium), tone: "steel" },
    { key: "real", label: "real · smaller deficit", pct: pc(real), tone: "brass" },
  ];
  const realPct = pc(real);
  return {
    show: true, sig, gap, refeedRecent, realStall, rate: rate.scale, sd: wn.sd,
    parts, realPct, waterPct: 100 - realPct,
    question: gap > 0.4 ? "Why is the scale up this morning?" : realStall ? "Why has the loss slowed?" : "How much of this is real?",
  };
}

// Copied from frozen src/app.jsx @ fe516c1:10189-10221.
function lastUndoable(s) {
  const adj = (s && Array.isArray(s.adjustments)) ? s.adjustments : [];
  const props = (s && Array.isArray(s.proposals)) ? s.proposals : [];
  const structural = (rid) => props.some((p) => p && p.rid === rid && p.apply && (p.apply.kind === "phase" || p.apply.kind === "exit"));
  for (let i = adj.length - 1; i >= 0; i--) {
    const a = adj[i];
    if (!a || a.undone || a.dismissed) continue;      // only APPLIED moves are undoable (a decline changed nothing)
    if (structural(a.rid)) continue;
    /* SCALE-7/8 (Sol's passes 5–6, P1) — "last" is a CLAIM, and a claim needs proof.
       SCALE-8: sureness is a property of the COMPETING SET, not of the selected row —
       "stamped" only proves the winner's own clock, and two same-day taps from two
       devices order by wall clocks that carry no causal provenance (the executed skew
       witness: a stamped winner claimed 'Last move applied' over an order its skewed
       peer contradicted). A sole candidate needs no proof; any multi-candidate day is
       ordered deterministically (one instant scale, then rid/id) but explicitly
       UNPROVEN — the door says "most recent on file" instead of "last". */
    /* SCALE-10 (Sol's pass 8 — CONFIRMED at 5c25ace, rig129 A): a FINITE WINDOW MOVES THE
       BOUNDARY, IT DOES NOT CLOSE IT. His witness: X on a fast clock records d 08-28 /
       at 01:01Z; Y ten minutes LATER on a slow clock records d 08-27 / at 00:00Z. The
       recorded separation is 25h01m — outside any 24-hour neighbourhood, different days,
       both stamped — so the old check proved "certainty" and the door claimed "Last move
       applied" over the wrong move. The same witness steps past ANY finite cutoff, so
       widening or adapting the window cannot help. Until STAMP adds durable device/causal
       provenance, the app does not get to assert causal recency at all: a claim survives
       ONLY where there is nothing to be wrong about — a single undoable move on file.
       Everywhere else the surface is RECORDED-ORDER semantics ("Latest dated move on
       file"), which is exactly what the deterministic d-first selection computes. The
       PICK is unchanged; the CLAIM is retired. */
    const others10 = adj.filter((x) => x && x !== a && !x.undone && !x.dismissed && !structural(x.rid));
    return { rid: a.rid, d: a.d, title: a.title, auto: !!a.auto, orderSure: others10.length === 0 };
  }
  return null;
}

// Copied from frozen src/app.jsx @ fe516c1:10269-10271.
function apAutoHandledFor(s, tISO) {
  return ((s && s.adjustments) || []).some((a) => a && a.rid && String(a.rid).indexOf("apauto_") === 0 && a.d === tISO);
}

// Copied from frozen src/app.jsx @ fe516c1:15246-15250.
function oweTarget(k) {
  return k === "day" ? { key: NOW_DOORS.capture, id: "pl-closeday" }
      : k === "yesterday" ? { key: NOW_DOORS.capture, id: "pl-amend" }
      : { key: NOW_DOORS.capture, id: "pl-capture" };
}

// Copied from frozen src/app.jsx @ fe516c1:15295-15352.
function statusFace(s, deps) {
  const sig = (deps && deps.sig) || signalState(s);
  const ap = (deps && deps.ap) || autoPilot(s, apModeOf(s));
  const rec = (deps && deps.rec) || readRecency(s);
  const paused = !!(s && s.blackout && s.blackout.until && daysUntil(s.blackout.until) > 0);
  const coachOwed = (((s && s.proposals) || [])).some((p) => p && !p.resolved && p.gate === "coach");
  const reversed = sig.state === "reversed";
  const proposed = !!(ap && ap.ok && ap.proposed);
  const heldForNoise = !!(ap && ap.ok && ap.heldForNoise);
  const noiseHold = heldForNoise || sig.state === "inside-noise";
  const read = () => { try { return signalReadCopy(s, sig).sentence; } catch (e) { return ""; } };
  // v7.2.0 Slice 3 — the autonomy level + the safety supervisor shape the face HONESTLY: a routine move
  // being auto-handled reads as "handling · one tap to undo" (ADJUSTING); a HARD escalation (magnitude /
  // floor / redline / conflict) is forced to NEEDS YOU regardless of level — and, per the v7.2.0 audit,
  // even with NO staged move and even while otherwise holding (a safety condition belongs on the face).
  const pol = (deps && deps.pol) || autoPilotPolicy(s, { ap });
  const level = (deps && deps.level) || autonomyOf(s);

  let word, glyph, tone, cause, fc = null;
  if (reversed || coachOwed) {
    word = "NEEDS YOU"; glyph = "▲"; tone = "orange";               // ▲
    cause = reversed ? read() : "A coach-flag call is waiting for your sign-off — nothing moves on its own.";
  } else if (pol.escalate) {
    // SAFETY SUPERVISOR (v7.2.0 audit) — a HARD safety ask (protein FLOOR, muscle-loss REDLINE, or an
    // over-corridor magnitude) is a human-owed call, so it reaches the hero WORD even with NO staged
    // move (proposed:false) and even while Auto-Pilot is otherwise HOLDING — a safety-relevant condition
    // belongs on the face, not only on a card. Calm + honest: the established NEEDS-YOU ▲, never a new
    // alarm. (reversed/coach already caught above; past here escReason is a floor/redline/magnitude ask.)
    word = "NEEDS YOU"; glyph = "▲"; tone = "orange";               // ▲
    cause = `One call needs you — ${pol.escReason ? pol.escReason.text : "a safety check outside the routine corridor"}.`;
  } else if (sig.state === "calibrating" || !(ap && ap.ok)) {
    word = "CALIBRATING"; glyph = "◇"; tone = "steel";              // ◇
    cause = read() || "Still learning your baseline — keep logging and the read sharpens.";
  } else if (paused) {
    word = "HOLDING"; glyph = "‖"; tone = "steel";                  // ‖
    cause = "Scale sealed — paused by you; Auto-Pilot waits until it reopens.";
  } else if (proposed) {
    word = "ADJUSTING"; glyph = "±"; tone = "gauge";                // ±
    cause = pol.autoApply
      ? `${ap.action === "ease" ? "Easing back" : "Tightening"} ≈ ${ap.corrKcal} kcal — a routine move Auto-Pilot is handling at ${(AUTONOMY_META[level] || AUTONOMY_META.propose).short}; one tap to undo.`
      : `${ap.action === "ease" ? "Easing back" : "Tightening"} ≈ ${ap.corrKcal} kcal toward your ${ap.mode === "fatloss" ? "max-fat-loss" : "body-comp"} target — one tap to approve.`;
  } else if (rec.stale || noiseHold) {
    word = "HOLDING"; glyph = "‖"; tone = "steel";                  // ‖
    cause = rec.stale ? cap(rec.flag) : "This week is still inside your noise — holding for a clear read rather than steering off a blip.";
  } else if ((fc = (deps && deps.fc) || safeCrossing(s)) && fc.fires) {
    // ANTICIPATORY (v7.1.0 · Slice 2) — the foresight nudge. Only when the redline crossing is
    // statistically RESOLVABLE (it self-suppresses otherwise) and only below every higher-priority
    // honest state, an approaching lean-loss rate reads as a CALM ADJUSTING cue ("easing back"),
    // never a NEEDS-YOU alarm and never colour-as-alarm — foresight informs the face, it doesn't
    // raise urgency. Self-silencing: an ambiguous trend leaves the face exactly ON COURSE.
    word = "ADJUSTING"; glyph = "±"; tone = "gauge";                // ±
    cause = fc.cause;
  } else {
    word = "ON COURSE"; glyph = "◆"; tone = "brass";                // ◆
    cause = read() || "On the mode target — nothing to change today.";
  }
  return { word, glyph, tone, cause };
}

// Copied from frozen src/app.jsx @ fe516c1:15364-15395.
function marchingOrder(s, deps) {
  const focus = (deps && deps.focus) || nowFocus(s);
  const ct = energyBalanceTarget(s), pt = proteinTarget(s);
  const targetLine = ct && !ct.gated
    ? `Today: ${ct.lo}–${ct.hi} kcal · ${pt.g} g protein${ct.provisional && !ct.gated ? " (provisional — " + (ct.regimeConfirmed ? "holding, not deciding" : "first reading, not yet confirmed by a second a week apart") + ")" : ""}`
    : `Today: ${pt.g} g protein · calories still calibrating`;
  const o0 = focus && focus.owed && focus.owed[0];
  if (o0) {
    const cueBy = { weight: "When you wake", night: "Before coffee", day: "Before bed tonight", yesterday: "Right now" };
    return {
      owed: true, kind: o0.k,
      ifText: cueBy[o0.k] || "Next", thenText: (o0.t || "").toLowerCase(),
      why: o0.why || "", targetLine, link: oweTarget(o0.k),
      more: ((focus.owed || []).slice(1)).map((o) => (o.t || "").toLowerCase()),
    };
  }
  const fix = theOneFix(s);
  // ANTICIPATORY (v7.1.0 · Slice 2) — when the redline crossing is RESOLVABLE and nothing is owed,
  // the foresight informs the one-thing's WHY (protein-first IS the lean-protective move, so the
  // action is unchanged — only the reason gains the horizon). Self-silencing: an ambiguous or
  // absent crossing leaves the standing if-then exactly as it was.
  const fc = (deps && deps.fc) || safeCrossing(s);
  const why = fc && fc.fires
    ? `Approaching the lean-loss rate (~${fc.wksEarly}–${fc.wksLate} wks) — protein first protects lean while Auto-Pilot eases the deficit back.`
    : ((fix && fix.title) || "Hold the line — the five are covered and the trend is doing its job.");
  return {
    owed: false, kind: "day",
    ifText: "If it's a meal", thenText: "protein first",
    why, targetLine, link: oweTarget("day"), more: [],
    foresight: fc && fc.fires ? { wksEarly: fc.wksEarly, wksLate: fc.wksLate, prob: fc.prob } : null,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:15404-15414.
function statusTarget(s, deps) {
  const props = (((s && s.proposals) || [])).filter((p) => p && !p.resolved);
  const agents = ((s && s.agentProposals) || []);
  let esc; try { esc = (deps && deps.esc) || escalation(s); } catch (e) { esc = { escalate: false }; }
  const focus = (deps && deps.focus) || (function () { try { return nowFocus(s); } catch (e) { return { owed: [] }; } })();
  if (props.length || agents.length) return { key: NOW_DOORS.inbox, id: "pl-inbox", label: "open what's waiting on your tap" };
  if (esc && esc.escalate) return { key: NOW_DOORS.briefing, id: "pl-autopilot", label: "open the call that needs you" };
  const o0 = focus && focus.owed && focus.owed[0];
  if (o0) { const t = oweTarget(o0.k); return { key: t.key, id: t.id, label: "go to what's owed" }; }
  return null;
}

// Copied from frozen src/app.jsx @ fe516c1:15424-15504.
function nowModelUncached(s, deps) {
  const tISO = isoOf(todayStart());
  const eb = energyBalanceTarget(s);
  const face = (deps && deps.face) || statusFace(s);
  const prog = (deps && deps.prog) || ((eb.regime === "unknown") ? progressionTrend(s) : null);
  const nTrend = (() => { if (!prog || prog.state !== "unknown") return 4; const m9 = /only (\d+) lift/.exec(prog.why || ""); return m9 ? +m9[1] : 0; })();
  /* AT MOST ONE coach-state box — the most consequential wins (§1). Learning beats the
     one-variable wait: a detector that cannot read yet explains every other silence. */
  const smw = structuralMovesThisWeek(s);
  const setAside9 = (() => { try { return (progressionTrend(s).setAsideDays || []).slice(-3); } catch (e) { return []; } })();   /* R17 — the sessions the trend layer could not use */
  const coach = eb.regime === "unknown"
    /* R17 — THE RECEIPT. A count that drops must say why. When the detector is short AND
       sessions were set aside, the box names them: which day, what set it aside, and what
       would undo it. Silence was the failure — 3 lifts became 0 with no sentence anywhere
       on the screen, and the only thing that had changed was a note about dinner. */
    ? { title: "YOUR COACH IS STILL LEARNING", body: "It wants more workout data before changing anything — it can read " + nTrend + " of the 4 lifts it needs so far. Until then, the plan stays exactly as is. It never guesses."
        + ((setAside9 && setAside9.length) ? " " + (setAside9.length === 1 ? "One session is set aside: " + fmtShort(setAside9[0]) : setAside9.length + " sessions are set aside: " + setAside9.map(fmtShort).join(", ")) + " — an event day, where the session itself is likely compromised, not just the food numbers. Remove the event and " + (setAside9.length === 1 ? "it counts" : "they count") + " again." : "") }
    /* R18e — the card OVERCLAIMED: 'holds every other lever' while Auto-Pilot never
       consulted the budget and the daily band updated daily. It now names the levers
       actually held (the volume push and the step push), says what stays live, and
       names when the budget reopens — all from smw's own state. */
    : (smw.moves.length ? { title: "ONE CHANGE AT A TIME", body: (smw.sets.length ? "A training tweak landed this week — the set-add lever is held while its lift reads, and a tighten waits out the new-volume water (easing and the safety floor never wait). Calorie and step steers stay live: the scale cannot read a set-add, so they never shared a budget. " : "") + (smw.calOrSteps.length ? "Your " + (smw.calOrSteps[0].kind === "steps" ? "step target" : "calorie range") + " moved this week — that lever is held while the scale reads it; the volume desk stays live on its own budget. " : "") + "Your daily calorie band keeps updating and corrective steers stay live. The budget" + (smw.sets.length && smw.calOrSteps.length ? "s reopen" : " reopens") + " " + fmtShort(isoOf(new Date(mk(smw.monday).getTime() + 7 * DAY))) + "." } : null);
  const pt = proteinTarget(s);
  const eat = {
    gated: !!eb.gated, lo: eb.gated ? null : eb.lo, hi: eb.gated ? null : eb.hi,
    tag: eb.provisional && !eb.gated ? "FIRST ESTIMATE" : null,
    sub: eb.gated ? "A few more logged days and the range appears — the coach never guesses a number this important."
      : (eb.dir === "deficit" ? "" : eb.dir === "surplus" ? "Eating a bit more than you burn — building costs fuel, and that's the plan." : "Eating about what you burn — holding steady is the plan right now.") + (eb.provisional ? " This range firms up after your next weigh-in." : ""),
    proteinG: pt.g, proteinNote: weekDay().wk <= 4 ? "IF IT'S A MEAL, EAT THE PROTEIN FIRST" : null,   /* A11 — a first-weeks tip, not a permanent fixture */
  };
  /* TODAY'S MOVE — the coach picks ONE thing (§1: a coach that surfaces everything at
     once is a dashboard; one that picks is a coach). Unanswered decision cards outrank
     the ladder — they ARE what matters most today; then theOneFix's ladder (logging →
     steps → sleep → break/trim); then the rate story; then the quiet line. */
  const decisionsN = ((s.proposals || []).filter((p) => p && !p.resolved).length) + ((s.agentProposals || []).length);
  const fix = (deps && deps.fix) || theOneFix(s);
  const rb = cutRateBand(s);
  const cr = currentRate(s);
  let move;
  if (decisionsN > 0) {
    /* A2 — ANSWER-FIRST: the headline IS decision #1 (verb + object, the engine's own
       card title); its one-line effect follows; "+N more" is quiet metadata. The
       philosophy paragraph lives on the decisions surface header now. */
    const first9 = (s.proposals || []).find((p) => p && !p.resolved) || (s.agentProposals || [])[0] || null;
    const eff9 = first9 ? String(first9.why || first9.body || "").split(". ")[0] : "";
    move = { kind: "decisions", n: decisionsN,
      title: first9 ? String(first9.title || "ONE DECISION WAITS") : "ONE DECISION WAITS",
      body: (eff9 ? eff9 + (/[.!?]$/.test(eff9) ? "" : ".") + " " : "") + "One tap decides — and one tap always undoes it." + (decisionsN > 1 ? "  +" + (decisionsN - 1) + " more ▸" : "") };
  }
  else if (fix.state === "caution") move = { kind: "fix", lever: fix.lever, title: _plain9(String(fix.title || "").toUpperCase()), body: _plain9(fix.body) };
  else if (cr.measured && !eb.gated && (cr.scale > rb.band[1] || cr.scale < rb.band[0]))
    move = { kind: "rate", title: "HOW FAST YOU'RE LOSING", strip: _rateStrip(rb, cr), body: _rateWord(rb, cr) };
  else move = { kind: "quiet", title: "NOTHING NEEDS YOU", body: "Log and lift — the plan is doing its job. Silence is a valid state here; the coach speaks only when something is worth saying." };
  /* NEXT WORKOUT */
  let workout = { title: "REST DAY", sub: "Recovery is training too — the next session is on its way.", today: false };
  try {
    for (let k9 = 0; k9 < 7; k9++) {
      const d9 = isoOf(new Date(todayStart().getTime() + k9 * 864e5));
      const dt9 = dayType(d9, s);
      if (dt9 === "U" || dt9 === "L") {
        const sess9 = genSession(s, d9);
        const beats = ((sess9 && sess9.ex) || []).filter((e) => e && e.prev && Array.isArray(e.prev.reps) && e.prev.reps.length).slice(0, 2)
          .map((e) => e.n + (typeof e.w === "number" ? " " + e.w : "") + " — beat " + e.prev.reps.join("·"));
        workout = { title: (dt9 === "U" ? "UPPER BODY" : "LOWER BODY") + " · " + (k9 === 0 ? "TODAY" : k9 === 1 ? "TOMORROW" : fmtShort(d9).toUpperCase()), sub: beats.join(" · "), today: k9 === 0, iso: d9 };
        break;
      }
    }
  } catch (e) {}
  /* WHERE YOU'RE HEADED */
  const pp = paceProjection(s);
  const bf = bfEst(s);
  const rng = (pp.ok && pp.banded) ? [pp.lo, pp.hi].filter((x) => x != null).map((x) => Math.round(x)).sort((a, b) => a - b) : [];
  const headed = {
    weight: s.trend,
    dest: pp.ok ? Math.round(pp.mid) : null, wksOut: pp.ok ? pp.wks : null,
    line: pp.ok ? "about " + pp.wks + " weeks to ~" + Math.round(pp.mid) + (rng.length === 2 ? " (could land " + rng[0] + "–" + rng[1] + ")" : "") : "a few more weigh-ins and the road ahead draws itself",
    bfLine: "body fat: best guess " + Math.round(bf.pct) + "%, honestly " + Math.round(bf.lo) + "–" + Math.round(bf.hi),
    foot: "AN ESTIMATE, NOT A PROMISE — REDRAWN EVERY WEEK",
  };
  return { tISO, status: { word: face.word, glyph: face.glyph, cause: face.cause, coach }, eat, move, decisionsN, workout, headed };
}

// Copied from frozen src/app.jsx @ fe516c1:15508-15517.
function _plain9(t) { return String(t || "").replace(/the deficit/g, "the calorie cut").replace(/\bdeficit\b/gi, "calorie cut")
  /* CRITIQUE S1 — theOneFix composes a verb onto an owed title that may already carry
     the same verb ("Log " + "log the scale" -> "Log log the scale"). The engine is
     FROZEN, so the surface collapses a doubled LEADING word — the class, not the
     instance — and the engine-side copy fix is filed for the next engine window.
     (This line also repairs its own predecessor: a shell heredoc once turned the
     word-boundary escapes into literal backspace bytes — the incident-log class —
     leaving the second replace unreachable; the plain-string first replace carried
     the live case, which is why every test stayed green while the regex was dead.) */
  .replace(/^(\w+)\s+\1\b/i, "$1"); }

// Copied from frozen src/app.jsx @ fe516c1:15519-15525.
function _rateStrip(rb, cr) {
  const D9 = rb.redline * 1.18;
  const pc = (x) => Math.max(0, Math.min(100, +((x / D9) * 100).toFixed(1)));
  return { zoneLo: pc(rb.band[0]), zoneHi: pc(rb.band[1]), slow: pc(rb.floor), fast: pc(rb.redline),
    ciLo: cr.lo != null ? pc(Math.max(0, cr.lo)) : null, ciHi: cr.hi != null ? pc(cr.hi) : null,
    mark: pc(cr.scale), label: cr.scale.toFixed(1) + " LB/WK" };
}

// Copied from frozen src/app.jsx @ fe516c1:15526-15534.
function _rateWord(rb, cr) {
  const above = cr.scale > rb.band[1], below = cr.scale < rb.band[0];
  const nearEdge = above ? (cr.lo != null && cr.lo <= rb.band[1]) : (below ? (cr.hi != null && cr.hi >= rb.band[0]) : false);
  const rel = above ? (nearEdge ? "a hair past the sweet spot's edge" : "faster than the sweet spot") : (below ? (nearEdge ? "just under the sweet spot" : "slower than the sweet spot") : "inside the sweet spot");
  const act = cr.scale > rb.redline ? "That is fast enough to start costing muscle — a card with the fix will come to you."
    : nearEdge ? "But scales wobble day to day (that's the thin white line), so you may well be inside it. Nothing needs to change."
    : above ? "Worth watching for a week — if it holds, the coach will bring you a card." : "If it holds, the coach reaches for the cheapest lever first — never a crash cut.";
  return "You're losing about " + cr.scale.toFixed(1) + " lb a week — " + rel + ". " + act;
}

// Copied from frozen src/app.jsx @ fe516c1:15535-15535.
const _nowMemo = memoOnState((s) => nowModelUncached(s));

// Copied from frozen src/app.jsx @ fe516c1:15536-15536.
function nowModel(s, deps) { return deps ? nowModelUncached(s, deps) : _nowMemo(s); }

return { pickStructural, genSession, nowFocus, fiveLevers, theOneFix, whyDecompose, lastUndoable, apAutoHandledFor, oweTarget, statusFace, marchingOrder, statusTarget, nowModelUncached, _plain9, _rateStrip, _rateWord, nowModel };
};
