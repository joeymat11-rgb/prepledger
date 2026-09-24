# REVIEW-S10-INTEGRATION-l3 (Claude Fable 5.1, independent reviewer, round 3, 2026-09-24)

Commissioned subject: rebuild/b-s10-integration 45a88ed..5d42dac (rounds 4 and 5). Found in the worktree
%TEMP%\earned-s10int: HEAD 6696062 = 5d42dac + 6 local commits (round 6: a8eff43, c675711, b1339ca, cad0b03,
f9477f3, 6696062), which pay Astra L2 B5 and D-REGEN-INPUT. Both heads are judged below; the verdict names both.
Rules obeyed: opus55-RULES.txt read first; no tracked file edited; no commit/fetch/checkout; every git show/diff/
grep/ls-tree after --; runtime lock per node run; no protected-five file loaded (the only node cells run were
S10-REGEN.test.cjs, which compiles the helper with FAKE fs/child_process, my probe on the same ports, the
S10-REGEN.cjs dry run, which reads object ids and public blobs, and the l2 releaseAccounts lift). Brief of record
re-read at origin/rebuild/b-s10-working-brief c58b892 (sha256 7663f118..., equal to my saved copy).

VERDICT: ACCEPT WITH NAMED DEBTS (at the worktree head 6696062; 5d42dac ALONE would be REJECT: Astra B5 is
measured open there, S10-REGEN.test.cjs 0/10 against the 5d42dac helper)

## 1. Earlier blockers and debts: paid, with the row that fails without the fix
Astra B2 (12be4ea, EPP-R9): unchanged from l2 item 1; the real cell needs index.cjs, CI-only (D-S10I-8).
Astra B3 (995e684, H18): unchanged from l2 item 2 (48/26 -> 51/29 measured from build.mjs text, no row dropped).
Astra B4 (6f69c9b, releaseAccounts): function bytes unchanged since 9bd4414 (git diff 9bd4414 5d42dac --
  boundary.test.mjs = 12 insertions, the D-S10I-9 control only). Lift re-run at HEAD: today-app accounted by
  S10 from efaf6c0d, gym-app from 4c8ba0c9, today-model refused ("declares it new"), build.mjs by S9; the seven
  refusal variants refuse by name; re-release accepted from S8's post (the named case). Paid.
