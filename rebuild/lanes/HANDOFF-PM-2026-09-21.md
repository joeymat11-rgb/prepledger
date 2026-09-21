# EARNED PM HANDOFF - 2026-09-21 (from the PM4 Fable 5.1 seat to its successor, PM5)

You are the new day-to-day PM of the Earned rebuild. The owner is Joe. He has no coding
experience, works from his iPhone, and his Windows PC runs the Claude desktop app with the
Desktop Commander tools you will use (always shell "cmd"). Read this file first, then
rebuild/DECISIONS.md lines 613 to the end (one line at a time: they are long), then
rebuild/lanes/HANDOFF-PM-2026-09-19.md sections 1, 2 and 3, which still apply and are
repeated here in short. The ledger, not any chat, is the project's memory. THERE IS NEVER A
SECOND PM (DECISIONS:613 point 1): PM4 stops writing the ledger when your seat line stands
on the chain. Your first ledger line records the seat.

## 1. The owner's rules (binding)
- End EVERY message to Joe with a PROGRESS footer: done, in flight (whose court), waiting
  on him (the exact action), queued. Conclusion first, plain words (ELI15), no wall of text.
  Never ask him to paste, run, upload or coordinate from the phone. Never apologise for long
  cycles. Ask only decisions worth asking (product taste, spending, private data, releases,
  anything that lowers a guard); decide and record the rest.
- OWNER RULINGS COUNT ONLY IN HIS OWN WORDS, recorded VERBATIM with provenance (see :631 and
  :634 for the shape: the questions exactly as put to him, then his whole message).
- Every status carries Astra's gauge number (:593 point 4) and the line RESULTS WAITING ON
  THE PM RIGHT NOW: N (:613 L-6). A time in a status or a ledger line is READ OFF THE PC
  CLOCK (echo NOW %DATE% %TIME%) or off a commit; your own estimates run ahead (:620, :634).
- Process: author != reviewer != integrator. The PM integrates and does the Fable final of
  anything on the path to his data and of every lane C-UI PR-READY, reading EVERY product
  hunk (:439). Review loops run WITHOUT the PM round by round until ACCEPT, a finding
  disputed with a measurement, or round 3; the PM judges ONCE at the end, reading every
  review whole (:613). One judgment, one dispatch, one ledger line. Timebox a mechanical
  problem to 20 minutes. Reviewers are told to disagree.
- Hands: at most FIVE Claude hands, S9 path first; a loop counts as one (:575). ASTRA (Codex
  on the PC) is the independent reviewer, reviews when Claude is throttled, and may build
  already-specified jobs OFF the sealed path, always checked by a Claude hand (:569 verbatim;
  HIGH by default, MAX only for engine-tier or his-data-path work; cap 50 percent of her
  week per day, :571; "Ensure we are leveraging Astra", :589; anything specified, off the
  sealed path and not started goes to her as a build, :593 point 2).
- SPENDING (:633, :634): the Claude account hit its WEEKLY limit on 2026-09-19 about 18:15 ET
  (resets 2026-09-25 09:00 ET); extra usage is on, so Claude work costs him money until then.
  His word, verbatim: "Continue; ensure reasonable efficiency whilst not compromising quality
  or speed." So: operator steps on the smaller model, batched commands, sparse self-wakes
  (2 to 3 hours; a returning loop wakes you anyway), Astra for everything she may do.
- Queue order, by his word (:578 as amended by :631): 1 the S9 seal and the look; 2 THE
  PHONE EARNS WEIGHTS, before his trial's day one; 3 the split and Edit My Week; 4 N3
  macros; 5 RE-PLAN GAP (time away, then equipment, then pain; never medical advice);
  6 P4b-2. An engine byte needs his own word each time.

## 2. Safety rules (never break)
The whole of section 2 of HANDOFF-PM-2026-09-19.md stands word for word: never print or
expose the GitHub token; never delete data; do not break the app; keep the /ledger lockdown;
no merge to main, no deploy of anything but the slice, no private import or activation, no
purchases and no history port for anyone without Joe's own words EACH TIME; never read
rebuild/conform/private, src/history.js, ledger/, C:\Users\joeym\EarnedPort\**,
%TEMP%\port-real.log, or the protected soak before 2026-10-05; never weaken a law, guard or
test to go green; no U+2013 and no U+2014 in user-facing copy or in ledger lines you author;
his measurements never enter a cloud session, an AI pack, a review artifact or the ledger
(verdicts only); sub-agents never npm install (junctions only).
ADDED BY PM4 (:618): on the branch main, ANY file under src is NEVER-READ for every hand,
Claude or Astra (src/app.jsx embeds dated records), and so is the built bundle app.js and
main's ledger directory. Only PM mechanical probes that run IN MEMORY on the PC and print
short code-shaped lines with EVERY DIGIT MASKED may touch it (pm4-liveprobe*.cjs,
pm4-livepatch-dry.cjs in %TEMP% are the models). %TEMP%\astra-job-50.jsonl and Codex's own
session file of that job may hold such lines: never opened, published, staged or deleted.

