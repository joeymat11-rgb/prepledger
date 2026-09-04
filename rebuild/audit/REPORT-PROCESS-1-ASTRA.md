# PROCESS AUDIT 1 — ASTRA

2026-09-04. Audited base `911e3ae02194380e9baaccbe255de58a3ad02a33`, branch `rebuild/audit-process-1`.
Only this report is delivered. No product or suite change is proposed as part of this audit.
The plan is viable, but its current green labels and milestone dates overstate what has been proved. Start the real device experiment earlier, explicitly assign the missing product contracts, and replace relay-by-prose with evidence tied to one commit.

**Independence disclosure:** I am ASTRA, auditing my own team's T3 submission and proposed future staffing. I inherited the earlier ASTRA conversation; I am not a blind, fresh reviewer of that result. The observations below are reproducible, and disputed judgments about my role should go to Sol as the brief directs. The simultaneous M2 builder supplied engine artifact paths, not my findings or conclusions.

## 1. Ranked findings

Rank is expected cost of being wrong; effort below is an estimate of work to close the process issue, not a delivery promise.

### 1 — The calendar-bound feasibility test is on the wrong part of the schedule

**Claim:** M4's two-week duration cannot contain the required 30-idle-day device result, and a memory-store property test cannot substitute for it. Finding out after building the app that the chosen storage approach loses acknowledged entries is expensive.
**Evidence:** `rebuild/ROADMAP.md:54–59` puts real storage in M3 and the 30-day soak/restore drill in M4. Runtime sheet `rebuild/conform/gates/inputs/EARNED-RUNTIME-SHEET-v1.7.38.txt:631–663` requires actual supported devices, storage pressure, transactional migration, and the soak to start as soon as an installed durable-store stub exists; design freeze waits. Executed current suite: the one soak law is GREEN in seconds; this is evidence of its modeled invariants, not 30 elapsed days. `rebuild/t3/REPORT-ASTRA.md:183–187` explicitly disclaims a calendar soak and disk durability.
**Do:** Put a minimal installed PWA/storage experiment in parallel with M2 now; record device/OS, start date, untouched-outbox proof, pressure protocol, and earliest verdict date. Keep the dad mock test now; make the native-trigger decision a visible dependency of beta.
**Owner / effort:** Cowork schedules; Claude Code or Astra builds the stub; owner supplies the phone. Approximately 0.5–2 engineering days plus at least 30 actual idle days.

### 2 — “Private from day one” and “backups exist” need acceptance gates before the first real port

**Claim:** The selected backend is a plausible choice, but the roadmap names infrastructure rather than the operational proof needed before M3 stores real athlete data. Restore only in M4 is late for the owner's M3 port.
**Evidence:** `rebuild/ROADMAP.md:22–28,54–59` rules private per-athlete data, a $5 cap, M3 port, M4 restore, and M5 reversible release. `rebuild/m1/BACKEND-PACKET.md:6,15,35–38,44–47` names backups and a cap but makes no executed restore or spending-limit claim. T3's omissions include auth, encryption, key rotation/recovery, signed-time freshness and persistent clock (`REPORT-ASTRA.md:181–195`; Claude report at `0c3e7ce:rebuild/t3/REPORT-CLAUDE.md:138–146`). The sheet already requires identity-key continuity and authenticated athlete/device binding (`…RUNTIME-SHEET…:96–115`).
**Do:** Before M3's real-data port, require a synthetic two-athlete authorization/isolation test, backup restore into an isolated account, recorded data-loss/time objectives, key rotation/account-recovery drill, import checkpoint and rollback rehearsal that preserves new writes, privacy-safe error/version telemetry, and an observed spending alert/limit path. Record what “$5 cap” actually stops; a price point alone is not a cap. This defines proof for existing requirements, not new engine rules.
**Owner / effort:** Owner rules acceptable loss/recovery and budget behavior; cowork owns the checklist; integrator executes. Approximately 1–3 days across the storage/auth integration, then recurring restore checks.

### 3 — The roadmap has no explicit owner or completion gate for the missing product families

