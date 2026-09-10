# EARNED — VERTICAL SLICE — PLAN v1 (DRAFT by the reviewer/research chat, 2026-09-10, for the PM to ratify or amend; not an owner ruling)

Purpose: give the PM a ready first plan for the owner's 2026-09-10 speed ruling (DECISIONS:88) so its first report is a confirmation, not a from-scratch study. Everything here is a proposal; the PM owns assignments. Rulings it rests on: DECISIONS:88 (speed plan), :88 (design re-pin), :89 (voice coach queued behind the slice), 2026-09-05 C1/C11 "bounded".

## Definition of DONE for the slice (one phone, Joe first)
1. Joe opens Earned on his iPhone (installed PWA or Safari), sees TODAY per the approved design (rebuild/m1/approved-2026-09-08/): plan-first instruction, "Eat about … kcal / … g protein", today's workout card, weight trend, one primary action.
2. Morning weigh-in → the engine produces the one instruction (the real engine modules in rebuild/engine, not the preview adapter) → the entry SURVIVES app kill, reboot and a day's gap (local durable save; no sync required).
3. Gym card: start workout → active set shows prescribed vs performed (Refinement A) → log a set with direct weight/reps + explicit effort/unknown → saved-set/rest view with Undo → next set → finish. Sets are real engine writes (writers.cjs), not simulated.
4. Recovery check-in per Additions C (blank = unknown; cleared ≠ fact; never mandatory).
5. Joe's history ported through the accepted migrate/merge modules (private blob stays private; the port runs on Joe's PC, never in a cloud session).
6. Dad's FIRST-RUN: a clean-init state supplier (the missing null-lane provider from the native-L review) + a 5-minute setup: equipment available (his machines, per-exercise real weights), priority muscles, training days, starting loads by "what did you lift last time?" or a conservative first-session probe — never Joe's defaults.
7. Acceptance at the screens/plumbing tier: ONE independent executing reviewer (a second cowork chat or a subagent, told to disagree) + CI both OS; engine changes keep the full gate.

## What already exists to reuse (verified in the repo at ffd7159)
- rebuild/engine — all 7 extracted modules, both gates GREEN (today/plan/progression/volume/energy/sleep/writers/migrate/merge). The brain is done.
- rebuild/client — T2 client core (35 §B laws): canonical, ops, outbox, lease, face, bodycomp. The local op log the slice writes into.
- rebuild/m3/w7-preview — Today running on the read modules with a memory-only adapter; templates extracted from the OLD mock (README pins e742d6b8…). Reuse its build/allowlist/test harness; REBIND templates to the approved design; replace model.cjs with a real adapter over rebuild/client ops (README says exactly this is the W7 integration step).
- rebuild/m4/workout + rebuild/m4/spec — capture/Start, engine-capture, history panel, load-write package (D41/D43 repaired). The gym card's data layer is largely here.
- rebuild/m3 W6 browser bridge (2473005, K1 correction-03 integrated) — durable local save + restart semantics; C1/C11 ruled "bounded". Use its LOCAL half only; hosted W4/W5 deferred per DECISIONS:88.
- rebuild/m1/approved-2026-09-08 — the screens, byte-exact.

## Three parallel tracks (subagents under the PM; disjoint folders so they never collide)
- TRACK A — SLICE UI (rebuild/slice/ + rebind of rebuild/m3/w7-preview): A1 rebind Today to the approved design over the real client adapter · A2 gym card (start/active set/saved-set-rest/undo/finish) on rebuild/m4 capture · A3 recovery check-in · A4 Dad first-run setup + clean-init supplier · A5 PWA shell (manifest, install, offline-launch preflight; no service-worker cleverness beyond launch). Reviewer: screens tier.
- TRACK B — ENGINE FIXES, BATCHED (rebuild/engine + rebuild/conform/v4): the 39 remaining APPROVED-FIX defects in 3–4 theme packages (e.g. B1 grading/time: D8 D10 D16 D25 …; B2 progression/technique eras: D30 D32 …; B3 merge/receipts: D37 D40 …; B4 the plain fixes). Each package = one PR, one closed package run, full engine gate. Same choreography as M2-IMPORT-GUARDS/STEP-EFFICACY but per THEME, not per defect.
- TRACK C — LOCAL PLUMBING (rebuild/m3 local half): C1 durable local save wired to the client ops (W6 local) · C2 Joe's port script on the PC (migrate → merge → verify 10/10 port-oracle on the real blob) · C3 restart/kill/reboot proof on the phone (the five unchanged-core witnesses). Reviewer: plumbing tier. Hosted sync, second phone, Worker auth, native host: DEFERRED.

## Milestones (dated targets, not promises — the PM re-dates on its first report)
- S0 (day 0–1): PM ratifies this plan; QUEUE.md re-pinned around it; three subagents dispatched with file ownership.
- S1 (≈ day 4): Today rebound + weigh-in → instruction from the real engine, durable across kill/reboot, on Joe's phone via the existing preview host pattern (127.0.0.1 on PC is NOT enough — needs a phone-reachable static host; earned-soak's Netlify pattern is already authorized for public source with synthetic data; Joe's private port stays local until C2).
- S2 (≈ day 8): gym card end-to-end + check-in; B1/B2 packages merged.
- S3 (≈ day 12): Joe's port on the phone (C2/C3); B3/B4 merged; Joe uses it daily = "daily-usable one-phone build" per DECISIONS:88.
- S4 (≈ S3 + 7–10 days): Dad's first-run + 5-minute hand test → Dad beta. Then VOICE COACH (rebuild/coach/VOICE-COACH-BRIEF.md).

## Decisions the PM can take by default (bring to the owner only if blocking)
- Phone host for the slice: second Netlify site via the soak.yml pattern (public source, synthetic fixtures) — Joe's real data enters only via the on-PC port + local save, never a hosted fixture.
- Track A binds ONLY to screens in the approved design; uncovered screens (onboarding, settings, history detail) use the old mock per MOCK.md.
- Reviewer for A/C = one independent executing reviewer per PR; no receipts/ledger-line ceremony for A/C (DECISIONS:88); engine (B) unchanged full gate.

## Owner decisions still open that the slice needs (ask ONLY at the point of need)
- None for S0–S2. For S3: the private port runs on Joe's PC — needs him signed in to Claude Code locally once (standing item) or cowork operating the PC directly (already authorized 2026-09-10).
