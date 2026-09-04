"use strict";

// Each engine owns its constant objects; frozen source values are unchanged.
module.exports = function createConstants() {
// Copied from frozen src/app.jsx @ fe516c1:357-357.
const APP_V = "7.56.0";

// Copied from frozen src/app.jsx @ fe516c1:363-363.
const SCHEMA_V = 60;

// Copied from frozen src/app.jsx @ fe516c1:364-364.
const START = "2026-06-10";

// Copied from frozen src/app.jsx @ fe516c1:365-365.
const SEAL_UNTIL = "2026-07-27";

// Copied from frozen src/app.jsx @ fe516c1:366-366.
const CROSSOVER = "2026-08-28";

// Copied from frozen src/app.jsx @ fe516c1:378-381.
const PHASES = {
  "EASE 1": { cal: 1750, band: [1725, 1800], steps: "16–17k", note: "" },
  "EASE 2": { cal: 2375, band: [2350, 2400], steps: "taper ~10–15% off Ease-1", note: "fired by est. BF crossing ~13%" },
};

// Copied from frozen src/app.jsx @ fe516c1:670-678.
const CALL_PLAIN = {
  REVIEW: { chip: "REVIEW", mean: "stall confirmed on comparable sessions — the cause check ran; nothing supports a load cut, so the target stands" },
  "PUSH": { chip: "CHASE", mean: "Beat last time. Add reps wherever you honestly can — weight bumps queue themselves when you hit the standard." },
  "PUSH+": { chip: "CHASE — GREEN LIGHT", mean: "Best conditions you get: refeed fuel aboard, sleep clean. If a record is coming, it comes today." },
  "HOLD": { chip: "REPEAT", mean: "Run the exact same numbers as last time. Nothing banks today, so we protect the pattern instead of spending it." },
  "RESET": { chip: "LIGHTEN", mean: "Drop the weight a notch and rebuild. Grinding a stall just burns recovery — stepping back is how walls fall." },
  "REBUILD": { chip: "CLIMB BACK", mean: "You just lightened this lift. Climb the reps back up — the old numbers usually fall within three sessions." },
  "STAND-DOWN": { chip: "REST TODAY", mean: "The body alarm is on. Today buys nothing worth its cost — walk, eat, sleep, come back." },
};

// Copied from frozen src/app.jsx @ fe516c1:684-684.
const READY_BASELINE_N = 14, READY_SCALE_MAX = 10;

// Copied from frozen src/app.jsx @ fe516c1:1009-1009.
const SET_REALLOCATIONS = [{ id: "calves", setsAt: "2026-08-12T00:00:00.000Z", line: "3 sets today — one calf set was deliberately reallocated to hip thrust in the approved split." }];

// Copied from frozen src/app.jsx @ fe516c1:1195-1195.
const LADDER_MIN_N = 4;

// Copied from frozen src/app.jsx @ fe516c1:1736-1736.
const PACE = { rushed: "rushed", normal: "normal" };

// Copied from frozen src/app.jsx @ fe516c1:1770-1770.
const PUBLISHED_SET_SEM = 0.9;

// Copied from frozen src/app.jsx @ fe516c1:1847-1847.
const RULING_EPOCH = "2026-08-12T00:00:00.000Z";

// Copied from frozen src/app.jsx @ fe516c1:1848-1848.
const SPLIT_DATE = "2026-08-14";

// Copied from frozen src/app.jsx @ fe516c1:1872-1875.
const RULED_ORDER = {
  U: ["lateral", "press", "fly", "pulldown", "rows", "rearDelt", "curl", "tricep", "sulek"],
  L: ["hack", "hipthrust", "extension", "ham", "abs", "hanging", "calves"],
};

// Copied from frozen src/app.jsx @ fe516c1:2021-2021.
const INSERTION_PAIRS = [["fly", []], ["hipthrust", ["ham"]]];

// Copied from frozen src/app.jsx @ fe516c1:2824-2824.
const DRIP_DEFAULT = 0.0;

// Copied from frozen src/app.jsx @ fe516c1:2825-2825.
const DRIP_LO = -0.35, DRIP_HI = 0.10;

// Copied from frozen src/app.jsx @ fe516c1:2826-2826.
const KCAL_PER_LB_FAT = 4282;

// Copied from frozen src/app.jsx @ fe516c1:2827-2827.
const KCAL_PER_LB_LEAN = 816;

// Copied from frozen src/app.jsx @ fe516c1:2828-2828.
const KCAL_PER_LB_MIX = 3800;

// Copied from frozen src/app.jsx @ fe516c1:2833-2833.
const PRIOR_FAT_FRAC = (KCAL_PER_LB_MIX - KCAL_PER_LB_LEAN) / (KCAL_PER_LB_FAT - KCAL_PER_LB_LEAN);

// Copied from frozen src/app.jsx @ fe516c1:2834-2834.
const ANCHOR_ERR_EYE = 3.5, ANCHOR_ERR_DEXA = 1.0;

// Copied from frozen src/app.jsx @ fe516c1:2871-2871.
const SKINFOLD_SITES = ["chest", "abdominal", "thigh", "triceps", "subscapular", "suprailiac", "midaxillary"];

// Copied from frozen src/app.jsx @ fe516c1:2976-2976.
const PROTEIN_FLOOR_G_PER_KG = 2.5;

// Copied from frozen src/app.jsx @ fe516c1:3002-3002.
const PROTEIN_TOL_G = 0;

// Copied from frozen src/app.jsx @ fe516c1:3159-3159.
const T_CRIT_95 = { 1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571, 6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228 };

// Copied from frozen src/app.jsx @ fe516c1:3162-3162.
const TREND_WINDOW = 6;

// Copied from frozen src/app.jsx @ fe516c1:3169-3169.
const TREND_MIN_SESSIONS = 4;

// Copied from frozen src/app.jsx @ fe516c1:3170-3170.
const TREND_MIN_LIFTS = 4;

// Copied from frozen src/app.jsx @ fe516c1:3171-3171.
const TREND_SE_FLOOR = 0.001;

// Copied from frozen src/app.jsx @ fe516c1:3172-3172.
const TREND_CLEAN_MIN_SESSIONS = 3;

// Copied from frozen src/app.jsx @ fe516c1:3173-3173.
const FLAT_HALFWIDTH = 1.5;

// Copied from frozen src/app.jsx @ fe516c1:3406-3406.
const REGIME_HOLD_D = 7;

// Copied from frozen src/app.jsx @ fe516c1:3519-3519.
const RATE_DP = 1;

// Copied from frozen src/app.jsx @ fe516c1:3520-3520.
const PACE_PROJ_WKS = 4;

// Copied from frozen src/app.jsx @ fe516c1:3558-3558.
const STALE_DAYS = 3;

// Copied from frozen src/app.jsx @ fe516c1:3724-3724.
const WALK_J_PER_KG_M = 2.4, WALK_J_LO = 2.0, WALK_J_HI = 2.8;

// Copied from frozen src/app.jsx @ fe516c1:3725-3725.
const STEP_LEN_M = 0.75;

// Copied from frozen src/app.jsx @ fe516c1:3895-3900.
const DEFICIT_CEILING = {
  kcal: 500,   /* N1 — a GRADED PRIOR, not a law: the mechanism never enforced it and the words no longer claim it */
  claim: "treat deficit size as a graded risk — larger deficits buy lean-tissue loss on average, with wide individual spread",
  hedge: "the ~500 figure is a population meta-regression whose participants averaged 51-60 years old — at 24 it is a hedge, not a wall; the corridor stays the steering target, 0.70%/wk is the upper DEFAULT (the slower arm of one confounded trial, not a discovered optimum), the 1.0%/wk redline matches the fast arm's ACHIEVED rate, and your own green outcomes arbitrate. Hard stops are reserved for genuine health and recovery red flags",
  line() { return this.claim + " (" + this.hedge + ")"; },
};

// Copied from frozen src/app.jsx @ fe516c1:3947-3947.
const EXIT_HOLD_MIN_WK = 2, EXIT_HOLD_FULL_WK = 4;

// Copied from frozen src/app.jsx @ fe516c1:4038-4038.
const GAIN_FAT_FRAC = 0.45, GAIN_FAT_FRAC_LO = 0.30, GAIN_FAT_FRAC_HI = 0.60;

// Copied from frozen src/app.jsx @ fe516c1:4116-4116.
const COSTING_SEVERE_SE = 1.96;

// Copied from frozen src/app.jsx @ fe516c1:4407-4407.
const EA_SPARING = 25;

// Copied from frozen src/app.jsx @ fe516c1:4408-4408.
const EA_LOW = 20;

// Copied from frozen src/app.jsx @ fe516c1:4409-4409.
const EA_STEP_BASELINE = 4000;

// Copied from frozen src/app.jsx @ fe516c1:4414-4414.
const EA_KCAL_PER_1K_STEPS_PER_KG = +(WALK_J_PER_KG_M * STEP_LEN_M * 1000 / 4184).toFixed(3);

// Copied from frozen src/app.jsx @ fe516c1:4415-4415.
const EA_KCAL_PER_SESSION = 300;

// Copied from frozen src/app.jsx @ fe516c1:4523-4573.
const BC = {
  // CUT · rate. Garthe & Raastad 2011 (IJSNEM 21(2):97) randomised two weight-loss rates in elite
  // athletes on a strength programme: the SLOW 0.7%/wk arm GAINED lean body mass (+2.1% ±0.4,
  // p<.001) while the FAST 1.4%/wk arm was lean-NEUTRAL (−0.2% ±0.7), between-group p<.01 — on
  // matched total weight lost. So 0.7%/wk is the lean-preserving optimum, and 1.0%/wk is a
  // conservative redline set BELOW the study's 1.4%/wk fast arm. The gauge copy reads the exact
  // figures from the named constants below (v6.2 audit — corrected the earlier +1.7%/−2.0%).
  CUT_REDLINE_PCT: 1.0,
  CUT_FLOOR_PCT: 0.5,           // Ruiz-Castellano 2021 - low end of the 0.5-1.0 %BW/wk retention band. Replaces an authored 0.8 lb, which at 163 lb IS 0.49 %BW: the conversion changes nothing visible today and starts behaving correctly as he leans out.          // Garthe 2011 — conservative cap below the 1.4%/wk fast arm
  CUT_OPT_PCT: 0.70,             // Garthe 2011 lean-preserving optimum (the +2.1% LBM arm)
  CUT_GARTHE_SLOW_RATE: 0.7, CUT_GARTHE_FAST_RATE: 1.4,     // the two study arms (%BW/wk)
  CUT_GARTHE_SLOW_LBM: 2.1, CUT_GARTHE_FAST_LBM: -0.2,      // LBM change per arm (%, Garthe 2011)
  // MODE SLICES (v6.2.1) — Auto-Pilot's two cut modes are two slices of THIS one corridor, each
  // edge a cited constant above. s.plan.apMode picks the slice EVERY downstream number steers to
  // (calorie band, gauge, protocol, proposals) via cutRateBand() — not just the Auto-Pilot gauge.
  CUT_RECOMP_PCT: [0.60, 0.70],   // MAX BODY COMP  — at/below the lean-preserving optimum (CUT_OPT_PCT 0.70)
  CUT_FATLOSS_PCT: [0.85, 1.00],  // MAX FAT LOSS   — old corridor ceiling up to the conservative redline (CUT_REDLINE_PCT 1.00)
  // CUT · partition. KCAL_PER_LB_MIX (3800) ≈ 87% fat / 13% lean for a lean high-protein
  // trained male (Hall 2008: fat 4282, lean 816 kcal/lb). Lean fraction rises with rate:
  // deficit magnitude is the lean-mass variable (Murphy & Koehler 2022); leanness is a
  // headwind (Forbes via Hall 2007, up to ~49% FFM at low fat mass).
  CUT_LEAN_BASE: 0.13, CUT_LEAN_SLOPE: 0.35, CUT_LEAN_MIN: 0.06, CUT_LEAN_MAX: 0.50,
  // CUT · resistance-training retention. Progressive RT + adequate protein preserve most of the
  // lean a deficit would otherwise take (Longland 2016: 2.4 g/kg + RT recomposed in a deficit;
  // Helms 2014; Murphy & Koehler 2022: training and protein ARE the lean-mass levers). Applied to
  // the lean fraction and GATED on actual training adherence, so a missed block degrades the
  // projection honestly. The app still never projects lean GAIN in a deficit (drip stays 0) — the
  // best honest case shown is lean HELD, i.e. recomposition = fat off, muscle retained.
  CUT_RT_RETENTION: 0.70,       // Longland 2016 / Helms 2014 / Murphy & Koehler 2022
  // BULK · rate. An ADVANCED multi-year-trained lifter's lean-bulk surplus is ~0.125–0.25 %BW/wk
  // weight gain (Aragon & Schoenfeld 2020 / Lyle McDonald muscular-potential model). Iraki 2019's
  // 0.25–0.5 %BW/wk is the novice/intermediate band; above ~0.25%/wk an advanced lifter's surplus
  // spills to fat (Slater 2019: no controlled surplus-size trial exists — practitioner band,
  // labelled as such in the UI). Brackets BULK_LEAN_CEIL_PCT (0.15). [v6.2 audit 4b recalibration]
  /* N4 — THE MONTHLY BAND IS THE RULING UNIT: 0.25–0.5 %BW/MONTH, redline 0.5/month
     (the settled cap). The weekly literals below are that band ÷ 4.345, kept weekly
     ONLY because every internal consumer prices per-week — no instrument anywhere may
     permit faster than 0.5 %BW/month. The old [0.125,0.25]/wk corridor = 0.54–1.08
     %/month sat ENTIRELY above the cap — the erratum ran the full depth. */
  BULK_CORR_PCT: [0.0575, 0.1151], BULK_REDLINE_PCT: 0.1151,
  // BULK · lean-gain ceiling by training age (Aragon & Schoenfeld 2020 / Lyle McDonald model of
  // muscular potential): intermediate ~0.25 %BW/wk, advanced ~0.125. Multi-year trained → the
  // advanced-leaning midpoint. Used as the lean cap on a bulk.
  BULK_LEAN_CEIL_PCT: 0.0921,   // N4 — 0.4 %BW/MONTH ÷ 4.345, reconciled INSIDE the monthly corridor (the old 0.15/wk = 0.65/month also broke the cap)
  BULK_LEAN_BASE: 0.55, BULK_LEAN_SLOPE: 0.60, BULK_LEAN_MIN: 0.15, BULK_LEAN_MAX: 0.60,
  // PROTEIN · the partition lever. CUT lean-retention floor is FFM-based and already derived in
  // proteinTarget (2.5 g/kg FFM: the 2025 Bayesian meta-regression's zero-crossing for net FFM change, authorship TBC; Helms 2014;
  // Longland 2016, where 2.4 g/kg recomposed in a deficit). BULK MPS saturates at ~1.6 g/kg BW
  // (Morton 2018 meta-analysis) — no added hypertrophy above it.
  BULK_PROTEIN_G_PER_KG_BW: 1.6,   // Morton 2018
};

// Copied from frozen src/app.jsx @ fe516c1:4744-4744.
const PARTITION_FORBES_SLOPE = 0.010;

// Copied from frozen src/app.jsx @ fe516c1:4745-4745.
const PARTITION_REF_BF = 15;

// Copied from frozen src/app.jsx @ fe516c1:4746-4746.
const PARTITION_ANCHORS_TO_NARROW = 2;

// Copied from frozen src/app.jsx @ fe516c1:4747-4747.
const PARTITION_LABEL = "partition (fat vs lean of each lb lost) — a RANGE, not a point: only weakly identifiable from the scale, it needs repeated DEXA anchors over months to narrow (Forbes). Governed by your body-fat level.";

// Copied from frozen src/app.jsx @ fe516c1:4812-4812.
const TDEE_EMA_ALPHA = 0.10;

// Copied from frozen src/app.jsx @ fe516c1:4813-4813.
const TDEE_CONVERGE_MIN = 10;

// Copied from frozen src/app.jsx @ fe516c1:4814-4814.
const TDEE_ACC_LO = 130, TDEE_ACC_HI = 215;

// Copied from frozen src/app.jsx @ fe516c1:4815-4815.
const TDEE_LABEL = "apparent maintenance under a 3,500-kcal/lb convention, including net log error — not a physiological measurement";

// Copied from frozen src/app.jsx @ fe516c1:4855-4855.
const MAINT_KCAL_PER_LB = 12;

// Copied from frozen src/app.jsx @ fe516c1:4856-4856.
const ADAPT_PERSIST_MIN = 3;

// Copied from frozen src/app.jsx @ fe516c1:4857-4857.
const ADAPT_LABEL = "unexplained residual (observed minus mass-predicted maintenance) — informs forecasts only; never a phase transition, never a diet-break trigger";

// Copied from frozen src/app.jsx @ fe516c1:4939-4951.
const FORE = {
  // Prediction-interval multipliers (Topic 5): 80/90/95% = 1.28/1.64/1.96 σ.
  PI80: 1.28, PI90: 1.64, PI95: 1.96,
  // Horizon-widening exponents. A LEVEL/EWMA forecast's σ grows ∝ √h (the random-walk form);
  // a SLOPE/TREND forecast's σ grows ∝ h^1.5 — the moment you extrapolate a RATE rather than a
  // LEVEL, uncertainty fans SUPER-LINEARLY. This is the whole honesty of the cone.
  LEVEL_EXP: 0.5, SLOPE_EXP: 1.5,
  H_MAX: 26,     // weeks — the cone's display horizon (~6 months)
  H_INFO: 20,    // weeks — the informative horizon for a crossing alert; past this a straight line
                 // over-predicts loss (a Hall dynamic model bends toward a plateau) so we do not quote it
  P_FIRE: 0.20,  // fire the redline alert at a LOW probability — muscle loss is costly, so the bar is
                 // low — but always PHRASE it honestly (a probability + a range, never a certainty)
};

// Copied from frozen src/app.jsx @ fe516c1:5357-5357.
const AUTONOMY_LEVELS = ["propose", "autonotice", "runit"];

// Copied from frozen src/app.jsx @ fe516c1:5358-5365.
const AUTONOMY_META = {
  propose:    { rank: 0, label: "PROPOSE & APPROVE", short: "Propose & approve", tag: "you approve every move",
                blurb: "I propose every adjustment; nothing moves until you tap approve." },
  autonotice: { rank: 1, label: "AUTO, WITH NOTICE", short: "Auto, with notice", tag: "I handle routine, you're told",
                blurb: "I handle routine in-corridor adjustments and tell you — one tap to undo. Anything bigger, ambiguous, or near a floor still asks you first." },
  runit:      { rank: 2, label: "RUN IT", short: "Run it", tag: "routine on autopilot; only real calls reach you",
                blurb: "I run the routine moves and only surface the calls that genuinely need you. Every move stays one-tap reversible." },
};

// Copied from frozen src/app.jsx @ fe516c1:5374-5374.
const AUTO_MAG_KCAL = 200;

// Copied from frozen src/app.jsx @ fe516c1:5375-5375.
const TRACK_ROWS = 12;

// Copied from frozen src/app.jsx @ fe516c1:5376-5376.
const GRADE_LAG = 7;

// Copied from frozen src/app.jsx @ fe516c1:5521-5526.
const PHASE_META = {
  cut:         { key: "cut",         label: "CUT",              toneKey: "gauge" },
  break:       { key: "break",       label: "DIET BREAK",       toneKey: "steel" },
  maintenance: { key: "maintenance", label: "MAINTENANCE HOLD", toneKey: "brass" },
  leangain:    { key: "leangain",    label: "LEAN GAIN",        toneKey: "jade"  },
};

// Copied from frozen src/app.jsx @ fe516c1:5527-5527.
const PHASE_ORDER = ["cut", "break", "maintenance", "leangain"];

// Copied from frozen src/app.jsx @ fe516c1:5528-5528.
const BREAK_LEN_DAYS = 7;

// Copied from frozen src/app.jsx @ fe516c1:5529-5529.
const BREAK_RECENT_DAYS = 10;

// Copied from frozen src/app.jsx @ fe516c1:6992-6992.
const DEBT_LAST_H = 6.5;

// Copied from frozen src/app.jsx @ fe516c1:6993-6993.
const DEBT_MEAN3_H = 7.0;

// Copied from frozen src/app.jsx @ fe516c1:7056-7056.
const SLEEP_ANCHOR_MIN_N = 3;

// Copied from frozen src/app.jsx @ fe516c1:7205-7205.
const STEP_PUSH_WEEKLY = 1000;

// Copied from frozen src/app.jsx @ fe516c1:7206-7206.
const STEP_PUSH_CAP_OVER_BASE = 3000;

// Copied from frozen src/app.jsx @ fe516c1:7217-7217.
const STEP_PUSH_ABS_CEIL = 20000;

// Copied from frozen src/app.jsx @ fe516c1:8343-8343.
const VOL_BANDS = { floor: 6, lo: 8, hi: 14, ceil: 22 };

// Copied from frozen src/app.jsx @ fe516c1:8344-8344.
const INDIRECT = { press: { triceps: 0.5, delts: 0.5 }, rows: { biceps: 0.5 }, pulldown: { biceps: 0.5 }, curl: { forearms: 0.5 } };

// Copied from frozen src/app.jsx @ fe516c1:8360-8360.
const MG_LABEL = { delts_side: "side delt", delts_rear: "rear delt", delts_front: "front delt" };

// Copied from frozen src/app.jsx @ fe516c1:8712-8712.
const HYP_SDES = 2.05, HYP_B = 1.76;

// Copied from frozen src/app.jsx @ fe516c1:8855-8855.
const DELIVERED_MAJ = 0.5;

// Copied from frozen src/app.jsx @ fe516c1:8856-8856.
const REVIEW_DELIV_D = 14;

// Copied from frozen src/app.jsx @ fe516c1:8857-8857.
const REVIEW_OUTCOME_D = 56;

// Copied from frozen src/app.jsx @ fe516c1:8858-8858.
const REVIEW_CLASSIFY_D = 84;

// Copied from frozen src/app.jsx @ fe516c1:9003-9003.
const VOL_PUSH_CEIL_WK = VOL_BANDS.ceil;

// Copied from frozen src/app.jsx @ fe516c1:9004-9004.
const VOL_SESS_CAP = 8;

// Copied from frozen src/app.jsx @ fe516c1:9005-9005.
const VOL_REVIEW_LO = VOL_BANDS.hi + 1;

// Copied from frozen src/app.jsx @ fe516c1:9006-9006.
const VOL_REVIEW_HI = 18;

// Copied from frozen src/app.jsx @ fe516c1:9007-9007.
const WEEKS_PER_MONTH = 4.345;

// Copied from frozen src/app.jsx @ fe516c1:9008-9008.
const GAIN_CAP_PCT_MO = 0.5;

// Copied from frozen src/app.jsx @ fe516c1:9009-9009.
const SURPLUS_HOLD_D = 28;

// Copied from frozen src/app.jsx @ fe516c1:9010-9010.
const SURPLUS_BATCH_MAX = 2;

// Copied from frozen src/app.jsx @ fe516c1:10287-10287.
const LATE_READ_HOW = "a read after the morning window — local noon, or once today's session is logged — runs 1–2 lb heavy against a morning-standardized trend; recorded, set aside; tomorrow morning is the instrument.";

// Copied from frozen src/app.jsx @ fe516c1:13466-13466.
const CACHE_RIDERS = ["last", "lastMeta"];

// Copied from frozen src/app.jsx @ fe516c1:13960-13960.
const PLAN_POLICY_SCALARS = ["apMode", "autonomy", "phase", "brk"];

// Copied from frozen src/app.jsx @ fe516c1:14523-14523.
const EVENT_LEAD_D = 1;

// Copied from frozen src/app.jsx @ fe516c1:14524-14524.
const EVENT_GRACE_D = 7;

// Copied from frozen src/app.jsx @ fe516c1:15237-15237.
const NOW_DOORS = { capture: "now.capture2", briefing: "now.briefing", room: "now.room", inbox: "now.inbox" };

// Copied from frozen src/app.jsx @ fe516c1:15241-15241.
const TRAIN_DOORS = { setup: "train.setup", read: "train.read", record: "train.record" };

// Copied from frozen src/app.jsx @ fe516c1:15294-15294.
const STATUS_WORDS = ["ON COURSE", "ADJUSTING", "NEEDS YOU", "CALIBRATING", "HOLDING"];

return { APP_V, SCHEMA_V, START, SEAL_UNTIL, CROSSOVER, PHASES, CALL_PLAIN, READY_BASELINE_N, READY_SCALE_MAX, SET_REALLOCATIONS, LADDER_MIN_N, PACE, PUBLISHED_SET_SEM, RULING_EPOCH, SPLIT_DATE, RULED_ORDER, INSERTION_PAIRS, DRIP_DEFAULT, DRIP_LO, DRIP_HI, KCAL_PER_LB_FAT, KCAL_PER_LB_LEAN, KCAL_PER_LB_MIX, PRIOR_FAT_FRAC, ANCHOR_ERR_EYE, ANCHOR_ERR_DEXA, SKINFOLD_SITES, PROTEIN_FLOOR_G_PER_KG, PROTEIN_TOL_G, T_CRIT_95, TREND_WINDOW, TREND_MIN_SESSIONS, TREND_MIN_LIFTS, TREND_SE_FLOOR, TREND_CLEAN_MIN_SESSIONS, FLAT_HALFWIDTH, REGIME_HOLD_D, RATE_DP, PACE_PROJ_WKS, STALE_DAYS, WALK_J_PER_KG_M, WALK_J_LO, WALK_J_HI, STEP_LEN_M, DEFICIT_CEILING, EXIT_HOLD_MIN_WK, EXIT_HOLD_FULL_WK, GAIN_FAT_FRAC, GAIN_FAT_FRAC_LO, GAIN_FAT_FRAC_HI, COSTING_SEVERE_SE, EA_SPARING, EA_LOW, EA_STEP_BASELINE, EA_KCAL_PER_1K_STEPS_PER_KG, EA_KCAL_PER_SESSION, BC, PARTITION_FORBES_SLOPE, PARTITION_REF_BF, PARTITION_ANCHORS_TO_NARROW, PARTITION_LABEL, TDEE_EMA_ALPHA, TDEE_CONVERGE_MIN, TDEE_ACC_LO, TDEE_ACC_HI, TDEE_LABEL, MAINT_KCAL_PER_LB, ADAPT_PERSIST_MIN, ADAPT_LABEL, FORE, AUTONOMY_LEVELS, AUTONOMY_META, AUTO_MAG_KCAL, TRACK_ROWS, GRADE_LAG, PHASE_META, PHASE_ORDER, BREAK_LEN_DAYS, BREAK_RECENT_DAYS, DEBT_LAST_H, DEBT_MEAN3_H, SLEEP_ANCHOR_MIN_N, STEP_PUSH_WEEKLY, STEP_PUSH_CAP_OVER_BASE, STEP_PUSH_ABS_CEIL, VOL_BANDS, INDIRECT, MG_LABEL, HYP_SDES, HYP_B, DELIVERED_MAJ, REVIEW_DELIV_D, REVIEW_OUTCOME_D, REVIEW_CLASSIFY_D, VOL_PUSH_CEIL_WK, VOL_SESS_CAP, VOL_REVIEW_LO, VOL_REVIEW_HI, WEEKS_PER_MONTH, GAIN_CAP_PCT_MO, SURPLUS_HOLD_D, SURPLUS_BATCH_MAX, LATE_READ_HOW, CACHE_RIDERS, PLAN_POLICY_SCALARS, EVENT_LEAD_D, EVENT_GRACE_D, NOW_DOORS, TRAIN_DOORS, STATUS_WORDS };
};
