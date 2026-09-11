# EARNED — LANES (owner ruling 2026-09-11 "scale it") — three lead chats, one judge

Purpose: scale build capacity without adding a second judge. Every lane lead reads this file, AGENTS.md (READ FIRST block) and rebuild/DECISIONS.md lines 88–94 before doing anything. The owner is on iPhone and is never asked to paste, relay or coordinate; lanes coordinate through this folder and the ledger.

## The three lanes
| lane | lead chat | owns (exclusive files) | queue |
|---|---|---|---|
| **PM** (overarching) | "EARNED — MAIN PM — Fable 5.1" | rebuild/slice, rebuild/m3/w6/host, rebuild/m3/w7-preview, rebuild/m4/workout, rebuild/m4/spec, rebuild/QUEUE.md, rebuild/ROADMAP.md, the integration branch, the PM worktree | Track A (the slice: A0 host → A1 Today → A2 gym card → A3 check-in → A4 Dad first-run → A5 PWA shell), NATIVE-CARRIERS merge, and ALL judging/merging |
| **B — engine fixes** | "EARNED — LANE B — engine fixes" (the reviewer/research chat) | rebuild/engine/* and rebuild/conform/v4/* ONLY within an accepted package brief; rebuild/lanes/b/* | packages per rebuild/lanes/PLAN-TRACK-B-PACKAGES-v1.md: B2 ∥ B1 → B4 → B3 (each: brief → PM ledger acceptance → implementation → closed package run → receipt → authorized rerun → PM merge) |
| **C — plumbing + Dad screens + coach prep** | "EARNED — LANE C — plumbing" (new chat) | rebuild/m3/w6/* EXCEPT host/, rebuild/m3/w5/*, rebuild/m3/setup/*, rebuild/coach/*, rebuild/lanes/c/* | C1 durable local save wired to the client ops (W6 local half) → C2 Joe's port script for the PC (migrate → merge → 10/10 port-oracle; runs ONLY on the owner's PC; needs an explicit owner ask right before it runs) → C3 kill/reboot/restart proofs on the phone → then Dad first-run setup screens brief (design, owner approves by looking) → voice-coach tool contract + text-first prototype per rebuild/coach/VOICE-COACH-BRIEF.md (isolated branch; never displaces the slice) |

Ownership rule: a lane edits only its files. Anything else = write a request into rebuild/lanes/REQUESTS.md (one line: from-lane, to-lane, what, why) and continue; the owning lane answers there. Shared files (DECISIONS.md, AGENTS.md, this folder) are append-only, one commit per change, rebased on the tip first.

## Rigor (DECISIONS:88, :91)
- Engine (lane B): FULL gate — accepted brief, closed cumulative profile with the previous accepted artifact as parent, all 45 register laws (package D-ids GREEN on candidate / RED on frozen), 19 gates, second gate, own bites, fault mutants, fidelity diff, private census on the owner's PC (verdict-only reporting), receipt, authorized rerun. The PM's own FULL run is the acceptance.
- Screens/plumbing (PM lane A, lane C): ONE independent reviewer (Opus, author ≠ reviewer, told to disagree and treat the builder's reasoning as a hypothesis) + CI green both OS. No receipts, no ledger ceremony.
- Agents: each lane runs up to 2 Opus builders + 1 Opus reviewer at once; a lane lead may add builders while its merges stay clean (no conflicts, CI green, reviews passing) and must pull back when they do not (DECISIONS:91). Fable judgment stays with the PM.

## Reporting (so the owner reads ONE place: the PM chat)
- Each lane appends ONE line per event to rebuild/lanes/STATUS.md: `YYYY-MM-DD HH:MM ET · lane · <event> · <branch @ sha> · <next>`. Events: BRIEF-READY, PR-READY (with the review file path), BLOCKED (with what/who), MERGED (PM only).
- The PM reads STATUS.md at the start of every turn and folds it into its PROGRESS footer. A PR-READY line is the PM's signal to judge; nothing is merged without the PM.
- Every lane chat keeps the PROGRESS footer on every message (done · in flight + whose court · waiting on the owner · queued).

## Hard boundaries (unchanged)
No push to main, no deploy, no private data in any report or cloud session, no purchases, no protected soak read before 2026-10-05, no self-acceptance, no review chains (one reviewer, then the judge). The private live blob is read only on the owner's PC. Frozen laws are never edited to pass — write the objection in the report.

## How a lane chat starts (one paste from the owner, then nothing)
"You are the lead of LANE <B|C> for Earned. Read AGENTS.md's READ FIRST block, rebuild/lanes/LANES.md, rebuild/DECISIONS.md lines 88–94, then your lane's plan. Operate the owner's PC only in your own git worktree under work/lane-<b|c>/ (never work/t2-client-core-pm). Start your queue now; report by STATUS.md lines; keep the PROGRESS footer."

## Amendments 2026-09-10 late (owner: "start fresh at S2, then port. Let's implement 1-2" — DECISIONS:100)
- PRODUCT: the owner starts using the app FRESH at S2 (Today + gym card + check-in; new logs from day one; the frozen app keeps his history). The private port (C2/S3) lands afterwards. PM re-dates S2 as the "owner daily-use" milestone; Dad's date unchanged.
- UNATTENDED OPERATION: each lead chat schedules its own wake-ups (≈hourly; send_later / scheduled task into its own session). On every wake-up: fetch the tip, read STATUS.md + REQUESTS.md, judge what came back, dispatch the next builder/reviewer, write STATUS lines. No owner input needed overnight.
- MECHANICAL INTEGRATION (screens/plumbing tier): the acceptance bar is written in the brief BEFORE the build. When the independent reviewer's file says ACCEPT and CI is green on both OS, a mechanical integrator subagent merges into rebuild/t2-client-core with a one-line ledger entry — it does not wait for the PM's turn. The PM spot-checks merged work afterwards and may revert with a ledger line. Author ≠ reviewer ≠ integrator.
- ENGINE TIER: the LANE runs the FULL gate itself (closed package run, second gate, own bites, mutants, fidelity diff, and the private census on the owner's PC with verdict-only reporting) and hands the PM a verdict file; the PM judges the verdict and accepts as a ledger line — it no longer runs every gate personally. Acceptance stays the PM's judgment (DECISIONS:91).
- SPECULATIVE AUTHORING: a lane may implement a package on a candidate branch before its brief is accepted (parallel authoring); nothing merges before acceptance; the branch is rebased/adjusted to the accepted brief.

## Amendments 2026-09-11 evening (owner: "massively accelerate development without hindering quality" — DECISIONS:116)
- CADENCE: every lead chat wakes itself every 30 minutes while anything is in flight (was ≈hourly).
- DAD FIRST-RUN: built directly from the amended BUILD-BRIEF; the owner approves by looking at the real screens in the browser pane; no second mock.
- ENGINE REHEARSAL: a package may rehearse its closed profile against the predecessor's candidate head; after acceptance only pins move; the gate, the private census, receipts, reruns and PM acceptance are unchanged; nothing merges on a rehearsal.
- WIDTH: lane C up to 3 builders + 2 reviewers while clean; PM lane runs its polish queue as parallel briefs (today/** briefs sequenced).
- EFFORT: PM chat HIGH (max at engine acceptance) · LANE B chat MAX · LANE C chat HIGH · integrator LOW. Subagents inherit the chat's effort; the owner sets the lane chats; leads confirm by a STATUS line. Definitions: .claude/agents/earned-*.md.
