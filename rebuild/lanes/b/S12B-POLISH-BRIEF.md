# S12B-POLISH-BRIEF: M2-S12B-POLISH, the S12b screen and layout polish on the sealed S11 (fast route)

- Brief of record for rebuild/lanes/b/tooling/packages/S12B.json (brief.file). Accepted only by sha256, on a cowork
  BRIEF ACCEPTED BY SHA line on rebuild/t2-client-core; any edit makes a new sha and needs a new line.
- Package M2-S12B-POLISH (lanePackage S12B), parent M2-S11-NATIVE-LOAD (receipt DECISIONS:896, sealed and merged :897).
- Route: the S12b fast route (owner, DECISIONS:914 "visual polish first"; PM, DECISIONS:915 "new definition of done,
  review cap, Coach off Today, order of work"), made its own child package by the PM's ruling R16.
- Written 2026-10-11 by a builder seat over the lane worktree of branch rebuild/c-look-s12b: commit 40ff08d (the PM's
  commit of R6-R13 on a4b138d) plus the uncommitted R14 and R16 edits named in section 4. The PM amends.
- A map of what S12B is and is not. It does not restate S11's brief (DECISIONS:875) or S12-LOOK-BRIEF.md; both stay
  the contracts for everything S12B carries unchanged.

## 1. What S12B is, in one paragraph

S12B is the S12b polish: the fixes that came out of a screen-by-screen ease-of-use audit of the S12 look, run at
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
| parent package | M2-S11-NATIVE-LOAD (packages/S11.json, unchanged and undeclared by S12B) |
| parent artifact | rebuild/m4/spec/acceptance-s11-native-load.json sha256 bde69f156c4f88e15c65ae79790d0e7ad34c522af058e22438c7ea1fef5ccac4 |
| parent review | rebuild/m4/spec/review-s11-native-load.json sha256 6388db96f429e498b7c78bfd5ebb3c04ae08b7550ee274ef0b0ee0c466a41f5b |
| receipt | DECISIONS:896 (POSTFIX-ACCEPTANCE M2-S11-NATIVE-LOAD); sealed and merged DECISIONS:897 |
| seal tip | 7c79ef16b770ab881892ad126dadfe0687bc1d2b = S12B.json sourceBase (set by S12B-REGEN at every --write) |
| sibling before it | M2-S12-LOOK (packages/S12.json), merged to the chain; S12.json is left at its chain bytes by S12B |
| chain at branch point | refs/remotes/origin/rebuild/t2-client-core a4b138d (DECISIONS:915) |
| engine | no rebuild/engine byte moves; the coach ENGINE_REVISION stays S11's |

S12B.json parent.options[0] is S11 with receiptLedgerLine 896 and the artifact and review shas above, re-measured by
S12B-REGEN. Its product pre values are the bytes at 7c79ef1, so its product map covers the S12 look and the S12b
polish together, as one delta over the sealed S11.

## 3. The route, and why S12B is its own package

- DECISIONS:914 (owner): visual polish first, on the S12b fast route. DECISIONS:915 (PM): the definition of done, the
  review cap, Coach off Today, the order of work. The rounds R6-R16 are the PM's round messages to this seat.
- The fence. rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs, cell "THE REAL ROW", diffs
  merge-base(chain, HEAD)..HEAD (committed history only) and refuses any touched path the chain's sealed top artifact
  (acceptance-s11) does not release. A branch stands aside only under the RESEAL-CHILD CLAIM, when all five hold:
  1. the diff adds exactly one rebuild/lanes/b/tooling/packages/<ID>.json at status A, with the runner's SPEC_KEYS;
  2. that spec's chosen parent option binds acceptance-s11 at bde69f15;
  3. <ID> is not in b-package.cjs IDS at the chain;
  4. the diff touches b-package.cjs and HEAD's IDS carries <ID>;
  5. the spec's sourceBase is an ancestor of HEAD.
- S12 stood aside this way at dbfc1ee. After S12 merged, a branch cut from a4b138d has no S12.json at status A, so the
  fence (its F3 note) treats S12b as an ordinary branch: at 40ff08d it is 62/1, naming nine sealed paths (section 6).
- R16 (PM ruling) makes S12b the child M2-S12B-POLISH (section 4). The standing CI step moves from --package S12 to
  --package S12B: S12.json is back at its chain bytes, the polish moves files whose posts it pins, so S12's step
  would refuse here; S12B.json re-measures S12's whole map, so its step covers everything S12's did.

## 4. Composition

| layer | what | state |
|---|---|---|
| a4b138d | the chain at branch point (S12 merged; DECISIONS:914, :915) | chain |
| 40ff08d | "S12b R6-R13: screen and layout fixes for ease of use (DECISIONS:914-:915)", the PM's commit | committed |
| R14 | rebuild/m3/w7-preview/today/gym-model.mjs: the narrow fast-Finish design (section 7) | worktree |
| R16 | packages/S12B.json (new), packages/S12.json (restored), b-package.cjs (IDS), rebuild.yml (one line), rebuild/lanes/b/S12B-REGEN.cjs and S12B-REGEN.test.cjs (new), this brief (new) | worktree |

The fence reads committed history: it turns green only when the PM's amend puts S12B.json at status A and the IDS
line in the same merge-base diff.

## 5. Product map (S12B.json, 341 paths by role)

- 21 new: S12's 18 plus packages/S12.json (declared so the regenerator may read it; post = chain bytes) and the
  S12B-REGEN pair. 29 edited (S12's set; S12b's edits land in gym-model.mjs and the today, W6 and copy-lock tests).
  291 carried, byte-equal to 7c79ef1.
- Released-undeclared, as in S12: today-app.cjs, gym-app.mjs, preview.css and build.mjs (released by the S9/S10
  ancestors; the regenerator's ancestor-release walk leaves them out). S12B moves three of them.
- S12B-REGEN.cjs is S12-REGEN.cjs ported (SPEC packages/S12B.json; SCOPE plus the S12B-REGEN pair; ASCII-escaped
  write). Run `--parent 7c79ef1... --worktree`, then `--write --receipt-line 896`, then dry again (0 changes). Its
  PENDING census: $.brief.acceptedLedgerLine, $.authorizations.theme.line, $.authorizations.theme.lineSha256.

## 6. The nine S11-sealed paths S12B touches, and why

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
- Browser checks (browser-check, gym-check, machine-settings-check, sleep-check, w6 local-today-browser): R8-R13
  each stands on a fixed declared day through app.js boot({ today }) (TRAIN 2030-02-04, REST 2030-02-06); each reads
  the current gym card; each closes its browser in a bounded finally; gym-check taps Finish the moment it is drawn and
  expects "Workout recorded".
- Static audit (outside the lane, %TEMP%\s12b-fix): screen-scrolls-sideways is a BROKEN kind (.view scrollWidth minus
  clientWidth above 0); red first (BROKEN 10), green after R11.

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
with ONE narrow relaxation in a browser check (local-today-browser, below; accepted by Fable, REVIEW-S12B-R8-R13,
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
| look-cui2 R3 words | "Talk through today's plan" pinned ABSENT from t-today and design.cjs; no #talk-today, data-go="coach" or coach-state on Today; the board still draws it; the Coach screen still ships its line | presence pins replaced by absence pins plus the board and Coach pins |
| workout-look | the rest Log row holds exactly one button and the link row is exactly Undo (#edit, .link) then Back to Today; the S11 panel is order 2 after the stack's 1, --stack-lift 0px on both mounts, its safe-area padding pinned | exact counts and orders, as before |
| the five browser checks | a fixed declared day; the current card's selectors; bounded teardown; gym-check's Finish tapped at once | the rest-day branch and the gym return path are asserted where they used to be skipped; two exceptions follow |
| local-today-browser adoptions (R10) | was deepEqual [{from DAY, to NEXT_DAY, adopted}]; now the LAST adoption is exactly that, and at most one other is allowed, which must be to DAY, adopted true | RELAXED, narrowly: the shipped page boots on the live day first (S4), so the check's own stand onto DAY is a real adoption on the record; the later day must still be adopted by name |
| machine-settings-check (R10) | `.catch(() => {})` on the three post-reload showsSettings waits | the verdict is kept: an exact assert.equal of the settings line follows each wait |
| S12B-REGEN.test.cjs | new, the S12-REGEN test ported (env S12B_REGEN_UNDER_TEST; SCOPE row adds the S12B-REGEN pair) | 215 cells, as S12-REGEN.test |

## 10. What S12B does NOT move

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

Held by this seat (protected-five guard preloaded on every run; nothing guard-stopped re-run): see R6-REPORT.md R6-R16.
The seat still owes, before the fast-forward:
1. The amend that commits R14 and R16, then sealed-inventory-fence (expected 63/63 under the reseal-child claim).
2. b-package.cjs --ci --package S12B (the standing step). It passes only once the :916/:917 lines fill
   authorizations.theme and brief.acceptedLedgerLine, and today-17 prints "# pass 837" (835 plus gym.test's R9 and
   R13 cells; no other child's count moved), which the seat confirms.
3. S12B-REGEN dry at the amended commit: 0 entries would change.
4. The build, then browser-check, gym-check, machine-settings-check and sleep-check with W7_BROWSER_BIN, on the
   declared days.
5. w6 local-today-browser with W6_BROWSER_BIN (expected red: section 12).
6. The guard-stopped suites: view, problem, copy, setup, machine-settings-ui, catalogue, food, adapter, package, the
   scene build cell, measure boundary, local-today-journey, local-real-day, rebuild/m4/workout/test/h3-clean-init.
7. Fable's read of this brief, then the THEME and BRIEF ledger lines (section 13).

## 12. Open debts

- D-W6-LOCAL-TODAY-BROWSER: local-today-browser fails on the live tree too. It waits for #today-status to be visible,
  and the page shell's chrome=0 hides the review aside it sits in; the text is already the expected "Restore required
  ... (KEY_MISSING)". Not caused by S12b; left for its own fix.
- F6 (the rest screen as the next set's screen), F8 (a rest day where the engine names tomorrow's session as today's
  workout still offers Start; T-11 is drawn there) and F9 (tell() writes into the review aside, outside the phone
  frame, so the status message never reaches a phone): LEFT OPEN, each an owner or placement decision, not a cheap
  presentation rule. F11 is partly fixed; the quiet links keep the pack's 13.5 px. F10: nutrition's food-save is still
  below the fold.
- S12B-REGEN.test.cjs has no CI step. S12-REGEN.test's step is in rebuild.yml; adding one for S12B would move other
  bytes of rebuild.yml, which R16 keeps identical. The PM may add it.
- The fence is 62/1 until the amend (section 4). The THEME and BRIEF lines are the PM's.
- The pack's quality gate.py lists #talk-today .mic, no longer drawn (only if run on the live app).
- The page boots live first, so gym-check's exact composition counts would show any live-boot write.
- R14-1 (Fable, observation): a Today read that never settles now holds Log and Finish until it does; narrower
  than R13's queue, which also held repaints.

## 13. Acceptance

This brief is accepted by its sha256 on a cowork line on rebuild/t2-client-core that names M2-S12B-POLISH and this
path and ends with the clause separator and ACCEPTED (b-package.cjs spec(): claim(..., 'cowork', 'brief acceptance'),
status BRIEF-ACCEPTED, the line includes packageId and brief.file; authority() finds the exact line bytes on
refs/remotes/origin/rebuild/t2-client-core under role cowork). The THEME line for M2-S12B-POLISH is the line before
it. Both are the PM's to append after Fable reads this brief (THEME DECISIONS:916, BRIEF :917). brief.sha256 is
this file's sha256. Pending in S12B.json until the lines and the seat run:
- brief.acceptedLedgerLine "PENDING" (the :917 line's bytes);
- authorizations.theme: ledgerLine 916, line and lineSha256 "PENDING" (the :916 line's bytes);
- authorizations.review.prefix is already "POSTFIX-ACCEPTANCE M2-S12B-POLISH" (spec() binds it to the package id);
- children today-17 needle "# pass 837", authored from the count and confirmed only by the seat's full run.
Neither line authorises a PASS word by itself; on this route no PASS word is sought, only PUBLIC CI EVIDENCE PASS
from the standing step --package S12B.
