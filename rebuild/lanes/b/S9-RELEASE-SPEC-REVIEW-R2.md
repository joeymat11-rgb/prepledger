# S9-RELEASE-SPEC REVIEW R2 - independent, second round, told to disagree

Reviewer: cowork (Earned lane hand, independent spec review), 2026-09-19.
Under review: `rebuild/lanes/b/S9-RELEASE-SPEC.md` **v2** at `c0bb04e` on `rebuild/b-s9-ui-pins`,
against v1 `4876fa9` and review R1 `f0dc366`. Worktree `%TEMP%\earned-s9`, cut from `9e1ece8`.
The author has finished and is gone. This round commits exactly one file: this one.

## VERDICT: REJECT

Two BLOCKING findings. Both are one row short of a fix the document already contains, and both
are the same species the round was convened over: a sentence that reassures where the tree does
not support it, and a fence whose gate the fenced branch can open.

Proportion first, because REJECT is a strong word for a fix round this honest. **All four R1
blocking findings are genuinely FIXED, and all ten notes are FIXED.** I re-derived each one from
the runner and the cells rather than reading the author's account of them, and I found the v2 work
to be measured, not argued: H17 is the right hunk in the right place, its skip is narrow, the
grandparent trace is exactly right, the fence's chain-ref read is the correct pattern, H18 closes
a real hole, and C.5 is a better answer than R1 asked for. The author also corrected the reviewer
(`held()` has three asserts, not two) and was right to.

The two blocking items are: **C.4's copy-lock row still makes the claim R1 blocked C.4's
sha256 row for**, one row above the fix; and **the D.2 fence's reseal-child SKIP is declared by
the branch's own diff**, which is BLOCKING-2's mechanism surviving BLOCKING-2's fix. Both are
document edits. Neither needs a new measurement round.

---

## 0. WHAT I CLASSIFIED MYSELF, BEFORE READING SECTION A

As instructed I read the five hardest candidates cold and ruled before opening the author's
verdicts.

| file | my verdict, read cold | deciding lines I took |
|---|---|---|
| `today/today-app.cjs` | **SEALED** | `:518` `createSleepHost({ day, indexedDB, crypto })`, `:601` `createFoodHost`, `:2059` `createWorkoutEntry`, `:513`/`:596`/`:637`/`:2052` the IndexedDB handles; the three writing click handlers `:1059` (weigh-in submit), `:1272` (food Save), `:1721` (sleep Save); `:709` the Import route with `onAdmitted: () => adoptAthleteState()` |
| `today/today-model.cjs` | **SEALED** | its own header calls it "the REAL adapter: the durable reading log"; `:378` `async function weighIn(lb)` reaching `readings.weighIn` at `:395`, behind the admission refusals `:365` `ALREADY_RECORDED`, `:372` `FORM_MIN`/`FORM_MAX`, `:373` `OUT_OF_RANGE`; three replays onto the basis |
| `today/build.mjs` | **RELEASABLE ONLY IF EVERY LAW IT CARRIES KEEPS A SEALED EXECUTOR** | `buildToday` `:465-:513` runs SEVEN guards, not the five A.4 names: `:470` template slot, `:472` `assertDesignBinding`, `:480` `assertBundleInputs`, `:484` `assertImportRouteIsolation`, `:497` `assertNoNetworkReference`, `:499` `assertNoNodeOnlyGlobals`, `:501` `assertNoAiDashesInAssets`, plus `:452` `realDirectory` and `:504` OUTPUT-CLEAN |
| `today/design.cjs` | **SEALED-class, and it is not sealed** | `:43` `APPROVED` (the design-of-record sha256 pins), `:65` `PREVIEW_COPY`, `:77` `APPROVED_COPY`, `:112` `RUNTIME_COPY`, `:527` `assertDesignBinding`. Release it and nothing pins the design of record and nothing lists the approved copy |
| `today/browser-check.mjs` | **not presentation at all** | it is a proof harness (`:60` `design.headlineVocabulary()`, the real-kill durability proof), unsealed today and with no CI step. The release question does not reach it; the CI-home question does |

I agree with the author on `today-app.cjs`, `today-model.cjs` and `design.cjs`, and on
`browser-check.mjs` being a Q4 problem rather than a release candidate. On `build.mjs` I reached
A.4+H18's conclusion independently and found the law census two short: see NOTE N7 below, which
does not change the verdict on the file.

---

## 1. EVERY R1 FINDING: FIXED, STILL OPEN, OR DISPUTE UPHELD

### The four blocking

