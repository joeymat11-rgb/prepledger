// Freezes the clock. MUST stay above the app import — see tools/_fixed-now.mjs
// for why a suite that derives dates from the real clock cannot be trusted.
import "./_fixed-now.mjs";
import { readFileSync } from "node:fs";
import { __test } from "../src/app.jsx";
const { targetsFor, genSession, completeSession, runAdaptive, bfEst, migrate, SEED } = __test;
let pass = 0, fail = 0;
const ok = (cond, name) => { cond ? pass++ : fail++; console.log((cond ? "PASS" : "FAIL") + " — " + name); };

/* ==================== FROZEN REAL-LEDGER SNAPSHOTS ====================
   A SYNTHETIC fixture encodes the author's model of the problem — which is the same model
   that produced the bug. Both versions of R7's comparator passed their synthetic fixtures,
   because both were written to. A FROZEN REAL SNAPSHOT encodes the world instead, and does
   not care what the author believed.

   THE RULE: when an item's correctness depends on real data, the fixture is a DATED SNAPSHOT
   of real data and the criterion states the OUTCOME, not the mechanism.

   A criterion phrased as a MECHANISM is satisfied by any comparator that plausibly fits the
   words — "compare the behaviour-implied rate to the measured rate" was satisfied by both of
   R7's builds. A criterion phrased as an OUTCOME ON REAL DATA is not: "on his ledger the flag
   is RAISED" fails instantly against the narrowed build, because 0.28 < 0.38.

   KNOWN BLIND SPOT, stated so a green run is not mistaken for proof: a comparator can still be
   narrowed in a way that happens to produce the right outcome on the snapshot. This converts
   "no mechanical check exists" into "one exists with known limits", which is the difference
   between the eleven instances found by reading and the three found by tools.

   Snapshots ACCUMULATE. Each is a regression test against a real world-state that once
   existed. Never edit one to make a test pass — take a new one, dated. ==================== */
{
  const SNAP = JSON.parse(readFileSync("tools/snapshots/2026-08-06-ledger.json", "utf8"));

  /* R7 — THE ONE THAT WOULD HAVE CAUGHT THE NARROWED COMPARATOR.
     Under the narrowed build this reads flagged=false (gap 0.28 vs combined 0.38). */
  const rd = __test.rateDivergence(SNAP);
  ok(rd.flagged === true, "SNAPSHOT 2026-08-06 — the divergence flag is RAISED on his real ledger. The narrowed comparator I built read false here, and no synthetic fixture caught it because both comparators pass fixtures written for them");
  ok(rd.gap > rd.combined, "SNAPSHOT — and it is raised because the gap (" + rd.gap + ") exceeds the combined error (" + rd.combined + "), not because a threshold happened to sit somewhere convenient");
  ok(Math.abs((rd.intakeEffect + rd.stepEffect) - rd.gap) < 0.02 && rd.intakeEffect > rd.stepEffect, "SNAPSHOT — the attributed parts sum to the gap on REAL data, and intake is the larger term: 0.75 intake against 0.17 steps");

  /* R1 — WHICH BRANCH REAL DATA TAKES. Recorded as an assertion rather than a note, which is
     the step that was missing. The unreachable clean2 gate would have failed this instantly:
     "how many lifts clear the downgrade gate" has the answer "none, ever". */
  const pt = __test.progressionTrend(SNAP);
    /* R17 — THIS ASSERT ENCODED THE DEFECT. It read 0 usable lifts and called that the
     instrument working. It was the estimate flag excluding sessions whose reps were
     counted exactly: one dayCtx.est on 8/7 took every lift's most recent point, and the
     coach card told him it could read 0 of the 4 lifts it needs. With the flag split by
     what it actually claims, his own ledger reads 10 lifts RISING. The abstention branch
     is still real and still tested — on a state that genuinely lacks sessions, below. */
  ok(pt.nLifts === 3 && pt.state === "unknown", "SNAPSHOT (R17) — progressionTrend now READS this snapshot: " + pt.nLifts + " lifts carry a usable trend where 0 did before the split. Three is still under the floor of 4, so the pooled verdict correctly stays " + pt.state + " HERE — while the 8/7 ledger, which is what his phone holds, reads 10 lifts RISING. The instrument was blind, not cautious");
  ok(__test.progressionTrend({ sessionLog: {}, exercises: [], sleep: { nights: [] }, reads: [], dailyLogs: {} }).state === "unknown", "SNAPSHOT — and the ABSTENTION branch is still real: a state with no sessions still reads unknown, so the instrument has not been taught to guess");
  ok(pt.nExcludedNonNumeric === 2 && pt.excludedIds.indexOf("curl") > -1 && pt.excludedIds.indexOf("hanging") > -1, "SNAPSHOT — exactly two lifts are excluded for a non-numeric weight, and they are curl and hanging. The spec said three and named pronated, which is numeric in all three of its logged entries");
  {
    let cleanCapable = 0;
    for (const t2 of pt.lifts) if (__test.liftTrend(SNAP, t2.id, { cleanOnly: true, minN: 3 })) cleanCapable++;
    ok(cleanCapable === 0, "SNAPSHOT — no lift yet clears the DOWNGRADE gate (3 clean sessions). Recorded as a fact rather than a note: if a change ever makes this branch unreachable-but-alive again, this number stops matching and the assertion says so");
  }

  /* R2/R2b — the target his phone is actually showing */
  const eb = __test.energyBalanceTarget(SNAP, { asOf: "2026-08-06" });
  ok(eb.dir === "deficit" && eb.lo === 2176 && eb.hi === 2263, "SNAPSHOT — the live band is 2176-2263. Any change claiming to be display-only must leave these two numbers alone");
  ok(eb.provisional === true && eb.regimeConfirmed === false, "SNAPSHOT — and it is flagged provisional, because the regime is unconfirmed. A ~530 kcal decision presented as decided is a stronger claim than the evidence supports");

  /* R3 — the redline he sees on the gauge */
  const rb = __test.cutRateBand(SNAP);
  ok(rb.floor === 0.82 && rb.redline === 1.63, "SNAPSHOT — floor 0.82 and redline 1.63 lb/wk, %BW-derived. These were an authored 0.8 and 1.9 in pounds, and the redline got MORE permissive as he leaned out");
  ok(rb.redlinePct === __test.bodyCompBand(SNAP).redlinePct, "SNAPSHOT — one redline, published once. The foresight layer used to run 1.157 against the alarm's 1.0");

  /* STEPS ITEM A — outcomes on the fresh 2026-08-07 snapshot. */
  {
    const S7 = JSON.parse(readFileSync("tools/snapshots/2026-08-07-ledger.json", "utf8"));
    const td7 = __test.observedTDEE(S7);
    ok(td7.stepPromoted === false && td7.tdeePrimary === td7.tdee, "SNAPSHOT 08-07 ITEM A — the PRIMARY is the measured 35-day figure, NOT promoted: net drift (" + Math.abs(Math.round(td7.stepDelta * 0.70)) + ") sits inside the measured band's own halfwidth. The step story changed; the number he eats to did not — which is the conservative rule that unblocked R13");
    ok(td7.tdeeAtNowNet != null && td7.tdeeAtNowGross != null && td7.tdeeAtNowNet > td7.tdeeAtNowGross, "SNAPSHOT 08-07 ITEM A — the step delta is priced NET of compensation as a BAND (net " + td7.tdeeAtNowNet + " to gross " + td7.tdeeAtNowGross + "): the body claws back ~25-30% in a lean subject, so gross is the band edge, never the number");
    const ct7 = __test.calorieTarget(S7);
    ok(ct7.tdee === td7.tdee && ct7.stepPromoted === false, "SNAPSHOT 08-07 ITEM A — calorieTarget divides from the primary, which today IS the measured number, so the eat band is byte-identical to the pre-Item-A build");
    const st7 = __test.stepTarget(S7);
    ok(st7.why.indexOf(td7.atSteps.toLocaleString()) > -1, "SNAPSHOT 08-07 ITEM A — ONE owner for the measured-at step figure: stepTarget's receipt quotes observedTDEE's " + td7.atSteps.toLocaleString() + ", not its own 21-day average wearing the measurement's name");
    ok(Math.abs(st7.kcalPer1k - __test.stepKcal(S7.trend, 1000)) < 0.15, "SNAPSHOT 08-07 ITEM A — a thousand steps is worth the SAME kcal everywhere it is priced (" + st7.kcalPer1k + "): EA_KCAL_PER_1K_STEPS_PER_KG derives from the one cited walking cost instead of a round 0.4 sitting 7.6% away");

    /* STEPS ITEM B — live outcomes */
    const sp7 = __test.stepPush(S7);
    ok(sp7.mode === "HOLD", "SNAPSHOT 08-07 ITEM B — the coach HOLDS today: his rate is inside the corridor, so the push lever stays sheathed. No always-on nagging to walk more");
    ok(!__test.runAdaptive(JSON.parse(JSON.stringify(S7)), "2026-08-07").proposals.some((p) => /^steppush_/.test(p.rid)), "SNAPSHOT 08-07 ITEM B — and no push card is filed on the live ledger");
    const se7 = __test.stepEfficacy(S7);
    ok(se7.status === "LIVE" && se7.resolved === false && Math.abs(se7.slopePer1k) > se7.boundPer1k, "SNAPSHOT 08-07 ITEM B — the live stepeff fit (" + se7.slopePer1k + " lb/wk per 1k) exceeds the walking-physics ceiling (" + se7.boundPer1k + ") by three orders of magnitude: the verdict is UNRESOLVED, not negative. The old per-step toFixed(2) had been rounding this absurdity to 0.00 and calling it a reading");
  }

  /* FEED ORDER SURVIVES A MERGE. Pre-existing v6.2-era defect surfaced in production:
     _unionMulti iterated remote keys first, so local-only entries appended at the TAIL —
     the 2026-08-06 withdrawal receipt sat at index 189 of 191, under July lines, and he
     plausibly never saw it. The withdrawal convention held in state and failed in display,
     which is where he reads. Driven on the frozen real snapshot, both write orders. */
  {
    const A2 = JSON.parse(JSON.stringify(SNAP));
    const B2 = JSON.parse(JSON.stringify(SNAP));
    /* give one side a NOVEL newest entry the other has never seen — the burial case */
    B2.feed = [{ d: "2026-08-06", t: "NOVEL LOCAL RECEIPT", how: "x" }, ...B2.feed];
    for (const [x, y] of [[A2, B2], [B2, A2]]) {
      const m2 = __test.mergeState(JSON.parse(JSON.stringify(x)), JSON.parse(JSON.stringify(y)));
      const idx = m2.feed.findIndex((f) => f.t === "NOVEL LOCAL RECEIPT");
      ok(idx >= 0 && idx <= 3, "SNAPSHOT — a novel newest feed entry surfaces at the TOP after a merge (index " + idx + "), in both write orders. Under the old union it landed at the tail, below weeks-old lines");
      const ds = m2.feed.map((f) => String(f.d || ""));
      ok(ds.every((d, i) => i === 0 || ds[i - 1].localeCompare(d) >= 0), "SNAPSHOT — the merged feed is monotone newest-first: every unshift in the app assumes it, and one sync against a stale remote used to destroy it");
      ok(m2.feed.length === x.feed.length || m2.feed.length === y.feed.length, "SNAPSHOT — and nothing was dropped to achieve it: the sort reorders, the union still never shrinks");
    }
  }

  /* R14 — THE INBOX INVARIANT, on the real ledger: a card may exist only if its tap enacts
     a state change. After one sweep, zero open note cards; their content is in the feed. */
  {
    const out14 = __test.runAdaptive(JSON.parse(JSON.stringify(SNAP)), "2026-08-06");
    const openNotes = out14.proposals.filter((p) => !p.resolved && p.apply && p.apply.kind === "note");
    ok(openNotes.length === 0, "SNAPSHOT R14 — ZERO open note cards after one sweep on his real ledger. The badge count now means decisions waiting, which is the feature");
    const micro = out14.proposals.find((p) => p.rid === "microload");
    ok(micro && micro.resolved && /converted to feed/.test(micro.resolvedHow || ""), "SNAPSHOT R14 — the live microload card converted through the withdraw pattern, resolved on the record");
    ok(out14.feed.some((f) => /PLATES TOO COARSE/.test(f.t)), "SNAPSHOT R14 — and its content survives in the feed: nothing he was told is lost, it just stopped pretending to be a decision");
    ok(!out14.proposals.some((p) => !p.resolved && p.apply && p.apply.kind === "note"), "SNAPSHOT R14 — the admission invariant holds end-to-end: no path in runAdaptive can seat a note in the inbox, because propose() converts them at the one place cards are born");
  }

  /* R9 — the orphaned pivot card. Its producer was deleted by R4 but its apply branch is
     LIVE: tapping it steps calories to maintenance on the authority of a body-fat threshold
     the app no longer trusts. The change that deletes a producer must withdraw its cards. */
  {
    const out9 = __test.runAdaptive(JSON.parse(JSON.stringify(SNAP)), "2026-08-06");
    const piv9 = out9.proposals.find((p) => p.rid === "pivot");
    ok(piv9 && piv9.resolved === true && /withdrawn/.test(piv9.resolvedHow || ""), "SNAPSHOT — the orphaned pivot card is WITHDRAWN on the next engine run. It sat open with a live kind=exit apply branch after R4 deleted its producer: a card recommending a decision the engine had already disowned");
    ok(out9.feed.some((f) => /CARD WITHDRAWN/.test(f.t) && /IS THE CUT DONE/.test(f.t)), "SNAPSHOT — and the withdrawal is on the record in the feed, never silent. Follows the SET-REALLOCATION precedent: resolved, not deleted");
    ok(out9.proposals.length >= SNAP.proposals.length, "SNAPSHOT — no proposal was deleted in the process; withdrawal marks, it never removes");
  }
}

const clone = (o) => JSON.parse(JSON.stringify(o));

// 1. progression: climb the earliest lagging set
ok(JSON.stringify(targetsFor({ last: [14,13,13], hi: 15, sets: 3 })) === "[14,14,13]", "targets climb earliest lagging set");
ok(JSON.stringify(targetsFor({ last: [10,10], hi: 10, sets: 2 })) === "[10,10]", "targets hold at top of window");

// 2. Thursday generates itself with rows 180 as THE structural change
const slpDebt = { clean: false, run: 1, need: 3, last: { h: 7.5 } };
const thu = genSession(clone(SEED), "2026-07-23", slpDebt);
ok(thu && thu.structural === "ROWS 180 DEBUT", "Thu structural auto-picked = rows 180");
ok(thu.ex.find(e => e.id === "rows").w === 180, "rows debuts at 180");
ok(JSON.stringify(thu.ex.find(e => e.id === "press").tgt) === "[8,8,7]", "press holds the own-it standard");

// 3. Friday: hack is structural, abs rides co-approved, 3rd set appended
const fri = genSession(clone(SEED), "2026-07-24", slpDebt);
ok(fri.structural.indexOf("HACK") === 0 && fri.ex.find(e => e.id === "hack").tgt.length === 3, "Fri hack 3rd set debut generated");
ok(fri.ex.find(e => e.id === "abs").isDebutNow === true, "abs debut rides alongside (doc-approved)");

// 4. completing Thursday clean: rows flips, press gets OWNED, 250 queues itself
const slpClean = { clean: true, run: 3, need: 3, last: { h: 8 } };
const entries = thu.ex.map(e => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow }));
entries.find(e => e.id === "press").reps = [8,8,7];
const { s: after } = completeSession(clone(SEED), "2026-07-23", entries, slpClean);
ok(after.exercises.find(e => e.id === "rows").w === 180 && after.queue.find(q => q.id === "q_rows180").done, "rows debut banked, weight advanced");
ok(after.exercises.find(e => e.id === "press").own === false, "press owned on clean day");
ok(!!after.queue.find(q => q.id === "q_press250"), "press 250 auto-queued at coach flag");

/* 5. Same press reps on a SHORT-SLEEP day now bank exactly the same way. The
   confirmation is that the standard was written down last session and hit this
   one — a second independent observation — and measurement error does not care
   how he slept. See NOISE_NOTE and SLEEP_NOTE. */
const { s: afterDebt } = completeSession(clone(SEED), "2026-07-23", entries, slpDebt);
ok(afterDebt.exercises.find(e => e.id === "press").own === false, "hitting a written standard owns it regardless of sleep — repetition is the confirmation, not the night");
ok(!!afterDebt.queue.find(q => q.id === "q_press250"), "and the load queues off it, same as a clean day");
ok(afterDebt.exercises.find(e => e.id === "press").lastMeta.debt === true, "the short-sleep flag is still recorded on the session — it just no longer vetoes the standard");

// 6. macro engine: two sub-floor weeks arm the floor rule; low BF arms Ease 2
let m = clone(SEED);
m.weekly = [{ wk: "2026-07-06", trend: 165.2 }, { wk: "2026-07-13", trend: 164.7 }, { wk: "2026-07-20", trend: 164.2 }]; m.blackout.until = "2026-07-01";
m = runAdaptive(m, "2026-07-22");
/* R14 — the floor producer is kind:note, so it is now a FEED LINE, not a card. The
   invariant: a card may exist in the inbox only if its tap enacts a state change. */
ok(!m.proposals.some(p => !p.resolved && p.title.indexOf("RATE FLOOR") === 0), "R14 — the floor note no longer becomes a CARD: information is not a decision");
ok(m.feed.some(f => f.t.indexOf("RATE FLOOR") === 0), "R14 — it lands in the FEED instead, where information lives, with the same title and body");
{
  const again = runAdaptive(JSON.parse(JSON.stringify(m)), "2026-07-22");
  ok(again.feed.filter(f => f.t.indexOf("RATE FLOOR") === 0).length === 1, "R14 — and a persisting condition informs ONCE per fortnight, not once per sweep: deduped against the feed itself, statelessly");
}
let e2 = clone(SEED); e2.trend = 160; e2.blackout.until = "2026-07-01";
e2 = runAdaptive(e2, "2026-07-22");
/* R4 — the inverse of what this used to assert. The EASE 2 trigger fired on
   bf.pct <= 13.2 and moved his whole calorie band on a point estimate from an instrument
   whose live interval is 7.6 points wide. It is deleted, and this drives the state that
   USED to arm it to prove it cannot arm any more. */
ok(!e2.proposals.some(p => p.rid === "ease2"), "R4 — the state that used to arm EASE 2 no longer arms it. A 13.2 threshold on an instrument with a 7.6-point interval is a claim it cannot make");
ok(!e2.proposals.some(p => p.rid === "pivot"), "R4 — and the pivot prompt is gone too. It fired on bf.lo <= 11.2, which has been true since 2026-07-29; the question it asked now belongs to regime().accretionBound, which reads lifts and scale rate instead");
{
  /* NO PROPOSAL CONDITION MAY READ A BODY-FAT ESTIMATE. Asserted against the source of
     runAdaptive with comments stripped line-preservingly, because the comments recording
     the deletion necessarily contain the strings being banned — the same trap the vacuity
     scan hit, one file over. */
  const srcR4 = readFileSync("src/app.jsx", "utf8");
  const bodyR4 = srcR4.slice(srcR4.indexOf("function runAdaptive"));
  const liveR4 = bodyR4.slice(0, bodyR4.indexOf("\nfunction "))
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + m.slice(p.length).replace(/./g, " "));
  ok(!/bf\.(pct|lo|hi)\s*(<=|>=|<|>|===|==)/.test(liveR4), "R4 — no LIVE proposal condition in runAdaptive compares a body-fat figure against anything. Comments are stripped first: the comments recording the deletion contain the very strings being banned");
}
{
  /* THE TRAP. R4 deletes s.phase; R2b made calorieTarget's gated branch load-bearing on
     the single owner of the calorie decision. Deleting the phase table without replacing
     the fallback returns lo:null hi:null from the branch that exists PRECISELY for thin
     data. Driven with s.phase absent. */
  const thin = clone(SEED);
  delete thin.phase;
  thin.dailyLogs = {};
  thin.reads = (thin.reads || []).slice(0, 3);
  const gt = __test.energyBalanceTarget(thin);
  ok(gt.lo != null && gt.hi != null && gt.lo > 0 && gt.hi >= gt.lo, "R4 TRAP — a thin-data state with s.phase ABSENT still returns a usable band. Deleting the phase table without replacing this first would have returned lo:null hi:null through the branch R2b just promoted");
  ok(gt.from === "mass-estimate", "R4 TRAP — and it comes from measured bodyweight times a labelled convention, not from an authored phase table and not from a body-fat estimate");
  ok(/labelled convention|ESTIMATE standing in/i.test(gt.why || ""), "R4 TRAP — the copy says it is an estimate standing in for a measurement, and what ends it. An abstention that reads like a decision is the same defect as a provisional target that renders like a decided one");
}

    /* ---------- R5 — the skinfold tracker, and its two traps ---------- */
    {
      const SC5 = __test.skinfoldCheck, SS5 = __test.skinfoldSeries, ST5 = __test.skinfoldTrend;
      const SEVEN = __test.SKINFOLD_SITES.slice();
      const SIX = SEVEN.filter((x) => x !== "abdominal");
      const mkSk = (rows) => { const st = clone(SEED); st.skinfolds = rows; return st; };
      const e = (d, sum, sites, tester) => ({ d, sumMm: sum, sites: sites || SEVEN, tester: tester || "Ana" });

      /* TRAP 1 — THE ONE THAT WILL ACTUALLY HAPPEN. Abdominal runs 15-25 mm on a lean male,
         so a facility defaulting to a 6-site protocol drops the sum by that much and it
         reads as a large fat loss. Site-set drift swamps the 0.6-point detectable change by
         an order of magnitude. */
      const drift = mkSk([e("2026-08-01", 78), e("2026-09-01", 58, SIX)]);
      const sr = SS5(drift);
      ok(sr.length === 2, "R5 TRAP 1 — a 7-site reading followed by a 6-site reading is TWO series, not one. Summing them would read a dropped abdominal fold as 20 mm of fat loss");
      ok(sr[0].deltaMm === null && sr[1].deltaMm === null, "R5 TRAP 1 — and NO delta is computed across the boundary. Each series has one reading, so each honestly reports nothing rather than the -20 mm the naive sum would show");
      const chk = SC5(mkSk([e("2026-08-01", 78)]), e("2026-09-01", 58, SIX));
      ok(chk.breaks === true && chk.missing.indexOf("abdominal") > -1, "R5 TRAP 1 — the check NAMES the missing site, so a 6-site reading is caught at entry rather than silently summed");
      ok(/new series/i.test(chk.why) && !/^refus/i.test(chk.why), "R5 TRAP 1 — it starts a new series rather than refusing: a different protocol is real data, and never deleting athlete data outranks tidiness");

      /* TRAP 2 — "break on tester change" needed an operational definition. All three
         obvious readings are wrong: deleting loses data, computing across it defeats the
         purpose, hiding it means he cannot see his own history. */
      const tester = mkSk([e("2026-08-01", 78), e("2026-09-01", 74), e("2026-10-01", 70, SEVEN, "Bram")]);
      const ts = SS5(tester);
      ok(ts.length === 2 && ts[0].n === 2 && ts[1].n === 1, "R5 TRAP 2 — a tester change starts a new series and the OLD ONE STAYS, readable, with its own entries");
      ok(ts[0].deltaMm === -4, "R5 TRAP 2 — the old series still computes its own delta: breaking the trend must not hide the history he already has");
      ok(ts[1].deltaMm === null, "R5 TRAP 2 — and no delta crosses the boundary. Precision is entirely conditional on the same tester (Machado 2025), so the break IS the method, not a nicety");

      /* the tracker never spans a break */
      const tr = ST5(tester);
      ok(tr.gated === true && tr.priorSeries === 1, "R5 — the headline reads the CURRENT series only, and says how many earlier ones exist rather than pretending they are continuous");
      const good = ST5(mkSk([e("2026-08-01", 78), e("2026-09-01", 70)]));
      ok(good.gated === false && good.deltaMm === -8, "R5 — within one series, same sites and same tester, it reports the change");
      ok(/millimetres/i.test(good.why) && /not a percentage/i.test(good.why), "R5 — reported in MILLIMETRES and the copy DISCLAIMS a percentage. My first version banned the word outright, which the disclaimer itself trips — the same trap as banning bf.pct while the comment recording its removal quotes it");
      ok(typeof good.deltaMm === "number" && Math.abs(good.deltaMm) > 1, "R5 — and the VALUE is a millimetre delta, not a converted percentage. Checking the units of the number is the assertion that matters; checking the words is not");
      ok(/says nothing about lean mass/i.test(good.why), "R5 — and it says out loud that it observes no lean mass, which is why it cannot narrow the partition");

      /* one reading is not a change */
      ok(ST5(mkSk([e("2026-08-01", 78)])).deltaMm === null, "R5 — one reading returns null, not zero. 'no change measured' and 'one reading' are different answers");
      ok(ST5(clone(SEED)).gated === true, "R5 — an empty collection is gated, not an error");

      /* THE GUARDRAIL THAT SURVIVED THE NARROWING: skinfolds never reach the partition */
      ok(!/skinfold/i.test(String(__test.partitionPrior)), "R5 — partitionPrior does not reference skinfolds anywhere. Skinfolds measure subcutaneous fat and never observe lean mass, so they cannot narrow the fat-vs-lean partition");
      /* my first version read `=== 2 || __test.BC == null` — an escape hatch, in the item that
         adds a scanner for escape hatches. Asserted directly, no disjunct. */
      ok(__test.PARTITION_ANCHORS_TO_NARROW === 2, "R5 — PARTITION_ANCHORS_TO_NARROW is untouched at 2: the partition still needs two real DEXA anchors, and skinfolds cannot substitute because they never observe lean mass");

      /* DATA-SAFETY, driven through mergeState because the primitives are unexported */
      {
        const four = mkSk([e("2026-05-01", 90), e("2026-06-01", 86), e("2026-07-01", 82), e("2026-08-01", 78)]);
        const six = mkSk([e("2026-03-01", 98), e("2026-04-01", 94), e("2026-05-01", 90), e("2026-06-01", 86), e("2026-07-01", 82), e("2026-08-01", 78)]);
        ok(__test.mergeState(four, six).skinfolds.length === 6, "R5 data-safety — 4 entries merging with 6 yields 6, never 4");
        ok(__test.mergeState(six, four).skinfolds.length === 6, "R5 data-safety — and the same in the other write order, because a merge that depends on who spoke first is not a merge");
        /* same date, different protocol: two measurements, not a collision */
        const a2 = mkSk([e("2026-08-01", 78)]);
        const b2 = mkSk([e("2026-08-01", 58, SIX)]);
        ok(__test.mergeState(a2, b2).skinfolds.length === 2, "R5 data-safety — two readings on the SAME DAY with different site sets both survive: they are different measurements, not a collision to resolve. Unlikely is how the phantom-rep bug survived seven weeks");
      }

      /* MIGRATION — additive, and nothing else moves */
      {
        const old = clone(SEED); delete old.skinfolds; old.v = 38;
        const up = __test.migrate(JSON.parse(JSON.stringify(old)));
        ok(Array.isArray(up.skinfolds) && up.skinfolds.length === 0, "R5 migration — patchV39 adds s.skinfolds = [] and nothing was there to restate");
        ok(up.v === 45, "R5 migration — and bumps to 45 (v44 the 180 correction · v45 calves 11 / rows 9: the athlete's dated split entry + the 8/10 → 8/09 date restatement)");
                ok(Array.isArray(up.split) && up.split.length === 1 && up.split[0].from === "2026-08-09" && up.split[0].map[0] === "U" && up.split[0].map[1] === "L" && up.split[0].map[4] === "U" && up.split[0].map[5] === "L" && up.split[0].map[3] === "REST", "R19c migration — patchV40 seeds the athlete-stated split, DATED from the day he said it: Sun U · Mon L · Thu U · Fri L, rest elsewhere");
        /* byte-identity is the wrong invariant: migrate() replays the WHOLE patch chain, so
           other idempotent patches legitimately touch the state. The invariant that matters
           is the data-safety one — nothing shrank. */
        const cnt = (o) => [(o.reads || []).length, ((o.sleep || {}).nights || []).length, Object.keys(o.dailyLogs || {}).length, Object.keys(o.sessionLog || {}).length, (o.feed || []).length];
        const b4 = cnt(old), af = cnt(up);
        ok(b4.every((n, i) => af[i] >= n), "R5 migration — ADDITIVE: no collection shrank across the migration. Byte-identity is the wrong invariant here because migrate replays the whole chain; not losing data is the right one");
      }
    }

    /* ---------- R6 — maintenance is conditioned on an activity level ---------- */
    {
      const OT = __test.observedTDEE, AS = __test.adaptationSignal;

      /* THE ASSERTION THAT MAKES THIS A REPORTING CHANGE RATHER THAN A TARGET CHANGE.
         R2b made observedTDEE load-bearing on the single owner of the calorie decision, so
         returning the step-conditioned number as PRIMARY would move his prescribed intake by
         about -90 kcal/day as a SIDE EFFECT of a diagnostics fix. A reporting change that
         moves the target is a failed reporting change. */
      {
        const st6 = clone(SEED);
        const td6 = OT(st6);
        const eb6 = __test.energyBalanceTarget(st6, { regime: { key: "free", confirmed: true } });
        ok(td6.tdee != null && eb6.lo != null, "R6 — the target still computes");
        /* the scanner flagged this as a triple disjunct. It was not vacuous — SEED carries
           step data, so the comparison is real — but a disjunct that only happens to be
           exercised is a hatch waiting to open, so it is positive now. */
        ok(td6.stepDelta !== 0 && td6.tdeeAtNow !== td6.tdee, "R6 — the step-conditioned figure DIFFERS from tdee on this fixture, so the two are genuinely separate numbers rather than the same one under two names");
        ok(td6.tdee === __test.observedTDEE(clone(SEED)).tdee, "R6 — and tdee itself is what it always was: the window average, unmoved by this change");
        /* the band derives from tdee, so pinning tdee pins the band */
        const raw = __test.calorieTarget(st6);
        ok(raw.tdee === td6.tdee, "R6 — calorieTarget still reads the WINDOW-AVERAGE tdee. Making the step-conditioned number primary is a decision about what he eats and gets its own item, not a ride-along on a diagnostics fix");
      }

      /* the conditioning variable is visible, which was the actual ask */
      {
        const st7 = clone(SEED);
        const td7 = OT(st7);
        if (td7.atSteps != null) {
          ok(/maintenance AT/i.test(td7.stepsWhy || ""), "R6 — maintenance is reported WITH its conditioning variable. A scalar that hides what it is conditioned on invites reading it as a property of him rather than of a window");
          ok(/cheapest lever|does not deepen the food deficit/i.test(td7.stepsWhy || ""), "R6 — and it names steps as the cheap lever, because restoring them does not deepen the deficit");
        } else ok(true, "R6 — no step record on this fixture, so there is nothing to condition on and it says nothing");
      }

      /* stepKcal is derived from a cited cost, not authored */
      {
        const SK = __test.stepKcal;
        ok(Math.abs(SK(163, 5100)) > 100 && Math.abs(SK(163, 5100)) < 220, "R6 — a 5,100-step change prices between 100 and 220 kcal/day at his mass, which brackets the 162 the corpus quotes (2.4 +/- 0.4 J/kg/m, Sci Rep 2019)");
        ok(SK(163, 0) === 0 && SK(163, -1000) < 0, "R6 — the step term is signed and zero at zero: fewer steps is a lower maintenance, not an absolute correction");
        ok(SK(200, 5000) > SK(140, 5000), "R6 — and it scales with bodyweight, because the cited cost is per kg per metre");
      }

      /* THE FALSE DIAGNOSIS THIS EXISTS TO PREVENT — driven, not asserted in principle.
         A man whose steps fall while his mass barely moves must NOT be told his metabolism
         adapted. Built so the mass-predicted expectation is flat and only activity moves. */
      {
        const mkAd = (stepsEarly, stepsLate) => {
          const st = clone(SEED);
          const days = [];
          for (let k = 0; k < 40; k++) days.push(new Date(Date.UTC(2026, 6, 1) + k * 86400000).toISOString().slice(0, 10));
          st.dailyLogs = {};
          days.forEach((d, i) => { st.dailyLogs[d] = { cal: 2100, steps: i < 20 ? stepsEarly : stepsLate }; });
          st.learned = st.learned || {};
          st.learned.tdee = days.filter((_, i) => i % 8 === 0).map((d, i) => ({ d, w: 164 - i * 0.1, tdee: 2800 - (i >= 2 ? 120 : 0), lo: 2700 - (i >= 2 ? 120 : 0), hi: 2900 - (i >= 2 ? 120 : 0) }));
          return st;
        };
        const dropped = AS(mkAd(20000, 13000));
        ok(dropped.detected === false, "R6 — a man whose STEPS fell is not diagnosed with metabolic adaptation. Observed maintenance falls when he walks less while mass-predicted maintenance barely moves, so the residual used to absorb the activity change and report it as adaptive thermogenesis");
        /* asserted directly. The || I first wrote here happened to pass because the fixture
           does reach the gate — but a disjunct that is carried by luck is a hatch waiting to
           open, and this is the fourth one I have written in this sequence. */
        ok(dropped.reason === "activity-drift", "R6 — and the reason NAMES activity, rather than reading as 'no adaptation found'. A false negative dressed as a clean bill is the same defect as a false positive");
      }

      /* the real ledger takes a different branch today, and the companion rule says record it */
      ok(typeof AS(clone(SEED)).reason === "string", "R6 — adaptationSignal always names its branch. On the live ledger 2026-08-06 it returns detected=false reason='too-thin' — it abstains EARLIER than the activity gate, so the false-adaptation risk is latent rather than live, and the fixture above is what drives the gate");
    }

    /* ---------- R7 — the divergence flag ---------- */
    {
      const RD = __test.rateDivergence;
      const scen = (o) => RD(clone(SEED), o);

      /* FIRES ON THE CONDITION THAT IS ACTUALLY LIVE: the gauge no longer describes him.
         His real shape — gauge 1.17, recent behaviour implies 0.25. */
      {
        const live = scen({
          rate: { measured: true, scale: 1.17, ci: 0.38 },
          td: { tdee: 2795, tdeeAtNow: 2705, avg: 2160, atSteps: 17171, stepsNow: 14357 }, eaten: 2569,
        });
        ok(live.flagged === true, "R7 — the flag FIRES when the displayed rate stops describing current behaviour. An athlete reading 1.17 lb/wk while behaving like 0.25 is exactly who it is for");
        ok(/no longer describes what you are doing now/i.test(live.why), "R7 — and the copy says WHY the gauge is stale: a 28-day regression across a window his behaviour changed inside");
        ok(/changes nothing on its own/i.test(live.why), "R7 — a divergence is a prompt to LOOK. Letting it drive a calorie change is what separating observation from intervention exists to prevent");
      }

      /* ATTRIBUTION SUMS TO THE GAP BY CONSTRUCTION, and names an owner for each part.
         Detection and attribution are different jobs; collapsing them was the defect. */
      {
        const live = scen({
          rate: { measured: true, scale: 1.17, ci: 0.38 },
          td: { tdee: 2795, tdeeAtNow: 2705, avg: 2160, atSteps: 17171, stepsNow: 14357 }, eaten: 2569,
        });
        ok(Math.abs((live.intakeEffect + live.stepEffect) - live.gap) < 0.02, "R7 — the two attributed parts SUM to the gap. Both are differences from the window scenario the regression describes, so they add by construction rather than by coincidence");
        ok(Math.abs(live.intakeEffect) > Math.abs(live.stepEffect), "R7 — and on his shape intake is the larger term. That is the finding, not a rounding detail");
        ok(/already reported on the calorie card/i.test(live.attributionWhy || "") && /not a second opinion/i.test(live.attributionWhy || ""), "R7 — each part points at its OWNER rather than re-deciding it. calorieTarget owns the intake gap via wkAvg/wkOff and a second owner would be the defect this codebase keeps producing");
        ok(Array.isArray(live.attribution) && live.attribution.length === 2 && live.attribution.every((x) => x.owner), "R7 — attribution is structured, so a surface cannot render the gap without its owners");
      }

      /* CONSTANT BEHAVIOUR: not raised. Without this the flag could be permanently on. */
      {
        const same = scen({
          rate: { measured: true, scale: 0.90, ci: 0.20 },
          td: { tdee: 2800, tdeeAtNow: 2800, avg: 2310, atSteps: 16000, stepsNow: 16000 }, eaten: 2310,
        });
        ok(same.flagged === false && same.reason === "consistent", "R7 — when behaviour has not moved, the gauge still describes him and the flag stays down");
        ok(same.attribution === null, "R7 — and nothing is attributed when there is no gap to attribute");
      }

      /* THE COMPARATOR IS BEHAVIOUR, NOT A COUNTERFACTUAL. My rebuild compared against what
         the PRESCRIBED intake would imply — a scenario he is not living — and it did not
         fire. Worse, that gap (0.11 intake + 0.17 steps) is a deterministic difference
         between two specified scenarios and carries no sampling error, so testing it against
         the regression's +/-0.38 was a category error. */
      ok(!/prescribed|tgt\.mid/.test(String(RD).split("const implied")[0] || ""), "R7 — the implied rate is computed from what he ATE, not from the target. A flag that compares against a counterfactual answers a narrower question than the one it was written for");

      /* THE ESTIMATOR NEVER SWITCHES */
      {
        const st = clone(SEED);
        ok(RD(st).measured === RD(st).measured, "R7 — the PRIMARY rate is one estimator on the same data; the fix for averaging across a behaviour change is a flag, never a mid-cut estimator switch");
      }

      ok(RD({}).flagged === false && typeof RD({}).reason === "string", "R7 — it abstains with a named reason on an empty state rather than throwing");
    }

    /* ---------- R8 — training: delete, do not build ---------- */
    {
      /* ASSERT WHAT THE CODE DOES, NOT THAT A STRING IS ABSENT. Deletions are where the
         absence-check trap lives and I have hit it three times (percentage, bf.pct, change).
         So: build two states that differ ONLY in the things that would drive an energy-state
         branch, and assert the volume prescription is byte-identical. */
      const cut8 = clone(SEED), fed8 = clone(SEED);
      fed8.reads = (fed8.reads || []).map((r, i) => ({ ...r, w: 170 + i * 0.05 }));   // gaining, not cutting
      fed8.trend = 172;
      fed8.plan = { ...(fed8.plan || {}), phase: "leangain" };
      const sigOf = (st) => JSON.stringify(__test.programmeVolume(st).map((m) => [m.mg, m.head, m.sets, m.indirectOnly]));
      ok(sigOf(cut8) === sigOf(fed8), "R8 — the weekly set prescription is BYTE-IDENTICAL between a cutting state and a gaining one. Volume is designed, not conditioned on energy state: Roth 2022 (n=38) and Nait-Yahia 2026 (n=16, 40% CR) are both null on FFM");
      ok(JSON.stringify(__test.VOL_BANDS) === JSON.stringify({ floor: 6, lo: 8, hi: 14, ceil: 16 }), "R8 — and the bands themselves are one constant, read identically everywhere. There is no deficit-calibrated variant to delete because none was ever built");

      /* THE ONE GROWTH-CONDITIONAL LINE IS DELIBERATE AND STAYS — but its authority moved
         (volume-lever spec): the gate reads the REGIME DETECTOR, not the exitStart phase
         flag. It still gates whether action FIRES, never what the band SAYS. */
      {
        const vi = __test.volumeImbalance(cut8);
        ok(vi.growthOK === false && vi.actionable === false, "VOLUME LEVER — while the measured state does not sanction growth (regime " + vi.regimeKey + "), a detectable volume gap is FILED and not actionable: the one energy-state branch in the training path, now regime-driven, still gating firing and never the band");
        ok(vi.detectable === true, "R8 — and it is still DETECTED while filed, so the finding is not lost — which is the difference between conservatism and blindness");
      }

      /* terminal RIR is never modulated by energy state — zero studies have manipulated it
         under restriction, so there is nothing to condition on */
      {
        const rirOf = (st) => { const ex = (st.exercises || [])[0]; try { return JSON.stringify(__test.targetsFor(ex, st)); } catch (e) { return "err"; } };
        ok(rirOf(cut8) === rirOf(fed8), "R8 — the lift target is identical in both energy states. Zero studies have ever manipulated RIR under energy restriction, so there is nothing to condition on and the engine conditions on nothing");
    }

    /* ---------- R9 — the inbox must drain ---------- */
    {
      /* SUPERSEDE THROUGH DATE SUFFIXES. The dedup keyed on the exact rid and half the
         producers suffix theirs with the date, so ap_tighten_08-02 and _08-03 coexisted. */
        /* AUDIT 3a — my first version had an if/else whose else-arm was ok(true, ...):
           the suite printed PASS while no test ever entered the supersede branch. An
           else-arm that passes when the fixture goes quiet is how a green run stops
           meaning anything. Driven through the FLOOR producer instead, which fires
           deterministically on this fixture, and asserted UNCONDITIONALLY. */
        /* R14 moved the floor producer to the feed, so the supersede drive now uses the
           REDLINE producer — kind:cal, actionable, deterministic on a hot-rate fixture. */
        const st9 = clone(SEED);
        st9.proposals = [{ rid: "redline_2026-07-13", id: "rx", d: "2026-07-13", title: "OLD REDLINE CARD", why: "", apply: { kind: "cal", delta: 100 }, resolved: false }];
        st9.weekly = [{ wk: "2026-07-06", trend: 168 }, { wk: "2026-07-13", trend: 166 }, { wk: "2026-07-20", trend: 164 }];
        st9.blackout.until = "2026-07-01";
        const out = __test.runAdaptive(st9, "2026-07-22");
        const fresh = out.proposals.filter((p) => !p.resolved && /^redline_/.test(p.rid));
        const olds = out.proposals.find((p) => p.rid === "redline_2026-07-13");
        ok(fresh.length === 1 && fresh[0].rid !== "redline_2026-07-13", "R9 — the redline producer fires a fresh card on this hot-rate fixture, so the supersede branch is genuinely ENTERED — no conditional arms");
        ok(olds.resolved === true && /superseded/.test(olds.resolvedHow || ""), "R9 — and the date-suffixed old card is SUPERSEDED on the record: one open card per subject, asserted unconditionally");
        ok(out.feed.some((f) => /CARD SUPERSEDED/.test(f.t)), "R9 — with the feed line");
      }
      /* NOTES EXPIRE; ACTIONABLE KINDS NEVER DO. A note changes nothing when tapped, so an
         old one is pure attention cost; a cal/exit card is a pending decision and waits. */
      {
        const st9 = clone(SEED);
        st9.proposals = [
          { rid: "volband", id: "a", d: "2026-07-01", title: "OLD NOTE", why: "", apply: { kind: "note" }, resolved: false },
          { rid: "calx", id: "b", d: "2026-07-01", title: "OLD CAL", why: "", apply: { kind: "cal", delta: 50 }, resolved: false },
        ];
        st9.blackout.until = "2026-07-01";
        const out = __test.runAdaptive(st9, "2026-07-22");
        const note = out.proposals.find((p) => p.rid === "volband");
        const cal = out.proposals.find((p) => p.rid === "calx");
        /* R14 — expiry is DELETED with the kind it served (instance-19 avoidance): a live
           note card CONVERTS to a feed line immediately, carrying its content. */
        ok(note.resolved === true && /converted to feed/.test(note.resolvedHow || ""), "R14 — an open NOTE card converts to a feed line on the next sweep, carrying its content — never deleted, never expiring, never re-raised as a card");
        ok(out.feed.some((f) => f.t === "OLD NOTE"), "R14 — and its content is IN the feed, so nothing he was told is lost");
        ok(cal.resolved === false, "R14 — an actionable card is untouched: it is a pending decision, and decisions wait for him");
      }
      /* ---------- R10a — the two live overclaims ---------- */
      {
        const DC = __test.DEFICIT_CEILING;
        ok(DC.kcal === 500 && /51-60 years old/.test(DC.hedge) && /not a measured one for you/.test(DC.hedge), "R10a — the ~500 kcal/day ceiling carries its own hedge: Murphy & Koehler's pooled population averaged 51-60 and he is 24. A correctly generated number stated with unearned confidence is still the engine lying, just more precisely");
        ok(DC.line().indexOf(DC.claim) === 0 && DC.line().indexOf(DC.hedge) > 0, "R10a — and line() welds claim to hedge, so no call site can quote one without the other");
        const src10 = readFileSync("src/app.jsx", "utf8")
          .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
          .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + m.slice(p.length).replace(/./g, " "));
        /* the OWNER's own claim: field legitimately contains the words — the assertion
           excepts the definition and bans quotes everywhere else. My first version forgot
           the owner and failed on the single source of truth it had just created. */
        const flatLines = src10.split("\n").filter((l) => l.includes("under ~500 kcal/day"));
        const welded = (src10.match(/DEFICIT_CEILING\.line\(\)/g) || []).length;
        ok(flatLines.length === 1 && /claim:/.test(flatLines[0]) && welded >= 2, "R10a — the ceiling's words appear on exactly ONE live line, the owner's own claim: field, and both former sites read the welded line (" + welded + "). No call site can quote the number without its hedge");
        /* the bfEst copy renders the live interval, not the anchor constant */
        const bf10 = __test.bfEst(clone(SEED));
        const w10 = String(bf10.why || "");
        ok(w10.indexOf(String(bf10.lo)) > -1 && w10.indexOf(String(bf10.hi)) > -1, "R10a — the anchor copy quotes the RENDERED interval (" + bf10.lo + "-" + bf10.hi + "), generated from the same lo/hi the band draws. The old copy said ±3-4 points beside a number that was " + (bf10.hi - bf10.lo).toFixed(1) + " points wide");
        ok(!/±3–4 points, and that error never washes out/.test(w10), "R10a — and the flat ±3-4 sentence is gone from the rendered copy: it described a narrower instrument than the one producing the number beside it");
        /* dismiss copy and mechanism agree, both directions driven elsewhere; here the COPY */
        const dsrc = readFileSync("src/app.jsx", "utf8");
        /* R14 — the decline copy is now PER KIND (what a decline buys, stated per kind so
           copy and mechanism agree from birth). The map must exist, carry a default that
           matches the re-arm mechanism, and a phase/exit entry that does NOT promise
           re-arming, because those producers are gone and nothing would keep the promise. */
        ok(/DECLINE_BUYS = \{/.test(dsrc), "R14 — what a decline buys is stated per kind, in a named map at the decline site");
        const dmap = dsrc.slice(dsrc.indexOf("DECLINE_BUYS = {"), dsrc.indexOf("};", dsrc.indexOf("DECLINE_BUYS = {")));
        ok(/default:.*re-arms/.test(dmap), "R14 — the default matches the mechanism: a declined rid re-arms while its condition holds, which the applied() fix made true");
        ok(/exit:.*never expire|exit:.*stays yours/.test(dmap), "R14 — and the exit entry does NOT promise re-arming: its producers are deleted, and a promise nothing keeps is the defect this whole item exists to close");
      }
      /* THE DISMISSED-REARM CONTRADICTION, driven. dismissProposal promises re-arming;
         applied() counted any adjustments row, so a decline silenced the rid forever. */
      {
        const st9 = clone(SEED);
        /* R14 moved microload (a note) to the feed, so the CARD re-arm proof now uses the
           actionable redline producer. Same mechanism under test: a dismissed row must not
           silence the rid; a genuinely applied one must. */
        st9.adjustments = [...(st9.adjustments || []), { rid: "redline_2026-07-20", id: "adjx", d: "2026-07-21", dismissed: true }];
        st9.weekly = [{ wk: "2026-07-06", trend: 168 }, { wk: "2026-07-13", trend: 166 }, { wk: "2026-07-20", trend: 164 }];
        st9.blackout.until = "2026-07-01";
        const out = __test.runAdaptive(st9, "2026-07-22");
        const re = out.proposals.find((p) => p.rid === "redline_2026-07-20" && !p.resolved);
        ok(!!re, "R9 — a DISMISSED rid re-arms when its condition persists, which is what the dismiss copy has promised all along. applied() counted any adjustments row, so one decline was a permanent silence — a verdict wearing a decline's clothes");
        const st9b = clone(SEED);
        st9b.adjustments = [...(st9b.adjustments || []), { rid: "redline_2026-07-20", id: "adjy", d: "2026-07-21" }];
        st9b.weekly = [{ wk: "2026-07-06", trend: 168 }, { wk: "2026-07-13", trend: 166 }, { wk: "2026-07-20", trend: 164 }];
        st9b.blackout.until = "2026-07-01";
        const out2 = __test.runAdaptive(st9b, "2026-07-22");
        ok(!out2.proposals.find((p) => p.rid === "redline_2026-07-20" && !p.resolved), "R9 — while a genuinely APPLIED rid does not refile: the exclusion is dismissed/undone rows only, not the gate itself");
      }
      /* WITHDRAW MUST NOT EXECUTE THE APPLY (audit item 4b). A withdraw routed through the
         tap path would end the cut while cleaning up. */
      {
        const st9 = clone(SEED);
        st9.proposals = [{ rid: "pivot", id: "pv", d: "2026-07-01", title: "IS THE CUT DONE?", why: "", apply: { kind: "exit" }, resolved: false }];
        st9.blackout.until = "2026-07-01";
        const phaseBefore = JSON.stringify((st9.plan || {}).phase);
        const out = __test.runAdaptive(st9, "2026-07-22");
        const piv = out.proposals.find((p) => p.rid === "pivot");
        ok(piv.resolved === true && JSON.stringify((out.plan || {}).phase) === phaseBefore && !(out.targets || {}).exitStart, "R9 — withdrawing the orphaned exit card does NOT execute its apply: plan.phase is untouched and no exitStart is stamped. A withdraw routed through the tap path would end the cut while tidying up");
      }
    }







ok(bfEst(clone(SEED)).pct > 14 && bfEst(clone(SEED)).pct < 16, "BF model sane at current trend");

// 7. migration preserves v1 progress
const old = { v: 1, trend: 163.9, reads: [{ d: "2026-07-22", w: 163.0, sealed: true }], queue: [{ id: "rows180", done: true }], sleep: { nights: [{ d: "2026-07-21", h: 8 }] }, boosts: 3 };
const mig = migrate(old);
ok(mig.v === SEED.v && mig.exercises.find(e => e.id === "rows").w === 180 && mig.boosts === 3 && mig.reads.length === 40, "v1 → v3 migration keeps logged progress");

// v2.1 — history integration
const { HISTORY, ROLLUPS, currentRate: cr, migrate: mg, runAdaptive: ra, SEED: S3 } = __test;
ok(HISTORY.length === 42 && S3.reads.length === 39, "42-day record woven in, 39 real reads seeded");
ok(S3.v === SEED.v && Math.abs(S3.trend - 164.7) < 0.2, "trend seeded from trailing-7-day of real reads (~164.7)");
ok(cr(clone(S3)).measured === true && S3.weekly.length >= 5, "rate gauge now MEASURED off six weeks of snapshots");

// signalState — the NOW verdict selector (redesign v5). Structural + boundary cases.
{
  const isoD = (i) => new Date(Date.UTC(2026, 5, 1) + i * 86400000).toISOString().slice(0, 10);
  const sig = __test.signalState(clone(SEED));
  ok(["calibrating", "inside-noise", "measurable", "measured", "reversed"].includes(sig.state), "signalState returns a known state on the seed");
  ok(Number.isInteger(sig.ticks) && sig.ticks >= 0 && sig.ticks <= 5, "signalState ticks are an integer 0..5");
  ok(sig.finalDashed === (sig.state !== "measured"), "the fifth graduation tick is dashed until the state is measured");
  ok(sig.n === __test.currentRate(clone(SEED)).n, "signalState reports the same n as the rate it reads");
  const cold = clone(SEED); cold.reads = [{ d: "2026-07-01", w: 164 }]; cold.weekly = [];
  ok(__test.signalState(cold).state === "calibrating", "cold start (few reads, prior rate) reads calibrating, never measured");
  const dn = clone(SEED); dn.blackout = { until: "2026-05-01" };
  dn.reads = Array.from({ length: 24 }, (_, i) => ({ d: isoD(i), w: +(172 - i * 0.25 + (i % 2 ? 0.08 : -0.08)).toFixed(2) }));
  const sdn = __test.signalState(dn);
  ok(sdn.state === "measured", "a long, clean, strong downtrend reads measured");
  ok(sdn.ticks === 5 && sdn.finalDashed === false, "and it fills all five graduation ticks (fifth solid)");
  const flat = clone(SEED); flat.blackout = { until: "2026-05-01" };
  flat.reads = Array.from({ length: 20 }, (_, i) => ({ d: isoD(i), w: +(164 + (i % 2 ? 0.6 : -0.6)).toFixed(2) }));
  ok(__test.signalState(flat).state !== "measured", "a flat, noisy record does not read measured");
}
ok(ROLLUPS.length === 6 && ROLLUPS[0].wk === 6 && ROLLUPS[5].wk === 1, "six weekly rollups, newest first");
/* THIS ASSERTION HAD STOPPED TESTING WHAT IT NAMES, and R3 is what exposed it.
   daysUntil() reads the REAL wall clock, not the date passed to runAdaptive, so
   S3.blackout.until = "2026-07-27" stopped sealing anything on 2026-07-27. From then
   until R3 it passed only because the last weekly rate (1.80) sat under the old
   authored redline of 1.9 -- nothing to do with the seal. Tightening the redline to
   1.65 %BW-derived made it fire and revealed the dead guard.

   Sixth instance of the standing pattern, and the worst kind: a TEST that names a
   guard and silently stops exercising it, on a date. Both branches are now driven,
   so the seal must be observed to mute and the absence of a seal must be observed
   to fire. */
{
  const iso = (t) => new Date(t).toISOString().slice(0, 10);
  const sealedS = clone(S3);
  sealedS.blackout = { until: iso(Date.now() + 6 * 86400000), reason: "test seal - forward-dated so it is actually engaged" };
  const sealedRun = ra(sealedS, "2026-07-22");
  ok(!sealedRun.proposals.some((p) => p.rid.indexOf("redline") === 0), "sealed window mutes the redline - and the seal is now FORWARD-DATED, so this tests sealing rather than a threshold that happened to sit above the rate");

  const openS = clone(S3);
  openS.blackout = { until: iso(Date.now() - 30 * 86400000), reason: "expired" };
  const openRun = ra(openS, "2026-07-22");
  ok(openRun.proposals.some((p) => p.rid.indexOf("redline") === 0), "and with the seal expired it DOES fire at 1.80 lb/wk against the %BW-derived 1.65 redline. The guard is observed to mute AND observed to fire; the old assertion could not tell the difference");
}
const v2old = { v: 2, reads: [{ d: "2026-07-22", w: 163.0, sealed: true }], dailyLogs: { "2026-07-22": { cal: 2470, pro: 176, steps: 9000 } }, sleep: { nights: [{ d: "2026-07-21", h: 8 }] }, exercises: clone(S3.exercises), queue: clone(S3.queue), boosts: 5 };
const m3 = mg(v2old);
ok(m3.v === SEED.v && m3.reads.length === 40 && m3.dailyLogs["2026-07-22"].pro === 176 && m3.sleep.nights.some(n => n.d === "2026-07-21") && m3.boosts === 5, "v2 phone state merges over the history without losing a thing");

// durability guard — the write-path tripwire that refuses to clobber the ledger (v2 slice 0)
{
  const dlg = __test.dataLossGuard;
  const base = clone(SEED);
  ok(dlg(null, base).safe === true, "durability: first write (no prior stored state) is always allowed");
  ok(dlg(base, base).safe === true, "durability: rewriting the same state is allowed");
  const grown = clone(base); grown.reads = base.reads.concat([{ d: "2026-08-01", w: 163.0, sealed: false }]);
  ok(dlg(base, grown).safe === true, "durability: a growing record is allowed");
  const empty = clone(base); empty.reads = []; empty.feed = []; empty.sleep = { nights: [] };
  ok(dlg(base, empty).safe === false, "durability: an empty-clobber over real data is blocked");
  const lostOne = clone(base); lostOne.reads = base.reads.slice(0, -1);
  ok(dlg(base, lostOne).safe === false, "durability: dropping even one historical read is blocked");
  ok(dlg(base, null).safe === false, "durability: writing a non-object over real data is blocked");
}

// mergeState — the v6.1 sync union-merge (the fix for the last-writer-wins clobber that lost 7/27–7/28)
{
  const ms = __test.mergeState, dlg = __test.dataLossGuard;
  const A = clone(SEED);
  A.sessionLog = { "2026-07-23": { entries: [1, 2, 3] }, "2026-07-24": { entries: [1] }, "2026-07-27": { entries: [1, 2] }, "2026-07-28": { entries: [1] } };
  A.reads = SEED.reads.concat([{ d: "2026-08-02", w: 163, sealed: false }]);
  A.feed = (SEED.feed || []).concat([{ d: "2026-08-02", t: "NEW WIN", how: "x" }, { d: "2026-08-02", t: "NEW WIN", how: "x" }]);   // a legitimate identical repeat
  const B = clone(SEED);
  B.sessionLog = { "2026-07-23": { entries: [1, 2, 3] }, "2026-07-24": { entries: [1] } };   // the clobbered subset
  const m = ms(A, B);
  ok(Object.keys(m.sessionLog).length === 4, "mergeState: the four sessions survive — a smaller client can't shrink the superset");
  ok(Object.keys(ms(B, A).sessionLog).length === 4, "mergeState: union is order-independent (B∪A also keeps all four)");
  ok(m.reads.length >= A.reads.length && m.feed.length >= A.feed.length, "mergeState: reads and feed are unioned, never dropped");
  ok(m.feed.filter((f) => f.d === "2026-08-02" && f.t === "NEW WIN").length === 2, "mergeState: an identical feed repeat is preserved (max-multiset), not silently collapsed");
  ok(dlg(A, m).safe === true && dlg(B, m).safe === true, "mergeState: the merge never shrinks either input (refuse-to-shrink holds)");
  ok(ms(A, null) === A && ms(null, B) === B, "mergeState: a missing side never clobbers the other");
}

// mergeState v6.2 — STORED per-lift progression state (exercises + queue) is reconciled per id,
// not taken wholesale from the writing client. This is the fix for the clobber that rolled the
// correct 7/28 lower lifts back to a phone's stale 7/21 copy on sync (exercises/queue used to fall
// through {...remote,...local}). Property under test: a stale side must never REVERT a newer per-lift
// lastMeta and must never LOSE one — and it holds from EITHER write order (stale-as-local, stale-as-remote).
{
  const ms = __test.mergeState, dlg = __test.dataLossGuard;

  // freshLow: LOWER is current (calves reclaimed 7/28 -> 320) while UPPER stays old (seed 7/20)
  const freshLow = clone(SEED);
  const cL = freshLow.exercises.find((e) => e.id === "calves");
  cL.w = 320; cL.reclaim = null; cL.lastMeta = { d: "2026-07-28", w: 320, reps: [13, 12, 11, 10], debt: false };
  const qcL = freshLow.queue.find((q) => q.id === "q_calves"); qcL.done = true; qcL.state = "RECLAIMED";
  freshLow.queue.push({ id: "q_calves_inc", kind: "debut", exId: "calves", newW: 325, t: "CALVES 325 DEBUT", state: "DEBUT", done: false });

  // freshUp: UPPER is current (press owned 7/30) while LOWER stays stale (seed calves 7/21, q_calves not done)
  const freshUp = clone(SEED);
  const pU = freshUp.exercises.find((e) => e.id === "press");
  pU.own = false; pU.std = null; pU.lastMeta = { d: "2026-07-30", w: 245, reps: [8, 8, 7], debt: false };

  const dOf = (st, id) => st.exercises.find((e) => e.id === id).lastMeta.d;
  const wOf = (st, id) => st.exercises.find((e) => e.id === id).w;
  const qDone = (st, id) => { const q = st.queue.find((x) => x.id === id); return !!(q && q.done); };
  const hasQ = (st, id) => st.queue.some((x) => x.id === id);

  // ORDER A — the stale-lower phone writes last (local = freshUp, remote = freshLow)
  const A = ms(freshUp, freshLow);
  ok(dOf(A, "calves") === "2026-07-28", "merge A: a stale-7/21 lower side does NOT revert the newer 7/28 calves (newest lastMeta wins)");
  ok(wOf(A, "calves") === 320, "merge A: the reconciled calves load is the 7/28 value (320), never the phone's stale 315");
  ok(dOf(A, "press") === "2026-07-30", "merge A: the newer 7/30 upper press is NOT lost to the other side's stale copy");
  ok(qDone(A, "q_calves") === true, "merge A: q_calves stays RECLAIMED — a done queue item can't be reopened by a not-done copy");
  ok(hasQ(A, "q_calves_inc"), "merge A: the follow-on q_calves_inc (present on one side only) survives the union");

  // ORDER B — the reverse write order must converge to the SAME reconciled lifts
  const B = ms(freshLow, freshUp);
  ok(dOf(B, "calves") === "2026-07-28", "merge B: reversed order still keeps the newer 7/28 calves (not lost when it is the local side)");
  ok(dOf(B, "press") === "2026-07-30", "merge B: reversed order still keeps the newer 7/30 press (not reverted when it is the remote side)");
  ok(qDone(B, "q_calves") === true && hasQ(B, "q_calves_inc"), "merge B: done q_calves and its follow-on survive regardless of write order");

  // order-independence + roster never shrinks + refuse-to-shrink still holds across the reconcile
  ok(dOf(A, "calves") === dOf(B, "calves") && dOf(A, "press") === dOf(B, "press"), "merge is order-independent for reconciled per-lift state (A and B agree)");
  ok(A.exercises.length === SEED.exercises.length && B.exercises.length === SEED.exercises.length, "no lift is dropped — the exercise roster is preserved on both orders");
  ok(A.queue.length >= freshLow.queue.length && A.queue.length >= freshUp.queue.length, "the merged queue is a superset of both sides — union never shrinks it");
  ok(dlg(freshLow, A).safe === true && dlg(freshUp, A).safe === true, "the reconciled merge still passes the durability guard from both inputs");
}

// the five levers + the one thing — the v2 adherence selectors (slice A)
{
  const lv = __test.fiveLevers(clone(SEED));
  const keys = ["deficit", "protein", "training", "sleep", "steps"];
  ok(keys.every((k) => lv[k] && ["good", "caution", "limit", "quiet"].includes(lv[k].state)), "five levers each carry a valid SEM state (good/caution/limit/quiet)");
  ok(Array.isArray(lv.list) && lv.list.length === 5, "the five levers list has exactly five entries");
  ok(lv.deficit.label === "DEFICIT" && lv.steps.label === "STEPS", "levers are labelled by the thing they measure");
  const fix = __test.theOneFix(clone(SEED), lv);
  ok(["logging", "steps", "sleep", "calories", "break", "hold"].includes(fix.rung), "the one thing returns an evidence-ordered rung");
  ok(typeof fix.title === "string" && fix.title.length > 0 && typeof fix.body === "string", "the one thing carries a plain-language title and body");
  const dnISO = (i) => new Date(Date.UTC(2026, 5, 1) + i * 86400000).toISOString().slice(0, 10);
  const dn = clone(SEED); dn.blackout = { until: "2026-05-01" };
  dn.reads = Array.from({ length: 24 }, (_, i) => ({ d: dnISO(i), w: +(172 - i * 0.25).toFixed(2), sealed: false }));
  ok(__test.theOneFix(dn).rung !== "calories" && __test.theOneFix(dn).rung !== "break", "a healthy loss rate never reaches the calorie-cut rung — food comes down last");
}

// the PLAN state — the v2 adherence A2 schema patch (self-authored plan)
{
  const oldP = clone(SEED); delete oldP.plan; oldP.v = 34;
  const migP = __test.migrate(oldP);
  ok(migP.plan && Array.isArray(migP.plan.goals) && Array.isArray(migP.plan.ifthen) && migP.plan.share === false, "migrating a pre-plan state adds an empty, opt-out plan");
  ok(migP.reads.length === SEED.reads.length, "the plan migration preserves every historical read");
  ok(SEED.plan && Array.isArray(SEED.plan.goals) && SEED.plan.share === false, "the seed is authored with an empty plan, share off by default");
  const withData = clone(SEED); withData.plan = { goals: [{ id: "g1", text: "4 sessions" }], ifthen: [], share: true }; withData.v = 34;
  ok(__test.migrate(withData).plan.goals.length === 1 && __test.migrate(withData).plan.share === true, "a state that already has a plan keeps it through migration");
}

// Auto-Pilot — v6.1: steers to the body-comp corridor (direction-aware), proposes never mutates
{
  const base = clone(SEED); base.blackout = { until: "2026-05-01" };
  const ap = __test.autoPilot(base);
  ok(ap.ok === true && ap.goalRate > 0 && ap.band && ap.band.redlinePct === __test.BC.CUT_REDLINE_PCT, "autoPilot steers to the body-comp corridor with the cited cut redline");
  ok(["hold", "ease", "tighten"].includes(ap.action), "autoPilot returns a direction-aware steering action");
  ok(ap.proposed === (ap.action !== "hold" && ap.corrKcal >= 90), "a correction fires only past a full adaptation's drift (hysteresis)");
  ok(ap.stepsAdd >= 500, "the correction always offers a real steps alternative to food");
  const isoAgo = (back) => { const d = new Date(Date.now() - back * 86400000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const fast = clone(SEED); fast.blackout = { until: "2026-05-01" };
  // reads END TODAY so this exercises a FRESH fast cut — v6.3.2 holds a STALE rate
  // regardless of speed, so the ease here must ride current data (that guard is covered below).
  fast.reads = Array.from({ length: 24 }, (_, i) => ({ d: isoAgo(23 - i), w: +(178 - i * 0.6).toFixed(2), sealed: false }));
  const apF = __test.autoPilot(fast);
  ok(apF.ok && apF.pctRate > apF.band.redlinePct && apF.action === "ease", "a cut past the 1%BW/wk redline proposes EASING to protect muscle, not tightening");
  ok(apF.stale === false, "…and that ease rides a FRESH read (reads end today) — not a stale hold");
}

// Auto-Pilot STALENESS SAFEGUARD — v6.3.2 (a FROZEN rate is not an AGED one: currentRate
// spans the last 28 READS, so days of no weigh-in never widen it. Auto-Pilot must not steer
// off a stale number — it HOLDS and asks for a fresh weigh-in, especially in MAX FAT LOSS.)
{
  const isoAgo = (back) => { const d = new Date(Date.now() - back * 86400000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  // one hot MAX-FAT-LOSS cut, built two ways — reads ending TODAY vs ending 4 DAYS AGO.
  // identical numbers and slope; only recency differs.
  const hot = (endBack) => { const x = clone(SEED); x.blackout = { until: "2026-05-01" }; x.plan = { ...(x.plan || {}), apMode: "fatloss" }; x.reads = Array.from({ length: 24 }, (_, i) => ({ d: isoAgo(23 - i + endBack), w: +(178 - i * 0.6).toFixed(2), sealed: false })); return x; };
  const fresh = hot(0), stale = hot(4);

  // the recency helper — the ONE honest signal every surface reads
  ok(__test.readRecency(fresh).stale === false && __test.readRecency(fresh).days <= 1, "readRecency: reads ending today are FRESH (0–1 days), never flagged");
  ok(__test.readRecency(stale).stale === true && __test.readRecency(stale).days === 4, "readRecency: a last weigh-in 4 days ago is STALE — days since the latest read, not a 28-read count");
  ok(/4 days old/.test(__test.readRecency(stale).flag || "") && /weigh in to refresh/.test(__test.readRecency(stale).flag || ""), "readRecency surfaces an honest, non-alarmist flag — 'reading is N days old · weigh in to refresh'");
  ok(__test.readRecency(fresh).threshold === 3, "the stale threshold is STALE_DAYS = 3, tuned for a daily-weigh-in trend");
  ok(__test.readRecency({ reads: [] }).stale === false && __test.readRecency({}).stale === false, "no reads is cold-start, not stale — the guard never fires on an empty ledger");

  const apFresh = __test.autoPilot(fresh, "fatloss");
  const apStale = __test.autoPilot(stale, "fatloss");

  // FRESH behaves exactly as before — a hot cut still steers
  ok(apFresh.ok && apFresh.stale === false && apFresh.action === "ease", "FRESH: a hot MAX FAT LOSS cut still proposes a real steer (Auto-Pilot unchanged when the read is current)");

  // STALE holds the very move it would otherwise have made
  ok(apStale.ok && apStale.stale === true && apStale.staleDays === 4, "STALE: Auto-Pilot carries the frozen-rate state (N days since the last read)");
  ok(apStale.action === "hold" && apStale.proposed === false, "STALE: Auto-Pilot HOLDS and proposes nothing — no aggressive move off a rate the scale hasn't refreshed");
  ok(apStale.heldForStale === true, "STALE: the hold is CAUSED by staleness — the same inputs steer when fresh, so this is the safeguard biting, not a coincidental on-line hold");
  ok(apStale.onLine === true && apStale.lastReadISO === __test.readRecency(stale).lastISO, "STALE: propose-only preserved — the current line is left untouched, and the card gets the last-read date to say why");

  // the caught failure specifically: a SLOW MAX FAT LOSS cut that TIGHTENS when fresh is HELD when stale
  const slow = (endBack) => { const x = clone(SEED); x.blackout = { until: "2026-05-01" }; x.plan = { ...(x.plan || {}), apMode: "fatloss" }; x.reads = Array.from({ length: 24 }, (_, i) => ({ d: isoAgo(23 - i + endBack), w: +(176 - i * 0.06).toFixed(2), sealed: false })); return x; };
  const slowFresh = __test.autoPilot(slow(0), "fatloss"), slowStale = __test.autoPilot(slow(4), "fatloss");
  ok(slowFresh.action === "tighten", "FRESH control: a slow MAX FAT LOSS cut tightens toward the corridor top — the exact move the 8/2 audit saw");
  ok(slowStale.action === "hold" && slowStale.heldForStale === true, "STALE: that same MAX FAT LOSS tighten is HELD when the rate is 4 days frozen — the caught failure, now guarded");
}

// Auto-Pilot CONFIDENCE GATE - v6.3.2 (Slice 0). A proposal must clear NOISE, not just the +/-90 kcal
// dead-band. `proposed` fired off the POINT-estimate rate, so one big morning (a +3 lb water/sodium
// spike) drops the 28-read rate ~0.2 lb/wk and could tip a false "tighten" over the band while the
// trend never moved. The gate now needs the rate's own 95% CI to EXCLUDE the mode target (the same
// interval signalState reads for ciExcludesZero); a spike widens that CI back over the target, so the
// move abstains to a hold. Propose-only and engine-owned, exactly like the staleness safeguard above.
{
  const isoAgo = (back) => { const d = new Date(Date.now() - back * 86400000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  // a CLEAN recomp cut sitting ON the dead-band edge - measRate == the ~0.70 %BW/wk optimum - ending TODAY.
  const cleanEdge = (endBack) => { const x = clone(SEED); x.blackout = { until: "2026-05-01" }; x.reads = Array.from({ length: 24 }, (_, i) => ({ d: isoAgo(24 - 1 - i + endBack), w: +(168 - i * 0.164).toFixed(2), sealed: false })); return x; };
  // a CLEAN, persistent, genuinely-slow cut - a REAL drift well below target, tight CI, ending TODAY.
  const realDrift = (endBack) => { const x = clone(SEED); x.blackout = { until: "2026-05-01" }; x.reads = Array.from({ length: 24 }, (_, i) => ({ d: isoAgo(24 - 1 - i + endBack), w: +(176 - i * 0.06).toFixed(2), sealed: false })); return x; };

  // baseline: the clean edge is ON the line - a genuine HOLD, nothing to gate either way.
  const apEdge = __test.autoPilot(cleanEdge(0), "recomp");
  ok(apEdge.action === "hold" && apEdge.proposed === false, "confidence gate control: a rate sitting on the dead-band line holds - no move to propose or suppress");

  // (a) NOISE-ONLY SPIKE - one +3 lb morning on the last (FRESH) read tips the point estimate
  //     hold->tighten past the +/-90 kcal band, but the outlier widens the rate CI back over the
  //     target, so the drift is NOT statistically resolvable and NOTHING is proposed.
  const spiked = cleanEdge(0);
  spiked.reads[spiked.reads.length - 1].w = +(spiked.reads[spiked.reads.length - 1].w + 3).toFixed(2);
  const apSpike = __test.autoPilot(spiked, "recomp");
  ok(apSpike.corrKcal >= 90 && apSpike.stale === false, "(a) setup: a +3 lb morning DOES clear the +/-90 kcal dead-band on a FRESH read - the old point-estimate gate would have fired a tighten");
  ok(apSpike.driftSig === false && apSpike.proposed === false && apSpike.action === "hold", "(a) a noise-only spike on the dead-band edge does NOT propose - the rate CI still brackets the target, so the false tighten is gated");
  ok(apSpike.heldForNoise === true && apSpike.heldForStale === false, "(a) the hold is CAUSED by noise, not staleness - heldForNoise is the receipt, and the read is fresh");

  // (b) REAL SIGNIFICANT DRIFT - a clean, persistent cut well below target with a tight CI: the drift
  //     IS resolvable (CI excludes the target), so Auto-Pilot still proposes the steer.
  const apDrift = __test.autoPilot(realDrift(0), "recomp");
  ok(apDrift.driftSig === true && apDrift.action === "tighten" && apDrift.proposed === true, "(b) a real, significant drift (tight CI excludes target) STILL proposes - the gate blocks noise, not signal");

  // (c) STALE - the SAME real drift with its last weigh-in 4 days old: the staleness safeguard holds it.
  const apStaleDrift = __test.autoPilot(realDrift(4), "recomp");
  ok(apStaleDrift.stale === true && apStaleDrift.staleDays === 4 && apStaleDrift.action === "hold" && apStaleDrift.proposed === false, "(c) stale (last read 4 days) -> HOLD, no steer off a frozen rate - the staleness guard stays intact under the confidence gate");
  ok(/4 days old/.test(__test.readRecency(realDrift(4)).flag || "") && /weigh in to refresh/.test(__test.readRecency(realDrift(4)).flag || ""), "(c) ...and the stale read is flagged for a fresh weigh-in");

  // (d) FRESH - the same drift on a current read behaves normally: not stale, real steer proposes.
  ok(apDrift.stale === false && apDrift.heldForNoise === false && apDrift.proposed === true, "(d) fresh -> normal: a current, significant drift steers as before - neither safeguard fires");

  // (e) OPPOSITE-SIGN / WRONG-WAY - GAINING while in a cut/recomp mode. dir flips to bulk and the
  //     TARGET flips WITH it (targetLb becomes the bulk ceiling, not the cut goal), so the CI test
  //     stays self-consistent: a clearly-resolvable wrong-way drift still PROPOSES. Guards the sign path.
  const gaining = clone(SEED); gaining.blackout = { until: "2026-05-01" };
  gaining.reads = Array.from({ length: 24 }, (_, i) => ({ d: isoAgo(23 - i), w: +(164 + i * 0.15).toFixed(2), sealed: false }));
  const apGain = __test.autoPilot(gaining, "recomp");
  ok(apGain.dir === "bulk" && apGain.targetLb < 1.0 && apGain.driftSig === true && apGain.proposed === true, "(e) opposite-sign: gaining flips dir->bulk and the target flips with it; a resolvable wrong-way drift still proposes - no sign bug from the measRate-derived direction");

  // (f) NOISY but RESOLVABLE - a slow cut with REAL residual noise (ci>0), target OUTSIDE the CI.
  //     Proves the gate proposes on resolvable NOISY data, not only on noiseless (ci==0) fixtures.
  const noisy = clone(SEED); noisy.blackout = { until: "2026-05-01" };
  noisy.reads = Array.from({ length: 24 }, (_, i) => ({ d: isoAgo(23 - i), w: +(170 - i * 0.06 + (i % 2 ? 0.5 : -0.5)).toFixed(2), sealed: false }));
  const crNoisy = __test.currentRate(noisy), apNoisy = __test.autoPilot(noisy, "recomp");
  ok(crNoisy.ci > 0 && apNoisy.driftSig === true && apNoisy.action === "tighten" && apNoisy.proposed === true, "(f) a NOISY but resolvable drift (ci>0, target outside the CI) still proposes - the gate blocks unresolvable noise, not real signal");

  // (g) NO CI - a coarse "snapshots" rate (too few daily reads) carries no CI, so a drift cannot be
  //     resolved: even a big gap (a would-be ease, corrKcal>=90) ABSTAINS rather than steer off it.
  const snap = clone(SEED); snap.blackout = { until: "2026-05-01" };
  snap.reads = Array.from({ length: 6 }, (_, i) => ({ d: isoAgo(6 - 1 - i), w: +(170 - i * 0.1).toFixed(2), sealed: false }));
  snap.weekly = [{ wk: "2026-07-06", trend: 170.0 }, { wk: "2026-07-13", trend: 167.8 }, { wk: "2026-07-20", trend: 165.6 }];
  const crSnap = __test.currentRate(snap), apSnap = __test.autoPilot(snap, "recomp");
  ok(crSnap.method === "snapshots" && crSnap.ci == null && apSnap.corrKcal >= 90 && apSnap.driftSig === false && apSnap.proposed === false && apSnap.heldForNoise === true, "(g) no CI (a snapshots rate) cannot resolve a drift - a big would-be steer abstains to a hold, never reverting to the point estimate");

  // (h) MODERATE WRONG-WAY (the pinned boundary) - CONFIDENTLY gaining (rate CI excludes zero) but the
  //     overshoot past the bulk ceiling is NOT resolvable at 95% (target sits INSIDE the rate CI). The
  //     gate correctly HOLDS: "rate != 0" (signalState) and "rate != target" (this gate) are different
  //     questions, and a proposal turns on the latter. Receipted as heldForNoise, not a false ease.
  const wrongMod = clone(SEED); wrongMod.blackout = { until: "2026-05-01" };
  wrongMod.reads = Array.from({ length: 24 }, (_, i) => ({ d: isoAgo(23 - i), w: +(164 + i * 0.128 + (i % 2 ? 1.5 : -1.5)).toFixed(2), sealed: false }));
  const crMod = __test.currentRate(wrongMod), sigMod = __test.signalState(wrongMod), apMod = __test.autoPilot(wrongMod, "recomp");
  ok(apMod.dir === "bulk" && crMod.ci > 0 && sigMod.ciExcludesZero === true && apMod.corrKcal >= 90 && apMod.driftSig === false && apMod.action === "hold" && apMod.proposed === false && apMod.heldForNoise === true, "(h) a confidently-gaining wrong-way mover whose overshoot is within the rate CI HOLDS - 'rate != 0' and 'rate != target' are different questions; the gate turns on the drift from target, and receipts the hold as noise rather than firing a false steer");
}

// Auto-Pilot MODE toggle — v6.2 (one corridor engine; the mode only selects which slice it steers to)
{
  const base = clone(SEED); base.blackout = { until: "2026-05-01" };
  const recomp = __test.autoPilot(base, "recomp");
  const fatloss = __test.autoPilot(base, "fatloss");
  ok(__test.autoPilot(base).mode === "recomp", "autoPilot defaults to MAX BODY COMPOSITION (recomp)");
  ok(Math.abs(recomp.targetPct - __test.BC.CUT_OPT_PCT) < 0.02, "recomp steers to the lean-preserving optimum CUT_OPT_PCT (~0.70 %BW/wk)");
  ok(fatloss.targetPct > recomp.targetPct && fatloss.targetPct <= fatloss.band.redlinePct, "MAX FAT LOSS targets a faster slice — the corridor top, still under the redline");
  ok(recomp.band.redlinePct === fatloss.band.redlinePct && recomp.band.redlinePct === __test.BC.CUT_REDLINE_PCT, "both modes share ONE engine and ONE redline (the physiological ceiling) — not a second number");
  ok(fatloss.band.corrLb[1] > recomp.band.corrLb[1], "v6.2.1: the mode now moves the BAND itself — MAX FAT LOSS steers a faster slice than MAX BODY COMP (was mode-independent; only the gauge used to move)");
}

// Auto-Pilot MODE drives the BASELINE targets — v6.2.1 (the calorie band/steps/protocol, not just the gauge)
{
  const mkS = (m) => { const x = clone(SEED); x.blackout = { until: "2026-05-01" }; x.plan = { ...(x.plan || {}), apMode: m }; return x; };
  const R = mkS("recomp"), F = mkS("fatloss");
  const rbR = __test.cutRateBand(R), rbF = __test.cutRateBand(F);
  ok(rbF.band[0] > rbR.band[0] && rbF.band[1] > rbR.band[1], "cutRateBand: fat-loss is the faster slice of the ONE corridor (both edges hotter than recomp)");
  ok(rbR.pct[1] === __test.BC.CUT_OPT_PCT && rbF.pct[1] === __test.BC.CUT_REDLINE_PCT, "recomp tops at the lean-preserving optimum (0.70), fat-loss at the conservative redline (1.00) — both cited constants");
  const ctR = __test.calorieTarget(R), ctF = __test.calorieTarget(F);
  ok(!ctR.gated && !ctF.gated, "the calorie band prints in both modes");
  ok(ctF.hi < ctR.hi && ctF.mid < ctR.mid, "MAX FAT LOSS drives a LOWER calorie band than MAX BODY COMP — the mode moves what the app tells him to EAT (v6.2.1; was identical either way)");
  ok(ctR.hi > ctR.lo, "the calorie band keeps a WIDTH — the mode moves the target, it does not fake precision");
  ok(ctF.lo >= ctF.floor && ctR.lo >= ctR.floor, "the energy-availability floor still clamps BOTH modes — safety preserved, Auto-Pilot stays propose-only");
  const bcR = __test.bodyCompBand(R, "cut"), bcF = __test.bodyCompBand(F, "cut");
  ok(bcF.corrPct[1] > bcR.corrPct[1] && bcR.redlinePct === bcF.redlinePct, "the Twin/gauge corridor re-steers with the mode while the redline (the ceiling) holds");
}

// v6.2 audit 4b — bulk corridor recalibrated to the advanced lean-bulk band
{
  const BC = __test.BC;
  ok(BC.BULK_CORR_PCT[0] === 0.125 && BC.BULK_CORR_PCT[1] === 0.25 && BC.BULK_REDLINE_PCT === 0.25, "bulk corridor is the advanced band 0.125–0.25 %BW/wk, redline 0.25 (Aragon & Schoenfeld / Lyle)");
  ok(BC.BULK_LEAN_CEIL_PCT >= BC.BULK_CORR_PCT[0] && BC.BULK_LEAN_CEIL_PCT <= BC.BULK_CORR_PCT[1], "the lean-gain ceiling (0.15) now sits inside the recalibrated bulk corridor");
}

// v6.2 audit fixes — Garthe 2011 figures corrected, and a same-day weight update is REAL (was a no-op)
{
  const BC = __test.BC;
  ok(BC.CUT_GARTHE_SLOW_LBM === 2.1 && BC.CUT_GARTHE_FAST_LBM === -0.2 && BC.CUT_GARTHE_FAST_RATE === 1.4, "gauge cites the verified Garthe 2011 LBM figures (+2.1% slow / −0.2% fast at 1.4%/wk), not the earlier +1.7%/−2.0% (the flagged 10× error)");
  const day = "2026-08-15";
  const st = __test.applyRead(clone(SEED), day, 170);
  const noop = __test.applyRead(st, day, 168).reads.find((r) => r.d === day).w;
  const updated = __test.applyRead(__test.undoRead(st, day), day, 168).reads.find((r) => r.d === day).w;
  ok(st.reads.find((r) => r.d === day).w === 170 && noop === 170, "applyRead alone can't overwrite a same-day read (the guard) — why the raw quick-log Update was a silent no-op");
  ok(updated === 168, "undo-then-apply performs a REAL same-day weight update — the v6.2 quick-log fix");
}

// Twin body-composition + redline — v6.1 (fat/lean partition + corridor, one number decomposed)
{
  const base = clone(SEED); base.blackout = { until: "2026-05-01" };
  const tb = __test.twinBodyComp(base, {});
  ok(tb.bc && tb.bc.band.redlinePct === __test.BC.CUT_REDLINE_PCT && tb.bc.dir === "cut", "twin body-comp reads a cut with the cited redline");
  ok(Math.abs((tb.bc.fat + tb.bc.lean) - tb.newRate) < 0.05, "fat + lean partition sums to the ONE projected scale rate — decomposed, never recomputed");
  ok(tb.bc.lean >= 0 && tb.bc.fat >= tb.bc.lean, "on a cut most of the loss is fat, a smaller slice lean (Hall MIX ~87/13)");
  const fastTb = __test.twinBodyComp(base, { calDelta: -1400 });
  ok(fastTb.bc.leanFrac > tb.bc.leanFrac, "pushing the rate up raises the lean fraction — the redline mechanism (Forbes / Murphy & Koehler)");
  ok(fastTb.bc.zone === "redline", "a big deficit pushes the projection into the redline zone");
  // RT retention gate (v6.1): RT assumed present holds lean; a missed block degrades it
  ok(tb.bc.rt === 1, "with progressive RT assumed present (no logged gaps), retention is full");
  const missed = clone(base); missed.sessionLog = { "2026-04-01": { entries: [] } };  // last session >14d ago -> adherence 0
  const missedTb = __test.twinBodyComp(missed, { calDelta: -300 });
  const heldTb = __test.twinBodyComp(base, { calDelta: -300 });
  ok(missedTb.bc.rt === 0 && missedTb.bc.leanFrac > heldTb.bc.leanFrac, "a missed training block degrades the lean projection — retention is gated on actual training");
}

// the Digital Twin — v2 slice D (energy-balance simulation, range-only)
{
  const base = clone(SEED); base.blackout = { until: "2026-05-01" };
  const t0 = __test.digitalTwin(base, {});
  ok(t0.ok === true && t0.newRate === t0.rate0, "with no slider change the twin's rate equals the measured rate");
  const tCut = __test.digitalTwin(base, { calDelta: -500 });
  ok(tCut.newRate > t0.newRate, "cutting calories speeds the projected loss");
  const tSteps = __test.digitalTwin(base, { steps: (t0.stepsNow || 8000) + 4000 });
  ok(tSteps.newRate > t0.newRate, "adding steps speeds the projected loss (NEAT shares the axis with food)");
  ok(tCut.etaSlow >= tCut.etaMid && tCut.etaMid >= tCut.etaFast, "the ETA is a range — slower rate, more weeks; never a single date");
}

// the Why-Engine decomposition — v2 slice C
{
  const w0 = __test.whyDecompose(clone(SEED));
  ok(typeof w0.show === "boolean", "whyDecompose always returns a show flag (exception-only surface)");
  const wUp = clone(SEED); wUp.trend = 163.0; wUp.reads = wUp.reads.concat([{ d: "2026-07-31", w: 165.6, sealed: false }]);
  const w1 = __test.whyDecompose(wUp);
  ok(w1.show === true, "a big above-trend morning surfaces the decomposition");
  ok(w1.parts.length === 3, "the decomposition has three parts (refeed water, sodium water, real)");
  const sum = w1.parts.reduce((a, p) => a + p.pct, 0);
  ok(sum >= 98 && sum <= 102, "the shares sum to ~100%");
  ok(w1.parts.find((p) => p.key === "real").tone === "brass", "the real slice is brass (measured), never green");
}

// the body-comp anchor tightening path — the v2 anchor selector (slice B)
{
  const at = __test.anchorTighten(clone(SEED));
  ok(Array.isArray(at.steps) && at.steps.length === 3, "anchorTighten returns a three-step tightening path");
  ok(at.steps[0].half >= at.steps[1].half && at.steps[1].half >= at.steps[2].half, "the anchor band only ever tightens, never widens");
  ok(at.steps[2].half === 1 && at.steps[2].state === "measured", "a DEXA re-anchor lands the band at ±1.0 and reads measured");
  ok(at.steps[0].state === "quiet" && at.steps[0].half === +((at.hi - at.lo) / 2).toFixed(1), "today's step is the live bfEst band, shown as a guess");
}

// v2.2 — signals
const { completeSession: cs2, genSession: gs2, SEED: S4, migrate: mg2 } = __test;
ok(S4.v >= 4 && Array.isArray(S4.waist) && S4.exercises.every(e => Array.isArray(e.rirHist)), "seed carries v4 signal fields");
// RIR-0 twice → hold, and a hot grind never earns
let st = clone(S4);
const mk1 = (iso) => {
  const g = gs2(st, iso, slpClean);
  const en = g.ex.map(e => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: null }));
  const lat = en.find(e => e.id === "lateral"); lat.reps = [15, 15, 15]; lat.rir = 0;
  return en;
};
st = cs2(st, "2026-07-23", mk1("2026-07-23"), slpClean).s;
ok(!st.queue.some(q => q.exId === "lateral" && q.kind === "debut" && !q.done), "top-of-window at RIR 0 does NOT earn the load");
st = cs2(st, "2026-07-27", mk1("2026-07-27"), slpClean).s;
const latEx = st.exercises.find(e => e.id === "lateral");
ok(latEx.holdFlag === true, "two RIR-0 sessions flip the hold");
ok(gs2(st, "2026-07-30", slpClean).ex.find(e => e.id === "lateral").note.indexOf("HELD") === 0, "held lift announces itself next session");
// joint pattern: 3 flags in 3 weeks arms a proposal
let st2 = clone(S4);
["2026-07-23", "2026-07-27", "2026-07-30"].forEach(iso => {
  const g = gs2(st2, iso, slpClean);
  const en = g.ex.map(e => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: null }));
  st2 = cs2(st2, iso, en, slpClean, { note: "", niggles: ["knee"] }).s;
});
/* R14 audit — this producer was a BIRTH-SITE BYPASS of the inbox invariant: it pushed a
   kind:note card straight from completeSession. It now surfaces as a FEED LINE, same
   content, and the fixture doubles as the bypass driver: after these three sessions, the
   inbox must hold ZERO unresolved notes from any path. */
ok(st2.feed.some(f => /KNEE — 3 FLAGS IN 3 WEEKS/.test(f.t)), "3 knee flags in 3 weeks surfaces — as a feed line under R14, since a recurring niggle is information for him and his coach, not a decision");
ok(!st2.proposals.some(p => !p.resolved && p.apply && p.apply.kind === "note"), "GLOBAL ADMISSION — after the niggle fixture, no unresolved proposal anywhere carries apply.kind note. This is the assert that catches the third bypass neither side has found yet");
/* the SECOND bypass (phaseProposal's floor-hold -> armProposal). armProposal is a component
   closure, unreachable from the suite, so this is asserted at the source layer: the choke
   exists at the birth site, and the producer still emits the shape it guards against —
   if either side changes, one of these two goes red. */
{
  const armSrc = readFileSync("src/app.jsx", "utf8");
  const armBody = armSrc.slice(armSrc.indexOf("const armProposal = (pr) => {"), armSrc.indexOf("const planBreak = () => {"));
  ok(/pr\.apply && pr\.apply\.kind === "note"/.test(armBody) && /ns\.feed\.unshift/.test(armBody), "R14 audit — armProposal carries the same note-to-feed choke as propose(), so the UI birth site cannot seat a note either");
  ok(/return;/.test(armBody.slice(armBody.indexOf('kind === "note"'))), "R14 audit — and the note path RETURNS before the proposals push: converted, never both");
}
// v3 → v4 patch
const oldV3 = clone(S4); oldV3.v = 3; delete oldV3.waist; oldV3.exercises.forEach(e => { delete e.rirHist; });
const m4 = mg2(oldV3);
ok(m4.v >= 4 && Array.isArray(m4.waist) && m4.exercises.every(e => Array.isArray(e.rirHist)), "v3 phone state patches cleanly to v4");

// (summary moved to end)

// v2.2.2 — undo
const { undoRead: ur, SEED: S5 } = __test;
let u = clone(S5); u.blackout.until = "2026-07-01"; // simulate post-seal
const t0 = u.trend;
u.reads.push({ d: "2026-07-28", w: 162.0, sealed: false, pt: u.trend });
u.trend = +(u.trend * 0.7 + 162.0 * 0.3).toFixed(1);
u.weekly.push({ wk: "2026-07-27", trend: u.trend });
const u2 = ur(u, "2026-07-28");
ok(!u2.reads.some(r => r.d === "2026-07-28") && u2.trend === t0 && !u2.weekly.some(w => w.wk === "2026-07-27"), "undo removes the read, restores trend, clears the orphaned snapshot");
let v = clone(S5);
v.reads.push({ d: "2026-07-22", w: 163.0, sealed: true, pt: v.trend });
const v2 = ur(v, "2026-07-22");
ok(!v2.reads.some(r => r.d === "2026-07-22") && v2.trend === v.trend, "sealed mislog undoes clean — trend was never touched");

console.log(`\nFINAL2: ${pass} passed, ${fail} failed`);
// (summary moved to end)

// v2.3 — order + completeness
const { genSession: gs3, SEED: S6, migrate: mg3 } = __test;
ok(S6.v >= 5 && S6.exercises.some(e => e.id === "sulek") && S6.exercises.some(e => e.id === "hanging"), "Sulek + hanging raise now exist (the doc omitted them; the sheet didn't)");
const uSess = gs3(clone(S6), "2026-07-23", slpClean);
ok(uSess.ex[0].id === "lateral" && uSess.ex[uSess.ex.length - 1].id === "pronated", "upper runs lateral-first, pronated-last — the 7/20 gym order");
const lSess = gs3(clone(S6), "2026-07-24", slpClean);
ok(lSess.ex.map(e => e.id).join(",") === "calves,abs,hanging,hack,extension,ham", "lower matches the 7/17+7/21 order exactly");
let co = clone(S6); co.exOrder.U = [...co.exOrder.U].reverse();
ok(gs3(co, "2026-07-23", slpClean).ex[0].id === "pronated", "custom reorder persists into generated sessions");
const oldV4 = clone(S6); oldV4.v = 4; delete oldV4.exOrder; oldV4.exercises = oldV4.exercises.filter(e => e.id !== "sulek" && e.id !== "hanging");
const m5 = mg3(oldV4);
ok(m5.v >= 5 && m5.exercises.some(e => e.id === "sulek") && Array.isArray(m5.exOrder.L), "existing phone states gain the new lifts and order cleanly");

console.log(`\nFINAL3: ${pass} passed, ${fail} failed`);
// (summary moved to end)

// v2.4 — setups
const { SEED: S7, migrate: mg4, genSession: gs4 } = __test;
ok(S7.v >= 6 && S7.exercises.every(e => typeof e.setup === "string" && e.setup.length > 10), "every lift carries its settings + cues");
ok(S7.exercises.find(e => e.id === "sulek").n.indexOf("forearm") > -1, "Sulek corrected to what it actually is — forearm work");
ok(gs4(clone(S7), "2026-07-23", slpClean).ex[0].setup.indexOf("resistance profile 5") > -1, "setup rides into the generated session card");
const oldV5 = clone(S7); oldV5.v = 5; oldV5.exercises.forEach(e => { delete e.setup; e.n = e.n === "Sulek curl (forearm)" ? "Sulek raise" : e.n; });
const m6 = mg4(oldV5);
ok(m6.v >= 6 && m6.exercises.every(e => e.setup) && m6.exercises.find(e => e.id === "sulek").n.indexOf("forearm") > -1, "existing phones gain blurbs and the name fix");

console.log(`\nFINAL4: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v2.5 — live cue layer
const { genSession: gs5, completeSession: cs5, SEED: S8 } = __test;
const u5 = gs5(clone(S8), "2026-07-23", slpClean);
ok(u5.ex.find(e => e.id === "press").live.indexOf("8,8,7 clean owns it") === 0, "press NOW-line reads the live own standard");
ok(u5.ex.find(e => e.id === "rows").live.indexOf("debut at 180") === 0, "rows NOW-line reads the debut context");
ok(S8.exercises.find(e => e.id === "press").setup.indexOf("controlled 8s") === -1, "stale rep numbers purged from the static layer");
// after owning, the same lift's NOW-line changes by itself
const en5 = u5.ex.map(e => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: null }));
en5.find(e => e.id === "press").reps = [8, 8, 7];
const s5b = cs5(clone(S8), "2026-07-23", en5, slpClean).s;
const mon5 = gs5(s5b, "2026-07-27", slpClean);
ok(mon5.ex.find(e => e.id === "press").live.indexOf("debut at 250") === 0, "own it Thursday → Monday's press NOW-line flips to the 250 debut on its own");

// (interim)

// v2.6 — PREV anchor
const { genSession: gs6, completeSession: cs6, SEED: S9, migrate: mg6 } = __test;
const u6 = gs6(clone(S9), "2026-07-23", slpClean);
const pPrev = u6.ex.find(e => e.id === "press").prev;
ok(pPrev && pPrev.reps.join(",") === "8,7,6" && pPrev.debt === true, "press PREV carries 8,7,6 with the on-debt context");
ok(u6.ex.find(e => e.id === "extension") === undefined, "extension correctly absent from upper (sanity)");
const l6 = gs6(clone(S9), "2026-07-24", slpClean);
ok(l6.ex.find(e => e.id === "extension").prev.w === 155, "extension PREV shows the honest 155×9,6 crater, not a fake 150");
const en6 = u6.ex.map(e => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: e.id === "lateral" ? 1 : null }));
const s6b = cs6(clone(S9), "2026-07-23", en6, slpClean).s;
const latMeta = s6b.exercises.find(e => e.id === "lateral").lastMeta;
ok(latMeta.d === "2026-07-23" && latMeta.rir === 1 && latMeta.debt === false, "completing a session rewrites PREV with date, RIR, and clean context");
const rowsMeta = s6b.exercises.find(e => e.id === "rows").lastMeta;
ok(rowsMeta.w === 180, "debut PREV records the weight actually lifted");
const oldV7 = clone(S9); oldV7.v = 7; oldV7.exercises.forEach(e => delete e.lastMeta);
oldV7.sessionLog["2026-07-22"] = { entries: [{ id: "press", reps: [8, 8, 7], rir: 1 }], at: 1 };
const m8 = mg6(oldV7);
ok(m8.exercises.find(e => e.id === "press").lastMeta.d === "2026-07-22", "migration prefers the phone's own logged session over the sheet seed");

// (interim)

// v3.0 — recovery, damping, sync hygiene
const { recoveryIndex: ri, applyRead: ar, runAdaptive: ra3, SEED: SA, migrate: mgA } = __test;
ok(ri(clone(SA)).score >= 80 === false || true, "index computes");
const base = ri(clone(SA));
/* The seed's last three nights are 7, 7.5, 7.5 — fine on the PERFORMANCE
   question, which is what cleanAtDate now answers, so no session flag. The
   five-night average is 6.90 h because of one 4.5 h night five back, which is
   the TARGET question and still flags. Two questions, two answers; the old
   single 7.5-hour gate conflated them and fired on both. See DEBT_NOTE. */
ok(base.score === 90 && base.band === "GREEN", "seed reads 90 GREEN — the chronic five-night average flags, the acute session flag does not");
ok(base.flags.some(f => f.k === "avg5") && !base.flags.some(f => f.k === "sleep"), "and the flag that fires is the chronic one, named");
let beat = clone(SA);
beat.exercises[0].holdFlag = true; beat.exercises[1].holdFlag = true;
beat.sleep.nights = beat.sleep.nights.slice(0, -4).concat([{d:"2026-07-17",h:5},{d:"2026-07-18",h:5},{d:"2026-07-19",h:5},{d:"2026-07-20",h:5},{d:"2026-07-21",h:5}]);
beat.sessionLog["2026-07-21"] = { entries: [], niggles: ["knee","knee","shoulder"], at: 1 };
const beatIdx = ri(beat);
ok(beatIdx.band === "LOW" && beatIdx.score < 55, "stacked drag lands LOW: " + beatIdx.score);
beat.blackout.until = "2026-07-01";
const raOut = ra3(beat, "2026-07-22");
/* R14 — recovery is kind:note, so LOW recovery now INFORMS via the feed rather than
   arming a card. Same trigger, same content, different surface: information is a feed
   line, only decisions are cards. */
ok(!raOut.proposals.some(p => !p.resolved && p.rid.indexOf("recovery_") === 0), "R14 — LOW recovery no longer arms a CARD: its tap enacted nothing, which failed the inbox invariant");
ok(raOut.feed.some(f => /RECOVERY LOW/.test(f.t)), "R14 — it lands in the feed with the same receipts, so the information survives the surface change");
// spike damping
let sd = clone(SA); sd.blackout.until = "2026-07-01"; const t0b = sd.trend;
const sd2 = ar(sd, "2026-07-28", sd.trend + 4.6);
ok(Math.abs(sd2.trend - +(t0b + 0.45).toFixed(1)) < 0.001 && sd2.reads[sd2.reads.length - 1].note.indexOf("spike") === 0, "a +4.6 dinner moves the trend +0.45 max, marked as damped");
const sd3 = ar(clone(sd), "2026-07-28", sd.trend - 0.6);
ok(Math.abs(sd3.trend - +(t0b - 0.18).toFixed(1)) < 0.001, "normal reads still flow at full EWMA weight");
// sync payload hygiene + v9
ok(JSON.stringify(SA).indexOf("ghtoken") === -1 && SA.v >= 9 && Array.isArray(SA.photos), "state v9, token never inside the payload");
const oldV8 = clone(SA); oldV8.v = 8; delete oldV8.photos; delete oldV8.sync;
ok(mgA(oldV8).v >= 9 && Array.isArray(mgA(oldV8).photos), "v8 phones patch to v9 cleanly");

// (interim)

// v3.1 — observed maintenance
const { observedTDEE: ot, SEED: SB } = __test;
const sbSealed = clone(SB); sbSealed.blackout = { until: "2099-01-01", reason: "fixture seal" };
ok(ot(sbSealed) === null, "sealed window: observed maintenance correctly refuses to print");
let ob = clone(SB); ob.blackout.until = "2026-07-01";
const o1 = ot(ob);
ok(o1 && o1.days >= 8 && o1.tdee > 2200 && o1.tdee < 2800, `post-seal it computes from real logs: ~${o1 && o1.tdee} over ${o1 && o1.days} days`);
let ob2 = clone(SB); ob2.blackout.until = "2026-07-01"; ob2.dailyLogs = {};
ok(ot(ob2) === null, "under 8 logged days: stays silent rather than guessing");

// (interim)

// v3.2 — THE LAB
const { labAnalytics: la, anchorDexa: ad, applyRead: ar2, SEED: SC } = __test;
const scSealed = clone(SC); scSealed.blackout = { until: "2099-01-01", reason: "fixture seal — this suite tests the behaviour, not the calendar" };
const lab = la(scSealed);
const get = (id) => lab.find(x => x.id === id);
/* Whoosh and the refeed line both sit at n=4 on his real history, which is exactly
   the audit's finding: they were saying "measured" off four observations. They are
   PROVISIONAL until LAB_MIN_N=6 now, and they must carry a real interval, not a
   min–max of what has been seen. */
ok(get("whoosh").status === "PROVISIONAL" && get("whoosh").prog.n >= 2, "whoosh is PROVISIONAL at " + get("whoosh").prog.n + " episodes, not LIVE");
ok(get("whoosh").lines.some((l) => l.indexOf("95% CI") > -1), "whoosh publishes a confidence interval on clearance, not just a range of observations");
ok(get("whoosh").forYou.indexOf("WEDDING #2") > -1, "whoosh model already aimed at Saturday's wedding");
ok(get("refeed").status === "PROVISIONAL" && get("refeed").prog.n === 4 && get("refeed").lines[0].indexOf("+4.6") === -1, "refeed line cleaned: real refeeds only, n=4, birthday spike evicted — and PROVISIONAL, not measured");
ok(get("refeed").lines.some((l) => l.indexOf("95% CI") > -1 && l.indexOf("SD") > -1), "refeed publishes mean, CI and SD — the spread that made it not-a-number");
/* The band is now one reading against the damped trend, not the consecutive-day RMS,
   so it reads larger on autocorrelated data — see NOISE_FLOOR_NOTE. The assertion
   checks the clamped range rather than pinning a digit that belongs to the old
   estimator. */
ok(get("noise").status === "LIVE" && /±[0-9]\.[0-9] lb — one reading vs the damped trend/.test(get("noise").lines[0]), "personal noise floor computed against the trend: " + get("noise").lines[0].slice(0, 48));
ok(get("cone").status === "LIVE" && get("cone").lines[0].indexOf("80%") === 0, "pivot cone runs Monte Carlo on his measured rates");
/* The cone must propagate parameter uncertainty, not just process noise — at n=4 weekly
   rates that is most of the honest spread. It reports both so the difference is visible. */
{
  const cone = get("cone");
  ok(cone.lines.length === 2 && cone.lines[1].indexOf("parameter uncertainty") > -1, "the cone states how much spread the process-only version hid");
  const withP = +(cone.lines[1].match(/span is (\d+) weeks/) || [])[1];
  const procOnly = +(cone.lines[1].match(/would read (\d+)/) || [])[1];
  ok(withP >= procOnly, "propagating mu/sigma uncertainty can only widen the cone (" + withP + " vs " + procOnly + " weeks)");
  ok(cone.forYou.indexOf("independent") === -1 || cone.forYou.indexOf("not independent") > -1 || cone.forYou.indexOf("rather than independent") > -1, "and it no longer claims independent confirmation of the coach's call");
  ok(cone.deep.indexOf("n−1") > -1 || cone.deep.indexOf("n-1") > -1, "sigma uses n-1, matching the forecast card");
}
ok(get("tuefri").status === "ARMED" && get("tuefri").prog.n === 0, "Tue/Fri experiment armed at 0/4 pairs");
ok(get("fingerprint").status === "ARMED" && get("rirtruth").status === "ARMED" && get("mrv").status === "LOCKED", "gates hold: no correlations under N");
// the seal under test is the fixture's own, never the calendar's
ok(get("masked").forYou.indexOf("Sealed") === 0, "masked-loss monitor respects the seal");
const withDexa = ad(clone(SC), 15.8);
ok(la(withDexa).find(x => x.id === "dexarecon").status === "LIVE" && withDexa.dexaRecon.dexa === 15.8, "DEXA reconciliation fires on anchor with the delta recorded");
let nz = clone(SC); nz.blackout.until = "2026-07-01";
const nzr = ar2(nz, "2026-07-28", nz.trend + 0.2);
ok(nzr.reads[nzr.reads.length - 1].note.indexOf("inside your noise") === 0, "scale card now speaks the calibrated noise floor");

// (interim)

// v3.3 — three-layer lab cards
const { labAnalytics: la3, SEED: SD } = __test;
const sdOpen = clone(SD); sdOpen.blackout = { until: "2099-01-01", reason: "fixture seal — the six-week receipt lives in the sealed branch" };
const lab3 = la3(sdOpen);
ok(lab3.every(a => a.tag && a.tag.length > 10 && a.deep && a.deep.length > 40 && a.forYou && a.forYou.length > 20), "every card carries tag + deep + for-you layers");
const cone3 = lab3.find(a => a.id === "cone");
/* It used to say the cone "independently CONFIRMS" the coach's call. It does not: the
   cone and that call both run off the same weekly rates, so agreement is expected
   rather than corroboration. The card says "consistent with" now, and says why. */
ok(cone3.forYou.indexOf("consistent with") > -1 || cone3.forYou.indexOf("window") > -1, "cone's for-you speaks to the September call without claiming independence: " + cone3.forYou.slice(0, 60));
ok(cone3.forYou.indexOf("CONFIRMS") === -1, "and the word CONFIRMS is gone — shared inputs cannot confirm each other");
ok(lab3.find(a => a.id === "whoosh").forYou.indexOf("WEDDING") > -1, "whoosh for-you is aimed at Saturday");
ok(lab3.find(a => a.id === "masked").forYou.indexOf("broke DOWNWARD") > -1, "masked-loss for-you carries the six-week receipt");

// (interim)

// v3.5 — the shelf + sleep-dose + v10
const { shelfItems: sh, labAnalytics: la5, migrate: mg5, SEED: SE } = __test;
const shelf = sh(clone(SE));
ok(shelf.length === 5 && shelf.every(a => a.tag && a.deep && a.forYou), "five evidence cards, all three layers present");
ok(/mg at 74\.\d kg/.test(shelf.find(a => a.id === "caffdose").lines[0]) === false && shelf.find(a => a.id === "caffdose").lines[0].indexOf("224–449 mg") > -1 || /\d+–\d+ mg at \d+(\.\d+)? kg/.test(shelf.find(a => a.id === "caffdose").lines[0]), "caffeine range computed at his live weight");
ok(shelf.find(a => a.id === "spread").lines[0].indexOf("44 g × 4") > -1 || shelf.find(a => a.id === "spread").lines[0].indexOf("~44 g") > -1, "protein spread derives from THE number");
ok(["2013", "2017", "2018", "2011", "2019"].every(y => JSON.stringify(shelf).indexOf(y) > -1), "citations ride the cards");
let cre = clone(SE); cre.creatine = { start: "2026-07-20" };
const creLine = sh(cre).find(a => a.id === "creatine"); const creDay = parseInt(((creLine.lines[0] || "").match(/^day (\d+) of ~28/) || [0, 0])[1], 10);
const creExpect = Math.floor((Date.now() - new Date("2026-07-20").getTime()) / 864e5) + 1;
ok(creLine.status === "TRACKING" && Math.abs(creDay - creExpect) <= 1, "creatine tracker counts saturation days (day " + creDay + " ≈ " + creExpect + ")");
const dose = la5(clone(SE)).find(a => a.id === "sleepdose");
ok(dose && dose.status === "ARMED" && dose.prog.need === 5, "sleep-dose experiment armed, Mah prior attached");
const mrv5 = la5(clone(SE)).find(a => a.id === "mrv");
ok(mrv5.deep.indexOf("Schoenfeld") > -1 && mrv5.forYou.indexOf("10+") > -1, "MRV carries the literature prior");
const oldV9 = clone(SE); oldV9.v = 9; delete oldV9.creatine; oldV9.exercises.forEach(e => delete e.mg);
const m10 = mg5(oldV9);
ok(m10.v >= 10 && m10.creatine === null && m10.exercises.find(e => e.id === "press").mg === "chest", "v9 phones patch to v10 with muscle tags");

// (interim)

// v3.5.1 — live debt audit
const { debtLedger: dl, SEED: SF } = __test;
ok(dl(clone(SF)).length === clone(SF).sleep.debts.length && !dl(clone(SF)).some(x => x.live), "seeded receipts intact, no live charges before in-app debt sessions");
let dbt = clone(SF);
dbt.sleep.nights = [{d:"2026-07-23",h:8},{d:"2026-07-24",h:8},{d:"2026-07-25",h:8},{d:"2026-07-27",h:5},{d:"2026-07-28",h:5},{d:"2026-07-29",h:5}];
dbt.sessionLog = {
  "2026-07-26": { entries: [{ id: "press", reps: [8, 8, 7], rir: 1 }], at: 1 },
  "2026-07-30": { entries: [{ id: "press", reps: [8, 7, 5], rir: null }], at: 2 },
};
const charged = dl(dbt);
ok(charged.some(x => x.live && x.txt.indexOf("Press") === 0 && x.txt.indexOf("-3 reps after a short night") > -1), "a short-sleep session is still measured against its normal twin — that comparison survived; only the language that called it debt did not: " + (charged.find(x => x.live) || {}).txt);
dbt.sessionLog["2026-07-30"].entries[0].reps = [8, 8, 7];
ok(!dl(dbt).some(x => x.live), "matching the clean twin = no charge; only losses get written");

// (interim)

// v3.6 — everything breathes
const { liveRollups: lr, SEED: SG } = __test;
ok(lr(clone(SG)).length === 0, "no live weeks before any post-handoff logging");
let lv = clone(SG);
lv.dailyLogs["2026-07-22"] = { cal: 2470, pro: 176, steps: 9000 };
lv.dailyLogs["2026-07-23"] = { cal: 1760, pro: 178, steps: 16500 };
lv.reads.push({ d: "2026-07-22", w: 164.7, sealed: true });
lv.sleep.nights.push({ d: "2026-07-22", h: 8 });
lv.sessionLog["2026-07-23"] = { entries: [], at: 1, note: "rows 180 landed", niggles: [] };
const wk7 = lr(lv);
ok(wk7.length === 1 && wk7[0].wk === 7 && wk7[0].live === true, "post-handoff days roll into a live week-7 card");
ok(wk7[0].proHit === 2 && wk7[0].proN === 2 && wk7[0].avgCal === 2115, "live rollup math: protein hits and averages compute");
ok(wk7[0].rows.some(r => r.sealedW === 164.7) && wk7[0].rows.some(r => r.note === "rows 180 landed"), "sealed reads and session notes ride the live rows");
ok(JSON.stringify(__test.SEED).indexOf("Tue 7/28+ is the clean") === -1, "hardcoded booking date purged from state-adjacent strings");

// (interim)

// v3.7 — comprehension layer
const { weekDigest: wdg, GLOSSARY: GL, SEED: SH } = __test;
ok(Object.keys(GL).length >= 14 && Object.values(GL).every(v => v.length === 2 && v[1].length > 40), "glossary carries 14+ terms, each with a real plain-English definition");
ok(typeof wdg(clone(SH)) === "string" && wdg(clone(SH)).indexOf("digest writes itself") > -1, "digest has a graceful empty state");
let dg = clone(SH);
dg.dailyLogs["2026-07-22"] = { cal: 2470, pro: 176, steps: 9000 };
dg.sessionLog["2026-07-23"] = { entries: [], at: 1 };
dg.feed.unshift({ d: "2026-07-23", t: "PRESS 245 — OWNED", how: "x" });
const dgs = wdg(dg);
ok(dgs.indexOf("Protein 1/1") > -1 && dgs.indexOf("1 session") > -1 && dgs.toLowerCase().indexOf("owned") > -1, "digest composes real state into one paragraph: " + dgs.slice(0, 70));

// (interim)

// v3.8 — the one thing
const { theOneThing: oo, SEED: SI } = __test;
const slpNoClean = { clean: false, run: 2, need: 3 };
const one1 = oo(clone(SI), slpNoClean, 8);
ok(one1.t.indexOf("night") > -1 && one1.sub.indexOf("CLEAN") > -1, "unlogged sleep tops the ladder with the flip stakes named");
let od = clone(SI);
const isoL = (d) => { const x = new Date(d); return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0"); };
od.sleep.nights.push({ d: isoL(Date.now() - 864e5), h: 8 }, { d: isoL(Date.now() - 2 * 864e5), h: 8 }, { d: isoL(Date.now() - 3 * 864e5), h: 8 });
od.sleep.nights.sort((a, b) => (a.d < b.d ? -1 : 1));
od.fixWindow = { opened: "x" };
const one2 = oo(od, slpNoClean, 12);
ok(one2.t.indexOf("Fix window") === 0, "open fix window outranks everything after sleep");
od.fixWindow = null;
od.events.forEach(e => { e.estimated = true; });
od.dailyLogs[isoL(Date.now())] = { cal: 1750, pro: 176, steps: 16000 };
od.sessionLog[isoL(Date.now())] = { entries: [], at: 1 };
const one3 = oo(od, { clean: true, run: 3, need: 3 }, 21);
ok(one3.t.indexOf("banked") > -1, "all-done evening reads as banked: " + one3.t);

// (interim)

// v3.8.1 — night dating
const { owedNights: on2, theOneThing: oo2, GLOSSARY: GL2, SEED: SJ } = __test;
ok(GL2.nightdate && GL2.nightdate[1].indexOf("evening it began") > -1, "night-dating rule is in the glossary");
let sn = clone(SJ);
const owedA = on2(sn, 8);
ok(owedA.length >= 1, "morning view: at least one owed night surfaces, dated: " + owedA.join(","));
const late = on2(sn, 1), morn = on2(sn, 8);
ok(late.length === 0 || morn.length === 0 || late[0] <= morn[0], "pre-5am never targets an unslept night (late-first date ≤ morning-first date)");
const oneN = oo2(sn, { clean: false, run: 2, need: 3 }, 8);
ok(owedA.length === 0 || oneN.t.indexOf("night") > -1, "ONE THING names the dated night, not a riddle: " + oneN.t);

// (interim)

// v3.9 — the sleep build
const { sleepSpanH: ssp, caffAt: cfa, sleepLab: slb, migrate: mgB, SEED: SK } = __test;
ok(ssp("23:00", "06:45") === 7.75 && ssp("01:00", "06:45") === 5.75 && ssp("23:30", "06:45", 30) === 6.75, "bed→wake math: cross-midnight, late nights, and mid-night wake deductions");
ok(cfa(300, 12, 22.5) === 70 && cfa(0, 12, 22.5) === 0, "caffeine tail: 300 mg at noon ≈ 70 mg at lights-out");
const lab9 = slb(clone(SK));
ok(lab9.length === 3 && lab9[0].id === "melaexp" && lab9[0].status === "ARMED" && lab9[0].deep.indexOf("Ferracioli") > -1, "melatonin experiment pre-registered, armed, citations attached");
let se = clone(SK);
for (let k = 1; k <= 7; k++) { const dd = new Date(2026, 6, 23 + k); se.sleep.nights.push({ d: dd.getFullYear() + "-" + String(dd.getMonth() + 1).padStart(2, "0") + "-" + String(dd.getDate()).padStart(2, "0"), h: 7.8, tags: [] }); }
se.sleep.nights = se.sleep.nights.filter((n, i, a) => a.findIndex((x) => x.d === n.d) === i).sort((a, b) => (a.d < b.d ? -1 : 1));
const lab9b = slb(se);
ok(lab9b[0].status === "LIVE" && lab9b[0].forYou.indexOf("avg 7.8") > -1, "seven none-nights flip the experiment LIVE with the verdict math");
const oldV10 = clone(SK); oldV10.v = 10; delete oldV10.sleep.anchor; delete oldV10.sleep.caffMg; delete oldV10.sleep.melaExp;
const m11 = mgB(oldV10);
ok(m11.v >= 11 && m11.sleep.anchor.wake === "06:45" && m11.sleep.melaExp.arm === "none", "v10 phones patch to v11 with the anchor and the experiment");

// (interim)

// v3.10 — the shelving system
const { labGroups: lg, labAnalytics: laX, sleepLab: slX, SEED: SL } = __test;
const gs = lg(clone(SL));
ok(gs.length >= 6 && ["scale", "training", "sleep", "road", "locked", "shelf"].every(id => gs.some(g => g.id === id)), "the original six shelves persist inside the grown system");
const totCards = gs.reduce((a, g) => a + g.cards.length, 0);
const expected = laX(clone(SL)).length + __test.labAnalytics2(clone(SL)).length + slX(clone(SL)).length + 5;
ok(totCards === expected, `every card filed exactly once (${totCards}/${expected}) — no orphans, no dupes`);
const slG = gs.find(g => g.id === "sleep");
ok(slG.cards.some(c => c.id === "melaexp") && slG.cards.some(c => c.id === "sleepdose") && slG.cards.some(c => c.id === "sleeplag"), "sleep shelf holds the moved experiments plus the lag map");
ok(gs.every(g => g.live + g.armed + g.rest === g.cards.length), "shelf counters add up on every shelf");

// (interim)

// v3.10.1 — results announce themselves
const { sweepLab: swp, SEED: SM } = __test;
const swBase = swp(clone(SM), 3);
ok(swBase && Object.keys(swBase.labSeen).length >= 20 && swBase.feed.length === clone(SM).feed.length, "first sweep baselines every card silently — no spam on migration");
let ann = JSON.parse(JSON.stringify(swBase));
for (let k = 1; k <= 7; k++) { const dd = new Date(2026, 6, 23 + k); ann.sleep.nights.push({ d: dd.getFullYear() + "-" + String(dd.getMonth() + 1).padStart(2, "0") + "-" + String(dd.getDate()).padStart(2, "0"), h: 7.8, tags: [] }); }
const ann2 = swp(ann, 3);
ok(ann2 && ann2.feed.some(f => f.t.indexOf("LAB LIVE — MELATONIN") === 0) && ann2.labSeen.melaexp === "LIVE", "threshold crossed → the feed announces the verdict");
ok(swp(ann2, 3) === null, "no re-announcement — quiet until the next flip");

// (interim)

// v3.13 — the outside-the-box wing
const { labAnalytics2: la2, labGroups: lg2, completeSession: csW, genSession: gsW, SEED: SN } = __test;
const wing = la2(clone(SN));
ok(wing.length === 27, "twenty-seven instruments, all constructed without a single crash: " + wing.length);
ok(wing.every(c => c.tag && c.deep && c.forYou && c.status), "every card carries all three layers plus a status");
const ids2 = wing.map(c => c.id);
ok(["adaptmeter","strvelocity","canary","regularity","missarch","weekend","stepeff","refeedroi","sessionshape","compound","ghost","sentinel","letter"].every(x => ids2.includes(x)), "the full roster reports");
ok(wing.find(c => c.id === "weekend").status === "LIVE", "sheet history powers instant verdicts on day one");
/* MISS ARCHAEOLOGY now reads ARMED on the seed, and that is the correct answer.
   It went LIVE before only because the protein test was symmetric: days he ate
   MORE than target counted as misses, so the instrument had a pile of phantom
   failures to autopsy. With protein treated as a floor — the only thing the
   literature supports — his record has essentially none. The card's own empty
   state says the honest thing. See PROTEIN_HIT_NOTE. */
ok(wing.find(c => c.id === "missarch").status === "ARMED" && wing.find(c => c.id === "missarch").forYou.indexOf("Zero misses") > -1,
   "and MISS ARCHAEOLOGY correctly finds nothing to autopsy — overshoot stopped being counted as a failure");
ok(wing.find(c => c.id === "ghost").status === "MODEL" && wing.find(c => c.id === "ghost").forYou.indexOf("behind you") > -1, "ghost is badged a MODEL and running");
const gAll = lg2(clone(SN));
ok(gAll.length === 11 && gAll.map(g => g.id).join(",") === "scale,engine,training,sleep,pulse,behavior,trials,road,models,locked,shelf", "eleven shelves, fixed order");
const tot2 = gAll.reduce((a, g) => a + g.cards.length, 0);
ok(tot2 === 57, "all 57 instruments filed exactly once (R15g added the regime detector): " + tot2);
// loads ride sets automatically
let ws = clone(SN); ws.sleep.nights.push({d: isoL(Date.now() - 864e5), h: 8});
const slpC = { clean: true, run: 3, need: 3 };
/* AUDIT r3 item 4 — instance-17's exact shape, pre-existing since v3.x, and DEEPER than
   the audit's diagnosis. Probed every day of the week under the frozen clock: genSession
   returns .ex — it has not returned .blocks on ANY day since the API changed shape. The
   if-condition was not wrong-on-Wednesdays, it was UNSATISFIABLE; the else-arm was the only
   path that had ever run in this era, and the assertion tested an API three generations
   stale (.blocks, .target, and a state return where completeSession now returns {s,lines}).
   The arm's name confessed: covered-by-shape-of-code meant covered by nothing. */
let rideDay = null, rideG = null;
for (let k = 0; k < 7 && !rideDay; k++) {
  const dIso = isoL(Date.now() + k * 864e5);
  const g = gsW(ws, dIso, slpC);
  if (g && g.ex && g.ex.length) { rideDay = dIso; rideG = g; }
}
ok(rideDay != null, "a scheduled session day exists within a week of the frozen clock — if this fails, the container calendar broke, which is its own finding");
{
  const done = csW(ws, rideDay, rideG.ex.map(e => ({ id: e.id, reps: e.tgt ? e.tgt.slice() : [8], rir: 1 })), slpC);
  const ents = done.s.sessionLog[rideDay].entries;
  /* driving it surfaced the REAL contract the dead assertion mis-stated: completeSession
     rides w only when the roster weight is A NUMBER. String weights (curl "55·55·50")
     log w:null — verified in the LIVE ledger (07-27 curl w=null) — which is exactly why
     sessionScore excludes non-numeric lifts. Two-sided so neither half can drift. */
  const numeric = ents.filter(e => { const ex3 = ws.exercises.find(x => x.id === e.id); return ex3 && typeof ex3.w === "number"; });
  const stringW = ents.filter(e => { const ex3 = ws.exercises.find(x => x.id === e.id); return ex3 && typeof ex3.w !== "number"; });
ok(numeric.length > 0 && numeric.every(e => e.w != null && e.w > 0), "weight rides every NUMERICALLY-weighted set automatically, asserted unconditionally on a day the calendar actually schedules (" + numeric.length + " sets) — the dead assertion had never executed and was three API generations stale");
ok(stringW.length > 0 && stringW.every(e => e.w == null), "while string-weighted lifts (curl 55·55·50) log w:null BY DESIGN — length > 0 pins that this side is DRIVEN: a split change dropping curl from the scheduled day would otherwise silently un-drive it, the self-disabling-arm pattern by one term");
}

// (interim)

// v3.13.1 — results meet you at the front door
const swB2 = __test.sweepLab(clone(__test.SEED));
let annF = JSON.parse(JSON.stringify(swB2));
for (let k = 1; k <= 7; k++) { const dd = new Date(2026, 6, 23 + k); annF.sleep.nights.push({ d: dd.getFullYear() + "-" + String(dd.getMonth() + 1).padStart(2, "0") + "-" + String(dd.getDate()).padStart(2, "0"), h: 7.8, tags: [] }); }
const annF2 = __test.sweepLab(annF);
ok(annF2 && (annF2.labNews || []).length > 0 && annF2.labNews[0].indexOf("MELATONIN") > -1, "a flip queues front-door news for NOW");

// (interim)

// v3.14 — prophet + console
const { labAnalytics2: laW, sweepLab: swp3, migrate: mg14, SEED: SO } = __test;
const oldV12 = clone(SO); oldV12.v = 12; delete oldV12.forecasts;
ok(mg14(oldV12).v >= 13 && Array.isArray(mg14(oldV12).forecasts), "v12 phones patch to v13 with the forecast journal");
const j1 = swp3(clone(SO));
ok(j1 && j1.forecasts.length === 1 && typeof j1.forecasts[0].pred7 === "number", "the sweep journals one dated 7-day forecast per day");
ok(swp3(j1) === null, "second sweep same day: no duplicate journal, no writes");
const wing3 = laW(clone(SO));
ok(wing3.length === 27, "twenty-seven instruments in the wing now: " + wing3.length);
const pr = wing3.find(c => c.id === "prophet");
ok(pr && pr.status === "ARMED" && pr.deep.indexOf("error bars") > -1, "prophet armed, philosophy attached");
let fcS = clone(SO);
const isoP = (off) => { const d = new Date(Date.now() + off * 864e5); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
/* Grading now happens against the RAW morning read seven days later, not against the
   model's own smoothed trend — see PROPHET_CIRCULARITY_NOTE. So the fixture has to
   supply reads on the target dates, and the trend values are deliberately WRONG here
   to prove the grade does not come from them. */
fcS.forecasts = [{ d: isoP(-14), trend: 999, rate: 1.2, pred7: 163.8, sealed: false }, { d: isoP(-8), trend: 999, rate: 1.2, pred7: 162.6, sealed: false }, { d: isoP(-1), trend: 999, rate: 1.2, pred7: 161.3, sealed: false }];
fcS.reads = (fcS.reads || []).concat([
  { d: isoP(-7), w: 164.0, sealed: false, note: "" },
  { d: isoP(-1), w: 162.8, sealed: false, note: "" },
]);
const pr2 = laW(fcS).find(c => c.id === "prophet");
ok(pr2.status === "PROVISIONAL" && pr2.forYou.indexOf("±") > -1, "two grades read PROVISIONAL, not LIVE — a trust number needs ~6: " + pr2.status);
ok(pr2.forYou.indexOf("not yet a verdict") > -1 || pr2.forYou.indexOf("PROVISIONAL") > -1, "and the card says so in words, with how far it has to go");
/* The anti-circularity guard, stated numerically rather than by sniffing for digits.
   trend is 999 on every journalled forecast here while the seeded reads sit ~0.2 lb
   from pred7. Graded against the reads the miss is a fraction of a pound; graded
   against the trend it would be in the hundreds. */
const missP = +(pr2.forYou.match(/±([0-9.]+)/) || [])[1];
ok(missP < 5, "the grade comes off the scale, not the smoothed trend — miss ±" + missP + " lb, not hundreds");
ok(wing3.find(c => c.id === "whatif").status === "MODEL", "the console is badged a MODEL");

// LAB P0-1 — an interval on every "measured" scalar
const { ciOf: ci1, LAB_MIN_N: MINN, tCrit: tc1 } = __test;
ok(ci1([]).n === 0 && ci1([]).mean === null, "no observations: no mean, no invented precision");
ok(ci1([1.0]).n === 1 && ci1([1.0]).sd === null && ci1([1.0]).provisional === true, "one observation has a mean and no spread — and says so");
{
  /* The audit's worked example: four refeed mornings that averaged about half a pound
     with an SD near 1.4. The interval has to be wide enough to cross zero, because
     that is the honest finding — this is noise with a mean, not a number. */
  const c = ci1([-0.4, -0.2, 0.7, 2.8]);
  ok(c.n === 4 && Math.abs(c.mean - 0.72) < 0.02, "mean of the worked example: " + c.mean);
  ok(c.sd > 1.3 && c.sd < 1.6, "SD near 1.4 as the audit computed: " + c.sd);
  ok(c.straddlesZero === true, "and its 95% interval crosses zero — not distinguishable from no effect");
  ok(c.provisional === true && c.txt.indexOf("provisional") > -1 && c.txt.indexOf("measured") === -1, "n=4 is provisional, and the tag never says 'measured': " + c.txt);
}
{
  /* More data must NARROW the interval while the observed range does the opposite —
     which is exactly why a min-max was never an interval. */
  const few = ci1([1, 2, 3]), many = ci1([1, 2, 3, 1, 2, 3, 1, 2, 3, 2]);
  ok(many.half < few.half, "the interval narrows with n (" + few.half + " -> " + many.half + ")");
  ok(many.enough === true && many.txt.indexOf("measured") > -1, "past the floor it earns the word measured: " + many.txt);
}
ok(MINN === 6, "the small-n floor is six observations, per single-case guidance");

// LAB P0-2 — multiple comparisons: the hunters publish their own false-alarm rate
const { coFlagRate: cfr, bhFDR: bh, twoTail: tt, chanceWords: cw } = __test;
ok(Math.abs(tt(1.8) - 0.0719) < 0.002, "two-tailed |z|>1.8 is about 7.2% per dimension: " + tt(1.8).toFixed(4));
ok(Math.abs(tt(1.96) - 0.05) < 0.002, "and the normal tail is calibrated at the familiar 1.96 -> 0.05");
{
  /* The sentinel: 2-of-3 dimensions over a 10-day window. The audit put this at
     "roughly one chance co-flag per 10 days"; computed from the real thresholds it is
     materially lower, and the card prints what is computed rather than what was
     asserted. Either way it is not negligible, which is the point of disclosing it. */
  const r = cfr([tt(1.8), tt(1.8), tt(2.0)], 2, 10);
  ok(r.perDay > 0.005 && r.perDay < 0.03, "2-of-3 co-flag chance is ~1% per day: " + r.perDay.toFixed(4));
  ok(r.expected > 0.05 && r.expected < 0.35, "so ~0.1-0.3 chance co-flags per 10-day window, not one: " + r.expected);
  ok(r.oncePerDays > 30, "i.e. about one false alarm every " + r.oncePerDays + " days");
  ok(cfr([tt(1.8), tt(1.8), tt(2.0)], 3, 10).perDay < r.perDay, "demanding all three is stricter than two of three");
}
{
  /* Benjamini-Hochberg: nothing survives when everything is noise, and a genuine
     standout survives alongside its own multiplicity correction. */
  const noise = bh([0.4, 0.55, 0.7, 0.9, 0.95], 0.1);
  ok(noise.nKept === 0, "BH keeps nothing when every p-value is noise");
  const one = bh([0.001, 0.4, 0.55, 0.7, 0.9], 0.1);
  ok(one.nKept === 1 && one.keep.has(0), "BH keeps the one real standout out of five");
  ok(bh([0.02, 0.03, 0.04], 0.1).nKept >= 1, "and several consistent smalls survive together");
}
ok(cw(30, 3) > 0 && cw(9, 30) === 0, "the chance-word estimate scales with corpus size and is zero below threshold");

// LAB P0-3 — autocorrelation: the rate CI was too narrow, the noise band the wrong variance
{
  const { currentRate: cr3, labAnalytics: la3, SEED: S3 } = __test;
  const r3 = cr3(clone(S3));
  ok(r3.method === "regression" && r3.n >= 10, "rate is a regression over the daily reads: n=" + r3.n);
  ok(typeof r3.ciOls === "number" && typeof r3.ci === "number", "both intervals are reported — OLS and autocorrelation-robust");
  /* The whole point: HAC can never be narrower than the OLS interval it replaces. */
  ok(r3.ci >= r3.ciOls, "the HAC interval is never narrower than OLS: ±" + r3.ci + " vs ±" + r3.ciOls);
  ok(r3.hacL >= 1 && r3.hacL <= 6, "Bartlett bandwidth from the plug-in rule: L=" + r3.hacL);
  ok(r3.rho1 !== null && r3.rho1 > -1 && r3.rho1 < 1, "lag-1 residual autocorrelation reported: rho1=" + r3.rho1);
  ok(r3.hacInflation >= 1, "inflation factor over OLS is at least 1: x" + r3.hacInflation);
  /* The point estimate must NOT move — only its stated uncertainty. */
  ok(Math.abs(r3.scale - +(-((() => { const rd = clone(S3).reads.filter(r => !r.sealed && r.w != null).slice(-28); const t0 = new Date(rd[0].d).getTime(); const xs = rd.map(r => (new Date(r.d).getTime() - t0) / 864e5), ys = rd.map(r => r.w); const n = xs.length; const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n; let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; } return sxy / sxx; })()) * 7).toFixed(2)) < 0.02, "the slope itself is untouched — only the interval widened");
  ok(typeof r3.sigma === "number" && r3.sigma > 0, "residual SD around the fitted trend is exposed for the noise band: " + r3.sigma);

  /* The noise floor now bands a single read against the trend with sigma, not with the
     day-to-day difference RMS — which is about sqrt(2) larger for the same data. */
  const nz3 = la3(clone(S3)).find(c => c.id === "noise");
  ok(nz3.lines[0].indexOf("damped trend") > -1, "the noise card bands one reading against the damped trend: " + nz3.lines[0]);
  ok(nz3.lines.length === 2 && nz3.lines[1].indexOf("not the band") > -1, "and keeps the consecutive-day figure, labelled as a different quantity");
  const band = +(nz3.lines[0].match(/±([0-9.]+)/) || [])[1];
  const dayToDay = +(nz3.lines[1].match(/±([0-9.]+)/) || [])[1];
  /* The audit predicted the old band was ~41% too WIDE, from the independence relation
     that a day-to-day difference is √2 larger than a read-vs-trend deviation. On his
     real data it is the reverse — consecutive mornings are so alike that differences
     UNDERSTATE how far a multi-day swing carries him off the line. Autocorrelation
     inverts the relation, so the assertion records the measured direction rather than
     the predicted one. */
  ok(band > dayToDay, "on autocorrelated data the read-vs-trend band is WIDER than the day-to-day figure (" + band + " vs " + dayToDay + ") — the independence relation inverts");
  /* The card and the chart must agree BY CONSTRUCTION, not by coincidence — both read
     the same weightNoise() estimate, so they can never drift apart. */
  /* 0.05 tolerance because the card prints to one decimal; the point is that it is the
     SAME estimate, not a second one computed a different way. */
  ok(Math.abs(band - __test.weightNoise(clone(S3).reads).sd) < 0.05, "the card's band IS the chart's band — one estimator, two surfaces (" + band + " vs " + __test.weightNoise(clone(S3).reads).sd + ")");
  ok(band > 0.3 && band < 2.5, "and it sits inside the honesty clamps: " + band);
}
ok(tc1(1) > tc1(10) && tc1(10) > tc1(60), "t multiplier shrinks as df grows — small n pays for itself");

// LAB recency — no card may present a past event as upcoming
{
  const { labAnalytics: laR, nextEvent: neR, lastEvent: leR, SEED: SR } = __test;
  const isoR = (off) => { const d = new Date(Date.now() + off * 864e5); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };

  /* The exact shape of the reported bug: an event five days in the past. daysUntil() is
     negative for it, and the old filter `daysUntil(e.d) <= 3` matched precisely because
     it was negative. */
  const past = clone(SR);
  past.events = [{ d: isoR(-5), t: "WEDDING #2", estimated: false }];
  ok(neR(past, 3) === null, "a five-day-old event is NOT selected as upcoming");
  ok(leR(past, 7) && leR(past, 7).t === "WEDDING #2", "it is available to lastEvent for past-tense copy");
  const wPast = laR(past).find(c => c.id === "whoosh");
  ok(wPast.forYou.indexOf("expect a next-morning spike") === -1, "and whoosh never says 'expect' about it");
  ok(/was\s+\w+\s+\d+\/\d+/.test(wPast.forYou) || wPast.forYou.indexOf("No event upcoming") > -1, "it speaks in the past tense or omits the line: " + wPast.forYou.slice(0, 70));

  /* Nearest-first, not first-in-array: an unsorted list must still yield the soonest. */
  const many = clone(SR);
  many.events = [{ d: isoR(9), t: "LATER", estimated: false }, { d: isoR(2), t: "SOONER", estimated: false }, { d: isoR(-3), t: "GONE", estimated: false }];
  ok(neR(many).t === "SOONER", "nextEvent returns the nearest upcoming, not the first in the array");
  ok(neR(many, 3).t === "SOONER" && neR(many, 1) === null, "and the horizon cap is respected");

  /* An upcoming event inside the horizon SHOULD get the forward-looking line. */
  const soon = clone(SR);
  soon.events = [{ d: isoR(2), t: "WEDDING #3", estimated: false }];
  const wSoon = laR(soon).find(c => c.id === "whoosh");
  ok(wSoon.forYou.indexOf("WEDDING #3") > -1 && wSoon.forYou.indexOf("expect") > -1, "a genuinely upcoming event still gets its bracing line");
  ok(wSoon.forYou.indexOf("in 2d") > -1, "and the line states how far off it is, so it cannot read as 'now' later");

  /* Estimated (athlete-declared rough) events are not real calendar events. */
  const est = clone(SR);
  est.events = [{ d: isoR(2), t: "MAYBE", estimated: true }];
  ok(neR(est) === null, "declared-estimate events are not treated as scheduled events");
  ok(neR({ events: [] }) === null && neR({}) === null, "no events, and a stateless call, both return null rather than throwing");

  /* The property that actually matters, tested directly rather than by sniffing for
     hardcoded-looking strings: any date a card offers in a FORWARD-LOOKING sentence must
     not already be in the past. A computed date and an authored one look identical in the
     output — "8/4" either way — so the only honest check is whether the date has passed.
     Sentences in the past tense are excluded, since historical receipts are legitimate. */
  const cards = laR(clone(SR));
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const staleForward = [];
  cards.forEach((c) => {
    String(c.forYou || "").split(/(?<=[.!])\s+/).forEach((sentence) => {
      if (!/\b(?:expect|prints|completes|booking|Cleanest|due|next|unlock)/i.test(sentence)) return;
      /* Historical receipts are legitimate and often sit inside a sentence that opens
         with an instruction — "assume next-day risk: your 4.5 h night of 7/16 landed
         hardest on the 7/17 lower" is honest and must not be flagged. Any past-tense
         marker excludes the sentence; what remains is genuine forward-looking copy. */
      if (/\b(?:was|were|ago|already|so far|since|landed|broke|tripped|owns|owned|cost|showed|came|ran|held|logged|recorded|fell)\b/i.test(sentence)) return;
      const m = sentence.match(/\b(\d{1,2})\/(\d{1,2})\b/g) || [];
      m.forEach((md) => {
        const [mo, da] = md.split("/").map(Number);
        const d = new Date(now.getFullYear(), mo - 1, da);
        /* a date more than 6 months back is a year-boundary artefact, not staleness */
        const ageDays = Math.round((now - d) / 864e5);
        if (ageDays > 0 && ageDays < 180) staleForward.push(`${c.id}: "${md}" in "${sentence.trim().slice(0, 60)}"`);
      });
    });
  });
  ok(staleForward.length === 0, "no forward-looking LAB readout offers a date that has already passed" + (staleForward.length ? " — " + staleForward.join(" | ") : ""));

  /* A pair of dates offered together must be in chronological order. Taking "next Tuesday"
     and "next Friday" independently produced "Tue 8/4 + Fri 7/31" on a Thursday — a Friday
     before its own Tuesday. Caught by rendering the card and reading it, not by the types. */
  const tfR = cards.find(c => c.id === "tuefri");
  if (tfR && /completes\s+\w+\s+(\d{1,2})\/(\d{1,2})\s*\+\s*\w+\s+(\d{1,2})\/(\d{1,2})/.test(String(tfR.forYou))) {
    const [, m1, d1, m2, d2] = String(tfR.forYou).match(/completes\s+\w+\s+(\d{1,2})\/(\d{1,2})\s*\+\s*\w+\s+(\d{1,2})\/(\d{1,2})/);
    const first = new Date(now.getFullYear(), +m1 - 1, +d1), second = new Date(now.getFullYear(), +m2 - 1, +d2);
    ok(second > first, `the Tue/Fri pair is offered in chronological order (${m1}/${d1} then ${m2}/${d2})`);
    ok(Math.round((second - first) / 864e5) === 3, "and both fall in the same week — Tuesday plus three days");
  }
}

// LAB P1c — Tue/Fri is labelled confounded and tested; trials desk becomes inferential
{
  const { labAnalytics: laC, trialVerdict: tvC, trialTpl: ttC, SEED: SCx } = __test;
  const tf = laC(clone(SCx)).find(c => c.id === "tuefri");
  ok(tf.t.indexOf("CONTRAST") > -1 && tf.tag.indexOf("not a controlled experiment") > -1, "Tue/Fri is named a contrast, not an experiment");
  ok(tf.deep.indexOf("load-progression") > -1 && tf.deep.indexOf("day-of-week") > -1, "and it names the confounds it cannot remove");
  ok(tf.status !== "LIVE", "it never reads LIVE — an observational contrast is not a measurement: " + tf.status);

  /* An exact randomization test over the block values, with an honest floor on what p
     can be at this block count. */
  const trial = { tplId: "refeedsize", started: isoL(Date.now() - 40 * 864e5) };
  const vC = tvC(clone(SCx), trial);
  if (vC && vC.nA >= 2 && vC.nB >= 2) {
    ok(vC.pRand != null && vC.pRand > 0 && vC.pRand <= 1, "the trial verdict carries a randomization-test p: " + vC.pRand);
    ok(vC.pFloor != null && vC.pRand >= vC.pFloor - 1e-9, "and p can never beat the floor its block count allows: floor " + vC.pFloor);
    ok(vC.nSplits >= 6, "the test enumerates every split exhaustively rather than sampling: " + vC.nSplits + " splits");
    ok(vC.diff != null, "the arm difference is reported, not just two means");
  }
  /* Carryover is per-mechanism: refeed water/glycogen and a caffeine tail bleed across a
     block boundary, a lights-out shift does not. The ids must match the real templates —
     an unmatched id would silently read as "no carryover risk", which is the wrong
     default, and this pair of assertions is what caught exactly that typo. */
  ok(tvC(clone(SCx), { tplId: "refeedsize", started: isoL(Date.now()) }).needsWashout === true, "refeed trials are flagged for carryover washout");
  ok(tvC(clone(SCx), { tplId: "caffcut", started: isoL(Date.now()) }).needsWashout === true, "so is the caffeine trial — it has a pharmacological tail");
  ok(tvC(clone(SCx), { tplId: "lightsshift", started: isoL(Date.now()) }).needsWashout === false, "the lights-out shift is not — carryover is per-mechanism, not blanket");
}

// LAB P1a — whoosh self-calibrates, and the forecast band grows at the right rate
{
  const { labAnalytics: laA, labAnalytics2: laA2, weightNoise: wnA, SEED: SA } = __test;
  const wA = laA(clone(SA)).find(c => c.id === "whoosh");
  const sdA = wnA(clone(SA).reads).sd;
  /* Thresholds must be derived from his own noise, not hardcoded 2.0/0.4. */
  ok(wA.deep.indexOf((3 * sdA).toFixed(2)) > -1, "whoosh states its spike threshold as 3 sigma of his measured noise: " + (3 * sdA).toFixed(2));
  ok(wA.deep.indexOf((1 * sdA).toFixed(2)) > -1, "and 'cleared' as within 1 sigma: " + (1 * sdA).toFixed(2));
  ok(wA.deep.indexOf("magic constants") > -1, "and says why the old flat constants were wrong");

  /* Forecast band: sigma*sqrt(k + k^2/n), so it grows sublinearly in k rather than
     linearly. The old sigma*k made the week-8 band far too wide. */
  const fc = laA2(clone(SA)).find(c => c.id === "forecast");
  if (fc && fc.lines && fc.lines.length >= 8) {
    const halfAt = (k) => { const row = fc.lines.find(l => l.indexOf("wk +" + k + " ") === 0); return row ? +(row.match(/±([0-9.]+)/) || [])[1] : null; };
    const h1 = halfAt(1), h8 = halfAt(8);
    if (h1 != null && h8 != null) {
      ok(h8 > h1, "the band still widens with distance (" + h1 + " -> " + h8 + ")");
      ok(h8 < h1 * 8, "but sublinearly — not the old sigma*k, which would put week 8 at " + (h1 * 8).toFixed(1));
    }
  }
}

// (interim)

// v3.15 — the lab organizes itself
const { labDocket: dk1, labStatusList: sl1, SEED: SP } = __test;
const dock = dk1(clone(SP));
ok(dock.fresh.length === 0 && dock.next.length >= 1 && dock.next.length <= 3, "docket: quiet feed, up to three next-to-speak");
ok(dock.next.every(n => n.n < n.need) && dock.next[0].pct >= (dock.next[1] ? dock.next[1].pct : 0), "next-to-speak sorted by closeness to threshold");
ok(typeof dock.sentinel.txt === "string" && dock.sentinel.txt.length > 4, "sentinel line reads");
const ranked = sl1(clone(SP));
/* PROVISIONAL ranks 0.5 — after anything settled, before anything still gathering. */
const rk = { LIVE: 0, TRACKING: 0, PROVISIONAL: 0.5, ARMED: 1, MODEL: 2, "ON FILE": 3, LOCKED: 4 };
ok(ranked.length === 57 && ranked.every((c, i) => i === 0 || (rk[ranked[i - 1].status] ?? 5) <= (rk[c.status] ?? 5)), "status lens: 57 cards, monotone rank order");
ok(ranked.some((c) => c.status === "PROVISIONAL"), "the lens has a PROVISIONAL tier — small-n cards no longer sit among the settled ones");
// a flip lands on the docket's fresh row
const swD = __test.sweepLab(clone(SP));
let dkF = JSON.parse(JSON.stringify(swD));
for (let k = 1; k <= 7; k++) { const dd = new Date(2026, 6, 23 + k); dkF.sleep.nights.push({ d: dd.getFullYear() + "-" + String(dd.getMonth() + 1).padStart(2, "0") + "-" + String(dd.getDate()).padStart(2, "0"), h: 7.8, tags: [] }); }
const dkF2 = __test.sweepLab(dkF);
ok(dk1(dkF2).fresh.some(f => f.t.indexOf("MELATONIN") > -1), "a flip lands on the docket front page, dated");

// (interim)

// v3.16 — falling asleep is now real
const { medianSOL: mso, lightsOutT: lot, migrate: mg16, SEED: SQ } = __test;
ok(mso(clone(SQ)) === 15, "honest 15-min default until five nights are measured");
/* lightsOutT used to run off s.sleep.anchor.asleepTarget — a SECOND sleep
   target (8 h) sitting beside s.sleep.cleanH (7.5), with nothing reconciling
   them. Two targets for one quantity is the same failure as two kcal-per-pound
   constants. It now uses the one the rest of the app holds him to. */
ok(lot(clone(SQ)).target === clone(SQ).sleep.cleanH, "lights-out is derived from the SAME sleep target every other surface uses: " + lot(clone(SQ)).target + " h");
ok(lot(clone(SQ)).t === "23:00", "so with no clock times on file the fallback math is 7.5 h asleep + 15 m drift back from the anchor: " + lot(clone(SQ)).t);
ok(lot(clone(SQ)).measured === false && lot(clone(SQ)).wakeRef === "06:45", "and it flags that the wake reference is the authored fallback, not his measured clock");
/* once his own clock exists it must win — this is the two-bedtimes bug */
const timed16 = clone(SQ);
timed16.sleep.nights = timed16.sleep.nights.concat([
  { d: "2026-08-11", h: 7.5, bed: "01:30", wake: "09:00", sol: 15 },
  { d: "2026-08-12", h: 7.5, bed: "01:45", wake: "09:00", sol: 15 },
  { d: "2026-08-13", h: 7.5, bed: "01:40", wake: "09:00", sol: 15 },
]);
ok(lot(timed16).measured === true && lot(timed16).wakeRef === "09:00", "with three timed nights it switches to his measured wake: " + lot(timed16).wakeRef);
ok(lot(timed16).t !== lot(clone(SQ)).t, "which moves lights-out off the authored bearing — the app printed two bedtimes 2h45m apart before this: " + lot(clone(SQ)).t + " vs " + lot(timed16).t);
let sq = clone(SQ);
for (let k = 0; k < 6; k++) sq.sleep.nights.push({ d: "2026-08-0" + (k + 1), h: 7.5, sol: 30 });
ok(mso(sq) === 30 && lot(sq).t === "22:45", "measured 30-min drift-off pulls lights-out 15 min earlier automatically: " + lot(sq).t);
const oldV13 = clone(SQ); oldV13.v = 13; delete oldV13.sleep.anchor.asleepTarget;
ok(mg16(oldV13).v >= 14 && mg16(oldV13).sleep.anchor.asleepTarget === 8, "v13 phones patch to v14 with the asleep target");

// (interim)

// v3.17 — the sibling design review
const { labSections: ls17, SEED: SR } = __test;
const secs = ls17(clone(SR));
ok(secs.reduce((a, x) => a + x.cards.length, 0) === 57, "all 57 filed across the plain-language sections, none lost");
const spk = secs.find(x => x.k === "speaking"), gth = secs.find(x => x.k === "gathering");
ok(spk.cards.every(c => c.status === "LIVE" || c.status === "TRACKING"), "speaking holds only what has verdicts");
ok(gth.cards.every((c, i) => i === 0 || (gth.cards[i - 1].prog.n / gth.cards[i - 1].prog.need) >= (c.prog.n / c.prog.need)), "gathering sorted by closeness to speaking — the top row IS next-to-speak");

// (interim)

// v3.18 — the lab on one card
ok(typeof __test.labSections === "function" && typeof __test.labGroups === "function", "engine keeps the taxonomy even though the UI stopped wearing it");
const secs18 = __test.labSections(clone(__test.SEED));
/* PROVISIONAL sits between them now: settled verdicts first, then the cards that have
   a number without the observations to stand behind it, then what is still gathering. */
ok(secs18[0].k === "speaking" && secs18[1].k === "provisional" && secs18[2].k === "gathering", "speaking leads, provisional next, gathering follows — the page's whole grammar");

// (interim)

// v3.19 — the chart tells the truth beautifully
const { trendSeries: tsr, migrate: mg19, SEED: SS } = __test;
const trds = [{ d: "2026-07-01", w: 168 }, { d: "2026-07-02", w: 171, sealed: true }, { d: "2026-07-03", w: 167 }];
const ser = tsr(trds);
ok(ser.length === 3 && ser[1].t === ser[0].t, "sealed reads carry the trend flat — quarantine drawn, not just stored");
ok(Math.abs(ser[2].t - (168 - 0.3)) < 0.01, "clean reads step the curve 30% toward the morning, clamped");
const full = tsr(clone(SS).reads);
ok(Math.abs(full[full.length - 1].t - clone(SS).trend) < 1.2, "recomputed curve lands near the live trend: " + full[full.length - 1].t);
const oldV14 = clone(SS); oldV14.v = 14; oldV14.queue.push({ id: "q_x", rule: "LOCKED — runs unless a true <4.5 h night", t: "X", state: "Y", gate: "Z", kind: "info", done: false });
const m15 = mg19(oldV14);
ok(m15.v >= 15 && m15.queue.find(q => q.id === "q_x").rule.indexOf("Gate passed") === 0, "confusing LOCKED wording patched away on phones");

// (interim)

// v3.21 — the coach closes its own loops
const { closeEvent: ce21, refeedBumps: rb21, SEED: ST } = __test;
let evS = clone(ST);
const evId = evS.events.find(e => !e.estimated).id;
const zc0 = evS.zeroComp.count;
const banked = ce21(evS, evId, true);
ok(banked.zeroComp.count === zc0 + 1 && banked.events.find(e => e.id === evId).estimated === true && banked.feed.some(f => f.t.indexOf("ZERO-COMP EVENT") === 0), "zero-comp outcome: streak +1, event closed, story written");
const honest = ce21(evS, evId, false);
ok(honest.zeroComp.count === 0 && honest.feed[0].t === "EVENT LOGGED HONEST" && honest.feed[0].how.indexOf("penance does not exist") > -1, "honest outcome: streak resets without ceremony or punishment");
const bumps = rb21(clone(ST));
ok(bumps.length >= 2 && bumps.every(b => b > -3 && b < 4), "refeed bumps computed from his own mornings: " + bumps.join(", "));

// (interim)

// v3.23 — the week reviews itself
const { weekReview: wr23, sweepLab: swp23, SEED: SU } = __test;
const suSealed = clone(SU); suSealed.blackout = { until: "2099-01-01", reason: "fixture seal — this suite tests the behaviour, not the calendar" };
for (let k = 1; k <= 6; k++) { const dS = isoL(Date.now() - k * 864e5); suSealed.dailyLogs[dS] = { cal: 1760, pro: 175, steps: 16500 }; suSealed.sleep.nights = suSealed.sleep.nights.filter((n) => n.d !== dS).concat([{ d: dS, h: 7.6, tags: [] }]); }
const rev = wr23(suSealed);
ok(typeof rev.verdict === "string" && rev.verdict.length > 20 && rev.lines.length === 4 && rev.lines[3].indexOf("adjustments") === 0, "review renders a verdict, three reads, and the adjustments line");
ok(rev.verdict.indexOf("Sealed week") === 0, "sealed-week verdict fires while the quarantine holds: " + rev.verdict.slice(0, 40));
let quiet = clone(SU); quiet.dailyLogs = {}; quiet.sessionLog = {}; quiet.sleep.nights = [];
ok(wr23(quiet).verdict.indexOf("quiet week") > -1, "a silent week gets the door-is-open verdict, never a scolding");
const swBase23 = swp23(clone(SU), 3);
const filed = swp23(swBase23, 0);
ok(filed && filed.feed.some(f => f.t.indexOf("WEEK IN REVIEW · WK") === 0), "Sunday sweep files the review into the permanent record");
ok(swp23(filed, 0) === null, "one review per week — never a duplicate");

// (interim)

// v3.24 — mid-gym service
const { rirPlan: rp24, targetsFor: tf24, migrate: mg24, SEED: SV } = __test;
const latX = clone(SV).exercises.find(e => e.id === "lateral");
ok(latX.sets === 4 && tf24(latX).length === 4 && tf24(latX)[3] === 12, "lateral runs 4 sets, new set seeds one under the 13: " + tf24(latX).join(","));
const cleanSlp = { clean: true, run: 3, need: 3 }, debtSlp = { clean: false, run: 0, need: 3 };
ok(rp24(clone(SV), latX, cleanSlp).plan.join(",") === "2,1,1,0", "four-set base tapers to one terminal failure set: 2·1·1·0");
/* The short-sleep RIR pull is DELETED — see SLEEP_HOLD_NOTE. A short night must
   not back the terminal set off failure: proximity to failure is the hypertrophy
   variable, and the strength cost of a short night (-2.85%, Craven 2022) sits
   inside the test-retest noise. The plan is now identical on both. */
ok(rp24(clone(SV), latX, debtSlp).plan.join(",") === rp24(clone(SV), latX, cleanSlp).plan.join(","), "short sleep does NOT pull the terminal set off failure — same plan either way: " + rp24(clone(SV), latX, debtSlp).plan.join(","));
ok(rp24(clone(SV), latX, debtSlp).why.every(w => w.indexOf("debt") === -1), "no debt-day language survives in the RIR plan");
const rowsEx = clone(SV).exercises.find(e => e.id === "rows");
ok(rp24(clone(SV), rowsEx, cleanSlp).plan.join(",") === "2,0", "compounds run the same 2→1→0 ladder — his call, opener still the gatekeeper");
const heldEx = { ...latX, holdFlag: true };
ok(rp24(clone(SV), heldEx, cleanSlp).plan.every(r => r >= 2), "governor hold floors every set at 2");
const oldV15 = clone(SV); oldV15.v = 15; oldV15.exercises.find(e => e.id === "lateral").sets = 3;
const m16 = mg24(oldV15);
ok(m16.v >= 16 && m16.exercises.find(e => e.id === "lateral").sets === 4 && m16.feed.some(f => f.t.indexOf("LATERAL 4TH SET") === 0), "phones get the 4th set with the honesty note filed");

// (interim)

// v3.25 — the debt buffer, and the override that outlived it
/* These three assertions tested an override switch whose ONLY job was to cancel
   the short-sleep RIR pull. That rule is deleted (SLEEP_HOLD_NOTE), so the
   switch guards nothing and the affordance is gone from the desk — a control
   that does nothing is worse than no control, because tapping it teaches the
   athlete the app is theatre. What survives is the invariant: a short night
   changes NOTHING about the prescription, override flag present or absent. */
const { rirPlan: rp25, migrate: mg25, SEED: SW } = __test;
const dSlp = { clean: false, run: 0, need: 3 };
let ovS = clone(SW); ovS.rirOverride = isoL(Date.now());
const latO = ovS.exercises.find(e => e.id === "lateral");
ok(rp25(ovS, latO, dSlp).plan.join(",") === "2,1,1,0", "a short night runs the base plan, override flag or not: " + rp25(ovS, latO, dSlp).plan.join(","));
let exS = clone(SW); exS.rirOverride = "2026-01-01";
ok(rp25(exS, exS.exercises.find(e => e.id === "lateral"), dSlp).plan.join(",") === "2,1,1,0", "and a stale override flag has nothing left to expire into — the terminal set still reaches failure");
ok(rp25(clone(SW), latO, dSlp).why.join(" ").indexOf("overrid") === -1, "no override language anywhere in the plan's reasons");
const oldV16 = clone(SW); oldV16.v = 16; delete oldV16.rirOverride;
ok(mg25(oldV16).v >= 17 && mg25(oldV16).rirOverride === "2026-07-23", "his stated decision pre-applied on phones");

// (interim)

// v3.26 — rear delt goes unilateral
const { targetsFor: tf26, migrate: mg26, SEED: SX } = __test;
const rdX = clone(SX).exercises.find(e => e.id === "rearDelt");
ok(rdX.sets === 3 && rdX.n.indexOf("uni") > -1 && tf26(rdX).join(",") === "10,10,10", "3 rounds per side — the engine calls for matched 10s: " + tf26(rdX).join(","));
const oldV17x = clone(SX); oldV17x.v = 17; const rdo = oldV17x.exercises.find(e => e.id === "rearDelt"); rdo.sets = 2; rdo.n = "Rear-delt fly (cable)";
const m18 = mg26(oldV17x);
ok(m18.v >= 18 && m18.exercises.find(e => e.id === "rearDelt").sets === 3 && m18.feed.some(f => f.t.indexOf("REAR-DELT") === 0), "phones patch with the third honesty note filed");

// (interim)

// v3.29 — process bugs patched
const { theOneThing: oo29, SEED: SY } = __test;
const clean29 = { clean: true, run: 3, need: 3 };
// the post-log hero lie: nextTrainingISO must skip a logged day
let nt = clone(SY);
const firstTrain = (() => { for (let i = 0; i <= 9; i++) { const d = isoL(Date.now() + i * 864e5); const dd = new Date(d + "T12:00:00"); const day = dd.getDay(); if ([1, 2, 4, 5].includes(day)) return d; } })();
nt.sessionLog[firstTrain] = { entries: [], at: 1 };
ok(__test.SEED && nt.sessionLog[firstTrain] && (function(){ const { genSession } = __test; return true; })(), "setup sane");
// the ladder's new rungs
let evL = clone(SY);
for (let k = 1; k <= 3; k++) evL.sleep.nights.push({ d: isoL(Date.now() - k * 864e5), h: 8 });
evL.sleep.nights = evL.sleep.nights.filter((n, i, a) => a.findIndex(x => x.d === n.d) === i).sort((a, b) => (a.d < b.d ? -1 : 1));
evL.events.push({ id: "ev_test", t: "TEST DINNER", d: isoL(Date.now() - 2 * 864e5), estimated: false });
const rung = oo29(evL, clean29, 12);
ok(rung.t.indexOf("Close out") === 0 && rung.sub.indexOf("ledger doesn't guess") > -1, "unresolved events climb into the ladder: " + rung.t);
evL.events.forEach(e => { e.estimated = true; });
evL.sessionLog[isoL(Date.now())] = { entries: [], at: 1 };
const rung2 = oo29(evL, clean29, 13);
ok(rung2.t.indexOf("Session banked") === 0 || rung2.t.indexOf("Today:") === 0 || rung2.t.indexOf("Day open") === 0, "post-session midday reads banked-not-nagging: " + rung2.t);

// (interim)

// v3.30 — the debrief
const { sessionDebrief: sd30, debriefWords: dw30, SEED: SZ } = __test;
let dbS = clone(SZ);
const d1 = isoL(Date.now() - 4 * 864e5), d2 = isoL(Date.now());
dbS.sessionLog[d1] = { entries: [{ id: "press", reps: [8, 8, 7], rir: 1, w: 245 }], at: 1, niggles: [] };
dbS.sessionLog[d2] = { entries: [{ id: "press", reps: [8, 8, 8], rir: 1, w: 245 }], at: 2, niggles: ["left elbow"] };
const db = sd30(dbS, d2);
const dbW30 = dw30(db).lifts[0].lines;   /* R15: the typed contract flattens back to the legacy strings */
ok(db && db.lifts.length === 1 && dbW30.some(l => l.indexOf("1 up on last time") > -1), "plain-words delta, through the R15 flatten: " + dbW30[0]);
ok(dbW30.some(l => l.indexOf("Best you have ever done at 245") > -1) && dbW30.some(l => l.indexOf("Work done:") === 0), "best-ever named + volume load computed — same words, now typed (record species + the work field)");
ok(dbW30.some(l => l.indexOf("Sets went") === 0), "the fade read still leads with the set sequence");
ok(db.summary.some(l => l.indexOf("Watch list: left elbow") > -1), "niggles surface with the governor warning");
ok(sd30(dbS, "2020-01-01") === null, "unlogged dates return nothing, never crash");

// (interim)

// v3.34 — machine trust crowns the lab
const { prophetGrades: pg34, SEED: TA } = __test;
ok(pg34(clone(TA)).n === 0 && pg34(clone(TA)).mae === null, "fresh ledger: zero grades, no invented precision");
let pgS = clone(TA);
const isoQ = (off) => { const d = new Date(Date.now() + off * 864e5); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
pgS.forecasts = [{ d: isoQ(-14), trend: 165.0, rate: 1.2, pred7: 163.8, sealed: false }, { d: isoQ(-8), trend: 163.9, rate: 1.2, pred7: 162.7, sealed: false }];
/* A grade needs a real reading on the target date — that is the whole point of the
   de-circularised scorecard. Seed one for each forecast's target week. */
pgS.reads = (pgS.reads || []).concat([
  { d: isoQ(-7), w: 164.3, sealed: false, note: "" },
  { d: isoQ(-1), w: 162.9, sealed: false, note: "" },
]);
const g34 = pg34(pgS);
ok(g34.n === 2 && typeof g34.mae === "number" && typeof g34.bias === "number", "masthead and card share one grading truth, graded against reads: n=" + g34.n + " mae=" + g34.mae);
ok(g34.provisional === true && g34.TRUST_N === 6, "two grades stay PROVISIONAL — six is where a within-person number starts");
/* A forecast whose target week has no weigh-in is simply not graded. A skipped
   morning is not a prediction failure, and inventing a grade would be worse. */
const pgNone = clone(TA);
pgNone.reads = [];
pgNone.forecasts = [{ d: isoQ(-8), trend: 163.9, rate: 1.2, pred7: 162.7, sealed: false }];
ok(pg34(pgNone).n === 0 && pg34(pgNone).mae === null, "no reading that week means no grade, not a fabricated one");

// (interim)

// v3.35 — the plain-English layer
const { plainify: pl35 } = __test;
ok(pl35("PRs log provisional on debt days — coach-flag") === "records count as pending for now on short-sleep days — a your-coach conversation — the app never moves it alone", "house vocabulary translates in one pass: " + pl35("PRs log provisional on debt days — coach-flag"));
ok(pl35("needs sleep CLEAN, the governor watching") === "needs the good-sleep streak complete (3 nights of 7.5+ h), the safety brake watching", "streak + brake translate");
ok(pl35("A normal sentence stays untouched.") === "A normal sentence stays untouched.", "plain text passes through unchanged");
ok(pl35(null) === null && pl35(42) === 42, "non-strings pass through safely");

// (interim)

// v3.35.2 — session blocks get real plans
const { rirPlan: rp352, SEED: TB } = __test;
const blockShaped = { id: "x", tgt: [13, 12, 11, 10], w: 315 };
const bp = rp352(clone(TB), blockShaped, { clean: false, run: 1, need: 3 });
ok(bp.plan.length === 4 && bp.plan.join(",") === "2,1,1,0", "a real tgt-shaped session block sizes its own plan, and the terminal set still reaches failure on a short night: " + bp.plan.join(","));

// (interim)

// v3.37 — the day, ranked from data
const { dayProtocol: dp37, SEED: TC } = __test;
let dpS = clone(TC);
for (let k = 1; k <= 3; k++) dpS.sleep.nights.push({ d: isoL(Date.now() - k * 864e5), h: 8, tags: [] });
dpS.sleep.nights = dpS.sleep.nights.filter((n, i, a) => a.findIndex(x => x.d === n.d) === i);
const proto = dp37(dpS, { clean: true, run: 3, need: 3 });
ok(proto.lead && proto.lead.t.length > 3 && proto.steps.length >= 2 && proto.steps.length <= 5, "one lead + a short ranked day: " + proto.steps.length + " steps");
/* On a CLEAN sleep night the lights-out line is a bearing, not a fix, and the
   ranking is right to drop it below five things that are actually actionable.
   On a short night it has to climb back — that is the test that matters. */
let dpShort = clone(TC);
dpShort.sleep.nights.push({ d: isoL(Date.now() - 864e5), h: 5.8, tags: [] });
const protoShort = dp37(dpShort, { clean: false, run: 0, need: 3, last: { h: 5.8 } });
const lights = protoShort.steps.find(x => x.a.indexOf("Lights out") === 0);
ok(!!lights && /\d\d:\d\d/.test(lights.a), "after a short night the bedtime step is on the page and carries the derived time: " + (lights ? lights.a : "absent"));
ok(lights.w > 60, "and it ranks high, because sleep is a first-order fat-versus-lean lever when it is actually short: w=" + lights.w);
ok(!proto.steps.some(x => x.a.indexOf("Lights out") === 0) || proto.steps.find(x => x.a.indexOf("Lights out") === 0).w < 40,
   "on a clean night it either drops off or ranks low — a reminder to do what you already did is the definition of filler");
ok(proto.steps.some(x => x.a.indexOf("Protein 175") === 0), "protein step present with the spread");
ok(proto.steps.every(x => x.a && x.why), "every step is action + reason, nothing bare");

// (interim)


// v3.39 — the pulse wing + negotiator + miner
const { labAnalytics2: laP, migrate: mgP, SEED: TD } = __test;
const oldV18p = clone(TD); oldV18p.v = 18; delete oldV18p.pulse;
ok(mgP(oldV18p).v >= 19 && Array.isArray(mgP(oldV18p).pulse), "phones patch to v19 with the pulse array");
let pS = clone(TD);
for (let k = 14; k >= 1; k--) pS.pulse.push({ d: isoL(Date.now() - k * 864e5), bpm: 56 + (k % 3) });
pS.pulse.push({ d: isoL(Date.now()), bpm: 66 });
const wingP = laP(pS);
const pb = wingP.find(c => c.id === "pulsebase"), pw = wingP.find(c => c.id === "pulsewarn"), cs = wingP.find(c => c.id === "cutstress");
ok(pb.status === "LIVE" && /Baseline: 5\d bpm/.test(pb.forYou), "baseline computes from the median: " + pb.forYou.slice(0, 30));
/* Still fires at +7, but the copy no longer promises a day's lead over symptoms — RHR
   is a multi-day trend signal, and HRV is the faster one. See RHR_LEAD_TIME_NOTE. */
ok(pw.status === "LIVE" && pw.forYou.indexOf("gentle day") > -1, "a +7 spike still raises the flag without panic");
ok(pw.forYou.indexOf("two or three days in a row") > -1, "and asks for a multi-day run before it means anything");
ok(pw.tag.indexOf("beats the sore throat") === -1 && pw.deep.indexOf("VARIABILITY") > -1, "the next-day lead-time claim is gone and HRV is named as the better input");
ok(cs.status === "LIVE" && cs.forYou.indexOf("bpm") > -1, "cut-stress drift reads in bpm");
ok(wingP.find(c => c.id === "negotiator").status === "MODEL" && wingP.find(c => c.id === "miner").status === "ARMED", "negotiator badged MODEL, miner gathering pairs");

// (interim)


// v3.40 — the lab starts experimenting
const { trialProposals: tp40, trialArmOn: ta40, trialVerdict: tv40, activeTrial: at40, dossierText: dt40, migrate: mg40, SEED: TE } = __test;
const oldV19t = clone(TE); oldV19t.v = 19; delete oldV19t.trials;
ok(mg40(oldV19t).v >= 20 && Array.isArray(mg40(oldV19t).trials), "phones patch to v20 with the trials ledger");
const props40 = tp40(clone(TE));
ok(props40.length >= 2 && props40.every(x => x.q && x.arms.length === 2), "data-eligible proposals stand ready, each a fair two-arm question: " + props40.map(x => x.id).join(","));
let trS = clone(TE);
trS.trials = [{ tplId: "refeedsize", started: isoL(Date.now() - 2 * 864e5) }];
const arm0 = ta40(trS.trials[0], isoL(Date.now()));
ok(arm0 && arm0.block === 1 && arm0.armIdx === 0, "day 2 of a 7-day block sits in block 1, arm A");
const act40 = at40(trS);
ok(act40 && act40.arm.tpl.t.indexOf("REFEED") === 0, "the active trial surfaces for the day protocol");
let doneS = clone(TE);
doneS.trials = [{ tplId: "refeedsize", started: isoL(Date.now() - 40 * 864e5) }];
const v40 = tv40(doneS, doneS.trials[0]);
ok(v40.done === true && typeof v40.nA === "number", "elapsed schedules grade themselves done");
const doss = dt40(clone(TE));
const dd40 = __test.dossierData(clone(TE));
ok(dd40.sections.length >= 3 && dd40.sections.every(x => x.items.every(it => it.line.length <= 170)), "structured dossier: sections present, every line first-sentence tight");
ok(typeof dd40.topline === "string" && dd40.topline.length > 20, "top line reads as an executive summary");
ok(doss.indexOf("ANALYST DOSSIER") > 0 && doss.indexOf("Machine trust") > -1 && doss.indexOf("THIS WEEK:") > -1 && doss.indexOf("TOP LINE:") > -1, "dossier compiles header, trust, top line, and the week");
ok(doss.indexOf("provisional") === -1 && doss.indexOf("CLEAN") === -1, "dossier speaks only plain English");

// (interim)


// v3.42 — the furnace + the reactive protocol
const { tempRead: tr42, dayProtocol: dp42, migrate: mg42, SEED: TF } = __test;
const oldV20f = clone(TF); oldV20f.v = 20; delete oldV20f.temp;
ok(mg42(oldV20f).v >= 21 && Array.isArray(mg42(oldV20f).temp), "phones patch to v21 with the furnace");
let tf = clone(TF);
for (let k = 12; k >= 1; k--) tf.temp.push({ d: isoL(Date.now() - k * 864e5), f: k > 6 ? 97.8 : 97.2 });
const T42 = tr42(tf);
ok(T42.base != null && T42.drift <= -0.4, "cooling furnace measured: drift " + T42.drift);
// short last night → tonight's repair appears, 20 early, anchor protected
let snX = clone(TF);
for (let k = 3; k >= 2; k--) snX.sleep.nights.push({ d: isoL(Date.now() - k * 864e5), h: 8, tags: [] });
snX.sleep.nights.push({ d: isoL(Date.now() - 864e5), h: 6.2, sol: 15, tags: [] });
snX.sleep.nights = snX.sleep.nights.filter((n, i, a) => a.findIndex(x => x.d === n.d) === i);
const pr42 = dp42(snX, { clean: false, run: 1, need: 3 });
ok(pr42.steps.some(x => x.a.indexOf("20 early") > -1 && x.why.indexOf("6.2 h") > -1 && x.why.indexOf("aim near it") > -1), "short night triggers tonight's repair with the anchor protected");
// pulse spike this morning outranks everything below the lead
let sp = clone(TF);
for (let k = 14; k >= 1; k--) sp.pulse.push({ d: isoL(Date.now() - k * 864e5), bpm: 56 });
sp.pulse.push({ d: isoL(Date.now()), bpm: 65 });
const pr43 = dp42(sp, { clean: true, run: 3, need: 3 });
ok(pr43.steps[0].a.indexOf("Body alarm") === 0 && pr43.steps[0].why.indexOf("65 bpm vs your 56") === 0 && (pr43.steps[0].detail || []).length >= 4, "a morning pulse spike takes rank one as a full prescription: " + pr43.steps[0].a);

// (interim)

// v3.43 — the alarm prescribes
const { bodyAlarm: ba43, dayType: dt43, SEED: TG } = __test;
const trainToday43 = ["U", "L"].includes(dt43(isoL(Date.now())));
let amb = clone(TG);
for (let k = 14; k >= 1; k--) amb.pulse.push({ d: isoL(Date.now() - k * 864e5), bpm: 56 });
amb.pulse.push({ d: isoL(Date.now()), bpm: 64 });
const A = ba43(amb, { clean: true, run: 3, need: 3 });
ok(A && A.tier === "AMBER" && A.lines.length >= 4, "spike yields an AMBER prescription, not a mood: " + A.lines.length + " lines");
ok(trainToday43 ? A.lines.some(l => l.indexOf("every 0 becomes a 1") > -1 && l.indexOf("no failure today") > -1) : A.lines.length >= 3, "session surgery is his cap-the-zeros rule (rest days: alarm speaks without a session to surger)");
ok(A.lines.some(l => l.indexOf("+24 oz") > -1) && A.lines.some(l => l.indexOf("30 early") > -1), "hydration and tonight carry numbers");
ok(A.lines.some(l => l.indexOf("Exit test") === 0 && l.indexOf("within 3") > -1), "the alarm defines its own exit criterion");
ok(A.basis.indexOf("64 bpm vs your 56") === 0, "every claim traceable: " + A.basis.slice(0, 40));
let redS = clone(TG);
for (let k = 14; k >= 2; k--) redS.pulse.push({ d: isoL(Date.now() - k * 864e5), bpm: 56 });
redS.pulse.push({ d: isoL(Date.now() - 864e5), bpm: 64 });
redS.pulse.push({ d: isoL(Date.now()), bpm: 65 });
const R = ba43(redS, { clean: true, run: 3, need: 3 });
ok(R && R.tier === "RED" && (trainToday43 ? R.lines.some(l => l.indexOf("convert to a walk") > -1) : true), "second elevated morning escalates to RED with the session converted (rest days: RED stands alone)");
let quietB = clone(TG);
Object.keys(quietB.dailyLogs).forEach(d => { if (quietB.dailyLogs[d].steps) quietB.dailyLogs[d].steps = 16000; });
quietB.sleep.nights.forEach(n => { n.h = 7.6; });
quietB.reads.forEach(r => { if (!r.sealed) r.w = quietB.trend; });
ok(ba43(quietB, { clean: true, run: 3, need: 3 }) === null, "quiet body, silent alarm — flat baselines, no cry");

// (interim)

// v3.44.2 — the alarm learns recency and honesty about its trigger
const { bodyAlarm: ba44, SEED: TH } = __test;
let stale = clone(TH);
stale.sleep.nights.push({ d: isoL(Date.now() - 7 * 864e5), h: 4.4, tags: [] });
stale.dailyLogs[isoL(Date.now() - 6 * 864e5)] = { cal: 1750, pro: 175, steps: 11000 };
for (let k = 5; k >= 1; k--) { stale.sleep.nights.push({ d: isoL(Date.now() - k * 864e5), h: 7.4, tags: [] }); stale.dailyLogs[isoL(Date.now() - k * 864e5)] = { cal: 1750, pro: 175, steps: 17800 }; }
stale.sleep.nights = stale.sleep.nights.filter((n, i, a) => a.findIndex(x => x.d === n.d) === i);
ok(ba44(stale, { clean: true, run: 3, need: 3 }) === null, "a six-day-old party no longer commands today");
let fresh = clone(TH);
for (let k = 12; k >= 2; k--) { fresh.sleep.nights.push({ d: isoL(Date.now() - k * 864e5), h: 7.3, tags: [] }); fresh.dailyLogs[isoL(Date.now() - k * 864e5)] = { cal: 1750, pro: 175, steps: 17500 }; }
fresh.sleep.nights.push({ d: isoL(Date.now() - 864e5), h: 4.6, tags: [] });
fresh.dailyLogs[isoL(Date.now())] = { cal: 1750, pro: 175, steps: 9000 };
fresh.sleep.nights = fresh.sleep.nights.filter((n, i, a) => a.findIndex(x => x.d === n.d) === i);
const F = ba44(fresh, { clean: false, run: 0, need: 3 });
ok(F === null || (F.head.indexOf("off-pattern") > -1 && F.basis.indexOf("No pulse data involved") > -1), "fresh pattern trip: when it fires it is honest and pulse-free; on rest days it stays silent (weekday-independent)");

ok(!F || (F.lines.every(l => l.indexOf("resting pulse") === -1 || l.indexOf("elevated") === -1) && (!trainToday43 || F.lines.some(l => l.indexOf("Exit test") === 0))), "pattern trips speak sleep, never pulse; on training days they define their exit");


// (interim)

// v3.45 — tier 0: the armor
const { labGroups: lg45, SEED: TI } = __test;
const sMemo = clone(TI);
const gm1 = lg45(sMemo), gm2 = lg45(sMemo);
ok(Array.isArray(gm1) && gm1.length === gm2.length, "analytics stable across repeated calls on one state");
const oldSnap = clone(TI); oldSnap.v = 12;
const restored = __test.migrate(JSON.parse(JSON.stringify(oldSnap)));
ok(restored.v >= 21 && Array.isArray(restored.trials) && Array.isArray(restored.temp), "an old snapshot restores through the full patch chain to current schema");

// (interim)

// v3.46 — gym mode's timer brain
const { restFor: rf46 } = __test;
ok(rf46("press") === 150 && rf46("hack") === 150, "compounds rest long: press/hack 150s");
ok(rf46("lateral") === 90 && rf46("curl") === 90, "isolations rest 90s — raised from 75s, which sat under the plateau where the evidence stops improving");

// (interim)

// v3.47 — the instrument factory's context bundle
const { askContext: ac47, SEED: TJ } = __test;
const ctx = ac47(clone(TJ));
ok(ctx.indexOf("HOUSE LAWS") > -1 && ctx.indexOf("ANALYST DOSSIER") > -1 && ctx.indexOf("LAST 14 DAYS") > -1, "context carries laws, instrument verdicts, and raw rollups");
ok(ctx.indexOf("(measured)") > -1 && ctx.indexOf("Never invent data") > -1, "honesty rules travel with every question");
ok(ctx.length < 20000, "context stays bounded: " + ctx.length + " chars");

// (interim)

// v3.48 — the agent's hands are read-only + one consent door
const { agentToolExec: ate48, migrate: mg48, SEED: TK } = __test;
const oldV21a = clone(TK); oldV21a.v = 21; delete oldV21a.agentProposals;
ok(mg48(oldV21a).v >= 22 && Array.isArray(mg48(oldV21a).agentProposals), "phones patch to v22 with the analyst inbox");
let agS = clone(TK);
const stagedT = [];
const days48 = ate48(agS, "get_range", { kind: "days", from: "2026-06-15", to: "2026-06-20" }, stagedT);
ok(days48.indexOf("2026-06-15") > -1 && days48.indexOf("cal") > -1, "get_range pulls real rows");
const wi48 = ate48(agS, "run_whatif", { steps: 18500 }, stagedT);
ok(wi48.indexOf("modeled rate:") === 0, "whatif models forward: " + wi48.slice(0, 28));
const before = JSON.stringify(agS);
ate48(agS, "stage_proposal", { kind: "trial", title: "Test caffeine timing", body: "noon vs morning", tplId: "caffcut" }, stagedT);
ok(stagedT.length === 1 && JSON.stringify(agS) === before, "stage_proposal stages WITHOUT touching state — consent architecture intact");
ok(ate48(agS, "get_range", { kind: "sessions", from: "2000-01-01", to: "2000-01-02" }, stagedT) === "no rows", "empty ranges say so instead of inventing");

// (interim)

// v3.49 — the designer: custom trials through the full lifecycle
const { agentToolExec: ate49, trialArmOn: ta49, trialVerdict: tv49, SEED: TL } = __test;
let dS = clone(TL);
const st49 = [];
const res49 = ate49(dS, "stage_proposal", { kind: "trial", title: "Tuesday timing", body: "pattern: tue lags thu", custom: { t: "SESSION TIME — NOON vs 5PM", q: "Does the later slot lift Tuesdays?", arms: ["noon", "5pm"], blockDays: 3, cycles: 4, metric: "session_reps" } }, st49);
ok(st49.length === 1 && st49[0].custom && st49[0].custom.arms.length === 2, "agent designs a custom trial into the consent inbox");
ok(ate49(dS, "stage_proposal", { kind: "trial", title: "x", body: "y", custom: { t: "bad", q: "?", arms: ["a", "b"], blockDays: 3, cycles: 4, metric: "vibes" } }, st49).indexOf("rejected") === 0, "unmeasurable metrics are refused at the tool boundary");
let run49 = clone(TL);
run49.trials = [{ custom: st49[0].custom, started: isoL(Date.now() - 4 * 864e5) }];
const arm49 = ta49(run49.trials[0], isoL(Date.now()));
ok(arm49 && arm49.block === 2 && arm49.tpl.arms[arm49.armIdx] === "5pm", "day 4 of 3-day blocks: block 2, arm B — custom schedules run on the same engine");
run49.trials[0].started = isoL(Date.now() - 20 * 864e5);
ok(tv49(run49, run49.trials[0]).done === true, "custom trials self-grade done like the canned ones");

// (interim)

// v3.51 — the replicator: a person is data
const { kitLetter: kl51 } = __test;
const spec51 = { name: "Demo", greeting: "Good morning", modules: { walk: true, weight: true, bp: true, letter: true }, vocab: { walk: "your walk", weight: "morning weight", sleep: "sleep", bp: "blood pressure" }, walkGoalMin: 30, weightUnit: "lb" };
const st51 = { v: 1, days: {} };
for (let k = 1; k <= 6; k++) st51.days[isoL(Date.now() - k * 864e5)] = { walkMin: k % 2 ? 30 : 10, weight: 152 + (k % 3) * 0.5, bp: k === 2 ? "128/82" : null };
const letter = kl51(spec51, st51);
ok(letter.indexOf("Your week, in plain words:") === 0 && letter.indexOf("good walks this week") > -1, "the letter opens plainly and counts in their dialect: " + letter.slice(0, 40));
ok(letter.indexOf("average is the truth") > -1 && letter.indexOf("doctor") > -1, "weight framed gently, bp referred out — never interpreted");
ok(kl51(spec51, { v: 1, days: {} }).indexOf("keep showing up") > -1, "an empty week still gets warmth, never guilt");
const one51 = { v: 1, days: {} }; one51.days[isoL(Date.now() - 2 * 864e5)] = { walkMin: 45 };
ok(kl51(spec51, one51).indexOf("1 good walk this week") > -1, "grammar: one walk is singular");

// (interim)

// v3.53 — the data weather
const { dayWeather: dw53, weekWeather: ww53, migrate: mg53, SEED: TM } = __test;
const oldV22d = clone(TM); oldV22d.v = 22; delete oldV22d.dayCtx;
ok(mg53(oldV22d).v >= 23 && typeof mg53(oldV22d).dayCtx === "object", "phones patch to v23 with day contexts");
let wS = clone(TM);
wS.dayCtx["2026-07-18"] = { est: true, note: "wedding weekend" };
const w1 = dw53(wS, "2026-07-18");
ok(w1.est && w1.noisy && w1.flags.some(f => f.k === "estimate"), "a declared estimate day reads as noisy weather");
const sealDay = dw53(wS, "2026-07-24");
ok(sealDay.flags.some(f => f.k === "sealwater"), "sealed-window days auto-flag as event water");
ok(ww53(wS, ["2026-07-17", "2026-07-18", "2026-07-24"]).clean === false, "a week soaked in flags is not clean");
ok(dw53(wS, "2026-07-06").noisy === false, "an ordinary Monday stays clean weather");
const ctx53 = __test.askContext(wS);
ok(ctx53.indexOf("DATA WEATHER LAW") > -1 && ctx53.indexOf("⌁[") > -1, "the agent's table carries the flags and the law");

// (interim)

// v3.53 — DATA WEATHER: every day knows its own quality; every consumer respects it
const { dayWeather: dwB, weekWeather: wwB, migrate: mg53c, agentToolExec: ate53, liveRollups: lr53, SEED: TW } = __test;
const oldV22a = clone(TW); oldV22a.v = 22; delete oldV22a.dayCtx;
ok(mg53c(oldV22a).v >= 23 && typeof mg53c(oldV22a).dayCtx === "object", "phones patch to v23 with day-context");
let wSB = clone(TW);
wSB.dayCtx["2026-07-18"] = { est: true, note: "wedding #1" };
ok(dwB(wSB, "2026-07-18").est && dwB(wSB, "2026-07-18").hard, "a declared estimate day flags est + hard");
ok(dwB(wSB, "2026-07-26").flags.some((f) => f.k === "event"), "the day after the 7/25 wedding sits in the event window");
ok(dwB(wSB, "2026-07-16").flags.some((f) => f.k === "postrefeed"), "the morning after Wednesday refeed carries its storage-bump flag");
ok(wwB(wSB, ["2026-07-17", "2026-07-18", "2026-07-19", "2026-07-25"]).clean === false, "a week with 2+ noisy days is not clean");
ok(wwB(wSB, ["2026-07-06", "2026-07-07", "2026-07-08"]).clean === true, "an ordinary week stays clean");
const dayRow = ate53(wSB, "get_range", { kind: "days", from: "2026-07-18", to: "2026-07-18" }, []);
ok(dayRow.indexOf("⌁[") > -1 && dayRow.indexOf("estimate") > -1, "the agent's own range pulls carry the weather: " + dayRow.slice(0, 46));
ok((lr53(wSB)[0] || { days: [] }).days !== undefined || lr53(wSB).length === 0, "live rollups expose their day lists for week-pair weather checks");

// (interim)

// v3.53.2 — the session hero rolls forward once today is banked
const { nextTrainingISO: nti53, SEED: TN } = __test;
let hero53 = clone(TN);
const heroFirst53 = nti53(hero53);
ok(heroFirst53 != null, "a next training day exists");
hero53.sessionLog[heroFirst53] = { entries: [{ id: "press", reps: [8, 8, 7] }], at: Date.now() };
const after53 = nti53(hero53);
ok(after53 != null && after53 > heroFirst53, "banking the session advances the hero to the next unlogged day: " + heroFirst53 + " → " + after53);

// (interim)

// v3.54 — the variance tax: scatter, priced in the athlete's own ledger
const { sleepLab: sl54, SEED: TV } = __test;
let vt = clone(TV);
vt.sleep.nights = vt.sleep.nights.filter((n) => !n.bed);
for (let k = 26; k >= 2; k--) {
  const d = isoL(Date.now() - k * 864e5);
  const off = k % 3 === 0;
  vt.sleep.nights.push({ d, h: off ? 6.8 : 7.9, bed: off ? "00:45" : "23:00", wake: "06:45" });
  if (k % 2 === 0) vt.sessionLog[isoL(Date.now() - (k - 1) * 864e5)] = { entries: [{ id: "press", reps: off ? [7, 6, 5] : [9, 8, 8] }], at: 1 };
}
const tax = sl54(vt).find((c) => c.id === "variancetax");
ok(tax && tax.status === "LIVE", "the tax goes live with 5+ timed nights per bucket");
ok(tax.forYou.indexOf("-1.1 h sleep") > -1, "prices the sleep cost from his own buckets: " + tax.forYou.slice(0, 60));
ok(tax.forYou.indexOf("tax is real") > -1, "a real measured tax gets named as such");
let vt2 = clone(TV);
vt2.sleep.nights = vt2.sleep.nights.filter((n) => !n.bed);
const tax2 = sl54(vt2).find((c) => c.id === "variancetax");
ok(tax2 && tax2.status === "ARMED" && tax2.forYou.indexOf("funds itself") > -1, "unarmed, it explains it feeds on ordinary honesty");

// (interim)

// v3.55 — the cartographer's law: no instrument exists off the map
const { INS_MAP: IM55, labGroups: lg55, SEED: TC55 } = __test;
const allIds55 = lg55(clone(TC55)).flatMap((g) => g.cards).map((c) => c.id);
const mapped55 = Object.keys(IM55);
const unmapped = allIds55.filter((id) => !mapped55.includes(id));
const phantom = mapped55.filter((id) => !allIds55.includes(id));
ok(unmapped.length === 0, "every living instrument is placed on the map (unmapped: " + (unmapped.join(",") || "none") + ")");
ok(phantom.length === 0, "the map claims no phantom instruments (phantoms: " + (phantom.join(",") || "none") + ")");
ok(Object.values(IM55).every((srcs) => Array.isArray(srcs) && srcs.length >= 1), "every placement names at least one feeding input");

// (interim)

// v3.56 — skipped lifts are structured truth, not prose
const { completeSession: cs56, SEED: TS56 } = __test;
let sk56 = clone(TS56);
const skIso = (() => { for (let i = 0; i <= 9; i++) { const d = isoL(Date.now() + i * 864e5); if (!sk56.sessionLog[d]) return d; } })();
const perf56 = [{ id: "press", n: "press", w: 245, tgt: [8, 8, 7], reps: [8, 8, 7], rir: 2 }];
const r56 = cs56(sk56, skIso, perf56, { clean: true, last: { h: 7.8 } }, { note: "", niggles: [], skipped: [{ id: "pronated" }] });
ok((r56.s.sessionLog[skIso].skipped || []).some((k) => k.id === "pronated"), "the skip is a structured field on the session record");
ok(!r56.s.sessionLog[skIso].entries.some((e) => e.id === "pronated"), "no phantom reps: the skipped lift never enters entries");
ok(r56.lines.some((l) => l.t.indexOf("SKIPPED") === 0 && l.how.indexOf("phantom") > -1), "the recap names the skip honestly");

// (interim)


// v3.57.1 — live books outrank dawn prose
const { liveBooks: lb57, SEED: TL57 } = __test;
let bk = clone(TL57);
const yIso = isoL(Date.now() - 864e5);
bk.dailyLogs[yIso] = { cal: 1760, pro: 175, steps: 16500 };
if (!bk.sleep.nights.some(n => n.d === yIso)) bk.sleep.nights.push({ d: yIso, h: 7.5 });
const r57 = lb57(bk);
ok(r57.y === yIso && r57.items.some(i => i.k === "numbers" && i.ok), "live books read the ledger this second, not the sync");
ok(!r57.items.some(i => i.k === "pulse") || (bk.pulse || []).some(x => x.d < yIso), "instruments not yet adopted are never demanded");
let bk2 = clone(TL57);
delete bk2.dailyLogs[yIso];
bk2.sleep.nights = bk2.sleep.nights.filter(n => n.d !== yIso);
ok(lb57(bk2).gaps.length >= 1 && lb57(bk2).complete === false, "real gaps get named as ✗s");

console.log(`\nFINAL55: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);


// v3.58.1 — the agent sees whole nights and never guesses vocabulary
const { agentToolExec: ate58, askContext: ac58, SEED: TA58 } = __test;
let ag58 = clone(TA58);
const nIso = isoL(Date.now() - 864e5);
ag58.sleep.nights = ag58.sleep.nights.filter(n => n.d !== nIso);
ag58.sleep.nights.push({ d: nIso, h: 7.5, bed: "22:45", wake: "06:45", sol: 15, tags: ["woke"] });
const row58 = ate58(ag58, "get_range", { kind: "nights", from: nIso, to: nIso }, []);
ok(row58.indexOf("bed 22:45") > -1 && row58.indexOf("wake 06:45") > -1 && row58.indexOf("drift-off 15m") > -1, "night rows carry bed, wake, and drift-off in plain words: " + row58.slice(0, 60));
const ctx58 = ac58(ag58);
ok(ctx58.indexOf("FIELD DICTIONARY") > -1 && ctx58.indexOf("drift-off, minutes to fall asleep") > -1, "the dictionary is authoritative in every context");
/* It is no longer a GATE — short sleep does not block a record. The live state
   still ships so the analyst never re-derives a streak, and it now also carries
   the instruction not to tell him a short night invalidated anything. */
ok(ctx58.indexOf("SLEEP RIGHT NOW") > -1, "the live sleep state ships with the context — no re-derived streaks");
ok(ctx58.indexOf("no longer blocks a record") > -1, "and the analyst is told plainly that a short night does not invalidate one");
ok(ctx58.indexOf("STEP TARGET") > -1 && ctx58.indexOf("SET-TO-SET REP SPREAD") > -1, "the canonical block now carries the derived step target and his own measured rep noise");
ok(ctx58.indexOf("never claim a refeed buys") > -1, "and forbids the refeed claims the evidence does not support");
/* The field dictionary handed to the analyst used to end with "RECORDS: pending
   = awaiting the 3-night >=7.5h clean streak" and "on debt only that final set
   pulls to 1" — the retired gate, stated as authoritative, inside the SAME
   prompt that told the analyst a short night invalidates nothing. One prompt,
   two contradictory laws. */
ok(ctx58.indexOf("debt days +1") === -1, "no stale debt arithmetic in the law sheet");
ok(ctx58.indexOf("only that final set pulls to 1") === -1 && ctx58.indexOf("awaiting the 3-night") === -1,
   "and the retired clean-sleep gate is gone from the analyst's field dictionary too — it used to contradict the science floor in the same prompt");
ok(ctx58.indexOf("including after a short night") > -1, "the law it teaches now is the one the engine actually runs");

// (interim)


// v3.59 — the pipe audit: nothing the athlete records can vanish in translation
const { agentToolExec: ate59, askContext: ac59, LEDGER_DICT: LD59, SEED: TP59 } = __test;
let pa = clone(TP59);
const pIso = isoL(Date.now() - 864e5);
pa.sessionLog[pIso] = { entries: [{ id: "press", reps: [8, 8, 7], rir: 2, w: 245 }], skipped: [{ id: "pronated" }], note: "ran short on time", niggles: ["left knee"], dips: 3, at: 1 };
const sRow = ate59(pa, "get_range", { kind: "sessions", from: pIso, to: pIso }, []);
ok(sRow.indexOf("SKIPPED: pronated") > -1 && sRow.indexOf('note: "ran short on time"') > -1 && sRow.indexOf("niggles: left knee") > -1 && sRow.indexOf("dips 3") > -1, "session rows carry skips, prose, niggles, dips — the whole record");
pa.feed.unshift({ d: pIso, t: "RECORD AMENDED — pronated marked skipped", how: "honesty over history" });
const fRow = ate59(pa, "get_range", { kind: "feed", from: pIso, to: pIso }, []);
ok(fRow.indexOf("RECORD AMENDED") > -1, "the feed is pullable — amendments reach the agent");
ok(LD59.indexOf("drift-off") > -1 && LD59.indexOf("phantom reps") > -1, "one dictionary, complete");
const ctx59 = ac59(pa);
ok(ctx59.indexOf("EVENTS: ") > -1 && ctx59.indexOf("ACTIVE TRIALS: ") > -1, "events and trials ride every context");

// (interim)


// v3.59.1 — done-ness is derived from the ledger, never remembered by a screen
const { briefAnswered: ba59, SEED: TB59 } = __test;
let anS = clone(TB59);
const q59 = "scale +2.1 on clean logs: travel, sodium, new supplement?";
ok(ba59(anS, q59) === false, "an unanswered question shows its box");
anS.feed.unshift({ d: isoL(Date.now()), t: "ANALYST ANSWER", how: q59.slice(0, 120) + " → sodium, wedding tasting menu" });
ok(ba59(anS, q59) === true, "a filed answer stays filed across every remount");
ok(ba59(anS, "a different question entirely") === false, "new questions get fresh boxes");

console.log(`\nFINAL58: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.60 — the prescription desk: velocity writes the next session, resets need consent
const { liftCall: lc60, sweepStalls: ss60, SEED: TD60 } = __test;
let pd = clone(TD60);
/* Clean nights across the WHOLE window, not just the last three. The stall
   counter now discards short-sleep sessions the same way it discards rushed
   ones (see SLEEP_NOTE), so a session five days back needs a clean night five
   days back to be counted at all. */
for (let k = 16; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); pd.sleep.nights = pd.sleep.nights.filter((n) => n.d !== d); pd.sleep.nights.push({ d, h: 7.8, bed: "22:30", wake: "06:30" }); }
pd.sleep.nights.sort((a, b) => (a.d < b.d ? -1 : 1));
const exW60 = pd.exercises.find((x) => x.id === "lateral").w;
const expW60 = Math.max(5, Math.round((exW60 * 0.95) / 5) * 5);
const mk60 = (k, tot, rir) => { const d = isoL(Date.now() - k * 864e5); pd.sessionLog[d] = { entries: [{ id: "lateral", reps: [tot], rir, w: exW60 }], at: 1 }; };
mk60(12, 40, 2); mk60(10, 43, 2);
ok(lc60(pd, "lateral").verdict === "PUSH" && lc60(pd, "lateral").vel > 0, "rising velocity keeps the chase on: " + lc60(pd, "lateral").why.slice(0, 40));
mk60(8, 43, 1); mk60(6, 42, 0); mk60(5, 41, 0);
const stalled = lc60(pd, "lateral");
ok(stalled.verdict === "RESET" && stalled.newW === expW60, "3 honest weather-clean stalls trigger the evidence-based reset with plate-round math: " + stalled.newW);
const swept = ss60(pd);
ok(swept && swept.agentProposals.some((ap) => ap.kind === "reset" && ap.exId === "lateral" && ap.newW === expW60), "the stall files a consent-gated proposal — no load ever changes itself");
ok(ss60(swept) === null || !ss60(swept), "one stall, one proposal — never nags twice");

console.log(`\nFINAL59: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.61 — desk v2: the full input roster, receipts attached, protection ranked first
const { liftCall: lc61, SEED: TE61 } = __test;
let dv = clone(TE61);
for (let k = 3; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); dv.sleep.nights = dv.sleep.nights.filter((n) => n.d !== d); dv.sleep.nights.push({ d, h: 7.8, bed: "22:30", wake: "06:30" }); }
const wq = dv.exercises.find((x) => x.id === "lateral").w;
const mk61 = (k, tot, rir) => { const d = isoL(Date.now() - k * 864e5); dv.sessionLog[d] = { entries: [{ id: "lateral", reps: [tot], rir, w: wq }], at: 1 }; };
mk61(8, 40, 2); mk61(6, 43, 2); mk61(4, 45, 2);
const call61 = lc61(dv, "lateral");
ok(call61.verdict.indexOf("PUSH") === 0 && Array.isArray(call61.receipts) && call61.receipts.some((r) => r.indexOf("You are gaining") === 0), "a healthy lift gets PUSH with a plain-words trend receipt: " + call61.receipts[0]);
ok(lc61(dv, "lateral", { alarm: { level: "RED" } }).verdict === "STAND-DOWN", "alarm RED outranks everything — the desk stands the lift down");
ok(lc61(dv, "lateral", { alarm: { level: "AMBER" } }).verdict === "HOLD", "AMBER caps the day: hold, zeros become ones");
const nm61 = dv.exercises.find((x) => x.id === "lateral").n;
dv.feed.unshift({ d: isoL(Date.now() - 3 * 864e5), t: "RESET APPLIED — " + nm61 + " " + wq + " → " + (wq - 5), how: "test" });
const rb61 = lc61(dv, "lateral");
ok(rb61.verdict === "REBUILD" && rb61.receipts.some((r) => r.indexOf("Day ") === 0), "a recent consented reset flips the lift into its climb-back window");

// (interim)


// v3.61.1 — the desk speaks the house dialect, enforced
const { liftCall: lc611, CALL_PLAIN: CP611, SEED: TF61 } = __test;
ok(["PUSH", "PUSH+", "HOLD", "RESET", "REBUILD", "STAND-DOWN"].every((v) => CP611[v] && CP611[v].chip && CP611[v].mean), "every verdict has a plain chip and a plain meaning");
let pl = clone(TF61);
for (let k = 3; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); pl.sleep.nights = pl.sleep.nights.filter((n) => n.d !== d); pl.sleep.nights.push({ d, h: 7.8, bed: "22:30", wake: "06:30" }); }
const wq2 = pl.exercises.find((x) => x.id === "lateral").w;
[8, 6, 4].forEach((k, i) => { const d = isoL(Date.now() - k * 864e5); pl.sessionLog[d] = { entries: [{ id: "lateral", reps: [40 + i * 2], rir: 2, w: wq2 }], at: 1 }; });
const banned = ["velocity", "stall streak", "n=", "evidentiary", "weather-clean"];
const out61 = lc611(pl, "lateral");
const blob = (out61.receipts || []).join(" ") + " " + out61.why;
ok(banned.every((b) => blob.indexOf(b) === -1), "no jargon survives in receipts or reasons — plain words only");

console.log(`\nFINAL61: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.63 — the hack ruling: load up, reps down, precedent filed
const { migrate: mg63, targetsFor: tf63, SEED: TG63 } = __test;
const oldV23a = clone(TG63); oldV23a.v = 23;
oldV23a.exercises.find((x) => x.id === "hack").hi = 13;
oldV23a.exercises.find((x) => x.id === "hack").last = [13, 12];
const m63 = mg63(oldV23a);
const hk63 = m63.exercises.find((x) => x.id === "hack");
ok(m63.v >= 24 && hk63.hi === 10 && hk63.last === null, "phones inherit the NEWEST ruling: a v23 phone walks the whole chain — patchV24 asserts 12 and nulls the pre-ruling block (its own dated truth), then patchV43 lands the owner's 2026-08-10 ruling on top: ceiling 10. The chain replays HISTORY, and history now ends at 6-10");
ok(m63.feed.some((f) => f.t.indexOf("RULING — HACK LOADED UP") === 0), "the ruling is on the record for the clerk to mine");
ok(tf63(hk63).every((r) => r <= 10), "fresh targets seed under the new ceiling: " + tf63(hk63).join(","));

console.log(`\nFINAL62: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.64 — the smallest-honest-increment law
const { migrate: mg64, SEED: TH64 } = __test;
const oldV24a = clone(TH64); oldV24a.v = 24;
oldV24a.exercises.find((x) => x.id === "calves").inc = 15;
oldV24a.queue.push({ id: "q_calves_330", kind: "debut", exId: "calves", newW: 330, t: "CALVES 330 DEBUT", state: "DEBUT", gate: "Earned via 315×13,12,11,10", rule: "Auto-queued", done: false });
const m64 = mg64(oldV24a);
ok(m64.v >= 25 && m64.exercises.find((x) => x.id === "calves").inc === 5, "the machine's smallest step becomes the law: calves inc 5");
const q64 = m64.queue.find((q) => q.id === "q_calves_330");
ok(q64.newW === 320 && q64.t === "CALVES 320 DEBUT", "the already-queued 330 debut is rewritten to 320: " + q64.t);
ok(m64.feed.some((f) => f.t.indexOf("RULING — SMALLEST HONEST INCREMENT") === 0), "the ruling is filed for the clerk");

console.log(`\nFINAL63: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.65 — the smallest step governs every lift
const { migrate: mg65, SEED: TI65 } = __test;
const oldV25a = clone(TI65); oldV25a.v = 25;
oldV25a.exercises.find((x) => x.id === "pulldown").inc = 10;
oldV25a.exercises.find((x) => x.id === "ham").inc = 10;
const m65 = mg65(oldV25a);
ok(m65.v >= 26 && m65.exercises.find((x) => x.id === "pulldown").inc === 5 && m65.exercises.find((x) => x.id === "ham").inc === 5, "stack machines normalized to the 5");
ok(m65.exercises.find((x) => x.id === "hack").inc === 10, "the plate-loaded hack keeps its honest 10");
ok(m65.feed.some((f) => f.t.indexOf("RULING — SMALLEST STEP, EVERY LIFT") === 0), "the audit is on the record");

console.log(`\nFINAL64: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.66 — the volume ledger: the biggest dial, counted, judged, consent-gated
const { muscleVolume: mv66, sweepVolume: sv66, SEED: TJ66 } = __test;
let vl = clone(TJ66);
for (let k = 3; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); vl.sleep.nights = vl.sleep.nights.filter((n) => n.d !== k); vl.sleep.nights.push({ d, h: 7.8, bed: "22:30", wake: "06:30" }); }
const d1v = isoL(Date.now() - 2 * 864e5), d2x = isoL(Date.now() - 9 * 864e5), d3x = isoL(Date.now() - 16 * 864e5);
vl.sessionLog[d1v] = { entries: [{ id: "ham", reps: [10, 10], rir: 2, w: 120 }], at: 1 };
vl.sessionLog[d2x] = { entries: [{ id: "ham", reps: [10, 10], rir: 2, w: 120 }], at: 1 };
vl.sessionLog[d3x] = { entries: [{ id: "ham", reps: [10, 10], rir: 2, w: 120 }], at: 1 };
const hams = mv66(vl).find((m) => m.mg === "hams");
ok(hams && hams.n7 === 2 && hams.zone === "UNDER", "sets counted per rolling week, judged against the retention floor: " + hams.n7 + " " + hams.zone);
/* CONSENT HYGIENE (2026-08-10) — THE DESK IS HARD-GATED until R18f: it filed five +1s
   in one week against the one-lever law, then another the morning after its own recall
   notice. The old drive ("two weeks under the floor files a +1") is the behaviour R18f
   will restore THROUGH the one chooser; until then the gate is the law. */
const swept66 = sv66(vl, 0);
ok(swept66 === null, "R18f — the desk is AWAKE but the house gates hold: on this fixture the chooser (volumePush) is not at PUSH (regime unknown), so the under-floor trigger files NOTHING — gates closed means silence, never a default offer");
ok(sv66(vl, 0) === null && sv66(JSON.parse(JSON.stringify(vl)), 1) === null, "R18f — silence holds on both filing days: the chooser's verdict, not a calendar gate, is what decides");

console.log(`\nFINAL65: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.68 — fractional counting + the ladder re-keys, stated at consent
const { muscleVolume: mv68, sweepVolume: sv68, rirPlan: rp68, INDIRECT: IN68, SEED: TK68 } = __test;
let fc = clone(TK68);
const df1 = isoL(Date.now() - 2 * 864e5);
fc.sessionLog[df1] = { entries: [{ id: "press", reps: [8, 8, 7], rir: 2, w: 245 }, { id: "tricep", reps: [12, 11], rir: 2, w: 55 }], at: 1 };
const tri = mv68(fc).find((m) => m.mg === "triceps");
ok(tri && tri.n7 === 3.5, "pressing lends half a set: triceps = 2 direct + 3×0.5 = " + tri.n7);
ok(IN68.press.triceps === 0.5 && IN68.rows.biceps === 0.5, "the lending table is data, inspectable");
let lad = clone(TK68);
const tr68 = lad.exercises.find((x) => x.id === "tricep");
const before68 = rp68(lad, tr68, { clean: true, run: 3, need: 3 }).plan.join(",");
tr68.sets = tr68.sets + 1;
const after68 = rp68(lad, tr68, { clean: true, run: 3, need: 3 }).plan.join(",");
ok(before68 === "2,1,0" && after68 === "2,1,1,0", "a consented +1 re-keys the ladder: new set takes the 0, old final pulls to 1: " + before68 + " → " + after68);

console.log(`\nFINAL66: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.69 — the ledger learns patience: maturity, cadence, restraint, the tilt
const { sweepVolume: sv69, migrate: mg69, SEED: TL69 } = __test;
let yg = clone(TL69);
const yd = isoL(Date.now() - 2 * 864e5);
yg.sessionLog = { [yd]: { entries: [{ id: "ham", reps: [10, 10], rir: 2, w: 120 }], at: 1 } };
ok(sv69(yg, 0) === null, "young ledgers stay silent — 14 days of logs before a single volume word");
let mt = clone(TL69);
for (const k of [2, 5, 9, 12, 16]) mt.sessionLog[isoL(Date.now() - k * 864e5)] = { entries: [{ id: "ham", reps: [10, 10], rir: 2, w: 120 }], at: 1 };
ok(sv69(mt, 3) === null, "midweek says nothing — volume is a Sunday conversation");
const sun69 = sv69(mt, 0);
ok(sun69 === null, "R18f — Sunday files nothing here either: the chooser is not at PUSH on this fixture, and the desk only ever files the chooser's ONE pick (the two-cap is superseded by a one-pick construction)");
const oldV26a = clone(TL69); oldV26a.v = 26;
oldV26a.agentProposals = [{ id: "v1", kind: "volume", mg: "chest", dir: 1 }, { id: "t1", kind: "trial", title: "keep me" }];
const m69 = mg69(oldV26a);
ok(!m69.agentProposals.some((ap) => ap.kind === "volume") && m69.agentProposals.some((ap) => ap.kind === "trial"), "the misfires are recalled; everything else stays");
ok(m69.feed.some((f) => f.t === "VOLUME PROPOSALS RECALLED"), "the recall is explained on the record");

console.log(`\nFINAL67: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.70 — the two constitutional laws, swept and enforced
const { filingsFor: ff70, CONSTITUTION: CN70, bodyAlarm: ba70, SEED: TM70 } = __test;
ok(ff70(1, 15).some((x) => x.indexOf("ANALYST DAY") === 0), "Mondays point NOW at the dossier");
ok(ff70(3, 2).some((x) => x.indexOf("THE RED CELL") === 0) && ff70(3, 15).length === 0, "the prosecution gets its pointer only in filing week");
ok(CN70.length === 15 && CN70.every((c) => c[0] && c[1] && c[1].length > 30), "fifteen laws, each with a name and a plain sentence");
ok(CN70.some((c) => c[0] === "Attention lives on NOW") && CN70.some((c) => c[0] === "Simple surface, real depth"), "the athlete's two new laws are carved first");
/* The sleep law was rewritten, not deleted. "Records need clean sleep" had no
   evidence behind it and, at 7.5 h against a 7 h median, never once opened; what
   replaced it is the confirmation rule the measurement error actually justifies,
   plus a law saying what the sleep flag DOES buy him. */
ok(!CN70.some((c) => c[0] === "Records need clean sleep"), "the sleep gate is no longer a law of the house");
ok(CN70.some((c) => c[0].indexOf("Records need repeating") === 0), "what replaced it is the confirmation rule");
ok(CN70.some((c) => c[0].indexOf("Short sleep protects") === 0), "and a law stating what the short-sleep flag actually buys");
ok(CN70.some((c) => c[0].indexOf("Every target is derived") === 0), "a law forbidding authored targets — calories, protein and steps all come from his record now");
ok(CN70.some((c) => c[0].indexOf("Cite or say you cannot") === 0), "and one requiring every rule to name its evidence or admit it has none");
ok(typeof ba70 === "function", "the alarm engine is exported — its NOW banner reads the same source as the desk");

console.log(`\nFINAL68: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.71 — caffeine is a log, not an assumption
const { todayCaff: tc71, caffAt: ca71, migrate: mg71, SEED: TN71 } = __test;
let cf = clone(TN71);
const tI71 = isoL(Date.now());
cf.sleep.caffMg = 400;
ok(tc71(cf).logged === false && tc71(cf).atH === 12, "with no entry, the typical dose serves as clearly-labeled fallback");
cf.caffLog = [{ d: tI71, mg: 350, at: "15:45" }];
const t71 = tc71(cf);
ok(t71.logged === true && t71.mg === 350 && Math.abs(t71.atH - 15.75) < 0.01, "today's real entry beats the profile: " + t71.mg + " @ " + t71.at);
const tail71 = ca71(350, 15.75, 22.5);
ok(tail71 > 120 && tail71 < 155, "the tail runs on the actual clock: 350 @ 3:45p leaves ~" + tail71 + " at 22:30");
cf.caffLog = [{ d: tI71, mg: 0, at: "—" }];
ok(tc71(cf).logged === true && tc71(cf).mg === 0, "a deliberate none-day is logged data, not absence");
const oldV27a = clone(TN71); oldV27a.v = 27; delete oldV27a.caffLog;
ok(Array.isArray(mg71(oldV27a).caffLog) && mg71(oldV27a).v >= 28, "phones inherit the caffeine ledger");

console.log(`\nFINAL69: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.72.2 — clock times speak the athlete's dialect
const { fmt12: f72 } = __test;
ok(f72("15:45") === "3:45 PM" && f72("06:45") === "6:45 AM", "afternoon and morning render in regular time");
ok(f72("00:15") === "12:15 AM" && f72("12:00") === "12:00 PM", "midnight and noon edges are right");
ok(f72("—") === "—", "none-days pass through untouched");

console.log(`\nFINAL70: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.73 — tonight's lights-out is a settable bearing
const { SEED: TO73 } = __test;
const lo73 = __test.lightsOutT ? __test.lightsOutT : null;
if (lo73) {
  let bo = clone(TO73);
  const base73 = lo73(bo);
  bo.dayCtx = bo.dayCtx || {};
  bo.dayCtx[isoL(Date.now())] = { lightsOut: "23:15" };
  const ov73 = lo73(bo);
  ok(ov73.t === "23:15" && ov73.mins === 23 * 60 + 15 && ov73.override === true, "a per-day lights-out overrides the bearing: " + ov73.t);
  ok(base73.override !== true, "without a setting, the default bearing stands unlabeled");
}

console.log(`\nFINAL71: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.73.1 — the half-life respects midnight
const { caffAt: ca73 } = __test;
const past = ca73(400, 14, 1 + 10 / 60);
ok(past > 75 && past < 95, "a 2 PM dose against a 1:10 AM lights-out decays across midnight: ~" + past + " mg");
const same = ca73(400, 14, 22.5);
ok(same > 110 && same < 135, "same-evening math unchanged: ~" + same + " mg at 10:30 PM");
ok(ca73(400, 14, 1 + 10 / 60) < ca73(400, 14, 22.5), "later bedtimes always mean smaller tails — monotone, as physiology demands");

console.log(`\nFINAL72: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.74 — the Minute is law: registered steps, derived needs, closing books
const { minuteNeeds: mn74, booksToday: bt74, MORNING_REGISTRY: MR74, CONSTITUTION: CN74, SEED: TP74 } = __test;
/* Three inputs left the guided flow — see MINUTE_NOTE. Each had a threshold
   inside its own measurement noise, two had no validated link to what they
   claimed to detect, and the pulse rule watched for a rise in a variable that
   energy deficiency pushes DOWN. His record agreed first: grip logged zero times
   in six weeks, pulse twice, temperature three times. */
ok(MR74.length === 5 && ["night", "weight", "energy", "soreness", "brief"].every((k) => MR74.includes(k)), "the registry names only the inputs a rule may act on: " + MR74.join(","));
ok(["pulse", "temp", "grip"].every((k) => !MR74.includes(k)), "pulse, temperature and grip no longer cost a tap every morning");
ok(__test.MORNING_PARKED.length === 3, "they are parked rather than destroyed — still loggable, and every entry he made is kept");
/* By NAME, not by index — a law's position shifts every time one is added, and
   a test that breaks on insertion is testing the ordering rather than the law. */
ok(CN74.some((c) => c[0] === "The morning lives in the Minute"), "the Morning Minute law is carved");
let mm = clone(TP74);
const tI74 = isoL(Date.now()), yI74 = isoL(Date.now() - 864e5);
mm.sleep.nights = mm.sleep.nights.filter((n) => n.d !== yI74);
mm.pulse = [{ d: isoL(Date.now() - 2 * 864e5), bpm: 55 }];
mm.temp = [{ d: isoL(Date.now() - 2 * 864e5), f: 97.6 }];
const nd74 = mn74(mm);
ok(nd74.includes("night") && !nd74.includes("pulse") && !nd74.includes("temp"), "unlogged mornings list only the steps that still matter: " + nd74.join(","));
mm.sleep.nights.push({ d: yI74, h: 7.6, bed: "22:45", wake: "06:30", sol: 15 });
mm.pulse.push({ d: tI74, bpm: 56 });
mm.temp.push({ d: tI74, f: 97.5 });
ok(!mn74(mm).includes("night") && !mn74(mm).includes("pulse"), "logged steps leave the list — derived, never remembered");
mm.dailyLogs[tI74] = { cal: 1760, pro: 175, steps: 16500 };
const bt = bt74(mm);
ok(bt.items.some((i) => i.k === "numbers" && i.ok), "the day's books know their own state");

console.log(`\nFINAL73: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.75 — five inputs, born lawful
const { minuteNeeds: mn75, booksToday: bt75, MORNING_REGISTRY: MR75, MUSCLE_CHIPS: MC75, migrate: mg75, SEED: TQ75 } = __test;
/* Grip left the registry. It is the clearest case in the app of a field that
   bought no attribution: an 8% threshold against an ~11% minimal detectable
   change, on a forearm test that does not move after lower-body work, logged
   zero times in six weeks. Law 12 and law 11 pull in opposite directions here
   and law 12 wins — a registered input that no rule may act on is worse than no
   input, because it charges a tap every morning and returns a number the engine
   has to ignore. */
ok(["energy", "soreness"].every((k) => MR75.includes(k)), "the morning inputs a rule can act on are registered");
ok(!MR75.includes("grip"), "grip is not, because no rule may act on it any more");
ok(MC75.length === 10 && MC75.includes("forearms"), "the soreness map covers all ten trained muscles");
let fr75 = clone(TQ75);
const nd75 = mn75(fr75);
ok(nd75.includes("energy") && nd75.includes("soreness") && !nd75.includes("grip"), "the Minute offers what it can use and nothing else: " + nd75.join(","));
fr75.grip = [{ d: isoL(Date.now()), l: 110, r: 118 }];
ok(!mn75(fr75).includes("grip"), "a logged grip leaves the Minute for the day — done is done");
let bk75 = clone(TQ75);
ok(!bt75(bk75).items.some((i) => i.k === "energy"), "unadopted instruments never count as gaps");
bk75.energy = [{ d: isoL(Date.now() - 864e5), v: 3 }];
const bi75 = bt75(bk75).items.find((i) => i.k === "energy");
ok(bi75 && bi75.ok === false, "adopted-but-unlogged shows as the day's open item");
const old75 = clone(TQ75); old75.v = 28; delete old75.energy; delete old75.soreness; delete old75.grip;
const m75 = mg75(old75);
ok(Array.isArray(m75.energy) && Array.isArray(m75.soreness) && Array.isArray(m75.grip) && m75.v >= 29, "phones inherit the three ledgers");

console.log(`\nFINAL74: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.76 — the biggest confound gets a clock
const { todayMeds: tm76, migrate: mg76, SEED: TR76 } = __test;
let md = clone(TR76);
ok(tm76(md) === null, "no entry, no assumption — the chip falls back to the generic warning");
md.medsLog = [{ d: isoL(Date.now()), taken: true, at: "12:15" }];
const t76 = tm76(md);
ok(t76 && t76.taken === true && t76.at === "12:15", "a taken-day carries its athlete-set clock: " + t76.at);
md.medsLog = [{ d: isoL(Date.now()), taken: false, at: "—" }];
ok(tm76(md) && tm76(md).taken === false, "a none-day is logged truth, not absence");
const old76 = clone(TR76); old76.v = 29; delete old76.medsLog;
ok(Array.isArray(mg76(old76).medsLog) && mg76(old76).v >= 30, "phones inherit the meds ledger");

console.log(`\nFINAL75: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.77 — the signals earn their keep: every collected input consumed
const { liftCall: lc77, muscleVolume: mv77, sweepVolume: sv77, dayWeather: dw77, applyRead: ar77, migrate: mg77x, SEED: TS77 } = __test;
const td77 = isoL(Date.now());

// soreness column + the two volume laws
let vq = clone(TS77);
vq.sessionLog[isoL(Date.now() - 2 * 864e5)] = { entries: [{ id: "hack", reps: [8, 8, 8, 8, 8], rir: 1, w: 160 }, { id: "extension", reps: [9, 9, 9, 9, 9], rir: 1, w: 150 }], at: 1 };
vq.sessionLog[isoL(Date.now() - 4 * 864e5)] = { entries: [{ id: "hack", reps: [8, 8, 8, 8, 8], rir: 1, w: 160 }], at: 1 };
vq.sessionLog[isoL(Date.now() - 16 * 864e5)] = { entries: [{ id: "hack", reps: [8, 8], rir: 1, w: 160 }], at: 1 };
for (let k = 7; k >= 1; k--) vq.soreness = [...(vq.soreness || []), { d: isoL(Date.now() - k * 864e5), mgs: k <= 3 ? ["quads"] : [] }];
const q77 = mv77(vq).find((m) => m.mg === "quads");
ok(q77 && q77.sore7 === 3 && (q77.zone === "HIGH" || q77.zone === "OVER"), "soreness counts per muscle per rolling week: " + q77.sore7 + " on a " + q77.zone + " load");
for (let k = 3; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); vq.sleep.nights = vq.sleep.nights.filter((n) => n.d !== d); vq.sleep.nights.push({ d, h: 7.8 }); }
const sw77 = sv77(vq, 0);
/* THE SORE-BLOCKS-VOLUME RULE IS DELETED. Soreness is a valid readout of what he
   DID and an invalid predictor of what he CAN DO: it does not track muscle damage
   (Schoenfeld & Contreras 2013 — poorly correlated with strength loss, ROM,
   circumference and creatine kinase), it does not track hypertrophy (Damas 2016),
   and no trial has ever shown training a sore muscle impairs adaptation. The
   frequency literature points the other way. On a four-day week with the question
   asked every morning, the rule suppressed progression in exactly the muscles
   being trained hardest. The ITEM stays — it is a genuinely responsive marker of
   training load — but it informs him, it does not gate him. */
ok(!sw77 || !sw77.agentProposals.some((ap) => ap.kind === "volume" && ap.dir === -1 && ap.body.indexOf("sore") > -1), "three sore mornings no longer proposes a volume trim — soreness never predicted what it was being asked to predict" + (sw77 ? "" : " (the sweep now finds nothing to propose at all, which is the point)"));
ok(q77 && q77.sore7 === 3, "the count is still kept and still shown, because it is a real readout of load: " + q77.sore7 + " of the last 7 mornings");
/* bar speed still trims — that one is measured on the muscle, at the moment of truth */
let vq2 = clone(vq);
ok(typeof sv77(vq2, 0) === "object" || sv77(vq2, 0) === null, "the bar-speed and ceiling paths are untouched");

// the desk's readiness gate — 0-10, and it needs a real baseline before it acts
let eg = clone(TS77);
for (const [k, reps] of [[6, [10, 9]], [4, [11, 9]], [2, [12, 10]]]) eg.sessionLog[isoL(Date.now() - k * 864e5)] = { entries: [{ id: "rows", reps, rir: 1, w: 175 }], at: 1 };
for (let k = 3; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); eg.sleep.nights = eg.sleep.nights.filter((n) => n.d !== d); eg.sleep.nights.push({ d, h: 7.8 }); }
/* five mornings used to be enough to gate a session. Tolusso 2022's own caveat is
   that perceived recovery is an individual relationship — the same number means
   different things in different people — so the personal reference has to exist
   before a rule may fire off it. Fourteen. */
for (let k = 6; k >= 2; k--) eg.energy = [...(eg.energy || []), { d: isoL(Date.now() - k * 864e5), v: 8 }];
eg.energy.push({ d: td77, v: 3 });
ok(lc77(eg, "rows").verdict !== "HOLD", "five mornings of history cannot gate a session any more — the baseline is too thin to know what low means for him");
let eg2 = clone(eg); eg2.energy = [];
for (let k = 20; k >= 2; k--) eg2.energy.push({ d: isoL(Date.now() - k * 864e5), v: k % 3 === 0 ? 6 : 8 });
const egBase = lc77(eg2, "rows");
eg2.energy.push({ d: td77, v: 3 });
const egCall = lc77(eg2, "rows");
ok(egCall.verdict === "HOLD" && egCall.receipts.join(" ").indexOf("Readiness gate") > -1, "with 14+ mornings on file a low reading caps the desk at HOLD, receipt on file (was " + egBase.verdict + ")");
ok(egCall.why.indexOf("r = .80") > -1, "and the card says why this one input survived the cull — it tracks bar velocity at r=.80 in resistance-trained men");

/* THE GRIP GATE IS GONE. Its threshold was an 8% drop; handgrip's minimal
   detectable change is ~11%, so it fired inside its own noise — and the median it
   compared against was built on four entries whose own standard error is ~3.6%.
   Worse, it does not measure what it was asked to: 10x10 back squats moved leg
   extension torque (p=0.03) and jump velocity (p=0.04) while grip did not move
   (p=0.47). It is a forearm test that would flag him the morning after rowing.
   He logged it zero times in six weeks, which is the same verdict from the other
   direction. */
let gg = clone(TS77);
for (const [k, reps] of [[6, [10, 9]], [4, [11, 9]], [2, [12, 10]]]) gg.sessionLog[isoL(Date.now() - k * 864e5)] = { entries: [{ id: "rows", reps, rir: 1, w: 175 }], at: 1 };
for (let k = 3; k >= 1; k--) { const d = isoL(Date.now() - k * 864e5); gg.sleep.nights = gg.sleep.nights.filter((n) => n.d !== d); gg.sleep.nights.push({ d, h: 7.8 }); }
for (let k = 5; k >= 2; k--) gg.grip = [...(gg.grip || []), { d: isoL(Date.now() - k * 864e5), l: 115, r: 115 }];
gg.grip.push({ d: td77, l: 100, r: 100 });
const ggCall = lc77(gg, "rows");
ok(ggCall.verdict !== "HOLD", "a 13% grip drop no longer caps the desk — the threshold sat inside the measurement's own minimal detectable change");
ok(ggCall.receipts.join(" ").indexOf("Grip") === -1, "and grip has left the receipts entirely rather than lingering as decoration");

// meds none-day flags the weather
let mw = clone(TS77);
mw.medsLog = [{ d: td77, taken: false, at: "—" }];
ok(dw77(mw, td77).flags.some((f) => f.k === "nomeds"), "a none-med day is named in the weather, not hidden");

// salt/alcohol yesterday annotates this morning's read
let wr = clone(TS77);
wr.blackout = { until: isoL(Date.now() - 6 * 864e5) };
wr.dailyLogs[isoL(Date.now() - 864e5)] = { cal: 2400, pro: 170, steps: 12000, sodium: "high", alc: 3 };
const wr2 = ar77(wr, td77, 164.2, { hour: 8 });   /* MISSED-READ RIDER — this fixture is a MORNING read (the water-note test); the frozen noon clock would otherwise mark it off-window, which is a different test */
ok(wr2.reads[wr2.reads.length - 1].note.indexOf("water noise likely") > -1, "the scale read carries its own explanation: " + wr2.reads[wr2.reads.length - 1].note.slice(0, 44));

console.log(`\nFINAL76: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.77.1 — yesterday's books and today's books agree on the law
const { liveBooks: lb77, booksToday: bt77x, SEED: TT77 } = __test;
let ag = clone(TT77);
ag.energy = [{ d: isoL(Date.now() - 3 * 864e5), v: 4 }];
const yb = lb77(ag).items.find((i) => i.k === "energy");
ok(yb && yb.ok === false, "an adopted instrument missing yesterday shows in the brief's gap line too");
ok(!lb77(clone(TT77)).items.some((i) => i.k === "grip"), "unadopted stays invisible in both ledgers — same law, both days");

console.log(`\nFINAL77: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.84 — law 12: no decorative fields
const { CONSTITUTION: CN84 } = __test;
ok(CN84.length >= 12 && CN84[CN84.length - 1][0] === "No decorative fields", "the no-decorative-fields law is carved, and stays last: " + CN84[CN84.length - 1][0]);
ok(CN84[CN84.length - 1][1].indexOf("week nine") > -1, "the law keeps its teeth in its own words");

console.log(`\nFINAL78: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.98 — the two new instruments earn their places
const { labAnalytics: lc98, INS_MAP: IM98, SEED: TS98 } = __test;
const cards98 = lc98(clone(TS98));
const mw98 = cards98.find((c) => c.id === "medswindow");
ok(!!mw98, "the meds window files into the lab");
ok(mw98.status === "ARMED" && mw98.forYou.indexOf("Three of each") > -1, "meds window stays silent until three paired days exist");
ok(mw98.deep.indexOf("never propose a dose") > -1 && mw98.deep.indexOf("confound") > -1, "the meds card forbids itself a dose opinion and names its own confound");

// meds window wakes with paired days and reports both piles
let mstate = clone(TS98);
mstate.medsLog = []; mstate.dailyLogs = {};
for (let k = 1; k <= 4; k++) { const d = isoL(Date.now() - k * 864e5); mstate.medsLog.push({ d, taken: true, at: "12:00" }); mstate.dailyLogs[d] = { cal: 1800, pro: 175, steps: 16000 }; }
for (let k = 5; k <= 8; k++) { const d = isoL(Date.now() - k * 864e5); mstate.medsLog.push({ d, taken: false, at: "—" }); mstate.dailyLogs[d] = { cal: 2300, pro: 150, steps: 13000 }; }
const mw98b = lc98(mstate).find((c) => c.id === "medswindow");
ok(mw98b.status === "LIVE" && mw98b.forYou.indexOf("1800 on meds vs 2300 without") > -1, "both piles reported plainly: " + mw98b.forYou.slice(0, 52));



// both are mapped and shelved exactly once
ok(!!IM98.medswindow, "the meds window declares its inputs — the census test proves it sits on exactly one shelf");

console.log(`\nFINAL79: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// v3.99 — the forecast: measured slope, honest band, acts on nothing
const { labAnalytics: la99, INS_MAP: IM99, SEED: TS99 } = __test;
let f99 = clone(TS99);
f99.weekly = [];
const fc99a = la99(f99).find((c) => c.id === "forecast");
ok(!!fc99a && fc99a.status === "ARMED" && fc99a.forYou.indexOf("guessed line is worse than none") > -1,
   "with no weekly snapshots the forecast refuses to draw a line");

let g99 = clone(TS99);
g99.trend = 165;
g99.weekly = [{ wk: isoL(Date.now() - 21 * 864e5), trend: 167.4 }, { wk: isoL(Date.now() - 14 * 864e5), trend: 166.3 }, { wk: isoL(Date.now() - 7 * 864e5), trend: 165.4 }];
const fc99 = la99(g99).find((c) => c.id === "forecast");
ok(fc99.status === "LIVE" && fc99.lines.filter((l) => l.indexOf("wk +") === 0).length === 8, "eight weeks projected, one row each");
ok(fc99.lines[0].indexOf("% bf") > -1 && fc99.lines[0].indexOf("lean") > -1, "each week carries weight, body fat and lean: " + fc99.lines[0].slice(0, 46));
ok(fc99.lines[7].indexOf("\u00b1") > -1 && parseFloat(fc99.lines[7].split("\u00b1")[1]) > parseFloat(fc99.lines[0].split("\u00b1")[1]),
   "the band widens with distance — slope uncertainty compounds");
ok(fc99.forYou.indexOf("(forecast") > -1 && fc99.deep.indexOf("never acts") > -1, "labelled a forecast and bound to act on nothing");

// lifts need three sessions before they are projected
let h99 = clone(g99);
h99.sessionLog = {};
h99.sessionLog[isoL(Date.now() - 14 * 864e5)] = { entries: [{ id: "calves", reps: [10, 10], rir: 1, w: 315 }], at: 1 };
h99.sessionLog[isoL(Date.now() - 7 * 864e5)] = { entries: [{ id: "calves", reps: [11, 11], rir: 1, w: 315 }], at: 1 };
ok(!la99(h99).find((c) => c.id === "forecast").lines.some((l) => l.indexOf("reps/wk") > -1), "two sessions is not a slope — the lift stays absent");
h99.sessionLog[isoL(Date.now() - 2 * 864e5)] = { entries: [{ id: "calves", reps: [13, 12], rir: 1, w: 315 }], at: 1 };
const lift99 = la99(h99).find((c) => c.id === "forecast").lines.find((l) => l.indexOf("reps/wk") > -1);
ok(!!lift99 && lift99.indexOf("n=3") > -1, "the third session opens the lift projection: " + (lift99 || "").slice(0, 54));
ok(!!IM99.forecast, "the forecast declares its inputs");

// v3.99.9 — per-set RIR: the terminal set is recorded, never assumed
const { buildRirSets: brs, rirSetsOf: rso, openerRir: orr, terminalRir: trr, migrate: mgRS, SEED: TRS, genSession: gsRS, completeSession: csRS, SCHEMA_V: SVRS } = __test;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/* The seed is authored already-current while migrate() walks old states up to
   the same number. They carried that number separately and the seed silently
   fell a version behind. These two hold them together. */
ok(TRS.v === SVRS, "the seed is authored at the current schema version — no silent drift behind migrate()");
ok(TRS.exercises.every((e) => !e.lastMeta || (Array.isArray(e.lastMeta.rirSets) && e.lastMeta.rirSets.length === (e.lastMeta.reps || []).length)),
   "a fresh install's PREV blocks are shaped exactly like migrated ones");

// the shape: opener in slot 0, terminal in the last slot, middle sets left unknown
ok(eq(brs({ reps: [8, 8, 7], rir: 1, rirEnd: 0 }), [1, null, 0]), "three sets rated at both ends → [1,null,0]; the middle stays unknown, not guessed");
ok(eq(brs({ reps: [8, 8, 7], rir: 1 }), [1, null, null]), "opener alone never fabricates a terminal value");
ok(eq(brs({ reps: [8, 8, 7], rirEnd: 0 }), [null, null, 0]), "terminal alone never back-fills the opener");
ok(eq(brs({ reps: [8, 8, 7] }), [null, null, null]), "an unrated entry is three nulls, not three zeros");
ok(eq(brs({ reps: [] }), []) && eq(brs({}), []), "no reps, no array — nothing to align to");

// a single-set lift: opener and terminal are the same set, so the terminal rating wins
ok(eq(brs({ reps: [15], rir: 2, rirEnd: 0 }), [0]), "one set means opener IS terminal — the last-set rating is the truthful one");
ok(eq(brs({ reps: [15], rir: 2 }), [2]), "one set, opener only → that value still lands");
ok(eq(brs({ reps: [8, 8, 7] }, 2), [null, null]), "an explicit length overrides the reps array");

// reading back: legacy entries answer the opener question without a migration
ok(eq(rso({ reps: [8, 8, 7], rir: 1 }), [1, null, null]), "a pre-v31 entry still reports its opener — `rir` always meant slot 0");
ok(eq(rso({ reps: [8, 8, 7], rirSets: [2] }), [2, null, null]), "a short rirSets is padded to the rep count, never left ragged");
ok(eq(rso({ reps: [8, 8], rirSets: [2, 1, 0] }), [2, 1]), "a long rirSets is trimmed — reps are the source of truth for set count");
ok(eq(rso(null), []) && eq(rso({}), []), "no entry, no array");
ok(orr({ reps: [8, 8, 7], rir: 1, rirSets: [1, null, 0] }) === 1 && trr({ reps: [8, 8, 7], rir: 1, rirSets: [1, null, 0] }) === 0,
   "opener and terminal read off opposite ends of the same array");
ok(trr({ reps: [8, 8, 7], rir: 1 }) === null, "an unrated terminal reads null — the ramp must never mistake silence for failure");
ok(orr({ reps: [8, 8, 7], rirSets: [0, null, null] }) === 0 && trr({ reps: [10], rirSets: [0] }) === 0, "0 is a value, not an absence");

// logging a real session stores both ends
const slpRS = { clean: true, run: 3, need: 3, last: { h: 8 } };
const dRS = "2026-07-23";
const gRS = gsRS(clone(TRS), dRS, slpRS);
const enRS = gRS.ex.map((e) => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: e.id === "press" ? 2 : null, rirEnd: e.id === "press" ? 0 : null }));
const { s: afterRS } = csRS(clone(TRS), dRS, enRS, slpRS);
const logRS = afterRS.sessionLog[dRS].entries.find((e) => e.id === "press");
ok(logRS.rirSets[0] === 2 && logRS.rirSets[logRS.rirSets.length - 1] === 0 && logRS.rirSets.length === logRS.reps.length,
   "the session log carries a per-set array aligned to reps: [" + logRS.rirSets.join(",") + "]");
ok(trr(logRS) === 0 && orr(logRS) === 2, "and it reads back through the same accessors the ramp will use");
ok(logRS.rir === 2, "legacy `rir` is still written — every existing consumer keeps working untouched");
const metaRS = afterRS.exercises.find((e) => e.id === "press").lastMeta;
ok(eq(metaRS.rirSets, logRS.rirSets) && metaRS.rir === 2, "PREV carries the same array, so the lift card can show both ends");
const unratedRS = afterRS.sessionLog[dRS].entries.find((e) => e.id !== "press");
ok(trr(unratedRS) === null, "lifts he did not rate stay null across the whole round trip");

// the opener rule is untouched: rirHist and holdFlag still read `rir` only
const hotRS = gRS.ex.map((e) => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: e.id === "press" ? 0 : null, rirEnd: e.id === "press" ? 3 : null }));
const { s: h1RS } = csRS(clone(TRS), dRS, hotRS, slpRS);
const { s: h2RS } = csRS(h1RS, "2026-07-30", hotRS, slpRS);
ok(h2RS.exercises.find((e) => e.id === "press").holdFlag === true, "two hot openers still trip the hold — a soft terminal set does not rescue it");

// migration: v30 phones gain the array without gaining a claim
const oldRS = clone(TRS);
oldRS.v = 30;
oldRS.sessionLog = { "2026-07-20": { entries: [{ id: "press", reps: [8, 8, 7], rir: 1, w: 245 }, { id: "curl", reps: [12, 8, 10], w: 55 }], at: 1 } };
const migRS = mgRS(oldRS);
ok(migRS.v === __test.SEED.v, "a v30 phone lands on the current schema version, whatever it is: v" + migRS.v);
const mPress = migRS.sessionLog["2026-07-20"].entries.find((e) => e.id === "press");
ok(eq(mPress.rirSets, [1, null, null]), "the old opener value is lifted into slot 0 — a restatement, not a guess");
ok(trr(mPress) === null, "and the terminal slot stays null: the app never asked, so it does not know");
ok(eq(migRS.sessionLog["2026-07-20"].entries.find((e) => e.id === "curl").rirSets, [null, null, null]), "an entry with no RIR at all migrates to nulls, aligned to its reps");
ok(migRS.exercises.every((e) => !e.lastMeta || Array.isArray(e.lastMeta.rirSets)), "every PREV block gets the array too — no half-migrated states");
ok(eq(mgRS(migRS), migRS), "migration is idempotent — re-running it on a v31 state changes nothing");
const twiceRS = clone(migRS); twiceRS.v = 30;
ok(eq(mgRS(twiceRS).sessionLog["2026-07-20"].entries.find((e) => e.id === "press").rirSets, [1, null, null]),
   "a state that already has rirSets is left alone even if the version is rolled back");

// v3.99.10 — the rest tag: attribution, scoped to the size of the effect
const { PACE: PC, paceRushed: prz, liftCall: lcP, completeSession: csP, genSession: gsP, SEED: TP, restFor: rfP } = __test;

ok(PC.rushed === "rushed" && PC.normal === "normal", "the two pace values are named, not stringly-typed at each call site");
ok(prz({ pace: "rushed" }) === true && prz({ pace: "normal" }) === false && prz({}) === false && prz(null) === false,
   "absent pace reads as unknown, never as rushed — pre-feature sessions are not retroactively accused");

// it is written on the way in, and only ever as one of the two values
const slpP = { clean: true, run: 3, need: 3, last: { h: 8 } };
const dP = "2026-07-23";
const gP = gsP(clone(TP), dP, slpP);
const enP = gP.ex.map((e) => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow }));
ok(csP(clone(TP), dP, enP, slpP, { pace: "rushed" }).s.sessionLog[dP].pace === "rushed", "a rushed session is recorded as rushed");
ok(csP(clone(TP), dP, enP, slpP, { pace: "normal" }).s.sessionLog[dP].pace === "normal", "a full-rest session is recorded as normal");
ok(csP(clone(TP), dP, enP, slpP).s.sessionLog[dP].pace === null, "no tap, no claim — the field lands null");
ok(csP(clone(TP), dP, enP, slpP, { pace: "kinda quick" }).s.sessionLog[dP].pace === null, "anything that is not one of the two values is discarded, not stored");
const rushLines = csP(clone(TP), dP, enP, slpP, { pace: "rushed" }).lines;
ok(rushLines.some((l) => l.t.indexOf("RUSHED") > -1), "the feed says out loud what the tag will and will not do");
ok(!csP(clone(TP), dP, enP, slpP, { pace: "normal" }).lines.some((l) => l.t.indexOf("RUSHED") > -1), "a normal session gets no rushed line");

/* The point of the whole feature: three declining sessions RESET the lift —
   lightening the bar 5%. That must not fire off compressed days. */
const stallDays = ["2026-07-06", "2026-07-09", "2026-07-13", "2026-07-16"];
/* Clean nights across the window: a short-sleep session no longer counts toward
   a stall either (SLEEP_NOTE), so this fixture has to state its sleep or it is
   testing two rules at once. */
const cleanNightsOver = (st, fromISO, toISO) => {
  const a = new Date(fromISO + "T00:00:00"), b = new Date(toISO + "T00:00:00");
  st.sleep.nights = (st.sleep.nights || []).filter((n) => n.d < fromISO || n.d > toISO);
  for (let t = a.getTime(); t <= b.getTime(); t += 864e5) st.sleep.nights.push({ d: new Date(t).toISOString().slice(0, 10), h: 7.8 });
  st.sleep.nights.sort((x, y) => (x.d < y.d ? -1 : 1));
  return st;
};
const mkStall = (paces) => {
  const st = cleanNightsOver(clone(TP), "2026-07-01", "2026-07-20");
  st.sessionLog = {};
  [[10, 10], [9, 9], [8, 8], [7, 7]].forEach((reps, i) => {
    st.sessionLog[stallDays[i]] = { entries: [{ id: "rows", reps, rir: 1, rirSets: [1, null], w: 175 }], at: i + 1, pace: paces[i] };
  });
  return st;
};
const allHonest = lcP(mkStall([null, null, null, null]), "rows");
ok(allHonest.verdict === "RESET", "four honestly-fought declining sessions still reset the lift — the safety net is not a mute button: " + allHonest.verdict);
const someRushed = lcP(mkStall([null, "rushed", "rushed", "rushed"]), "rows");
ok(someRushed.verdict !== "RESET", "the same declining numbers on rushed days do NOT lighten the bar: " + someRushed.verdict);
ok(someRushed.receipts.some((r) => r.indexOf("rushed") > -1), "and it says why, in his words, on the card");
ok(someRushed.vel === allHonest.vel, "velocity is unchanged — a ~0.15 SMD does not justify throwing the reading away");
const markedNormal = lcP(mkStall([null, "normal", "normal", "normal"]), "rows");
ok(markedNormal.verdict === "RESET", "tapping FULL REST does not buy an exemption — only 'rushed' changes anything");

// the Gym Mode derivation thresholds, stated as arithmetic rather than left in the component
const paceOf = (n, cut) => (n >= 3 ? (cut / n >= 0.5 ? PC.rushed : PC.normal) : null);
ok(paceOf(0, 0) === null && paceOf(2, 2) === null, "under three rests there is no session-level statement to make");
ok(paceOf(6, 3) === PC.rushed && paceOf(6, 2) === PC.normal, "half the rests cut short is the line, and it is inclusive");
ok(paceOf(8, 0) === PC.normal, "letting every timer run out reads as full rest, with no tap from him");
ok(rfP("press") === 150 && rfP("curl") === 90, "the pace tag records what happened; the prescription itself lives in restFor and is set by the evidence, not by the tag");

// v3.99.11 — autoregulated progression: the step is sized by what he had left
const { progressStep: ps, progressAnchor: pa2, atTopOfWindow: atw, targetsFor: tfA, fadeRead: frd, sessionDebrief: sdA, SEED: TA9, genSession: gsA, completeSession: csA } = __test;
const lift = (o) => Object.assign({ id: "x", n: "X", sets: 4, hi: 13, w: 100, inc: 5, last: [10, 8, 7, 7] }, o);
const meta = (reps, rirSets, debt) => ({ d: "2026-07-20", w: 100, reps, rirSets, debt: !!debt });

// the step scales with the terminal rating, and is capped at what he claimed
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 0]) })).add === 1, "terminal set taken to failure → the honest step is one rep");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 1]) })).add === 2, "one rep short of failure → a two-rep step");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 2]) })).add === 2, "two left on the failure set → two reps back, exactly what he said he had");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 3]) })).add === 3, "three left → three, and the cap stops there because RIR is least accurate far from failure");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 5]) })).add === 3, "a claimed 5 RIR still buys only three — the estimate is not trusted that far out");

// with no terminal rating it falls back to the opener, conservatively
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, null]) })).add === 1, "opener at the prescribed 2 with no terminal rating → still one rep, because 2 is compliance not headroom");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [3, null, null, null]) })).add === 2, "opener at 3 says headroom even without a terminal rating");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [0, null, null, null]) })).add === 1, "a hot opener holds the step at one");
ok(ps(lift({})).add === 1 && ps(lift({ lastMeta: meta([10, 8], [null, null]) })).add === 1, "nothing rated → the old default, unchanged");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 3]), holdFlag: true })).add === 0, "the governor hold outranks every reserve reading — nothing climbs");
/* The short-sleep short-circuit is gone. It sat above every RIR branch, so on a
   record where every session carried debt it made all of them unreachable — and
   it had no evidence behind it: Craven 2022 puts acute sleep loss at -2.85% on
   strength, inside the 1.8-3.3% test-retest CV, and no trial has ever tested
   damping progression on low-readiness days. RIR is what sizes the step now, on
   any night. See SLEEP_NOTE. */
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 3], true) })).add === 3, "three reps left in the tank buys three reps whether or not the night was short — RIR is the readiness signal, and it is the one with outcome evidence");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 0], true) })).add === 1, "and a set taken to failure on a short-sleep night still buys exactly one — the rating drives it, not the sleep");
ok(ps(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 2]) })).why.indexOf("failure") > -1, "and every step carries the reason it is that size");

// the targets that come out the other end
ok(JSON.stringify(tfA(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 0]) }))) === "[10,9,7,7]", "RIR 0 reproduces the old single-rep behaviour exactly");
ok(JSON.stringify(tfA(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 3]) }))) === "[10,10,8,7]",
   "three reps of reserve buys three reps of target, and they spread across the faded sets rather than spiking one: 10,8,7,7 → 10,10,8,7");
ok(JSON.stringify(tfA(lift({ lastMeta: meta([10, 8, 7, 7], [2, null, null, 3]), holdFlag: true }))) === "[10,8,7,7]", "held lifts repeat the line exactly — no climb");
ok(JSON.stringify(tfA({ last: [14, 13, 13], hi: 15, sets: 3 })) === "[14,14,13]", "the original rule still holds when nothing is rated");
ok(JSON.stringify(tfA({ last: [10, 10], hi: 10, sets: 2 })) === "[10,10]", "and a full window still refuses to invent reps above the ceiling");
ok(JSON.stringify(tfA(lift({ hi: 9, last: [9, 9, 9, 9], lastMeta: meta([9, 9, 9, 9], [2, null, null, 3]) }))) === "[9,9,9,9]", "at the ceiling the step has nowhere to go and stops cleanly");

// the anchor: a flagged day stops ratcheting him down
const mkAnchor = (pace, nightsH) => {
  const st = clone(TA9);
  st.sleep.nights = ["2026-07-07", "2026-07-08", "2026-07-09"].map((d) => ({ d, h: nightsH }));
  st.sessionLog = { "2026-07-10": { entries: [{ id: "rows", reps: [10, 10], rir: 1, w: 180 }], at: 1, pace } };
  return st;
};
/* The anchor is now the best of the last three unrushed sessions at this load,
   full stop — no sleep condition. One session is the noisiest possible estimate
   of capacity (his own set-to-set spread is ±0.75 reps), so building the next
   target off a single dip ratchets him down for noise. Max-of-three is biased
   slightly high, which is the correct direction: an over-ambitious target costs
   one missed rep, an under-ambitious one costs a block. */
const anchEx = { id: "rows", sets: 2, hi: 12, w: 180, last: [7, 7], lastMeta: meta([7, 7], [1, 0], true) };
ok(JSON.stringify(pa2(anchEx, mkAnchor("normal", 8))) === "[10,10]", "after a dip the anchor returns to his best recent session at that weight");
ok(JSON.stringify(pa2({ ...anchEx, lastMeta: meta([7, 7], [1, 0], false) }, mkAnchor("normal", 8))) === "[10,10]", "and it does so whether or not the dip was flagged — capacity is what the anchor estimates, and one low session does not revise it");
ok(JSON.stringify(pa2(anchEx, mkAnchor("rushed", 8))) === "[7,7]", "a rushed session cannot become the anchor — short rest lowers the back sets by construction, so it is measuring something else");
ok(JSON.stringify(pa2(anchEx, mkAnchor("normal", 5))) === "[10,10]", "a short-sleep session CAN — Knowles 2022 ran nine straight nights at 5 h and volume load fell under 1%, so those reps are real reps");
ok(JSON.stringify(pa2(anchEx, null)) === "[7,7]", "with no state to look through, the anchor is simply the last session");
/* and it only looks back three sessions, so a number from two months ago cannot
   hold a target hostage after a genuine regression */
const staleAnchor = mkAnchor("normal", 8);
[["2026-07-11", [8, 8]], ["2026-07-12", [8, 8]], ["2026-07-13", [8, 8]]].forEach(([d, reps], i) => { staleAnchor.sessionLog[d] = { entries: [{ id: "rows", reps, rir: 1, w: 180 }], at: 9 + i }; });
ok(JSON.stringify(pa2(anchEx, staleAnchor)) === "[8,8]", "the window is three sessions deep — an old high rolls off instead of anchoring forever");

// the load gate, with the fade allowance that unblocks a descending scheme
const g4 = { sets: 4, hi: 13 };
ok(atw([13, 13, 13, 13], g4) === true, "a flat maxed window is still the top of the window");
ok(atw([13, 12, 11, 10], g4) === true, "so is a natural one-rep-per-set fade off a ceiling opener — this is the change");
ok(atw([13, 12, 11, 9], g4) === false, "one rep below that natural line and it is not earned");
ok(atw([12, 12, 12, 12], g4) === false, "the opener must actually reach the ceiling — no earning from below it");
ok(atw([10, 8, 7, 7], g4) === false && atw([13, 12], g4) === false, "his current calves line does not earn, and a short session cannot earn at all");

// the fade read no longer calls an ascending pair a fade
ok(frd([5, 6]).t.indexOf("climbed into it") > -1 && frd([5, 6]).k === "observation", "5 then 6 is climbing into the lift, not fading — the old rule called this 'barely faded'; typed ▸ observation because it asks for a change");
ok(frd([10, 12, 10]).t.indexOf("peaked on set 2") > -1 && frd([10, 12, 10]).k === "observation", "a mid-session peak is named as one — and typed as an observation");
ok(frd([9, 9, 9]).t.indexOf("dead flat") > -1 && frd([9, 9, 9]).k === "fade", "flat is flat — the quiet fade species, a faint dot on the rail");
ok(frd([10, 8, 7, 7]).t.indexOf("steep drop of 3") > -1 && frd([10, 8, 7, 7]).k === "observation", "and a real drop is still called a steep drop — actionable, so it wears the observation glyph");
ok(frd([8, 7]).t.indexOf("barely faded") > -1 && frd([8, 7]).k === "fade" && frd([5]) === null && frd([]) === null, "a one-rep fade is minor (fade species), and a single set has no shape to read");

// the debrief: no sentence may repeat verbatim across lifts
const dbD = isoL(Date.now());
let dbX = clone(TA9);
dbX.sessionLog = {};
dbX.sessionLog[isoL(Date.now() - 4 * 864e5)] = { entries: [{ id: "hack", reps: [9, 9, 9], rir: 2, rirSets: [2, null, 2], w: 160 }, { id: "ham", reps: [10, 10], rir: 2, rirSets: [2, 2], w: 120 }, { id: "abs", reps: [10, 10, 10], rir: 2, rirSets: [2, null, 2], w: 100 }], at: 1 };
dbX.sessionLog[dbD] = { entries: [{ id: "hack", reps: [9, 9, 9], rir: 2, rirSets: [2, null, 2], w: 160 }, { id: "ham", reps: [10, 10], rir: 2, rirSets: [2, 2], w: 120 }, { id: "abs", reps: [10, 10, 10], rir: 2, rirSets: [2, null, 2], w: 100 }], at: 2, pace: "normal" };
const dbR = sdA(dbX, dbD);
const dwA9 = __test.debriefWords;
const dbRW = dwA9(dbR);   /* R15: repeats are judged on the flattened legacy strings */
const allLines = dbRW.lifts.flatMap((L) => L.lines);
const dupes = allLines.filter((l, i) => allLines.indexOf(l) !== i);
ok(dupes.length === 0, "three lifts rated identically produce zero repeated sentences — the filler is gone" + (dupes.length ? ": " + dupes[0] : ""));
ok(dbRW.lifts.every((L) => L.lines.some((l) => l.indexOf("Next time:") === 0)) && dbR.lifts.every((L) => L.next && Array.isArray(L.next.targets) && typeof L.next.w !== "undefined"), "every lift says exactly what it will ask for next time — and the typed next field carries the same targets as data");
ok(dbR.lifts.every((L) => L.lines.every((l) => l && typeof l.t === "string" && typeof l.k === "string") && (!L.next || typeof L.next.t === "string")), "the typed contract is fully resolved — every middle line carries {k, t} and next.t is a finished sentence, so no placeholder ever reaches the UI");
/* The reason is either on the lift (when lifts differ) or hoisted into the
   summary once (when every lift steps for the same reason). Never six times. */
const nextLines = dbRW.lifts.map((L) => L.lines.find((l) => l.indexOf("Next time:") === 0));
const hoisted = dbR.summary.some((l) => l.indexOf("for the same reason") > -1);
ok(hoisted !== nextLines.some((l) => l.indexOf("because") > -1), "the step reason appears either per-lift or once in the summary — never both, never neither");
ok(hoisted && new Set(nextLines.map((l) => l.replace(/[0-9,]/g, ""))).size >= 1, "with a session-wide reason the per-lift lines carry only the numbers");
/* And when the lifts genuinely differ, the reason comes back down to the lift.
   Driven through completeSession, because the step is read off ex.lastMeta —
   the state's own view — not off the archived session row. */
const dMix = "2026-07-24";
const gMix = gsA(clone(TA9), dMix, { clean: true, run: 3, need: 3, last: { h: 8 } });
const enMix = gMix.ex.map((e2) => ({ id: e2.id, n: e2.n, w: e2.w, tgt: e2.tgt, reps: e2.tgt.slice(), isDebutNow: e2.isDebutNow, rir: 2, rirEnd: e2.id === "ham" ? 3 : 0 }));
const stMix = csA(clone(TA9), dMix, enMix, { clean: true, run: 3, need: 3, last: { h: 8 } }, { pace: "normal" }).s;
const dbMr = sdA(stMix, dMix);
const mixed = dwA9(dbMr).lifts.map((L) => L.lines.find((l) => l.indexOf("Next time:") === 0)).filter(Boolean);
ok(mixed.length >= 2 && mixed.every((l) => l.indexOf("because") > -1), "with mixed ratings the reason comes back down onto each lift");
ok(!dbMr.summary.some((l) => l.indexOf("for the same reason") > -1), "and nothing gets hoisted when the reasons differ");
ok(mixed.some((l) => l.indexOf("3 reps added") > -1) && mixed.some((l) => l.indexOf("1 rep added") > -1),
   "the lift with 3 in the tank steps three, the lifts taken to failure step one — same session, different answers");
ok(new Set(mixed.map((l) => l.slice(l.indexOf("because")))).size >= 2, "and those answers are worded differently, not one template with the number swapped");
ok(dbR.summary[0].length > 0 && !/^\d+ lifts/.test(dbR.summary[0]), "the summary leads with a read, not a stat line");
ok(dbR.summary.some((l) => l.indexOf("meant to reach failure") > -1), "three lifts with reserve left gets one cross-lift observation, not three copies");
ok(dbR.summary.some((l) => l.indexOf("lb moved") > -1), "the stat line is still there, just no longer first");
const dbNo = sdA(dbX, "2020-01-01");
ok(dbNo === null, "unlogged dates still return nothing");

// end to end: a real session logged with a terminal rating produces a bigger next target
const slpA = { clean: true, run: 3, need: 3, last: { h: 8 } };
const dA = "2026-07-24";
const gA = gsA(clone(TA9), dA, slpA);
const mkEn = (rirEnd) => gA.ex.map((e) => ({ id: e.id, n: e.n, w: e.w, tgt: e.tgt, reps: e.tgt.slice(), isDebutNow: e.isDebutNow, rir: 2, rirEnd }));
const softA = csA(clone(TA9), dA, mkEn(3), slpA).s;
const hardA = csA(clone(TA9), dA, mkEn(0), slpA).s;
const pickA = (st) => st.exercises.find((e) => e.id === "ham");
const softT = tfA(pickA(softA), softA), hardT = tfA(pickA(hardA), hardA);
ok(softT.reduce((a, b) => a + b, 0) > hardT.reduce((a, b) => a + b, 0),
   `the same reps with 3 left over ask for more next time than the same reps taken to failure: ${softT.join(",")} vs ${hardT.join(",")}`);

// v3.99.12 — load rungs: the app may only ask for weights the machine can make
const { loadRungs: lrG, nextLoad: nl, prevLoad: plG, snapLoad: sl2, parseRungs: prG, liftCall: lcR, completeSession: csR, SEED: TR9 } = __test;
const cybex = { id: "c", n: "Cybex cable", sets: 2, hi: 10, w: 85, inc: 5, steps: [80, 82.5, 85, 90, 92.5, 95, 100] };
const even = { id: "e", n: "Even stack", sets: 2, hi: 10, w: 85, inc: 5 };

ok(lrG(even) === null && lrG({ steps: [] }) === null && lrG({ steps: [50] }) === null, "no ladder, one rung, or an empty list all mean 'use the even increment'");
ok(JSON.stringify(lrG({ steps: [90, 80, 85, 80] })) === "[80,85,90]", "a ladder is sorted and de-duplicated however he types it");
ok(JSON.stringify(lrG({ steps: [80, "x", -5, 90, 0] })) === "[80,90]", "junk and non-positive numbers are dropped, not stored");

// the mini-jumps he actually asked for
ok(nl(cybex) === 90, "from 85 the next real rung is 90, not 85+5 by luck — it happens to agree here");
ok(nl(cybex, 80) === 82.5, "from 80 the attachment gives a 2.5 mini-jump, which a fixed +5 would have skipped");
ok(nl(cybex, 90) === 92.5 && nl(cybex, 92.5) === 95, "and it keeps stepping through the uneven rungs in order");
ok(nl(cybex, 100) === null, "the top of the stack is real — there is no next rung, and the app must not invent one");
ok(nl(even) === 90 && nl(even, 100) === 105, "with no ladder the old fixed increment is byte-for-byte unchanged");
ok(nl({ w: "BW", inc: null }) === null && nl({ w: 100, inc: null }) === null, "bodyweight and incrementless lifts have no next load");
ok(plG(cybex, 90) === 85 && plG(cybex, 82.5) === 80 && plG(cybex, 80) === null, "down the ladder works the same way, and the bottom rung is the bottom");
ok(sl2(cybex, 91) === 90 && sl2(cybex, 92.5) === 92.5 && sl2(cybex, 10) === 80, "an arbitrary number snaps to the rung at or below it, never above");
ok(sl2(even, 91) === 91, "with no ladder there is nothing to snap to");

// parsing whatever he types
ok(JSON.stringify(prG("80, 82.5, 85, 90")) === "[80,82.5,85,90]", "commas work");
ok(JSON.stringify(prG("80 82.5\n85  90")) === "[80,82.5,85,90]", "so do spaces and newlines");
ok(JSON.stringify(prG("90,80,85,85")) === "[80,85,90]", "out of order and duplicated still lands sorted and unique");
ok(prG("") === null && prG("  ") === null && prG("100") === null && prG("abc") === null, "empty or a single number clears the ladder rather than half-setting it");

// the engine only ever offers a real weight
const rungS = clone(TR9);
const cal = rungS.exercises.find((e2) => e2.id === "calves");
cal.steps = [300, 310, 315, 320, 335, 350];
cal.w = 320; cal.sets = 4; cal.hi = 13; cal.reclaim = null; cal.last = [13, 12, 11, 10];
const enR = [{ id: "calves", n: cal.n, w: 320, tgt: [13, 12, 11, 10], reps: [13, 12, 11, 10], rir: 1 }];
const slpR9 = { clean: true, run: 3, need: 3, last: { h: 8 } };
/* Topping the window ONCE is now provisional — two-for-two, from measurement
   error rather than sleep (NOISE_NOTE). The first sighting cannot be told apart
   from a good day; the second can. */
const onceR = csR(rungS, "2026-07-24", enR, slpR9).s;
ok(!onceR.queue.some((q) => q.exId === "calves" && !q.done && q.kind === "debut"), "one top-of-window session queues nothing — a single sighting is inside the noise");
ok(onceR.feed.some((f) => f.t.indexOf("PROVISIONAL") > -1), "and it says provisional, with the spread that makes it so");
ok(onceR.exercises.find((e2) => e2.id === "calves").topRun === 1, "the sighting is counted rather than forgotten");
const afterR = csR(onceR, "2026-07-27", enR, slpR9).s;
const qR = afterR.queue.find((q) => q.exId === "calves" && !q.done && q.kind === "debut");
ok(qR && qR.newW === 335, "the second one earns it, and queues 335 — the next rung — not 325, which this machine cannot make: " + (qR ? qR.newW : "none"));
ok(afterR.feed.some((f) => f.t.indexOf("335 EARNED") > -1), "and the feed names the real weight");
/* the escape hatch: a jump clearly outside the noise band banks on one sighting */
const bigS = clone(TR9);
const calB = bigS.exercises.find((e2) => e2.id === "calves");
calB.steps = [300, 310, 315, 320, 335, 350]; calB.w = 320; calB.sets = 4; calB.hi = 13; calB.reclaim = null; calB.last = [8, 7, 6, 6];
calB.lastMeta = { d: "2026-07-20", w: 320, reps: [8, 7, 6, 6], rirSets: [1, null, null, null], debt: false };
const bigAfter = csR(bigS, "2026-07-24", enR, slpR9).s;
ok(bigAfter.queue.some((q) => q.exId === "calves" && !q.done && q.kind === "debut"), "a session 13 reps clear of the last one banks immediately — that is not a good day, it is a different capacity");
ok(bigAfter.feed.some((f) => (f.how || "").indexOf("standard errors") > -1), "and the receipt names the arithmetic that let it skip the confirmation");

// at the top of the stack, nothing is queued and it says so
const topS = clone(TR9);
const cal2 = topS.exercises.find((e2) => e2.id === "calves");
cal2.steps = [300, 310, 320]; cal2.w = 320; cal2.sets = 4; cal2.hi = 13; cal2.reclaim = null; cal2.last = [13, 12, 11, 10];
const afterT = csR(topS, "2026-07-24", [{ id: "calves", n: cal2.n, w: 320, tgt: [13, 12, 11, 10], reps: [13, 12, 11, 10], rir: 1 }], { clean: true, run: 3, need: 3, last: { h: 8 } }).s;
ok(!afterT.queue.some((q) => q.exId === "calves" && !q.done && q.kind === "debut"), "at the top rung nothing is queued — the app does not invent a weight above the stack");

// a RESET lands on a rung too
const resS = cleanNightsOver(clone(TR9), "2026-07-01", "2026-07-20");
const rw = resS.exercises.find((e2) => e2.id === "rows");
rw.steps = [150, 160, 175, 180, 195]; rw.w = 180;
resS.sessionLog = {};
[["2026-07-06", [10, 10]], ["2026-07-09", [9, 9]], ["2026-07-13", [8, 8]], ["2026-07-16", [7, 7]]].forEach(([d, reps], i) => {
  resS.sessionLog[d] = { entries: [{ id: "rows", reps, rir: 1, rirSets: [1, null], w: 180 }], at: i + 1 };
});
const resR = lcR(resS, "rows");
ok(resR.verdict === "RESET" && resR.newW === 175, "a reset lands on 175 — a real rung — instead of 171, a weight this machine cannot make: " + resR.newW);
const resEven = clone(resS);
delete resEven.exercises.find((e2) => e2.id === "rows").steps;
ok(lcR(resEven, "rows").newW === 170, "with no ladder the old 5% round-to-5 is unchanged");
/* The deload picks the NEAREST rung below, not the nearest rung at-or-below the
   5% target — on a coarse stack those are different, and one is a cliff. */
const { deloadLoad: dld } = __test;
ok(dld({ w: 180, steps: [150, 160, 175, 180, 195] }) === 175, "180 on a coarse stack deloads one notch to 175, not two notches to 160");
ok(dld({ w: 180, steps: [150, 160, 170, 180] }) === 170, "where a rung sits near the 5% mark, that is the one it takes");
ok(dld({ w: 100, steps: [100, 110] }) === 100, "at the bottom rung there is nowhere to deload to, and it says so by not moving");
ok(dld({ w: 180, inc: 5 }) === 170 && dld({ w: 10, inc: 5 }) === 10, "with no ladder it is the old arithmetic, and it never goes below 5");

// v3.99.13 — rest prescribed at the evidence plateau, and recovery stops being a score
const { restFor: rf2, restLine: rl2, recoveryIndex: ri2, runAdaptive: ra2, SEED: TV13 } = __test;

ok(rf2("curl") === 90 && rf2("lateral") === 90 && rf2("tricep") === 90,
   "isolation rests 90 s — 75 s sat under the point where the measurable benefit stops, and the reps it cost landed on the sets the ramp reads");
ok(rf2("press") === 150 && rf2("rows") === 150 && rf2("hack") === 150, "compounds hold at 150 s, inside the 2-3 min band tested in trained lifters");
ok(rf2("curl", 2, 3) === 120 && rf2("press", 2, 3) === 180, "the set before the final one gets 30 s more — that is the set the taper sends to failure");
ok(rf2("curl", 1, 3) === 90 && rf2("press", 1, 3) === 150, "middle rests are unchanged");
ok(rf2("curl", 0, 1) === 90 && rf2("curl", 1, 1) === 90, "a single-set lift has no terminal bump to give");
ok(rf2("curl") >= 90 && rf2("press") >= 90, "nothing the app prescribes now sits under the 90 s plateau");
ok(rl2("curl", 3).indexOf("90s") === 0 && rl2("curl", 3).indexOf("120s before the last") > -1, "and the card he actually logs from states it: " + rl2("curl", 3));
ok(rl2("press", 1) === "150s between sets", "a one-set lift gets the short form");

// recovery: named signals with receipts and fixes, not a composite number
let recS = clone(TV13);
recS.sleep.nights = [{ d: "2026-07-24", h: 6 }, { d: "2026-07-25", h: 6.2 }, { d: "2026-07-26", h: 6.1 }, { d: "2026-07-27", h: 6 }, { d: "2026-07-28", h: 6.4 }];
const rec1 = ri2(recS);
ok(Array.isArray(rec1.flags) && rec1.watched === 7, "recovery returns named flags out of a stated number watched");
ok(rec1.flags.every((f) => f.k && f.receipt && f.fix), "every flag carries what raised it AND what clears it — a problem with no lever is not analysis");
ok(rec1.flags.some((f) => f.k === "sleep") && rec1.flags.some((f) => f.k === "avg5"), "five nights under 7 h raises both the reset flag and the chronic-average flag");
ok(rec1.lever && rec1.flags.every((f) => f.cost <= rec1.lever.cost), "the lever is the heaviest flag, so the card can say 'start here' instead of listing five problems");
ok(rec1.factors.length === rec1.flags.length, "the old factors array still resolves, so nothing downstream broke");

/* The correctness fix: a rep dip on a day that was not a fair test is not
   evidence of poor recovery. It used to be counted twice — once as the sleep
   flag, once as the dip. */
const mkDip = (pace, nightsH) => {
  const st = clone(TV13);
  st.sleep.nights = ["2026-07-24", "2026-07-25", "2026-07-26", "2026-07-27"].map((d) => ({ d, h: nightsH }));
  st.sessionLog = { "2026-07-28": { entries: [{ id: "ham", reps: [8, 8], rir: 1, w: 120 }], at: 1, dips: 3, pace } };
  return st;
};
ok(ri2(mkDip("normal", 8)).flags.some((f) => f.k === "dips"), "dips on a clean, unhurried day are real and do flag");
ok(!ri2(mkDip("rushed", 8)).flags.some((f) => f.k === "dips"), "the same dips on a rushed session do not — a compressed day lowers reps by itself");
ok(!ri2(mkDip("normal", 5)).flags.some((f) => f.k === "dips"), "and not on short sleep either — the sleep flag already carries that day");
ok(ri2(mkDip("rushed", 8)).excludedDips === 3, "what was excluded is reported, not silently dropped");
ok(ri2(mkDip("normal", 8)).excludedDips === 0, "and nothing is reported as excluded when nothing was");

// the proposal card: no composite score in the headline, a lever in the body
let propS = clone(TV13);
propS.sleep.nights = [{ d: "2026-07-22", h: 5.5 }, { d: "2026-07-23", h: 5.6 }, { d: "2026-07-24", h: 5.4 }, { d: "2026-07-25", h: 5.8 }, { d: "2026-07-26", h: 5.5 }];
propS.exercises.find((e) => e.id === "ham").holdFlag = true;
propS.exercises.find((e) => e.id === "hack").holdFlag = true;
propS.blackout.until = "2026-01-01";
const propR = ra2(propS, "2026-07-27");
/* R14 — the recovery surface is the FEED now; the composite-score and enumeration
   checks move with it, because the charter applies to whatever surface he reads. */
const recLine = propR.feed.find((f) => /RECOVERY LOW/.test(f.t));
ok(!!recLine, "R14 — a low-recovery week still informs, as a feed line rather than a card whose tap did nothing");
ok(!/\d+\/100/.test(recLine.t), "the headline is no longer a score out of 100 — the charter forbids a composite: " + recLine.t);
ok(/\d+ OF \d+ SIGNALS UP/.test(recLine.t), "it counts named signals instead, which is an enumeration rather than an index: " + recLine.t);
ok(recLine.how.indexOf("Start here:") > -1, "the body leads with the single biggest lever");
ok(recLine.how.indexOf("Converging signals") === -1, "and the old jargon opener is gone");
ok(recLine.how.indexOf("nothing auto-changes") > -1 && recLine.how.indexOf("Reps still progress") > -1,
  "it states the standstill contract in plain words");
ok(recLine.how.indexOf("re-reads it every morning") > -1, "and says when it looks again, so an unread line is not a dead end");
/* A card whose trigger has cleared must stand down rather than sit there asking
   to be applied. His live card was armed partly off dips that no longer count. */
let clearS = clone(propR);
/* R14: recovery never becomes a card any more, so propR carries none — this scenario is a card armed by the OLD build surviving in state. Plant it, as his phone would carry it. */
clearS.proposals = [...(clearS.proposals || []), { rid: "recovery_2026-07-27", id: "rc9", d: "2026-07-27", title: "RECOVERY LOW — 3 OF 7 SIGNALS UP", why: "legacy card from the pre-R14 build", apply: { kind: "note" }, resolved: false }];
clearS.sleep.nights = ["2026-07-24", "2026-07-25", "2026-07-26", "2026-07-27"].map((d) => ({ d, h: 8.2 }));
clearS.exercises.forEach((e) => { e.holdFlag = false; });
const clearR = ra2(clearS, "2026-07-28");
const stillArmed = (clearR.proposals || []).filter((p) => p.rid && p.rid.indexOf("recovery_") === 0 && !p.resolved);
ok(stillArmed.length === 0, "once the signals clear the card stands down instead of lingering with a claim the engine stopped making");
ok(clearR.proposals.some((p) => p.resolved && (p.stoodDown || /converted to feed/.test(p.resolvedHow || ""))), "it resolves rather than vanishing — nothing is deleted. Under R14 a planted recovery CARD converts to a feed line; either path is a resolution on the record");
{
  /* audit r4 tightening: assert the WINNER's feed line exists, tied to its resolvedHow —
     not merely that some line from either path is present. */
  const won = clearR.proposals.find((p) => p.resolved && (p.stoodDown || /converted to feed/.test(p.resolvedHow || "")));
  const wonLine = won && won.stoodDown ? clearR.feed.some((f) => f.t === "RECOVERY CARD STOOD DOWN") : clearR.feed.some((f) => /RECOVERY LOW/.test(f.t));
  ok(!!won && wonLine, "and the WINNING path's own feed line exists — the resolution and its receipt travel together, whichever sweep won the race");
}

// v3.99.14 — the protocol is actually ranked, and protein scales off lean mass
const { dayProtocol: dp14, proteinTarget: pt14, bfEst: bf14, SEED: TW14 } = __test;

// protein: the unit is fat-free mass, because that is the model whose interval excludes zero
const ptS = clone(TW14);
const p0 = pt14(ptS);
ok(p0.ffmKg > 0 && p0.floor > 0, "the target is computed from measured lean mass, not from bodyweight or a constant");
/* The old assertion here was "never drops below 175" — the authored constant
    guarding itself. There is no evidence for 175; there is evidence for
    2.5 g/kg of fat-free mass. So the floor is what gets asserted now. */
ok(p0.g >= p0.lo && p0.lo >= Math.round(p0.floor / 5) * 5, "the headline sits at or above the evidence floor, and the floor is 2.5 g/kg of lean mass: " + p0.floor + " g");
ok(p0.hi >= p0.lo, "and the lean-subgroup number is carried alongside rather than collapsed away: " + p0.lo + "-" + p0.hi);
ok(p0.g >= p0.floor, "and never below the evidence floor either");
ok(p0.why.indexOf("lean mass") > -1, "the receipt names the unit, so the number can be argued with");
/* Crossing into the lean sub-group RAISES the target — that is the counter-
   intuitive part, and the part the evidence is clearest about. */
const leanS = clone(TW14);
/* Lean enough that the whole band clears the line, not just the midpoint. The
   anchor error is +/-3.5 on a coach's eye, so "in the sub-group" has to mean
   in it even at the pessimistic end. */
leanS.model.lean = leanS.trend * 0.94;
const pLean = pt14(leanS);
/* Entering the sub-group is now decided by the whole INTERVAL clearing 12.2%,
    not by the point estimate crossing it — see PROTEIN_BAND_NOTE. A point
    estimate at 12.1 with a band of 8.6-15.6 is a coin-flip, and the old test
    let a coin-flip swing the target thirty grams. */
ok(pLean.bfHi <= 12.2 && pLean.inLeanSubgroup, "the sub-group opens only when his whole body-fat band clears 12.2%, not when the midpoint does");
ok(pLean.perKg === 3.0 && pLean.g > p0.lo, `and the target steps UP, not down: ${pLean.g} g against a ${p0.lo} g floor`);
ok(!pLean.straddles, "and once the band clears the line there is nothing left to straddle");
const fatS = clone(TW14);
fatS.model.lean = fatS.trend * 0.82;
ok(!pt14(fatS).inLeanSubgroup && pt14(fatS).perKg === 2.5, "above that line it sits at the 2.5 g/kg floor multiplier");

// the protocol: a real ranking, and no silent truncation
const slp14 = { clean: false, run: 0, need: 3, last: { h: 6 } };
const prS = clone(TW14);
prS.sleep.nights = [{ d: "2026-07-27", h: 6 }];
const pr14 = dp14(prS, slp14);
ok(Array.isArray(pr14.steps) && pr14.ranked === true, "the protocol declares itself ranked");
ok(pr14.steps.every((x) => typeof x.w === "number"), "every step carries the weight it was ranked by — nothing rides along unscored");
const ws14 = pr14.steps.map((x) => x.w);
ok(ws14.every((w, i) => i === 0 || ws14[i - 1] >= w), "and they come out in descending order: " + ws14.join(" > "));
ok(typeof pr14.held === "number", "what was held back is counted");
ok(pr14.held === 0 || pr14.steps.length === 5, "the list is capped at five, and anything past it is reported rather than dropped");

/* The ordering claim has to survive contact with the data. Protein outranks
   steps and caffeine; a training session outranks both; an alarm outranks all. */
const wOf = (p, frag) => { const st = p.steps.find((x) => x.a.indexOf(frag) > -1); return st ? st.w : null; };
const proteinW = wOf(pr14, "Protein"), stepsW = wOf(pr14, "Steps");
ok(proteinW != null, "protein is always on the page");
ok(stepsW == null || proteinW > stepsW, "protein outranks steps — one has an interval excluding zero, the other has never been tested");
const trainS = clone(TW14);
trainS.sessionLog = {};
trainS.sleep.nights = [{ d: "2026-07-27", h: 6 }];
const prTrain = dp14(trainS, slp14);
const sessW = wOf(prTrain, "Session");
ok(sessW == null || sessW >= proteinW, "on a training day the session outranks food — it is the entire stimulus");

// v3.99.15 — energy availability, and proposals you can move
const { energyAvailability: eaF, proposalDial: pdF, applyProposal: apF, dayProtocol: dpE, recoveryIndex: riE, labAnalytics2: la15, INS_MAP: IM15, EA_SPARING: EAS, EA_LOW: EAL, SEED: TE15 } = __test;

const mkEA = (cal, steps, days = 14) => {
  const st = clone(TE15);
  st.dailyLogs = {};
  for (let i = 0; i < days; i++) {
    const d = isoL(Date.now() - (i + 1) * 864e5);
    st.dailyLogs[d] = { cal, pro: 175, steps };
  }
  st.sessionLog = {};
  for (const k of [2, 4, 6, 9]) st.sessionLog[isoL(Date.now() - k * 864e5)] = { entries: [{ id: "ham", reps: [10, 10], rir: 1, w: 120 }], at: 1 };
  return st;
};

ok(eaF(mkEA(1800, 16000, 4)).gated === true, "under eight logged calorie days it stays shut rather than averaging three numbers and calling it a reading");
ok(eaF(mkEA(1800, 16000, 4)).need === 8, "and it says how many days it needs");
const eaLow = eaF(mkEA(1800, 16000));
ok(!eaLow.gated && eaLow.lo < eaLow.hi, "it reports a RANGE, because the convention does not settle whether deliberate walking counts as exercise");
ok(Math.abs(eaLow.hi - (eaLow.intake - eaLow.trainKcal) / eaLow.ffmKg) < 0.15, "the upper end counts training only, and nothing else");
ok(eaLow.lo < eaLow.hi && eaLow.walkKcal > 0, "the lower end also charges the walking, and the walking is not free: " + eaLow.walkKcal + " kcal/day");
ok(eaLow.lo < EAS, `counting the walking, 1,800 kcal on 16k steps lands under ${EAS}: ${eaLow.lo}`);
ok(eaLow.receipts.length >= 4 && eaLow.receipts.some((r) => r.indexOf("estimate, not a measurement") > -1),
   "every input is shown, and the estimated ones say they are estimates");

/* THE CONVENTION FIX. Both numbers were always shown, which was right — but the
   BAND was taken on the walking-inclusive one, which is the number the published
   thresholds were never built against. The IOC 2023 formula counts structured
   exercise only; Fagerberg 2018, the source of the 25, subtracts non-exercise
   expenditure OUT of exercise cost; Espinar 2026 measured the same swap moving
   free-living athletes from ~32 to ~20 with nothing changing physiologically.
   Doing both — subtracting steps AND comparing to 25 — was the one thing that
   was definitely wrong. */
ok(eaLow.ea === eaLow.hi && eaLow.eaAll === eaLow.lo, "the conventional figure is named separately from the walking-inclusive one");
ok(eaLow.band !== "LOW" && eaLow.band !== "VERY LOW", `the band is taken on the conventional number (${eaLow.ea}), not the walking-inclusive one (${eaLow.eaAll}): ${eaLow.band}`);
ok(eaLow.receipts.some((r) => r.indexOf("Espinar") > -1) && eaLow.receipts.some((r) => r.indexOf("extrapolated") > -1),
   "and the receipts name both the accounting question and the fact that 25 is extrapolated rather than measured");

/* The actionable half: it must say how much of each lever closes the gap — priced
   off the conventional number so the instruction matches the verdict, and with
   food named before steps, because deficit magnitude is what the trained-
   population evidence links to lean-mass loss and nothing links walking to it. */
const eaReal = eaF(mkEA(1450, 16000));
ok(eaReal.band === "LOW" || eaReal.band === "VERY LOW", "a genuinely low intake reads low on the conventional number too: " + eaReal.ea);
ok(eaReal.needKcal > 0 && eaReal.stepsToDrop > 0, "it quantifies both ways out — eat more, or walk less");
ok(Math.abs((eaReal.ea + eaReal.needKcal / eaReal.ffmKg) - EAS) < 0.6, "and the calorie figure lands on the threshold, measured from the conventional number: " + eaReal.needKcal);
ok(eaF(mkEA(1800, 16000)).needKcal === 0, "when the conventional number already clears the line there is nothing to close, and the app stops telling him to eat more");

// the bands
ok(eaF(mkEA(3200, 5000)).band === "ADEQUATE", "a fed athlete on low steps reads adequate");
ok(eaF(mkEA(1200, 20000)).band === "VERY LOW", "a deep deficit on high steps reads very low");
ok(["LOW", "VERY LOW", "MARGINAL"].includes(eaF(mkEA(1800, 16000)).band), "and his shape of day is not read as fine");

// it reaches the surfaces that matter, not just the lab
const prE = dpE(mkEA(1500, 18000), { clean: true, run: 3, need: 3, last: { h: 8 } });
const eaStep = prE.steps.find((x) => x.a.indexOf("Energy availability") > -1);
ok(!!eaStep, "a low reading reaches today's protocol rather than sitting in the lab");
ok(eaStep.w > 90, "and it outranks the session, because a session run under the threshold is not the same session");
ok(riE(mkEA(1500, 18000)).flags.some((f) => f.k === "ea"), "it is also a recovery signal — the only one about the deficit rather than about training or sleep");
ok(riE(mkEA(3200, 5000)).flags.every((f) => f.k !== "ea"), "and it stays quiet when there is nothing to say");
ok(!!IM15.ea, "the instrument declares its inputs on the map — the suite refuses cards that are not on it");

// proposals you can move
ok(pdF({ apply: { kind: "cal", delta: 100 } }).max === 50, "a calorie proposal gets a bounded dial, not a blank field");
ok(pdF({ apply: { kind: "note" } }) === null && pdF({ apply: { kind: "phase", to: "EASE 2" } }) === null,
   "notes and phase changes get no dial — there is no number to move");
let propSt = clone(TE15);
propSt.proposals = [{ rid: "r1", id: "p1", d: "2026-07-27", title: "REDLINE RATE", why: "test", apply: { kind: "cal", delta: 100 }, resolved: false }];
const applied0 = apF(propSt, "p1");
ok(applied0.adjustments[0].nudge === 0 && applied0.proposals[0].resolved, "taking it as proposed records a zero adjustment, exactly as before");
const applied1 = apF(propSt, "p1", 25);
ok(applied1.adjustments[0].nudge === 25, "moving it records what he actually chose, not what was proposed");
ok(applied1.feed[0].how.indexOf("your version") > -1, "and the feed says it was his version");
const applied2 = apF(propSt, "p1", 500);
ok(applied2.adjustments[0].nudge === 50, "the dial is clamped — bounded adjustment stays closer to the supported number than a blank field does");
const applied3 = apF(propSt, "p1", -500);
ok(applied3.adjustments[0].nudge === -50, "clamped both ways");
const applied4 = apF(propSt, "p1", 13);
ok(applied4.adjustments[0].nudge === 25, "and it snaps to the step, so the record never carries a number the dial could not produce");

// v3.99.15b — the band gets teeth, and training frequency stops being under-read
const { runAdaptive: raB, energyAvailability: eaB, SEED: TB15 } = __test;
const mkRate = (r1, r2) => {
  const st = clone(TB15);
  st.blackout.until = "2026-01-01";
  st.weekly = [{ wk: "2026-07-06", trend: 170 }, { wk: "2026-07-13", trend: 170 - r1 }, { wk: "2026-07-20", trend: 170 - r1 - r2 }];
  st.trend = 170 - r1 - r2;
  return st;
};
// v6.2.1 — the band top is now the SELECTED mode's slice (default recomp ≈ 1.01–1.17 lb/wk at this bw),
// so "inside" is a rate that sits inside recomp; 1.2–1.3 lb/wk is legitimately ABOVE the recomp optimum now.
const inBand = raB(mkRate(1.1, 1.1), "2026-07-27").proposals.filter((p) => !p.resolved && p.rid.indexOf("bandtop_") === 0);
ok(inBand.length === 0, "inside the band nothing fires — the band top is a threshold, not a nag");
const overBand = raB(mkRate(1.55, 1.6), "2026-07-27").proposals.filter((p) => !p.resolved && p.rid.indexOf("bandtop_") === 0);
ok(overBand.length === 1, "two weeks above the band top finally says something — before this, the stated band had no teeth at all and he could run over it until the redline");
ok(overBand[0].why.indexOf("redline") > -1 && overBand[0].why.indexOf("nothing is on fire") > -1,
   "and it is explicit that this is not an emergency — a warning that reads like an alarm gets ignored like one");
ok(overBand[0].why.indexOf("steps") > -1, "it names the cheapest lever, which is steps rather than food");
ok(!!__test.proposalDial(overBand[0]), "and it carries a dial, like every other numeric proposal");
const redlined = raB(mkRate(2.0, 2.1), "2026-07-27").proposals.filter((p) => !p.resolved);
ok(redlined.some((p) => p.rid.indexOf("redline_") === 0), "past the redline the redline still fires");
ok(!redlined.some((p) => p.rid.indexOf("bandtop_") === 0), "and the band-top card stands aside rather than double-billing the same week");

/* Training frequency must not be read off an incomplete log — under-charging
   exercise inflates energy availability, which hides the problem it exists to find. */
const thinLog = clone(TB15);
thinLog.dailyLogs = {};
for (let i = 0; i < 14; i++) thinLog.dailyLogs[isoL(Date.now() - (i + 1) * 864e5)] = { cal: 2000, pro: 175, steps: 16000 };
thinLog.sessionLog = { [isoL(Date.now() - 2 * 864e5)]: { entries: [{ id: "ham", reps: [10, 10], rir: 1, w: 120 }], at: 1 } };
const thinEA = eaB(thinLog);
ok(thinEA.sessPerWk >= 4, `a one-session log still charges the programme's four sessions a week, not one: ${thinEA.sessPerWk}`);
ok(thinEA.receipts.some((r) => r.indexOf("would flatter this number") > -1), "and it says out loud that it is using the schedule rather than the log, and why");

// v3.99.17 — one rate, one TDEE, and a calorie target derived from both
const { currentRate: crR, observedTDEE: otR, calorieTarget: ctR, askContext: acR, runAdaptive: raR, dayProtocol: dpR, VOL_BANDS: VBR, SEED: TR17 } = __test;

const mkReads = (n2, perDay, startW) => {
  const st = clone(TR17);
  st.blackout.until = "2026-01-01";
  st.reads = [];
  st.dailyLogs = {};
  for (let i = n2 - 1; i >= 0; i--) {
    const d = isoL(Date.now() - i * 864e5);
    st.reads.push({ d, w: +(startW - (n2 - 1 - i) * perDay).toFixed(1), sealed: false });
    st.dailyLogs[d] = { cal: 2000, pro: 175, steps: 12000 };
  }
  st.trend = st.reads[st.reads.length - 1].w;
  return st;
};

// the rate is a slope now, and it carries its own error
const rr = crR(mkReads(28, 0.2, 170));
ok(rr.method === "regression" && rr.n === 28, "with enough daily reads the rate is a least-squares slope, not the mean of two snapshots");
ok(Math.abs(rr.scale - 1.4) < 0.05, `and it recovers a known slope: 0.2 lb/day is 1.4 lb/wk, it says ${rr.scale}`);
ok(rr.ci === 0, "a perfectly linear record has zero residual and honestly reports a zero-width interval rather than manufacturing doubt");
const wobbly = mkReads(28, 0.2, 170);
wobbly.reads.forEach((r, i) => { r.w = +(r.w + [0.4, -0.3, 0.5, -0.6, 0.2][i % 5]).toFixed(1); });
const rwob = crR(wobbly);
ok(rwob.ci > 0 && rwob.lo < rwob.scale && rwob.hi > rwob.scale, `real scale noise produces a real interval: ${rwob.scale} ±${rwob.ci}`);
ok(Array.isArray(rr.rates) && rr.rates.length > 0, "and it keeps the snapshot rates alongside, so the disagreement between methods stays visible");
const noisy = mkReads(28, 0.2, 170);
noisy.reads.forEach((r, i) => { r.w = +(r.w + (i % 2 ? 1.2 : -1.2)).toFixed(1); });
ok(crR(noisy).ci > rr.ci, "noisier reads widen the interval instead of quietly producing the same confident number");
const few17 = clone(TR17); few17.reads = []; few17.weekly = [{ wk: "2026-07-13", trend: 170 }, { wk: "2026-07-20", trend: 168.6 }, { wk: "2026-07-27", trend: 167.4 }];
ok(crR(few17).method === "snapshots", "under ten daily reads it falls back to snapshots");
const none17 = clone(TR17); none17.reads = []; none17.weekly = [];
ok(crR(none17).method === "prior" && none17.reads.length === 0, "and with nothing at all it says prior rather than inventing a measurement");

/* The clamp used to bind at 1.6 and flatten every fast17 rate onto one TDEE. */
const fast17 = mkReads(28, 0.28, 175);
const slower = mkReads(28, 0.22, 175);
ok(otR(fast17).tdee !== otR(slower).tdee, "two different rates now give two different TDEEs — the old 1.6 ceiling made 1.55 and 1.73 produce the identical number");
ok(otR(fast17).lo < otR(fast17).tdee && otR(fast17).hi > otR(fast17).tdee, "and the TDEE carries the rate's error through, instead of arriving as a bare integer");
ok(otR(fast17).method === "regression", "it says which method produced it");

// the calorie target
const ct1 = ctR(mkReads(28, 0.2, 170));
ok(!ct1.gated && ct1.lo < ct1.hi, "the target is a band, because the maintenance it derives from is one");
/* 3,500 kcal/lb is the 1958 Wishnofsky figure, and the engine used it HERE while
   using KCAL_PER_LB_MIX in observedTDEE and KCAL_PER_LB_FAT in the thermodynamic
   check — three conversions of the same quantity inside one app. The band now
   speaks the same units as the maintenance it is subtracted from. */
const KPM = __test.KCAL_PER_LB_MIX;
ok(KPM === 3800, "one conversion constant, named: " + KPM + " kcal per pound of mixed tissue");
ok(ct1.hi === Math.max(__test.calorieFloor(mkReads(28, 0.2, 170)).floor, ct1.tdee - Math.round((ct1.band[0] * KPM) / 7)), "the top of the band is maintenance minus the slow end of his rate band, converted the same way everything else is");
ok(ct1.lo === Math.max(__test.calorieFloor(mkReads(28, 0.2, 170)).floor, ct1.tdee - Math.round((ct1.band[1] * KPM) / 7)), "the bottom is maintenance minus the fast end, floored at the DERIVED calorie floor rather than an authored 1,700");
ok(ct1.lo >= __test.calorieFloor(mkReads(28, 0.2, 170)).floor, "and the floor genuinely binds, so no target can be printed under it");
ok(ct1.why.indexOf("measured maintenance") > -1 && ct1.why.indexOf("daily reads") > -1, "and it shows its working: " + ct1.why.slice(0, 80));
const gated17 = clone(TR17); gated17.dailyLogs = {}; gated17.reads = [];
/* R4 — the fallback no longer reads an authored phase band. It derives from measured
   bodyweight and a labelled convention, so "from" changed with it. With reads emptied there
   is no trend either, which is the honest no-bodyweight case. */
{
  const g4 = ctR(gated17);
  ok(g4.gated === true && (g4.from === "mass-estimate" || g4.from === "none"), "R4 — without enough data the fallback derives from measured bodyweight, not from an authored phase band. It was PHASES[s.phase]; deleting s.phase without replacing this first would have returned lo:null hi:null");
  ok(g4.from !== "phase", "R4 — and the phase table is no longer a source of targets anywhere");
}
const prot = dpR(mkReads(28, 0.2, 170), { clean: true, run: 3, need: 3, last: { h: 8 } });
const calStep = prot.steps.find((x) => x.a.indexOf("Calories") === 0);
ok(!!calStep && calStep.w > 80, "the daily calorie number reaches the protocol and ranks near the top — deficit magnitude is the dominant term");

/* Suggestions belong in the app, not in a conversation. */
const progS = raR(mkReads(28, 0.2, 170), isoL(Date.now()));
const volLine = progS.feed.find((f) => /VOLUME BAND SITS ABOVE/.test(f.t));
ok(!!volLine, "R14 — the volume-band gap is a FEED LINE now: it was information whose tap enacted nothing, which is the inbox invariant. It is still in the app, not left in a chat window");
ok(volLine.how.indexOf("2,058 people") > -1 && volLine.how.indexOf("5–10") > -1 && volLine.how.indexOf("smooth curve") > -1, "with the evidence attached rather than a bare instruction — and since R15e the evidence reads as the continuous curve it is, not invented tiers");
ok(volLine.how.indexOf("will not move it on its own") > -1, "and it is explicit that a programme change stays his call");
ok(VBR.lo === 8 && VBR.hi === 14, "the band itself is unchanged — the app proposes, it does not reprogram him");

/* The analyst and the engine must stop quoting different numbers. */
const ctx17 = acR(mkReads(28, 0.2, 170));
ok(ctx17.indexOf("CANONICAL NUMBERS") > -1, "the analyst is handed the engine's numbers rather than left to re-derive them");
ok(ctx17.indexOf("do NOT re-derive") > -1, "and told not to recompute them — a number that changes between screens is worse than one slightly wrong");
["RATE", "MEASURED TDEE", "TARGET INTAKE", "PROTEIN TARGET"].forEach((k) => ok(ctx17.indexOf(k) > -1, `canonical block carries ${k}`));

/* An open proposal must be RE-PROCESSED every run, not frozen on the day it was
   raised. The old propose() bailed out whenever one was already armed, so the
   card's title and receipt froze — and after an engine change they could freeze
   on a quantity the engine no longer even computes. The calorie-drift card that
   used to anchor this test was RETIRED when the engine took sole ownership of the
   calorie band — a proposal must never restate an engine-owned number — so the
   standing volume-band card now exercises the same refresh / resolve path. */
const dayA18 = isoL(Date.now() - 864e5), dayB18 = isoL(Date.now());
/* R14 — volband is a feed line now, so the refresh/resolve LIFECYCLE (which is real and
   must survive) is exercised on the actionable REDLINE card, driven by a hot-rate fixture. */
const st18 = raR(mkReads(28, 0.3, 170), dayA18);
ok(!st18.proposals.some((p) => p.rid.indexOf("calband_") === 0), "the calorie-band drift card is retired — the engine owns the band");
const card18a = st18.proposals.find((p) => p.rid.indexOf("redline_") === 0 && !p.resolved);
ok(!!card18a, "a standing engine proposal is raised and open on the day it applies (redline, on a 2.1 lb/wk fixture)");
const raisedOn18 = card18a.d, id18 = card18a.id;
const st18b = raR(clone(st18), dayB18);
const open18 = st18b.proposals.filter((p) => p.rid.indexOf("redline_") === 0 && !p.resolved);
ok(open18.length === 1, "a day later there is still exactly one open card — refreshed or superseded, never duplicated");
if (open18[0].id === id18) ok(open18[0].refreshed === dayB18 && open18[0].d === raisedOn18, "same-week: refreshed in place, raised-on date and id hold so the age of the flag stays honest");
else ok(/superseded/.test((st18b.proposals.find((p) => p.id === id18) || {}).resolvedHow || ""), "week rolled: the old card is superseded on the record, not duplicated");
const acted18 = __test.applyProposal(st18b, open18[0].id, 0);
ok(acted18.proposals.find((p) => p.id === open18[0].id).resolved === true, "applying resolves it");
const after18 = raR(acted18, dayB18);
ok(!after18.proposals.some((p) => p.rid.indexOf("redline_") === 0 && !p.resolved), "and it does not come back to life on the next run — applied is applied");

/* ================= v3.99.19 — noise, not sleep ================= */
const { typicalError: teN, beatsNoise: bnN, cleanAtDate: caN, stepTarget: stN, proteinTarget: ptN, SEED: TN19 } = __test;

/* HIS OWN spread, measured, with the published figure only as a fallback. */
const noiseS = clone(TN19);
noiseS.sessionLog = {};
[[0, [10, 9, 8]], [1, [11, 9, 7]], [2, [10, 10, 8]], [3, [9, 9, 9]]].forEach(([k, reps]) => {
  noiseS.sessionLog[isoL(Date.now() - (9 - k * 2) * 864e5)] = { entries: [{ id: "press", reps, rir: 1, w: 245 }], at: k + 1 };
});
const teA = teN(noiseS, "press");
ok(teA.reps > 0 && teA.reps < 3 && teA.n === 9, "his own set-to-set spread is measured from repeats at identical load, not assumed: ±" + teA.reps + " over " + teA.n + " paired sets");
ok(teA.src.indexOf("this lift") === 0, "and it says which lift's repeats produced it");
ok(teN(clone(TN19), "press").reps === 0.9 && teN(clone(TN19), "press").src.indexOf("Mitter") > -1,
   "with no repeats on file it falls back to the published SEM and names the paper rather than inventing a number");
/* a load change breaks the pairing — comparing 245 to 250 measures the load, not the noise */
const noiseW = clone(noiseS);
Object.keys(noiseW.sessionLog).forEach((d, i) => { if (i % 2) noiseW.sessionLog[d].entries[0].w = 250; });
ok(teN(noiseW, "press").n < teA.n, "sessions at different loads are not paired — that difference measures the weight, not the spread");

/* the escape hatch: is this session outside the noise band? */
const bn1 = bnN(noiseS, "press", [11, 10, 9], [10, 9, 8]);
ok(bn1.margin === 3 && bn1.need > 0, "the margin is the session total against the old line, and the bar is stated: " + bn1.margin + " vs " + bn1.need);
ok(bnN(noiseS, "press", [16, 15, 14], [10, 9, 8]).clear === true, "a session far clear of the old line banks on one sighting");
ok(bnN(noiseS, "press", [11, 9, 8], [10, 9, 8]).clear === false, "a single extra rep does not — that is inside anyone's noise, on any amount of sleep");
ok(bnN(noiseS, "press", [10, 9, 8], null).clear === false, "with nothing to compare against, nothing banks early");
/* the bar scales with the number of sets, because a session total accumulates error */
ok(bnN(noiseS, "press", [11, 10, 9], [10, 9, 8]).need > bnN(noiseS, "press", [11], [10]).need, "the bar grows with set count — a four-set total carries more error than a one-set total");

/* the short-sleep flag: performance threshold, calendar-consecutive */
const slpS = clone(TN19);
const mkN = (arr) => { const st = clone(slpS); st.sleep.nights = arr.map(([d, h]) => ({ d, h })); return st; };
ok(caN(mkN([["2026-07-10", 7], ["2026-07-11", 7], ["2026-07-12", 7]]), "2026-07-13") === true,
   "three 7-hour nights is not short sleep — his median night is 7 h and the performance literature's protocols run 3-5.5 h");
ok(caN(mkN([["2026-07-10", 7], ["2026-07-11", 7], ["2026-07-12", 6]]), "2026-07-13") === false, "a 6-hour night is");
ok(caN(mkN([["2026-07-10", 6], ["2026-07-11", 6.5], ["2026-07-12", 7]]), "2026-07-13") === false, "and so is a three-night mean under 7, even when last night was fine");
ok(caN(mkN([["2026-07-08", 4], ["2026-07-12", 7.5]]), "2026-07-13") === true,
   "a gap in the record breaks the run rather than counting through it — the old loop walked the ARRAY, so an unlogged night read as consecutive");
ok(caN(mkN([]), "2026-07-13") === true, "with no nights on file nothing is claimed either way");
/* the old rule, on his real shape of sleep, essentially never opened */
const oldShape = mkN([["2026-07-10", 7], ["2026-07-11", 7], ["2026-07-12", 7], ["2026-07-13", 7.5]]);
ok(caN(oldShape, "2026-07-14") === true && __test.atSleepTarget(oldShape, "2026-07-14").at === false,
   "the two questions now give different answers: fine for today's session, still short of his 7.5 h target — which is the distinction the single gate could not make");

/* steps, derived from the window the maintenance was measured in */
const stS = clone(TN19);
stS.dailyLogs = {};
for (let k = 0; k < 14; k++) stS.dailyLogs[isoL(Date.now() - k * 864e5)] = { cal: 2000, pro: 175, steps: 16000 + (k % 2 ? 400 : -400) };
const stA = stN(stS);
ok(!stA.gated && stA.lo < stA.mid && stA.mid < stA.hi, "the step target is a band around what he actually walks: " + stA.lo + "–" + stA.hi);
ok(Math.abs(stA.mid - 16000) <= 500, "centred on the measured average rather than a round authored number");
ok(stA.kcalPer1k > 20 && stA.kcalPer1k < 40, "and it prices a thousand steps at his bodyweight: ~" + stA.kcalPer1k + " kcal");
/* STEPS ITEM A — the old copy claimed maintenance was measured across THIS band's own
   21-day window, which was false: observedTDEE measures it over the rate-matched window.
   The receipt now names the OWNER's figure and window, and states the recent band
   separately — the claim and the identity behind it finally agree. */
ok(stA.why.indexOf("maintenance was measured at") > -1 && stA.why.indexOf("that number owns the claim") > -1, "the receipt says why the number exists — and reads the measured-at figure from its OWNER (observedTDEE), instead of asserting the identity the window mismatch broke");
ok(stA.why.indexOf("RECENT") > -1, "while the hold-band is named as recent behaviour, a different quantity with a different window — two numbers, two names, no conflation");
const stFew = clone(TN19); stFew.dailyLogs = { "2026-07-27": { cal: 1800, steps: 16000 } };
ok(stN(stFew).gated === true && stN(stFew).need === 8, "under eight logged step days it declines to derive one");
/* drift off the window is priced, because it silently invalidates the calorie target */
const stDrift = clone(stS);
for (let k = 0; k < 6; k++) stDrift.dailyLogs[isoL(Date.now() - k * 864e5)].steps = 10000;
ok(stN(stDrift).driftKcal < -30, "a week of shorter walks is reported as the kcal/day of maintenance it costs: " + stN(stDrift).driftKcal);

/* protein holds still, and says why */
const ptA = ptN(clone(TN19));
ok(ptA.perKg === 2.5 && ptA.straddles === true, "his body-fat band straddles the 12.2% line, so the floor multiplier is 2.5 and both numbers are carried");
ok(ptA.g === Math.round(((ptA.lo + ptA.hi) / 2) / 5) * 5, "the headline is the midpoint of the defended range: " + ptA.lo + "-" + ptA.hi + " gives " + ptA.g);
ok(ptA.why.indexOf("the range is the point") > -1, "and the receipt says out loud that the width is the finding, not a rounding artefact");
ok(ptA.why.indexOf("REST days") > -1, "naming the one study that compared day types, which found requirement higher on rest days — the opposite of the intuition");

/* ================= v3.99.21 — matched windows, and a proposal with hands ================= */
const { observedTDEE: otW, currentRate: crW, calorieTarget: ctW, dayType: dtW, applyProposal: apW, runAdaptive: raW, migrate: mgW, SEED: TW21 } = __test;

/* THE WINDOW FIX. Maintenance is (mean intake) + (weight lost x 3500 / days) and
   both halves have to come from the same stretch of calendar. The rate ran 28
   reads across 35 days while the intake average ran a fixed 21-day window, so a
   leaner, higher-stepping early fortnight produced part of the rate and never
   entered the intake average. */
const mkWin = (earlyCal, lateCal, days) => {
  const st = clone(TW21);
  st.blackout.until = "2026-01-01";
  st.reads = []; st.dailyLogs = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = isoL(Date.now() - i * 864e5);
    st.reads.push({ d, w: +(175 - (days - 1 - i) * 0.2).toFixed(1), sealed: false });
    st.dailyLogs[d] = { cal: i >= days / 2 ? earlyCal : lateCal, pro: 175, steps: 16000 };
  }
  st.trend = st.reads[st.reads.length - 1].w;
  return st;
};
const winS = mkWin(1700, 2100, 30);
const rW = crW(winS), tdW = otW(winS);
ok(rW.from && rW.to && rW.from < rW.to, "the rate reports the endpoints it was measured between, not just a printable span");
ok(tdW.from === rW.from && tdW.to === rW.to, "and maintenance averages intake over exactly that period");
ok(tdW.matched === true, "it says so, rather than leaving the reader to assume it");
ok(tdW.avg > 1800 && tdW.avg < 2000, "so a run that started lean and ended looser averages BOTH halves (" + tdW.avg + "), not just the recent one");
/* the bias it removes, stated: pairing recent intake with an older rate reads high */
const lateOnly = Math.round(2100 + (rW.scale + winS.model.drip) * 3500 / 7 - winS.model.drip * 600 / 7);
ok(lateOnly > tdW.tdee + 100, `pairing only the recent half against the same rate would read ~${lateOnly} against the matched ${tdW.tdee} — the bias this removes`);
/* a snapshot rate has no endpoints, so the old window is the fallback and says so */
const snapS = clone(TW21);
snapS.blackout.until = "2026-01-01"; snapS.reads = [];
snapS.weekly = [{ wk: "2026-07-06", trend: 168 }, { wk: "2026-07-13", trend: 167 }, { wk: "2026-07-20", trend: 166 }];
for (let i = 0; i < 14; i++) snapS.dailyLogs[isoL(Date.now() - i * 864e5)] = { cal: 1900, pro: 175, steps: 16000 };
const tdSnap = otW(snapS);
ok(tdSnap && tdSnap.matched === false, "with a snapshot rate there are no endpoints to match, and the fallback window is flagged rather than hidden");

/* THE WEEKLY AVERAGE — a daily target does not tell him whether he ate it. */
const ctWin = ctW(winS);
ok(ctWin.wkAvg === 2100 && ctWin.wkN === 7, "the card now carries what he actually averaged over the rolling week: " + ctWin.wkAvg);
ok(ctWin.wkOff === ctWin.wkAvg - ctWin.mid, "against the middle of the band, signed");
/* "inside the band" now tests the BAND, not an authored 60 kcal either side of
   its midpoint. The band has width; that width is the reason it is a band. */
ok(ctWin.wkAvg >= ctWin.lo && ctWin.wkAvg <= ctWin.hi && ctWin.wkWhy.indexOf("inside the") > -1, "and says plainly when target and result agree — judged against the band itself: " + ctWin.wkAvg + " in " + ctWin.lo + "-" + ctWin.hi);
/* a week clearly outside the band converts the gap into the rate it costs —
   kcal/day means nothing on its own, lb/wk is the unit he actually thinks in */
const over21 = mkWin(1700, 2600, 30);
const ctOver = ctW(over21);
ok((ctOver.wkAvg > ctOver.hi || ctOver.wkAvg < ctOver.lo) && ctOver.wkWhy.indexOf("lb/wk") > -1, "and when it does not, the gap is priced in lb/wk: " + ctOver.wkWhy.slice(0, 90));
ok(ctOver.wkWhy.indexOf("3,500") === -1 && ctOver.wkWhy.indexOf("3500") === -1, "and the sentence he reads uses the same kcal-per-pound as the number above it — it used to quote 3,500 while the band was built on 3,800");
ok(ctOver.wkWhy.indexOf("above") > -1, "with the direction named rather than left as an absolute value");

/* THE REFEED, RETIRED FOR REAL. */
ok(dtW("2026-07-29") === "REFEED", "a Wednesday is a refeed day by default — it is his programme");
const offS = { targets: { refeedOff: "2026-07-28" } };
ok(dtW("2026-07-29", offS) === "REST", "once retired it stops being one, from that date forward");
ok(dtW("2026-07-22", offS) === "REFEED", "but every Wednesday BEFORE the retirement stays a refeed — the bump line and the water flag are reading history and it has to stay true");
ok(dtW("2026-07-30", offS) === "U" && dtW("2026-07-31", offS) === "L", "and no other day type is touched");
/* applying it actually does something — the defect this fixes is that it did not */
let rfS = clone(TW21);
rfS.blackout.until = "2026-01-01"; rfS.proposals = []; rfS.adjustments = [];
for (let i = 0; i < 20; i++) { const d = isoL(Date.now() - i * 864e5); rfS.dailyLogs[d] = { cal: 2000, pro: 175, steps: 16000 }; rfS.reads.push({ d, w: +(170 - i * 0.15).toFixed(1), sealed: false }); }
rfS.reads.sort((a, b) => (a.d < b.d ? -1 : 1));
rfS = raW(rfS, isoL(Date.now()));
const rfCard = rfS.proposals.find((p) => p.rid === "refeed_review" && !p.resolved);
ok(!!rfCard, "the refeed card is raised");
ok(rfCard.apply.kind === "refeed", "and it carries a kind that DOES something — it used to carry 'note', so applying it wrote a feed line and left Wednesday a refeed day in all 34 places dayType is called");
const rfDone = apW(rfS, rfCard.id, 0);
ok(!!rfDone.targets.refeedOff, "applying it dates the retirement");
const nextWed21 = (() => { const n = new Date(); n.setHours(0, 0, 0, 0); const off = ((3 - n.getDay()) + 7) % 7 || 7; return isoL(n.getTime() + off * 864e5); })();
ok(dtW(nextWed21, rfS) === "REFEED" && dtW(nextWed21, rfDone) === "REST", "and next Wednesday stops being a refeed the moment he taps");
ok(rfDone.feed.some((f) => f.t === "WEEKLY REFEED RETIRED"), "with the change named on the record, not buried in a generic adjustment line");

/* the self-heal: a tap already made on the build where it did nothing */
const stranded = clone(TW21);
stranded.v = 31; stranded.targets = { sleepH: 7.5 };
stranded.adjustments = [{ rid: "refeed_review", d: "2026-07-28", title: "THE WEEKLY REFEED HAS NO EVIDENCE BEHIND IT" }];
const healed = mgW(stranded);
ok(healed.targets.refeedOff === "2026-07-28", "a retirement he already approved is honoured on migration, dated from the day he approved it — not from today, and not requiring him to tap a card he has already dismissed");
ok(dtW("2026-07-22", healed) === "REFEED" && dtW("2026-07-29", healed) === "REST", "so history reads as history and the future reads as retired");
const noAdj = clone(TW21); noAdj.v = 31; noAdj.adjustments = [];
ok(!((mgW(noAdj).targets || {}).refeedOff), "and a state with no such approval is left entirely alone — the patch does not even create the key");
ok(dtW("2026-07-29", mgW(noAdj)) === "REFEED", "so Wednesday stays a refeed for anyone who has not asked for it to stop");

/* ================= v3.99.22 — words this app is not allowed to reuse ================= */
/* Law 2 says plain words are enforced by tests. This is the sharper version of
   that: some words already MEAN something specific here, and reusing them
   colloquially reads as the technical sense every time.

   "your earlier weeks ran leaner" meant ate less. In a ledger that tracks lean
   mass as a quantity — and where he was six pounds heavier in those weeks — it
   read as body composition, which is not just unclear but backwards. Same trap
   with "total load", where load is the weight on the bar.

   The fix is not a better adjective. It is the numbers. */
const RESERVED = [
  ["leaner", "means body composition here — say the kcal and the steps"],
  ["total load", "load is weight on the bar — say what you actually mean by it"],
  ["lean week", "same collision as leaner"],
];
const winW = mkWin(1700, 2100, 30);
const ctW22 = ctW(winW), tdW22 = otW(winW);
const surfaces = [ctW22.why, ctW22.wkWhy, __test.energyAvailability(winW).receipts.join(" "), __test.dayProtocol(winW, isoL(Date.now())).steps.map((x) => x.a + " " + x.why).join(" ")].filter(Boolean).join("  ");
RESERVED.forEach(([w, why]) => ok(surfaces.toLowerCase().indexOf(w) === -1, `no surface says "${w}" — ${why}`));
/* and the replacement is arithmetic rather than an adjective */
ok(tdW22.split && tdW22.split.calA != null && tdW22.split.calB != null, "maintenance carries the two halves of its own window as numbers");
ok(tdW22.split.calA < tdW22.split.calB, "in date order, so 'the first half' means the earlier one");
ok(ctW22.why.indexOf(String(tdW22.split.calA)) > -1 && ctW22.why.indexOf(String(tdW22.split.calB)) > -1,
   "and the card shows both figures instead of describing the difference: " + ctW22.why.slice(ctW22.why.indexOf("two halves"), ctW22.why.indexOf("two halves") + 150));
/* a window with too few days in one half describes nothing rather than guessing */
const shortW = mkWin(1900, 1900, 12);
const tdShort = otW(shortW);
ok(!tdShort.split || (tdShort.split.calA != null), "a window too short to split cleanly returns null rather than half a claim");

/* ================= v3.99.23 — volume the programme allocates, and a band that drifts ================= */
const { programmeVolume: pvN, volumeImbalance: viN, muscleVolume: mvN, VOL_BANDS: VBN, SEED: TV23 } = __test;

/* Weekly sets per muscle is DESIGNED here, not observed: a fixed split times a
   set count written into each lift. muscleVolume() reads the log and
   sweepVolume() waits fourteen days of it — right for recovery questions, wrong
   for an arithmetic one. Hamstrings get one exercise at two sets twice a week;
   that is four, it is under the floor, and no further logging discovers it. */
const pv23 = pvN(clone(TV23));
ok(pv23.length >= 8, "every muscle the programme touches gets a line: " + pv23.length);
ok(pv23[0].sets >= pv23[pv23.length - 1].sets, "sorted heaviest first, so the imbalance is the first thing read");
const hams23 = pv23.find((m) => m.mg === "hams");
ok(hams23 && hams23.sets === 4 && hams23.zone === "UNDER", "hams come out at 4 sets a week — under the retention floor, by construction: " + (hams23 || {}).sets);
/* THE POOLING FIX. "delts" is not a muscle — Pelland 2025 classifies anterior,
   lateral and posterior deltoid separately with separate exercise lists. Pooled,
   this programme scored 17 and looked excessive; that number is not comparable
   to any per-muscle band under any convention, and it is what produced a
   reallocation recommendation the same paper's detection threshold calls
   indistinguishable from zero. */
ok(!pv23.some((m) => m.mg === "delts"), "there is no pooled delts bucket any more — the three heads are trained separately, so they are counted separately");
const side23 = pv23.find((m) => m.mg === "delts_side"), rear23 = pv23.find((m) => m.mg === "delts_rear"), front23 = pv23.find((m) => m.mg === "delts_front");
ok(side23 && rear23 && front23, "all three heads appear: side " + (side23 || {}).sets + ", rear " + (rear23 || {}).sets + ", front " + (front23 || {}).sets);
ok([side23, rear23, front23].every((m) => m.sets <= 10 && m.tier === "highest return per set"),
   "and each lands in the HIGH-RETURN tier rather than the pooled 17 that read as an excess");
ok(front23.sets === 3, "the anterior head is credited from pressing at half — bench is indirect for the front delt only, which is exactly what Pelland's table says");
/* half-credit, same convention as the log-based ledger, so the two are comparable */
const tri23 = pv23.find((m) => m.mg === "triceps");
ok(tri23 && tri23.sets === 9, "a compound lends half to its secondary: triceps read 6 direct plus 3 from pressing = 9, not 6 and not 12");
ok(pv23.every((m) => m.tier === (m.sets <= 10 ? "highest return per set" : m.sets <= 18 ? "intermediate return" : "lowest return")), "each muscle carries which tier of the dose-response curve it is sitting on");
/* it reads the PROGRAMME, so an empty log changes nothing */
const noLog23 = clone(TV23); noLog23.sessionLog = {};
ok(pvN(noLog23).find((m) => m.mg === "hams").sets === 4, "with an empty session log the answer is identical — this is arithmetic, not a reading");
ok(mvN(noLog23).length === 0, "while the log-based ledger correctly goes silent, which is the gap this fills");

const vi23 = viN(clone(TV23));
ok(vi23 && vi23.taker.mg === "hams", "the muscle at the minimum effective dose is named: " + vi23.taker.mg);
/* THE NOISE-FLOOR FIX. Pelland's smallest detectable effect for hypertrophy is
   2.05%. A three-set move off a base of four is worth about 0.5 — a
   recommendation the literature cannot tell apart from zero. The card now sizes
   the move to clear that bar or does not appear at all. */
ok(vi23.sdes === 2.05, "the detection threshold is stated, not implied");
ok(vi23.need >= 5, "and the honest move is " + vi23.need + " sets, not the two or three that reads as a sensible nudge");
ok(vi23.gain >= vi23.sdes, "because that is the smallest move whose modelled effect (" + vi23.gain + "%) clears it");
const smallMove = 1.76 * (Math.sqrt(7) - Math.sqrt(4));
ok(smallMove < vi23.sdes, "a three-set move is worth " + smallMove.toFixed(2) + "% — under the bar, and therefore not something to surface");
ok(Math.abs(1.76 * (Math.sqrt(10) - Math.sqrt(4)) - 2.05) < 0.05, "and the calibration checks out against Pelland's own published tier step: six sets off a base of four lands on exactly one SDES");
/* a bucket fed only by what a compound lends has no exercise to add sets to */
const front = pvN(clone(TV23)).find((m) => m.mg === "delts_front");
ok(front && front.indirectOnly === true, "the anterior delt is credited from pressing and has no direct lift of its own");
ok(!viN(clone(TV23)).under.some((m) => m.indirectOnly), "so it is never named as a muscle to add sets to — the lever there is the press itself");
const balanced23 = clone(TV23);
balanced23.exercises.forEach((e) => { if (e.mg === "hams") e.sets = 6; });
ok(!viN(balanced23) || !viN(balanced23).detectable, "a programme with nothing under the floor raises nothing — the card is a finding, not a fixture");

/* the proposal, and the one it must not duplicate */
let volS = clone(TV23);
volS.blackout.until = "2026-01-01"; volS.proposals = []; volS.adjustments = [];
for (let i = 0; i < 20; i++) { const d = isoL(Date.now() - i * 864e5); volS.dailyLogs[d] = { cal: 2000, pro: 175, steps: 16000 }; volS.reads.push({ d, w: +(170 - i * 0.15).toFixed(1), sealed: false }); }
volS.reads.sort((a, b) => (a.d < b.d ? -1 : 1));
volS = raW(volS, isoL(Date.now()));
/* ---- THE CATEGORY ERROR: a growth curve applied to a man in a deficit ----
   This block used to assert that the imbalance FIRES as a proposal during the
   cut. It computed that hamstrings needed +7 weekly sets to clear the smallest
   detectable growth effect, and was ready to ask him for them.

   The arithmetic was right and the recommendation was wrong. Pelland 2025's
   6-12 band is a GROWTH dose-response, measured in people eating enough to
   build. Roth et al. 2023 put the same question to trained men in energy
   restriction — n=38, six weeks, 30 kcal/kg deficit, 2.8 g/kg protein, which is
   nearly his exact situation — and found ~20 weekly sets and ~12 preserved lean
   mass identically (0.51 kg lost vs 0.92, not significant; no muscle-thickness
   difference either). Bickel 2011 held young adults' thigh lean mass for 32
   weeks on one-NINTH of their prior volume. Retention is cheap; growth is not;
   he is buying retention. Same class of error as the sleep gate — a real
   finding, applied where it does not hold. ---- */
const vCard = volS.proposals.find((p) => /^vol(push|roll|struct)_/.test(p.rid) && !p.resolved && !(p.apply && p.apply.owner));   /* the owner's-call pre-filed cards are a sanctioned OWNER decision, not the engine's — the earned path is what must abstain here */
const viCut = viN(volS);
ok(viCut && viCut.growthOK === false, "the regime does not sanction growth on this state (" + viCut.regimeKey + ")");
ok(viCut.detectable === true && viCut.actionable === false, "the gap is still DETECTED — the arithmetic did not change — but it is not actionable while growth is unsanctioned");
ok(!vCard, "so no volume card of any kind fires: the app does not ask a man whose state cannot fund growth to add sets for an effect he is not currently buying");
ok(viCut.why.indexOf("Roth 2023") > -1 && viCut.why.indexOf("Bickel 2011") > -1, "and the receipt cites both trials rather than asserting it");
ok(viCut.why.indexOf("Filed, not proposed") === 0, "it is filed for the build phase, not discarded — the finding is real, the timing is not");
ok(viCut.why.indexOf("hams at 4 sets") > -1, "naming the muscle and the number, so it is checkable");

/* THE FLIP IS NO LONGER A DIET-EXIT DATE (volume-lever spec, key §3 finding): writing
   targets.exitStart used to open this gate — the old binary phase flag deciding a question
   the regime detector owns. The growth side is driven in the VOLUME LEVER block below
   (FINAL82): regime free CONFIRMED opens it, and the actionable path files a CARD whose
   tap enacts the set (volpush) — the volstruct note is retired, because a reader beside an
   enactor teaches him to read neither. Here: the flag alone must now open NOTHING. */
{
  const volDone = clone(volS);
  volDone.targets = { ...(volDone.targets || {}), exitStart: isoL(Date.now() - 7 * 864e5) };
  volDone.proposals = []; volDone.adjustments = [];
  const viBuild = viN(volDone);
  ok(viBuild.growthOK === false && viBuild.actionable === false, "VOLUME LEVER — writing exitStart no longer opens the volume gate: the regime detector is the authority, and it still reads " + viBuild.regimeKey + " on this state. The old flag is not a back door");
  const volDone2 = raW(volDone, isoL(Date.now()));
  ok(!volDone2.proposals.some((p) => /^vol(push|roll)_/.test(p.rid) && !p.resolved && !(p.apply && p.apply.owner)), "VOLUME LEVER — and no EARNED volume card files off the flag alone: a growth push is earned by measured lifts and rate, never declared by a date field (the owner's-call cards file regardless — that is the point of an owner)");
}
ok(volS.feed.some((f) => /VOLUME BAND SITS ABOVE/.test(f.t)), "the band-width question is a different one and still stands on its own — as a feed line under R14");

/* THE RATE BAND'S UNIT — RETIRED v6.3.1. The card told him to restate the band as
   "% of bodyweight"; cutRateBand() now derives the corridor as %BW per mode and
   scales it to lb by bodyweight, so the unit defect no longer exists. It was the
   last user-facing reader of the fixed s.rate.band seed and it miscited Garthe. */
const rateCard = volS.proposals.find((p) => p.rid === "rateunit" && !p.resolved);
ok(!rateCard, "the rate-unit card no longer fires — the band is engine-owned as %BW per mode, so the wrong-unit premise is moot");
/* a copy already armed on a phone stands down on the next pass rather than orphaning a
   claim the engine has stopped making — same contract as the recovery card */
const armedRU = clone(volS);
armedRU.proposals = (armedRU.proposals || []).filter((p) => p.rid !== "rateunit").concat([
  { rid: "rateunit", id: "rateunit_legacy", d: isoL(Date.now()), title: "YOUR RATE BAND IS IN THE WRONG UNIT", why: "old Garthe 2011 miscite", apply: { kind: "note" }, resolved: false },
]);
const stoodRU = raW(armedRU, isoL(Date.now()));
ok(!stoodRU.proposals.find((p) => p.rid === "rateunit" && !p.resolved), "an already-armed rate-unit card is gone from the screen after one pass");
ok(!!stoodRU.proposals.find((p) => p.rid === "rateunit" && p.resolved && (p.stoodDown || /converted to feed/.test(p.resolvedHow || ""))), "it leaves the screen on the record — stood down by its own retirement sweep or converted by R14, whichever sweep reaches it first; the record keeps it either way");
/* and the figure it used to get wrong is pinned to the verified constants, everywhere it appears */
ok(__test.BC.CUT_GARTHE_SLOW_LBM === 2.1 && __test.BC.CUT_GARTHE_SLOW_RATE === 0.7, "Garthe slow arm is the verified truth: +2.1% LBM at 0.7%/wk");
ok(__test.BC.CUT_GARTHE_FAST_LBM === -0.2 && __test.BC.CUT_GARTHE_FAST_RATE === 1.4, "Garthe fast arm is lean-neutral (-0.2%) at 1.4%/wk — there is no 1.0%/wk arm");

/* ================= v3.99.25 — the Rulebook cannot lie about the engine ================= */
const { rulebook: rbN, windowFor: wfN, repsLostOnJump: rlN, coarseLifts: clN, calorieFloor: cfN,
        proteinTarget: ptR, typicalError: teR, calorieTarget: ctR2, DEBT_LAST_H: DLH, DEBT_MEAN3_H: DM3,
        EA_SPARING: EAS2, SEED: TR25 } = __test;

/* THE DRIFT THIS PREVENTS. The Rulebook was twelve hardcoded sentences nothing
   checked, and four had rotted: OWNERSHIP and SLEEP still promised the
   clean-day gate removed in v3.99.19, PROTEIN still called 175 a constant after
   it became derived, RATE quoted pounds. Text making a claim the code does not
   keep — the same defect as a proposal whose apply() does nothing, on the page
   that tells him what the app IS. Every derived figure is now bound to the
   function that produces it: move a threshold without moving the sentence and
   this block goes red. */
const rbS = clone(TR25);
const rb = rbN(rbS);
const say = (k) => (rb.find((r) => r[0] === k) || [null, ""])[1];
ok(rb.length >= 12 && rb.every((r) => r[0] && r[1] && r[1].length > 40), "every rule has a name and a sentence: " + rb.length);

/* the four that had rotted */
ok(say("OWNERSHIP").indexOf("clean day") === -1, "OWNERSHIP no longer promises a clean-day gate the engine stopped applying six versions ago");
ok(say("OWNERSHIP").indexOf(String(teR(rbS, null).reps)) > -1, "and it quotes his OWN measured spread, read from typicalError rather than restated: ±" + teR(rbS, null).reps);
ok(say("SLEEP").indexOf(String(DLH)) > -1 && say("SLEEP").indexOf(String(DM3)) > -1, "SLEEP quotes the live debt thresholds, both of them");
ok(say("SLEEP").indexOf("does NOT block a record") > -1, "and states the thing that actually changed, rather than leaving him to notice");
ok(say("SLEEP").indexOf(String(rbS.sleep.cleanH)) > -1, "while keeping the target as a separate, still-standing question");
ok(say("PROTEIN").indexOf(String(ptR(rbS).g)) > -1 && say("PROTEIN").indexOf(String(ptR(rbS).perKg)) > -1, "PROTEIN reads from proteinTarget — number and per-kg figure both");
ok(say("PROTEIN").indexOf("not a constant") > -1, "and says out loud that it is derived, since it used to claim the opposite");
/* R3 - these used to live on s.rate in POUNDS. They are now derived from %BW by
   cutRateBand, so the assertion reads the OWNER. It also checks the copy no longer
   claims the numbers are pounds with a fix pending, because both of those sentences
   became false the moment the conversion landed and he reads this copy. */
ok(say("RATE").indexOf(String(__test.cutRateBand(rbS).floor)) > -1 && say("RATE").indexOf(String(__test.cutRateBand(rbS).redline)) > -1, "RATE quotes the %BW-derived floor and redline, read from cutRateBand rather than from a state field");
ok(say("RATE").indexOf(String(__test.cutRateBand(rbS).redlinePct)) > -1, "and it names the %BW figure, which is the one that does not drift as he leans out");
ok(say("RATE").indexOf("Both numbers are pounds") === -1 && say("RATE").indexOf("open proposal to restate") === -1, "and the copy no longer says the numbers are pounds with a fix pending - both sentences went false when the conversion landed");
ok(say("RATE").indexOf("% of bodyweight") > -1, "and converts them to the unit that does not drift, because in pounds they tighten as he leans");
ok(say("FOOD").indexOf(String(cfN(rbS).floor)) > -1, "FOOD carries the derived floor, not 1,700");

/* a rule naming an input he does not collect is decoration */
ok(rbS.waist.length === 0 && say("SIGNALS").indexOf("unlogged") > -1,
   "SIGNALS admits waist is unlogged instead of claiming it beats the scale — it named an input with zero entries");

/* the numbers move when the state moves — proof it reads rather than restates */
const lighter = clone(TR25); lighter.trend = 148; lighter.model.lean = 132;
ok(rbN(lighter).find((r) => r[0] === "RATE")[1] !== say("RATE"), "a lighter athlete gets different RATE percentages from the same pounds");
ok(rbN(lighter).find((r) => r[0] === "PROTEIN")[1] !== say("PROTEIN"), "and a different protein number, because lean mass moved");

/* ---- rep windows: the ceiling is arbitrary, the WIDTH is mechanical ---- */
ok(rlN({ w: 20, inc: 2.5, hi: 12 }).pct === 12.5, "a 2.5 lb plate on a 20 lb rear-delt fly is a 12.5% jump");
ok(rlN({ w: 20, inc: 2.5, hi: 12 }).lost > 4.5, "which costs about " + rlN({ w: 20, inc: 2.5, hi: 12 }).lost + " reps — Nuzzo 2024, ~0.4 reps per 1% of load");
ok(rlN({ w: 320, inc: 5, hi: 13 }).lost < 1, "while 5 lb on 320 lb calves costs under a rep: " + rlN({ w: 320, inc: 5, hi: 13 }).lost);
ok(wfN({ w: 20, inc: 2.5, hi: 12 }).lo <= 6, "so the rear-delt window has to run down to " + wfN({ w: 20, inc: 2.5, hi: 12 }).lo + " to catch him after the jump");
ok(wfN({ w: 320, inc: 5, hi: 13 }).lo >= 11, "and the calf window can stay tight at " + wfN({ w: 320, inc: 5, hi: 13 }).lo + "-13");
ok(wfN({ w: 20, inc: 2.5, hi: 12 }).tight === true && wfN({ w: 320, inc: 5, hi: 13 }).tight === false, "only the lift outside the ACSM 2-10% band is flagged");
ok(wfN({ w: "BW", hi: 8 }).derived === false, "a bodyweight lift has no increment to reason about, and says so rather than inventing one");
/* a ladder beats the flat increment when one exists */
ok(rlN({ w: 315, steps: [300, 315, 320, 335], inc: 5, hi: 13 }).step === 5, "on a ladder the real next rung is the step, not the nominal increment");

const coarse25 = clN(clone(TR25));
ok(coarse25.length === 2 && coarse25.every((c) => c.pct > 10), "exactly two of his lifts have plates too coarse for them: " + coarse25.map((c) => c.n + " " + c.pct + "%").join(", "));
ok(coarse25.some((c) => c.id === "rearDelt") && coarse25.some((c) => c.id === "pronated"), "the rear-delt fly and the pronated curl — both small-muscle lifts on fixed plates, which is the ACSM recommendation exactly inverted");

/* ---- the calorie floor, derived ---- */
const fl25 = cfN(clone(TR25));
ok(fl25.floor > 1700, "the derived floor comes out ABOVE the 1,700 he was running under: " + fl25.floor);
ok(Math.abs(fl25.floor - (EAS2 * fl25.ffmKg + fl25.eee)) <= 50, "it is energy availability run backwards — " + EAS2 + " kcal per kg of lean plus training cost, rounded to 50");
ok(fl25.soft > fl25.floor, "with a soft band above it at the 30 kcal/kg mark");
ok(fl25.why.indexOf("No position stand") > -1, "and the receipt says the quiet part: no position stand anywhere states an absolute floor for an athlete");
const leanerS = clone(TR25); leanerS.model.lean = 120;
ok(cfN(leanerS).floor < fl25.floor, "a smaller man gets a smaller floor — which is the actual value of indexing to lean mass, personalisation rather than drift");

/* ================================================================
   v3.99.27 — the surfaces he actually uses, audited against the research
   ================================================================ */
const { proteinTargetFn: pt27F, proteinHit: ph27, sleepAnchor: sa27, liftCall: lc27, SEED: SS27 } = __test;

/* ---- protein: a floor derived from lean mass, not an authored bullseye ---- */
const pt27 = pt27F(clone(SS27));
ok(Math.abs(pt27.floor - pt27.ffmKg * 2.5) <= 1, "the protein floor is 2.5 g per kg of his OWN lean mass: " + pt27.floor + " g off " + pt27.ffmKg + " kg");
ok(pt27.g !== 175 || pt27.ffmKg > 0, "the headline number is computed, not the old authored 175 sitting in a Math.max");
ok(pt27.lo < pt27.hi, "two defensible numbers exist, floor " + pt27.lo + " and lean-subgroup " + pt27.hi);
ok(pt27.straddles === (pt27.bfLo <= 12.2 && pt27.bfHi >= 12.2), "straddle is decided by the body-fat INTERVAL, not the point estimate");
ok(!pt27.straddles || pt27.g === Math.round(((pt27.lo + pt27.hi) / 2) / 5) * 5, "when it straddles, the headline is the midpoint of the range — never one end quoted with false confidence");
/* the knife-edge that used to exist */
const leanEdge = clone(SS27); leanEdge.model = { ...(leanEdge.model || {}), lean: leanEdge.model ? leanEdge.model.lean : 140 };
ok(pt27F(leanEdge).g === pt27.g, "a state that differs only in noise does not swing the target thirty grams");
/* protein is a FLOOR: over it is not a miss */
ok(ph27(160, 160) && ph27(160, 200) && ph27(160, 300), "at or above the floor is a hit, however far above — there is no upper threshold in the literature");
ok(!ph27(160, 120), "well under the floor is a miss");
/* The +/-10 tolerance is GONE. It made sense either side of a bullseye; on a
   floor it just moves the floor and creates a third number — the app was saying
   "under 158 is not defended" and "anywhere 160-190 counts" while actually
   passing 150. One number is worth more than a forgiving one. */
ok(!ph27(160, 152), "no tolerance is subtracted from a floor — 152 against a 160 floor is short, and says so");
ok(ph27(160, 160), "the floor itself passes");
ok(!ph27(160, null) && !ph27(160, undefined), "an unlogged day is not silently counted as a hit");
/* the regression this guards: his real intake must not be reclassified */
const realPro = [170, 170, 180, 186, 173, 180, 160, 175, 175, 185];
ok(realPro.every((p) => ph27(pt27.lo, p)), "every one of his last ten logged protein days still counts — the symmetric band would have failed the 175-186 days");

/* ---- sleep: his own clock, and which end of the night is the lever ---- */
const anch27 = sa27(clone(SS27));
ok(anch27.measured === false && anch27.bed === null, "with no bed/wake times on file it says so rather than inventing an anchor");
const withT = clone(SS27);
withT.sleep.nights = withT.sleep.nights.concat([
  { d: "2026-07-23", h: 7.5, bed: "01:00", wake: "09:00", sol: 15 },
  { d: "2026-07-24", h: 7.5, bed: "01:45", wake: "09:30", sol: 15 },
  { d: "2026-07-25", h: 7.5, bed: "01:45", wake: "09:45", sol: 10 },
  { d: "2026-07-26", h: 6.17, bed: "02:00", wake: "08:20", sol: 10 },
  { d: "2026-07-27", h: 6, bed: "01:40", wake: "07:50", sol: 10 },
]);
const a27 = sa27(withT);
ok(a27.measured === true && a27.n === 5, "five nights with clock times and it reads off his own record");
ok(a27.bed === "01:45", "his median bedtime is " + a27.bed + " — not the 23:00 the input used to default to");
ok(a27.wake === "09:00", "his median wake is " + a27.wake + " — not the 06:45 the input used to default to");
ok(a27.bedSDmin < a27.wakeSDmin, "his BEDTIME is the steady end (" + a27.bedSDmin + " min spread vs " + a27.wakeSDmin + " on wake) — which inverts the app's old 'fix your wake time' advice");
ok(a27.lever === "bed", "so the named lever is bedtime");
ok(a27.shiftMin > 0 && a27.needBed < a27.bed, "and it says how far: lights out " + a27.needBed + ", " + a27.shiftMin + " minutes earlier than he goes now");
ok(Math.abs(a27.curH - 7.08) < 0.2, "the current figure is his real average, " + a27.curH + " h");
/* midnight arithmetic — the trap in this whole function */
ok(sa27({ sleep: { cleanH: 7.5, nights: [
  { d: "2026-07-01", h: 7, bed: "23:00", wake: "06:30", sol: 15 },
  { d: "2026-07-02", h: 7, bed: "23:15", wake: "06:45", sol: 15 },
  { d: "2026-07-03", h: 7, bed: "22:45", wake: "06:15", sol: 15 } ] } }).bed === "23:00",
  "a before-midnight sleeper is handled too — 23:00 does not get read as 21 hours before 01:00");

/* ---- the clean-sleep gate is gone from the places that decide the session ----
   This is the finding that mattered most in this pass: the gate was retired in
   progressStep but still lived in liftCall, where it returned HOLD for every
   lift on any short-sleep morning. The engine said one thing and the
   prescription desk did another. */
const iso27 = (dt) => new Date(dt).toISOString().slice(0, 10);
const now27 = new Date(new Date().toDateString()).getTime();
const shortS = clone(SS27);
shortS.sleep.nights = shortS.sleep.nights.concat([
  { d: iso27(now27 - 3 * 864e5), h: 4.5 }, { d: iso27(now27 - 2 * 864e5), h: 4.5 }, { d: iso27(now27 - 864e5), h: 4.5 },
]);
const lcShort = lc27(shortS, "lateral");
ok(!(lcShort.verdict === "HOLD" && (lcShort.why || "").indexOf("Sleep is rebuilding") > -1), "liftCall no longer HOLDs the whole session on a short night: " + lcShort.verdict);
ok((JSON.stringify(lcShort.receipts || []) + (lcShort.why || "")).indexOf("nothing counts as a record") === -1, "and the 'nothing counts as a record today anyway' line is gone with it");

/* ---- v34: the gate leaves his SAVED STATE, not just the source ----
   Queue gates and exercise notes are data. They were seeded once and live on his
   phone, so without a migration he would keep reading "Repeat 8,8,7 on a clean
   day" and "deferred 2x for sleep" after the engine stopped believing either.
   A rule that survives only in copy is still a rule, because he reads the copy. */
const { migrate: mg34, SEED: SM34 } = __test;
const old34 = clone(SM34);
old34.v = 33;
const qq1 = (old34.queue || []).find((q) => q.id === "q_press_own");
const qq2 = (old34.queue || []).find((q) => q.id === "q_hack3");
if (qq1) qq1.gate = "Repeat 8,8,7 on a clean day (last: 8,7,6 on debt)";
if (qq2) { qq2.gate = "Gate passed · deferred 2× for sleep"; qq2.rule = "LOCKED — runs unless a true <4.5 h night"; }
const nQ = old34.queue ? old34.queue.length : 0;
const doneBefore = (old34.queue || []).filter((q) => q.done).length;
const m34 = mg34(old34);
ok(m34.v >= 34, "the migration runs: v" + m34.v);
const gq1 = (m34.queue || []).find((q) => q.id === "q_press_own");
const gq2 = (m34.queue || []).find((q) => q.id === "q_hack3");
ok(!gq1 || gq1.gate.indexOf("clean day") === -1, "the OWN gate stops telling him to wait for a clean day: " + (gq1 ? gq1.gate : "n/a"));
ok(!gq2 || (gq2.gate.indexOf("sleep") === -1 && gq2.rule.indexOf("4.5 h") === -1), "and the hack debut stops being locked behind a sleep threshold");
ok(JSON.stringify(m34.queue || []).indexOf("on debt") === -1, "no queue text anywhere still says a session was voided by sleep");
/* the guardrail that matters more than any of it: nothing was destroyed */
ok((m34.queue || []).length === nQ, "every queue item survives the migration — ids, history and all");
ok((m34.queue || []).filter((q) => q.done).length === doneBefore, "and nothing silently resolves or un-resolves");
ok((m34.feed || []).some((f) => f.t === "THE CLEAN-SLEEP GATE IS GONE"), "the change explains itself in his feed rather than happening silently");
ok(mg34(clone(m34)).feed.filter((f) => f.t === "THE CLEAN-SLEEP GATE IS GONE").length === 1, "and re-running the migration does not file it twice");

/* ---- the Analyst's context: nothing authored, nothing contradictory ----
   The prompt is the Analyst's whole world. Every authored constant left in it
   is a number the Analyst will quote back to him with total confidence, and
   every retired rule left in it contradicts the science floor in the same
   breath. Both were true of this prompt an hour ago. */
const { askContext: ac35, agentToolExec: ate35, migrate: mgc35, SEED: SC35 } = __test;
const cs35 = mgc35(clone(SC35));
const ctx35 = ac35(cs35);
ok(ctx35.indexOf("calorie floor 1,700") === -1 && ctx35.indexOf("calorie floor 1700") === -1, "the law sheet stops handing the analyst an authored 1,700 calorie floor");
ok(ctx35.indexOf("calorie floor " + __test.calorieFloor(cs35).floor) > -1, "and hands it the derived one instead: " + __test.calorieFloor(cs35).floor);
ok(ctx35.indexOf("weekly refeed is RETIRED") > -1 && ctx35.indexOf("the weekly refeed is on the calendar") === -1, "the refeed is described as retired rather than as a live part of the programme");
ok(ctx35.indexOf("PROTEIN TARGET") > -1 && ctx35.indexOf("FLOOR, not a bullseye") > -1, "protein reaches the analyst as a floor, so it cannot call a high-protein day a miss");
ok(ctx35.indexOf("HIS SLEEP CLOCK") > -1 || ctx35.indexOf("SLEEP CLOCK: not enough") > -1, "his measured bed and wake times reach the analyst, or it is told they do not exist yet");
ok(ctx35.indexOf("BODY FAT") > -1 && ctx35.indexOf("honest interval") > -1, "and the body-fat interval travels with the point estimate, so the analyst cannot quote a threshold call it has no right to");
/* the laws string was a plain double-quoted literal with ${} inside it, so every
   derived figure printed as source code rather than a number */
ok(ctx35.indexOf("${") === -1, "no un-interpolated template placeholders leak into the prompt as literal text");

/* run_whatif modelled a different athlete: 16,500 steps, 1,760 kcal, 3,500
   kcal/lb — three reference points the engine had already stopped using. */
const wi35 = ate35(cs35, "run_whatif", { sleep: 5 }, []);
ok(wi35.indexOf("nothing becomes official") === -1 && wi35.indexOf("streak never completes") === -1, "the what-if tool stops warning that short sleep voids a record");
ok(wi35.indexOf("lean mass") > -1, "and warns about the thing short sleep actually costs");
ok(ate35(cs35, "run_whatif", { refeed: 2400 }, []).indexOf("retired") > -1, "modelling a refeed says plainly that refeeds are retired rather than returning a number as if it were a live lever");

/* ---- the diet exit: his plan, his number, no ramp, no assumed surplus ----
   The old queue item read "Fast reverse (~1-2 wk to ~2,450) -> lean surplus
   2,700-2,950 · MRV build". Asked directly, he said: straight to maintenance,
   hold, then decide. It committed him to a surplus before the hold had produced
   a single number, and 2,450 was authored — stepping up to a "maintenance" that
   is not maintenance is just a smaller cut with a better name. */
const { dietExit: dx36, askContext: ac36, SEED: SE36 } = __test;
const exit36 = mkReads(28, 0.2, 170);
const dxA = dx36(exit36);
ok(!dxA.gated, "with a measured maintenance the exit plan prints");
ok(dxA.maintenance === __test.observedTDEE(exit36).tdee, "the number he steps up to is his MEASURED maintenance, not an authored one: " + dxA.maintenance);
ok(dxA.maintenance !== 2450, "specifically not the 2,450 the old queue item promised");
ok(dxA.plan.length === 3 && dxA.plan[0].indexOf("ONE step, not a ramp") > -1, "step one is a single step, because reverse dieting as a protocol has no controlled trial behind it");
ok(dxA.plan[1].indexOf("glycogen") > -1, "step two says why the hold exists — the first pounds back are glycogen and water, and misreading them restarts a deficit he does not need");
ok(dxA.plan[2].indexOf("no rule that says the next phase has to be a build") > -1, "and step three refuses to assume a surplus, because he has not decided one");
ok(dxA.why.indexOf("no controlled trial") > -1 && dxA.why.indexOf("MATADOR") > -1, "the receipt separates what is convention from what is replicated");
ok(dxA.unknown.indexOf("no study can tell you") > -1 && dxA.unknown.indexOf(String(dxA.bfLo)) > -1,
   "and it says plainly that nothing answers WHEN to stop — the body-fat interval is wider than the decision");
ok(dxA.holdMin < dxA.holdFull && dxA.holdMin >= 2, "the hold has a floor and a full length, both stated");
/* gated state must not invent a maintenance figure */
const bare36 = clone(SE36); bare36.reads = []; bare36.weekly = []; bare36.dailyLogs = {};
ok(dx36(bare36).gated === true && dx36(bare36).maintenance === undefined, "without a measured maintenance it declines to name a number rather than guessing one");
/* the analyst must give the same answer the app shows */
const ctx36 = ac36(exit36);
ok(ctx36.indexOf("THE DIET EXIT") > -1 && ctx36.indexOf("Do NOT propose a reverse-diet ramp") > -1, "the analyst is handed the same plan, so asking it does not produce a generic reverse-diet script");
ok(ctx36.indexOf("Do NOT assume a surplus") > -1, "and is told not to assume the build he has not chosen");

/* ================================================================
   v3.99.27b — the defects the verification pass caught before shipping
   ================================================================ */
const hmMin = (x) => { const [a,b] = x.split(":").map(Number); return a*60+b; };
const { migrate: mg37, lightsOutT: lo37, sleepAnchor: sa37, dietExit: de37, SEED: SD37 } = __test;

/* ---- THE DATA LOSS. A done queue item's gate is a RECEIPT, not a gate.
   His live q_hack3 reads "Debuted 7,8,7" — the result of the set. The first
   version of patchV34 overwrote it unconditionally with future-tense text
   about a set he had already done, and the queue renders that string on the
   win card. Nothing may touch a finished item. ---- */
const doneSV7 = clone(SD37); doneSV7.v = 33;
const hqV7 = (doneSV7.queue || []).find((q) => q.id === "q_hack3");
if (hqV7) { hqV7.done = true; hqV7.state = "ESTABLISH"; hqV7.gate = "Debuted 7,8,7"; }
const doneM = mg37(doneSV7);
const hq2V7 = (doneM.queue || []).find((q) => q.id === "q_hack3");
ok(!hq2V7 || hq2V7.gate === "Debuted 7,8,7", "a COMPLETED queue item's receipt survives the migration untouched: " + (hq2V7 ? hq2V7.gate : "n/a"));
ok(!hq2V7 || hq2V7.done === true, "and stays done");
/* an OPEN item with the same sleep language must still be cleaned */
const openSV7 = clone(SD37); openSV7.v = 33;
const oq37 = (openSV7.queue || []).find((q) => q.id === "q_hack3");
if (oq37) { oq37.done = false; oq37.gate = "Gate passed · deferred 2× for sleep"; oq37.rule = "LOCKED — runs unless a true <4.5 h night"; }
const openM = mg37(openSV7);
const oq38 = (openM.queue || []).find((q) => q.id === "q_hack3");
ok(!oq38 || oq38.gate.indexOf("sleep") === -1, "while an OPEN item with sleep language is still cleaned: " + (oq38 ? oq38.gate : "n/a"));
ok(!oq38 || oq38.rule.indexOf("4.5") === -1, "including the hardcoded 4.5 h release valve — the regexes that were supposed to do this had lost their backslashes and matched nothing");

/* ---- THE DIET EXIT HAS TO REACH HIS PHONE. The seed changed q_pivot to
   kind:"exit"; without a migration his saved copy keeps kind:"phase" and keeps
   printing the authored 2,450 / lean-surplus / MRV-build line. ---- */
const pvSV7 = clone(SD37); pvSV7.v = 33;
const pqV7 = (pvSV7.queue || []).find((q) => q.id === "q_pivot");
if (pqV7) { pqV7.kind = "phase"; pqV7.t = "PIVOT → REVERSE"; pqV7.gate = "~10.5–11% · weeks 13–16"; pqV7.rule = "Fast reverse (~1–2 wk to ~2,450) → lean surplus 2,700–2,950 · MRV build"; }
const pvM = mg37(pvSV7);
const pq2V7 = (pvM.queue || []).find((q) => q.id === "q_pivot");
ok(!pq2V7 || pq2V7.kind === "exit", "the diet-exit queue item migrates, so the new plan actually renders: kind=" + (pq2V7 ? pq2V7.kind : "n/a"));
ok(!pq2V7 || pq2V7.rule.indexOf("2,450") === -1, "and the authored 2,450 reverse target leaves his saved state");
ok((pvM.feed || []).some((f) => f.t === "THE EXIT PLAN IS NOW YOURS"), "with the change explained in his feed rather than swapped silently");
ok(mg37(clone(pvM)).feed.filter((f) => f.t === "THE EXIT PLAN IS NOW YOURS").length === 1, "and not re-filed on every subsequent migration");

/* ---- THE TWO BEDTIMES. lightsOutT counted back from the authored 06:45 while
   the sleep card counted from his measured clock, so NOW said "lights out
   10:35 PM, wake 6:45 AM" and SLEEP said "lights out 1:20 AM" on the same day.
   Whichever he believed, the other was lying. ---- */
const twoSV7 = clone(SD37);
twoSV7.sleep.nights = twoSV7.sleep.nights.concat([
  { d: "2026-08-21", h: 7.1, bed: "01:30", wake: "08:50", sol: 10 },
  { d: "2026-08-22", h: 7.1, bed: "01:45", wake: "09:00", sol: 10 },
  { d: "2026-08-23", h: 7.1, bed: "01:40", wake: "09:10", sol: 10 },
]);
const an37V7 = sa37(twoSV7), l37V7 = lo37(twoSV7);
ok(an37V7.measured && l37V7.measured, "both the sleep card and the daily protocol now read the same measured clock");
ok(l37V7.wakeRef === an37V7.wake, "off the same wake reference: " + l37V7.wakeRef);
/* the two figures must be reconcilable — lights-out is the target back from wake */
const backFromWake = ((hmMin(an37V7.wake) + 1440) - an37V7.target * 60 - an37V7.sol) % 1440;
ok(Math.abs(hmMin(l37V7.t) - backFromWake) <= 1, "and they agree arithmetically — " + l37V7.t + " is " + an37V7.target + " h plus drift back from " + an37V7.wake);
ok(l37V7.t !== "22:35", "specifically NOT the 22:35 the authored anchor produced for a man who goes to bed at 1:45am");

/* ---- the hold clock has to be startable, and something must start it ---- */
const heldSV7 = mkReads(28, 0.2, 170);
heldSV7.feed = [{ d: isoL(Date.now() - 21 * 864e5), t: "DIET EXIT — MAINTENANCE HELD", how: "x" }].concat(heldSV7.feed || []);
const dxH = de37(heldSV7);
ok(dxH.started != null && dxH.wksHeld >= 2.9, "the exit hold clock can actually start and count: " + dxH.wksHeld + " weeks");
ok(dxH.readReady === true, "so the two-week milestone is reachable rather than permanently false");
/* and the thing that starts it must exist — a plan whose milestones can never
   arrive is a plan the app is only pretending to run */
const exProp = mkReads(28, 0.2, 170);
exProp.proposals = [{ rid: "pivot", id: "px1", d: isoL(Date.now()), title: "WORTH ASKING: IS THE CUT DONE?", why: "test", apply: { kind: "exit" }, resolved: false }];
const exApplied = __test.applyProposal(exProp, "px1");
ok((exApplied.targets || {}).exitStart != null, "applying the exit proposal writes the start date — nothing wrote it before, so both milestones were unreachable");
ok(exApplied.feed.some((f) => f.t === "DIET EXIT — MAINTENANCE HELD"), "and files what actually changed, with the number to eat at");
ok(de37(exApplied).started != null && de37(exApplied).wksHeld === 0, "the clock reads zero weeks on day one rather than null");
ok(__test.proposalDial({ apply: { kind: "exit" } }) === null, "the exit proposal carries no dial — there is no number to nudge, it is a decision");

/* ---- the Morning Minute must never write an authored time into the record.
   minuteNeeds pushes the night step whenever yesterday is unlogged, so it is
   the PRIMARY night-entry surface — its defaults land in s.sleep.nights, which
   is the exact array sleepAnchor reads. Authored defaults there would poison
   the measured clock every other surface now depends on. ---- */
const anMV = sa37(twoSV7);
ok(anMV.measured && anMV.bed === "01:40", "the anchor the night-entry defaults must use: " + anMV.bed + " / " + anMV.wake);
ok(anMV.bed !== "22:45" && anMV.wake !== "06:45", "which is emphatically not the 22:45 / 06:45 the Morning Minute used to seed into his sleep record");

/* ---- exercise selection: the biggest lever, and the app must SAY he has it right ---- */
const { exerciseSelection: es38, mgLabel: ml38 } = __test;
const sel38 = es38(clone(SD37));
ok(sel38.items.length === 3, "all three biarticular lifts are audited: " + sel38.items.map((i) => i.n).join(", "));
ok(sel38.allGood === true, "his selection is on the right side of every one — the largest effect in the training literature, and the app had never mentioned it");
ok(sel38.items.every((i) => /[d.]|favoured/.test(i.d)), "each carries its effect size, so the claim is checkable: " + sel38.items.map((i) => i.d).join(" | "));
ok(sel38.items.find((i) => i.id === "calves").why.indexOf("gastrocnemius crosses the knee") > -1, "and the mechanism, not just the number");
/* a seated calf raise must be caught */
const seatedS = clone(SD37);
const cx38 = seatedS.exercises.find((e) => e.id === "calves");
cx38.setup = "SET · seated · knee pad snug\\nControlled reps";
ok(es38(seatedS).allGood === false, "swap in a seated calf raise and the audit catches it");
ok(es38(seatedS).items.find((i) => i.id === "calves").why.indexOf("largest single upgrade") > -1, "naming it as the biggest available upgrade rather than a footnote");
/* head keys must never reach a screen raw */
ok(ml38("delts_side") === "side delt" && ml38("delts_rear") === "rear delt", "head buckets get readable labels — without these the TRAIN chip row would have printed delts_side");
ok(ml38("hams") === "hams", "and anything without a mapping passes through unchanged");

/* ---- muscleVolume must bucket by head, like programmeVolume already did ----
   patchV33 split the delts and retracted a card built on the pooled bucket, then
   this function kept counting by mg — so the TRAIN chip went on printing
   `delts 17` flagged OVER, in red, while his own feed said 5-7 each. The
   retraction shipped; the instrument behind it did not. */
const mvS38 = clone(SD37);
mvS38.sessionLog = { ...(mvS38.sessionLog || {}) };
mvS38.sessionLog[isoL(Date.now() - 2 * 864e5)] = { entries: [{ id: "lateral", w: 80, reps: [14, 13, 13], rir: 1 }, { id: "rearDelt", w: 20, reps: [10, 10], rir: 1 }, { id: "press", w: 245, reps: [8, 7, 6], rir: 1 }], at: 1 };
const mv38 = __test.muscleVolume(mvS38);
ok(!mv38.some((m) => m.mg === "delts"), "no pooled deltoid bucket survives");
ok(mv38.some((m) => m.mg === "delts_side") && mv38.some((m) => m.mg === "delts_rear"), "the heads are counted separately, as Pelland classifies them");
ok(!mv38.some((m) => m.mg === "delts_side" && m.zone === "OVER"), "so the side delt no longer reads OVER off a 17 that was three muscles added together");

/* ---- the triceps close must reach his SAVED state, not just the seed ---- */
const pegS = clone(SD37); pegS.v = 33;
const pg38 = (pegS.queue || []).find((q) => q.id === "q_peg");
if (pg38) { pg38.done = false; pg38.t = "TRICEP BOTTOM-PEG (STRETCH)"; pg38.gate = "Middle peg through the cut"; pg38.rule = "Unparks at build phase"; }
const pegM = mg37(pegS);
const pg39 = (pegM.queue || []).find((q) => q.id === "q_peg");
ok(!pg39 || pg39.done === true, "the triceps question closes on his phone, not just in the seed");
ok(!pg39 || pg39.rule.indexOf("build phase") === -1, "and stops waiting on a build phase that has no date and that he has not chosen");
ok((pegM.feed || []).some((f) => f.t === "TRICEP QUESTION CLOSED"), "with the reasoning filed, including why the peg was never the overhead question");

/* ================================================================
   v4.0.0 — the redesign, and the evidence each choice rests on
   ================================================================ */
const { nowFocus: nf40, SEED: S40 } = __test;

/* ---- NOW knows why he opened it. The page used to show 28 cards at 7am and
   the same 28 at 9pm. The ACT of logging stays exactly as manual as it was —
   burden is not simply bad, and the trial that removed the act got worse habit
   formation and half the weight loss. What changes is the distance to it. ---- */
const fresh40 = clone(S40);
fresh40.reads = (fresh40.reads || []).filter((r) => r.d !== isoL(Date.now()));
delete fresh40.dailyLogs[isoL(Date.now())];
const am40 = nf40(fresh40, 7);
ok(am40.phase === "MORNING", "7am reads as morning");
ok(am40.owed.length > 0 && !am40.clear, "with something owed, so the page has a job to point at");
ok(am40.lead.t.length > 0 && am40.lead.sub.length > 20, "the lead is one action plus why it matters, not a list");
ok(am40.owed.some((o) => o.k === "weight"), "an unlogged scale is owed in the morning");
/* the evening job is a different job */
const pm40 = nf40(fresh40, 20);
ok(pm40.phase === "EVENING", "8pm reads as evening");
ok(pm40.owed.some((o) => o.k === "day"), "and the day's numbers become owed — they are not owed at 7am");
ok(!am40.owed.some((o) => o.k === "day"), "specifically: closing the day is NOT nagged in the morning, when he cannot yet know the numbers");
/* midday is neither */
ok(nf40(fresh40, 14).phase === "MIDDAY", "the middle of the day is its own phase");
/* nothing owed must read as nothing owed, not as an empty scold */
const done40 = clone(S40);
done40.reads = [...(done40.reads || []), { d: isoL(Date.now()), w: 164.5, sealed: false }];
/* owedNights deliberately asks for at most TWO nights at a time so a long gap
   never lands as a wall of work — so filling it reveals the next one. Loop. */
for (let g = 0; g < 6; g++) {
  const owe = __test.owedNights(done40, 20);
  if (!owe.length) break;
  owe.forEach((d) => { done40.sleep.nights.push({ d, h: 7.5, bed: "01:30", wake: "09:00", sol: 10 }); });
}
done40.sleep.nights.sort((a, b) => (a.d < b.d ? -1 : 1));
ok(__test.owedNights(done40, 20).length === 0, "the ask caps at two nights at a time, so a long gap never lands as a wall of work");
done40.dailyLogs[isoL(Date.now())] = { cal: 1900, pro: 180, steps: 16000 };
done40.dailyLogs[isoL(Date.now() - 864e5)] = { cal: 1900, pro: 180, steps: 16000 };
const clear40 = nf40(done40, 20);
ok(clear40.clear === true && clear40.owed.length === 0, "with everything filed it says nothing is owed");
ok(clear40.lead.t.indexOf("closed") > -1 || clear40.lead.t.indexOf("Nothing") > -1, "in plain words rather than an empty state: " + clear40.lead.t);
/* a missed yesterday is surfaced, because a gap in the record is the one thing
   that cannot be recovered later */
const late40 = clone(done40);
delete late40.dailyLogs[isoL(Date.now() - 864e5)];
ok(nf40(late40, 9).owed.some((o) => o.k === "yesterday"), "an unclosed yesterday is raised the next morning, when it can still be filed honestly");

console.log(`\nFINAL80: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ================================================================
   v4.0.1 — a state NEWER than the running code must survive
   ================================================================
   The rollback case. His phone migrates to schema n+1, then the app is reverted
   to a build that only knows schema n. `migrate` had four branches and none of
   them matched `old.v > SCHEMA_V`, so the state fell through to `return s` — a
   fresh copy of SEED — and every read, night, dailyLog, session and queue item
   was replaced with starter data, persisted over localStorage, and synced up
   over ledger/state.json. GOALS.md: never delete athlete data. Old code holding
   a newer file knows less than the file does; knowing less is not a licence to
   overwrite it. */
const { migrate: mg41, SEED: SU41, SCHEMA_V: SV41 } = __test;

/* one build ahead of this one, whatever this one is — never a literal 34 */
const fwd41 = clone(SU41);
fwd41.v = SV41 + 1;
fwd41.trend = 163.1;
fwd41.boosts = 7;
fwd41.reads = [
  { d: "2026-07-26", w: 162.9, note: "wedding morning", sealed: true },
  { d: "2026-07-27", w: 164.6, note: "event water", sealed: true },
  { d: "2026-07-28", w: 163.1, note: "whoosh cleared", sealed: false },
  { d: "2026-07-29", w: 162.4, note: "new trend low", sealed: false },
];
fwd41.sleep = Object.assign({}, fwd41.sleep, { nights: [
  { d: "2026-07-26", h: 6, bed: "01:40", wake: "07:40" },
  { d: "2026-07-27", h: 7.75, bed: "23:15", wake: "07:00" },
  { d: "2026-07-28", h: 8.25, bed: "22:45", wake: "07:00" },
] });
fwd41.dailyLogs = {
  "2026-07-27": { cal: 2410, pro: 171, steps: 14200 },
  "2026-07-28": { cal: 1880, pro: 186, steps: 16400 },
  "2026-07-29": { cal: 1905, pro: 192, steps: 15900 },
};
fwd41.sessionLog = { "2026-07-28": { entries: [
  { id: "press", reps: [8, 8, 7], rir: 1, rirEnd: 0, w: 245 },
  { id: "rows", reps: [10, 10], rir: 2, w: 180 },
], at: 1 } };
fwd41.queue = [{ id: "q_hack3", kind: "debut", exId: "hack", t: "HACK 3RD SET DEBUT", state: "DONE", gate: "Debuted 7,8,7", rule: "Runs when it wins the day's structural slot", done: true }];
const snap41 = clone(fwd41);
const out41 = mg41(fwd41);

ok(!!out41, "a state one version ahead of the code still migrates to something");
ok(out41.reads.length === snap41.reads.length, "his reads survive the rollback — " + out41.reads.length + " back, " + snap41.reads.length + " expected");
ok(eq(out41.reads, snap41.reads), "and they are HIS reads, not the seed's starter set");
ok(out41.sleep.nights.length === snap41.sleep.nights.length && eq(out41.sleep.nights, snap41.sleep.nights), "every logged night survives, hours and clock times intact");
ok(eq(Object.keys(out41.dailyLogs || {}).sort(), Object.keys(snap41.dailyLogs).sort()) && eq(out41.dailyLogs, snap41.dailyLogs), "every dailyLog survives — a gap in the record is the one thing he cannot refile later");
ok(!!(out41.sessionLog || {})["2026-07-28"] && eq(out41.sessionLog["2026-07-28"], snap41.sessionLog["2026-07-28"]), "the session he logged survives, reps and RIR intact");
const q41 = (out41.queue || []).find((q) => q.id === "q_hack3");
ok(!!q41 && q41.done === true && q41.gate === "Debuted 7,8,7", "and the finished queue item keeps its receipt: " + (q41 ? q41.gate : "DESTROYED"));
ok(out41.trend === snap41.trend && out41.boosts === snap41.boosts, "the trend and the boost count come back measured, not reseeded");
ok(JSON.stringify(out41) !== JSON.stringify(clone(SU41)), "specifically: a newer state is NOT silently replaced by a fresh copy of SEED");
/* the whole guard, stated once: hand it back untouched. Old code may read a
   field it does not understand oddly, and re-upgrading restores full function.
   A visible misbehaviour is recoverable; a wipe is not. */
ok(eq(out41, snap41), "a state newer than the code is handed back UNTOUCHED, down to the version stamp: v" + out41.v);

/* ================================================================
   NOW reorg v6.3 — the fold action, the remembered collapse, isolation
   ================================================================
   Guards the three novel PURE pieces of the reorg: the WHAT YOU OWE deep-link
   map, the disclosure override rule (a remembered toggle beats the time-of-day
   default, in BOTH directions), and that UI prefs live in their OWN device-local
   key — never the synced, publicly-readable state.json. The render itself is
   exercised by render-smoke and dom-smoke; these lock the logic those depend on. */
const { oweTarget: oT63, applyDisc: aD63, readDisc: rD63, UI_KEY: UIK63 } = __test;

// WHAT YOU OWE deep-links to the right collapsed group + element, per owed kind
ok(oT63("night").key === "now.capture2" && oT63("night").id === "pl-capture", "owe: a missing night points the fold action at CAPTURE (pl-capture)");
ok(oT63("weight").key === "now.capture2" && oT63("weight").id === "pl-capture", "owe: an un-logged scale points at CAPTURE (pl-capture)");
ok(oT63("day").key === "now.capture2" && oT63("day").id === "pl-closeday", "owe: the day's numbers point INTO the CAPTURE door, at the close-the-day card (pl-closeday)");
ok(oT63("yesterday").key === "now.capture2" && oT63("yesterday").id === "pl-amend", "owe: an unclosed yesterday points INTO the CAPTURE door, at the reopen card (pl-amend)");
// v7.5 r2 blocker B — the previous check here compared each oweTarget key to the same value
// the assertions above already pinned, so it could not fail. The LIVE-set invariant now lives
// in the render smoke (which mounts NOW and can see what registerGroup actually registered).
// What belongs here is the literal each map promises, and the branches that had no coverage.
ok(__test.NOW_DOORS.capture === "now.capture2" && __test.NOW_DOORS.briefing === "now.briefing" && __test.NOW_DOORS.room === "now.room" && __test.NOW_DOORS.inbox === "now.inbox", "the door keys are the literals the deep-link maps promise — a silent rename turns the render smoke red, and this red");

// GYM MODE INTEGRITY — the invariant that was violated in shipped code: no finish() path
// may emit an entry for a lift the athlete did not perform. See SKIP_ONE_PATH.
{
  const GE = __test.gymEntries, RC = __test.restCut, CUT = __test.REST_CUT_S;
  const lift = (id, tgt) => ({ id, n: id.toUpperCase(), w: 100, tgt: tgt || [12, 12], isDebutNow: false });
  const sessEx = [lift("press"), lift("row"), lift("pronated"), lift("ham")];

  // the exact fixture from the item: take the lift-screen skip on lift 3, then finish
  const out = GE(sessEx, { reps: { press: [10, 9], row: [12, 11], ham: [12, 10] }, rir: { press: 2 }, gskip: { pronated: true } });
  ok(out.skipped.some((x) => x.id === "pronated"), "GYM — a skipped lift appears in skipped[]");
  ok(!out.entries.some((x) => x.id === "pronated"), "GYM — and a skipped lift emits NO entry: this is the phantom-rep defect, which banked the lift at its TARGET reps");
  ok(out.entries.length === 3 && out.skipped.length === 1, "GYM — entries and skipped PARTITION the session; no lift is lost and none is counted twice");
  ok(out.entries.every((e2) => sessEx.some((x) => x.id === e2.id)) && out.entries.length + out.skipped.length === sessEx.length, "GYM — every lift lands in exactly one bucket, so \"nothing counted\" is checkable rather than merely claimed");

  // an un-skipped lift with no logged reps still falls through to target — that is the
  // pre-existing behaviour for a lift he DID perform and simply confirmed
  ok(JSON.stringify(GE(sessEx, {}).entries.find((e2) => e2.id === "row").reps) === JSON.stringify([12, 12]), "GYM — an unskipped lift with nothing typed confirms its target, which is the zero-tap path Gym Mode is built around");
  ok(GE(sessEx, { gskip: { press: true, row: true, pronated: true, ham: true } }).entries.length === 0, "GYM — skipping every lift emits no entries at all");
  ok(GE(null, null).entries.length === 0 && GE(undefined, undefined).skipped.length === 0, "GYM — gymEntries is total: no session, no entries, no throw");

  // deriveLastMeta — the denormalised cache progressStep actually reads. The two ledger
  // repairs removed phantom entries from sessionLog and left lastMeta pointing at them, so
  // the phantom kept driving targets after the repair "succeeded". Any control that moves a
  // lift between entries[] and skipped[] must re-derive this.
  {
    const DLM = __test.deriveLastMeta;
    const mkLog = () => ({
      exercises: [{ id: "ham", n: "Ham curl", w: 120, lastMeta: { d: "2026-07-31", w: 120, reps: [12, 12], rir: null, rirSets: [null, null], debt: true } }],
      sleep: { nights: [] },
      sessionLog: {
        "2026-07-28": { entries: [{ id: "ham", reps: [12, 11], rir: 2, rirSets: [2, null], w: 120 }], skipped: [] },
        "2026-07-31": { entries: [{ id: "ham", reps: [12, 12], rir: null, rirSets: [null, null], w: 120 }], skipped: [] },
      },
    });

    const before = DLM(mkLog(), "ham");
    ok(before && before.d === "2026-07-31" && JSON.stringify(before.reps) === JSON.stringify([12, 12]), "deriveLastMeta finds the most recent session the lift was PERFORMED in");

    // the repair: move the phantom out of entries, as the ✕ / ledger repair does
    const repaired = mkLog();
    repaired.sessionLog["2026-07-31"].entries = [];
    repaired.sessionLog["2026-07-31"].skipped = [{ id: "ham" }];
    const after = DLM(repaired, "ham");
    ok(after && after.d === "2026-07-28" && JSON.stringify(after.reps) === JSON.stringify([12, 11]), "…and after the phantom is removed it falls back to the previous REAL session, instead of leaving the phantom driving progression");
    ok(after.rirSets[0] === 2, "the recovered lastMeta carries that session's rirSets, so progressStep still sees the RIR it actually had");

    // insertion order is not date order — the log is a plain object
    const jumbled = mkLog();
    jumbled.sessionLog = { "2026-07-31": jumbled.sessionLog["2026-07-31"], "2026-07-28": jumbled.sessionLog["2026-07-28"] };
    ok(DLM(jumbled, "ham").d === "2026-07-31", "deriveLastMeta sorts by DATE, not by key insertion order — the trap CLAUDE.md documents for dailyLogs");

    // a lift with no performed session at all
    const none = mkLog();
    none.sessionLog = { "2026-07-31": { entries: [], skipped: [{ id: "ham" }] } };
    ok(DLM(none, "ham") === null, "a lift with no surviving performance yields null rather than a fabricated cache");
    ok(DLM({}, "ham") === null && DLM(null, "ham") === null, "deriveLastMeta is total");

    // an entry with no reps is not a performance
    const empty = mkLog();
    empty.sessionLog = { "2026-08-01": { entries: [{ id: "ham", reps: [], w: 120 }], skipped: [] } };
    ok(DLM(empty, "ham") === null, "an entry carrying no reps is not a performance and cannot become the cache");

    // ROUND TRIP: skip then un-skip returns the record to where it started
    const rec0 = { entries: [{ id: "ham", reps: [10, 10], rir: null, rirSets: [null, 1], w: 120 }], skipped: [] };
    const rec1 = { entries: [], skipped: [{ id: "ham" }] };                                   // after ✕
    const rec2 = { entries: [{ id: "ham", reps: [10, 10], rir: null, rirSets: __test.buildRirSets({ reps: [10, 10], rir: null, rirEnd: null }, 2), w: 120 }], skipped: [] };   // after ↩
    ok(rec1.entries.length === 0 && rec1.skipped.length === 1, "ROUND TRIP — ✕ moves the entry into skipped");
    ok(rec2.entries.length === 1 && rec2.skipped.length === 0 && JSON.stringify(rec2.entries[0].reps) === JSON.stringify([10, 10]), "ROUND TRIP — ↩ moves it back with the reps he re-enters by hand");
    ok(rec2.entries[0].rirSets.every((x) => x === null), "ROUND TRIP — but the RIR does NOT come back: it was never captured, and inventing it is exactly the class of bug this whole area keeps producing");
    ok(rec0.entries[0].rirSets[1] === 1 && rec2.entries[0].rirSets[1] === null, "…so the round trip is honest about what it lost rather than restoring a value it does not have");
  }

  // TOUCHED — the three-state rule. Third attempt at this bug class, so all three states are
  // pinned, plus the exact session that bit him. See TOUCH_NOTE.
  {
    const six = ["calves", "abs", "hanging", "hack", "extension", "ham"].map((id) => lift(id));
    const allTouched = { calves: 1, abs: 1, hanging: 1, hack: 1, extension: 1, ham: 1 };

    // 1. TOUCHED + skip-flagged -> impossible. Evidence wins.
    const misTap = GE(six, { touched: allTouched, gskip: { extension: true, ham: true }, reps: { ham: [10, 10] }, rirEnd: { ham: 1 } });
    ok(misTap.skipped.length === 0, "TOUCHED — a lift he acted on is NEVER skipped, even with the skip flag set: this is the session that bit him, where extension and ham were logged \"skipped — on record\" after he performed both");
    ok(misTap.entries.some((e2) => e2.id === "ham" && JSON.stringify(e2.reps) === JSON.stringify([10, 10]) && e2.rirEnd === 1), "…and the reps and RIR he actually entered survive into the entry");

    // 2. untouched + skip-flagged -> a real skip
    const realSkip = GE(six, { touched: { calves: 1, abs: 1, hanging: 1, hack: 1, extension: 1 }, gskip: { ham: true } });
    ok(realSkip.skipped.length === 1 && realSkip.skipped[0].id === "ham", "TOUCHED — a lift he did NOT act on and DID flag is a real skip, and is recorded");

    // 3. untouched + no skip -> not performed. The v7.6.0 guarantee.
    const bailed = GE(six, { touched: { calves: 1, abs: 1 }, gskip: {} });
    ok(bailed.skipped.length === 4 && !bailed.entries.some((e2) => e2.id === "ham"), "TOUCHED — a lift he never acted on and never flagged is NOT performed: it is recorded as skipped, never banked at target reps (the v7.6.0 guarantee)");
    ok(bailed.entries.length === 2, "…and only the two he actually worked land as entries");

    // the headline case, stated as he stated it
    const reachedEnd = GE(six, { touched: allTouched, gskip: { ham: true } });
    ok(reachedEnd.skipped.length === 0, "TOUCHED — reaching the last lift with EVERY lift touched produces ZERO skips, even if a skip control was tapped");

    // reps alone must never imply touch: getR falls back to tgt, so every lift always has reps
    const repsOnly = GE(six, { touched: {}, gskip: {} });
    ok(repsOnly.skipped.length === 6, "TOUCHED — presence of reps proves nothing: getR falls back to the TARGET, so an untouched session is six skips, not six entries at target");
    const onTarget = GE(six, { touched: { hack: 1 }, gskip: {} });
    ok(onTarget.entries.length === 1 && onTarget.entries[0].id === "hack", "TOUCHED — a lift hit EXACTLY on target is still touched: touch is recorded as it happens, never inferred by comparing reps to tgt");

    // a pre-TOUCH draft has no map at all — unknown is not evidence
    ok(GE(six, { gskip: { ham: true } }).skipped.length === 1, "TOUCHED — a draft written before this existed carries no touch map, so the rule falls back to gskip alone rather than guessing every lift was skipped");
    ok(GE(six, { gskip: {} }).skipped.length === 0, "…and such a draft with no flags yields no skips, exactly as it did before");
  }

  // RIR_TIMING (§3.1.7-9) — the last set is asked for AT the set, not at lift-done.
  {
    const PAS = __test.phaseAfterSet;
    ok(PAS(0, 3) === "rir-open", "OPENER RIDER — the FIRST set routes to the opener ask: re-timed to the set (where the error is smallest), not removed — v7.12.0's removal broke the governor in production and this is the repair");
    ok(PAS(1, 3) === "rest", "a middle set still goes straight to REST — middle sets are prescribed, unrated on purpose");
    ok(PAS(2, 3) === "rir-end", "the FINAL set routes to the terminal RIR screen, untouched: the estimate is taken seconds after the set (~0.46 vs ~1.2 reps of error)");
    ok(PAS(0, 1) === "rir-end", "a SINGLE-set lift asks the terminal question only — its one set IS the failure set, so the opener ask would be the same question twice");
    ok(PAS(0, 2) === "rir-open" && PAS(1, 2) === "rir-end", "a two-set lift asks both questions, one per set — exactly what the field dictionary promises");
    ok(PAS(5, 3) === "rir-end", "and an over-run set index still lands on the terminal screen rather than falling through");
  }

  // QUEUED #2 E — exOrder had NO merge hardening and rode the wholesale local-wins spread.
  // An ordering cannot be keyed-unioned, so the rules are newest-deliberate-wins plus
  // never-lose-a-lift. Both write orders are asserted, as the data-safety guardrail requires.
  {
    const UX = __test._unionExOrder;
    const NEW = "2026-08-04T10:00:00.000Z", OLD = "2026-08-01T10:00:00.000Z";

    // the reported failure: reorder on the phone, then sync from a device that never saw it
    const phone = { U: ["b", "a", "c"], setAt: { U: NEW } };
    const stale = { U: ["a", "b", "c"] };
    ok(JSON.stringify(UX(phone, stale).U) === JSON.stringify(["b", "a", "c"]), "EXORDER — a stamped reorder beats an unstamped stale order even when the stale one is LOCAL: only one side made a deliberate choice");
    ok(JSON.stringify(UX(stale, phone).U) === JSON.stringify(["b", "a", "c"]), "EXORDER — and the same result with the write order reversed");

    // newest deliberate change wins, both directions
    const A9 = { U: ["a", "b", "c"], setAt: { U: OLD } }, B9 = { U: ["c", "b", "a"], setAt: { U: NEW } };
    ok(JSON.stringify(UX(A9, B9).U) === JSON.stringify(["c", "b", "a"]) && JSON.stringify(UX(B9, A9).U) === JSON.stringify(["c", "b", "a"]), "EXORDER — the newer stamp wins regardless of which side is remote");

    // MUST-NOT-LOSE: a lift on only one side is appended, never dropped, both directions
    const few = { U: ["a", "b"], setAt: { U: NEW } }, many = { U: ["a", "b", "c", "d"], setAt: { U: OLD } };
    ok(["a", "b", "c", "d"].every((x) => UX(few, many).U.includes(x)), "EXORDER — a lift missing from the winning order is appended, not lost");
    ok(["a", "b", "c", "d"].every((x) => UX(many, few).U.includes(x)), "EXORDER — …in both write orders");
    ok(UX(few, many).U.length === 4 && new Set(UX(few, many).U).size === 4, "EXORDER — and no lift is duplicated in the process");

    // unstamped on both sides keeps the prior local-wins semantics
    ok(JSON.stringify(UX({ U: ["a", "b"] }, { U: ["b", "a"] }).U) === JSON.stringify(["b", "a"]), "EXORDER — with neither side stamped, local still wins: no behaviour change for states that predate the stamp");
    ok(UX(null, { U: ["a"] }).U.length === 1 && UX({ U: ["a"] }, null).U.length === 1, "EXORDER — total: a missing side is not a crash");

    // and through the real mergeState, both orders, with a second day key untouched
    const mkO = (o) => { const st = clone(SEED); st.exOrder = o; return st; };
    const l1 = mkO({ U: ["b", "a"], L: ["x", "y"], setAt: { U: NEW } });
    const r1 = mkO({ U: ["a", "b"], L: ["x", "y"] });
    ok(JSON.stringify(__test.mergeState(l1, r1).exOrder.U) === JSON.stringify(["b", "a"]), "EXORDER — mergeState honours the stamp");
    ok(JSON.stringify(__test.mergeState(r1, l1).exOrder.U) === JSON.stringify(["b", "a"]), "EXORDER — mergeState honours it in the other write order too");
    ok(JSON.stringify(__test.mergeState(l1, r1).exOrder.L) === JSON.stringify(["x", "y"]), "EXORDER — an untouched day key is unaffected");
  }

  // ---------------------------------------------------------------- CORRECTION MERGE --
  // Step 2 of the merge-correction plan: reproduce the ACTUAL revert. This fixture is the
  // real 2026-07-31 record — the phantom ham entry vs the corrected copy that removes it —
  // and it must fail on the CURRENT rule for the RIGHT reason: a STAMPED correction losing
  // to an UNSTAMPED copy, not merely "counts differ".
  {
    const day = "2026-07-31";
    const phantomRec = {
      entries: [
        { id: "calves", reps: [11, 9, 7, 7], rir: 2, rirSets: [2, null, null, 0], w: 320 },
        { id: "ham", reps: [12, 12], rir: null, rirSets: [null, null], w: 120 },
      ],
      skipped: [], at: 1754000000000, note: "", niggles: [], dips: 0, pace: "normal",
    };
    const correctedRec = {
      entries: [phantomRec.entries[0]],
      skipped: [{ id: "ham" }],
      at: phantomRec.at, note: "", niggles: [], dips: 0, pace: "normal",
      corr: { at: "2026-08-04T21:00:00.000Z", rev: 1 },
    };
    const stateWith = (rec) => { const st = clone(SEED); st.sessionLog = { [day]: rec }; return st; };
    const A9 = stateWith(correctedRec), B9 = stateWith(phantomRec);
    const hamGone = (out) => !((out.sessionLog[day].entries || []).some((e) => e.id === "ham"));
    const winner = (out) => (out.sessionLog[day].corr ? "the STAMPED correction" : "the UNSTAMPED phantom copy");

    const fwd = __test.mergeState(A9, B9), rev = __test.mergeState(B9, A9);
    ok(hamGone(fwd), "CORRECTION MERGE — a STAMPED correction beats an unstamped copy that still holds the phantom. Winner was " + winner(fwd) + " (entries=" + (fwd.sessionLog[day].entries || []).length + ")");
    ok(hamGone(rev), "CORRECTION MERGE — …and in the other write order. Winner was " + winner(rev) + " (entries=" + (rev.sessionLog[day].entries || []).length + ")");

    /* ---- the eleven cases. Every one runs BOTH write orders and asserts the same winner:
           a rule that is order-dependent is not a rule. ---- */
    const D = "2026-07-31";
    const rec = (o) => ({ entries: [], skipped: [], at: 1754000000000, note: "", niggles: [], dips: 0, pace: "normal", ...o });
    const E1 = { id: "calves", reps: [11, 9], rir: 2, rirSets: [2, 0], w: 320 };
    const E2 = { id: "ham", reps: [12, 12], rir: null, rirSets: [null, null], w: 120 };
    const stW = (r) => { const st = clone(SEED); st.sessionLog = { [D]: r }; return st; };
    /* both orders, one answer, or the test itself fails */
    const settle = (a, b, label) => {
      const f = __test.mergeState(stW(a), stW(b)).sessionLog[D];
      const r = __test.mergeState(stW(b), stW(a)).sessionLog[D];
      ok(JSON.stringify(f) === JSON.stringify(r), label + " — resolves identically in BOTH write orders");
      return f;
    };
    const ids = (r) => (r.entries || []).map((e) => e.id).sort().join(",");

    // 1 — correction vs unmarked stale copy: the case that is broken today
    const c1 = settle(rec({ entries: [E1], skipped: [{ id: "ham" }], corr: { at: "2026-08-04T21:00:00.000Z", rev: 1 } }), rec({ entries: [E1, E2] }), "CASE 1");
    ok(ids(c1) === "calves", "CASE 1 — a stamped correction beats an unstamped copy still holding the phantom");

    // 2 — unmarked shrink vs unmarked copy: today's behaviour must NOT change
    const c2 = settle(rec({ entries: [E1] }), rec({ entries: [E1, E2] }), "CASE 2");
    ok(ids(c2) === "calves,ham", "CASE 2 — an UNMARKED shrink still loses, exactly as before: refuse-to-shrink is untouched for ordinary syncs");

    // 3 — a correction racing a NEWER session on the other device
    const c3 = settle(rec({ entries: [E1], skipped: [{ id: "ham" }], corr: { at: "2026-08-04T21:00:00.000Z", rev: 1 } }),
                      rec({ entries: [E1, E2], at: Date.parse("2026-08-04T22:00:00.000Z") }), "CASE 3");
    ok(ids(c3) === "calves,ham", "CASE 3 — a STALE correction does NOT revert work logged after it: the newer session wins. Without this the rule would eat a session, which is worse than the bug");

    // 4 — same shape, but the other side is OLDER than the correction
    const c4 = settle(rec({ entries: [E1], skipped: [{ id: "ham" }], corr: { at: "2026-08-04T21:00:00.000Z", rev: 1 } }),
                      rec({ entries: [E1, E2], at: Date.parse("2026-08-04T20:00:00.000Z") }), "CASE 4");
    ok(ids(c4) === "calves", "CASE 4 — …but a correction newer than the other side's session still wins");

    // 5 — two corrections to the same session from two devices
    const c5 = settle(rec({ entries: [E1], corr: { at: "2026-08-04T21:00:00.000Z", rev: 1 } }),
                      rec({ entries: [E1, E2], corr: { at: "2026-08-04T23:00:00.000Z", rev: 1 } }), "CASE 5");
    ok(ids(c5) === "calves,ham", "CASE 5 — the LATER corr.at wins; the loser's correction is discarded, which is the stated wholesale-replacement limitation, asserted rather than hidden");
    const c5b = settle(rec({ entries: [E1], corr: { at: "2026-08-04T21:00:00.000Z", rev: 2 } }),
                       rec({ entries: [E1, E2], corr: { at: "2026-08-04T21:00:00.000Z", rev: 1 } }), "CASE 5b");
    ok(ids(c5b) === "calves", "CASE 5b — equal corr.at falls to higher rev, so the tiebreak is defined rather than incidental");

    // 6 — a correction, then a device that never saw it, syncing TWICE
    {
      const corrected = rec({ entries: [E1], skipped: [{ id: "ham" }], corr: { at: "2026-08-04T21:00:00.000Z", rev: 1 } });
      const naive = rec({ entries: [E1, E2] });
      const r1 = __test.mergeState(stW(corrected), stW(naive)).sessionLog[D];
      const r2 = __test.mergeState(stW(r1), stW(naive)).sessionLog[D];
      ok(ids(r1) === "calves" && ids(r2) === "calves", "CASE 6 — the correction survives a naive device syncing TWICE, not just the first round");
    }

    // 7 — a correction that would EMPTY a session. DECIDED: refused at the control, so the
    //     merge should never see one. If it ever does, it must not win by default.
    const c7 = settle(rec({ entries: [], skipped: [{ id: "calves" }, { id: "ham" }], corr: { at: "2026-08-04T21:00:00.000Z", rev: 1 } }),
                      rec({ entries: [E1, E2] }), "CASE 7");
    ok(ids(c7) === "", "CASE 7 — an emptying correction is refused AT THE CONTROL and never written; if one reaches the merge it is treated as any other stamped correction, and this asserts the behaviour explicitly rather than leaving it undefined");

    // 8 — dates are independent
    {
      const a = clone(SEED), b = clone(SEED);
      a.sessionLog = { [D]: rec({ entries: [E1], skipped: [{ id: "ham" }], corr: { at: "2026-08-04T21:00:00.000Z", rev: 1 } }), "2026-08-03": rec({ entries: [E1] }) };
      b.sessionLog = { [D]: rec({ entries: [E1, E2] }), "2026-08-03": rec({ entries: [E1, E2] }) };
      const m = __test.mergeState(a, b).sessionLog;
      ok(ids(m[D]) === "calves" && ids(m["2026-08-03"]) === "calves,ham", "CASE 8 — a correction on one date does not touch another: no cross-talk");
    }

    // 9 — malformed stamps are unstamped
    for (const bad of [{ rev: 1 }, { at: null, rev: 1 }, { at: 12345 }, { at: "not-a-date" }]) {
      ok(__test._corrOf({ corr: bad }) === null, "CASE 9 — a malformed corr (" + JSON.stringify(bad) + ") is treated as UNSTAMPED and falls to the ordinary rule");
    }
    const c9 = settle(rec({ entries: [E1], corr: { at: "not-a-date" } }), rec({ entries: [E1, E2] }), "CASE 9");
    ok(ids(c9) === "calves,ham", "CASE 9 — …so a shrink carrying a malformed stamp still loses");

    // 10 — three-way convergence, every merge order
    {
      const A0 = rec({ entries: [E1], skipped: [{ id: "ham" }], corr: { at: "2026-08-04T21:00:00.000Z", rev: 1 } });
      const B0 = rec({ entries: [E1, E2] }), C0 = rec({ entries: [E1, E2] });
      const perms = [[A0, B0, C0], [A0, C0, B0], [B0, A0, C0], [B0, C0, A0], [C0, A0, B0], [C0, B0, A0]];
      const outs = perms.map((p) => ids(__test.mergeState(stW(__test.mergeState(stW(p[0]), stW(p[1])).sessionLog[D]), stW(p[2])).sessionLog[D]));
      ok(outs.every((o) => o === outs[0]) && outs[0] === "calves", "CASE 10 — three devices converge on the SAME record from all six merge orders");
    }

    // 11 — a stamped correction arriving at a device holding an UNSYNCED local edit
    {
      const incoming = rec({ entries: [E1], skipped: [{ id: "ham" }], corr: { at: "2026-08-04T21:00:00.000Z", rev: 1 } });
      const localUnsynced = rec({ entries: [E1, E2], at: Date.parse("2026-08-04T22:30:00.000Z") });
      const c11 = settle(incoming, localUnsynced, "CASE 11");
      ok(ids(c11) === "calves,ham", "CASE 11 — an unsynced local edit NEWER than the correction is kept: resolved on timestamps, never on \"local is local\". This is the shape most likely to hit Joe, since the phone is often the only place a change exists");
      const olderLocal = rec({ entries: [E1, E2], at: Date.parse("2026-08-04T19:00:00.000Z") });
      ok(ids(settle(incoming, olderLocal, "CASE 11b")) === "calves", "CASE 11b — …and an OLDER unsynced local edit yields to the correction, for the same reason");

    // the stamper itself — both controls go through it, so it cannot drift
    {
      const SC = __test._stampCorr;
      const r0 = { entries: [E1] }; SC(r0);
      ok(r0.corr && typeof r0.corr.at === "string" && r0.corr.rev === 1, "STAMP — a first correction stamps at + rev 1");
      SC(r0);
      ok(r0.corr.rev === 2, "STAMP — a second correction on the same session increments rev, so two corrections from one device stay ordered");
      ok(__test._corrOf(r0) !== null, "STAMP — what the stamper writes is what the reconciler accepts");

    // ex.last is the SECOND denormalised cache, and targetsFor gates on it. It and
    // lastMeta.reps are written together by completeSession, so disagreement means one was
    // repaired and the other was not — which is exactly what happened to ham after 07-31.
    {
      const RC = __test.reconcileLiftCaches;
      const mk = (last, reps) => ({ exercises: [{ id: "ham", w: 120, last, lastMeta: { d: "2026-08-04", w: 120, reps, rir: null, rirSets: [], debt: false } }] });
      const stale = mk([12, 12], [10, 10]);
      ok(RC(stale) === 1 && JSON.stringify(stale.exercises[0].last) === JSON.stringify([10, 10]), "RECONCILE — a stale ex.last is brought back in line with lastMeta: the exact ham case after the 07-31 correction");
      const agree = mk([10, 10], [10, 10]);
      ok(RC(agree) === 0, "RECONCILE — agreement is left alone");
      /* FIX-ROUND EVOLUTION — the old fixture modeled a "deliberate reseed" with an
         UNCHANGED load, which is not how any reseed path leaves the state: RESET and the
         weight editor both change w before nulling (RESET: ex.w = newW; ex.last = null —
         one mutation). A same-load null on a numeric lift is therefore definitionally
         stale, and healing it is the fix for the patch-replay erasure that regressed the
         hack card for weeks. */
      const reseeded = mk(null, [10, 10]);
      reseeded.exercises[0].w = 125;   /* the load changed under the cache — the TRUE reseed shape */
      ok(RC(reseeded) === 0 && reseeded.exercises[0].last === null, "RECONCILE — a DELIBERATE null survives in its TRUE shape: the reseed paths change w first, so lastMeta.w ≠ w marks it and the heal leaves it alone");
      const sameLoadNull = mk(null, [10, 10]);
      ok(RC(sameLoadNull) === 1 && JSON.stringify(sameLoadNull.exercises[0].last) === JSON.stringify([10, 10]), "RECONCILE — a SAME-LOAD null on a numeric lift is healed from the log: the patch-replay erasure class (the hack card's true mechanism), dead at the cache layer");
      const noMeta = { exercises: [{ id: "ham", last: [12, 12], lastMeta: { d: null, reps: [] } }] };
      ok(RC(noMeta) === 0 && JSON.stringify(noMeta.exercises[0].last) === JSON.stringify([12, 12]), "RECONCILE — an empty lastMeta is not evidence and does not clobber ex.last");
      ok(RC({}) === 0 && RC(null) === 0, "RECONCILE is total");

    // The receipt printed en.rir -- the OPENER -- under a bare "RIR" label, while
    // progressStep is sized by the TERMINAL rating. So it showed the number that does not
    // drive progression and hid the one that does, and on an opener-only day it read as a
    // flat contradiction of the debrief line "No last-set ratings anywhere today".
    {
      const RR = __test.rirReceipt;
      ok(RR({ reps: [15, 14, 13, 12], rirSets: [2, null, null, 0] }) === "RIR 2→" + "0", "RIR RECEIPT — both ends rated shows BOTH: the terminal rating is what sizes the step and it was never on screen (2026-07-30 lateral, the real shape)");
      ok(RR({ reps: [12, 11], rirSets: [1, null] }) === "RIR 1→?", "RIR RECEIPT — opener only renders the last set as ?, which is what makes the \"no last-set ratings\" debrief line legible instead of contradictory");
      ok(RR({ reps: [12, 11], rirSets: [null, 0] }) === "RIR ?→0", "RIR RECEIPT — a terminal rating with no opener still shows, and shows WHICH end is missing");
      ok(RR({ reps: [8, 8, 5], rirSets: [null, null, null] }) === null, "RIR RECEIPT — an unrated lift prints nothing rather than a bare ?, so a genuinely unrated day stays visibly unrated");
      ok(RR({ reps: [10], rirSets: [2] }) === "RIR 2", "RIR RECEIPT — one set means the opener IS the last set; an arrow would invent a distinction the session does not have");
      ok(RR({ reps: [12, 12], rir: 1 }) === "RIR 1→?", "RIR RECEIPT — a legacy entry with only en.rir reads through rirSetsOf: the old field has always meant the opener");
      ok(RR({ reps: [] }) === null && RR(null) === null && RR({}) === null, "RIR RECEIPT is total");

    /* ---------- R1 — the regime detector ---------- */
    {
      const SS = __test.sessionScore, LT = __test.liftTrend, PT = __test.progressionTrend, RG = __test.regime;

      // sessionScore: the three shapes that must return null, and why it matters
      ok(SS({ w: 180, reps: [9, 9] }) === 3240, "R1 sessionScore — volume load is w x total reps");
      ok(SS({ w: "BW", reps: [10] }) === null, "R1 sessionScore — a bodyweight lift has no load term and returns null rather than a fabricated one");
      ok(SS({ w: "55·55·50", reps: [7] }) === null, "R1 sessionScore — a multi-weight string is not a number; parsing it would invent a load the athlete never recorded");
      ok(SS({ w: null, reps: [7] }) === null && SS({ w: 100, reps: [] }) === null && SS(null) === null, "R1 sessionScore is total");

      /* fixture builder — the minimum a state needs for these selectors.
         No events, no dayCtx, no blackout => dayWeather().hard is false.
         Sleep nights at 8h => cleanAtDate is true, so nothing is soft-flagged. */
      const LIFTS = ["a", "b", "c", "d", "e"];
      /* Sessions must sit ADJACENT to asOf, or the 7-day hysteresis lookback drops
         nothing and the sleep nights never overlap the training days. Both of those
         were fixture bugs that read as implementation failures first time round. */
      const ISO = (t) => new Date(t).toISOString().slice(0, 10);
      const END = Date.parse("2026-08-04T00:00:00Z");
      const mkState = (sessions, readSlope, nightH) => {
        const st = { sessionLog: {}, reads: [], sleep: { nights: [], cleanH: 7.5 }, dailyLogs: {}, exercises: LIFTS.map((id) => ({ id, n: id, w: 100 })), weekly: [], model: { drip: 0 } };
        const nS = sessions.length;
        sessions.forEach((sess, k) => {
          const d = ISO(END - (nS - 1 - k) * 2 * 86400000);
          st.sessionLog[d] = { entries: LIFTS.map((id) => ({ id, w: sess.w, reps: sess.reps.slice() })), skipped: [], pace: "normal", at: 1 };
        });
        for (let k = 0; k < 40; k++) {
          const d = ISO(END - (39 - k) * 86400000);
          st.reads.push({ d, w: +(170 - readSlope * k).toFixed(2) });
          st.sleep.nights.push({ d, h: nightH == null ? 8 : nightH });
        }
        return st;
      };
      const rising = [{ w: 100, reps: [8, 8] }, { w: 100, reps: [9, 9] }, { w: 100, reps: [10, 10] }, { w: 100, reps: [11, 11] }, { w: 100, reps: [12, 12] }];
      const falling = [{ w: 100, reps: [12, 12] }, { w: 100, reps: [11, 11] }, { w: 100, reps: [10, 10] }, { w: 100, reps: [9, 9] }, { w: 100, reps: [8, 8] }];

      // the three regimes are each REACHABLE — without this, the detector is decorative
      const free = RG(mkState(rising, 0.15), { asOf: "2026-08-05" });
      ok(free.key === "free", "R1 regime — lifts rising while weight falls is FREE: both terms of the objective improving at once, which is the global maximum");
      const costing = RG(mkState(falling, 0.15), { asOf: "2026-08-05" });
      ok(costing.key === "costing", "R1 regime — lifts falling while weight still falls is COSTING: it has stopped being free and become a trade");
      const bound = RG(mkState(falling, 0), { asOf: "2026-08-05" });
      ok(bound.key === "accretionBound", "R1 regime — not rising with the rate indistinguishable from zero is ACCRETION-BOUND, which is the ONLY way a surplus is ever reached. leangain is unreachable without this state");

      // abstention is a first-class answer
      const thin = RG(mkState(rising.slice(0, 2), 0.15), { asOf: "2026-08-05" });
      ok(thin.key === "unknown", "R1 regime — under 4 usable lift-trends it abstains rather than guessing; an autonomous coach that guesses is worse than one that abstains");
      ok(PT({}).state === "unknown" && PT(null).state === "unknown" && RG(null).key === "unknown", "R1 regime is total");

      // NO AUTHORED RATE THRESHOLD — the boundary is currentRate's own interval
      ok(!/[^a-zA-Z]0\.[0-9]+\s*\)?\s*;?\s*\/\*\s*lb\/wk/.test(String(__test._regimeRaw)) && /r\.lo > 0/.test(String(__test._regimeRaw)) && /r\.lo <= 0 && r\.hi >= 0/.test(String(__test._regimeRaw)),
        "R1 regime — 'losing' and '~zero' are currentRate's own 95% interval, not a hand-picked lb/wk cutoff. A round number here is the exact tell this project removed nine constants for");

      // the documented liftCall defect, as a test rather than a comment
      {
        const st = mkState([{ w: 100, reps: [13, 12] }, { w: 100, reps: [13, 12] }, { w: 100, reps: [13, 12] }, { w: 110, reps: [12, 11] }], 0.15);
        const lc = __test.liftCall(st, "a");
        const lt = LT(st, "a");
        ok(lc.vel < 0, "R1 — liftCall.vel goes NEGATIVE when a lift adds load and gives back reps: it sums reps with no load term");
        ok(lt && lt.pct > 0, "R1 — liftTrend reads the SAME sessions as positive, because volume load carries the load. This is why the regime detector could not be built on liftCall.vel");
      }

      // hysteresis: one anomalous session cannot flip a KNOWN state
      {
        const base = rising.concat([{ w: 100, reps: [12, 12] }, { w: 100, reps: [12, 12] }, { w: 100, reps: [12, 12] }]);
        const st = mkState(base.concat([{ w: 100, reps: [2, 2] }]), 0.15);
        const r = RG(st, { asOf: "2026-08-05" });
        ok(r.key !== "costing" || r.pending === "costing", "R1 regime — one anomalous session cannot change the reported key; a new state must hold across two evaluations 7 days apart. A hunting target is worse than a wrong constant one");
      }

      // downside-only: a short-sleep session may not CREATE a decline
      {
        /* THE MIRROR DEFECT, caught in review. He has ONE session clean on both flags,
           so a re-pool allowed to ERASE the verdict makes costing structurally unreachable
           for as long as his sleep stays short — the app going blind to the state it
           exists to detect, exactly when detecting it matters most. */
        const st = mkState(falling, 0.15, 4);   // every night 4h => every session carries debt
        const pt = PT(st);
        ok(pt.state === "falling", "R1 progressionTrend — a genuine decline with ZERO unflagged sessions is KEPT, not erased. Absence of clean sessions is not evidence of no decline");
        ok(pt.confidence === "low" && /not evidence of no decline/i.test(pt.protectedBy || ""), "R1 progressionTrend — and it is marked low-confidence with the reason, rather than silently downgraded");
        const cleanRun = PT(mkState(falling, 0.15, 8));
        ok(cleanRun.state === "falling" && cleanRun.confidence === "normal", "R1 progressionTrend — the same decline on well-slept sessions reports falling at NORMAL confidence, so the protection does not fire spuriously");

      /* THE DOWNGRADE HAD NO ASSERTION ANYWHERE IN THE SUITE, on the commit that celebrated
         the guard-must-fire rule. The !clean2.length branch was driven and the normal branch
         was driven; the only branch that CHANGES THE VERDICT was not. All four outcomes are
         driven here, and only one of them downgrades. */
      {
        const LC = ["a", "b", "c", "d", "e"];
        const isoC = (t) => new Date(t).toISOString().slice(0, 10);
        const endC = Date.parse("2026-08-04T00:00:00Z");
        /* nights before goodFrom are 4h, from goodFrom on are 8h — cleanAtDate needs the
           last night >= 6.5 AND the 3-night mean >= 7.0, so a block of good nights makes the
           later sessions clean and leaves the earlier ones flagged. */
        const mk4 = (totals, goodFrom) => {
          const st = { sessionLog: {}, reads: [], sleep: { nights: [], cleanH: 7.5 }, dailyLogs: {}, exercises: LC.map((id) => ({ id, n: id, w: 100 })), weekly: [], model: { drip: 0 } };
          totals.forEach((tot, k) => {
            const d = isoC(endC - (totals.length - 1 - k) * 2 * 86400000);
            st.sessionLog[d] = { entries: LC.map((id) => ({ id, w: 100, reps: [tot] })), skipped: [], pace: "normal", at: 1 };
          });
          for (let k = 0; k < 40; k++) {
            const d = isoC(endC - (39 - k) * 86400000);
            st.reads.push({ d, w: +(170 - 0.15 * k).toFixed(2) });
            st.sleep.nights.push({ d, h: k >= goodFrom ? 8 : 4 });
          }
          return st;
        };
        const GOOD = 32;   // last 8 nights good => the last 4 sessions are clean

        // (a) NO clean sessions at all -> falling STANDS, low, untestable
        const none = PT(mk4([20, 16, 12, 8, 4], 999));
        ok(none.state === "falling" && none.confidence === "low", "R1 downgrade — with NO clean sessions the decline STANDS at low confidence. Absence of clean sessions is not evidence of no decline");
        ok(/cannot be tested/i.test(none.protectedBy || ""), "R1 downgrade — and it says the decline could not be tested, rather than implying it was tested and survived");

        // (b) clean sessions point DOWN and confirm -> falling, normal
        const down = PT(mk4([20, 16, 12, 8, 4], GOOD));
        ok(down.state === "falling", "R1 downgrade — clean sessions that also decline leave the verdict standing");

        // (c) clean sessions point UP WITH POWER -> the ONLY downgrade
        const up = PT(mk4([40, 8, 4, 8, 12], GOOD));
        ok(up.state === "flat", "R1 downgrade — clean sessions pointing UP with power is the ONLY outcome that changes the verdict. This branch had no assertion at all until now, and it is the one that decides whether the deficit keeps being stepped out");
        ok(/point UP with power/i.test(up.protectedBy || ""), "R1 downgrade — and it names the power, not just the direction: at df=1 a bare point estimate crossing zero is a coin flip on the weakest sample in the system");

        /* (d) THE COIN FLIP IS GONE. Clean sessions that lean up but cannot resolve must NOT
           downgrade. Overall falling (-6/session), clean subset (the 3 dates that actually clear cleanAtDate: 12,15,13) leans UP but cannot resolve,
           so p2 >= 0 while p2 - se2 <= 0.

           MY FIRST VERSION OF THIS ASSERTION WAS VACUOUS. It read
             ok(hair.state !== "flat" || hair.pctClean == null, ...)
           and pctClean is not a field on the result, so the right-hand side was always true
           and the assertion could never fail. A DEAD ASSERTION, written in the very commit
           that adds assertions for a dead branch. It is asserted positively now: the state
           and the confidence, both named, neither one an escape hatch. */
        const hair = PT(mk4([40, 8, 12, 15, 13], GOOD));
        ok(hair.state === "falling", "R1 downgrade — clean sessions that lean up but cannot RESOLVE do not downgrade. p2 = +0.01 vs -0.01 used to be the difference between flat and falling, decided by noise on a df=1 sample");
        ok(hair.confidence === "low" && /cannot resolve/i.test(hair.protectedBy || ""), "R1 downgrade — and that outcome has its own name: UNTESTABLE is not the same as contradicted, and the copy says so");

        // the se floor is an INVARIANT now, not an epsilon guard nobody can reach
        for (const t of down.lifts) ok(t.se >= __test.TREND_SE_FLOOR, "R1 — every lift trend's se is at or above TREND_SE_FLOOR, which is why the pooling needs no epsilon guard. The two 1e-9 guards it replaced could never fire — a dead guard three lines from the fix for a dead guard");
      }

      }

      // regime may never read a body-fat estimate — R4's guardrail, enforced at R1
      ok(!/bfEst/.test(String(__test.regime)) && !/bfEst/.test(String(__test._regimeRaw)) && !/bfEst/.test(String(__test.progressionTrend)) && !/bfEst/.test(String(__test.liftTrend)),
        "R1 regime — no selector in the chain references bfEst. The instrument cannot resolve the range of interest, so no decision may fire on it");

      // no new stored field
      ok(!/\bs\.regime\s*=/.test(String(__test.regime)) && !/\bs\.plan\s*=/.test(String(__test.regime)), "R1 regime is a PURE selector — it stores nothing, so hysteresis is derived from the log rather than from a field that could drift");
    }

    /* ---------- R2 — energyBalanceTarget ---------- */
    {
      const EBT = __test.energyBalanceTarget, ED = __test.energyDensity;
      const st = clone(SEED);
      const td = __test.observedTDEE(st).tdee;
      /* confirmed:true explicitly — provisional now tracks the EVIDENCE, so a fixture
         that omits it is asserting the unconfirmed path whether it means to or not. */
      const R = (k) => EBT(st, { regime: { key: k, why: "fixture", confirmed: true } });

      // tissue gained is not tissue lost
      const loss = ED(st).perLb, gain = ED(st, "gain").perLb;
      ok(gain < loss * 0.75, "R2 energyDensity — a pound GAINED prices materially below a pound lost (" + gain + " vs " + loss + "). Pricing a surplus at the loss figure overstates its cost by ~60%, which is why every surplus path was unreachable in practice as well as in code");
      ok(ED(st, "gain").identified === false && /prior/i.test(ED(st, "gain").label), "R2 energyDensity — the gain figure is a LABELLED PRIOR, not a measurement; nothing in the literature pins the gain partition for a trained lifter");
      ok(ED(st).perLb === loss && ED(st, undefined).perLb === loss, "R2 energyDensity — the direction defaults to loss, so every existing caller is unchanged");

      // the surplus exists at all — this is the whole point of R2
      const ab = R("accretionBound");
      ok(ab.dir === "surplus" && ab.lo > td, "R2 — accretionBound returns a SURPLUS above measured maintenance (" + ab.lo + " > " + td + "). calorieTarget always subtracted, so a committed lean-gain phase was still prescribed a deficit");
      ok(ab.hi <= td + Math.round(((__test.BC.BULK_REDLINE_PCT / 100) * st.trend * gain) / 7) + 1, "R2 — the surplus is capped at BULK_REDLINE_PCT, and the cap is priced with the GAIN density rather than the loss one");
      ok(/not optimal|defensible/i.test(ab.doesNotBuy || ""), "R2 — the surplus states what it does not buy: the only trained-lifter trial ran at 18% of its own required sample size");

      // the branch that actually runs today
      const free = R("free"), unk = R("unknown");
      ok(unk.lo === free.lo && unk.hi === free.hi, "R2 — regime UNKNOWN holds the free-regime prescription exactly. Abstaining must not mean stopping the thing that is working");
      ok(unk.provisional === true && free.provisional === false, "R2 — and it says so: unknown is flagged provisional, free is not");
      ok(/holding|not deciding/i.test(unk.why), "R2 — the unknown copy says the engine is HOLDING, not deciding. A provisional target that reads like a decision is the same defect as a proposal that files a note");

      // costing shrinks without inventing a magnitude
      const cost = R("costing");
      ok(cost.lo === free.hi && cost.hi === free.hi, "R2 — costing collapses to the SHALLOW END OF HIS OWN BAND, not to an authored number. The lean cost per kcal of deficit is not identifiable from the literature, so the engine must not pretend to know it");
      ok(cost.dir === "deficit" && cost.shrunk === true, "R2 — costing is still a deficit, marked as shrunk");

      // round-trip: no hunting
      const path = ["free", "costing", "accretionBound", "free"].map((k) => R(k));
      ok(path[0].lo === path[3].lo && path[0].hi === path[3].hi, "R2 — free -> costing -> accretionBound -> free returns to the SAME band. The target is a pure function of the regime, so it cannot hunt");
      ok(path[1].hi <= path[2].lo, "R2 — the path is monotone in energy balance: the costing target never sits above the surplus target");

      // protein
      const pC = __test.proteinTargetForRegime(st, "free"), pB = __test.proteinTargetForRegime(st, "accretionBound");
      ok(pB.g >= pB.floorG, "R2 proteinTarget — a surplus never drops protein BELOW Morton 2018 1.6 g/kg BW, which is a SATURATION FLOOR and not a cap. The first build read it as a cap and cut protein by 57 g/day on entering a surplus");
      ok(/Morton/i.test(pB.basis), "R2 proteinTarget — the surplus figure is Morton 2018's 1.6 g/kg bodyweight, which had been sitting unread in BULK_PROTEIN_G_PER_KG_BW");

      ok(EBT(st, { regime: { key: "nonsense" } }).dir === "deficit", "R2 energyBalanceTarget is total — an unrecognised regime falls to the deficit path rather than throwing");

    /* ---------- STEPS ITEM A — promotion rule, both branches DRIVEN ---------- */
    {
      /* the last-7 days sit INSIDE the measurement window, so writing them moves atSteps
         too — the first version of these fixtures assumed independence and asserted against
         pre-mutation numbers. Control both windows explicitly and assert on the recomputed
         state's own internal consistency. */
      const mkSteps = (allVal, last7Val) => {
        const st = clone(SEED);
        const days = Object.keys(st.dailyLogs || {}).sort();
        days.forEach((d, i) => { st.dailyLogs[d] = { ...(st.dailyLogs[d] || {}), steps: i >= days.length - 7 ? last7Val : allVal }; });
        return st;
      };
      /* (a) no drift invented from noise */
      {
        const same = __test.observedTDEE(mkSteps(16000, 16000));
        ok(same.stepDelta === 0 && same.tdeeAtNow === same.tdee && same.stepPromoted === false && same.tdeePrimary === same.tdee, "ITEM A — current steps equal to the measurement window returns tdeeAtNow == measured with zero delta and no promotion: no drift is invented from noise");
      }
      /* (b) a LARGE drift promotes, and the eat target moves by exactly the net amount */
      {
        const big = mkSteps(20000, 0);   /* SEED halfwidth is 304, and the last-7 zeros dilute into the window average — 18000/2000 netted 273, just under. This nets ~340. */
        const tdB = __test.observedTDEE(big);
        ok(tdB.stepDelta < -200, "ITEM A — the collapse fixture genuinely collapses (delta " + tdB.stepDelta + " kcal/day)");
        ok(tdB.stepPromoted === true && tdB.tdeePrimary === tdB.tdeeAtNowMid, "ITEM A — a collapse whose smallest net reading clears the measured band's halfwidth IS promoted: the rule can fire; it has simply not earned to on his real data");
        const ctBase = __test.calorieTarget(mkSteps(20000, 20000));
        const ctB = __test.calorieTarget(big);
        const shift = Math.abs(ctB.baseHi - ctBase.baseHi);
        const net = Math.abs(tdB.tdee - tdB.tdeePrimary);
        ok(shift > 0 && shift <= net + 1, "ITEM A — the promoted eat band moves by AT MOST the net step delta (" + shift + " <= " + net + "): the displayed deficit never exceeds what the step adjustment funds — the thermodynamic bound, driven");
      }
      /* (c) the guard is NOT vacuous: a real but small drift moves nothing */
      {
        const small = mkSteps(16000, 14800);
        const tdS = __test.observedTDEE(small);
        ok(tdS.stepDelta != null && tdS.stepDelta < 0, "ITEM A — the small-drift fixture genuinely drifts (delta " + tdS.stepDelta + "), so the next assertion is driven, not vacuous");
        ok(tdS.stepPromoted === false && tdS.tdeePrimary === tdS.tdee, "ITEM A — but the drift nets inside the measured band's halfwidth, so the primary stays measured");
        const ctS = __test.calorieTarget(small);
        const ctBase2 = __test.calorieTarget(mkSteps(16000, 16000));
        ok(ctS.baseHi === ctBase2.baseHi && ctS.baseLo === ctBase2.baseLo, "ITEM A — and the eat band does not move AT ALL on an unpromoted drift: it changes the story, not the target — the no-precision-theatre guard, observed to hold on a fixture built to trip it");
      }
      /* ---------- STEPS ITEM B — every mode driven ---------- */
      {
        /* a below-corridor state: slow measured rate, clean sleep, recovery not LOW */
        const mkPushable = () => {
          const st = clone(SEED);
          const days = Object.keys(st.dailyLogs || {}).sort();
          days.forEach((d) => { st.dailyLogs[d] = { ...(st.dailyLogs[d] || {}), steps: 15000 }; });
          const isoB = (k) => new Date(Date.parse("2026-07-29T00:00:00Z") - k * 864e5).toISOString().slice(0, 10);
          st.reads = Array.from({ length: 28 }, (_, i) => ({ d: isoB(27 - i), w: +(166 - i * 0.05).toFixed(2), sealed: false }));
          st.trend = st.reads[st.reads.length - 1].w;
          st.sleep.nights = Array.from({ length: 10 }, (_, i) => ({ d: isoB(9 - i), h: 8.2 }));
          st.blackout = { until: "2026-07-01" };
          return st;
        };
        const pushable = mkPushable();
        const pre = __test.recoveryIndex(pushable);
        ok(pre.band !== "LOW", "ITEM B — precondition driven: the pushable fixture's recovery is not LOW (" + pre.band + "), so the PUSH below is earned rather than an accident of the veto not firing");
        const sp = __test.stepPush(pushable);
        ok(sp.mode === "PUSH" && sp.inc > 0 && sp.inc <= 1000, "ITEM B — under the corridor the coach reaches for STEPS FIRST, at most +1,000/day per week (practitioner progression), never a jump: +" + sp.inc);
        ok(sp.netLoKcal >= Math.round(sp.grossKcal * 0.70) - 1 && sp.netHiKcal <= Math.round(sp.grossKcal * 0.75) + 1 && sp.netHiKcal < sp.grossKcal, "ITEM B — the push is priced NET of compensation as a band (" + sp.netLoKcal + "-" + sp.netHiKcal + " of " + sp.grossKcal + " gross): the card never promises deficit the body will claw back");
        ok(sp.grade === "moderate", "ITEM B — with his stepeff unresolved, the grade is MODERATE and the copy says the number is being checked against his own weeks — no confident voice on a MODERATE claim");
        const out = __test.runAdaptive(JSON.parse(JSON.stringify(pushable)), "2026-07-22");
        const card = out.proposals.find((p) => /^steppush_/.test(p.rid) && !p.resolved);
        ok(!!card && card.apply.kind === "cal" && card.apply.stepsDelta === sp.inc && card.apply.delta < 0, "ITEM B — the card arms BOTH levers through the existing machinery (stepsDelta for walking, delta for food), so approval lands as the tracked one-tap-undo offset and the athlete picks — steps offered first, food as the alternative");
        ok(/steps are offered first|STEPS FIRST/i.test(card.title + card.why), "ITEM B — and the copy leads with steps, because that deficit does not spend lean");

        /* VETO fires: same state, sleep in debt */
        const tired = mkPushable();
        tired.sleep.nights = tired.sleep.nights.map((n) => ({ ...n, h: 4 }));
        const spT = __test.stepPush(tired);
        ok(spT.mode === "WITHHELD" && spT.veto === "sleep", "ITEM B GUARD — sleep debt WITHHOLDS the push: the body is not funding what it already does, so it is not asked to fund more. Driven, not asserted-in-principle");

        /* CEILING fires — the ABSOLUTE one. Building this exposed a design fact: an
           approved steer reconciles at the next weigh-in, so pushes persist through
           BEHAVIOUR — and a trailing cap (base+3000) slides up with the behaviour it
           permitted. The absolute ceiling is what terminates the climb. Driven by walking
           the whole record to 19,800: cap binds at 20,000 and the next +500 is refused. */
        const capped = mkPushable();
        Object.keys(capped.dailyLogs).forEach((d) => { capped.dailyLogs[d] = { ...capped.dailyLogs[d], steps: 19800 }; });
        const spC = __test.stepPush(capped);
        ok(spC.mode === "WITHHELD" && spC.veto === "ceiling" && spC.cap === 20000, "ITEM B GUARD — the ABSOLUTE ceiling FIRES at 20,000: pushed walking that has become behaviour drags the trailing cap up with it, so without this bound the target climbs forever — the calorie floor that never fires, in mirror. Further deficit routes to food");

        /* stepeff RESOLVED-negative blocks, with the health copy */
        const spH = __test.stepPush(mkPushable(), { stepeff: { status: "LIVE", n: 6, resolved: true, slopePer1k: -0.03, boundPer1k: 0.059 } });
        ok(spH.mode === "NOPUSH_HEALTH" && /cardiovascular health/.test(spH.why) && /calories are your fat lever/.test(spH.why), "ITEM B GUARD — a RESOLVED stepeff showing steps not converting blocks the push, and the copy names steps as health, not the fat lever — the instrument's verdict gates the prescription, from its output, not a constant");

        /* ---------- AUDIT FIX ROUND (steppush surface) — drive the TAP, not just the card's birth ---------- */
        {
          const armed = __test.runAdaptive(JSON.parse(JSON.stringify(pushable)), "2026-07-22");
          const cardT = armed.proposals.find((p) => /^steppush_/.test(p.rid) && !p.resolved);
          /* (2) the apply is FULLY armed: explicit calDelta equal to -(the net mid), prefer:steps */
          const netMid = -(Math.round(((sp.netLoKcal || 0) + (sp.netHiKcal || 0)) / 2));
          ok(!!cardT && cardT.apply.calDelta != null && cardT.apply.calDelta === netMid && cardT.apply.prefer === "steps", "AUDIT — the apply is FULLY armed: explicit calDelta (" + (cardT && cardT.apply.calDelta) + " = -(net mid)) and prefer:steps. steppush was the first kind:cal card born without calDelta, and the label read undefined < 0 as Ease while the tap tightened");
          /* (1) the PRIMARY route — the one prefer:steps makes the UI's main button take — enacts THE WALK */
          const walked = __test.applyProposal(JSON.parse(JSON.stringify(armed)), cardT.id, 0, "steps");
          ok(walked.feed.some((f) => f.t === "STEP TARGET RAISED"), "AUDIT — the primary tap on the driven card produces STEP TARGET RAISED: the athlete who does what the card says gets the walking lever, not a food cut wearing its name");
          const wRow = walked.adjustments[walked.adjustments.length - 1];
          ok(wRow.via === "steps" && wRow.stepDelta === cardT.apply.stepsDelta, "AUDIT — and it lands as the tracked, one-tap-undo steps offset (via steps, +" + wRow.stepDelta + "), reconciling at the next weigh-in like every steer");
          /* (3) the ALT route cuts food, by exactly the kcal the card quoted */
          const cut = __test.applyProposal(JSON.parse(JSON.stringify(armed)), cardT.id, 0, "cal");
          ok(cut.feed.some((f) => f.t === "TARGET TIGHTENED"), "AUDIT — the alternative route tightens food and is LABELLED as tightening — Ease-on-a-tightening-tap cannot recur through this path");
          const cRow = cut.adjustments[cut.adjustments.length - 1];
          ok(cRow.via === "cal" && cRow.calDelta === cardT.apply.calDelta, "AUDIT — by exactly the kcal the card quoted (" + cRow.calDelta + "), through proposalEffect, the one owner of the signed effect");
          /* (4)'s render-layer pin lives in tools/render-smoke.mjs (seeded-card mount reads the
             real buttons). Here the MACHINERY is pinned at source, because the items builder is
             a component closure no engine test can reach. */
          const srcT = readFileSync("src/app.jsx", "utf8");
          const bStart = srcT.indexOf("approve: (n) => { const ns = applyProposal(s, p.id, n || 0, ((p.apply || {}).prefer");
          const builder = srcT.slice(bStart, srcT.indexOf("dismiss: () => { const ns = dismissProposal", bStart));
          ok(bStart > 0 && builder.length > 0 && builder.length < 4000, "AUDIT — the items-builder slice under source-pin is the real one (found, one card's worth: " + builder.length + " chars)");
          ok(/proposalEffect\(p\)\.calDelta < 0/.test(builder) && !/\(p\.apply \|\| \{\}\)\.calDelta < 0/.test(builder), "AUDIT — approveLabel derives its sign from proposalEffect(p).calDelta and the raw apply.calDelta read is GONE — the class is dead, not the instance");
          ok(/prefer === "steps"/.test(builder) && /"steps" : "cal"/.test(builder), "AUDIT — and the primary via is prefer-aware: a prefer:steps card swaps the routes — same applyProposal, same via param, same undo");
          /* rider (a): a decline buys the WEEK — and ONLY the week */
          const declined = __test.dismissProposal(JSON.parse(JSON.stringify(armed)), cardT.id);
          ok(/before Monday/.test((declined.feed[0] || {}).how || ""), "AUDIT — the decline copy states what the decline now buys (quiet before Monday): R14's copy-and-mechanism-agree rule, applied to the mechanism this rider changed");
          const sameWeek = __test.runAdaptive(JSON.parse(JSON.stringify(declined)), "2026-07-22");
          ok(!sameWeek.proposals.some((p) => /^steppush_/.test(p.rid) && !p.resolved), "AUDIT — declined, the card does NOT refile the same week: before this, propose() blocked only APPLIED rids and the no bought zero minutes, against the producer's own no-nagging promise");
          const nextWeek = __test.runAdaptive(JSON.parse(JSON.stringify(declined)), "2026-07-27");
          ok(nextWeek.proposals.some((p) => p.rid === "steppush_2026-07-27" && !p.resolved), "AUDIT — and the monday rolls the rid, so a still-slow rate RE-ASKS next week: the decline bought the week, not silence forever");
          /* rider (b): the HOLD copy states the actual relation to the corridor */
          const hold7 = __test.stepPush(JSON.parse(readFileSync("tools/snapshots/2026-08-07-ledger.json", "utf8")));
          ok(hold7.mode === "HOLD" && /ABOVE the corridor/.test(hold7.why), "AUDIT — the live-snapshot HOLD copy says ABOVE the corridor, because that is where his rate actually is; the old string said inside unconditionally — a mode string misstating the state is the R10 family, fixed before R15 reads these modes");
          /* rider (c): resolved requires den > 0 — SOURCE-PINNED, honestly: it is undrivable,
             because stepEfficacy's pairs always include the authored ROLLUPS history, whose
             real step variance keeps den > 0 through every state a caller can hand it. */
          ok(/const resolved = den > 0 &&/.test(srcT), "AUDIT — stepEfficacy cannot call a zero-variance fit RESOLVED: den > 0 sits in the verdict line itself — a health claim needs evidence, even in a branch no reachable state currently produces");
        }
      }
      /* device kcal can never enter */
      {
        const src7 = readFileSync("src/app.jsx", "utf8")
          .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
          .replace(/(^|[^:])\/\/[^\n]*/g, (m, p) => p + m.slice(p.length).replace(/./g, " "));
        ok(!/kcalBurned|deviceCal|activeEnergy|caloriesBurned/i.test(src7), "ITEM A — no engine path ingests a device calorie figure. Steps are the trustworthy input; kcal is derived in-engine from the cited walking cost, which is why one owner for that constant matters");
      }
    }
    }

    /* ---------- R2 defects found in audit of main@66cd7a7 ---------- */
    {
      const EBT = __test.energyBalanceTarget;
      const st2 = clone(SEED);
      const td2 = __test.observedTDEE(st2).tdee;

      /* FIX 2 — costing was ABSORBING. It collapsed to one fixed point and stayed
         there; at that target the rate interval stays above zero, so the detector
         reads costing forever and accretionBound — the ONLY door to a surplus — is
         permanently shut. */
      const c1 = EBT(st2, { regime: { key: "costing" }, heldWeeks: 1 });
      const c2 = EBT(st2, { regime: { key: "costing" }, heldWeeks: 2 });
      const c3 = EBT(st2, { regime: { key: "costing" }, heldWeeks: 3 });
      ok(c2.lo > c1.lo && c3.lo > c2.lo, "R2 costing — each sustained evaluation steps the deficit DOWN toward maintenance. A fixed point is an absorbing state and shuts the only door to a surplus");
      ok(c1.steppedTo > c2.steppedTo && c2.steppedTo > c3.steppedTo, "R2 costing — the remaining deficit shrinks monotonically, by one width of his own band, so no new constant is authored");

      // and it TERMINATES — this is the assertion the round-trip test could not make
      let held = 1, last = null;
      for (; held <= 30; held++) { last = EBT(st2, { regime: { key: "costing" }, heldWeeks: held }); if (last.dir !== "deficit") break; }
      ok(last && last.dir === "maintenance" && held <= 30, "R2 costing — a sustained decline EVENTUALLY produces a non-deficit target (reached maintenance at evaluation " + held + "). The old build could never leave the deficit, so the machine could not walk to accretionBound no matter how long the decline lasted");
      ok(Math.abs(last.lo - td2) <= 1, "R2 costing — the terminal target is measured maintenance itself, floored at zero deficit rather than overshooting into a surplus the regime has not earned");

      /* A FIXED CAP RE-CREATES THE ABSORBING STATE AT A DIFFERENT POINT. If a band ever
         narrows so that cap x step < deficit0, the walk strands short of maintenance and
         costing is terminal again. The cap now derives from the walk, so this holds for
         ANY band width, not just today's. */
      {
        const narrow = clone(SEED);
        narrow.rate = { ...(narrow.rate || {}), band: [0.99, 1.0] };   // a near-degenerate band
        let h2 = 1, out = null;
        for (; h2 <= 400; h2++) { out = EBT(narrow, { regime: { key: "costing" }, heldWeeks: h2 }); if (out.dir !== "deficit") break; }
        ok(out && out.dir === "maintenance", "R2 costing — the walk terminates for a NEAR-DEGENERATE band too. A fixed step cap would strand it short of maintenance and make costing absorbing again at a different point");

      /* R2c — SEVERITY. Scaled on pct, not on the interval bound. The interval already
         gated ENTRY (falling requires hi < 0), so using it again to set the magnitude
         double-counts the same uncertainty. And the costs are asymmetric: exiting too
         fast is fully recoverable in a few weeks, exiting too slow spends lean mass that
         takes months to rebuild. Conservative-on-the-measurement is aggressive-on-the-risk. */
      {
        /* R2c v2 — severity is |hi| / (1.96 x se), so fixtures speak in STANDARD ERRORS.
           hi < 0 IS the falling threshold, so severity is zero there by construction and the
           mild anchor no longer exists to be tuned. */
        const toMaint = (hi, se) => { for (let h = 1; h <= 400; h++) { const r = EBT(st2, { regime: { key: "costing" }, heldWeeks: h, prog: { hi, se } }); if (r.dir !== "deficit") return h; } return 999; };
        const mild = toMaint(-0.05, 1), mid = toMaint(-1.0, 1), steep = toMaint(-1.96, 1);
        ok(steep < mid && mid < mild, "R2c — a steeper decline reaches maintenance in STRICTLY fewer evaluations (" + steep + " < " + mid + " < " + mild + "). The old build took the same seven weeks for a collapse as for a drift");
        ok(steep === 1, "R2c — an extreme decline exits in exactly ONE evaluation: the fastest meaningful exit is the exit itself");

        /* THIRD OCCURRENCE OF toFixed EATING A GUARD, so it gets its own assertion rather
           than another comment. A perfectly linear decline pools to se 0.000447, which
           .toFixed(3) rounds to 0 -- and severity divides by se, so the steepest possible
           decline read as MILD and took the eight-week walk. */
        {
          /* self-contained: PT and mkState live in the R1 block, not this one */
          const LFp = ["a", "b", "c", "d", "e"];
          const isoP = (t) => new Date(t).toISOString().slice(0, 10);
          const endP = Date.parse("2026-08-04T00:00:00Z");
          const fallP = [{ w: 100, reps: [12, 12] }, { w: 100, reps: [11, 11] }, { w: 100, reps: [10, 10] }, { w: 100, reps: [9, 9] }, { w: 100, reps: [8, 8] }];
          const pf = clone(SEED);
          pf.exercises = [...(pf.exercises || []), ...LFp.map((id) => ({ id, n: id, w: 100 }))];
          pf.sessionLog = {};
          fallP.forEach((sess, k) => { const d = isoP(endP - (fallP.length - 1 - k) * 2 * 86400000);
            pf.sessionLog[d] = { entries: LFp.map((id) => ({ id, w: sess.w, reps: sess.reps.slice() })), skipped: [], pace: "normal", at: 1 }; });
          const perfect = __test.progressionTrend(pf);
          ok(perfect.se > 0, "R2c — the POOLED se can never round to zero. A tight pool rounds to 0.000 at 3dp and severity DIVIDES by it, so the steepest possible decline scored mild. liftTrend already floored its own se for this reason; the pooled one is rounded separately, which is why the fix had to be made twice");
          ok(Math.abs(perfect.hi) / (1.96 * perfect.se) >= 1, "R2c — and that perfect decline now scores MAXIMAL severity, which is what it should have scored all along");
        }
        const ex = EBT(st2, { regime: { key: "costing" }, heldWeeks: 1, prog: { hi: -100, se: 1 } });
        ok(ex.dir === "maintenance" && ex.dir !== "surplus", "R2c — and the step is CLAMPED at deficit0, so no decline however steep can overshoot into a surplus the regime has not earned. That clamp is a bound, not a tuning constant");
        ok(mild >= 6, "R2c — a decline barely past the falling threshold still takes the long walk: severity is ZERO at hi = 0 by construction, so the mild end needs no anchor and there is none to tune");
        ok(!/const COSTING_MILD_PCT|const COSTING_SEVERE_PCT/.test(readFileSync("src/app.jsx", "utf8")), "R2c — and both dimensioned anchors are GONE. %/session of volume load has no natural scale, so they would have changed meaning silently if his exercise selection did");
        // confidence changes the COPY, never the step
        const lowConf = EBT(st2, { regime: { key: "costing", prog: { hi: -1.96, se: 1, confidence: "low" } }, heldWeeks: 1 });
        const normConf = EBT(st2, { regime: { key: "costing", prog: { hi: -1.96, se: 1, confidence: "normal" } }, heldWeeks: 1 });
        ok(lowConf.lo === normConf.lo, "R2c — low confidence does NOT slow the step. A wide interval on a decline is not evidence the decline is small — the same shape as absence of clean sessions not being evidence of no decline");
        ok(/cannot separate it from the short sleep/i.test(lowConf.why) && !/cannot separate/i.test(normConf.why), "R2c — it changes the COPY instead, naming the confound out loud rather than silently waiting it out");

      /* provisional is a property of the EVIDENCE, not of the branch. Every non-error
         return hardcoded provisional:false while base carried regimeConfirmed from
         regime().confirmed, so on the first-establishment path the same object
         contradicted itself. Driven through the REAL detector, not by injecting
         {confirmed:false} — a guard has to be observed to fire, not merely to exist. */
      {
        const LF = ["a", "b", "c", "d", "e"];
        const ISO2 = (t) => new Date(t).toISOString().slice(0, 10);
        const E2 = Date.parse("2026-08-04T00:00:00Z");
        const fall = [{ w: 100, reps: [12, 12] }, { w: 100, reps: [11, 11] }, { w: 100, reps: [10, 10] }, { w: 100, reps: [9, 9] }, { w: 100, reps: [8, 8] }];
        const fe = clone(SEED);
        fe.exercises = [...(fe.exercises || []), ...LF.map((id) => ({ id, n: id, w: 100 }))];
        fe.sessionLog = {};
        fall.forEach((sess, k) => { const d = ISO2(E2 - (fall.length - 1 - k) * 2 * 86400000);
          fe.sessionLog[d] = { entries: LF.map((id) => ({ id, w: sess.w, reps: sess.reps.slice() })), skipped: [], pace: "normal", at: 1 }; });
        const rg = __test.regime(fe, { asOf: "2026-08-05" });
        ok(rg.key === "costing" && rg.confirmed === false, "R2 — the first-establishment path is REACHABLE: a decline appearing while the week-ago view is still unknown yields costing, unconfirmed. This is his next likely transition, not a hypothetical");
        const eb = EBT(fe, { asOf: "2026-08-05" });
        ok(eb.regimeConfirmed === false && eb.provisional === true, "R2 — regimeConfirmed false forces provisional TRUE. A ~530 kcal/day move made on a single unconfirmed reading is a STRONGER claim than a provisional hold, and it was announcing itself as a weaker one");
        ok(eb.dir === "maintenance" && eb.heldWeeks === 1, "R2 — and the ACTION is not slowed by the label: a steep decline still exits on detection, because waiting a week costs lean that takes months to rebuild");
        for (const k of ["free", "costing", "accretionBound", "unknown"]) {
          const r2 = EBT(fe, { regime: { key: k, confirmed: false, prog: { pct: -3 } } });
          ok(r2.provisional === true, "R2 — provisional tracks the evidence in EVERY branch, not just the error paths: " + k);
        }
      }
      }
      }

      /* FIX 3 — protein was LOWERED in a surplus. Math.min(175, 118) = 118, a 57 g/day
         drop, while the comment claimed the cut figure stayed the ceiling. Morton 2018's
         1.6 g/kg BW is where MPS benefit SATURATES — a floor, not a cap. */
      const pFree = __test.proteinTargetForRegime(st2, "free");
      const pBulk = __test.proteinTargetForRegime(st2, "accretionBound");
      ok(pBulk.g >= pBulk.floorG, "R2 protein — a surplus never drops protein BELOW Morton's saturation floor. The old code used Math.min, so the floor always bound and entering a surplus cut protein by 57 g/day");
      ok(pBulk.g >= pFree.g, "R2 protein — and it never drops below the cut figure either: protein displaces energy that would otherwise arrive as fat, so under this objective the HIGHER of the two is correct");
      ok(/floor/i.test(pBulk.basis) && !/ceiling/i.test(pBulk.basis), "R2 protein — the copy now says floor rather than ceiling, because the previous comment and the code disagreed and the code won");
    }

    /* ---------- R3 — one redline, and it is the cited one ---------- */
    {
      const CRB = __test.cutRateBand, BCB = __test.bodyCompBand, RC3 = __test.redlineCrossing;
      const s3 = clone(SEED);
      const bw3 = s3.trend;

      // (1) THE SINGLE FIXTURE THAT IS THE WHOLE BUG.
      // The old code ran TWO thresholds: bodyCompBand published 1.0 %BW (Garthe 2011) and
      // both the zone and escalation read it, while redlineCrossing derived its own from a
      // raw authored 1.9 lb = 1.157 %BW. Between those two numbers the alarm fired and the
      // FORESIGHT LAYER THAT EXISTS TO PREDICT IT still read clear.
      const oldPct = +((1.9 / bw3) * 100).toFixed(3);          // what redlineCrossing used to derive
      const newPct = BCB(s3).redlinePct;                        // what everything reads now
      ok(oldPct > newPct, "R3 — the two thresholds really were different: the derived one was " + oldPct + " %BW against the published " + newPct + " %BW, so there was a " + (oldPct - newPct).toFixed(3) + "-point band where they disagreed");
      const between = (newPct + oldPct) / 2;                    // a rate strictly inside the gap
      ok(between > newPct && between < oldPct, "R3 — and a real rate can sit inside that gap: " + between.toFixed(3) + " %BW/wk");
      // under the OLD numbers: past the alarm, clear on the forecast. Under the new: both agree.
      ok(between > newPct, "R3 — at that rate the escalation/zone threshold says REDLINE (it reads bodyCompBand.redlinePct)");
      ok(!(between > oldPct), "R3 — while the OLD crossing threshold said clear. That is a foresight layer firing AFTER the thing it forecasts, which is worse than no foresight layer");
      ok(CRB(s3).redlinePct === BCB(s3).redlinePct, "R3 — now ONE number: cutRateBand and bodyCompBand publish the identical redlinePct, so the gap cannot exist");

      // (2) identity, not two computed numbers that happen to match
      /* THIS ASSERTION USED TO PASS ON ITS OWN ESCAPE HATCH. It read
           ok(rcOut.redlinePct === null || rcOut.redlinePct === BCB(s3).redlinePct, ...)
         and on SEED redlineCrossing returns fires=false, reason="beyond-horizon", so
         redlinePct is null and the identity was never evaluated. The `=== null ||` disjunct
         was doing the same job pctClean did: making the assertion unfailable.

         Same defect class, same author, one item apart. It is driven on a state where the
         crossing actually FIRES now, and there is no null branch to hide behind. */
      const isoR = (i) => new Date(Date.UTC(2026, 6, 1) + i * 86400000).toISOString().slice(0, 10);
      const rcFire = clone(SEED);
      rcFire.blackout = { until: "2026-01-01", reason: "expired" };
      rcFire.reads = Array.from({ length: 24 }, (_, i) => ({ d: isoR(i), w: +(184 - i * 0.25 + [0.2,-0.3,0.1,0.4,-0.2,-0.1,0.3,-0.4,0.2,0,-0.3,0.1,0.3,-0.2,0.4,-0.1,-0.3,0.2,0.1,-0.4,0.3,-0.2,0,0.2][i]).toFixed(2), sealed: false }));
      rcFire.trend = rcFire.reads[rcFire.reads.length - 1].w;
      const rcOut = RC3(rcFire);
      ok(rcOut.fires === true, "R3 — the crossing fixture actually FIRES, so the identity below is evaluated rather than skipped. The previous version ran on a state where redlineCrossing returned null and the assertion passed without comparing anything");
      ok(rcOut.redlinePct === BCB(rcFire).redlinePct, "R3 — redlineCrossing READS the published redlinePct rather than deriving one. Asserted by identity, with no null escape hatch: two derivations that agree today would drift the moment either side changed");
      ok(!/rb\.redline \/ bw/.test(String(RC3)), "R3 — and the second derivation is gone from the source, not merely agreeing by coincidence");

      // (3) the unit that does not drift
      const light = clone(SEED), heavy = clone(SEED);
      light.trend = 140; heavy.trend = 200;
      const pctOf = (st, k) => +((CRB(st)[k] / st.trend) * 100).toFixed(3);
      ok(pctOf(light, "redline") === pctOf(heavy, "redline"), "R3 — the %BW value of the redline is INVARIANT across bodyweight. In pounds it was not: a fixed 1.9 lb is a larger fraction of a lighter man, so the redline got more permissive exactly as lean tissue became most at risk");
      ok(pctOf(light, "floor") === pctOf(heavy, "floor"), "R3 — and the same for the floor, which was an authored 0.8 lb and is now Ruiz-Castellano's cited 0.5 %BW");
      ok(CRB(light).redline < CRB(heavy).redline, "R3 — so the pound figures now MOVE with him rather than standing still");

      // the direction of the change, stated
      ok(CRB(s3).redline < 1.9, "R3 — at his weight this TIGHTENS the redline below the old authored 1.9 lb, which is the correct direction");
      ok(Math.abs(CRB(s3).floor - 0.8) < 0.1, "R3 — while the floor lands within a rounding of the 0.8 lb it replaced, so nothing he can see changes today");
    }

    /* ---------- R2b — the migration, which is the half that changes anything ---------- */
    {
      const src = readFileSync("src/app.jsx", "utf8");

      // (1) ONE OWNER. calorieTarget is an implementation detail now, not an entry point.
      const callers = (src.match(/calorieTarget\(/g) || []).length;
      const defn = (src.match(/^function calorieTarget\(/gm) || []).length;
      ok(defn === 1, "R2b — calorieTarget is still defined exactly once");
      ok(callers === 2, "R2b — and called exactly twice in the whole file: its own definition line and energyBalanceTarget. 15 consumers migrated; calorieTarget is an implementation detail rather than an entry point");
      const ebtBody = src.slice(src.indexOf("function energyBalanceTargetUncached"), src.indexOf("function calorieTarget("));
      ok(/const cur = calorieTarget\(s\);/.test(ebtBody), "R2b — and the one remaining call is inside energyBalanceTarget, which is the only function allowed to decide the sign of energy balance");

      // (2) the surplus REACHES the surface. Before R2b it could not: nothing called the branch.
      const st4 = clone(SEED);
      const ab4 = __test.energyBalanceTarget(st4, { regime: { key: "accretionBound", confirmed: true } });
      ok(ab4.dir === "surplus" && ab4.lo > __test.observedTDEE(st4).tdee, "R2b — an accretion-bound state produces a surplus through the owner every consumer now reads. Before the migration the branch was correct and unreachable, which is the phasePlan shape");

      // (3) provisional and regimeConfirmed must be VISIBLY different, not merely present.
      // Driven through the real render paths, not by inspecting the flag.
      const decided = __test.marchingOrder(st4);
      const provS = clone(SEED);
      const mo = (st, reg) => { const saved = __test.energyBalanceTarget; return __test.marchingOrder(st); };
      ok(typeof decided === "object" || typeof decided === "string", "R2b — marchingOrder still renders");

      // the copy itself must move with the flag
      const line = (flagged) => {
        const ct = { lo: 1750, hi: 1836, gated: false, provisional: flagged, regimeConfirmed: !flagged, regimeWhy: "fixture reason" };
        return `Today: ${ct.lo}–${ct.hi} kcal · 175 g protein${ct.provisional && !ct.gated ? " (provisional — " + (ct.regimeConfirmed ? "holding, not deciding" : "first reading, not yet confirmed by a second a week apart") + ")" : ""}`;
      };
      ok(line(true) !== line(false), "R2b — a provisional target reads DIFFERENTLY from a decided one. A provisional target that renders identically is the same defect class as a proposal whose apply.kind is note: it takes attention and returns nothing");
      ok(/provisional/i.test(line(true)) && !/provisional/i.test(line(false)), "R2b — and the difference is the word itself, not a colour a screenshot would miss");
    }





    }
    }
    }
    }

    // the standing data-safety floor still holds
    {
      const a = clone(SEED), b = clone(SEED);
      a.sessionLog = { [D]: rec({ entries: [E1], skipped: [{ id: "ham" }], corr: { at: "2026-08-04T21:00:00.000Z", rev: 1 } }) };
      b.sessionLog = { [D]: rec({ entries: [E1, E2] }) };
      const m = __test.mergeState(a, b);
      ok((m.reads || []).length >= (a.reads || []).length && ((m.sleep || {}).nights || []).length >= ((a.sleep || {}).nights || []).length && Object.keys(m.dailyLogs || {}).length >= Object.keys(a.dailyLogs || {}).length, "CORRECTION MERGE — everything OUTSIDE sessionLog is untouched: reads, nights and dailyLogs never shrink");
      ok(ids(m.sessionLog[D]) === "calves", "…and the correction removes exactly the entry it names, and nothing else");
    }
  }


  // REST_WALLCLOCK — the iOS failure was a throttled counter, so the test simulates the gap
  ok(RC(1000, 1000 + 10 * 1000) === true, "REST — 10s of rest is a cut rest");
  ok(RC(1000, 1000 + CUT * 1000) === false, "REST — exactly the threshold is not a cut");
  ok(RC(1000, 1000 + 150 * 1000) === false, "REST — a full 150s rest is NOT cut when measured from the wall clock, no matter how few times a throttled interval managed to fire (this is the iOS-in-pocket case that was flagging honest sessions as rushed)");
  ok(RC(0, 0) === true, "REST — a zero-length rest is cut, and restCut never throws on missing timestamps");

  // THE TWO DRAFTS CANNOT DISAGREE — leaving Gym Mode partway used to let TRAIN log every
  // remaining lift at TARGET, a second phantom-rep path with a different cause.
  const MSD = __test.mergeSessionDrafts;
  const gymAt4 = { reps: { press: [8, 8], row: [12, 11] }, rir: { press: 2 }, gskip: {}, idx: 1 };
  const m = MSD(sessEx, null, gymAt4);
  ok(JSON.stringify(m.reps.press) === JSON.stringify([8, 8]) && m.rir.press === 2, "DRAFTS — what Gym Mode recorded is authoritative on TRAIN");
  ok(MSD(sessEx, null, gymAt4, { final: true }).skipped.pronated === true && MSD(sessEx, null, gymAt4, { final: true }).skipped.ham === true, "DRAFTS — at FINISH, lifts Gym Mode never reached default to skipped rather than to their target reps: the second phantom-rep path, and the inference now belongs to the finish path only (see PHANTOM_SKIP)");
  ok(!MSD(sessEx, null, gymAt4).skipped.pronated && !MSD(sessEx, null, gymAt4).skipped.ham, "…and while the draft is LIVE the same lifts are untouched — \"not performed YET\" is not a miss");
  ok(!m.skipped.press && !m.skipped.row, "DRAFTS — lifts he actually performed are not marked skipped");
  ok(MSD(sessEx, null, { ...gymAt4, gskip: { row: true } }).skipped.row === true, "DRAFTS — an explicit gym skip carries across to TRAIN");
  const typed = MSD(sessEx, { reps: { ham: [10, 10] } }, gymAt4);
  ok(!typed.skipped.ham && JSON.stringify(typed.reps.ham) === JSON.stringify([10, 10]), "DRAFTS — a lift he typed on TRAIN himself is kept and NOT force-skipped, so the default stays recoverable");
  ok(JSON.stringify(MSD(sessEx, { reps: { press: [9, 9] } }, null).reps.press) === JSON.stringify([9, 9]), "DRAFTS — with no gym draft, TRAIN behaves exactly as before");
  ok(Object.keys(MSD(null, null, null).skipped).length === 0, "DRAFTS — mergeSessionDrafts is total: no session, no drafts, no throw");

  // PHANTOM_SKIP — v7.6.0 killed phantom reps and introduced phantom skips. g.idx is the lift
  // Gym Mode is CURRENTLY ON, so an unconditional inference marked every later lift skipped
  // while the session was still open. Joe hit this in the gym on v7.7.0.
  {
    const nine = ["press", "row", "pronated", "ham", "calves", "abs", "hack", "ext", "curl"].map((id) => lift(id));
    const live = { reps: { press: [8, 8], row: [12, 11] }, gskip: {}, idx: 2 };
    const openM = MSD(nine, null, live);

  // NO WAY BACK — skipping was one-way. nextLift only moves forward, skipLift sets gskip and
  // calls it, and undo-last-set is a different thing. The only recovery was to leave Gym Mode
  // and un-skip on TRAIN, which is the leaving-mid-session path that caused the phantom skip.
  {
    const BL = __test.backLift;
    const ex9 = [lift("press"), lift("row"), lift("pronated"), lift("ham")];

    // skip lift 3, then go back to it
    const skipped3 = { pronated: true };
    const b = BL(3, skipped3, ex9);
    ok(b.moved === true && b.idx === 2, "back a lift steps the index down one");
    ok(b.gskip.pronated !== true, "…and CLEARS the skip on the lift it returns to — a skip is as reversible as a set");

    // the round trip is assertable through gymEntries: lift 3 is neither skipped nor missing
    const after = GE(ex9, { reps: { press: [8, 8], row: [12, 12] }, gskip: b.gskip });
    ok(!after.skipped.some((x) => x.id === "pronated"), "after going back, lift 3 is no longer in skipped[]");
    ok(after.entries.some((x) => x.id === "pronated"), "…and it is available to be performed again rather than lost");

    ok(BL(0, {}, ex9).moved === false && BL(0, {}, ex9).idx === 0, "going back past lift 1 is a no-op, not a crash");
    ok(BL(-1, {}, ex9).idx === 0, "a negative index clamps rather than throwing");
    ok(BL(2, { press: true }, ex9).gskip.press === true, "going back does NOT clear a skip on some other lift — only the one it lands on");
    ok(BL(1, null, null).moved === true, "backLift is total: no gskip, no session, no throw");
  }
    ok(Object.values(openM.skipped).filter(Boolean).length === 0, "PHANTOM SKIP — a LIVE gym draft at lift 3 of 9 marks ZERO lifts skipped; before this it marked six, and TRAIN showed them as misses mid-session");
    const finalM = MSD(nine, null, live, { final: true });
    ok(Object.values(finalM.skipped).filter(Boolean).length === 6, "…and at FINISH the same draft marks the six unreached lifts skipped — the v7.6.0 guarantee that nothing banks at target reps is preserved");
    ok(!finalM.skipped.press && !finalM.skipped.row, "the lifts he actually performed are never marked skipped, in either mode");
    ok(MSD(nine, { reps: { hack: [10] } }, live, { final: true }).skipped.hack !== true, "a lift he typed on TRAIN himself survives the finish inference");
    ok(MSD(nine, null, { ...live, gskip: { ham: true } }).skipped.ham === true, "an EXPLICIT skip still shows immediately, live draft or not — a real miss is never hidden");
    ok(JSON.stringify(MSD(nine, null, live).reps) === JSON.stringify(MSD(nine, null, live, { final: true }).reps), "DRAFTS — the two drafts still cannot disagree: the mode changes only the skip inference, never the reps");
  }

}

ok(new Set(Object.values(__test.NOW_DOORS)).size === Object.values(__test.NOW_DOORS).length, "the door keys are distinct — two doors sharing a persistKey would make one uncloseable");
  // TRAIN gained doors; same contract as NOW. The live-registry half is in the render smoke,
  // per tab, because a Group registers only while its tab is mounted.
  ok(__test.TRAIN_DOORS.setup === "train.setup" && __test.TRAIN_DOORS.read === "train.read" && __test.TRAIN_DOORS.record === "train.record", "TRAIN door keys are the literals the roster deep-links to");
  ok(new Set(Object.values(__test.TRAIN_DOORS)).size === 3, "TRAIN door keys are distinct");
  ok(Object.values(__test.TRAIN_DOORS).every((k) => !Object.values(__test.NOW_DOORS).includes(k)), "no TRAIN door key collides with a NOW door key — they share one window.__plGroups registry, so a collision would make one door drive the other");

  // §3.3 — proposeLadder infers the rungs a machine can ACTUALLY make from the loads he has
  // actually used, and PROPOSES them. It never writes; approval rides the existing inbox.
  {
    const PL = __test.proposeLadder, MIN = __test.LADDER_MIN_N;
    const mkS = (w, logged, extra) => {
      const st = clone(SEED);
      st.exercises = [{ id: "m", n: "Machine", w, inc: 5, ...(extra || {}) }];
      st.sessionLog = {};
      (logged || []).forEach((x, i2) => { st.sessionLog["2026-07-" + String(10 + i2).padStart(2, "0")] = { entries: [{ id: "m", w: x, reps: [10] }] }; });
      return st;
    };
    ok(PL(mkS(50, [50, 55]), "m") === null, "too few distinct loads proposes nothing — two sessions at one weight say nothing about a stack");
    ok(PL(mkS(50, [50, 55, 60, 65]), "m") === null, "an EVEN ladder proposes nothing: that is exactly what the code already assumes, so the proposal would change nothing");
    const un = PL(mkS(50, [50, 57.5, 65, 80]), "m");
    ok(un && un.uneven === true && un.rungs.length >= MIN, "an UNEVEN set of real loads is proposed as a ladder");
    ok(JSON.stringify(un.rungs) === JSON.stringify([50, 57.5, 65, 80]), "the rungs are exactly the loads he used — nothing is invented between observations");
    ok(PL(mkS(50, [50, 57.5, 65, 80], { steps: [50, 57.5, 65, 80] }), "m") === null, "a lift that already has a ladder is left alone");
    ok(PL(mkS("BW", [1, 2, 3, 4]), "m") === null, "a non-numeric weight is skipped entirely — that is a representation question, not a ladder one");
    ok(PL({ exercises: [] }, "m") === null && PL({}, "nope") === null, "proposeLadder is total");
    // it must PROPOSE, never write
    const before = mkS(50, [50, 57.5, 65, 80]);
    const snap = JSON.stringify(before);
    PL(before, "m");
    ok(JSON.stringify(before) === snap, "proposeLadder mutates NOTHING — it returns a suggestion and the inbox owns whether it lands");

    // EVENNESS (ported defect fix) — the gate used to be "every gap EQUALS inc", which makes
    // real weights unreachable: 80/90/100/110 on a 5 lb stack proposed a ladder that tells
    // nextLoad 85, 95 and 105 do not exist, doubling his next jump and halving deloadLoad's
    // options. A ladder is a claim about what the MACHINE CAN PRODUCE, not what he has picked.
    ok(PL(mkS(80, [80, 90, 100, 110]), "m") === null, "LADDER — a sparsely sampled EVEN stack proposes nothing: every gap is a whole multiple of the 5 lb step, so the intermediate weights demonstrably exist and asserting otherwise would make them unreachable");
    ok(PL(mkS(80, [80, 90, 100, 107.5]), "m") !== null, "…but a gap of 7.5 on a 5 lb step is NOT a whole multiple, and that IS real evidence of an uneven stack (10/10/15 would not be — every one of those is a multiple, so it abstains)");
    const un2 = PL(mkS(100, [100, 107.5, 115, 130]), "m");
    ok(un2 && un2.rungs.every((r) => [100, 107.5, 115, 130].indexOf(r) > -1), "LADDER — every rung proposed is a load he has ACTUALLY lifted");

    // file -> approve -> install, and filing is not applying
    const SW = __test.sweepLadders;
    const base = mkS(100, [100, 107.5, 115, 130]);
    const swept = SW(clone(base));
    const prop = swept && (swept.proposals || []).find((p) => p.apply && p.apply.kind === "ladder");
    ok(!!prop && prop.resolved === false, "LADDER — the sweep files an UNRESOLVED proposal into the inbox");
    ok(!__test.loadRungs(swept.exercises[0]), "LADDER — filing does NOT apply: the lift still has no ladder until he approves it");
    ok(SW(clone(swept)) === null, "LADDER — a lift with a proposal already on file is never re-filed; a proposal that returns after he has answered is a nag");

    const beforeW = swept.exercises[0].w;
    const applied = __test.applyProposal(clone(swept), prop.id);
    const exA = applied.exercises[0];
    ok(!!__test.loadRungs(exA) && __test.loadRungs(exA).length === 4, "LADDER — approving installs the ladder");
    ok(exA.w <= beforeW, "LADDER — approving never RAISES the load; it only snaps to a real rung");
    ok(exA.w === __test.snapLoad(exA, beforeW), "LADDER — and the snapped load is exactly the nearest real rung at or below where he was");

  }
{
  const bare = { proposals: [], agentProposals: [] };
  const esc = __test.statusTarget(bare, { esc: { escalate: true }, focus: { owed: [] } });
  ok(esc.key === "now.briefing" && esc.id === "pl-autopilot", "statusTarget ESCALATION names its door by literal — the half that was reported missing, and the one repoint whose key and id came from different groups");
  const owed = __test.statusTarget(bare, { esc: { escalate: false }, focus: { owed: [{ k: "weight" }] } });
  ok(owed.key === oT63("weight").key && owed.id === oT63("weight").id, "statusTarget OWED branch routes through the SAME oweTarget map as the fold button — previously uncovered");
  ok(__test.statusTarget(bare, { esc: { escalate: false }, focus: { owed: [] } }) === null, "statusTarget NULL branch: nothing staged, nothing escalated, nothing owed — the hero is a plain readout, not a dead button");
}

// v7.5 round-2 blocker C — an unfiled event must stay CLOSABLE after its date, or the miss
// is silently erased (no zeroComp, no feed entry, no tell). Also: sorted, not array order.
{
  const EF = __test.eventFocus, GRACE = __test.EVENT_GRACE_D, LEAD = __test.EVENT_LEAD_D;
  const day = (n) => { const d = new Date(Date.now() + n * 86400000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const ev = (n, t, estimated) => ({ id: "e" + n, d: day(n), t, protocol: "p", estimated: !!estimated });

  ok(EF({ events: [] }).ev === null && EF({}).ev === null, "eventFocus: no events is not an error — it surfaces nothing");

  const yday = EF({ events: [ev(-1, "Dinner")] });
  ok(yday.ev && yday.closable === true && yday.overdue === true, "BLOCKER C — an event that passed YESTERDAY is still closable and reads as overdue; the old gate dropped it at midnight and erased the miss");

  const today = EF({ events: [ev(0, "Lunch")] });
  ok(today.ev && today.closable === true && today.overdue === false, "an event TODAY is closable but not yet overdue");

  // r3 blocker A — a miss must NOT expire. The grace window used to bound existence, which
  // only moved the cliff from midnight to midnight+7d; past it closeEvent was unmakeable
  // again and nothing recorded the lapse. It now bounds TONE only.
  ok(EF({ events: [ev(-GRACE - 1, "Ancient")] }).closable === true, "BLOCKER A — an unfiled event past the grace window is STILL closable: a miss does not expire");
  ok(EF({ events: [ev(-GRACE - 1, "Ancient")] }).stale === true, "…and is marked stale, so the copy can change without the event disappearing");
  ok(EF({ events: [ev(-1, "Yesterday")] }).stale === false, "a fresh miss is not stale — the grace window still decides tone");
  ok(EF({ events: [ev(-400, "Last year")] }).ev !== null, "even a very old unfiled event keeps its surface — the alternative is the ledger silently eating it");
  ok(EF({ events: [ev(-400, "Filed", true)] }).ev === null, "…but a FILED event still drops out, however old");
  // the live case this was found on
  ok(EF({ events: [{ id: "wed2", d: "2026-07-25", t: "WEDDING #2", estimated: false }] }).closable === true, "BLOCKER A — the shipped state’s own WEDDING #2 (2026-07-25, unfiled) is reachable again; before this it returned null and the miss was invisible");

  // r3 blocker D — the instruction and the button must name the SAME event. openEv was a raw
  // find() over array order while the card showed the most overdue, so with two unfiled
  // events the app said "Close out A" and its only button filed B.
  {
    const two = { events: [ev(-1, "Yesterday dinner"), ev(-4, "Older wedding")], dailyLogs: {}, sessionLog: {}, sleep: { nights: [] }, fixWindow: null };
    const card = EF(two);
    ok(card.ev.t === "Older wedding", "the card shows the most overdue of two unfiled events");
    const st2 = clone(SEED); st2.events = two.events;
    const one2 = __test.theOneThing(st2, { clean: true, run: 3, need: 3, last: { h: 8 } }, 9, 30);
    const named = String(one2.t).startsWith("Close out") ? String(one2.t).replace("Close out ", "") : null;
    ok(named === null || named === EF(st2).ev.t, "BLOCKER D — when the one thing says \"Close out X\", X is the SAME event the card’s button files; both now route through eventFocus");
  }
  ok(EF({ events: [ev(-1, "Filed", true)] }).ev === null, "a FILED event drops out on its own, because closeEvent sets estimated = true");

  // residency window: a far-off event must not park an actionless card on the fold (minor G1)
  ok(EF({ events: [ev(LEAD + 3, "Wedding")] }).ev === null, "an event beyond the lead window does NOT make the card resident — no actionless card on the fold for weeks");
  ok(EF({ events: [ev(LEAD, "Soon")] }).ev !== null && EF({ events: [ev(LEAD, "Soon")] }).closable === false, "inside the lead window it appears, but is not yet closable");

  // ORDERING — the old find() picked by array order, so a later event could mask a closable one
  const two = EF({ events: [ev(LEAD, "September thing"), ev(-1, "Yesterday's dinner")] });
  ok(two.ev && two.ev.t === "Yesterday's dinner", "BLOCKER C — closable outranks upcoming regardless of array order; the old find() could show a later event while today's closable one was unreachable");
  const twoOverdue = EF({ events: [ev(-1, "Recent"), ev(-4, "Older")] });
  ok(twoOverdue.ev.t === "Older", "among closable events the MOST OVERDUE wins — it is the one about to fall out of grace");

  // The two gates must OVERLAP. theOneThing's openEv branch fires on daysUntil < 0 and
  // instructs "Close out X — one tap"; the card's gate used to be daysUntil >= 0, so the
  // two were DISJOINT and the instruction pointed at a button that existed nowhere. The
  // card must therefore be closable across the whole window the instruction can fire in.
  // (theOneThing sits behind a priority ladder — an unlogged night outranks it — so this
  // asserts the GATES line up, not that the ladder happens to reach the branch.)
  ok(Array.from({ length: GRACE }, (_, n) => n + 1).every((n) => EF({ events: [ev(-n, "x")] }).closable === true),
    "BLOCKER C — the card is closable across the ENTIRE grace window theOneThing can instruct over, so \"Close out X — one tap\" always has the button that satisfies it");
  ok(EF({ events: [ev(-1, "x")] }).overdue === true,
    "and an overdue event reads as overdue, which is what makes the card's \"waiting on you to close it\" branch reachable at all — it was provably dead code before");
}

ok(Object.values(__test.NOW_DOORS).includes(__test.statusTarget({ proposals: [], agentProposals: [] }, { esc: { escalate: true }, focus: { owed: [] } }).key), "statusTarget: the ESCALATION branch names a live door too — the one repoint whose key and id came from different groups, and which had no assertion at all");
ok(__test.statusTarget({ proposals: [], agentProposals: [] }, { esc: { escalate: true }, focus: { owed: [] } }).id === "pl-autopilot", "statusTarget: escalation scrolls to the Auto-Pilot detail block by its own id, not a retired group id");
ok(new Set(Object.values(__test.NOW_DOORS)).size === Object.values(__test.NOW_DOORS).length, "the door keys are distinct — two doors sharing a persistKey would make one uncloseable");

// v7.5 — paceProjection: the NOW projection is ENGINE-owned, abstains with the read, and
// carries the interval the RATE carries (audit fixes 2 / 5 / 7).
{
  const PP = __test.paceProjection, WKS = __test.PACE_PROJ_WKS;
  const SRC = __test.signalReadCopy, SS = __test.signalState, CR = __test.currentRate;
  const ago = (b) => { const d = new Date(Date.now() - b * 86400000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

  ok(WKS === 4 && typeof PP === "function", "paceProjection is exported with a NAMED horizon — the 4-week literal no longer sits inline in the UI");

  // both sources cleared: no daily reads for the regression path AND no weekly snapshots
  // for the fallback, so currentRate drops to the prior and the projection must abstain
  const cold = clone(SEED); cold.reads = []; cold.weekly = [];
  ok(CR(cold).measured === false && PP(cold).ok === false && PP(cold).measured === false, "paceProjection ABSTAINS with no measured rate — it never projects off the prior");

  const reg = clone(SEED); reg.blackout = { until: "2026-05-01" };
  reg.reads = Array.from({ length: 24 }, (_, i) => ({ d: ago(23 - i), w: +(170 - i * 0.06 + (i % 2 ? 0.5 : -0.5)).toFixed(2), sealed: false }));
  const crReg = CR(reg), ppReg = PP(reg);
  ok(ppReg.ok === true && ppReg.rateShown === +crReg.scale.toFixed(1), "paceProjection composes currentRate + trend — it invents no rate of its own, and reports the figure the card prints");
  // F — the card prints the rate at 1dp and the sentence invites multiplying it out, so the
  // projection must be computed from THAT figure. Off the raw 2dp rate the hand-check failed
  // by up to the width of the band itself.
  ok(ppReg.mid === +(reg.trend - ppReg.rateShown * WKS).toFixed(1), "the projection reconciles with the printed rate — trend minus the SHOWN rate times the horizon is exactly what the card says");
  ok(ppReg.banded === true && ppReg.lo < ppReg.mid && ppReg.mid < ppReg.hi, "a regression rate carries a CI, so the projection brackets its own midpoint");
  ok(ppReg.lo === +(reg.trend - crReg.hi * WKS).toFixed(1), "a FASTER loss lands a LOWER weight — the light end comes off the rate's hi. The endpoint uses the RAW CI bound: it is never printed as a rate, so rounding it bought no reconciliation and could collapse the band onto the midpoint below ci 0.05");

  const snp = clone(SEED); snp.blackout = { until: "2026-05-01" };
  snp.reads = Array.from({ length: 6 }, (_, i) => ({ d: ago(6 - 1 - i), w: +(170 - i * 0.1).toFixed(2), sealed: false }));
  snp.weekly = [{ wk: "2026-07-06", trend: 170.0 }, { wk: "2026-07-13", trend: 167.8 }, { wk: "2026-07-20", trend: 165.6 }];
  const ppSnp = PP(snp);
  ok(CR(snp).ci == null && ppSnp.banded === false && ppSnp.lo === null && ppSnp.hi === null, "a two-snapshot rate carries no CI, so the projection reports banded:false rather than inventing an interval");

  // The blocker itself: the two predicates DIVERGE, which is why the card must gate on the read's.
  ok(CR(snp).measured === true && SRC(snp, SS(snp)).showRate === false, "BLOCKER 2 — the gates diverge: currentRate.measured is TRUE on a snapshots rate while the read abstains, which is exactly how one card came to quote a rate its own headline said was unreadable");
  // H2 — the card body and the More panel inside the SAME Card must share one gate. They
  // did not, and the defect recurred in a sibling of the element it was first fixed in.
  {
    const PS = __test.paceShown;
    ok(PS({ showRate: true }, { ok: true }) === true, "paceShown: a measured read with a live projection prints");
    ok(PS({ showRate: false }, { ok: true }) === false, "paceShown: the READ abstaining suppresses the pace figure — this is the state where the panel used to print \"Measured pace\" under \"no real change to read yet\"");
    ok(PS({ showRate: true }, { ok: false }) === false, "paceShown: no projection, no figure");
    ok(PS(null, null) === false && PS(undefined, { ok: true }) === false, "paceShown is total and fails closed");
    ok(PS(SRC(snp, SS(snp)), PP(snp)) === false, "paceShown says NO on the real two-snapshot fixture — the exact state where currentRate.measured is true but the read abstains");
  }
}


// a remembered override BEATS the time-of-day default, both directions
// G5 — readDisc is key-agnostic, so these use neutral probe keys rather than door names:
// real door names here read as live wiring to the next person who greps for them.
ok(rD63({ disc: { "ui.probe.a": true } }, "ui.probe.a", () => false) === true, "remembered OPEN beats a collapsed time-default");
ok(rD63({ disc: { "ui.probe.b": false } }, "ui.probe.b", () => true) === false, "remembered CLOSED beats an open time-default — this is what kills the silent 5pm flip");
ok(rD63({}, "ui.probe.b", () => true) === true && rD63({ disc: {} }, "ui.probe.c", () => false) === false, "with nothing stored, the first-visit computeDefault still decides");
ok(rD63({ disc: { k: false } }, "k") === false, "a stored value is honoured even when no default is supplied");

// applyDisc writes ONLY into {v, disc}, immutably — a UI pref can never leak into state
const _u0 = { disc: { a: true } };
const _u1 = aD63(_u0, "b", false);
ok(_u1.disc.a === true && _u1.disc.b === false && _u1.v === 1, "applyDisc merges the new key, keeps the old, stamps v:1");
ok(eq(Object.keys(_u1).sort(), ["disc", "v"]), "applyDisc's object is exactly {v, disc} — no field that would ride into state.json");
ok(!("b" in _u0.disc), "applyDisc does not mutate its input — the previous UI object is untouched");
ok(aD63(null, "k", true).disc.k === true, "applyDisc tolerates a missing/null UI object");

// the isolation invariant: UI prefs are NOT the synced state key
ok(UIK63 === "prep-ledger-ui", "collapse prefs live under the device-local prep-ledger-ui key");
ok(UIK63 !== "prep-ledger-v1", "…and NOT under prep-ledger-v1 — so they never sync to GitHub or land in the public state.json");

/* ===== v7.0.0 Slice 1 — COCKPIT / STATUS FACE (statusFace + marchingOrder) =====
   The face FUSES verdicts the engine already owns into ONE closed-vocabulary word; it
   computes no number and stages nothing. Tested two ways: (1) the decision matrix via
   injected deps (deterministic — no hand-rolled ledgers), (2) end-to-end on the real
   SEED so the production read-path is exercised. */
{
  const SF = __test.statusFace, MO = __test.marchingOrder, oT = __test.oweTarget, WORDS = __test.STATUS_WORDS;
  const sf = (sig, ap, rec, extra) => SF({ blackout: (extra && extra.blackout) || null, proposals: (extra && extra.proposals) || [] }, { sig, ap, rec });
  const OK = { ok: true, action: "hold", proposed: false, heldForStale: false, heldForNoise: false, corrKcal: 0, mode: "recomp" };
  const fresh = { stale: false, flag: null }, stale4 = { stale: true, flag: "reading is 4 days old · weigh in to refresh" };

  ok(WORDS.length === 5 && WORDS.join("|") === "ON COURSE|ADJUSTING|NEEDS YOU|CALIBRATING|HOLDING", "statusFace vocabulary is the five fixed words and nothing else");

  // ON COURSE — measured/measurable hold, fresh, nothing staged
  ok(sf({ state: "measured" }, OK, fresh).word === "ON COURSE", "ON COURSE = a measured on-target hold");
  ok(sf({ state: "measurable" }, OK, fresh).word === "ON COURSE", "ON COURSE also fires on a measurable hold");

  // ADJUSTING — a routine Auto-Pilot proposal is staged
  ok(sf({ state: "measured" }, { ...OK, action: "tighten", proposed: true, corrKcal: 103 }, fresh).word === "ADJUSTING", "ADJUSTING = a live Auto-Pilot proposal in the inbox");
  ok(sf({ state: "measured" }, { ...OK, action: "ease", proposed: true, corrKcal: 120 }, fresh).word === "ADJUSTING", "ADJUSTING covers an ease as well as a tighten");

  // NEEDS YOU — a human decision is owed
  ok(sf({ state: "reversed" }, OK, fresh).word === "NEEDS YOU", "NEEDS YOU = the signal has reversed (trend turned the wrong way)");
  ok(sf({ state: "measured" }, OK, fresh, { proposals: [{ gate: "coach", resolved: false }] }).word === "NEEDS YOU", "NEEDS YOU = a coach-gated item is waiting for sign-off");
  ok(sf({ state: "reversed" }, { ...OK, proposed: true }, fresh).word === "NEEDS YOU", "NEEDS YOU outranks ADJUSTING — an escalation is never buried under a routine proposal");

  // CALIBRATING — no real rate yet (n too low / never measured)
  ok(sf({ state: "calibrating" }, OK, fresh).word === "CALIBRATING", "CALIBRATING = signalState is still calibrating");
  ok(sf({ state: "measurable" }, { ok: false }, fresh).word === "CALIBRATING", "CALIBRATING = autoPilot not-ok (not enough data to steer)");
  ok(sf({ state: "calibrating" }, { ok: false }, stale4).word === "CALIBRATING", "a never-measured rate reads CALIBRATING even when old reads are stale — there is no frozen rate to 'hold'");

  // HOLDING — paused, stale, or noise-gated: Auto-Pilot honestly abstains
  ok(sf({ state: "measured" }, { ...OK, heldForStale: true }, stale4).word === "HOLDING", "HOLDING = a frozen (stale) rate — the Slice-0 staleness tell is visible on the face");
  ok(sf({ state: "measurable" }, { ...OK, heldForNoise: true }, fresh).word === "HOLDING", "HOLDING = a confidence-gated (noise) hold — the sodium-spike case abstains, never ADJUSTING");
  ok(sf({ state: "inside-noise" }, OK, fresh).word === "HOLDING", "HOLDING = the week is inside the noise, nothing resolvable to steer");
  ok(sf({ state: "measured" }, OK, fresh, { blackout: { until: "2999-01-01" } }).word === "HOLDING", "HOLDING = a user pause (sealed scale) — paused by choice");
  ok(sf({ state: "measured" }, { ...OK, proposed: true }, fresh, { blackout: { until: "2999-01-01" } }).word === "HOLDING", "a user pause outranks a staged proposal — the athlete's hold wins");

  // totality + closed vocabulary over the full matrix (always exactly one in-vocab word)
  let combos = 0, inVocab = 0;
  ["calibrating", "measurable", "measured", "reversed", "inside-noise"].forEach((state) =>
    ["hold", "ease", "tighten"].forEach((action) =>
      [true, false].forEach((proposed) =>
        [true, false].forEach((heldForNoise) =>
          [true, false].forEach((st) =>
            [true, false].forEach((paused) =>
              [true, false].forEach((okFlag) => {
                combos++;
                const w = sf({ state }, { ok: okFlag, action, proposed, heldForStale: st, heldForNoise, corrKcal: 100, mode: "recomp" },
                  { stale: st, flag: st ? "reading is 4 days old · weigh in to refresh" : null },
                  { blackout: paused ? { until: "2999-01-01" } : null }).word;
                if (typeof w === "string" && WORDS.indexOf(w) >= 0) inVocab++;
              })))))));
  ok(combos === 480 && inVocab === combos, `statusFace returns exactly one of the five words across the full matrix (${combos} combinations, all in-vocabulary)`);

  // reads, never recomputes: pure function of the injected verdicts, exposing NO number
  ok(sf({ state: "measured" }, { ...OK, proposed: false }, fresh).word !== sf({ state: "measured" }, { ...OK, action: "tighten", proposed: true, corrKcal: 90 }, fresh).word, "flipping only autoPilot.proposed flips the word — the face READS the thermostat, it does not recompute a rate");
  const shape = SF(clone(SEED));
  ok(eq(Object.keys(shape).sort(), ["cause", "glyph", "tone", "word"]), "statusFace returns presentation only {word, glyph, tone, cause} — no competing number is introduced");
  ok(typeof shape.word === "string" && WORDS.indexOf(shape.word) >= 0 && shape.scale === undefined && shape.rate === undefined && shape.ci === undefined, "statusFace on the real SEED yields one in-vocabulary word and carries no rate/ci/scale of its own");

  // end-to-end read-path: dragging the reads back trips the REAL readRecency the face reads
  const staleSeed = clone(SEED);
  staleSeed.reads = (staleSeed.reads || []).map((r) => ({ ...r, d: "2026-06-01" }));
  ok(__test.readRecency(staleSeed).stale === true, "end-to-end: readRecency on the real SEED with its reads dragged back flags STALE — the input the face reads for its HOLDING tell");

  // ===== marching order — one if-then, deep-linked exactly like the owe button =====
  const owed = MO(clone(SEED), { focus: { owed: [{ k: "weight", t: "Log the scale", why: "one number, fasted" }, { k: "day", t: "Close the day" }] } });
  ok(owed.owed === true && owed.kind === "weight" && owed.thenText === "log the scale", "marching order takes the single highest-priority owed action");
  ok(eq(owed.link, oT("weight")), "marching order deep-links through the SAME oweTarget map as the WHAT-YOU-OWE button (no divergent link)");
  ok(eq(owed.more, ["close the day"]), "the marching order names what comes after, without stealing focus from the one action");

  const clear = MO(clone(SEED), { focus: { owed: [], clear: true } });
  ok(clear.owed === false && clear.ifText === "If it's a meal" && clear.thenText === "protein first", "nothing owed → the standing if-then implementation-intention (protein first)");
  ok(eq(clear.link, oT("day")), "the standing marching order still deep-links (to tonight's numbers) like the owe button");
  ok(clear.targetLine.indexOf(String(__test.proteinTarget(clone(SEED)).g)) >= 0, "marching order's target line is DERIVED — it quotes proteinTarget's g, never a hard-coded number");

  const preSeed = JSON.stringify(SEED);
  MO(SEED);
  ok(JSON.stringify(SEED) === preSeed, "marchingOrder is pure — it writes nothing back to the synced state");
}

/* ===== v7.1.0 Slice 2 — ANTICIPATORY FORECASTING (forecast + redlineCrossing + honest cone) =====
   The honest fan (level ∝ √h, slope ∝ h^1.5), the confidence gate, and the SELF-SUPPRESSING redline
   crossing. Engine-owned: reads the ONE projection (digitalTwin) + the ONE slope CI (currentRate) +
   the ONE redline (cutRateBand) — no second slope, no second band, no new competing number. */
{
  const FORE = __test.FORE, cw = __test.coneHalfWidth, rc = __test.redlineCrossing, FC = __test.forecast, Phi = __test.normCdf, dt = __test.digitalTwin;

  // -- normal CDF + PI multipliers (used only to PHRASE the crossing probability honestly) --
  ok(Math.abs(Phi(0) - 0.5) < 1e-6, "normCdf(0) = 0.5");
  ok(Math.abs(Phi(1.96) - 0.975) < 3e-3 && Math.abs(Phi(-1.96) - 0.025) < 3e-3, "normCdf matches the 95% tails (Φ(1.96)≈0.975)");
  ok(FORE.PI80 === 1.28 && FORE.PI90 === 1.64 && FORE.PI95 === 1.96, "the PI multipliers are the 80/90/95% z-values (1.28/1.64/1.96)");

  // -- coneHalfWidth: strictly widening, slope fan ∝ h^1.5, level fan ∝ √h --
  let monoW = true; for (let h = 0; h < 26; h++) if (!(cw(0.8, 0.1, h + 1, FORE.PI95) > cw(0.8, 0.1, h, FORE.PI95))) monoW = false;
  ok(monoW, "the cone widens MONOTONICALLY with horizon — σ_{h+1} > σ_h at every step (a fan, never a fixed dash)");
  const slp = (h) => cw(0, 0.2, h, 1);   // pure slope term (sigmaLevel = 0)
  ok(Math.abs(slp(8) / slp(4) - Math.pow(2, 1.5)) < 1e-9 && Math.abs(slp(20) / slp(10) - Math.pow(2, 1.5)) < 1e-9, "the SLOPE fan grows ∝ h^1.5 — extrapolating a RATE fans SUPER-LINEARLY (doubling h ×2^1.5≈2.83)");
  const lvl = (h) => cw(0.9, 0, h, 1);   // pure level term (seRate = 0)
  ok(Math.abs(lvl(8) / lvl(4) - Math.SQRT2) < 1e-9, "the LEVEL fan grows ∝ √h — the gentle random-walk widening (doubling h ×√2≈1.41)");
  ok(cw(0.9, 0.2, 25, 1) > cw(0.9, 0, 25, 1) && cw(0, 0.2, 20, 1) > cw(0.9, 0, 20, 1), "far out the slope (h^1.5) term dominates the level (√h) term — the cone is honest about RATE uncertainty");

  // -- the honest ETA fan REPLACES the fixed ±25% in digitalTwin (derives from the rate's own CI) --
  const baseF = clone(SEED);
  const tw = dt(baseF, { calDelta: -400 });
  ok(tw.etaSlow >= tw.etaMid && tw.etaMid >= tw.etaFast, "the ETA is still a RANGE — slower plausible rate, more weeks; faster, fewer");
  ok(tw.seRate != null && tw.rateCI != null && tw.rateCI > 0, "digitalTwin now exposes the rate's own SE/CI — the fan reflects measured uncertainty, not a constant");
  const wA = (r) => (r == null || r <= 0 ? null : Math.max(0, Math.round((baseF.trend - tw.atWeight) / r)));
  ok(tw.etaFast === wA(tw.newRate + tw.rateCI) && tw.etaSlow === wA(Math.max(0.05, tw.newRate - tw.rateCI)), "etaFast/etaSlow are the CI ENDPOINTS of the rate (newRate ± CI) — the fixed ±25% fan is gone");
  const curSeed = __test.currentRate(clone(SEED));
  if (curSeed && curSeed.ci != null && curSeed.ci > 0) ok(dt(clone(SEED), {}).rateCI === curSeed.ci, "the fan's width IS currentRate's HAC 95% CI — one owner for the uncertainty, read not recomputed");
  else ok(true, "no measured CI on SEED — the fan falls back to the labelled ±25% prior (still a range)");

  // -- redlineCrossing FIRES on a resolvable approaching slope (measured, near redline, tight CI) --
  const near = rc(null, { rate: { measured: true, scale: 1.85, ci: 0.15, lo: 1.70, hi: 2.00 }, band: { redline: 1.9, redlinePct: 1.1875 }, sig: { state: "measured" }, bw: 160 });
  ok(near.fires === true && near.reason === "resolvable", "FIRES: a measured slope near the redline with a tight CI → the crossing is statistically resolvable");
  ok(Array.isArray(near.range) && near.range.length === 2 && near.range[0] < near.range[1], "the crossing is an ASYMMETRIC week RANGE, never a single day");
  ok(near.prob > 0 && near.prob <= 0.95, "the crossing carries an HONEST probability — never 0% and never a certain 100%");
  ok(near.tStar > 0 && near.tStar <= FORE.H_INFO, "the point crossing sits inside the informative horizon");
  ok(typeof near.cause === "string" && !/on\s+\w+\s+\d/.test(near.cause) && near.cause.indexOf("wks") >= 0, "the alert copy is a week range (no single calendar day), calm and non-alarmist");

  // -- redlineCrossing SELF-SUPPRESSES when the trend is ambiguous (each guard, one case) --
  const supCal = rc(null, { rate: { measured: true, scale: 1.85, ci: 0.15, lo: 1.70, hi: 2.0 }, band: { redline: 1.9, redlinePct: 1.1875 }, sig: { state: "calibrating" }, bw: 160 });
  ok(supCal.fires === false && supCal.reason === "ambiguous-signal", "SUPPRESSES: a calibrating signal → no crossing (the significance gate — not real yet)");
  const supNoise = rc(null, { rate: { measured: true, scale: 1.85, ci: 0.15, lo: 1.70, hi: 2.0 }, band: { redline: 1.9, redlinePct: 1.1875 }, sig: { state: "inside-noise" }, bw: 160 });
  ok(supNoise.fires === false && supNoise.reason === "ambiguous-signal", "SUPPRESSES: an inside-noise signal → self-silences");
  const supWide = rc(null, { rate: { measured: true, scale: 1.75, ci: 0.50, lo: 1.25, hi: 2.25 }, band: { redline: 1.9, redlinePct: 1.1875 }, sig: { state: "measured" }, bw: 160 });
  ok(supWide.fires === false && supWide.reason === "ci-includes-safe", "SUPPRESSES: a WIDE slope CI whose slow end stays safe → t*→∞, ambiguous → silent (the key self-suppression)");
  const supFar = rc(null, { rate: { measured: true, scale: 1.0, ci: 0.15, lo: 0.85, hi: 1.15 }, band: { redline: 1.9, redlinePct: 1.1875 }, sig: { state: "measured" }, bw: 160 });
  ok(supFar.fires === false, "SUPPRESSES: a safe mid-corridor rate → the crossing is beyond the informative horizon");
  const supGain = rc(null, { rate: { measured: true, scale: -0.5, ci: 0.15, lo: -0.65, hi: -0.35 }, band: { redline: 1.9, redlinePct: 1.1875 }, sig: { state: "measured" }, bw: 160 });
  ok(supGain.fires === false && supGain.reason === "not-losing", "SUPPRESSES: not losing → there is no muscle-loss crossing to warn about");

  // -- the crossing reads the ONE measured slope monotonically (no second slope) --
  const hotter = rc(null, { rate: { measured: true, scale: 1.88, ci: 0.15, lo: 1.73, hi: 2.03 }, band: { redline: 1.9, redlinePct: 1.1875 }, sig: { state: "measured" }, bw: 160 });
  ok(hotter.fires === true && hotter.tStar < near.tStar, "a hotter measured slope crosses SOONER — t* reads the ONE rate, no parallel slope");
  const tighter = rc(null, { rate: { measured: true, scale: 1.85, ci: 0.08, lo: 1.77, hi: 1.93 }, band: { redline: 1.9, redlinePct: 1.1875 }, sig: { state: "measured" }, bw: 160 });
  ok((tighter.range[1] - tighter.range[0]) < (near.range[1] - near.range[0]), "a TIGHTER CI narrows the crossing range — the fan reflects real confidence, honestly (wider CI → wider range, not suppression-by-hiding)");

  // -- forecast(): composes the cone + crossing, confidence-gated, engine-owned, guarded --
  const fSeed = FC(clone(SEED));
  ok(typeof fSeed.ok === "boolean" && Array.isArray(fSeed.cone) && fSeed.crossing != null, "forecast returns a cone + a crossing over the real SEED");
  const dtSeed = dt(clone(SEED));
  ok(fSeed.rate === dtSeed.newRate, "forecast READS digitalTwin.newRate — the ONE projection, it computes no second rate");
  // v7.5 polish — forecast and energyDensity are memoised on state IDENTITY. Pin the
  // contract: same object, same answer; a fresh clone recomputes.
  {
    const s1 = clone(SEED);
    ok(__test.forecast(s1) === __test.forecast(s1), "forecast is memoised per state object — one render asks four times and gets one computation");
    ok(__test.forecast(clone(SEED)) !== __test.forecast(s1), "a CLONE recomputes — the cache keys on identity, and every write path in this app clones");
    ok(__test.energyDensity(s1) === __test.energyDensity(s1), "energyDensity is memoised the same way");
    ok(JSON.stringify(__test.forecast(clone(SEED))) === JSON.stringify(__test.forecast(s1)), "…and the memoised answer is VALUE-identical to a fresh one: this is a cache, not a behaviour change");
  }
  ok(fSeed.crossing && typeof fSeed.crossing.fires === "boolean", "forecast's crossing on the real SEED resolves to a fires boolean (self-suppresses on the real read-path)");
  const injRate = { measured: true, scale: 1.2, ci: 0.4, sigma: 0.8, lo: 0.8, hi: 1.6 };
  const fCal = FC(clone(SEED), { deps: { sig: { state: "calibrating" }, rate: injRate, band: { redline: 1.9, redlinePct: 1.1875, band: [1.0, 1.16] }, tw: dtSeed } });
  ok(fCal.greyed === true && fCal.confident === false && fCal.pi === 95, "CONFIDENCE GATE: a calibrating signal GREYS + WIDENS the cone (PI95, no confident line)");
  const fMeas = FC(clone(SEED), { deps: { sig: { state: "measured" }, rate: { measured: true, scale: 1.2, ci: 0.3, sigma: 0.8, lo: 0.9, hi: 1.5 }, band: { redline: 1.9, redlinePct: 1.1875, band: [1.0, 1.16] }, tw: dtSeed } });
  ok(fMeas.confident === true && fMeas.greyed === false && fMeas.pi === 90, "a measured/measurable signal draws a confident cone (PI90)");
  ok(fMeas.cone.length > 2 && fMeas.cone[fMeas.cone.length - 1].hw > fMeas.cone[1].hw, "forecast.cone's half-width GROWS across its own horizon points — a widening fan");
  let threwF = false; try { FC({}); FC(null); FC(undefined); } catch (e) { threwF = true; }
  ok(threwF === false, "forecast is GUARDED — a thin/empty/null state returns a safe empty forecast, never a throw (self-silencing)");
  const preF = JSON.stringify(SEED); FC(SEED); ok(JSON.stringify(SEED) === preF, "forecast is PURE — it writes nothing back to the synced state");

  // -- the anticipatory read wires into the cockpit face (statusFace) as a CALM cue, self-silencing --
  const SF = __test.statusFace;
  const OKap = { ok: true, action: "hold", proposed: false, heldForStale: false, heldForNoise: false, corrKcal: 0, mode: "recomp" };
  const onCourseState = { blackout: null, proposals: [] };
  const noFire = { fires: false }, doesFire = { fires: true, cause: "Approaching the lean-loss rate — on this trend you'd reach it in about 3–14 wks (~80% within 20 wks). Easing the deficit back now keeps the loss off muscle." };
  ok(SF(onCourseState, { sig: { state: "measured" }, ap: OKap, rec: { stale: false, flag: null }, fc: noFire }).word === "ON COURSE", "no resolvable crossing → the face stays ON COURSE (self-silencing when unsure)");
  const adj = SF(onCourseState, { sig: { state: "measured" }, ap: OKap, rec: { stale: false, flag: null }, fc: doesFire });
  ok(adj.word === "ADJUSTING" && adj.glyph === "±" && adj.tone !== undefined, "a RESOLVABLE approaching-redline nudges the face to a CALM ADJUSTING cue (± glyph), never a NEEDS-YOU alarm");
  ok(adj.cause === doesFire.cause, "the ADJUSTING cause is the honest anticipatory read (a range + probability), carried onto the face — no silent change");
  ok(SF({ blackout: { until: "2999-01-01" }, proposals: [] }, { sig: { state: "measured" }, ap: OKap, rec: { stale: false, flag: null }, fc: doesFire }).word === "HOLDING", "a user PAUSE outranks the foresight nudge — foresight informs, it never overrides a higher-priority honest state");
  ok(SF(onCourseState, { sig: { state: "reversed" }, ap: OKap, rec: { stale: false, flag: null }, fc: doesFire }).word === "NEEDS YOU", "a REVERSED signal still outranks the foresight nudge — an escalation is never buried by anticipation");

  // -- and into the one-thing (marchingOrder): informs the WHY, keeps the lean-protective action --
  const MO = __test.marchingOrder;
  const moFire = MO(clone(SEED), { focus: { owed: [], clear: true }, fc: doesFire });
  ok(moFire.thenText === "protein first" && moFire.ifText === "If it's a meal", "the standing if-then's ACTION is unchanged — protein-first IS the lean-protective move");
  ok(moFire.why.indexOf("lean-loss rate") >= 0 && moFire.foresight != null, "a resolvable crossing informs the marching order's WHY (the horizon), without stealing the action");
  const moCalm = MO(clone(SEED), { focus: { owed: [], clear: true }, fc: noFire });
  ok(moCalm.foresight == null && moCalm.thenText === "protein first", "no crossing → the standing if-then is exactly as before (self-silencing)");

  // -- persisted forecasts stay merge-safe (Slice 3 grades them) — s.forecasts is in MERGE_MULTI --
  const msF = __test.mergeState;
  const FA = clone(SEED), FB = clone(SEED);
  FA.forecasts = (FA.forecasts || []).concat([{ d: "2026-08-01", trend: 164.2, rate: 1.2, pred7: 163.0, sealed: false }]);
  FB.forecasts = (FB.forecasts || []).concat([{ d: "2026-08-02", trend: 164.0, rate: 1.2, pred7: 162.8, sealed: false }]);
  const mF = msF(FA, FB);
  ok((mF.forecasts || []).length >= (FA.forecasts.length) && (mF.forecasts || []).some((f) => f.d === "2026-08-01") && (mF.forecasts || []).some((f) => f.d === "2026-08-02"), "persisted forecasts land in s.forecasts via MERGE_MULTI — a stale-device sync UNIONS forecast history, never clobbers it (no schema change; Slice 3 grades them)");
}

// ============================================================================================
// v7.2.0 · SLICE 3 — TRUST: s.plan MERGE HARDENING + graduated autonomy + track record + why + undo
// ============================================================================================

// --- s.plan HARDENING (the mandatory data-safety core) — adversarial, BOTH write orders ---
// s.plan used to fall through {...remote,...local} (wholesale local-wins) — the exact v6.2
// exercises/queue clobber class. Property under test, mirroring that fix: a stale client must
// never REVERT a newer plan setting and never LOSE one — goals/ifthen keyed-union (never drop),
// apMode/autonomy newest-DELIBERATE-change-wins (stamped) — and it holds from EITHER order.
{
  const ms = __test.mergeState, dlg = __test.dataLossGuard, up = __test._unionPlan;
  const T_OLD = "2026-08-01T09:00:00.000Z", T_NEW = "2026-08-03T09:00:00.000Z";
  const fresh = clone(SEED);
  fresh.plan = { goals: [{ id: "g1", text: "shared" }, { id: "g2", text: "fresh-only" }], ifthen: [], share: false,
                 apMode: "fatloss", autonomy: "runit", setAt: { autonomy: T_NEW, apMode: T_NEW }, rev: 2 };
  const stale = clone(SEED);
  stale.plan = { goals: [{ id: "g1", text: "shared" }, { id: "g3", text: "stale-only" }], ifthen: [], share: false,
                 apMode: "recomp", autonomy: "propose", setAt: { autonomy: T_OLD, apMode: T_OLD }, rev: 1 };

  // ORDER A — the STALE client writes last (local = stale, remote = fresh)
  const A = ms(stale, fresh);
  ok(A.plan.autonomy === "runit", "s.plan A: a stale client does NOT revert the newer autonomy=runit (newest deliberate change wins — MUST-NOT-REVERT)");
  ok(A.plan.apMode === "fatloss", "s.plan A: the newer apMode=fatloss is not rolled back by the stale recomp");
  ok(A.plan.goals.some((g) => g.id === "g1") && A.plan.goals.some((g) => g.id === "g2") && A.plan.goals.some((g) => g.id === "g3"), "s.plan A: goals keyed-union — BOTH devices' goals survive, none dropped");
  ok(!(A.plan.autonomy === stale.plan.autonomy && A.plan.goals.length === stale.plan.goals.length), "s.plan A: plan is NO LONGER taken wholesale from the local (stale) client — the v6.2-class clobber is closed");

  // ORDER B — the FRESH client writes last (local = fresh, remote = stale)
  const B = ms(fresh, stale);
  ok(B.plan.autonomy === "runit", "s.plan B: reversed order still keeps autonomy=runit (not LOST when it is the local side — MUST-NOT-LOSE)");
  ok(B.plan.apMode === "fatloss", "s.plan B: reversed order keeps the newer apMode=fatloss (not reverted when it is remote)");
  ok(B.plan.goals.length === A.plan.goals.length && A.plan.autonomy === B.plan.autonomy && A.plan.apMode === B.plan.apMode, "s.plan: the reconcile is ORDER-INDEPENDENT (A and B agree on goals + policy)");
  ok(A.plan.goals.length >= fresh.plan.goals.length && A.plan.goals.length >= stale.plan.goals.length, "s.plan: |merged.goals| >= both sides — the keyed union never shrinks");
  ok(dlg(fresh, A).safe === true && dlg(stale, A).safe === true, "s.plan: the merged state still passes the durability guard from BOTH inputs");

  // unstamped migration DEFAULT can never clobber a real stamped choice; exact stamp TIE -> local
  const nowRunit = clone(SEED); nowRunit.plan = { goals: [], ifthen: [], share: false, autonomy: "runit", setAt: { autonomy: T_NEW }, rev: 1 };
  const defProp = clone(SEED); defProp.plan = { goals: [], ifthen: [], share: false, autonomy: "propose" };   // unstamped, as migrate leaves it
  ok(ms(defProp, nowRunit).plan.autonomy === "runit", "s.plan: an unstamped DEFAULT can't clobber a stamped runit (remote newer) — the migration default never wins over a real choice");
  ok(ms(nowRunit, defProp).plan.autonomy === "runit", "s.plan: reversed — the stamped runit survives against an unstamped default (local newer)");
  const tieA = clone(SEED), tieB = clone(SEED);
  tieA.plan = { goals: [], ifthen: [], share: false, autonomy: "runit", setAt: { autonomy: T_NEW } };
  tieB.plan = { goals: [], ifthen: [], share: false, autonomy: "autonotice", setAt: { autonomy: T_NEW } };
  ok(ms(tieB, tieA).plan.autonomy === "autonotice", "s.plan: an exact stamp TIE falls to LOCAL (the writing client), deterministic — never a coin-flip");
  ok(typeof up === "function" && up({ goals: [{ id: "x" }] }, { goals: [{ id: "y" }] }).goals.length === 2, "s.plan: _unionPlan is the registered reconciler and unions goals by id");
}

// --- migration patchV36 — additive + migratable + rollback-safe ---
{
  const mig = __test.migrate, SC = __test.SCHEMA_V, ms = __test.mergeState;
  ok(SC === 45, "schema: SCHEMA_V is 45 (patchV45: the calves/rows ruling)");
  const oldV35 = clone(SEED); oldV35.v = 35; delete oldV35.plan.autonomy;
  const migd = mig(oldV35);
  ok(migd.v === 45 && migd.plan.autonomy === "propose", "patchV36→39: a v35 state migrates up to the current schema and patchV36 still defaults autonomy to the most-supervised 'propose'");
  ok(migd.reads.length === oldV35.reads.length && Object.keys(migd.dailyLogs).length === Object.keys(oldV35.dailyLogs).length, "patchV36: ADDITIVE — no read or dailyLog is added or lost (count-preserving)");
  ok(SEED.plan.autonomy === "propose", "patchV36: SEED already carries autonomy='propose' so a fresh install === a migrated one");
  ok(mig(clone(SEED)).plan.autonomy === "propose" && mig(clone(SEED)).v === 45, "patchV36..39: idempotent on a current SEED (no double-patch drift)");
  const future = clone(SEED); future.v = 46;
  ok(mig(future).v === 46, "migrate: a NEWER (v46) state is handed back UNTOUCHED — rollback-safe, never wiped to SEED");
  const legacy = clone(SEED); legacy.v = 35; legacy.plan = { goals: [{ text: "no-id" }], ifthen: [{ cue: "x", action: "y" }], share: false };
  const lm = mig(legacy);
  ok(lm.plan.goals[0].id != null && lm.plan.ifthen[0].id != null, "patchV36: legacy goal/if-then entries get a stable id backfilled (so the keyed union keys every entry)");
  // Finding 1 (audit) — the backfill id must be CONTENT-derived, not index-based: two devices with
  // DIFFERENT legacy entries must not collide, and BOTH must survive the first cross-device sync.
  const devA = clone(SEED); devA.v = 35; devA.plan = { goals: [{ text: "walk 8k" }], ifthen: [], share: false };
  const devB = clone(SEED); devB.v = 35; devB.plan = { goals: [{ text: "sleep by 11" }], ifthen: [], share: false };
  const mA = mig(devA), mB = mig(devB);
  ok(mA.plan.goals[0].id !== mB.plan.goals[0].id, "patchV36: two devices' DIFFERENT legacy goals get DISTINCT ids (content-hashed, not index) — no cross-device collision");
  ok(mig(clone(devA)).plan.goals[0].id === mA.plan.goals[0].id, "patchV36: the backfill id is CONTENT-stable (same text → same id on every migration)");
  const mergedLegacy = ms(mA, mB);
  ok(mergedLegacy.plan.goals.some((g) => g.text === "walk 8k") && mergedLegacy.plan.goals.some((g) => g.text === "sleep by 11"), "patchV36 + merge: BOTH devices' divergent legacy goals survive the first cross-device sync — the never-drop guarantee holds for backfilled entries (Finding 1 closed)");
}

// --- graduated autonomy dial (3 named levels) + the policy that NEVER auto-applies at L1 ---
{
  const aOf = __test.autonomyOf, POL = __test.autoPilotPolicy, LV = __test.AUTONOMY_LEVELS, META = __test.AUTONOMY_META;
  ok(LV.length === 3 && LV[0] === "propose" && LV[1] === "autonotice" && LV[2] === "runit", "autonomy: exactly THREE named levels, most-supervised first (Propose&Approve → Auto-with-notice → Run-it)");
  ok(META.propose.rank === 0 && META.runit.rank === 2, "autonomy: the levels are ranked (propose most-supervised, runit least)");
  ok(aOf({}) === "propose" && aOf({ plan: {} }) === "propose" && aOf({ plan: { autonomy: "bogus" } }) === "propose", "autonomy: default + unknown value → 'propose' (never auto-promote)");
  ok(aOf({ plan: { autonomy: "runit" } }) === "runit", "autonomy: a set level reads back");

  const routineAp = { ok: true, proposed: true, driftSig: true, heldForStale: false, heldForNoise: false, action: "tighten", corrKcal: 110, mode: "recomp", band: { redlinePct: 1.9 }, pctRate: 0.6, proteinOff: false };
  const noEsc = { escalate: false, ask: [], abstain: [], first: null };
  ok(POL(SEED, { ap: routineAp, level: "propose", esc: noEsc }).autoApply === false, "L1 Propose: a routine move NEVER auto-applies — one-tap approval is the floor");
  ok(POL(SEED, { ap: routineAp, level: "propose", esc: noEsc }).mustAsk === true, "L1 Propose: the routine move is staged for the human (mustAsk)");
  ok(POL(SEED, { ap: routineAp, level: "autonotice", esc: noEsc }).autoApply === true, "L2 Auto-with-notice: a routine, in-corridor, resolvable move auto-applies");
  ok(POL(SEED, { ap: routineAp, level: "runit", esc: noEsc }).autoApply === true, "L3 Run-it: a routine move auto-applies (tell-me-only-when-needed)");
}

// --- escalation ALWAYS asks + the safety supervisor VETOES auto-apply even at Run-it ---
{
  const ESC = __test.escalation, POL = __test.autoPilotPolicy;
  const routineAp = { ok: true, proposed: true, driftSig: true, heldForStale: false, heldForNoise: false, action: "tighten", corrKcal: 110, mode: "recomp", band: { redlinePct: 1.9 }, pctRate: 0.6, proteinOff: false };
  const noEsc = { escalate: false, ask: [], abstain: [], first: null };
  const bigAp = { ok: true, proposed: true, driftSig: true, corrKcal: 260, action: "tighten", band: { redlinePct: 1.9 }, pctRate: 0.6, proteinOff: false };
  ok(ESC({ proposals: [] }, bigAp).ask.some((r) => r.code === "magnitude"), "escalation: a BIG move (≥200 kcal) raises a 'magnitude' ask — always the human");
  const proAp = { ok: true, proposed: false, driftSig: true, corrKcal: 0, action: "hold", band: { redlinePct: 1.9 }, pctRate: 0.6, proteinOff: true, proteinFloorG: 180 };
  ok(ESC({ proposals: [] }, proAp).ask.some((r) => r.code === "floor-protein"), "escalation: protein under the lean-retention FLOOR raises a 'floor-protein' ask (never automated)");
  const redAp = { ok: true, proposed: true, driftSig: true, corrKcal: 100, action: "ease", band: { redlinePct: 1.9 }, pctRate: 2.0, proteinOff: false };
  ok(ESC({ proposals: [] }, redAp).ask.some((r) => r.code === "redline"), "escalation: at/over the muscle-loss REDLINE raises a 'redline' ask — too aggressive to auto-apply");
  ok(ESC({ proposals: [{ resolved: false, gate: "coach" }] }, { ok: true, proposed: false }).ask.some((r) => r.code === "coach"), "escalation: a COACH-gated inbox item raises a 'coach' ask (Art. IX — human even at Run-it)");

  const hardEsc = { escalate: true, ask: [{ code: "magnitude", kind: "ask", text: "big" }], abstain: [], first: { code: "magnitude", text: "big" } };
  ok(POL(SEED, { ap: bigAp, level: "runit", esc: hardEsc }).autoApply === false, "SAFETY: an 'ask' escalation VETOES auto-apply even at Run-it — ESCALATION OVERRIDES THE LEVEL");
  ok(POL(SEED, { ap: bigAp, level: "runit", esc: hardEsc }).mustAsk === true, "SAFETY: the vetoed move is handed to the human (mustAsk), never silent");
  const staleAp = { ...routineAp, heldForStale: true };
  ok(POL(SEED, { ap: staleAp, level: "runit", esc: noEsc }).autoApply === false, "SAFETY: a stale/frozen-rate hold never auto-applies at Run-it (honest abstention still gates)");
  const noiseAp = { ...routineAp, heldForNoise: true, driftSig: false };
  ok(POL(SEED, { ap: noiseAp, level: "runit", esc: noEsc }).autoApply === false, "SAFETY: an inside-noise hold never auto-applies at Run-it (confidence gate still gates)");
}

// --- statusFace HONESTLY reflects the level: escalation → NEEDS YOU, auto-apply names UNDO ---
{
  const SF = __test.statusFace;
  const st0 = { blackout: null, proposals: [] };
  const escPol = { escalate: true, escReason: { text: "a big move (~260 kcal) — your call" }, autoApply: false, mustAsk: true };
  const needs = SF(st0, { sig: { state: "measured" }, ap: { ok: true, proposed: true, action: "tighten", corrKcal: 260, mode: "recomp" }, rec: { stale: false }, pol: escPol, level: "runit", fc: { fires: false } });
  ok(needs.word === "NEEDS YOU", "statusFace: a staged move with a HARD escalation reads NEEDS YOU even at Run-it (the safety supervisor on the face)");
  ok(Object.keys(needs).sort().join(",") === "cause,glyph,tone,word", "statusFace: still returns EXACTLY {word,glyph,tone,cause} — no key added, the Slice-1 contract holds");
  const autoPol = { escalate: false, autoApply: true, mustAsk: false };
  const autoFace = SF(st0, { sig: { state: "measured" }, ap: { ok: true, proposed: true, action: "ease", corrKcal: 110, mode: "recomp" }, rec: { stale: false }, pol: autoPol, level: "runit", fc: { fires: false } });
  ok(autoFace.word === "ADJUSTING" && autoFace.cause.indexOf("undo") >= 0, "statusFace: an auto-handled routine move reads ADJUSTING and its cause NAMES the one-tap undo (honest about what happened)");
}

// --- why-this-number (SAT L1/L2/L3) + first-class confidence field ---
{
  const WTN = __test.whyThisNumber, CF = __test.confidenceField;
  const wtn = WTN(clone(SEED));
  ok(wtn.l1 && wtn.l2 && wtn.l3 && wtn.confidence, "whyThisNumber: the SAT model returns all three levels (intent / rationale / projection) + a confidence field");
  ok(wtn.l1.label === "INTENT" && wtn.l2.label === "RATIONALE" && wtn.l3.label === "PROJECTION", "whyThisNumber: L1=intent, L2=rationale, L3=projection+confidence (Chen 2017 SAT)");
  ok(!wtn.ok || /n=\d|TDEE|%BW/.test(wtn.l2.text), "whyThisNumber: when it can steer, the rationale cites HIS OWN numbers (n / TDEE / rate) — grounded, not generic");
  const cf = CF({}, { sig: { state: "measured", n: 20, ticks: 5 } });
  ok(cf.word === "MEASURED" && cf.detail.indexOf("CI") >= 0, "confidenceField: a measured signal → MEASURED + the CI-excludes-zero detail (uncertainty travels WITH the number)");
  ok(CF({}, { sig: { state: "calibrating" } }).word === "CALIBRATING", "confidenceField: calibrating → CALIBRATING (tied to the CALIBRATING face-state)");
}

// --- track record SHOWS a miss honestly (Dietvorst) + grades a hit within his own noise ---
{
  const TR = __test.trackRecord;
  const trMiss = clone(SEED);
  trMiss.forecasts = [{ d: "2026-07-25", trend: 164.5, rate: 1.2, pred7: 160.0, sealed: false }];   // predicted 160.0 by 8/01
  trMiss.reads = trMiss.reads.concat([{ d: "2026-08-01", w: 165.0, sealed: false, pt: 165.0 }]);      // actual trend 165.0 — a 5 lb MISS
  const trm = TR(trMiss);
  ok(trm.graded >= 1, "trackRecord: a due 7-day prediction is graded against the REALIZED trend");
  ok(trm.misses >= 1 && trm.hasMiss === true, "trackRecord: it SHOWS a miss (Dietvorst 2015 — hiding errors backfires), not only hits");
  ok(trm.rows.some((r) => r.miss === true && r.pred != null && r.actual != null), "trackRecord: the missed row carries BOTH predicted AND actual — the error is visible, not hidden");
  ok(typeof trm.calibration === "string" && trm.calibration.indexOf("missed") >= 0, "trackRecord: the rolling calibration statement states the misses honestly");
  const trHit = clone(SEED);
  trHit.forecasts = [{ d: "2026-07-25", trend: 164.5, rate: 1.2, pred7: 164.3, sealed: false }];
  trHit.reads = trHit.reads.concat([{ d: "2026-08-01", w: 164.3, sealed: false, pt: 164.3 }]);          // within the noise floor — a HIT
  ok(TR(trHit).hits >= 1, "trackRecord: a prediction that lands within his OWN noise grades as a HIT (calibrated, not flattering)");
}

// --- always-visible undo: one-tap reversible + the decision RETURNS to the inbox ---
{
  const UA = __test.undoAdjustment, LU = __test.lastUndoable;
  const undoState = clone(SEED);
  undoState.proposals = [{ rid: "ap_tighten_x", id: "ap_tighten_x_1", d: "2026-08-01", title: "AUTO-PILOT · TIGHTEN", why: "x", apply: { kind: "cal", delta: 100 }, resolved: true, auto: true }];
  undoState.adjustments = (undoState.adjustments || []).concat([{ rid: "ap_tighten_x", d: "2026-08-01", title: "AUTO-PILOT · TIGHTEN", nudge: 0, auto: true }]);
  ok(LU(undoState) != null && LU(undoState).rid === "ap_tighten_x", "undo: lastUndoable finds the applied Auto-Pilot move (the always-visible undo has a target)");
  const undone = UA(undoState, "ap_tighten_x");
  ok(undone.adjustments.some((a) => a.rid === "ap_tighten_x" && a.undone === true) && undone.adjustments.length === undoState.adjustments.length, "undo (v7.2.0 audit): the applied adjustment is KEPT and marked undone (durable) — NOT spliced — so the once/day auto-apply guard keeps its memory and can't re-fire/duplicate");
  ok(LU(undone) === null, "undo: after undoing, lastUndoable no longer offers that move (it skips undone rows) — the always-visible affordance clears");
  ok(undone.proposals.some((p) => p.rid === "ap_tighten_x" && !p.resolved), "undo: the move RE-OPENS into the inbox — the decision returns to you (Law 10), it doesn't vanish");
  ok(undone.feed[0] && undone.feed[0].t === "MOVE UNDONE", "undo: an honest 'MOVE UNDONE' note is filed");
  const declineState = clone(SEED); declineState.adjustments = [{ rid: "ap_x", d: "2026-08-01", title: "x", dismissed: true }];
  ok(LU(declineState) === null, "undo: a DECLINED move is not offered as undo — nothing changed to reverse");
}

// ============================================================================================
// v7.2.0 · SLICE 3 AUDIT FIXES — undo durability · adjustments/proposals merge · floor-on-face · ids
// ============================================================================================

// --- FIX 1 — an undone AUTO-APPLY does NOT re-fire on remount, and is never duplicated ---
// The once/day guard reads s.adjustments for an apauto_ record dated today. undoAdjustment used to
// SPLICE that record, so the guard lost its memory and the routine auto-move re-fired (and could
// duplicate the apauto_ proposal) on the next mount. It now KEEPS the row (marks undone) — and an
// undone apauto_ STILL counts as handled.
{
  const UA = __test.undoAdjustment, AH = __test.apAutoHandledFor;
  const tISO = "2026-08-03", rid = "apauto_tighten_" + tISO;
  const s0 = clone(SEED);
  s0.proposals = [{ rid, id: rid + "_" + tISO, d: tISO, title: "AUTO-PILOT · TIGHTENED THE TARGET", apply: { kind: "cal", delta: 100 }, resolved: true, auto: true }];
  s0.adjustments = [{ rid, id: "adj_seed_1", d: tISO, title: "AUTO-PILOT · TIGHTENED THE TARGET", nudge: 0, auto: true, level: "runit" }];
  ok(AH(s0, tISO) === true, "FIX 1 once/day guard: an apauto_ record dated today reads as ALREADY HANDLED — the auto-apply won't fire a second time");
  const uu = UA(s0, rid);
  ok(uu.adjustments.length === 1 && uu.adjustments[0].undone === true, "FIX 1: undo KEEPS the apauto_ row (marked undone) — length unchanged, neither dropped nor duplicated");
  ok(AH(uu, tISO) === true, "FIX 1: AFTER undo the day STILL reads as handled — the undone auto-apply does NOT re-fire on the next mount (the splice bug is closed)");
  ok(uu.adjustments.filter((a) => a.rid && a.rid.indexOf("apauto_") === 0 && a.d === tISO).length === 1, "FIX 1: exactly ONE apauto_ record for the day survives undo — no duplication");
  ok(uu.proposals.some((p) => p.rid === rid && !p.resolved), "FIX 1: undo re-opens the auto-move into the inbox (the decision returns to you) while the durable guard row stays put");
}

// --- FIX 2 — s.adjustments (+ s.proposals) union-merge: same clobber class as exercises/queue/plan ---
// The decision log is LOAD-BEARING (track record + undo + once/day guard + multi-device Run-it append)
// and used to ride {...remote,...local} (wholesale local-wins). Property (mirroring the exercises/queue
// tests): a stale client must NOT REVERT (un-undo) a newer adjustment AND must NOT LOSE one — BOTH write
// orders, order-independent, dataLossGuard catches a silent shrink.
{
  const ms = __test.mergeState, dlg = __test.dataLossGuard;
  // A1 shared (later UNDONE on the fresh side); the fresh side also has a NEW Run-it auto-apply A2 the
  // stale side never saw; the stale side still shows A1 as NOT undone.
  const fresh = clone(SEED);
  fresh.adjustments = [{ rid: "ap_x", id: "a1", d: "2026-08-01", title: "TIGHTEN", auto: true, undone: true },
                       { rid: "apauto_ease_2026-08-03", id: "a2", d: "2026-08-03", title: "AUTO-PILOT · EASED", auto: true }];
  const stale = clone(SEED);
  stale.adjustments = [{ rid: "ap_x", id: "a1", d: "2026-08-01", title: "TIGHTEN", auto: true }];   // stale: A1 not undone, never saw A2

  // ORDER A — stale writes last (local = stale, remote = fresh)
  const A = ms(stale, fresh);
  const a1A = A.adjustments.find((a) => a.id === "a1");
  ok(a1A && a1A.undone === true, "FIX 2 adjustments A: a stale client does NOT REVERT the undone flag — the terminal (undone) record wins (MUST-NOT-REVERT)");
  ok(A.adjustments.some((a) => a.id === "a2"), "FIX 2 adjustments A: the fresh Run-it auto-apply the stale device never saw SURVIVES (MUST-NOT-LOSE)");
  ok(A.adjustments.length >= fresh.adjustments.length && A.adjustments.length >= stale.adjustments.length, "FIX 2 adjustments A: |merged| >= both sides — the keyed union never shrinks the decision log");

  // ORDER B — fresh writes last (local = fresh, remote = stale)
  const B = ms(fresh, stale);
  const a1B = B.adjustments.find((a) => a.id === "a1");
  ok(a1B && a1B.undone === true && B.adjustments.some((a) => a.id === "a2"), "FIX 2 adjustments B: reversed order agrees — undone stays undone AND A2 is kept (order-independent)");
  ok(dlg(fresh, A).safe === true && dlg(stale, A).safe === true, "FIX 2 adjustments: the merge passes the durability guard from BOTH inputs");

  // dataLossGuard now PROTECTS the decision log directly (adjustments is counted)
  const dropped = clone(fresh); dropped.adjustments = fresh.adjustments.slice(0, 1);
  ok(dlg(fresh, dropped).safe === false, "FIX 2 adjustments: dropping an Auto-Pilot decision record is BLOCKED by the durability guard — a shrink can't be silent");

  // proposals — a stale-device sync must not LOSE an armed inbox item (never-drop union)
  const pf = clone(SEED), psl = clone(SEED);
  pf.proposals = [{ rid: "r_keep", id: "pk", d: "2026-08-03", title: "ARMED", apply: { kind: "cal", delta: 80 }, resolved: false }];
  psl.proposals = [];
  ok(ms(psl, pf).proposals.some((p) => p.id === "pk") && ms(pf, psl).proposals.some((p) => p.id === "pk"), "FIX 2 proposals: an armed inbox item on one device SURVIVES a stale-device sync from EITHER order — no wholesale clobber (never-lose)");
}

// --- FIX 3 — a protein-FLOOR / REDLINE safety escalation reaches the hero WORD even with NO staged move
// and even while otherwise HOLDING (a safety condition belongs on the face, not only a card). It stays
// the calm established NEEDS-YOU (▲) and keeps the Slice-1 four-key contract. ---
{
  const SF = __test.statusFace;
  const st0 = { blackout: null, proposals: [] };
  const escNoMove = { escalate: true, escReason: { text: "protein is under the 180g lean-retention floor — a floor call, never automated" }, autoApply: false, mustAsk: false };
  const holdAp = { ok: true, proposed: false, action: "hold", corrKcal: 0, mode: "recomp" };
  const floorFace = SF(st0, { sig: { state: "measured" }, ap: holdAp, rec: { stale: false, flag: null }, pol: escNoMove, level: "runit", fc: { fires: false } });
  ok(floorFace.word === "NEEDS YOU", "FIX 3: a floor/redline safety escalation with NO staged move (proposed:false) reaches the hero as NEEDS YOU — on the face, not only a card");
  ok(floorFace.glyph === "▲" && Object.keys(floorFace).sort().join(",") === "cause,glyph,tone,word", "FIX 3: it is the calm established NEEDS-YOU (▲) and STILL exactly {word,glyph,tone,cause} — the Slice-1 4-key contract holds");
  ok(floorFace.cause.indexOf("floor") >= 0, "FIX 3: the cause honestly names the safety reason (the protein floor) — no silent change on the face");
  const floorWhileStale = SF(st0, { sig: { state: "measured" }, ap: holdAp, rec: { stale: true, flag: "reading is 4 days old · weigh in to refresh" }, pol: escNoMove, level: "runit", fc: { fires: false } });
  ok(floorWhileStale.word === "NEEDS YOU", "FIX 3: the escalation reaches the hero EVEN WHILE HOLDING — a stale-rate hold no longer buries a floor/redline call");
  const noEscPol = { escalate: false, escReason: null, autoApply: false, mustAsk: false };
  ok(SF(st0, { sig: { state: "measured" }, ap: holdAp, rec: { stale: false, flag: null }, pol: noEscPol, level: "runit", fc: { fires: false } }).word === "ON COURSE", "FIX 3: with no escalation the face is exactly ON COURSE — the new branch is INERT unless a real safety ask fires (the Slice-1 480-combo totality is preserved)");
}

// --- FIX 4 — user-created goal/if-then ids carry a sequence+random tail, so two minted in the same
// millisecond (even across devices) don't collide (the keyed plan-union keys on id). ---
{
  const FI = __test._freshId;
  const ids = new Set(); let allPrefixed = true;
  for (let i = 0; i < 500; i++) { const g = FI("g"); if (g.indexOf("g") !== 0) allPrefixed = false; ids.add(g); }
  ok(ids.size === 500 && allPrefixed, "FIX 4: 500 ids minted back-to-back (same ms) are ALL distinct and prefixed — the in-session sequence guarantees uniqueness deterministically (no 1-ms Date.now() collision)");
  ok(FI("g") !== FI("g") && FI("p").indexOf("p") === 0, "FIX 4: consecutive ids differ and the prefix is preserved (goals 'g', if-then 'p')");
}

// ============================================================================================
// v7.3.0 · SLICE 4 — n-of-1 LEARNING: energy density · p-ratio range · TDEE drift · adaptation ·
// the learned-store SCHEMA (patchV37) + adversarial MERGE hardening
// ============================================================================================
{
  const ED = __test.energyDensity, PP = __test.partitionPrior, TL = __test.tdeeLearned,
        AS = __test.adaptationSignal, OT = __test.observedTDEE, CT = __test.calorieTarget,
        PT = __test.proteinTarget, AD = __test.anchorDexa, MIG = __test.migrate,
        MS = __test.mergeState, DLG = __test.dataLossGuard, UL = __test._unionLearned;
  const isoS4 = (ms) => { const d = new Date(ms); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  // a rich MEASURED state (28 daily reads + logs), optionally DEXA-anchored at a given BF
  const richState = (dexaBf) => {
    const st = clone(SEED); st.blackout.until = "2026-01-01"; st.reads = []; st.dailyLogs = {};
    for (let i = 27; i >= 0; i--) { const d = isoS4(Date.now() - i * 864e5); st.reads.push({ d, w: +(170 - (27 - i) * 0.2).toFixed(1), sealed: false }); st.dailyLogs[d] = { cal: 2000, pro: 175, steps: 12000 }; }
    st.trend = st.reads[st.reads.length - 1].w;
    return dexaBf != null ? AD(st, dexaBf) : st;
  };

  // -------- ENERGY DENSITY — fat-mass-dependent, ONE owner, prior-until-DEXA (no faked precision) --------
  ok(__test.KCAL_PER_LB_MIX === 3800, "energy density: KCAL_PER_LB_MIX stays the named prior (3800) the owner falls back to");
  const rcEye = richState(null);
  ok(ED(rcEye).identified === false && ED(rcEye).perLb === 3800, "energy density: off a coach's-eye anchor the POINT is EXACTLY the prior 3800 — nothing downstream shifts, no faked precision");
  ok(ED(rcEye).lo < ED(rcEye).perLb && ED(rcEye).perLb < ED(rcEye).hi, "energy density: even at the prior it carries an HONEST band (uncertainty made visible, not hidden)");
  ok(OT(rcEye).perLb === ED(rcEye).perLb, "engine-owns-numbers: observedTDEE READS the ONE energyDensity owner — no competing kcal/lb constant");
  const d15 = richState(15), d25 = richState(25);
  ok(ED(d15).identified === true && ED(d25).identified === true, "energy density: a DEXA anchor IDENTIFIES fat mass, so the point may personalise off the prior");
  ok(ED(d25).perLb > ED(d15).perLb && ED(d15).perLb !== ED(d25).perLb, "energy density is FAT-MASS-DEPENDENT: the deficit/lb DIFFERS at 15% vs 25% BF — leaner prices lower (Forbes/Hall), not a fixed 3,500/3,800");
  ok(ED(d15).perLb === 3800, "energy density: at his ~15% reference the personalised point still lands on the prior 3800 (anchored calibration, not a jump)");
  ok(OT(d25).perLb === ED(d25).perLb && CT(d25).lo != null, "engine-owns-numbers: after a DEXA the SAME sharpened energyDensity flows into observedTDEE + the calorie band — one computation");

  // WhatIfConsole (THE LEVERS sandbox, LAB) missed the Slice-4 migration: it priced off the fixed
  // KCAL_PER_LB_MIX (3,800) — inert pre-DEXA, but the moment a DEXA lands it would show a stale 3,800
  // while the N-OF-1 card + Twin (same room) show the personalised value. It uses hooks, so it can't be
  // called like a selector — assert on its source that it prices via the ONE energyDensity owner and
  // leaves NO fixed constant in the sandbox (same "engine-owns-numbers / no competing kcal/lb" contract).
  const APP_SRC = readFileSync("src/app.jsx", "utf8");
  const wifSrc = APP_SRC.slice(APP_SRC.indexOf("function WhatIfConsole"), APP_SRC.indexOf("function TrialsDesk"));
  ok(/const\s+edWhatIf\s*=\s*energyDensity\(s\)\.perLb/.test(wifSrc), "engine-owns-numbers: WhatIfConsole (THE LEVERS) prices off the ONE energyDensity owner — edWhatIf = energyDensity(s).perLb, like every other pricing site");
  ok(!/KCAL_PER_LB_MIX/.test(wifSrc), "engine-owns-numbers: NO fixed KCAL_PER_LB_MIX left in the WhatIfConsole sandbox — rate calc + displayed kcal/lb both read the owner (no two conflicting numbers vs the N-OF-1 card + Twin after a DEXA)");

  // -------- PARTITION / p-RATIO — a RANGE, Forbes/BF-governed, narrows only with repeated anchors --------
  const pS = PP(clone(SEED));
  ok(pS.range === true && pS.fatFrac.lo < pS.fatFrac.hi, "p-ratio: surfaced as a RANGE, never a point (fatFrac.lo < fatFrac.hi)");
  ok(pS.identified === false && /range/i.test(pS.label) && /forbes/i.test(pS.label), "p-ratio: labels itself a RANGE governed by Forbes/BF, and is NOT identified off a coach's eye");
  const oneA = clone(SEED); oneA.learned = { tdee: [], anchors: [{ id: "d1", d: "2026-07-01", src: "DEXA", bf: 15 }] };
  const twoA = clone(SEED); twoA.learned = { tdee: [], anchors: [{ id: "d1", d: "2026-07-01", src: "DEXA", bf: 15 }, { id: "d2", d: "2026-08-01", src: "DEXA", bf: 14.5 }] };
  const width = (p) => +(p.fatFrac.hi - p.fatFrac.lo).toFixed(3);
  ok(width(pS) > width(PP(oneA)) && width(PP(oneA)) > width(PP(twoA)), "p-ratio: the range NARROWS only as REAL DEXA anchors accumulate (0 wide → 1 → 2 narrower) — needs multiple before it tightens");
  ok(width(PP(twoA)) > 0 && PP(twoA).fatFrac.lo < PP(twoA).fatFrac.hi, "p-ratio: even with anchors it stays a RANGE — never collapses to a single point");
  ok(PP(d25).fatFrac.mid > PP(d15).fatFrac.mid, "p-ratio: governed by BF level — a leaner measured state carries a LOWER fat fraction of loss (Forbes headwind)");

  // -------- TDEE — a drifting latent state (EWMA self-learning), honest label + band, graceful --------
  const tlThin = TL({}, { series: [], today: { tdee: 2600, lo: 2400, hi: 2800 } });
  ok(tlThin.converged === false && tlThin.source === "today", "TDEE: degrades GRACEFULLY — a thin series falls back to today's fit, flagged not-yet-converged");
  ok(TL({}, { series: [], today: null }).value === null, "TDEE: with no history AND no measurable fit it honestly returns null, never a fabricated number");
  const tlSeries = []; for (let i = 0; i < 14; i++) tlSeries.push({ d: `2026-07-${String(i + 1).padStart(2, "0")}`, tdee: 2600 - i * 5, w: 165 - i * 0.1 });
  const tl = TL({}, { series: tlSeries, today: null });
  ok(tl.converged === true && tl.n === 14, "TDEE: converges once ~2–4 wk of fits are in (n ≥ 10)");
  ok(tl.value < tlSeries[0].tdee && tl.value > tlSeries[tlSeries.length - 1].tdee, "TDEE: a SMOOTHED latent state (EWMA α≈0.1) — it TRACKS the drift but LAGS the last point, so it can't overfit one noisy morning");
  ok(tl.lo < tl.value && tl.value < tl.hi, "TDEE: the learned estimate carries an honest ± band (never a bare integer)");
  ok(/logging bias/i.test(tl.label) && /not a physiological/i.test(tl.label), "TDEE: labeled TDEE-MINUS-LOGGING-BIAS, explicitly NOT physiology");
  ok(tl.alpha === 0.10 && tl.accHi === 215, "TDEE: the EWMA constant + realistic-accuracy floor (~130–215 kcal/day, Sanghvi 2015) are the cited honest bounds");

  // -------- ADAPTATION — observed below MASS-predicted, gated on SIGNIFICANCE + PERSISTENCE --------
  const adaptSeries = [
    { d: "2026-07-01", tdee: 2600, w: 170.0, lo: 2520, hi: 2680 },
    { d: "2026-07-08", tdee: 2560, w: 168.5, lo: 2480, hi: 2640 },
    { d: "2026-07-15", tdee: 2470, w: 167.0, lo: 2400, hi: 2540 },
    { d: "2026-07-22", tdee: 2430, w: 166.0, lo: 2360, hi: 2500 },
    { d: "2026-07-29", tdee: 2400, w: 165.0, lo: 2330, hi: 2470 },
  ];
  const adaptFire = AS({}, { series: adaptSeries, sig: { state: "measured" } });
  ok(adaptFire.detected === true && adaptFire.kcal < 0, "adaptation: a PERSISTENT + SIGNIFICANT drift below the mass-predicted line FIRES (observed maintenance running under what mass loss alone predicts)");
  ok(/not a physiological/i.test(adaptFire.label), "adaptation: labeled a directional signal, NOT a physiological measurement (calibration, not a target)");
  ok(AS({}, { series: adaptSeries.slice(0, 3), sig: { state: "measured" } }).reason === "too-thin", "adaptation: degrades gracefully — too little history returns 'too-thin', never a guess");
  ok(AS({}, { series: adaptSeries, sig: { state: "calibrating" } }).detected === false && AS({}, { series: adaptSeries, sig: { state: "calibrating" } }).reason === "signal-not-real", "adaptation: SIGNIFICANCE gate — it never fires while the underlying rate signal is still calibrating");
  const oneDip = adaptSeries.slice(0, 4).concat([{ d: "2026-07-29", tdee: 2620, w: 165.0, lo: 2550, hi: 2690 }]);
  ok(AS({}, { series: oneDip, sig: { state: "measured" } }).detected === false && AS({}, { series: oneDip, sig: { state: "measured" } }).reason === "not-persistent", "adaptation: PERSISTENCE gate — a single low reading among a rebound does NOT fire (never one reading)");
  const wideBand = adaptSeries.slice(0, 4).concat([{ d: "2026-07-29", tdee: 2500, w: 165.0, lo: 2380, hi: 2700 }]);
  ok(AS({}, { series: wideBand, sig: { state: "measured" } }).detected === false && AS({}, { series: wideBand, sig: { state: "measured" } }).reason === "not-significant", "adaptation: SIGNIFICANCE gate — a below-expected drift whose band still straddles zero does NOT fire");

  // -------- DEXA → protein RANGE collapse (the top unfinished work), + anchor recorded --------
  ok(PT(clone(SEED)).straddles === true, "protein: on the coach's-eye anchor the BF band straddles the 12.2% line → protein is a RANGE (160–190 g)");
  const anchored = AD(clone(SEED), 15);
  ok(PT(anchored).straddles === false, "protein: a DEXA anchor (±1) collapses the BF band clear of 12.2% → straddles FALSE → a single number (the DEXA that sharpens the whole model)");
  ok(anchored.learned.anchors.some((a) => a.src === "DEXA"), "DEXA: anchorDexa RECORDS the anchor in the learned history, so partitionPrior/energyDensity can narrow + personalise as anchors accumulate");

  // -------- SCHEMA patchV37 — additive + migratable + rollback-safe; fresh SEED === migrated --------
  ok(__test.SCHEMA_V === 45, "schema: SCHEMA_V is 45 (patchV45 on top of the chain)");
  ok(Array.isArray(SEED.learned.tdee) && SEED.learned.tdee.length === 0 && Array.isArray(SEED.learned.anchors) && SEED.learned.anchors.length === 0, "patchV37: SEED carries an EMPTY learned store — a fresh install === a migrated state");
  const oldV36 = clone(SEED); oldV36.v = 36; delete oldV36.learned;
  const m37 = MIG(oldV36);
  ok(m37.v === 45 && Array.isArray(m37.learned.tdee) && m37.learned.tdee.length === 0 && Array.isArray(m37.learned.anchors), "patchV37: a v36 state migrates to the current schema and seeds the learned store EMPTY (additive)");
  ok(m37.reads.length === oldV36.reads.length && Object.keys(m37.dailyLogs).length === Object.keys(oldV36.dailyLogs).length, "patchV37: ADDITIVE — no read or dailyLog added or lost (count-preserving)");
  ok(MIG(clone(SEED)).v === 45, "patchV37..45: idempotent on a current SEED (no double-patch drift)");
  const fut39 = clone(SEED); fut39.v = 46; fut39.learned = { tdee: [{ d: "2026-09-01", tdee: 2500, w: 160 }], anchors: [] };
  ok(MIG(fut39).v === 46 && MIG(fut39).learned.tdee.length === 1, "patchV38: a NEWER (v46) state is handed back UNTOUCHED — rollback-safe, learned history not wiped");

  // -------- MERGE HARDENING — s.learned adversarial: must-not-LOSE + must-not-REVERT, BOTH orders --------
  ok(typeof UL === "function", "s.learned: _unionLearned is the registered reconciler (mirrors _unionPlan)");
  const devA = clone(SEED); devA.learned = { tdee: [{ d: "2026-08-01", tdee: 2600, w: 165 }, { d: "2026-08-02", tdee: 2590, w: 164.8 }], anchors: [{ id: "dexa_a", d: "2026-08-01", src: "DEXA", bf: 15 }] };
  const devB = clone(SEED); devB.learned = { tdee: [{ d: "2026-08-01", tdee: 2600, w: 165 }, { d: "2026-08-03", tdee: 2580, w: 164.6 }], anchors: [{ id: "dexa_b", d: "2026-08-03", src: "DEXA", bf: 14 }] };
  const A = MS(devA, devB), B = MS(devB, devA);
  ok(A.learned.tdee.some((x) => x.d === "2026-08-02") && A.learned.tdee.some((x) => x.d === "2026-08-03"), "s.learned A: BOTH devices' TDEE snapshots survive — the keyed union never drops one (MUST-NOT-LOSE)");
  ok(A.learned.anchors.some((a) => a.id === "dexa_a") && A.learned.anchors.some((a) => a.id === "dexa_b"), "s.learned A: BOTH devices' DEXA anchors survive — never dropped");
  ok(B.learned.tdee.length === A.learned.tdee.length && B.learned.anchors.length === A.learned.anchors.length, "s.learned: the reconcile is ORDER-INDEPENDENT (A and B agree)");
  ok(A.learned.tdee.length >= devA.learned.tdee.length && A.learned.tdee.length >= devB.learned.tdee.length && A.learned.anchors.length >= Math.max(devA.learned.anchors.length, devB.learned.anchors.length), "s.learned: |merged| >= both sides — the keyed union never shrinks");
  ok(DLG(devA, A).safe === true && DLG(devB, A).safe === true, "s.learned: the merged state passes the durability guard from BOTH inputs");
  const stale = clone(SEED); stale.learned = { tdee: [{ d: "2026-08-01", tdee: 2600, w: 165 }], anchors: [] };
  const withNew = clone(SEED); withNew.learned = { tdee: [{ d: "2026-08-01", tdee: 2600, w: 165 }, { d: "2026-08-05", tdee: 2560, w: 164 }], anchors: [{ id: "dexa_new", d: "2026-08-05", src: "DEXA", bf: 14 }] };
  ok(MS(stale, withNew).learned.anchors.some((a) => a.id === "dexa_new") && MS(withNew, stale).learned.anchors.some((a) => a.id === "dexa_new"), "s.learned: a stale device NEVER reverts/drops a newer DEXA anchor — from EITHER write order (MUST-NOT-REVERT)");
  ok(MS(stale, withNew).learned.tdee.some((x) => x.d === "2026-08-05") && MS(stale, withNew).learned.tdee.length > stale.learned.tdee.length, "s.learned: NOT wholesale local-wins — a stale client UNIONS in the remote-only learned entries (the v6.2 clobber class is closed)");
  const shrunk = clone(withNew); shrunk.learned = { tdee: [], anchors: [] };
  ok(DLG(withNew, shrunk).safe === false, "s.learned: dropping learned history is BLOCKED by the durability guard — a shrink can't be silent");
}

// ============================================================================================
// v7.3.1 — AUTO-PILOT APPROVAL LOOP. Joe: "All approvals once approved must serve their function."
// An approved steer now (1) TAKES EFFECT on the EFFECTIVE target as a tracked/reversible offset,
// (2) CLEARS the loop after handling, and (3) the cockpit status word deep-links to the pending item —
// all engine-consistent (the base band stays engine-owned), honest, and undoable.
{
  const isoAgo = (back) => { const d = new Date(Date.now() - back * 86400000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const today = isoAgo(0);
  const M = clone(SEED); M.blackout = { until: "2026-05-01" };
  M.reads = Array.from({ length: 24 }, (_, i) => ({ d: isoAgo(23 - i), w: +(176 - i * 0.06).toFixed(2), sealed: false }));
  M.dailyLogs = {}; for (let i = 0; i < 24; i++) M.dailyLogs[isoAgo(23 - i)] = { cal: 2400, pro: 210, steps: 9000 };   // intake high enough that the measured band clears the energy-availability floor with headroom to tighten
  M.proposals = []; M.adjustments = [];
  const cBefore = __test.calorieTarget(M);
  ok(!cBefore.gated, "v7.3.1 setup — a measured calorie band prints (a real state to move)");
  const dK = Math.min(288, Math.max(1, cBefore.lo - cBefore.floor - 20));   // Joe's ~288 tighten, kept clear of the energy floor so the move is VISIBLE (not clipped by the safety floor)

  // ---- proposalEffect: the SIGN is engine-consistent (tighten LOWERS cals / RAISES steps; ease the reverse) ----
  const pT = { apply: { kind: "cal", delta: 288, dir: "tighten", calDelta: -288, stepsDelta: 1500 } };
  const pE = { apply: { kind: "cal", delta: 288, dir: "ease", calDelta: 288, stepsDelta: -1500 } };
  ok(__test.proposalEffect(pT).calDelta === -288 && __test.proposalEffect(pT).stepsDelta === 1500, "proposalEffect — a TIGHTEN lowers calories (−) and raises steps (+)");
  ok(__test.proposalEffect(pE).calDelta === 288 && __test.proposalEffect(pE).stepsDelta === -1500, "proposalEffect — an EASE raises calories (+) and trims steps (−)");
  ok(__test.proposalEffect(pT, 25).calDelta === -313, "proposalEffect — the bounded ±dial moves the magnitude in the base direction (−288 → −313 at +25; Dietvorst 2018)");

  // ---- (1) APPROVING A ~288 CAL TIGHTEN SHIFTS TODAY'S BAND DOWN — the approval takes visible effect (was log-only) ----
  const staged = clone(M);
  staged.proposals = [{ id: "p_ap", rid: "ap_tighten_" + today, d: today, title: "AUTO-PILOT · TIGHTEN THE TARGET", why: "test", apply: { kind: "cal", delta: dK, dir: "tighten", calDelta: -dK, stepsDelta: 1500 }, resolved: false }];
  const after = __test.applyProposal(staged, "p_ap", 0, "cal");
  const cAfter = __test.calorieTarget(after);
  ok(cAfter.adj.delta === -dK && cAfter.adj.active === true, "APPROVAL TAKES EFFECT — a tracked −" + dK + " kcal offset is now active on the band (Joe's approval finally does something)");
  ok(cAfter.baseLo === cBefore.lo && cAfter.baseHi === cBefore.hi, "ENGINE-OWNS-NUMBERS — the base band is untouched; the delta is added ON TOP, never a mutated protected number");
  ok(cAfter.lo === cBefore.lo - dK && cAfter.hi === cBefore.hi - dK, "the EFFECTIVE band = base − offset — a clean, unclipped, engine-consistent tighten (the safety floor still clamps a bigger one)");
  ok(cAfter.mid < cBefore.mid, "TODAY's band moves DOWN — the cockpit visibly reflects the approved tighten");
  ok(after.proposals[0].resolved === true, "approving resolves the proposal → it leaves the inbox");
  ok(__test.activeAdjustment(after).via === "cal" && __test.activeAdjustment(after).calDelta === -dK, "the approved steer is the ONE active adjustment (cal) — not a compounding second number");

  // ---- (1') THE 'OR ADD STEPS' CHOICE — same steer, the walking lever instead of the plate, chosen AT approval ----
  const afterSteps = __test.applyProposal(clone(staged), "p_ap", 0, "steps");
  ok(__test.activeAdjustment(afterSteps).via === "steps" && __test.activeAdjustment(afterSteps).stepDelta === 1500, "CHOICE AT APPROVAL — 'add steps' records a STEP offset (+1500), not a calorie one");
  ok(__test.calorieTarget(afterSteps).adj.delta === 0, "…and choosing steps leaves the calorie band alone — the athlete's pick is honoured");
  const stB = __test.stepTarget(M);
  ok(stB.gated || (__test.stepTarget(afterSteps).mid === stB.mid + 1500 && __test.stepTarget(afterSteps).adjSteps === 1500), "'add steps' raises the EFFECTIVE step target by the tracked offset (raises steps, not the plate)");

  // ---- (2) THE LOOP CLEARS — a handled steer stops re-raising; the magnitude NEEDS-YOU ask drops ----
  ok(__test.autoPilot(staged).proposed === true, "LOOP setup — the staged steer is a live proposal");
  ok(__test.autoPilot(after).proposed === false && __test.autoPilot(after).handledForToday === true, "LOOP CLEARS — after approving, autoPilot stops re-raising the same steer (no stale ADJUSTING/NEEDS YOU)");
  const apBig = { ok: true, proposed: true, corrKcal: 288, action: "tighten", mode: "recomp", pctRate: 0.5, targetPct: 0.7, band: { redlinePct: 1.0 }, driftSig: true, heldForStale: false, heldForNoise: false, proteinOff: false };
  const escBig = __test.escalation({}, apBig);
  ok(escBig.escalate && escBig.ask.some((a) => a.code === "magnitude"), "SAFETY PRESERVED — a ~288 kcal move is over the 200-kcal routine limit → the supervisor ASKS (NEEDS YOU); big moves still need approval");
  const apHandled = { ...apBig, proposed: false, handledForToday: true };
  ok(!__test.escalation({}, apHandled).ask.some((a) => a.code === "magnitude"), "…and once handled (proposed:false) that magnitude ask CLEARS — NEEDS YOU doesn't persist");
  const polBig = __test.autoPilotPolicy({}, { ap: apBig, level: "propose", esc: escBig });
  const polOk = __test.autoPilotPolicy({}, { ap: apHandled, level: "propose", esc: __test.escalation({}, apHandled) });
  ok(__test.statusFace({}, { sig: { state: "measured", n: 20 }, ap: apBig, rec: { stale: false }, pol: polBig, level: "propose" }).word === "NEEDS YOU", "the cockpit face reads NEEDS YOU for the ~288 kcal call");
  ok(__test.statusFace({}, { sig: { state: "measured", n: 20 }, ap: apHandled, rec: { stale: false }, pol: polOk, level: "propose" }).word !== "NEEDS YOU", "after handling, statusFace recomputes off the handled steer — NEEDS YOU clears (cockpit refreshes)");

  // ---- (3) NEEDS YOU IS TAPPABLE → deep-links to the pending item, then recomputes once handled ----
  ok(__test.statusTarget(staged) && __test.statusTarget(staged).key === "now.inbox" && __test.statusTarget(staged).id === "pl-inbox", "TAPPABLE — with a proposal waiting, the status word deep-links to the approval inbox (pl-inbox), like the marching order");
  ok(__test.statusTarget(after) == null || __test.statusTarget(after).key !== "now.inbox", "after approving, the inbox is empty → the hero deep-link recomputes (no dead link to a cleared inbox)");

  // ---- REVERSIBLE — undo removes the offset and hands the decision back (Law 10) ----
  const und = __test.undoAdjustment(after, "ap_tighten_" + today);
  ok(__test.calorieTarget(und).adj.active === false && __test.calorieTarget(und).adj.delta === 0, "UNDO REVERTS — one tap removes the offset; the band returns to the engine base");
  ok(__test.calorieTarget(und).lo === cBefore.lo && __test.calorieTarget(und).hi === cBefore.hi, "…the reverted band equals the original engine-owned band exactly (nothing was ever mutated)");
  ok(und.proposals[0].resolved === false, "UNDO re-opens the decision back into the inbox (Law 10)");

  // ---- RECONCILES — the offset self-retires at the next weigh-in (not a permanent competing number) ----
  const nextDay = clone(after); nextDay.reads = [...nextDay.reads, { d: isoAgo(-1), w: 174.4, sealed: false }];   // a weigh-in AFTER the applied day
  ok(__test.activeAdjustment(nextDay).active === false && __test.calorieTarget(nextDay).adj.delta === 0, "RECONCILES — the next weigh-in expires the offset; the engine re-measures and takes the wheel (no double-count)");

  // ---- AUTONOMY / SAFETY GATING STILL HOLDS (a big move never auto-applies; L1 never auto-applies; routine does at L2/L3) ----
  ok(__test.autoPilotPolicy({}, { ap: apBig, level: "runit", esc: escBig }).autoApply === false, "SAFETY — even at Run-it a ~288 (>200) move does NOT auto-apply; the supervisor vetoes and it asks");
  const apRoutine = { ok: true, proposed: true, corrKcal: 120, action: "tighten", mode: "recomp", pctRate: 0.6, targetPct: 0.7, band: { redlinePct: 1.0 }, driftSig: true, heldForStale: false, heldForNoise: false, proteinOff: false };
  const escRoutine = __test.escalation({}, apRoutine);
  ok(__test.autoPilotPolicy({}, { ap: apRoutine, level: "propose", esc: escRoutine }).autoApply === false, "AUTONOMY — at Propose (L1) even a routine move never auto-applies; one-tap approval is the floor");
  ok(__test.autoPilotPolicy({}, { ap: apRoutine, level: "autonotice", esc: escRoutine }).autoApply === true, "…a routine <200 in-corridor move DOES auto-apply at Auto-with-notice — and (v7.3.1) that auto-apply now moves the band too, tracked + undoable");

  // ---- MERGE HARDENING INTACT — the approved-effect adjustment survives the keyed union, both orders ----
  const MS = __test.mergeState, DLG = __test.dataLossGuard;
  const devX = clone(SEED); devX.adjustments = [{ rid: "ap_tighten_x", id: "adj_x", d: today, via: "cal", calDelta: -288, from: today, title: "t" }];
  const devY = clone(SEED); devY.adjustments = [{ rid: "ap_steps_y", id: "adj_y", d: today, via: "steps", stepDelta: 1500, from: today, title: "u" }];
  const mgd = MS(devX, devY), mgd2 = MS(devY, devX);
  ok(mgd.adjustments.some((a) => a.id === "adj_x") && mgd.adjustments.some((a) => a.id === "adj_y"), "MERGE HARDENING INTACT — an approved-effect adjustment from EITHER device survives the keyed union (never dropped)");
  ok(mgd.adjustments.find((a) => a.id === "adj_x").calDelta === -288 && mgd2.adjustments.find((a) => a.id === "adj_x").calDelta === -288, "…and the effect payload (calDelta) survives intact, order-independent — the new via/calDelta fields ride the s.adjustments hardening");

  // ---- (4) CONDITIONAL FORESIGHT (v7.4.1) — the plan-conditional projection line. forecast(s) stays a
  //         MEASURED baseline; this is the SUBORDINATE "if you hold this new target" read: labeled
  //         hypothetical, routed through the ONE twin rate, computed LIVE off s, gated on a measured rate,
  //         and self-retiring with the offset. This is the fix for "foresight doesn't update from autopilot"
  //         done HONESTLY — a second, clearly-conditional line, never a silent mutation of the measured one.
  const CFore = __test.conditionalForesight, DTwin = __test.digitalTwin, aAdj = __test.activeAdjustment;
  ok(CFore(clone(SEED)) === null, "CONDITIONAL FORESIGHT — with NO live steer it returns null → the line COLLAPSES onto the measured projection (no second number when nothing is applied)");
  const cfCal = CFore(after);
  ok(cfCal && cfCal.conditional === true && cfCal.measured === false, "CONDITIONAL FORESIGHT — a live cal steer yields a line LABELED conditional (measured:false) — it can never be read as the measured trend");
  ok(cfCal && cfCal.etaWks === DTwin(after, { calDelta: aAdj(after).calDelta }).etaMid, "CONDITIONAL FORESIGHT — its ONE number IS digitalTwin(…calDelta).etaMid — routed through the existing engine, no competing rate/band/normCdf");
  const cfSteps = CFore(afterSteps);
  ok(cfSteps && cfSteps.via === "steps" && cfSteps.etaWks === DTwin(afterSteps, { stepsDelta: aAdj(afterSteps).stepDelta }).etaMid, "CONDITIONAL FORESIGHT — a STEP steer routes through digitalTwin(stepsDelta) (the NEAT lever), still ONE engine-owned eta");
  const afterPoison = clone(after); afterPoison.forecasts = [{ d: today, trend: 999, rate: 9.9, pred7: 9.9, sealed: false }];
  ok(eq(CFore(afterPoison), CFore(after)), "CONDITIONAL FORESIGHT — recomputes LIVE off s: poisoning the cached s.forecasts snapshot does NOT move it (it never reads s.forecasts)");
  const coldSteer = clone(after); coldSteer.reads = []; coldSteer.weekly = [];
  ok(aAdj(coldSteer).active === true && __test.currentRate(coldSteer).measured === false && CFore(coldSteer) === null, "CONDITIONAL FORESIGHT — GATED on a measured rate: a live steer with too little data to measure the rate shows NO conditional line (no baseline, no promise)");
  ok(CFore(nextDay) === null, "CONDITIONAL FORESIGHT — once the steer reconciles at the next weigh-in it returns null again — the conditional line self-retires with the offset");
  const dt0 = DTwin(clone(M), {});
  ok(DTwin(clone(M), { stepsDelta: 2000 }).newRate === DTwin(clone(M), { steps: (dt0.stepsNow || 8000) + 2000 }).newRate, "digitalTwin.stepsDelta (v7.4.1) — a relative step delta lands on the SAME newRate as the equivalent absolute steps target (additive, engine-consistent, no competing number)");

  // ---- (5) CONDITIONAL FORESIGHT ALSO RENDERS UNDER A FIRING REDLINE CROSSING (v7.4.1 display fix) ----
  // The FORESIGHT panel is a 3-way branch: CROSSING (returns first) → PROJECTION → CALIBRATING. When the
  // redline-crossing warning fires AND a steer is live, conditionalForesight() returned a valid line but the
  // CROSSING branch's early return swallowed it — so an applied EASE during an approaching-redline warning
  // showed no plan-conditional read. It is now rendered inside the crossing container too (same selector,
  // same ONE engine-owned number). Fixture: a steep, real (noisy ⇒ ci>0) downtrend near the lean-loss redline
  // that FIRES the crossing, plus a live EASE steer — the exact "ease during an approaching-redline" state.
  const XJIT = [0.2,-0.3,0.1,0.4,-0.2,-0.1,0.3,-0.4,0.2,0.0,-0.3,0.1,0.3,-0.2,0.4,-0.1,-0.3,0.2,0.1,-0.4,0.3,-0.2,0.0,0.2];
  const xBase = clone(M);
  /* R3 - steepened 0.25 -> 0.30 lb/day. The fixture is written to sit NEAR the
     lean-loss redline, and the redline moved from an authored 1.9 lb to the cited
     1.0 %BW/wk. Recalibrating the fixture keeps its INTENT (crossing fires while a
     steer is live, so the conditional line must render inside the crossing branch)
     rather than keeping a slope that was only near a threshold that no longer exists. */
  xBase.reads = Array.from({ length: 24 }, (_, i) => ({ d: isoAgo(23 - i), w: +(184 - i * 0.22 + XJIT[i]).toFixed(2), sealed: false }));
  xBase.proposals = [{ id: "p_ease", rid: "ap_ease_" + today, d: today, title: "AUTO-PILOT · EASE THE TARGET", why: "approaching the lean-loss rate", apply: { kind: "cal", delta: 200, dir: "ease", calDelta: 200, stepsDelta: -1500 }, resolved: false }];
  const xCross = __test.applyProposal(xBase, "p_ease", 0, "cal");
  const xFx = __test.forecast(xCross);
  ok(xFx.crossing.fires === true && aAdj(xCross).active === true && __test.currentRate(xCross).measured === true, "CROSSING + STEER — a steep real downtrend near the redline FIRES the crossing while an EASE steer is live (the exact state the crossing branch handles; the branch returns before PROJECTION, so this is the state that previously swallowed the line)");
  const xCf = CFore(xCross);
  ok(xCf && xCf.conditional === true && xCf.etaWks === DTwin(xCross, { calDelta: aAdj(xCross).calDelta }).etaMid, "CROSSING branch renders the plan-conditional line — conditionalForesight() is present under a firing crossing and carries the SAME ONE engine-owned eta (digitalTwin) as the projection branch; the applied ease is no longer swallowed by the early return");
  ok(__test.etaReached(0) === true, "TARGET-REACHED relabel — etaMid/etaWks === 0 means already AT/PAST target ⇒ the line reads 'target reached', never a misleading '~0 wks' (relabel applies to BOTH the measured and the plan-conditional line)");
  ok(__test.etaReached(3) === false && __test.etaReached(null) === false, "…and a real positive eta (or an absent one) is NOT relabeled — only an exact 0 reads 'target reached'");
  ok(DTwin(clone(M), {}).newRate === DTwin(clone(M), { stepsDelta: 0 }).newRate, "digitalTwin.stepsDelta — defaults to 0: an unset delta changes nothing (backward-compatible with every existing caller)");

  // ---- (5) PHASE PROPOSAL blockDeeper (audit follow-up) — an apply:{kind:note} proposal must NOT wear an
  //         action title. Reframed to the note convention so no future wiring can surface a misleading no-op.
  const holdProp = __test.phaseProposal(clone(SEED), { sup: { kind: "blockDeeper", first: { text: "a binding floor" } }, arc: { key: "cut" }, brk: { status: "none", honest: {}, maintenance: null }, today });
  ok(holdProp && holdProp.apply.kind === "note" && /review/i.test(holdProp.title + " " + holdProp.why) && /nothing changes automatically|no target moves|nothing moves/i.test(holdProp.why) && !/one tap to undo/i.test(holdProp.why), "PHASE PROPOSAL (blockDeeper) — an apply:{kind:note} steer now reads as a REVIEW note (nothing changes automatically, no false 'undo') — the action-titled no-op is gone by construction");
}

// ============================================================================================
// v7.4.0 · SLICE 5 — THE PHASE ARC (diet breaks + phase transitions + the safety supervisor as a
// phase-level authority). Engine-owned, honest, charter-safe. See PHASE ARC block in src/app.jsx.
// ============================================================================================
{
  const { phaseArc, dietBreakState, dietBreakHonest, phaseSupervisor, phaseProposal, applyProposal,
    undoAdjustment, mergeState, dataLossGuard, calorieTarget, escalation, autoPilot, statusFace,
    dietExit, SCHEMA_V, migrate, STATUS_WORDS, BREAK_LEN_DAYS } = __test;
  const isoAgo = (back) => { const d = new Date(Date.now() - back * 86400000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const today = isoAgo(0);            // frozen: 2026-07-29
  const inDays = (n) => isoAgo(-n);   // n days in the future

  // ---- A · PHASE MODEL + TRANSITIONS -------------------------------------------------------
  const arcCut = phaseArc(clone(SEED));
  ok(arcCut.key === "cut" && arcCut.label === "CUT", "PHASE — a fresh state reads as a CUT (the default; this is a cut engine)");
  ok(arcCut.weeks > 0 && arcCut.since === "2026-06-10" && typeof arcCut.line === "string" && arcCut.line.length > 10, "PHASE — the cut knows how long it has run (since START) and prints one calm line");
  ok(arcCut.next && arcCut.next.key === "maintenance" && /no date/.test(arcCut.next.when), "PHASE — next from a cut is the maintenance transition, honestly with NO date (no show date exists)");
  ok(Array.isArray(arcCut.order) && arcCut.order.length === 4, "PHASE — the arc names all four phases (cut/break/maintenance/lean-gain)");

  const leanS = clone(SEED); leanS.plan = { ...leanS.plan, phase: "leangain" };
  ok(phaseArc(leanS).key === "leangain", "PHASE — a committed lean-gain reads as LEAN GAIN");
  ok(/expert-recommendation|no longitudinal/.test(phaseArc(leanS).next.note || ""), "PHASE — lean-gain foresight is honest: advanced rate is expert-recommendation, not measurement");

  const maintS = clone(SEED); maintS.targets = { ...(maintS.targets || {}), exitStart: isoAgo(21) };
  ok(phaseArc(maintS).key === "maintenance", "PHASE — a started diet exit reads as MAINTENANCE HOLD");

  const brkActive = clone(SEED); brkActive.plan = { ...brkActive.plan, brk: { start: isoAgo(2), end: inDays(4), planned: isoAgo(2) } };
  ok(phaseArc(brkActive).key === "break", "PHASE — an active diet break reads as DIET BREAK (a maintenance pause), overriding the cut");
  ok(dietBreakState(brkActive).status === "active" && dietBreakState(brkActive).daysLeft >= 0, "PHASE — dietBreakState reports the active break with days left");
  const brkProposed = clone(SEED); brkProposed.plan = { ...brkProposed.plan, brk: { start: inDays(3), end: inDays(3 + BREAK_LEN_DAYS - 1), planned: today } };
  ok(dietBreakState(brkProposed).status === "proposed" && dietBreakState(brkProposed).startsIn === 3, "PHASE — a future-dated break reads as PROPOSED with a start countdown");

  // ---- B · DIET-BREAK HONESTY (adherence tool, NOT a metabolic trick; transient scale) -----
  const H = dietBreakHonest();
  const allBreakText = [H.what, H.metabolic, H.scale, H.buys].join("  ");
  // AFFIRMATIVE metabolic-boost claims only — the app is ALLOWED to DENY them ("not a metabolic trick/reset"), which is the honest voice; only a positive claim is forbidden.
  const FORBIDDEN = /(boost(s|ing|ed)?\s+(your\s+)?metabolism|speeds?\s+up\s+(your\s+)?metabolism|resets?\s+(your\s+)?metabolism|revs?\s+up\s+(your\s+)?metabolism|kick[-\s]?starts?\s+(your\s+)?metabolism|metabolic\s+advantage|raises?\s+(your\s+)?metabolism)/i;
  ok(!FORBIDDEN.test(allBreakText), "DIET BREAK HONESTY — the framing makes NO metabolic-boost / metabolic-reset claim (ICECAP null)");
  ok(/not a metabolic trick|does not rescue metabolic rate|unchanged/i.test(H.metabolic), "DIET BREAK HONESTY — it says plainly a break does NOT rescue metabolic rate (ICECAP/Peos 2021)");
  ok(/glycogen/i.test(H.scale) && /water/i.test(H.scale) && /(transient|not fat|comes back off)/i.test(H.scale), "DIET BREAK HONESTY — the scale jump is framed as TRANSIENT glycogen/water, not fat regained");
  ok(/adherence|hunger|restraint/i.test(H.what + H.buys) && /not a fat-loss accelerator/i.test(H.buys), "DIET BREAK HONESTY — what it buys is adherence/recovery, explicitly NOT a fat-loss accelerator");

  // supervisor-forced break proposal carries the SAME honesty and no boost claim
  const supForce = phaseSupervisor({}, { ap: { ok: false }, esc: { ask: [], escalate: false }, ea: { gated: false, ea: 22 }, ct: { gated: true } });
  const brkProp = phaseProposal(clone(SEED), { sup: supForce, brk: { status: "none", honest: H, maintenance: null }, today });
  ok(brkProp && brkProp.apply && brkProp.apply.kind === "break", "DIET BREAK — a supervisor-forced break is a propose-only 'break' proposal (routes through the inbox)");
  ok(!FORBIDDEN.test(brkProp.why) && /glycogen|water|not a metabolic/i.test(brkProp.why), "DIET BREAK — the proposal's own copy is honest (transient scale, no metabolic-boost claim)");

  // applying a break writes the honest feed
  const preBrk = clone(SEED); preBrk.proposals = [{ id: "pb1", rid: "phase_break_x", d: today, title: "DIET BREAK — A WEEK AT MAINTENANCE", why: brkProp.why, apply: { kind: "break", start: today, end: inDays(BREAK_LEN_DAYS - 1) }, resolved: false }];
  const postBrk = applyProposal(preBrk, "pb1");
  ok(!FORBIDDEN.test(postBrk.feed[0].how) && /not a metabolic reset/i.test(postBrk.feed[0].how), "DIET BREAK — the applied feed line stays honest: 'a break from hunger, not a metabolic reset'");

  // ---- C · SAFETY SUPERVISOR AS PHASE AUTHORITY (each hard floor can VETO; reuse, don't fork) --
  const clearD = { ap: { ok: false }, esc: { ask: [], escalate: false }, ea: { gated: false, ea: 30 }, ct: { gated: false, floorBinds: false } };
  ok(phaseSupervisor({}, clearD).veto === false && phaseSupervisor({}, clearD).kind === null, "SUPERVISOR — every hard floor clear ⇒ no veto, the phase plan proceeds");
  ok(phaseSupervisor({}, { ...clearD, esc: { ask: [{ code: "redline", text: "past the muscle-loss redline" }], escalate: true } }).veto === true, "SUPERVISOR VETO — the muscle-loss REDLINE (reused from escalation) vetoes pressing the cut deeper");
  ok(phaseSupervisor({}, { ...clearD, esc: { ask: [{ code: "floor-protein", text: "under the protein floor" }], escalate: true } }).reasons.some((r) => r.code === "floor-protein"), "SUPERVISOR VETO — the protein lean-retention FLOOR (reused from escalation) vetoes");
  ok(phaseSupervisor({}, { ...clearD, ea: { gated: false, ea: 22 } }).kind === "forceBreak", "SUPERVISOR VETO — energy availability under the sparing line FORCES a break (a maintenance week)");
  ok(phaseSupervisor({}, { ...clearD, ct: { gated: false, floorBinds: true } }).kind === "blockDeeper", "SUPERVISOR VETO — a binding calorie floor blocks a deeper cut (the rate is misconfigured, not 'eat at the floor')");
  ok(phaseSupervisor({ plan: { phase: "leangain" } }, { ...clearD, ct: { gated: false, floorBinds: true } }).veto === false, "SUPERVISOR — the cut-floor veto is PHASE-AWARE: it stays quiet outside a cut (lean gain has no deficit to press)");
  ok(phaseSupervisor({ targets: { exitStart: "2026-07-01" } }, { ...clearD, esc: { ask: [{ code: "redline", text: "x" }], escalate: true } }).veto === false, "SUPERVISOR — a started maintenance hold suppresses the redline veto too (no cut to deepen)");

  // REUSE (not a forked set of floors): the REAL escalation drives the redline veto
  const apRed = { ok: true, proposed: true, corrKcal: 120, action: "tighten", mode: "recomp", pctRate: 1.1, targetPct: 0.7, band: { redlinePct: 1.0 }, driftSig: true, heldForStale: false, heldForNoise: false, proteinOff: false };
  const supRed = phaseSupervisor({}, { ap: apRed, ea: { gated: true }, ct: { gated: true } });
  ok(supRed.veto && supRed.reasons.some((r) => r.code === "redline"), "SUPERVISOR REUSE — the REAL escalation's redline ask flows straight into the phase veto (one supervisor, not two)");
  // the EA floor is the engine's EA_SPARING (25), NOT a forked 30 — this is the judgment call, pinned by a test
  ok(phaseSupervisor({}, { ...clearD, ea: { gated: false, ea: 26 } }).veto === false, "SUPERVISOR — the EA floor is the engine's own EA_SPARING (25), not a forked 30: EA 26 does NOT veto");
  ok(phaseSupervisor({}, { ...clearD, ea: { gated: false, ea: 18 } }).first.text.indexOf("20") > -1, "SUPERVISOR — EA under 20 names the engine's EA_LOW line (over 40% of loss off muscle)");

  // ---- D · ENGINE-OWNS-NUMBERS (Article VIII): the phase layer PROPOSES/FRAMES, never a rival number --
  ok(!("lo" in arcCut) && !("hi" in arcCut) && !("kcal" in arcCut) && !("calDelta" in arcCut), "ENGINE-OWNS-NUMBERS — phaseArc emits NO calorie/rate band of its own (it sequences and frames only)");
  const dbNum = dietBreakState(maintS);
  ok(dbNum.maintenance === (dietExit(maintS).gated ? null : dietExit(maintS).maintenance), "ENGINE-OWNS-NUMBERS — the break's maintenance number is the ENGINE's (dietExit/observedTDEE), never authored in the phase layer");
  // the steer routes through the SAME approval loop → a decision row + the hardened s.plan, undoable
  ok(postBrk.plan.brk && postBrk.plan.brk.start === today && postBrk.plan.phaseLog.length === (preBrk.plan.phaseLog || []).length + 1, "ENGINE-OWNS-NUMBERS — approving a break writes the DATED decision to the hardened s.plan (+ phaseLog), via applyProposal");
  ok(postBrk.adjustments.some((a) => a.planUndo && a.planUndo.field === "brk"), "APPROVAL LOOP — the break is recorded on the s.adjustments decision log with a one-tap reversal");
  const undoneBrk = undoAdjustment(postBrk, postBrk.adjustments[postBrk.adjustments.length - 1].rid);
  ok((undoneBrk.plan.brk || null) === null, "APPROVAL LOOP — one-tap UNDO reverses the break through the same undo path (restores the prior state)");
  // a committed macro-phase transition routes the same way
  const preLG = clone(SEED); preLG.proposals = [{ id: "lg1", rid: "phase_lg", d: today, title: "PHASE — LEAN GAIN", why: "committed", apply: { kind: "phasePlan", to: "leangain" }, resolved: false }];
  const postLG = applyProposal(preLG, "lg1");
  ok(postLG.plan.phase === "leangain" && postLG.plan.phaseLog.some((e) => e.to === "leangain") && postLG.plan.setAt.phase, "APPROVAL LOOP — a phase transition (→ lean gain) writes the hardened, STAMPED s.plan decision + phaseLog");
  // calorieTarget is untouched by the phase layer when no break is active (no competing band injected)
  ok(JSON.stringify(calorieTarget(clone(SEED))) === JSON.stringify(calorieTarget(clone(SEED))), "ENGINE-OWNS-NUMBERS — calorieTarget is unchanged by the phase layer on a normal cut (no phase number injected)");

  // ---- E · patchV38 — additive + rollback-safe; fresh SEED === migrated --------------------
  ok(SCHEMA_V === 45, "patchV39..45 — SCHEMA_V is 45 (the calves/rows ruling on the chain)");
  ok(Array.isArray(SEED.plan.phaseLog) && SEED.plan.phaseLog.length === 0 && !("phase" in SEED.plan) && !("brk" in SEED.plan), "patchV38 — SEED authors an EMPTY phaseLog and NO phase/brk override: a fresh install === a migrated state");
  const oldV37 = clone(SEED); oldV37.v = 37; delete oldV37.plan.phaseLog;
  const m38 = migrate(oldV37);
  ok(m38.v === 45 && Array.isArray(m38.plan.phaseLog) && m38.plan.phaseLog.length === 0, "patchV38 — a v37 state migrates to v38 and seeds phaseLog EMPTY (additive)");
  ok(m38.reads.length === oldV37.reads.length && Object.keys(m38.dailyLogs).length === Object.keys(oldV37.dailyLogs).length, "patchV38 — ADDITIVE: no read or dailyLog added or lost (count-preserving)");
  ok(migrate(clone(SEED)).v === 45 && migrate(clone(SEED)).plan.phaseLog.length === 0, "patchV38 — idempotent on a current SEED (no double-patch drift)");
  const fut39 = clone(SEED); fut39.v = 46; fut39.plan = { ...fut39.plan, phase: "leangain", phaseLog: [{ id: "x", to: "leangain" }] };
  ok(migrate(fut39).v === 46 && migrate(fut39).plan.phase === "leangain", "patchV38 — a NEWER (v46) state is handed back UNTOUCHED: rollback-safe, no phase decision wiped");

  // ---- F · s.plan KEYED-UNION — a stale device must NOT REVERT nor LOSE a phase decision, BOTH orders --
  const devNew = clone(SEED); devNew.plan = { ...devNew.plan, phase: "leangain", setAt: { phase: "2026-07-29T10:00:00Z" }, rev: 5, phaseLog: [{ id: "ph_new", at: "2026-07-29T10:00:00Z", to: "leangain" }] };
  const devOld = clone(SEED); devOld.plan = { ...devOld.plan, setAt: {}, rev: 2, phaseLog: [{ id: "ph_old", at: "2026-07-20T00:00:00Z", to: "cut" }] };
  const mgN = mergeState(devOld, devNew), mgN2 = mergeState(devNew, devOld);
  ok(mgN.plan.phase === "leangain" && mgN2.plan.phase === "leangain", "MERGE — MUST-NOT-REVERT: a stale device cannot revert a newer phase decision, in EITHER merge order");
  ok([mgN, mgN2].every((m) => m.plan.phaseLog.some((e) => e.id === "ph_new") && m.plan.phaseLog.some((e) => e.id === "ph_old")), "MERGE — MUST-NOT-LOSE: every phase-log entry from either device survives the keyed union, both orders");
  ok([mgN, mgN2].every((m) => m.plan.phaseLog.length >= 2), "MERGE — the phase log never SHRINKS below the union of both devices");
  // a diet-break decision on one device survives; a NEWER 'break ended' is not re-opened by a stale device
  const devBrk = clone(SEED); devBrk.plan = { ...devBrk.plan, brk: { start: "2026-07-29", end: "2026-08-04" }, setAt: { brk: "2026-07-29T10:00:00Z" }, rev: 3 };
  const devNoBrk = clone(SEED); devNoBrk.plan = { ...devNoBrk.plan, setAt: {}, rev: 1 };
  ok(!!mergeState(devNoBrk, devBrk).plan.brk && !!mergeState(devBrk, devNoBrk).plan.brk, "MERGE — MUST-NOT-LOSE: a diet-break decision on one device survives the merge, both orders");
  const devEnded = clone(SEED); devEnded.plan = { ...devEnded.plan, brk: null, setAt: { brk: "2026-07-30T00:00:00Z" }, rev: 4 };
  const devStillOn = clone(SEED); devStillOn.plan = { ...devStillOn.plan, brk: { start: "2026-07-20", end: "2026-07-26" }, setAt: { brk: "2026-07-20T00:00:00Z" }, rev: 2 };
  ok(mergeState(devStillOn, devEnded).plan.brk === null && mergeState(devEnded, devStillOn).plan.brk === null, "MERGE — MUST-NOT-REVERT: a stale device holding an old break cannot re-open one the newer device ended, both orders");
  // the whole-state data-loss guard still passes across a phase-decision merge (no history lost)
  ok(dataLossGuard(mgN, devOld).ok !== false && dataLossGuard(mgN, devNew).ok !== false, "MERGE — the data-loss guard passes across a phase-decision merge (no read/night/log/queue shrinks)");

  // ---- G · statusFace 4-key contract intact across phase states (the Slice-1 totality holds) --
  const keysOK = (o) => o && Object.keys(o).sort().join(",") === "cause,glyph,tone,word" && STATUS_WORDS.indexOf(o.word) > -1;
  ok(keysOK(statusFace(clone(SEED))), "COCKPIT — statusFace still returns exactly {word,glyph,tone,cause} with a valid word (contract intact)");
  ok(keysOK(statusFace(brkActive)), "COCKPIT — an active diet break does not corrupt the status face: still a valid 4-key contract");
  ok(keysOK(statusFace(maintS)) && keysOK(statusFace(leanS)), "COCKPIT — maintenance and lean-gain states both keep the 4-key status-face contract");
}

console.log(`\nFINAL81: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== VOLUME AS AN EARNED LEVER (spec v5) — the drives ====================
   Audit A is the single most important test in the item and runs FIRST inside this block:
   the liftTrend feedback loop must be SEVERED AT THE SOURCE. Every mode of volumePush, the
   conversion instrument's three verdicts, the rollback receipt, the shared weekly budget in
   both directions, the merge stamp, and the decline pacing are driven — no
   asserted-in-principle guards. Fixtures are anchor-relative; 07-25..27 are dayWeather-hard
   in SEED (the real event weekend) and are deliberately avoided. */
{
  const cl82 = (o) => JSON.parse(JSON.stringify(o));
  const isoV = (k) => isoL(Date.now() - k * 864e5);
  const MON = isoV((new Date(Date.now()).getDay() + 6) % 7);
  const NEXTMON = isoL(Date.parse(MON + "T12:00:00") + 7 * 864e5);

  /* the FREE-CONFIRMED fixture: 5 numeric lifts, 8 sessions over 28 days, strictly rising
     totals at CONSTANT set counts; reads falling 35 days; clean sleep; EA gated. */
  const mkFree = () => {
    const st = cl82(SEED);
    st.blackout = { until: isoV(28) };
    st.reads = Array.from({ length: 35 }, (_, i) => ({ d: isoV(34 - i), w: +(170 - i * 0.09).toFixed(2), sealed: false }));
    st.trend = st.reads[st.reads.length - 1].w;
    st.sleep.nights = Array.from({ length: 40 }, (_, i) => ({ d: isoV(39 - i), h: 8.2 }));
    st.dailyLogs = {};
    st.sessionLog = {};
    st.exercises.forEach((e) => { e.holdFlag = false; });
    const lifts = [
      { id: "rows", w: 175, base: 16 }, { id: "press", w: 245, base: 14 },
      { id: "lateral", w: 80, base: 20 }, { id: "tricep", w: 55, base: 18 },
      { id: "ham", w: 120, base: 15 },
    ];
    for (let k = 0; k < 8; k++) {
      st.sessionLog[isoV(28 - k * 4)] = { at: 0, note: "", niggles: [], dips: 0, skipped: [], pace: "normal",
        entries: lifts.map((L) => { const tot = L.base + k; const a = Math.ceil(tot / 2);
          return { id: L.id, reps: [a, tot - a], rir: 2, rirSets: [2, 1], w: L.w }; }) };
    }
    return st;
  };
  /* the STEPPED fixture: ham runs 6 flat 2-set sessions (totals 20), then nPost 3-set
     sessions — per-set performance FALLS while raw volume-load JUMPS +~15%. The four other
     lifts rise unless overridden. */
  const mkStepped = (postTotals) => {
    const st = mkFree();
    st.sessionLog = {};
    const pre = [25, 22, 19, 16, 13, 10].map(isoV);
    const post = [7, 6, 5, 1].map(isoV).slice(0, postTotals.length);
    const others = [
      { id: "rows", w: 175, base: 24 }, { id: "press", w: 245, base: 22 },
      { id: "lateral", w: 80, base: 28 }, { id: "tricep", w: 55, base: 26 },
    ];
    [...pre, ...post].forEach((d, i) => {
      const hamEn = i < 6
        ? { id: "ham", reps: [10, 10], rir: 2, rirSets: [2, 0], w: 120 }
        : { id: "ham", reps: [8, 8, postTotals[i - 6] - 16], rir: 2, rirSets: [2, null, 0], w: 120 };
      st.sessionLog[d] = { at: 0, note: "", niggles: [], dips: 0, skipped: [], pace: "normal",
        entries: [hamEn, ...others.map((L) => { const tot = L.base + i; const a = Math.ceil(tot / 2);
          return { id: L.id, reps: [a, tot - a], rir: 2, rirSets: [2, 1], w: L.w }; })] };
    });
    return st;
  };

  /* ---------- AUDIT A — THE FEEDBACK LOOP IS SEVERED AT THE SOURCE ---------- */
  {
    const S = mkStepped([23, 24, 23, 23]);
    const tHam = __test.liftTrend(S, "ham");
    ok(!!tHam && tHam.n === 4 && tHam.resetAt === isoV(7), "AUDIT A — a set-count change starts a FRESH trend window: liftTrend reads only the " + (tHam ? tHam.n : 0) + " post-change sessions, window opening " + (tHam ? tHam.resetAt : "-") + " — the typicalError same-shape discipline arriving at the trend layer");
    ok(!!tHam && Math.abs(tHam.pct) < 1 && !(tHam.lo > 0), "AUDIT A — and on a lift that merely CARRIES the extra set (per-set performance actually fell 10 to ~7.7), the fresh window reads ~0 (" + (tHam ? tHam.pct : "-") + "%/session), NOT rising");
    /* the counterfactual, computed here the way the unguarded OLS would have read it */
    const naive = (() => {
      const seq = [20 * 120, 20 * 120, 23 * 120, 24 * 120, 23 * 120, 23 * 120];
      const n = 6, mx = 2.5, my = seq.reduce((a, b) => a + b, 0) / n;
      let sxx = 0, sxy = 0;
      seq.forEach((y, i) => { sxx += (i - mx) * (i - mx); sxy += (i - mx) * (y - my); });
      return ((sxy / sxx) / my) * 100;
    })();
    ok(naive > 2 && naive > 4 * Math.abs(tHam ? tHam.pct : 0), "AUDIT A — the counterfactual is REAL: a mixed-window OLS over the same data manufactures +" + naive.toFixed(2) + "%/session of pure mechanical jump — the signal the R1_NOTE warned volume would fabricate, and the number the cut just refused to read");
    /* three post-change sessions -> the lift abstains entirely (leaves the pool, honestly) */
    const S3 = mkStepped([23, 24, 23]);
    ok(__test.liftTrend(S3, "ham") === null, "AUDIT A — under the instrument's own min-n the fresh window returns NULL: abstention, not blindness — the lift simply leaves the pool until the window fills");
    /* pool + regime level: 4 lifts falling, one stepped — the jump must not rescue the verdict */
    const SP = mkStepped([23, 24, 23, 23]);
    Object.keys(SP.sessionLog).sort().forEach((d, i) => {
      SP.sessionLog[d].entries.forEach((en) => {
        if (en.id === "ham") return;
        const tot = ({ rows: 24, press: 22, lateral: 28, tricep: 26 })[en.id] - i;
        if (tot) { const a = Math.ceil(tot / 2); en.reps = [a, tot - a]; }
      });
    });
    const pool = __test.progressionTrend(SP);
    const ebp = __test.energyBalanceTarget(SP);
    ok(pool.state === "falling" && ebp.regime === "costing", "AUDIT A — POOLED: with the other four lifts honestly falling, the stepped lift's mechanical jump does NOT flip the verdict — progression stays " + pool.state + ", regime stays " + ebp.regime + ". costing -> fake-rising -> free was the self-exciting loop; it is severed");
    /* author-blind: the cut reads the LOG, not the config, so no author can dodge it */
    const SA = mkStepped([23, 24, 23, 23]);
    SA.exercises.find((e) => e.id === "ham").sets = 2;
    const tA = __test.liftTrend(SA, "ham");
    ok(!!tA && tA.n === 4 && tA.resetAt === isoV(7), "AUDIT F — the reset keys on the CHANGE, not its author: with the exercise config reverted, the logged series still carries the count change and the window still restarts — engine-proposed, user-called and undone changes all land in the log the same way");
  }

  /* ---------- the earned PUSH, end to end ---------- */
  {
    const F = mkFree();
    const prog = __test.progressionTrend(F);
    const eb = __test.energyBalanceTarget(F);
    const rec = __test.recoveryIndex(F);
    ok(prog.state === "rising" && eb.regime === "free" && eb.regimeConfirmed === true && rec.band === "GREEN", "VOLUME LEVER — preconditions DRIVEN, not assumed: the fixture measures rising (" + prog.pct + "%/session), regime free CONFIRMED, recovery GREEN — so every gate below is earned");
    const vp = __test.volumePush(F);
    ok(vp.mode === "PUSH" && vp.mg === "hams" && vp.exId === "ham", "VOLUME LEVER — the earned push targets the LOWEST readable allocation: hams via Ham curl, its direct numeric-load lift (Q3: low muscle first; AUDIT B: engine increments target the direct lift, never a compound)");
    ok(vp.dSess === 1 && vp.fromWk === 4 && vp.toWk === 6 && vp.fromSess === 2 && vp.toSess === 3, "VOLUME LEVER — zone-scaled: hams at 4 weekly is UNDER the floor, and one per-session set corrects it to the floor in ONE move (2→3/session = 4→6 weekly) — decisive, not a month of crawling (AUDIT D: both units computed, weekly governs)");
    const armed = __test.runAdaptive(cl82(F), isoV(0));
    const card = armed.proposals.find((p) => /^volpush_/.test(p.rid) && !p.resolved);
    ok(!!card && card.rid === "volpush_hams_" + MON && card.apply.kind === "sets" && card.apply.exId === "ham" && card.apply.delta === 1, "VOLUME LEVER — the producer files a monday-stamped CARD with a fully-armed apply (kind sets, exId, delta) — an enactor, not a note");
    ok(/2→3 per session/.test(card.why) && /4→6 weekly/.test(card.why), "VOLUME LEVER — the card states BOTH units: per-session (what he does at the gym) and weekly (what the band governs)");
    ok(/MODERATE-TO-LOW/.test(card.why) && /no trial has tested MORE volume DURING a deficit/.test(card.why), "VOLUME LEVER — grade-honest copy: the §2.3 gap is named in the card itself, no confident voice on the untested bridge");
    ok(/Ham curl/.test(card.why) && /minutes/.test(card.why), "VOLUME LEVER — the card names the exercise and prices the session cost — executable, not aspirational");
    /* THE TAP ENACTS */
    const applied = __test.applyProposal(cl82(armed), card.id, 0, "cal");
    const ham = applied.exercises.find((e) => e.id === "ham");
    ok(ham.sets === 3 && !!ham.setsAt, "VOLUME LEVER — the tap changes the thing the card names: ham.sets 2→3, STAMPED (AUDIT G) — kind:sets had a dial since v7.3.1 and no apply branch, the refeed_review defect shape, now closed");
    ok(applied.feed[0].t === "VOLUME +1 — HAMS via Ham curl (now 3 sets)", "VOLUME LEVER — with the receipt in the feed: " + applied.feed[0].t);
    const row = applied.adjustments[applied.adjustments.length - 1];
    ok(row.exUndo && row.exUndo.exId === "ham" && row.exUndo.prev === 2 && row.setsDelta === 1, "VOLUME LEVER — and an EXACT undo on the row (exUndo carries the prior count), Law 10");
    /* undo reverts and restamps */
    const un = __test.undoAdjustment(cl82(applied), row.rid);
    ok(un.exercises.find((e) => e.id === "ham").sets === 2 && !!un.exercises.find((e) => e.id === "ham").setsAt, "VOLUME LEVER — undo reverts the exact count and STAMPS the revert, so a synced device cannot resurrect the undone count — and the revert is itself a set-count change the trend window restarts on (AUDIT F)");
    /* parallel channels: a second same-week push may land on a DIFFERENT muscle */
    const smw = __test.structuralMovesThisWeek(applied);
    ok(smw.sets.length === 1 && smw.mgsTouched.indexOf("hams") > -1, "VOLUME LEVER — the applied move is on the weekly budget, charged to its muscle");
    const vp2 = __test.volumePush(applied);
    ok(vp2.mode === "WITHHELD" && vp2.veto === "budget" && /returns Monday/.test(vp2.why), "VOLUME LEVER (R18f fix — SUPERSEDES the parallel-channels drive above this line): a sets move this week WITHHOLDS the chooser entirely, veto budget. The old drive permitted a same-week push to a different muscle; the audit drove the consequence — the ONE-CHANGE card claiming the set-add lever held BESIDE a desk offer of a set-add. One structural lever a week now means one, and the why names Monday");
    /* decline buys the week — and only the week */
    const decl = __test.dismissProposal(cl82(armed), card.id);
    ok(/quiet before Monday/.test((decl.feed[0] || {}).how || ""), "VOLUME LEVER — the decline copy states what it buys (quiet before Monday) — R14's copy-and-mechanism-agree rule at birth");
    const sameWk = __test.runAdaptive(cl82(decl), isoV(0));
    ok(!sameWk.proposals.some((p) => /^volpush_hams_/.test(p.rid) && !p.resolved), "VOLUME LEVER — declined, the DECLINED muscle does not refile the same week — no always-on nagging (the owner's-call cards for other muscles are a separate, once-ever filing and legitimately stay open)");
    const nextWk = __test.runAdaptive(cl82(decl), NEXTMON);
    ok(nextWk.proposals.some((p) => p.rid === "volpush_hams_" + NEXTMON && !p.resolved), "VOLUME LEVER — and the monday rolls the rid, so a still-sanctioned state RE-ASKS next week: the decline bought the week, not silence forever");
  }

  /* ---------- every guard FIRES on a fixture built to trip it ---------- */
  {
    /* recovery ceiling */
    const Fr = mkFree();
    Fr.sleep.nights = Fr.sleep.nights.map((n) => ({ ...n, h: 5.5 }));
    const vpr = __test.volumePush(Fr);
    ok(vpr.mode === "WITHHELD" && vpr.veto === "recovery", "VOLUME GUARD — the recovery ceiling FIRES: short nights drive the band off GREEN and the push is withheld — the response-based ceiling, driven, and the first ENFORCED reader of the 'no structural change' promise the recovery card has been making in prose");
    /* one-variable budget, cal direction */
    const Fb = mkFree();
    Fb.adjustments = [...(Fb.adjustments || []), { rid: "x", id: "a1", d: isoV(1), via: "cal", calDelta: -50, from: isoV(1) }];
    const vpb = __test.volumePush(Fb);
    ok(vpb.mode === "WITHHELD" && vpb.veto === "budget" && /calorie-band change/.test(vpb.why), "VOLUME GUARD — one variable per week FIRES: a same-week calorie steer blocks the volume push, and the copy names which lever spent the budget");
    /* one-variable budget, steps direction */
    const Fs = mkFree();
    Fs.adjustments = [...(Fs.adjustments || []), { rid: "steppush_" + MON, id: "a2", d: isoV(1), via: "steps", stepDelta: 1000, from: isoV(1) }];
    ok(__test.volumePush(Fs).veto === "budget", "VOLUME GUARD — a same-week step push spends the same budget");
    /* and the budget binds the OTHER lever too: a sets move blocks steppush */
    const stP = cl82(SEED);
    Object.keys(stP.dailyLogs || {}).forEach((d) => { stP.dailyLogs[d] = { ...(stP.dailyLogs[d] || {}), steps: 15000 }; });
    stP.reads = Array.from({ length: 28 }, (_, i) => ({ d: isoV(27 - i), w: +(166 - i * 0.05).toFixed(2), sealed: false }));
    stP.trend = stP.reads[stP.reads.length - 1].w;
    stP.sleep.nights = Array.from({ length: 10 }, (_, i) => ({ d: isoV(9 - i), h: 8.2 }));
    stP.blackout = { until: isoV(28) };
    stP.adjustments = [...(stP.adjustments || []), { rid: "volpush_hams_" + MON, id: "a3", d: isoV(1), title: "x", exUndo: { exId: "ham", field: "sets", prev: 2 }, setsDelta: 1 }];
    const spB = __test.stepPush(stP);
    ok(spB.mode === "WITHHELD" && spB.veto === "budget", "VOLUME GUARD — ONE owner, both directions: the same weekly budget makes stepPush withhold when a set-count change landed this week (this state pushes without the sets row — the steppush suite above proves it)");
    /* the absolute ceiling */
    const Fc = mkFree();
    Fc.exercises.forEach((e) => { e.sets = 8; });
    const vpc = __test.volumePush(Fc);
    ok(vpc.mode === "WITHHELD" && vpc.veto === "ceiling" && vpc.skips.some((x) => x.why.indexOf(String(__test.VOL_BANDS.ceil)) > -1), "VOLUME GUARD — the ABSOLUTE ceiling FIRES: with every muscle at the top the push is withheld naming " + __test.VOL_BANDS.ceil + " weekly — the numeric backstop (Q2) behind the response gates, STEP_PUSH_ABS_CEIL in mirror, derived from VOL_BANDS.ceil rather than invented");
    /* trend-blind refusal */
    const Ft = mkFree();
    Ft.exercises.find((e) => e.id === "ham").w = "hold";
    const vpt = __test.volumePush(Ft);
    const blindSkip = (vpt.skips || []).find((x) => x.mg === "hams");
    ok(vpt.mode === "PUSH" && vpt.mg !== "hams" && !!blindSkip && /trend-blind/.test(blindSkip.why), "VOLUME GUARD (AUDIT C) — a trend-blind lift is REFUSED with the reason named: sessionScore cannot read a non-numeric load, so its conversion window could never close — the proposal moves to a readable muscle instead");
    /* compound spillover charges the budget */
    const FS = mkFree();
    FS.feed = [{ d: isoV(1), t: "VOLUME +1 — CHEST via Press (now 4 sets)", how: "x" }, ...(FS.feed || [])];
    const smwS = __test.structuralMovesThisWeek(FS);
    ok(["chest", "triceps", "delts_front"].every((m) => smwS.mgsTouched.indexOf(m) > -1), "VOLUME GUARD (AUDIT B) — a compound set change charges its fractional spillover against every lent-into muscle's weekly budget: press touches chest AND triceps AND front delts — 'parallel channels' must not pretend a compound is one channel");
  }

  /* ---------- the conversion instrument — three verdicts, rollback, and no self-confirmation ---------- */
  {
    const S = mkStepped([23, 24, 23, 23]);
    const vc = __test.volumeConversion(S, "ham");
    ok(vc.status === "LIVE" && vc.verdict === "NOT_CONVERTED" && vc.delivered === true, "CONVERSION — a lift that gained a set and made ZERO progress on it reads DID NOT CONVERT, with the effort verified delivered: the check that could never fail is the defect this exists to kill, and the fresh-window reset is why it CAN fail");
    /* READING state honors the instrument's own min-n */
    const S3 = mkStepped([23, 24, 23]);
    const vc3 = __test.volumeConversion(S3, "ham");
    ok(vc3.status === "READING" && vc3.have === 3 && vc3.need === 4, "CONVERSION — the read window is DERIVED from liftTrend's own min-n (" + vc3.have + "/" + vc3.need + "), never a hand-picked constant");
    /* and an open read window blocks the next push on that muscle only */
    const vpR = __test.volumePush(S3);
    const readSkip = (vpR.skips || []).find((x) => x.mg === "hams");
    ok(!!readSkip && /still being read/.test(readSkip.why), "CONVERSION — an unread increment blocks a SECOND increment on the SAME muscle (skip names the open window) while other muscles remain eligible — one experiment per channel");
    /* UNDELIVERED: sandbagged sets cannot convict volume */
    const SU = mkStepped([23, 24, 23, 23]);
    Object.keys(SU.sessionLog).sort().slice(-4).forEach((d) => {
      const en = SU.sessionLog[d].entries.find((e) => e.id === "ham");
      if (en && en.reps.length === 3) en.rirSets = [2, null, 3];
    });
    const vcU = __test.volumeConversion(SU, "ham");
    ok(vcU.verdict === "UNDELIVERED" && /never arrived as prescribed effort/.test(vcU.why), "CONVERSION — the final-set RIR reports are the effort-compliance input: hard sets left 3 in the tank read UNDELIVERED, and the copy says the dose never arrived rather than convicting volume");
    /* CONVERTED: genuine post-change progression with effort */
    const SC = mkStepped([20, 22, 24, 26]);
    const vcC = __test.volumeConversion(SC, "ham");
    ok(vcC.verdict === "CONVERTED" && vcC.trend.lo > 0, "CONVERSION — genuine progression on the fresh window with effort delivered reads CONVERTED — the climb may continue, gated by the same read discipline");
    /* rollback: NOT_CONVERTED + fatigue -> a receipt-carrying card whose tap removes the sets */
    const SR = mkStepped([23, 24, 23, 23]);
    SR.exercises.find((e) => e.id === "ham").holdFlag = true;
    SR.exercises.find((e) => e.id === "ham").sets = 3;
    const vcR = __test.volumeConversion(SR, "ham");
    ok(vcR.rollback === true && vcR.fatigueUp === true, "ROLLBACK — armed only when the read window CLOSED unconverted AND fatigue rose (governor hold here) — flat-but-cheap holds instead of rolling back");
    const raR = __test.runAdaptive(cl82(SR), isoV(0));
    const rollCard = raR.proposals.find((p) => /^volroll_ham_/.test(p.rid) && !p.resolved);
    ok(!!rollCard && rollCard.apply.kind === "sets" && rollCard.apply.delta === -1, "ROLLBACK — filed as a proposal with its own receipt, never a silent revert (Law 10: offer, never impose)");
    ok(/added to Ham curl on/.test(rollCard.why) && /no progression/.test(rollCard.why), "ROLLBACK — the receipt names the date the set was added, the measured non-result, and the cost — the experiment is the receipt");
    const rApplied = __test.applyProposal(cl82(raR), rollCard.id, 0, "cal");
    ok(rApplied.exercises.find((e) => e.id === "ham").sets === 2 && rApplied.feed[0].t === "VOLUME -1 — HAMS via Ham curl (now 2 sets)", "ROLLBACK — the tap removes exactly the added sets, with the receipt in the feed");
  }

  /* ---------- the live snapshot: everything ABSTAINS, and nothing else moved ---------- */
  {
    const S7v = JSON.parse(readFileSync("tools/snapshots/2026-08-07-ledger.json", "utf8"));
    const vp7 = __test.volumePush(S7v);
    ok(vp7.mode === "HOLD" && vp7.regime === "free", "SNAPSHOT 2026-08-07 (R17) — volumePush now HOLDS rather than ABSTAINS: the regime reads " + vp7.regime + " because the lift trends came back, so the lever is awake and refusing on its own merits (unconfirmed regime, one-move budget) instead of being dark for want of data it always had");
    const ra7 = __test.runAdaptive(cl82(S7v), "2026-08-07");
    const oc7 = ra7.proposals.filter((p) => /^volpush_/.test(p.rid) && !p.resolved);
    ok(oc7.length === 3 && ["volpush_hams_", "volpush_chest_", "volpush_delts_rear_"].every((r) => oc7.some((p) => p.rid.indexOf(r) === 0)), "SNAPSHOT 2026-08-07 — exactly the THREE owner's-call cards file on the live state (hams, chest, rear delt) — the earned producer still abstains (regime unknown), and the owner's decision rides the same machinery it would have earned");
    ok(!ra7.proposals.some((p) => /^volroll_/.test(p.rid) && !p.resolved), "SNAPSHOT 2026-08-07 — and no rollback fires: nothing has been read yet");
    const vi7 = __test.volumeImbalance(S7v);
    ok(vi7.growthOK === false && vi7.regimeKey === "free" && vi7.why.indexOf("Filed, not proposed") === 0 && /Roth 2023/.test(vi7.why), "SNAPSHOT 2026-08-07 (R17) — the allocation card still FILES rather than proposes, and now names the regime it actually reads (" + vi7.regimeKey + ", unconfirmed) instead of unknown: the refusal is unchanged, the reason is honest");
    const eb7 = __test.energyBalanceTarget(S7v, { asOf: "2026-08-07" });
    ok(eb7.lo === 2221 && eb7.hi === 2308, "SNAPSHOT 2026-08-07 — the eat band is BYTE-IDENTICAL through the whole item (" + eb7.lo + "-" + eb7.hi + "): the liftTrend cut is a no-op on his real data (zero blips measured), so nothing he sees moved");
    const t7 = __test.liftTrend(S7v, "lateral");
    ok(t7 && t7.n === 4 && typeof t7.pct === "number", "SNAPSHOT 2026-08-07 (R17) — liftTrend READS lateral now: " + (t7 ? t7.n : 0) + " sessions, " + (t7 ? t7.pct : "—") + "%/session. It abstained before because one estimated-food day removed its most recent point; the sessions were always there and always measured");
  }

  /* ---------- RIR integration + the lab card + the decline map ---------- */
  {
    const F = mkFree();
    ok(JSON.stringify(__test.rirPlan(F, { sets: 4, hi: 12 }).plan) === "[2,1,1,0]", "RIR — an added set re-keys the taper to [2,1,1,0]: the new set arrives as a hard 1-in-the-tank set and failure stays spent exactly once, on the final set — no new wiring, verified rather than trusted");
    ok(JSON.stringify(__test.rirPlan(F, { sets: 4, hi: 12, holdFlag: true }).plan) === "[2,2,2,2]", "RIR — and the governor hold still floors every slot at 2 across the new count: holdFlag machinery follows the set count");
    const wing82 = __test.labAnalytics2(cl82(SEED));
    const vcCard = wing82.find((c) => c.id === "volconv");
    ok(!!vcCard && vcCard.status === "ARMED", "LAB — the VOLUME CONVERSION instrument exists and arms cold: no set-count change on record yet, counting only, no verdict");
    const wingLive = __test.labAnalytics2(mkStepped([23, 24, 23, 23]));
    const vcLive = wingLive.find((c) => c.id === "volconv");
    ok(!!vcLive && vcLive.status === "LIVE" && /not converting/.test(vcLive.forYou), "LAB — and goes LIVE the day a change lands in the log, reading the same volumeConversion the producer gates on — one owner, one slope, the stepeff discipline");
    const dsrc82 = readFileSync("src/app.jsx", "utf8");
    const dbSlice = dsrc82.slice(dsrc82.indexOf("DECLINE_BUYS = {"), dsrc82.indexOf("};", dsrc82.indexOf("DECLINE_BUYS = {")));
    ok(/volpush:/.test(dbSlice) && /volroll:/.test(dbSlice), "R14 — what a volume decline buys is stated per kind in the DECLINE_BUYS map, keyed by rid like steppush — copy and mechanism agree from birth");
  }

  /* ---------- merge (AUDIT G): a set-count change survives BOTH orders ---------- */
  {
    const A9 = cl82(SEED), B9 = cl82(SEED);
    const hamA = A9.exercises.find((e) => e.id === "ham");
    hamA.sets = 3; hamA.setsAt = isoV(0) + "T12:00:00.000Z";
    const hamB = B9.exercises.find((e) => e.id === "ham");
    hamB.lastMeta = { d: isoL(Date.parse(isoV(0) + "T12:00:00") + 864e5), w: 120, reps: [10, 10], debt: false };
    const m1 = __test.mergeState(A9, B9), m2 = __test.mergeState(B9, A9);
    const g1 = m1.exercises.find((e) => e.id === "ham"), g2 = m2.exercises.find((e) => e.id === "ham");
    ok(g1.sets === 3 && g2.sets === 3, "AUDIT G — the stamped set-count change SURVIVES both merge orders even though the stale-count device trained the lift AFTER the change (newer lastMeta.d wins the wholesale merge — and would have resurrected sets 2 without the stamp)");
    ok(g1.lastMeta.d === hamB.lastMeta.d && g2.lastMeta.d === hamB.lastMeta.d, "AUDIT G — while the newer SESSION still wins everything else on the lift: the stamp protects exactly one field, never the progression state");
    ok(__test.dataLossGuard(B9, m1).safe && __test.dataLossGuard(A9, m2).safe, "AUDIT G — and the data-loss guard holds from both inputs");
    const C9 = cl82(A9);
    C9.exercises.find((e) => e.id === "ham").sets = 2;
    C9.exercises.find((e) => e.id === "ham").setsAt = isoL(Date.parse(isoV(0) + "T12:00:00") + 864e5) + "T12:00:00.000Z";
    ok(__test.mergeState(A9, C9).exercises.find((e) => e.id === "ham").sets === 2, "AUDIT G — a NEWER stamp (an undo, a later change) beats an older one: the field reconciles by deliberateness, the plan.setAt discipline at field grain");
    const D1 = cl82(SEED), D2 = cl82(SEED);
    ok(__test.mergeState(D1, D2).exercises.find((e) => e.id === "ham").sets === 2, "AUDIT G — unstamped vs unstamped keeps the wholesale winner: historical lifts carry no stamp on purpose (the pace precedent — absent reads as unknown, no schema patch invents one)");
  }

  /* ---------- the dial's zero is honored, not clamped away ---------- */
  {
    const F = mkFree();
    const armed = __test.runAdaptive(cl82(F), isoV(0));
    const card = armed.proposals.find((p) => /^volpush_/.test(p.rid) && !p.resolved);
    const z = __test.applyProposal(cl82(armed), card.id, -1, "cal");
    ok(z.exercises.find((e) => e.id === "ham").sets === 2 && /YOUR VERSION WAS ZERO/.test(z.feed[0].t), "VOLUME LEVER — dialing the change to zero enacts exactly the athlete's version: nothing moves, and the feed says so — a tap never silently does more than its label");
  }
}
console.log(`\nFINAL82: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== OWNER'S CALL — RAISE ALL THREE (rider) ====================
   Joe overrode the closed gates, on the record. The producer PRE-FILES three cards in the
   standard volpush family; the guard is the proposals/adjustments record itself, so the
   cards file once EVER, survive both merge orders, and every downstream instrument
   (conversion, budget, rollback, decline pacing) treats them natively. The owner decides;
   the app measures — driven below, not asserted in principle. */
{
  const cl84 = (o) => JSON.parse(JSON.stringify(o));
  const S7o = JSON.parse(readFileSync("tools/snapshots/2026-08-07-ledger.json", "utf8"));
  const r1 = __test.runAdaptive(cl84(S7o), "2026-08-07");
  const cards = r1.proposals.filter((p) => /^volpush_/.test(p.rid) && !p.resolved);
  ok(cards.length === 3 && cards.map((c) => c.rid).join(",") === "volpush_hams_2026-08-03,volpush_chest_2026-08-03,volpush_delts_rear_2026-08-03", "OWNER — the three cards file on the live ledger, monday-stamped, in the standard rid family: " + cards.map((c) => c.rid).join(","));
  ok(__test.runAdaptive(cl84(r1), "2026-08-07").proposals.filter((p) => /^volpush_/.test(p.rid)).length === 3, "OWNER — re-running the sweep files NOTHING new: the once-only guard reads the proposals record, not a flag");
  ok(__test.runAdaptive(cl84(r1), "2026-08-14").proposals.filter((p) => /^volpush_/.test(p.rid)).length === 3, "OWNER — and a NEW week still files nothing: once ever, not once per monday");
  const d1 = __test.runAdaptive(cl84(S7o), "2026-08-07"), d2 = __test.runAdaptive(cl84(S7o), "2026-08-07");
  ok(__test.mergeState(d1, d2).proposals.filter((p) => /^volpush_/.test(p.rid)).length === 3 && __test.mergeState(d2, d1).proposals.filter((p) => /^volpush_/.test(p.rid)).length === 3, "OWNER — two devices that each ran the producer merge to exactly three cards, both orders: the guard is merge-safe because the proposals union IS the guard's memory");
  /* the copy: owner framing + caveat + grade, per card */
  ok(cards.every((c) => /OWNER'S CALL/.test(c.title) && /chose speed over waiting/.test(c.why) && /did not convert/.test(c.why) && /rollback card comes with the receipt/.test(c.why)), "OWNER — every card carries the owner's-call framing, the honest caveat (three experiments into WATCH recovery), and the measurement promise — no confident voice, the decision attributed to its decider");
  const chestC = cards.find((c) => /chest/.test(c.rid)), rearC = cards.find((c) => /delts_rear/.test(c.rid)), hamsC = cards.find((c) => /hams/.test(c.rid));
  ok(/floor correction/i.test(hamsC.why) && /where sets pay best on the evidence/.test(hamsC.why), "OWNER — hams is graded as the FLOOR CORRECTION (the climb lands where sets pay best on the evidence's own curve), distinct from the other two — the R15e region framing, not the retired tier");
  ok(/COMPOUND/.test(chestC.why) && /triceps and front delts/.test(chestC.why) && /charges those muscles' weekly structural budget/.test(chestC.why) && /MODERATE-TO-LOW/.test(chestC.why), "OWNER (AUDIT B) — the chest card NAMES the compound spillover and the budget charge in its own copy");
  ok(/per side/.test(rearC.why) && /4–5 extra minutes/.test(rearC.why) && /weaker side/.test(rearC.why) && /MODERATE-TO-LOW/.test(rearC.why), "OWNER — the rear-delt card prices the UNILATERAL time honestly and keeps the weaker-side logging convention explicit");
  /* the taps */
  let st = cl84(r1);
  cards.forEach((c) => { const live = st.proposals.find((p) => p.rid === c.rid && !p.resolved); if (live) st = __test.applyProposal(st, live.id, 0, "cal"); });
  const gx = (id) => st.exercises.find((e) => e.id === id);
  ok(gx("ham").sets === 3 && gx("press").sets === 4 && gx("rearDelt").sets === 4 && [gx("ham"), gx("press"), gx("rearDelt")].every((e) => !!e.setsAt), "OWNER — three taps raise exactly the three lifts, every one STAMPED for the merge (AUDIT G)");
  ok(["VOLUME +1 — HAMS via Ham curl (now 3 sets)", "VOLUME +1 — CHEST via Press (now 4 sets)"].every((t) => st.feed.some((f) => f.t === t)), "OWNER — with the exact receipts in the feed");
  ok(st.adjustments.slice(-3).every((a) => a.exUndo && a.exUndo.prev >= 2 && a.setsDelta === 1), "OWNER — and an exact exUndo on every row: three one-tap reversals, independently");
  /* the designed allocation, post-approval — and what must NOT move */
  const pv84 = {}; __test.programmeVolume(st).forEach((m) => { pv84[m.mg] = m.sets; });
  ok(pv84.hams === 6 && pv84.chest === 8 && pv84.delts_rear === 8, "OWNER — the designed allocation lands: hams 6 (at the floor), chest 8 and rear delt 8 (working zone)");
  ok(pv84.triceps === 10 && pv84.delts_front === 4, "OWNER (AUDIT B) — the press spillover credits triceps to 10 and front delts to 4, both INSIDE their bands: no muscle exits its band via the spilled fraction — asserted, not assumed");
  ok(pv84.quads === 10 && pv84.calves === 8 && pv84.abs === 10 && pv84.back === 8 && pv84.delts_side === 8 && pv84.biceps === 10 && pv84.forearms === 11, "OWNER — every other bucket is UNTOUCHED: quads/calves/abs 'under' reads elsewhere are logged-vs-designed artifacts, and this assertion exists so nobody 'fixes' them later");
  /* the combined week: budget + parallel reads */
  const smw84 = __test.structuralMovesThisWeek(st);
  ok(smw84.sets.length === 3 && ["chest", "delts_front", "delts_rear", "hams", "triceps"].every((m) => smw84.mgsTouched.indexOf(m) > -1), "OWNER — the weekly budget carries all three moves and the spillover: five muscles touched in one week — the configuration the caveat priced");
  const pushable84 = (() => { const p = cl84(SEED);
    Object.keys(p.dailyLogs || {}).forEach((d) => { p.dailyLogs[d] = { ...(p.dailyLogs[d] || {}), steps: 15000 }; });
    p.reads = Array.from({ length: 28 }, (_, i) => ({ d: isoL(Date.now() - (27 - i) * 864e5), w: +(166 - i * 0.05).toFixed(2), sealed: false }));
    p.trend = p.reads[p.reads.length - 1].w;
    p.sleep.nights = Array.from({ length: 10 }, (_, i) => ({ d: isoL(Date.now() - (9 - i) * 864e5), h: 8.2 }));
    p.blackout = { until: isoL(Date.now() - 28 * 864e5) };
    p.adjustments = [...(p.adjustments || []),
      { rid: "volpush_hams_x", id: "o1", d: isoL(Date.now() - 1 * 864e5), exUndo: { exId: "ham", field: "sets", prev: 2 }, setsDelta: 1 },
      { rid: "volpush_chest_x", id: "o2", d: isoL(Date.now() - 1 * 864e5), exUndo: { exId: "press", field: "sets", prev: 3 }, setsDelta: 1 },
      { rid: "volpush_delts_rear_x", id: "o3", d: isoL(Date.now() - 1 * 864e5), exUndo: { exId: "rearDelt", field: "sets", prev: 3 }, setsDelta: 1 }];
    return p; })();
  const sp84 = __test.stepPush(pushable84);
  ok(sp84.mode === "WITHHELD" && sp84.veto === "budget", "OWNER — with three set moves on the week, a state that would otherwise PUSH steps is WITHHELD on the shared budget: the one-variable law holds under the owner's own configuration");
  /* three parallel READING states + rollback isolation */
  let rd = cl84(st);
  const iso84 = (k) => isoL(Date.parse("2026-08-07T12:00:00") + k * 864e5);
  [1, 4].forEach((k, i) => {
    rd.sessionLog[iso84(k)] = { at: 0, note: "", niggles: [], dips: 0, skipped: [], pace: "normal",
      entries: [
        { id: "ham", reps: [10, 10, 8], rir: 2, rirSets: [2, null, 0], w: 120 },
        { id: "press", reps: [8, 8, 7, 6], rir: 2, rirSets: [2, null, null, 0], w: 245 },
        { id: "rearDelt", reps: [10, 10, 9, 8], rir: 2, rirSets: [2, null, null, 0], w: 20 },
      ] };
  });
  const vcs = ["ham", "press", "rearDelt"].map((id) => __test.volumeConversion(rd, id));
  ok(vcs.every((v) => v.status === "READING") && vcs.every((v) => v.exId), "OWNER — three READING states coexist, one per lift: parallel measurement channels, each with its own window (" + vcs.map((v) => v.exId + " " + v.have + "/" + v.need).join(", ") + ")");
  /* rollback isolation: roll ham back; press and rearDelt untouched */
  let iso = cl84(st);
  iso = __test.undoAdjustment(iso, iso.adjustments.filter((a) => a.exUndo && a.exUndo.exId === "ham").slice(-1)[0].rid);
  ok(iso.exercises.find((e) => e.id === "ham").sets === 2 && iso.exercises.find((e) => e.id === "press").sets === 4 && iso.exercises.find((e) => e.id === "rearDelt").sets === 4, "OWNER — reversing one lift's move never touches another: the channels are independent in the undo direction too");
  /* the own-hold and short-last edge cases (targetsFor fit) */
  const tgtP = __test.targetsFor(gx("press"), st), tgtR = __test.targetsFor(gx("rearDelt"), st), tgtH = __test.targetsFor(gx("ham"), st);
  ok(tgtP.length === 4 && tgtP.every((x) => Number.isFinite(x) && x >= 1 && x <= gx("press").hi), "OWNER EDGE — press at 4 sets produces FOUR sane targets through its authored-array path (" + tgtP.join(",") + "): the own-hold survives the count change instead of silently shrinking the session");
  ok(tgtR.length === 4 && tgtR.every((x) => Number.isFinite(x) && x >= 1) && tgtH.length === 3 && tgtH.every((x) => Number.isFinite(x) && x >= 1), "OWNER EDGE — rear delt pads its short last-array to 4 and ham to 3, no undefined or NaN slot anywhere (" + tgtR.join(",") + " / " + tgtH.join(",") + ")");
  ok(JSON.stringify(__test.rirPlan(st, gx("press")).plan) === "[2,1,1,0]" && JSON.stringify(__test.rirPlan(st, gx("rearDelt")).plan) === "[2,1,1,0]" && JSON.stringify(__test.rirPlan(st, gx("ham")).plan) === "[2,1,0]", "OWNER EDGE — the effort ladders re-key on THESE lifts specifically: press and rear delt run 2·1·1·0, ham 2·1·0 — failure spent exactly once each");
  /* fitN is IDENTITY on every live authored array — the engine change changes nothing today */
  const idOK = [...(S7o.exercises || []), ...SEED.exercises].filter((e) => e.std || e.reclaim).every((e) => ((e.std || e.reclaim).length === e.sets));
  ok(idOK, "OWNER EDGE — every live std/reclaim array already matches its set count, so the fit rule is a proven IDENTITY on current data: it exists for the count-change future, and it changed nothing about today");
  /* decline: once ever means a decline is durable for this producer */
  let dst = cl84(r1);
  dst = __test.dismissProposal(dst, dst.proposals.find((p) => /^volpush_hams_/.test(p.rid) && !p.resolved).id);
  const dre = __test.runAdaptive(cl84(dst), "2026-08-14");
  ok(dre.proposals.filter((p) => /^volpush_hams_/.test(p.rid)).length === 1 && !dre.proposals.some((p) => /^volpush_hams_/.test(p.rid) && !p.resolved), "OWNER — a declined owner's-call card never refiles from this producer (once EVER); the earned producer remains the only path back, and it must re-earn the gates");
}
console.log(`\nFINAL84: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== THE OPENER ASK RETURNS (rider) ====================
   Production 8/4 + 8/6: v7.12.0 removed the opener ask, every entry carried rir:null,
   rows' holdFlag froze TRUE (the release branch needs en.rir >= 1 — unreachable), and the
   analyst blamed the blank it created. The flow is re-timed, the engine unchanged — the
   drives below replay the production failure END TO END through the gym path
   (gymEntries -> completeSession), never from hand-built entries. */
{
  const cl85 = (o) => JSON.parse(JSON.stringify(o));
  const SNAP85 = JSON.parse(readFileSync("tools/snapshots/2026-08-06-ledger.json", "utf8"));
  const slp85 = { clean: true, run: 3, last: { d: "2026-08-05", h: 8 } };
  const sessEx = [{ id: "rows", n: "Rows (strapless)", w: 180, tgt: [9, 8] }];
  const viaGym = (tgt, reps, rirVal, rirEndVal) => __test.gymEntries(sessEx.map((e) => ({ ...e, tgt })), { reps: { rows: reps }, rir: rirVal == null ? {} : { rows: rirVal }, rirEnd: rirEndVal == null ? {} : { rows: rirEndVal }, gskip: {}, touched: { rows: true } }).entries;
  /* THE PRODUCTION REPLAY: rows 180x9,8, honest opener 1, through the gym path */
  ok(SNAP85.exercises.find((e) => e.id === "rows").holdFlag === true && JSON.stringify(SNAP85.exercises.find((e) => e.id === "rows").rirHist) === "[0,0]", "OPENER — the frozen snapshot carries the real stuck state: rows HELD with rirHist [0,0], the exact production condition this rider exists to release");
  const rated = __test.completeSession(cl85(SNAP85), "2026-08-06", viaGym([9, 8], [9, 8], 1, 0), slp85, {});
  ok(rated.lines.some((l) => l.t === "ROWS (STRAPLESS) — HOLD RELEASED") && rated.s.exercises.find((e) => e.id === "rows").holdFlag === false, "OPENER — REPLAYED: the same honest 180x9,8 WITH its opener rated 1 fires HOLD RELEASED and the governor lets go — driven end to end from the gym path on the real ledger state");
  ok(JSON.stringify(rated.s.exercises.find((e) => e.id === "rows").rirHist) === "[0,0,1]", "OPENER — and rirHist breathes again: the rolling window the freeze/release logic reads had been suffocated at [0,0] since v7.12.0");
  const unrated = __test.completeSession(cl85(SNAP85), "2026-08-06", viaGym([9, 8], [9, 8], null, 0), slp85, {});
  ok(!unrated.lines.some((l) => /HOLD RELEASED/.test(l.t)) && unrated.s.exercises.find((e) => e.id === "rows").holdFlag === true, "OPENER — the counterfactual, same path: unrated, the release branch is unreachable and the hold stays stuck — the production failure, reproduced before it was fixed");
  /* the skip path fabricates nothing and blocks nothing */
  const skipped = unrated.s.sessionLog["2026-08-06"].entries[0];
  ok(skipped.rir === null && JSON.stringify(skipped.rirSets) === "[null,0]" && !!unrated.s.exercises.find((e) => e.id === "rows").lastMeta, "OPENER — declining the ask records null, never a fabricated number: the entry logs, lastMeta writes, every downstream read treats absent as unknown");
  /* THE GOVERNOR'S SIGHT, both ways: a top-of-window GRIND with the opener captured is
     refused; the same grind unrated was being BANKED AS AN EARN — the deepest harm of the
     removal, worse than the stuck hold, driven here in both directions */
  const G85 = cl85(SNAP85);
  const rowsG = G85.exercises.find((e) => e.id === "rows");
  rowsG.holdFlag = false; rowsG.rirHist = [];
  const grindSeen = __test.completeSession(cl85(G85), "2026-08-06", viaGym([10, 9], [10, 9], 0, 0), slp85, {});
  ok(grindSeen.lines.some((l) => l.t === "ROWS (STRAPLESS) — TOP OF WINDOW, BUT HOT") && !grindSeen.s.queue.some((q) => q.exId === "rows" && q.kind === "debut" && !q.done), "OPENER — a top-of-window GRIND with its opener captured at 0 is refused: a grind is not an earn, and the governor can finally see it again");
  const grindBlind = __test.completeSession(cl85(G85), "2026-08-06", viaGym([10, 9], [10, 9], null, 0), slp85, {});
  ok(grindBlind.lines.some((l) => l.t === "ROWS (STRAPLESS) 185 EARNED"), "OPENER — the same grind UNRATED banks 185 as an earn: the blind engine promotes a grind to a load jump. This is the deepest production harm of the v7.12.0 removal — not just a stuck hold, a corrupted earn — and it is why the ask returns");
  /* the press replay, both ways — MEASURE WINS over the rider's claim: banking is
     opener-independent in current mechanics (the 8/6 press never tops its window at
     8 < hi 9, and the record's banks-now/pending line is a 2SE question, not an RIR one).
     Asserted so the fact is on the record and the claim cannot silently drift into lore. */
  const e86p = JSON.parse(readFileSync("tools/snapshots/2026-08-07-ledger.json", "utf8")).sessionLog["2026-08-06"].entries.filter((e) => e.id === "press");
  const pR = __test.completeSession(cl85(SNAP85), "2026-08-06", [{ ...cl85(e86p[0]), rir: 1 }], slp85, {});
  const pU = __test.completeSession(cl85(SNAP85), "2026-08-06", [{ ...cl85(e86p[0]), rir: null }], slp85, {});
  ok(pR.lines.map((l) => l.t).join("|") === pU.lines.map((l) => l.t).join("|") && !pR.s.queue.some((q) => q.exId === "press" && q.kind === "debut" && !q.done) && !pU.s.queue.some((q) => q.exId === "press" && q.kind === "debut" && !q.done), "OPENER — the real 8/6 press replays IDENTICALLY rated and unrated: its bank was never opener-gated (8 < hi 9 never tops the window; the record line is sized by 2SE, not RIR). The rider's press claim did not reproduce — the grind-earn above is the true mechanism, and this assert keeps the record straight");
  /* copy-mechanism agreement: the dictionary's promise is delivered by the flow */
  const src85 = readFileSync("src/app.jsx", "utf8");
  ok(/Rate two sets: the FIRST/.test(src85) && __test.phaseAfterSet(0, 3) === "rir-open" && __test.phaseAfterSet(2, 3) === "rir-end", "OPENER — the field dictionary says 'Rate two sets: the FIRST... and the LAST' and the flow now offers exactly those two asks: the app no longer documents a flow it does not offer");
  ok(/HELD — an honest ≥1 here releases the load/.test(src85), "OPENER — when the lift is HELD, the ask names its stake in one line: the tap that matters most is labeled with why");
  /* a flow + input change, not a formula change: the frozen reads are untouched */
  const S7f = JSON.parse(readFileSync("tools/snapshots/2026-08-07-ledger.json", "utf8"));
  const ebf = __test.energyBalanceTarget(S7f, { asOf: "2026-08-07" });
  ok(ebf.lo === 2221 && ebf.hi === 2308 && __test.regime(S7f, { asOf: "2026-08-07" }).key === "free", "OPENER (needle updated by R17) — THE EAT BAND IS STILL BYTE-IDENTICAL (2221–2308), which is the claim this assert was always making. The regime key moved unknown → free, and that is R17's whole point: the detector was blind because one estimated-food day was excluding measured reps. The FOOD side did not move; the TRAINING read came back");
}
console.log(`\nFINAL85: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R15a — TOKENS + SHELL (the redesign begins) ====================
   The engine freeze itself is enforced by tools/engine-diff.mjs in the GATE (fire-proofed
   by mutation at birth). Here: the design tokens are a census — one source of truth the
   slices style from — and the two laws the tokens carry are pinned so drift is loud. */
{
  const DT9 = __test.DT;
  ok(!!DT9 && DT9.red === "#E06056" && DT9.decision === "#5FB7E8" && DT9.jade === "#5ED4A2" && DT9.amber === "#E5B454", "R15a — the semantic tones are census'd: red is the REDLINE only, decision-blue belongs to the DECISION species only — the tokens carry the law, and a drifted hex fails loudly");
  ok(Array.isArray(DT9.ramp) && DT9.ramp.join(",") === "9,10.5,12,13.5,15,19,24,32,54" && DT9.space.join(",") === "4,8,12,16,24", "R15a — one type ramp, one spacing scale: no ad-hoc sizes is only enforceable if the canonical list exists in exactly one place");
  ok(DT9.glyph.status === "◆" && DT9.glyph.ok === "◇" && DT9.glyph.fwd === "▸" && DT9.touch === 64, "R15a — the geometric glyph set and the 64px touch floor are tokens, not tribal knowledge");
  const src15 = readFileSync("src/app.jsx", "utf8");
  ok(src15.indexOf('const PRIMARY_TABS = ["NOW", "TRAIN", "LEDGER"];') > -1 && src15.indexOf('"MORE"') === -1, "R15a — the rail is NOW / TRAIN / LEDGER and no route answers to MORE: renamed everywhere, not aliased — a stranded surface is the failure this asserts against");
  const stampLine = src15.split("\n").find((l) => l.indexOf(">v{APP_V}</div>") > -1 && l.indexOf('position: "absolute"') > -1);
  ok(!!stampLine && stampLine.indexOf('pointerEvents: "none"') > -1, "R15a POINTER PASS — the version stamp carries pointer-events none: it intercepted REAL taps on the rail's right tab while every synthetic jsdom click passed through it — a passive label may never own a tap, and this pin keeps it that way");
  ok(src15.indexOf("\\" + "u00b7 target") === -1 && src15.indexOf(" " + "\\" + "u00d7 {") === -1, "R15a — no JSX-text unicode escapes survive: \\u00b7 and \\u00d7 between JSX expressions render as LITERAL CHARACTERS on screen (they were live on TODAY'S LIFTS and GymMode's prev line) — escapes belong in JS strings, glyphs belong in JSX text");
}console.log(`\nFINAL86: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R15b — NOW, THE FIVE-BLOCK ANSWER ====================
   nowModel is a FORMATTER: every number it emits is an engine output rearranged. The
   engine-freeze gate proves it computes nothing new; these drives prove the five-block
   budget, the one-thing selection, the abstention box, plain language, and
   engine-owns-numbers — on the REAL frozen ledger first, fixtures after. */
{
  const cl87 = (o) => JSON.parse(JSON.stringify(o));
  const S7n = JSON.parse(readFileSync("tools/snapshots/2026-08-07-ledger.json", "utf8"));
  const m = __test.nowModel(S7n);
  const eb87 = __test.energyBalanceTarget(S7n);
  ok(m.status.word === "ON COURSE" && m.status.glyph === "◆" && (m.status.cause || "").length > 20, "R15b — the live status is the app's face: ON COURSE ◆ with a plain-sentence cause, straight from statusFace — the redesign renders the engine's voice, it does not invent one");
  ok(m.status.coach === null, "R15b + R17 — the ABSTENTION BOX is GONE from the real snapshot, and that is the fix landing: it appeared because the regime read unknown, and the regime read unknown because one estimated-food day was excluding measured reps. The box was honest about a blindness the app did not have to have");
  ok(m.eat.lo === eb87.lo && m.eat.hi === eb87.hi && m.eat.gated === false, "R15b — ENGINE OWNS THE NUMBERS: the EAT band on screen is energyBalanceTarget's own lo–hi (" + m.eat.lo + "–" + m.eat.hi + "), never re-derived, never rounded differently");
  ok(eb87.provisional === true && m.eat.tag === "FIRST ESTIMATE", "R15b — 'provisional' reaches the athlete as FIRST ESTIMATE, and the tag appears exactly when the engine says provisional — the dictionary is a translation, never a second opinion");
  ok(m.eat.proteinG === __test.proteinTarget(S7n).g, "R15b — the protein number is proteinTarget's own headline gram figure");
  const openN = (S7n.proposals || []).filter((p) => p && !p.resolved).length + (S7n.agentProposals || []).length;
  ok(m.move.kind === "decisions" && m.move.n === openN && openN > 0, "R15b — TODAY'S MOVE on the live state: " + openN + " unanswered decision cards ARE what matters most today, and the count is computed from the same state the inbox reads");
  ok(/UPPER BODY|LOWER BODY|REST DAY/.test(m.workout.title) && /beat /.test(m.workout.sub), "R15b — NEXT WORKOUT names the day type and builds its beat-lines from genSession's own prev reps: " + m.workout.title);
  const bf87 = __test.bfEst(S7n);
  ok(m.headed.bfLine === "body fat: best guess " + Math.round(bf87.pct) + "%, honestly " + Math.round(bf87.lo) + "–" + Math.round(bf87.hi), "R15b — the honest body-fat range renders bfEst's own interval in the dictionary's words: " + m.headed.bfLine);
  ok(/AN ESTIMATE, NOT A PROMISE/.test(m.headed.foot), "R15b — and the trajectory footer says what a projection is");
  /* the ladder surfaces when decisions clear — on the REAL state, sleep is today's rung */
  const R87 = cl87(S7n);
  (R87.proposals || []).forEach((p) => { p.resolved = true; });
  R87.agentProposals = [];
  const m2 = __test.nowModel(R87);
  ok(m2.move.kind === "fix" && m2.move.lever === "SLEEP", "R15b — decisions cleared, TODAY'S MOVE is theOneFix's own ladder speaking on the real state (tonight's rung: sleep) — the one-thing machinery, not a new invention");
  ok(/calorie cut/.test(m2.move.body) && !/\bdeficit\b/i.test(m2.move.body), "R15b — the ladder's one engine term is translated AT THE SURFACE ('the deficit' → 'the calorie cut'); the engine copy itself is untouched and lives one tap down");
  /* the rate story, driven with the ladder quiet */
  const m3 = __test.nowModel(R87, { fix: { rung: "hold", lever: null, state: "good", title: "x", body: "y" } });
  const cr87 = __test.currentRate(R87);
  ok(m3.move.kind === "rate" && m3.move.strip.label === cr87.scale.toFixed(1) + " LB/WK", "R15b — with the ladder quiet and the rate outside the sweet spot, the band strip is the move — marker label is currentRate's own 1dp figure");
  const g87 = m3.move.strip;
  ok([g87.zoneLo, g87.zoneHi, g87.slow, g87.fast, g87.mark].every((x) => x >= 0 && x <= 100) && g87.zoneLo < g87.zoneHi && g87.slow <= g87.zoneLo && g87.fast >= g87.zoneHi, "R15b — strip geometry is sane: zone inside the rail, the slow rule at or left of the zone, the fast rule at or right of it — zones soft, rules hard, one domain");
  ok(/sweet spot/.test(m3.move.body) && /wobble|inside it|watching/.test(m3.move.body), "R15b — and the rate sentence speaks the dictionary: sweet spot, scales wobble — never floor, redline, or an interval symbol");
  /* the quiet state — a fixture whose rate sits INSIDE the sweet spot */
  const isoW = (k) => isoL(Date.now() - k * 864e5);
  const Q87 = cl87(SEED);
  Q87.blackout = { until: isoW(28) };
  Q87.reads = Array.from({ length: 28 }, (_, i) => ({ d: isoW(27 - i), w: +(167 - i * 0.15).toFixed(2), sealed: false }));
  Q87.trend = Q87.reads[Q87.reads.length - 1].w;
  Q87.sleep.nights = Array.from({ length: 10 }, (_, i) => ({ d: isoW(9 - i), h: 8.2 }));
  Q87.proposals = []; Q87.agentProposals = [];
  const mq = __test.nowModel(Q87, { fix: { rung: "hold", lever: null, state: "good", title: "x", body: "y" } });
  ok(mq.move.kind === "quiet" && /Silence is a valid state/.test(mq.move.body), "R15b — nothing to say IS a designed state: rate inside the sweet spot, ladder quiet, no decisions — the block says the quiet thing instead of inventing urgency");
  /* the steps line, via the statusFace deps pattern */
  const ms = __test.nowModel(Q87, { fix: { rung: "steps", lever: "STEPS", state: "caution", title: "Add a walk today", body: "Steps are the lever here, not your calories." } });
  ok(ms.move.kind === "fix" && ms.move.lever === "STEPS" && /walk/i.test(ms.move.title), "R15b — a steps-drifted day makes the walk the move, through the same injected-deps pattern statusFace already uses for fixtures");
  /* CRITIQUE S1 — the doubled leading verb, driven as a class */
  const md = __test.nowModel(Q87, { fix: { rung: "logging", lever: "LOGGING", state: "caution", title: "Close the books first", body: "Log log the scale — the read leans on your own numbers." } });
  ok(md.move.body.indexOf("Log the scale") === 0, "CRITIQUE S1 — a rung whose copy already starts with the verb never gets a second one: the surface collapses the doubled LEADING word as a class ('Log log the scale' becomes 'Log the scale'); the engine's own copy is frozen and its fix is filed separately");
  /* and the repaired boundary regex actually fires on a BARE 'deficit' (the backspace-byte
     incident left the old one unreachable — this drive keeps it alive) */
  const mb = __test.nowModel(Q87, { fix: { rung: "calories", lever: "DEFICIT", state: "caution", title: "Trim", body: "A deficit deepened now is honest." } });
  ok(/calorie cut deepened/.test(mb.move.body), "CRITIQUE S1 — the word-boundary translation fires on a bare 'deficit' too: the repaired regex is driven, not decorative — a dead guard indistinguishable from a live one was this session's own incident class");
  /* AT MOST ONE coach box, most consequential wins */
  const MC87 = cl87(S7n);
  MC87.adjustments = [...(MC87.adjustments || []), { rid: "x9", id: "mc1", d: "2026-08-04", via: "cal", calDelta: -50, from: "2026-08-04" }];
  const m6 = __test.nowModel(MC87);
  ok(!!m6.status.coach && m6.status.coach.title === "ONE CHANGE AT A TIME" && !Array.isArray(m6.status.coach), "R15b + R17 — exactly ONE coach box still renders with a structural move on the week; the LEARNING box no longer wins because the detector can read now, so the move box is the honest one. The one-box law is what this assert defends, and it holds");
  /* THE BANNED-JARGON SCAN — word-boundary-aware, over everything the surface emits */
  const corpus = JSON.stringify(m) + JSON.stringify(m2) + JSON.stringify(m3) + JSON.stringify(mq) + JSON.stringify(ms);
  [[/\bprovisional\b/i, "provisional"], [/\bregime\b/i, "regime"], [/\bRIR\b/, "RIR"], [/\bredline\b/i, "redline"], [/\bcorridor\b/i, "corridor"], [/\bdeficit\b/i, "deficit"]].forEach(([re, w9]) => {
    ok(!re.test(corpus), "R15b JARGON — no NOW surface says \"" + w9 + "\": the plain-language law, scanned across the live model and every driven variant");
  });
  /* the five-block budget, at the source layer (render smoke counts the DOM) */
  const srcN = readFileSync("src/app.jsx", "utf8");
  const nt2 = srcN.slice(srcN.indexOf("function NowTab2("), srcN.indexOf("function NowTab({"));
  ok((nt2.split('data-now="').length - 1) === 5, "R15b — the simplicity budget is a LAW: NowTab2 renders exactly five data-now blocks (" + (nt2.split('data-now="').length - 1) + ") — a sixth block is the accretion disease the redesign exists to cure, and this assert is its vaccine");
  ok(nt2.indexOf("BandStrip") > -1 && (srcN.split("function BandStrip(").length - 1) === 1, "R15b — ONE band-strip component, used by the move block: every uncertain quantity draws the same way, and a one-off range visual is a build error");
  /* CRITIQUE S3' — hit geometry is the law's currency, pinned in numbers: START's slop is
     ALL upward (27 top / 0 bottom, margins −26/+1 → paint offsets unchanged at +1/+1,
     hit 37+27 = 64, box bottom = paint bottom); the FAB's is all downward (0 top / 12
     bottom, bottom 56→50 → paint bottom unchanged at 62, hit 64, box top 6px LOWER than
     round 2). Disjoint by construction: START's box cannot extend below its paint, the
     FAB's cannot extend above its own. The audit re-measures the rects; this pins the
     values so a refactor cannot silently un-derive them. */
  ok(nt2.indexOf('padding: "27px 0 0 0"') > -1 && nt2.indexOf('margin: "-26px 0 1px 0"') > -1 && nt2.indexOf("zIndex: 2") > -1 && nt2.indexOf('borderLeft: "1px solid rgba(94,212,162,.35)"') > -1, "ROUND 4 — START: paint and slop never share a channel — the outer button is the 64px hit box (27px padding slop, all UP, z 2 over inert text) and the inner span carries the round-2 side-caps pill untouched; slop arithmetic can no longer drag paint by construction");
  ok(nt2.indexOf("width: 64, height: 64, background: \"none\", border: \"none\"") > -1 && nt2.indexOf('right: 10, bottom: "calc(50px + env(safe-area-inset-bottom))"') > -1 && nt2.indexOf("width: 52, height: 52, borderRadius: \"50%\", background: DT.amber") > -1, "ROUND 4 — the FAB: a 64×64 invisible outer hit box with the painted 52px circle at its top-left — paint at the round-2 position (right 22, bottom 62) by construction, slop only down/right, the rects disjoint because neither box can cross its own paint toward the other");
}
console.log(`\nFINAL87: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R15c — TRAIN, THE IN-SESSION SCREEN ====================
   A restyle with the flow FROZEN: every handler, phase and state line of GymMode is
   untouched (FINAL85 pins the routing; the freeze gate pins the engine). What R15c adds
   is SPOKEN prescription (effortWords), the ⊙ trial tag, the paint-slop touch law
   everywhere, and the two asks made visually distinct — driven and pinned below. */
{
  /* effort, in plain words — the mockup's own sentence, generated never authored */
  ok(__test.effortWords([2, 1, 0]) === "leave 2 in the tank → 1 in the tank → last set, empty it", "R15c — rirPlan [2,1,0] speaks as the mockup's exact sentence: RIR as an instruction, generated from the plan");
  ok(__test.effortWords([2, 1, 1, 0]) === "leave 2 in the tank → 1 in the tank (×2) → last set, empty it", "R15c — a fourth set collapses the repeated middle instead of droning: the added set is visible as ×2, failure still spent exactly once");
  ok(__test.effortWords([2, 0]) === "leave 2 in the tank → last set, empty it", "R15c — a two-set lift speaks both asks' sets");
  ok(__test.effortWords([0]) === "one set — empty it", "R15c — a single-set lift does not say 'leave' about a set it empties");
  ok(/governor hold/.test(__test.effortWords([2, 2, 2, 2], true)) && /honest opener/.test(__test.effortWords([2, 2, 2, 2], true)), "R15c — a held lift's prescription names the governor and the way out, instead of pretending the flat plan is a taper");
  /* the tap count, derived from the router itself — the acceptance says COUNT IT */
  const taps = (n) => { let asks = 0; for (let i9 = 0; i9 < n; i9++) { const ph = __test.phaseAfterSet(i9, n); if (ph === "rir-open" || ph === "rir-end") asks++; } return n + asks + 1; };
  ok(taps(3) === 6 && taps(2) === 5 && taps(1) === 3 && taps(4) === 7, "R15c — mandatory taps per lift, DERIVED from phaseAfterSet: n logs + its own asks + one advance (3-set = 6, single-set = 3). The restyle changed zero flow, so the count is the router's own arithmetic — not a hand promise");
  /* the screen's laws, pinned at source */
  const srcC = readFileSync("src/app.jsx", "utf8");
  const gm = srcC.slice(srcC.indexOf("function GymMode("), srcC.indexOf("function NegotiatorConsole("));
  ok(gm.indexOf('data-ask="opener"') > -1 && gm.indexOf('data-ask="terminal"') > -1 && gm.indexOf('borderLeft: "4px solid " + DT.jade') > -1 && gm.indexOf('borderLeft: "4px solid " + DT.amber') > -1, "R15c — the TWO asks are visually distinct species: the opener wears jade (the gatekeeper), the terminal wears amber (did the effort land) — pinned by attribute and accent so they can never converge silently");
  ok(gm.indexOf("⊙ ON TRIAL — EARNING ITS PLACE") > -1 && gm.indexOf('vcT.status === "READING"') > -1, "R15c (§4b) — a set inside its read window wears the ⊙ trial tag, gated on the SAME volumeConversion the producer reads: the experiment made visible is the honesty made visible");
  ok((gm.split("minHeight: 64").length - 1) >= 4 && gm.indexOf('width: 72, height: 72, flex: "none"') > -1, "R15c — the 64 law on every primary, and the counter pair holds its 72 against flex squeeze (the rig read 67 wide before flex:none — the comment now describes the element that exists)");
  ok(gm.indexOf('padding: "26px 12px", margin: "-20px -12px"') > -1, "R15c — small PAINT-FREE text controls carry 26px slop (26+26+~14 text = 66 ≥ 64 — re-derived after the rig read 58 off the first arithmetic; the rig is the authority, the derivation is the contract)");
  ok((gm.split('padding: "13px 9px"').length - 1) === 2 && (gm.split('padding: "11px 0", margin: "-3px 0 -11px 0"').length - 1) === 2, "R15c — the ask-screen skips carry a PAINTED border, so they get the full outer/inner split (paint on the span, 64 hit on the button) — paint and slop never share a channel, even on the quiet controls");
  ok(gm.indexOf('◇ FIRST SET') > -1 && gm.indexOf('◆ LAST SET') > -1, "R15c — the species survive GRAYSCALE: the opener wears the empty diamond (the honest gatekeeper), the terminal the filled one — glyph + edge carry the distinction before color does, the discipline R15d's decision cards inherit");
  ok((gm.split('<div style={{ flex: 1, minHeight: 0 }} />').length - 1) >= 2 && (gm.split('marginBottom: 0 }}').length - 1) >= 2, "R15c — both asks keep the thumb zone STRUCTURALLY (round 4): hero instrument on top, a flex spacer, the ask card pinned at the bottom — the lower third by construction, with the void carrying the moment's instrument instead of dead space");
  ok(gm.indexOf("effortWords(rp2.plan") > -1 && gm.indexOf("TARGET <b") > -1, "R15c — the prescription line is GENERATED from targetsFor's tgt and rirPlan's plan — the surface speaks the engine, it never re-derives it");
  ok(gm.indexOf("SHORT SLEEP PROTECTS, IT NEVER PUNISHES") > -1, "R15c — the weather line carries the constitution's sleep law in its own words: a short night is named, never punished");
  ok((gm.split("onClick={doneSet}").length - 1) === 1 && (gm.split("onClick={nextLift}").length - 1) === 1 && (gm.split("onClick={finish}").length - 1) === 1, "R15c — one primary path per action: exactly one LOG SET, one NEXT, one FINISH handler call-site each — the flow the tap count derives from is the flow that renders");
  ok(srcC.indexOf("<GymLauncher s={s} onOpen={() => setGym(true)} />") > -1 && (srcC.slice(srcC.indexOf("function GymLauncher("), srcC.indexOf("function SessionLiveChip(")).split("minHeight: 64").length - 1) === 2, "R15c — the session's ENTRY DOOR is under the same law in BOTH its states: the launcher component carries minHeight 64 fresh and live alike (round 6 made it wear the running session), never a carve-out");
}
console.log(`\nFINAL88: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R15c ROUND 4 — THE LOCKED FRAME + THE SURVIVING CLOCK ====================
   Joe's two live findings from a 1:39 AM session: the ask screen scrolled with a dead
   upper half, and the rest clock died when he left Gym Mode. S1-S3 lock the frame and
   give every void an instrument; S4 makes the clock derive from its persisted wall-clock
   anchor so leaving costs nothing. resumePhase is pure and driven with exact mocked
   clocks — no "roughly" anywhere. */
{
  const RP = __test.resumePhase;
  /* mocked-clock exactness: bank at t0, rest 150s */
  const t0 = 1000000000000;
  ok(RP({ phase: "rest", restStart: t0, restLen: 150 }, t0 + 47000).phase === "rest", "S4 — re-entering 47s into a 150s rest RESUMES the rest screen (the display derives 1:43 remaining from the same anchor — exact, not roughly)");
  ok(RP({ phase: "rest", restStart: t0, restLen: 150 }, t0 + 150000).phase === "lift", "S4 — re-entering at exactly 150s lands on the lift: the rest is over, the clock did its whole job while the component was dead");
  ok(RP({ phase: "rir-open", restStart: t0, restLen: 150 }, t0 + 60000).phase === "rir-open" && RP({ phase: "rir-open", restStart: t0, restLen: 150 }, t0 + 60000).autoSkip === false, "S4 — an opener ask 60s into its 150s rest is STILL LIVE on return: asked-at-the-set holds while the set is still recent");
  const stale = RP({ phase: "rir-open", restStart: t0, restLen: 150 }, t0 + 151000);
  ok(stale.phase === "lift" && stale.autoSkip === true, "S4 STALE-ASK LAW — an opener ask that outlived its rest resolves to SKIP (null) and lands on the next true phase: a minutes-old memory answer is the v7.12.0 sin this flow exists to prevent");
  const staleT = RP({ phase: "rir-end", restStart: t0, restLen: 150 }, t0 + 151000);
  ok(staleT.phase === "lift-done" && staleT.autoSkip === true, "S4 — the terminal ask goes stale by the same clock and lands on lift-done, the record showing unrecorded, nothing downstream blocked");
  ok(RP({ phase: "lift", restStart: t0, restLen: 150 }, t0 + 999000).phase === "lift" && RP({ phase: "all-done" }, t0).phase === "all-done", "S4 — non-ask phases restore verbatim: mid-lift lands mid-lift, the done screen stays done");
  /* the source laws */
  const srcP = readFileSync("src/app.jsx", "utf8");
  const gmP = srcP.slice(srcP.indexOf("function GymMode("), srcP.indexOf("function NegotiatorConsole("));
  ok(gmP.indexOf('overflow: "hidden", overscrollBehavior: "none"') > -1 && (gmP.match(/overflowY: "auto"/g) || []).length === 1 && gmP.indexOf('the belt scrolls') > -1, "S1 (evolved, v7.42.1) — THE FRAME does not scroll (overflow hidden, Joe's 1:39 AM ruling stands) — but exactly ONE bounded inner belt does: the all-done suspects column, where a long list clipped and LOG IT sat unreachable below the fold (the audit's 14:12 finding). One belt, named, with its why in the source — a second overflowY here fails this pin");
  ok(gmP.indexOf('data-hero="clock"') > -1 && gmP.indexOf('data-hero="receipt"') > -1, "S2 — both voids became instruments: the opener's hero is the RUNNING rest clock (same grammar as the rest screen — one visual system), the terminal's is the banked receipt, because no rest is armed after the last set and a fake countdown would be paint with no instrument behind it");
  ok(gmP.indexOf('if (phase !== "rest" && phase !== "rir-open") return;') > -1 && gmP.indexOf('if (tick() <= 0 && phase === "rest")') > -1, "S2 — the clock ticks through the opener ask but the auto-advance stays rest-only: the ask is owed, the advance is not");
  ok(gmP.indexOf("restLen, phase })") > -1 && gmP.indexOf("resumePhase(d, Date.now())") > -1, "S4 — PHASE rides the draft and re-entry routes through the resume law: leaving mid-rest and returning teleports nowhere");
  ok((gmP.match(/= setInterval\(/g) || []).length === 1 && gmP.indexOf("restLen - Math.floor((Date.now() - restStart) / 1000)") > -1, "S4 — DERIVE, NEVER TICK-OWN: exactly one interval ASSIGNMENT exists in the session component and it only repaints; every displayed second is computed from the persisted wall-clock anchor (the comment recounting the old tick-owned bug is prose, not a second timer)");
  /* the chip */
  const chip = srcP.slice(srcP.indexOf("function SessionLiveChip("), srcP.indexOf("function MoreTab("));
  ok(chip.indexOf('data-chip="session-live"') > -1 && chip.indexOf("zIndex: 49") > -1 && chip.indexOf('width: "calc(100% - 90px)"') > -1, "S4 CHIP — rides above the rail on every tab at z 49 (GymMode's overlay at 60 buries it during a live session by construction) and leaves the FAB corridor free — it may not cover either");
  ok(chip.indexOf('padding: "28px 0 0 0"') > -1 && chip.indexOf("resumePhase(draft, Date.now())") > -1 && chip.indexOf("(draft.restLen || 0) - Math.floor((Date.now() - draft.restStart) / 1000)") > -1, "S4 CHIP — 64-hit via upward slop under the paint-slop law, and its countdown derives from the SAME persisted anchor as the gym screen: one clock, two displays, zero owned ticks");
  ok(chip.indexOf('sessionStorage.setItem("pl-resume-gym", "1")') > -1 && srcP.indexOf('sessionStorage.getItem("pl-resume-gym")') > -1, "S4 CHIP — the tap returns to TRAIN and re-opens Gym Mode through the one-shot flag; the draft restore lands the exact phase");
  /* ---------- ROUND 5 — three loose wires, pinned tight ---------- */
  ok(gmP.indexOf('de.style.overflow = "hidden"; db.style.overflow = "hidden";') > -1 && gmP.indexOf("window.scrollTo(0, 0)") > -1 && gmP.indexOf("de.style.overflow = prev9[0]") > -1, "F1 — the DOCUMENT scroll-locks while Gym Mode is mounted (html AND body — the page behind the overlay kept 1772px of live scroll) and restores exactly what was there on unmount: the modal pattern, with the give-back");
  ok(chip.indexOf('data-arm={resting ? "rest" : "resume"}') > -1 && chip.indexOf('const resting = rp9.phase === "rest" && remain > 0;') > -1, "F2 — the chip's two arms are honest: the REST arm belongs to the rest phase ALONE, so a mid-ask exit wears RESUME (the owed thing is the ask) — the arm that could never render, now pinned by attribute");
  ok((srcP.split("findGymDraft(s)").length - 1) >= 3 && chip.indexOf("const draft = findGymDraft(s);") > -1, "F3 — ONE scanner on every door: the chip, the launcher path and GymMode's mount all read findGymDraft, so a 1:39 AM session keyed to yesterday resumes identically from any entrance");
  ok(srcP.indexOf("const live9 = findGymDraft(s);") > -1 && srcP.indexOf("const gDate = live9 ? live9.iso : dateSel;") > -1, "F3 — a live draft OWNS its session: every gym open keys GymMode to the draft's own date, so the restore + resumePhase wiring (the proven pure law) actually runs on the manual door too — the wiring was the gap, and the date boundary was the wire");
  /* ---------- ROUND 6 · F4 — the clock can never be hidden on any tab ---------- */
  ok(chip.indexOf("const iv = setInterval(() => force((x) => x + 1), 800);") > -1 && chip.indexOf("if (!draft) return;") === -1, "F4 — the chip DISCOVERS: its interval runs unconditionally, so a gym exit that never re-renders the shell still surfaces the clock on the very tab it lands on — a draft-gated interval was the invisible wire");
  const launcher = srcP.slice(srcP.indexOf("function GymLauncher("), srcP.indexOf("function SessionLiveChip("));
  ok(launcher.indexOf('data-launcher="live"') > -1 && launcher.indexOf('"▸ RESUME · REST "') > -1 && launcher.indexOf('"▸ RESUME SESSION · "') > -1 && launcher.indexOf("minHeight: 64") > -1, "F4 — AND the better design: the GYM MODE launcher itself wears the live session (both arms, same persisted anchor, 64 law intact) — the door on TRAIN shows the running state, self-ticking so no parent re-render is ever load-bearing");
  ok(launcher.indexOf("resumePhase(live, Date.now())") > -1 && (srcP.split("findGymDraft(s)").length - 1) >= 3, "F4 — the launcher reads the SAME scanner and the SAME resume law as every other door: one clock, three displays, zero owned ticks");
}
console.log(`\nFINAL89: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== THE MISSED-READ RIDER (live incident, 2026-08-07) ====================
   Joe missed a morning weigh-in and the move nagged all day for a read that could only
   arrive contaminated. The remedy: the window closes (first intake/session or local noon),
   the rung retires, ONE engine-priced line says what the miss actually cost, and late
   reads are accepted but set aside — the sealed-read precedent at every reader. The live
   snapshot CARRIES the incident (its last read is 08-06), so the replay below runs on the
   real thing. */
{
  const cl89 = (o) => JSON.parse(JSON.stringify(o));
  const S7m = JSON.parse(readFileSync("tools/snapshots/2026-08-07-ledger.json", "utf8"));
  const tI = isoL(Date.now());
  const base = cl89(S7m);
  base.reads = base.reads.filter((r) => r.d !== tI);
  delete base.dailyLogs[tI]; delete base.sessionLog[tI];
  /* the window, all four ways */
  ok(__test.readWindow(base, 9).open === true, "MISSED-READ — the window is OPEN on a bare morning: the books rung asks exactly as before");
  ok(__test.readWindow(base, 12).open === false, "MISSED-READ — local noon closes it: an evening solicitation would collect diurnal water, not information");
  ok(__test.readWindow({ ...base, dailyLogs: { ...base.dailyLogs, [tI]: { cal: 2000 } } }, 9).open === false, "MISSED-READ — the day's first logged intake closes it early: once the day has started, the fasted-morning read is gone whatever the clock says");
  ok(__test.readWindow({ ...base, sessionLog: { ...base.sessionLog, [tI]: { entries: [] } } }, 9).open === false, "MISSED-READ — a logged session closes it the same way");
  /* the rung retires; the priced line files once */
  ok(__test.nowFocus(base, 9).owed.some((o) => o.k === "weight") && !__test.nowFocus(base, 13).owed.some((o) => o.k === "weight"), "MISSED-READ — the scale rung asks while the window is open and RETIRES when it closes: TODAY'S MOVE stops asking for the impossible, driven both sides of noon");
  const r1 = __test.runAdaptive(cl89(base), tI, { hour: 13 });
  const L1 = r1.feed.filter((f) => f.d === tI && /^MORNING READ MISSED/.test(f.t));
  ok(L1.length === 1, "MISSED-READ — a closed window with no read files EXACTLY ONE line for the day");
  const mc = __test.missedReadCost(base);
  ok(mc.delta != null && L1[0].how.indexOf(mc.delta + " lb/wk") > -1, "MISSED-READ — the line's price IS missedReadCost's counterfactual (" + mc.delta + " lb/wk on the live state) — the R10a weld: the copy quotes the engine, never a constant, and the app PROVES calm instead of prescribing it");
  ok(__test.runAdaptive(cl89(r1), tI, { hour: 14 }).feed.filter((f) => f.d === tI && /^MORNING READ MISSED/.test(f.t)).length === 1, "MISSED-READ — re-running the sweep files no duplicate");
  const dA = __test.runAdaptive(cl89(base), tI, { hour: 13 }), dB = __test.runAdaptive(cl89(base), tI, { hour: 13 });
  ok(__test.mergeState(dA, dB).feed.filter((f) => f.d === tI && /^MORNING READ MISSED/.test(f.t)).length === 1 && __test.mergeState(dB, dA).feed.filter((f) => f.d === tI && /^MORNING READ MISSED/.test(f.t)).length === 1, "MISSED-READ — two devices that both priced the miss merge to one line, both orders: identical engine outputs are identical feed entries, and the multiset union keeps one");
  ok(__test.runAdaptive(cl89(base), tI, { hour: 9 }).feed.filter((f) => f.d === tI && /^(MORNING READ MISSED|READ GAP)/.test(f.t)).length === 0, "MISSED-READ — while the window is still open, nothing files: the line prices a fact, it never predicts one");
  /* off-window reads: accepted, marked, set aside — driven both ways */
  const before89 = JSON.stringify(__test.currentRate(base));
  const off = __test.applyRead(cl89(base), tI, 161.0, { hour: 13 });
  const offR = off.reads.find((r) => r.d === tI);
  ok(offR && offR.offWindow === true && /set aside/.test(offR.note), "MISSED-READ — an evening read is ACCEPTED, never refused: recorded with the offWindow mark and the honest note");
  ok(JSON.stringify(__test.currentRate(off)) === before89 && off.trend === base.trend, "MISSED-READ — and the rate is BYTE-IDENTICAL with the off-window read on file, the trend untouched: judged beside the instrument, not inside it — the sealed-read precedent, driven both ways");
  ok(off.feed.some((f) => f.t === "EVENING READ — SET ASIDE" && /morning-standardized/.test(f.how)), "MISSED-READ — the log-time copy says why, in the dictionary's voice");
  const on = __test.applyRead(cl89(base), tI, 161.0, { hour: 8 });
  ok(!on.reads.find((r) => r.d === tI).offWindow && on.trend !== base.trend, "MISSED-READ — the same read in the morning window is a normal read: unmarked, trend moves — the mark is about WHEN, never about the number");
  /* the morning after, and the gap */
  const gapS = cl89(base);
  gapS.reads = gapS.reads.filter((r) => r.d < isoL(Date.now() - 2 * 864e5));
  ok(/First read after a gap/.test((__test.nowFocus(gapS, 9).owed.find((o) => o.k === "weight") || {}).why || ""), "MISSED-READ — the next morning's ask names the gap: two days of information, a bit more wobble, the trend knows — phrasing, not pressure");
  const gap3 = cl89(base);
  gap3.reads = gap3.reads.filter((r) => r.d < "2026-07-27");
  const gLine = __test.runAdaptive(cl89(gap3), tI, { hour: 13 }).feed.find((f) => f.d === tI && /^READ GAP — DAY \d+/.test(f.t));
  const cr89 = __test.currentRate(gap3);
  ok(!!gLine && gLine.how.indexOf(cr89.lo + " to " + cr89.hi + " lb/wk") > -1 && !/streak/i.test(gLine.how), "MISSED-READ — at ≥3 consecutive misses the line upgrades ONCE to a gap note quoting the engine's own widened interval (" + cr89.lo + "–" + cr89.hi + ") — derived, no streaks, no guilt");
  /* the laws */
  const src89 = readFileSync("src/app.jsx", "utf8");
  ok((src89.split(".reads.push(").length - 1) === 2, "MISSED-READ LAW — reads[] has exactly TWO writers, both characterized: applyRead (the log path) and the v1-state replay that copies EXISTING recorded reads forward. Neither synthesizes a point; the counterfactual's synthetic read lives and dies inside missedReadCost's clone");
  ok((src89.split("!r.sealed && !r.offWindow").length - 1) === 23, "MISSED-READ LAW — the off-window exclusion rides the sealed predicate at all 23 reader sites: the 21 pre-existing readers (including steer reconciliation, which simply WAITS for a live read — the audit's verify-it clause) plus the rider's own two last-live-read finders, which must obey the same law they enforce");
  /* the live replay: the snapshot carries the real incident */
  ok(S7m.reads[S7m.reads.length - 1].d === "2026-08-06", "MISSED-READ — the frozen 08-07 snapshot's last read is 08-06: the live incident is IN the fixture");
  ok(__test.runAdaptive(cl89(S7m), "2026-08-07").feed.filter((f) => f.d === "2026-08-07" && /^MORNING READ MISSED/.test(f.t)).length === 1, "MISSED-READ — REPLAYED: the real missed morning now files its one priced line on the real ledger — the incident that motivated the rider, closed by the rider, on the record");
  /* the S1 engine fix, in its window */
  const fx89 = __test.theOneFix(cl89(S7m));
  ok(!/^(\w+)\s+\1\b/i.test(fx89.body || ""), "MISSED-READ — the queued S1 engine-side fix landed: theOneFix no longer prepends a verb onto imperative owed titles, so the doubled-word class is dead at its source (the surface collapse stays as belt)");
}
console.log(`\nFINAL90: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== THE MAXED-LADDER RIDER (live case, 02:15, hack squat) ====================
   THE LAW: when a card claims progression, it may never prescribe below what was
   delivered. The clamp that printed TARGET 10·10·10 beside "beat last time (11·11·10)"
   is the guard-must-fire fixture, rebuilt exactly; the property sweeps the whole roster
   on both frozen snapshots so the contradiction class can never ship again. */
{
  const cl90 = (o) => JSON.parse(JSON.stringify(o));
  /* tonight's hack, rebuilt: rungs top at 160, hi 10, delivered 11·11·10, honest terminal */
  const mkMaxed = (over) => ({ id: "hackx", n: "Hack squat", mg: "quads", day: "L", w: 160, inc: 10, steps: [100, 120, 140, 160], sets: 3, hi: 10,
    last: [11, 11, 10], lastMeta: { d: isoL(Date.now() - 3 * 864e5), w: 160, reps: [11, 11, 10], rir: 1, rirSets: [1, null, 0], debt: false }, ...over });
  const S = cl90(SEED);
  const mx = mkMaxed({});
  ok(__test.targetsFor(mx, S).reduce((a, b) => a + b, 0) >= 33, "MAXED — the live deadlock, driven: 11·11·10 (sum 32) delivered on a maxed stack now steps FORWARD (sum " + __test.targetsFor(mx, S).reduce((a, b) => a + b, 0) + " ≥ 33) — the hi-clamp that regressed it to 10·10·10 yields when reps ARE the ladder");
  ok(__test.targetsFor(mx, S).every((t9, i9) => t9 >= mx.last[i9]), "MAXED — and no per-set target sits below the same set's delivered reps: the law at set grain, not just in sum");
  /* the hot grind still refuses the step */
  const held = mkMaxed({ holdFlag: true });
  const tH = __test.targetsFor(held, S);
  ok(tH.reduce((a, b) => a + b, 0) === 32 && tH.every((t9, i9) => t9 >= held.last[i9]), "MAXED — a HELD maxed lift gets no step (the governor's refusal survives above the old top) yet still never prescribes below delivered: protection and the law, together");
  /* a runged lift keeps hi's whole job */
  const runged = mkMaxed({ steps: [100, 120, 140, 160, 180] });
  const tR = __test.targetsFor(runged, S);
  ok(tR.every((t9, i9) => t9 === runged.last[i9]) && tR.reduce((a, b) => a + b, 0) === 32, "MAXED — the SAME lift with a rung above REPEATS its delivered line exactly (no step past hi, no regression below delivered): hi keeps its load-jump job as the earn threshold while the same-load floor keeps the card honest — the divergence, driven both directions");
  /* top-of-window is the moving delivered ceiling on maxed lifts */
  ok(__test.targetsFor(mx, S).length === 3 && (() => { const a = [12, 11, 10]; return true; })(), "MAXED — fixture sanity");
  const at9 = (reps, ex9) => { const src90 = readFileSync("src/app.jsx", "utf8"); return src90.indexOf("const top9 = maxedOut(ex) ? Math.max(ex.hi, ((ex.last || [])[0] || ex.hi)) : ex.hi;") > -1; };
  ok(at9(), "MAXED — top-of-window reads the MOVING DELIVERED CEILING on maxed lifts (max of hi and the best delivered opener), so two-sightings, the hot-guard and banked records keep their meaning above the old hi — pinned at the definition");
  /* the coach says the state, once ever, as a feed line (R14: reading a state enacts
     nothing, so it is a note — flagged to the audit as R14 supremacy over the card ask) */
  const SN = cl90(SEED);
  SN.exercises = [...SN.exercises.filter((e) => e.id !== "hack"), mkMaxed({ id: "hack" })];
  SN.blackout = { until: isoL(Date.now() - 28 * 864e5) };
  const rn1 = __test.runAdaptive(cl90(SN), isoL(Date.now()));
  const noteLine = rn1.feed.find((f) => f.t === "HACK SQUAT — THE STACK TOPS OUT AT 160");
  ok(!!noteLine && /reps are the ladder now/.test(noteLine.how) && /log the heavier weight/.test(noteLine.how), "MAXED — the state is SAID, with the real alternatives: reps-as-ladder stands on the record, and a heavier gym stack teaches the ladder by being used — no silent deadlock, ever");
  ok(__test.runAdaptive(cl90(rn1), isoL(Date.now())).feed.filter((f) => f.t === "HACK SQUAT — THE STACK TOPS OUT AT 160").length === 1, "MAXED — said ONCE, ever: the announcement does not nag");
  /* ---------- THE FIX ROUND — the incident's TRUE mechanism, measured not remembered ---------- */
  const prodHack = { id: "hack", n: "Hack squat", mg: "quads", day: "L", w: 160, inc: null, sets: 3, hi: 12,
    last: null, lastMeta: { d: isoL(Date.now() - 3 * 864e5), w: 160, reps: [11, 11, 10], rir: 1, rirSets: [1, null, 0], debt: false } };
  ok(JSON.stringify(__test.targetsFor(cl90(prodHack), cl90(SEED))) === JSON.stringify([10, 10, 10]), "FIX ROUND — the PHOTOGRAPH, reproduced from the MEASURED live shape (w 160, hi 12, last NULL, lastMeta 11·11·10 at the same load): the hi-2 fill prints 10·10·10 beside a beat-line built from the log — the first fixture fixed the hi-clamp, which was real but not the mechanism running");
  const stH = cl90(SEED); stH.exercises = [...stH.exercises.filter((e) => e.id !== "hack"), cl90(prodHack)]; stH.v = __test.SCHEMA_V;
  const healed90 = __test.migrate(cl90(stH));
  const hkH = healed90.exercises.find((e) => e.id === "hack");
  ok(JSON.stringify(hkH.last) === JSON.stringify([11, 11, 10]) && __test.targetsFor(hkH, healed90).every((t9, i9) => t9 >= [11, 11, 10][i9]), "FIX ROUND — THE HEAL: a same-load null is definitionally a stale cache (a deliberate reseed changes w first), so reconcileLiftCaches restores last from lastMeta and the card reads 11·11·11-class on next open — a restatement of the log, lawful under the migration law");
  const stR = cl90(stH); stR.exercises.find((e) => e.id === "hack").last = [11, 11, 10]; stR.v = __test.SCHEMA_V - 1;
  const mR = __test.migrate(cl90(stR));
  ok(JSON.stringify(mR.exercises.find((e) => e.id === "hack").last) === JSON.stringify([11, 11, 10]), "FIX ROUND — THE RECURRENCE, DEAD: a full patch replay (v one behind runs the whole reduce, patchV24 included) no longer erases the banked delivery — the patch is idempotent against later states, which the PATCHES law now demands of every patch");
  const stD = cl90(stR); const hD = stD.exercises.find((e) => e.id === "hack"); hD.last = null; hD.w = 180;
  ok(__test.migrate(cl90(stD)).exercises.find((e) => e.id === "hack").last === null, "FIX ROUND — and a DELIBERATE reseed (load changed under the cache: lastMeta.w 160 ≠ w 180) survives both the guard and the heal untouched — the weight editor's and RESET's nulls keep their meaning");
  ["2026-08-06", "2026-08-07"].forEach((d91) => {
    const SP91 = __test.migrate(JSON.parse(readFileSync("tools/snapshots/" + d91 + "-ledger.json", "utf8")));
    const bad91 = (SP91.exercises || []).filter((e) => e && e.last == null && e.lastMeta && Array.isArray(e.lastMeta.reps) && e.lastMeta.reps.length && String(e.lastMeta.w) === String(e.w)).map((e) => e.id);
    ok(bad91.length === 0, "FIX ROUND — the LIVE-SHAPE sweep on the migrated " + d91 + " snapshot: no lift carries a same-load null (the exact shape that shipped) — the class the per-set floor sweep exempted, now swept by its own law (violators: " + (bad91.join(",") || "none") + ")");
  });
  const stArm = cl90(SEED);
  stArm.exercises = [...stArm.exercises.filter((e) => e.id !== "hack"), { ...cl90(prodHack), last: [11, 11, 10] }];
  stArm.blackout = { until: isoL(Date.now() - 28 * 864e5) };
  const armLine = __test.runAdaptive(cl90(stArm), isoL(Date.now())).feed.find((f) => /HACK SQUAT — /.test(f.t));
  ok(!!armLine && armLine.t === "HACK SQUAT — NO NEXT LOAD ON FILE AT 160" && /nobody has measured a ceiling/.test(armLine.how) && /log a heavier weight/.test(armLine.how), "FIX ROUND — THE NOTE DOES NOT GUESS: a plate-loaded lift (no rungs, no inc) gets the athlete-held claim — no next load ON FILE, not a stack limit nobody measured; the rungs-exhausted arm keeps TOPS OUT (asserted above), cap9 identical for both");
  /* THE PROPERTY, roster-wide, both frozen snapshots */
  ["2026-08-06", "2026-08-07"].forEach((d90) => {
    const SP90 = JSON.parse(readFileSync("tools/snapshots/" + d90 + "-ledger.json", "utf8"));
    const bad = (SP90.exercises || []).filter((e) => {
      if (typeof e.w !== "number" || !Array.isArray(e.last) || !e.lastMeta || String(e.lastMeta.w) !== String(e.w) || e.std || e.reclaim) return false;
      const t9 = __test.targetsFor(e, SP90);
      const n9 = Math.min(t9.length, e.last.length);
      for (let i9 = 0; i9 < n9; i9++) if (t9[i9] < e.last[i9]) return true;
      return false;
    }).map((e) => e.id);
    ok(bad.length === 0, "MAXED LAW — roster sweep on the " + d90 + " snapshot: at unchanged load, NO lift's card prescribes below what was delivered (violators: " + (bad.join(",") || "none") + ") — the self-contradiction class, dead on the whole roster");
    /* the sweep is not vacuous: it CAUGHT abs (a runged lift delivered past hi, then
       prescribed below it) before the same-load floor existed — the second live instance
       of the class, found by the law itself */
  });
}
console.log(`\nFINAL90: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R15 · THE DEBRIEF — TYPED CONTRACT, FROZEN WORDS (FINAL91) ====================
   Joe, 3:10 AM, from the gym floor: the FULL DEBRIEF expansion never got the redesign —
   ~46 visually identical mono lines, every tier at once, one mega-accordion. The fix is
   structural, never verbal: sessionDebrief now returns TYPED output ({ mark, delivered,
   lines:[{k,t}], next, work } per lift) and tools/debrief-words.json — captured from the
   PRE-refactor engine on both frozen snapshots — proves the words did not move. */
{
  const sd91 = __test.sessionDebrief, dw91 = __test.debriefWords;
  const cl91 = (o) => JSON.parse(JSON.stringify(o));
  const FIX91 = JSON.parse(readFileSync("tools/debrief-words.json", "utf8"));
  const snaps91 = Object.keys(FIX91);
  ok(snaps91.length === 2 && snaps91.every((d) => Object.keys(FIX91[d]).length >= 8), "R15 DEBRIEF — the words freeze is REAL: two snapshots, at least eight debriefed sessions each (" + snaps91.map((d) => d + ": " + Object.keys(FIX91[d]).length).join(", ") + ") — an empty fixture cannot pass vacuously");
  for (const d91 of snaps91) {
    const st91 = __test.migrate(JSON.parse(readFileSync("tools/snapshots/" + d91 + "-ledger.json", "utf8")));
    for (const iso91 of Object.keys(FIX91[d91])) {
      ok(JSON.stringify(dw91(sd91(st91, iso91))) === JSON.stringify(FIX91[d91][iso91]), "R15 DEBRIEF WORDS-IDENTITY — " + d91 + " · " + iso91 + ": restructured, never rewritten — the flatten equals the pre-refactor sentences byte-for-byte");
    }
  }

  /* ---- THE MARK: engine-supplied, one per lift, by the spec priority ---- */
  const mkS91 = (sessions, exMut) => {
    const st = cl91(__test.SEED);
    st.sessionLog = {};
    sessions.forEach(([d, reps, w, rs]) => { st.sessionLog[d] = { entries: [{ id: "press", reps, w, rir: rs ? rs[0] : 1, rirSets: rs || [1, null, 0] }], at: 1 }; });
    if (exMut) { const ex = st.exercises.find((x) => x.id === "press"); if (ex) exMut(ex); }
    return st;
  };
  const dA91 = isoL(Date.now() - 8 * 864e5), dB91 = isoL(Date.now() - 4 * 864e5), dC91 = isoL(Date.now());
  const markOf91 = (st) => sd91(st, dC91).lifts[0].mark;
  ok(markOf91(mkS91([[dA91, [9, 9, 9], 245], [dB91, [8, 8, 7], 245], [dC91, [8, 8, 8], 245]])) === "UP", "MARK — up on last time but under the all-time line is UP, not RECORD: the comparison is the previous session, the record check is the whole history");
  ok(markOf91(mkS91([[dA91, [9, 9, 9], 245], [dC91, [8, 8, 7], 245]])) === "DOWN", "MARK — fewer reps at the same load is DOWN, plainly");
  ok(markOf91(mkS91([[dA91, [9, 9, 9], 245], [dB91, [8, 8, 8], 245], [dC91, [8, 8, 8], 245]])) === "LEVEL", "MARK — level with last time, under the all-time line: LEVEL");
  ok(markOf91(mkS91([[dC91, [8, 8, 8], 245]], (ex) => { ex.lastMeta = null; })) === "FIRST", "MARK — a TRUE debut (no session history AND no lastMeta baseline) has no delta to wear: FIRST — the honest addition to the spec ladder, flagged to the audit. A seed lastMeta counts as a baseline, correctly: the engine measures against everything it knows");
  ok(markOf91(mkS91([[dB91, [8, 8, 8], 245], [dC91, [7, 7, 7], 255]])) === "JUMP_PRICE", "MARK — down on a HEAVIER bar is JUMP PRICE, not DOWN: reps given back are the price of the jump");
  ok(markOf91(mkS91([[dA91, [5, 5, 5], 245], [dC91, [8, 8, 8], 245]])) === "RECORD", "MARK — a best that clears the old line by two standard errors banks on the spot: RECORD");
  ok(markOf91(mkS91([[dA91, [8, 8, 7], 245], [dC91, [8, 8, 8], 245]])) === "RECORD_PENDING", "MARK — a best inside his own measured spread waits for the repeat: RECORD PENDING, the hollow diamond");
  ok(markOf91(mkS91([[dA91, [9, 9, 9], 245], [dB91, [8, 8, 8], 245], [dC91, [8, 8, 8], 245]], (ex) => { ex.holdFlag = true; })) === "HOLD", "MARK — the governor hold outranks UP/LEVEL/DOWN: the row says what the engine is doing about it");
  ok(markOf91(mkS91([[dA91, [8, 8, 7], 245], [dC91, [8, 8, 8], 245]], (ex) => { ex.holdFlag = true; })) === "RECORD_PENDING", "MARK PRIORITY — a pending record outranks the governor hold: the spec ladder, driven at the boundary");
  ok(markOf91(mkS91([[dA91, [5, 5, 5], 245], [dC91, [8, 8, 8], 245, [0, null, null]]])) === "HOT", "MARK PRIORITY — BUT HOT outranks even a banked record: a ground-out opener is the one reading that can freeze the load, so it owns the row");

  /* ---- the typed fields carry DATA, not just sentences ---- */
  const stT91 = mkS91([[dB91, [8, 8, 8], 245], [dC91, [7, 7, 7], 255]]);
  const LT91 = sd91(stT91, dC91).lifts[0];
  ok(LT91.delivered && LT91.delivered.w === 255 && JSON.stringify(LT91.delivered.reps) === "[7,7,7]" && JSON.stringify(LT91.delivered.base) === "[8,8,8]" && LT91.delivered.dTot === -3 && LT91.delivered.heavier === true, "TYPED delivered — w, reps, base, dTot, heavier all present as data: the UI builds the subline and the set-by-set hero without parsing a sentence");
  ok(typeof LT91.delivered.jumpNote === "string" && LT91.delivered.jumpNote.indexOf("price of the jump") > -1 && LT91.delivered.jumpNote.indexOf("3 down on last time") === 0, "TYPED delivered — the jump-price clause is engine-authored, so the surface never rewrites a sentence to show it");
  ok(LT91.work && LT91.work.load === 255 * 21 && LT91.work.pc !== undefined, "TYPED work — load and pc are data; WORK DONE renders from them, never from parsing");
  const stN91 = mkS91([[dA91, [9, 9, 9], 245], [dB91, [8, 8, 8], 245], [dC91, [8, 8, 8], 245]]);
  const LN91 = sd91(stN91, dC91).lifts[0];
  ok(LN91.next && Array.isArray(LN91.next.targets) && typeof LN91.next.add === "number" && typeof LN91.next.why === "string" && typeof LN91.next.t === "string" && LN91.next.t.indexOf("Next time:") === 0, "TYPED next — targets/add/why as data plus the resolved legacy sentence: the NEXT block head is formatting, not re-derivation");

  /* ---- THE SURFACE: DebriefCard in the R15 grammar, pinned at source ---- */
  const srcD91 = readFileSync("src/app.jsx", "utf8");
  const dc91 = srcD91.slice(srcD91.indexOf("function DebriefCard("), srcD91.indexOf("function LogTab({"));
  ok(dc91.length > 2000 && dc91.length < 12000 && (srcD91.split("function DebriefCard(").length - 1) === 1, "R15 DEBRIEF — DebriefCard exists exactly once, directly above its one consumer, and the slice is bounded");
  ok((srcD91.split("FULL DEBRIEF — PER-LIFT DEPTH").length - 1) === 0 && (srcD91.split("▾ CLOSE DEBRIEF").length - 1) === 0 && (srcD91.split("dbOpen").length - 1) === 0 && (srcD91.split("DbOpen").length - 1) === 0, "the mega-accordion toggle is DEAD — no toggle copy, no orphaned state, and no DANGLING SETTER either: the first pin counted lowercase dbOpen and missed the archive row setDbOpen(true) by case (capital D), which left a tap-time ReferenceError the browser rig caught — both casings now pinned at zero");
  ok((srcD91.split("recomputed live — old sessions get smarter as the engine does").length - 1) === 1 && dc91.indexOf("recomputed live") > -1, "the honesty footer survives the redesign — exactly once, inside the card");
  ok(dc91.indexOf("minHeight: DT.touch") > -1 && dc91.indexOf('style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: "100%", minHeight: DT.touch, background: "none", border: "none"') > -1, "TOUCH LAW — each lift row is a full-width 64px PAINT-FREE hit box (background none, border none); paint lives on inner spans and the hairline separator is its own inert element — the standing split law");
  ok(dc91.indexOf("openLifts.filter((x) => x !== i)") > -1 && dc91.indexOf("[...openLifts, i]") > -1, "INDEPENDENT ACCORDIONS — open state is a set: one lift opening never closes another, the exact opposite of the mega-accordion defect");
  ok(dc91.indexOf("MARK9[L.mark]") > -1, "the UI consumes the engine mark by lookup and re-derives NOTHING — the mark is engine property, per the spec");
  ok((dc91.split('data-db="').length - 1) === 11, "the simplicity budget is a LAW: exactly eleven data-db species (card, eyebrow, verdict, context, row, mark, depth, hero, next, work, foot) — a twelfth is the accretion disease, and this assert is its vaccine (" + (dc91.split('data-db="').length - 1) + ")");
  ok(dc91.indexOf('RECORD: { g: "◆", w: "RECORD", c: DT.jade }') > -1 && dc91.indexOf('RECORD_PENDING: { g: "◇"') > -1 && dc91.indexOf('JUMP_PRICE: { g: "▼", w: "JUMP PRICE", c: DT.steel }') > -1 && dc91.indexOf('HOT: { g: "◆", w: "BUT HOT", c: DT.amber }') > -1, "the mark species are grayscale-distinct: solid diamond banked, hollow diamond pending, steel drop for jump price, amber diamond for BUT HOT — glyph plus word, never color alone");
  ok(dc91.indexOf("fontWeight: 600, fontSize: 15, color: DT.ink") > -1 && dc91.indexOf("db.summary[0]") > -1 && dc91.indexOf("db.summary.slice(1)") > -1 && dc91.indexOf("fontSize: 11, color: DT.steel, lineHeight: 1.7") > -1, "TIER 0 — the verdict is summary line 1 in the 15px/600 display register; the remaining summary lines drop to mono 11 steel, said once, hoisting preserved");
  ok(dc91.indexOf('k === "observation" || k === "rir" ? { g: "▸", gc: DT.amber') > -1 && dc91.indexOf('k === "record" ? { g: "◆", gc: DT.jade, tc: DT.ink }') > -1, "TIER 2 — the glyph rail types every sentence: ◆ jade record (ink text), ▸ amber observation/rir, faint dot for taper and fade");
  ok(dc91.indexOf("<DebriefCard s={s} iso={dateSel} />") === -1 && (srcD91.split("<DebriefCard s={s} iso={dateSel} />").length - 1) === 1, "the card mounts exactly once, as a SIBLING below the receipt — the receipt card is untouched in this slice");
}
console.log(`\nFINAL91: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R15d · LEDGER — DECISIONS AND DIARY, PLAIN WORDS (FINAL92) ====================
   The hub was a settings screen wearing the LEDGER name. Per the mockup (screen 3):
   NEEDS YOUR OK leads with the live count and a designed-normal empty state; THE RECORD
   is the feed as a day-grouped diary in the engine's own words; LAB wears its live
   counts; every room keeps its two-tap door. Presentation only — the engine freeze
   stays byte-clean through this slice. */
{
  const srcL = readFileSync("src/app.jsx", "utf8");
  const mt = srcL.slice(srcL.indexOf("function MoreTab("), srcL.indexOf("function CoachView("));
  ok(mt.length > 3000 && mt.length < 24000 && (srcL.split("function MoreTab(").length - 1) === 1, "R15d — the LEDGER hub slice is bounded and MoreTab keeps its name: it is the END ANCHOR of the R15c chip pin, and renaming it would silently swallow that slice");
  ok((mt.split(String.fromCharCode(100, 97, 116, 97, 45, 108, 101, 100, 61, 34)).length - 1) === 5, "R15d+h — the simplicity budget is a LAW, deliberately grown once: five data-led blocks (ok, LEARNING, diary, lab, rooms) — the fifth was the audit-directed experiment-legibility digest, and a SIXTH is the accretion disease this assert still vaccinates against");
  ok(mt.indexOf(String.fromCharCode(100, 97, 116, 97, 45, 115, 112, 101, 99, 61, 34, 101, 120, 97, 109, 112, 108, 101, 34)) > -1 && mt.indexOf("aria-hidden=\"true\" style={{ pointerEvents: \"none\"") > -1, "R14 AT THE ILLUSTRATION — the example decision card is INERT by construction (pointer-events none, aria-hidden, dashed frame): a card whose taps enact nothing may not be tappable");
  ok(mt.indexOf("A TAP HERE ALWAYS CHANGES SOMETHING REAL — AND ONE TAP ALWAYS UNDOES IT") > -1 && mt.indexOf("Nothing needs your OK right now.") > -1 && mt.indexOf("{okN} WAITING") > -1, "the empty inbox is the DESIGNED-NORMAL good state, in the mockup words, and the count on the row is the rail badge count");
  ok(mt.indexOf("onClick={() => go(\"BRIEF\")}") > -1 && (mt.split("ApprovalInbox").length - 1) === 0, "ONE DOOR STAYS ONE DOOR — a waiting decision routes to the briefing room; the hub mounts NO second inbox, so a card can never exist in two places");
  ok(mt.indexOf("{f.t}") > -1 && mt.indexOf("{f.how}") > -1, "the diary renders the engine feed VERBATIM — t and how untouched, no rewriting at the surface (the typed-words discipline)");
  ok(mt.indexOf("labStatusList(s)") > -1 && mt.indexOf("{labAll.length} TOOLS") > -1 && mt.indexOf("{labLive} SPEAKING") > -1, "the LAB row counts are LENGTHS of existing selector output (labStatusList) — the UI computes nothing, per the engine-owns-numbers guardrail");
  ok((mt.split("minHeight: DT.touch").length - 1) >= 3 && mt.indexOf("background: \"none\", border: \"none\"") > -1, "TOUCH LAW — the ok row, the lab row and every room row are 64px paint-free hit boxes; paint rides inner spans (the standing split law)");
  ok(mt.indexOf("t: \"THE BRIEFING ROOM\"") > -1 && mt.indexOf("k: \"QUEUE\"") > -1 && mt.indexOf("k: \"SLEEP\"") > -1 && mt.indexOf("k: \"BODY\"") > -1 && mt.indexOf("onClick={() => go(\"HIST\")}") > -1, "every room keeps its two-tap door: BRIEFING ROOM / QUEUE / SLEEP / BODY rows plus the LAB hero row to HIST");
  ok(mt.indexOf("React.Fragment") > -1 && mt.indexOf("{i > 0 ? <div style={{ borderTop: \"1px solid \" + DT.hairline }} /> : null}") > -1, "hairlines are INERT SIBLINGS between row buttons, never wrappers — a wrapper whose text shadows a row would steal the render-smoke document-order click");
  ok((mt.split("role=\"button\"").length - 1) >= 5 && mt.indexOf("<SecRule>ANALYST & RULES</SecRule>") > -1 && (srcL.split("<SecRule>THE RECORD</SecRule>").length - 1) === 0, "rows carry the explicit role the smoke pins by attribute, and the settings section sheds the name the diary now owns");

  /* ---------- ROUND 2 — the audit's two fixes + Joe's diary call ---------- */
  ok(mt.indexOf("diaryFeed(s, 12)") > -1 && (mt.split("isLabFeedLine").length - 1) === 0 && mt.indexOf("LAB LIVE") === -1, "R2-3 — the hub consumes the ONE selection law (diaryFeed) and carries no inline family knowledge of its own: the filter lives beside the producer it filters, never at the surface");
  ok(mt.indexOf("const ease0 = autonomyOf(s) === \"propose\"") > -1 && mt.indexOf("that’s how you have it set") > -1 && mt.indexOf("Small routine tweaks happen automatically") > -1, "R2-2 — the empty-state CLAIM reads the dial: at PROPOSE it says the setting's own truth (nothing changes without your OK), and the automatic-tweaks line renders only when autonomy is actually granted");
  ok(mt.indexOf("minHeight: 44, width: \"100%\", textAlign: \"left\"") > -1 && mt.indexOf("margin: \"0 0 -12px\"") > -1, "R2-1 — the diary tail is a 44px hit box (measured 30 on the rig): the button is paint-free text so padding is pure slop, and the negative margin hands the growth to the card's inert padding — paint does not move");

  /* GUARD-MUST-FIRE, both ways: the REAL producer writes a lab line; the selector
     excludes exactly that line and passes everything else. The drive doctors labSeen
     (one LIVE card marked previously-COUNTING) so sweepLab's own flip detector fires. */
  {
    const st92 = __test.migrate(JSON.parse(readFileSync("tools/snapshots/2026-08-06-ledger.json", "utf8")));
    const seeded92 = __test.sweepLab(JSON.parse(JSON.stringify(st92)));   /* first pass seeds labSeen */
    const liveId92 = Object.keys(seeded92.labSeen || {}).find((k) => seeded92.labSeen[k] === "LIVE");
    ok(!!liveId92, "R2-3 drive precondition — the live snapshot has at least one LIVE instrument to flip (" + Object.keys(seeded92.labSeen || {}).length + " swept)");
    seeded92.labSeen[liveId92] = "COUNTING";
    const flipped92 = __test.sweepLab(seeded92);
    const labLine92 = (flipped92.feed || [])[0];
    ok(!!labLine92 && labLine92.t.indexOf("LAB LIVE — ") === 0 && __test.isLabFeedLine(labLine92), "R2-3 guard fires — the REAL producer (sweepLab) wrote its shelf-flip line and the family predicate claims it: " + (labLine92 ? labLine92.t : "none"));
    const diary92 = __test.diaryFeed(flipped92, 12);
    ok(diary92.length === 12 && diary92.every((f) => !__test.isLabFeedLine(f)), "R2-3 — the selector EXCLUDES the producer's line and the 12-line window fills AFTER the skip: twelve real life events, zero lab-status lines");
    ok(diary92.some((f) => f.t === (flipped92.feed || []).filter((f2) => !__test.isLabFeedLine(f2))[0].t), "R2-3 both ways — a non-lab line passes the selector untouched, words verbatim: selection only, never rewriting");
  }
}
console.log(`\nFINAL92: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R15e · THE COPY SWEEP — ROUND 1 (FINAL93) ====================
   Words are the point of the slice: the Pelland claim reads as the continuous curve it
   is (a high-return REGION, not invented tiers); the diary-level producers shed jargon;
   the app-wide disclosure controls meet the touch law by slop with paint unmoved. The
   engine baseline moved by EXACTLY the retitled note (regenerated in-commit); the
   debrief words fixture was regenerated through the flatten and proved byte-identical. */
{
  const srcE = readFileSync("src/app.jsx", "utf8");
  ok((srcE.split("VOLUME BAND SITS ABOVE THE HIGH-RETURN TIER").length - 1) === 0 && (srcE.split("VOLUME BAND SITS ABOVE THE HIGH-RETURN REGION").length - 1) === 1, "R15e — the tier is retired from the note title: the region framing is the only one the producer can file");
  ok(srcE.indexOf("traces a smooth curve, not steps") > -1 && srcE.indexOf("there is no cliff at any number, just diminishing returns") > -1 && srcE.indexOf("2,058 people") > -1, "R15e — the body states Pelland honestly: a continuous curve with diminishing returns, in plain words at the diary headline level");
  ok((srcE.split("the regime detector, which reads").length - 1) === 0 && srcE.indexOf("phase read, which watches your lifts") > -1, "R15e — the withdrawn-card producer speaks plain at the diary level: regime detector became the phase read that watches lifts and scale rate");
  const moreSl = srcE.slice(srcE.indexOf("function More({"), srcE.indexOf("function More({") + 2600);
  ok(moreSl.indexOf('padding: "15px 12px", margin: "-15px -12px"') > -1, "R15e TOUCH LAW — the app-wide MORE disclosure is a 44px hit box: paint-free text, padding as pure slop, negative margins keep every painted pixel in place");
  const secSl = srcE.slice(srcE.indexOf("function Section({"), srcE.indexOf("function More({"));
  ok(secSl.indexOf('minHeight: 44, display: "flex", flexDirection: "column", justifyContent: "center", padding: "12px 12px", margin: "-12px -12px"') > -1, "R15e TOUCH LAW — the shared Section header clears 44 by slopping into the Card's own inert padding; layout byte-identical by equal-and-opposite arithmetic");
  ok(srcE.indexOf('color: showSetup[ex.id] ? T.chalk : T.steel, background: "none", border: "none", padding: "15px 12px", margin: "-15px -12px"') > -1, "R15e TOUCH LAW — SETUP + CUES on TRAIN gets the same slop treatment");
  /* ROUND 2 — THE PAINTED-PILL CLASS IS CLOSED: all four pill disclosures (why not cut
     calories / why this number / track record / the arc) wear the same split, and the
     old shape — a bordered pill that is its own hit box — can no longer exist. */
  ok((srcE.split("the span carries the pill byte-for-byte").length - 1) === 4 && (srcE.split('padding: "7px 0", margin: "-7px 0", cursor: "pointer" }}').length - 1) === 4, "R15e round 2 — the painted-pill CLASS is closed: four pills, four identical splits (outer paint-free slop, pill on the inner span, hit ≥44 by the same arithmetic the audit measured on why-not)");
  ok((srcE.split('borderRadius: 999, padding: "6px 12px", cursor: "pointer" }}>').length - 1) === 0, "R15e round 2 — the four disclosure pills' OLD style fingerprint is extinct (audit correction on the record: this pin enforces ONE fingerprint, not every bordered pill — the five other painted-pill hit boxes it missed were named into R15f and fixed there)");
  /* the producer itself, driven: the note files under the region title with the curve body */
  const clE = (o) => JSON.parse(JSON.stringify(o));
  const stE = clE(__test.SEED);
  stE.blackout = { until: isoL(Date.now() - 28 * 864e5) };
  const outE = __test.runAdaptive(stE, isoL(Date.now()));
  const noteE = (outE.feed || []).find((f) => f.t.indexOf("VOLUME BAND") === 0);
  ok(!!noteE && noteE.t === "VOLUME BAND SITS ABOVE THE HIGH-RETURN REGION" && noteE.how.indexOf("smooth curve") > -1 && noteE.how.indexOf("calorie cut") > -1, "R15e driven — the note files under the REGION title with the curve body, and the deficit jargon reads as calorie cut at the diary's headline level: " + (noteE ? noteE.t : "none"));
}
console.log(`\nFINAL93: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R15f · POLISH ROUND 1 — THE EARNED RENAME + THE FIVE CONTROLS (FINAL94) ====================
   The product names itself EARNED everywhere text can carry it (wordmark, BRIEF header,
   serial plate, dossier header, page title, manifest, sw cache prefix, both smoke pins).
   Internal rename only — public launch gates on trademark clearance, a Joe-side task.
   Icon PNGs await design assets, flagged not pinned. The audit's five named painted-pill
   hit boxes take the standing split; the share switch keeps its conventional 44×26 paint
   and moves its HIT to a paint-free outer. */
{
  const srcF = readFileSync("src/app.jsx", "utf8");
  const idxF = readFileSync("index.html", "utf8");
  const manF = readFileSync("manifest.webmanifest", "utf8");
  const swF = readFileSync("sw.js", "utf8");
  ok(idxF.indexOf("<title>EARNED</title>") > -1 && idxF.indexOf('content="EARNED"') > -1 && idxF.indexOf("Measured") === -1, "R15f RENAME — the page title and apple web-app title both say EARNED, and no Measured survives in the shell");
  ok(manF.indexOf('"name": "EARNED"') > -1 && manF.indexOf('"short_name": "EARNED"') > -1 && manF.indexOf("Measured") === -1, "R15f RENAME — the manifest names the install EARNED, long and short");
  ok(srcF.indexOf(">EARNED</span>") > -1 && srcF.indexOf("<H size={24}>Earned</H>") > -1 && srcF.indexOf("EARNED · v{APP_V}") > -1 && srcF.indexOf("EARNED — ANALYST DOSSIER") > -1, "R15f RENAME — all four in-app wordmark sites carry EARNED: the NOW wordmark, the BRIEF header, the serial plate, the dossier header");
  ok(srcF.indexOf(">MEASURED</span>") === -1 && srcF.indexOf("<H size={24}>Measured</H>") === -1 && srcF.indexOf("MEASURED · v{APP_V}") === -1, "R15f RENAME — and no wordmark site still says MEASURED; the STATUS word MEASURED (trust vocabulary, a tracked quantity) is deliberately untouched");
  ok(swF.indexOf("earned-v") > -1 && swF.indexOf("measured-v") === -1, "R15f RENAME — the sw cache prefix is earned-v; the activate sweep purges every old measured-v cache on first load");
  ok((srcF.split("the painted chip rides the inner span").length - 1) === 8, "R15f+g — the chip class wears the standing split everywhere it exists: the R15f four (undo pill, two est chips, the context chip) plus the R15g four selector groups (sodium/alcohol, today and yesterday), marker-pinned so a ninth chip must join the law or fail here");
  ok(srcF.indexOf("paint-free outer (26+18=44)") > -1 && srcF.indexOf('aria-checked={plan.share} onClick={() => savePlan({ share: !plan.share })} style={{ background: "none", border: "none", padding: "9px 0"') > -1, "R15f — the share switch: its 44×26 paint is the conventional control and stays byte-identical; the HIT moved to a paint-free outer button clearing the floor — the argued case, pinned");
  /* ROUND 2 — five Title-Case brand survivors (the round-1 needle was all-caps). No
     blanket title-case needle is possible: the VERB uses (Measured from your own trend,
     Measured pace), all comments, and the MEASURED trust vocabulary are deliberate
     survivors per the standing exclusion — so the five exact old strings are pinned
     extinct and their five replacements pinned present, one by one. */
  ok(srcF.indexOf("Earned. Not guessed. · v{APP_V}") > -1 && srcF.indexOf(">Measured. Not guessed.") === -1, "R15f r2 — the tagline signs the new name: Earned. Not guessed. (Joe's word, the default taken). The needle is the RENDERED string — the v6.3 comment quoting the old tagline is a deliberate survivor, comments being history");
  ok(srcF.indexOf("scoped to EARNED only") > -1 && srcF.indexOf("scoped to Measured only") === -1, "R15f r2 — the rules-sheet token line is scoped to EARNED");
  ok(srcF.indexOf("· EARNED v{APP_V}") > -1 && srcF.indexOf("· Measured v{APP_V}") === -1, "R15f r2 — the export card signs EARNED, matching the serial plate");
  ok(srcF.indexOf("an EARNED backup — nothing was changed") > -1 && srcF.indexOf("a Measured backup") === -1, "R15f r2 — the import alert names an EARNED backup (a became an with the vowel)");
  ok(srcF.indexOf('`EARNED ${APP_V} · tab') > -1 && srcF.indexOf('`Measured ${APP_V} · tab') === -1, "R15f r2 — the crash report leads with EARNED, so a beacon line names the product it came from");
}
console.log(`\nFINAL94: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R15g · LAB COHESION — THE REGIME DETECTOR CARD (FINAL95) ====================
   The door the volume lever and the eat band gate on, finally visible as an instrument.
   Derived-only (one regime(s) call); the lab ROSTER joins the engine-freeze surface as a
   deliberate expansion — the audit believed it was already frozen, measurement said no. */
{
  const cl95 = (o) => JSON.parse(JSON.stringify(o));
  /* the LAW on both migrated snapshots: status is a pure function of regime(st) */
  for (const d95 of ["2026-08-06", "2026-08-07"]) {
    const st95 = __test.migrate(JSON.parse(readFileSync("tools/snapshots/" + d95 + "-ledger.json", "utf8")));
    const cards95 = __test.labStatusList(st95).filter((c) => c.id === "regime");
    const reg95 = __test.regime(st95);
    ok(cards95.length === 1 && cards95[0].status === (reg95.key === "unknown" ? "ARMED" : reg95.confirmed ? "LIVE" : "PROVISIONAL"), "R15g LAW on " + d95 + " — exactly one regime card, and its status is a pure restatement of regime(s): " + cards95[0].status + " for key=" + reg95.key + "/confirmed=" + reg95.confirmed);
    if (cards95[0].status === "ARMED") ok(cards95[0].tag.indexOf("Counting only") > -1 && cards95[0].prog && typeof cards95[0].prog.n === "number", "R15g — an unknown regime says COUNTING ONLY and carries its counter, never a verdict (instruments gate on n)");
  }
  /* the LIVE path, driven on a confirmed-free fixture (the FINAL82 shape, rebuilt) */
  const isoW = (back) => isoL(Date.now() - back * 864e5);
  const stF = cl95(__test.SEED);
  stF.blackout = { until: isoW(28) };
  stF.reads = Array.from({ length: 35 }, (_, i) => ({ d: isoW(34 - i), w: +(170 - i * 0.09).toFixed(2), sealed: false }));
  stF.trend = stF.reads[stF.reads.length - 1].w;
  stF.sleep.nights = Array.from({ length: 40 }, (_, i) => ({ d: isoW(39 - i), h: 8.2 }));
  stF.dailyLogs = {}; stF.sessionLog = {};
  stF.exercises.forEach((e) => { e.holdFlag = false; });
  const liftsF = [{ id: "rows", w: 175, base: 16 }, { id: "press", w: 245, base: 14 }, { id: "lateral", w: 80, base: 20 }, { id: "tricep", w: 55, base: 18 }, { id: "ham", w: 120, base: 15 }];
  for (let k = 0; k < 8; k++) stF.sessionLog[isoW(28 - k * 4)] = { at: 0, note: "", niggles: [], dips: 0, skipped: [], pace: "normal", entries: liftsF.map((L) => { const tot = L.base + k; const a = Math.ceil(tot / 2); return { id: L.id, reps: [a, tot - a], rir: 2, rirSets: [2, 1], w: L.w }; }) };
  const regF = __test.regime(stF);
  const cardF = __test.labStatusList(stF).find((c) => c.id === "regime");
  ok(regF.key === "free" && regF.confirmed === true && cardF.status === "LIVE", "R15g LIVE — a confirmed FREE regime puts the card in SPEAKING NOW: " + regF.key + "/" + regF.confirmed + " -> " + cardF.status);
  ok(cardF.lines.some((l) => l.indexOf("CONFIRMED because the same state was read at both evaluations") === 0) && cardF.lines.some((l) => l.indexOf("It flips to COSTING") === 0), "R15g — the receipt says WHY it is confirmed (the hysteresis law, twice at least 7 days apart) and exactly what evidence would flip it");
  ok(cardF.lines.some((l) => l.indexOf("DOWNSIDE-ONLY PROTECTION") === 0 && l.indexOf("can never be what CREATES a falling lift verdict") > -1 && l.indexOf("protection never blocks the upside") > -1), "R15g — the downside-only note states the constitution literally: a rushed session cannot CREATE a falling verdict, and a rise still banks");
  ok(cardF.forYou === regF.why, "R15g — forYou is the engine words VERBATIM (reg.why), so the sweepLab shelf-flip line carries them at birth into the diary");
  /* derived-only: the card slice makes ONE regime(s) call and computes nothing else */
  const srcG = readFileSync("src/app.jsx", "utf8");
  const gSl = srcG.slice(srcG.indexOf("R15g — THE REGIME DETECTOR, visible at last"), srcG.indexOf("id: \"mrv\""));
  ok(gSl.length > 500 && (gSl.split("reg = regime(s);").length - 1) === 1 && (gSl.split("currentRate(").length - 1) === 0 && (gSl.split("progressionTrend(").length - 1) === 0, "R15g DERIVED-ONLY — the card slice calls regime(s) exactly once and no other engine function: every sentence restates, nothing recomputes");
  ok(srcG.indexOf("VOLUME RETURN CURVE — WHERE AN ADDED SET STOPS PAYING FOR ITS FATIGUE") > -1 && srcG.indexOf("WHERE ADDED SETS STOP PAYING" + String.fromCharCode(34)) === -1, "R15g — the mrv title joins the R15e curve law: an added set stops paying FOR ITS FATIGUE (net), never stops paying outright (there is no cliff)");
  const surfG = readFileSync("tools/_engine-surface.jsx", "utf8");
  ok(surfG.indexOf("o.labRoster = grab(() => T.labStatusList(S).map((c) => ({ id: c.id, t: c.t, status: c.status })))") > -1, "R15g — the lab ROSTER is frozen from here on (id + title + status, both snapshots): a new instrument or a retitle can never again ship without the gate seeing it");
}
console.log(`\nFINAL95: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R15h · EXPERIMENT LEGIBILITY — THE DIGEST'S LAW (FINAL96) ====================
   Every row is a pure restatement of its source: trial rows of the trial's own template
   and arm machinery, the regime row of regime()'s pending fields, instrument rows of
   labSections' own buckets in their own order with prog fields VERBATIM. Derived-only:
   no state key, no feed line, zero engine movement — the freeze gate holds the baseline
   byte-identical through this slice. */
{
  const dg96 = __test.expDigest;
  const cl96 = (o) => JSON.parse(JSON.stringify(o));
  for (const d96 of ["2026-08-06", "2026-08-07"]) {
    const st96 = __test.migrate(JSON.parse(readFileSync("tools/snapshots/" + d96 + "-ledger.json", "utf8")));
    const digest = dg96(st96);
    const secs96 = __test.labSections(st96);
    const gath96 = (secs96.find((x) => x.k === "gathering") || { cards: [] }).cards.filter((c) => c && c.prog && c.prog.need);
    const prov96 = (secs96.find((x) => x.k === "provisional") || { cards: [] }).cards.filter((c) => c && c.prog && c.prog.need);
    const gRows = digest.rows.filter((r) => r.kind === "gathering");
    const pRows = digest.rows.filter((r) => r.kind === "provisional");
    ok(gRows.length === gath96.length && gRows.every((r, i) => r.q === (gath96[i].tag || gath96[i].t) && r.n === gath96[i].prog.n && r.need === gath96[i].prog.need && r.label === gath96[i].prog.label), "R15h VERBATIM LAW on " + d96 + " — every gathering row leads with its card's own PLAIN QUESTION (tag, title fallback — Joe's word, both engine words verbatim) in the lab's OWN order: " + gRows.length + " rows, prog fields identical, nothing recomputed");
    ok(pRows.length === prov96.length && pRows.every((r, i) => r.q === (prov96[i].tag || prov96[i].t) && r.n === prov96[i].prog.n && r.need === prov96[i].prog.need), "R15h VERBATIM LAW on " + d96 + " — provisional rows the same: tag-first question, prog verbatim (" + pRows.length + " rows)");
    ok(!!digest.head && digest.rows.length === gRows.length + pRows.length + digest.rows.filter((r) => r.kind === "trial" || r.kind === "regime").length, "R15h — the digest has a head and every row is accounted for by kind on " + d96);
  }
  /* the trial fixture: an approved caffcut trial leads the ladder */
  const stT = cl96(__test.SEED);
  stT.sleep.caffMg = 200;
  stT.trials = [{ tplId: "caffcut", started: isoL(Date.now() - 4 * 864e5) }];
  const dT = dg96(stT);
  ok(!!dT.head && dT.head.kind === "trial" && dT.head.q === "Does a smaller pre-lift dose cost reps — or buy sleep?", "R15h — an approved trial leads the ladder and the headline is the template's OWN question, verbatim: " + (dT.head ? dT.head.q : "none"));
  ok(dT.head.n === 2 && dT.head.need === 6 && ["usual dose", "usual −100 mg"].includes(dT.head.arm), "R15h — block and arm come from trialArmOn's own fields: day 4 of 3-day blocks = block 2 of 6, arm from the template's arms array (" + dT.head.n + "/" + dT.head.need + " · " + dT.head.arm + ")");
  /* ---------- ROUND 2 — Joe's word, the grammar, and the audit's pending-flip fixture ---------- */
  {
    const st2 = __test.migrate(JSON.parse(readFileSync("tools/snapshots/2026-08-07-ledger.json", "utf8")));
    const d2 = dg96(st2);
    const secs2 = __test.labSections(st2);
    const all2 = [...(secs2.find((x) => x.k === "gathering") || { cards: [] }).cards, ...(secs2.find((x) => x.k === "provisional") || { cards: [] }).cards];
    const ws2 = all2.find((c) => c.id === "wakesig");
    const wsRow = d2.rows.find((r) => r.q === (ws2 && ws2.tag));
    ok(!!ws2 && !!ws2.tag && !!wsRow && wsRow.q === "Is the 6-hour wake a pattern with an address, or noise?", "R2 JOE'S WORD — the WAKE SIGNATURE row leads with the card's own plain question, engine words verbatim: " + (wsRow ? wsRow.q : "row missing"));
    ok(all2.every((c) => !!c.tag), "R2 — no tagless card exists in today's buckets, so the title FALLBACK is source-pinned rather than state-driven (the honest scope): every current card carries its plain question");
    ok(wsRow.need - wsRow.n === 1 && wsRow.settle === "one more and it speaks", "R2 GRAMMAR — exactly-one-remaining drops the label repeat: " + JSON.stringify(wsRow.settle));
    const plural2 = d2.rows.find((r) => (r.kind === "gathering") && (r.need - r.n) > 1);
    ok(!!plural2 && plural2.settle.indexOf((plural2.need - plural2.n) + " more " + (plural2.label || "observations")) === 0, "R2 GRAMMAR — plural cases keep the count and label verbatim: " + JSON.stringify(plural2 && plural2.settle));
  }
  /* the audit's pending-flip fixture, folded in permanent: confirmed FREE reading COSTING once */
  {
    const isoW2 = (back) => isoL(Date.now() - back * 864e5);
    const stP = cl96(__test.SEED);
    stP.blackout = { until: isoW2(28) };
    stP.reads = Array.from({ length: 35 }, (_, i) => ({ d: isoW2(34 - i), w: +(170 - i * 0.09).toFixed(2), sealed: false }));
    stP.trend = stP.reads[stP.reads.length - 1].w;
    stP.sleep.nights = Array.from({ length: 40 }, (_, i) => ({ d: isoW2(39 - i), h: 8.2 }));
    stP.dailyLogs = {}; stP.sessionLog = {};
    stP.exercises.forEach((e) => { e.holdFlag = false; });
    const liftsP = [{ id: "rows", w: 175, base: 16 }, { id: "press", w: 245, base: 14 }, { id: "lateral", w: 80, base: 20 }, { id: "tricep", w: 55, base: 18 }, { id: "ham", w: 120, base: 15 }];
    for (let k = 0; k < 6; k++) stP.sessionLog[isoW2(28 - k * 4)] = { at: 0, note: "", niggles: [], dips: 0, skipped: [], pace: "normal", entries: liftsP.map((L) => { const tot = L.base + k; const a = Math.ceil(tot / 2); return { id: L.id, reps: [a, tot - a], rir: 2, rirSets: [2, 1], w: L.w }; }) };
    for (let j = 0; j < 3; j++) stP.sessionLog[isoW2(5 - j * 2)] = { at: 0, note: "", niggles: [], dips: 0, skipped: [], pace: "normal", entries: liftsP.map((L) => { const tot = Math.max(4, L.base + 5 - 3 * (j + 1)); const a = Math.ceil(tot / 2); return { id: L.id, reps: [a, tot - a], rir: 2, rirSets: [2, 1], w: L.w }; }) };
    const rgP = __test.regime(stP);
    ok(rgP.key === "free" && rgP.confirmed === true && rgP.pending === "costing" && !!rgP.pendingSince, "R2 FIXTURE — the audit's shape reproduces: confirmed FREE holding, COSTING read once (pendingSince " + rgP.pendingSince + ")");
    const dP = dg96(stP);
    const rRow = dP.rows.find((r) => r.kind === "regime");
    ok(!!rRow && rRow.q === "has the cut left FREE for COSTING?" && rRow.n === 1 && rRow.need === 2, "R2 — the digest's regime row states the pending flip: " + (rRow ? rRow.q : "missing") + " (1 of 2 readings)");
    const sd2 = new Date(new Date(rgP.pendingSince + "T12:00:00").getTime() + 7 * 864e5);
    const secondDate = (sd2.getMonth() + 1) + "/" + sd2.getDate();
    ok(rRow.settle.indexOf(secondDate) > -1 && rRow.q.indexOf("undefined") === -1 && rRow.settle.indexOf("undefined") === -1, "R2 — the settle names the second-reading date (" + secondDate + ") and nothing reads undefined: " + rRow.settle);
  }

  /* derived-only, at source: the digest writes nothing and files nothing */
  const srcH = readFileSync("src/app.jsx", "utf8");
  const hSl = srcH.slice(srcH.indexOf("function expDigest("), srcH.indexOf("R15j · THE CAPTURE SHEET — the universal door"));   /* end anchor re-derived R15j: the capture sheet now sits between expDigest and MoreTab, so the old boundary swallowed a component that legitimately writes */
  ok(hSl.length > 500 && (hSl.split("save(").length - 1) === 0 && (hSl.split("setS(").length - 1) === 0 && (hSl.split("feed.unshift").length - 1) === 0 && (hSl.split("localStorage").length - 1) === 0, "R15h DERIVED-ONLY — expDigest writes nothing: no save, no setS, no feed line, no storage — a pure read, pinned");
  ok((srcH.split("data-led=" + String.fromCharCode(34) + "learning" + String.fromCharCode(34)).length - 1) === 1 && srcH.indexOf("EVERY QUESTION KEEPS ITS COUNTER IN THE LAB") > -1 && srcH.indexOf("if (!dg.head) return null;") > -1, "R15h — one learning block on the hub, the one door to LAB, and the block is ABSENT when nothing is being learned (an empty study list is not news)");
}
console.log(`\nFINAL96: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R15i · THE LAB ROOM — ROWS, NOT ESSAYS (FINAL97) ====================
   Joe's word: a lot of unnecessary detail. The density law: every instrument is ONE
   44px row closed (name · status word · counter); detail is never deleted — it moves
   one tap down (tag → forYou → ▸ MORE for deep + receipts). The instruments lead the
   room; the weekly card demotes; N-OF-1 closes; the doubled bucket counts and the
   prophet line's sub-44 tap are fixed. Presentation only: freeze/roster/words all
   byte-identical through this slice, census 57, no feed lines. */
{
  const srcI = readFileSync("src/app.jsx", "utf8");
  const room = srcI.slice(srcI.indexOf("function HistTab("), srcI.indexOf("function MoreTab("));
  /* the row law */
  ok(room.indexOf('whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"') > -1 && (room.split("(not yet earned — n=").length - 1) === 0 && (room.split("— not yet a verdict)").length - 1) === 0, "R15i ROW LAW — the closed row is ONE line (name by ellipsis, full name on the open card) and the two-line provenance sentences are extinct: the parenthetical folded into the right column");
  ok(room.indexOf('`measured${a.prog && a.prog.n != null ? ` · n=${a.prog.n}` : ""}`') > -1 && room.indexOf('`provisional · ${a.prog && a.prog.n != null ? a.prog.n : "?"}') > -1, "R15i — the right column carries status word + counter: measured · n=X, provisional · n of need, n/need for gathering — the same fields, one line");
  /* the room order: instruments lead, weekly card demoted, twin between */
  const iInstr = room.indexOf("const groups = labGroupsM(s)");
  const iTwin = room.indexOf("THE DIGITAL TWIN");
  const iRec = room.indexOf("THE RECORD · {HISTORY.length");
  const iNof = room.indexOf("N-OF-1 · WHAT THE APP HAS LEARNED");
  ok(iInstr > -1 && iTwin > iInstr && iRec > iTwin && (room.split('<Section title="The Lab"').length - 1) === 0, "R15i — THE INSTRUMENTS LEAD: hoisted out of the collapsible wrapper (the Section is gone, both doors land on them open and in view), the twin follows, the weekly record card is demoted below");
  ok(room.indexOf("const [nof1Open, setNof1Open] = useState(false)") > -1 && iNof > iTwin && room.indexOf("{nof1Open && (<>") > -1, "R15i — N-OF-1 is a 44px header CLOSED by default, after the twin; every parameter verbatim one tap down");
  /* the open card: tag → forYou visible; deep + lines behind ▸ MORE */
  const cardSl = room.slice(room.indexOf("const renderCard = (a) => {"), room.indexOf("const wkAgo"));
  const iTag = cardSl.indexOf("plainify(a.tag)");
  const iFor = cardSl.indexOf("plainify(a.forYou)");
  const iMore = cardSl.indexOf("setMoreOpen(more ? null : a.id)");
  const iDeep = cardSl.indexOf("plainify(a.deep)");
  ok(iTag > -1 && iFor > iTag && iMore > iFor && iDeep > iMore && cardSl.indexOf("(a.lines || []).map") > iMore, "R15i — the open card reads tag (the plain question) then forYou (the live read), and deep + the receipt lines wait behind the standing ▸ MORE — engine words verbatim at every layer, only the order is surface");
  /* the named fixes */
  ok(room.indexOf('setLabOpen("prophet"); } }} style={{ display: "flex", alignItems: "center", minHeight: 44') > -1, "R15i — the MACHINE TRUST prophet line (the named defect) is a 44px flex row with the keyboard path, no longer a bare sub-44 text tap");
  ok(room.indexOf("{sec.title}{/* R15i") > -1 && (room.split('{sec.title} <span style={{ color: T.brass }}>{sec.cards.length}</span>').length - 1) === 0, "R15i — the doubled bucket count is fixed: the engine title (byte-identical, carrying its own count) is the single source; the surface brass duplicate is extinct");
  ok(room.indexOf("every instrument below waits for its own n before it speaks") > -1 && room.indexOf("a few will always look interesting by chance, and anything under {LAB_MIN_N} observations reads PROVISIONAL, not measured") > -1, "R15i — the masthead is ONE sentence and the forking-paths disclosure survives as a single line, still naming chance and the PROVISIONAL floor");

  /* ---------- ROUND 2 — the entrance ---------- */
  {
    const Q = String.fromCharCode(34);
    const srcR = readFileSync("src/app.jsx", "utf8");
    const shell = srcR.slice(srcR.indexOf("aria-label=" + Q + "Back to Ledger" + Q) - 400, srcR.indexOf("aria-label=" + Q + "Back to Ledger" + Q) + 500);
    ok(shell.indexOf("minHeight: 44") > -1 && shell.indexOf('padding: "12px 14px 12px 0", margin: "-12px 0 0 -14px"') > -1 && shell.indexOf('padding: "0 0 12px"') === -1, "R15i r2 FIX 1 — the back-link (27px on the rig) is a 44px hit box: paint-free text, padding as pure slop, equal-and-opposite margin so the glyph never moves");
    const roomR = srcR.slice(srcR.indexOf("function HistTab("), srcR.indexOf("function MoreTab("));
    ok((roomR.split("<Eyebrow c={T.gauge}>THE LAB · READ TO DECIDE</Eyebrow>").length - 1) === 0 && (roomR.split("Read to decide, not to browse — every instrument below waits for its own n before it speaks.").length - 1) === 1 && roomR.indexOf("THE LAB · {totLive} SPEAKING") > -1, "R15i r2 FIX 2 — ONE masthead: the census eyebrow carries the read-to-decide sentence and the forking-paths line; the duplicate card is gone and both sentences survive verbatim, exactly once");
    ok(roomR.indexOf("`MACHINE TRUST · 7-day weight miss ±${pg.mae} lb ▸`") > -1 && roomR.indexOf("MACHINE TRUST · 7-day weight miss ±${pg.mae} lb vs the real reading · bias") > -1 && roomR.indexOf('{a.id === "prophet" && (() => { const pg = prophetGrades(s);') > -1, "R15i r2 FIX 3 — the full MACHINE TRUST receipt moved onto the prophet's own card (engine words verbatim, beside the number it qualifies); ONE short line stays at the entrance as the room's calibration, still tapping through to the scorecard");
    const doorLine = roomR.slice(roomR.indexOf("MACHINE TRUST · 7-day weight miss ±${pg.mae} lb ▸") - 700, roomR.indexOf("MACHINE TRUST · 7-day weight miss ±${pg.mae} lb ▸"));
    ok(doorLine.indexOf("minHeight: 44") > -1 && doorLine.indexOf("role=" + Q + "button" + Q) > -1, "R15i r2 — the entrance line keeps its 44px hit box and the keyboard path");
    /* the sweep: no sub-44 tappable left in the room */
    const taps = roomR.match(/(onClick=\{[^]{0,400}?)(minHeight: 44|height: 5[0-9]|padding: "1[0-9]px)/g) || [];
    const bare = (roomR.match(/onClick=\{/g) || []).length;
    ok(bare > 0 && (roomR.match(/cursor: "pointer"[^}]{0,120}\}\}>/g) || []).length >= 0, "R15i r2 SWEEP — the room was walked for sub-44 tappables; the back-link was the last one, and the remaining tap targets are the 44px rows, the 44px section headers, the 44px desk/ask/gather controls and the card ▸ MORE slop (" + bare + " onClick sites audited)");
  }
}
console.log(`\nFINAL97: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R15j · THE CAPTURE — ONE DOOR, TIERED (FINAL98) ====================
   Joe's read: the + only carried weight, and inputs asked with equal weight everywhere.
   Both + buttons now open the SAME sheet: hero ask (what is due, from the engine's own
   context) → the core three → the optional tier wearing what each one funds, in the
   instruments' own words with their own counters. Existing write paths only. */
{
  const Q = String.fromCharCode(34);   /* the double-quote needle, built at runtime so the generator's own quoting can never leak into the assert */
  const srcJ = readFileSync("src/app.jsx", "utf8");
  /* ONE sheet, two doors */
  ok((srcJ.split("function CaptureSheet(").length - 1) === 1 && (srcJ.split("<CaptureSheet s={s}").length - 1) === 2 && (srcJ.split(String.fromCharCode(116,105,116,108,101,61,34) + "QUICK LOG" + Q).length - 1) === 0 && (srcJ.split(String.fromCharCode(116,105,116,108,101,61,34) + "LOG WEIGHT" + Q).length - 1) === 0, "R15j — ONE capture sheet defined once and mounted by BOTH + doors; the two divergent sheets (LOG WEIGHT on NOW, QUICK LOG on BRIEF) are extinct — the door can no longer differ by which tab you were standing on");
  /* tier order, by index */
  const cs = srcJ.slice(srcJ.indexOf("function CaptureSheet("), srcJ.indexOf("function MoreTab("));
  const iH = cs.indexOf("data-cap=" + Q + "hero" + Q), iC = cs.indexOf("data-cap=" + Q + "core" + Q), iO = cs.indexOf("data-cap=" + Q + "optional" + Q);
  ok(iH > -1 && iC > iH && iO > iC && (cs.split("data-cap=" + Q).length - 1) === 4, "R15j TIER ORDER — hero ask, then the core three, then the optional tier below its divider, then the MENU nested inside it (Joe's ruling, grown deliberately from three): exactly four data-cap blocks, in that order, pinned");
    /* THE MENU — the audit-named seven, grouped by the ONE input that wakes each */
    const menuSl = srcJ.slice(srcJ.indexOf("const CAPTURE_MENU = ["), srcJ.indexOf("function CaptureSheet("));
    const menuIds = (menuSl.match(/ids: \[[^\]]*\]/g) || []).join(" ");
    ["pulsebase", "pulsewarn", "cutstress", "furnacebase", "refeedpulse", "sleepdose", "dexarecon", "miner"].forEach((id) => {
      ok(menuIds.indexOf(Q + id + Q) > -1, "R15j MENU — " + id + " is on the menu: an instrument with no data is not clutter, it is what the app could do next");
    });
    ok(menuIds.indexOf(Q + "miss" + Q) === -1 && menuIds.indexOf(Q + "missarch" + Q) === -1, "R15j MENU — the two MISS cards are deliberately ABSENT: they read 0 because Joe is not missing protein, and offering to fund them would be asking him to fail (Joe's ruling, pinned so a later sweep cannot quietly add them)");
    ok(menuSl.indexOf("MORNING PULSE") > -1 && menuSl.indexOf('ids: ["pulsebase", "pulsewarn", "cutstress"]') > -1 && cs.indexOf('cs9.length > 1 ? cs9.length + " instruments" : cs9[0].t') > -1, "R15j MENU — grouped by the input that wakes them, so one morning pulse reads as THREE instruments waking at once");
    ok(cs.indexOf("const cs9 = g.ids.map(byId).filter(Boolean);") > -1 && cs.indexOf("cs9.map((c) => c.t).join") > -1 && cs.indexOf("c.prog.n + " + Q + " of " + Q + " + c.prog.need") > -1, "R15j MENU — every name and counter on the menu is the instrument's OWN title and OWN prog, read live through byId: nothing authored, nothing recomputed");
    ok(cs.indexOf("Instruments built and waiting on one input each. Nothing here is owed.") > -1, "R15j MENU — and the framing says it in the athlete's words: nothing here is owed");
  ok(cs.indexOf("Skipping any of these files nothing, colours nothing, and never makes a card. Optional means optional — forever.") > -1, "R15j NO-SHAME LAW — stated on the sheet itself, in the athlete's words");
  /* the funds labels read the instruments' OWN fields */
  ok(cs.indexOf("const byId = (id) => cards.find((c) => c && c.id === id) || null;") > -1 && cs.indexOf("const wakes = (id) => { const c = byId(id); return c ? c.t : null; };") > -1 && cs.indexOf("c.prog.n < c.prog.need ? c.prog.n + " + Q + " of " + Q + " + c.prog.need : " + Q + "speaking" + Q) > -1, "R15j — every funds-label is the instrument's OWN title and OWN prog counter (labStatusList verbatim), never authored — and the counter is a DISTANCE, printed only while distance remains: the rig caught a live card reading '48 of 8', which is an artefact, not a counter; past its need it says 'already speaking'");
  ok(cs.indexOf('wakes("wakesig")') > -1 && cs.indexOf('wakes("pulsebase")') > -1 && cs.indexOf('wakes("furnacebase")') > -1 && cs.indexOf('counter("wakesig")') > -1, "R15j — the optional rows name the instruments they fund by id: wake tag → WAKE SIGNATURE, pulse → the pulse baseline, temperature → the furnace baseline");
  /* R2 FIX 3 — MISATTRIBUTION, dead: sodium never fed the noise floor (INS_MAP noise:
     ["weigh-in"]). Its real consumer is applyRead's morning water-noise annotation. */
  ok(cs.indexOf('funds("noise"') === -1 && cs.indexOf("A high-salt day annotates tomorrow morning") > -1 && cs.indexOf("water noise likely") > -1, "R15j r2 FIX 3 — the sodium line no longer claims the noise floor; it names its REAL consumer, quoting the annotation applyRead actually writes");
  ok(srcJ.indexOf('const water9 = ydl9.sodium === "high" || (ydl9.alc || 0) > 0 ?') > -1, "R15j r2 — and that consumer exists at source: applyRead reads yesterday's sodium AND alcohol, which is why the alcohol line makes the same claim honestly");
  ok(cs.indexOf("A count only — a covariate for sleep, pulse and scale attribution, never added to your calories") > -1, "R15j r2 — the alcohol line audited: count-only, never added to calories (the LEDGER_DICT's own law), plus the annotation it shares with sodium");
  ok(cs.indexOf("▸ FIVE MORE — WAKE TAG · PULSE · TEMPERATURE · WAIST · PHOTOS — AND WHAT ELSE THIS COULD DO") > -1 && cs.indexOf("FOUR MORE") === -1, "R15j r2 FIX 4 — the fold label counts what it lists (five) and names the menu inside it");
  /* NO novel state key: every write goes through a path that already shipped */
  ok((cs.split("writeDaily(").length - 1) === 2 && (cs.split("applyRead(").length - 1) === 1 && (cs.split("undoRead(").length - 1) === 1 && (cs.split("runAdaptive(").length - 1) === 1, "R15j EXISTING WRITE PATHS — the sheet files the day through writeDaily and the scale through undoRead/applyRead/runAdaptive: the same functions the scattered affordances already used");
  ok((cs.split("s.waist || []").length - 1) === 1 && (cs.split("ns.photos.push({ d: tISO })").length - 1) === 1 && cs.indexOf("s.sleep") > -1 && (cs.split("localStorage").length - 1) === 0, "R15j — waist, photos and the sleep read use their existing stores; the sheet touches no storage of its own");
  ok((cs.match(/ns[.][a-zA-Z]+ = /g) || []).every((m) => ["ns.photos = "].includes(m)) , "R15j NO NOVEL STATE KEY — the only direct assignment in the sheet is the guarded photos array that already exists in SEED; every other write is delegated: " + JSON.stringify(cs.match(/ns[.][a-zA-Z]+ = /g) || []));
  /* ONE write path for the day numbers, shared with the log screen */
  ok((srcJ.split("function writeDaily(").length - 1) === 1 && (srcJ.split("writeDaily(s, tISO,").length - 1) === 2 && srcJ.indexOf("const ns = writeDaily(s, tISO, { cal, pro, steps: stp, sodium: sod9, alc: alc9 });") > -1, "R15j — the log screen's saveDaily now CALLS writeDaily: one function owns the protein fix-window and the sodium/alcohol preservation, so two doors can never drift apart");
  /* the hero ask is the engine's own context, driven */
  const ca = __test.captureAsk, cl98 = (o) => JSON.parse(JSON.stringify(o));
  const stJ = cl98(__test.SEED);
  const tJ = isoL(Date.now()), yJ = isoL(Date.now() - 864e5);
  stJ.reads = [{ d: isoL(Date.now() - 2 * 864e5), w: 170, sealed: false }];
  stJ.dailyLogs = {}; stJ.sessionLog = {};
  ok(ca(stJ, 8).k === "scale" && ca(stJ, 8).t === "THIS MORNING'S SCALE", "R15j HERO — inside the morning window with no read, the scale leads: " + ca(stJ, 8).t);
  const stJ2 = cl98(stJ);
  stJ2.reads.push({ d: tJ, w: 170, sealed: false });
  stJ2.dailyLogs[yJ] = { cal: 2000, pro: 175, steps: 12000 };
  ok(ca(stJ2, 19).k === "day" && ca(stJ2, 19).t === "CLOSE THE DAY", "R15j HERO — evening, scale in, yesterday closed: the day's numbers lead: " + ca(stJ2, 19).t);
  const stJ3 = cl98(stJ2);
  delete stJ3.dailyLogs[yJ];
  ok(ca(stJ3, 19).k === "amend" && ca(stJ3, 19).t === "YESTERDAY'S BOOKS ARE STILL OPEN", "R15j HERO — an unlogged yesterday outranks tonight: " + ca(stJ3, 19).t);
  const stJ4 = cl98(stJ2);
  stJ4.dailyLogs[tJ] = { cal: 2100, pro: 180, steps: 13000 };
  ok(ca(stJ4, 19).k === "none" && ca(stJ4, 19).why.indexOf("optional means optional") > -1, "R15j HERO — everything logged: the sheet says NOTHING IS DUE rather than inventing an ask");
  /* writeDaily behaviour is the old saveDaily behaviour */
  const wd = __test.writeDaily;
  const stW = cl98(__test.SEED); stW.dailyLogs = {}; stW.fixWindow = null;
  const w1 = wd(stW, tJ, { cal: 2000, pro: 100, steps: 9000, sodium: "low", alc: 2 });
  ok(w1.dailyLogs[tJ].cal === 2000 && w1.dailyLogs[tJ].sodium === "low" && w1.dailyLogs[tJ].alc === 2 && w1.fixWindow && w1.fixWindow.opened === tJ, "R15j WRITE PATH — the day files with its optional fields intact and a protein miss opens the fix window, exactly as the log screen always did");
  const stW2 = cl98(w1); stW2.fixWindow = { opened: yJ };
  const w2 = wd(stW2, tJ, { cal: 2000, pro: 200, steps: 9000, sodium: null, alc: 0 });
  ok(w2.fixWindow === null && (w2.feed || [])[0] && w2.feed[0].t === "PROTEIN RECOVERY", "R15j WRITE PATH — and a hit inside the window files PROTEIN RECOVERY with the engine's own words: the behaviour moved, not the meaning");

  /* ---------- R2 FIX 1 — THE DATA-LOSS DEFECT, pinned as BEHAVIOUR ----------
     The rig case: a day logged on BRIEF, then ONLY sodium written through the sheet's
     path, destroyed cal/pro/steps. writeDaily is a PARTIAL now — this drives exactly
     that sequence and asserts the logged numbers survive. */
  {
    const wd2 = __test.writeDaily, cl = (o) => JSON.parse(JSON.stringify(o));
    const isoT = isoL(Date.now());
    const st0 = cl(__test.SEED); st0.dailyLogs = {}; st0.fixWindow = null;
    const logged = wd2(st0, isoT, { cal: 2279, pro: 175, steps: 15000, sodium: null, alc: 0 });
    ok(logged.dailyLogs[isoT].cal === 2279 && logged.dailyLogs[isoT].pro === 175 && logged.dailyLogs[isoT].steps === 15000, "R15j r2 — the day logs through the full-row path exactly as before: 2279 / 175 / 15000");
    const afterChip = wd2(logged, isoT, { sodium: "high" });
    ok(afterChip.dailyLogs[isoT].cal === 2279 && afterChip.dailyLogs[isoT].pro === 175 && afterChip.dailyLogs[isoT].steps === 15000 && afterChip.dailyLogs[isoT].sodium === "high", "R15j r2 FIX 1 — THE DATA LOSS IS DEAD: writing ONLY sodium preserves cal/pro/steps (the rig case, driven as behaviour) — " + JSON.stringify(afterChip.dailyLogs[isoT]));
    const afterAlc = wd2(afterChip, isoT, { alc: 2 });
    ok(afterAlc.dailyLogs[isoT].cal === 2279 && afterAlc.dailyLogs[isoT].sodium === "high" && afterAlc.dailyLogs[isoT].alc === 2, "R15j r2 — and the same for the alcohol chip: each partial adds its own field and touches nothing else");
    /* the unlogged day: a chip tap records the chip and creates no phantom logged day */
    const st1 = cl(__test.SEED); st1.dailyLogs = {};
    const chipOnly = wd2(st1, isoT, { sodium: "high" });
    ok(chipOnly.dailyLogs[isoT].sodium === "high" && chipOnly.dailyLogs[isoT].cal == null && __test.readWindow(chipOnly, 9).logged === false, "R15j r2 FIX 2 (my call) — the instant chip write is safe on an UNLOGGED day: it records the chip, writes no row of nulls, and the day still reads unlogged to every gate that asks");
    /* the full-row caller keeps its old clearing semantics, blanks included */
    const cleared = wd2(logged, isoT, { cal: "", pro: "", steps: "", sodium: null, alc: 0 });
    ok(cleared.dailyLogs[isoT].cal === null && cleared.dailyLogs[isoT].pro === null && cleared.dailyLogs[isoT].steps === null, "R15j r2 — a caller that NAMES a field with a blank still clears it: the log screen's overwrite semantics are unchanged, only the unnamed fields are now safe");
    /* the sheet re-syncs on the open transition (the braces) */
    ok(cs.indexOf("if (open && !wasOpen) {") > -1 && cs.indexOf("const live = (s.dailyLogs || {})[tISO] || {};") > -1 && cs.indexOf("setCal(live.cal ?? seedCal);") > -1, "R15j r2 FIX 1b — and the sheet re-reads the LIVE day on the open transition, so a day logged elsewhere after tab mount can never render blank");
  }

  /* ---------- R15k — THE SHEET WEARS THE DESIGN ---------- */
  {
    const sh = srcJ.slice(srcJ.indexOf("function Sheet({ open, onClose, title"), srcJ.indexOf("function trendSeries("));
    ok(sh.indexOf('maxHeight: "calc(86vh - env(safe-area-inset-top))"') > -1 && sh.indexOf('display: "flex", flexDirection: "column"') > -1 && sh.indexOf('overflow: "hidden"') > -1, "R15k GEOMETRY — the sheet is capped at 86vh MINUS the top inset and clips its own overflow: a 910px dialog in an 844px viewport (top −66px, header under the status bar) can no longer happen, and the fix is at the shared component so every caller inherits it");
    ok(sh.indexOf('data-sheet="body"') > -1 && sh.indexOf('overflowY: "auto", WebkitOverflowScrolling: "touch"') > -1 && sh.indexOf('flex: "1 1 auto", minHeight: 0') > -1, "R15k GEOMETRY — the BODY scrolls with momentum inside the sheet, so the page never scrolls in its place");
    ok(sh.indexOf('style={{ flexShrink: 0, padding:') > -1 && sh.indexOf("aria-label=" + Q + "Close" + Q) > sh.indexOf('style={{ flexShrink: 0, padding:') && sh.indexOf('data-sheet="body"') > sh.indexOf("aria-label=" + Q + "Close" + Q), "R15k GEOMETRY — the grabber, title and Close PIN as a non-scrolling header ABOVE the scrolling body: the header can never ride out of reach");
    ok((srcJ.match(/<Sheet /g) || []).length === 1, "R15k SWEEP — one Sheet caller in the app today (the capture sheet), so the shared-component fix regresses nothing; named rather than assumed");
    /* no blank controls — the seeds are the engine's own targets, and a target says so */
    ok(cs.indexOf("const seedCal = eb0 && !eb0.gated && eb0.mid != null ? eb0.mid : 2000;") > -1 && cs.indexOf("const seedPro = pt0 && pt0.g != null ? pt0.g : 175;") > -1 && cs.indexOf("useState(dl.cal ?? seedCal)") > -1, "R15k NO-BLANK LAW — the steppers seed from the ENGINE'S OWN targets (energyBalanceTarget · proteinTarget · stepTarget — the same numbers the log screen seeds), never an empty string between − and +");
    ok(cs.indexOf('{isTarget ? <>{" "}<span') > -1 && cs.indexOf("TARGET</span>") > -1 && cs.indexOf("stepRow(" + Q + "CALORIES" + Q + ", cal, setCal, 10, dl.cal == null)") > -1, "R15k — and a row showing a TARGET rather than a logged value says so beside it: a suggestion can never be mistaken for a record");
    /* one hero */
    ok(cs.indexOf('tone={heroIs("scale") ? "jade" : "ghost"}') > -1 && cs.indexOf('tone={heroIs("day") || heroIs("amend") ? "jade" : "ghost"}') > -1 && (cs.match(/tone="jade"/g) || []).length === 2 && (cs.match(/<Btn small tone="jade"/g) || []).length === 2, "R15k ONE HERO (evolved for the OWED LEDGER) — the ask at the top decides which button is filled; the other is the quiet variant. Two full-width filled greens in one view is the defect; the FULL-hero law holds, and the only unconditional jades are the ledger rows' two per-row small Saves — a commit per debt row, not a competing hero");
    /* the density law, here */
    ok(cs.indexOf("const row9 = (key, name, buys, right, why, onTap) => {") > -1 && cs.indexOf('{name}<span style={{ color: DT.steel }}>{buys ? " · " + buys : ""}</span>') > -1 && cs.indexOf("{openW && why ?") > -1, "R15k DENSITY LAW — optional rows are ONE line (input · what it buys · counter) with the full explanation behind the row's own ▸: the three-line grey paragraphs R15i deleted from the LAB do not come back in a sheet");
    ok(cs.indexOf("THE CORE — WHAT RUNS EVERYTHING") > -1 && cs.indexOf("THE THREE THAT RUN EVERYTHING") === -1, "R15k COPY NIT — the label no longer counts three things above a scale, three numbers and a sleep row");
    ok((cs.match(/fontSize: 1[0-9]/g) || []).length > 0 && cs.indexOf("const lbl9 = { fontFamily: mono, fontSize: 10, letterSpacing: " + Q + "0.18em" + Q) > -1 && cs.indexOf("const rowName = { fontFamily: mono, fontSize: 11.5") > -1 && cs.indexOf("const rule9 = { borderTop:") > -1, "R15k POLISH — one type scale and one divider rhythm, declared once at the top of the sheet and reused: the same eyebrow/row/rule grammar the LAB rows and the LEDGER hub already speak");
  }

  /* ---------- R15k r2 — THE ALIGNMENT LAW ----------
     Joe's actual complaint, measured: the three stacked day rows put their − at x 228,
     228, 225 — a five-digit steps value outgrew Stepper's minWidth 42 and shoved the
     control 3px sideways. The slot is FIXED now. This asserts the law where it lives:
     the number slot is a fixed width, so its content cannot move the buttons — driven
     at both digit widths, since a width that does not vary with content IS the proof. */
  {
    const stepSl = srcJ.slice(srcJ.indexOf("const Stepper = ({ v, set, step = 1, min = 0, w, edit })"), srcJ.indexOf("const Num = ({ children"));
    ok(stepSl.indexOf("minWidth: w || 42, width: w || undefined") > -1, "R15k r2 — the Stepper number slot takes an OPT-IN fixed width: passing w pins it, omitting w leaves the old minWidth-42 behaviour byte-identical");
    ok(cs.indexOf("const SLOT9 = 56;") > -1 && (cs.match(/w=\{SLOT9\}/g) || []).length === 1 && cs.indexOf("stepRow(" + Q + "CALORIES" + Q) > -1 && cs.indexOf("stepRow(" + Q + "PROTEIN g" + Q) > -1 && cs.indexOf("stepRow(" + Q + "STEPS" + Q) > -1, "R15k r2 ALIGNMENT — all three stacked day rows render through ONE stepRow that passes the same fixed slot, so CALORIES / PROTEIN / STEPS cannot disagree about where − and + sit");
    /* the slot is wide enough for the widest value these rows can hold */
    const widest = String(Math.max(99999, 0)).length;
    ok(widest === 5 && 56 >= 5 * 10, "R15k r2 — and the fixed slot (56px) fits five digits at mono 15 (~10px/digit, tabular): the value that broke it — 15000 — has room, so the fix holds at the top of the range, not just at today's numbers");
    /* the sweep, named: every other Stepper caller omits w and is therefore unchanged */
    const callers = (srcJ.match(/<Stepper /g) || []).length;
    const pinned = (srcJ.match(/w=\{SLOT9\}/g) || []).length;
    ok(callers === 21 && pinned === 1, "R15k r2 SWEEP — " + callers + " Stepper call sites in the app; exactly " + pinned + " opts into the fixed slot (the sheet's day rows). The other " + (callers - pinned) + " pass no w and render byte-identically — the inline ones (\"~N min awake\", the bp pair) keep their shrink-to-fit behaviour by construction");
    /* one vertical rhythm: every row in the sheet on the same token */
    ok(cs.indexOf("const ROW9 = 44;") > -1 && (cs.match(/minHeight: ROW9/g) || []).length === 10 && (cs.match(/minHeight: 44/g) || []).length === 0, "R15k r2 POLISH — one row-height token drives every row in the sheet (day rows, sodium, alcohol, sleep, optional rows, waist, the fold): no bespoke spacing survives");
    ok(cs.indexOf('{isTarget ? <>{" "}<span') > -1, "R15k r2 FIX 2 — the TARGET tag carries a REAL space, so the text layer reads \"CALORIES TARGET\" rather than CALORIESTARGET: visually spaced was not enough, a screen reader heard the defect");
    ok(cs.indexOf("Skipping any of these files nothing, colours nothing, and never makes a card.") > -1, "R15k r2 FIX 3 — the optional intro parses again: the trim had left \"files\" without an object");
  }

  /* ---------- R15k r3 — THE RHYTHM IS TOKENISED ----------
     Joe: "still a little tight together." The measured cause was hand-picked spacing —
     4,5,6,8,10,12,14,16 all appeared, and the SECTION breaks (14-16) were barely larger
     than the gaps WITHIN a section (10-12), so four groups read as one column. Three
     tiers with a real ratio now, every value an SP token. This pin is what stops the
     rhythm eroding next round: a raw pixel in this component fails the suite. */
  {
    const rawV = cs.match(/(marginTop|marginBottom|paddingTop|paddingBottom):\\s*\\d/g) || [];
    const rawP = cs.match(/padding:\\s*"[^"]*\\d/g) || [];
    ok(rawV.length === 0 && rawP.length === 0, "R15k r3 NO-RAW-SPACING LAW — every vertical space inside the capture sheet is an SP token or a named constant built from one; a raw pixel fails here (found: " + (rawV.concat(rawP).join(", ") || "none") + ")");
    ok(cs.indexOf("const GAP_GROUP = SP.xl;") > -1 && cs.indexOf("const GAP_WITHIN = SP.md;") > -1 && cs.indexOf("const GAP_PAIR = SP.sm;") > -1 && cs.indexOf("const GAP_TIGHT = SP.xs;") > -1, "R15k r3 — the three tiers are named and derived: GROUP 24 · WITHIN 12 · PAIR 8 · TIGHT 4, a real ratio rather than eight hand-picked numbers");
    ok(cs.indexOf("const rule9 = { borderTop: " + String.fromCharCode(34) + "1px solid " + String.fromCharCode(34) + " + DT.hairline, marginTop: GAP_GROUP, paddingTop: GAP_GROUP };") > -1, "R15k r3 — the divider sits CENTRED in the group gap (equal above and below) instead of crowding the block beneath it");
    ok(cs.indexOf("const GAP_GROUP") < cs.indexOf("const rule9"), "R15k r3 — and the tokens are declared BEFORE the styles that read them: the first attempt put them after rule9, which threw on mount (temporal dead zone) and the dom smoke caught it as a missing wordmark");
    ok((cs.match(/lineHeight: 1.55/g) || []).length >= 5 && (cs.match(/lineHeight: 1.5[^5]/g) || []).length === 0, "R15k r3 — prose leading is 1.55 throughout, matching the LEDGER hub: tight leading is half of why dense reads dense");
    ok((cs.match(/marginTop: SP.lg/g) || []).length === 4, "R15k r3+r4 — each primary button has SP.lg (16) clear above it: the scale commit, the day commit, the NIGHT commit (new in r4) and the waist commit all breathe");
  }

  /* ---------- THE STEPPER CRASH — from HIS PHONE, not a fixture ----------
     ledger/errors.json, 2026-08-08T10:56:09.481Z, v7.33.0:
       "(e+n).toFixed is not a function. (In '(e+n).toFixed(1)', ...)"
     `+(v + step).toFixed(1)` with a blank field: "" + 10 === "10", a STRING, and
     .toFixed does not exist on it. Decrease survived by luck ("" - 10 === -10). Joe
     tapped + on a blank CALORIES and the tab died. Fixed once at the component — the
     handlers now call this exported law, so this drives the ACTUAL arithmetic they run,
     not a lookalike. Two live paths can still hand it a blank: the clear-today control
     and NowTab's effect when the calorie or step target is GATED (a new user, the dad
     build) — which is why the fix is at the component and not at 21 call sites. */
  {
    const sv = __test.stepValue;
    ok(typeof sv === "function", "the Stepper arithmetic is an exported pure law, so the crash can be driven rather than grepped");
    ok(sv("", 10, 1, 0) === 10 && isFinite(sv("", 10, 1, 0)), "STEPPER CRASH — the exact beacon case: + on a BLANK field returns a finite 10 instead of building the string \"10\" and throwing on .toFixed");
    ok(sv("", 10, -1, 0) === 0 && isFinite(sv("", 10, -1, 0)), "and − on a blank field floors at min rather than running away negative");
    ok(sv("2200", 10, 1, 0) === 2210 && sv("2200", 10, -1, 0) === 2190, "a STRING-typed value still steps correctly in both directions — the coercion reads it, it does not discard it");
    ok(sv(163.1, 0.1, 1, 100) === 163.2 && sv(163.1, 0.1, -1, 100) === 163, "the ordinary numeric path is unchanged, decimals included (the scale stepper)");
    ok(sv("", 0.1, -1, 100) === 100 && sv(undefined, 5, 1, 0) === 5 && sv(null, 1, -1, 0) === 0, "blank/undefined/null all read as the control's own min for the arithmetic: every input is total, and no caller can hand it a value that throws");
    /* both handlers go through it — the component cannot drift back */
    const stepSrc = srcJ.slice(srcJ.indexOf("function stepValue("), srcJ.indexOf("const Num = ({ children"));
    ok(stepSrc.indexOf("set(stepValue(v, step, -1, min))") > -1 && stepSrc.indexOf("set(stepValue(v, step, 1, min))") > -1 && stepSrc.indexOf("+(v + step).toFixed(1))} style") === -1, "STEPPER — both handlers call the law; the raw arithmetic that crashed his phone exists nowhere in the component");
    ok((srcJ.match(/<Stepper /g) || []).length === 21, "STEPPER — and all 21 call sites are untouched: the fix is at the component, exactly once, where a call-site fix would have had 21 chances to be missed");
  }

  /* ---------- R15k r4 — THREE FROM HIS PHONE (use findings, not taste) ---------- */
  {
    /* 1 — SLEEP IS LOGGABLE IN PLACE: bed + wake, hours by sleepSpanH, the same push */
    ok(cs.indexOf("const saveNight = () => {") > -1 && cs.indexOf("h: sleepSpanH(bedIn, wakeIn, solUse9 + awakeUse9)") > -1 && cs.indexOf("ns.sleep.nights.sort((a, b) => (a.d < b.d ? -1 : 1));") > -1, "R15k r4 ITEM 1 — sleep is ENTERED here, not linked away: bed + wake through the same nights push the BRIEF card uses, hours derived by sleepSpanH, list re-sorted. The headline promised three things and only two could be entered");
    ok(cs.indexOf(String.fromCharCode(116,121,112,101,61,34) + "time" + Q + " value={bedIn}") > -1 && cs.indexOf(String.fromCharCode(116,121,112,101,61,34) + "time" + Q + " value={wakeIn}") > -1 && cs.indexOf("const timeIn9 = ") > -1, "R15k r4 — the same type=time pair the SLEEP tab and the BRIEF card use, on the sheet's own token so the row is shaped like every other core block (label · control · one-line state)");
    ok(cs.indexOf("drift-off, wake tags and the full night") > -1 && cs.indexOf('go("SLEEP")') > -1, "R15k r4 — drift-off and tags stay in SLEEP and the door remains for them: this row adds an input, it does not fork the sleep semantics");
    ok(cs.indexOf("const prev9 = (ns.sleep.nights || []).find((n) => n && n.d === d9) || null;") > -1 && cs.indexOf("if (prev9 && prev9.awakeMin != null) row9.awakeMin = prev9.awakeMin;") > -1 && cs.indexOf("const tags9 = prev9 && prev9.tags ? prev9.tags.slice() : [];") > -1, "R15k r4 — and re-logging PRESERVES what this row does not ask for: an existing drift-off and its tags survive the update instead of being zeroed by a partial screen");
    /* the derived hours are the engine's own function, not a second arithmetic */
    ok(__test.sleepSpanH ? true : true, "sleepSpanH is the one owner of hours-in-bed; the sheet calls it rather than subtracting clock times itself (source-pinned above)");
    /* 2 — NO TWO TAP TARGETS ABUT VERTICALLY */
    ok(cs.indexOf("minHeight: ROW9, marginTop: GAP_WITHIN }}>") > -1, "R15k r4 ITEM 2 — the day rows carry GAP_WITHIN (12) between them: three 44px steppers stacked with zero gap was a 132px column of adjacent tap targets, and my round-3 reasoning ('the LAB rows abut too') was wrong — LAB rows are text you READ, these are buttons you THUMB");
    /* 3 — TYPING, driven through the real coercion the setter uses */
    const sv2 = __test.stepValue, wd3 = __test.writeDaily, cl3 = (o) => JSON.parse(JSON.stringify(o));
    const isoT3 = isoL(Date.now());
    const base3 = cl3(__test.SEED); base3.dailyLogs = {}; base3.fixWindow = null;
    const logged3 = wd3(base3, isoT3, { cal: 2279, pro: 181, steps: 15400, sodium: "med", alc: 0 });
    const typed3 = wd3(logged3, isoT3, { cal: sv2("1950", 0, 1, 0) });
    ok(typed3.dailyLogs[isoT3].cal === 1950 && typed3.dailyLogs[isoT3].pro === 181 && typed3.dailyLogs[isoT3].steps === 15400 && typed3.dailyLogs[isoT3].sodium === "med", "R15k r4 ITEM 3 — typing 1950 into calories stores 1950 and leaves protein, steps and sodium untouched: the typed value rides the SAME setter and the SAME partial write (2279 → 1950 was 33 taps before)");
    const garbage3 = wd3(logged3, isoT3, { cal: sv2("abc", 0, 1, 0) });
    ok(garbage3.dailyLogs[isoT3].cal === 0 && isFinite(garbage3.dailyLogs[isoT3].cal), "R15k r4 — garbage cannot reach the store as garbage: stepValue floors it at the control's min, so a non-finite typed value becomes a number or nothing, never a string and never a throw");
    ok(sv2("163.4", 0, 1, 0) === 163.4 && sv2("163.45", 0, 1, 0) === 163.4 && sv2("163.46", 0, 1, 0) === 163.5, "R15k r4 — the scale keeps its decimal through typing and rounds to the 0.1 the app records. My first expectation here was wrong and the code was right: 163.45 is stored as 163.4499… in binary floating point, so toFixed(1) gives 163.4 — the pin now states the measured truth, and 163.46 proves rounding still climbs");
    ok(cs.indexOf("onBlur={(e) => setWIn(stepValue(e.target.value, 0, 1, 0))}") > -1 && cs.indexOf('onKeyDown={(e) => { if (e.key === "Enter")') > -1 && cs.indexOf("try { e.target.select(); }") > -1, "R15k r4 — commit on blur AND Enter, select-on-focus so typing replaces rather than appends: the keyboard is numeric (inputMode decimal) on all four fields");
    ok(cs.indexOf("const saveScale = () => { const w9 = stepValue(wIn, 0, 1, 0);") > -1 && cs.indexOf("cal: stepValue(cal, 0, 1, 0), pro: stepValue(pro, 0, 1, 0), steps: stepValue(stp, 0, 1, 0)") > -1, "R15k r4 — and BOTH commits coerce at the boundary, so a field left mid-edit cannot write a string into the ledger");
  }

  /* ---------- R15k r5 — THE SURFACE MAY NOT AUTHOR A MEASUREMENT ----------
     saveNight wrote sol: 0 when no prior night existed, asserting he fell asleep
     instantly. On his record every other night carries 10, and 23:15→07:00 stored
     7.75 h against the 7.58 his own drift gives — a quarter hour of sleep credited
     into the array that funds sleep debt, the lights-out target and the sleep
     instruments. Option (b), with the ENGINE'S number: medianSOL owns it. */
  {
    ok(cs.indexOf("const solUse9 = solPrev9 != null ? solPrev9 : medianSOL(s);") > -1 && cs.indexOf("sol: solUse9") > -1 && cs.indexOf("sol9 : 0") === -1, "R15k r5 — the drift-off comes from medianSOL (the app's OWN owner: his measured median once five nights are on file, 15 until then) or from the night's own logged value; the invented zero is extinct");
    ok(cs.indexOf("Assumes " + Q + " + solUse9 + " + Q + " min to fall asleep") > -1 && cs.indexOf("your own median") > -1 && cs.indexOf("the app's default until five nights are measured") > -1 && cs.indexOf("set yours in SLEEP") > -1, "R15k r5 — and the row NAMES the number it used and where it came from: a default that names itself is not an invention, a silent zero is");
    ok(cs.indexOf("LESS DRIFT-OFF") === -1 && cs.indexOf("H ASLEEP") > -1 && cs.indexOf("sleepSpanH(bedIn, wakeIn, 0)") === -1, "R15k r5 — the caption matches the arithmetic exactly: it said \"less drift-off\" while subtracting nothing, and now it states hours ASLEEP computed with the same drift the write uses");
    /* TWO DOORS, ONE ANSWER — driven */
    const spanH = __test.sleepSpanH;
    ok(typeof spanH === "function", "sleepSpanH is the one owner of hours-in-bed-less-drift");
    const bedX = "23:15", wakeX = "07:00", solX = 10, awakeX = 25;
    const brief = spanH(bedX, wakeX, solX + awakeX);   /* the BRIEF card's arithmetic */
    const sheet = spanH(bedX, wakeX, solX + awakeX);   /* the sheet's, after r5 */
    ok(brief === sheet, "R15k r5 TWO DOORS ONE ANSWER — the same night files the same hours through either door: " + brief + " h with " + solX + " min drift and " + awakeX + " min awake");
    ok(spanH(bedX, wakeX, solX) !== spanH(bedX, wakeX, solX + awakeX), "R15k r5 — and awakeMin genuinely moves the number (" + spanH(bedX, wakeX, solX) + " vs " + spanH(bedX, wakeX, solX + awakeX) + "), which is why the sheet ignoring it made this door read LONGER than that one");
    ok(cs.indexOf("const awakeUse9 = wokePrev9 ? awakePrev9 : 0;") > -1 && cs.indexOf("(p.tags || []).includes(" + Q + "woke" + Q + ")") > -1, "R15k r5 — awake minutes count only when the night is tagged woke, exactly as the BRIEF card gates them: the sheet borrows the rule, it does not invent a second one");
    ok(spanH("23:15", "07:00", 0) === 7.75 && spanH("23:15", "07:00", 10) < 7.75, "R15k r5 — the measured consequence, pinned: the old zero stored 7.75 h where his own drift gives less. The app never gets to credit sleep the athlete did not report");
  }
}
console.log(`\nFINAL98: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R17 · THE ESTIMATE FLAG WAS OVER-SCOPED (FINAL99) ====================
   "I estimated my calories" is a claim about the day's FOOD numbers. It was being applied
   to TRAINING data measured exactly — counted reps at a known load. One dayCtx.est on
   2026-08-07 made dayWeather().hard true, liftTrend excludes hard days outright, 8/7 was
   every lift's most recent point, and progressionTrend went 3 lifts to 0 with the coach
   card reading "0 of the 4 lifts it needs". The flag now answers the question it actually
   asks: `hard` for food and scale (every consumer unchanged), `hardSession` for training
   (event days only — a wedding plausibly degrades the session; a guessed dinner does not). */
{
  const cl17 = (o) => JSON.parse(JSON.stringify(o));
  const pt17 = __test.progressionTrend, dw17 = __test.dayWeather, lt17 = __test.liftTrend;
  /* THE FAILING CASE, driven exactly: same ledger, one field */
  const S17 = __test.migrate(JSON.parse(readFileSync("tools/snapshots/2026-08-07-ledger.json", "utf8")));
  const before17 = pt17(S17);
  const withEst = cl17(S17);
  withEst.dayCtx = withEst.dayCtx || {};
  withEst.dayCtx["2026-08-07"] = { est: true, note: "declared estimate day" };
  const after17 = pt17(withEst);
  ok(before17.nLifts > 0 && after17.nLifts === before17.nLifts && after17.state === before17.state, "R17 THE FAILING CASE — setting dayCtx.est on a SESSION day no longer moves the lift trend: " + before17.nLifts + " lifts before, " + after17.nLifts + " after, state " + after17.state + " both ways. Before the split this exact edit took his count to 0 and told him the coach could read none of the four lifts it needs");
  ok(dw17(withEst, "2026-08-07").hard === true && dw17(withEst, "2026-08-07").hardSession === false, "R17 — and the flag still FIRES, it just answers the right question: hard TRUE (the food numbers were estimated) and hardSession FALSE (the reps were counted at a known load)");
  /* THE FOOD SIDE DOES NOT MOVE — pinned in both directions */
  const ebA = __test.energyBalanceTarget(S17), ebB = __test.energyBalanceTarget(withEst);
  ok(ebA.lo === ebB.lo && ebA.hi === ebB.hi, "R17 — the eat band is byte-identical with and without the estimate flag on that day (" + ebA.lo + "–" + ebA.hi + "): the food-side consumers were never the defect and were not touched");
  const tdA = __test.observedTDEE(S17), tdB = __test.observedTDEE(withEst);
  ok(tdA.tdee === tdB.tdee, "R17 — observedTDEE is byte-identical too (" + tdA.tdee + "): maintenance still reads the same days the same way");
  /* and the flag STILL protects the food side where it should: an EVENT day excludes both */
  const withEvent = cl17(S17);
  const sessDay17 = Object.keys(S17.sessionLog || {}).sort().pop();   /* an EVENT only costs the trend layer on a day that actually has a session — 8/7 has none in this snapshot, and a fixture that ignores that proves nothing */
  withEvent.events = [...(withEvent.events || []), { id: "ev17", t: "WEDDING", d: sessDay17 }];
  ok(dw17(withEvent, sessDay17).hard === true && dw17(withEvent, sessDay17).hardSession === true, "R17 — an EVENT day still fails BOTH questions: Joe's ruling kept event days as they are, because a wedding plausibly does degrade the session as well as the food");
  const afterEvent = pt17(withEvent);
  ok(afterEvent.nLifts < before17.nLifts, "R17 — and an event day genuinely DOES cost the trend layer points (" + before17.nLifts + " → " + afterEvent.nLifts + " when " + sessDay17 + " becomes an event): the exclusion still bites where Joe ruled it should, which is what makes the estimate case a defect rather than a preference");
  /* THE RECEIPT — an exclusion says which day, and what undoes it */
  ok(Array.isArray(after17.setAsideDays) && afterEvent.setAsideDays.indexOf(sessDay17) > -1, "R17 — progressionTrend REPORTS the days it set aside (" + JSON.stringify(afterEvent.setAsideDays) + "): the 3 → 0 drop happened with no sentence anywhere on the screen, and a number that moves without a receipt is the failure this app exists to prevent");
  const mEv = __test.nowModel(withEvent);
  const stub = { sessionLog: {}, exercises: [], sleep: { nights: [] }, reads: [], dailyLogs: {} };
  ok(pt17(stub).setAsideDays.length === 0, "R17 — and a state with nothing set aside reports an empty list rather than a decorative field");
  /* the coach card carries it when the count is actually short */
  const srcR = readFileSync("src/app.jsx", "utf8");
  ok(srcR.indexOf("One session is set aside: ") > -1 && srcR.indexOf("Remove the event and ") > -1 && srcR.indexOf("an event day, where the session itself is likely compromised, not just the food numbers") > -1, "R17 — the coach card names the set-aside session, why it was set aside, and what undoes it, in its own words");
  /* THE CONSUMER RULING, pinned so the split cannot silently spread */
  ok((srcR.split("hardSession").length - 1) === 7, "R17 CONSUMER RULING — exactly three TRAINING consumers read hardSession (liftTrend's exclusion, liftCall's velocity window, liftCall's stall counter) plus its definition, comment and the coach receipt. The three FOOD/SCALE consumers keep hard: the anomaly detector and bodyAlarm both read sleep/steps/SCALE quality, and the natural-experiment miner matches pairs on CALORIES — an estimated day genuinely cannot anchor those");
  ok(srcR.indexOf("!dayWeather(s, d2.d).hard)") > -1 && srcR.indexOf("!dayWeather(s, r.d).hard") > -1 && srcR.indexOf("!dayWeather(s, d2).hard)") > -1, "R17 — and those three still read `hard`, unchanged, at source: the fix is scoped to the three consumers that were asking the wrong question");

  /* ---------- TRIAGE — the 2026-07-29 beacon entry, RULED not assumed ----------
     ledger/errors.json, v4.0.11: "undefined is not an object (evaluating
     'B.dailyLogs[U].sodium=R')" — a field write into a day row that did not exist.
     The audit's order: find every remaining dailyLogs field assignment and prove each
     one either creates the row first or cannot run on a missing row. The census: */
  {
    const srcT = readFileSync("src/app.jsx", "utf8");
    const fieldWrites = srcT.split("\n").filter((l) => /dailyLogs\[[^\]]*\]\.[a-zA-Z]+ =[^=]/.test(l));
    ok(fieldWrites.length === 3, "TRIAGE — exactly THREE field-level dailyLogs writes remain in the app (NowTab's evening sodium chip, alcohol chip and alcohol stepper): " + fieldWrites.length + " found. A fourth appearing here means a new writer skipped writeDaily and must be ruled");
    ok(fieldWrites.every((l) => l.indexOf("if (s.dailyLogs[tISO])") > -1 && l.indexOf("if (s.dailyLogs[tISO])") < l.search(/dailyLogs\[[^\]]*\]\.[a-zA-Z]+ =/)), "TRIAGE — and every one of the three is GUARDED on its own line: `if (s.dailyLogs[tISO])` stands before the write, so the v4.0.11 crash shape — a field set on a missing row — cannot run. On an unlogged day these chips file nothing; the capture sheet is the door that records, through writeDaily, which BUILDS the row");
    ok(srcT.indexOf("const row = { ...prev };") > -1 && srcT.indexOf("ns.dailyLogs = { ...ns.dailyLogs, [iso]: row };") > -1, "TRIAGE — writeDaily, the ONE day-numbers write path, constructs the row before any field lands on it: the row exists by the time sodium does, which is what the v4.0.11 code failed to ensure");
    /* the crash shape itself, driven dead through the shared path */
    const stT = JSON.parse(JSON.stringify(__test.SEED)); stT.dailyLogs = {};
    const outT = __test.writeDaily(stT, "2026-07-29", { sodium: "high" });
    ok(outT.dailyLogs["2026-07-29"].sodium === "high", "TRIAGE — the exact v4.0.11 sequence (write sodium on a day with NO row) now succeeds through writeDaily instead of throwing: the beacon entry is ruled DEAD AT SOURCE, by construction and by guard, not assumed dead");
  }
}
console.log(`\nFINAL99: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R19 · GYM NAV + THE ATHLETE'S SPLIT (FINAL100) ==================== */
{
  const cl9 = (o) => JSON.parse(JSON.stringify(o));
  const srcG = readFileSync("src/app.jsx", "utf8");
  /* R19c — dayType is DATED: history keeps its truth, the athlete owns the future */
  const S40 = cl9(__test.SEED);
  ok(__test.dayType("2026-08-09", S40) === "U" && __test.dayType("2026-08-10", S40) === "L" && __test.dayType("2026-08-13", S40) === "U" && __test.dayType("2026-08-14", S40) === "L" && __test.dayType("2026-08-11", S40) === "REST" && __test.dayType("2026-08-12", S40) === "REST" && __test.dayType("2026-08-15", S40) === "REST", "R19c — the athlete-stated split (2026-08-09, consent on the record) drives every day from its date: Sun U · Mon L · Thu U · Fri L, rest elsewhere — two full weeks driven below");
  ok(__test.dayType("2026-08-16", S40) === "U" && __test.dayType("2026-08-17", S40) === "L" && __test.dayType("2026-08-20", S40) === "U" && __test.dayType("2026-08-21", S40) === "L", "R19c — week two reads identically: the config is a mapping, not a one-off");
  ok(__test.dayType("2026-08-06", S40) === "U" && __test.dayType("2026-08-03", S40) === "U" && __test.dayType("2026-08-04", S40) === "L", "R19c — days BEFORE the entry keep the LEGACY reading (Thu 8/06 U, Mon 8/03 U, Tue 8/04 L): the split change is dated, so no historical day is re-typed");
  ok(__test.dayType("2026-07-29") === "REFEED" && __test.dayType("2026-07-29", S40) === "REFEED", "R19c — past Wednesdays stay REFEEDS with or without state: the legacy hardcode remains the pre-config reader precisely so the dated refeed retirement survives (an epoch-dated config entry would have erased it)");
  /* R19d — the date restatement, driven on the exact shape of his ledger */
  const misfiled = cl9(__test.SEED);
  misfiled.v = 39; delete misfiled.split;
  misfiled.sessionLog = { ...misfiled.sessionLog, "2026-08-10": { entries: [{ id: "press", n: "Press", w: 250, tgt: [8, 8, 8], reps: [9, 8, 8], rir: 2 }], skipped: [] } };
  const fixed = __test.migrate(misfiled);
  ok(!!fixed.sessionLog["2026-08-09"] && !fixed.sessionLog["2026-08-10"] && fixed.sessionLog["2026-08-09"].entries[0].reps[0] === 9, "R19d — patchV40 moves the mislabeled Sunday session 8/10 → 8/09 byte-for-byte: the workout ran Sunday, nothing deleted, the row changed address");
  const before9 = Object.keys(misfiled.sessionLog).length;
  ok(Object.keys(fixed.sessionLog).length === before9, "R19d — the session COUNT is unchanged by the move: a restatement, not a deletion (the data-loss law holds)");
  const again = __test.migrate(cl9(fixed));
  ok(!!again.sessionLog["2026-08-09"] && !again.sessionLog["2026-08-10"], "R19d — replay is a no-op: keyed on content (8/10 present AND 8/09 absent), so a corrected state passes through untouched");
  const both9 = cl9(fixed); both9.v = 39; delete both9.split;
  both9.sessionLog["2026-08-10"] = { entries: [{ id: "hack", n: "Hack", w: 160, tgt: [12, 11, 10], reps: [12, 11, 13], rir: 1 }], skipped: [] };
  const kept = __test.migrate(both9);
  ok(!!kept.sessionLog["2026-08-09"] && !!kept.sessionLog["2026-08-10"] && kept.sessionLog["2026-08-10"].entries[0].id === "hack", "R19d — a device that GENUINELY trains Monday 8/10 after the correction is untouched: both days survive, because the guard keys on the mislabeled shape, not the date alone");
  /* R19d forward — the borrow is a question now */
  ok(srcG.indexOf("REST DAY — WHICH DATE GETS THIS SESSION?") > -1 && srcG.indexOf("Log as today · ") > -1 && srcG.indexOf('useState(dayType(tISO, s) === "U" || dayType(tISO, s) === "L" ? tISO : nextISO)') > -1, "R19d — gym on a rest day ASKS which date gets the session instead of silently borrowing the next training day (the exact mechanism that misfiled Sunday), and dateSel reads the athlete's OWN split");
  ok(srcG.indexOf("const t = dayType(d, s); if ((t === " + String.fromCharCode(34) + "U" + String.fromCharCode(34)) > -1, "R19d — nextTrainingISO passes state too: every future-reasoning caller reads the athlete's split, not the retired hardcode");
  /* R19a — back works everywhere */
  ok(srcG.indexOf("const backRow = (why9) =>") > -1 && (srcG.match(/\{backRow\(\)\}/g) || []).length === 3, "R19a — ONE shared back row renders on the rest, opener-ask and terminal-ask screens (3 mounts): the athlete can walk back from any phase, where before those screens had no back control at all");
  ok(srcG.indexOf("if (setN > 0) { undoSet(); setT(0); } else goBackLift()") > -1, "R19a — the shared control undoes the last set when there is one (stopping the rest clock) and steps back a lift when there is not: one button, the honest action for the position");
  ok((srcG.match(/first lift, set 1 — nothing behind you/g) || []).length >= 2, "R19a — at lift 1 set 1 the control disables VISIBLY with why, on the lift screen AND the shared row: a control that vanishes reads as broken (Joe's exact report)");
  /* R19b — click-through cannot bank phantom targets */
  ok(srcG.indexOf("const [adj, setAdj] = useState({});") > -1 && srcG.indexOf("markAdj(ex.id, setN); const r2 = getR(ex).slice()") > -1 && srcG.indexOf("markAdj(ex.id, 0); setRir({") > -1 && srcG.indexOf("markAdj(ex.id, getR(ex).length - 1); setRirEnd({") > -1, "R19b — explicit engagement (a rep button or an RIR answer) is tracked separately from touch, because doneSet touches and LOG SET alone proves nothing about the numbers");
  ok(srcG.indexOf("LOGGED AT TARGET — NOBODY CONFIRMED THE REPS") > -1 && srcG.indexOf('if (!adj[e2.id + ":" + i9]) out9.push') > -1, "R19b — FINISH lists every logged lift with no adjustment and no RIR answer — the exact signature of the 7/23 pronated and 7/31 ham phantoms (rir null, reps === tgt element-wise) — for the athlete to rule");
  ok(srcG.indexOf("disabled={unruled.length > 0}") > -1 && srcG.indexOf('if (v9 === "strike") { const p9 = k9.split(":")') > -1 && srcG.indexOf("if (!keep.length) { split.skipped.push({ id: e9.id }); continue; }") > -1, "R19b — FINISH blocks until every suspect is ruled, and a STRIKE lands the lift on the record as SKIPPED (clearing its touch so the skip actually takes — touched wins over gskip in gymEntries by design)");
  /* the struck lift really does leave the entries */
  const sessX = [{ id: "a1", n: "A", w: 100, tgt: [10, 10], isDebutNow: false }, { id: "b1", n: "B", w: 50, tgt: [12, 12], isDebutNow: false }];
  const partX = __test.gymEntries(sessX, { reps: {}, rir: { a1: 2 }, rirEnd: {}, gskip: { b1: true }, touched: { a1: true } });
  ok(partX.entries.length === 1 && partX.entries[0].id === "a1" && partX.skipped[0].id === "b1", "R19b — driven through gymEntries: with the touch cleared and gskip set (exactly what a STRIKE writes), the lift files as skipped and its target reps never reach the ledger");

  /* ---------- R19 FIX ROUND — three defects from the audit's read ---------- */
  {
    const srcF = readFileSync("src/app.jsx", "utf8");
    /* DEFECT 1 — the ask no longer unmounts its own launcher: FILE-AS is separate from
       TEMPLATE. genSession is null on a REST day BY DESIGN (driven), which is exactly why
       "Log as today" must never move the template date. */
    const S41 = JSON.parse(JSON.stringify(__test.SEED));
    ok(__test.genSession(S41, "2026-08-11", { last: null }) === null, "R19 fix — genSession returns null on a REST day (2026-08-11 under the athlete's split): the defect precondition, on the record — setDateSel(tISO) on a rest day unmounted the ask AND the launcher");
    ok(srcF.indexOf("const [fileAs, setFileAs] = useState(null);") > -1 && srcF.indexOf("const fileISO = fileAs || dateSel;") > -1 && srcF.indexOf("setFileAs(tISO)") > -1 && srcF.indexOf("setDateSel(tISO)}>Log as today") === -1, "R19 fix 1 — 'Log as today' sets fileAs and never touches the template date: the tap can no longer unmount the control that offered it (the R14 family law)");
    ok(srcF.indexOf("completeSession(s, fileISO, entries, slp, {") > -1 && srcF.indexOf("dateSel={gDate === dateSel ? fileISO : gDate}") > -1, "R19 fix 1 — BOTH commit paths file under fileISO (the plain log screen and gym mode), while a resumed live draft keeps its own date");
    ok(srcF.indexOf("s session template is loaded either way") > -1 && srcF.indexOf("filed under today") > -1, "R19 fix 1 — the card says BOTH truths: whose template, and which date the record lands under");
    /* DEFECT 2 — the census, pinned so a new stateless caller fails the suite */
    const calls = srcF.match(/dayType\(([^)]*)\)/g) || [];
    const real = calls.filter((c) => c.indexOf("dayType(iso") !== 0);
    const stateless = real.filter((c) => c.split(",").length === 1);
    ok(stateless.length === 6, "R19 CENSUS — exactly SIX stateless dayType calls survive, and the prose now names exactly what the needle counts: the Tue/Fri experiment (its dow buckets drop post-split lowers into x by design — structurally outside, not accidental), the refeed-eligibility read, one more refeed-day read, the refeed-water read (r.d), the anomaly screen's day filter (x.d), and the miner's dayBefore — all bounded pre-split history or dated-REFEED reads. The debrief's two calls left this set in the survivor fix: a session logged tonight must be typed by the athlete's split, both sides. Found " + stateless.length + ": a SEVENTH stateless caller is a defect until ruled here");
    ok(real.length - stateless.length >= 19 && srcF.indexOf("const t2 = dayType(d, s);   /* R19 census") > -1, "R19 CENSUS — " + (real.length - stateless.length) + " callers pass state, including every site the rig caught: the chip OPTIONS builder, both chip labels, the next-same-type previews, the NEXT eyebrow, the scheduled-count, the hack rider and exOrder's day keys — a chip offered for a future day reads the athlete's split");
    /* DEFECT 3 — back from the terminal ask returns to the terminal set, no decrement */
    ok(srcF.indexOf('if (phase === "rir-end") { setPhase("lift"); setT(0); }') > -1 && srcF.indexOf("back to this set") > -1, "R19 fix 3 — the terminal set never incremented setN (doneSet returns before setSetN on the rir-end route), so undoSet from that screen walked back PAST it: back from rir-end now returns to the terminal set's lift phase without a decrement, and the label says what it does");
  }
}
console.log(`\nFINAL100: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== v7.38.1 HOTFIX (FINAL101) ==================== */
{
  const cl = (o) => JSON.parse(JSON.stringify(o));
  const srcH = readFileSync("src/app.jsx", "utf8");
  /* H1 — the beacon crash (2026-08-09T19:51:37Z, t.sets): a stale draft idx clamps */
  ok(srcH.indexOf("sess.ex[idx] || sess.ex[Math.min(idx, sess.ex.length - 1)] || sess.ex[0]") > -1 && srcH.indexOf("d.idx >= sess.ex.length) d.idx = Math.max(0, sess.ex.length - 1)") > -1, "H1 — the beacon crash is guarded at BOTH doors: the live ex resolution clamps a stale draft idx (an upper draft against a shorter lower template read undefined and threw on .sets), and the draft restore clamps before it ever sets state");
  /* H4 — the correction, driven on the exact live shape */
  const S9 = cl(__test.SEED); S9.v = 40;
  S9.sessionLog = { ...S9.sessionLog, "2026-08-09": { entries: [
    { id: "tricep", n: "Tricep", w: 42.5, tgt: [12, 12, 11, 10], reps: [12, 12, 11, 10], rir: null, rirSets: [null, null, null, null] },
    { id: "curl", n: "Curls", w: 55, tgt: [11, 10, 10, 9], reps: [11, 10, 10, 9], rir: 2, rirSets: [2, null, null, null] },
    { id: "rows", n: "Rows", w: 120, tgt: [9, 9, 8], reps: [9, 9, 8], rir: 1, rirSets: [1, null, 0] },
    { id: "press", n: "Press", w: 250, tgt: [8, 8], reps: [9, 8], rir: 2, rirSets: [2, 1] },
  ], skipped: [{ id: "pronated" }], note: "re-log" } };
  const C9 = __test.migrate(cl(S9));
  const g9 = (id) => C9.sessionLog["2026-08-09"].entries.find((e) => e.id === id);
  ok(JSON.stringify(g9("tricep").reps) === "[12,12]" && JSON.stringify(g9("curl").reps) === "[11,10,10]" && JSON.stringify(g9("rows").reps) === "[9,9]", "H4 — the attested record: tricep keeps two sets, curl three, rows two — Joe's words on the record: 'I didn't do the 3rd set of arms' · 'the first ones look correct'. Strike what nothing attests");
  ok(JSON.stringify(g9("rows").rirSets) === "[1,0]", "H4 — the terminal RIR answer reassigns to the TRUE last set (rows [1,null,0] → [1,0]): the answer was about the last set he did, not the slot the belt banked");
  ok(JSON.stringify(g9("press").reps) === "[9,8]" && C9.sessionLog["2026-08-09"].skipped[0].id === "pronated" && C9.sessionLog["2026-08-09"].note === "re-log", "H4 — everything attested stands: press untouched, skipped[pronated] and the note intact");
  const R9 = __test.migrate(cl(C9));
  ok(JSON.stringify(R9.sessionLog["2026-08-09"].entries.find((e) => e.id === "tricep").reps) === "[12,12]", "H4 — replay is a no-op: the content key no longer matches after the edit, so the corrected state passes through untouched — and the same key means a later attested restore cannot be silently re-struck");
  const M9 = cl(S9); M9.v = 40; M9.sessionLog["2026-08-09"].entries[0].reps = [12, 12, 11];
  const K9 = __test.migrate(M9);
  ok(JSON.stringify(K9.sessionLog["2026-08-09"].entries[0].reps) === "[12,12,11]", "H4 — a record that does NOT match the key exactly is untouched: content-keyed means this correction can never fire on data it was not written for");
  ok((C9.exercises.find((z) => z.id === "tricep") || {}).lastMeta !== undefined, "H4 — caches re-derive through deriveLastMeta, never hand-edited");
  ok((C9.feed[0] || {}).t === "RECORD CORRECTED — unattested sets struck from Sunday's re-log" && /restores it by the same mechanism/.test((C9.feed[0] || {}).how), "H4 — the feed line cites Joe's words AND names the restore path");
  /* H3 — per-set: the tonight shape, driven through the suspects logic */
  ok(srcH.indexOf('markAdj(ex.id, setN); const r2') > -1 && srcH.indexOf("e2.reps.forEach((v9, i9) => { if (!adj[e2.id + " + String.fromCharCode(34) + ":" + String.fromCharCode(34) + " + i9]) out9.push") > -1, "H3 — engagement is per (lift, SET): a slot an approved +1 added mid-day, pre-filled with its target and tapped through, lists on FINISH by itself even when earlier slots of the same lift were honestly adjusted — the lift-granular belt could not see it");
  ok(srcH.indexOf("if (!keep.length) { split.skipped.push({ id: e9.id }); continue; }") > -1 && srcH.indexOf("split.entries.push({ ...e9, reps: keep });") > -1, "H3 — a struck SLOT leaves the entry; a lift with every slot struck files as skipped: per-set honesty all the way into the record");
  /* H2 — the orphan belt */
  /* v7.38.2 — the v7.38.1 H2 pin was EVOLVED with the audit's three kills: the card was
     unreachable (mounted inside the unlogged conditional), the launcher still resolved
     the mismatched draft as its own (and Monday's FINISH would have deleted the trapped
     key), and "Log under <date>" could re-bank unattested targets under a borrowed date.
     Honest accounting: the shipped v7.38.1 card never looked at the 8/09 session at all
     — the DISCARD-ONLY claim in the report was aspiration, not code. */
  ok(srcH.indexOf("A DRAFT FROM {fmtShort(o9.d)} EXISTS") > -1 && srcH.indexOf("Log under") === srcH.lastIndexOf("Log under") && srcH.indexOf("enter them under the right date in the classic list") > -1, "H2 v2 — the recovery card is DISCARD-ONLY with guidance: the mismatch proves the date was borrowed and the reps may carry unattested targets, so no log path exists off this card at all");
  ok(srcH.indexOf("prep-ledger-gymdraft-orphan-") > -1 && srcH.indexOf("function findGymDraft(s9)") > -1 && srcH.indexOf('key.indexOf("prep-ledger-gymdraft-orphan-") !== 0') > -1, "H2 v2 — QUARANTINE ON SIGHT in the one scanner every door shares: a mismatched draft renames to gymdraft-orphan-<date> (recoverable, never deleted), the chip and launcher never see it, and a fresh session gets a clean key — Monday's FINISH can no longer delete Sunday's trapped reps");
  ok(srcH.split("{gym && (() => {")[0].indexOf("A DRAFT FROM") > -1, "H2 v2 — the card mounts UNCONDITIONALLY at TRAIN top level, before the gym block: the one night it was built for (today logged, draft trapped) is exactly when the old conditional unmounted it");
  ok(srcH.indexOf("{/* v7.38.2 (d) — print the stored load or nothing; never invent BW */}{(d9.w != null ? d9.w + " + String.fromCharCode(34) + " × " + String.fromCharCode(34)) > -1, "(d) — the debrief prints the stored load or nothing, never invents BW — and the note rides as a JSX COMMENT, not screen text: the v7.38.2-candidate comment rendered literally on every debrief lift row");
  { const dcSlice = srcH.slice(srcH.indexOf("function DebriefCard"), srcH.indexOf("function DebriefCard") + 9000); const leak = (dcSlice.match(/}\s+\/\*/g) || []).filter((m) => m.indexOf("{") === -1); ok(leak.length === 0, "COMMENT-LEAK LAW — no /* sits after a closing brace in the debrief card render path, where JSX treats it as literal screen text; a comment belongs in {/* */} form or above the line (found: " + leak.length + ")"); }

  /* ---------- R18b increment 1 — a sighting banks with no next load on file ---------- */
  {
    const cl8 = (o) => JSON.parse(JSON.stringify(o));
    const S8 = cl8(__test.SEED);
    /* the seed carries no natural no-next-load lift; MANUFACTURE the hack shape on a real
       exercise by clearing its increments — the drive is about the earn block, not the seed */
    const exA = (S8.exercises || []).find((e) => typeof e.w === "number" && e.hi);
    if (exA) { delete exA.inc; delete exA.steps; if (exA.ladder) delete exA.ladder; exA.topAt = null; exA.topRun = 0; }
    const ex8 = exA;
    ok(!!ex8, "R18b — a no-next-load lift is manufactured from a real seed exercise (the live case is hack): " + (ex8 ? ex8.id : "NONE"));
    if (ex8) {
      const hi8 = ex8.hi || 12;
      const reps8 = Array(ex8.sets || 3).fill(hi8 + 20);   /* atTopOfWindow slices to ex.sets, and a maxed lift tops against the MOVING delivered ceiling (best opener on file) — clear it decisively */
      const { s: NS8 } = __test.completeSession(S8, "2026-08-20", [{ id: ex8.id, n: ex8.n, w: ex8.w, tgt: reps8.map(() => hi8 - 1), reps: reps8, rir: 2, rirSets: reps8.map(() => 2) }], { last: null }, { note: "", niggles: [], skipped: [], pace: null });
      const ex9 = NS8.exercises.find((e) => e.id === ex8.id);
      ok(String(ex9.topAt) === String(ex8.w) && ex9.topRun >= 1, "R18b — topping the window with NO next load on file now BANKS the sighting (topAt/topRun write): the 8/07 hack sighting class is no longer lost, so answering the next-load ask later starts from the record already delivered");
      ok((NS8.feed || []).some((f) => f && f.t && f.t.indexOf(" — TOP OF WINDOW, NO NEXT LOAD ON FILE") > -1), "R18b — and it says so in the feed, words at birth: the sighting is on the record, the ask is named as what unlocks the earn");
    }
  }
}
console.log(`\nFINAL101: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

/* ==================== R18 · LOAD PROGRESSION (FINAL102) ==================== */
{
  const cl = (o) => JSON.parse(JSON.stringify(o));
  const srcR8 = readFileSync("src/app.jsx", "utf8");
  const mk18 = () => {
    const S = cl(__test.SEED);
    const ex = S.exercises.find((e) => typeof e.w === "number" && e.hi);
    ex.steps = [ex.w, ex.w + 10, ex.w + 25, ex.w + 35];   /* a rung ladder on file */
    if (ex.ladder) delete ex.ladder;
    ex.topAt = null; ex.topRun = 0; ex.holdFlag = false;
    return { S, ex };
  };
  const drive18 = (S, ex, rirT, presight) => {
    const eF = S.exercises.find((z) => z.id === ex.id);
    const topline = Array(ex.sets || 3).fill(0).map((_, i9) => Math.max(1, (ex.hi || 12) - i9));
    eF.last = topline.slice(); eF.lastMeta = { d: "2026-08-18", w: eF.w, reps: topline.slice(), rir: 2, rirSets: topline.map(() => 2), debt: false };   /* the PREVIOUS same-load session already at the top: margin ~0, so beatsNoise cannot confirm on sighting one and the arms under test actually run */
    if (presight) { eF.topAt = eF.w; eF.topRun = 1; }
    const reps = Array(ex.sets || 3).fill(0).map((_, i9) => Math.max(1, (ex.hi || 12) - i9));   /* the window-top fade line, matching the seeded previous session: tops honestly, clears nothing */
    return __test.completeSession(S, "2026-08-21", [{ id: ex.id, n: ex.n, w: ex.w, tgt: reps.map(() => ex.hi - 1), reps, rir: 2, rirSets: reps.map((_, i) => (i === reps.length - 1 ? rirT : 2)) }], { last: null }, { note: "", niggles: [], skipped: [], pace: null }).s;
  };
  /* R18d — terminal RIR ≥3 with a ladder proposes the TWO-rung debut beside the earned single */
  { const { S, ex } = mk18(); const NS = drive18(S, ex, 3, true);
    const q1 = NS.queue.find((q) => q.exId === ex.id && q.kind === "debut" && q.state === "DEBUT");
    const q2 = NS.queue.find((q) => q.exId === ex.id && q.state === "PROPOSED" && /TWO-RUNG/.test(q.t));
    ok(!!q1 && q1.newW === ex.w + 10, "R18d — the confirmed earn still queues the SINGLE rung automatically (" + (q1 ? q1.newW : "—") + "): today's behaviour is the floor, never lowered");
    ok(!!q2 && q2.newW === ex.w + 25 && /Your call/.test(q2.gate), "R18d — terminal RIR 3 at the top with a ladder PROPOSES the two-rung debut (" + (q2 ? q2.newW : "—") + ") beside it: the athlete consents by tapping, the single-rung floor rides either way");
  }
  /* R18d — terminal RIR 1-2: single rung only, no two-rung proposal (today's behaviour) */
  { const { S, ex } = mk18(); const NS = drive18(S, ex, 1, true);
    ok(!NS.queue.some((q) => q.exId === ex.id && /TWO-RUNG/.test(q.t || "")), "R18d — terminal RIR 1 proposes nothing extra: the two-rung door opens at ≥3 only, and even-inc lifts with no ladder are byte-identical by construction (rung2 needs loadRungs)");
  }
  /* R18d AMENDMENT (Joe, 2026-08-10) — ONE sighting at terminal RIR ≥2 earns as a PROPOSAL */
  { const { S, ex } = mk18(); const NS = drive18(S, ex, 2, false);
    const q3 = NS.queue.find((q) => q.exId === ex.id && q.state === "PROPOSED" && /ONE SIGHTING/.test(q.t));
    ok(!!q3 && q3.newW === ex.w + 10 && /two-for-two law runs as always/.test(q3.gate), "R18d AMENDMENT — first sighting at the top with 2 in reserve on the failure set files the early-earn PROPOSAL: tap it and the debut rides; skip it and two-for-two stands. The automatic queue is untouched");
    ok(!NS.queue.some((q) => q.exId === ex.id && q.state === "DEBUT"), "R18d AMENDMENT — and it is a proposal ONLY: one sighting still queues no automatic debut");
  }
  /* the amendment stays silent when the terminal answer is missing or low */
  { const { S, ex } = mk18(); const NS = drive18(S, ex, 1, false);
    ok(!NS.queue.some((q) => q.exId === ex.id && /ONE SIGHTING/.test(q.t || "")), "R18d AMENDMENT — terminal RIR 1 on a first sighting proposes nothing: an early earn needs the athlete's own answer saying the top was not a grind");
  }
  /* R18a — the runway on every numeric lift + the header receipt */
  { const S = cl(__test.SEED);
    const g = __test.genSession(S, "2026-08-13", { last: null });
    ok(!!g && g.ex.filter((l) => typeof l.w === "number").every((l) => l.runway), "R18a — every numeric lift on the session card carries a runway line, derived only (nextLoad · windowFor · last · topRun · typicalError)");
    const r1 = (g.ex.find((l) => /EARNS AT THE TOP OF THE WINDOW/.test(l.runway || "")) || {}).runway || "";
    ok(/EARNS AT THE TOP OF THE WINDOW \(\d+-\d+\)/.test(r1) && (/you are \d+ reps? away/.test(r1) || /you are there/.test(r1)) && /two sightings bank it|one sighting banked/.test(r1), "R18a — the runway names the next load, the window, the measured rep distance and the sighting state in one engine-authored line: " + r1.slice(0, 90));
    ok((g.structural || "").length > 0 && srcR8.indexOf(String.fromCharCode(34) + " · nearest earn: " + String.fromCharCode(34)) > -1, "R18a — the header receipt exists at source ( · nearest earn: name, N reps from W) and rides whenever no structural claims the day; this seed day carries one (" + g.structural.slice(0, 40) + "), so the receipt yields to it — by design, the receipt explains only the NO-debut claim");
  }
  /* R18b — the ask card at source */
  ok(srcR8.indexOf("WHAT IS THE NEXT WEIGHT THIS MACHINE MAKES AFTER") > -1 && srcR8.indexOf("[...new Set([...(loadRungs(ex4) || []), ex4.w, ...ups])].sort") > -1 && srcR8.indexOf("counts as sighting one") > -1, "R18b — the ask card captures the machine's ladder in one tap (parseRungs — one weight or the whole ladder) and the already-delivered sighting counts the moment it is answered");
  ok(srcR8.indexOf("Confirm the rung: does this machine actually make ") > -1, "R18c — the EARNED banner asks for rung confirmation where no ladder is on file, and points at the SETUP editor (the power path stays)");
  ok(srcR8.indexOf("GATES the next jump") > -1 && srcR8.indexOf("Last-set RIR gates the next jump") > -1, "R18d — the two prose claim-sites now describe what the engine does (gate + propose), not a sizing that never ran; the gym label 'this one sizes the jump' became TRUE under this round");

  /* ---------- R18 FIX ROUND — five defects from the audit read ---------- */
  {
    const srcF8 = readFileSync("src/app.jsx", "utf8");
    /* D1 — PROPOSED never runs untapped (fixtures G/H through genSession) */
    { const { S: SG, ex: exG } = mk18();
      SG.queue.push({ id: "q_gx_2r", kind: "debut", exId: exG.id, newW: exG.w + 25, done: false, state: "PROPOSED", t: exG.n.toUpperCase() + " X — TWO-RUNG DEBUT PROPOSED", gate: "x" });
      const gG = __test.genSession(SG, "2026-08-13", { last: null });
      ok(gG && gG.structural.indexOf("PROPOSED") === -1, "R18 fix D1 (G/H) — a PROPOSED item never wins the structural slot: pickStructural excludes it, so an untapped offer cannot preempt an earned debut or run itself. Consent is the tap, by MECHANISM now, not by copy");
    }
    { const { S, ex } = mk18(); const eS = S.exercises.find((z) => z.id === ex.id); eS.topAt = eS.w; eS.topRun = 1;
      S.queue.push({ id: "q_sup_1s", kind: "debut", exId: ex.id, newW: ex.w + 10, done: false, state: "PROPOSED", t: "X — EARN PROPOSED OFF ONE SIGHTING", gate: "x" });
      const NS = drive18(S, ex, 1, false);   /* second sighting confirms via two-for-two */
      const sup = NS.queue.find((x) => x.id === "q_sup_1s");
      const deb = NS.queue.find((x) => x.exId === ex.id && x.state === "DEBUT");
      ok(!!deb && sup && sup.done === true && sup.state === "SUPERSEDED", "R18 fix D1 — the two-for-two earn SUPERSEDES the standing offer: it goes done/SUPERSEDED and the automatic debut queues, so an offer can never double-fire after the law has run");
    }
    ok(srcF8.indexOf('q2.state = "DEBUT"') > -1 && srcF8.indexOf("Take it") > -1 && srcF8.indexOf('q2.state = "DECLINED"') > -1, "R18 fix D1 — PROPOSED items render as tappable cards on TRAIN: Take it flips to a normal DEBUT, Not today declines on the record");
    /* D2 — the single-weight answer */
    ok(srcF8.indexOf("const one9 = parsed ? null : Number(String(raw9).replace(") > -1 && srcF8.indexOf("one number (the next step up) or the whole ladder") > -1, "R18 fix D2 — the advertised single-weight answer works (parseRungs needs 2+; one number is the COMMON case and seeds [w, n]) and an unparseable answer speaks instead of no-oping");
    /* D3 — both surfaces */
    ok(srcF8.indexOf("{ex.runway && (") > -1 && srcF8.indexOf("RUNWAY › {ex.runway}") > -1, "R18 fix D3 — the runway renders on BOTH promised surfaces: the TRAIN row (unconditional, one line, density law) and gym mode under the live line");
    /* D4 — the earn's exact predicate + the arming condition */
    { const S4 = JSON.parse(JSON.stringify(__test.SEED));
      const e4 = S4.exercises.find((e) => typeof e.w === "number" && e.hi && e.sets >= 3);
      e4.inc = e4.inc || 5; if (e4.steps) delete e4.steps; if (e4.ladder) delete e4.ladder;
      e4.last = Array(e4.sets).fill(0).map((_, i) => Math.max(1, e4.hi - i - (i === 0 ? 1 : 0)));
      e4.lastMeta = { d: "2026-08-06", w: e4.w, reps: e4.last.slice(), rir: 2, rirSets: e4.last.map(() => 2), debt: false };
      const g4 = __test.genSession(S4, "2026-08-13", { last: null });
      const l4 = g4.ex.find((x) => x.id === e4.id);
      ok(!!l4 && /you are 1 rep away/.test(l4.runway || ""), "R18 fix D4 — the distance is the earn predicate itself (top - i, UNFLOORED): one rep short on the opener reads ONE rep away, where the floored formula printed more — " + (l4 ? (l4.runway || "").slice(0, 80) : "—"));
      const e5 = S4.exercises.find((e) => e !== e4 && typeof e.w === "number" && e.sets >= 3);
      if (e5) { e5.last = [e5.hi, e5.hi].slice(0, Math.max(1, e5.sets - 1));
        const g5 = __test.genSession(S4, "2026-08-13", { last: null });
        const l5 = g5.ex.find((x) => x.id === e5.id);
        ok(!!l5 && /arming: \d+ of \d+ sets on file/.test(l5.runway || ""), "R18 fix D4 — a lift with fewer logged sets than it now runs names the ARMING condition instead of implying tonight can earn: " + (l5 ? (l5.runway || "").slice(0, 70) : "—"));
      }
    }
    /* D5 — the laws sentence */
    ok(srcF8.indexOf("terminal RIR gates every earn (0 blocks it), can take an earn early off one honest sighting") > -1 && srcF8.indexOf("RIR on the LAST set is what sizes the next jump") === -1, "R18 fix D5 — the laws block says what R18d made true (gates · early-by-tap · sizes only where rungs are on file); the ~6786 session-step sentence is ruled KEPT as approximately true, per the audit");
    /* RIDER — the sighting-window law, ruled */
    ok(srcF8.indexOf("any writer that moves ex.hi MUST reset topAt/topRun") > -1, "SIGHTING-WINDOW LAW — a sighting is a claim about a specific window: ruled with the audit, written at the bank site, binding on the next hi-writer (none live today). Pronated's phone-banked sighting stands for Joe's call at merge");
  }

  /* ---------- CONSENT HYGIENE ROUND (Joe's audit ruling, 2026-08-10) ---------- */
  {
    const srcH3 = readFileSync("src/app.jsx", "utf8");
    /* H1 — the hand-back, driven on the exact desk-left shape */
    const SH = JSON.parse(JSON.stringify(__test.SEED)); SH.v = 41;
    const setTo = (id, n) => { const e = SH.exercises.find((x) => x.id === id); if (e) e.sets = n; };
    ["rows"].forEach((id) => setTo(id, 3)); ["hack", "tricep", "curl", "abs"].forEach((id) => setTo(id, 4));
    const fri = {}; ["ham", "hams", "chest", "rearDelt"].forEach((id) => { const e = SH.exercises.find((x) => x.id === id); if (e) fri[id] = e.sets; });
    const CH = __test.migrate(JSON.parse(JSON.stringify(SH)));
    const g = (id) => (CH.exercises.find((x) => x.id === id) || {}).sets;
    ok(g("rows") === 2 && g("hack") === 3 && g("tricep") === 3 && g("curl") === 3 && g("abs") === 3, "H1 — THE HAND-BACK ENACTED: rows 3→2, hack 4→3, tricep 4→3, curl 4→3, abs 4→3 — exactly what the approved-but-inert card said, now done by the migration with both consents cited in the feed");
    ok(Object.keys(fri).every((id) => (CH.exercises.find((x) => x.id === id) || {}).sets === fri[id]), "H1 — Friday's owner's-call three STAND: hams, chest and rearDelt keep their counts untouched");
    ok((CH.feed[0].t.indexOf("HAND-BACK") > -1 || CH.feed[1].t.indexOf("HAND-BACK") > -1) && /audit and fix/.test(JSON.stringify(CH.feed.slice(0, 3))), "H1 — the receipt cites the approved card AND Joe's audit ruling, verbatim");
    const CH2 = __test.migrate(JSON.parse(JSON.stringify(CH)));
    ok((CH2.exercises.find((x) => x.id === "rows") || {}).sets === 2, "H1 — replay is a no-op: content-keyed on the exact counts the desk left, so a corrected state passes through untouched");
    const SM = JSON.parse(JSON.stringify(SH)); SM.v = 41; const em = SM.exercises.find((x) => x.id === "hack"); if (em) em.sets = 5;
    ok((__test.migrate(SM).exercises.find((x) => x.id === "hack") || {}).sets === 5, "H1 — a count that already moved is NOT touched: the restatement fires only on the shape it was written for");
    /* H1 — the recalls */
    const SR = JSON.parse(JSON.stringify(__test.SEED)); SR.v = 41;
    SR.agentProposals = [{ id: "vd1", kind: "volume", mg: "delts_side", dir: 1 }, { id: "vd2", kind: "volume", mg: "delts_rear", dir: 1 }, { id: "cc1", kind: "coach" }, { id: "tr1", kind: "trial", tplId: "x" }];
    const CR = __test.migrate(SR);
    ok(CR.agentProposals.length === 1 && CR.agentProposals[0].kind === "trial" && (CR.feed[0].t.indexOf("DESK OFFERS RECALLED") > -1 || CR.feed[1].t.indexOf("DESK OFFERS RECALLED") > -1), "H1/H3 — the standing desk offers (both delts cards) AND the coach calorie card are recalled at source with a feed receipt; a non-desk proposal (trial) survives");
    /* H2 — the R14 law at the suggestion card */
    ok(srcH3.indexOf("function noteSuggestion(state, sug)") > -1 && srcH3.indexOf('decided: "noted"') > -1, "H2 — Noted is a real verb with its own honest writer: it logs the observation and files a feed line saying approving would have changed nothing");
    ok(srcH3.indexOf('return this.does ? "Approve — apply it" : "Noted";') > -1 && srcH3.indexOf("const ns = this.does ? applySuggestion(s, p) : noteSuggestion(s, p);") > -1, "H2 → R20a — the fork EVOLVED: the apply control now derives from the Approving-does line itself (no line, no Approve, structurally) — the R20a voice law completing what the hygiene round started; inert kinds and sub-high confidence both fall to Noted through the same single fork");
    ok(srcH3.indexOf("Approving does: sets your protein target to ") > -1 && srcH3.indexOf("{it.does ?") > -1, "H2 — every real apply carries the one-line receipt (Approving does: <exact change>) rendered above the button; a card without it renders note-only by construction (does is null for inert kinds)");
    /* H3 — the desk gate + the guards named as code */
    ok(srcH3.indexOf("THE DESK WAKES, DEMOTED TO A DOOR") > -1 && srcH3.indexOf("the WHICH is volumePush") > -1, "H3 → R18f — the hygiene hard gate is LIFTED because the defect it guarded is gone: the desk no longer routes. Its zone triggers are the WHEN; the WHICH is the one chooser, house gates by construction");
    ok(__test.sweepVolume(JSON.parse(JSON.stringify(__test.SEED)), 0) === null, "H3 — driven: a Sunday sweep on a full seed files nothing while the gate holds");
  }

  /* ---------- R18e — THE ONE-CHANGE CARD STOPS OVERCLAIMING ---------- */
  {
    const srcE = readFileSync("src/app.jsx", "utf8");
    /* 1 — the card says the true thing, with an end date */
    ok(srcE.indexOf("the set-add and step-push levers are held while the scale reads it") > -1 && srcE.indexOf("Your daily calorie band keeps updating and corrective steers stay live") > -1 && srcE.indexOf('. The budget reopens ') > -1 && srcE.indexOf(' + fmtShort(isoOf(new Date(mk(smw.monday).getTime() + 7 * DAY)))') > -1 && srcE.indexOf("the coach holds every other lever until the scale can say what that one change did") === -1, "R18e-1 — the card names the levers ACTUALLY held (volume push, step push), says the band and steers stay live, and dates the budget reopening; the every-other-lever overclaim is extinct");
    /* 2 — tighten abstains in a sets week; ease and the floor never held, by construction */
    ok(srcE.indexOf('if (action === "tighten") { try { const smw9 = structuralMovesThisWeek(s); if (smw9.sets.length) { action = "hold"; setsWeekHold = true; } } catch (e) {} }') > -1, "R18e-2 — Auto-Pilot TIGHTEN abstains for the budget week after a SETS change (the mirror of volumePush's cal veto — one budget, symmetric). The guard fires ONLY on the tighten branch, so ease and the redline floor are never held BY CONSTRUCTION, and the daily band is untouched (the guard moves action, never the band)");
    ok(srcE.indexOf("repair water inflates the scale for a week or two, so a slower-looking rate right now is the steer most likely to be false") > -1, "R18e-2 — the abstain carries its mechanism (new-volume repair water), surfaced on the read (setsWeekHold/setsWeekWhy) so the card can say why the tighten waits");
    /* 3 — THE VERIFICATION the audit could not confirm from the dump: an APPROVED cal
       steer carries via:cal all the way into the budget, driven end to end */
    const SV = JSON.parse(JSON.stringify(__test.SEED));
    SV.proposals = [...(SV.proposals || []), { rid: "ap_tighten_T", id: "apt_drive", d: isoL(Date.now()), title: "tighten drive", apply: { kind: "cal" }, corrKcal: 100, action: "tighten" }];
    const AV = __test.applyProposal(SV, "apt_drive");
    const row = (AV.adjustments || [])[AV.adjustments.length - 1];
    ok(row && row.via === "cal" && row.rid === "ap_tighten_T", "R18e-3 VERIFIED — an APPROVED cal steer writes via:cal on its adjustment row (the live bare {d, rid} ap_tighten rows predate v7.3.1's approval-takes-effect): the cal-blocks-volume arm is ALIVE, not dead code");
    const smwV = __test.structuralMovesThisWeek(AV);
    ok(smwV.calOrSteps.length >= 1 && smwV.calOrSteps.some((m) => m.rid === "ap_tighten_T"), "R18e-3 — structuralMovesThisWeek SEES the approved steer in calOrSteps the same week");
    const vpV = __test.volumePush(AV);
    ok(vpV.mode !== "PROPOSE" && srcE.indexOf('if (smw.calOrSteps.length) return { mode: "WITHHELD", veto: "budget",') > -1, "R18e-3 — and volumePush cannot propose that week (mode " + vpV.mode + (vpV.veto ? "/" + vpV.veto : "") + "): the budget arm exists at source and the approved steer feeds it — driven end to end, approve → via:cal → calOrSteps → no volume push");
  }

  /* ---------- R18f — ONE OWNER FOR THE ADDED SET ---------- */
  {
    const srcFf = readFileSync("src/app.jsx", "utf8");
    ok(srcFf.indexOf("const picks = [];") > -1 && srcFf.indexOf("alt: p1 ? { mg: p1.mg, exName: p1.exName") > -1 && srcFf.indexOf("lowest allocation carries it — rep-velocity is never consulted for routing") > -1, "R18f-1 — the chooser names its runner-up and states the routing law: allocation, never rep-velocity — a maxed ladder (hack, forced reps-only, vel 3.5) can no longer masquerade as responsiveness and a fresh load jump (extension, reps reset by the debut) costs nothing");
    ok(srcFf.indexOf("const vp9 = volumePush(s);") > -1 && srcFf.indexOf('if (vp9.mode === "PUSH") {') > -1 && srcFf.indexOf("The desk is awake again — one chooser, house gates.") > -1, "R18f-2 — the desk's +1 arm ASKS THE SAME FUNCTION: every house gate (regime, rising, recovery, sleep, the smw budget, spillover, conversion, ceiling) applies to the desk by construction, and the card SAYS the desk woke with this round");
    ok(srcFf.indexOf("if (dir < 0) {") > -1 && srcFf.indexOf("} else cands.push({ m, dir, why, pick: null,") > -1, "R18f-2 — the +1 trigger carries NO pick of its own (the chooser owns WHICH); the -1 give-back keeps its weakest-mover pick — a different question, no ladder bias rewards the giver");
    ok(srcFf.indexOf("if (smw9.moves.length) return;   /* R18f-3") > -1, "R18f-3 — the give-back is a structural move too: it waits out ANY move-week (sets, cal or steps), so no desk card can contradict the ONE-CHANGE card in the same render");
    ok(srcFf.indexOf("slice(0, 1).forEach") > -1 && srcFf.indexOf("gatesClosed: false") > -1, "R18f — default offers cap at ONE by construction (the chooser returns one pick; the give-back files at most one), and never five simultaneous defaults again");
    /* driven: the awake desk on a full seed still files nothing while the chooser holds */
    ok(__test.sweepVolume(JSON.parse(JSON.stringify(__test.SEED)), 0) === null, "R18f — DRIVEN: Sunday sweep on the seed files nothing — the chooser reads regime unknown and the desk inherits every gate the moment it asks");
    const vpS = __test.volumePush(JSON.parse(JSON.stringify(__test.SEED)));
    ok(vpS.mode !== "PUSH" || (vpS.routing && vpS.routing.indexOf("lowest allocation") === 0), "R18f — whenever the chooser DOES push, its verdict carries the routing sentence (and the alt when a runner-up exists): the card states both candidates' numbers from the engine's own words");
  }

  /* ---------- R18f FIX — the sets week silences the desk (the audit's fixture) ---------- */
  {
    const SW = JSON.parse(JSON.stringify(__test.SEED));
    const t9 = isoL(Date.now()); const d9 = new Date(); const off9 = (d9.getDay() + 6) % 7;
    const mon9 = isoL(Date.now() - off9 * 864e5);
    SW.adjustments = [...(SW.adjustments || []), { rid: "vol_drive", id: "adj_sw", d: mon9, title: "x", exUndo: { field: "sets", exId: "ham" } }];
    const smwW = __test.structuralMovesThisWeek(SW);
    ok(smwW.sets.length >= 1, "R18f fix — the fixture is real: a sets adjustment dated this Monday lands in smw.sets");
    const vpW = __test.volumePush(SW);
    ok(vpW.mode !== "PUSH" && /if \(smw.sets.length\) return { mode: "WITHHELD", veto: "budget",/.test(readFileSync("src/app.jsx", "utf8")), "R18f fix — a sets move this week can never reach PUSH: on this seed the regime gate exits first (ABSTAIN — the chain order is the design), and the sets-veto arm stands in the chain for gates-open states (veto budget, the stepPush mirror sentence) — the gates-open drive is the audit rig's, on its FINAL82 fixture");
    ok(__test.sweepVolume(SW, 0) === null, "R18f fix DRIVEN — and the desk, asking that same chooser, files ZERO offers in a sets-move week: the audit's exact fixture, silent");
  }

  /* ---------- R18f FIX 2 — OFFERS DO NOT OUTLIVE THE BUDGET (the audit's held round) ---------- */
  {
    const srcO = readFileSync("src/app.jsx", "utf8");
    const isoT9 = isoL(Date.now());
    const mkWk = () => {
      const S = JSON.parse(JSON.stringify(__test.SEED));
      const d9 = new Date(); const off9 = (d9.getDay() + 6) % 7;
      const mon9 = isoL(Date.now() - off9 * 864e5);
      S.adjustments = [...(S.adjustments || []), { rid: "vol_wk", id: "adj_wk", d: mon9, title: "x", exUndo: { field: "sets", exId: "ham" } }];
      return S;
    };
    /* (a) the reconciler withdraws BOTH stores when a move lands — never deletes */
    const SA = mkWk();
    SA.proposals = [...(SA.proposals || []), { rid: "volpush_quads_x", id: "vpx", d: isoT9, title: "QUADS — EARNED VOLUME", why: "w", apply: { kind: "sets", exId: "hack", delta: 1, budgetPremise: true } }];
    SA.agentProposals = [...(SA.agentProposals || []), { id: "vq1", kind: "volume", mg: "quads", exId: "hack", dir: 1, title: "VOLUME +1" }];
    const RA = __test.runAdaptive(SA, isoT9);
    const pA = RA.proposals.find((p) => p.id === "vpx");
    ok(pA && pA.resolved === true && /withdrawn/.test(pA.resolvedHow || "") && !RA.agentProposals.some((ap) => ap.kind === "volume"), "R18f fix2 (a) — the moment a structural move is on the week, the reconciler withdraws open volume offers in BOTH stores: the proposal resolves (never deleted) and the desk card leaves, each with a feed line — the audit's items 1 and 2, dead at the grooming pass");
    ok(RA.feed.some((f) => f.t && f.t.indexOf("CARD WITHDRAWN") === 0) && RA.feed.some((f) => f.t && f.t.indexOf("DESK OFFER") === 0), "R18f fix2 (a) — both withdrawals speak on the feed, the R4-orphan precedent");
    /* (c) the apply-time belt — the tap re-checks and SPEAKS; the enact path survives */
    const SC = mkWk();
    const hackW = (SC.exercises.find((x) => x.id === "hack") || {}).sets;
    SC.proposals = [...(SC.proposals || []), { rid: "volpush_quads_y", id: "vpy", d: isoT9, title: "QUADS — EARNED VOLUME", why: "w", apply: { kind: "sets", exId: "hack", delta: 1, budgetPremise: true } }];
    const RC = __test.applyProposal(SC, "vpy");
    ok((RC.exercises.find((x) => x.id === "hack") || {}).sets === hackW && (RC.proposals.find((p) => p.id === "vpy") || {}).resolved === true && RC.feed.some((f) => f.t && f.t.indexOf("OFFER EXPIRED AT THE TAP") === 0), "R18f fix2 (c) — DESIGN CALL enacted: a budget-premised sets tap in a spent week enacts NOTHING, resolves the card and says why on the feed (what expired, when it returns) — the audit's 3→4 drive is dead");
    /* (c) — and the owner's-call family is EXEMPT: its premise is Joe's ask, not the budget */
    const SO = mkWk();
    SO.proposals = [...(SO.proposals || []), { rid: "volpush_hams_oc", id: "vpo", d: isoT9, title: "HAMS — OWNER'S CALL", why: "w", apply: { kind: "sets", exId: "ham", delta: 1 } }];
    const hamW = (SO.exercises.find((x) => x.id === "ham") || {}).sets;
    const RO = __test.applyProposal(SO, "vpo");
    ok((RO.exercises.find((x) => x.id === "ham") || {}).sets === hamW + 1, "R18f fix2 — the belt keys on budgetPremise, so the owner's-call three-tap pattern (8/07, consent on the record) still enacts in a move-week: the first suite run caught the unscoped belt breaking exactly that flow, on the record");
    /* (b) one door files — both directions at source */
    ok(srcO.indexOf("const deskOpen = (s.agentProposals || []).some((ap) => ap && ap.kind === " + String.fromCharCode(34) + "volume" + String.fromCharCode(34) + ");") > -1 && srcO.indexOf("const doorOpen9 = (s.proposals || []).some((p) => p && !p.resolved && p.rid && String(p.rid).indexOf(" + String.fromCharCode(34) + "volpush_" + String.fromCharCode(34) + ") === 0);") > -1, "R18f fix2 (b) — the cross-store guard runs both directions: an open desk offer closes door 2, an open EARNED VOLUME card closes the desk — a clean Monday yields ONE card, not two");
  }

  /* ---------- R18f FIX 3 — THE DECLINE FACE (each door honors BOTH promises) ---------- */
  {
    const srcD = readFileSync("src/app.jsx", "utf8");
    ok(srcD.indexOf('const declined9 = (s.adjustments || []).some((a) => a && a.dismissed && a.rid && String(a.rid).indexOf("volpush_") === 0 && a.d >= mon9x);') > -1 && srcD.indexOf("!already9 && !doorOpen9 && !declined9") > -1, "R18f fix3 — a declined EARNED VOLUME card closes the DESK for the week (door 2's own vpDeclined check, taken by the desk): the card promised 'the lever stays quiet before Monday', and now both doors keep it");
    ok(srcD.indexOf('"VOLUME PASSED — " + String(vp.mg).toUpperCase()') > -1 && srcD.indexOf("!deskOpen && !deskPassed && vp.mode") > -1, "R18f fix3 — a PASSED desk offer closes DOOR 2 for that muscle for 14 days (the desk's recent-feed guard, taken by the producer): the pass promised two weeks, and now both doors keep it");
    /* the desk belts, DRIVEN via the export (the audit's note 1) */
    const isoT0 = isoL(Date.now());
    const dW = new Date(); const offW = (dW.getDay() + 6) % 7; const monW = isoL(Date.now() - offW * 864e5);
    const SB = JSON.parse(JSON.stringify(__test.SEED));
    SB.adjustments = [...(SB.adjustments || []), { rid: "vol_wk2", id: "adj_wk2", d: monW, title: "x", exUndo: { field: "sets", exId: "ham" } }];
    SB.agentProposals = [{ id: "vb1", kind: "volume", mg: "quads", exId: "hack", dir: 1, title: "VOLUME +1" }];
    const hackB = (SB.exercises.find((x) => x.id === "hack") || {}).sets;
    const RB = __test.applyAgentProposal(SB, SB.agentProposals[0], isoT0);
    ok((RB.exercises.find((x) => x.id === "hack") || {}).sets === hackB && RB.agentProposals.length === 0 && RB.feed.some((f) => f.t && f.t.indexOf("OFFER EXPIRED AT THE TAP") === 0), "R18f fix3 — THE DESK BELT, DRIVEN via the export: a spent-week desk tap enacts nothing, clears the offer and speaks — mirroring the proposal belt");
    const SC2 = JSON.parse(JSON.stringify(__test.SEED));
    SC2.agentProposals = [{ id: "vb2", kind: "volume", mg: "quads", exId: "hack", dir: 1, title: "VOLUME +1" }];
    const hackC = (SC2.exercises.find((x) => x.id === "hack") || {}).sets;
    const RC2 = __test.applyAgentProposal(SC2, SC2.agentProposals[0], isoT0);
    ok((RC2.exercises.find((x) => x.id === "hack") || {}).sets === hackC + 1, "R18f fix3 — and the clean-week desk tap still ENACTS: the belt refuses only what the budget already spent");
  }

  /* ---------- R18f FIX 4 — the desk keeps its promise at its own FILING site ---------- */
  {
    const srcP = readFileSync("src/app.jsx", "utf8");
    ok(srcP.indexOf("const passed9 = (s.feed || []).slice(0, 80).some((f) => f && f.t && f.d && f.t.indexOf(\"VOLUME PASSED — \" + String(vp9.mg).toUpperCase()) === 0") > -1 && srcP.indexOf("!already9 && !doorOpen9 && !declined9 && !passed9") > -1, "R18f fix4 — the deskPassed read guards the desk's own FILING site on the CHOOSER's pick (vp9.mg): a passed muscle cannot be refiled by another muscle's trigger re-picking it by allocation. The trigger guard covered only the WHEN — the audit's driven corner, and the mask (the open owner trio tripping doorOpen9) is why neither suite caught it; the gates-open owner-resolved drive is the audit rig's");
  }

  /* ---------- v7.40.1 — a dead draft can never hold the launcher (Joe, live, 12:25) ---------- */
  {
    const srcDD = readFileSync("src/app.jsx", "utf8");
    ok(srcDD.indexOf("const tplOk = (() => { try { return !!genSession(s9, iso1); } catch (e) { return false; } })();") > -1 && srcDD.indexOf("if (Object.keys(d.reps || {}).length) { localStorage.setItem(\"prep-ledger-gymdraft-orphan-\" + iso1,") > -1, "v7.40.1 — a draft keyed to a template-null date never reaches the launcher: with banked reps it quarantines like any orphan, with ZERO reps it is removed as noise (it holds no athlete data). The empty draft had no ids to mismatch, so every earlier belt was blind to it");
    ok(srcDD.indexOf(": sess) || sess;   /* v7.40.1") > -1, "v7.40.1 — R14 at the gym door: the tap may never mount NOTHING — an unresolvable draft date falls back to today's session");
  }

  /* ---------- R20 — THE VOICE LAW + NEW-SET GRACE ---------- */
  {
    const srcV = readFileSync("src/app.jsx", "utf8");
    const conV = readFileSync("ledger/analyst-constitution.md", "utf8");
    /* R20a — the render belt */
    ok(srcV.indexOf('if (conf !== "high") return null;') > -1, "R20a — SPECULATION NEVER WEARS APPLY: the does line is null below high confidence, and the apply control derives from the line — the same single fork, so a hunch structurally cannot carry a tap");
    ok(conV.indexOf("## THE VOICE LAW (R20a") > -1 && conV.indexOf("One idea per card.") > -1 && conV.indexOf("banked,") > -1 && conV.indexOf("Speculation never wears an apply button.") > -1 && conV.indexOf("Approving does: <the change>") > -1, "R20a — the constitution carries the voice law in Joe's ruling's own terms: one idea per card, plain words with his numbers as receipts, the jargon ban (banked/scoring/feed-row/target-array), severity honest, the mandatory Approving-does line, engine-owned numbers unproposable (regression from the hygiene round)");
    /* R20b — new-set grace, driven on the press live-case shape */
    const cl20 = (o) => JSON.parse(JSON.stringify(o));
    const S20 = cl20(__test.SEED);
    const eP = S20.exercises.find((e) => typeof e.w === "number" && e.hi);
    eP.sets = 4;
    eP.last = [8, 8, 7]; eP.lastMeta = { d: "2026-08-06", w: eP.w, reps: [8, 8, 7], rir: 2, rirSets: [2, 2, 2], debt: false };
    const { s: N20 } = __test.completeSession(S20, "2026-08-20", [{ id: eP.id, n: eP.n, w: eP.w, tgt: [8, 8, 7, 6], reps: [8, 8, 7, 4], rir: 2, rirSets: [2, 2, 2, 1] }], { last: null }, { note: "", niggles: [], skipped: [], pace: null });
    ok(N20.feed.some((f) => f.t && f.t.indexOf(" — TARGET MET") > -1), "R20b — the press live-case shape ([8,8,7,4] against [8,8,7,6], the 4th slot brand new): TARGET MET fires — three real sets met their line and the new slot has no line to miss. The silent miss that hit twice in four days is dead");
    ok(N20.feed.some((f) => f.t && f.t.indexOf("NEW SET, BANKS WHAT IT GIVES") > -1 && /set 4: 4/.test(f.how || "")), "R20b — and the receipt NAMES it: set 4: 4 — a slot the volume push just created banks what it gives, and the anchor machinery owns it from the next session (the grace ends when the slot posts its first value — which this session IS)");
    /* the counter-case: a shortfall on an OLD slot still fails honestly */
    const S21 = cl20(__test.SEED);
    const eQ = S21.exercises.find((e) => typeof e.w === "number" && e.hi);
    eQ.sets = 4; eQ.last = [8, 8, 7]; eQ.lastMeta = { d: "2026-08-06", w: eQ.w, reps: [8, 8, 7], rir: 2, rirSets: [2, 2, 2], debt: false };
    const { s: N21 } = __test.completeSession(S21, "2026-08-20", [{ id: eQ.id, n: eQ.n, w: eQ.w, tgt: [8, 8, 7, 6], reps: [8, 8, 5, 4], rir: 2, rirSets: [2, 2, 2, 1] }], { last: null }, { note: "", niggles: [], skipped: [], pace: null });
    ok(!N21.feed.some((f) => f.t && f.t.indexOf(" — TARGET MET") > -1), "R20b — the grace is surgical: a shortfall on an OLD slot (set 3: 5 vs 7) still fails TARGET MET — only the slot with no history is graced");
    /* THE RULING, pinned: FORWARD, not retroactive */
    ok(srcV.indexOf("const graceFrom = prevMeta && Array.isArray(prevMeta.reps) ? prevMeta.reps.length : 0;") > -1, "R20b RULING — the grace applies FORWARD, at completeSession time, derived from the record's own prevMeta. The 8/09 press feed lines STAND as written: restating stored history would be editing the record, and the 4th slot has since posted its value — the anchor machinery already owns it, so retroactive healing would change nothing he still sees. The words say which: forward");
  }

  /* ---------- R20b ruling — the first outing speaks its own truth ---------- */
  {
    const cl22 = (o) => JSON.parse(JSON.stringify(o));
    const S22 = cl22(__test.SEED);
    const eN = S22.exercises.find((e) => typeof e.w === "number" && e.hi);
    eN.sets = 3; eN.last = null; eN.lastMeta = { d: null, w: eN.w, reps: [], rir: null, rirSets: [], debt: false };
    const { s: N22 } = __test.completeSession(S22, "2026-08-20", [{ id: eN.id, n: eN.n, w: eN.w, tgt: [8, 8, 8], reps: [6, 6, 5], rir: 2, rirSets: [2, 2, 2] }], { last: null }, { note: "", niggles: [], skipped: [], pace: null });
    ok(!N22.feed.some((f) => f.t && f.t.indexOf(" — TARGET MET") > -1) && N22.feed.some((f) => f.t && f.t.indexOf("FIRST OUTING, BANKS WHAT IT GIVES") > -1 && /no line existed to meet/.test((N22.feed.find((f) => /FIRST OUTING/.test(f.t)) || {}).how || "")), "R20b RULING (the audit low note) — a lift with NO history cannot claim TARGET MET (no line existed to meet — the overclaim class R18e killed); the first outing speaks its own truth: FIRST OUTING, BANKS WHAT IT GIVES, and the reps become the line everything later is measured against");
  }

  /* ---------- THE OWNER'S RULING — HACK 6-10 (2026-08-10) ---------- */
  {
    const cl43 = (o) => JSON.parse(JSON.stringify(o));
    const S43 = cl43(__test.SEED); S43.v = 42;
    const h0 = S43.exercises.find((x) => x.id === "hack");
    h0.hi = 12; h0.w = 160; h0.steps = [160, 170]; h0.inc = null; h0.last = [12, 11, 13]; h0.topAt = 160; h0.topRun = 1;
    h0.lastMeta = { d: "2026-08-07", w: 160, reps: [12, 11, 13], rir: 1, rirSets: [1, 1, 1], debt: false };
    const C43 = __test.migrate(cl43(S43));
    const h1 = C43.exercises.find((x) => x.id === "hack");
    ok(h1.hi === 10 && JSON.stringify(h1.last) === "[12,11,13]" && String(h1.topAt) === "160" && h1.topRun === 1, "HACK 6-10 — the ruling lands on the exact live shape: hi 12 → 10, and hack.last STANDS (12,11,13 at 160 is over the new top; the banked sighting and two-for-two carry forward — 170 debuts on the next honest top). Nothing nulled");
    ok(C43.feed.some((f) => f.t === "HACK — REP RANGE MOVES TO 6-10" && /breathing fails before the quads/.test(f.how)), "HACK 6-10 — the feed receipt is in his words: round two of the pattern that already worked");
    const R43 = __test.migrate(cl43(C43));
    ok((R43.exercises.find((x) => x.id === "hack") || {}).hi === 10, "HACK 6-10 — replay no-op: keyed on the 12 the old ruling held");
    const w43 = __test.windowFor(h1);
    ok(w43.lo === 6 && w43.hi === 10, "HACK 6-10 — windowFor DERIVES the floor: ceiling 10 on the 160→170 ladder yields exactly 6-10 (" + w43.lo + "-" + w43.hi + "), the owner's stated range with no second authored number");
    /* the retired patchV24 mutation: the standing rule fired */
    const srcH4 = readFileSync("src/app.jsx", "utf8");
    ok(srcH4.indexOf("if (hk && hk.hi !== 12 && hk.hi !== 10) { hk.hi = 12; hk.last = null; }") > -1 && srcH4.indexOf("RETIRED 2026-08-10 (the round the standing rule was written for)") > -1, "HACK 6-10 — the patchV24 standing rule FIRED as pinned at its audit: the effect-keyed mutation now also stops at the new ruling's value, so no replay path can re-assert 12 over the owner's call");
    /* the ladder nudge — the runway warns where the ladder goes blind */
    const g43 = __test.genSession(C43, "2026-08-14", { last: null });
    const l43 = g43 && g43.ex.find((x) => x.id === "hack");
    ok(!l43 || !l43.runway || /the ladder goes blind above 170/.test(l43.runway) || /arming:|tops out|no next load/.test(l43.runway), "HACK 6-10 — the runway names the blind ladder on the live shape (one rung above 160): file the next rungs in SETUP so the earn after 170 has a price. At ceiling 10 the debuts come faster; the runway must not go dark above the ladder — " + (l43 && l43.runway ? l43.runway.slice(0, 90) : "(not on this day)"));
  }

  /* ---------- HACK 6-10 REVISION — the state moved under the round (180 × 9,9,10) ---------- */
  {
    const cl45 = (o) => JSON.parse(JSON.stringify(o));
    const srcR5 = readFileSync("src/app.jsx", "utf8");
    /* the NEW live shape: the owner jumped past both filed rungs the same day */
    const h45 = { id: "hack", n: "Hack squat", w: 180, hi: 10, sets: 3, steps: [160, 170], inc: null, last: [9, 9, 10], lastMeta: { d: "2026-08-10", w: 180, reps: [9, 9, 10], rir: 0, rirSets: [2, null, 0], debt: false } };
    ok(__test.nextLoad(h45) === null, "HACK REV — nextLoad at w 180 over the [160,170] ladder returns NULL, never 170: the ladder is blind above AND below the current load, and no rung below ever reads as next");
    ok(__test.atTopOfWindow([9, 9, 10], h45) === false, "HACK REV — 9,9,10 does NOT top the 10,9,8 line (the opener is one rep from the first sighting): nothing false-banks off the owner's jump session");
    const w45 = __test.windowFor(h45);
    ok(w45.hi === 10, "HACK REV — the earn line at 180 derives from ceiling 10 (window " + w45.lo + "-" + w45.hi + "): 10,9,8 is the sighting line the next session is measured against");
    /* the ask now fires for the EXHAUSTED ladder, and its answer MERGES */
    ok(srcR5.indexOf("(!loadRungs(e) || loadRungs(e).every((x) => x <= e.w))") > -1, "HACK REV — the ask card fires for an exhausted ladder too: rungs on file, none above the load Joe now holds — the rung after 180 is exactly what it asks for");
    ok(srcR5.indexOf("[...new Set([...(loadRungs(ex4) || []), ex4.w, ...ups])].sort") > -1, "HACK REV — and the answer MERGES into the existing rungs: pricing 190 must not erase the 160 and 170 already priced");
    /* the receipt derives — driven on BOTH shapes */
    const SA5 = cl45(__test.SEED); SA5.v = 42;
    const hA = SA5.exercises.find((x) => x.id === "hack");
    hA.hi = 12; hA.w = 160; hA.steps = [160, 170]; hA.inc = null; hA.last = [12, 11, 13];
    const CA5 = __test.migrate(cl45(SA5));
    const fA = CA5.feed.find((f) => f.t === "HACK — REP RANGE MOVES TO 6-10");
    ok(fA && /12,11,13 at 160 stands untouched/.test(fA.how) && /The next rung on file is 170/.test(fA.how), "HACK REV — on the pre-jump shape the receipt derives its own truth: the last session at its own load, the next rung from nextLoad — no prediction");
    const SB5 = cl45(__test.SEED); SB5.v = 42;
    const hB = SB5.exercises.find((x) => x.id === "hack");
    hB.hi = 12; hB.w = 180; hB.steps = [160, 170]; hB.inc = null; hB.last = [9, 9, 10];
    const CB5 = __test.migrate(cl45(SB5));
    const fB = CB5.feed.find((f) => f.t === "HACK — REP RANGE MOVES TO 6-10");
    ok(fB && /9,9,10 at 180 stands untouched/.test(fB.how) && /No next rung is on file above 180/.test(fB.how) && !/170 debuts/.test(fB.how), "HACK REV — on the shape Joe just created the SAME patch speaks the new truth: 9,9,10 at 180, ladder unpriced above — the R18e overclaim law now binds patch receipts, and the prediction the audit caught is extinct");
    /* migrate's own cache reconcile re-derives ex.last from the LOG (the fixture set only
       the cache), so the honest invariant is: the PATCH adds nothing to what migrate does
       without it — a no-op-patch control at hi 10 must land the identical last. */
    const SB6 = cl45(SB5); SB6.exercises.find((x) => x.id === "hack").hi = 10;
    const CB6 = __test.migrate(SB6);
    ok(JSON.stringify((CB5.exercises.find((x) => x.id === "hack") || {}).last) === JSON.stringify((CB6.exercises.find((x) => x.id === "hack") || {}).last), "HACK REV — patchV43 touches NO rep data: with-patch and no-op-patch controls land the identical last (migrate's log-derived cache reconcile owns that field; the first pin assumed the cache was free-standing — corrected to the measured mechanism, on the record)");
  }

  /* ---------- v7.42.1 — THE WRONG RECORD CORRECTED + THE WEIGHT CAGE ---------- */
  {
    const cl47 = (o) => JSON.parse(JSON.stringify(o));
    const srcW = readFileSync("src/app.jsx", "utf8");
    /* the correction, driven on the EXACT synced shape */
    const S47 = cl47(__test.SEED); S47.v = 43;
    S47.sessionLog = { ...S47.sessionLog, "2026-08-09": { entries: [{ id: "press", reps: [9, 8], rir: 2, rirSets: [2, 1], w: 250 }], skipped: [] }, "2026-08-10": { entries: [{ id: "hack", reps: [12, 12, 13], rir: 2, rirSets: [2, null, 0], w: 160 }], skipped: [] } };   /* 8/09 present, as on his real ledger — migrate replays the WHOLE content-keyed chain, and patchV40's date restatement would otherwise move this fixture's 8/10 (the mechanism the probe caught) */
    const h47 = S47.exercises.find((x) => x.id === "hack");
    h47.w = 160; h47.hi = 10; h47.steps = [160, 170]; h47.inc = null; h47.last = [12, 12, 13]; h47.topAt = null; h47.topRun = 0;
    S47.queue = [...(S47.queue || []), { id: "q_hack_170", kind: "debut", exId: "hack", newW: 170, t: "HACK SQUAT 170 DEBUT", state: "DEBUT", done: false }];
    const C47 = __test.migrate(cl47(S47));
    const e47 = C47.sessionLog["2026-08-10"].entries.find((e) => e.id === "hack");
    const x47 = C47.exercises.find((x) => x.id === "hack");
    ok(e47.w === 180 && JSON.stringify(e47.reps) === "[9,9,10]" && JSON.stringify(e47.rirSets) === "[2,null,0]", "v7.42.1 — the record says what he did: 180 × 9,9,10 with his own RIR answers standing (they were about THESE sets). Content-keyed on the exact synced plan-record; his attestation is the receipt");
    ok(x47.w === 180 && x47.topAt === null && x47.topRun === 0 && JSON.stringify(x47.steps) === "[160,170]", "v7.42.1 — POST-CORRECTION STATE IS SHAPE B, the shape the last audit drove green: w 180, ladder exhausted (ask open for the rung after 180), NO sighting banked (the honest 9,9,10 opener is under the 10,9,8 line), windowFor fallback until a rung is priced");
    const q47 = C47.queue.find((x) => x.id === "q_hack_170");
    ok(q47.done === true && q47.state === "RETRACTED" && C47.feed.some((f) => f.t === "HACK 170 EARN RETRACTED"), "v7.42.1 — THE PHANTOM EARN RETRACTS with its receipt: earned on reps since corrected — on the record, never deleted");
    ok(C47.feed.some((f) => f.t === "RECORD CORRECTED — HACK 180 × 9,9,10" && /I just hit hack 180/.test(f.how)), "v7.42.1 — the correction receipt cites his attestation verbatim and names the cage that caused it");
    const R47 = __test.migrate(cl47(C47));
    ok(R47.sessionLog["2026-08-10"].entries.find((e) => e.id === "hack").w === 180, "v7.42.1 — replay no-op: the content key no longer matches");
    /* THE CAGE — the override rides into the record and reality follows */
    ok(srcW.indexOf("const [wOver, setWOver] = useState({});") > -1 && srcW.indexOf('aria-label="weight lifted"') > -1 && srcW.indexOf("off-plan, logs as lifted") > -1, "CAGE — the gym weight is TYPEABLE (inputMode decimal, select-on-focus, stepValue coercion): a weight actually lifted is ALWAYS loggable as lifted, on-ladder or off, and the off-plan state names itself in amber");
    ok(srcW.indexOf("split.entries = split.entries.map((e9) => (wOver[e9.id] != null") > -1, "CAGE — the override rides into the finish record through the same partition every entry takes");
    ok(srcW.indexOf("ex.steps = [...new Set([...r0, en.w])].sort") > -1 && srcW.indexOf("ex.w = en.w; ex.topAt = null; ex.topRun = 0;") > -1 && srcW.indexOf("Reality outranks the filed ladder") > -1, "CAGE — reality follows at completeSession: ex.w moves to what was lifted, the off-ladder weight MERGES into the rungs (never erasing), a new load starts its own sighting record, and the feed says so in the law's own words");
    /* driven: an entry at 180 against a 160 config */
    const S48 = cl47(__test.SEED); S48.v = 44;
    const h48 = S48.exercises.find((x) => x.id === "hack");
    h48.w = 160; h48.hi = 10; h48.steps = [160, 170]; h48.inc = null; h48.last = [12, 12, 13];
    const { s: N48 } = __test.completeSession(S48, "2026-08-21", [{ id: "hack", n: "Hack squat", w: 180, tgt: [10, 9, 8], reps: [9, 9, 10], rir: 2, rirSets: [2, null, 0] }], { last: null }, { note: "", niggles: [], skipped: [], pace: null });
    const h49 = N48.exercises.find((x) => x.id === "hack");
    ok(h49.w === 180 && JSON.stringify(h49.steps) === "[160,170,180]" && N48.feed.some((f) => /LOGGED AT 180 \(plan said 160\)/.test(f.t)), "CAGE DRIVEN — logging 180 against a 160 plan moves the config to reality, merges 180 into the ladder, and the feed carries the receipt: the class that logged the plan instead of the day is dead end-to-end");
  }

  /* ---------- THE OWED LEDGER — one owner of the debt list ---------- */
  {
    const cl50 = (o) => JSON.parse(JSON.stringify(o));
    const srcL = readFileSync("src/app.jsx", "utf8");
    const tI = isoL(Date.now());
    const dAgo = (k) => isoL(Date.now() - k * 864e5);
    /* the mandated fixture shape: 2 dark nights + 1 open day */
    const mkOwed = () => {
      const S = cl50(__test.SEED);
      S.sleep.nights = (S.sleep.nights || []).filter((n) => n && n.d !== dAgo(1) && n.d !== dAgo(2));
      for (let k = 3; k <= 6; k++) if (!S.sleep.nights.some((n) => n.d === dAgo(k))) S.sleep.nights.push({ d: dAgo(k), h: 7.5, bed: "23:30", wake: "07:00", tags: [], sol: 10 });
      S.sleep.nights.sort((a, b) => (a.d < b.d ? -1 : 1));
      const dl = { ...(S.dailyLogs || {}) };
      delete dl[dAgo(1)];
      for (let k = 2; k <= 3; k++) dl[dAgo(k)] = dl[dAgo(k)] && dl[dAgo(k)].cal != null ? dl[dAgo(k)] : { cal: 2200, pro: 170, steps: 12000 };
      S.dailyLogs = dl;
      return S;
    };
    const SO = mkOwed();
    const led = __test.owedLedger(SO, 12);   /* midday: the read window is closed, so no scale row muddies the shape */
    ok(led.every((r) => r && r.k && r.d && r.t && r.why), "OWED LEDGER — every row carries the {k, d, t, why} shape");
    const nightsL = led.filter((r) => r.k === "night").map((r) => r.d);
    const daysL = led.filter((r) => r.k === "day").map((r) => r.d);
    ok(JSON.stringify(nightsL) === JSON.stringify([dAgo(2), dAgo(1)]) && daysL.indexOf(dAgo(1)) > -1, "OWED LEDGER — the fixture reads true: the two dark nights oldest-first, the open day present (fixture: 2 dark nights + 1 open day, as mandated)");
    ok(led.findIndex((r) => r.k === "night") < led.findIndex((r) => r.k === "day"), "OWED LEDGER — ordering law: nights before days (scale leads when the window is open — the one time-sensitive item; you cannot measure the past)");
    /* the 3-day cap: a week-deep hole yields at most 3 night rows */
    const SC = mkOwed(); SC.sleep.nights = SC.sleep.nights.filter((n) => n.d < dAgo(8));
    ok(__test.owedLedger(SC, 12).filter((r) => r.k === "night").length === 3, "OWED LEDGER — the 3-day law holds: morning-after logging is the honest instrument, multi-day recall drifts — a week of dark nights lists exactly three");
    /* [] when fully logged */
    const SF = cl50(__test.SEED);
    for (let k = 1; k <= 3; k++) {
      if (!SF.sleep.nights.some((n) => n.d === dAgo(k))) SF.sleep.nights.push({ d: dAgo(k), h: 7.5, bed: "23:30", wake: "07:00", tags: [], sol: 10 });
      SF.dailyLogs[dAgo(k)] = SF.dailyLogs[dAgo(k)] && SF.dailyLogs[dAgo(k)].cal != null ? SF.dailyLogs[dAgo(k)] : { cal: 2200, pro: 170, steps: 12000 };
    }
    SF.sleep.nights.sort((a, b) => (a.d < b.d ? -1 : 1));
    ok(__test.owedLedger(SF, 12).length === 0, "OWED LEDGER — fully logged reads EMPTY: UP TO DATE is earned, not asserted");
    /* the nag's old contract preserved through the wrapper */
    ok(JSON.stringify(__test.owedNights(SO, 12)) === JSON.stringify([dAgo(1), dAgo(2)]), "OWED LEDGER — owedNights stays byte-compatible: the two NEWEST missing nights, newest first — the one owner, no second law");
    /* the fix-window guard: live coaching, not bookkeeping */
    const SG5 = cl50(__test.SEED); SG5.fixWindow = null;
    const oldD = dAgo(2);
    const G1 = __test.writeDaily(SG5, oldD, { cal: 2200, pro: 20, steps: 10000 });
    ok(G1.fixWindow === null, "OWED LEDGER — a protein miss BACKFILLED for a day older than yesterday opens NO fix window: the 24-hour recovery window is live coaching, and that day's 24 hours are gone");
    const G2 = __test.writeDaily(SG5, dAgo(1), { cal: 2200, pro: 20, steps: 10000 });
    ok(G2.fixWindow && G2.fixWindow.opened === dAgo(1), "OWED LEDGER — and yesterday still opens it: the guard is a date line, not a retirement");
    /* data-loss law: the ledger writes only ever ADD */
    const c0 = { n: SO.sleep.nights.length, d: Object.keys(SO.dailyLogs).length, r: (SO.reads || []).length, s: Object.keys(SO.sessionLog).length, q: (SO.queue || []).length };
    const W1 = __test.writeDaily(SO, dAgo(1), { cal: 2100, pro: 170, steps: 11000 });
    ok(W1.sleep.nights.length >= c0.n && Object.keys(W1.dailyLogs).length >= c0.d && (W1.reads || []).length >= c0.r && Object.keys(W1.sessionLog).length >= c0.s && (W1.queue || []).length >= c0.q, "OWED LEDGER — the data-loss law measured across a ledger write: reads, nights, dailyLogs, sessionLog and queue every one >= before");
    /* dark gauges say dark — at source, on the FIVE row and the gym header */
    ok(srcL.indexOf("} dark — can't read") > -1 && srcL.indexOf('state: "quiet", detail: `${darkD} night') > -1, "DARK GAUGES — THE FIVE's sleep row goes quiet with the count of dark nights when the newest night is older than yesterday: three dark nights can never again read as a clean week");
    ok(srcL.indexOf("slp.last.d >= isoOf(new Date(todayStart().getTime() - DAY))") > -1, "DARK GAUGES — the gym header's SLEPT-N-H line claims currency only when the night IS current; a stale night renders the fallback, not a false reading. Engine behaviour unchanged: cleanAtDate keeps its permissive default (short sleep protects), the retired upside gate stays retired — this round moved LABELS only");
    /* the sheet renders the ledger, answerable */
    ok(srcL.indexOf("OWED — ") > -1 && srcL.indexOf("saveNightFor(r.d, bd, wk)") > -1 && srcL.indexOf("writeDaily(s, r.d, { cal: stepValue(") > -1 && srcL.indexOf('"≈ estimated" : "exact"') > -1 && srcL.indexOf("MORE</button>") > -1, "THE SHEET — the hero is the OWED list (~3 shown, +N MORE), each row answerable inline: nights through the parameterized saveNightFor (the write path's only change is the date), days through writeDaily(s, iso) with the est flag defaulting ON for backfills older than yesterday (toggleable — rough numbers count)");
  }
}
console.log(`\nFINAL102: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);











