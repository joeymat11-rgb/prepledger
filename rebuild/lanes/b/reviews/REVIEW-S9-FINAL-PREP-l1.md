# REVIEW S9 FINAL ASSEMBLY PREP, l1 (reviewer claude-fable-5-1, 2026-09-23). Review only; nothing under review modified.
Inputs verified by sha256: S9.json HEAD 7dcdab1f (git show via cmd), working tree a14f9669, report f4e06865, hunk-A a3ac34e1,
hunk-B e65386cf, token drafts 74643afb, b-package.cjs 5321181a (blob c4224ee). Worktree fe9f14b5 on rebuild/b-s9-integration;
git status: only S9.json modified plus the untracked report. Chain origin/rebuild/t2-client-core ec424456, DECISIONS 786 lines
sha e600de71. Both patches reverse-apply clean (git apply --check -R exit 0); diff HEAD = 87 ins / 20 del = 19+68 / 19+1, so
working tree is exactly hunk A + hunk B and nothing else. Static only: no test, no protected module, no runtime lock needed.
Blind order kept: brief sections 10-11, runner :1543-1693 (releaseRuling, supersededSpecShape), :1943-1953 child grammar,
:2793-2846 children(), :966-1018 tokens, :1035-1036 ruledTerminal (U+00B7 measured), chain :766-785, then patches, then report.

## VERDICT: ACCEPT WITH NAMED DEBTS (hunks A and B correct; D1 below is a BLOCKING defect in two of the four token drafts)

## (A) hunk A: ACCEPT. Records exactly the receipt, nothing invented.
Run 35815674720 job "proof" (conclusion failure = VERDICT RED HELD 1), receipt sourceHead fe9f14b5, specSha256 7dcdab1f = HEAD
S9.json, Node v22.23.2, authorizedBy DECISIONS:784, inventory 15042fbc / runner 7a2f6f2b / authorization 0c60030a. I parsed the
20 GROUP rows myself: 18 PASS EXIT 0 counters equal the 18 "# pass N" needles one for one (685,15,3,3,3,3,62,28,13,4,9,14,6,35,
26,28,35,62); s9-sup-source-carriers RED EXIT 1 tests 4 pass 3 fail 1 recorded "# tests 4" (the :772 red staging-marker form
already at HEAD for release-object "# tests 14"), never "# pass"; b-lom HELD_SPLIT_REQUIRED, counters null, needle stays null.
33 children: 32 non-null, 1 null. Grammar = S8.json precedent ("# pass N", TAP line-start; runner :1951 >= 8 chars, :2824
^needle multiline). Red attribution confirmed by read: s9-supersede-source-carriers.test.cjs:180-183 (file 184 lines) admits
null or 64-hex; HEAD's {"status":"TO_COMPLETE_BY_PM"} yields undefined -> false. Note: a red child refuses CHILD-REQUIRED-EXIT-ZERO
(:2808) regardless of needle, so "# tests 4" is a marker, not a passable needle; the report says so. Nit: hunk-A header = A+B blob 73b5d18, +67 offset.

## (B) hunk B: ACCEPT. Shape and every evidence entry hold against the runner and S8.
Executed statically (chk1.cjs): keys {rulingLineSha256, gates} closed (:1613); five carriers = BYTE_IDENTITY_CARRIERS (:949);
each row {why, evidence}, why single-line >= 16; evidence keys = SUPERSESSION_EVIDENCE_KEYS; laws null (dIds []); census =
SUPERSESSION_RUNNER_CENSUS; a0-journeys / today-17 / s9-engine-files-differential pairwise distinct, none in redFirst; all 20
evidence children declared and each argv executes S9 product (:1670-1674); own redFirst per carrier (:1690). Parent artifact
acceptance-s8-real-shape.json sha 3cf58e0e = spec.parent; it retired the same five carriers over the nine gates named in the GS
draft. rulingLineSha256 null is right: no GATE-SUPERSESSION clause on the chain names M2-S9-UI-PINS (token lines at :160 :164
:175 :232 :421 :444 :462 :490 :514 :527 all name other packages; M2-S9-UI-PINS appears only at :549 :560 :567), and the runner
refuses GATE-SUPERSESSION-RULING-NOT-CITED (:1477) by design until it exists. why cites DECISIONS:527, correct on today's chain.
Side finding :526/:527 CONFIRMED: S8's rulingLineSha256 0c2d0db5 is line :527 today (S8 prose says :526); S8 theme claims
ledgerLine 524 (found :525), brief 525 (found :526). Nuance the report lacks: verifyReceipt (legacy-gates.cjs:19-26) and
claim() (:1361-1365) never compare ledgerLine to the found position, so the drift is cosmetic to the runner; measure it anyway.

