# S9-PREP-A AUTHOR REPORT - THE RUNNER

Ticket S9-PREP-A, lane B, tooling only, ON THE SEAL PATH. Branch
`rebuild/b-s9-prep-runner`, cut from `rebuild/b-s9-ui-pins` at `da9f8683`.

Design of record: `rebuild/lanes/b/S9-RELEASE-SPEC.md` v4, as corrected by
`rebuild/lanes/b/S9-RELEASE-SPEC-REVIEW-R4.md`; where the two disagree, R4
stands. Precedent: `rebuild/lanes/b/S8-PREP-AUTHOR-REPORT.md`.

**THIS REPORT IS A HYPOTHESIS.** The reviewer is told to disagree with it
wherever the evidence lets them.

## 0. THE RUNNER, BEFORE AND AFTER

| | sha256 | lines |
|---|---|---|
| at `da9f8683`, the bytes the spec's line numbers are taken from | `e31dd206c0fb0fc0c295df45eae3992d4c59b1a76de8da04a4d0f22948e9335e` | 3252 |
| **FINAL, at the head of this branch** | **`d0021d5ca6871a832ee3d3853cc85370663392abaf4ce7654d0ddb5c5a66ee38`** | **3523** |

Every line number below is in the FINAL runner, anchored by content and
re-measured after the last hunk landed. The spec's own numbers are cited
beside them where they differ, which they do for every hunk after H1, because
the hunks carry their reasons in comments.

## 1. THE HUNK TABLE

| H | landed at | what it does, in one sentence | the red-first cell that proves it |
|---|---|---|---|
| H1 | `:367` (spec `:351`) | `PRODUCT_ROLES` gains `'released'` as the sixth and last word of the closed vocabulary, fixed here and nowhere else (W7) | B.8 (1), and F6b in `pinned-unchanged-and-ruled-substitutions.test.cjs` |
| H2 | `:993-:995` (spec beside `:932-:933`) | `RELEASE_GRANT`, `RELEASE_GRANT_SHAPE` and `releaseGrants()`, the token's grammar, beside the `GATE-SUPERSESSION` token they mirror | B.8 (1), (6) |
| H3 | `:1314-:1358` (spec: new, beside `supersessionRuling()` `:1189`) | `releaseRuling(s, bound)`: B.2 steps 1 to 6, no cache, unique sha, ` RULED` terminal, package-named, set equality both ways, parent-pin membership, and child-argv disjointness | B.8 (4), (5), (6), (7), (8) |
| H4 | `:1673-:1674` (spec `:1517-:1531`) | in `spec()`'s product loop, a `released` pin declares `post === null`, by its own refusal name | B.8 (1b) |
| H5 | `:1142` and `:1591-:1595` (spec after `:1531`) | `SPEC_KEYS` gains the OPTIONAL key `release`, closed with the freeze pattern, and the block gets a closed key set of its own | B.8 (1b) |
| H6 | `:2092` (spec `:1894`) | `product()`'s parent-pin branch admits `'released'` beside `carried` and `edited`, which is the one place a parent pin's role is judged | B.8 (2) |
| H7 | `:2161` plus the bucket at `:2075` (spec `:1952`, `:1888`) | a released path leaves the inventory walk ONE LINE above the disk hash, into a bucket of its own, so it is never hashed and can never reach the drift assert | B.8 (3) |
| H8 | `:2201-:2203` (spec `:1983-:1987`) | `product()`'s terminal `say` gains the released clause: the count, the ledger line, the parent that sealed them, and the paths | B.8 (3) |
| H9 | `:2081` (spec `:1889`) | the ruling is resolved at the loop entry, BEFORE a byte of the inventory is read, so the ledger binds before the walk does | B.8 (4) to (8) |
| H10 | `:3028-:3034` and `:3059-:3061` (spec `:2826`) | `proposed()` keeps released entries OUT of `product` and builds the `released` block from the spec and the ruling; the block is emitted only when something is released | B.8 (9), and (X1) |
| H11 | `:3079` and `:3283` (spec `:2830`) | `ARTIFACT_KEYS` gains the OPTIONAL key `released`, closed in `envelope()` with the same freeze pattern | B.8 (9), and (X1) |
| H12 | `:3256` (spec `:2993`) | `writeSealedRunReceipt()` never puts a released path into the receipt's product map | B.8 (10) |
| H13 | `:3226-:3231` and the count at `:3458-:3462` (spec `:2970`, `:2972`, `:3190-:3194`) | `sealedRunReceipt()` skips released paths in BOTH directions, and the AUTHORIZED STEP say no longer over-counts what it re-verified | B.8 (10) |
| **H17** | `:1988-:1994`, `:2031-:2032`, `:2038-:2041` (spec `:1852`, `:1855-:1858`) | `releasedAncestry(a, ga)` and ONE `continue` in the GRANDPARENT walk, plus the say clause naming how many pins the skip stood aside for | B.8 (11), (12) |
| H14 | `:177` (spec `:173`) | `IDS` gains `'S9'`, directly behind `'S8'` and still ahead of `'B1'` | F6 |
| H15 | `:324` (spec `:316`) | `NO_REGISTER_IDS` gains `'S9'` | F6 |
| H16 | `:443-:479` (spec `:405`) | `CHILD_ROOTS` gains FOUR at the END of the list | F7 |
| + | `:385` | `TOOLING_FILES` gains `test/release-from-seal.test.cjs` IN THE SAME HUNK that created the file (E fact 13, F.1 R4) | F.1 R4: without it `fidelity()` calls the file `UNLISTED-SOURCE-CHANGE` on the first `--ci` run |

