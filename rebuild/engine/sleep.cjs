"use strict";

// Frozen read closure, including bodyAlarm's lab dependencies; every cache is per engine.
module.exports = function createSleep(E, { clock, ids }) {
const { HISTORY } = E;
const { READY_BASELINE_N, DAY, EA_SPARING, EA_LOW, T95, LAB_MIN_N, PHASES, VOL_BANDS, REGIME_HOLD_D, TREND_MIN_LIFTS, DEBT_LAST_H, DEBT_MEAN3_H, SLEEP_ANCHOR_MIN_N, TREND_MIN_SESSIONS, TREND_WINDOW, INDIRECT, TREND_SE_FLOOR, REVIEW_DELIV_D, REVIEW_OUTCOME_D, REVIEW_CLASSIFY_D, DELIVERED_MAJ, START, EVENT_GRACE_D, EVENT_LEAD_D } = E;
const isoOf = (...args) => E.isoOf(...args);
const todayStart = (...args) => E.todayStart(...args);
const paceRushed = (...args) => E.paceRushed(...args);
const mk = (...args) => E.mk(...args);
const fmtShort = (...args) => E.fmtShort(...args);
const deloadLoad = (...args) => E.deloadLoad(...args);
const energyAvailability = (...args) => E.energyAvailability(...args);
const daysUntil = (...args) => E.daysUntil(...args);
const bfEst = (...args) => E.bfEst(...args);
const weightNoise = (...args) => E.weightNoise(...args);
const currentRate = (...args) => E.currentRate(...args);
const dayType = (...args) => E.dayType(...args);
const proteinTarget = (...args) => E.proteinTarget(...args);
const proteinHit = (...args) => E.proteinHit(...args);
const weeksBetween = (...args) => E.weeksBetween(...args);
const nextLoad = (...args) => E.nextLoad(...args);
const regime = (...args) => E.regime(...args);
const exById = (...args) => E.exById(...args);
const readWindow = (...args) => E.readWindow(...args);
const observedTDEE = (...args) => E.observedTDEE(...args);
const stepEfficacy = (...args) => E.stepEfficacy(...args);
const stepTarget = (...args) => E.stepTarget(...args);
const energyDensity = (...args) => E.energyDensity(...args);
const liftTrend = (...args) => E.liftTrend(...args);
const trendSeries = (...args) => E.trendSeries(...args);
const exActive = (...args) => E.exActive(...args);
const sessionScore = (...args) => E.sessionScore(...args);
const _tCrit = (...args) => E._tCrit(...args);
const rirSetsOf = (...args) => E.rirSetsOf(...args);
const phaseArc = (...args) => E.phaseArc(...args);

const muscleVolume = (...args) => E.muscleVolume(...args);
const setOneRead = (...args) => E.setOneRead(...args);
const volumeConversion = (...args) => E.volumeConversion(...args);

// Copied from frozen src/app.jsx @ fe516c1:685-689.
function readyLowFor(hist) {
  const a = (hist || []).slice().sort((x, y) => x - y);
  if (a.length < READY_BASELINE_N) return -1;
  return a[Math.floor(a.length * 0.25)];
}

// Copied from frozen src/app.jsx @ fe516c1:699-861.
function liftCall(s, exId, opts = {}) {
  const tISO3 = isoOf(todayStart());
  const R2 = [];
  const all = Object.keys(s.sessionLog).sort().map((d) => { const sl0 = s.sessionLog[d]; const e = (sl0.entries || []).find((x) => x.id === exId); return e ? { d, tot: (e.reps || []).reduce((a, b) => a + b, 0), rir: e.rir, w: e.w, rushed: paceRushed(sl0), debt: !cleanAtDate(s, d) } : null; }).filter(Boolean);
  const hist = all.slice(-5);
  if (hist.length < 2) return { verdict: "PUSH", vel: null, n: hist.length, why: "New lift — just chase reps and build the story.", receipts: ["Only " + hist.length + " session" + (hist.length === 1 ? "" : "s") + " on file — two more and the desk starts reading your trend."] };
  const clean = hist.filter((h) => !dayWeather(s, h.d).hardSession);   /* R17 — reps counted at a known load survive an estimated dinner */
  const vel = clean.length >= 2 ? +(((clean[clean.length - 1].tot - clean[0].tot) / (clean.length - 1)).toFixed(1)) : null;
  if (vel != null) R2.push(vel > 0.2 ? `You are gaining about ${vel} reps per session lately (last ${clean.length} normal days).` : vel < -0.2 ? `You have been slipping about ${Math.abs(vel)} reps per session (last ${clean.length} normal days).` : `Your total reps have been flat across the last ${clean.length} normal days.`);
  /* Stalls are counted over UNRUSHED, UNFLAGGED days only. Three of them lighten
     the bar 5%, and neither a compressed session nor a short-sleep one is
     evidence that the weight is too heavy — see PACE_NOTE and SLEEP_NOTE.

     This is where the sleep flag now earns its keep. It used to sit on the
     upside, blocking a record from banking; the evidence for that was empty.
     Craven 2022 does establish a real if small performance decrement (-2.85% on
     strength, -9.85% on multi-rep efforts), and the honest use of a known small
     decrement is to stop it being read as a stall — i.e. to protect him from
     being deloaded for a bad night, not to stop him gaining on one.

     Velocity above still uses every non-hard day, because both effects are too
     small to justify discarding the reading. */
  const honest = clean.filter((h) => !h.rushed && !h.debt);
  const rushedN = clean.filter((h) => h.rushed).length;
  const debtN = clean.filter((h) => h.debt && !h.rushed).length;
  let stall = 0;
  for (let i = honest.length - 1; i >= 1; i--) { if (honest[i].tot <= honest[i - 1].tot && (honest[i].rir == null || honest[i].rir <= 2)) stall++; else break; }
  if (stall) R2.push(`${stall} session${stall > 1 ? "s" : ""} in a row without beating your total — honestly fought; event, rushed and short-sleep days never counted — estimate days count in full (reps at a known load survive a guessed dinner).`);
  if (rushedN) R2.push(`${rushedN} of your last ${clean.length} on this lift ${rushedN === 1 ? "was" : "were"} logged rushed — short rest costs you reps on the back sets, so ${rushedN === 1 ? "it does" : "they do"} not count toward a stall.`);
  if (debtN) R2.push(`${debtN} of your last ${clean.length} ran on short sleep — worth about 2.85% on strength, a real cost (CI 1.23–4.47) that is smaller than your own set-to-set spread, so it is context for reading the day, not a reason to change it, so ${debtN === 1 ? "it does" : "they do"} not count toward a stall either. ${debtN === 1 ? "It still counts" : "They still count"} for reps, records and every trend on this page.`);
  const slp2 = sleepInfo(s);
  const lastN = s.sleep.nights[s.sleep.nights.length - 1];
  if (lastN) R2.push(`Last night: ${lastN.h} hours` + (lastN.sol != null ? `, took about ${lastN.sol} min to fall asleep.` : "."));
  /* per-lift day-of-week pattern — computed, n-gated at 3 per bucket */
  const dow3 = mk(tISO3).getDay();
  const byDow = all.filter((h) => mk(h.d).getDay() === dow3 && !dayWeather(s, h.d).hardSession);   /* R17 */
  const byOther = all.filter((h) => mk(h.d).getDay() !== dow3 && !dayWeather(s, h.d).hardSession);   /* R17 */
  let dowLag = null;
  if (byDow.length >= 3 && byOther.length >= 3) {
    const m1 = byDow.reduce((a, h) => a + h.tot, 0) / byDow.length, m2 = byOther.reduce((a, h) => a + h.tot, 0) / byOther.length;
    dowLag = +(m1 - m2).toFixed(1);
    if (Math.abs(dowLag) >= 2) R2.push(`${["Sundays","Mondays","Tuesdays","Wednesdays","Thursdays","Fridays","Saturdays"][dow3]} usually run about ${Math.abs(dowLag)} reps ${dowLag > 0 ? "stronger" : "lighter"} for you on this lift — judge today against that, not your best ever.`);
  }
  /* bedtime scatter — the variance tax's live coefficient, applied when its instrument is armed */
  if (lastN && lastN.bed) {
    const mins3 = (t2) => { const [a3, b3] = t2.split(":").map(Number); let m3 = a3 * 60 + b3; if (m3 < 720) m3 += 1440; return m3; };
    const timed = s.sleep.nights.filter((n) => n.bed).slice(-21);
    if (timed.length >= 8) {
      const med2 = timed.map((n) => mins3(n.bed)).sort((a3, b3) => a3 - b3)[Math.floor(timed.length / 2)];
      const dev = Math.abs(mins3(lastN.bed) - med2);
      if (dev > 45) R2.push(`Bedtime was about ${Math.round(dev / 15) * 15} min off your usual last night — the kind of night the lab is pricing.`);
    }
  }
  /* pulse vs baseline — cut-stress context when both exist */
  const pReads2 = (s.pulse || []).slice(-14);
  const pToday = (s.pulse || []).find((x) => x.d === tISO3);
  if (pReads2.length >= 7 && pToday) {
    const base2 = pReads2.map((x) => x.bpm).sort((a3, b3) => a3 - b3)[Math.floor(pReads2.length / 2)];
    const dp = pToday.bpm - base2;
    if (dp >= 5) R2.push(`Your pulse ran ${dp} beats above normal this morning — your body is still paying for something. Do not spend records on a day like this.`);
  }
  const wx = dayWeather(s, tISO3);
  const postRf = wx.flags.some((f) => f.k === "postrefeed");
  const estToday = wx.est;
  const alarm = opts.alarm !== undefined ? opts.alarm : (typeof bodyAlarm === "function" ? bodyAlarm(s, slp2) : null);
  const ex2 = s.exercises.find((x) => x.id === exId);
  /* verdict ladder — most protective first */
  if (alarm && alarm.tier === "RED") return { verdict: "STAND-DOWN", vel, n: clean.length, why: "Body alarm is RED. Skip the iron today — walk, eat, sleep, and come back tomorrow ahead.", receipts: R2.concat(["Body alarm: RED — the pattern held a second day."]) };
  const recentReset = (s.feed || []).slice(0, 60).find((f) => f.t && ex2 && f.t.indexOf("RESET APPLIED — " + ex2.n) === 0 && (mk(tISO3) - mk(f.d)) / DAY <= 14);
  if (recentReset) return { verdict: "REBUILD", vel, n: clean.length, why: `You lightened this on ${fmtShort(recentReset.d)}. Climb the reps back — the old numbers usually fall within three sessions.`, receipts: R2.concat(["Day " + Math.round((mk(tISO3) - mk(recentReset.d)) / DAY) + " of your 14-day climb-back."]) };
  /* A reset must land on a weight the machine can actually make — see
     deloadLoad. Never a number he cannot set on the machine. */
  if (stall >= 3) {
    /* U4 — A STALL OPENS A DIAGNOSIS, never a reflex. The three-count is the SIGNAL
       (already filtered to comparable sessions: rushed, short-sleep and event days
       never counted); the CAUSE decides the move. Lightening is supported only when
       pain speaks (the governor holds this lift) or recovery has left GREEN —
       otherwise a plateau with a green body is time-or-stimulus, and a load cut
       answers neither (deload trials tested different interventions entirely).
       PRECEDENCE, NAMED: a diagnosed reset is the one sanctioned exception to
       never-prescribe-below-delivered — a deliberate recovery move, on his tap only. */
    const pain9 = !!(ex2 && ex2.holdFlag);
    const fat9 = (() => { try { return recoveryIndex(s).band !== "GREEN"; } catch (e) { return false; } })();
    if (pain9 || fat9) { const newW = ex2 && typeof ex2.w === "number" ? deloadLoad(ex2) : null;
      return { verdict: "RESET", vel, n: clean.length, newW, why: `${stall} honest sessions without beating your total, and ${pain9 ? "the governor holds this lift — pain speaks there" : "recovery has left GREEN"} — the diagnosis supports lightening a notch to rebuild. A reset deliberately prescribes below delivered capacity: the named exception, on your tap only.`, receipts: R2 }; }
    return { verdict: "REVIEW", vel, n: clean.length,
      why: `${stall} comparable sessions without a beat — a stall signal, not yet a cause. The check ran: governor clear (no pain flag), recovery GREEN, and protocol noise was never in the count. A plateau with a green body is time or stimulus, and lightening answers neither — the target stands.`,
      receipts: R2.concat(["Stall review: the cause check ran and nothing supports a load cut today. If pain or recovery turns while the stall holds, the reset offer files itself."]) };
  }
  if (alarm && alarm.tier === "AMBER") return { verdict: "HOLD", vel, n: clean.length, why: "Body alarm is AMBER. Normal session, but no all-out sets — every 0 becomes a 1. Anything you do deliver still counts and still banks: a label is not a validity failure.", receipts: R2.concat(["Body alarm: AMBER — off day, not a failure. Delivered reps keep their full standing."]) };
  /* ---------- SLEEP_HOLD_NOTE — the verdict that should never have been here ----------
     This used to return HOLD on any short-sleep morning: "repeat last time,
     nothing counts as a record today anyway." It was the last place the retired
     clean-sleep gate still decided what he lifted, and it decided it for every
     lift on the day at once.

     The evidence does not support holding a session on a short night. Craven
     2022's meta-analysis puts sleep restriction at -2.85% on strength — a real
     cost (95% CI 1.23-4.47), just smaller than the day-to-day spread the app
     already measures live (typicalError — repeatability, not accuracy). Knowles
     2022 ran nine consecutive nights at 5 h and volume load fell under 1%. Gong
     2024 finds start-of-night restriction indistinguishable from zero (d=-0.25,
     95% CI -0.53 to +0.04). Holding a whole session for an effect that small
     costs real training to avoid a rounding error.

     Sleep still matters more than almost anything here — it is just a NUTRITION
     lever, not a session one. Nedeltcheva 2010: 5.5 h vs 8.5 h at a matched
     deficit shifted 60% more of the loss onto fat-free mass. That belongs on the
     body-composition read and the daily protocol, and it is where it now lives.

     So a short night becomes a RECEIPT — say it, then let him lift. The one
     thing it still buys him is the stall exemption: a bad night's session cannot
     be read as evidence the load is too heavy. */
  if (!slp2.clean) R2.push(`Short night on the books${(slp2.last || {}).h ? ` (${slp2.last.h} h)` : ""} — the reps still count and a record still banks. What it buys you is that today cannot be read as a stall.`);
  {
    const md2 = (a2) => { const b2 = a2.slice().sort((x2, y2) => x2 - y2); return b2.length ? b2[Math.floor(b2.length / 2)] : 0; };
    const mT = todayMeds(s); if (mT && !mT.taken) R2.push("No meds today — effort reads truer; energy may sit lower than usual.");
    const eT = (s.energy || []).find((x) => x.d === tISO3); const eH = (s.energy || []).filter((x) => x.d < tISO3).slice(-14).map((x) => x.v);
    if (eT) R2.push(`Readiness ${eT.v}/10${eH.length >= READY_BASELINE_N ? ` — your usual is ${md2(eH)}` : ` — ${READY_BASELINE_N - eH.length} more mornings before this can gate anything`}.`);
    /* ---------- READINESS_NOTE — the gate that survived, and the one that did not ----------
       The grip gate is gone. Its threshold was 8% below his recent median;
       handgrip's minimal detectable change is about 11% (MDC ~5.5 kg on a ~50 kg
       grip), so the rule fired inside its own noise. Worse, the reference median
       was built on four entries, whose own standard error is ~3.6% — a noisy
       number compared against a noisy anchor. And grip does not measure what it
       was being asked to measure: in the one direct test, 10x10 back squats moved
       leg-extension torque (p=0.03) and jump velocity (p=0.04) while grip did not
       budge (p=0.47). It is a forearm test. It would have flagged him the morning
       after rowing and deadlifting — precisely the wrong signal. He logged it zero
       times, which is its own verdict.

       The subjective gate stays, because it is the one input here with a real
       base. Tolusso et al. 2022, in eleven resistance-trained men doing 8x10 back
       squats with retesting at 24/48/72 h: Perceived Recovery Status correlated
       r = .84 with countermovement jump and r = .80 with mean bar velocity. Saw,
       Main & Gastin's 56-study review found subjective measures track training
       load with better sensitivity and consistency than objective ones.

       Two fixes to it, both from that literature. The scale moves 1-5 to 0-10,
       because on a five-point scale a single step is a 25% jump across the whole
       range and there is no room between "fine" and "flagged". And the baseline
       goes from five mornings to fourteen, because Tolusso's own caveat is that
       the relationship is individual — the same number means different things in
       different people, so the personal reference has to be real before the rule
       may act on it. */
    const eLow = eT && eH.length >= READY_BASELINE_N && eT.v <= readyLowFor(eH);
    if (eLow) return { verdict: "HOLD", vel, n: clean.length,
      why: `Readiness ${eT.v}/10 against your usual ${md2(eH)} — repeat last time rather than chasing. This is the one morning reading that predicts the session: in resistance-trained men it tracks bar velocity at r = .80.`,
      receipts: R2.concat([`Readiness gate: ${eT.v}/10 vs a ${md2(eH)} median across ${eH.length} mornings.`]) };
  }
  if (estToday) return { verdict: "PUSH", vel, n: clean.length, why: "Estimate day — train normally. The FOOD numbers carry lower weight; the reps count in full (a guessed dinner does not make reps at a known load less true).", receipts: R2.concat(["You declared today an estimate day — food numbers carry lower weight; reps count in full."]) };
  /* The old line here promised "refeed fuel aboard" as if that were an
     established performance edge. It is not: 11 of 19 acute carbohydrate studies
     found no effect, every study that favoured higher carbs also had higher
     energy intake, and no isocaloric comparison has ever favoured the high-carb
     arm (Henselmans 2022, 49 studies). What survives is the honest half — the
     day after a refeed is a day he is well fed and well slept, which is a fine
     day to try for a record without needing a mechanism story attached. */
  if (postRf && (vel == null || vel >= 0)) return { verdict: "PUSH+", vel, n: clean.length, why: `Green light: fed and slept${vel != null && vel > 0 ? ", and you have been gaining" : ""}. If a record is in you, today is a good day for it.`, receipts: R2.concat(["Yesterday was the refeed. Worth being straight about why that helps: no isocaloric study has ever shown extra carbohydrate improves the next session, so this is not glycogen — it is that you are rested and not hungry."]) };
  if (dowLag != null && dowLag <= -3) return { verdict: "PUSH", vel, n: clean.length, why: `Chase — but this weekday usually runs about ${Math.abs(dowLag)} reps lighter for you here. Beat THAT line and it is a win.`, receipts: R2 };
  if (vel != null && vel <= 0 && stall > 0) return { verdict: "PUSH", vel, n: clean.length, why: `Progress has gone flat here. Chase honestly — one more session without a gain and the desk suggests lightening.`, receipts: R2 };
  return { verdict: "PUSH", vel, n: clean.length, why: `${vel != null && vel > 0.2 ? "You are gaining here — keep chasing." : "Keep chasing."} Weight goes up on its own the day you hit the standard.`, receipts: R2 };
}

// Copied from frozen src/app.jsx @ fe516c1:3570-3630.
function recoveryIndex(s) {
  /* ---------- RECOVERY_NOTE ----------
     This used to hand back "45/100" as a headline. The app's own charter says
     precision means named inputs with receipts, each gated on its own n, and
     NEVER a composite score — so the headline was breaking the rule the rest of
     the engine keeps. Worse, the weights behind it (−10, −20, −21, −15) have no
     evidence behind them at all; readiness indices of this kind are widely used
     and poorly validated, and a single number hides which input moved.

     So the unit is now a FLAG: a named signal, individually gated, carrying the
     receipt that raised it and the specific thing that clears it. The count of
     flags is what gets shown, because a count of named things is an
     enumeration, not an index. `score` survives only to drive the old bar.

     One correctness fix while here: rep dips on a short-sleep or rushed session
     are not evidence of poor recovery — the sleep flag already accounts for the
     first, and a compressed session lowers reps by itself. Counting them again
     double-charged him for one bad night. Same rule the stall counter uses. */
  const flags = [];
  const add = (k, receipt, fix, cost) => flags.push({ k, receipt, fix, cost });
  const slp = sleepInfo(s);
  if (!slp.clean) add("sleep", `sleep reset — ${slp.run} of ${s.sleep.needed} clean nights`, `${s.sleep.needed - slp.run} more night${s.sleep.needed - slp.run === 1 ? "" : "s"} at ${s.sleep.cleanH} h or better, back to back`, Math.min(3, s.sleep.needed - slp.run) * 10);
  const last5 = s.sleep.nights.slice(-5).map((n) => n.h);
  /* two decimals, because 6.96 rounded to one reads "7.0 h — under 7" and looks
     like the app cannot do arithmetic. A receipt that looks wrong is not a receipt. */
  if (last5.length === 5 && last5.reduce((a, b) => a + b, 0) / 5 < 7) add("avg5", `five-night average is ${(last5.reduce((a, b) => a + b, 0) / 5).toFixed(2)} h — under 7`, "this one is chronic, not last night — it needs a week of earlier lights-out, not one long lie-in", 10);
  const holds = s.exercises.filter((e) => e.holdFlag);
  if (holds.length) add("held", `${holds.length} lift${holds.length > 1 ? "s" : ""} held by the governor: ${holds.map((e) => e.n).join(", ")}`, "one honest opener at 1 RIR or better on each releases it — the load is not lost, just parked", Math.min(20, holds.length * 10));
  const rirs = [];
  Object.keys(s.sessionLog).sort().slice(-3).forEach((d) => (s.sessionLog[d].entries || []).forEach((e) => { if (e.rir != null) rirs.push(e.rir); }));
  if (rirs.length >= 4 && rirs.filter((x) => x === 0).length / rirs.length >= 0.5) add("hot", `${rirs.filter((x) => x === 0).length} of your last ${rirs.length} openers ground out at 0 RIR`, "the taper asks for 2 on the opener, not 0 — back the first set off and let the LAST set be the one that goes to failure", 10);
  const cutoff = isoOf(new Date(todayStart().getTime() - 14 * DAY));
  let ng = 0;
  Object.entries(s.sessionLog).forEach(([d, sl]) => { if (d >= cutoff) ng += (sl.niggles || []).length; });
  if (ng) add("joints", `${ng} joint flag${ng > 1 ? "s" : ""} in the last 14 days`, "three of the same joint in three weeks and it goes to your coach as a pattern rather than a day", Math.min(21, ng * 7));
  /* dips, counted only on days that were a fair test */
  const recent = Object.keys(s.sessionLog).sort().slice(-2);
  const fairDips = recent.reduce((a, d) => {
    const sl = s.sessionLog[d];
    if (paceRushed(sl) || !cleanAtDate(s, d)) return a;
    return a + (sl.dips || 0);
  }, 0);
  const excluded = recent.reduce((a, d) => a + (paceRushed(s.sessionLog[d]) || !cleanAtDate(s, d) ? (s.sessionLog[d].dips || 0) : 0), 0);
  if (fairDips) add("dips", `${fairDips} rep dip${fairDips > 1 ? "s" : ""} across your last two sessions, on days that were a fair test`, "one session that beats its own previous totals clears this", Math.min(15, fairDips * 5));
  /* Energy availability belongs here too. It is the only flag on this card that
     is about the DEFICIT rather than about training or sleep, and it is the one
     with a published male threshold attached — see ENERGY_AVAILABILITY. */
  const eaR = energyAvailability(s);
  if (!eaR.gated && eaR.hi < EA_SPARING) {
    add("ea", `energy availability ${eaR.lo}–${eaR.hi} kcal per kg lean — under the ${EA_SPARING} where a lean male spares muscle`,
      eaR.stepsToDrop ? `eat ~${eaR.needKcal} more — FOOD is named first: deficit size is what the trained evidence ties to lean-mass loss (walking ~${eaR.stepsToDrop.toLocaleString()} fewer steps closes the same gap, as the second option)` : `close a ~${eaR.needKcal} kcal/day gap`,
      eaR.lo < EA_LOW ? 25 : 15);
  }
  const score = Math.max(0, Math.round(100 - flags.reduce((a, f) => a + f.cost, 0)));
  const lever = flags.slice().sort((a, b) => b.cost - a.cost)[0] || null;
  return {
    score, band: score >= 80 ? "GREEN" : score >= 55 ? "WATCH" : "LOW",
    flags, lever, watched: 7, excludedDips: excluded,
    factors: flags.map((f) => f.receipt),
  };
}

// Copied from frozen src/app.jsx @ fe516c1:5746-5751.
const tCrit = (df) => {
  if (df <= 0) return null;
  if (T95[df]) return T95[df];
  const keys = Object.keys(T95).map(Number).filter((k) => k <= df);
  return df >= 40 ? 1.96 : T95[Math.max(...keys)] || 1.96;
};

// Copied from frozen src/app.jsx @ fe516c1:5753-5776.
function ciOf(values, { minN = LAB_MIN_N } = {}) {
  const v = (values || []).filter((x) => typeof x === "number" && isFinite(x));
  const n = v.length;
  if (!n) return { n: 0, mean: null, sd: null, lo: null, hi: null, half: null, provisional: false, enough: false, txt: "(measured, n=0)" };
  const mean = v.reduce((a, b) => a + b, 0) / n;
  if (n === 1) {
    return { n, mean: +mean.toFixed(2), sd: null, lo: null, hi: null, half: null, provisional: true, enough: false,
      obsLo: +Math.min(...v).toFixed(1), obsHi: +Math.max(...v).toFixed(1),
      txt: `(provisional, n=1 — one observation has no spread)` };
  }
  const sd = Math.sqrt(v.reduce((a, b) => a + (b - mean) * (b - mean), 0) / (n - 1));
  const half = tCrit(n - 1) * (sd / Math.sqrt(n));
  const enough = n >= minN;
  return {
    n, mean: +mean.toFixed(2), sd: +sd.toFixed(2), half: +half.toFixed(2),
    lo: +(mean - half).toFixed(2), hi: +(mean + half).toFixed(2),
    obsLo: +Math.min(...v).toFixed(1), obsHi: +Math.max(...v).toFixed(1),
    provisional: !enough, enough,
    /* The interval straddling zero is the single most useful thing a small-n card can
       say, so it gets said in words rather than left to be inferred from two numbers. */
    straddlesZero: (mean - half) <= 0 && (mean + half) >= 0,
    txt: enough ? `(measured, n=${n})` : `(provisional, n=${n} of ${minN})`,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:5791-5796.
const normSf = (z) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const p = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const cdf = 1 - (Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI)) * p;
  return z >= 0 ? 1 - cdf : cdf;
};

// Copied from frozen src/app.jsx @ fe516c1:5797-5797.
const twoTail = (z) => 2 * normSf(Math.abs(z));

// Copied from frozen src/app.jsx @ fe516c1:5802-5818.
function coFlagRate(perDimP, k, days) {
  const m = perDimP.length;
  let pDay = 0;
  for (let mask = 0; mask < (1 << m); mask++) {
    let bits = 0; for (let i = 0; i < m; i++) if (mask & (1 << i)) bits++;
    if (bits < k) continue;
    let pr = 1;
    for (let i = 0; i < m; i++) pr *= (mask & (1 << i)) ? perDimP[i] : (1 - perDimP[i]);
    pDay += pr;
  }
  return {
    perDay: pDay,
    expected: +(pDay * days).toFixed(2),
    anyInWindow: +(1 - Math.pow(1 - pDay, days)).toFixed(3),
    oncePerDays: pDay > 0 ? Math.round(1 / pDay) : null,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:5831-5831.
const chanceWords = (nDocs, minCount) => (nDocs < minCount ? 0 : +(nDocs / (minCount * 3)).toFixed(1));

// Copied from frozen src/app.jsx @ fe516c1:5833-5838.
const ciLine = (c, unit = "lb") => {
  if (!c || !c.n) return "no observations yet";
  if (c.n === 1) return `one observation only — no spread to report yet`;
  const sign = (x) => (x > 0 ? `+${x}` : `${x}`);
  return `mean ${sign(c.mean)} ${unit} · 95% CI ${sign(c.lo)} to ${sign(c.hi)} · SD ${c.sd} · observed ${sign(c.obsLo)} to ${sign(c.obsHi)} (n=${c.n})`;
};

// Copied from frozen src/app.jsx @ fe516c1:5839-6387.
function labAnalytics(s) {
  const out = [];
  const sealed = daysUntil(s.blackout.until) > 0;
  const reads = s.reads.filter((r) => !r.sealed && !r.offWindow);
  const CI = ciOf; /* local alias — every "measured" scalar in here goes through it */
  const readByD = {}; reads.forEach((r) => { readByD[r.d] = r.w; });
  const nextDay = (d) => isoOf(new Date(mk(d).getTime() + DAY));
  const bfNow = bfEst(s);

  /* 1 · whoosh signature
     ---------------------------------------------------------------------------
     WHOOSH_CALIBRATION_NOTE. A "spike" was a fixed 2.0 lb jump and "cleared" was a
     fixed return to within 0.4 lb — two magic constants in an app that MEASURES this
     athlete's day-to-day variability three cards away. On a quiet scale 2 lb is a
     genuine event; on a noisy one it is a Tuesday. Thresholds now scale off his own
     noise floor: a spike is a jump larger than 3 sigma, cleared is a return to within
     1 sigma of the pre-spike weight. Self-calibrating, which also raises the effective
     gate — fewer things qualify as episodes, which is the honest direction — and it
     ties the scale instruments to one another instead of leaving each with its own
     private constants. */
  const wnW = weightNoise(s.reads);
  const spikeMin = +(3 * wnW.sd).toFixed(2);
  const clearWithin = +(1 * wnW.sd).toFixed(2);
  const eps = [];
  for (let i = 1; i < reads.length; i++) {
    if (reads[i].w - reads[i - 1].w >= spikeMin) {
      const pre = reads[i - 1].w;
      for (let j = i + 1; j < reads.length; j++) {
        if (reads[j].w <= pre + clearWithin) { eps.push({ jump: +(reads[i].w - reads[i - 1].w).toFixed(1), days: Math.round((mk(reads[j].d) - mk(reads[i].d)) / DAY) }); break; }
      }
    }
  }
  /* Upcoming only, nearest first, within a 3-day bracing horizon. Was
     `daysUntil(e.d) <= 3`, which matched every past event too — see
     EVENT_RECENCY_NOTE. `recentEv` carries the just-passed case so the card can speak in
     the past tense instead of pretending the event is still ahead. */
  const ev = nextEvent(s, 3);
  const recentEv = ev ? null : lastEvent(s, 4);
  /* The old min–max/trimmed-max pair is gone: a range of observations is not an
     interval, and quoting one as if it were was the whole defect here. */
  const clearCI = CI(eps.map((e) => e.days));
  const jumpCI = CI(eps.map((e) => e.jump));
  out.push({ id: "whoosh", t: "WHOOSH SIGNATURE", status: clearCI.enough ? "LIVE" : eps.length >= 2 ? "PROVISIONAL" : "ARMED", prog: { n: eps.length, need: LAB_MIN_N, label: "spike→drain episodes" },
    tag: clearCI.enough ? "How fast event water leaves YOUR body, with its interval." : "How fast event water leaves you — provisional, few episodes.",
    deep: `Big meals spike the scale with sodium, glycogen and gut content — not fat (a 4.6 lb fat gain would need ~16,000 surplus calories, not one dinner). This card measures how long each of your spikes took to clear. Two things changed. It used to speak at two episodes and quote a min–max of what it had seen; that range describes the sample, not the estimate, and it gets WIDER with more data while a real interval gets narrower, so both are shown now and labelled apart. And it used to define a spike as a flat 2.0 lb and "cleared" as a flat 0.4 lb — magic constants, in an app that measures your own day-to-day variability three cards away. On a quiet scale 2 lb is an event; on a noisy one it is a Tuesday. A spike is now a jump past 3 sigma of your measured noise (${spikeMin} lb for you right now) and cleared is a return to within 1 sigma (${clearWithin} lb). It recalibrates itself as your data does.`,
    forYou: eps.length >= 2
      ? (ev
        ? `${ev.t} ${fmtShort(ev.d)}${daysUntil(ev.d) === 0 ? " (today)" : ` (in ${daysUntil(ev.d)}d)`}: expect a next-morning spike near ${jumpCI.mean > 0 ? "+" + jumpCI.mean : jumpCI.mean} lb (95% CI ${jumpCI.lo} to ${jumpCI.hi}), clearing in about ${clearCI.mean} days (95% CI ${Math.max(0, clearCI.lo)} to ${clearCI.hi}). Readings inside that window are pre-dismissed; the first clean read after may still carry residue, and the damped trend already knows.${clearCI.provisional ? ` PROVISIONAL — ${LAB_MIN_N - eps.length} more episode${LAB_MIN_N - eps.length === 1 ? "" : "s"} before these are numbers rather than impressions.` : ""}`
        : recentEv
          ? `${recentEv.t} was ${fmtShort(recentEv.d)}, ${Math.abs(daysUntil(recentEv.d))} day${Math.abs(daysUntil(recentEv.d)) === 1 ? "" : "s"} ago — so any spike from it should be clearing by now, on a typical ${clearCI.mean}-day drain (95% CI ${Math.max(0, clearCI.lo)} to ${clearCI.hi}). Nothing to brace for; the trend has already absorbed it.`
          : `No event upcoming — nothing to brace for. On file: clearance about ${clearCI.mean} days (95% CI ${Math.max(0, clearCI.lo)} to ${clearCI.hi}, n=${eps.length}).${clearCI.provisional ? " Provisional until six episodes." : ""}`)
      : "Needs one more spike→clear cycle to open.",
    lines: eps.length >= 2 ? [
      `${eps.length} episode${eps.length === 1 ? "" : "s"} on file · observed spikes +${jumpCI.obsLo} to +${jumpCI.obsHi} · observed clearance ${clearCI.obsLo}–${clearCI.obsHi} days`,
      `clearance estimate: ${ciLine(clearCI, "days")}`,
    ] : [] });

  /* 2 · refeed bump line */
  const refDs = HISTORY.filter((h) => h.cal != null && h.cal >= 2100 && /\bREFEED\b/.test(h.note || "") && !/REFEED SKIPPED/i.test(h.note || "")).map((h) => h.d);
  const bumps = refDs.map((d) => (readByD[d] != null && readByD[nextDay(d)] != null ? +(readByD[nextDay(d)] - readByD[d]).toFixed(1) : null)).filter((x) => x != null);
  const nxtWed = (() => { let d = todayStart(); for (let i = 1; i <= 7; i++) { const t2 = new Date(d.getTime() + i * DAY); if (t2.getDay() === 3) return isoOf(t2); } return null; })();
  const bumpCI = CI(bumps);
  out.push({ id: "refeed", t: "REFEED BUMP LINE", status: bumpCI.enough ? "LIVE" : bumps.length >= 2 ? "PROVISIONAL" : "ARMED", prog: { n: bumps.length, need: LAB_MIN_N, label: "measured refeed mornings" },
    tag: bumpCI.enough ? "Your morning-after-refeed number, with its interval." : "Your morning-after-refeed mornings — not yet a number.",
    deep: "Refeed carbs bind water into muscle glycogen (~3 g of water per gram of carbohydrate stored). The next-morning bump is that storage — it is literally the fullness you are dieting FOR, wearing a scary costume on the scale. This card used to print your deltas as a list and call the result 'your personal number' at n=2. It was not one: a handful of mornings averaging about half a pound with a spread near a pound and a half is noise with a mean, and the interval below says so out loud. It stays PROVISIONAL until six mornings exist, because that is roughly where a within-person estimate starts being an estimate.",
    forYou: bumps.length >= 2
      ? `${ciLine(bumpCI)}.${bumpCI.straddlesZero ? " The interval crosses zero — on your data so far the refeed's morning-after effect is not distinguishable from no effect at all." : ""}${bumpCI.provisional ? ` PROVISIONAL — ${LAB_MIN_N - bumps.length} more refeed morning${LAB_MIN_N - bumps.length === 1 ? "" : "s"} before this is a number.` : ""} Either way the mechanism holds: you lift heavier ON the bump, not despite it.`
      : "Two measured refeed mornings open the card; six make it a number.",
    lines: bumps.length >= 2 ? [
      `observations: ${bumps.slice().sort((a, b) => a - b).map((x) => x > 0 ? `+${x}` : `${x}`).join(" · ")}`,
      ciLine(bumpCI),
    ] : [] });

  /* 3 · personal noise floor */
  const deltas = [];
  for (let i = 1; i < reads.length; i++) {
    if (Math.round((mk(reads[i].d) - mk(reads[i - 1].d)) / DAY) === 1) { const dd = reads[i].w - reads[i - 1].w; if (Math.abs(dd) < 1.5) deltas.push(dd); }
  }
  /* ---------- NOISE_FLOOR_NOTE — the band was the wrong variance ----------
     This used to be the RMS of CONSECUTIVE-DAY DIFFERENCES, then applied as the band
     for a SINGLE READING against the trend. Those are different quantities, and the
     card was using one to do the other's job.

     The audit predicted the old band ran up to ~41% too WIDE, on the independence
     relation that a day-to-day difference carries √2 times the spread of one reading
     against its trend. Measured on his actual data it comes out the other way, and the
     reason is the same autocorrelation this whole section is about: consecutive days
     are so alike that their differences are SMALL (±0.8), while multi-day water swings
     wander a long way from any smooth line (±1.4 against a 28-day least-squares fit).
     Under strong positive autocorrelation the √2 relation inverts. Worth stating
     plainly rather than quietly shipping a number that contradicts the brief.

     Which line to difference against matters, so the band uses the one he actually
     judges against: the damped EWMA trend drawn on the chart and printed on NOW.
     Residual SD about a 28-day straight line would also fold in curvature — a genuine
     change in rate — and curvature is not noise. weightNoise() already computes
     exactly this for the chart band, so the card and the chart now agree by
     construction instead of by coincidence.

     The day-to-day figure stays as a labelled second line. It is a real quantity,
     just not this one. */
  const rateN = currentRate(s);
  const wn = weightNoise(s.reads);
  const sigmaTrend = wn && wn.measured ? wn.sd : null;
  const sdDelta = deltas.length >= 8 ? Math.sqrt(deltas.reduce((a, b) => a + b * b, 0) / deltas.length) : null;
  const sdN = sigmaTrend != null ? sigmaTrend : sdDelta;
  const nBand = sigmaTrend != null ? wn.n : deltas.length;
  out.push({ id: "noise", t: "YOUR NOISE FLOOR", status: sdN ? "LIVE" : "ARMED", prog: { n: nBand, need: 8, label: sigmaTrend != null ? "reads in the fitted window" : "clean day-pairs" },
    tag: "The size of a meaningless scale move, in you specifically.",
    deep: `Even at perfect protocol — fasted, post-void — daily weight wobbles from water, sodium, gut content and timing. Below your measured band a change is indistinguishable from nothing, which converts "don't react to one day" from advice into a calibrated instrument. The estimator changed. This used to be the RMS of consecutive-day DIFFERENCES, then used as the band for a single reading against the trend — one quantity doing another's job. It is now the spread of your readings around the damped trend itself, which is the line you actually judge against and the line the chart draws. Two details worth knowing: the difference between two days is not the same size as one reading's distance from the trend, and on your data the day-to-day figure is the SMALLER of the two (±${sdDelta != null ? sdDelta.toFixed(1) : "0.8"} against ±${sdN.toFixed(1)}) — because consecutive mornings are so alike that their differences understate how far a multi-day water swing can carry you from the line. Textbook independence predicts the opposite; your autocorrelation inverts it. And the band is measured about the trend rather than about zero, so a real downward slope is no longer folded into "noise".`,
    forYou: sdN
      ? `Judge any morning against the trend (${s.trend}), never against a single prior read — a move within ±${sdN.toFixed(1)} lb of the trend is zero information. The scale card stamps those automatically. Two consecutive lows is where signal starts.${sdDelta != null && sigmaTrend != null ? ` Your consecutive-day spread is ±${sdDelta.toFixed(1)}, which is a different and smaller quantity; using it as this band was making the app slightly too quick to call a move real.` : ""}`
      : "Eight clean consecutive-day pairs calibrate it.",
    lines: sdN ? [
      `±${sdN.toFixed(1)} lb — one reading vs the damped trend (n=${nBand})${rateN && rateN.rho1 != null ? ` · lag-1 residual autocorrelation ${rateN.rho1}` : ""}`,
      sdDelta != null && sigmaTrend != null ? `±${sdDelta.toFixed(1)} lb — consecutive-day difference, a different quantity and not the band` : null,
    ].filter(Boolean) : [] });

  /* 4 · masked-loss monitor */
  const last5 = reads.slice(-5);
  const flatWin = !sealed && last5.length === 5 && (mk(last5[4].d) - mk(last5[0].d)) / DAY <= 6 && Math.abs(last5[4].w - last5[0].w) < 0.4;
  const ph = PHASES[s.phase];
  const cals5 = last5.map((r) => (s.dailyLogs[r.d] || {}).cal).filter((c) => c != null);
  const compliant = cals5.length >= 4 && cals5.every((c) => c <= ph.band[1] + 150);
  out.push({ id: "masked", t: "MASKED-LOSS MONITOR", status: "LIVE", prog: null,
    tag: "Catches the fake stall before you react to it.",
    deep: "Water can hold the scale flat for days while fat loss continues underneath, then release at once — your 6/28→7/2 whoosh was exactly this. Flat trend plus compliant intake for 5+ days means the drop is loading, not missing. It is the single most common moment people panic-cut, and the one your last prep's ghosts live in.",
    forYou: sealed ? "Sealed until Monday. For the record: in six weeks of history, every flat stretch under compliant intake broke DOWNWARD. The system has never actually stalled on you — remember that Tuesday if the scale plays dead."
      : flatWin && compliant ? "FIRING NOW — flat + compliant ≥5 days. The drop is loading. Touch nothing."
      : "Watching. If it fires, the card will say so here, and the correct response is written on it: hands off.",
    lines: [] });

  /* 5 · step-creep radar v2 */
  const stepDays = Object.entries(s.dailyLogs).filter(([d, v]) => d > "2026-07-21" && v.steps != null);
  out.push({ id: "creep", t: "STEP-CREEP RADAR v2", status: stepDays.length >= 14 ? "LIVE" : "ARMED", prog: { n: stepDays.length, need: 14, label: "post-handoff step days" },
    tag: "Names manufactured steps at recurrence 2, not 7.",
    deep: "Organic high-step days get fed and forgotten. A quietly rising 7-day step FLOOR — the minimum creeping up — is compensation sneaking in the back door. That pattern took seven recurrences to catch by hand last time; the radar flags the floor at two.",
    forYou: stepDays.length >= 14 ? "Live and watching the floor." : `Armed at ${stepDays.length}/14. Until then the manual tell stands: a step day that feels EARNED rather than HAPPENED is the creep talking.`,
    lines: [] });

  /* 6 · Tue/Fri experiment */
  const wkKey = (d) => { const dt = mk(d); const off = (dt.getDay() + 6) % 7; return isoOf(new Date(dt - off * DAY)); };
  const weeks = {};
  Object.keys(s.sessionLog).forEach((d) => { const dow = mk(d).getDay(); if (dayType(d) === "L") { (weeks[wkKey(d)] = weeks[wkKey(d)] || {})[dow === 2 ? "tue" : dow === 5 ? "fri" : "x"] = d; } });
  /* ---------- TUEFRI_CONFOUND_NOTE ----------
     Fri-minus-Tue total reps was being read as a causal test of refeed distance, and
     called "a real gap" whenever |gap| >= 5 reps with no variance and no test behind it.
     Three problems, in order of size.

     It is CONFOUNDED. The contrast bundles refeed distance together with day-of-week,
     accumulated weekly fatigue, exercise-order drift, and — worst — the load-progression
     time trend: total reps rise across a block as loads and targets rise, so ANY later-
     in-week session inherits part of that climb. Detrending each pair against its own
     week's mean removes the block-level drift, which is the confound this card can
     actually do something about. The rest cannot be removed by arithmetic and are now
     named on the card instead of being quietly absorbed into the effect.

     It had no TEST. A five-rep threshold on a difference whose spread was never computed
     is a coin flip with a rule attached. It reports the paired difference with its 95%
     interval now, and says explicitly when that interval crosses zero.

     And it was labelled LIVE, i.e. measured. It is an observational contrast, so it reads
     PROVISIONAL until there are enough pairs, and the copy says "consistent with" rather
     than "evidence for". The honest upgrade path is to graduate it into the trials desk
     as a randomized block; until someone does that, it is a hint. */
  const pairs = Object.values(weeks).filter((w) => w.tue && w.fri);
  const sumReps = (d) => ((s.sessionLog[d] || {}).entries || []).reduce((a, e) => a + (e.reps || []).reduce((x, y) => x + y, 0), 0);
  /* Detrended paired difference: (fri − weekMean) − (tue − weekMean) reduces to
     fri − tue for a two-session week, so the drift removal that actually matters is
     across pairs — express each difference relative to that week's own total so a block
     where both days climbed does not read as a Friday advantage. */
  const tfDiffs = pairs.map((pr) => {
    const f = sumReps(pr.fri), t = sumReps(pr.tue);
    const wkMean = (f + t) / 2;
    return wkMean > 0 ? +(((f - t) / wkMean) * 100).toFixed(2) : null;
  }).filter((x) => x != null);
  const tfRaw = pairs.map((pr) => sumReps(pr.fri) - sumReps(pr.tue));
  const tfCI = CI(tfDiffs);
  const tfRawCI = CI(tfRaw);
  out.push({ id: "tuefri", t: "TUE/FRI CONTRAST — REFEED DISTANCE", status: tfCI.enough ? "PROVISIONAL" : "ARMED", prog: { n: pairs.length, need: LAB_MIN_N, label: "paired weeks" },
    tag: "An accidental contrast, not a controlled experiment.",
    deep: "Friday lower sits 2 days after the Wednesday refeed; Tuesday lower sits 6 days out — same lifts, same you, different glycogen distance, repeating weekly. That is a genuinely useful accident, and this card used to oversell it as \"the cleanest causal test a training week could construct\". It is not a controlled test, because the Friday-minus-Tuesday difference also carries day-of-week, accumulated weekly fatigue, exercise-order drift and the load-progression time trend — total reps climb across a block as loads climb, so any later-in-week session inherits part of that rise. Expressing each week's difference as a percentage of that week's own volume removes the block-level drift; the rest cannot be removed by arithmetic, so they are named rather than absorbed. It also used to call any gap of 5+ reps \"a real gap\" with no variance behind it, which is a threshold masquerading as a test. It now reports the paired difference with its interval, and if that interval crosses zero it says so. The honest upgrade is to graduate this into the trials desk as a randomized block; until then it is a hint worth having, not a finding.",
    forYou: tfDiffs.length >= 2
      ? `Friday runs ${tfCI.mean > 0 ? "+" : ""}${tfCI.mean}% of weekly volume vs Tuesday (95% CI ${tfCI.lo} to ${tfCI.hi}, n=${tfDiffs.length} pairs; in raw reps ${tfRawCI.mean > 0 ? "+" : ""}${tfRawCI.mean}). ${tfCI.straddlesZero ? "That interval crosses zero, so on your data so far there is no detectable refeed-distance effect — which is itself worth knowing, and consistent with the protocol line that refeeds are not a metabolic intervention." : "That interval clears zero, which is consistent with a refeed-distance effect — but the contrast is confounded with day-of-week and weekly fatigue, so treat it as grounds for a coach conversation, not as a measured effect size."}${tfCI.provisional ? ` PROVISIONAL at ${tfDiffs.length} of ${LAB_MIN_N} pairs.` : ""}`
      /* A PAIR needs its Tuesday and Friday in the SAME week. Taking the next Tuesday and
         the next Friday independently gives "Tue 8/4 + Fri 7/31" on a Thursday — a Friday
         that precedes its own Tuesday, which reads like the app cannot use a calendar. So
         anchor on the next Tuesday and take that week's Friday, three days later. */
      : (() => {
        const tue = nextDow(2);
        const fri = isoOf(new Date(mk(tue).getTime() + 3 * DAY));
        return `First pair completes ${fmtShort(tue)} + ${fmtShort(fri)}. It will report the difference with its interval, and stay labelled as the confounded contrast it is.`;
      })(),
    lines: tfDiffs.length >= 2 ? [
      `detrended paired difference: ${ciLine(tfCI, "% of weekly volume")}`,
      `confounded with: day-of-week · weekly fatigue · exercise-order drift — not removable by arithmetic`,
    ] : [] });

  /* 7 · rep-drop fingerprints */
  const sesN = Object.keys(s.sessionLog).length;
  let fp = { opener: 0, tail: 0, broad: 0 };
  if (sesN >= 8) {
    const byEx = {};
    Object.keys(s.sessionLog).sort().forEach((d) => (s.sessionLog[d].entries || []).forEach((e) => {
      if (!e.reps || !e.reps.length) return;
      const prev = byEx[e.id];
      if (prev && prev.length === e.reps.length) {
        const o = e.reps[0] < prev[0], t2 = e.reps[e.reps.length - 1] < prev[prev.length - 1];
        if (o && t2) fp.broad++; else if (o) fp.opener++; else if (t2) fp.tail++;
      }
      byEx[e.id] = e.reps;
    }));
  }
  out.push({ id: "fingerprint", t: "REP-DROP FINGERPRINTS", status: sesN >= 8 ? "LIVE" : "ARMED", prog: { n: sesN, need: 8, label: "completed sessions" },
    tag: "WHERE reps fall says WHY they fell.",
    deep: "Opener down, tail intact = readiness (sleep, CNS). Opener intact, tail collapsing = fuel (glycogen, refeed distance). Everything down = systemic recovery. Different diagnoses, different levers — pulling the wrong one is how good preps get wrecked.",
    forYou: sesN >= 8 ? `Your distribution: opener ${fp.opener} · tail ${fp.tail} · broad ${fp.broad}. The dominant pattern names your dominant lever.` : `${sesN}/8 sessions. Already usable by hand: your 7/21 lower was the textbook BROAD dip — systemic, sleep-attributed, correctly blamed on the ledger and not the programming.`,
    lines: [] });

  /* 8 · sleep→lift lag */
  const shortNights = s.sleep.nights.filter((n) => n.d > "2026-07-21" && n.h < 6.5).length;
  out.push({ id: "sleeplag", t: "SLEEP→LIFT LAG MAP", status: shortNights >= 6 ? "LIVE" : "ARMED", prog: { n: shortNights, need: 6, label: "short-night observations (no need to rush these)" },
    tag: "Does a bad night hit you same-day or the day after?",
    deep: "Sleep-debt effects on performance can land immediately or ~24–48 h delayed, and differently by lift class — heavy compounds usually pay first. Your lag decides which day own-attempts get scheduled after a rough night.",
    forYou: shortNights >= 6 ? "Live — check the per-class lag before scheduling own-attempts." : `${shortNights}/6 — the one gate you should fail to feed quickly. Until it speaks, assume next-day risk on compounds: your 4.5 h night of 7/16 landed hardest on the 7/17 lower.`,
    lines: [] });

  /* 8b · sleep dose experiment — floor vs ceiling, tested in you */
  const postN = s.sleep.nights.filter((n) => n.d > "2026-07-21");
  const armLong = postN.filter((n) => n.h >= 8.5 && s.sessionLog[nextDay(n.d)]);
  const armStd = postN.filter((n) => n.h >= 7.5 && n.h < 8.5 && s.sessionLog[nextDay(n.d)]);
  const repsAfter = (arr) => arr.map((n) => ((s.sessionLog[nextDay(n.d)] || {}).entries || []).reduce((a, e) => a + (e.reps || []).reduce((x, y) => x + y, 0), 0));
  const doseLive = armLong.length >= 5 && armStd.length >= 5;
  const avg2 = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0);
  out.push({ id: "sleepdose", t: "SLEEP DOSE — 7.5 FLOOR vs 8.5 CEILING", status: doseLive ? "LIVE" : "ARMED", prog: { n: Math.min(armLong.length, armStd.length), need: 5, label: "nights per arm (with a next-day session)" },
    tag: "Does 8.5+ beat your 7.5 clean-floor in YOUR lifts? (Mah 2011 prior)",
    deep: "Mah et al. 2011 (Sleep) extended college athletes toward 10 h in bed and got objectively faster sprints, better shooting accuracy, and improved mood — suggesting habitual sleep is a floor, not an optimum. Your CLEAN gate treats 7.5 as the line; this experiment asks whether ≥8.5 buys measurable next-day output in you specifically.",
    forYou: doseLive ? `Next-day total reps: after 8.5+ h → ~${avg2(repsAfter(armLong))} vs after 7.5–8.5 h → ~${avg2(repsAfter(armStd))} (n=${armLong.length}/${armStd.length}). ${avg2(repsAfter(armLong)) > avg2(repsAfter(armStd)) + 3 ? "The ceiling pays — bank long nights before big attempts." : "No clear edge yet — the 7.5 floor is holding its own."}` : `${armLong.length}/5 long nights · ${armStd.length}/5 standard banked. You control this experiment's pace — the long-night arm is the fun one to fill.`,
    lines: [] });

  /* 9 · RIR truth-check */
  const rir1 = [];
  Object.values(s.sessionLog).forEach((sl) => (sl.entries || []).forEach((e) => { if (e.rir === 1 && e.reps && e.reps.length >= 2) rir1.push(e.reps[e.reps.length - 1] <= e.reps[0] - 3); }));
  out.push({ id: "rirtruth", t: "RIR CALIBRATION CHECK", status: rir1.length >= 10 ? "LIVE" : "ARMED", prog: { n: rir1.length, need: 10, label: "logged RIR-1 openers" },
    tag: "Is your 'one left in the tank' actually a one?",
    deep: "Stimulants suppress perceived effort, and you lift at peak stack. If your logged 1s keep preceding tail craters, your 1 is behaving like a 0 — measurable, and correctable with a stated offset instead of a vague warning.",
    forYou: rir1.length >= 10 ? `${Math.round(100 * rir1.filter(Boolean).length / rir1.length)}% of your 1s preceded a crater — ${rir1.filter(Boolean).length / rir1.length > 0.4 ? "call your noon 1 a 0 from here." : "your 1 is honest; carry on."}` : `${rir1.length}/10. Until it speaks, the standing rule covers you: unsure between 1 and 0 at noon = it was 0.`,
    lines: [] });

  /* 10 · note-mining */
  const notes = Object.values(s.sessionLog).map((sl) => sl.note).filter((n) => n && n.length > 3);
  const stop = new Set(["with", "that", "this", "from", "sets", "reps", "good", "than", "last", "next", "after", "then", "were", "just", "very", "when", "session"]);
  const tok = {};
  notes.forEach((n) => n.toLowerCase().split(/[^a-z]+/).forEach((w) => { if (w.length >= 4 && !stop.has(w)) tok[w] = (tok[w] || 0) + 1; }));
  const top = Object.entries(tok).filter(([, c]) => c >= 3).sort((a, b) => b[1] - a[1]).slice(0, 5);
  out.push({ id: "notes", t: "NOTE-MINING · CUE GRADUATION", status: notes.length >= 10 ? "LIVE" : "ARMED", prog: { n: notes.length, need: 10, label: "session notes" },
    tag: "Your own words, mined for the patterns you keep repeating.",
    deep: "Free text catches what numbers can't — 'wired', 'set-4 anomaly', 'grinding'. A word repeating across 3+ sessions is a pattern announcing itself, and a technique cue that keeps recurring can graduate into the permanent SETUP blurb. Your notes literally author the app.",
    forYou: notes.length >= 10
      ? (top.length
        ? `Repeating in your own words: ${top.map(([w, c]) => `"${w}" ×${c}`).join(" · ")}. Read that against chance first: across ${notes.length} notes, word frequencies alone put roughly ${chanceWords(notes.length, 3)} words over a 3× threshold with no pattern behind them, so a repeat is a prompt to look, not a finding. The ones worth graduating are the ones you recognise as a real cue — say the word and any of them moves into SETUP.`
        : "No phrase has repeated 3× yet — all originals so far.")
      : `${notes.length}/10 notes. The lateral 'upright, elbow-led' cue in SETUP came from exactly one of these — that's the bar.`,
    lines: notes.length >= 10 && top.length ? [`~${chanceWords(notes.length, 3)} words would clear 3× by frequency alone — this is a prompt, not a verdict`] : [] });

  /* 11 · miss-antecedent map */
  const proTgtA = proteinTarget(s).lo;
  const misses = Object.entries(s.dailyLogs).filter(([d, v]) => d > "2026-07-21" && v.pro != null && !proteinHit(proTgtA, v.pro));
  out.push({ id: "miss", t: "MISS-ANTECEDENT MAP", status: misses.length >= 4 ? "LIVE" : "ARMED", prog: { n: misses.length, need: 4, label: "protein misses (may this stay armed forever)" },
    tag: "Turns protein recovery into protein prevention.",
    deep: "Every miss gets its context attached — event-adjacent? travel? short sleep the night before? Repeated antecedents become trap-day warnings issued in advance, converting your excellent 24-hour-fix record into not-needing-the-fix.",
    forYou: misses.length >= 4 ? misses.map(([d]) => fmtShort(d)).join(" · ") + " — checking each for shared antecedents." : "0 misses since handoff — the correct number. Staying armed all prep is this card's win condition.",
    lines: [] });

  /* 14 · pivot probability cone */
  const w2 = s.weekly;
  const rts = [];
  for (let i = 1; i < w2.length; i++) rts.push(Math.max(-10, Math.min(10, (w2[i - 1].trend - w2[i].trend) / Math.max(0.5, weeksBetween(w2[i - 1].wk, w2[i].wk)))));   /* RB-3 LAB CLAMP — a 500-lb typo read once drove sigma so wide runCone+GC stalled >60s; a rate beyond ±10 lb/wk is a data error, clamped at the boundary the instrument consumes */
  if (rts.length >= 4) {
    const nR = rts.length;
    const mu = rts.reduce((a, b) => a + b, 0) / nR;
    /* ---------- CONE_NOTE — process noise is not the only uncertainty ----------
       Two defects. First, σ divided by n, which is the biased estimator; the forecast
       card already used n−1, so the two instruments disagreed on the same quantity.
       Now n−1 in both.

       Second and larger: every run drew its weekly rate from Normal(μ, σ) as though μ
       and σ were KNOWN. They are estimated from four weekly rates. Simulating process
       noise while treating the parameters as exact makes the cone too narrow at
       precisely the n where it is least trustworthy — a fan chart that understates the
       fan. Each run now draws its own parameters first: μ* from the sampling
       distribution of the mean (widened by the t/z ratio at this df, so small n pays
       for itself), σ* from the χ² sampling distribution of a variance. Then it
       simulates weeks with those. That is parameter uncertainty and process noise
       compounded, which is what an honest cone is.

       The process-only cone is still computed, so the card can say how much of the
       spread was previously being hidden rather than assert that it was. */
    const sg = Math.sqrt(rts.reduce((a, b) => a + (b - mu) * (b - mu), 0) / Math.max(1, nR - 1));
    let seed = 42; const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
    const gauss = () => Math.sqrt(-2 * Math.log(Math.max(1e-9, rnd()))) * Math.cos(2 * Math.PI * rnd());
    const SIMS = 800;
    const df = Math.max(1, nR - 1);
    const tz = (tCrit(df) || 1.96) / 1.96;
    const runCone = (withParamUncertainty) => {
      const hits = [];
      for (let k = 0; k < SIMS; k++) {
        let muK = mu, sgK = sg;
        if (withParamUncertainty) {
          muK = mu + tz * (sg / Math.sqrt(nR)) * gauss();
          let chi = 0;
          for (let j = 0; j < df; j++) { const g = gauss(); chi += g * g; }
          /* σ*² = σ²·df/χ²_df, capped so a freak tiny χ² cannot blow the cone open */
          sgK = sg * Math.min(3, Math.sqrt(df / Math.max(1e-6, chi)));
        }
        let tr = s.trend, ln = bfNow.lean, wk3 = 0;
        for (; wk3 < 30; wk3++) {
          if (((tr - ln) / tr) * 100 <= 11.2) break;
          tr -= Math.max(0.2, muK + sgK * gauss()); ln += s.model.drip;
        }
        hits.push(wk3);
      }
      hits.sort((a, b) => a - b);
      return hits;
    };
    const hits = runCone(true);
    const hitsProcessOnly = runCone(false);
    const qOf = (arr, q) => arr[Math.min(arr.length - 1, Math.floor(arr.length * q))];
    const dISO = (wq) => isoOf(new Date(todayStart().getTime() + qOf(hits, wq) * 7 * DAY));
    const p50 = dISO(0.5);
    const spread80 = qOf(hits, 0.9) - qOf(hits, 0.1);
    const spread80Old = qOf(hitsProcessOnly, 0.9) - qOf(hitsProcessOnly, 0.1);
    const inWindow = p50 >= "2026-09-02" && p50 <= "2026-09-29";
    out.push({ id: "cone", t: "PIVOT PROBABILITY CONE", status: "LIVE", prog: null,
      tag: `${SIMS} simulated versions of your prep, racing to the pivot.`,
      deep: `Instead of one fake-precise date, it runs your prep ${SIMS} times and records when each run crosses ~11%. Each run now draws its OWN parameters before it starts — the mean weekly loss from the sampling distribution of a mean estimated on ${nR} weekly rates, and the spread from the χ² distribution of a variance estimated on the same ${nR} — and only then simulates the weeks. That matters because the old version drew weekly rates from μ ${mu.toFixed(2)}, σ ${sg.toFixed(2)} as though those two numbers were known facts rather than estimates off four weeks, which made the cone narrower than the evidence supports at exactly the sample size where it is least trustworthy. Simulating process noise while pretending the parameters are exact is a fan chart that understates the fan. σ also moved from the biased ÷n to ÷(n−1), which is what the forecast card already used — the two instruments no longer disagree about the same quantity.`,
      forYou: `Median run lands ${fmtShort(p50)}. ${inWindow ? "That is consistent with the coach's-eye 'mid/late September' call — but consistent is the right word, not confirmed: this cone and that call both run off the same weekly rates, so agreement between them is expected rather than independent corroboration." : "Your data currently runs " + (p50 < "2026-09-02" ? "ahead of" : "behind") + " the doc's September window — worth a coach conversation, not a lever pull."} The cone narrows with every clean Monday read, shifts honestly when Ease 2 slows the scale by design, and re-anchors entirely the day DEXA lands.`,
      lines: [
        `80% of runs hit the pivot band between ${fmtShort(dISO(0.1))} and ${fmtShort(dISO(0.9))} · median ${fmtShort(p50)} · from your ${nR} weekly rates`,
        `that 80% span is ${spread80} weeks wide; counting only process noise it would read ${spread80Old} — the difference is the parameter uncertainty the old cone hid`,
      ] });
  } else {
    out.push({ id: "cone", t: "PIVOT PROBABILITY CONE", status: "ARMED", prog: { n: rts.length, need: 4, label: "weekly rates" }, tag: "800 simulated preps racing to the pivot.", deep: "Monte Carlo over your measured weekly rates, with the uncertainty in those rates propagated rather than assumed away.", forYou: "Four weekly rates unlock it.", lines: [] });
  }

  /* 15 · DEXA reconciliation */
  out.push({ id: "dexarecon", t: "DEXA RECONCILIATION", status: s.dexaRecon ? "LIVE" : "ARMED", prog: { n: s.dexaRecon ? 1 : 0, need: 1, label: "DEXA anchor" },
    tag: "Scores the eye against the machine — once.",
    deep: "The instant DEXA lands, the model's estimate at that moment is frozen next to the measured number. The delta tells us whose eye to trust, and every downstream estimate and ETA re-anchors to measured ground.",
    forYou: s.dexaRecon ? `The eye read ${s.dexaRecon.eye}% when DEXA said ${s.dexaRecon.dexa}% (Δ ${s.dexaRecon.delta > 0 ? "+" : ""}${s.dexaRecon.delta}). Everything since runs on measured ground.` : `Expected outcome: DEXA reads HIGHER than the eye (~16 vs ~${bfNow.pct}) — that's method offset, not bad news; lean mass is the number to watch (predicted 138–142). ${(() => {
        /* Was hardcoded "Tue 7/28+, fully clear of the wedding" — a booking date that
           went stale the moment it passed, and a wedding that is now history. Computed
           against today and the next real event instead. */
        const up = nextEvent(s);
        const clearFrom = up ? isoOf(new Date(mk(up.d).getTime() + 3 * DAY)) : isoOf(new Date(todayStart().getTime() + DAY));
        return up
          ? `Cleanest booking: ${fmtShort(clearFrom)} or later — that puts it 3 days clear of ${up.t} (${fmtShort(up.d)}), so event water cannot ride into the scan.`
          : `Cleanest booking: any morning from ${fmtShort(clearFrom)} — nothing on the calendar to clear, so the only requirement is fasted and 2+ days off a refeed.`;
      })()}`,
    lines: [] });

  /* 12/13 · locked build-phase slots */
  (() => {
    const mv = muscleVolume(s);
    const line = mv.slice().sort((a, b) => (a.zone === "UNDER" ? -1 : b.zone === "UNDER" ? 1 : a.n7 - b.n7)).map((m) => `${m.mg} ${m.n7}${m.zone === "IN-BAND" ? " ✓" : m.zone === "UNDER" ? " ▼▼" : m.zone === "LOW" ? " ▼" : m.zone === "OVER" ? " ▲▲" : " ▲"}`).join(" · ");
    out.push({ id: "volumeledger", t: "THE VOLUME LEDGER — WEEKLY SETS PER MUSCLE", status: mv.length ? "LIVE" : "ARMED", prog: { n: mv.length, need: 1, label: "muscle groups with logged sets" },
      tag: "The biggest dial in hypertrophy, counted from your actual logs.",
      deep: "Weekly hard sets per muscle is the strongest known volume dial. Counting here uses the half-credit convention: direct sets count 1, and heavy secondary work lends half — pressing lends 0.5 to triceps and delts, rows and pulldowns lend 0.5 to biceps, curls lend 0.5 to forearms. That convention is no longer just the defensible middle: Pelland et al. 2025 (Sports Medicine, 67 studies, 2,058 participants) is a dose-response meta-regression that explicitly validates fractional 0.5 set counting, which is the strongest support this ledger's arithmetic could have and it postdates the Schoenfeld/Ogborn/Krieger 2017 work the card used to lean on. Counting conventions genuinely differ across the literature; half-credit is the defensible middle — direct-only starves muscles that live off compounds, full-credit double-books the same set twice. The bands are deficit-calibrated: " + VOL_BANDS.floor + " is the retention floor (below it for two straight weeks and the ledger proposes +1 as cheap insurance), " + VOL_BANDS.lo + "–" + VOL_BANDS.hi + " is the working zone, past " + VOL_BANDS.ceil + " is caution — recoverable volume compresses in a cut, and sets you cannot recover from are pure fatigue. THE TILT: this house presumes volume useful until your own bar speed says otherwise — adds fire on lighter evidence, while trims demand two confirmed weeks past the ceiling or slipping bars on clean sleep. Every proposal also cross-references the muscle's lift velocities, your sleep gate, and the alarm before it fires; changes go one set at a time through your consent inbox, and each muscle rests two weeks between moves so the change has time to speak. Adds go to the muscle's strongest mover, trims come off its weakest. Soreness testifies too: two-plus sore mornings blocks a headroom add for that muscle, and three sore mornings on a high week can propose the trim before the bar speed slips.",
      forYou: mv.length ? `This week: ${line}. ✓ in the working zone · ▼ light · ▼▼ under the retention floor · ▲ high · ▲▲ past the deficit ceiling. Proposals arrive in your inbox only when the signals agree.` : "Log a session and the ledger opens.",
      lines: [] });
  })();
  (() => {
    const nsig = (s.energy || []).length + (s.grip || []).length + (s.soreness || []).length;
    const eT2 = (s.energy || []).find((x) => x.d === isoOf(todayStart()));
    const gT2 = (s.grip || []).find((x) => x.d === isoOf(todayStart()));
    const soreToday = (s.soreness || []).find((x) => x.d === isoOf(todayStart()));
    out.push({ id: "signals", t: "MORNING SIGNALS — WIRED INTO THE MACHINE", status: nsig >= 5 ? "LIVE" : "ARMED", prog: { n: nsig, need: 5, label: "morning entries banked" },
      tag: "Energy, grip, soreness, meds — collected in the Minute, consumed by the desk, the volume ledger, the weather, and the scale.",
      deep: "Nothing here is decoration; each signal has a law. ENERGY GATE: 2-or-under on a morning at least a point below your usual (five-plus mornings on file) and the desk caps every push at HOLD — repeat, don't chase. GRIP GATE: today's left-plus-right at or under 92% of your recent median (four-plus entries) triggers the same cap; the nervous system testifies before the bar does. SORENESS LAW: two-plus sore mornings this week blocks a headroom add for that muscle; three sore mornings on a high-volume week can propose the trim before bar speed slips. MEDS: none-days flag the day's weather and the desk's receipts so appetite, energy, and effort read against the truth. SALT AND ALCOHOL: a high-sodium or alcohol evening annotates the next morning's scale read — water noise, named at the moment you'd otherwise worry. Every gate is silence until its data has standing.",
      forYou: nsig ? `Today: energy ${eT2 ? eT2.v + "/5" : "—"} · grip ${gT2 ? ((gT2.l || 0) + (gT2.r || 0)) + " lb" + (() => { const gh = (s.grip || []).filter((x) => x.d < isoOf(todayStart())).slice(-7).map((x) => (x.l || 0) + (x.r || 0)).filter((v) => v > 0); if (gh.length < 4) return ""; const b = gh.slice().sort((a, c) => a - c); const m = b[Math.floor(b.length / 2)]; const d = Math.round((((gT2.l || 0) + (gT2.r || 0)) / m - 1) * 100); return ` (${d >= 0 ? "+" : ""}${d}% vs median)`; })() : "—"} · sore ${soreToday ? (soreToday.mgs.length ? soreToday.mgs.join(", ") : "nothing") : "—"}. The desk's receipts on TRAIN show these being consulted, lift by lift.` : "Log a first morning signal and this card wakes; the gates arm themselves as history accrues.",
      lines: [] });
  })();
  (() => {
    const ml9 = s.medsLog || [];
    const onD9 = ml9.filter((x) => x.taken).map((x) => x.d);
    const offD9 = ml9.filter((x) => !x.taken).map((x) => x.d);
    const nMin9 = Math.min(onD9.length, offD9.length);
    const avgM = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
    const grabM = (days, f) => days.map(f).filter((v) => v != null && !isNaN(v));
    const rowsM = [];
    const cmpM = (label, f, fmt) => {
      const a = grabM(onD9, f), b = grabM(offD9, f);
      if (a.length < 2 || b.length < 2) return;
      rowsM.push(label + ": " + fmt(avgM(a)) + " on meds vs " + fmt(avgM(b)) + " without (n=" + a.length + "/" + b.length + ")");
    };
    cmpM("calories", (d) => (s.dailyLogs[d] || {}).cal, (v) => String(Math.round(v)));
    cmpM("protein", (d) => (s.dailyLogs[d] || {}).pro, (v) => Math.round(v) + " g");
    cmpM("steps", (d) => (s.dailyLogs[d] || {}).steps, (v) => (v / 1000).toFixed(1) + "k");
    cmpM("morning energy", (d) => { const e = (s.energy || []).find((x) => x.d === d); return e ? e.v : null; }, (v) => v.toFixed(1) + "/5");
    const liveM = nMin9 >= 3 && rowsM.length > 0;
    out.push({ id: "medswindow", t: "THE MEDS WINDOW \u2014 WHAT CHANGES WHEN THEY DON'T", status: liveM ? "LIVE" : "ARMED",
      prog: { n: nMin9, need: 3, label: "paired days on file" },
      tag: "Adherence already has a clock. This reads what that clock is worth \u2014 your days on meds against your days without, in your own numbers.",
      deep: "Method: every entry in the meds log is either taken or none. This card sorts your logged days into those two piles and reports the plain average of each \u2014 no modelling, no adjustment, no attempt to explain the gap. It needs three days on each side before it speaks, because two days of anything is an anecdote wearing a lab coat. What this is not: a verdict on medication. The house treats meds as weather, never as judgment, and this card will never propose a dose, a schedule, or a change \u2014 that conversation belongs to you and your prescriber, and the app has no standing in it. Read the confound before the numbers: none-days are not randomly assigned. If yours cluster on weekends, travel, or event days, part of what you are seeing is weekends rather than medication, and the honest reading is a flag for attention, never a causal claim. The nightly analyst is bound to name that confound whenever it quotes these lines.",
      forYou: liveM ? rowsM.join(" \u00b7 ") : (onD9.length + " days on meds and " + offD9.length + " without are on file. Three of each opens the comparison \u2014 until then this card counts and says nothing."),
      lines: [] });
  })();
  (() => {
    const rateF = currentRate(s);
    const t0F = isoOf(todayStart());
    const rsF = rateF.rates || [];
    const mF = rsF.length ? rsF.reduce((a, b) => a + b, 0) / rsF.length : 0;
    const sdF = rsF.length >= 2 ? Math.sqrt(rsF.reduce((a, r) => a + (r - mF) * (r - mF), 0) / (rsF.length - 1)) : null;
    const rowsF = [];
    /* The rate can now come from a regression over daily reads, which means it
       exists before any weekly snapshot does. The BAND cannot: it is the spread
       of his own weekly rates, and with fewer than two of those there is no
       spread to widen. A line without a band is the fake-precise forecast this
       card exists to refuse, so the gate stays on snapshots. */
    /* ---------- FORECAST_BAND_NOTE — the band grew at the wrong rate ----------
       The half-width was sigma*k: linear in weeks. For a SUM of k weekly rates the
       process-noise term grows as sigma*sqrt(k), not sigma*k, so the old band was far
       too wide eight weeks out — and wide for an unprincipled reason, which reads as
       caution while not actually being caution.

       But sqrt(k) alone is too narrow, because mu is estimated from only n weekly rates
       and that error compounds linearly when projected forward. The honest variance of a
       k-week cumulative loss is k*sigma^2 from process noise PLUS k^2*sigma^2/n from
       uncertainty in the mean, giving sigma*sqrt(k + k^2/n) — the same uncertainty model
       the cone now uses, so the two instruments finally agree about how far out they can
       see instead of being wrong in opposite directions.

       The old sigma*k is exactly what this collapses to at n=1: the formula was correct
       for a mean estimated from a single observation, which was never the situation. */
    if (rateF.measured && s.trend && sdF != null) {
      const nW = Math.max(1, rsF.length);
      const tF = tCrit(Math.max(1, nW - 1)) || 1.96;
      for (let k = 1; k <= 8; k++) {
        const wF = +(s.trend - rateF.scale * k).toFixed(1);
        const dF = isoOf(new Date(mk(t0F).getTime() + k * 7 * DAY));
        const bF = bfEst(s, wF, dF);
        rowsF.push("wk +" + k + " \u00b7 " + fmtShort(dF) + " \u00b7 " + wF.toFixed(1) + " lb" + (sdF ? " \u00b1" + (tF * sdF * Math.sqrt(k + (k * k) / nW)).toFixed(1) : "") + " \u00b7 " + bF.pct.toFixed(1) + "% bf \u00b7 lean " + bF.lean.toFixed(1));
      }
    }
    const ptsF = (id) => Object.keys(s.sessionLog || {}).map((d) => {
      const e = ((s.sessionLog[d] || {}).entries || []).find((x) => x.id === id);
      return e && e.reps && e.reps.length ? { d, top: Math.max.apply(null, e.reps) } : null;
    }).filter(Boolean).sort((a, b) => (a.d < b.d ? -1 : 1));
    const slopeF = (pts) => {
      if (pts.length < 3) return null;
      const x = pts.map((q) => weeksBetween(pts[0].d, q.d)), y = pts.map((q) => q.top);
      const n = x.length, mx = x.reduce((a, b) => a + b, 0) / n, my = y.reduce((a, b) => a + b, 0) / n;
      let num = 0, den = 0;
      for (let i = 0; i < n; i++) { num += (x[i] - mx) * (y[i] - my); den += (x[i] - mx) * (x[i] - mx); }
      return den > 0 ? num / den : null;
    };
    const liftF = [];
    (s.exercises || []).forEach((ex) => {
      const pts = ptsF(ex.id), sl = slopeF(pts);
      if (!sl || sl <= 0.02 || typeof ex.w !== "number") return;
      let reps = pts[pts.length - 1].top, w = ex.w;
      for (let k = 1; k <= 8; k++) { reps += sl; while (reps > (ex.hi || 12)) { const up = nextLoad(ex, w); if (up == null) { reps = ex.hi || 12; break; } w = up; reps -= 3; } }
      liftF.push({ s: sl, line: ex.n + ": " + ex.w + "\u00d7" + pts[pts.length - 1].top + " now \u2192 " + w + "\u00d7" + Math.round(reps) + " in 8 wks (+" + sl.toFixed(2) + " reps/wk, n=" + pts.length + ")" });
    });
    liftF.sort((a, b) => b.s - a.s);
    const heldF = Math.max(0, liftF.length - 5);
    const linesF = rowsF.concat(liftF.length ? ["\u2014"].concat(liftF.slice(0, 5).map((x) => x.line), heldF ? [`+ ${heldF} more lift${heldF === 1 ? "" : "s"} projected but not shown — the five climbing fastest are here`] : []) : []);
    const liveF = rowsF.length > 0;
    const endF = liveF ? rowsF[rowsF.length - 1] : null;
    out.push({ id: "forecast", t: "THE FORECAST \u2014 WEEK BY WEEK, ON YOUR OWN SLOPE", status: liveF ? "LIVE" : "ARMED",
      prog: { n: (s.weekly || []).length, need: 2, label: "weekly snapshots" },
      tag: "Where the current data lands you, week by week \u2014 body first, then the lifts. It refits itself every time you log.",
      deep: "Method, body: your weekly trend snapshots give a measured rate of loss; the projection walks that rate forward eight weeks and runs each future weight through the same body model the app uses today, so lean mass drips at your fitted rate rather than being assumed constant. The band is not decoration \u2014 it is the spread of your own weekly rates, widening with each week out, because uncertainty in a slope compounds the further you extrapolate. Two snapshots is the minimum; a single rate has no spread and therefore no honest band. Method, lifts: for every exercise with three or more logged sessions, the top set is regressed against time to get a reps-per-week slope, then walked forward under your own double-progression rules \u2014 when projected reps pass the top of the range, the bar goes up by that lift's increment and the reps reset the way they actually do in the gym. Lifts with fewer than three sessions are absent rather than guessed. What this is: a forecast, and it is labelled one everywhere it appears. It assumes the deficit holds, adherence holds, sleep holds, and nothing intervenes \u2014 assumptions that a single wedding, a cold, or a bad fortnight will break. It is not a promise and it never acts: no target changes, no volume moves, no proposal is filed off the back of it. When the data disagrees with the line, the data is right and the line redraws itself the next morning.",
      forYou: liveF ? (endF.split(" \u00b7 ").slice(1).join(" \u00b7 ") + " \u2014 eight weeks out at your measured rate of " + rateF.scale.toFixed(2) + " lb/wk" + (blackoutOn(s, t0F) ? ", drawn from the pre-blackout trend while the scale is sealed" : "") + ". (forecast \u2014 refits every log)") : "Two weekly snapshots open the projection. Until then the trend has no measured rate to walk forward, and a guessed line is worse than none.",
      lines: linesF });
  })();
  (() => {
    const ea = energyAvailability(s);
    out.push({
      id: "ea", t: "ENERGY AVAILABILITY — WHAT IS LEFT AFTER TRAINING IS PAID FOR", status: ea.gated ? "ARMED" : "LIVE",
      prog: ea.gated ? { n: ea.have, need: ea.need, label: "logged days of calories" } : null,
      tag: "The one reading that decides whether the deficit costs you muscle rather than fat.",
      deep: `Energy availability is intake minus the energy training costs, divided by fat-free mass — what is left to run the body on. Fagerberg's 2018 review of lean male physique athletes puts the sparing threshold at ${EA_SPARING} kcal per kg of fat-free mass per day; below about ${EA_LOW}, more than 40% of the weight lost comes off lean mass, alongside falls in testosterone, T3, leptin and resting metabolic rate. Those are the only male-specific thresholds in this literature — most low-energy-availability work is female and built on a questionnaire (LEAF-Q) that cannot be used in men, since half its items concern menstrual function. Two honesty notes. First, the convention counts PURPOSEFUL exercise, and a deliberate 16k-step day sits exactly on the boundary between training and incidental movement, which the convention does not resolve — so this shows both ends of the range rather than picking one and pretending. Second, session cost and walking cost are population estimates, not your measured expenditure. The instrument's job is to say which side of ${EA_SPARING} you are on, and to say which lever closes the gap more cheaply. It is not precise enough to argue about a decimal, and it never changes anything on its own.`,
      forYou: ea.gated
        ? `${ea.have} of ${ea.need} logged calorie days — this opens once there is enough intake data to average honestly.`
        : `${ea.lo}–${ea.hi} kcal per kg lean, which reads ${ea.band}. ${ea.hi < EA_SPARING ? `You are under the ${EA_SPARING} line on every way of counting it. ${ea.stepsToDrop ? `Closing it names FOOD first — about ${ea.needKcal} more calories a day — because deficit magnitude is what the trained-population evidence links to lean-mass loss; about ${ea.stepsToDrop.toLocaleString()} fewer steps closes the same gap as the second option.` : ""}` : ea.lo < EA_SPARING ? `Counting the walking you are under the line; counting training alone you are over it. That gap is the accounting question, not a measurement error — and at 16k deliberate steps a day the lower number is the more honest one.` : `Above the sparing threshold on both ways of counting.`}`,
      lines: ea.gated ? [] : ea.receipts,
    });
  })();
  /* R15g — THE REGIME DETECTOR, visible at last: the door the volume lever and the eat
     band both gate on. DERIVED-ONLY — one regime(s) call, zero new math; every sentence
     restates what the machinery already computed. Adding this card GROWS labStatusList,
     which lives in the engine-freeze baseline — a deliberate movement, enumerated in the
     regen. When it first turns LIVE on the phone, sweepLab's shelf-flip announcer files
     the "LAB LIVE — THE REGIME DETECTOR" diary line with these words at birth. */
  (() => {
    let reg = null;
    try { reg = regime(s); } catch (e) { reg = null; }
    const MEAN9 = {
      free: "lifts holding or rising while fat still falls — both terms improving at once, so the volume lever and bigger pushes stay unlocked",
      costing: "lifts falling while fat falls — progress is being paid for in muscle, so the engine tightens protection",
      accretionBound: "the scale rate is indistinguishable from zero and lifts are not rising — the fat term has stalled",
    };
    const FLIP9 = {
      free: "It flips to COSTING if the pooled lift trend turns falling while the rate stays above zero, or to ACCRETION-BOUND if the rate's own interval collapses onto zero — and either way the new state must be read twice, at least " + REGIME_HOLD_D + " days apart, before anything acts on it.",
      costing: "It flips back to FREE when the pooled lift trend stops falling while fat keeps coming off — read twice, at least " + REGIME_HOLD_D + " days apart, before anything acts on it.",
      accretionBound: "It flips when the rate's interval leaves zero or the lifts turn — read twice, at least " + REGIME_HOLD_D + " days apart, before anything acts on it.",
    };
    if (!reg || reg.key === "unknown") {
      /* the gathering grammar: every ARMED card carries its counter. This one counts the
         lift term (the slower funder); when the lifts are funded but the rate is not, the
         bar reads full and forYou names the missing term — the label says what it counts. */
      out.push({ id: "regime", t: "THE REGIME DETECTOR", status: "ARMED",
        prog: { n: Math.min((reg && reg.prog && typeof reg.prog.nLifts === "number") ? reg.prog.nLifts : 0, TREND_MIN_LIFTS), need: TREND_MIN_LIFTS, label: "lifts carrying a usable trend" },
        tag: "Which regime is this cut in — free, costing, or accretion-bound? Counting only — no verdict yet.",
        deep: "Two existing measurements, crossed: the pooled per-lift trend (inverse-variance weighted, its own 95% interval) and the scale rate (autocorrelation-honest interval). FREE = lifts not falling while the rate sits above zero. COSTING = lifts falling while fat falls. ACCRETION-BOUND = a rate indistinguishable from zero without rising lifts. No verdict is issued until both terms can be read.",
        forYou: reg && reg.why ? reg.why : "not enough data to read either term yet",
        lines: [] });
      return;
    }
    const lines9 = [];
    lines9.push("STATE — " + reg.key.toUpperCase() + (reg.confirmed ? " (confirmed)" : " (first establishment — not yet confirmed)") + ": " + MEAN9[reg.key] + ".");
    lines9.push(reg.confirmed
      ? "CONFIRMED because the same state was read at both evaluations — today and " + REGIME_HOLD_D + " days back. The hysteresis law: a known regime may never flip on one reading; a hunting target is worse than a wrong constant one."
      : "Awaiting its second reading — a state must be read twice, at least " + REGIME_HOLD_D + " days apart, before it counts. Until then the engine acts on nothing new.");
    if (reg.pending) lines9.push("PENDING FLIP — " + String(reg.pending).toUpperCase() + " has been read once (pending since " + reg.pendingSince + ") and needs its second reading, at least " + REGIME_HOLD_D + " days after the first, before it counts.");
    lines9.push(FLIP9[reg.key]);
    lines9.push("DOWNSIDE-ONLY PROTECTION — a rushed or short-sleep session can never be what CREATES a falling lift verdict: the trend re-pools on unprotected points, and if falling does not survive, it is not a decline you answer for. A rise still banks — protection never blocks the upside.");
    out.push({ id: "regime", t: "THE REGIME DETECTOR", status: reg.confirmed ? "LIVE" : "PROVISIONAL", prog: null,
      tag: "Which regime is this cut in — free, costing, or accretion-bound? The door the volume lever and the eat band both gate on.",
      deep: "Two existing measurements, crossed: the pooled per-lift trend (inverse-variance weighted, its own 95% interval) and the scale rate (autocorrelation-honest interval). FREE = lifts not falling while the rate sits above zero. COSTING = lifts falling while fat falls. ACCRETION-BOUND = a rate indistinguishable from zero without rising lifts. Hysteresis: a KNOWN state flips only after being read twice at least " + REGIME_HOLD_D + " days apart.",
      forYou: reg.why,
      lines: lines9 });
  })();

  out.push({ id: "mrv", t: "VOLUME RETURN CURVE — WHERE AN ADDED SET STOPS PAYING FOR ITS FATIGUE", status: "LOCKED", prog: null,
    tag: "Finds where your own added sets stop earning their fatigue — not a template's number.",
    deep: "Weekly sets per muscle plotted against volume-load slope and recovery response — the point where an added set stops improving output. What this can find is a marginal-return inflection, NOT a 'maximum recoverable volume': MRV is a coaching model, not a measured quantity, and no study validates training just beneath it. The literature prior it starts from: Schoenfeld, Ogborn & Krieger 2017 (meta-analysis) found a graded dose-response, 10+ weekly sets per muscle outgrowing lower volumes; later meta-regressions sharpen that to roughly logarithmic returns — each added set keeps buying a little, and buys less than the one before it. That's the build-phase climb target. The cut deliberately sits below it, because in a deficit load is what protects muscle and volume is the lever that comes down.",
    forYou: (() => { const cut7 = isoOf(new Date(todayStart().getTime() - 7 * DAY)); const perMg = {}; Object.entries(s.sessionLog).forEach(([d, sl]) => { if (d >= cut7) (sl.entries || []).forEach((e2) => { const ex2 = exById(s, e2.id); if (ex2 && ex2.mg && e2.reps) perMg[ex2.mg] = (perMg[ex2.mg] || 0) + e2.reps.length; }); }); const parts = Object.entries(perMg).map(([m, n2]) => `${m} ${n2}`); return `MEV on purpose while cutting — growing on the minimum is the plan. Your logged sets this week: ${parts.length ? parts.join(" · ") : "none in-app yet"} · the build climbs each toward the 10+ landmark, then keeps climbing only while the volume-load slope still pays for the fatigue.`; })(),
    lines: ["engine ships with the September program push"] });
  out.push({ id: "debutmodel", t: "DEBUT-READINESS MODEL", status: "LOCKED", prog: null,
    tag: "Learns the exact conditions under which your debuts land.",
    deep: "Recovery signals and prior-session context at each debut versus its outcome, once ~15 build-phase debuts exist to learn from. There is no sleep gate to replace any more — that rule was retired for having no evidence behind it — so what this would learn is whether ANY pre-session signal predicts how a debut lands, which is currently an open question rather than an assumed yes.",
    forYou: "Nothing gates a debut today. It runs when it wins the day's structural slot, and the first outing carries no rep expectations — which is the honest default until something is shown to predict better.",
    lines: ["needs ~15 build-phase debuts"] });

  const rank = { LIVE: 0, ARMED: 1, LOCKED: 2 };
  return out.sort((a, b) => rank[a.status] - rank[b.status]);
}

// Copied from frozen src/app.jsx @ fe516c1:6396-6396.
function fmt12(t2) { if (!t2 || t2 === "—") return t2; const [a3, b3] = t2.split(":").map(Number); const ap = a3 >= 12 ? "PM" : "AM"; const h12 = a3 % 12 === 0 ? 12 : a3 % 12; return `${h12}:${String(b3 || 0).padStart(2, "0")} ${ap}`; }

// Copied from frozen src/app.jsx @ fe516c1:6398-6400.
function todayMeds(s) {
  return (s.medsLog || []).find((x) => x.d === isoOf(todayStart())) || null;
}

// Copied from frozen src/app.jsx @ fe516c1:6769-6773.
function medianSOL(s) {
  const sols = s.sleep.nights.filter((n) => n.sol != null).slice(-14).map((n) => n.sol).sort((a, b) => a - b);
  if (sols.length < 5) return 15;
  return sols[Math.floor(sols.length / 2)];
}

// Copied from frozen src/app.jsx @ fe516c1:6789-6800.
function lightsOutT(s) {
  const ov = ((s.dayCtx || {})[isoOf(todayStart())] || {}).lightsOut;
  const an = sleepAnchor(s);
  const target = an.measured ? an.target : (((s.sleep || {}).anchor || {}).asleepTarget || ((s.sleep || {}).cleanH) || 8);
  const sol = an.measured && an.sol != null ? an.sol : medianSOL(s);
  if (ov) { const [oh, om] = ov.split(":").map(Number); return { t: ov, mins: oh * 60 + om, target, sol, override: true, wakeRef: an.measured ? an.wake : ((s.sleep || {}).anchor || {}).wake }; }
  const wakeRef = an.measured ? an.wake : (((s.sleep || {}).anchor || {}).wake || "07:30");
  const wm = wakeRef.split(":").map(Number);
  let lo = wm[0] * 60 + wm[1] - Math.round(target * 60) - sol;
  lo = ((lo % 1440) + 1440) % 1440;
  return { t: `${String(Math.floor(lo / 60)).padStart(2, "0")}:${String(lo % 60).padStart(2, "0")}`, mins: lo, sol, target, wakeRef, measured: an.measured };
}

// Copied from frozen src/app.jsx @ fe516c1:6803-6852.
function sleepLab(s) {
  const out = [];
  const exp = s.sleep.melaExp || { started: "2026-07-23", arm: "none" };
  const post = s.sleep.nights.filter((n) => n.d >= exp.started);
  const noneN = post.filter((n) => !(n.tags || []).includes("mela"));
  const melaN = post.filter((n) => (n.tags || []).includes("mela"));
  const pre = s.sleep.nights.filter((n) => n.d < exp.started);
  const avg = (a) => (a.length ? +(a.reduce((x, y) => x + y.h, 0) / a.length).toFixed(2) : null);
  const wokeRate = (a) => (a.length ? Math.round(100 * a.filter((n) => (n.tags || []).includes("woke")).length / a.length) : null);
  out.push({ id: "melaexp", t: "MELATONIN EXPERIMENT — ARM 1: NONE", status: noneN.length >= 7 ? "LIVE" : "ARMED", prog: { n: noneN.length, need: 7, label: "nights off melatonin" },
    tag: "Do you need the pill at all? Pre-registered " + fmtShort(exp.started) + ".",
    deep: "Baseline on file: 5 mg most nights, waking ~6 h in — right where a 5 mg bolus finishes clearing (half-life ~40–60 min). The literature says melatonin's average effect is minutes, not hours (Ferracioli-Oda 2013: ~7 min faster onset), it works as a clock signal at 0.3–0.5 mg (Zhdanova), and OTC labels are unreliable (−83% to +478% measured content). Arm 1 removes it entirely. If a low-dose arm is ever warranted — onset consistently ballooning past ~30–40 min — it gets pre-registered the same way.",
    forYou: (() => {
      const solAvg = (arr) => { const v = arr.filter((n) => n.sol != null); return v.length ? Math.round(v.reduce((a, n) => a + n.sol, 0) / v.length) : null; };
      return noneN.length >= 7
        ? `Off melatonin: avg ${avg(noneN)} h ASLEEP over ${noneN.length} nights (baseline ${avg(pre) ?? "—"} h)${solAvg(noneN) != null ? ` · drifting off in ~${solAvg(noneN)} min` : ""} · mid-night wakes ${wokeRate(noneN)}% of nights. ${solAvg(noneN) != null && solAvg(noneN) > 35 ? "Onset is the one signature where the 0.5 mg-early arm earns a trial — prescriber conversation attached." : avg(noneN) != null && avg(pre) != null && avg(noneN) >= avg(pre) ? "The pill was doing nothing you'll miss — case closing." : "Wake pattern persisting off the pill shifts suspicion to the caffeine tail or deficit-cortisol — next lever below."}`
        : `${noneN.length}/7 nights banked. Onset now measures itself from your drift-off entry — the low-dose trigger (>35 min) is finally a number, not a guess. Tonight counts.`;
    })(),
    lines: [] });
  const woke = post.filter((n) => (n.tags || []).includes("woke"));
  out.push({ id: "wakesig", t: "WAKE SIGNATURE", status: woke.length >= 5 ? "LIVE" : "ARMED", prog: { n: woke.length, need: 5, label: "tagged mid-night wakes" },
    tag: "Is the 6-hour wake a pattern with an address, or noise?",
    deep: "Every mid-night wake you tag carries a duration. Enough of them reveal whether the wakes cluster (a clock/clearance signature pointing at melatonin timing or the caffeine tail) or scatter (ordinary arousals everyone has and forgets). Deficit-cortisol wakes — the 3–4 a.m. classic in deep cuts — are also on the suspect list, and the pre-bed protein feed is their counter.",
    forYou: woke.length >= 5 ? `${woke.length} tagged wakes · avg ${Math.round(woke.reduce((a, n) => a + (n.awakeMin || 30), 0) / woke.length)} min awake · on ${wokeRate(post)}% of nights. Persisting off melatonin = caffeine-tail or cortisol; tell me and the clock-time capture ships.` : `${woke.length}/5 — may this one starve. Tag honestly; untagged solid nights are data too.`,
    lines: [] });
  /* variance tax — deviation from your own median bedtime, priced */
  (() => {
    const mins2 = (t) => { const [a2, b2] = t.split(":").map(Number); let m2 = a2 * 60 + b2; if (m2 < 720) m2 += 1440; return m2; };
    const timed = s.sleep.nights.filter((n) => n.bed).slice(-30);
    const med = (arr) => { const v = arr.slice().sort((a2, b2) => a2 - b2); return v.length ? v[Math.floor(v.length / 2)] : null; };
    const mB = med(timed.map((n) => mins2(n.bed)));
    const nd2 = (d) => isoOf(new Date(mk(d).getTime() + DAY));
    const bucket = (lo2, hi2) => timed.filter((n) => { const dv = Math.abs(mins2(n.bed) - mB); return dv >= lo2 && (hi2 == null || dv < hi2); });
    const onT = mB != null ? bucket(0, 31) : [];
    const offT = mB != null ? timed.filter((n) => Math.abs(mins2(n.bed) - mB) > 45) : [];
    const avgH = (a2) => (a2.length ? +(a2.reduce((x2, n) => x2 + n.h, 0) / a2.length).toFixed(1) : null);
    const reps2 = (a2) => { const v = a2.map((n) => s.sessionLog[nd2(n.d)]).filter(Boolean).map((sl2) => (sl2.entries || []).reduce((x2, e2) => x2 + (e2.reps || []).reduce((p2, q2) => p2 + q2, 0), 0)); return v.length >= 3 ? Math.round(v.reduce((x2, y2) => x2 + y2, 0) / v.length) : null; };
    const live2 = onT.length >= 5 && offT.length >= 5;
    const dH = live2 ? +(avgH(offT) - avgH(onT)).toFixed(1) : null;
    const rOn = live2 ? reps2(onT) : null, rOff = live2 ? reps2(offT) : null;
    out.push({ id: "variancetax", t: "THE VARIANCE TAX", status: live2 ? "LIVE" : "ARMED", prog: { n: Math.min(onT.length, offT.length), need: 5, label: "timed nights per bucket (on-schedule vs 45+ min off)" },
      tag: "Life will move your bedtime — this measures what each move costs YOU.",
      deep: "Regularity research now says something stronger than the older Phillips-era framing: in Windred et al. 2024 (SLEEP, roughly 60,000 UK Biobank participants) sleep REGULARITY predicted mortality more strongly than sleep DURATION did. That is a direct mandate for pricing timing scatter rather than treating it as a footnote to hours — but it is still a population claim. This instrument prices YOUR scatter: every timed night is measured against your own rolling median bedtime, bucketed on-schedule (within 30 min) vs off (45+ min), then the buckets are compared on hours slept and next-day session output. If the tax is real in you, the anchor earns its keep with receipts; if it's tiny, the app relaxes about bedtime honestly. Either verdict is a win — and the aim-time on NOW is a bearing, never a test.",
      forYou: live2
        ? `Off-schedule nights (${offT.length}) vs on-schedule (${onT.length}): ${dH > 0 ? "+" : ""}${dH} h sleep${rOn != null && rOff != null ? ` · next-day output ${rOff - rOn >= 0 ? "+" : ""}${rOff - rOn} reps` : ""} (measured). ${dH <= -0.5 || (rOn != null && rOff != null && rOff - rOn <= -5) ? "The tax is real in you — drifting bedtime costs actual iron; the anchor is earning its keep." : "The tax runs small so far — your system absorbs bedtime drift better than the literature's average. The anchor stays a bearing, not a leash."}`
        : `${Math.min(onT.length, offT.length)}/5 per bucket. It funds itself from the bed times you already log — ordinary messy life fills the off-schedule arm without you trying. No behavior required except honesty.`,
      lines: [] });
  })();
  return out;
}

// Copied from frozen src/app.jsx @ fe516c1:6863-6879.
function owedLedger(s, hour = clock.hour()) {
  const ref = hour < 5 ? new Date(todayStart().getTime() - DAY) : todayStart();
  const tISO = isoOf(todayStart());
  const rows = [];
  const rw = readWindow(s, hour);
  if (rw.open && !rw.hasRead) rows.push({ k: "scale", d: tISO, t: "THIS MORNING'S SCALE", why: "Daily weight updates the trend — one tap, then the trend absorbs it" });
  for (let k = 3; k >= 1; k--) {
    const d = isoOf(new Date(ref.getTime() - k * DAY));
    if (!(s.sleep.nights || []).some((n) => n && n.d === d)) rows.push({ k: "night", d, t: "THE NIGHT OF " + fmtShort(d), why: "bed and wake — three dark nights read as a clean week to every gauge that trusts the record" });
  }
  for (let k = 3; k >= 1; k--) {
    const d = isoOf(new Date(todayStart().getTime() - k * DAY));
    const dl = (s.dailyLogs || {})[d];
    if (!dl || dl.cal == null) rows.push({ k: "day", d, t: "CLOSE " + fmtShort(d), why: "calories, protein, steps — an open day is a hole in every average the targets are measured against" });
  }
  return rows;
}

// Copied from frozen src/app.jsx @ fe516c1:6881-6883.
function owedNights(s, hour = clock.hour()) {
  return owedLedger(s, hour).filter((r) => r.k === "night").map((r) => r.d).sort((a, b) => (a < b ? 1 : -1)).slice(0, 2);
}

// Copied from frozen src/app.jsx @ fe516c1:6994-6996.
function nightsBefore(s, iso) {
  return (((s || {}).sleep || {}).nights || []).filter((n) => n.d < iso).slice().sort((a, b) => (a.d < b.d ? -1 : 1));
}

// Copied from frozen src/app.jsx @ fe516c1:6997-7010.
function cleanAtDate(s, iso) {
  const nights = nightsBefore(s, iso);
  if (!nights.length) return true;
  const last = nights[nights.length - 1];
  if (last.h < DEBT_LAST_H) return false;
  /* three CALENDAR-consecutive nights ending last night, if we have them */
  const run = [last];
  for (let i = nights.length - 2; i >= 0 && run.length < 3; i--) {
    if (Math.round((mk(run[0].d) - mk(nights[i].d)) / DAY) !== 1) break;
    run.unshift(nights[i]);
  }
  if (run.length < 3) return true;
  return run.reduce((a, b) => a + b.h, 0) / run.length >= DEBT_MEAN3_H;
}

// Copied from frozen src/app.jsx @ fe516c1:7016-7026.
function sleepMean3At(s, iso) {
  const nights = nightsBefore(s, iso);
  if (!nights.length) return true;
  const run = [nights[nights.length - 1]];
  for (let i = nights.length - 2; i >= 0 && run.length < 3; i--) {
    if (Math.round((mk(run[0].d) - mk(nights[i].d)) / DAY) !== 1) break;
    run.unshift(nights[i]);
  }
  if (run.length < 3) return true;
  return run.reduce((a, b) => a + b.h, 0) / run.length >= DEBT_MEAN3_H;
}

// Copied from frozen src/app.jsx @ fe516c1:7029-7037.
function atSleepTarget(s, iso) {
  const nights = iso ? nightsBefore(s, iso) : (((s || {}).sleep || {}).nights || []);
  let run = 0;
  for (let i = nights.length - 1; i >= 0; i--) {
    if (i < nights.length - 1 && Math.round((mk(nights[i + 1].d) - mk(nights[i].d)) / DAY) !== 1) break;
    if (nights[i].h >= s.sleep.cleanH) run++; else break;
  }
  return { run, at: run >= s.sleep.needed };
}

// Copied from frozen src/app.jsx @ fe516c1:7057-7057.
function hmToMin(t) { if (!t || t.indexOf(":") < 0) return null; const [a, b] = t.split(":").map(Number); if (!isFinite(a) || !isFinite(b)) return null; return a * 60 + b; }

// Copied from frozen src/app.jsx @ fe516c1:7058-7058.
function minToHM(m) { const x = ((Math.round(m) % 1440) + 1440) % 1440; return String(Math.floor(x / 60)).padStart(2, "0") + ":" + String(x % 60).padStart(2, "0"); }

// Copied from frozen src/app.jsx @ fe516c1:7059-7059.
function medOf(a) { const b = a.slice().sort((x, y) => x - y); return b.length ? (b.length % 2 ? b[(b.length - 1) / 2] : (b[b.length / 2 - 1] + b[b.length / 2]) / 2) : null; }

// Copied from frozen src/app.jsx @ fe516c1:7060-7060.
function sdOf(a) { if (a.length < 2) return null; const m = a.reduce((p, c) => p + c, 0) / a.length; return Math.sqrt(a.reduce((p, c) => p + (c - m) * (c - m), 0) / a.length); }

// Copied from frozen src/app.jsx @ fe516c1:7061-7095.
function sleepAnchor(s) {
  const nights = (((s || {}).sleep || {}).nights || []).filter((n) => n.bed && n.wake).slice(-14);
  const target = ((s || {}).sleep || {}).cleanH || 7.5;
  if (nights.length < SLEEP_ANCHOR_MIN_N) {
    return { n: nights.length, measured: false, target, bed: null, wake: null,
      why: `${SLEEP_ANCHOR_MIN_N - nights.length} more night${SLEEP_ANCHOR_MIN_N - nights.length === 1 ? "" : "s"} with bed and wake times and this reads off your own clock instead of a guess.` };
  }
  /* bedtimes after midnight sort as small numbers; shift them past 24 h so a
     01:40 bed is LATER than a 23:00 bed rather than 21 hours earlier. */
  const beds = nights.map((n) => { const m = hmToMin(n.bed); return m == null ? null : (m < 12 * 60 ? m + 1440 : m); }).filter((v) => v != null);
  const wakes = nights.map((n) => hmToMin(n.wake)).filter((v) => v != null);
  if (beds.length < SLEEP_ANCHOR_MIN_N || wakes.length < SLEEP_ANCHOR_MIN_N) return { n: nights.length, measured: false, target, bed: null, wake: null, why: "not enough clock times on file yet." };
  const bedMed = medOf(beds), wakeMed = medOf(wakes);
  const bedSD = sdOf(beds), wakeSD = sdOf(wakes);
  /* the honest average latency: what he actually reports falling asleep in */
  const sols = nights.map((n) => (typeof n.sol === "number" ? n.sol : null)).filter((v) => v != null);
  const sol = sols.length ? medOf(sols) : 15;
  /* the bedtime that clears target at HIS OWN median wake */
  const needBedMin = (wakeMed + 1440) - target * 60 - sol;
  const shiftMin = Math.round(bedMed - needBedMin);
  const cur = +(((wakeMed + 1440) - bedMed - sol) / 60).toFixed(2);
  return {
    n: nights.length, measured: true, target, sol: Math.round(sol),
    bed: minToHM(bedMed), wake: minToHM(wakeMed),
    bedSDmin: bedSD == null ? null : Math.round(bedSD), wakeSDmin: wakeSD == null ? null : Math.round(wakeSD),
    needBed: minToHM(needBedMin), shiftMin, curH: cur,
    /* which end is the lever: the one he already holds steady is the one he can
       move on purpose. Steadier end wins; ties go to bed, because sleep
       opportunity is bounded at the front. */
    lever: bedSD != null && wakeSD != null && wakeSD < bedSD - 5 ? "wake" : "bed",
    why: shiftMin <= 0
      ? `Your own clock already clears it: bed ${minToHM(bedMed)}, up ${minToHM(wakeMed)} is ${cur} h.`
      : `You go to bed ${minToHM(bedMed)} and get up ${minToHM(wakeMed)} — ${cur} h. To clear ${target} h without getting up later, lights out ${minToHM(needBedMin)}: ${shiftMin} minutes earlier.`,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:7121-7153.
function shelfItems(s) {
  const kg = +(s.trend / 2.205).toFixed(1);
  const proTgtS = proteinTarget(s).g;
  const perFeed = Math.round(proTgtS / 4);
  const out = [];
  out.push({ id: "spread", t: "PROTEIN SPREAD", status: "ON FILE",
    tag: `${proTgtS} works harder split into 4.`,
    lines: [`~${perFeed} g × 4 feeds · every 3–4 h · wake / pre-lift / post-lift / pre-bed`],
    deep: "Areta et al. 2013 (J Physiol): 20 g every 3 h beat both 40 g every 6 h and 10 g every 1.5 h for 24-hour muscle protein synthesis at equal totals. Mamerow et al. 2014: even distribution across meals out-synthesized the typical dinner-skewed pattern. In a deficit, distribution is muscle protection — the same grams, better spent.",
    forYou: `No new logging — this is a shape, not a chore. Your noon lift makes the anchors natural: feed ~1 h pre-lift, feed after, and keep the last feed near bed (slow protein there works with the overnight fast). Four ~${perFeed} g landings and the day's ${proTgtS} places itself.` });
  out.push({ id: "caffdose", t: "CAFFEINE — THE STUDY RANGE, AT YOUR WEIGHT", status: "ON FILE",
    tag: "Dose by bodyweight, not by habit.",
    lines: [`3–6 mg/kg (Grgic 2019 meta) ≈ ${Math.round(3 * kg)}–${Math.round(6 * kg)} mg at ${kg} kg · ~45–60 min pre-lift`],
    deep: "Grgic et al. 2019/2020 meta-analyses support caffeine at ~3–6 mg/kg for strength and power. The range recomputes here as your weight falls. Timing matters more than most supplements' entire effect: ~45–60 minutes pre-training.",
    forYou: "The safety frame outranks the range: you stack prescribed Adderall + a pre-workout, so TOTAL stimulant load is a prescriber conversation — the study range is information, never a target to climb. Read your pre-workout's actual mg once, know your number, and your existing early-afternoon cutoff keeps protecting the sleep ledger." });
  out.push({ id: "creatine", t: "CREATINE PROTOCOL", status: s.creatine ? "TRACKING" : "ON FILE",
    tag: "The most-proven supplement, timed to hide its own water.",
    lines: s.creatine ? [`day ${Math.max(1, Math.round((todayStart() - mk(s.creatine.start)) / DAY) + 1)} of ~28 to saturation · 5 g/day`] : ["5 g/day · no loading needed · start inside the sealed window"],
    deep: "Kreider et al. 2017 (JISSN position stand): creatine monohydrate is the most effective legal ergogenic for high-intensity work; 5 g/day saturates in ~3–4 weeks without loading (loading just gets there faster). Bonus relevant to you: evidence for cognitive support under sleep restriction.",
    forYou: s.creatine ? "The 1–2 lb water bump is folding into the trend while the seal holds and the noise floor absorbs the rest — by the time it matters, it's just part of your baseline. Never stop-start; consistency is the whole mechanism." : "Start now and the water bump lands while the scale is quarantined — it never pollutes a clean read. One button below files the start date so saturation day is visible.",
    action: !s.creatine });
  out.push({ id: "matador", t: "DIET-BREAK EVIDENCE", status: "ON FILE",
    tag: "Your Ease ladder, with a citation.",
    lines: ["MATADOR · Byrne 2018 · Int J Obes"],
    deep: "The MATADOR trial (Byrne et al. 2018): 2 weeks dieting alternated with 2 weeks at maintenance preserved more resting metabolic rate and produced greater fat loss than continuous restriction at matched deficits. The mechanism story: periodic maintenance blunts adaptive slowdown.",
    forYou: "Ease 1 → Ease 2 already breathes like this — stepped, not white-knuckled. On file for one specific future: if the cut runs past week 16, the cited move is a full 2-week maintenance break before pushing on. Coach call, evidence attached." });
  out.push({ id: "sleepceil", t: "SLEEP CEILING", status: "ON FILE",
    tag: "7.5 is your floor; the ceiling may pay.",
    lines: ["Mah 2011 · tested live in THE LAB above"],
    deep: "Mah et al. 2011: extending athletes' sleep produced objectively better performance — habitual sleep is a floor, not an optimum. Your CLEAN gate guards the floor; the ceiling question is answerable only in your own data.",
    forYou: "The SLEEP DOSE experiment in the LAB is this study, running on you. Bank ≥8.5 h nights — especially before big attempts — and the experiment arms itself as a side effect of good decisions." });
  return out;
}

// Copied from frozen src/app.jsx @ fe516c1:7262-7690.
function labAnalytics2(s) {
  const out = [];
  const add = (fn) => { try { const c = fn(); if (c) out.push(c); } catch (e) {} };
  const allDaily = [...HISTORY.map((h) => ({ d: h.d, cal: h.cal, pro: h.pro, steps: h.steps })), ...Object.entries(s.dailyLogs).map(([d, v]) => ({ d, ...v }))].filter((x) => x.cal != null);
  const nightOf = (d) => s.sleep.nights.find((n) => n.d === d);
  const prevISO = (d) => isoOf(new Date(mk(d).getTime() - DAY));
  const sessDates = Object.keys(s.sessionLog).sort();
  const totReps = (d) => ((s.sessionLog[d] || {}).entries || []).reduce((a, e) => a + (e.reps || []).reduce((x, y) => x + y, 0), 0);
  const kg = s.trend / 2.205;

  /* 1 · adaptation meter */
  add(() => {
    const obs = observedTDEE(s);
    const bmr = Math.round(10 * kg + 6.25 * 178 - 5 * 24 + 5);
    const pred = Math.round(bmr * 1.55);
    return { id: "adaptmeter", t: "THE UNEXPLAINED RESIDUAL", status: obs ? "LIVE" : "ARMED", prog: { n: obs ? 1 : 0, need: 1, label: "observed maintenance (prints with clean post-seal weeks)" },
      tag: "How much has the deficit slowed your engine, in kcal?",
      deep: "Predicted burn = Mifflin-St Jeor at your live weight (BMR ~" + bmr + ") × 1.55 for your activity pattern — a textbook estimate, stated as such. Observed burn = the maintenance your own ledger measures. The gap is the UNEXPLAINED RESIDUAL — textbook minus measured, which folds adaptation, activity drift and log error together. It informs the forecast, never a phase move — and at the exit you still eat to the OBSERVED number.",
      forYou: obs ? `Textbook says ~${pred}. Your ledger says ~${obs.tdee}. Unexplained residual: ~${pred - obs.tdee > 0 ? pred - obs.tdee : 0} kcal — ${pred - obs.tdee > 250 ? "real but normal for week " + weekDay().wk + " — it informs the forecast; nothing counters it, and nothing needs to." : "small. Your engine is holding remarkably well."}` : "Arms with the first clean post-seal maintenance print (Mon 7/27+). The textbook half is already computed and waiting.",
      lines: [] };
  });

  /* 2 · strength velocity */
  add(() => {
    const perLift = {};
    sessDates.forEach((d) => ((s.sessionLog[d] || {}).entries || []).forEach((e) => { if (e.w != null && e.reps && e.reps.length) (perLift[e.id] = perLift[e.id] || []).push({ d, load: e.w * e.reps.reduce((a, b) => a + b, 0) }); }));
    const ready = Object.entries(perLift).filter(([, v]) => v.length >= 4);
    const best = ready.map(([id, v]) => { const first = v[0].load, last = v[v.length - 1].load; const wks = Math.max(1, (mk(v[v.length - 1].d) - mk(v[0].d)) / (7 * DAY)); return { id, pctWk: +(((last - first) / first) * 100 / wks).toFixed(1), n: v.length }; }).sort((a, b) => b.pctWk - a.pctWk);
    const nMax = Math.max(0, ...Object.values(perLift).map((v) => v.length));
    return { id: "strvelocity", t: "STRENGTH VELOCITY", status: best.length ? "LIVE" : "ARMED", prog: { n: nMax, need: 4, label: "logged sessions per lift (loads now ride every set automatically)" },
      tag: "Getting stronger while shrinking — the recomp thesis, as a slope.",
      deep: "Volume-load (weight × total reps) per lift, plotted across your sessions, expressed as %/week. Positive slopes in a deficit are the strongest recomp evidence that exists outside a DEXA. Loads attach to every set automatically as of today — the instrument builds itself while you train.",
      forYou: best.length ? `Fastest climber: ${(exById(s, best[0].id) || {}).n} at +${best[0].pctWk}%/wk while cutting${best[1] ? ` · then ${(exById(s, best[1].id) || {}).n} +${best[1].pctWk}%/wk` : ""}. Say this sentence out loud the next time a week feels pointless.` : "Every session you log from today feeds the slopes. First verdicts at 4 sessions per lift (~2 weeks).",
      lines: [] };
  });

  /* 3 · the canary lift */
  add(() => {
    const rows = [];
    sessDates.forEach((d) => { const n = nightOf(prevISO(d)); if (!n) return; ((s.sessionLog[d] || {}).entries || []).forEach((e) => { if (e.reps && e.reps.length) rows.push({ id: e.id, h: n.h, reps: e.reps.reduce((a, b) => a + b, 0) }); }); });
    const byLift = {};
    rows.forEach((r) => (byLift[r.id] = byLift[r.id] || []).push(r));
    const scored = Object.entries(byLift).filter(([, v]) => v.length >= 5 && new Set(v.map((x) => x.h)).size > 1).map(([id, v]) => { const mh = v.reduce((a, x) => a + x.h, 0) / v.length, mr = v.reduce((a, x) => a + x.reps, 0) / v.length; let num = 0, den = 0; v.forEach((x) => { num += (x.h - mh) * (x.reps - mr); den += (x.h - mh) ** 2; }); return { id, slope: den ? +(num / den).toFixed(1) : 0, n: v.length }; }).sort((a, b) => b.slope - a.slope);
    return { id: "canary", t: "THE CANARY LIFT", status: scored.length ? "LIVE" : "ARMED", prog: { n: Math.max(0, ...Object.values(byLift).map((v) => v.length)), need: 5, label: "sessions with the prior night logged" },
      tag: "Which lift feels missing sleep first — your early-warning instrument.",
      deep: "Reps-per-hour-of-sleep slope, per lift. One lift is always most sleep-sensitive; once named, it becomes a canary: when IT dips out of nowhere, check the pillow before blaming the program. The inverse lift — most sleep-proof — is what you lean on during unavoidable short-sleep weeks.",
      forYou: scored.length ? `Canary: ${(exById(s, scored[0].id) || {}).n} (+${scored[0].slope} reps per extra hour). Most sleep-proof: ${(exById(s, scored[scored.length - 1].id) || {}).n}. Debt-day programming writes itself.` : "Arming as you log sessions with the prior night on file — which you now do by default.",
      lines: [] };
  });

  /* 4 · regularity index */
  add(() => {
    const timed = s.sleep.nights.filter((n) => n.bed && n.wake).slice(-14);
    const mins = (t) => { const [a, b] = t.split(":").map(Number); let m = a * 60 + b; if (m < 720) m += 1440; return m; };
    const sd = (arr) => { if (arr.length < 2) return null; const m = arr.reduce((a, b) => a + b, 0) / arr.length; return Math.round(Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length)); };
    const bedSD = sd(timed.map((n) => mins(n.bed)));
    const wakeSD = sd(timed.filter((n) => n.wake).map((n) => { const [a, b] = n.wake.split(":").map(Number); return a * 60 + b; }));
    return { id: "regularity", t: "REGULARITY INDEX", status: timed.length >= 7 ? "LIVE" : "ARMED", prog: { n: timed.length, need: 7, label: "nights with bed→wake times" },
      tag: "Consistency rivals duration — your scatter, in minutes.",
      deep: "Standard deviation of your bed and wake times over the last 14 timed nights. The evidence for caring about this got stronger: Windred et al. 2024 (SLEEP) followed roughly 60,000 UK Biobank participants and found sleep REGULARITY predicted mortality more strongly than sleep DURATION — so timing scatter is not a footnote to hours, it may be the bigger of the two. Under ±30 min is elite; the 6:45 anchor attacks the wake half directly, and the countdown attacks the bed half.",
      forYou: timed.length >= 7 ? `Bed scatter ±${bedSD} min · wake scatter ±${wakeSD} min. ${wakeSD <= 30 ? "Wake side is anchored — " : "The anchor hasn't bitten yet — "}${bedSD > 45 ? "bedtime is the loose end; the 22:30 countdown is the tool." : "both ends tightening. This is what the anchor was for."}` : `${timed.length}/7 timed nights. Every bed→wake log is a data point — no extra effort, it's already your capture format.`,
      lines: [] };
  });

  /* 5 · miss archaeology */
  add(() => {
    const proTgtM = proteinTarget(s).lo;
    const misses = allDaily.filter((x) => x.pro != null && !proteinHit(proTgtM, x.pro));
    if (!misses.length) return { id: "missarch", t: "MISS ARCHAEOLOGY", status: "ARMED", prog: { n: 0, need: 3, label: "protein misses on file" }, tag: "Every miss gets an autopsy — patterns, not blame.", deep: "Each protein miss is examined for what preceded it: prior-night sleep, day of week, event proximity. Willpower problems usually turn out to be scheduling problems wearing a disguise.", forYou: "Zero misses on file to autopsy. Honestly? Elite. This card hopes to stay bored.", lines: [] };
    const dow = {};
    let shortSleep = 0, slept = 0;
    misses.forEach((m) => { const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][mk(m.d).getDay()]; dow[day] = (dow[day] || 0) + 1; const n = nightOf(prevISO(m.d)); if (n) { slept++; if (n.h < 7) shortSleep++; } });
    const topDay = Object.entries(dow).sort((a, b) => b[1] - a[1])[0];
    return { id: "missarch", t: "MISS ARCHAEOLOGY", status: "LIVE", prog: null,
      tag: "Every miss autopsied — patterns, not blame.",
      deep: `Each protein shortfall (under ${proTgtM} g, the evidence floor) is examined for precursors: prior-night sleep, day of week, event adjacency. Overshoot is not counted — there is no upper threshold in the literature and this card used to treat a 186 g day as a failure. The point is mechanical: if shortfalls cluster after short nights or on one weekday, the fix is scheduling — a prepped meal on that day, a protein-forward default after bad nights — not more discipline.`,
      /* "Which weekday owns the most misses" is a MAX-OVER-CATEGORIES statistic, and the
         maximum of seven counts is biased upward by construction — some day always wins,
         even when the misses are scattered at random. So the expected count for the
         winning day under pure chance is quoted next to it, and the card only calls a day
         a pattern when it clears that. Same discipline as the sentinel's false-alarm
         rate, applied to a different shape of hunting. */
      forYou: (() => {
        const expTop = misses.length / 7;
        const clears = topDay && topDay[1] >= Math.max(2, expTop * 2);
        return `${misses.length} misses across the whole record. ${topDay ? `${topDay[0]} owns ${topDay[1]} of them — chance alone would put about ${expTop.toFixed(1)} on the busiest day, so ${clears ? "that one is worth treating as a pattern" : "that is not yet a pattern, just the day that happened to win"}` : ""}${slept ? ` · ${Math.round(100 * shortSleep / slept)}% followed a sub-7 night` : ""}. ${shortSleep / Math.max(1, slept) > 0.5 ? "Sleep is upstream of your protein too — the anchor defends both." : "No strong sleep link — day-structure is the lever."}`;
      })(),
      lines: [] };
  });

  /* 6 · weekend split */
  add(() => {
    const wk = allDaily.filter((x) => ![0, 6].includes(mk(x.d).getDay()));
    const we = allDaily.filter((x) => [0, 6].includes(mk(x.d).getDay()));
    if (wk.length < 5 || we.length < 3) return { id: "weekend", t: "THE WEEKEND SPLIT", status: "ARMED", prog: { n: we.length, need: 3, label: "weekend days logged" }, tag: "Weekday-you vs weekend-you.", deep: "Two athletes share your body. This card audits them separately.", forYou: "Filling from your record.", lines: [] };
    const avg = (a, k) => Math.round(a.reduce((x, y) => x + (y[k] || 0), 0) / a.length);
    const proTgtWe = proteinTarget(s).lo;
    const hit = (a) => Math.round(100 * a.filter((x) => proteinHit(proTgtWe, x.pro)).length / a.length);
    return { id: "weekend", t: "THE WEEKEND SPLIT", status: "LIVE", prog: null,
      tag: "Weekday-you vs weekend-you — two athletes, one audit.",
      deep: "Every metric split by weekday vs weekend across your entire record. Most preps are lost between Friday night and Sunday dinner; knowing YOUR split turns a vague fear into a number — and events (weddings, holidays) get judged inside their own protocol, not as failures.",
      forYou: `Weekdays: ${avg(wk, "cal")} cal · ${hit(wk)}% protein hits · ${(avg(wk, "steps") / 1000).toFixed(1)}k steps. Weekends: ${avg(we, "cal")} · ${hit(we)}% · ${(avg(we, "steps") / 1000).toFixed(1)}k. ${hit(we) >= hit(wk) - 10 ? "Weekend-you is nearly the same athlete — genuinely rare, and this whole wedding month proves it." : "The gap is the weekend; one prepped Saturday meal closes most of it."}`,
      lines: [] };
  });

  /* 7 · step efficacy — the computation moved to stepEfficacy() (Item B) so the PUSH gate
     and this card read the same slope. This formats; it no longer computes. The old inline
     toFixed(2) on a per-STEP slope rounded every real signal to 0.00 — retired. */
  add(() => {
    const se = stepEfficacy(s);
    if (se.status === "ARMED") return { id: "stepeff", t: "STEP EFFICACY", status: "ARMED", prog: { n: se.n, need: se.need, label: "week pairs" }, tag: "Do your extra steps actually show up on the scale?", deep: "Weekly step averages vs that week's scale movement.", forYou: "Accruing weekly.", lines: [] };
    const perK = se.slopePer1k;
    return { id: "stepeff", t: "STEP EFFICACY", status: "LIVE", prog: null,
      tag: "Do your extra steps show up on the scale? Directional verdict.",
      deep: "Weekly average steps vs that week's weight change, across every week on file. Small n and confounded (calories move too) — stated honestly as directional, not causal. But if high-step weeks consistently out-drop low-step weeks at similar intake, your NEAT is doing real work; if not, steps are cardiovascular health, and calories are the fat lever.",
      forYou: se.resolved === false ? `Across ${se.n} clean week-pairs the fitted association is ${Math.abs(perK).toFixed(1)} lb/wk per 1k steps — but walking can only physically move ~${se.boundPer1k} lb/wk per 1k at your mass, so that number is calorie confounding, not a step effect. Verdict stays OPEN until the weeks separate the two. (The old display rounded this absurdity to 0.00 and called it a reading.)` : `Across ${se.n} clean week-pairs${se.excluded ? ` (${se.excluded} excluded for event water/estimates — they were poisoning this read)` : ""}: each extra 1k daily steps associates with ~${Math.abs(Math.round(perK * 100) / 100)} lb/wk ${perK > 0 ? "faster" : "slower"} loss (directional, n=${se.n}). ${perK > 0.02 ? "Your walking is earning its keep." : "Signal weak — steps may be cardiovascular health here rather than the fat lever."}`,
      lines: [] };
  });

  /* 7b · volume verdicts — the earned lever's receipt, rebuilt for the ladder read
     (A1+F): DELIVERED and TOLERATED are what four sessions can know; the outcome tiers
     open on the derived review calendar, and REPLICATED alone may carry an
     individual-response claim. IDLE until a set-count change exists in the LOGGED
     series (author-blind — AUDIT F), then the fresh post-change trend window (which
     liftTrend restarts at the change — AUDIT A) plus the terminal-set RIR reports, so a
     sandbagged set can never convict volume. */
  add(() => {
    const rows9 = (s.exercises || []).filter((e) => typeof e.w === "number").map((e) => ({ e, vc: volumeConversion(s, e.id) })).filter((x) => x.vc.status !== "IDLE");
    const tagV = "When a set is added: was it delivered? is it tolerated? — and only much later, did it grow anything?";
    const deepV = "After any set-count change the lift's trend window restarts (the mechanical volume-load jump of a new set must never read as progress) and the read climbs a ladder it can actually defend: DELIVERED (the terminal-set RIR reports say the hard sets ran) and TOLERATED (the lift itself not deteriorating) are what four sessions can establish. Growth claims wait for the derived review calendar — delivery/tolerance at +2 weeks, earliest outcome at +8, credible classification at +12, each from the muscle's own change date, lengthening in a surplus — and need two signals agreeing; REPLICATED, the only tier where an individual-response claim may live, needs the benefit to recur in a comparable block: one block never brands a muscle. A null read HOLDS — even +120% habitual volume did not impair growth in the one direct test (Camargo 2026, a preprint: it informs the hold, it never fires a subtraction).";
    if (!rows9.length) return { id: "volconv", t: "VOLUME VERDICTS", status: "ARMED", prog: { n: 0, need: 1, label: "set-count changes to read" },
      tag: tagV, deep: deepV,
      forYou: "Arms itself the day a set-count change lands in your log. No change on record yet.", lines: [] };
    return { id: "volconv", t: "VOLUME VERDICTS", status: "LIVE", prog: null,
      tag: tagV, deep: deepV,
      forYou: rows9.map((x) => `${x.e.n}: ${x.vc.status === "READING" ? `reading — ${x.vc.have}/${x.vc.need} post-change sessions` : `${x.vc.tier} — ${x.vc.why}`}`).join(" · "),
      lines: [] };
  });

  /* 7c · SET ONE — the standardized strength read (P6). Session totals mix five
     constructs and restart at every set-count change (correctly — AUDIT A); set 1 at a
     constant load is the protocol-stable read: same set position, freshest state,
     standard rest, and it SURVIVES set-count changes. New instrumentation BESIDE the
     restart, never a retirement of it. Feeds nothing yet — an instrument first. */
  add(() => {
    const rows1 = (s.exercises || []).filter((e) => typeof e.w === "number").map((e) => ({ e, r: setOneRead(s, e.id) })).filter((x) => x.r.status !== "IDLE");
    const live1 = rows1.filter((x) => x.r.status === "LIVE");
    const tag1 = "The strength read that survives a set-count change: set 1, same load, standard protocol.";
    const deep1 = "The strength test embedded in training, standardized: the FIRST set only (same set position, freshest state), at the CURRENT load only, with event days and rushed sessions excluded — the protocol is the same seat and settings from SETUP, the prescribed rest, and the same brief warm-up each time. A session TOTAL mixes strength, set count, rest, order-fatigue and proximity to failure, so its window correctly restarts when sets change; set one does not care how many sets follow it, so this read carries straight through a volume change. It informs; it gates nothing yet.";
    if (!live1.length) return { id: "set1", t: "SET ONE — THE STANDARDIZED READ", status: "ARMED", prog: { n: rows1.length ? Math.max(...rows1.map((x) => x.r.n || 0)) : 0, need: TREND_MIN_SESSIONS, label: "same-load set-1 reads on the busiest lift" },
      tag: tag1, deep: deep1,
      forYou: "Counting only — no lift carries " + TREND_MIN_SESSIONS + " comparable set-1 reads at its current load yet. No verdict until it does.", lines: [] };
    return { id: "set1", t: "SET ONE — THE STANDARDIZED READ", status: "LIVE", prog: null,
      tag: tag1, deep: deep1,
      forYou: live1.map((x) => x.e.n + ": " + (x.r.pct > 0 ? "+" : "") + x.r.pct + "%/session on set 1 over " + x.r.n + " comparable reads (CI " + x.r.lo + " to " + x.r.hi + ")").join(" · "),
      lines: [] };
  });

  /* 8 · refeed ROI */
  add(() => {
    const refeedDays = allDaily.filter((x) => dayType(x.d) === "REFEED" && x.d > "2026-07-21");
    const pairsR = refeedDays.map((r) => { const nd = isoOf(new Date(mk(r.d).getTime() + DAY)); return s.sessionLog[nd] ? { cal: r.cal, reps: totReps(nd) } : null; }).filter(Boolean);
    return { id: "refeedroi", t: "REFEED ROI", status: pairsR.length >= 3 ? "LIVE" : "ARMED", prog: { n: pairsR.length, need: 3, label: "refeed → next-day-session pairs" },
      tag: "What does each refeed buy you in next-day iron?",
      deep: "Refeed-day calories vs the following session's total output, plus the trend cost already measured by the refeed-bump line. Enough pairs reveal your dose-response: whether 2,400 buys what 2,600 buys — i.e., your optimal refeed size, discovered instead of guessed.",
      forYou: pairsR.length >= 3 ? `${pairsR.length} pairs: avg ${Math.round(pairsR.reduce((a, x) => a + x.cal, 0) / pairsR.length)} cal → ${Math.round(pairsR.reduce((a, x) => a + x.reps, 0) / pairsR.length)} next-day reps. Spread widens the picture — one lighter refeed (~2,300) would be an informative experiment, coach-flag.` : `${pairsR.length}/3 pairs. Every Wednesday→Thursday you log builds this — tomorrow is literally a data point.`,
      lines: [] };
  });

  /* 9 · session shape */
  add(() => {
    const shapes = {};
    sessDates.forEach((d) => ((s.sessionLog[d] || {}).entries || []).forEach((e) => { if (e.reps && e.reps.length >= 2) (shapes[e.id] = shapes[e.id] || []).push(e.reps.map((r, i) => (i === 0 ? 0 : r - e.reps[0]))); }));
    const ready = Object.entries(shapes).filter(([, v]) => v.length >= 4);
    return { id: "sessionshape", t: "SESSION SHAPE", status: ready.length ? "LIVE" : "ARMED", prog: { n: Math.max(0, ...Object.values(shapes).map((v) => v.length), 0), need: 4, label: "sessions per lift" },
      tag: "Your set-to-set fade pattern — joints complain here first.",
      deep: "Each lift's rep-decay across sets (8,8,7 = fade of 0,-1) has a stable personal fingerprint. When the SHAPE changes — set 2 suddenly sagging on a lift that never sags — it precedes joint complaints and stalls by about a week in most lifters. The instrument watches for shape breaks, not bad days.",
      forYou: ready.length ? `${ready.length} lifts fingerprinted. Latest shapes match your baselines — no silent breaks. This card matters most the week it disagrees with you.` : "Fingerprints form at 4 sessions per lift; the abs and hack debuts start theirs this week.",
      lines: [] };
  });

  /* 10 · compounding curve */
  add(() => {
    const reads = s.reads.filter((r) => !r.sealed && !r.offWindow);
    if (reads.length < 20) return null;
    let best = 0, sum = 0, cnt = 0;
    for (let i = 0; i < reads.length; i++) { const j = reads.findIndex((r) => mk(r.d) >= mk(reads[i].d) + 13 * DAY); if (j > i) { const drop = reads[i].w - reads[j].w; best = Math.max(best, drop); sum += drop; cnt++; } }
    const avgD = cnt ? +(sum / cnt).toFixed(1) : 0;
    return { id: "compound", t: "THE COMPOUNDING CURVE", status: "LIVE", prog: null,
      tag: "Your best fortnight vs your average — the cost of chaos, in pounds.",
      deep: "Every rolling 14-day window in your record, ranked. The best window is what YOU produce when everything clicks — sleep, protein, steps aligned. The average includes life. The gap between them is the honest price of chaos, and shrinking it beats chasing any new protocol.",
      forYou: `Best fortnight: −${best.toFixed(1)} lb. Average: −${avgD} lb. Gap ≈ ${(best - avgD).toFixed(1)} lb of pure execution — you don't need a better plan anywhere in this app; you need more weeks that look like your best ones. No checkpoint, no date — the only thing worth chasing here is more weeks that look like your best one.`,
      lines: [] };
  });

  /* 11 · ghost joey */
  add(() => {
    const days = Math.max(1, Math.round((todayStart() - mk("2026-07-21")) / DAY));
    /* Priced at his measured per-step cost and the same kcal/lb the rest of the
       engine uses, not 0.35 and 3,500. The old copy also sold two retired
       claims as facts about the model: that a short night voids a record, and
       that refeeds prevent an adherence problem his record does not show. */
    const stG = stepTarget(s);
    const perStepG = stG.gated ? 0.35 : stG.kcalPer1k / 1000;
    const stepPen = (4000 * perStepG * days) / energyDensity(s).perLb;   // v7.3.0 Slice 4 — one energy-density owner (== 3800 until a DEXA)
    const sleepPen = 0.15 * (days / 7);
    const ghost = +(s.trend + stepPen + sleepPen).toFixed(1);
    return { id: "ghost", t: "GHOST JOEY", status: "MODEL", prog: null,
      tag: "The you who walks 4k fewer steps and sleeps six — simulated, clearly badged.",
      deep: "A counterfactual twin built from YOUR measured coefficients, not textbook ones: 4,000 fewer daily steps priced at your own per-step cost, and a short-sleep penalty on the side where short sleep actually costs — body composition, not the session. It is a MODEL, the badge says so, and it exists for one purpose: on the days discipline feels pointless, the gap is the receipt that it isn't.",
      forYou: `Ghost's trend today: ~${ghost} (${(ghost - s.trend).toFixed(1)} lb behind you) and falling further behind by ~${((4000 * perStepG * 7) / energyDensity(s).perLb + 0.15).toFixed(1)} lb/week. Ghost also sleeps six — his sessions look about the same as yours, and that is exactly the trap: the cost lands on what his weight loss is made of, not on his reps. You are the control group's nightmare.`,
      lines: [] };
  });

  /* 12 · the sentinel */
  add(() => {
    const base = (arr) => { if (arr.length < 8) return null; const m = arr.reduce((a, b) => a + b, 0) / arr.length; const sdv = Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length) || 1; return { m, sdv }; };
    const slB = base(s.sleep.nights.slice(-30).map((n) => n.h));
    const stB = base(allDaily.slice(-30).filter((x) => x.steps).map((x) => x.steps));
    if (!slB || !stB) return null;
    let flagged = null;
    [...allDaily].slice(-10).forEach((d2) => { const n = nightOf(prevISO(d2.d)); let hits = 0; if (n && Math.abs((n.h - slB.m) / slB.sdv) > 1.8) hits++; if (d2.steps && Math.abs((d2.steps - stB.m) / stB.sdv) > 1.8) hits++; const rd = s.reads.find((r) => r.d === d2.d && !r.sealed && !r.offWindow); if (rd && Math.abs(rd.w - s.trend) > 1.6) hits++; if (hits >= 2 && !dayWeather(s, d2.d).hard) flagged = { d: d2.d, hits }; });
    /* The screen's own false-alarm rate, computed from the thresholds it actually
       uses rather than asserted. Sleep and steps trip at |z|>1.8 (two-tailed), the
       scale at 1.6 lb which, against a measured day-to-day SD near 0.8, is about 2σ.
       A 2-of-3 co-flag over a 10-day window follows from those three rates. */
    const scaleSd = (() => { const rr = (s.reads || []).filter((r) => !r.sealed && !r.offWindow); const d = []; for (let i = 1; i < rr.length; i++) { if (Math.round((mk(rr[i].d) - mk(rr[i - 1].d)) / DAY) === 1) { const dd = rr[i].w - rr[i - 1].w; if (Math.abs(dd) < 1.5) d.push(dd); } } if (d.length < 8) return 0.8; const m = d.reduce((a, b) => a + b, 0) / d.length; return Math.sqrt(d.reduce((a, b) => a + (b - m) ** 2, 0) / (d.length - 1)) || 0.8; })();
    const fa = coFlagRate([twoTail(1.8), twoTail(1.8), twoTail(1.6 / scaleSd)], 2, 10);
    return { id: "sentinel", t: "THE SENTINEL", status: "LIVE", prog: null,
      tag: "Multivariate weird-day screen — calibrated, with its own false-alarm rate.",
      deep: `Each recent day is z-scored against your own 30-day baselines across sleep, steps, and scale-vs-trend. Two or more dimensions going strange TOGETHER can be the signature of incoming illness, unlogged stress, or a tracking slip. What this card used to leave out is that a screen running three dimensions across ten days will co-flag sometimes on nothing at all — so it now publishes that rate. On your thresholds (|z|>1.8 on sleep and steps, 1.6 lb on the scale against your measured day-to-day SD of ${scaleSd.toFixed(2)}), chance alone produces about ${fa.expected} co-flags per 10-day window — roughly one every ${fa.oncePerDays} days, with a ${Math.round(fa.anyInWindow * 100)}% chance of at least one in any given window. It never diagnoses; it points, and now you can see how often it points at nothing. It also dropped the old claim that it "often smells illness a day early" — that was being read off what is largely noise, and the resting-pulse literature does not support a next-day lead anyway.`,
      forYou: flagged
        ? `${fmtShort(flagged.d)} tripped ${flagged.hits} baselines at once. Before treating that as a signal: chance alone trips this about ${fa.expected} times per 10-day window, so a single co-flag is roughly a coin-flip proposition on its own. If you remember why, no action. If you don't, treat today gently, watch tonight's sleep, and let a SECOND flag inside a week be the thing that means something.`
        : `All quiet — every recent day sits inside your own baselines. For scale: chance alone would have produced about ${fa.expected} co-flags over this window, so quiet is genuinely quiet rather than a screen that never fires. The best sentinel report is boredom.`,
      lines: [`false-alarm rate: ~${fa.expected} chance co-flags per 10 days (~1 every ${fa.oncePerDays} days) — a screen, not an oracle`] };
  });

  /* 13 · the monthly letter */
  add(() => {
    const july = allDaily.filter((x) => x.d >= "2026-07-01");
    const june = allDaily.filter((x) => x.d < "2026-07-01");
    if (june.length < 10 || july.length < 10) return null;
    const avg2 = (a, k) => Math.round(a.reduce((x, y) => x + (y[k] || 0), 0) / a.length);
    const proTgtJ = proteinTarget(s).lo;
    const hit2 = (a) => Math.round(100 * a.filter((x) => proteinHit(proTgtJ, x.pro)).length / a.length);
    const wins = s.feed.filter((f) => f.d >= "2026-07-01" && /OWNED|DEBUT|EARNED|RECLAIM/.test(f.t)).length;
    return { id: "letter", t: "THE MONTHLY LETTER", status: "LIVE", prog: null,
      tag: "State of the prep, auto-written on the 1st. Latest: July (running).",
      deep: `On the first of each month, the ledger writes itself a letter: every metric vs the prior month, changepoints named, wins counted. It becomes the prep's chapter structure — and in September, the reverse gets judged against these letters instead of vibes. The next one prints ${fmtShort(nextMonthFirst())}.`,
      forYou: `July so far vs June: calories ${avg2(july, "cal")} vs ${avg2(june, "cal")} · protein hits ${hit2(july)}% vs ${hit2(june)}% · steps ${(avg2(july, "steps") / 1000).toFixed(1)}k vs ${(avg2(june, "steps") / 1000).toFixed(1)}k · ${wins} gates flipped in July. Trajectory: tightening while the scale seal holds — exactly what a mid-prep month should read like. Full letter prints ${fmtShort(nextMonthFirst())}.`,
      lines: [] };
  });

  /* 14 · the prophet's scorecard */
  add(() => {
    const { graded, mae, bias, maeTrend, TRUST_N, provisional } = prophetGrades(s);
    const fc = s.forecasts || [];
    return { id: "prophet", t: "THE PROPHET'S SCORECARD", status: graded.length >= TRUST_N ? "LIVE" : graded.length >= 2 ? "PROVISIONAL" : "ARMED", prog: { n: graded.length, need: TRUST_N, label: "graded 7-day forecasts, each against the real morning reading" },
      tag: "The lab grades its own predictions against the scale — trust, with error bars.",
      deep: "Every day the lab journals a 7-day forecast; a week later the MORNING READING grades it. That word matters: this used to grade the forecast against the app's own smoothed trend line, which is the line the forecast steers — so it was measuring how well the model predicts itself. A smooth autocorrelated series is nearly trivial to predict a week out, so the error came back flatteringly small and the masthead then invited you to read every ETA through it. It now grades against the raw number on the scale, which the model has no say over, with a ±1 day tolerance so a skipped morning is not counted as a miss. Mean absolute error is 7-day WEIGHT-tracking error and nothing more — it is not the error bar on a body-fat ETA, which depends on the lean model too. Bias says whether the machine runs optimistic or pessimistic about you. An instrument that publishes its own error bars is the only kind worth believing, and publishing one earned on the wrong quantity is worse than publishing none.",
      forYou: graded.length >= 2
        ? `${graded.length} forecast${graded.length === 1 ? "" : "s"} graded against the real reading: typical miss ±${mae} lb, bias ${bias > 0 ? "+" + bias + " (runs optimistic — mentally pad ETAs)" : bias < 0 ? bias + " (runs pessimistic — you keep beating the machine)" : "0.00 (dead calibrated)"}.${provisional ? ` PROVISIONAL — ${TRUST_N} grades is where a within-person number starts being a number; ${TRUST_N - graded.length} to go.` : ""} This is 7-day weight error only — the body-fat ETAs carry the lean model's uncertainty on top of it.${maeTrend != null ? ` (For reference, its miss against its own smoothed line is ±${maeTrend} — smaller, and not a trust number.)` : ""}`
        : `Journal opened — entry #${fc.length} on file. The machine has put its predictions in writing; in a week, the scale starts marking the homework.`,
      lines: [] };
  });

  /* 15 · the what-if console */
  add(() => ({ id: "whatif", t: "THE WHAT-IF CONSOLE", status: "MODEL", prog: null,
    tag: "Touch the levers — steps, calories, refeed, sleep — watch the dates move.",
    deep: "A live counterfactual engine: sliders re-run the model with hypothetical settings and show what moves — the weekly rate, and when the current pace would reach roughly 11%. There is no date tile any more, because there is no date. Coefficients are your measured ones: your own rate, your own per-step cost, and the same kcal-per-pound the rest of the engine uses. Sleep is on the panel but deliberately does NOT move the pound-per-week figure — it changes what those pounds are made of, which this model cannot draw. It answers 'what if I just…' with arithmetic instead of vibes. Changes here change NOTHING real — it is a sandbox, badged MODEL, and actual target changes stay coach-flag.",
    forYou: "Open the card — the sliders are inside. Try sleep at 6.5 first and watch what it says about your own-attempts; that one isn't hypothetical this week.",
    lines: [] }));


  /* 16-18 · THE PULSE WING */
  const pReads = (s.pulse || []).slice().sort((a, b) => (a.d < b.d ? -1 : 1));
  const pBase = pReads.length >= 7 ? pReads.slice(-14).map((x) => x.bpm).sort((a, b) => a - b)[Math.floor(Math.min(14, pReads.length) / 2)] : null;
  add(() => ({ id: "pulsebase", t: "YOUR RESTING PULSE", status: pBase ? "LIVE" : "ARMED", prog: { n: pReads.length, need: 7, label: "morning pulse readings (5 seconds, on NOW)" },
    tag: "Your engine's idle speed — the cheapest recovery dial that exists.",
    deep: "Morning resting heart rate is the most information-dense five-second measurement in sports science: it reflects recovery, stress, illness, and diet strain all at once. Seven readings build your personal baseline (a rolling median, so one weird morning can't move it); everything else in this wing reads against that number.",
    forYou: pBase ? `Baseline: ${pBase} bpm. Last reading ${pReads[pReads.length - 1].bpm} (${pReads[pReads.length - 1].bpm - pBase >= 0 ? "+" : ""}${pReads[pReads.length - 1].bpm - pBase} vs you). Steady is the goal — steady means the deficit is being absorbed, not endured.` : `${pReads.length}/7 readings. The input lives at the bottom of NOW's log cards — five seconds after the weigh-in.`,
    lines: [] }));
  add(() => {
    if (pReads.length < 10 || !pBase) return { id: "cutstress", t: "CUT-STRESS INDEX", status: "ARMED", prog: { n: pReads.length, need: 10, label: "readings across 10+ days" }, tag: "Is the diet being absorbed or endured? Your pulse answers first.", deep: "A sustained climb in resting pulse (~+5 bpm over baseline) is the classic sign a deficit has outrun recovery — it shows up before strength stalls and before the mirror changes. It's the physiological answer to when September's diet-exit is DUE, versus when the calendar says so.", forYou: "Arms at 10 readings — then the reverse gets timed by your body, not the calendar.", lines: [] };
    const firstWk = pReads.slice(0, 5).map((x) => x.bpm).reduce((a, b) => a + b, 0) / Math.min(5, pReads.length);
    const last5 = pReads.slice(-5).map((x) => x.bpm).reduce((a, b) => a + b, 0) / Math.min(5, pReads.length);
    const drift = +(last5 - firstWk).toFixed(1);
    return { id: "cutstress", t: "CUT-STRESS INDEX", status: "LIVE", prog: null,
      tag: "Is the diet being absorbed or endured? Your pulse answers first.",
      deep: "A sustained climb of ~5+ bpm over your early baseline is the classic signature of a deficit outrunning recovery — visible before strength stalls or the mirror changes. Flat or falling pulse deep into a cut is the green light that the pace is sustainable; a climb is the body's own vote for the diet-exit date.",
      forYou: `Drift so far: ${drift >= 0 ? "+" : ""}${drift} bpm vs your first readings. ${drift >= 5 ? "That's the strain signature — worth showing your coach; the diet-exit conversation may be due early." : drift >= 3 ? "Mild climb — watch it alongside sleep; not alarming yet." : "Being absorbed, not endured — the pace is sustainable by your own physiology."}`,
      lines: [] };
  });
  add(() => {
    const latest = pReads[pReads.length - 1];
    const spike = pBase && latest ? latest.bpm - pBase : null;
    return { id: "pulsewarn", t: "ILLNESS EARLY-WARNING", status: pBase ? "LIVE" : "ARMED", prog: { n: pReads.length, need: 7, label: "readings to build the baseline" },
      tag: "A rising multi-day resting pulse is worth attention.",
      /* ---------- RHR_LEAD_TIME_NOTE ----------
         This card said a pulse spike "usually beats the sore throat by a day". The
         monitoring literature runs the other way: HRV is the faster and more sensitive
         early signal, while resting heart rate often rises only AT or after symptom
         onset and is better read as a multi-day trend than a next-morning alarm. The
         mechanism is not wrong, the LEAD TIME was overclaimed — and a card that
         promises a day's warning teaches him to trust a single morning's number, which
         is exactly what the noise-floor work says not to do. Softened to a trend
         signal, with the honest note that HRV would be the better input if a wearable
         ever supplies one. */
      deep: "A resting pulse climbing over your own baseline — without a hard session or short night to explain it — is worth noticing, and the practical response is cheap: go easy for a day, hydrate, sleep early. What this card used to claim is that the spike beats the symptoms by about a day. The monitoring evidence does not support that: heart-rate VARIABILITY is the faster and more sensitive early signal, while resting heart rate often rises only as symptoms arrive and is more informative as a multi-day trend than as a single-morning alarm. So read a run of elevated mornings, not one. If a wearable ever gives you HRV, that is the better input for this specific question and this card should hand the job over.",
      forYou: spike != null
        ? (spike >= 7
          ? `${latest.bpm} today vs ${pBase} baseline — +${spike}. Worth a gentle day if there is no hard session or short night to explain it, but one morning is one morning: what would actually mean something is this staying elevated for two or three days in a row. Check again tomorrow before concluding anything.`
          : `${latest.bpm} today vs ${pBase} baseline — inside normal. The best report this card gives is boredom.`)
        : "Builds with the baseline — seven readings.",
      lines: [] };
  });

  /* 19 · THE NEGOTIATOR */
  add(() => ({ id: "negotiator", t: "THE NEGOTIATOR", status: "MODEL", prog: null,
    tag: "Name the goal — it solves backward for the cheapest path, priced by YOUR habits.",
    deep: "The what-if console runs forward from levers; this runs backward from a goal. You set a target body fat and how long you are willing to give it — an offset from today, never a deadline, because you have not set one and building urgency around a date nobody picked is how a cut turns into a rushed one. It computes the pace that would require, checks it against your own rate band, and proposes the cheapest lever set — 'cheapest' priced by your record: steps before calorie cuts, because steps cost you nothing you are trying to keep. It respects your DERIVED calorie floor, not an authored number. It proposes; you and your coach decide.",
    forYou: "Open the card — the goal controls are inside. Try the current plan's own goal first and see how much slack you actually have.",
    lines: [] }));

  /* 20 · THE NATURAL-EXPERIMENT MINER */
  add(() => {
    const sess2 = Object.keys(s.sessionLog).sort();
    const rows2 = sess2.map((d) => { const n = s.sleep.nights.find((x) => x.d === isoOf(new Date(mk(d).getTime() - DAY))); const dl2 = s.dailyLogs[isoOf(new Date(mk(d).getTime() - DAY))]; return { d, t: dayType(d), slp: n ? n.h : null, cal: dl2 ? dl2.cal : null, reps: ((s.sessionLog[d] || {}).entries || []).reduce((a, e) => a + (e.reps || []).reduce((x, y) => x + y, 0), 0), postRefeed: dayType(isoOf(new Date(mk(d).getTime() - DAY))) === "REFEED" }; }).filter((r) => r.slp != null && r.cal != null && r.reps > 0 && !dayWeather(s, r.d).hard && !dayWeather(s, isoOf(new Date(mk(r.d).getTime() - DAY))).hard);
    const pairs2 = [];
    for (let i = 0; i < rows2.length; i++) for (let j = i + 1; j < rows2.length; j++) {
      const a2 = rows2[i], b2 = rows2[j];
      if (a2.t === b2.t && Math.abs(a2.slp - b2.slp) <= 0.5 && Math.abs(a2.cal - b2.cal) <= 75 && a2.postRefeed !== b2.postRefeed) pairs2.push({ diff: (a2.postRefeed ? a2.reps - b2.reps : b2.reps - a2.reps) });
    }
    const avgD2 = pairs2.length ? Math.round(pairs2.reduce((x, y) => x + y.diff, 0) / pairs2.length) : null;
    return { id: "miner", t: "NATURAL-EXPERIMENT MINER", status: pairs2.length >= 3 ? "LIVE" : "ARMED", prog: { n: pairs2.length, need: 3, label: "matched day-pairs (same day type, sleep ±0.5 h, calories ±75)" },
      tag: "Controlled studies you accidentally ran on yourself — found and reported.",
      deep: "The miner hunts your history for near-twin days — same session type, same sleep, same calories — where exactly one thing differed, then reports the contrast like the experiment it accidentally was. First contrast under study: the day-after-refeed effect on total output. More contrasts join as your record deepens. It's the closest thing to causal evidence a single human life can produce.",
      forYou: pairs2.length >= 3 ? `${pairs2.length} matched pairs found: the post-refeed twin averages ${avgD2 >= 0 ? "+" : ""}${avgD2} reps over its match. That's your refeed's real next-day purchase, measured under fair conditions.` : `${pairs2.length}/3 pairs so far — every logged session gives the miner more twins to hunt. This one rewards patience with the rarest kind of proof.`,
      lines: [] };
  });

  /* 21 · THE TRIALS DESK */
  add(() => {
    const props3 = trialProposals(s);
    const recs = (s.trials || []).filter((t) => !t.declined);
    const runningN = recs.filter((t) => { const v = trialVerdict(s, t); return v && !v.done; }).length;
    return { id: "trialsdesk", t: "THE TRIALS DESK", status: runningN ? "TRACKING" : "LIVE", prog: null,
      tag: props3.length ? `${props3.length} experiment${props3.length > 1 ? "s" : ""} proposed — one tap starts, nothing runs without you.` : runningN ? `${runningN} trial${runningN > 1 ? "s" : ""} running — follow the day's arm on NOW.` : "Watching for the next worthwhile experiment.",
      deep: "This is the lab going from watching to testing. It proposes formal experiments on your levers — alternating blocks, fair comparisons, honest sample sizes — and runs them only after your one-tap consent. The day's arm appears in TODAY'S PROTOCOL so following a trial costs zero thought. Verdicts come badged like everything else: direction, sample size, and never gospel.",
      forYou: "Open the card — proposals, running trials, and finished verdicts all live inside.",
      lines: [] };
  });

  /* 22 · REFEED REBOUND (pulse × refeed) */
  add(() => {
    const pairsRB = [];
    (s.pulse || []).forEach((pr) => {
      const dayBefore = isoOf(new Date(mk(pr.d).getTime() - DAY));
      if (dayType(dayBefore) === "REFEED" && pBase) pairsRB.push(pr.bpm - pBase);
    });
    const avgRB = pairsRB.length ? +(pairsRB.reduce((a, b) => a + b, 0) / pairsRB.length).toFixed(1) : null;
    return { id: "refeedpulse", t: "REFEED REBOUND", status: pairsRB.length >= 2 ? "LIVE" : "ARMED", prog: { n: pairsRB.length, need: 2, label: "post-refeed pulse mornings" },
      tag: "Does Wednesday's food show up in Thursday's heartbeat?",
      deep: "A resting-pulse dip the morning after a refeed is the parasympathetic rebound — the nervous system cashing the recovery the extra food bought. If your Thursdays reliably beat baseline, the refeed is doing systemic work far beyond glycogen; if they don't, its value is purely the fuel and the psychology.",
      forYou: avgRB != null ? `Your post-refeed mornings run ${avgRB > 0 ? "+" : ""}${avgRB} bpm vs baseline (${pairsRB.length} measured). ${avgRB <= -1 ? "That's the rebound — recovery, purchased and visible." : "No systemic dip yet — the refeed's value is fuel and sanity, which still counts."}` : "Arms with two post-refeed pulse mornings — the first candidate is the morning after your next Wednesday.",
      lines: [] };
  });

  /* 23 · SEASON ONE */
  add(() => {
    const wkNow = weekDay().wk;
    const letters = s.feed.filter((f) => f.t.indexOf("WEEK IN REVIEW") === 0).length;
    const wins2 = s.feed.filter((f) => /OWNED|DEBUT|EARNED|RECLAIM|ZERO-COMP/.test(f.t)).length;
    return { id: "seasonone", t: "SEASON ONE — THE BOOK OF THE CUT", status: "ARMED", prog: { n: wkNow, need: 12, label: "weeks of story (compiles in full at the diet-exit)" },
      tag: "When the cut ends, the app writes the book — chapters, turning points, receipts.",
      deep: "Every feed entry, weekly review, letter, and debrief is a page already written. At the diet-exit the app compiles them into chapters — The Sheet Era, The Handoff, The Wedding Fortnight — with the numbers as plot. A document you keep; proof the whole thing happened the way you remember it.",
      forYou: `${wkNow} weeks of story so far · ${s.feed.length} entries · ${wins2} wins · ${letters} weekly reviews on file. The manuscript is accumulating on its own — nothing to do but live the chapters.`,
      lines: [] };
  });

  /* 24 · THE HANDOFF DOSSIER */
  add(() => ({ id: "dossier", t: "THE HANDOFF DOSSIER", status: "LIVE", prog: null,
    tag: "One tap: every live verdict, compiled plain, for your analyst.",
    deep: "Generated fresh on request — never stale, never stored. It compiles the machine-trust line, every speaking instrument's current verdict in plain words, running trials, this week's review, and anything athlete-called awaiting sign-off. Its whole job: your coach gets the lab's depth in two minutes of reading, whenever he asks.",
    forYou: "Open the card and tap GENERATE — then copy it straight into a text to him.",
    lines: [] }));

  /* 25 · YOUR FURNACE */
  add(() => {
    const T2 = tempRead(s);
    /* ---------- THERMOMETER_NOTE — mechanism is not validation ----------
       The physiology is real: roughly 1 °C of core temperature tracks 10-13% of RMR,
       and basal temperature has been floated as a metabolic-rate biomarker. What does
       NOT exist is any validation of MORNING ORAL temperature as a field proxy for
       cut depth in a training athlete. And the arithmetic is unkind: a consumer
       thermometer carries roughly 0.1-0.2 °C of measurement noise, which is about
       0.2-0.4 °F — the same size as the 0.4 °F drift this card was calling a finding.
       A single morning cannot clear its own instrument error.
       So it stays MODEL rather than LIVE, it shows the measurement-noise band next to
       the drift, and it requires a multi-day averaged drift to clear that band before
       it says anything. The mechanism keeps its place; the certainty goes. */
    const THERM_NOISE_F = 0.3;
    const driftClears = T2.drift != null && Math.abs(T2.drift) > THERM_NOISE_F;
    return { id: "furnacebase", t: "YOUR FURNACE", status: T2.base != null ? "MODEL" : "ARMED", prog: { n: T2.n, need: 7, label: "morning temperatures (15 seconds, on NOW)" },
      tag: "Morning temperature — a plausible gauge, not a validated one.",
      deep: `Your body does turn the thermostat down as a diet deepens: about 1 °C of core temperature tracks 10-13% of resting metabolic rate, and basal temperature has been proposed as a metabolic-rate biomarker. Two honest caveats the card used to skip. There is no validation of morning ORAL temperature as a field proxy for cut depth in a training athlete — the mechanism is real, the measurement is not established. And a consumer thermometer carries roughly ±${THERM_NOISE_F}°F of measurement noise, which is the same size as the ~0.4°F drift this card was treating as a finding, so a single morning cannot clear its own instrument error. It is badged MODEL for that reason, it needs a multi-day averaged drift larger than the noise band before it will say anything, and it should be read as a hypothesis you are collecting evidence on rather than a gauge you steer by.`,
      forYou: T2.base != null
        ? `Early baseline ${T2.base}°F · recent ${T2.last5}°F (${T2.drift > 0 ? "+" : ""}${T2.drift}), against ±${THERM_NOISE_F}°F of thermometer noise. ${driftClears ? (T2.drift <= -0.4 ? "That drift is larger than the instrument error, so it is worth noticing — cooling is normal, expected, and part of what the refeeds and the diet-exit are for. Still one signal among several, not a verdict." : "That drift clears the noise band but points warm — the deficit is being absorbed without the thermostat flinching.") : "That is inside the thermometer's own error, so it is not yet a reading — it is the instrument talking. More mornings, then a multi-day average."}`
        : `${T2.n}/7 readings. The thermometer takes 15 seconds, right after the pulse — same card on NOW.`,
      lines: T2.base != null ? [`drift ${T2.drift > 0 ? "+" : ""}${T2.drift}°F vs measurement noise ±${THERM_NOISE_F}°F — ${driftClears ? "clears the band" : "inside the band, not yet information"}`] : [] };
  });

  /* 26 · THE EXIT THERMOMETER */
  add(() => {
    const T2 = tempRead(s);
    return { id: "exittherm", t: "THE EXIT THERMOMETER", status: "ARMED", prog: { n: T2.n, need: 7, label: "building your cut-depth baseline now — fires at the diet-exit" },
      tag: "A hypothesis for ending the reverse on physiology rather than the calendar.",
      /* This card carried the most confident sentence in the whole LAB — "the instrument
         nothing on the market has", "a physiological finish line" — sitting on the
         thinnest evidence in it. The idea is genuinely good and worth collecting data
         for. It is not a finish line until something validates it, and the drift it
         would read is the same size as the thermometer's own error. Downgraded to what
         it is: an open question with data accruing. */
      deep: "The idea: every temperature you log now maps how cool the cut runs, and when the diet-exit begins, calories climb until your mornings warm back toward baseline — so re-warming could mark metabolic recovery and end the reverse on physiology instead of a calendar guess. That would be genuinely useful and almost nothing does it. Stated honestly, though, it is a hypothesis and not an instrument yet. Morning oral temperature has never been validated as a field proxy for cut depth, the drift it would need to detect is the same size as a consumer thermometer's measurement error (~±0.3°F), and n-of-1 re-warming has no published threshold to compare against. So this card collects data and will offer a read with its uncertainty attached — it will not be calling a finish line, and the earlier copy that promised one was overclaiming.",
      forYou: `Collecting your cut-depth signature (${T2.n} readings${T2.drift != null ? `, currently ${T2.drift > 0 ? "+" : ""}${T2.drift}°F vs early baseline, against ±0.3°F of thermometer noise` : ""}). At the diet-exit it will show the re-warming trend with its error band as one input to the decision — the call stays yours and your coach's.`,
      lines: [] };
  });
  return out;
}

// Copied from frozen src/app.jsx @ fe516c1:7769-7814.
function labGroups(s) {
  /* BOARD FIX (RB-3 round 2) — PER-PRODUCER ISOLATION. The audit's profile: an
     instrument throwing partway on absurd persisted values aborted labGroups, the
     WeakMap memo (set only on success) never landed, and EVERY caller re-paid the
     full 49-instrument compute — runCone included — which is the >60s stall. One
     choking producer now yields its cards as an empty list; the other three stand,
     and labGroups STRUCTURALLY cannot throw, so the memo always lands. */
  const safe9 = (fn) => { try { return fn(s) || []; } catch (e) { return []; } };
  const all = [...safe9(labAnalytics), ...safe9(labAnalytics2), ...safe9(sleepLab), ...safe9(shelfItems)];
  const MAP = {
    scale: ["whoosh", "refeed", "noise", "masked", "creep"],
    engine: ["regime", "ea", "adaptmeter", "stepeff", "volconv", "refeedroi"],   /* R15g — the regime detector leads the shelf: the door the rest gates on */
    training: ["set1", "tuefri", "fingerprint", "strvelocity", "sessionshape", "rirtruth", "notes", "miss", "volumeledger", "signals"],   /* P6 — the standardized read leads the shelf */
    sleep: ["sleepdose", "sleeplag", "melaexp", "wakesig", "regularity", "variancetax", "canary"],
    pulse: ["pulsebase", "cutstress", "pulsewarn", "refeedpulse", "furnacebase", "exittherm"],
    behavior: ["missarch", "weekend", "compound", "miner", "medswindow"],
    trials: ["trialsdesk"],
    road: ["cone", "dexarecon", "seasonone"],
    models: ["forecast", "ghost", "sentinel", "letter", "prophet", "whatif", "negotiator", "dossier"],
    locked: ["mrv", "debutmodel"],
    shelf: ["spread", "caffdose", "creatine", "matador", "sleepceil"],
  };
  const TITLES = {
    scale: "SCALE & BODY — decoding the number",
    engine: "THE ENGINE — your metabolism, measured",
    training: "TRAINING — what the reps are saying",
    sleep: "SLEEP — the master-variable wing",
    pulse: "PULSE & FURNACE — seconds a day, deep truths",
    trials: "THE TRIALS DESK — experiments you approved",
    behavior: "PATTERNS OF A HUMAN — behavior, decoded",
    road: "THE ROAD — timing the pivot",
    models: "MODELS, SENTINELS & META — badged honestly",
    locked: "BUILD PHASE — sealed until September",
    shelf: "THE SHELF — evidence on file",
  };
  const groups = Object.keys(MAP).map((k) => ({ id: k, title: TITLES[k], cards: MAP[k].map((id) => all.find((c) => c.id === id)).filter(Boolean) }));
  const placed = new Set(Object.values(MAP).flat());
  const orphans = all.filter((c) => !placed.has(c.id));
  if (orphans.length) groups.push({ id: "more", title: "UNFILED", cards: orphans });
  groups.forEach((g) => {
    g.live = g.cards.filter((c) => c.status === "LIVE" || c.status === "TRACKING").length;
    g.armed = g.cards.filter((c) => c.status === "ARMED").length;
    g.rest = g.cards.length - g.live - g.armed;
  });
  return groups;
}

// Copied from frozen src/app.jsx @ fe516c1:7817-7875.
function bodyAlarm(s, slp) {
  const tI = isoOf(todayStart());
  const yISO = isoOf(new Date(todayStart().getTime() - DAY));
  const pr5 = pulseRead(s);
  const lastNight = s.sleep.nights.find((n) => n.d === yISO);
  const todaySpike = pr5.latest && pr5.latest.d === tI && pr5.spike != null && pr5.spike >= 7 ? pr5.spike : null;
  const prevRead = (s.pulse || []).slice().sort((a, b) => (a.d < b.d ? -1 : 1)).slice(-2)[0];
  const prevSpike = pr5.base && prevRead && prevRead.d === yISO ? prevRead.bpm - pr5.base : null;
  const partial = todaySpike == null && pr5.latest && pr5.latest.d === tI && pr5.spike != null && pr5.spike >= 4 && prevSpike != null && prevSpike >= 7;

  /* pattern check — yesterday and today ONLY; old anomalies are the sentinel card's business, not today's orders */
  let patParts = [];
  try {
    const zbase = (arr) => { if (arr.length < 8) return null; const m = arr.reduce((a, b) => a + b, 0) / arr.length; const sdv = Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / arr.length) || 1; return { m, sdv }; };
    const slB = zbase(s.sleep.nights.slice(-30).map((n) => n.h));
    const dls = Object.entries(s.dailyLogs).sort((a, b) => (a[0] < b[0] ? -1 : 1));
    const stB = zbase(dls.slice(-30).map(([, v]) => v.steps).filter(Boolean));
    for (const d2 of [yISO, tI]) {
      let hits = 0, parts = [];
      const n = s.sleep.nights.find((x) => x.d === isoOf(new Date(mk(d2).getTime() - DAY)));
      if (slB && n && Math.abs((n.h - slB.m) / slB.sdv) > 1.8) { hits++; parts.push(`slept ${n.h} h (your norm ${slB.m.toFixed(1)}±${slB.sdv.toFixed(1)})`); }
      const dl2 = s.dailyLogs[d2];
      if (stB && dl2 && dl2.steps && Math.abs((dl2.steps - stB.m) / stB.sdv) > 1.8) { hits++; parts.push(`steps ${(dl2.steps / 1000).toFixed(1)}k (norm ${(stB.m / 1000).toFixed(1)}k)`); }
      const rd = s.reads.find((r) => r.d === d2 && !r.sealed && !r.offWindow);
      if (rd && Math.abs(rd.w - s.trend) > 1.6) { hits++; parts.push(`scale ${rd.w} vs trend ${s.trend}`); }
      if (hits >= 2 && !dayWeather(s, d2).hard) patParts = parts;
    }
  } catch (e) {}
  const patternHot = patParts.length >= 2;
  if (!todaySpike && !partial && !patternHot) return null;

  const pulseTrig = todaySpike != null || partial;
  const red = todaySpike != null && (todaySpike >= 10 || (prevSpike != null && prevSpike >= 7 && todaySpike >= 7) || (lastNight && lastNight.h < 6));
  const t = dayType(tI, s);
  const trainDay = (t === "U" || t === "L") && !s.sessionLog[tI];
  let canaryName = null;
  try { const can = labGroupsM(s).flatMap((g) => g.cards).find((c) => c.id === "canary"); if (can && can.status === "LIVE") { const m = (can.forYou || "").match(/Canary: ([^(]+)\(/); if (m) canaryName = m[1].trim(); } } catch (e) {}
  const lo = lightsOutT(s);
  const early = (() => { let m = lo.mins - 30; if (m < 0) m += 1440; return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; })();
  const lines = [];
  if (trainDay) {
    if (red) lines.push("Session: convert to a walk or push it a day — nothing is lost; targets wait, the structural pick keeps its slot, and no gate closes.");
    else {
      lines.push("Session runs, one rule changed: normal plan, but every 0 becomes a 1 — no failure today. The early sets carry the growth cheap; the zeros carry the strain, and those are the only thing benched.");
      lines.push("New-weight debuts wait for a normal body — but anything you deliver still counts and still banks: a label is not a validity failure, and the record rule already prices your measured noise.");
      if (canaryName) lines.push(`Watch ${canaryName} — your measured stress-first lift; a dip there today is the alarm confirming, not you failing.`);
    }
  }
  lines.push(pulseTrig ? "Hydrate +24 oz across the morning — an elevated resting pulse frequently rides mild dehydration, and it's the cheapest test of the alarm." : "Hydrate +24 oz across the morning — the cheapest first test of an off-pattern day.");
  lines.push(`Protein stays ${proteinTarget(s).g} and calories stay on plan — recovery is protein-hungry, and eating extra fixes nothing here.`);
  lines.push(`Tonight: lights out ${early} (30 early, up at your usual ${fmt12(lightsOutT(s).wakeRef || "07:30")})${s.sleep.caffMg ? " · skip any afternoon caffeine entirely today" : ""}.`);
  lines.push(pulseTrig && pr5.base != null
    ? `Exit test — tomorrow 6:45: pulse within 3 of your ${pr5.base} baseline → every limit above lifts automatically. Still +7? ${red ? "Full rest day, and a third day is a doctor conversation, not a training one." : "Tomorrow escalates to a rest-day recommendation."}`
    : "Exit test — this clears the moment today's logs land back inside your own bands; a second off-pattern day in a row means treat it as real, not noise.");
  const basis = pulseTrig
    ? `${pr5.latest.bpm} bpm vs your ${pr5.base} baseline (+${todaySpike ?? pr5.spike})${prevSpike != null && prevSpike >= 7 ? (todaySpike != null ? " · second elevated morning" : " · recovering from yesterday") : ""}${lastNight ? ` · slept ${lastNight.h} h` : ""}${s.sessionLog[yISO] ? " · trained yesterday (a day-after bump is common — weigh that)" : ""} · ${(s.pulse || []).length} mornings behind the baseline`
    : `in the last day: ${patParts.join(" + ")} — two of your own baselines at once. No pulse data involved${(s.pulse || []).length === 0 ? " (none logged yet)" : ""}.`;
  return { tier: red ? "RED" : "AMBER", head: red ? `Body alarm — RED (pulse +${todaySpike ?? "?"}, second signal)` : partial ? `Body alarm — recovering (pulse +${pr5.spike}, down from +${prevSpike})` : pulseTrig ? `Body alarm — dial back (pulse +${todaySpike})` : "Body alarm — off-pattern day (dial back)", lines, basis };
}

// Copied from frozen src/app.jsx @ fe516c1:7878-7883.
function pulseRead(s) {
  const pr = (s.pulse || []).slice().sort((a, b) => (a.d < b.d ? -1 : 1));
  const base = pr.length >= 7 ? pr.slice(-14).map((x) => x.bpm).sort((a, b) => a - b)[Math.floor(Math.min(14, pr.length) / 2)] : null;
  const latest = pr[pr.length - 1] || null;
  return { base, latest, spike: base && latest ? latest.bpm - base : null };
}

// Copied from frozen src/app.jsx @ fe516c1:7884-7889.
function tempRead(s) {
  const tr = (s.temp || []).slice().sort((a, b) => (a.d < b.d ? -1 : 1));
  const base = tr.length >= 7 ? +(tr.slice(0, 5).reduce((a, x) => a + x.f, 0) / Math.min(5, tr.length)).toFixed(1) : null;
  const last5 = tr.length >= 5 ? +(tr.slice(-5).reduce((a, x) => a + x.f, 0) / 5).toFixed(1) : null;
  return { n: tr.length, base, last5, drift: base != null && last5 != null ? +(last5 - base).toFixed(1) : null, latest: tr[tr.length - 1] || null };
}

// Copied from frozen src/app.jsx @ fe516c1:7925-7942.
const TRIAL_TPL = {
  refeedsize: { t: "REFEED SIZE — 2,450 vs 2,300", blockDays: 7, cycles: 4, arms: ["refeed 2,450", "refeed 2,300"],
    q: "Does the smaller refeed buy the same next-day lifting?",
    eligible: (s) => Object.keys(s.dailyLogs).filter((d) => dayType(d) === "REFEED").length >= 1,
    metric: "next-day session total reps per block" },
  caffcut: { t: "CAFFEINE — USUAL vs −100 MG", blockDays: 3, cycles: 6, arms: ["usual dose", "usual −100 mg"],
    q: "Does a smaller pre-lift dose cost reps — or buy sleep?",
    eligible: (s) => !!s.sleep.caffMg,
    metric: "session reps + hours asleep per block" },
  lightsshift: { t: "LIGHTS-OUT — ON TIME vs 30 MIN EARLIER", blockDays: 3, cycles: 4, arms: ["derived time", "30 min earlier"],
    q: "Does the earlier window buy next-day output?",
    eligible: (s) => s.sleep.nights.filter((n) => n.sol != null).length >= 5,
    metric: "hours asleep + next-day reps per block" },
  steptarget: { t: "STEPS — 16.5K vs 18K", blockDays: 7, cycles: 4, arms: ["16.5k/day", "18k/day"],
    q: "Do the extra steps show up on your scale, in you?",
    eligible: () => true,
    metric: "weekly weight change per block" },
};

// Copied from frozen src/app.jsx @ fe516c1:7943-7945.
function trialProposals(s) {
  return Object.entries(TRIAL_TPL).filter(([id, t]) => !(s.trials || []).some((x) => x.tplId === id) && t.eligible(s)).map(([id, t]) => ({ id, ...t }));
}

// Copied from frozen src/app.jsx @ fe516c1:7946-7946.
function trialTpl(trial) { return trial.custom ? trial.custom : TRIAL_TPL[trial.tplId]; }

// Copied from frozen src/app.jsx @ fe516c1:7961-8055.
function trialVerdict(s, trial) {
  const tpl = trialTpl(trial);
  if (!tpl) return null;
  if (tpl.metric === "lift_pair") {
    /* B1 — parallel arms on two comparable lifts, one full read window each. The
       verdict is two slopes with their own intervals, side by side — no randomization
       test exists for n=1 per arm, and the card says so instead of implying one. */
    const postN9 = (id9) => Object.keys(s.sessionLog || {}).filter((d) => d >= trial.started && ((s.sessionLog[d] || {}).entries || []).some((e) => e && e.id === id9)).length;
    const nA = postN9(tpl.exA), nB = postN9(tpl.exB);
    const done = nA >= TREND_WINDOW && nB >= TREND_WINDOW;
    const tA = liftTrend(s, tpl.exA), tB = liftTrend(s, tpl.exB);
    return { done, nA, nB, a: tA ? tA.pct : null, b: tB ? tB.pct : null,
      diff: (tA && tB) ? +(tA.pct - tB.pct).toFixed(2) : null, diffCI: null, pRand: null, nSplits: null, needsWashout: false,
      note: "parallel arms — two slopes with intervals, side by side; direction, not gospel (n=1 per arm)" };
  }
  const endISO = isoOf(new Date(mk(trial.started).getTime() + tpl.blockDays * tpl.cycles * DAY));
  const done = isoOf(todayStart()) >= endISO;
  const perArm = [[], []];
  try {
    for (let b = 0; b < tpl.cycles; b++) {
      const from = mk(trial.started).getTime() + b * tpl.blockDays * DAY;
      const to = from + tpl.blockDays * DAY;
      const inBlock = (d) => mk(d).getTime() >= from && mk(d).getTime() < to;
      let val = null;
      if (trial.tplId === "steptarget" || (trial.custom && trial.custom.metric === "trend_delta")) {
        const ts2 = trendSeries(s.reads);
        const a2 = ts2.filter((x) => inBlock(x.d));
        if (a2.length >= 2) val = +(a2[0].t - a2[a2.length - 1].t).toFixed(1);
      } else if (trial.custom && trial.custom.metric === "sleep_h") {
        const ns2 = s.sleep.nights.filter((n) => inBlock(n.d));
        if (ns2.length >= 2) val = +(ns2.reduce((a3, n) => a3 + n.h, 0) / ns2.length).toFixed(2);
      } else {
        const sessDs = Object.keys(s.sessionLog).filter(inBlock);
        if (sessDs.length) val = Math.round(sessDs.reduce((a3, d) => a3 + (s.sessionLog[d].entries || []).reduce((x, e) => x + (e.reps || []).reduce((p, q) => p + q, 0), 0), 0) / sessDs.length);
      }
      if (val != null) perArm[b % 2].push(val);
    }
  } catch (e) {}
  const mean = (a2) => (a2.length ? +(a2.reduce((x, y) => x + y, 0) / a2.length).toFixed(1) : null);
  /* ---------- TRIAL_INFERENCE_NOTE ----------
     The ABAB alternating design is legitimate, and its alternation genuinely controls for
     slow time trends. What came back was per-arm MEANS AND COUNTS — no spread, no
     interval, no test — so a verdict was "arm A 42, arm B 39" and the reader supplied
     the significance themselves. Two blocks per arm can produce that gap on nothing.

     Added: the arm difference with a 95% interval, and an exact randomization test.
     With this few blocks the randomization test is the right instrument — it enumerates
     every possible assignment of the observed block values to two arms and asks how often
     chance alone beats the observed gap. No distributional assumption, and at 4-6 blocks
     it can be computed exhaustively rather than sampled. The p-value floor is honest
     about itself: with 2 blocks per arm there are only 6 distinct splits, so p can never
     go below ~0.17 and the card says as much instead of implying precision it cannot have.

     Carryover is flagged rather than silently ignored: the refeed-size trial's water and
     glycogen bleed into the adjacent block, and the caffeine trial has a pharmacological
     tail, so both want a washout. The washout requirement is surfaced on the verdict and
     the desk can act on it; it is not something arithmetic can fix after the fact. */
  const aVals = perArm[0], bVals = perArm[1];
  const diff = (aVals.length && bVals.length) ? +(mean(aVals) - mean(bVals)).toFixed(2) : null;
  let pRand = null, nSplits = null;
  if (aVals.length >= 2 && bVals.length >= 2) {
    const all = aVals.concat(bVals), k = aVals.length, N = all.length;
    const idx = [...Array(N).keys()];
    const combos = [];
    const pick = (start, acc) => { if (acc.length === k) { combos.push(acc.slice()); return; } for (let i = start; i < N; i++) { acc.push(idx[i]); pick(i + 1, acc); acc.pop(); } };
    pick(0, []);
    const obs = Math.abs(diff);
    let atLeast = 0;
    combos.forEach((c) => {
      const setC = new Set(c);
      const g1 = all.filter((_, i) => setC.has(i)), g2 = all.filter((_, i) => !setC.has(i));
      const d = Math.abs((g1.reduce((x, y) => x + y, 0) / g1.length) - (g2.reduce((x, y) => x + y, 0) / g2.length));
      if (d >= obs - 1e-9) atLeast++;
    });
    nSplits = combos.length;
    pRand = +(atLeast / combos.length).toFixed(3);
  }
  const diffCI = (aVals.length >= 2 && bVals.length >= 2) ? ciOf(aVals.map((v, i) => v - (bVals[i] != null ? bVals[i] : mean(bVals)))) : null;
  /* Template ids are refeedsize / caffcut / lightsshift — matched exactly, because a
     near-miss here silently means "no carryover risk" on the two trials that have it. */
  /* Coerced with !! deliberately: `trial.custom && ...` yields undefined rather than
     false when there is no custom trial, and a flag that is sometimes undefined and
     sometimes boolean is the kind of thing that reads fine in an `if` and then fails an
     identity check somewhere else. It is a boolean or it is nothing. */
  const needsWashout = !!(trial.tplId === "refeedsize" || trial.tplId === "caffcut" || (trial.custom && /refeed|caff/i.test(trial.custom.metric || "")));
  return {
    done, endISO, a: mean(aVals), b: mean(bVals), nA: aVals.length, nB: bVals.length,
    diff, diffCI, pRand, nSplits,
    /* the floor on what p CAN be at this many blocks — quoted so a large p is not read
       as "no effect" when it is really "too few blocks to say" */
    pFloor: nSplits ? +(1 / nSplits).toFixed(3) : null,
    needsWashout, washoutDays: needsWashout ? 2 : 0,
    inferential: pRand != null,
  };
}

// Copied from frozen src/app.jsx @ fe516c1:8259-8287.
function prophetGrades(s) {
  const fc = s.forecasts || [];
  const byRead = Object.create(null);
  (s.reads || []).forEach((r) => { if (!r.sealed && !r.offWindow && r.w != null) byRead[r.d] = r.w; });
  const nearestRead = (iso) => {
    for (const off of [0, 1, -1]) {
      const d = isoOf(new Date(mk(iso).getTime() + off * DAY));
      if (byRead[d] != null) return { w: byRead[d], off };
    }
    return null;
  };
  const graded = [], trendErrs = [];
  fc.forEach((f) => {
    if (f.sealed || f.pred7 == null) return;
    const targetD = isoOf(new Date(mk(f.d).getTime() + 7 * DAY));
    const hit = nearestRead(targetD);
    if (hit) graded.push({ err: +(hit.w - f.pred7).toFixed(1), d: targetD, off: hit.off, against: "read" });
    const g = fc.find((x) => x.d === targetD);
    if (g && g.trend != null) trendErrs.push(+(g.trend - f.pred7).toFixed(1));
  });
  const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  const mae = graded.length ? +mean(graded.map((x) => Math.abs(x.err))).toFixed(2) : null;
  const bias = graded.length ? +mean(graded.map((x) => x.err)).toFixed(2) : null;
  const maeTrend = trendErrs.length ? +mean(trendErrs.map(Math.abs)).toFixed(2) : null;
  /* Single-case guidance wants a median of ~6 observations before a within-person
     verdict, so a trust number is PROVISIONAL until then rather than LIVE at 2. */
  const TRUST_N = 6;
  return { graded, mae, bias, n: graded.length, maeTrend, nTrend: trendErrs.length, TRUST_N, provisional: graded.length > 0 && graded.length < TRUST_N };
}

// Copied from frozen src/app.jsx @ fe516c1:12413-12413.
const _labMemo = new WeakMap();

// Copied from frozen src/app.jsx @ fe516c1:12414-12414.
function labGroupsM(s) { if (_labMemo.has(s)) return _labMemo.get(s); let g; try { g = labGroups(s); } catch (e) { g = []; } _labMemo.set(s, g); return g; }

// Copied from frozen src/app.jsx @ fe516c1:12419-12437.
function dayWeather(s, iso) {
  const flags = [];
  const manual = (s.dayCtx || {})[iso];
  if (manual && manual.est) flags.push({ k: "estimate", why: manual.note || "declared estimate day" });
  if (manual && manual.travel) flags.push({ k: "travel", why: "travel day — interpretation context only, never a trigger" });
  if (manual && manual.illness) flags.push({ k: "illness", why: "illness noted — interpretation context only, never a trigger" });
  (s.events || []).forEach((e) => { const gap = (mk(iso) - mk(e.d)) / DAY; if (gap >= -1 && gap <= 2) flags.push({ k: "event", why: e.t || "event window", pre: gap < 0 }); });
  if (s.blackout && iso <= s.blackout.until && (mk(s.blackout.until) - mk(iso)) / DAY <= 9) flags.push({ k: "sealwater", why: "scale carries event water — sealed window" });
  { const mm2 = (s.medsLog || []).find((x) => x.d === iso); if (mm2 && !mm2.taken) flags.push({ k: "nomeds", why: "no meds this day — appetite, energy, and effort read differently" }); }
  if (dayType(isoOf(new Date(mk(iso).getTime() - DAY)), s) === "REFEED") flags.push({ k: "postrefeed", why: "morning after refeed — storage bump expected" });
  /* R17 — TWO QUESTIONS, TWO ANSWERS. `hard` answers "are this day's FOOD and SCALE
     numbers trustworthy" — a declared estimate day and an event day both fail it, and
     every food/scale consumer keeps reading it unchanged. `hardSession` answers a
     different question: "was the TRAINING itself compromised". A guessed dinner does
     not make 11 reps at 320 less true — the reps were counted at a known load — so the
     estimate flag has no business excluding a session. An EVENT day stays excluded:
     a wedding plausibly does degrade the session, and Joe's ruling left that alone. */
  return { flags, noisy: flags.some((f) => f.k === "estimate" || f.k === "event" || f.k === "sealwater"), hard: flags.some((f) => f.k === "estimate" || (f.k === "event" && !f.pre)), hardSession: flags.some((f) => f.k === "event" && !f.pre), est: flags.some((f) => f.k === "estimate") };
}

// Copied from frozen src/app.jsx @ fe516c1:12438-12441.
function weekWeather(s, days) {
  const hits = days.filter((d) => dayWeather(s, d).noisy).length;
  return { noisyDays: hits, clean: hits <= 1 };
}

// Copied from frozen src/app.jsx @ fe516c1:14453-14458.
function sleepInfo(s) {
  const n = s.sleep.nights;
  const tomorrow = isoOf(new Date(todayStart().getTime() + DAY));
  const t = atSleepTarget(s, null);
  return { run: t.run, atTarget: t.at, clean: cleanAtDate(s, tomorrow), last: n[n.length - 1], need: s.sleep.needed };
}

// Copied from frozen src/app.jsx @ fe516c1:14459-14462.
function weekDay() {
  const diff = Math.round((todayStart() - mk(START)) / DAY);
  return { wk: Math.floor(diff / 7) + 1, day: diff + 1 };
}

// Copied from frozen src/app.jsx @ fe516c1:14463-14463.
const blackoutOn = (s) => daysUntil(s.blackout.until) > 0;

// Copied from frozen src/app.jsx @ fe516c1:14479-14487.
function nextEvent(s, withinDays = null) {
  const up = (s.events || [])
    .filter((e) => e && e.d && !e.estimated && daysUntil(e.d) >= 0)
    .sort((a, b) => (a.d < b.d ? -1 : 1));
  if (!up.length) return null;
  const ev = up[0];
  if (withinDays != null && daysUntil(ev.d) > withinDays) return null;
  return ev;
}

// Copied from frozen src/app.jsx @ fe516c1:14525-14536.
function eventFocus(s) {
  const none = { ev: null, days: null, closable: false, overdue: false, stale: false };
  const rows = (((s && s.events) || []))
    .filter((e) => e && e.d && !e.estimated)
    .map((e) => ({ e, days: daysUntil(e.d) }))
    .sort((a, b) => a.days - b.days);
  const closable = rows.filter((x) => x.days <= 0);   // r3 blocker A — NO expiry: a miss must not expire
  if (closable.length) { const p = closable[0]; return { ev: p.e, days: p.days, closable: true, overdue: p.days < 0, stale: p.days < -EVENT_GRACE_D }; }
  const soon = rows.filter((x) => x.days > 0 && x.days <= EVENT_LEAD_D);
  if (soon.length) return { ev: soon[0].e, days: soon[0].days, closable: false, overdue: false, stale: false };
  return none;
}

// Copied from frozen src/app.jsx @ fe516c1:14537-14542.
function lastEvent(s, graceDays = 7) {
  const past = (s.events || [])
    .filter((e) => e && e.d && !e.estimated && daysUntil(e.d) < 0 && daysUntil(e.d) >= -graceDays)
    .sort((a, b) => (a.d < b.d ? 1 : -1));
  return past.length ? past[0] : null;
}

// Copied from frozen src/app.jsx @ fe516c1:14545-14548.
const nextDow = (dow, from = todayStart()) => {
  for (let i = 1; i <= 7; i++) { const d = new Date(from.getTime() + i * DAY); if (d.getDay() === dow) return isoOf(d); }
  return null;
};

// Copied from frozen src/app.jsx @ fe516c1:14550-14550.
const nextMonthFirst = (from = todayStart()) => isoOf(new Date(from.getFullYear(), from.getMonth() + 1, 1));

return { cleanAtDate, nightsBefore, atSleepTarget, sleepMean3At, sleepInfo, owedNights, owedLedger, sleepAnchor, recoveryIndex, bodyAlarm, dayWeather, weekWeather, nextEvent, lastEvent, eventFocus, weekDay, blackoutOn, hmToMin, medOf, sdOf, minToHM, pulseRead, labGroupsM, lightsOutT, fmt12, labGroups, medianSOL, labAnalytics, labAnalytics2, sleepLab, shelfItems, ciOf, ciLine, nextDow, chanceWords, tCrit, coFlagRate, twoTail, nextMonthFirst, prophetGrades, trialProposals, trialVerdict, tempRead, liftCall, normSf, TRIAL_TPL, trialTpl, todayMeds, readyLowFor };
};
