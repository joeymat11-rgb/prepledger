# F2-LAND REVIEW R1: the exercise-tag projector lands on rebuild/d-f2-land

Independent reviewer, told to disagree. Branch `rebuild/d-f2-land` at
`fe3719dbb46e9f23bbfe32ae6b306f566e0506da`, cut from `b9d8d6454ef951bc24175bb04b05adadf263c7d6`.
The author is gone; this is the FIRST review this module's code has ever had.

Read in the farm (`/home/claude/farm/wt/rebuild__d-f2-land`, synced at review time to `fe3719db`).
Run on the PC (`%TEMP%\earned-f2land`, `git pull --ff-only`, working tree clean, nothing edited but
this file) and on linux (farm scratch worktrees `f2rev` at the pushed head, `f2rev-old` at
`f3e9561b`, `f2rev-tip` at the chain tip). No engine byte, no sealed byte and no cell was touched.

## VERDICT: ACCEPT WITH NOTES

The three landed commits stand. Every byte claim in the author report is true and I re-proved each
one myself: the module is the same Git BLOB as the old branch's and as the retired lane copy, the
fence holds, the bar is green on both operating systems, the CI step is in the one permitted place,
and the STOP on retirement (4) is correct and if anything understated. The 21 survivors in the
author's mutation table all reproduce exactly, and his hardest claim (that leaving three cells
behind costs this module no coverage) I confirmed independently against the full 79-cell suite.

The two BLOCKING items below are defects in the AUTHOR REPORT, not in the landed bytes. No landed
byte needs to change. They block S10 LIFTING the report's tables, because S10 is told to lift them
and one of them is wrong and one is incomplete.

## BLOCKING

### B1. The report's M24 row and its section 9 item 3 are FACTUALLY FALSE about the module

Section 7.3 says of `M24`: "`projectSetupTags(state, null)` does not refuse `SETUP_TAGS_INVALID`
today, it throws a raw `TypeError` from `getOwnPropertyDescriptor`". Section 9 repeats it as the
third thing the author would attack: "The module's contract is that a bad input refuses
`SETUP_TAGS_INVALID`. For a non-record context it does not."

MEASURED, real module, unmutated, linux scratch `f2rev` at the pushed head:

| call | result |
|---|---|
| `projectSetupTags({}, null)` | THREW `Error` `SETUP_TAGS_INVALID`, `code === message` |
| `projectSetupTags({}, undefined)` | same |
| `projectSetupTags({}, 'string')` | same |
| `projectSetupTags({}, 42)` | same |
| `projectSetupTags({}, [])` | same |

Line 136, `if (!plain(context)) fail();`, runs BEFORE the `getOwnPropertyDescriptor` at line 137.
The `TypeError` exists only in the MUTANT, which is what the sweep measured. The module's refusal
contract is intact for a non-record context. The report states the opposite in the two places a
reader of S10 is most likely to lift, and it is the one item the author flags as a defect. Correct
both before the table is carried.

### B2. "every guard clause and refusal mutated once" is not true, and one of the misses is real

The report's method claims the module was mutated "one guard clause or refusal at a time", 59 rows,
0 anchor misses. The anchors are honest, but in two places the author mutated a whole CLAUSE where
the clause has independent TERMS, and a killed clause hides an undriven term inside it. I added 16
reviewer mutants and found TWO more survivors the table does not list.

The serious one is `rebuild/m4/workout/setup-tags.cjs:149`, the term `seen.has(e.id)`. The author's
`M28` ("state row known and not duplicated") is reported KILLED by C17, but C17 kills it through the
`!ids.has(e.id)` half. Replace line 149 with `if (!plain(e) || !ids.has(e.id)) fail();` and:

- `projector.test.mjs` on this branch: 30 tests, 30 pass, **0 fail**.
- the FULL four-file suite on the old branch at `f3e9561b`: 79 tests, 79 pass, **0 fail**.

The guard is load-bearing. With it gone the module ACCEPTS a state whose `exercises` array holds
`x0` twice and has lost `x1` entirely, and returns a frozen, marked, projected programme for it
(measured: `ids = x0,x0`, `x1 present = false`). The length check at line 145 cannot see it, because
`out.exercises.length === ids.size` still holds. Nothing anywhere refuses the result.

