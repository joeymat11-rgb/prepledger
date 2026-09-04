# EARNED — M3 PLAN: THE WALKING SKELETON — author COWORK (written 2026-09-05 blind to any other plan; sealed by sha256 before the other was started)

Inputs used (identical set for both authors): rebuild/ROADMAP.md v1.3 · rebuild/m1/BACKEND-PACKET.md · the runtime sheet v1.7.38 §C (D1
gate C1–C11) and the lease/state rules it cites · rebuild/authority/README.md (T3 ASTRA, "future D1 backend") · rebuild/client (T2) ·
rebuild/audit/REPORT-PROCESS-1-ASTRA.md F1/F2/F6/F9 · the clickable mock (Today screen) · GOALS.md guardrails.

## 1. Goal and definition of done
GOAL. One athlete (the owner) opens an installed PWA on his iPhone, sees TODAY painted from his own ported ledger, weighs in, and the
weigh-in reaches a Cloudflare Worker + D1 authority, is admitted, signed, receipted, and appears on a SECOND signed-in device — with
the app usable offline in between. Everything else is out.
DONE means all of these hold, each proven by a rig whose verdict line is in the report:
  D1. Round trip: weigh-in on phone A → ACCEPTED disposition from the real Worker → receipt pulled on phone B → both frontiers equal.
  D2. Offline: airplane mode → weigh-in shows "Saved" (never "Synced") → reconnect → drains once (C6 both cuts: request lost, reply lost).
  D3. Port: the owner's real ledger is imported through the engine's migrate (module 5) and reduce; census-identical reads to the
      frozen app on his phone for the Today face (regime, statusFace, statusTarget, currentRate) — the port oracle, run on the phone's
      exported state.
  D4. Privacy: a second (synthetic) athlete cannot read, write or infer the owner's rows — proven against the REAL Worker/D1, not the
      memory backend (audit F2).
  D5. Recovery: a D1 point-in-time restore into an ISOLATED database, then a Worker pointed at it, serves the same log (recorded
      RPO/RTO); reinstall → sign in → resync rebuilds the phone from the authority (C5).
  D6. Money: the Cloudflare spending alert fired once in a rehearsal and we wrote down what "$5/mo" actually stops (audit F2).
  D7. Soak: the C3 stub on the owner's phone has a start date recorded and has NOT lost its outbox at the M3 checkpoint (the 30-day
      verdict lands in M4; M3 only proves the clock is running).
  D8. Gates: suite CONSISTENT with authority + client GREEN; frozen app byte-identical; nothing private in the repo; ONE CI job runs the
      rebuild suite on the branch (audit F6).

