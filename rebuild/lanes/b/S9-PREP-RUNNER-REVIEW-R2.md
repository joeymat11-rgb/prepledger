# S9-PREP-RUNNER-REVIEW-R2 - independent review of ticket S9-PREP-A, second round

Reviewed at `ade31333` (branch `rebuild/b-s9-prep-runner`), against the branch base
`da9f8683`. Runner as it ships: **3580 lines**, sha256
`25ddc44c32d0d71b924cf62c2e0a8647697b6e77a55a91a132388217b6789ca6`, re-taken on the PC.
Design of record: `S9-RELEASE-SPEC.md` v4 with `S9-RELEASE-SPEC-REVIEW-R4.md` standing where
the two disagree.

Method, in the order I worked: the DIFF first, file by file, every runner hunk line by line
against spec B, in the farm; then my own re-derivation of the six mirrors; only then the
author report and `S9-PREP-RUNNER-REVIEW-R1.md`. On the PC I re-ran the whole bar, re-took the
mutation table in a scratch worktree of my own with my own harness, checked out both red-first
commits and ran the suite against the runners they name, and ran a blind attack plan written
before the build existed as real fixture cases against the built runner. The scratch worktree
is removed; the only file I commit is this one.

---

## VERDICT: ACCEPT WITH NOTES

The mechanism is right and I could not break it. Red-first is literal and reproduces to the
cell. Every hunk of H1 to H13 and H17, plus the fix round's HR-B1 and HR-B2, goes red when
reverted alone. Both R1 BLOCKING fixes are real and are themselves red-first. Every attack in
my blind plan that the runner should refuse, it refuses - including the nine that B.8 does not
cover and that I built as fixtures myself. The owned-files fence is clean: twenty-three files
touched, every one on the ticket's owned list.

One BLOCKING, and it is about EVIDENCE rather than about code: one specified behaviour of H13
is claimed to be proved by a cell that cannot reach it, and reverting it turns nothing red
anywhere in the bar. The hunk itself is correct. The fix is a report correction and, if the PM
wants it, one honest sentence about what would pin it. That is why this is ACCEPT WITH NOTES
and not REJECT: nothing on the seal path has to move.

---

## 1. BLOCKING

### BLOCKING-1. H13's COUNT sentence is pinned by nothing, and the report says it is pinned by B.8 (10)

`b-package.cjs:3515-:3519`, the `AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY` say. H13 changed
`Object.keys(s.product).length` to
`Object.values(s.product).filter(p => p.role !== 'released').length` plus a clause naming the
released paths. `S9-RELEASE-SPEC` B.6 states this as a requirement of H13 in terms: "H13 must
change the COUNT too or it over-counts by the number of released paths".

MEASURED. I reverted that one expression and ran **every one of the ten lane-B tooling suites**:

```
H13-count-say :: NOTHING RED ANYWHERE
```

against a BASE of `NOTHING RED ANYWHERE`. The same harness, same run, shows every other piece
of H13 IS observed once the whole bar is run rather than `release-from-seal.test.cjs` alone:

```
H13a-forward-skip :: seal-tip-and-byte-identity fail=2
H13b-reverse-skip :: release-from-seal fail=1 ;; seal-tip-and-byte-identity fail=1
H12-write-skip    :: release-from-seal fail=1 ;; seal-tip-and-byte-identity fail=2
H8-say-clause     :: release-from-seal fail=2
H17-say-clause    :: release-from-seal fail=1
H7-bucket-only    :: five suites red
```

WHY IT CANNOT BE REACHED, which is the part that matters. The sentence stands at `:3515`, and
the `// 8. main sequence` delimiter is at `:3471`. Every lane-B cell compiles
`fixtureSource.slice(0, fixtureSource.indexOf(delimiter))` - the suite's own line 175 - so the
main sequence is sliced off before the module is built. No cell in this suite, or in any of the
other nine, can execute that say, now or later, without a different harness.

WHY IT IS BLOCKING RATHER THAN A NOTE. The report is honest about exactly this class elsewhere:
section 2's "THE WEAKEST ROW, named as such" says H4 and H5 live inside `spec()`, which no
lane-B cell can call, and pins them by READING the runner instead. H13's count is the same
class and is NOT named. Worse, section 4's ordinal table asserts the opposite:

| the AUTHORIZED STEP re-verify count `:3458` | whole inventory | inventory minus released ... | **B.8 (10)** |

B.8 (10) is `release-from-seal.test.cjs`'s receipt cell. It does not touch this sentence and
cannot. On a round whose stated standard is that no count moves in silence, the one count the
spec singles out is the one whose guard is a claim rather than a measurement, in a report the
PM reads line by line before writing a ledger line.

THE CHEAP FIX, and I do not insist on which: (a) correct the ordinal table to name this row in
the H4/H5 unreachable class and say what would pin it - `release-from-seal.test.cjs` already
reads the runner's own text for H4 and H5 at B.8 (1b), and the same three lines would pin this
site; or (b) build the fixture package directory the report already says a reviewer would be
fair to ask for, which reaches `spec()` and the main sequence together and closes H4, H5 and
this row at once. Either way the runner byte moves only under (b), so E fact 7 is redone only
if the PM takes (b).

---

## 2. NOTES

**N1. The "NOT RULED" hole reproduces, and it is correctly routed. STILL OPEN.** Re-measured
from scratch on my own fixture, not from R1's:

```
ATTACK A3 line ends "NOT RULED" :: ADMITTED
```

Both paths leave the sealed inventory on a line whose last two words are NOT RULED. I agree
with the author's DISPUTE as a code change, for his reason and not only his conclusion:
`supersessionRuling()` carries the identical regex and frees carriers on it today, the ticket
required the mirror line for line, and strengthening one side would leave the chain with two
ruling functions that disagree about what a ruled line is. The cell title was corrected to what
it measures, the exception is stated in `releaseRuling()`'s own header, and no cell pins the
hole as intended behaviour, which is the one thing that would make it permanent. **This is the
highest-value open item in the round and the PM should rule before he writes the token line,
because that line is the first thing the regex will judge.** One line in each of two functions,
one cell in each of two suites, and E fact 7 redone after it.

**N2. H17 skips by PATH NAME ALONE, and the narrowing that would close F.1 R9 completely is one
line.** My own attack, not in B.8 and not in R1:

```
ATTACK NEW-1 ancestor released block with a WRONG lastSealedSha256 :: ADMITTED
```

`releasedAncestry()` collects `Object.keys(art.released)` and the skip asks only whether the
path is in that set. An ancestor artifact whose `released[file].lastSealedSha256` disagrees with
the grandparent's pin for the same file is skipped anyway. NOT REACHABLE through this runner:
`proposed()` writes `lastSealedSha256: p.pre`, `releaseRuling()` has already asserted
`p.pre === parentPin(pmap[file], file)`, and `same(m, proposed(s, bound))` plus the artifact's
own byte-pin close the loop, so producing the mismatch needs an accepted, PM-reviewed, sealed
artifact that contradicts itself. I raise it because F.1 R9 is named as the risk that "nothing
shows", and `assert.equal(a.released[file].lastSealedSha256, parentPin(entry, file))` above the
`continue` would make the skip narrow by MEASUREMENT rather than by construction. Author's call;
it is defence in depth either way.

**N3. H4's rule now has TWO sites it cannot be reached from, not one.** R1 N3 measured that a
released pin with a real `post` is caught only by `spec()`. I re-measured with `post !== pre`,
which is the shape R1 meant:

```
ATTACK B4c released with a DIFFERENT post, through product() :: ADMITTED
ATTACK B4c proposed() lastSealedSha256 == pre ? true
```

