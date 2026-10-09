# S12-LOOK-BRIEF: M2-S12-LOOK, the new look on the sealed S11 (S12-FAST route)

- Brief of record for rebuild/lanes/b/tooling/packages/S12.json (brief.file). Accepted only by sha256, on a cowork
  BRIEF ACCEPTED BY SHA line on rebuild/t2-client-core; any edit makes a new sha and needs a new line.
- Package M2-S12-LOOK (lanePackage S12), parent M2-S11-NATIVE-LOAD (receipt DECISIONS:896, sealed and merged :897).
- Route: S12-FAST (owner ruled, DECISIONS:904), amended by route A (DECISIONS:905 (2)); round 2 rulings DECISIONS:906.
- Written 2026-10-09 by a builder seat over branch rebuild/c-look-s12-on-s11 at dbfc1ee (S12-FAST committed, clean).
- Concise by the owner's choice of speed: this brief is a map of what S12 is and is not, with every claim pointing at
  the ledger line, commit, file or review that holds it. It does not restate S11's brief (352743 bytes, sha256
  4f7d431f..., DECISIONS:875), which stays the behaviour contract for everything S12 carries.

## 1. What S12 is, in one paragraph

S12 puts the owner-approved new look (the C-UI lane: Today, Workout, Coach and the scene, from the 2026-09-18 design
pack, DECISIONS:817, :820, :826) on top of the sealed S11 app, without changing what the app computes or stores. The
engine, the writers and every data path are S11's, byte for byte. What moves is presentation (templates, stylesheets,
view code, the scene), the tests that encoded the old look (moved red first, each named SC-n below), the copy lock
(the look's strings, approved under DECISIONS:905), the package registration (S12 in the runner, the standing CI step
--package S12) and two real defects found on the way (section 7). It runs as an UNSEALED child package in --ci mode
only: no sealed private run, no receipt, no VERDICT, no acceptance artifact.

What the owner gets: the app on his phone looks like the boards he approved (Today, the Workout set and rest screens,
the Coach screen that says there is no live coach in this build), with S11's behaviour unchanged underneath (the
next-weight offer after a logged lift, accepted only with Yes; his imported history; the weigh-in).

## 2. Parent

| item | value |
|---|---|
| parent package | M2-S11-NATIVE-LOAD (packages/S11.json, unchanged and undeclared by S12) |
| parent artifact | rebuild/m4/spec/acceptance-s11-native-load.json sha256 bde69f156c4f88e15c65ae79790d0e7ad34c522af058e22438c7ea1fef5ccac4 |
| parent review | rebuild/m4/spec/review-s11-native-load.json sha256 6388db96f429e498b7c78bfd5ebb3c04ae08b7550ee274ef0b0ee0c466a41f5b (ACCEPTED) |
| receipt | DECISIONS:896, POSTFIX-ACCEPTANCE M2-S11-NATIVE-LOAD, reviewed commit 834dd3e, receipt base 82eaabf |
| sealed and merged | DECISIONS:897; seal tip 7c79ef16b770ab881892ad126dadfe0687bc1d2b = S12.json sourceBase |
| sealed-run receipt | rebuild/lanes/b/tooling/receipts/S11.json sha256 48574b8d8f252e87... (unchanged) |
| coach ENGINE_REVISION | M2-S11-NATIVE-LOAD@48574b8d8f252e87, unchanged by S12 (no rebuild/engine byte moves) |
| S12.json parent.options[0] | id S11, receiptLedgerLine 896, artifact and review shas as above (re-measured by S12-REGEN at every --write) |

## 3. The route and its limits, verbatim

