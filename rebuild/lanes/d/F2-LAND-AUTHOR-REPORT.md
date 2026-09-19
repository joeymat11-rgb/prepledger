# F2-LAND AUTHOR REPORT: the exercise-tag projector reaches a branch S10 can carry

Lane D. Branch `rebuild/d-f2-land`, cut from `b9d8d645`. Author: cowork (Earned lane hand).
This report is a HYPOTHESIS. The reviewer is told to disagree wherever the evidence lets him.

Scope ruled by the PM (`DECISIONS:557`): THE TAG HALF ONLY. NO ENGINE BYTE MOVES.

## 0. HEADLINE

Three commits land the module, one cell and one CI step. **The fourth commit, retiring the
lane copy, is NOT made: it disturbs far more than the three files the ticket names, so the
ticket's own STOP applies and section 6 hands the PM the measurement and the routing table.**

## 1. WHAT LANDED

| path | role | sha256 | lines |
|---|---|---|---|
| `rebuild/m4/workout/setup-tags.cjs` | NEW runtime (product, role `new`) | `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` | 198 |
| `rebuild/lanes/d/f2/projector.test.mjs` | NEW cell (test) | `f74bbe5f40624237a4d24536b3ead036a75ed3bc705a52d6e55032d28bdf8dd6` | 382 |
| `.github/workflows/rebuild.yml` | EDITED, one step, +16/-0 | `2b91dafe7d6151b8efa3739d05d23af736c27e74d99b48d1db2576dae15234dd` | +16 |

BYTE-IDENTICAL, proved three ways rather than claimed. `git show f3e9561b:` was the transport,
so the bytes were never retyped:

- sha256 of the landed module `d0436809e9e5...`, 11093 bytes, equal to the sha256 of
  `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` on the tip, byte for byte.
- `git hash-object` of the landed file is `68fdc6b6710b9bcbb1c464a3f732540fa4d6de6d`, which is
  also `git rev-parse f3e9561b:rebuild/m4/workout/setup-tags.cjs` AND
  `git rev-parse b9d8d645:rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs`. One blob, three names.
- The landed cell is the same blob as `f3e9561b:rebuild/lanes/d/f2/projector.test.mjs`,
  `cd4f4b29e1d15c09816c7ec0ebec379c159afce2`.

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
| `product-fixture.cjs` | not a cell | not landed, only the three above use it |
| `mutants.cjs` | not a cell | not landed, only the three above use it |

The four files together are the spike's 79, re-measured on the old branch in the farm at
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
than being carved out of their file.

**NOTHING WAS LOST BY LEAVING THEM.** Section 5 measures it: every one of the 21 mutants of
`setup-tags.cjs` that `projector.test.mjs` fails to kill ALSO survives the full four-file suite
on the old branch. The three left-behind cells kill ZERO mutants of this module that the landed
cell does not already kill.

## 3. THE CI STEP

ONE step, inserted directly after the `D - plan edit` step's `run:` line, and nowhere else. The
regions after `:232`, `:297` and `:306` are other lanes' and were not touched.

```
      - name: D - the exercise-tag projector, its taxonomy and its new-exercise binding
        run: node --test rebuild/lanes/d/f2/projector.test.mjs
```

Named by exact path, never globbed. The comment above it records the three F2 cell files that
are deliberately absent and why, so a file with no CI home is still a file somebody decided
about (`DECISIONS:186 (3)`).

## 4. THE BAR, ON BOTH OPERATING SYSTEMS

