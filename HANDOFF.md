# PREP LEDGER — HANDOFF

> **§0 below is the branch handoff for `audit/research-corpus` (v4.0.0), written
> 2026-07-29. §1 onward is the older general onboarding brief — still broadly
> useful but has DRIFTED — see §0.14 for corrections before trusting its
> numbers.**

---

# §0 · BRANCH HANDOFF — `audit/research-corpus` → v4.0.0

**Status: 10 commits, pushed, NOT merged, NOT deployed. Nothing has reached the
athlete's phone.** Suite green at 856 assertions. Working tree clean, no stashes.

## 0.1 · What the research corpus is, and what it is for

`research-brief.md` (repo root, ~450 lines) is the evidence base this app's
design decisions are supposed to rest on. `GOALS.md` — the athlete's own charter,
also on this branch — instructs every session to **read it before researching
anything new** and to *extend* rather than restart it.

It is organised as: progression & records · volume & set counting · **exercise
selection** · nutrition · training mechanics · the diet exit · morning
monitoring · **NEGATIVE FINDINGS** · **RECURRING FAILURE MODES IN THIS
CODEBASE** · what is still open.

Two sections matter more than the rest:

- **NEGATIVE FINDINGS** lists nine rules retired for having no evidence behind
  them (clean-sleep gate, weekly refeeds, "defend load on a cut", lengthened
  partials as a system, rep tempo, slow eccentrics, periodisation, planned
  deloads, machines-inferior-to-free-weights). **Do not reintroduce these.** Each
  one was in the app, shipped, and being acted on.
- **RECURRING FAILURE MODES** is the meta-lesson and the reason the file exists.

## 0.2 · The one thing to understand before touching anything

**The dominant defect in this codebase is not wrong research. It is research
that was written down and then not enforced in code.** This happened three
separate times *in the session that produced this branch*:

1. The clean-sleep gate was retired in `progressStep`, then found alive in
   **eleven** other places — two of which (`liftCall`, `rirPlan`) still decided
   what the athlete lifted.
2. `patchV33` split the deltoids into heads, retracted a card built on the pooled
   bucket, and told the athlete so in his feed — while `muscleVolume()` kept
   counting by pooled muscle, so the TRAIN screen went on printing
   `delts 17 OVER` in red for three more commits.
3. `research-brief.md` already contained *"Retention is cheap; growth is
   expensive"* with both citations, while `volumeImbalance()` was preparing to
   propose **+7 weekly sets** to a man in a deficit.

**When you merge: grep for the claim, not just the function.** A rule that
survives only in copy is still a rule, because he reads the copy.

## 0.3 · What is done

| area | state |
|---|---|
| clean-sleep gate | removed from engine **and** all copy; `patchV34` migrates saved state |
| authored constants | 9 removed — protein 175, steps 16.5k, cal floor 1700, 3500 kcal/lb (was used **three different ways** in one app), 16500/1760/2450 in the two consoles |
| protein | derived from lean mass; now a **floor**, not a symmetric band; carries a range (160–190) because his BF interval straddles the 12.2% subgroup line |
| body fat | band surfaced everywhere the point estimate appears |
| countdowns | Aug 28 / `CROSSOVER` mechanics removed (4 sites) — GOALS.md forbids them, no date is set |
| diet exit | rebuilt to his stated plan: one step to **measured** maintenance, hold, then decide. No ramp, no assumed surplus |
| volume | **phase-aware** — growth band does not apply during a deficit |
| exercise selection | audited; `exerciseSelection()`; his is already optimal |
| Analyst | law sheet + canonical block rebuilt; no authored constants reach the prompt |
| nav | static demotion to NOW / TRAIN / MORE |
| NOW | time-aware via `nowFocus()`; reading collapsed behind one tap |
| tests | 856 assertions, `MIN_ASSERTIONS = 850`; render-smoke walks demoted rooms via MORE |

## 0.4 · What is NOT done

- **No visual/polish pass.** Everything was correctness and structure. Typography,
  spacing, touch targets, colour consistency — untouched.
- **Research topics brainstormed but not run.** In priority order for this
  athlete: (1) how to actually shift a bedtime — light exposure, chronotype;
  (2) caffeine ~350 mg **interacting with his stimulant medication**, against a
  01:40 bedtime that is his single largest body-composition lever;
  (3) NEAT compensation in a deficit — erodes the measured maintenance the whole
  calorie band hangs off; (4) getting a real body-fat anchor (currently
  "coach's eye, ±3.5" — the widest uncertainty in the app, and the sole reason
  protein is a range rather than a number). Then: satiety/fibre, creatine,
  alcohol, waist+photos (he has **zero** of each logged), implementation
  intentions.
- **Hamstrings at 4 sets/week** is a real gap, deliberately **filed not proposed**
  until the deficit ends. See §0.5.
- `GOALS.md` line ~109 still says the surplus is added on top of the diet-exit
  figure. He has since said *straight to maintenance, hold, then decide* — the
  code reflects that, the charter has not been updated.

## 0.5 · Decisions that are not obvious from the files

