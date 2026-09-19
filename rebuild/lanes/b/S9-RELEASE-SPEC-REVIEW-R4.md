# S9-RELEASE-SPEC REVIEW R4 - independent, fourth round, told to disagree

Reviewer: cowork (Earned lane hand, independent spec review), 2026-09-19.
Under review: `rebuild/lanes/b/S9-RELEASE-SPEC.md` **v4** at `b1725d9c` on `rebuild/b-s9-ui-pins`,
against v3 `3a5f91f9` and review R3 `143a650a`. Read in the cloud farm (chain tip `e0e2ac75`, lane
heads `b1725d9c`, `ecbef86a`, `af53fd17`, `8a7da547`); written and committed on the PC in
`%TEMP%\earned-s9`. This round commits exactly one file: this one. I ran no suite, no
`b-package.cjs` and no build; the only code I executed was my own read-only measurement scripts.

## VERDICT: REJECT

**One blocking finding, and it is a sentence rather than a mechanism.** Every revised ruling is
carried out: `PM-R6'(i)` faithfully and well, `PM-R6'(ii)` faithfully except in the one paragraph it
named by name, `PM-R10` with the measurement the PM asked for and it is exact, `PM-R11` in every
note but half of one, `PM-R12` and `PM-R13` in full. R3's two blocking findings are FIXED and all
eight of its notes are FIXED or FIXED-and-overtaken. I attacked the whole-pack pin along every axis
I was given and could not make it green while a pinned file moves.

The blocking item is that **TOLD-3, the paragraph the owner reads, carries a false measurement of
the copy gap, in the round whose whole subject was stating that gap as it is**, and the document's
own STOP-11 exists for that paragraph. Its conclusion is right; the number under it is wrong in both
directions and no reading of any census in this document produces it. I measured the replacement
numbers and they are in the finding, so the fix is one paragraph and needs no new work.

Proportion, because this is the fourth REJECT on a document that keeps improving: I would dispatch
**everything in F.3's PM-R13 list today**, including H19 and H19b's code, without waiting for this
finding to be fixed. Nothing in section B, section D, A.2.1.1, C.5.1 or C.5.3 is touched by it.

---

## 0. WHAT I RE-MEASURED BEFORE OPENING THE DOCUMENT

Every figure below is mine, taken in the farm with read-only node scripts, before I read v4's
version of it. I report the ones that reproduce as well as the ones that do not.

| what | v4's value | mine | method |
|---|---|---|---|
| the pack at `ecbef86a` | 904 git-tracked files: 850 `quality/`, 42 `app/`, 8 `ref/`, 3 `states/`, `README.md` | **identical, all five figures** | `git ls-tree -r --name-only` |
| PACK-PIN's serialisation | 904 lines, about 90 KB, longest pack-root path 43 characters | **904 lines, 92372 bytes = 90.2 KB, longest 43 (`states/COACHING-RULES-INVENTORY-v1-notes.md`)** | built the serialisation |
| the ordering rule | "sorted by path bytes ascending", literal generated from `git ls-tree -r` | **they agree: `ls-tree -r` order is byte order over the full paths for this pack, so step 3 and the cell's compare cannot disagree** | compared both orders |
| working tree versus blob | `.gitattributes` makes them the same bytes on both OS | **measured, not argued: all 904 working-tree files in a real Linux checkout hash identically to their blobs, 0 differences** | sha256 of `git cat-file blob` against sha256 of the file |
| what is untracked inside the pack after gate runs | only `quality/run/` and `__pycache__/` | **exactly those two and nothing else** in a checkout the gates have been run in | `git status --porcelain --ignored` over the pack |
| PM-R10: is `today-app.cjs` a child argv target? | NO; 25 children, 68 distinct targets, every one a test cell | **identical: 25 / 68 / zero source modules** | parsed `packages/S8.json`, applied `childArgv`'s own rule (`b-package.cjs:637-:658`) |
| `today-app.cjs` in the maps | `product` `carried` `dc9a826e...`, NOT in `executionPins` | **identical** | parsed the S8 artifact |
| who imports it | 14 sealed, 11 of them cells, the other three `today-entry.mjs`, `gym-app.mjs`, `measure/test/support.mjs` | **16 importers, 14 sealed, 11 cells, the same three; the two unsealed are `checkin-app.mjs` and `setup-app.mjs`**. This is `DECISIONS:543`'s eleven | resolved every relative specifier and intersected with both maps |
| the five copy arrays | 218 strings, 200 distinct, 3 / 60 / 21 / 18 / 116 | **identical** | loaded `design.cjs` |
| C.5.2 item 3, the released files | `preview.css` 2 hits, `build.mjs` 4 hits, none outside comments in `preview.css` | **identical hit sets** (`preview.css`: `Today`, `" of "`; `build.mjs`: `Today`, `" of "`, `" recorded"`, `Report a problem`), and every `preview.css` hit is inside a `/* */` block | substring search over the 200 distinct |
| the two file sizes in that sentence | `preview.css` 6310 bytes, `build.mjs` 30974 | **6314 and 30991**, both at `023b99f4` and at the chain tip | `wc -c` and `git cat-file -s` |
| C.6's corpus | 419 records, 210 ids, text identical across themes for all 210, 201 distinct texts | **418 records over 209 ids (the 419th file is `INDEX.json`, which has no `text` and no theme), text identical across ink and dawn for all 209, 200 distinct texts** | parsed every record |
| `DECISIONS:536`'s eight | the seven files plus the test-cell category; no `index.shell.html` | **confirmed verbatim: `index.shell.html` appears nowhere in line 536** | read the line |
| E fact 22 | `local-import.test.mjs` exists and `rebuild.yml` names it zero times | **identical** | listed and counted |

Two figures in the copy census do not reproduce (the two byte sizes, note N9) and three in C.6's
corpus do not (note N6). Everything else reproduces exactly, including all three of C.5.1's shape
figures and the whole of PM-R10's measurement, which is the one the PM asked round 4 for.

---

## 1. BLOCKING

### BLOCKING-G. TOLD-3 tells the owner a number that is false, in the round dispatched to state the copy gap as it is

