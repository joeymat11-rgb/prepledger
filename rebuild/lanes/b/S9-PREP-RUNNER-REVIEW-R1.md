# S9-PREP-RUNNER-REVIEW-R1 - independent review of ticket S9-PREP-A

Reviewed: `rebuild/b-s9-prep-runner` at `3d143c30f1817fffa4e5fe8d10273ed265cc2697`,
against `da9f8683`. Runner under review: `b-package.cjs`,
`d0021d5ca6871a832ee3d3853cc85370663392abaf4ce7654d0ddb5c5a66ee38`, 3522 lines
(3523 by `split('\n')`, which is the convention the author's report uses; see N11).
Design of record: `S9-RELEASE-SPEC.md` v4 as corrected by `S9-RELEASE-SPEC-REVIEW-R4.md`.

I read the diff file by file and formed my view BEFORE opening the author report,
re-ran the whole bar on the PC myself, re-measured red-first and the whole
MUTATION table in a scratch worktree of my own, re-derived all six `s9-*` mirrors
with my own substitution script, and ran a blind attack plan written before the
build existed as real fixture cases against the built runner.

## VERDICT: REJECT

Four BLOCKING, none of them large, and the mechanism itself is sound. Everything
the ticket asked to be MEASURED reproduces: red-first is literal (0 pass / 12 fail
against the byte-identical unchanged runner), every one of H1 to H13 and H17 turns
at least one cell red when reverted alone, the bar reproduces to the test, the
owned-files fence is clean, and the author's three self-reported deviations are
each correct. Three of the four blocking items are one line of code or one
sentence of report each; the fourth is a spec defect the author was asked to
report and did not.

## 1. BLOCKING

### BLOCKING-1. The released / executionPins disjointness guard closes one of three doors

`releaseRuling()` asserts that no granted path is a declared child's argv target,
with the right reason stated in its own comment: `proposed()` re-pins argv targets
through `executionPins`, so the release "would last exactly one generation".
`proposed()` has THREE routes into `executionPins`, not one:

```
if (fs.existsSync(rel(s.brief.file))) pins[s.brief.file] = diskSha(s.brief.file);
if (s.carrierSuccessor && ...) pins[s.carrierSuccessor.file] = diskSha(...);
for (const c of s.children) for (const f of childArgv(c)) pins[f] = diskSha(f);
```

The assert covers the third only. MEASURED, in a fixture against the built runner:

| attack | result |
|---|---|
| released path is also `s.brief.file` | ADMITTED: `in product=false in released=true in executionPins=true` |
| released path is also `s.carrierSuccessor.file` | ADMITTED: `in released=true in executionPins=true` |
| S10 over that artifact, released bytes moved | REFUSED `PARENT-PIN-BROKEN rebuild/m3/w7-preview/today/preview.css` |
| the same S10 over a clean S9 artifact | the released path is skipped; the control `build.mjs` still refuses `GRANDPARENT-PIN-BROKEN` |

So the artifact contradicts itself (the same path in `released` and in
`executionPins`), and the next package refuses `PARENT-PIN-BROKEN` on the first
lane C edit. That is exactly the failure H17 exists to prevent, arriving one
generation later through the PARENT walk, which has no skip and must not get one.

HONEST REACHABILITY: with S9's closed list of two presentation files this is not
reachable today; a brief is a markdown ticket and a carrier successor is an engine
module. I raise it as blocking anyway because the guard is written as a CLASS
("proposed() would re-pin it through executionPins") and closes a CASE, this is a
mechanism round whose product is the class, and the fix is one line: build the
`argv` set from `childArgv` plus `s.brief.file` plus `s.carrierSuccessor?.file`.

### BLOCKING-2. `rulingLine` in the sealed `released` block is a live line NUMBER

`proposed()` writes `rulingLine: release.at`, and `release.at` is the INDEX of the
ruling line in `rebuild/DECISIONS.md` read off `CHAIN_REF` on every single run.
`envelope()` refuses on `same(m, proposed(s, bound))`. So the sealed artifact
recomputes only while that index does not move.

MEASURED: with one line inserted above the ruling line in the fixture ledger and
no other change at all,

```
ATTACK D3 rulingLine before=1 after an insertion above=2 :: still recomputes? false
```

That is `SEALED-PROFILE-RECOMPUTATION` for ever, for S9 and for the standing CI
step once E fact 10 flips it, with no byte of the package having changed. It is a
latent seal-breaker of exactly the family H17 was written for, and it is the ONLY
value in the whole artifact recomputed from the live chain rather than from the
spec (`parent.receiptLedgerLine`, `coverage.successors` and `coverage.supersessions`
are all spec-declared numbers).

MITIGATION, measured so the PM can size it: I compared every consecutive pair of
`rebuild/DECISIONS.md` revisions the farm holds (28 pairs) and every one is a pure
append. So the hazard is latent, not imminent. It is still a field that can move
without a byte changing, and `rulingLineSha256` sits beside it carrying the same
fact in the form this design uses everywhere else.

THIS IS A SPEC DEFECT, NOT THE AUTHOR'S INVENTION. `S9-RELEASE-SPEC` B.4's block
shows `"rulingLine": 5xx` and the author built what the spec drew. It is blocking
here because the ticket asked for "anything in the spec that the runner as it
stands contradicts" and this is the clearest instance in the round, and it is
free to fix before any artifact carries the block. PM routing: drop the field, or
have the spec declare the number and have `releaseRuling()` assert it matches.

### BLOCKING-3. The RULED terminal test admits a line that ends "NOT RULED"

`assert(/(?:^|[ ·])RULED$/.test(line.trim()), 'RELEASE-RULING-IS-NOT-A-RULED-LINE')`.
MEASURED against the built runner, with a fixture ledger line reading
`... · RELEASE-FROM-SEAL M2-S9-UI-PINS <both paths> · this is NOT RULED`:

```
ATTACK A3 line ends "NOT RULED" :: ADMITTED :: ... 2 released ... not hashed here
```

Both paths leave the sealed inventory on a line whose last two words are NOT
RULED. The weakness is INHERITED: `supersessionRuling()` carries the same regex
and the ticket required the mirror to be line for line, so I do NOT say the author
should have silently strengthened it. Two things make it blocking:

1. B.8 cell (6) is titled "a token line that does not end in RULED frees nothing,
   and neither does a wrapped token". The second half is true and well tested (all
   five r10b N1 wrappers refuse). The first half is now measurably false for one
   phrasing, and it is a cell title on the seal path.
