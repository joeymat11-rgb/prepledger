# S14 BRIEF rev5 - "hold" shows the last real load, text working loads get an honest next-weight path, bodyweight lifts say why they get no offer (M2-S14-HOLD; rev5 of the brief of record S13-HOLD-BW-BRIEF.md sha256 FC8B4A4B..., builder seat, 2026-10-11). The gym change is S15 (appendix); saving bodyweight sets as bodyweight is its own later engine slice (D-S13-BW-CONFIGURATION, section 14).

Status: rev5, a DRAFT for ONE Fable read and the PM (S14-SEAL-RUNBOOK.md step S1b). It becomes the brief of record of
M2-S14-HOLD only by a BRIEF ACCEPTED BY SHA line naming its sha256; until then the brief of record is
rebuild/lanes/b/S13-HOLD-BW-BRIEF.md (DECISIONS:913, sha256 FC8B4A4B...), which stays byte-identical. It authorizes no
build, token, run or commit. rev5 is the brief of record's text with the changes in the "rev5 changes" table below and
nothing else; the rulings and findings since DECISIONS:913 are in section 15. The rest of this paragraph is rev4's
status, kept as history: rev4 was a DRAFT for the PM. Answers every required
change G1-G4 of Fable's third read REVIEW-S13-BRIEF-FABLE-l3 (ACCEPT-WITH-CHANGES, on rev3 sha256 8C1F4C65...) and takes
its optional notes (l3 H); records PM ruling 12.2 (2026-10-10: the NEW code NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT, answered at
:269's position, FC03 classification AFTER_STEP_2 only) and the owner's answers of 2026-10-10 to OQ-1..OQ-4, all Yes
(OQ-3 widened to the other-word check; OQ-4 a standing rule). NO OWNER QUESTION IS OPEN: nothing in S14 waits on the
owner before T29-T31's own steps. rev3 answered every required change E1-E5 of Fable's re-read REVIEW-S13-BRIEF-FABLE-l2
(ACCEPT-WITH-CHANGES, on rev2 sha256 9941C606...) and recorded the owner's answers to OQ-1..OQ-3. rev2
answered every required change C1-C7 of Fable's read REVIEW-S13-BRIEF-FABLE-l1 (ACCEPT-WITH-CHANGES, on rev1 sha256
8D72B64C...) and recorded the PM rulings of 2026-10-10 (PQ-12 = SPLIT). Written by a builder seat from code and
the ledger only, at the live product tree %TEMP%\earned-s12look = 928ecd3 (S12 look on the S11 engine seal 7c79ef1;
status clean) and origin/rebuild/t2-client-core db9bbe3:rebuild/DECISIONS.md (912 lines, fetched 2026-10-10). The
NATIVE-LOAD spec of record is 7ef8291:rebuild/coach/NATIVE-LOAD-SPEC.md (R9.13, 621 lines), cited from rev1 and Fable's
read. (rev5: for R9.14 that branch, rebuild/c-native-load-spec 7ef8291, is SUPERSEDED: the R9.14-A paper lives on the
product lane as rebuild/coach/NATIVE-LOAD-SPEC.md as committed in bd7f91b; PM ruling 2026-10-11, section 15.4.) Nothing
was run, no test executed, no bundler, no product code loaded. Not opened: src/, rebuild/conform/private, any
ledger/ folder, any *soak* path, EarnedPort, port-real.log, joe-data, astra-job-50.jsonl, any built app.js, and the
contents of rebuild/engine/seed.cjs, migrate.cjs, merge.cjs, index.cjs, oracle-shim.cjs (git grep ran with those as
exclude pathspecs, D:903 (3); no recursive Select-String). Line numbers are at 928ecd3 unless another ref is named.
Ledger lines are cited as D:<n>.

## rev5 changes (2026-10-11; each change -> where it is made; section 15 holds the record)

| item | change in rev5 | where |
|---|---|---|
| D:918 renumbering | the hold/bodyweight slice is S14 throughout: package M2-S14-HOLD (lanePackage 'S14', slug s14-hold), S14.json, S14-REGEN, VERDICT-S14, STOP-S14-*, obs/s14-<n>, child s14-hold; the gym change is S15 (Appendix S15, S15-OQ-A/-B, D-S15-STACK-JUMPS); "S13" now names M2-S13-POLISH (D:918-:921). Kept byte-for-byte because they are ids already in committed files or the ledger: the cell ids S13-* (as committed in bd7f91b), D-S13-BW-CONFIGURATION, D-S13-STACK-JUMPS (history), the file names S13-HOLD-BW-BRIEF.md and REVIEW-S13-BRIEF-FABLE-l1..l4. The history tables (rev2-rev4) are renumbered the same way | everywhere; 5; 15.1 |
| "non-blank" (Fable R2 section 5; engine round 3) | "text working load" means a stored w that is a NON-BLANK string (non-empty after trimming, the capture writer's rule, engine-capture.cjs:23 configuration()); a blank or whitespace-only w is refused RECORD_INVALID base_load at issuance, DERIVABLE (c3) and the fold; spec R9.14-A (1) reads the same (:626) | 3, 4 (E1, E3), 15.2 |
| R1 legacy wording (Fable R2 1.3) | the box holds exactly the load the Last time line shows, or stays empty: a LEGACY row with a numeric w pre-fills that w; only history with no real weight leaves the box empty (cell S13-R1-LEGACY) | 3 (R1) |
| R13 CUT (PM ruling 2026-10-11; runbook R1) | R13 / E9 / S13-R13-ONCE leave S14; D-S12-SCENE-DUP-1 stays open as a debt, named in VERDICT-S14; the owner's line 6 no longer promises the smaller download | 0, 1, 3 (R13), 4 (E9), 5, 6.3, 6.5, 7.4, 7.9, 9.2, 15.4 |
| spec paper home (PM ruling 2026-10-11; runbook R3) | R9.14-A lives on the product lane as rebuild/coach/NATIVE-LOAD-SPEC.md as committed in bd7f91b (one place, reviewed with the code it governs); rebuild/c-native-load-spec 7ef8291 is superseded for R9.14; S14-REGEN declares the paper on purpose | header, 4 (E3), 6.3, 15.4 |
| S13 retirement and the chain since :913 | S14's parent statement: S11 sealed parent; S12 retired at D:920; M2-S13-POLISH (D:918, released D:921 at 7347ba6) is the one unsealed --ci child; S14 carries every byte S13 declared and retires S13 by supersession in the :920 shape; S14-REGEN is ported from S13-REGEN | 6.1, 6.2, 6.3, 15.1, 15.5 |
| brief 6.1's three owed items | the ancestor re-pin ruling, the gate leg (C2 D3) and the ENGINE_REVISION ruling are paid by the PM as ledger lines before THEME (runbook S9 (3)-(5), bodies drafted there) | 6.1, 15.4 |
| lighter process (D:914 (3), D:915 (2)) | red-first cells for every rule and ONE independent Fable read per step; no closing-rule rounds, no Claude (Opus) or Astra seat; nothing else relaxed | 6.4, 7.1, 12.6, 15.1 |
| engine rounds 1-3 (Fable PASS each) and their rulings | round 1 flags (a)-(c) and the title suffixes; round 2 item 6 (i) FIXTURE NOTE and 6 (ii) D-S14-INERT-CLAIM; R2b approval D:913 (5); round 3 non-blank rule and the three equivalent FC03 mutants; round 4 copy-lock moves | 1, 10, 15.2, 15.3 |
| R12 and E14 | not ruled at rev5: R12 as runbook S1 (c) rules (recommended keep); E14's home the PM's PC, outside the lane (runbook S1 (f)) | 4 (E14), 9.2, 15.6 |
| the :913 owner grants | given for "S13" before the renumbering; they name the slice, not the number, so they apply to S14 (one PM line, runbook S1 (e)); no new owner question | 6.5, 9.1, 15.5 |
| estimate | 4.5 to 6 working days from the PM's go (Fable's S0 read of the runbook): on the phone about 2026-10-16 to 2026-10-19 if work starts 2026-10-12 | 0 line 8, 11 |

## rev4 changes (each Fable l3 item, PM ruling and owner ruling -> where it is answered)

| item | answer in rev4 | where |
|---|---|---|
| l3 G1 (C1) | the FOUR existing cells on the w 'BW' fixture are named with their disposition: FC12 :6861 R28B-CONFIGURATION-CAPTURE, FC12 :7226 R30-L20B1-ACKNOWLEDGED-OFFER-SURVIVES and FA03 :2205 R30-L20B1-HOST-CONFIGURATION-NO-ADOPTION are controls whose expected code moves red-first (RECORD_INVALID base_load -> NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT; still NO offer); FC12 :7361 R30-CONFIGURATION-CAPTURE-STEP2 is a control, byte-identical. E1 (a) states the POSITION RULE: the new code is answered at :269's own place in FC01's order, after :230-:231, :253, :254, :256, :263 and :264. R4's parenthetical reads "logged at one same weight in pounds"; unequal pounds on a bodyweight lift answer VECTOR_ADOPTION_UNDEFINED and get no R4 line, as today | 3 (R3, R4), 4 (E1), 5, 12.2 |
| l3 G2 (C2) | E2 gains a second FC03 hunk: the new code joins AFTER_STEP_2 (native-load-effects.cjs:414-:415), so the fold's capture-vs-plan check (:1425, :1458) may replace it with PLAN_CHANGED; ruled NOT BLOCKING (:16), NOT HELD_BACK (:20), NOT HOLD_CODES (:430); spec R9.14-A lists the code and this classification; new cell S13-BW-PLANCHANGED and mutant M13; E2 lines 25-50 -> 26-53 | 3 (R4), 4 (E2, E3), 5, 7.1, 11, 12.2 |
| l3 G3 (D1) | OWNER OQ-3 WIDENED (Joe, this chat, 2026-10-10, "Yes"): the one check also reports yes/no for any lift whose weight is written as a word other than hold or BW. 7.7's second unknown is closed; any answer changes no S14 rule (a "yes" adds that word as a second S13-R2 fixture key beside 'hold', nothing else) | rev3 table, 6.5, 7.7, 8 (STOP-S14-GRANT), 9.1, 12.10 |
| l3 G3 (D2) | OWNER OQ-4 YES, STANDING (Joe, this chat, 2026-10-10, "Yes"): the PM approves new on-screen copy for every slice; the list is sent to the owner after each release; any he flags is changed in a later fix. PM approval of strings 2, 3 and the R2b piece is now a PM ruling (12.11), needed before T3's copy lock | header, rev3 table, 0 line 9, 3 (I-COPY), 6.4 (T2), 8 (STOP-S14-STRING), 9.1, 10, 11, 12.10, 12.11, S15.7, S15.10 |
| PM ruling 12.2 (2026-10-10) | NEW code NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT, answered at :269's position (after :263/:264), FC03 classification AFTER_STEP_2 per G2. R4 and section 0 line 3 stand | 3 (R4), 4 (E1, E2, E3), 12.2 |
| l3 G4 | citations: load-field.mjs exports isNumericLoad :11, isConfiguredLoad :12, loadMode :15, formatLoad :19, readLoadEntry :28, loadEntryFrom :40, sameLoad :46 (re-read by this seat at 928ecd3); the rebuild/m3/w7-preview/today/ and rebuild/m3/w7-preview/import/ paths spelled in full once at the head of section 4 | 4, 5, 14 |
| l3 H (optional) | D-S13-STACK-JUMPS renamed D-S15-STACK-JUMPS (S15 records it); S13-R12-WORDS red wording "no sentence line for the code" (:202-:203 push nothing); the owner handoff words of 14 kept | 5, S15.4, S15.10 |
| l3 E | estimate re-checked: 6-8 working days kept (Fable l3: credible and slightly safer, no owner question gates any step; the C1 code move is red-first work inside FC12/FA03; the C2 line is inside the same FC03 rounds) | 0 line 8, 11 |

## rev3 changes (history; rows superseded by rev4 are marked)

| item | answer in rev3 | where |
|---|---|---|
| l2 E1 (B2-B4) | R3/E6 (bodyweight sets saved as a configuration load; the write-schema widening) CUT from S14 now, not at T1: the 7.2 decision already resolves at 928ecd3 (performed.cjs and progression.cjs readers throw by design; progression.cjs is in STOP-S14-ENGINE-SCOPE). KEPT: E1 (a)'s bodyweight-marker code, R4's line for that code, R1's bodyweight exclusion and S13-R1-BW-NOFILL, E14. DROPPED: E4's logSet half, E5, E6, S13-R3-SCHEMA/-LOG-BW/-NEXTDAY/-IMPORT/-CHECK, M11, string 1, look state (1), STOP-S14-READER, STOP-S14-WRITER, rev2 ruling 12.4, the schema/edit test files of 6.2. Debt D-S13-BW-CONFIGURATION recorded with Fable's reader list as its spec input; its own later engine slice, NOT S15; size M. A new STOP-S14-BW-CUT keeps the cut honest | 0, 1, 2.3, 3, 4, 5, 6, 7.2, 8, 9.2, 10, 11, 12, 14 |
| l2 E2 (D1) | S13-R2-ACK-PROJ is a NEW cell on a 'hold' fixture (text w, non-bodyweight). The existing L20-B1 acknowledgement-to-projection cell (bodyweight-configured card, D:856 (1), D:859 (1)) and R28B-CONFIGURATION-CAPTURE are untouched and keep asserting NO offer; listed as controls that kill M1. (rev4: the tree has FOUR such existing cells, all named in section 5 with their disposition, l3 G1) | 5 |
| l2 E3 (C) | OQ-4 asked ONCE as a standing rule (the PM approves new on-screen sentences for this and later updates; the list is sent after each release; any he flags is changed in a later fix); S15-OQ-A removed; S14's new sentences are TWO (strings 2, 3) plus the R2b piece. (rev4: the owner answered Yes, standing, 2026-10-10) | 0 line 9, 3, 9.1, 10, S15.7, S15.10 |
| l2 E4 (A/C6) | prior art cited as rebuild/m4/spec/configured-load-candidate/run.cjs:16-:18 (schema :16, edit-values :17-:18) and rebuild/m3/w6/test/browser-configured-load.mjs:51-:52 (re-read by this seat at 928ecd3) | 2.3, 14 |
| l2 E5 (B2) | the reader enumeration keys on readers of a set's load (payload.load / fact.current.load), not on requirers of workout/schema.cjs | 14 |
| l2 C5 | 6.6: S14 adds ONE new app state (the after-workout panel with the bodyweight line) | 6.6, 7.3 |
| l2 D3 | estimate re-checked: 6-8 working days kept (Fable: credible after the cut); the R2 cut at round 6 bounds the tail at 8-9 | 0 line 8, 11 |
| l2 F (optional) | I-SILENT note for the debt's brief (today.cjs:188); builder and Fable recommend the NEW code in 12.2 (R4 keys on it); S15.3 expectation note (today.cjs:98); hard-limit list and pathspec sentence kept | 14, 12, S15.3, header |
| OWNER OQ-1 (Joe, this chat, 2026-10-10, "Yes (Recommended)") | yes: the PM may run the protected engine checks on his PC for S14, pass/fail lines only | 6.5, 8, 9.1 |
| OWNER OQ-2 (same) | yes, STANDING: a fresh port of his old-app history on his PC after every engine update, the decrypted copy deleted after, pass/fail lines only | 3 (R14), 6.4, 6.5, 8, 9.1 |
| OWNER OQ-3 (same) | yes: one check of whether any hold/BW lift has an unfinished old-app step; yes/no kept only. (rev4: WIDENED by the owner on 2026-10-10 to also report yes/no for any lift whose weight is written as a word other than hold or BW; closes 7.7) | 6.5, 7.7, 9.1 |
| OWNER OQ-4 | still OPEN, to be asked (as the standing rule above); no S14 string is locked until it is answered. (rev4: ANSWERED YES, STANDING, 2026-10-10: the PM approves new on-screen copy for every slice, the list sent after each release) | 8, 9.1, 10 |

