# M2-S9-UI-PINS - the reseal that hands two screen files out of the seal and pins the pack that judges them

**STATUS: DRAFT FOR ACCEPTANCE BY NAME. NOT YET ACCEPTED, and no PM token line has been issued for
it.** Lane B, ENGINE-TIER PACKAGE PROCESS, child of `M2-S8-REAL-SHAPE`
(`rebuild/lanes/b/tooling/b-package.cjs`), size M. Parent artifact
`rebuild/m4/spec/acceptance-s8-real-shape.json` sha256
`3cf58e0edd76a56353b35008ef154d484098b5017fedeb648eb64a0ae6568d48`, 89873 B, 224 `product` entries
and 71 `executionPins` - MEASURED by this author in the farm at chain tip `789baf6e` on 2026-09-19,
not copied from a report. **It is the ARTIFACT sha and not the receipt sha
`3b1b8b91dd5a6ff049dffd721ec723b9fe550b0b71ba78e37574cfc96210d409` (`DECISIONS:529`); E fact 8 of
the spec names confusing the two as the single most likely error of this round.**

This brief is written on `rebuild/b-s9-ui-pins` at `da9f868`. **`da9f868` is the PREPARATION base
and is NOT this package's `sourceBase`.** The `sourceBase` is the commit at which the chain tip is
merged into this lane after the wait list of section 11 clears, and it is TO MEASURE AT INTEGRATION:
`git rev-parse HEAD` on the lane immediately after that merge, recorded in `packages/S9.json` and
never rebased (`:467` note 1, `:493` (8)).

**Every number in this brief either carries the head it was measured at, or is marked TO MEASURE AT
INTEGRATION with the exact command that will measure it.** Nothing is carried from a lane report
without its attribution. Where two sources disagree and the PM has not ruled, the sentence is marked
OPEN and is listed in this author's return; it is not resolved here.

Spec of record: `rebuild/lanes/b/S9-RELEASE-SPEC.md` v4 with review R4's binding corrections
(`DECISIONS:549`); there is no v5 and the corrections live here. Rule of record for the release:
`DECISIONS:536` (2). Standing seal rule: `DECISIONS:455`.

## 1. Why

`DECISIONS:536` named eight release candidates. Read out of the ledger line itself rather than from
a paraphrase (spec 0, R3 N2), they are seven FILES plus one CATEGORY: `today-app.cjs`,
`screens.template.html`, `preview.css`, `build.mjs`, `design.cjs`, `browser-check.mjs`,
`today-model.cjs`, and "the today test cells that pin only rendering". **Four of the seven files are
already free** (`screens.template.html`, `design.cjs`, `browser-check.mjs` and `today-model.cjs`,
the last taken out by the hotfix of `DECISIONS:535`), **`today-app.cjs` fails the ruling's own test**
and rides S10 under `DECISIONS:543` (A), and the eighth candidate is a category which spec C.3
measures and releases NONE of. `index.shell.html` appears nowhere in `:536`; v1 to v3 substituted it
for the test-cell category and counted eight files where the ledger names seven and a category.

**So the closed list is TWO paths**, and they are the whole of what the PM's token line may name:
`rebuild/m3/w7-preview/today/preview.css` and `rebuild/m3/w7-preview/today/build.mjs`, the second
released **only with H18 in the same package**. Measured by this author at chain tip `789baf6e`
against the parent artifact: `preview.css` stands in S8 role `carried` at post
`7cf97598c2c2cb2390dd0a7a855f322b68b27f4fa801df3e23536e4846126ea1`, and `build.mjs` role `carried`
at post `d04a10ef406708b801749b1118246e82fecc53bbbafe1ac11068eb24bc52cf9c`. Those two values are the
`pre` of the two released declarations, because a released file's `pre` is the byte its parent
sealed it at and its `post` is `null` by the runner's own rule (`b-package.cjs:1871-1872`,
`PRODUCT-RELEASED-DECLARES-A-POST`).

**S9 is not only a release.** Handing two files out of a seal without saying what then judges them
would be a net loss, so the same package carries four other things, each of which needs a sealed
byte and therefore this reseal child and no other:

1. **The inventory fence** (`rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs` and its
   `rebuild.yml` step), which asks of every path a branch touches whether it is in the CURRENT
   sealed inventory read out of Git at `CHAIN_REF` and not in that inventory's `released` block.
2. **The whole-pack and approved-reference pins** (`pack-pin.test.mjs`, `approved-pin.test.mjs`),
   which bring the design pack that judges every look ticket after S9 inside the thing it judges.
   `DECISIONS:546` with `:549`: the binding identity of the pack is tree
   `6d7710467408f69e61a2917c583540fc2336a3fa`, not the README's unreproducible composite sha.
3. **The gates themselves become pinned**, which is why `rebuild/m1/` enters the sealed inventory
   for the first time in this package (E fact 17).
4. **The carried lanes**: S9-TODAY-CARRY (`DECISIONS:542` D), PASSPHRASE-NORMALIZE (`:543` B),
   the `p3-layout-v2` cells (`:547`), `local-import.test.mjs`'s CI home (`:543` B), and
   **F2-LAND in its entirety as E fact 23** (`DECISIONS:582`), whose standalone merge plan that
   ledger line REVERSED.

**S9 adds no behaviour of its own to the app.** Its product delta is the release mechanism, the
fence, the two pins, the carried lanes' accepted diffs, and the tooling this package's own id
requires. A byte here that no accepted lane round and no fact of section 5.1 produced is a finding.

**What the athlete gets: nothing, today, and that is the point.** S9 is a custody change. What the
OWNER gets is that lane C can edit the two screen files without a reseal child, and that the gates
and the approved pack can no longer be edited by the ticket they judge.

## 2. The declaration list, walked

**Method, and it is the same method S8 used, not a new one.** For every one of the **224 paths the
parent artifact pins** (measured: `product` has 224 entries, `executionPins` 71), the bytes on disk
at the `sourceBase` are hashed and compared with S8's own recorded `post`; every `pre` below is
S8's own post, measured and not typed. The walk is
`git diff --name-status <sourceBase>..HEAD -- rebuild/m1 rebuild/m3 rebuild/m4 rebuild/lanes .github`
plus the `rebuild/lanes/b` tooling paths. First declarations carry `pre: null`; a moved file the
parent does NOT pin carries its `sourceBase` blob as `pre`, which is the runner's own rule for role
`new` (`pre === null` OR `pre !== post`).

**THE COUNTS ARE TO MEASURE AT INTEGRATION AND THIS BRIEF ASSERTS NONE.** S8's were 224 = 24 edited
+ 17 new + 182 carried + 1 superseded-by-child. S9's cannot be stated before C-UI-1's file set is
known (section 11), and the spec's own E fact 9 forbids copying them from a report. The command that
measures them is the runner itself: `node rebuild/lanes/b/tooling/b-package.cjs --ci --package S9`,
whose `SPEC OBSERVED` line prints the declared product count, the D-ids, the child count and the
root count in one sentence (`b-package.cjs:1992-1995`).

**2.1 The product files.** The two releases; the carried lanes' product edits; the new passphrase
helper and the F2 projector; and C-UI-1's eventual moved files, which are not yet knowable.

| path | role | pre | post |
| --- | --- | --- | --- |
| `rebuild/m3/w7-preview/today/preview.css` | released | `7cf97598c2c2cb2390dd0a7a855f322b68b27f4fa801df3e23536e4846126ea1` (measured, S8 post) | `null` by rule |
| `rebuild/m3/w7-preview/today/build.mjs` | released | `d04a10ef406708b801749b1118246e82fecc53bbbafe1ac11068eb24bc52cf9c` (measured, S8 post) | `null` by rule |
| `rebuild/m3/w7-preview/today/today-app.cjs` | edited (Today carry, NOT released) | TO MEASURE | TO MEASURE |
| `rebuild/m3/w6/local/import-bundle.mjs` | edited (passphrase carry) | TO MEASURE | TO MEASURE |
| `rebuild/m3/w7-preview/import/import-screen.mjs` | edited (passphrase carry) | TO MEASURE | TO MEASURE |
| `rebuild/m3/setup/port/passphrase.cjs` | new, SEALED (it decides key material on the phone) | `null` | TO MEASURE, **and it moves once more**: see section 11 |
| `rebuild/m4/workout/setup-tags.cjs` | new, SEALED (E fact 23) | `null` | `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` at `b9777fe4`, measured by this author; final TO MEASURE |
| C-UI-1's moved files | TO MEASURE | TO MEASURE | TO MEASURE |

`passphrase.cjs` is role `new` and SEALED because it decides key material on the phone
(`DECISIONS:543` B). `setup-tags.cjs` makes the closed workout class four files and calls for law 17
supersession by name (`F2-LAND-AUTHOR-REPORT.md:341-347`); the twin's retirement waits for the
reseal and is NOT done here.

**2.2 Sibling tests and ancestor specs the parent already pins, role `edited`.** Five `CHILD_SPECS`
cells gain the `'S9'` literal as the youngest (`measure/test/boundary.test.mjs`,
`today/test/food.test.mjs`, `machine-settings-ui.test.mjs`, `problem.test.mjs`, `setup.test.mjs`;
E fact 12). `today/test/package.test.cjs` is `edited` for H18, H18b and H18c (E fact 16,
`DECISIONS:570`): H18 fixes the 26 Today entries of the 48-input build, H18b binds the FULL 48 by
count, H18c the engine pack. `today/test/view.test.mjs` and `today/test/adapter.test.mjs` are
`edited` product AND execution pins for the Today carry (`DECISIONS:542` D).
`import/test/page-bundle.test.mjs` is `edited` for the passphrase carry, with its two module counts
re-measured 142 to 143 and 20 to 21 (`:543` B) - **and that re-measurement is now doubly TO MEASURE,
because the passphrase reviewer could not reproduce the counts inside its sandbox (139 against 143,
the same two baseline failures at both revisions) and the PM is re-measuring outside the sandbox
with the cell fixes (`DECISIONS:601`).** `boundary.test.mjs` additionally deletes `:188-:189` only,
keeping the loop and `:186-:187` (spec C.2, PM-R7).

**Seven ancestor specs are re-pinned on `tooling.runnerSha256` only, one byte range each** (E fact
7): `packages/H3.json`, `S3`, `S4`, `S5`, `S6`, `S7` and `S8`. S8 joins the list because S8 is now
an ancestor. **E fact 7 is done LAST**, after every other runner hunk, because it pins the runner's
own bytes; the runner's round 6 did exactly that and says so (`DECISIONS:598`). Their pre/post are
TO MEASURE AT INTEGRATION.

**2.3 The runner, the standing CI step, and the parent's execution pin.**