**R1 BLOCKING-1 (the grandparent walk undoes the release one generation later): FIXED.**
Re-derived, not accepted. `pins()` is `b-package.cjs:1834-:1859` and reads exactly two artifacts:
`a = bound.acceptance` (walk 1, `:1837-:1839`) and `ga` from `g = a.parent` (walk 2,
`:1851-:1853`, skip at `:1852`). `held()` `:1828-:1833` is three asserts, and v2's correction of
R1 on that point is right: `:1829` sourceBase, `:1830` disk, `:1831` `-GIT-DISK-DISAGREE` at HEAD.
The S10 trace in B.3 is exactly what the code does. H17's `releasedAncestry(a)` as "the union over
the artifacts this walk reads" is sufficient AND minimal: I checked the next generation by hand -
for S11, `ga` is the S9 artifact, whose `product` no longer carries the path at all, so the walk
never reaches it and the skip is a no-op. B.7's claim that an old `released` block falls out of
scope two generations later is correct. F.2 STOP-2's amendment is narrower than v1's rule, not
looser. Cells (11) and (12) are the right red-first pair. I could not widen the skip.

**R1 BLOCKING-2 (the fence learns the inventory from the branch it fences): FIXED as asked, and a
second self-certifying hole is left standing in the same cell.** The inventory half is properly
fixed: D.2 now reads the artifact out of Git at `CHAIN_REF` (`:189`), which is the same no-cache
pattern as `:1201`, adds `FENCE-INVENTORY-DIFFERS-FROM-CHAIN`, adds red-first row (6) and says
why not the worktree so a later author cannot re-introduce it. I confirmed each leg the author
confirmed: `fidelity()` `:2010` really does exempt `f === ARTIFACT`; `sealedRunReceipt()` `:2963`
returns `SEALED-RUN-RECEIPT-VOID` (`:2973`) and `:3196-:3197` only `say`s it. **But the SKIP row
was not touched, and it is the same failure with a different key: see BLOCKING-A below.**

**R1 BLOCKING-3 (`build.mjs` released on under-evidenced grounds): FIXED.** Measured
independently. `REQUIRED_INPUTS` (`build.mjs:98-:201`) has 26 entries under
`rebuild/m3/w7-preview/today/`; `package.test.cjs:59-:60` names six engine/client entries by
literal and `:72-:73` counts engine at 15 and client at 12; **nothing anywhere constrains the
today half.** The new evidence is sound and better than v1's: `page-bundle.test.mjs` really does
carry its own `STILL_FORBIDDEN` (`:54-:61`), and I checked what R1 did not - that cell IS a
product pin AND an execution pin AND has a CI home (`rebuild.yml:232` lists
`import/test/page-bundle.test.mjs`). H18, the conditional closed list in A.6, STOP-6 and the
rewritten Q2 are the right shape. One measurement is wrong and it is not load bearing: the
constant holds **48** paths, not 51 (NOTE N6).

**R1 BLOCKING-4 (the design of record is pinned by nothing the seal holds): FIXED for the sha256
pins, and the identical hole in the COPY LOCKS is left standing one row above the fix.** C.5 is a
better answer than R1 asked for and I confirmed every number in it by parsing the S8 artifact:
**zero** paths under `rebuild/m1/` in `product` or `executionPins`; `design.cjs` in neither;
`design.test.cjs` sealed at `0db62ca9...` in both maps. The fifth path (`MOCK.md`) is the author's
own and is right. But section C answers TWO owner promises and fixed only one: see BLOCKING-B.

### The ten notes

