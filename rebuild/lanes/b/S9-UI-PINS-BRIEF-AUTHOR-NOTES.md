# S9-UI-PINS brief - author notes

One line per finding per loop round: the command and the output that settled it. Nothing here is a
ruling, a token line, a seal or a literal. Every measurement below was taken by this author, in the
PM's cloud reading room (linux) unless a line says otherwise, against a synced read-only worktree
and never against the owner's data.

## Loop round 1: corrected or disputed

Review answered: `rebuild/lanes/astra/reviews/S9-UI-PINS-BRIEF-REVIEW-L1.md` on
`rebuild/r-astra-s9-brief-l1` at `a93367b`, verdict REJECT, read whole before a word was changed.
Base of this round: `b1aaecf5292e6739f1a464dff013a59ffac26497` on `rebuild/b-s9-ui-pins`.

**Re-measurement head.** Review L1 measured the runner at `397ac466` because the brief named that
head. `DECISIONS:620` has since ACCEPTED lane A at `a224c7b0` (runner sha256
`d52acc31c99845ed774c5111a261b84012538495e0ee2caa1d13827c1d28bb53`, 3898 lines, verified by this
author with `sha256sum` and `wc -l`). **Every blocking finding below was re-measured at `a224c7b0`,
not taken from the review.** `git diff -U0 397ac466 a224c7b0 -- rebuild/lanes/b/tooling/b-package.cjs`
shows ONE change, H27, 37 insertions and 3 deletions at old lines 1228-1234: so every cited runner
line at or below `:1227` is unchanged and **every cited runner line at or above old `:1235` moves by
+34**. Each anchor below was re-located by TEXT, not by arithmetic.

Method for the executed probes: the house harness of
`rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs:19-56` - compile the
REAL runner out of `a224c7b0`, changing only its filesystem root to a `mkdtemp` scratch, and export
`product`, `childArgv`, `claim`, `held`, `executedClosure` and the constants. No repository byte was
written, moved or read outside the include list.

### B1 sourceBase - CORRECTED
Command: for each of the 227 distinct S8 pinned paths (224 `product` + 71 `executionPins`, union
227, parsed from `rebuild/m4/spec/acceptance-s8-real-shape.json`), `git show <rev>:<path>` hashed
with sha256 and compared with the parent pin; plus `git merge-base --is-ancestor`.
Output: at `b1aaecf5` **220 equal, 7 different** - `.github/workflows/rebuild.yml`,
`rebuild/m3/w6/local/import-bundle.mjs`, `rebuild/m3/w7-preview/import/import-screen.mjs`,
`rebuild/m3/w7-preview/import/test/page-bundle.test.mjs`,
`rebuild/m3/w7-preview/today/test/adapter.test.mjs`,
`rebuild/m3/w7-preview/today/test/view.test.mjs`, `rebuild/m3/w7-preview/today/today-app.cjs`. At
`0cd07be7cf967dfbfea8c84947ba8477f58cfb5f`: **227 equal, 0 different**, and it IS an ancestor of
`b1aaecf5`. Mechanism re-read at `a224c7b0`: `product()` `:2425` requires `pre` to equal the parent
pin; `held()` `:2206-2210`, called at `:2261` with code `PARENT-PIN-BROKEN`, then requires the blob
at the `sourceBase` to equal it, refusing `PARENT-PIN-BROKEN-AT-SOURCEBASE`.
Settled: the review is right and its candidate reproduces. Header rewritten; section 9 item 1
rewritten. The candidate is offered to the PM and NOT named by this brief.

### B2 F2 child roots - CORRECTED
Command: real `childArgv()` at `a224c7b0` with `{name:'f2-land', argv:['--test', <each F2 target>]}`
and with the ui-port pack cell; plus `CHILD_ROOTS.length` and membership.
Output: `CHILD-ARGV-TARGET f2-land rebuild/lanes/d/f2/projector.test.mjs`;
`CHILD-ARGV-TARGET f2-land rebuild/lanes/d/f2/guard-coverage.test.mjs`;
`CHILD-ARGV-TARGET ui-port rebuild/lanes/c/ui-port/pack-pin.test.mjs`. `CHILD_ROOTS.length` is 24,
`rebuild/lanes/c/ui-port/` false, `rebuild/lanes/d/f2/` false. `PUBLIC_TAIL_ROOTS.length` is 6.
Settled: BOTH roots must be added, and only `ui-port/` joins `PUBLIC_TAIL_ROOTS`. Section 5.1 fact
3, fact 4, section 9 item 6 and section 11.2 corrected; the resulting count is TO MEASURE.

