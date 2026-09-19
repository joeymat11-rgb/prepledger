# F2-LAND AUTHOR REPORT: the exercise-tag projector reaches a branch S10 can carry

Lane D. Branch `rebuild/d-f2-land`, cut from `b9d8d645`.
First author: cowork (Earned lane hand), commits 1/4 to 4/4.
FIX ROUND author: cowork (Earned lane hand), commits FIX 1/3 to FIX 3/3, answering
`rebuild/lanes/d/F2-LAND-REVIEW-R1.md` finding by finding in section 9.
MICRO FIX ROUND 3 author: cowork (Earned lane hand), answering
`rebuild/lanes/d/F2-LAND-REVIEW-R2.md` and the PM's own two findings in section 11.
This report is a HYPOTHESIS. The next reviewer is told to disagree wherever the evidence lets him.

Scope ruled by the PM (`DECISIONS:557`): THE TAG HALF ONLY. NO ENGINE BYTE MOVES.

## 0. HEADLINE

Three commits land the module, one cell and one CI step. Three more answer review R1: a
thirteen-cell red-first coverage file, its place in the same CI step, and this report. Two more
answer review R2 and the PM's two findings: twenty-one more rows in that same coverage file,
and this report corrected in every place R2 names.

**No byte of `rebuild/m4/workout/setup-tags.cjs` has moved at any point.** Its sha256 is
`d0436809e9e5...` on the old branch, in the lane copy on the tip, in the landing commit and at
this head, measured again before and after every one of round 3's 140 mutants. R1 raised no
defect in the module, the fix round found none, and R2 and the PM found none either: what all
three found was guards that nothing drove, and the answer to that is a cell, not an edit.
`projector.test.mjs` also keeps its blob identity with the spike through round 3.

**The fourth commit of the original ticket, retiring the lane copy, is still NOT made: it
disturbs far more than the three files the ticket names, so the ticket's own STOP applies and
section 6 hands the PM the measurement and the routing table.** R1 N3 made that table longer by
three accepted acceptance specs, which are now in it.

THE HEADLINE THE FIX ROUND WROTE HERE WAS FALSE AND IS WITHDRAWN. It said "100 mutants, 87
killed, 13 survivors ... Zero undriven guard terms remain". R2 measured four more undriven
terms, three of which flip the module from refusing to ACCEPTING, and two more that degrade a
named refusal into a raw `TypeError`. R2 is right. Round 3 re-measured the module with R2's
term-level method at a finer granularity and found TWELVE more of the same two classes on top of
R2's six. All eighteen now have a row.

**AS MEASURED at this head, and claiming nothing beyond the measurement: 140 term-level mutants
of `setup-tags.cjs`, 115 KILLED by a behaviour row, 25 survivors. All 25 survivors are
REDUNDANT against a 161-case differential corpus: with the term deleted, not one of the 161
cases changes how the module answers. ZERO of the 25 flips a refusal into an acceptance and ZERO
degrades a named refusal into a raw throw.** That is a statement about 140 mutants and 161
inputs that this round wrote, and it is NOT a claim that no undriven term exists. Section 7.4
names the one hole no mutant can see: the MISSING guard at `:124` that PM finding P-F2-1 found
by reading, which `F2-G20` now pins as a recorded laxity.

## 1. WHAT LANDED

| path | role | sha256 | lines |
|---|---|---|---|
| `rebuild/m4/workout/setup-tags.cjs` | NEW runtime (product, role `new`) | `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` | 198 |
| `rebuild/lanes/d/f2/projector.test.mjs` | NEW cell (test), brought across | `f74bbe5f40624237a4d24536b3ead036a75ed3bc705a52d6e55032d28bdf8dd6` | 382 |
| `rebuild/lanes/d/f2/guard-coverage.test.mjs` | NEW cell (test), authored by the fix rounds | `b84b0b4056fbb1f82b11dd63d4a335674e57176ced31b2defd6748ed0c1002da` | 573 |
| `.github/workflows/rebuild.yml` | EDITED, one step, +19/-0 | `878baa7617f63e236d68213f672d716b67d976dcf1e4a6ce50948b7d06133499` | +19 |

The four sha256s above were measured on the PC and again on linux, in a farm scratch worktree cut
from the PUSHED head `b954d17e`. They are equal on both machines, byte for byte.
Only the `guard-coverage.test.mjs` row moved in round 3 (it was `288e4627...`, 244 lines, at
`797b05ce`); the module, the brought-across cell and the workflow are untouched by it.

BYTE-IDENTICAL, proved three ways rather than claimed. `git show f3e9561b:` was the transport,
so the bytes were never retyped:

- sha256 of the landed module `d0436809e9e5...`, 11093 bytes, equal to the sha256 of
  `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` on the tip, byte for byte.
- `git hash-object` of the landed file is `68fdc6b6710b9bcbb1c464a3f732540fa4d6de6d`, which is
  also `git rev-parse f3e9561b:rebuild/m4/workout/setup-tags.cjs` AND
  `git rev-parse b9d8d645:rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs`. One blob, three names.
- The landed cell `projector.test.mjs` is the same blob as
  `f3e9561b:rebuild/lanes/d/f2/projector.test.mjs`, `cd4f4b29e1d15c09816c7ec0ebec379c159afce2`,
  and the fix round did not touch it either: the new cells went into a NEW file so that the
  brought-across cell keeps its blob identity with the spike.

The module imports nothing, so the landing adds one product entry and no closure. The old
branch was NOT rebased and NOT merged; it forks 500-plus commits behind and its other content
is untouched.

## 2. THE CELLS: WHAT LANDED, WHAT STAYED, AND THE MEASUREMENT THAT DECIDED

Measured, not argued. A farm scratch worktree was cut at the chain tip `b9d8d645`,
`setup-tags.cjs` was copied in, all six files of `rebuild/lanes/d/f2/` were copied in, and
NOTHING else was changed. Each cell file was then run on its own.

| cell file | on the tip + the module alone | verdict |
|---|---|---|
| `projector.test.mjs` | **30 tests, 30 pass, 0 fail** | LANDED |
| `composition.test.mjs` | 4 tests, 0 pass, 4 fail | left behind |
| `heads.test.mjs` | 25 tests, 0 pass, 25 fail | left behind |
| `engine.test.cjs` | 20 tests, 3 pass, 17 fail | left behind |
| `product-fixture.cjs` | not a cell, a fixture | not landed; only the three above read it |
| `mutants.cjs` | not a cell, a mutant list | not landed; only the three above read it |

The four cell files together are the spike's 79, re-measured on the old branch in the farm at
`f3e9561b`: **79 tests, 79 pass, 0 fail.** So the three left behind account for 49 of the 79.

WHY EACH ONE STAYED, by the failure the run actually printed, and it is TWO unlanded halves,
not one:

1. **F1 full body, in `rebuild/m4/workout/athlete-state.cjs`.** All three build fixtures whose
   split trains on `F` days. The tip's `athlete-state.cjs` takes `U`, `L` and `REST` only
   (`DAY_KINDS`), the old branch's takes `U`, `L`, `F` and `REST` (`SESSION_KINDS`), so
   `createCleanInitState` refuses `CLEAN_INIT_SPLIT_REQUIRED`: 4 of 4 in `composition`,
   9 of 25 in `heads`, 1 of 17 in `engine`.
2. **The F2 volume half, in `rebuild/engine/volume.cjs`, `writers.cjs` and the same
   `athlete-state.cjs`.** The rest are assertions of the form
   `missing credited bucket: delts_front` (12), `lower_back` (2), `delts_side` (1),
   `delts_rear` (1) and `missing volume row: biceps`: the tip's engine does not yet allocate
   resolved regional helper credit, which is exactly what the volume half adds.

Both are engine or m4 bytes. An engine byte needs the owner's word and a gate supersession, so
none of it moves here. `engine.test.cjs`'s three passing rows (`F2-C02`, `F2-C03`, `F2-C04`)
are the tagless-parent differential against `loadProduct(BASE)` at `2afd2c1`: they prove the
ENGINE unchanged, which is volume-half evidence, so they travel with the volume half rather
than being carved out of their file. R1 re-measured all three files itself and got the same
table.

**NOTHING WAS LOST BY LEAVING THEM.** Section 7 measures it: every mutant of `setup-tags.cjs`
that `projector.test.mjs` failed to kill ALSO survived the full four-file suite on the old
branch. R1 re-ran that comparison over the author's 21 survivors and its own 16 mutants and
confirmed it. The three left-behind cells kill ZERO mutants of this module that the landed cells
do not already kill.

### 2.1 THE FIX ROUND'S CELL, AND WHY IT IS AUTHORED RATHER THAN BROUGHT ACROSS

`rebuild/lanes/d/f2/guard-coverage.test.mjs` is not on the old branch and could not be: R1 B2's
finding is that the ORIGINAL suite, all 79 cells of it, never drives these guard terms. Bringing
a file across cannot fix a gap that file has. The new cell therefore states each rule in its own
words, drives it through the module's public API only, and is red on the single-term mutant named
in its comment. It changes no byte of the module and no byte of the brought-across cell.

## 3. THE CI STEP

ONE step, inserted directly after the `D - plan edit` step's `run:` line, and nowhere else. The
regions after `:232`, `:297` and `:306` are other lanes' and were not touched. The fix round did
not add a second step: it added its file to the same `run:` line.

```
      - name: D - the exercise-tag projector, its taxonomy and its new-exercise binding
        run: node --test rebuild/lanes/d/f2/projector.test.mjs rebuild/lanes/d/f2/guard-coverage.test.mjs
```

Two files, each named by exact path, never globbed. The comment above the step records the three
F2 cell files that are deliberately absent and why, so a file with no CI home is still a file
somebody decided about (`DECISIONS:186 (3)`).

TWO NUMBERS IN THAT COMMENT ARE NOW STALE AND ROUND 3 WAS FORBIDDEN TO FIX THEM. The comment
says "Measured on this head: 43 tests" and "thirteen cells". At this head the step's exact
command prints **64 tests** and `guard-coverage.test.mjs` carries **thirty-four** rows. The
ticket for round 3 says in terms: do NOT touch `rebuild.yml`, whose step already names the file
by exact path. So the prose is stale on purpose and is recorded here rather than corrected
silently. The `run:` line itself, which is the only executable part, is correct and unchanged.
Whoever next holds this region should refresh those two words.

## 4. THE BAR, ON BOTH OPERATING SYSTEMS