## rev2 changes (history; rows superseded by rev3 are marked)

| item | answer in rev2 | where |
|---|---|---|
| PM ruling 2026-10-10, PQ-12 | SPLIT: S14 = engine/hold/BW + R14 (REPIN-ORPHANS) + R13 (SCENE-DUP) (+ R12, rides any seal); S15 = gym change, outlined | 0, 3, 9.2, 11, Appendix |
| C1 / A2 | E1 names BOTH (c3) sites: :266-:269 (issuance) AND :524 in derivable() (transition :560, re-run by the fold at native-load-effects.cjs :1119-:1121); :546-:547 read, unchanged | 2.2, 4 |
| C1 / A1 | ":685 ff." dropped; the transition :577-:591 and compensate :614-:617 already apply and undo R2 | 2.2, 4 |
| C1 cells | S13-R2-ACK-PROJ red state = refused at :524 at accept; new S13-R2-DERIVABLE; mutants M9 (:524 not :806) and M10 (:269 not :524) | 5 |
| C2 | moved to S15 with the fix: ONE site (FC03 fold loop), op-order rule R9.14-G, Undo-after-Yes ruled, cells GC-UNDO-AFTER-YES, GC-SAMEDAY | S15.3-S15.6 |
| C3 / A3 | option (ii): the plan line hides once the box is pre-filled (gym-app.mjs:468); R1 and S13-R1-PREFILL say so | 3 (R1), 5 |
| C4 | "BW"/"hold" stated as data, not a copy-lock piece (cell CL-COMPOSED-DATA); the before-last-change and Undo-blocked strings added to S15's list | 10, S15.7 |
| C5 | S14's two new app states (rev3: ONE, l2 C5) and S15's screen each get a pack prototype state + per-platform accept runs as listed pack edits (D:817) | 6.6, 7.3, S15.8 |
| C6 / A4 | D:895 cited; no standing-delegation claim; PM picks rest on the PM's role, list sent after release (D:905 (1) pattern) | 0 line 10, 9.2 |
| C6 / A5, A6 | D:843 (1); :173-:179; rebuild/m3/w6/local/today-bindings.mjs; performed.cjs :124-:130, :244-:253; write-time validator cited (schema.cjs :66, :72-:75, :110; edit-values.cjs :29) plus STOP-S14-WRITER (rev3: replaced by STOP-S14-BW-CUT) | 2, 4 (E6), 8 |
| C7 | S14 6-8 working days; S15 4-6 (Fable's figure) with its paper first | 11, S15.9 |
| E-1 | scene custom-property risk; browser-check path; P3-B5 SC move | 7.4, 5 |
| E-2, E-3 | settings date filter; fork kind pinned for both readers | S15.3, S15.4 |
| E-4 | cell S13-R2-READOPT | 5 |
| E-5 | PRODUCER_REVISION restated; the ruling is D:859 (3), not (2); T29 checks a pre-S14 Yes | 4 (E2), 6.4 |
| G notes | control/new labels; S13-R2-DERIVABLE at a builder seat; pathspec sentence kept | 5, 6.5, header |
| NEW (found closing A6) | the write-time validator REFUSES a configuration load today, so R3 needs a wire-schema widening (E6), its own cells, a dated cut line and a STOP. SUPERSEDED in rev3: R3/E6 cut to D-S13-BW-CONFIGURATION (l2 E1) | 2.3, 7.2, 14 |

## 0. For the owner, in ten lines

1. Today a lift whose working weight is the word "hold" shows an empty weight box; S14 fills it with the last weight you
   really lifted on that lift (the same number the "Last time" line already shows), so you just check it and log.
2. After you log such a lift, the app offers to make that weight your working weight, with one Yes, like any other
   lift. Today it offers nothing for it (no error, nothing lost, just no offer).
3. Bodyweight ("BW") lifts get one line in the after-workout panel saying there is no weight to agree to; you keep
   logging them as today. (Saving them as "bodyweight" instead of a number is a later update of its own.)
4. The new-gym button (machines and cables start fresh, free weights keep their history) comes as S15, after S14 and a
   two-day trial on your phone (DECISIONS:915 (4)). Until then: type what you really lifted at the new gym and say Yes to "make that your working weight".
5. Nothing changes your weights without you: each new working weight still needs your Yes.
6. Also in S14: every Import refusal gets plain words (R12, if the PM keeps it). The smaller download (about 1.6 MB) is
   no longer in S14: it stays a later fix (rev5).
7. Because this changes how the app computes, it goes through the full sealed process (as S11 did), not the fast route,
   with the lighter review of DECISIONS:914 (3): one independent read per step.
8. Estimate (rev5): 4.5 to 6 working days to your phone from the PM's go (about 2026-10-16 to 2026-10-19 if work starts
   2026-10-12); S15 after your two-day trial.
9. You answered four questions Yes on 2026-10-10 (the checks on your PC for S14, a fresh copy of your history after
   every engine update, one yes/no check of your history, now also asking whether any weight is written as another
   word, and the PM approving new sentences for good); the PM now approves new sentences and sends you the list after
   each release; S14 has two. No question is waiting on you.
10. Your four decisions of 2026-10-08 (D:895) set the rules; the smaller choices inside them are the PM's, listed in
   section 9 with reasons, and the full list of new sentences is sent to you after release.

## 1. The user problem, in plain words

(1) HOLD. Some lifts came over from the old app with the word "hold" as their working weight (the old app stored a few
lifts as text: "hold", "BW", a per-set string). The weight box cannot show a word, so it is empty and he retypes the
number every time, although the app already prints it ("Last time: 140 lb x 8"). Owner decision 2026-10-08 (D:895 (1);
VERDICT-S11.md:558-561 (a)): "hold" loads show the last real logged load.

(2) TEXT LOADS GET NO OFFER. A lift whose working load is text gets no next-weight check: the engine refuses
NATIVE_LOAD_RECORD_INVALID (base_load) on purpose, because the earlier version minted an offer whose Yes was acknowledged
and then lost (Astra L20-B1, D:856 (1)). The refusal is never shown (today-entry.mjs:268). On the real-history check this
is T30 "3-ALL FAIL NATIVE_LOAD_RECORD_INVALID" on lower-body days (D:909; T30-3ALL-DIAG.md). Nothing is lost, but a text
lift never gets a next weight, and a bodyweight lift forces a made-up number into the log. S14 fixes the first and says
why for the second (R4); saving a bodyweight set as bodyweight is NOT in S14 (rev3, Fable l2 E1): D-S13-BW-CONFIGURATION,
section 14.

(3) NEW GYM: S15 (D:895 (3); PM ruling 2026-10-10, PQ-12 SPLIT), outlined in the Appendix.

(4) DEBTS IN S14. D-T30-REPIN-ORPHANS (every engine change makes earlier exports unimportable; D:899 (2), D:901);
D-S12-SCENE-DUP-1 (scene pictures ship twice, about 1.6 MB, D:909); D-S11-EN3-COPY (one Import refusal has no sentence,
D:878 (4)). Recorded, NOT paid in S14: D-S13-BW-CONFIGURATION (section 14). rev5: D-S12-SCENE-DUP-1 is CUT from S14 by PM ruling
(2026-10-11) and stays open; D-S14-INERT-CLAIM and the fixture note are recorded (section 15.3).

## 2. Current behaviour, traced in code

### 2.1 The card for a text working load (problem 1)

- Engine. rebuild/engine/today.cjs:89 genSession; :98 `w = q && q.newW != null ? q.newW : e.w` passes a text w ("hold",
  "BW") through; only `e.w == null` takes the BASELINE ASK (:103-:113); a text w takes the ordinary branch (:143,
  targetsFor, so reps are specified); `live` (:153-:161) and `runway` (:166-:192, :167) return null for a non-number; :193
  `prev: eraFresh(s, e.id) ? null : meta9` (progression.cjs:126-:135). Origin of the text loads: progression.cjs:138-:145,
  NEXT.md:3735-:3743, :4210-:4240; D:895 (1) fixes the meaning: "the weight I last really used".
- Capture. rebuild/m4/workout/engine-capture.cjs:23, :25-:29, :75-:81: a configured text becomes a cell whose display is
  the text and whose source is {kind:'configuration', configuration_key}; the plan line reads "hold x 8 reps".
- Card view. rebuild/m3/w7-preview/today/gym-model.mjs:366 `entry.load = load && Number.isFinite(load.value) ? load.value
  : null` (null for a configuration); gym-app.mjs:449 paints held.entry.load, else view.entry.load, else ''; gym-app.mjs:468
  `plan.hidden = !planLine || (view.entry.load !== null && view.entry.reps !== null)`. A hold card's reps are specified,
  so ANY prefill of view.entry.load hides the plan line (Fable A3; R1 takes that behaviour, option (ii)).
- The number is already on screen. gym-model.mjs:209-:221 readPrevious keeps each card.prev; :258-:280 previousAt reads a
  legacy {w, reps} with numeric w or a native entry with {value, unit:'lb'} loads, first hole ends the line, non-lb or
  non-positive gives null (legacy-only "hold" history, w null: null, :261-:263); :282-:285 "Last time: <load> lb x
  <reps>", painted at gym-app.mjs:474-:476.
- Logging. gym-model.mjs:502-:516 logSet refuses an empty box ("enter what you did") and always writes `load: { value:
  Number(load), unit: 'lb' }` via client.executeResumedWorkout action 'set' (:510).

### 2.2 The next-weight check for a text working load (problem 2): two engine clauses, one fold anchor

- Route. gym-model.mjs:538-:556 finish() -> after the acknowledged Close, today-entry.mjs:301-:302 afterClose -> :195
  checkNow -> host.check (rebuild/m3/w6/local/today-bindings.mjs:741) -> checkNativeLoad
  (rebuild/m4/workout/native-load-effects.cjs:1306, fold :862) -> evaluate (rebuild/engine/native-load.cjs:197).
- Clause 1, issuance (evaluate). :113 planVector gives ['hold', ...]; :114-:118 captured; :119 loadOf ->
  {kind:'configuration', configuration_key}; :131-:133 baseLoad. :230-:231 LEGACY_PENDING; :233-:234 forks /
  ERA_ORDER_BRIDGE_UNPROVEN; :237 planNow; :253-:255 PLAN_CHANGED / SET_COUNT / typed compare ('hold' = 'hold'); :256
  PREFIX_UNRESOLVED; :257 performedNumericEntry (performed.cjs:124-:130; PERFORMED_NUMERIC_LOAD_UNAVAILABLE only for a
  configuration performed load); :262 adoption branch, because performedLoadMatches (performed.cjs:244-:253; :241-:243
  "Mixed domains ... never match") never matches pounds to a key; :263-:264 VECTOR_ADOPTION_UNDEFINED; :265 kind
  adopt-observed; :266-:269 the S11 L20-B1 guard refuses RECORD_INVALID base_load over a non-numeric w. :156-:159 setLoads
  prints "no load" for a configuration; :173-:179 adoptReason.
- Clause 2, accept (Fable A2). derivable() :472-:548, run by transition() :560 on EVERY accept and every fold
  re-judgement. (c3) :524 `if ((d.kind === 'earn' || d.kind === 'adopt-observed') && !(typeof w === 'number' &&
  Number.isFinite(w))) bad('base_load');` with w = dec(load_basis.w) (:485); (c2) already admits a string w (:492-:493).
  The tail :545-:547 (actuals numeric, positive, equal; target = actuals; adopt-observed refused when w equals the target)
  holds unchanged for a text w. So narrowing :269 alone MINTS the offer and REFUSES ITS YES at :524 in the respond's
  pre-commit fold: the L20-B1 shape in a new coat.