This is a guard whose removal turns nothing red, which the ticket calls a BLOCKING finding, and it
is worse than the twelve the author discloses in 7.3 because the cell that appears to cover it does
not: `F2-02 missing, extra and duplicate setup identities refuse without mutation`
(`projector.test.mjs:157`) drives the duplicate on the SETUP side only
(`f.setup.exercises[1].id = f.setup.exercises[0].id`) and never on the STATE side. The title reads
as coverage that does not exist. A red-first cell is owed; by the ticket's own rule it is a separate
commit from the landing, and no byte of the module changes.

The second miss is benign and I record it only so the table is complete: line 85's term
`own(regions, tag.head)` can be deleted (leaving `regions[tag.head] === e.mg`) and nothing goes red
on either branch. That one IS redundant in the author's 7.2 sense, because a prototype-chain key
never resolves to the exercise's `mg`. Count is 14 undriven terms, not 12.

## NOTES

### N1. The absent-tags path is laxer than the rest of the module, and a cell PINS the laxity

`projectSetupTags` lines 136-139 return `state` BY REFERENCE the moment `context.tags` is absent,
null or undefined, before `closed(ctx, ['setup','tags','op_id','date'])` at line 141 ever runs.
`check()` line 114 does the same for the validator. MEASURED on the real module:

| call | result |
|---|---|
| `validateSetupTags(undefined, undefined)` | returns `true` |
| `validateSetupTags({not:'a setup'}, null)` | returns `true` |
| `projectSetupTags('a string state', {tags:null})` | returns the string `'a string state'` |
| `projectSetupTags({a:1}, {setup:{}, tags:null, op_id:'', date:'nonsense', junk:1})` | returns `{a:1}` unchanged |
| `projectSetupTags(st, {tags:undefined}) === st` | `true`, and the result is NOT frozen |

I do NOT call this a contradiction of the accepted brief, so no STOP is raised. Brief section 3.2
says "With absent/null snapshot, return the constructor state unchanged" and the implementation
disclosure at line 111 says "Null/absent tags return the original state", both without qualifier.
Section 3.6's "refuse a conflicting provenance context with a named error" is about re-projecting a
different provenance over already-tagged data, and the module DOES refuse that (line 154, measured:
same document with `op_id:'op-2'` refuses).

It is still the semantic Edit My Week's host has to classify, and it is now PINNED:
`projector.test.mjs:69` asserts `projectSetupTags(f.state, { tags })` returns `f.state` itself with
a one-key context, so a later tightening would red a landed cell. The report does not mention any of
this. The PM should rule it intended and let S10 pin it by name, or route a red-first cell.

### N2. The "expected named refusal" in the ticket and in section 5 misreads DECISIONS:474

The ticket and the report both expect `b-package.cjs --ci` to name a refusal for an undeclared
runtime file, citing `DECISIONS:474`. `:474` records the opposite: "b-package --ci --package S5
EXIT 0 (**0 unlisted drift**) because the runtime files are new and undeclared".

Read in the runner, `rebuild/lanes/b/tooling/b-package.cjs:2005`: the unlisted-source-change check
diffs only `rebuild/engine`, `rebuild/conform`, `rebuild/m4/spec` and the tooling directory.
`rebuild/m4/workout/setup-tags.cjs` is in none of them and is not in S8's 224-file product
inventory, so `UNLISTED-SOURCE-CHANGE` can never fire for it.

What WILL fire once a head contains the chain tip is a different and real refusal, and it is about
the workflow, not the module. S8 declares `.github/workflows/rebuild.yml` role `edited`, pre
`afce33cf1925...`, post `8403d10b1a54...`. This branch's file is `2b91dafe7d61...`, which is neither,
so `:1969` buckets it as drift and `:1972` asserts
`UNLISTED-PRODUCT-DRIFT .github/workflows/rebuild.yml`.

I could not EXECUTE that: on the PC the seal-base refusal fires first (below), and a farm scratch
built at the chain tip with this branch's four files refuses earlier still with
`B PACKAGE S8 FAIL WORKTREE-SOURCE-PIN`. The above is read from the runner's source, not run. It is
a better answer than "UNMEASURED" and it changes the S10 instruction: the duty is to DECLARE, and
the declaration S10 owes for the workflow is the one that is currently failing, not one about
`setup-tags.cjs`.

### N3. The S10 declaration table for a LATER retirement is missing three accepted acceptance specs

Section 6.1's second table is otherwise accurate and every pre sha256 in it verifies from Git. It
omits three files that name `rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` and would have to move
with it: `rebuild/m4/spec/acceptance-s6-today-child.json:376`,
`rebuild/m4/spec/acceptance-s7-port-admission.json:421` and
`rebuild/m4/spec/acceptance-s8-real-shape.json:421`. That is three ACCEPTED artifacts on top of the
three packages, three receipts and one sealed brief the author already names, and it makes the STOP
on (4) more obviously right, not less.