**Claim:** Engine extraction and a consistent suite do not deliver the ratified policy/progression product or the source-ingestion protocol. These can fall between M2 and M4 because no named tranche closes them.
**Evidence:** Executed suite reports `29 RED-first against absent families · 70 GREEN against present families`; the 29 are 20 policy and 9 progression laws. `run.cjs:44–51` deliberately accepts absent families. `rebuild/ROADMAP.md:50–59` assigns extraction, infrastructure and screens but no corresponding policy/progression/protocol delivery. `rebuild/m2/RECON.md:60–63` explicitly distinguishes the frozen engine's values from D13/D14 and D7's rebuild rules. Protocol scope is the admitted source-submission set (`…SOURCE-INGESTION-PROTOCOL-v1.1.txt:3–17`); the checked-in rig is a model, not an implemented admission service.
**Do:** Add a contract-to-module-to-milestone table, including each deferred consent half and the decision on whether source ingestion is required for beta. M2 passes compatibility; a later, owner-authorized stage closes semantic differences with red-first laws. Give beta its own required-family inventory so zero adapters cannot count as beta readiness.
**Owner / effort:** Cowork drafts; owner rules scope; Astra implements only later assigned modules. Approximately 2–4 hours to make the missing work and dependencies explicit; implementation is not estimated by this audit.

### 4 — Real trust defects can pass the present laws; “99 STRONG” is not independent correctness

**Claim:** Mutating the reference proves that selected assertions discriminate selected mistakes. It does not establish that those assertions express the entire contract or that the supplied fixtures are valid.
**Evidence by execution:** On unchanged T2, a transport returning a fabricated unsigned receipt produced `UNSIGNED_RECEIPT_WITNESS {"before":0,"after":1,"signed":false}`. All 35 client laws still passed in the suite run. The frontier law itself supplies only `{seq}` (`laws/sheet-B-client.cjs:53–55`); `rebuild/client/sync.cjs:70–81` persists pull data without the disposition verifier. This demonstrates an unguarded trust seam under a hostile/faulty transport, not a remote exploit against a deployed service: no HTTP implementation exists yet. Independent canonical probe printed `COLLISION 1.5e+3 1.5e+3 true` for distinct `1.5e30` and `1.5e300`, while the candidate-bound canonical law passed. The durability law checks live acknowledgements/outbox membership, without reconstructing a new client from saved bytes (`laws/sheet-B-client.cjs:13–16`).
**Seam evidence:** Both T3 reports disclose wrongly bound second-athlete leases. ASTRA re-signs the fixture in its adapter and authenticates bare time supplied by the law (`REPORT-ASTRA.md:133–159`); Claude weakens admission binding (`0c3e7ce:…REPORT-CLAUDE.md:110–120`). Issuance trust, Boolean basis confirmation, and domain defaults also remain seams. These are substantially different risks, not comparable units in a seam count.
**Do:** Promote the executed receipt/canonical witnesses and restart-from-serialized-store checks into the next authorized suite revision; add adversarial tests against raw product APIs as well as adapters. Require reviewers to check fixture meaning against the sheet and execute a cross-family round trip. Do not “fix” module 1's copied behavior to answer this audit.
**Owner / effort:** Cowork owns suite v4; Astra can supply witnesses; independent reviewer verifies them. Approximately 0.5–1.5 days to close the listed test gaps, separate from any product work.

### 5 — The census can preserve wrong behavior perfectly, and can miss broken behavior entirely

**Claim:** The port oracle is useful compatibility evidence, not a full engine audit. A later implementation must not claim the whole engine proved merely because the census matches.
**Evidence by execution:** Public-only oracle check passed 7/7 and old-engine sensitivity 9/9 at the pinned September 3/New York clock. Then I replaced `completeSession`, `runAdaptive`, and `mergeState` with functions returning `null` in a temporary function table, leaving files unchanged: both public fixtures produced `censusDifferences:0`. `RECON.md:275–284` accurately lists these and other omissions. The clock pins test local noon on one date and zone; `RECON.md:191–204` explains this, and `:289–310` identifies remaining clock, draft and locale risks.
**Do:** Keep “extract first, audit second,” with exact source/fixture parity as the first gate; require the stated second gate for writers/merge and a date/hour/TZ/DST matrix before engine integration. Track copied defects separately with frozen-source lines and evidence. A later change needs an approved semantic delta and red-first witness; do not revise the compatibility golden to hide it.
**Owner / effort:** Cowork makes the completion bar explicit; Astra implements the assigned second gate; reviewer executes. Approximately 1–2 days of test integration, consistent with RECON's own second-gate allowance.