2. A divergence from the precedent function is a PM question, and the report does
   not put it. It should: the same line frees carriers through `GATE-SUPERSESSION`
   today, so whatever the PM rules applies to both functions at once.

### BLOCKING-4. Nine U+2014 em dashes in eight lines the author added to `b-package.cjs`

The ticket states without qualification: "No U+2013 and no U+2014 in any file you
author." Every NEW file in this branch is clean (I checked all six mirrors, the new
suite and the report: zero). `b-package.cjs` gains eight comment lines carrying
nine U+2014, at the H2, H5, H3, H4 and H7 comments.

I record the mitigating fact: the file already contains 293 such lines and the
added ones match the surrounding house style, so the PM may well waive this. I
raise it as blocking on cost rather than on principle: fixing it moves the runner
sha256, which redoes E fact 7 across seven spec files, and that is cheap now and
expensive after a seal.

## 2. NOTES

**N1. The `ui-port` deferral (H16 / E fact 3 and 4) is right, and I verified the
rule that forces it.** `CHILD_ROOTS` gains four and `PUBLIC_TAIL_ROOTS` gains
nothing. `rebuild/lanes/c/ui-port/` does not exist on this branch, and F7's last
loop is `assert(fs.existsSync(path.join(sourceRoot, root)), root + ' is a real
directory of this repository')` at `pinned-unchanged-and-ruled-substitutions
.test.cjs:480`. Adding the root ships a red bar. Reported by the author as his
(2); I agree, and I add that my own blind attack plan asked for the basis of the
`PUBLIC_TAIL_ROOTS` entry in writing before it is added, which is now deferred
with it. The other four roots all exist and each holds the cells claimed.

**N2. The one thing the ticket asked to be MEASURED is measured correctly.**
`rebuild/lanes/c/s9-today-carry/` DOES need a child root. I verified it
independently rather than from the report: `rebuild.yml:306` is one step,
`run: node --test rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs
rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs`, naming both cells in one
argv; `childArgv()` judges every target against `CHILD_ROOTS`; each directory holds
exactly the one cell named. The two roots stand or fall together, as the author says.

**N3. A released pin carrying a real `post` reaches `product()` and `proposed()`
unrefused; only `spec()` H4 catches it.** MEASURED: `product()` admits it (H7's
skip fires on the role before anything looks at `post`) and `proposed()` silently
drops it, writing `lastSealedSha256: p.pre`. `spec()` always runs first, so this is
defence in depth and not a hole. It is worth saying because it is the one rule in
the mechanism asserted at a single site, and because it is why B.8 (1b) can only
pin H4 by reading the runner rather than by executing it.

