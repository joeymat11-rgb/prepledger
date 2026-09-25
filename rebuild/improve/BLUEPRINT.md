# SELF-IMPROVEMENT-BLUEPRINT — Earned agent workforce

**For:** the Earned PM (PM4 seat)
**From:** Joe's brainstorm chat (Claude, cowork), 2026-09-25
**Owner ruling (Joe, 2026-09-25):** "Yes, write it with that default." The PM approves Level 2–3 changes on its own. Level 4 changes go to Joe as a one-line yes/no.
**Status:** PROPOSAL. Nothing here is built. Step 0 below comes first.

---

## 0. How the PM uses this file

1. **Commit it.** Put this file in the repo at `rebuild/improve/BLUEPRINT.md`, or wherever it fits the repo's conventions. Record one DECISIONS line that cites Joe's ruling above.
2. **Get it reviewed before building anything.**
   - Send the file to **Fable** and **Grok**. Each gets the same pack and does not see the other's verdict.
   - Tell both reviewers: *"Treat this blueprint as a hypothesis, not a plan. Disagree with it. Find what is over-built, what will not produce a measurable gain, and where the system could game its own score."*
   - The PM decides between their findings. Anything that changes the **Constitution (section 3)** or the **autonomy default** goes to Joe.
3. **Never let improvement work slow shipping.** Improvement work never blocks a seal, a merge or a critical-path ticket. When capacity is tight, the order of priority is: shipping, then the after-action notes (cheap), then everything else here.
4. **Tell Joe once it is running.** He gets the weekly digest (section 8) and nothing else, unless a Level 4 approval is needed.

---

## 1. Goal

Build an agent workforce that measurably gets better at building Earned over time without a model change, and that improves further each time a better model is plugged in.

"Better" means these numbers move in the right direction:

- **First-pass acceptance:** tickets accepted by the independent reviewer on the first try goes up.
- **Rework:** build-review round trips per ticket goes down.
- **Escaped defects:** problems found after a seal (by Joe, by a later ticket, or in production) go down.
- **Joe interrupts:** questions sent to Joe that turned out not to need him go down.
- **Cost per ticket:** tokens and wall-clock time stay flat or go down.

**Non-goals:**

- Training or fine-tuning models.
- Changing Earned's product rules.
- Building a general platform before Earned proves the loop works.

---

## 2. The levels and who approves what

| Level | What changes | Who approves |
|---|---|---|
| **L1: Work** | Tickets get built, reviewed and sealed | Existing process |
| **L2: Learn** | A playbook rule is added, edited or retired, based on after-action notes | **PM**, with evidence (section 5) |
| **L3: Learn to learn** | The coach changes its own method: how it finds lessons, how it tests them, and what it measures. It scores its own past proposals and edits its own instructions (`coach.md`) | **PM**, with evidence |
| **L4: Restructure** | New roles or merged roles, which model does which job, new tools or skills, changes to the review chain, raising the budget cap | **Joe:** one line, yes/no, with the PM's recommended answer and the evidence |
| **L5: Smarter model** | Not reachable by us. It is handled by the model-upgrade protocol (section 6.7) | — |

**Why this counts as recursive:** at L3 the improver is itself one of the things being improved. The coach keeps score on its own advice and changes how it coaches based on that score.

---

## 3. Constitution: locked rules the system cannot edit

Only Joe can change these, by a DECISIONS ruling. An agent that proposes changing one must label the proposal **CONSTITUTION** and send it to Joe.

1. **The referee is fixed.** The workforce may add new test cases to the scoreboard. It may not change how existing cases are graded, weaken a grader, or delete a case without Joe's ruling. This is the defence against the system gaming its own score.
2. **The author is never the reviewer.** This holds for tickets, playbook changes and coach proposals (DECISIONS:778 stands).
3. **Joe's product rulings and the design of record are out of scope.** The loop improves how the work is done, not what Earned is.
4. **Approval gates stand.** Seals, releases, private data, spending and Joe's decision rights are unchanged. The loop may not route around them.
5. **Budget cap.** Improvement work (section 7) stays under its cap. Raising the cap is an L4 decision.
6. **Everything is logged and can be undone.** No playbook or coach change is made outside git, and every change carries its reason and source.
7. **Private data stays private.** The private fixture and anything personal never goes into playbooks, scoreboard cases or reviewer packs beyond what the existing rules already allow.
8. **This constitution cannot edit itself.**

---

## 4. Components

