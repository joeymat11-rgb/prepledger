# TRACK B — BATCHED ENGINE-FIX PACKAGES — PLAN v1 (DRAFT for the PM to ratify; not an owner ruling)

Drafted 2026-09-10 by an Opus research subagent of the reviewer chat (now LANE B lead); tree read: `origin/rebuild/t2-client-core` @ cb900a6. Research only — nothing modified.

Authority this plan rests on (all verified by reading):
- `rebuild/DECISIONS.md:60` — M2-RULE: 45/45 APPROVED-FIX, 38 Batch A + 7 Batch B rules (D8, D10, D16, D25, D32, D37, D40). "it approves directions, not code — each theme still needs its accepted behaviour/delta brief, its red-first laws turning GREEN on the candidate and RED on the frozen engine, the post-fix gate's PACKAGE run and cowork's execution acceptance".
- `rebuild/DECISIONS.md:88` — speed plan: "batch the 39 remaining approved defect fixes"; "two-tier rigor (engine full gate; screens/plumbing one reviewer + CI)".
- `rebuild/DECISIONS.md:87` — M2-LOAD-WRITES integrated: "Register: 6/45 repaired (D12, D33, D34, D35, D41, D43); 39 + 15 non-D open."
- `rebuild/DECISIONS.md:93` — NATIVE-CARRIERS theme ACCEPTED. It carries **no register D-ID** (feature work under the slice), but touches plan/progression/sleep/today/writers/index + new performed.cjs, entered-load.cjs, and records **H1** (`today.cjs` `e.id === "hack"` per-athlete special case; on this tree at `rebuild/engine/today.cjs:87`, with a sibling at `:54`) as a **Track B register item, byte-untouched there**.
- `rebuild/slice/PLAN-SLICE-v1.md:24` — Track B shape: "Each package = one PR, one closed package run, full engine gate. Same choreography as M2-IMPORT-GUARDS/STEP-EFFICACY but per THEME, not per defect."

---

## 1. The 39 remaining approved defects

Repaired already, excluded: D12, D33, D34, D35 (`DECISIONS:87`), D41, D43 (`DECISIONS:85-87`). Nothing from `DECISIONS:93` reduces the count.

Plain statements are the register's own PLAIN line; modules are the register's EVIDENCE/FIX citations, each confirmed in source on this tree.