- **Volume is phase-aware on purpose.** Pelland 2025's 6–12 band is a *growth*
  dose-response measured in people eating enough to build. Roth 2023 (n=38, 6 wk,
  30 kcal/kg deficit, 2.8 g/kg protein — nearly this athlete's exact situation)
  found ~20 weekly sets and ~12 preserved lean mass **identically** (−0.51 vs
  −0.92 kg, ns; no muscle-thickness difference). Bickel 2011 held young adults'
  thigh lean mass for 32 weeks on **one-ninth** of the volume that built it.
  `volumeImbalance()` returns `cutting` / `actionable`; the proposal fires only
  once `targets.exitStart` is set. **Do not "fix" this by making it always fire.**
- **Sleep is a body-composition lever, not a session lever.** Craven 2022 puts
  acute sleep loss at −2.85% on strength, inside test-retest CV. Nedeltcheva 2010
  puts 5.5 h vs 8.5 h at ~60% more of the loss coming off fat-free mass at a
  matched deficit. The app must never gate a rep on sleep again.
- **Bedtime, not wake time, is the named lever.** His measured clock: bed 01:45
  (±20 min), wake 09:00 (±43 min). Bedtime is the *steadier* end, so it is the one
  he can move. The app previously advised "fixed wake time is the strongest
  single move" — aimed at the end he controls least.
- **Triceps: closed, do not reopen.** Overhead beats pushdown for the long head
  (d = 0.54–0.61), but his Prime 3-peg changes the **resistance profile**, not the
  **shoulder angle** — the old `q_peg` item confused the two variables. Shown the
  case, he chose to keep the Prime. `patchV34` closes it.
- **Nav is static by design, never adaptive.** Findlater & McGrenere (CHI 2004,
  n=27): static 306.5 s, adaptive **331.6 s** (~8% slower — repositioning destroys
  spatial memory), adaptable 300.7 s once customised and preferred 15:4. **Do not
  make the tab bar promote whichever tab has news.**
- **The logging ACT is deliberately still manual.** Lower-burden methods
  (wearable, photo) produced *worse* habit formation and less than half the weight
  loss (−3.0 vs −6.8 kg, p<0.001) than a higher-burden manual app. What was cut is
  the *distance* to the act, not the act.
- **`proteinHit` tolerance is 0, deliberately.** A ±10 g band belongs around a
  bullseye; subtracting it from a *floor* just moves the floor and creates a third
  number. The app was simultaneously saying "under 158 is not defended", "anywhere
  160–190 counts", and actually passing 150.

## 0.6 · Migration safety — read before merging

`SCHEMA_V = 34`. `patchV34` rewrites queue copy, migrates `q_pivot` to the new
exit plan, and closes `q_peg`. Two invariants, both test-covered:

1. **It never touches a `done` queue item.** A finished item's `gate` field is a
   *receipt*, not a gate — `q_hack3` on his live state reads `"Debuted 7,8,7"`.
   An earlier draft of this migration would have overwritten it. That is data
   loss on a GOALS.md hard guardrail.
2. **It is idempotent** — re-running files no duplicate feed entries.

Verified against the real `ledger/state.json`: 46 reads / 42 nights / 47 dailyLogs
/ 4 sessions / 13 queue items all intact, every done-item receipt preserved.

## 0.7 · Environment warning — this bit us

The nightly analyst pipeline ran at **05:05 on 2026-07-29**, did
`pull --rebase --autostash origin main`, rebased this branch cleanly, then
**left the repo checked out on `main`** and committed there at 05:14. Subsequent
edits landed on `main` by accident and had to be recovered.

Nothing was lost, but that was luck: `--autostash` means uncommitted work would
have gone into a stash nobody would think to look for. **The pipeline and any
interactive agent are editing the same working copy with no coordination.**
Consider making it refuse to run when a feature branch is checked out, or having
it restore the previous branch. Not changed here — it is the owner's automation.

## 0.9 · How to find defects in this codebase (the method that worked)

Roughly fifty real defects came out of one session using two questions. Both are
mechanical and neither needs new research:

1. **"Does the code keep this claim?"** Take any sentence the app shows the
   athlete and go find the line that enforces it. The gap between copy and
   behaviour is where nearly everything was hiding — a retired rule still stated
   as fact, a card displaying a derived number while the logic judged a constant,
   a charter clause the engine stopped honouring.
2. **"Where did this number come from?"** Any literal in a computation or on a
   screen is guilty until it can name its source. Nine authored constants fell to
   this. The tell is a round number: 175, 1700, 16500, 3500.

A third, learned late: **grep for the same quantity computed twice.** `3500`
vs `KCAL_PER_LB_MIX` vs `KCAL_PER_LB_FAT` were three conversions of one quantity
in one app. Two surfaces disagreeing about the same number is the app's single
most common failure shape.

**Verify against `ledger/state.json`, never only against `SEED`.** The seed is
idealised; his real state has gaps, done items, historical text and edge cases the
seed does not. Several defects — including the migration data loss — were only
visible against the real file.

**Use adversarial review, and do not skip it because the work feels finished.**
Two independent review passes over this session's own diff found **30 further
defects**, including a migration that would have destroyed a queue receipt and
Morning-Minute defaults that would have written authored bed/wake times into the
sleep record, silently poisoning the measured clock every other surface had just
been rebuilt on. The author could not find these. Budget for the second pass.

## 0.10 · Mistakes made in this session, so they are not repeated

- **Compounding estimate errors.** An early answer put his deficit at ~1,100
  kcal/day: it used the *prescribed* intake instead of the *logged* one, trusted
  a mean-of-two-snapshots rate (the noisiest available estimator), and hit a
  clamp that saturated. Three small errors, one large wrong number. Prefer the
  regression, prefer logged over prescribed, and check whether a clamp is binding.
- **"Leaner" used to mean "ate less"** in an app that tracks lean mass as a
  quantity — while he was six pounds heavier in the period described. There is a
  RESERVED-words test guarding this now. Say kcal and steps.
- **A recommendation built on a pooled muscle bucket**, sized below the
  literature's own smallest detectable effect. Retracted via `patchV33`. Check any
  proposal against the SDES before it ships.
- **Regexes written through a shell heredoc lost their backslashes** (`\s`→`s`,
  `\d`→`d`) and silently matched nothing. Author source edits through a script
  file, not a heredoc.
- **Offering the athlete an option the evidence rejects.** He was asked whether
  the nav should adapt; adaptive was the *worst* of the three measured options.
  Research before offering choices, not after.

## 0.11 · What would most improve the app's ability to serve its goal

Ranked by expected effect on the actual objective — best body-composition change,
fastest — not by how interesting they are to build:

1. **A real body-fat anchor.** The current one is "coach's eye, ±3.5 points."
   That single uncertainty is why protein is a *range* rather than a number, why
   the diet-exit prompt cannot fire on a point estimate, and why several
   instruments have to hedge. A DEXA collapses it and sharpens everything
   downstream. `q_dexa` is already in the queue.
2. **Waist and photos.** He has logged **zero** of each. They are the two
   body-composition measures that do not lie and they cost nothing. The scale
   cannot distinguish fat from water; these can.
3. **The bedtime research.** The lever is identified (bed ~25 min earlier) but
   *how to actually move a bedtime* was never researched — light exposure,
   chronotype, whether he is a genuine late type. Sleep is his largest
   body-composition lever and only half the job is done.
4. **Caffeine (~350 mg) interacting with his prescribed stimulant**, against a
   01:40 bedtime. Both are logged, neither has been researched, and they plausibly
   *cause* the thing identified as his biggest lever.
5. **NEAT compensation.** In a deficit, non-exercise movement falls involuntarily.
   It is the main reason measured maintenance drifts down over a cut — and his
   entire calorie band is derived from that maintenance figure.

## 0.12 · Working with this athlete

- **Ask him.** Four direct questions produced four of this session's best
  decisions — including confirming his exercise selection was already optimal,
  which redirected the whole training audit and saved proposing changes he did not
  need. He answers decisively and without hedging.
- **He uses NOW, TRAIN and the Analyst.** LAB occasionally, BODY very rarely.
  This was only learned by asking, and it should govern where design effort goes.
  A fix on BODY reaches him rarely; a fix on NOW reaches him twice a day.
- **He catches real problems.** "My earlier weeks ran leaner? I'm leaner now"
  and "I thought you were completely redesigning the app?" were both correct and
  both changed the work. Push-back from him is signal.
- **Tell him what is going *right*.** Until v4.0.0 the app had never once told
  him his exercise selection was already on the correct side of the largest effect
  in the training literature. An app that only speaks up to correct you teaches
  nothing about what to protect — and tailored feedback is an adherence mechanism,
  not decoration.
- **Never generalise this app.** GOALS.md §"What this is" is explicit: one
  athlete, no general-purpose patterns imported. Every generalisation is a
  regression against the only user.

## 0.14 · CORRECTIONS TO §1–§10 BELOW — read before trusting any of it

The old brief is a good document that has drifted. Some of its drift is
dangerous. Corrections, most important first:

**§5, LAW 9 IS WRONG AND MUST NOT BE "RESTORED."** The old brief lists law 9 as
*"Records need clean sleep."* That rule is retired. The app's actual
`CONSTITUTION` array now reads **"Records need repeating, not good sleep"** with
the subtitle *"Short sleep protects, it does not punish."* If you read §5 and
"fix" the code to match it, you will reintroduce the single largest defect this
branch removed. The code is right; §5 is stale.

**§5, LAW 11** says the Minute has 8 steps. `MORNING_REGISTRY` is now 5
(`energy, soreness, night, weight, brief`) with `MORNING_PARKED = [pulse, temp,
grip]`. Pulse, temp and grip were removed because each fired inside its own
measurement noise — grip's threshold was 8% against a minimal detectable change
of ~11%, on a 4-entry baseline, and it does not measure what it was asked to
(10×10 squats moved leg-extension torque p=0.03 and jump velocity p=0.04 while
grip did not budge, p=0.47). He logged it zero times.

**§4, THE SHIP RITUAL IS OBSOLETE.** `tools/ship.sh` is superseded. Use:

```
node scripts/ship.mjs "<release note>"      # sync sw version → rebuild → gate → commit → push → wait for beacon
node scripts/prod-check.mjs                 # verify live version, assets, /ledger 404s, service reachability
node scripts/test.mjs                       # suite + 3 smokes, standalone
node scripts/build.mjs                      # bundle only
```

`ship.mjs` refuses to push on a red gate and says so. It reads `APP_V` from
`src/app.jsx` and syncs `sw.js`'s cache name to match — **bump `APP_V` and
`sw.js` together or the service worker serves a stale bundle.**

**§2, REPO LAYOUT.** No `prep-ledger-pwa/` directory and no GitHub Pages. The app
deploys **GitHub Actions → Netlify**, and `app.js` is committed at repo root
because Netlify serves the repo as-is. `_headers` carries the `/ledger/*`
lockdown; `scripts/prod-check.mjs` asserts those paths 404 in production.

**§3, ENVIRONMENT.** There is no `python3` on the current dev machine. Do all
source surgery through Node scripts written to a file — **not** shell heredocs,
which silently ate `\s`/`\d` from two regexes in this session and left them
matching nothing.

**§7, CURRENT STATE.** Now v4.0.0 · schema v34 · **856 assertions**. `src/app.jsx`
is ~8,700 lines, not 5,000.

**§9, PENDING DOCKET** is largely superseded — see §0.4 and §0.11 above.

---

## 0.15 · ARCHITECTURE MAP — where things live in one 8,900-line file

The file runs in this order. Function declarations hoist, so ordering is for
humans, not the parser.

| region | approx | contents |
|---|---|---|
| constants & seed | 1–250 | `APP_V`, `SCHEMA_V`, `PHASES`, `EXERCISES`, `HISTORY`, `SEED` |
| history rollups | 200–260 | `weekRollups`, `rollupHits`, `ROLLUPS` (module-load, no state) |
| **the desk** | 260–700 | `liftCall`, `progressStep`, `targetsFor`, load ladders (`loadRungs`/`nextLoad`/`snapLoad`/`deloadLoad`), `repsLostOnJump`, `windowFor` |
| session engine | 700–1050 | `pickStructural`, `genSession`, `completeSession`, RIR helpers, `typicalError`, `beatsNoise` |
| **body & nutrition** | 1050–1700 | `bfEst`, `proteinTarget`, `proteinHit`, `stepTarget`, `currentRate`, `observedTDEE`, `calorieFloor`, `dietExit`, `calorieTarget`, `energyAvailability` |
| sleep | 2400–2600 | `cleanAtDate`, `atSleepTarget`, `sleepAnchor`, `lightsOutT`, `medianSOL`, `owedNights` |
| lab instruments | 1800–3100 | `labAnalytics`, `labAnalytics2`, `shelfItems`, `dossierText`, trials |
| daily read | 3200–3600 | `dayProtocol`, `theOneThing`, `weekReview`, `weekDigest`, `plainify` |
| **volume** | 3600–3800 | `muscleVolume`, `programmeVolume`, `volumeImbalance`, `sweepVolume`, `exerciseSelection`, `nowFocus` |
| proposals | 3800–4150 | `runAdaptive` (raises everything), `proposalDial`, `applyProposal` |
| **migrations** | 4150–4500 | `patchV4`…`patchV34`, `PATCHES`, `migrate` |
| analyst | 4600–4900 | `askContext` (the prompt), `LEDGER_DICT`, `agentToolExec`, `AGENT_TOOLS` |
| `__test` export | ~4720 | **everything testable must be added here or the suite cannot see it** |
| UI primitives | 5100–5700 | `T` (palette), `Card`, `Btn`, `More`, `Section`, `CONSTITUTION` |
| screens | 5700–8500 | `NowTab`, `LogTab`(=TRAIN), `QueueTab`, `BodyTab`, `SleepTab`, `HistTab`(=LAB), `MoreTab`, `GymMode`, `Rules`, `CoachView` |
| shell | 8500–8900 | tab state, routing, tab bar, modals |

**Naming traps:** `LogTab` renders the **TRAIN** tab. `HistTab` renders the
**LAB** tab. `QUEUE`/`BODY`/`SLEEP`/`HIST` are reachable only through `MoreTab`.

## 0.16 · ENGINE CONTRACTS — what the load-bearing functions return

Only the ones you will actually need. All take the full state `s`.

- `bfEst(s)` → `{pct, lean, lo, hi, wks, anchorErr, src, drip, why}` — **always a
  band.** `drip` is 0 and must stay 0 without a DEXA. Showing `pct` without
  `lo`–`hi` is a defect.
- `proteinTarget(s)` → `{g, lo, hi, floor, perKg, inLeanSubgroup, straddles, ffmKg, bf, bfLo, bfHi, why}`. `g` is the headline; **`lo` is what `proteinHit` must be
  tested against.** `straddles` is true when his BF *interval* spans 12.2%, which
  is why the target is a range.
- `proteinHit(floorG, logged)` → bool. **Tolerance is 0.** A floor, not a band.
- `currentRate(s)` → `{scale, fat, measured, method, n, ci, lo, hi, rates, from, to}`. `method` ∈ `regression | snapshots | prior`. Prefer `regression`.
- `observedTDEE(s)` → `{tdee, lo, hi, days, avg, matched, impliedPerLb, impossible, perLb}` or `null`. Uses `KCAL_PER_LB_MIX`. `matched` means intake and rate share a window.
- `calorieTarget(s)` → `{gated, lo, hi, mid, band, tdee, floor, floorBinds, wkAvg, wkOff, wkWhy, why}`. **`mid` does not exist when `gated`** — guard it.
- `calorieFloor(s)` → `{floor, soft, ffmKg, eee, why}` — derived from energy availability at his lean mass. Currently 1750. Never hardcode 1700.
- `stepTarget(s)` → `{gated, lo, hi, mid, avg, days, kcalPer1k, driftKcal, why}`.
- `sleepAnchor(s)` → `{measured, n, bed, wake, bedSDmin, wakeSDmin, curH, needBed, shiftMin, sol, target, lever, why}`. **Check `.measured` before touching any other field.**
- `lightsOutT(s)` → `{t, mins, sol, target, wakeRef, measured, override}`. Must agree with `sleepAnchor`; they disagreed by 2h45m before this branch.
- `cleanAtDate(s, iso)` → bool — *performance* flag (last night <6.5 h, or 3-night mean <7.0). `atSleepTarget(s, iso)` → `{run, at}` — *target* question. **Two different questions; do not re-merge them.**
- `liftCall(s, exId)` → `{verdict, vel, n, why, receipts, newW?}`. Verdicts: `PUSH · PUSH+ · HOLD · RESET · REBUILD · STAND-DOWN`. **No sleep verdict exists any more.**
- `typicalError(s, exId)` → `{reps, n, src}` — his own measured set-to-set spread; `beatsNoise(...)` → `{clear, margin, need, te, n}`.
- `volumeImbalance(s)` → `{pv, under, low, over, taker, donor, need, gain, detectable, actionable, cutting, why}`. **`detectable` ≠ `actionable`** — see §0.5.
- `exerciseSelection(s)` → `{items[], allGood}`.
- `nowFocus(s, hour?)` → `{phase, hour, owed[], clear, lead:{t, sub, more}}`.
- `dietExit(s)` → `{gated, started, wksHeld, maintenance, from, step, holdMin, holdFull, readReady, decideReady, plan[], why, unknown}`.
- `migrate(s)` → state at `SCHEMA_V`. Pure enough to run twice; **all patches must be idempotent.**
- `askContext(s, docs?)` → the Analyst's entire system prompt. Anything the
  Analyst must not contradict has to be in here.

## 0.17 · HOW TO VERIFY A CHANGE AGAINST HIS REAL DATA

This recipe caught more than the suite did. Use it before shipping anything that
changes a number he sees.

```bash
cat > .tmp/check.jsx <<'EOF'
import { __test } from "../src/app.jsx";
const raw = JSON.parse(require("fs").readFileSync("ledger/state.json", "utf8"));
const s = __test.migrate(JSON.parse(JSON.stringify(raw)));
console.log(JSON.stringify(__test.proteinTarget(s), null, 1));   // whatever you changed
EOF
npx esbuild .tmp/check.jsx --bundle --platform=node --format=cjs \
  --loader:.jsx=jsx --outfile=.tmp/check.cjs --log-level=error && node .tmp/check.cjs
```

**Always run the data-integrity assertion after a migration change:**

```js
const B = {reads: raw.reads.length, nights: raw.sleep.nights.length,
           days: Object.keys(raw.dailyLogs).length,
           sess: Object.keys(raw.sessionLog).length, queue: (raw.queue||[]).length};
// ...migrate...
// every count must be >= its "before". Current truth: 46 / 42 / 47 / 4 / 13.
```

## 0.18 · THE TEST SYSTEM — and its one sharp edge

- `node scripts/test.mjs` runs the engine suite plus three smokes.
- **`MIN_ASSERTIONS = 850`.** A suite that silently stops running is the failure
  this guards. If you legitimately remove assertions, lower it deliberately.
- **`tools/engine-test.jsx` is ONE FLAT SCOPE.** Every `const` shares a namespace
  across ~2,900 lines. New blocks need unique suffixes (`pt27`, `mg37`, `sel38`).
  A collision is a build error, not a test failure — read the esbuild message.
- Anything you want to test must be added to the `__test` export near line 4720.
  Adding `__test.foo = foo` *before* that line throws at load — the object does
  not exist yet.
- The smokes and what each actually catches:
  - **render-smoke** — mounts the real bundle in jsdom, walks every room in three
    states, fails on `undefined`/`NaN`/`[object Object]` or a suspiciously empty
    screen. It now reaches QUEUE/BODY/SLEEP/LAB **through MORE**. This is the one
    that catches a screen you broke without noticing.
  - **dom-smoke** — the shipped `app.js` boots clean.
  - **beacon-smoke** — the crash reporter records faults, **redacts tokens**, and
    cannot itself break the app.
- The suite is **headless only.** iOS Safari is unexercised by any automated
  check. GOALS.md names an unreported iPhone error as *the* failure mode that
  matters. Reason explicitly about Safari, and open it on the real device after
  merge.

## 0.19 · ADDING A MIGRATION CORRECTLY

1. Write `patchVn(s)`, ending `s.v = n; return s;`
2. Append it to the `PATCHES` array — **append, never insert**; order is applied order.
3. Bump `SCHEMA_V`.
4. Obey both invariants: **never touch a `done` queue item** (its `gate` is a
   receipt, not a gate), and **be idempotent** (guard every feed entry so
   re-running files no duplicate).
5. Test three states: the real `ledger/state.json`, the `SEED`, and a
   deliberately malformed one (missing `queue`, missing `feed`, `gate` not a
   string). `patchV34`'s tests are the template.
6. Explain the change in `s.feed` — he reads it, and a silent state rewrite is
   indistinguishable from a bug.

## 0.20 · CITATION INDEX — every claim the app now makes, and its source

So the next hand can check rather than trust. All are load-bearing.

| claim in the app | source |
|---|---|
| volume dose-response; return peaks 5–10 weekly sets; SDES 2.05%; half-credit for indirect is primary | Pelland 2025, 67 studies, n=2,058 |
| **volume does not change lean retention in a deficit** | Roth 2023, n=38, 6 wk, 30 kcal/kg deficit, 2.8 g/kg protein |
| retention runs on ~1/9 of building volume | Bickel 2011, n=70, 32 wk |
| short sleep costs ~2.85% strength — inside test-retest CV | Craven 2022 |
| 9 nights at 5 h → <1% volume-load loss | Knowles 2022 |
| **5.5 h vs 8.5 h → ~60% more loss from fat-free mass** | Nedeltcheva 2010 |
| start-of-night restriction ≈ zero, d=−0.25 (−0.53 to +0.04) | Gong 2024 |
| protein scales to FFM, not bodyweight; zero-crossing ~2.5 g/kg FFM | Refalo/Trexler/Helms 2025, 29 studies, n=729 |
| protein requirement **higher on rest days** | Moore 2024 (IAAO) |
| rep tempo SMD 0.09 (favours faster) | tempo meta-analysis |
| eccentrics −0.06 growth, +1.72 perceived effort | eccentric meta-analysis |
| periodisation d = −0.02 | linear vs undulating |
| machines vs free weights −0.055, p=0.751 | — |
| lengthened partials ≈ full ROM; BF 0.16–0.30 favour null | 297-person multi-site trial |
| **exercise selection: standing vs seated calf raise d = 0.88–1.58; overhead vs pushdown triceps d = 0.54–0.61** | biarticular length literature |
| load 80% vs 60% under restriction: no fat/lean difference | Carlson 2022, n=115 |
| diet breaks help adherence, not metabolism; **refeeds do neither** | MATADOR / Byrne 2018 + reanalysis |
| ~0.7%/wk arm gained lean, 1.0%/wk lost it, matched total loss | Garthe 2011 |
| 4,282 kcal/lb adipose (not 3,500) | Hall 2008 |
| energy-availability threshold 25 kcal/kg FFM is **extrapolated**, IOC declines to set one | IOC 2023 / Fagerberg 2018 / Espinar 2026 |
| adaptive menus ~8% slower than static; adaptable preferred 15:4 | Findlater & McGrenere, CHI 2004, n=27 |
| lower-burden logging → worse habit formation, half the weight loss | dietary self-monitoring burden study |
| goal pursuit dominates adherence; habit fades by day 21; tailored feedback sustains | JMIR 2025, n=97 |
| personalised > generic messaging, +13.6% adherence | REINFORCE trial, n=60 |

## 0.21 · DO NOT

- Do not reintroduce anything in **NEGATIVE FINDINGS** in `research-brief.md`.
- Do not make `volumeImbalance` fire during a deficit.
- Do not make the tab bar adapt to what has news.
- Do not automate away the act of logging.
- Do not show `bfEst().pct` without its band.
- Do not test `proteinHit` against `proteinTarget().g` — it takes `.lo`.
- Do not add a countdown, a target date, or a percentage-complete bar. No date exists.
- Do not re-architect the layout frame — eight attempts failed; see old §6.
- Do not let inputs render below 16px (iOS zoom-on-focus).
- Do not cache `api.github.com` in the service worker.
- Do not generalise the app toward other users.
- Do not push to `main` without the owner's word — it deploys live to his phone.
- Do not print, log or echo `GH_TOKEN`. The remote URL contains a credential;
  redact it if you ever surface `git remote -v`.

## 0.22 · Stale in the old brief below (short version — full corrections in §0.14)

§2 says `src/app.jsx` is ~5,000 lines (now ~8,900) and the suite is 359
assertions (now 856). It references `prep-ledger-pwa/` and GitHub Pages; the app
now deploys via GitHub Actions → Netlify, and `app.js` is committed at repo root
because Netlify serves the repo as-is. §3's environment notes still hold, except
that source surgery is done with Node rather than Python (there is no `python3`
on the current dev machine).

---

Read this first. It is the onboarding document for any agent or environment
picking up development of this app.

---

## 0.23 - OPERATIONS, ACCESS AND SECURITY (written last; supersedes 3 where they disagree)

Everything in this section post-dates the rest of this file. Where it contradicts
an earlier section, this one is current. It was written on 2026-07-29, verified
against the live system, immediately before the originating session was closed.

### 0.23.1 Repo access - how to authenticate

**The repo is PRIVATE.** Section 3 says "This repo is public." That is WRONG.
Verified 2026-07-29: an anonymous clone with credential helpers disabled is
refused. His `ledger/state.json` - which carries his body data - is therefore not
world-readable. Do not act on section 3's claim.

**NEVER** put a token in a prompt, in a command you echo, in a commit, or in any
file. If you ever see a literal token anywhere, stop and tell Joe it needs
rotating.

Get credentials in this order, and do not proceed without one:

1. `$GH_TOKEN` from the environment, if set.
2. Otherwise via Joe's PC on the device bridge. `GH_TOKEN` is a **user-level
   Windows environment variable** on his machine, and
   `C:\Users\joeym\Documents\prepledger-nightly-askpass.cmd` is an askpass shim
   that feeds it to git. Set `GIT_ASKPASS` to that shim, then clone and push over
   plain HTTPS **with no credential in the URL**.
3. If neither is available, do NOT improvise and do NOT skip silently. Say so.

Use plain git over HTTPS. Sandboxes here have blocked `api.github.com`, so do not
route work through the GitHub REST API.

### 0.23.2 The token incident, and the rotation that is still pending

On 2026-07-29 a **live GitHub PAT was found sitting in plaintext inside both
scheduled-task prompts** - the overnight analyst and the monthly inspection. It
had been pasted there as a convenience. Both prompts were rewritten to remove it
and to forbid the practice; verified zero tokens remain in either.

The exposure was bounded - the prompts live in Joe's own account, not in this
repo, and the repo is private. Nothing is known to have leaked. But the key is
still the compromised one.

**Rotation is PENDING as of this commit.** Joe intends to do it himself the same
evening. An agent must never handle the value: creating, pasting or storing a
credential is his hands only. A helper exists for him on his Desktop -
`SAVE GITHUB KEY`, which runs `C:\Users\joeym\Documents\prepledger-save-key.ps1`.
It opens GitHub to the right page, accepts the paste with masked input, writes the
user-level variable, and reports back only the character length - never the value.
**Do not delete either file.** If Joe says the pipeline broke after that evening,
the first thing to check is whether the new key was saved and whether the app was
restarted afterwards (Windows only hands a new variable to newly started
processes).

Verified working end to end at 44a03be, before rotation: key present (93 chars),
shim present, clone succeeded with no credential in the URL, write access
confirmed by dry run, branch visible on origin.

### 0.23.3 Two jobs push to main on their own - this is not a defect

Section 8 describes these agents but predates their current orders. Both are
scheduled tasks in Joe's Claude account, not cron on any machine here.

- **Overnight analyst** - `0 8 * * *` UTC. Writes `ledger/` ONLY. Commits end
  `[skip ci]`. Pushes to the default branch.
- **Monthly inspection** - `0 9 1 * *` UTC. Six filings. Writes `ledger/` ONLY.

Consequences you must plan around:

- `origin/main` gains `ledger auto-sync` commits without anybody asking. When this
  branch was cut, main was at `bcc601c`; by handoff it had moved to `af948db`,
  ledger-only. **Rebase onto main. Never force-push over it.**
- Neither job may touch app code. If app code ever arrives in one of their
  commits, that is a breach - tell Joe.
- Both are fenced: they may amend `ledger/orders-addendum.md` and nothing else.
  Their base orders, the house laws and their write-scope are immutable to them.
  If you want to change their behaviour, change the scheduled task, not the repo.

### 0.23.4 Joe's working copy is not yours

`C:\Users\joeym\Documents\prepledger-dev` is **Joe's own checkout**. Never cd into
it, never read from it, never write to it, never run any git command inside it.

This has already caused one real incident. On 2026-07-29 the nightly job ran
`pull --rebase --autostash` inside that directory, rebased a feature branch it did
not own, and left the repo checked out on `main` mid-session. Recovery cost real
time. `--autostash` would have hidden uncommitted work where nobody would look for
it.

Always clone fresh into a directory you created this run. If a clone already
exists at your path, delete it and re-clone rather than reusing it. From
automation, push ONLY the default branch - feature branches are not yours.

### 0.23.5 Exact state at handoff

- `audit/research-corpus` at **44a03be**, 13 commits ahead of main. Pushed.
- `origin/main` at **af948db** - moved after the branch was cut, ledger auto-sync
  only, no app code.
- Zero uncommitted, zero stashes.
- `v4.0.0`, `SCHEMA_V = 34`, `MIN_ASSERTIONS = 850`, **856 assertions green**.
- Full gate re-verified from a **bare clone** on 2026-07-29: suite green, `app.js`
  matches a fresh build of `src/`, `APP_V 4.0.0` matches the service-worker cache
  name, health data unreadable from the public site, no token-shaped string
  anywhere in the tree. *"All checks passed. Safe to ship."*
- **One real defect was caught by that check and fixed here.** The committed
  `app.js` had been built one commit *before* the version bump, so the shipped
  bundle still reported `3.99.26` while `src/` said `4.0.0`. Everything else in
  the redesign was present - only the version constant was stale - but merging it
  as-is would have deployed a bundle whose version disagreed with its own
  service-worker cache name, which is how a PWA fails to update on his phone.
  Rebuilt and committed. **Run `npm run check` before merging.** A stale `app.js`
  is invisible in a source diff and only the gate sees it.
- **Not merged, deliberately.** Joe asked that merging be done by the receiving
  agent rather than by the session that wrote it. Read 0.6 (migration safety)
  before you merge - `patchV34` nearly deleted a completed queue receipt, and the
  invariant that saved it (`if (q.done) return;`) is not obvious from the code.

### 0.23.6 How to work with Joe himself

Read 0.12 first; this is the operational addendum to it.

- **He has no coding experience.** This is the single most repeated correction of
  the whole session. Never hand him a command, a terminal, or a PowerShell line.
  Hand him a link to click or a file to double-click. If the only path you can
  think of is a command, that means the tooling is not finished yet - go build the
  clickable thing first.
- **"Eli12"** is his shorthand for *explain it like I am 12*. He asked for it
  repeatedly. When he says it, the previous answer was too technical, not too
  short. Rewrite it plainer; do not just trim it.
- He is often on his phone, away from the PC the bridge points at. Check which
  before proposing anything that requires his desktop.
- He pushes back hard and correctly when work drifts from the objective. The
  objective, from `GOALS.md`, is the **best body-composition change for Joe, as
  quickly as possible**. Every feature answers to it. The dominant defect of this
  codebase - found three separate times - is research that was written down and
  then not enforced in code. Assume it is still happening somewhere.

### 0.23.7 Ground truth, verified on the live system 2026-07-29

Everything here was measured, not remembered. Re-measure before trusting it if
much time has passed.

**The v34 migration has never run against his real data.** `ledger/state.json` on
`main` is **`v: 33`**. This branch ships `SCHEMA_V = 34`. So `patchV34` meets his
actual history the *first time he opens the merged app* - not in a test. Read 0.6
before you merge, and understand `if (q.done) return;` before you touch it: that
one line is the only thing that stopped the migration overwriting a completed
queue receipt (`q_hack3`, which reads "Debuted 7,8,7" - the result of a real set).
Rollback reference exists at `ledger/snapshots/` (`state-2026-07-24.json`,
`state-2026-07-27.json`).

**Section 3 lists a dependency that is not on this machine.** Verified present:
`node v24.18.0`, `npm 11.16.0`, `npx 11.16.0`, `git 2.55.0.windows.3`. **`python`
is NOT installed** - it resolves to the Microsoft Store stub and will fail in a
confusing way. Section 3 says "all source surgery is done with Python string/line
operations." Do not follow that here. Use node, or the editor tools, for source
edits. Related trap from 0.10: never pipe regex-bearing code through a shell
heredoc - two patterns silently lost their backslashes that way (`\s` became `s`)
and matched nothing. Write the script to a file, then run the file.

**Joe's working copy is stale but clean.** `C:\Users\joeym\Documents\prepledger-dev`
sits on `audit/research-corpus` at `44a03be` - three commits behind this branch -
with zero uncommitted and zero stashes; its local `main` is 5 behind origin. If a
*human* is going to work there it needs a pull. Automation still must never touch
it (see 0.23.4).

**The scheduled tasks, by ID.** Both are enabled.

| task | id | cron (UTC) | next run |
|---|---|---|---|
| PrepLedger overnight analyst | `trig_01FbCubEFiuj1Q3AZPSzhZxu` | `0 8 * * *` | 2026-07-30 08:07Z |
| PrepLedger monthly inspection | `trig_014mCQ2yVTQ61Fd3gUs6oquP` | `0 9 1 * *` | 2026-08-01 09:05Z |

Two further tasks exist on the same account - `trig_017cJ4ob5X1w31SHeHwJQhvJ` and
`trig_01L15fVXn3bGdTrYVHRz6tBz` - and belong to a **different** app ("Most Days").
They are not prepledger. Do not edit them.

**The first analyst run after the key rotation is the canary.** Joe intended to
rotate the evening of 2026-07-29; the 08:07Z run on 07-30 is the first thing that
will use the new key. If it writes "skipped for lack of credentials" into
`ledger/notes.md`, the save did not take - check that the variable is set and that
he restarted the app afterwards.

**The analyst's own governing documents live in `ledger/`,** not in this file:
`analyst-constitution.md`, `analyst-nightly-recipe.md`, `analyst-wiring-guide.md`,
`caselaw.md`, `orders-addendum.md`, `training/scorecard.md`. The agents are fenced
to amending `orders-addendum.md` and nothing else. To change how the analyst
*thinks*, change the scheduled task's prompt - editing these files alone will not
do it, because the base orders live in the task, not the repo.

---

## 1 · WHAT THIS IS

A single-file React PWA — a personal training/nutrition ledger for one athlete
(Joey, 24M, ADHD, mid-cut). It is not a tracker. It is N=1 research
infrastructure: 54 derived instruments, a 12-law constitution enforced by the
test suite, and two agent employees that read the synced state nightly and
monthly.

**The athlete is the final authority.** The app rules the engines, the agents
narrate, the athlete overrides. This is Law 10 and it is not decorative.

---

## 2 · REPO LAYOUT

```
src/app.jsx              the entire app (~5,000 lines) — one file, by design
tools/engine-test.jsx    the suite (359 assertions). Red = no ship. No exceptions.
tools/render-smoke.mjs   renders every tab in every state; catches silent fallbacks
tools/ship.sh            tests -> smoke -> esbuild -> copy -> git -> push -> beacon
prep-ledger-pwa/         built artifacts: app.js, sw.js, index.html
index.html               served at repo root (GitHub Pages serves from root)
app.js, sw.js            built bundle + service worker at root
ledger/state.json        the athlete's synced state (written by the app, read by agents)
ledger/brief.md          the 4 AM overnight brief (written by the nightly agent)
ledger/deploy.json       publish beacon: {sha, version, state, at}
```

**Everything needed to rebuild lives in this repo.** Migration to any new
environment is: clone, `npm i -g esbuild` (or npx), go.

---

## 3 · ENVIRONMENT REQUIRED

- `node` + `npx` (esbuild is invoked via npx)
- `git` with push rights to this repo
- ~~`python3` (all source surgery is done with Python string/line operations)~~
  **STALE - see 0.23.7.** Python is NOT installed on Joe's machine; it resolves to
  the Microsoft Store stub. Do source edits with node or the editor tools.
- A GitHub PAT with contents:write

**SECURITY:** the token must live in an environment variable (`GH_TOKEN`) or a
secret store. It must NEVER be committed to this file or any file in the repo.
~~This repo is public.~~ **WRONG - see 0.23.1.** The repo is **private**; verified
2026-07-29 by an anonymous clone being refused. Rotate the token whenever the
development environment changes hands.

---

## 4 · THE SHIP RITUAL

```
npm run ship -- "<release note>"      <- use this one
bash tools/ship.sh "<release note>"   <- older path, still present
```

Both exist in the tree. `npm run ship` (which runs `scripts/ship.mjs`) is the one
`CLAUDE.md` documents and the one that works without a bash shell. Prefer it.

Runs: suite -> smoke -> esbuild -> copy artifacts -> commit -> pull --rebase ->
push -> write beacon.

If ship.sh times out (rc=124) the build usually succeeded but the push did not.
Recover manually:

```
cp prep-ledger-pwa/{app.js,sw.js} <repo>/
cp prep-ledger-pwa/index.html <repo>/index.html     # only when index changed
cp src/app.jsx <repo>/src/ && cp tools/engine-test.jsx <repo>/tools/
cd <repo> && git add -A && git commit -q -m "..."
git pull --rebase && git push
```

Then confirm `ledger/deploy.json` shows the new version.

**Use `&&` between ship.sh and the manual ritual, never `;`.**
A `;` has twice let a RED suite push. Both times required an immediate
assert-amend and a green re-push.

---

## 5 · THE TWELVE LAWS

Four were written by the athlete. They are enforced by the suite — the
constitution length is asserted, so adding a law requires amending the census.

1. Attention lives on NOW
2. Simple surface, real depth
3. Many sources, one door (every machine-initiated change routes through the
   proposals inbox — nothing mutates itself)
4. Facts live, prose dawns (the live line outranks the 4 AM brief, always)
5. Done-ness is derived (one recorded exception: "Mark photos done" is an
   attestation, because a camera roll is underivable)
6. The smallest honest increment
7. One terminal failure set
8. The tilt (defaults lean toward stimulus)
9. Records need clean sleep
10. The athlete overrides
11. The morning lives in the Minute (MORNING_REGISTRY — any morning-class input
    must register or the build fails)
12. No decorative fields — every field must buy attribution; friction is what
    kills tracking systems by week nine

---

## 6 · HARD-WON LESSONS (do not relearn these)

**Source surgery**
- First-occurrence anchors are unreliable. `v{APP_V}` matched a footer before
  the tab-bar stamp; a background+borderTop pattern matched three elements and
  produced three rogue stamps. Verify with grep counts after every batch.
- `applyRead` is PURE — it clones and returns. Tests must capture the return.
- Python heredocs: never `\'` inside single-quoted strings.
- Check for symbol collisions before adding a component (`Section` already
  existed; the second declaration broke the build).
- JSX inserted between ternary branches breaks the parse. Check the surrounding
  structure, not just the line.

**iOS / PWA**
- Inputs under 16px trigger Safari's zoom-on-focus, which leaves the page
  pannable sideways. All inputs render 16px. Do not undo this.
- The frame is: normal document flow, `minHeight: 100vh` shell, tab bar
  `position: fixed; bottom: 0`, content padded to clear it. This layout ran
  gap-free for six weeks. Eight attempts to "improve" it (frozen body, dvh,
  measured height, fixed-inset shell, custom scroll pane) all failed. **Do not
  re-architect the frame.**
- The safe-area inset lives in the tab buttons' padding. Do not add a second
  one on the container.
- The service worker must never cache `api.github.com`. An `ignoreSearch` cache
  match served a stale sha for two days and produced an unkillable 409.
- Do not send a `Cache-Control` request header to the GitHub API from the
  browser — it trips CORS preflight and kills the fetch silently.

**Semantics**
- Midnight is real. A log filed at 12:30 AM belongs to yesterday. There is a
  midnight intercept, a repair door, an amend pencil, and a clear-today hatch
  because this bit the athlete three separate times.
- Cold-start data must not produce verdicts. Instruments gate on n and say
  "counting only" until mature.

---

## 7 · CURRENT STATE

- Version v3.99.0 · schema v30 · 54 instruments · 359 assertions green
- Sync: self-healing (fresh sha, 4 retries, background heal loop)
- The Minute: 8 steps in lived order (pulse -> energy -> soreness -> night ->
  temp -> weight -> grip -> brief), frozen at open, phase-labelled, each step
  carries HOW and COUNTS WHEN
- A forensic stamp sits in the tab bar (tap for glass/page/wrap heights).
  Scheduled for removal once the frame is confirmed clean.

---

## 8 · THE AGENTS

**Nightly analyst** — writes `ledger/brief.md` at ~4 AM from the last sync.
Sections: GAPS, LAST 24H, WATCHING, AUDIT, CONSIDER, QUESTION (max one).
Every claim carries its evidentiary weight: `(measured, n=X)` or `(speculation)`.
It audits its own prior findings and is expected to weaken them when the data
thins.

**Monthly auditor** — independent pipe audit on the 1st: re-verifies that every
field the app writes actually arrives in `ledger/state.json`.

Both are bound to `_dictionary`, which rides inside every sync and is the
authoritative definition of every field. Standing clauses: meds are weather and
never judgment; the app's gates are never re-derived by an agent; alcohol units
are a count-only covariate whose calories live inside the athlete's logged
calories.

---

## 9 · PENDING DOCKET

- Daylight polish pass, screenshot-driven, one tab at a time
- Remove the forensic stamp once the frame is confirmed
- Spine trio: ONE THING, tomorrow-whisper, question tap-chips
- Evening hunger 1-5 input
- Sick-day flag, weekly libido/mood — then close the intake permanently
- Kit mode: mint a second instance for the athlete's father

---

## 10 · HOW TO WORK ON THIS

Recon before editing. Read the exact anchor. Make one batch of changes. Verify
with greps that each change landed. Parse-check. Run the suite. Ship. Confirm
the beacon.

When something is broken, find the mechanism before shipping a fix. Eight
theories cost a night; one instrument (the forensic stamp) ended it in a
screenshot.
