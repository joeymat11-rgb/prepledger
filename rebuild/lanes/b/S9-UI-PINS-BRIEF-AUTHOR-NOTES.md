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

