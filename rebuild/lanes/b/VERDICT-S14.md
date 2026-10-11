# VERDICT - M2-S14-HOLD - lane B seal - PASS on the `DECISIONS:932` receipt

<!-- DRAFT (builder, claude-opus-5-5, 2026-10-11), for rebuild/lanes/b/VERDICT-S14.md. Written from the PM's FILTERed lines and the
     builder's own round reports only; no raw log, no private value, count or prose. Every [[PLACEHOLDER-...]] is filled from the
     PM's filtered T20/T23/T24/CI-2 lines before C2/C4; nothing else changes then. Remove this comment and the placeholder list at the
     end before C2. -->

M2-S14-HOLD is the SEALED reseal child of M2-S11-NATIVE-LOAD that places the hold/bodyweight slice and carries every byte of the
S13 polish (S13 retired by supersession, `DECISIONS:923`). This verdict names the sealed-run receipt, the artifact, spec and runner
it stands on, every red of the slice and of its seal chain, every ruling, and every debt it carries. Nothing is excused.

## Authority

- THEME `DECISIONS:928` (cowork), BRIEF ACCEPTED BY SHA `DECISIONS:929` (cowork): brief of record for S14 is
  rebuild/lanes/b/S14-HOLD-BW-BRIEF.md rev5, sha256 7b0c66936c18f0ef97ddfa7acab982724186a5fdb3b0f4265911187d30592041 (102532 B).
  It stands beside the S13 brief of record rebuild/lanes/b/S13-HOLD-BW-BRIEF.md, sha256
  fc8b4a4be9a0064293f06e3e75390df83bae51f057628e87ac4299909d1c523b (`DECISIONS:913`), which stays byte-identical as :913's record.
- GATE-SUPERSESSION `DECISIONS:924` (RULED): `GATE-SUPERSESSION M2-S14-HOLD source-carriers,inherited-carriers,defect-witnesses,
  writers-differential,second-gate`, conditions (i)-(iii) of `DECISIONS:153` restated for the child of M2-S11-NATIVE-LOAD.
- S13 RETIRED BY SUPERSESSION `DECISIONS:923`; ANCESTOR RE-PIN RULED `DECISIONS:925` (D-S12-ANCESTOR-REPIN closed by ruling);
  GATE LEG (C2 D3) `DECISIONS:926` (debt D-LOOK-D3-PROBES); ENGINE_REVISION MOVES `DECISIONS:927`.
- PM rulings for S14 `DECISIONS:922` (a)-(f); renumbering `DECISIONS:918`; the :920 retirement pattern; the lighter process
  `DECISIONS:914 (3)`.
- Owner grants `DECISIONS:913`: (2) OQ-1 PM-seat protected engine runs, pass/fail only; (3) OQ-2 a fresh port after each engine
  update; (4) OQ-3 one yes/no check; (5) OQ-4 standing PM copy approval, list after release.
- L5 POSTFIX-ACCEPTANCE `DECISIONS:932` (R 8ac6812), the seal chain record `DECISIONS:931`, the T4-T6 record `DECISIONS:930`.
- Parent: M2-S11-NATIVE-LOAD, rebuild/m4/spec/acceptance-s11-native-load.json sha256
  bde69f156c4f88e15c65ae79790d0e7ad34c522af058e22438c7ea1fef5ccac4 (receipt `DECISIONS:896`, sealed and merged `DECISIONS:897`, seal tip
  7c79ef1); its receipt rebuild/lanes/b/tooling/receipts/S11.json 48574b8d8f252e87c56de8b1159dae008865343571d1b31cfa05cbed70624064.

## The evidence hashes this seal stands on

- artifact rebuild/m4/spec/acceptance-s14-hold.json sha256 a0e143369d2e479fb39cf339b5f9491aebadeeb416f9c251223fd25212317795
  (A 3e22a3baef67bffd3e3f841ba3bba8d36af2b90d, the artifact alone).
- spec rebuild/lanes/b/tooling/packages/S14.json sha256 07a2540bb28bdb1099af32895cb5db9d69839c2300500be1eb9be36e6627b34b (122457 B,
  H 70fb50b, PRODUCT FREEZE).