| # | R1 note | my verdict | what I checked |
|---|---|---|---|
| N1 | `"role": "released"` literal | **FIXED** | present in B.4's block and E fact 15, with the `DECISIONS:536` (3) reason |
| N2 | `:1961` is a comment; `const disk = diskSha(file)` is `:1952` | **FIXED** | `findstr`: `:1952` is the statement, `:1951` is the `new`/`post === null` `continue` precedent the row now cites. Both exact |
| N3 | the receipt sentence is `:3190-:3194` and its count over-counts | **FIXED** | `:3190-:3194` really is the `AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY` say and it really prints `Object.keys(s.product).length` at `:3191`. The row now requires the count to change |
| N4 | `boundary.test.mjs` numbers two off | **FIXED** | the constant is `:179-:180`, the loop `:185-:190`, `Object.hasOwn` `:186`, `shaOf`/`declaredPost` `:188`. All exact now |
| N5 | thirteen execution pins, not twelve | **FIXED** | parsed: 12 product pins and 13 execution pins under `today/test/`; `catalogue.test.mjs` is exec-only. C.3 now says both numbers |
| N6 | `build.mjs` has an unsealed production consumer | **FIXED** | `rebuild/slice/pwa/build-pwa.mjs:19` is exactly that import, and nothing under `rebuild/slice/` is in either map. A.5 now says it out loud |
| N7 | cites landing on the comment above the statement | **FIXED where R1 named them, NOT swept** | `:1201` and `:1208` are now exact, and `:189` is the real `CHAIN_REF`. But two NEW comment-line cites were introduced or kept in the same round: see NOTE N4 below |
| N8 | `at.released` in the `:1888` initialiser | **FIXED** | `:1888` really builds `at` with seven named arrays; the row folds it into H7 |
| N9 | numeric N and a tie-break | **FIXED** | D.2 now parses the integer after `acceptance-s`, takes the numeric maximum, and FAILs `FENCE-AMBIGUOUS-INVENTORY` on a tie. Red-first row (7) covers both directions |
| N10 | widen Q3; `today-model.cjs` writes as well as computes | **FIXED, and the cites are exact** | `findstr`: `:365`, `:372`, `:373`, `:378`, `:395` are each the line the spec says. A.5's row is corrected to "computes AND writes" and Q3 is one question over four files |

