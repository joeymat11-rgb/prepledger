# F2-LAND AUTHOR REPORT: the exercise-tag projector reaches a branch S10 can carry

Lane D. Branch `rebuild/d-f2-land`, cut from `b9d8d645`.
First author: cowork (Earned lane hand), commits 1/4 to 4/4.
FIX ROUND author: cowork (Earned lane hand), commits FIX 1/3 to FIX 3/3, answering
`rebuild/lanes/d/F2-LAND-REVIEW-R1.md` finding by finding in section 9.
MICRO FIX ROUND 3 author: cowork (Earned lane hand), answering
`rebuild/lanes/d/F2-LAND-REVIEW-R2.md` and the PM's own two findings in section 11.
ASTRA R3 fix: previous round based at 68ed2fc2, committed by PM4 at 963df540.
ASTRA R4 closure: uncommitted work on rebuild/d-f2-land-astra4 at 5ed25b9,
following 963df540 and f4eed5fc. Measured on win32 with Node v24.19.0.
Sections 0, 3, 7.4, 7.5, 11 B2, 12 and Review R4 give the current result.
Section 13 retains the f4eed5fc measurements, explicitly historical. Other measurements retain their historical heads and authors;
Astra did not rerun the earlier linux, seal, importer or retirement work.
This report is a HYPOTHESIS. The next reviewer is told to disagree wherever the evidence lets him.

Scope ruled by the PM (`DECISIONS:557`): THE TAG HALF ONLY. NO ENGINE BYTE MOVES.

## 0. HEADLINE

ASTRA R4 BAR: F2 is **81 tests / 81 pass / 0 fail** on this revision. The
previous sandbox plan-edit run measured 90 tests / 88 pass / 2 fail because
esbuild could not read a directory. PM4 reports rerunning the same four paths
on the same PC outside the sandbox at the previous round's bytes: **90 tests /
90 pass / 0 fail**, plus F2 **71 / 71 / 0**. Plan-edit was not rerun in this
continuation. Section 13 separates those measurements and their attribution.

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

THE ROUND-3 REPLACEMENT CLAIM IS ALSO WITHDRAWN: "all 25 survivors are REDUNDANT"
and "ZERO ... acceptance ... ZERO ... raw throw" were false. R3 demonstrated two
ACCEPTING and two DEGRADING survivors, plus an unpinned tags-absent identity path.
G35-G39 now kill those five terms; G40-G41 record two further raw-throw laxities.

**AS MEASURED in R4 closure: 141 variants, 130 killed by behavior rows and
11 survivors. Two of the 130 also stop projector.test.mjs at file scope;
G51 now reports their construction failure inside a named row.** G45-G50
pin the six R4 witnesses. The 712-call corpus was rerun unchanged, then extended
to 718 calls with those six inputs. Sections 7.4-7.5 list the measurements and
the remaining terms without a redundancy classification. The eleven unpinned
terms are one named S10 debt below, not a request for another survivor hunt.

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

The workflow comment's history was read directly with git show:

| revision | test count (both occurrences) | guard cell count |
|---|---|---|
| 68ed2fc2 | 43 | thirteen |
| 963df540 | 71 | forty-one |
| f4eed5fc and this round's base 5ed25b9 | 74 | forty-four |
| current R4 closure | 81 | fifty-one |

The current edit replaces 74 twice and forty-four once, with no other workflow
byte changed. The run line remains identical. R4's reviewer measured 74/74/0 on
linux and win32 at f4eed5fc; this author's 81/81/0 is win32 only. The comment's
retained linux wording is not new evidence for these final bytes. No new linux
or GitHub-job result is claimed.

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
| `M32` partial marker set, "covered by `M31`" | the `:154` halves `!own(e,'head')` and `!own(e,'secondary')` had no differing input in that measurement, but the `:158` term `own(e,'secondary')` was not: an untagged row already carrying a helper list was **ACCEPTED** | driven by `G25` |
| `M20c` setup exercises is an array, "covered by `M20d`" | `M20d` covers `{}` and `[]`, both of which still refuse by name through `.length`. It does NOT cover `null`, which reads `.length` off nothing and throws a raw `TypeError` | driven by `G32` |