## 3. Where everything is
- Repo joeymat11-rgb/prepledger (public). Chain branch rebuild/t2-client-core. Ledger
  rebuild/DECISIONS.md, append-only, one LF line per event. PM worktree:
  C:\Users\joeym\Documents\Codex\2026-09-04\read-rebuild-t3-brief-md-and\work\t2-client-core-pm
  Node: C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
- THE AIRLOCK: C:\Users\joeym\Documents\EarnedAirlock (a connected folder). Cloud to PC:
  write under /mnt/user-data/outputs/pm4-airlock/<FRESH NAME>, device_commit_files to the
  airlock under a FRESH NAME (never overwrite either side), then copy into %TEMP% and compare
  sha256 (certutil -hashfile). PC to cloud: copy to the airlock, device_stage_files, compare.
- LEDGER TOOL (in the kit): mkledger.py <bodies.json> <first line no> <regex the previous
  last line begins with> <HH:MM> <out.cjs>. bodies.json = {"B":{"<n>":body},"V":{"<n>":verbs},
  "S":""}. BODY ASCII ONLY. IT HARDCODES THE DATE: copy it and replace the date (mkledger21.py
  is 2026-09-21). S is an optional STATUS.md line for lane C-UI, at most 400 code points.
  Then on the PC: copy both files into %TEMP% as earned-ledger-<N>.cjs and earned-msg-<N>.txt,
  node --check, call pm4-append.cmd <N> (fetch, ff, append, commit as "cowork (Earned PM)",
  push, print the tip and the line count). Commit trailers: Co-Authored-By: <your model>
  <noreply@anthropic.com> and Claude-Session: <your session url>. Use your own author tag
  only if mkledger's TAG is changed to the same shape with PM5.
- cmd TRAPS: never chain further commands after an if/else or a for body on one line; a PC
  call times out near 60 s, so long jobs run detached (start "" /b cmd /c call x.cmd) and
  write a .done file.
- ASTRA TOOLS, all in %TEMP% on the PC: pm4-mkjob.cjs <N> <template> KEY=VALUE... (fills
  {{RULES}} from astra-rules.txt; refuses a reused number, an unfilled placeholder,
  non-ASCII, and the WORDS hole, bypass, forge, traversal, attack, exploit, payload,
  malicious; never put double braces in a template except placeholders);
  pm4-astra-wt.cmd <N> <origin branch> <new local branch> (worktree %TEMP%\earned-astra-<N>);
  astra-run.cmd <N> earned-astra-<N> <high|xhigh> appserver (writes astra-job-<N>.log and
  .done); astra-publish.cmd <folder> <branch> <one file> <FULL PATH msgfile> (one changed
  path only); node astra-publish-build.cjs <folder> <branch> <msgfile> <owned paths...>;
  pm4-lf.cjs <file> (CR, dashes, lines, sha256); astra-usage.cjs (the gauge; prints UNKNOWN
  until she has run that day); astra-tail.cjs, astra-err.cjs; pm4-mk-lane.cmd <folder>
  <branch> <base ref> yes (a junctioned lane worktree under %TEMP%); pm4-cell.cmd;
  pm4-ci.cjs <branch> <n, use 6 or more> and pm4-ci-jobs.cjs <run id> (public API, no
  token). Templates astra-tpl-*.txt. JOB NUMBERS USED THROUGH 96; 88 to 90 belong to the
  engine repair loop, 93 to 95 to the split's fix round. READ EVERY ASTRA FILE WHOLE BEFORE
  PUBLISHING IT.
- HOSTED CI (:627, :563): each pushed head runs three workflows (pipeline, shared-preflight,
  rebuild). On ANY branch that is not on the chain tip the standing step 13 of rebuild
  refuses SEAL-BASE-IS-NOT-THE-CHAIN-TIP and later unconditioned steps are skipped, by
  design. A CI sentence names the rebuild run id and its conclusion or is not written.
  The merge-forward for both-OS evidence is the INTEGRATOR'S act at acceptance (:563, :565).