Suggested layout, under `rebuild/improve/`:

```
improve/
  BLUEPRINT.md            this file
  CONSTITUTION.md         section 3, copied verbatim (Joe-owned)
  playbooks/<role>.md     pm, builder-engine, builder-ui, reviewer, researcher, coach
  aar/<ticket-id>.md      after-action notes
  METRICS.csv             one row per sealed ticket
  scoreboard/cases/       test cases (see 4.3)
  scoreboard/RUNS.md      score history
  proposals/<id>.md       coach proposals and their experiment results
  CHANGELOG.md            every L2–L4 change: what, why, evidence, revert pointer
  DIGEST/<date>.md        weekly note for Joe
```

### 4.1 Playbooks: the notebook

- **One file per role.** Every agent in that role reads its playbook before starting work. The PM adds the playbook to each subagent's brief.
- **Rule format:**
  - `ID`
  - `Rule`: one sentence
  - `Why`: one sentence
  - `Source`: the ticket, AAR or DECISIONS line it came from
  - `Status`: trial, kept or retired
  - `Evidence`: a link to the metrics or the scoreboard run
- **Hard size cap: 120 lines per playbook.** To add a rule to a full playbook, merge or retire another. Long notebooks rot.
- **Probation.** New rules start as `trial` and are promoted to `kept` only with evidence (section 5).

### 4.2 After-action note (AAR)

- **When:** after every sealed ticket. The reviewer or the PM writes it, never the builder.
- **Length:** 10 lines or fewer.
- **Template:** What was asked · What happened · Rework cycles and why · Anything that escaped · One candidate lesson (or "none") · Cost.
- **Metrics:** each AAR also appends one row to `METRICS.csv`.

### 4.3 Scoreboard

The scoreboard has three tiers, because re-running full builds is expensive:

- **Live metrics (always on, nearly free).** `METRICS.csv` from real tickets. This is the main signal.
- **Replay cases (cheap, run weekly).**
  - Each case is a past situation with a known right answer: a brief with a known trap, a diff with a known bug, or a plan with a known flaw.
  - The agent under test must catch it or handle it.
  - Grading uses the existing gates (`quality/gate.py`, test suites) or a fixed rubric applied by a reviewer from a different model family.
- **Full reruns (expensive, occasional).** A past ticket is rebuilt from its starting commit. Use these only before an L4 decision or after a model upgrade.

**Seed and growth:**

- Mine DECISIONS.md (~780 rulings) and the existing review files for 20–30 replay cases, weighted toward the failures that cost the most.
- **Every escaped defect or repeated finding becomes a new replay case.** This rule is permanent, so the test set grows on its own and old lessons can't be quietly lost.

### 4.4 Coach

- **What it is:** a subagent that the PM runs weekly, using a strong-judgment model (Fable by default). It is never the same instance that authored the work under review.
- **Inputs:** the week's AARs, `METRICS.csv`, the playbooks, `proposals/`, and the scoreboard history.
- **Outputs:**
  - At most **3 proposals a week**.
  - Each proposal states: level (L2, L3 or L4), change, expected effect on which metric, experiment plan, and how to undo it.
- **L3 duty (the recursive part):**
  - The coach tracks its own **hit rate**: the share of its past proposals that improved the metrics.
  - It may rewrite its own `coach.md` to improve that hit rate. Edits to `coach.md` go through the same experiment rules as everything else.
  - The PM checks the reasoning, because the coach cannot approve itself.

---

## 5. Experiment protocol: how a change earns its place

1. **Propose.** The coach writes `proposals/<id>.md` with the change and the metric it expects to move.
2. **Test cheaply first.** Run the relevant replay cases with the change and without it.
3. **Trial live.** Put the change into the playbook as `trial` for the next **5 sealed tickets** in that role.
4. **Decide.**
   - **Keep** if the target metric moved the right way and no guardrail metric (cost, escaped defects, first-pass acceptance) got worse.
   - **Retire** if the result is flat or negative.
   - **Extend the trial once** if the result is unclear.
5. **Log.** Record the outcome in `CHANGELOG.md` and in the coach's hit-rate record.

**Small-numbers honesty:** a handful of tickets is a small sample. Prefer changes that move replay cases clearly. Treat live results as a check, not proof, and never promote a rule on a single good ticket.

---

## 6. Standing routines