- runner rebuild/lanes/b/tooling/b-package.cjs sha256 1f9d8f01198e1bc62de147543ba6f4e23e897fe5bae8e80e26babf7165fb07e5 (320179 B).
- review envelope rebuild/m4/spec/review-s14-hold.json (V 8add733, 470 B, ACCEPTED on the :932 receipt, lineSha256 dbc046a0...).
- runbook rebuild/lanes/b/S14-SEAL-RUNBOOK.md sha256 55ac040078de82065fbaf2a52af74f392b30fb1df1987407cd5dea89e940f7a6 (31418 B,
  committed at 7a7f382; the round-5 bytes Fable's S0 read made USABLE as 19942e9c plus Fable's one probe-id note).
- brief rev5 7b0c6693 beside the brief of record FC8B4A4B (Authority above).

## Sealed-run receipt (`DECISIONS:136 (3)`)

- rebuild/lanes/b/tooling/receipts/S14.json sha256 0a9d78045c75e812a174f590f3fa7903e04d6086636765e4aa64babad5026431 (44669 B),
  commit C1 6e04533 (not pushed alone).
- T20 SEALED RUN RECORDED over 352 pinned product file(s) (352 declared, 0 released).
- T24 BYTE-IDENTITY RE-VERIFY over [[PLACEHOLDER-T24-PINNED-COUNT]] pinned product file(s).

## Terminals - the S14 seal chain, executed on the PC, exit codes measured (grant OQ-1 :913, pass/fail lines only)

- T7: M1 f9225f0 = merge of chain tip dfe0775 (delta rebuild/DECISIONS.md only), pushed. T8 skipped (CI-M1 green).
- T9: clean (three junction targets recorded; root, w5 and w6 junctions removed by rmdir; status and ls-files -v empty).
- T10: S14 PROFILE EXPORTED PENDING a0e143369d2e479fb39cf339b5f9491aebadeeb416f9c251223fd25212317795 review 5c2811a4 chain=dfe0775
  node=v24.19.0 git=2.53.0.windows.3 (scratch s14-final-1).
- T11: three junctions restored to the recorded targets; the two exported files copied in by hash.
- T12 ci1: ENVELOPE PENDING artifact=a0e14336 spec=07a2540b runner=1f9d8f01; 40 CHILD OBSERVED; PUBLIC CI EVIDENCE PASS; EXIT=0.
- T13: A 3e22a3b, the artifact alone, pushed.
- T14 full1 at A with the private census junction: REVIEW-PENDING mode=--full; ENVELOPE ABSENT; PRIVATE ORACLE PRESENT; 40 CHILD
  OBSERVED; FULL EVIDENCE 10 re-executed + 9 SUPERSEDED under :924; POSTFIX PACKAGE REVIEW-PENDING; EXIT=2 (predicted).
- T17-T19: :931 record, :932 L5 (R 8ac6812, receipt lineSha256 dbc046a0...), V 8add733, M2 df9ee99 (V..M2 rebuild/DECISIONS.md only).
- T20 full2 at M2: POSTFIX M2-S14-HOLD AUTHORIZED mode=--full; SEAL BASE ON THE TIP (origin/rebuild/t2-client-core at 8ac6812, an
  ancestor of HEAD, DECISIONS:135 (4), rule=ancestor); ENVELOPE AUTHORIZED artifact=a0e14336 reviewed at 3e22a3b, receipt base 8ac6812;
  AUTHORIZED STEP UNAVAILABLE SEALED-RUN-RECEIPT-ABSENT (the FULL run with the private census is required, DECISIONS:136 (3));
  PRIVATE ORACLE PRESENT, verdict-only reporting; 40 CHILD OBSERVED; 10 LEGACY; FULL EVIDENCE 10 of the 19 original gates
  re-executed, 0 carried, 9 SUPERSEDED under DECISIONS:924; SEALED RUN RECORDED rebuild/lanes/b/tooling/receipts/S14.json over 352
  pinned product file(s); SEALED RUN NEXT STEP (receipt sha256 0a9d78045c75e812a174f590f3fa7903e04d6086636765e4aa64babad5026431); POSTFIX PACKAGE PASS
  M2-S14-HOLD; EXIT=0; no re-run. C1 6e04533 = the receipt alone (44669 B), not pushed.