The table below retains the earlier double-mutant observations as history, not
as a current redundancy verdict. R3 and Astra's 7.5 witnesses contradict further
single-term redundancy explanations in it. Those doubles were not rerun by Astra.

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
| `:85` `own(regions, tag.head)` | `R02` survived alone in that historical sweep; the whole clause `M13` was KILLED by `G12`/`C06`. This does not classify the single term as removable |
| `M09` / `M09b` muscle list | KILLED by `G03`, and split into five terms `M09`/`M09a`-`M09e`, all KILLED |
| `M11c` sets / hi / inc | KILLED by `G04`, and split into six terms, all KILLED |
| `M11d` steps ascending | KILLED by `G05` |
| `M20` setup document | historically four of six split terms killed; `M20c` and `M20d` subsequently gained G32 and G35 |
| `M21` source split | KILLED by `G07`, and split into four terms, all KILLED |
| `M24` context is a plain record | KILLED by `G02`. R1 B1 is right that the module always refused this by name; what was missing was the cell |
| `M37b` history date calendar validity | KILLED by `G08` |
| `M38` / `M39` history and night rows | KILLED by `G11`. R1 expected these to be redundant with `cloneData`; measured, they are NOT: a `null` row with the term gone reads `d` off `null` and the caller sees a raw `TypeError` instead of `SETUP_TAGS_INVALID` |
| `M41` workout facts profile | KILLED by `G09`, and split into three terms, all KILLED |
| `M42` workout fact session shape | KILLED by `G10`; the `session.effective` half `M42b` was killed alone, and the `session` half subsequently gained G30 |

Nothing was changed to go green and no guard was weakened: the mutated bytes lived only in a
farm scratch worktree, the driver restores the file after every row and asserts the restored
bytes are identical, and the module's sha256 is the same before and after the sweep.

### 7.4 ASTRA'S R4 CLOSURE RE-MEASUREMENT: METHOD AND COUNT

Scratch: C:\Users\joeym\AppData\Local\Temp\earned-astra-6\.tmp\f2-r4-close.
Seven public files were mirrored at their relative paths: setup-tags.cjs, the
lane adapter copy, both F2 cells, exercise-catalogue.mjs, athlete-state.cjs and
engine/constants.cjs. The worktree module was never written. Each scratch
mutation was restored before the next run. No plan-edit test or package runner
was used. The previous scratch was read only.

The retained measure.cjs generator was rerun. All 141 generated source variants
compare identically with its retained mutants.json. Its masking of strings,
regex literals and comments preserves offsets; it finds if conditions, splits
top-level OR terms and replaces each selected span with false. It emits 125
variants. It does not recursively split nested AND/OR terms and is not an
exhaustive enumeration of guard terms.

The same 16 explicit supplements cover text's predicate, plain's array and
prototype checks, closed's count and own-key checks, day's regex/parse/round-trip,
equal's count and recursive comparison, identity-region exclusion, taxonomy
freeze, projection freeze, both exercise-input clones together, bucket fallback
and effective helper target. All exact anchors occur once. Some supplements
change a composite expression; 141 is a variant count, not a count of atomic laws.

Both cells ran for every variant with node --test and the TAP reporter. G22's
byte pin is excluded from behavior-row kill counts. Baseline: 81/81/0.

| measured in R4 closure, win32 | count |
|---|---|
| generated / supplemental / total | 125 / 16 / 141 |
| killed by a behavior row, with no file-scope stop | 128 |
| killed by behavior rows AND a projector.test.mjs file-scope stop | 2 |
| total killed by behavior rows, excluding G22 | 130 |
| survivors, only G22 red | 11 |

Partition: 128 + 2 + 11 = 141, or 130 row kills + 11 survivors. The two
construction variants are :27's string/boolean return and :38's array-length-key
skip. Previously both cells stopped before registering rows. The guard cell now
constructs its shared projector lazily; G51 constructs a separate projector in
its own body. For either variant the measured result is 52 tests / 21 pass /
31 fail: 29 behavior rows including G51, G22, and the unchanged projector file
stop. These are not isolated G51 kills. Exact messages are in Review R4 below.

