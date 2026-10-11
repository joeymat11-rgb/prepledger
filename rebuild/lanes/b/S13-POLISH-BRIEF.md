# S13-POLISH-BRIEF: M2-S13-POLISH, the S12b screen and layout polish on the sealed S11 (fast route)

- Brief of record for rebuild/lanes/b/tooling/packages/S13.json (brief.file). Accepted only by sha256, on a cowork
  BRIEF ACCEPTED BY SHA line on rebuild/t2-client-core; any edit makes a new sha and needs a new line.
- Package M2-S13-POLISH (lanePackage S13), parent M2-S11-NATIVE-LOAD (receipt DECISIONS:896, sealed and merged :897).
- Route: the S12b fast route (owner, DECISIONS:914 "visual polish first"; PM, DECISIONS:915 "new definition of done,
  review cap, Coach off Today, order of work"), made its own child package by the PM's ruling R16 and numbered S13
  by his ruling R20 (section 3).
- Written 2026-10-11 by a builder seat over the lane worktree of branch rebuild/c-look-s12b: commit aaf6008 (R6-R18,
  committed by the PM) plus the uncommitted R19 and R20 edits named in section 4. The PM commits.
- A map of what S13 is and is not. It does not restate S11's brief (DECISIONS:875) or S12-LOOK-BRIEF.md; both stay
  the contracts for everything S13 carries unchanged.

## 1. What S13 is, in one paragraph

S13 is the S12b polish: the fixes that came out of a screen-by-screen ease-of-use audit of the S12 look, run at
phone sizes (360x780, 390x844) in both themes, plus one client-side defect fix (the fast Finish, R13/R14). It is a
presentation-and-client delta over the S12 look that is already on rebuild/t2-client-core: stylesheet rules, template
order, Today's view code, the gym view's after-workout wiring, the gym client model's continuation retry, the copy-lock
re-measure, the tests that pinned the old layout, and the browser checks that drive the page. It changes no engine
byte, no writer call, no stored format, no consent flow and no computed number (section 10). It runs as an UNSEALED
child package in --ci mode only, exactly as S12 did: no sealed private run, no receipt, no VERDICT, no acceptance
artifact. It exists as its own package because the sealed-inventory fence lets a branch touch S11-sealed paths only
under a reseal-child claim (section 3), and S12's claim ended when S12 merged.

What the owner gets: Start always starts the workout (the weigh-in no longer gates it); today's workout is on the
first view; a rest day says plainly that there is nothing to start; the rest screen shows the next lift and puts Undo
out from under the thumb; the recorded workout has a way back to Today; Finish tapped the instant it appears records
the workout; no screen scrolls sideways; fields, buttons and safe areas fit a phone.

## 2. Parent

| item | value |
|---|---|
| parent package | M2-S11-NATIVE-LOAD (packages/S11.json, unchanged and undeclared by S13) |
| parent artifact | rebuild/m4/spec/acceptance-s11-native-load.json sha256 bde69f156c4f88e15c65ae79790d0e7ad34c522af058e22438c7ea1fef5ccac4 |
| parent review | rebuild/m4/spec/review-s11-native-load.json sha256 6388db96f429e498b7c78bfd5ebb3c04ae08b7550ee274ef0b0ee0c466a41f5b |
| receipt | DECISIONS:896 (POSTFIX-ACCEPTANCE M2-S11-NATIVE-LOAD); sealed and merged DECISIONS:897 |
| seal tip | 7c79ef16b770ab881892ad126dadfe0687bc1d2b = S13.json sourceBase (set by S13-REGEN at every --write) |
| sibling before it | M2-S12-LOOK (packages/S12.json), merged to the chain; S12.json is left at its chain bytes by S13 |
| chain at branch point | refs/remotes/origin/rebuild/t2-client-core a4b138d (DECISIONS:915) |
| engine | no rebuild/engine byte moves; the coach ENGINE_REVISION stays S11's |

S13-REGEN re-measures the parent option (S11, receipt line 896, the shas above) and every product pre at 7c79ef1, so
the map covers the S12 look and the S12b polish as one delta over the sealed S11.

## 3. The route, and why S13 is its own package

- DECISIONS:914 (owner): visual polish first, on the S12b fast route. DECISIONS:915 (PM): the definition of done, the
  review cap, Coach off Today, the order of work. The rounds R6-R20 are the PM's round messages to this seat.
- The fence. rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs, cell "THE REAL ROW", diffs
  merge-base(chain, HEAD)..HEAD (committed history only) and refuses any touched path the chain's sealed top artifact
  (acceptance-s11) does not release, unless the RESEAL-CHILD CLAIM holds: the diff adds exactly one
  packages/<ID>.json (status A, SPEC_KEYS closure) whose parent binds acceptance-s11 at bde69f15; <ID> is not in
  IDS at the chain, b-package.cjs is touched and HEAD's IDS carries it; its sourceBase is an ancestor of HEAD.
- S12 stood aside this way at dbfc1ee. After S12 merged, a branch cut from a4b138d has no S12.json at status A, so the
  fence (its F3 note) treats S12b as an ordinary branch: at 40ff08d it is 62/1, naming nine sealed paths (section 6).
- R16 (PM ruling) makes S12b its own child package (section 4), and the standing CI step moves from --package S12
  to --package S13: S12.json is at its chain bytes and the polish moves files whose posts it pins, so S12's step
  would refuse here; S13.json re-measures S12's whole map, so its step covers everything S12's did.
- R20 (PM ruling, escalated under DECISIONS:915 (2) instead of widening a guard). The child was first registered
  under the S12b id of DECISIONS:916-:917 and never ran: that id fails the runner's no-register shape
  /^[HFS][0-9]+$/, and a package with no D-id must be in NO_REGISTER_IDS (b-package.cjs, REGISTER-D-ID-INVENTORY-
  EMPTY-AND-NOT-EXEMPT). So it is renumbered S13 (M2-S13-POLISH) and added BY NAME to NO_REGISTER_IDS exactly as
  S12 is; no pattern moves. The hold/bodyweight slice becomes S14 and the gym change S15 (the PM's ledger).

## 4. Composition

| layer | what | state |
|---|---|---|
| a4b138d | the chain at branch point (S12 merged; DECISIONS:914, :915) | chain |
| 40ff08d | "S12b R6-R13: screen and layout fixes for ease of use (DECISIONS:914-:915)", the PM's commit | committed |
| 534851e..aaf6008 | R14-R18: gym-model.mjs (fast Finish); the child package, regenerator pair and brief; S12.json restored; IDS; the chain merged at c5d7f61; the standing step | committed |
| R19 | canonical spec bytes (strict-json.cjs); the CHILD_SPECS lists of five tests and the tooling F6 IDS pin (section 6) | worktree |
| R20 | the rename: packages/S13.json, the S13-REGEN pair, this brief; IDS and NO_REGISTER_IDS 'S13'; rebuild.yml --package S13; the CHILD_SPECS lists and F6 pins | worktree |

The fence reads committed history. It held 63/63 at aaf6008 under the claim; once R20 is committed the claim needs
packages/S13.json at status A and 'S13' in IDS in the same merge-base diff (the chain has neither).

## 5. Product map (S13.json, 341 paths by role)

- 21 new: S12's 18 plus packages/S12.json (declared so the regenerator may read it; post = chain bytes) and the
  S13-REGEN pair. 29 edited (S12's set; S12b's edits land in gym-model.mjs and the today, W6 and copy-lock tests).
  291 carried, byte-equal to 7c79ef1.
- Released-undeclared, as in S12: today-app.cjs, gym-app.mjs, preview.css and build.mjs (released by the S9/S10
  ancestors; the regenerator's ancestor-release walk leaves them out). S13 moves three of them.
- S13-REGEN.cjs is S12-REGEN.cjs ported (SPEC packages/S13.json; SCOPE plus the S13-REGEN pair; the runner's
  canonical JSON write, R19). Run `--parent 7c79ef1... --worktree`, then `--write --receipt-line 896`, then dry
  (0 changes). PENDING: $.brief.acceptedLedgerLine, $.authorizations.theme.line, $.authorizations.theme.lineSha256.

## 6. The nine S11-sealed paths S13 touches, and why

The fence's REAL ROW at 40ff08d names these nine; the reseal-child claim of section 3 is what lets them move.

| path (rebuild/m3/...) | round | why |
|---|---|---|
| w7-preview/today/gym-model.mjs | R13, R14 | the fast-Finish defect: a set or Finish tapped while the post-set read runs is retried once the read settles, instead of being refused (section 7) |
| w7-preview/today/test/gym.test.mjs | R6, R9, R13 | R6: Start before the weigh-in; R9: new cell "Today's primary by kind of day"; R13: new red-first cell, a set and a Finish tapped the moment they are drawn |
| w7-preview/today/test/view.test.mjs | R6 | sheet cells open the weigh-in through api.openWeighIn(); Start no longer gated; no Talk row or Coach marker on Today; headline cell pins the new fit |
| w7-preview/today/test/problem.test.mjs | R6 | P0C.2 label-and-action-agree: Start opens the workout with the weight owed, no sheet |
| w7-preview/today/test/copy.test.mjs | R6 | coach-state pinned absent from Today (Coach off Today, :915) |
| w7-preview/today/test/copy-lock.test.mjs | R6, R9 | the two sha literals after the re-measure (section 8) |
| w7-preview/today/test/copy-lock.corpus.json | R6, R9 | the re-measured corpus |
| w6/test/local-today-journey.test.mjs | R6 | the two "Log the scale" pins become Start plus the morning card's weigh-in form |
| w6/host/test/local-real-day.test.mjs | R6, R8, R9 | the one durable tap is one submit of the card's form; the primary follows the rule by kind of day |

R19-R20 add, under the same claim, 'S13' after 'S12' in the declaring-spec chain (CHILD_SPECS) of boundary.test.mjs
(P-MEASURE (g)), food.test.mjs (N1.18), machine-settings-ui.test.mjs (S10), problem.test.mjs and setup.test.mjs
(re-pin): S12.json stands at its chain bytes, so only S13.json declares the bytes S12b's files stand at. The lane B
tooling F6 cell pins the runner's IDS (17) and NO_REGISTER_IDS (13) by literal, as it did for S12.

## 7. The changes, by file (R6-R14)

- preview.css (released-undeclared): R6 block items 1-11 (pressed answers, ink cards and fields, the weigh-in sheet,
  the Import page, Start's one-line label, safe areas, content-page primaries held at the foot, the S11 panel after
  the stack, the after-workout page); R7 (Sleep boxes, the after-workout band, follow-up card clears the legend, the
  14 px reads on the set screen); R8 (the sleep-ask slot clears the legend; date and time fields full width, no
  invented figure); R11 item 12 (the gym scrims stop at the 22 px gutter; the Import file picker max-width 100%).
- today-app.cjs (released-undeclared): R6 Start un-gated, the Coach entry and coach-state binding removed,
  fitHeadline measures #card-train against Start on the view, blocked Today says "Not available yet" once per card;
  R7 blocked Today says it once, on the food card; R9 the primary by kind of day: resume, close and review first; a
  session gives Start; a refusal gives the Why route; no session with the weight owed gives the pre-R6 weigh-in label
  and sheet; no session and nothing owed draws no primary, and the status line is T-12.
- screens.template.html: R6 #card-train straight after the morning card; the Talk row gone from t-today; the rest
  screen's next block above the saved set, Undo as the link row's first quiet link; the recorded workout gets one
  primary "Back to Today".
- gym-app.mjs (released-undeclared): R6 the stub wires every [data-go="today"]; R13 finishOutcome awaits onChanged
  before leaving the card, so Today redraws with the workout recorded.
- design.cjs: R6 the two Talk strings dropped from APPROVED_COPY.
- gym-model.mjs: R14. read is exported as readTracked, which keeps each read in a set; commitContinued (used by
  logSet and finish) waits for the reads in flight, prepares the continuation, executes, and only on the refusal
  WORKOUT_RESUME_REQUIRED (which executeResumedWorkout returns before bridge.execute, so nothing is written) waits and
  prepares again, at most three attempts. Reads never wait on a write, so every GSS annex guarantee holds (R13's
  serialisation broke two of them; R14 replaced it).
- The five browser checks (R8-R13): a fixed declared day via app.js boot({ today }) (TRAIN 2030-02-04, REST
  2030-02-06), the current gym card, a bounded teardown; gym-check taps Finish at once, expects "Workout recorded".
- Static audit (outside the lane): BROKEN kind screen-scrolls-sideways (.view scrollWidth > clientWidth); red first
  (BROKEN 10), green after R11.

## 8. The copy moves (no new words)

Every string drawn is already approved (DECISIONS:905 and the boards). The copy lock was re-measured against the same
sealed S11 corpus (S11_CORPUS_SHA256 unchanged) and three pieces moved:
1. "Back to Today": one more template use (the recorded workout's primary), the board's own rest-screen words.
2. "Your plan, progress and the reasons behind it.": removed with the Talk row.
3. "Talk through today's plan": no longer added by S12 (Coach off Today, :915).

"Log this morning's weight" stayed where the parent had it (R9 restored today-app.cjs's use). T-12 "Nothing scheduled
today, so there is nothing to start." and "Not available yet" were already in the lock. New literals in
copy-lock.test.mjs: CORPUS_SHA256 72f5d0da549949c0de3e6d55566cb03c86c4dd6dc77993c4ee3753eb7e29041b and
S12_DELTA_SHA256 df3dbc367cee51124335cb723e519f4939250939a53ee5d24337a9846b82deff. S12_COPY_APPROVAL still cites
DECISIONS:905.

## 9. The tests changed, and how each stays as strict

No law, guard or pin was weakened. Each replaced assertion reads the same fact from where the screen now shows it,
with ONE narrow relaxation in a browser check (local-today-browser, below; accepted by Fable, its R8-R13 review,
1fdbde2c).

| test | change | why it is as strict |
|---|---|---|
| gym.test A2 subtest 1 | was "Log the scale" before the weigh-in; now Start before AND after, never the weigh-in's words, and the card's #weight form present | the old one pinned one label; the new one pins the label on both sides of the weigh-in and the form's presence |
| gym.test, new R9 cell | the primary by kind of day on the fixed SYNTHETIC_DAY, with and without a layer code | new; it fails on R8's code |
| gym.test, new R13 cell | a MutationObserver athlete taps every chip, Log, "Start set N" and Finish on the next task after each is drawn | new; red with the fix disabled (mutant check), green with it |
| view.test | sheet cells open through api.openWeighIn(); "primary before a weigh-in" pins Start, no sheet, the workout screen and the form; no Coach entry or marker on Today; one --headline rule, var(--headline, 47px), the fitter measuring #card-train | each pin names the exact element, rule or value; the 16 px sweep still covers the card's #weight |
| problem.test P0C.2 | the label-and-action-agree law kept; Start opens the workout with the weight owed under both the weight head and the night head | same law, both heads asserted |
| copy.test | coach-state pinned ABSENT from Today | an absence pin where there was a presence pin; the nutrition marker unchanged |
| copy-lock.test, corpus | two sha literals | the lock is exact bytes either way; re-derived against the same S11 corpus |
| local-today-journey | two "Log the scale" pins become Start plus the card's form | both facts pinned |
| local-real-day S4/8 | the durable tap is one submit of the card's form; the primary is the weigh-in (live), a disabled Start, or a live workout action, by the workout line | same write site, same date assertions; the primary is pinned for every kind of day |
| look-cui2 R3 words | "Talk through today's plan" ABSENT from t-today and design.cjs, no Coach entry or coach-state on Today; the board and the Coach screen still draw it | absence pins plus the board and Coach pins |
| workout-look | the rest Log row holds exactly one button and the link row is exactly Undo (#edit, .link) then Back to Today; the S11 panel is order 2 after the stack's 1, --stack-lift 0px on both mounts, its safe-area padding pinned | exact counts and orders, as before |
| the five browser checks | a fixed declared day; the current card's selectors; bounded teardown; gym-check's Finish tapped at once | the rest-day branch and the gym return path are asserted where they used to be skipped; two exceptions follow |
| local-today-browser adoptions (R10) | was deepEqual [{from DAY, to NEXT_DAY, adopted}]; now the LAST adoption is exactly that, and at most one other is allowed, which must be to DAY, adopted true | RELAXED, narrowly: the shipped page boots on the live day first (S4), so the check's own stand onto DAY is a real adoption on the record; the later day must still be adopted by name |
| machine-settings-check (R10) | `.catch(() => {})` on the three post-reload showsSettings waits | the verdict is kept: an exact assert.equal of the settings line follows each wait |
| S13-REGEN.test.cjs | new, the S12-REGEN test ported (env S13_REGEN_UNDER_TEST; SCOPE row adds the S13-REGEN pair) | 215 cells, as S12-REGEN.test |
| S13-REGEN.test --write cell (R19) | its fixture value carries U+00B7 | stricter: an escaped write fails the canonical-bytes assertion (red first) |
| five CHILD_SPECS lists (R19, R20) | 'S13' added after 'S12' | additive: a drift is still red unless the youngest declaring spec names its exact bytes |
| tooling F6 (R19, R20) | IDS pin 17 ids; NO_REGISTER_IDS pin 13 ids | exact literals, as for S12; the shape regex is unchanged |

## 10. What S13 does NOT move

- No engine byte: nothing under rebuild/engine changes; the coach ENGINE_REVISION is S11's.
- No writer call change: the write sites and their commands are byte-equal in shape. submitWeighIn and openWeighIn are
  unchanged. gym-model's logSet and finish send the same command fields; the R14 retry repeats prepare and execute only
  after WORKOUT_RESUME_REQUIRED, which is refused before bridge.execute, so a tap still writes at most once.
- No stored format: no record shape, key, schema or migration moves.
- No consent flow: the setup, import, restore and consent screens keep their flow (Import gets layout rules only).
- No computed number: no load, target, calorie band, protein figure, count or date is computed differently; only
  where and when values are drawn moves.
- No new words (section 8); no new screen or route; Coach stays reachable by its own route, not from Today.

## 11. Evidence for the PM seat

Held by this seat (protected-five guard preloaded on every run; nothing guard-stopped re-run): see R6-REPORT.md R6-R20.
The seat still owes, before the fast-forward:
1. The commit of R19-R20, then sealed-inventory-fence (expected 63/63 under the claim, now for packages/S13.json).
2. b-package.cjs --ci --package S13 (the standing step). It passes only once the :918/:919 lines fill
   authorizations.theme and brief.acceptedLedgerLine, and today-17 prints "# pass 837" (835 plus gym.test's R9 and
   R13 cells; no other child's count moved), which the seat confirms.
3. S13-REGEN dry at that commit: 0 entries would change; the lane B tooling suite.
4. The build, then browser-check, gym-check, machine-settings-check and sleep-check with W7_BROWSER_BIN, on the
   declared days.
5. w6 local-today-browser with W6_BROWSER_BIN (expected red: section 12).
6. The guard-stopped suites: view, problem, copy, setup, machine-settings-ui, catalogue, food, adapter, package, the
   scene build cell, measure boundary, local-today-journey, local-real-day, rebuild/m4/workout/test/h3-clean-init.
7. Fable's read of this brief, then the THEME and BRIEF ledger lines (section 13).

## 12. Open debts

- D-W6-LOCAL-TODAY-BROWSER: local-today-browser fails on the live tree too (it waits for #today-status to be
  visible, and chrome=0 hides the aside it sits in; its text is the expected KEY_MISSING). Not caused by S12b.
- LEFT OPEN, each an owner or placement decision: F6 (the rest screen as the next set's screen), F8 (a rest day the
  engine gives tomorrow's session still offers Start, under T-11), F9 (tell() writes outside the phone frame, so the
  status message never reaches a phone). F11 partly fixed (quiet links keep 13.5 px); F10 food-save below the fold.
- S13-REGEN.test.cjs has no CI step. S12-REGEN.test's step is in rebuild.yml; adding one for S13 would move other
  bytes of rebuild.yml, which R16 keeps identical. The PM may add it.
- The fence must hold again once R20 is committed (section 4). :916-:917 bind the withdrawn S12b id; the THEME
  (:918) and BRIEF (:919) lines are the PM's.
- The pack's quality gate.py lists #talk-today .mic, no longer drawn (only if run on the live app).
- The page boots live first, so gym-check's exact composition counts would show any live-boot write.
- R14-1 (Fable, observation): a Today read that never settles now holds Log and Finish until it does; narrower
  than R13's queue, which also held repaints.

## 13. Acceptance

This brief is accepted by its sha256 on a cowork BRIEF line on rebuild/t2-client-core that names M2-S13-POLISH and
this path and ends with the clause separator and ACCEPTED (b-package.cjs spec() and authority(), role cowork); the
THEME line is the line before it. Both are the PM's to append after Fable reads this brief (THEME DECISIONS:918,
BRIEF :919). brief.sha256 is this file's sha256. Pending in S13.json until the lines and the seat run:
- brief.acceptedLedgerLine "PENDING" (the :919 line's bytes);
- authorizations.theme: ledgerLine 918, line and lineSha256 "PENDING" (the :918 line's bytes);
- authorizations.review.prefix is already "POSTFIX-ACCEPTANCE M2-S13-POLISH" (spec() binds it to the package id);
- children today-17 needle "# pass 837", authored from the count and confirmed only by the seat's full run.
Neither line authorises a PASS word by itself; on this route no PASS word is sought, only PUBLIC CI EVIDENCE PASS
from the standing step --package S13.