### 6 — Branch previews inherit stale deployment rules; the freeze is not a whole-tree byte gate

**Claim:** A correct change on main has not reached the rebuild integration branch. Current CI's green check also does not mean the rebuild suite ran or all frozen paths stayed unchanged.
**Evidence by execution:** At `911e3ae`, invoking `siteFiles()` returned `{"rebuild":90,"docs":0,"ledger":0}`. `git merge-base --is-ancestor cbe86e3 HEAD` returned 1; main's `scripts/site-manifest.mjs` contains the docs/rebuild exclusions, this base does not. `ROADMAP.md:11–12` records the fix on main. `.github/workflows/deploy.yml:37–51` runs only `scripts/check.mjs --strict`; its preview lane packages the branch's own manifest. The strict-gate implementation at `scripts/check.mjs:273–305` checks rebuilt bundle parity and frozen *outputs*, not a frozen-path hash against an authorized baseline. After adding an audit-only comment to scratch `index.html` and the inconsistent result count described in F7, the complete strict gate exited 0: `PASS 108 files ship` and `All checks passed. Safe to ship.` The index comment changes forbidden frozen bytes without changing behavior; it was deliberately not a product-rule change.
**Do:** Have the integrator bring the already-approved deployment exclusion into the rebuild branch, and prove its actual zip excludes rebuild/docs. Add a branch-aware frozen-path diff against the brief's base and a separate required rebuild validation job with milestone-specific required adapters. Authorized frozen-app changes must name their exception explicitly.
**Owner / effort:** Claude Code integrates; cowork defines branch checks; owner rules exceptions. Approximately 2–4 hours plus CI execution. No main or deployment was changed here.

### 7 — “Verified gate artifacts” currently means trusting a recorded Boolean

**Claim:** The archived specification rigs are evidence of an earlier model run. They are neither re-executed by the main runner nor bound to the product, and the artifact's own count can contradict its accepted verdict.
**Evidence by execution:** In scratch only, I changed `gates/gates.json` first result's `passed` to 0 while retaining `pass:true`. The actual runner printed `VERIFIED rig175 0/10 inputs:true impl:true clock:true` and `OK 8 gate artifacts verified … 10 gates`. `run.cjs:58` checks hashes, clock and `g.result.pass`; it does not compare `passed` with `total`. `README-suite.txt:20–21` says it requires equality. Overall suite remained INCONSISTENT for intentionally absent engine/private prerequisites; the artifact step's false acceptance is independently visible.
**Do:** Validate result schema/count consistency, then run the pinned rigs when their inputs change. Describe archived model results as such. Add candidate-bound protocol tests when an implementation exists; a hash of the rig text cannot prove an untested implementation.
**Owner / effort:** Cowork, next authorized suite revision. Approximately 1–3 hours for this runner witness and repair; product protocol tests belong to their later tranche.

### 8 — The bake-off supports a provisional assignment, not the strength of the claimed tie-break

**Claim:** Choosing ASTRA is defensible; treating the evidence as a clean scored win is too strong. The scoring mixes safety, adapter convenience and disclosure style, while one mutation never exercised its intended fault.
**Evidence:** `RIGS-PREREGISTERED.md:14–21` fixes ten breaks and raw seam count with omitted seams doubled. `SCORECARD.md:13–15,24–35` converts ASTRA's ineffective replay break to 9/9, treats that as a tie with 10/10, and decides by 9 vs 13 seams. A dead mutation is not a failure, but it also is not evidence for that tenth rule family. The default-plan omission is real and relevant; the separately probed lease-binding difference is more material than many harmless report seams. I did not rerun cowork's uncommitted rig191 and therefore cannot independently certify its counts.
**Do:** Preserve the owner's assignment. For M2, pre-register a common semantic fault per tested capability and replace an ineffective mutation until both products demonstrate the same wrong behavior; score detection then. Classify seams by violated boundary/severity and score omissions separately from implementation risk, without inferring intent. Normalize build, reading, verification and owner-relay time: Claude's report says 30 minutes reading **plus** 13 building (`0c3e7ce:…REPORT-CLAUDE.md:170–173`), whereas the scorecard reports 13; ASTRA's 18 includes reading/setup. Do not compare those as equal cost measures.
**Owner / effort:** Cowork prepares blind normalized evidence; owner rules; Sol resolves disagreement. Approximately 0.5 day for a fair common test/score packet. My own model family must be subject to it.

