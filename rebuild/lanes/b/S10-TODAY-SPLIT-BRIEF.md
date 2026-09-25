# S10 brief of record: M2-S10-TODAY-SPLIT

Package: `M2-S10-TODAY-SPLIT` (lane package S10; PM RULED, DECISIONS:816).
Brief path: `rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md`. Its sha256 and byte
count are measured by the PM on the committed bytes and carried only by the
BRIEF ACCEPTED BY SHA line (Appendix A, L4); a file cannot state its own hash,
so no sha256 of this file appears in it.

Status: FINAL DRAFT OF THE BRIEF OF RECORD (runbook T3b), revision 3:
revision 1 (sha256 f69d7f41..., 63199 bytes) took Fable
`rebuild/lanes/fable/reviews/REVIEW-S10-BRIEF-l1.md` ACCEPT WITH NAMED DEBTS
(DECISIONS:818); revision 2 (sha256 e750fe52..., 71817 bytes) paid
D-S10BR-1..4 and filled the three runbook T3a marks from round 11;
revision 3 (runbook T3c) fills the copy-lock marks from DECISIONS:819 and
changes nothing else (Appendix B). It is read by Fable
and Astra in parallel (DECISIONS:814) and committed in the lane by the PM. It
becomes the brief of record only when the L4 line on
`rebuild/t2-client-core` cites its exact sha256, and that sha is measured only
after every PENDING mark below is filled (section 13).

What this brief authorizes, from its L4 line on: the S10 build and seal of
M2-S10-TODAY-SPLIT on the sealed S9 parent, in the order of section 12 and of
`%TEMP%\S10-SEAL-RUNBOOK.md` (sha256 a39a0253..., Fable fixes 1-6 adopted at
DECISIONS:816): the Track A and Track B integration; the EPP engine-tier input
with D-EPP-2 (section 7.2); the release of exactly the two view files of
section 4.3; S10's own gate supersession; the S10 declarations and execution
pins; the proposed artifact; the PM-seat protected runs under grant (g)
(DECISIONS:816 (1), pass/fail lines only); the receipt, verdict and coach
constant; and the fast-forward with the slice preview deploy of DECISIONS:816
(2).

