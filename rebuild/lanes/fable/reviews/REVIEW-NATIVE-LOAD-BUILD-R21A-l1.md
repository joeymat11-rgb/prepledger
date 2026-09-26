# REVIEW NATIVE-LOAD BUILD ROUND 21a (Fable l1, independent reviewer)

Reviewed: the uncommitted round-21a cells on 40eb702 in earned-nlr (git diff 40eb702 -- FC12, FA03, the build report).
Date 2026-09-25. Reviewer did not write any of the cells. Rules: opus55-RULES.txt (sha 51706c33); every run through
node %TEMP%\pm-run.cjs shared (job fable-r21a-a1), TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03, guard preload;
every TAP "GUARD protected-in-cache: none; refused: none". Scratch: %TEMP%\nlr21a-fab (run.ps1, a1.txt, out\*.txt,
fix-probe.json, check-mut.cjs). Nothing committed, pushed or written to DECISIONS.md.

## VERDICT: ACCEPT (test-only round; all five items paid as claimed; one advisory for the FC03 fix builder)

## 1. No product byte moved (verified)
- sha256 prefixes on the working tree: FC01 92a4a0b4, FC03 373c9b1c, FA03 aac473ef (all equal to 40eb702); FC12 a0028bad,
  report 8e0c71bb (the builder's values). git status names FC12 and the report only. git diff --stat 40eb702: FC12 +124/-6,
  report +31. The 6 removed FC12 lines are exactly the round-20 twoDevice block; no assertion, seed, pin or invariant was
  removed or weakened anywhere else (the rest of the diff is appended rows and helpers after N27-B39-TWO-EXIT-NULL).
- FC12 492506 bytes, CR 0, non-ASCII 0, final LF; report CR 0, non-ASCII 0.

## 2. Mutants (re-run by me; builder's overlay specs checked byte-equal to Astra's own-manifest.json)
- check-mut.cjs: L13-M03/M04/M05/M06/M08 specs VERBATIM against native-load-astra-l13-a42168d\own-manifest.json (read-only).
- My runs (pattern ^L13-B2, 5 cells): M03 4/5, only L13-B2-NULL-REF-MIXED red (out\f-M03 d14dd2c5); M05 4/5, only
  -WRONG-COMMITMENT red (f-M05 678aca02); M08 4/5, only L13-B2-ANCHOR-KIND red (f-M08 9c1a9809). Each TAP shows
  "OVERLAY ... applied 1". M04 and M06 I did not re-run; the builder's logs (11ba6c41, eaec664c) show the same one-cell kill shape.
- b2-ii-superseded-M1 (pattern ^L13-B3,^N27-B39-TWO): 0/2, both L13-B3-TWO-EXIT-RETURNED and N27-B39-TWO-EXIT-NULL red
  (f-ii d4a8abc5). Astra's B3 survivor is dead.
- Head, ^L13- (11 rows): 7 pass, 4 todo, exit 0 (f-rows 1a98c55f). Strict (NLR_KNOWN_RED_STRICT=1): 7 pass, 4 fail, exit 1,
  exactly L13-B1-REDUCE-I6 ("R1 = R2 in the unproven layout") and the three L13-B1-SEED rows (each "PROPERTY8 I6 unprovable
  order differs under {unproven:same, rev:fx-revision-2}") (f-strict ed55181f).

## 3. Cells are faithful to Astra's probes
- nullRefProbe mirrors probes.cjs NULL_REF (neverHeldNull(false), nc-y1, the same four bad-ref modes and the 'valid'
  control); L13-B2-ANCHOR-KIND mirrors ANCHOR_WRONG_KIND (b39Return atW(100,[],[exit]), C3 Start re-kinded session-set);
  L13-B3-TWO-EXIT-RETURNED mirrors TWO_EXIT_NULL (c4 at 65, second yes on fx-device-B with causal parents [fx-resp-1, C4 Close]).
  Astra's probes.cjs 'after-anchor' mode is not a named B2 gap and has no cell; optional, not owed.
- L13-B1 reduceI6 mirrors reduce-i6.cjs (two tops 100, Q105 yes, C3 105 -> 95 adopt-observed, host-v1 C4 95 at base 102.5,
  adopt-baseline 95 naming [fx-resp-1, r21-missed-yes], base back to 100; unproven = plan ops on device B, increasing seq,
  no causal parents). L13-B1-ORDERED-CONTROL is the ruling's "unchanged in the ordered layout" clause, green on both revisions.

## 4. Known-red rows are honest and flip on the ruled fix (probed)
- KNOWN_RED/knownRed: node:test todo when NLR_KNOWN_RED_STRICT is unset (whole-file exit 0, "not ok # TODO KNOWN-RED
  L13-B1 ..."), ordinary test when set. Unknown debt names throw. Acceptable convention; the PM must delete the entry when
  the fix lands (a passing todo is silent in the default run; the strict run is the flip check).
- Fix probe (in memory only, fix-probe.json, anchor unique): the crudest form of ruling (i), correspondence() under EVERY
  revision (if (!reproducible) -> if (true)). Strict ^L13-B1: 5/5 pass (f-fixprobe-strict 91d98ef3): all four known-red
  rows flip green and the ordered control stays green, with R2's pinned issue list unchanged. So the pins are reachable
  and the rows are red only for the ruled reason.
- ADVISORY for the FC03 fix builder (not a round-21a defect): that crude form regresses exactly one existing row in the
  whole file: R12-COMPENSATION-IDENTITY (FC12 :1825) reports field 'spend_id' instead of 'compensates' for fx-resp-3
  (f-fixprobe-fc12 6efbd48a: 225 tests, 224 pass, 1 fail). The fix must lift ONLY the adopt-baseline authority_refs arm out
  of the !reproducible gate (or gate the R1 re-evaluation on it), as the ruling says, not all of correspondence().

## 5. D-L13-WALK-I3: the twoDevice transform preserves the partial order and drops nothing
- New transform: per ORIGINAL device, each op gains as causal parents the op(s) at the greatest strictly smaller device_seq
  on that device (its original causal_parents kept), then the plan ops of device d move to 'fx-2dev|'+d in original order.
  Every edge added is an edge the original same-device sequence already implied; no cross-device edge is added (the
  round-20 global chain was the defect). I checked FC03 provenBefore (:277-292): same-device precedence is a direct check,
  ancestry follows causal_parents/device_predecessor_op_id; after the move every former same-device proof is reachable
  through the added parent chain, so no proof is dropped.
- Observation (non-blocking): because the original fixtures carry no device_predecessor_op_id, the original layout's engine
  proof does NOT compose a device-sequence step with a causal step, while the transformed layout does (the chain is
  explicit). The transform can therefore make the engine prove an order the original layout leaves unproven; that is a
  fidelity gain toward the spec's proven causality, not an added order, and the 17000-seed interval shows no I3 under it.
- Red-first: with the round-20 block restored in memory (r20-twodevice overlay), seed 13030374 fails "PROPERTY8 I3 differs
  under {twoDevice:true}" (f-i3-old bcdb146b); on the head it passes (f-i3-head 6d42347a).
- Walk union (builder's four shared shards, same interval as Astra's 13024001..13041000, 17000 seeds): 49 counterexamples,
  I6 16 (the same 16 as Astra's I6 class, STOP-R20B2-3 / L13-B1), I15 27 LOAD_MAPPING_REQUIRED + 6 BASELINE_UNPROVEN
  (STOP-R20C-1's legacy class, part C's ruling), I3 0, no I1/I2/I14/I16/I17/CARD-PARITY. No seed skipped, no assertion changed.

## 6. D-L13-HOST-C
- Already paid by part C's FA03 'return-undo' variant (:1253-1269): after the return the exit's Undo is accepted (w null, no
  hold), D3 on the baseline ask at 50 is offered an adopt-baseline whose yes carries []: the later baseline-ask completion
  Astra asked for. FA03 unchanged (aac473ef), 46/46 in the builder's fin-fa03 (3e1f9e8d). Astra's L13 was of a42168d (FA03
  68c468f6) and could not have seen it.

## Not done
- No 80-file run (no product byte moved). M04/M06 mutants not re-run by me (builder's logs read). The FC03 fix itself is
  out of scope; the fix probe above is a reviewer's in-memory overlay only and is not a proposed patch.
