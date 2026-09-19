# TODAY-SPLIT BUILD, PART 1 - INDEPENDENT REVIEW R1

Reviewer: cowork (Earned lane hand, independent reviewer). The author is gone and their claims
were treated as hypotheses. Head reviewed: `62e4931f859517793311c56ce923c0f1f409b148` on
`rebuild/c-today-split-build`, farm-synced (privacy proof PASS). Every number below is one I
measured myself; where I reproduce an author number I say so, and where I could not reproduce
one I say that instead.

---

## VERDICT: REJECT, on two BLOCKING findings, NEITHER of them in the product bytes

**The product bytes of this part are sound and I could not break them.** I reproduced the cut
mechanically from the pre-cut sources and diffed all four product files against the committed
ones; the whole difference is the banners and the declared interface lines, and every one of
them is listed in the author's section 4. There is no unlisted hand-written line.
`today-app.cjs` is byte-identical by sha256 on both sides. The bar is green: the today step on
the PC is 682 / 680 pass / 2 fail with the same two known pre-existing reds, which is the
author's count exactly.

**Both blocking findings are in the INSTRUMENT AND GUARD layer**, which is precisely what part
2 is going to lean its whole weight on. One is a fence that does not fence. The other is that
the instruments' own cell does not pass at the head it ships at, so the next hand cannot re-run
the proofs this report rests on. Both are small fixes and neither requires a product byte to
move.

---

## BLOCKING-1. The instruments' own cell is 10 of 14 at the shipped head, not 14 of 14

The report states **14 rows, 14 pass** four times (sections 0, 1.7, 7 and 10) and never names a
commit. Section 10 tells part 2 that the first thing it should do is re-run the cell "and see 14
of 14 before it believes anything in this report". That instruction fails on arrival.

Measured, in a farm scratch, with the command the cell's own header gives:

| worktree at | result |
|---|---|
| `5638af7a` (the instruments commit, which moves no product byte) | **14 tests, 14 pass, 0 fail** |
| `62e4931f` (the shipped head) | **14 tests, 10 pass, 4 fail** |

The four that fail are rows 3, 12, 13 and 14, and all four die on the same message:

```
REFUSED: gym-app.mjs GA-S01: first anchor matches ZERO places:
  "  let settingsLane = settings || null;"
```

The cause is structural, not a typo. `instruments.test.cjs`'s `tmpTree()` copies the files out
of the **working tree**. The author's own product commit `199ba74f` cut `gym-app.mjs`, so
`GA-S01`'s first anchor is no longer in it, and every row that runs the full cut over the whole
table now refuses. Rows 4, 5 and 6, which are R3's three attacks, still pass, because they act
on `today-app.cjs` and that file is untouched.

**Why this is blocking and not a stale number.** Once a file is cut, its region table stops
resolving against the tree, so the witness and extent proofs cannot be re-run after the fact on
any file this build has cut. Part 2 cuts `today-app.cjs`. When it does, the remaining ten rows
go dark the same way, and the cell that exists so that "the next hand re-runs them in twenty
seconds instead of believing a report" will pass nothing at all. The cell should take its
sources from the named refs it already records (`git show <ref>:<path>`, which is how I checked
the witness below) rather than from the working tree, and the report should state 14 of 14
**at `5638af7a`**.

## BLOCKING-2. The writer fence has an undocumented hole that passes exactly what it exists to catch

`writer-fence.test.mjs:58` is the cell's only filter:

```js
const NOT_A_STORE_RECEIVER = ["Promise", "Object", "Array", "JSON", "Math", "Set", "Number",
  "String", "Date", "entry", "importScreen"];
```

Nine of those eleven are JavaScript builtins. **`entry` and `importScreen` are application
identifiers**, they carry no comment, and no red row proves the suppression is safe. `entry` is
a live local in `gym-app.mjs`'s `paintSettings` (`const entry = facade.entryFor(liftId)`).

I planted a brand new released durable write reached through it, at `gym-app.mjs:224`, inside
that very function:

```js
if (entry) entry.save({ lift: liftId, note: 'x' });
```

**The fence stayed at 21 of 21.** The row titled "the released gym-app.mjs names EXACTLY the six
declared seam writers, and a seventh fails" does not fire on a seventh writer whose receiver is
a suppressed name. That is the one class of thing this cell is in the tree to catch, on a file
on the path to the athlete's data, and it goes through silently. In part 2, with
`today-app.cjs`'s much larger local surface, the hole gets proportionally wider.

The fix is small: drop the two application names, or keep them with a comment saying why and a
red row per suppressed name proving a durable write through it is still caught.

---

## NOTES

**NOTE-1. The declared substitution TEXT carries no witness.** S-R19 closed "a generator cannot
be its own check" on the pre-image. It is still open on the post-image. I rewrote
`regions.json`'s `W6d` row so its `to` reads
`setMessage({ ok: true, state: result.state, copy: result.copy });`, which makes the sealed
weigh-in report success whatever the client answered, and left every moved byte verbatim. The
cut **exited 0**, printed "every one matched, every file agreed on one ref", and put the
tampered line into `today-readings.cjs`. For this part that is seven rows the PM can read on one
page, which is a real control. For part 2's row set it is the same hole on the other side of the
substitution and it should be shut before 679 lines move.

**NOTE-2. `capture.cjs` has never run on the bytes that ship.** Run against the committed four
product files it prints, and I quote the measurement:

```
NO LINE MAP in this directory, so a reference cannot be carried back to a
source line and the capture comparison is not run. The name census above is.
```

The report's row "THIS BUILD'S OWN OUTPUT 1243 / 50 / 0" is therefore over a `cut.cjs` output
directory, which is exactly the artefact that lacks the hand-written interface lines, and the
interface is where a new name could capture an old reference. I compensated two ways and found
nothing: the name census over the committed files puts `facade`, `hooks` and `painter` in code
position only at their own declared sites and `on` at 0, and my byte-diff shows the interface
lines are the only addition. The risk is low. It is still a check the report claims and the
tree cannot perform.

**NOTE-3. The fence has eight RED rows, not nine.** `grep -c '^test("RED' = 8`. The report says
nine in three places, including UNMEASURED item 5. The row without a committed red counterpart
is row 18, `FENCE-VIEW-IMPORT`. I planted one myself (a `require` of
`machine-settings-view.mjs` added to `today-readings.cjs`) and **row 18 did fail**, so the row
is sound and only its red-first proof is missing.

**NOTE-4. The fifth test edit is outside D.3 and the ticket said to stop on it.** The author
proceeded and reported it at the top of the report rather than inside it, which is the honest
half. The edit itself I checked and it is strictly stronger, not weaker: it keeps the tooth by
re-pointing it at `gym-settings-lane.mjs` and adds a second one that the released card must not
name the host import. I verified both halves are true of the tree. **The PM has to ratify it**,
because D.3 declares four and this is a fifth.

**NOTE-5. The lane-d description is wrong, the result is right.** The report calls them "the ten
lane-d cells that name `gym-app.mjs` or `today-model.cjs`". Only two of the ten name either file
(`b-lom/legacy-order.test.mjs`, `p3-real-shape/r1-fixes.test.mjs`); the other eight do not.
Running more cells than needed is not a defect and the number stands: I ran the same ten on the
PC and measured **107 tests, 107 pass, exit 0**.

**NOTE-6. The `replace` kind's witness is never the check that refuses.** I tampered a `replace`
region's pre-image twice, once on the one-line `TA-S05` and once on the two-line `TA-S35b` with
its first anchor left byte-identical. Both were REFUSED by region id, but both times by the
anchor resolver, not the witness. Every declared `replace` region is one or two lines, so all of
its lines are anchors and the witness has nothing left to catch. It does no harm and it will
matter as soon as a longer `replace` row is declared.

**NOTE-7. Count drift.** My capture over the four product files compared 1277 references; the
report says 1243. The load-bearing number, zero captures, reproduces.

---

