# S9-RELEASE-SPEC REVIEW R1 - independent, told to disagree

Reviewer: cowork (Earned lane hand, independent spec review), 2026-09-19.
Under review: `rebuild/lanes/b/S9-RELEASE-SPEC.md` at head `4876fa9` on `rebuild/b-s9-ui-pins`,
cut from `9e1ece8`. Worktree `%TEMP%\earned-s9`. The author has finished and is gone.
This round commits exactly one file: this one.

## VERDICT: REJECT

Four BLOCKING findings, all inside the spec's own assignment, all fixable in the document
without a new measurement round. Everything else in the spec I checked held: the load-bearing
measurement of section 0 is exactly right, and I verified it independently rather than reading it.

I want to be plain about proportion, because REJECT is a strong word for a document this good:
the closed list, the token grammar, the artifact block, the reason the released entry must leave
`product`, and the placement of hunk H7 are all correct and I confirmed each against the runner.
The four blocking items are: a runner rule the mechanism breaks one generation later, a hole in
the fence, an under-evidenced justification for half the closed list, and a sentence the owner was
told that the tree does not make true. Fixing them is hours, not days.

---

## 0. WHAT I CLASSIFIED MYSELF, BEFORE READING SECTION A

As instructed I read the five hardest candidates first and ruled on them before opening the
author's verdicts. My independent reading, by `DECISIONS:536` (2)'s own test:

| file | my verdict, read cold | deciding lines I took |
|---|---|---|
| `today/today-app.cjs` | SEALED | `:493` `await host.save(night, precondition)`, `:581` `await host.save(day)`, `:1072` `await model.weighIn(...)`, `:1293` `await foodLane.save(dayValues)`, `:1843` `await sleepLane.save(night, {supersedes})`, `:513`/`:596`/`:637`/`:2052` four IndexedDB lane openers, `:2494` `model.adoptBasis(state)` |
| `today/today-model.cjs` | SEALED | `:378` `async function weighIn(lb)` writing through `readings.weighIn` at `:395`; `:372` `FORM_MIN`/`FORM_MAX` admission bounds; `:229-:236` three replays onto the basis; `:412` `adoptBasis` replaces the basis |
| `today/build.mjs` | SEALED-class, see BLOCKING-3 | `:79` `FORBIDDEN` (`ledger/*`, `src/history.js`, `seed.cjs`), `:98` `REQUIRED_INPUTS`, `:384` `assertImportRouteIsolation`, `:420` `assertBundleInputs` |
| `today/design.cjs` | SEALED-class, see BLOCKING-4 | `:43-:47` the design-of-record sha256 pins, `:341` `APPROVED-PIN FAIL`, `:326` `sha256`, `:527` `assertDesignBinding` |
| `today/browser-check.mjs` | SEALED-class | `:283-:292` asserts the store of record is IndexedDB and `localStorage` holds nothing, `:357-:409` the real `taskkill /F /T` durability proof |

I agree with the author on `today-app.cjs` and `today-model.cjs`, exactly and for the same lines.
I part company on `build.mjs` (BLOCKING-3) and on what follows from `design.cjs` and
`browser-check.mjs` standing outside the seal (BLOCKING-4).

---

## 1. WHAT I RE-MEASURED AND CONFIRMED

I did not take section 0's table on trust. I parsed
`rebuild/m4/spec/acceptance-s8-real-shape.json` with a script and read every package under
`rebuild/lanes/b/tooling/packages/`.

- `product` holds **224** entries, `executionPins` **71**. Confirmed.
- **49** product paths under `rebuild/m3/w7-preview/`, **23** under `.../today/` (11 sources,
  12 test cells). Confirmed.
- Of the eight candidates `DECISIONS:536` names, exactly three are in the S8 inventory:
  `today-app.cjs` (`carried`, post `dc9a826eda96659b...`), `preview.css` (`carried`, post
  `7cf97598c2c2cb23...`), `build.mjs` (`carried`, post `d04a10ef406708b8...`). The other five
  (`screens.template.html`, `design.cjs`, `browser-check.mjs`, `today-model.cjs`,
  `index.shell.html`) are in NO package's product map and in no `executionPins`. Confirmed, and
  confirmed across `B-NTC`, `B1`-`B4`, `H3`, `S3`-`S8`: the three appear first in `S4` (today-app,
  role `new`) and `S6` (preview.css and build.mjs, role `new`), and in nothing older.