What it still does NOT authorize (the working-paper limits that stay): any
byte or merge on main or the live app; any import or phone action on real
data; any owner option or copy choice (copy is the accepted lock's, section 8,
and the owner's only per runbook J3); any engine byte beyond the two :631
clauses and D-EPP-2; CUI1 promotion; or any seal step while a section 13 STOP
or an open mark of section 2.1 stands.

Provenance. This file is written from the working paper
`rebuild/lanes/b/S10-WORKING-BRIEF.md` at c58b892 (sha256
7663f11828516adc1ad3a83489545f869b32ab398791cb31ac1a63a849f7515f, 42813 bytes,
731 lines), which stays WORKING PAPER ONLY and is not a token input. Its
revision history stays binding as provenance: revision 2 adopted at
DECISIONS:699 (ffc10ea, independent review ae96e30); the CUI sequencing fold
caa0abf (:740) binding :732 and disposition a12be09; the GSS input 66d32530
(:765, receipt 1b41692, review 31c88922); the TODAY-SPLIT base b35a48e3 with
D-SPLIT-PARENT and the :633 debts (:633, :662, Claude 324b994a, Astra L3
175f6323 and L4 84302990); the S-R30 exceptions and deferral guard (:626); the
EPP carriage and D-EPP-1/3/4 (:631, :644, f0a5eb1a); Fable reviews
REVIEW-S10-WORKING-BRIEF-l1.md (606eb3cf...) and -l2.md (a29f0279...); PM
rulings :780. Sections 1, 3.2, 4.1, 4.2, 5, 6, 7.1, 9, 10 and 14 carry the
working paper's text unchanged; every other change is marked FINAL and listed
in Appendix B.

Line numbers `:N` cite `rebuild/DECISIONS.md` on
`refs/remotes/origin/rebuild/t2-client-core` at the chain tip measured at
this fill, 9d4816d2a7025b8aa968ce38c2263fbf991490b4 (818 lines; :818 C-UI-0
ACCEPTED, lineSha256
7ce22ddd76b1b543ff2853fd7cad531194222d66cd01d6b83180af7daf12f155). Revision 1
read 94977a9 (816 lines); 94977a9..9d4816d adds only :817 and :818 (`git
diff --stat` over rebuild and .github, soak.yml excluded by name: only
rebuild/DECISIONS.md, +2). Revision 3 (runbook T3c) reads the tip
6925ad47994a35cd2d8c1e70cc0241bfa825147b (819 lines; :819 the copy-lock
acceptance); 9d4816d..6925ad4 adds only :819 (the same `git diff --stat`,
soak excluded by name: only rebuild/DECISIONS.md, +1), so every citation
at or below :818 stands. The working paper's citations were read at d9464f2
(780 lines); the ledger is append-only, so they stand unchanged.

Binding sequencing fold: DECISIONS:732 and independently reviewed disposition
a12be09 (paper-of-record caa0abf, :740), folded as recorded in section 11.2.
Accepted CUI0/S9 pins precede S10; accepted CUI1 does not. Every existing GSS,
source-closure and section 8 copy-lock STOP remains. The fold authorizes no
build, token, pin promotion or automatic queue dispatch by itself.

## 1. Purpose and non-goals

S10 is the integration and reseal that places the accepted writers-out Today
split and the later accepted gym-settings writer change on one actual S9
parent. It releases the named view files, keeps durable writer decisions in
sealed siblings, installs a real copy lock, updates declarations and execution
pins, and proves the resulting exact bytes on both required platforms.

This is not a second split design round. It does not implement EW2 product
work, TODAY-MODEL-HANDOFF, TODAY-OUTCOME-TYPE, GYM-START-IN-PAINT, an earn-on-
phone option, or a design transfer. It does not use the pure-cut proof to bless
later authored writer logic. EW2 suite work B0-B4 and B1a may precede S10, but
EW2 product bytes remain after S10.

GYM-SETTINGS-WRITER-SEAL stays BEFORE S10 (:626 S-R30 (1)); its accepted input
is now named in section 6.2 (:765).

After S10, reseal children are ordered (:626 S-R30 (2)):

1. TODAY-MODEL-HANDOFF.
2. TODAY-OUTCOME-TYPE, including D-SPLIT-LISTEN (:662) and D-GSS-LISTEN
   (:707 "LISTEN stays TODAY-OUTCOME-TYPE"; 50e2886: gym-app's hooks.listen
   drops a fourth argument silently, "PAYS: the same ticket, one refusal for
   both shims").
3. GYM-START-IN-PAINT.

Also after S10, and not ordered against those three by any ruling found: the
named, independently reviewed reseal child that promotes completed CUI1
references and pins (:732; a12be09 A6). See section 14.

Each child owns its own brief, proof, review, pins, reseal, and CI. None is
silently folded into S10.

## 2. Required inputs and hard stops

The integrator writes an input table before touching product bytes. Each row
has exact 40-character commit, tree or blob identities, acceptance citation,
review file, and role.

| Input | Required state | STOP |
|---|---|---|
| S9 parent | Accepted integrated S9 commit, runner, release machinery, declarations, workflow and all final S9 pins, including retained runtime references and the whole approved pack (:732 A1/A2) | No S10 branch or package until this exact parent exists. |
| TODAY-SPLIT | Accepted build base `b35a48e35a1f3e3c278c377934794a32b632535b` (:662) or an explicitly reviewed successor | Any product change after that head requires its own disposition. |
| GSS | Accepted input `66d325308bc584950163c1c177799ce4953fa298` on rebuild/c-gss-g6-g8-proof; chain 04ea69e (:701, Claude l1 50e2886 ACCEPT WITH DEBTS :707) -> 79d981a7 (:754, :759) -> 66d32530 (:765). Supersedes the ffc10ea row "Candidate 04ea in independent L3 review" | Accepted as product input only, not package; hosted evidence is owed at the composed S10 candidate (section 10.2; :627, :565); integration and S10 reseal owed (:765). |
| Copy lock | Accepted design/copy declaration including screens not yet ported (:732 A4) | No released on-screen copy may enter the seal without it. |
| C-UI | Accepted CUI0 including its independent audit, actual S9 reference/whole-pack pins and both-platform evidence (:732 A4; caa0abf) | Accepted CUI1 is not an S10 prerequisite (:732). Both-platform execution alone remains insufficient without required independent acceptance. |
| EPP | Whether the accepted S9 parent carries the engine repair (:631 O-1a) | Section 7.2 decides what S10 owes; unknown until S9 seals. |
| S10 declarations | Final S9 inventory schema, S10 package id, product and execution maps, child rules | Do not copy S8/S9 counts or field shapes by memory. |

State at this brief of record (FINAL, 2026-09-25; replaces the working paper's
2026-09-23 readiness paragraph, whose facts are superseded as follows):

- S9 parent: M2-S9-UI-PINS is SEALED AND MERGED (:810). Every S9 row of 2.1
  is filled below from the sealed bytes.
- TODAY-SPLIT b35a48e3 and GSS 66d32530 are merged into the lane (integration
  report round 1: 92b7487, 9943679, 0 conflicts), the lane is rebound onto the
  sealed S9 (:812; 59d7fd9) and S10.json is REGEN-written at parent d7f6540
  (:815). Lane `rebuild/b-s10-integration` head
  f97924af8be21fb68ff792d65c08fced58437032 at revision 1; builder round 11
  (runbook T3a) is committed on it as
  88cded3f82dd96af767bfe1dc24575324c51b1ac (parent f97924a; DECISIONS:818),
  the lane head at this fill. The GSS lane step-13 red remains no evidence
  either way (10.2).
- Round 11 (88cded3; Fable R11 l1 and l5 ACCEPT WITH NAMED DEBTS
  D-S10R11-1..5 and D-S10L5-1..6; Astra L7 ACCEPT WITH NAMED DEBTS at
  f97924a; :818): it moves two product bytes
  (`rebuild/m3/w7-preview/today/test/problem.test.mjs` edited,
  `rebuild/lanes/c/today-split-spike/cut.cjs` new) and S10.json notes[8], so
  S10-REGEN --write runs again and the new S10.json is reviewed before any
  needle (12.1 fix 6). Its debts, as named by Fable R11 l1: D-S10R11-1
  (PART2-DOM-LISTENERS.mjs cannot run on Windows as committed, ESM path
  form); D-S10R11-2 (no eslint-scope route on any existing path: D5 and the
  six inherited scope rows); D-S10R11-3 (instruments row 27 red at the
  integrated bytes, it compares against the post-GSS gym-app.mjs);
  D-S10R11-4 (the D6/D7/D9 red-first inputs live in scratch harnesses, not
  in a committed cell); D-S10R11-5 (the cut's instrument cells run in no
  child argv and no workflow step, so they are not "CI-only"). Its F1 (the
  M/R/N census of 3.2 re-stated at the final bytes before T4) stays owed.
- EPP: rides S10, decided by measurement (2.1, 7.2).
- CUI0 acceptance citation: FILLED, DECISIONS:818 (C-UI-0 ACCEPTED, written
  before any S10 POSTFIX line as :817 requires; 2.1).
- Copy lock: FILLED, DECISIONS:819 (copy lock round 2, Fable l2 ACCEPT
  WITH NAMED DEBTS; corpus e3b1be10..., 958 pieces; no athlete-visible
  string changed; 2.1, section 8).
- S10 declarations: `rebuild/lanes/b/tooling/packages/S10.json` at f97924a,
  sha256 66df4c06d8574545cdcfadbb61290e3366df8a2c91b716eb8ba7ec78a2bc343f,
  status PROPOSED; packageId, brief, theme, release and supersession hashes,
  artifact paths, review prefix and all 35 child needles (36 with s10-copy-lock, section 8 answer 8) are null until
  runbook T4-T6; 297 declared paths (232 carried, 20 edited, 42 new, 2
  released, 1 superseded-by-child; its notes[1]); runner
  `rebuild/lanes/b/tooling/b-package.cjs` sha256
  9fbfdd2d9b09fe2aa8f8bd93090220b302414d32efba78e52a83309a61a7ec7c. These
  S10.json values are at f97924a; at 88cded3 the file differs only in
  notes[8] (`git diff --stat`, 1 line), and the REGEN --write owed by round
  11 re-pins the two moved files, so they are re-read at the new S10.json.
- The build STOPs of the integration report ("STOPs remaining" 2-10, runbook
  T3a) stay open until paid; section 13 keeps them.

### 2.1 STOP placeholders, FILLED from the sealed S9 (FINAL)

Each row is filled from the sealed artifact, receipt or ledger, never from a
proposed branch. Bytes were read byte-exact at `S9_PARENT_COMMIT` with
`git show REV:path` (cmd redirect) and hashed with sha256 on 2026-09-25. A row
marked PENDING or OWED is still a STOP.

| Placeholder | FILLED value | Source |
|---|---|---|
| `S9_PARENT_COMMIT` (40 hex) | `d7f654017962d35661adea8cf3688251ad686b9e`, the seal fast-forward tip (tree = C4 e7cd02f; d7f6540 is the empty CI re-run commit) | DECISIONS:810; equals S10.json `sourceBase` |
| S9 final spec path and sha256 | `rebuild/lanes/b/tooling/packages/S9.json` sha256 `bb169a67847d10963fcaa0d69c14d5e157ad0a81525e22352ef116d6071ac86c` (91741 bytes, status BRIEF-ACCEPTED); brief `rebuild/lanes/b/S9-UI-PINS-BRIEF.md` sha256 `abf3f670835803b94ac768bf0c0b0a0de5d2570302abd7651179e9005efb3f58` (122946 bytes); runner sha256 `5321181a14bd5716c1d8692d40d5086cd10179609dcccced6d7a6da04704fd22`; THEME :788 | S9 artifact `spec` and `runner` fields; receipt `sealedRun.specSha256`, `runnerSha256`; brief by sha DECISIONS:789 |
| S9 product map and execution map, counts and field shapes | Artifact `product`: 254 keys, entry `{pre, post, role}`, roles carried 201, edited 21, new 22, pinned-unchanged 9, superseded-by-child 1. `released`: 2 keys (build.mjs, preview.css), entry `{role, lastSealedSha256, sealedBy, rulingLineSha256}`, sealedBy M2-S8-REAL-SHAPE. `executionPins`: 84 keys, entry `path: sha256`. `children` 32, `gates` 19. Spec S9.json `product` 256 keys (254 plus the 2 released) | `rebuild/m4/spec/acceptance-s9-ui-pins.json` at d7f6540; DECISIONS:810 (254 pinned product files, 32 children) |
| S9 receipt/artifact sha and verdict | Artifact `rebuild/m4/spec/acceptance-s9-ui-pins.json` sha256 `f24476220ec9fe187aded6d708c2371a3f604c3f2a41bb94a9594e351d8b8b1c` (100123 bytes). Review `rebuild/m4/spec/review-s9-ui-pins.json` sha256 `7f372d97170cbc4f58025a84ba4c705488aae6a7ff11c61e0e97b1b2b4eddcb4` (474 bytes; ACCEPTED; receipt commit 60be3c6fb53975f60d4f54922d12ea9f17fbfb33; lineSha256 66ff27e7040282eede53023dfe0e1015b2664f28fbf7adfcb84dc662591dad6b). POSTFIX-ACCEPTANCE receipt line DECISIONS:809 (reviewed commit 9c95afa5b840fedbe914652b2f0bd83d1b0800c2). Sealed-run receipt `rebuild/lanes/b/tooling/receipts/S9.json` sha256 `cb31838ff0db840609adfb63476c824f28d0690913f4143f2c47ee5c05154d2e` (32291 bytes, C1 c3b04be). Verdict `rebuild/lanes/b/VERDICT-S9.md` (sha256 3110f2d7cfe81cdc1133031851b7bd6332e406de6c520ccafebf1f6f412f2e0e, 14461 bytes): PASSED on the DECISIONS:809 receipt. Coach ENGINE_REVISION `M2-S9-UI-PINS@cb31838ff0db8406` | DECISIONS:809, :810; bytes at d7f6540; S10.json `parent.options[0]` agrees |
| S9 exact-head CI run ids, both OS | Binding CI-2: run 36137808746 at d7f6540, rebuild-public and C font transport success on ubuntu and windows. CI-1: run 36048172480 at 9c95afa, success. Not binding: 36091012714 at e7cd02f (windows today-17 red only, D-S9SEAL-3). Chain run at d7f6540: 36140937585 green both OS; slice-host 36140937561 deployed | DECISIONS:810, :813 |
| `S10_PACKAGE_ID`, S10 brief path and sha256 | `M2-S10-TODAY-SPLIT`; slug `s10-today-split`; artifact `rebuild/m4/spec/acceptance-s10-today-split.json`; review `rebuild/m4/spec/review-s10-today-split.json`; review prefix `POSTFIX-ACCEPTANCE M2-S10-TODAY-SPLIT`. Brief `rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md` (a NEW file, not the working paper renamed). Its sha256 and bytes: measured by the PM on the committed bytes, carried by L4 only | DECISIONS:816 (PM RULED); slug rule b-package.cjs:2071-2076 (runbook T6) |
| RELEASE-FROM-SEAL, GATE-SUPERSESSION, THEME, BRIEF-BY-SHA lines and hashes | Texts FINAL in Appendix A (L1-L4). Line numbers and lineSha256 exist only after the PM appends them (runbook T5) and are carried by S10.json (runbook T6), not by this brief | section 11; runbook T5 |
| CUI0 acceptance citation and pins | PINS: carried at the parent; the S9 artifact pins the whole approved 09-18 pack with the measured 09-08 runtime references and no CUI1 promotion. ACCEPTANCE CITATION: DECISIONS:818 "C-UI-0 ACCEPTED" (lineSha256 7ce22ddd76b1b543ff2853fd7cad531194222d66cd01d6b83180af7daf12f155, measured on the bytes of 9d4816d), written before any S10 POSTFIX line as :817 requires ("before the S10 POSTFIX line or after the S10 fast-forward, never inside a freeze"): CUI0 l1 0ca3c8f ACCEPT WITH D-CUI-UNIT (:707), l2 unit c1e18841 ACCEPT with D-CUI-UNIT paid, l3 font transport 30bf3de ACCEPT, closed at :740 (lineSha256 faa8b10c..., re-measured; receipt ffbd3f2), composed into the sealed S9 (:809, :810; C font transport green both OS in CI-2 36137808746). No S10 POSTFIX line exists on the chain at 9d4816d, so no freeze was open | DECISIONS:818, :817, :740, :707, :788, :810, :732 A1/A2 |
| Copy-lock paths, eight answers and CI step | ACCEPTED: DECISIONS:819 (lineSha256 ab0b8edf2377463c55b1ed6e8f61ff0c8be32ae86bd1cde838f947b642c3a611, measured on the bytes of 6925ad4), copy lock round 2: Fable `rebuild/lanes/fable/reviews/REVIEW-S10-COPYLOCK-l2.md` (sha256 b9b3ee4f...) ACCEPT WITH NAMED DEBTS after l1 REJECT (sha256 cc901a2c...; F1-F4 fixed and measured); answer 5 RULED at :818. Paths with sha256 and blob ids, the eight answers, ownership, enforcement and the six named debts (D-COPYLOCK-XFORM, -ATTRS, -EXT, -LINUX, -TODAY-MOUNT, -REDFIRST-SCOPE) in section 8. Corpus `copy-lock.corpus.json` sha256 e3b1be1078c65877fcc990ce91223f0f758bf51c9dd3b4acc08653b261cd826c, 958 pieces, pinned in `copy-lock.test.mjs`. CI step: specified by COPY-LOCK.md answer 8 and not yet in `.github/workflows/rebuild.yml`; the S10 build lands it last, after REGEN --write declares the five lock files (section 9); its presence is checked at the seal, not claimed here | DECISIONS:819, :818; lock bytes integrated into the lane worktree at 88cded3 by runbook T3c (untracked until the PM commits); cell re-run there green 6/6 (section 8) |
| Whether EPP rides S9 | NO: EPP rides S10. Measured at d7f6540: the S9 artifact has no `rebuild/engine/test/proposed-pick.test.cjs` in `product` or `executionPins`, and pins `rebuild/engine/today.cjs` (685f6e1e...) and `writers.cjs` (0522797d...) carried unchanged. S10.json declares proposed-pick new (post 3a1f00a1...), today.cjs edited to b4ebee3c..., writers.cjs edited to 67033f9f... | S10.json notes[3] (EPP 0d38b8e2633ee46b033f8386670bf6e25ef10862 with D-EPP-2 5a953d59a1fce5f27ff368b4997350a655f94f69); DECISIONS:791, :780 Q3; section 7.2 |
| Observed blob ids of section 3.1 at the parent | today-app.cjs `ea98aef614f29dfbf3ade5206fc877120bda3c9d`, today-model.cjs `6a146ff95a145f2f7835b35e9b86be8fcc840e5d`, gym-app.mjs `48bf0531fdbcccffe981bd3c4d2f44a91f7abd6d`: EQUAL 3/3 to `sourceBlobs.s9` | `git ls-tree d7f6540 --` the three paths (2026-09-25); PM REGEN --write at that parent, D-SPLIT-PARENT EQUAL x3 (runbook T0) |
| Exact-head both-OS rebuild run id and conclusion at the composed S10 candidate | OWED-T26: CI-2 at the exact head C4 (runbook T26); recorded in VERDICT-S10.md and the SEALED AND MERGED line, never here. Advisory only: CI-0 run 36158401022 at f97924a, measured per step: rebuild-public step 13 (the cumulative standing step) failure on ubuntu-latest and windows-latest, as runbook T1 predicted while packageId is null; steps 16, 23, 24, 25, 26, 33, 34, 35, 37 and 38 success on both OS; the rest skipped; C font transport success on both OS. It proves nothing about the lane's cells behind step 13 (12.1, fix 4), and a step conclusion is not a row count | CI-0 per-step log %TEMP%\s10brief-ci0.log (step 13 both OS, font transport); integration report Round 11 row "CI-0 36158401022" at 88cded3; Fable R11 l1 section 1 (steps 13, 23, 25 re-measured); REVIEW-S10-BRIEF-l1 section 1; runbook T1, T26; :563, :565, :627 |
| Route that provides the real eslint-scope stack for D5 | FILLED from round 11 (runbook T3a, Q11): NONE. Measured by the builder at 88cded3's base: eslint-scope is absent from every existing route (the lane node_modules junction, the rebuild/m3/w5 and w6 junctions, %TEMP%\p2-tools, C:\Users\joeym\.cache, AppData\Roaming\npm, Astra's parser scratch, Node's own internals); acorn 8.17.0 and acorn-walk exist only inside node.exe v24.19.0 (internal/deps), which is a parser, not scope analysis; no farm folder exists on the PC (the :550 farm path is a Linux path). D5 (rows 12/13/14/16/32/33) and the six inherited scope rows of 6.2 are therefore CARRIED as the named debt D-S10R11-2 (PM RULED, :818: "no eslint-scope route on the PC; no install"), never paid by a substitute (6.1). It stays a named STOP on any claim that D5 or those rows are paid, and is reported as carried in the S10 verdict; only an existing route measured later or an owner-approved route (J3) pays it | DECISIONS:818; commit 88cded3 (integration report Round 11 "PARSER ROUTE" and "D5 and the six inherited scope rows"; Fable REVIEW-S10-R11-l1 sections 4 and 5); section 6.1; integration report STOP 8 |

## 3. Parent and source custody

### 3.1 D-SPLIT-PARENT

At the actual S10 parent, re-measure all three source blobs named by
`regions.json.sourceBlobs.s9`: `today-app.cjs`, `today-model.cjs`, and
`gym-app.mjs`. Compare actual blob ids to the table before a cut or generator
opens source.

If any differs, STOP. The required order is a new named ref, visible
re-witness, re-cut, byte equality, and actual DOM/listener cells again. The new
table and output receive independent review. An old cut proof is never reused
for changed input bytes.

A refusal on seal day is the instrument working, not a defect (Claude
324b994a D-SPLIT-PARENT: "Say it in the brief so a refusal on seal day reads
as the instrument working"). The claim that the S10 parent holds the pinned
source "stays true only while S9 part 2 and the chain leave those three files
alone" (324b994a, WHAT ELSE I MEASURED 3).

Expected ids, from `regions.json.sourceBlobs.s9` at b35a48e3 (read 2026-09-23;
equal to 324b994a's measurement):

| File | Expected blob (sourceBlobs.s9) | OBSERVED at S9 integration fe9f14b, non-final |
|---|---|---|
| `rebuild/m3/w7-preview/today/today-app.cjs` | `ea98aef614f29dfbf3ade5206fc877120bda3c9d` | equal |
| `rebuild/m3/w7-preview/today/today-model.cjs` | `6a146ff95a145f2f7835b35e9b86be8fcc840e5d` | equal |
| `rebuild/m3/w7-preview/today/gym-app.mjs` | `48bf0531fdbcccffe981bd3c4d2f44a91f7abd6d` | equal |

The fe9f14b column is a readiness observation by `git ls-tree` only, not the
check; the check runs at `S9_PARENT_COMMIT` (STOP until it exists).

Record the final parent commit, the three expected and observed blob ids,
`regions.json` digest, cutter/generator digests, and output digests. Refuse a
mixed ref, missing identity, unpinned product mode, changed buffer after read,
or source/table disagreement by name.

FINAL, measured at `S9_PARENT_COMMIT`
d7f654017962d35661adea8cf3688251ad686b9e (`git ls-tree` with the three explicit
paths, 2026-09-25): today-app.cjs ea98aef6..., today-model.cjs 6a146ff9...,
gym-app.mjs 48bf0531...: EQUAL 3/3 to `sourceBlobs.s9`, the same result the
PM's S10-REGEN --write printed at that parent (runbook T0). No re-witness is
triggered. Track A still re-cuts at this parent with its independent
reconstruction and DOM/listener cells (6.1; runbook T3a). A later chain move of
any of the three files re-opens this check.

### 3.2 Exact parent diff

Before assembly, compare the chosen S10 branch to the accepted S9 parent using
explicit declared paths. Classify every hunk as M (pure moved byte), R
(declared rewrite), or N (new behavior). An unclassified hunk is a STOP.

No S9 artifact, report, accepted guard, runner clause, workflow condition, or
pin may change merely to make S10 green. A sealed-file change routes through
the S10 reseal. A released-file change still needs the review below.

## 4. File roles and owned integration surface

The final inventory is measured from the S9 parent. The following is the
minimum role map, not permission to assume an exhaustive list.

### 4.1 Product roles

- New or carried sealed siblings: `today-lanes.cjs`, `today-readings.cjs`, and
  `gym-settings-lane.mjs`. Their final GSS/split bytes receive product and
  execution pins where the final package schema requires them.
- Released and edited view files: `today-app.cjs` and `gym-app.mjs`. Their
  release is explicit. No child argument may quietly restore a seal pin that
  contradicts the final released role.
- Released build composition: `build.mjs`, with its final required-input list
  measured rather than copied from historical 48/51 or 26/29 counts.
- Final GSS inputs include `machine-settings-view.mjs`; its accepted post-GSS
  bytes become the S10 input. Earlier pinned-unchanged wording is historical.
- `food-model.cjs` and `sleep-model.cjs` remain pinned unchanged in S10 unless
  the final accepted parent expressly says otherwise.
- EW2 product files, admissions, adoption, routing, and screen work remain
  after S10. Do not retire or repoint the F2 dependency ahead of the product
  that consumes its final route.

OBSERVED product blobs at the accepted GSS input 66d32530 (`git ls-tree`,
2026-09-23; re-measure after merge onto the S9 parent, these are not pins):

| Path under `rebuild/m3/w7-preview/today/` | Blob at 66d32530 |
|---|---|
| `gym-settings-lane.mjs` | `40d59ee9261ce958ada7ba1e91046b7eba44d3d2` |
| `gym-app.mjs` | `d8ab53aa7e55f8bf31907a136f50ea811b663e7e` |
| `machine-settings-view.mjs` | `c8131055572ef598872ffbcfd7cf2b7c26ffc9ba` |
| `today-app.cjs` | `57b7ad2cf640591f79d1a2c05c01339cdffbb9eb` (same as b35a48e3, 324b994a) |
| `today-lanes.cjs` | `d66a80ef15cbe5a43f4c3760317df5694fa96e6f` |

b35a48e3 is an ancestor of 66d32530 (`git merge-base --is-ancestor`, exit 0).
Between them the diff under `rebuild/m3` touches only `gym-app.mjs`,
`gym-settings-lane.mjs` and `machine-settings-view.mjs` (plus tests below).
Outside `rebuild/m3` the same range also changes the writer fence
`rebuild/lanes/c/today-split/writer-fence.test.mjs` (+177 -45; blob
`f50a41a7cdd2c4bf906be3d83e81b89db96bcd36` at b35a48e3 ->
`09a6dd1832b33b39acac657463855842581103ef` at 66d32530, OBSERVED). It is the
tripwire that pins the S-R30 exception sites (:626 (3)(4)); see 4.2.

### 4.2 Tests and proof paths

Re-measure and declare every touched test. The known set includes the split
source-read tests (`food.test.mjs`, `problem.test.mjs`), final GSS tests
(`machine-settings-ui.test.mjs`, `gym.test.mjs`), the writer fence,
`package.test.cjs`, `setup.test.mjs`, and the measure boundary test when its pin
is re-homed. The final diff, not this list, decides the complete set.

GSS 66d32530 adds five test files under `rebuild/m3/w7-preview/today/test/`
relative to b35a48e3 (diff --stat, 2026-09-23): `gss-annex-g6-g8.test.mjs`,
`gss-annex-identity-reentrancy.test.mjs`, `gss-annex-log-timing.test.mjs`,
`gss-annex-remount.test.mjs`, `gss-annex-timing.test.mjs`; and edits
`machine-settings-ui.test.mjs`. It also changes
`rebuild/lanes/c/today-split/writer-fence.test.mjs` (4.1). Each needs a
declared product/execution role and a CI home; none is assumed registered.
The fence's rows for the S-R30 exception sites change only under a PM ruling
(:626 (4)); S10 records its final blob, role and CI step by measurement.

Fence changes in b35a48e3..66d32530 and the ruling behind each (measured by
review l2 a29f0279, `git diff` of the fence with explicit path, read whole):

- no today-app exception row changed: the 32 model sites and weigh-in, the
  food and sleep hooks and the twelve copy values have no touched row; the
  only today-app text is unchanged context and a new count row
  (GSS-GESTURE-CONTROL: today-app 0, today-lanes 2);
- paint's model.start: the seam text is byte-identical; its container drops
  the five gym writer seams and GYM_DECLARED_SITES goes 6 -> 1, with a new
  row re-pinning `await model.start()` and the six hooks.paint roots: :628
  G-R2 (the five seams sealed) and G-R5 (six-call-site shape);
- gym-app facade lane acquisition: RELEASED_FILES gym-app `lane:` loses its
  three facade.lane() spellings, replaced by api.lane exact-mapping rows:
  :628 G-R4; the Today facade (the 37 getters of :626) has no row in the diff;
- LISTENERS_OUTSIDE_SHIM gym-app 19 -> 0: :628 G-R3.

S10 re-asserts at the integrated bytes that no today-app exception row changed
and that each gym row above matches its :628 ruling; any other change is a STOP
under :626 (4).

Tidy-up listed for S10, not an edit made by this paper: LOOK_EDITS in the
fence keeps three dead keys for the removed facade.lane() spellings (fence
:1255-:1257 at 66d32530, per review l2). S10 (or GSS) drops them with a row,
never silently.

OBSERVED, non-final: `machine-settings-ui.test.mjs` is edited on three sides.
S9 fe9f14b edits it in aad0c62 (S9-PREP-A, +18 -1 against 8c2bc36e; blob
f5edb496 -> `6f70c0e2d824bdd19245c77f0328bd3b9dd13a77`); the split holds
`037e9624ec4073dd9957421966cb1e20713b3cff` (b35a48e3) and GSS holds
`5626b88f4353dc805ab3ce3828f82dee0d993543` (66d32530). At the S9 parent,
Track B's test is therefore a three-way merge, not an apply, and the 6.2
merge-forward rule fires by construction; this is expected, not a defect.

If S10 carries EPP (section 7.2), `rebuild/engine/test/proposed-pick.test.cjs`
joins this set.

Pure source-read repoints preserve assertions and are red-first. New writer
behavior receives new behavioral rows. No assertion deletion, expected-failure
conversion, denominator reduction, or missing test registration is allowed.

### 4.3 Declaration and execution paths

The integrator owns only the final explicitly commissioned S10 declaration
files: the current acceptance inventory successor, the S10 release/package
declaration, the accepted runner's S10 registration, and the existing
`.github/workflows/rebuild.yml` registration when the PM commissions that last
hunk. Do not create a second workflow or shadow runner.

Product and execution maps are separate. For every affected path, measure its
actual role, pre/post pin and coverage owner. Execution pins come only from the
runner, spec, brief, carrier and actual child argv; product-only data/design
assets are not forced into execution. An executed source still needs its proper
declaration, and all mirrors must agree on sealed/released role.

`today-app.cjs` and `gym-app.mjs` use pre=the bound S9-parent product pin and
post=null under the exact release grant; they must not collide with an
execution route. Check `today-model.cjs` against the actual parent product map:
never invent a release for a file that was not sealed there. Pin the accepted
post-GSS `machine-settings-view.mjs` bytes as :628 requires. Measure the final
product/execution roles of every changed test instead of assuming all tests
belong to both maps.

RELEASE GRANT (FINAL; the grant the RELEASE-FROM-SEAL line L1 cites). For
M2-S10-TODAY-SPLIT, the child of M2-S9-UI-PINS, exactly these two paths leave
the seal, each at its parent pin, and no other path:

- `rebuild/m3/w7-preview/today/today-app.cjs`: pre
  efaf6c0dbb871730788d8953ed470f2650d739b5de7c52fa7f779f2c125df933 (the S9
  artifact's post; role edited at S9), post null;
- `rebuild/m3/w7-preview/today/gym-app.mjs`: pre
  4c8ba0c93f48b1b38be34d08ee23d274841c55680e51a61954754d17bcf8ec53 (the S9
  artifact's post; role carried at S9), post null.

Measured 2026-09-25: both are keys of the S9 artifact `product` with those
posts, neither is among its 84 `executionPins`, and S10.json at f97924a
declares exactly these two with role released, pre as above, post null.
Conditions the runner checks (runbook T5): the ruled set equals S10.json's
role-released set; each path is a parent product key with pre equal to that
pin; neither is in any execution route (at the final S10.json the T6 static
check must print it; runbook Q25). `today-model.cjs` is not released: it was
not sealed at the parent (no S9 product key) and is declared new (S10.json
notes[5]). S9's own released pair `build.mjs` and `preview.css` stays
undeclared. Both released files remain bound by the S-R30 exceptions and the
deferral guard of section 5.

## 5. S-R30 released exceptions and review rule

Carry these four exceptions verbatim (:626 S-R30 (3)):

> the released view holds model at 32 pinned sites and converts the weigh-in text itself; the food and sleep hooks take DOM nodes and twelve copy values are injected by name; paint may call model.start at one pinned site; live lane power through the facade, pinned by acquisition site.

What S10 may claim, in the words :626 requires this brief to use, and no more:

> SO AFTER S10 THE RELEASED FILE STILL CAN WRITE, and what stands between a look ticket's mistake and the athlete's data is what S-R26 already said: the fence as a TRIPWIRE on every acquisition site, an independent review of every released hunk, and the PM's own read.

The deferral guard, verbatim (:626 S-R30 (4)):

> THE GUARD THAT GOES WITH THE DEFERRAL: any look-ticket hunk that touches a pinned exception site (the weigh-in submit, a food or sleep hook call, a facade lane acquisition, paint's start) gets the PM's Fable final whatever its tier, and the fence row for that site changes only under a PM ruling.

These are exceptions, not proof that released files are passive. Released
files still hold live writer-bearing objects. The fence is a tripwire, not a
semantic oracle. Every released exception-site hunk needs independent data-
path final review under the current Claude protocol and a PM read. Any new
exception, changed count, changed acquisition site, or widened capability is a
STOP and a named ticket, not a quiet table refresh.

The in-flight flag follows :626 S-R30 (5): the gym subjects in
GYM-SETTINGS-WRITER-SEAL, submitWeighIn in TODAY-MODEL-HANDOFF, recordIntake in
TODAY-OUTCOME-TYPE; recoverWorkout's hook is assigned to TODAY-MODEL-HANDOFF.
S10 authors none of these; the gym subjects' flag arrives as the accepted
Track B input (66d32530), and the other two stay with their tickets.

"The PM's Fable final" of :626 (4) is now a separate Claude Fable 5.1 reviewer
session, not a PM-seat act (:635 point 1, :778).

## 6. Two evidence tracks that must stay separate

### 6.1 Track A: pure cut

Reproduce the accepted split from the actual parent. Preserve source-door,
anchor, context, declaration, overlap, parsed-structure, output and report
checks. Compare generated `today-app.cjs` and `today-lanes.cjs` byte for byte
with an independent reconstruction. Run the DOM/listener equality cells on
the actual generated output. Record moved bytes and declared rewrites.

Track A may conclude only that the declared split preserved the measured
behavior. It cannot approve GSS N hunks, copy changes, or later ticket behavior.

Parser, DOM and platform proof remain owed at integration (:662). Claude
324b994a did not reproduce L4's 47/53 instrument count (20 rows failed on an
absent parser). Parser absence is not a pass or permission to install
(ae96e30). D5 (175f6323) requires "the real eslint-scope stack"; that stack is
provided only through the existing junctions or an owner-approved route. If
neither provides it, D5 is a named STOP (2.1), never paid by a substitute.

### 6.2 Track B: accepted GSS writer work

The accepted GSS input is `66d325308bc584950163c1c177799ce4953fa298`, not older
pre-annex or editor-only candidates (:765; 1b41692). This supersedes the
ffc10ea wording "Candidate 04ea in independent L3 review". Its chain, each on
its predecessor: 04ea69e (build on base b35a48e3, :701; Claude l1 50e2886
ACCEPT WITH DEBTS, :707) -> 79d981a7 (G6-G8 annex final, :754; Claude l2,
:759) -> 66d32530 (neutral repaint, :762, :763; Claude l3 31c88922, :765).

Apply only that accepted child to Track A's exact output. Carry its own
red-first lifecycle, focus replacement, exact API surface, pending/dispatch,
parity and D2 evidence. Re-run its actual mounted paths and writer fence at
the integrated bytes. Record actual M/R/N counts by physical hunk; do not copy
paper estimates.

Retained debts that S10 carries, by name (reconciled per review 606eb3cf
D-S10B-D2; this replaces ffc10ea's list "timer/dispatch residue, api.lane
passthrough census question, actual M/R/N counts, D2 annex coverage, and all
six inherited scope rows"):

- D-GSS-TIMER (:628): a programmatic click from outside every sealed scope is
  admitted at runtime and caught only by the static row; a computed spelling
  escapes both. Named residue, reported, not fixed by S10.
- D-GSS-PASSTHROUGH (:628): `api.lane` has zero readers by a spelling census;
  whether it retires "is a question for S10's brief after a
  destructure-aware census". S10 runs that census at the integrated bytes and
  reports it; retirement is a separate ruling, not an S10 hunk by default.
- D-GSS-LINES (:628): the builder reports M, R and N by physical hunk.
- The six inherited scope rows of the split (:653 "six inherited scope rows
  unavailable"; :662), still owed at integration.

Closed, not carried: the D2 census, "D2 count closes at12" (:707; 50e2886:
the paper's 13 "is a miscount, not a missing cell"); D-GSS-ANNEX-SILENT and
D-GSS-NEUTRAL-REPAINT (:765, 31c88922). Those two closures are static Claude
judgment with independent 8/8 execution and exact-removal reds (aab4fd1); do
not describe them as a new executed cell or CI result (1b41692). No parser or
archived-parent capability is invented.

If accepted GSS bytes depend on a source that differs at the S10 parent, STOP
and rebase by merge-forward with full reproof. Do not hand-apply a passing hunk
to a different parent.

This fires for `machine-settings-ui.test.mjs` (4.2, OBSERVED three-way edit).
The merged test is re-pinned from its merged bytes and re-run red-first on
both systems (the red at the pre-merge state recorded before the green) before
any Track B claim rests on it; no side's earlier result is reused for the
merged file.

### 6.3 GSS closure notes carried into S10 (:765; 1b41692)

Carried as written in the receipt; they qualify accepted scope and are not
authority to expand a sealed or data-path change.

- The original red 395bd581 and corrected red 669b467d remain immutable
  evidence.
- Cleared shared draft fields render the next view's prescribed defaults;
  blank inputs were not the contract (gym-app :388-:389 read by 31c88922).
- An entry typed during a held Log is cleared at acknowledgement on the
  existing ordinary path too (retained transient-input limitation; c6fb3017
  N1, reaffirmed 31c88922 N3).
- A revised Save can retain an earlier refusal message after a real successful
  write (unmeasured copy note; c6fb3017 N2, reaffirmed 31c88922 N3); no
  automatic repair grant. The copy lock covers every user-visible string
  state, including this one (PM ruling, DECISIONS:780, Claude Opus 5.5 PM);
  see section 8.
- `continuedLogBinding`'s unused `capturedEditor` parameter may be removed the
  next time the lane is touched (31c88922 N1). Do not start another round
  solely for that dead parameter. If S10 removes it, it is an N hunk in a
  sealed file and needs its own row and review.
- Help/Setup use the same repaint path as Why; assessed by reading, not
  separately executed rows (31c88922 N2).

## 7. S10 debt rows

### 7.1 Split debts (:633, retained verbatim by :662)

The following L3 debts (175f6323) are carried verbatim. Astra L4 (84302990)
repeats D3, D5, D6, D7 and D9 with identical text; Claude 324b994a carries them
unchanged.

- D3 / S10 writer cells: add repeated same-date readSleepCheckInView forcing forDate before EACH paint (M18), and inspect typed hours after successful save (M21); own traces remain read/paint/read/paint versus read/paint/paint, and empty hours versus "7.5".
- D5 / S10 instruments: rerun rows 12/13/14/16/32/33 with the real eslint-scope stack, independently exercise generator scope/binding outputs, and retain the uncovered-assignment no-write input; isolated tail checks are not generator-equivalence proof.
- D6 / S10 negative coverage: retain the earlier overlap-refusal debt, including competing replaces nested in a seam; no new overlap proof was commissioned or credited in L3.
- D7 / S10 evidence: validate or explicitly label headLines/closeLines as informational; incrementing either exits 0 with identical product bytes. The inventory correction to 182 witnessed regions plus 20 seams is verified.
- D9 / S10 instruments: classify the 21 L3 clause survivors listed below as equivalent or add branch-specific inputs; equal serialized observations do not establish general equivalence.

D9 survivors, verbatim:
`I042/I046/I047/I048/I052/I082/I088/I089/I094/I107/I172/I194/I196/I224/I229/I235/I236/I281/I289/I295/I301`.

L4's locator for D5, verbatim: "D5 numbering refers to L3; current rows are
identified by source lines 524, 539, 550, 614, 987 and 1028. D9's list remains
in the L3 review, unchanged." (84302990). L4 records D8 CLOSED by S-R32.

S-R33 (:633) adds a durable S10 boot-contract row for a plain options object.
L4's D4, verbatim: "D4 / S10 boot contract: S-R33 rules plain options objects;
the corresponding boot-contract row is still owed. Accessor options are outside
that ruling, not silently repaired here." The row proves the accepted
acquisition count and boot output at the integrated bytes.

D-SPLIT-PARENT (:662, 324b994a) pays in section 3.1.

D-SPLIT-LISTEN pays in TODAY-OUTCOME-TYPE (:662). Preserve the current
no-third-argument measurement (324b994a: 27 addEventListener calls in the base,
none passes a third argument) and scoped limitation; do not add a pre-S10 code
patch.

D1 and D2 remain owned by TODAY-GESTURE-PAINT-ROOTS and TODAY-OUTCOME-TYPE
(:633). Their inherited behavior is reported, not fixed or declared accepted by
S10.

### 7.2 EPP engine repair carriage (:631, :644, :780 Q3, :785, :791) - FINAL

The owner's O-1a (:631): the repair "RIDES S9 if it is accepted before S9's
part 2 is otherwise ready, and S10 if not; THE LOOK NEVER WAITS FOR IT."

DECIDED: EPP rides S10. Measured at `S9_PARENT_COMMIT` d7f6540 (S9 artifact,
2026-09-25): `rebuild/engine/test/proposed-pick.test.cjs` is in neither its
`product` nor its `executionPins`, and `rebuild/engine/today.cjs` (685f6e1e...)
and `rebuild/engine/writers.cjs` (0522797d...) are carried unchanged. So the
sealed S9 does not carry EPP, and the "S10 if not" branch applies. EPP entered
the lane as its own engine-tier input (S10.json notes[3]: 0d38b8e with D-EPP-2
5a953d5 riding with it; integration report round 1 aae3b27), never as a Track
A or Track B hunk (:631, :632). DECISIONS:791 keeps S10 as the working paper
scopes it and excludes NATIVE-LOAD, which becomes its own reseal child after
S10 (S11).

The package's rebuild/engine files (DECISIONS:153 (ii): "every rebuild/engine
file outside its accepted brief's named files"). S10.json at f97924a declares
exactly four non-carried paths under `rebuild/engine/` (every other
rebuild/engine key is role carried), and this brief names all four:

- `rebuild/engine/today.cjs`: edited, pre 685f6e1e... post b4ebee3c... (one
  owner-worded :631 clause);
- `rebuild/engine/writers.cjs`: edited, pre 0522797d... post 67033f9f... (the
  other :631 clause);
- `rebuild/engine/test/proposed-pick.test.cjs`: new, post 3a1f00a1... (the
  EPP cell, D-EPP-1 and D-EPP-4);
- `rebuild/engine/PROPOSED-PICK-REPAIR-REPORT.md`: new, post 33963989... (the
  EPP repair report; documentation, no engine semantics).

Only the first two are engine code, so "exactly the two owner-worded
rebuild/engine clauses" below stands. The runner tests this by package
declaration (b-package.cjs:3196-3202, per Fable REVIEW-S10-BRIEF-l1 F2); any
other non-carried rebuild/engine path at the final S10.json is outside this
brief's named files and is a STOP (:153 (ii)). Measured with the S10.json
bytes of f97924a (`git show`, 2026-09-25); 88cded3 does not change the
product map (notes[8] only).

S10 owes, by name:

- D-EPP-1, verbatim: "THE CELL GUARDS NOTHING YET. git grep for proposed-pick at the head finds 0 references in .github, rebuild/m4/spec and package.json, and .github names no file under rebuild/engine/test. Until the cell runs in the rebuild workflow on both systems and stands in the S9 acceptance, a later reconstruction of rebuild/engine can drop either clause silently."
  S10 status: the cell has rebuild.yml E steps (integration report e57bc80,
  f24fec1, with `if: ${{ !cancelled() }}`) and is declared new in S10.json; it
  stands in an acceptance only when the S10 artifact seals (the S10 acceptance
  replaces "the S9 acceptance" in the quoted text, by the O-1a branch).
- D-EPP-3's declared departure and new pins for the sealed S8 keys
  `today.cjs` and `writers.cjs` (f0a5eb1a; S10.json notes[4]), with the owed
  gates it names (port oracle on the synthetic fixture, sensitivity pass,
  private gate, exact-head CI on both systems) named as owed, not claimed. The
  S10 seal chain is its payer (PM ruling, DECISIONS:780, Claude Opus 5.5 PM).
  The private gate runs only in the PM seat under grant (g) (DECISIONS:816
  (1)).
- D-EPP-4, verbatim: "THE CELL HAS NO SELF-SENSITIVITY GUARD. I carry the blind review's debt unchanged: its seven semantic mutants are killed, but deleting a row's main assertion stays green." It "PAYS: the package that wires the cell (D-EPP-1), or the S10 brief."
  S10 status: paid in bytes at 12be4ea (row EPP-R9); the real cell's green
  half is a hosted step conclusion only (CI-0 36158401022 step 23 "E - EPP
  proposed-pick" success on both OS; S10.json notes[8] at 88cded3), and its
  four-deletion red on the real engine is owed (D-S10I-8); whether the
  red half runs as a PM mutation job under grant (g) or is carried by name is
  the PM's ruling (runbook Q10).

CORRECTION (FINAL; supersedes the working paper's sentence "D-EPP-2 (a third
engine change) needs the owner's word and is not S10's (:639, :644)"): the
owner gave that word. D-EPP-2, the workout-preparation repair at
`rebuild/m4/workout/engine-capture.cjs:69-70`, is owner grant (b)
(DECISIONS:784-785) and rides with EPP into S10 (:780 Q3, :785, :791). It is
not a `rebuild/engine` byte. S10 therefore moves exactly the two owner-worded
`rebuild/engine` clauses (:631) and carries D-EPP-2 under grant (b); any other
engine change is a STOP. D-EPP-5 belongs to the live-app patch, not S10.

## 8. Copy lock

COPY-LOCK CITATION (FILLED at revision 3, runbook T3c). The accepted copy
lock is cited here, before L4 is appended, as the contract below requires.

- Acceptance: DECISIONS:819 on `rebuild/t2-client-core` at 6925ad4,
  lineSha256
  ab0b8edf2377463c55b1ed6e8f61ff0c8be32ae86bd1cde838f947b642c3a611 (the
  exact UTF-8 line bytes without the newline, from `git show
  6925ad4:rebuild/DECISIONS.md`; the same method gives :818's 7ce22ddd...;
  the line is unique on the chain). It records "S10 copy lock round 2:
  Fable l2 ACCEPT WITH NAMED DEBTS", "corpus e3b1be10 (958 pieces), no
  athlete-visible string changed", and "this line is the copy-lock
  acceptance for the S10 brief's T3c row". Answer 5 is RULED at :818.
- Reviews: `rebuild/lanes/fable/reviews/REVIEW-S10-COPYLOCK-l1.md` sha256
  cc901a2c7ed86f790c856c14d2e5fe322dd5bb16165eadc0c6ad05667c8c475d (REJECT,
  F1-F4) and `rebuild/lanes/fable/reviews/REVIEW-S10-COPYLOCK-l2.md` sha256
  b9b3ee4f73f2ea2380dfe0c6ddfb9891ef80ff08406a7beb8e5dd3d7f4576cbc (ACCEPT
  WITH NAMED DEBTS; all four l1 findings fixed and measured).
- Lock paths, sha256 and git blob ids, as integrated into the lane worktree
  at 88cded3 (runbook T3c; untracked until the PM commits; byte-equal to
  the round 2 bytes Fable l2 measured):
  - `rebuild/m3/w7-preview/today/test/copy-lock.cjs` sha256
    7bc1846271550335d9273d8bbedf7b378849a28c8495be28114624865218dc4d, blob
    44463fdba0528ddbff16879ebe6101ab2562d5f1 (the lock).
  - `rebuild/m3/w7-preview/today/test/copy-lock-states.mjs` sha256
    f49eb98d669730cef0fa51597645554365753a6f7b56e56a27e20d2e79472911, blob
    86ee00b3613459a48c80a1e1b93b233a68e89ed9 (the five mounted states).
  - `rebuild/m3/w7-preview/today/test/copy-lock.test.mjs` sha256
    55ceef754cdfa091e0eb810f61fd1551c7999920102acf3938ec61be484d6cfa, blob
    a46e8eaabe74d0130f83ea31c178d2a9134bae1e (the sealed cell: CL-PIN,
    CL-HOLDS, CL-TWO-SIDED, CL-PLANTS, CL-COMPOSED, CL-CLOSURE).
  - `rebuild/m3/w7-preview/today/test/copy-lock.corpus.json` sha256
    e3b1be1078c65877fcc990ce91223f0f758bf51c9dd3b4acc08653b261cd826c, blob
    5bdc6826d616bdb47e7800d8959f55e0330c338b (958 locked pieces, 52 scanned
    files, 13 named tools, 4 scan roots, 5 states; pinned by value as
    CORPUS_SHA256 in the test).
  - `rebuild/m3/w7-preview/today/test/copy-lock-measure.mjs` sha256
    68776f29aa41b0697ff7baa72617e312b97a70f75f6cd2d155b6f827c4035ef2, blob
    fca0d35bb11b45bbb1002ccc543ca94c59144ea4 (re-measure tool; never CI,
    never evidence).
  - `rebuild/lanes/c/COPY-LOCK.md` sha256
    7dd1b122fe85ba07612e7762157e0a90d73ab43c4fa2fea5277d0f4832cfd6f1, blob
    0a860accf179a30c60b3e9c4d8ca189efa228689 (the eight answers, ownership,
    named limits).
- Measured at integration (runbook T3c, lane worktree at 88cded3 plus the
  files above; pm-run shared, guard.cjs preloaded, guard log never created,
  MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, Windows, Node 24.19):
  `node --test --test-reporter=tap
  rebuild/m3/w7-preview/today/test/copy-lock.test.mjs` 6 tests, 6 pass,
  0 fail, exit 0. Round 11 (f97924a..88cded3) moves no locked piece: its
  product bytes are `rebuild/m3/w7-preview/today/test/problem.test.mjs`
  (under a skipped test dir) and `rebuild/lanes/c/today-split-spike/cut.cjs`
  (outside the scan roots), so CL-PIN and CL-HOLDS hold on corpus e3b1be10
  unchanged and no --write re-measure was run.
- The eight answers (COPY-LOCK.md; each: athlete-read string changed: NO):
  1. UNIT: one whole static piece, decoded exactly as JavaScript decodes
     it (a whole literal, one static template chunk, one markup text node,
     one placeholder / aria-label / title / alt value, one shown input
     value, one quoted CSS string, the strings of inline style and script
     bodies), kept when it reads as words; pinned with each scanned file's
     exact count and its design.cjs list membership; compared whole.
  2. OBSERVED SIDE: static, every .cjs/.mjs/.js/.html/.css under
     rebuild/m3/w7-preview/today, /import, /measure and rebuild/slice/pwa
     (test, node_modules, dist skipped; 13 exact-path tools not measured),
     walked on every run; runtime, the released gym card (gym-app.mjs)
     mounted in the real shell and approved template with the real durable
     settings host, every text node, the four attributes and every shown
     input and textarea value harvested per state. Not the built bundle.
  3. STATE SET: every piece of the scanned files plus five mounted states,
     GYM-ACTIVE-SET, GYM-SETTINGS-EDITOR-OPEN, GYM-SETTINGS-REFUSED-EMPTY,
     GYM-SETTINGS-N2 and GYM-SETTINGS-SAVED, each with its exact string set.
  4. UNPORTED SCREENS: the client's current words on every screen are
     pinned, ported or not; a look ticket that ports a screen re-measures.
  5. LEGITIMATE CHANGE (RULED at :818): the corpus stays sealed; a wording
     change re-measures it (`copy-lock-measure.mjs --write`, the new
     CORPUS_SHA256 in the test) in a reseal child with an independent review
     of the corpus diff, for the released today-app.cjs and gym-app.mjs too.
  6. THE ARRAYS: design.cjs assertDesignBinding keeps its direction; the
     lock adds the sealed reverse (list membership and owner counts pinned).
  7. MACHINE: text and jsdom only; identical on windows-latest,
     ubuntu-latest and the owner PC; measured on Windows, Node 24.19 only.
  8. CI: `node --test --test-reporter=tap
     rebuild/m3/w7-preview/today/test/copy-lock.test.mjs` as an S10 child
     (guard-clean) and one `.github/workflows/rebuild.yml` line in the Today
     step on both OS. Not in rebuild.yml at this revision: REGEN --write
     declares the five lock files and the workflow hunk lands last
     (section 9); its presence is checked at the seal, not claimed here.
- Ownership: released presentation copy today-app.cjs (148 pieces) and
  gym-app.mjs (43); unsealed copy the lock holds: design.cjs (240, with its
  five lists), screens.template.html (93), setup-model.mjs (125),
  checkin-model.mjs (36), exercise-catalogue.mjs (246), slice/pwa shell.cjs
  (34) and pwa.cjs (27), the rest per corpus entries. Mirrors: the five
  design.cjs lists (membership pinned), setup-model COPY / VALIDATION /
  REFUSAL_SENTENCES, the template, gym-app's SETTINGS_* constants.
  Generated / dynamic refusal copy from layers outside the scan roots
  (rebuild/m4/workout, rebuild/m3/w6, rebuild/engine, printed by gym-app
  refusalText) is held by the seal at its owner, not by the lock.
  COPY-LOCK.md names no separate class for sealed fallback reasons.
- Enforcement: composed product, answer 2's runtime half (CL-COMPOSED);
  the two-sided deletion fixture CL-TWO-SIDED, red against design-binding
  alone (Fable l2: "the coordinated deletion of "Your food plan." passed
  design-binding"); the c6fb3017 N2 state (:780 Q5) measured as
  GYM-SETTINGS-N2: after an empty Save, a Save revised while held writes
  exactly one durable settings op (Seat four) and the card still shows "Add
  a setting or a cue before saving. Nothing was recorded.".
- Named debts carried (six; none open today; none is paid by this brief):
  D-COPYLOCK-XFORM (a run-time transform or decoding of a literal, and
  markup that splits words into lowercase text nodes, are unseen by the
  static side; only the five mounted gym states see composed output);
  D-COPYLOCK-ATTRS (option label, data-* via dataset and aria-description
  are read by neither side; zero such values today); D-COPYLOCK-EXT (a
  .json/.svg/.txt copy file under a scan root, or a product import from
  test, dist or .tmp, is unseen); D-COPYLOCK-LINUX (measured on Windows
  only; Linux at the first CI run that reaches the step);
  D-COPYLOCK-TODAY-MOUNT (no mounted Today-card state; Today's words are
  held statically only; a mounted Today row is CI or PM-seat work under
  grant (g)); D-COPYLOCK-REDFIRST-SCOPE (CL-PLANTS, CL-COMPOSED and
  CL-CLOSURE have no pre-lock red; the mandatory red is the two-sided
  fixture, which is red).

The CUI0 acceptance citation of 2.1 is filled at revision 2 (DECISIONS:818,
written before any S10 POSTFIX line as :817 requires). No accepted answer
changes what the athlete reads, so no owner decision (runbook J3: answers 4
and 5) is owed; the PM ruled answer 5 (:818) and accepted the lock (:819).
The text below is the required contract, unchanged from the working paper.

Before a released view is declared, insert the accepted C.6/:549 answers. The
required eight-answer contract states, without this brief choosing answers:

1. the comparison unit;
2. the observed client whose copy is measured;
3. the enumerated state set;
4. the policy for states/screens not yet ported;
5. the price/treatment of a legitimate record change;
6. the exact relationship between the copy arrays;
7. the machine on which reproduction is required;
8. whether and how that reproduction is enforced in CI.

It also names exact source/extraction ownership for released presentation copy,
sealed fallback reasons, generated/dynamic refusal copy, and all mirrors. These
are missing-input STOPs until the accepted lock supplies them; this brief does
not design substitute answers.

The lock must cover unported screens, actual composed-product enforcement and
coordinated deletion; these and source closure remain missing-input STOPs until
independently proved and accepted (:732 A4).

Scope of states: the lock covers every user-visible string state, including
the revised-Save stale refusal message (c6fb3017 N2; section 6.3) (PM ruling,
DECISIONS:780, Claude Opus 5.5 PM). This sets coverage, not the answers: the
eight answers above remain the accepted lock's to supply.

Run the lock on the actual composed product, not only on source fragments. Its
mandatory two-sided negative fixture deletes one sentence from both a rendered
screen and `APPROVED_COPY`; the lock must still refuse and name that missing
sentence. It must also catch copy moving into an unscanned file, duplicating or
changing ownership. Proposed EW2 wording and later ticket wording are excluded.
Missing answers, unresolved ownership, an uncovered screen, or a passing
coordinated-deletion plant is a STOP.

## 9. Ancestors, children, pins and mirrors

Build a final reconciliation table with one row per changed path:

`path | parent role/pin | S10 role/pin | execution owner | child effect |
mirror locations | evidence | reviewer`.

For every changed pin or role:

1. Name the old owner and why its pin changes or is removed.
2. Name the new owner and exact digest source.
3. Update every runner/package/workflow mirror in the same integration group,
   while keeping product and execution maps distinct.
4. Prove ancestor packages either remain byte-valid or are intentionally
   superseded by an accepted child rule.
5. Prove no child can re-pin a released file or omit a new sealed dependency.
6. For both released views, bind pre to the actual S9 parent and post to null,
   check the exact grant, and refuse any execution-route collision.

Run the accepted runner's own mirror and mutation rows. A marker-only match is
not proof. The workflow condition must be the complete permitted expression,
the runner path must be the actual runner, and every package id/root/child edge
must resolve at the exact candidate.

The workflow registration lands last, after the standalone new rows have run
on both systems. The workflow must invoke the accepted runner and the new tests
by real path. A green child command not reachable from CI is not closure.

S9's parent-pinned 09-08 reference documents remain carried unchanged unless
separately released by authority; S10 does not remove a parent's pins because
of the pre-S9 E17 selection (:732 A6).

## 10. Runtime and platform evidence

### 10.1 Rules

Before any command, inspect its complete relative import/child-process graph.
Use public synthetic fixtures only. No private corpus, old-app source, athlete
measurement, seal `--full`, receipt writer, or broad directory suite is used
for author iteration.

Never run an engine directory wholesale; inspect transitive helper reads before
any test; the quarantined EPP review scratch named at :645 and :658 is never
read, published, staged or deleted, and no private or legacy claim is
discharged by the EPP review (:645).

At the exact integrated candidate, record separately:

- the cut/instrument cells, including D3/D5/D6/D7/D9 and S-R33;
- split DOM/listener/copy evidence;
- GSS focused and mounted writer evidence, including the five gss-annex files;
- writer fence and all directly affected Today test files;
- complete Today step with honest inherited-red disposition;
- accepted public conformance and package `--ci` routes;
- the EPP cell and its departure evidence, if S10 carries EPP (section 7.2);
- copy lock and CUI preview checks where the final design contract requires;
- full public CI on Windows and Linux at the same commit.

Run one process at a time on the owner PC with fixed clock/time zone where the
test contract requires them. Linux and Windows reports name commit, source
digests, effective versions, mode, scope, counts and exits. A skipped, VOID,
refused, missing-dependency, unavailable-parser, or platform-only row is never
green evidence. Later success cannot hide an earlier failing gate.

### 10.2 Lane step-13 red and where hosted evidence is owed (:627, :565)

GSS exact-head rebuild run 35767357862 failed step 13 on Windows and Ubuntu;
metadata only, no cause inferred (:763, :765, 1b41692). Pipeline 35767357840
and shared-preflight 35767357849 passed; full CI remains red.

:627 rules this class: step 13, the standing cumulative S8 package step,
refuses on EVERY lane branch from the first append after its base, "WHATEVER
IT TOUCHES", and hosted CI "is measured at the merge-forward (:565) and not on
a lane"; the steps behind step 13 did not run, so on a lane hosted CI says
nothing about the lane's own cells. At earlier GSS heads (04ea69e, b35a48e3)
the read refusal was SEALED-PROFILE-RECOMPUTATION, not the chain-tip refusal
(b98f375, :707): changed sealed tests "must travel through their authorized
successor package", here the S10 reseal (this paper's reading). The refusal
name at 66d32530 is unread.

So no lane diagnosis is owed and none is a precondition for Track B. The
evidence owed is the exact-head both-OS rebuild run at the composed S10
candidate (step 12.14), named by run id and conclusion (:627 "a CI sentence
names the rebuild run id and its conclusion, or it is not written"). The lane
red is neither green nor a defect finding: S10 infers no pass from it and
repairs nothing by changing the S8 artifact (b98f375).

## 11. PM tokens and exact-byte finalization

FINAL. The PM writes the four token lines from this brief of record, with the
exact bodies of Appendix A, only in the order and at the time 11.1 states. The
four line kinds are distinct (grammar carried from the working paper,
unchanged, and re-read against the runner in runbook T5):

- RELEASE-FROM-SEAL has exact token shape
  `RELEASE-FROM-SEAL <packageId> <path>[,<path>...]`. It binds
  `release.rulingLineSha256`, exactly 64 lowercase hex, in its own full clause
  and ends with bare final `RULED`.
- GATE-SUPERSESSION has exact token shape
  `GATE-SUPERSESSION <packageId> <carrier>[,<carrier>...]`. It binds
  `coverage.superseded.rulingLineSha256`, exactly 64 lowercase hex, in its own
  full clause and ends with bare final `RULED`.
- THEME reads the four-key cowork claim at `authorizations.theme`: exactly
  `ledgerLine`, `role`, `line`, and `lineSha256`, with `role` equal to `cowork`.
  Its line names this package id and ends with literal
  `SPACE U+00B7 SPACE ACCEPTED`.
- BRIEF-BY-SHA reads the separate four-key cowork claim at
  `brief.acceptedLedgerLine`, with the same exact keys and cowork role. Its line
  names this package id and `brief.file`, and matches terminal
  `(?:^|[ \u00b7])ACCEPTED$`; `brief.sha256` and `BRIEF-ACCEPTED` bind the
  final brief bytes under that distinct predicate.

Each cited `lineSha256` hashes the exact UTF-8 line bytes without its newline
and resolves uniquely on `CHAIN_REF`; `ledgerLine` is the positive integer
coordinate. Unknown final ids, paths, carriers, lines and hashes remain STOPs.

Do not combine these kinds, substitute a generic ACCEPTED line, or claim every
kind carries every commit/inventory field. Each line carries only the fields
and predicate its final accepted grammar requires. Compute hashes from final
bytes. A placeholder, stale ruling line, wrong field shape, or moved target is
refused.

### 11.1 Final texts and when they are written (FINAL)

The exact line bodies are Appendix A: L1 RELEASE-FROM-SEAL, L2
GATE-SUPERSESSION, L3 THEME, L4 BRIEF ACCEPTED BY SHA. The PM appends them on
`rebuild/t2-client-core` in that order (runbook T5), only after (i) no
PENDING mark is left in this file (the three runbook T3a marks are
filled at revision 2 from round 11, 88cded3, :818; the copy-lock marks at
revision 3 from DECISIONS:819), (ii) this file is
committed in the lane and its sha256 and byte count are measured on the
committed bytes, and (iii) Fable has read the four texts; and before runbook
T6's static check, T8 and T10, because the runner's release ruling re-reads
the chain on every call. Tags: L3 and L4 carry the role clause
`SPACE U+00B7 SPACE cowork SPACE U+00B7 SPACE` that verifyReceipt(role cowork)
requires; L1 and L2 are located by sha only, judged by their last U+00B7
clause being exactly `RULED`, and use `cowork (PM)` as S9 did (:786, :787).
`<U+00B7>` in Appendix A stands for the literal UTF-8 middle dot (C2 B7) in
the ledger; this brief itself stays ASCII.

### 11.2 The :732 fold (FINAL)

The :732 corrections (a12be09 amendments A1-A6 and its Execution boundary;
independent review 9ece212, all six upheld) are folded before any token or
hash, as follows:

- A1, A2, A3 correct the S9 brief and are satisfied at the parent: the S9
  artifact pins the whole approved 09-18 pack with the measured 09-08 runtime
  references and no CUI1 product or reference promotion (THEME :788 cites
  :732; seal :810). S10 carries those parent pins unchanged (section 9, last
  paragraph).
- A4: section 2 rows "Copy lock" and "C-UI" and step 12.1 require accepted
  CUI0 and the S9 pins, not accepted CUI1. Re-read at this revision against
  the section 2 "C-UI" input row (the A4 requirement): accepted CUI0 with its
  independent audit (l1 0ca3c8f, l2 c1e18841, l3 30bf3de), the actual S9
  pins and both-platform evidence (CI-2 36137808746) is cited at
  DECISIONS:818 (2.1 CUI0 row). GSS before S10 and the section 8
  eight-answer lock stay mandatory; the lock covers unported screens,
  composed-product enforcement and coordinated deletion (section 8). The
  lock is independently proved and accepted at DECISIONS:819 (section 8,
  six named debts carried); source closure stays a STOP until
  independently proved and accepted.
- A5: section 14, first paragraph (isolated CUI1/2/3/4/6 views only after
  S10's real release, on provisional CUI1, with every named gate kept).
- A6: section 9, last paragraph, and section 14, second paragraph (a named,
  independently reviewed CUI1 reseal child; parent 09-08 pins carried;
  whole-pack coverage stays; promotion is never an S10 hunk).
- Execution boundary: 11.1 (fold before any seal token; measure the actual
  accepted brief sha; no stale brief hash) and section 14, last paragraph
  (the exact approved look and phone-earned weights precede Joe's trial; the
  father's trial follows Joe's; any guard-lowering returns to Joe as a
  concrete choice).

The fold changes carriage and measurement timing only, not a refusal, pin or
release boundary (a12be09 header). The working paper's own sha (7663f118...)
is not a token input.

### 11.3 Hands

The PM reads every released exception hunk and the final declaration diff.
Author, independent Astra reviewer, PM/integrator, and Claude data-path final
remain distinct hands. Model assignment follows :778 ("No other rule
changes"): the Astra independent review stays (12.8, :635), and the Claude
data-path final (12.9) is a separate Claude Fable 5.1 reviewer session (:635
point 1, :778).

## 12. Integration, seal, recheck and live order

1. Accept final S9 parent/pins, CUI0 with independent audit, section 8
   eight-answer copy lock and final GSS child (66d32530 or a reviewed
   successor; its lane step-13 red is not a precondition, 10.2). Accepted
   CUI1 is not required (:732); source closure remains mandatory. Determine
   EPP carriage (7.2).
2. Create the S10 child from the exact accepted S9 parent.
3. Fill the input and reconciliation tables; run D-SPLIT-PARENT.
4. Reproduce Track A, then integrate Track B without mixing their evidence.
5. Pay S10 debts and add S-R33 red-first rows; if S10 carries EPP, pay
   D-EPP-1/3/4 as its own reviewed input.
6. Reconcile declarations, pins, children, runner, workflow and mirrors.
7. Run focused, complete Today, copy/design and public package evidence.
8. Obtain independent Astra review and fix/disprove findings round by round.
9. Obtain the separate Claude final over moved writers, GSS writer logic,
   released exception hunks and soon-sealed declarations (and the two EPP
   clauses at engine tier, if carried).
10. PM performs the exact-byte read; final runner, spec and workflow posts are
    committed before `--ci` or `proposed()`. `proposed()` returns an object;
    `--ci` writes no artifact or receipt.
11. Create the exact proposed artifact, still pending review. The PM alone runs
    the first authorized full in REVIEW-PENDING mode.
12. Record POSTFIX-ACCEPTANCE plus the accepted review envelope. The integrator
    then merge-forwards the accepted child, never rebases it.
13. Only an authorized full writes the receipt. Commit that receipt unchanged;
    the verdict names its exact sha. Commit the coach constant separately.
14. Run the authorized BYTE-IDENTITY reverify, then exact-head Windows and Linux
    CI, then fast-forward. A later DECISIONS/STATUS-only merge may reuse evidence
    only under the named :563/:565 name-only proof and confirming chain run.
15. Any product/execution change after review returns to the responsible proof;
    there is no author permission to run a seal or write a receipt.
16. A live deployment, import, or phone action requires its own authorization
    and live-slice proof. S10 acceptance alone does not grant it.

### 12.1 Binding execution order (FINAL)

Steps 1-16 run as `%TEMP%\S10-SEAL-RUNBOOK.md` (sha256 a39a0253...) T0-T28,
with the Fable fixes the PM adopted at DECISIONS:816:

1. The chain tip at this fill is 9d4816d (:818), not ec0288d or 94977a9: the
   chain adds test cleanup phase 1 (3b54a72, 157 deletions outside every
   fidelity root and outside the S10 product, child argv and REGEN SCOPE;
   Fable scope check 941b1687; chain CI green at 3b54a72, 36159478112, :818)
   and ledger lines through :818 (94977a9..9d4816d changes only
   rebuild/DECISIONS.md, +2, measured 2026-09-25). At revision 3 the tip
   read is 6925ad4 (:819, the copy-lock acceptance); 9d4816d..6925ad4
   changes only rebuild/DECISIONS.md, +1 (measured 2026-09-25). The T7 preflight
   re-measures the chain diff from the tip it actually reads against the S10
   product, execution pins, runner and spec.
2. The chain freeze from the POSTFIX-ACCEPTANCE line (T17) to SEALED AND
   MERGED (T28) covers every chain commit: ledger, cleanup phases,
   NATIVE-LOAD and Astra.
3. The exporter clean step (T9) re-reads tracked, untracked and ignored
   entries after the T8 run.
4. A CI-0 fence red on an unfilled spec proves nothing; runbook Q26 is
   answered only on a filled spec.
5. The S10 exporter (the reviewed v3 ported to S10, DECISIONS:816) lives on
   branch `rebuild/p-s10-exporter-v1` at path
   `rebuild/lanes/astra/s10-exporter-v1/export-s10-profile-v1.cjs.txt`, never
   untracked in the lane worktree. Measured 2026-09-25: the branch is on
   origin at d8ffbcff982d17b5fe648eebdb824b9bf42bf402, the file is blob
   24efeee6... with sha256
   de3aeb76fc7b81d70829f6a27aa52d7d56eeaadfe30a972158740eca73c93301 (13799
   bytes): port v1, Fable containment read ACCEPT WITH NAMED DEBTS
   D-S10EXP-1..4 (:818; commit d8ffbcf). A change to those exporter bytes, or
   to the S10 inputs that read covered, re-opens the containment read before
   the export (:800).
6. A child needle taken before the last product byte change is void. Any
   product byte change after f97924a runs S10-REGEN --write again (shared
   slot) and a review of the new S10.json before needles are taken (runbook
   T3a, T4, Q23). Round 11 (88cded3) is such a change (problem.test.mjs,
   cut.cjs; section 2).

Also binding for S10: the protected runs (b-package --ci/--full, the private
census, D-EPP-3's private gate, guard-tripped children) are the PM seat's
only, under grant (g) (DECISIONS:816 (1)), pass/fail lines only, nothing off
the PC; no builder or reviewer runs, loads or outputs the protected five.
Every node run takes a runtime slot (DECISIONS:814). A single-OS today-17 red
at CI-2 is re-run by an empty commit (DECISIONS:816, as d7f6540). Step 16 is
answered for the slice preview only: the S10 fast-forward deploys it through
slice-host.yml (DECISIONS:816 (2), extending :800). Step 16 still binds every
live-app, main, import and real-data phone action.

## 13. Final STOP list

STOP on any missing or merely proposed prerequisite; any unfilled section 2.1
placeholder; source blob mismatch; unclassified hunk; behavior change hidden in
Track A; unaccepted GSS byte; a missing or red exact-head both-OS rebuild run
at the composed S10 candidate, or any green inferred from a lane run (10.2,
:627); D5 without the real eslint-scope stack (6.1); undecided EPP
carriage or an EPP debt left unpaid by both S9 and S10 (7.2); a third
engine clause; changed/widened S-R30 exception; missing released-hunk review;
unpaid S10 debt; copy-lock gap; stale/missing pin or mirror; undeclared test;
child not reachable from CI; platform disagreement; skipped/refused row;
runner/workflow mutation; seal input drift; artifact/receipt mismatch; CUI1
promotion inside S10; or any request to infer an owner choice, engine
permission, import, merge-to-main, or deployment.

The builder reports the exact failing invariant, input, output and smallest
responsible owner. It does not weaken a guard, refresh a witness to bless an
unknown change, or continue sealing around the stop.

Open marks at this revision (FINAL, revision 3): no PENDING mark. Filled
at revision 3: the copy-lock citation of section 8 and the copy-lock row of
2.1 (DECISIONS:819; the six D-COPYLOCK debts carried). Filled at revision 2:
the CUI0 acceptance citation of 2.1 (DECISIONS:818) and the runbook T3a D5
route of 2.1 (none exists; D5 and the six inherited scope rows are carried
as D-S10R11-2, PM RULED at :818). With D-S10R11-2 carried, the STOP above
"D5 without the real eslint-scope stack" reads: no claim that D5 or those
rows are paid without that stack, and the verdict reports them carried.
OWED-T26 (the exact-head S10 CI) is owed by the seal chain and recorded in
VERDICT-S10.md, not in this file. The PM does not measure this file's L4
sha, and appends no L1-L4 line, while a PENDING mark remains.

## 14. Sequencing boundary after real S10 release (:732; caa0abf)

Only after actual release may separately commissioned isolated CUI1/2/3/4/6
views compose on provisional CUI1 (a12be09 A5). Today face precedes proposal;
the existing queue stays. Section 8 still needs accepted answers covering
unported screens, enforcement on the actual composed product and coordinated
deletion. None is closed by this fold. Every original named
font/copy/scene/motion and applicable screen gate remains; no incomplete CUI1
acceptance, fake element, prototype substitution or waived named failure.

CUI1 reseal child plan (a12be09 A6): before completed CUI1 reference/pin
promotion, name and independently review its later reseal child; it
re-measures APPROVED-PIN, design.test and every affected sealed declaration.
Parent-pinned 09-08 references remain unchanged unless separately released by
authority. Whole-pack coverage stays. Promotion is never an S10 hunk.

The exact approved look and phone-earned weights precede Joe's trial; father's
trial follows Joe's (a12be09; :631 O-2). Any implementation that requires
lowering a guard returns to Joe as a concrete choice (a12be09).

## Appendix A. The four token line bodies (FINAL texts; the PM appends them)

Each body is ONE ledger line with no line break. `<U+00B7>` is the literal
UTF-8 middle dot; `2026-09-DD` is the append date; in L4, `<sha256>` and
`<bytes>` are this file's committed sha256 (64 lowercase hex) and byte count,
measured by the PM after the last PENDING mark is filled. The PM computes each
lineSha256 from the appended bytes (runbook section 0) and S10.json carries
them (runbook T6). Checks each must pass are listed under it.

L1, RELEASE-FROM-SEAL (binds `release.rulingLineSha256`):

```
- 2026-09-DD <U+00B7> cowork (PM) <U+00B7> RELEASE-FROM-SEAL M2-S10-TODAY-SPLIT rebuild/m3/w7-preview/today/today-app.cjs,rebuild/m3/w7-preview/today/gym-app.mjs <U+00B7> the release grant of rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md section 4.3 for the child of M2-S9-UI-PINS: exactly these two paths leave the seal, each at its parent pin, and no other path <U+00B7> RULED
```

Token alone in its clause; the path set equals S10.json's two role-released
paths; each is an S9 artifact product key with pre equal to its pin
(efaf6c0d..., 4c8ba0c9...); neither is in an execution route; last clause
exactly `RULED` (runbook T5 L1).

L2, GATE-SUPERSESSION (binds `coverage.superseded.rulingLineSha256`):

```
- 2026-09-DD <U+00B7> cowork (PM) <U+00B7> GATE-SUPERSESSION M2-S10-TODAY-SPLIT source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate <U+00B7> the token clause for DECISIONS:153, same conditions (i)-(iii), for the child of M2-S9-UI-PINS (grandchild of M2-S8-REAL-SHAPE and the seventh-generation descendant of M2-S3-COMPANION); the child moves rebuild/engine bytes, today.cjs and writers.cjs by one owner-worded clause each (DECISIONS:631 O-1a), both already outside the reconstruction at the parent, and retires the parent's retired gates again under this line and its own evidence - the five carriers cover the nine gates merge-source, migrate-source, writers-source, migrate-differential, witnesses-2, witnesses-5, witnesses-7, writers-differential and second-gate <U+00B7> RULED
```

Carriers only from the runner's byte-identity carrier list and each a parent
carrier (the same five as :787); it states the engine move, so S9's "changes
no rebuild/engine byte" is not reused; last clause exactly `RULED`; after it
is appended, every `coverage.superseded.gates[*].why` in S10.json is re-opened
to cite it with no PROPOSED (runbook T6).

L3, THEME (binds `authorizations.theme`, role cowork):

```
- 2026-09-DD <U+00B7> cowork <U+00B7> THEME M2-S10-TODAY-SPLIT - the reseal child that places the accepted writers-out Today split (b35a48e3), the accepted gym-settings writer change (66d32530) and the owner-granted EPP engine repair (0d38b8e, with D-EPP-2 at rebuild/m4/workout/engine-capture.cjs, DECISIONS:785) on the sealed S9 parent, hands rebuild/m3/w7-preview/today/today-app.cjs and rebuild/m3/w7-preview/today/gym-app.mjs out of the seal and seals their writer siblings; its behaviour/delta contract is rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md; its parent is M2-S9-UI-PINS, rebuild/m4/spec/acceptance-s9-ui-pins.json sha256 f24476220ec9fe187aded6d708c2371a3f604c3f2a41bb94a9594e351d8b8b1c (receipt DECISIONS:809); it moves rebuild/engine/today.cjs and writers.cjs by the two owner-worded clauses of DECISIONS:631 and retires the nine byte-identity gates again under its own token line. This line is the THEME citation the seal runner requires; it authorises no PASS word by itself <U+00B7> ACCEPTED
```

Contains the package id and the role clause ` <U+00B7> cowork <U+00B7> `; ends
exactly ` <U+00B7> ACCEPTED` (runbook T5 L3).

L4, BRIEF ACCEPTED BY SHA (binds `brief.acceptedLedgerLine`, role cowork):

```
- 2026-09-DD <U+00B7> cowork <U+00B7> BRIEF ACCEPTED BY SHA for M2-S10-TODAY-SPLIT: rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md, sha256 <sha256> (<bytes> bytes), is the brief of record; this line carries the binding sha256 and is the citation brief.acceptedLedgerLine cites <U+00B7> ACCEPTED
```

Contains the package id and `brief.file`; matches `(?:^|[ <U+00B7>])ACCEPTED$`;
same shape as :789. S10.json then takes `brief.file` =
`rebuild/lanes/b/S10-TODAY-SPLIT-BRIEF.md`, `brief.sha256` = the measured
sha, `status` BRIEF-ACCEPTED (runbook T6).

## Appendix B. What changed from the working paper c58b892

- Title and status block: the WORKING PAPER ONLY disclaimer is removed where
  this brief authorizes the S10 build and seal (from its L4 line); its other
  limits stay (header). Provenance and chain reference added (94977a9, 816
  lines, at revision 1; 9d4816d, 818 lines, at revision 2).
- Section 2: the 2026-09-23 readiness paragraph is replaced by the state at
  2026-09-25; 2.1 is filled from the sealed S9 with a source per row; PENDING
  marks for the copy lock, CUI0 citation and D5 route; OWED-T26 for the S10
  exact-head CI.
- 3.1: the measurement at `S9_PARENT_COMMIT` (EQUAL 3/3) added.
- 4.3: the release grant L1 cites added.
- 7.2: EPP carriage decided (S10) by measurement; D-EPP-1/3/4 status added;
  D-EPP-2 corrected (owner grant (b), rides with EPP; :780 Q3, :785, :791).
- 8: the PENDING-T3c copy-lock citation block added; the contract is
  unchanged.
- 11: the "do not write a token" sentence replaced; 11.1 order and tags;
  11.2 the :732 fold record; 11.3 hands (text unchanged).
- 12.1: runbook binding with the six Fable fixes and the :814 and :816
  rulings added.
- 13: the open-marks paragraph added.
- Appendices A and B added. Sections 1, 3.2, 4.1, 4.2, 5, 6, 7.1, 9, 10 and
  14 are unchanged.

Revision 2 (against revision 1, sha256 f69d7f41..., per Fable
REVIEW-S10-BRIEF-l1 and DECISIONS:818). Appendix A, sections 1, 3, 4, 5, 6,
7.1, 9, 10, 11 (except 11.1 (i) and 11.2 A4), 12 steps 1-16 and 14 are
unchanged from revision 1.

- D-S10BR-1: the 2.1 CUI0 row cites DECISIONS:818 (C-UI-0 ACCEPTED, written
  before any S10 POSTFIX line as :817 requires; lineSha256 measured); the
  section 2 state, section 8, 11.1 (i), 11.2 A4 and section 13 follow; the
  header and 12.1 fix 1 name the chain tip 9d4816d (:818).
- D-S10BR-2: 7.2 names all four non-carried rebuild/engine paths of S10.json,
  including rebuild/engine/PROPOSED-PICK-REPAIR-REPORT.md.
- D-S10BR-3: the 2.1 exact-head row cites the measured CI-0 per-step result
  of run 36158401022 (step 13 red both OS; steps 16, 23, 24, 25, 26, 33, 34,
  35, 37, 38 green both OS); 7.2's D-EPP-4 status cites step 23.
- D-S10BR-4: 12.1 fix 5 names the exporter path
  rebuild/lanes/astra/s10-exporter-v1/export-s10-profile-v1.cjs.txt on
  rebuild/p-s10-exporter-v1 (d8ffbcf, sha256 de3aeb76...), Fable containment
  ACCEPT WITH NAMED DEBTS (:818).
- The three runbook T3a marks (the 2.1 D5 row, 11.1 (i), the section 13
  open-marks paragraph) are filled from round 11 (lane commit 88cded3; debts
  D-S10R11-1..5; D5 and the six scope rows carried as D-S10R11-2 per :818);
  the section 2 state names round 11 and its REGEN consequence; 12.1 fix 6
  names round 11 as a product byte change.
- Left open: the PENDING-T3c marks (copy lock round 2 in progress, :818) and
  the OWED-T26 mark.

Revision 3 (runbook T3c integration, against revision 2 sha256
e750fe5250937ae7a545cbdf23ea64f8e3652e9de0e0eda8c24255cc9563678c, 71817
bytes). Everything not named here is unchanged from revision 2.

- The copy-lock marks are filled from DECISIONS:819 (copy lock round 2,
  Fable l2 ACCEPT WITH NAMED DEBTS; lineSha256 ab0b8edf...): the section 2
  state bullet, the 2.1 copy-lock row and the section 8 citation block
  (paths, sha256 and blob ids, integration measurement, eight answers,
  ownership, enforcement, the six D-COPYLOCK debts); 11.1 (i), 11.2 A4 and
  the section 13 open-marks paragraph follow.
- The status block, the header chain note and 12.1 fix 1 name the tip
  6925ad4 (:819; 9d4816d..6925ad4 adds only :819).
- Left open: the OWED-T26 mark (seal time). No PENDING mark remains.