PC (win32, `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, node from the codex runtime),
and linux (a farm scratch worktree cut from the PUSHED head, whose four file sha256s were
re-checked against the PC's and are identical, section 1). The last column is round 3, measured
at the pushed head `b954d17e` on both machines.

Counts are read from `--test-reporter=tap`, because this PC's node defaults to the spec reporter
when its output is redirected; the CI runner's `# pass` needles are TAP counts, so TAP is what a
needle claim has to be measured with. Exit codes are node's own, not a pipeline's.

| what | before, at `b9d8d645` | at `38b51635` (landing) | at `797b05ce` (fix) | at `b954d17e` (round 3) |
|---|---|---|---|---|
| `guard-coverage.test.mjs`, win32 | did not exist | did not exist | 13 / 13 / 0 | **34 / 34 / 0, exit 0** |
| `guard-coverage.test.mjs`, linux | did not exist | did not exist | 13 / 13 / 0 | **34 / 34 / 0, exit 0** |
| the CI step command, both files, win32 | did not exist | 30 / 30 / 0 | 43 / 43 / 0 | **64 / 64 / 0, exit 0** |
| the CI step command, both files, linux | did not exist | 30 / 30 / 0 | 43 / 43 / 0 | **64 / 64 / 0, exit 0** |
| `projector.test.mjs` alone, win32 | did not exist | 30 / 30 / 0 | 30 / 30 / 0 | **30 / 30 / 0, exit 0** |
| `projector.test.mjs` alone, linux | did not exist | 30 / 30 / 0 | 30 / 30 / 0 | **30 / 30 / 0, exit 0** |
| the whole `D - plan edit` step (`rebuild.yml:269`), win32 | 130 / 130 / 0 | 130 / 130 / 0 | 130 / 130 / 0 | **130 / 130 / 0, exit 0** |
| `rebuild/lanes/d/plan-edit` alone, win32 | 90 / 90 / 0 | 90 / 90 / 0 | 90 / 90 / 0 | **90 / 90 / 0, exit 0** |
| `rebuild/lanes/d/plan-edit` alone, linux | not run | 90 / 90 / 0 | 90 / 90 / 0 | **90 / 90 / 0, exit 0** |

The plan-edit needle S8's `d-plan-edit` child pins, `# pass 90`, is unchanged on both machines
and at all four heads. It could hardly be otherwise: this branch adds files, edits only its own
CI step, and section 6 is a STOP.

ONE MEASUREMENT NOTE FROM ROUND 3, so the next reader does not repeat the detour. R1 and R2 both
record "`rebuild/lanes/d/plan-edit` alone" as a directory argument. On this PC's node
(`v24.19.0`) `node --test rebuild/lanes/d/plan-edit` does not walk the directory: it tries to
LOAD it as a module and prints `Cannot find module ... plan-edit`, 1 test, 0 pass, 1 fail. That
is a node invocation difference and not a regression: the same four cells named one path at a
time (`model.test.cjs`, `durable-host.test.mjs`, `browser-build.test.mjs`, `client-p6.test.cjs`)
are 90 / 90 / 0, exit 0, which is the form the row above was measured in and the form the needle
counts. The directory run was not "fixed" by loosening anything; it was re-run in the form the
CI step itself uses.

ONE LINUX DIFFERENCE, REPORTED RATHER THAN HIDDEN. The whole `D - plan edit` step is 130/130 on
the PC and 100 tests / 96 pass / 4 fail in the farm. The four are
`import-retract/retract.test.mjs`, `p3-capture-start/capture-start.test.mjs`,
`p3-followons/admission-swap.test.mjs` and `p3-replay-measure/measure-order.test.mjs`, and the
error is `port.cjs did not seal the invented bundle (status 2)`. FARM.md says it outright: a
suite that seals a bundle through the real port cannot run in the farm, its oracle files being
outside the include list. This is an environment absence, not a regression, and it is identical
before and after. The bar of record is the PC, where the step is 130/130.

CUSTODY, proved with `git diff --numstat b9d8d645 HEAD` on the PC at `b954d17e`, the head this
report's own commit then extends by exactly one path (this file):

```
19	0	.github/workflows/rebuild.yml
690	0	rebuild/lanes/d/F2-LAND-AUTHOR-REPORT.md
262	0	rebuild/lanes/d/F2-LAND-REVIEW-R1.md
280	0	rebuild/lanes/d/F2-LAND-REVIEW-R2.md
573	0	rebuild/lanes/d/f2/guard-coverage.test.mjs
382	0	rebuild/lanes/d/f2/projector.test.mjs
198	0	rebuild/m4/workout/setup-tags.cjs
```

SEVEN paths at that head, all additions, ZERO deletions anywhere. Three of the seven are review
and report prose. R1 N6 is right that the first report's box named three files when the head had
four: the box above is measured at the head it names, and the report commit that follows it
changes the `F2-LAND-AUTHOR-REPORT.md` row and nothing else. Round 3's own diff is exactly TWO
paths: `rebuild/lanes/d/f2/guard-coverage.test.mjs` (`+329 / -0`) and this file.
`git diff --name-only b9d8d645 HEAD -- rebuild/engine rebuild/m3 rebuild/coach rebuild/client`
prints NOTHING. Not one byte under `rebuild/engine` moved.

## 5. WHAT `b-package.cjs --ci --package S8` PRINTS, BEFORE AND AFTER

Run on the PC, `node rebuild/lanes/b/tooling/b-package.cjs --ci --package S8`, the exact command
at `rebuild.yml:150`. Never `--full`; nothing sealed, no receipt, no artifact written.

| where | exit | last line |
|---|---|---|
| BEFORE, a detached worktree at `b9d8d645` (removed again) | **1** | `B PACKAGE S8 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP; required evidence missing or failed; local diagnostics withheld` |
| AFTER the landing, at `38b51635` | **1** | the same line, byte for byte |
| AFTER the fix round, at `797b05ce` | **1** | the same line, byte for byte |
| AFTER round 3, at `b954d17e` | **1** | the same line, byte for byte |

**THE NAMED REFUSAL IS NOT THE ONE THE TICKET EXPECTED, AND THE FIRST REPORT GOT THE REASON
WRONG TOO. R1 N2 IS ACCEPTED IN FULL.** Both the ticket and the first report expected an
undeclared-runtime-file drift on `setup-tags.cjs`, citing `DECISIONS:474`. Re-read at the
source, `:474` records the OPPOSITE: "b-package --ci --package S5 EXIT 0 (0 unlisted drift)
because the runtime files are new and undeclared".

Re-measured by this round, from the runner rather than from prose:

- `b-package.cjs:2005` (`fidelity`) diffs only `rebuild/engine`, `rebuild/conform`,
  `rebuild/m4/spec` and the tooling directory. `rebuild/m4/workout/setup-tags.cjs` is in none of
  them, and it is not one of S8's 224 declared product files (read out of
  `packages/S8.json`: `Object.hasOwn(s.product, 'rebuild/m4/workout/setup-tags.cjs')` is
  `false`). `UNLISTED-SOURCE-CHANGE` can never fire for this path, and neither can
  `UNLISTED-PRODUCT-DRIFT`.
- What WILL fire once a head contains the chain tip is about the WORKFLOW. S8 declares
  `.github/workflows/rebuild.yml` role `edited`, pre `afce33cf1925...`, post `8403d10b1a54...`
  (read out of the package). This branch's file is `878baa7617f6...`, which is neither, so the
  pin loop at `:1969` buckets it as drift and `:1972` asserts
  `UNLISTED-PRODUCT-DRIFT .github/workflows/rebuild.yml`.

Like R1, this round could not EXECUTE that assertion and does not claim to have: on the PC the
seal-base refusal fires first on every head available to the lane. It is read from the runner's
source and from `packages/S8.json`, and it is stated here because it changes what S10 owes. The
duty S10 has for this branch is to DECLARE the workflow's new image; there is nothing for it to
declare about `setup-tags.cjs` drift, because that check cannot see the path.

Why the seal-base refusal fires at all is `DECISIONS:554`'s CI fact, now true of this lane. The
chain tip moved while this ticket was being worked: `rebuild/t2-client-core` is `904d475b`, not
the `b9d8d645` the worktree was cut from. `b-package` binds the seal base to the chain tip, so
it refuses first, and on GitHub every later step of `rebuild-public` is SKIPPED. **The CI step
of section 3 will therefore show no green in Actions on this branch: its both-OS evidence is the
two runs in section 4 until an integrator merges the tip forward.** Nothing here can fix that
from inside the lane, and rebasing is forbidden.

## 6. THE RETIREMENT OF THE LANE COPY: STOPPED, AND WHY

The ticket says: if retiring the copy disturbs more than `f2-tag-adapter.cjs`, the PE16
`f2-adapter-identity` cell, and `tagSource()` / `PE_F2_PUBLIC_REF` in `durable-host.test.mjs`,
then STOP after (3), report, and leave it for the PM to route. **It disturbs a great deal more,
so the retirement is not in this branch and no sealed byte moved.** R1 agreed and called the
STOP "understated"; R1 N3 then added three more accepted artifacts to the blast radius.

The blast radius was MEASURED, not read off a grep: in a farm scratch of the tip with the module
landed, `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` was deleted and nothing else changed.

| cell file | its CI step | with the copy deleted |
|---|---|---|
| `lanes/d/plan-edit/model.test.cjs` | `D - plan edit` (`:269`) | **0 pass / 55 fail** |
| `lanes/d/plan-edit/durable-host.test.mjs` | `D - plan edit` (`:269`) | **0 pass / 1 fail** (module-level throw) |
| `lanes/d/p3-port-fix/owner-route.test.mjs` | `D - the port admission ...` (about `:297`) | **0 pass / 1 fail** |
| `lanes/d/p3-real-shape/real-shape-capture.test.mjs` | `D - the real-shape ...` (about `:306`) | **0 pass / 3 fail** |
| `lanes/d/p3-real-shape/bar-admit.test.mjs` | same | **0 pass / 14 fail** |
| `lanes/d/p3-real-shape/bar-keep.test.mjs` | same | **0 pass / 12 fail** |
| `lanes/d/p3-real-shape/r1-fixes.test.mjs` | same | **0 pass / 11 fail** |
| `lanes/d/p3-real-shape/real-shape-walk.test.mjs` | same | **2 pass / 10 fail** |
| `lanes/d/p3-real-shape/q1-producer.test.mjs` | same | 4 pass / 0 fail, unaffected |