- `.../today/` also has a **13th** execution-pinned cell, `test/catalogue.test.mjs`
  (`a586e3eb...`), which is an execution pin with no product pin. The spec's "twelve" is right for
  `product` and one short for `executionPins`; see note N5.

So the single most load-bearing fact in the document is true, and the closed list is at most three
paths, not eight. That finding alone justifies the round.

I also verified, by opening the file at the line:
`b-package.cjs` `:173` IDS (12 today), `:316` NO_REGISTER_IDS (8 today), `:351` PRODUCT_ROLES (5
today), `:405` CHILD_ROOTS (no `rebuild/lanes/c/` root exists yet), `:483` PUBLIC_TAIL_ROOTS,
`:637` `childArgv`, `:932`/`:933` the grant precedent, `:1071` SPEC_KEYS, `:1189` `supersessionRuling`,
`:1519` the role assert, `:1816` `parentPin`, `:1828-:1830` `held`, `:1834-:1838` `pins`,
`:1855-:1858` the `base` bucket sentence, `:1890-:1895` the parent branch, `:1902`/`:1909` the other
two branches, `:1962`/`:1967`/`:1968`/`:1969`/`:1970`/`:1972` the disk comparison and the drift
refusal, `:1975` completeness, `:2003-:2011` `fidelity` (its diff roots really are `rebuild/engine`,
`rebuild/conform`, `rebuild/m4/spec`, tooling, and `rebuild/m3` really is absent), `:2190` `children`,
`:2796`/`:2800`/`:2826` `proposed`, `:2830` ARTIFACT_KEYS, `:2930`/`:2970`/`:2972` the receipt check,
`:2991`/`:2993` the receipt writer, `:3020`/`:3021` the key closure and recomputation, `:3113`/`:3118`
the historical audit (engine and conform/v4 only; no `m3` path can reach it).
`.github/workflows/rebuild.yml` `:23` (ubuntu + windows), `:35` (`fetch-depth: 0`), `:149-:150`
(`--ci --package S8`), `:231-:232` (the A1/A2/A3/A4 step, 17 cells named by exact path), and the
trigger at `:3-:7` (`push` and `pull_request` on `rebuild/**`), which is what D.1's claim rests on.
All correct.
`copy.test.mjs` `:92`, `:149`, `:207`, `:264`, `:303`, `:395`, `:405` are each the exact test the
spec says they are, and the file really does carry 20 tests. Correct.

---

## 2. BLOCKING

### BLOCKING-1. The release is undone one generation later by the GRANDPARENT pin re-assertion

This is the finding I would stop the round on. `pins()` has two walks, not one. B.3 and B.6 only
analyse the first.

```
1837|   for (const [file, entry] of Object.entries({ ...a.product, ...a.executionPins }))
1838|     if (held(s, file, parentPin(entry, file), 'PARENT-PIN-BROKEN')) kept++; else base++;
1840|   const g = a.parent;
1843|   const ga = J.parseExact(fs.readFileSync(rel(g.artifact)));
1851|   for (const [file, entry] of Object.entries({ ...ga.product, ...ga.executionPins })) {
1852|     if (Object.hasOwn(a.product, file) || Object.hasOwn(a.executionPins, file)) continue;
1853|     if (held(s, file, parentPin(entry, file), 'GRANDPARENT-PIN-BROKEN')) gkept++; else base++;
```

Now run S10 under the spec as written. `a` is the S9 artifact. H10 removes `preview.css` and
`build.mjs` from S9's artifact `product` and puts them in the new `released` block. `g = a.parent`
is the S8 artifact, whose `product` I confirmed still holds both paths at
`7cf97598c2c2cb23...` and `d04a10ef406708b8...`. At `:1852` the skip test asks only about
`a.product` and `a.executionPins`; it knows nothing about a `released` block, so it does not skip.
At `:1853` `held()` runs, and `held()` (`:1828-:1830`) has only two branches:

- S10 does not declare the path (the whole point of B.4): `assert.equal(diskSha(file), hash, 'GRANDPARENT-PIN-BROKEN ' + file)`. Red the first time lane C edits `preview.css`.
- S10 does declare it, to get out of the way: `assert.equal(gitSha(s.sourceBase, file), hash, 'GRANDPARENT-PIN-BROKEN-AT-SOURCEBASE ' + file)`. Also red, because the bytes at S10's sourceBase are lane C's, not S8's.