## 2. Work breakdown (owner · engineering estimate · what it depends on)
  W0  ACCOUNTS (owner, 45 min of clicks, day 1): Cloudflare account + Workers Paid ($5/mo) + spending alert at $5 · D1 database
      `earned-us` (US location hint, cannot change later) · one API token scoped to Workers Scripts:Edit + D1:Edit + Secrets, handed to
      the integrator's environment only · Clerk application (free) with email + passkey · Apple: nothing (PWA). Click-list in §5.
  W1  THE PHONE SOAK STUB (integrator, 3–4 h, day 1–2; BLOCKS nothing but starts the 30-day clock): a bare installed PWA on a Netlify
      preview URL with the T2 store on IndexedDB + a seeded outbox of 3 ops + an integrity hash painted on open. Recorded: device, iOS
      version, install date, storage-pressure protocol (fill the phone to < 1 GB free for 48 h during the window). Verdict in M4.
  W2  D1 BRIDGE (Astra, 10–14 h): the async request bridge the T3 README describes — scoped row snapshot → run the synchronous core
      against a staged row cache → publish the batch under a checked revision (`athlete_rev`) → retry on stale revision → release the
      disposition only after the batch is durable. Tables: ops, log, dispositions, slots, leases, athletes, plan_txns, issuances,
      revisions. Rig: the 34 §A laws run against a LOCAL D1 (wrangler/miniflare) instead of memoryBackend — same adapter contract,
      new backend — plus the T3 ten-break rig re-run on the D1 path.
  W3  THE WORKER (Astra, 6–8 h; after W2): routes `POST /op`, `GET /pull?from=W`, `POST /lease`, `GET /time`; HMAC verification of the
      device chain; Clerk JWT → athlete_id mapping (enrolment row); signing key in a Worker secret; structured error codes = the sheet's
      states; no health data in logs. Rig: interop (rig190) over real HTTP to a `wrangler dev` instance; then to the deployed Worker.
  W4  ON-DEVICE STORE (Astra, 6–8 h; parallel with W2): T2's backend interface on IndexedDB with ONE transaction per commit; integrity
      check before first paint; restore-required (state 18) on missing/evicted store; the lease + high-water clock persisted; C4
      migration harness with kill-injection before/during/after the boundary. Rig: rig187 (restart durability) re-pointed at IndexedDB
      in a headless WebKit; C11 lease cases as a table test.
  W5  THE PORT (Astra, 8–12 h; needs engine modules 5+6 = migrate + merge — these are the M2 long pole, see §3): import = the frozen
      ledger blob → migrate → reduce → the T2 store as ACCEPTED history under a synthetic "import" device with its own lease; the
      port oracle run on the phone's exported state vs the frozen golden; checkpoint + rollback rehearsal that preserves writes made
      after the import (audit F2).
  W6  TODAY, ONE SCREEN (Astra, 8–10 h; parallel with W3): the ratified Today face from the mock (weigh-in sheet, Why sheet, the one
      instruction) bound to the engine's read side (modules 1–4) and the T2 client; no other screen; 16 px inputs; the fixed-chrome
      band; cold start ≤ 2 s measured on the owner's phone (C10); 200 % text + VoiceOver pass (C7).
  W7  SIGN-IN + ENROLMENT (Astra, 4–6 h): Clerk on the PWA → JWT → `POST /enrol` creates athlete + device + first lease; second device
      = same account, new device row; sign-out never deletes the local store (state 18 path instead).
  W8  DRILLS (integrator with the owner's accounts, 4–6 h, last week): two-athlete isolation on the live Worker (D4); D1 Time Travel
      restore into `earned-us-restore` + Worker pointed at it (D5); spending alert rehearsal by a synthetic burst (D6); key-rotation
      drill (new signing key epoch; old receipts still verify); reinstall → sign-in → resync (C5); backup-integrator rehearsal (audit
      F9: a second machine deploys from a clean clone with the token in the environment).
  W9  CI + FREEZE GATE (integrator, 2–3 h): a `rebuild` job in deploy.yml that runs the suite + census-partial on every rebuild/*
      branch; a frozen-path diff (src/, app.js, index.html vs main) that fails the job on any change (audit F6).
  W10 REPORT + REVIEW (cowork 4 h; Sol one blind round): every D-line with its rig verdict; the owner's ruling recorded in ROADMAP v1.4.
  Engineering total ≈ 56–75 agent-hours. Calendar: 2 weeks IF M2 modules 5+6 land by the end of week 1 (see §3); otherwise M3 ships
  with a STUB port (W5 deferred to M4) and the walking skeleton still walks on synthetic data — that is the fallback, decided at the
  week-1 checkpoint, not discovered at the end.

## 3. Sequence and critical path
  Day 1: W0 (owner) + W1 (soak stub installed — the 30-day clock starts) + W2/W4 start in parallel.
  Days 2–5: W2 → W3 (bridge then Worker); W4 → W6 (store then screen); W7 alongside W3.
  Week-1 checkpoint (owner rules): are engine modules 5+6 merged? YES → W5 in week 2. NO → W5 deferred; M3 closes on synthetic data.
  Week 2: W5 (or its deferral), W8 drills, W9 CI, W10 report → Sol → owner ruling.
  CRITICAL PATH: W0 → W2 → W3 → W8 (the real backend must exist before any drill); the port (W5) is the RISK path, gated by M2, and
  deliberately NOT on the critical path so M3 cannot be held hostage by the engine extraction.

## 4. Risks (ranked) and what we do about each
  R1 M2 migrate/merge (modules 5–6, ≈ 3,100 lines of the hardest code) slips → the port slips. Mitigation: §3's checkpoint + stub port.
  R2 D1's async API vs the synchronous core: a wrong bridge silently loses atomicity (T3 README's own warning). Mitigation: W2's rig is
     the 34 laws + ten breaks on a LOCAL D1 before any deploy; a stale-revision retry test with two concurrent writers.
  R3 iOS evicts IndexedDB under storage pressure (C3) → the PWA route dies → native trigger. Mitigation: W1 starts day 1; the verdict
     is a scheduled fact, not a hope; the sheet says design freeze waits for it, so M4's design freeze is the dependency, not M3.
  R4 Clerk holds emails; a second vendor; branding on free tier. Mitigation: enrolment stores only the Clerk subject id; the athlete
     table never holds an email; documented in the privacy note; revisit at M5.
  R5 The port turns the owner's real ledger into ACCEPTED history under a synthetic device — if the migrate path is wrong, his history
     is wrong on his phone. Mitigation: the port is read-only on the source (ledger/state.json never changes); the census oracle on the
     phone's export is the gate; rollback rehearsal before the real run; the frozen app stays installed alongside until M4.
  R6 Secrets: the API token reaches an AI agent's environment. Mitigation: scoped token (Workers + D1 + Secrets only, one account, one
     zone), rotated after M3, never in the repo (the existing check.mjs secret scan covers the tree; the Worker's own logs are checked
     for the signing key by a rig).
  R7 The Worker's clock / signed time: the lease enforcement needs `GET /time` signed; a wrong implementation makes offline writes
     refusable after reconnect (state 20). Mitigation: the C11 table test with ±24 h skew, rollback, DST, TZ change.
  R8 Owner relay load: M3 has more owner clicks than any tranche so far (accounts, phone installs, drills). Mitigation: §5 is ONE list,
     done once on day 1; drills are run BY the integrator with the owner present for 20 minutes, not by the owner.

## 5. The owner's click-list (day 1, ≈ 45 minutes, once)
  1. cloudflare.com → sign up → Workers & Pages → Plans → Workers Paid ($5/mo) → Billing → Notifications → spending alert at $5.
  2. Workers & Pages → D1 → Create database → name `earned-us` → location hint: Western North America → Create.
  3. My Profile → API Tokens → Create Token → Custom: Workers Scripts:Edit · D1:Edit · Workers KV:Read (none else) → this account only
     → copy ONCE into the integrator's environment (never a chat, never a file in the repo).
  4. clerk.com → sign up → Create application "Earned" → sign-in: Email code + Passkeys → copy the publishable key (public) into the
     handoff; the secret key goes the same way as (3).
  5. Your phone: open the Netlify preview link the integrator sends → Share → Add to Home Screen → open it once (the soak starts; note
     the date on the card it shows). Then leave it alone for 30 days.
  6. A second device (the old phone or the iPad): same sign-in, in week 2, for D1's two-device test — 5 minutes.

## 6. Acceptance tests (executable; each maps to a D-line)
  T-D1 rig190 over HTTPS to the deployed Worker: two devices → frontiers 2/2, receipts contiguous, dispositions verify with the PUBLISHED
       authority key. T-D2 the flaky-transport rig (rig190 e) over real HTTP with a kill-switch proxy for both C6 cuts. T-D3 the port
       oracle `check` on the phone's exported state vs the fe516c1 golden (verdict only). T-D4 a synthetic athlete's JWT against every
       route with the owner's athlete_id → 403/404 and ZERO rows readable; SQL-level check that no query lacks `athlete_id`. T-D5 restore
       into `earned-us-restore`, pull(0) from a Worker bound to it, byte-compare the log; RPO/RTO written down. T-D6 the burst rig +
       the alert e-mail screenshot (owner) + what the plan does at the cap, quoted from the dashboard. T-D7 the stub's integrity hash
       and install date at the checkpoint. T-D8 CI green on the branch with the rebuild job present in the run log.

## 7. Out of scope (named so nobody sneaks it in)
  Gym card / set logging / proposals / consent (M4) · policy + progression adapters (M4) · source-ingestion protocol (owner ruling
  pending) · payload encryption at rest beyond D1's own (M5) · App Store / native (only if C3 fails) · dad beta (M4) · equipment
  onboarding (M5) · any change to the frozen app.

## 8. What I am unsure about (and how it gets resolved)
  U1 Whether the T2 client's IndexedDB path can be made truly atomic on iOS Safari (one transaction per commit incl. the outbox) —
     W4's rig decides; if not, the store falls back to a single-blob write with a journal, and the report says so.
  U2 Whether Clerk's free tier allows passkeys without branding on the sign-in element — checked on day 1; email code is the fallback.
  U3 The engine's migrate (module 5) is the largest unknown in the whole rebuild; my estimate for W5 assumes it exists — hence §3.
  U4 Cloudflare's "spending alert" semantics (alert vs hard stop) — T-D6 exists precisely because I do not know.