### B3 the "new with equal pre/post" disposition - CORRECTED (and the item stays OPEN)
Command: real `product()` at `a224c7b0` with four synthetic unchanged document declarations, role
`new`, `pre === post`, and an empty parent map.
Output: `PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE <path> is declared "new" with pre === post`, for all
four, from `:2486` (old `:2452`). The same four declared `pinned-unchanged` with no declared child
return `IMPLEMENTED` from `product()` alone, because the executed-by-a-declared-child assert lives
at `:1931`, not in `product()`.
Settled: disposition (a) is REFUSED for an unsealed S9 and the brief no longer calls it something
the runner admits. **The CHOICE among the remaining dispositions stays OPEN for the PM**; this
author picks none.

### B4 git hash-object - CORRECTED
Command: `git hash-object <path>` and `sha256sum <path>` over the identical F2 blobs.
Output: `guard-coverage.test.mjs` blob id `91297a68de11b0b462986807c7a7c03106bc2783` against sha256
`78d1d73c02b115981006ab38dd0a16bfcd9fddbee8afa40c872964155281b9e7`; `projector.test.mjs`
`cd4f4b29e1d15c09816c7ec0ebec379c159afce2` against
`f74bbe5f40624237a4d24536b3ead036a75ed3bc705a52d6e55032d28bdf8dd6`. `PRODUCT-POST-IMAGE-SHAPE` at
`:1893` admits only `null` or `/^[a-f0-9]{64}$/`.
Settled: the instruction was wrong, the two sha256 values in the brief were right. Section 2.4
rewritten to name the three correct commands.

### B5 the four spec fields - CORRECTED
Command: real `claim()` at `a224c7b0` with a bare 64-hex string, then with a four-key object.
Output: bare string refuses `Authorization claim theme` and `Authorization claim brief acceptance`
(the closed-key assertion at `:1327`); the four-key object `{ledgerLine, role:'cowork', line,
lineSha256}` is ADMITTED.
Settled: only the two `rulingLineSha256` fields are 64-hex strings. Section 6 step 3 corrected to
agree with section 10.6, which was already right.

### B6 the owner's words - CORRECTED
Command: raw `String.prototype.includes` of each quoted string against the exact bytes of
`rebuild/DECISIONS.md` lines 536 and 593.
Output: `1. C-UI-0 is the long pole for the look. ... No check is dropped.` = **false** on both
lines; `1. C-UI-0 is the long pole for the look.` = true on 593; `No check is dropped.` = true on
593; `4. Put Astra's gauge number in every status you send me.` = true on 593;
`Yes, release the screen files` = true on 536.
Settled: the owner did not write the three-dot omission. Point 1 is now quoted COMPLETE, and every
owner quotation stands on ONE source line of the brief so a raw comparison needs no soft-wrap
folding.

### B7 engine and coach membership - CORRECTED
Command: `git ls-files rebuild/engine | wc -l`; membership of each tracked path in the parent
artifact's two maps; real `product()` at `a224c7b0` with an unparented engine path and with the
coach constant, both declared `carried`.
Output: tracked **45**, parent `product` **18**, parent `executionPins` **0**, unparented **27**.
`UNLISTED-PRODUCT-DRIFT rebuild/engine/test/census-partial.cjs is not parent-pinned and is not
declared new`; the same word for `rebuild/coach/engine-revision.cjs`; and, for a parent-pinned
engine path declared with a `pre` that is not the parent pin,
`UNLISTED-PRODUCT-DRIFT pre-image is not the parent pin: rebuild/engine/constants.cjs`.
Settled: 18 carried, 27 outside the map with their bytes preserved, coach outside both maps.
Sections 2.6 and 4 corrected.