There is no third branch. So the mechanism releases the path for exactly one child and then
re-seals it by the back door, at the S8 pin, with no ledger line and no PM involvement. It is
LATENT: S10 stays green until lane C actually edits a released file, which is to say it goes red
the first time the release is used for the thing it exists for.

Consequences for the document, all of which must change:

- B.3's headline, "This is the question with the cleanest existing answer and it needs **no new
  code**", is false. It is true of the parent walk and false of the grandparent walk in the same
  function.
- B.6's row "parent pin re-assertion | `pins()` `:1837` | unchanged" is false for the same reason.
- F.2 STOP condition (2) says the round stops if any hunk would have to touch `pins()` (`:1834`).
  By its own rule this spec is already stopped. Either STOP-2 is amended by name to admit a skip
  that is provably non-weakening, or the release cannot be built.

Required: a seventeenth hunk (H17) at `:1852`, skipping any path named in the parent artifact's
`released` block, with the union taken over every ancestor `released` block the walk reads; a
sentence in B.6 saying why that is not a weakening (the pin is preserved in Git at the S8 commit
and the path is named in an artifact block forever); and an eleventh red-first cell in
`release-from-seal.test.cjs`: a synthetic S10 over an S9 artifact with a `released` block, with the
released file's bytes moved on disk, must PASS, and must still refuse `GRANDPARENT-PIN-BROKEN` for
any other grandparent pin whose bytes moved.

### BLOCKING-2. The D.2 fence learns the inventory from the branch it is fencing

D.2 says the cell "reads the YOUNGEST sealed artifact present in the tree". The tree is the lane C
branch's own worktree. A branch that wants to touch a sealed path can add that path to the
artifact's `released` block, or edit the artifact's `product` map, and the fence then measures the
change against an inventory the change itself wrote. A fence whose fenceposts move with the animal
is not a fence, and this is the one cell in the document whose entire purpose is to replace a
promise with a check.

It is not caught elsewhere. I checked: `rebuild/m4/spec/acceptance-s8-real-shape.json` is NOT a key
of `packages/S8.json`'s own `product` map (an artifact does not pin itself), so `product()` never
hashes it; and `fidelity()` `:2010` explicitly exempts `f === ARTIFACT` from
`UNLISTED-SOURCE-CHANGE`. The only thing that notices is the sealed-run receipt comparison at
`:2963` (`sr.artifactSha256 !== diskSha(ARTIFACT)`), and that path does not fail the run, it
`say`s `SEALED-RUN-RECEIPT-VOID` at `:3196-:3198` and asks for a FULL run.

Required: the fence reads the inventory out of Git at the chain ref, not from the worktree. The
runner already has the pattern and the reason written down beside it, at `:1201`:
`L.object(root, CHAIN_REF, 'rebuild/DECISIONS.md')`, with the r10 F4 lesson at `:1195-:1200`
("NO CACHE, EVER ... the chain file is re-read on every call"). The same argument applies here
word for word. The cell must also refuse, not pass, when the artifact it reads at the chain ref and
the artifact in the worktree differ, and D.2's "red first" list needs a sixth row for it: a branch
that edits the sealed artifact to widen `released` must FAIL.

### BLOCKING-3. `build.mjs` is released on an under-evidenced claim, and one of its five laws has no cell behind it

A.4 and Q2 rest on one sentence: the five build laws "are also EXECUTED by
`today/test/copy.test.mjs` (`:207` Node globals, `:264` and `:303` the launch guard, `:395` and
`:405` the dash refusals) and by `today/test/package.test.cjs`, and BOTH cells stay SEALED".

The five cites into `copy.test.mjs` are each exactly right (I opened them). But they cover two of
the five laws: `assertNoNodeOnlyGlobals` and the dash refusal. The other three are carried by
`package.test.cjs`, which the sentence names without a single line number, and the evidence there
is uneven:

| law (`build.mjs`) | independently asserted in a sealed cell? | where |
|---|---|---|
| `FORBIDDEN` `:79` | YES, by the cell's OWN literals | `package.test.cjs:76` (`seed.cjs`, `index.cjs`), `:78` (`engine/test/`), `:79` (`authority/`), `:80` (`ledger/`, `src/history.js`), `:84` `assert.throws(build.assertBundleInputs([{path:'rebuild/engine/seed.cjs'}]))` |
| `assertImportRouteIsolation` `:384` | YES | `package.test.cjs:94-:107` (a planted graph must refuse) |
| `assertNoNetworkReference` `:209` | YES | `package.test.cjs:128-:138` |
| `assertNoNodeOnlyGlobals` `:244` | YES | `copy.test.mjs:207`, `:264`, `:303` |
| `REQUIRED_INPUTS` `:98` | **PARTLY** | `package.test.cjs:57-:62` asserts six entries by its own literals (`engine/today.cjs`, `energy.cjs`, `writers.cjs`, `client/index.cjs`, `ops.cjs`, `store.cjs`) and the counts 15 and 12 at `:72-:73`. `REQUIRED_INPUTS` holds **51 paths, of which 26 are under `rebuild/m3/w7-preview/today/`** (`today-model.cjs`, `today-app.cjs`, the three gym modules, `reading-host.mjs`, the four `checkin-*`, the four `setup-*`, the three A4b modules, the food, sleep and machine-settings modules). Not one of those 26 is asserted by anything outside `build.mjs` itself |

So after the release, a lane C branch can delete `rebuild/m3/w7-preview/today/reading-host.mjs`
from `REQUIRED_INPUTS` and every sealed cell stays green. That is the exact failure the list exists
to prevent ("a page whose readings can vanish on a hard kill", `build.mjs:112-:115`).

The spec also misses the strongest evidence in its own favour, which weakens my confidence that the
census behind A.4 was done rather than assumed: `rebuild/m3/w7-preview/import/test/page-bundle.test.mjs`
is sealed and execution-pinned (`9b56ee6e...`) and carries its OWN `STILL_FORBIDDEN` literal at
`:54-:60`, including `src/history.js`, plus its own `assertImportRouteIsolation` refusals at
`:220-:227`. It is never mentioned in the spec.

Required, either: (a) close the `REQUIRED_INPUTS` gap by naming the 26 `today/` entries in a
sealed cell's own literal list, as a named S9 hunk with its red-first plan, and re-cite A.4 to
`package.test.cjs:57-:85` and `page-bundle.test.mjs:49-:60` rather than to `copy.test.mjs` lines
that are about dashes; or (b) drop `build.mjs` from the closed list, leaving it at one path. I
recommend (a). I do not accept the release of `build.mjs` on the evidence as written, because the
document's own stated reason for it is not the reason that is true.

### BLOCKING-4. "The design of record stays pinned by sha256 in design.cjs" is not true of the tree, and section C says it is

`DECISIONS:536` records the trade the owner accepted in his own words: "the design of record stays
pinned by sha256 in `design.cjs`; the copy locks stay as tests". Section C.4 answers the assignment's
question with: what pins the design of record is "the sha256 constants inside `design.cjs` (an
unsealed file), enforced by `design.test.cjs` (a sealed, CI-homed, both-OS cell)".

`design.test.cjs` does not enforce that. I read it. `:15-:20` reads `design.APPROVED` and asserts
each named file's bytes hash to **the sha in `design.cjs`**. Both sides of that comparison are
unsealed and both are lane C's to edit. A branch that changes
`rebuild/m1/approved-2026-09-08/Earned-refinement-A.html` and updates
`design.cjs:45` in the same commit is green in CI, green under `--ci --package S8`, and green under
the D.2 fence, because I confirmed by parsing the S8 artifact that:

- nothing under `rebuild/m1/` is in `product` or in `executionPins`;
- `design.cjs` is in no package's `product` map at all;
- the only cross-check anywhere is `design.test.cjs:184`, which binds `design.APPROVED[1].sha256`
  to line 9 of `rebuild/m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md` - and that handoff
  file is unsealed too, so all three move together. `APPROVED[0]`, the refinement A reference, has
  no cross-check of any kind.

This is not created by S9, and I am not asking the author to fix the tree. I am blocking on the
document, because section C was asked this exact question and its answer reads as a reassurance
when the measurement says otherwise. The spec must say plainly that the design of record is
currently pinned by nothing the seal holds, and rule on it. My recommendation: S9 declares four
more paths (`today/design.cjs`, the two `rebuild/m1/approved-2026-09-08/*.html` references and
`ADDITIONS-C-APPROVED-HANDOFF.md`) role `new`, which is four lines in the spec and no new
mechanism, and which is what makes the owner's sentence true rather than hopeful. If the PM prefers
zero scope growth, this goes to the OWNER in plain words, beside OWNER-1: "the design you approved
is currently protected by a file anyone on the design lane can edit; do you want it locked before
the new look starts landing, or not?"