### N4. Landing a fourth file into `rebuild/m4/workout/` is what S10 must supersede, by name

S6 law 17 is "The `m4/workout` class is closed", carried by S7 and S8
(`rebuild/lanes/b/S6-TODAY-CHILD-BRIEF.md:139`, section 2.5 at `:27`). This landing makes the class
four files. I searched and found NO cell that enumerates the directory, so nothing reds today; the
law is enforced by declaration alone. The report's 6.1 row says "declared in: nowhere yet", which is
true but does not name the law. S10 should supersede law 17 explicitly rather than only adding a
product row.

### N5. Two normalization facts about the module that no cell pins

Both measured on the real module; neither is a defect and neither needs a byte to change.

- `{mg:'biceps', lend:0.5, head:'biceps'}` is ACCEPTED as a helper (line 92 only asks
  `regions[helper.head] === helper.mg`, true for the identity regions). So one credit has two
  byte-different encodings. Consequence, measured: project the plain form, rewrite the stored
  `secondary` into the redundant form, re-project the SAME context, and line 155's `equal()` refuses
  `SETUP_TAGS_INVALID`. Duplicate detection does catch the two forms against each other.
- `projectNewExerciseTags` performs NO uniqueness check and cannot: the module has no view of the
  document. Measured: given `id:'x0'` while `x0` already exists in the setup it returns a fully
  minted, frozen, marked exercise. The collision only surfaces later, at `projectSetupTags` line
  149 (the guard of B2). The uniqueness duty sits in the plan-edit caller, and EW2 should be told so
  by name.

### N6. Small report inaccuracies

- Section 4's `git diff --numstat` box shows three rows and says "Three files". Measured on the PC at
  `fe3719db` it is FOUR: the box was taken before commit 4/4 added
  `rebuild/lanes/d/F2-LAND-AUTHOR-REPORT.md` (`423  0`). All four are additions, zero deletions.
- Section 2 says `mutants.cjs` is "driven only by `heads.test.mjs` and `product-fixture.cjs`". It is
  driven by the cells; `product-fixture.cjs` is a fixture, not a driver. Cosmetic.

## WHAT I TRIED TO BREAK AND COULD NOT

**Byte identity.** Not by sha256 alone: the landed file, `f3e9561b:rebuild/m4/workout/setup-tags.cjs`
and `b9d8d645:rebuild/lanes/d/plan-edit/f2-tag-adapter.cjs` are ONE Git blob,
`68fdc6b6710b9bcbb1c464a3f732540fa4d6de6d`, sha256 `d0436809e9e51b5072ed5c1db46eb31bfc2f58294706c6037c980575631fc94d`,
198 lines. The landed cell is `f3e9561b`'s blob too. Every sha256 in every table of the report
(section 1, 6.1 both tables, including all seven retirement pre-images) reproduces exactly from Git.