The original corpus.cjs is byte-identical to the retained 712-call script and
was rerun: 609 NAMED, 8 RAW, 95 OK. Adding one call per R4 witness gives 718:
615 NAMED, 8 RAW, 95 OK. NAMED requires code and message both SETUP_TAGS_INVALID;
RAW records the error constructor, without engine text; OK records JSON output
and top-level frozen status. Absent-tag cases return an explicit identity check.
Recursive freeze, input mutation and arbitrary JS objects are not fully covered.

Families remain whole setup/snapshot/state values, missing fields, scalar and
container substitutions, fresh and tagged states, dates, session records,
markers, tag heads and helper credits, hostile descriptors/prototypes/arrays,
non-JSON scalars, malformed taxonomies and a new-exercise control. The original
8 RAW calls are two repeated null-exercise pairs, an uncoercible-id pair and a
20000-deep-value pair. Counts are calls, not distinct semantic shapes.

The six added calls are the wrong-key split map, hidden state member, priority
array with a hole plus a property, primitive taxonomy marker against {}, sets:{}
against 2, and an array snapshot keyed by numeric text ids. The identity-marker
call injects an identity-only taxonomy and prepares its tagged state with the
unmutated factory. Each of the six single-term variants changes its own new call
from NAMED to OK. Rechecking the previous seventeen survivors with all 718 calls
finds exactly those six variants changed, once each. All eleven remaining terms
have no observed difference on either the 712-call or 718-call run. This records
finite observations and assigns no safety or redundancy classification.

### 7.5 THE ELEVEN REMAINING SURVIVORS: LIST, NO CLASSIFICATION

All eleven leave only F2-G22 red. The evidence count below is 960 calls across
two corpora and one targeted review: R3's reported 191-call corpus, Astra's
718-call corpus (the original 712 plus six R4 witnesses), and R4's reported
51 targeted probes. The 191 and 51 are attributed reviewer measurements, not
reruns claimed here; 712 is a subset of 718 and is not counted twice. Inputs
may overlap between authors. The number is not a count of unique input shapes.

| line | term removed or changed | evidence limit |
|---|---|---|
| :16 | plain(): !Array.isArray(x) | no behaviour row; no differing input found in 960 calls of two corpora and one targeted review |
| :19 | day(): /^\d{4}-\d{2}-\d{2}$/ regex | no behaviour row; no differing input found in 960 calls of two corpora and one targeted review |
| :29 | typeof value !== 'object' | no behaviour row; no differing input found in 960 calls of two corpora and one targeted review |
| :41 | !own(descriptor, 'value') | no behaviour row; no differing input found in 960 calls of two corpora and one targeted review |
| :58 | b === null | no behaviour row; no differing input found in 960 calls of two corpora and one targeted review |
| :74 | freeze(regionsByMuscle) | no behaviour row; no differing input found in 960 calls of two corpora and one targeted review |
| :86 | tag.head fallback to e.mg | no behaviour row; no differing input found in 960 calls of two corpora and one targeted review |
| :124 | !own(snapshot, e.id) | no behaviour row; no differing input found in 960 calls of two corpora and one targeted review |
| :154 | !own(e, 'head') | no behaviour row; no differing input found in 960 calls of two corpora and one targeted review |
| :154 | !own(e, 'secondary') | no behaviour row; no differing input found in 960 calls of two corpora and one targeted review |
| :181 | !plain(facts) | no behaviour row; no differing input found in 960 calls of two corpora and one targeted review |

The six removed from the previous seventeen-term list are now G45-G50, measured
in Review R4 below. :27 and :38 now have G51. No covering guard is inferred for
any remaining term and none is described as removable. The module is unchanged.

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
- ROUND 3 did not touch `.github/workflows/rebuild.yml`, by the ticket's order, leaving stale
  comment counts; Astra's current assignment refreshes them (section 3). Round 3 did not touch
  `projector.test.mjs`, whose blob identity with the spike is re-verified at this head, and it did
  not touch one byte of `rebuild/m4/workout/setup-tags.cjs`.