**Nothing in R1 is DISPUTE UPHELD.** v2 disputes nothing, and I could not find a place where it
should have: every R1 finding I re-derived was right, and the one correction v2 makes to R1
(`held()`'s third assert) makes BLOCKING-1 stronger, exactly as v2 says.

---

## 2. BLOCKING

### BLOCKING-A. The fence's reseal-child SKIP is declared by the branch being fenced

D.2, row "what it does on a reseal child branch":

> a branch whose diff contains `rebuild/lanes/b/tooling/packages/S<N+1>.json` is a reseal child
> and the cell SKIPS with a printed reason.

The inventory is now read at the chain ref. **The skip is not.** It is read out of
`git diff --name-only`, which is the branch's own content. Nothing in the row requires that file
to be a real spec, that its `packageId` be in `IDS` at the chain ref, that its `parent.artifact`
be the artifact the fence just read, that a PM ruling name it, or that the branch belong to lane
B. A lane C branch that wants to touch `today-app.cjs` adds an empty
`rebuild/lanes/b/tooling/packages/S10.json` to its diff and the fence prints a reason and stands
aside. This is BLOCKING-2's own sentence - "a fence whose fenceposts move with the animal is not a
fence" - applied to the gate instead of the map, and it survived BLOCKING-2's fix because only the
"how it learns the inventory" row was rewritten.

It is bounded, and I say so plainly: `rebuild.yml:150` still runs `--ci --package S8` (S9 after
the seal) on every push to `rebuild/**` (`rebuild.yml:5`, `:7`), and `product()` `:1970`/`:1972`
still hashes all 224 declared files, so the SEAL is not broken by this - the BYTES are still
caught. What is lost is exactly what section D exists to buy: "'lane C touched only released
paths' is enforced by code and not by promise". With a branch-declared skip it is enforced by
code only for branches that do not think to add a file.

Required: derive the skip from the chain, not from the diff. The cell should read the spec it
found in the diff, require its `packageId` to be an id `IDS` carries at `CHAIN_REF`, require its
`parent.artifact` to be the artifact the fence just read at `CHAIN_REF`, and FAIL
`FENCE-RESEAL-CHILD-UNVERIFIED` otherwise rather than skipping. And D.2 needs an eighth red-first
row: **a branch that adds a `packages/S<N+1>.json` it did not earn must FAIL, not skip** - written
before the skip has a happy path, for the same reason row (6) is written first.

### BLOCKING-B. C.4's copy-lock row is the claim R1 blocked C.4's sha256 row for

`DECISIONS:536` records two promises in the owner's own words: "the design of record stays pinned
by sha256 in `design.cjs`; **the copy locks stay as tests**". R1 BLOCKING-4 measured the first and
found it unenforced. C.5 fixes it. The second is C.4's row 2, and it is unenforced in exactly the
same way, and C.4 still says otherwise:

> **Why a lane C ticket cannot silently drop them:** all six rows are executed by cells that stay
> in the S8/S9 sealed inventory AND in `executionPins`. A lane C branch that edits one of those
> cells moves a sealed byte...

True of the cells. False of what the cells read. Measured on the PC:

- `design.cjs` is in NO package's `product` and in no `executionPins` (I parsed the S8 artifact).
- `screens.template.html` is not in the inventory either (S8 `product` has no entry for it).
- the two approved reference HTML files are not in the inventory (zero `rebuild/m1/` paths).
- `design.test.cjs:74-:75` asserts `report.copy === design.PREVIEW_COPY.length +
  design.APPROVED_COPY.length + design.RUNTIME_COPY.length + design.CHECKIN_RUNTIME_COPY.length +
  design.PREVIEW_RUNTIME_COPY.length`. Both sides of that equation are `design.cjs`'s own arrays.
  Delete an entry and both sides fall by one.
- `assertDesignBinding` (`design.cjs:527-:554`) compares the unsealed template against the
  unsealed approved HTML using the unsealed `APPROVED_COPY` list (`design.cjs:77`). All three
  sides are lane C's to edit, in one commit, exactly as BLOCKING-4's coordinated edit was.

I quantified it rather than asserting it. The five declared copy arrays hold **218 strings**. I
searched all thirteen sealed `today/test/*` cells for each one verbatim: **79 appear, 139 do not**
- and several of the 79 are single words (`Low`, `New`, `Today`) that match by accident. The
sentences that really are locked by a sealed cell's own literal are a handful:
`design.test.cjs:111` ("Your plan for today"), `:113` ("Eat about"), `:115` ("Weight trend"),
`:101` (the preview-runtime probe) and `view.test.mjs:100`/`:501`. For the other ~139, a lane C
commit that removes the sentence from `screens.template.html` AND from `APPROVED_COPY` in
`design.cjs` is green in CI, green under `--ci --package S8`, and green under the D.2 fence,
because the fence only knows the sealed inventory and none of the three files is in it.

This matters beyond a corrected paragraph, which is why it is blocking and not a note: **Q7 and
OWNER-3 are both framed as being about hashes.** If the PM answers Q7 "no scope growth", or if the
owner reads OWNER-3 as being about two HTML files, the copy locks go with it and nobody has been
told. Sealing `design.cjs` is what makes BOTH of the owner's sentences true, because a sealed
`APPROVED_COPY` forces every declared sentence to stay in the template and the template-to-approved
direction forbids a new one.

Required: replace C.4's "why a lane C ticket cannot silently drop them" paragraph with the
measurement above; say in C.5 and in Q7 that the copy locks ride on the same answer as the sha256
pins; and add one clause to OWNER-3 so the owner is choosing about his copy as well as his design
files. The five-path list in C.5 does not change.

---

## 3. NOTES (not blocking)

**N1. D's cell is narrower than D's claim, and the gap is measured in the spec's own Q3.**
D.1/D.2 say the fence makes "lane C touched only released paths" a check. The cell it designs
checks "lane C touched only paths ABSENT from the sealed inventory". The spec's own Q3 measures
three files that WRITE athlete state and stand outside that inventory: `today-model.cjs:378`
(`weighIn` through `:395`), `gym-model.mjs:502` (`logSet`), `checkin-app.mjs:150` (`model.save()`).
So after S9 the fence passes a lane C branch that rewrites the weigh-in admission bounds. Section D
never connects to Q3, and a PM reading D will believe the loop is closed. One sentence in D.2's
"what it is NOT" row, naming the three, and a line in Q3 saying that the fence's completeness
depends on its answer.

**N2. H17 changes a printed count and the spec does not say so.** `pins()`'s terminal at
`b-package.cjs:1855-:1858` prints `gkept` as "N un-superseded grandparent pin(s)". H17's skip drops
that number by the number of released paths, silently. The document holds H13 to exactly the
opposite standard (N3: the `:3190` count must change with the hunk) and gives H8 a new say-clause
so the release is "said out loud on every run". H17 deserves the same clause.

**N3. H7's two placements are inconsistent.** The row says both "after `:1895`" and "placed BEFORE
`const disk = diskSha(file)`, which is `:1952`". Those are 57 lines apart and skip different
things: after `:1895` skips `:1915-:1916` (`PRODUCT-PINNED-UNCHANGED-IS-A-PARENT-PIN`) and
`:1943-:1949`; immediately before `:1952` skips neither. The row's own justification paragraph
assumes the first. Say which, so the builder does not have to choose.

**N4. Two cites still land on the comment above the statement, in the round that swept N7.**
B.5 H8 cites `product()`'s say at `:1966`; `:1966` is the comment "// package produced none of it
- that separation is the whole of F1's correction" and the `say('PRODUCT ' + phase ...)` is at
`:1983-:1987`. C.5 cites `:1908` for `pinned-unchanged` being the correct role; `:1908` is the
comment and the assert is `:1909`. Both harmless, both the class of error the document has already
been corrected for twice.

**N5. C.5's `pinned-unchanged` ruling is correct, and I checked the refusal it would otherwise
hit.** `product()` `:1915-:1916` refuses `pinned-unchanged` for a file the parent pins in either
map; none of the five is parent-pinned, so the role is admitted at `:1909` and checked at `:1967`
(`assert.equal(disk, pin.pre, 'PRODUCT-PINNED-UNCHANGED-BYTES-MOVED')`). `new` really would be
refused at `:1945-:1949` for `pre === post`. The reasoning holds; only the cite is off (N4).

**N6. `REQUIRED_INPUTS` holds 48 paths, not 51.** Measured with a script over `build.mjs:98-:201`:
48 total - 26 under `rebuild/m3/w7-preview/today/`, 3 `rebuild/engine/`, 3 `rebuild/client/`, 16
elsewhere. The 26 and A.4's enumeration of them are exact, so nothing in the argument moves; but
A.4, Q2 and H18 each say "51", and v2 says the number was counted with a script.

**N7. A.4's "five laws" is short by two, one of which is the owner's own rule.** `buildToday`
(`build.mjs:465`) also runs `assertDesignBinding` (`:472`) and `assertNoAiDashesInAssets` (`:501`),
plus the template-slot assert (`:470`), `realDirectory` (`:452`) and OUTPUT-CLEAN (`:504`). I
checked both of the two before raising them and **neither changes the verdict on `build.mjs`**:
the dash law's CALL SITE is covered, because `copy.test.mjs:395` and `:405` build a planted COPY of
the tree and require `AI_DASH_IN_BUILD`, so a `build.mjs` that dropped the call goes red; and the
binding is exercised directly by `design.test.cjs:72` and `:109-:115`. But A.4 presents its table
as the complete cost of releasing the file, and the S9 brief will quote it. Add the two rows with
their evidence, and note that the dash law's coverage is of the unusual kind that survives a
released call site.

**N8. OWNER-3 understates the option it recommends.** It tells the owner that locking means "any
change to an approved design file has to go through a locked-package round". The five paths
include `design.cjs`, which is the file the design lane edits whenever the new look adds a class
or a sentence (`PREVIEW_CLASSES`, `RUNTIME_CLASSES`, `APPROVED_COPY` at `design.cjs:77`). The
owner should be told that too, in the same plain words. The spec's own Appendix point 8 says the
C-UI ticket bodies were not re-read, so A.5's "`design.cjs`, ticket 1 only" is unverified - and
that row is what makes option (a) look free.

**N9. C.2 deletes a live guard it says needs no change.** C.2 rules the whole loop
`boundary.test.mjs:185-:190` removed, having just said that `:186-:187`
(`Object.hasOwn(product, f) === false` against `S4.product`) "stays TRUE after the release and
needs no change". Only `:188-:189` is a byte pin over a released file. Either keep `:186-:187` or
say why the guard is not worth its two lines.

**N10. No em or en dash anywhere in the spec.** Checked with a script over all 996 lines: zero
U+2013 and zero U+2014, including the quoted runner source. Recorded because the document is the
source of a brief and a token line.

---

## 4. WHAT I TRIED TO BREAK AND COULD NOT

1. **H17 widened.** I looked for a way to make `releasedAncestry()` skip a pin nobody released.
   The skip is keyed on a `released` block, which only `proposed()` writes, which only writes for
   a spec declaring `role: "released"`, which `releaseRuling()` only admits under a RULED chain
   line naming the package and the exact path. And `:1909` independently refuses `released` for a
   path the parent pins in neither map, so "release something the parent never sealed" cannot be
   spelled at all. Cell (12) covers the no-op case. Sound.
2. **A third pin walk.** `pins()` reads `a` and `ga` and nothing else (`:1836`, `:1840-:1843`).
   There is no great-grandparent walk for a `released` block to miss.
3. **Release by pattern.** `RELEASE_GRANT`'s character class admits no `*` and the set equality in
   both directions (B.2 step 5) plus step 6's parent-product requirement close the ledger-to-spec
   gap. A path with `..` in it would still have to be a key of the parent `product` map.
4. **A writer hidden in the two released files.** `preview.css` is 121 lines of CSS. `buildToday`
   (`build.mjs:465-:513`) reads, guards and writes three files into `.tmp/w7-today-dist`; it opens
   no store and computes nothing about the athlete. Confirmed independently of R1.
5. **A byte pin over a released file.** Agreed with R1's wider census; I re-checked
   `boundary.test.mjs:179-:180` and `:185-:190` at the line and found nothing else.
6. **The `--full` re-verify.** `:2970`/`:2972` walk `sr.product` in both directions and `:2993`
   writes it from `Object.keys(s.product)`; H12/H13 are necessary and sufficient. R3 is real.
7. **The historical audit and `UNLISTED-SOURCE-CHANGE`.** `fidelity()`'s diff roots at `:2005` are
   engine, conform, `m4/spec` and tooling; `rebuild/m3` is absent. Nothing loosened.
8. **The order of work.** I could not find a NOW item in E.2 that needs C-UI-1's bytes. With
   BLOCKING-A's change the fence work stays in the day 1-2 column.

---

## 5. DISPUTED CITES, IN ONE LIST

| the spec says | the file really says |
|---|---|
| H8: `product()` terminal say at `:1966` | `:1966` is a comment; the `say('PRODUCT ' + phase ...)` is `:1983-:1987` |
| C.5: `pinned-unchanged` is the correct role "by `product()` `:1908`" | `:1908` is the comment; the assert is `:1909` |
| A.4 / Q2 / H18: `REQUIRED_INPUTS` holds "51 paths" | 48 paths (`build.mjs:98-:201`). The "26 under `today/`" is exact |
| A.4: `build.mjs` "also carries five laws that are not presentation" | seven guards run in `buildToday`; `assertDesignBinding` `:472` and `assertNoAiDashesInAssets` `:501` are missing from the table |
| C.4: "a lane C ticket cannot silently drop them ... all six rows are executed by cells that stay in the sealed inventory" | the CELLS are sealed; `design.cjs`, `screens.template.html` and both approved references are not. 139 of 218 declared copy strings appear in no sealed `today/test` cell (BLOCKING-B) |
| D.2: a branch whose diff contains `packages/S<N+1>.json` "is a reseal child" | nothing verifies that claim against the chain; any branch can make it (BLOCKING-A) |
| H7: placed "after `:1895`" / "BEFORE `const disk = diskSha(file)`, which is `:1952`" | the two placements skip different code (N3) |

---

## 6. WHAT WOULD MOVE THIS TO ACCEPT

1. D.2's skip derived from the chain (`IDS` at `CHAIN_REF`, the spec's `parent.artifact` equal to
   the artifact just read), failing `FENCE-RESEAL-CHILD-UNVERIFIED` otherwise, plus red-first row
   (8). (BLOCKING-A)