## WHAT I TRIED TO BREAK AND COULD NOT

1. **R3's three attacks.** All three refuse by region id. I ran the first by hand rather than
   through the author's harness and got
   `REFUSED: today-app.cjs TA-S30: BYTES DO NOT MATCH THE WITNESS. 124 lines at :1808-:1931 hash
   19d6922256eb4bc1..., the witness records s9=6107979043b660ee...`.
2. **The witness itself, which is the claim everything else rests on.** I did not trust
   `gen-witness.cjs`. I recomputed every witnessed region's sha256 and line count directly from
   git objects at both named commits, resolving the anchors myself: **52 regions at `s9`
   (`da9f8683`) and 52 at `tip` (`4d2112c9`), 104 comparisons, 0 mismatches, 0 files
   unreadable.** The recorded per-file moved-line totals are 679 / 41 / 36 at both refs. The
   witness is genuine and was not taken from an already-tampered tree, and the report's claim
   that every witnessed region hashes the same at both refs is true.
3. **A finer attack on the witness than the author's own.** Row 2 of their cell only deletes the
   whole witness block. I deleted **one region's entry** (`TM-S02`) and got
   `REFUSED: today-model.cjs TM-S02: NO WITNESS.` The instrument holds at that grain.
4. **An unlisted hand-written line.** I reproduced the cut mechanically from the pre-cut sources
   and diffed all four product files against the committed ones. The entire difference is the
   file banners and the declared interface, composition and `REQUIRED_INPUTS` lines, and every
   one of them appears in report section 4. **No unlisted hand edit.**
5. **An eager-capture regression**, which the witness cannot see. The composition at
   `today-model.cjs:412` now evaluates `day`, `readings`, `adoptedRead`, `stateFromOps` and
   `NO_STORE` once, where the original read them on each call. All five are declared before it
   (`:183`, `:209`, `:292`, `:251`, `:178`) and none is ever reassigned, and `read` is passed as
   a thunk. No behaviour change.
6. **A temporal-dead-zone regression.** `weighIn` and `reopen` were hoisted function
   declarations and are now `const` bindings at `:412`. Their only other references in the file
   are `:440` and `:469`, both after it; the four constants likewise. Nothing reads them early.
7. **`today-app.cjs` moving.** sha256 `efaf6c0dbb871730788d8953ed470f2650d739b5de7c52fa7f779f2c125df933`
   at the merge base and at HEAD. Identical.
8. **The fence's guard rows.** Every guard row I planted a violation into died, including row 18,
   which has no committed red row of its own. Only the receiver-suppression hole of BLOCKING-2
   survived.
9. **The custody fence.** Eighteen files changed between the merge and HEAD, every one inside
   `rebuild/lanes/c/today-split*/`, the report, the spec, and the permitted product set. No
   `DECISIONS.md`, no `STATUS.md`, nothing under `rebuild/conform/private`, no `src/history.js`,
   no `ledger/`. **Part 2 is not started**: `today-lanes.cjs` does not exist and the single
   mention of it in `build.mjs` is inside a comment.
10. **The forbidden dashes.** One em dash exists in `today-readings.cjs:38`. I confirmed it is a
    MOVED byte: the same sentence is in `today-model.cjs` at `da9f8683`, which carries seven
    such lines already. The author authored none.
11. **The spec's documentation commit (S-R25).** 116 insertions, 21 deletions. I read all 21
    deleted lines: they are R3's corrections replacing superseded counts and the wrong
    `noStore: NO_STORE` composition. No law, guard or pin is weakened.
12. **The athlete's data path, behaviourally.** `adapter.test.mjs` drives the real model through
    `weighIn`, the ALREADY_RECORDED and out-of-range and empty-form refusals, `reopen`, and
    `NO_STORE` at `:371`. That last one is the one that would have caught the F.1 prose bug: had
    the author composed `noStore: NO_STORE` as the spec writes it, the assertion would compare
    against `undefined`. It ran green on the PC.

---

## THE BAR, AS I MEASURED IT