### 9 — Reviewer and integrator roles should be separated by evidence and authority, not by model brand or PC location

**Claim:** Moving most bounded builds to Codex is reasonable; automatically calling any same-family pass independent, or treating the PC seat as uniquely Claude-only, is not. Nor does one bake-off prove which model should build every future module.
**Evidence:** `ROADMAP.md:4–7,33,45–49` makes cowork both manager/execution auditor/cross-family check and Sol the milestone reviewer, but makes Sol's T3 check nonblocking. Preregistration `RIGS-PREREGISTERED.md:25–26` promised two blind reviews before revealing the scorecard. Existing reports and branch authors reveal identities; merely renaming reports A/B is insufficient blinding. The scorecard shows tied must-pass results; it does not compare Windows vs cloud capability or recovery/ship reliability. `HANDOFF.md:563–572` describes credential access, not a requirement for a particular model.
**Do:** Keep one accountable integrator controlling secrets, private golden cuts and release, with reproducible commands and a trained backup; the model may change after an exercised handoff. Let same-family agents build/test, but place a truly independent cross-family check on test/spec interpretation and risky acceptance before integration. Keep Grok retired from the standing relay unless evidence of incremental value warrants a targeted call. Record this as a changed review plan, not fulfillment of the original two-review preregistration.
**Owner / effort:** Owner staffing ruling; cowork documents authority/evidence requirements; integrator rehearses backup. Approximately 2–4 hours for role/runbook clarification, plus one bounded rehearsal.

### 10 — The repo carries more text than it carries unambiguous current state

**Claim:** File-based briefs help, but contradictory entry points, missing durable artifacts and manual relay still make the owner the integration bus. Another chat can inherit the wrong “NOW.”
**Evidence:** `AGENTS.md:3–14` routes through NEXT and still tells builders to regenerate the a0009c3 private fixture; `38741fb` changed the final golden to fe516c1. `NEXT.md:1` points to ROADMAP but `:33–35,74,102,108` still contains active-looking older queues. `CLAUDE.md:8–12` orders NOW, `:94–98` gives 856 assertions/850 floor, and `:250` says 8,900 source lines; `RECON.md:3` records 22,361. `HANDOFF.md:798–848` presents July recovery/phone-visibility gaps as current, and `:636` says rebase while `CLAUDE.md:112–122`/ship says merge. `docs/pipeline-2026-08-12.md:2,6,31,70` repeatedly requires Joe to relay reports/words. `docs/ratified` is absent here; its preserved branch `origin/docs/ratified-2026-09-03` has older sheet/protocol versions and README `:59–66` still lists three missing documents, including the product definition.
**Additional setup evidence:** Both T3 reports document manual golden-stamp portability work (`REPORT-ASTRA.md:86–94`; `0c3e7ce:…REPORT-CLAUDE.md:48–52`); the latter ran with restamped pins, while the former restored the published whole-file hash. These are different execution conditions despite one declared gate. A frozen setup command must establish semantic provenance and the intended pin policy without undocumented restamping.
**Do:** Make one short current task index with brief path, immutable base/head, owner, required verdicts and next authorized actor; move historical NOW text behind an explicit archive marker. Every builder commits one report/evidence packet and returns one PR link; cowork/integrator fetch it directly. The owner relays only a blind reviewer packet and its verdict where reviewer API use is declined, plus actual product/ship rulings. A scheduled task may watch stalled PRs, missing reports and unresolved rulings and notify only on actionable changes; it must not auto-approve or re-run a reviewer. Recover missing documents from the original author/account and mirror versioned nonsecret operating prompts/runbooks; do not make Joe recover files from a dying chat.
**Owner / effort:** Cowork owns index and archived statuses; integrator enforces evidence packet convention; owner supplies otherwise inaccessible rulings. Approximately 2–4 hours; greatest immediate relay reduction is “one PR URL, fetch the rest.”