2. C.4's "cannot silently drop them" paragraph replaced by the measurement, and Q7/C.5/OWNER-3
   saying that the copy locks ride on the same answer as the sha256 pins. (BLOCKING-B)
3. The seven cites in section 5 corrected, and N1, N2, N3, N7, N8, N9 taken as edits. None needs
   a new measurement.

I agree with and would not re-litigate: the two-path closed list and the whole of section 0's
measurement; H17 and its two cells; H18 and the conditional list; C.5's five paths including
`MOCK.md`; releasing none of the thirteen today cells; the amended STOP-2 and Q8; the estimate's
shape, to which I would add one hour for BLOCKING-A's chain-derived skip. OWNER-1 remains the most
useful page in the document.

---

## 7. WHAT I DID NOT VERIFY

1. I ran nothing: no `b-package.cjs` in any mode, no suite, no build. Every refusal named here is
   read out of the runner and the cells, not watched.
2. I did not read `rebuild/conform/private`, `src/history.js`, any `ledger/`,
   `C:\Users\joeym\EarnedPort`, `%TEMP%\port-real.log` or the protected soak. No owner measurement
   entered this session; every fixture named here is synthetic.
3. I did not read the C-UI ticket bodies. A.2's and A.5's ticket columns are unverified by both
   reviews now, and N8 says why that matters to Q7.
4. I did not measure the S8 ARTIFACT sha256 for fact 8, and I did not open `rebuild/c-ui-port`,
   `rebuild/c-s9-today-carry` or `rebuild/c-passphrase-normalize`.
5. I read `DECISIONS.md` line 536 only, by number.
6. My count of "139 of 218" is a verbatim substring search over the thirteen `today/test` cells.
   It is a lower bound on the hole: a string that appears in a cell is not necessarily ASSERTED
   by it.

Reviewer: cowork (Earned lane hand), independent of the author, told to disagree and did.