**The bar, re-run by me on the PC** (`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, node
from the codex runtime, `%TEMP%\f2l-bar.log`):

| what | measured | exit |
|---|---|---|
| `node --test rebuild/lanes/d/f2/projector.test.mjs` | 30 tests / 30 pass / 0 fail | 0 |
| the whole `D - plan edit` step, the exact command at `rebuild.yml:269` | 130 tests / 130 pass / 0 fail | 0 |
| `rebuild/lanes/d/plan-edit` alone | 90 tests / 90 pass / 0 fail | 0 |
| `node rebuild/lanes/b/tooling/b-package.cjs --ci --package S8` | `B PACKAGE S8 FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP; required evidence missing or failed; local diagnostics withheld` | 1 |

The `d-plan-edit` needle `# pass 90` holds unchanged, as it must: this branch adds files and edits
none, and (4) is a STOP. On linux at the pushed head the landed cell is 30 / 30 / 0 as well.

**The fence.** `git diff --numstat b9d8d645 HEAD` on the PC is four files, `16 0` rebuild.yml,
`423 0` the author report, `382 0` the cell, `198 0` the module, zero deletions anywhere.
`git diff --name-only b9d8d645 HEAD -- rebuild/engine rebuild/m3 rebuild/coach rebuild/client`
prints NOTHING. Not one byte under `rebuild/engine` moved.

**The CI step.** The rebuild.yml diff is a single hunk at `@@ -267,6`, sixteen added lines and zero
removed, sitting directly after the `D - plan edit` step's `run:` line. One cell, named by exact
path, never globbed. The regions after `:232`, `:297` and `:306` are untouched.

**The cells left behind.** Re-measured by me on the tip plus the module, one file at a time:
`composition.test.mjs` 4 / 0 / 4, `heads.test.mjs` 25 / 0 / 25, `engine.test.cjs` 20 / 3 / 17, which
is the author's table exactly. I classified the failures myself:
`CLEAN_INIT_SPLIT_REQUIRED` in 4 + 9 + 1 of them (the F1 full-body `F` day kind that the tip's
`athlete-state.cjs` does not carry), and the rest `missing credited bucket: delts_front` x12,
`lower_back` x2, `delts_side` x1, `delts_rear` x1 and `missing volume row: biceps` (the unlanded
volume half). Both are engine or m4 bytes. The full four-file suite on the old branch is 79 / 79 / 0.

**The claim that leaving them behind costs nothing.** This is the author's load-bearing claim and I
tried hardest here. I ran all 21 of his survivors PLUS my 16 reviewer mutants against the FULL
four-file suite at `f3e9561b` with the volume half present. Every single survivor still survives
there: 79 / 79 / 0 for all 21, and for both of my new ones. The three left-behind cells kill zero
mutants of this module that the landed cell does not already kill. The claim holds, and the author
was right to warn in section 9 that it is a claim about THIS FILE only.

**The refusal vocabulary.** Exactly one named refusal exists. Fed an exercise id `<script>x</script>`
and head `EVIL_HEAD`, the thrown error's message is the literal `SETUP_TAGS_INVALID`, its `code` is
the same string, and its only own key is `code`. No caller text is interpolated anywhere.

**Prototype safety.** An exercise id of `__proto__` validates and projects; afterwards
`Object.prototype.volumeTags` and `Object.prototype.head` are both `undefined`. `cloneData` writes
every key with `Object.defineProperty` and every lookup is `Object.hasOwn`. No cell proves this.

**Getters.** A `state.exercises` accessor refuses `SETUP_TAGS_INVALID` with ZERO getter invocations
(measured with a counter): `cloneData` checks descriptors before it reads values. A `context.tags`
accessor refuses at line 137-138. No cell proves the state-side one.

**Determinism and the STOP conditions.** All four functions Edit My Week needs
(`createSetupTagProjector`, `validateExerciseTags`, `projectSetupTags`, `projectNewExerciseTags`)
are exported and all four are exercised green by the landed cell WITHOUT the volume half, so the
ticket's STOP does not trigger. I found no behaviour of the module that contradicts
BRIEF-F2-TAG-PROJECTION-v1.0, no need for an engine byte, and no file outside the owned list.

**The STOP on (4).** Correct, and understated. `grep` for `f2-tag-adapter` across `rebuild/` and
`.github/` on the tip returns five requiring sites plus a codemod string, three seal packages, three
receipts, three acceptance specs, a sealed brief and two accepted review documents. Far more than
the three files the ticket allows.

## WHAT I DID NOT VERIFY

- I did not run `b-package.cjs --full`, did not seal, did not write a receipt or an artifact, and did
  not use the seal generator on `rebuild/b-seal-gen`.
- `UNLISTED-PRODUCT-DRIFT` on the workflow (N2) is READ FROM THE RUNNER'S SOURCE, not executed. Two
  earlier refusals stand in front of it on every head available to me.
- I did not assess the volume half, `rebuild/engine/volume.cjs`, `writers.cjs` or the old branch's
  `athlete-state.cjs`. Nothing here says any of it is ready.
- I did not re-run the twelve uncovered terms of section 7.3 one by one against Edit My Week's
  actual door; whether any is reachable with athlete data is still the open question the author
  names, and B2 adds a thirteenth that matters more than most of them.
- I did not run the Windows CI job; GitHub CI on this branch will show nothing, because the
  seal-base step refuses first and every later step is skipped (`DECISIONS:554`). The both-OS
  evidence for the landed cell is the PC run and the linux scratch run recorded above.
- I did not open the private census, the protected soak, `rebuild/conform/private`, `src/history.js`
  or any `ledger/` directory, on either machine. Every fixture I used is synthetic.
- My probe scripts live in farm scratch worktrees `f2rev`, `f2rev-old` and `f2rev-tip`
  (`rev-atk1.mjs`, `rev-atk2.mjs`, `rev-atk3.mjs`, `rev-mut.mjs`, `rev-mutants.mjs`). Nothing in a
  farm scratch is pushed, and each mutated module was restored and re-compared byte for byte.
