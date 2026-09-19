# S9-RELEASE-SPEC REVIEW R3 - independent, third round, told to disagree

Reviewer: cowork (Earned lane hand, independent spec review), 2026-09-19.
Under review: `rebuild/lanes/b/S9-RELEASE-SPEC.md` **v3** at `3a5f91f9` on `rebuild/b-s9-ui-pins`,
against v2 `c0bb04e9`, review R1 `f0dc366` and review R2 `d859096a`. Read in the cloud farm at
`3a5f91f9` (synced, head matches the author's); written and committed on the PC in
`%TEMP%\earned-s9`. This round commits exactly one file: this one. I ran no suite, no
`b-package.cjs` and no build.

## VERDICT: REJECT

Two BLOCKING findings, both inside PM-R6's pair of new cells, both measured rather than argued,
and one of them proved by running the real function rather than by reading it. Everything else
in round 3 holds: **R2 BLOCKING-A is FIXED and its one disputed clause is DISPUTE UPHELD in the
author's favour, and all ten R2 notes are FIXED.** Eight of the nine PM rulings are carried out
faithfully; the ninth (PM-R6) is carried out in form and not in effect.

Proportion, because this is the third REJECT on a document that keeps getting better: the
release mechanism itself (H1 to H13, H17, the token grammar, the artifact `released` block, the
receipt skip, STOP-2 as amended) is now, in my reading, correct and I could not break it. H18 is
right. The fence's chain-derived skip is a real fix. The two blocking items are about the design
of record and the copy locks, which is the part of this document that has now been wrong in
three different ways in three rounds, and the fix for both is hours of document work, not a new
round of measurement.

---

## 0. THE TWO PM-R6 NUMBERS, RE-MEASURED BY ME FIRST

As instructed I wrote my own scripts and took both numbers before opening C.5. Both reproduce
**exactly**, including the figures I expected to have to correct.

| what | author's value | mine | method |
|---|---|---|---|
| PACK-PIN over the 09-18 pack at `5f4cad0a`, `quality/**` and `README.md` excluded | `6121aa91904d10abdbbd8ad55f8c3436f9ddc0908887ba6f2634cb744d94953b` over 53 files | **identical, 53 files** | `git ls-tree -r`, `git cat-file blob`, sha256 per blob, one line `<path> <space> <64-hex>` per file sorted by path bytes, sha256 over the UTF-8 concatenation |
| pack total at `5f4cad0a` | 75 files, 22 excluded | **75, 22 excluded (21 under `quality/`, plus `README.md`)** | same listing |
| pack at `ecbef86a` (head of `rebuild/c-ui-0-gates`) | 904 files, 851 excluded | **904, 851** | same |
| the pinned half between `5f4cad0a` and `ecbef86a` | 53 identical, 0 moved, 0 added, 0 removed | **53 / 0 / 0 / 0, and the PACK-PIN value at `ecbef86a` is the same 64 hex characters** | per-path blob compare |
| `DECISIONS:530`'s `README.md sha256 c151a79d...` | not reproducible | **not reproducible: the README blob at `5f4cad0a` is `e4e9effdcaa1b828c8addae0d8908977c114050620d63daeebdabaa2c602ba7a`** | direct hash |
| the five copy arrays | 218 strings, 200 distinct; 3 / 60 / 21 / 18 / 116 | **218, 200 distinct; 3 / 60 / 21 / 18 / 116** | loaded `design.cjs` and counted |
| verbatim in the pinned half of the 09-18 pack (18 text files) | 139 of 218 | **139 of 218** | substring search |
| per array against the pack | 1 / 14 / 21 / 0 / 103 | **1 / 14 / 21 / 0 / 103** | same |
| APPROVED-DERIVED (99) against the files `design.APPROVED` names | 99 of 99 | **99 of 99** | same |
| PREVIEW-OWNED (119) against the same two files | 0 of 119 | **0 of 119** | same |
| APPROVED-DERIVED against the 09-18 pack | 35 of 99, so 64 would go red | **35 of 99** | same |
| the pack files that carry the hits | `STATE-INVENTORY-DRAFT.md` 130, `states-today.js` 70, `states-workout.js` 41, `states-coach.js` 15, `states-index.js` 14 | **identical, all five** | per-file count |

I also re-measured the numbers the earlier rounds moved: `REQUIRED_INPUTS` is **48** path
literals with **26** under `today/` (3 engine, 3 client, 1 coach, 8 `m4`, 7 other `m3`); the S8
artifact holds **224** product entries and **71** execution pins, **49** under `w7-preview/`,
**23** under `today/`, **12** product pins and **13** execution pins under `today/test/`, **zero**
paths under `rebuild/m1/`, and 21 artifact keys. `design.cjs`, `gym-model.mjs`,
`checkin-app.mjs`, `today-model.cjs`, `screens.template.html`, `browser-check.mjs` and
`index.shell.html` are in neither map. Every sha prefix C.5 and section 0 quote is right.

So the author's arithmetic is not the problem in this round. What the numbers are used FOR is.

---

## 1. BLOCKING

### BLOCKING-E. COPY-BIND asserts nothing the seal does not already assert, and does not close the hole it was built to close

I ran this one rather than reading it. `design.assertDesignBinding` (`design.cjs:527-:560`)
already contains, today, both of COPY-BIND's two rules, word for word in code:

```
541|   for (const line of APPROVED_COPY) {
542|     assert(approvedText.includes(line), `COPY-BINDING FAIL: declared approved copy missing upstream: "${line}"`);
543|     assert(templateHtml.includes(line), `COPY-BINDING FAIL: declared approved copy missing from the template: "${line}"`);
...
546|     for (const line of [...RUNTIME_COPY, ...CHECKIN_RUNTIME_COPY]) {
547|       assert(approvedText.includes(line), ...);
...
550|     for (const line of PREVIEW_RUNTIME_COPY) {
551|       assert(!approvedText.includes(line), ...);
```

C.5.2 item 1 is line `542`. C.5.2 item 2 is line `551`. And `design.test.cjs:72` runs the whole
function with the real approved references, the real template and the real view source, from
inside a cell that IS sealed (`0db62ca9...`, both maps) and IS CI-homed on both OS. So the cell
S9 proposes to write re-implements two assertions that a sealed, CI-homed cell already executes.
The spec's own A.4 row 6 says this in its "CALL SITE yes" column and then C.5.2 does not connect
it.

That would be a note. This is blocking because of what follows from it. **The thing that was
missing was never the assertion. It was the corpus, and PM-R6's own words say what the cell has
to stop: "so a sentence cannot leave the template and the array together." COPY-BIND does not
stop that, and neither does anything else S9 adds.** Measured by execution, in memory, changing
no file in the repository: I compiled `design.cjs` twice, once as it stands and once with one
entry removed from `APPROVED_COPY`, and called the real `assertDesignBinding` against the real
approved references:

| fixture | result |
|---|---|
| remove `"Your full nutrition plan"` from the TEMPLATE only, array intact | **FAILS**, `COPY-BINDING FAIL: declared approved copy missing from the template`. Correct, and this is the guard that exists |
| remove it from `APPROVED_COPY` **and** from the template, one commit, exactly the edit C.4 measures | **PASSES.** `report.copy` returns 217, and `design.test.cjs:74-:75` compares 217 against the sum of the five array lengths, which is also now 217. Green in CI, green under `--ci --package S9`, green under the D.2 fence, green under COPY-BIND as C.5.2 specifies it, and green under PACK-PIN because the pack did not move |

Both loops iterate the ARRAY. A rule of the form "every string in the array occurs in the
corpus" can never notice a string leaving the array, whatever the corpus is. The five arrays live
in `design.cjs`, which PM-R6 rules stays unsealed, and **nothing in the tree or in S9 fixes their
contents or even their length**: I searched every cell that names them.
`design.test.cjs:74-:75` is self-referential, `:95` asserts only `PREVIEW_RUNTIME_COPY.length >= 5`,
and `machine-settings-ui.test.mjs:813`/`:1071`, `problem.test.mjs:298`/`:1933`/`:3474`,
`food.test.mjs:732`/`:1066`/`:1186` all run in the screen-to-array direction
(`design.PREVIEW_RUNTIME_COPY.includes(line)`), which a coordinated deletion satisfies by
deleting both sides. `setup.test.mjs:1080-:1081` iterates `APPROVED_COPY` itself.

So after S9, as specified, the sentence in C.4 that the author correctly wrote against v2 is
still true of the tree: *a lane C commit that removes the sentence from `screens.template.html`
AND from `APPROVED_COPY` in `design.cjs` is green everywhere.* C.5.2's closing claim that this
"is stronger than the wording it replaces", the R2 section's "the copy locks and the sha256 pins
now ride the same two cells, which is what BLOCKING-B asked for", and TOLD-3's promise to the
owner that his words on the screens "are now actually locked" are all one row short of true, in
the same place, for the third round running.

Required, and it is small: COPY-BIND must carry **its own literal corpus of the 99
approved-derived strings** (or a sha256 over the three arrays sorted, with the count beside it)
inside the sealed cell, and assert for each (a) that it is still in the array, (b) that it occurs
verbatim in a file `design.APPROVED` names, and (c) that it occurs verbatim in
`screens.template.html` or in a view source. (a) is the clause that makes the promise true; (b)
and (c) already exist and are worth keeping only because the cell that holds (a) may as well hold
them. Red-first: delete one entry from `APPROVED_COPY` and from the template in the same fixture
and the cell FAILS naming the sentence. That fixture is the one B.8's `copy-bind.test.mjs` row
(3) should have carried; the row it does carry ("removing one sentence from BOTH `design.cjs` and
the REFERENCE file") describes a failure that comes from `product()` `:1967` refusing a
`pinned-unchanged` byte move, which is the declaration doing the work and not the cell, so that
row is not a red-first plan for this cell at all.

**A note for the PM inside this finding, because it is PM-R6's wording and not only the author's
build of it.** PM-R6 (ii) asks that every array string "occur verbatim in the pinned pack's own
copy sources ... so a sentence cannot leave the template and the array together." The second
clause does not follow from the first, against ANY corpus, for the reason above. The author was
right to measure before specifying and right to report the 35 of 99 rather than bend it; the part
that needed disputing was the mechanism, not the corpus, and v3 disputed the corpus instead.

### BLOCKING-F. PACK-PIN and COPY-BIND are specified against a tree state that S9 itself removes, and the spec never says which tree the cells read

Three measurements, none of which is in the document:

1. **`rebuild/m1/approved-2026-09-18/` does not exist on the chain branch.** At the chain tip
   (`rebuild/t2-client-core`, now `c15a69c0`) `rebuild/m1/` holds `BACKEND-PACKET.md`,
   `MOCK.md`, `earned-mock.public.html` and `approved-2026-09-08/` (15 files) and nothing else:
   `git ls-tree -r HEAD -- rebuild/m1/approved-2026-09-18/` returns **zero** paths. The pack
   lives only on `rebuild/c-ui-port` (`5f4cad0a`) and `rebuild/c-ui-0-gates` (`ecbef86a`), and
   `git merge-base --is-ancestor` says **neither commit is an ancestor of the chain tip**.
2. **C-UI-1 is what brings it, and C-UI-1 seals inside S9.** `DECISIONS:536` (1) says the release
   happens inside "S9, which also carries C-UI-1"; the spec's own E.1 repeats it; `DECISIONS:530`
   says `design.cjs`'s pins move to the 09-18 pack "when C-UI-1 seals"; and the ticket itself
   (`C-UI-1.md`, read at `origin/rebuild/c-ui-0-gates`) says "MAY CHANGE:
   `rebuild/m3/w7-preview/today/design.cjs` (the pins, the fonts, the inlined stylesheets)" and
   "SEQUENCING: first. Pins move in this ticket only."
3. **The spec never says whether `pack-pin.test.mjs` hashes the working tree or git objects.**
   C.5.1's serialisation row says the value is taken over "the bytes AS THEY STAND IN GIT", and
   its "which commit's pack" row says `5f4cad0a`, "not the current head of a lane branch".

Put together, H19 has no tree it can run in:

- **If the cell reads git at `5f4cad0a`**, the value can never change, so red-first rows (1) and
  (3) are unreachable by construction, and on a CI runner the object is not even present:
  `actions/checkout` fetches the pushed ref, and `5f4cad0a` is on an unmerged lane branch.
- **If the cell reads the working tree and C-UI-1 has not landed**, the 53 files are absent and
  the cell either fails on every S9 branch push or is written to skip when the directory is
  missing, which is a vacuous pass a lane C branch gets by deleting the pack.
- **If the cell reads the working tree and C-UI-1 HAS landed**, which is the plan, then
  `design.APPROVED` has moved to the 09-18 pack in the same package. Then: the four
  `pinned-unchanged` declarations of E fact 17 pin four 09-08 files that nothing reads any more;
  COPY-BIND's corpus becomes the 09-18 pack, where C.5.2's own measurement says **64 of the 99
  approved-derived strings do not occur**; and `design.test.cjs:23-:24`, a sealed cell, asserts
  by literal that `approved[0].file` matches `/Earned-refinement-A\.html$/` and `approved[1].file`
  matches `/Earned-additions-C-approved\.html$/`, names that do not exist anywhere in the 09-18
  pack, so C-UI-1 must edit that sealed cell too.

So R13 and OQ-2 are not, as the document says, a warning for "lane C-UI, before C-UI-1 is
written" and a wall that arrives later. **On the spec's own sequencing the wall is inside S9**,
and E.2's row for H19 in the "depends on C-UI-1?" column answers "no" where the measurement says
yes. This is the one place in the document where the round's organising claim (nothing in the
release depends on C-UI-1's bytes) is asserted about something that is not part of the release.

Required: C.5 states (a) which tree the two cells read, in one sentence each, and (b) what is
true of `design.APPROVED`, of the four `pinned-unchanged` paths and of COPY-BIND's corpus on the
day C-UI-1 seals inside this package, with the `design.test.cjs:23-:24` edit named as a hunk if
it is one. If the honest answer is that H19 cannot be judged until C-UI-1's bytes exist, then
H19 moves to the WAIT column of E.2 and F.2 gains a stop for it, and the round says so rather
than scheduling it on day 1-2. I do not think the two cells should be dropped; PACK-PIN over a
pack that is about to arrive is worth having, and the four `pinned-unchanged` declarations are
worth having whatever happens to the cells. I am blocking on the document claiming a schedule
its own dependencies refuse.

---

## 2. THE R2 FINDINGS

### The two blocking

**R2 BLOCKING-A (the fence's reseal-child skip is declared by the branch being fenced): FIXED,
and its one disputed clause is DISPUTE UPHELD in the author's favour.** D.2's skip row now
defaults to FAIL `FENCE-RESEAL-CHILD-UNVERIFIED` and requires five chain-anchored conditions,
and red-first row (8) is written with four failing sub-rows and one green control, before the
skip has a happy path. I checked the dispute rather than accepting it: `IDS` at
`b-package.cjs:173` on the chain is exactly
`['B-NTC','H3','S3','S4','S5','S6','S7','S8','B1','B2','B4','B3']`, with no `'S9'`, and E fact 1
is the hunk that adds it on the child's own branch. R2's clause ("`packageId` must be an id
`IDS` carries at `CHAIN_REF`") would therefore have refused every legitimate reseal child
including S9. The author's inversion (condition 3, the id must be ABSENT at the chain ref) plus
condition 4 (the id must be present in `IDS` in the branch's own `b-package.cjs`) is the right
shape. Two residual notes on it, N3 and N4 below; neither is blocking.

**R2 BLOCKING-B (C.4's copy-lock row makes the claim R1 blocked C.4's sha256 row for): the
document edits R2 asked for are FIXED; the remedy they motivated does not hold.** C.4's
"cannot silently drop them" paragraph is withdrawn and replaced by the measurement, which is what
R2 required, and the measurement is right (I re-took it). Q7 and OWNER-3 are re-framed, and TOLD-3
tells the owner about his copy as well as his design files. What is not true is the new claim
that the two cells make the copy locks real: see BLOCKING-E.

### The ten notes

| # | R2 note | my verdict | what I checked |
|---|---|---|---|
| N1 | D's cell is narrower than D's claim | **FIXED** | D.2's "what it is NOT" row names `today-model.cjs:378`, `gym-model.mjs:502`, `checkin-app.mjs:150` by file and line, says PM-R3 brings two inside, and requires the brief to say the fence passes a branch that rewrites the weigh-in bounds. D.4 references the WRITER-FENCE without specifying it, which is what PM-R4 asked |
| N2 | H17 moves the `gkept` count in silence | **FIXED, confirmed** | `pins()`'s terminal really is `:1855-:1858` and `:1856` prints `gkept` as "un-superseded grandparent pin(s)". B.5 H17 carries the say clause and F.2 STOP-2 admits that one non-asserting change by name |
| N3 | H7 named two placements 57 lines apart | **FIXED, and the argument is right** | One placement now, immediately before `:1952` `const disk = diskSha(file)`. I re-derived the justification: `:1915-:1916` passes because the role is not `pinned-unchanged`; `:1943-:1949` passes because `noChange` is `pin.pre !== null && pin.pre === pin.post`, false when `post === null`; `:1951` is the `new`/`post === null` precedent one line above. Exact |
| N4 | two cites land on the comment above the statement | **FIXED, confirmed** | `:1966` is the comment and `say('PRODUCT ' + phase ...)` runs `:1983-:1987`; `:1908` is the comment and the `new`/`pinned-unchanged` assert is `:1909`. Both re-cited. One NEW cite of the same class appears in this round: see note N6 |
| N5 | `pinned-unchanged` is the correct role | **CONFIRMED** | `:1909` admits it for a file the parent pins in neither map, `:1915-:1916` refuses it for a parent pin, `:1967` checks `disk === pin.pre`, `:1945-:1949` would refuse `new` at `pre === post`. All four of the `rebuild/m1/` paths and both writers are absent from both S8 maps, so the role is right for all six |
| N6 | `REQUIRED_INPUTS` holds 48, not 51 | **FIXED, re-measured** | 48 path literals between `:98` and `:201`, 26 under `today/`, and the non-path quoted strings really are comment prose. A.4, H18 and E fact 16 all say 48 |
| N7 | "five laws" is short by two | **FIXED, wider than asked** | Seven laws with a call site column, and the four hygiene asserts named. I opened every call site: `:471` TEMPLATE-SLOT, `:472` `assertDesignBinding`, `:480` `assertBundleInputs`, `:484` `assertImportRouteIsolation`, `:497` `assertNoNetworkReference`, `:499` `assertNoNodeOnlyGlobals`, `:501` `assertNoAiDashesInAssets`, `:452` `realDirectory`, `:504` OUTPUT-CLEAN, `:508` PACKAGE-ALLOWLIST. All exact. The sealed-cell evidence is exact too: `package.test.cjs:59-:60`, `:72-:73`, `:76-:80`, `:84`, `:94-:107`, `:127-:138`; `copy.test.mjs:207`, `:264`, `:303`, `:395`, `:405`; `page-bundle.test.mjs:54-:61` |
| N8 | OWNER-3 understates the option it recommends | **FIXED by PM-R6 deciding the other way** | The recommendation is withdrawn, not re-worded, and TOLD-3 says plainly that the file the design team edits every day is deliberately not locked |
| N9 | C.2 deletes a live guard it says needs no change | **FIXED, confirmed at the line** | `boundary.test.mjs`: the constant is `:179-:180`, the loop `:185-:190`, `Object.hasOwn(product, f) === false` is `:186-:187`, `shaOf(f) === declaredPost(f)` is `:188-:189`. C.2 now deletes only `:188-:189` |
| N10 | no em or en dash | **CONFIRMED** | zero U+2013 and zero U+2014 across all 1393 lines of v3 |

**Nothing in R2 is left open except through BLOCKING-E**, and R2's own reservation (point 6, that
a substring census is a lower bound on binding) is carried into the spec's Appendix 11, which is
the right place for it.

---

## 3. THE NINE PM RULINGS, ONE BY ONE

| ruling | carried out? | what I checked |
|---|---|---|
| **PM-R1** (two-path list accepted, TODAY-SPLIT its own lane, S9 does not wait) | **YES, with one measured understatement: see note N1** | Section 0, A.2.1, A.6 and E.2's conditional row all say it, and I confirmed the release mechanism names `today-app.cjs` nowhere. The "exactly four things" list is short |
| **PM-R2** (`build.mjs` only with H18; fix the 51 and the five) | **YES** | 48 and seven, both re-measured; A.6 makes the second path conditional on H18 and STOP-6 fires if it cannot be built |
| **PM-R3** (`gym-model.mjs` and `checkin-app.mjs` declared; `today-model.cjs` not declared but carried out loud; `browser-check.mjs` outside, no CI home, run on the PC, recorded in the VERDICT) | **YES** | A.5's three rows, E facts 17 and 19, D.2's "what it is NOT" row and F.1 R7 all carry it. I checked the cost of the two new declarations and it is zero: C-UI-4 and C-UI-2 already ride a reseal child for `gym-app.mjs` and `today-app.cjs`, so sealing `gym-model.mjs` and `checkin-app.mjs` takes no freedom the tickets had |
| **PM-R4** (fence under `rebuild/lanes/c/ui-port/`, skip derived from the chain, row (8), section D references the WRITER-FENCE) | **YES** | D.2's two rewritten rows, red-first row (8) written first, and D.4. Notes N3 and N4 below are residual, not refusals |
| **PM-R5** (the released block records no post sha) | **YES** | B.4 unchanged, B.7 consistent with it |
| **PM-R6** (do not seal `design.cjs`; PACK-PIN and COPY-BIND, measured first) | **IN FORM ONLY** | The measurement is right and honest, including the refusal to bend the literal wording. The two cells do not hold: BLOCKING-E and BLOCKING-F. One note for the PM inside BLOCKING-E about the ruling's own second clause, and one below about its premise |
| **PM-R7** (STOP-2 ratified; fix N2, N3, N4, N9) | **YES** | All four fixed and re-checked at the line |
| **PM-R8** (OWNER-1 replaced by a TOLD paragraph) | **YES** | F.5 TOLD-1 says what the release frees (two files, the first and the last look ticket), that the one-week figure assumed an unmeasured split, and that the split is its own reviewed lane. It is written for a phone and it asks nothing. STOP-5 is rewritten to match |
| **PM-R9** (restate the estimate on the generator; say what remains hand work and what starts today) | **YES** | `rebuild/b-seal-gen` is pushed at `5bad0dc8`; I read `gen/README.md` in the farm and its own numbers are 800 facts compared, 791 identical, four files byte-identical, 21 seconds, no `--write`, and `new-child.cjs --released <path>` exists and refuses to propose the role on its own. F.3's two-column table adds to 32, the hand-work list matches the table, and the four-step schedule is consistent with E.2 |

**A note to the PM on PM-R6's premise, argued both ways.** The ruling rests on "the design lane
edits `design.cjs` in most tickets". The ticket bodies do not support that: I read all eight at
`origin/rebuild/c-ui-0-gates` and `design.cjs` is named in **C-UI-1 only**, which is exactly the
row (A.5, "`design.cjs`, ticket 1 only") that R2 N8 doubted and that PM-R6 was built not to rest
on. What DOES support the ruling is elsewhere and is stronger: `DECISIONS:542` (D) records that
S9-TODAY-CARRY, which rides S9, edits `design.cjs` itself (`headlineVocabulary` reading template
literals and `propose()`'s second argument, 15 titles to 30). So a second lane is editing the
file inside this very package, and the mechanism agrees: `assertDesignBinding` requires every
class token on screen to be in the approved stylesheets or in `PREVIEW_CLASSES`, so a look ticket
that adds a class or a sentence moves `design.cjs` whether or not its ticket says so. **The
ruling stands; the reason given for it does not, and the reason that does is one ledger line
away.**

---

## 4. WHAT I TRIED TO BREAK IN THE TWO NEW CELLS AND COULD NOT

Recorded because a reviewer who lists only faults is not reporting a measurement.

1. **PACK-PIN by moving a board or an app file.** The 53 pinned paths include both rendered
   boards (`ref/ink-board.png`, `ref/dawn-board.png`), the four native renders, every
   `app/*.html`, `app/*.js`, `app/*.css`, both woff2 typefaces, all 18 compare JPEGs and the
   three `states/*.md`. Any byte move in any of them moves the pin. I verified this the direct
   way, by recomputing the whole value at a second commit.
2. **PACK-PIN by line endings or by blob-versus-working-file.** This attack fails, and for a
   reason worth citing: `.gitattributes` sets `* text=auto eol=lf` for the whole repository, with
   `*.png`, `*.jpg`, `*.woff2` and the rest marked `binary`, so the working tree is LF on both
   OS and the blob and the checked-out file are the same bytes. The author's choice of `gitSha`
   semantics (`b-package.cjs:613`) is right and is not load bearing here, which is the best kind
   of defence.
3. **PACK-PIN by adding a file.** A file added anywhere outside the exclusions adds a line to the
   serialisation and moves the pin; a file deleted removes one. Closed in both directions, with
   one caveat in note N5.
4. **COPY-BIND by a string that occurs only by accident.** This one half succeeds and I record it
   as a note rather than as blocking, because it does not change the verdict: **14 of the 99
   approved-derived strings are six characters or fewer** (`Earned`, `Today`, `Low`, `High`,
   `None`, `Mild`, `Poor`, `Okay`, `Good`, `Pain` twice, `New`, and the two fragments `" of "`
   and `" reps"`), so a new array entry of `New` or `Good` binds trivially against any English
   reference. The spec names this itself in Appendix 11, which is the honest place for it,
   though it says 17 and I measure 14 occurrences and 13 distinct strings.
5. **COPY-BIND by editing the pack's exclusion list.** The exclusions live in the cell, the cell
   is declared `role: "new"` by S9 and is therefore a sealed byte from S9 on, so lane C cannot
   widen them without `product()` `:1970`/`:1972` refusing. Sound, subject to note N5.
6. **The released role, the token line, H17 and the receipt skip, re-read for round-3 damage.**
   The `RELEASE_GRANT` regex and the exact S9 token line are byte-identical to v2. B.4's
   `released` block, its `"role": "released"` literal and the `ARTIFACT_KEYS` argument are
   unchanged. H12 and H13 are unchanged and B.6's receipt row still carries the `:3190-:3194`
   correction and the count change. H17 is unchanged except for the say clause N2 asked for, and
   its `releasedAncestry()` skip is still keyed only on an ancestor artifact's `released` block.
   I re-derived the whole of `pins()` (`:1834-:1859`) and `held()` (`:1828-:1833`) at the line
   and B.3's S10 trace is exactly what the code does. **Round 3 broke nothing that R1 and R2 had
   accepted.**
7. **H7's new single placement.** Verified above (R2 N3). Nothing a released pin needs is skipped
   and nothing it would fail is left live.
8. **The order of work.** I could not find a NOW item in E.2 that needs C-UI-1's bytes **except
   H19**, which is BLOCKING-F.

---

## 5. NOTES (not blocking)

**N1. A.2.1's "exactly four things and no new mechanism" is short, and the spec it could not read
is now on origin.** Appendix 4 says `farm-sync.sh rebuild/c-today-split` answers "couldn't find
remote ref". That was true when it was written and is no longer: `origin/rebuild/c-today-split`
carries `rebuild/lanes/c/TODAY-SPLIT-SPEC.md` at `14c87fa7`, pushed at 02:12, five minutes before
v3's commit. I read it, so OQ-3 can be closed rather than carried. Against it, A.2.1's list of
what S9's package gains is short in three ways: the split creates **six** free files (five view
modules plus `today-projection.cjs`), not an unnumbered set; `today-model.cjs` does not move
wholesale, its four writers stay and only the pure projection leaves; and **at least five sealed
`today/test/*` cells must be edited and therefore declared `role: "edited"` with new posts**
(TODAY-SPLIT's own D.3 table lists `copy.test.mjs:406`, `design.test.cjs:79-:81`,
`food.test.mjs:707`/`:763`/`:897`, `problem.test.mjs:1945`/`:1980`/`:1989`/`:2003-:2008`, and
flags `setup.test.mjs:1035` as unknown). Those declarations are the largest part of what S9 would
gain, and A.2.1 does not name them. Separately, A.2.1 item 1 presents `today-app.cjs` role
`edited` as a TODAY-SPLIT-conditional gain; `DECISIONS:542` (D) already requires it for
S9-TODAY-CARRY (the one binding line at `:869`), so it is true either way.

**N2. Section 0's candidate table names a file `DECISIONS:536` does not, and drops one it does.**
`:536`'s eight candidates are `today-app.cjs`, `screens.template.html`, `preview.css`,
`build.mjs`, `design.cjs`, `browser-check.mjs`, `today-model.cjs` and **"the today test cells
that pin only rendering"**. I searched the whole of line 536: `index.shell.html` appears nowhere
in it. The table substitutes `index.shell.html` for the test-cell category, and since the test
cells ARE sealed (12 product pins, 13 execution pins) the headline "five of the eight are not
sealed today" is not the ruling's eight. The honest form is: four of the seven files the ruling
names are already free, `today-app.cjs` fails the ruling's own test, and the eighth candidate is
the test-cell category, which C.3 measures and releases none of. Nothing downstream moves; the
closed list is still two. Both earlier reviews repeated this, so it is mine to catch.

**N3. D.2's skip condition (1) will refuse S9's own diff unless it reads `--name-status`.** The
row asks for "EXACTLY ONE new `rebuild/lanes/b/tooling/packages/<ID>.json`", but the "what it
asks" row builds the diff with `git diff --name-only`, which cannot tell added from modified. E
fact 7 re-pins the runner sha in `packages/H3.json`, `S3`, `S4`, `S5`, `S6`, `S7` and `S8`, so a
real reseal child's diff carries **eight** `packages/*.json` paths, one added and seven modified.
One word fixes it: say `--name-status` and say that only status `A` counts.

**N4. The chain-derived skip is backed by the seal, not by the fence, and condition (3) inverts
after the merge.** Conditions (1), (2) and (5) are all values a forging branch can copy out of
the chain, since the artifact path and its sha256 at `CHAIN_REF` are public. The only condition
that costs anything is (4), which requires the branch to add its id to `IDS` in
`b-package.cjs` - a sealed byte, caught by `fidelity()` (`:2005`'s diff roots include
`rebuild/lanes/b/tooling`) and by the runner pin at `:2012` on the same CI run. That is a real
bar and I am not asking for more, but D.2 should say it in one sentence, because a reader of the
row will think the fence holds the gate when what holds it is the seal behind the fence. Second:
condition (3) requires `<ID>` to be ABSENT from `IDS` at `CHAIN_REF`, which stops being true the
moment the child merges, so a later push to the same lane branch fails `FENCE-RESEAL-CHILD-
UNVERIFIED`. Harmless in practice and worth one clause.

**N5. C.5.1's "one sha256" cannot produce B.8's three refusal names, and the exclusion needs
anchoring.** B.8's `pack-pin.test.mjs` row wants `PACK-PIN MISMATCH` naming the path, `PACK-PIN
MISSING` and `PACK-PIN ADDED`. A single composite sha256 over the whole serialisation can only
say "different". To name the path the cell has to hold the 53-line list, not one value. Say which
it holds. Separately, `quality/**` and `README.md` must be anchored at the pack root: on an
unanchored segment match, a file placed at `app/quality/x.js` or `app/README.md` leaves the pin.

**N6. One new cite in this round lands on the wrong line, in the round that swept two others.**
A.4 row 1 says `page-bundle.test.mjs` is "CI-homed at `rebuild.yml:232`". It is not:
`rebuild.yml:232` is the A1/A2/A3/A4 run line and its 17 cells are the thirteen `today/test/*`
and four `measure/test/*` cells, with no `import/` path among them. `page-bundle.test.mjs`'s CI
home is the P3 step at `rebuild.yml:264-:265`. The claim (that it is sealed, execution-pinned and
CI-homed) is TRUE; only the number is wrong, and R2 supplied the wrong number first. Also in
A.4 and C.4, `assertNoAiDashesInAssets` is given as "implemented `build.mjs:31`"; `:31` is the
destructuring import from `plain-copy.cjs`, which is where it is implemented.

**N7. Appendix 8 and A.2.1 contradict each other about the C-UI ticket bodies.** Appendix 8 says
"I did not re-read the C-UI ticket bodies; A.2's and A.5's ticket columns are v1's reading of
them", while A.2.1's table is headed "measured from the tickets
(`git show origin/rebuild/c-ui-0-gates:rebuild/lanes/c/ui-port/C-UI-N.md`)". I checked the
quotes: they are verbatim and correct (C-UI-2's "bindings only: the slots keep their names",
C-UI-3's "`today-app.cjs`'s proposal binding", C-UI-6's "the coach stub in `today-app.cjs`
becomes the coach screen", C-UI-7's "the Why this plan view in `today-app.cjs`"). So the tickets
WERE read and Appendix 8 is now the untrue sentence. Correct it, and take the credit: A.5's
`screens.template.html` row says "2,3,4" and C-UI-3 does not name that file, and C-UI-7 says
`food-*` rather than `food-host.mjs`, which are the only two slips I found in either column.

**N8. E could now name S9-TODAY-CARRY's four declarations.** `DECISIONS:542` (D) measured them
after v2 was written: `today-app.cjs`, `test/view.test.mjs`, `test/adapter.test.mjs` and
`.github/workflows/rebuild.yml`, "FOUR, not the three the ticket named". E.1 carries the lane as
context only, which was right when the number was unknown; it is known now, and one of the four
is the file the whole of section A is about.

---

## 6. DISPUTED CITES, IN ONE LIST

| the spec says | the file or the tree really says |
|---|---|
| `DECISIONS:536` names eight release candidates including `today/index.shell.html` (section 0) | line 536 never contains `index.shell.html`; its eighth candidate is "the today test cells that pin only rendering" (N2) |
| `page-bundle.test.mjs` is CI-homed at `rebuild.yml:232` (A.4 row 1) | `:232` is the A1/A2/A3/A4 run line, 17 cells, none under `import/`; its CI home is `:264-:265` (N6) |
| `assertNoAiDashesInAssets` implemented `build.mjs:31` (A.4 row 7, C.4 row 1) | `:31` destructures it from `plain-copy.cjs`, which implements it (N6) |
| "I did not re-read the C-UI ticket bodies" (Appendix 8) | A.2.1 quotes four of them verbatim from `origin/rebuild/c-ui-0-gates` and the quotes are exact (N7) |
| `rebuild/c-today-split` is NOT on origin (Appendix 4, OQ-3) | it is, at `14c87fa7`, with `rebuild/lanes/c/TODAY-SPLIT-SPEC.md`; true when written, stale now (N1) |
| 17 of the 99 approved-derived strings are six characters or fewer (Appendix 11) | 14 occurrences, 13 distinct (section 4 item 4) |
| COPY-BIND "is stronger than the wording it replaces" and makes the copy locks real (C.5.2, R2 section) | its two rules are `design.cjs:542` and `:551`, already executed from inside the seal by `design.test.cjs:72`, and the coordinated deletion still passes (BLOCKING-E) |
| `pack-pin.test.mjs` "can be written and measured TODAY" and does not depend on C-UI-1 (E.2) | `rebuild/m1/approved-2026-09-18/` is absent from the chain tip and neither `5f4cad0a` nor `ecbef86a` is an ancestor of it (BLOCKING-F) |

---

## 7. WHAT WOULD MOVE THIS TO ACCEPT

1. COPY-BIND carries its own literal list of the 99 approved-derived strings (or a sha256 over
   the three arrays with their count) inside the sealed cell, and asserts that each is still in
   the array as well as in the corpus; B.8's red-first row (3) becomes the array-plus-template
   deletion; C.5.2, the R2 section and TOLD-3 say what the cell does and does not do.
   (BLOCKING-E)
2. C.5 says which tree each of the two cells reads, and what is true of `design.APPROVED`, of the
   four `pinned-unchanged` paths and of COPY-BIND's corpus on the day C-UI-1 seals inside this
   package; H19 moves out of E.2's day 1-2 column if the answer is that it cannot be judged
   first. (BLOCKING-F)
3. N2, N3, N5, N6 and N7 taken as edits. None needs a new measurement.

I agree with, and would not re-litigate: the two-path closed list and the whole of section 0's
inventory measurement; H1 to H13; H17, its say clause and its two cells; H18 and the conditional
second path; the token grammar and its six binding steps; the artifact `released` block and
PM-R5; releasing none of the thirteen today cells; C.2 as PM-R7 ratified it; the fence's
chain-ref inventory read and its chain-derived skip; D.4's referencing of the WRITER-FENCE;
the six `pinned-unchanged` declarations, which are the part of C.5 that actually makes
`DECISIONS:536`'s first promise true; TOLD-1 and TOLD-2; and F.3's estimate on PM-R9's terms,
to which I would add one hour for BLOCKING-E's literal corpus.

---

## 8. WHAT I DID NOT VERIFY

1. I ran no suite, no `b-package.cjs` in any mode and no build. The only code I executed was my
   own read-only measurement scripts and one in-memory compile of `design.cjs` with one array
   entry removed, which wrote nothing to any working tree. Every predicted refusal in B.8, C.5
   and D.2 remains a prediction.
2. I did not read `rebuild/conform/private`, `src/history.js`, any `ledger/` directory,
   `C:\Users\joeym\EarnedPort`, `%TEMP%\port-real.log` or the protected soak, on either machine.
   No owner measurement entered this session and every fixture named here is synthetic.
3. I did not measure the S8 ARTIFACT sha256 for E fact 8, and I agree with the spec that the
   receipt sha of `DECISIONS:529` is a different object.
4. I did not run the SEAL-AUTOMATION generator; I read its README only, and F.3's numbers rest on
   that README's own replay claim, as the spec says.
5. I read `TODAY-SPLIT-SPEC.md` at `14c87fa7` for note N1 only and pass no judgement on it; it
   has its own review.
6. My COPY-BIND census is a verbatim substring search, so it is a lower bound on binding and an
   exact count of non-binding, exactly as R2 and the spec's Appendix 11 both say.
7. I did not open `%TEMP%\earned-s9carry`, `%TEMP%\earned-passphrase` or any lane worktree but
   this one; the S9-TODAY-CARRY facts in N8 are read out of `DECISIONS:542`.

Reviewer: cowork (Earned lane hand), independent of the author, told to disagree and did.
