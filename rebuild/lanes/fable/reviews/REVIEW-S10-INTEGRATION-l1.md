# REVIEW-S10-INTEGRATION-l1 (Claude Fable 5.1, independent reviewer, S10 Round 10, 2026-09-24)

Commissioned subject: the UNCOMMITTED Round 10 of the S10 integration builder in %TEMP%\earned-s10int, branch
rebuild/b-s10-integration, HEAD fc6561fd (parent candidate 6dc2596, S9 NOT sealed). git status: four modified
tracked files (S10-INTEGRATION-REPORT.md, S10-REGEN.cjs, S10-REGEN.test.cjs, tooling/packages/S10.json) and two
untracked review copies (Astra L5, Fable l4); nothing else. Judged against the Round 10 task (pay Astra L5 B5 by
POSITIVE REVIEWED PROVENANCE, not name rules; pay D-S10I-16; re-run the 309-name real slice; re-pin the two posts in
S10.json only; append Round 10), opus55-RULES.txt, DECISIONS :777-:803 (:801 ruling (2) exact-file SCOPE entries,
:792, :799-:800 D-BLOM). Rules obeyed: rules file read first; no tracked file edited; no commit/fetch/checkout;
every git show/diff/grep after -- with explicit paths; every node run under %TEMP%\earned-runtime.lock (created by
me 10:53 ET, content fable-s10-l5-review, removed by me at the end); MEASURED_TEST_NOW=2026-09-03,
TZ=America/New_York, Node v24.19.0 at the commissioned binary; a preload guard (%TEMP%\fable-s10-l5\guard.cjs)
that throws on any require/read of the protected five; its log never appeared. No protected-five file loaded, read
or shown; the only repository-content run is the helper's own dry run (public product bytes hashed, protected five
by object id only). sha256 via node crypto; blobs extracted byte-exact with cmd git show.

VERDICT: ACCEPT WITH NAMED DEBTS

## 1. The change, as installed (read whole; diff of the four paths: +121/-20)
S10-REGEN.cjs 246e6dcc9a060809b60be401c9f6bfd37d4a7e547551a50af67ac51bc51506ab (30629 bytes, LF, no U+2013/2014);
S10-REGEN.test.cjs 487552385a7b12ad8670d2da5b7c5845746ffbdf6438849b6cf0ff094b0617c0 (27139 bytes, LF). Both equal
the two new posts in S10.json (L155, L160); the S10.json diff against the fc6561fd blob is exactly those two lines
(2024 lines each side, compared by node). Committed blobs re-extracted: helper cfead8b0 (26388), test 159bd49f (23028).
Provenance (helper :101-126, :204, :217, :224, :239-242, :246-247): validate(f, revs, reads) keeps every existing
refusal in its order (shape: plain path, ADS, 8.3, trailing dot/space, canonical forbidden set, protected alias,
scope, auth words, admission (a)-(d); then the Git regular-file check and the on-disk link walk) and adds, LAST,
`if (reads && !REVIEWED.has(f)) return NOT_REVIEWED` : exact string membership, case-exact, of the string shape()
already normalized. REVIEWED = the four fixed inputs + the six exact-file SCOPE entries + the hard-bound S9 parent
artifact/review (rebuild/m4/spec/acceptance-s9-ui-pins.json, review-s9-ui-pins.json = b-package.cjs:2072 slug
s9-ui-pins; brief :669-670 name the same two files) + S10.product keys (disk) + S9.product keys at P + the S9
execution-pin targets computed once from S9.json at P (RUNNER, S9.json, brief.file, child argv non-flag items).
S10.json must name exactly the two bound artifact/review paths or the run refuses by name before any read of them.
blobAt()/diskAt() throw on any non-member as a last line. Changed paths the run never reads (Markdown outside
rebuild/engine/, S10.json itself) are validated with reads=false: name rules only, never declared, never read.
No name or extension rule was removed or weakened; the test diff is +58 lines, no row or assertion removed; all
120 prior rows are present. Fixture change: world() now declares the split source VIEW in S9.product and
S10.product (as the three real sourceBlobs.s9 paths are), which the new rule requires; not a loosening.

## 2. Red first, measured by me (fake ports only; every byte an invented marker)
RED: the new test bytes (copied flat to %TEMP%\fable-s10-l5\new.test.cjs) with S10_REGEN_UNDER_TEST = the fc6561fd
helper cfead8b0 extracted flat: 183 tests, 121 pass, 62 fail; 41 "the helper READ <name> (content read reached)",
20 "not refused" (the sealed execution pins and the split sources: exit 0, object ids only, the pre-L5 helper never
read those), 1 SyntaxError (a.cjs named as the artifact: read and parsed). The 62 = the ten names through the six
non-declaring sources (60) + the undeclared ordinary changed path + the declared-file-as-artifact row.
Tap run-red-newtest-oldhelper.tap sha256 cdd9feff8ae3. Matches the report's 121/62.
GREEN: installed worktree bytes, in-tree, node --test: 183/183, exit 0 (run-green.tap, written by PS redirection,
counts only). Flat copy of the installed helper under the flat test: 183/183, run-green-flat-installed.tap 5c747752156e.
Sensitivity: helper without the validate() provenance line: 122/61 (run-mut1.tap 8360ea054215, as the report says);
without that line AND both blobAt/diskAt last-line guards: 122/61 with 21 content reads reached (run-mut2.tap
1b7049d274fb), so the rows catch the loss with or without the last line.
D-S10I-16: the fc6561fd test copied flat with the flat old helper: 120 tests, 1 pass, 119 fail, all TypeError
(run-red-d16-oldtest-flat.tap d04f727bb2c4); the new test resolves REPO once from path.dirname(HELPER) (test :19),
header documents it; flat green above. PAID.

