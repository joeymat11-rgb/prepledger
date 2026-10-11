# S14 SEAL RUNBOOK (DRAFT) - M2-S14-HOLD (proposed id), the hold/bodyweight engine slice, from "lane at 1c66785" to "sealed, deployed, on the phone"

Builder seat, claude-opus-5-5, 2026-10-11, round 4; round 5 = Fable's S0 read (REVIEW-S14-RUNBOOK-FABLE.md, USABLE-WITH-CHANGES) R1-R6
applied as text, with the PM rulings of round 5 (R13 cut to debt; rev5 before S8; spec paper on the product lane; the PM pays brief 6.1's
three lines in S9). DRAFT for the PM; authorizes nothing. Adapted from rebuild/lanes/b/S11-SEAL-RUNBOOK.md
(sha256 3b04bcd2..., the runbook S11 was sealed by, DECISIONS:897) and the brief of record rebuild/lanes/b/S13-HOLD-BW-BRIEF.md section 6
(6.1-6.7; sha256 FC8B4A4B..., D:913; renumbered S14 at D:918). Process: the LIGHTER process of D:914 (3) - red-first cells for every rule,
ONE independent Fable read per step that needs a read, no closing-rule rounds (no three closing reads, no Claude Opus or Astra gate);
NOTHING ELSE in the brief is relaxed (sealed --full with the private census, receipt, VERDICT, both-OS hosted CI at the exact head,
chain freeze, C1 never pushed alone, fresh port). Every value below is MEASURED in the lane on 2026-10-11 unless marked PREDICTED.
Role tags: [builder] writes files only, never commits; [Fable] one static read; [PM] git, ledger, hosted CI, merges; [PM seat] runs on
the owner's PC under the owner's grant (pass/fail lines only); [owner] Joe's own steps.

## 0. Where the chain stands (MEASURED)

- Lane: %TEMP%\earned-s13hold, branch rebuild/c-s14-hold, HEAD 1c66785 = merge of origin/rebuild/t2-client-core (0043823, ledger to
  :921) into bd7f91b (S14 rounds 1-3, committed by the PM). Uncommitted at this draft: the round-4 copy-lock moves (section 2).
- Sealed parent: M2-S11-NATIVE-LOAD, rebuild/m4/spec/acceptance-s11-native-load.json sha256 bde69f156c4f88e1... (POSTFIX-ACCEPTANCE
  :895, receipt line :896, sealed and merged :897, seal tip 7c79ef1); receipt rebuild/lanes/b/tooling/receipts/S11.json 48574b8d...;
  coach rebuild/coach/engine-revision.cjs:25 = "M2-S11-NATIVE-LOAD@48574b8d8f252e87".
- The ONE unsealed --ci child: M2-S13-POLISH (THEME :918, BRIEF BY SHA :919, released :921 at 7347ba6). packages/S13.json (26e85e84...)
  holds THE single parent claim on the S11 artifact (parent.decided true, chosen "S11"); 'S13' is in b-package.cjs IDS (:198) and
  NO_REGISTER_IDS (:365); rebuild.yml:197 standing step `--ci --package S13`; 40 children (S11's 39 + s12-look); product 341 (291 carried,
  29 edited, 21 new); coverage.superseded null; artifact block acceptance-s13-polish.json (never exported: no seal under :918).
- S12 was retired by supersession at :920 (S12 out of IDS and NO_REGISTER_IDS; packages/S12.json kept as the record with its parent claim
  withdrawn: decided false, chosen null, a note). b-package.cjs parent() admits ONE sibling claim (SINGLE-PARENT-CHAIN, :2232; and
  SINGLE-PARENT-CHAIN-SEALED, :2241, over sealed artifacts on the chain).
- REGEN helpers present: S10-REGEN.cjs, S11-REGEN.cjs (a283b778), S12-REGEN.cjs, S13-REGEN.cjs (25cf6d72; "PORTED FROM S12-REGEN", itself
  the port of S11-REGEN).
- Owner grants for this slice (D:913, 2026-10-10, given for "S13" = this slice before the :918 renumbering): (2) OQ-1 PM-seat protected
  engine runs, pass/fail only; (3) OQ-2 standing fresh port after each engine update; (4) OQ-3 one yes/no check; (5) OQ-4 standing PM copy
  approval, list after release. The PM records in one line that these apply to the renumbered S14 (no new owner question: the words name
  the slice, not the number).

## 1. Post-merge proof (round 4, this seat, 2026-10-11, on 1c66785 + the round-4 copy-lock moves)