| path | role | pre | post |
| --- | --- | --- | --- |
| `rebuild/lanes/b/tooling/b-package.cjs` | edited | S8 post `e31dd206c0fb0fc0c295df45eae3992d4c59b1a76de8da04a4d0f22948e9335e` | **round 6 head value `71c1b2592b5a3544b71c0995a9f52b88fbe24cd6b821709309aa95e5ad3012c0`**, measured by this author at `397ac466` on `rebuild/b-s9-prep-runner` and equal to the PM's at `DECISIONS:598`; final TO MEASURE |
| `.github/workflows/rebuild.yml` | edited | S8 post `8403d10b1a54d721a17e92cc0c2eb7fe119379b65cc4ba9625e6a7196ad9d532` (measured from the parent artifact) | combined post TO MEASURE |
| `rebuild/lanes/b/tooling/packages/S8.json` | superseded-by-child | TO MEASURE | TO MEASURE |

`rebuild.yml`'s post is COMBINED and must be measured once, after every step lands: the standing S9
flag and step name, the fence step, the pack/approved step, the Today carry's two lane cells, the
passphrase step, `local-import.test.mjs`'s step and **F2-LAND's step with BOTH its cells**
(`DECISIONS:582`). No post-image for it is copied from any lane report, including F2's
`878baa7617f63e236d68213f672d716b67d976dcf1e4a6ce50948b7d06133499`, which is that lane's own
historical value and not S9's.

`S8.json` is `superseded-by-child` because it is the parent's own EXECUTION pin, which
`DECISIONS:109` says a child supersedes inside its own seal and which the runner refuses under any
other role.

**2.4 First declarations, role `new`, all `pre: null` unless the walk finds the file at the
sourceBase.** Six `s9-supersede-*` / `s9-engine-files-differential` mirrors under
`rebuild/m4/workout/test/`, each a byte-exact copy of its `s8-*` sibling with only the mechanical
substitution set of E fact 5 (`M2-S8-REAL-SHAPE`/`S8`/`s8-` to `M2-S9-UI-PINS`/`S9`/`s9-`; parent
`M2-S7-PORT-ADMISSION` to `M2-S8-REAL-SHAPE`; parent token line `DECISIONS:514` to `:527`; spec
`packages/S8.json` to `S9.json`; generation SIXTH to SEVENTH). No assertion, threshold, regex, red
control or mutation control changes in any of the six. Then: the release tooling cell
`rebuild/lanes/b/tooling/test/release-from-seal.test.cjs`, added to `TOOLING_FILES` in the same
hunk; the fence cell; the two pack cells; the three passphrase lane cells
(`{helper,route,unlock-forms}.test.mjs`); the two `p3-layout-v2` cells; the two Today lane cells;
and F2-LAND's two cells.

Measured by this author at the accepted F2 head `b9777fe4` on `rebuild/d-f2-land`:
`rebuild/lanes/d/f2/projector.test.mjs` is
`f74bbe5f40624237a4d24536b3ead036a75ed3bc705a52d6e55032d28bdf8dd6` and
`rebuild/lanes/d/f2/guard-coverage.test.mjs` is
`78d1d73c02b115981006ab38dd0a16bfcd9fddbee8afa40c872964155281b9e7`. **The value
`b84b0b4056fbb1f82b11dd63d4a335674e57176ced31b2defd6748ed0c1002da` that the input pack carries for
`guard-coverage.test.mjs` is a SUPERSEDED round's value and must not be used.** Both final values
are still TO MEASURE AT INTEGRATION, at the merged head, by
`git hash-object` against the worktree or by the runner's own recomputation.

Measured by this author at the accepted fence head `8019abf6`:
`rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs` is
`673a02f9334af5e6a4469a4085ead55bcc465b1a62650a49da3896207986b199`, which is the accepted post that
supersedes round 6's `43bcda207174397681fb616b884bb951924250d48091b91bc0983d17762077e6`
(`DECISIONS:583`, `:591`). Final TO MEASURE, because the integration hand adds the R6-Z2/Z3 row.

**Two Today lane cells are DECLARATIONS, and E20's sentence that they are not is SUPERSEDED.** The
PM has ruled on the input pack's contradiction 3: the runner's rule governs - every executed file is
declared - so `rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs` and
`rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs` stand in a declared child's argv and are
therefore declared product. The runner's own comment says so at `b-package.cjs:453-460`: the two
roots stand or fall together because `childArgv()` judges EVERY target against `CHILD_ROOTS`.

**2.4.1 The six `pinned-unchanged` declarations of E fact 17, and a refusal this author MEASURED
that the spec does not predict.** Four are the design of record
(`rebuild/m1/approved-2026-09-08/Earned-refinement-A.html`,
`.../Earned-additions-C-approved.html`, `.../ADDITIONS-C-APPROVED-HANDOFF.md`, `rebuild/m1/MOCK.md`)
and two are the writers that stand outside the seal
(`rebuild/m3/w7-preview/today/gym-model.mjs`, `.../checkin-app.mjs`). This adds `rebuild/m1/` to the
sealed inventory for the first time, and the brief says so by name as PM-R6 required.

**MEASURED at chain tip `789baf6e` and at runner head `397ac466`, and it is a named integration
risk, not a paper doubt.** The runner asserts at `b-package.cjs:1896-1897`:

```
assert(pin.role !== 'pinned-unchanged' || executed.files.has(file),
  'PRODUCT-PINNED-UNCHANGED-IS-NOT-EXECUTED-BY-A-DECLARED-CHILD ' + file + ...)
```

`executedClosure()` (`b-package.cjs:750-760`) follows ONLY a relative literal specifier of the four
shapes `require('...')`, `import('...')`, `from '...'` and `new URL('...',` from a declared child's
argv targets. I searched every `.mjs`, `.cjs` and `.js` under `rebuild/` for a specifier of any of
those four shapes naming `MOCK.md`, `Earned-refinement-A.html`, `Earned-additions-C-approved.html`
or `ADDITIONS-C-APPROVED-HANDOFF.md`: **zero matches.** `design.cjs:35-46` names all four as STRING
PATHS inside a data structure and reads them by path at run time, which `executedClosure()` cannot
see and, by its own stated rule, must not guess at. The two writers are fine: `gym-model.mjs` and
`checkin-app.mjs` are reached by relative `from` from sealed today cells that stand in the
`today-17` child's argv (`today/test/problem.test.mjs:17`, `machine-settings-ui.test.mjs:26`,
`checkin.test.mjs:23`, and others). I also confirmed the other half of the role's rule holds for all
six: none of them is a key of the parent's `product` or `executionPins`
(`PRODUCT-PINNED-UNCHANGED-IS-A-PARENT-PIN`, `b-package.cjs:2419-2420`).

**So as the runner stands at `397ac466`, declaring the four design-of-record documents
`pinned-unchanged` refuses by name, four times.** The three honest dispositions, with their cost,
for the PM to rule in review: (a) declare them `new` with `pre` the sourceBase blob and `post` the
same bytes, which the runner admits but which says "this package wrote them" and is false;
(b) give a declared child an argv target that genuinely reads them, which the pack cells arguably
already are, and re-measure the closure; (c) a runner hunk widening the closure for non-executable
declared references, which is a seal-path change and would need its own PM ruling and its own rows.
**This brief recommends none of the three and stops on the sentence**, because the spec's E fact 17
and the runner's `:1896` cannot both be right as written. See section 12.

**2.5 NOT declared, named so the omission is a decision.**
`rebuild/m3/w7-preview/today/today-model.cjs` is NOT declared and rides TODAY-SPLIT under S10;
this brief carries that out loud in section 8 as a fence limit.
`rebuild/m3/w7-preview/today/browser-check.mjs` is NOT declared and has NO CI home; it is run on the
PC before each seal and its result belongs in the VERDICT (spec E fact 19).
`rebuild/m3/w7-preview/today/design.cjs` is NOT one of the `pinned-unchanged` six (PM-R6, changed
from spec v2); its sibling `today/test/design.test.cjs` is `edited` **only if** C-UI-1 moves
`design.APPROVED`, which is zero to three hunks and a SEALED cell either way, with STOP-10 applying
(spec C.5.3 step 4, F.2 STOP-10). `copy-bind.test.mjs` is WITHDRAWN (PM-R6'(ii)). The TODAY-SPLIT
spec and build, the seal generator on `rebuild/b-seal-gen`, and every lane's Markdown report are
not declarations of this package. `rebuild/DECISIONS.md` and `rebuild/lanes/STATUS.md` move with the
tip merge and are outside every package's product map by standing practice.

**2.6 Everything else is CARRIED byte-identical**, re-pinned at S8's own post. That includes all 45
tracked `rebuild/engine` files and `rebuild/coach/engine-revision.cjs`. **The count is TO MEASURE:
S8's 182 carried is NOT S9's, and this brief does not assume S8's old counts remain valid.** If the
runner's recomputation finds a moved path that no section above names, that is a finding and it goes
back to the PM; it is not absorbed into this list.

## 3. The bar

**3.1 The preparation lanes' bar tables, each attributed to the head it was taken at.** These are
the cited lanes' and the PM's measurements, NOT fresh executions by this author. Unlike test counts
are never added together, and a known red is preserved rather than hidden.

| lane | head | measured bar | the reds, by name |
| --- | --- | --- | --- |
| A, the runner | `397ac466` on `rebuild/b-s9-prep-runner`, runner sha256 `71c1b259...3012c0` | **150 of 150 on the PC and on linux** at identical runner bytes (was 145); Astra's whole table plus P01 to P07 re-taken, 47 rows executed, 47 killed, 0 live, 4 not applicable | none in the tooling suites. CI run `35458068468` is red at step 13 on both systems and nowhere else, which is this branch's expected state until S9 because the runner is a sealed execution pin (`DECISIONS:598`) |
| B, the inventory fence | ACCEPTED at `8019abf6`, paper head `6f808cfa` (`DECISIONS:591`) | **44 tests / 43 pass / 1 fail on BOTH systems** | the one red is THE REAL ROW, naming nine touched sealed paths. It goes green only when the real S9 child satisfies the verified reseal conditions at integration |
| C, the pack cells | Astra round 5 build `d857d775` on `rebuild/b-s9-prep-pack` | **pack-pin 58 tests / 57 pass / 1 fail; approved-pin 42 tests / 41 pass / 1 fail**, on the PC AND on linux at identical bytes, the literals unfilled (`DECISIONS:599`) | one REAL ROW in each and nothing else: `PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18`, and `APPROVED-PIN UNLISTED` naming the two 09-08 HTML paths |
| F2-LAND (E fact 23) | closed at `b9777fe4` on `rebuild/d-f2-land` (`DECISIONS:581`, carrier changed `:582`) | 81/81 and plan-edit 90/90 | none; N1/N2 wait for the next cell edit |
| PASSPHRASE-NORMALIZE | `ba04c07f`, already merged into this lane | blind review ACCEPT WITH NOTES, no product defect (`DECISIONS:601`) | none in product; four cell/paper notes ruled P-PN-1 to P-PN-4 and being built |

**A's row is PENDING ASTRA R6.** `DECISIONS:598` dispatched Astra job 39 at 13:28 ET, narrow by
ruling, from a fresh worktree at `397ac466`: this round's hunks, her own G1 to G6 witnesses and her
own table only. Whatever she still holds is BLOCKING only with an executed input a well-formed spec
or an honest chain can reach; otherwise it is a named debt, and this brief's D-A-FINAL paragraph
(section 8) is the one place that paragraph is amended when her verdict lands.

**C's row is PENDING, in this one place, and the PM has now judged the check.** `DECISIONS:608`
upholds BOTH of narrow check R5's findings, rules **P-PACK-4** (no listing call stands outside a
guard; an unlistable parent is `UNREADABLE` for that entry and THE LIST WALK GOES ON; an unlistable
pack root or ancestor is refused by an EXISTING word; no eighth word enters either vocabulary; the
ancestors are guarded and the declared residual is NOT widened) and **P-PACK-5** (PACK-PIN's `judge`
takes the shape APPROVED-PIN already has, a trusted root plus pinned RELATIVE components, so no code
path compares two absolute paths, the real row and every fixture run the SAME arm, and no fixture is
ever written inside the tree), and declares **D-C-FINAL: round 6 is the LAST build round of these
cells, the check after it reads its hunks only, and survivors become named debts in this brief**
(section 8). Astra job 45 is building it and the narrow Claude check follows. **So C's bar below is
the round-5 bar and it WILL move; nothing in section 2 or section 9 takes a pack number from it.**
`DECISIONS:608` also measures two facts worth keeping: the boundary's repository-root arm, the arm
THE REAL PACK USES, is exercised by no row, and the cells' one CI step has NEVER executed on that
branch (run `35458561027` red at the standing package step, later steps skipped), so the PC and the
farm are the both-system evidence until the S9 head.