PC (win32, `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`), and linux (a farm scratch
worktree cut from the PUSHED head `38b51635`, whose three file sha256s were re-checked against
the PC's and are identical).

| what | before, at `b9d8d645` | after, at `38b51635` |
|---|---|---|
| the landed cell, win32 | did not exist | **30 tests / 30 pass / 0 fail, exit 0** |
| the landed cell, linux | did not exist | **30 tests / 30 pass / 0 fail, exit 0** |
| the whole `D - plan edit` step (`rebuild.yml:269`), win32 | 130 / 130 / 0, exit 0 | **130 / 130 / 0, exit 0** |
| `rebuild/lanes/d/plan-edit` alone, win32 | 90 / 90 / 0, exit 0 | **90 / 90 / 0, exit 0** |
| `rebuild/lanes/d/plan-edit` alone, linux | not run | **90 / 90 / 0, exit 0** |

The plan-edit needle S8's `d-plan-edit` child pins, `# pass 90`, is unchanged on both machines.
It could hardly be otherwise: this branch adds files and edits none, and section 6 is a STOP.

ONE LINUX DIFFERENCE, REPORTED RATHER THAN HIDDEN. The whole `D - plan edit` step is 130/130 on
the PC and 100 tests / 96 pass / 4 fail in the farm. The four are
`import-retract/retract.test.mjs`, `p3-capture-start/capture-start.test.mjs`,
`p3-followons/admission-swap.test.mjs` and `p3-replay-measure/measure-order.test.mjs`, and the
error is `port.cjs did not seal the invented bundle (status 2)`. FARM.md says it outright: a
suite that seals a bundle through the real port cannot run in the farm, its oracle files being
outside the include list. This is an environment absence, not a regression, and it is identical
before and after. The bar of record is the PC, where the step is 130/130.

CUSTODY, proved with `git diff --numstat b9d8d645 HEAD`:

```
16	0	.github/workflows/rebuild.yml
382	0	rebuild/lanes/d/f2/projector.test.mjs
198	0	rebuild/m4/workout/setup-tags.cjs
```

Three files, all additions, zero deletions. `git diff --name-only b9d8d645 HEAD -- rebuild/engine
rebuild/m3 rebuild/coach rebuild/client` prints NOTHING.

## 5. WHAT `b-package.cjs --ci --package S8` PRINTS, BEFORE AND AFTER

Run on the PC, `node rebuild/lanes/b/tooling/b-package.cjs --ci --package S8`, the exact command
at `rebuild.yml:150`. Never `--full`; nothing sealed, no receipt, no artifact written.

| where | exit | last line |
|---|---|---|
| BEFORE, a detached worktree at `b9d8d645` (removed again) | **1** | `B PACKAGE S8 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP; required evidence missing or failed; local diagnostics withheld` |
| AFTER, this branch at `38b51635` | **1** | the same line, byte for byte |

**THE NAMED REFUSAL IS NOT THE ONE THE TICKET EXPECTED, AND THE DIFFERENCE MATTERS.** The ticket
anticipated the undeclared-runtime-file drift that `DECISIONS:474` records for the plan-edit
runtime. That check is NEVER REACHED. `SEAL-BASE-IS-NOT-THE-CHAIN-TIP` fires first, and it fires
on the untouched base too, so this branch changes the answer not at all.

The cause is measured and it is `DECISIONS:554`'s CI fact, now true of this lane. The chain tip
moved while this ticket was being worked: `rebuild/t2-client-core` is `904d475b`, not the
`b9d8d645` the worktree was cut from. The only file that moved between them is
`rebuild/DECISIONS.md` (`:557`, which dispatched this lane, and `:558`), so NOTHING in this
branch's content is stale. But `b-package` binds the seal base to the chain tip, so it refuses
first, and on GitHub every later step of `rebuild-public` is SKIPPED. **The new CI step of
section 3 will therefore show no green in Actions on this branch: its both-OS evidence is the
two runs in section 4 until an integrator merges the tip forward.** Nothing here can fix that
from inside the lane, and rebasing is forbidden.

So the one question this run cannot answer, and the reviewer should not let it pass as answered:
whether `--ci` reports drift for `rebuild/m4/workout/setup-tags.cjs` as an undeclared runtime
file. It is the expected state by `:474`'s precedent, and it is UNMEASURED here.

## 6. THE RETIREMENT OF THE LANE COPY: STOPPED, AND WHY

The ticket says: if retiring the copy disturbs more than `f2-tag-adapter.cjs`, the PE16
`f2-adapter-identity` cell, and `tagSource()` / `PE_F2_PUBLIC_REF` in `durable-host.test.mjs`,
then STOP after (3), report, and leave it for the PM to route. **It disturbs a great deal more,
so the retirement is not in this branch and no sealed byte moved.**

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
| `.github/workflows/rebuild.yml` | `8403d10b1a54d721a17e92cc0c2eb7fe119379b65cc4ba9625e6a7196ad9d532` | `2b91dafe7d6151b8efa3739d05d23af736c27e74d99b48d1db2576dae15234dd` | **product, `edited`** | S6, S7, S8 (`edited`); S8's declared post is the pre above |

NEEDLES: none of this branch's commits changes one. `d-plan-edit` stays `# pass 90`, measured
on both machines in section 4. A new child for the F2 step would need its own needle, and
`node --test rebuild/lanes/d/f2/projector.test.mjs` prints `# pass 30`.

What a LATER retirement would have to declare, with the pre sha256 of every path it touches and
the seal child that holds each one today. This branch moves NONE of them; the table exists so
the PM can route the work without re-measuring:

| path | pre sha256 | held by | what the retirement does to it |
|---|---|---|---|
| `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` | `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d` | S6 `pinned-unchanged`, S7 `carried`, S8 `carried` | DELETED |
| `rebuild/lanes/d/plan-edit/durable-host.test.mjs` | `e986c046bb675309eabef894706353979c5ee9e51d58bf67b5829593ea068b63` | S6 `pinned-unchanged`, S7 `carried`, S8 `carried` | `tagSource()`, the `PE_F2_PUBLIC_REF` allowlist and two now-dead imports retired |
| `rebuild/lanes/d/plan-edit/model.test.cjs` | `afb88e790020cc1140914c1a16eeda009b38cab7cf6dda9561cc5eaf8ea9a275` | S6, S7, S8 (S8 `edited`) | `:20` default re-pointed; PE16 `f2-adapter-identity` re-pointed or retired |
| `rebuild/lanes/d/plan-edit/astra-rerun.mjs` | `bf2c93abf01d1abee3ef38cfaab4b1ff8f4482779c00287078e52a231ffda737` | not declared in S6/S7/S8 | codemod target string re-pointed |
| `rebuild/lanes/d/p3-real-shape/real-shape-support.mjs` | `7c27dad17968b9c1d98f5f6943e4e63549c279b4add4cd7eb0979796387d5bf1` | S8 `new` | `:300` require re-pointed; five cells ride on it |
| `rebuild/lanes/d/p3-real-shape/real-shape-capture.test.mjs` | `ade7312b59412bf2532e565bf8c17de721ff9c49cea9fd8336aa512c54ec47c7` | S8 `new` | `:155` require re-pointed |
| `rebuild/lanes/d/p3-port-fix/owner-route.test.mjs` | `08f9a5fbcb4d83d70c807422578986b751b74bdce849eb046b84157e641bb383` | S7 `new`, S8 `edited` | `:68` require re-pointed |
| `rebuild/lanes/b/tooling/packages/S6.json`, `S7.json`, `S8.json` | three seal packages | themselves | each names the deleted path with its sha256 |
| `rebuild/lanes/b/tooling/receipts/S6.json`, `S7.json`, `S8.json` | three receipts | themselves | each records `d0436809e9e5...` for the deleted path |
| `rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md` | a sealed brief | S6 | `2.5` and law `17` name the path and its `pinned-unchanged` role in prose |

The last three rows are why this is the PM's to route and not a lane hand's: retiring the copy
edits accepted seal packages, their receipts and a sealed brief's text, across three children
and three CI steps two other lanes hold.

### 6.2 A NOTE THE REVIEWER SHOULD TEST RATHER THAN TRUST

`model.test.cjs:20` already reads `process.env.PLAN_EDIT_F2_MODULE || './f2-tag-adapter.cjs'`.
A retirement could therefore be done in two moves rather than one: first re-point every importer
at `rebuild/m4/workout/setup-tags.cjs` while the copy stays, which makes every one of the nine
cell files above green against the REAL module and costs the seal packages nothing but three
`edited` roles; only then delete the copy, which is a one-line diff in three packages, three
receipts and one brief. That is a proposal, it is UNMEASURED, and it is the PM's to rule.

## 7. THE MUTATION TABLE OVER `setup-tags.cjs` ITSELF

The old branch's `mutants.cjs` is a start and not the answer: it carries 8 mutants and it is
driven only by `heads.test.mjs` and `product-fixture.cjs`, both of which stayed behind. So the
module was mutated from scratch, one guard clause or refusal at a time.

METHOD, reproducible by anyone. A farm scratch worktree at the chain tip with the module and the
cell landed. For each row, ONE exact string replacement disables ONE guard term (typically
`if (<condition>) fail();` becomes `if (false) fail();`), the mutated file is written to disk,
`node --test rebuild/lanes/d/f2/projector.test.mjs` runs, the failing test titles are recorded,
and the original bytes are restored. The module's sha256 was `d0436809e9e5...` before the sweep
and `d0436809e9e5...` after it. The anchor of every row was checked to occur exactly once, so no
row silently mutated nothing: 0 anchor misses in 59 rows.

**RESULT: 59 mutants, 38 KILLED, 21 survive. Of the 21, nine survive because a SECOND guard in
the same module refuses the same input (proved by disabling both, section 7.2), and twelve are
guard terms that NO CELL ANYWHERE DRIVES, on this branch or on the old one (section 7.3).**

Killing cells, keyed:

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

### 7.1 EVERY GUARD, MUTATED ONCE

| # | guard or refusal mutated | result | goes red |
|---|---|---|---|
| `M01` | cloneData non-JSON scalar / cycle | KILLED | C01 |
| `M01b` | cloneData cycle term only | KILLED | C01 |
| `M02` | cloneData custom prototype | KILLED | C01 |
| `M03` | cloneData array extra own keys | survives (redundant guard) | none |
| `M04` | cloneData symbol key | KILLED | C02 |
| `M05` | cloneData getter / non-enumerable | survives (redundant guard) | none |
| `M05b` | cloneData non-enumerable term only | survives (redundant guard) | none |
| `M06` | cloneData array hole / index shape | survives (redundant guard) | none |
| `M07` | cloneData finite-number gate | KILLED | C03 |
| `M08` | factory config closed | KILLED | C04 |
| `M09` | factory muscle list shape and uniqueness | survives (UNCOVERED) | none |
| `M09b` | factory muscle uniqueness term only | survives (UNCOVERED) | none |
| `M10` | factory region vocabulary | KILLED | C04 |
| `M11` | exercise row shape | KILLED | C05 |
| `M11b` | exercise mg / day vocabulary | KILLED | C06 |
| `M11c` | exercise sets / hi / inc bounds | survives (UNCOVERED) | none |
| `M11d` | exercise steps strictly ascending positives | survives (UNCOVERED) | none |
| `M12` | tag closed / secondary array | KILLED | C02 |
| `M13` | tag head compatibility with mg | KILLED | C06 |
| `M14` | helper tuple closed / mg known | KILLED | C07 C03 C02 C08 |
| `M15` | helper lend finite fraction in (0,1] | KILLED | C03 |
| `M16` | helper explicit head compatibility | KILLED | C07 C09 |
| `M17` | effective helper target duplicate / self-credit | KILLED | C10 C03 C11 |
| `M17b` | coarse-primary regional overlap term only | KILLED | C10 C11 |
| `M18` | new-exercise context closed / op_id / date | KILLED | C12 |
| `M19` | absent snapshot returns null (identity branch) | KILLED | C13 |
| `M20` | setup document shape | survives (UNCOVERED) | none |
| `M21` | split shape and weekday vocabulary | survives (UNCOVERED) | none |
| `M22` | duplicate id / missing snapshot entry | survives (redundant guard) | none |
| `M22b` | missing snapshot entry term only | survives (redundant guard) | none |
| `M23` | extra snapshot entry | KILLED | C14 |
| `M24` | context must be a plain record | survives (UNCOVERED) | none |
| `M25` | tags descriptor must be a data member | KILLED | C15 |
| `M26` | projection context closed / op_id / date | KILLED | C16 |
| `M27` | state identity agrees with source | KILLED | C17 |
| `M28` | state row known and not duplicated | KILLED | C17 |
| `M29` | state row mg / day agree with the authored row | survives (redundant guard) | none |
| `M30` | re-projection marker and snapshot equality | KILLED | C18 |
| `M31` | first enrichment row purity | KILLED | C17 C19 |
| `M32` | partial marker set refuses | survives (redundant guard) | none |
| `M33` | array history present and empty before tagging | KILLED | C19 |
| `M34` | map history present and empty before tagging | KILLED | C19 |
| `M35` | sleep present and empty before tagging | KILLED | C19 |
| `M36` | untagged split / priorities / exOrder equality | KILLED | C17 |
| `M37` | history dated on or after the setup day | KILLED | C20 |
| `M37b` | history date calendar validity term only | survives (UNCOVERED) | none |
| `M38` | reads rows are plain records | survives (UNCOVERED) | none |
| `M39` | sleep night rows are plain records | survives (UNCOVERED) | none |
| `M40` | session log record shape and known ids | KILLED | C20 |
| `M41` | workout facts profile and session list | survives (UNCOVERED) | none |
| `M42` | workout fact session shape | survives (UNCOVERED) | none |
| `M43` | day() calendar round trip | KILLED | C16 C12 |
| `M44` | text() non-empty trimmed string | KILLED | C16 C12 |
| `M45` | closed() exact key count | KILLED | C07 C02 C16 C04 C05 C12 |
| `M46` | plain() prototype allowlist | KILLED | C01 |
| `M47` | freeze() deep freeze of the projection | KILLED | C21 C22 C23 C24 C25 |
| `M48` | equal() key-count agreement | KILLED | C18 |
| `M49` | regionsByMuscle excludes the muscle itself | KILLED | C21 C26 |
| `M50` | projector taxonomy snapshot freeze | survives (redundant guard) | none |

### 7.2 THE NINE THAT SURVIVE BECAUSE ANOTHER GUARD CATCHES THE SAME INPUT

A surviving mutant is only interesting once you know WHY. Each pair below was disabled TOGETHER
and the cell then went red, which proves the survivor is a second line of defence and not an
uncovered rule. Seven double-mutants, all killed:

| survivor | the guard that covers it | double mutant | tests red |
|---|---|---|---|
| `M03` array extra own keys | `M06` array index shape | KILLED | 1 |
| `M05` descriptor is a data member | `M01` cloneData rejects `undefined` | KILLED | 1 |
| `M05b` non-enumerable term | `M45` `closed()` exact key count | KILLED | 6 |
| `M22` duplicate id / missing entry | `M23` extra snapshot entry | KILLED | 1 |
| `M29` state row mg / day | `M31` first enrichment row purity | KILLED | 2 |
| `M32` partial marker set | `M31` first enrichment row purity | KILLED | 3 |
| `M50` taxonomy snapshot freeze | `M47` deep freeze of the projection | KILLED | 5 |

`M06` and `M22b` are the mirror halves of `M03` and `M22` and are redundant for the same reason.

### 7.3 THE TWELVE GUARD TERMS NO CELL DRIVES, HERE OR ON THE OLD BRANCH

This is the finding the reviewer should start from, and it is a fact about the ORIGINAL suite,
not about the landing. Each of the twelve was re-run against the FULL four-file suite on the old
branch (79 cells, green at `f3e9561b`) with the volume half present. **All twelve still survive.
The whole F2 suite kills zero of them.**

| # | the rule nothing proves |
|---|---|
| `M09` / `M09b` | the injected taxonomy's `muscles` must be a non-empty array of non-empty strings with no duplicate. A duplicate is only ever caught today because the region map happens to disagree as well |
| `M11c` | an exercise's `sets` and `hi` must be positive safe integers and `inc` a positive number. No cell feeds a zero, a negative or a fractional set count through `validateExerciseTags` |
| `M11d` | `steps` must be strictly ascending positive numbers |
| `M20` | the setup document must be closed over exactly `athlete_label`, `split`, `exercises`, `priority_muscles`, with a non-empty exercise list and text priorities |
| `M21` | the setup's `split` must be `{from, map}` with a real day and all seven weekdays drawn from `U`, `L`, `F`, `REST`. A malformed SOURCE split is never driven; the cells only mutate the STATE's split |
| `M24` | the projection context must be a plain record. `projectSetupTags(state, null)` does not refuse `SETUP_TAGS_INVALID` today, it throws a raw `TypeError` from `getOwnPropertyDescriptor` |
| `M37b` | a history date must be a real calendar day before it is compared with the setup date. With the term gone, a malformed date string is compared lexically and can pass |
| `M38` | `reads` rows must be plain records |
| `M39` | `sleep.nights` rows must be plain records |
| `M41` | `workoutFacts` must carry `earned/workout-facts/v1` and an array of sessions |
| `M42` | each workout fact session and its `effective` must be plain records |

None of these is a DEFECT: the guards are present and correct, and the module refuses. They are
twelve rules of a 198-line runtime file that 79 cells never exercise, in a module whose code no
reviewer has ever read (`DECISIONS:155` and `:174` accepted its BRIEF, nothing accepted its
code). `M24` is the one worth arguing about, because the refusal a caller sees for a non-record
context is a `TypeError` and not the module's own `SETUP_TAGS_INVALID`, which is a difference
Edit My Week's host would have to classify.

Nothing was changed to go green and no guard was weakened: the mutated bytes lived only in a
farm scratch worktree and the module's sha256 is the same before and after the sweep.

## 8. WHAT THIS LANE DID NOT DO, SO NOTHING BELOW IS CLAIMED

- No engine byte moved, no `rebuild/m3`, `rebuild/coach` or `rebuild/client` byte moved.
- The volume half was not landed and was not assessed. Nothing here says it is ready.
- `b-package.cjs --full` was never run, no seal, no receipt, no artifact. `--ci` only.
- The seal generator on `rebuild/b-seal-gen` was not used.
- No browser, no phone, no private census, no owner measurement. Every fixture is synthetic.
- `DECISIONS.md` and `rebuild/lanes/STATUS.md` were not written.
- Whether `--ci` would report the new runtime file as undeclared drift is UNMEASURED: the
  seal-base refusal fires first (section 5).
- The retirement of the lane copy is NOT done (section 6). Its two-move proposal in 6.2 is
  UNMEASURED.

## 9. FOR THE REVIEWER

Three things this author would attack first, in order:

1. Section 2's claim that leaving three cells behind costs nothing. It rests on a mutation
   comparison over `setup-tags.cjs` ALONE. The left-behind cells prove things about the ENGINE
   that no mutant of this module can reach; the claim is only that they add no coverage OF THIS
   FILE, and the reviewer should check that the claim is not quietly widened anywhere.
2. Section 7.3's twelve. If any of them is reachable from the Edit My Week door with athlete
   data, a red-first cell is owed before S10 carries this, and the fix would be a separate
   commit from the landing by the ticket's own rule.
3. `M24`. The module's contract is that a bad input refuses `SETUP_TAGS_INVALID`. For a
   non-record context it does not.
