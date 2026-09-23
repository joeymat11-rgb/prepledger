# D-EPP-2 CAPTURE REPAIR ON THE EPP PARENT (builder Claude Opus 5.5, 2026-09-23)
Worktree %TEMP%\earned-ecr2, branch rebuild/e-capture-repair-epp at 0d38b8e (EPP head). Nothing committed.
Grant: DECISIONS:784-785 2b. PM ruling: land on the EPP parent and ship with EPP (the earlier STOP was at fe9f14b).
Sources, which agree: DECISIONS:639 and :644 D2; f0a5eb1a REVIEW-EPP-l1.md section 4 and D-EPP-2 ("give line 69 the
same exclusion, keep the plurality refusal for two eligible entries"); a7b0e24 EARN-ON-PHONE-OPTIONS.md :250-254 and
:848-857; NATIVE-LOAD-SPEC 6ddf7af R7 :80-84. Parent check: today.cjs sha b4ebee3c... carries today.cjs:97
x.state!=="PROPOSED". Other than the EPP files, fe9f14b differs from 0d38b8e only in two engine lines.

## Red first (real composed engine, original capture, EPP head)
Cell rebuild/m4/workout/test/engine-capture-proposed.test.cjs, copied byte for byte (sha256 96d56236...7912b4).
It composes the twelve public factories and refuses the protected five through a Module._load guard. The validator is an identity stub and all fixtures are invented.
RED (scratch epp-red.txt): 6 tests, 3 pass, 3 fail. CAP-P1, P2 and P3 fail with
"RED D-EPP-2: capture refused ENGINE_CAPTURE_LOAD_MAPPING_REQUIRED". C1, C2 and G pass.

## Product change (one line, rebuild/m4/workout/engine-capture.cjs:69)
-    const selected=card.isDebutNow?input.queue.filter(q=>q.exId===card.id&&!q.done&&['debut','unlock'].includes(q.kind)):[];
+    const selected=card.isDebutNow?input.queue.filter(q=>q.exId===card.id&&!q.done&&q.state!=='PROPOSED'&&['debut','unlock'].includes(q.kind)):[];
The exclusion is word for word today.cjs:55/:97 and writers.cjs:227. Line 70 is unchanged, so two eligible entries still refuse.
sha256 before 309c75d8...e08785, after ae899082299adfab63540d5735a889a9f99cb37588b05b23b614d6d404436c55.

## Green (scratch epp-green.txt): 6 tests, 6 pass, exit 0
Probe: P1 card 105 captures [105,100]. P2 card 105 captures [105,105,105]. P3 [105,100]. The equal-newW
PROPOSED [105,90] case captures the DEBUT's [105,100]. The card and the capture always agree on the DEBUT entry.

## Pins of the old refusal, updated as D-EPP-2 requires (CI-ONLY: they need PERFORMED_W6_DIR)
engine-capture.test.cjs:80-81 (now :80-86). A PROPOSED 45 [45,30] placed before DEBUT 45 [45,40] was a refusal. It now asserts
card.w 45 and captured [45,40] (the PROPOSED vector is never captured). An added second eligible DEBUT must still refuse
LOAD_MAPPING_REQUIRED, which keeps the plurality refusal pinned.
configuration-capture.test.cjs:79-80 (now :79-84). The PROPOSED now carries a distinct key 'band', so its selection shows.
The test asserts both slots are configuration 'hold' (the DEBUT). An added second eligible DEBUT must still refuse.
Local evidence without w6 (scratch pin-probe.cjs replays both edited sequences on the composed engine and a stub):
repaired: EC [45,40] and a refusal; CC ["hold","hold"] and a refusal. Original capture: all four refused.
node --check passes on both files. MARK FOR CI: both cells must run green at exact head on both OSes.

## Sibling check
The only lookup by lift in non-test m2/m3/m4 code (git grep of 'debut','unlock' and isDebutNow) is engine-capture.cjs:69.
resolveLayout reuses prepare(). No input that passed before changes: isDebutNow implies a non-PROPOSED
candidate (today.cjs:55-58), so a passing input had exactly one entry, and it was non-PROPOSED.

## Files (uncommitted) and sha256
engine-capture.cjs                     ae899082299adfab63540d5735a889a9f99cb37588b05b23b614d6d404436c55
test/engine-capture-proposed.test.cjs  96d5623610937effe5ee86e86aa4c7e51cb1f6e8c1fa526e3543bad30b7912b4
test/engine-capture.test.cjs and test/configuration-capture.test.cjs: see the final summary.
CI-only: the two updated cells, the rebuild/engine/test bar (proposed-pick.test.cjs), and every protected-five cell.
Owed: wire the new cell into CI (D-EPP-1), plus the EPP seal chain debts D-EPP-3 and D-EPP-4.
