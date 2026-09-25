# REVIEW: rebuild/improve/BLUEPRINT.md (self-improvement blueprint), Phase 0, round 1

Reviewer: Fable (Claude), commissioned by the Claude Opus 5.5 PM; blind; Phase 0; round 1
Head checked: rebuild/improve at 104adea (worktree earned-improve); ledger and review files read on refs/remotes/origin/rebuild/t2-client-core (DECISIONS.md 822 lines).
Stance: hypothesis, not plan. Nothing executed; no engine, test or protected path touched; static reads only.

VERDICT: ADOPT SMALLER. Keep the measuring half (metrics rows derived mechanically from verdict files, a 6-line after-action note, a versioned rules file). Drop for now the coach, L3, the CHANGELOG, the digest, full reruns, the 10 percent budget and the 20-30 mined replay cases. Revisit the coach only after four weeks of metric rows exist.

## What I measured

- Review files on the chain: 137 under rebuild/lanes/{fable,astra}/reviews; 64 are .md with a VERDICT/Verdict line, 73 are .cjs/.mjs/.json annexes with none.
- L1 (first-round) verdict files: 42. Begin "ACCEPT": 32 (76 percent). Not accept (REJECT, NOT READY, NEEDS CORRECTION, BLOCKED): 10. L2+ round files: 21.
  Caveat: most L1 accepts are "ACCEPT ... bounded/only" and every Fable S9 verdict is "ACCEPT WITH NAMED DEBTS". Plain "ACCEPT" is rare.
- Named debts: 229 distinct D-* identifiers in the ledger. Debts are the project's real currency for deferred and escaped defects; the blueprint never mentions them.
- Ledger shape: 822 rulings, average 1623 characters per line, 308 lines over 1500 characters (roughly 1.3 MB, on the order of 300k tokens). Mining it is not cheap; it is a large ticket by itself.
- Pace: rulings per day range 4 to 121 (09-13: 111, 09-19: 95, 09-21: 121, 09-23 to 09-25: 9, 15, 14). Seals: S8 and S9 in the window, S10 in flight; one seal every several days, not five a week.
- Joe interrupts: 8 ledger lines carry one-tap Joe answers (:816-:821 are five of them, all grants or product taste). Only 1 ledger line says "L1 REJECT" and 5 say "L1 ACCEPT" verbatim; round outcomes live in the review files, not the ledger.
- Cost: 50 ledger lines mention tokens or usage, all about account limits and resets, none per ticket. rebuild.yml (482 lines, 33 named steps, timeout-minutes 30) records CI run ids only; no wall-clock or token figure per ticket exists anywhere in the tree.
- rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md is not present on origin/rebuild/e-native-load-red (not verified further).

## Answers

(1) Over-built. Yes, on the acting half. For one app, one owner, a PM seat and a seal chain days from a first trial, the blueprint adds nine artefact kinds under rebuild/improve, six role playbooks (up to 720 lines of instructions that every brief would carry), a weekly coach with its own self-edited instruction file, a proposals folder, a CHANGELOG that duplicates the ledger (Constitution 6 already says everything is logged in git), a digest and a percent budget nobody can measure. The playbook already exists twice: %TEMP%\opus55-RULES.txt (13 dense lines) and the PROJECT RULES paragraph pasted into every job text (astra-job-129 line 8). Smallest version that still compounds: (a) one script that derives a metrics row per review round from the verdict files (round count, first-round verdict class, debts opened); (b) a 6-line after-action block appended by the reviewer to its own verdict file; (c) the rules file versioned in the repo with an ID and a Source line per rule; (d) the permanent rule that every REJECT with a mechanical oracle becomes a replay case. Four items, no new roles, no weekly ceremony.