The sentence, `F.5` TOLD-3 as `PM-R6'(ii)` required it rewritten:

> Of the 218 sentences on the locked list, 139 are checked by nothing inside the locked set. A
> sentence could be taken off a screen and off the list in one edit and nothing would notice.

The second sentence is TRUE and is the whole finding of R3 BLOCKING-E. **The first is false, and
139 is not the count of anything that could be described that way.** Measured, three ways, all mine:

| the question TOLD-3 appears to answer | measured |
|---|---|
| how many of the 218 are asserted by a cell inside the sealed set? | **215.** `design.test.cjs:72` (sealed in BOTH maps, `0db62ca9...`, CI-homed on ubuntu AND windows at `rebuild.yml:231-:232`) runs `assertDesignBinding` with the real references, the real template and the real view source: `design.cjs:542-:545` asserts all **60** `APPROVED_COPY` twice, `:547-:550` all **39** `RUNTIME_COPY` + `CHECKIN_RUNTIME_COPY` twice, `:551-:555` all **116** `PREVIEW_RUNTIME_COPY`. The three NOT asserted are `PREVIEW_COPY`, which is a skip list at `:537` and a normalisation check at `setup.test.mjs:1090` |
| how many of the 218 occur in no sealed file at all? | **47** (39 distinct). I searched all 227 sealed files on disk for each of the 200 distinct strings |
| what IS 139, then? | the count from C.5.2's own Measurement 1: **139 of the 218 occur verbatim in the pinned half of the 09-18 pack**, the other 79 do not. It is the number of strings that DO appear in the design pack, handed to the owner as the number that nothing checks |

So the paragraph is wrong in both directions at once. It **understates what the seal already does**
(215 of 218 are asserted from inside a sealed, both-OS cell) and it **understates the exposure**,
because a reader told "139 of 218" will take it that the other 79 are held, and not one of the 218
is held against the edit the next sentence describes. The gap is not a subset. It is the whole list,
in one direction, for every string.

**Why this is blocking and not a note.**

1. It is the OWNER's paragraph. He does not code, and this is the one place in the document that
   tells him where his own words stand. R3 blocked v3 for a claim to the owner that was one row
   short of true; this one is a number that means something else.
2. **`PM-R6'(ii)` named this paragraph**: "Rewrite TOLD-3 accordingly, in plain words: what is
   pinned now (the whole approved pack, gates included), what is honestly still open (the wording
   lock)". The rewrite happened; the measurement inside it did not move. The sentence is v3's, and
   v3's was v2's shape.
3. **The document's own `F.2` STOP-11 is about this paragraph** ("This has now been claimed and
   withdrawn twice, in v2 and in v3, which is why it is a STOP and not a note"). A false number in
   the corrected version is the third time the copy sentence has been wrong.
4. **v4's own change makes the old number obsolete even on its most charitable reading.** If 139
   ever meant "backed only by unsealed bytes", `PM-R6'(i)` has just pinned the entire pack, so the
   139 that occur there are now backed by a literal in a sealed cell and the number moved. The
   paragraph was not re-measured against the change the same round made.