H18, H19 and H19b are NOT in this ticket: H18 is a sealed cell
(`today/test/package.test.cjs`, owned elsewhere this round) and H19/H19b are
lane C cells under `rebuild/lanes/c/ui-port/`, which E.2 puts on the WAIT
list. Nothing in this branch touches any of the three.

## 2. THE MUTATION TABLE, MEASURED

One hunk reverted at a time, the original bytes restored in a `finally` after
every run, the runner's sha256 re-checked after the last restore. The first
pass was run on the PC in the worktree (`%TEMP%\s9a-mutate.cjs`, throwaway,
never committed); three rows were re-measured independently in a farm scratch
worktree at `afbf930b` (`/home/claude/farm/scratch/wt/s9a-mut`), which ended
with the runner back at `d0021d5c...ee38`, the same sha the PC carries.

| revert | cells that go red | the refusal it prints |
|---|---|---|
| H1 | B.8 (1) | `PRODUCT_ROLES` is five, not six, so a spec declaring the word refuses `PRODUCT-ROLE-NOT-IN-THE-CLOSED-VOCABULARY` |
| H2 | nine cells | `RELEASE_GRANT_SHAPE is not defined` |
| H3 | eight cells | `releaseRuling is not a function` |
| H4 | B.8 (1b) | H4 no longer stands in the `spec()` product loop |
| H5 | B.8 (1b) | H5 no longer closes the spec keys with the freeze pattern |
| H6 | B.8 (2), (3), (8) | `PARENT-PRODUCT-PIN-NOT-DECLARED-CARRIED-OR-EDITED rebuild/m3/w7-preview/today/preview.css` |
| **H7** | **B.8 (2), (3), (8)** | **`UNLISTED-PRODUCT-DRIFT rebuild/m3/w7-preview/today/preview.css rebuild/m3/w7-preview/today/build.mjs`** (RE-MEASURED in the farm: 10 pass / 3 fail) |
| H8 | B.8 (3) | the released clause is gone from the PRODUCT say |
| H9 | seven cells | `Missing expected exception`: the ledger stops binding the inventory |
| H10 | B.8 (9) | a released path is back inside `product`, which is to say it is inherited |
| H11 | B.8 (1) | `ARTIFACT_KEYS` does not carry `'released'` |
| H12 | B.8 (10) | the write no longer skips released paths |
| **H13** | **B.8 (10)** | **the receipt this seal step wrote no longer re-verifies** (RE-MEASURED in the farm: 12 pass / 1 fail) |
| **H17** | **B.8 (11), (12)** | **`GRANDPARENT-PIN-BROKEN rebuild/m3/w7-preview/today/preview.css`** (RE-MEASURED in the farm: 11 pass / 2 fail) |

