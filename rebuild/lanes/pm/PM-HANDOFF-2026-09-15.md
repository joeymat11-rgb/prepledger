# EARNED PM HANDOFF 2026-09-15 (Claude PM seat transfer to the new account)

Written by the original Claude Cowork PM chat ("EARNED MAIN PM Fable 5.1") on Joe's words
("id like to make the new account PM as it isnt currently using credits"). Provenance: DECISIONS:414.
This file is self-contained. Read it top to bottom before touching anything. Companion files:
`rebuild/lanes/pm/CRITICAL-PATH-2026-09-15.md` (the judged plan, executed evidence, gap table),
`rebuild/lanes/astra/CLAUDE-PM-HANDOFF.md` (Astra's handoff, still accurate), `rebuild/DECISIONS.md` :412-:414,
`rebuild/lanes/astra/DELIVERY-CHECKLIST.md`, `PERSONAL-USE-DELIVERY.md`, `SCIENCE-OWNER-CHOICES.md`, `TEAM.md`.

## 0. Who you are talking to, and how

Joe. No coding experience; wants ELI15 answers. He works from an iPhone most of the day.
Rules he set for every message from the PM:
- End EVERY message with a PROGRESS footer: done · in flight (and whose court) · waiting on him (exact action) · queued.
- Never ask him to paste, run, upload or coordinate anything from the phone. Never apologise for long cycles.
- Any file he must move is ONE attached file, named for its destination, last in the message.
- He only needs to make decisions the PM judges worth asking. Everything else the PM decides and records.
- He is the owner. An OWNER RULING counts only in his own words, recorded in DECISIONS.md with provenance (chat + date).
  The PM never paraphrases a ruling into existence; "Proceed as you recommend as PM" delegates engineering routing, not owner choices.

## 1. What Earned is

Earned is the rebuild of Prep Ledger, Joe's personal N=1 training and nutrition coach. The frozen production app
(single-file React PWA, v7.56.0, `src/app.jsx`, live at fitnessledger2.netlify.app, deploys from `main` to Joe's phone)
keeps running untouched. Everything new lives under `rebuild/` on the integration branch `rebuild/t2-client-core`
in the PUBLIC repo `joeymat11-rgb/prepledger`. Never merge to `main`, never deploy production, without Joe's specific words.

Target users (DECISIONS:268, PERSONAL-USE-DELIVERY.md): Joe trains on his phone with his REAL history imported and the
approved coaching memory; then Dad on his own phone after Joe's two-day trial; a soak gates wide beta only
(earliest protected soak readback 2026-10-05, do not read before).

Tech: Node (v24 on the PC, Node 22 in CI), plain CommonJS/ESM, no framework in the rebuild. Layout:
`rebuild/engine/*.cjs` (composed coaching engine; laws; merge; today), `rebuild/m4/**` (engine packages, specs, acceptance
artifacts), `rebuild/m3/w7-preview/today/**` (Today screen, gym card, check-in, setup screens; `node --test .../test/*`),
`rebuild/m3/w6/**` (local era / one-store), `rebuild/m3/setup/port/**` (history port tooling; the real port runs ONLY on Joe's words),
`rebuild/client/**` (client primitives), `rebuild/coach/**` (coach text baseline), `rebuild/conform/**` (oracle; `private/` is gitignored
and must never be committed, pasted or read), `rebuild/lanes/**` (lane briefs, reviews, handoffs), `rebuild/DECISIONS.md` (append-only ledger).
PWA shell + slice host: `.github/workflows/slice-host.yml`, Netlify site `earned-slice` (secret recorded present 2026-09-11, REQUESTS line 30;
live run never re-verified; check the Actions run before asking Joe anything about it).

## 2. How the process works (the rules you inherit)

Roles: author != reviewer != integrator; no self-acceptance. The PM dispatches, judges, integrates, records; never builds a package it reviews.
Tiers (DECISIONS:88, :100, :413):
- screens/plumbing: written acceptance bar + ONE independent reviewer + CI green on both OS at the exact head + mechanical integrator (fast-forward or clean merge, `git commit -a`).
- engine: closed cumulative profile JSON + the lane runs FULL itself (`node rebuild/lanes/b/tooling/b-package.cjs --full --package <ID>` WITHOUT the private fixture,
  reporting `NATIVE CARRIERS PACKAGE BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` where applicable) + PM judgment + receipt.
  Receipt line format in DECISIONS.md: `POSTFIX-ACCEPTANCE <ID> <commit40> <artifact> <sha64> ACCEPTED`; review file PENDING->ACCEPTED; authorized rerun prints PACKAGE PASS.
  DECISIONS:136(3): byte-identity re-verify makes `--full` print PASS anywhere when the receipt is unchanged (not a fresh private census).
  Newest accepted engine artifact: `rebuild/m4/spec/acceptance-h3-clean-init.json` (b457b539..., receipt :187).
- Never weaken a law, guard or test to go green. Never read private folders or `src/history.js`. Production health data stays OUT of AI packs.
- `rebuild/conform/private` and `engines/*.cjs` are never committed or pasted (verdict lines only; regenerate per AGENTS §4 from `git show fe516c1:ledger/state.json`).
- No AI dashes (U+2013/U+2014) in any user-facing UI copy (DECISIONS:114). Docs and ledger lines may use them; UI strings may not.
- DECISIONS.md is append-only, LF line endings, one line per entry, dated, with author and provenance. Assert the line count before appending.
- Unattended operation (DECISIONS:100/116/119): the PM self-schedules wake-ups every 30-60 min while anything is in flight and progresses without Joe.
- Owner-gated actions (Joe's own words required, each time): merge to main / deploy / private import or activation / purchases or paid credits /
  the real history port (`rebuild/m3/setup/port`) / reading the protected soak before 2026-10-05 / anything touching `ledger/state.json`.
- Standing safety: never print or expose the GitHub token, never delete data, do not break the app, keep the `/ledger` lockdown intact.
  `GH_TOKEN` on the PC may be used only inside a script header to READ the GitHub API, never echoed.

## 3. Where the work stands (facts, verified 2026-09-15 on tip a755cd91)

Merged into `rebuild/t2-client-core` (ledger line): B0 native carriers package (:96-97), A0 host (:98), A1 Today rebind (:99),
A5 PWA shell + slice-host workflow (:101), A2 gym card (:102), CI re-seal (:104-105), Lane C c1/c2/c2b/c3 port tooling + custody (:106),
A3 recovery check-in (:107), C4 one-store (:111), A4 Dad first-run setup (:128), A4b (:149), B-NTC (:130/:131/:144),
C5 voice coach text baseline (:150), P1 no-dashes, P2, H3 clean-init (:189), launch package M 100820aa (:210, under Astra).
Executed on the tip by the scout: H3 `--ci` PUBLIC CI EVIDENCE PASS; today suites 553/553; W6 552/552; A0 23/23; coach 201/201;
PWA 55/55; builds PASS. One environmental red: `host-seams.test.mjs` fails to link under Node 22 ESM (not in CI; routing, not owner).

Scoped acceptances under Astra that are NOT merged (bytes preserved on origin under `preserve/*` and `codex/astra-*`, pushed 2026-09-15):
B1+B2 assembly 3bfed63f (not admitted), native-slot 2592f091/9cc78e77 (:408), coach correction a0e8ec38/c21e64f2 (:400),
memory lifecycle 7e64848d (:294), idle client foundation e85ad803 (:324), r4 date repair f2dea2ec, D S3 harness repair f0b01d9.
One push failed: `codex/astra-review-b1b2-r4` (ref-name lock collision on origin; the bytes are still in the PC worktree, low value).
S3 portable core: `origin/rebuild/astra-d-s3-core-r2` @ 0df6ad3f, REJECTED at R2 (:250) pending the engine seam in P1 below.

Known product defects visible on Joe's real data: D16 (month-late weigh-in graded as a 7-day forecast hit), D30 (first-set trend pooling
across a technique change), D45 (analyst wording vs writer's earn rule). None loses a fact. Also: once a phone is set up, its week cannot be
changed (Edit My Week unbuilt; second setup refused). The biggest gap: Today paints the SYNTHETIC fixture athlete, not the enrolled user (P0).

## 4. The plan (adopted, DECISIONS:414) with acceptance bars

Read `CRITICAL-PATH-2026-09-15.md` §4 for the full text. Summary, in dependency order:

P0 HIS NUMBERS (Lane C, screens/plumbing, S) FIRST. `rebuild/m3/w7-preview/today/today-entry.mjs`: in `boot()` (:209) pass
`await setup.athleteState()` (:127-131) as `basisState` (:304-306) when `setup.summary().enrolled === true`; narrow the
`SETUP_BASIS_STATE_REFUSED` guard at :274 (still refuse a FOREIGN basis); delete the stale note :291-303. Bar: (1) enrolled jsdom install with
label `Dad` and three exercises shows `athlete_label==='Dad'`, note hidden, `workout.available===true`; (2) gym card lists the athlete's own
exercise ids; (3) fresh un-enrolled install byte-unchanged; (4) foreign basis still throws; (5) weigh-in + set survive store reopen;
(6) >=553/553, A1 TODAY BUILD PASS, A5 PWA BUILD PASS, CI both OS at the head. Unblocks G2/G3/G5. Nothing about Joe's data before this merges.

In parallel with P0:
- P1 M2-S3-COMPANION (Lane B, engine, M): `createMerge(E,{clock,nativeDate=Date})` in `rebuild/engine/merge.cjs` (parse sites :76/:161/:177/:515/:565,
  constructor :177, default native so existing callers are byte-unchanged); `sessionMembership(s,iso)` extracted from `genSession` pool
  (`rebuild/engine/today.cjs:64-72`); `rebuild/m4/workout/engine-runtime.cjs` EXPOSED 4->5; parent artifact H3. Spec:
  `rebuild/lanes/d/S3-R3-CONTEXT-CAPABILITY-PROPOSAL.md`. FULL gate.
- P4a P6 reason-on-disk (custody `rebuild/client`, brief `rebuild/slice/P6-REASON-ON-DISK-BRIEF.md`, S/M).
- P5 N2 sleep admission: compose `origin/rebuild/astra-c-n2-r4` @ bfc29357 onto the tip; review only, no new build.
- P-COACH: admit the :400 delta (three files, bytes at `preserve/coach-correction-400`).
Then serially: P2 S3 import join (D+C, L; base `astra-d-s3-core-r2` + `preserve/d-s3-harness-repair`) -> P3 Joe's real port (owner-gated, Q1).
Then P4b Coaching Memory v1 minimum (E/C, L; bar M01/M02/M05/M06/M11/M12 under Option A; brief
`rebuild/lanes/e/COACHING-MEMORY-V1-IMPLEMENTATION-BRIEF.md`). P6 F1 full-body only if Dad trains 2-3 days (Q3).
Re-estimate (Opus builders at :119 cadence): Joe fully on target 2026-09-23 to 09-29 (Option A); Dad +3 days. P0 on Joe's own setup ~1-1.5 days.

PM rulings recorded at :414 (engineering routing, not owner): A1 NativeFieldDeltas admission is discharged by the PM's own verdict-only FULL
on the PC; native capture and the Windows native-slot module leave the delivery path. A2 import is proved on H3 + the S3 companion; the
port-oracle re-run happens after B3; B1+B2/B4/B3 sit behind the personal milestone (only D16/D30/D45 fire on Joe's data).

## 5. Open owner questions (ask only when they gate work; batch them)

Q1 run the port on his real ledger (ask at P3, in his words, right before). Q2 slice site live: verify the Actions run FIRST.
Q3 Dad's training days per week (free; decides P6). Q4 D40 tie-break (not on the critical path). Q5 SCIENCE-OWNER-CHOICES 1-3
(all recommended Yes; not on the critical path). Q6 memory scope Option A (recommended) or B. Q7 D16/D30/D45: recommend trial first, fix in the normal chain.

## 6. Capacity and accounts (2026-09-15)

- This original Claude PM chat: Opus subagents hit the weekly limit (resets 2026-09-17 10:00 UTC); Sonnet works. Its wake-ups are cancelled at handover.
- Astra (Codex/GPT): weekly usage exhausted, resets ~2026-09-19; role = review standby (DECISIONS:412).
- NEW Claude account (this reader): PM from DECISIONS:414. It must sign the Claude DESKTOP app into the new account on Joe's PC to get PC access
  (Desktop Commander). Until then it can plan, read the public repo, and dispatch cloud subagents, but cannot push (cloud git push and GitHub API are 403).

## 7. PC mechanics (everything that bit us)

- Node: `C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe` (v24.19.0).
- Shared repo: `C:/Users/joeym/Documents/prepledger-dev` (branch feat/progression-1 checked out there; do not work in it directly).
  PM worktree (detached, tracks the integration tip): `C:/Users/joeym/Documents/Codex/2026-09-04/read-rebuild-t3-brief-md-and/work/t2-client-core-pm`.
  Astra worktrees: `prepledger-dev/work/pm-caretaker/*`, `work/lane-d/`, `work/lane-d2/`. `TEAM.md` §Worktrees lists them.
- Run scripts as `cmd /c "node script.cjs > log 2>&1 & type log"` (PowerShell `>` re-encodes to UTF-16 and mangles dashes). Write scripts to `%TEMP%`.
- ALWAYS `git commit -a` (a plain `git commit` once dropped a ledger line). Git identity: `-c user.name="cowork (Earned PM)" -c user.email="joeymat11@gmail.com"`.
  Trailers: `Co-Authored-By: <model name> <noreply@anthropic.com>` and the session URL.
- `NODE_ENV=production` is ambient on the PC: pnpm/npm skip devDependencies unless you clear it (`--include=dev`).
- `GH_TOKEN` lacks the workflow scope: pushing `.github/workflows/**` goes through the credential manager.
- Junction `node_modules` with `cmd /c mklink /J`. `build-engines.mjs` needs an ABSOLUTE root. `.gitattributes` forces LF; keep it.
- Ledger append pattern: read file, assert no `\r`, assert exact current line count, append one line + `\n`, `git commit -a`, push, re-verify the count on origin.
- Cloud sessions: git push and GitHub API return 403 (repo not in the session's authorized set). All pushes happen from the PC.
  Cloud dry-run worktrees used so far: `/home/claude/wt-m2`, `/home/claude/wt-b0` (private fixture; not transferable).

## 8. First actions for the new PM

1. Clone the public repo, `git checkout rebuild/t2-client-core`, read this file, DECISIONS:412-:414, `CRITICAL-PATH-2026-09-15.md`, `CLAUDE-PM-HANDOFF.md`.
2. Confirm the Claude desktop app on Joe's PC is signed into the new account (Joe does this once; it is the only thing he must do).
3. Append your own resumption receipt as DECISIONS:415 (author = your chat name, provenance = Joe's words in this handoff).
4. Dispatch P0 (builder + independent reviewer) and P1 in parallel; schedule wake-ups; keep the PROGRESS footer.
5. Verify the slice-host Actions run before mentioning Q2 to Joe. Batch Q3/Q6 into one message when P4b is about to start.
