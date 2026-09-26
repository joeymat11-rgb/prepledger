# REVIEW-S10-CLAUDE-FINAL-l1 - the separate Claude final for M2-S10-TODAY-SPLIT (runbook T6f, prep debt D-SP-5)

Reviewer: Claude Opus 5.5, separate hand (wrote nothing in S10, did not review T6f). 2026-09-25.
VERDICT: ACCEPT WITH NAMED DEBTS (D-CF-1..3 below; none blocks T6g). Nothing shipped at 2c4d24e is outside a grant
of the brief of record (sha256 e5aabac9, DECISIONS:831) or of a ruling that brief carries (:628, :631, :785, :792, :816).

Method: STATIC ONLY. git show/diff/ls-tree/log/grep with explicit paths after -- (protected five excluded by pathspec,
never shown, never hashed), node fs/crypto over git blobs and the disk S10.json. No test, child, runner, b-package, REGEN,
T6-apply.cjs or port.cjs executed; nothing committed or pushed; nothing written under W. Rules file read whole (sha256
51706c33, matches). DECISIONS read at 194f03f lines 626, 628, 631, 784, 785, 792 and 828-831 only.
Helpers (read-only, ASCII, LF): %TEMP%\s10-seal-prep\cfinal\{h,spec,xref,lines,move,argv,claims}.cjs.

## 0. State measured
- W HEAD 2c4d24e7 (parent f4125cdb); CHAIN refs/remotes/origin/rebuild/t2-client-core = 194f03fd (831 ledger lines).
- git status --porcelain -- rebuild .github: only ` M rebuild/lanes/b/tooling/packages/S10.json`.
- S10.json on disk sha256 fbb4a490...7bc4 (106863 B, LF); committed blob baa1c660. Brief blob at 2c4d24e
  e5aabac9809f... 81810 B, ASCII, LF; L4 (:831) carries that sha and "81810 bytes".
- :828-:831 lineSha256 recomputed: 6f6b5410 / d8884ec6 / c497e941 / 1fa5309c; release.rulingLineSha256,
  coverage.superseded.rulingLineSha256, authorizations.theme and brief.acceptedLedgerLine all equal (lines byte-equal,
  role cowork, ledgerLine 830/831). status BRIEF-ACCEPTED, packageId M2-S10-TODAY-SPLIT, release keys [rulingLineSha256].
- Nothing outside rebuild/ and .github changed d7f6540..2c4d24e (name-status with src and *soak* excluded: empty;
  `diff --quiet -- src` and `-- app.js`: unchanged).

## 1. Moved writers (Today split) and the release of today-app.cjs / gym-app.mjs
- Byte custody (git ls-tree): at 2c4d24e today-app.cjs 57b7ad2c, today-lanes.cjs d66a80ef, today-readings.cjs 0934b383,
  today-model.cjs 2417b081 are IDENTICAL to the accepted split base b35a48e3 (:662), and gym-app.mjs d8ab53aa,
  gym-settings-lane.mjs 40d59ee9, machine-settings-view.mjs c8131055 are IDENTICAL to the accepted GSS input 66d32530
  (:765). The S10 integration adds NO hunk to any view or writer file; the brief's 2.1 grants exactly these inputs.