## 2. Six answers

### 1. The plan
Keep mock/dad test parallel and mechanical extraction before semantic changes; advance the installed-store soak now (F1).
Backups/restore are present as topics, but proof must move before M3's real port (F2).
Key rotation/account recovery, privacy tests, cost enforcement and rebuild observability have no explicit roadmap acceptance owner; add one (F2).
Data-port rollback must be rehearsed before import; “staged reversible release” in M5 is insufficient (F2).
TZ/DST is in the sheet and RECON, so not missing from the corpus; it is missing as a concrete milestone test matrix (F5).
PWA distribution/install/update feasibility belongs in the early phone experiment; reject an unconditional App Store workstream until its native trigger fires (sheet 631–663).
Trademark is already M5 (ROADMAP59); perform a bounded owner-led name-risk check before paid branding. No legal conclusion is made here.
The missing policy/progression and protocol ownership is a larger gap than module count (F3).
Thirty agent-hours is an uncertain extraction estimate, not dishonest on available evidence; T2 has no comparable elapsed-time record, and T3 reports use different clocks (F8).
One–two-week milestones exclude the 30-day wait and review/owner availability; publish engineering effort and calendar dependencies separately.

### 2. The gates
Useful: exact law inventory, separate absent-family expectations, reference mutation discrimination, port pins, and genuine semantic perturbations; my public oracle/sensitivity passed.
False positives are concrete: unsigned pull advanced W; distinct canonical numbers collided; all relevant product laws remained GREEN (F4).
Shape/count examples: frontier accepts `{seq}` without authenticity; durability checks live outbox count without restart; state 8 checks statuses without full consent contracts (F4).
A copied wrong rule is expected to pass a compatibility golden; a broken writer can be invisible to it, demonstrated with three null writers (F5).
Clock/TZ pins fail closed but prove one date/zone/hour, not all supported calendars or DST transitions (F5).
Model artifact hashes do not execute a protocol implementation; even 0/10 was accepted with `pass:true` (F7).
Both T3 reports exposed adapter trust seams; test raw product boundaries and the real client–authority round trip (F4).
The executed gaps would permit bad current behavior; the census gap permits broken later ports. No assertion here proves a production incident occurred.
The fixes are independent semantic witnesses, real persistence/network boundaries, a required-family release gate and reviewer execution, not more pass-count prose.

### 3. The project manager
Agree with client-first: it made offline operations/dispositions explicit before authority integration; the suite independently permits either family (`run.cjs:44–51`).
Material correction: bring the physical-store experiment forward rather than serializing all infrastructure after M2 (F1).
Agree with independent same-brief builds; disagree with treating the ineffective tenth mutation as fully comparable evidence (F8).
Disagree with raw seams×omissions as the decisive quality measure; disclosed fixture glue and a missing trust check have different costs (F8).
ASTRA as next provisional builder is defensible; I cannot infer model favoritism or anti-Claude over-correction from documents, and do not claim a proven universal winner.
Grok retirement is reasonable workload reduction, but comparative marginal defect yield is unavailable; record the review-plan change (F9).
Claude Code as accountable integrator is reasonable; exclusive need for that model/location is unproved (F9).
Agree with extract first/audit second only with a separate defect log and audit closed before integration; do not change frozen module 1 semantics (F5).
Agree with v3.1 old=a0009c3 as a meaningful real-change probe: public old-vs-final sensitivity passed 9/9; require targeted mutants too, not ancestor distance alone.
Disagree with stale setup instructions and a final artifact process that needs manual stamp repair; consolidate versioned setup (F10 and limitations).