---

## 3. NOTES (not blocking)

**N1. The artifact's `released` entry should carry a literal `role`.** `DECISIONS:536` (3) says the
runner "must record each released path explicitly in the artifact **with a role of its own**". B.4's
block records `lastSealedSha256`, `sealedBy`, `rulingLine` and `rulingLineSha256` but no `role`
field. The design is right and the reason for the separate block (S10 inheritance through `:1975`
and `:1893`) is correct and well argued - but add `"role": "released"` to each entry so the artifact
matches the ruling's words as well as its intent. One key, no behaviour change.

**N2. H7's line cite is wrong and its placement is right.** B.5 H7 says "placed BEFORE
`const disk = diskSha(file)` (`:1961`)". `const disk = diskSha(file)` is at **`:1952`**; `:1961` is
a comment. I checked what a `continue` at the top of the parent branch would skip
(`:1912-:1916` `pinned-unchanged` mislabelling, `:1943-:1949`
`PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE`) and it loses nothing for a `released` pin: `noChange` at
`:1943` is false when `post === null`. There is even an exact precedent one line above the cite,
`:1951`, which does `continue` for a `new` pin with `post === null`. The hunk is sound; the number
is not.

**N3. The receipt sentence is at `:3190-:3191`, not `:3170`.** B.6 says the sentence must change at
`:3170`. `:3170` is the PROTECTED SURFACES echo. The byte-identity re-verify sentence the hunk has
to amend is `say('AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY ...' + Object.keys(s.product).length + ' pinned product file(s) ...')`
at `:3190-:3194`, and note that the count it prints is `Object.keys(s.product).length`, which after
H12/H13 will over-count by the number of released paths unless the hunk changes the count too.

**N4. `boundary.test.mjs` line numbers are two off, and the ruling on the cell is right.** C.1 and
C.2 cite `:181-:183` and `:185-:190` for `P3_IMPORT_UI_2_UNSEALED`. The constant is at
**`:179-:180`**; `:181` is the `MINE` drift assert, `:183` the sealed-set `deepEqual`; the loop the
spec wants removed really is `:185-:190`. The substance is correct and I re-derived it
independently: `:186` (`Object.hasOwn(product, f) === false` against `S4.product`) stays true after
the release, and `:188` (`shaOf(f) === declaredPost(f)`) goes red the first time lane C edits either
file, because `declaredPost` only accepts a spec whose `post` is a string and S9 will declare
`post: null`. So the loop must go, exactly as C.2 rules.

**N5. Thirteen cells, not twelve.** `.../today/test/catalogue.test.mjs` is an execution pin
(`a586e3eb...`) and a declared child argv target with no `product` pin. C.3's table and the "twelve
sealed today/test cells" line should say "twelve product-pinned, thirteen execution-pinned", and
C.3's argument ("All twelve today cells ARE child argv targets and execution pins today") should
name thirteen. It does not change the recommendation, which I agree with: release none of them.

**N6. `build.mjs` has an unsealed production consumer the spec never names.**
`rebuild/slice/pwa/build-pwa.mjs:19` does
`import { buildToday, DIST as A1_DIST, ROOT } from "../../m3/w7-preview/today/build.mjs"`, and
`rebuild/slice/**` is in no `product` and no `executionPins` (I checked). After the release, the
deployed PWA's build chain is unsealed end to end, and C-UI-8 is marked "plain lane C". That may
well be what `DECISIONS:536` intends ("rebuild/slice/pwa/** is already unpinned"), but the S9 brief
should say it out loud rather than leave a reader to discover that releasing `build.mjs` also
releases the last sealed link in the deploy path.

**N7. Cites that land on the comment above the statement.** Harmless individually, worth one pass
before the brief quotes them: B.2 step 2 cites `:1200` for the chain re-read (the read is `:1201`;
`:1200` is the last line of the no-cache comment); step 3 cites `:1207` for the ` RULED` assert (it
is `:1208`); B.2 preamble cites `:1194-:1198` for the r10 F4 lesson (the comment runs `:1195-:1200`
and `:1194` is the sha-shape assert). Everything else I spot-checked in B.1's table was exact.

**N8. `at.released` needs adding to the bucket initialiser at `:1888`.** H7 pushes to
`at.released` and `:1888` builds `at` with seven named arrays. One word, easy to lose between a
spec and a hunk list that is otherwise this precise.