| | result |
|---|---|
| PC, the whole today step, the exact command at `rebuild.yml:232`, run ALONE | **682 tests, 680 pass, 2 fail**, exit 1 |
| the two failures | `boundary.test.mjs` P-MEASURE (g), listing five drifting S4-sealed paths including `machine-settings-ui.test.mjs`; and `setup.test.mjs` re-pin, listing exactly three. Both are the pre-existing reds of `DECISIONS:552`. **This is the author's AFTER count exactly** |
| PC, the ten lane-d cells | **107 tests, 107 pass**, exit 0 |
| farm, `writer-fence.test.mjs` | **21 / 21** |
| farm, `instruments.test.cjs` at the shipped head | **10 / 14** (BLOCKING-1) |
| farm, `instruments.test.cjs` at `5638af7a` | 14 / 14 |
| witness recomputed from git objects at both refs | **104 / 104 match** |
| `capture.cjs` on the reproduced product cut | **0 name captures**, 1277 references compared |
| `census.cjs` on the committed four product files | **0 crossings, 0 distinct, 0 residue** |
| `census.cjs` on the mechanical cut before the interface | 22 crossings, 14 distinct, 1 released-assigns-sealed. Those are the rows the interface had to carry, and it carries them |

When I ran the today step, nothing else of mine was running on the PC: the lane-d run was
started only after it finished, and the farm is a different machine.

**On the crossing table having a disposition for every row.** It does, but not as a committed
table: `CROSSINGS.md` was not regenerated for this build, so the dispositions live in the
report's section 6 prose. I checked them against the interface and every one of the gym pair's
sixteen stranded rows is carried by a named facade or hooks entry, and the two sealed `paint`
calls by `painter.repaint`. The today-model pair's are the seven injections. Nothing is
stranded and undisposed. A regenerated `CROSSINGS.md` on the build's own output would be worth
more than the prose.

---

## WHAT I DID NOT VERIFY

1. `b-package.cjs --ci --package S8`. The author recorded its refusal by name and the ticket
   says record and do not chase; I did not re-run it.
2. The five DECLARED but unapplied boot replacements. Nothing has run them and nothing could;
   this is the author's own UNMEASURED item 1 and I confirm it is unmeasured.
3. `blind.cjs`'s 53 rows and `reach.cjs`'s tables. I did not re-derive them. The claim that
   `blind.cjs` finds R3's thirteenth blind edge and misses two the hand table keeps is the
   author's, unchecked by me.
4. Anything behind the real port, a sealed bundle or a browser. The lane-d cells that need the
   port fail in the farm for that reason and I ran them on the PC instead.
5. The spec's 116 added lines, beyond confirming that the 21 deletions weaken nothing.
6. The three interface names' freedom on any file part 2 will produce.

---

## READY FOR PART 2

**The big cut can start from this head once the two blocking items are closed**, and it should
not start before. The product bytes of part 1 are proven and the bar is green, so nothing here
argues for redoing the two small cuts. What argues for stopping is that part 2 is the round that
moves 679 lines and 25 seams through these instruments and judges the result with this fence,
and today the fence has a hole I drove a durable writer through and the instrument cell does not
run where it lives.

In order, before the first line of `today-app.cjs` moves:

1. Close BLOCKING-2. Drop `entry` and `importScreen` from `NOT_A_STORE_RECEIVER`, or keep them
   with a stated reason and a red row each proving a durable write through that receiver is
   still caught.
2. Close BLOCKING-1. Make `instruments.test.cjs` read its sources from the named refs rather
   than the working tree, so it still runs after a file has been cut, and re-state its result
   with the commit it was measured at.
3. Close NOTE-1 before the row set grows: witness the substitution and replacement TEXT, not
   only the pre-image.
4. Get a `capture.cjs` run over the bytes that actually ship (NOTE-2), since part 2's interface
   is where a capture would happen if one ever did.
5. Have the PM rule on the fifth test edit (NOTE-4) and on SEAM G1's released half, which still
   decides what is stored and which part 2 inherits.