Every file under the S12 C-2 guard (`node --require %TEMP%\s12-c2\guard.cjs`, NODE_OPTIONS also carrying it), sequential;
%TEMP%\s14-r4\runs\pm1-summary.txt and per-file logs. GREEN: FC12 native-load-options 486/486 (the four R34-BR3* host cells skipped by
name), FA03 native-load-panel 104/104, gym 71/71, checkin 28/28, coach 12/12, design 16/16, GSS annex g6-g8 5/5, identity-reentrancy 7/7,
log-timing 3/3, remount 7/7, timing 3/3, look-cui2 5/5, look-cui3 15/15, ntc-h6-delta 8/8, workout-look 25/25, engine-pins-unprotected 1/1,
local-source-order 4/4, native-load-replay 11/11, tooling execution-targets 10/10, pinned-unchanged-and-ruled-substitutions 17/17;
copy-lock 15/15 after the E12 moves (section 2). production-mapping 19/20: the one red is P3-M1, STOPPED BY THE GUARD (it loads
engine/index.cjs), so it is a PM-seat cell (and the E10 re-pin's red-first cell). 0 product failures.
PM SEAT (guard-stopped, never run here): view, adapter, catalogue (today); live-clock, refusal-route, refusals, route (w7 import);
browser-parity, engine-provider (11 cells guard-stopped), prepare, reading-replay, production-mapping P3-M1 (m4 import).
PM SEAT (bundler or child processes, not run here by rule): copy, food, machine-settings-ui, package, problem, scene, setup (import
build.mjs); w7 import page-bundle (esbuild); m4 production-admission (spawns the port tool), s3/harness (spawns unguarded node children);
tooling child-diagnostic-tail, gate-supersession, parent-gate-closure-and-load-floor, parent-pin-shapes-and-spec-successors,
product-phase-and-ledger, release-from-seal, seal-tip-and-byte-identity, successor-moves (each git-inits and commits a fixture repo; a
builder seat runs no git commit).

## 2. The copy lock: exactly the two PM-approved moves (round 4, uncommitted; red first)

On the merged tree before the move the lock was 8/13, every red caused by the two approved moves and nothing else: CL-HOLDS and CL-PLANTS
(COPY-LOCK UNLOCKED today-entry.mjs "bodyweight sets have no weight to agree to. Your sets are saved."), CL-ENGINE-COPY, -COPY-TEETH and
CL-ENGINE-OUTPUT-TEETH (ENGINE-COPY CHANGED NL-LOADS, the R2b setLoads block). The move (rebuild/m3/w7-preview/today/test/):
- copy-lock.corpus.json re-measured by copy-lock-measure.mjs --write (under the guard): 1276 -> 1277 entries, exactly ONE new entry
  {text: the R4 line, files: {today-entry.mjs: 1}, lists: []}; no entry removed or changed, no state, scanned file or tool moved;
  corpus sha256 72f5d0da... -> 3a226341aac5832d490ffa652e6cf969c5f55b1820024695c94e5713880e9a98.
- copy-lock.test.mjs: CORPUS_SHA256 -> 3a226341...; NEW CL-S14-DELTA (the corpus is the released S13 corpus plus exactly that piece, both
  directions, with a blind-check tooth; S13_CORPUS_SHA256 = 72f5d0da...) and CL-S14-APPROVAL (S14_COPY_APPROVAL = DECISIONS:913, i.e.
  :913 (5) and brief 12.11); CL-S12-DELTA and CL-S11-DELTA now judge s13View(corpus) (the S12 pattern: "judged on the corpus the delta
  rebuilds"), each assertion unchanged; NL-LOADS source pin = the S14 setLoads block, approval "DECISIONS:842 (the load formats) and
  DECISIONS:913 (5) (the S14 R2b piece)"; two NEW CL-ENGINE-OUTPUT cases (the hold adopt sentence "(the card said hold on every set)" and
  its Undo "goes back to hold on every set"), written by hand; LITERAL-COUNT 30 -> 31 (NL-LOADS gains 'configuration', whose
  one-character mutant the new case refuses).
- RED FIRST: CL-S14-DELTA red before the re-measure ("... is null"); the two new CL-ENGINE-OUTPUT cases red on the round-1 engine
  (native-load.cjs before R2b printed "no load on every set"; the ten existing cases green there). GREEN now: 15/15.
- The b-package child s10-copy-lock's needle moves '# pass 13' -> '# pass 15' (PREDICTED; taken from the hosted run at T5b, never typed).

## 3. Package design (PM rulings in [brackets])

3.1 Identity. [PM names] M2-S14-HOLD, lanePackage 'S14', slug s14-hold: artifact rebuild/m4/spec/acceptance-s14-hold.json, review
    rebuild/m4/spec/review-s14-hold.json, receipt rebuild/lanes/b/tooling/receipts/S14.json, verdict rebuild/lanes/b/VERDICT-S14.md.
3.2 Parent. The SEALED S11 artifact (bde69f15..., receipt line :896, sourceBase 7c79ef1). S14 is a SEALED child (engine bytes move:
    native-load.cjs; FC03 native-load-effects.cjs; production-mapping.cjs re-pin), so --full with the private census applies (brief 6.4).
3.3 Retiring S13 exactly as :920 retired S12. S14 must carry EVERY byte S13 declared (S13's 341 product posts, re-measured from the S11
    seal, plus S14's own) and then hold the single parent claim:
    (a) S14-REGEN measures every post at the S14 head against the S11 seal, so every S13-edited or S13-new path is re-declared by S14 with
        its current post (carried bytes stay carried; nothing of S13 is dropped: the REGEN's own "paths changed since the parent and not
        declared" check refuses an omission);
    (b) packages/S13.json stays as the record with its parent claim WITHDRAWN (parent.decided false, chosen null, a note citing the new
        PM line), because deleting it would make the fence read S14.json as its rename (:920's reason);
    (c) 'S13' leaves IDS and NO_REGISTER_IDS (b-package.cjs :198, :365, with a comment in the :920 form: "'S13' LEAVES with its id
        (DECISIONS:<n>)"); the F6 pins in the tooling tests that enumerate IDS move red first with it; no check, pattern or fence moves;
        S13-REGEN becomes dead (kept, as S12-REGEN was);
    (d) one PM ledger line "S13 RETIRED BY SUPERSESSION - M2-S14-HOLD carries every byte M2-S13-POLISH declared, re-measured from the S11
        seal, and holds the one parent claim" (the :920 shape), BEFORE S14's THEME line.
3.4 S14.json via S14-REGEN, PORTED FROM S13-REGEN (not from S11-REGEN directly). Why: S13-REGEN IS S11-REGEN's engine-package
    measurement (every product pre from the sealed parent's product map, superseded execution pins, parent option hashes, receipt line,
    sourceBase, runner pin, the PENDING census, the stale-note flags), carried through S12-REGEN, plus the two reviewed additions the
    CURRENT chain needs: (A) the ANCESTOR-RELEASE walk (S9/S10 released today-app.cjs, gym-app.mjs, preview.css, build.mjs; plain
    S11-REGEN would declare them "new" and re-seal presentation files the owner took out of the sealed inventory - S13 changed three of
    them, so S14 hits this for certain), and (B) --worktree (a builder seat authors S14.json before the PM commits; the proof is the
    dry run at the commit printing "0 entr(ies) would change"). The --full mode is the runner's (b-package.cjs), not the REGEN's: the
    REGEN measures; it never seals. Port edits: FIXED_INPUTS packages/S14.json; the fixed parent and its slug unchanged (s11-native-load);
    SCOPE = S13-REGEN's entries plus this helper and its test (S14 adds no product root: every S14 path lies under an existing root -
    rebuild/engine, rebuild/m4/workout, rebuild/m4/spec, rebuild/m4/import, rebuild/m3/w7-preview/today and its test folder, the pack
    files of W-46 if the pack is a declared root [builder confirms at port]); protected five never read and byte-identical. The spec
    paper rebuild/coach/NATIVE-LOAD-SPEC.md (NEW in bd7f91b, 631 lines; PM ruling S1 (g)) is treated ON PURPOSE: the port confirms
    whether rebuild/coach is a declared root (engine-revision.cjs is a declared post) and, if so, the paper is declared as an S14
    post BY NAME with a S14.json note citing S1 (g) - never swept in by the root alone; if the root rule would not take it, the
    builder stops and the PM rules in one line. NEW
    rebuild/lanes/b/S14-REGEN.test.cjs (the S11/S12 refusal rows on synthetic ports) with its CI home step in rebuild.yml, as :429/:437.
3.5 Registers. IDS gains 'S14' (and loses 'S13', 3.3 (c)). NO_REGISTER_IDS gains 'S14' with the standing comment form ("'S14' is in for
    the same reason an eleventh time: M2-S14-HOLD is a reseal whose product delta is the hold/bodyweight slice (brief of record :913) and
    the S13 polish it carries, slice-plan work under DECISIONS:455 with no register D-id. It is an S- id, so the shape assertion admits it
    without a PM by-name ruling"). dIds []. The slice's debts (D-S13-BW-CONFIGURATION, D-S14-INERT-CLAIM, the fixture note, D-T30-
    REPIN-ORPHANS mitigated, D-S12-SCENE-DUP-1 by the PM's R13 cut) are VERDICT debts, not register D-ids.
3.6 Children (CHILD_SPECS = S14.json children). S13's 40 children, argv byte-equal (the S14 cells live inside native-load-fc12, today-17,
    s10-copy-lock and, with R12, w7-import); no new child unless a new test file is added [PM, brief 12.7: s13-hold only if needed - none is
    needed so far]. Every needle from the hosted T5b run's published lines, never typed (PREDICTED moves: native-load-fc12 '# pass 478' ->
    about '# pass 491' hosted with the R34 cells, i.e. +13 S14 cells; today-17 by the S14 cells in gym (+4) and FA03 (+1);
    s10-copy-lock '# pass 15').
3.7 GATE-SUPERSESSION. S14 moves rebuild/engine bytes (native-load.cjs only), so it is NOT zero-engine: it writes its own token line
    "GATE-SUPERSESSION M2-S14-HOLD source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate" mirroring :873
    (the five gates S11.json coverage.superseded names, MEASURED; the --full run reports these plus the gates the runner carries from the
    ancestors - S11's T20 printed "9 SUPERSEDED under DECISIONS:873"), conditions (i)-(iii) restated for the child of M2-S11-NATIVE-LOAD:
    it moves native-load.cjs (FC01) inside the brief's three E1 hunks and nothing else under rebuild/engine (no writers.cjs, no
    progression.cjs byte; the protected five byte-identical). S14.json coverage.superseded = S11's gate map with rulingLineSha256 = the
    new line's sha256 (computed inside node from the chain bytes, S11 runbook section 0). The s11-sup-* children stay (their argv pin
    the supersession cells; the PM confirms none names S11 by id in a way the S14 id breaks - else they move red first, named).
3.8 rebuild.yml. The standing step (:196-197) becomes `run: node rebuild/lanes/b/tooling/b-package.cjs --ci --package S14` and its name
    "Cumulative S14 HOLD reseal, S13 POLISH reseal, ..."; the comment block above it rewritten for S14 (an engine reseal: sealed
    --full, gate supersession, ENGINE_REVISION moves); a CI-home step for S14-REGEN.test.cjs; the Today step already names gym.test.mjs,
    native-load-panel.test.mjs and copy-lock.test.mjs (D:821; re-check, no file is new). A workflow edit is read by Fable once (with 3.4).
3.9 Exporter. The S11 export used a literal port (export-s11-profile-v1.cjs.txt at e93b1ed: specRel packages/S11.json, argv '--package
    S11', asserts slug s11-native-load, output "S11 PROFILE EXPORTED PENDING"). S14 needs its literal port export-s14-profile-v1.cjs.txt
    (packages/S14.json, 'S14', acceptance-s14-hold.json / review-s14-hold.json, folder earned-s14-profile-export-results, s14-final-1),
    with its static self-check re-run against the final runner sha and one Fable containment read on the FINAL inputs before T10.
3.10 Copy. Approved: section 10 string 2 (R4) and the R2b piece, PM under OQ-4 (:913 (5), 12.11). If R12 lands, string 3 joins the same
    approval and the copy lock's S14 delta (CL-S14-DELTA gains one row, red first).

## 4. The steps (each red is RECORDED in the next ledger line and in VERDICT-S14, never excused, D:835)

PART A - finish the build and the package (T1-T6)
S1  [PM] Rulings before any T3 byte: (a) package id M2-S14-HOLD; (b) RULED (round 5): R13 SCENE-DUP is CUT to the debt
    D-S12-SCENE-DUP-1 (E9 not done; the brief's R13 row is paid by the debt; S5 deleted); (c) R12 import sentence: keep (recommended;
    small); (d) RULED (round 5): the brief rev5 IS written (S1b) and accepted by sha before S8; (e) the :913 grants recorded as applying to
    S14; (f) E14 runner home (outside the lane, the PM's PC); (g) RULED (round 5): the R9.14-A spec paper lives on the PRODUCT lane as
    rebuild/coach/NATIVE-LOAD-SPEC.md as committed in bd7f91b - one place, reviewed with the code it governs; S14-REGEN treats it on
    purpose (3.4); rebuild/c-native-load-spec 7ef8291 is SUPERSEDED for R9.14 (the brief's E3 home); rev5 records the ruling and why.
S1b [builder -> Fable (one read) -> PM commit] BRIEF REV5, before S8: %TEMP%\s14-r4\S14-HOLD-BW-BRIEF-rev5.md (builder, round 5) = the
    brief of record with the S14 number everywhere (package M2-S14-HOLD; polish S13; gym S15), "non-blank (non-empty after trimming)" in
    section 3 and E1, the R1 legacy wording, the R13 cut, the R12 ruling (as S1 (c) gives it), the E14 home, the spec home (S1 (g)), the
    rulings since :913 (:914 (3) lighter process, :918 renumbering, :920 pattern for the S13 retirement, R2b approval :913 (5), the fixture
    note, D-S14-INERT-CLAIM, the FC03 equivalent mutants), the 4.5-6 day estimate; a "rev5 changes" table at its top. Its sha256 is
    recorded in the Fable read, in S9's BRIEF ACCEPTED BY SHA line and in VERDICT-S14 beside FC8B4A4B. The PM commits it at
    rebuild/lanes/b/S14-HOLD-BW-BRIEF.md [PM names the path] BEFORE S8 runs S14-REGEN --write, so S14.json's brief block pins rev5's
    bytes; rebuild/lanes/b/S13-HOLD-BW-BRIEF.md stays byte-identical as :913's record. If S1 (c) or (f) is ruled after rev5's read, the
    PM records it in a ledger line and VERDICT-S14 (no rev6 for a ruling the brief already offers).
S2  [builder -> Fable -> PM commit] Round 4 as delivered: the post-merge proof (section 1) and the E12 copy-lock moves (section 2).
S3  [builder -> Fable -> PM commit] R12 (if kept): import/import-screen.mjs REFUSAL_SENTENCE for LOCAL_SOURCE_NATIVE_LOAD_RECORD_INVALID
    (string 3), cell S13-R12-WORDS red first; CL-COMPOSED-DATA (the lock green on "hold" and the lift name as data, red on an unlisted
    literal); CL-S14-DELTA gains string 3, red first.
S4  [builder -> Fable -> PM seat] W-46, the one new app state (brief 6.6; STOP-S13-LOOK ruled not hit, round 1): pack edits R('W-46') in
    app/states-workout.js, its app/states-index.js row and the inventory row; the panel line drawn in the status line's metrics; baselines
    W-46-dawn/-ink JSON + INDEX and the per-platform thumbnails accepted on the machine of record (--accept, then --accept-thumbs on the
    second platform), each a listed pack edit with its SC-n id, red first; the whole-pack content pin and the app digest line move red
    first, declared; look cells in look-gates.yml. Each edit listed for the owner (D:817 "Yes, list each").
S5  DELETED (round 5): R13 is cut to D-S12-SCENE-DUP-1 by PM ruling (S1 (b)); no S13-R13-ONCE run. The number is kept so the
    Fable S0 citations stay true.
S6  [builder -> Fable] E14: the T30 runner lists bodyweight lifts as ALLOWED_NO_OFFER with NATIVE_LOAD_BODYWEIGHT_NO_WEIGHT; 3-ALL expects
    an offer for equal-weight hold lifts; RECORD_INVALID stays a red for everything else. Runner kept on the PC (not in the lane).
S7  [PM seat + builder] E10 re-pin: production-mapping.cjs:68 treeSha256 by the off-seat method of D:841 (the brief's citation), the
    builder writing the literal the PM seat reports; P3-M1 red then green at the PM seat; the m4-import-production pair (28/28 at S11).
    After the re-pin NO rebuild/engine byte may move (none is planned: R12 is import/, W-46 is the pack, E14 is off-lane); any later
    engine byte reopens S7. The pin is proven at the sealed bytes by S29's byte-identity --full run, not by S7 alone.
S8  [builder -> Fable] T3 PACKAGE: S14-REGEN.cjs + S14-REGEN.test.cjs (3.4); b-package.cjs IDS / NO_REGISTER_IDS (3.3 (c), 3.5) and the F6
    pins red first; packages/S13.json claim withdrawn (3.3 (b)); packages/S14.json written by S14-REGEN --worktree --parent 7c79ef1
    --receipt-line 896 --write (children carried from S13.json, needles PENDING, coverage.superseded per 3.7, brief block, artifact block,
    notes regenerated; the brief block pins rev5's committed bytes, S1b); rebuild.yml (3.8); the S14 exporter port (3.9); the spec
    paper declared on purpose (3.4, S1 (g)); and THIS RUNBOOK committed as rebuild/lanes/b/S14-SEAL-RUNBOOK.md = the round-5 bytes
    the PM accepts on Fable's S0 read (sha256 recorded in the commit's ledger line and in VERDICT-S14), changed after that only by a PM
    line naming the change. ONE Fable read of the whole package step.
S8b [builder seat + PM seat] T4 (brief 6.4): EVERY child observed LOCALLY at the last product byte, before any hosted run. Builder
    seat: the unguarded files under the S12 C-2 guard (section 1's GREEN list). PM seat: the guard-stopped and bundler children of
    section 1 - view, adapter, catalogue (today); the w7 import children (live-clock, refusal-route, refusals, route, page-bundle) with
    D:912's @noble/ciphers in place; m4 browser-parity, engine-provider, prepare, reading-replay, production-admission; P3-M1 green
    after S7; the bundler and fixture-repo tooling children of section 1 - pass/fail lines only. Plus the D-W7IMPORT-FLAKE-1 hunter run
    (the s11-w7hunt.yml shape, both OS) and the bundle inventory pins: today-entry.mjs and gym-model.mjs moved, so a page-bundle or
    sealed-inventory pin that reddens moves RED FIRST, declared, named in the next ledger line. S10's hosted T5b then OBSERVES; it is
    never the first run of any child.
S9  [PM] Ledger, in order: (1) S13 RETIRED BY SUPERSESSION (3.3 (d)); (2) GATE-SUPERSESSION M2-S14-HOLD (3.7); (3) ANCESTOR RE-PIN
    RULED, (4) GATE LEG (C2 D3), (5) ENGINE_REVISION MOVES - brief 6.1's three items, PAID BY THE PM HERE (PM ruling round 5; bodies
    drafted below); (6) THEME M2-S14-HOLD (parent S11 bde69f15 receipt :896; carries the S13 polish bytes; moves native-load.cjs and FC03
    under the :913 grants; moves the coach ENGINE_REVISION constant at T23 (S28) and the E10 production-mapping.cjs:68 pin (S7); the
    spec paper on the product lane (S1 (g)); copy approved :913 (5); "no seal, receipt or VERDICT under this line" is NOT said - S14 IS
    sealed); (7) BRIEF ACCEPTED BY SHA naming rev5's sha256 (S1b), not the brief of record. Then the claims' lineSha256 values into
    S14.json (PM or builder from the chain bytes), committed; dry run of S14-REGEN at the commit prints "0 entr(ies) would change".
    DRAFT BODIES for (3)-(5) (builder, ASCII, each under 600 characters; the PM owns the final words and the line numbers):
    (3) ANCESTOR RE-PIN RULED M2-S14-HOLD (D-S12-ANCESTOR-REPIN) - no ancestor runner is re-pinned. With the S14 runner,
        b-package --package S11 and every older id refuse RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER by design; each older id stays
        reproducible only at its own seal (S11 at 7c79ef1, receipt :896; older ids at theirs). S14-REGEN's ancestor-release walk
        measures released ancestor bytes for the S14 declaration and re-pins no ancestor. The debt closes by this ruling and is named
        in VERDICT-S14.
    (4) GATE LEG (C2 D3) M2-S14-HOLD - the S14 acceptance artifact names the gate leg C2 D3 by id. Its four pack probes JS_FIT,
        JS_MARGIN, JS_SAFE and JS_GAPS (gate.py / statesheet.py, S12-LOOK-BRIEF.md :262) fall back to the host under S11's mount and
        pass trivially; each is either MEASURED at the look gate (look-gates.yml, both platforms; the run id cited in VERDICT-S14) or
        RULED (plain-chassis gate or a look-lane supplement) with its reason in one clause. None is excused silently; the pack and
        S11's mount are never edited for the gate.
        [Fable's runbook note, round 5: the probes are measured at the look gate, not at --full. The builder confirms at S8 which
        artifact field carries the leg.]
    (5) ENGINE_REVISION MOVES M2-S14-HOLD - S14 moves rebuild/engine bytes (native-load.cjs), so the coach constant moves once, at
        the seal: rebuild/coach/engine-revision.cjs:25 from M2-S11-NATIVE-LOAD@48574b8d8f252e87 to M2-S14-HOLD@<first 16 hex of
        sha256(receipts/S14.json)> at T23, commit C3, with the coach tests by glob and the m4-import-production pair green and
        byte-identity --full at C3. C1 is never pushed alone (:897). The E10 pin moved at S7 under :913 (2).
S10 [PM, hosted; Fable reads the workflow first] T5b OBSERVATION on a never-merged obs/s14-1 branch: both OS, every child observed;
    needles copied from the published lines only; the obs branch and any local ref deleted after (S11 E3 lesson).
S11 [builder -> Fable] T6: S14.json final (needles in, no PENDING left); ONE Fable read; [PM] commit = H, PRODUCT FREEZE.
PART B - the seal (S11 runbook T7-T28, unchanged in shape; S11 values -> S14; cmd files with BOTH git's and node's folders on PATH,
TZ=America/New_York, MEASURED_TEST_NOW as S11; FILTER -CaseSensitive; every b-package run exclusive through pm-run)
S12 [PM] T7 merge-forward #1 (never a rebase, :563), preflight 0 hits, obs/s14 commits not ancestors, and NO
    .github/workflows/s14-observe.yml in the tree (S11 runbook section 2); push -> CI-M1 both OS green.
S13 [PM seat, optional if CI-M1 green] T8 --ci at M1.
S14 [PM] T9 exporter clean step (rmdir the node_modules junctions, never Remove-Item a junction; the D:912 rule).
S15 [PM seat] T10 EXPORT with the S14 port -> "S14 PROFILE EXPORTED PENDING <artifact64> <review64> ..." (EXPORT FREEZE).
S16 [PM] T11 restore junctions; copy the two files in.
S17 [PM seat] T12 --ci with artifact + PENDING review -> ENVELOPE PENDING, 40 CHILD OBSERVED, PUBLIC CI EVIDENCE PASS; remove the review.
S18 [PM] T13 commit A (the artifact alone); push -> CI-1.
S19 [PM seat] T14 --full at A with the private census junction (target named by the PM, Test-Path only) -> REVIEW-PENDING, EXIT=2.
S20 [PM] T15 read CI-1 (both OS, both C font transport, S14-REGEN step by name).
S21 [Fable] T16 SEAL READ at A (artifact bytes, S14.json, the filtered T12/T14 lines, CI ids, exporter custody). ONE read.
S22 [PM] T17 one PM record line (T7-T16, every red), then L5 POSTFIX-ACCEPTANCE M2-S14-HOLD <A> rebuild/m4/spec/acceptance-s14-hold.json
    <sha> ACCEPTED; CHAIN FREEZE until S33.
S23 [PM] T18 review envelope V (ACCEPTED on the L5 receipt).
S24 [PM] T19 merge-forward #2 (DECISIONS.md only).
S25 [PM seat] T20 AUTHORIZED --full at M2 -> SEALED RUN RECORDED receipts/S14.json; POSTFIX PACKAGE PASS; EXIT=0.
S26 [PM] T21 commit C1 = receipts/S14.json unmodified - NEVER PUSHED ALONE (D:897: S11's C1 pushed alone went red at
    m4-import-production in the receipt-present, coach-literal-stale window).
S27 [builder drafts from filtered lines only -> Fable -> PM commit C2] T22 VERDICT-S14.md (artifact, spec, runner and receipt sha256;
    every red, debt and incident; section 5 of this runbook).
S28 [PM seat] T23 coach ENGINE_REVISION: engine-revision.cjs:25 "M2-S11-NATIVE-LOAD@48574b8d8f252e87" -> "M2-S14-HOLD@<first 16 hex
    of sha256(receipts/S14.json)>"; coach tests by glob and the production pair (PREDICTED 377+/28) -> commit C3.
S29 [PM seat] T24 BYTE-IDENTITY --full at C3 -> "AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY ...", POSTFIX PACKAGE PASS; then rmdir the
    census junction.
S30 [PM] T25 C4 (VERDICT terminal + seal reviews/reports); push the lane (C1-C3 only together with C4).
S31 [PM] T26 CI-2 at the exact head, the binding run, both OS green (a one-OS today-17 red -> empty re-run commit, recorded).
S32 [PM] T27 FAST-FORWARD onto rebuild/t2-client-core (plain push); THIS DEPLOYS the slice preview (slice-host.yml) under :816 (2).
S33 [PM] T28 L6 SEALED AND MERGED; chain freeze lifted; after-line with the chain and slice-host run ids.
PART C - on the phone
S34 [owner, PM guides] T29 PHONE PROOF on the deployed slice: a hold card shows the last real load with the plan line hidden; Yes;
    kill/reopen; the next card at the agreed weight; a Yes recorded before S14 still applied after reopen; a bodyweight lift logged at
    one weight in pounds and its panel line; both themes.
S35 [PM seat, owner's standing Yes :913 (3)] T30 FRESH PORT at the sealed commit (census junction restored for that run only), engine tree
    printed equal to the new pin; the updated T30 runner (S6) all PASS incl. 3-ALL; the 2026-10-08 bundle is expected to refuse
    SOURCE_ENGINE_CONTEXT_UNPROVEN and is kept (brief T30); decrypted copy deleted; junction removed. The OQ-3 yes/no check runs once
    here if not already run.
S36 [PM] T31 plain-words handoff and the copy list (string 2, the R2b piece, string 3 if R12) to the owner.
38 STEPS: S0 (this runbook's own Fable read - DONE, USABLE-WITH-CHANGES, R1-R6 applied in round 5), S1, S1b, S2-S4, S6-S8, S8b,
S9-S36 (S5 deleted).

## 5. What VERDICT-S14 must name (T22)

EVIDENCE: artifact, spec, runner, receipt sha256; this runbook's committed sha256 (S8, R5); the brief rev5 sha256 (S1b) beside the brief
of record's FC8B4A4B; the T4 local record (S8b) and the T5b record; CI-M1, CI-1, CI-2 run ids; exporter custody. EVERY RED (D:835): the
round 1-4 red-first cells (R1/R2/R3 reports), every S8b and T7-T26 red with run ids. RULINGS: R13 cut (S1 (b)); the spec paper's home
on the product lane, rebuild/coach/NATIVE-LOAD-SPEC.md as committed in bd7f91b, 7ef8291 superseded for R9.14 (S1 (g)); the three
brief-6.1 lines (S9 (3)-(5)). DEBTS: D-S13-BW-CONFIGURATION (bodyweight sets saved as bodyweight, its own engine slice);
D-S14-INERT-CLAIM (R1 != R2 for a forged missed-debut claim; FC01, spec R9.9); the FIXTURE NOTE (capture-less host v1 completion, a
state engine-history.cjs :69 refuses; fixture only); the FC03 non-blank rule's three equivalent mutants (defence in depth behind
DERIVABLE (c3)); D-T30-REPIN-ORPHANS mitigated by S35; D-S12-SCENE-DUP-1 (CUT TO DEBT by PM ruling, S1 (b); E9 not done);
D-S11-EN3-COPY (paid by R12 or carried); the brief/spec wording (non-blank, R1 legacy) as paid by rev5; the R34-BR3* host cells and
every guard-stopped cell as PM-seat evidence; the S13 polish debts carried by id (D-W6-LOCAL-TODAY-BROWSER, audit F6/F8/F9); S11's
inherited carries as VERDICT-S11 lists them. COPY: approvals :913 (5) / 12.11 (string 2, R2b, string 3 if R12). ENGINE: the coach
constant move (S28, ruled S9 (5)) and the E10 pin move (S7).

## 6. Order, parallelism, estimate

Parallel now: S1 rulings (b), (d), (g) given in round 5; (c), (e), (f) still to give || S1b rev5 Fable read || S2 Fable read || S6 runner
(off-lane). Then S3 || S4 (different files) -> S7 (PM seat) -> S1b committed -> S8 -> S8b (T4, builder seat || PM seat) -> S9 -> S10
-> S11 -> PART B strictly serial on the one lane (exclusive runs) -> PART C.
ESTIMATE (working days, the lighter process, MEASURED anchors: S11's T7-T28 took about 1.5 days including a restart; S10's best 2.8 h;
one Fable read about 1-2 h; a hosted both-OS run about 40 min):
- S1-S7 (rulings, rev5 and its read, round-4 read, R12 + CL-COMPOSED-DATA, W-46 pack state and per-platform baselines, E14, E10
  re-pin): 1.5 to 2 days (W-46's accept runs on two platforms are the long pole; R13's half day is already out by the cut).
- S8-S11 (S14-REGEN port and test, registers, S13 retirement, spec-paper declaration, runbook commit, yml, exporter port, T4 local
  observation with the PM-seat children and the hunter run, the seven S9 ledger lines, T5b hosted observation, needles): 1.5 to 2 days
  (one hosted cycle if green; +0.5 day per red child, as S12's three obs runs showed).
- S12-S33 (the seal): 1 to 1.5 days (one day if nothing is red; S11 needed a restart).
- S34-S36: 0.5 day plus the owner's own time.
TOTAL: about 4.5 to 6 working days from the PM's go (Fable's S0 figure: R1-R5 add about half a day), so on the phone about Friday
2026-10-16 to Monday 2026-10-19 if work starts Monday 2026-10-12; the honest risk is the W-46 baselines and any hosted red at T5b/CI-2,
each worth half a day.
