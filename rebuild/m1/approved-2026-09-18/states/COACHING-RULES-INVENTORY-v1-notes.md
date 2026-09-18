# Coaching rules inventory v1 (as pasted by Joe, 2026-09-17)

Read-only analyst deliverable. Snapshot: repo prepledger, branch rebuild/t2-client-core, tip 2ea42e8 (2026-09-15). The local clone at /home/claude/earned is at a later tip (0af16b7, 2026-09-17); verify file:line references against the clone before relying on them.

## Reach map (what reaches the phone today)
- Screens compose the engine through rebuild/m4/workout/engine-runtime.cjs and rebuild/m3/w6/host/engine-runtime-host.cjs, exposing genSession, rirPlan, dayWeather, cleanAtDate.
- Today (today-model.cjs) reads calorieTarget, proteinTarget, nowModel (energyBalanceTarget, theOneFix, genSession); weigh-ins via applyRead; food via writeDaily (food-model.cjs).
- Coach (tools.cjs) reads calorieTarget, proteinTarget, theOneFix, genSession; can request proposals from volumeImbalance, phaseProposal, proposeLadder.
- NOTHING on the rebuild calls completeSession, earnWalk, runAdaptive, sweepVolume, sweepStalls.
- Consequences: rep targets, RIR targets, the debut debit and the workout card DO reach the phone. Load earns, hold governor, resets, calorie steer cards, step push cards, volume cards, weekly rider notes DO NOT fire. Runway text still promises an earn ("EARNS AT THE TOP OF THE WINDOW", today.cjs:169). Sleep nights are never written on the tip, so every sleep-reading rule is dormant until P5 (N2).

## Rule status (LIVE reaches a screen or the coach today; DORMANT has no caller or its input is never written)
Training: T01 LIVE (rep step +1/+2/+3), T02 LIVE (target line), T03 LIVE (last comparable), T04 LIVE (rep window text in runway), T05 DORMANT (load earn), T06 effectively dormant (debut debit), T07 DORMANT (hold governor), T08 LIVE (RIR targets 2/1/0; Q2 YES pending would make 2/1/1), T09 LIVE, T10 DORMANT (stall verdict/reset), T11 DORMANT, T12 LIVE for RIR floor but inputs never written, T13 LIVE if forks written (no writer), T14 LIVE, T15 FROZEN-APP-ONLY (rest prescription: not on the phone at all), T16 LIVE on id coincidence, T17 LIVE via coach ladder.
Volume: V01 LIVE (fixed July week count, wrong for other splits), V02 LIVE (zones), V03 LIVE, V04 LIVE via coach (up to +12 sets), V05 DORMANT, V06 DORMANT, V07 DORMANT, V08 DORMANT, V09 LIVE.
Nutrition: N01 LIVE (protein 2.5 g/kg lean; absent for clean-init athlete: Today shows nothing, honest), N02 LIVE, N03 LIVE, N04 LIVE, N05 LIVE (Today shows "not available" when gated), N06 LIVE but hidden, N07 LIVE, N08 LIVE (regime overlay), N09 LIVE ("coach is still learning" box on Today), N10 LIVE, N11 DORMANT (Auto-Pilot steer), N12 DORMANT, N13 DORMANT, N14 DORMANT, N15 LIVE (steps lever), N16 LIVE, N17 LIVE.
Recovery/sleep: R01 DORMANT until N2, R02 DORMANT until N2, R03 DORMANT until N2 then fires daily (defect), R04 LIVE as gate, R05 LIVE (one fix ladder; week counter defect), R06 LIVE (training lever "of 4"), R07 LIVE, R08 DORMANT (blackout seeded at setup).
Phases: P01 LIVE via coach (diet-break proposer, stale inputs), P02 LIVE via coach (low-energy sentinel), P03 LIVE via coach (floor review note), P04 LIVE (missing goal means cut), P05 DORMANT, P06 LIVE inside N08.
Coach: C01 LIVE (tier 3 refusals), C02 LIVE (tier 2 proposals, accepted on explicit yes, not durable yet), C03 LIVE (two calorie readers can disagree), C04 LIVE (templates carry no digits; blank renders "I do not have"), C05 the :400 correction is NOT on the tip.

## Findings (Part B), one line each
1. Load progression and card-writing half not connected; runway promises an earn that never fires.
2. Q2 YES changes the rep step, not only the effort target (uncosted).
3. Designed volume counted on a fixed July 2026 calendar.
4. Volume proposal can ask for up to twelve sets in one move.
5. Calories can move by any amount between two mornings, from two readers.
6. Two rules treat one athlete's calendar and absent setting as universal (break rung at week 14 on day one; sleep lever "caution" forever once nights exist).
7. Break proposer satisfied by stale or unknown inputs; reachable via coach.
8. Coach on the tip is the pre-correction coach.

## Copy rules that bind the UI
No en or em dashes. No readiness words. No vendor or model names. Templates contain no digits; a blank tagged value renders as "I do not have" rather than a number. Honest states: a gated calorie band shows "not available"; an absent protein target shows nothing.