**N9. The D.2 fence's "largest N" rule needs to be numeric and needs a tie-break.** Artifacts are
named `acceptance-s6-today-child.json`, `acceptance-s7-port-admission.json`,
`acceptance-s8-real-shape.json`. A lexical walk puts `s10` before `s9`. Say "parse the integer after
`acceptance-s`" and say what happens when two artifacts carry the same N.

**N10. Q3 is the right question and I would widen it by one.** The spec finds three SEALED-class
files standing outside the seal (`today-model.cjs` computes, `gym-model.mjs:502` `logSet`,
`checkin-app.mjs:150` `model.save()`). I confirmed `today-model.cjs` writes as well as computes:
`:378` `async function weighIn(lb)` reaching `readings.weighIn` at `:395`, with the
`ALREADY_RECORDED` and `OUT_OF_RANGE` admission refusals at `:365` and `:373`. By `DECISIONS:536`'s
words ("any file that calls logSet **or writes state**") it belongs in the same answer as the other
two, not in a separate "leave it out" bucket. `browser-check.mjs` is a fourth: it is the only proof
in the tree that a reading survives a real `taskkill /F /T` (`:357-:409`) and that nothing of record
is in `localStorage` (`:291-:292`), and it is unsealed, unrun by any workflow and stale-red. Q4
says so; I would put `browser-check.mjs` and the three Q3 files to the PM as one question with one
answer, because they are one fact: four files that write or prove writing are outside the seal
today.

---

## 4. WHAT I TRIED TO BREAK AND COULD NOT

Recorded because a reviewer who only lists faults is not reporting a measurement.

1. **A writer hidden in a "presentation" file.** I read `preview.css` (pure CSS, no behaviour) and
   walked `build.mjs` end to end. `buildToday` (`:465-:513`) reads the shell, template and chrome,
   runs the guards and writes three files into `.tmp/w7-today-dist` (`:507`). It opens no store,
   admits no athlete data and computes nothing about the athlete. The author's classification of
   those two as non-writers is correct; my disagreement about `build.mjs` (BLOCKING-3) is about the
   laws it enforces, not about a hidden writer.
2. **A release by pattern or by a later child.** The grammar at B.2 is a comma list of literal
   paths with no wildcard metacharacter admitted by the regex, the set equality in both directions
   (step 5) closes the spec-to-ledger gap, and step 6 refuses a path the parent never sealed. I
   could not find a way to widen the set without a new RULED ledger line naming the package. Sound.
3. **The `--full` byte-identity re-verify.** The author is right and this was the best catch in the
   document: `:2970-:2972` walks `sr.product` in both directions, so without H12/H13 the first lane
   C edit to `preview.css` prints `SEALED-RUN-RECEIPT-VOID` for ever and every authorized rerun
   becomes a FULL run with the private census. I re-derived it from the code.
4. **The historical audit.** `:3118` filters to `rebuild/engine/**` and
   `rebuild/conform/v4/*.cjs`. No `m3` path can reach it. Confirmed, as stated.
5. **`UNLISTED-SOURCE-CHANGE`.** `:2005`'s diff roots really are engine, conform, m4/spec and
   tooling; `rebuild/m3` was never in the list, so nothing is loosened and nothing is tightened by
   the release. Confirmed, as stated.
6. **The child-needle back door.** `proposed()` `:2800` really does re-pin every child argv target
   into `executionPins`, so B.6's "released and childArgv must be disjoint" is a real requirement
   and R2 is a real risk. Confirmed.
7. **A byte pin over a released file elsewhere in the tree.** I did not trust C.1's scope (it
   covered `w7-preview/` and `lanes/{c,d}/`), so I ran a repository-wide search for both released
   paths. Every other hit is prose, a package or receipt JSON, or a consumer:
   `import/test/refusal-route.test.mjs:257` merely READS `preview.css` as text,
   `today/test/setup.test.mjs:934` names `build.mjs` inside a failure message,
   `.github/workflows/shared-preflight.yml:46` lists it in a historical commit-to-files map, and
   `slice/pwa/build-pwa.mjs:19` imports it (N6). No second byte pin exists. C.1's conclusion holds
   on a wider search than the one it declares.
8. **The order of work.** I could not find a step in E.2's "NOW" column that needs C-UI-1's bytes.
   H1 to H13, the token grammar, the fence and the ancestor re-pins are all judgeable against the
   runner as it stands. E.2 is sound, subject to BLOCKING-1 adding H17 to the day 1-2 column.