The two steps at about `:297` and `:306` are precisely the regions the ticket says other lanes
hold. The scratch worktree was restored afterwards and the copy is byte-identical again.

The importers are five, not one: `plan-edit/model.test.cjs:20` (the `PLAN_EDIT_F2_MODULE`
default), `plan-edit/durable-host.test.mjs:28`, `p3-real-shape/real-shape-support.mjs:300`
(which five real-shape cells import), `p3-real-shape/real-shape-capture.test.mjs:155` and
`p3-port-fix/owner-route.test.mjs:68`. A sixth site, `plan-edit/astra-rerun.mjs:29`, carries the
path as a codemod string in the Astra rerun script.

### 6.1 THE TABLE THE S10 BRIEF CAN LIFT

What THIS branch asks S10 to declare (pre and post from Git; `absent` means the path does not
exist at `b9d8d645`):

| path | pre sha256 | post sha256 | role | declared in |
|---|---|---|---|---|
| `rebuild/m4/workout/setup-tags.cjs` | absent | `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` | **product, `new`** | nowhere yet |
| `rebuild/lanes/d/f2/projector.test.mjs` | absent | `f74bbe5f40624237a4d24536b3ead036a75ed3bc705a52d6e55032d28bdf8dd6` | **test, `new`** | nowhere yet |
| `rebuild/lanes/d/f2/guard-coverage.test.mjs` | absent | `b84b0b4056fbb1f82b11dd63d4a335674e57176ced31b2defd6748ed0c1002da` | **test, `new`** | nowhere yet |
| `.github/workflows/rebuild.yml` | `8403d10b1a54d721a17e92cc0c2eb7fe119379b65cc4ba9625e6a7196ad9d532` | `878baa7617f63e236d68213f672d716b67d976dcf1e4a6ce50948b7d06133499` | **product, `edited`** | S6, S7, S8 (`edited`); S8's declared post is the pre above |

The workflow's post image CHANGED in the fix round: the landing's `2b91dafe7d61...` was the
one-file step, `878baa7617f6...` is the two-file step. `2b91dafe7d61...` is dead and S10 should
carry only the row above. This is the one sealed path this branch moves, and R1 N2's
`UNLISTED-PRODUCT-DRIFT` is the refusal that waits for its declaration.

**A LAW, NOT ONLY A PRODUCT ROW (R1 N4, accepted).** S6 law 17 is "The `m4/workout` class is
closed", carried by S7 and S8: `rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md:139` reads
"`plan-edit-commands.cjs`, `plan-edit-model.cjs` and `engine-order.cjs` declared;
`f2-tag-adapter.cjs` proved imported by no runtime file", and section 2.5 at `:27` names the
class as three files. This landing makes it four. I searched and found NO cell that enumerates
the directory, so nothing reds today; the law is enforced by declaration alone. **S10 must
supersede law 17 by name, not merely add a product row.**

NEEDLES: none of this branch's commits changes one. `d-plan-edit` stays `# pass 90`, measured on
both machines in section 4. A new child for the F2 step would need its own needle, and at this
head `node --test rebuild/lanes/d/f2/projector.test.mjs rebuild/lanes/d/f2/guard-coverage.test.mjs`
prints **`# pass 64`** (it printed `# pass 43` at `797b05ce`). THE NEEDLE S10 SHOULD CARRY IS
`# pass 64`, measured on win32 and on linux at `b954d17e`.

What a LATER retirement would have to declare, with the pre sha256 of every path it touches and
the seal child that holds each one today. This branch moves NONE of them; the table exists so
the PM can route the work without re-measuring. The last three rows are R1 N3's, verified here
by computing each blob's sha256 from Git at `b9d8d645`:

| path | pre sha256 | held by | what the retirement does to it |
|---|---|---|---|
| `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` | `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` | S6 `pinned-unchanged`, S7 `carried`, S8 `carried` | DELETED |
| `rebuild/lanes/d/plan-edit/durable-host.test.mjs` | `e986c046bb675309eabef894706353979c5ee9e51d58bf67b5829593ea068b63` | S6 `pinned-unchanged`, S7 `carried`, S8 `carried` | `tagSource()`, the `PE_F2_PUBLIC_REF` allowlist and two now-dead imports retired |
| `rebuild/lanes/d/plan-edit/model.test.cjs` | `afb88e790020cc1140914c1a16eeda009b38cab7cf6dda9561cc5eaf8ea9a275` | S6, S7, S8 (S8 `edited`) | `:20` default re-pointed; PE16 `f2-adapter-identity` SPLIT, see the row below |
| `rebuild/lanes/d/plan-edit/astra-rerun.mjs` | `bf2c93abf01d1abee3ef38cfaab4b1ff8f4482779c00287078e52a231ffda737` | not declared in S6/S7/S8 | codemod target string re-pointed |
| `rebuild/lanes/d/p3-real-shape/real-shape-support.mjs` | `7c27dad17968b9c1d98f5f6943e4e63549c279b4add4cd7eb0979796387d5bf1` | S8 `new` | `:300` require re-pointed; five cells ride on it |
| `rebuild/lanes/d/p3-real-shape/real-shape-capture.test.mjs` | `ade7312b59412bf2532e565bf8c17de721ff9c49cea9fd8336aa512c54ec47c7` | S8 `new` | `:155` require re-pointed |
| `rebuild/lanes/d/p3-port-fix/owner-route.test.mjs` | `08f9a5fbcb4d83d70c807422578986b751b74bdce849eb046b84157e641bb383` | S7 `new`, S8 `edited` | `:68` require re-pointed |
| `rebuild/lanes/b/tooling/packages/S6.json`, `S7.json`, `S8.json` | three seal packages | themselves | each names the deleted path with its sha256 (S8's role is `carried`, so the runner asserts its pre bytes and a deletion refuses `UNLISTED-PRODUCT-DRIFT`) |
| `rebuild/lanes/b/tooling/receipts/S6.json`, `S7.json`, `S8.json` | three receipts | themselves | each records `d0436809e9e5...` for the deleted path |
| `rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md` | a sealed brief | S6 | `2.5` and law `17` name the path and its `pinned-unchanged` role in prose |
| `rebuild/m4/spec/acceptance-s6-today-child.json` | `0e52357ed62249d4ee94b473e2dde20220b0a82c3737414bba0603fa76bf040f` | an ACCEPTED acceptance spec | `:376` pins the path `pinned-unchanged` at `d0436809e9e5...` |
| `rebuild/m4/spec/acceptance-s7-port-admission.json` | `350f56885c5eb55eecada58cadfb011656ddc58b82fc8fdc514ddc4503af791b` | an ACCEPTED acceptance spec | `:421` names the path |
| `rebuild/m4/spec/acceptance-s8-real-shape.json` | `3cf58e0edd76a56353b35008ef154d484098b5017fedeb648eb64a0ae6568d48` | an ACCEPTED acceptance spec | `:421` names the path |

Thirteen rows across three seal children, three receipts, a sealed brief, three ACCEPTED
acceptance specs and three CI steps two other lanes hold. That is why this is the PM's to route
and not a lane hand's.

**THE PE16 CELL IS TWO RULES AND ONLY ONE OF THEM DIES WITH THE COPY (R2 N5, and the PM's
ruling that 6.1's row be split).** `rebuild/lanes/d/plan-edit/model.test.cjs:505`, test
`PE16 f2-adapter-identity`, does two separate things:

| half | what it asserts | what a retirement does to it |
|---|---|---|
| FIRST, `model.test.cjs:505` opening lines | the lane copy on disk hashes equal to `git show f3e9561:rebuild/m4/workout/setup-tags.cjs`, the published blob | dies with the copy; its job passes to `F2-G22`, which is deleted in the same ticket |
| SECOND, `model.test.cjs:505` closing loop | neither `plan-edit-commands.cjs` nor `plan-edit-model.cjs` mentions `f2-tag-adapter` **or `setup-tags`** | **A LAW ABOUT THE PLAN-EDIT RUNTIME. IT MUST SURVIVE THE RETIREMENT** and needs no change to do so: it already names both spellings |

**AND UNTIL S10 RULES, THE TWO FILES MUST NOT DRIFT (the PM's ruling).** Measured at this head:
NO cell on this branch held `rebuild/m4/workout/setup-tags.cjs` byte-equal to
`rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs`. PE16 is the closest and it is not it: it reads
the LANE COPY from disk and compares it with a Git blob, and never opens the landed file at all,
so an edit to the landed module alone reds nothing in plan-edit. Round 3 therefore adds ONE row,
`F2-G22`, which hashes BOTH working-tree files and compares them, and whose comment says in
terms that the retirement ticket deletes it on purpose together with the copy.

### 6.2 A NOTE THE NEXT REVIEWER SHOULD TEST RATHER THAN TRUST

`model.test.cjs:20` already reads `process.env.PLAN_EDIT_F2_MODULE || './f2-tag-adapter.cjs'`.
A retirement could therefore be done in two moves rather than one: first re-point every importer
at `rebuild/m4/workout/setup-tags.cjs` while the copy stays, which makes every one of the nine
cell files above green against the REAL module and costs the seal packages nothing but three
`edited` roles; only then delete the copy.

**IT IS NO LONGER WHOLLY UNMEASURED. R2 N4 MEASURED THE FIRST MOVE FOR TWO OF THE SEVEN
IMPORTERS, without editing a byte, through the two overrides the cells already carry**, and the
PM's ruling is that the measurement joins this section:

| importer | how R2 measured it | result | status |
|---|---|---|---|
| `plan-edit/model.test.cjs` | `PLAN_EDIT_F2_MODULE` pointed at the LANDED `rebuild/m4/workout/setup-tags.cjs` | **55 tests / 55 pass / 0 fail, exit 0** | **MEASURED** |
| `plan-edit/durable-host.test.mjs` | `PE_F2_PUBLIC_REF=f3e9561`, compiling the published blob rather than the copy | **30 tests / 30 pass / 0 fail, exit 0** | **MEASURED** |
| `p3-real-shape/real-shape-support.mjs` (`:300`, five cells ride on it) | no override exists | not run | **UNMEASURED** |
| `p3-real-shape/real-shape-capture.test.mjs` (`:155`) | no override exists | not run | **UNMEASURED** |
| `p3-port-fix/owner-route.test.mjs` (`:68`) | no override exists | not run | **UNMEASURED** |

So the two plan-edit cells are green against the real module at its real address, today, on this
branch. The five real-shape and port-fix sites carry no override, and measuring them would have
meant editing files this lane does not own, so nothing is claimed about them. That is the state
the PM routes on; the retirement itself is still STOPPED and belongs to the S10 brief.

## 7. THE MUTATION TABLE OVER `setup-tags.cjs` ITSELF

The old branch's `mutants.cjs` is a start and not the answer: it carries 8 mutants and it is
read only by the three cells that stayed behind. So the module was mutated from scratch. The
landing round did 59 mutants at clause granularity. R1 B2's complaint about that is accepted:
where a clause has independent TERMS, a killed clause can hide an undriven term. This round
therefore re-ran the sweep at TERM granularity and added R1's own 16 mutants and two double
mutants: **100 distinct mutants, 0 anchor misses.**

METHOD, reproducible by anyone. A farm scratch worktree at the pushed head, with both cells
present. For each row, one exact string replacement disables one guard term (typically
`if (<condition>) fail();` becomes `if (false) fail();`, or a single `|| term` becomes
`|| false`), the mutated file is written to disk, `node --test` runs BOTH cell files, the failing
test titles are recorded, and the original bytes are restored. Every anchor was checked to occur
exactly once. The module's sha256 was `d0436809e9e5...` before the sweep and `d0436809e9e5...`
after it, and the driver asserts the restored bytes are identical.

**RESULT OF THE FIX ROUND'S SWEEP, AS IT STOOD AT `797b05ce`: 100 mutants, 87 KILLED, 13
survive.** The sentence that followed, "ZERO guard terms of this module are undriven", WAS FALSE
AND IS WITHDRAWN. R2 disproved it with four terms; round 3's own re-measurement found twelve
more. The honest result, measured at `b954d17e`, is in **7.4**, and it is a statement about the
mutants this lane wrote and nothing more. Sections 7.1 and 7.2 below are kept as the fix round's
record, with their claims corrected in place where round 3's measurement contradicts them.

Killing cells, keyed. `C` keys are the brought-across cell `projector.test.mjs`, `G` keys the
fix round's `guard-coverage.test.mjs`.

| key | test |
|---|---|
| C01 | F2-02 custom prototypes, sparse arrays, array properties and cycles refuse |
| C02 | F2-02 tags and helpers are closed, including nonenumerable and symbol fields |
| C03 | F2-02 helpers must be known, unique and finite positive fractions at most one |
| C04 | F2-02 malformed taxonomy configuration refuses at factory creation |
| C05 | F2-PE02 new exercise API refuses carried load history or an old marker |
| C06 | F2-02 head compatibility and vocabulary refuse wrong semantic types |
| C07 | F2-H02 helper head must be present as a compatible known string or absent |
| C08 | F2-04 factory snapshots injected taxonomy; later caller edits cannot rewrite provenance |
| C09 | F2-PE04 new exercise API preserves empty helpers and shares semantic refusals |
| C10 | F2-H03 effective helper targets detect duplicates and self-credit across tuple forms |
| C11 | F2-02 self-credit includes coarse overlap but distinct resolved heads may help |
| C12 | F2-PE03 new exercise API binds exact operation/date and rejects hostile contexts |
| C13 | F2-03 absent snapshot returns the exact legacy state; [] is explicit metadata |
| C14 | F2-02 missing, extra and duplicate setup identities refuse without mutation |
| C15 | F2-02 data getters are refused without executing them |
| C16 | F2-02 operation/date context is explicit and calendar-valid |
| C17 | F2-02 state identity and source identity must agree |
| C18 | F2-02 changed snapshot, provenance or a partial marker set refuses atomically |
| C19 | F2-02 first enrichment refuses existing observations, working loads and old forks |
| C20 | F2-02 same-marker history before setup or from unknown exercise identities refuses |
| C21 | F2-02 all canonical catalogue snapshots project by saved athlete id |
| C22 | F2-02 null-prototype data dictionaries remain supported plain records |
| C23 | F2-02 matching re-projection preserves later history, edits, native carriers and outbox bytes |
| C24 | F2-04 projected tags are detached and deeply frozen without freezing source inputs |
| C25 | F2-PE01 new exercise projection matches every existing setup snapshot |
| C26 | F2-04 five headless coarse catalogue helpers remain coarse after projection |
| G01 | F2-G01 a duplicated identity in the state exercise array refuses |
| G02 | F2-G02 a non-record projection context refuses the named error |
| G03 | F2-G03 the injected taxonomy muscle list must be a non-empty array of unique names |
| G04 | F2-G04 exercise set, ceiling and increment bounds refuse |
| G05 | F2-G05 exercise progression steps must be strictly ascending positive numbers |
| G06 | F2-G06 the setup document is closed and its label and priorities are typed |
| G07 | F2-G07 the source split must be a seven-day map over the known day kinds |
| G08 | F2-G08 a history date that is not a calendar day refuses instead of sorting as text |
| G09 | F2-G09 workoutFacts must carry the profile and an array of sessions |
| G10 | F2-G10 each workout fact session and its effective record must be records |
| G11 | F2-G11 non-record history rows and night rows refuse |
| G12 | F2-G12 prototype-chain names are data, never structure |
| G13 | F2-G13 a state-level data accessor is refused without executing it |
| G14 | F2-G14 the exercise identity must be non-empty text |
| G15 | F2-G15 the exercise display name must be non-empty text |
| G16 | F2-G16 an exercise day outside the U/L vocabulary refuses |
| G17 | F2-G17 a stored primary head that disagrees with the snapshot refuses |
| G18 | F2-G18 a non-array progression ladder refuses by name, not by TypeError |
| G19 | F2-G19 a non-array state exercise list refuses by name, not by TypeError |
| G20 | F2-G20 a null exercise row throws, and the throw is NOT the named refusal (`:124`) |
| G21 | F2-G21 no shipped muscle has both an identity region and a sub-region (`:97`) |
| G22 | F2-G22 the landed module and the lane copy do not drift apart |
| G23 | F2-G23 a tagged state row whose muscle left the authored setup refuses |
| G24 | F2-G24 a tagged state row whose day left the authored setup refuses |
| G25 | F2-G25 an untagged state row may not already carry a helper list |
| G26 | F2-G26 an untagged state row fork list must be an array |
| G27 | F2-G27 the untagged map histories must be records and not arrays |
| G28 | F2-G28 the untagged array histories must be arrays |
| G29 | F2-G29 the untagged sleep night list must be an array |
| G30 | F2-G30 a null workout fact session refuses by name, not by TypeError |
| G31 | F2-G31 a null stored marker refuses by name, not by TypeError |
| G32 | F2-G32 a null setup exercise list refuses by name, not by TypeError |
| G33 | F2-G33 a null or absent state refuses by name, not by TypeError |
| G34 | F2-G34 a null state exercise row refuses by name, not by TypeError |

### 7.1 EVERY GUARD AND EVERY TERM, MUTATED ONCE

`M` rows are the landing round's, `M..a/b/c` rows the fix round's term-level splits of them,
`R` rows R1's own. The third column names every cell that goes red.

| # | guard or refusal mutated | goes red |
|---|---|---|
| `M01` | cloneData non-JSON scalar / cycle | C01 |
| `M01b` | cloneData cycle term only | C01 |
| `M02` | cloneData custom prototype | C01 |
| `M03` | cloneData array extra own keys | survives, see 7.2 |
| `M04` | cloneData symbol key | C02 |
| `M05` | cloneData getter / non-enumerable | survives, see 7.2 |
| `M05b` | cloneData non-enumerable term only | survives, see 7.2 |
| `M06` | cloneData array hole / index shape | survives, see 7.2 |
| `M07` | cloneData finite-number gate | G04 G05 C03 |
| `M08` | factory config closed | C04 |
| `M09` | factory muscle list shape and uniqueness | G03 |
| `M09a` | factory muscles is an array | G03 |
| `M09b` | factory muscle uniqueness term only | G03 |
| `M09c` | factory muscles is non-empty | G03 |
| `M09d` | factory muscle names are non-empty text | G03 |
| `M09e` | factory regions is a plain record | G03 |
| `M10` | factory region vocabulary | C04 |
| `M11` | exercise row shape | C05 |
| `M11b` | exercise mg / day vocabulary | C06 |
| `M11c` | exercise sets / hi / inc bounds (six terms at once) | G04 |
| `M11c1` | exercise sets is a safe integer | G04 |
| `M11c2` | exercise sets is positive | G04 |
| `M11c3` | exercise hi is a safe integer | G04 |
| `M11c4` | exercise hi is positive | G04 |
| `M11c5` | exercise inc is a number | G04 |
| `M11c6` | exercise inc is positive | G04 |
| `M11c7` | exercise steps is non-empty | G05 |
| `M11d` | exercise steps strictly ascending positives | G05 |
| `M12` | tag closed / secondary array | C02 |
| `M13` | tag head compatibility with mg (whole clause) | G12 C06 |
| `M14` | helper tuple closed / mg known | C07 C03 C02 C08 |
| `M15` | helper lend finite fraction in (0,1] | C03 |
| `M16` | helper explicit head compatibility | G12 C07 C09 |
| `M16b` | session log record shape and known ids | G11 C20 |
| `M17` | effective helper target duplicate / self-credit | C10 C03 C11 |
| `M17b` | coarse-primary regional overlap term only | C10 C11 |
| `M18` | new-exercise context closed / op_id / date | C12 |
| `M19` | absent snapshot returns null (identity branch) | C13 |
| `M20` | setup document shape (whole clause) | G06 |
| `M20a` | setup document is closed | G06 |
| `M20b` | setup athlete label is text | G06 |
| `M20c` | setup exercises is an array | survives, see 7.2 |
| `M20d` | setup exercise list is non-empty | survives, see 7.2 |
| `M20e` | setup priority_muscles is an array | G06 |
| `M20f` | setup priority muscles are text | G06 |
| `M21` | split shape and weekday vocabulary (whole clause) | G07 |
| `M21a` | source split is closed over from/map | G07 |
| `M21b` | source split day is a calendar day | G07 |
| `M21c` | source split map is exactly seven days | G07 |
| `M21d` | source split day kinds are known | G07 |
| `M22` | duplicate id / missing snapshot entry | survives, see 7.2 |
| `M22b` | missing snapshot entry term only | survives, see 7.2 |
| `M23` | extra snapshot entry | C14 |
| `M24` | context must be a plain record | G02 |
| `M25` | tags descriptor must be a data member | C15 |
| `M26` | projection context closed / op_id / date | C16 |
| `M27` | state identity agrees with source | C17 |
| `M28` | state row known and not duplicated (whole clause) | G01 C17 |
| `M29` | state row mg / day agree with the authored row | survives, see 7.2 |
| `M30` | re-projection marker and snapshot equality | C18 |
| `M31` | first enrichment row purity | C17 C19 |
| `M32` | partial marker set refuses | survives, see 7.2 |
| `M33` | array history present and empty before tagging | C19 |
| `M34` | map history present and empty before tagging | C19 |
| `M35` | sleep present and empty before tagging | C19 |
| `M36` | untagged split / priorities / exOrder equality | C17 |
| `M37` | history dated on or after the setup day | G08 C20 |
| `M37b` | history date calendar validity term only | G08 |
| `M37c` | history date not before the setup day, term only | C20 |
| `M38` | reads rows are plain records | G11 |
| `M39` | sleep night rows are plain records | G11 |
| `M40` | session log record shape and known ids | G11 C20 |
| `M41` | workout facts profile and session list | G09 |
| `M41b` | untagged state carries no session | G09 |
| `M41c` | workout facts profile term only | G09 |
| `M42` | workout fact session shape (whole clause) | G10 |
| `M42a` | workout fact session is a record, term only | survives, see 7.2 |
| `M42b` | workout fact effective is a record, term only | G10 |
| `M43` | day() calendar round trip | G07 G08 C16 C12 |
| `M44` | text() non-empty trimmed string | G03 G06 C16 C12 |
| `M45` | closed() exact key count | G06 G07 C07 C02 C16 C04 |
| `M46` | plain() prototype allowlist | G02 G11 C01 |
| `M47` | freeze() deep freeze of the projection | C21 C22 C23 C24 C25 |
| `M48` | equal() key-count agreement | C18 |
| `M49` | regionsByMuscle excludes the muscle itself | C21 C26 |
| `M50` | projector taxonomy snapshot freeze | survives, see 7.2 |
| `R01` | absent tags returns the state | G02 C13 |
| `R02` | tag head is a known region name, term only | survives, see 7.2 |
| `R03` | tag head resolves to the exercise muscle, term only | C06 |
| `R04` | helper lend at most one | C03 |
| `R05` | helper lend above zero | C03 |
| `R06` | helper muscle is known | C03 C08 |
| `R11` | state row not already seen (R1 B2's term) | G01 |
| `R11b` | state row identity is known, term only | C17 |
| `R12` | state exercise count agrees with the snapshot | C17 |
| `R13` | new exercise context closed | C12 |
| `R14` | regionsByMuscle excludes the muscle itself | C21 C26 |
| `R15` | untagged state carries no array history | C19 |
| `D01` | `M38` AND the cloneData prototype gate together | G11 C01 |
| `D02` | `M39` AND the cloneData prototype gate together | G11 C01 |

### 7.2 THE THIRTEEN THAT SURVIVE, AND THE GUARD THAT COVERS EACH

A surviving mutant is only interesting once you know WHY. Each pair below was disabled TOGETHER
and the cells then went red, which proves the pair is not both removable.

**THIS TABLE'S HEADLINE WAS TOO STRONG AND IS CORRECTED. It said "All thirteen are covered".**
A KILLED double proves the PAIR is load-bearing; it does NOT prove the survivor alone is
harmless. Round 3 tested the survivors directly, against inputs rather than against each other,
and three rows of this table were wrong:

| row of 7.2 | what round 3 measured | now |
|---|---|---|
| `M29` state row mg / day, "covered by `M31`" | `M31` covers it only on an UNTAGGED state. On an already tagged state the `:158` branch never runs, and with `:152`'s terms gone a stored row whose `mg` or `day` left the authored setup is **ACCEPTED** | driven by `G23` and `G24` |
| `M32` partial marker set, "covered by `M31`" | the `:154` halves `!own(e,'head')` and `!own(e,'secondary')` are redundant, but the `:158` term `own(e,'secondary')` was not: an untagged row already carrying a helper list was **ACCEPTED** | driven by `G25` |
| `M20c` setup exercises is an array, "covered by `M20d`" | `M20d` covers `{}` and `[]`, both of which still refuse by name through `.length`. It does NOT cover `null`, which reads `.length` off nothing and throws a raw `TypeError` | driven by `G32` |

The ten other rows of the table reproduce exactly as written, and every double in it is still
KILLED. The method note below stands unchanged.

| survivor | the guard that covers it | double mutant | tests red |
|---|---|---|---|
| `M03` array extra own keys | `M06` array index shape | KILLED | 1 |
| `M06` array index shape | `M03` array extra own keys | KILLED | 1 |
| `M05` descriptor is a data member | `M01` cloneData rejects `undefined` | KILLED | 1 |
| `M05b` non-enumerable term | `M45` `closed()` exact key count | KILLED | 8 |
| `M22` duplicate id / missing entry | `M23` extra snapshot entry | KILLED | 1 |
| `M22b` missing entry term | `M23` extra snapshot entry | KILLED | 1 |
| `M29` state row mg / day | `M31` first enrichment row purity | KILLED | 2 |
| `M32` partial marker set | `M31` first enrichment row purity | KILLED | 3 |
| `M50` taxonomy snapshot freeze | `M47` deep freeze of the projection | KILLED | 5 |
| `M20c` setup exercises is an array | `M20d` exercise list is non-empty | KILLED | 1 (G06) |
| `M20d` exercise list is non-empty | `M23` extra snapshot entry | KILLED | 2 (G06, C14) |
| `M42a` session is a record | `M42b` effective is a record | KILLED as `M42` | 1 (G10) |
| `R02` head is a known region name | `R03` head resolves to the muscle | KILLED as `M13` | 2 (G12, C06) |

Two rows need a word of method. `M42a`/`M42b` and `R02`/`R03` are two terms of the SAME source
line, so composing their replacements textually is a no-op: the second anchor is gone once the
first has been applied. Their honest double is the whole-clause mutant, `M42` and `M13`
respectively, and both are KILLED, by `G10` and by `G12` with `C06`. This is stated rather than
hidden because a reader re-running the sweep will see the composed pair report SURVIVED.

### 7.3 WHAT CHANGED SINCE REVIEW R1, ROW BY ROW

R1 counted fourteen guard terms that no cell anywhere drove: the landing round's twelve, plus
`seen.has(e.id)` at `:149` (B2's serious one) and `own(regions, tag.head)` at `:85`. All fourteen
are answered below. **The sentence that used to stand here, "There are now none", WAS FALSE: it
was a claim about the fourteen terms R1 happened to name, written as if it were a claim about
the module. R2 found four more and round 3 found twelve more still. The count that replaces it
is measured in 7.4.** What follows is the fate of R1's fourteen and nothing wider:

| R1's undriven term | now |
|---|---|
| `:149` `seen.has(e.id)` (B2) | KILLED by `G01`. A state holding `x0` twice and missing `x1` is refused |
| `:85` `own(regions, tag.head)` | proved REDUNDANT, not uncovered: `R02` survives alone, the whole clause `M13` is KILLED by `G12`/`C06`. A prototype-chain name never resolves to the exercise's `mg` |
| `M09` / `M09b` muscle list | KILLED by `G03`, and split into five terms `M09`/`M09a`-`M09e`, all KILLED |
| `M11c` sets / hi / inc | KILLED by `G04`, and split into six terms, all KILLED |
| `M11d` steps ascending | KILLED by `G05` |
| `M20` setup document | KILLED by `G06`, and split into six terms: four KILLED, two REDUNDANT (`M20c`, `M20d`) |
| `M21` source split | KILLED by `G07`, and split into four terms, all KILLED |
| `M24` context is a plain record | KILLED by `G02`. R1 B1 is right that the module always refused this by name; what was missing was the cell |
| `M37b` history date calendar validity | KILLED by `G08` |
| `M38` / `M39` history and night rows | KILLED by `G11`. R1 expected these to be redundant with `cloneData`; measured, they are NOT: a `null` row with the term gone reads `d` off `null` and the caller sees a raw `TypeError` instead of `SETUP_TAGS_INVALID` |
| `M41` workout facts profile | KILLED by `G09`, and split into three terms, all KILLED |
| `M42` workout fact session shape | KILLED by `G10`; the `session.effective` half `M42b` is KILLED alone and the `session` half is redundant with it |

Nothing was changed to go green and no guard was weakened: the mutated bytes lived only in a
farm scratch worktree, the driver restores the file after every row and asserts the restored
bytes are identical, and the module's sha256 is the same before and after the sweep.

### 7.4 ROUND 3'S RE-MEASUREMENT, AND THE COUNT AS MEASURED

R2 B2 is upheld and the remedy it asks for is here: the sweep was re-run with R2's term-level
method at the final head, and the count below is what the run printed.

METHOD, and it is a GENERATOR rather than a hand-written list, because a hand-written list is
exactly how the first two rounds missed terms. A small script walks the module's source, finds
every `if (<condition>)` wherever it sits on its line, splits the condition at top-level `||`,
and emits ONE mutant per term: that term's exact source span replaced by `false`. The span is
taken from the parse, so every anchor is unique by construction and an anchor miss is
impossible. To that the round adds fifteen hand-written mutants for the guards that are not `if`
conditions at all: the bodies of `text()`, `plain()`, `closed()`, `day()` and `equal()`, the
`regionsByMuscle` filter and its freeze, the projection's freeze, the clone at `:103`, the
`bucket` fallback at `:86` and the effective target at `:95`.

**125 generated term mutants + 15 hand mutants = 140.** For each one the mutated file is written
to disk, `node --test` runs BOTH landed cells, the failing test titles are recorded, the original
bytes are restored and the module's sha256 is re-compared. It was
`d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` before the sweep and after it,
and after every single row.

| measured at `b954d17e` | count |
|---|---|
| term mutants run | **140** |
| KILLED by a behaviour row | **115** |
| survivors | **25** |
| survivors that flip a refusal into an ACCEPTANCE | **0** |
| survivors that degrade a named refusal into a raw throw | **0** |
| anchor misses | **0** |
| module sha256 changes | **0** |

Before round 3's rows, the same 140 mutants left **37** survivors, of which **5 were ACCEPTING**
and **7 were DEGRADING**. All twelve now have a row, on top of R2's six. That is the whole of
round 3's cell work and it is why the diff is one cell file and this report.

HOW "ACCEPTING" AND "DEGRADING" WERE DECIDED, because the words carry the finding. A differential
corpus of **161 synthetic cases** (hostile setups, snapshots, states, tagged states and
single-exercise calls) is classified against the unmutated module as NAMED (it throws
`SETUP_TAGS_INVALID` with `code === message`), RAW (it throws something else) or OK (accepted).
The baseline is **145 NAMED, 2 RAW, 14 OK**. The same corpus is then run against each surviving
mutant and the classifications are diffed: a case that moves NAMED to OK makes the term
ACCEPTING, NAMED to RAW makes it DEGRADING, and a term with no case moving at all is REDUNDANT
against this corpus. **The 2 RAW baseline cases are PM finding P-F2-1**, found by the corpus
independently of the PM's reading: see 7.6.

### 7.5 THE TWENTY-FIVE THAT STILL SURVIVE, NAMED

Every one is REDUNDANT against the 161-case corpus: with the term deleted, not one case changes
how the module answers. Named in full, because a count nobody can check is what R2 rejected.

| line | term | line | term |
|---|---|---|---|
| `:29` | `typeof value !== 'object'` | `:139` | `!descriptor` |
| `:36` | `array && keys.length !== value.length + 1` | `:154` | `!own(e, 'head')` |
| `:41` | `!own(descriptor, 'value')` | `:154` | `!own(e, 'secondary')` |
| `:41` | `!descriptor.enumerable` | `:162` | `tagged && tagged !== ids.size` |
| `:42` | `array && (!/^(0\|[1-9]\d*)$/.test(key) \|\| Number(key) >= value.length)` | `:165` | `!plain(out.sleep)` |
| `:58` | `b === null` | `:177` | `!plain(record)` |
| `:58` | `typeof a !== 'object'` | `:181` | `!plain(facts)` |
| `:58` | `typeof b !== 'object'` | `:16` | `plain()`: not an array |
| `:58` | `Array.isArray(a) !== Array.isArray(b)` | `:18` | `closed()`: every required key present |
| `:116` | `!source.exercises.length` | `:19` | `day()`: the `YYYY-MM-DD` shape |
| `:118` | `!plain(snapshot)` | `:74` | `freeze(regionsByMuscle)` at factory time |
| `:124` | `ids.has(e.id)` | `:86` | `bucket` falls back to the exercise muscle |
| `:124` | `!own(snapshot, e.id)` | | |

**R2 N2 IS ANSWERED, AND TWO OF ITS FOUR CLASSIFICATIONS DID NOT SURVIVE RE-MEASUREMENT.** R2
lists four terms as measured-redundant. Round 3 agrees about two and disagrees, with evidence,
about two:

| R2 N2's term | R2's verdict | round 3, measured | now |
|---|---|---|---|
| `:118` `!plain(snapshot)` | redundant | **REDUNDANT**, confirmed: an array snapshot is refused by name at `:124` / `:128` | in the table above |
| `:181` `!plain(facts)` | redundant | **REDUNDANT**, confirmed: caught by the profile comparison | in the table above |
| `:144` `!plain(out)` | redundant, "caught by the label and identity comparisons" | true of `42`, `[]`, a string and `true`; **NOT of `null` or `undefined`**, which read `.athlete_label` off nothing and throw a raw `TypeError` | **DEGRADING**, driven by `G33` |
| `:149` `!plain(e)` | redundant, same argument | true of `42` and `'x'`; **NOT of a `null` row**, which reads `.id` off nothing | **DEGRADING**, driven by `G34` |

That is not a criticism of R2's method, which is the method round 3 used; it is what happens when
`null` is added to the probe set. By the PM's own rule for `G11`, `G18` and `G19`, a term that
turns a named refusal into a `TypeError` gets a row, so those two got one.

A honest limit of 7.5, stated rather than buried: REDUNDANT here means "redundant against these
161 cases". For five of the twenty-five the covering guard was located by a double mutant that
changes the corpus where neither term alone does (`:154`'s two halves by `:155` and `:156`,
`:165`'s by its own array term, `:177`'s by its `entries` term, and `plain()`'s array term by
`plain()`'s prototype allowlist). For the other twenty the corpus holds no input that the term
uniquely refuses, even paired with any other term of its own guard, so no covering guard is
claimed for them. And the corpus classifies REFUSALS only: it says nothing about immutability,
freezing or key order, which is why `:74`'s freeze reads redundant here while the fix round's
`M50` x `M47` double, and cells `C21` to `C25`, are what actually hold it.

### 7.6 THE ONE HOLE NO MUTANT CAN SEE: PM FINDING P-F2-1

A mutation sweep can only delete guards that exist. **P-F2-1 is a MISSING guard**, which is why
two reviews and R2's 110 mutants did not find it and why the PM found it by reading the module
line by line.

MEASURED, on the UNMUTATED module, on win32 and on linux:

| call | result |
|---|---|
| `validateSetupTags({athlete_label, split, exercises: [null], priority_muscles: []}, tags)` | throws `TypeError: Cannot read properties of null (reading 'id')` |
| the same setup through `projectSetupTags`'s `ctx.setup` | the same raw `TypeError` |
| the same slot holding `42` instead of `null` | refuses `SETUP_TAGS_INVALID` by name |

The cause is `:124`: `ids.has(e.id)` reads `e` before `checkExerciseTag`'s `closed(e, EXERCISE)`
at `:79` ever gets the chance to refuse it. Note the asymmetry the module has today, because it
is the whole finding in one line: the STATE side of the same rule HAS its shape guard, at `:149`
`!plain(e)`, and the SETUP side at `:124` does not.

**NOTHING BAD IS ADMITTED. IT STILL REFUSES; it just does not refuse by name.** No byte of the
module may change in this round, so what lands is `F2-G20`: a row that pins TODAY'S behaviour
honestly, asserting that the call throws, that the throw is a `TypeError`, and that its `code` is
NOT `SETUP_TAGS_INVALID`, with a comment that says in terms that this is a RECORDED LAXITY, names
`:124`, and says the row is to be rewritten on purpose the day the module gains the guard.

PROVED to be a live tripwire rather than a decoration: with `:124` changed in a scratch to
`if (!plain(e) || ids.has(e.id) || !own(snapshot, e.id)) fail();`, `F2-G20` goes RED (and nothing
else but `F2-G22`, which is the byte pin). Measured on win32 and on linux; the module was restored
and its sha256 re-compared.

The consequence for Edit My Week is in section 12 and it is one sentence.

### 7.7 THE TWENTY-ONE ROWS OF ROUND 3, AND THE MUTANT EACH ONE ANSWERS

Every row below is green on the unmutated module and RED, and red ALONE among the behaviour rows,
on the single-term mutant named beside it. Measured on the PC (win32) AND on linux (a farm
scratch cut from the pushed head `b954d17e`), same result on both, 18 of 18 red alone, the
module's sha256 compared before and after every mutant.

| row | the term deleted | source | what the term alone refuses |
|---|---|---|---|
| `G14` | `:79` `!text(e.id)` | R2 B1 | an empty, blank or numeric exercise identity, which the mutant ACCEPTS |
| `G15` | `:79` `!text(e.n)` | R2 B1 | an empty or numeric exercise name, which the mutant ACCEPTS |
| `G16` | `:80` `!['U', 'L'].includes(e.day)` | R2 B1 | a lift parked on `F`, `REST` or `X`, which the mutant ACCEPTS |
| `G17` | `:155` `e.head !== snapshot[e.id].head` | R2 B1 | a stored head tampered to another region of the same muscle, or to `null`, which the mutant ACCEPTS and silently overwrites at `:189` |
| `G18` | `:82` `!Array.isArray(e.steps)` | R2 N1 | a string or array-like ladder, which the mutant turns into a raw `TypeError` |
| `G19` | `:144` `!Array.isArray(out.exercises)` | R2 N1 | an array-like state exercise list, same |
| `G20` | none, the guard is MISSING | PM P-F2-1 | pins today's raw `TypeError` at `:124` as a recorded laxity; red when the guard arrives |
| `G21` | `:97` `(tag.head === null && regions[target] === e.mg)` | PM P-F2-2 | pins that no `ENGINE_MG` muscle has both an identity `REGION_MG` entry and a sub-region; red when one does |
| `G22` | none, it is a byte pin | PM ruling on item (4) | the landed module and the lane copy are the same bytes; red on EVERY module mutant, by construction |
| `G23` | `:152` `e.mg !== authored.mg` | round 3 | a TAGGED row whose muscle left the setup, which the mutant ACCEPTS |
| `G24` | `:152` `e.day !== authored.day` | round 3 | the day half of the same, ACCEPTED |
| `G25` | `:158` `own(e, 'secondary')` | round 3 | an untagged row already carrying a helper list, ACCEPTED |
| `G26` | `:158` `!Array.isArray(e.forks)` | round 3 | an untagged row whose fork list is a record, ACCEPTED |
| `G27` | `:164` `!plain(out[key])` | round 3 | an ARRAY map history before tagging, ACCEPTED (`Object.keys([])` is empty, so the emptiness term beside it passes) |
| `G28` | `:163` `!Array.isArray(out[key])` | round 3 | a RECORD array history, which becomes a raw `TypeError` at `:172` |
| `G29` | `:165` `!Array.isArray(out.sleep.nights)` | round 3 | a record night list, same at `:173` |
| `G30` | `:184` `!plain(session)` | round 3 | a `null` workout fact session, raw `TypeError`; `G10`'s `[]`, `42` and `'session'` all still refuse by name without the term |
| `G31` | `:58` `a === null` in `equal()` | round 3 | a `null` stored marker, which reaches `Object.keys(null)`; `:153`'s `own(e, 'volumeTags')` is satisfied by a `null` value |
| `G32` | `:116` `!Array.isArray(source.exercises)` | round 3 | a `null` setup exercise list, raw `TypeError` |
| `G33` | `:144` `!plain(out)` | round 3 | a `null` or absent state, raw `TypeError` |
| `G34` | `:149` `!plain(e)` | round 3 | a `null` state exercise row, raw `TypeError` |

TWO ROWS ARE TRIPWIRES AND NOT MUTANT KILLS, and they say so in their own comments. `G20` is
proved above. `G21` was proved by adding `biceps_long: 'biceps'` to `REGION_MG` in a scratch: the
row goes red and names `:97`. That change also reds one existing cell,
`F2-04 five headless coarse catalogue helpers remain coarse after projection`, which is correct
and is reported rather than engineered around. The catalogue was restored and its sha256
re-compared; no byte of `rebuild/m3` is touched by this branch (section 4's fence).

`G22` IS A BYTE PIN AND REDS ON EVERY MUTANT OF THE MODULE, by construction, because a mutant
changes the module's bytes and the lane copy's bytes stay put. That is stated plainly in the
row's own comment and it is why "red ALONE" above is measured over the BEHAVIOUR rows, with
`G22`'s standing red named beside each one. The alternative would have been to make the pin
tolerant of a mutated module, which would be a pin that does not pin.

## 8. WHAT THIS LANE DID NOT DO, SO NOTHING BELOW IS CLAIMED

- No engine byte moved, no `rebuild/m3`, `rebuild/coach` or `rebuild/client` byte moved, and no
  byte of `setup-tags.cjs` moved in any of the six commits.
- The volume half was not landed and was not assessed. Nothing here says it is ready.
- `b-package.cjs --full` was never run, no seal, no receipt, no artifact. `--ci` only.
- The seal generator on `rebuild/b-seal-gen` was not used.
- No browser, no phone, no private census, no protected soak, no `rebuild/conform/private`, no
  `src/history.js`, no `ledger/` directory, on either machine. Every fixture is synthetic.
- `DECISIONS.md` and `rebuild/lanes/STATUS.md` were not written.
- `UNLISTED-PRODUCT-DRIFT` on the workflow (section 5) is READ from the runner and from
  `packages/S8.json`, not executed: the seal-base refusal stands in front of it on every head
  available to this lane.
- The retirement of the lane copy is NOT done (section 6). Its two-move proposal in 6.2 is
  UNMEASURED.
- Whether any of the guard terms now covered is reachable from Edit My Week's own door with
  athlete data is still not answered here. The cells prove the module refuses; they do not prove
  the host ever offers such an input.
- ROUND 3 did not touch `.github/workflows/rebuild.yml`, by the ticket's order, so two numbers in
  the comment above the F2 step are stale (section 3 records them). It did not touch
  `projector.test.mjs`, whose blob identity with the spike is re-verified at this head, and it did
  not touch one byte of `rebuild/m4/workout/setup-tags.cjs`.
- Round 3's 140 mutants and 161 corpus cases are a measurement, not a proof. A term the generator
  did not split, and an input the corpus does not contain, are both still possible: `P-F2-1` is
  the standing proof that reading finds what mutating cannot.
- No row was added for any of the 25 surviving terms of 7.5. They are named there so the next
  round can disagree with the redundancy verdict term by term.
- The covering guard of 20 of those 25 is NOT identified; 7.5 says so rather than guessing.
- Round 3 did not run the five real-shape and port-fix importers against the real module (6.2):
  they carry no override, and measuring them means editing files this lane does not own.

## 9. R1 FINDINGS: FIXED OR DISPUTED

Nothing in R1 is disputed. Two findings are accepted with a correction to R1 itself, both in the
direction of the module being better than R1 thought, and both measured.

### B1 (BLOCKING). The M24 row and section 9 item 3 were factually false. FIXED.

R1 is right. `:136` `if (!plain(context)) fail();` runs BEFORE the `getOwnPropertyDescriptor` at
`:137`, so a non-record context refuses `SETUP_TAGS_INVALID` by name. The `TypeError` the first
report described exists only in the MUTANT. Re-measured independently by this round on both
machines: `null`, `undefined`, a string, `42`, `0`, `true`, `false`, `[]`, an array of pairs, a
`Map`, an object with a custom prototype and a function all throw `Error` whose `message` and
`code` are both the literal `SETUP_TAGS_INVALID`.

The two false sentences are gone: section 7.1's `M24` row now reads KILLED by `G02`, and section
10 no longer lists it as a defect. The rule is also PINNED now, which it never was: `F2-G02`
fails on the `M24` mutant. S10 can lift the table.

### B2 (BLOCKING). A guard whose removal turned nothing red. FIXED, red first, in its own commit.

R1 is right, and the finding is the most valuable thing in the review. `:149`'s term
`seen.has(e.id)` had no cell: `F2-02 missing, extra and duplicate setup identities`
(`projector.test.mjs:157`) drives the duplicate on the SETUP side only. Reproduced here exactly
as R1 describes: with the term deleted, `projector.test.mjs` is 30/30/0 and a state whose
`exercises` array holds `renamed-0` twice and has lost `renamed-1` is accepted, marked and
frozen.

`F2-G01` is the red-first cell, in commit FIX 1/3, which is a different diff from the landing.
It drives the duplicate on the STATE side, before and after the setup has been projected once,
asserts the state is not mutated by the refusal, and carries a control that the same fixture
projects normally when the two rows are distinct. Measured: red on the `R11` mutant, green on
the module. **No byte of the module changed**, because the guard was never wrong; only the
evidence was missing.

R1's second, benign miss at `:85` is also answered, and here R1's classification is corrected in
the module's favour: `own(regions, tag.head)` is REDUNDANT rather than merely undriven. `R02`
survives alone, but the whole clause `M13` is KILLED by `G12` and `C06`, and `G12` drives
`constructor`, `toString`, `hasOwnProperty`, `__proto__` and `valueOf` as head names and as
helper heads and gets `SETUP_TAGS_INVALID` for every one. R1's count of 14 undriven terms was
right when it was written. **THE CLAIM THAT FOLLOWED IT HERE, "the count is now 0", WAS FALSE
AND IS WITHDRAWN**; R2 B2 is upheld in full. The count as measured at this head is in 7.4: 140
term mutants, 115 killed, 25 survivors, all 25 redundant against a 161-case corpus, and no claim
of exhaustiveness.

### N1. The absent-tags path is laxer than the rest of the module. AGREED, ESCALATED, NOT CHANGED.

Re-measured, all five of R1's rows reproduce: `validateSetupTags(undefined, undefined)` returns
`true`, `projectSetupTags('a string state', {tags:null})` returns the string, and
`projectSetupTags(st, {tags:undefined}) === st` with the result NOT frozen. This is what
BRIEF-F2-TAG-PROJECTION-v1.0 3.2 says to do ("with absent/null snapshot, return the constructor
state unchanged"), so no STOP is raised and no byte is changed.

DISCLOSURE, because it is the fix round's own doing: `F2-G02`'s last line pins one more corner of
the same laxity. It asserts that a NULL-PROTOTYPE record carrying `tags: null` also returns the
state by identity. That is deliberate (it is the boundary between `M24`'s refusal and the
identity branch, and without it the cell would read as if every odd context refuses), but it
means a later tightening of the absent-tags path would red `G02` as well as
`projector.test.mjs:69`. Both are one-line changes. **The PM should rule the semantic intended
and let S10 pin it by name, or route a red-first cell; this lane will not decide it.**

### N2. The expected named refusal misread DECISIONS:474. ACCEPTED, SECTION 5 REWRITTEN.

R1 is right about `:474` and right about the runner. Both were re-read at the source by this
round rather than taken from R1: `:474` records EXIT 0 and 0 unlisted drift for new undeclared
runtime files; `fidelity()` at `:2005` diffs four roots and `rebuild/m4/workout` is not one of
them; `setup-tags.cjs` is not among S8's 224 declared product files; and the workflow, which IS
declared `edited` with a post image this branch no longer matches, is what `:1972` will assert
on. Section 5 now says all of that and no longer promises a refusal about `setup-tags.cjs`.

### N3. The S10 retirement table was missing three accepted acceptance specs. ACCEPTED, ADDED.

`grep` on the tip confirms all three: `acceptance-s6-today-child.json:376`,
`acceptance-s7-port-admission.json:421`, `acceptance-s8-real-shape.json:421`. Each blob's sha256
was computed from Git at `b9d8d645` and is in the 6.1 table. The S6 entry pins the path
`pinned-unchanged` at `d0436809e9e5...`, so a deletion contradicts an ACCEPTED artifact and not
only a package.

### N4. Landing a fourth file into `m4/workout/` must supersede law 17 by name. ACCEPTED, ADDED.

Verified at `rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md:139` and `:27`. 6.1 now says S10 must
supersede the law and not only add a product row. Re-searched: no cell enumerates the directory,
so nothing reds today and the law is enforced by declaration alone.

### N5. Two normalization facts no cell pins. ACCEPTED, RECORDED, DELIBERATELY NOT PINNED.

Both reproduce. `{mg:'biceps', lend:0.5, head:'biceps'}` is accepted as a helper, so one credit
has two byte-different encodings, and re-projecting the same context over a document whose
stored `secondary` was rewritten into the redundant form refuses at `:155`'s `equal()`.
`projectNewExerciseTags` performs no uniqueness check and cannot: the module has no view of the
document, and a colliding id only surfaces later, at `:149` (B2's guard).

Neither is pinned by a new cell on purpose. The first is an encoding the brief permits, and a
cell asserting it would pin a laxity the PM has not ruled on. The second is a DUTY THAT BELONGS
TO THE CALLER: **Edit My Week's host must reject a duplicate exercise id before it calls
`projectNewExerciseTags`, and EW2 should be told so by name.** Pinning the module's silence
would read as if the module owned the rule.

### N6. Small report inaccuracies. ACCEPTED, CORRECTED.

The `numstat` box in section 4 is measured at a named head and says exactly what the following
commit adds. Round 3 re-measured it on the PC at `b954d17e`, where it is seven paths. Section 2 no longer calls `product-fixture.cjs`
a driver: it and `mutants.cjs` are listed as a fixture and a mutant list that the three
left-behind cells read.

## 10. FOR THE NEXT REVIEWER

Four things this author would attack first, in order:

1. **The count in 7.4.** R2 was right to attack the fix round's version of this and the same
   attack is still the right one. 140 mutants and 161 corpus cases are what this lane wrote, at
   one granularity, by one generator. A term the generator did not split and an input the corpus
   does not hold are both invisible to it. Pick a line the tables do not name, or an input shape
   the corpus does not carry, and try it. `P-F2-1` shows that reading the module beats mutating
   it for a guard that is not there.
2. **`G02`'s null-prototype identity assertion** (section 9, N1). It pins one more corner of a
   laxity the PM has not ruled on. If the PM intends to tighten the absent-tags path, that line
   should go first, and I would rather be told to delete it than have it read as a decision.
3. **Section 5 is read, not run.** The `UNLISTED-PRODUCT-DRIFT` assertion about the workflow
   comes from the runner's source and the package's JSON. Two earlier refusals stand in front of
   it on every head this lane can build. If it is wrong, S10's declaration is aimed at the wrong
   file.
4. **Section 2's claim that leaving three cells behind costs nothing.** It is a claim about THIS
   FILE only: the left-behind cells prove things about the ENGINE that no mutant of this module
   can reach. R1 checked this against the full 79-cell suite and agreed. Check that the claim is
   not quietly widened anywhere.

And one thing that is not a claim at all: whether any of the now-covered rules is reachable from
Edit My Week's actual door with athlete data. The cells prove the module refuses. Only EW2's
host can say whether such an input can ever arrive.

## 11. R2 FINDINGS AND THE PM'S TWO: FIXED

Nothing in R2 is disputed. Its verdict of REJECT is accepted; both blocking findings are closed
by rows and by sentences, no byte of the module or of `projector.test.mjs` moved, and the round
found twelve more terms of R2's own two classes and closed those too.

### B1 (BLOCKING). Four guard terms drive no cell, three of them ACCEPT. FIXED, red first.

R2 is right on every row and the measurement reproduces exactly. Each of the four now has a row
in `rebuild/lanes/d/f2/guard-coverage.test.mjs`, and each row is RED, and red alone among the
behaviour rows, on its own single-term mutant, on win32 AND on linux:

| R2's term | row | measured |
|---|---|---|
| `:79` `!text(e.id)` | `F2-G14` | red alone on the mutant; green on the module |
| `:79` `!text(e.n)` | `F2-G15` | same |
| `:80` the `U`/`L` day vocabulary | `F2-G16` | same |
| `:155` `e.head !== snapshot[e.id].head` | `F2-G17` | same; `M30` is now split into its head half and its `secondary` half, which is R2's point |

The module's sha256 was compared before and after every mutant and is
`d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` at this head. No cell file
other than `guard-coverage.test.mjs` was touched, and `rebuild.yml`'s step already named it.

### B2 (BLOCKING). The headline is false in three places. FIXED, and re-measured.

All three sentences are gone and each place R2 names carries the measurement instead: section
7's RESULT paragraph (7.4 now holds the count), section 7.3 ("There are now none" withdrawn, and
the paragraph says why the claim was malformed as well as wrong) and section 9's B2 ("the count
is now 0" withdrawn). Section 0's headline is rewritten around the same number.

The count AS MEASURED at `b954d17e`, with R2's term-level method: **140 term mutants, 115
killed, 25 survivors, all 25 REDUNDANT against a 161-case differential corpus, 0 ACCEPTING, 0
DEGRADING, 0 anchor misses, and no claim of exhaustiveness.** Before round 3's rows the same 140
left 37 survivors, 5 ACCEPTING and 7 DEGRADING. The twenty-five that remain are named one by one
in 7.5, which is the form R2 asked for: a table that claims every term was mutated once should
carry its redundant rows too.

### N1. Two terms degrade a named refusal into a raw TypeError. PINNED, by the PM's order.

R2's objection is exactly right: 7.3 uses "a raw `TypeError` instead of `SETUP_TAGS_INVALID`" to
justify `G11`, so the same argument is owed to `:82` and `:144`. Both are pinned, `F2-G18` and
`F2-G19`, red alone on their own mutants. Round 3 then applied the same rule to itself and found
five more terms of that class (`G28` to `G32`, and `G33`/`G34` from N2), all now pinned.

### N2. Four redundant terms belong in the table. ADDED, AND TWO OF THE FOUR ARE NOT REDUNDANT.

`:118 !plain(snapshot)` and `:181 !plain(facts)` are confirmed REDUNDANT by measurement and are
in 7.5's table. `:144 !plain(out)` and `:149 !plain(e)` are NOT: R2's argument holds for `42`,
`[]` and a string but not for `null` or `undefined`, which throw raw. They are pinned by `G33`
and `G34` instead. The evidence is the table in 7.5; this is the one place where round 3
disagrees with a reviewer, and it disagrees in the direction of more coverage, not less.

### N4. The two-move retirement proposal is MEASURED for two importers. RECORDED IN 6.2.

R2's two measured runs (`model.test.cjs` 55/55/0 through `PLAN_EDIT_F2_MODULE`, `durable-host`
30/30/0 through `PE_F2_PUBLIC_REF`) are now the first two rows of 6.2's table, marked MEASURED,
with the five real-shape and port-fix importers marked UNMEASURED and why.

### N5. A retirement must not lose the second half of the PE16 cell. RECORDED IN 6.1.

6.1's row is split into the two halves the cell actually contains, and the second half is marked
as a law about the plan-edit runtime that must survive. It needs no edit to survive: it already
tests for `setup-tags` as well as `f2-tag-adapter`.

### N6. The head-side twin. NOW A GUARD, and in the EW2 list.

R2's note is made a row, `F2-G21`, in the form the PM ordered: an assertion over the SHIPPED
`REGION_MG` and `ENGINE_MG`, plus the two-line fixture under the invented taxonomy that records
why the property matters. See PM finding P-F2-2 below and section 12.

### N3, N7, N8. RECORDED, NOT CHANGED.

N3's R1 table is R2's own reading and needs nothing here. N7 (no ceiling on total lend) is
recorded in section 12 with no row, which R2 itself proposes. N8's reading of the CI step and of
`DECISIONS:554` is unchanged and correct; section 3 now adds that two numbers in that step's
COMMENT are stale and that round 3 was forbidden to fix them.

### PM FINDING P-F2-1. A missing guard at `:124`. PINNED AS A RECORDED LAXITY.

Reproduced independently, twice: by re-running the PM's own calls, and by the 161-case corpus,
whose only two RAW baseline cases are exactly this. Full measurement, the asymmetry with `:149`,
the row, and the proof that the row is a live tripwire are in **7.6**. No byte of the module
changed. The one sentence Edit My Week is owed is in section 12.

### PM FINDING P-F2-2. The identity-head twin at `:97`. PINNED AS A PROPERTY.

Reproduced: under the invented taxonomy `{biceps: 'biceps', biceps_long: 'biceps'}` a lift with
`mg: 'biceps'` and `head: null` REFUSES a helper on `biceps_long` (by `:97`), and the same lift
with `head: 'biceps'` ACCEPTS it. Unreachable under the shipped taxonomy, and the reason is a
property of the catalogue, not of the module: measured at
`rebuild/m3/w7-preview/today/exercise-catalogue.mjs:61`, `REGION_MG` carries exactly eight
identity entries (`abs`, `biceps`, `calves`, `forearms`, `glutes`, `hams`, `quads`, `triceps`)
and NONE of those eight muscles also has a sub-region. `F2-G21` asserts that property over the
shipped `REGION_MG` and `ENGINE_MG` and carries the twin fixture as the recorded reason. Proved
red by adding `biceps_long` in a scratch (7.7).

### THE PM'S RULINGS ON THE OPEN QUESTIONS: WHAT THIS ROUND DID WITH EACH

| ruling | what round 3 did |
|---|---|
| N1, absent tags return the state BY IDENTITY: INTENDED for this landing | no byte and no cell changed. `projector.test.mjs:69` and `F2-G02`'s last line STAY. Section 12 states the behaviour for the S10 declaration |
| the duplicate-exercise-id duty (R1 N5) belongs to EW2's host | section 12, by name |
| R2's head-side twin goes in the EW2 list | section 12, with the eight identity muscles named |
| no ceiling on total lend: recorded, no row | section 12, recorded, no row added |
| item (4), retiring the copy: STAYS STOPPED, routed to S10 | still stopped. 6.2 carries R2's measurement as MEASURED for two and UNMEASURED for five; 6.1's PE16 row is split |
| until then the two files must not drift | measured that NO cell held them byte-equal, so `F2-G22` was added, with the comment the ruling asks for |

## 12. FOR EDIT MY WEEK: WHAT EW2's HOST MUST BE TOLD BY NAME

Five sentences, each one a duty or a fact the host cannot discover from the module's signature.

1. **THE HOST TREATS ANY THROW FROM THIS MODULE AS A REFUSAL, never only
   `err.code === 'SETUP_TAGS_INVALID'`.** The module's contract is one named refusal, and it
   keeps it for every input any reader has found except one: a `null` member of the setup's
   `exercises` array throws a raw `TypeError` from `:124` (PM finding P-F2-1, section 7.6, pinned
   by `F2-G20`). Nothing bad is admitted either way, but a host that catches only the named code
   will let that `TypeError` escape into the door.
2. **The host must reject a duplicate exercise id BEFORE it calls `projectNewExerciseTags`**
   (R1 N5, upheld by the PM). That function performs no uniqueness check and cannot: the module
   has no view of the document. It will mint a fully formed, frozen, marked exercise for an id
   that already exists, and the collision only surfaces later, at `projectSetupTags`'s `:149`.
3. **EW2's host writes ONE encoding of the primary head, and it is the one the catalogue hands
   `projectNewExerciseTags`.** For the eight identity muscles of `REGION_MG` (`abs`, `biceps`,
   `calves`, `forearms`, `glutes`, `hams`, `quads`, `triceps`) both `head: null` and
   `head: '<that muscle>'` validate, and downstream they are NOT the same: brief `:47` and
   `DECISIONS:155 (3)` make a coarse, region-unresolved value `qualified:false`, while a resolved
   head is qualified. The module is right not to care. The host must not offer the athlete a
   choice between them, and the volume half must be told which one it is reading.
4. **Absent tags return the state BY IDENTITY, before the context is closed** (the PM's ruling on
   N1: INTENDED for this landing). `projectSetupTags(state, ctx)` returns `state` itself, not a
   clone and not frozen, the moment `ctx.tags` is absent, `null` or `undefined`, and it does so
   before `closed(ctx, ...)` runs, so the rest of the context is never validated on that path.
   The module's own comment at `:135` says absence preserves identity, the tagless-parent
   differential depends on it, `projector.test.mjs:69` and `F2-G02`'s last line pin it, and the
   S10 declaration should name the behaviour rather than let a later tightening discover it.
5. **There is no ceiling on the TOTAL credit one lift may lend** (R2 N7, recorded, no row).
   Eight helpers each at `lend: 1`, all distinct targets, validate and project to a `secondary`
   that sums to `8.0`. The brief asks for `0 < lend <= 1` per helper, unique targets and no
   self-credit, and the module delivers exactly that, so it is compliant. Whether a lift may pay
   800 percent of itself is the volume half's question and EW2's door's question, and it is
   written down here so nobody discovers it later as a surprise.
