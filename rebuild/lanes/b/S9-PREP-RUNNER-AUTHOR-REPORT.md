# S9-PREP-A AUTHOR REPORT - THE RUNNER

Ticket S9-PREP-A, lane B, tooling only, ON THE SEAL PATH. Branch
`rebuild/b-s9-prep-runner`, cut from `rebuild/b-s9-ui-pins` at `da9f8683`.

**FIX ROUND (second author).** `S9-PREP-RUNNER-REVIEW-R1.md` REJECTED the
first author's head `3d143c30` on four BLOCKING findings and eleven notes.
This round answers every one of them, and section 10 says of each whether
it was FIXED or DISPUTED and with what evidence. Three of the four are
fixed in code, the fourth (BLOCKING-3) is disputed as a PM question about
BOTH ruling functions rather than a change to one of them. Everything the
first author measured was re-measured on these bytes rather than carried
over: the whole bar, the whole mutation table, and `--ci` at both ends.

**FIX ROUND 3 (third author), and it is SHORT.**
`S9-PREP-RUNNER-REVIEW-R2.md` ACCEPTED WITH NOTES at `ade31333`, with one
BLOCKING about EVIDENCE rather than about code, and the PM then read every
runner hunk line by line, accepted the mechanism, and ruled four things:
**P-A1** (strengthen the RULED terminal test in BOTH ruling functions, IF AND
ONLY IF the measurement allows), **P-A2** (refuse a release without a bound
parent), **P-A3** (narrow the grandparent skip by measurement) and **P-A4**
(pin H13's count sentence by reading the runner, and correct the two wrong
cites and H13's own mutation row). **Section 11 is this round**: the P-A1
measurement first, then each hunk red first, the mutation table re-taken for
every clause this round touched or added, R2's findings answered one by one,
and the sentences the S9 brief should carry. Sections 0, 1, 2, 4, 5, 6 and 8
are corrected in place where this round moved them, and nothing earlier is
left standing that these bytes make false.

**FIX ROUND 5 (fifth author), AND IT IS THE LARGEST OF THEM.** The PM
ACCEPTED the round-3 head at `DECISIONS:567` and RE-OPENED it at
`DECISIONS:572` after an independent BLIND review by Astra (a Codex reviewer
commissioned under `DECISIONS:569`) REJECTED it:
`rebuild/lanes/astra/reviews/S9-PREP-RUNNER-BLIND-REVIEW.md` on
`rebuild/r-astra-s9a-runner` at `3c02b072`. Two BLOCKING integrity defects,
one robustness finding, one test gap, a 24-row mutation table, and an exact
reproduction for every one. Three Claude reviews and the PM's own read of
every hunk had passed these bytes. The PM confirmed F1 himself and upheld F1
to F4, and ruled **P-A8** (every own key of the spec is an own entry of both
artifact maps), **P-A9** (an ancestor release record is read as a record, and
the grandparent half of the reader goes - this REPLACES P-A6 of `:567`),
**P-A10** (ONE canonical repo-relative spelling at admission, after a
measurement, exactly as P-A1 landed) and **P-A11** (the seven mutants that
lived, two of which DISABLE LIVE ADMISSIONS, killed by cells, with spec()
executed against a committed synthetic package). **Section 12 is this
round**, finding by finding. Sections 0, 1, 2, 4, 5 and 8 are corrected in
place, and R3 N5's two paper numbers are corrected where they stand.

**FIX ROUND 6 (sixth author), AND IT IS THE LAST AUTHOR ROUND ON THE RUNNER
BEFORE S9.** The PM read every runner hunk of round 5 and ruled on its open
questions at `DECISIONS:579`; Astra then RE-CHECKED round 5 at her highest
effort and REJECTED it:
`rebuild/lanes/astra/reviews/S9-PREP-RUNNER-RECHECK-R5.md` on
`rebuild/r-astra-s9a-runner-r5` at `f64fa2b2`. F1 is CLOSED, there is no
honest-chain regression and the no-release byte identity holds; six new
findings stand, with an exact reproduction each. The PM upheld G1 to G6 and
ruled **P-A12** (G1, G2, G5: one choke point at admission, a reserved path
segment, and NO edit of the three older sealed maps), **P-A13** (G3: a
case-only alias of a released path, refused as a COLLISION inside one spec,
and the false comment corrected), **P-A9 (b) TIGHTENED** (G4: the own key SET
and a grandparent that names a package) and **P-A10 WIDENED** (G6: the two
fields Astra showed a comparison for, plus N12's redundant clauses).
**Section 13 is this round**, finding by finding, with the three
measurements, the 44-row table re-taken at this head and what was NOT closed.
Section 0 is corrected in place; this round's four hunks stand in their own
table at 13.1 rather than being interleaved into section 1's thirteen, so a
reader of section 1 is reading exactly what the earlier rounds landed.

Design of record: `rebuild/lanes/b/S9-RELEASE-SPEC.md` v4, as corrected by
`rebuild/lanes/b/S9-RELEASE-SPEC-REVIEW-R4.md`; where the two disagree, R4
stands. Precedent: `rebuild/lanes/b/S8-PREP-AUTHOR-REPORT.md`.

**THIS REPORT IS A HYPOTHESIS.** The reviewer is told to disagree with it
wherever the evidence lets them.

## 0. THE RUNNER, BEFORE AND AFTER

| | sha256 | lines |
|---|---|---|
| at `da9f8683`, the bytes the spec's line numbers are taken from | `e31dd206c0fb0fc0c295df45eae3992d4c59b1a76de8da04a4d0f22948e9335e` | 3252 |
| at `3d143c30`, the bytes REVIEW-R1 reviewed and rejected | `d0021d5ca6871a832ee3d3853cc85370663392abaf4ce7654d0ddb5c5a66ee38` | 3522 |
| after the fix round's four R1 hunks, before its own last correction | `efcdb700a5990cf55d6ca1d7f839cb2d0befdf2ae1d21c9dc7715b47c7ba70e2` | 3577 |
| at `aa42ded0`, the bytes REVIEW-R2 reviewed and ACCEPTED WITH NOTES | `25ddc44c32d0d71b924cf62c2e0a8647697b6e77a55a91a132388217b6789ca6` | 3580 |
| at `4e447ae6`, the bytes ASTRA reviewed BLIND and REJECTED (fix round 3's head) | `32916e509df0e38e4cb464a4b30c871f880d11a849958c5d7e9d14d1e2961be3` | 3638 |
| after H18 alone (P-A8) | `9efd03d2e0cbd896f93c7d975a6ba877c0bb1ebf17bdbda6019e609e281c5af9` | 3658 |
| after H19 and H20 (P-A9) | `88a0caf551abe5c47c98fbd3a2bfa19f0353706d0b7192dddbd716b90c378453` | 3700 |
| at `4ccfdfcd`, the bytes ASTRA RE-CHECKED and REJECTED (fix round 5's head) | `316f86c541f109a5876f5ea8d0557164151585f4f5940ce8878c3bec02bee43e` | 3761 |
| after H23, H24 and H25 (P-A12, P-A10 widened, P-A13) | `4fbf39c434200501eb038401566fbb7d0874d03855e8fcd42670708afae377a9` | 3836 |
| **FINAL, at the head of this branch, after fix round 6 (P-A12, P-A13, P-A9 (b) tightened, P-A10 widened)** | **`71c1b2592b5a3544b71c0995a9f52b88fbe24cd6b821709309aa95e5ad3012c0`** | **3864** |

Line counts are `wc -l`. R1 N11 is right that `split('\n').length` says one
more, and this table now uses the `wc -l` convention throughout so nobody
spends that minute again.

Every line number below is in the FINAL runner, anchored by content and
re-measured after the last hunk landed. The spec's own numbers are cited
beside them where they differ, which they do for every hunk after H1, because
the hunks carry their reasons in comments. **The first author's numbers moved
in the fix round and every one of them was re-taken, not adjusted.**

## 1. THE HUNK TABLE

**EVERY NUMBER IN THIS TABLE WAS RE-TAKEN AT THE FIX-ROUND-3 HEAD**, after
P-A1, P-A2 and P-A3 landed; the round-2 numbers are gone rather than adjusted,
and the three new hunks are the last three rows.

| H | landed at | what it does, in one sentence | the red-first cell that proves it |
|---|---|---|---|
| H1 | `:367` (spec `:351`) | `PRODUCT_ROLES` gains `'released'` as the sixth and last word of the closed vocabulary, fixed here and nowhere else (W7) | B.8 (1), and F6b in `pinned-unchanged-and-ruled-substitutions.test.cjs` |
| H2 | `:993-:995` (spec beside `:932-:933`) | `RELEASE_GRANT`, `RELEASE_GRANT_SHAPE` and `releaseGrants()`, the token's grammar, beside the `GATE-SUPERSESSION` token they mirror | B.8 (1), (6) |
| H3 | `:1344-:1420` (spec: new, beside `supersessionRuling()` `:1282`) | `releaseRuling(s, bound)`: B.2 steps 1 to 6, no cache, unique sha, the RULED terminal clause, package-named, set equality both ways, parent-pin membership, and a SEVENTH step from F.1 R2, the executionPins disjointness | B.8 (4), (5), (6), (7), (8), (R1-B1) |
| H4 | `:1735-:1736` (spec `:1517-:1531`) | in `spec()`'s product loop, a `released` pin declares `post === null`, by its own refusal name | B.8 (1b) |
| H5 | `:1160` and `:1653-:1656` (spec after `:1531`) | `SPEC_KEYS` gains the OPTIONAL key `release`, closed with the freeze pattern, and the block gets a closed key set of its own | B.8 (1b) |
| H6 | `:2191` (spec `:1894`) | `product()`'s parent-pin branch admits `'released'` beside `carried` and `edited`, which is the one place a parent pin's role is judged | B.8 (2) |
| H7 | `:2263` plus the bucket at `:2174` (spec `:1952`, `:1888`) | a released path leaves the inventory walk ONE LINE above the disk hash, into a bucket of its own, so it is never hashed and can never reach the drift assert | B.8 (3) |
| H8 | `:2300-:2305` (spec `:1983-:1987`) | `product()`'s terminal `say` gains the released clause: the count, the ledger line, the parent that sealed them, and the paths | B.8 (3) |
| H9 | `:2180` (spec `:1889`) | the ruling is resolved at the loop entry, BEFORE a byte of the inventory is read, so the ledger binds before the walk does | B.8 (4) to (8) |
| H10 | `:3144-:3149` and `:3177` (spec `:2826`) | `proposed()` keeps released entries OUT of `product` and builds the `released` block from the spec and the ruling; the block is emitted only when something is released | B.8 (9), (R1-B2) and (X1) |
| H11 | `:3182` and `:3399` (spec `:2830`) | `ARTIFACT_KEYS` gains the OPTIONAL key `released`, closed in `envelope()` with the same freeze pattern | B.8 (9), and (X1) |
| H12 | `:3372` (spec `:2993`) | `writeSealedRunReceipt()` never puts a released path into the receipt's product map | B.8 (10) |
| H13 | `:3342-:3345` and the count at `:3573-:3577` (spec `:2970`, `:2972`, `:3190-:3194`) | `sealedRunReceipt()` skips released paths in BOTH directions, and the AUTHORIZED STEP say no longer over-counts what it re-verified | B.8 (10) for the skips; **the count by (P-A4), which reads the runner's text, because no cell can execute that say (R2 BLOCKING-1)** |
| **H17** | `:2064-:2070`, `:2106`, `:2124`, `:2131-:2141` (spec `:1852`, `:1855-:1858`) | `releasedAncestry(a, ga)` and ONE `continue` in the GRANDPARENT walk, plus the say clause naming how many pins the skip stood aside for AND which | B.8 (11), (12) |
| **HR-B1** (round 2) | `:1409-:1418` | the disjointness set is built the way `proposed()` builds `executionPins` - runner, spec file, brief, carrier successor, argv - so the guard closes the CLASS its own comment names; the argv route keeps its own refusal name and the other four refuse `RELEASE-PATH-IS-AN-EXECUTION-PIN-TARGET`, naming the route | (R1-B1) |
| **HR-B2** (round 2) | `:3147-:3148` | the sealed `released` entry carries NO live line index: four keys, `role`, `lastSealedSha256`, `sealedBy`, `rulingLineSha256` | (R1-B2) |
| **P-A1** (round 3) | `:1012-:1013`, called at `:1298` and `:1360` | `ruledTerminal()`, ONE test for BOTH ruling functions: the ledger line's LAST clause, trimmed, is exactly the word `RULED`, so a line ending "this is NOT RULED" rules nothing | (P-A1) in `release-from-seal.test.cjs` AND (P-A1) in `gate-supersession.test.cjs` |
| **P-A2** (round 3) | `:1384-:1386` | a declared release with no bound parent product map refuses `RELEASE-WITHOUT-A-BOUND-PARENT` instead of skipping B.2 step 6 in silence | (P-A2) |
| **P-A3** (round 3) | `:2064-:2070` (the ancestry carries the entry) and `:2119-:2123` | the grandparent skip asserts the ancestor block's `lastSealedSha256` IS the grandparent's own pin for that path before standing it aside, and otherwise refuses `ANCESTOR-RELEASED-BLOCK-IS-NOT-THE-GRANDPARENT-PIN` naming the path and both shas | (P-A3) |
| H14 | `:177` (spec `:173`) | `IDS` gains `'S9'`, directly behind `'S8'` and still ahead of `'B1'` | F6 |
| H15 | `:324` (spec `:316`) | `NO_REGISTER_IDS` gains `'S9'` | F6 |
| H16 | `:427-:479` (spec `:405`) | `CHILD_ROOTS` gains FOUR at the END of the list | F7 |
| + | `:385` | `TOOLING_FILES` gains `test/release-from-seal.test.cjs` IN THE SAME HUNK that created the file (E fact 13, F.1 R4) | F.1 R4: without it `fidelity()` calls the file `UNLISTED-SOURCE-CHANGE` on the first `--ci` run |

| **H18** (round 5) | `:3144-:3167` | `proposed()` builds BOTH maps with `Object.fromEntries`, so EVERY own key of the spec becomes an own entry: the plain assignment H10 introduced set the map's PROTOTYPE for a key spelled `__proto__` and dropped the pin, and the release record with it | (P-A8 a), (P-A8 b), with (P-A8 c) and (X1) as the no-release byte controls |
| **H19** (round 5) | `:2064-:2083` and the call at `:2125` | `releasedAncestry()` takes ONE artifact, the parent: the grandparent half decided nothing reachable (Astra M17, M18) and COULD decide something wrong (a grandparent exempting its own product pin) | (P-A9 a) |
| **H20** (round 5) | `:2129-:2166` | the skip stands a pin aside only for a CLOSED FOUR-KEY release record whose `sealedBy` is the GRANDPARENT's `packageId`, only for a path that is an OWN KEY of the grandparent's PRODUCT map, and only at that product pin's own sha256 | (P-A9 b), (P-A9 c), and (P-A3) for the hash half |
| **H21** (round 5) | `:1162-:1216` | `canonicalPath()` and `canonicalSpecPaths()`: ONE canonical repo-relative spelling for every path the release mechanism compares, refused by name and NEVER rewritten | (P-A10 b) |
| **H22** (round 5) | `:1712` | the call, at admission, before any path in the spec is resolved, compared or read | (P-A10 a), (P-A10 b) |

**The round-5 hunks ARE called H18 to H22**, and the paragraph below is
therefore corrected: it was written when the spec's own H18/H19 were still
live names for other lanes' work. Those two are still not in this ticket and
still untouched here; the collision is in the NAME only, and the rows above
say "round 5" in every one of them so that no reader can confuse them.

H18, H19 and H19b of the SPEC are NOT in this ticket: H18 is a sealed cell
(`today/test/package.test.cjs`, owned elsewhere this round) and H19/H19b are
lane C cells under `rebuild/lanes/c/ui-port/`, which E.2 puts on the WAIT
list. Nothing in this branch touches any of the three. **The fix round's two
new hunks are called HR-B1 and HR-B2 and NOT H18/H19, so that no reader can
confuse them with the spec's own numbering.**

## 2. THE MUTATION TABLE, MEASURED

**RE-TAKEN WHOLE IN FIX ROUND 5, on the final bytes, with ALL TEN TOOLING
SUITES behind every single row.** One change at a time from the head bytes,
the original restored in a `finally` after every run, the runner's sha256
re-checked at the end. The harness is `%TEMP%\s9a5-mut.cjs`, a throwaway,
never committed; it carries this lane's own hunks re-anchored at this head,
the five hunks this round adds, and **Astra's whole 24-row table**. It printed
`BASE sha 316f86c541f109a5...e43e` and
`RESTORED sha 316f86c541f109a5...e43e equal=true`, and `git status
--porcelain` after it was empty, so the runner these rows were measured
against is the runner this branch ships.

**BASE: 145 pass / 0 fail / 0 skipped over the ten suites. NO HUNK IS A
NO-OP, including the five new ones.** Astra ran 130 tests per row; this table
runs 145, which is the same ten suites with this round's fifteen new cells in
them.

### 2a. This lane's hunks

| revert | pass/fail | cells that go red | the refusal it prints |
|---|---|---|---|
| H1 | 140/5 | F1 (the "pinned-unchanged" row), F6b, B.8 (1), **(M08)**, **(M09)** | `PRODUCT_ROLES` is five, not six, so a spec declaring the word refuses `PRODUCT-ROLE-NOT-IN-THE-CLOSED-VOCABULARY` |
| H2 | 113/32 | the whole release suite and the whole supersession suite | `ruledTerminal is not defined` |
| H3 | 109/36 | 36 cells across four suites | `releaseRuling is not defined` |
| **H4** | **143/2** | B.8 (1b), **(M09)** | `PRODUCT-RELEASED-DECLARES-A-POST`, and for the first time through an EXECUTED `spec()` rather than by reading the runner |
| **H5** | **141/4** | B.8 (1), (1b), **(M08)**, **(M09)** | the release block is no longer closed, and `spec()` admits a block with an extra key |
| H6 | 140/5 | B.8 (2), (3), (8), (R1-B1), (P-A1) | `PARENT-PRODUCT-PIN-NOT-DECLARED-CARRIED-OR-EDITED rebuild/m3/w7-preview/today/preview.css` |
| H7 | 130/15 | 15 cells across three suites | `Cannot read properties of undefined` (the released bucket is gone) |
| H8 | 142/3 | B.8 (3), (R1-B1), (P-A1) | the released clause is gone from the PRODUCT say |
| H9 | 134/11 | B.8 (2) to (8), (R1-B1), (X2), (P-A1), (P-A2) | `Missing expected exception`: the ledger stops binding the inventory |
| H10 | 142/3 | B.8 (9), (R1-B2), **(P-A8 b)** | a released path is back inside `product`, which is to say it is inherited |
| H11 | 143/2 | B.8 (1), (X1) | `ARTIFACT_KEYS` does not carry `'released'` |
| H12 | 141/4 | B.8 (10), (P-A4), S-release, S-commit | the write no longer skips released paths |
| H13 | 143/2 | B.8 (10), S-release | the receipt this seal step wrote no longer re-verifies |
| H13 (the count alone) | 144/1 | (P-A4) | the AUTHORIZED STEP re-verify over-counts by the number of released paths |
| H17 | 139/6 | B.8 (11), (12), (P-A3), **(P-A9 a)**, **(P-A9 b)**, **(P-A9 c)** | `GRANDPARENT-PIN-BROKEN rebuild/m3/w7-preview/today/preview.css` |
| HR-B1 | 144/1 | (R1-B1) | `Missing expected exception`: all four non-argv routes are admitted again |
| HR-B2 | 142/3 | B.8 (9), (R1-B2), **(P-A8 b)** | the entry's key set is five again, the fifth being the live line INDEX |
| **H18** (round 5) | **143/2** | **(P-A8 a)**, **(P-A8 b)** | the own key `__proto__` becomes the map's PROTOTYPE and leaves the artifact in silence |
| **H19** (round 5) | **144/1** | **(P-A9 a)** | `Missing expected exception`: the grandparent's own released block exempts its own product pin again |
| **H20 (b)** (round 5) | **143/2** | **(P-A3)**, **(P-A9 b)** | a one-key entry, and a record that says `carried`, stand a grandparent pin aside again |
| **H20 (c)** (round 5) | **144/1** | **(P-A9 c)** | an execution-only grandparent pin is stood aside by a release again |
| **H21** (round 5) | **143/2** | **(P-A10 a)**, **(P-A10 b)** | `canonicalPath()` stops refusing `.` and `..` segments, so `./f` is admitted |
| **H22** (round 5) | **143/2** | **(P-A10 a)**, **(P-A10 b)** | the rule is never called, so every non-canonical spelling is admitted |

`S-release` is the seal-tip suite's "S9 H12/H13 - a RELEASED path is in
neither direction of the receipt" row; `S-commit` is its "r8" row, a
secondary fixture failure. Both labels are Astra's, kept so the two tables
read against each other.

**THE WEAKEST ROW IS NO LONGER WEAK, and this paragraph replaces the one that
said it was.** H4 and H5 live inside `spec()`, which no lane-B cell could
call, and the previous rounds pinned both SITES by READING THE RUNNER'S TEXT
and said so, ending: "A reviewer who wants better evidence here would have to
build a fixture package directory, and that is a fair thing to ask for."
Astra asked for it, measured the cost of not having it (M08 and M09 each
disabled a live admission with all ten suites at 130/0), and proved it could
be built. The spec-phase stage of section 12.4 is that fixture package, and
both hunks now go red through an EXECUTED `spec()`: H4 by (M09), H5 by (M08)
and (M09). B.8 (1b)'s source-reading rows are kept beside them, because a
site that is deleted and a site that is disabled are two different failures.

**H12 and H13 each still go red ALONE**, so the two directions of the receipt
are separately observed and not jointly, and H13's COUNT is measured on its
own row rather than inside H13's.

### 2b. Astra's 24 rows, re-run at this head AS MEASURED

Her column "Pass/fail; tests that noticed" was measured over 130 tests at
`4e447ae6`; mine is over 145 at this head. **Every one of the seven survivors
is dead**, and no row that killed something before has stopped killing it.

| ID | the change (hers, re-anchored where this round moved the text) | hers, at `4e447ae6` | HERE, at this head |
|---|---|---|---|
| M01 | grant id `===` becomes `startsWith` | 130/0, NONE | **144/1, (M01)** |
| M02 | `assert(granted.has(file)` becomes `true \|\|` | 128/2; R(2),(7) | 143/2, B.8 (2), (7) |
| M03 | `assert(declared.includes(file)` becomes `true \|\|` | 129/1; R(7) | 144/1, B.8 (7) |
| M04 | pre-image assert compares the spec with itself | 129/1; R(2) | 144/1, B.8 (2) |
| M05 | `Object.hasOwn(pmap, file)` becomes `file in pmap` | 130/0, NONE | **144/1, (M05)** |
| M06 | `hits.length === 1` becomes `>= 1` | 130/0, NONE | **144/1, (M06)** |
| M07 | `ruledTerminal` becomes the old last-word regex | 128/2; G(P-A1),R(P-A1) | 143/2, (P-A1) in BOTH suites |
| M08 | the release-block condition becomes `false && ...` | 130/0, NONE | **144/1, (M08)** |
| M09 | `if (false)` in front of the post-null assert | 130/0, NONE | **144/1, (M09)** |
| M10 | `assert(!argv.has(file)` becomes `true \|\|` | 128/2; R(8),(R1-B1) | 143/2, B.8 (8), (R1-B1) |
| M11 | `assert(!epin.has(file)` becomes `true \|\|` | 129/1; R(R1-B1) | 144/1, (R1-B1) |
| M12 | the disk-skip branch becomes `false && ...` | 125/5 | 140/5, B.8 (2),(3),(8), (R1-B1), (P-A1) |
| M13 | `proposed()` stops calling `releaseRuling` | 129/1; R(P-A2) | **140/5**, (P-A2), (M01), (M05), (M06), (M23) |
| M14 | `sealedBy` becomes `M2-WRONG-PARENT` | 129/1; R(9) | 143/2, B.8 (9), **(P-A8 b)** |
| M15 | the `released` block is emitted unconditionally | 127/3; R(9),(X1),(X2) | 141/4, B.8 (9), (X1), (X2), **(P-A8 c)** |
| M16 | the ancestor hash assert becomes `true \|\| ...` | 129/1; R(P-A3) | 143/2, (P-A3), **(P-A9 c)** |
| M17 | remove `if (!out.has(file))` from `releasedAncestry` | 130/0, NONE | **NOT APPLICABLE**: H19 removed the merge it guarded |
| M18 | `releasedAncestry(a, ga)` becomes `releasedAncestry(a)` | 130/0, NONE | **NOT APPLICABLE**: H19 made that the shipped code |
| M19 | the receipt's forward skip becomes `false && ...` | 128/2; S-release, S-commit | 143/2, S-release, S-commit |
| M20 | the receipt writer stops filtering released paths | 126/4 | 141/4, B.8 (10), (P-A4), S-release, S-commit |
| M21 | a special case for one key in the product map | 130/0, NONE | **144/1, (P-A8 a)** |
| M22 | the receipt's reverse loop stops filtering | 128/2; R(10),S-release | 143/2, B.8 (10), S-release |
| M23 | `/^RELEASE-FROM-SEAL` loses its anchor | 130/0, NONE | **144/1, (M23)** |
| M24 | the bound-parent assert becomes `true \|\| ...` | 129/1; R(P-A2) | 144/1, (P-A2) |

**M13 GOT WIDER AND THAT IS WORTH A SENTENCE.** Astra measured one cell
noticing when `proposed()` stops calling `releaseRuling()`; here five do,
because four of this round's own cells drive their refusals THROUGH
`proposed()`. That is not a stronger hunk, it is a better-covered one.

**THE TWO ROWS I REMOVED RATHER THAN KILLED.** M17 and M18 are gone because
P-A9 (a) deleted the construct each of them mutated: the reader takes one
artifact and merges nothing. The harness prints `NOT APPLICABLE AT THIS HEAD`
with the reason for each, instead of dropping two rows from a table a
reviewer will compare against Astra's.

## 3. (X1) AND (X2), THE TWO THINGS THE PM ASKED TO BE CHECKED

**BOTH HOLD. Neither needed a fix, so nothing in the mechanism moved for
them.** Each is a cell in `release-from-seal.test.cjs`, added before the
ancestor re-pins.

**(X1) H10 and H11 do not make any ALREADY SEALED artifact unrunnable.**
`ARTIFACT_KEYS` is an exact key set and `:3283`'s recomputation is a JSON
string equality, so for a spec that declares NO release block `proposed()`
must be byte-identical to what it was. Measured against the REAL S8
artifact's own key order, read off disk, because `acceptance-s8-real-shape.json`
is exactly what E fact 7 re-points at these runner bytes:

- `Object.keys(proposed(...))` deepEquals the twenty-one keys S8's sealed
  artifact carries, IN ITS ORDER, with no twenty-second: H10's spread emits
  nothing when nothing is released;
- `ARTIFACT_KEYS` deepEquals those twenty-one plus `'released'` LAST, so H11
  APPENDED and re-ordered nothing, which is the whole of why `keys()` can
  stay an exact set and still read an artifact sealed before S9;
- `JSON.stringify(p.product) === JSON.stringify(s.product)`: H10 rebuilds the
  product map rather than passing `s.product` through, and the rebuild is
  byte-identical, key order included, not merely `deepEqual`;
- `envelope()`'s freeze pattern accepts it and still refuses a stray key;
- `same(p, proposed(...))` is true and the two JSON strings are equal.

AND AT THE RUN LEVEL: `--ci --package S8` and `--ci --package H3` print the
same named refusal after the re-pin as they printed before this lane's first
edit. See section 5.

**(X2) `releaseRuling()` is not entered for a package that declares no
release block and no released path**: no `RELEASE-NOT-RULED`, and no extra
Git read. Measured rather than argued: the runner is compiled a SECOND time
with `CHAIN_REF` pointed at `refs/heads/no-such-chain-ref-s9a`, so any read
of the chain ledger throws where it stands.

- CONTROL FIRST: the same runner with the release block back DOES refuse, and
  the refusal is NOT a `RELEASE-` name, which is what makes the green below
  mean "no read happened" rather than "the read happened to succeed";
- a spec with no release block runs `product()` to `NOT-IMPLEMENTED` under it,
  prints no released clause, `proposed()` carries no `released` key, and
  `releaseRuling()` returns `{ at: null, line: null, granted: empty,
  declared: [] }`.

The code that makes this true is the first three lines of `releaseRuling()`
(`:1315-:1317`): a package that declares nothing released and carries no
block returns an empty grant before the shape asserts and before `L.object()`
is reached. It is called from two sites (`product()` `:2081` and `proposed()`
`:3028`), and both return on that line for every package sealed before this
role existed.

## 4. EVERY ORDINAL THIS LANE MOVED

Counts that a cell pins by literal, so that none of them can move in silence.

| where | from | to | who pins it |
|---|---|---|---|
| `PRODUCT_ROLES` | 5 | **6** | F1's length pin (kept, not deleted) and the new F6b, both in `pinned-unchanged-and-ruled-substitutions.test.cjs` |
| `IDS` | 12 | **13** | F6, whole-list literal and `slice(0, 13)`; "the ruled sequence is now THIRTEEN" |
| `NO_REGISTER_IDS` | 8 | **9** | F6, sorted literal plus an explicit `.size` of nine |
| `CHILD_ROOTS` | 20 | **24** | F7, whole-list literal AND the `slice(8)` literal, title moved with it; `slice(0, 8)` untouched |
| `TOOLING_FILES` lane-B suites | ninth | **tenth** | the comment at `:380-:385`, and `fidelity()` itself on the first `--ci` run |
| `SPEC_KEYS` | 21 | **22** (the new one OPTIONAL) | B.8 (1b), through the runner's own `keys()` |
| `ARTIFACT_KEYS` | 21 | **22** (the new one OPTIONAL) | B.8 (9) and (X1) |
| the AUTHORIZED STEP re-verify count **`:3573-:3577`** | whole inventory | **inventory minus released**, with the released named in a clause | **(P-A4), by READING the runner's text - the same class as H4 and H5 below.** R2 BLOCKING-1 is right twice over: the cite here used to read `:3458`, which is a `for (const gate of R.GATES)` line, and the row used to claim B.8 (10) pins it, which it cannot: the sentence stands past the `// 8. main sequence` delimiter every lane-B cell slices off, and reverting the count turned NOTHING red anywhere in the bar. It is now pinned the way B.8 (1b) pins H4 and H5, and reverting it reddens (P-A4) |
| `pins()`'s `gkept` say **`:2131-:2141`** | N grandparent pins | **N, plus a clause naming how many the skip stood aside for and which** | B.8 (11). R2 N7: the cite here used to read `:2038`, which is the `GRANDPARENT-ARTIFACT-BYTES` assert (`:2079` at this head) |
| **the released-ancestry record** | the PATH alone | **the path AND the ancestor's own entry**, so the skip can measure `lastSealedSha256` against the grandparent's pin | (P-A3) |
| `CHILD_SPECS` in four `today/test/` cells | ends `'S8'` | **ends `'S9'`** | the four suites themselves |
| the six `s9-*` mirrors' generation | SIXTH | **SEVENTH** | read by hand, cell by cell; see section 7 |
| **the released-ancestry reader's arity** (round 5) | TWO artifacts, first-writer-wins | **ONE, the parent** | (P-A9 a), and Astra's M17/M18 are the measurement that says the second decided nothing |
| **the ancestor release record's key count** (round 5) | unbounded, one field read | **exactly FOUR, all four read** | (P-A9 b), which measures a one-key, a five-key and a wrong-`sealedBy` record |
| **`release-from-seal.test.cjs`** (round 5) | 21 cells | **36 cells** | the suite itself, and the bar in section 8 |
| **the ten-suite bar** (round 5) | 130 | **145** | the bar in section 8, on the PC and on linux |

## 5. `--ci --package S8` AND `H3`, BEFORE AND AFTER

The refusal NAME is what the S8 preparation report reports, because a named
refusal is the expected pre-ruling state and the run never reaches a verdict
this round: `packages/S9.json` is on the WAIT list.

| when | runner | `--ci --package S8` | `--ci --package H3` |
|---|---|---|---|
| **BEFORE this lane's first edit**, measured at `da9f8683` in a detached scratch worktree (`node_modules` junctioned, NO private junction, worktree removed after) | `e31dd206...335e` | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 |
| at `afbf930b`, after H1 to H17 and before E fact 7 | `d0021d5c...ee38` | `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER`, exit 1 | `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER`, exit 1 |
| with the re-pins on disk and NOT yet committed | `d0021d5c...ee38` | `SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT`, exit 1 | `SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT`, exit 1 |
| at `3d143c30`, the first author's head, re-pins committed | `d0021d5c...ee38` | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 |
| **BEFORE the FIX ROUND's first edit**, measured in this worktree at `afcc251f` | `d0021d5c...ee38` | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 |
| after the fix-round hunks and before E fact 7 was redone | `efcdb700...70e2` | `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER`, exit 1 | not taken |
| after the R1 hunks, re-pins redone and committed | `efcdb700...70e2` | `SEALED-PROFILE-RECOMPUTATION`, exit 1 | `SEALED-PROFILE-RECOMPUTATION`, exit 1 |
| after the fix round's last edit (the H7 comment correction), re-pins redone LAST again and committed | `25ddc44c32d0d71b924cf62c2e0a8647697b6e77a55a91a132388217b6789ca6` | `SEALED-PROFILE-RECOMPUTATION`, exit 1 | `SEALED-PROFILE-RECOMPUTATION`, exit 1 |
| **AFTER FIX ROUND 3's last edit** (P-A1, P-A2, P-A3), re-pins redone LAST again and committed at `9514673` | **`32916e509df0e38e4cb464a4b30c871f880d11a849958c5d7e9d14d1e2961be3`** | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 |

| **BEFORE FIX ROUND 5's first edit**, measured in this worktree at `4e447ae6` | `32916e50...1be3` | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 |
| **AFTER FIX ROUND 5's last edit** (P-A8, P-A9, P-A10), re-pins redone LAST again and committed at `9999ee27` | **`316f86c541f109a5876f5ea8d0557164151585f4f5940ce8878c3bec02bee43e`** | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 |

**FIX ROUND 5 TOOK BOTH OF ITS OWN ROWS**, before the first edit and after
the last, and they are the same named refusal with the same exit code. That
is the whole claim: three hunks landed on the seal path, the runner's sha256
moved, the seven specs were re-pinned to it, and the two standing packages
refuse exactly what they refused before, by the same name.

**FIX ROUND 3 DID NOT RE-TAKE ITS OWN "BEFORE" ROW, and says so rather than
implying it did.** The state before this round's first edit is the row above
the last one - runner `25ddc44c...9ca6`, the seven specs re-pinned to it - and
it was taken twice already: by the second author, and independently by the
reviewer in THIS worktree at `ade31333` (R2 section 4). What round 3 measured
itself is the last row.

**FIX ROUND 3's two runs, in full, because this is X1 measured on the final
bytes.** Both observation lines read `runner
32916e509df0e38e4cb464a4b30c871f880d11a849958c5d7e9d14d1e2961be3
byte-identical on disk and in Git at HEAD`, `status=BRIEF-ACCEPTED`, `argv
file-first under 24 fixed root(s)`, and `5 byte-identity carrier(s) declared
SUPERSEDED under a PM line recorded by sha256 0c2d0db53471` (S8) and
`3746ff573af4` (H3) - **which is P-A1's own evidence at the run level: those
two ruling lines are `DECISIONS:527` and `:160`, they are read through the
STRENGTHENED terminal test on these runs, and both packages still resolve
their supersessions exactly as before.** Then the same named refusal at the
same exit code as at `da9f8683`: `SEALED-PROFILE-RECOMPUTATION`, with the
declared counts (224 product files for S8, 64 for H3; 25 and 10 children)
unmoved.

**The first row and the last row are the same refusal**, which is (X1) at the
run level: the runner grew a role and neither of these two packages notices.
The two middle rows are the expected staircase, each one named in the commit
that produced it, and each one is a refusal about the RE-PIN and not about
the mechanism.

`SEALED-PROFILE-RECOMPUTATION` is the honest state of this branch and not a
defect of this lane: the two carried lanes (S9-TODAY-CARRY, PASSPHRASE-
NORMALIZE) have moved bytes that S8's sealed artifact pins through
`executionPins`, and no `packages/*.json` declares those moves yet.

**ONE NUMBER IN THE OBSERVATION LINE MOVED, and it is H16's, by design.**
`B PACKAGE S8 SPEC OBSERVED ...` reads `under 24 fixed root(s)` where before
it read `under 20 fixed root(s)`. Nothing else in either observation line
differs but the runner sha and the spec sha. **Re-checked in the fix round**:
the observation lines at `efcdb700` are byte-identical to the ones at
`d0021d5c` except those two shas, `under 24 fixed root(s)` included, and the
final refusal is the same name at the same exit code for both packages.

## 6. WHERE THE SPEC AND THE RUNNER CANNOT BOTH BE RIGHT

Reported rather than bent. SEVEN now: the first author's five, plus (6) and
(7), which the fix round adds. The first two are corrections that already had
to be made for the hunks to land at all, and (6) is the same kind: what B.4
draws cannot be sealed.

**(1) B.4/H11 and B.5/H5 as written make `released` and `release` REQUIRED
keys, and that would break every artifact sealed before this role.** `keys()`
is an exact `deepEqual` of sorted key lists. A required `released` key would
make S8's own sealed artifact unreadable to the runner S8's spec names - and
E fact 7 re-points S8's spec at exactly these bytes, so the two halves of the
spec would refuse each other. **Both keys are OPTIONAL**, closed with the
freeze pattern the runner already uses for `authorizations.freeze`, and the
real closure is unmoved: `same(m, proposed(s, bound))` still refuses an
artifact that carries the block when the spec releases nothing, and refuses
one that omits it when the spec does. B.8 (9) asserts both directions and
(X1) measures the consequence.

**(2) E fact 3 names `rebuild/lanes/c/ui-port/` as a new `CHILD_ROOT`, and E
fact 4 makes it the one addition to `PUBLIC_TAIL_ROOTS`. That directory does
not exist on this branch.** C-UI-1 has not merged (`DECISIONS:531` blocks its
seal), and F7's last loop asserts of every child root that it "is a real
directory of this repository" - which is precisely the rule that stops a root
being added speculatively. Adding it now ships a red bar. **Both entries are
deferred to the single re-measure E.2 designs the round around.
`PUBLIC_TAIL_ROOTS` is UNCHANGED this round** and F8 needed no edit, which is
worth saying because F8 pins that list exactly and E fact 6 does not mention it.

**(3) E fact 3 omits `rebuild/lanes/c/s9-today-carry/`, and the measurement
says it needs a root. THE TICKET'S OWN QUESTION, ANSWERED: YES, IT NEEDS
ONE**, by the same rule the spec applied to `rebuild/lanes/c/p3-today-hotfix/`.
Measured on `rebuild/c-s9-today-carry`: the lane holds exactly one cell,
`plan-sentence.test.mjs`, and `rebuild.yml:306` gives it a CI home in the
SAME STEP as the hotfix cell - one `node --test` naming both files. A declared
child mirrors a CI step (every one of S8's twenty-five does), so the child
that runs the hotfix cell names this file in the same argv, and `childArgv()`
judges EVERY target against `CHILD_ROOTS`. Without this root that child is
refused `CHILD-ARGV-TARGET` on its second file, and the Y1 own-child
obligation becomes unreachable rather than merely unmet. **The two roots
stand or fall together.**

**(4) B.2 step 6's parent-pin membership check is CONDITIONAL in the runner,
and the spec states it unconditionally.** `releaseRuling()` `:1345` reads
`const pmap = bound && bound.acceptance && bound.acceptance.product;` and
guards the membership and pre-image asserts with `if (pmap)`. For a run with
no bound parent the two asserts at `:1346-:1350` are skipped. **Steps 1 to 5
and the child-argv disjointness still run**, so nothing can be released
without a RULED PM line on the chain branch naming this package and that
exact path; what is skipped is only "you cannot release what the parent never
sealed". It is bounded in practice - `envelope()` asserts
`bound && bound.decided` before any artifact is sealed - so this is a NOTE
for the PM's line-by-line review and not a STOP. If the PM wants it
unconditional, the honest shape is a refusal when `bound` is absent AND
something is declared released, rather than a silent skip.
**FIXED IN FIX ROUND 3, in exactly that shape, because the PM ruled it
(P-A2).** `releaseRuling()` `:1384-:1386` now refuses
`RELEASE-WITHOUT-A-BOUND-PARENT`, naming the declared paths, when a release is
declared and `bound.acceptance.product` is absent for any reason. A package
that releases nothing returns above the assert, so neither (X1) nor (X2)
moves. Red-first cell (P-A2); reverting the assert reddens that cell and
nothing else in the bar.

**(5) H17's say clause can NAME one more path than it COUNTS.** `greleased`
is incremented only inside the grandparent loop, so it counts paths that are
in the grandparent's maps and not in the parent's. The clause at `:2041`
lists `[...releasedByAncestry].filter(f => f is in the grandparent's maps)`,
which also includes a path the parent re-declared (B.7's re-seal), because
that path leaves the loop at the FIRST `continue`. The mismatch is reachable
only when some OTHER path is skipped as released in the same run, so the
clause is never emitted alone; it is cosmetic, it is in a `say` and not an
assert, and B.8 (12) already pins that a `released` block naming a path the
grandparent never pinned changes the output not at all. Named here because a
count and a list that disagree are exactly the kind of thing this design
refuses everywhere else. **FIXED IN THE FIX ROUND (R1 N8): the count and the
list are now the same array, collected at the `continue` itself, so they
cannot disagree.**

**(6) B.4 DRAWS `"rulingLine": 5xx` IN THE SEALED BLOCK, AND A SEALED
ARTIFACT CANNOT CARRY IT.** R1 BLOCKING-2, and this is the clearest place in
the round where the spec and a runner that seals cannot both be right.
`release.at` is the INDEX of the ruling line in `rebuild/DECISIONS.md`, read
off `CHAIN_REF` on every run; `envelope()` refuses on
`same(m, proposed(s, bound))`. An artifact carrying that index therefore
stops recomputing - `SEALED-PROFILE-RECOMPUTATION`, for ever, for S9 and for
the standing CI step once E fact 10 flips it - the first time any line is
inserted ABOVE the ruling, with no byte of the package having changed. It was
the ONLY value in the artifact recomputed from the live chain:
`parent.receiptLedgerLine`, `coverage.successors` and `coverage.supersessions`
are all spec-declared. **THE FIELD IS DROPPED.** `rulingLineSha256` stands
beside it and carries the same fact in the form r7 F4 chose for exactly this
reason: the line is LOCATED by its own bytes, not by its index, and the index
is still SAID on every run where a number that moves costs nothing.
The alternative the reviewer offered - have the spec DECLARE the number and
assert it - was weighed and not taken: it adds a required key to the release
block, a new refusal name, and a second place the same fact has to be
maintained, to buy a number no reader of the artifact needs. **If the PM
prefers the declared-and-asserted shape, it is a small hunk and this lane
will take it; the one shape that must not ship is the recomputed one.**
Measured both ways by the red-first cell (R1-B2).

**(7) B.5's disjointness guard, as the spec assigns it, names ONE route into
`executionPins` and `proposed()` has FIVE.** R1 BLOCKING-1. F.1 R2 states the
rule as a class ("proposed() would re-pin it through executionPins"), and the
first cut implemented the class for child argv targets only, which the
reviewer measured as ADMITTING a released path that is also the brief or the
carrier successor. The set is now built the way `proposed()` builds
`executionPins`. This is a widening of a guard and not a deviation from the
spec's intent, but it is named here because it changes what the runner
refuses and the PM reads every runner hunk this round.

## 7. THE OTHER FOUR THINGS THIS LANE OWNS

**E fact 5, the six mirrors.** Each of the six `s9-*` cells under
`rebuild/m4/workout/test/` is a BYTE-EXACT copy of its `s8-*` sibling plus
the spec's mechanical substitution set and nothing else. They were generated
by a throwaway script and then READ diff by diff, because a substitution does
not make a sentence true. FIVE sentences it would have made false were
corrected by hand: the generation paragraph of
`s9-supersede-source-carriers` (the ancestor list is a list of ANCESTORS, so
it reads "S6 the fourth, S7 the fifth, S8 the sixth and S9 the seventh"); its
`:162` contrast ("THE PARENT IS S8, NOT S7"); two chain sentences in
`s9-engine-files-differential` (`S6` -> `S7`); and the whole PRODUCT STORY of
`s9-supersede-writers-differential:27-34`, which mechanically would have told
S8's story. The last one was re-read against the new role: a released file is
role `released`, which is not `carried`, so it IS one of the files SUP-13
walks, and it does not live under `rebuild/engine/`, so the assertion is
unchanged and still true. All six files are pure ASCII.

**E fact 12, four of the five `CHILD_SPECS` cells.** `food.test.mjs`,
`machine-settings-ui.test.mjs`, `problem.test.mjs` and `setup.test.mjs` each
gain `'S9'` as the youngest, in the S8 comment's shape. NOT
`measure/test/boundary.test.mjs`: lane S9-PREP-B owns that file whole. One
clause was ADDED rather than mirrored, because the release changes what the
loop does: a released declaration carries `post: null`, and `declaredPost()`
takes a spec only when the post is a STRING, so a released file falls through
to the youngest package that still declares a real post for it. That is
REVIEW-R4 N7's correction, written where the loop is.

**E fact 6, F6/F6b/F7**, and the receipt cell in
`seal-tip-and-byte-identity.test.cjs` for B.8 row 4: a released path is in
NEITHER direction of the receipt, lane C editing it costs nothing, the pinned
file beside it still voids by name and by path, and a receipt written BEFORE
the release that still carries the path does not void either.

**E fact 7, the ancestor re-pins, LAST.** `tooling.runnerSha256` in
`packages/H3.json`, `S3`, `S4`, `S5`, `S6`, `S7` and `S8`, ONE byte range
each, `+1/-1` per file. **Neither spec's own product pin for the runner is
re-targeted:** `packages/S8.json:150` still carries
`"post": "e31dd206...335e"` for the runner, because that is the byte
M2-S8-REAL-SHAPE produced and sealed. `B-NTC`, `B1`, `B2`, `B3` and `B4` are
NOT re-pinned: they pin `4482bb8a...`, an earlier runner, and E fact 7 names
H3 and S3 to S8 only. **If a later fix round moves the runner, this step is
redone last again.**

**AND IT WAS, TWICE, IN THIS FIX ROUND.** The R1 hunks moved the runner to
`efcdb700...70e2` and the seven pins were redone; the H7 comment correction
moved it again to `25ddc44c...9ca6` and the seven pins were redone after
that. Both passes were `+1/-1` per file with every file's byte length
unchanged, and both printed `other occurrences of the old sha left alone: 0`
for all seven. The pins on this branch name `25ddc44c...9ca6`.

## 8. THE BAR, RUN ON THE PC AT THE HEAD OF THIS BRANCH

`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, `node --test
--test-reporter=tap`, each file on its own.

**RE-RUN WHOLE IN FIX ROUND 5** on this head's bytes, file by file. ONE
number moved and it is this round's own cells: `release-from-seal` from 21 to
36. Nothing else in the bar moved by one test or by one assertion. (Fix round
3's run, for the record, moved two: `release-from-seal` 17 to 21 and
`gate-supersession` 15 to 16.)

**Every file under `rebuild/lanes/b/tooling/test/` - 145 pass, 0 fail, 0
skipped, ten suites, every one exit 0:**

| suite | pass | fail |
|---|---|---|
| `child-diagnostic-tail` | 11 | 0 |
| `execution-targets` | 9 | 0 |
| `gate-supersession` | 16 | 0 |
| `parent-gate-closure-and-load-floor` | 14 | 0 |
| `parent-pin-shapes-and-spec-successors` | 9 | 0 |
| `pinned-unchanged-and-ruled-substitutions` | 17 | 0 |
| `product-phase-and-ledger` | 7 | 0 |
| **`release-from-seal`** | **36** | **0** |
| `seal-tip-and-byte-identity` | 17 | 0 |
| `successor-moves` | 9 | 0 |

**AND ON LINUX, at the PUSHED head `9999ee27`**, in a farm scratch worktree
(`/home/claude/farm/scratch/wt/s9a5-head`, the same include list, nothing
written back): the ten suites in one invocation, **145 pass, 0 fail, 0
skipped**, with `b-package.cjs` at `316f86c5...e43e` and
`release-from-seal.test.cjs` at `8567aa49...a351` on that machine, the same
two sha256s the PC ran. Both OSes, the same numbers.

**The six `s8-*` siblings: 16 pass, 0 fail over the five `*.test.cjs`
(3/3/3/4/3), and `s8-engine-files-differential.cjs` exit 0** ("27 tracked
`rebuild/engine` file(s) outside this package's declared product, all
byte-identical to the parent; 18 named and NOT ONE moved").

**The six `s9-*` cells: 0 pass / 1 fail each, exit 1, every one of them the
SAME load error - `ENOENT rebuild/lanes/b/tooling/packages/S9.json`.** Each
cell reads its own spec at module load, and `packages/S9.json` is on this
round's WAIT list: it needs the pre/post of every file C-UI-1 moves. **The S8
round had exactly this ordering** (`S8-PREP-AUTHOR-REPORT.md` section 0: the
six `s8-*` cells at `70b983a`, `packages/S8.json` at `c07d092`), so the cells
stand ready and go green with the spec, not before it.

**The four `CHILD_SPECS` suites:** `food` 57/0 exit 0;
`machine-settings-ui` 54/0 exit 0; `problem` 131/0 exit 0; **`setup` 156 pass
/ 1 fail, exit 1.**

THE ONE FAILURE IS PRE-EXISTING AND IS NOT THIS LANE'S EDIT.
`setup.test.mjs:2377` ("re-pin - every file the B-NTC package pins is
untouched by A4b, on disk") names three files:
`.github/workflows/rebuild.yml`, `today/test/adapter.test.mjs` and
`today/test/view.test.mjs`. Those are three of S9-TODAY-CARRY's FOUR
declarations (E fact 20, `DECISIONS:542` (D)): the lane is merged into this
branch and no `packages/*.json` declares its moves yet. MEASURED at the
parent commit with `CHILD_SPECS` still ending `'S8'`: the SAME 156 pass /
1 fail and the same three paths. The cell reads `B-NTC.json`'s `product` map
only and no `tooling.runnerSha256`, so E fact 7 cannot have touched it. It
goes green when S9 declares those four paths, which is what the cell exists
to require.

**`--ci --package S8` and `--ci --package H3`: section 5.**

## 9. WHAT I DID NOT DO, STATED SO IT IS NOT ASSUMED

The WAIT list is untouched: `packages/S9.json`, the needles, the
`acceptance-s9` artifact, the `--ci --package S9` walk, the standing CI step's
flip to S9 (E fact 10), the PACK-PIN and APPROVED-PIN literals, any
`design.test.cjs` hunk, the S9 brief, and the PM's token lines. No file
outside this ticket's owned list was edited: not `rebuild.yml`, not
`measure/test/boundary.test.mjs`, not `today/test/package.test.cjs`, nothing
under `rebuild/lanes/c/`, no product file, `DECISIONS.md` and
`lanes/STATUS.md` neither read for a line that does not exist nor written.

**No cell in this lane reads the real ledger for the `RELEASE-FROM-SEAL`
line**, because the PM writes it only after reviewing this grammar. Every
cell that needs a ruled line builds its OWN fixture ledger and its own Git
repository, the way `gate-supersession.test.cjs` does.

**No STOP condition of F.2 was reached.** No hunk lets a path leave the
sealed inventory without a ruled token line naming this package: `product()`
resolves `releaseRuling()` before the inventory walk, and `releaseRuling()`
requires a unique ` RULED` line on `CHAIN_REF` carrying a
`RELEASE-FROM-SEAL` token that names this `packageId` and that exact path.
F.2 STOP-2's amendment is honoured exactly: ONE `continue` at the
grandparent walk plus the say clause, `held()` untouched, the parent walk
untouched, `:1972` and `:1975` untouched.

## 10. R1 FINDINGS: FIXED OR DISPUTED

`S9-PREP-RUNNER-REVIEW-R1.md`, four BLOCKING and eleven notes. Every one is
answered here, and nothing was carried over on trust: the bar, the mutation
table and `--ci` at both ends were all re-taken on the fix round's bytes.

### BLOCKING

**BLOCKING-1 (the disjointness guard closes one of three doors) - FIXED,
and wider than the reviewer asked.** He counted three routes into
`executionPins`; `proposed()` has FIVE, because the runner itself and this
package's own spec file are pinned unconditionally two lines above the three
he named. `releaseRuling()` now builds the set the way `proposed()` builds
the map: runner, spec file, brief, carrier successor, argv targets. The argv
route keeps `RELEASE-PATH-IS-A-CHILD-ARGV-TARGET`, the name B.5 and F.1 R2
give it and the name B.8 (8) pins; the other four refuse
`RELEASE-PATH-IS-AN-EXECUTION-PIN-TARGET`, which names the path AND the
route, so the log says which door was open. The routes are checked
UNCONDITIONALLY even where `proposed()` pins the file only if it is on disk:
a spec that both releases a path and names it as its own brief is
contradictory whether or not the file exists yet. Red-first cell (R1-B1)
measures all four non-argv routes and re-measures the argv one as a control;
reverting the hunk alone turns that cell and only that cell red.

**BLOCKING-2 (`rulingLine` is a live line NUMBER) - FIXED by dropping the
field, and reported as deviation (6) from what B.4 draws.** Section 6 (6) has
the whole argument and the alternative that was weighed and not taken. The
reviewer's measurement is reproduced by cell (R1-B2), which inserts one line
ABOVE the ruling in the fixture ledger, commits it, and asserts that
`releaseRuling().at` really moved from 1 to 2 while
`JSON.stringify(proposed(s, b))` did not move at all. On the first author's
bytes that cell is red twice over: the entry's key set is five, and the
artifact stops recomputing.

**BLOCKING-3 (the RULED terminal test admits a line ending "NOT RULED") -
DISPUTED AS A CODE CHANGE, PUT TO THE PM AS A QUESTION, and the cell title
corrected.** The evidence for disputing it is the reviewer's own: the regex
is INHERITED from `supersessionRuling()`, it frees carriers through
`GATE-SUPERSESSION` on exactly the same test today, and this ticket requires
the mirror to be line for line. Strengthening one side only would leave the
chain with two ruling functions that disagree about what a ruled line is,
which is worse than the hole; strengthening both is a change to an accepted,
sealed mechanism that is not in this ticket, and F.2 says to report rather
than to widen. So:

- B.8 (6)'s title was narrowed to "a token line whose LAST WORD is not RULED
  frees nothing", which was what it then measured, and the cell carried the
  measured exception in its comment (round 3 put B.8's own wording back);
- step 3 of `releaseRuling()`'s own header stated the exception, named
  `supersessionRuling()` as carrying the same regex, and said the question
  was the PM's (round 3 rewrote that step to the closed rule);
- **THE QUESTION, for the PM, about BOTH functions:** should the terminal
  test require the clause separator before the word, so that a line whose
  last clause is prose ending in the word RULED cannot rule anything? If yes,
  it is one line in each of the two functions, one cell in each of two
  suites, and it moves the runner sha again, so E fact 7 is redone after it.

No cell in this branch asserts that the weak phrasing is ADMITTED; pinning
the hole as intended behaviour is the one thing that would make it permanent.

**ANSWERED IN FIX ROUND 3: THE PM RULED IT (P-A1), AND IT IS CLOSED.** The
ruling made the measurement its condition, and the measurement came first:
section 11.1. The rule is now the LAST clause rather than the last word, it
landed in BOTH functions in one hunk, and the two red-first cells are (P-A1)
in `release-from-seal.test.cjs` and (P-A1) in `gate-supersession.test.cjs`.
B.8 (6)'s title is B.8's own wording again. E fact 7 was redone after it, and
the runner sha in section 0's last row is the result.

**BLOCKING-4 (nine U+2014 in eight added comment lines) - FIXED.** All eight
lines rewritten with a colon, a comma or a semicolon. MEASURED over every
line this branch ADDS to every file it touches since `da9f8683`, 23 files:
**U+2013/U+2014 count 0.** The runner sha moved, so E fact 7 was redone LAST
again, which is section 7's standing instruction and section 5's last row.

### NOTES

**N1 (the `ui-port` deferral is right) - AGREED, nothing to change.** The
reviewer verified the rule that forces it independently.

**N2 (`s9-today-carry` does need a child root) - AGREED, and it is the
ticket's own measured question.** Section 6 (3) is unchanged.

**N3 (a released pin carrying a real `post` is caught only by `spec()` H4) -
AGREED, and left as it stands.** `spec()` always runs first and B.8 (1b)
pins the site. Adding a second assert in `product()` would be a second place
for one rule to live, which this runner avoids on purpose; the note is the
right record of it. The corrected cite is already in H13's comment.

**N4 (a released path DELETED from the working tree is admitted by
`product()`) - DISPUTED, with reasons, and NO assert added.** The reviewer
offered "one sentence in the report, or one `fs.existsSync` assert". The
sentence: **a release hands a file out of the sealed inventory, and this
runner then has no opinion about whether the file exists.** That is the
correct reading of `DECISIONS:536` and it is what the spec's silence means.
An existence assert would make the runner refuse a seal because lane C, who
now owns the file, deleted it - a thing the ruling explicitly permits them to
decide - and it would be a guard nobody specified, on the seal path, in a
fix round. The byte the seal stopped at survives regardless: in Git at the
ancestor's own commit, and literally in the block as `lastSealedSha256`.
If the PM wants deletion refused, that is a spec sentence first and a hunk
second.

**N5 (`RELEASE-CHAIN-REF-ABSENT` does not exist) - AGREED, unchanged.**
Inherited from `supersessionRuling()` and `parent()`, unreachable in CI
because `--ci` already reads `CHAIN_REF` for the parent artifact. Naming it
here only would be the same one-sided divergence BLOCKING-3 is disputed on.

**N6 (the release frees DESCENDANTS, not S9 itself) - AGREED, and it is a
caution for the S9 BUILD round.** Recorded here so it is not lost: **if any
ticket that seals INSIDE S9 moves a released path before S9's `sourceBase`,
S9 cannot seal**, because `held()` takes the `sourceBase` branch for any
DECLARED file and `held()` is what F.2 STOP-2 forbids amending. Today's
closed list is safe: neither carried lane declares `preview.css` or
`build.mjs`, and C-UI-1 is on the WAIT list.

**N7 (H17's comment gives a reason the measurement does not support) -
FIXED.** The comment now says what the reviewer measured: the `ga` half of
the union is a NO-OP on the reachable chain, because H10 has already kept the
path out of the parent's `product`, so a three-generation walk never reaches
it. The union is KEPT as defence in depth for an ancestor that carries both a
block and a pin for one path, and the comment says that is why.

**N8 (the author's own (4) and (5) are both real) - (5) FIXED, (4)
unchanged.** (5): H17's say clause counts and names the SAME ARRAY now,
collected at the `continue`. (4): the parent-pin membership check stays
guarded by `if (pmap)`, because `envelope()` requires `bound && bound.decided`
before any seal and steps 1 to 5 and the disjointness step run regardless.
The honest alternative is still written in section 6 (4) for the PM.

**N9 (three of the cells are not red-first) - AGREED, and the fix round's two
ARE.** (R1-B1) and (R1-B2) were committed failing at `c736b61` against the
unchanged runner, with the measured failure list in the commit message:
14 pass / 3 fail, the third being B.8 (9), which BLOCKING-2 moves.

**N10 (a duplicate member in the token's comma list is admitted silently) -
AGREED, unchanged.** `granted` is a Set and the reviewer could not turn it
into anything. Refusing a duplicate would be a new rule about the PM's
typing, not about the seal.

**N11 (3523 vs 3522 is a counting convention) - AGREED, FIXED in section 0**,
which now states `wc -l` throughout and says so. One number in BLOCKING-4's
own text does not reproduce and it changes nothing: the review says
`b-package.cjs` "already contains 293 such lines", and the measurement is
**263** at `da9f8683`, **271** at the reviewed head `3d143c30` (the eight
this lane added), and **263** again now. The delta is exactly eight in both
directions, which is the fact BLOCKING-4 turns on, and it also proves the
fix touched the eight added lines and no pre-existing one.

### ONE THING R1 DID NOT CATCH, FOUND AND FIXED IN THIS ROUND

**H7's comment carried a FALSE LINE COUNT.** It read "one line above the disk
hash and fifty-seven lines BELOW the role branch". MEASURED in the runner the
comment ships in, the gap is 69 lines, not 57: the number was taken in the
SPEC's numbering (B.5's `:1894` to `:1952`) and the hunks' own comments had
already moved it before the first commit landed. The comment now names the
ANCHORS - the role branch, the pre/post shape asserts and the change-role
assert - which cannot drift at all, and says in one clause why the number
went. "One line above the disk hash" was re-measured and is TRUE (`:2205` and
`:2206`). This moved the runner, so E fact 7 was redone LAST again after it.

### WHAT THE FIX ROUND DID NOT TOUCH

The WAIT list is still untouched, the owned-files fence is unchanged, and no
file outside the ticket's owned list was edited. The fix round touched TEN
files: `b-package.cjs`, `test/release-from-seal.test.cjs`, the seven
`packages/*.json` re-pins, and this report. It did NOT touch the six mirrors, the four
`CHILD_SPECS` cells, F6/F6b/F7 or the seal-tip suite, because no R1 finding
reaches them; their bar was re-run anyway and reproduces to the test.

## 11. FIX ROUND 3: THE PM'S FOUR RULINGS

The PM read every runner hunk line by line, accepted the mechanism (X1 and X2
hold, H10's block is an OBJECT keyed by path, `rulingLine` is rightly dropped,
`release` and `released` are optional and closed by the freeze pattern) and
ruled four things. Each is below with its own measurement. Nothing in this
round was done on the strength of an earlier round's numbers.

### 11.1 P-A1, AND THE MEASUREMENT CAME FIRST

The ruling was conditional: strengthen the RULED terminal test in BOTH ruling
functions **if and only if** every ruling line any spec under
`rebuild/lanes/b/tooling/packages/` cites by sha256 still passes the narrower
rule. A guard on the seal path is never strengthened in a way that voids a
standing seal, so the enumeration came before the hunk and it is recorded here
whatever it showed.

METHOD, on the PC, read-only: walk every `packages/*.json` for every field
whose name ends `lineSha256`, add the runner's own
`SUPERSESSION_STANDING_RULING`, read `rebuild/DECISIONS.md` out of Git at
`CHAIN_REF` (`refs/remotes/origin/rebuild/t2-client-core`, at `4e832c2a`),
hash every line the way the runner hashes it, and test each located line under
BOTH rules. **47 cited line-sha256 fields under `packages/`, plus the
runner's own `SUPERSESSION_STANDING_RULING`, 48 in all; every one located,
exactly one line each. EIGHT of them are RULING lines:**

*(Corrected in place in fix round 5. R3 N5 is right: this sentence said "48
cited line-sha256 fields" under a method that walks `packages/*.json`, and
the honest split is 47 there plus the runner's own constant. The table
beneath it always showed the split correctly.)*

| cite | line | clauses | last clause | old rule | new rule |
|---|---|---|---|---|---|
| `b-package.cjs` `SUPERSESSION_STANDING_RULING` | `DECISIONS:153` | 4 | `RULED` | PASS | **PASS** |
| `H3.json` `coverage.superseded.rulingLineSha256` | `DECISIONS:160` | 5 | `RULED` | PASS | **PASS** |
| `S3.json` same field | `DECISIONS:421` | 5 | `RULED` | PASS | **PASS** |
| `S4.json` same field | `DECISIONS:444` | 5 | `RULED` | PASS | **PASS** |
| `S5.json` same field | `DECISIONS:462` | 5 | `RULED` | PASS | **PASS** |
| `S6.json` same field | `DECISIONS:490` | 5 | `RULED` | PASS | **PASS** |
| `S7.json` same field | `DECISIONS:514` | 5 | `RULED` | PASS | **PASS** |
| `S8.json` same field | `DECISIONS:527` | 5 | `RULED` | PASS | **PASS** |

**ALL EIGHT STILL PASS, and across all 48 cited lines the old rule and the new
one disagree NOWHERE.** The other forty are brief-acceptance, theme and
authorization lines, which end in `ACCEPTED` or in prose and are judged by
other tests entirely; they fail the RULED test under both rules identically,
so nothing about them moves either. **The STOP did not fire, and the change
landed.** The measurement is reproducible from
`%TEMP%\s9a-measure-ruled.cjs`, a throwaway that is not committed; it reads
and prints nothing but line numbers, clause counts and the last clause.

THE RULE, in one sentence: the line's LAST clause, split on the ledger's own
`U+00B7` separator and trimmed, is EXACTLY the word `RULED`. It is ONE
function, `ruledTerminal()` at `:1012-:1013`, called from
`supersessionRuling()` `:1298` and `releaseRuling()` `:1360`, so the two can
never drift apart again; that they carried the same rule in two places is how
this hole came to exist on both sides at once.

### 11.2 THE THREE NEW HUNKS, EACH RED FIRST

Red first is literal here as in every round of this lane. Commit `0d9cdeb`
carries the cells alone, against the UNCHANGED runner
`25ddc44c...9ca6`, with the measured failure list in its message:
`release-from-seal` **18 pass / 3 fail**, `gate-supersession` **15 pass / 1
fail**. Commit `c18fa1b` carries the runner hunks and takes both suites to
**21/0** and **16/0**.

| cell | what it measured on the unchanged runner |
|---|---|
| (P-A1) release half | `Missing expected exception /RELEASE-RULING-IS-NOT-A-RULED-LINE/` - the line ending "this is NOT RULED" frees both paths, R2 N1 reproduced a third time |
| (P-A1) supersession half | `Missing expected exception /GATE-SUPERSESSION-RULING-IS-NOT-A-RULED-LINE/` - the same line retires five carriers |
| (P-A2) | `Missing expected exception /RELEASE-WITHOUT-A-BOUND-PARENT/` |
| (P-A3) | `Missing expected exception /ANCESTOR-RELEASED-BLOCK-IS-NOT-THE-GRANDPARENT-PIN/` - R2's NEW-1 fixture, a block naming a path at a sha the grandparent never sealed, ADMITTED |
| (P-A4) | PASSES from the start, by design: it PINS H13's count by reading the runner's text and drives no hunk. It is in the same commit because the evidence it supplies is what R2 BLOCKING-1 asked for |

### 11.3 THE MUTATION TABLE FOR EVERY CLAUSE THIS ROUND TOUCHED OR ADDED

My own harness (`%TEMP%\s9a-r3-mut.cjs`, throwaway, not committed): one revert
at a time from the head bytes, **all ten lane-B tooling suites** run against
each, the original restored in a `finally`, the sha re-checked at the end. It
printed `BASE sha 32916e509df0` and `RESTORED sha 32916e509df0 bytes equal:
true`. BASE: ten suites, **130 pass / 0 fail, NOTHING RED ANYWHERE**.

| revert | cells that go red, across the WHOLE bar | the refusal it prints |
|---|---|---|
| P-A1, the release half (`:1360`) | `release-from-seal` (P-A1) | `Missing expected exception`: the "NOT RULED" line frees both paths again |
| P-A1, the supersession half (`:1298`) | `gate-supersession` (P-A1) | `Missing expected exception`: the same line retires five carriers again |
| P-A1, `ruledTerminal()` itself (`:1013`) | `release-from-seal` (P-A1) AND `gate-supersession` (P-A1) | both of the above at once, which is the point of there being one function |
| P-A2, the bound-parent assert (`:1384`) | `release-from-seal` (P-A2) | `Missing expected exception`: step 6 is skipped in silence again |
| P-A3, the grandparent-pin assert (`:2120`) | `release-from-seal` (P-A3) | `Missing expected exception`: R2's NEW-1 block is believed again |
| P-A3, the entry the ancestry carries (`:2068`) | `release-from-seal` **B.8 (11), B.8 (12) AND (P-A3)** | `ANCESTOR-RELEASED-BLOCK-IS-NOT-THE-GRANDPARENT-PIN rebuild/m3/w7-preview/today/preview.css` - with no entry to measure, even the HONEST skip refuses, so the two halves of P-A3 are separately observed and neither is carried by the other |
| **H13's COUNT** (`:3574`) | **`release-from-seal` (P-A4)** | `the AUTHORIZED STEP re-verify counts the inventory minus the released paths` |

**THE LAST ROW IS R2 BLOCKING-1, ANSWERED BY MEASUREMENT.** At `ade31333`
that revert printed `NOTHING RED ANYWHERE`; at this head it reddens (P-A4).
The hunk did not change. What changed is that the evidence for it is now a
cell rather than a sentence in this report.

Every clause this round touched or added goes red when reverted alone. No
hunk of this round is a no-op, and no revert of this round's hunks reddens a
cell that is not about it.

### 11.4 THE BAR AT THIS HEAD

`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, each file on its own,
in `%TEMP%\earned-s9a`. The ten tooling suites were run TWICE: once at
`c18fa1b`, before the E fact 7 re-pins, and again at `9514673` after them,
with the same 130/0 both times, so nothing in the bar depends on the seven
re-pinned shas and nothing in this round is green only before them.

- **Every file under `rebuild/lanes/b/tooling/test/`: ten suites, 130 pass /
  0 fail, every one exit 0.** Section 8 carries the per-suite table. Only
  this round's own two suites moved: 17 to 21, and 15 to 16.
- **The six `s8-*` siblings: 16 pass / 0 fail** over the five `*.test.cjs`
  (3/3/3/4/3), and `s8-engine-files-differential.cjs` exit 0. Unchanged by
  this round, and re-run rather than assumed.
- **The six `s9-*` mirrors: 0 pass / 1 fail each, exit 1**, every one the
  same `ENOENT ...\packages\S9.json`. WAIT list, as in R2 and in the S8
  round before it.
- **The four `CHILD_SPECS` suites:** `food` 57/0, `machine-settings-ui` 54/0,
  `problem` 131/0, all exit 0; **`setup` 156 pass / 1 fail, exit 1**, at
  `not ok 151 - re-pin - every file the B-NTC package pins is untouched by
  A4b, on disk`. **PRE-EXISTING**, proved at the branch base by two rounds
  now (section 8, and R2 section 4, which rebuilt a worktree at `da9f8683`
  to take it); this round changed neither the cell nor anything it reads.
- **`--ci --package S8` and `--ci --package H3`: section 5's last row.**

### 11.5 R2 FINDINGS AND THE PM'S FINAL READ: FIXED OR DISPUTED

| R2 | verdict | what I did, and what I measured |
|---|---|---|
| **BLOCKING-1** H13's count is pinned by nothing and the report says B.8 (10) pins it | **FIXED, by the PM's option (a) plus a cell** | Both halves were true. The ordinal table's cite (`:3458`) named a `for (const gate of R.GATES)` line and its "who pins it" named a cell that cannot reach the sentence. Section 4's row now names the site (`:3573-:3577`), names the class (H4/H5, unreachable from any lane-B cell, because the say stands past the main-sequence delimiter), and names (P-A4) as what pins it. Option (b), the fixture package directory, is NOT taken: it would move the runner for nothing this round needs, and the PM's ruling says to pin by reading |
| **N1** the NOT RULED hole, still open, the PM to rule | **CLOSED by the PM's P-A1** | Section 11.1. Measured first, landed in both functions, red first in both suites |
| **N2** H17 skips by path name alone; one line would narrow it | **ADOPTED as P-A3** | `releasedAncestry()` carries the entry; the skip asserts the block's `lastSealedSha256` is the grandparent's own pin. R2's NEW-1 fixture is the red-first cell, and the reviewer's own reading stands: this is defence in depth, not a reachable hole |
| **N3** H4's rule has two sites it cannot be reached from | **AGREED, no change, and the PM accepted it as built** | A second assert in `product()` would put one rule in two places. B.8 (1b) pins the site; `spec()` always runs first |
| **N4** a released path DELETED from the working tree is admitted | **DISPUTE UPHELD by the reviewer and by the PM** | It is now one of the sentences for the S9 brief, section 11.6. No code change: an existence assert would refuse a seal because the lane that now owns the file deleted it |
| **N5** `RELEASE-CHAIN-REF-ABSENT` does not exist | **AGREED, no change, and it is a brief sentence** | Unnamed on BOTH sides of the mirror, exactly as in `supersessionRuling()` and `parent()`; unreachable in CI because `parent()` reads the same ref first. Naming it on one side only is the divergence P-A1 exists to prevent |
| **N6** the `ui-port` deferral is forced, and the BASIS for printing its output is owed | **AGREED; the PM has now stated the basis** | Section 11.6 carries it: `ui-port` joins `CHILD_ROOTS` and `PUBLIC_TAIL_ROOTS` at the single re-measure, and the basis is that those cells read fixtures and the public design pack only, and no owner data |
| **N7** two cites in the ordinal table point at code they do not name | **FIXED** | Both corrected, and both re-taken at THIS head rather than at the head R2 read: the re-verify count is `:3573-:3577` and the `gkept` say is `:2131-:2141`. Section 1's whole table was re-taken with them |
| **N8** the H7 revert differs by one cell, and the bucket alone reddens five suites | **AGREED, recorded** | I did not re-take it: H7 did not move this round, and the reviewer's measurement is the better one because it separates the two halves. Section 2's row stands with his note beside it |
| **N9** the mutation table understates H13's coverage | **AGREED, recorded in section 2** | Same reason: the hunk did not move, and his numbers are the ones taken against the whole bar |
| **N10** the six mirrors re-derived, eight hand-corrected regions not five | **AGREED; a counting convention** | Untouched this round |
| **N11** the freeze pattern's closure holds in both directions | AGREED, nothing to change | |
| **N12** nothing pins the DECISION that S9's four roots are not tail-public | **AGREED, recorded** | Precedent, not regression: S7's and S8's single additions were not added to `PUBLIC_TAIL_ROOTS` either. It rests on `PUBLIC_TAIL_ROOTS.length === 6` and on nothing that names them, and that sentence belongs in the S9 brief |
| **R2 section 9's "what I did not verify"** | unchanged by this round | F.1 R5's residual end to end, anything that seals, `packages/S9.json`, GitHub CI on both operating systems for this head, and the real `RELEASE-FROM-SEAL` line: all still open, all still outside this ticket |

### 11.6 FOR THE S9 BRIEF: the sentences, no code

These are the PM's, written down here so they survive into the brief. None of
them is a hunk, and none of them is a question.

1. **A released path DELETED from the working tree is ADMITTED, and that is
   correct.** A release hands the file OUT of the sealed inventory, and the
   runner then has no opinion about whether it exists. An existence assert
   would refuse a seal because the lane that now owns the file deleted it.
   The spec was SILENT rather than agreeing (B.7 says what a re-seal looks
   like and nothing about a deletion), so the sentence belongs in B.7 or D.
   R2 N4, the dispute upheld.
2. **A missing chain ref inside `releaseRuling()` is UNNAMED, exactly as it
   is in `supersessionRuling()` and in `parent()`, and it is unreachable in
   CI** because `parent()` reads the same ref before `releaseRuling()` is
   ever called. Naming it on one side of a line-for-line mirror is the
   divergence P-A1 exists to prevent. R2 N5.
3. **`rebuild/lanes/c/ui-port/` joins `CHILD_ROOTS` and `PUBLIC_TAIL_ROOTS`
   at the single re-measure**, not before: F7 asserts every child root is a
   real directory and F8 asserts every tail root is a child root, so adding
   either today ships a red bar. **THE BASIS for printing that suite's
   output**, which R2 N6 asked for in writing before the entry lands: those
   cells read FIXTURES and the PUBLIC design pack only, and no owner data.
   R2 N6 and N12.
4. **If any ticket sealed inside S9 moves a released path before S9's
   `sourceBase`, S9 CANNOT SEAL**, because `held()` takes the `sourceBase`
   branch for any file this package declares, and a released path is
   declared. The release frees the DESCENDANTS of S9, not S9 itself. This is
   the first author's R1 N6 caution, re-measured by R2 as
   `G1 :: REFUSED :: PARENT-PIN-BROKEN-AT-SOURCEBASE preview.css` against
   `G1b :: ADMITTED`, and it is a sequencing fact the S9 build round has to
   know before it starts.
5. **The four new child roots' tail policy rests on
   `PUBLIC_TAIL_ROOTS.length === 6` and on nothing that names them** (R2
   N12). That is precedent - S7's and S8's single additions were not
   tail-public either - and not a regression, but it is a decision no cell
   states, and the brief is where it should be stated.

### 11.7 WHERE THE SPEC AND THE RUNNER CANNOT BOTH BE RIGHT: (8), THIS ROUND

**(8) F.2 STOP-2, AS AMENDED, ADMITS TWO CHANGES INSIDE `pins()` AND P-A3 IS
A THIRD.** STOP-2 reads: "`pins()` is admitted for H17 and for H17 only: ONE
`continue` ... One further change inside `pins()` is admitted and it asserts
nothing: the terminal `say` ... **Any OTHER change to `pins()` stops the
round.**" P-A3 adds an ASSERT inside `pins()`, at the H17 skip. I landed it
and I am naming it rather than letting it pass as an author's judgement:

- the PM's P-A3 ruling names exactly this assert, at exactly this site, with
  exactly this comparison (`lastSealedSha256` against `parentPin` of the
  grandparent entry), so the change is the PM's and not mine;
- STOP-2 exists to stop an AUTHOR moving the seal's own walk to make a design
  work. This assert moves nothing the walk did before: every path not named
  in an ancestor `released` block still gets both of `held()`'s asserts, the
  parent walk is untouched, `held()` is untouched, and the only paths that
  reach the new line are the ones H17's `continue` was already skipping;
- it NARROWS rather than widens: the set of paths that leave the walk
  unchecked gets smaller, never larger.

If the PM reads STOP-2 more strictly than I do, the revert is one `assert`
and one map-versus-set in `releasedAncestry()`, and (P-A3) is the cell that
would go red. **It is his call and I have not treated the ruling as making
STOP-2 disappear.**

### 11.8 E FACT 7, REDONE LAST AGAIN

The runner moved for P-A1, P-A2 and P-A3, so the seven ancestor re-pins were
redone AFTER the last runner byte, as section 7's standing instruction
requires. **The final runner sha256 is
`32916e509df0e38e4cb464a4b30c871f880d11a849958c5d7e9d14d1e2961be3`**
(3638 lines by `wc -l`), and it stands in `tooling.runnerSha256` and nowhere
else in `packages/H3.json`, `S3`, `S4`, `S5`, `S6`, `S7` and `S8`.
`packages/S8.json` still carries `e31dd206...335e` in its own PRODUCT post for
the runner, which is correct and which E fact 7 does not re-target.

### 11.9 WHAT FIX ROUND 3 DID NOT TOUCH

The WAIT list is untouched: `packages/S9.json`, the needles, the
`acceptance-s9` artifact, the `--ci --package S9` walk, the standing CI step's
flip to S9, the PACK-PIN and APPROVED-PIN literals, any `design.test.cjs`
hunk, the S9 brief, and the PM's token lines. No file outside the ticket's
owned list was edited: measured, not asserted, with
`git diff --name-only aa42ded`, **ELEVEN files and every one on the list**,
and over every line THAT round ADDS, **611 of them, with 71 deleted over the
eleven files**, **U+2013/U+2014 count 0**. *(Corrected in place in fix round
5: this sentence said 583, and R3 N5 measured 611 added and 71 deleted. The
substantive claim, zero em dashes and zero en dashes over every added line,
is confirmed and is unchanged.)*
This round touched: `b-package.cjs`,
`test/release-from-seal.test.cjs`, `test/gate-supersession.test.cjs`, the
seven `packages/*.json` re-pins, and this report. It did NOT touch the six
mirrors, the four `CHILD_SPECS` cells, F6/F6b/F7 or the seal-tip suite; their
bar was re-run anyway and reproduces to the test. Nothing sealed, no receipt
written, no artifact written, no `--full` run, and no cell in this lane reads
the real ledger for a `RELEASE-FROM-SEAL` line that does not exist yet.

## 12. ASTRA'S BLIND REVIEW: FIXED, FINDING BY FINDING

The review is `rebuild/lanes/astra/reviews/S9-PREP-RUNNER-BLIND-REVIEW.md` on
`rebuild/r-astra-s9a-runner` at `3c02b072`, written BLIND against
`4e447ae68ecc517e5031b3ebc737938371f3cee3` and recorded before she opened
R1, R2, R3 or this report. VERDICT: REJECT. I read it whole, and then every
function it names, before I wrote a line.

**What I want on the record before the table.** Three Claude reviews and the
PM's own line-by-line read of every hunk passed these bytes, and two of the
four findings are integrity defects with an exact reproduction each. Nothing
in the rest of this report should be read as sound because it was accepted.
Section 12.6 says what I did NOT close.

### 12.0 The measurement that had to come first

P-A10 lands for EVERY package, so it landed only after a measurement, exactly
as P-A1 did. Run in this worktree at `4e447ae6`, BEFORE the first edit of this
round, over every path-valued string in every
`rebuild/lanes/b/tooling/packages/*.json` and every
`rebuild/m4/spec/acceptance-*.json`:

```
S9A-P-A10 MEASUREMENT
files read              : 22
GUARDED path strings    : 2890
broad path-like strings : 3366
non-canonical (GUARDED) : 0
non-canonical (broad)   : 0
```

The GUARDED set is exactly the fields the new rule reads: every product key,
`brief.file`, `carrierSuccessor.file` and `.parent` and its `witnessPins`
keys, every successor carrier's `successor` and `original`, every
substitution's `original`, and every child argv target, plus every `product`
and `executionPins` key of the ten accepted artifacts. The broad scan is
every string anywhere in those files that contains a `/` and no whitespace.
**Not one standing spelling is refused by the new rule**, so the guard can
land without voiding a standing seal, and if ONE had been refused this round
would have STOPPED instead. The PM's own pass counted 3431 path-like strings
in 35 files; the two scans use different heuristics and different file sets
and both found zero. The harness is `%TEMP%\s9a5-canon-measure.cjs`, a
throwaway, never committed.

### 12.1 F1, BLOCKING: `__proto__` disappears from both output maps

**CONFIRMED, and it is a regression H10 introduced.** `m[k] = v` is not
"create an own entry": for `k === '__proto__'` it runs the accessor
`Object.prototype` carries and sets the object's PROTOTYPE. `JSON.parse`
yields `"__proto__"` as an ORDINARY OWN KEY, so a spec can declare a file of
that name, and the runner at `da9f8683` wrote `product: s.product` by
reference and KEPT it. H10 replaced the reference with an assignment loop, so
the pin left the artifact in silence: `product()` counted it, the say named
it, the sealed bytes did not have it. Astra's measurement:
`oldHas=true; newHas=false; prototypeRole=carried`. The released half is
worse, because that block is the permanent record of what the seal handed
out: her sibling case admitted the grant and wrote
`{"granted":["__proto__"],"product":{},"released":{},"releasedKeys":[]}`.

**FIX: H18.** Both maps are built with `Object.fromEntries`, which defines
every pair with `CreateDataProperty`, so every own key of the spec becomes an
own entry and NO KEY IS SPECIAL. A `if (file !== '__proto__')` guard would be
a second rule for one fact and is exactly the shape Astra's M21 shows a
reader cannot see; (P-A8 a) and (P-A8 b) would both stay green under it,
because they name all five keys and assert the whole key list rather than one
of them.

**RED FIRST**, measured on the PC at `4e447ae6`: (P-A8 a) and (P-A8 b) fail.
Each asserts the own-key round trip for `__proto__`, `constructor`,
`toString`, `hasOwnProperty` and `valueOf`, in the CARRIED role and in the
RELEASED role, through the real `proposed()` and through
`JSON.parse(JSON.stringify(...))`, which is what is actually sealed.

**THE NO-RELEASE COMPARISON**, which is the other half of the ruling, is
measured three ways: (P-A8 c) builds the old construction and the new one
over the REAL `packages/S8.json` and `packages/H3.json` product maps and
compares the serialized bytes; it also runs the real `proposed()` over a spec
with no release block and compares that; (X1) compares the whole artifact key
set against S8's own sealed artifact, 21 keys in its order and no
twenty-second; and `--ci --package S8` and `H3` print the same named refusal
on the final bytes (section 5).

**WHY ORDER DOES NOT MOVE.** `Object.fromEntries` preserves the order
`Object.entries` gives, which is the order the old loop assigned in, so the
JSON bytes of a no-release artifact are byte for byte the ones the old loop
produced. `Object.entries` and object spread both create own properties too;
the per-key assignment is the ONE construction that does not, which is why
the fixtures build their inputs through `JSON.parse` and not through it.

### 12.2 F2, BLOCKING: `./` aliases evade the execution-pin collision guard

**CONFIRMED.** The guard R1 BLOCKING-1 added compares SPELLINGS. Astra's
input: `f = rebuild/m3/w7-preview/today/preview.css`, `product[f]` declared
role `"released"` at the parent pin, `brief.file = "./" + f`. Measured:
`spec=ADMITTED; releasedKeys=[f]; executionPin=./f; envelope=PENDING;
allExecutionPinsVerifiedInGitAndDisk=true`, the last of those through the
real `L.checkSources` over ALL proposed execution pins. Change `f` and the
next generation refuses `PARENT-PIN-BROKEN ./<f>` - through the PARENT walk,
which has no skip and must not get one. The artifact released `f` and pinned
the same file through `./f`.

**FIX: H21 and H22.** ONE CANONICAL REPO-RELATIVE SPELLING AT ADMISSION, in
`spec()`, for every path the release mechanism compares. No leading slash, no
backslash, no empty segment, no `.` or `..` segment, no trailing slash.
Anything else refuses `PATH-IS-NOT-CANONICAL` with the PLACE and the PATH in
the message.

**IT IS A REFUSAL AND NEVER A REWRITE**, which the PM ruled in terms.
Normalising `./x` into `x` would hand the ledger token's authority to a
spelling the PM did not name, which is the failure being closed, spelled
backwards. `canonicalPath()` has no normalising branch to delete.

**RED FIRST**: (P-A10 a) and (P-A10 b) fail at `4e447ae6`. Their rows: the
`./` witness exactly as Astra built it, an interior `/./`, an `x/../a.css`,
a backslash, a leading slash, a trailing slash, an empty segment, a bare `.`
and the empty spelling, each refused by name with the place named; plus the
carrier successor held to the same rule and its canonical spelling admitted,
so this is a rule about spelling and not a refusal of a field.

**(P-A10 a) ALSO MEASURES THE THING THAT IS NOT FIXED AND DOES NOT NEED TO
BE.** On the runner as it stands, `releaseRuling()`'s collision guard still
ADMITS the alias - `assert.doesNotThrow` over the real function - because it
compares two spellings to each other and that is all it can do. The cell
measures it so that the `spec()` check cannot later be dropped on the
argument that the guard already covers it. Astra's Windows controls
(backslash, uppercase) resolve on disk and fail in Git; that is inconsistent
admission rather than a successful seal, and it is refused here for the same
reason.

### 12.3 F3, ROBUSTNESS: ancestor release metadata trusted by hash alone

**CONFIRMED.** P-A3 asked ONE question of the record - does its
`lastSealedSha256` match the pin - so Astra stood a grandparent pin aside
with `{lastSealedSha256:H}`, and again with
`{role:"carried",lastSealedSha256:H,sealedBy:"M2-UNRELATED",
rulingLineSha256:"0".repeat(64),extra:true}`, and both printed
`plus 2 skipped as released by an ancestor artifact's released block`. The
first record identifies no release; the second says carried. She also
measured a same-hash EXECUTION-ONLY grandparent pin being skipped, and a
grandparent's own contradictory product-plus-released entry exempting its own
product pin.

**FIX: H19 and H20**, the PM's ruling, which REPLACES P-A6 of `:567`.

(a) `releasedAncestry()` reads ONLY the parent artifact. Astra's M17 and M18
each left all ten suites green, which is the measurement that the grandparent
half decided nothing reachable; her self-release case is the measurement that
it COULD decide something wrong. A branch that decides nothing reachable and
can decide something wrong is surface, not defence in depth. The comment that
used to justify it is gone with it.

(b) An entry stands a pin aside only as a CLOSED FOUR-KEY RECORD: `role`
exactly `"released"`, `lastSealedSha256` and `rulingLineSha256` each 64
LOWERCASE hex, and `sealedBy` equal to the GRANDPARENT's `packageId`. That
last one is the load-bearing clause: it is the package the parent was bound
to when it released the path, and therefore the only package whose seal the
record can be describing.

(c) The path must be an OWN KEY of the grandparent's PRODUCT map, and
`lastSealedSha256` must equal THAT product pin. A release hands a path out of
the PRODUCT inventory; an execution pin exists because a declared child ran
the file and is not a seal a package can be released from. The hash is now
compared against `ga.product[file]` rather than against whichever of the two
maps the walk happened to win.

Refusals, each naming the path:
`ANCESTOR-RELEASED-BLOCK-IS-NOT-A-CLOSED-RELEASE-RECORD`,
`ANCESTOR-RELEASED-BLOCK-IS-NOT-A-GRANDPARENT-PRODUCT-PIN`, and P-A3's
`ANCESTOR-RELEASED-BLOCK-IS-NOT-THE-GRANDPARENT-PIN` narrowed to the product
pin. **F.2 STOP-2 is read as amended by this ruling for exactly these lines
of `pins()`**, which is the PM's own wording.

**RED FIRST**: (P-A9 a), (P-A9 b), (P-A9 c) and (P-A3) fail at `4e447ae6`.
(P-A9 b) has six rows - the one-key entry, the `carried`-with-an-extra-key
record, a wrong `sealedBy`, a ruling hash that is not a hash, an UPPERCASE
`lastSealedSha256` and an otherwise honest five-key record - and every one of
them is refused by name with the path in the message.

**(P-A3)'s SHAPELESS ROW MOVED, and it is named here rather than left for a
reviewer to find.** `{role:'released', sealedBy:'M2-S8-FIXTURE'}` used to
refuse `...-IS-NOT-THE-GRANDPARENT-PIN`, because `block.lastSealedSha256` was
`undefined` and `undefined !== <hash>`. It now refuses one assert earlier,
`...-IS-NOT-A-CLOSED-RELEASE-RECORD`, which is the honest name for it. The
row is kept, pointing at the new name, so the two refusals are never confused
for one another. This is the ONE cell of the twelve whose expectation this
round changed, and it changed because the ruling changed what the runner
says, not to make anything green.

**THE TWO HONEST CONTROLS ARE UNMOVED.** B.8 (11) still skips two and still
says so in the `gkept` clause; B.8 (12) is still a no-op over a path no
ancestor pinned. (P-A9 a) adds a third: the same honest record standing in
the GRANDPARENT alone now decides nothing, and the released file's own pin
refuses `GRANDPARENT-PIN-BROKEN`.

### 12.4 F4, TEST GAP: live checks could be disabled with all ten suites green

**CONFIRMED, and it was already named as this report's weakest row.** Section
2's "THE WEAKEST ROW, named as such" admitted that H4 and H5 live inside
`spec()`, which no lane-B cell could call, and that B.8 (1b) pins both SITES
by READING THE RUNNER'S TEXT. Astra measured what that costs: M08 prefixes
`spec()`'s release-block condition with `false &&`, M09 prefixes the
post-null assert with `if (false)`, and each leaves `# tests 130; # pass 130;
# fail 0`. A source string is not an execution. That paragraph ended "A
reviewer who wants better evidence here would have to build a fixture package
directory, and that is a fair thing to ask for." Astra asked for it and
proved it could be built.

**FIX: THE SPEC-PHASE STAGE**, R2 BLOCKING-1's option (b), declined by the PM
at `:567` and ORDERED at `:572` in the bounded form Astra proved. It is a
SECOND scratch tree and Git repository inside
`release-from-seal.test.cjs`, in which `spec()` is executed against a
canonical, committed synthetic `packages/S8.json`. The runner is copied
VERBATIM - not one constant is re-pointed, because `spec()` reads no ledger
and no chain ref - so the stage's refusals are the runner's own. Each variant
is written AND COMMITTED before `spec()` runs, because `spec()` holds the
package file to its bytes on disk and to its bytes in Git at HEAD. No main
sequence, no child spawned, no seal, no receipt, no artifact written, no real
package and no ledger of record read.

**THE ROWS THAT KILL, each alone:**

| Astra | what it changes | what now goes red |
|---|---|---|
| M01 | the grant's package id by `startsWith` instead of `===` | (M01): a token for `M2-S9` does not free a path of `M2-S9-UI-PINS` |
| M05 | `file in pmap` instead of `Object.hasOwn(pmap, file)` | (M05): a path named `toString` is `in` the map and is a pin of nothing |
| M06 | `hits.length >= 1` instead of `=== 1` | (M06): two ledger lines hashing alike refuse; the row is in the ten-suite bar now, which R1's was not |
| M08 | `if (false && Object.hasOwn(s,'release')...)` | (M08): a release block with an extra key refuses THROUGH `spec()` |
| M09 | `if (false)` in front of the post-null assert | (M09): a released pin with a post-image refuses THROUGH `spec()` |
| M21 | any special case for any key in the product map | (P-A8 a) and (P-A8 b), which name all five keys and assert the whole list |
| M23 | `/RELEASE-FROM-SEAL` instead of `/^RELEASE-FROM-SEAL` | (M23): a token that ENDS a clause it does not BEGIN frees nothing |

**WHY M23 NEEDED A NEW LINE.** The five wrapped lines r10b N1 carried all
have text AFTER the path list, so the closing `$` refused them whether the
opening `^` stood or not. `MID_CLAUSE_LINE` puts the token at the END of a
clause it does not begin, which is the one shape only the anchor refuses.

**M17 AND M18 ARE GONE**, not killed: P-A9 (a) removed the construct each of
them mutated. The harness reports them as NOT APPLICABLE AT THIS HEAD with
the reason, rather than silently dropping two rows.

### 12.5 Astra's 24-row table, re-run at this head, AS MEASURED

Section 2 carries it, re-run whole on the final bytes with the full ten-suite
bar behind every row.

### 12.6 What this round did NOT close, stated so it is not assumed

- **The execution-pin collision guard still compares spellings.** It is
  correct now only because admission guarantees one spelling. (P-A10 a)
  measures that, so the guarantee cannot be removed in silence.
- **`spec()` is exercised, not covered.** The stage runs `spec()` end to end
  for the release block's key closure, the released post-image assert and the
  canonical rule. The other forty-odd asserts in `spec()` are still measured
  only by the packages that run through them, and a reviewer who wants a
  fixture package per assert would be asking for something real.
- **`canonicalSpecPaths()` does not walk `witnessPins`, the substitutions'
  `original`, or `artifact.file`/`artifact.review`.** Those were MEASURED
  canonical in 12.0 and are not compared by the release mechanism, so the
  guard is the narrow one the ruling names. Widening it is safe by that
  measurement and is not done on my own authority.
- **No `--full`, no seal, no acceptance receipt, no artifact written, no
  generator, no real S9 package, no hosted CI verdict.** The WAIT list is
  untouched.
- **The six `s9-*` mirrors still fail their load** on `ENOENT
  packages/S9.json`, and `setup.test.mjs` still carries its one pre-existing
  failure. Both are unchanged from fix round 3 and both are section 8.

### 12.7 Where this round touched a STOP condition, and how it committed

**F.2 STOP-2 IS TOUCHED, BY THE PM'S OWN WORDS.** STOP-2 admits `pins()` for
H17 and for H17 only, "ONE `continue`... plus the terminal say", and says
that any OTHER change to `pins()` stops the round. H20 adds three asserts
inside that skip. P-A9 ends: "The spec's F.2 STOP-2 is read as amended by
this ruling for exactly these lines of `pins()`." That is the authority this
hunk stands on and it is the only one; it is named here rather than left for
a reviewer to notice. **`held()` (the two byte asserts), the drift assert and
the completeness walk are untouched, and so is the PARENT walk.** H19's edit
is outside `pins()` except for the one call it re-points, and H21/H22 are in
`spec()`, which is not one of the three functions STOP-2 fences.

**NO OTHER STOP CONDITION IS TRIPPED.** STOP-1: no cell in this lane reads
the real chain for a `RELEASE-FROM-SEAL` line, and the PM writes that line
only after reviewing this grammar; every cell builds its own fixture ledger
the way `gate-supersession.test.cjs` does. STOP-3: `--ci --package S9` is on
the WAIT list and was not run. STOP-4 to STOP-10 concern the pack pin, the
fence, the closed list and `design.test.cjs`, none of which this branch
touches.

**THE ONE DEVIATION IN HOW THIS ROUND COMMITTED, stated rather than
implied.** The ticket asks for each ruling RED FIRST in its own commit. The
cells for all three rulings live in ONE file, so they landed in ONE red
commit (`3ebe1b8`) carrying the measured failure list for all eight, and the
three rulings then landed in THREE separate runner commits, each with the
measured pass/fail at that head: `1322e89` (P-A8, 139/6), `b7d01fe` (P-A9,
143/2), `23f5c56` (P-A10, 145/0), then `9999ee27` for E fact 7. The
evidentiary property the ticket is after - the cells were red against the
UNCHANGED runner and the list was measured, not asserted - is exactly what
`3ebe1b8` carries. A reviewer who wants three red commits instead of one is
asking for something I can do next round; I did not want to ship the same
file three times through the airlock and call the difference evidence.

**THE FINAL RUNNER.**
`rebuild/lanes/b/tooling/b-package.cjs` sha256
`316f86c541f109a5876f5ea8d0557164151585f4f5940ce8878c3bec02bee43e`, 3761
lines, pinned as `tooling.runnerSha256` in H3, S3, S4, S5, S6, S7 and S8 and
nowhere else.

**ROUND 5'S OWN LINE COUNT, measured rather than estimated.** 645 added and
17 deleted over the two code files (`b-package.cjs` +137/-14,
`test/release-from-seal.test.cjs` +508/-3), plus seven single-field re-pins
of 58 bytes each, plus this report. **U+2013/U+2014 count over every added
line: 0**, and over this whole report: 0.

## 13. ASTRA'S RE-CHECK R5: FIXED, FINDING BY FINDING

`rebuild/lanes/astra/reviews/S9-PREP-RUNNER-RECHECK-R5.md`, head checked
`4ccfdfcd`, runner `316f86c5...`, VERDICT REJECT. Read whole before a line of
this round was written. What she closed stays closed and is not re-argued
here: **F1 CLOSED** (both original maps keep all five special own keys),
**no honest-chain regression**, **the no-release byte identity holds** for S8
and H3, and **22 of 22 applicable original mutations die**.

This round is FOUR hunks, H23 to H26, and five cells. It touches
`b-package.cjs` (+115/-12) and `test/release-from-seal.test.cjs` (+231/-4),
plus the seven single-field re-pins of E fact 7. **U+2013/U+2014 count over
every line this round added: 0.**

### 13.0 THE THREE MEASUREMENTS, TAKEN BEFORE ANY EDIT

P-A12, P-A13 and the widened walk all land FOR EVERY PACKAGE, so each was
measured first, exactly as P-A1 and P-A10 were. One read-only script over
the 22 standing files (`rebuild/lanes/b/tooling/packages/*.json` and
`rebuild/m4/spec/acceptance-*.json`), run on the PC at `4ccfdfcd` before the
first edit:

```
FILES 22
WALKED SPELLINGS 3232 (of which the two new fields: 38)
RESERVED SEGMENT __proto__ in a walked spelling: 0
RESERVED SEGMENT __proto__ anywhere, broad scan of 1111 path-like strings: 0
OWN KEY spelled __proto__ anywhere: 0
CASE COLLISIONS among walked spellings, per file: 0
REFUSED by the fix-round-6 predicate: 0
```

The walk it measures is the WIDENED one, and it reads product keys,
executionPins keys and released keys of every artifact as well as every
spec-side field, which is what the ruling asked for. Zero on every line, so
no standing seal is voided by any of the three rules. **If any had been
non-zero this round would have STOPPED**, and that is what the sentence in
the runner's own comment block now records.

### 13.1 THE HUNK TABLE OF THIS ROUND

| H | final runner lines | what it does | the cell that proves it |
|---|---|---|---|
| H23 | 1205-1226 (comment), 1223-1226 (code) | `canonicalPath` refuses any path with a SEGMENT spelled exactly `__proto__`, by the existing name `PATH-IS-NOT-CANONICAL`, with the reserved segment in the message; and the three clauses N12 names (leading slash, trailing slash, `p.length > 0`) are REMOVED as implied by the empty-segment clause | `(P-A12)`; the removals by `(P-A10 c)`'s last three rows |
| H24 | 1240-1253 | the walk gains `carrierSuccessor.witnessPins` KEYS and `witnessFlips[].file` | `(P-A10 c)` rows 2 and 3 |
| H25 | 1268-1290 | `canonicalSpecPaths` refuses two DISTINCT walked spellings equal after `toLowerCase`, by the new name `PATH-CASE-COLLISION`, with BOTH spellings in the message | `(P-A13)` |
| H26 | 2211-2215 (`RELEASE_RECORD_KEYS`), 2291-2322 | the ancestor release record must have exactly the four NAMED own keys, the grandparent must name a package (new name `ANCESTOR-RELEASE-GRANDPARENT-HAS-NO-PACKAGE-ID`), and the record's `sealedBy` must be that name | `(P-A9 b)`, `(P-A9 d)` |

Also corrected in H23: the comment above `canonicalPath` claimed a case-only
alias was refused "here". It was not, and now it says what is true and what
does refuse a LONE uppercase alias (a raw Git lookup failure later, with no
runner name on it: Astra measured `failCode=null`).

**THE ORDINALS THIS ROUND MOVED.** Four new hunk ids, H23 to H26; two new
refusal names, `PATH-CASE-COLLISION` and
`ANCESTOR-RELEASE-GRANDPARENT-HAS-NO-PACKAGE-ID`, both harvested into
`FAIL_CODES` by the existing rule and both asserted present by their cells;
one new runner const, `RELEASE_RECORD_KEYS`; five new cell names,
`(P-A9 d)`, `(P-A9 e)`, `(P-A12)`, `(P-A13)` and `(P-A10 c)`; seven new
mutation row ids, P01 to P07; and `(P-A9 b)` keeps its name while its row
list is re-cut. No spec ordinal, no D-id, no gate id and no artifact key
moved. The release-from-seal suite goes from 36 cells to 41, and the bar from
145 to 150.

### 13.2 G1, G2, G5 -> P-A12: ONE CHOKE POINT, AT ADMISSION

Her three measurements are three consequences of ONE fact: `m[k] = v` is not
"create an own entry", and three maps older than this lane still build
themselves that way. The PM did not order three edits to three sealed
clauses; he ordered the key to stop being admissible.

`canonicalPath` now refuses a segment spelled exactly `__proto__`. That
closes her G1 witness (a product own key `__proto__` whose reviewed byte
`envelope()` never compared, `authorized=true`, `reviewedOwnKey=false`), her
G2 witnesses (`brief.file` and `carrierSuccessor.file`, an execution pin
leaving the artifact in silence) and her G5 witness (the receipt written
without the key, the committed re-read refusing `SEALED-RUN-RECEIPT-VOID`
with `moved=["__proto__"]`) at the same door, because in all three the key
arrives THROUGH `spec()`. Each now meets `PATH-IS-NOT-CANONICAL` with the
place and the reserved segment named, and `(P-A12)` runs all of those
spellings through the EXECUTED `spec()` of the stage.

**WHAT P-A12 DOES NOT DO, said out loud.** The three maps are still built by
keyed assignment. If a later round ever admits such a key by another route,
all three defects return exactly as she measured them. This is a door, not a
repair, and the PM chose the door because the three clauses stand in sealed
generations. H18 is untouched on purpose: `proposed()` still builds both of
its maps with `Object.fromEntries`, `(P-A8 a)` and `(P-A8 b)` still drive it
DIRECTLY with all five special names, and M21 and N17 still kill the fixture
and the filter. The runner's comment block says this in the same words.

### 13.3 G3 -> P-A13: A COLLISION, NOT A CASE RULE

Her witness reached an AUTHORIZED artifact: `a.css` released, `A.CSS` pinned
through the same physical file, `released=["a.css"]`, `executionPins`
carrying `A.CSS`, and `PARENT-PIN-BROKEN A.CSS` the first time lane C edited
the released file. Both spellings are canonical, so H21 could not see it.

`canonicalSpecPaths` now refuses two DISTINCT walked spellings of one spec
that are equal after `String.prototype.toLowerCase()`, by the name
`PATH-CASE-COLLISION`, with BOTH spellings and both places in the message. It
never rewrites, and it does not forbid uppercase: `(P-A13)` carries the
control that a LONE uppercase `brief.file` is still ADMITTED, and says in the
cell what stops it instead. The measurement says no standing spec collides.

**THE RESIDUAL, and it is hers.** A lone uppercase alias with only the
lowercase spelling in Git still fails as a raw `git show` error with
`failCode=null`. That is not closed by this hunk and is not ruled: it is a
diagnostic-quality finding about `L.checkSources`, outside this lane's owned
list, and it is named in 13.7 as a candidate debt.

### 13.4 G4 -> P-A9 (b) TIGHTENED: A RECORD, READ AS A RECORD

`undefined === undefined` was the whole of the `sealedBy` check when the
grandparent artifact carried no `packageId`. H26 is THREE asserts under TWO
names, and the shape of it is deliberate: the PM's four requirements are not
four independent clauses, and writing them as four would have left two of
them implied and unholdable, which is precisely the N12 defect. Ordered as
they now are, each holds alone:

| clause | its single-clause change | the row that goes red |
|---|---|---|
| own key SET equals the four named keys | N01 (`-> true`) | `(P-A9 b)` five-key row |
| `role` is exactly `released` | N02 | `(P-A9 b)` role-only row |
| `lastSealedSha256` is 64 lowercase hex | N03 | `(P-A9 b)` |
| `rulingLineSha256` is 64 lowercase hex | N04 | `(P-A9 b)` |
| `sealedBy` is an own, NON-EMPTY string | P05 | `(P-A9 d)` empty-name row |
| the GRANDPARENT names a package | P06 | `(P-A9 d)` nameless-grandparent row |
| `sealedBy` equals that name | N05 | `(P-A9 b)` wrong-package row |
| own keys read with `getOwnPropertyNames` | P07 | `(P-A9 b)` non-enumerable row |

Her second G4 witness, the in-memory object with an INHERITED `role` and four
own keys, is refused by the same first assert and is a row of `(P-A9 b)`; it
is reachable in this suite because `pins()` takes the bound object, and that
is said where the row stands rather than claimed to be ordinary JSON.

N19 and N20 are answered by SPLITTING the fixture, not by arguing about it:
the row that carried role + wrong sealedBy + a fifth key at once is gone, and
each defect now stands alone. N18 (sealedBy) and N19 (role) each turn the
suite red at this head.

N06 and N07 are closed by `(P-A9 e)`, and the honest word for them is
COVERAGE, not defect: both clauses were already right and simply held by no
row, so the cell is GREEN red-first and red only under the mutant it names.
N06's discriminator is a released path spelled like an INHERITED MEMBER
(`toString`), which the grandparent pins as an EXECUTION pin only: with
`Object.hasOwn` it refuses by name, with `file in ga.product` it reaches
`parentPin(Function.prototype.toString)` and refuses as something else. N07's
is one path in BOTH grandparent maps at different hashes, where the PRODUCT
pin decides.

### 13.5 G6 -> P-A10 WIDENED, AND N08 TO N12

At `DECISIONS:579 (3)` the PM refused to rule the narrow walk by argument and
asked for a comparison or a sealed byte. G6 supplied two, so the walk gains
`carrierSuccessor.witnessPins` KEYS and `witnessFlips[].file` and nothing
else. `protectedSurfaces` stays out on her own reasoning: it is explicitly
unasserted descriptive text.

N08 to N11 were LIVE because `(P-A10 b)` moved two fields and no more.
`(P-A10 c)` is ONE ROW PER WALKED FIELD with that field alone non-canonical,
so deleting any single push goes red: measured, P02 and P03 (the two new
pushes) and N08 to N11 (the four old ones) all die.

N12 is answered by REMOVAL. `!p.startsWith('/')`, `!p.endsWith('/')` and
`p.length > 0` are each implied by the empty-segment clause, because `"/x"`
splits to `["", "x"]`, `"x/"` to `["x", ""]` and `""` to `[""]`. The PM's
ruling offered "delete the redundant clause(s) and keep the refusal text
true" or "show a spelling only they refuse"; no such spelling exists, so they
are deleted. `CANONICAL_PATH` still names all of those properties and they
are all still true of every admitted path. **Going beyond the two clauses the
ruling named, to the length test, is an author decision and it is flagged
here rather than buried**: it is the same fact about the same clause, and
leaving one of three redundant clauses standing would have re-created the
finding on the next pass. The three spellings are held by rows in
`(P-A10 c)`, and N14 (the empty-segment clause `-> true`) now kills `(P-A10
b)` AND `(P-A10 c)`, which is the measurement that the removal cost nothing.

### 13.6 THE TABLE, RE-TAKEN AT THIS HEAD

Astra's 44 rows re-taken, plus one single-clause change for every clause this
round adds (P01 to P07). Method: ONE change at a time, on a **writable farm
scratch worktree of the pushed head** (`/home/claude/farm/scratch/wt/s9a6-final`,
detached at `2a8526b`, the runner byte-identical to the PC's), all ten suites
per row, the file restored between rows and the worktree left clean.
**Baseline 150 pass, 0 fail, 0 skipped; every row below has zero skipped.**
Two differences from her run, stated rather than hidden: it is **linux, not
Windows** (the same ten suites are green on both at this head), and three
rows needed a re-anchored edit because the old anchor was ambiguous or would
have left a syntax error rather than a mutant - M01 (the same expression
occurs in `supersessionRuling()` too, so the next line anchors it), P02 and
P03 (deleting the push deletes a loop body, so the push becomes `void w;` /
`void f;`). Cell names are abbreviated as she abbreviated them.

| Row | Exact single change | Pass/fail | Result / witness |
|---|---|---:|---|
| M01 | release grant `g[1] === s.packageId` -> `s.packageId.startsWith(g[1])` | 149/1 | K, R(M01) |
| M02 | `assert(granted.has(file),` -> `assert(true \|\| granted.has(file),` | 148/2 | K, R(2),(7) |
| M03 | `assert(declared.includes(file),` -> `assert(true \|\| ...` | 149/1 | K, R(7) |
| M04 | release pre-image expected `parentPin(...)` -> `s.product[file].pre` | 149/1 | K, R(2) |
| M05 | release `Object.hasOwn(pmap,file)` -> `file in pmap` | 149/1 | K, R(M05) |
| M06 | release `assert.equal(hits.length,1,...)` -> `assert(hits.length >= 1,...)` | 149/1 | K, R(M06) |
| M07 | `ruledTerminal` -> `/(?:^\|[ ·])RULED$/.test(line.trim())` | 148/2 | K, R/G(P-A1) |
| M08 | release block `if(Object.hasOwn...)` -> `if(false && ...)` | 149/1 | K, executed spec R(M08) |
| M09 | prefix released post-null assertion with `if(false)` | 149/1 | K, executed spec R(M09) |
| M10 | `assert(!argv.has(file),` -> `assert(true \|\| ...` | 148/2 | K, R(8),(R1-B1) |
| M11 | `assert(!epin.has(file),` -> `assert(true \|\| ...` | 149/1 | K, R(R1-B1) |
| M12 | product released disk-skip condition -> `false && condition` | 145/5 | K, R(2),(3),(8),(R1-B1),(P-A1) |
| M13 | proposed `releaseRuling` -> `{declared: released product keys}` | 145/5 | K, R(P-A2),(M01),(M05),(M06),(M23) |
| M14 | emitted `sealedBy` -> `'M2-WRONG-PARENT'` | 148/2 | K, R(9),(P-A8 b) |
| M15 | emit released block unconditionally | 146/4 | K, R(9),(X1),(X2),(P-A8 c) |
| M16 | prefix ancestor product-pin `assert.equal` with `if(false)` | 147/3 | K, R(P-A3),(P-A9 c),(P-A9 e) |
| M17 | remove first-writer-wins guard | NA | H19 removed the construct; NA at R5 and still NA |
| M18 | remove grandparent argument | NA | already the shipped code since H19 |
| M19 | receipt forward skip -> `if(false && isReleased(file))` | 148/2 | K, S release/commit |
| M20 | receipt writer removes `role !== 'released'` filter | 146/4 | K, R(10),(P-A4), S release/commit |
| M21 | H18 product filter additionally excludes `file === '__proto__'` | 149/1 | K, R(P-A8 a) |
| M22 | receipt reverse loop removes `!isReleased(file)` | 148/2 | K, R(10), S release |
| M23 | `/^RELEASE-FROM-SEAL` -> `/RELEASE-FROM-SEAL` | 149/1 | K, R(M23) |
| M24 | bound-parent assert condition -> `true \|\| condition` | 149/1 | K, R(P-A2) |
| N01 | H26 own key SET clause -> `true` (was `Object.keys(block).length === 4`) | 149/1 | K, R(P-A9 b) |
| N02 | H26 `block.role === 'released'` -> `true` | 149/1 | **K** (was LIVE), R(P-A9 b) role-only row |
| N03 | H26 `lastSealedSha256` string/hex clause -> `true` | 149/1 | K, R(P-A9 b) |
| N04 | H26 `rulingLineSha256` string/hex clause -> `true` | 149/1 | K, R(P-A9 b) |
| N05 | H26 `sealedBy === ga.packageId` assert -> `if (false)` | 149/1 | K, R(P-A9 b) |
| N06 | H26 `Object.hasOwn(ga.product,file)` -> `file in ga.product` | 149/1 | **K** (was LIVE), R(P-A9 e) |
| N07 | H26 hash expected `parentPin(ga.product[file],file)` -> `parentPin(entry,file)` | 149/1 | **K** (was LIVE), R(P-A9 e) |
| N08 | delete the `carrierSuccessor.parent` push | 148/2 | **K** (was LIVE), R(P-A12),(P-A10 c) |
| N09 | delete the successor original push | 149/1 | **K** (was LIVE), R(P-A10 c) |
| N10 | delete the successor carrier push | 149/1 | **K** (was LIVE), R(P-A10 c) |
| N11 | delete the child argv target push | 148/2 | **K** (was LIVE), R(P-A12),(P-A10 c) |
| N12 | H21 `!p.startsWith('/')` -> `true` | NA | the clause is REMOVED (13.5); its spellings are rows of R(P-A10 c) and die under N14 |
| N13 | `!p.includes(backslash)` -> `true` | 149/1 | K, R(P-A10 b) |
| N14 | `seg !== ''` -> `true` | 148/2 | K, R(P-A10 b),(P-A10 c) |
| N15 | `seg !== '..'` -> `true` | 149/1 | K, R(P-A10 b) |
| N16 | delete the `canonicalSpecPaths(s)` call | 145/5 | K, R(P-A10 a),(P-A10 b),(P-A12),(P-A13),(P-A10 c) |
| N17 | fixture SPECIAL_KEYS removes `'__proto__'` only | 149/1 | K, R(P-A8 b) |
| N18 | fixture wrong sealedBy `M2-SOMEONE-ELSE` -> `M2-S8-FIXTURE` | 149/1 | K, R(P-A9 b) |
| N19 | fixture role-only record: `carried` -> `released` | 149/1 | **K** (was LIVE), R(P-A9 b); the masked row she mutated is split |
| N20 | same fixture record: sealedBy `M2-UNRELATED` -> `M2-S8-FIXTURE` | NA | that record no longer exists; its defects are N18 and N19 above |
| P01 | H23 `seg !== '__proto__'` -> `true` | 149/1 | K, R(P-A12) |
| P02 | H24 `carrierSuccessor.witnessPins` key push -> `void w;` | 149/1 | K, R(P-A10 c) |
| P03 | H24 `witnessFlips[].file` push -> `void f;` | 149/1 | K, R(P-A10 c) |
| P04 | H25 `assert(first[1] === p,` -> `assert(true \|\| first[1] === p,` | 149/1 | K, R(P-A13) |
| P05 | H26 non-empty `sealedBy` clause -> `true` | 149/1 | K, R(P-A9 d) |
| P06 | H26 grandparent packageId assert -> `true \|\| condition` | 149/1 | K, R(P-A9 d) |
| P07 | H26 `getOwnPropertyNames` -> `Object.keys` | 149/1 | K, R(P-A9 b) non-enumerable row |

**Totals: 47 rows executed, 47 killed, 0 LIVE; 4 NA (M17, M18, N12, N20),
each NA because the construct it changes no longer exists and each said so
above.** Astra's ten green rows are ten kills or NAs at this head. Every
clause this round adds has a row that turns red under its own single-clause
change, which is the property N12 was about.

### 13.7 WHAT THIS ROUND DID NOT CLOSE

1. **The three older maps are still built by keyed assignment** (13.2).
   P-A12 shuts the door they are reachable through; it does not repair them.
   If a later ruling ever admits such a key by another route, G1, G2 and G5
   return unchanged.
2. **A lone uppercase alias still fails as a raw Git error** with
   `failCode=null` (13.3). Named, not fixed; outside this lane's owned list.
3. **Astra's other Windows spellings stand as she measured them.** NTFS
   streams (`a.css:x`, `a.css::$DATA`), percent and Unicode lookalikes,
   trailing dot and trailing space: all ADMITTED at spec(), none shown to
   produce an authorized alias seal, all failing later without a named runner
   code. This round adds no clause for any of them, because none of them
   reached an AUTHORIZED artifact in her measurement and a guard on the seal
   path that no witness demands is surface.
4. **`spec()` is exercised, not covered.** Unchanged from round 5 and still
   recorded as the PM recorded it at `DECISIONS:579 (4)`.
5. **The stage cells do not run a full package sequence.** No seal, no
   receipt, no artifact is written by anything in this suite; `(P-A12)`,
   `(P-A13)` and `(P-A10 c)` measure the EXECUTED `spec()` and stop there,
   which is where the refusals they assert live.

### 13.8 THE BAR AND `--ci`, AT THE FINAL BYTES

**Ten tooling suites on the PC**, each file `node --test`, at `de9f3f0`:
child-diagnostic-tail 11, execution-targets 9, gate-supersession 16,
parent-gate-closure-and-load-floor 14, parent-pin-shapes-and-spec-successors
9, pinned-unchanged-and-ruled-substitutions 17, product-phase-and-ledger 7,
release-from-seal 41, seal-tip-and-byte-identity 17, successor-moves 9.
**150 tests, 150 pass, 0 fail, 0 skipped**, every file exit 0. The same ten
suites at the same head on **linux**, in a farm scratch of the pushed
commit: **150 / 150 / 0 / 0**. Was 145 of 145 at `4ccfdfcd`.

**(X1) AGAIN, because P-A12 and P-A13 land for every package.**
`--ci --package S8` and `--ci --package H3`, before the first edit and on the
final bytes:

| | before (`4ccfdfcd`) | after (`de9f3f0`) |
|---|---|---|
| S8 terminal | `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`, exit 1 | identical, exit 1 |
| H3 terminal | `B PACKAGE H3 FAIL SEALED-PROFILE-RECOMPUTATION; ...`, exit 1 | identical, exit 1 |
| S8 spec sha256 | `df3f785dad9c13eda9e27fc31ba84d1290690c621ed9fa7dc86c1bfe838c2a39` | `32f1aad82eea4e89f71ef84ba1e162ae8e2d3e33c087ed6c41c74faca9be5475` |
| H3 spec sha256 | `119c215348aea0d49404be8fcf09cc2fb6216e3a4370878027e6ea2da61b69a6` | `36a4245f65dcc08dc6602230fb8d61352f0d733449bd1493ce040085fec6577f` |
| runner sha256 | `316f86c5...bee43e` | `71c1b259...3012c0` |

Four stdout lines each, before and after, and **the only differences are the
two hashes E fact 7 moves**: the SPEC OBSERVED counts (224 and 64 product
files, 25 and 10 children, 24 roots, 5 superseded carriers each), both PARENT
OPTION lines, both PARENT BOUND lines and both terminals are character for
character what they were. A named refusal before the ruling is the expected
state and is what the S8 preparation report shows too.

### 13.9 RED FIRST, AND THE COMMIT SHAPE

`3517eae` carries all five cells against the UNCHANGED runner at `4ccfdfcd`,
with the measured failure list in its own message: **41 tests, 36 pass, 5
fail**, the five being `(P-A9 b)`'s inherited-role row, `(P-A9 d)`,
`(P-A12)`'s product-key row, `(P-A13)` and `(P-A10 c)`'s witnessPins row.
`DECISIONS:579 (2)` accepts one red commit when the cells live in one file,
and they do. Then one runner commit per ruling, each with its measured count
in its message: `88f9094` (P-A12, 37/4 on that file), `5e878fd` (P-A10
widened, 38/3), `b9b4334` (P-A13, 39/2), `2a8526b` (P-A9 (b) tightened, 41/41
on the file and 150/150 over the whole bar), then `de9f3f0` for E fact 7.

`(P-A9 e)` is GREEN in the red commit and says so there and here: N06 and N07
were coverage holes, not defects, and a cell that was never red proves only
that it agrees with the code beside it - unless the thing it is written
against is a MUTANT, which is what 13.6 measures.

### 13.10 E FACT 7, REDONE LAST AGAIN

`tooling.runnerSha256` re-pinned from `316f86c5...bee43e` to
`71c1b2592b5a3544b71c0995a9f52b88fbe24cd6b821709309aa95e5ad3012c0` in
`packages/H3.json`, `S3.json`, `S4.json`, `S5.json`, `S6.json`, `S7.json` and
`S8.json`. `git diff --stat` for that commit is **7 files changed, 7
insertions, 7 deletions**: one field, one byte range per file, and no other
byte of any package file moves. **THE FINAL RUNNER sha256 is
`71c1b2592b5a3544b71c0995a9f52b88fbe24cd6b821709309aa95e5ad3012c0`, 3864
lines.** If a later round moves the runner again, this step is redone last
again.

### 13.11 WHAT I AM ASKING THE PM TO LOOK AT

1. **The N12 removal went one clause further than the ruling named** (13.5).
   `p.length > 0` is the same fact about the same predicate; keeping it would
   have left exactly the defect the ruling is about. Say if that was not the
   intent and it comes back.
2. **The grandparent-packageId check has its own refusal name.** The ruling
   listed four requirements for the record; written as four clauses of one
   assert, two of them would have been implied and unholdable. Three asserts
   under two names is my reading of the ruling's spirit and N12's letter, and
   it adds one name to the vocabulary.
3. **Own keys are read with `getOwnPropertyNames`, not `Object.keys`.** That
   is stricter than "own key SET" strictly needs for JSON, and it is what
   makes a non-enumerable own fifth key a fifth key. P07 holds it.
4. **`(P-A9 e)` is a coverage cell, not a fix**, and the report says so in
   three places rather than letting a green cell look like a closed defect.
5. **The farm's privacy proof is not concurrency-safe.** While this round ran,
   `farm-verify.sh` printed `FAIL: 92 excluded object(s) present`, then 113
   thirty seconds later, then **PASS** twice more with no command of mine in
   between. Another hand's `farm-sync.sh` was in flight. Nothing was read
   outside the include list by this lane, and the proof passes at the end;
   but a proof that can print FAIL for a reason that is not a breach is a
   proof that will one day be ignored when it matters. Reported, not touched.

## Loop round 1: fixed or disputed

The review answered is
`rebuild/lanes/astra/reviews/S9-PREP-RUNNER-RECHECK-R6.md` on
`rebuild/r-astra-s9a-runner-r6` at `2a20bf1d`, verdict **REJECT**. It was
read whole before any file was opened. This is loop round 1 of 3 under
`DECISIONS:613` L-1 and L-2: her undisputed findings are orders, and there
is nothing here that waits on a PM ruling.

**NOTHING IS DISPUTED.** Both open items are fixed, and one of them is
fixed differently from the way she prescribed, for a reason I measured
rather than argued (14.3).

Base of this round: `397ac466`. Head: the last commit below.

### 14.1 WHAT MOVED, COMMIT BY COMMIT

| commit | what |
|---|---|
| `a94f045` | RED FIRST. `(H27)` against the UNCHANGED runner, with the measured failure in the message. |
| `126c919` | The runner fix: H27 seeds `canonicalSpecPaths()` with the two fixed coordinates. |
| `f7cb343` | The row that kills her LIVE single-clause change, and the correction to the reason she gives for it. |
| `2c0283f` | E fact 7, LAST: `tooling.runnerSha256` in the seven packages. |

Only the four files this ticket already owns were touched: `b-package.cjs`,
`test/release-from-seal.test.cjs`, the seven `packages/*.json` for the one
re-pinned field, and this report.

### 14.2 BLOCKING B1, WHICH IS HER G3 STILL OPEN: FIXED (H27)

**Her finding, in one sentence:** `canonicalSpecPaths()` walks only the
spellings a SPEC declares, so the two coordinates `proposed()` supplies
itself - `RUNNER` and `TOOLING + '/packages/' + ID + '.json'` - were never
compared with anything, and a spec that RELEASES a case-only alias of the
runner's own path reached `ENVELOPE AUTHORIZED` while the same physical
file stayed pinned under its other spelling.

**She is right, and the reasoning that left the hole was mine.** The
comment above `canonicalSpecPaths()` said the two coordinates "are fixed
constants of this file and cannot be misspelled by an input" and used that
as the reason to leave them out. That sentence is true about the CONSTANTS
and false about the RULE. H25 does not compare a spelling with a schema; it
compares two spellings WITH EACH OTHER. A spec never had to misspell the
runner in order to collide with it. It only had to declare a SECOND
spelling of the same physical file, which is precisely what the guard
exists to catch, and the one path whose release would take the seal itself
out of the inventory was the one path the guard could not see.

**RED FIRST, at `a94f045`, against the runner she reviewed**
(`71c1b2592b5a3544b71c0995a9f52b88fbe24cd6b821709309aa95e5ad3012c0`):

```
node --test rebuild/lanes/b/tooling/test/release-from-seal.test.cjs
  tests 42, pass 41, fail 1, exit 1
  (H27) - a case alias of a FIXED execution coordinate refuses at admission
    AssertionError: Missing expected exception: the runner
    actual undefined, expected /PATH-CASE-COLLISION/
```

`actual undefined` is the finding: the runner ADMITTED the alias.

**THE FIX, `126c919`, is the smallest one she named and nothing more:** two
`seen.push` calls at the top of `canonicalSpecPaths()`, before any declared
spelling, so the identity comparison below sees every path `proposed()`
will pin. No rewrite, no normalisation, no new refusal name: the existing
`PATH-CASE-COLLISION` does the work, and the message names the fixed
coordinate first and the spec's alias second. The seeds are pushed FIRST
for that reason.

**THE HUNK TABLE ROW**

| H | lands at | what it does | the cell that proves it |
|---|---|---|---|
| H27 | `b-package.cjs`, the two `seen.push` lines opening `canonicalSpecPaths()` (anchor: the comment "the two coordinates `proposed()` supplies ITSELF") | seeds the case-identity walk with `RUNNER` and `TOOLING + '/packages/' + ID + '.json'`, so a spec cannot release or pin a second spelling of either | `(H27)` in `release-from-seal.test.cjs` |

**THE MUTATION TABLE ROWS, MEASURED ON THIS PC AT THE FINAL HEAD.** Every
clause H27 adds has a row that holds it ALONE, which is N12's discipline
and the reason H26 is three asserts.

| single-clause change | suite | measured |
|---|---|---|
| delete `seen.push(['the runner (a fixed execution pin)', RUNNER])` | release-from-seal | 41/42, fail 1. `(H27)`: `Missing expected exception: the runner` |
| delete `seen.push(['this package spec file (a fixed execution pin)', TOOLING + '/packages/' + ID + '.json'])` | release-from-seal | 41/42, fail 1. `(H27)`: `Missing expected exception: the package spec file` |
| revert H27 whole (both pushes) | release-from-seal | 41/42, fail 1, which is the red-first measurement at `a94f045` |

The cell also carries its own CONTROL, run in the same loop: the EXACT
spelling of either coordinate, declared as an ordinary product key, is
ADMITTED. That is the standing case, not a hypothetical (14.5), and it is
what says this refuses two spellings and never a coordinate.

### 14.3 HER LIVE SINGLE-CLAUSE CHANGE: KILLED, AND HER REASON CORRECTED BY MEASUREMENT

**Her row:** deleting `typeof block.sealedBy === 'string'` from H26's
closed-release-record assert leaves all the suites green.

**REPRODUCED. She is right that it is live.** At `126c919` the deletion
left `release-from-seal` at 42 of 42, fail 0.

**The reason she gives for it is wrong, and this is a correction, not a
dispute.** She wrote that the only other reader of the field is
`assert.equal`, which is `==`, so a `new String('M2-S8-FIXTURE')` would
slip through once the subclause went. This runner takes `assert` from
`node:assert/strict` (`b-package.cjs:90`), so `assert.equal` IS
`strictEqual` and the wrapper is refused with the subclause and without it.
**I wrote her wrapper as the row first and measured it: under the mutant,
42 of 42, fail 0. It holds nothing.** It is kept inside the cell, labelled,
as the control that says why - because a row that cannot go red is the
exact defect N12 is about, and leaving it unlabelled would have re-created
it one line below the paragraph that names it.

**What the subclause holds ALONE is the ordinary JSON value `null`.** The
own key set is fixed at exactly the four names, so `sealedBy` is always
PRESENT and only its VALUE varies, and `null` is a value JSON delivers
every day.

| single-clause change | suite | measured |
|---|---|---|
| delete `typeof block.sealedBy === 'string' &&`, wrapper row only (her form) | release-from-seal | 42/42, fail 0. THE CHANGE SURVIVES. |
| delete `typeof block.sealedBy === 'string' &&`, with the `sealedBy: null` row (`f7cb343`) | release-from-seal | 41/42, fail 1. `(P-A9 d)`: `TypeError: Cannot read properties of null (reading 'length')` |

That TypeError is the point. With the subclause the runner refuses BY NAME,
with the path in the message. Without it the runner CRASHES, with no
refusal name and no path - the `failCode=null` shape this lane already
refused to accept from the Git lookup at P-A13, arriving at the release
record instead. **No runner byte moves for this commit:** the clause was
unmeasured, not absent.

### 14.4 MEASURED FIRST: NO STANDING SEAL IS VOIDED

H27 lands for every package, so it landed only after the measurement, the
same way P-A1, P-A12 and P-A13 did. Two measurements, and the second is
the stronger one.

**(a) The read-only walk over the 22 standing files**, run on this PC at
`397ac466` BEFORE the hunk and again at the final head, and independently
in a linux farm scratch of the pushed head:

```
package files 12 | walked spellings 1512 | seeded fixed coordinates 24
acceptance files 10 | acceptance product/execution/released keys 1431
NONCANONICAL 0 | CASE COLLISIONS 0 | exact repeats admitted 335
```

Zero standing spellings refuse. The 335 exact repeats matter: the standing
packages DO declare the runner and their own spec file as product keys, at
their own spelling, and an exact repeat is admitted by the walk as it was
before. The rule is about two spellings.

**(b) The real runner over the real specs.** `--ci --package S8` and
`--ci --package H3` on the FINAL bytes both print `SPEC OBSERVED` - which
is `canonicalSpecPaths()` having run, seeded, over 224 and 64 declared
product files plus every child argv and brief - and then the SAME named
refusal as before the round, on both. This is not a scan of a copy of the
predicate; it is the predicate itself, admitting the two packages that have
a CLI walk.

Astra's own R6 scan reports the same result for the seeded coordinates
("Adding the fixed coordinates to the scan also found zero standing
collisions"), reached independently.

Her **D2 DISK-IDENTITY** debt stands untouched by this hunk: seeding adds
spellings to the walk, it does not change what `toLowerCase` means, so the
`K`/U+212A, U+1E9E/U+00DF and U+0130/i+U+0307 pairs behave exactly as her
P-A13 table measured, and none occurs in the 22 files.

### 14.5 HER THREE NAMED DEBTS, ONE LINE EACH

- **D1 MAP-CONSTRUCTION.** Landed as written, and H27 widens the thing it
  depends on: the three assignment-built maps still lose a directly
  supplied `__proto__` key, and `canonicalSpecPaths()` admission stands in
  front of every producer. H27 adds no producer and removes no admission;
  it adds two values to the same choke point. Carried into S9 verbatim.
- **D2 DISK-IDENTITY.** Accepted as stated; see 14.4. JavaScript lowercase
  equality is not filesystem identity, this refuses more than the disk
  collides on, and none of the three pairs occurs in the 22 standing files.
  Carried into S9 verbatim.
- **D3 JSON-BOUNDARY.** Accepted, and 14.3 is a worked example of it: her
  wrapper witness is exactly an object identity JSON cannot deliver, which
  is why it could not be the row that holds the clause. JSON-only artifact
  ingress is retained. Carried into S9 verbatim.

Her closed rows G1, G2, G4, G5 and G6 are unchanged by this round and were
re-run as part of the whole suite, not spot-checked.

### 14.6 THE BAR, AT THE FINAL HEAD `2c0283f`

**The ten tooling suites, `node --test`, each file, on the owner's PC**
(`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`), exit 0 each:

| suite | tests | pass | fail |
|---|---|---|---|
| child-diagnostic-tail | 11 | 11 | 0 |
| execution-targets | 9 | 9 | 0 |
| gate-supersession | 16 | 16 | 0 |
| parent-gate-closure-and-load-floor | 14 | 14 | 0 |
| parent-pin-shapes-and-spec-successors | 9 | 9 | 0 |
| pinned-unchanged-and-ruled-substitutions | 17 | 17 | 0 |
| product-phase-and-ledger | 7 | 7 | 0 |
| release-from-seal | 42 | 42 | 0 |
| seal-tip-and-byte-identity | 17 | 17 | 0 |
| successor-moves | 9 | 9 | 0 |
| **total** | **151** | **151** | **0** |

150 before this round; `(H27)` is the one new cell.

**AND ON LINUX**, in a farm scratch worktree of the PUSHED head (not of a
local tree), twice: at `126c9196` and again at the final `2c0283fa`. Same
ten files, same counts, **151 of 151, fail 0** both times. Both OS runs are
of bytes that exist on the branch.

**`--ci --package S8` and `--ci --package H3`, before and after.**

| | S8 | H3 |
|---|---|---|
| at `397ac466`, before any edit | `B PACKAGE S8 FAIL SEALED-PROFILE-RECOMPUTATION; required evidence missing or failed; local diagnostics withheld`, exit 1 | same, `H3`, exit 1 |
| at the final head `2c0283f` | the SAME named refusal, exit 1 | the SAME named refusal, exit 1 |

A named refusal is the expected pre-ruling state, as the S8 preparation
report sets out: the `RELEASE-FROM-SEAL` and `THEME` lines do not exist
yet, so the sealed profile cannot recompute, and it says so by name rather
than by crashing. What changed between the two runs is only what should:
the runner sha on `SPEC OBSERVED` and the spec sha of the re-pinned file.
`SPEC OBSERVED` printing at all is the load-bearing half - `spec()` ran the
seeded walk over the real specs and admitted them.

At `126c919`, between the hunk and E fact 7, both CLI runs printed
`RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER` instead. That is correct and
expected: E fact 7 is done LAST by order, so for exactly one commit the
packages still named the old runner. It is recorded here so that a reader
of that commit alone is not misled.

### 14.7 E FACT 7, REDONE LAST AGAIN

`tooling.runnerSha256` re-pinned from
`71c1b2592b5a3544b71c0995a9f52b88fbe24cd6b821709309aa95e5ad3012c0` to
`d52acc31c99845ed774c5111a261b84012538495e0ee2caa1d13827c1d28bb53` in
`packages/H3.json`, `S3.json`, `S4.json`, `S5.json`, `S6.json`, `S7.json`
and `S8.json`. The old value occurs EXACTLY ONCE in each file (counted
before the edit), and `git diff --numstat` for that commit is 1 insertion
and 1 deletion per file, **7 files, 7 insertions, 7 deletions**: one field,
one byte range each, no other byte of any package file moved.

**THE FINAL RUNNER sha256 is
`d52acc31c99845ed774c5111a261b84012538495e0ee2caa1d13827c1d28bb53`, 3898
lines.** If a later round moves the runner again, this step is redone last
again.

### 14.8 WHAT I DID NOT DO IN THIS ROUND, STATED SO IT IS NOT ASSUMED

- **No F.2 STOP condition fired.** In particular STOP-2: H27 is inside
  `canonicalSpecPaths()`, at admission. `held()`, the drift assert, the
  completeness walk and `pins()` are all untouched by it; the only line of
  `pins()` that moved in this whole lane is still H17's single `continue`.
- **No ordinal moved in this round.** `(H27)` is appended after `(P-A13)`
  and before `(P-A10 c)`; no existing cell was renumbered, renamed or
  reordered, and the `(P-A9 d)` rows were added inside the cell, before its
  closing control.
- **Nothing was disputed**, so no finding's code was left alone.
- **Nothing on the wait list was started**: no `packages/S9.json`, no
  needles, no acceptance-s9, no `--ci --package S9`, no CI-step flip, no
  PACK-PIN or APPROVED-PIN literal, no `design.test.cjs` hunk, no S9 brief,
  no PM token line.
- **Nothing outside this ticket's owned files was edited.** No
  `rebuild.yml`, no `boundary.test.mjs`, no `package.test.cjs`, nothing
  under `rebuild/lanes/c/`, no product file, no `DECISIONS.md`, no
  `lanes/STATUS.md`, no byte under `rebuild/engine`.
- **Nothing sealed.** No `--full`, no `seal-chain.cjs`, no receipt, no
  artifact written into the tree. `--ci` only.
- **No re-run was needed.** Nothing in this round failed in a way that
  looked like timing, so the one-re-run rule was never reached.
- **`bin/farm-verify.sh` printed PASS** on every sync of this round.

### 14.9 WHAT I AM ASKING THE PM TO LOOK AT

1. **The comment H27 replaces was load-bearing and wrong.** It is worth a
   moment of the final read: the old text gave a REASON for the omission,
   and the reason sounded right. The new text says why the reason does not
   hold. If a future round is tempted to narrow the walk again, that
   paragraph is what should stop it.
2. **Astra's stated mechanism for the `sealedBy` change is wrong and her
   finding is right** (14.3). Both halves matter. The finding is fixed; her
   reason is corrected in the cell's own comment so the next reader is not
   sent after `==` in a file that imports `node:assert/strict`.
3. **One row in the suite is deliberately unkillable and labelled as such**
   (her `new String` wrapper). It is a control, not a guard. If the PM
   would rather no unkillable row stood in the file at all, say so and it
   goes; I kept it because deleting it would lose the measurement that
   explains why the real row is the one it is.