The three ledger bodies below are quoted byte for byte from rebuild/DECISIONS.md on rebuild/t2-client-core at
77c875e (each line's date, author tag and closing words are given in the heading; the bodies are ASCII). Line sha256:
:904 0bd0f4a5350705ec..., :905 f5a636669cf03715..., :906 f13ca7ea12ede180....

### DECISIONS:904 (2026-10-09, Claude Opus 5.5 PM, closing OWNER RULED + PM RULED)

> OWNER RULED, S12 RELEASE ROUTE: Joe, this chat, 2026-10-09, answering the PM's question (full sealed process about 6-9 working days, or a lighter path for the new look about 1-2 days) = "Faster path". PM RULED, the S12-FAST route, for presentation-only change and only for S12: (1) scope is the look (C-UI lane, origin/rebuild/c-look-s12-compose-pre 473a38d) merged onto the S11 seal 7c79ef1 (branch rebuild/c-look-s12-on-s11: merge 47258c2 + C-2 fix, Fable REVIEW-S12-C2-FIX-FABLE-l1 71f3b63b ACCEPT WITH NAMED DEBTS); no rebuild/engine byte, no data-path or writer change, no change to any S11 behaviour or test; (2) every sealed cell that encodes the old look moves red-first with the move named (the rev8 SC list), never weakened; copy additions only under the owner's approved words (:817, :820); (3) the full hosted CI (rebuild-public both OS including the cumulative b-package --ci, C font transport, shared-preflight, pipeline) green at the exact head; the PM-seat protected runs (scene.test.mjs build cell and anything the guard stops) pass/fail only; (4) one Fable read of the whole change set; (5) an owner-data check: a store with the owner's real-shape history (the fresh port of :901 through the T30 runner, verdict lines only) still opens and Today renders under the new look; (6) then the plain fast-forward to rebuild/t2-client-core, which deploys the slice preview (:816 (2)), and an after-line. NOT done for S12: the sealed private --full run, receipts and VERDICT, the hosted T5b observation chain, paper brief rounds; the standing package stays S11 and the coach ENGINE_REVISION stays M2-S11-NATIVE-LOAD@48574b8d8f252e87 because no engine byte moves. Any engine, data or writer change still takes the full process.

### DECISIONS:905 (2026-10-09, Claude Opus 5.5 PM, closing OWNER RULED + PM RULED)

> OWNER RULED (copy) + PM RULED (route A). (1) Joe, this chat, 2026-10-09, to the PM's question (the new look adds about 320 user-visible strings, most on the coach screen; options: 1 the PM approves them against the design the owner already approved and sends the full list afterwards, 2 the owner reviews the list first, 3 ship without the coach screen first) = "Your rec" = option 1: the PM approves the look's strings against the approved boards and the owner's words of :817/:820, records the approval line the copy lock requires (CL-S12-APPROVAL) citing this line, and sends the owner the full list after release; any string he flags is changed in a later fix. (2) PM RULED, amending :904 (3): the standing CI package becomes S12 (M2-S12-LOOK), an UNSEALED child package of S11 run in --ci mode only (b-package.cjs:3918 treats a missing seal as non-blocking in --ci): S12.json authored by S12-REGEN (333 product paths: 303 carried, 17 edited, 13 new; 40 children = S11's 39 + s12-look), 'S12' in the runner's id list, rebuild.yml's standing step --package S12 and its Today step naming the look's test files (scene, look-cui2, look-cui3, workout-look, coach; :821); needles from a hosted obs/s12 run; no sealed --full run, receipt or VERDICT; ENGINE_REVISION stays M2-S11-NATIVE-LOAD@48574b8d8f252e87 (no rebuild/engine byte moves). Builder STOP-S12FAST-PIN (%TEMP%\s12-fast\S12-FAST-REPORT.md) is the reason: the S11 step pins the 320 S11 product files and the look moves two of them. (3) Open before CI: the S10 writer fence (writer-fence.test.mjs 313/404 at the look head: the look's today-app.cjs assigns workout and the measured write sites moved) is diagnosed next, relocation vs real new write; a real new write or data-path change takes S12 off the fast route (:904 (1)); and CL-COMPOSED (the gym card shows "lb", "reps" and the multiply sign as bare strings the lock cannot pin) is fixed product-side by composing them into whole strings, not by a lock-rule change.

### DECISIONS:906 (2026-10-09, Claude Opus 5.5 PM, closing PM RULED + RECORDED)

