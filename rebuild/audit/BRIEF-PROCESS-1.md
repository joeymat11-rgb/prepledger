# EARNED — PROCESS AUDIT 1 (brief for ASTRA, read-only) — the plan, the gates, the project manager, and the owner's workload

Date 2026-09-04. Commissioned by the owner. You are auditing the DEVELOPMENT PROCESS, not the product code (the code audit follows the
engine extraction, module by module, with red-first laws — see rebuild/m2/BRIEF-1.md §4(9)). You are a capable model with fresh eyes and no
stake in past decisions; that is the point. Treat every document below as a HYPOTHESIS, not a starting point: the build chat that wrote most
of them (cowork, Claude) is the project manager you are auditing, and models drift toward validating a confident document. Disagree where the
evidence supports it. An audit that finds nothing wrong will be read as an audit that did not look.

## 0. Branch and limits
Base: `rebuild/t2-client-core` at its tip. Branch `rebuild/audit-process-1`. You may ADD exactly one file: `rebuild/audit/REPORT-PROCESS-1-ASTRA.md`.
Change nothing else. Read anything. Run anything read-only (the suite, the gates, git log/blame). Never print a token, never touch main,
never read or quote private/ (it should not exist in your checkout; if it does, say so and do not open it).

## 1. What to read (in this order)
GOALS.md · CLAUDE.md · AGENTS.md · rebuild/ROADMAP.md (v1.2) · rebuild/m2/RECON.md · rebuild/m1/BACKEND-PACKET.md · rebuild/t3/BRIEF.md ·
rebuild/t3/RIGS-PREREGISTERED.md · rebuild/t3/SCORECARD.md · rebuild/t3/REPORT-ASTRA.md and, on branch rebuild/t3-authority-claude,
rebuild/t3/REPORT-CLAUDE.md · rebuild/conform/README-suite.txt and run.cjs · docs/ratified/ (the sheet, the protocol, the README's MISSING
list) · docs/pipeline-2026-08-12.md · NEXT.md · HANDOFF.md 0.23–0.24 · the git log of the last 30 days (who committed what, which branches
are unmerged and why).

## 2. What to audit — six questions, each answered with evidence (file:line or commit) and a ranked finding list
1. THE PLAN. Is the milestone order (M1 mock → M2 engine → M3 walking skeleton → M4 three moments → M5 launch) the fastest safe path to a
   dad-usable beta? What is missing from the roadmap entirely (candidates you must consider and accept or reject with reasons: backups
   and the restore drill; key rotation and account recovery; the athlete's data privacy in a PUBLIC repo — the owner chose public for his
   own ledger, but the product's athletes are not him; cost ceilings; observability/error beacon for the rebuild; a rollback story for
   the data port; TZ/DST; App Store/PWA distribution; the trademark)? Are the estimates (≈30 agent-hours for M2, 1–2 weeks per milestone)
   honest given what T2 and T3 actually took?
2. THE GATES. The method is spec-as-tests: a ratified runtime sheet → a conformance suite (99 laws, reference models, mutants, a port
   oracle with a golden cut from the frozen engine) → builders pass the gate → the build chat re-runs everything → one blind reviewer.
   Where can a WRONG thing pass? Name concrete holes: laws that assert shape not value; the golden's clock/TZ pins; what the census does
   not cover (RECON §5 lists some); the seams both T3 builders documented; the reviewer reading prose instead of executing. For each hole:
   would it have let a real defect through, and what closes it?
3. THE PROJECT MANAGER. Audit cowork's decisions on record: staging the rebuild client-first; the bake-off design and the pre-registered
   scorecard (was "seams, ×2 for omissions" the right deciding item? was 10-vs-9-effective breaks scored fairly?); ruling Astra the
   winner (cowork is a Claude model that recommended against a Claude builder — check the reasoning for over-correction as carefully as
   for bias); retiring Grok; keeping Claude Code on integrate/ship; the "extract first, audit second" order for M2; the suite v3.1
   ruling (sensitivity probe's old engine → a0009c3). For each: agree, disagree, or "cannot tell without X". At least three findings
   here must be disagreements or material corrections, or explain why you could not find three.
4. THE OWNER'S WORKLOAD. The owner has no coding background and carries every file between four surfaces by hand (build chat → Claude
   Code → Codex → reviewer). He has declined API automation of the reviewers. Within that constraint: which hops are unnecessary, which
   could collapse into one, what could a scheduled task or a repo convention (like NEXT.md / AGENTS.md) absorb, and what is the smallest
   change that removes the most relay effort? Also: single points of failure (one PC, one chat that can die and lose its files, one
   person as the only relay).
5. STAFFING. The owner intends to move much of the build to Codex/Astra. Say plainly what should and should not move, and why: what
   Claude Code's seat (local PC, token, ship pipeline, goldens) actually requires; whether one model family building AND reviewing is
   acceptable and where the cross-family check must sit; what a fair re-test of the bake-off on M2 module 1 looks like. You are auditing
   your own role here — say so, and make your reasoning checkable.
6. REPO HYGIENE. Unmerged branches (docs/ratified bundle, rebuild/t2-client-core, the T3 loser branch); CLAUDE.md vs AGENTS.md vs
   HANDOFF.md drift and stale numbers; whether the public repo currently exposes anything the rebuild's own rules would forbid; whether
   the frozen app's freeze is actually enforced by a gate or only by a sentence.

## 3. Report format — `rebuild/audit/REPORT-PROCESS-1-ASTRA.md`
(1) Ten findings max, ranked by expected cost of being wrong, each: the claim · the evidence (path:line / commit / a command you ran and its
verdict line) · what to do · who does it (owner ruling / cowork / Claude Code / Astra) · effort. (2) The six questions, each in ≤ 15 lines.
(3) Explicit disagreements with cowork, numbered. (4) What you could NOT assess and why. (5) Time spent; tokens if exposed.
Rules of evidence: a claim about a gate is made by RUNNING the gate; a claim about a document is made with its line; "I believe" is
labelled as such. No proposals to change product behaviour — that is the code audit's job, later.

## 4. What happens next
cowork answers every finding by execution (not by reply), the owner rules on each, disagreements about cowork's own judgment go to Sol
as tie-breaker, and accepted findings land in ROADMAP v1.3. Your report is kept in the repo unedited.
