# EARNED — REBUILD ROADMAP v1.2 (2026-09-04, night)

The durable plan. A chat can die; this file cannot. Every Claude Code handoff that changes the plan updates this file.
Owner: Joe (rules). Build chat (cowork) = senior developer / project manager + execution audits + the cross-family check
(every claim re-run, never read). Builders: OpenAI Codex (GPT-6 Astra) builds modules against the suite (won T3);
Claude Code (on the owner's PC) integrates, cuts goldens and ships. Sol = the blind reviewer (one round per milestone,
told to disagree); Grok is retired from the standing loop (2026-09-04 ruling) and may be called for risky rounds only.
Dad = first real user.

## Where we are (2026-09-04, evening)
- FROZEN APP (Measured): PROGRESSION-1 merged (main 8610bd1), v7.56.0 LIVE and tail-verified; CDN denylist on main
  (cbe86e3: docs/ and rebuild/ never ship). FROZEN — direct-cut fixes only, each with a red-first seed.
- REBUILD artifacts: product definition v2.2 · runtime sheet v1.7.38 / appendix v1.37 (FROZEN) · source-ingestion
  protocol v1.1 · conformance suite v3 (99 laws; committed on this branch; Sol + Grok verdicts pending) · design
  "quiet luxury — light, editorial" (canvas ratified).
- T2 DONE: the new client's core (rebuild/client) passes the 35 §B laws; suite CONSISTENT.
- M1 in progress: the CLICKABLE MOCK is live (21 ratified screens wired; five-minute dad-test script inside) — the dad
  test is the owner's next action. Backend RULED. Engine reconnaissance done (rebuild/m2/RECON.md when committed).
- Deferred by ruling: A6 consent-digest/decline-fingerprint halves; §E design section of the appendix.

## Rulings (owner)
- D1 BACKEND (2026-09-04): Cloudflare Workers + D1 on the $5/month Paid plan, Clerk free tier for sign-in. Region US.
  Budget cap $5/month. YES to a deploy token for Claude Code. Accounts are created when M3 starts.
- BAKE-OFF (2026-09-04): "Ok let's do it" — T3 (the server authority's core) is built twice from one identical brief,
  by Claude Code and by Codex (GPT-6 Astra); the conformance gate, the owner's verification rigs and an interop rig
  with the T2 client decide. The winner earns the next legs; benchmarks do not.
- Standing: D2 engine = EXTRACT, not rewrite (recommended; the port oracle proves it). D3 dad test now on the mock.
  D4 freeze the suite after v4. D5 per-athlete data private from day one on the server.

## Principles (the project manager's rules)
1. Ship the thinnest thing that satisfies the laws; the suite holds the bar, screens stay simple. No new spec sections
   unless a law bites (a witness meeting the four-part bar: lost fact / unconsented apply / untrue value / hidden commit).
2. One reviewer round per milestone, on code and tests, not prose. Reviewers attack the product with laws.
3. Every artifact the owner moves is ONE file, last in the message, destination named. The owner's only word to a builder
   is "go"; the brief is a file in the repo.
4. Nothing private in AI packs: the live ledger blob and its golden are regenerated locally, never shipped.
5. Real use beats another law: the dad test and the owner's own daily use on the new client come as early as a screen exists.
6. Execute before ruling; adversarial read before every delivery; every fixed defect gets a red-first law.

## Milestones (rough weeks; the bar does not move to hit a date)
- M0 · CLOSE THE OLD APP — DONE 2026-09-04 (merged, live, frozen). Remaining: Sol/Grok v3 verdicts → suite v4 (their
  objections + the T2 findings: B-durability must restart from the store; canonical-v2 for the decimal defects; rig185's
  rename shape) → the suite FREEZES like the sheet.
- M1 · SEE IT (now, in parallel). Mock LIVE → dad test → rulings. Backend RULED.
- T3 · THE AUTHORITY — DONE 2026-09-04, RULED. Two builders, one brief. Pre-registered scorecard (rebuild/t3/SCORECARD.md):
  gate, independence, interop = tie; ten breaks 10/10 vs 9/9 effective; SEAMS Astra 9 vs Claude 13 (one omitted fixture
  constant, ×2). Owner ruled ASTRA the winner; rebuild/t3-authority-astra is merged into rebuild/t2-client-core; the
  Claude branch is KEPT (its suite findings 6a–6g go into suite v4). Sol's blind A/B read is a check on the scorecard, not
  a blocker. The same scorecard is re-run on M2 module 1 before any further change of builder.
- M2 · THE ENGINE (1–2 weeks). Cut the FINAL golden from the frozen v7.56.0 first; extract the decision engine as pure
  modules (rebuild/m2/RECON.md: 12 modules, clock injected, ≈ 30 agent-hours); the port oracle proves identical reads
  on the owner's real ledger. FINAL golden cut from fe516c1 (v7.56.0) by Claude Code; ASTRA builds module 1
  (rebuild/m2/BRIEF-1.md: dates + constants + seed + plan + progression read-side, partial census as the gate).
- M3 · WALKING SKELETON (1–2 weeks). The authority on Cloudflare Workers + D1 (owner creates the accounts; deploy token
  to the builder), real on-device storage, ONE screen (Today) end-to-end on the owner's phone with his ported data.
- M4 · THE THREE MOMENTS (2 weeks). Gym card + set logging, proposals + consent, Review/Re-entry; second device; the
  30-day soak on the store stub; restore drill. Dad beta starts here.
- M5 · LAUNCH PREP. Hardening from beta; equipment-agnostic onboarding; priority muscles and training days as per-athlete
  setup; trademark clearance for "Earned"; staged reversible release.

## Definition of done (every milestone)
Gate green (suite CONSISTENT + SELFTEST PASS + check.mjs --strict) · one reviewer round answered by execution · the
owner's ruling recorded here · handoff file committed · nothing private shipped · this file updated.
