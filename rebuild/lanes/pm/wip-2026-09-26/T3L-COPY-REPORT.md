# T3L COPY REPORT - S11 step T3l red-first copy-lock measurement (BUILDER, measurement only)

Builder: claude-opus-5-5 subagent of the Earned PM, 2026-09-26. Decides nothing. No tracked byte changed.
Worktree DRY C:\Users\joeym\AppData\Local\Temp\earned-s11prep at 9288adfc782a10ea4d3de098723955db9515f3b6 (read-only).
Brief: S11-NATIVE-LOAD-RESEAL-BRIEF-DRAFT-rev6.md section 2.3 (:77-:90), step T3l (:169), section 13 (:187-:212).

## 1. What was run

- Copied from DRY into this scratch, byte-equal (sha256 checked before the edits):
  - copy-lock.cjs 7bc18462...dc4d (unchanged in scratch)
  - copy-lock.corpus.json e3b1be1078c65877fcc990ce91223f0f758bf51c9dd3b4acc08653b261cd826c (= CORPUS_SHA256 at copy-lock.test.mjs:37; unchanged in scratch)
  - copy-lock.test.mjs 55ceef75...6cfa (source), then three scratch-only edits, each marked "T3L SCRATCH EDIT n of 3":
    1. copy-lock-states.mjs imported read-only from DRY by absolute file URL (it imports DRY's gym-app by relative path);
    2. ROOT = DRY's worktree root instead of a path relative to the test file;
    3. CL-HOLDS prints and saves its whole refusal list (cl-holds-refusals.json) BEFORE the unchanged assert.deepEqual(got, [], 'CL-HOLDS').
- One run, ONE shared slot: node pm-run.cjs shared s11-t3l-copylock t3l-run.cmd (took earned-runtime-slot-3.lock after 0 s, freed it).
  Env: TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03, S10_T4_CHILD=s11-t3l-copylock,
  NODE_OPTIONS=--require %TEMP%\s10-t4-guard.cjs, NODE_PATH exactly as nlr-r22-l5-scratch\run5.ps1 sets it,
  plus run5.ps1's own --import nlr-build\deps-loader.mjs (ESM bare 'jsdom' does not resolve through NODE_PATH; that loader also refuses the protected five).
  Guard log: no s11-t3l entry. No protected file loaded.
- Output: t3l-run.out.txt (TAP), node exit recorded in t3l-run.exit.txt = 1. (pm-run printed "exit 0" because the cmd file's last line is the echo; the test exit is 1.)
- After the run: git status --short --untracked-files=all -- rebuild .github in DRY = empty; HEAD unchanged; no copy-lock-* plant dir left in %TEMP%.

## 2. Result (verbatim needles)

`# tests 6  # pass 4  # fail 2`
- ok 1 CL-PIN (corpus is still e3b1be10; scan roots and the 5 state ids unchanged)
- NOT OK 2 CL-HOLDS - 18 refusals (list in section 3)
- ok 3 CL-TWO-SIDED
- NOT OK 4 CL-PLANTS - ONLY its "control, no plant" row fails, and it fails with exactly the same 18 lines (the composed tree is red before any plant). Every one of the 12 plant rows still produced every expected refusal (no "missing refusal" line), so the negative controls still refuse their plants on the composed bytes.
- ok 5 CL-COMPOSED (the 5 mounted gym states are unchanged)
- ok 6 CL-CLOSURE

## 3. The CL-HOLDS refusal list (verbatim, sorted as the lock sorts it; T3L-REFUSAL-COUNT 18)

```
COPY-LOCK OWNER-CHANGED rebuild/m3/w7-preview/today/today-entry.mjs now carries 1 "Not now"
COPY-LOCK OWNER-CHANGED rebuild/m3/w7-preview/today/today-entry.mjs now carries 1 "Set "
COPY-LOCK OWNER-CHANGED rebuild/m3/w7-preview/today/today-entry.mjs now carries 1 "Yes"
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs ": next weight"
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs ": set your working weight"
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs ": undo the agreed weight"
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs "Check next weight"
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs "Checking your saved workout."
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs "No new weight to agree to yet. Your saved sets are kept."
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs "No working weight"
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs "Offered weight for each set"
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs "Saved. The new weight applies on a later workout."
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs "Undone. The agreed weight will not be used."
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs "Your choice is saved; the next card could not be checked."
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs "Your saved workout changed since this offer. Check again for a current one."
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs "Your workout is saved. The next weight could not be checked."
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs "a workout behind your agreed weight was corrected, so this lift is left off your workouts for now. Check next weight to undo the agreed weight."
COPY-LOCK UNLOCKED rebuild/m3/w7-preview/today/today-entry.mjs "your working weight changed after you agreed to a new one, so this lift is left off your workouts for now. Check next weight to undo the agreed weight."
```

Against brief 2.3's prediction ("UNLOCKED for classes A, C and E, OWNER-CHANGED for class D; any other line is a finding"): 15 UNLOCKED = A 5 + C 7 + E 3; 3 OWNER-CHANGED = D 3. No other line (no MISSING, DUPLICATED, DECLARATION-ADDED/-DROPPED; nothing from gym-model.mjs or any other scan-root file). The prediction holds exactly.

## 4. Every user-visible string the composed bytes add (lock-seen and engine-origin), one by one

Line numbers are DRY 9288adf. "Approval" cites only a DECISIONS line (read at :777-:839 only) that quotes or adopts the words; spec prose alone is recorded as "spec only". Placeholders: <lift name> = the lift's display name (today-entry.mjs:391 e.n, else its id; engine: ex.n || ex.id), <loads> = see F5, <date>/<dates> = workout dates as the engine stores them, <n> = a rep count.

### A. Lock sees them; owner-approved (5) - today-entry.mjs NATIVE_LOAD_PROPOSED_COPY :174-:178
- A1 "<lift name>: undo the agreed weight" (literal ": undo the agreed weight", :174; composed at :281). Seen: heading of an Undo offer card, only after the athlete taps "Check next weight" and an agreed weight not yet used can be undone. Approval: D:798 "(3) approve the five Undo strings of NATIVE_LOAD_PROPOSED_COPY as shown: "Approve all 5"" and "the five strings are approved copy exactly as at c0695e0".
- A2 "No working weight" (:175; used :283). Seen: in an Undo offer's set list, in place of "<w> lb", for a set that had no weight before. Approval: D:798 as A1.
- A3 "Undone. The agreed weight will not be used." (:176; used :254). Seen: status line after the athlete says Yes to an Undo offer and it is saved. Approval: D:798 as A1.
- A4 "<lift name>: a workout behind your agreed weight was corrected, so this lift is left off your workouts for now. Check next weight to undo the agreed weight." (:177; composed :278). Seen: notice line in the check area when a lift is held because a workout behind the agreed weight was edited (fold issue NATIVE_LOAD_BASIS_REPAIR_REQUIRED). Approval: D:798 as A1.
- A5 "<lift name>: your working weight changed after you agreed to a new one, so this lift is left off your workouts for now. Check next weight to undo the agreed weight." (:178; composed :278). Seen: notice line when a lift is held because its working weight changed after the agreement (NATIVE_LOAD_EFFECT_CONFLICT on load_basis). Approval: D:798 as A1.
- Class A prefix measurement (brief 2.3 [MEASURE at T3l]): c0695e0's today-entry.mjs composes the same prefixes at the same lines, byte-for-byte text: :278 `nameOf(notice.lift) + ": " + NATIVE_LOAD_PROPOSED_COPY[notice.code]` and :281 `nameOf(offer.lift) + (... ": next weight" : ... NATIVE_LOAD_PROPOSED_COPY.undoHeading : ": set your working weight")` (read with git show c0695e0:rebuild/m3/w7-preview/today/today-entry.mjs). So Joe approved these five in the same composition the composed tree renders.

### C. Lock sees them; NO owner approval found (7) - NATIVE_LOAD_COPY :159-:165
- C1 "Check next weight" (:159). Seen: the button at the top of the workout screen, always present when the native-load host exists (:273 paint); the same words are the check area's aria-label (:451, read by screen readers). Approval: none in D:777-:839. Spec 7ef8291 section E :352/:355 names this label (spec only; cited from brief 2.3, the spec was not re-read here). D:798's approved A4/A5 sentences quote the label ("Check next weight to undo..."), which refers to the button but is not itself a line approving the button's text. The file comment :150 "owner answer YES, route B; DECISIONS:784-785" cites D:785, which reads "2a B = yes-only earned weights, route B" (a mechanism answer, no words quoted).
- C2 "Checking your saved workout." (:160). Seen: status line while a check runs (after tapping the button, and automatically after a saved workout Close). Approval: none found.
- C3 "Your workout is saved. The next weight could not be checked." (:161). Seen: status line when the check itself fails (host or projection error). Approval: none found.
- C4 "Your choice is saved; the next card could not be checked." (:162). Seen: status line when a Yes was saved but the follow-up refresh of Today failed. Approval: none found.
- C5 "Your saved workout changed since this offer. Check again for a current one." (:163). Seen: status line when the athlete taps Yes on an offer that went stale (NATIVE_LOAD_STALE_OFFER). Approval: none found.
- C6 "No new weight to agree to yet. Your saved sets are kept." (:164). Seen: status line when a check finds no offer; also the fallback after a refused Yes with any other code (:262). Approval: none found.
- C7 "Saved. The new weight applies on a later workout." (:165). Seen: status line after a Yes on a new-weight or set-working-weight offer is saved. Approval: none found.

### D. Lock sees them; already locked words, new owner (3) - OWNER-CHANGED
- D1 "Yes" (:166; button at :285). Seen: the Yes button on every offer card. Corpus owner today: import/import-screen.mjs x1, no list.
- D2 "Not now" (:167; button at :287). Seen: the decline button on every offer card. Corpus owners today: today/design.cjs x1 and screens.template.html x1, list PREVIEW_COPY.
- D3 "Set <n>: " (literal "Set ", :283) followed by "<w> lb" or A2. Seen: one line per set in the offer card's list ("Set 1: 100 lb"). Corpus owners today: today/gym-app.mjs x1, gym-model.mjs x1.
- Approval for D1-D3 in this new place: none quoting them for the offer card. The words are locked sealed copy (D:819 corpus e3b1be10 acceptance; D:838 "a real copy lock on every user-visible string"). Whether that covers the new use is the PM's call (brief Q8-Q10).

### E. Lock sees them; new, no approval found (3)
- E1 "<lift name>: next weight" (literal ": next weight", :281). Seen: heading of a new-weight (earned) offer card.
- E2 "<lift name>: set your working weight" (literal ": set your working weight", :281). Seen: heading of an adopt offer card (make what you lifted your working weight).
- E3 "Offered weight for each set" (:282). Seen: not visible; the aria-label of the offer's set list, read aloud by screen readers.

### F. Engine text the page shows; the lock does NOT see it (rebuild/engine is not a scan root) - rebuild/engine/native-load.cjs (FC01, blob 4bfd87c9 at 9288adf)
All of F reaches the screen through one path: the host copies offer.reason (rebuild/m3/w6/local/today-bindings.mjs:701) and today-entry.mjs:284 puts it in the offer card's paragraph under the set list. Rendering was read statically, not mounted (see G3).
- F1 earned-offer explanation, earnReason :152-:161 (sentence :159-:160): "<lift name>: you topped the rep window at <loads> (workouts on <dates>). Offer: <loads>, <increase>. Nothing changes unless you say yes; it then applies on a later <lift name> workout." <dates> = the workout dates joined by ", " (:154). Seen: under a "<lift name>: next weight" card. Approval: none quoting it.
- F2 <increase> forms (:155-:158): "a two-step increase, because your last set had <n> reps left" (:155); "an early increase from one top of the window: your opening set was hard, your last set had <n> reps left" (:156); "an early increase from one top of the window, with <n> reps left on your last set" (:157); "a one-step increase after topping the rep window" (:158). Approval: none quoting them.
- F3 adopt explanation, adoptReason :165-:170: frame "<lift name>: on <date> you completed every set at <loads>" + one of three middles + ". Offer: make that your working weight. This sets your working weight; it is not an earned increase. Nothing changes unless you say yes."
  - F3a missed debut (:167): middle " (the card said <loads>, your first workout at the new weight you agreed; your working weight stayed <loads>)". Approval: D:804 "the missed-Close explanation "(the card said [debut weights], your first workout at the new weight you agreed; your working weight stayed [weights])": "Approve as written"". NOTE: the D:804 quote is the parenthetical only; the frame words around it are the same bytes as F3b/F3c and no DECISIONS line quotes them (brief class B reads D:804 + spec :481 as covering the whole template; that reading is the PM's).
  - F3b ordinary adopt (:168): middle " (the card said <loads>)". Seen: under a "<lift name>: set your working weight" card after a workout completed at a load other than the card's. Approval: none.
  - F3c no weight on file (:169): middle ", and no working weight was on file". Seen: same card, when the lift had no working weight. Approval: none.
  - Stale comment (INFO, no change proposed): :162 "wording PROPOSED, not approved copy" predates D:804.
- F4 Undo explanation (:407): "<lift name>: undo the choice you agreed to before any workout used it. Your working weight goes back to <loads>. The workouts it came from stay recorded and are not counted again." Seen: under a "<lift name>: undo the agreed weight" card. Approval: none; it is NOT one of the D:798 five (D:798 approved the five today-entry.mjs strings only).
- F5 <loads>, setLoads :148-:150: "<w> lb on every set" when every set is the same, else "<a> lb, <b> lb, <c> lb"; a set with no weight is "no load". Approval: none quoting it.
- F6 set-list unit: each list line is "Set <n>: " + "<w>" + " " + "lb" (today-entry.mjs:283; unit "lb" set by today-bindings.mjs:697). "lb" alone is not prose to the lock and is absent from the corpus (" lb" is locked, owned by today-app.cjs x2). Approval: n/a (unit).
- F7 queue entry text (:550-:551): t "<LIFT NAME> <w> DEBUT" (name upper-cased), gate = the issuance reason (F1), rule "Agreed by you. It runs when it wins the structural slot." MEASURED STATICALLY whether a screen shows them: no file under the four scan roots or rebuild/m3/w6/local reads a queue entry's .t, .gate or .rule, or the engine feed (git grep, explicit paths). Engine path: today.cjs:201 makes the day's `structural` = the winning queue entry's t; engine-capture.cjs:103 stores it as the captured session's reason; gym-model.mjs builds its reason lines from the SLOT reason (:347, :364; slot reason = card note/live/why, engine-capture.cjs:96), and gym-app.mjs shows session.instruction (the day name), not session.reason (:349, :479, :481, :501). today.cjs:112-:143 card notes read q.newW/q.newWSets only (existing "DEBUT at <w> ..." notes, sealed engine text, not new). So on this static read, t, gate and rule are stored but NOT shown on the Today/gym page. Outside the scan roots: rebuild/m4/workout/prepared-panel.mjs:191/:238 shows decision current_reason (not the capture reason); writers.cjs:273-274 pushes "<t> COMPLETE" to the engine feed on a debut's completion, and no scan-root page reads the feed. Q23 is therefore conditional-false on the static read; a mounted check was not run.

### G. Recorded, not shown (brief class G measurements)
- G1 FC03 refusal details (rebuild/m4/workout/native-load-effects.cjs prose-like literals): not rendered by this panel. The controller keeps check refusals as {lift, code} only (today-entry.mjs:207, :261) and paint (:265-:292) never draws view.refusals; the host's check() returns refusal {code, refs, field} (today-bindings.mjs:686, :703). Only codes flow; no FC03 sentence reaches the panel.
- G2 W6 local text (today-bindings.mjs): the native host's respond() returns copy: null on every refusal (refused() :637) and no copy on success/decline (respond() :705-:730), so today-entry.mjs:262's result.copy is always null here and the page falls back to C6. The only athlete-visible W6 value is F6's unit "lb" and the offer loads (numbers). reconcileAndRefresh's nativeCode (:428-:432) is a code on the summary; no scan-root file reads summary.nativeCode (git grep today-app.cjs, gym-app.mjs: 0 hits).
- G3 Mounted coverage gap (brief "[MEASURE at T3l] whether the native-load panel needs new render states"): copy-lock-states.mjs imports gym-app.mjs mountGym, machine-settings-host.mjs and design.cjs only (:17-:24); it never mounts today-entry.mjs open() or the native-load region. So CL-COMPOSED (green) says nothing about the panel: none of A-F is checked in a mounted state, and F (engine sentences) is invisible to both the static scan and the current states. Whether to add panel states is the PM's call.
- G4 Corpus tooling (brief "[MEASURE at T3l] how they regenerate"): copy-lock-measure.mjs rewrites the WHOLE corpus from the tree (lock.measure over every scan-root file minus 13 named TOOLS, plus the 5 mounted states) with --write; without --write it prints the summary and the would-be sha256. It has no per-string or approved-only mode: run on DRY today it would lock all 15 UNLOCKED strings (the 10 unapproved ones included) and move the owners of Yes, Not now and Set . So the "only the approved-copy delta" review of D:818 can only pass after every C/D/E string is approved or removed from the product bytes.

## 5. Cross-check against brief rev6 2.3 / section 13 (findings, no decision)

- T3L-1 (confirms): the red-first list is exactly the brief's predicted 18 (A5 + C7 + E3 UNLOCKED, D3 OWNER-CHANGED); no unpredicted line.
- T3L-2 (addition, INFO): "Check next weight" is shown twice: the button text (:273) AND the check region's aria-label (:451, via NATIVE_LOAD_COPY.check). One literal, so the lock lists it once; Q1's answer governs both uses.
- T3L-3 (INFO for the PM's reading of class B): D:804 quotes only the missed-debut parenthetical; the adopt frame ("<lift name>: on <date> you completed every set at <loads>" ... ". Offer: make that your working weight. This sets your working weight; it is not an earned increase. Nothing changes unless you say yes.") is shared byte-for-byte with Q19/Q20, which the brief lists as unapproved. If the PM reads D:804 as approving the frame for the missed form, the same frame words are already approved text when Q19/Q20 are asked.
- T3L-4 (confirms Q23 conditional, static only): FC01's queue text t/gate/rule reaches no Today/gym screen on the static read (F7); t is stored as the captured session's reason, which no page renders.
- T3L-5 (process consequence, INFO): the regeneration tool is all-or-nothing (G4); with any C/D/E string still unapproved in the product bytes, T3l steps (2)-(4) cannot produce an "approved-only" corpus delta.
- T3L-6 (coverage, INFO): the mounted-state half of the lock (CL-COMPOSED / copy-lock-states.mjs) never mounts the native-load panel (G3), so the engine sentences F1-F5 are checked by nothing in the copy lock; their only pins are the FC12/FA03 copy rows the brief cites (not read here).
- Other ledger context read at D:777-:839: D:791 "its undo wording waits for Joe's copy approval"; D:798 the five approved "exactly as at c0695e0"; D:804 as F3a; D:818 "the corpus stays sealed, a wording change re-measures it in a reseal child with an independent diff review"; D:819 corpus e3b1be10 (958 pieces) is the copy-lock acceptance; D:820 (look) "each new string enters approved copy through a listed pack edit, never silently". No line in :777-:839 quotes any of C1-C7, D1-D3 in the offer card, E1-E3, F1, F2, F3b, F3c, F4 or F5.

## 6. Files (all in C:\Users\joeym\AppData\Local\Temp\s11-t3l-scratch; nothing in DRY or any worktree written)

- copy-lock.cjs, copy-lock.corpus.json: byte copies of DRY (sha256 above).
- copy-lock.test.mjs: DRY copy + 3 marked scratch edits (hash in the structured return).
- t3l-run.cmd (the one cmd file), t3l-run.out.txt (TAP), t3l-run.exit.txt ("EXIT 1"), pmrun.out.txt (slot log), cl-holds-refusals.json (the 18 lines as JSON).
- T3L-COPY-REPORT.md (this file).
Not done, by rule or scope: no corpus regeneration, no copy-lock-measure.mjs run, no edit of any tracked byte, no spec 7ef8291 re-read (its :352/:355/:481 cites are the brief's), no FC12/FA03 copy-row read, no mounted run of the native-load panel, no second OS.
