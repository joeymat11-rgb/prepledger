"use strict";

// Frozen writer and required pure read/narration closure; all mutable bindings are instance-local.
module.exports = function createWriters(E, { clock, ids, drafts }) {
const { BC, DAY, DEBT_LAST_H, DEBT_MEAN3_H, DEFICIT_CEILING, EA_SPARING, GAIN_CAP_PCT_MO, LATE_READ_HOW, PHASES, PHASE_META, REGIME_HOLD_D, SEAL_UNTIL, SEED, START, SURPLUS_BATCH_MAX, SURPLUS_HOLD_D, TREND_MIN_SESSIONS, TRIAL_TPL, VOL_BANDS, VOL_PUSH_CEIL_WK, VOL_REVIEW_HI, VOL_REVIEW_LO, VOL_SESS_CAP, WEEKS_PER_MONTH } = E;
const _freshId = (...args) => E._freshId(...args);
const _setsMovesSince = (...args) => E._setsMovesSince(...args);
const apAutoHandledFor = (...args) => E.apAutoHandledFor(...args);
const apModeOf = (...args) => E.apModeOf(...args);
const atTopOfWindow = (...args) => E.atTopOfWindow(...args);
const bfEst = (...args) => E.bfEst(...args);
const blackoutOn = (...args) => E.blackoutOn(...args);
const bodyAlarm = (...args) => E.bodyAlarm(...args);
const buildRirSets = (...args) => E.buildRirSets(...args);
const calorieFloor = (...args) => E.calorieFloor(...args);
const cap = (...args) => E.cap(...args);
const cleanAtDate = (...args) => E.cleanAtDate(...args);
const coarseLifts = (...args) => E.coarseLifts(...args);
const currentRate = (...args) => E.currentRate(...args);
const cutRateBand = (...args) => E.cutRateBand(...args);
const dayType = (...args) => E.dayType(...args);
const dayWeather = (...args) => E.dayWeather(...args);
const daysUntil = (...args) => E.daysUntil(...args);
const dietBreakState = (...args) => E.dietBreakState(...args);
const dietExit = (...args) => E.dietExit(...args);
const earnWalk = (...args) => E.earnWalk(...args);
const energyAvailability = (...args) => E.energyAvailability(...args);
const energyBalanceTarget = (...args) => E.energyBalanceTarget(...args);
const eraFresh = (...args) => E.eraFresh(...args);
const eventFocus = (...args) => E.eventFocus(...args);
const exActive = (...args) => E.exActive(...args);
const exById = (...args) => E.exById(...args);
const fmt12 = (...args) => E.fmt12(...args);
const fmtShort = (...args) => E.fmtShort(...args);
const forkFrom = (...args) => E.forkFrom(...args);
const forksOf = (...args) => E.forksOf(...args);
const genSession = (...args) => E.genSession(...args);
const isoOf = (...args) => E.isoOf(...args);
const labGroups = (...args) => E.labGroups(...args);
const labGroupsM = (...args) => E.labGroupsM(...args);
const lastUndoable = (...args) => E.lastUndoable(...args);
const liftCall = (...args) => E.liftCall(...args);
const liftTrend = (...args) => E.liftTrend(...args);
const lightsOutT = (...args) => E.lightsOutT(...args);
const liveRollups = (...args) => E.liveRollups(...args);
const loadRungs = (...args) => E.loadRungs(...args);
const maxedOut = (...args) => E.maxedOut(...args);
const mgLabel = (...args) => E.mgLabel(...args);
const missedReadCost = (...args) => E.missedReadCost(...args);
const mk = (...args) => E.mk(...args);
const muscleVolume = (...args) => E.muscleVolume(...args);
const nameAt = (...args) => E.nameAt(...args);
const nextLoad = (...args) => E.nextLoad(...args);
const normalizePlan = (...args) => E.normalizePlan(...args);
const observedTDEE = (...args) => E.observedTDEE(...args);
const owedLedger = (...args) => E.owedLedger(...args);
const owedNights = (...args) => E.owedNights(...args);
const paceRushed = (...args) => E.paceRushed(...args);
const phaseArc = (...args) => E.phaseArc(...args);
const pinsBornOf = (...args) => E.pinsBornOf(...args);
const programmeVolume = (...args) => E.programmeVolume(...args);
const progressStep = (...args) => E.progressStep(...args);
const progressionTrend = (...args) => E.progressionTrend(...args);
const prophetGrades = (...args) => E.prophetGrades(...args);
const proposalDial = (...args) => E.proposalDial(...args);
const proposalEffect = (...args) => E.proposalEffect(...args);
const proposeLadder = (...args) => E.proposeLadder(...args);
const proteinHit = (...args) => E.proteinHit(...args);
const proteinTarget = (...args) => E.proteinTarget(...args);
const pulseRead = (...args) => E.pulseRead(...args);
const readWindow = (...args) => E.readWindow(...args);
const reconcileSuggestionEffects = (...args) => E.reconcileSuggestionEffects(...args);
const recoveryIndex = (...args) => E.recoveryIndex(...args);
const regime = (...args) => E.regime(...args);
const rirSetsOf = (...args) => E.rirSetsOf(...args);
const sameEra = (...args) => E.sameEra(...args);
const sleepAnchor = (...args) => E.sleepAnchor(...args);
const sleepInfo = (...args) => E.sleepInfo(...args);
const sleepMean3At = (...args) => E.sleepMean3At(...args);
const snapLoad = (...args) => E.snapLoad(...args);
const stepPush = (...args) => E.stepPush(...args);
const stepTarget = (...args) => E.stepTarget(...args);
const structuralMovesThisWeek = (...args) => E.structuralMovesThisWeek(...args);
const targetsFor = (...args) => E.targetsFor(...args);
const tempRead = (...args) => E.tempRead(...args);
const todayStart = (...args) => E.todayStart(...args);
const trialTpl = (...args) => E.trialTpl(...args);
const trialVerdict = (...args) => E.trialVerdict(...args);
const typicalError = (...args) => E.typicalError(...args);
const volumeConversion = (...args) => E.volumeConversion(...args);
const volumeImbalance = (...args) => E.volumeImbalance(...args);
const weekDay = (...args) => E.weekDay(...args);
const weeksBetween = (...args) => E.weeksBetween(...args);

// Copied from frozen src/app.jsx @ fe516c1:251-264.
const DT_PALETTE = {
  dark: {
    bg: "#07090C", bg2: "#0A0D11", card: "#11151B", card2: "#151A21", well: "#0D1116",
    hairline: "#222A34", hairline2: "#2C3642",
    ink: "#E9EEF4", steel: "#8D9AAB", dim: "#7C8794",   /* RB-2 — was #5C6875 (~3.1:1 on card); 4.6:1 now, still a step under steel: quiet, legible */
    jade: "#5ED4A2", amber: "#E5B454", red: "#E06056", decision: "#5FB7E8",
  },
  light: {
    bg: "#F4F2ED", bg2: "#EFECE5", card: "#FFFFFF", card2: "#F5F2EB", well: "#ECE8E0",
    hairline: "#D8D3C9", hairline2: "#C9C3B8",
    ink: "#1A1F25", steel: "#525A64", dim: "#5D656F",
    jade: "#14663F", amber: "#7A5A1C", red: "#B3123C", decision: "#0E6C87",
  },
};

// Copied from frozen src/app.jsx @ fe516c1:265-278.
const DT = {
  ...DT_PALETTE.dark,
  radius: 18, grid: 4, space: [4, 8, 12, 16, 24],
  ramp: [9, 10.5, 12, 13.5, 15, 19, 24, 32, 54],
  track: { small: "0.20em", mid: "0.10em", display: "0.04em" },
  glyph: { status: "◆", ok: "◇", fwd: "▸", sep: "·" },
  /* touch: the 64px law is met by HIT AREA — transparent borders / negative-margin slop —
     so a 44px pill or a 52px FAB keeps its visual size while its tap box reaches 64
     (critique S3). A control whose HIT box is under 64 is the violation, not its paint.
     DISPLAY VOICE (critique R4): Barlow Condensed 600/700 owns the status word and card
     sub-heads; IBM Plex Mono owns DATA — numbers, overline labels, ticks. Prose is
     Barlow. No fourth voice. */
  touch: 64,
};

// Copied from frozen src/app.jsx @ fe516c1:1234-1256.
function sweepLadders(s) {
  try {
    let touched = false;
    for (const ex of ((s && s.exercises) || [])) {
      if (!ex || !ex.id) continue;
      if (!exActive(s, ex.id)) continue;   /* R6 fix-2: a retired record keeps its ladder history; the sweep never touches it */
      const pl = proposeLadder(s, ex.id);
      if (!pl) continue;
      const rid = `ladder_${ex.id}`;
      s.proposals = s.proposals || [];
      if (s.proposals.some((x) => x && x.rid === rid)) continue;   // open, resolved or dismissed — never re-file
      s.proposals.push({
        rid, id: _freshId("ladder_"), d: isoOf(todayStart()),
        title: `${String(ex.n).toUpperCase()} — ${pl.rungs.length} REAL RUNGS`,
        why: `Every weight here is one you have already lifted on ${ex.n}: ${pl.rungs.join(", ")}. The gaps are ${pl.gaps.join(", ")} lb, which the authored ${pl.inc} lb step does not divide — so the engine has been proposing loads this machine may not make. Approving this makes every earn, reset and forecast land on a weight that exists. Nothing about your current load changes except snapping it to the nearest real rung at or below it.`,
        apply: { kind: "ladder", exId: ex.id, rungs: pl.rungs },
        resolved: false,
      });
      touched = true;
    }
    return touched ? s : null;
  } catch (e) { return null; }
}

// Copied from frozen src/app.jsx @ fe516c1:1602-1632.
function sessionFromDraft(s, iso, slp, dr, base) {
  if (!base || !dr) return base;
  /* R3(c) fix-2 — a REAL pre-upgrade draft carries no ids: its captured lifts
     ARE its reps keys, in capture order, and the rest of its day rides behind
     them (the untyped old order is genuinely unrecorded — appending the
     current day's remaining lifts is the honest reconstruction, stated here
     rather than invented). Captured SET SLOTS are preserved: a draft's reps
     array length is its slot count, whatever the live config says now. */
  const capIds = Array.isArray(dr.ids) && dr.ids.length ? dr.ids
    : (dr.reps && typeof dr.reps === "object" && Object.keys(dr.reps).length
        ? [...Object.keys(dr.reps), ...(base.ex || []).map((e9) => e9.id).filter((id9) => !(id9 in dr.reps))]
        : null);
  if (!capIds) return base;
  const byId = {};
  for (const e9 of (base.ex || [])) byId[e9.id] = e9;
  const ex9 = capIds.map((id9) => {
    let card9 = byId[id9];
    if (!card9) {
      const rec9 = (s.exercises || []).find((x9) => x9 && x9.id === id9);
      if (!rec9) return null;
      /* the captured lift finishes under the plan it started on: targets from
         its own last line, no chase invented, nothing quarantined */
      const tgt9 = Array.isArray(rec9.last) && rec9.last.length ? rec9.last.slice(0, rec9.sets || rec9.last.length) : new Array(Math.max(1, rec9.sets || 1)).fill(0);
      card9 = { id: rec9.id, n: rec9.n, w: rec9.w, tgt: tgt9, note: "captured mid-session before the plan changed — it finishes under the plan it started on", isDebutNow: false, setup: rec9.setup, live: null, runway: null, prev: rec9.lastMeta || null };
    }
    const capN9 = dr.reps && Array.isArray(dr.reps[id9]) ? dr.reps[id9].length : null;
    if (capN9 && Array.isArray(card9.tgt) && card9.tgt.length !== capN9) card9 = { ...card9, tgt: capN9 <= card9.tgt.length ? card9.tgt.slice(0, capN9) : [...card9.tgt, ...new Array(capN9 - card9.tgt.length).fill(0)] };
    return card9;
  }).filter(Boolean);
  return ex9.length ? { ...base, ex: ex9, frozenIds: true } : base;
}

// Copied from frozen src/app.jsx @ fe516c1:2341-2354.
function takeProposedDebut(s, id) {
  try {
    const q9 = (s.queue || []).find((x9) => x9 && x9.id === id && !x9.done && x9.state === "PROPOSED");
    if (!q9) return s;
    q9.state = "DEBUT";
    q9.t = String(q9.t).replace(" — TWO-RUNG DEBUT PROPOSED", " DEBUT (two-rung, your call)").replace(" — EARN PROPOSED OFF ONE SIGHTING", " DEBUT (early, your call)");
    for (const x9 of (s.queue || [])) {
      if (!x9 || x9 === q9 || x9.done || x9.kind !== "debut" || x9.exId !== q9.exId) continue;
      if (!(typeof x9.newW === "number" && typeof q9.newW === "number" && x9.newW < q9.newW)) continue;
      x9.done = true; x9.state = "SUPERSEDED";
    }
    return s;
  } catch (e) { return s; }
}

// Copied from frozen src/app.jsx @ fe516c1:2559-2777.
function completeSession(state, iso, entries, slp, extras = {}) {
  /* SPLIT items h + i — every booked entry carries its provenance: wKey (the
     config string it was performed under, for non-numeric configs) and og (the
     plan generation it was performed under; a captured draft's generation
     rides in extras.pg). Historical entries are never rewritten. */
  try {
    for (const en0 of (entries || [])) {
      if (!en0) continue;
      const ex0 = (state.exercises || []).find((x) => x && x.id === en0.id);
      if (ex0 && typeof ex0.w !== "number" && ex0.w != null && en0.wKey == null) en0.wKey = String(ex0.w);
      if (en0.og == null) en0.og = (extras && extras.pg != null) ? extras.pg : (state.planGen || 0);
    }
  } catch (e0) {}
  const s = JSON.parse(JSON.stringify(state));
  const lines = [];
  let dipCount = 0;
  const push = (t, how, op9, w9) => lines.push({ t, how, ...(op9 ? { op: op9 } : {}), ...(w9 != null ? { w: w9 } : {}) });   /* FIX split-1 (P1-8): once-per-operation receipts carry their op id into the feed; R13 fix-2: the adopt receipt carries its LOAD so the merged story can reconcile */
  const debtTag = slp.clean ? "" : " · short sleep, logged as such";
  const qFind = (pred) => s.queue.find(pred);

  entries.forEach((en) => {
    const ex = exById(s, en.id);
    if (!ex || !en.reps || !en.reps.length) return;
    const r = en.reps.map((x) => Number(x) || 0);
    const q = qFind((x) => x.exId === ex.id && !x.done && (x.kind === "debut" || x.kind === "unlock"));

    const prevMeta = ex.lastMeta;
    if (prevMeta && prevMeta.reps && String(prevMeta.w) === String(en.w) && r.reduce((a, b) => a + b, 0) < prevMeta.reps.reduce((a, b) => a + b, 0)) dipCount++;
    ex.lastMeta = { d: iso, w: en.w, reps: r.slice(), rir: en.rir ?? null, rirSets: buildRirSets(en, r.length), debt: !slp.clean };

    /* opener RIR — the honest-opener rule with teeth */
    if (en.rir != null) {
      ex.rirHist = [...(ex.rirHist || []).slice(-2), en.rir];
      if (en.rir >= 1 && ex.holdFlag) { ex.holdFlag = false; push(`${ex.n.toUpperCase()} — HOLD RELEASED`, `opener back to ${en.rir} RIR — honest again, loads can earn`); }
      const h2 = ex.rirHist.slice(-2);
      if (h2.length === 2 && h2.every((x) => x === 0)) { ex.holdFlag = true; push(`${ex.n.toUpperCase()} — RIR 0 TWICE`, "opener running hot two sessions straight — load HELD until an honest session lands"); }
    }

    /* FIX 3d — computed ONCE at the top of the walk: 3c put it above the
       reclaim branch, which left own/std and ladder — both earlier, both
       early-returning — never meeting it at all. */
    const eraFirst9 = eraFresh(s, ex.id, iso);
    if (eraFirst9) {
      /* ERA SESSION 1 RETIRES THE PRIOR-ERA STANDARDS. A standard is a claim
         about a technique; the technique changed; the claim retires with it.
         Receipts in the house register — facts, not earns. The branches below
         then skip themselves naturally (null/false conditions), and the walk
         falls through to the generic path, which logs and sets the line. */
      if (ex.reclaim) {
        ex.reclaim = null;
        push(`${ex.n.toUpperCase()} — RECLAIM LINE RETIRED`, "the line was set under the previous setup; the first session under the new one sets the line, and nothing needs winning back across a technique change", "reclaimretire:" + ex.id);   /* FIX split-1 (P1-8): one receipt per lift across offline replicas */
      }
      if (ex.std || ex.own) {
        ex.std = null; ex.own = false;
        push(`${ex.n.toUpperCase()} — STANDARD RETIRED`, "the standard was set under the previous setup; the first session under the new one sets the line", "stdretire:" + ex.id);   /* FIX split-1 (P1-8): one receipt per lift across offline replicas */
      }
    }
    /* debut lands */
    if (q && en.isDebutNow) {
      q.done = true; q.state = "ESTABLISH";
      if (q.newW != null) { ex.w = q.newW; ex.wAt = clock.nowISO(); }   /* SPLIT: the debut-land writer stamps */
      if (ex.id === "hack" && ex.pendingThird) { ex.pendingThird = false; ex.sets = 3; ex.setsAt = clock.nowISO(); }
      ex.last = r.slice(); ex.own = false; ex.std = null;
      q.gate = `Debuted ${r.join(",")}`;
      push(`${q.t} COMPLETE`, `${ex.n} at ${ex.w}: ${r.join(",")}${debtTag}`);
      return;
    }

    /* own / revert standards */
    if (ex.std && ex.own) {
      const hit = ex.std.every((n, i) => (r[i] ?? 0) >= n);
      /* This IS the confirmation. The standard was written down on a previous
         session; hitting it again is the second independent observation, which
         is the whole statistical content of the rule. Sleep used to be a third
         condition on top of it and is now gone — see NOISE_NOTE. */
      if (hit) {
        ex.own = false; const oldStd = ex.std.join(","); ex.std = null; ex.last = r.slice();
        const oq = qFind((x) => x.exId === ex.id && (x.kind === "own"));
        if (oq) { oq.done = true; oq.state = "OWNED"; }
        if (ex.id === "press") {
          const upP = nextLoad(ex);
          if (upP != null) {
            s.queue.push({ id: "q_press250", kind: "debut", exId: "press", newW: upP, t: `PRESS ${upP} DEBUT`, state: "DEBUT", gate: `Earned by repeating ${ex.w}×${oldStd}`, rule: "Coach flag before it runs — structural queue", done: false });
            push(`PRESS ${ex.w} OWNED`, `${oldStd} repeated — that is the confirmation, so ${upP} enters the queue at coach flag`);
          } else push(`PRESS ${ex.w} OWNED`, `${oldStd} repeated — but ${ex.w} is the top rung this machine makes, so there is nothing to queue`);
        } else if (ex.id === "extension") {
          s.queue.push({ id: "q_ext155", kind: "debut", exId: "extension", newW: ex.w + 5, t: `EXTENSION ${ex.w + 5} — GATE REOPENED`, state: "DEBUT", gate: `Earned this time: ${ex.w}×${oldStd}`, rule: "Queued as a structural change", done: false });
          push(`EXTENSION ${ex.w} RE-OWNED`, `${oldStd} — the ${ex.w + 5} gate reopens, earned`);
        } else push(`${ex.n.toUpperCase()} OWNED`, `${oldStd} repeated — confirmed`);
      } else push(`${ex.n.toUpperCase()} — NOT YET`, `${r.join(",")} · the standard stays ${ex.std.join(",")} · nothing loads`);
      ex.lastAttempt = r.slice();
      return;
    }

    /* reclaim standards */
    if (ex.reclaim) {
      const ok = ex.reclaim.every((n, i) => (r[i] ?? 0) >= n);
      if (ok) {
        const std = ex.reclaim.join(","); ex.reclaim = null; ex.last = r.slice();
        const rq = qFind((x) => x.exId === ex.id && x.kind === "reclaim");
        if (rq) { rq.done = true; rq.state = "RECLAIMED"; }
        const upR = nextLoad(ex) ?? (Number(ex.w) || 0);
        s.queue.push({ id: `q_${ex.id}_inc`, kind: "debut", exId: ex.id, newW: upR, t: `${ex.n.toUpperCase()} ${upR} DEBUT`, state: "DEBUT", gate: `Re-earned ${ex.w}×${std}`, rule: "Increment unlocked — queued as a structural change", done: false });
        push(`${ex.n.toUpperCase()} ${ex.w} RECLAIMED`, `${std} re-earned — increment unlocked`);
      } else push(`${ex.n.toUpperCase()} — RECLAIM CONTINUES`, `${r.join(",")} vs ${ex.reclaim.join(",")} · ${r.reduce((a, b) => a + b, 0)}/${ex.reclaim.reduce((a, b) => a + b, 0)} reps`);
      return;
    }

    /* C5/Q4 — THE LADDER BRANCH IS RETIRED. It was curl's alone (set-2 to the top of a
       rung) and it RETURNED before the earn walk, so the one lift it governed could never
       bank a sighting, never price a next load, and never graduate except by a coach flag
       a human had to read. Curl is a numeric lift now and runs the same walk as every other
       lift. The branch is kept only for a state that still carries ex.ladder from before
       the migration — patchV60 removes it, so this is dead on any migrated state. */
    if (ex.ladder && !eraFirst9) {   /* FIX 3d — a rung verdict is a comparison, and era session 1 has nothing of its own to compare against; the generic path logs and sets the line */
      const li = ex.ladder.set, val = r[li] ?? 0, prev = ex.last ? ex.last[li] : 0;
      ex.last = r.slice();
      if (val > prev) {
        if (val >= ex.ladder.top) {
          const lq = qFind((x) => x.exId === ex.id && x.kind === "ladder");
          if (lq) { lq.done = true; lq.state = "RUNG DONE"; }
          s.queue.push({ id: "q_curl_grad", kind: "info", t: "CURL 60 GRADUATION CANDIDATE", state: "COACH FLAG", gate: `Set 2 hit ${val} at 55`, rule: "Load graduations on the ladder are coach-flag territory", done: false });
          push("CURL LADDER — RUNG COMPLETE", `set 2: 55×${val} — graduation candidate queued`);
        } else push("CURL LADDER MOVED", `set 2: ${prev} → ${val} (top of rung: ${ex.ladder.top})`);
      }
      return;
    }

    /* CAGE (v7.42.1) — REALITY OUTRANKS THE FILED LADDER: an entry logged at a weight
       the config did not hold moves the config to reality — ex.w follows what was
       lifted, and an off-ladder weight MERGES into the rungs (never erasing them),
       so the ask/ladder machinery prices the next earn from where he actually is. */
    /* SPLIT item c — DEBUT LOAD ADOPTION: the first COMPLETED entry carrying a
       numeric load becomes the lift's load, atomically with its stamp. A
       blank-load completion does not consume adoption. */
    if (typeof en.w === "number" && ex.w == null) {
      ex.w = en.w; ex.wAt = clock.nowISO();
      push(`${ex.n.toUpperCase()} — LOAD ADOPTED AT ${en.w}`, "First completed load under the new lift: " + en.w + " is the working load now; targets build from what this session gives.", "adopt:" + ex.id, en.w);   /* FIX split-1 (P1-8): op-keyed — post-merge, exactly ONE debut receipt survives (the earliest), and the other session reconciles to session two */
    } else if (typeof en.w === "number" && typeof ex.w === "number" && en.w !== ex.w) {
      const r0 = loadRungs(ex);
      if (r0 && r0.indexOf(en.w) < 0) { ex.steps = [...new Set([...r0, en.w])].sort((a9, b9) => a9 - b9); ex.stepsAt = clock.nowISO(); }
      /* Hunt 4 — the vector shifts by the same delta the load moved, whether the load arrived
         through a queued debut or through the athlete simply logging a different weight. The
         per-set line is a shape, not a set of independent numbers: it steps uniformly. */
      if (Array.isArray(ex.wSets) && typeof ex.w === "number") ex.wSets = ex.wSets.map((x9) => x9 + (en.w - ex.w));
      push(`${ex.n.toUpperCase()} — LOGGED AT ${en.w} (plan said ${ex.w})`, "Reality outranks the filed ladder: the lift now lives at " + en.w + (r0 ? ", and the rung joined the ladder" : "") + ".");
      ex.w = en.w; ex.wAt = clock.nowISO(); ex.topAt = null; ex.topRun = 0;   /* a new load starts its own sighting record; SPLIT: every w-writer stamps */
    }
    /* generic progression + earn */
    /* R20b — NEW-SET GRACE. A slot with NO prior value on file (created by an approved
       volume push; prevMeta is the record of what existed before) banks whatever it
       gives for its debut — the DEBUT precedent, hack's pendingThird — instead of a
       padded target failing the whole session's TARGET MET read (press 8/09 [8,8,7,4]:
       three sets met, the brand-new 4th's padded 6 read the session as a silent miss,
       twice in four days). The grace lasts until the slot posts its first value — this
       session IS that first value, so next time prevMeta covers the slot and the anchor
       machinery owns it. DERIVED, no state key: the rule is 'no history at this index'. */
    const graceFrom = prevMeta && Array.isArray(prevMeta.reps) ? prevMeta.reps.length : 0;
    const graceIdx = r.map((_, i) => i).filter((i) => i >= graceFrom && i < r.length && en.tgt && i < en.tgt.length && graceFrom < r.length);
    const tgtMet = en.tgt && en.tgt.every((t2, i) => (i >= graceFrom && graceFrom < r.length) || (r[i] ?? 0) >= t2);
    if (graceIdx.length && graceFrom > 0) push(`${ex.n.toUpperCase()} — NEW SET, BANKS WHAT IT GIVES`, graceIdx.map((i) => `set ${i + 1}: ${r[i]}`).join(" · ") + " — a slot the volume push just created has no line to miss; what it gives today IS the line, and the anchor machinery owns it from the next session.");
    /* FIX 3c — the era's FIRST session banks nothing: every comparator below
       (ex.last, lastMeta, topRun, beatsNoise's prev) is a prior-era cache, and
       an earn against a different technique is a protocol change wearing a
       strength costume. The session logs normally and BECOMES the line. */
    const atTop = !eraFirst9 && atTopOfWindow(r, ex, s, iso);   /* eraFirst9 hoisted above the reclaim branch — one guard, every earn; C15 — judged on the progression-bearing prefix */
    ex.last = r.slice();
    const upNext = typeof ex.w === "number" ? nextLoad(ex) : null;
    /* R18b — A SIGHTING BANKS EVEN WHEN NO NEXT LOAD IS ON FILE. upNext==null used to
       skip this whole block, so topAt/topRun never wrote and the maxed rider's 8/07
       hack sighting was never banked — demanding two NEW ones later would prescribe
       below what was delivered. The earn itself still waits for a load to earn INTO;
       the RECORD of having topped the window does not. */
    if (atTop && typeof ex.w === "number") earnWalk(s, ex, en, r, prevMeta, push, iso);   /* R13 fix-2 — the ONE walk; the replay calls the same function */
    if (!(atTop && typeof ex.w === "number" && upNext != null)) {
      if (!atTop && typeof ex.w === "number" && String(ex.topAt) === String(ex.w)) { ex.topRun = 0; }   /* R18b — reset only on falling OFF the top; a no-next-load sighting banked above must survive this line */
      /* R20b ruling (audit low note, ruled at merge): a lift with NO history grades every
         slot as graced — DEBUT-consistent — but TARGET MET would overclaim: no line
         existed to meet. The first outing gets its own honest receipt instead. */
      /* C6 — a bodyweight lift has no numeric load, and ${en.w} printed the string "null"
         on hanging's receipts. Print the load if there is one, the key if that is what the
         lift carries, and an em dash otherwise — never the word null. */
      const wShow9 = en.w != null && en.w !== "" ? en.w : (en.wKey != null && en.wKey !== "" ? en.wKey : "—");
      if (tgtMet && graceFrom === 0 && r.length) push(`${ex.n.toUpperCase()} — FIRST OUTING, BANKS WHAT IT GIVES`, `${wShow9} × ${r.join(",")} — no line existed to meet; this IS the line everything later is measured against.`);
      else if (tgtMet) push(`${ex.n.toUpperCase()} — TARGET MET`, `${wShow9} × ${r.join(",")}`);
    }

    /* rows special: establish → earn 185 via 10,10 handled by generic atTop (hi=10) */

    /* hot opener heuristic */
    if (en.tgt && en.tgt.length >= 2 && r[0] > en.tgt[0] + 1 && (r[en.tgt.length - 1] ?? 0) < en.tgt[en.tgt.length - 1] - 1)
      push(`${ex.n.toUpperCase()} — HOT OPENER?`, `set 1 ran ${r[0]} vs ${en.tgt[0]} and the tail gave it back`);
  });

  const niggles = extras.niggles || [];
  /* `pace` — see PACE_NOTE. Written on every session from here on; deliberately
     NOT back-filled onto older ones, because there is nothing to back-fill and
     law 12 forbids a field that buys no attribution. Absent reads as unknown. */
  s.sessionLog[iso] = { entries: entries.map((e) => { const ex2 = s.exercises.find((x) => x.id === e.id); return { id: e.id, reps: e.reps, rir: e.rir ?? null, rirSets: buildRirSets(e), w: ex2 && typeof ex2.w === "number" ? ex2.w : null, ...(e.wKey != null ? { wKey: e.wKey } : {}), ...(e.og != null ? { og: e.og } : {}) }; }), at: clock.nowMs(), note: extras.note || "", niggles, dips: dipCount, skipped: extras.skipped || [], pace: extras.pace === "rushed" || extras.pace === "normal" ? extras.pace : null };
  if (extras.pace === "rushed") push("RUSHED SESSION — LOGGED AS SUCH", "reps still count; this day cannot count toward a stall, because short rest lowers volume load on the later sets");
  if ((extras.skipped || []).length) push("SKIPPED — " + extras.skipped.map((k) => { const ex3 = exById(s, k.id); return ex3 ? ex3.n : k.id; }).join(", "), "your call, on the record — zero phantom reps, nothing counted");
  const cutoff = isoOf(new Date(mk(iso).getTime() - 21 * DAY));
  const counts = {};
  Object.entries(s.sessionLog).forEach(([d, sl]) => { if (d >= cutoff) (sl.niggles || []).forEach((j) => { counts[j] = (counts[j] || 0) + 1; }); });
  /* R14 audit — THIS WAS A BIRTH-SITE BYPASS. The choke point lives in propose(), inside
     runAdaptive; this producer pushed a kind:"note" card straight into s.proposals from
     completeSession, so a joint hitting 3 flags in 3 weeks would have seated a note in the
     R14 inbox — reachable in production, driven by the audit's fixture. Same rule applied
     here: information is a feed line, deduped by title within 14 days, content intact. */
  Object.entries(counts).forEach(([j, c]) => {
    if (c >= 3) {
      const nTitle = `${j.toUpperCase()} — 3 FLAGS IN 3 WEEKS`;
      const dup = (s.feed || []).some((f) => f && f.t === nTitle && f.d && (mk(iso) - mk(f.d)) / DAY < 14);
      if (!dup) s.feed.unshift({ d: iso, t: nTitle, how: `${j} has been flagged after ${c} sessions inside three weeks. Nothing changes automatically — a recurring niggle is information for you and your coach, and the pattern is the point: one sore day is a day, three is a signal.` });
    }
  });
  lines.forEach((l) => s.feed.unshift({ d: iso, t: l.t, how: l.how, ...(l.op ? { op: l.op } : {}), ...(l.w != null ? { w: l.w } : {}) }));
  return { s, lines };
}

// Copied from frozen src/app.jsx @ fe516c1:3672-3702.
function applyRead(state, iso, w, opts) {
  const s = JSON.parse(JSON.stringify(state));
  if (s.reads.some((r) => r.d === iso)) return s;
  const sealed = daysUntil(s.blackout.until) > 0;
  /* off-window: today's read after the window closed — accepted, never refused, but it
     rides beside the trend rather than inside it (the sealed precedent). */
  const offW = iso === isoOf(todayStart()) && !readWindow(s, opts && opts.hour).open && !readWindow(s, opts && opts.hour).hasRead && !sealed;
  const dRaw = w - s.trend, dCl = Math.max(-1.5, Math.min(1.5, dRaw));
  const spike = Math.abs(dRaw) > 1.5;
  const clean = s.reads.filter((r) => !r.sealed && !r.offWindow);
  const dl = [];
  for (let i = 1; i < clean.length; i++) { if (Math.round((mk(clean[i].d) - mk(clean[i - 1].d)) / DAY) === 1) { const dd = clean[i].w - clean[i - 1].w; if (Math.abs(dd) < 1.5) dl.push(dd); } }
  const nf = dl.length >= 8 ? Math.sqrt(dl.reduce((a, b) => a + b * b, 0) / dl.length) : null;
  const ydl9 = (s.dailyLogs || {})[isoOf(new Date(mk(iso).getTime() - DAY))] || {};
  const water9 = ydl9.sodium === "high" || (ydl9.alc || 0) > 0 ? "salt or alcohol yesterday — water noise likely" : "";
  const base9 = sealed ? "sealed — excluded from trend" : spike ? "spike — damped in trend" : nf && Math.abs(dRaw) <= nf ? "inside your noise — not information" : "";
  const note9 = offW ? ["late read — set aside", water9, base9].filter(Boolean).join(" · ") : (water9 && base9 ? water9 + " · " + base9 : water9 || base9);   /* the salt/alcohol explanation is honest information whatever the hour */
  const row9 = { d: iso, w, sealed, pt: s.trend, note: note9 };
  if (offW) row9.offWindow = true;
  s.reads.push(row9);
  /* SCALE-1 — ONE receipt per day, op-keyed and idempotent: a re-logged read (the
     capture sheet's update path, the morning minute's re-tap) used to file a fresh copy
     each time — his 8/18 carried five. The receipt belongs to the day's read: any
     earlier copy goes before the new one is written, and undoRead removes it with the
     read. "LATE", not "EVENING": the window can close at noon or after a session, and
     the line must not claim an hour it did not see. */
  s.feed = s.feed.filter((f) => !(f && f.op === "lateread:" + iso));
  if (offW) s.feed.unshift({ d: iso, op: "lateread:" + iso, t: "LATE READ — SET ASIDE", how: LATE_READ_HOW });
  if (!sealed && !offW) s.trend = +(s.trend + 0.3 * dCl).toFixed(1);
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:4045-4065.
function proteinTargetForRegime(s, regimeKey) {
  const base = proteinTarget(s);
  if (regimeKey !== "accretionBound") return { ...base, regime: regimeKey || "unknown", basis: "deficit — sparing lean mass under restriction" };
  const bwLb = (s && s.trend) || (s && s.reads && s.reads.length ? s.reads[s.reads.length - 1].w : null);
  if (!bwLb) return { ...base, regime: regimeKey, basis: "deficit figure held — no bodyweight to price the surplus figure from" };
  const bulkG = Math.round(BC.BULK_PROTEIN_G_PER_KG_BW * (bwLb / 2.2046));
  /* Math.MAX, and the reasoning is not "more is safer".
     Morton 2018s 1.6 g/kg BW is where the MPS benefit SATURATES. It is a floor
     below which you are leaving hypertrophy on the table — it is not a cap, and
     treating it as one is what the previous Math.min did: min(175, 118) = 118,
     a 57 g/day DROP on entering a surplus, while the comment claimed the cut
     figure stayed the ceiling. The comment and the code disagreed and the code won.

     Under THIS objective a higher intake is actively better in a surplus: protein
     displaces energy that would otherwise arrive as fat or carbohydrate, so it
     lowers the fat fraction of gained tissue at no hypertrophy cost. Maximising
     [FFM(T)-FFM(0)] - [FM(T)-FM(0)] therefore wants the HIGHER of the two figures,
     not the lower. */
  return { ...base, g: Math.max(base.g != null ? base.g : bulkG, bulkG), bulkG, floorG: bulkG, regime: regimeKey,
    basis: "surplus — Morton 2018 1.6 g/kg bodyweight is a saturation FLOOR, not a cap. Protein never drops below it, and the cut figure is kept when it is higher because protein displaces energy that would otherwise land as fat" };
}

// Copied from frozen src/app.jsx @ fe516c1:5821-5828.
function bhFDR(pvals, q = 0.1) {
  const idx = pvals.map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p);
  const m = idx.length;
  let kMax = -1;
  idx.forEach((x, r) => { if (x.p <= ((r + 1) / m) * q) kMax = r; });
  const keep = new Set(idx.slice(0, kMax + 1).map((x) => x.i));
  return { keep, nKept: keep.size, crit: kMax >= 0 ? idx[kMax].p : null, m, q };
}

// Copied from frozen src/app.jsx @ fe516c1:6390-6395.
function sleepSpanH(bed, wake, awakeMin = 0) {
  const m = (t) => { const [h2, m2] = t.split(":").map(Number); return h2 * 60 + m2; };
  let span = m(wake) - m(bed);
  if (span <= 0) span += 1440;
  return Math.max(0, +(((span - awakeMin) / 60)).toFixed(2));
}

// Copied from frozen src/app.jsx @ fe516c1:6397-6397.
function parseHM(t2) { const [a3, b3] = (t2 || "12:00").split(":").map(Number); return a3 + (b3 || 0) / 60; }

// Copied from frozen src/app.jsx @ fe516c1:6401-6406.
function todayCaff(s) {
  const e2 = (s.caffLog || []).find((x) => x.d === isoOf(todayStart()));
  if (e2) return { mg: e2.mg, atH: parseHM(e2.at), at: e2.at, logged: true };
  if (s.sleep && s.sleep.caffMg != null) return { mg: s.sleep.caffMg, atH: 12, at: "12:00", logged: false };
  return null;
}

// Copied from frozen src/app.jsx @ fe516c1:6407-6412.
function caffAt(mg, doseHour, atHour) {
  if (!mg) return 0;
  let dt = atHour - doseHour;
  if (dt < 0) dt += 24;
  return Math.round(mg * Math.pow(0.5, dt / 5));
}

// Copied from frozen src/app.jsx @ fe516c1:6430-6445.
function fadeRead(reps) {
  /* R15 debrief: the return is typed {k, t} — k decides the glyph rail. A shape that
     asks for a change (climbed / peaked / steep drop) is an OBSERVATION (▸); an
     expected shape (flat / barely / normal fade) is a FADE (·). The sentences are
     untouched — tools/debrief-words.json holds them frozen. */
  if (reps.length < 2) return null;
  const first = reps[0], last = reps[reps.length - 1], drop = first - last;
  const peak = Math.max(...reps), peakAt = reps.indexOf(peak);
  const seq = reps.join(" → ");
  if (last > first) return { k: "observation", t: `Sets went ${seq} — you climbed into it. Set ${reps.length} beat set 1, which usually means set 1 was a warm-up in disguise: start heavier, or take the opener closer in.` };
  if (peakAt > 0 && peak > first) return { k: "observation", t: `Sets went ${seq} — you peaked on set ${peakAt + 1}, not set 1. The opener left something behind.` };
  if (drop === 0) return { k: "fade", t: `Sets went ${seq} — dead flat. Nothing was near the limit; the whole lift had room.` };
  if (drop <= 1) return { k: "fade", t: `Sets went ${seq} — barely faded. Strength held to the end, so the last set was not the wall.` };
  if (drop >= Math.max(3, Math.round(first * 0.3))) return { k: "observation", t: `Sets went ${seq} — a steep drop of ${drop}. Those back sets cost full price; that is fatigue, not weakness.` };
  return { k: "fade", t: `Sets went ${seq} — a normal fade of ${drop}.` };
}

// Copied from frozen src/app.jsx @ fe516c1:6446-6653.
function sessionDebrief(s, iso) {
  const sess = s.sessionLog[iso];
  if (!sess) return null;
  const dates = Object.keys(s.sessionLog).sort();
  const wasClean = cleanAtDate(s, iso);
  const night = s.sleep.nights.find((n) => n.d === isoOf(new Date(mk(iso).getTime() - DAY)));
  const rushedDay = paceRushed(sess);
  let sessLoad = 0, prevSessLoad = 0;
  const marks = { up: [], down: [], pr: [], hot: [], room: [], unrated: [] };
  const whys = [];
  const lifts = (sess.entries || []).map((e) => {
    const ex = exById(s, e.id);
    const name = nameAt(s, e.id, iso);   /* FIX 3a item 2 — the name the ERA used: a July strapless session never re-renders under the hooks name */
    const eraOk = (d9) => sameEra(forksOf(s, e.id), d9, iso);   /* FIX 3a item 3 — one era test for every historical walk below */
    const reps = e.reps || [];
    const tot = reps.reduce((a, b) => a + b, 0);
    /* R15 DEBRIEF CONTRACT — typed output, identical words. lines[] carries only the
       middle species ({k, t}); delivered / next / work are their own fields so the UI
       can build the row grammar without parsing sentences. debriefWords() flattens the
       typed shape back to the exact legacy strings — tools/debrief-words.json is the
       words freeze, compared in the suite on both frozen snapshots. */
    const lines = [];
    /* FIX P1-4 — retained, LABELED, never silently comparable: a session inside
       the latest era but before the pins were filled says what it is. */
    try {
      const exL = (s.exercises || []).find((x9) => x9.id === e.id);
      const fkL = forkFrom(s, e.id);
      /* FIX split-1 (P1-6) — pin-gated, not fork-gated: a NEW lift (no fork,
         unfilled pins) reads provisional exactly like a forked one. The stamp
         still outranks live pins, and a pin-free unstamped lift was never
         uncalibrated. */
      /* the pins themselves have a birthday: the [PIN]-carrying cue arrived with
         its setupAt. A session logged before the pinned cue EXISTED cannot be
         "before calibration" — that gate is what keeps the label off pre-cue
         history (and off the frozen words). The lift's own name rides the line
         so the must-differ debrief law holds when several lifts qualify. */
      const pinBorn = pinsBornOf(exL);   /* R11 fix-4: the IMMUTABLE birthday — reading setupAt let the lawful pin-fill write move the boundary and erase history's provisional status */
      const calL = exL && exL.calibratedAt ? String(exL.calibratedAt).slice(0, 10) : null;
      /* R11-C fix-6 — THE LIVE PIN COUNT LEAVES THE CONDITION. It used to sit
         in the outer gate, so for the whole stretch between the last Pin-it
         tap and the next sweep (which is what stamps calibratedAt) the label
         VANISHED and history's provisional status flickered: present, absent,
         present. For a non-forked lift the answer is now a pure function of
         the two boundaries this round made immutable — born before it, not yet
         calibrated at it — both of which R11-A guarantees exist at every
         boundary. The birthday is REQUIRED (the old !pinBorn-or escape hatch
         is retired), so a record with no pinned cue on file never labels.

         fix-7 — BOTH LANES. Round 6 left the forked branch reading the live
         pin count, so the flicker survived there: eight of the ten pinned
         lifts are forked, and the athlete's whole legacy set kept the window
         the round had just closed for the two newborns (calves, executed:
         PRESENT / ABSENT / PRESENT across fill-then-sweep). The no-stamp case
         is now the same pure two-boundary answer in both lanes. Lane safety,
         on the record: pins still unfilled -> unchanged (was true via the
         count, now true directly) · never had a pinned cue -> no pinsBornAt,
         the outer gate already blocks · pre-fork sessions -> the iso >= fkL
         gate is untouched · stamped -> unchanged. The only behavior that
         moves is the filled-but-unswept window, which now holds the label. */
      if (pinBorn && iso >= pinBorn) {
        const provisional = (!fkL || iso >= fkL) && (calL ? iso < calL : true);
        if (provisional) lines.push({ k: "note", t: name + " logged before calibration — kept on the record, counted as provisional until its machine settings are pinned." });
      }
    } catch (eL) {}
    let delivered = null, work = null, next = null;
    let banked = false, pending = false, hot = false, dTotL = null, heavierL = false;
    try {
      const prevD = dates.filter((d) => d < iso && eraOk(d) && (s.sessionLog[d].entries || []).some((x) => x.id === e.id)).pop();   /* FIX 3a item 3 — "vs last time" means last time under the SAME technique */
      const prev = prevD ? (s.sessionLog[prevD].entries || []).find((x) => x.id === e.id) : null;
      const meta = ex && ex.lastMeta && ex.lastMeta.d < iso && eraOk(ex.lastMeta.d) ? ex.lastMeta : null;   /* FIX 3c item 2 — lastMeta is a cache with a date, and the date obeys the same era law as the log it caches */
      const baseReps = prev ? prev.reps || [] : meta ? meta.reps : null;
      const baseTot = baseReps ? baseReps.reduce((a, b) => a + b, 0) : null;
      const baseW = prev && prev.w != null ? prev.w : meta ? meta.w : null;
      const heavier = e.w != null && baseW != null && Number(e.w) > Number(baseW);
      if (baseTot != null) {
        const dR = tot - baseTot;
        dTotL = dR; heavierL = heavier;
        if (dR > 0) marks.up.push(name); else if (dR < 0) marks.down.push(name);
        const perSet = reps.map((r, i) => `${r}${baseReps[i] == null ? " (new set)" : r > baseReps[i] ? " (+" + (r - baseReps[i]) + ")" : r < baseReps[i] ? " (−" + (baseReps[i] - r) + ")" : " (=)"}`).join(" · ");
        delivered = { t: `${tot} reps, ${dR > 0 ? dR + " up on" : dR < 0 ? Math.abs(dR) + " down on" : "level with"} last time${heavier ? " — and the bar was heavier, so reps given back here are the price of the jump, not a step backwards" : ""}. Set by set: ${perSet}.`,
          w: e.w != null ? e.w : null, reps: reps.slice(), base: baseReps.slice(), tot, dTot: dR, heavier,
          /* the jump-price clause, engine-authored, so the surface never re-writes a sentence */
          jumpNote: heavier && dR < 0 ? `${Math.abs(dR)} down on last time — and the bar was heavier, so reps given back here are the price of the jump, not a step backwards.` : null, first: false };
      } else delivered = { t: `${tot} reps — first time this lift is on record, so there is nothing to judge it against yet. This is the line everything later gets measured from.`, w: e.w != null ? e.w : null, reps: reps.slice(), base: null, tot, dTot: null, heavier: false, jumpNote: null, first: true };
      if (typeof e.w === "number") {
        const load = e.w * tot;
        sessLoad += load;
        const pLoad = typeof baseW === "number" && baseTot != null ? baseW * baseTot : null;
        if (pLoad) { prevSessLoad += pLoad; const pc = Math.round(((load - pLoad) / pLoad) * 100); work = { t: `Work done: ${load.toLocaleString()} lb (${pc >= 0 ? "+" : ""}${pc}% vs last time)${heavier && pc < 0 ? " — the heavier bar has not paid for the lost reps yet; on a jump this usually turns positive within two sessions" : ""}.`, load, pc, tail: heavier && pc < 0 ? "the heavier bar has not paid for the lost reps yet; on a jump this usually turns positive within two sessions" : null }; }
        else work = { t: `Work done: ${load.toLocaleString()} lb.`, load, pc: null, tail: null };
        const allTots = dates.filter((d) => d <= iso && eraOk(d)).map((d) => {   /* FIX 3a item 3 (P1-5, confirmed) — the banked/PR comparator pools ONE era's totals: a hooked total is not a strapless PR */ const x = (s.sessionLog[d].entries || []).find((y) => y.id === e.id); return x && String(x.w) === String(e.w) ? (x.reps || []).reduce((a, b) => a + b, 0) : null; }).filter((x) => x != null);
        /* FIX 3c item 4 — does an EARLIER era hold a total >= this one at the
           same load? Then "ever" is false English, and the receipt names the
           boundary instead. Era 0 keeps the word — nothing earlier exists. */
        const crossBeaten = dates.some((d9) => { if (d9 >= iso || eraOk(d9)) return false; const x9 = ((s.sessionLog[d9] || {}).entries || []).find((y9) => y9.id === e.id); return x9 && String(x9.w) === String(e.w) && (x9.reps || []).reduce((a9, b9) => a9 + b9, 0) >= tot; });
        const recAt = crossBeaten ? "Best at " + e.w + " under the current setup" : "Best you have ever done at " + e.w;
        if (allTots.length >= 2 && tot >= Math.max(...allTots)) {
          marks.pr.push(name);
          /* The confirmation line is now sized against HIS measured spread, and
             says the arithmetic out loud. A best that clears the old line by two
             standard errors banks on the spot; one inside it waits for a repeat.
             Sleep is not part of this sentence any more — see NOISE_NOTE. */
          const prev9 = allTots.slice(0, -1);
          const te9 = typicalError(s, e.id, iso);   /* v7.53.0 (b) — a debrief re-reads its session against the era that session was performed in */
          /* P3 — unified with beatsNoise: the difference carries both sessions' error
             (the dead bn9 mis-scaled call is gone) */
          banked = !!(prev9.length && tot - Math.max(...prev9) >= 2 * Math.SQRT2 * te9.reps * Math.sqrt(Math.max(1, reps.length)));
          pending = !banked;
          lines.push(banked
            ? { k: "record", t: `${recAt} — and it clears the old line by ${tot - Math.max(...prev9)} reps against a spread of ±${te9.reps} per set, so it banks now rather than waiting for a repeat.` }
            : { k: "record_pending", t: `${recAt} — pending one repeat. Your own set-to-set spread is ±${te9.reps} reps (${te9.src}), so a margin this size cannot yet be told apart from a good day. Nothing to do with how you slept.` });
        }
      }
      const fr = fadeRead(reps);
      if (fr) lines.push(fr);
      /* RIR is said once, and only where it carries something about THIS lift. */
      const rs = rirSetsOf(e);
      const opener = rs.length ? rs[0] : null;
      const term = rs.length > 1 ? rs[rs.length - 1] : null;
      if (term != null) {
        const nS = reps.length, lastR = reps[nS - 1];
        if (term === 0) lines.push({ k: "taper", t: `Set ${nS} of ${nS} went to failure at ${lastR} reps, exactly as the taper asks — that is the set that buys the next weight.` });
        else { marks.room.push(name); lines.push({ k: "rir", t: `Set ${nS} of ${nS} stopped at ${lastR} with ${term} left. That is the set prescribed to reach failure, so ${term >= 2 ? `you paid the fatigue for roughly ${term} more reps and did not collect them` : "you were one rep short of collecting all of it"}.` }); }
      } else {
        marks.unrated.push(name);
        if (opener === 0) { marks.hot.push(name); hot = true; lines.push({ k: "rir", t: `Opener ground out at 0. That is the one reading that can freeze the load, because a grind is not an earn.` }); }
      }
      const laterPrint = dates.some((d) => d > iso && (s.sessionLog[d].entries || []).some((x) => x.id === e.id));
      if (!laterPrint && ex) {
        /* FIX split-1 (P1-9) — the next-time line derives its SLOT COUNT from
           the SESSION'S OWN entry, era-honestly: a historical debrief must not
           grow or lose slots when the LIVE set count later changes (the frozen
           8/04 calves line "11, 11, 7, 8" re-rendering as "11, 11, 7" under
           the ruled 4→3 was the driven case — frozen history rewritten by a
           live config). A session logged at the live shape reads identically. */
        const slots9 = (reps && reps.length) || ex.sets;
        const exN9 = slots9 === ex.sets ? ex : { ...ex, sets: slots9 };
        const step = progressStep(exN9, s);
        const t2 = targetsFor(exN9, s);
        /* The reason clause is collected, not printed, so that a reason shared by
           EVERY lift gets hoisted into the summary and said once. Six lifts on
           one short-sleep day used to print the same excuse six times. */
        whys.push(step.why);
        next = { targets: t2.slice(), w: ex.w, add: step.add, why: step.why, window: null, shared: false, t: null };
        const upW = typeof ex.w === "number" ? nextLoad(ex) : null;
        if (ex.hi && upW != null && !ex.std && !ex.reclaim && !ex.ladder) {
          const gate = Array.from({ length: slots9 }, (_, i) => Math.max(1, ex.hi - i));   /* FIX split-1 (P1-9): the window gate sizes to the same era-honest slot count */
          const gap = gate.reduce((a2, g, i) => a2 + Math.max(0, g - (t2[i] ?? 0)), 0);
          if (gap === 0) next.window = `That line IS the top of the window — hit it on clean sleep without grinding the opener and ${upW} queues itself.`;
          else if (step.add > 0) { const n2 = Math.ceil(gap / step.add); next.window = `${gap} more rep${gap === 1 ? "" : "s"} above that and ${upW} queues itself — about ${n2} more session${n2 === 1 ? "" : "s"} at the current step.`; }
        } else if (ex.hi && typeof ex.w === "number" && loadRungs(ex) && !ex.std && !ex.reclaim) {
          next.window = `${ex.w} is the top rung this machine makes — reps are the only progression left here until the exercise changes.`;
        }
      }
    } catch (err) { if (!delivered && !lines.length) delivered = { t: `${tot} total reps.`, w: e.w != null ? e.w : null, reps: reps.slice(), base: null, tot, dTot: null, heavier: false, jumpNote: null, first: true }; }
    /* THE MARK — engine-supplied, ONE per lift, by fixed priority (BUT HOT > RECORD
       banked > RECORD pending > HOLD > JUMP PRICE > UP / LEVEL / DOWN). The UI never
       re-derives it. FIRST is the honest label when there is no comparison at all —
       the spec ladder ends UP/LEVEL/DOWN, but a debut lift has no delta to wear;
       flagged to the audit as the one addition. */
    const hold = !!(ex && ex.holdFlag);
    const mark = hot ? "HOT" : banked ? "RECORD" : pending ? "RECORD_PENDING" : hold ? "HOLD"
      : (heavierL && dTotL != null && dTotL < 0) ? "JUMP_PRICE"
      : dTotL == null ? "FIRST" : dTotL > 0 ? "UP" : dTotL < 0 ? "DOWN" : "LEVEL";
    return { n: name, mark, delivered, lines, next, work };
  });
  const totalReps = (sess.entries || []).reduce((a, e) => a + (e.reps || []).reduce((x, y) => x + y, 0), 0);
  const sameType = dates.filter((d) => d < iso && dayType(d, s) === dayType(iso, s));   /* R19 survivor — BOTH sides typed with state: historical days keep their historical truth (dated entries), the anchor day gets its own */
  const typeTots = sameType.map((d) => (s.sessionLog[d].entries || []).reduce((a, e) => a + (e.reps || []).reduce((x, y) => x + y, 0), 0)).sort((a, b) => a - b);
  const med = typeTots.length ? typeTots[Math.floor(typeTots.length / 2)] : null;
  /* Resolve the deferred "Next time" lines. A reason every lift shares is a
     fact about the SESSION, not about any lift, so it is said once up top and
     struck from all of them. Rule 1: a line that cannot come out different for
     a different lift does not belong on the lift. */
  const sharedWhy = whys.length > 1 && whys.every((w) => w === whys[0]) ? whys[0] : null;
  lifts.forEach((L) => {
    if (!L.next) return;
    const tail = L.next.add === 0 ? " — unchanged" : ` — ${L.next.add} rep${L.next.add === 1 ? "" : "s"} added`;
    L.next.shared = !!sharedWhy;
    L.next.t = `Next time: ${L.next.targets.join(", ")} at ${L.next.w}${tail}${sharedWhy ? "" : `, because ${L.next.why}`}.`;
  });
  const loadPc = prevSessLoad ? Math.round(((sessLoad - prevSessLoad) / prevSessLoad) * 100) : null;
  const nLift = (sess.entries || []).length;
  const summary = [];
  /* The read first — one sentence saying what this session WAS. */
  summary.push((() => {
    if (marks.pr.length >= 2) return `A strong day: your best ever at this weight on ${marks.pr.length} lifts (${marks.pr.join(", ")}).`;
    if (marks.pr.length === 1) return `${marks.pr[0]} was the story — your best ever at that weight.`;
    if (loadPc != null && loadPc <= -8 && marks.down.length > marks.up.length) return `A down day: ${marks.down.length} of ${nLift} lifts gave back reps and total work fell ${Math.abs(loadPc)}%. Worth knowing why before reading anything into it.`;
    if (marks.up.length > marks.down.length) return `A quietly good day — ${marks.up.length} lifts up, ${marks.down.length} down.`;
    if (!marks.up.length && !marks.down.length) return `Baseline day — nothing here has a comparison yet.`;
    return `A holding day — ${marks.up.length} up, ${marks.down.length} down, nothing decided either way.`;
  })());
  /* Then the one thing that explains it, if there is one. */
  if (!wasClean) summary.push(`Short sleep${night ? ` (${night.h} h)` : ""} — worth about 3% on a heavy set and closer to 10% on a long one, so it is the likeliest reason for anything down here. It does not cost you anything else: the reps count, a record can still bank, and the step is still sized by what you had left. What the flag buys is that today cannot be read as a stall.`);
  else if (rushedDay) summary.push(`You logged this one rushed. Short rest costs reps on the back sets, so nothing here counts toward a stall.`);
  else summary.push(`Normal sleep, unhurried — nothing here needs discounting.${night ? ` ${night.h} h into it.` : ""}`);
  summary.push(`${nLift} lifts · ${totalReps} reps${med ? ` (your usual ${dayType(iso, s) === "U" ? "upper" : "lower"} day: ~${med})` : ""}${sessLoad ? ` · ${sessLoad.toLocaleString()} lb moved${loadPc != null ? ` (${loadPc >= 0 ? "+" : ""}${loadPc}% vs the same lifts last time)` : ""}` : ""}.`);
  /* Cross-lift reads. Each earns its place by needing more than one lift to see. */
  if (marks.room.length >= 2) summary.push(`${marks.room.length} lifts finished with reps left on the set that is meant to reach failure (${marks.room.join(", ")}). Muscle growth tracks how close a set ends to failure, so that is the cheapest thing on this page to fix — and the app has already sized bigger steps there because of it.`);
  if (nLift && marks.unrated.length === nLift) summary.push(`No last-set ratings anywhere today, so every step below defaults to a single rep. Rating the final set is what lets the app size the jump to what you actually had left.`);
  else if (marks.unrated.length >= 2) summary.push(`${marks.unrated.length} lifts have no last-set rating (${marks.unrated.join(", ")}) — those default to the smallest step until the terminal set is on file.`);
  if (marks.hot.length) summary.push(`Opener ground out at 0 on ${marks.hot.join(", ")}. Two in a row and the load holds itself — that is the governor, not a punishment.`);
  if (sharedWhy) summary.push(`Every lift here steps the same way, for the same reason: ${sharedWhy}.`);
  if (sess.niggles && sess.niggles.length) summary.push(`Watch list: ${sess.niggles.join(" · ")} — three flags in three weeks and it goes to your coach as a pattern, not a day.`);
  if (sess.note) summary.push(`Your note: \u201c${sess.note}\u201d`);
  return { lifts, summary };
}

// Copied from frozen src/app.jsx @ fe516c1:6660-6669.
function debriefWords(db) {
  if (!db) return db;
  return { summary: db.summary.slice(), lifts: db.lifts.map((L) => ({ n: L.n, lines: [
    ...(L.delivered ? [L.delivered.t] : []),
    ...(L.work ? [L.work.t] : []),
    ...L.lines.map((l) => l.t),
    ...(L.next ? [L.next.t] : []),
    ...(L.next && L.next.window ? [L.next.window] : []),
  ] })) };
}

// Copied from frozen src/app.jsx @ fe516c1:6672-6697.
function rirPlan(s, ex, slp) {
  const n = ex.sets || (ex.tgt ? ex.tgt.length : ex.target ? ex.target.length : ex.last ? ex.last.length : 3);
  let plan = Array.from({ length: n }, (_, i) => (i === n - 1 ? 0 : i === 0 ? 2 : 1));
  const why = [];
  /* The short-sleep RIR pull is deleted — see SLEEP_HOLD_NOTE in liftCall.
     Proximity to failure is THE hypertrophy variable in the dose-response
     literature; backing the terminal set off to 1 RIR on a short night traded
     the one thing that reliably drives growth for a -2.85% strength effect —
     real (CI 1.23-4.47), but smaller than his own set-to-set spread. It also fired on roughly one morning in
     three, which made "the set that reaches failure" a set that often did not.
     Effort is defended; the night is a receipt, not a governor. */
  /* Q8b — the hold asks the OPENER for two clean reps in reserve; the middle and terminal
     taper continues 1...0 so the instrument the rep step reads keeps reporting. Clamping the
     whole plan to 2 silenced the terminal RIR that sizes the next step. */
  if (ex.holdFlag) { plan[0] = Math.max(plan[0], 2); why.push("governor hold — opener stays two clean reps back; the terminal taper and the rep step continue"); }
  /* ALARM DAY (P5) — the every-0-becomes-1 rule lived only in copy; now the terminal
     set actually floors at 1 on an alarm day. Effort is modified; validity is not —
     what he delivers still counts and still banks. */
  try { const al9p = bodyAlarm(s); if (al9p) { plan = plan.map((r) => Math.max(r, 1)); why.push("alarm day — every 0 becomes a 1; delivered reps still count and bank"); } } catch (e) {}
  /* v7.53.0 JOB 1 — the failure A/B's terminal-set cap is RETIRED with the
     experiment. The research default is the standing policy: 1-2 RIR
     everywhere, an occasional all-out last set as the honesty tool. */
  const opens = Object.values(s.sessionLog).flatMap((sl) => (sl.entries || []).filter((e) => e.id === ex.id && e.rir != null).map((e) => e.rir)).sort((a, b) => a - b);
  if (opens.length >= 3 && opens[Math.floor(opens.length / 2)] <= 0) { plan = plan.map((r, i) => (i === 0 ? r + 1 : r)); why.push("your openers run hot on this lift — bank one early"); }
  return { plan, why };
}

// Copied from frozen src/app.jsx @ fe516c1:6700-6739.
function weekReview(s) {
  const endD = todayStart();
  const winStart = isoOf(new Date(endD.getTime() - 6 * DAY));
  const endISO = isoOf(endD);
  const inWin = (d) => d >= winStart && d <= endISO;
  const dls = Object.entries(s.dailyLogs).filter(([d]) => inWin(d));
  const proN = dls.filter(([, v]) => v.pro != null).length;
  const proTgtW = proteinTarget(s).lo;
  const proHit = dls.filter(([, v]) => proteinHit(proTgtW, v.pro)).length;
  const sess = Object.keys(s.sessionLog).filter(inWin);
  const wins = s.feed.filter((f) => inWin(f.d) && /OWNED|DEBUT|EARNED|RECLAIM|ZERO-COMP|RESET COMPLETE/.test(f.t));
  const nights = s.sleep.nights.filter((n) => inWin(n.d));
  const cleanN = nights.filter((n) => n.h >= s.sleep.cleanH).length;
  const fixes = s.feed.filter((f) => inWin(f.d) && f.t.indexOf("FIX WINDOW CLOSED") === 0).length;
  const holds = s.exercises.filter((e) => e.holdFlag).length;
  const cur = currentRate(s);
  const sealedNow = blackoutOn(s);
  const props = (s.proposals || []).filter((p) => !p.resolved);
  const appliedAdj = s.feed.filter((f) => inWin(f.d) && /(PROPOSAL|EASE|RATE RULE|4TH SET|UNI|OVERRIDDEN)/.test(f.t)).length;
  const adjLine = props.length
    ? `adjustments armed on NOW: ${props.slice(0, 2).map((p) => p.title || p.t || p.id).join(" · ")} — one tap applies`
    : appliedAdj
    ? `adjustments this week: ${appliedAdj} — all filed in the story, all reversible`
    : sealedNow
    ? "adjustments: rate rules muted under the seal — they re-arm with Monday's clean read"
    : "adjustments: none needed — targets moved themselves per-session, the band is holding";
  const lines = [
    `protein ${proHit}/${proN} on target${fixes ? ` · ${fixes} fix window${fixes > 1 ? "s" : ""} closed same-day` : ""}`,
    `${sess.length} session${sess.length === 1 ? "" : "s"} logged · ${wins.length} win${wins.length === 1 ? "" : "s"} filed${holds ? ` · ${holds} lift on hold` : ""}`,
    `sleep ${cleanN}/${nights.length} clean${sealedNow ? " · scale sealed — verdict Monday" : cur.measured ? ` · rate ~${cur.fat}/wk vs band ${cutRateBand(s).band.join("–")}` : ""}`,
    adjLine,
  ];
  let verdict;
  if (proN + sess.length + nights.length === 0) verdict = "A quiet week on the log — the return is the whole skill, and the door is open.";
  else if (sealedNow) verdict = "Sealed week: adherence carried it while the scale sat quarantined — Monday's read inherits a clean house.";
  else if (cur.measured && (() => { const b = cutRateBand(s).band; return cur.fat >= b[0] && cur.fat <= b[1]; })() && wins.length) verdict = "Textbook week: strength moved while the trend held the corridor.";
  else if (proN && proHit / proN >= 0.7 && sess.length >= 3) verdict = "The boring, winning kind of week — the kind that compounds.";
  else verdict = "Mixed week, honestly logged — the honest kind the analyst works from.";
  return { wk: weekDay().wk, window: `${fmtShort(winStart)} – ${fmtShort(endISO)}`, lines, verdict };
}

// Copied from frozen src/app.jsx @ fe516c1:6742-6756.
function closeEvent(s, evId, zero) {
  const ns = JSON.parse(JSON.stringify(s));
  const e = ns.events.find((x) => x.id === evId);
  if (!e) return ns;
  e.estimated = true;
  const tI = isoOf(todayStart());
  if (zero) {
    ns.zeroComp = { count: ns.zeroComp.count + 1, last: `${e.t} · ${fmtShort(e.d)}` };
    ns.feed.unshift({ d: tI, t: `ZERO-COMP EVENT #${ns.zeroComp.count}`, how: `${e.t} — estimated once, after · targets unchanged tomorrow · no penance` });
  } else {
    ns.zeroComp = { count: 0, last: `reset · ${e.t}` };
    ns.feed.unshift({ d: tI, t: "EVENT LOGGED HONEST", how: `${e.t} — off-plan, named without ceremony · streak restarts at 0 · targets unchanged tomorrow, because penance does not exist here` });
  }
  return ns;
}

// Copied from frozen src/app.jsx @ fe516c1:6758-6766.
function refeedBumps(s) {
  const out = [];
  s.reads.forEach((r) => {
    if (r.sealed || dayType(r.d) !== "REFEED") return;
    const nx = s.reads.find((x) => x.d === isoOf(new Date(mk(r.d).getTime() + DAY)) && !x.sealed);
    if (nx) out.push(+(nx.w - r.w).toFixed(1));
  });
  return out;
}

// Copied from frozen src/app.jsx @ fe516c1:6886-6914.
function theOneThing(s, slp, hour = clock.hour(), graceDays = Infinity) {
  const tISO = isoOf(todayStart());
  const owed = owedNights(s, hour);
  const slLogged = owed.length === 0;
  const dLogged = s.dailyLogs[tISO] && s.dailyLogs[tISO].cal != null;
  const dt = dayType(tISO, s);
  const trainToday = dt === "U" || dt === "L";
  const sessDone = !!s.sessionLog[tISO];
  if (!slLogged) {
    const flips = !slp.clean && slp.run + 1 >= slp.need;
    return { t: `Log ${fmtShort(owed[0])}'s night`, sub: flips ? "one tap — ≥7.5 flips you CLEAN and today's attempts count for keeps" : "one tap — the whole engine keys off it" };
  }
  if (s.fixWindow && !dLogged) return { t: "Fix window is open", sub: `hit ${proteinTarget(s).g} today and yesterday's miss becomes a save — bouncing back is the skill being scored` };
  /* r3 blocker D — routed through the ONE selector the card uses. This used to be a raw
     find() over array order while EVENT MODE showed the most overdue, so with two unfiled
     events the app said "Close out A" and its only button filed B. graceDays still bounds
     how far back this INSTRUCTION reaches; the card itself no longer expires. */
  const efOne = eventFocus(s);
  const openEv = efOne.closable && efOne.overdue && efOne.days >= -graceDays ? efOne.ev : null;
  if (openEv) return { t: "Close out " + openEv.t, sub: "zero-comp or honest — one tap, the ledger doesn't guess" };
  if (trainToday && sessDone && !dLogged && hour < 17) return { t: "Session banked ✓ — day open", sub: "numbers close it tonight · everything else is reading" };
  if (trainToday && !sessDone && hour >= 10) { const g = genSession(s, tISO, slp); return { t: "Today: " + (g.structural || g.name), sub: "log it in TRAIN when the iron's down" }; }
  if (!dLogged && hour >= 17) return { t: "Close the day", sub: "cal · protein · steps — pre-filled to targets, adjust and tap" };
  if (!dLogged) return { t: "Day open — nothing owed yet", sub: "numbers close it tonight · everything else is optional reading" };
  const lo2 = lightsOutT(s);
  /* wake reference comes off lightsOutT, which now reads his measured median
     rather than the authored 06:45 — see LIGHTS_OUT_NOTE. */
  return { t: "Everything's banked ✓", sub: (slp.clean ? "protect the streak" : "tonight rebuilds the reset") + ` — lights out ${fmt12(lo2.t)}, up ${fmt12(lo2.wakeRef || "07:30")}` };
}

// Copied from frozen src/app.jsx @ fe516c1:6917-6932.
function weekDigest(s) {
  const lw = liveRollups(s)[0];
  if (!lw) return "The digest writes itself from your first logged day — trend, protein, sessions, sleep, wins, in one paragraph.";
  const parts = [];
  const cur = currentRate(s);
  const sealedNow = daysUntil(s.blackout.until) > 0;
  parts.push(sealedNow ? `Scale sealed — trend holds at ${s.trend} until ${fmtShort(SEAL_UNTIL)}.` : cur.measured ? `Trend ${s.trend}, moving ~${cur.scale}/wk.` : `Trend ${s.trend}.`);
  if (lw.proN) parts.push(`Protein ${lw.proHit}/${lw.proN} on target${s.fixWindow ? " — one fix window open" : ""}.`);
  const wkStart = isoOf(new Date(mk(START).getTime() + (lw.wk - 1) * 7 * DAY));
  const sess = Object.keys(s.sessionLog).filter((d) => d >= wkStart).length;
  if (sess) parts.push(`${sess} session${sess > 1 ? "s" : ""} logged.`);
  const wins = s.feed.filter((f) => f.d >= wkStart && /OWNED|DEBUT|EARNED|COMPLETE|RECLAIM/.test(f.t)).slice(0, 2).map((f) => f.t.toLowerCase());
  if (wins.length) parts.push(`Wins: ${wins.join(", ")}.`);
  if (lw.avgSlp != null) parts.push(`Sleep avg ${lw.avgSlp} h.`);
  return parts.join(" ");
}

// Copied from frozen src/app.jsx @ fe516c1:7098-7118.
function debtLedger(s) {
  const seeded = s.sleep.debts.map((t) => ({ txt: t, live: false }));
  const out = [];
  const dates = Object.keys(s.sessionLog).sort();
  dates.forEach((d, di) => {
    if (cleanAtDate(s, d)) return;
    (s.sessionLog[d].entries || []).forEach((e) => {
      if (!e.reps || !e.reps.length) return;
      for (let i = di - 1; i >= 0; i--) {
        const pd = dates[i];
        if (!cleanAtDate(s, pd)) continue;
        const pe = (s.sessionLog[pd].entries || []).find((x) => x.id === e.id && x.reps && x.reps.length === e.reps.length);
        if (!pe) continue;
        const delta = e.reps.reduce((a, b) => a + b, 0) - pe.reps.reduce((a, b) => a + b, 0);
        if (delta < 0) { const ex = exById(s, e.id); out.push({ txt: `${ex ? ex.n : e.id} ${fmtShort(d)}: ${e.reps.join(",")} vs clean ${pe.reps.join(",")} — ${delta} reps after a short night`, live: true }); }
        break;
      }
    });
  });
  return [...seeded, ...out];
}

// Copied from frozen src/app.jsx @ fe516c1:7693-7705.
const INS_MAP = {
  whoosh: ["weigh-in"], refeed: ["weigh-in"], noise: ["weigh-in"], masked: ["weigh-in", "day numbers"], creep: ["day numbers"],
  regime: ["session", "weigh-in"],   /* R15g — the detector eats the lift trend and the scale rate */
  adaptmeter: ["day numbers", "weigh-in"], stepeff: ["day numbers", "weigh-in"], volconv: ["session", "your consent"], set1: ["session"], refeedroi: ["day numbers", "session"],
  tuefri: ["session"], volumeledger: ["session"], signals: ["morning"], fingerprint: ["session"], strvelocity: ["session"], sessionshape: ["session"], rirtruth: ["session"], notes: ["session"], miss: ["day numbers"],
  sleepdose: ["sleep night", "session"], sleeplag: ["sleep night", "session"], melaexp: ["sleep night"], wakesig: ["sleep night"], regularity: ["sleep night"], variancetax: ["sleep night", "session"], canary: ["sleep night", "session"],
  pulsebase: ["pulse"], cutstress: ["pulse"], pulsewarn: ["pulse"], refeedpulse: ["pulse"], furnacebase: ["temperature"], exittherm: ["temperature"],
  missarch: ["day numbers", "sleep night"], weekend: ["day numbers"], compound: ["weigh-in"], miner: ["session", "sleep night", "day numbers"],
  trialsdesk: ["your consent"], cone: ["weigh-in"], dexarecon: ["a DEXA scan"], seasonone: ["the feed"],
  ghost: ["weigh-in", "day numbers"], sentinel: ["sleep night", "day numbers", "weigh-in"], letter: ["day numbers", "the feed"], prophet: ["weigh-in"], whatif: ["weigh-in", "day numbers"], negotiator: ["weigh-in", "day numbers"], dossier: ["the whole lab"],
  ea: ["day numbers", "session", "weigh-in"], mrv: ["session"], debutmodel: ["session", "sleep night"], medswindow: ["morning", "day numbers"], forecast: ["weigh-in", "session", "day numbers"],
  spread: ["the shelf"], caffdose: ["the shelf"], creatine: ["the shelf"], matador: ["the shelf"], sleepceil: ["the shelf"],
};

// Copied from frozen src/app.jsx @ fe516c1:7892-7910.
function dossierData(s) {
  const firstLine = (t) => { const x = Array.isArray(t) ? t[0] : t || ""; const cut = x.indexOf(". "); return (cut > 25 ? x.slice(0, cut + 1) : x).slice(0, 165); };
  const pg = prophetGrades(s);
  const groups = labGroupsM(s);
  const bySh = (ids) => groups.filter((g) => ids.includes(g.id)).flatMap((g) => g.cards).filter((c) => (c.status === "LIVE" || c.status === "TRACKING") && c.id !== "dossier" && c.id !== "trialsdesk");
  const secDef = [["THE BODY", ["scale", "engine"]], ["TRAINING", ["training"]], ["SLEEP & PULSE", ["sleep", "pulse"]], ["BEHAVIOR", ["behavior"]], ["MODELS & FORECASTS", ["road", "models"]]];
  const sections = secDef.map(([h, ids]) => ({ h, items: bySh(ids).map((c) => ({ t: c.t.split(" — ")[0], line: plainify(firstLine(c.forYou || c.tag)) })) })).filter((x) => x.items.length);
  const wr = weekReview(s);
  const trials = (s.trials || []).filter((t) => !t.declined).map((t) => { const tpl = trialTpl(t); const v = trialVerdict(s, t); const arm = trialArmOn(t, isoOf(todayStart())); return { t: tpl.t, line: v.done ? `finished: ${tpl.arms[0]} ${v.a ?? "—"} vs ${tpl.arms[1]} ${v.b ?? "—"} (${v.nA + v.nB} blocks — direction, not gospel)` : arm ? `running · block ${arm.block}/${arm.of} · current arm: ${tpl.arms[arm.armIdx]}` : "scheduled" }; });
  const signoff = s.feed.filter((f) => f.d >= isoOf(new Date(todayStart().getTime() - 7 * DAY)) && /4TH SET|UNI|DEBUT|OVERRIDDEN/.test(f.t)).map((f) => f.t.toLowerCase());
  return {
    header: { d: fmtShort(isoOf(todayStart())), wk: weekDay().wk, trend: s.trend, bf: bfEst(s).pct, pace: currentRate(s).fat, sealed: blackoutOn(s) ? fmtShort(SEAL_UNTIL) : null },
    trust: pg.n >= 2 ? `Forecasts run ±${pg.mae} lb, bias ${pg.bias > 0 ? "+" : ""}${pg.bias} — read every projection through that.` : "Machine still calibrating its own forecasts — first self-grades land ~1 week in.",
    topline: plainify(`${wr.verdict} ${signoff.length ? signoff.length + " athlete-called change" + (signoff.length > 1 ? "s" : "") + " below need your sign-off." : "Nothing awaits your sign-off."}`),
    sections, trials,
    week: { verdict: plainify(wr.verdict), lines: wr.lines.map(plainify) },
    signoff,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:7911-7922.
function dossierText(s) {
  const d = dossierData(s);
  const L = [`EARNED — ANALYST DOSSIER · ${d.header.d} · wk ${d.header.wk}`,
    `Trend ${d.header.trend} lb · body fat ~${d.header.bf}% · pace ${d.header.pace} lb/wk${d.header.sealed ? ` · scale sealed until ${d.header.sealed}` : ""}`,
    `Machine trust: ${d.trust}`, "", `TOP LINE: ${d.topline}`, ""];
  d.sections.forEach((sec) => { L.push(sec.h); sec.items.forEach((it) => L.push(`  • ${it.t}: ${it.line}`)); L.push(""); });
  if (d.trials.length) { L.push("TRIALS"); d.trials.forEach((t) => L.push(`  • ${t.t}: ${t.line}`)); L.push(""); }
  L.push("THIS WEEK: " + d.week.verdict);
  d.week.lines.forEach((l) => L.push("  " + l));
  if (d.signoff.length) { L.push(""); L.push("NEEDS YOUR SIGN-OFF"); d.signoff.forEach((x) => L.push("  • " + x)); }
  return L.join("\n");
}

// Copied from frozen src/app.jsx @ fe516c1:7947-7960.
function trialArmOn(trial, iso) {
  const tpl = trialTpl(trial);
  if (!tpl) return null;
  if (!trial.started) return null;   /* defensive belt (audit note): a malformed row without a start date reads as no arm, never a throw */
  if (tpl.metric === "lift_pair") {
    /* B1 — parallel arms, constant per lift: arms[0] is the standing instruction */
    const dayP = Math.floor((mk(iso) - mk(trial.started)) / DAY);
    if (dayP < 0 || dayP >= tpl.blockDays * tpl.cycles) return null;
    return { armIdx: 0, block: Math.floor(dayP / 7) + 1, of: Math.ceil((tpl.blockDays * tpl.cycles) / 7), tpl };
  }
  const day = Math.floor((mk(iso) - mk(trial.started)) / DAY);
  if (day < 0 || day >= tpl.blockDays * tpl.cycles) return null;
  return { armIdx: Math.floor(day / tpl.blockDays) % 2, block: Math.floor(day / tpl.blockDays) + 1, of: tpl.cycles, tpl };
}

// Copied from frozen src/app.jsx @ fe516c1:8056-8064.
function activeTrial(s) {
  const tI = isoOf(todayStart());
  for (const tr of s.trials || []) {
    if (tr.declined) continue;
    const arm = trialArmOn(tr, tI);
    if (arm) return { tr, arm };
  }
  return null;
}

// Copied from frozen src/app.jsx @ fe516c1:8067-8192.
function dayProtocol(s, slp) {
  /* ---------- PROTOCOL_NOTE — what "ranked, from your data" has to mean ----------
     The header promised a ranking and the code delivered a fixed script: alarms,
     then trial, then session, then food, then sleep, then steps, truncated to
     five with no word about what fell off. Order never moved, whatever the data
     said. So it is a real ranking now: every candidate carries a weight built
     from (a) how much the evidence says the lever moves body composition and
     (b) how far HE currently sits from it. Ties break toward the safety items.

     The weights come from the size of the effects, not from taste:
     - Deficit magnitude is the dominant term. Murphy & Koehler's meta-regression
       (52 studies, 1,213 participants) puts each extra 100 kcal/day of deficit
       at -0.031 on the lean-mass effect size, with ~500 kcal/day predicted to
       blunt lean-mass gains entirely. Nothing else on this page is that big.
     - Protein scaled to FAT-FREE MASS is the next lever, and it is the one with
       an interval that excludes zero (the 2025 Bayesian deficit-protein
       meta-regression, authorship TBC — 29 studies, 729 participants: per-FFM b = 0.06 [0.01, 0.12],
       99% probability of direction; the per-bodyweight model's interval does
       NOT exclude zero). That is why the target below is computed off lean mass.
     - The session itself is the entire training stimulus, so on a training day
       it outranks everything except an alarm.
     - Sleep is his live constraint and gates whether anything counts.
     - Caffeine and steps are real but small, and they say so by ranking low.

     No silent caps: if the list is trimmed, the count that was held back is
     reported rather than quietly dropped. */
  const lead = theOneThing(s, slp, undefined, 1);
  const steps = [];
  const tI = isoOf(todayStart());
  const yISO = isoOf(new Date(todayStart().getTime() - DAY));
  const t = dayType(tI, s);
  const trainDay = t === "U" || t === "L";
  const sessDone = !!s.sessionLog[tI];
  const lastNight = s.sleep.nights.find((n) => n.d === yISO);
  const pr4 = pulseRead(s);
  const T4 = tempRead(s);
  const lo = lightsOutT(s);

  /* 1 · body alarms first — a prescription with numbers, never a mood */
  const al = bodyAlarm(s, slp);
  if (al) steps.push({ a: al.head, why: al.basis, detail: al.lines, w: 100 });

  /* 2 · trial arm */
  const at2 = activeTrial(s);
  if (at2) steps.push({ a: `Trial: ${at2.arm.tpl.arms[at2.arm.armIdx]}`, why: `${at2.arm.tpl.t.toLowerCase()} · block ${at2.arm.block}/${at2.arm.of} — the lab is measuring, just follow the arm`, w: 45 });

  /* 3 · the session */
  if (trainDay && !sessDone) {
    const g = genSession(s, tI, slp);
    if (g && g.ex && g.ex.length) steps.push({ a: `Session: ${g.ex.length} lifts`, why: (g.structural && g.structural.indexOf("NONE") !== 0 ? g.structural.toLowerCase() + " · " : "") + (slp.clean ? "rate the LAST set of each lift — that is the number that sizes the next jump" : "short sleep — the reps still count and a record can still bank; what the flag buys you is that today cannot be read as a stall. Rate the last set anyway"), w: 90 });
  }

  /* 3.5 · energy availability — the reading that outranks everything except an
     alarm when it is low, because it is the variable that decides whether the
     deficit costs him muscle. Weighted above the session deliberately: a
     session run at 20 kcal/kg FFM is not the same session. */
  const ea = energyAvailability(s);
  if (!ea.gated && (ea.band === "LOW" || ea.band === "VERY LOW" || ea.band === "MARGINAL")) {
    /* Eating first, walking second — deliberately. The trained-population
       evidence ties lean-mass loss to deficit magnitude (Murphy & Koehler 2022,
       ES -3.1e-4 per kcal/day) and has nothing at all against walking: no
       concurrent-training meta-analysis has ever included a walking arm. The old
       line called steps "the cheaper one to give back", which had it backwards. */
    const fix = ea.needKcal > 0
      ? `Closing it takes ~${ea.needKcal} kcal/day. Food is the first lever — deficit size is what the trained-population evidence actually links to lean-mass loss${ea.stepsToDrop ? `, and walking ~${ea.stepsToDrop.toLocaleString()} fewer steps is the same arithmetic if you would rather not eat it` : ""}`
      : `Nothing to close — this is the accounting question, not a shortfall`;
    steps.push({
      a: `Energy availability ${ea.ea} — ${ea.band.toLowerCase()}`,
      why: `Counting structured training only, which is the convention the ${EA_SPARING} line was built on. Counting your walking as training too gives ${ea.eaAll} — a real reading of everything you burn in a day, but against no published threshold. ${fix}. And treat ${EA_SPARING} as a direction rather than a cliff: it is extrapolated from semi-starvation work and bodybuilder case reports, and the IOC's own 2023 range for males spans 9 to 25.`,
      w: ea.band === "VERY LOW" ? 96 : ea.band === "LOW" ? 94 : 62,
    });
  }

  /* 4 · food — calories first, because deficit magnitude is the dominant term
     for body composition and it is the one number here derived from his own
     measured maintenance rather than an authored constant. */
  const ct = energyBalanceTarget(s);
  if (!ct.gated) {
    /* The rolling week, not the whole measurement window — that is the number
       that answers "am I actually eating this?", and it is the one that moves. */
    steps.push({
      a: `Calories ${ct.lo}–${ct.hi}` + (ct.provisional && !ct.gated ? " · provisional" : ""),
      why: `${ct.why}${ct.wkWhy ? " " + ct.wkWhy : ""}`,
      w: 84 + (ct.wkOff != null && Math.abs(ct.wkOff) > 120 ? 6 : 0),
    });
  }
  const pt = proteinTarget(s);
  /* Weight rises when he is near or under the evidence floor, and when he has
     crossed into the sub-group where the coefficient is largest. */
  const pW = 62 + (pt.inLeanSubgroup ? 12 : 0) + (pt.g > Math.round(pt.floor / 5) * 5 ? 10 : 0);
  if (s.fixWindow) steps.push({ a: `Protein ${pt.g} — non-negotiable today`, why: "closes the open fix window; the miss becomes a save · " + pt.why, w: pW + 15 });
  else steps.push({ a: `Protein ${pt.g}`, why: `~${Math.round(pt.g / 4)} g × 4 feeds · wake / pre-lift / post-lift / pre-bed. ${pt.why}.`, w: pW });
  if (T4.drift != null && T4.drift <= -0.4) steps.push({ a: "Eat the top of the range (1,800)", why: `your furnace runs ${T4.drift}°F under baseline — the band's ceiling exists for exactly this; still a full deficit`, w: 70 });
  /* The refeed is still on the calendar because it is his programme and the app
     does not reprogramme him — but it no longer gets a sentence claiming it
     works. See REFEED_NOTE. */
  if (dayType(isoOf(new Date(todayStart().getTime() + DAY)), s) === "REFEED") steps.push({ a: "Normal day — refeed is tomorrow", why: "no pre-saving calories tonight. Worth knowing what tomorrow does and does not buy: at a matched weekly total, the only refeed RCT in trained people did not survive independent reanalysis, and across 12 trials the resting-metabolism benefit in resistance-trained subgroups is 11 kcal/day, 95% CI −67 to +46. It is a day you enjoy, not a metabolic intervention — and it is not free, because a higher Wednesday against a fixed week is a deeper Monday.", w: 35 });

  /* 5 · repair last night, tonight */
  if (lastNight) {
    if (lastNight.h < (s.sleep.cleanH || 7.5)) steps.push({ a: `Lights out ~${fmt12((() => { let m = lo.mins - 20; if (m < 0) m += 1440; return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; })())} — 20 early`, why: `last night ran ${lastNight.h} h — one modestly early night repays most of it; up at your usual ~${fmt12(lo.wakeRef || "07:30")} (aim near it — the morning log takes whatever really happened). If you must nap: ≤25 min, before 3 pm`, w: 55 + Math.min(25, Math.round(((s.sleep.cleanH || 7.5) - lastNight.h) * 12)) });
    else if (lastNight.sol != null && lastNight.sol >= 30) steps.push({ a: `Wind-down 30 min before ${fmt12(lo.t)}`, why: `drift-off ran ${lastNight.sol} min last night — screens off, lights low; the drift is usually paying for the evening's light`, w: 50 });
    else if ((lastNight.awakeMin || 0) >= 30) steps.push({ a: "Tonight: cooler room, no fluids after ~8:30", why: `you were awake ${lastNight.awakeMin} min mid-night — the two cheapest fixes first`, w: 48 });
    else steps.push({ a: `Lights out ~${fmt12(lo.t)}${lo.override ? " (set by you tonight)" : ""}`, why: `a bearing, not a test — up ~${fmt12(lo.wakeRef || "07:30")} · ${lo.target} h asleep + ~${lo.sol} min drift-off${(() => { const melaN = s.sleep.nights.filter((n) => n.d >= ((s.sleep.melaExp || {}).started || "2026-07-23") && !(n.tags || []).includes("mela")).length; return melaN < 7 ? ` · no-melatonin night ${melaN + 1}/7 — note your drift-off` : ""; })()}`, w: 30 });
  } else steps.push({ a: `Lights out ~${fmt12(lo.t)}${lo.override ? " (set by you tonight)" : ""}`, why: `a bearing, not a test — up ~${fmt12(lo.wakeRef || "07:30")} · ${lo.target} h asleep + ~${lo.sol} min drift-off`, w: 30 });
  { const tc3 = todayCaff(s); if (tc3 && tc3.mg > 0) { const at3 = caffAt(tc3.mg, tc3.atH, lo.mins / 60); if (at3 > 50) steps.push({ a: "Caffeine: earlier or smaller", why: `~${at3} mg still aboard at lights-out${tc3.logged ? "" : " (typical dose — log today's real one on NOW)"} — above ~50 mg deep sleep measurably thins`, w: 28 }); } }

  /* 6 · floor */
  /* Walking has never been tested as an interference modality — the concurrent-
     training literature studies running and cycling, and even there hypertrophy
     interference pools at SMD -0.01 to -0.04. So steps do not cost muscle
     directly. What they do is deepen the deficit, and deficit magnitude IS the
     dominant term for lean mass. That is the honest framing, and it is why this
     ranks last rather than being cheered. */
  /* Derived, not authored — see STEP_NOTE. Ranks up when he has drifted far
     enough off the window his maintenance was measured in that the calorie band
     is quietly wrong. */
  const stT = stepTarget(s);
  steps.push(stT.gated
    ? { a: "Steps 16.5k", why: `${stT.why} Walking is the deficit's quiet engine, and no concurrent-training meta-analysis has ever included a walking arm — the interference case against it is a plausibility argument, not a finding.`, w: 22 }
    : { a: `Steps ${(stT.lo / 1000).toFixed(1)}–${(stT.hi / 1000).toFixed(1)}k`, why: `${stT.why} No trial has ever tested a step prescription in a lean trained lifter in a deficit, and no concurrent-training meta-analysis has included a walking arm, so this is arithmetic rather than an evidence claim: it holds the number your calorie target is derived from.`, w: 22 + Math.min(30, Math.round(Math.abs(stT.driftKcal) / 4)) });
  const SHOW = 5;
  steps.sort((x, y) => (y.w || 0) - (x.w || 0));
  const held = Math.max(0, steps.length - SHOW);
  return { lead, steps: steps.slice(0, SHOW), held, ranked: true };
}

// Copied from frozen src/app.jsx @ fe516c1:8195-8231.
const PLAIN_MAP = [
  ["provisional until a clean-sleep repeat", "pending until you repeat it"],
  ["logs provisional", "counts as pending for now"],
  ["log as provisional", "count as pending for now"],
  ["log provisional", "count as pending for now"],
  ["stamp provisional", "get marked pending"],
  ["provisional", "pending"],
  ["CLEAN is unreachable", "a good-sleep streak can't happen"],
  ["CLEAN unreachable", "a good-sleep streak impossible"],
  ["CLEAN stays reachable", "a good-sleep streak stays possible"],
  ["CLEAN sustainable", "the good-sleep streak holds"],
  ["needs sleep CLEAN", "needs the good-sleep streak complete (3 nights of 7.5+ h)"],
  ["sleep CLEAN", "a complete good-sleep streak"],
  ["Sleep clean", "Sleep streak complete"],
  ["CLEAN", "good-sleep streak"],
  ["own-attempts", "make-it-official attempts"],
  ["own-attempt", "make-it-official attempt"],
  ["coach-flag Monday", "a your-coach conversation Monday — the app never moves it alone"],
  ["coach-flag", "a your-coach conversation — the app never moves it alone"],
  ["stay coach-flag", "stay a your-coach decision"],
  ["nothing banks", "nothing becomes official"],
  ["everything banks", "everything becomes official"],
  ["everything here banks for real", "everything here counts as official"],
  ["it counts for real", "it counts as official"],
  ["debt-day", "short-sleep-day"],
  ["debt days", "short-sleep days"],
  ["debt day", "short-sleep day"],
  ["on debt", "on short sleep"],
  ["PRs", "records"],
  ["the governor", "the safety brake"],
  ["The governor", "The safety brake"],
  ["governor hold", "safety-brake hold"],
  ["zero-comp", "no-make-up-eating"],
  ["until owned", "until it's officially yours"],
  ["Gate passed", "Requirement met"],
  ["increment stays locked", "the weight increase stays locked"],
];

// Copied from frozen src/app.jsx @ fe516c1:8232-8238.
function plainify(t) {
  if (t == null) return t;
  if (typeof t !== "string") return t;
  let out = t;
  PLAIN_MAP.forEach(([a, b]) => { out = out.split(a).join(b); });
  return out;
}

// Copied from frozen src/app.jsx @ fe516c1:8290-8307.
function labDocket(s) {
  const flat = labGroups(s).flatMap((g) => g.cards);
  const wkAgo = isoOf(new Date(todayStart().getTime() - 7 * DAY));
  const fresh = (s.feed || []).filter((f) => f.t && f.t.indexOf("LAB LIVE — ") === 0 && f.d >= wkAgo).map((f) => ({ t: f.t.replace("LAB LIVE — ", ""), d: f.d }));
  const armed = flat.filter((c) => c.status === "ARMED" && c.prog && c.prog.need > 0);
  const withEta = armed.map((c) => {
    const pct = c.prog.n / c.prog.need;
    const lbl = (c.prog.label || "").toLowerCase();
    let days = null;
    if (lbl.indexOf("night") > -1) days = c.prog.need - c.prog.n;
    else if (lbl.indexOf("week") > -1) days = (c.prog.need - c.prog.n) * 7;
    else if (lbl.indexOf("session") > -1 || lbl.indexOf("pair") > -1) days = Math.ceil((c.prog.need - c.prog.n) * 1.75);
    return { id: c.id, t: c.t, n: c.prog.n, need: c.prog.need, pct, eta: days != null ? isoOf(new Date(todayStart().getTime() + Math.max(1, days) * DAY)) : null };
  }).sort((a, b) => b.pct - a.pct).slice(0, 3);
  const sen = flat.find((c) => c.id === "sentinel");
  const quiet = sen ? sen.forYou.indexOf("quiet") > -1 : true;
  return { fresh, next: withEta, sentinel: { quiet, txt: sen ? (quiet ? "all quiet — every recent day inside your own baselines" : sen.forYou.split(".")[0]) : "arming" } };
}

// Copied from frozen src/app.jsx @ fe516c1:8312-8312.
const STATUS_RANK = { LIVE: 0, TRACKING: 0, PROVISIONAL: 0.5, ARMED: 1, MODEL: 2, "ON FILE": 3, LOCKED: 4 };

// Copied from frozen src/app.jsx @ fe516c1:8313-8331.
function labSections(s) {
  const flat = labGroups(s).flatMap((g) => g.cards);
  const speaking = flat.filter((c) => c.status === "LIVE" || c.status === "TRACKING");
  const provisional = flat.filter((c) => c.status === "PROVISIONAL").sort((a, b) => ((b.prog ? b.prog.n / b.prog.need : 0) - (a.prog ? a.prog.n / a.prog.need : 0)));
  const gathering = flat.filter((c) => c.status === "ARMED").sort((a, b) => ((b.prog ? b.prog.n / b.prog.need : 0) - (a.prog ? a.prog.n / a.prog.need : 0)));
  const models = flat.filter((c) => c.status === "MODEL");
  const shelf2 = flat.filter((c) => c.status === "ON FILE");
  const later = flat.filter((c) => c.status === "LOCKED");
  return [
    { k: "speaking", title: `SPEAKING NOW (${speaking.length})`, sub: null, cards: speaking },
    { k: "provisional", title: `PROVISIONAL — A READING, NOT YET A VERDICT (${provisional.length})`,
      sub: "These have a number and not enough observations to stand behind it. Single-case work wants about six before a within-person finding counts; each card says how far off it is.",
      cards: provisional },
    { k: "gathering", title: `GATHERING — YOUR LOGGING FUNDS THESE (${gathering.length})`, sub: null, cards: gathering },
    { k: "models", title: `SANDBOX MODELS (${models.length})`, sub: "simulations, badged — touch, nothing real moves", cards: models },
    { k: "shelf2", title: `ON THE SHELF (${shelf2.length})`, sub: "settled science at your numbers — nothing to do here", cards: shelf2 },
    { k: "later", title: `LATER (${later.length})`, sub: null, cards: later },
  ].filter((sec) => sec.cards.length);
}

// Copied from frozen src/app.jsx @ fe516c1:8332-8340.
function labStatusList(s) {
  const flat = labGroups(s).flatMap((g) => g.cards);
  return [...flat].sort((a, b) => {
    const r = (STATUS_RANK[a.status] ?? 5) - (STATUS_RANK[b.status] ?? 5);
    if (r !== 0) return r;
    if (a.status === "ARMED" && b.status === "ARMED") { const pa = a.prog ? a.prog.n / a.prog.need : 0, pb = b.prog ? b.prog.n / b.prog.need : 0; return pb - pa; }
    return 0;
  });
}

// Copied from frozen src/app.jsx @ fe516c1:8385-8398.
const SELECTION_AUDIT = [
  { id: "calves", ok: (ex) => /near-straight knee|knee straight|standing/i.test(ex.setup || "") && !/seated|bent[- ]knee/i.test(ex.setup || ""),   /* FIX 3a item 7 — the predicate validates the LEVER (knee angle), not incidental words: seated/bent-knee wording REJECTS */
    lever: "knee angle", d: "0.88-1.58",
    right: "Standing, knee straight, with a pause in the stretch. The gastrocnemius crosses the knee, so a seated calf raise leaves it slackened and shifts the work toward the soleus — it trains soleus instead. This is the strongest selection lever in the hypertrophy literature I have read for you — one small untrained-cohort trial behind the calf number, so direction more than size — and you are on the right side of it.",
    wrong: "A seated calf raise bends the knee and slackens the gastrocnemius. Switching to a standing or leg-press calf raise is the highest-return selection change this programme has open to it (d = 0.88-1.58 in the one small untrained trial) — see the calf note in this programme." },
  { id: "ham", ok: (ex) => /seated|back \d|hips down|hips pinned/i.test(ex.setup || ""),   /* v7.53.0 — evolved WITH the cue it reads: the new setup says "back 5" and "Keep hips down" */
    lever: "hip angle", d: "seated favoured",
    right: "Seated, hips flexed, hips pinned down. Flexing the hip lengthens the hamstring across it before the knee even moves, and the lengthened position is where the growth difference lives. A lying curl leaves the hip extended and the muscle short.",
    wrong: "A lying or standing curl keeps the hip extended, so the hamstring works short. A seated curl is the better buy if the gym has one." },
  { id: "extension", ok: (ex) => /reclined|max quad stretch|seat back/i.test(ex.setup || ""),   /* v7.53.0 — the new cue says "seat fully reclined" */
    lever: "hip angle", d: "smaller, same direction",
    right: "Seat back for maximum stretch. Rectus femoris crosses the hip too, so reclining lengthens it — the same principle as the other two, with a smaller effect because three of the four quad heads are single-joint.",
    wrong: "An upright seat shortens rectus femoris. Reclining the seat back is free." },
];

// Copied from frozen src/app.jsx @ fe516c1:8399-8408.
function exerciseSelection(s) {
  const out = [];
  SELECTION_AUDIT.forEach((a) => {
    const ex = (s.exercises || []).find((x) => x.id === a.id);
    if (!ex) return;
    const good = a.ok(ex);
    out.push({ id: a.id, n: ex.n, lever: a.lever, d: a.d, good, why: good ? a.right : a.wrong });
  });
  return { items: out, allGood: out.length > 0 && out.every((x) => x.good) };
}

// Copied from frozen src/app.jsx @ fe516c1:8800-8805.
function _weeklyFreq(day9) {
  /* same fixed-week walk as programmeVolume — dayType without state, per its contract */
  const perWeek = {};
  for (let i = 0; i < 7; i++) { const t9 = dayType(isoOf(new Date(mk("2026-07-27").getTime() + i * DAY))); if (t9 === "U" || t9 === "L") perWeek[t9] = (perWeek[t9] || 0) + 1; }
  return perWeek[day9] || 0;
}

// Copied from frozen src/app.jsx @ fe516c1:9022-9139.
function volumePush(s) {
  const pv = programmeVolume(s);
  if (!pv.length) return { mode: "HOLD", why: "no designed programme to steer from" };
  const eb = energyBalanceTarget(s);
  const prog = progressionTrend(s);
  let surplus9 = false;
  try { surplus9 = phaseArc(s).key === "leangain"; } catch (e) { surplus9 = false; }
  /* A3 — the gate asks NOT FALLING, never rising */
  if (prog.state === "falling") return { mode: "HOLD", regime: eb.regime,
    why: "the pooled progression is falling — the volume gate asks for lifts NOT FALLING (stable lifts in a deficit are already a success signal), and falling fails even that. Adding sets into a falling read answers nothing" };
  let basis9 = "free";
  if (surplus9) {
    /* A6 — the surplus arm: the controlled-gain cap replaces the losing requirement */
    const rg9 = regime(s);
    const rate9 = rg9.rate;
    if (!rate9 || !isFinite(rate9.lo) || !isFinite(rate9.hi)) return { mode: "ABSTAIN", regime: eb.regime,
      why: "surplus, but no usable scale rate yet — the controlled-gain cap cannot be read, so the lever stays dormant rather than guessing" };
    const bw9 = ((s.reads || []).filter((r) => r && r.w != null).slice(-1)[0] || {}).w || s.trend;
    const gainPct9 = bw9 ? +((-rate9.scale / bw9) * 100).toFixed(2) : null;
    const gainPctMo9 = gainPct9 == null ? null : +(gainPct9 * WEEKS_PER_MONTH).toFixed(2);
    const ciMoPct9 = (rate9.ci != null && bw9) ? +(((rate9.ci / bw9) * 100) * WEEKS_PER_MONTH).toFixed(2) : null;
    /* N4 — the cap band sits below a short window's resolution: when the rate's own
       interval is wider than the cap, the honest answer is NOT YET MEASURABLE, and
       the lever HOLDs rather than guessing (longer windows/monthly aggregation read it) */
    if (ciMoPct9 == null || ciMoPct9 > GAIN_CAP_PCT_MO) return { mode: "HOLD", regime: eb.regime,
      why: "the monthly gain rate is not yet measurable at this window's resolution (interval ±" + (ciMoPct9 == null ? "?" : ciMoPct9) + "% BW/month vs a " + GAIN_CAP_PCT_MO + " cap) — the controlled-gain cap cannot be read, so the lever holds; longer windows or monthly aggregation read it" };
    if (gainPctMo9 == null || gainPctMo9 > GAIN_CAP_PCT_MO) return { mode: "HOLD", regime: eb.regime,
      why: "gaining at " + (gainPctMo9 == null ? "an unreadable rate" : gainPctMo9 + "% BW/month") + " — past the controlled-gain cap (0.25–" + GAIN_CAP_PCT_MO + "% BW/MONTH; faster gain buys mostly fat). A bigger surplus is never a reason to escalate volume faster — slow the gain first" };
    basis9 = "surplus";
  } else {
    const rg9 = regime(s);
    const rate9 = rg9.rate;
    const stalled9 = !!(rate9 && isFinite(rate9.lo) && isFinite(rate9.hi) && rate9.lo <= 0 && rate9.hi >= 0);
    const readable9 = prog.state !== "unknown";
    /* B4 — the stall arm: a stalled scale mid-cut with readable, not-falling lifts still
       permits the offer; the remaining instruments (recovery, sleep mean, budget) still
       have to be clean below. "Nothing looks wrong" suffices — the engine must not be
       more conservative than his data. */
    if (eb.regime === "free" && eb.regimeConfirmed) basis9 = "free";
    else if (stalled9 && readable9) basis9 = "stall";
    else if (eb.regime === "unknown") return { mode: "ABSTAIN", regime: "unknown",
      why: "the regime detector cannot yet read your state — a growth push is earned by measured lifts and rate, so the lever stays dormant rather than guessing" };
    else return { mode: "HOLD", regime: eb.regime,
      why: "the regime reads " + eb.regime + (eb.regimeConfirmed ? "" : " (unconfirmed)") + " and the scale is not stalled — an added set spends recovery, and the measured state says that budget is already funding something" };
  }
  const rec = recoveryIndex(s);
  if (rec.band !== "GREEN") return { mode: "WITHHELD", veto: "recovery", band: rec.band,
    why: "recovery is " + rec.band + " (" + rec.flags.map((f) => f.k).join(", ") + ") — an added set spends recovery, and the instrument says there is nothing spare. This is the ceiling working, not the lever failing" };
  /* B2 — one short night no longer gates the offer; sustained debt still does */
  if (!sleepMean3At(s, isoOf(todayStart()))) return { mode: "WITHHELD", veto: "sleep",
    why: "the 3-night sleep mean is under " + DEBT_MEAN3_H + " h — sustained debt still holds the ADD gate. One short night no longer does: the acute cost is real (−2.85% on strength, CI 1.23–4.47), just smaller than your own day-to-day spread" };
  const smw = structuralMovesThisWeek(s);
  /* A5 — THE BUDGETS DECOUPLE. The calOrSteps arm is DELETED: the scale cannot identify
     a local set-add, so a calorie or step steer never blocks a volume push (and a set-add
     never blocks a steer — stepPush's mirror arm died in the same round). Sets keep
     their OWN budget: cut = batch-then-hold, one muscle at a time; surplus = a small
     batch at the block start, then a named hold. */
  if (!surplus9) {
    if (smw.sets.length) return { mode: "WITHHELD", veto: "budget",
      why: "a volume move already landed this week — the cut's cadence is batch-then-hold, one muscle at a time, read before the next; the question returns Monday. (A calorie or step steer no longer holds this lever: the scale cannot read a set-add, so they never shared a budget)" };
  } else {
    const since28 = isoOf(new Date(todayStart().getTime() - SURPLUS_HOLD_D * DAY));
    const batch9 = _setsMovesSince(s, since28);
    if (batch9.length >= SURPLUS_BATCH_MAX) return { mode: "WITHHELD", veto: "budget",
      why: "the block's batch is placed (" + batch9.length + " adds inside " + SURPLUS_HOLD_D + " days) — surplus cadence is batch at the block start, then hold 4–6 weeks and read. A reasonable coaching experiment, not validated as optimal — and a bigger surplus is never a reason to escalate volume faster" };
    if (batch9.length === 1 && (mk(isoOf(todayStart())) - mk(batch9[batch9.length - 1].d)) / DAY > 7) return { mode: "WITHHELD", veto: "budget",
      why: "the batch window closed — the block's add landed more than a week ago, so the hold is running (" + SURPLUS_HOLD_D + " days from the add). The next batch opens at the next block start" };
  }
  /* THE CHOOSER — B3, ruled DERIVE: routing follows HIS OWN training order. He trains
     muscles in priority order within each session, so the priority list IS s.exOrder —
     zero new UI, zero new synced field, cannot drift. A muscle's rank is its best lift's
     position in its day's order; LOWEST ALLOCATION is demoted to the tie-breaker.
     Rep-velocity stays excluded from routing (E-law). Targets must be READABLE
     (AUDIT C), and engine increments target the muscle's DIRECT lift (AUDIT B). */
  const rank9 = (m) => { let best = 99; for (const L9 of (m.lifts || [])) { const ex9 = (s.exercises || []).find((e) => e && e.id === L9.id); if (!ex9) continue; const ord9 = (s.exOrder && s.exOrder[ex9.day]) || []; const i9 = ord9.indexOf(ex9.id); if (i9 > -1 && i9 < best) best = i9; } return best; };
  const cands = pv.filter((m) => !m.indirectOnly).sort((a, b) => (rank9(a) - rank9(b)) || (a.sets - b.sets));
  const skips = [];
  const picks = [];
  for (const m of cands) {
    const lifts = (m.lifts || []).map((x) => (s.exercises || []).find((e) => e && e.id === x.id)).filter((e) => e && exActive(s, e.id));   /* R6 fix-2: consumption re-projects — belt and braces with the rebuild filter */
    const direct = lifts.filter((e) => typeof e.w === "number");
    if (!direct.length) { skips.push({ mg: m.mg, why: "trend-blind — its only lift carries a non-numeric load, so the delivery read is structurally impossible; effort lives there, measurement does not" }); continue; }
    const ex = direct.reduce((a, b) => (((a.sets || 0) <= (b.sets || 0)) ? a : b));
    if (ex.holdFlag) { skips.push({ mg: m.mg, why: "its lift is held by the governor — an honest opener releases it first" }); continue; }
    if (smw.mgsTouched.indexOf(m.mg) > -1) { skips.push({ mg: m.mg, why: "a set change already touched this muscle this week, directly or through compound spillover" }); continue; }
    const vc = volumeConversion(s, ex.id);
    if (vc.status === "READING") { skips.push({ mg: m.mg, why: "its last set change is still being read (" + vc.have + "/" + vc.need + " sessions) — one increment per read, per muscle" }); continue; }
    if (vc.status === "LIVE" && vc.delivered === false) { skips.push({ mg: m.mg, why: "the last added set was never delivered at prescribed effort — effort first, then dose" }); continue; }
    if (vc.status === "LIVE" && !vc.tolerated) { skips.push({ mg: m.mg, why: "its last add is not being tolerated — the staged review (hold, verify, subtract only on repeats, pain, or recovery leaving GREEN) owns this muscle. A null read never blocks: re-eligibility keys on tolerance, not on a growth claim the instrument cannot make" }); continue; }
    const freq = _weeklyFreq(ex.day);
    if (!freq) { skips.push({ mg: m.mg, why: "no training day carries its lift" }); continue; }
    const dSess = m.sets < VOL_BANDS.floor ? Math.min(2, Math.max(1, Math.ceil((VOL_BANDS.floor - m.sets) / freq))) : 1;
    const toWk = +(m.sets + dSess * freq).toFixed(1);
    const toSess9 = (ex.sets || 1) + dSess;
    /* A4 — the per-session concentration cap, with frequency as the release valve */
    if (toSess9 > VOL_SESS_CAP) { skips.push({ mg: m.mg, why: "the session is full — " + toSess9 + " direct sets of one muscle in one session passes the per-session cap (" + VOL_SESS_CAP + "). The next set for this muscle belongs on ANOTHER day: a frequency change, which is the owner's split to change — never session bloat" }); continue; }
    if (toWk > VOL_PUSH_CEIL_WK) { skips.push({ mg: m.mg, why: "the absolute ceiling binds — " + m.sets + " weekly now, +" + (dSess * freq) + " would pass " + VOL_PUSH_CEIL_WK }); continue; }
    if (toWk > VOL_REVIEW_HI && !(vc.status === "LIVE" && vc.delivered !== false && vc.tolerated)) { skips.push({ mg: m.mg, why: "past the review zone (" + VOL_REVIEW_LO + "–" + VOL_REVIEW_HI + " weekly sets) progression is gated on this muscle's own delivered+tolerated reads, and it has none standing" }); continue; }
    /* ITEM 9 — THE HEADROOM SOFT NOTE (Joe's ruling: information on the card, never a
       brake). When the target's lift is still climbing on rep/load alone, the card says
       so — sets are the lever for when that overload exhausts. */
    let hn9 = null;
    try { const t9 = liftTrend(s, ex.id); if (t9 && t9.lo > 0) hn9 = "Context: " + ex.n + " is still climbing on rep and load alone (" + t9.pct + "%/session) — sets are the lever for when that overload exhausts. The offer stands; this is information, not a brake."; } catch (e) { hn9 = null; }
    picks.push({ mode: "PUSH", exId: ex.id, exName: ex.n, day: ex.day, mg: m.mg, zone: m.zone, dSess,
      fromSess: ex.sets || 1, toSess: toSess9, fromWk: m.sets, toWk, freq,
      ceil: VOL_PUSH_CEIL_WK, reviewZone: toWk >= VOL_REVIEW_LO, headroomNote: hn9, basis: basis9, grade: "moderate-low", skips });
    if (picks.length >= 2) break;
    continue;
  }
  const ceilBound = skips.some((x) => x.why.indexOf("ceiling") > -1);
  if (picks.length) {
    const p0 = picks[0], p1 = picks[1] || null;
    return { ...p0, alt: p1 ? { mg: p1.mg, exName: p1.exName, fromSess: p1.fromSess, fromWk: p1.fromWk } : null,
      routing: "his own training order carries it — the first-trained muscle is the priority (derived from the session order he already keeps; nothing new to maintain, nothing to drift) and lowest allocation breaks ties. Rep-velocity is never consulted for routing, so a maxed ladder cannot masquerade as responsiveness and a fresh load jump costs nothing" + (p1 ? ". " + p0.exName + " (order " + (rank9(cands.find((c) => c.mg === p0.mg)) + 1) + ") vs " + p1.exName + " — " + p0.exName + " carries it." : ".") };
  }
  return { mode: "WITHHELD", veto: ceilBound ? "ceiling" : (skips.length ? "eligibility" : "none"), skips,
    why: skips.length ? "every candidate is blocked: " + skips.map((x) => mgLabel(x.mg) + " — " + x.why).join("; ") : "no muscle is below the ceiling with a readable lift" };
}

// Copied from frozen src/app.jsx @ fe516c1:9141-9223.
function sweepVolume(s, dow7 = mk(clock.today()).getDay()) {
  /* R18f — THE DESK WAKES, DEMOTED TO A DOOR. The hygiene gate is lifted because the
     defect it guarded is gone: the desk no longer routes. Its zone triggers remain the
     WHEN; the WHICH is volumePush — the one chooser, with every house gate (the regime
     or stall read, not-falling, recovery, the sleep mean, the VOLUME budget, spillover charges, delivery reads, the
     ceiling) applied by construction because the desk now ASKS THE SAME FUNCTION.
     Gates closed → the desk files NOTHING: no desk card can ever again contradict the
     ONE-CHANGE card in the same render, because during a spent budget there is no desk
     card. The owner's-call door is the chat (the 8/07 pattern — Joe asks, cards file
     as owner's-call with consent on the record). Default offers cap at ONE per run by
     construction: the chooser returns one pick. */
  const tISO7 = isoOf(todayStart());
  const firstS = Object.keys(s.sessionLog).sort()[0];
  if (!firstS || (mk(tISO7) - mk(firstS)) / DAY < 14) return null;
  if (![0, 1].includes(dow7)) return null;
  const slp7 = sleepInfo(s);
  let ns = null;
  const cands = [];
  muscleVolume(s).forEach((m) => {
    const recent = (s.agentProposals || []).some((ap) => ap.kind === "volume" && ap.mg === m.mg) || (s.feed || []).slice(0, 80).some((f) => f.t && f.t.indexOf("VOLUME ") === 0 && f.t.indexOf("— " + m.mg.toUpperCase()) > -1 && (mk(tISO7) - mk(f.d)) / DAY < 14);
    if (recent) return;
    let dir = 0, why = "";
    if (m.zone === "UNDER" && m.p7 < VOL_BANDS.floor) { dir = +1; why = `${m.mg} has run under the retention floor (${m.n7} sets this week, ${m.p7} last week — floor is ${VOL_BANDS.floor}). One more weekly set is cheap insurance for keeping this muscle through the cut.`; }
    else if ((m.zone === "OVER" && m.p7 > VOL_BANDS.ceil) || (m.zone === "HIGH" && m.slipping >= 2 && slp7.clean) || false /* SORENESS_NOTE: the sore-blocks-volume rule is deleted. Soreness is a
       valid readout of what he DID and an invalid predictor of what he CAN DO.
       It does not track muscle damage (Schoenfeld & Contreras 2013: poorly
       correlated with strength loss, ROM, circumference and creatine kinase; MRI
       oedema peaks long after soreness does), it does not track hypertrophy
       (Damas 2016: myofibrillar protein synthesis only tracks growth once damage
       subsides), and no trial has ever shown that training a sore muscle impairs
       adaptation. The frequency literature points the other way — higher
       frequency means training muscles more often while still sore, and it
       slightly HELPS. On a four-day week with the question asked every morning,
       a sore-blocks-progression rule systematically suppresses exactly the
       muscles being trained hardest. It was an anti-progression engine. */) { dir = -1; why = m.zone === "OVER" ? `${m.mg} has run past the deficit ceiling two weeks straight (${m.n7} now, ${m.p7} last — caution starts at ${VOL_BANDS.ceil}). This house tilts toward stimulus, but two confirmed weeks over the line is the data speaking.` : (m.slipping >= 2 && slp7.clean) ? `${m.mg} sits high (${m.n7} sets) and ${m.slipping} of its lifts are slipping on clean sleep — that is your own bar speed saying this specific volume is costing more than it buys.` : `${m.mg} sits high (${m.n7} sets) and reported sore ${m.sore7} of the last 7 mornings — recovery is the constraint speaking before the bar speed does.`; }
    else if (m.zone === "IN-BAND" && m.n7 <= (VOL_BANDS.lo + VOL_BANDS.hi) / 2 && m.gaining >= 1 && m.slipping === 0 && sleepMean3At(s, tISO7) && m.sore7 <= 1) { dir = +1; why = `${m.mg} is mid-band (${m.n7} sets), every lift is holding or gaining, and the sleep mean is clean — the signals say there is headroom. One added set is the smallest honest experiment.`; }
    if (!dir) return;
    /* R18f — the +1 arm carries NO pick: the chooser owns WHICH. The -1 arm keeps its
       weakest-mover pick — giving a set back is a different question from routing an
       added one, and no ladder bias rewards the giver. */
    if (dir < 0) {
      const pool = m.vels.length ? m.vels : m.lifts.map((x) => ({ id: x.id, n: x.n, v: 0 }));
      const pick = pool.slice().sort((a, b) => (a.v ?? 0) - (b.v ?? 0))[0];
      if (!pick) return;
      cands.push({ m, dir, why, pick, sev: m.n7 - VOL_BANDS.hi });
    } else cands.push({ m, dir, why, pick: null, sev: VOL_BANDS.floor - m.n7 });
  });
  /* the +1 door: any under/headroom trigger asks the ONE chooser; the smw budget,
     regime, recovery, sleep, spillover and conversion gates all live inside it */
  const wantsUp = cands.some((c) => c.dir > 0);
  if (wantsUp) {
    const vp9 = volumePush(s);
    if (vp9.mode === "PUSH") {
      /* R18f fix3 — THE DECLINE FACE. A declined EARNED VOLUME card promised 'the lever
         stays quiet before Monday'; the desk filing the identical +1 the same day broke
         that promise (driven by the audit). Door 2's own vpDeclined check, taken here:
         a dismissed volpush_ adjustment row this week closes the desk too. */
      const dm9 = mk(clock.today()); const doff9 = (dm9.getDay() + 6) % 7;
      const mon9x = isoOf(new Date(mk(tISO7).getTime() - doff9 * DAY));
      const declined9 = (s.adjustments || []).some((a) => a && a.dismissed && a.rid && String(a.rid).indexOf("volpush_") === 0 && a.d >= mon9x);
      /* R18f fix4 — the desk's promise at its own FILING site: the trigger guard covered
         the WHEN, but the chooser re-picks by allocation, so a passed muscle could be
         refiled by ANOTHER muscle's trigger the same day (the audit drove it). The same
         feed read door 2 carries, on vp9.mg. */
      const passed9 = (s.feed || []).slice(0, 80).some((f) => f && f.t && f.d && f.t.indexOf("VOLUME PASSED — " + String(vp9.mg).toUpperCase()) === 0 && (mk(tISO7) - mk(f.d)) / DAY < 14);
      const already9 = (s.agentProposals || []).some((ap) => ap.kind === "volume" && ap.mg === vp9.mg);
      const doorOpen9 = (s.proposals || []).some((p) => p && !p.resolved && p.rid && String(p.rid).indexOf("volpush_") === 0);   /* R18f fix2 — one door files: an open EARNED VOLUME card closes this one */
      if (!already9 && !doorOpen9 && !declined9 && !passed9) {
        ns = ns || JSON.parse(JSON.stringify(s));
        ns.agentProposals = [...(ns.agentProposals || []), { id: "vol" + vp9.mg + clock.nowMs(), kind: "volume", pg: s.planGen || 0, mg: vp9.mg, exId: vp9.exId, dir: 1, title: `VOLUME +1 — ${vp9.mg.toUpperCase()} via ${vp9.exName}`, body: "The desk is awake again — one chooser, house gates. " + vp9.routing + " Weekly " + vp9.fromWk + " → " + vp9.toWk + " sets; every gate (the regime or stall read, recovery, the sleep mean, the volume budget, spillover charges, the delivery read) passed before this filed." + (vp9.headroomNote ? " " + vp9.headroomNote : ""), gatesClosed: false }];
      }
    }
    /* gates closed → silence: the ONE-CHANGE card owns that render, and the owner's-call
       door is the chat, never a default offer */
  }
  cands.filter((c) => c.dir < 0).sort((a, b) => b.sev - a.sev).slice(0, 1).forEach(({ m, dir, why, pick }) => {
    const smw9 = structuralMovesThisWeek(s);
    if (smw9.sets.length) return;   /* R18f-3, evolved by A5 — the give-back waits out VOLUME move weeks only: sets left the scale's budget, so a calorie or step steer no longer holds it */
    ns = ns || JSON.parse(JSON.stringify(s));
    ns.agentProposals = [...(ns.agentProposals || []), { id: "vol" + m.mg + clock.nowMs(), kind: "volume", pg: s.planGen || 0, mg: m.mg, exId: pick.id, dir, title: `VOLUME ${dir > 0 ? "+1" : "−1"} — ${m.mg.toUpperCase()} via ${pick.n}`, body: why + ` ${dir > 0 ? "Adds one set to " + pick.n + ", its strongest mover. The new set arrives as the final set — the effort ladder re-keys itself: it becomes the all-out set, the old final pulls back to 1 in reserve, and its rep target seeds one under your current last set." : "Removes the final set from " + pick.n + ", its weakest mover — the effort ladder re-keys to the shorter shape automatically."} Two weeks of data before the ledger revisits this muscle.`, at: tISO7 }];
  });
  return ns;
}

// Copied from frozen src/app.jsx @ fe516c1:9224-9237.
function sweepStalls(s) {
  let ns = null;
  (s.exercises || []).forEach((ex) => {
    if (typeof ex.w !== "number") return;
    if (!exActive(s, ex.id)) return;   /* FIX split-1 (P1-1): a retired lift takes no reset */
    const lc = liftCall(s, ex.id);
    if (lc.verdict !== "RESET" || !lc.newW) return;
    const already = (s.agentProposals || []).some((ap) => ap.kind === "reset" && ap.exId === ex.id) || (s.feed || []).slice(0, 40).some((f) => f.t && f.t.indexOf("RESET APPLIED — " + ex.n) === 0);
    if (already) return;
    ns = ns || JSON.parse(JSON.stringify(s));
    ns.agentProposals = [...(ns.agentProposals || []), { id: "rs" + ex.id + clock.nowMs(), kind: "reset", pg: s.planGen || 0, exId: ex.id, newW: lc.newW, title: `RESET ${ex.n} — ${ex.w} → ${lc.newW}`, body: lc.why + ` Rebuild the reps at ${lc.newW}; the bar comes back stronger than the stall left it.`, at: isoOf(todayStart()) }];
  });
  return ns;
}

// Copied from frozen src/app.jsx @ fe516c1:9245-9247.
function isLabFeedLine(f) {
  return !!(f && typeof f.t === "string" && f.t.indexOf("LAB LIVE — ") === 0);
}

// Copied from frozen src/app.jsx @ fe516c1:9248-9255.
function diaryFeed(s, n) {
  /* A3/V2 — dedupe-on-render (belt to the patchV27 guard): consecutive identical
     {d,t,how} rows render once; the record stays honest, its twin was noise */
  const rows = (s.feed || []).filter((f) => f && f.t && !isLabFeedLine(f));
  const out = [];
  for (const f of rows) { const p = out[out.length - 1]; if (p && p.d === f.d && p.t === f.t && p.how === f.how) continue; out.push(f); }
  return out.slice(0, n || 12);
}

// Copied from frozen src/app.jsx @ fe516c1:9256-9303.
function sweepLab(s, dow = mk(clock.today()).getDay()) {
  let st0 = sweepStalls(s); if (st0) s = st0;
  const ld0 = sweepLadders(s); if (ld0) s = ld0;   // inferred ladders arrive as PROPOSALS, never as applied changes
  const sv0 = sweepVolume(s); if (sv0) { s = sv0; st0 = sv0; }
  const flat = labGroups(s).flatMap((g) => g.cards);
  const seen = s.labSeen || {};
  const first = Object.keys(seen).length === 0;
  const flips = flat.filter((c) => (c.status === "LIVE" || c.status === "TRACKING") && seen[c.id] !== c.status);
  const tISO2 = isoOf(todayStart());
  const needJournal = !(s.forecasts || []).some((f) => f.d === tISO2);
  /* v7.3.0 Slice 4 — persist a TDEE snapshot per day (same idempotent cadence as the forecast journal)
     so tdeeLearned can smooth the DRIFT series and adaptationSignal can read observed-vs-mass-predicted
     over time. Only when maintenance is measurable; skipped GRACEFULLY otherwise. */
  const needTdee = (() => { try { const t = observedTDEE(s); return !!(t && t.tdee) && !(s.learned && Array.isArray(s.learned.tdee) && s.learned.tdee.some((x) => x.d === tISO2)); } catch (e) { return false; } })();
  const wkAgo2 = isoOf(new Date(todayStart().getTime() - 6 * DAY));
  const needReview = (dow === 0 || dow === 1) && !(s.feed || []).some((f) => f.d >= wkAgo2 && f.t && f.t.indexOf("WEEK IN REVIEW") === 0);
  if (!flips.length && !first && !needJournal && !needTdee && !needReview) return st0 || null;
  const ns = JSON.parse(JSON.stringify(s));
  if (needJournal) {
    const cur2 = currentRate(ns);
    const r2 = cur2.measured ? cur2.scale : 1.2;
    ns.forecasts = [...(ns.forecasts || []), { d: tISO2, trend: ns.trend, rate: r2, pred7: +(ns.trend - r2).toFixed(1), sealed: blackoutOn(ns) }].slice(-60);
  }
  if (needTdee) {
    const td2 = observedTDEE(ns, { estWeight: 0.5 });   /* N2/V2d — the learned series is the estimator surface: estimate days feed it at half weight; the live band path is untouched (THE HOLD) */
    if (td2 && td2.tdee) {
      ns.learned = (ns.learned && typeof ns.learned === "object") ? ns.learned : { tdee: [], anchors: [] };
      if (!Array.isArray(ns.learned.tdee)) ns.learned.tdee = [];
      if (!Array.isArray(ns.learned.anchors)) ns.learned.anchors = [];
      if (!ns.learned.tdee.some((x) => x.d === tISO2)) ns.learned.tdee = [...ns.learned.tdee, { d: tISO2, tdee: td2.tdee, lo: td2.lo != null ? td2.lo : null, hi: td2.hi != null ? td2.hi : null, avg: td2.avg, w: ns.trend, n: td2.days, matched: !!td2.matched }].slice(-180);
    }
  }
  if (needReview) {
    const wr = weekReview(ns);
    ns.feed.unshift({ d: tISO2, t: `WEEK IN REVIEW · WK ${wr.wk}`, how: `${wr.verdict} — ${wr.lines.join(" · ")}`.slice(0, 220) });
  }
  ns.labSeen = {};
  flat.forEach((c) => { ns.labSeen[c.id] = c.status; });
  if (!first) {
    ns.labNews = ns.labNews || [];
    flips.forEach((c) => {
      ns.feed.unshift({ d: isoOf(todayStart()), t: "LAB LIVE — " + c.t, how: (c.forYou || (c.lines || [])[0] || "the shelf turned jade — open it").slice(0, 170) });
      ns.labNews.unshift(c.t);
    });
    ns.labNews = ns.labNews.slice(0, 4);
  }
  return ns;
}

// Copied from frozen src/app.jsx @ fe516c1:9306-9793.
function runAdaptive(state, todayISO, raOpts) {
  const s = JSON.parse(JSON.stringify(state));
  normalizePlan(s);   /* FIX split-1 (P0-4) — THE SWEEP CALL SITE, moved to the head: a poisoned order must be repaired BEFORE any order-derived producer reasons about it, or the wrong card files first and normalization arrives too late to unfile it. Idempotent; ruled-order half is planGen-51-only. */
  const monday = (() => { const d = mk(todayISO); const off = (d.getDay() + 6) % 7; return isoOf(new Date(d - off * DAY)); })();
  if (!s.weekly.some((w) => w.wk === monday) && s.reads.some((r) => !r.sealed && !r.offWindow && weeksBetween(monday, r.d) >= 0 && weeksBetween(monday, r.d) < 1))
    s.weekly.push({ wk: monday, trend: s.trend });

  /* R9 — DISMISSED IS NOT APPLIED. dismissProposal files {rid, dismissed:true} and its
     feed copy promises "the engine re-arms it if the pattern that raised it holds" — but
     this gate counted ANY adjustments row, so one decline silenced a rid forever and the
     promise was false. Law 10 says a proposal he can decline, not a verdict; a decline
     that can never return IS a verdict, just a quiet one. undone rows have the same shape:
     undoAdjustment re-opens the card, and a surviving row would freeze its refresh.
     Measured on the live ledger: microload has a dismissed row and its refresh froze at
     2026-08-04; pivot has none and refreshed to 2026-08-06. Same producer loop, same days. */
  const applied = (rid) => s.adjustments.some((a) => a.rid === rid && !a.dismissed && !a.undone);
  /* An open proposal is a live recommendation, not a postcard from the day it
     was raised. The old propose() skipped entirely when one was already armed,
     so its title and receipt froze at whatever the engine said the first time —
     and after an engine change they could freeze at something the engine no
     longer computes at all. A recovery card was still reading "45/100" weeks
     after the composite score it quotes was removed for violating this app's
     own rule against composite scores. Refresh the text and the dial on
     anything he has not acted on; leave the raised-on date alone so the age of
     the flag stays honest, and never resurrect one he already applied. */
  /* R9 — ONE OPEN CARD PER SUBJECT. The dedup keyed on the EXACT rid, and half the
     producers suffix their rid with the date (ap_tighten_2026-08-02), so the same subject
     filed fresh every day and the dedup never saw it. Filing over an open subject now
     SUPERSEDES: the old card is resolved with a feed line, never silently replaced. */
  const subjectOf = (rid) => String(rid || "").replace(/_\d{4}-\d{2}-\d{2}$/, "");
  const propose = (rid, title, why, apply) => {
    /* R14 — THE INVARIANT: a card may exist in the inbox only if its tap enacts a state
       change. Everything else is a feed line. Enforced at the ONE place cards are born, so
       all ~8 note producers convert here without touching any of them.

       Four harms this closes, all previously live: a tapped note fell through to the else
       branch and wrote "ADJUSTMENT LOGGED" for an adjustment that never happened; the tap
       pushed {rid} into s.adjustments, permanently killing bare-rid channels; the inbox
       held cards where one tap ended the cut and the neighbouring tap did nothing —
       identical gesture, opposite stakes; and information could never drain, because its
       producer re-raised it as fast as any mechanism cleared it.

       Deduped against the feed itself (same title within 14 days), so a persisting
       condition informs once a fortnight instead of spamming a line per sweep — stateless,
       no new synced field, nothing for the merge to learn. */
    if (apply && apply.kind === "note") {
      const dup = (s.feed || []).some((f) => f && f.t === title && f.d && (mk(todayISO) - mk(f.d)) / DAY < 14);
      if (!dup) s.feed.unshift({ d: todayISO, t: title, how: why });
      return;
    }
    if (applied(rid)) return;
    const open = s.proposals.find((p) => p && !p.resolved && subjectOf(p.rid) === subjectOf(rid));
    if (open && open.rid === rid) { open.title = title; open.why = why; open.apply = apply; open.refreshed = todayISO; open.pg = s.planGen || 0; return; }   /* FIX split-1 (P0-4): a refresh re-derives under the CURRENT plan */
    if (open) {
      open.resolved = true; open.resolvedHow = "superseded by " + rid;
      s.feed.unshift({ d: todayISO, t: "CARD SUPERSEDED — " + subjectOf(rid).toUpperCase(), how: "a newer card on the same subject replaced it; nothing was silently dropped" });
    }
    s.proposals.push({ rid, id: `${rid}_${todayISO}`, d: todayISO, title, why, apply, resolved: false, pg: s.planGen || 0 });   /* FIX split-1 (P0-4): provenance at creation — which plan generation this card reasoned about */
  };
  /* R9 — WITHDRAW ORPHANS. R4 deleted both body-fat producers (ease2 -> kind "phase",
     pivot -> kind "exit") but their INSTANCES persist in state with LIVE apply branches:
     tapping the open pivot today would step calories to maintenance on the authority of
     the bf.lo threshold R4 judged unable to make that claim. A proposal whose producer
     was deleted must be withdrawn by the change that deleted it — otherwise it is a card
     recommending a decision the engine has already disowned. Follows the withdrawal
     precedent (SET-REALLOCATION CARD WITHDRAWN): resolved with a feed line, never deleted. */
  /* AUDIT 4 — predicate on the ORPHANED SUBJECTS BY NAME, not on the kind. A kind-ban
     justified as "producer was deleted" is coextensive with the truth today and wrong the
     day the regime detector files a deliberate exit proposal — which is its natural end
     state. That card would be stillborn on its first sweep with a feed line falsely
     blaming R4. The withdrawal names exactly what R4 orphaned and nothing else, ever. */
  /* R18f fix2 — OFFERS DO NOT OUTLIVE THE BUDGET. The budget gated producers only:
     an offer already open when a structural move landed stayed tappable beside the
     ONE-CHANGE card, and its tap enacted a second set-add into the spent week (the
     audit drove 3→4). This grooming pass runs the R4-orphan precedent across BOTH
     stores the moment any move lands: resolved with a feed line, never deleted. */
  {
    const smwG = structuralMovesThisWeek(s);
    if (smwG.sets.length) {   /* A5 — only a VOLUME move invalidates a volume offer's premise now */
      for (const p of s.proposals || []) {
        if (p && !p.resolved && p.rid && String(p.rid).indexOf("volpush_") === 0 && (p.apply || {}).budgetPremise) {
          p.resolved = true; p.resolvedHow = "withdrawn — the week's structural budget was spent after this filed";
          s.feed.unshift({ d: todayISO, t: "CARD WITHDRAWN — " + String(p.title || p.rid).slice(0, 40), how: "A volume move landed this week after this offer filed. One volume move at a time — the offer returns when it is re-earned, Monday at the earliest." });
        }
      }
      const dropG = (s.agentProposals || []).filter((ap) => ap && ap.kind === "volume");
      if (dropG.length) {
        s.agentProposals = (s.agentProposals || []).filter((ap) => !(ap && ap.kind === "volume"));
        s.feed.unshift({ d: todayISO, t: "DESK OFFER" + (dropG.length === 1 ? "" : "S") + " WITHDRAWN — the budget is spent", how: "A volume move landed this week; the desk's open volume offer" + (dropG.length === 1 ? "" : "s") + " left with it. One volume move at a time — the desk re-asks when the chooser re-earns it." });
      }
    }
  }
  const R4_ORPHANS = { pivot: 1, ease2: 1 };
  for (const p of s.proposals) {
    if (p && !p.resolved && R4_ORPHANS[subjectOf(p.rid)]) {
      p.resolved = true; p.resolvedHow = "withdrawn — producer removed by R4";
      s.feed.unshift({ d: todayISO, t: "CARD WITHDRAWN — " + String(p.title || p.rid).slice(0, 40), how: "It was produced by a body-fat threshold the app no longer trusts (R4): the estimate's interval is wider than the decision. The question it asked now belongs to the engine's phase read, which watches your lifts and scale rate instead. Nothing was deleted; this card is on the record as withdrawn." });
    }
  }
  /* R14 — the two live note cards migrate through the withdraw pattern: resolved with a
     feed line CARRYING THEIR CONTENT, never deleted. This replaces R9's note-expiry sweep
     outright — with note cards inadmissible, expiry code for them would be instance 19 of
     the safeguard nothing can reach. (The audit proved expiry could not drain a
     live-condition note anyway: the producer re-raised it in the same sweep.) */
  for (const p of s.proposals) {
    if (p && !p.resolved && p.apply && p.apply.kind === "note") {
      p.resolved = true; p.resolvedHow = "converted to feed (R14)";
      s.feed.unshift({ d: todayISO, t: p.title, how: (p.why ? p.why + " — " : "") + "Moved out of the inbox: information is a feed line now, and only decisions are cards. Nothing was deleted." });
    }
  }

  const sealed = daysUntil(s.blackout.until) > 0;
  const r = currentRate(s);
  if (!sealed && r.measured && r.rates.slice(-2).length === 2 && r.rates.slice(-2).every((x) => x < cutRateBand(s).floor))
    propose("floor_" + monday, "TWO SLOW WEEKS — YOUR RULE KICKS IN", `Weight loss ran under ${cutRateBand(s).floor} lb/wk for two straight weeks (${r.rates.slice(-2).map((x) => x.toFixed(1)).join(" and ")} lb/wk). Your rule: steps below baseline → restore them FIRST. At baseline already → steps-vs-a-~50-kcal-trim is an ADHERENCE EXPERIMENT, not a hierarchy — run whichever you will actually keep.`, { kind: "note" });

  /* STEPS ITEM B — the PUSH card. Steps first, food as the alternative: the same apply
     machinery arms both (kind cal + stepsDelta), and the athlete's pick lands as the
     existing tracked, reversible offset. Never sealed, never nagging: stepPush holds by
     default and only fires when the rate is under the corridor. */
  {
    const sp = stepPush(s);
    /* AUDIT rider: a decline must buy the WEEK on a weekly-paced lever. propose() blocks
       only APPLIED rids, so a dismissed steppush returned on the very next engine pass —
       "a no for today" was a no for zero minutes, against this producer's own no-nagging
       promise. Dismissing THIS monday's rid suppresses refiling until the monday rolls. */
  /* ---------- MAXED-LADDER RIDER — the state, said once, on the record ---------- */
  (s.exercises || []).forEach((exM) => {
    if (!maxedOut(exM) || !exM.last) return;
    /* THE NOTE MUST NOT GUESS (fix round): rungs on file and exhausted → the stack
       measurably tops out. No rungs and no inc (plate-loaded, athlete-held) → nobody
       measured a limit; the honest claim is that no NEXT load is on file. cap9 behavior
       is identical for both arms — only the claim changes. */
    const rungArm = !!loadRungs(exM);
    const titleM = String(exM.n).toUpperCase() + (rungArm ? " — THE STACK TOPS OUT AT " + exM.w : " — NO NEXT LOAD ON FILE AT " + exM.w);
    if ((s.feed || []).some((f) => f && f.t === titleM)) return;   /* once EVER — the state does not re-announce */
    propose("maxed_" + exM.id, titleM,
      rungArm
        ? "No rung above " + exM.w + " is on file for this machine, so reps are the ladder now: targets keep stepping past the old window top with the same earn discipline, and every rep above it banks like any other record. If the gym's stack actually goes higher, log the heavier weight when you use it and the ladder learns the rung — otherwise nothing needs you; this line exists so a maxed lift can never silently deadlock again."
        : "No next load is on file for this machine — it is plate-loaded, so nobody has measured a ceiling. Reps carry progression until you log a heavier weight, with the same earn discipline, and every rep past the old window top banks like any other record. Nothing needs you; this line exists so the lift can never silently deadlock.",
      { kind: "note" });
  });

  /* ---------- MISSED-READ RIDER — the priced line, once per day ---------- */
  {
    const rw = readWindow(s, raOpts && raOpts.hour);
    const todayRead = (s.reads || []).some((r) => r && r.d === todayISO);
    const already = (s.feed || []).some((f) => f && f.d === todayISO && f.t && (f.t.indexOf("MORNING READ MISSED") === 0 || f.t.indexOf("READ GAP") === 0));
    if (!sealed && !rw.open && !todayRead && !already) {
      const lastLive = [...(s.reads || [])].reverse().find((r) => r && !r.sealed && !r.offWindow);
      const gapD = lastLive ? Math.round((mk(todayISO) - mk(lastLive.d)) / DAY) : 0;
      const cr9 = currentRate(s);
      if (gapD >= 3 && cr9 && cr9.measured && cr9.lo != null && cr9.hi != null)
        s.feed.unshift({ d: todayISO, t: "READ GAP — DAY " + gapD, how: `the trend carries, wider: the measured rate now reads ${cr9.lo} to ${cr9.hi} lb/wk, and every missed morning widens that interval rather than moving any decision. Nothing is owed and nothing is counted against you — the next morning read narrows it again.` });
      else {
        const mc = missedReadCost(s);
        s.feed.unshift({ d: todayISO, t: "MORNING READ MISSED", how: mc.delta != null
          ? `the trend carries. Today it cost ${mc.delta} lb/wk of rate precision — priced by the engine, not a guilt trip; tomorrow morning is the instrument.`
          : "the trend carries — there is not yet a measured rate for a missed morning to move. Tomorrow morning is the instrument." });
      }
    }
    const spDismissed = (s.adjustments || []).some((a) => a && a.dismissed && a.rid === "steppush_" + monday);
    if (!sealed && !spDismissed && sp.mode === "PUSH")
      propose("steppush_" + monday, "UNDER THE CORRIDOR — STEPS FIRST", sp.why + " Approving arms the walking lever; the dial offers the same kcal from food if you would rather eat less than walk more. Steps lead HERE because yours sit below your own baseline — restoring them is not a new deficit. At baseline, steps-vs-a-small-trim is an adherence experiment, not a hierarchy. The credited kcal are already haircut ~25-30% for compensation.",
        { kind: "cal", calDelta: -(Math.round(((sp.netLoKcal || 0) + (sp.netHiKcal || 0)) / 2)), delta: -(Math.round(((sp.netLoKcal || 0) + (sp.netHiKcal || 0)) / 2)), stepsDelta: sp.inc, prefer: "steps" });   /* AUDIT: calDelta explicit (the label keyed on it and read undefined), prefer flips the tap routes so the PRIMARY button does what the copy promises */
    }
  }  /* The band had no teeth. floor and redline both fired, but the stated working
     band's UPPER edge did nothing — he could run above his own band for weeks
     and hear nothing until the redline, which sits far above it. His band top
     is 1.4 lb/wk; the redline is 1.9. That gap is 0.3%/wk of bodyweight, and it
     is exactly the gap Garthe 2011 measured: the 0.7%/wk arm gained +2.1% lean
     body mass while the 1.4%/wk arm was lean-neutral (−0.2%), on matched total
     weight lost. A stated band that never speaks is decoration. */
  const apBand = cutRateBand(s).band;   // v6.2.1 — "above your band" means above the SELECTED mode's slice
  const above = r.measured ? r.rates.slice(-2).filter((x) => x > apBand[1] && x < cutRateBand(s).redline) : [];
  if (!sealed && above.length === 2)
    propose("bandtop_" + monday, "RUNNING ABOVE YOUR BAND", `Two weeks at ${above.map((x) => x.toFixed(1)).join(" and ")} lb/wk, against a band that tops out at ${apBand[1]}. Not a redline — the redline is ${cutRateBand(s).redline} and nothing is on fire. But this is the range where the evidence starts charging you: matched for total weight lost, the slower arm of the closest trial kept more muscle AND lost more fat than the faster one. The cheapest fix is not food — it is steps, because they cost you nothing you are trying to keep.`, { kind: "cal", delta: 75 });
  if (!sealed && r.measured && r.rates[r.rates.length - 1] >= cutRateBand(s).redline)
    propose("redline_" + monday, "REDLINE RATE", `${r.rates[r.rates.length - 1].toFixed(1)}/wk ≥ ${cutRateBand(s).redline}. Your rule: add ~100 back and flag your coach — this is not a win, it's muscle risk.`, { kind: "cal", delta: 100 });

  const bf = bfEst(s);   /* R4 — no longer read by ANY proposal condition in runAdaptive. Kept for the copy that reports the interval, never for a threshold. */
  /* R4 — DELETED: the EASE 2 trigger fired on bf.pct <= 13.2. A point estimate from an
     instrument whose live interval is 10.7–18.3 (7.6 points wide, asymmetric −3.6/+4.0)
     cannot resolve a 13.2 threshold, and this proposal moved his whole calorie band on it.
     The phase machine it served is gone with it; the thin-data band now derives from measured
     bodyweight (see calorieTarget's gated branch). */
  /* The exit prompt fires on the INTERVAL, not the point estimate. His anchor
     carries +/-3.5 points, so "BF crossed 11.2" is a claim the instrument
     cannot make — and prompting a man to end his cut on a number that could be
     three points out either way is exactly the false precision the charter
     forbids. It now fires when the estimate is low enough that the question is
     worth ASKING, and says out loud that the number cannot answer it. */
  /* R4 — DELETED: the pivot prompt fired on bf.lo <= 11.2.

     Its comment defended firing on the INTERVAL rather than the point, which was the
     honest version of a threshold — but it is still a threshold on an instrument whose
     live interval is 7.6 points wide, and applying it stepped calories to maintenance.
     bf.lo is 10.7 today, so it has been firing since 2026-07-29 and sitting open.

     THE QUESTION IT ASKED NOW HAS A BETTER OWNER. "Is the cut done?" is exactly what
     regime() answers with accretionBound — from his lifts and his scale rate, both
     measured daily, rather than from a body-fat estimate anchored twice a year. R1
     replaced the instrument; this removes the old one rather than leaving two.

     s.phase and the PHASES table are NOT deleted from state — never delete athlete data,
     and the field is inert now that its only writer is gone. The three remaining readers
     already guard with `ph ? ... : null`. */

  /* ---------- PROGRAM_NOTE — the app has to make its own suggestions ----------
     The point of this ledger is to optimise the programme. A recommendation
     that only exists in a conversation is a recommendation the app failed to
     make. These are the standing evidence-vs-programme gaps, filed the same way
     every other change is: as a proposal, with the receipt, for his tap. They
     re-arm weekly while the gap is open and go quiet when it closes. */

  /* BAND_OWNERSHIP — the calorie band is engine-owned. energyBalanceTarget() computes it (R2b: it was calorieTarget, which could only ever subtract)
     live (the "Today's Protocol" card on NOW) from measured maintenance and the
     target rate over a matched window, and RE-DERIVES it every day — including the
     step taper a hand adjustment would chase. So no proposal may restate or
     re-derive the band: a second band figure in the inbox is exactly the
     agent-vs-engine conflict Joe flagged ("the proposals should never confuse me").
     A band-adjacent concern surfaces as an observation that cites the live band,
     never a competing number and never an approvable band change. (Retired here:
     "CALORIE BAND HAS DRIFTED FROM YOUR DATA", which offered to move the band by
     ct.drift — a redundant restatement of what the protocol card already shows.)
     ct stays: the refeed proposal below quotes the live band. */
  const ct = energyBalanceTarget(s);

  /* ---------- REFEED_NOTE — the standing recommendation the app owed him ----------
     The programme runs a weekly Wednesday refeed at 2,450-2,500. The evidence
     for that, examined properly, is this:

     - Campbell et al. 2020 (JFMK) is the ONLY refeed RCT at a matched weekly
       total in resistance-trained people. Peos, Brown, Vorland, Allison &
       Sainsbury reanalysed it in the same journal later that year and found only
       DRY fat-free mass differed between arms — total FFM did not — because the
       original compared within-group significance across arms instead of testing
       the interaction. The headline did not survive.
     - Poon et al. 2025 (Nutrition Reviews), 12 RCTs, n=881: body mass -0.01 kg,
       fat mass 0.26 kg (p=0.38), FFM 0.17 kg (p=0.67). RMR favours intermittent
       by 47 kcal/day overall — but the RESISTANCE-TRAINED subgroup is 11 kcal/day,
       95% CI -67 to +46, p=0.71.
     - Peos 2021 measured leptin, testosterone and free T3 across a full week at
       maintenance in trained athletes. All three were unchanged. The mechanism a
       refeed is supposed to work through was flat.
     - Henselmans 2022 (49 studies) and 2026 (11 RCTs, hypertrophy SMD 0.15,
       95% CI -0.10 to 0.40, p=0.230): no isocaloric carbohydrate study has shown
       a strength or hypertrophy benefit, so the "fuel for tomorrow's session"
       case has nothing behind it either.

     And it is not free. Against a fixed weekly total, a Wednesday 400 kcal above
     the band means the other six days run ~67 kcal deeper, and deficit magnitude
     is the one variable the trained-population evidence does link to lean-mass
     loss (Murphy & Koehler 2022, ES -3.1e-4 per kcal/day).

     Where the evidence IS positive is DIET BREAKS — a full week at maintenance —
     and it is positive on adherence, not metabolism: ICECAP found lower hunger
     (p=0.002) and higher satisfaction (p=0.016); Siedler 2023 found disinhibition
     improved with breaks and worsened without (p<0.01). No trial has ever
     randomised a weekly refeed DAY with adherence as the outcome, so there is no
     basis for assuming one day inherits that.

     This is filed as a proposal rather than applied, because the calendar is his
     programme and law 3 says every change arrives as a proposal. */
  const nextWed = (() => { const t9 = todayStart(); const off9 = ((3 - t9.getDay()) + 7) % 7 || 7; return isoOf(new Date(t9.getTime() + off9 * DAY)); })();
  if (!sealed && dayType(nextWed, s) === "REFEED")
    propose("refeed_review", "THE WEEKLY REFEED HAS NO EVIDENCE BEHIND IT",
      `Your Wednesday refeed is prescribed at 2,450-2,500 against a band that is now ${ct.gated ? "derived from your maintenance" : `${ct.lo}-${ct.hi}`}. Applying this actually retires it: Wednesdays stop being refeed days from the day you tap, everywhere in the app, while every past Wednesday stays a refeed on the record because it was one. The case for refeeds does not hold up: the only matched-energy RCT in trained people (Campbell 2020) had its fat-free-mass result overturned on independent reanalysis, and across 12 trials the resting-metabolism advantage in resistance-trained subgroups is 11 kcal/day with a confidence interval from -67 to +46. Leptin, testosterone and free T3 were all unchanged across a full week at maintenance in the one trial that measured them. Higher-carbohydrate days have never beaten matched-calorie days for strength or hypertrophy in any isocaloric comparison. Meanwhile it costs something real: a Wednesday above the band deepens the other six days, and deficit size is the variable that actually predicts lean-mass loss. The proposal is to retire the fixed weekly refeed and simply run the band every day — keeping a DIET BREAK (a full week at maintenance) in reserve, which is the intervention the adherence evidence actually supports. If you keep the refeed, keep it because you enjoy it and it keeps you in the game. That is a real reason. It is just not the one the app has been giving you.`,
      { kind: "refeed" });

  /* ---------- VOLUME — the earned lever (spec v5). The volstruct note is superseded:
     when the measured state sanctions growth, the coach files a CARD whose tap enacts the
     set — zone-scaled, placed on a readable direct lift, read before the next. When it does
     not, the TRAIN allocation card carries the filed reasoning (vi.why) — saying it twice
     would teach him to read neither. A decline buys the WEEK for the whole lever. */
  {
    const vp = volumePush(s);
    const vpDeclined = (s.adjustments || []).some((a) => a && a.dismissed && a.rid && a.rid.indexOf("volpush_") === 0 && a.d >= monday);
    const deskOpen = (s.agentProposals || []).some((ap) => ap && ap.kind === "volume");   /* R18f fix2 — one door files: an open desk offer closes this one */
    /* R18f fix3 — the desk's PASS promised 'the ledger waits two weeks before raising
       this muscle again'; door 2 filing the identical earned card the same day broke
       that promise (driven by the audit). The desk's own recent-feed guard, taken here. */
    const deskPassed = vp.mode === "PUSH" && (s.feed || []).slice(0, 80).some((f) => f && f.t && f.d && f.t.indexOf("VOLUME PASSED — " + String(vp.mg).toUpperCase()) === 0 && (mk(todayISO) - mk(f.d)) / DAY < 14);
    if (!sealed && !vpDeclined && !deskOpen && !deskPassed && vp.mode === "PUSH")
      propose(`volpush_${vp.mg}_${monday}`, `${cap(mgLabel(vp.mg))} — EARNED VOLUME: ${vp.fromWk} → ${vp.toWk} WEEKLY SETS`,
        `${vp.basis === "stall" ? "Your own measured state earned this through the stall arm: the scale is stalled with nothing looking wrong — lifts not falling, recovery GREEN, the 3-night sleep mean clean, no other volume move this week — and a stalled scale with clean instruments still earns the question." : vp.basis === "surplus" ? "Your own measured state earned this: a surplus inside the controlled-gain cap, lifts not falling, recovery GREEN, the sleep mean clean, and the block's batch open." : "Your own measured state earned this: regime FREE confirmed a week apart, lifts not falling while fat clearly falls, recovery GREEN, the 3-night sleep mean clean, and no other volume move this week."} ${cap(mgLabel(vp.mg))} carries your own training-order priority at ${vp.fromWk} weekly sets${vp.zone === "UNDER" ? " — under the growth floor, an underdose to correct decisively rather than creep at" : ""}. Approving adds ${vp.dSess} set${vp.dSess > 1 ? "s" : ""} to ${vp.exName} each ${vp.day === "L" ? "lower" : "upper"} session — ${vp.fromSess}→${vp.toSess} per session, ${vp.fromWk}→${vp.toWk} weekly, roughly ${vp.dSess * 3} extra minutes on those days (one set plus its rest). The new set lands inside the effort taper automatically: the RIR ladder re-keys, and failure stays spent exactly once, on the final set.${vp.reviewZone ? ` REVIEW ZONE: this lands past ${VOL_BANDS.hi} weekly sets (${VOL_REVIEW_LO}–${VOL_REVIEW_HI}) — progression here continues only on your own delivered+tolerated reads.` : ""}${vp.headroomNote ? " " + vp.headroomNote : ""} HONEST GRADE — MODERATE-TO-LOW: volume drives growth with no in-range plateau (Pelland 2025) and you fit the recomp profile (Barakat 2020 — headroom, ~14% body fat, deficit under ~500), but no trial has tested MORE volume DURING a deficit for growth (Roth 2023 and Nait-Yahia 2026 asked retention; neither found a volume advantage), so the coach adds a LITTLE and reads your own bar before the next step. The trend window restarts at the change on purpose — a bigger number from more sets proves nothing. A null read HOLDS; sets come off only on repeated deterioration, pain, or recovery leaving GREEN, with a receipt. Per-session cap ${VOL_SESS_CAP}; absolute ceiling ${vp.ceil} weekly sets, never normally reached.`,
        { kind: "sets", exId: vp.exId, delta: vp.dSess, mg: vp.mg, fromWk: vp.fromWk, toWk: vp.toWk, freq: vp.freq, budgetPremise: true });   /* A5 — the premise is now the clean VOLUME budget; the belt and reconciler key on it, so owner's-call cards (whose premise is Joe's ask) are untouched */
    /* the staged-hold half (A2) — subtraction is the LAST stage, never the reflex: a
       null read HOLDS, verification is named on the card, and the proposal files only
       when the lift ITSELF deteriorates AND the deterioration repeats, pain speaks
       (the governor — the immediate safety path), or recovery leaves GREEN. */
    (s.exercises || []).forEach((ex9) => {
      if (typeof ex9.w !== "number") return;
      if (!exActive(s, ex9.id)) return;   /* FIX split-1 (P1-1): a retired lift files no rollback */
      const vc9 = volumeConversion(s, ex9.id);
      if (!(vc9.status === "LIVE" && vc9.subtract)) return;
      const rid9 = `volroll_${ex9.id}_${monday}`;
      const rollDeclined = (s.adjustments || []).some((a) => a && a.dismissed && a.rid === rid9);
      if (!sealed && !rollDeclined)
        propose(rid9, `${String(ex9.n).toUpperCase()} — THE ADDED SET IS NOT BEING TOLERATED`,
          `The staged receipt: ${vc9.dK} set${vc9.dK > 1 ? "s were" : " was"} added to ${ex9.n} on ${fmtShort(vc9.changedAt)}. Over the ${vc9.trend.n} sessions since, the lift ITSELF is deteriorating (${vc9.trend.pct}%/session, CI ${vc9.trend.lo} to ${vc9.trend.hi}) — a falling read, not a null one — and ${vc9.safety ? "the governor holds this lift while it falls: the immediate safety path" : (vc9.trend.n >= TREND_MIN_SESSIONS + 2 ? "the deterioration has repeated past the minimum window" : "recovery has left GREEN while it falls")}. Delivery was ${vc9.delivered === true ? "verified — the RIR reports say the sets ran hard" : "unrated"}; execution, rest and technique standardization are yours to check before you tap. Approving takes the added set${vc9.dK > 1 ? "s" : ""} back off — ${ex9.sets}→${ex9.sets - vc9.dK} per session. Nothing is lost: the experiment ran, the answer was measured on your own bar, and both are on the record.`,
          { kind: "sets", exId: ex9.id, delta: -vc9.dK, mg: (ex9.head || ex9.mg) });
    });
  }

  /* ---------- OWNER'S CALL — 2026-08-07, ON THE RECORD: RAISE ALL THREE ----------
     Joe was shown the full designed allocation, the closed gates (recovery WATCH, the
     detector 0/4 readable, sleep debt, rate above the corridor top) and the honest risk
     profile — three simultaneous experiments is the highest junk-volume-risk configuration
     the lever allows — and chose speed over waiting. The owner decides; the app measures.
     Nothing here weakens an instrument: each lift keeps its own fresh trend window, its
     own conversion verdict, its own rollback with receipt.
     PRE-FILED, once ever, per card: the guard is the proposals/adjustments record itself
     (no stored flag), so it is merge-safe by the proposals union — a card that has ever
     existed for the muscle, at ANY status, is never re-filed by this producer. The cards
     ride the standard volpush rid family, so decline-buys-the-week, the READING skip, the
     weekly budget and the apply branch all treat them natively. A produced card, never a
     migration. */
  {
    const ownerGate = "The gates were closed — recovery reads WATCH, the detector cannot read your lifts yet, and the rate is above the corridor top — and you chose speed over waiting, on the record. The owner decides; the app measures. ";
    const ownerCaveat = " HONEST CAVEAT: three simultaneous experiments into WATCH recovery raises the odds a read comes back NOT-TOLERATED or UNCLEAR — junk volume is the risk you accepted, and the instruments will say so without flinching. THE MEASUREMENT PROMISE: this lift's trend window restarts at the change, it climbs the delivery/tolerance ladder on your own bar, and if the lift itself deteriorates a staged-hold card comes with the receipt. Declining buys the week.";
    const OWNER_CALLS = [
      { mg: "hams", exId: "ham",
        title: (ex, fromWk, toWk) => `OWNER'S CALL — HAMS: ${fromWk} → ${toWk} WEEKLY SETS`,
        body: (ex, fq) => `Approving adds 1 set to ${ex.n} each lower session — ${ex.sets}→${ex.sets + 1} per session, ${ex.sets * fq}→${(ex.sets + 1) * fq} weekly, about 3 extra minutes on those days. This is the FLOOR CORRECTION: ${ex.sets * fq} weekly sets sits under the growth floor, and the climb lands where sets pay best on the evidence's own curve (Pelland 2025, roughly 5–10 weekly sets — returns stay positive above that, each set just buys less).` },
      { mg: "chest", exId: "press",
        title: (ex, fromWk, toWk) => `OWNER'S CALL — CHEST: ${fromWk} → ${toWk} WEEKLY SETS`,
        body: (ex, fq) => `Approving adds 1 set to ${ex.n} each upper session — ${ex.sets}→${ex.sets + 1} per session, ${ex.sets * fq}→${(ex.sets + 1) * fq} weekly, about 3 extra minutes. PRESS IS A COMPOUND: the added set fractionally credits triceps and front delts (half a set each per session), and that spillover charges those muscles' weekly structural budget — nothing else stacks on them the same week. After this move chest sits in the working zone, triceps stays inside its band, and front delts stays indirect-only by design: the press IS its lever. Grade MODERATE-TO-LOW — at-floor to working zone, and the more-volume-during-a-deficit bridge is untested (Roth 2023 asked retention).` },
      { mg: "delts_rear", exId: "rearDelt",
        title: (ex, fromWk, toWk) => `OWNER'S CALL — REAR DELT: ${fromWk} → ${toWk} WEEKLY SETS`,
        body: (ex, fq) => `Approving adds 1 set per side to ${ex.n} each upper session — ${ex.sets}→${ex.sets + 1} per side, ${ex.sets * fq}→${(ex.sets + 1) * fq} weekly. UNILATERAL, so the honest gym time is ~4–5 extra minutes (a set per side plus rests), and the logging convention is unchanged: one number per round, the weaker side. Grade MODERATE-TO-LOW — at-floor to working zone, the same untested bridge.` },
    ];
    OWNER_CALLS.forEach((oc) => {
      const seen = (s.proposals || []).some((p) => p && p.rid && p.rid.indexOf("volpush_" + oc.mg + "_") === 0)
        || (s.adjustments || []).some((a) => a && a.rid && a.rid.indexOf("volpush_" + oc.mg + "_") === 0);
      if (seen || sealed) return;
      const ex = (s.exercises || []).find((x) => x.id === oc.exId);
      if (!ex) return;
      const fq = _weeklyFreq(ex.day) || 2;
      propose("volpush_" + oc.mg + "_" + monday, oc.title(ex, ex.sets * fq, (ex.sets + 1) * fq),
        ownerGate + oc.body(ex, fq) + ownerCaveat,
        { kind: "sets", exId: oc.exId, delta: 1, mg: oc.mg, owner: true });
    });
  }

  /* ---------- v7.53.0 A3 — THE INSERTION FORK TABLE, ARMED ----------
     Sol's fork table, build-ready: inserting a new lift into a session changes
     the fatigue context of every lift after it, so the affected lifts' baselines
     fork WHEN THE INSERTION HAPPENS — not before. Idempotent: each fork applies
     once per insertion (keyed on the why), and a lift already forked by a LATER
     event is left alone (one slot, latest wins). No causal language anywhere:
     the banner says the context changed, not what it did. */
  {
    const INSERTION_FORKS = [
      ["fly", ["rearDelt", "curl", "tricep", "sulek", "pulldown", "rows"], "fly inserted upstream"],
      ["hipthrust", ["extension", "ham", "abs", "hanging", "calves"], "hip thrust inserted upstream"],
    ];
    for (const [newId, affected] of INSERTION_FORKS) {
      if (!(s.exercises || []).some((x) => x && x.id === newId && exActive(s, x.id))) continue;   /* R9 fix-2: a quarantined birth must not fire the runtime sweep either */
      /* FIX split-1 (P1-3): the registry stays as the fast-path, but it is no
         longer load-bearing — the ONE implementation is idempotent by ops
         identity and op-guarded receipts, so a re-fire adds zero, and an
         unrelated same-date seam can no longer cause a permanent skip after
         the marker was set (the old bespoke loop's defect). */
      /* C2/Q1 — THE SWEEP NO LONGER DATES ANYTHING. It used to pass todayISO into the
         seam writer, so a plan change discovered on any later day was stamped with the day
         the code ran. All it does now is record the PLAN MARKER — the day the plan changed,
         which for the two shipped insertions is SEED's own 2026-08-14 — and the derivation
         in canonicalizePlan turns markers into seams at actual exposure. A future insertion
         writer sets this marker to the day the plan changed, never to todayISO for a past
         change. */
      if ((s.insertions || {})[newId]) continue;
      const seed9 = ((SEED || {}).insertions || {})[newId];
      s.insertions = { ...(s.insertions || {}), [newId]: seed9 || todayISO };
    }
    /* FIX 3a item 4 — calibration becomes STATE the day the pins are gone: a
       sweep detection, so ANY future setup writer (editor, patch, hand edit)
       gets it for free. Stamped once; deleting tokens later cannot un-know it. */
    for (const eC of (s.exercises || [])) {
      if (!eC) continue;
      if (String(eC.setup || "").match(/\[PIN\]/)) { if (!eC.pinsSeen) eC.pinsSeen = true; }
      else if (eC.pinsSeen && !eC.calibratedAt) eC.calibratedAt = todayISO + "T12:00:00.000Z";
      /* FIX 3c item 5 — the first cut stamped ANY pin-free lift, so a late first
         sweep (second device, restored backup, first open after a gap) stamped
         pulldown days after its fork, dropped its exposure count 1 → 0, and 3b's
         label then said "until the machine settings are pinned" about settings
         that do not exist on that lift. pinsSeen is the one bit of memory that
         makes the stamp a transition: observed WITH pins, later without. */
    }
  }

  /* ---------- v7.53.0 JOB 1 — THE FAILURE A/B PROPOSER LIVED HERE ----------
     Removed with the experiment (Joe's retirement ruling, zero sessions logged).
     patchV47 withdraws the pending consent card and disarms any approved trial;
     removing the proposer is what keeps the card from being re-filed on the
     next sweep. The lift_pair metric machinery survives for future experiments;
     nothing that touches progression or prescription reads it any more. */

  /* ---------- SELECTION_NOTE — the one training change worth the ink ----------
     The whole lengthened-partials story collapsed under testing: a 297-person
     multi-site trial found lengthened partials and full ROM practically
     equivalent, and a trained-subject RCT returned Bayes factors of 0.16-0.30 —
     moderate evidence FOR the null. The pattern nobody advertises is that every
     large pro-lengthened effect is in UNTRAINED subjects and every trained-subject
     study is null. And there are ZERO range-of-motion studies in pecs, delts or
     lats, which is five of his thirteen lifts.

     What survives is not about how he reps. It is about which machine he sits in,
     and the effects are five to fifteen times larger than anything in the ROM
     literature — because a biarticular muscle's length is set by the OTHER joint:

       standing vs seated calf raise  d = 0.88-1.58   gastrocnemius +9-12% vs +0.6-1.7%
       overhead vs pushdown triceps   d = 0.54-0.61   long head +28.5% vs +19.6%
       seated vs lying ham curl       direction confirmed, magnitude not retrieved

     The app cannot tell which variant he uses — "Calves", "Ham curl", "Tricep" are
     just names. So it asks rather than assuming, because a d=1.5 finding applied
     to the wrong machine is worth nothing and guessing would be the same error as
     every authored constant this audit has removed. */
  if (!sealed && (s.exercises || []).some((e) => ["calves", "ham", "tricep"].includes(e.id)))
    propose("selection", "THREE MACHINES MIGHT BE THE WRONG ONES — WORTH CHECKING",
      `This is the strongest lever in the selection literature I have read for you — one small untrained-cohort trial behind the calf number, so direction more than size — and it is not about reps or range of motion — it is about which machine, because a muscle that crosses two joints has its length set by the joint you are NOT training. Three questions. Is your calf raise done with the knee STRAIGHT (standing, or on a leg press) or BENT (seated)? Straight-knee produced +9-12% gastrocnemius growth against +0.6-1.7% for seated in a within-person MRI study — d = 0.88 to 1.58, the strongest selection lever in this literature, from one small untrained trial. Seated calf work essentially trains soleus only. Is your triceps work an overhead extension or a pushdown? Overhead grew the long head +28.5% vs +19.6% and the whole triceps +19.9% vs +13.9%, achieved with LIGHTER loads, because shoulder flexion puts the long head on stretch. And is your ham curl seated or lying? Seated flexes the hip and lengthens the hamstrings; the direction is established though I could not retrieve the exact percentages. Caveats worth having: these are small studies, mostly untrained subjects, and the calf one is n=14 — but they are within-person MRI designs and the mechanism is not in dispute. Set against that, the fashionable stuff is dead: lengthened partials came back practically equivalent to full range in a 297-person trial, tempo does not matter and if anything favours going faster, and slow eccentrics cost a great deal of perceived effort for a hypertrophy effect of −0.06. If any of the three answers is the short-muscle version, switching machines is free and worth more than every rep-mechanics tweak combined.`,
      { kind: "note" });

  /* Plates too coarse for the muscle — a hardware finding, not a programming one. */
  const coarse = coarseLifts(s);
  if (!sealed && coarse.length)
    propose("microload", "TWO LIFTS HAVE PLATES TOO COARSE FOR THEM",
      `${coarse.map((c) => `${c.n} steps ${c.step} lb on ${c.w} — a ${c.pct}% jump`).join(", and ")}. Reps fall about 0.4 for every 1% of load (Nuzzo 2024, 952 reps-to-failure tests across 269 studies), so ${coarse.length > 1 ? "each of those costs" : "that costs"} roughly ${coarse[0].lost} reps. Top out at ${coarse[0].hi}, take the jump, and you land near ${Math.max(1, coarse[0].hi - Math.round(coarse[0].lost))} — outside a tight window, with no rule to climb back. The ACSM's progression stand asks for 2-10% increments and specifically wants the SMALLER end on small-muscle exercises; fixed plates give you the exact inverse, 12.5% on a rear-delt fly against 1.6% on calves. Two fixes and the cheap one is hardware: 1.25 lb magnetic add-ons halve the jump and let the window stay tight. Otherwise the window has to widen to ${coarse[0].lo}-${coarse[0].hi} — which this app has NOT done: that widened window is computed here to make the argument, but progression still climbs the authored one, so nothing about your targets changes until you decide it should. Worth knowing this is a derivation, not a citation — nobody has published guidance on rep-window width in a double-progression scheme.`,
      { kind: "note" });

  /* THE RATE BAND'S UNIT — RETIRED v6.3.1. This card proposed restating the band
     from absolute lb to "% of bodyweight." That fix already shipped: cutRateBand()
     derives the corridor as %BW per Auto-Pilot mode and scales it to lb by his
     bodyweight (v6.2.1), so the band no longer tightens as he leans and the
     "wrong unit" premise is moot. It was also the last user-facing reader of the
     fixed s.rate.band seed, and it miscited Garthe — a phantom 1.0%/wk arm "losing
     2.0%" (the truth, cited correctly everywhere else from BC.CUT_GARTHE_*: the
     0.7%/wk arm gained +2.1% LBM, the 1.4%/wk arm was lean-neutral at -0.2%).
     Retired outright rather than rewritten, because the engine already owns the
     band — one owner, cutRateBand. Anything already armed on his phone stands down
     rather than lingering on a claim the engine has stopped making: same contract
     as the recovery card below — the record keeps it, the screen does not. */
  s.proposals.filter((p) => p.rid === "rateunit" && !p.resolved).forEach((p) => {
    p.resolved = true; p.stoodDown = true;
    s.feed.unshift({ d: todayISO, t: "RATE-UNIT CARD RETIRED", how: "the band is now derived as % of bodyweight per mode by the engine, so the wrong-unit premise no longer holds — and its Garthe figure was wrong" });
  });

  /* The volume band vs the dose-response evidence, in a deficit. */
  const volDrift = VOL_BANDS.lo !== 6 || VOL_BANDS.hi !== 12;
  if (!sealed && volDrift)
    /* R15e — Pelland reads as a smooth curve, not steps: the "tiers" were bins laid over
       a continuous meta-regression, and quoting them as tiers invented a cliff the data
       does not contain. Plain words at birth: the diary shows this body at headline level. */
    propose("volband", "VOLUME BAND SITS ABOVE THE HIGH-RETURN REGION",
      `Your working zone is ${VOL_BANDS.lo}–${VOL_BANDS.hi} weekly sets per muscle. The biggest pooled analysis available (67 studies, 2,058 people) traces a smooth curve, not steps: every added set buys a little less growth than the one before it, and the buying is best in roughly the 5–10 range — there is no cliff at any number, just diminishing returns. While you are eating in a calorie cut, each extra set is also paid for out of recovery you do not have, which argues for living where sets pay best rather than in the middle of the curve. The proposal is to tighten to 6–12. This is a programme change, so it is a coach conversation as much as a tap — the app will not move it on its own.`,
      { kind: "note" });

  const rec = recoveryIndex(s);
  /* A proposal whose trigger no longer holds should stand down, not sit on the
     NOW page asking to be applied. This one was armed partly off rep dips that
     are no longer counted, so without this it would linger forever making a
     claim the engine has stopped making. It resolves rather than vanishing —
     the record keeps it, the screen does not. */
  if (rec.band !== "LOW") {
    s.proposals.filter((p) => p.rid && p.rid.indexOf("recovery_") === 0 && !p.resolved).forEach((p) => {
      p.resolved = true; p.stoodDown = true;
      s.feed.unshift({ d: todayISO, t: "RECOVERY CARD STOOD DOWN", how: `the signals that raised it have cleared — ${rec.flags.length} of ${rec.watched} still up, which is below the line that holds structural changes` });
    });
  }
  if (rec.band === "LOW") {
    /* Named inputs, each with the receipt that raised it and the thing that
       clears it — not a composite score. Leads with the single biggest lever,
       because "here are five problems" is a list and "fix this one first" is
       advice. See RECOVERY_NOTE. */
    const others = rec.flags.filter((f) => f !== rec.lever);
    const why = [
      `${rec.flags.length} of the ${rec.watched} signals I watch are up.`,
      rec.lever ? `Start here: ${rec.lever.receipt}. ${cap(rec.lever.fix)}.` : "",
      others.length ? `Also up — ${others.map((f) => f.receipt).join("; ")}.` : "",
      rec.excludedDips ? `Not counted: ${rec.excludedDips} rep dip${rec.excludedDips > 1 ? "s" : ""} on short-sleep or rushed sessions, because those days lower reps by themselves and the sleep signal already has them.` : "",
      "Until these clear, no structural change runs this week — loads hold exactly where they are. Reps still progress, the record still counts, and nothing auto-changes. Tap to log the hold; leave it and the app re-reads it every morning.",
    ].filter(Boolean).join(" ");
    propose("recovery_" + monday, `RECOVERY LOW — ${rec.flags.length} OF ${rec.watched} SIGNALS UP`, why, { kind: "note" });
  }

  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:9875-9887.
function _stampPlan(s, fields, logEntry) {
  const p = (s.plan && typeof s.plan === "object") ? s.plan : {};
  const now = clock.nowISO();
  const out = { goals: [], ifthen: [], share: false, autonomy: "propose", phaseLog: [], ...p };
  const setAt = { ...(p.setAt || {}) };
  for (const k of Object.keys(fields || {})) { out[k] = fields[k]; setAt[k] = now; }
  out.setAt = setAt;
  out.rev = (+p.rev || 0) + 1;
  out.phaseLog = Array.isArray(out.phaseLog) ? out.phaseLog.slice() : [];
  if (logEntry) out.phaseLog.push({ id: _freshId("ph_"), at: now, ...logEntry });
  s.plan = out;
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:9888-10037.
function applyProposal(state, pid, nudge = 0, via = "cal") {
  const s = JSON.parse(JSON.stringify(state));
  const p = s.proposals.find((x) => x.id === pid);
  if (!p || p.resolved) return s;
  const dial = proposalDial(p);
  const adj = dial ? Math.max(-dial.max, Math.min(dial.max, Math.round(nudge / dial.step) * dial.step)) : 0;
  const today = isoOf(todayStart());
  /* FIX split-1 (P0-4) — this lane is merge-closed too: a retired target takes
     no proposal, and an order-derived card from an older plan generation (or
     none at all — pre-51 by construction) supersedes at the tap with a
     receipt rather than applying. A stale replica can restore the CARD; it
     cannot make it actionable. */
  if (p.apply && p.apply.exId && !exActive(s, p.apply.exId)) {
    p.resolved = true; p.superseded = true;
    s.feed.unshift({ d: today, t: "OFFER SUPERSEDED — " + String(p.title || p.rid).slice(0, 48), how: "The lift this card targets was retired; the card is preserved in history and closed without effect." });
    return s;
  }
  if (p.apply && p.apply.kind === "sets" && !p.apply.owner && s.planGen != null && (p.pg != null ? p.pg : 0) < s.planGen) {   /* R4 fix-2: an owner's-call card carries Joe's ask, not the chooser's routing — it is not order-derived and never dies of a generation */
    p.resolved = true; p.superseded = true;
    s.feed.unshift({ d: today, t: "OFFER SUPERSEDED — " + String(p.title || p.rid).slice(0, 48), how: "This card was derived from an earlier plan generation; the plan has since changed, so it closes without effect. Anything still earned re-files under the current plan." });
    return s;
  }
  p.resolved = true;
  p.nudge = adj;
  const row = { rid: p.rid, id: _freshId("adj_"), d: today, at: clock.nowISO(), title: p.title, nudge: adj };   /* SCALE-8 — every writer stamps its instant (the id already embedded it; now it is first-class) */
  if ((p.apply || {}).kind === "cal") {
    /* v7.3.1 — APPROVAL TAKES EFFECT. Record the engine's own steer as a tracked, reversible offset
       (calorie band OR step target — the athlete's pick), which calorieTarget/stepTarget add on top of
       the engine-owned base and which reconciles at the next weigh-in. The base band is never mutated. */
    const eff = proposalEffect(p, adj);
    const canStep = via === "steps" && eff.stepsDelta;
    if (canStep) { row.via = "steps"; row.stepDelta = eff.stepsDelta; row.from = today; }
    else { row.via = "cal"; row.calDelta = eff.calDelta; row.from = today; }
    s.adjustments.push(row);
    if (canStep) {
      const st = stepTarget(s); const tgt = st && !st.gated ? st.mid : null;
      s.feed.unshift({ d: today, t: "STEP TARGET RAISED", how: `${p.title} — ${eff.stepsDelta > 0 ? "+" : ""}${eff.stepsDelta.toLocaleString()} steps/day${tgt != null ? ` → ~${tgt.toLocaleString()} target` : ""}. Holds until your next weigh-in, then the engine re-measures. One tap to undo.` });
    } else {
      const ct = energyBalanceTarget(s);
      s.feed.unshift({ d: today, t: eff.calDelta < 0 ? "TARGET TIGHTENED" : "TARGET EASED", how: `${p.title} — band ${eff.calDelta < 0 ? "down" : "up"} ${Math.abs(eff.calDelta)} kcal${ct && !ct.gated ? ` → ${ct.lo}–${ct.hi}` : ""}${adj ? ` (your version, ${adj > 0 ? "+" : ""}${adj})` : ""}. Holds until your next weigh-in, then the engine re-measures. One tap to undo.` });
    }
    return s;
  }
  /* R18f fix2 (c) — DESIGN CALL, filed: the tap RE-CHECKS the budget. 'What you approve
     is what happens' cuts both ways once the card's own premise — no other structural
     move this week — has expired: enacting it silently would make the tap a lie in the
     other direction. The refusal SPEAKS (feed line: what expired, why, when it returns)
     and resolves the card. The reconciler normally withdraws first; this is the belt
     for the race inside a single render. */
  if ((p.apply || {}).kind === "sets" && (p.apply || {}).budgetPremise) {
    const smwT = structuralMovesThisWeek(s);
    if (smwT.sets.length) {   /* A5 — the premise is the VOLUME budget */
      p.resolved = true; p.resolvedHow = "expired at the tap — the budget was spent after this filed";
      s.feed.unshift({ d: today, t: "OFFER EXPIRED AT THE TAP — " + String(p.title || p.rid).slice(0, 40), how: "A volume move already landed this week, so this card's own premise (no other volume move) had expired. Nothing changed. It returns when re-earned, Monday at the earliest." });
      return s;
    }
  }
  s.adjustments.push(row);
  /* VOLUME LEVER — the tap changes the thing the card names: ex.sets, stamped for the merge
     (AUDIT G), with an exact undo (AUDIT F: the undo is itself a set-count change).
     proposalDial has recognised kind "sets" since v7.3.1 while NOTHING applied it — a card
     of that kind fell through to the "ADJUSTMENT LOGGED" else, the refeed_review defect
     shape. This branch closes that gap the same week the first such card can exist. */
  if (p.apply.kind === "sets" && p.apply.exId && p.apply.delta) {
    const exS = s.exercises.find((x) => x.id === p.apply.exId);
    if (exS) {
      const prev = exS.sets || 1;
      let d9 = (p.apply.delta || 0) + adj;
      if (d9 !== 0) {
        d9 = Math.max(1 - prev, d9);   /* a lift never goes below one set */
        exS.sets = prev + d9;
        exS.setsAt = clock.nowISO();   /* AUDIT G — every sets mutator stamps */
        row.exUndo = { exId: exS.id, field: "sets", prev };
        row.setsDelta = d9;
        s.feed.unshift({ d: today, at: clock.nowISO(), t: `VOLUME ${d9 > 0 ? "+" + d9 : d9} — ${mgLabel(p.apply.mg || exS.head || exS.mg).toUpperCase()} via ${exS.n} (now ${exS.sets} sets)`, how: `${p.title} — the count changes next session; the effort ladder re-keys itself, and the trend window restarts so the read is honest. The next push on this muscle waits for that read. One tap to undo.` });
      } else {
        s.feed.unshift({ d: today, t: "ADJUSTMENT LOGGED — YOUR VERSION WAS ZERO", how: `${p.title} — you dialed the change to zero; nothing moved, and the card closed as your call.` });
      }
    }
    return s;
  }
  /* A ladder approved in the inbox must change the thing its card promised — a proposal
     that takes a tap and files a note is worse than no proposal. */
  if (p.apply.kind === "ladder" && Array.isArray(p.apply.rungs) && p.apply.rungs.length >= 2 && p.apply.exId) {
    const ex7 = (s.exercises || []).find((e) => e && e.id === p.apply.exId);
    if (ex7) {
      ex7.steps = p.apply.rungs.slice().sort((a, b) => a - b); ex7.stepsAt = clock.nowISO();
      if (typeof ex7.w === "number") { ex7.w = snapLoad(ex7, ex7.w); ex7.wAt = clock.nowISO(); }
      s.feed.unshift({ d: isoOf(todayStart()), t: `LADDER SET — ${String(ex7.n).toUpperCase()} ${ex7.steps.length} rungs`, how: `${ex7.steps[0]} to ${ex7.steps[ex7.steps.length - 1]}, read off the weights you have actually used — every earn, reset and forecast now lands on a weight this machine makes` });
    }
    p.resolved = true; p.at = clock.nowISO();
    return s;
  }
  if (p.apply.kind === "refeed") {
    /* Dated, so history keeps reading as history — see REFEED_RETIREMENT. */
    s.targets = s.targets || {};
    s.targets.refeedOff = isoOf(todayStart());
    s.feed.unshift({ d: isoOf(todayStart()), t: "WEEKLY REFEED RETIRED", how: `Wednesdays stop being refeed days from today. Past ones stay on the record as refeeds, because they were. Your band is the same every day now — which is also about ${Math.round((2395 - 1893) / 7)} kcal/day less than you were averaging, since a 2,400 Wednesday against a 1,900 week was quietly raising the average nobody was showing you.` });
  } else if (p.apply.kind === "exit") {
    /* ---------- The hold clock starts here ----------
       dietExit promises two milestones — two weeks before the scale means
       anything, four before the re-measured maintenance is trustworthy — and
       nothing wrote the date they count from, so both were permanently
       unreachable. A plan with milestones that cannot arrive is a plan the app
       is only pretending to run. This is a dated decision like any other. */
    s.targets = s.targets || {};
    s.targets.exitStart = isoOf(todayStart());
    /* N4 — THE BOUNDARY SEAL: the exit jump refills glycogen and its water (ICECAP:
       +0.6 kg scale / +0.7 kg FFM inside one week), so the rate window is sealed for
       the ~14-day REPLENISHMENT WASH-IN. Never "adaptation recovering" — water. */
    s.blackout = { until: isoOf(new Date(todayStart().getTime() + 14 * DAY)) };
    _stampPlan(s, { phase: "maintenance" }, { kind: "transition", from: "cut", to: "maintenance" });   // v7.4.0 Slice 5 — hardened so a stale device cannot revert the maintenance decision
    const dxA = dietExit(s);
    s.feed.unshift({ d: isoOf(todayStart()), t: "DIET EXIT — MAINTENANCE HELD",
      how: (dxA.gated
        ? "The cut is over. Maintenance is not measured yet, so the number to eat at is the one you and your coach set — the hold still starts today."
        : `The cut is over. From today you eat at ${dxA.maintenance} — your own measured maintenance from ${dxA.days} logged days, in one step, not a ramp. Hold it ${dxA.holdMin} weeks before the scale means anything (the first pounds back are glycogen and water), and ${dxA.holdFull} before the re-measured number is worth trusting. Nothing about a surplus is decided; that is what the hold is for.`) + " The first ~14 days are REPLENISHMENT WASH-IN — glycogen and water refilling, never adaptation recovering — and the scale is SEALED across them; re-measure after, then any build starts at +100–150 kcal (~3–5%), governed by the 0.25–0.5 %BW/month cap." });
  } else if (p.apply.kind === "phase" && p.apply.to) {
    s.phase = p.apply.to;
    const q = s.queue.find((x) => x.id === "q_ease2"); if (q) { q.done = true; q.state = "FIRED"; }
    s.feed.unshift({ d: isoOf(todayStart()), t: `${p.apply.to} FIRED`, how: `est. BF crossed the line — targets now ${PHASES[p.apply.to].band.join("–")} · steps: ${PHASES[p.apply.to].steps}. Mirror outranks scale from here.` });
  } else if (p.apply.kind === "break" && p.apply.start && p.apply.end) {
    /* v7.4.0 Slice 5 — a DATED week at maintenance, recorded as a hardened, merge-safe decision in s.plan
       (newest-deliberate-wins) + an append-only phaseLog entry. The number to eat at is the ENGINE's
       measured maintenance (dietExit/observedTDEE), never authored here. Reversible: the row carries the
       prior break so one Undo restores it. Honest: adherence + recovery, and a TRANSIENT glycogen/water
       scale bump — never a metabolic reset. */
    row.planUndo = { field: "brk", prev: (s.plan && s.plan.brk) || null };
    _stampPlan(s, { brk: { start: p.apply.start, end: p.apply.end, planned: isoOf(todayStart()) } }, { kind: "break", from: "cut", to: "break", start: p.apply.start, end: p.apply.end });
    const dbA = dietBreakState(s);
    /* N4/N7 — the break seals the rate window through its own water: break end +3d
       (the audit will drive the clearance tail; widening to +5-7d is the named fix
       if watery readings tail into the reopened window) */
    s.blackout = { until: isoOf(new Date(mk(p.apply.end).getTime() + 3 * DAY)) };
    s.feed.unshift({ d: isoOf(todayStart()), t: "DIET BREAK — A WEEK AT MAINTENANCE",
      how: `${dbA.maintenance ? `Eat at ${dbA.maintenance} — your measured maintenance — through ${fmtShort(p.apply.end)}.` : `Eat at maintenance through ${fmtShort(p.apply.end)}.`} ${dbA.honest.scale} A break from hunger, not a metabolic reset — and one tap to undo.` });
  } else if (p.apply.kind === "phasePlan" && p.apply.to) {
    /* v7.4.0 Slice 5 — a committed macro-phase transition (e.g. maintenance -> lean gain), hardened in
       s.plan (newest-deliberate-wins) + phaseLog, reversible via the row's prior value. The engine still
       owns every number the new phase prices; this only records WHICH phase is in effect. */
    row.planUndo = { field: "phase", prev: (s.plan && s.plan.phase) || null };
    const toMeta = PHASE_META[p.apply.to] || { label: String(p.apply.to).toUpperCase() };
    _stampPlan(s, { phase: p.apply.to }, { kind: "transition", from: (s.plan && s.plan.phase) || "cut", to: p.apply.to });
    s.feed.unshift({ d: isoOf(todayStart()), t: `PHASE — ${toMeta.label}`, how: `${p.why || "Phase committed."} The engine still owns every number this phase prices; one tap to undo.` });
  } else {
    const tail = adj ? ` · you took it ${adj > 0 ? "+" : ""}${adj}${dial ? " " + dial.unit : ""} off the proposed number — recorded as applied, your version` : "";
    s.feed.unshift({ d: isoOf(todayStart()), t: "ADJUSTMENT LOGGED", how: `${p.title} — ${p.why}${tail}` });
  }
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10040-10057.
function applySuggestion(state, sug) {
  const s = JSON.parse(JSON.stringify(state));
  s.suggestionLog = s.suggestionLog || [];
  s.targets = s.targets || {};
  if (s.suggestionLog.some((x) => x.sid === sug.sid)) return s;
  const d = isoOf(todayStart());
  const a = sug.apply || { kind: "note" };
  let how = sug.title;
  if (a.kind === "protein" && a.to != null) { s.targets.proteinG = a.to; how = `protein target set to ${a.to} g/day`; }
  else if (a.kind === "sleep" && a.to != null) { s.targets.sleepH = a.to; how = `sleep target set to ${a.to} h`; }
  else if (a.kind === "cal") { how = "logged only — the engine owns the calorie band, so no analyst suggestion moves it"; }
  else if (a.kind === "dietbreak") { s.targets.dietBreak = d; how = "diet break armed — hold at maintenance this week"; }
  else if (a.kind === "progression") { s.targets.progression = a.to || true; how = "training progression noted — coach territory"; }
  s.suggestionLog.push({ sid: sug.sid, decided: "approved", d, at: clock.nowISO(), title: sug.title, apply: a, predict: sug.predict || "" });   /* SCALE-6 — the tap carries its instant: same-day order is the athlete's order, never sid spelling */
  s.adjustments.push({ rid: sug.sid, id: _freshId("adj_"), d, at: clock.nowISO(), title: sug.title });
  s.feed.unshift({ d, op: "sug:" + sug.sid, t: "ANALYST SUGGESTION APPLIED", how: `${sug.title} — ${how}` });   /* SCALE-4 — the receipt is op-keyed from birth; the reconciler derives it from the log thereafter */
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10061-10069.
function noteSuggestion(state, sug) {
  const s = JSON.parse(JSON.stringify(state));
  s.suggestionLog = s.suggestionLog || [];
  if (s.suggestionLog.some((x) => x.sid === sug.sid)) return s;
  const d = isoOf(todayStart());
  s.suggestionLog.push({ sid: sug.sid, decided: "noted", d, at: clock.nowISO(), title: sug.title, ...(sug.apply && sug.apply.kind ? { apply: { kind: sug.apply.kind } } : {}) });   /* SCALE-2 — the kind travels with every decision, so a losing approval's effect can be reversed by derivation */
  s.feed.unshift({ d, op: "sug:" + sug.sid, t: "ANALYST SUGGESTION NOTED", how: sug.title + " — an observation, filed; approving it would have changed nothing, so nothing wears an apply button" });   /* SCALE-4 — op-keyed */
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10070-10078.
function dismissSuggestion(state, sug) {
  const s = JSON.parse(JSON.stringify(state));
  s.suggestionLog = s.suggestionLog || [];
  if (s.suggestionLog.some((x) => x.sid === sug.sid)) return s;
  const d = isoOf(todayStart());
  s.suggestionLog.push({ sid: sug.sid, decided: "dismissed", d, at: clock.nowISO(), title: sug.title, ...(sug.apply && sug.apply.kind ? { apply: { kind: sug.apply.kind } } : {}) });   /* SCALE-2 — same provenance on a dismissal */
  s.feed.unshift({ d, op: "sug:" + sug.sid, t: "ANALYST SUGGESTION DISMISSED", how: sug.title });   /* SCALE-4 — op-keyed */
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10083-10131.
function applyAgentProposal(state, ap, tISO) {
  /* SPLIT item d — acceptance is merge-closed: a retired lift takes no
     proposal, and an order-derived proposal from an older plan generation is
     superseded rather than applied (a stale replica can restore the CARD; it
     cannot make it actionable). */
  try {
    if (ap && ap.exId && !exActive(state, ap.exId)) {
      const s0 = JSON.parse(JSON.stringify(state));
      s0.agentProposals = (s0.agentProposals || []).filter((x) => x.id !== ap.id);
      s0.feed.unshift({ d: tISO, t: "OFFER SUPERSEDED — " + (ap.title || ap.exId), how: "The lift this proposal targets was retired by the split ruling; the offer is preserved in history and closed without effect." });
      return s0;
    }
    /* R4 fix-4: the KIND gates the generation check ITSELF. Round 2 narrowed
       only the pg-ABSENT default, while the check still read ap.pg from every
       kind — so a producer-shaped reset (kind "reset", pg 51, exactly what
       sweepStalls stamps) was falsely superseded the moment the athlete
       reordered his own plan. A reset is stall-derived: sweepStalls never
       consults the order, so no plan generation can invalidate it. */
    const apOrder9 = ap && ap.kind === "volume";
    const apPg9 = apOrder9 ? (ap.pg != null ? ap.pg : 0) : null;   /* FIX split-1 (P0-4): a pg-ABSENT ORDER-DERIVED offer is pre-51 by construction — "rejects only a non-null older generation" was the hole */
    if (ap && apPg9 != null && state && state.planGen != null && apPg9 < state.planGen) {
      const s0 = JSON.parse(JSON.stringify(state));
      s0.agentProposals = (s0.agentProposals || []).filter((x) => x.id !== ap.id);
      s0.feed.unshift({ d: tISO, t: "OFFER SUPERSEDED — " + (ap.title || "plan change"), how: "This offer was derived from an earlier plan generation; the plan has since changed, so it closes without effect. A current offer must be re-earned under the current plan." });
      return s0;
    }
  } catch (e) {}
  const s = JSON.parse(JSON.stringify(state));
  if (ap.kind === "volume" && ap.exId && ap.dir) {
    /* R18f fix2 (c) — the desk's tap re-checks the budget too, and speaks */
    const smwT2 = structuralMovesThisWeek(s);
    if (smwT2.sets.length) {   /* A5 — the premise is the VOLUME budget */
      s.agentProposals = (s.agentProposals || []).filter((x) => x.id !== ap.id);
      s.feed.unshift({ d: tISO, t: "OFFER EXPIRED AT THE TAP — " + (ap.title || "VOLUME"), how: "A volume move already landed this week, so this offer's premise had expired. Nothing changed. The desk re-asks when the chooser re-earns it." });
      return s;
    }
    const ex7 = s.exercises.find((x) => x.id === ap.exId);
    if (ex7) { ex7.sets = Math.max(1, (ex7.sets || 1) + ap.dir); ex7.setsAt = clock.nowISO();   /* AUDIT G — every sets mutator stamps, or the merge reverts the change */ s.feed.unshift({ d: tISO, at: clock.nowISO(), t: `VOLUME ${ap.dir > 0 ? "+1" : "−1"} — ${ap.mg.toUpperCase()} via ${ex7.n} (now ${ex7.sets} sets)`, how: "the volume ledger proposed, you consented — two weeks of data before this muscle is revisited" }); }
  } else if (ap.kind === "reset" && ap.exId && ap.newW) {
    const ex3 = s.exercises.find((x) => x.id === ap.exId);
    if (ex3) { const oldW = ex3.w; ex3.w = ap.newW; ex3.wAt = clock.nowISO(); ex3.last = null; s.feed.unshift({ d: tISO, t: "RESET APPLIED — " + ex3.n + " " + oldW + " → " + ap.newW, how: "3-session stall, evidence-based back-off, your consent — rebuild starts next session" }); }
  } else if (ap.kind === "trial") {
    const rec = ap.custom ? { custom: ap.custom, started: tISO } : { tplId: ap.tplId, started: tISO };
    s.trials = [...(s.trials || []), rec];
    s.feed.unshift({ d: tISO, t: "TRIAL STARTED — " + (ap.custom ? ap.custom.t : TRIAL_TPL[ap.tplId].t), how: ap.custom ? "designed by your analyst for a pattern in YOUR data, consented by you" : "proposed by your analyst, consented by you" });
  }
  s.agentProposals = (s.agentProposals || []).filter((x) => x.id !== ap.id);
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10132-10143.
function dismissAgentProposal(state, ap, tISO) {
  const s = JSON.parse(JSON.stringify(state));
  if (ap.kind === "volume" && ap.mg) s.feed.unshift({ d: tISO, t: `VOLUME PASSED — ${ap.mg.toUpperCase()}`, how: "athlete dismissed — the ledger waits two weeks before raising this muscle again" });
  if (ap.kind === "trial") {
    /* the decline is RECORDED in s.trials, so a pre-filed trial card never refiles —
       the same once-ever shape the owner's-call cards use */
    s.trials = [...(s.trials || []), ap.custom ? { custom: ap.custom, declined: true } : { tplId: ap.tplId, declined: true }];
    s.feed.unshift({ d: tISO, t: "TRIAL PASSED — " + (ap.custom ? ap.custom.t : ((TRIAL_TPL[ap.tplId] || {}).t || "")), how: "athlete declined — the pass is recorded, so the desk never re-raises it" });
  }
  s.agentProposals = (s.agentProposals || []).filter((x) => x.id !== ap.id);
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10149-10177.
function dismissProposal(state, pid) {
  const s = JSON.parse(JSON.stringify(state));
  const p = s.proposals.find((x) => x.id === pid);
  if (!p || p.resolved) return s;
  p.resolved = true; p.dismissed = true;
  s.adjustments.push({ rid: p.rid, id: _freshId("adj_"), d: isoOf(todayStart()), at: clock.nowISO(), title: p.title, dismissed: true });   /* SCALE-8 — stamped like every other writer */
  /* R14 — WHAT A DECLINE BUYS, STATED PER KIND, so copy and mechanism agree from birth.
       The mechanism (since the applied() fix) is: a declined rid re-arms whenever its
       condition still holds on a later sweep. That is the honest default. Kinds whose
       producers fire on a schedule or a one-off get their own sentence. */
    const DECLINE_BUYS = {
      cal: "If the pattern that raised it still holds, it comes back — a decline is a no for today, not a rule.",
      refeed: "This one is a one-off decision; declining closes it unless the evidence changes.",
      steps: "If the step pattern persists, it comes back with fresh numbers.",
      steppush: "This week's steps question is answered — it stays quiet before Monday. If the rate is still under the corridor then, it returns with fresh numbers.",
      volpush: "This week's volume question is answered — the lever stays quiet before Monday. If your state still sanctions growth then, it returns with fresh numbers.",
      volroll: "Declined — the sets stay on for now. The tolerance read continues, and the staged hold returns Monday if the lift is still deteriorating.",
      exit: "Phase decisions never expire and never re-file themselves — this stays yours to raise.",
      ladder: "Filed once per lift; declining closes it — the ladder sweep never re-files a rid it has already raised, so this will not come back unless the exercise itself changes.",
      default: "The engine re-arms it if the pattern that raised it holds.",
    };
    /* AUDIT rider companion — R14's own rule: copy and mechanism agree from birth. The 6a
       fix makes a steppush decline buy the WEEK (the rid is monday-stamped), but kind:"cal"'s
       decline sentence says "a no for today" — true for the ap steers, false for this card.
       Key the sentence on the rid, which is where the pacing actually lives. */
    const declKind = (p.rid && /^steppush_/.test(p.rid)) ? "steppush" : (p.rid && /^volpush_/.test(p.rid)) ? "volpush" : (p.rid && /^volroll_/.test(p.rid)) ? "volroll" : ((p.apply && p.apply.kind) || "default");
    s.feed.unshift({ d: isoOf(todayStart()), t: "ADJUSTMENT DECLINED", how: `${p.title} — you passed; nothing changed. ${DECLINE_BUYS[declKind] || DECLINE_BUYS.default}` });
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10222-10264.
function undoAdjustment(state, rid) {
  const s = JSON.parse(JSON.stringify(state));
  const adj = s.adjustments || [];
  let i = -1;
  for (let k = adj.length - 1; k >= 0; k--) { const a = adj[k]; if (!a || a.undone || a.dismissed) continue; if (rid && a.rid !== rid) continue; i = k; break; }
  if (i < 0) return s;
  const a = adj[i];
  const p = (s.proposals || []).find((x) => x && x.rid === a.rid && x.resolved);
  if (p) { p.resolved = false; p.dismissed = false; p.nudge = 0; p.auto = false; }   // hand the decision back to the inbox
  a.undone = true;
  /* SCALE-5 (Sol's pass 3, row 4 — "the control hides itself without reversing the
     effect"). For an analyst-suggestion adjustment the effect lives in the DECISION
     ROW, and the reconciler re-derives targets and receipts from it — so an undo that
     only marked the adjustment left proteinG standing and printed "reversed" over an
     un-reversed state. The undo now lands on the row itself: a monotone `undone` flag
     (the union can carry it but never drop it), which the derivation reads as "this
     approval's effect is off" — target reversed, receipt re-derived as UNDONE. The
     athlete's word, durable across every sync. */
  const sugRow9 = (Array.isArray(s.suggestionLog) ? s.suggestionLog : []).find((x) => x && x.sid === a.rid);
  if (sugRow9 && sugRow9.decided === "approved") { sugRow9.undone = true;
    /* SCALE-7 (Sol's pass 5, P0) — the undo files its own op-keyed FACT line, the
       attestation pattern (his A3: the pattern is the template): value-independent,
       unionable, feedop-guarded by presence, and NEVER swept by the receipt projection
       (its op is `sugundo:`, outside the `sug:` sweep) — so the tap survives any braid
       that erases the decision row, and the orphan absorption can re-materialize the
       tombstone from this line alone. `ti` carries the title as a machine field: no
       text is ever parsed back out of the athlete-facing copy. */
    s.feed = s.feed || [];
    if (!s.feed.some((f) => f && f.op === "sugundo:" + a.rid)) s.feed.unshift({ d: isoOf(todayStart()), op: "sugundo:" + a.rid, ti: String(a.title || ""), t: "SUGGESTION UNDO ATTESTED — " + String(a.title || a.rid).slice(0, 48), how: "You reversed this analyst move by one tap. This line is the record of that word — it travels with the data, so no older copy of the app can unsay it." });
    reconcileSuggestionEffects(s); }
  if (a.planUndo && a.planUndo.field) _stampPlan(s, { [a.planUndo.field]: a.planUndo.prev }, { kind: "undo", field: a.planUndo.field });
  /* VOLUME LEVER — the exercise-field mirror of planUndo: revert the exact count and STAMP
     it (AUDIT G — a synced device must not resurrect the undone count), and the revert is
     itself a set-count change, so the trend window restarts again: author-blind (AUDIT F). */
  if (a.exUndo && a.exUndo.field === "sets") {
    const exU = (s.exercises || []).find((x) => x.id === a.exUndo.exId);
    if (exU) { exU.sets = a.exUndo.prev; exU.setsAt = clock.nowISO(); }
  }   // v7.4.0 Slice 5 — a phase/break decision reverses through the SAME one-tap undo (restores the prior value, hardened)
  // v7.2.0 audit — KEEP the row (durable), don't splice it. Splicing an apauto_ record erased the once/day auto-apply guard's memory (apAutoHandledFor), so the auto-move RE-FIRED on the next mount and could duplicate the apauto_ proposal. Marking undone reconciles with lastUndoable (which already skips undone rows) and keeps the guard true for the day.
  s.feed = s.feed || [];
  s.feed.unshift({ d: isoOf(todayStart()), t: "MOVE UNDONE", how: `${a.title} — reversed; ${p ? "it's back in your inbox to decide." : (sugRow9 && sugRow9.undone ? "the target it set is off." : "nothing was locked in.")} Undo is always one tap.` });   /* SCALE-5 — the line may not claim "nothing was locked in" over a reversal that just turned a target off */
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:10274-10286.
function undoRead(state, iso) {
  const s = JSON.parse(JSON.stringify(state));
  const i = s.reads.findIndex((r) => r.d === iso);
  if (i === -1) return s;
  const r = s.reads[i];
  s.reads.splice(i, 1);
  s.feed = (s.feed || []).filter((f) => !(f && f.op === "lateread:" + iso));   /* SCALE-1 — the late-read receipt rides with the read it describes */
  if (!r.sealed && !r.offWindow && r.pt != null) s.trend = r.pt;
  const d = mk(iso); const off = (d.getDay() + 6) % 7; const monday = isoOf(new Date(d - off * DAY));
  const stillClean = s.reads.some((x) => !x.sealed && x.d >= monday && weeksBetween(monday, x.d) < 1);
  if (!stillClean) s.weekly = s.weekly.filter((w) => w.wk !== monday);
  return s;
}

// Copied from frozen src/app.jsx @ fe516c1:12313-12336.
const GLOSSARY = {
  fixwindow: ["Fix window", "Yesterday's protein landed SHORT of the floor, so a 24-hour repair window opened. Clear the floor today and the record EXTENDS — the app measures recovery speed, never an unbroken chain. Unfixed, it just closes; nothing compounds. Only a shortfall opens it: protein is a floor, and eating over it was never a miss, whatever this entry used to say."],
  rir: ["RIR — reps in reserve", "How many clean reps were left when you racked it. 1 is 'honest' — one more good rep existed. 0 is a grind. Rate two sets: the FIRST, which says whether the load is still honest (0 twice running holds the weight), and the LAST, which the taper programs to failure — 0 there is the target, not a warning. Middle sets are prescribed, so they go unrated on purpose. When unsure at noon on the stim stack, call it 0."],
  ea: ["Energy availability", "What is left to run your body on after training is paid for: calories in, minus what training and deliberate walking cost, divided by your lean mass. The threshold that matters for a lean man is 25 kcal per kg of lean mass per day — above it, a deficit mostly takes fat; below about 20, more than 40% of what you lose comes off lean mass, and testosterone, thyroid and resting metabolism go with it. It shows a RANGE, not a number, and that is deliberate: the convention counts purposeful exercise, and 16,000 deliberate steps sit exactly on the line between training and just moving. Nobody has settled that, so the app shows both ways of counting instead of picking one and sounding certain. The session and step costs are population estimates, not measurements of you — which is why this instrument only ever claims which side of the line you are on."],
  rest: ["Rest between sets", "90 s on isolation, 150 s on compounds, and 30 s more before the final set. The number comes from where the evidence stops moving: pooled across nine studies, longer rest beats short rest by a small margin that runs through volume load — you keep more reps on the back sets — but no further benefit is measurable past about 90 s. So 90 is the floor worth holding and anything beyond it on isolation work is session time you are spending for nothing. Compounds sit at 150 s because that is inside the 2–3 min band tested directly in trained lifters. The extra 30 s before the last set is a judgement call, not a finding: that set is the one prescribed to failure, and it is the one the progression engine reads to size your next jump — so it is the set worth protecting."],
  pace: ["RUSHED (pace)", "That session ran on short rest — under about a minute between sets. It matters for one reason: less rest means fewer reps on the back sets, so the volume load drops. The reps still count and still move your trend. What a rushed day can't do is count toward a stall — three stalls lighten the bar 5%, and running out of time is not evidence that the weight is too heavy. The research here is modest and honest about itself: pooled across nine studies the rest effect is small and mostly runs through volume load, with nothing measurable past ~90 s. So the app records it as context, not as a verdict on the session."],
  debt: ["Short night", "That session followed a night under 6.5 h, or a three-night run averaging under 7. Down numbers on a short night read as context rather than regression, so the day is exempt from counting toward a stall. It does NOT make a record provisional — the strength cost of a short night is about 2.85% — real (CI 1.23–4.47) — smaller than the set-to-set spread the app already measures, and no record here was ever gated on sleep once the desk stopped holding lifts."],
  clean: ["AT TARGET (sleep)", "A run of consecutive nights at your sleep target. It is NOT a gate — owns and earns count whenever you hit them, on any amount of sleep, because the strength cost of a short night is about 2.85% — real (CI 1.23–4.47) — and that is smaller than your own set-to-set spread. What a run at target buys sits on the body-composition side: at a matched deficit, short sleep sends roughly 60% more of what you lose off lean mass instead of fat."],
  seal: ["Sealed scale", "Around events, reads are quarantined: logged but excluded from the trend, and every rate rule is muted. The seal exists so event water can never trigger a false alarm."],
  trend: ["Trend", "The damped average the whole app runs on: each clean read moves it 30% of the way, spikes clamp at ±1.5 lb, sealed reads don't touch it. Mornings are static; the trend is the instrument."],
  own: ["OWNED", "The standard repeated. One hit is a visit; a repeat is an address — and the repeat IS the confirmation, which is the entire statistical content of the rule. Sleep used to be a third condition stacked on top of it and is gone. Only owned standards let the load move."],
  earned: ["EARNED", "Reps hit the top of the window — the increment is bought and queues itself for a debut. Grinds at RIR 0 never earn."],
  debut: ["DEBUT", "An earned load's first outing. It runs when it wins its day's single structural slot, with zero rep expectations — log what it gives."],
  gated: ["GATED", "Visible but locked behind a named condition. The condition decides, not memory or mood."],
  reclaim: ["RECLAIM", "A standard that slipped. The exact rep line must be re-earned before anything moves — records here can fall and be won back."],
  parked: ["PARKED", "Deliberately shelved with a written trigger (a date, a phase, a coach call). Parked isn't forgotten; it's staged."],
  structural: ["Structural change", "A load jump, new set, or machine change. One per session, auto-picked from the queue — so every response stays attributable. Rep progression is unlimited."],
  whoosh: ["Whoosh", "Event water leaving days after the event — a spike that drains to a NEW low. Yours clears in 1–3 days; the LAB predicts the window in advance."],
  noonwindow: ["Why noon lifts read easy", "You lift at your stimulant peak, and stimulants mask effort — a set that feels like 2 in the tank is often 1 or 0. That's why the app asks you to read effort conservatively at noon, and why the honest-opener rule matters most here: the governor can only protect you from numbers you report truthfully."],
  rirplan: ["Suggested RIR — where it comes from", "The literature (Refalo 2023–24 meta-analyses; Helms-style RIR prescription) says 0–5 reps-in-reserve all build muscle, with a slight edge nearer failure — so everything tapers to a single terminal failure set — 2→1→0, and four-set movements run 2·1·1·0; only the last set of an exercise is ever programmed to failure. Your machine-based setup makes that true failure safe, and the opener stays the honest gatekeeper (earns judge the opener, so the final 0 can never corrupt the signal). Then YOUR data adjusts it: a governor hold floors everything at 2, and lifts where your logged openers run hot get one extra in the bank up front. It recomputes every session. What it no longer does is back the terminal set off failure after a short night — that rule is retired, because proximity to failure is the variable growth actually tracks and the strength cost of a short night is about 2.85%, inside the set-to-set noise this app already models."],
  driftoff: ["Estimating drift-off", "Morning-after guessing is the clinical standard (it's how sleep diaries work). Anchor on the last thing you remember — final position change, a thought, a sound — and count minutes from lights-out to that, rounded to 5. Truly no idea? Leave the 15: the math uses a rolling median and within-you comparisons, so honest-rough beats fake-precise. A wearable's latency number can go in the same box anytime."],
  nightdate: ["How nights are dated", "A night belongs to the evening it began: Tuesday night = Tue evening → Wed morning, filed under Tuesday. You log it the morning after. Before 5 a.m. the app still means the night you already finished — never the one you haven't slept yet. Missed a morning? The row stays, dated, for up to 3 days."],
  noise: ["Noise floor", "Your scale's day-to-day static, measured from your own deltas rather than assumed — the trend absorbs it so a single morning never moves a decision. Any single-morning move inside it is not information, and the app stamps it so."],
};

// Copied from frozen src/app.jsx @ fe516c1:12342-12342.
const LEDGER_DICT = "FIELD DICTIONARY (authoritative — never guess a meaning): NIGHTS: h = hours asleep · bed/wake = clock times as logged (they vary; that is expected) · sol = drift-off, minutes to fall asleep · tags: woke = woke mid-night, caff = late caffeine. DAYS: cal/pro/steps as logged · dayCtx est = athlete-declared estimate day (rough numbers, lower evidentiary weight) · ⌁flags = day weather (event window / seal water / post-refeed / estimate). SESSIONS: entries = performed lifts only, w = load, reps per set, rir = reps in reserve on the opener · skipped = lifts deliberately not done (structured truth, zero phantom reps) · note = athlete prose, read it · niggles = flagged aches · dips = incidental dip count. READS: raw morning scale, sealed = quarantined event water, judge only via damped trend. PULSE bpm / TEMP °F = 60s wrist count and oral reading at wake. MEDSLOG: prescription taken/none with clock time — pure adherence bookkeeping; the system's biggest confound (appetite, pulse, effort, drift-off all move with it) now has a clock. ENERGY: morning 1–5 (1 fumes · 5 caged animal). SORENESS: muscles tapped sore at wake (empty list = nothing sore, logged). GRIP: best squeeze per hand in lb, same posture daily — a CNS-readiness number. DAILY sodium low/med/high and alcohol units ride the day numbers — units are a COUNT ONLY, a covariate for sleep/pulse/scale attribution; their calories live inside the athlete's logged cal and are never added by the app; on estimate days the unit count is a bracket midpoint like everything else. CAFFLOG: actual daily caffeine — mg and clock time as logged (mg 0 = a deliberate none-day); tail math runs on these, never an assumed noon. FEED: the app's event log — amendments and corrections here OVERRIDE older raw rows. RECORDS: a rep line becomes his when it clears his own measured set-to-set spread and then repeats — the spread is typicalError, a SINGLE-OBSERVATION typical error: paired same-load, same-set-count differences ÷ √2 (31 pairs when defined; the live n grows with the log) — sleep is NOT a condition on it and never mention pending-on-sleep, that rule is retired. LAWS: a single terminal failure set per exercise, every session, including after a short night.";

// Copied from frozen src/app.jsx @ fe516c1:12458-12472.
function kitLetter(spec, st) {
  const ds = Object.keys(st.days).sort();
  const now = todayStart().getTime();
  const inWk = (d, back) => { const t2 = mk(d).getTime(); return t2 > now - back * 7 * DAY && t2 <= now - (back - 1) * 7 * DAY; };
  const wk = (back) => ds.filter((d) => inWk(d, back)).map((d) => st.days[d]);
  const thisW = wk(1), lastW = wk(2);
  const walks = (a) => a.filter((x) => x.walkMin >= (spec.walkGoalMin || 20)).length;
  const avgW = (a) => { const v = a.filter((x) => x.weight).map((x) => x.weight); return v.length ? +(v.reduce((p, q) => p + q, 0) / v.length).toFixed(1) : null; };
  const L = ["Your week, in plain words:"];
  if (spec.modules.walk) { const wN = walks(thisW); L.push(`You took ${wN} good ${wN === 1 ? "walk" : "walks"} this week${lastW.length ? ` (${walks(lastW)} the week before${walks(thisW) > walks(lastW) ? " — more than last week, which is the whole game" : walks(thisW) === walks(lastW) ? " — steady, which counts" : ""})` : ""}.`); }
  if (spec.modules.weight) { const a2 = avgW(thisW), b2 = avgW(lastW); if (a2) L.push(`Average ${spec.vocab.weight}: ${a2} ${spec.weightUnit}${b2 ? ` (was ${b2})` : ""} — single days wiggle; the average is the truth.`); }
  if (spec.modules.bp) { const n2 = thisW.filter((x) => x.bp).length; if (n2) L.push(`${n2} ${spec.vocab.bp} reading${n2 > 1 ? "s" : ""} on file this week — a tidy record is exactly what your doctor wants to see.`); }
  L.push("Nothing to fix. Just keep showing up.");
  return L.join(" ");
}

// Copied from frozen src/app.jsx @ fe516c1:12538-12582.
function askContext(s, docs) {
  docs = docs || {};
  const days = Object.entries(s.dailyLogs).sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(-14)
    .map(([d, v]) => { const w2 = dayWeather(s, d); return `${d}: cal ${v.cal ?? "—"} · pro ${v.pro ?? "—"} · steps ${v.steps ?? "—"}${w2.flags.length ? "  ⌁[" + w2.flags.map((f) => f.k).join(",") + "]" : ""}`; }).join("\n");
  const sess2 = Object.keys(s.sessionLog).sort().slice(-6).map((d) => { const sl2 = s.sessionLog[d]; const parts = [(sl2.entries || []).map((e) => `${e.id} ${e.w}×${(e.reps || []).join(",")}${e.rir != null ? ` RIR${e.rir}` : ""}`).join(" · ") || "no lifts"]; if ((sl2.skipped || []).length) parts.push("SKIPPED: " + sl2.skipped.map((k) => k.id).join(", ")); if (sl2.note) parts.push(`note: "${sl2.note.slice(0, 120)}"`); return `${d}: ` + parts.join(" · "); }).join("\n");
  const nights2 = s.sleep.nights.slice(-14).map((n) => `${n.d}: ${n.h}h · bed ${n.bed || "—"} → wake ${n.wake || "—"} · drift-off ${n.sol ?? "?"}m${(n.tags || []).length ? " · " + n.tags.join("/") : ""}`).join("\n");
  const laws = `DATA WEATHER LAW: days marked ⌁[event/sealwater/estimate/postrefeed] carry water or intake noise — NEVER build causal or trend claims on them without naming the flag; prefer clean days, and say when a finding leans on flagged ones. HOUSE LAWS: fat-loss corridor ${cutRateBand(s).band.join('–')} lb/wk in ${apModeOf(s) === "fatloss" ? "MAX FAT LOSS" : "MAX BODY COMP"} mode (${(s.rate || {}).redline || 1.9}+ = too fast); calorie floor ${calorieFloor(s).floor} (DERIVED from energy availability at his lean mass — not the old authored 1,700); calories, protein and steps are all DERIVED from his record, never quoted as constants — take them from the CANONICAL NUMBERS block and nowhere else; a new best becomes official on ONE repeat, because his own measured set-to-set spread is about ±${typicalError(s, null).reps} reps (${typicalError(s, null).src}) and a +1 record sits inside it — a jump two standard errors clear of the old line banks on the first sighting instead; short sleep does NOT block a record and does NOT cap the step (that rule was retired — Craven 2022 puts acute sleep loss at −2.85% on strength — real, CI 1.23–4.47, just smaller than his own day-to-day spread — and no trial has ever tested damping progression on low-readiness days), what it does is exempt the day from counting toward a stall; terminal RIR gates every earn (0 blocks it), can take an earn early off one honest sighting — always by his tap, never automatically — and sizes the jump where the machine's rung ladder is on file; it is the most valuable number he enters; one structural change per session; effort tapers to a single terminal failure set per exercise (RIR 2→1→…→0) — proximity to failure is the training variable with the dose-response, not load or rep range, which are interchangeable from about 5 to 30 reps; the scale seal quarantines event water; the weekly refeed is RETIRED — he took it off the calendar himself after the evidence was laid out, so do not propose one and never claim a refeed aids fat loss, muscle retention, metabolism or next-day performance; past Wednesdays on the record were refeeds and stay described as such, because they were; every change is a proposal — the athlete consents, the coach holds structural authority. NEVER assert a mechanism this app cannot cite; saying 'there is no good evidence either way' is always available and always preferred to a confident guess.`;
  const evs = (s.events || []).map((e) => `${e.d}: ${e.t}${e.estimated ? " (est-declared)" : ""}`).join(" · ") || "none";
  const trls = (s.trials || []).map((t3) => { const tp = trialTpl(t3); return tp ? `${tp.t} (${t3.declined ? (t3.retired ? "retired " + t3.retired : "declined") : "started " + t3.started})` : ""; }).filter(Boolean).join(" · ") || "none";
  const gate2 = sleepInfo(s);
  /* The canonical numbers, handed over rather than left to be re-derived. The
     analyst and the engine were quoting TDEEs 200+ kcal apart because each was
     computing its own rate from the same ledger by a different method. One
     source, stated method, stated uncertainty — and an instruction not to
     recompute it, because a second opinion here is not insight, it is drift. */
  const rC = currentRate(s), tdC = observedTDEE(s), ctC = energyBalanceTarget(s), eaC = energyAvailability(s);
  const bfC = bfEst(s);
  const canon = " CANONICAL NUMBERS (use these verbatim; do NOT re-derive them from the raw logs — the engine already did, with a stated method): "
    + `BODY FAT ${bfC.pct}% with an honest interval of ${bfC.lo}-${bfC.hi}% (anchored by ${bfC.src}, +/-${bfC.anchorErr} points, ${bfC.wks} weeks ago). That width is real and does not shrink by being ignored — quote the interval whenever the answer turns on which side of a threshold he sits. `
    + `RATE ${rC.scale} lb/wk by ${rC.method}${rC.ci ? ` (95% CI ${rC.lo}–${rC.hi}, n=${rC.n} daily reads)` : ""}. `
    + (tdC ? `MEASURED TDEE ${tdC.tdee} kcal${tdC.lo && tdC.hi ? ` (${tdC.lo}–${tdC.hi} carrying the rate's error)` : ""} from ${tdC.days} logged days at ${tdC.avg} kcal/day average intake. ` : "MEASURED TDEE: not enough clean days yet. ")
    + (ctC.gated ? "" : `TARGET INTAKE ${ctC.lo}–${ctC.hi} kcal/day, derived from that maintenance and his ${ctC.band[0]}–${ctC.band[1]} lb/wk band. `)
    + (eaC.gated ? "" : `ENERGY AVAILABILITY ${eaC.ea} kcal/kg lean (${eaC.band}) counting structured training only — that is the IOC's convention and the only figure comparable to the ${EA_SPARING} threshold. Counting his deliberate walking as training instead gives ${eaC.eaAll}, which is a real reading of everything he burns in a day but has no published threshold behind it: quote ${eaC.ea} against the line and mention ${eaC.eaAll} only as the other convention. The ${EA_SPARING} itself is EXTRAPOLATED from semi-starvation work and bodybuilder case reports — the IOC's 2023 male range is roughly 9–25 and no controlled study has tested a lean resistance-trained male at 23 vs 30. Say so if you cite it. `)
    + (() => { const p9 = proteinTarget(s); return `PROTEIN TARGET ${p9.g} g — a DYNAMIC evidence target: ${p9.perKg} g/kg of his current measured ${p9.ffmKg} kg lean mass (${p9.gLo}-${p9.gHi} g across the estimate's own ${p9.bfLo}-${p9.bfHi}% spread). It moves when the estimate moves, in either direction; it is a FLOOR, not a bullseye — never call a high-protein day a miss — and eating above it is his preference, never body-fat-triggered. `; })()
    + `Do NOT vary it by day type: the only direct training-vs-rest-day comparison (Moore 2024, indicator amino acid oxidation) found requirement HIGHER on rest days, and no study has ever tested raising protein on a short-sleep or low-recovery day. `
    + (() => { const stC = stepTarget(s); return stC.gated ? "" : `STEP TARGET ${stC.lo.toLocaleString()}–${stC.hi.toLocaleString()}/day — this is not a health guideline, it is the step count his measured maintenance was measured at (${stC.avg.toLocaleString()} across ${stC.days} days). Every 1,000 steps is about ${stC.kcalPer1k} kcal at his bodyweight, so drifting off it silently invalidates the calorie band. `; })()
    + (() => { const an = sleepAnchor(s); if (!an.measured) return `SLEEP CLOCK: not enough nights with bed and wake times yet — ${an.why} `;
        const shift = an.shiftMin > 0 ? `To clear his ${an.target} h target at the wake time he already keeps, lights out ${an.needBed} — ${an.shiftMin} minutes earlier.` : "He already clears his target.";
        return `HIS SLEEP CLOCK (measured, do NOT re-derive): bed ${an.bed} +/-${an.bedSDmin} min, up ${an.wake} +/-${an.wakeSDmin} min, ${an.curH} h asleep across ${an.n} nights. ${shift} His BEDTIME is the steadier end of the night and his WAKE is the variable one, so name bedtime as the lever — never 'fix your wake time', which asks him to control the end he controls least. Sleep is a BODY-COMPOSITION lever here, not a session one: at a matched deficit short sleep shifts roughly 60% more of the loss onto lean mass (Nedeltcheva 2010), while the session cost sits inside the noise. `; })()
    + (() => { const dx = dietExit(s); if (dx.gated) return "";
        return `THE DIET EXIT (his stated plan, not a default): straight to maintenance, hold, then decide. One step from ${dx.from} to ${dx.maintenance} — his MEASURED maintenance — then hold ${dx.holdMin}-${dx.holdFull} weeks before choosing anything else. Do NOT propose a reverse-diet ramp: it has no controlled trial behind it, only practitioner convention, and what is replicated is time spent AT maintenance (MATADOR, Byrne 2018), which does not require arriving slowly. Do NOT assume a surplus or a build follows — he has not decided that, and the hold exists so the decision has data behind it. If he asks when to stop cutting, say plainly that no study answers it and his body-fat interval (${dx.bfLo}-${dx.bfHi}%) is wider than the decision. `; })()
    + (() => { const se8 = exerciseSelection(s); if (!se8.items.length || !se8.allGood) return "";
        return `EXERCISE SELECTION (audited against his real gym, confirmed by him directly): every biarticular lift in his programme is already in the lengthened position — standing calf raise with a stretch pause, seated ham curl with hips pinned, reclined leg extension. That is the strongest selection lever in the literature I have read for him (standing vs seated calf raise d = 0.88-1.58 in one small untrained trial, against rep tempo at 0.09) and he is on the right side of all of it. Say so if training comes up, and do NOT go hunting for exercise-selection upgrades that are not there. His triceps use a Prime 3-peg rather than an overhead position: he was shown the d = 0.54-0.61 case and chose to keep it. That is settled — the peg changes the resistance profile, not the shoulder angle, so it was never the same variable — and it must not be raised again. `; })()
    + (() => { const vi8 = volumeImbalance(s); if (!vi8) return "";
        return `WEEKLY SET ALLOCATION (by head; deltoids counted separately because they are separately trained): ${vi8.pv.map((m) => mgLabel(m.mg) + " " + m.sets + (m.indirectOnly ? " (indirect only)" : "")).join(", ")}. ${vi8.growthOK ? "His MEASURED regime is FREE — lifts holding or rising while fat still falls, confirmed a week apart — so the growth band applies again and raising the lowest muscle is worth proposing; the engine may already have filed that card, so do not double-propose." : "The regime detector does NOT currently sanction adding sets (regime: " + vi8.regimeKey + "), so do NOT recommend adding sets to a muscle sitting below the 6-12 band. That band is a GROWTH dose-response measured in people eating enough to build. Roth 2023 (n=38, six weeks, 30 kcal/kg deficit, 2.8 g/kg protein) compared ~20 weekly sets against ~12 and found lean mass preserved identically with no muscle-thickness difference; Bickel 2011 held young adults' thigh lean mass for 32 weeks on one-ninth of the volume that built it. Retention is cheap and is not volume-sensitive. If he asks about a low muscle, say it is adequate for holding and is the first thing to raise when his own measured state sanctions building."} `; })()
    + `HIS MEASURED SET-TO-SET REP SPREAD ${typicalError(s, null).reps} reps (n=${typicalError(s, null).n} paired sets at identical load) — use this when judging whether a rep change is real. A +1 rep session is inside it. `
    + "If you disagree with any of these, say WHY and by how much rather than quietly substituting your own — a number that changes between screens is worse than one that is slightly wrong.";
  const dict = LEDGER_DICT + canon + " SLEEP RIGHT NOW (do not re-derive): last night " + ((gate2.last || {}).h ?? "—") + " h; " + gate2.run + " consecutive night(s) at his " + s.sleep.cleanH + " h target; the session is flagged " + (gate2.clean ? "NORMAL" : "SHORT SLEEP") + ". Short sleep no longer blocks a record or caps a progression step — it only exempts the day from counting toward a stall. EVENTS: " + evs + ". ACTIVE TRIALS: " + trls + ".";
  const clip = (t, n) => (t ? String(t).replace(/^<!--.*-->\n?/, "").slice(0, n) : "");
  const analysisSec = docs.analysis ? `\n\n=== TONIGHT'S ENGINE ANALYSIS (analysis.json — soft trend, rate, TDEE, drivers, regime, prior decisions) ===\n${clip(docs.analysis, 3500)}` : "";
  const suggSec = docs.suggestions ? `\n\n=== YOUR CURRENT APPROVE/DISMISS SUGGESTIONS (the NOW cards) ===\n${clip(docs.suggestions, 1800)}` : "";
  const briefSec = docs.brief ? `\n\n=== YOUR LATEST READ (brief.md — your own nightly words, the voice to match) ===\n${clip(docs.brief, 1800)}` : "";
  const caselawSec = docs.caselaw ? `\n\n=== CASE-LAW / MEMORY (what has held true before) ===\n${clip(docs.caselaw, 1800)}` : "";
  return `You are Joe's Analyst — the same analyst that writes his nightly read. When Joe asks something here, he is asking you: answer in the same voice, from the same knowledge. Your one goal: the best body-composition change — fat down, lean held or built — as fast as he can sustain. Read everything through two lenses only: established sports-science research, and Joe's own data. HOW YOU TALK: plain conversational prose, exactly like your nightly read — the way you'd say it out loud to a sharp friend who lifts. Use no markdown at all — no # headers, no **bold**, no bullet lists or numbered scaffolding, no tables. No jargon, no (measured)/(speculation) tags, no "provisional". Lead with the answer and the one thing that matters, use his real numbers, keep it tight; if the data is thin, just say so in plain words. TWO LAWS: look at everything relevant and how the variables move each other; and weigh science and his own data together — where they agree, say it plainly, where they disagree, name the tension. Never go dark on a noisy number: a single scale reading is noise around a slow trend, so attribute spikes to their cause (water from sodium, carbs, a big meal, a short night) instead of hiding them. THE SCIENCE FLOOR (your prior): lean-safe loss is about 0.5–1.0%/wk (~1.0–1.4 lb/wk for him; 1.9+ is too fast) and deficit MAGNITUDE is the variable most tightly linked to lean-mass loss in trained people; protein ~2.3–3.1 g/kg fat-free mass, fixed daily, not varied by training vs rest day; sleep is a first-order fat-vs-LEAN lever in a deficit (Nedeltcheva 2010: 5.5 h vs 8.5 h shifted 60% more of the loss onto fat-free mass) but only a small SESSION lever (Craven 2022: −2.85% on strength — real, CI 1.23–4.47, smaller than his own day-to-day spread) — do not tell him a short night ruins a session or invalidates a record, because the app no longer treats it that way and the evidence never did; train to roughly 6–12 hard sets per muscle per week at 0–2 reps in reserve, where the dose-response return per set is highest. Things that DO NOT matter and must never be presented as if they do: rep tempo (meta-analytic SMD 0.09, and it favours going faster, not slower), slow or accentuated eccentrics (hypertrophy SMD −0.06 while perceived effort rises SMD +1.72 — a pure fatigue tax), periodisation model (d = −0.02 for linear vs undulating), machines vs free weights (SMD −0.055, p=0.751 — his machine-heavy programme costs him nothing), planned deloads (zero positive RCTs; the only trained-subject trial found a 3.6 kg squat 1RM decrement and reduced motivation), and lengthened partials (a 297-person multi-site trial found them practically equivalent to full range; trained-subject Bayes factors of 0.16–0.30 are moderate evidence FOR the null, and there are no range-of-motion studies at all in pecs, delts or lats). What DOES matter and is 5–15× larger: exercise selection for biarticular muscles, where the joint you are not training sets the muscle's length — standing vs seated calf raise d = 0.88–1.58, overhead vs pushdown triceps d = 0.54–0.61, seated vs lying ham curl. "Defend load on a cut" is folklore — the only trial that manipulated load under energy restriction (Carlson 2022, n=115 trained, 80% vs 60% 1RM both to failure) found no difference in fat or lean mass, so defend EFFORT and ${DEFICIT_CEILING.line()} instead; sodium, carbs and creatine move water, not fat; caffeine helps training but taken late steals sleep; DIET BREAKS (a full week at maintenance) have replicated adherence benefits and no metabolic ones in trained people; weekly REFEED DAYS have neither — the only matched-energy RCT was overturned on reanalysis and no isocaloric carbohydrate study has ever improved strength or hypertrophy, so never claim a refeed buys fat loss, lean retention, metabolism or next-day performance; adherence is the biggest lever; metabolic adaptation is real but small. A single set of reps carries his own measured set-to-set spread (the live figure in the canon — REPEATABILITY, not accuracy: pooled RIR reports run about 0.95 reps biased toward underprediction), so treat a one-rep change as weather, not signal. Answer only from the knowledge below plus that science. Never invent data, and when the evidence is absent say so — "nobody has tested this" is a better answer than a confident mechanism.\n\n${laws}\n\n${dict}\n\n=== CURRENT INSTRUMENT VERDICTS (the lab) ===\n${dossierText(s)}${analysisSec}${suggSec}${briefSec}${caselawSec}\n\n=== LAST 14 DAYS ===\n${days}\n\n=== LAST 14 NIGHTS ===\n${nights2}\n\n=== MORNING SIGNALS (last 7) ===\n${[...Array(7)].map((_, i8) => { const d8 = isoOf(new Date(clock.nowMs() - (6 - i8) * 864e5)); const en = (s.energy || []).find((x) => x.d === d8); const so = (s.soreness || []).find((x) => x.d === d8); const gp = (s.grip || []).find((x) => x.d === d8); if (!en && !so && !gp) return null; return `${d8}: energy ${en ? en.v : "—"} · sore ${so ? (so.mgs.length ? so.mgs.join("/") : "none") : "—"} · grip ${gp ? `${gp.l ?? "—"}/${gp.r ?? "—"}` : "—"}`; }).filter(Boolean).join("\\n") || "none yet"}\n\n=== MEDS (last 7 logged) ===\n${(s.medsLog || []).slice(-7).map((m8) => `${m8.d}: ${m8.taken ? "taken @ " + m8.at : "none"}`).join("\\n") || "none logged"}\n\n=== CAFFEINE (last 7 logged) ===\n${(s.caffLog || []).slice(-7).map((c8) => `${c8.d}: ${c8.mg === 0 ? "none" : c8.mg + " mg @ " + c8.at}`).join("\\n") || "none logged"}\n\n=== LAST 6 SESSIONS ===\n${sess2}\n\n=== NEXT-SESSION CALLS (deterministic prescription desk) ===\n${(s.exercises || []).filter((e) => exActive(s, e.id) && (e.last || e.std)).slice(0, 12).map((e) => { const lc = liftCall(s, e.id); return `${e.n}: ${lc.verdict}${lc.vel != null ? ` (velocity ${lc.vel >= 0 ? "+" : ""}${lc.vel}/session)` : ""} — ${lc.why}`; }).join("\n")}`;
}

// Copied from frozen src/app.jsx @ fe516c1:12793-12809.
const CONSTITUTION = [
  ["Attention lives on NOW", "If something deserves your eyes, it comes to the front page when it does — never buried in a tab."],
  ["Simple surface, real depth", "Every card reads in one glance; every card opens into its receipts. Plain words are enforced by tests."],
  ["Many sources, one door", "Every change the machine wants — sets, weights, trials — arrives as an inbox proposal. Your tap decides."],
  ["Facts are live, prose is dawn", "Numbers come from engines reading this second; the analyst's essay is a morning newspaper and says so."],
  ["Done-ness is derived", "The ledger decides what's complete — never a screen's memory. In-progress work is a draft that survives."],
  ["Smallest honest increment", "Weight moves by the machine's real smallest step; new sets and loads expect to keep almost every rep."],
  ["One terminal failure set", "Each exercise ends in exactly one all-out set. The RIR you give that set GATES the next jump — 0 blocks the earn, ≥2 can propose an early or bigger one where a machine's rung ladder is on file — and the jump itself is always the machine's own next rung, never an invented numbep. It is the single most valuable number you enter."],
  ["The tilt", "Volume is presumed useful until your own bar speed says otherwise. Adds come easier than trims."],
  ["Records need repeating, not good sleep", "A new best waits for one confirmation — because your own measured set-to-set spread is small, so a +1 record cannot be told apart from a good day. A jump clearly outside that spread banks immediately. This used to depend on a three-night sleep streak; that condition had no evidence behind it and, at 7.5 h against your 7 h median, it never once opened."],
  ["Short sleep protects, it does not punish", "A short night is logged and it counts — for reps, for records, for every trend. What the flag buys you is that the day cannot be read as a stall, so you are never deloaded for a bad night. Sleep still matters most where it is actually measured: in a deficit, short sleep shifts what you lose toward lean mass."],
  ["Every target is derived, none authored", "Calories come from your measured maintenance, protein from your measured lean mass, steps from the window that measured that maintenance. A number the app cannot derive from your record is a number it should not be showing you as if it could."],
  ["Cite or say you cannot", "Every rule here names the evidence it rests on, and says plainly when there is none. Three of this app's rules were retired for having nothing behind them; that is the mechanism working, not failing."],
  ["The athlete overrides", "Every number is yours to change on the floor. The machine rebases instantly and files your ruling as precedent."],
  ["The morning lives in the Minute", "Any input that belongs to the morning joins the Morning Minute — one guided flow, about sixty seconds, before the day starts pulling. New morning inputs must register a step; the test suite enforces it."],
  ["No decorative fields", "Every field must buy attribution — a clock, a tap, a number that changes what the machine can conclude. Friction that buys nothing is deleted, because friction is what kills tracking systems by week nine."],
];

// Copied from frozen src/app.jsx @ fe516c1:12976-12981.
function filingsFor(dow, dom) {
  const out9 = [];
  if (dow === 1) out9.push("ANALYST DAY — the dossier and your night shift's draft are ready behind the ANALYST button");
  if (dom >= 1 && dom <= 3) out9.push("THE RED CELL files this week — the case against your prep waits in LAB");
  return out9;
}

// Copied from frozen src/app.jsx @ fe516c1:13000-13000.
const MORNING_REGISTRY = ["energy", "soreness", "night", "weight", "brief"];

// Copied from frozen src/app.jsx @ fe516c1:13001-13001.
const MORNING_PARKED = ["pulse", "temp", "grip"];

// Copied from frozen src/app.jsx @ fe516c1:13002-13002.
const MUSCLE_CHIPS = ["quads", "hams", "calves", "chest", "back", "delts", "biceps", "triceps", "forearms", "abs"];

// Copied from frozen src/app.jsx @ fe516c1:13003-13012.
function minuteNeeds(s) {
  const t9 = isoOf(todayStart());
  const y9 = isoOf(new Date(todayStart().getTime() - DAY));
  const out9 = [];
  if (!(s.energy || []).some((x) => x.d === t9)) out9.push("energy");
  if (!(s.soreness || []).some((x) => x.d === t9)) out9.push("soreness");
  if (!s.sleep.nights.some((n) => n.d === y9)) out9.push("night");
  if (!s.reads.some((r) => r.d === t9)) out9.push("weight");
  return out9;
}

// Copied from frozen src/app.jsx @ fe516c1:13013-13028.
function booksToday(s) {
  const t9 = isoOf(todayStart());
  const y9 = isoOf(new Date(todayStart().getTime() - DAY));
  const items = [];
  const dl9 = s.dailyLogs[t9];
  items.push({ k: "numbers", ok: !!(dl9 && dl9.cal != null) });
  items.push({ k: "night", ok: s.sleep.nights.some((n) => n.d === y9) });
  const ty9 = dayType(t9, s);
  if (ty9 === "U" || ty9 === "L") items.push({ k: "session", ok: !!s.sessionLog[t9] });
  if ((s.pulse || []).some((x) => x.d < t9)) items.push({ k: "pulse", ok: (s.pulse || []).some((x) => x.d === t9) });
  if ((s.temp || []).some((x) => x.d < t9)) items.push({ k: "temp", ok: (s.temp || []).some((x) => x.d === t9) });
  if ((s.energy || []).some((x) => x.d < t9)) items.push({ k: "energy", ok: (s.energy || []).some((x) => x.d === t9) });
  if ((s.grip || []).some((x) => x.d < t9)) items.push({ k: "grip", ok: (s.grip || []).some((x) => x.d === t9) });
  if (!blackoutOn(s, t9)) items.push({ k: "scale", ok: s.reads.some((r) => r.d === t9) });
  return { items, complete: items.every((i) => i.ok) };
}

// Copied from frozen src/app.jsx @ fe516c1:13029-13045.
function liveBooks(s) {
  const y = isoOf(new Date(todayStart().getTime() - DAY));
  const est = !!(((s.dayCtx || {})[y] || {}).est);
  const items = [];
  const dl = s.dailyLogs[y];
  items.push({ k: "numbers", ok: !!(dl && dl.cal != null) });
  items.push({ k: "night", ok: s.sleep.nights.some((n) => n.d === y) });
  const t2 = dayType(y, s);
  if (t2 === "U" || t2 === "L") items.push({ k: "session", ok: !!s.sessionLog[y] });
  if ((s.pulse || []).some((x) => x.d < y)) items.push({ k: "pulse", ok: (s.pulse || []).some((x) => x.d === y) });
  if ((s.temp || []).some((x) => x.d < y)) items.push({ k: "temp", ok: (s.temp || []).some((x) => x.d === y) });
  if ((s.energy || []).some((x) => x.d < y)) items.push({ k: "energy", ok: (s.energy || []).some((x) => x.d === y) });
  if ((s.grip || []).some((x) => x.d < y)) items.push({ k: "grip", ok: (s.grip || []).some((x) => x.d === y) });
  if (!blackoutOn(s, y)) items.push({ k: "scale", ok: s.reads.some((r) => r.d === y) });
  const gaps = items.filter((i) => !i.ok);
  return { y, est, items, gaps, complete: gaps.length === 0 };
}

// Copied from frozen src/app.jsx @ fe516c1:13074-13074.
function briefAnswered(s, q) { return (s.feed || []).some((f) => f.t === "ANALYST ANSWER" && (f.how || "").indexOf(q.slice(0, 120) + " →") === 0); }

// Copied from frozen src/app.jsx @ fe516c1:14551-14551.
const nextTrainingISO = (s) => { for (let i = 0; i <= 7; i++) { const d = isoOf(new Date(todayStart().getTime() + i * DAY)); const t = dayType(d, s); if ((t === "U" || t === "L") && !s.sessionLog[d]) return d; } return null; };

// Copied from frozen src/app.jsx @ fe516c1:14836-14842.
function stepValue(v, step, dir, min) {
  const floor = typeof min === "number" && isFinite(min) ? min : 0;
  const parsed = typeof v === "number" ? v : parseFloat(v);
  const base = isFinite(parsed) ? parsed : floor;
  const next = +((dir < 0 ? base - step : base + step).toFixed(1));
  return dir < 0 ? Math.max(floor, next) : next;
}

// Copied from frozen src/app.jsx @ fe516c1:15180-15180.
const UI_KEY = "prep-ledger-ui";

// Copied from frozen src/app.jsx @ fe516c1:15186-15186.
function applyDisc(ui, key, val) { const u = ui && typeof ui === "object" ? ui : {}; return { ...u, v: 1, disc: { ...(u.disc || {}), [key]: !!val } }; }

// Copied from frozen src/app.jsx @ fe516c1:15187-15190.
function readDisc(ui, key, computeDefault) {
  if (ui && ui.disc && key in ui.disc) return !!ui.disc[key];
  return typeof computeDefault === "function" ? !!computeDefault() : !!computeDefault;
}

// Copied from frozen src/app.jsx @ fe516c1:19546-19546.
const COMPOUND_IDS = ["press", "row", "hack", "rdl", "pull", "bench", "dip", "squat"];

// Copied from frozen src/app.jsx @ fe516c1:19568-19568.
const REST_BASE = { compound: 150, isolation: 90 };

// Copied from frozen src/app.jsx @ fe516c1:19569-19569.
const REST_TERMINAL_BUMP = 30;

// Copied from frozen src/app.jsx @ fe516c1:19595-19599.
function restFor(exId, nextSetIdx, nSets) {
  const base = COMPOUND_IDS.some((c) => String(exId).indexOf(c) === 0) ? REST_BASE.compound : REST_BASE.isolation;
  const isBeforeTerminal = nSets != null && nextSetIdx != null && nSets >= 2 && nextSetIdx === nSets - 1;
  return isBeforeTerminal ? base + REST_TERMINAL_BUMP : base;
}

// Copied from frozen src/app.jsx @ fe516c1:19601-19605.
function restLine(exId, nSets) {
  const base = restFor(exId);
  if (!nSets || nSets < 2) return `${base}s between sets`;
  return `${base}s between sets · ${base + REST_TERMINAL_BUMP}s before the last one`;
}

// Copied from frozen src/app.jsx @ fe516c1:19655-19693.
function mergeSessionDrafts(sessEx, trainDraft, gymDraft, opts) {
  const final = !!(opts && opts.final);   // infer skips ONLY at completion — see below
  const list = sessEx || [];
  const t = trainDraft || {}, g = gymDraft || null;
  const out = {
    reps: { ...(t.reps || {}) }, rir: { ...(t.rir || {}) },
    rirEnd: { ...(t.rirEnd || {}) }, skipped: { ...(t.skipped || {}) },
  };
  if (!g) return out;
  const gReps = g.reps || {}, gRir = g.rir || {}, gRirEnd = g.rirEnd || {}, gSkip = g.gskip || {};
  const reached = typeof g.idx === "number" ? g.idx : -1;
  list.forEach((ex, i) => {
    if (gReps[ex.id] != null) out.reps[ex.id] = gReps[ex.id];
    if (gRir[ex.id] != null) out.rir[ex.id] = gRir[ex.id];
    if (gRirEnd[ex.id] != null) out.rirEnd[ex.id] = gRirEnd[ex.id];
    if (gSkip[ex.id]) out.skipped[ex.id] = true;
    // never reached in the gym, and nothing typed on TRAIN -> not performed
    /* PHANTOM_SKIP — this used to run unconditionally, and g.idx is the lift Gym Mode is
       CURRENTLY ON. So every lift after the one he was standing at was marked skipped while
       the session was still in progress: open Gym Mode, do three lifts, glance at TRAIN, and
       lifts 4-9 read skipped. Joe hit this in the gym on v7.7.0.

       The reasoning was right for the problem it solved — not reaching a lift is evidence it
       was not performed, and target reps are not — but it conflated two states:
         not performed      — a real miss, belongs in skipped[], must be shown honestly;
         not performed YET  — an open session, belongs in neither.

       It was not cosmetic. skipped feeds skippedList at Complete session, so finishing from
       TRAIN mid-session wrote those lifts into sessionLog[date].skipped as misses he never
       made — the phantom-rep bug's mirror image, corroding "show misses" from the other
       side by showing misses that never occurred.

       The inference now belongs to the FINISH path only, where "the session ended and this
       lift has no reps" genuinely does mean not performed. While a draft is live, an
       unreached lift is simply untouched. */
    if (final && i > reached && gReps[ex.id] == null && (t.reps || {})[ex.id] == null) out.skipped[ex.id] = true;
  });
  return out;
}

// Copied from frozen src/app.jsx @ fe516c1:19715-19715.
function phaseAfterSet(setN, nSets) { return setN + 1 >= nSets ? "rir-end" : setN === 0 ? "rir-open" : "rest"; }

// Copied from frozen src/app.jsx @ fe516c1:19725-19733.
function backLift(idx, gskip, sessEx) {
  const list = sessEx || [];
  if (!(idx > 0)) return { idx: idx > 0 ? idx : 0, gskip: gskip || {}, moved: false };
  const to = idx - 1;
  const next = { ...(gskip || {}) };
  const ex = list[to];
  if (ex && ex.id) delete next[ex.id];
  return { idx: to, gskip: next, moved: true };
}

// Copied from frozen src/app.jsx @ fe516c1:19735-19760.
function gymEntries(sessEx, st) {
  const o = st || {};
  const reps = o.reps || {}, rir = o.rir || {}, rirEnd = o.rirEnd || {}, gskip = o.gskip || {};
  const list = sessEx || [];
  const getR = (e2) => reps[e2.id] ?? e2.tgt.slice();

  /* TOUCHED — see TOUCH_NOTE. `touched` is POSITIVE ACTION, recorded as it happens; it is
     never inferred from the reps, because getR falls back to the TARGET, so "has reps" is
     true of every lift in the session and comparing reps to tgt would read hitting the
     target exactly — the common case — as untouched.

     An older draft carries no `touched` map at all. In that case we genuinely do not know,
     so the rule falls back to gskip alone rather than guessing: unknown is not evidence. */
  const touched = o.touched && typeof o.touched === "object" ? o.touched : null;
  const skipOf = (e2) => {
    const flagged = !!gskip[e2.id];
    if (!touched) return flagged;                       // pre-touched draft: gskip decides, as before
    if (touched[e2.id]) return false;                   // TOUCHED + flagged -> impossible; evidence wins
    return true;                                        // untouched: a real skip, flagged or not
  };

  return {
    entries: list.filter((e2) => !skipOf(e2)).map((e2) => ({ id: e2.id, n: e2.n, w: e2.w, tgt: e2.tgt, reps: getR(e2), isDebutNow: e2.isDebutNow, rir: rir[e2.id] ?? null, rirEnd: rirEnd[e2.id] ?? null })),
    skipped: list.filter((e2) => skipOf(e2)).map((e2) => ({ id: e2.id })),
  };
}

// Copied from frozen src/app.jsx @ fe516c1:19767-19767.
const REST_CUT_S = 60;

// Copied from frozen src/app.jsx @ fe516c1:19768-19768.
function restCut(startMs, nowMs) { return Math.floor(((nowMs || 0) - (startMs || 0)) / 1000) < REST_CUT_S; }

// Copied from frozen src/app.jsx @ fe516c1:19775-19785.
function effortWords(plan, held) {
  if (held) return "governor hold — every set stays 2 in the tank until an honest opener releases the load";
  const p = Array.isArray(plan) ? plan : [];
  if (!p.length) return "";
  if (p.length === 1) return p[0] === 0 ? "one set — empty it" : "one set — leave " + p[0] + " in the tank";
  const seg = (r, i) => (i === p.length - 1 && r === 0) ? "last set, empty it" : r === 0 ? "empty it" : r + " in the tank";
  const parts = p.map((r, i) => (i === 0 ? "leave " + seg(r, i) : seg(r, i)));
  const out = [];
  for (const w of parts) { const L = out[out.length - 1]; if (L && L.txt === w) L.n++; else out.push({ txt: w, n: 1 }); }
  return out.map((x) => x.txt + (x.n > 1 ? " (×" + x.n + ")" : "")).join(" → ");
}

// Copied from frozen src/app.jsx @ fe516c1:19848-19867.
function resumePhase(draft, nowMs) {
  const d = draft || {};
  const ph = d.phase || "lift";
  const elapsed = d.restStart ? Math.floor((nowMs - d.restStart) / 1000) : null;
  const len = d.restLen || 0;
  if (ph === "rest") {
    if (elapsed == null || elapsed >= len) return { phase: "lift", autoSkip: false };
    return { phase: "rest", autoSkip: false };
  }
  if (ph === "rir-open") {
    /* stale: the ask outlived the rest it rides in — skip to null, and the rest is over too */
    if (elapsed != null && elapsed > len) return { phase: "lift", autoSkip: true };
    return { phase: "rir-open", autoSkip: false };
  }
  if (ph === "rir-end") {
    if (elapsed != null && elapsed > len) return { phase: "lift-done", autoSkip: true };
    return { phase: "rir-end", autoSkip: false };
  }
  return { phase: ph, autoSkip: false };
}

// Copied from frozen src/app.jsx @ fe516c1:21012-21044.
function writeDaily(s, iso, v) {
  /* R15j r2 — THE MERGE IS THE BELT. This takes a PARTIAL: any field the caller does
     not name survives untouched. The capture sheet destroyed a logged day by writing
     its own stale snapshot back over it (rig-driven: log 2279/175/15000 on BRIEF, tap
     the sodium chip, watch cal/pro/steps become null). A writer that must be handed
     the whole row to avoid erasing it is a data-loss machine waiting for a second
     door — and the sheet was that second door. Full-row callers pass every key and
     keep their old overwrite semantics exactly, blanks included. */
  const ns = { ...s };
  const num = (x) => (x === "" || x == null ? null : Number(x));
  const has = (k) => v && Object.prototype.hasOwnProperty.call(v, k);
  const prev = (ns.dailyLogs || {})[iso] || {};
  const row = { ...prev };
  if (has("cal")) row.cal = num(v.cal);
  if (has("pro")) row.pro = num(v.pro);
  if (has("steps")) row.steps = num(v.steps);   /* his walking step COUNT — not a lift field — unstamped by design */
  if (has("sodium")) row.sodium = v.sodium || null;
  if (has("alc")) row.alc = +v.alc || 0;
  ns.dailyLogs = { ...ns.dailyLogs, [iso]: row };
  const p = has("pro") ? num(v.pro) : null;
  /* OWED LEDGER guard — the fix window is LIVE coaching: a backfilled day older than
     yesterday must not open (or close) a 24-hour recovery window that already passed. */
  const yFix = isoOf(new Date(todayStart().getTime() - DAY));
  if (p != null && iso >= yFix) {
    const hit = proteinHit(proteinTarget(s).lo, p);
    if (!hit && !ns.fixWindow) ns.fixWindow = { opened: iso };
    if (hit && ns.fixWindow && ns.fixWindow.opened !== iso) {
      ns.fixWindow = null;
      ns.feed = [{ d: iso, t: "PROTEIN RECOVERY", how: "miss fixed inside 24 h — the standard extends, it does not reset" }, ...ns.feed];
    }
  }
  return ns;
}

// Copied from frozen src/app.jsx @ fe516c1:21045-21060.
function captureAsk(s, hour) {
  const tISO = isoOf(todayStart());
  const yISO = isoOf(new Date(todayStart().getTime() - DAY));
  const rw = readWindow(s, hour);
  const dl = (s.dailyLogs || {})[tISO] || {};
  const yl = (s.dailyLogs || {})[yISO];
  /* the ledger is the one owner; this ladder is a VIEW of it plus the two conditions
     that are about the ASK's wording, not the debt (reads-exist, the evening hour) */
  const led = owedLedger(s, hour);
  if (led.some((r) => r.k === "scale")) return { k: "scale", t: "THIS MORNING'S SCALE", why: "Daily weight updates the trend — one tap, then the trend absorbs it" };
  if (led.some((r) => r.k === "day" && r.d === yISO) && !yl && (s.reads || []).some((r) => r && r.d < tISO)) return { k: "amend", t: "YESTERDAY'S BOOKS ARE STILL OPEN", why: "close " + fmtShort(yISO) + " — an unlogged day is a hole in every average below" };
  if (dl.cal == null && rw.hour >= 17) return { k: "day", t: "CLOSE THE DAY", why: "calories, protein, steps — the three the targets are measured against" };
  if (!rw.hasRead) return { k: "scale", t: "THE SCALE, WHEN YOU GET TO IT", why: "off-window reads are kept and set aside — logged honestly, never fed to the trend" };
  if (dl.cal == null) return { k: "day", t: "CLOSE THE DAY", why: "calories, protein, steps — the three the targets are measured against" };
  return { k: "none", t: "NOTHING IS DUE", why: "the scale and the day are both logged. Anything below is optional — and optional means optional." };
}

// Copied from frozen src/app.jsx @ fe516c1:21073-21097.
function expDigest(s) {
  const rows = [];
  try {
    const at = activeTrial(s);
    if (at && at.arm && at.arm.tpl) {
      const tpl = at.arm.tpl;
      let v = null; try { v = trialVerdict(s, at.tr); } catch (e) { v = null; }
      rows.push({ kind: "trial", q: tpl.q || tpl.t, arm: (tpl.arms || [])[at.arm.armIdx], n: at.arm.block, need: at.arm.of, label: "blocks",
        settle: v && v.endISO ? (v.done ? "done — the verdict is ready on the trials desk" : "runs to " + fmtShort(v.endISO) + " — its own design settles it") : null });
    }
  } catch (e) {}
  try {
    const rg = regime(s);
    if (rg && rg.pending) rows.push({ kind: "regime", q: "has the cut left " + String(rg.key).toUpperCase() + " for " + String(rg.pending).toUpperCase() + "?", n: 1, need: 2, label: "readings",
      settle: "a second " + String(rg.pending).toUpperCase() + " reading on or after " + fmtShort(isoOf(new Date(mk(rg.pendingSince).getTime() + REGIME_HOLD_D * DAY))) });
  } catch (e) {}
  try {
    const secs = labSections(s);
    const gath = (secs.find((x) => x.k === "gathering") || { cards: [] }).cards;
    const prov = (secs.find((x) => x.k === "provisional") || { cards: [] }).cards;
    gath.forEach((c) => { if (c && c.prog && c.prog.need) { const rem = Math.max(0, c.prog.need - c.prog.n); rows.push({ kind: "gathering", q: c.tag || c.t, n: c.prog.n, need: c.prog.need, label: c.prog.label, settle: rem === 1 ? "one more and it reads" : rem + " more " + (c.prog.label || "observations") + " and it reads" }); } });   /* q: the card's own plain question (tag), title fallback — both engine words (Joe's word, round 2) */
    prov.forEach((c) => { if (c && c.prog && c.prog.need) { const rem = Math.max(0, c.prog.need - c.prog.n); rows.push({ kind: "provisional", q: c.tag || c.t, n: c.prog.n, need: c.prog.need, label: c.prog.label, settle: rem === 1 ? "one more to a verdict it can stand behind" : rem + " more " + (c.prog.label || "observations") + " to a verdict it can stand behind" }); } });
  } catch (e) {}
  return { head: rows[0] || null, rows };
}

// Copied from frozen src/app.jsx @ fe516c1:21827-21851.
function rulebook(s) {
  const pt = proteinTarget(s), fl = calorieFloor(s), ct = energyBalanceTarget(s);
  const te = typicalError(s, null), bw = s.trend || 1;
  const pct = (lb) => ((lb / bw) * 100).toFixed(2);
  const acsmLb = +(0.01 * bw).toFixed(1);
  return [
    ["ADAPTIVE", "Session targets, earned loads, and the queue update themselves from what you log. Calorie & phase changes arm themselves from trend data but take one tap — nothing macro moves invisibly."],
    ["RATE", `IF under ${cutRateBand(s).floor}/wk two weeks → restore steps first, THEN trim — steps because adding them does not deepen the food deficit, and deficit size is the variable the trained-population evidence links to lean-mass loss. IF at or over ${cutRateBand(s).redline} → redline, add back, analyst flag. Both numbers are now expressed as a % of bodyweight rather than as pounds: the floor is ${cutRateBand(s).floorPct}%/wk and the redline ${cutRateBand(s).redlinePct}%/wk, which at ${bw} lb work out to ${cutRateBand(s).floor} and ${cutRateBand(s).redline} lb. They move with you, so the redline stays the same fraction of you as you lean out instead of quietly getting more permissive.`],
    ["STRUCTURE", "One structural change per session — auto-picked from the queue. Rep progression unlimited."],
    ["OWNERSHIP", `A new best waits for ONE repeat before it becomes the standard, and a session that clears the old line by two standard errors banks on the spot. The bar is your own measured spread — ±${te.reps} reps per set, from ${te.n} paired sets at identical load. Sleep is not part of this: measurement error does not care how you slept, and it applies to every record rather than a sleep-selected minority.`],
    ["OPENERS", "The taper asks for a 2-RIR opener and one terminal set to failure. Two openers ground out at RIR 0 and the load holds until an honest one lands — a grind is not an earn."],
    ["SIGNALS", "Last-set RIR gates the next jump — 0 blocks it, ≥2 can propose an early or two-rung debut on laddered machines; the opener only feeds the hold governor. Joint flags three times in three weeks surface on NOW as a pattern rather than a day. Waist is still an unlogged input — until entries exist, it changes nothing and the app will not pretend otherwise."],
    ["SCALE", "Fasted · post-void · pre-food. Once a day. Sealed windows excluded. Trend is the hero — a single reading carries several pounds of water and means nothing on its own."],
    ["EVENTS", "Estimate once, after, never at the table. Compensation does not exist in this app."],
    ["PROTEIN", `${pt.g} g today — ${pt.perKg} g per kg of your current measured ${pt.ffmKg} kg lean mass, with ${pt.gLo}–${pt.gHi} g the honest span across the estimate\u2019s own spread. It is not a constant — always a dynamic evidence-based target: it moves when the estimate moves, in either direction, never a pinned constant. Protein is a FLOOR: over it is not a miss, and eating above it is preference. It does not rise on training days: the only study that compared day types found requirement HIGHER on rest days. A miss fixed inside 24 h extends the standard.`],
    ["SLEEP", `A night under ${DEBT_LAST_H} h, or a three-night mean under ${DEBT_MEAN3_H}, flags the session. What that flag buys you is protection — the day cannot count toward a stall, so you are never deloaded for a bad night. It does NOT block a record or shrink the step; that rule was retired because acute sleep loss costs about 2.85% on strength — a real cost (CI 1.23–4.47), just smaller than your own spread — and no trial has ever tested damping progression on low-readiness days. Your ${s.sleep.cleanH} h target is a separate question and still stands — in a deficit, short sleep shifts what you lose toward lean mass.`],
    /* R2b — the band now carries WHY it is what it is, generated from regime() rather than
       written beside it (see the standing copy rule). provisional must read differently from
       decided, or it is the same defect as a proposal whose apply.kind is note. */
    ["FOOD", `${ct.provisional && !ct.gated ? `PROVISIONAL — ${ct.regimeWhy || "the engine is holding, not deciding"}. ` : ""}${ct.gated ? "Calories fall back to the phase band until there are enough clean days to measure your own maintenance." : `${ct.lo}–${ct.hi}, from your measured maintenance minus the deficit your own rate band asks for.`} The floor is ${fl.floor} — ${EA_SPARING} kcal per kg of lean mass plus what training costs, not a round number. No position stand anywhere states an absolute calorie floor for an athlete; every one of them indexes to lean mass.`],
    ["AUTHORITY", "Machine swaps, ladder graduations, the pivot call — the analyst's call. The app proposes; humans authorize."],
    ["ATTENTION", "From wk 10: mirror & measurements outrank the scale. The app rewards logged behavior, never checking."],
    ["EVIDENCE", "Every rule above names what it rests on, and says so when it rests on nothing. Rules retired for having no evidence behind them: the clean-sleep gate on records, the weekly refeed's benefits, and defending load rather than effort on a cut. That is the mechanism working."],
  ];
}

return { DT_PALETTE, DT, sweepLadders, sessionFromDraft, takeProposedDebut, completeSession, applyRead, proteinTargetForRegime, bhFDR, sleepSpanH, parseHM, todayCaff, caffAt, fadeRead, sessionDebrief, debriefWords, rirPlan, weekReview, closeEvent, refeedBumps, theOneThing, weekDigest, debtLedger, INS_MAP, dossierData, dossierText, trialArmOn, activeTrial, dayProtocol, PLAIN_MAP, plainify, labDocket, STATUS_RANK, labSections, labStatusList, SELECTION_AUDIT, exerciseSelection, _weeklyFreq, volumePush, sweepVolume, sweepStalls, isLabFeedLine, diaryFeed, sweepLab, runAdaptive, _stampPlan, applyProposal, applySuggestion, noteSuggestion, dismissSuggestion, applyAgentProposal, dismissAgentProposal, dismissProposal, undoAdjustment, undoRead, GLOSSARY, LEDGER_DICT, kitLetter, askContext, CONSTITUTION, filingsFor, MORNING_REGISTRY, MORNING_PARKED, MUSCLE_CHIPS, minuteNeeds, booksToday, liveBooks, briefAnswered, nextTrainingISO, stepValue, UI_KEY, applyDisc, readDisc, COMPOUND_IDS, REST_BASE, REST_TERMINAL_BUMP, restFor, restLine, mergeSessionDrafts, phaseAfterSet, backLift, gymEntries, REST_CUT_S, restCut, effortWords, resumePhase, writeDaily, captureAsk, expDigest, rulebook, proteinTargetFn: E.proteinTarget };
};