- T23: coach [[PLACEHOLDER-T23-COACH-COUNT x/x]], production pair [[PLACEHOLDER-T23-PROD-COUNT y/y]], both EXIT=0.
- T24 full3 at C3 [[PLACEHOLDER-C3-7]]: [[PLACEHOLDER-T24-FILTERED-LINES: AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY over <n>; POSTFIX
  PACKAGE PASS; EXIT=0]]; then the census junction removed by rmdir.

## CI

- T5b attempt 1: run 38154044650 at obs/s14-1 4a2e331 - RED on both OS (today-17 838/4, w6-local-today-journey 49/2).
- T5b attempt 2: run 38157426646 at ca373b0 - GREEN on both OS; the 40 needles come from its two artifacts, never typed.
- CI-M1 at M1 f9225f0: run 38159811792, success on both OS.
- CI-1 at A 3e22a3b: run 38162059395, success on both OS.
- CI-2, the binding run (`DECISIONS:563`/`:565`), at C4 [[PLACEHOLDER-C4-7]]: run [[PLACEHOLDER-CI2-RUN-ID]]
  [[PLACEHOLDER-CI2-RESULT: rebuild-public and C font transport on ubuntu and windows, times, failed steps]].
- W-46 accept observation (never merged, obs/s14-w46): run 38144505339 - VERDICT FAIL (W-46 refused on the #log rule; no files);
  run 38147311450 - win32 VERDICT PASS (pack status exactly its six paths, MEASURE "nothing moved in 418 renders"), linux VERDICT FAIL
  (hosted ubuntu redrew W-18 linux thumbnails; not used).

## Export custody

- Exporter export-s14-profile-v1 sha256 008fb88dcffa58a29413f23a266635368ede99505ee7e7b45a3860a760b572d4 (S11 v1 9e6ac28c with
  S14 literals on the same eleven lines); self-check 4809bc7a0651953d32cba2f9b93d63d80c08230e22587c26c90761b11632d821 run by the PM:
  FAIL 0, PENDING C6 scratch root and C12 prose (the quoted historic contract line), as S11 at :888.
- Fable containment read on the final inputs BB26750C ACCEPT; negative control REFUSED with no output; custody by sha256 only (no
  exporter branch).
- Scratch s14-final-1; chain dfe0775; node v24.19.0; git 2.53.0.windows.3; review envelope sha 5c2811a4 (the fixed PENDING bytes).

## The T5b observation record (S14's own; needles come from hosted runs, not from a seat)

- Attempt 1 (38154044650) was red on both OS with ONE cause: PAGE_PINS in rebuild/m3/w6/test/local-today-journey.test.mjs still
  pinned S11's today-entry.mjs (b3de1c31) after S14's two R4 hunks moved it to 5adab952. Four today-17 cells (N1.18 PAGE_PINS, S10
  PAGE_PINS, N2-08 check-in files, re-pin A4b) and two journey cells read that pin. Re-pinned by the S11 route (a re-read paragraph
  inside PAGE_PINS, only today-entry.mjs moving; both files S14-declared edits), commit 5b42f36; PM seat today-17 842/0.
- Attempt 2 (38157426646) green on both OS; needles filled by s14-fill-needles.cjs; S14-REGEN 352 paths, 0 changes, PENDING 0;
  Fable T6 ACCEPT 5361ED37; H = 70fb50b.
- The obs branches are deleted (`DECISIONS:930`).

## Engine bytes: what S14 moves (`DECISIONS:924`)

- rebuild/engine/native-load.cjs (FC01) ONLY, by its declared hunks (rebuild/m4/workout/test/s14-native-load-moves.cjs: six hunks,
  parent ab2a1ca8 -> post c91d5a2b), under the owner grants of :913. No writers.cjs or progression.cjs byte; seed, migrate, merge,
  index and oracle-shim byte-identical. Child 35's needle (T5b attempt 2): "ENGINE FILES DIFFERENTIAL: 27 tracked rebuild/engine file(s)
  outside this package's declared product, all byte-identical to the parent; 1 named file moves, by". Other needles of note:
  today-17 '# pass 842', native-load-fc12 '# pass 491', s10-copy-lock '# pass 16', w6-local-today-journey '# pass 51', ui-pack-pins
  '# tests 121'.
- FC03 rebuild/m4/workout/native-load-effects.cjs moves with it (PRODUCER_REVISION re-bound, R2-REVISION forced red then green).
- The six parent supersession children (s11-sup-* x5, s11-engine-files-differential) pin native-load.cjs at S11's post and were red
  at this head, so S14 replaced them with its own s14-supersede-* x5 and s14-engine-files-differential; at the PM seat all six were
  green at the head and red with native-load.cjs at 0043823's bytes (each 1-2 fails), the file restored by hash.
- E10: rebuild/m4/import/production-mapping.cjs:68 treeSha256 re-pinned bc45ca73 -> 155e2f1b16f78d557eb72e842882a933d618a6f31814f6246a29b4da313f0adc
  (off-seat value by the D:841 method, equal to the PM-seat engineDigest; P3-M1 red at bc45ca73 then green; production-mapping
  20/20). No rebuild/engine byte moved after it.

## The look: W-46 and the listed pack edits (`DECISIONS:817`, "Yes, list each")

Pack rebuild/m1/approved-2026-09-18, sealed through pack-pin.test.mjs's literal (a declared S14 post); each edit red first on the
whole-pack pin, then re-pinned:
- app/states-workout.js (3d26c4f7): new state W-46 "Finished, a bodyweight lift has no weight to agree to" = W-31's finished panel
  plus the panel's status sentence "No new weight to agree to yet. Your saved sets are kept." and the example line "Dips:
  bodyweight sets have no weight to agree to. Your sets are saved."; app/states-index.js (28d75225) one row;
  states/STATE-INVENTORY-DRAFT.md (5cfda639) one row and the counts. design.cjs:81 binding and approved-pin :113 moved red first.
- SC-S14-6 quality/statesheet.py (a80809c6): the frozen PANEL_PRIMARY declares W-46 beside W-31, whose panel and .panel-primary it
  draws (a declaration, not a loosening: W-46 must now draw .panel-primary). Found by the first accept run (38144505339), which
  refused W-46 on the #log rule.
- SC-S14-5 README.md:309 (793fe57d): one sentence recording what the W-46 accept proved: win32 records and thumbnails drawn on the
  hosted windows-latest row under the byte-identity bar (run 38147311450), linux W-46 thumbnails by the linux machine of record,
  hosted ubuntu-24.04 measured non-equivalent (W-18); for everything else the owner's PC and the builder's sandbox image remain the
  machines of record.
- Baselines (applied by hash): INDEX.json c4c45d2d, W-46-dawn.json 61bac360, W-46-ink.json 4f337ca6, win32/ENV.txt eaecf7aa,
  win32/W-46-dawn.png e46a004c, win32/W-46-ink.png 1e1b88cc, linux/ENV.txt 2830f102, linux/W-46-dawn.png f108a8dd,
  linux/W-46-ink.png b863c99b. The linux accept-thumbs ran on the linux machine of record (python 3.11.15, playwright 1.56.0,
  chromium 141.0.7390.37): 420 renders, 0 with problems, git status exactly its six paths.
- PM ruling (recorded at `DECISIONS:930`): the hosted look-gates rows were acceptable as machines of record for the W-46 accept
  ONLY, on the workflow's byte-identity bar.

## Declared departures and owed gates

- GATE LEG (C2 D3) `DECISIONS:926`: the pack probes JS_FIT, JS_MARGIN, JS_SAFE and JS_GAPS fall back to the host under S11's mount
  and are RULED trivially passing per D3; per-probe reporting at the look gate is debt D-LOOK-D3-PROBES. The pack and S11's mount
  were not edited for the gate.
- The R9.14-A spec paper lives on the product lane at rebuild/coach/NATIVE-LOAD-SPEC.md (bd7f91b), declared by name in S14.json,
  superseding rebuild/c-native-load-spec 7ef8291 for R9.14 (`DECISIONS:922 (d)`).
- E14 is a change to the PM's T30 runner outside the repo (`DECISIONS:922 (e)`): patch t30-e14.patch sha256
  a026edcdacd5f25b6c6d758532f3b8d5bfdea9841a2a50a9d6406e4dd863618a (base d9f6c8f2 -> 9a0bb611): NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT is an
  allowed no-offer reason only for a bodyweight-marker lift; a hold lift at one weight must get its offer (3-HOLD); RECORD_INVALID
  stays a red. PM ruling: pending; it is applied and run at S35 (T30) only, and recorded there.
- R13 scene-dup count CUT to debt D-S12-SCENE-DUP-1 (`DECISIONS:922 (b)`); R12 import sentence CUT to debt D-S11-EN3-COPY, with
  CL-COMPOSED-DATA kept as the I-COPY cell (`DECISIONS:922 (c)`).

## Records of this seal chain

### Every red, in order (`DECISIONS:835`: recorded, never excused)

- Round 1 (engine, R1-REPORT): twelve cells red on the unmodified 88cc92c before any product byte moved, each then green: S13-R2-OFFER,
  S13-R2-DERIVABLE, S13-R2-ACK-PROJ (also red at the M10 and M9 intermediate states), R28B-CONFIGURATION-CAPTURE and
  R30-L20B1-ACKNOWLEDGED-OFFER-SURVIVES (expected code moved), R30-L20B1-HOST-CONFIGURATION-NO-ADOPTION (FA03, one added assertion),
  S13-R2-READOPT, S13-R2-LOST-ACK, S13-R2-FOLD-FORGERY, S13-R2-BWKEY, S13-BW-PLANCHANGED; R2-REVISION forced red by the FC01 move and
  re-bound. Control R30-CONFIGURATION-CAPTURE-STEP2 green throughout. Fable D390490A.
- Round 2 (R2-REPORT): S13-R2B-WORDS, S13-R1-PREFILL, S13-R1-PERPOS and S13-R4-LINE red on the round-1 bytes, then green; three FUZZ
  cells red on 88cc92c and green from round 1 on; controls green on every side; R2-REVISION forced again; copy-lock 8/13 with five
  by-design reds left for the copy-lock moves. Fable EEFFEBDD.
- Round 3 (R3-REPORT): S13-FUZZ-WHITESPACE-W (b) red on the round-2 bytes (an offer minted over ' '), green after the NON-BLANK rule
  (textLoad); Fable round 3 PASS (A96D5B32).
- Round 4 (post-merge, runbook section 2): the copy lock 8/13 on the merged tree, every red caused by the two approved moves
  (CL-HOLDS, CL-PLANTS, CL-ENGINE-COPY, -COPY-TEETH, CL-ENGINE-OUTPUT-TEETH); CL-S14-DELTA red before the re-measure; the two new
  CL-ENGINE-OUTPUT cases red on the round-1 engine; then 15/15.
- Round 5 (S1b-S8b, R5-REPORT): CL-COMPOSED-DATA red on today-entry.mjs of 0043823 and on the round-1 native-load.cjs, then 16/16;
  W-46 pins red first (pack-pin REAL ROW, approved-pin REAL ROW, design.test COPY-SOURCE-PIN); F6 pins red with the HEAD runner, then
  17/17; S14-REGEN.test's DECLARED_DOCS row red against S13-REGEN, then 218/218.
- S7/S8b at the PM seat: P3-M1 red at bc45ca73, green at 155e2f1b; the six s14 supersession files red with native-load.cjs at
  0043823's bytes (each 1-2 fails), green at the head.
- S8b/T4 PM-seat evidence: the guard-stopped children and cells (view, adapter, catalogue; the four w7-import files;
  browser-parity, engine-provider, prepare, reading-replay, proposed-pick; coach R4) were not run at a builder seat; they ran at
  the PM seat inside the --ci/--full child sets (T12 ci1 and T20 full2: 40 CHILD OBSERVED exit 0) and hosted in T5b run
  38157426646 (both OS green); the four FC12 R34-BR3* host cells ran hosted (native-load-fc12 '# pass 491' includes them).
  The page-bundle and sealed-inventory pins moved red first and are green in those runs. The D-W7IMPORT-FLAKE-1 hunter run was
  NOT run for S14 (recorded, not excused); w7-import was green in every S14 run (T12, T20, T5b both OS).
- W-46 accept run 38144505339: VERDICT FAIL (W-46 "required primary action #log is not drawn"), fixed by SC-S14-6, red first on
  pack-pin. Run 38147311450: linux VERDICT FAIL (hosted ubuntu redrew W-18 thumbnails), so the linux half came from the machine of
  record. README SC-S14-5 red first on pack-pin twice (first wording, then the true provenance).
- T5b attempt 1 (38154044650): red on both OS, today-17 838/4 and w6-local-today-journey 49/2, one cause (PAGE_PINS), fixed 5b42f36.
- T7-T16: none (`DECISIONS:931`); T14 EXIT=2 REVIEW-PENDING is the predicted terminal, not a red.
- T20-T26: T20: none. T21-T26: [[PLACEHOLDER-T21-T26-REDS: none | list with run ids]].

### Every incident (recorded, not excused)

- `DECISIONS:912` PM slip (local test setup, before this slice's seal chain): `git worktree remove --force` on %TEMP%\earned-s12base
  followed its node_modules junctions and emptied three shared local installs; repaired by junctions only; @noble/ciphers 2.4.0
  fetched under the owner's :913 (1). Rule since: rmdir every junction before removing a worktree. This chain's T9/T11/T14 used
  rmdir and mklink /J only.
- `DECISIONS:914` builder slip (T1 paper on this lane): a git grep lost its pathspec to PowerShell quoting and searched the whole
  tree, printing one line of a *soak* path; no src/, private, ledger or protected-five line. Builders pass git grep pathspecs
  through a .cmd file since.
- `DECISIONS:930` PM slip: T5b attempt 2 was pushed with --force-with-lease onto the never-merged obs/s14-1 instead of a new branch,
  against the never-force-push rule; rule since: a new obs branch per attempt.
- `DECISIONS:931`: A 3e22a3b's message was amended BEFORE its push to add the attribution trailers (author "cowork (Earned PM)");
  the artifact bytes are the T10 export's, unchanged; nothing pushed was rewritten.
- T20: none. T21-T28: [[PLACEHOLDER-T21-T28-INCIDENTS: none | list]].

## Carried debts (each CARRIED by id, with why it is not reachable from genuine use or why it is carried)

- D-S13-BW-CONFIGURATION: bodyweight sets are saved as bodyweight, with no configuration load writer; its own engine slice.
- D-S14-INERT-CLAIM: R1 and R2 differ for a FORGED missed-debut claim (FC01, spec R9.9); a forged claim is not a state genuine use
  writes (`DECISIONS:922`).
- The FIXTURE NOTE: a capture-less host v1 completion is a state engine-history.cjs :69 refuses; it exists in fixtures only.
- The FC03 non-blank rule's three equivalent mutants: defence in depth behind DERIVABLE (c3).
- D-T30-REPIN-ORPHANS: MITIGATED only, by the fresh port after each engine seal (owner grant :913 (3), runbook S35).
- D-S12-SCENE-DUP-1 (cut to debt, :922 (b)); D-S11-EN3-COPY (cut to debt, :922 (c)); D-LOOK-D3-PROBES (:926).
- Hosted ubuntu-24.04 is not byte-equivalent to the linux machine of record (W-18 thumbnails, run 38147311450): a future linux
  accept comes from the machine of record unless re-measured.
- The S13 polish debts carried by id: D-W6-LOCAL-TODAY-BROWSER and the audit's F6, F8 and F9.
- Fable read debts by id: [[PLACEHOLDER-none (Fable T22: only the t09 README wording note): T6 5361ED37, containment BB26750C, T16 9019459A, VERDICT C2 <id8> - "none" or
  the named debts of each]].
- PM ruling (Fable agreed): the pack's hand-written prototype app/app.js is hashed by existing pin rows (pack-pin,
  approved-pin) without being printed; that is not the "built app.js" limit, which is the shipped bundle (R5-REPORT 9 (f) closed).
- The inherited S11 carries exactly as VERDICT-S11 lists them, and D-BLOM (:798/:799) as below.

## PM rulings recorded in this verdict

- `DECISIONS:922` (a)-(f) and the Fable verdicts it cites (rounds D390490A, EEFFEBDD, A96D5B32; rev5 7b0c6693 acceptable; runbook
  19942e9c USABLE); `:923`-`:927` (the S9 lines); `:930` (the W-46 machine-of-record ruling, the T5b record); `:931`, `:932`.
- Runbook 3.7 corrected in practice: the parent's s11-sup children could not carry S14 (red at the head) and were replaced by
  S14's own six (R5-REPORT 6, PM-seat red/green above).

## PAID (stated as paid and still true; nothing here is excused)

- Brief 6.1's three owed items: the ancestor re-pin ruling (:925, D-S12-ANCESTOR-REPIN closed by ruling), the gate leg (:926) and
  the ENGINE_REVISION ruling (:927), paid as ledger lines before THEME.
- The brief wording ("non-blank (non-empty after trimming)", the R1 legacy wording) paid by rev5 (7b0c6693).
- CL-COMPOSED-DATA, the I-COPY cell (:922 (c)), 16/16, red first.
- The W-46 look law (:817): one prototype state, accept runs per platform as listed pack edits with SC ids, red first.

## Copy approvals (`DECISIONS:913 (5)`, owner's standing Yes to OQ-4; brief 12.11; CL-S14-APPROVAL)

- String 2 (R4): "<lift name>: bodyweight sets have no weight to agree to. Your sets are saved." (the lift name is the athlete's
  data, not copy).
- The R2b piece: "(the card said hold on every set)" in the hold offer, and its Undo "... goes back to hold on every set ...".
- No other person-visible string moved (copy lock CL-S14-DELTA: the corpus is the released S13 corpus plus exactly the R4 piece).
  The list goes to the owner after release (runbook S36).

## Inherited from S11 (carries restated)

Every carry VERDICT-S11 lists stays carried by id; S14 pays none of them except as stated under PAID.

## D-BLOM

Unchanged from VERDICT-S11 (:798/:799): it excuses no red public step.

## The coach constant (`DECISIONS:927`)

rebuild/coach/engine-revision.cjs:25 moved once, at C3 [[PLACEHOLDER-C3-7]], from "M2-S11-NATIVE-LOAD@48574b8d8f252e87" to
"M2-S14-HOLD@0a9d78045c75e812" (the first 16 hex of sha256(receipts/S14.json)); coach tests by glob
[[PLACEHOLDER-T23-COACH-COUNT]], production pair [[PLACEHOLDER-T23-PROD-COUNT]]. S14.json declares rebuild/coach/NATIVE-LOAD-SPEC.md but
not engine-revision.cjs, so C3 does not void the receipt. C1 was never pushed alone (`DECISIONS:897`).

## What this seal carries for the athlete

A lift whose plan says "hold" now shows the last load he really logged in the weight box, with the plan line hidden, and the app
can offer that load as the next weight to agree to with one Yes. A bodyweight lift gets no weight offer at all; after the check,
the finished screen says, for that lift, that bodyweight sets have no weight to agree to and his sets are saved. Nothing changes
without his Yes, a Yes already given is never lost, and every new string was approved under :913 (5). It stands on the sealed S11
parent and carries the S13 polish.

<!-- PLACEHOLDERS TO FILL BEFORE C2 (from the PM's filtered lines only):
  T23: PLACEHOLDER-T23-COACH-COUNT, -T23-PROD-COUNT, -C3-7
  T24: PLACEHOLDER-T24-PINNED-COUNT, -T24-FILTERED-LINES
  CI-2: PLACEHOLDER-C4-7, -CI2-RUN-ID, -CI2-RESULT
  Other: PLACEHOLDER-T21-T26-REDS, -T21-T28-INCIDENTS, -none (Fable T22: only the t09 README wording note) -->