**N4. A released path DELETED from the working tree is admitted by `product()`.**
MEASURED: with the file removed, `product()` prints its released clause and passes.
H7's `continue` sits above both the existence branch and `diskSha`. `pins()` still
holds the path in GIT at `sourceBase`, so it cannot vanish from the history, but
nothing asks about the disk. I read the ruling as releasing a file from the
inventory, not licensing its deletion; the spec says nothing either way. One
sentence in the report, or one `fs.existsSync` assert, would settle it.

**N5. `RELEASE-CHAIN-REF-ABSENT` does not exist.** MEASURED: with `CHAIN_REF`
pointed at a ref that does not exist and a release declared, the refusal is
`Command failed: git show refs/heads/no-such-ref...`, unnamed, where every
neighbouring failure in this function carries a name. Inherited from
`supersessionRuling()` and from `parent()`, and NOT reachable in CI today: `--ci`
already reads `CHAIN_REF` at `:1870` for the parent artifact, so a CI runner that
could not resolve it would already be failing. Note only.

**N6. The release frees DESCENDANTS, not S9 itself, and nothing says so out loud.**
MEASURED both ways:

```
G1  pins() parent walk, sourceBase AFTER lane C edited the released file
    :: REFUSED :: PARENT-PIN-BROKEN-AT-SOURCEBASE rebuild/m3/w7-preview/today/preview.css
G1b pins() parent walk, sourceBase BEFORE the edit :: ADMITTED
```

`held()` takes the `sourceBase` branch for any DECLARED file, so a released path
must still stand at the parent's byte at S9's own `sourceBase`. B.6 calls walk 1
"unchanged" and cites `held()`, which is true, but does not state the consequence:
if any ticket that seals INSIDE S9 moves a released path before S9's `sourceBase`,
S9 cannot seal, and `held()` is what F.2 STOP-2 forbids amending. Today's closed
list is safe (neither carried lane declares `preview.css` or `build.mjs`, and
C-UI-1 is on the WAIT list), so this is a caution for the S9 BUILD round, not a
defect here.

**N7. H17's comment gives a reason the measurement does not support.** It says the
UNION over the parent AND grandparent artifacts "is what makes the skip survive a
second generation: S11's grandparent is S9, which carries the block". MEASURED with
a three-generation fixture (S11 over S10 over S9): the grandparent loop iterates
`{...ga.product, ...ga.executionPins}`, and H10 has already removed the released
path from S9's `product`, so the walk never reaches it, the skip never fires, and
the say prints no released clause. The union is harmless; its stated reason is
wrong. The ONE way the `ga` half becomes reachable is BLOCKING-1's back door, which
is an argument for closing that rather than for the comment.

**N8. The author's own (4) and (5) are both real and I confirm both.** The
parent-pin membership check is guarded by `if (pmap)` and is skipped when there is
no bound parent; steps 1 to 5 and the argv disjointness still run, and
`envelope()` requires `bound && bound.decided` before any seal, so it is bounded.
The H17 say clause can name one more path than `greleased` counts. Both are notes.