- Parent custody: at d7f6540 today-app ea98aef6, today-model 6a146ff9, gym-app 48bf0531 = sourceBlobs.s9 (brief 3.1).
- My own move check (trimmed-line multiset, old {today-app, today-model}@d7f6540 vs new {today-app, today-model,
  today-lanes, today-readings}@2c4d24e): 3124 -> 3516 lines; 179 code lines leave, 394 code lines arrive. Every one of
  the 179 departing lines reappears among the arrivals re-spelled only as a declared rewrite: bare state reads ->
  facade.X() getters (37), writer/boot calls -> hooks.X(), addEventListener -> hooks.listen, render/mountToken inside the
  seal -> painter.repaint/painter.token, lastMessage assignments -> setMessage(). The rest of the arrivals are the
  interface (painter, facade, hooks tables, both Object.freeze'd), the gesture guard (WRITER-OUTSIDE-GESTURE on
  recordIntake and recordSleep only) with its WeakMap listen shim, the boot seams (bootFoodDays re-acquires
  options.sleep, the RESIDUAL DEVIATION the file itself states), createReadingsWriter, requires and comments. No
  departing line changes what is stored, when, or under which refusal. This is the accepted b35a48e3 shape (:626 records
  Astra's byte-exact blind replay of the 34 regions); nothing S10 added.
- Release (brief 4.3 RELEASE GRANT, L1 :828): sha256 of d7f6540:today-app.cjs = efaf6c0d... and of gym-app.mjs =
  4c8ba0c9... = S10.json pre = S9 artifact post (today-app role edited, gym-app role carried at S9); post null; neither
  is an S9 executionPins key nor any of the 91 S10 child argv targets (T6e step 7, re-derived from the disk spec by my
  argv.cjs). today-model.cjs is not released: no S9 product key, declared new (notes[5]) as the brief says.
- build.mjs (S9-released, undeclared, as brief 4.3 requires): d7f6540 -> 2c4d24e adds exactly three REQUIRED_INPUTS
  (today-readings.cjs, today-lanes.cjs, gym-settings-lane.mjs) with comments, 48 -> 51; package.test.cjs pins 29 today/
  and 51 total. Granted by brief 4.1 "Released build composition ... final required-input list measured".
VERDICT 1: the moved writers and the release are what the brief grants; nothing extra.

## 2. GSS writer logic (66d32530)
- gym-settings-lane.mjs read whole (376 lines) at 2c4d24e. recordSettings: machineFromDraft (empty rows dropped, null on
  an empty draft -> 'invalid empty' before any save), the producer's own gate machineOf via acceptable() ('invalid
  shape'), then refuses 'ignored stale|unavailable' unless the live editor token and lift still match, then ONE
  settingsLane.save; 'saved' only on result.ok === true, then a forced re-read. Gym subjects (logSet, finish, undo,
  forget) go only through sealed bindings: one unique control per action, refusal depth 0, consumed-event set, context
  equality, busy flags (settings independent of the shared workout slot), revoke on leave/lift/phase change.
- This is the :628 ruling set as built (G-R1 helpers relocated into the seal; G-R2 four durable + one transient;
  G-R3 depth-zero rule, no isTrusted; G-R4 open resolves boolean and api.lane stays the ONE pinned passthrough;
  G-R5 hooks.paint wraps drawing). Named residues present exactly as ruled: api.lane() returns the live host (with save)
  = D-GSS-PASSTHROUGH; D-GSS-TIMER; continuedLogBinding's unused capturedEditor (31c88922 N1, "may be removed next time").
- machine-settings-ui.test.mjs (three-way merge): its producer teeth moved with G-R1 and got STRONGER (the seal must
  call machineOf, the view must NOT; the released card must NOT name the host import). No tooth deleted.
- gss-annex-timing.test.mjs differs from 66d32530 only by the fake-indexeddb import path (createRequire from w6),
  the minimal fix :792 allows. The other four gss-annex files are byte-equal to 66d32530.
VERDICT 2: the GSS logic shipped is byte-for-byte the accepted input; no S10 hunk touches it.

## 3. Released exception hunks and the S-R30 re-assertion (brief 4.2, 5; :626 (3)(4); IR STOP 6 "a reviewer's final
## assertion is still owed" - this section is that assertion)
- The released view bytes are the accepted inputs (section 1), so every released exception-site hunk at S10 is a hunk
  the split (b35a48e3; Astra blind d3e27f44, Claude 324b994a) or GSS (66d32530; Claude l1 50e2886, l2, l3 31c88922)
  already carried to a final. Spot counts at 2c4d24e: gym-app.mjs model.start( 1 (paint's one pinned start),
  facade.lane( 0, api.lane 1, addEventListener 0; today-app.cjs addEventListener 0, model.start( 0.
- Writer fence b35a48e3 -> 66d32530 (-U0, every removed line read): all removals are gym rows and each maps to :628 -
  GYM_DECLARED_SEAMS 6 -> 1 with the five seams sealed (G-R2), the three facade.lane() lane rows -> api.lane (G-R4),
  LISTENERS_OUTSIDE_SHIM gym 19 -> 0 (G-R3), the S-R29 laxity row rewritten on purpose by the ticket that seals
  recordSettings, the settingsSaving RED re-planted, the gym-lane import row (G-R1 import of the producer). No
  today-app exception row (32 model sites, weigh-in, the food/sleep hooks, the twelve copy values) is touched.
- Writer fence 66d32530 -> 2c4d24e (S10's own, 17 lines): (a) the three dead LOOK_EDITS keys for the removed
  facade.lane() spellings dropped WITH a new red-first row (5ad69a7 red, 656b793 drop) - brief 4.2 "drops them with a
  row, never silently"; (b) the RECORDED RESIDUE 'released helper parameter mutation' anchor moved to
  gym-app.mjs:278 `const paintedDraft = settingsDraft;` (9642243). I measured the old anchor: 0 occurrences in gym-app at
  2c4d24e (= 66d32530), so the row planted nothing (IR item 6: planted() failed it red, 403/404). It is a residue row,
  not one of the four :626 (4) sites; :792 routed it "to review first" and IR:43/51 plus Fable integration l5 read it.
ASSERTION: at 2c4d24e no today-app exception row changed, each gym row change matches its :628 ruling, and S10's two
fence hunks are the brief-4.2 tidy-up and a non-S-R30 residue re-anchor. No new exception, count or acquisition site.

## 4. S10.json declarations (every non-carried product path)
- xref.cjs over all 302 product entries vs git bytes: every carried entry pre == post == S9 artifact post and unchanged
  d7f6540..2c4d24e; every edited entry pre == S9 post == sha256 at d7f6540 and post == sha256 at 2c4d24e; every new
  entry has no S9 product key, pre null, post == 2c4d24e bytes; released as in section 1. 0 flagged.
- 121 paths changed d7f6540..2c4d24e under rebuild/.github: 72 are declared non-carried; the 49 undeclared are
  DECISIONS.md, review/report/spec Markdown, the brief, S10.json itself, S10-FINAL-CENSUS.tsv (D-SP-2), COPY-LOCK.md,
  and build.mjs (S9-released). No changed product-scope code file is undeclared; no carried file changed.
- Grant per non-carried class: engine four (brief 7.2, exactly today.cjs, writers.cjs, proposed-pick.test.cjs,
  PROPOSED-PICK-REPAIR-REPORT.md; no fifth rebuild/engine key); view siblings and machine-settings-view (4.1, :628
  G-R1); today-model/engine-capture and the other five parent-unpinned paths declared new (:792, notes[5]); tests of
  4.2's known set (food, problem, setup, package, machine-settings-ui, measure boundary, writer fence, five gss-annex,
  copy-lock five, 8 answer 8); runner registration (b-package.cjs: IDS, NO_REGISTER_IDS, CHILD_ROOTS additions only,
  +18 -3; 4.3 and :792); H3, S3..S8 and S9 specs: runnerSha256 re-pin only (one line each; S9 superseded-by-child,
  notes[6]); rebuild.yml: the standing step renamed to S10, the Today step names copy-lock + five gss-annex files, M4
  names engine-pins-unprotected, four new E/C/B steps with the :627 P-S9-3 `if: ${{ !cancelled() }}` shape (:792),
  no existing condition changed; pinned-unchanged and sealed-inventory-fence tests: registration rows (section 9
  mirrors); today-split-spike instruments and PART2 files (Track A, 6.1); s10-sup-* and s10-engine-files-differential
  (L2 "its own evidence"); S10-REGEN.cjs/.test (:815).
VERDICT 4: every non-carried path has a granting line; nothing undeclared ships code.

## 5. The two EPP clauses, D-EPP-2, the import-mapping re-pin and the page-bundle counts
- rebuild/engine/today.cjs (d7f6540 -> 2c4d24e, one line, :97) and writers.cjs (one line, :227) each add exactly
  `x.state !== "PROPOSED"` to the debut/unlock queue find - the exclusion pickStructural already has at today.cjs:55
  (read) - and nothing else. That is :631 O-1a verbatim ("ONE CLAUSE in each of two sealed files, today.cjs:97 and
  writers.cjs:227 ... and nothing else in the engine"). Blobs e858d4df / 9ecb2cdd = the EPP input 0d38b8e (notes[3]).
- rebuild/m4/workout/engine-capture.cjs: one line, :69, the same exclusion in the capture's selected-move filter; blob
  b9509120 = the D-EPP-2 input 5a953d5. Grant (b), :784 "Yes" read at :785 as "D-EPP-2, engine-capture.cjs:69-70". It is
  not a rebuild/engine byte, as brief 7.2 says.
- Pin mirrors of those three moves, all re-pinned to the S10 posts: local-source-profile.cjs SOURCE_PINS today.cjs
  (:792 "S10 owns the local-source-profile.cjs:16 today.cjs re-pin"); s3-portable-sources.json (today.cjs, writers.cjs,
  local-source-profile.cjs, engine-capture.cjs); configured-history-candidate/run.cjs (engine-capture.cjs). git grep -l
  at 2c4d24e (pathspec rebuild .github, protected five, ledgers, soak and conform/private excluded) for the old digests
  685f6e1e, 0522797d, af5a187e, 309c75d8, 2de07820 lists only historical records: DECISIONS.md, author reports, review
  evidence and custody JSON, and the sealed ancestor specs, receipts and artifacts. No live code pin was missed.
- production-mapping.cjs: one comment line plus ENGINE.treeSha256 af5a187e -> 9c135054 (ENGINE.sha256 dd653bc1,
  schemaV, path unchanged). P3-M1 in production-mapping.test.cjs asserts treeSha256 == Port.engineDigest() of the real
  engine, so the value's only proof is the m4-import-production child ("# pass 28", PM seat). rebuild/engine and
  rebuild/coach are unchanged 92be4e3..2c4d24e (diff --stat empty), so the PM's 92be4e3 measurement applies (D-CF-3).
- page-bundle.test.mjs: 143 -> 146 modules and delta 21 -> 24, route-only UNMOVED at 19. Consistent with the bytes:
  today-model.cjs:54 requires today-readings.cjs, today-app.cjs:39 requires today-lanes.cjs, gym-app.mjs:23 imports
  gym-settings-lane.mjs, all at module level (boot side), and build.mjs names the same three. The only files changed
  92be4e3..2c4d24e under rebuild/m3, m4, slice, lanes/c and client are page-bundle.test.mjs and production-mapping.cjs
  themselves, so the PM's counts at 92be4e3 are the counts of this graph.
- Test re-expressions under D-EPP-2: engine-capture.test.cjs and configuration-capture.test.cjs change "a PROPOSED
  beside the debut refuses" into "the untapped PROPOSED is never captured" and KEEP the refusal with a second eligible
  debut (D-CR-3 makes the PROPOSED's newW differ so the card assertion discriminates). That is the granted behaviour
  change, not an assertion deletion. Both files run in no child and no CI step (D-CF-2).
VERDICT 5: the engine moves are exactly the two :631 clauses plus D-EPP-2 at :69; the re-pins are mirrors of them.

## 6. Named debts (new; none blocks T6g) and carried debts
- D-CF-1 (wording, carry to VERDICT-S10.md): the S10 comments in rebuild.yml (standing step, Today step, E/C steps),
  b-package.cjs (IDS, CHILD_ROOTS) and the CHILD_SPECS comments of the Today tests cite "S10-WORKING-BRIEF.md c58b892",
  the working paper, not the brief of record. No grant is misattributed: the cited sections (4.2, 10.1) are carried
  unchanged into S10-TODAY-SPLIT-BRIEF.md (its header). Do NOT fix in S10: editing b-package.cjs moves the runner and
  re-pins eight ancestor specs; fix in a later child's own hunk if ever.
- D-CF-2 (evidence gap, disclosed before: IR:113, CAPTURE-REPAIR-REPORT.md:43, Astra L3-L7): engine-capture.test.cjs and
  configuration-capture.test.cjs carry the D-EPP-2 re-expressions (section 5) but run in no child and no CI step (they
  need a provisioned PERFORMED_W6_DIR that no workflow sets). The executed D-EPP-2 evidence is d-epp-2-capture
  (engine-capture-proposed.test.cjs) only. VERDICT-S10.md should say these two files are sealed unexecuted.
- D-CF-3 (PM-MEASURE, same class as D-T6F-1): ENGINE.treeSha256 9c135054 is proven only by P3-M1 inside the
  m4-import-production child, which hashes the real engine (protected modules included); no reviewer can re-observe it.
  Static support: engine and coach trees unchanged since the PM's 92be4e3 measurement.
- Carried, not paid here: D-T6F-1, D-T6F-2; D-SP-1, D-SP-3..6; D-S10R11-1..5 (D5 and the six scope rows via
  D-S10R11-2; the cut instruments in no child via -5); D-EPP-3's owed gates and D-EPP-4's real-engine red half
  (D-S10I-8); D-GSS-TIMER, D-GSS-PASSTHROUGH, D-GSS-LINES; D-SPLIT-LISTEN; D-COPYLOCK-*; D-BLOM; OWED-T26.

## 7. What I could not do
- Run anything (role and rules): no child, fence, copy-lock or m4 cell was executed by me; P3-M1's digest, the fence's
  404/404 and every needle are the PM's or the builders' measurements. I did not reproduce Track A's cut (instrument
  cells need the cut tools under a runtime slot) and relied on the byte identity to b35a48e3 plus my line-multiset check.
- I did not re-read GSS's red-first history or the three GSS Claude finals; section 2 is my own reading of the shipped
  lane plus byte identity to 66d32530.

## AAR
1. Did: byte custody of every view/writer file against b35a48e3, 66d32530 and d7f6540; a line-multiset move check of the Today split; a whole read of gym-settings-lane.mjs; both fence diffs; all 302 declarations against git bytes; the engine, D-EPP-2, mirror, import re-pin and page-bundle hunks; :828-:831 against the spec.
2. Verdict: ACCEPT WITH NAMED DEBTS D-CF-1..3. Every shipped change at 2c4d24e has a granting line in the brief of record (e5aabac9) or a ruling it carries, and nothing ships that no line grants.
3. Sharpest finding: the S10 lane adds no hunk to any view or writer file; its only fence hunks are the 4.2 LOOK_EDITS tidy-up and a residue anchor that planted nothing before (0 occurrences at 66d32530's gym-app).
4. S-R30 re-assertion (IR STOP 6) is made in section 3: no today-app exception row changed and every gym row change maps to :628.
5. Rule slips: none; static only, protected five excluded by pathspec and never shown or hashed, DECISIONS read at the ten named lines, nothing committed, pushed or written under W.
6. Next for the PM: the PM exact-byte read, then T6g commit H; carry D-CF-1..3 with D-T6F-1/2 into VERDICT-S10.md at T22.