### B8 the omitted tooling cell - CORRECTED
Command: `git diff --name-status 789baf6e a224c7b0 -- rebuild/lanes/b/tooling/test`; parent-map
membership of each result; `sha256sum` at `a224c7b0`; real `product()` with changed bytes declared
`carried`.
Output: four results - `M gate-supersession.test.cjs`, `M
pinned-unchanged-and-ruled-substitutions.test.cjs`, `A release-from-seal.test.cjs`, `M
seal-tip-and-byte-identity.test.cjs`. **Only the second is in an S8 map** (product, role `edited`,
post `24525b8f97e90ef0a4501ef233c253989387281315127ed1742943acee19d3e1`); its post at `a224c7b0` is
`a238242f3a78628e2235300d531a2f7a49d02c70bfc90d48190955281a79a992`, exactly the value review L1
measured at `397ac466`. Declared `carried` with those changed bytes it refuses
`UNLISTED-PRODUCT-DRIFT`. The other three are absent from both maps and all three stand in
`TOOLING_FILES` (`:371-385`), which is what exempts them from `fidelity()`'s `UNLISTED-SOURCE-CHANGE`
walk at `:2568`.
Settled: one `edited` cell owed, three not. Section 2.6 corrected and the three named so the
omission is a decision.

### B9 supersession carriers - CORRECTED
Command: read `MOVES_RULING` and the `coverage()` assert at `a224c7b0`.
Output: `const MOVES_RULING = null;` at `:198`; the assert at `:1952-:1954` is
`assert(MOVES_RULING !== null || !Object.keys(s.coverage.moves).length,
'COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING ...; coverage.moves must be {} under this runner
(TOOLING-REVIEW-r3 X1)')`. Review L1 EXECUTED it with `moves={'source-carriers':{}}` at `397ac466`
and got `COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING source-carriers`.
Settled: the carrier set comes from `coverage.superseded.gates` and its per-carrier executed
evidence (`:1649` onward, `supersededGates()` at `:3155`), with `coverage.moves` left `{}`.
Sections 10.2 and 12.4 corrected; the choice stays TO MEASURE AT INTEGRATION and the PM's line is
obtained for it.

### B10 commit checkpoints - CORRECTED
Command: re-read the three asserts and the receipt return at `a224c7b0`.
Output: `:1880` `assert.equal(gitSha('HEAD', RUNNER), s.tooling.runnerSha256,
'RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER-IN-GIT')`; `:1886` the same shape for the spec,
`SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT`; `sealedRunReceipt()` at `:3553` returns
`{ok:false, code:'SEALED-RUN-RECEIPT-NOT-IN-GIT', file, at:'HEAD'}` at `:3564` and a second refusal
at the receipt base at `:3575`; `sealedRunReceiptInstruction()` at `:3644`. Review L1 executed all
three with distinct synthetic disk and Git bytes and got all three by name.
Settled: section 6 steps 3, 4, 5 and 11 now carry the commit checkpoints, and step 11 names the
receipt SHA-256 in `VERDICT-S9.md` before BYTE-IDENTITY is requested.

