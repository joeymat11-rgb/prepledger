# M2-S5-TODAY-CHILD — the reseal that lets the measure screen reach the phone

v1.0. Lane B, ENGINE-TIER PACKAGE PROCESS, a child package of `M2-S4-REAL-DAY`
(`rebuild/lanes/b/tooling/b-package.cjs`), product size S. Parent artifact
`rebuild/m4/spec/acceptance-s4-real-day.json`.

## 1. Why

This package has NO behaviour of its own, and that is the point of it.

`DECISIONS:455` is a standing PM ruling: M2-S4-REAL-DAY sealed every product file
under `rebuild/m3/w7-preview/today/**` — `today-app.cjs` at post `1ae7fbc6…` and
every child test file beside it — and the standing CI step is
`--ci --package S4`. So **any** byte change under `today/` now fails
`SEALED-PROFILE-RECOMPUTATION` on its own branch. That is the seal working
exactly as designed; it is what caught the frozen-date defect at `:437`, and it
is not a defect of lane C's.

Lane C's P-MEASURE round 3 is ACCEPTED at the lane level (`DECISIONS:457`): the
weekly waist entry, the twelve-week comparison table, the marker pick and the
text export are built, reviewed by an independent Opus reviewer at high effort
against a hand-recomputed table and a second scenario driven through the REAL
Today route, and FROZEN at `4e0b4837`. One sealed file moves to deliver them:
`today-app.cjs`, 49 added lines of route, tile and wiring. Under `:455` those
bytes reach the tip only inside a lane B RESEAL CHILD, and `:457` briefs this one.

So the whole of S5 is custody. It pins lane C's accepted bytes, declares the
measure module as its own product, gives the four page-stack suites a CI home,
moves the standing step from `S4` to `S5`, and moves NOT ONE byte under
`rebuild/engine`. If a reviewer finds a behaviour change in this package, that
is a finding: there is not supposed to be one.

## 2. What changes

1. **The pin.** `today-app.cjs` is declared `edited`, pre `1ae7fbc6…` (S4's own
   post, and the blob at this package's `sourceBase`), post `016a1e4f…` (lane C's
   reviewed bytes, byte-for-byte as frozen at `4e0b4837`). Nothing in this
   package rewrites, reformats or re-indents a line of it.
2. **The measure module becomes product.** The FIFTEEN files under
   `rebuild/m3/w7-preview/measure/` are declared role `new`. (`DECISIONS:457`
   says eighteen; the tracked inventory is fifteen — seven modules, one fixture,
   six `.test.mjs` cells and `test/support.mjs`. The count is corrected here and
   in the author report rather than restated.)
3. **A CI home for the four page-stack suites.** `journey`, `lane`, `baseline`
   and `boundary` mount the real Today route over jsdom and `fake-indexeddb`.
   `shared-preflight.yml`'s allowlist cannot open the page stack, so lane C
   recorded them as running in NO workflow at all (`:457` (i), an honest gap
   carried here, not a finding). S5 enumerates all four in `rebuild.yml`'s today
   step by exact path — the C5 coach pattern `DECISIONS:117 (4)` set when it rode
   the B-NTC seal as a disclosed hunk. `shared-preflight.yml` is NOT touched:
   `model` and `adherence` are hermetic and stay where lane C registered them.
4. **The standing step.** `--ci --package S4` becomes `--ci --package S5`, as S4
   moved it from S3 and S3 from H3. `IDS` and `NO_REGISTER_IDS` gain `S5`;
   `packages/S4.json` is re-pinned onto the S5 runner exactly as S4 re-pinned
   `S3.json`; `H3.json` and `S3.json` are re-pinned the same way (S4-REVIEW-R1
   finding 4: a spec left on a moved runner stops at
   `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER` before any evidence is read).
5. **Nothing else.** No engine byte. No law. No guard relaxed. The nine
   byte-identity gates are retired AGAIN, under this package's own token line and
   its own red-first evidence — section 3.2 is why, and it is not optional.

## 3. Custody — the diff, by site

