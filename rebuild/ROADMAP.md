# EARNED — REBUILD ROADMAP v1.5 (2026-09-05, night)

The durable plan. A chat can die; this file cannot. Every Claude Code handoff that changes the plan updates this file.
Owner: Joe (rules). THE SPLIT (owner ruling 2026-09-05, after the M3-plan test — rebuild/m3/DECISION-MEMO context in
rebuild/DECISIONS.md): ASTRA (OpenAI Codex / GPT-6) writes the technical plans and briefs and builds modules against the
suite; COWORK (Claude) is the owner's project manager of record — relay, plain language, execution audits, the decision
ledger, and the cross-family check by execution (every claim re-run, never read); CLAUDE CODE (on the owner's PC) is the
integrator seat — secrets, private-golden custody, merges, releases — a ROLE with a runbook, not a model. Sol = the blind reviewer (one round per milestone,
told to disagree) and the tie-breaker on disputes about cowork's own judgment; Grok is retired from the standing loop
(2026-09-04 ruling; the T3 pre-registration promised two blind reviewers — this is a RECORDED change of plan, not its
fulfilment). The integrator seat (secrets, private-golden custody, releases) is a ROLE with a runbook, not a model; a
backup-integrator rehearsal is queued for M3. Dad = first real user.

## Now (the task index — brief · base · next actor)
- M2 modules 1–4 DONE (read side complete + volume). MODULE 5 = migrate (the long pole) · rebuild/m2/BRIEF-5.md (Astra-written, cowork-accepted) · ASTRA builds now · gate = FULL port-oracle check, three blobs, two Date modes. Then 6 (merge), 7 (writers), the SECOND GATE, the post-extraction audit (D1–D32).
- M3 DAY ONE — DONE 2026-09-05 by the owner: Cloudflare account, Workers Paid, $5 budget alert, domain earnedcoach.com (Cloudflare
  Registrar, auto-renew). Phone: iPhone 17 Pro, iOS 26.6.1. Second test phone: none yet (week 2).
- M3 SOAK RUNNING: seeded 2026-09-05T01:04:21Z on the owner's iPhone 17 Pro (receipt rebuild/m3/SOAK-1.md); earliest readback 2026-10-05; pressure window to book in week 2. Host: https://earned-soak.netlify.app (.github/workflows/soak.yml).
- M3 W3 DONE (PR #20): clock/lease continuity spike → RED WITNESS C1-C11-RESTART = an OPEN OWNER RULING (rebuild/m3/SCORECARD-W3.md, DECISIONS.md); iPhone hand test + DST NOT RUN (booked with the pressure window). Next Astra streams: W5 (D1 bridge + Worker + P-256 boundary) and W6 (browser bridge) per PLAN-M3-v1.
- M3 W4 setup · Claude Code prepares the deploy-token permission list + a no-terminal secret-entry method for the owner; creates D1 `earned-us` with `--jurisdiction=us`.
- Sol: blind T3 read (in flight) → then PROCESS AUDIT 1 + cowork's answers for the F8/F9 tie-break.
- Owner rulings open: (1) is the source-ingestion protocol required for beta? (2) defect log D1–D22 (one ruling pass after module 3).

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
- M2 · THE ENGINE (engineering ≈ 30 agent-hours; calendar 1–2 weeks). FINAL golden cut from fe516c1 — DONE (38741fb).
  Module 1 (dates, constants, seed, plan, progression read-side) — DONE by ASTRA, PR #11, scored and merged
  (rebuild/m2/SCORECARD-M2-1.md; 10-entry DEFECT LOG preserved, nothing fixed). Modules 2–7 follow RECON §4's order.
  M2 CLOSES only when BOTH gates hold: the census on all three blobs AND the second gate (engine-test.jsx ≈ 2,600
  assertions + sync-laws + engine-surface baseline re-pointed at the module) — the census alone cannot see a broken
  writer (audit F5, proven by cowork's bite on module 1). Then the post-extraction AUDIT: every defect-log entry → a
  red-first law → owner ruling → fix in the module (never in the frozen app).
- PROCESS AUDIT 1 (ASTRA, PR #12) — ten findings, seven disagreements; cowork's execution answers in
  rebuild/audit/ANSWERS-1.md. Accepted: F1 (soak now), F2 (M3 acceptance gates), F3 (family inventory), F4/F5/F7
  (suite v3.2 + v4 items), F6 (branch tracks frozen main), F10 (AGENTS.md, one-PR-link relay). F8/F9 to Sol.
- M3 · WALKING SKELETON — PLAN OF RECORD = rebuild/m3/PLAN-M3-v1.md (Astra, merged from the M3-plan test; verified by cowork
  2026-09-05; PR #13/#15 kept as evidence). Rulings: "$5" = budget ALERT (informational) + request limits, residual exposure
  written down; domain BOUGHT (earnedcoach.com); D1 created with `--jurisdiction=us`; Clerk email-code only; P-256 public
  verification replaces the shared HMAC on phones; the client never says Saved before the IndexedDB commit resolves; sign-out is
  state 17. Dated checkpoint proposed 2026-09-11 17:00 New York (migrate/merge ready? else I1 synthetic Today and M3 stays open).
  (calendar 10–15 working days + the 30-day soak clock, which starts on DAY ONE in parallel with M2: a stub PWA on
  the owner's phone writes an outbox, is left untouched, and is read back after ≥ 30 idle days — device/OS, start date,
  pressure protocol and earliest verdict date recorded in rebuild/m3/SOAK-1.md). The authority on Cloudflare Workers +
  D1 (owner creates the accounts; deploy token to the integrator), real on-device storage, ONE screen (Today) end-to-end
  on the owner's phone with his ported data. DEFINITION OF DONE adds (audit F2): two-athlete isolation test on the real
  backend · restore into an isolated account · recorded loss/recovery objectives · key-rotation + account-recovery drill ·
  import checkpoint + rollback rehearsal that preserves new writes · privacy-safe error/version telemetry · an OBSERVED
  spending alert with what "$5" actually stops written down · backup-integrator rehearsal.
- M4 · THE THREE MOMENTS (2 weeks). Gym card + set logging, proposals + consent, Review/Re-entry; second device; the
  soak VERDICT (started in M3) and the restore drill are inputs here, not started here. REQUIRED FAMILIES for beta (audit
  F3): authority + client + policy (D13/D14) + progression adapters GREEN — "absent family, RED as specified" is not
  beta-ready. Contract → module → milestone: §A authority → rebuild/authority (T3, done) · §B client → rebuild/client
  (T2, done) · D13/D14 policy → rebuild/policy (M4) · progression laws → rebuild/engine/progression + the M4 adapter ·
  A6 consent halves (deferred) → M4 · source-ingestion protocol → owner to rule whether beta needs it. Dad beta starts here.
- M5 · LAUNCH PREP. Hardening from beta; equipment-agnostic onboarding; priority muscles and training days as per-athlete
  setup; trademark clearance for "Earned"; staged reversible release.

## Definition of done (every milestone)
Gate green (suite CONSISTENT + SELFTEST PASS + check.mjs --strict) · one reviewer round answered by execution · the
owner's ruling recorded here · handoff file committed · nothing private shipped · this file updated.