- Round 3's 140 mutants and 161 corpus cases are a measurement, not a proof. A term the generator
  did not split, and an input the corpus does not contain, are both still possible: `P-F2-1` is
  the standing proof that reading finds what mutating cannot.
- Astra added G35-G39 for five of round 3's survivors and G40-G41 for missing
  guards. G42-G44 now cover the three further survivors found by that corpus.
  G45-G50 now cover R4's six witnesses. The eleven remaining terms are listed
  without classification in 7.5; no covering guard or removability is inferred.
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

R1's second miss at `:85` was examined in the historical sweep: `R02`
survived alone, while the whole clause `M13` was killed by `G12` and `C06`.
That paired observation does not classify the single term. `G12` drives
`constructor`, `toString`, `hasOwnProperty`, `__proto__` and `valueOf` as head names and as
helper heads and gets `SETUP_TAGS_INVALID` for every one. R1's count of 14 undriven terms was
right when it was written. **THE CLAIM THAT FOLLOWED IT HERE, "the count is now 0", WAS FALSE
AND IS WITHDRAWN**; R2 B2 is upheld in full. The count as measured at this head is in 7.4: 141
variants, 130 behavior-row kills (two also stop a cell file), 11 survivors;
the remaining terms are listed without classification in 7.5. No exhaustiveness
claim follows. This replaces round 3's false all-redundant classification.

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

HISTORICAL reviewer requests from the earlier rounds, retained as their record.
The current PM order is to check G45-G51 and carry the eleven terms as one S10
debt, not to start another survivor hunt. The older requested checks follow:

1. **The count in 7.4.** R2 was right to attack the fix round's version of this and the same
   attack was the right one then. That 141-variant, 712-call measurement was at
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

The replacement claim "all 25 REDUNDANT ... 0 ACCEPTING, 0 DEGRADING" is
WITHDRAWN under R3 B1. It was false, as were its repeated headline versions.
Astra's current measurement is **141 variants: 130 behavior-row kills and
11 survivors**. Two row-killed variants also stop the unchanged projector file.
Sections 7.4-7.5 give the expanded 718-call measurement and the survivor list
without classification. G35-G39 answer R3, G42-G44 answer the continuation,
and G45-G50 answer the six R4 witnesses. G51 exposes both construction stops.

### N1. Two terms degrade a named refusal into a raw TypeError. PINNED, by the PM's order.

R2's objection is exactly right: 7.3 uses "a raw `TypeError` instead of `SETUP_TAGS_INVALID`" to
justify `G11`, so the same argument is owed to `:82` and `:144`. Both are pinned, `F2-G18` and
`F2-G19`, red alone on their own mutants. Round 3 then applied the same rule to itself and found
five more terms of that class (`G28` to `G32`, and `G33`/`G34` from N2), all now pinned.

### N2. Four previously unpinned terms: current disposition.

The old claim that :118 !plain(snapshot) was redundant is withdrawn: R4's
array-snapshot witness accepts without it, and G50 now pins it. :181 !plain(facts)
remains in 7.5 without a classification. :144 !plain(out) and :149 !plain(e)
have G33 and G34: removing them degrades named refusals for null or undefined
into raw throws. Historical scalar probes did not establish removability.

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
`DECISIONS:554` is unchanged. Round 3 was forbidden to fix the stale comment
counts; Astra's current assignment refreshes those counts as section 3 records.

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

Six duties or recorded facts for the host. The three raw-throw shapes below
are measured examples, not an exhaustive list.