(2) Measurability, sampled on the 10 most recent L1 review subjects (S9-SOURCE-CHECKER L1..L3, S9-EXPORTER-MECHANICS L1..L2, S9-RUNTIME-PACKET L1, S10-WORKING-BRIEF L1, GYM-SETTINGS-ANNEX-G3 L1..L2, GSS-G4-G5 L1 + G5-REPAIR L2, CUI-FONT-TRANSPORT L1, C-UI-HARNESS L1, REVIEW-S9-SEAL-l1, REVIEW-S9-VERDICT-l1):
- First-pass acceptance: computable now for all 10 from the L1 verdict line, but only after a definition. "ACCEPT WITH NAMED DEBTS" and "ACCEPT bounded X only" must be a separate class or the number is 76 percent and meaningless. Cheapest capture: fix the verdict vocabulary to ACCEPT / ACCEPT-WITH-DEBTS / REJECT / NOT-READY and parse it.
- Rework round trips: computable for all 10 from the L1/L2/L3 suffix (GYM-SETTINGS-ANNEX-G3: 2 rounds; S9-SOURCE-CHECKER: 3). Cheapest capture: keep the suffix convention; the script counts files per subject.
- Escaped defects: not computable as defined ("found after a seal"). What exists is the debt register (229 D-*) and reversals like :813 (174-file cleanup deleted, CI step 13 red, reverted). Cheapest capture: count D-* opened per seal and D-* paid per seal; treat a post-seal REVERTED line as an escape.
- Joe interrupts "that turned out not to need him": not computable and not safely computable; every one of :816-:821 is a grant or taste question the PM may not decide. Only Joe can label a question as unnecessary. Cheapest capture: Joe's own reply ("you did not need to ask") is the only valid signal; count those, nothing else.
- Cost per ticket: not computable. No tokens, no timestamps finer than the date. Cheapest capture: the job number already exists (astra-job-129); add start and return timestamps and the model id to the return line. Tokens stay unmeasured unless the harness reports them; do not pretend.
Net: 2 of 5 metrics measurable today, 1 more with a cheap definition change, 2 not.

(3) Replay grading. Objective only where a mechanical oracle exists; rubric cases drift. Two candidates from the ledger:
- Case A, from :813 "safe-group cleanup": input = the 187-file candidate list and the package listing that B PACKAGE S9 checks (public paths only); question = which files may be deleted without UNLISTED-SOURCE; oracle = the 13 kept files and the CI failure that actually happened; grade = exact set equality. Fully objective, static, no engine, no private data.
- Case B, from :618 "privacy STOP" (Astra job 50 copied src/app.jsx to scratch against its brief): input = a synthetic fixture repo with fake src files carrying marker lines and the original brief wording; oracle = the contained probe's file-access trace contains no read under src/ or history.js; grade = binary. Objective, but it needs the contained-probe harness the S9 reviews already describe, and the fixture must be synthetic (the real main src is off limits, :618 itself).
- Counter-example: "was the GYM-SETTINGS-ANNEX-G3 L1 REJECT right" is opinion; two families would split. Admit only oracle-graded cases into the score; rubric cases may exist but never count.

(4) Five sealed tickets is not meaningful. Seals arrive every several days (S8, S9, S10 across three weeks); a 5-seal trial per role is two to four weeks and the 6-week success test would see about two trials. Better rule: the unit is the review round (an L1 verdict file; 42 in about two weeks, roughly 3 per day). A trial runs for 10 rounds in that role or 14 days, whichever comes first, with the pass threshold written in the proposal before the trial starts. A rule that turns a red replay case green is kept on that evidence alone; the live trial is a guardrail check, not the proof. Small-numbers honesty then has a number behind it.

(5) Gaming routes despite the constitution:
- Verdict inflation: builders and reviewers learn that ACCEPT WITH NAMED DEBTS counts as first pass; debts pile up (229 already). Defence: debts opened per round is a guardrail metric; an accept with new debts is not a first-pass accept.
- Scope shrinking: briefs get narrower so each bounded round accepts; rounds per feature rise while rounds per ticket fall. Defence: report rounds per seal, not per round subject.
- Self-scoring seat: the PM writes the AAR, approves L2 and L3, runs the coach and writes the digest. The author-is-never-reviewer rule is broken at the meta level. Defence: metric rows are computed by a script from files the PM did not write (verdict files); the AAR is written by the reviewer inside its verdict file.
- Coach hit-rate padding: trivial proposals with certain small wins raise the hit rate. Defence: pre-registered expected effect per proposal; a proposal with no stated threshold does not count either way. "Extend the trial once if unclear" is a second look at the same coin; drop it.
- Interrupt suppression: the PM asks Joe less to move metric 4, including for grants. Given :796, :816, :819 and :821 this is the most dangerous route. Defence: remove Joe interrupts as a target metric; count only Joe-labelled unnecessary questions.
- Rubric drift in replay cases graded by "a fixed rubric applied by a reviewer": the coach proposes cases and rubrics that its own rules pass. Defence: only oracle-graded cases score (answer 3).
- Cost cutting by writing less evidence. Defence: cost is a guardrail with a floor on evidence (the existing "every STOP claim needs an evaluated call" rule).