| File | Role | What moves |
| --- | --- | --- |
| `rebuild/m3/w7-preview/today/today-app.cjs` | edited (parent product pin) | Lane C's accepted P-MEASURE bytes, 49/0. The ONLY sealed file this package moves, and it is moved by pinning, not by editing. |
| `rebuild/m3/w7-preview/measure/**` (15 files) | new | Lane C's measure module: `measure-model/-view/-screen/-host/-commands/-baseline/-sources`, `measure-fixture.json`, and `test/{model,adherence,journey,lane,baseline,boundary}.test.mjs` + `test/support.mjs`. Not one byte is authored by lane B. |
| `.github/workflows/rebuild.yml` | edited (parent product pin) | The package step `--package S4` → `--package S5`; the today step gains the four measure page suites by exact path (section 3.3). |
| `rebuild/lanes/b/tooling/b-package.cjs` | edited (parent product pin) | `S5` added to `IDS` (after `S4`) and to `NO_REGISTER_IDS` (the S- half, as S4); `CHILD_ROOTS` gains `rebuild/m3/w7-preview/measure/test/` (section 3.4). No rule moves. |
| `rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs` | edited (parent product pin) | `F6` gains the `S5` literal in both pinned orders; a new `F7` cell PINS `CHILD_ROOTS` itself, which nothing did before. |
| `rebuild/m3/w7-preview/today/test/{setup,food,machine-settings-ui}.test.mjs` | edited (parent product pin) | One literal each: the declaring-spec chain becomes `['H3','S3','S4','S5']` (section 3.1). |
| `rebuild/lanes/b/tooling/packages/{H3,S3}.json` | edited (parent product pin) | `tooling.runnerSha256` re-pinned onto the S5 runner. One byte range each. |
| `rebuild/lanes/b/tooling/packages/S4.json` | superseded-by-child (parent EXECUTION pin) | `tooling.runnerSha256` re-pinned onto the S5 runner, as S4 re-pinned `S3.json` and S3 re-pinned `H3.json`. |
| `.github/workflows/shared-preflight.yml`, `rebuild/lanes/tooling/test/shared-preflight-ci-registration.test.cjs` | new (unpinned) | Lane C's own registration of the two hermetic suites. S5 does not edit them; it DECLARES them, so the inventory covers every non-document byte this branch moves. |
| `rebuild/m4/workout/test/s5-supersede-*.test.cjs` (5), `s5-engine-files-differential.cjs` | new | This package's own supersession evidence (section 3.2). |
| `rebuild/lanes/b/tooling/packages/S5.json`, `rebuild/m4/spec/acceptance-s5-today-child.json`, this brief, the author report | new files, not product | The package itself. |

**Nothing under `rebuild/engine` moves.** All 45 tracked engine files stand
byte-identical to the parent's own post — the 18 this package names among them,
each declared `carried` with `pre === post`. That is measured, not asserted:
`s5-engine-files-differential.cjs` compares every one and prints the count, and
the runner independently computes the same identity over the files this package
does not declare and holds the child's needle to the number IT measured.

### 3.1 Why three lane-C guard cells are amended, and why that is not a weakening

`setup.test.mjs`, `food.test.mjs` and `machine-settings-ui.test.mjs` each walk
the forty-odd files `packages/B-NTC.json` pins and ask, of each, "does this still
stand where it was pinned, or where a package on this branch DECLARED it". S5
moves one of those pins by name and on purpose: `.github/workflows/rebuild.yml`.

The licence is H3's, re-pointed by S3 and widened into a CHAIN by S4: a file is
exempt only while it stands at the post-image the YOUNGEST spec that declares it
declares for it. S5 appends its own name and changes nothing else — the literal
goes from `['H3','S3','S4']` to `['H3','S3','S4','S5']`. An undeclared move, a
declared move that has not landed, and drift in a file no spec names are all
still red, and with no such spec on the branch the exemption set is empty and
every one of the three is the original cell.

`problem.test.mjs` reads the same chain for `today-bindings.mjs` alone, which S5
does not move, so it is NOT amended. Neither is the exported `CHILD_SPECS` in
`rebuild/m3/w6/test/local-today-journey.test.mjs`: nothing imports it, S5 moves
neither file it guards, and moving a pinned journey suite to update a comment
would buy no evidence. Both are named in the author report as open items for S6
rather than swept.

### 3.2 Why S5 declares the NINE gate supersessions — again

S4's brief said, in terms, that S4 declared no gate supersession because S4 moved
no engine byte. `DECISIONS:443` measured that as wrong, at the cost of a whole
FULL run: the run reached `PRIVATE ORACLE PRESENT` and `HISTORICAL 104/104` and
then `migrate-source` refused, with the other eighteen gates never reached.