1. **ANY throw from this module, named or raw, is a refusal to the host.** Do
   not catch only err.code === 'SETUP_TAGS_INVALID'. Measured raw cases include
   a null setup exercise (G20), an id object with no usable toString (G40), and
   a setup value nested 20000 objects deep (G41). The first two throw TypeError;
   the last throws RangeError from cloneData. All refuse by throwing; none is
   an accepted setup. The raw-throw rows are recorded laxities to rewrite on
   purpose when their missing guards are added.

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
   N1: INTENDED for this landing). `projectSetupTags(state, ctx)` returns `state` itself,
   not cloned and not frozen BY THIS MODULE, the moment `ctx.tags` is absent, `null` or `undefined`, and it does so
   before `closed(ctx, ...)` runs, so the rest of the context is never validated on that path.
   The module's own comment at `:135` says absence preserves identity, the tagless-parent
   differential depends on it, `projector.test.mjs:69`, `F2-G02`'s last line and `F2-G39` pin it, and the
   S10 declaration should name the behaviour rather than let a later tightening discover it.
   The reviewer's object was already frozen by createCleanInitState, its maker.
   Companion fact: validateSetupTags(anything at all, null) returns TRUE without
   inspecting setup. A host that validates before tags are chosen has validated
   nothing. The same absence bypass applies to undefined tags. In this round,
   12 synthetic setup inputs with null tags all returned true, including a
   proxy that throws on any get, ownKeys or getPrototypeOf operation.
5. **There is no ceiling on the TOTAL credit one lift may lend** (R2 N7, recorded, no row).
   Eight helpers each at `lend: 1`, all distinct targets, validate and project to a `secondary`
   that sums to `8.0`. The brief asks for `0 < lend <= 1` per helper, unique targets and no
   self-credit, and the module delivers exactly that, so it is compliant. Whether a lift may pay
   800 percent of itself is the volume half's question and EW2's door's question, and it is
   written down here so nobody discovers it later as a surprise.

6. **priority_muscles admits any nonempty text, not only the engine's muscle
   names.** The synthetic value 'synthetic-not-an-engine-muscle' validates.
   Recorded, no row, no verdict; this is input vocabulary the host must know.

## 13. R3 finding and Astra's continuation re-check: fixed

HISTORICAL: the measurements in this section belong to f4eed5fc, not the
current R4 closure. The workflow counts were 43 and thirteen at 68ed2fc2,
71 and forty-one at 963df540, 74 and forty-four at f4eed5fc; they are now
81 (both test-count occurrences) and fifty-one. Section 3 records the history
from git show; Review R4 below records the new measurements.

R3 B1 is upheld. G35-G39 cover its five terms; G40-G41 record two raw throws.
This continuation adds G42-G44 for the three outcome-changing survivors the
previous round named. That revision's partition came from rerunning every mutant
and the same 712-call corpus, not from assuming the three additions suffice.
All 17 remaining survivors produce unchanged outcomes in that corpus. This is
finite evidence, not a proof that every guard now has a behavior row, and not
a merge-readiness or acceptance verdict.

### Single-term evidence, win32 Node v24.19.0

Both cells ran for each scratch variant: **74 tests, 72 pass, 2 fail**. Each row
below is the only red behavior row; the other failure is always F2-G22. The
scratch baseline was **74 tests, 74 pass, 0 fail**. G35-G41 were also rerun.

| row | scratch change | measured difference / red rows |
|---|---|---|
| G35 | delete :116 !source.exercises.length | empty setup + empty snapshot: named refusal to acceptance; G35, G22 |
| G36 | delete :124 ids.has(e.id) | duplicate setup id + one-key snapshot: named refusal to acceptance; G36, G22 |
| G37 | delete :165 !plain(out.sleep) | null sleep: named refusal to TypeError; G37, G22 |
| G38 | delete :177 !plain(record) | null sessionLog record: named refusal to TypeError; G38, G22 |
| G39 | delete :139 !descriptor | absent tags property: identical state to TypeError; G39, G22 |
| G40 | prepend (plain(e) && !text(e.id)) to :124's refusal | {toString:null} id: raw TypeError to named refusal on both setup entry points; G40, G22 |
| G41 | add if (active.size > 256) fail() at cloneData entry | 20000-deep setup: raw RangeError to named refusal on both setup entry points; G41, G22 |
| G42 | disable :36 array && keys.length !== value.length + 1 | setup.exercises slot 0 deleted, length 2 and slot 1 retained: named refusal on validateSetupTags and projectSetupTags's ctx.setup; mutant TypeError; G42, G22 |
| G43 | delete :59 Array.isArray(a) !== Array.isArray(b) | fresh state priority_muscles:{} against setup []; tagged first exercise secondary:{} against snapshot []: both named refusals; mutant accepts both; G43, G22 |
| G44 | disable :162 tagged && tagged !== ids.size | first of two exercises copied from the projection into an otherwise fresh state: named refusal; mutant accepts and marks both; G44, G22 |