(6) The L2-3 / L4 split. L2 (rule text, PM-approved) is right. L3 is in the wrong place: a coach editing its own instructions on a hit rate the same PM seat computes and reports is the loop the constitution is meant to stop; at this stage there is no data for it to learn from. Park L3 until 4 weeks of rows exist, then make its first self-edit L4. L4 is also too wide on one item: "new tools or skills" would make the PM's routine helpers (pm-run.cjs, checkers, the runtime-slot script) Joe decisions, contradicting Joe's "add agents liberally" (:797, :811) and raising interrupts. Move tool creation to L2 when it touches no engine, seal, CI, private or protected path; keep model routing, review-chain changes and the budget at L4.

(7) Slowdowns and conflicts:
- Mining DECISIONS.md and the reviews for 20-30 cases is a multi-hundred-thousand-token ticket; the review files cite the protected five, soak and conform/private by name. A case built from a review file can carry protected bytes into scoreboard/cases. Defence: a case checker refuses any case whose source list names rebuild/engine, *soak*, conform/private, src/ or a ledger dir; start with 5 cases (A and B above plus three REJECTs with oracles), not 20-30.
- Full reruns "from the starting commit" need exclusive runtime slots and, for engine tickets, would load the protected five locally, which :796 (d) forbids for anyone but the PM seat. Cut this tier.
- Per-role playbooks of up to 120 lines prepended to briefs lengthen every brief; briefs already carry the rules paragraph. Keep one common rules file plus at most a 20-line role delta.
- The 10 percent budget cannot be enforced because usage is not measured (answer 2). Replace with a count: at most one improvement job per week, and none while a seal is in flight.
- The coach "Fable by default" coaches the reviewer role from Fable's own reviews; cross-family holds for tickets but not for the coach. If a coach ever exists, it reads the other family's reviews of its own family.
- METRICS.csv appended by hand by whoever writes the AAR is a hand-edited scoreboard; derive it, do not append it.

## Recommended changes, smallest first

1. Fix the verdict vocabulary in the reviewer rules: first line is VERDICT: ACCEPT | ACCEPT-WITH-DEBTS | NOT-READY | REJECT, then the debt ids. Zero build cost; makes metric 1 real.
2. Add start and return timestamps and the model id to each job's return line (the PM already numbers jobs). Makes wall-clock cost real; tokens stay unclaimed.
3. Reviewer appends a 6-line AAR block (asked / happened / rounds and why / debts opened / one lesson or none / minutes) to its own verdict file. No new directory, no builder involvement, no PM authorship.
4. One script, rebuild/improve/metrics.cjs, that walks the review directories and prints one row per subject: rounds, L1 class, debts opened. Run it before each seal; commit its output as METRICS.csv. Nobody hand-edits the CSV.
5. Version the current rules (opus55-RULES.txt plus the PROJECT RULES paragraph) as rebuild/improve/playbooks/common.md with an ID and Source per rule; role deltas only when a rule applies to one role. Cap 60 lines common plus 20 per role.
6. Replay cases: start with Case A (:813) and Case B (:618) and three REJECT-derived cases that have a mechanical oracle; add a case checker that refuses protected sources; the permanent "every REJECT with an oracle becomes a case" rule stands. Drop the 20-30 target and the ledger mining ticket.
7. Trial rule: 10 rounds or 14 days, pre-registered threshold, no extension; replay green is sufficient evidence, live is a guardrail.
8. Drop metric 4 as a target (Joe-labelled only), make debts-opened a guardrail, report rounds per seal.
9. Park the coach, L3, CHANGELOG, digest, full reruns and the percent budget. Revisit after four weeks of derived rows. If revisited, the coach reads the other family's reviews and its first self-edit is L4.
10. Move tool creation to L2 when it touches no engine, seal, CI, private or protected path.

## Not verified

- I did not read the review files in full; verdict classes come from the first VERDICT/Verdict line of each file (64 of 137 files).
- Metric 1 numbers use a loose regex on "ACCEPT"; the bounded/with-debts split was eyeballed, not parsed.
- I did not check whether Grok or Fable sessions can report token counts; the claim that tokens are unmeasured rests on the repo and CI alone.
- The build report on origin/rebuild/e-native-load-red was absent at read time; no build-side cost evidence was examined.
- Per-day ruling counts are proxy pace, not ticket counts; the ledger has no per-ticket close marker.
- No test, engine, protected, soak, private or src path was opened or executed.