- Apply and Undo need no change. The adoption transition :577-:591: :581 wSets array -> VECTOR_ADOPTION_UNDEFINED; :582
  prior = fieldImage(ex) (holds w 'hold'); :583 ex.w = target scalar; :587 wAt; :589 native_load_authority
  {kind:'adopted', prior}. compensate() :592-:620, adopted branch :614-:617, restores every field from authority.prior.
  (rev1's ":685 ff." was wrong: :685-:694 is the applyNativeLoadDecision try/catch wrapper.)
- Fold (FC03). The S8 anchor native-load-effects.cjs:754-:810: for adopt-observed without authority refs, :806 needs the
  consumed capture all numbers and equal to the base vector, so a 'hold' capture fails base_load. And :1117-:1121 re-runs
  FC01's own transition (rt.applyNativeLoadDecision, event 'accept') and holds the lift on RECORD_INVALID with a field in
  UNDERIVABLE (:17-:18, base_load). An accepted R2 record must pass BOTH :524 (via :1119) and :806 at every projection.
- Spec R9.13: :110 base_load "existing {value,unit:'lb'} or typed configuration, never an inferred magnitude"; :144-:145
  unequal vectors; :150 scalar adoption; :155 later base with no ordering op holds; :156 DERIVABLE (c3); :172 lost ack.
- Screen. today-entry.mjs:158-:165 NATIVE_LOAD_COPY (none = "No new weight to agree to yet. Your saved sets are kept.");
  :205-:207 keeps {lift, code}; :236-:237; :268 paint() never paints view.refusals.
- Bodyweight today: the athlete types some pounds (the T30 runner types 20 lb); the record says "20 lb"; the check
  refuses at :269.

### 2.3 The write-time validator of a set (Fable A6; new in rev2; in rev3 the reason R3 is cut)

- Path. gym-model.mjs:510 -> rebuild/m3/w6/public-client.mjs:371-:387 executeResumedWorkout -> :386 resumeCommands.prepare
  (rebuild/m4/workout/commands.cjs:44 `set: ['session-set', ..., ['load','reps','reserve']]`; :50-:64 copies the payload,
  no load check) -> bridge.execute('workout', ...) (rebuild/m3/w5/bridge.cjs requires the workout schema).
- The validator. rebuild/m4/workout/schema.cjs:66 `const load = value => quantity(value, 'lb') && value.value > 0;`,
  :72-:75 validSet, :110 for every session-set op. Corrections and original fields: rebuild/m4/workout/edit-values.cjs:29
  `if(field==='load')return quantity(value,'lb')&&(version===1||value.value>0);` (validValue :27-:35, used by assertPatch
  :36-:45, unionPatch :51-:58, assertOriginal :80-:87).
- Consequence. At 928ecd3 a set carrying {kind:'configuration', configuration_key:'BW'} is REFUSED at write time, while
  the READ side admits it (rebuild/engine/entered-load.cjs:9-:11, whose :2 comment still says "NONSHIPPING candidate";
  performed.cjs:12-:15). Prior art (Fable l2 A/C6, re-read by this seat at 928ecd3): the never-shipped patch pair
  rebuild/m4/spec/configured-load-candidate/run.cjs:16-:18 (schema.cjs's load predicate replaced by
  require('./entered-load.cjs') at :16; edit-values.cjs given enteredLoad for version 2 at :17-:18), the same pair at
  rebuild/m3/w6/test/browser-configured-load.mjs:51-:52; the old w6 form could send one (same file :107-:120, per Fable).
- Consequence for S14 (rev3; Fable l2 B2-B4). Saving a bodyweight set as bodyweight needs a WIRE-SCHEMA widening that
  every reader of a set's load sees, and the engine's own readers throw on a configuration performed load BY DESIGN
  (performed.cjs:127 performedNumericEntry, reached from progression.cjs typicalError/sessionScore/liftTrend/
  progressionTrend; the NATIVE-CARRIERS policy). Containing them is a byte in progression.cjs and/or performed.cjs, both
  inside STOP-S14-ENGINE-SCOPE, so rev2's dated T1 decision (7.2) already has its answer. R3 and E6 are CUT from S14 and
  recorded as D-S13-BW-CONFIGURATION with the full reader list (section 14). S14 writes no configuration load and moves
  no byte of schema.cjs or edit-values.cjs (STOP-S14-BW-CUT).

### 2.4 The carried debts

- D-T30-REPIN-ORPHANS (D:899 (2), D:901). local-source-profile.cjs:69-:79 qualify() needs the bundle's engine context to
  equal a reviewed mapping's; production-mapping.cjs:45-:68 pins treeSha256 over the 19 rebuild/engine modules (bc45ca73,
  :68); SOURCE_PINS (:5-:18) pin today.cjs (:16), merge, index, oracle-shim and engine-runtime by byte. S14 moves
  native-load.cjs, so it orphans his 2026-10-08 port (8753ab96). No registry row for an old engine (D:899 (2)).
- D-S12-SCENE-DUP-1 (D:909). design.cjs:65-:74 SCENE_ASSETS (503 KB, 545 KB, 99 KB, 43 KB) go into the stylesheet as
  data URIs (:801-:816, :1108-:1118) AND into app.js (build.mjs:500, :528-:529, globalThis.__earnedSceneAssets), read by
  scene.mjs:330-:334 (SCENE-ASSETS-MISSING at :332-:333 unless data:image strings).
- D-S11-EN3-COPY (D:878 (4); VERDICT-S11.md:595). import-screen.mjs:200-:203; LOCAL_SOURCE_NATIVE_LOAD_RECORD_INVALID has
  no sentence.

## 3. Proposed product rules (S14)

Every rule keeps four invariants, named per rule: (I-YES) no Yes is ever acknowledged and then lost, dropped or
silently overridden; (I-SILENT) no weight, target or setting changes without something on screen saying so;
(I-ACTION) nothing is written to the athlete's records without his own tap; (I-COPY) every new on-screen string is
PM-approved under the owner's standing Yes to OQ-4 (2026-10-10; D:905's pattern) and listed for the owner after release;
PM approval of each S14 string is a PM ruling (12.11), and until it is given no S14 string is approved. "Text working load"
means a lift whose stored w is a non-blank string (non-empty after trimming; rev5, Fable R2 section 5: the capture
writer's own rule, engine-capture.cjs:23 configuration(); a blank or whitespace-only w is not a text working load and is
refused RECORD_INVALID base_load at all three judgement sites); "bodyweight marker" means a text equal, ignoring case and surrounding
spaces, to "BW" or "bodyweight" (one shared predicate isBodyweightKey; the list is fixed in spec R9.14-A). Rules R6-R11
(the gym change) are S15's and live in the Appendix with their numbers kept. R3 is cut in rev3 (D-S13-BW-CONFIGURATION,
section 14); its number is kept, unused, so reviews of rev1/rev2 still read.

R1 HOLD CARD SHOWS THE LAST REAL LOAD. When the active set's prescribed load is a text working load that is not a
bodyweight marker, the weight box is pre-filled with the load "Last time" shows for that set position (gym-model.mjs
previousAt :258-:280: the governing last completed workout of that lift, original sets only, pounds only, first hole ends
the line). The prefill goes into view.entry.load (gym-model.mjs:366), so, exactly as on every numeric card, the plan line
"hold x 8 reps" hides once both boxes are filled (gym-app.mjs:468; Fable C3 option (ii), PM-decided: the box plus "Last
time: 140 lb x 8" is the honest pair, and keeping the plan line would add view state to a sealed look file). The "Last
time" line stays. The box holds exactly the load the "Last time" line shows, or stays empty (rev5, Fable R2 1.3): previousAt also returns a
load for a LEGACY row with a numeric w, so a hold card over legacy history in pounds pre-fills that w; only when no
previous row has a real weight (legacy-only history with no numeric weight, cell S13-R1-LEGACY) does the box stay empty
and the plan line show as today.
Nothing is logged until he taps Log; whatever is in the box when he taps it is what is saved. Keeps I-ACTION (prefill is
not a write), I-SILENT (the number in the box is the number in the Last time line beside it), I-COPY (no new words).

R2 TEXT LOADS GET AN ADOPTION OFFER. After a completed workout, a lift whose working load is a text that is not a
bodyweight marker, with every original set performed at one same positive weight and no per-set weight list, gets the
existing adopt-observed offer ("make that your working weight"), with one Yes as for any lift. Unequal weights stay
VECTOR_ADOPTION_UNDEFINED, a skipped set PREFIX_UNRESOLVED, a legacy pending item LEGACY_PENDING, a wSets array
VECTOR_ADOPTION_UNDEFINED (:581), exactly as today. The record's base is the configuration (base_load.scalar
{kind:'configuration', configuration_key:'hold'}, vector the key per set, FieldImage w 'hold'), the target is the numeric
weight. The SAME narrow shape is admitted at all three judgement sites, or none: issuance :266-:269, accept-time
derivable (c3) :524 (which the fold re-runs at native-load-effects.cjs:1119), and the fold's S8 anchor :806. On Yes the
existing transition sets w to that number (:583), stamps wAt (:587) and keeps the prior image (:582, :589); from then on
the lift is an ordinary numeric lift. Undo (compensate :614-:617) restores the field image, so the lift goes back to
"hold". Keeps I-YES (cells S13-R2-DERIVABLE and S13-R2-ACK-PROJ prove acknowledgement -> projection -> next card),
I-SILENT (R2b), I-ACTION (Yes only), I-COPY (existing approved template; R2b is a one-piece wording change).

R2b THE OFFER SAYS WHAT THE CARD SAID. setLoads (native-load.cjs:156-:159) prints a configuration position as its own key
("hold on every set") instead of "no load". Today no minted offer carries a configuration, so no existing sentence
changes; only the new R2 offers read "(the card said hold on every set)". Keeps I-SILENT, I-COPY (listed in section 10).

R3 (CUT from S14 in rev3; Fable l2 E1). rev2's "bodyweight sets log as bodyweight" is a data-format change that every
reader of a set's load sees, and the engine's own readers throw on it by design (2.3; section 14). It moves to its own
later engine slice, D-S13-BW-CONFIGURATION, not S15. In S14 a bodyweight card behaves exactly as today: the box is empty,
the plan line ("BW x 8 reps") shows, he types the number he types today (R1 never pre-fills it), Log saves it in pounds
through the unchanged validator, and the check answers E1 (a)'s bodyweight code instead of an offer (R4, R5) when every
set is logged at one same weight (unequal pounds answer VECTOR_ADOPTION_UNDEFINED as on any lift, as today). Nothing he
logs is lost or changed; no offer is minted for it, so there is no Yes to lose (I-YES); no configuration load is written
(STOP-S14-BW-CUT).

R4 THE PANEL SAYS WHY A BODYWEIGHT LIFT HAS NO OFFER. In the after-workout panel, a lift refused with
NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT (a lift whose working load is a bodyweight marker and whose sets were logged at one
same weight in pounds, E1 (a)) gets one line: "<Lift>: bodyweight sets have no weight to agree to. Your sets are saved."
Unequal pounds on a bodyweight lift answer VECTOR_ADOPTION_UNDEFINED as on any lift and get no R4 line, exactly as today.
Every other refusal stays unpainted, as today. The line keys on E1 (a)'s own code (PM ruling 12.2, 2026-10-10: the NEW
code, as builder and Fable recommended; a line keyed on RECORD_INVALID would paint for record defects that must stay
red). The code is in FC03's AFTER_STEP_2 set only (E2, l3 C2), so a bodyweight lift whose capture no longer matches the
plan shows PLAN_CHANGED (unpainted), never the line. Keeps I-SILENT, I-COPY (string 2).

R5 TEXT LOADS ARE NEVER GUESSED. No rule turns a text into a number by itself: R1 only pre-fills a box with a load he
logged; R2 only offers; "55.55.50"-style text with unequal sets stays VECTOR_ADOPTION_UNDEFINED; a bodyweight marker is
never adopted as pounds. Keeps I-SILENT, I-ACTION.