D-S10I-9 (f7c2980): the row now states the re-release with an explicit control (ok, by S10, pre = S8's post).
  No red-first is possible: the behaviour did not change, only its naming; that is what the debt asked. Paid.
D-S10I-10 (d1e76b1): executed on the real worktree, --parent 6dc2596: "notes regenerated: PRODUCT MAP [1],
  PARENT-UNPINNED PATHS [5], EXECUTION PIN SUPERSEDED [6]"; "STALE NOTE ... [0] PROPOSED DRAFT" flagged;
  `--write` without --receipt-line -> "REFUSED: --write needs --receipt-line N", exit 2, checked before any
  read; `--write --receipt-line 1` -> "REFUSED: no sealed S9 artifact ... at 6dc2596", exit 2; git status
  clean after both. Paid in bytes; NO CELL ROW covers either refusal (D-S10I-11 below).
D-REASON-TEXT (47983ba): header of s10-engine-files-differential names the two moves; unchanged since l2.
Astra B5 (round 6, a8eff43 + c675711): RED first: S10-REGEN.test.cjs (HEAD bytes d8a9a8ff) with
  S10_REGEN_UNDER_TEST = the 5d42dac helper -> pass 0 / fail 10 (the control fails too: that helper reads the
  artifact and review paths, and the protected five, before any validation). GREEN: same cell at HEAD -> 10/10.
D-REGEN-INPUT (b1339ca): the two rows are inside that 10/10 and inside the 0/10. Paid.

## 2. S10-REGEN.cjs path boundary (HEAD bytes fe184527), measured
Static: reads happen only in blobAt (git cat-file by object id, after validate() at that revision) and diskAt
(after validate() at HEAD); discovery is `git diff --name-only P HEAD -- <35 SCOPE roots>`; ls-tree names paths
after --; status --porcelain -- f; the protected five go through protectedPost (object ids + status, never a
read, refuses if the oid moved or the file is dirty). Every path from S10.json, the artifact, S9 execution pins
and the diff is validated before the first product read. SCOPE at HEAD: 703 tracked names, 0 soak/ledger/src/
conform-private names, 0 non-100644/100755 modes; all 296 S10 product paths lie inside it.
Probe (%TEMP%\fable-s10-l3\probe-regen.cjs, the cell's fake ports plus a Windows-like disk that folds case and
trailing dots), HEAD helper, 20 spellings; "reads" = every git cat-file/show and fs.readFileSync recorded:
  control (in-scope edit)            exit 0, reads: today.cjs, a.cjs (declared) + the 4 fixed inputs only
  rebuild/m4/workout/./a.cjs         exit 2 REGEN-PATH-REFUSED (not a plain repository-relative path); 0 reads
  /etc/passwd ; C:/Users/x.json      exit 2 refused by name (not a plain ...); 0 reads
  rebuild\m4/workout\b.cjs           exit 2 refused (backslash); 0 reads
  Rebuild/m4/workout/b.cjs           exit 2 refused (outside the S10 product scope); 0 reads
  rebuild/engine/Seed.cjs (in spec)  exit 1 PROBLEM declared path absent at HEAD; NO read of any seed spelling
  rebuild/engine/seed.cjs. (in spec) exit 1 same; no read (git holds no such entry, so diskAt is never reached)
  rebuild/m4/workout/a.cjs. (diff)   exit 1 same; no read
  seed.cjs in the diff, same oid     exit 0; no read of seed.cjs (post = parent pin)
  seed.cjs moved between P and HEAD  exit 2 "protected engine file changed ..."; 0 reads
  rebuild/m4/spec/ledger/x.json      exit 2 refused (in the forbidden set); 0 reads
  rebuild/m3/w7-preview/src/app.js   exit 2 refused (forbidden set); 0 reads
  160000 entry                       exit 2 refused (not a regular file in Git at HEAD); 0 reads
  artifact path rebuild/conform/private/acc.json (from S10.json) exit 2 refused (forbidden set); 0 reads
  S9 child argv rebuild/lanes/x/secret.cjs (candidate epin)     exit 2 refused (outside scope); 0 reads
  scope root dir itself a junction   exit 2 refused "symlink or junction on disk at rebuild/m4/workout"; 0 reads
  NUL byte in a changed name         exit 2 refused (not a plain ...); 0 reads
  --write without --receipt-line     exit 2 before any read; --write --receipt-line 1, no artifact: exit 2
Real disk: a junction made with mklink /J in scratch -> Node lstatSync isSymbolicLink() true, so diskLinks()
catches junctions as well as symlinks. The 5d42dac helper on the same probe: unscoped diff, `git show rev:path`
without validation for every changed name including /etc/passwd and C:/..., and disk reads of seed.cjs (S9.json
pins the protected five as carried product) - Astra B5 confirmed at 5d42dac, closed at HEAD.
Real-repo dry run at HEAD: 35 roots, 614 path/revision pairs validated, 73 changed in scope, 296 paths
{carried 231, edited 20, new 42, released 2, superseded-by-child 1}, 0 entries would change, D-SPLIT-PARENT
EQUAL x3 (ea98aef6, 48bf0531, 6a146ff9), build.mjs dropped from the declared union (released by the parent),
exit 0. Not tried against the real repository: case/trailing-dot spellings need an edited S10.json (tracked).

## 3. S10.json roles and re-pins against moved bytes
Every post of the eight entries rounds 4-6 touch equals sha256 of the blob at that commit, at 5d42dac and at
6696062: proposed-pick.test.cjs 3a1f00a1 (new), S10-REGEN.cjs 2481496f then fe184527 (new), S10-REGEN.test.cjs
d8a9a8ff (new, 6696062 only), boundary.test.mjs c649d0cf (edited, pre d1057407), package.test.cjs 2980fa51
(edited, pre 6f773e41: carried -> edited because the bytes moved), s10-engine-files-differential e057a540 (new),
b-package.cjs 9fbfdd2d (edited), S9.json 5369b99b (superseded-by-child, pre a1f9fa38). REGEN 0-change dry run
re-derives all 296 pre/post/role from S9.json posts and HEAD blobs. Counts: 295 at 5d42dac, 296 at 6696062.
No engine, runner or workflow byte moved in 45a88ed..6696062 (diff --stat on rebuild/engine, .github,
b-package.cjs, rebuild/m4/import, rebuild/m3/w6: only proposed-pick.test.cjs, +38 -10).

## 4. Brief STOPs and orders
Nothing 2.1 marks STOP is filled: sourceBase "", parent.options[0].sha256/reviewSha256/receiptLedgerLine
empty, release.rulingLineSha256 null, brief.file/sha256/acceptedLedgerLine null, 36/36 child needles null, id
"". parent.decided true / chosen S9 dates from round 2 (45a88ed; false at 1cc556c) and names no seal value.
REGEN fills sourceBase, option sha256s and receiptLedgerLine only at --write, only from the artifact AT THE
PARENT, only if that parent is an ancestor (12.12 merge-forward) and its review envelope is ACCEPTED (the
runner's own :2128 test). D-SPLIT-PARENT (3.1) is re-measured by object id at the parent and refuses --write on
a mismatch. Nothing the brief orders for this range is missing; the s.2.1 and section 13 STOPs stand.

## BLOCKING
None at 6696062. At 5d42dac: Astra B5 (executed input: `node --test S10-REGEN.test.cjs` with
S10_REGEN_UNDER_TEST=<5d42dac helper>; output: pass 0, fail 10; probe: unscoped diff, unvalidated
`git show HEAD:/etc/passwd`, disk read of rebuild/engine/seed.cjs).

## NAMED DEBTS
D-S10I-11 The --receipt-line requirement and the stale-note refusal (d1e76b1) have no cell row; add two rows to
  S10-REGEN.test.cjs on the same fake ports (--write without --receipt-line; a carried note citing 6dc2596 with
  an ACCEPTED parent), red against the 1786b4b helper.
D-S10I-12 S10-REGEN.test.cjs runs in no workflow step (the author's open question). Register it by path where
  engine-pins-unprotected.test.cjs is registered, or record in the report why operator tooling has no CI home;
  the cell loads nothing protected and runs in 10 ms.
D-S10I-13 Disclosure owed in the report: every REGEN before a8eff43 (1786b4b, d1e76b1) hashed the protected
  five's bytes via `git show` and disk when run at 6dc2596, because S9.json pins them as carried product. It
  never loaded them and printed only sha256; the author's rounds 3-5 dry runs and my l2 dry run did this. The
  HEAD helper reads only their object ids (verified: no read of seed.cjs in any probe case).
D-S10I-8 carried: the real EPP-R9 green and its four single-deletion reds are owed from CI (index.cjs).
Carried unchanged: D-S10I-4 (runner refuses the null fields BY NAME, CI), the s.2.1 STOPs, D-SPLIT/D-GSS/
  D-EPP-3 gates, machine-settings-ui both-OS red-first, the destructure-aware api.lane census, S-R30 final
  re-assertion, Astra's D-PARENT/LOCK and D-ACCEPTANCE lists.

## CI-only, owed
proposed-pick.test.cjs (EPP-R9 and R1-R8 on the real engine), engine-provider S3-PROVIDER-ENGINE-PINS,
package.test.cjs H18/H18b/H18c with a real bundle, boundary.test.mjs (g) and the S10 RELEASE-ACCOUNTING row
through the page stack, `b-package --ci --package S10` (must refuse the null fields by name), the s10-sup cells'
real rows and the differential, the writer fence in its CI home, exact-head both-OS run at the composed head.

## Not verified by me
No protected module executed; no real cell of boundary/package/proposed-pick run (source lifts and fake ports
only). REGEN --write's positive path cannot run until a sealed artifact exists; only its refusals were run.
Case-variant and trailing-dot spellings were exercised on the fake Windows-like disk, not on the real
repository (that needs an edited tracked S10.json); the argument for the real disk is that diskAt is reached
only for a name Git holds at HEAD. Round-6 commits beyond 5d42dac were measured but were not in the commission;
Astra has not re-reviewed them. Scratch: %TEMP%\fable-s10-l3 (probe-regen.cjs, run-a/b/c.ps1 and .out).