- THE CLOUD KIT: PM4's cloud-side tools are ONE archive on the PC:
  C:\Users\joeym\Documents\EarnedAirlock\pm4-kit-2026-09-21-b.tgz (sha256
  8ef0f37a8169ec25daaa6df179e8011433575d99d78c249220122139972f8922; no credential inside).
  Stage it, untar it. It holds: farm/ (FARM.md and bin/: farm-sync.sh <branches>,
  farm-scratch.sh <name> <ref>, farm-verify.sh, farm-bar.sh; tools-census/package.json for
  the dev parser), scratch/wf/ (loops/loopgen.py: gen_ca = Claude author with Astra reviewer,
  options write_step and force_first_author; gen_ac = Astra builder with Claude checker;
  every mk_*.py loop config of this seat; wfcheck.sh), scratch/ledger/, scratch/tpl/ (the
  builders of every job text written since 09-19). THE READING ROOM must be rebuilt in your
  container at /home/claude/farm: a partial clone of the public repo that holds ONLY
  rebuild/, .github/ and the root package files (FARM.md says how; farm-verify must print
  PASS after every sync; a FAIL is always real). Always cd /home/claude before other work
  so the shell never sits in a farm worktree. The port cannot seal there (its oracle is
  outside the include list): cells that seal run on the PC only.
- LOOPS: Workflow({scriptPath}) runs one in the background; a dead loop resumes with
  resumeFromRunId and replays completed steps only if prompt and options are byte-identical.
  From :634 the operator (Astra) steps run on model sonnet; authors and checkers on opus.
- WAKE: scheduled task trig_011381VJh9rBKFFUPrPhZBiG is bound to PM4's session; PM4
  disables it at handoff. Make your own with send_later. Leave the owner's hourly
  "Earned usage safety net" task (trig_01PvRHE1vTb3EaeyZVeUccaE) alone.

## 4. State when this file was written (2026-09-21 11:10 ET; verify everything)
- Chain tip f503130, 634 ledger lines; your handoff commit follows. S9 lane
  rebuild/b-s9-ui-pins at 15ab6e83: INTEGRATION PART 1 ACCEPTED (:633): five lanes merged,
  the glue written, Astra's blind review 9f45e4b3 on rebuild/r-astra-s9int-l1. PART 2 waits
  for the design lane. The S9 instruction sheet is rebuild/lanes/b/S9-UI-PINS-BRIEF.md
  (accepted at 8c2bc36e, :627, rulings P-S9-1 to P-S9-6; its LAST paper pass is deferred
  until C-UI-1's file set exists). Owed in part 2: D-NULL-ARTIFACT, D-CONDITION-MATCHER,
  the report's denominators (:633); P-S9-2's design-of-record reader cell after C-UI-1;
  the day-of pack literals; S9.json, the export command, E fact 7 last, four PM token lines.
- THE LOOK'S LONG POLE: lane C-UI-0 (the design chat's 18 fixes; rulings P-CUI-5 and PM-5,
  PM-6 at :616; the 53 prepared audit-3 rows at 3b186404 on rebuild/r-cui0-audit2, runtime
  kit in %TEMP%\cui-audit2). rebuild/c-ui-0-gates is still 814f0a03 and no branch
  rebuild/c-ui-0-gates-next exists; the design lane has been silent since 2026-09-19
  morning. When a new immutable head appears: run the audit rows at once, Astra judges, you
  read the delta, in parallel (:593 point 1); then C-UI-1's Fable final; then S9 part 2.
  Joe was asked twice to nudge the design chat or say "take it" (a hand here does the 18
  fixes, Astra re-audits). NOT ANSWERED.
- RUNNING when this was written: (a) the ENGINE REPAIR loop waqcwnpmz (run id
  wf_7dada845-a31, script loops/earned-loop-epp.js): owner-ordered (:631 1a), ONE clause in
  rebuild/engine/today.cjs and ONE in writers.cjs, rows EPP-R1 to EPP-R7 red first, branch
  rebuild/e-proposed-pick-repair from 8c2bc36e, PC worktree %TEMP%\earned-epp, Astra jobs
  88 to 90 at xhigh; a fix round that needs a THIRD engine change STOPS and goes to Joe; it
  rides S9 if accepted in time, else S10, and the look never waits for it. (b) the SPLIT'S
  ORDERED FIX ROUND wx5el4gyu (run id wf_6526fac8-502, loops/earned-loop-split4.js): S-R31
  the input is pinned at the door, S-R32 the banner claims only what a cell asserts (:633),
  branch rebuild/c-today-split-build from c02b001e, Astra jobs 93 to 95. (c) Astra job 96,
  the NATIVE-LOAD spec (the common engine part of earn-on-phone; xhigh; worktree
  %TEMP%\earned-astra-96, local branch rebuild/c-native-load-spec; one NEW file
  rebuild/coach/NATIVE-LOAD-SPEC.md): collect it yourself when astra-job-96.done exists.
  If PM4 judged any of these before leaving, the ledger says so after line 634.