The mechanism, which S5 is subject to for exactly the same reason: the nine
NATIVE-CARRIERS gates — `migrate-source`, `merge-source`, `writers-source`,
`witnesses-2`, `witnesses-5`, `witnesses-7`, `migrate-differential`,
`writers-differential`, `second-gate` — are not pins. They RECONSTRUCT
`rebuild/engine` byte-for-byte from a frozen `BASE` plus the 48 literal carriers
of `native-carriers-changes.json` (pinned by `CHANGES_SHA`), and from the frozen
`fe516c1:src/app.jsx` declarations. Four of the files they rebuild already stand
outside that reconstruction: `constants.cjs` and `writers.cjs`, moved by
M2-H3-CLEAN-INIT, and `merge.cjs` and `today.cjs`, moved by M2-S3-COMPANION. **No
descendant of S3 can carry them, whether or not it moves an engine byte itself.**
The S3 reviewer named this second-generation effect at `:422` note 3 before
anyone measured it.

S5 is a THIRD-generation descendant of S3 and a second-generation one of the
ruling: S4 stood in this exact position and retired the nine under its own token
line `:444`. A retirement is never inherited. `b-package.cjs`'s
`parentCarrierGates` reads a parent's gate map from BOTH halves — `byChild` (the
gates its carriers covered) and `supersededByCarrier` (the gates it retired) — so
a carrier the parent retired is one this child may retire AGAIN, inheriting the
GATE LIST and nothing else. Every condition of `DECISIONS:153` (ii)–(iii) is
asked of S5 exactly as it was asked of S4, and S5 answers with its own evidence.

**The evidence, in H3's, S3's and S4's shape, all of it EXECUTED here.** Five
red-first cells, one per carrier, plus the named-files differential:

| child | file | what it executes |
| --- | --- | --- |
| `s5-sup-source-carriers` | `rebuild/m4/workout/test/s5-supersede-source-carriers.test.cjs` | `SUP-1` the whole tracked engine inventory unmoved; `SUP-2` the carrier's own `verify()`, run, refusing at `today.cjs` with all four divergences enumerated; `SUP-3` the ORIGINAL gate programme `migrate-source.cjs` spawned, non-zero exit, `exact declaration migrate`; `SUP-4` the pinned list proved un-extendable and the PARENT'S own retirement read off S4's artifact |
| `s5-sup-inherited-carriers` | `…/s5-supersede-inherited-carriers.test.cjs` | `SUP-5` `priorModule`'s own rule re-executed over the six carried modules — four still ARE the declared carriers, `today.cjs` (nine) and `writers.cjs` are not; `SUP-6` all 45 against the parent post WITH a mutation control; `SUP-7` the inherited capabilities reached, not just present |
| `s5-sup-defect-witnesses` | `…/s5-supersede-defect-witnesses.test.cjs` | `SUP-8` the frozen side proved unbuildable through `native-carriers-parent-source.cjs`; `SUP-9` the COMPLETE comparison of the accepted engine read from GIT against this tree; `SUP-10` one removed export detected, so `SUP-9` is a measurement |
| `s5-sup-writers-differential` | `…/s5-supersede-writers-differential.test.cjs` | `SUP-11` both distances measured — this tree is neither the reconstruction's pre-image nor its post-image; `SUP-12` 3/3 Date/trap modes byte-identical; `SUP-13` no declared file under `rebuild/engine/` at all, and one removed writer detected in all three modes |
| `s5-sup-second-gate` | `…/s5-supersede-second-gate.test.cjs` | `SUP-14`/`SUP-15` the independent second reading from a second source of bytes; `SUP-16` the gate proved un-takeable AND the reading shown to detect a one-line engine change while ignoring a comment |
| `engine-files-differential` | `…/s5-engine-files-differential.cjs` | every tracked `rebuild/engine` file against the parent's own post, the 18 named and the rest, with the count in the verdict line |

The RED-FIRST half is not a description of a wall; it is the wall, run. The half
that STANDS IN ITS PLACE is, for a package that moves no engine byte, the
identity itself — and identity is worthless unless the instrument can fail, so
every such cell carries its own mutation control.

`coverage.superseded.rulingLineSha256` is `null` in the spec as delivered. That
is not an oversight and not a soft obligation: section 5 records exactly what the
runner does with it.

### 3.3 The today step, and the 13-name rule

Cell `H3/13` reads the `today/test/` paths off the today step's own `run:` line
and requires them to equal that directory EXACTLY — all thirteen, nothing else,
no glob, no hold-out (`DECISIONS:186`). It matches `today/test/` paths and only
those, so naming a measure file on the same line neither satisfies nor breaks it:
the thirteen are still thirteen and still exact, and the cell is untouched.