5. It propagates: **C.6 question 3** ends "or it becomes the next `139 of 218 are asserted by
   nothing`", so the false frame is now inside the question list S10's designers will work from.

**The fix is one paragraph and needs no new measurement; here is the substance, with my figures.**
Of the 218 sentences on the list, the locked tests check every one of them in a single direction:
that a sentence still on the list is still on the screen and still in the approved design. Nothing
checks that the list still holds the sentence. So ANY of the 218, not 139 of them, can be taken off
the screen and off the list in one edit, and nothing notices. (If a second number is wanted: 47 of
the 218 do not appear anywhere inside the locked set at all.) C.5.2 item 2 already says this
correctly for the body of the document; TOLD-3 and C.6 question 3 have to say the same thing.

One more sentence in the same paragraph, which I record here rather than as a separate note because
it is the same fix: TOLD-3 tells the owner about "the 844 reference screen images". **844 is the
number of FILES under `quality/baseline/`, and they are not all images:** 424 `.png`, 419 `.json`
state records (of which one is `INDEX.json`) and one `ENV.txt`. The true sentence is better for the
PM's case, not worse: the lock covers 424 reference images AND the record of what each screen says.

---

## 2. THE ATTACK ON THE WHOLE-PACK PIN, AXIS BY AXIS

I was told to attack it. It survives, and the parts that survive are worth recording as precisely as
the parts that do not.

**Can PACK-PIN be green while a gate script, a baseline, a state record, a board or an app file
changes? NO, and the reason is structural rather than lucky.** The cell holds a per-path list, not a
composite value, so a changed file is a changed line; the list is closed in both directions, so an
added and a removed file each have a refusal; the list and the ignore list live inside a cell S9
declares `role: "new"`, so from S9 on widening either is a sealed byte `product()` `:1970`/`:1972`
refuses; and the cell's CI home is a `rebuild.yml` step, and `rebuild.yml` IS in the S8 `product`
map (I re-measured), so removing the step is itself unlisted drift. `rebuild.yml` fires on every
push and every PR to `rebuild/**` (`:4-:7`) on ubuntu AND windows (`:20-:24`), which is every branch
that can reach the chain. B.8's six red-first rows are exactly the six ways the PM named.

**Line endings: confirmed by measurement, not by reading `.gitattributes`.** In a real Linux
checkout at `ecbef86a`, all 904 pack files hash identically to their blobs. `* text=auto eol=lf`
beats the Windows runner's `core.autocrlf`, which is the property the repository's own
`.gitattributes` header says the file exists for. R3 called this "the best kind of defence" and v4
turns it into a requirement; both are right.

**The gitignored run folder: sound, with one residual.** `.gitignore` is in NEITHER S8 map (I
re-measured), so C.5.1 is right to refuse to read it and right to hold its own anchored list. In a
checkout the gates had actually been run in, the only ignored paths present inside the pack were
`quality/__pycache__/` and `quality/run/` - exactly the cell's two entries. The residual is in note
N1: any FUTURE untracked output inside the pack (a virtualenv, a `node_modules/`, a `.tmp/`) reads
as `PACK-PIN ADDED` on the design lane's own machine, and widening the list to admit it costs a
reseal child. There is a cheaper shape, also in N1.

**A file added beside the pack root:** outside the pin by construction, and correctly so; the cover
for a `design.APPROVED` that points outside the pack is APPROVED-PIN, which has a gap of its own
(note N8).

**Symlinks and file types: the one way I found to move a pinned path without moving a line.** All
904 pack entries are mode `100644` today - no symlinks, no submodules, no executables - and v4 does
not say the cell must check that they stay that way. A working-tree walk that reads with
`fs.readFileSync` FOLLOWS a symlink, while the literal was generated with `git cat-file blob`, which
does not. So replacing a tracked pack file with a symlink to a copy of the same bytes leaves the
cell green on Linux while the tree has changed, and on a Windows runner the same commit checks out
as a text file containing the target path, so the same branch is red there and green here. It is
exotic, the content the gates read does not move, and the remedy is one clause (`lstat`, and
`PACK-PIN NOT-A-REGULAR-FILE <path>` for anything that is not a regular file), so it is note N1 and
not a blocking item. It is the only green-while-changed I found.

### 2.1 What it costs the design lane on a normal day: measured from the ticket bodies, and the answer is NOTHING

This is the measurement `PM-R6'(i)`'s price deserves and the spec did not take. I read all nine
ticket bodies at `origin/rebuild/c-ui-0-gates` and took their `MAY CHANGE` lines:

| ticket | does its `MAY CHANGE` name any path inside `rebuild/m1/approved-2026-09-18/`? |
|---|---|
| C-UI-0 | **YES, and it is the whole ticket**: "everything under `.../quality/` (`gate.py`, `statesheet.py`, `phonesheet.py`, the baselines, a new `teeth.py`, `STANDARD.md`...), README sections 1, 3, 4 and 7 of the pack, `.gitignore` for `quality/run/`" |
| C-UI-1 | **NO.** `design.cjs`, a new `scene.mjs`, `preview.css`, `build.mjs`, `browser-check.mjs`. It READS the pack ("DESIGN OF RECORD: this pack") and writes none of it |
| C-UI-2 | NO (`screens.template.html`, `today-app.cjs` bindings, `checkin-*`) |
| C-UI-3 | NO (`t-today`'s proposal card markup, `today-app.cjs`'s proposal binding) |
| C-UI-4 | NO (`screens.template.html`, `gym-app.mjs`, `gym-model.mjs`) |
| C-UI-5 | NO (`machine-settings-view.mjs`, `machine-settings-host.mjs`, gym stubs) |
| C-UI-6 | NO (`today-app.cjs`'s coach stub, a new `coach-app.mjs`) |
| C-UI-7 | NO (`food-*`, `reading-host.mjs`, the sleep entry, `today-app.cjs`) |
| C-UI-8 | NO (`rebuild/slice/pwa/*`, `DEPLOYS.md`) |

**So after C-UI-0, not one remaining ticket writes a pack byte**, and C-UI-1 does not either: the
pack is the fixed target every ticket is judged AGAINST (C-UI-2's acceptance is "statesheet green
for every T state the ticket covers, each within tolerance of the prototype's render", and C-UI-0
says in terms "the pack's prototype is the fixed target the gates are proved against"). The
whole-pack pin therefore costs the design lane nothing on a normal day, and `PM-R6'(i)`'s reason is
stronger than the ruling claimed: it is not only that a gate must not be editable by the ticket it
judges, it is that **no ticket after C-UI-0 has any reason to edit one**. C.5.1's "the cost to lane
C, said plainly" paragraph should carry this table; as written it leaves a price standing that the
tickets say is zero.

**The one real cost is not a ticket, it is a machine, and the spec does not name it: see note N2.**

### 2.2 The per-platform baselines and a GitHub Windows runner, answered from the gate code

`Appendix 12` says the author did not read the gate scripts, so I did, since the PM asked.

**PACK-PIN itself cannot go red for a rendering reason.** It hashes bytes and renders nothing, runs
under `node`, needs no browser and no Python. A GitHub Windows runner computes the same 904 hashes
as the owner's PC (measured above), so pinning per-platform baselines set on one machine is, for
THIS cell, free. The spec does not need to account for anything here and does not.

**The exposure is entirely in C.6's enforcement row, and there the spec picked the right gate by
luck or by instinct.** Measured in the pack at `ecbef86a`:

| gate | what it compares | where its baseline lives | can a runner reproduce it? |
|---|---|---|---|
| `gate.py` | full screenshots, FAIL above 0.1% of pixels differing by more than 10 levels, or mean shift above 0.5 levels | **per platform**: `BASE = quality/baseline/<platform_key()>` (`gate.py:31`), with `ENV.txt` recording the OS, Python, playwright and Chromium of "the machine that set these baselines" (`:648-:654`), and a missing one FAILs "run `--accept` on the machine of record" (`:607-:608`) | **NO, and it is designed not to.** `DECISIONS:531` already measured the drift: the pack's own screens missed README section 3's tolerance "by 4x to 9x on a second machine". This gate must never get a CI step |
| `statesheet.py` | per state and theme: text identical, rects within 3 px, colour within 3 levels, font size within 0.5 px, and a **1/16 scale greyscale** thumbnail | **one shared directory**, `BASE = quality/baseline/states` (`statesheet.py:34`), no platform segment | **that is the intent.** `statesheet.py:44-:47` says the scale was moved from 1/8 to 1/16 precisely so "layout registers, glyph rasterisation does not", and so the thumbnail and rect tolerances agree |

So C.6's "the state sheet run in CI against the client build" is the right half of the pack to name.
**What C.6's seven questions do not ask, and should, is the machine question**: the records were set
on one machine by one Chromium; the rect, colour, size and thumbnail tolerances are the only thing
standing between that machine and a `windows-latest` runner; and nothing in `rebuild.yml` installs
playwright or a browser today. C.6 question 2 half-covers it by offering "the client build's own
emitted assets read statically", which "runs on any runner with no browser" - that option is the one
this measurement favours, and the spec should say so rather than leaving the two level. **My note is
N3, and it is an eighth question, not a defect in the seven.**

---

## 3. SECTION C.6: IS THE GAP STATED AS IT IS?

**Yes, in the body, and that is the part that matters.** C.5.2's four numbered sentences are each
true as written and I checked all four:

1. `design.cjs`, `screens.template.html` and the five arrays are in NEITHER S8 map, and zero paths
   under `rebuild/m1/` are in either: **re-measured, all three hold.**
2. A coordinated deletion passes every check today: **upheld.** All three loops in
   `assertDesignBinding` iterate a declared list (`:538-:541` the template, `:542-:545`
   `APPROVED_COPY`, `:547-:555` the runtime pair), so a string that leaves the array leaves the
   loops with it, and `design.test.cjs:74-:75` compares the arrays with their own lengths.
3. S9 releases no file that carries on-screen copy: **upheld with one clause missing, note N9.**
   The census reproduces exactly and every `preview.css` hit is inside a comment. The clause is that
   `build.mjs` does put two strings on the screen: `injectBuildId` (`:331-:335`) and `injectCommit`
   (`:362-:367`) write the build id and the short commit into the bundle. They carry no wording, and
   the guards on them are re-asserted from inside the seal (`problem.test.mjs:265-:269`,
   `:3532-:3537`, a cell sealed in both maps), which is why this is a clause and not a finding - but
   "neither released file emits a single string that reaches the screen" is stronger than the tree.
4. The copy lock is not S9's to close and S9 must not claim it is: **true, and then TOLD-3 claims
   something else about it, which is BLOCKING-G.**

**Nothing is claimed closed that is open.** The withdrawal is total: H19c struck in B.5, the B.8 row
struck with the reason (v3's row (3) described a refusal that came from the `pinned-unchanged`
DECLARATION and not from the cell, which R3 was right about), the three sentences withdrawn by name,
STOP-11 added. C.6 states a precondition and says "S9 does not build it" in its first line. The
corpus row, the pin row and the residue row are each honest about what is measured and what is not,
and the "shape to copy" row is the best paragraph in the section: I checked it at the line and
`copy.test.mjs:395` and `:405` really do plant a dash in a COPY of the tree and assert the real
`buildToday`'s refusal, and `plain-copy.cjs` and `dash-check.mjs` really are in neither S8 map. That
is a genuine instance of an unsealed implementation held by a sealed cell, and it is the right model
for the lock C.6 asks for.

**The seven questions are good questions and one is missing** (N3, the machine). The corpus figures
are one too high in three places (N6).

---

## 4. PM-R10's MEASUREMENT, CHECKED IN `b-package.cjs` MYSELF

The PM asked round 4 for this and called it the single most useful thing it could produce. **It is
exact, and it is the strongest section in v4.**

| claim | my check |
|---|---|
| `today-app.cjs` is not a child argv target, so `proposed()` `:2800` does not re-pin it | **CONFIRMED.** I parsed `packages/S8.json`'s 25 children and applied `childArgv`'s own rule (`:637-:658`: allow-listed flags first, then explicit files under `CHILD_ROOTS`). 68 distinct targets, every single one a test cell, not one source module, and `today-app.cjs` is not among them |
| it is in `product` and not in `executionPins`, the same shape as `preview.css` and `build.mjs` | **CONFIRMED** by parsing the artifact |
| eleven sealed cells import it | **CONFIRMED and refined**: 16 importers, 14 sealed, of which 11 are cells and three are `today-entry.mjs`, `gym-app.mjs` and `measure/test/support.mjs`; the two unsealed are `checkin-app.mjs` and `setup-app.mjs`. This is `DECISIONS:543` (A)'s "eleven test files import `today-app.cjs`" |
| no runner rule binds a pinned file's importers | **CONFIRMED.** `closure()` `:746` and `requiresOriginal()` `:663` are reached only from `:1595` and `:2417`, both over gate originals under `rebuild/engine` and `rebuild/conform`; `ownChildren()` `:728-:730` reads argv targets only |
| the one thing that DOES block it is `boundary.test.mjs` P-MEASURE (g), a sealed cell | **CONFIRMED at every line.** `declaredPost` is `:117-:126` and takes a spec only when `typeof product[file].post === 'string'` (`:122`); the undeclared assert is `:137-:139`; `MINE` is `:177`; `assert(drifted.includes(MINE))` is `:181`; the named-set `deepEqual` is `:183`; `P3_IMPORT_UI_2_UNSEALED`'s `Object.hasOwn(product, f) === false` is `:186-:187` and the `shaOf === declaredPost` pair C.2 deletes is `:188-:189`. And `packages/S4.json` does pin `today-app.cjs`, `role: "new"`, post `1ae7fbc6...`, so it cannot move into the unsealed branch |

**One correction, and it moves the finding one generation nearer rather than away.** A.2.1.1 says a
released path "falls through to S8's `dc9a826e...`". By v4's own E fact 12 the five `CHILD_SPECS`
cells gain `'S9'`, and by v4's own E fact 20 S9 declares `today-app.cjs` `role: "edited"` with a
real post. So after S10 releases it with `post: null`, `declaredPost` skips the S10 entry and
returns **S9's** post, not S8's. The red at `:137-:139` is the same red, one package closer, and
R18's "two packages downstream" is really one. Nothing in the fix changes.

---

## 5. R3's FINDINGS: FIXED, STILL OPEN OR DISPUTE UPHELD

| # | R3 finding | my verdict | what I checked |
|---|---|---|---|
| **BLOCKING-E** | COPY-BIND asserts nothing the seal already asserts | **FIXED by withdrawal, and R3 is upheld from the tree** | The cell is not built: H19c struck, B.8's row struck, the three claims withdrawn, STOP-11 added. I re-derived the finding independently: all three loops iterate a declared list, so 215 of the 218 are asserted array-to-corpus and NONE is asserted corpus-to-array. **v4's three corrections to R3 are each right and each strengthens it**: the line numbers really are one higher (`:542`, `:543`, `:544`, `:547`, `:548`, `:551`, `:552` at the chain tip), there really is a third loop at `:538-:541` over the TEMPLATE, and B.8's old row (3) really described the declaration's refusal rather than the cell's. `assertDesignBinding` runs `:527-:570` and its copy rules are `:538-:556`, exactly as v4 now says |
| **BLOCKING-F** | the cells are specified against a tree S9 removes, and the spec never says which tree they read | **FIXED, and completely** | (a) which tree: C.5.1 says the WORKING TREE at run time with R3's reason restated; C.5.3 says APPROVED-PIN reads `design.APPROVED` at run time for its list. (b) what is true on the day: C.5.3's five steps, with the `design.test.cjs` edit named as a hunk, and **v4's correction of R3's cite is right at the line**: `:17` is `assert.equal(approved.length, 2)`, `:25` and `:26` are the two `assert.match` calls (R3's `:23-:24` is the comment above them), `:184` is the handoff-line-9 bind. (c) the schedule: CODE at day 1-2, LITERALS in the WAIT column and the single re-measure, STOP-10 added |
| **N1** | A.2.1's four items are short, and the split spec is on origin | **FIXED and overtaken by PM-R10.** A.2.1 is replaced from the ruling, not from either version of the split spec, and A.2.1.1 and A.2.1.2 are new work. I confirmed `farm-sync.sh rebuild/c-today-split` still returns `af53fd17`-era v1 content at `14c87fa7` for the spec file, so OQ-5's reservation is the honest one |
| **N2** | section 0 names a file `:536` does not | **FIXED.** I read line 536 verbatim: its eight are the seven files plus "the today test cells that pin only rendering", and `index.shell.html` is not in it. Section 0's headline is re-cut to R3's own form, the category has a row, and the marked `index.shell.html` row is the right way to keep a v3 reader oriented |
| **N3** | skip condition (1) needs `--name-status` | **FIXED** in both the "what it asks" row and condition (1), with only status `A` counting and R3's eight-paths number in the row |
| **N4** | the seal behind the fence holds the gate, and condition (3) inverts after the merge | **FIXED, both halves, as two new rows.** I re-derived the first: a forging branch can copy (1), (2) and (5) out of the public chain, and (4) costs a sealed byte in `b-package.cjs`, which `fidelity()` `:2005` and the runner pin at `:2012`/`:2013` refuse on the same CI run. The post-merge clause is correct and harmless |
| **N5** | one sha256 cannot name a path; anchor the exclusion | **FIXED, and it is half of what PM-R6'(i) rebuilt.** The literal is a per-path list, the three refusals each name the path, the one remaining exclusion is anchored at the pack root with R3's own attack named. **One residual is now mine, N1** |
| **N6** | two cites wrong | **FIXED, both, verified at the line**: `assertNoAiDashesInAssets` is implemented at `plain-copy.cjs:288`, exported `:305`, destructured at `build.mjs:31`, called at `build.mjs:501`; `rebuild.yml:231-:232` is the A1/A2/A3/A4 step whose 17 cells carry no `import/` path, and `:264-:265` is the P3 step that names `page-bundle.test.mjs` |
| **N7** | Appendix 8 contradicts A.2.1, and A.5 carries two slips | **HALF FIXED, HALF INVERTED: see note N5 below.** Appendix 8 is rewritten and is now true. Of the two slips, one is taken correctly and one is taken backwards |
| **N8** | E could name S9-TODAY-CARRY's four declarations | **FIXED and widened.** E fact 20 names the four from `:542` (D); facts 21 and 22 do the same for PASSPHRASE-NORMALIZE from `:543` (B), and I verified fact 22 myself: `rebuild/m3/w6/test/local-import.test.mjs` exists at the chain tip and `rebuild.yml` names it zero times |

**Nothing in R3 is left open.** Its own "what I tried to break and could not" list is carried
forward correctly, and the two items that became findings are answered.

---

## 6. THE REVISED RULINGS, ONE BY ONE

| ruling | carried out? | what I checked |
|---|---|---|
| **PM-R6'(i)** PACK-PIN: working tree, full sorted list as the literal, whole pack including `README.md` and `quality/**`, exclusions anchored, measured at the S9 head, plus APPROVED-PIN parametrically | **YES, and well.** Every property is in C.5.1's table in the ruling's own words; the procedure is five steps and publishes no value; the reason is stated and is `DECISIONS:536` (4) verbatim ("the design gates green as their acceptance"); the shape is measured and reproduces exactly; the six red-first rows are the six the PM named; APPROVED-PIN is genuinely parametric and C.5.3's five-step day-of list is the right shape. **Two things it does not say: N1 (how the walk reads the tree, on two operating systems) and N2 (the win32 baselines).** Neither is a refusal of the ruling |
| **PM-R6'(ii)** COPY-BIND withdrawn, the gap stated as it is, the lock a named precondition of S10 in C.6, TOLD-3 rewritten | **CARRIED OUT EXCEPT IN TOLD-3, which the ruling named: BLOCKING-G.** The withdrawal is total and the gap is stated honestly in C.5.2. C.6 exists, names a precondition, designs nothing and asks seven real questions. The measurement that S9 releases no file carrying copy is the author's own and it reproduces (with the clause in N9). The rewritten owner paragraph carries a false number |
| **PM-R10** the split's direction reversed; S9 neither waits for it nor carries it; measure whether a runner rule blocks releasing a file eleven sealed cells import | **YES, and this is the best work in the round.** A.2.1 is rebuilt from `:543` (A) rather than from an unpushed spec; the E.2 row is deleted rather than re-worded; A.6 is unchanged and argued from the ruling; D.4 is re-pointed and says in terms that the fence matters MORE now. The measurement is exact in every part (section 4 above), including the one thing that does block it. The correction in section 4 is one word wide |
| **PM-R11** land every R3 note | **YES for seven and a half of eight.** The half is N7's second slip (my N5) |
| **PM-R12** cite the tree id for OQ-1; OQ-2 goes to lane C-UI and is recorded as an integrator input | **YES.** C.5.1's opening cites `6d771046` as the binding identity, says the README sha is not reproducible and names the blob `e4e9effd`; C.5.3 step 5 makes OQ-2 an input before the re-measure; F.4's table records both |
| **PM-R13** the estimate restated without COPY-BIND and with the whole-pack pin; what can start today, hunk by hunk | **YES, and the hunk-by-hunk table is exactly what the PM asked for.** The arithmetic adds up (32.0 - 1.0 + 2.0 + 0.5 + 1.0 + 1.0 + 1.0 = 37.5) and each row says which way it moved and why. **I would dispatch every "YES" row in that table today**, including H19 and H19b's code, and I say so as the reviewer so the PM is not waiting on me for it. The only row I would move is the 31-of-37.5 figure, which now has to carry one more hour for the TOLD-3 and C.6 corrections; call it 31 and a document hour |

**A note to the PM on `PM-R6'(i)`, argued for rather than against.** The ruling's stated reason is
right and my ticket-body measurement (section 2.1) makes it stronger than the ruling claimed: no
C-UI ticket after C-UI-0 writes a pack byte, and C-UI-1 does not either. The price the PM accepted
("C-UI-0 and C-UI-1 must be FINISHED with the pack before the literal is taken") is a price the
tickets already pay by their own sequencing, and `DECISIONS:531` already rules it. The one price
that is real is not a ticket at all: it is the machine of record, and it is note N2.

---

## 7. NOTES (not blocking)

**N1. C.5.1 does not say how the cell reads the working tree, and it must run on two operating
systems.** Three clauses are missing from an otherwise exact section, and each is one sentence:

1. **Path separators.** The literal is generated by `git ls-tree` (forward slashes, step 3). A
   working-tree walk in Node built with `path.join` produces `quality\gate.py` on
   `windows-latest`, which mismatches every one of the 904 lines. The cell must emit pack-root
   relative paths with `/` on every OS. **The spec's own procedure catches this, but only if step 5
   is run on the PC**, which is Windows; C.5.1 should say that step 5 runs there, because if the
   integrator runs it in the farm the divergence ships and the first Windows CI run is 904 red
   lines. `rebuild.yml:20-:24` runs both runners, so both will judge this cell.
2. **File types.** `fs.readFileSync` follows a symlink; `git cat-file blob` does not. Add
   `PACK-PIN NOT-A-REGULAR-FILE <path>` on `lstat`, which closes the one green-while-changed I
   found (section 2) and costs nothing: all 904 entries are mode `100644` today.
3. **The ignore list, and a cheaper shape.** The two entries match exactly what a real gate-run
   checkout leaves untracked today (measured), but any future untracked output inside the pack
   reads as `PACK-PIN ADDED` on the design lane's own machine, and widening a sealed cell's list
   costs a reseal child. **The alternative is one line: enumerate from `git ls-files -- <pack>` and
   hash the WORKING TREE bytes of each path.** All three refusals survive (an addition that can
   reach CI is by definition tracked, so `ADDED` is still reachable as "a tracked path with no
   literal line"), the ignore list disappears entirely, R16 disappears with it, and the cell stops
   being red on a machine that has simply run the gates. I do not insist; I note that the spec
   chose the shape with an ignore list without saying why.

**N2. The win32 baselines do not exist yet, and C.5.1's day-of list does not require them.** This
is the one real cost of the whole-pack pin and the spec does not name it. Measured: at `ecbef86a`
the pack holds `quality/baseline/linux/` (6 PNGs and `ENV.txt`) and **no `win32` directory at all**.
C-UI-0's acceptance 6 says "the Linux baselines are set on this branch by the builder; the win32
baselines are set on the owner's PC by the lane lead before PR-READY", and `gate.py:31` keys the
directory on `platform_key()` while `:607-:608` FAILs a missing one with "run `--accept` on the
machine of record". So: **if the win32 baselines are committed AFTER the S9 literal is taken, the
first Windows `--accept` is a pack move and therefore a reseal child** - for a file nobody edited,
on a machine nobody changed. Add one line to C.5.1's procedure ("every platform of record's
baseline directory is present and set before step 1") and one to C.5.3's five-step list. The same
sentence covers the other version of this: a Chromium or playwright upgrade on the machine of record
re-accepts 424 PNGs and moves the pin. STOP-9(b) catches the aftermath; this catches the ordering.

**N3. C.6 needs an eighth question: which machine, and what reproduces it on a runner.** Section
2.2 has the measurement. `statesheet.py`'s baseline is one shared directory with tolerances
explicitly tuned to be machine-tolerant, which is why C.6's enforcement row is the right choice;
`gate.py`'s is per platform with an `ENV.txt` naming the machine, and `DECISIONS:531` already
measured 4x to 9x drift against its own tolerance on a second machine, so that gate must never get a
CI step. The question C.6 does not ask: on which machine were the 418 records set, does a
`windows-latest` runner reproduce them inside `RECT_TOL 3` / `COLOUR_TOL 3` / `SIZE_TOL 0.5` and the
thumbnail tolerances, and what installs playwright and a browser in a workflow that installs neither
today? Question 2's second option ("the client build's own emitted assets read statically") is the
one this measurement favours, and C.6 should say so rather than leaving the two level.

**N4. C.5.1's "cost to lane C" paragraph should carry the ticket table of section 2.1.** As written
it concedes a price ("ANY further pack change ... must ride a reseal child") and leaves the reader
to guess how often that is. The answer, from the ticket bodies, is: never, for C-UI-2 to C-UI-8, and
not for C-UI-1 either. That is an argument FOR the ruling and the document is leaving it on the
floor.

**N5. A.5's C-UI-7 row inverts the R3 note it credits, and A.5's other correction is now less true
than what it replaced.** Two halves:

1. **Inverted.** A.5 now reads "7 (the ticket names **`food-host.mjs`**, not `food-*`; R3 N7)".
   The ticket says the opposite: C-UI-7's `MAY CHANGE` is "`food-*`, `reading-host.mjs`, the sleep
   entry, the Why this plan view in `today-app.cjs`". R3 N7 said the spec had written
   `food-host.mjs` where the ticket says `food-*`; v4 has recorded the correction the wrong way
   round. It matters slightly, because `food-*` covers four files (`food-check.mjs`,
   `food-commands.cjs`, `food-host.mjs`, `food-model.cjs`) of which only `food-host.mjs` is sealed.
   No verdict moves: C-UI-7 rides a reseal child on `today-app.cjs` alone.
2. **Less true.** A.5's `screens.template.html` row now reads "**2,4** (R3 N7: C-UI-3 does not name
   this file)". Literally right, materially not: C-UI-3's `MAY CHANGE` is "`t-today`'s proposal card
   markup", and `t-today` is a template inside `screens.template.html` - C-UI-2's own `MAY CHANGE`
   spells it out as "`screens.template.html` (`t-today`)". So C-UI-3 does edit that file, by the
   template's name rather than the file's. v3's "2,3,4" was the better answer and R3 was being
   formal. The file is unsealed either way and nothing downstream moves.
3. A third thing in the same neighbourhood, for the record rather than as a correction: A.2.1's
   C-UI-7 row gives "`food-host.mjs` and `reading-host.mjs` YES (sealed)" as part of why that ticket
   rides a reseal child, while `DECISIONS:543` (A)'s third-hand LOOK-VERSUS-SEAL map records that
   "`food-host.mjs`, `reading-host.mjs` and `machine-settings-host.mjs` hold zero DOM, zero copy and
   need no edit by any ticket". The conclusion survives on `today-app.cjs` alone, and the count of
   six agrees with `:543`'s "2 of the 8 ship as lane C".

**N6. C.6's corpus figures each count a file that is not a record.** `quality/baseline/states/`
holds 419 `.json`, one of which is `INDEX.json` (its only key is `states`; it has no `text` and no
theme). Measured over the real records: **418 records, 209 state ids, two per id, the `text`
identical across ink and dawn for all 209, and 200 distinct text blocks.** v4 says 419, 210 and 201.
The substance is exactly right and is the reason C.6 can be written; the three counts are each one
too many, and C.6 question 3's "The 210 with records" should read 209. Worth fixing because C.6's
whole claim is that the corpus is a measured thing rather than an aspiration.

**N7. A.2.1.1's fall-through names the wrong ancestor, and v4's own E facts say so.** After S10
releases `today-app.cjs` with `post: null`, `declaredPost` (`boundary.test.mjs:117-:126`) walks
`CHILD_SPECS` youngest first and takes only a string post. E fact 12 adds `'S9'` to that literal in
all five cells and E fact 20 declares `today-app.cjs` `role: "edited"` in S9 with a real post, so
the walk lands on **S9's** post, not S8's `dc9a826e...`. Same red, at the same lines, one package
sooner than F.1 R18's "two packages downstream" says. One clause.

**N8. APPROVED-PIN has no refusal for the case C-UI-1 actually creates.** Its three named refusals
are `MISMATCH`, `MISSING` and `LIST-EMPTY`. The event C.5.3 is written for is a `design.APPROVED`
that moves to two DIFFERENT files that exist - and a cell that iterates its own literal would then
be green over two files nothing points at, which is precisely the risk F.1 R12 claims to have
closed. Reading the list at run time is necessary and not sufficient. Add the fourth refusal:
**every path `design.APPROVED` names must HAVE a literal entry, else `APPROVED-PIN UNLISTED
<path>`**. One line, and it is what makes R12's mitigation true rather than dependent on the
implementer's instinct.

**N9. Two byte counts, and one clause about what `build.mjs` puts on the screen.** C.5.2 item 3
gives `preview.css` as 6310 bytes and `build.mjs` as 30974; both are 6314 and 30991, at `023b99f4`
and at the chain tip. The census itself reproduces exactly and the conclusion holds. The clause:
`build.mjs` emits no WORDING, but it does write two strings into the page - `injectBuildId`
(`:331-:335`) and `injectCommit` (`:362-:367`) - and after the release their guards (the
exactly-once assert and the `/^[0-9a-f]{4,40}$/` shape check) are unsealed bytes. They are
re-asserted from inside the seal by `problem.test.mjs:265-:269` and `:3532-:3537`, which is why this
is a clause and not a finding, and it is worth one sentence beside the seven laws of A.4 rather than
an absolute ("neither released file emits a single string that reaches the screen") that the tree
does not quite support.

**N10. `.gitignore` is not in either S8 map, and C.5.1 rests part of its argument on it.** The cell
correctly refuses to read it. But C.5.1 also says "`.gitignore` on the lane branch carries
`rebuild/m1/approved-2026-09-18/quality/run/` (line 7) and `__pycache__/` (line 8)". True on
`rebuild/c-ui-0-gates`; the chain tip's `.gitignore` is four lines and carries neither, because
C-UI-0 has not merged. The hedge "on the lane branch" is accurate, and I name it only so the S9
integrator does not read the sentence as a fact about the tree they will be standing in.

---

## 8. WHAT I TRIED TO BREAK AND COULD NOT

1. **The release mechanism, re-read for round-4 damage.** The diff touches B.5's H19 row and its
   count sentence, B.8's two pack rows, and nothing else in section B. H1 to H13, H17, B.2's token
   grammar, B.3's S10 trace, B.4's `released` block, B.6 and B.7 are byte-identical to v3, which
   R1, R2 and R3 each accepted. C.1, C.2, C.3, D.1 and D.3 are untouched. **Round 4 broke nothing
   that rounds 1 to 3 accepted**, and the two edits inside accepted sections (A.4's two cites and
   the `design.cjs:527-:570` range) are corrections I verified at the line.
2. **The fence.** Unchanged except N3's `--name-status` and N4's two clauses. I re-derived the
   teeth: a branch that adds an unearned `packages/<ID>.json` must also put `<ID>` into `IDS` in
   `b-package.cjs` on its own branch, and the same CI run refuses that at `:2013`
   (`RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER-IN-GIT`) and at `fidelity()` `:2011`. The new
   post-merge clause does not open anything: condition (1) still requires status `A`, and a spec
   already at the chain ref cannot be added again.
3. **PACK-PIN by a moved board, app file, gate script, baseline, state record, added file or
   removed file.** Closed, all seven, for the structural reasons in section 2.
4. **PACK-PIN by line endings.** Closed, and now measured rather than argued.
5. **PACK-PIN by editing the exclusion list.** Closed: the list lives inside a cell S9 seals.
6. **PACK-PIN by a file added beside the pack root.** Out of scope by construction, and APPROVED-PIN
   is the cover, subject to N8.
7. **PACK-PIN going red on a GitHub runner for a rendering reason.** Impossible: it renders nothing.
   The only way I could make a runner disagree with the PC is N1's separators and file types.
8. **The two released files carrying copy.** Re-measured from scratch; the answer is the author's.

---

## 9. DISPUTED CITES, IN ONE LIST

| the spec says | the file or the tree says |
|---|---|
| "Of the 218 sentences on the locked list, 139 are checked by nothing inside the locked set" (TOLD-3); "the next `139 of 218 are asserted by nothing`" (C.6 q3) | 215 of the 218 are asserted by `design.test.cjs:72` from inside the seal; 47 occur in no sealed file; 139 is the count that DO occur in the 09-18 pack (BLOCKING-G) |
| "the 844 reference screen images" (TOLD-3) | 844 files under `quality/baseline/`: 424 PNGs, 419 JSON records, one `ENV.txt` (BLOCKING-G) |
| "419 records over 210 distinct state ids ... 201 distinct text blocks" (C.6) | 418 records over 209 ids and 200 distinct texts; the 419th file is `INDEX.json` (N6) |
| "the ticket names `food-host.mjs`, not `food-*`" (A.5, Appendix 8) | C-UI-7's `MAY CHANGE` says `food-*`; R3's note was the other way round (N5) |
| "C-UI-3 does not name this file" (A.5, `screens.template.html` row) | C-UI-3 names `t-today`'s markup, and `t-today` is a template of `screens.template.html`, as C-UI-2's own row spells out (N5) |
| a released path "falls through to S8's `dc9a826e...`" (A.2.1.1) | it falls through to S9's post, because E fact 12 adds `'S9'` to `CHILD_SPECS` and E fact 20 declares the file `edited` in S9 (N7) |
| `preview.css` 6310 bytes, `build.mjs` 30974 (C.5.2) | 6314 and 30991 (N9) |
| "Neither released file emits a single string that reaches the screen" (C.5.2 item 3) | `build.mjs` injects the build id and the short commit into the bundle at `:331-:335` and `:362-:367`; no wording, and the guards are held by `problem.test.mjs` (N9) |

---

## 10. WHAT WOULD MOVE THIS TO ACCEPT

1. **TOLD-3's copy paragraph re-measured**, and C.6 question 3 with it. The numbers are in
   BLOCKING-G and the honest sentence is drafted there. The "844 reference screen images" clause
   in the same paragraph is part of the same edit. (BLOCKING-G)
2. N1, N2, N6, N7 and N8 taken as edits: five sentences, none of which needs a new measurement.
   N1 and N2 are the two that would otherwise cost a CI round or a reseal child.
3. N3, N4, N5, N9 and N10 as the author judges; none changes a verdict.

**I agree with, and would not re-litigate:** the whole of section B and the released role; the
closed list of two and section 0 as re-cut; C.1, C.2 and C.3; the fence and both of R3's clauses on
it; D.4 as re-pointed by PM-R10; A.2.1, A.2.1.1 and A.2.1.2, which are the most useful pages in the
document; C.5.1's design, procedure and reasons; C.5.3's parametric cell and its five-step day-of
list; the six `pinned-unchanged` declarations; the withdrawal of COPY-BIND and the whole of C.5.2's
four numbered sentences; C.6 as a precondition with seven questions; E facts 20, 21 and 22; F.2's
STOP-9, STOP-10 and STOP-11; and F.3's estimate and its PM-R13 table, which I would dispatch today.

---

## 11. WHAT I DID NOT VERIFY

1. I ran no suite, no `b-package.cjs` in any mode and no build. Every predicted refusal in B.8,
   C.5 and D.2 is still a prediction. The only code I ran was my own read-only measurement scripts
   in the farm, which wrote nothing to any working tree.
2. I did not read `rebuild/conform/private`, `src/history.js`, any `ledger/` directory,
   `C:\Users\joeym\EarnedPort`, `%TEMP%\port-real.log` or the protected soak, on either machine. No
   owner measurement entered this session and every fixture named here is synthetic.
3. I read `quality/gate.py` and `quality/statesheet.py` for section 2.2 and cite them at the line,
   but I did not RUN either, and I pass no judgement on their teeth; that is `DECISIONS:531`'s
   second audit. I did not read `teeth.py`, `phonesheet.py` or `common.py`.
4. I did not measure the pack at `5f4cad0a`: that commit is on `rebuild/c-ui-port`, which I did not
   sync. Every pack figure here is at `ecbef86a`, the head of `rebuild/c-ui-0-gates`, which is the
   youngest pack state that exists. R3 measured `5f4cad0a` and I take its figures as read.
5. I did not run the SEAL-AUTOMATION generator; I did not open its branch beyond confirming the
   head `8a7da547` syncs. F.3's generator numbers rest on its own README, as the spec says.
6. I did not read round 2 of `TODAY-SPLIT-SPEC.md`: `farm-sync.sh rebuild/c-today-split` returns
   `af53fd17` and the spec file there is still v1 at `14c87fa7`, so OQ-5 stands exactly as v4
   states it. I read `DECISIONS:543` (A) whole instead, which is the ruling A.2.1 rests on.
7. My copy census is a verbatim substring search, so it is a lower bound on binding and an exact
   count of non-binding, exactly as Appendix 11 says. The "215 of 218 are asserted" figure in
   BLOCKING-G is a reading of `assertDesignBinding`'s three loops, not an execution of them.
8. I did not open `%TEMP%\earned-s9carry`, `%TEMP%\earned-passphrase`, `%TEMP%\earned-split` or any
   PC worktree but `%TEMP%\earned-s9`, and I wrote exactly one file.

Reviewer: cowork (Earned lane hand), independent of the author, told to disagree and did.