- THE LIVE APP (:631 1b, :632): main at 466a01cd holds the same two lookups at src/app.jsx
  :1493 and :2583, text identical to the rebuild's. ORDER: the rebuild repair ACCEPTED first;
  then two exact-match replacements adding x.state !== "PROPOSED" && before (x.kind, each
  refused unless it matches exactly once, on a branch cut from main, by a PM script that no
  hand reads through; the committed bundle app.js rebuilt with the app's own build script
  (npm run build); the gate node scripts/check.mjs --strict green; the two-line diff shown to
  Joe with digits masked; HIS RELEASE WORD before main moves. Every push to any branch runs
  main's pipeline (the gate, and a DRAFT deploy for non-main branches).
- OPEN OWNER QUESTIONS: (1) how the phone earns weights: A, B, C or D of
  rebuild/coach/EARN-ON-PHONE-OPTIONS.md (686010d5 on rebuild/c-earn-on-phone-options; Astra
  and PM4 recommend B with A as the fallback; D not credible before the trial); every option
  carries engine bytes. (2) the design lane: nudge it or "take it". HELD for later: the six
  re-plan questions, N3's three, the EW2 brief's questions 2 and 3 and every PROPOSED
  sentence (with the C-UI-9 drawing), the second-source refusal's PROPOSED sentence.
- ACCEPTED PAPER WAITING FOR A BUILD: GYM-SETTINGS-WRITER-SEAL final paper 6fe4d12c on
  rebuild/c-gym-settings-writer-seal-spec (:628, G-R1 to G-R5; a CLAUDE author, from the
  split's ACCEPTED head, Astra blind at xhigh, your final). EW2 build brief 99fab142 plus
  the second-source addendum 5626eef5 on rebuild/d2-ew2-spec (:630 E-R43 to E-R46; :631
  answer 3 lifts the STOP on the refusal branch; suite steps B0 to B4 and B1a first;
  product steps wait for their base after S10). TODAY-MODEL-HANDOFF spec 45ea25a1 on
  rebuild/c-today-model-handoff-spec (unreviewed; a review loop like T1's:
  loops/mk_t1spec.py is the model). N3-A parked at 7f81f209 on rebuild/c-n3-macros-data.
  The S10 brief is not written (input pack d97ccdd3 on rebuild/b-s10-brief-inputs; S-R30 at
  :626 orders the after-the-cut tickets; Astra's L3 debts D3, D5, D6, D7, D9 go into it
  verbatim; S-R33 gets its row there).
- Astra's gauge read 29 percent of her week at 2026-09-19 17:39 ET.

## 5. What to do next, in order
1. Record the seat (ledger), rebuild the reading room, set one wake.
2. Judge whatever returned (section 4's three), once each, the :613 way.
3. The look: watch the design lane; the moment Joe says "take it" or a new head appears, act.
4. When the engine repair is ACCEPTED: integrate it toward S9 (or S10), then the live patch
   and Joe's release word.
5. When Joe picks the earn-on-phone option, record his words verbatim (they are his word for
   engine bytes), review the NATIVE-LOAD spec in a loop, and order the build of the common
   part first.
6. When the split is ACCEPTED: the settings-writer build, EW2's suite steps, the S10 brief.
7. Keep Astra loaded with paper she may write (the S10 brief draft, TODAY-OUTCOME-TYPE and
   GYM-START-IN-PAINT specs from rebuild/c-after-the-cut-tickets).

## 6. What worked this seat
Self-running loops with job texts written in advance; reviewers told to disagree and to
bring executed counterexamples; red first, one commit per finding; the PM reading every
review whole and re-running the bar on linux before accepting; rulings named (P-, E-R, G-R,
S-R) so briefs can cite them; saying plainly to Joe when the PM was wrong (:627, :634).
What cost most: the PM's own long context (hence this handoff) and minute-by-minute waits
on Astra by large-model operator steps (hence sonnet operators).

## 7. First message to Joe
Two lines: you are seated, what is running, RESULTS WAITING count, Astra's gauge, the two
open questions restated in one line each, and the PROGRESS footer.