R12 IMPORT REFUSALS ALWAYS HAVE WORDS. LOCAL_SOURCE_NATIVE_LOAD_RECORD_INVALID gets one approved Import-screen sentence
(string 3). S14 adds no import family (S15's gym-change family brings its own code and sentence). Keeps I-SILENT, I-COPY.

R13 (debt; CUT from S14 in rev5 by PM ruling 2026-10-11: carried as D-S12-SCENE-DUP-1, E9 not done; the text below is
kept as that debt's spec input) THE SCENE PICTURES SHIP ONCE. The stylesheet keeps the four data URIs; scene.mjs reads the same URLs from the
computed custom properties (--scene-plate-ink, --scene-plate-dawn, --scene-mist, --scene-grain), unwrapping url("...")
before its data:image check (:332-:333), instead of a second copy in app.js; build.mjs drops the __earnedSceneAssets
prelude (:528-:529) and its P3-B5 page-bundle accounting comment (:530-:531) moves as a named SC move. Presentation only.
Expected saving about 1.6 MB per download (measured at the PM seat: app.js size before/after, a count of data:image URIs,
nothing printed, D:902). Keeps all four invariants trivially (no data, no words).

R14 (debt) THE OWNER'S RESTORE COPY IS RENEWED AT EVERY ENGINE SEAL. S14's seal chain ends with a fresh port of his
old-app history at the sealed commit and the T30 runner on it (PM seat, pass/fail lines only, nothing leaves the PC),
under the owner's standing Yes to OQ-2 (2026-10-10; the decrypted copy is deleted after each port). The product fix
that would stop re-pins orphaning exports is NOT in S14 (7.6); D-T30-REPIN-ORPHANS stays open with this procedural
mitigation named. S15 is expected to move no rebuild/engine byte; if it does, R14 applies to S15 too. Keeps I-YES
(his history is never stranded on a single phone).

## 4. Engine and data change list (S14 only; estimates; "lines" = product lines, tests separate)

Paths (l3 G4): in sections 4-5, "today/..." means rebuild/m3/w7-preview/today/... (so today/gym-model.mjs is
rebuild/m3/w7-preview/today/gym-model.mjs, and today/test/... is rebuild/m3/w7-preview/today/test/...), and
"import/..." means rebuild/m3/w7-preview/import/... (import/import-screen.mjs is
rebuild/m3/w7-preview/import/import-screen.mjs; it is not under today/).

| # | file (role) | change | rule | lines | tests |
|---|---|---|---|---|---|
| E1 | rebuild/engine/native-load.cjs (FC01, ENGINE; moves the tree pin) | THREE hunks only. (a) issuance :266-:269: adopt-observed over a non-blank (non-empty after trimming; rev5), non-bodyweight text w is minted; a blank or whitespace-only w answers RECORD_INVALID base_load (one predicate textLoad, engine-capture.cjs:23's rule, used by (a), (b) and (c)); a bodyweight-marker w with typed-pounds actuals answers a new code NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT (PM ruling 12.2, 2026-10-10). POSITION RULE (l3 C1): the new code is answered at :269's own place in FC01's order, AFTER :230-:231 LEGACY_PENDING, :253 PLAN_CHANGED, :254 SET_COUNT, :256 and :263 PREFIX_UNRESOLVED and :264 VECTOR_ADOPTION_UNDEFINED, i.e. only for a bodyweight-marker w with every original set performed at one same positive weight and no wSets; every earlier refusal keeps its code, so R30-CONFIGURATION-CAPTURE-STEP2 (FC12 :7361) stays byte-identical. (b) derivable (c3) :524: adopt-observed admits a non-blank non-bodyweight text w whose base is that configuration (the (c2) projection, :489-:493); earn still needs a numeric w; :546-:547 read and unchanged. (c) setLoads :156-:159 prints the key (R2b). One predicate isBodyweightKey for (a) and (b). NO transition hunk (:577-:591, :614-:617 already apply and undo) | R2, R2b, R4, R5 | 20-35 | FC12 |
| E2 | rebuild/m4/workout/native-load-effects.cjs (FC03) | TWO hunks. (1) one S8 arm beside :806 for adopt-observed over a configuration base (every original capture equals fields.w's key, base vector the key per slot, actuals all equal positive pounds = target; :761's null mapping for a non-number gets the parallel key mapping); UNDERIVABLE unchanged; :1117-:1121 untouched (it calls FC01, so E1 (b) reaches it). (2) (l3 C2) NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT joins AFTER_STEP_2 (:414-:415), one line, so at :1425 the refusal is "judged" and the fold's capture-vs-plan check (:1458) may replace it with PLAN_CHANGED, as for every other post-step-2 refusal (spec :127 "step 2 precedes every reader"). RULED: the code is NOT in BLOCKING (:16; no dispute), NOT in HELD_BACK (:20; the record spends nothing and waits for nothing), NOT in HOLD_CODES (:430; the lift is not held). PRODUCER_REVISION (:1486) moves: every Yes already on his phone is applied from its body with PRODUCER_REVISION_ABSENT_APPLIED (:1484-:1485), the move ruled not a STOP at D:859 (3) | R2, R4 | 26-53 | FC12, FA03 |
| E3 | rebuild/coach/NATIVE-LOAD-SPEC.md (paper; R9.14 part A; rev5: on the PRODUCT lane as committed in bd7f91b, PM ruling 2026-10-11, and 7ef8291 superseded for R9.14) | :156 (c3) rewritten for a configuration base of adopt-observed at all three sites; row "configuration adoption"; the bodyweight-marker list; the new code NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT in its code table, with E1 (a)'s position rule and E2 (2)'s FC03 classification (AFTER_STEP_2 only; not BLOCKING, HELD_BACK or HOLD_CODES). (rev2's "performed configuration load as a written shape" is cut with R3.) Fable read before any FC01/FC03 byte. Part G is S15's. rev5: R9.14-A (1) reads "non-blank" (:626, engine round 3) | R2, R4, R5 | paper | - |
| E4 | rebuild/m3/w7-preview/today/gym-model.mjs (sealed) | :366 R1 prefill from previousAt (into view.entry.load), never for a bodyweight marker. logSet :502-:516 UNCHANGED (rev2's bodyweight write is cut with R3) | R1 | 15-30 | GYM |
| E5 | CUT (rev3, with R3) | no bodyweight box: gym-app.mjs, screens.template.html and preview.css are not edited by S14 (R1 needs no view change under option (ii)) | - | 0 | - |
| E6 | CUT (rev3, with R3) to D-S13-BW-CONFIGURATION | schema.cjs and edit-values.cjs are not edited by S14; the write validator keeps refusing a configuration load (STOP-S14-BW-CUT). The reader enumeration moves to section 14, keyed on readers of a set's load (Fable l2 E5) | - | 0 | - |
| E7 | today/today-entry.mjs | paint() :268: the R4 line for NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT only | R4 | 10-20 | FA03 |
| E8 | import/import-screen.mjs | REFUSAL_SENTENCE for LOCAL_SOURCE_NATIVE_LOAD_RECORD_INVALID | R12 | 1-3 | import copy |
| E9 | CUT (rev5, PM ruling 2026-10-11) to D-S12-SCENE-DUP-1; was today/scene.mjs, today/build.mjs | read the custom properties (unwrap url()); drop the prelude; move the P3-B5 accounting | R13 | 10-20 | scene or browser-check, A1, SC |
| E10 | rebuild/m4/import/production-mapping.cjs | treeSha256 re-pin (:68; off-seat method D:841, then P3-M1 at the PM seat) | E1 | 1 | P3-M1 |
| E11 | rebuild/coach/engine-revision.cjs | ENGINE_REVISION -> M2-S14-HOLD@<receipt 16 hex> at the seal (T23) | seal | 1 | coach |
| E12 | copy lock | section 10 strings under the approval line; red-first pins on the R2b piece and on every existing adoption sentence (CL-ENGINE-OUTPUT) | I-COPY | 6-15 | copy-lock |
| E13 | tooling | S14.json (S14-REGEN), b-package.cjs ids, rebuild.yml --package S14 and its Today step, receipts, VERDICT-S14; rev5: S14-REGEN ported from S13-REGEN, S13 retired by supersession in the D:920 shape (runbook 3.3-3.4) | seal | tooling | REGEN |
| E14 | T30 runner (outside the product) | bodyweight lifts: it keeps typing pounds as today and lists them as ALLOWED_NO_OFFER with NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT (12.2, 12.3); 3-ALL expects an offer for equal-weight hold lifts; RECORD_INVALID stays a red for everything else; rev5: kept on the PM's PC, outside the lane (runbook S1 (f), S6) | R2, R4 | runner | Fable read |

TOTAL: about 91-178 product lines (engine: one file, three hunks; FC03: two hunks) and 250-400 test lines. No byte of
the five protected engine files, today.cjs (SOURCE_PINS :16), writers.cjs, progression.cjs, plan.cjs, entered-load.cjs
or performed.cjs is planned; one needed is a STOP (8). No byte of schema.cjs or edit-values.cjs and no writer of a configuration load is
planned either (STOP-S14-BW-CUT).

## 5. Test plan

Red first: each cell observed RED on 928ecd3 (or, marked "new", on the previous round's bytes) before the change that
turns it green; no assertion weakened; a cell pinning spec-violating behaviour is CORRECTED and recorded (as
R28B-CONFIGURATION-CAPTURE at D:856 (1) (a)). "control" = green both sides by design. Files: FC12 =
rebuild/m4/spec/native-load-options.test.cjs; FA03 = rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs; GYM =
rebuild/m3/w7-preview/today/test/gym.test.mjs;
LOOK = look cells (SC pattern) and pack states (6.6). rev2's SCH (schema/edit tests) and IMP (configuration-set import)
files are not touched in rev3: their cells left with R3. rev5: cell ids keep the S13- prefix exactly as committed in
bd7f91b (D:918 renumbered the slice, not the cells).

| cell | rule | red on 928ecd3 because | green means |
|---|---|---|---|
| S13-R1-PREFILL | R1 | a hold card with a native last workout at 140 lb x 8 paints an empty box (:366) and the plan line | box 140; plan line HIDDEN (:468, as on any numeric card); Last time unchanged; nothing written before Log |
| S13-R1-PERPOS | R1 | new | prefill per position; a hole ends it; the set after a hole stays empty with its plan line shown |
| S13-R1-LEGACY | R1 | control | legacy-only history: box empty, plan line "hold x 8 reps" shown |
| S13-R1-BW-NOFILL | R1, R5 | control | a bodyweight card is never pre-filled with pounds; box empty and plan line shown, as today |
| S13-R2-OFFER | R2 | RECORD_INVALID base_load at :269 | adopt-observed offer, base configuration 'hold', target 140 x n |
| S13-R2-DERIVABLE | R2, I-YES | applyNativeLoadDecision (:685) on the R2 record shape refuses RECORD_INVALID base_load at :524 | 'applied', w = target, authority 'adopted' with prior.w 'hold'; pure native-load.cjs, builder seat |
| S13-R2-ACK-PROJ | R2, I-YES | NEW cell (rev3, Fable l2 E2) on a 'hold' fixture (text w 'hold', non-bodyweight, equal real sets at 140): no offer at :269 today; with :269 narrowed alone the Yes is refused at :524 at accept (respond pre-commit fold, :1119), not "at the next projection" | Yes acknowledged and applied by the respond's fold; every later projection keeps it (neither :524 via :1119 nor :806 holds); next card 140; Undo restores 'hold' |
| R28B-CONFIGURATION-CAPTURE (EXISTING, FC12 :6861; D:856 (1) (a)) | R5 | control; expected code moves red-first (12.2 ruled the new code): w 'BW', performed at 100 | still NO adopt-observed offer over the configuration w, refs []; its expected code moves from RECORD_INVALID base_load to NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT as a declared red-first move; the assertion is not converted, narrowed or replaced. Kills M1 |
| R30-L20B1-ACKNOWLEDGED-OFFER-SURVIVES (EXISTING, FC12 :7226; D:856 (1)) | R5, I-YES | control; expected code moves red-first (12.2): w 'BW', sets 2, two complete sets at 45, host v1 and typed v2 | the configured lift still mints NO offer (code RECORD_INVALID base_load -> NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT, refs []); its numeric control (w 40) still adopts 45. Kills M1 |
| R30-CONFIGURATION-CAPTURE-STEP2 (EXISTING, FC12 :7361) | R5 | control, UNCHANGED (byte-identical; E1 (a)'s position rule): w 'BW', performed at 100/95/90 | still VECTOR_ADOPTION_UNDEFINED [C1 Close]; performed at 100 with the last slot unresolved still PREFIX_UNRESOLVED; never PLAN_CHANGED |
| R30-L20B1-HOST-CONFIGURATION-NO-ADOPTION (EXISTING, FA03 :2205; D:859 (1)) | R5, I-YES | control; expected code moves red-first (12.2): demo-press w 'BW', D1 at 45 on both sets, durable host | check() still shows NO offer (c3); the refusal code it carries moves to NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT. Kills M1 |
| S13-R2-READOPT | R2, I-YES | new | adopt, Undo, adopt, Undo: each Undo restores 'hold' (:614-:617), no COMPENSATION_DESCENDANTS (Fable E-4) |
| S13-R2-LOST-ACK | R2, :172 | new | ack lost after the durable commit: found, folded, no second response |
| S13-R2-UNEQUAL / -PENDING / -WSETS | R2, R5 | control | VECTOR_ADOPTION_UNDEFINED / LEGACY_PENDING / SET_COUNT or VECTOR (:581), as today |
| S13-R2-FOLD-FORGERY | R2 | new | a configuration base the capture did not carry, or a target unlike the actuals, refuses base_load / target_load |
| S13-R2-BWKEY | R2, R5 | control for 'BW'; red for the new code | 'BW' / 'bodyweight' / ' bw ' never minted nor admitted at :524; typed equal-pounds log -> NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT; typed unequal pounds -> VECTOR_ADOPTION_UNDEFINED, no R4 line |
| S13-BW-PLANCHANGED | R4, I-SILENT | new (l3 C2; the code does not exist at 928ecd3; red on the round's bytes if the code is left out of AFTER_STEP_2) | a bodyweight lift at the fold's capture-vs-plan mismatch (:1425, :1458) shows PLAN_CHANGED, not the R4 line; the bodyweight refusal never disputes (not BLOCKING), never spends and waits (not HELD_BACK), never holds the lift (not HOLD_CODES) |
| S13-R2B-WORDS | R2b | setLoads prints "no load" | "(the card said hold on every set)"; every existing sentence byte-identical (CL-ENGINE-OUTPUT) |
| S13-R4-LINE | R4 | paint() draws no refusal | one approved line for a lift refused NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT; any other code (RECORD_INVALID included) draws nothing |
| S13-R12-WORDS | R12 | no sentence line for the code (at import-screen.mjs:202-:203 an unknown code yields no sentence and nothing is pushed) | the approved sentence |
| S13-R13-ONCE (CUT in rev5 with R13) | R13 | app.js carries four data URIs (PM seat, count and size only, D:902) | zero in app.js; scene draws (browser-check path if jsdom does not cascade, Fable E-1); stylesheet unchanged |
| S13-LOOK-PANEL | R4, D:817 | no prototype state | pack state + accept runs per platform as listed pack edits (rev2's S13-LOOK-BW is cut with R3) |
| CL-COMPOSED-DATA | I-COPY | new | the lock stays green on "hold" (R2b piece) and the lift name shown as data and reddens on an unlisted literal |
| S13-FUZZ | R2 | new | round-30 fuzz plus configuration bases (no configuration performed sets: none can be written): never throws, other lifts unaffected |
| S13-T30 | R2, R4 | 3-ALL FAIL RECORD_INVALID on L days (D:909) | all PASS on the fresh post-seal port (PM seat), bodyweight lifts as ALLOWED_NO_OFFER with their own code (E14) |

rev5: 22 new cells after the R13 cut (S13-R13-ONCE leaves; the rounds added the FUZZ sub-cells and WHITESPACE-W,
section 15.2). rev4: 23 new cells, the FOUR EXISTING controls above named (l3 C1; rev3 named two), and 8 mutants (rev3: 22 cells, 2 named
controls, 7 mutants; rev2: 28 cells, 8 mutants; the five S13-R3-* cells, S13-LOOK-BW and M11 left with R3). No existing
assertion is narrowed: no offer stays no offer in all four existing cells; three move only their expected code,
red-first, and STEP2 moves nothing.

Mutants, each killed by a named cell: M1 bodyweight check dropped (S13-R2-BWKEY, and the existing controls FC12 :6861
R28B-CONFIGURATION-CAPTURE, FC12 :7226 R30-L20B1-ACKNOWLEDGED-OFFER-SURVIVES and FA03 :2205
R30-L20B1-HOST-CONFIGURATION-NO-ADOPTION); M2 S8 arm accepts any configuration capture (S13-R2-FOLD-FORGERY);
M4 prefill from the plan (S13-R1-PREFILL); M7 R4 line for every refusal (S13-R4-LINE); M8 setLoads leaks into a numeric
sentence (S13-R2B-WORDS); M9 :524 narrowed, :806 not: the fold holds the lift on the next projection, the L20-B1 loss
(S13-R2-ACK-PROJ); M10 :269 narrowed, :524 not: minted, Yes refused at accept (S13-R2-DERIVABLE, S13-R2-ACK-PROJ); M13
(rev4, l3 C2; M7's family) the bodyweight code left out of AFTER_STEP_2 or put in BLOCKING, HELD_BACK or HOLD_CODES
(S13-BW-PLANCHANGED); a bodyweight code answered before :263/:264 (S13-R2-BWKEY's unequal-pounds case and the unchanged
control R30-CONFIGURATION-CAPTURE-STEP2) is M1's position twin, killed there. M11
(write predicate) is cut with R3 and belongs to D-S13-BW-CONFIGURATION. M3/M5/M6/M12 are S15's.

## 6. Seal plan (the full process; S11 is the model: S11-NATIVE-LOAD-BRIEF.md section 11, S11-SEAL-RUNBOOK.md, VERDICT-S11)

6.1 Identity and parent. Package id M2-S14-HOLD (rev5; the PM names it in the THEME line), lanePackage 'S14', slug
s14-hold. Parent: the sealed S11 (receipt D:896, artifact bde69f15, seal tip 7c79ef1). rev5: S12 was retired by
supersession at D:920; its bytes are carried by M2-S13-POLISH (THEME D:918, released D:921 at 7347ba6), the one UNSEALED
--ci child, which holds the single parent claim. S14 carries every byte S13 declared, re-measured from the S11 seal, and
retires S13 by supersession in the D:920 shape (runbook 3.3). S14 also pays what a sealed S12 or S13 would owe
(S12-LOOK-BRIEF.md section 12, :330-:342): its own GATE-SUPERSESSION token line mirroring D:873 (NOT zero-engine: S14 moves
native-load.cjs, so the mirrors are S11's shape; runbook 3.7), the ancestor re-pin ruling D-S12-ANCESTOR-REPIN, the gate
leg (C2 D3), and a ruling that the coach ENGINE_REVISION moves (it must: E1). rev5: the PM pays those three as ledger
lines before THEME (runbook S9 (3)-(5), bodies drafted there).

6.2 Children. S13's 40 (S11's 39 + s12-look, carried through S13.json; rev5), argv byte-equal; the S14 cells go inside the existing native-load-fc12,
today-17 and import children (rev2's schema/edit test files left with R3). One new child only if the builder needs a
new test file (proposed name s14-hold), ruled by the PM at T3. 40 or 41 children. Every needle from a hosted
observation (6.4), never typed.

6.3 Product map. S14.json by an S14-REGEN (rev5: S13-REGEN ported, with the ancestor-release walk and --worktree; runbook
3.4): S13's 341 paths carried (rev4 said S12's 333), plus the edited ones of section 4
(native-load.cjs and production-mapping.cjs as engine-tier edits; native-load-effects.cjs, gym-model.mjs,
today-entry.mjs, import-screen.mjs, engine-revision.cjs as edited; any new file as new; rev5: scene.mjs and build.mjs leave
with R13, and the spec paper rebuild/coach/NATIVE-LOAD-SPEC.md is declared on purpose, by name, section 15.4). rev2's
schema.cjs, edit-values.cjs, gym-app.mjs, screens.template.html and preview.css are NOT edited (cut with R3). The copy
lock corpus re-measured with the section 10 strings under an approval line.

6.4 Steps (S11 numbering).
- PART A. T0 inputs recorded (928ecd3, chain tip, S12.json, S11/S12 sealed values). T1 ENGINE CLOSURE: paper day first
  (spec R9.14 part A and the look pack draft for the panel state, Fable read; rev2's E6 enumeration and R3 decision are
  gone with the cut), then FC01/FC03 rounds red-first, each read blind by Fable AND Claude (Opus) (D:843 (1), D:851),
  Astra if available, never waited for (D:844 (3)); CLOSING RULE as S11 rev11 (three closing reads of the same bytes, no
  product finding). rev5: SUPERSEDED by D:914 (3) and D:915 (2): red-first cells and ONE Fable read per step, no
  closing-rule rounds and no Claude (Opus) or Astra seat; engine rounds 1-3 ran so (section 15.2). T2 owner questions before any byte depends on them: OQ-1..OQ-4 all answered Yes on 2026-10-10 (OQ-3
  widened, OQ-4 standing), so no owner question gates T3; the PM's approval of strings 2, 3 and the R2b piece (12.11)
  is what T3's copy-lock approval line records. T3: S14-REGEN, S14.json, 'S14' in the runner ids, rebuild.yml
  standing step --package S14 and its Today step (D:821), re-pin by the off-seat method (D:841), bundle inventories, copy
  lock with the approval line, pack edits and baselines (6.6), the D-W7IMPORT-FLAKE-1 hunter run. T4 every child observed
  at the last product byte (local w7-import children wait for D:912's @noble/ciphers). T5 THEME, BRIEF ACCEPTED BY SHA,
  GATE-SUPERSESSION. T5b hosted observation on a never-merged obs/s14-<n> branch (workflow file Fable-read first), both OS
  green. T6 S14.json final, needles from the published lines only.
- PART B. S11-SEAL-RUNBOOK T7..T28 step for step (an S14 runbook drafted first, Fable USABLE read; rev5: rebuild/lanes/b/S14-SEAL-RUNBOOK.md, Fable S0 read
  USABLE-WITH-CHANGES, R1-R6 applied), unchanged in shape:
  merge-forwards, EXPORT FREEZE, --ci, commit A, --full with the private census (PM seat), CI-1, Fable seal read,
  POSTFIX-ACCEPTANCE, review envelope, AUTHORIZED --full, receipt C1 never pushed alone (D:897), VERDICT-S14, coach
  ENGINE_REVISION C3, byte-identity --full, C4, CI-2 both OS, fast-forward (slice deploys under D:816 (2)), L6 line.
- PART C. T29 phone proof on the deployed slice: hold prefill with the plan line hidden, Yes, kill/reopen, next card; a
  Yes recorded before S14 still applied after reopen (E2); a bodyweight lift logged at one same weight in pounds as
  today and its panel line; both themes. T30 FRESH PORT at the sealed commit (OQ-2, standing Yes 2026-10-10; decrypted
  copy deleted after), engine tree printed equal to the new pin, the updated T30 runner (E14) all PASS incl. 3-ALL;
  the 2026-10-08 bundle is expected to refuse SOURCE_ENGINE_CONTEXT_UNPROVEN and is kept. T31 plain-words handoff and the
  copy list.

6.5 PM-seat runs (protected engine checks, pass/fail lines only, nothing leaves the PC). Grant (g) of D:816 (1) covers
"the S10, S11 (NATIVE-LOAD reseal) and CUI look seals" only; it does NOT cover S14. The owner granted S14 on 2026-10-10
(OQ-1, "Yes (Recommended)": the PM may run the protected engine checks on his PC for S14, pass/fail lines only). Covered
by that grant, and by nothing wider:
P3-M1 red then green (re-pin), m4-import-production pair, engine-provider pins, copy.test A1 and the scene build cell
(they load engine/index.cjs), FC12 whole with the sharded fuzz, every guard-tripped child at T4, T8/T12 --ci,
T14/T20/T24 --full with the private census junction (restored for the run, removed after; rmdir every junction before
any worktree removal, D:912 RULE), and S13-R13-ONCE's size count (cut in rev5 with R13). S13-R2-DERIVABLE is a pure native-load.cjs cell and runs
at a builder seat (it loads no engine/index.cjs). Grant (h) of D:819/:821 is one-check-only; T30 and the fresh port run
under OQ-2 (standing Yes, 2026-10-10: a fresh port after every engine update, the decrypted copy deleted after, pass/fail
lines only); the hold/BW unfinished-step check and the other-word check (any lift whose weight is written as a word
other than hold or BW), yes/no each, run once under OQ-3 (Yes, 2026-10-10, widened the same day; yes/no kept only).

6.6 Look law (D:817; Fable C5). "Baselines of record come only from the pack prototype, so any new app state gets a
prototype state plus accept runs on the machine of record per platform as listed pack edits", each listed in the package
and shown to the owner (his 2026-09-25 answer "Yes, list each (Recommended)", D:817). S14 adds exactly ONE new app
state (rev3, Fable l2 C5): the after-workout panel with one bodyweight line (R4). rev2's state (1), the set card with a
bodyweight box, is cut with R3. R1 adds none (a filled box with the plan line hidden is the existing numeric-card state);
a bodyweight card is unchanged. For it: a prototype state in the approved design pack, accept runs per platform on the
machine of record, the baselines declared as listed pack edits (SC-n ids, red-first), never a rebaseline exception;
look CI in its own workflow file (look-gates.yml) as for S12. If the pack cannot carry the state without a design
change the owner has not seen, that is STOP-S14-LOOK.

6.7 What the seal does NOT do. No change to seed, migrate, merge, index or oracle-shim; no change to today.cjs (its
SOURCE_PINS byte pin stays), entered-load.cjs or performed.cjs; no registry row for an old engine; no repair of the
capture multi-entry refusal (engine-capture.cjs:79, Joe's call per S11 section 10); no "55.55.50" representation work
(R5); no gym-change byte (S15); no byte of schema.cjs or edit-values.cjs, no bodyweight box and no writer of a
configuration load (D-S13-BW-CONFIGURATION, section 14).

## 7. Risks

7.1 REOPENING THE SEALED NATIVE-LOAD SET (highest). E1/E2 touch FC01 and FC03, which took 34 review rounds to close
(D:870). DERIVABLE (c3) and the S8 anchor are where L20-B1 lost a Yes, and rev1 missed one of the two engine clauses
(Fable A2): the lesson is that the R2 shape must be judged identically at issuance (:269), accept (:524, re-run by the
fold at :1119) and S8 (:806), and cells must exercise each site alone (S13-R2-DERIVABLE, M9, M10). Mitigation: spec
R9.14 part A on paper first; the new arm is the narrowest possible (one kind, one base shape, keys equal to fields.w,
actual all equal); the bodyweight code is answered at :269's own position and classified AFTER_STEP_2 only (E1 (a),
E2 (2); l3 C1, C2), inside the same FC03 rounds; FUZZ and mutants M1/M2/M9/M10/M13; three closing reads of the same
bytes (rev5: one Fable read per round under D:914 (3); rounds 1-3 each PASS, section 15.2). Budget: 3 to 6 rounds. If round 6 still finds a product defect in E1/E2, the PM cuts R2 from S14 (R1, R4,
R12-R14 still ship; text loads keep no offer) and records it.

7.2 CONFIGURATION LOADS IN WRITTEN HISTORY: CUT, NOT CARRIED (rev3; Fable l2 B2-B4). rev2 carried R3 to a dated decision
at the end of T1's paper day: cut R3 if any reader would throw on a configuration set and could not be contained without
a byte in the protected engine files, today.cjs, entered-load.cjs or performed.cjs. Fable's re-read answered that
decision at 928ecd3: performedNumericEntry throws PERFORMED_NUMERIC_LOAD_UNAVAILABLE for a configuration performed slot
(performed.cjs:127) by design, and progression.cjs typicalError (:574; it pools every lift, so one bodyweight set would
throw for every lift), sessionScore (:657), liftTrend (:697) and progressionTrend (:802) reach it without a catch, with
uncaught callers on Today, energy, debrief, coach, earn, volume and sleep (section 14). Containing them is a byte in
progression.cjs and/or performed.cjs, inside STOP-S14-ENGINE-SCOPE. Carrying R3 to T1 would buy a paper day that ends in
that answer and then unwind E4's logSet half, E5, E6, five cells, M11, a look state, a string and two STOPs, so R3 is cut
NOW and recorded as D-S13-BW-CONFIGURATION (section 14). Remaining risk in S14 from configuration loads: none written, so
none read (STOP-S14-BW-CUT guards it). The cost is named, not hidden: bodyweight lifts keep a typed number in his log
until that slice ships. If the PM nevertheless keeps R3, this condition must be widened to progression.cjs and the
policy change briefed as its own E-item with its own rounds and estimate (+3-5 days, S11 FC09-class, wider re-pin;
Fable l2 D3); rev2's "6-15 lines" cannot stand.

7.3 NEW APP STATES UNDER THE LOOK LAW (D:817; Fable C5). ONE new state (6.6: the panel line) needs a prototype state and
per-platform accept runs as listed pack edits; the look cells (SC pattern) would otherwise redden undeclared. Mitigation:
the pack edit is drafted in T1 alongside the paper and lands in T3; STOP-S14-LOOK if it needs an unseen design change.

7.4 THE SCENE READ (R13; Fable E-1; rev5: moot in S14, R13 is cut to D-S12-SCENE-DUP-1). scene.mjs:332-:333 throws SCENE-ASSETS-MISSING unless the assets are data:image
strings; the computed property returns url("data:...") to unwrap, and jsdom may not cascade custom properties, so
S13-R13-ONCE may need the browser-check path; the P3-B5 accounting (build.mjs:530-:531) is a named SC move. If the scene
cannot read them on a real phone in both themes, R13 is cut (presentation only; the debt stays open).

7.5 WRITER FENCES AND SEALED CELLS. The S10 writer fence, P3-EN3, the sealed-inventory fence and the copy lock may redden
by design; each move is declared red-first with its own SC-n id, never a rebaseline exception. No new writer, no family.

7.6 D-T30-REPIN-ORPHANS IS ONLY MITIGATED. The real fix ("re-derive and compare": at import, run the current engine over
the bundle's own material and admit only if the verdict digests equal the sealed ones) needs a design over the port's
oracle and migrate path that a builder seat cannot read, and a grant. Size M-L, its own spec and package. Until then
every engine seal ends with a fresh port (R14); a phone lost between a seal and its port waits for a PM re-port.

7.7 OWNER DATA UNKNOWN TO THIS SEAT. Whether his "hold" lifts carry legacy pending flags (then R2 gives LEGACY_PENDING, no
offer, until that pending item clears), and whether any text load is neither "hold" nor "BW". BOTH are covered by the
owner's Yes to OQ-3 (2026-10-10), widened the same day: one check, on his PC, reports yes/no for any hold/BW lift with an
unfinished old-app step AND yes/no for any lift whose weight is written as a word other than hold or BW (yes/no kept
only). The answer, when it comes, changes no S14 rule: any other word is a non-bodyweight text load under R1/R2, never
guessed (R5). If the answer is "yes, another word exists", the builder adds that word as a second S13-R2 fixture key
beside 'hold', and nothing else. No owner question is left open here; only the check's two yes/no results are pending
(PM seat, OQ-3), and neither moves a rule, cell or STOP.

7.8 LOCAL INSTALL GAP (D:912). After the 2026-10-10 worktree slip, @noble/ciphers 2.4.0 has no copy left on the PC and the
local w7-import children (P3-B2/P3-B5) are red until it is restored; that fetch is already with the owner under D:912.
S14's T4 local observation of those children waits for it; hosted CI (T5b) is not affected. rev5: the owner ruled the fetch at D:913 (1); the runbook's T4
step (S8b) observes the local w7-import children with D:912's @noble/ciphers in place.

7.9 SCHEDULE. One build track now (the gym change is S15; bodyweight-as-bodyweight is D-S13-BW-CONFIGURATION). One cut
line is left, a dated decision, not "may": R2 at round 6 (7.1). R3 was cut in rev3 (7.2). R12-R14 ride any seal (rev5: R12 and R14; R13 is cut).

7.10 SLIPS. Every reviewer and builder brief repeats the hard limits; git grep exclusions as pathspecs only (D:903 (3));
deployment checks read the index page and asset names only, never the bundle bytes (D:902); S13-R13-ONCE is a PM-seat
count of data URIs and a byte size, nothing printed; rmdir every junction before removing a worktree (D:912).

## 8. STOPs (each stops the step it names and goes to the PM)

- STOP-S14-ENGINE-SCOPE: any engine byte outside native-load.cjs's three E1 hunks, any byte of the five protected files,
  today.cjs, entered-load.cjs or performed.cjs.
- STOP-S14-STRING: any on-screen string not in section 10 as PM-approved (under the owner's standing Yes to OQ-4; the
  approval is PM ruling 12.11), or any change to an approved native-load string (the D:842 approval is bound to the
  strings).
- STOP-S14-YES: any cell showing an acknowledged Yes not applied at the respond's fold or at any later projection (I-YES),
  including a Yes recorded before S14 (E2).
- STOP-S14-BW-CUT (rev3; replaces rev2's STOP-S14-READER and STOP-S14-WRITER, which guarded the cut R3): any byte that
  writes a configuration load to a set, widens the write validator (schema.cjs :66/:72-:75/:110, edit-values.cjs :29),
  adds a bodyweight box, or otherwise starts D-S13-BW-CONFIGURATION inside S14, found at any step.
- STOP-S14-LOOK: a new app state that the pack cannot carry without a design change the owner has not seen (6.6).
- STOP-S14-GRANT: any PM-seat step outside the owner's answers of 2026-10-10: OQ-1 (protected engine checks for S14,
  pass/fail lines only), OQ-2 (a fresh port after each engine update, decrypted copy deleted after, pass/fail lines
  only), OQ-3 (one check, run once: yes/no for any hold/BW lift with an unfinished old-app step and yes/no for any lift
  whose weight is written as a word other than hold or BW; yes/no kept only). Anything wider goes back to the owner.

## 9. Questions

### 9.1 Owner questions (only his calls: private data on his PC, and copy approval; each yes/no, with the PM's rec)

OWNER RULINGS, Joe, this chat, 2026-10-10: OQ-1..OQ-3 answered "Yes (Recommended)", the OQ-3 widening and OQ-4
answered "Yes" (all to be written to DECISIONS.md by the PM, 12.10). NO OWNER QUESTION IS OPEN for S14.

- OQ-1 CHECKS ON YOUR PC: ANSWERED YES. The PM may run the protected engine checks on his PC for S14, pass/fail lines
  only, nothing leaves the PC. Extends grant (g) of D:816 (1) to S14 only (S15 asks again if it moves an engine byte,
  S15-OQ-B).
- OQ-2 FRESH HISTORY COPY AFTER EACH ENGINE UPDATE: ANSWERED YES, STANDING. A fresh port of his old-app history on his PC
  after every engine update, the decrypted copy deleted after, pass/fail lines only. Covers R14 and T30 for S14 and every
  later engine seal (replaces the per-port words of D:901 for this purpose).
- OQ-3 ONE CHECK OF YOUR HISTORY: ANSWERED YES, WIDENED (2026-10-10). One check, on his PC, run once: yes/no whether any
  'hold' or 'BW' lift still has an unfinished old-app step, AND yes/no whether any lift's weight is written as a word
  other than hold or BW; only the two yes/no answers are kept (grant (h) shape, D:819). The widening closes 7.7's second
  unknown; neither answer moves an S14 rule (7.7).
- OQ-4 NEW SENTENCES, FOR THIS UPDATE AND LATER ONES: ANSWERED YES, STANDING (2026-10-10). The PM approves the new
  on-screen copy for every slice and sends him the full list after each release; any he flags is changed in a later
  fix. Asked once as a standing rule, like OQ-2, and never again (D:905 (1) covered the look's strings only; the same
  shape had been asked at :842, :895, :905). For S14 that is two sentences (section 10, strings 2 and 3) plus the short
  wording piece "hold on every set", approved by the PM (12.11) before T3's copy lock; until that PM approval no S14
  string is approved (STOP-S14-STRING). It also covers S15's sentences (S15.7), so S15-OQ-A stays removed.

Already with the owner, not new and not repeated here: the @noble/ciphers dependency fetch (D:912). Gym-change owner
questions moved to Appendix S15.10.

### 9.2 Product choices decided by the PM (PM ruling, 2026-10-10)

Basis (Fable A4): the owner's decisions of 2026-10-08 (D:895 (1) hold shows the last real logged load; (3) machines and
cables start fresh at a new gym) set the rules; "Take your pick for everything" answered that day's questions and is not
a standing delegation. The choices below sit inside those rules and the PM's role; they are told to him in plain words
with the copy list after release (D:905 (1) pattern), and any he flags is changed in a later fix.

- PQ-1 "Last real load" (R1) = the Last time line's load per set position. Builder default kept.
- PQ-1b The plan line under a pre-filled hold box hides, as on any numeric card. Fable C3 option (ii), taken.
- PQ-2 Offers for every text except bodyweight markers (R2). Builder default kept (Fable: sound; equal real weights and
  his Yes are still needed).
- PQ-3 Bodyweight lifts get one panel line (R4). rev2's "log as bodyweight" half (R3) is CUT in rev3 (Fable l2 E1) to
  D-S13-BW-CONFIGURATION, its own later engine slice (section 14); he keeps typing a number for them, as today.
- PQ-4 Offer wording "the card said hold on every set" (R2b). Builder default kept.
- PQ-11 (rev5: SCENE-DUP is CUT to D-S12-SCENE-DUP-1 by PM ruling 2026-10-11; EN3-COPY (R12) as runbook S1 (c) rules)
  SCENE-DUP and EN3-COPY ride in S14; REPIN-ORPHANS mitigated by R14, product fix later (7.6). Builder default kept
  (Fable F: do not cut R12 or R13).
- PQ-12 SPLIT: S14 = engine/hold (+ the bodyweight panel line; rev3) + D-T30-REPIN-ORPHANS + D-S12-SCENE-DUP-1 (6-8
  working days); S15 = the gym change, outlined in the Appendix with Fable's C2 fixes and Fable's 4-6 day estimate,
  not briefed in full yet (Fable F). rev5: renumbered S14/S15 at D:918; SCENE-DUP cut; 4.5-6 days.
- PQ-5..PQ-10 (gym change): Appendix S15.10.

## 10. New on-screen strings (ASCII; whole strings only, per CL-COMPOSED; rev5: string 2 and the R2b piece APPROVED by the PM under OQ-4's standing Yes, D:913 (5) and 12.11, and locked in engine round 4 by CL-S14-DELTA and CL-S14-APPROVAL; string 3 joins the same approval if R12 lands)

S14 has TWO new sentences (strings 2 and 3) plus the R2b piece (rev3; numbers kept from rev2 so reviews still read).
Bodyweight (R4):
1. (CUT in rev3 with R3: rev2's "Bodyweight" box label. No bodyweight box in S14.)
2. "<Lift>: bodyweight sets have no weight to agree to. Your sets are saved." (panel line; <Lift> is his lift name, data)
Import (R12):
3. "A saved record in this history could not be read, so nothing was imported. Your phone is unchanged."
   (LOCAL_SOURCE_NATIVE_LOAD_RECORD_INVALID)
Engine wording (R2b; a piece, not a sentence): "<key> on every set" for a configuration (e.g. "hold on every set").
DATA, NOT COPY (Fable C4): the card's own configuration text shown in the R2b piece (e.g. "hold") and the lift name in
string 2 are the athlete's data, shown unchanged; they are NOT copy-lock pieces (the existing plan line "hold x 8 reps" /
"BW x 8 reps" is unchanged). Cell CL-COMPOSED-DATA asserts the lock stays green on them as data and still reddens on any
unlisted literal.
Existing approved strings reused unchanged: the adopt-observed offer sentence and adoptReason (:173-:179), "No new
weight to agree to yet. Your saved sets are kept.", "Last time: ...", the logSet "enter what you did" words.

## 11. Size and timeline (estimates; full sealed process; anchors from S11 and S12 as measured in the ledger)

- rev5 (2026-10-11): TOTAL S14 4.5 to 6 working days from the PM's go under the lighter process (D:914 (3)), from the
  runbook's section 6: rulings, rev5, W-46 and the re-pin 1.5-2; package, T4, ledger lines and T5b 1.5-2; the seal 1-1.5;
  phone and fresh port 0.5. On the phone about 2026-10-16 to 2026-10-19 if work starts 2026-10-12. Engine rounds 1-3
  are done (PASS each). D:914's 3-4 day figure predates the S13 retirement, the W-46 baselines and the runbook's
  S1b/S8b steps; Fable's S0 read of the runbook gives 4.5-6. Risks: the W-46 baselines and a hosted red at T5b/CI-2,
  each about half a day. The rev4 figures below are history.

- Product: about 91-178 lines (one engine file 20-35, three hunks; one FC03 arm plus the one-line AFTER_STEP_2
  membership; one prefill; one panel line); tests about 250-400 lines and 23 named new cells plus 4 named existing
  controls (three move their expected code red-first, one unchanged) and 8 mutants; 0 or 1 new child; 1 spec
  revision (R9.14 part A); copy lock plus 2 strings and the R2b piece; 1 look state; 2 debts paid (SCENE-DUP, EN3-COPY),
  1 mitigated (REPIN-ORPHANS), 1 recorded (D-S13-BW-CONFIGURATION).
- Brief: rev4 -> PM -> brief of record: 0.5 day (a short Fable confirm read of G1-G4 if the PM wants one).
- T1 engine track: paper day (R9.14-A and the panel-state pack draft; Fable read) about 0.5 day; then FC01/FC03 rounds
  with Fable + Claude reads (S11's measured round cycle 2-3 h build plus 1-2 h reads) 2 to 3.5 days for 3 to 6 rounds.
- T3-T6 (REGEN, registration, re-pin, copy lock, pack edits and baselines, T4 observation, T5b hosted run, needles): 1 to
  1.5 days.
- T7-T28 seal chain (S10 measured 2.8 h at best; S11 needed a restart): 1 to 2 days.
- T29-T31 (phone proof, fresh port, T30, handoff): 0.5 day, plus the owner's own steps.
- TOTAL S14: 6 to 8 working days from the PM's go (Monday 2026-10-12): on the phone about 2026-10-19 to 2026-10-21.
  Re-checked in rev3: Fable l2 D3 finds 6-8 credible after the R3 cut (one engine file, three hunks, one S8 arm, one
  prefill, one panel line, the S11-shaped seal chain, T29-T31 on the owner's steps). The cut removes rev2's paper-day
  decision and the schema rounds; it does not shorten the closing-read tail, so the range is kept rather than lowered.
  The tail is 7.1's rounds: if T1 needs all six, the R2 cut at round 6 bounds it at 8-9 days. With R3 kept instead, 6-8
  would not be credible (+3-5 days, 7.2). The fast route is not available (engine change, D:904 (6)). Re-checked in
  rev4: Fable l3 E keeps 6-8 and finds it slightly safer (no owner question gates any step; the four-cell code move of
  l3 C1 is declared red-first work inside the FC12/FA03 children, not a new child; l3 C2's line sits inside the same
  FC03 rounds, no new round). The PM's string approval (12.11) is needed before T3's copy lock; no owner question gates
  S14 (OQ-1..OQ-4 answered).
- S15 (Appendix): 4-6 working days (Fable C7), its paper written and read during S14's seal chain; on the phone about
  2026-10-27 to 2026-10-29.

## 12. PM rulings this draft still needs (engineering routing; not owner questions)

1. Package id (6.1: M2-S14-HOLD proposed) and the parent statement (S11 sealed parent, S12 bytes carried, S12's
   section 12 owed items paid). rev5: id M2-S14-HOLD (runbook S1 (a)); S13's bytes carried and S13 retired (6.1).
2. RULED (PM ruling, 2026-10-10): E1's bodyweight code is the NEW code NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT, answered at
   :269's position in FC01's order (after :263/:264; E1 (a)'s position rule), with FC03 classification AFTER_STEP_2
   only, per Fable l3 G2 (E2 (2); not BLOCKING, HELD_BACK or HOLD_CODES). Builder and Fable (l2 F, l3 F) recommended it:
   R4 paints on a code that means one thing, the T30 runner's allowed list names a reason, and RECORD_INVALID stays a red
   for everything else. R4 and section 0 line 3 stand. Of the four existing cells on the w 'BW' fixture (section 5), FC12
   :6861, :7226 and FA03 :2205 keep asserting no offer and move only their expected code, red-first; FC12 :7361 is
   unchanged.
3. The T30 runner's ALLOWED_NO_OFFER change and its review (E14), before T30.
4. (rev2's E6 predicate ruling: CUT with R3; it goes to D-S13-BW-CONFIGURATION's own brief, section 14.)
5. D-W7IMPORT-FLAKE-1: the both-OS hunter run S12 still owes runs in S14's T3. rev5: runbook S8b (T4).
6. Reviewer seats: Fable + Claude (Opus) on every engine round (D:843 (1)); Astra optional. rev5: SUPERSEDED by D:914 (3):
   one independent Fable read per step.
7. A new child s14-hold only if a new test file is needed (6.2).
8. Spec naming: R9.14 is one revision with part A (S14, read before any FC01/FC03 byte) and part G (S15's gym-change
   order rule, written and read during S14's seal chain, before any S15 byte); or part G becomes R9.15 with the same text.
9. Booking D-S13-BW-CONFIGURATION (section 14): its own engine slice after S15 (not inside S15), size M, with a
   NATIVE-LOAD/NATIVE-CARRIERS spec section first; the ledger line that records the debt and the R3 cut.
10. Writing the owner's OQ-1..OQ-4 answers of 2026-10-10 to DECISIONS.md: OQ-1 (S14 only), OQ-2 (standing), OQ-3 as
   widened (the hold/BW unfinished-step check and the other-word check, yes/no each), OQ-4 (standing: the PM approves
   new on-screen copy for every slice, the list sent after each release). Nothing is left to put to him.
11. (new in rev4) The PM approves section 10's strings 2 and 3 and the R2b piece "<key> on every set", or edits them,
   under OQ-4's standing Yes, before T3's copy-lock approval line; the approved strings go on the owner's list after
   release.

## 13. What rev2 read (beyond rev1's list)

Fable's review (whole); DECISIONS.md db9bbe3 :817, :843, :851, :853-:860, :895, :905, :912; native-load.cjs :266-:269,
:470-:620, :685-:694; native-load-effects.cjs :804-:807, :1115-:1123, :1484-:1486; gym-app.mjs :466-:469;
public-client.mjs :371-:390; commands.cjs, schema.cjs, edit-values.cjs (whole, 88 lines), engine/entered-load.cjs (whole),
local-source-profile.cjs :5-:19; git grep (exclusions as pathspecs) for the set write path and its requirers.

What rev3 read: Fable's re-read REVIEW-S13-BRIEF-FABLE-l2 (whole); rev2 (whole); at 928ecd3, read-only,
rebuild/m4/spec/configured-load-candidate/run.cjs :14-:19 and rebuild/m3/w6/test/browser-configured-load.mjs :49-:53
(to confirm the prior-art citation). The reader list of section 14 is Fable's (git grep at 928ecd3 with the exclusions as
pathspecs), cited from l2 B2 and E1, not re-run by this seat. No ledger line was re-read for rev3; the owner rulings are
recorded from the PM's words in this chat. Nothing was run, no test, no bundler, nothing installed; no hard-limit path
was opened.

What rev4 read: Fable's third read REVIEW-S13-BRIEF-FABLE-l3 (whole); rev3 (whole); at 928ecd3, read-only, by git show,
rebuild/m4/workout/load-field.mjs :1-:48 (export lines only, to confirm the l3 G4 citations). The four existing cells of
section 5 (FC12 :6861, :7226, :7361; FA03 :2205) and the FC03 code sets (native-load-effects.cjs :16, :20, :414-:415,
:430, :1425, :1458) are Fable's l3 citations (git grep at 928ecd3, exclusions as pathspecs), not re-read by this seat.
No ledger line was re-read for rev4; PM ruling 12.2 and the owner's OQ-3 widening and OQ-4 Yes are recorded from the
PM's words in this chat. Nothing was run, no test, no bundler, nothing installed; no hard-limit path was opened.

What rev5 read (2026-10-11): the brief of record (this file's source, sha256 re-hashed FC8B4A4B) whole; DECISIONS.md
:912-:921; the builder's round reports R1-R3 (%TEMP%\s14-r1..r3) and round 4's post-merge proof (S14-SEAL-RUNBOOK.md
sections 1-2); Fable's reads REVIEW-S14-R1-FABLE (PASS), REVIEW-S14-R2-FABLE (PASS, one required change) and
REVIEW-S14-RUNBOOK-FABLE (round 3 PASS; runbook USABLE-WITH-CHANGES); S12-LOOK-BRIEF.md :266-:343. Text only: no product
byte was read anew for rev5, nothing was run; no hard-limit path was opened.

## 14. Debts recorded by S14, not paid in S14

D-S13-BW-CONFIGURATION (new in rev3; Fable l2 B4, E1, E5). BODYWEIGHT SETS SAVED AS BODYWEIGHT.
- What the owner sees today and after S14: a bodyweight ("BW") lift asks for a number; he types one (the T30 runner types
  20 lb); it is saved in pounds. S14 adds only R4's panel line saying there is no weight to agree to. Nothing is lost and
  no offer is minted for it. The made-up number in the log is the debt.
- What paying it means: the set is saved as {kind:'configuration', configuration_key:<the card's text>}, the box shows
  the card's text, and every reader of a set's load handles it.
- Why it is not in S14: the write side refuses it at 928ecd3 (schema.cjs :66, :72-:75 validSet, :110; edit-values.cjs
  :29 via assertPatch :45, unionPatch :56, assertOriginal :86), while the read side admits it (engine/entered-load.cjs
  :9-:11; performed.cjs :12-:15). Widening the write side is the never-shipped patch pair at
  rebuild/m4/spec/configured-load-candidate/run.cjs:16-:18 and rebuild/m3/w6/test/browser-configured-load.mjs:51-:52.
  The engine's native readers then throw by design (NATIVE-CARRIERS; C4B-REVIEW:938 "native, configuration load: nothing
  <- performedNumericEntry's own refusal"), whereas the legacy branches skip a non-numeric w (sessionScore :668-:669,
  typicalError :576).
- SPEC INPUT: the reader list, keyed on READERS OF A SET'S LOAD (payload.load / fact.current.load), not on requirers of
  workout/schema.cjs (Fable l2 B2, E5; git grep at 928ecd3, exclusions as pathspecs):
  - engine, performed.cjs: :127 performedNumericEntry throws PERFORMED_NUMERIC_LOAD_UNAVAILABLE for any performed slot
    whose load.kind is 'configuration'; :133 performedValues; :141 performedPair (via :138-:143, no catch); :211
    performedTrendObservation (:207-:216, no catch).
  - engine, progression.cjs: :574 typicalError (:553-:579; pools every lift in the era, :558-:566, so one bodyweight lift
    with a configuration set makes it throw for EVERY exId); :657 sessionScore (:656-:657); :697 liftTrend (:682-:699);
    :802 progressionTrend (:775-:806; then liftTrend at :805, no catch: the whole trend throws).
  - callers: today.cjs:188 typicalError inside try/catch (returns null: the runway sentence silently loses his spread
    number on every card); today.cjs:538 progressionTrend UNCAUGHT in nowModelUncached when eb.regime === "unknown";
    today.cjs:543 caught; energy.cjs:198 progressionTrend uncaught; writers.cjs:677 typicalError (debrief), :1340
    progressionTrend, :2529, :2558, :2911 typicalError (coach prompt), uncaught; earn.cjs:99 typicalError uncaught;
    volume.cjs:237, :276 and sleep.cjs:1748 liftTrend uncaught.
  - product: rebuild/m3/w7-preview/today/gym-model.mjs:458 prints savedSlot.completion.values.load.value + ' lb x '
    ("undefined lb" for a configuration set); coach wave1-tools.cjs:232-:236 log_set gates loads with
    EditValues.validValue('load', {value, unit:'lb'}) after numericInput (widening validValue opens no coach writer,
    but D:585 pins "log_set's numeric gate is exactly the accepted layer's", so every cell asserting that equality
    must be read);
    rebuild/m4/workout/load-field.mjs already exports isNumericLoad (:11), isConfiguredLoad (:12), loadMode (:15),
    formatLoad (:19), readLoadEntry (:28), loadEntryFrom (:40) and sameLoad (:46) (prior art for the box; citations
    corrected in rev4, Fable l3 G4).
  - on the write path (rev2's list, still to be read, but not the key): w5 bridge.cjs, public-client.mjs, commands.cjs,
    edit-history.cjs, native-trend-context.cjs, import admission and replay.
  - protected readers (seed, migrate, merge, index, oracle-shim) cannot be read at a builder seat; their behaviour on a
    configuration set is observed only by PM-seat runs under a grant.
- WHERE: its own later engine slice, NOT S15 (S15 is expected to move no engine byte and is a different subject). It
  needs, in order: a NATIVE-LOAD/NATIVE-CARRIERS spec section on configured magnitudes (set aside, never throw, in
  typicalError, sessionScore, liftTrend and progressionTrend; the saved-set row; the coach gate), Fable read; the
  write-validator widening on schema_version 2 only (v1, zero, negative, empty key and extra keys still refused); the
  bodyweight box as a new app state under the look law (D:817); a re-pin (R14 applies; OQ-2's standing Yes covers the
  port); the full sealed process. Size M (S11 FC09-class engine policy work, +3-5 days over a plain slice), not rev2's
  "6-15 lines".
- I-SILENT for its brief (Fable l2 F): today.cjs:188 shows that even a caught reader degrades a sentence silently; that
  brief's I-SILENT must also cover "a number the app printed yesterday goes quiet today".
- Owner words (for the handoff): "Bodyweight lifts still ask for a number for now; saving them as bodyweight is its own
  later update, because every place the app reads a weight has to learn it first."

## 15. Rulings and findings since the brief of record (DECISIONS:913) - new in rev5

15.1 The ledger since :913. :913 OWNER RULED (2026-10-10): the @noble fetch; OQ-1 PM-seat engine runs, pass/fail only;
OQ-2 a standing fresh port after each engine update; OQ-3 one yes/no check; OQ-4 standing PM approval of each slice's
new copy, list after release. PM RULED the slice's scope (hold last load + the BW/hold offer with the new code
NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT + D-T30-REPIN-ORPHANS + D-S12-SCENE-DUP-1; gym change next; BW set saving ->
D-S13-BW-CONFIGURATION) and the brief of record (S13-HOLD-BW-BRIEF.md d0ac08c, FC8B4A4B; Fable l4 ACCEPT). :914 OWNER
RULED (2026-10-11): visual fixes first (a presentation-only polish slice on the fast route); then this slice takes the
LIGHTER process - red-first cells for every rule and ONE independent Fable read per step instead of closing-rule rounds;
nothing else in the brief is relaxed. :915 PM RULED: DONE is one complete cycle on the owner's iPhone, then the same build
for two real days; full rigor for data loss, calculations and consent, one Fable read for presentation, a repeated repair
loop escalates to an architecture decision; the Coach entry leaves Today until a live coach exists; order: polish -> this
slice (lighter) -> two-day owner trial -> gym change -> coaching. :916-:917 M2-S12B-POLISH, withdrawn unrun at :918.
:918-:919 THEME and BRIEF BY SHA M2-S13-POLISH, and the renumbering: this slice is S14, the gym change S15. :920 S12
RETIRED BY SUPERSESSION (the shape S14 uses for S13). :921 M2-S13-POLISH RELEASED at 7347ba6.

15.2 Engine rounds (the lighter process; builder writes, Fable reads once, PM commits).
- Round 1 (REVIEW-S14-R1-FABLE: PASS, no required change). E1 (a)/(b) and both E2 hunks; PM ruling O-Q1: the new code
  carries :269's refs [] and field base_load. Builder flags ruled: (a) the one assertion ADDED to FA03 :2205's cell (:2226,
  the refusal it carries) ACCEPTED - the cell asserted no code to move; (b) the S8 arm (E2 hunk (1)) REQUIRED, not scope
  creep (R2's "same narrow shape at all three sites"); (c) FC12 :7226's code literal move CORRECT (the brief's table moves
  it). Titles (PM ruling): a one-clause suffix "(S14, PM 12.2: ... NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT base_load refs [])" on
  FC12 :6861, :7226 and FA03 :2205, title lines only, no assertion moved. STOP-S14-LOOK (rev4's STOP-S13-LOOK) ruled not
  hit: the R4 line reuses the status style; its pack state is W-46 (runbook S4).
- Round 2 (REVIEW-S14-R2-FABLE: PASS, one required change). R2b (setLoads prints the key), R1 prefill (gym-model.mjs
  lastRealLoad), R4 line (today-entry.mjs paint()), FUZZ cells (incl. whitespace-only w and the missed-debut claim).
  R2b's wording APPROVED by the PM under D:913 (5) and 12.11 (the D:842 NL-LOADS template move is the brief's listed E1
  (c), not a STOP). Item 6 (i): the FIXTURE NOTE (15.3). Item 6 (ii): debt D-S14-INERT-CLAIM (15.3). Required for round
  3: the non-blank rule.
- Round 3 (Fable PASS, REVIEW-S14-RUNBOOK-FABLE section 1). One predicate textLoad (trim().length > 0, engine-capture.cjs
  :23's rule) at FC01 issuance, DERIVABLE (c3) and setLoads; FC03 nonBlank in captureKeys and cfgKey; spec R9.14-A (1)
  reworded "non-blank" (:626); cell WHITESPACE-W (b) flipped to refusal at issuance, DERIVABLE and the fold (R1 and R2),
  (d) retitled "a state engine-history.cjs :69 refuses (fixture only; round-12 seed 20261315)". Mutants of rounds 1-3
  killed; the three FC03 survivors (WS-CFG, WS-KEYS, WS-FC03-BOTH) are EQUIVALENT: a blank-key record that passes S8 is
  refused by DERIVABLE (FC03 :1143) with the same code and field - accepted as defence in depth behind DERIVABLE (c3),
  named in VERDICT-S14. PRODUCER_REVISION eb9194850896c371fe2d80f40230fa69627fa3441ff5126417a1244b1ac86ca8. Rounds 1-3
  committed by the PM as bd7f91b and merged with the chain as 1c66785 (branch rebuild/c-s14-hold).
- Round 4 (builder; runbook sections 1-2). Post-merge proof green except the PM-seat cells; the copy lock moved for
  exactly the two approved pieces (corpus 72f5d0da... -> 3a226341...; CL-S14-DELTA, CL-S14-APPROVAL; the NL-LOADS pin;
  two hand-written CL-ENGINE-OUTPUT cases), red first, 15/15.

15.3 Debts and notes recorded (VERDICT-S14 names each).
- FIXTURE NOTE (round 2 item 6 (i)): FC12's fixture admits an adoption Yes on a capture-less host v1 completion, a state
  engine-history.cjs :69 refuses (WORKOUT_ENGINE_CAPTURE_REQUIRED); unreachable for a real athlete (the host writes
  prescription_capture on every start; Joe's ported history is legacy rows). Not a product debt; not fixed in S14.
- D-S14-INERT-CLAIM (round 2 item 6 (ii)), low priority: a forged adopt-observed with a missed-debut claim and no MISSED
  mark applies under the present revision (R1) and is held under an absent one (R2); R1 != R2 for one record. Nothing is
  written without the athlete's own signed op. The fix belongs to FC01 and spec R9.9, outside S14's three E1 hunks.
- D-S12-SCENE-DUP-1: CUT from S14 to a debt by PM ruling (15.4); stays open.
- D-S13-BW-CONFIGURATION (section 14) and D-T30-REPIN-ORPHANS (mitigated by R14) unchanged.

15.4 PM rulings of 2026-10-11 (on Fable's S0 read of the runbook).
- R13 CUT to the debt D-S12-SCENE-DUP-1: its proof needs the bundler and a phone check (7.4); E9 and S13-R13-ONCE leave
  S14; the brief's R13 row is paid by the debt.
- The brief rev5 (this file) is written, read once by Fable and committed BEFORE the runbook's S8 runs S14-REGEN
  --write, so S14.json's brief block pins rev5's bytes; the BRIEF ACCEPTED BY SHA line names rev5's sha256.
- The R9.14-A spec paper lives on the PRODUCT lane as rebuild/coach/NATIVE-LOAD-SPEC.md as committed in bd7f91b. Why: one
  place, reviewed with the code it governs - each engine round's Fable read judged FC01/FC03 against that text, and round
  3 reworded its (1) in the same change as the code; a second home on its own branch would split the paper from the code
  and leave two copies to drift. rebuild/c-native-load-spec 7ef8291 (the home E3 named) is SUPERSEDED for R9.14 (its
  R9.13 text stays the record of R9.13). S14-REGEN treats the paper on purpose: it is declared by name, never swept in by
  its root alone (runbook 3.4).
- Brief 6.1's three items owed by a sealed child of S11 beyond the token line - the ancestor re-pin ruling
  (D-S12-ANCESTOR-REPIN), the gate leg (C2 D3), and the ruling that the coach ENGINE_REVISION moves - are paid by the PM as
  three ledger lines before THEME (runbook S9 (3)-(5); bodies drafted there). The THEME line names the coach constant
  move (T23) and the E10 pin move.

15.5 The seal plan in force: rebuild/lanes/b/S14-SEAL-RUNBOOK.md (Fable S0 read USABLE-WITH-CHANGES, R1-R6 applied;
committed in its S8, sha256 recorded there), which replaces 6.4's PART B pointer to "an S14 runbook". S13 is retired by
supersession in the D:920 shape (runbook 3.3). The :913 owner grants were given for "S13" before the renumbering; they
name this slice, not the number, so they apply to S14 (one PM line, runbook S1 (e)); no new owner question.

15.6 Open at rev5 (the PM's, before T3): R12 kept or cut (runbook S1 (c); recommended keep); E14's home, the PM's PC
outside the lane (S1 (f)); the package id in the THEME line (S1 (a)); W-46 (S4); the E10 re-pin (S7).

## Appendix S15 - the gym change (OUTLINE ONLY; PM ruling, 2026-10-10: not briefed in full yet; rev5: renumbered S15 at
D:918, after the two-day owner trial, D:915 (4))

S15.1 Problem. Machine and cable lifts carry the old gym's weights, "Last time" lines and seat settings; free weights
keep their history (D:895 (3)). Interim that works today: type what he really lifted, say Yes to "make that your working
weight" (native-load.cjs:262-:276); save new machine settings (latest wins, machine-settings-commands.cjs:154-:158). Not
covered: the first card still suggests the old weight, the old "Last time", old queued targets, the old stack jumps.

S15.2 What exists (rev1 2.3, verified by Fable). No gym, location or equipment type in rebuild/; "machine" is only in a
name (exercise-catalogue.mjs:78, :117-:125); inc/steps are the stack's jumps (setup-model.mjs:142, :146); machine
settings are dated event facts (machine-settings-commands.cjs:52, :92-:101, :112), latest-wins; the nearest concept is a
fork (plan.cjs:25-:32, :53-:56, :291-:312; today.cjs:193; native-load.cjs:148-:153, :233-:234, :248-:253;
native-load-effects.cjs:516, :606), which does not clear w; import refuses any unmapped op by name
(source-admission.mjs:172, :186, :529-:554; the P3-EN3 lesson, D:878).

S15.3 ONE SITE AND ONE ORDER (Fable C2 (a), (b)). The gym-change fact is applied in exactly one module: inside FC03's fold
loop (native-load-effects.cjs foldNativeLoad :862), which Today (today-bindings.mjs:545-:547) and import replay already
run; rev1's separate projection site (E7) is dropped. Reason: R7 retires queue entries FC03 itself creates (native-load.cjs
:572-:575; TARGET_QUEUED :566 reads !q.done), and R8 orders against FC03's records. The S15 paper first confirms that
genSession, capture and progression read the folded state; if any reads an unfolded state, that is a STOP before any byte.
(Fable l2 F: the expectation is yes, since today.cjs:98 reads q.newW from s.queue, which FC03's fold fills.)
Spec R9.14 part G (or R9.15, PM ruling 12.8) states the ORDER RULE: a gym-change fact is folded in op order among this
lift's native-load records (it is the authentic ordering op the spec :155 hold rule looks for, so no "later base with no
ordering op" hold arises); at its fold point, per ticked lift: a fork at the date with authentic fork_refs to the
gym-change op; w and wSets set to not-on-file UNLESS the current w came from an adoption whose consumed completion is dated
on or after the change date (native_load_authority 'adopted' with wAt >= date, :587, :589), which stands (R8); every queue
entry of that lift whose evidence is before the date is marked done with state 'RETIRED-GYM-CHANGE' (kept, shown as
retired); old-app structural pending items of that lift likewise. A record whose consumed completion is dated on/after the
change date is unaffected; one dated before is set aside with its effect, never UNDERIVABLE, EFFECT_CONFLICT or
BASIS_REPAIR_REQUIRED. A pre-date workout checked after the change is refused PLAN_CHANGED by the existing fork rule
(:248-:253), so no new pre-date Yes can be minted. Two Starts on the change date: the inherited ERA_ORDER_BRIDGE_UNPROVEN
(:234) refuses, nothing lost (cell GC-SAMEDAY). The fork KIND is picked on paper so BOTH readers see it (Fable E-3): a reset
fork for native-load (resetForksOf plan.cjs:32; spendIdOf :150-:151) AND an era boundary for eraFresh (:291-:312), pinned in
one cell (GC-ERA), or today.cjs:193 and native-load disagree on the era.

S15.4 Rules (rev1 numbers; invariants as section 3).
- R6 His own dated action: "I changed gyms" opens one screen (a date, default today, never future, never before his last
  change; his active lifts with tick boxes). One event fact earned/gym-change/v1 {date, lifts}; one writer.
- R7 Ticked lifts start fresh from the date by S15.3: baseline ask, no "Last time" or settings note from before the date
  (feasible: every note carries effective.local_date, machine-settings-commands.cjs:112; Fable E-2), old targets retired
  and shown as retired; the first workout after the date gets the adopt-baseline offer. inc/steps kept, with
  D-S15-STACK-JUMPS recorded by S15 (Fable D, PQ-8; renamed from D-S13-STACK-JUMPS in rev4, Fable l3 H). Unticked
  lifts untouched.
- R8 A Yes on evidence from on/after the date stands (op order plus the wAt rule); a pre-date Yes is set aside, kept, and
  restored by Undo while Undo is allowed. The fold never holds or refuses a lift because of a gym change.
- R9 Undo, ruled for the case after a Yes (Fable C2 (c); PM ruling, 2026-10-10): one retraction fact for the latest
  change, offered only while no native-load Yes on a ticked lift was accepted after the change in op order (then the
  projection is the pre-change one, deep-equal); otherwise not offered, string 13 says so, and the Yes stands.
- R10 Import: family F10 PROJECTED through the same FC03 site; malformed -> LOCAL_SOURCE_GYM_CHANGE_INVALID + string 14.
- R11 The next change pre-ticks the last ticked set (a pre-tick is not a write).

S15.5 Change sketch. Spec part G (paper, Fable read first); FC03 fold step (the one site); NEW
rebuild/m4/workout/gym-change-commands.cjs + host (mirroring machine-settings-commands.cjs / -host.mjs): validate
{date, lifts}, retract {target_op_id}, the producer date rules; gym-model.mjs settings latest filtered by the date; the
gym-change screen (gym-app.mjs or a new gym-change-view.mjs, screens.template.html, preview.css); source-admission.mjs +
replay-registry.cjs F10 (+ native-load-replay.cjs if the fold order needs it); import-screen.mjs sentence; copy lock;
EN2/EN3 enumeration cells name the new writer. S15 is expected to move no rebuild/engine byte (then no re-pin, R14 not
triggered); a needed engine byte is a STOP and a PM ruling.

S15.6 Cells (red-first as section 5). GC-WRITE (one fact per confirm; future date, before-last-change and zero ticks
refused by the producer); GC-FRESH; GC-R1-FRESH (no R1 prefill in a fresh era); GC-QUEUE (retired, visible, not deleted);
GC-ADOPT; GC-YES-AFTER (Yes on post-date evidence recorded BEFORE the gym-change op: still applied after it, no hold);
GC-YES-BEFORE (set aside, on record, restored by Undo); GC-UNDO (retraction with NO Yes after the change: deep-equal
pre-change projection, sets logged in between kept); GC-UNDO-AFTER-YES (a Yes on a ticked lift accepted after the change:
Undo not offered, string 13 shown, nothing written, the Yes stands at every later projection); GC-SAMEDAY (two Starts on the
change date: ERA_ORDER_BRIDGE_UNPROVEN, nothing lost); GC-ERA (both fork readers agree); GC-SETTINGS-DATE; GC-REMEMBER;
GC-IMPORT (Import and Today projections deep-equal); GC-EN3. Mutants: M3 R8 order inverted; M5 gym change applied to
unticked lifts; M6 retraction ignored by import replay; M12 the gym step applied outside the fold loop or not in op order
(killed by GC-YES-AFTER and GC-QUEUE).

S15.7 Strings (draft; approved by the PM and listed for the owner after release under the owner's standing Yes to OQ-4,
2026-10-10; rev2's S15-OQ-A is removed). 1 "I changed gyms" (control); 2 "New gym" (heading); 3 "Machines and cables differ
from gym to gym. Tick the lifts that use one. They start fresh: no suggested weight, no old Last time, no old machine
settings. Free weights keep their history." (lead); 4 "First workout at the new gym" (date label); 5 "Start the ticked
lifts fresh" (confirm); 6 "Tick at least one lift, or cancel." (zero ticks); 7 "That date is in the future. Pick today or
an earlier day." (future date); 8 "Saved. The ticked lifts start fresh from that day. Your old records are kept." (saved);
9 "Undo gym change" (control); 10 "Gym change undone. Your lifts are as they were." (undone); 11 "Set aside by your gym
change." (retired target); 12 NEW (Fable C4) "That date is before your last gym change. Pick that day or a later one."
(before-last-change refusal); 13 NEW (Fable C2 (c)) "This gym change can no longer be undone: you agreed a new weight
since. Everything stays as it is." (Undo blocked); 14 the Import sentence for LOCAL_SOURCE_GYM_CHANGE_INVALID.

S15.8 Look law (D:817; Fable C5). The gym-change screen, its saved/undone/blocked states and the retired-target row are
new app states: each gets a pack prototype state and accept runs per platform as listed pack edits shown to the owner,
before any look cell can go green. PQ-6's placement (the control under the set card, reachable before Start) must be
drawn in the pack first.

S15.9 Size and risks. 4 to 6 working days for the gym change with the S15.3 paper first (Fable C7; S11's one import family
plus fold dispatch took three rounds with a real Q1 defect, D:878-:881). Risks: fold order (S15.3), import parity
(GC-IMPORT), the first new-gym days already logged since about 2026-10-08 (back-dating plus R8 make them the new baseline;
nothing typed is rewritten), the new writer under the S10 fence and P3-EN3 (declared red-first).

S15.10 Decisions and owner questions moved here. PM-decided (PM ruling, 2026-10-10): PQ-5 trigger = his dated action,
never automatic; PQ-6 control under the set card, subject to S15.8; PQ-7 he ticks lifts, remembered (R11), no name-based
pre-ticks; PQ-8 fresh clears weight, Last time, old note, old targets, keeps inc/steps with D-S15-STACK-JUMPS recorded
by S15 (Fable D; l3 H); PQ-9 Undo for the latest change, ruled as R9 above (Fable C2 (c)); PQ-10 gym name not stored.
Owner questions for S15 (asked when S15 is briefed): S15-OQ-A is REMOVED in rev3 (Fable l2 E3): S15's sentences fall
under the owner's standing Yes to OQ-4 (2026-10-10): the PM approves them and lists them after release. OQ-2's
standing Yes covers any S15 port. S15-OQ-B only if S15 must move an engine byte (OQ-1 granted S14 only): "May I run
the protected checks on your PC for the gym-change update too?" Recommended: Yes.
