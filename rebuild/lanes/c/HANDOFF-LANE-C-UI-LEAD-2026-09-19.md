# EARNED LANE C-UI LEAD HANDOFF - 2026-09-19 (from the "Earned UI reconstruction" chat to its successor)

You are the new lead of lane C-UI, the port of the approved visual design into the Earned
client. The owner is Joe (no coding experience, on his iPhone; his Windows PC runs the Claude
desktop app with Desktop Commander, which you use for everything). The PM of the rebuild is a
separate chat, PM4 (it replaces PM3 today). You build and review; the PM judges, integrates and
seals. Read this file, then rebuild/m1/approved-2026-09-18/README.md in full, then
rebuild/lanes/c/ui-port/README.md and the tickets, then rebuild/DECISIONS.md lines 530, 531,
534, 535 and 536, then rebuild/lanes/c/ui-port/GATE-TEETH-AUDIT-R1.md (on branch
rebuild/r-cui-gate-audit). Everything is in the repo joeymat11-rgb/prepledger.

## 1. The owner's rules (binding)
End EVERY message to Joe with a PROGRESS footer: done · in flight (whose court) · waiting on
him (exact action) · queued. Plain words, ELI15, conclusion first. Never ask him to paste,
run or coordinate from the phone. Never apologise for long cycles. Ask him only product-taste
decisions the design pack's section 6 says a builder may hit; everything else you decide and
record. No U+2013/U+2014 anywhere in UI copy or in files you write (the gate refuses them).

## 2. Safety rules (never break)
Never print or expose the GitHub token. Never delete data. Never read rebuild/conform/private,
src/history.js, ledger/, anything under C:\Users\joeym\EarnedPort\, %TEMP%\port-real.log, or
any path containing "soak". Never npm install into shared node_modules (junction from
%TEMP%\earned-realshape\node_modules). Never touch rebuild/engine, rebuild/coach,
rebuild/DECISIONS.md, or any SEALED path (section 5). Never merge to the tip, never rebase a
reviewed branch, never deploy; the only thing you may push to rebuild/t2-client-core is a
docs-only line appended to rebuild/lanes/STATUS.md (precedent 12319d1). Author != reviewer:
one independent Opus reviewer per ticket, told to disagree and to treat the author's report
as a hypothesis; a REJECT gets one fix round and a second review by the same reviewer.

## 3. Where your lane lives
- Lane branch rebuild/c-ui-port, worktree C:\Users\joeym\Documents\prepledger-dev\work\ui-lane
  (base 4cab65b; the tip has moved on to 6a2cc17 and will keep moving; merge the tip forward
  into your lane when a ticket needs it, never rebase after a review).
- The design of record: rebuild/m1/approved-2026-09-18/ (boards, prototype of six views,
  quality/gate.py, quality/statesheet.py, quality/STANDARD.md, states/STATE-INVENTORY-DRAFT.md).
- Tickets: rebuild/lanes/c/ui-port/C-UI-1.md to C-UI-8.md (each has WHY, DESIGN OF RECORD,
  MAY CHANGE, LOCKED, ACCEPTANCE, SEQUENCING). C-UI-0 (the gate fix) was ruled by the PM at
  DECISIONS:531 and has no ticket file yet: write rebuild/lanes/c/ui-port/C-UI-0.md first,
  acceptance copied from :531.
- Reporting: one line per event appended to rebuild/lanes/STATUS.md (format: date time ET ·
  lane C-UI (you) · EVENT · branch @ sha · what · next). The PM reads it every 30 minutes and
  answers there. A ticket is handed over with a PR-READY line naming the branch, the commit,
  the review file and verdict, the suite counts and the gate results.
- Node: C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe.
  Python is on the PC (the previous chat ran gate.py there). Long PC calls can time out at
  60 s: run long jobs through a .cmd that writes a log and a .done file under %TEMP%.
- Commits: git -c user.name="cowork (Earned PM)" -c user.email="joeymat11@gmail.com" commit
  -F <msgfile>; trailers Co-Authored-By: <model> <noreply@anthropic.com> and
  Claude-Session: <your session url>. Push only your lane branches.