### 4. The owner's workload
Drop build-chat→owner→builder file transport once the brief is committed, and builder→owner→cowork report transport once the PR exists (AGENTS 3–4; pipeline 2).
Use one task-index entry and PR URL; agents retrieve exact committed reports themselves (F10).
Retain owner decisions and the manual blind-review exchange he chose; supply one sanitized packet and attach the verdict verbatim to the same PR.
Batch rulings at the real milestone gate, rather than repeating approval for already authorized reversible steps.
A quiet scheduled PR/blocker monitor could replace status chasing; it cannot replace independent review or owner decisions.
One PC remains a secret/deploy dependency; rehearse another clean machine/account path using approved credentials, without copying secrets into git (F9).
One chat remains a knowledge dependency until missing ratified files and nonsecret operating prompts are durable (F10; HANDOFF859–865).
One owner remains the only ruling authority; reduce clerical relay without delegating that authority by accident.

### 5. Staffing
Move bounded implementation, extraction, local rigs, regression reproduction and report/PR preparation to Astra, subject to the same fixed brief and frozen suite.
Keep secret provisioning, private golden custody and live releases with one accountable integrator until a replacement proves the same operating path; this is role separation, not a Claude-only capability.
Same-family builders and code reviewers can help, but their errors correlate; use a fresh cross-family adversary for spec/test validity and final risky acceptance.
Cowork's cross-family re-execution is useful, but it authored the plan/spec and is not an independent check of its own interpretation.
I am also conflicted as T3 ASTRA; send disputed scoring/staffing findings to Sol with evidence (F8–F9).
Fair M2 re-test: same base, pinned tools/fixtures, deadlines/resources, unmodified oracle, exact allowed surface, independently built branches and identical executable fault coverage.
Blind the code/evidence packet before revealing reports/scorecard; normalize reading/build/setup/review/owner time and record all agents used.
Choose based on verified behavior, integration cost and defect disclosure; compare ASTRA against its own frozen-source obligation too.

### 6. Repo hygiene
`git branch -r --no-merged origin/main` lists 17 branches; unmerged is not synonymous with abandoned. Author names are configured metadata, not reliable model identities.
Audit base has ASTRA T3 via `6b9ae8e`; Claude T3 is intentionally preserved and not its ancestor. Keep its useful suite findings (ROADMAP 45–49).
The ratified-doc branch is unmerged with a durability commit `a0d35b5`; older text/missing artifacts need a canonical index, not blind merging over newer suite inputs.
The rebuild branch intentionally remains separate from live main, but it missed the main CDN exclusion: executed manifest includes 90 rebuild files (F6).
No tracked `rebuild/conform/private/*` or generated `engines/*.cjs` were listed. `private/` was absent in this audit checkout; I never opened one.
The public owner ledger is deliberate (GOALS 9–16,88–91; HANDOFF 535–551). His consent does not authorize future athletes' data in this repo.
I found no evidence of another athlete's exposed record; this was not an exhaustive content/history or credential audit, and no secret was printed.
Frozen output/bundle checks exist; a whole-tree frozen-path exception gate and required rebuild CI job are not present in the inspected workflow (F6).
CLAUDE/AGENTS/HANDOFF/NEXT numbers and instructions drift materially; use one current index and demote dated history (F10).

## 3. Explicit disagreements with cowork

1. **Scheduling:** disagree with leaving the 30-day supported-device soak to the two-week M4; the sheet itself orders it earlier (F1).
2. **Readiness:** disagree with a milestone definition that can accept absent product families without saying which must exist for that milestone (F3).
3. **Scoring:** disagree that 9/9 effective and 10/10 constitute equivalent ten-family evidence without replacing the dead mutant (F8).
4. **Deciding metric:** disagree with raw seam counts and the doubled omission count as a sufficient quality tie-break; use risk classes and separate completeness from intent (F8).
5. **Review:** material correction to calling preregistered blind review delivered while the scorecard is published and the surviving blind review is nonblocking; document the changed agreement (F9).
6. **Operations:** disagree that a backend's private access path/backup feature establishes per-athlete privacy, recoverability or a hard budget ceiling without drills at the actual integration boundary (F2).
7. **Evidence label:** disagree with “verified gate artifacts” implying checked count consistency or product execution; the recorded Boolean can override 0/10 (F7).
I agree with the provisional ASTRA assignment, client-first contract work, frozen extraction followed by audit, and the v3.1 real-change probe; those agreements do not remove the corrections above.

