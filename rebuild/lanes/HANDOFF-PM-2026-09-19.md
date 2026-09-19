# EARNED PM HANDOFF - 2026-09-19 (from the PM3 Fable 5.1 seat to its successor, PM4)

You are the new day-to-day PM of the Earned rebuild. The owner is Joe. He has no coding
experience, works from his iPhone, and his Windows PC runs the Claude desktop app with the
Desktop Commander tools you will use. Read this file first, then rebuild/DECISIONS.md lines
506 to 536 (the previous seat's whole run), then rebuild/lanes/HANDOFF-2026-09-17.md if it
is present (the seat before that; its sections 1, 2, 5 and 7 still apply word for word and
are repeated here in short). Everything here is on the chain branch. The account is new; the
PC, the repo, the worktrees and the helper scripts are the same.

## 1. The owner's rules (binding)
- End EVERY message to Joe with a PROGRESS footer: done · in flight (whose court) · waiting
  on him (exact action) · queued. Never ask him to paste, run, upload or coordinate from
  the phone. Never apologise for long cycles. One attached file, named for its destination,
  last in the message, if he must move one. Ask only decisions worth asking (product taste,
  spending, private data, releases, anything that lowers a guard); decide and record the
  rest. Owner rulings count only in his own words, recorded with provenance. ELI15, plain
  words, conclusion first, no wall of text. While anything is in flight: a two-line status
  every 30 minutes in the day; overnight at most every 3 hours; stay quiet when nothing
  changed. Wake yourself with send_later; the previous seat's ticks are dead.
- Process points DECISIONS:416-439 (PM runs lanes; author != reviewer != integrator; Fable
  high effort for the final review of anything on the path to his data and, since :531, for
  EVERY lane C-UI PR-READY; timebox a mechanical problem 20 minutes; one judgment, one
  dispatch, one ledger line, then end the turn). :455 sealed-file changes ride reseal
  children. :536 released screen files ship as lane C once S9 seals (section 5).
- Opus subagents may be used freely as builders and reviewers (owner ruling 2026-09-10).
  Sonnet medium only for narrow plumbing. Reviewers are told to disagree and to treat the
  author's report as a hypothesis.

## 2. Safety rules (never break)
Never print or expose the GitHub token (GH_TOKEN is read only inside script headers, never
echoed). Never delete data. Do not break the app. Keep the /ledger lockdown intact. No merge
to main, no deploy of anything but the slice, no private import/activation, no purchases,
and no history port for anyone without Joe's own words each time. Never read
rebuild/conform/private, src/history.js, ledger/, C:\Users\joeym\EarnedPort\** (the sealed
bundle, the passphrase file), %TEMP%\port-real.log, or the protected soak before 2026-10-05.
Author != reviewer != integrator. Never weaken a law, guard or test to go green. No
U+2013/U+2014 in user-facing UI copy (and none in ledger lines you author; the ledger's own
author tag "cowork (PM, EARNED — PM3 — Fable 5.1)" is the one historical exception; use your
own tag "cowork (PM, EARNED — PM4 — <model>)" only if you keep the same shape). Production
health data stays OUT of AI packs; verdict-only reporting for the private census and for
anything about his ledger. Measurement data (his weights, loads, counts) never enters a cloud
session, an AI pack, a review artifact or the ledger: when he sends a Today screenshot, read
it, record the verdict, never the numbers. Sub-agents never npm install in shared
node_modules; junctions only.

## 3. Where everything is
- Repo joeymat11-rgb/prepledger. Chain branch rebuild/t2-client-core (the tip). Ledger
  rebuild/DECISIONS.md, append-only, one LF line per event, no CR; at handoff 536 lines, tip
  6a2cc17 (verify: git show origin/rebuild/t2-client-core:rebuild/DECISIONS.md | find /c /v "").
- PM worktree: C:\Users\joeym\Documents\Codex\2026-09-04\read-rebuild-t3-brief-md-and\work\t2-client-core-pm
  (detached HEAD at the tip; ff-merge origin/rebuild/t2-client-core before every append).
- Node: C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
- Lane worktrees under %TEMP%\earned-*: earned-realshape = the S8 seal worktree (branch
  rebuild/d-p3-real-shape, private junction rebuild\conform\private present, engines copied,
  an untracked reviewer scratch folder rebuild/lanes/d/_review-probes/ that is never added,
  read or deleted); earned-s7 = the S7 seal worktree; earned-todayfix = the hotfix lane;
  earned-cui-audit = the gate audit branch; earned-todaydiag = the Today diagnosis. New
  worktrees junction node_modules (and rebuild\m3\w6\node_modules, rebuild\m3\w5\node_modules)
  from %TEMP%\earned-realshape; never npm install.
- The lane C-UI worktree of the design chat: C:\Users\joeym\Documents\prepledger-dev\work\ui-lane
  (branch rebuild/c-ui-port). Its builders may have left uncommitted files there or in
  %TEMP%; the new design chat owns finding them.
- Helpers in %TEMP%: gh-runs.cjs <sha40> (CI status per workflow), gh-wf.cjs <workflow.yml>
  <n>, gh-joblog-ctx.cjs <runId> "<regex>" <n>, gh-rerun-failed.cjs; earned-ledger-5xx.cjs
  (the append pattern: assert HEAD sha, no CR, exact line count, last-line regex, append one
  LF line, post-check count; run from the PM worktree with node); s8-ci.cmd, s8-full{1,3,4}.cmd,
  s8-prep.cmd, s8-propose.cjs (the seal chain scripts, copy their shape for S9);
  live-check-s8.cjs and live-check-hotfix.cjs (fetch the live slice and prove a change is
  deployed); hf-test.bat (a test harness shape: set MEASURED_TEST_NOW=2026-09-03 and
  TZ=America/New_York, cd to the worktree, node --test). Write scripts with the write_file
  tool; PowerShell Set-Content corrupts UTF-8. Never chain && after find /c. Long PC calls
  can time out at 60 s: run long jobs through a .cmd that writes a log and a .done file.
- Commits: git -c user.name="cowork (Earned PM)" -c user.email="joeymat11@gmail.com" commit
  -F <msgfile>; trailers Co-Authored-By: <model> <noreply@anthropic.com> and
  Claude-Session: <your session url>. Push HEAD:rebuild/t2-client-core; verify the DECISIONS
  line count on origin after every push. Never rebase a reviewed branch; merge forward.
- Slice site https://earned-slice.netlify.app auto-deploys on tip pushes touching
  rebuild/m3/w7-preview/today/**, rebuild/slice/pwa/** or slice-host.yml; for anything else,
  append a line to rebuild/slice/pwa/DEPLOYS.md with the ledger line. Joe runs it as a
  Home-Screen app; a full close and reopen picks up a new build.

## 4. State at handoff (all verified, all in the ledger)
- M2-S8-REAL-SHAPE sealed and merged (:519 was S7; S8 is :524-:529). Standing CI step
  --package S8; coach ENGINE_REVISION = M2-S8-REAL-SHAPE@3b1b8b91dd5a6ff0; parent artifact
  rebuild/m4/spec/acceptance-s8-real-shape.json sha256
  3cf58e0edd76a56353b35008ef154d484098b5017fedeb648eb64a0ae6568d48, receipt line :528, merge :529.
- THE REAL PORT IS DONE (:532, :533): Joe imported his history on his phone; his Today shows
  his own programme and the nutrition block. Nothing on the port is owed.
- P3-TODAY-HOTFIX live (:535): the deployed page hides the desktop review asides, reserves
  the status bar, keeps proposals out of the plan headline. Still owed and CARRIED to S9:
  S2 (today-app.cjs:868-870 prints marchingOrder.why alone, a clause of a four-part sentence);
  the S1 cell rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs has no CI home (its
  directory is pinned; the honest home is the rebuild.yml lane step); adapter.test.mjs:126,259
  enshrine an identity the hotfix breaks for imported state; the two p3-layout-v2 cells are
  CI-homed but undeclared (:524 N1). Also carried: N3 of :535 (child combinator in the aside
  gate; a wrapped second aside would return), browser-check.mjs stale-red at the tip (a clean
  profile boots the setup wizard), the today-17 measure journey residual (P-MEASURE (a),
  green on re-run), the passphrase input accepting only the hyphen-joined six words (lane C
  small, before anyone else imports).
- LANE C-UI (the new look): the design chat ("Earned UI reconstruction", also being replaced
  by a new chat on the new account; give it the companion handoff) is the lane lead; PM3
  integrates. Design of record ruled in Joe's words (:530): rebuild/m1/approved-2026-09-18 at
  5f4cad0a on rebuild/c-ui-port; tickets rebuild/lanes/c/ui-port/C-UI-1..8. The gate teeth
  audit (:531, rebuild/lanes/c/ui-port/GATE-TEETH-AUDIT-R1.md on rebuild/r-cui-gate-audit at
  7aede511) found four blockers; C-UI-0 GATE FIX was ruled first, owned by the lane, with
  acceptance in :531: every mutation a to j fails for the stated reason or refuses cleanly,
  statesheet compares against a committed baseline with a stated tolerance and exits nonzero,
  both gates run on Windows and Linux, a font-by-sha256 check exists, README sections 3 and 4
  and STANDARD.md say what the code does. The design chat's last report (2026-09-18 late
  evening): C-UI-0 built, R1 REJECT fixed, R2 ACCEPT, gate.py green on Linux and Windows
  (372 checks), statesheet mid-run on the PC, then commit baselines, push, PR-READY line. As
  of 23:11 ET NOTHING had been pushed by that chat since 13:15 ET (its work may be uncommitted
  in its worktree). The lane reports through rebuild/lanes/STATUS.md; the PM answers there too.
- Rulings that shape what comes next: Fable final on every C-UI PR-READY (:531 (3)); seals
  batched, not one per ticket; the owner released presentation-only files from the seal
  (:536): the closed list is fixed in S9, and after S9 tickets that touch only released paths
  ship as lane C (build, one independent review told to disagree, Fable final, CI both OS,
  the design gates green, deploy). Working rule for the list: RELEASED = renders, styles,
  binds read-only view or builds the preview page; SEALED = admits, imports, stores, replays
  or computes; a file that does both stays sealed until split.

## 5. What to do next, in order
1. Watch rebuild/lanes/STATUS.md every 30 minutes for the C-UI-0 PR-READY line (fetch; a
   NEW line, not the existing mentions). When it appears: dispatch the SECOND independent
   teeth audit, a different hand than R1, Opus high, the same ten mutations a to j from
   GATE-TEETH-AUDIT-R1.md plus the three baseline checks, report on rebuild/r-cui-gate-audit-2,
   nothing on the lane branch. Judge it against :531's acceptance. If C-UI-0 has not been
   pushed by 09:00 ET on 09-19 and the new design chat cannot find its files, dispatch C-UI-0
   into your own lane (branch rebuild/c-ui-0-gates off rebuild/c-ui-port) and record it.
2. When C-UI-1 is PR-READY and C-UI-0 is accepted: Fable final on C-UI-1 (read the runner of
   the design pins, the scene module, the fonts by sha256, and one gate run yourself), then
   S9 = M2-S9-UI-PINS (name is yours) as one dispatch: the lane B tooling round exactly as
   S8's (rebuild/lanes/b/S8-PREP-AUTHOR-REPORT.md and packages/S8.json are the template:
   b-package.cjs IDS +S9 behind S8, NO_REGISTER_IDS +S9, CHILD_ROOTS as needed, s9-supersede-*
   cells, F6/F7, runner sha re-pinned in H3/S3..S8.json, S8.json superseded-by-child, the
   rebuild.yml step named INSIDE the package before proposed()), carrying C-UI-1, S2, the S1
   cell's CI home, the adapter identity lines, the p3-layout-v2 root and children, and the
   RELEASED closed list with a runner role of its own (the runner must still refuse unlisted
   drift in every sealed file and record each released path explicitly). Brief accepted by
   name -> THEME + BRIEF-BY-SHA + GATE-SUPERSESSION token lines byte-exact from the author's
   final-lines.txt with sha verification (earned-ledger-524-527.cjs is the pattern) -> merge
   the tip into the lane -> chain A (--ci PASS, proposed() artifact, scratch PENDING review
   deleted, --full with the private junction to REVIEW-PENDING 1 open) -> receipt line on the
   tip -> review-<slug>.json ACCEPTED (write-s8-review.cjs is the pattern) -> merge tip into
   reviewed head -> chain B (authorized --full SEALED RUN RECORDED, receipts/S9.json committed
   unmodified, VERDICT-S9.md, coach constant S9@<sha16>, byte-identity --full, CI both OS) ->
   ff-merge -> ledger line + DEPLOYS.md line -> live check -> tell Joe to close and reopen.
   S8 took: prep ~2.5 h with review, chain A ~35 min, chain B ~1 h. Run chain A and B as one
   dispatch to save the turnaround.
3. After S9: tickets C-UI-2 and C-UI-4 in parallel, then 3 with 5 and 6, then 7, then 8, each
   as lane C (the P3-TODAY-HOTFIX pattern, :535): PR-READY -> Fable final -> CI both OS ->
   ff-merge -> ledger line -> deploy (auto on today/** and slice/pwa/**) -> live check. A
   ticket that touches a sealed path rides a reseal child instead.
4. Product queue behind the look: Edit My Week screens part 2 (rebuild/lanes/d2/BRIEF-EDIT-MY-WEEK.md);
   P4b coaching memory Option A; N3-MACROS-ENGINE (engine tier, science check, Fable final);
   the passphrase normalization; PWA-SPLIT before wide beta (:480). Open owner questions still
   unanswered: Q3 (Dad's training days) and Q7 (trial first vs fix D16/D30/D45). Dad's trial
   starts after Joe's two-day trial; nobody else imports until the passphrase fix lands.

## 6. Dispatch pattern that worked this seat
Workflow scripts with a COMMON block (tools, node path, cmd shell with logs in %TEMP%, the
privacy lines, the seal line: every touched path checked against acceptance-s8-real-shape.json
before the first edit and before every commit) and a TICKET block; author Opus high -> blind
Opus review told to disagree -> one fix round -> second review; the PM reads the diff itself
for the Fable final (the runner hunks and one cell against its sibling for a tooling round;
every product hunk for a hotfix), corrects comment-only findings as integrator (precedented),
carries the rest to the next round in the ledger line. Reviewers commit only their review
file. Integrator ff-merges, appends the ledger line and the DEPLOYS line in one commit,
watches gh-runs.cjs, proves the live bundle with a fetch script, then tells Joe in plain words
with the two honest limits of any fix. If the cloud side restarts mid-workflow, the PC keeps
the commits: read the lane's git log and status, then relaunch the author with a RESUME
paragraph that names what exists and forbids discarding it blindly.

## 7. First message to Joe
Confirm the seat, quote the tip sha and the ledger count you verified, say what is in flight
(C-UI-0 PR-READY watch, or the second audit if it landed) and end with the PROGRESS footer.
Ask him nothing unless a decision in section 5 needs his word.