| D | plain (register PLAIN) | register lines | engine module(s) |
|---|---|---|---|
| D1 | first-session targets do not fit the current set count | 13–21 | progression.cjs (targetsFor :155–164) |
| D2 | impossible set count passes validity, then crashes | 23–31 | plan.cjs (_bornValid/canonicalizePlan :84,123) + progression.cjs :164 |
| D3 | a similarly-named lift's set change is credited to this lift | 55–63 | progression.cjs (_volDeltas :118–134) + writers.cjs identity fields |
| D4 | another lift's earn erases this lift's progress credit | 65–73 | progression.cjs (_deriveSightingFull :492–538) |
| D5 | duplicate rungs make equipment look maxed out | 33–41 | progression.cjs (loadRungs/parseRungs :239–243,299–302) |
| D6 | a deload is invented where no working weight exists | 43–51 | progression.cjs (deloadLoad :287–296) |
| D7 | sessions after the viewed day describe earlier progress | 77–85 | progression.cjs (progressAnchor/liftTrend :68–70,562–565) |
| D8 | an old short night is treated as today's sleep debt | 87–95 | sleep.cjs (cleanAtDate :1009–1018) |
| D9 | the workout day depends on schedule record order | 97–105 | plan.cjs (dayType :11–17; confirmed `for … ent = x` last-wins at :15) |
| D10 | seven calendar days across a clock change ≠ a week | 107–115 | dates.cjs (weeksBetween :23; confirmed ms arithmetic) |
| D11 | TDEE range inverts; zero activity drift called meaningful | 169–177 | energy.cjs (observedTDEE :449–450,474,478) |
| D13 | a stale energy estimate survives a body-weight change | 201–209 | energy.cjs (memoOnState :1130–1136 — confirmed WeakMap keyed on the object; energyDensity) |
| D14 | invalid fat-loss rate where a default exists | 189–197 | energy.cjs (currentRate/dripOf :285,301,21) |
| D15 | workout frequency inflates when food is logged less | 117–125 | energy.cjs (energyAvailability :805–807) |
| D16 | a month-late weigh-in grades a 7-day forecast hit | 233–241 | policy.cjs (trackRecord :474–486) |
| D17 | an undone adjustment is still reported as applied | 243–251 | policy.cjs (trackRecord :494–495) |
| D18 | this week's set change is lost behind 80 feed rows | 305–313 | volume.cjs (structuralMovesThisWeek :157–160; confirmed `.slice(0, 80)`) |
| D19 | break-end wording resumes the cut while the break is active | 127–135 | policy.cjs (phaseArc :531,563,573) |
| D20 | a forecast survives a change in the observations behind it | 211–219 | policy.cjs (forecast/_forecastCached :271–274) + energy.cjs :1130–1139 |
| D21 | sleep called clean on the fall-back date after a short night | 137–145 | sleep.cjs (sleepInfo :1883–1887; confirmed `+ DAY` fixed 24h) |
| D22 | numeric-keyed sleep records crash the readers | 337–345 | migrate.cjs (migrate boundary) + sleep.cjs (:237,1067,1621) |
| D23 | a scheduled lower-body workout shows as a rest day | 347–355 | today.cjs (nowModelUncached/genSession/pickStructural :54,567,574) |
| D24 | yesterday marked complete though its food is missing | 253–261 | today.cjs (nowFocus :196,202–203; confirmed key-presence-only `yOpen`) |
| D25 | protein reads "good" on a sole missed day | 263–271 | today.cjs (fiveLevers :238–244) |
| D26 | yesterday's Today survives past midnight | 221–229 | today.cjs (nowModel/_nowMemo :508,622–625) + energy.cjs :1130–1139 |
| D27 | an athlete at maintenance is told a long cut has stalled | 273–281 | today.cjs (theOneFix :298–303) + policy.cjs :549–550, sleep.cjs :1891–1894 |
| D28 | planned weekly sets use a superseded schedule | 147–155 | volume.cjs (programmeVolume :62–64) + plan.cjs :11–21 |
| D29 | press indirect front-delt credit is dropped when logged | 369–377 | volume.cjs (muscleVolume :41,81) |
| D30 | first-set trend pools lifts across a technique change | 379–387 | volume.cjs (setOneRead :193–202) + progression.cjs :561–566 |
| D31 | added-set tolerance inferred only from pre-change workouts | 389–397 | volume.cjs (volumeConversion :224–243) + progression.cjs :581–618 |
| D32 | replication counts workouts from a different technique era | 399–407 | volume.cjs (volumeConversion :278–288) + plan.cjs :46–56 |
| D36 | the curl upgrade receipt prints hard-coded next weights | 283–291 | migrate.cjs (patchV60 :1378–1387) |
| D37 | a past earned increase is re-explained at a later merge clock | 157–165 | migrate.cjs :215–216,259 + progression.cjs :444–449 + merge.cjs :1085 (earnWalk now lives in **earn.cjs**, moved verbatim per `DECISIONS:85`) |
| D38 | an accepted/declined trial is lost on merge | 411–419 | merge.cjs (MERGE_ARR.trials :518–523,714) + writers.cjs :2297–2298,2312 |
| D39 | a declined offer reopens after merge | 421–429 | writers.cjs (dismissAgentProposal :2306–2317) + merge.cjs :715,860 |
| D40 | same-day calorie entries depend on merge direction | 431–439 | merge.cjs (_richer :16 — confirmed "ties -> local (y)"; MERGE_OBJ dailyLogs :525–529,725,884) |
| D42 | undoing a break leaves its scale seal active | 465–473 | writers.cjs (applyProposal/undoAdjustment :2188–2194,2381–2388,423–450) |
| D44 | a phantom set removal is printed and charged | 293–301 | writers.cjs (sweepVolume/applyAgentProposal :1428–1432,1469,2292) + progression.cjs :118–134 + volume.cjs :154–160 |
| D45 | analyst context contradicts the writer's earn rule | 477–485 | writers.cjs (askContext :2463; confirmed at :2457 on this tree) + migrate.cjs :218–224 |