**The check itself, for the record.** `DECISIONS:599` withdrew `:566`'s
acceptance and dispatched narrow Claude check R5. Measured by this author in the farm: the check is
published at `0a74d8f2` on `rebuild/b-s9-prep-pack`
(`rebuild/lanes/b/S9-PREP-PACK-CHECK-R5.md`, 515 lines) and its verdict is **REJECT**, on one
blocking defect executed on both operating systems (`approved-pin`'s new component walk calls
`fs.readdirSync(parent)` outside a try, so a directory that can be traversed but not listed makes
the cell throw a message that is none of its seven refusals, and `pack-pin` has the same hole above
its pack root) and one conditional blocking defect a Windows CI runner can hit (`pack-pin` picks its
trusted boundary by string-differencing two absolute paths, so on a runner whose checkout drive
differs from the drive `os.tmpdir()` reports, 50 of the 58 rows go red on an honest tree; loud false
red, never a false green). The check re-measured the bar at `d857d775` and reproduced 58/57/1 and
42/41/1 on both systems, with cell sha256s
`82efbae2e677f15b5e2afb2cd78378a72578da0e9ee8d382657949b4da69eca6` (pack-pin) and
`cdf4a6b4ee975201da76df054383c0a1ef2aab993d5a8b024967408a7d0a0c73` (approved-pin).
`DECISIONS:608` measured the two questions the PM had asked from reading the hunks and answered them
against himself: the 8.3 short spelling and the drive letter's case are NOT hazards, and the digest
rows CANNOT be red at the base, so their red-first evidence is a digest mutant and "the PM's
expectation otherwise was wrong". C's bar numbers above stand as measured at `d857d775` and move
when round 6 lands.

**3.2 The deciding cell.** The spec designates none, and this brief does not invent one. What S9
must show, at integration and not before, is the release and the grant agreeing in both directions
(`b-package.cjs:1501-1504`), every unrelated pin preserved, a descendant package reading the
released file and finding no pin for it, and the two real pack rows going green against the real
pack. **TO MEASURE AT INTEGRATION**; the command is the integrated `--ci --package S9` run of 3.5
plus the fence and pack steps on both runners.