**THE WEAKEST ROW, named as such.** H4 and H5 live inside `spec()`, which no
lane-B cell can call: `spec()` reads `packages/<ID>.json` off disk, holds it
to its own bytes in Git at HEAD, and validates a whole envelope, so
exercising it needs a fixture PACKAGE rather than a fixture object. The first
mutation pass found that reverting either left the suite at 12 pass / 0 fail.
Rather than leave two hunks unobserved, B.8 (1b) pins both SITES by reading
the runner - the house precedent is `gate-supersession.test.cjs`, which
asserts the runner's own refusal text at three sites the same way - and H5's
RULE is still executed, because the cell runs the runner's own `keys()` over
`SPEC_KEYS` with the release block present, absent, and with an invented key
beside it. A reviewer who wants better evidence here would have to build a
fixture package directory, and that is a fair thing to ask for.

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
| the AUTHORIZED STEP re-verify count `:3458` | whole inventory | **inventory minus released**, with the released named in a clause | B.8 (10) |
| `pins()`'s `gkept` say `:2038` | N grandparent pins | **N, plus a clause naming how many the skip stood aside for and which** | B.8 (11) |
| `CHILD_SPECS` in four `today/test/` cells | ends `'S8'` | **ends `'S9'`** | the four suites themselves |
| the six `s9-*` mirrors' generation | SIXTH | **SEVENTH** | read by hand, cell by cell; see section 7 |

## 5. `--ci --package S8` AND `H3`, BEFORE AND AFTER

The refusal NAME is what the S8 preparation report reports, because a named
refusal is the expected pre-ruling state and the run never reaches a verdict
this round: `packages/S9.json` is on the WAIT list.

| when | runner | `--ci --package S8` | `--ci --package H3` |
|---|---|---|---|
| **BEFORE this lane's first edit**, measured at `da9f8683` in a detached scratch worktree (`node_modules` junctioned, NO private junction, worktree removed after) | `e31dd206...335e` | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 |
| at `afbf930b`, after H1 to H17 and before E fact 7 | `d0021d5c...ee38` | `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER`, exit 1 | `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER`, exit 1 |
| with the re-pins on disk and NOT yet committed | `d0021d5c...ee38` | `SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT`, exit 1 | `SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT`, exit 1 |
| **AFTER the last edit**, re-pins committed | `d0021d5c...ee38` | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 | **`SEALED-PROFILE-RECOMPUTATION`**, exit 1 |

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
differs but the runner sha and the spec sha.

## 6. WHERE THE SPEC AND THE RUNNER CANNOT BOTH BE RIGHT

Reported rather than bent. Five, and the first two are corrections that
already had to be made for the hunks to land at all.

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
refuses everywhere else.

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

## 8. THE BAR, RUN ON THE PC AT THE HEAD OF THIS BRANCH

`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, `node --test
--test-reporter=tap`, each file on its own.

**Every file under `rebuild/lanes/b/tooling/test/` - 123 pass, 0 fail, ten
suites, every one exit 0:**

| suite | pass | fail |
|---|---|---|
| `child-diagnostic-tail` | 11 | 0 |
| `execution-targets` | 9 | 0 |
| `gate-supersession` | 15 | 0 |
| `parent-gate-closure-and-load-floor` | 14 | 0 |
| `parent-pin-shapes-and-spec-successors` | 9 | 0 |
| `pinned-unchanged-and-ruled-substitutions` | 17 | 0 |
| `product-phase-and-ledger` | 7 | 0 |
| **`release-from-seal`** (new) | **15** | **0** |
| `seal-tip-and-byte-identity` | 17 | 0 |
| `successor-moves` | 9 | 0 |

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