## 4. State at handoff and your first job
- The previous design chat reported, late on 2026-09-18: C-UI-0 built, review R1 REJECT with
  four blockers all fixed, review R2 ACCEPT, gate.py green on Linux and Windows (0 fail, 372
  checks), statesheet (418 screens) mid-run on the PC, next steps "commit the Windows
  baselines, push, PR-READY line". As of 23:11 ET NOTHING from that chat had been pushed since
  13:15 ET and its lane worktree was clean, so its C-UI-0 work is either uncommitted on disk
  somewhere on the PC or was lost. FIRST JOB: find it. Look in the ui-lane worktree (git status,
  git stash list, git log --all --since=2026-09-18 for c-ui or gate commits), in
  git worktree list for any worktree the previous chat added, and under %TEMP% for folders
  newer than 2026-09-18 13:00 that contain gate.py or a C-UI-0 file. If you find committed
  work, verify it against :531's acceptance and hand it over; if you find only files, review
  them as a reviewer would and commit what stands; if you find nothing, build C-UI-0 again
  from GATE-TEETH-AUDIT-R1.md (it lists every hole with file:line and the ten mutations that
  must fail). Tell Joe which of the three it was, plainly.
- C-UI-0 acceptance (DECISIONS:531): every mutation a to j in the audit FAILS for the stated
  reason or refuses cleanly (no crash, no vacuous pass); statesheet compares each state
  against a committed baseline with a stated tolerance and exits nonzero on a miss; both gates
  run on Windows and Linux (no hardcoded font path); a font-by-sha256 check exists; README
  sections 3 and 4 and STANDARD.md say exactly what the code does. The PM then runs a SECOND
  independent teeth audit before C-UI-1 can seal.
- C-UI-1 (pins, fonts, scene, review hooks) was partly built by the previous chat before the
  gate ruling; the same search applies. It is sealed by the PM as S9 (a lane B reseal child),
  so it must move only the files its MAY CHANGE line names.
- Carry-overs the PM ruled that bind your tickets: C-UI-2 must NOT carry move.title or
  marchingOrder.why into greeting or status-line (DECISIONS:534 (c), :535); the state
  inventory needs a greeting row before C-UI-2's verbatim-copy lock can hold; BRIEF-RIR-DISPLAY's
  locks stand (five RIR choices 0/1/2/3+/Unsure, what logSet stores); the deployed page now
  carries body[data-earned-app] and viewport-fit=cover from the hotfix (:535), and
  rebuild/slice/pwa/preflight.css hides A1's review asides on the phone; C-UI-8 inherits both.

## 5. Sealed and released paths (DECISIONS:536)
The owner released presentation-only files from the seal. Until S9 seals, C-UI-1 goes through
the PM's seal and nothing else on the sealed list may move in your lane. After S9, tickets
that touch only RELEASED paths ship as lane C: your build and review, the PM's Fable final,
CI green both OS, both gates green, deploy. Working rule: RELEASED = files that render, style,
bind read-only view or build the preview page (rebuild/m3/w7-preview/today/today-app.cjs,
screens.template.html, preview.css, build.mjs, design.cjs, browser-check.mjs, today-model.cjs
and the rendering-only today test cells; rebuild/slice/pwa/** is already unpinned). SEALED,
never yours: rebuild/engine/**, rebuild/coach/**, rebuild/m3/w6/local/** (source-admission,
today-bindings), rebuild/m3/w7-preview/import/**, rebuild/m3/w7-preview/today/local-source-basis.mjs,
rebuild/m4/**, workout-host.mjs, anything that calls logSet or writes state. The exact closed
list is fixed in S9's spec; until then, ask the PM through STATUS.md if a ticket needs a file
not named above. The pinned inventory to check a path against today is
rebuild/m4/spec/acceptance-s8-real-shape.json (findstr the path; a hit means sealed).

## 6. How to run a ticket (the rigor the screens tier requires)
Red first: write the failing gate or cell, run it red, fix, run green. One Opus builder per
ticket; independent tickets in parallel once C-UI-1 is in (2 with 4, then 3 with 5 and 6;
the Opus budget covers it). One independent Opus reviewer told to disagree, who re-runs the
gates and the suites itself and writes rebuild/lanes/c/ui-port/<TICKET>-REVIEW-R<n>.md.
CI green both OS on the branch. Both gates green with EARNED_APP pointed at the preview
build. Then the PR-READY line. Never weaken a test or a gate to go green; if a gate is
wrong, that is a C-UI-0 follow-up with its own review. Timebox any single mechanical problem
to 20 minutes, record what it printed, move on.

## 7. First message to Joe
Confirm the seat, say what you found of C-UI-0 (committed, files only, or nothing) and what
you are doing about it, and end with the PROGRESS footer. Ask him nothing.
