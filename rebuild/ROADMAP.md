# EARNED — REBUILD ROADMAP v1 (2026-09-04)

The durable plan. A chat can die; this file cannot. Every Claude Code handoff that changes the plan updates this file.
Owner: Joe (rules). Build chat (cowork) = senior developer / project manager + execution audits. Claude Code = builds
and commits. Sol + Grok = blind reviewers (one round per milestone, told to disagree). Dad = first real user.

## Where we are (2026-09-04)
- FROZEN APP (Measured, v7.55.9 live) runs Joe's own prep. PROGRESSION-1 (v7.56.0) is one fix from merge: FIX-4c →
  PACK 4 → cowork re-drive → merge word → deploy → tail-verify → FREEZE. After that the old app takes no new rounds.
- REBUILD artifacts ratified: product definition v2.2 (spine) · runtime sheet v1.7.38 / appendix v1.37 (FROZEN; only a
  four-part witness reopens it) · source-ingestion protocol v1.1 · conformance suite v3 (99 laws, spec-as-tests; with
  Sol + Grok) · design direction "quiet luxury — light, editorial" (canvas chosen; dad test not yet run).
- T2 DONE: the new client's core (rebuild/client, 12 modules) passes the 35 §B laws; suite CONSISTENT. Not yet: any
  screen, real storage backend, real transport, the server authority (T3), the decision engine inside the new client.
- Deferred by ruling: A6 consent-digest/decline-fingerprint halves; §E design section of the appendix.

## Principles (the project manager's rules)
1. Ship the thinnest thing that satisfies the laws; the suite holds the bar, screens stay simple. No new spec sections
   unless a law bites (a witness meeting the four-part bar: lost fact / unconsented apply / untrue value / hidden commit).
2. One reviewer round per milestone, on code and tests, not prose. Reviewers attack the product with laws.
3. Every artifact Joe moves is ONE file, last in the message, destination named. Joe's only word to Claude Code is "go".
4. Nothing private in AI packs: the live ledger blob and its golden are regenerated locally, never shipped.
5. Real use beats another law: the dad test and Joe's own daily use on the new client come as early as a screen exists.
6. Execute before ruling; adversarial read before every delivery; every fixed defect gets a red-first law.

## Milestones (rough weeks; the bar does not move to hit a date)
- M0 · CLOSE THE OLD APP (days). FIX-4c → PACK 4 → merge → deploy → tail-verify → FREEZE. Commit T2 + suite v3 to
  branch rebuild/t2-client-core. Sol/Grok v3 verdicts → suite v4 (their objections + the two T2 findings: B-durability
  must restart from the store; canonical-v2 for the decimal defects). After v4 the suite is FROZEN like the sheet.
- M1 · SEE IT (this week, in parallel). Clickable mock from the ratified canvas (Today, weigh-in, Gym card, one decision)
  with every number fixture-bound → dad test (5 minutes, no explanation) → rulings. Backend comparison packet (one page:
  database + sign-in + a place for the authority's code; monthly cost; ops burden) → Joe picks.
- M2 · THE ENGINE (1–2 weeks). Extract the decision engine (TDEE, targets, progression, proposals) from the frozen app as
  a pure module the new client calls; the port oracle's FINAL golden (cut from the frozen engine) proves identical reads
  on Joe's real ledger. The new client's Layer-2 numbers become real.
- M3 · WALKING SKELETON (1–2 weeks). Real on-device storage behind the store's backend interface; the minimal server
  authority (T3, the 34 §A laws) on the chosen backend; ONE screen (Today) end-to-end on Joe's phone with his ported
  data. Both suite families present → 69+ GREEN. This is the first moment the rebuild is "real".
- M4 · THE THREE MOMENTS (2 weeks). Gym card + set logging, proposals + consent, Review/Re-entry; second device; the
  30-day soak on the store stub runs in the background; restore drill. Dad beta starts here.
- M5 · LAUNCH PREP. Hardening from beta findings; equipment-agnostic onboarding ("what do you have?"); priority muscles
  and training days as per-athlete setup; trademark clearance for "Earned"; staged reversible release.

## Open decisions for Joe (recommendation in brackets)
- D1 Backend/authority hosting for the rebuild [cowork brings the one-page comparison first; no blind pick].
- D2 Engine: extract from the frozen app vs rewrite [EXTRACT — the port oracle proves it; rewrite risks the numbers].
- D3 Dad test now on the mock, before the appendix confirms [YES — it costs nothing and steers M3/M4].
- D4 Freeze the suite after v4 with the same reopen rule as the sheet [YES].
- D5 Data privacy for the rebuild: per-athlete data is private from day one on the server; the frozen app's public
  ledger stays a separate call [YES — required before anyone but Joe uses it].
- D14.1 (appendix) and the A6 halves stay deferred until a law needs them.

## Definition of done (every milestone)
Gate green (suite CONSISTENT + SELFTEST PASS + check.mjs --strict) · one reviewer round answered by execution · Joe's
ruling recorded here · handoff file committed · nothing private shipped · this file updated.