G42 and G44 replace their one complete condition with false. G43 removes its
one OR term. Each anchor occurs exactly once. The scratch mirrors the seven
public dependencies listed in 7.4, with relative layout preserved, and restores
the scratch module after every run. The worktree module is never written.
The generator's 141 variants compare identically to the retained prior list;
the corpus script is byte-identical to the prior script. Baseline corpus:
609 NAMED, 8 RAW, 95 OK. Current survivor comparison: 17 unchanged, 0 changed.
No extra behavior row beyond G42-G44 was needed by that measurement.
A separate comparison selected the three killed variants against those same
712 calls: :36 changed both sparse-setup calls from NAMED to RAW TypeError;
:59 accepted both the fresh priority object and tagged secondary object; :162
accepted the partial-marker fresh state. Changed-call counts were 2, 2 and 1.
Only variant selection and the evidence output filename changed for that run.

G40's tripwire isolates the id shape and leaves G20's null exercise unchanged.
G40-G41 scratch guards are evidence only. No V8 error message text is asserted.
No protected input, auth file, package runner, receipt or sealed artifact was
used. All fixtures are synthetic. No plan-edit cell was run this continuation.
Changes remain uncommitted for PM4 and independent Claude review. No new linux,
GitHub CI or host-reachability result is claimed.

### Final required bar

Environment set on separate PowerShell lines before tests:

```powershell
$env:MEASURED_TEST_NOW='2026-09-03'
$env:TZ='America/New_York'
```

Executable: `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
(v24.19.0). The final local command and measured output are pasted below.

```text
--test rebuild/lanes/d/f2/projector.test.mjs rebuild/lanes/d/f2/guard-coverage.test.mjs
tests 74
pass 74
fail 0
cancelled 0
skipped 0
todo 0
exit 0
```

Summary values are pasted from the spec reporter with its non-ASCII prefix
glyph omitted.

PRIOR SANDBOX MEASUREMENT, at the previous round's bytes: these exact paths
measured **90 tests, 88 pass, 2 fail, exit 1**:

```text
--test rebuild/lanes/d/plan-edit/model.test.cjs rebuild/lanes/d/plan-edit/durable-host.test.mjs rebuild/lanes/d/plan-edit/browser-build.test.mjs rebuild/lanes/d/plan-edit/client-p6.test.cjs
```

The failing rows were PE-build actual plan-edit host builds with the unchanged
browser crypto boundary, and PE-build a new Node crypto importer is refused by
the same browser boundary. Both reported esbuild's
`Cannot read directory "../../../..": Access is denied.` before the intended
browser assertions could complete; the negative control did not receive its
expected crypto-boundary diagnostic. That sandbox result remains 88 of 90.

PM4'S RERUN, reported in this assignment: on the same PC outside the sandbox,
at the previous round's same bytes, the same four paths measured **90 tests,
90 pass, 0 fail**; the two F2 cells measured **71 tests, 71 pass, 0 fail**.
This is PM-provided evidence, not a new local execution. The prior request for
that external rerun is satisfied by the reported result. The current local
F2 result above covers the three newly added rows; plan-edit was not rerun.

Both protected hashes were measured by certutil before edits and after the
final test run. The before values were the two hashes pasted below; compare
them with the final output to verify byte identity.

```text
certutil -hashfile rebuild/m4/workout/setup-tags.cjs SHA256
SHA256 hash of rebuild/m4/workout/setup-tags.cjs:
d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d
CertUtil: -hashfile command completed successfully.