## 4. Executions, limits and audit custody

- Audit tracked files were not used as test output destinations. Most gates ran in a disposable public-only copy under `work/audit-runs/repo`, with sibling pinned dependencies and Node 24.19.0. No `private/` directory was copied or opened. The direct oracle enumerates only existing fixtures, so its 7/9-law results cover exactly the two public fixtures, not the private fixture or the 99-law gate.
- Executed `node run.cjs` in that copy: 99 reference GREEN, 99 STRONG, authority 34 / soak 1 / client 35 GREEN, policy 20 / progression 9 absent RED; overall INCONSISTENT from missing engine/private prerequisites. This is not represented as full gate success. Re-ran `node rebuild/t3/verify-astra.cjs` (12/12 PASS) and `node rebuild/t3/interop-astra.cjs` (PASS). These product rigs still leave F4's unsigned-receipt witness possible.
- Public-only `oracle/port-oracle.cjs check …engine-main.cjs main main`: 7 GREEN / 0 FAIL; `sensitivity …engine-old.cjs old`: 9 GREEN / 0 FAIL. Engine artifacts were built by the parallel M2 task from fe516c1/a0009c3; I did not rebuild those bundles independently. The public golden pins remained unchanged.
- I did not run the full selftest because it creates/reads a directory named private; I honored this audit's stricter private-data instruction. Full private-fixture assertions, calendar durability, a real D1 backend/transaction bridge, phone behavior, account recovery, vendor spending controls, production telemetry and current secret rotation are not independently assessed.
- Windows strict-gate attempts first failed esbuild sandbox resolution and then scratch Git ownership. After verifying scratch `.git` was its own directory, only its own index was populated; a process-scoped safe-directory setting and `GIT_OPTIONAL_LOCKS=0` were used, with no shared ref/index/global-config writes. Final scratch `node scripts/check.mjs --strict` at its default July 29 clock/New York exited 0: 2,951 assertions, 17 sync laws / 56 seeds, bundle/baseline parity, 108 shipped files, `All checks passed. Safe to ship.` Scratch still held the F6 frozen-path comment and F7 inconsistent model-result count; the delivered branch holds neither. The parallel M2 task's private/full-suite evidence remains separate.
- **My setup error:** the copy excluded `.git` directories but accidentally copied a worktree `.git` file. A scratch setup commit briefly advanced only the audit branch to `f5709a6`; original checkout files remained unchanged. I immediately told the coordinating agent, restored my own branch ref/index to `911e3ae`, removed the scratch link, and verified the original worktree backpointer and empty diff. The attempted worktree repair was refused before mutation; no global Git setting, main, M2 branch or remote was changed. This is itself evidence for checking worktree identity before running a copied checkout. The final branch change is only this report.
- Documents were read in the brief's order. `docs/ratified` was missing on this base, so I read its preserved branch README/index and the current sheet/protocol under `gates/inputs`. The long runtime appendix was inspected by relevant contracts/cross-references, not a line-by-line re-audit of every scientific rule. The current protocol's normative clauses were read; this is a process audit, not protocol ratification.
- Git history was inspected for the last 30 days, with non-ledger commit subjects and aggregate authors; no ledger contents were printed. At the inspected refs, configured authors were Joe 372, joeymat11-rgb 207, beacon 93, nightly analyst 23, Claude 10, ASTRA 1; these do not identify who actually reasoned about a commit. Historical branches' intent is unknown except where documents record it. Remote branch protection, original owner chat rulings, reviewer verdicts and uncommitted cowork rig190/191 evidence were not available here.
- No current vendor pricing, legal/trademark status or platform promise was independently researched; the backend packet was audited as a dated decision record. No claim of legal clearance or a presently enforced provider spending cap is made.

## 5. Time

Approximately 14 minutes of this agent's wall-clock work, 21:31–21:45 UTC, including reading, probes and correcting the scratch-worktree setup. Parallel M2 work is excluded. Exact tokens and monetary cost are not exposed. Proposed closure efforts above remain estimates.