For the four measure suites the enumeration IS the whole ceremony of admission.
There is no glob standing in for one, which means a fifth measure page suite
added later has no CI home until some package names it there on purpose — which
is precisely what `DECISIONS:186 (3)` asks: "a file with no CI home is a file
nobody runs". The step's comment says this in the workflow itself.

### 3.4 The eighth child root, disclosed

`CHILD_ROOTS` in `b-package.cjs` is the fixed list of directories a declared
child may execute under. S5 adds one: `rebuild/m3/w7-preview/measure/test/`.

It is needed because `:455` puts lane C's new modules there precisely so that
only the route wiring in `today-app.cjs` is a sealed-byte move — and a package
that declares those modules as its own role `new` product cannot EXECUTE them,
and so cannot reach them with the Y1 own-child rule, while their directory stands
outside the list. `CHILD-ARGV-TARGET` refuses it by name; this is that refusal
answered by declaration rather than worked around.

Nothing is widened for any other package. The list is fixed in the runner (W7)
and unreachable by any spec, so a package still cannot name its own root; every
existing entry is unchanged; and the new entry is one literal directory that
already exists on the branch, not a pattern. It was previously pinned by nothing
at all, so this package adds the cell that pins it: `F7`.

## 4. The bar — what has to be true before this is accepted

