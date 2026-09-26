# REVIEW-S10-VERDICT-C2-FABLE-l1 - T22 read of VERDICT-S10 at the C2 state

Reviewer: Claude Fable 5.1 (high), static only, 2026-09-26. Role: REVIEWER; nothing decided, nothing committed, no test
or package command run; helpers in %TEMP%\s10-t22-fable\ (read-only git show / rev-parse / diff / diff-tree /
merge-base with explicit paths; node sha256 over blob bytes). Protected five never read; rebuild/conform/private never
listed or opened (it appears only as a `!!` status entry). No private value, count, hash or prose appears here.

OBJECT: %TEMP%\s10-seal-prep\VERDICT-S10.c2.md, 34166 bytes, sha256
e2d5945895e5459a8ac1542a2b1bee8f35779b6ef7aff26135859f330b1c931a (equals the author's sha). Destined for
rebuild/lanes/b/VERDICT-S10.md at C2. Lane W = %TEMP%\earned-s10int, HEAD = C1 1252c4292730eecf10f886281f337e250839b71f
on rebuild/b-s10-integration; origin/rebuild/t2-client-core = R ca7f676 (no chain move after R at read time);
origin/rebuild/b-s10-integration = A dcb73ec (C1, M2, V not pushed yet, as the runbook expects before C4).
Sources read: the lane objects at C1/M2/V/A/R, the FILTERed log %TEMP%\pm7-s10-t9-t12.log (51 lines), my T16 review,
REVIEW-S10-CLAUDE-FINAL-l1, the R2/R2-CENSUS2/R3/T6F Fable reviews, and the brief of record blob at C1.

VERDICT: ACCEPT WITH NAMED DEBTS (D-V2-1 .. D-V2-3). The four evidence hashes are present, exact and re-hashed; every
fact I could take to a source matches it; every T16 Q6 item and every red of this seal is named; D-EPP-3's owed gates
are named owed and NOT paid by T14b/T20; the file is pure ASCII with LF only. The three debts are record wording the PM
can fix in the c2 bytes before C2 is committed (D-V2-2 is the one worth fixing now); none blocks C2.

## 1. The four hashes the runner requires (BP:3664 / BP:3670) - PRESENT and EXACT
Re-hashed byte-exact from `git show <rev>:<path>` at C1 1252c42 (and at A / M2 where the verdict claims identity):
- artifact rebuild/m4/spec/acceptance-s10-today-split.json: 42a3eb020557d312f4e8199eebc79101154ebe4315d2a44fd7a6e5c719450ae8,
  112116 B, identical at A, M2 and C1. Named in full in the verdict (Evidence hashes; the T12/T20 quotes; the :837 line).
- spec rebuild/lanes/b/tooling/packages/S10.json: 0f55a704968f89b984c976e3ab07d105f1b1461296c13b7ddf2382ae4fdb7308,
  107310 B, identical at A and C1. Named in full.
- runner rebuild/lanes/b/tooling/b-package.cjs: 9fbfdd2d9b09fe2aa8f8bd93090220b302414d32efba78e52a83309a61a7ec7c,
  316207 B, identical at A and C1 = S10.json tooling.runnerSha256 = the artifact's runner.sha256. Named in full.
- receipt rebuild/lanes/b/tooling/receipts/S10.json: 3c6d1f5d1fba7699b4a5fabc9939ef84ecc5fd3b715f3df9e63399ec9b07aea4,
  38229 B at C1 = the T21 log line = the T20 SEALED RUN NEXT STEP line. Named in full (Sealed-run receipt section).
BP:3659-3670 at C1 read as the verdict says: the verdict file is not byte-pinned; the step needs the three
sealedRun hashes (BP:3664) and the receipt's own sha256 (BP:3670) as substrings of rebuild/lanes/b/VERDICT-S10.md.
All four are substrings of the c2 bytes (measured with String.includes on the full 64-hex forms).
Receipt structure at C1: top keys version, lanePackage, packageId (M2-S10-TODAY-SPLIT), sealedRun; sealedRun keys
artifactSha256 / specSha256 / runnerSha256 (the three above), envelopeKey = ACCEPTED:<artifact sha>:<A>:<R>,
verdictFile = rebuild/lanes/b/VERDICT-S10.md, product = 300 keys. Receipt product keys vs the artifact's 300 product
keys: 0 missing, 0 extra, 0 value mismatches; neither released path is in either map (H12/H13 as the verdict says).
Note: the receipt file carries no `id` field; the verdict's "Receipt id M2-S10-TODAY-SPLIT@3c6d1f5d1fba7699" is the
ENGINE_REVISION form (S9 precedent), which is how the coach names it. Wording, not a defect.

## 2. Facts against sources (Q2)
Git topology (measured): A = dcb73ec (parent e81066d, adds the artifact only); V = 91cf7b6 (parent A; diff-tree adds
rebuild/m4/spec/review-s10-today-split.json only); R = ca7f676 (parent 48f40c0; changes rebuild/DECISIONS.md only;
= origin/rebuild/t2-client-core); M2 = 908e822 (parents V and R; R and A both ancestors of M2, exit 0; diff V..M2 under
rebuild and .github = rebuild/DECISIONS.md only); C1 = 1252c42 (parent M2; diff-tree adds
rebuild/lanes/b/tooling/receipts/S10.json only); R is an ancestor of C1. Every one of these matches the Authority and
Sealed-run sections.
Envelope at V/C1 (484 B, sha256 8d9132787373e9e3e9a3ee1f91be8c403867acd9b8136a6390d1029a1d6a2a0a): version 1, status
ACCEPTED, receipt {commit R, path rebuild/DECISIONS.md, line = the :837 text, lineSha256 ac7077f8...}. The line's role
clause is cowork, its prefix POSTFIX-ACCEPTANCE M2-S10-TODAY-SPLIT, it names A, the artifact path and the artifact sha,
and ends ACCEPTED (BP:2068-2070 shape). rebuild/DECISIONS.md at R has 837 non-empty lines; line 837 re-hashes to
ac7077f820a056e5711e2398f1e8762ef6159049db30c24e3a9626cad0d1785e = the envelope's lineSha256 = the verdict's.
Token lines at R (sha256 of the line bytes): :828 6f6b5410... (RELEASE-FROM-SEAL, today-app.cjs, gym-app.mjs, role
cowork (PM), last word RULED); :829 d8884ec6... (GATE-SUPERSESSION, today.cjs, writers.cjs, :631, nine, RULED);
:830 c497e941... (ends ACCEPTED); :831 1fa5309c... (ends ACCEPTED; text carried verbatim in S10.json brief.acceptedLedgerLine).
All four equal the verdict's, the spec's release.rulingLineSha256 and coverage.superseded.rulingLineSha256.
Other blobs at C1: brief e5aabac9... 81810 B; parent artifact f2447622... (100123 B); parent review 7f372d97... (474 B);
exporter at d8ffbcf de3aeb76... 13799 B; engine-revision.cjs :25 at C1 still carries M2-S9-UI-PINS@cb31838ff0db8406
(the verdict: "C1 still carries the S9 value"), and the working tree differs from C1 by exactly that one line
(git diff -U0: -25 S9 constant, +25 M2-S10-TODAY-SPLIT@3c6d1f5d1fba7699), the C3 edit as described.
Spec at C1: released pair role released, pre efaf6c0d... / 4c8ba0c9..., post null; each pre equals the S9 artifact's post
for that path (S9 roles edited / carried); 10 notes; 20 rebuild/engine keys with exactly today.cjs and writers.cjs edited;
brief block = :831. Brief of record (blob at C1): the RELEASE GRANT is in section 4.3 (lines 375-396) as cited; section
4.1 (line 265) names build.mjs as released build composition with a measured required-input list; section 7.1 lines
554-556 carry the D1/D2 sentence exactly as the verdict quotes it (line-wrapped) and line 549 the D-SPLIT-LISTEN payer;
section 13 (line 1062) has the "missing or red exact-head both-OS rebuild run" STOP; OWED-T26 at lines 193 and 1085.
FILTERed log vs the Terminals section: T9 CLEAN and the run.log removal; T10 exported line (both sha256, chain ed10468,
node v24.19.0, git 2.53.0.windows.3, EXIT=0); T11 installed both files; T12 three lines, EXIT=0, 36 observed; T13 A
committed and pushed; T14 first run REVIEW-PENDING / ENVELOPE ABSENT / PRIVATE ORACLE PRESENT / FAIL line, EXIT=1,
36 observed, 7 LEGACY lines, engines folder present True, STOP; T14b the same first three, FULL EVIDENCE 10/0/9,
REVIEW-PENDING 1 open obligation, EXIT=2, 36 observed, 10 LEGACY lines; T17 R pushed, freeze starts; T18 V; T19 M2 with
V..M2 = DECISIONS.md only; T20 at 01:57:34: AUTHORIZED, SEAL BASE ON THE TIP (ca7f676 ancestor, rule=ancestor),
ENVELOPE AUTHORIZED (artifact, A, R, spec prefix), SEALED-RUN-RECEIPT-ABSENT, PRIVATE ORACLE PRESENT, FULL EVIDENCE
10/0/9 second gate included, SEALED RUN RECORDED over 300 pinned product file(s), SEALED RUN NEXT STEP naming
3c6d1f5d..., POSTFIX PACKAGE PASS, EXIT=0, 36 observed, 10 LEGACY PASS; T21 C1 and the receipt sha; T23 ENGINE_REVISION
moved (uncommitted), coach tap EXIT=1 at 01:58:10, prod tap EXIT=0; T23b coach re-run with the rebuild.yml glob
tests 377 pass 377 fail 0 EXIT=0, production pair 28/28 EXIT=0. Every quoted fragment in terminals 2-5, the Export
custody section, the coach section and the T23 record matches the log to the character up to the FILTER cut.
Ledger lines at R, checked for the facts the verdict attributes to them (token presence only, nothing quoted):
:832 has the STOP, 36199898809, ccc2f63, both-OS, section 13, GSS-G6, the :827 correction, diag/s10-today17-hosted;
:833 has 36206163821, e9ff2ca, settle, the 123 ms / 8 ms figures, painted, red-first, mutant; :834 has D-GSSFIX, GSS-LATE-
CLEAR, GSS-G5-DIAGNOSTIC, job 134, D-R2F-2, D-R2F-3, row 150, class M, the census addendum, 28, 064ff80e, node_modules;
:835 has 36214720524, 9849bc7, 725, 726, CHILD-NEEDLE-NOT-A-TERMINAL-LINE, CHILD-REQUIRED-EXIT-ZERO, ci0, every red,
recorded / excused, hunt, load-sensitive, # tests, D-T6-STATIC, D-SEAL, job 138, D-R3F-1; :836 has 36217102675,
36219778403, T14b, EXIT=2, full1, first, FAIL, red, PATH, conform/run.cjs, bare node, D-PATH-NODE, CI-1, CI-M1c, T6e,
33 PASS, T8, not repeated, one-slot, freeze; :816 has (g), PM seat, pass/fail, private census, D-EPP-3, Yes at each seal,
single-OS, re-run, empty commit; :798 BLOM-OPTIONS 2(b); :799 S10 b-lom narrowing; :809 / :810 the S9 receipt and seal;
:631 O-1a PROPOSED today.cjs writers.cjs; :785 engine-capture D-EPP-2 :69; :780 Q3 D-EPP-3; :136 (3) byte-identity;
:153 gate supersession; :628 D-GSS-TIMER residue; :662 D-SPLIT-LISTEN TODAY-OUTCOME-TYPE verbatim; :633 D1 D2 S-R33.
Commits the verdict cites all resolve in W with the stated roles and are ancestors of C1: 5b230c5 (census addendum 2),
2c4d24e (census addendum 1, "pays D-CENSUS-STAGED-COUNT"), 4dc2029 (final spec, BRIEF-ACCEPTED), 9479958 (copy lock CI
registration), 12be4ea (D-EPP-4 paid, EPP-R9), f97924a and 92be4e3 (S10-REGEN writes), 194f03f (:828-:831 token lines),
ccc2f63 (merge of 194f03f into the lane = the first T7 merge), e9ff2ca (GSS settle fix), dc08f36 (T4 fix), f4125cd
(census), d8ffbcf (exporter), ead01aa (spec r3), 0d38b8e / 5a953d5 (EPP inputs), b35a48e3 / 66d32530 (Track A/B inputs),
d7f6540 (S9 seal tip), 9c95afa (S9 artifact), 48f40c0 (:836), ed10468 (:835).
Reviews cited: REVIEW-S10-CLAUDE-FINAL-l1 line 44 (build.mjs adds exactly three REQUIRED_INPUTS), line 97 (runner
IDS / NO_REGISTER_IDS / CHILD_ROOTS only), lines 136-150 (D-CF-1..3 and the carried list incl. D-S10R11-2 for D5 and the
six scope rows); REVIEW-S10-SPEC-R3-FABLE-l1 line 39 (the r4 needle check reads the e9ff2ca table: D-R2F-1 paid) and
D-R3F-1/-2 as the verdict states them; REVIEW-S10-SPEC-R2-CENSUS2-FABLE-l1 D-R2F-1..3 and the 277/518/496/M 173 R 143
N 202/0 figures; REVIEW-S10-T6F-FABLE-l1 D-T6F-1/-2 (the limit-5 wording carried to T22, as the verdict does).
CI run ids and conclusions: 36219778403 at A and 36217102675 at M1 were measured by me at T16 (all four jobs success);
36199898809 at ccc2f63 and 36214720524 at 9849bc7 are the ledger's (:832, :835), 36158401022 at f97924a is spec
notes[8] / brief line 193. I did not re-query GitHub here.
NO MISMATCH found between any verdict statement and its source.

## 3. Q6 items, reds and D-EPP-3 (Q3)
Every item my T16 section 6 asked VERDICT-S10 to name is named: D-S9SEAL-1 (count of record 300 from the T20 line),
D-S9SEAL-2 with the V8 prose carries itemized (rebuild.yml comment / S8-PREP-AUTHOR-REPORT, S8.json citations one low,
lane D (a)-(e)), D-S9SEAL-3 (today-17 flake class + the D-GSS load-sensitive class, the unfinished hunt, the :816
single-OS rule), D-S9SEAL-4 (freeze L5..SEALED AND MERGED; FREEZE ruling on a chain move), D-BLOM (:798/:799, re-measure
after 2026-10-05), the S9 released pair undeclared (notes[1]), D-EPP-3 owed gates, D-EPP-4 RED half D-S10I-8 with the
GREEN half hosted, the two :631 clauses + D-EPP-2 under :829 and the released pair under :828 with why T24 skips them,
D-GSS-TIMER, D-SPLIT-LISTEN (payer TODAY-OUTCOME-TYPE), D1/D2 (owned by the two packages; C2-OPEN-1 names the missing
per-debt split), D-GSS-PASSTHROUGH, D-GSS-LINES, D-GSSFIX-1/-2, GSS-LATE-CLEAR, GSS-G5-DIAGNOSTIC, D-NODE-MODULES-HOME,
D-R2F-1 (paid), D-R2F-2 (paid :834), D-R2F-3 (ruled :834), D-R3F-1 (restored), D-R3F-2 (paid by 36217102675),
D-T6-STATIC, D-T6-READS, D-SEAL, D-CF-1..3, D-T6F-1, D-S10I-3, D-CENSUS-STAGED-COUNT (paid), the runner move
5321181a -> 9fbfdd2d with the ancestor re-pins and S9.json superseded-by-child, D-PATH-NODE, D-SP-*, D-S10R11-1..5,
D-COPYLOCK-*, and D-T16-1..5 each carried with its disposition.
Every red of this seal is recorded, in order and with cause: CI-M1 (a) 36199898809 at ccc2f63 both OS at today-17;
CI-M1 (b) 36214720524 at 9849bc7 ubuntu needle at child 20; T8 ci0 at 9849bc7 today-17 725 of 726 (RECORDED, NOT
EXCUSED, :835; not repeated at M1, :836); the first T14 full1 at A EXIT=1 with the PATH cause, 7 LEGACY lines and the
unchanged tree (D-T16-2 satisfied for this file; the L6 line is still owed); plus the T23 coach red (bare directory form,
node 24) that my T16 did not know about. Then the greens in order. CI-2 and T24 are left as placeholders (Q5).
D-EPP-3: the section names all four owed gates, says none is claimed, says (1)-(3) are recorded as run by no line the
verdict stands on, and states that the LEGACY conformance and selftest lines of T14b and T20 run rebuild/conform/run.cjs
against the pinned public reference bundles (frozen against frozen), not the repaired rebuild/engine bytes (D-T16-3).
That is exactly what my T16 section 4 measured (v4/postfix/run.cjs:119 from BP:3862; run.cjs:20, :39-40). SATISFIED.

## 4. Privacy, ASCII, LF (Q4)
Byte scan of the c2 file: 34166 bytes, 0 bytes outside 0x09/0x0A/0x20-0x7E, 0 CR, 360 LF-terminated lines, ends with
LF. Every hash and count in the file is a public one (Git blob sha256, ledger line sha256, run ids, public test counts,
the public census figures, the runner's own 300). The :837 line and the runner's PRIVATE ORACLE line are paraphrased or
cut before any middle dot. No path under rebuild/conform/private, no census value, no measurement, no private hash.
The private junction is mentioned only as "in place" / "removed after T24" (Test-Path only). CLEAN.

## 5. Placeholders (Q5)
Distinct placeholders in the file: <C3>, <C2>, <T24-RESULT>, <CI-2-RUN-ID>, <C4> (9 occurrences). Four are the allowed
T24 / C3 / C4 / CI-2 items. <C2> (Terminals 6: "C2 `<C2>` carries this verdict") is outside the allowed set: a file
cannot carry its own commit hash, so it is fillable only at the C4 edit. Named as D-V2-1. The runner does not read
placeholders (BP:3659-3670), so none of them touches the byte-identity step.

## Named debts (D-V2-n)
- D-V2-1 (record, low): the `<C2>` placeholder is not one of the T24 / C3 / C4 / CI-2 items. Pay at the C4 edit (fill it
  with the C2 hash next to <T24-RESULT> and <CI-2-RUN-ID>), or reword now to "C2, the commit that adds this file".
- D-V2-2 (record, fix before C2 if the PM agrees): OPEN ITEM C2-OPEN-2 says the verdict "does not state whether the
  integration paid any of" D3, D5, D6, D7, D9, D4 and the six inherited 6.2 scope rows. For D5 and the six scope rows the
  disposition is already ruled and the brief of record requires this file to report it: brief 2.1 row at line 194 and
  section 13 lines 1082-1084 (D5 and the six rows CARRIED as D-S10R11-2, PM RULED :818, "reported as carried in the S10
  verdict"), and REVIEW-S10-CLAUDE-FINAL-l1 lines 148-149 carry them the same way. The verdict does carry D-S10R11-2 by
  id (Records, "D-S10R11-1 to D-S10R11-5") but C2-OPEN-2 contradicts that one paragraph later. Pay: one sentence in
  C2-OPEN-2 stating D5 and the six 6.2 rows CARRIED under D-S10R11-2 (:818), leaving D3, D4, D6, D7 and D9 as the items
  the PM names paid or carried before C4. Not blocking: no false claim of payment is made anywhere in the file.
- D-V2-3 (wording, low): the Terminals preface says every quoted line is from the PM's FILTERed run log, but terminal 1
  (T8 ci0, "FAIL CHILD-REQUIRED-EXIT-ZERO") is not in %TEMP%\pm7-s10-t9-t12.log, which starts at T9; its source is :835
  (which carries CHILD-REQUIRED-EXIT-ZERO, 725, 726, 9849bc7) and the PM's earlier T8 log. One clause ("terminal 1 from
  DECISIONS:835 and the T8 log") makes the attribution exact. Also "on the C3 bytes" in the coach section names a commit
  that does not exist yet; the measured fact is that the coach ran on the working tree that differs from C1 by the one
  ENGINE_REVISION line C3 will commit (git diff -U0, one hunk at :25).

## AAR (6 lines)
1. Verified: artifact 42a3eb02 / spec 0f55a704 / runner 9fbfdd2d / receipt 3c6d1f5d re-hashed from git objects at C1 (and A, M2 where claimed) and all four are substrings of the c2 file (BP:3664/:3670 satisfied); receipt sealedRun structure, envelopeKey, verdictFile and 300-key product map match the artifact; topology A-V-R-M2-C1 and the single-file diffs measured; :828-:831 and :837 line sha256 re-hashed; every FILTERed-log quote matches to the character.
2. Found: the file is pure ASCII / LF (0 non-ASCII, 0 CR); every T16 Q6 item, every red (plus the T23 coach red) and D-EPP-3's four owed gates are named, with T14b/T20's LEGACY lines explicitly NOT paying them.
3. Found: C2-OPEN-2 leaves D5 and the six 6.2 scope rows open although brief 2.1/section 13 and the Claude final already carry them as D-S10R11-2 (:818) and the brief requires this file to say so (D-V2-2); one sentence fixes it before C2.
4. Found: `<C2>` is a fifth placeholder outside the T24/C3/C4/CI-2 set (D-V2-1); the Terminals preface over-claims the FILTERed log as the source of terminal 1 (D-V2-3).
5. Rule check: no protected five, src/, private, ledger dir, soak, EarnedPort, port-real, s10-*.log/.tap or old-app path read; every git read carried explicit paths; only %TEMP%\s10-t22-fable\ helpers and this file were written; nothing committed.
6. Verdict ACCEPT WITH NAMED DEBTS D-V2-1..3; C2 may be committed (with the D-V2-2 sentence if the PM takes it).