> S12-FAST ROUND 2 (builder, Opus, worktree %TEMP%\earned-s12look at 96551fb, uncommitted; report %TEMP%\s12-pkg\S12-PKG-REPORT.md): copy lock 13/13 with the full additions and the CL-S12-APPROVAL line citing :905; 121 of 123 corpus refusals mechanical, fixed in the lock's own files; COPY-LIST-FOR-OWNER.md lists 325 new strings (165 reachable on a screen) for the owner after release. CL-COMPOSED: red first (12/13 on "lb"), green by adding the board's standalone "lb", "reps" and the multiply sign to design.cjs APPROVED_COPY, the same mechanism the card's "example" pill already passes by; no view, template or stylesheet byte moved. PM RULED: accepted (the board shows them as separate elements; composing would change what the athlete sees), subject to the Fable read. WRITER FENCE: 91 failing rows = 80 RELOCATION (no write) + 11 REAL, all from one cause: the look's inline weigh-in form calls model.weighIn (today-app.cjs:909) while the old sheet's call (:1187) is still reachable from Start, a second call site of the same writer with the same data, which the fence's own text names a STOP. PM RULED: one write site: both entries route through ONE weigh-in submit function (the fence's single site); same writer, same payload; no rebaseline exception for a second site; the 80 relocation rows take the reviewed re-measure (fence-remeasure.patch + fence-workout-rename.patch, not applied) only after a Fable read; `workout` in today-app.cjs is a local view variable, not stored state. S12 stays on the fast route because no new data path is added. BUILDER SLIP, RECORDED, NOT EXCUSED (hard-limit breach): the builder's first screenshot attempt ran esbuild over the gym card, which pulled rebuild/engine merge.cjs and migrate.cjs into memory on three runs before its own script refused the bundle; nothing was written, printed or seen; the harness now loads no code. A container restart stopped the builder after round 2; the worktree state is verified by the next builder before any further edit.

### The limits in one place (what this brief binds S12 to)

1. Presentation only. No rebuild/engine byte (the 21 engine paths are declared carried, pre == post, the protected
   five included); no writer change; no data path added or changed; no S11 behaviour changed. The only S11 tests that
   move are sealed cells that encode the OLD LOOK, each red first and named (section 6); none is weakened.
2. Unsealed --ci child. b-package.cjs --ci --package S12 is the standing CI step. Never --full; no
   receipts/S12.json, no VERDICT-S12.md, no rebuild/m4/spec/acceptance-s12-look.json or review-s12-look.json.
3. ENGINE_REVISION unchanged: M2-S11-NATIVE-LOAD@48574b8d8f252e87.
4. Copy additions only under DECISIONS:905 (1) (section 8).
5. Leaving the route: any engine, writer or data-path change, or a new data path, takes S12 off the fast route and
   into the full process (:904 last sentence, :905 (3), :906).
6. A builder seat never opens src/, rebuild/conform/private, any ledger/ folder, any *soak* path, the owner's port
   folders or files, a built app.js, or the contents of rebuild/engine seed, migrate, merge, index, oracle-shim; git
   path exclusions are passed as pathspecs (':(exclude)...'), never through shell quoting alone (:903 (3)).

## 4. Composition (as recorded in git, branch rebuild/c-look-s12-on-s11)

| commit | what |
|---|---|
| 7c79ef1 | the S11 seal tip (sourceBase) |
| 47258c2 | merge of the look (origin/rebuild/c-look-s12-compose-pre 473a38d) onto 7c79ef1; 0 textual conflicts (DECISIONS:903) |
| b1f9da5 | the C-2 fix: the look dresses the Workout screen under S11's native-load wrapper and panel, look files only (SC-19) |
| 96551fb | merge of the chain tip 82eec9b (DECISIONS lines only) |
| dbfc1ee | S12-FAST: S12.json, the runner registration, rebuild.yml, the SC moves, the two defect fixes, the copy lock (33 files) |

S11's rule held at every step: where the look and S11 met (C-2, and the TODAY17-HARDEN hunks), S11's sealed behaviour
won and the look adapted its own files (DECISIONS:903 (2)).

## 5. Product map (S12.json, 334 paths by role)

Authored by rebuild/lanes/b/S12-REGEN.cjs (sha256 34090c2d...; the port of S11-REGEN with two reviewed differences:
(A) the ancestor-release walk, (B) --worktree). Roles: new 14, edited 25, carried 295. :905 (2) quoted the round-1
count (333: 13/17/303); rounds 2-5 added copy-lock.s12-delta.json (new) and moved eight carried files to edited.

NEW (14; pre null):
- .github/workflows/look-gates.yml (the look's own gate workflow)
- rebuild/lanes/b/S12-REGEN.cjs, rebuild/lanes/b/S12-REGEN.test.cjs (215 rows on fake ports)
- rebuild/m3/w7-preview/today/: coach-app.mjs, scene.mjs, browser-check.mjs, design.cjs, screens.template.html
  (the last three existed at the parent unpinned and are declared new under DECISIONS:792)
- rebuild/m3/w7-preview/today/test/: coach.test.mjs, look-cui2.test.mjs, look-cui3.test.mjs, scene.test.mjs,
  workout-look.test.mjs, copy-lock.s12-delta.json

EDITED (25; pre = the S11 pin, post = the S12 bytes):
- .github/workflows/rebuild.yml (standing step --ci --package S12; Today step names the five look tests; S12-REGEN step)
- rebuild/lanes/b/tooling/b-package.cjs ('S12' in IDS and NO_REGISTER_IDS only; runner sha256 11f97d11...)
- rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs (SC-13)
- rebuild/lanes/c/: p3-today-hotfix/today-headline.test.mjs (SC-9), today-split/writer-fence.test.mjs (SC-24),
  ui-port/approved-pin.test.mjs (SC-10), ui-port/sealed-inventory-fence.test.mjs (SC-12)
- rebuild/m3/w7-preview/import/test/: route.test.mjs, refusal-route.test.mjs (SC-20)
- rebuild/m3/w7-preview/measure/test/boundary.test.mjs (SC-13)
- rebuild/m3/w7-preview/today/today-model.cjs (the look's demo-basis hunk, withBoardProposal, C-UI-3 R1, DECISIONS:826)
- rebuild/m3/w7-preview/today/test/: adapter.test.mjs, copy.test.mjs, copy-lock.test.mjs, copy-lock.corpus.json,
  copy-lock-states.mjs, design.test.cjs, food.test.mjs, gss-annex-timing.test.mjs, gym.test.mjs,
  machine-settings-ui.test.mjs, package.test.cjs, problem.test.mjs, setup.test.mjs, view.test.mjs

CARRIED (295; pre == post, byte-identical to the S11 pins):

| area | carried | note |
|---|---|---|
| rebuild/engine | 21 | every engine file incl. the protected five, native-load.cjs, writers.cjs, progression.cjs; never read by a builder |
| rebuild/m4/workout | 81 | 12 modules + 69 tests (incl. the S11 supersession cells) |
| rebuild/m4/import | 27 | the import route incl. production-mapping.cjs (the pin T30 checks) |
| rebuild/m4/spec | 18 | b-ntc carriers, native-load-options.test.cjs |
| rebuild/m3/w6 | 28 | host, local, test, t2-stage.cjs |
| rebuild/m3/w7-preview | 45 | today 22, measure 14, import 7, browser-engine.cjs, build.mjs (the w7-preview one) |
| rebuild/lanes/d | 31 | plan-edit, f2, import-retract, p3-* lanes, b-lom |
| rebuild/lanes/c | 21 | today-split-spike 12, passphrase-normalize 3, ui-port 3, today-split 2, s9-today-carry 1 |
| rebuild/lanes/b | 15 | S10-REGEN and S11-REGEN with tests, 11 tooling files |
| other | 8 | shared-preflight.yml, conform/v4/postfix (1), lanes/tooling/test (1), m1 MOCK.md + 3 approved-2026-09-08 files, m3/setup/port (1) |

Not declared, on purpose:
- Released ancestor paths (S12-REGEN's walk, header (A)): rebuild/m3/w7-preview/today/build.mjs and preview.css
  (released by S9, DECISIONS:786), today-app.cjs and gym-app.mjs (released by S10, DECISIONS:828). They change in S12
  (build.mjs: the scene fix; today-app.cjs: the one weigh-in site) and are held by tests and the writer fence, not
  by pins.
- packages/S11.json (the parent's own execution pin; byte-identical), receipts/S11.json, VERDICT-S11.md.
- Execution pins superseded: none. coverage: inherited {}, moves {}, successors null, superseded null.
- This brief (cited by sha in brief.sha256, not a product path; outside S12-REGEN's scope).

## 6. Children (40)

S11's 39 children, names and argv byte-equal to packages/S11.json at 7c79ef1, plus s12-look, the package's own child
(Y1 own-child rule; S12 is in NO_REGISTER_IDS and registers no D-id). The S11 supersession children stay: they re-check
the S11 engine composition against S10, and S12 moves no engine byte.

| # | child | # | child | # | child | # | child |
|---|---|---|---|---|---|---|---|
| 1 | today-17 | 11 | d-capture-start | 21 | reference-closure | 31 | s11-sup-inherited-carriers |
| 2 | measure-hermetic | 12 | food-live-save | 22 | release-object | 32 | s11-sup-defect-witnesses |
| 3 | s4-real-day | 13 | w7-import | 23 | today-carry | 33 | s11-sup-writers-differential |
| 4 | a0-journeys | 14 | w6-host-seams | 24 | passphrase-normalize | 34 | s11-sup-second-gate |
| 5 | d-plan-edit | 15 | w6-local-source | 25 | w6-local-import | 35 | s11-engine-files-differential |
| 6 | m4-import | 16 | d-replay-all | 26 | f2-land | 36 | s10-copy-lock |
| 7 | m4-import-production | 17 | d-port-admission | 27 | epp-proposed-pick | 37 | native-load-fc12 |
| 8 | d-import-retract | 18 | d-real-shape | 28 | d-epp-2-capture | 38 | w6-local-source-commit |
| 9 | d-admission-swap | 19 | sealed-inventory-fence | 29 | today-split-fence | 39 | w6-local-today-journey |
| 10 | d-replay-measure | 20 | ui-pack-pins | 30 | s11-sup-source-carriers | 40 | s12-look (new) |

s12-look runs `--test --test-reporter=tap` over today/test/scene.test.mjs, look-cui2.test.mjs, look-cui3.test.mjs,
workout-look.test.mjs and coach.test.mjs (each role new). All 40 needles are PENDING (STOP-S12-NEEDLES) until one
hosted obs/s12-* run records both OS green and the fill tool writes them (section 11). Expected moves against S11's
needles: today-split-fence '# pass 404', sealed-inventory-fence '# pass 63', s10-copy-lock '# pass 13', today-17 moves
with the copy lock and the moved cells; s12-look is a new '# pass N' (or '# tests N' if a platform-keyed skip shows).

## 6A. The SC moves (every sealed cell the look touches, by id)

The rev8 SC list (S12 brief draft rev8, %TEMP%\s12-rev8, DECISIONS:903 (2)) is the id space; SC-21 to SC-26 are ids
proposed during S12-FAST for families rev8 did not foresee, and accepting this brief by sha rules them in (D-S12R5-4).
Rule for every row (:904 (2)): the cell is red at the composed head first, the red is logged, the move is named, and
the moved cell asserts at least what it asserted before, with the same source of truth (the engine, the model, the
pinned design). "Red first" cites the log that holds it (builder logs under %TEMP%\s12-pkg, PM-seat runs s12-pmrun1/2).

| SC | cell(s) | what it protects | S12 status |
|---|---|---|---|
| SC-1 | today/test/problem.test.mjs R10 (x2) | every class the control and its box use comes from the approved stylesheets; the look keeps .page (D:820 R1) | moved; red 125/134, green 130/134 guarded (4 guard rows), food+problem+setup+msui 414/414 at the PM seat (pmrun3) |
| SC-2 | gym.test.mjs A2 cells | the gym card shows the model's plan line, set count, "Log L x R", "Start set N" and one training count, nothing invented | moved; red 60/65, green 65/65 |
| SC-3 | gss-annex-timing.test.mjs D-GSS-G2 | the GSS annex timing holds (expectedLoad '2.5', reps '', effort) with the stepper gone: step typed, every expectation kept | moved; red 2/3, green 3/3 |
| SC-4 | gym-check.mjs | (not a sealed cell: in no product map or child argv at 9849bc7 or 7c79ef1) | no move |
| SC-5 | view.test.mjs coach screen (:301-303, :529-531) | with no live coach, the Coach screen invents nothing: no answer before asking, no digit, three example prompts, C-61 "There is no live coach in this build." + "Nothing changed." | moved (R5); red pmrun1/2, green pmrun3 |
| SC-6 | package.test.cjs H18, H18b, :254 (build REQUIRED_INPUTS) | the build refuses without each required input | predicted red, not red at the PM seat (pmrun1/2 package red only at :53 = SC-25); no move |
| SC-7 | copy.test.mjs gym reason (:571); the copy lock (with SC-17/18) | the engine's own first prescription reason is on screen, equal to plainOrDrop(reasons[0]); every shipped string is locked | moved (R5); red pmrun1/2, green copy 39/39 |
| SC-8 | rebuild.yml Today step; h3-clean-init H3/13 | every look test file under today/test/ is executed in hosted CI (the 13-name rule, DECISIONS:186, :821) | moved; H3/13 green, h3 14/14 at the PM seat |
| SC-9 | today-headline.test.mjs S1; view.test.mjs x3; adapter.test.mjs assertHeadlineLaw | Today's instruction is the engine's own move: with the demo basis carrying one board proposal (D:826), the cells assert that card, then compare with the reference engine over the same state with proposals set aside (D:534 (a)) | moved; red 8/9 and pmrun1/2, green 4/4, view 24/24, pkg 91/91 |
| SC-10 | ui-port/approved-pin.test.mjs; design.test.cjs census | the approved design is pinned file by file by sha256 (ten files), and the headline census knows every engine non-title source (native-load.cjs added, nothing removed) | moved; red 46/47 and 14/15, green 47/47 and 15/15 |
| SC-11 | pack-pin.test.mjs P rows | the 2026-09-18 pack bytes | no P row used; pack unchanged; 74/74 |
| SC-12 | sealed-inventory-fence.test.mjs row (40) | the S12-REGEN path-boundary step exists in rebuild.yml with the not-cancelled condition | moved; red-first planted (fence40-redfirst.log); THE REAL ROW reads the committed diff, 62/63 before the commit, '# pass 63' expected |
| SC-13 | PUARS F6 (IDS 16, NO_REGISTER 12 literals); five CHILD_SPECS lists (boundary, food, machine-settings-ui, problem, setup) | the runner's closed id lists and their mirrors cannot drift silently | moved; red 16/17, green 17/17 |
| SC-14 | view.test.mjs:517-520 | every unwired entry point says so on Today's face: the Talk row "Talk through today's plan" (U+2019 in the product string), marker, .sub, NOT_WIRED and the 120-char window unchanged | moved (R5); green view 24/24 |
| SC-15 | design.cjs APPROVED_COPY row "Ask your coach" | a declared approved string is removed only by declaration | no S12-FAST move; the cells that read the row are green at dbfc1ee (design 15/15, copy-lock 13/13) |
| SC-16 | view.test.mjs:526-528 | the Recovery row "Recovery check in" (board word), still wired-checked | moved (R5), same test as SC-14 |
| SC-17 | copy-lock.test.mjs CL-S11-DELTA | the S11 delta still proves itself, now on the S11 corpus rebuilt byte for byte from the S12 delta | moved with the copy lock; 13/13 |
| SC-18 | copy-lock.test.mjs S11_REOWNED 'Set ' row | the owner count of "Set " literals | re-measured with the copy lock; 13/13 |
| SC-19 | (no sealed cell) the Workout look under S11's native-load mount (scene.mjs, preview.css, workout-look.test.mjs) | S11's mount wins; the look adapts: same chassis, same cascade as the plain mount, panel above the stack | fixed at b1f9da5; six cells red 20/25, green 25/25 (Fable C2 l1) |
| SC-20 | import/test/route.test.mjs settle(); refusal-route.test.mjs P3-X9 | w7-import waits on the real completion signal, not a 40 x 1 ms budget (D-W7IMPORT-FLAKE-1); every assertion byte kept; 30 s ceiling added | red under a 20 ms injected IndexedDB delay (exit 1), green delayed and plain (exit 0), %TEMP%\s12-pkg\flake |
| SC-21 (proposed) | food N1.14 x2, D2.3/D2.4, D2.R2; problem N2-16, N2-18, S6C.6d; setup S9, S23b/M16; machine-settings-ui S12 x2, D2.1/D2.2 | runtime copy is preview-owned and absent upstream, or adopted verbatim from its one pinned source; classes bind to the pinned legacy sheets plus the pack (the old check read an undefined html field and had gone vacuous) | moved; red then green on every guard-free row; 414/414 at the PM seat (pmrun3) |
| SC-22 (proposed) | machine-settings-ui.test.mjs S2..S9, D2.2 | the stored machine settings shown are exactly the stored ones (row title, stored order, latest wins, nothing borrowed) | moved; red 50/66, green 65/66 guarded (S14 = guard), 414/414 at the PM seat |
| SC-23 (proposed) | copy-lock-states.mjs set.count | the lock's synthetic active set matches the model ("Set N of M", not "of undefined") | moved with the copy lock |
| SC-24 (proposed) | writer-fence.test.mjs (S10) | three declared Today seams and ONE weigh-in write site; 89 relocation rows re-measured, TODAY_APP_MODEL_SITES 32 -> 33 (the inline form's model.OUT_OF_RANGE read) | moved; red 392/404 (site count 4 !== 3), green 404/404 |
| SC-25 (proposed) | package.test.cjs:53 approved pin | the four 2026-09-18 stylesheets by file and sha256, re-hashed from disk, a one-byte tamper refused (APPROVED-PIN FAIL) | moved (R5); red 4 !== 2, green pkg 91/91 |
| SC-26 (proposed) | view.test.mjs:618 headline fitter | engine headline text is never truncated or ellipsised; the fitter's 47/33 px range cannot reach the approved h1.greeting (52px) | moved (R5); green view 24/24 |

No assertion, value, tolerance or deadline is weakened anywhere (Fable FAST l1 (4), R5 (b)); SC-20 adds a deadline
where there was none. The per-cell red and green logs are listed in S12-PKG-REPORT.md, R4-REPORT.md and R5-REPORT.md.

## 7. The real defects fixed

1. The built bundle carried export lines (browser SyntaxError). build.mjs appended scene.mjs raw after esbuild's
   bundle, so its two top-level `export function` lines landed mid-bundle, and coach-app.mjs and scene.mjs both
   declared a top-level `function scrollFades`: a parse error as a script and as a module, i.e. in a real browser too
   (Fable R5 (a) reproduced both). Fix: build.mjs classicScene() strips `export ` from top-level declarations,
   refuses the build (SCENE-MODULE-SYNTAX) if any import/export line is left, and wraps the scene in its own strict
   function scope; scene.mjs installs only where the page has requestAnimationFrame (every browser). Red: copy.test
   A1 and the launch guard (`Unexpected token 'export'`, pmrun1/2); green: copy 39/39, scene 7/7 (pmrun3).
2. A second weigh-in write site. The look's inline weigh-in form called model.weighIn beside the Start sheet's call,
   which the S10 writer fence refuses as a fourth decision (DECISIONS:906). Fix: one `submitWeighIn(raw)` in
   mountToday, called by both entries; same writer, argument (`raw === "" ? raw : Number(raw)`), validation, refusal
   copy (WEIGH_FAILED) and gesture guards; `model.weighIn(` occurs once. Red: writer-fence 392/404 (site count
   4 !== 3) and look-cui3 13/15; green 404/404 and 15/15; view.test "S12 R3" (each entry stores one op of one shape)
   green at the PM seat. The statusLine local `workout` became `plan` and the proposal face field `undo` became
   `changeAnswer` (local objects, nothing stored).

Also fixed on the way, not a defect in sealed code: the C-2 composition (SC-19) and the w7-import race (SC-20).

## 8. The copy approval

Owner, DECISIONS:905 (1): option 1, "Your rec": the PM approves the look's strings against the approved boards and the
owner's words of :817/:820 and sends him the full list after release; any string he flags is changed in a later fix.
How it is held:
- copy-lock.test.mjs CL-S12-APPROVAL = 'DECISIONS:905' (the owner's words quoted in the cell).
- copy-lock.s12-delta.json (sha256 33d1c3cd...): 325 added, 20 removed, 102 changed against the sealed S11 corpus;
  CL-S12-DELTA proves corpus = S11 corpus + delta both ways and rebuilds the S11 corpus byte for byte; corpus
  CORPUS_SHA256 70efc98d...; copy-lock.test.mjs 13/13.
- CL-COMPOSED: the board's standalone "lb", "reps" and the multiply sign (U+00D7) are declared in design.cjs
  APPROVED_COPY, the mechanism the card's "example" pill already passes by; no lock rule changed. :905 (3) asked for
  composed strings; :906 accepted the declaration subject to the Fable read; Fable FAST l1 (5) accepted it (the
  figures are typed boxes, so no whole string exists on screen to lock).
- For the owner after release: %TEMP%\s12-pkg\COPY-LIST-FOR-OWNER.md (sha256 832768ca...): 325 new strings, 165 that
  can be on a screen (Today 29, Workout 13, Coach 93, coach example answers 29, scene 1), 160 internal listed apart.

## 9. Evidence held so far (at dbfc1ee unless named)

- Builder seat, guarded (NODE_OPTIONS --require %TEMP%\s12-c2\guard.cjs, TZ=America/New_York,
  MEASURED_TEST_NOW=2026-09-03): writer-fence 404/404, copy-lock 13/13, design 15/15, gym 65/65, workout-look 25/25,
  look-cui2 5/5, look-cui3 15/15, coach 12/12, native-load-panel 103/103, approved-pin 47/47, pack-pin 74/74,
  today-headline 4/4, PUARS 17/17, S12-REGEN.test 215/215, S11-REGEN.test 201/201; S12-REGEN dry: 334 paths,
  0 entries would change, PENDING census 41 ($.brief.sha256 + 40 needles).
- PM seat, unguarded (s12-pmrun3): view 24/24, copy 39/39, package+adapter+catalogue 91/91, scene 7/7,
  h3-clean-init 14/14, food+problem+setup+machine-settings-ui 414/414, boundary 7/7, import 17/17, look 72/72,
  copy-lock 13/13. SC-20 red-first: %TEMP%\s12-pkg\flake red-delay20 exit=1, green-delay20 and green-nodelay exit=0.
- Local `b-package.cjs --ci --package S12` (%TEMP%\s12-post\ci.log, B PACKAGE lines): SPEC OBSERVED S12.json
  b73fbf1e..., runner 11f97d11..., status PROPOSED, 334 product files; PARENT BOUND S11; POSTFIX M2-S12-LOOK
  REVIEW-PENDING mode=--ci; PRODUCT IMPLEMENTED 39 post / 295 carried / 0 drift; AUTHORITY owner :60 and contract :49
  found, theme NULL, brief acceptance NULL; LAWS 45/45 executed (register baseline; no D-id); then FAIL
  CHILD-NEEDLE-NOT-A-TERMINAL-LINE, the expected pre-needle stop (every needle PENDING).
- Fable reads, each ACCEPT WITH NAMED DEBTS: REVIEW-S12-C2-FIX-FABLE-l1 (71f3b63b, the C-2 fix);
  REVIEW-S12-FAST-FABLE-l1 (0ef79bc8, rounds 1-4: the whole uncommitted change set at 96551fb);
  REVIEW-S12-FAST-R5-FABLE-l1 (f93a5e29, round 5 + R5b); REVIEW-S12-OBS-FABLE-l1 (6b7a9ad6, the obs/s12 needle
  workflow and tools, at dbfc1ee). This brief itself has not been read by Fable.

## 10. Named debts (every Fable read so far, and the spec's own)

From REVIEW-S12-C2-FIX-FABLE-l1:
- D1 design: with the full native-load panel open, the Workout body shrinks to 206px (390x844) / 171px (360x780); all
  reachable, the stack never moves; the 45% cap and the panel's place are a design choice for the owner.
- D2 test: the cascade-equality cells are one-directional (an S11-only declaration would not be flagged).
- D3 gate: the pack's gate.py / statesheet.py probes JS_FIT, JS_MARGIN, JS_SAFE, JS_GAPS fall back to the host under
  S11's mount and PASS TRIVIALLY; measure whether the gate build mounts through open(), then rule (plain-chassis gate
  or a look-lane supplement); never edit the pack or S11's mount for the gate.
- D4 contrast: "Check next weight" has no .links scrim; Dawn unmeasured.
- D5 design.test census lacked native-load.cjs (paid by SC-10); gym/copy-lock reds were SC moves (paid).
- D6 PM-seat runs (scene build cell paid in pmrun3; the exact-head look gate at three sizes on both OS still owed).

From REVIEW-S12-FAST-FABLE-l1:
- D-S12-ANCESTOR-REPIN: `--package S11` and older refuse RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER with the S12 runner
  (no ancestor re-pin on the fast route; `--package S11` stays reproducible at 7c79ef1).
- D-S12-PMSEAT-UNMEASURED: paid by pmrun3 and the flake logs (section 9), except THE REAL ROW (after the commit).
- D-S12-CI-PRE-NEEDLE: the S12 standing step is red until the needles, THEME and BRIEF lines; green at the exact head
  first.
- D-S12-COPY-BULK: one approval constant covers 325 strings (S11 cited a line per string).
- D-S12-APPROVED-COPY-SUBSTRING: APPROVED_COPY's upstream check is a substring test, trivially met by "lb"/"reps"/x.
- D-S12-SC21-LEGACY-CSS: class checks accept the pinned 09-08 legacy sheets as well as the 09-18 pack until the legacy
  sheets leave LEGACY_STRUCTURE.
- D-S12-MSUI-1 (builder; also S12.json note [9]): the machine row joins name and value with a space.
- D-S12-MSUI-2: shownSettings() returns '' when the sub line is not SETTINGS_OPEN; the empty-expectation cells take
  their teeth from the companion asserts.
- D-S12-GSS-G2: the D-GSS-G2 'stepper' variant is now typed load + effort chip.
- D-S12-NOTE2-TEXT: S12.json note [2] says "red first at 313/404"; the weigh-in's own red is 392/404 (text only).
- D-S12-REGEN-WORKTREE: --worktree skips the disk-vs-HEAD check by design; the committed truth is the dry run without
  --worktree after the commit printing 0 changes.

From REVIEW-S12-FAST-R5-FABLE-l1:
- D-S12R5-1 SCENE-A1-SKIP: with the rAF guard, A1 and the launch guard never reach installScene; the scene's runtime
  proof is browser-check.mjs (not in the PM seat list) plus scene.test's unit cells.
- D-S12R5-2 SC7-WHY-LINES: reason lines after the first sit behind Why? and are not dash-checked on screen by SC-7.
- D-S12R5-3 FITTER-CELL-TIMEOUT: a per-test timeout cannot pre-empt a synchronous spin; the file-level
  --test-timeout is only in pm-rerun.cmd, not in rebuild.yml.
- D-S12R5-4 PROPOSED-IDS: SC-25 and SC-26 (and SC-21..SC-24) are proposed ids; ruled in by accepting this brief.
- D-S12R5-5: PM-seat items that turn only after the commit: THE REAL ROW, the dry REGEN without --worktree,
  b-package --ci --package S12, the pre-needle CI red.

From REVIEW-S12-OBS-FABLE-l1:
- D-S12OBS-1: the driver's tail denylist is the runner's (conform/private, golden, live.json, ledger/), not src/, soak,
  EarnedPort or app.js: a red in-root child discloses exactly as rebuild.yml's own log does.
- D-S12OBS-2a: the fill does not read '# skipped N'; the PM reads child 40's grammar lines before --write.
- D-S12OBS-2b: the fill does not refuse a non-PENDING needle and does not bind artifacts to the obs commit or run id
  (the record does).
- D-S12OBS-3: driver comment line cites are S11-era (12 lines off); copyCheck is content-based.
- D-S12OBS-4: the one-file obs branch rule and the later preflight (no s12-observe.yml in any S12 head) are PM
  practice, not enforced by a file.
- D-S12OBS-5: the 60-minute sizing is S11's plus one child; the per-child wall measures it.
- D-S12OBS-6: needles.cjs, port.cjs, port-test.cjs in obs\ were not reviewed (not part of the obs commit).

Carried in S12.json note [9]: D-W7IMPORT-FLAKE-1 (SC-20 lands the waits; it closes only with the PM-seat red-first
record, now held, and a both-OS hunter run of the s11-w7hunt.yml shape, still owed), D-CUI3-RECORD, D-LOOK-CHASSIS,
D-LOOK-PROOF, D-LOOK-STATES, D-NODE-MODULES-HOME (rev8 section 3a, unchanged). Recorded slips: the builder esbuild
read (:906) and two early whole-tree git greps in round 5 (R5-REPORT, exclusion pathspecs still applied).

## 11. What remains on the fast route (in order; DECISIONS:904 (3)-(6), :905 (2))

1. THEME line and BRIEF ACCEPTED BY SHA line (cowork) on rebuild/t2-client-core; then S12.json authorizations.theme,
   brief.sha256, brief.acceptedLedgerLine and status BRIEF-ACCEPTED filled from those exact line bytes, committed
   together with this brief (the runner refuses 'Brief bytes' while this file exists and brief.sha256 is PENDING);
   S12-REGEN dry, --write --receipt-line 896, dry (0 entries).
2. The obs/s12 needle run (one-file branch from the S12 head, both OS green), the fill (dry, then --write), REGEN
   again (0 product changes, PENDING census 0), and the sealed-inventory fence THE REAL ROW green after the commit.
3. Full hosted CI green at the exact head: rebuild-public on ubuntu and windows with the S12 step ending PUBLIC CI
   EVIDENCE PASS (not CI REVIEW-PENDING), C font transport, shared-preflight, pipeline.
4. One Fable read of the whole change set at that head (the reads above cover it in parts; this brief is unread).
5. The owner-data check of :904 (5): the fresh port of :901 through the T30 runner, verdict lines only, still opens and
   Today renders under the new look.
6. The plain fast-forward to rebuild/t2-client-core (slice preview deploys, :816 (2)), the after-line, and the copy
   list to the owner (:905 (1)).

## 12. What a later sealed S12 would still owe (not done on this route)

- A sealed private --full run of M2-S12-LOOK, the acceptance artifact rebuild/m4/spec/acceptance-s12-look.json and its
  review, the cowork POSTFIX-ACCEPTANCE M2-S12-LOOK receipt line, receipts/S12.json and VERDICT-S12.md (:904 NOT
  done list).
- Its own GATE-SUPERSESSION token line and zero-engine-change mirrors for the nine gates S11 retired under :873
  (S12.json note [4]; rev8 sections 3c and 3c-A); S11's token line is never S12's authority. Without it a --full run
  of this spec re-executes those gates and refuses.
- The ancestor re-pin (D-S12-ANCESTOR-REPIN) or a ruling that older ids stay reproducible only at their own seals.
- The hosted T5b observation chain and the paper brief rounds the full process uses.
- The gate leg (C2 D3) named in the artifact, with the four trivially passing probes either measured or ruled.
- A ruling on whether the coach ENGINE_REVISION moves (S11 moved it once at its seal; S12 moves no engine byte).
- Any engine, writer or data-path change is out of S12-FAST entirely and starts its own full-process package.

## 13. Acceptance

This brief is accepted by its sha256 on a cowork line on rebuild/t2-client-core that names M2-S12-LOOK and this path
and ends with the clause separator and ACCEPTED (b-package.cjs spec(): claim(..., 'cowork', 'brief acceptance'),
status BRIEF-ACCEPTED, line includes packageId and brief.file; authority() finds the exact line bytes on
refs/remotes/origin/rebuild/t2-client-core under role cowork). The THEME line for M2-S12-LOOK is the line before it.
Neither authorises a PASS word by itself; under route A no PASS word is sought, only PUBLIC CI EVIDENCE PASS.