1. **Per ticket:** AAR plus a metrics row. This takes about 2 minutes of agent time.
2. **Weekly:** coach pass, replay run, at most 3 proposals, and the digest to Joe.
3. **Pruning (weekly):**
   - Retire rules with no evidence after two trials.
   - Merge overlapping rules.
   - Enforce the playbook size caps.
4. **Every 4 weeks:** a full retrospective against the success criteria (section 9).
5. **Tool creation:** when AARs show the same manual step 3 or more times, the coach proposes a tool or skill. That proposal is L4.
6. **Model routing:** the coach may propose moving a role to a different model or effort level, with evidence. That proposal is L4.
7. **Model-upgrade protocol:** when a new model becomes available:
   1. Run the replay scoreboard on the old model and the new one.
   2. Swap roles only where the new model wins. That swap is L4.
   3. Run **rule ablation**: try removing each playbook rule one at a time and keep the removals that don't hurt. Older workarounds often become clutter with a stronger model.

---

## 7. Budget

- **Default cap:** improvement work uses no more than **10% of total agent usage** on Earned, measured weekly. The PM reports actual usage in the digest.
- **When usage is short** (an account near its limit), this order applies:
  - pause the coach and replay runs first
  - keep AARs and metrics rows
  - keep shipping unchanged
- **Raising the cap is L4.**

---

## 8. What Joe sees

**Weekly digest:** one screen, plain language, no jargon, written for someone with no coding experience.

1. **The numbers this week vs. last:** first-pass acceptance, rework, escaped defects, Joe interrupts, cost per ticket.
2. **What the system learned:** rules kept or retired, one line each.
3. **The coach's hit rate.**
4. **Any L4 approvals needed:** one line each, with the recommended answer, answerable with "yes" or "no".
5. **PROGRESS footer:** done · in flight and whose court · waiting on Joe with the exact action · queued.

**Outside the digest, Joe hears about the loop only when:**

- an L4 or CONSTITUTION decision is needed, or
- an escaped defect traces back to a playbook rule.

---

## 9. Rollout and success criteria

- **Phase 0 (now):** Fable and Grok review this blueprint. The PM decides between their findings, and constitution changes go to Joe.
- **Phase 1 (next sealed ticket):** AARs and `METRICS.csv` start. The existing process is otherwise unchanged. This is cheap and gives the baseline.
- **Phase 2:** mine DECISIONS.md and the review files into the first playbooks (all rules start as `trial`) and 20–30 replay cases.
- **Phase 3:** weekly coach, the experiment protocol and the digest go live.
- **Phase 4:** L3 goes live (coach hit rate and `coach.md` self-edits) and the first L4 proposals reach Joe.
- **Phase 5 (Joe decides):** package the whole thing as a reusable template for his other apps (OFTEN, Day Runner, etc.).

**Success test, 6 weeks after Phase 3:**

- At least 3 of the 5 metrics in section 1 are clearly better than the Phase 1 baseline.
- None is clearly worse.
- Improvement overhead stays within budget.

**If the test fails,** shrink the system to AARs plus playbooks only and report why. Overhead that doesn't pay for itself gets cut. That cut is also a lesson, and it gets logged.

---

## 10. Known failure modes and defences

| Failure mode | Defence |
|---|---|
| Notebook grows until rules contradict each other | Size caps, probation, weekly pruning, ablation on upgrades |
| System games its own score | Constitution rule 1 (graders are fixed), cross-family reviewers, live metrics as the main signal |
| One bad lesson spreads everywhere | Every rule cites its source, changes go through trials, one-step revert via `CHANGELOG.md` |
| Coach approves its own ideas | PM approval for L2–3, Joe approval for L4, and the coach's hit rate is public in the digest |
| Improvement work eats shipping capacity | 10% cap; it never blocks a seal; it pauses first when usage is short |
| Lessons tuned to one model break on the next | Model-upgrade protocol, rule ablation, playbooks kept in plain language |
| Noise read as progress | Replay cases before live results, 5-ticket trials, no promotion on a single result |

---

## 11. Questions for the Phase 0 reviewers

1. Is anything here over-built for one app at Earned's current stage? What is the smallest version that still compounds?
2. Are the five metrics measurable from what the repo already records? If not, what is the cheapest way to capture them?
3. Can replay cases mined from DECISIONS.md be graded objectively, or will grading drift toward opinion?
4. Is 5 tickets a meaningful trial length at Earned's pace? Suggest a better rule if not.
5. Where could this loop still game itself despite the constitution?
6. Is the L2–3 / L4 approval split in the right place?