certutil -hashfile rebuild/lanes/d/f2/projector.test.mjs SHA256
SHA256 hash of rebuild/lanes/d/f2/projector.test.mjs:
f74bbe5f40624237a4d24536b3ead036a75ed3bc705a52d6e55032d28bdf8dd6
CertUtil: -hashfile command completed successfully.
```

### Scratch custody and final scope

The previous round's failed cleanup is historical and was not retried. Its
remaining paths, as reported then, are:

```text
C:\Users\joeym\AppData\Local\Temp\earned-astra-f2-07a69e8045cf4abcb8f2177b38f037da
C:\Users\joeym\AppData\Local\Temp\earned-astra-6\.tmp\plan-edit-browser-Kd8Ikq
C:\Users\joeym\AppData\Local\Temp\earned-astra-6\.tmp\plan-edit-browser-X8Mjjq
```

The old measure.cjs and corpus.cjs were read and copied into a new session-owned
scratch; no old scratch file was edited or deleted.

This continuation's cleanup was attempted once. Automatic approval review
rejected the path-checked recursive deletion before execution with "blocked by
policy"; no further reason was supplied. No retry was made. The session-owned
scratch remains, containing the seven public mirrored files and synthetic
measurement scripts/results:

```text
C:\Users\joeym\AppData\Local\Temp\earned-astra-f2-followup-9ab5dc1101ca46e0a2d3c3f22ec71ab3
```

At f4eed5fc only the three authorized tracked files differed. That workflow change was
71 to 74 in its two test-count occurrences, and forty-one to forty-four in its
cell count; all other workflow bytes compare unchanged. Every added line is
ASCII. git diff --check passed. The final git status --porcelain and git diff --stat are pasted below.

```text
git status --porcelain
 M .github/workflows/rebuild.yml
 M rebuild/lanes/d/F2-LAND-AUTHOR-REPORT.md
 M rebuild/lanes/d/f2/guard-coverage.test.mjs

git diff --stat
 .github/workflows/rebuild.yml              |   6 +-
 rebuild/lanes/d/F2-LAND-AUTHOR-REPORT.md   | 261 +++++++++++++++--------------
 rebuild/lanes/d/f2/guard-coverage.test.mjs |  41 +++++
 3 files changed, 177 insertions(+), 131 deletions(-)