### The runner line citations - CORRECTED throughout
Command: `git diff -U0 397ac466 a224c7b0 -- rebuild/lanes/b/tooling/b-package.cjs`, then `grep -n`
for each cited refusal name, constant and function at `a224c7b0`.
Output: one file, 37 insertions, 3 deletions, hunks at old `1228,3` and `1234,0`; net +34 for every
line at or above old `:1235`. Re-located by text and verified one by one: `:1871-:1872` to
`:1905-:1906`; `:1896-:1897` to `:1930-:1931`; `:1992-:1995` to `:2026-:2029`; `:1292-:1296` to
`:1326-:1330`; `:1408-:1410` to `:1442-:1444`; `:1418-:1421` to `:1452-:1455`; `:1474-:1504` to
`:1508-:1538`; `:1478` to `:1512`; `:1485-:1488` to `:1519-:1522`; `:1501-:1504` to `:1535-:1538`;
`:1519-:1547` to `:1553-:1581`; `:1801` to `:1835`; `:1805-:1806` to `:1839-:1840`; `:1811-:1812` to
`:1845-:1846`; `:1981-:1982` to `:2015-:2016`; `:2419-:2420` to `:2453-:2454`; `:2588-:2600` to
`:2622-:2634`; `:3320-:3327` to `:3354-:3361`; `:3408-:3420` to `:3442-:3454`. UNCHANGED, because
they stand below the hunk: `:177`, `:198`, `:324`, `:329-:330`, `:341`, `:367`, `:371-:385`,
`:427-:481`, `:453-:460`, `:531-:532`, `:750-:768`, `:926-:927`, `:971-:995`, `:980`, `:993`,
`:1012`, `:1013`, `:1161`.
Settled: every citation in the brief now names `a224c7b0`'s line.

### N1 the C5 window prediction - CORRECTED
Command: read `standingSeal()` at `rebuild/coach/test/engine-revision.test.cjs:54-80`.
Output: four branches - sealed receipt; no receipt AND no spec (THROWS); spec not `BRIEF-ACCEPTED`
(THROWS); spec `BRIEF-ACCEPTED` with `parent.chosen: S8` and `receipts/S8.json` present (returns the
WINDOW state, expecting the PARENT receipt, which is the value section 4 keeps).
Settled: C5 is red only between flipping the standing step and committing an accepted
`packages/S9.json`, and GREEN for the rest of the window. Sections 3.5 and 5(a) corrected.

### N2 design.cjs - CORRECTED, and it makes 12.1 worse rather than better
Command: read `rebuild/m3/w7-preview/today/design.cjs:33-48` at the chain tip.
Output: `:33-:42` is a `/* */` comment citing the HANDOFF line 9 and `MOCK.md` line 20 as an
AUTHORITY; `const APPROVED = Object.freeze([...])` at `:43-:48` holds TWO entries, the two HTML
paths, each with a `sha256`.
Settled: two of the four documents are prose in a comment, not runtime data. Section 2.4.1
corrected and the consequence carried into 12.1 and D-REFERENCE-CLOSURE.

### N7 the S8 report citation - CORRECTED
Command: read `rebuild/lanes/b/S8-PREP-AUTHOR-REPORT.md:115-121`.
Output: `:117` is the heading `## 3. THE NEEDLE TABLE, MEASURED`; the instruction begins at `:119`.
Settled: section 3.3 now cites `:119` onward.

### N11 the fifth CHILD_SPECS cell - CORRECTED
Command: search each of the five named cells at `a224c7b0` for the `'S9'` literal.
Output: `food`, `machine-settings-ui`, `problem` and `setup` carry it; `measure/test/boundary.test.mjs`
does NOT, its list still ends at `'S8'`.
Settled: E fact 12 now reads FOUR BUILT, ONE TO DO, with the fifth post TO MEASURE.