LIVE-TRIGGERED among the remainder (`AUDIT-REGISTER.md:487–535` summary table): **D16, D30, D45** only. Everything else is NOT TRIGGERED or NOT APPLICABLE — relevant to PC-census expectations, not to priority.

---

## 2. Four theme packages

Each v4 law id below was read from `rebuild/conform/v4/laws-*.cjs`; each is RED until its defect is repaired.

### B1 — GRADING & TIME WINDOW (10 defects, 20 register hours)
- **D-ids / order:** D10 → D8 → D21 → D19 → D16 → D17 → D24 → D25 → D27 → D23.
  Rationale: `dates.cjs/weeksBetween` (D10) is the day-arithmetic primitive D16 depends on by ruling; the sleep pair (D8, D21) precedes the policy grading pair (D16, D17) and the phase wording (D19); the four `today.cjs` readers land last, D23 last of all because it changes the rest-day fallback the other Today cells sit on.
- **Modules:** `dates.cjs`, `sleep.cjs`, `policy.cjs`, `today.cjs`.
- **Laws expected GREEN:** `E-D10-calendar-week-is-seven-calendar-dates`, `D-D8-stale-sleep-does-not-claim-current-debt`, `E-D21-sleep-cleanliness-includes-the-fall-back-calendar-date`, `P-D19-inclusive-break-end-prose-agrees-with-active-day`, `E-D16-seven-day-forecast-does-not-grade-a-month-late-read`, `E-D17-undone-adjustment-is-not-described-as-applied`, `E-D24-partial-yesterday-remains-owed-until-calories-are-present`, `E-D25-zero-protein-successes-cannot-be-a-good-protein-read`, `P-D27-maintenance-is-not-described-as-a-long-stalled-cut`, `E-D23-scheduled-hack-debut-is-not-presented-as-a-rest-day`.
- **Owner semantics that apply (`DECISIONS.md:60`, verbatim):**
  - D8 — "when last night's sleep is missing, recovery is UNKNOWN and no sleep restriction is applied today; every other recovery check still applies (not carry-forward of the last logged night)."
  - D10 — "date-only week counts mean 7 CALENDAR days, not 168 elapsed hours."
  - D16 — "a 7-day forecast hit requires an eligible weigh-in on the due day or, failing that, the next day (one grace date); with no such reading the forecast is UNGRADED, not a miss; the day arithmetic follows D10."
  - D25 — "'protein: good' requires at least one successful day within the current seven-logged-days window before the one-miss allowance applies; a first missed day cannot read 'good'."
- **Size:** 20 hours of register estimate; the largest golden surface of the four (Today + phase receipts).
- **Conflicts:** with **B4** on `today.cjs` (nowModel cache) and `policy.cjs` (forecast cache) — **B1 goes first**, B4 rebases. With **Track A** (`rebuild/slice`, `rebuild/m3/w7-preview`) — no shared file, but A1's Today rebind renders exactly what D23/D24/D25/D27 change; A's expectations must be written against post-B1 behaviour or re-pinned after merge. With **NATIVE-CARRIERS** (`DECISIONS:93`) on `sleep.cjs` and `today.cjs`: that package is theme-accepted but unmerged — **it lands before B1** or B1 rebases onto it.