---

## 5. DISPUTED CITES, IN ONE LIST

| spec says | the file really says |
|---|---|
| `b-package.cjs:1961` is `const disk = diskSha(file)` (B.5 H7) | it is `:1952`; `:1961` is a comment line |
| `b-package.cjs:3170` carries the byte-identity re-verify sentence (B.6) | `:3170` is the PROTECTED SURFACES echo; the sentence is `:3190-:3194` |
| `b-package.cjs:1200` re-reads the chain file (B.2 step 2) | the read is `:1201`; `:1200` is the last comment line |
| `b-package.cjs:1207` requires the ` RULED` terminal (B.2 step 3) | the assert is `:1208` |
| `boundary.test.mjs:181-:183` names both paths (C.1, C.2) | the constant is `:179-:180` |
| "the twelve sealed `today/test/*` cells ... ARE child argv targets and execution pins" (C.3) | twelve are product-pinned; thirteen are execution-pinned and declared children (`catalogue.test.mjs`) |
| "the five [build] laws are also EXECUTED by `copy.test.mjs` ... and by `package.test.cjs`" (A.4) | four are; `REQUIRED_INPUTS`' 26 `today/` entries are asserted nowhere outside `build.mjs` (BLOCKING-3) |
| "`design.test.cjs` (a sealed, CI-homed, both-OS cell)" enforces the design-of-record pins (C.4) | it enforces file-matches-constant where both sides are unsealed (BLOCKING-4) |
| "parent pin re-assertion ... unchanged" (B.6), "needs **no new code**" (B.3) | true of `:1837`, false of `:1851-:1853` (BLOCKING-1) |
| `today-app.cjs` is "2626 lines" (A.2) | 2625 lines. Immaterial, listed for completeness |

---

## 6. WHAT WOULD MOVE THIS TO ACCEPT

Four edits to `S9-RELEASE-SPEC.md`, no new measurement round:

1. Add hunk H17 (the grandparent skip at `:1852`), correct B.3 and B.6, amend F.2 STOP-2 by name,
   and add the eleventh red-first cell. (BLOCKING-1)
2. Make the D.2 fence read the inventory out of Git at the chain ref, and add the sixth red-first
   row: a branch that edits the sealed artifact to widen `released` must FAIL. (BLOCKING-2)
3. Either add a named hunk that asserts `REQUIRED_INPUTS`' 26 `today/` entries inside a sealed
   cell, and re-cite A.4 to `package.test.cjs:57-:85` and `page-bundle.test.mjs:49-:60`; or drop
   `build.mjs` from the closed list. (BLOCKING-3)
4. Replace C.4's closing paragraph with the measurement: nothing under `rebuild/m1/`, and not
   `design.cjs` itself, is held by any seal, so the owner's condition is currently unenforced; rule
   on it, or put it to the owner beside OWNER-1. (BLOCKING-4)

I agree with, and would not re-litigate: the two-path closed list as a finding (Q1), the artifact
`released` block and its reason (B.4), the token grammar and binding (B.2), releasing none of the
today test cells (C.3), the estimate's shape (F.3, and I would add two hours for H17 and its cell),
and OWNER-1, which is the most useful page in the document and which I would send to the owner
whatever happens to the rest.

---

## 7. WHAT I DID NOT VERIFY

1. I ran nothing. No `b-package.cjs` invocation, no suite, no build. Every refusal named above is
   derived from reading the runner, not from watching it refuse.
2. I did not read `rebuild/conform/private`, `src/history.js`, any `ledger/`,
   `C:\Users\joeym\EarnedPort`, `%TEMP%\port-real.log` or the protected soak. No owner measurement
   entered this session and no fixture here is anything but synthetic.
3. I did not read the C-UI ticket bodies. A.5's "which C-UI ticket touches what" is the author's
   reading of them and I neither confirm nor dispute it; my findings do not depend on it.
4. I did not measure the S8 ARTIFACT sha256 for fact 8. I confirm the author's warning is well
   founded in shape: `DECISIONS:529` names a receipt and the parent block needs an artifact.
5. I did not check `rebuild/c-s9-today-carry`, `rebuild/c-passphrase-normalize` or
   `rebuild/c-ui-port` on the remote.
6. I read `DECISIONS.md` line 536 only, by number, and quoted nothing from it that is not in the
   spec already.

Reviewer: cowork (Earned lane hand), independent of the author, told to disagree and did.