### N3 lane A's state - ANSWERED BY NEWS, not by argument
`DECISIONS:620` ACCEPTS lane A at `a224c7b0`. The review's "say built, re-check pending throughout"
is overtaken: the brief now says ACCEPTED, in the ONE place it marks lane A (section 5.1, with
section 3.1's row), and D-A-FINAL in section 8 is stated as SETTLED with Astra's D1, D2 and D3
quoted verbatim from `S9-PREP-RUNNER-RECHECK-L2.md` at `b5139467` plus the author's standing NOT
CLOSED list of `DECISIONS:598`.

### N4 the historical runner hash - CORRECTED
Command: `git show 2a8526b5:rebuild/lanes/b/tooling/b-package.cjs | sha256sum`.
Output: `71c1b2592b5a3544b71c0995a9f52b88fbe24cd6b821709309aa95e5ad3012c0`, NOT
`316f86c541f109a5876f5ea8d0557164151585f4f5940ce8878c3bec02bee43e`.
Settled: the stale REPORT and its already-updated RUNNER are now distinguished in section 12 item 1.

### N5 the historical workflow hash - CORRECTED
Command: `git show b9777fe4:.github/workflows/rebuild.yml | sha256sum` in the F2 worktree.
Output: `5e4353267924ebca1a19d996c317864475e77e0ba4deaddea09a15cdf1e776e0`, NOT `878baa7617f6...`.
Settled: section 2.3 now names `797b05c` as `878baa76...`'s head and marks the final combined post
TO MEASURE.

### N6 the reds table citations - CORRECTED
The review measured `DECISIONS:552` as an infrastructure-outage and preparation-status line and
A:594-605 as older tooling and mirror results; neither carries the boundary/setup red. This author
did not find a substitute coordinate that honestly carries it either, so the row now says the actual
output and head are TO CITE at integration rather than naming a wrong source. This is a correction
by REMOVAL of a false citation, which is the only honest fix available inside this round.

### N8 DECISIONS:535 and today-model.cjs - CORRECTED
Command: read line 535 of `rebuild/DECISIONS.md` at the chain tip.
Output: it reports the file as already "unpinned (six paths, zero hits in acceptance-s8-real-shape
...)"; it does not say the hotfix removed it.
Settled: section 1 now says "already outside the seal when the hotfix landed".

### N9 the three N5s - CORRECTED
Settled by reading, not by a new measurement: section 12.5 now routes the fence's paper corrections
to section 9 item 5, B-R6's own byte-equal wording note to that same re-take, and C-R5's
`s9NoDescents`-inside-`finally` note to P-PACK-5 and its narrow check, and says in those words that
none is discharged by doing another. Section 9 item 5 carries the same sentence.

### N10 the artifact export - ADDED
Settled by reading `proposed()` and `--ci` at `a224c7b0`: `proposed()` returns an object and `--ci`
writes no artifact. Section 6 step 4 and the new section 9 item 12 now require the serialization and
the PENDING review envelope, and re-proposal after any input change. The command itself is TO NAME
at integration and this author invented none.

### PM-A1 the canonicalSpecPaths comment - ADDED as an integration hand
Command: read `b-package.cjs:1228-1266` at `a224c7b0`.
Output: `:1228-:1229` reads "EVERY FIVE of the strings proposed() turns into executionPins - the
four a spec declares AND the two this file fixes itself". Four plus two is six; `proposed()` pins
through five routes. The function below it seeds the two fixed coordinates at `:1265-:1266`.
Settled: the comment is a comment, behaviour is unaffected, and it is corrected in the integration's
own runner commit BEFORE E fact 7 is done for the last time. It is NOT on D-A-FINAL's list.

## Loop round 1: what stayed OPEN, and why

Nothing in this list was decided by this author.

- **12.1, E fact 17 against PRODUCT-PINNED-UNCHANGED-IS-NOT-EXECUTED-BY-A-DECLARED-CHILD.** All
  three dispositions now carry an executed measurement and the reviewer's recommendation, (b), sits
  beside them. **The brief recommends none. The PM rules it.**
- **12.2, whether the E21 and E22 CI steps carry `if: ${{ !cancelled() }}`.** The reviewer
  recommends `!cancelled()` with condition-reading rows; recorded, not adopted.
- **12.4, which carriers the GATE-SUPERSESSION line names.** The input is corrected (B9) but the
  answer is still an integration measurement plus a PM line.
- **Section 9 item 8, the disposition of `ci-second-gate.test.cjs:29`.** The reviewer recommends
  explicit retirement with the two invariants re-homed; recorded, not adopted. Four options stand.
- **Lane C, the pack cells.** Still inside its own loop; its PENDING marker stays in its ONE place
  (section 3.1, with section 12.3) and no hand of this loop waited for it.

## Loop round 1: what was NOT disputed

Nothing. All ten blocking findings reproduced at the accepted head `a224c7b0`, so this round has
**zero DISPUTED findings**. Where a re-measurement at `a224c7b0` differs from the review's value at
`397ac466` - the runner sha256, the runner line numbers, the tooling suite total - the difference is
the ACCEPTED HEAD MOVING, not the reviewer being wrong, and each is recorded above as such.