**3.3 The parent's children, re-executed.** All 25 children `packages/S8.json` declares are
re-declared by S9 and must be OBSERVED exit 0 at their needles under `--ci`. Several execute a file
this package MOVES, so **every needle is RECOMPUTED on the integrated head and none is copied**
(E fact 9; S8's own rule at `S8-PREP-AUTHOR-REPORT.md:117`). The six `s8-*` mirrors are re-pointed
at this package's own `s9-*` cells. The table of old value against measured value belongs in the
author report, not here.

**3.4 The package's own child.** `MIN_OWN_CHILDREN = 1` (`b-package.cjs:341`): at least one declared
child must execute a file this spec declares with role `new`. S9 has several candidates (the six
`s9-*` mirrors under `rebuild/m4/workout/test/`, the ui-port cells, the F2 cells), and the choice,
its argv and its needle are TO MEASURE AT INTEGRATION. **The six mirrors are red today for a stated
reason and it is not a skip:** each has 0 pass / 1 fail at module load with `ENOENT packages/S9.json`
(A's report), because the spec file does not exist until integration writes it. They go green when
`packages/S9.json` lands with the measured inventory, and not before.

**3.5 Public CI.** `--ci --package S9` must print `PUBLIC CI EVIDENCE PASS` and the artifact must be
re-proposed through the runner's own `proposed()` path, never hand-written. **S8's PASS is not
copied here.** S9's own `--ci` outcome is TO MEASURE AT INTEGRATION, after the wait list of section
11 clears, and the trip-wire of section 5 rule (a) is expected to make the rebuild job RED at C5 on
both OS while `B PACKAGE S9 PUBLIC CI EVIDENCE PASS` prints on both. If `--ci --package S9` refuses
for a reason this brief did not predict, that is F.2 STOP-3: a finding, not a fix.

## 4. What does not move

- **No `rebuild/engine` byte.** All 45 tracked files stand at S8's own post; the
  `s9-engine-files-differential` child measures it and the runner recomputes the same comparison.
  **`DECISIONS:606` names an engine finding that is held for the owner and it is NOT S9's to fix.**
  Reproduced by the PM: `rebuild/engine/today.cjs` `pickStructural` (`:55`) rightly excludes
  `PROPOSED`, but `genSession` (`:97`) then looks the load up with a `find` over the queue by
  exercise id that does NOT exclude it, so it takes the first entry - the unaccepted one - and
  `rebuild/engine/earn.cjs` pushes the two-rung `PROPOSED` entry FIRST (`:80`) and the classic
  one-rung debut second (`:88`), which is exactly the order in which the card is wrong. **The PM's
  own sentence, and it binds this package: "both files are sealed S8 product keys and ENGINE files;
  `:578` reserves every engine byte to the owner's own word. No byte moves."** The smallest repair
  is one clause in `genSession`, red first with the producer's own order, **as a named reseal child
  that is not this one**, and whether the live app is patched too is the owner's call alone. S9
  declares no engine path and proposes no engine hunk; a round that finds itself wanting one stops
  and says so. An independent Claude check of the finding is running (`DECISIONS:609`).
- **No coach byte.** `rebuild/coach/engine-revision.cjs` reads
  `ENGINE_REVISION = "M2-S8-REAL-SHAPE@<the S8 receipt's first 16 hex>"` for the whole of the build,
  the review and the first authorized `--full`. It moves ONCE, after the sealed run writes
  `rebuild/lanes/b/tooling/receipts/S9.json`, to `M2-S9-UI-PINS@<first 16 hex of the sha256 over that
  receipt's raw bytes>`, by the PM, in the commit after the seal. The exact standing value is TO
  MEASURE AT INTEGRATION by reading the constant, not by copying it from S8's brief.
- **Zero U+2013 and zero U+2014** on any line this package writes, measured.
- **The sealed bundle and the six words are unchanged.** S9 needs nothing new from the owner.
- **The owner's own words are not paraphrased where a release or a deploy is concerned.** Two that
  bind this package, quoted with their ledger lines: `DECISIONS:536`, **"Yes, release the screen
  files"**, which is the whole authority for the closed list of two; and `DECISIONS:593`, in the
  owner's own words, **"1. C-UI-0 is the long pole for the look. ... No check is dropped."** and
  **"4. Put Astra's gauge number in every status you send me."** S9 does not re-order anything he
  sequenced, and `DECISIONS:590`'s trial-order question is explicitly NOT RULED and must not be
  presented as accepted.

## 5. The two reseal rules of VERDICT-S6.md, applied

**Rule (a) - the standing CI step names the new package INSIDE the package's own post, before
`proposed()`, never at the fast-forward.** `.github/workflows/rebuild.yml:150` reads
`run: node rebuild/lanes/b/tooling/b-package.cjs --ci --package S8` at the chain tip today (measured
by this author at `789baf6e`); in this branch it becomes `--package S9`, the step NAME moves with
it, and the file's post sha in `packages/S9.json` is measured AFTER that edit and after every other
step this package adds. `DECISIONS:498` is why: `rebuild.yml` is a declared product file whose post
the sealed run pins, so a step flipped after the seal refuses `WORKTREE-SOURCE-PIN` on the
byte-identity step. **The C5 trip-wire behaves as it did at S7 and S8 and this brief says so in
advance:** from the moment this branch names `--package S9`,
`rebuild/coach/test/engine-revision.test.cjs` looks for `receipts/S9.json`, which does not exist
until the seal, so the rebuild job is RED at C5 on both OS while
`B PACKAGE S9 PUBLIC CI EVIDENCE PASS` prints on both.

**Rule (b) - the revision cells read the SEALING WINDOW.** `DECISIONS:499`, one function
`standingSeal(repoRoot)` with `REVISION_RULE` quoted in every refusal. Read against S9 that is:
standing `S9`, `receipts/S9.json` ABSENT, so the window branch applies; `packages/S9.json` exists
and is `BRIEF-ACCEPTED`; its `parent.chosen` is `S8`, whose `receipts/S8.json` exists; so the
constant must equal `M2-S8-REAL-SHAPE@3b1b8b91dd5a6ff0`, **which is exactly where
`rebuild/coach/engine-revision.cjs:25` stands at the chain tip, measured by this author at
`789baf6e`**, and where section 4 keeps it. None of the three window cells is edited by this
package.

**5.1 What the runner needs before any of this can run: the E fact list, 1 to 23.** Facts 1 to 22
are spec section E; fact 23 is `DECISIONS:582`. **Facts 1 to 7 and 12 are ALREADY BUILT on
`rebuild/b-s9-prep-runner` at `397ac466` and this brief states them as measured there, not as work
to do.**

| # | fact | state, with the head it was measured at |
| --- | --- | --- |
| 1 | `IDS` gains `'S9'`, directly behind `'S8'` and ahead of `'B1'`; THIRTEEN ids | BUILT. Measured at `397ac466`, `b-package.cjs:177`: `['B-NTC','H3','S3','S4','S5','S6','S7','S8','S9','B1','B2','B4','B3']` |
| 2 | `NO_REGISTER_IDS` gains `'S9'`; NINE ids | BUILT. Measured at `397ac466`, `:324`. `S9` is an S- id, so the shape assert at `:329-:330` admits it without a by-name PM ruling |
| 3 | `CHILD_ROOTS` gains the new lane roots | BUILT to TWENTY-FOUR. Measured at `397ac466`, `:427-:481`: S8's twenty plus `rebuild/lanes/d/p3-layout-v2/`, `rebuild/lanes/c/p3-today-hotfix/`, `rebuild/lanes/c/passphrase-normalize/` and `rebuild/lanes/c/s9-today-carry/`. **`rebuild/lanes/c/ui-port/` is the TWENTY-FIFTH and is deliberately NOT in yet**: F7 asserts every root is a real directory of this repository, and it is added with C-UI-1's bytes at the single re-measure |
| 4 | Of the new roots, ONLY `rebuild/lanes/c/ui-port/` joins `PUBLIC_TAIL_ROOTS` | NOT YET. Measured at `397ac466`, `:531-:532`: `PUBLIC_TAIL_ROOTS` still has its SIX. A child root says a suite may be EXECUTED; that list says its output may be PRINTED, and the second is argued per root with `TAIL_DENYLIST` in hand |
| 5 | Six `s9-supersede-*` / `s9-engine-files-differential` mirrors | BUILT, and red today at 0 pass / 1 fail each with `ENOENT packages/S9.json` (section 3.4) |
| 6 | F6 takes `IDS` of thirteen, `NO_REGISTER_IDS` of nine and `PRODUCT_ROLES` of SIX by literal and `deepEqual`; F7 takes `CHILD_ROOTS` whole and in its `slice(8)` literal | BUILT. Measured at `397ac466`: `pinned-unchanged-and-ruled-substitutions.test.cjs` F6 at `:272`, F6b at `:341` ("PRODUCT_ROLES is the closed six, in order, with M2-S9-UI-PINS's released last"), F7 at `:383`, F8 at `:489`. `PRODUCT_ROLES` at `b-package.cjs:367` is `['edited','carried','new','superseded-by-child','pinned-unchanged','released']` |
| 7 | The runner sha re-pinned in `H3`, `S3`, `S4`, `S5`, `S6`, `S7` and `S8`, `tooling.runnerSha256` only | BUILT and **DONE LAST**, which is the rule: `DECISIONS:598` records round 6 redoing E fact 7 last, seven packages re-pinned by one value each. It is done last again at integration |

| # | fact | state, with the head it was measured at |
| --- | --- | --- |
| 8 | `packages/S9.json` is S8's child by the ARTIFACT sha256, re-measured from Git | TO DO at integration. The value is the header's `3cf58e0e...`, measured by this author; the receipt `3b1b8b91...` is the RECEIPT and copying it here is the round's most likely error |
| 9 | Every pre/post measured FROM GIT at the declared `sourceBase`, never copied from a report | A RULE, applied by this brief to itself |
| 10 | The standing CI step becomes `--package S9`, named inside S9's own post before `proposed()` | TO DO. Section 5 rule (a) |
| 11 | The revision cells read the sealing window | Section 5 rule (b); measured standing constant `M2-S8-REAL-SHAPE@3b1b8b91dd5a6ff0` |
| 12 | Five `CHILD_SPECS` cells gain `'S9'` as the youngest | BUILT. Measured at `397ac466`, e.g. `today/test/setup.test.mjs:2365`: `['H3','S3','S4','S5','S6','S7','S8','S9']` |
| 13 | H1 to H13 and H17, the release mechanism, plus `tooling/test/release-from-seal.test.cjs` added to `TOOLING_FILES` in the same hunk | BUILT through round 6, with P-A1 to P-A13 on top (`DECISIONS:560`, `:567`, `:572-:573`, `:579`, `:587`, `:598`). PENDING ASTRA R6 |
| 14 | The D.2 fence cell and its `rebuild.yml` step, reading the inventory out of Git at `CHAIN_REF` | ACCEPTED at `8019abf6` (`DECISIONS:591`). The step is still TO ADD to `rebuild.yml` |
| 15 | The `released` block in `rebuild/m4/spec/acceptance-s9-ui-pins.json`, both paths, each with `role: "released"`, `lastSealedSha256`, `sealedBy: "M2-S8-REAL-SHAPE"` and the token line's sha256 | TO DO. Written by `proposed()`, never by hand |
| 16 | H18, H18b, H18c in `today/test/package.test.cjs` | TO DO. H18 is the 26-entry `REQUIRED_INPUTS` literal for `today/**`, 26 of 48 and not of 51; H18b binds the whole 48 by count; H18c the engine pack (`DECISIONS:570`). **Without H18 that goes red on a deleted entry, `build.mjs` leaves the closed list and the token line is rewritten before it is written** (F.2 STOP-6) |
| 17 | SIX `pinned-unchanged` declarations, `design.cjs` NOT one of them | TO DO, **and see 2.4.1: as the runner stands, four of the six refuse by name.** This fact is the one that adds `rebuild/m1/` to the sealed inventory for the first time |
| 18 | H19 and H19b, the two pack cells under `rebuild/lanes/c/ui-port/`, both `role: "new"`, with their `rebuild.yml` step beside the fence's; `copy-bind.test.mjs` WITHDRAWN | BUILT at `d857d775`, literals unfilled, **and REJECTED by narrow check R5 at `0a74d8f2`** (section 3.1) |
| 19 | `today-model.cjs` NOT declared and carried out loud; `browser-check.mjs` NOT declared and NO CI home | Section 2.5 and section 8 |
| 20 | S9-TODAY-CARRY's FOUR declarations | `today-app.cjs` (`edited`, the one binding line), `today/test/view.test.mjs` and `today/test/adapter.test.mjs` (`edited`, product AND execution pins), `.github/workflows/rebuild.yml` (`edited`). **E20's sentence that the two lane cells are not declarations is SUPERSEDED by the runner's rule** (section 2.4) |
| 21 | PASSPHRASE-NORMALIZE's declarations | `import-bundle.mjs`, `import-screen.mjs`, `import/test/page-bundle.test.mjs`, `rebuild/m3/setup/port/passphrase.cjs` (`new`, SEALED), plus the three lane cells with a CI STEP and a CHILD ROOT. That step is the guard that keeps every sealed bundle valid, not a convenience |
| 22 | `rebuild/m3/w6/test/local-import.test.mjs` gets a CI HOME | Its root `rebuild/m3/w6/test/` is already in `CHILD_ROOTS`, so this costs a `rebuild.yml` step and a declared child and no `CHILD_ROOTS` hunk |
| **23** | **F2-LAND rides S9 in its ENTIRETY**: the unchanged module, BOTH cell paths, the CI step and the combined `rebuild.yml` post (`DECISIONS:582`, which REVERSED the standalone merge plan of `:581`) | Closed at `b9777fe4`. Its two cells get ONE explicit step and ONE declared child; the workflow post is measured combined, never taken from F2's own report |

**The release must not collide with an execution pin.** The runner refuses a released path that
`proposed()` would put back into `executionPins` by any of its five routes - the runner, this
package file, the brief, the carrier successor, or a child argv target (`b-package.cjs:1519-1547`,
`:3320-:3327`; `DECISIONS:567`). Release DELETION is admitted; unrelated drift, completeness and
held checks remain; and **a ticket that moves a released file before the `sourceBase` stops S9
sealing**. Neither `preview.css` nor `build.mjs` is any of the five today, and that is TO RE-MEASURE
at integration because C-UI-1 may add a child.

## 6. The flow, in S8's order with S9's names

1. **Brief accepted by name** - a PM line naming `rebuild/lanes/b/S9-UI-PINS-BRIEF.md`.
2. **FOUR token lines on the tip**, not three: THEME, BRIEF-BY-SHA, GATE-SUPERSESSION and, new to
   this package, RELEASE-FROM-SEAL. Their exact required text is section 10.
3. **The author cites all four in `packages/S9.json`** (`authorizations.theme`,
   `brief.acceptedLedgerLine`, `coverage.superseded.rulingLineSha256`, `release.rulingLineSha256`),
   each a sha256 over the exact line bytes with no trailing newline. A null
   `coverage.superseded.rulingLineSha256` is a HARD refusal,
   `GATE-SUPERSESSION-RULING-NOT-CITED`, exit 1, before the theme and brief obligations are reached
   (`b-package.cjs:1408-1410`); a spec that carries a `release` block with no released declaration
   refuses `RELEASE-BLOCK-WITHOUT-A-RELEASED-DECLARATION` (`:1478`).
4. **`--ci --package S9` prints `PUBLIC CI EVIDENCE PASS`**, artifact re-proposed through
   `proposed()`.
5. **ONE integrated re-measure** (spec E.2's last row): every pre/post from Git, every needle by
   running each child, the spec sha256, the brief sha256, `--ci` again.
6. **Fable final review** over the sealed candidate (`DECISIONS:439`), independent of the build's
   reviewers, high effort.
7. **PM `--full` with the private census on the PC**, verdict-only.
8. **The receipt line**, `POSTFIX-ACCEPTANCE M2-S9-UI-PINS <commit>
   rebuild/m4/spec/acceptance-s9-ui-pins.json <sha256> ACCEPTED`, discharging the open obligation.
9. **`rebuild/m4/spec/review-s9-ui-pins.json`**, citing that receipt line.
10. **MERGE the tip into the reviewed head. NEVER rebase.** Under `DECISIONS:582`'s integrator
    preflight, before any chain merge-forward, intersect the `chain...lane` changed names with the
    youngest product and `executionPins`; a sealed hit routes the lane to a reseal child.
11. **Authorized `--full`**, then **the coach constant, once**, then the **second authorized
    `--full`** (`AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY`).
12. **CI green on both OS**, then **fast-forward**. Under `DECISIONS:563` as amended by `:565`, the
    PM alone merges the tip at acceptance, pushes, holds the ledger, waits for both OS and only then
    fast-forwards and appends. `:565`'s product-tree exception applies only to a later merge
    bringing DECISIONS and STATUS alone, with the name-only diff recorded.

## 7. Carries recorded, not adopted, and the eleven stop conditions inherited

**The round stops and reports rather than proceeding** on any of spec F.2's eleven, read with the
later rulings: (1) no `RELEASE-FROM-SEAL` line on `rebuild/t2-client-core`, or more than one line
hashing to the cited sha, or a line whose last clause is not the bare word `RULED`; (2) a hunk that
would touch `held()`, the drift assert or the completeness walk - STOP-2 is amended for the named
P-A asserts and `pins()` for H17 only, and NOTHING else; (3) `--ci --package S9` refusing for an
unpredicted reason; (4) a cell over a released file that cannot be re-homed honestly, in which case
the closed list shrinks; (5) quoting the about-one-week figure while TODAY-SPLIT is rejected or
shelved; (6) H18 unbuildable, in which case `build.mjs` leaves the list; (7) the fence unable to
read the sealed artifact out of Git at `CHAIN_REF` on a GitHub runner; (8) a D.2 skip that can only
be derived from a branch declaration, in which case the fence ships with no skip at all; (9a)
PACK-PIN unable to name the path, and (9b) anyone proposing to narrow the whole-pack pin, which is a
PM decision on the record and never an author's convenience; (10) a `design.test.cjs` edit that
cannot be made honestly when C-UI-1 seals, in which case S9 reports rather than inventing a
substitute; (11) anyone proposing to ship S9 with a sentence saying the copy locks are now real.
**Eleven stands as eleven and this brief adds none and removes none.**

**Carried and none blocking**, each named so it does not vanish under a green tooling total
(`DECISIONS:567`): release deletion admission; unnamed and unreachable-in-CI
`RELEASE-CHAIN-REF-ABSENT`; the root-and-tail policy held only by the list length; and the residual
B.8 behavior-recording row.

**Also carried:** the fence's non-NUL diff parsing relies on Windows forbidding quote and TAB in a
file name; that is a platform constraint, not a guarantee the fence supplies, and `-z` with
per-record field counting is the complete answer the day it changes (B's report 13.10 (2)). The
cell's byte-exact artifact comparison means the same thing on both runners only because
`.gitattributes` says `* text=auto eol=lf`, and `.gitattributes` is in NEITHER S8 map, so nothing in
this ticket can seal it (B's report 13.10 (3)). Accepted pack paths are ASCII; the comparator rows
do not prove a non-ASCII filename on disk, and ignored subtrees remain a stated boundary rather than
a widened ignore list. An importable Python file inside an ignored `__pycache__` directory is
invisible by construction; a future extra output directory counts as ADDED rather than justifying a
wider ignore list; APPROVED-PIN refusals must be matched in full and never by the prefix
`design.cjs` already uses.

## 8. THE NAMED DEBTS

**Read this section as a list of things that are OPEN. Nothing in it is closed by S9 sealing, and a
later reader who takes one of these lines for a closed item has misread it.** Each debt is one line,
with the head or ledger line that states it.

**D-A-FINAL - the runner's surviving coverage. PENDING ASTRA R6.** `DECISIONS:587` made round 6 the
last runner author round before S9 and its narrow re-check the last look; whatever survives is named
debt here. The author's own NOT CLOSED list at `DECISIONS:598`, verbatim in substance and OPEN:
(1) the three older path maps are unreachable, not repaired; (2) a LONE uppercase alias still fails
raw inside `L.checkSources` with `failCode=null` rather than by name; (3) the Windows spellings
Astra measured as never reaching an authorized artifact get no clause; (4) `spec()` is exercised,
not covered. To these `DECISIONS:598` adds one recorded item that is NOT a defect and must not be
listed as one: `(P-A9 e)` is a COVERAGE cell that was green red-first. **This paragraph is the ONE
place D-A-FINAL is stated, so it is the one place to amend when Astra job 39 returns.**

**D-F2-1 / F2-GUARD-TERM-COVERAGE - eleven guard terms with no behaviour row.** Five looks over 960
calls across two corpora and one targeted review leave these eleven terms of
`rebuild/m4/workout/setup-tags.cjs` unrowed, and `DECISIONS:577` and `:581` forbid a fifth survivor
hunt and forbid calling any of them redundant: `:16` `plain(): !Array.isArray(x)`; `:19` `day()`'s
`/^\d{4}-\d{2}-\d{2}$/` regex; `:29` `typeof value !== 'object'`; `:41` `!own(descriptor,'value')`;
`:58` `b === null`; `:74` `freeze(regionsByMuscle)`; `:86` `tag.head` fallback to `e.mg`; `:124`
`!own(snapshot, e.id)`; `:154` `!own(e,'head')`; `:154` `!own(e,'secondary')`; `:181`
`!plain(facts)`. All eleven leave only F2-G22 red. **A future edit of this module is reviewed term
by term and never trusted to that cell alone.** The carrier moved from S10 to S9 at
`DECISIONS:582`, so the debt rides S9 and is restated in S9's verdict.

**THE FENCE'S STATED LIMIT, in the spec's own words.** Spec D.2, last row: three files that WRITE
ATHLETE STATE stand outside the sealed inventory today - `today-model.cjs:378` (`weighIn` through
`:395`), `gym-model.mjs:502` (`logSet`) and `checkin-app.mjs:150` (`model.save()`). E fact 17 brings
two of the three inside. `today-model.cjs` stays outside until TODAY-SPLIT, so **"until then this
fence passes a lane C branch that rewrites the weigh-in admission bounds"**. That sentence is
required in the brief by the spec and it is here. D.4 is the cell that would close the general form
and S9 does not build it.

**THE FENCE'S CALLER AND PLATFORM DEBTS.** `P-FENCE-2` removed the tamper-query catch and
`FENCE-INVENTORY-HEAD-UNREADABLE`, so fail-closed behaviour now rests on the CALLERS: **no caller
may swallow the removed catch's throw** (`DECISIONS:591`; B-R6:483-496), and no restored named
refusal was ordered. Mutation Y2 is killed only on WINDOWS; on linux it is not (B-R6:320-329).

**D-C-FINAL - the pack cells' surviving coverage.** `DECISIONS:608`: round 6 of the pack cells is
the LAST build round, the narrow check after it reads its hunks ONLY, and whatever survives is a
named debt here. **Two items are already routed to this brief by that line and they are debts now,
not open questions:** (1) **a junction at an ANCESTOR of the pack root and a junction AT the root
are named by DIFFERENT words**, so a reader of a refusal must know which of the two it is looking
at; (2) **a list entry spelled with a dot segment is now `MISSING`**, which is a consequence of
P-PACK-1's exact-spelling comparison against each parent's own listing and is stated rather than
repaired. A third fact from the same line belongs beside them because nothing rows it: **the trusted
boundary's repository-root arm, which is the arm THE REAL PACK USES, is exercised by no row.**
**This paragraph is the ONE place D-C-FINAL is stated, so it is the one place to amend when round 6
and its check return.**

**THE WHOLE-PACK RESIDUALS.** The real rows of both pack cells are held only by the eventual seal;
`PACK_ROOT_REL` has no protecting row of its own; and the P37/P39 output-order sorts remain UNROWED
because deterministic filesystem enumeration was unavailable. `DECISIONS:566` ordered the unrowed-
sort debt preserved and it is preserved here. Q4 is what keeps the two real reds off the chain
before S9 (`DECISIONS:556`).

**THE WORDING LOCK, and it is S10's precondition, not S9's achievement.** Of the 218 entries on the
locked list, **215 are asserted by a cell inside the sealed set** - `design.test.cjs:72` runs
`assertDesignBinding` over the real references, template and view source, and `design.cjs:542-:555`
asserts all 60 `APPROVED_COPY` twice, all 39 `RUNTIME_COPY` plus `CHECKIN_RUNTIME_COPY` twice and
all 116 `PREVIEW_RUNTIME_COPY` - **and three are NOT asserted: the three `PREVIEW_COPY` entries,
which are a skip list at `design.cjs:537` and a normalisation check at `setup.test.mjs:1090`.** The
assertion runs in ONE direction: a sentence still on the list is still on the screen and still in
the approved design. **Nothing checks that the list still holds the sentence, so ANY of the 218 can
leave list and screen together in one edit.** 47 of the 218 (39 distinct) occur in no sealed file at
all; 139 is the count of those occurring verbatim in the pinned half of the 09-18 pack and is NOT a
count of what nothing checks. The reference set is 844 FILES under `quality/baseline/`: 424 `.png`,
419 `.json` state records including `INDEX.json`, and one `ENV.txt` - 424 reference images AND the
record of what each screen says. The records are **418** (INDEX.json is not a record), the ids
**209** and the distinct texts **200**. **R4's table governs on all of these (the PM's ruling on
contradictions 7 and 8), and every pack count is RE-MEASURED at the pack's final head; none of
these numbers is a literal to paste into a cell.** COPY-BIND is withdrawn; reverse and list
completeness are S10's precondition (`DECISIONS:546`, `:549`).

**THE KNOWN REDS, and which of them the seal turns green.**

| red | where it stands, measured | does the S9 seal turn it green? |
| --- | --- | --- |
| The six `s9-*` mirror load reds, 0 pass / 1 fail each, `ENOENT packages/S9.json` | `rebuild/b-s9-prep-runner` at `397ac466` | **YES**, the moment `packages/S9.json` exists with the measured inventory. They are reds, never skips |
| The fence's REAL ROW, 1 of 44 | `rebuild/b-s9-prep-cells` at `8019abf6`, both systems | **YES, but only at integration**, when the real S9 child satisfies the verified reseal conditions of D.2 (five conditions, default FAIL) |
| `PACK-PIN PACK-ROOT-ABSENT rebuild/m1/approved-2026-09-18`, 1 of 58 | `rebuild/b-s9-prep-pack` at `d857d775`, both systems | **IN TWO STEPS**: `PACK-ROOT-ABSENT` now, then `LITERAL-EMPTY` when the pack arrives, then green when the literal is filled on the day |
| `APPROVED-PIN UNLISTED` naming the two 09-08 HTML paths, 1 of 42 | same head, both systems | **YES when the literal is filled**, and only then |
| `measure/test/boundary.test.mjs` P-MEASURE (g) and `today/test/setup.test.mjs`'s re-pin, red for carried bytes S9 had not yet declared | `DECISIONS:552`; B:79-92; A:594-605 | **YES**, by the same mechanism that turned S8's five green: declaring the files with their posts and putting `'S9'` in `CHILD_SPECS`. Preparation added its own edits to those named lists |
| `rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs:29` | chain tip, stale-red already | **NO. See section 9, item 8** |

## 9. THE INTEGRATION HAND LIST

**A checklist for the integrator, in order.** The integrator is the PM (`DECISIONS:563` as amended
by `:565`). Nothing in this section is done by a preparation lane, and no preparation lane's branch
reaches the chain before S9 (`DECISIONS:556`, Q4).

**1. The merges, in this order, each with the `DECISIONS:582` preflight run FIRST** (intersect the
`chain...lane` changed names with the youngest `product` and `executionPins`; a sealed hit routes
the lane to a reseal child instead of a merge): the runner lane `rebuild/b-s9-prep-runner`; the
fence lane `rebuild/b-s9-prep-cells`; the pack lane `rebuild/b-s9-prep-pack`; `rebuild/d-f2-land`
(E fact 23, whole branch); and C-UI-1 when it lands. `rebuild/c-passphrase-normalize` at `ba04c07f`
and S9-TODAY-CARRY are already merged into this lane. **After every merge, `git rev-parse HEAD` is
the candidate `sourceBase` and every pre/post below is re-measured against it.**

**2. The cross-lane cell: the fence's release-object shape against the runner's real artifact.**
`DECISIONS:559` ordered this compatibility check and no lane owns it, because neither lane can build
the other's input. Measured by this author at both heads: the runner declares `released` as the ONE
optional artifact key in `ARTIFACT_KEYS` (`b-package.cjs:3408-3420`), closed in `envelope()` by
`same(m, proposed(s, bound))`; the fence reads it as
`new Set(Object.keys(inv.released || {}))` (`sealed-inventory-fence.test.mjs:158`) and its own R1 N1
comment says E fact 15 makes `released` an OBJECT KEYED BY PATH. **The cell asserts that the real
`acceptance-s9-ui-pins.json` the runner writes satisfies the fence's reading, both paths present as
keys, against the real artifact and not against a fixture inventory.** It is ONE new cell at
integration and it belongs to whoever writes the artifact, not to lane B or lane C.

**3. The pack-pin CI step, with its `if:` line and its own row.** `DECISIONS:559` (P-FENCE-1):
"the pack-pin step of S9-PREP-C needs the same condition and the PM adds it as integrator", and
`DECISIONS:570` adds "plus its own row". The fence's step is built and measured:
`rebuild.yml:258` on `rebuild/b-s9-prep-cells` carries **`if: ${{ !cancelled() }}`** and the cell's
row (18) at `sealed-inventory-fence.test.mjs:1185-1201` reads the workflow back and asserts the
condition stands by regex `/!\s*cancelled\(\)/`. **The pack step gets the same string and a row of
its own inside the pack cell, not a second row inside the fence cell.** The reason the condition is
needed at all, in one sentence: GitHub skips every step after a failed one, the standing
`--ci --package S9` step fails on exactly the branches the fence and the pack exist for, and a gate
that is skipped in the world it was written for is not a gate.

**4. R6's ONE row with TWO asserts.** `DECISIONS:591`, carried from B-R6 section 6 (R6-Z2 and
R6-Z3): a SAME-LENGTH edit of the sealed inventory must FAIL by name, and a ZERO-BYTE inventory must
FAIL by name. Both substitutions are non-equivalent and both left all 44 existing rows green on both
systems, so the existing rows do not cover them. **One row, two asserts, added to
`sealed-inventory-fence.test.mjs` at integration and reviewed by Astra with the integration.**

**5. The N5 paper numbers.** Review R6 found four statements of B's author report stale, all of them
made stale by the integrator's own comment-only commit `8019abf6` landing after section 16 was
written, none of them the builder's error; the PM corrected them at `6f808cfa` in a new section 17,
and `DECISIONS:591` with the PM's ruling on contradiction 11 makes that corrected text the B report
of record. The numbers are: the cell sha256 is
`673a02f9334af5e6a4469a4085ead55bcc465b1a62650a49da3896207986b199` at `8019abf6` and not
`43bcda2071...762077e6`, which is the cell at `2f37a36e`; the diffstat is **56 lines and 222
insertions**, not 55 and 221, the one comment line `8019abf6` added; "it was not reworded" is true
at `2f37a36e` and not at the head; and section 15's present-tense account of
`FENCE-INVENTORY-HEAD-UNREADABLE` is HISTORY, because P-FENCE-2 removed the refusal and its catch.
**At integration all four are re-taken at the integrated head, because the R6-Z2/Z3 row of item 4
moves the cell's bytes again.** (This author reads "the N5 paper numbers" as this corrections list;
if the PM meant another N5, the item is the same work at a different name.)

**6. The CI homes, one explicit step each, named by exact path and never globbed**
(`DECISIONS:117` (4), `:186` (3)): the fence; the two pack cells; the passphrase lane's three cells
(E fact 21, and that step is the guard that keeps every sealed bundle valid, not a convenience);
`rebuild/m3/w6/test/local-import.test.mjs` (E fact 22, which at the chain tip `rebuild.yml` names
**zero** times); the Today lane's two cells in ONE step; the `p3-layout-v2` cells; and
**E fact 23: F2-LAND's TWO cells, `rebuild/lanes/d/f2/projector.test.mjs` and
`rebuild/lanes/d/f2/guard-coverage.test.mjs`, in ONE explicit step with ONE declared child**
(`DECISIONS:582`). Every step becomes a declared child, because a declared child mirrors a CI step
and `childArgv()` judges every target against `CHILD_ROOTS`. **`rebuild/lanes/c/ui-port/` is added
to `CHILD_ROOTS` as the twenty-fifth root and to `PUBLIC_TAIL_ROOTS` in the same hunk, and it is the
ONLY new root that joins the tail list.** `rebuild.yml`'s combined post is measured ONCE, after all
of them.

**7. `DECISIONS:570` left one CI decision to the PM and this brief does not make it: whether the
E21 and E22 steps also run after a failed standing step**, that is, whether they too carry
`if: ${{ !cancelled() }}`. The fence and the pack are ruled; these two are not. **OPEN.**

**8. The disposition of `rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs:29`. The PM rules
this in review; this brief states the three options and their cost and recommends none.** The
measured facts, taken by this author at chain tip `789baf6e`: line 29 is
`test('workflow changes exactly one command and retains both OS jobs', ...)`, which reads
`.github/workflows/rebuild.yml` at commit `a777f64318dfb9b4766fa336d623196d07b5fc00` out of Git and
asserts `actual === original.replace(before, after)` for one exact command substitution, so **any
`rebuild.yml` hunk turns it red**, and S9 adds at least seven. It is stale-red already, by
`h3-clean-init.test.cjs:718`'s own words and not B's. `rebuild.yml` names `ci-second-gate` **zero**
times, so it has no CI home. **And it is in NEITHER S8 map**: not in `product`, not in
`executionPins` (measured by parsing the parent artifact), so editing it is NOT a sealed act and
does not by itself require a reseal child.

| option | what it costs | what it gives up |
| --- | --- | --- |
| (a) RE-PIN it: move the baseline commit from `a777f643` to S9's own `rebuild.yml` post | one edit of a free file, inside S9 so the value is the sealed post. But the cell has NO CI home, so nothing runs it and the re-pin goes stale again at the next `rebuild.yml` hunk | nothing measurable today; it buys a green nobody observes |
| (b) GIVE IT A CI HOME and re-pin | one `rebuild.yml` step plus the re-pin; it then runs on both OS and goes red honestly the next time anyone edits the workflow | it makes every future workflow edit a red, in a cell whose subject is a step substitution that happened once |
| (c) RETIRE it explicitly, on the record | one deletion of a free file plus a ledger line saying why | the only thing it asserts that nothing else does is that both OS jobs are retained and no `\|\| true` was added; if it goes, that assertion must be re-homed or knowingly dropped |
| (d) DO NOTHING and carry it | zero now | it stays a red nobody can explain, which is exactly what `DECISIONS:570` routed to this brief to stop |

**An unrecorded deletion or a quiet re-pin is not one of the four.**

**9. The day-of pack procedure for the PACK-PIN and APPROVED-PIN literals.** This is the last
mechanical act before the seal and it is done in ONE sitting, in this order.
(i) **Every platform-of-record baseline must exist first** (R4's correction, adopted as a literal
precondition at `DECISIONS:549` B): otherwise the first Windows accept forces a reseal.
(ii) Check out the design lane's ACTUAL head, the one C-UI-0 and C-UI-1 leave behind, and confirm it
against the binding identity, tree `6d7710467408f69e61a2917c583540fc2336a3fa` (`DECISIONS:546`);
**the README's claimed composite sha is unreproducible and is not the identity.**
(iii) Walk the spec's pack root, `rebuild/m1/approved-2026-09-18/**`, **the WHOLE tree including
`README.md` and `quality/**`**, against the WORKING TREE, with forward-slash paths and byte ordering
on both operating systems, `lstat` first and never following a link, refusing `NOT-A-REGULAR-FILE`
by path (`DECISIONS:549`, `:556`, and P-PACK-1 at `:599`, which walks EVERY component below the
trusted root and compares each component's spelling exactly with its parent's own listing).
(iv) Take the sorted `(path, sha256)` literal. **The obsolete 53-file literal and v3's
`6121aa91...` are superseded and must not be reused** (spec C.5.1, R15).
(v) Run the Windows working-tree comparison before the literal is committed.
(vi) APPROVED-PIN's literal is whatever runtime `design.APPROVED` names at the S9 head, read
parametrically, **including approved paths OUTSIDE the new pack**; it needs lane C-UI's answer to
OQ-2 first. Its vocabulary now has seven refusals, including `UNLISTED` for a runtime path absent
from the literal (R4, `:549` B) and `ORPHAN` and `UNREADABLE` (`:556`), and the full refusal string
is matched, never the prefix `design.cjs` already uses.
(vii) Only then are the two real rows expected to go green. **Both literals are integrator-only**
(`DECISIONS:566`); a preparation lane does not fill them.

**10. E fact 7 is done LAST**, after every other runner hunk has landed and the runner's bytes have
stopped moving: seven packages, `H3`, `S3`, `S4`, `S5`, `S6`, `S7`, `S8`, each re-pinned by ONE
value, `tooling.runnerSha256`. This is not a preference; it is how round 6 was built
(`DECISIONS:598`) and re-pinning before the last hunk means doing it twice and publishing a stale
value in between.

## 10. THE FOUR PM TOKEN LINES, AS REQUIRED TEXT

**NOTHING IN THIS SECTION IS AN ISSUED LINE, AND NO LINE HERE GRANTS ANYTHING.** These are the four
exact text requirements the runner enforces, READ OUT OF THE RUNNER'S CODE at `397ac466` and never
from memory, so that the PM can write four real lines on the chain branch and the author can cite
them. A brief cannot authorize itself, and a line written on a lane branch authorizes nothing: the
runner re-reads `rebuild/DECISIONS.md` at `CHAIN_REF` on EVERY call, splits on `/\r?\n/`, hashes
each complete UTF-8 line WITHOUT its newline, and requires EXACTLY ONE line to hash to the cited
value (`b-package.cjs:1418-1421`, `:1485-:1488`). The leading `- ` is part of the hashed bytes; the
trailing newline is not. There is no cache: a ruling withdrawn mid-run stops admitting mid-run.

**SEP below means the single character U+00B7, and this section prints it LITERALLY, exactly as the
spec does and as the runner's own constant `RULED_CLAUSE_SEPARATOR` at `b-package.cjs:1012` holds
it. It is the ONE non-ASCII character in this file, it is deliberate, and a reader copying a clause
out of this section is copying the right byte. U+2013 and U+2014 appear nowhere.**

Both grant readers split the whole line on SEP, trim each clause, and require an ANCHORED FULL
CLAUSE match. A negation, a quote, a bracket, a backtick, an emphasis marker or any surrounding
prose leaves the clause something other than the token and **frees nothing**
(`b-package.cjs:971-995`).

**10.1 RELEASE-FROM-SEAL.** Feeds `release.rulingLineSha256` in `packages/S9.json`, a 64-hex string
and never the text (`b-package.cjs:1474-1504`).

Grammar, verbatim from `b-package.cjs:993`:
`/^RELEASE-FROM-SEAL\s+(M2-[A-Za-z0-9-]+)\s+([A-Za-z0-9_.\/-]+(?:,[A-Za-z0-9_.\/-]+)*)$/`

**The required clause, which must stand ALONE as one whole SEP-delimited clause of a real PM line
on `rebuild/t2-client-core`:**

```
RELEASE-FROM-SEAL M2-S9-UI-PINS rebuild/m3/w7-preview/today/preview.css,rebuild/m3/w7-preview/today/build.mjs
```

No space after the comma; the path list is one token. The LINE that carries it must have as its
LAST SEP-delimited clause, trimmed, exactly the bare word `RULED` (P-A1, `b-package.cjs:1013`,
`ruledTerminal`): a line ending "this is NOT RULED" is not a ruling and two reviewers in turn
measured the old last-word test admitting one. The granted path set and the declared `released` set
must be EQUAL in BOTH directions (`:1501-:1504`), every granted path must be a key of the PARENT
artifact's product map with its declared `pre` equal to that parent pin, and no granted path may be
one `proposed()` would put back into `executionPins` by any of its five routes.

**10.2 GATE-SUPERSESSION.** Feeds `coverage.superseded.rulingLineSha256`. A null there is a HARD
refusal, `GATE-SUPERSESSION-RULING-NOT-CITED`, exit 1, before the theme and brief obligations are
reached (`b-package.cjs:1408-1410`).

Grammar, verbatim from `b-package.cjs:980`:
`/^GATE-SUPERSESSION\s+(M2-[A-Za-z0-9-]+)\s+([a-z0-9]+(?:-[a-z0-9]+)*(?:,[a-z0-9]+(?:-[a-z0-9]+)*)*)$/`

**The required clause shape, alone in its own SEP clause:**

```
GATE-SUPERSESSION M2-S9-UI-PINS <carrier>[,<carrier>...]
```

**The carrier vocabulary is CLOSED and measured at `b-package.cjs:926-927`:**
`source-carriers`, `inherited-carriers`, `defect-witnesses`, `writers-differential`, `second-gate`.
A token naming anything else refuses
`GATE-SUPERSESSION-RULING-NAMES-A-CARRIER-THAT-IS-NOT-A-BYTE-IDENTITY-GATE` by name. **Which of the
five S9 names is TO DECIDE AT INTEGRATION from the declared `coverage.moves` and the six `s9-*`
mirrors, and this brief does not guess it.** Same RULED terminal rule as 10.1; the two functions
share the single `ruledTerminal()` test on purpose, because a chain whose two ruling functions
disagree about what a ruled line is has a hole wherever the weaker one stands.

**10.3 THEME.** Feeds `authorizations.theme`, whose closed key set is
`['ledgerLine','role','line','lineSha256']` with `role` exactly `cowork`, `line` a single line with
no CR or LF, and `sha(line) === lineSha256` (`b-package.cjs:1161`, `:1292-:1296`). It is resolved at
`CHAIN_REF`, not at the parent's receipt base, because it accepts work the parent never saw
(`:2588-:2600`).

**There is no THEME token regex.** The requirement is on the LINE, at `b-package.cjs:1981-1982`:

```
line.includes('M2-S9-UI-PINS') && line.endsWith(' · ACCEPTED')
```

that is, the line must name the package id and **END with SPACE, SEP, SPACE, `ACCEPTED`** - not
`RULED`. Refusal name if it does not:
`THEME-LINE-DOES-NOT-BIND-THIS-PACKAGE-ID M2-S9-UI-PINS`.

**10.4 BRIEF-BY-SHA.** Feeds `brief`, whose closed key set is `['file','sha256','acceptedLedgerLine']`
(`b-package.cjs:1801`), with `acceptedLedgerLine` a claim of the same four keys. `file` is
`rebuild/lanes/b/S9-UI-PINS-BRIEF.md` and `sha256` is the sha256 of the ACCEPTED bytes of this file,
**TO MEASURE on the day it is accepted and not before, because this file is still being written.**

**There is no BRIEF-BY-SHA token regex either.** The requirement, at `b-package.cjs:1805-1806`:

```
line.includes('M2-S9-UI-PINS') && line.includes('rebuild/lanes/b/S9-UI-PINS-BRIEF.md')
  && /(?:^|[ ·])ACCEPTED$/.test(line)
```

that is, the line names the package id AND the brief path AND ends in `ACCEPTED` preceded by a space
or by SEP. A non-null citation additionally forces `status === 'BRIEF-ACCEPTED'`
(`BRIEF-ACCEPTANCE-STATUS`), and `status: 'BRIEF-ACCEPTED'` with a null citation refuses
`BRIEF-ACCEPTED-WITHOUT-A-CITED-LEDGER-LINE` (`:1811-:1812`).

**10.5 The two terminals do not conflict, and the PM has ruled it.** `DECISIONS:567`'s P-A7 says
every M2-S9-UI-PINS token line ends in a separator then the bare word `RULED`; the runner requires
the THEME and brief-acceptance lines to end in `ACCEPTED`. **RULED: P-A7 speaks of the GRANT KINDS
only.** The two grants, `RELEASE-FROM-SEAL` and `GATE-SUPERSESSION`, stand on lines whose final
clause is exactly `RULED`. The THEME citation line and the BRIEF-BY-SHA citation line end
`ACCEPTED`, exactly as the runner enforces them at `:1981` and `:1806`. **This is settled and no
grammar is invented here.** A practical consequence the PM writes around: one ledger line cannot
carry a grant and a theme acceptance at once, because its last clause cannot be both words.

**10.6 What the four lines feed, in one table, so the author cites and never composes.**

| line kind | spec field it feeds | what the runner does with it |
| --- | --- | --- |
| RELEASE-FROM-SEAL | `release.rulingLineSha256` | unique-line lookup at `CHAIN_REF`, RULED terminal, token clause, package id, granted set equals declared `released` set both ways, parent-pin membership, execution-pin exclusion |
| GATE-SUPERSESSION | `coverage.superseded.rulingLineSha256` | the same lookup and terminal, token clause, package id, every carrier in the closed five |
| THEME | `authorizations.theme` (`ledgerLine`, `role`, `line`, `lineSha256`) | claim shape and self-hash, resolved at `CHAIN_REF`, line names the package id and ends SPACE SEP SPACE `ACCEPTED` |
| BRIEF-BY-SHA | `brief.acceptedLedgerLine` plus `brief.file` and `brief.sha256` | claim shape and self-hash, resolved at `CHAIN_REF`, line names the package id and the brief path and ends in `ACCEPTED`; forces `status: BRIEF-ACCEPTED` |

**All four sha256 values are TO MEASURE ON THE DAY**, over the exact bytes of the real lines the PM
writes, with no trailing newline. The seal generator on `rebuild/b-seal-gen` can draft them, but
**that generator is NOT accepted for use in this round and no part of this brief was produced by
it.**

## 11. WHAT S9 WAITS FOR

**S9 pins the WHOLE approved pack and SEALS the passphrase normalizer, so S9 cannot take its
literals or its hashes until the lanes that move those bytes have stopped moving them.** The
mechanism work does not wait: an independent reviewer can judge H1 to H13, H17, H18, the token
grammar, the closed list and the fence against the runner as it stands, and none of those judgements
changes when the bytes arrive. What waits is measurement.

**11.1 C-UI-0, accepted after its SECOND TEETH AUDIT.** The audit is `DECISIONS:593` and `:594`:
three halves running at once (a Claude hand executing the kit of 57 rows at design head `64a9e095`
and publishing every raw output, Astra judging and doing the static half, the PM's Fable final
beside them, not after). **Three batches of fixes are with the design lane and none is closed:**
batch 1 at `DECISIONS:594` (P-CUI-1 findings 1, 3 both siblings, 5 and 6 must be fixed before
acceptance, each with a teeth row that bites, and q5's catcher made specific; P-CUI-2 narrows the
standard's words for findings 4 and 7 to what the code measures, with C-UI-GATES-2 as the named
later ticket; P-CUI-3 writes finding 9 and the accept path's exit status and non-transactional
writes into the standard as known limits); batch 2 at `DECISIONS:597` (P-CUI-1 (1) WIDENED, because
the null-`offsetParent` shortcut stands in BOTH 44 px walks, `gate.py:153` and `statesheet.py:84`,
so a visible viewport-fixed control is dropped BEFORE the repaired helper, and one box-and-
renderability test replaces the shortcut in all three walks with one paired row holding it; P-CUI-3
grows by README:321 and STANDARD:112's 42-against-46 row count, q9 to q11, the U+2060 sentence and
STANDARD:130's exclusions); and the execution half's mismatches, still outstanding; **and batch 3 at
`DECISIONS:604`, the read half of the PM's own Fable final, which adds EIGHT items nobody had found
(PM-1 to PM-8) and widens P-CUI-1 (1) again: the null-`offsetParent` shortcut stands at NINETEEN
sites, not the three of `:597`, and the lane's PR-READY line is WITHDRAWN.** `DECISIONS:604` also
rules P-CUI-4 on the minus rule's new opener clause, which Astra's static check of the same delta
found NOT SOUND. **Until C-UI-0 is accepted the pack does not stop moving, and the day-of procedure
of section 9 item 9 cannot start.** Nothing in this brief may be read as C-UI-0 being close: three
batches are open and the lane's own PR-READY claim has been withdrawn once already.

**11.2 C-UI-1.** Its bytes decide the final inventory: the moved product files, `design.APPROVED`'s
resulting list, APPROVED-PIN's literal, E fact 17's re-decided path list, the zero-to-three
`design.test.cjs` hunks with STOP-10 standing over them, `rebuild/lanes/c/ui-port/` becoming the
twenty-fifth `CHILD_ROOTS` entry and the only new `PUBLIC_TAIL_ROOTS` entry, every needle, and the
`--ci --package S9` walk itself, which hashes those bytes. **`DECISIONS:531` blocks its seal until
the gates are fixed and re-audited, so C-UI-1 waits on 11.1 and S9 waits on C-UI-1.** OQ-2's
approved-reference decision feeds the final `design.APPROVED` measurement.

**11.3 The passphrase cell round, AND a comment-only correction of a file S9 SEALS.** S9 declares
`rebuild/m3/setup/port/passphrase.cjs` role `new` and SEALED, so its sha256 is a sealed byte of this
package. `DECISIONS:601` records Astra's blind review back and judged (ACCEPT WITH NOTES, no product
defect; 96 of 96 generated phrases open on both decoders, 2,048 list words with no collision, all
4,194,304 word pairs splitting back, the sealing code and `deriveKey` byte-identical), with four
notes all upheld and ruled P-PN-1 to P-PN-4, all of them in the CELLS or the PAPER. `DECISIONS:605`
WIDENS P-PN-3: the overstated words about Unicode whitespace stand not only in the paper but in two
COMMENTS of `rebuild/m3/setup/port/passphrase.cjs` itself (`:22` and `:46`) and in its README
(`:200`), and **because the file is about to be sealed the comment is corrected NOW**, comment text
only, proved by stripping comments from old and new and comparing the rest byte for byte (Astra job
41). **A comment-only change is still a byte change: the file's sha256 MOVES ONCE more, and S9's
declaration must be taken after it, not before.** The same line records that the relaunched cell job
STOPPED and rightly, because the cells' helper `sealInventedBundle` starts the port CLI as a child
process whose gate would read the private fixture when present; the PM ruled the helper's child
processes allowed for these cells, the private fixture absent from that worktree by construction,
the real helper used, and any number taken with a substitute LABELLED so. The PM also re-measures `page-bundle.test.mjs`'s 142-to-143 and 20-to-21 module counts
outside the reviewer's sandbox, which is why section 2.2 marks them doubly TO MEASURE. `ba04c07f` is
already merged into this lane; what is NOT yet in is the cell round and that comment.

**11.4 What does NOT wait, said plainly so nobody stalls on it.** The runner mechanism (section 5.1
facts 1 to 7, 12 and 13); the fence and its step; the two pack cells' CODE, walk, ignore list,
refusal names and red-first rows against a throwaway fixture pack; H18's 26-entry literal; the six
`pinned-unchanged` pins that are measurable today; the carried lanes' declarations; and this brief.
None of them needs a byte from lane C.

**11.5 The order the owner set, and S9 does not re-order it.** `DECISIONS:575`, reaffirmed at
`:578`: the look, then C-UI-0's audit, then C-UI-1, then S9, then the trial. `DECISIONS:590`'s
question about where phone-earn sits was put to the owner and is **explicitly NOT RULED**; no
proposed order is presented here as accepted. `DECISIONS:582` puts the EW2 build cut after S10.
TODAY-SPLIT and the wording lock are S10's, and they are later WORK, not unfinished implementation
for S9 to declare.

## 12. WHERE THIS BRIEF DISAGREES WITH ITS INPUTS, AND WHAT IS STILL OPEN

**The input pack `rebuild/lanes/b/S9-BRIEF-INPUTS.md` at `dca3f959` is a map and was written
unreviewed; this author opened its sources. Four corrections and one gap:**

1. **The pack's runner snapshot is one round stale.** It reads the runner at
   `2a8526b58da4a8bd8a57248d4aa524cb3afba21a` and says "A still reports round 5", carrying the
   round-5 runner post `316f86c541f109a5876f5ea8d0557164151585f4f5940ce8878c3bec02bee43e`. The
   accepted head is `397ac466` and the runner is
   `71c1b2592b5a3544b71c0995a9f52b88fbe24cd6b821709309aa95e5ad3012c0`, measured by this author and
   equal to the PM's at `DECISIONS:598`. Every grammar quoted in section 10 was re-read from that
   head, not from the pack.
2. **The pack's `guard-coverage.test.mjs` hash is a superseded round's.** It carries
   `b84b0b4056fbb1f82b11dd63d4a335674e57176ced31b2defd6748ed0c1002da`; measured at the accepted F2
   head `b9777fe4` the file is
   `78d1d73c02b115981006ab38dd0a16bfcd9fddbee8afa40c872964155281b9e7`. The pack says the file moved;
   it does not give the value it moved to.

3. **The pack's C row is out of date in both directions.** It reports C's accepted bar as "pack
   41/40/1 and approved 26/25/1" from `C-R4`. `DECISIONS:599` WITHDREW `:566`'s acceptance, and
   Astra's round 5 build at `d857d775` measures **58/57/1 and 42/41/1** on both systems. Section 3.1
   carries the round-5 numbers with their head, and adds what the pack could not know: narrow check
   R5 at `0a74d8f2` is a **REJECT**.
4. **The pack treats "the S8 model's counts" as a starting point in places** (its section 2 row for
   S8:199-204). S8's 224 / 24 / 17 / 182 / 1 are S8's. This brief asserts no S9 count and says so in
   section 2.
5. **The pack's cutoff is `DECISIONS:591`. This brief was read to `DECISIONS:609` at chain tip
   `05466ebb`, and its author re-read the ledger's tail before finishing.** What the pack could not
   carry, and this brief does: `:594`, `:597` and `:604`, the second teeth audit's THREE batches
   (section 11.1); `:598`, the runner's round 6 acceptance-pending state, D-A-FINAL's NOT CLOSED
   list and Astra job 39 (sections 3.1 and 8); `:599` and `:608`, C's withdrawn acceptance, the R5
   REJECT upheld, P-PACK-4, P-PACK-5 and D-C-FINAL with its two routed debts (sections 3.1, 8 and
   12.3); `:601` and `:605`, the passphrase cell round, the widened P-PN-3 and the comment-only
   correction of a file S9 seals (section 11.3); `:606` with `:609`, an engine finding held for the
   owner that is NOT S9's to fix (section 4).

**The PM has RULED the input pack's eleven contradictions and this brief states them as settled, in
the pack's own order:** (1) the two GRANT kinds end in a final clause that is exactly `RULED`, the
THEME and BRIEF-BY-SHA citation lines end `ACCEPTED` exactly as the runner enforces, and P-A7 speaks
of the grant kinds only (section 10.5); (2) P-A9 (a) governs, parent-only ancestry, and the spec's
union sentence is superseded; (3) the runner's rule governs, every executed file is declared, so the
two Today lane cells in child argv ARE declarations and E20's sentence is superseded (section 2.4);
(4) the accepted fence of `DECISIONS:591` governs over the original D.2 wording, so a byte-equal
touch passes the tamper check under the case-exact HEAD rule; (5) the runner's CLOSED OPTIONAL KEYS
govern (`DECISIONS:560`), so there is no live `rulingLine` field in the artifact and `release` and
`released` are optional and separately closed; (6) `DECISIONS:559` governs, there is NO after-merge
exception in D.2's condition (3) limb, because once a child has merged its spec is no longer at
status `A` in the merge-base diff and fewer ways to stand aside is the safer fence; (7) R4's TABLE
governs, **215 entries asserted and three `PREVIEW_COPY` entries not asserted** (section 8); (8)
R4's counts govern and ALL pack counts are re-measured at the pack's final head; (9)
`DECISIONS:582` governs, F2-LAND is **E fact 23 of S9** and its own report's naming of S10 is
superseded; (10) every post-image is MEASURED AT INTEGRATION and none is copied from a lane report,
which is why no F2 or fence post-image in section 2 is presented as final; (11) the B report is as
corrected at `6f808cfa` (section 9 item 5).

**12.1 OPEN, and this brief does not close it: E fact 17 against the runner's
`PRODUCT-PINNED-UNCHANGED-IS-NOT-EXECUTED-BY-A-DECLARED-CHILD`.** Measured in section 2.4.1: four
of the six `pinned-unchanged` declarations refuse by name at the runner as it stands at `397ac466`,
because no file in `rebuild/` reaches those four documents through a relative literal specifier of
the four shapes `executedClosure()` reads. Three dispositions are named with their cost and none is
recommended. **The PM rules this, and until then the sentence in E fact 17 and the assert at
`b-package.cjs:1896` cannot both be right as written.**

**12.2 OPEN: whether the E21 and E22 CI steps carry `if: ${{ !cancelled() }}`.**
`DECISIONS:570` says the PM must decide whether those steps also run after a standing-step failure
and no ruling is in the ledger through its current tail. Section 9 item 7.

**12.3 NOT OPEN, but NOT FINISHED: C's state.** `:566`'s acceptance is withdrawn (`:599`), round 5
is published at `d857d775`, narrow check R5 at `0a74d8f2` returned REJECT, and `DECISIONS:608`
UPHELD both findings, ruled P-PACK-4 and P-PACK-5 and declared D-C-FINAL. **The round 6 build and
its narrow check are running as this brief is written, so C's bar and both cells' sha256s are not
final and nothing downstream may take a pack number from section 3.1.** The one place to amend is
C's row there, and the one place to record what survives is D-C-FINAL in section 8.

**12.4 OPEN: which carriers the GATE-SUPERSESSION line names.** The vocabulary is the closed five
(section 10.2); which of them S9 supersedes follows from the declared `coverage.moves` and the six
`s9-*` mirrors, which are not measurable until integration. **This brief does not guess.**

**12.5 A smaller one, recorded rather than resolved: "the N5 paper numbers".** This author read that
instruction as the four stale statements review R6 found in B's author report, which the integrator
corrected at `6f808cfa` in a new section 17, and section 9 item 5 lists them with their values. B's
review R6 also has a note numbered N5 of its own ("a byte-equal touch passes THIS CHECK", three
words) and C's check R5 has a different N5 (`s9NoDescents` asserting inside its `finally`). If the
PM meant one of those, the work is the same work at a different name and section 9 item 5 is where
it belongs.

---

**This brief is a hypothesis for the PM and for one independent review, not evidence.** It seals
nothing, runs no package with `--full`, writes no `packages/S9.json`, fills no literal and issues no
PM token line. Its own sha256 and byte count are TO MEASURE on the day it is accepted. Its author
read in the PM's cloud reading room at chain tip `789baf6e` and again at `05466ebb` for the ledger's
tail, and wrote, committed and pushed on the owner's PC; every measurement attributed to this author
above was taken with `git`, `sha256sum` or `node` against a synced worktree, never against the
owner's data. The farm's privacy proof printed PASS at every sync of this assignment.