```


## FOR THE S10 BRIEF: ONE NAMED DEBT

F2-GUARD-TERM-COVERAGE: eleven guard terms of setup-tags.cjs still have no
behavior row after five looks; section 7.5 lists each one. Four independent
looks found four, three, three and six outcome-changing survivors, each with
a method the look before it did not use. The history includes targeted term
removals, a separate differential corpus, a broader 712-call corpus and R4's
hand-aimed witnesses. A future edit of this module must therefore be reviewed
term by term and never trusted to this cell alone. Carry this as one debt in
S10; this closure does not commission a fifth survivor hunt or declare the
remaining terms redundant.

## Review R4: fixed

R4 B1 upheld. Every witness was reproduced on the original module and its
single-term scratch variant BEFORE its new row was written. Each original
call refused with code === message === SETUP_TAGS_INVALID. Each variant
accepted. Before the rows, both cells reported 74 tests / 73 pass / 1 fail,
G22 alone. After the rows, each of the six variants reports 81 tests / 79 pass /
2 fail: its named row alone among behavior rows, plus G22. The baseline is
81 tests / 81 pass / 0 fail, exit 0, on win32 Node v24.19.0.

| row | line and single term removed | measured witness and result |
|---|---|---|
| G45 | :18 keys.every(k => own(x, k)) | split.map keys a..g, seven U values: NAMED to true; G45 + G22 red. closed() serves eight call sites: :66, :79, :84, :89, :108, :119, :120, :141 |
| G46 | :41 !descriptor.enumerable in cloneData | own non-enumerable r4Hidden on state: NAMED to projection; value is smuggled-past-the-boundary, output enumerable:true; G46 + G22 red |
| G47 | :42 array index-key condition | priorities with slot 0 absent, slot 1 present and r4Junk property; own-key count exactly length + 1: NAMED to true; G47 + G22 red |
| G48 | :58 typeof a !== 'object' | identity-only taxonomy, stored volumeTags.regionsByMuscle:42 against {} through :154: NAMED to projection; G48 + G22 red |
| G49 | :58 typeof b !== 'object' | fresh state sets:{} against authored sets:2 through :158: NAMED to projection; G49 + G22 red |
| G50 | :118 !plain(snapshot) | text ids '0' and '1', tags array of two valid records: NAMED to true; G50 + G22 red |
| G51 | :27 string/boolean return; :38 array-length-key skip, separately | shipped taxonomy constructed inside the row, ordinary acceptance and frozen projection pass at baseline; each variant fails construction inside G51 and still stops projector.test.mjs at file scope |

The scratch variants use one asserted exact anchor each. G46 removes only
cloneData's enumerable term, leaving the separate :138 context check intact.
Neither protected file in the worktree was changed. The guard cell's shared
factory is deferred, so construction failures no longer prevent its rows from
registering; G51 deliberately constructs its OWN projector and catches no
failure as success. No existing assertion was weakened or skipped.

For BOTH :27 and :38, the complete two-cell run now prints:

```text
not ok 51 - F2-G51 the shipped taxonomy constructs a projector that accepts and projects
Got unwanted exception: the shipped taxonomy must construct inside this behaviour row
Actual message: "SETUP_TAGS_INVALID"
code: 'ERR_ASSERTION'
# tests 52
# pass 21
# fail 31
```

The other red behavior rows are G01-G12, G14, G16-G17, G20-G21, G23-G24,
G30-G31, G38-G41, G43-G44 and G48. Together with G51 that is 29 behavior
failures. G22 and the projector.test.mjs file-scope failure make 31. The file
failure is ERR_TEST_FAILURE with exitCode 1 and a SETUP_TAGS_INVALID stack.
These counts are measured, not an assertion that G51 fails alone.

G41's comment now states that RangeError is the engine stack limit, not a
module property, and that a larger stack can yield a named refusal. No G41
assertion changed. Section 12 item 4 now says not cloned and not frozen BY
THIS MODULE and includes the tagless validator's unconditional true return.
The historical workflow counts are corrected in sections 3 and 13.

The complete 141-variant rerun, the unchanged 712-call rerun, the 718-call
extension and the previous-seventeen comparison are recorded in 7.4. There
is no new survivor classification. The scratch generator also reran G35-G44's
prior witnesses/tripwires: each remained red alone among behavior rows, plus
G22, with 81/79/2. The retained source variants compare identically.

No plan-edit cells, package runner, seal/receipt generation, private fixture,
auth file or protected input was used. No module, projector cell, decision
file or lane status file was written. The three authorized tracked files
remain uncommitted for PM4 and the independent Claude review. Scratch evidence
is retained under .tmp/f2-r4-close; no cleanup was attempted in this round.

Added-line ASCII and the three-file fence were checked. The workflow roundtrip
comparison allows only 74 to 81 twice and forty-four to fifty-one once; all
other bytes match HEAD. git diff --check passed before the final bar.

### Final required bar, R4 closure

Environment set on separate PowerShell lines before the final test command:

```powershell
$env:MEASURED_TEST_NOW='2026-09-03'
$env:TZ='America/New_York'
& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test rebuild/lanes/d/f2/projector.test.mjs rebuild/lanes/d/f2/guard-coverage.test.mjs
```

```text
# tests 81
# pass 81
# fail 0
exit 0
```

certutil SHA256, after all mutations (identical to the before hashes):

```text
certutil -hashfile rebuild/m4/workout/setup-tags.cjs SHA256
SHA256 hash of rebuild/m4/workout/setup-tags.cjs:
d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d
CertUtil: -hashfile command completed successfully.

certutil -hashfile rebuild/lanes/d/f2/projector.test.mjs SHA256
SHA256 hash of rebuild/lanes/d/f2/projector.test.mjs:
f74bbe5f40624237a4d24536b3ead036a75ed3bc705a52d6e55032d28bdf8dd6
CertUtil: -hashfile command completed successfully.
```

The final git status --porcelain and git diff --stat are printed in the
execution transcript as the last two commands, after this report is written.