## 3. Counterexamples of my own (probe.cjs / probe2.cjs on the suite's ports, installed helper; probe.out 8a4074eefc03)
Refused NOT_REVIEWED by name, exit 2, zero reads of the name, fail-closed: a case twin of a declared path as a
changed path (rebuild/m4/workout/A.cjs); a sealed executionPins key with an ordinary name in no candidate inventory
(t2.cjs); changed Markdown under rebuild/engine/ (read class) in no inventory; an NFD-spelled name; a double-slash
spelling (shape: not a plain path); a real own "__proto__" product key in the S10.json bytes (shape: outside scope,
no crash). Artifact and review swapped (both members): refused by the binding, no non-fixed read. Controls: a sealed
executionPins key that IS a candidate child argv target is admitted (exit 0, unchanged pin not declared, not read);
a changed undeclared exact-file SCOPE Markdown (rebuild/m1/MOCK.md) is neither read, declared nor named (exit 0).
LIMIT confirmed, not a defect of the fix: service-account.json and keys.json declared in S10.product, and
service-account.json declared by the parent candidate S9.json, are read (exit 0): a declaration in the reviewed
spec IS the inventory. The split-source refusal comes after the product reads of declared members (a.cjs, VIEW),
as the suite's own comment says; only the name is checked there, nothing of it is read.

## 4. Real slice and dry run (names from the two public specs; the dry run under the guard)
Independent census (census.cjs, --parent 6dc2596): SCOPE 35 roots, 6 exact-file entries; S10.product 296,
S9.product@P 255, execution-pin targets 86, S9 carrierSuccessor null; REVIEWED 303; artifact binding EQUAL;
changed 73 = 66 read + 7 never read (S10.json and six Markdown reports under today-split-spike/ and today-split/);
not in REVIEWED: S10.product 0, S9.product@P 0, targets 0, changedRead 0, split 0, artifact/review 0, fixed 0;
union 303 (+6 never-read reports = the report's 309). No declared path would be refused: no STOP. REVIEWED holds no
secret-shaped name (password|passwd|apikey|wallet|keystore|private|secret|token|credential|kubeconfig|
service-account|id_rsa|env.json|keys.json: none), no case twins, and exactly two dot-name paths (the two workflow
files, :801). The two S9.product@P keys outside S10.product are the parent-released build.mjs and preview.css.
Dry run of the installed helper on this uncommitted worktree (--parent 6dc2596, dryrun.log 65c4cbe0fa0e): 614
path/revision pairs validated, 303-path inventory, 296 paths {edited 20, carried 231, new 42, superseded 1,
released 2}, 2 entries would change (the two re-pinned posts, HEAD blob vs disk), 2 PROBLEM disk-differs lines for
exactly those two uncommitted files, D-SPLIT-PARENT 3/3 EQUAL, note [0] flagged stale, exit 1, nothing written,
guard log empty. Expected before commit; after the commit the posts equal and the PROBLEMs vanish.

## BLOCKING
None.

## NAMED DEBTS
D-S10I-17 (new, small): s9targets (helper :239-240) recomputes what proposed() pins except carrierSuccessor.file
  (b-package.cjs:3406). S9.json at 6dc2596 declares carrierSuccessor null, so the sets are equal today; a future
  parent declaring one would make the sealed executionPins hold a non-member and the run would refuse by name
  (fail-closed, loud, not silent). Add the field to s9targets red-first, or document the gap beside the LIMIT.
D-S10I-18 (new, wording): the regenerated PRODUCT MAP note still says "New paths are every path HEAD changed since
  the parent ... that the parent does not pin"; since Round 10 an undeclared changed path refuses the run, so the
  note should say every DECLARED changed path. Fold into D-REGEN-NOTES at final input binding.
STOP 12 (PM ruling owed, carried from the report): provenance pays the commission through the six non-declaring
  sources; through S10.product, the parent candidate product and the candidate execution pins a name is a member by
  declaration (30/30 read in the builder's probe, 3/3 in mine). My reading: option (a) is the coherent one (the
  reviewed spec is the inventory; reviewers read the declared names; the name rules stay the only other check),
  and at this head the declared inventory contains no secret-shaped name (section 4). Not blocking; the PM rules.
Carried unchanged: D-PARENT/LOCK, D-SPLIT, D-GSS, D-EPP/CR, D-ACCEPTANCE, D-REGEN-NOTES, D-BLOM (:799-:800),
  D-S10I-4/8/12/13 where unpaid, the s.2.1 STOPs. Not claimed by anyone: race resistance between validation and
  read, hard-link identity, Linux execution. Note only: S10.json carries U+2013/U+2014 characters on both sides of
  the diff (pre-existing, not introduced here).

## Not verified by me
Astra L5 questions 1-8 (merges, runner, supersession, roles, CI condition callbacks) were not re-measured; only the
B5 L5 payment, D-S10I-16, the re-pins, the real slice and the dry run. No --write. No protected module read or
executed. Scratch kept: %TEMP%\fable-s10-l5 (guard.cjs, hash.cjs, jsondiff.cjs, census.cjs, probe.cjs, probe2.cjs,
probe.out, dryrun.log, five taps, old\ blobs, flat and mutant helper copies).