## (C) token drafts: RFS and GS ACCEPT; THEME and BRIEF REJECT AS DRAFTED (D1).
All four: bytes and sha256 recomputed equal (346/664/543/327), no CR/LF/U+2013/U+2014, only non-ASCII is U+00B7, none already
on the chain. RFS: one anchored RELEASE_GRANT clause (:1015), last clause RULED, path set == the two declared "released"
product paths both ways, each pre == parent post pin (d04a10ef, 7cf97598). GS: one SUPERSESSION_GRANT clause (:1000),
RULED, carriers == superseded.gates keys, the nine gates listed == parent artifact coverage.superseded. THEME: names id, ends
" · ACCEPTED" (:2050). BRIEF: names id + path, /(?:^|[ ·])ACCEPTED$/ (:1875); brief sha abf3f670 / 122946 bytes re-measured =
worktree brief = spec.brief.sha256.
D1 BLOCKING: THEME and BRIEF are resolved through ledger() -> L.verifyReceipt with role 'cowork' (:2631-2633, :2666-2667),
which requires / · cowork · / IN THE LINE (legacy-gates.cjs:24, RECEIPT-ROLE). Both drafts carry "· Claude Opus 5.5 PM ·" and
no cowork clause (executed: false for all four). S8 precedent :525/:526 is "- 2026-09-18 · cowork · ...". Appended as drafted,
THEME refuses RECEIPT-ROLE and BRIEF likewise; their two sha256 values are therefore void. RFS/GS are located by sha + token +
RULED only and are unaffected. Fix: PM writes those two lines with a "· cowork ·" clause and re-hashes; report step 2 must say so.
Missing release block: CONFIRMED and correctly reported. Two "released" roles with no top-level release key -> RELEASE-NOT-RULED
(:1549-1552); 'release' is the one optional SPEC_KEYS entry (:1183). Brief-sha caveat: right, and stronger than stated: the brief
is NOT on the chain at all (git show origin/rebuild/t2-client-core:rebuild/lanes/b/S9-UI-PINS-BRIEF.md fails), so "differs from
the chain copy" should read "exists only on lane branches"; acceptance of the :732 fold is still owed independently.

## (D) remaining steps: complete enough, ordered, owner permissions named; three debts.
Named owner permissions present: hosted rerun of s9-sup-source-carriers after the spec moves (step 4), b-lom split packet and
run grant (step 3), --full / private census runs (step 11, not in :766/:784). D2: step 4 circularity unstated - filling
"# pass 4" after the rerun moves the spec sha again, so no receipt's specSha256 can equal the sealed spec; :771-:775 precedent
accepts that, and the seal's own --ci children() is the execution of record; say so. D3: the list does not state closure of
brief 11.1 (C-UI-0 / pack acceptance; chain :707 :723 :733 :770) and 11.3 (passphrase comment, :619) with line cites; add them.
D4 (minor): notes[0] still "NONFINAL OFF-REPO PROPOSED draft", status PROPOSED; owed at step 2 as reported. Could not do: no
runner execution (protected five in --ci scope); hosted log read only as the public 800-line tail (counters/hashes).