**N9. Three of the fifteen cells are not red-first, and one of them can only pin
by reading the runner.** `acdac273` carries 12 cells; the head carries 15. (1b),
(X1) and (X2) were added after the hunks landed, which is correct for (X1)/(X2)
(they are the PM's regression questions) and is stated plainly by the author for
(1b). N3 above strengthens his own caveat: H4's rule genuinely cannot be reached
through `product()`, so (1b) pinning the SITE is the only option short of a
fixture package directory.

**N10. A duplicate member in the token's comma list is admitted silently.**
`RELEASE-FROM-SEAL M2-S9-UI-PINS a,a,b` releases `a` and `b`; `granted` is a Set.
Harmless, and I could not turn it into anything.

**N11. `3523` vs `3522` lines is a counting convention, not an error.** I raised it
in my header and then measured it: the file is 3522 lines of content plus a
trailing newline, so `wc -l` says 3522 and `split('\n').length` says 3523. The
report's number is the second convention. Nothing to fix; recorded so the next
reader does not spend the same minute on it.

## 3. WHAT I RE-MEASURED AND IT HELD

**RED FIRST IS LITERAL.** `git rev-parse acdac273:rebuild/lanes/b/tooling/b-package.cjs`
equals the blob at `da9f8683`, and the runner there hashes to `e31dd206...335e`. I
checked the red commit out in a scratch worktree and ran the suite: **0 pass /
12 fail**, all twelve named, exactly the list in the commit message.

**THE MUTATION TABLE, RE-MEASURED INDEPENDENTLY.** I reverted each hunk alone from
the head bytes, restored in a `finally`, and ended with the runner back at
`d0021d5c...ee38`. NO HUNK IS A NO-OP:

| revert | pass/fail | red cells |
|---|---|---|
| H1 | 14/1 | (1) |
| H2 | 6/9 | (1) (2) (3) (4) (5) (6) (7) (8) (9) |
| H3 | 5/10 | (2) to (9), (X1), (X2) |
| H4 | 14/1 | (1b) |
| H5 | 13/2 | (1) (1b) |
| H6 | 12/3 | (2) (3) (8), `PARENT-PRODUCT-PIN-NOT-DECLARED-CARRIED-OR-EDITED` |
| H7 | 11/4 | (2) (3) (8) (X2), `UNLISTED-PRODUCT-DRIFT` |
| H8 | 14/1 | (3), the released clause missing from the PRODUCT say |
| H9 | 7/8 | (2) to (8), (X2), `Missing expected exception` |
| H10 | 14/1 | (9) |
| H11 | 13/2 | (1) (X1) |
| H12 | 14/1 | (10) |
| H13 | 14/1 | (10) |
| H17 | 13/2 | (11) (12), `GRANDPARENT-PIN-BROKEN` |

H12 and H13 each go red ALONE, which matters: the two directions of the receipt
are separately observed, not jointly.

**THE SIX MIRRORS, RE-DERIVED WITH MY OWN SCRIPT.** Applying the spec's E fact 5
substitution set to each `s8-*` sibling: three of the six are BYTE-IDENTICAL to the
author's `s9-*` file, and the other three differ ONLY in the five hand corrections
he declares in report section 7, each of which makes a sentence TRUE that the
mechanical substitution would have made false (the ancestor list "S8 the sixth and
S9 the seventh"; the bare `:514` to `:527` my own script missed; "THE PARENT IS S8,
NOT S7"; the two chain sentences in the engine differential; and the whole PRODUCT
STORY of the writers differential). I checked the last one against the code rather
than the prose: SUP-13 filters `p.role !== 'carried'`, so a `released` file IS one
of the files it walks, and the assertion that none lives under `rebuild/engine/`
is unchanged and still true. All six files are pure ASCII.

**THE BAR, RUN ON THE PC AT `3d143c30`** (`MEASURED_TEST_NOW=2026-09-03`,
`TZ=America/New_York`, each file on its own). Every number the author reports
reproduces:

- ten `tooling/test/` suites, **123 pass / 0 fail**, every one exit 0
  (11, 9, 15, 14, 9, 17, 7, **15** new, 17, 9);
- the six `s8-*` siblings: **16 pass / 0 fail** (3/3/3/4/3) and
  `s8-engine-files-differential.cjs` exit 0;
- the six `s9-*` mirrors: **0 pass / 1 fail each, exit 1**, every one the same
  `ENOENT ...packages\S9.json` at module load. That file is on the WAIT list, so
  the cells stand ready rather than green, which is the S8 ordering;
- `food` 57/0 exit 0, `machine-settings-ui` 54/0 exit 0, `problem` 131/0 exit 0,
  `setup` **156 pass / 1 fail exit 1**;
- `--ci --package S8` and `--ci --package H3`: `SEALED-PROFILE-RECOMPUTATION`,
  exit 1, both printing `under 24 fixed root(s)` and runner `d0021d5c...ee38`.

**THE `setup.test.mjs` FAILURE IS PRE-EXISTING, VERIFIED MY WAY.** Rather than take
the author's word, I ran the suite at the PARENT commit `da9f8683` in a farm
scratch worktree, where `CHILD_SPECS` still ends `'S8'`: cell 151, "re-pin - every
file the B-NTC package pins is untouched by A4b, on disk", is RED THERE TOO. The
same cell and only that cell is red at the lane head. This lane did not cause it.

**THE OWNED-FILES FENCE IS CLEAN.** 22 files touched, every one inside the ticket's
owned list: the runner, the new suite, F6/F6b/F7, the seal-tip suite, the six
mirrors, four `CHILD_SPECS` cells, seven `packages/*.json` re-pins
(`tooling.runnerSha256` only, one byte range each, `+1/-1` per file) and the author
report. NOT touched: `rebuild.yml`, `measure/test/boundary.test.mjs`,
`today/test/package.test.cjs`, anything under `rebuild/lanes/c/`, any product file,
`packages/S9.json`, `DECISIONS.md`, `lanes/STATUS.md`. I confirmed
`packages/S8.json` still pins the runner's own product post at `e31dd206...335e`.

## 4. WHAT I TRIED TO BREAK AND COULD NOT

Written blind from spec B before the build existed, then run as real fixture cases
against the built runner. Every one of these is a REFUSAL, by name:

| attack | refusal |
|---|---|
| A5 the token negated, quoted, bracketed, emphasised, backticked inside a clause | `RELEASE-RULING-DOES-NOT-CARRY-THE-GRANT-TOKEN`, all five. `releaseGrants()` splits on the clause separator first, so r10b N1's lesson is genuinely carried over |
| A6 two byte-identical ruled lines | `...-NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH 2 line(s)` |
| A7 the line withdrawn between the spec phase and the seal phase | `...-NOT-A-UNIQUE-LINE-ON-THE-CHAIN-BRANCH 0 line(s)`. No cache; r10 F4's lesson holds |
| A9 `../../etc/passwd` in the token | `RELEASE-PATH-IS-NOT-A-PARENT-PRODUCT-PIN` |
| A9 a leading `/`, a trailing `/` (a directory), a case-flipped path | the same refusal, each naming the path. B.2 step 6 closes the whole loose path grammar |
| A4 a token naming another package | `RELEASE-RULING-DOES-NOT-NAME-THIS-PACKAGE` |
| B5 a released path the parent never sealed | `RELEASE-PATH-IS-NOT-A-PARENT-PRODUCT-PIN` |
| B6 a declared `pre` that is not the parent pin | `RELEASE-PATH-PRE-IMAGE-IS-NOT-THE-PARENT-PIN` |
| B7 a parent EXECUTION pin declared released | `RELEASE-PATH-IS-NOT-A-PARENT-PRODUCT-PIN` |
| D1 an artifact with an extra top-level key, and one missing a key | `Closed acceptance-artifact keys`, both directions; `released: null` alone is admitted, which is the freeze pattern working |
| F2 third row: the skip masking test | with the released path skipped, a DIFFERENT moved grandparent pin still refuses `GRANDPARENT-PIN-BROKEN` by name |
| C1 a released path that a declared child executes | `RELEASE-PATH-IS-A-CHILD-ARGV-TARGET`. My blind plan predicted B.5 assigned this to no hunk; the author put it in `releaseRuling()`, which is the right place |

I could not release anything without a unique, RULED-terminated line on `CHAIN_REF`
carrying a token that stands alone in its own clause and names this package and
that exact path, except by the "NOT RULED" phrasing of BLOCKING-3.

## 5. WHAT I DID NOT VERIFY

- The six `s9-*` cells' BEHAVIOUR. They cannot load without `packages/S9.json`,
  which is on the WAIT list. I verified their TEXT against their siblings only.
- Anything on the WAIT list: `packages/S9.json`, the needles, the acceptance-s9
  artifact, the `--ci --package S9` walk, E fact 10's CI flip, PACK-PIN,
  APPROVED-PIN, `design.test.cjs`, the S9 brief, the PM's token lines.
- The real `RELEASE-FROM-SEAL` ledger line. It does not exist yet, and no cell in
  this branch reads the real ledger for it; every fixture builds its own Git
  repository and its own `DECISIONS.md`, the way `gate-supersession.test.cjs` does.
  I confirmed that by reading the suite, not by taking it on trust.
- GitHub CI on both operating systems. My PC bar is one OS; the Windows/ubuntu
  evidence is the push.
- `--full`, the private census, the sealed soak, anything under
  `rebuild/conform/private`, and `b-package.cjs --full`. None of them was run.
- H18, H19, H19b. They are not in this ticket and nothing in this branch touches
  them; I did not review their designs.
- The two farm-only extra reds I saw in `setup.test.mjs` (S17, A4) are farm
  environment artifacts, not PC results; I used the farm run only to compare the
  ONE cell that is red on the PC, at the parent commit and at the head.

## 6. WHAT WOULD MOVE THIS TO ACCEPT

1. One line in `releaseRuling()`: build the disjointness set from `childArgv` plus
   `s.brief.file` plus `s.carrierSuccessor?.file`, and one cell for it.
2. `rulingLine` dropped from the `released` block, or declared by the spec and
   asserted rather than recomputed. This is a PM ruling on `S9-RELEASE-SPEC` B.4.
3. The "NOT RULED" weakness put to the PM in writing, as a question about BOTH
   ruling functions, and B.8 cell (6)'s title corrected to what it measures.
4. The nine U+2014 removed from the eight added comment lines, with E fact 7 redone
   last again (or an explicit PM waiver, which is a reasonable outcome).

None of the four touches the shape of the mechanism. H1 to H13 and H17 are, as far
as fourteen independent reversions and a blind attack plan can show, the right
hunks in the right places.