### B2 — TARGETS, IDENTITY & TECHNIQUE ERA (14 defects, 32 hours)
- **D-ids / order:** D9 → D2 → D1 → D5 → D6 → D7 → D3 → D4 → D29 → D18 → D28 → D30 → D31 → D32.
  Rationale: plan-level validity/selection first (D9, D2), then the pure `targetsFor`/ladder/deload fixes (D1, D5, D6), then the as-of window (D7) which D30/D31 read through `liftTrend`, then the two 4-hour identity repairs (D3, D4) which share `_volDeltas`/`_deriveSightingFull` with D44 in B3, then the volume family with D30 last-but-two because its brief already exists.
- **Modules:** `progression.cjs`, `plan.cjs`, `volume.cjs`.
- **Laws expected GREEN:** `E-D9-split-selects-latest-effective-date`, `E-D2-invalid-set-count-stays-quarantined`, `P-D1-first-targets-fit-current-set-count`, `P-D5-ladder-minimum-counts-distinct-rungs`, `P-D6-deload-preserves-absent-load`, `P-D7-anchor-and-trend-exclude-future-sessions`, `P-D3-volume-receipt-belongs-to-whole-lift-name`, `P-D4-other-lift-earn-cannot-spend-sightings`, `P-D29-designed-and-logged-front-delt-volume-use-the-same-indirect-credit`, `P-D18-structural-budget-sees-current-week-volume-receipts-beyond-display-prefix`, `E-D28-programme-volume-follows-the-current-effective-split`, `P-D30-first-set-trend-respects-the-recorded-technique-era`, `V4-volume-tolerance-post-change` (D31), `V4-volume-replication-same-era` (D32).
- **Owner semantics:** D32 — "'benefit replicated' counts only sessions from the CURRENT technique; all other replication thresholds stay as they are." (`DECISIONS.md:60`)
- **Head start:** D30 already has an ACCEPTED behaviour/delta brief and two recorded conditions (`DECISIONS.md:82`, `rebuild/m2/BRIEF-SET-ONE-ERA.md`). Its accepted scope is `volume.cjs` only plus two late-bound delegates; its two conditions (the law's `control` may serve as a result oracle but never as the clock-trace oracle; the P6 second-gate sites `tools/engine-test.jsx:8790–8793` and the seeded set-one card are protected surfaces) carry into B2 unchanged.
- **Size:** 32 hours, the largest; ten of the fourteen are 1–2 hour repairs, the weight is D3/D4/D31/D32 (4h each).
- **Conflicts:** with **B3** on `progression.cjs` (D3/D4 rewrite `_volDeltas`/`_deriveSightingFull`; D44 asserts over `_volDeltas` and D37 rewrites `earnWalk`'s as-of) and on `volume.cjs` (D44 reads `:154–160`, which D18 changes) — **B2 goes first**. With **NATIVE-CARRIERS** on `plan.cjs` and `progression.cjs` — same rule: that package first.

### B3 — MERGE, RECEIPTS & SYNC (9 defects, 39 hours)
- **D-ids / order:** D45 → D36 → D22 → D44 → D42 → D37 → D38 → D39 → D40.
  Rationale: the two cheap string/receipt repairs first (D45, D36), then the shape normalization at the migrate boundary (D22) which every later reader depends on, then the two writer-effect repairs (D44, D42), then D37 (historical as-of through `earnWalk`, now in `earn.cjs`), and the three merge-identity repairs last because D38/D39/D40 all edit `merge.cjs` and must not race each other.
- **Modules:** `writers.cjs`, `merge.cjs`, `migrate.cjs`, `earn.cjs`, plus read-only reach into `sleep.cjs` (D22 readers) and `progression.cjs` (D37, D44).
- **Laws expected GREEN:** `V4-analyst-effort-rule-matches-writer` (D45), `V4-curl-receipt-prices-actual-vector` (D36), `E-D22-recovery-reader-preserves-indexed-sleep-facts-without-a-shape-crash`, `V4-volume-receipt-requires-actual-change` (D44), `V4-break-undo-restores-scale-effect` (D42), `V4-merge-earned-receipt-historical-asof` (D37), `V4-merge-preserves-written-trial-decisions` (D38), `V4-merge-preserves-offer-dismissal` (D39), `V4-daily-conflict-direction-independent` (D40).
- **Owner semantics (`DECISIONS.md:60`, verbatim):**
  - D37 — "a merged earned receipt keeps the assessment as of the day it was earned, accepting that this can change whether a single-sighting increase counts as earned and the numbers printed on past earned receipts."
  - D40 — "when two phones disagree on a day's calories with equal detail, ONE deterministic shared winner is chosen with the conflict kept visible and BOTH original entries retained; **the exact tie-break rule and how the conflict is shown are NOT decided here and must be specified in the reviewed fix brief before anything is built.**"
- **Size:** 39 hours — the heaviest, and the only package carrying an unfinished owner rule (D40) and three frozen-receipt surfaces (D36 receipt string, D45 analyst prompt string, D44 VOLUME receipt).
- **Conflicts:** with **B2** on `progression.cjs`/`volume.cjs` (B2 first). With **Track C** — C2 is "Joe's port script on the PC (migrate → merge → verify 10/10 port-oracle on the real blob)" (`PLAN-SLICE-v1.md:25`); D22/D36/D37/D38/D39/D40 change exactly that path, so **C2's port proof must be re-run after B3 merges**, or C2 is scheduled after it. With **NATIVE-CARRIERS** on `writers.cjs` (that package moves it `008d9296…→00291236…`, `DECISIONS:93`) — that package first.

### B4 — NUMBERS & CACHE IDENTITY (6 defects, 17 hours)
- **D-ids / order:** D14 → D11 → D15 → D13 → D20 → D26.
  Rationale: the three `energy.cjs` value repairs before the three cache repairs, because D20 and D26 both consume `memoOnState` (`energy.cjs:1130–1136`) and their expectations change once D11/D14/D15 change the memoized values; D13 (the memo itself) precedes its two consumers.
- **Modules:** `energy.cjs`, `policy.cjs` (forecast cache only), `today.cjs` (nowModel cache only).
- **Laws expected GREEN:** `E-D14-current-rate-uses-missing-drip-default`, `E-D11-gain-interval-is-ordered-and-zero-drift-never-promoted`, `E-D15-session-frequency-does-not-change-with-food-row-density`, `E-D13-energy-density-cache-tracks-relevant-state`, `E-D20-forecast-refreshes-after-an-observed-rate-change`, `E-D26-today-model-refreshes-when-the-calendar-day-changes`.
- **Owner semantics:** none of the seven Batch B rules fall here; all six are plain Batch A FIX approvals (`DECISIONS.md:60`).
- **Size:** 17 hours; the smallest and the best candidate to run in parallel with B2 **only if** B1 has already merged (shared `today.cjs`/`policy.cjs`).
- **Conflicts:** with **B1** on `today.cjs` and `policy.cjs` — **B1 first**. D13/D20/D26 are all NOT APPLICABLE to LIVE (register :499,504,512), so no private-census change is anticipated; a discovered one is a RED stop, not a golden regeneration.

**Merge order recommendation:** NATIVE-CARRIERS (already theme-accepted, `DECISIONS:93`, pending the PM's own FULL run per its C4) → **B2** ∥ **B1** (disjoint: B2 = progression/plan/volume, B1 = dates/sleep/policy/today; the only shared surface is D27's read-only cite of `policy.cjs:549–550`) → **B4** (after B1) → **B3** (after B2). This matches the slice dates at `PLAN-SLICE-v1.md:29–30`: B1/B2 by S2, B3/B4 by S3.

---

## 3. Per-package acceptance

Mirrors M2-IMPORT-GUARDS (`rebuild/m2/BRIEF-IMPORT-GUARDS.md:85–102`) and the executed M2-LOAD-WRITES bar (`DECISIONS.md:87`).

Each package must produce, in this order:
1. **Brief** — an accepted behaviour/delta contract naming the exact product diff (file → sha256, hunk by hunk), the per-D expected delta cells, the named source mutants, and the negative controls; accepted by the PM as a ledger line before implementation, exactly as `DECISIONS:85` did for LOAD-WRITES.
2. **Closed cumulative profile** — a `rebuild/m4/spec/acceptance-<pkg>.json` artifact bound by sha256, carrying `authorizations {owner = DECISIONS:60, contract = DECISIONS:49, theme = this package's line, review claim}`, with the immediately preceding package's accepted artifact as its immutable parent (the LOAD-WRITES chain: `acceptance-step-efficacy.json → acceptance-load-writes.json 5073977b…`). Runner shaped like `rebuild/m4/spec/load-write-package.cjs` (`--ci` or `--full`, no third mode; `assert(args.length===1&&['--full','--ci'].includes(args[0]))` at :7).
3. **What the run must show (FULL):**
   - all 45 register laws executed: the package's selected D-ids **GREEN on the candidate and RED on the frozen engine**, every other D still raw RED with approved preservation deltas only (`BRIEF-IMPORT-GUARDS.md:87`);
   - all 19 original gates OBSERVED/PASS — the 14 in `rebuild/conform/v4/postfix/run.cjs:9–23` plus the package's own children;
   - **second gate** (`second-gate.mjs --candidate`, "SECOND GATE candidate: PASS") including engine/sync/surface accounting;
   - **own bites**: one disclosed source bite per package quoting its RED line, then exact byte/hash restoration and a restored-GREEN direct gate; plus one unlisted receipt/input-field delta bite proving the comparator fails closed (`BRIEF-IMPORT-GUARDS.md:88`);
   - **real fault mutants** killed per D — a source-pin refusal, syntax error, missing target or timeout earns no kill (same line);
   - **fidelity / structural diff**: no source change outside the brief's enumerated hunks; `PIN_PATHS` (`run.cjs:8`) byte-verified from Git and disk at HEAD; the `codeBaseAnchor..receiptBase` diff limited to `rebuild/DECISIONS.md`, `rebuild/m2/*.md`, `rebuild/QUEUE.md`, `rebuild/ROADMAP.md` (`BRIEF-IMPORT-GUARDS.md:99`);
   - **census on the private blob**: the `migrate-full` gate hard-requires `rebuild/conform/private/live.json` and the private `live.main` golden, failing `REQUIRED-PRIVATE-PREPARATION-MISSING` without them (`run.cjs:115–117`). That directory does not exist in the repo and must not. **Verdict-only reporting; no private values, counts, hashes or prose in any report** (`BRIEF-IMPORT-GUARDS.md:89,103`).
4. **Receipt then authorized rerun** — PENDING evidence exits 2 and prints `REVIEW-PENDING` with no PASS word; the PM's receipt names the exact artifact commit/path and full 64-hex hash with a terminal `ACCEPTED`; the candidate then incorporates that docs-only receipt base and re-runs the AUTHORIZED FULL for `POSTFIX PACKAGE PASS`, exit 0 (`BRIEF-IMPORT-GUARDS.md:96–98`; executed that way at `DECISIONS:86–87`).

**Cloud vs owner's PC**
- **Cloud / CI (both OS):** `--ci` — focused tests, review controls, browser package, profile refusals, source carriers, traces, direct, inherited carriers, witnesses, legacy differential, second gate. `load-write-package.cjs:44` is explicit: "CI is explicitly public evidence only".
- **Owner's PC only:** anything reaching `rebuild/conform/private/live.json` — the `migrate-full` three-blob oracle in both Date modes, the private LIVE predicate re-evaluation for D16/D30/D45, and therefore the whole `--full` run and every `POSTFIX PACKAGE PASS`. Per `DECISIONS:92` the PM "operates the PC directly"; per `DECISIONS:93` C4, "FULL incl. the private oracle is the PM's own execution before any receipt."
- **Also PC-only, by policy not by tooling:** Track C's C2 port over Joe's real blob (`PLAN-SLICE-v1.md` DONE item 5: "the port runs on Joe's PC, never in a cloud session").

---

## 4. Risks and open questions for the PM

**PM decisions (not the owner's):**
1. **Package count and boundaries.** B3 at 39 hours is ~2× B4. Split it (B3a receipts/shape: D45, D36, D22, D44, D42; B3b merge identity: D37, D38, D39, D40) and the plan becomes five packages — defensible under "a few theme packages" (`DECISIONS:88`), but it adds one more closed-profile chain link and one more PC FULL run.
2. **NATIVE-CARRIERS sequencing.** It is theme-accepted but unmerged and it rewrites `plan.cjs`, `progression.cjs`, `sleep.cjs`, `today.cjs`, `writers.cjs`, `index.cjs` (`DECISIONS:93`). Every B package collides with it. Confirm it merges first; if it slips, B1/B2/B3 all need rebase and their briefs' pre-image sha256s are stale.
3. **Parent-chain serialization.** The closed profile binds "the immutable accepted parent". Two B packages cannot both claim `acceptance-load-writes.json` as parent without one re-pinning. Decide the chain order up front (this plan proposes B2 → B1 → B4 → B3) and hold it.
4. **Who reviews B.** `DECISIONS:91`: Opus subagents are the builders and the first reviewer on screens/plumbing, but "Fable (the PM) is the JUDGE: accepts engine fixes". Confirm the engine-tier reviewer is not the author, and that the PM's own FULL run is the acceptance, not a subagent's.
5. **Golden re-pin budget.** Most FIX entries warn of downstream golden change (e.g. D10 "rate, body-composition and date-dependent goldens", register :114; D19 "the frozen phase receipt string changes", :134). Decide per package whether goldens are re-pinned inside the package PR or in a separate reviewed successor; the import-guards rule is that a discovered conflict "needs an exact reviewed successor expectation, never changed frozen tools/goldens or suppressed assertions" (`BRIEF-IMPORT-GUARDS.md:89`).
6. **Track A expectation freeze.** A1/A2 are being built against today's engine output while B1/B4 change Today's cells and B3 changes receipts. Either freeze A's expectations to post-B1 behaviour or accept one re-pin pass per B merge.
7. **H1.** `DECISIONS:93` C3 assigns the `e.id === "hack"` per-athlete special case to Track B as register item H1, byte-untouched by the carriers package. It has **no D-id, no v4 law and no register entry** — the PM must decide whether H1 rides in B1 (it lives in `today.cjs:54,87`, B1's file) with a purpose-written law, or gets its own item. It matters for Dad's first-run (`PLAN-SLICE-v1.md` DONE item 6: "never Joe's defaults").

**Owner question (product rule, ask once, at the point of need):**
8. **D40's tie-break and conflict presentation.** The owner's ruling explicitly leaves it open: "the exact tie-break rule and how the conflict is shown are NOT decided here and must be specified in the reviewed fix brief before anything is built" (`DECISIONS:60`). It is the one B-track blocker that genuinely needs the owner. Note it is also the least urgent: the register marks D40 NOT APPLICABLE to LIVE (needs two replicas, :532), and two-phone sync is deferred (`DECISIONS:88`). **Recommendation: draft the brief with a proposed rule, put it to the owner in one line, and do not block B3's other eight defects on it — carry D40 into a later package if the answer is slow.**

**Risks:**
- The private-oracle dependency makes every `POSTFIX PACKAGE PASS` serialize through one machine. Four packages = four PC sessions; batch them or the slice dates (`PLAN-SLICE-v1.md:28–31`) slip.
- D3/D4 (legacy name-boundary identity) and D37/D38/D39 (merge identity) both invent durable identity schemes. If B2 and B3 pick different conventions, the engine ends up with two. The PM should require the B2 brief to state the identity convention B3 must reuse.
- D22's fix straddles the `migrate.cjs` boundary and `sleep.cjs` readers in one change; its register FIX line warns "do not silently replace recorded nights with an empty list" (:344). That is the single highest lost-fact risk in B3.
