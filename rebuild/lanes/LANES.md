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