`product()` admits it (H7's skip fires on the role before anything reads `post`) and
`proposed()` silently drops the post and writes `lastSealedSha256: p.pre`. `spec()` always runs
first, so this is defence in depth and not a hole, and I agree with the author that a second
assert in `product()` would put one rule in two places. It belongs beside BLOCKING-1 because
both are the same fact: the three hunks that live in `spec()` and the main sequence are the
three this suite pins by reading rather than by running.

**N4. A released path DELETED from the working tree is admitted. DISPUTE UPHELD, and it should
become a spec sentence.**

```
ATTACK B9 released path DELETED from the working tree :: ADMITTED
```

The author's answer - "a release hands a file out of the sealed inventory, and this runner then
has no opinion about whether the file exists" - is the right reading of `DECISIONS:536` and I do
not overturn it. An existence assert would refuse a seal because the lane that now owns the file
deleted it. But the spec is silent, not agreeing: `B.7` says what a re-seal looks like and says
nothing about a deletion. One sentence in B.7 or D closes it for the next reader, who will
otherwise find this the way two reviewers now have.

**N5. `RELEASE-CHAIN-REF-ABSENT` does not exist, and the hazard is inherited rather than new.**

```
ATTACK A8 CHAIN_REF absent :: Command failed: git show refs/heads/no-such-ref:... :: named? null
```

`failCode()` returns null, so this prints a bare FAIL where every neighbouring refusal carries a
name. NOT reachable in CI: `parent()` at `:1896` already reads `L.object(root, CHAIN_REF, ...)`
on every `--ci` run, so a runner that could not resolve the ref would already be failing before
`releaseRuling()` is called. Agreeing with R1 N5 and with the author that naming it on one side
of the mirror only is the same divergence N1 is disputed on. It belongs in the same PM question
as N1: both functions, one ruling.

**N6. The `ui-port` deferral is forced and correct, and it is still a deviation the PM must
record by name.** E fact 3 names `rebuild/lanes/c/ui-port/` as a new `CHILD_ROOT` and E fact 4
makes it the one `PUBLIC_TAIL_ROOTS` addition; the ticket repeats both. Neither landed. I
verified the rule that forces it myself rather than from the report: `rebuild/lanes/c/` on this
branch holds `dad-first-run`, `hand-proof`, `p3-today-hotfix`, `passphrase-normalize`,
`reviews` and `s9-today-carry` and no `ui-port`; F7's last loop is
`assert(fs.existsSync(path.join(sourceRoot, root)), root + ' is a real directory of this
repository')`; and F8 additionally asserts that every `PUBLIC_TAIL_ROOTS` entry is also a
`CHILD_ROOT`, so the tail entry could not land without the child root either. Adding either
ships a red bar. TWO things follow. First, the deferral has to survive into E.2's single
re-measure or the root is simply lost; it is in the author report and in a runner comment and in
no spec. Second, my own blind attack plan asked for the BASIS of the `PUBLIC_TAIL_ROOTS` entry
in writing before it is added - that list says a suite's output may be PRINTED, and the pack
cells print the owner's approved-pack path names and shas into a public log - and that question
is now deferred with the entry rather than answered. It should be answered before the re-measure
adds it, not at the same time.

**N7. Two cites in the ordinal table point at code they do not name.** Section 0 promises "every
line number below is in the FINAL runner ... re-measured after the last hunk landed". Section 1's
hunk table keeps that promise at every row I checked. Section 4's ordinal table does not:

| report says | actually at | `:cited` is |
|---|---|---|
| `pins()`'s `gkept` say `:2038` | `:2070` | `assert.equal(diskSha(g.artifact), g.sha256, 'GRANDPARENT-ARTIFACT-BYTES')` |
| the AUTHORIZED STEP re-verify count `:3458` | `:3515` | `for (const gate of R.GATES) {` |

Neither changes a conclusion. Both suggest section 4 was carried forward while section 1 was
re-taken, and section 4 is the table BLOCKING-1 is about.

**N8. My H7 revert and the author's disagree by one cell, and both prove the hunk.** The report's
row is 12/5 with (X2) red; mine is 13/4 without it. The difference is method: the report reverts
H7's `continue` AND its `released: []` bucket together, which makes `at.released` undefined; I
reverted the `continue` alone. Reverting the BUCKET alone is worth recording separately, because
it turns five suites red, not one - `execution-targets`, `parent-pin-shapes-and-spec-successors`,
`pinned-unchanged-and-ruled-substitutions`, `product-phase-and-ledger` and `release-from-seal` -
so the two halves of H7 are separately observed and neither is carried by the other.

**N9. The mutation table understates its own coverage for H13, and that is worth fixing in the
same edit as BLOCKING-1.** Run against `release-from-seal.test.cjs` alone, H13's forward skip is
a no-op; run against the whole bar it turns `seal-tip-and-byte-identity.test.cjs` red, through
the "a receipt written BEFORE the release, which still carries the path, does not void either"
row the author wrote for exactly that. The report's single H13 row hides a genuinely good piece
of design behind a narrower measurement than the author actually has.

**N10. The six mirrors re-derived independently, and the hand corrections are all improvements.**
I wrote my own substitution script from E fact 5's list and diffed its output against the
committed files. THREE of six are byte-identical to a pure mechanical substitution
(`defect-witnesses`, `inherited-carriers`, `second-gate`). The other three differ in exactly
eight comment regions, and every one makes TRUE a sentence the substitution would have made
false:

- `s9-engine-files-differential.cjs`, two: "templated on S8's ... which was templated on S7's"
  and the comparison-chain sentence ("S8's own differential proved all 45 identical to S7's").
- `s9-supersede-source-carriers.test.cjs`, four: the ancestor list ("S7 the fifth, S8 the sixth
  and S9 the seventh"); `:37`'s ":527 is the PARENT's token line", which the spec's substitution
  set MISSES because the ledger cite is written bare (`:514`) and not as `DECISIONS:514`;
  `:162`'s "THE PARENT IS S8, NOT S7"; and the `assert.equal(PARENT.packageId, ...)` message.
- `s9-supersede-writers-differential.test.cjs`, two: the whole product story of `:27-:34`, which
  mechanically would have told S8's, plus the added clause about the released role.

No assertion, threshold, regex, red control or mutation control differs in any of the six; all
six are pure ASCII. The report says FIVE hand corrections where I count eight regions - it groups
the two source-carriers contrast lines and the two writers-differential clauses - which is a
counting convention and not an error. The one substantive claim in the added text, "a released
file is role `released`, which is not `carried`, so it IS one of the files SUP-13 walks", is
consistent with the cell as it stands.

**N11. The freeze pattern's real closure holds in both directions.**

```
ATTACK D1  artifact with an extra top-level key  :: REFUSED :: Closed acceptance-artifact keys
ATTACK D1b artifact MISSING a required key       :: REFUSED :: Closed acceptance-artifact keys
ATTACK NEW-2 key closure admits released:{} ? yes ;; same() admits it ? false
```

So `keys({ ...m, released: null }, ...)` admits the KEY and `same(m, proposed(s, bound))`
refuses the VALUE, which is where this artifact's closure has always lived. The optional-key
deviation the author reports as (1) is the right call and is not a loosening.

**N12. `PUBLIC_TAIL_ROOTS` is unchanged and F8 needed no edit, but nothing pins the DECISION that
S9's four roots are not tail-public.** F8's withheld list names S6's six and is not extended;
neither were S7's or S8's single additions, so this is precedent and not a regression. Recorded
only so the PM knows the four roots' tail policy rests on `PUBLIC_TAIL_ROOTS.length === 6` and
on nothing that names them.

---

## 3. R1's FINDINGS: FIXED, STILL OPEN, OR DISPUTE UPHELD

| R1 | my verdict | the evidence I took myself |
|---|---|---|
| **BLOCKING-1** disjointness closes one of three doors | **FIXED, and wider than R1 asked** | `releaseRuling()` now builds the set the way `proposed()` builds `executionPins` - runner, spec file, brief, carrier successor, argv - and I confirmed the five routes against `proposed()` `:3055-:3059` line by line. Reverting HR-B1 alone turns `(R1-B1)` and only `(R1-B1)` red. The cell is red-first at `c736b614`: I checked that commit out and measured **14 pass / 3 fail** against the runner it names, `d0021d5c...ee38` |
| **BLOCKING-2** `rulingLine` is a live line NUMBER | **FIXED by dropping the field** | The sealed entry carries four keys and not one of them an index. Reverting HR-B2 alone turns `B.8 (9)` and `(R1-B2)` red with a `deepStrictEqual` on the five-key entry. Red-first in the same commit. The deviation from what B.4 DRAWS is reported as section 6 (6) with the alternative weighed, which is the right handling: the PM can still choose declared-and-asserted |
| **BLOCKING-3** the RULED test admits "NOT RULED" | **DISPUTE UPHELD as a code change; STILL OPEN as a PM question** | Re-measured ADMITTED on my own fixture. See N1. The cell title, the function header and the report all now say what is true, and no cell pins the hole as intended |
| **BLOCKING-4** nine U+2014 in eight added lines | **FIXED** | I scanned every ADDED line of the whole lane diff across all twenty-three touched files: **zero U+2013 and zero U+2014**. The six mirrors and `release-from-seal.test.cjs` are pure ASCII outright |
| N1 `ui-port` deferral is right | AGREED, and see my N6 for what is still owed |
| N2 `s9-today-carry` needs a root | **AGREED, verified independently**: `rebuild.yml:306` is one step naming `rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs` and `rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs` in one `node --test`, and `childArgv()` judges every target against `CHILD_ROOTS`. The ticket's own measured question is answered correctly, and the two roots do stand or fall together |
| N3 a real `post` is caught only by `spec()` | AGREED and re-measured; see my N3, which adds that `product()` admits it and `proposed()` drops it silently |
| N4 a deleted released path is admitted | DISPUTE UPHELD; see my N4 |
| N5 `RELEASE-CHAIN-REF-ABSENT` does not exist | AGREED and re-measured; see my N5 |
| N6 the release frees DESCENDANTS, not S9 | **AGREED and re-measured**: `G1 :: REFUSED :: PARENT-PIN-BROKEN-AT-SOURCEBASE preview.css`, `G1b :: ADMITTED`. It is a caution for the S9 BUILD round and the author records it as one |
| N7 H17's comment claimed a reason the measurement denies | **FIXED, and I re-measured the measurement**: my own three-generation fixture (S11 over S10 over S9) prints `(no released clause: the ga half is a NO-OP)`. The comment now says exactly that and keeps the union as defence in depth |
| N8 the say can name one more path than it counts | **FIXED, and I proved the fix**: with the PARENT re-declaring one released path (B.7's re-seal), the say reads `(plus 1 skipped ... : build.mjs)` and does NOT name `preview.css`. Count and list are the same array and cannot disagree |
| N9 three cells are not red-first | AGREED; the fix round's two ARE, measured above |
| N10 a duplicate comma member is admitted | AGREED, and I could not turn it into anything either |
| N11 3523 vs 3522 is a convention | AGREED; the report now uses `wc -l` throughout and I measure 3580 by that convention |

---

## 4. THE BAR, RE-RUN BY ME ON THE PC

`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, each file on its own, at `ade31333` in
`%TEMP%\earned-s9a`.

**Every file under `rebuild/lanes/b/tooling/test/`: 125 pass, 0 fail, ten suites, every one
exit 0.** `child-diagnostic-tail` 11, `execution-targets` 9, `gate-supersession` 15,
`parent-gate-closure-and-load-floor` 14, `parent-pin-shapes-and-spec-successors` 9,
`pinned-unchanged-and-ruled-substitutions` 17, `product-phase-and-ledger` 7,
**`release-from-seal` 17**, `seal-tip-and-byte-identity` 17, `successor-moves` 9. Every number
matches the report.

**The six `s8-*` siblings: 16 pass, 0 fail** over the five `*.test.cjs` (3/3/3/4/3), and
`s8-engine-files-differential.cjs` exit 0.

**The six `s9-*` cells: 0 pass / 1 fail each, exit 1**, every one the same load error,
`ENOENT ...\rebuild\lanes\b\tooling\packages\S9.json`. `packages/S9.json` is on the WAIT list and
the S8 round had the same ordering. Not a defect; the cells stand ready.

**The four `CHILD_SPECS` suites:** `food` 57/0 exit 0; `machine-settings-ui` 54/0 exit 0;
`problem` 131/0 exit 0; **`setup` 156 pass / 1 fail, exit 1**, at
`re-pin - every file the B-NTC package pins is untouched by A4b, on disk`.

**THE `setup` FAILURE IS PRE-EXISTING AND I PROVED IT AT THE BASE, not from the report.** I built
a worktree at `da9f8683` - before this lane's first edit, with `CHILD_SPECS` still ending `'S8'` -
and ran the same cell: the same `not ok 151`, the same name. It is the three S9-TODAY-CARRY
declarations the branch carries and no `packages/*.json` declares yet, and it goes green when S9
declares them. Not this lane's edit and not this lane's fix.

**`--ci --package S8` and `--ci --package H3`, BEFORE and AFTER, both taken by me:**

| | runner | S8 | H3 | roots |
|---|---|---|---|---|
| at `da9f8683`, in my own detached worktree | `e31dd206...335e` | `SEALED-PROFILE-RECOMPUTATION`, exit 1 | `SEALED-PROFILE-RECOMPUTATION`, exit 1 | `under 20 fixed root(s)` |
| at `ade31333`, the head | `25ddc44c...9ca6` | `SEALED-PROFILE-RECOMPUTATION`, exit 1 | `SEALED-PROFILE-RECOMPUTATION`, exit 1 | `under 24 fixed root(s)` |

Same named refusal at both ends, which is (X1) at the run level: the runner grew a role and
neither of these two packages notices. The only observation-line difference is the two shas and
the root count, and the root count is H16's, by design.

**E fact 7, checked rather than read:** exactly seven `runnerSha256` re-pins, `+1/-1` each, in
`H3`, `S3`, `S4`, `S5`, `S6`, `S7`, `S8`, all to `25ddc44c...9ca6`, and `packages/S8.json` is the
one file still carrying `e31dd206...335e` - correctly, because that is its own product post for
the runner and E fact 7 does not re-target it.

---

## 5. THE MUTATION TABLE, RE-TAKEN WITH MY OWN HARNESS

My harness, my anchors, one revert at a time from the head bytes, original restored in a
`finally` after every run. It printed `BASE sha 25ddc44c32d0` and `RESTORED sha 25ddc44c32d0`,
and a second pass over the suspicious rows printed `RESTORED bytes equal: true`. BASE: **17 pass
/ 0 fail**, and `NOTHING RED ANYWHERE` across all ten suites.

| revert | red cells I measured | agrees with the report? |
|---|---|---|
| H1 | (1) | yes, 16/1 |
| H2 | (2)(3)(5)(6)(7)(8)(R1-B1)(9)(R1-B2) - `RELEASE_GRANT is not defined` | yes |
| H3 | (2) to (9), (R1-B1), (R1-B2), (X1), (X2) - `releaseRuling is not defined` | yes, 5/12 |
| H4 | (1b), `H4 stands in the spec() product loop` | yes |
| H5a (the freeze call) | (1b), `H5 closes the spec keys with the freeze pattern` | yes |
| H5b (the `SPEC_KEYS` entry) | (1), (1b) | yes |
| H6 | (2)(3)(8)(R1-B1) - `PARENT-PRODUCT-PIN-NOT-DECLARED-CARRIED-OR-EDITED preview.css` | yes, 13/4 |
| H7 the `continue` | (2)(3)(8)(R1-B1) - `UNLISTED-PRODUCT-DRIFT preview.css build.mjs` | 13/4 vs the report's 12/5; see N8 |
| H7 the bucket alone | FIVE suites red | not in the report; see N8 |
| H8 | (3)(R1-B1) | yes |
| H9 | (2) to (8), (R1-B1), (X2) - `Missing expected exception` and `an unreachable chain must refuse` | yes, 8/9 |
| H10 `product: productMap` | (9) | yes |
| H10 the `released` spread | (9)(R1-B2) | yes |
| H11 | (1)(X1) | yes |
| H12 | (10), and `seal-tip` twice | yes |
| H13 forward skip | `seal-tip` twice; NOTHING in `release-from-seal` | see N9 |
| H13 reverse skip | (10), and `seal-tip` once | yes |
| **H13 the COUNT** | **NOTHING RED ANYWHERE** | **BLOCKING-1** |
| **H17 the `continue`** | **(11)(12) - `GRANDPARENT-PIN-BROKEN preview.css`** | yes |
| H17 the say clause | (11) | yes |
| HR-B1 | (R1-B1) - `Missing expected exception` | yes |
| HR-B2 | (9)(R1-B2) - `deepStrictEqual` on the five-key entry | yes |

**Every hunk of H1 to H13 and H17 goes red when reverted alone, except H13's count sentence.**

---

## 6. RED FIRST, CHECKED OUT AND RUN

Not read from a commit message: checked out in my own detached worktree and executed.

| commit | runner it ran against | result |
|---|---|---|
| `acdac273` "release-from-seal.test.cjs, RED FIRST against the unchanged runner" | `e31dd206c0fb...335e`, the byte the spec cites | **0 pass / 12 fail, exit 1**, and the twelve `not ok` lines are B.8 (1) to (12) in order |
| `c736b614` "the two R1 BLOCKING cells, RED FIRST" | `d0021d5ca687...ee38`, the runner R1 reviewed | **14 pass / 3 fail, exit 1**: `(R1-B1)`, `B.8 (9)` and `(R1-B2)` |

Both commit messages carry the measured failure lists and both match what I measured to the
cell. Red first is literal in this lane, in both rounds.

---

## 7. THE BLIND ATTACK PLAN, RUN AS REAL FIXTURE CASES

Written before the build existed, from spec B and the runner at `da9f8683`. Built on the
committed cell's OWN harness header - same fixture tree, same fixture chain ref, same built
runner - so the results are comparable with B.8's. Nine of these are rows B.8 does not carry.

| attack | result | in B.8? |
|---|---|---|
| A2 ruled line on DISK only, never committed to the chain ref | REFUSED `...NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH 0 line(s)` | no |
| A3 line ends "NOT RULED" | **ADMITTED** - N1 | no |
| A4b package id prefix `M2-S9-UI-PINS-EXTRA` | REFUSED `RELEASE-RULING-DOES-NOT-NAME-THIS-PACKAGE` | no |
| A5 the five r10b N1 wrappers | REFUSED `...DOES-NOT-CARRY-THE-GRANT-TOKEN`, all five | yes, (6) |
| A6 two byte-identical ruled lines | REFUSED `...NOT-A-UNIQUE... 2 line(s)` | no |
| A7 the PM WITHDRAWS the line between `product()` and `proposed()` | phase 1 ADMITTED, **phase 2 REFUSED** `0 line(s)` - the no-cache lesson holds | no |
| A8 `CHAIN_REF` absent | unnamed `Command failed`, `failCode` null - N5 | no |
| A9 empty member `a,,b` | REFUSED `...DOES-NOT-CARRY-THE-GRANT-TOKEN` (the regex rejects the whole token) | no |
| A9 `..` in a member | REFUSED `RELEASE-GRANTED-PATH-IS-NOT-DECLARED-RELEASED` | no |
| A9 leading `/`, trailing `/` (a directory), case-flipped `Rebuild/...` | REFUSED `RELEASE-DECLARED-PATH-IS-NOT-GRANTED`, each | no |
| B4c released with a DIFFERENT `post` through `product()` | ADMITTED - N3 | no |
| B7 releasing a parent EXECUTION pin, not a product pin | REFUSED `RELEASE-PATH-IS-NOT-A-PARENT-PRODUCT-PIN`, and BEFORE the execution-pin branch, because H9 resolves the ruling at the loop entry | no |
| B9 released path deleted from the working tree | ADMITTED - N4 | no |
| C1/C2 released path is the argv target / brief / carrier successor / runner / spec file | REFUSED, all five, by two names that say which door | (8), and `(R1-B1)` for the other four |
| D1 artifact with an extra top-level key, and one missing a required key | REFUSED `Closed acceptance-artifact keys`, both | no |
| F2 third row: the parent RE-DECLARES a released path | the first `continue` fires, `(plus 1 skipped ...: build.mjs)`, `preview.css` NOT named - the two skips do not mask each other | no |
| F4 three generations, S11 over S10 over S9 | `(no released clause)` - the `ga` half of the union is a NO-OP on the reachable chain, as the corrected comment now says | no |
| G1 / G1b `held()` at `sourceBase` | REFUSED `PARENT-PIN-BROKEN-AT-SOURCEBASE` / ADMITTED before the edit | no |
| NEW-1 ancestor block with a WRONG `lastSealedSha256` | ADMITTED - N2 | no |
| NEW-2 `released: {}` on an artifact whose spec releases nothing | key closure admits it, `same()` refuses it | no |

---

## 8. WHAT I TRIED TO BREAK AND COULD NOT

1. **The token line, every way I could think of.** Prefix attacker on the package id, the five
   wrappers, a duplicate comma member, a malformed member, a directory, a `..`, a case flip, a
   line on disk but not on the branch, two identical lines, a withdrawal mid-run. Every one
   frees nothing, and every refusal carries a name and the path. The ONE that gets through is
   A3, which is inherited, reported, and now the PM's.
2. **The five doors into `executionPins`.** I re-derived them from `proposed()` `:3055-:3059`
   rather than from the guard, and the guard's set is built the same way. There is no sixth.
3. **The grandparent skip, widened.** B.8 (11)'s control (a DIFFERENT grandparent pin moved
   still refuses, naming the path), B.8 (12)'s no-op, an artifact with no block at all, an
   artifact whose block names a path nobody pinned, a parent that re-declares one of the two,
   and three generations. The skip fires for exactly the paths an ancestor's `released` block
   names and for nothing else. The only looseness I found is N2, and it is not reachable.
4. **The artifact's closure.** An extra key, a missing key, a moved `lastSealedSha256`, a
   dropped entry, the path put back into `product`, an empty block with no release behind it.
   All refused, by `keys()` or by `same()`.
5. **The already-sealed chain.** `--ci --package S8` and `--ci --package H3` give the same named
   refusal before this lane's first edit and after its last, and (X1) pins the S8 artifact's own
   twenty-one-key set by reading it off disk. The optional-key freeze pattern is why, and it has
   a precedent in this same runner at `:1796`.
6. **The receipt, both directions and both halves.** Lane C editing a released file costs
   nothing; the pinned file beside it still voids by name and by path; a stale receipt that
   still carries the released path does not void; the write never puts it in.
7. **The owned-files fence.** Twenty-three files, every one on the ticket's list. No
   `rebuild.yml`, no `boundary.test.mjs`, no `today/test/package.test.cjs`, nothing under
   `rebuild/lanes/c/`, no product file outside the four `CHILD_SPECS` cells the ticket owns. The
   WAIT list is untouched: no `packages/S9.json`, no needles, no `acceptance-s9`, no
   `--ci --package S9`, no CI-step flip, no pack literals, no `design.test.cjs` hunk, no brief,
   no PM token line. No cell in the lane reads the real ledger for the `RELEASE-FROM-SEAL` line;
   every one builds its own fixture ledger and its own Git repository.
8. **Anything the fix round broke.** BASE is `NOTHING RED ANYWHERE` across the whole tooling
   bar; the six `s8-*` siblings, the four `CHILD_SPECS` suites and both `--ci` runs reproduce the
   first author's numbers to the test; the six mirrors and F6/F6b/F7 were untouched by the fix
   round and still measure as the report says.

---

## 9. WHAT I DID NOT VERIFY

1. **F.1 R5's residual in full.** A later child re-pinning a released path at ITS OWN bytes as
   `role: "new"`, with no ledger line, is what B.7 says a re-seal looks like and is the one-way
   door's return path. My fixture was not a complete inventory, so the completeness walk caught
   it before the role branch did. Nobody has run that case end to end, and it is worth one row
   in B.8 that simply RECORDS the behaviour rather than refusing it.
2. **Anything that seals.** No `--full`, no seal, no receipt write against the real tree, no
   artifact written. Forbidden by the ticket and I did not go near it.
3. **`packages/S9.json` and the `--ci --package S9` walk.** WAIT list. The six `s9-*` mirrors
   are therefore unrun as tests; I verified their BYTES against my own derivation and their
   failure MODE, not their assertions.
4. **GitHub CI on both operating systems for this head.** I ran the bar on the PC only. The
   `released` role touches no path handling, so I expect nothing OS-specific, but I did not
   measure it.
5. **H18, H19, H19b, `measure/test/boundary.test.mjs`, `today/test/package.test.cjs` and
   `rebuild.yml`.** Other lanes, this round.
6. **The real `RELEASE-FROM-SEAL` line.** It does not exist yet, by design, and nothing in this
   branch reads for it.

---

## 10. WHAT WOULD MOVE THIS TO ACCEPT OUTRIGHT

One edit to the author report: name H13's count sentence in the same "weakest row" class the
report already uses for H4 and H5, correct the ordinal table's claim that B.8 (10) pins it, and
fix the two cites in section 4 (`:2038` -> `:2070`, `:3458` -> `:3515`). No runner byte has to
move for that, so E fact 7 stands and the runner ships at
`25ddc44c32d0d71b924cf62c2e0a8647697b6e77a55a91a132388217b6789ca6`.

Separately, and for the PM rather than for this lane: **rule on N1 before writing the token
line.** It is one line in each of two functions and it is much cheaper now than after the first
`RELEASE-FROM-SEAL` line stands on the chain.