| # | The claim | How it is measured |
| --- | --- | --- |
| 1 | `today-app.cjs` on this branch is byte-identical to lane C's reviewed bytes at `4e0b4837` | the product inventory: `edited`, pre `1ae7fbc6…` = the `sourceBase` blob, post `016a1e4f…` = disk; and `git diff` against `4e0b4837` is empty |
| 2 | S5 moves no product byte of its own | `git diff` of every path this spec declares, against the lane C head, is empty but for the files section 3 names |
| 3 | No engine byte moves | `engine-files-differential`: 45 tracked, 18 named, 0 moved; and the runner's own `supersessionEngineIdentity` over the other 27 |
| 4 | Each of the five carriers is refused ON THIS TREE, executed, not described | `s5-sup-*`, one red-first cell per carrier, each running the real carrier or the real gate programme |
| 5 | And the evidence standing in its place can FAIL | the mutation control inside `SUP-6`, `SUP-10`, `SUP-13`, `SUP-16` |
| 6 | The refusals are inherited, not caused here | every cell asserts the refused file stands at the PARENT'S own post and at this package's `sourceBase` blob |
| 7 | Each carrier's evidence is its OWN | `GATE-SUPERSESSION-EVIDENCE-IS-NOT-THIS-CARRIER-OWN`: five distinct red-first children |
| 8 | The measure screen still works where it is now run | the four page suites green inside the today child, and `model`/`adherence` green in shared-preflight |
| 9 | The thirteen today suites are unmoved | the today child: thirteen files by name, the same count as the tip |
| 10 | Every B-NTC pin that moved is DECLARED | the three guard cells, amended by one literal, green |
| 11 | `CHILD_ROOTS` cannot be widened unseen from here on | `F7`, which did not exist before this package |
| 12 | No law, guard or test is weakened | every amended cell states its rule and its red side; no assertion is removed; the one assertion that changes shape (`SUP-4`'s ruling citation) is named in section 5 with its reason |

## 5. Runs

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S5` at the head, plus
the seventeen today-step files by name, the W6 suite, the coach suite, the
shared-preflight trio, A1/A5 and `rig187`. The `--full` run with the private
census is the PM's.

**Predicted pre-ruling stop, exactly, and it is NOT the stop S4 predicted.** S4
stood on two open obligations and still reached `PUBLIC CI EVIDENCE PASS`-shaped
evidence before stopping at `CI REVIEW-PENDING`. S5 cannot, and the difference is
worth stating plainly because `DECISIONS:457` predicted the softer stop:

A `coverage.superseded` block with `rulingLineSha256: null` is **not** a soft open
obligation. `coverage()` calls `supersededGates()`, which calls
`supersessionRuling()`, whose FIRST assertion is
`sup.rulingLineSha256 !== null` — so the run throws before the coverage line is
printed, and the top-level handler prints one line:

```
B PACKAGE S5 FAIL GATE-SUPERSESSION-RULING-NOT-CITED; required evidence missing or failed; local diagnostics withheld
```

exit 1. The SPEC line the runner prints before it says so in its own words:
`5 byte-identity carrier(s) declared SUPERSEDED under a PM line recorded by
sha256 NOT YET CITED — the run will refuse GATE-SUPERSESSION-RULING-NOT-CITED`.

Everything BEFORE coverage still executes and is reported — the product
inventory, the parent and grandparent pin re-assertion, the 45-law baseline, and
every declared child including the today suite and all six supersession children.
The author report quotes those lines whole. The theme and brief obligations are
reached only after coverage, so on this head they are not reported at all; they
become the last two open obligations the moment the token line stands.

**What this means for the PM's order of work.** All THREE of section 6's lines
must stand on the chain branch before `--ci --package S5` can reach
`PUBLIC CI EVIDENCE PASS` — the token line is a precondition of the evidence, not
an obligation counted beside it. Nothing in the code or the cells changes to get
there; only `packages/S5.json`'s three null fields are filled and the artifact
regenerated.

## 6. The three citation lines, drafted for the PM (`DECISIONS:135 (2)` shape)

The PM appends these to `rebuild/DECISIONS.md` once the brief is accepted by
name. The sha256 in the second is a PLACEHOLDER: it is the sha256 of the accepted
bytes of this file, and the PM substitutes the measured value when appending.
The third is in `DECISIONS:444`'s exact shape and must be, byte for byte in its
token clause, or `SUPERSESSION_GRANT` frees nothing.

THEME:

```
- 2026-09-16 · cowork · THEME M2-S5-TODAY-CHILD — the reseal child that carries lane C's ACCEPTED P-MEASURE bytes onto the tip: it pins rebuild/m3/w7-preview/today/today-app.cjs at post 016a1e4f096d24e69b0b4e308879679e8582d0fdf475f28c7b24d2cb9cd9c97e, declares the fifteen files of rebuild/m3/w7-preview/measure/ as its own product, gives the four page-stack measure suites a CI home in rebuild.yml's today step as a disclosed hunk (DECISIONS:117 (4)), and has NO product behaviour of its own. Standing ruling DECISIONS:455 (S4 sealed all of today/**, so a lane C change under today/ lands only inside a lane B reseal child); briefed at DECISIONS:457. Its behaviour/delta contract is rebuild/lanes/b/S5-TODAY-CHILD-BRIEF.md; its parent is M2-S4-REAL-DAY, rebuild/m4/spec/acceptance-s4-real-day.json sha256 12779767123e5b0983bcce4028c2c3213b0a6bf05a1661909ee5949f96d8a972 (receipt DECISIONS:449, merge :450); it changes no rebuild/engine byte, and as a second-generation descendant of M2-S3-COMPANION it retires the same nine byte-identity gates again under its own token line below. This line is the THEME citation the seal runner requires; it authorises no PASS word by itself · ACCEPTED
```

BRIEF-BY-SHA:

```
- 2026-09-16 · cowork · BRIEF ACCEPTED BY SHA for M2-S5-TODAY-CHILD: rebuild/lanes/b/S5-TODAY-CHILD-BRIEF.md, sha256 <64-hex placeholder, the accepted bytes of this file> (<n> bytes), is the brief of record; this line carries the binding sha256 and is the citation brief.acceptedLedgerLine cites · ACCEPTED
```

GATE-SUPERSESSION (`DECISIONS:444`'s exact shape; the token clause is the whole
of its own `·` clause, nothing before it and nothing after it):

```
- 2026-09-16 · cowork (PM) · GATE-SUPERSESSION M2-S5-TODAY-CHILD source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate · the token clause for DECISIONS:153, same conditions (i)-(iii), for the child of M2-S4-REAL-DAY (grandchild of M2-S3-COMPANION, great-grandchild of M2-H3-CLEAN-INIT); the child changes no rebuild/engine byte and retires the parent's retired gates again under this line and its own evidence — the five carriers cover the nine gates merge-source, migrate-source, writers-source, migrate-differential, witnesses-2, witnesses-5, witnesses-7, writers-differential and second-gate · RULED
```

That line frees five carriers and nine gates and nothing else. It must END in the
`RULED` terminal word, and its token clause must be exactly
`GATE-SUPERSESSION M2-S5-TODAY-CHILD source-carriers,inherited-carriers,defect-witnesses,writers-differential,second-gate`
— any bracket, quote, backtick or word inside that clause leaves it something
other than the token and frees nothing.
