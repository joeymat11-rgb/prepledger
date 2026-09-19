# S9-RELEASE-SPEC - releasing the screen files from the sealed inventory

**v4, fix round 4.** v1 (`4876fa9`) was REJECTED by R1 (`f0dc366`, four blocking, ten notes); v2
(`c0bb04e`) fixed all fourteen and was REJECTED by R2 (`d859096`, BLOCKING-A, BLOCKING-B, ten notes);
v3 (`3a5f91f9`) fixed both and was REJECTED by
`rebuild/lanes/b/S9-RELEASE-SPEC-REVIEW-R3.md` (`143a650a`) on **BLOCKING-E** and **BLOCKING-F**,
with notes N1 to N8. R3 found both blocking items inside C.5, which v3 built on the PM's own ruling
PM-R6, and said so in terms. **The PM has read R3 and REVISED PM-R6; the author was not at fault.**

v4 carries out the revised rulings, cited in the body as **`PM-R6'(i)`, `PM-R6'(ii)`, `PM-R10` to
`PM-R13`**, keeps `PM-R1` to `PM-R5` and `PM-R7` to `PM-R9` as they stand, fixes BLOCKING-E and
BLOCKING-F and every R3 note, and answers each one in the new section **R3 findings: fixed or
disputed** at the end. Sections **R2 findings** and **R1 findings** are kept below it unchanged,
because this round continues the earlier authors' work rather than replacing it. R3 accepted the
released role, the token line, H17, the receipt skip and the fence; **none of those is touched by
this round, and every place v4 does touch an accepted section says so at the point of the edit.**

**New measurements in v4** (farm side, read-only node scripts and one in-memory require; no suite,
no `b-package.cjs`, no build): the shape and size of the whole-pack PACK-PIN literal; the state
records that S10's copy lock will rest on; whether `preview.css` and `build.mjs` carry on-screen
copy; and **PM-R10's measurement, whether `today-app.cjs` is a child argv target or only imported by
argv targets**, which is the answer the PM asked round 4 for. They are in C.5, C.6 and A.2.1.

Lane B tooling, SPEC ONLY. Authors: cowork (Earned lane hand) v1, v2, v3, v4, 2026-09-19, worktree
`%TEMP%\earned-s9` on `rebuild/b-s9-ui-pins`, cut from the chain tip `9e1ece8`
(`rebuild/t2-client-core`; v4's measurements were taken in the farm at `023b99f4`).
This round authors exactly one file: this one. No runner, package, test, workflow or product byte moves.

Rule of record: `DECISIONS:536` ("Yes, release the screen files"). Standing seal rule: `DECISIONS:455`.
Design of record: `DECISIONS:530`. Gate audit: `DECISIONS:531`. Hotfix pattern: `DECISIONS:535`.
Parent package: `M2-S8-REAL-SHAPE`, sealed and merged at `DECISIONS:529`.

This is a hypothesis for the PM and for one independent review, not evidence. Every claim below
carries a `file:line`. Where I could not measure a thing I say so by name.

---

## 0. THE MEASUREMENT THAT CHANGES THE SHAPE OF THE ROUND

`DECISIONS:536` names eight release candidates, and **v4 takes them from the ledger line itself
rather than from a paraphrase (R3 N2, FIXED; the slip survived three rounds and two reviews).**
Read out of `:536` verbatim, the eight are `today-app.cjs`, `screens.template.html`, `preview.css`,
`build.mjs`, `design.cjs`, `browser-check.mjs`, `today-model.cjs` and **"the today test cells that
pin only rendering"**. `index.shell.html` appears nowhere in line 536; v1 to v3 substituted it for
the test-cell category and then counted the eight as eight files. The honest headline is therefore
not "five of eight are not sealed": **four of the seven FILES the ruling names are already free,
`today-app.cjs` fails the ruling's own test, and the eighth candidate is a CATEGORY of cells, which
C.3 measures and releases none of.** The closed list is unchanged at two; nothing downstream moves.
`index.shell.html` is kept in the table below as a seventh row marked for what it is, because it was
taken out of the seal by the same hotfix as `today-model.cjs` and a reader of v3 will look for it.

The sealed inventory is a closed list of 224 paths in
`rebuild/m4/spec/acceptance-s8-real-shape.json` (`product`, 224 entries; `executionPins`, 71).
Under `rebuild/m3/w7-preview/` it holds 49 paths; under `rebuild/m3/w7-preview/today/` it holds
23 (11 source files and 12 test cells). The directory itself holds 45 source files plus `test/`.

| candidate named in :536 | in the S8 sealed inventory? | consequence |
|---|---|---|
| `today/today-app.cjs` | YES, role `carried`, post `dc9a826eda96659b...` | the hard case, section A |
| `today/preview.css` | YES, role `carried`, post `7cf97598c2c2cb23...` | the one clean release |
| `today/build.mjs` | YES, role `carried`, post `d04a10ef406708b8...` | releasable, at a named cost |
| `today/screens.template.html` | NO | already free; nothing to release |
| `today/design.cjs` | NO | already free; nothing to release |
| `today/browser-check.mjs` | NO | already free; nothing to release |
| `today/today-model.cjs` | NO (taken out by the hotfix, `DECISIONS:535`) | already free; nothing to release |
| **the today test cells that pin only rendering** (the ruling's eighth candidate, a CATEGORY) | **YES, all thirteen**: 12 product pins and 13 execution pins under `today/test/` | measured in **C.3**, which recommends releasing **none** of them, for two independent reasons |
| `today/index.shell.html` (NOT named by `:536`; listed because v1 to v3 named it) | NO (same hotfix) | already free; nothing to release, and nothing in `:536` asks |

So the CLOSED LIST the ruling asks for is not eight paths. It is at most three, and after reading
the files it is **two**. Everything else the ruling names is already outside the seal and lane C can
edit it today without a reseal child. That is the single most load-bearing fact in this document,
and it is the reason section E's order of work can start now.

The ruling's estimate ("about 1.5 to 2 weeks down to about 1 week") does not follow from a two-path
release on its own. What it follows from is section A's finding about `today-app.cjs`. See F, TOLD-1.

**PM-R1 (Q1), carried out.** The PM has ACCEPTED the two-path closed list for the files that exist
today, and has NOT re-opened `DECISIONS:536` to release `today-app.cjs`. The split that would free
the drawing half is now its own lane, **TODAY-SPLIT** (`rebuild/c-today-split`, spec
`rebuild/lanes/c/TODAY-SPLIT-SPEC.md`).

**PM-R10 changes that lane's DIRECTION, and A.2.1 is re-cut to it.** `DECISIONS:543` (A) ruled
TODAY-SPLIT-SPEC v1 (`14c87fa7`, view extraction) superseded by round 2 on the same branch: the
**WRITERS** leave `today-app.cjs` and `gym-app.mjs` for a new SEALED module, and `today-app.cjs` and
`gym-app.mjs` themselves are **RELEASED by S10 through the released role S9 builds**. So the thing
S9 hands the split is no longer a place to put new free files; it is the RELEASE MECHANISM ITSELF.
A.2.1 now says what S9 must leave in place so S10 can release a file that eleven sealed cells import,
and answers the runner question the PM asked round 4 for. **Nothing in the release mechanism of
section B depends on TODAY-SPLIT**, so S9 preparation neither waits for it nor changes shape when it
lands; what changes is that the mechanism must be built so that S10 can point it at a bigger file.

---

## A. THE LIST

Method: RELEASED = the file renders, styles, binds a read-only view, or builds the preview page.
SEALED = it admits, imports, stores, replays or computes; calls `logSet` or any writer; touches
IndexedDB or state. A file that does both stays SEALED (`DECISIONS:536` (2)). I read every file.

### A.1 The three sealed candidates, judged

| path | S8 role | verdict | deciding lines | C-UI tickets |
|---|---|---|---|---|
| `rebuild/m3/w7-preview/today/preview.css` | `carried` | **RELEASED** | 121 lines of CSS (`find /c /v ""`); zero matches for `indexedDB`, `save(`, `logSet`, `localStorage`, `host.` | C-UI-1 (replaced by the pinned stylesheets) |
| `rebuild/m3/w7-preview/today/build.mjs` | `carried` | **RELEASED, at a cost named in A.4** | `buildToday` `build.mjs:465` reads shell/template/chrome and writes three assets at `build.mjs:507`; it stores nothing and computes nothing about the athlete | C-UI-1 (serve assets offline, honour review hooks) |
| `rebuild/m3/w7-preview/today/today-app.cjs` | `carried` | **SEALED** | see A.2 | C-UI-2, C-UI-3, C-UI-6, C-UI-7 |

### A.2 `today-app.cjs`, the hard case: read handler by handler

2625 lines (`find /c /v ""`), 151537 bytes. It is a view module that also OPENS and WRITES the
encrypted local store.

| line | what it does | class |
|---|---|---|
| `today-app.cjs:513` | reads `view.indexedDB` / `globalThis.indexedDB` for the sleep lane | store |
| `today-app.cjs:518` | `createSleepHost({ day, indexedDB, crypto })` | store |
| `today-app.cjs:581` | `await host.save(day)` (food lane save) | writer |
| `today-app.cjs:493` | `await host.save(night, precondition)` (sleep lane save) | writer |
| `today-app.cjs:596-601` | opens `createFoodHost` on this device's IndexedDB | store |
| `today-app.cjs:637` | the gym/settings lane's own `indexedDB` handle | store |
| `today-app.cjs:1072` | `await model.weighIn(...)` from the inline weigh-in sheet submit handler (`:1059`) | writer |
| `today-app.cjs:1278-1293` | `recordIntake` -> `await foodLane.save(dayValues)` from the Save click (`:1272`) | writer |
| `today-app.cjs:1807-1843` | `recordSleep` -> `await sleepLane.save(night, { supersedes })` from the Save click (`:1721`) | writer |
| `today-app.cjs:2052-2059` | opens the workout entry over IndexedDB (`createWorkoutEntry`) | store |
| `today-app.cjs:2501` | `await workout.gym.rebase()` on day change | state |
| `today-app.cjs:826` | `[data-go]` router; `:645` `renderMeasure`; `:703` `renderImport` | render |

Verdict: **SEALED**, unambiguously, by the ruling's own test. It calls three distinct durable
writers from three distinct click handlers and opens five IndexedDB lanes.

### A.2.1 TODAY-SPLIT: the direction has REVERSED, and what S9 must leave in place for S10 (PM-R1, re-cut by PM-R10)

**v4 replaces this section outright. R3 N1 was right that v3's four items were short, and the
ledger then moved underneath them: `DECISIONS:543` (A), which landed after v3's base, REVERSES the
cut.** v3's A.2.1 described v1 of the split spec (`14c87fa7`, 853 lines): extract about 1700 lines
of VIEW into five new free modules and keep `today-app.cjs` sealed. That direction is overruled.
v1's MAP, PROOFS, WRITER-FENCE and SEQUENCING are kept; its CUT is reversed. I did not re-read
round 2 of the split spec: `farm-sync.sh rebuild/c-today-split` still returns `14c87fa7`, so round 2
is not pushed and this section rests on `:543` (A) itself, which is the ruling and not a summary.

| the ruling `DECISIONS:543` (A) | what it means for S9 |
|---|---|
| the WRITES regions move OUT of `today-app.cjs` into ONE new SEALED module (working name `today-lanes.cjs`); `gym-app.mjs`'s writers ride the same lane | the new module is a NEW file S10 declares `role: "new"`. S9 declares nothing of it and needs no hunk for it |
| `today-app.cjs` keeps its name, `mountToday`, the router and every drawing and read-only binding region, and is **RELEASED through the role S9 builds** | **this is the whole of S9's obligation to the split.** S10 points `RELEASE-FROM-SEAL` at `today-app.cjs` and `gym-app.mjs` under its own PM token line |
| the strict call-site rule: no released file calls, imports or holds a writer; `today-model.cjs`'s `weighIn` goes to the sealed side, its projection and the S2 composer stay free | the WRITER-FENCE (D.4) is what enforces it, and TODAY-SPLIT still owns it |
| carrier: **S10**. The today-carry lane lands first | S9 does not carry the split at all, in either direction |

**So S9 neither waits for the split nor carries it, and the "if it is accepted in time" column of
v3 is deleted rather than re-worded.** The release mechanism of section B still names
`today-app.cjs` nowhere, which is the test PM-R1 set and which v4 passes for the same reason v3 did.

#### A.2.1.1 PM-R10's measurement: can S10 release a file that eleven sealed cells import?

This is the question the PM asked round 4 to answer, and it is answered by measurement, in the farm,
at `023b99f4`. **The short answer is YES, no runner rule blocks it, and the one thing that does
block it is a sealed CELL, not the runner.**

| question | measured answer | how |
|---|---|---|
| is `today-app.cjs` a child argv target, so that `proposed()` `:2800` (`for (const c of s.children) for (const f of childArgv(c)) pins[f] = diskSha(f)`) re-pins it into `executionPins`? | **NO.** `packages/S8.json` declares **25 children with 68 distinct argv targets, and every one of the 68 is a test cell**: not one source module is executed by any declared child | parsed `packages/S8.json`, took `childArgv`'s own rule (`b-package.cjs:637-:658`: flags first, then explicit files under `CHILD_ROOTS`), and listed the targets |
| so does B.6's rule "a released path must not be a child argv target" bar it? | **NO.** That rule is what keeps the thirteen today test cells out of the closed list (C.3 reason 2); it does not reach a module the cells merely import | same |
| is it in the maps the release mechanism needs? | **YES in `product`** (role `carried`, `dc9a826eda96659b...`), **NO in `executionPins`** - the identical shape `preview.css` and `build.mjs` have, so B.2, B.4, H7, H10 and H17 release it with no new hunk | parsed `acceptance-s8-real-shape.json` |
| how many sealed files import it? | **14**, of which **11 are cells**: `today/test/{view,copy,gym,food,setup,problem,checkin}.test.mjs`, `m3/w6/test/{local-source-consumer,local-today-journey}.test.mjs`, `lanes/d/p3-real-shape/bar-keep.test.mjs`, `m4/workout/test/h3-clean-init.test.cjs`; the other three are `today-entry.mjs`, `gym-app.mjs` and `measure/test/support.mjs`. This confirms `:543`'s "eleven test files import `today-app.cjs`" | resolved every relative `require`/`import` specifier and intersected with both S8 maps |
| does ANY runner rule bind a pinned file's IMPORTERS? | **NO.** `closure()` (`:746`) and `requiresOriginal()` (`:663`) are gate-and-successor machinery: their call sites are `:1595` (`COVERAGE-MOVE-CHILD-DOES-NOT-EXECUTE-THE-ORIGINAL`) and `:2417` (`SUCCESSOR-REQUIRES-THE-ORIGINAL-INSTEAD-OF-COMPILING-IT`), both over gate originals under `rebuild/engine` and `rebuild/conform`. No `m3` path is a gate original. `ownChildren()` (`:728-:730`) reads argv targets only | read every call site |

**The one thing that DOES block it, and S9's job is to name it now so S10 does not discover it.**
`measure/test/boundary.test.mjs` P-MEASURE (g) (`:128-:190`), a SEALED cell (product AND execution
pin), is a byte pin over `today-app.cjs` of exactly the kind C.2 found over the two released files,
and it is one order stronger:

- `packages/S4.json` pins `today-app.cjs` (`role: "new"`, post `1ae7fbc6815588b9...`), so the path is
  in the `S4.product` map the cell walks at `:129`;
- `:137-:139` require every drifted file to stand at `declaredPost(file)`, and `declaredPost`
  (`:117-:126`) walks `CHILD_SPECS` youngest first and **only accepts a spec whose `post` is a
  STRING**. A `released` declaration carries `post: null` by B.4 and PM-R5, so a released path is
  invisible to `declaredPost` and falls through to S8's `dc9a826e...`;
- `:181` goes further and asserts `drifted.includes(MINE)` with `MINE = today-app.cjs`, and `:183`
  asserts the whole drifted set under `today/` equals `[MINE, today-entry.mjs]` exactly.

So the first lane C edit to a RELEASED `today-app.cjs` turns that cell red, at `:137-:139`, for a
file no spec declares a post for any more. **S10 must re-home it exactly as C.2 re-homes the other
two:** drop `:181` and take `MINE` out of `:183`'s expected set, leave the S4 walk and the two
`P3_IMPORT_UI_2_UNSEALED` asserts standing, and write one comment naming the path as RELEASED by its
token line. It cannot simply move into `P3_IMPORT_UI_2_UNSEALED`, because that branch asserts
`Object.hasOwn(product, f) === false` (`:186-:187`) and S4 DOES pin `today-app.cjs`. **S9 changes
none of this**; S9's obligation is to have said it.

**And one thing that survives the release unharmed, which is worth the PM knowing.**
`design.test.cjs` (SEALED, `0db62ca9...`, both maps, CI-homed at `rebuild.yml:231-:232`) pins
`design.VIEW_SOURCES` by literal at `:79-:81` (`today-app.cjs` first of six), reads each named file's
own bytes at `:83-:87`, and runs `assertDesignBinding` over `design.appSource()` at `:72`, where
`appSource` (`design.cjs:619`) is the concatenation of all six. So **after S10 releases
`today-app.cjs`, every `RUNTIME_COPY` and `PREVIEW_RUNTIME_COPY` string must still occur verbatim in
it (`design.cjs:549`, `:554`), asserted from inside the seal.** Releasing the file does not take its
on-screen copy out of the sealed check; it only takes its BYTES out. That distinction is the whole
subject of C.6.

#### A.2.1.2 What S9 must leave in place, hunk by hunk, so S10 can do this

| what S9 must leave | why |
|---|---|
| H1 to H13 and H17 **path-agnostic**: not one of them may name a path, a directory or a count of released paths | S10 points the same mechanism at two bigger files. A hunk that hard-codes "two" or `w7-preview/today/preview.css` is a hunk S10 has to re-open, which is a sealed byte and a second PM line |
| **H9 as an ASSERTION, not a list.** "the released set equals `releaseRuling().granted`", and B.6's released-versus-`childArgv` disjointness likewise asserted, never enumerated | `today-app.cjs` passes the disjointness assert today (measured above). An enumerated exclusion list would pass it for the wrong reason |
| **H17's `releasedAncestry(a)` union over the artifacts `pins()` actually reads** (the parent's and the grandparent's), exactly as B.3 specifies | S11's grandparent is S9 and its parent S10; both carry a `released` block, and the union is what keeps two generations of releases skipped without opening a third file |
| `today-app.cjs` left in `product` with role `carried` (or `edited`, if S9-TODAY-CARRY moves its one binding line at `:869`, which `DECISIONS:542` (D) says it does), and **never** added to `executionPins` | a path in `executionPins` is re-pinned by `proposed()` `:2800` on every run. S9 adds nothing to that map, and S10 needs the path to leave `product` cleanly |
| **H18's 26-entry literal phrased as a BUNDLE-INPUT law, never as a byte pin.** It names `today-app.cjs` among the 26 | `REQUIRED_INPUTS` membership stays true after a release; a byte pin would not. If H18 were written as a sha comparison, S10 would have to edit a cell S9 had just sealed |
| C.2's general rule stated as a rule, with `boundary.test.mjs` P-MEASURE (g) named as S10's instance | this is the whole content of A.2.1.1's blocking paragraph, and it is cheaper to write here than to discover in S10 |
| D.4's WRITER-FENCE left OWNED by TODAY-SPLIT, and S9 owing it only a `CHILD_ROOTS` entry and a `rebuild.yml` step **if** it lands in S9's window | under PM-R10 the fence matters more, not less: after the split the released `today-app.cjs` is exactly the file that must never regrow a writer |

**What staying sealed costs C-UI-2 to C-UI-8**, measured from the tickets
(`git show origin/rebuild/c-ui-0-gates:rebuild/lanes/c/ui-port/C-UI-N.md`):

| ticket | names `today-app.cjs`? | lands as |
|---|---|---|
| C-UI-2 Today, the face | YES, "bindings only: the slots keep their names; new slots for the status pill, the note block, the timeline markers" | reseal child |
| C-UI-3 proposal card + weigh-in | YES, "`today-app.cjs`'s proposal binding" | reseal child |
| C-UI-4 set and rest screens | no (`gym-app.mjs` YES, sealed; `gym-model.mjs` not sealed) | reseal child, for `gym-app.mjs` |
| C-UI-5 workout panels | `machine-settings-host.mjs` YES (sealed); `gym-app.mjs` YES (sealed) | reseal child |
| C-UI-6 coach | YES, "the coach stub in `today-app.cjs` becomes the coach screen" | reseal child |
| C-UI-7 the entries | YES, "the Why this plan view in `today-app.cjs`"; `food-host.mjs` and `reading-host.mjs` YES (sealed) | reseal child |
| C-UI-8 PWA shell | no (`rebuild/slice/pwa/**` already unpinned, `DECISIONS:536`) | plain lane C |

**So: six of the seven remaining UI tickets still ride a reseal child after this release.** The
release as ruled buys C-UI-1 and C-UI-8 their freedom and buys nobody else theirs.
`DECISIONS:543` (A) records the same number from the other side, measured by a third hand's
LOOK-VERSUS-SEAL map: 2 of the 8 look tickets ship as lane C after S9, and TWO writer extractions
(about 455 lines out of `today-app.cjs` for C-UI-2, 3, 6, 7 and about 65 out of `gym-app.mjs` for
C-UI-4, 5) free the other six. This is the finding the PM most needs, it is why TODAY-SPLIT exists
as its own lane and why PM-R10 reversed its cut (A.2.1), and it is what F's TOLD-1 paragraph tells
the owner in plain words (PM-R8).

**Two ticket-column slips, corrected (R3 N7, FIXED).** R3 checked A.2.1's four quotes and found them
verbatim; it found two slips in A.5's and A.2's columns and I take both: A.5's
`screens.template.html` row said tickets "2,3,4" and C-UI-3 does not name that file, so it reads
**2,4**; and A.5's C-UI-7 row said `food-*` where the ticket says `food-host.mjs`. Neither changes a
verdict, and R3 was right that the columns were read rather than guessed, which is why Appendix 8 is
now corrected rather than defended.

### A.3 Every other S8-pinned file under `rebuild/m3/w7-preview/`, classified

The 49 sealed paths under `w7-preview/`. `import/**` (10) and `measure/**` (15) are out of scope by
`DECISIONS:536` (SEALED by name, and `measure/` is the reading lane). The remainder:

| path | S8 role | verdict | deciding lines | C-UI |
|---|---|---|---|---|
| `today/today-app.cjs` | carried | SEALED | A.2 | 2,3,6,7 |
| `today/preview.css` | carried | RELEASED | pure CSS | 1 |
| `today/build.mjs` | carried | RELEASED (A.4) | `build.mjs:465`, `:507` | 1 |
| `today/today-entry.mjs` | carried | SEALED | `today-entry.mjs:141` `await host.save(document_)`; opens gym, reading, check-in and setup hosts (`:21-:33`) | - |
| `today/gym-app.mjs` | carried | SEALED | `gym-app.mjs:161-166` opens IndexedDB and mints `createMachineSettingsHost` | 4,5 |
| `today/gym-host.mjs` | carried | SEALED | the era/lease opener every other lane imports | - |
| `today/food-host.mjs` | carried | SEALED | `food-host.mjs:76-97` era, lease, repository | 7 |
| `today/reading-host.mjs` | carried | SEALED | `reading-host.mjs:36-38` era over IndexedDB | 7 |
| `today/machine-settings-host.mjs` | carried | SEALED | `machine-settings-host.mjs:63-85` era, lease | 5 |
| `today/problem-report.cjs` | carried | SEALED | carries the build id and commit placeholders the build injects (`build.mjs:32`, `:320`, `:332`, `:362`) | - |
| `today/local-source-basis.mjs` | new (S8) | SEALED | the admitted import's basis; `DECISIONS:536` names it SEALED | - |
| `w7-preview/build.mjs` | carried | SEALED (out of scope) | the preview-wide build, not the Today page | - |
| `w7-preview/browser-engine.cjs` | carried | SEALED (out of scope) | engine shim | - |
| `today/test/*` (12 cells) | carried | see section C | - | - |

### A.4 `build.mjs`: what releasing it hands to lane C

`today/build.mjs` builds the page, so it is RELEASED by the ruling's working rule. **PM-R2: it is
released ONLY with H18 in the same package.** It also carries laws that are not presentation, and
v2's table of five was two short (R2 N7). **The COMPLETE list of what `buildToday` (`build.mjs:465`
to `:513`) enforces, re-read line by line in the farm, is SEVEN laws plus four build hygiene
asserts.** The seven:

| # | law | implemented | called by `buildToday` | what it refuses | asserted by a SEALED cell's OWN literals? |
|---|---|---|---|---|---|
| 1 | `FORBIDDEN` | `build.mjs:79` | `:480` `assertBundleInputs` | modules the page may not pull into the bundle | **YES.** `today/test/package.test.cjs:76-:80` (`seed.cjs`, `index.cjs`, `engine/test/`, `authority/`, `ledger/`, `src/history.js` by literal), `:84` `assert.throws(build.assertBundleInputs([{path:'rebuild/engine/seed.cjs'}]))`; independently `import/test/page-bundle.test.mjs:54-:61` `STILL_FORBIDDEN` (sealed, execution-pinned, CI-homed at **`rebuild.yml:264-:265`**, the `- name: P3` step and its run line; **R3 N6, FIXED and re-read in the farm**: `:231-:232` is the A1/A2/A3/A4 step, whose 17 named cells are the thirteen `today/test/*` and four `measure/test/*` and carry no `import/` path at all. R2 supplied the wrong number first and v3 took it) |
| 2 | `REQUIRED_INPUTS` | `build.mjs:98-:201` | `:480` `assertBundleInputs` | a bundle that lost a module the page needs | **NO for 26 of its 48 entries.** `package.test.cjs:59-:60` names six by literal (`engine/today.cjs`, `energy.cjs`, `writers.cjs`, `client/index.cjs`, `ops.cjs`, `store.cjs`) and `:72-:73` counts engine at 15 and client at 12. There is NO count and NO literal for the `today/**` half. **H18** |
| 3 | `assertImportRouteIsolation` | `build.mjs:384` | `:484` | the Import route leaking into the Today entry | **YES.** `package.test.cjs:94-:107` plants an import-statement edge and requires `IMPORT-ROUTE FAIL` |
| 4 | `assertNoNetworkReference` | `build.mjs:209` | `:497` | any remote origin in the emitted assets | **YES.** `package.test.cjs:127-:138`, four bad literals, each must throw `NETWORK-REFERENCE FAIL` |
| 5 | `assertNoNodeOnlyGlobals` / `NODE_ONLY` | `build.mjs:244-:249` | `:499` | a bundle that only runs under Node | **YES.** `copy.test.mjs:207`, `:264`, `:303` |
| 6 | `assertDesignBinding` (R2 N7, added) | **`design.cjs:527-:570`**, copy rules `:538-:556` (v4, re-read for R3 BLOCKING-E) | `:472` | a class or a sentence on the screen that the approved design does not carry | **CALL SITE yes, CONTENT no.** `design.test.cjs:72` runs it and `:109-:115` proves it can fail, by its own literals, for `"Your plan for today"`, `"Eat about"` and `"Weight trend"`. `design.test.cjs` is sealed (`0db62ca9...`, both maps). But the three things it compares (`design.cjs`'s arrays, `screens.template.html`, the approved references) are ALL unsealed: C.4 and C.5 |
| 7 | `assertNoAiDashesInAssets` (R2 N7, added) | **`plain-copy.cjs:288`**, exported `:305`, destructured into `build.mjs` at `:31` (**R3 N6, FIXED**: `build.mjs:31` is `const { assertNoAiDashesInAssets } = PlainCopy`, an import and not the implementation) | **`:501`** (`const dashes = assertNoAiDashesInAssets(Object.entries(contents))`) | an em or en dash in anything the athlete reads | **YES, and of an unusual kind that survives a released call site.** `copy.test.mjs:395` and `:405` plant a dash in a COPY of the tree, run the real `buildToday` over it and require `AI_DASH_IN_BUILD`. A `build.mjs` that dropped the CALL goes red, because the cell asserts the build's refusal, not the function's |

The four hygiene asserts, named so the table is complete rather than seven-exactly: `:466`
`readApproved()` and `:467` `readFonts()` re-enforce the design-of-record and font pins at build
time (C.5); `:471` `TEMPLATE-SLOT FAIL`; `:452-:455` `realDirectory` / `OUTPUT-DIRECTORY FAIL`;
`:504` `OUTPUT-CLEAN FAIL` with `:508` `PACKAGE-ALLOWLIST FAIL`. None of the four decides what the
athlete's page may contain, which is why they are listed rather than tabled.

**One measurement v4 adds to law 7, because it strengthens the row rather than weakening it.**
`plain-copy.cjs` and `dash-check.mjs` are **in neither S8 map** (I parsed the artifact for both), so
the no-dash rule's IMPLEMENTATION is as free as `build.mjs` is about to be. The row still holds, and
for the reason the row already gave: `copy.test.mjs:395` and `:405` plant a dash in a COPY of the
tree and run the real `buildToday` over it, so they assert the BUILD's refusal. An unsealed
implementation that stopped refusing turns those two red from inside the seal. This is the one
pattern in the document where an unsealed file is genuinely held, and it is worth naming as the
shape C.6 should copy for the copy lock.

Released, a lane C ticket can edit any of the seven in the same PR as a stylesheet swap. So the
question is not "is the law in a released file" but "is the law ALSO asserted, by its own literals,
inside a cell that stays sealed". v1 answered yes for all five in one sentence. R1 BLOCKING-3
measured it and found four of five. v3 re-measures it over seven and finds **five clean, one
(`assertDesignBinding`) clean only at its call site, and one (`REQUIRED_INPUTS`) not asserted at
all for its `today/` half.**

The `REQUIRED_INPUTS` gap, measured rather than argued. **The constant holds 48 paths, not 51 (R2
N6, CONFIRMED and it is my own error, not the reviewer's):** a script that counts every quoted
string between `build.mjs:98` and `:201` returns 51, and three of those 51 are prose inside the
block's own comments (`"Report a problem"`, `"Import my\n     history"`, `"I'll name it\n     myself"`).
Counting path literals only gives **48: 26 under `rebuild/m3/w7-preview/today/`, 3
`rebuild/engine/`, 3 `rebuild/client/`, 1 `rebuild/coach/`, 8 `rebuild/m4/`, 7 other `rebuild/m3/`.**
The 26 are unchanged and the argument does not move. The 26 are
(`today-model.cjs`, `today-app.cjs`, the three gym modules,
`reading-host.mjs`, the four `checkin-*`, the four `setup-*`, `split-kinds.mjs`,
`exercise-catalogue.mjs`, `starter-week.mjs`, `problem-report.cjs`, the three food modules,
the two machine-settings modules, the three sleep modules). I searched every cell under
`w7-preview/{today,import,measure}/test/` for an assertion that any of those 26 is a required bundle
input: **there is none**. The cells import those modules directly (`view.test.mjs:17`,
`copy.test.mjs:36`, `gym.test.mjs:32`, `checkin.test.mjs:18`), which proves the module exists and
behaves; it does not prove the BUILD still refuses a bundle that lost it. So after the release a
lane C branch could delete `rebuild/m3/w7-preview/today/reading-host.mjs` from `REQUIRED_INPUTS`
and every sealed cell stays green, which is exactly the failure the law was written against
(`build.mjs:112-:115`, "a page whose readings can vanish on a hard kill").

**The fix, and it is a named S9 hunk, not a promise: H18.** `today/test/package.test.cjs` (SEALED,
`carried` + execution pin `1a29e3e0...`) gains its own literal list of the 26 `today/` entries and
asserts, for each, both (a) that `build.REQUIRED_INPUTS` still contains it and (b) that
`result.inputs` carries it in the built bundle. Red-first: with H18's cell in place and one entry
removed from `build.mjs`'s `REQUIRED_INPUTS`, `package.test.cjs` must fail naming that path; on
today's tree, before H18, the same deletion is green everywhere. `package.test.cjs` is edited
inside S9 and declared role `edited`, which is what a reseal child is for; a lane C branch cannot
touch it afterwards without the fence refusing (section D).

With H18, and only with H18, the sentence in the token line's brief is true, and v3 states it over
seven laws rather than five: **six of the seven build laws keep their full teeth from a sealed
cell even though the file that implements them is free, and the seventh (`assertDesignBinding`)
keeps its CALL SITE from a sealed cell while its CONTENT is held by the two new cells of C.5.**
Without H18 the honest list is one path, not two (R1's option (b)), and F.2 STOP-4 fires.

### A.5 Files the C-UI tickets touch that are NOT sealed today (no release needed, and one warning)

| path | ticket | already free? | note |
|---|---|---|---|
| `today/screens.template.html` | **2,4** (R3 N7: C-UI-3 does not name this file) | yes | markup only, 508 lines. **It carries on-screen copy and S9 does not release it, because nothing ever sealed it: C.6** |
| `today/design.cjs` | 1 | yes | the design-of-record pins live here; section C |
| `today/browser-check.mjs` | 1 | yes | `browser-check.mjs:60` reads `design.headlineVocabulary()`; stale-red at the tip (`DECISIONS:535`). **PM-R3: it STAYS OUTSIDE the seal. RULED: no CI home (it needs a real browser binary, which no GitHub runner has), run on the PC before each seal, the result recorded in the VERDICT.** Sealing a stale-red file would pin a broken byte; a step that cannot exist is not a CI home. This is now a decision, not a question |
| `today/today-model.cjs` | - | yes | **computes AND writes** (v1 said only "computes"; R1 N10 is right and I re-measured it): `today-model.cjs:120` `planMove`, `:128` `projectionOf` compute; `:378` `async function weighIn(lb)` writes through `readings.weighIn(...)` at `:395`, behind the admission refusals `ALREADY_RECORDED` `:365` and `OUT_OF_RANGE` `:373` and the form bounds `FORM_MIN`/`FORM_MAX` `:372`. By :536's own words ("any file that calls `logSet` or writes state") it is a SEALED-class file standing outside the seal. **PM-R3: this spec does NOT declare it.** Its writer (`:378` to `:395`) goes into the sealed half under TODAY-SPLIT (A.2.1); its pure projection (`:120`, `:128`) stays free. Until the split lands it is carried OUT LOUD in the S9 brief as a named exception: *one file that writes an athlete's weight reading stands outside the sealed inventory, by the accepted hotfix `DECISIONS:535` (a), and TODAY-SPLIT is what puts its writing half back* |
| `today/gym-model.mjs` | 4 | yes | **`gym-model.mjs:502` `async function logSet(...)`**; by :536's own words ("any file that calls `logSet`") this is a SEALED-class file standing outside the seal. **PM-R3: S9 DECLARES it `pinned-unchanged` (E fact 17).** It writes athlete state and stands outside the seal, and S9 neither writes it nor needs to |
| `today/machine-settings-view.mjs` | 5 | yes | render only (`:124`, `:154` are DOM appends) |
| `today/checkin-*.mjs` | 2 | yes | `checkin-app.mjs:150` `await model.save()`; SEALED-class, outside the seal. **PM-R3: S9 DECLARES `checkin-app.mjs` `pinned-unchanged` (E fact 17)**, for the same reason as `gym-model.mjs`. The other three `checkin-*` files are not declared by this spec |
| `today/food-model.cjs`, `food-commands.cjs`, `sleep-*` | 7 (the ticket names **`food-host.mjs`**, not `food-*`; R3 N7) | yes | model and command layers, outside the seal |
| `today/plain-copy.cjs`, `today/dash-check.mjs` | - | yes | **v4 adds this row**: the no-dash rule's implementation is unsealed too, and it is held anyway, by `copy.test.mjs:395`/`:405` asserting the BUILD's refusal over a planted copy of the tree (A.4 law 7) |
| `rebuild/slice/pwa/**` | 8 | yes | `DECISIONS:536` says so. **Said out loud, per R1 N6:** `rebuild/slice/pwa/build-pwa.mjs:19` does `import { buildToday, DIST as A1_DIST, ROOT } from "../../m3/w7-preview/today/build.mjs"`, and nothing under `rebuild/slice/` is in `product` or `executionPins`. So releasing `build.mjs` makes the DEPLOYED PWA's build chain unsealed end to end. That is a consequence of the ruling, not a surprise inside it, and the S9 brief must state it in one sentence rather than let a later reader discover it |

### A.6 THE CLOSED LIST

```
rebuild/m3/w7-preview/today/preview.css
rebuild/m3/w7-preview/today/build.mjs
```

Two paths. Both are in the S8 sealed inventory; both are named verbatim in the S9 spec and in the
PM token line; neither is a pattern. Nothing else in `DECISIONS:536`'s candidate list is sealed, and
`today-app.cjs` fails the ruling's own test.

**PM-R1 has ACCEPTED this list** for the files that exist today, and has not re-opened `:536`.
**Under PM-R10 the list does not grow either, and for a sharper reason than v3 gave:** TODAY-SPLIT
now rides S10, not S9 (`DECISIONS:543` (A), "CARRIER: S10, which USES the released role S9 builds"),
so S9's closed list is two paths whatever the split decides, and the paths the split frees
(`today-app.cjs`, `gym-app.mjs`) are released under **S10's own** `RELEASE-FROM-SEAL` line. There is
no branch of this document in which S9's token line names a third path. A.2.1.2 says what S9 must
leave in place so that S10's line works; nothing there changes A.6.

**The second path is CONDITIONAL, and the condition is code, not intent (v2, R1 BLOCKING-3;
RATIFIED by PM-R2).**
`build.mjs` enters the closed list only if hunk H18 lands in the same package, because H18 is what
makes "the build laws keep their teeth from a sealed cell" true of `REQUIRED_INPUTS` as well as of
the other four. If the PM drops H18 for scope, the closed list is ONE path (`preview.css`) and the
token line names one path. The list and the hunk ship together or the list shrinks; it is never
shipped on the sentence alone.

---

## B. THE MECHANISM, inside the existing runner rules

All line numbers are `rebuild/lanes/b/tooling/b-package.cjs` at `9e1ece8`
(sha256 `e31dd206c0fb0fc0c295df45eae3992d4c59b1a76de8da04a4d0f22948e9335e`, `DECISIONS:524`).

### B.1 Where the seal actually lives, so the release lands in the right four places

| what | where | why it matters to a release |
|---|---|---|
| the closed role vocabulary | `PRODUCT_ROLES` `b-package.cjs:351`, enforced `:1519` | a sixth role must be added HERE and nowhere else (W7) |
| the parent-pin branch | `product()` `:1890-:1895`; `:1893` pre-image equality, `:1894` role must be `carried` or `edited` | the release must be admitted at `:1894` or it refuses |
| the disk comparison | `:1962` carried, `:1967` pinned-unchanged, `:1968` post, `:1969` pre, `:1970` drift, `:1972` `assert(!at.drift.length)` | a released file must never reach these lines |
| inventory completeness | `:1975` every parent-pinned file must appear in this spec's inventory | a released file must STILL be declared, or the run refuses |
| parent pin re-assertion, **two walks, not one** | `pins()` `:1834`: the PARENT walk `:1837-:1839` and the GRANDPARENT walk `:1851-:1853` with its skip test at `:1852`, both through `held()` `:1828-:1833` | see B.3. v1 analysed only the first walk; that was the round's worst error and R1 BLOCKING-1 caught it |
| the artifact | `proposed()` `:2796`, `product: s.product` at `:2826`, `executionPins` at `:2800`, key closure `ARTIFACT_KEYS` `:2830`, recomputation `:3021` | see B.4 |
| the byte-identity re-verify | `sealedRunReceipt()` `:2930`, product both ways `:2970` and `:2972`; written by `writeSealedRunReceipt()` `:2991`, `:2993` | see B.6 |
| the grant-token precedent | `SUPERSESSION_GRANT` `:932`, shape `:933`, bound in `supersessionRuling()` `:1189` | see B.2 |

### B.2 THE PM TOKEN LINE

A released path may never be released by pattern, by a later child silently, or without a PM line.
The token gets the exact treatment `GATE-SUPERSESSION` gets, which is the only precedent in the
runner for "a PM grants a named package a named exemption".

Exact shape (to be added beside `SUPERSESSION_GRANT_SHAPE` at `b-package.cjs:933`):

```
RELEASE-FROM-SEAL <packageId> <path>[,<path>...]
```

`const RELEASE_GRANT = /^RELEASE-FROM-SEAL\s+(M2-[A-Za-z0-9-]+)\s+([A-Za-z0-9_.\/-]+(?:,[A-Za-z0-9_.\/-]+)*)$/;`
`const RELEASE_GRANT_SHAPE = 'RELEASE-FROM-SEAL <packageId> <path>[,<path>...], alone in its own · clause';`

The exact line for S9, to be written by the PM on `rebuild/t2-client-core`:

```
- 2026-09-__ · cowork (PM, EARNED - PM4) · RELEASE-FROM-SEAL M2-S9-UI-PINS rebuild/m3/w7-preview/today/preview.css,rebuild/m3/w7-preview/today/build.mjs · the owner's ruling DECISIONS:536 releases presentation-only files from the sealed package inventory; these two paths are the whole of the closed list judged in rebuild/lanes/b/S9-RELEASE-SPEC.md; each leaves the inventory at the sha256 M2-S8-REAL-SHAPE sealed it at and is recorded in the S9 artifact under role "released"; every other sealed file still refuses unlisted drift; a released path can be re-sealed by a later child declaring it role "new" · RULED
```

How the runner binds to it, mirroring `supersessionRuling()` `:1189-:1223` line for line:

1. the spec carries `release.rulingLineSha256` (a 64-hex string, never the text);
2. the runner re-reads `rebuild/DECISIONS.md` out of Git at `CHAIN_REF`
   (`const CHAIN_REF = 'refs/remotes/origin/rebuild/t2-client-core'`, `:189`; the read is
   `L.object(root, CHAIN_REF, 'rebuild/DECISIONS.md')` at **`:1201`**) on EVERY call, no cache
   (the r10 F4 lesson, comment `:1195-:1200`), and requires **exactly one** line on the chain branch
   whose own bytes hash to that sha (`:1202`);
3. that line must end in ` RULED` (the assert is **`:1208`**), so a lane cannot release anything by
   writing its own branch's ledger;
4. the line must carry at least one `RELEASE-FROM-SEAL` token (`:1211`) naming THIS `packageId`
   (`:1216`), and the granted path set is the union of that token's comma list;
5. every path the spec declares `role: "released"` must be in the granted set, and every granted
   path must be declared `released` (set equality, both directions, so the ledger and the spec
   cannot drift apart);
6. every granted path must be a key of the PARENT artifact's `product` map, and its declared `pre`
   must equal `parentPin(pmap[file], file)` (`:1816`) - you cannot release what the parent never
   sealed.

### B.3 Parent pin re-assertion for a file S9 releases

**v2: v1's answer here was half right, and the half it missed would have undone the release one
generation later. R1 BLOCKING-1 is CONFIRMED, re-derived on the PC, and it needs a hunk.**

`pins()` (`:1834`) has TWO walks.

**Walk 1, the parent walk (`:1837-:1839`).** It iterates `{...a.product, ...a.executionPins}` of the
PARENT artifact and calls `held()` (`:1828-:1833`), which is three asserts, not the two v1 quoted:

```
1828| function held(s, file, hash, code) {
1829|   if (Object.hasOwn(s.product, file)) { assert.equal(gitSha(s.sourceBase, file), hash, code + '-AT-SOURCEBASE ' + file); return false; }
1830|   assert.equal(diskSha(file), hash, code + ' ' + file);
1831|   assert.equal(gitSha('HEAD', file), hash, code + '-GIT-DISK-DISAGREE ' + file);
1832|   return true;
1833| }
```

A file THIS package declares takes the first branch and is re-asserted **in Git at `sourceBase`**,
not on disk at HEAD. S9's `sourceBase` is the S8-sealed tip. So as long as a released path stays in
`s.product` with its parent pin as `pre` (which B.4 requires anyway, for `:1975`), S9 re-asserts
S8's pin exactly as it re-asserts every other parent pin, and it is counted in the run's `base`
bucket ("superseded pin(s) preserved in Git at sourceBase", `:1854-:1858`). **S8's pin is not
broken; it is preserved in history and stops being inherited.** Walk 1 needs no new code and no
exemption. That part of v1 stands and R1 agreed with it.

**Walk 2, the grandparent walk (`:1851-:1853`), is where v1 was wrong.**

```
1851|   for (const [file, entry] of Object.entries({ ...ga.product, ...ga.executionPins })) {
1852|     if (Object.hasOwn(a.product, file) || Object.hasOwn(a.executionPins, file)) continue;
1853|     if (held(s, file, parentPin(entry, file), 'GRANDPARENT-PIN-BROKEN')) gkept++; else base++;
```

Run S10 under the mechanism as v1 wrote it. For S10, `a` is the S9 artifact and `g = a.parent` is
the S8 artifact, whose `product` still carries `preview.css` at `7cf97598c2c2cb23...` and
`build.mjs` at `d04a10ef406708b8...` (I re-read both out of `acceptance-s8-real-shape.json`). H10
moved both paths OUT of S9's artifact `product` into the new `released` block, which is exactly what
makes them stop being inherited. The skip test at `:1852` asks only about `a.product` and
`a.executionPins`: it knows nothing about a `released` block, so it does NOT skip, and `:1853` runs
`held()` against S8's pin. Both of `held()`'s outcomes are red once lane C has edited the file:

- S10 does not declare the path (the point of B.4): `:1830` `diskSha(file)` vs S8's hash fails
  `GRANDPARENT-PIN-BROKEN`, and `:1831` would fail too;
- S10 does declare it to get out of the way: `:1829` `gitSha(s.sourceBase, file)` vs S8's hash fails
  `GRANDPARENT-PIN-BROKEN-AT-SOURCEBASE`, because the bytes at S10's `sourceBase` are lane C's.

There is no third branch. Left alone, the mechanism releases a path for exactly ONE child and then
re-seals it by the back door, at the S8 pin, with no ledger line and no PM involvement. It is
LATENT: S10 is green until lane C actually edits a released file, which is to say it goes red the
first time the release is used for the thing it exists for.

**The hunk: H17, the grandparent skip at `:1852`.**

```
if (Object.hasOwn(a.product, file) || Object.hasOwn(a.executionPins, file)) continue;
if (releasedAncestry(a).has(file)) continue;   // H17
```

`releasedAncestry(a)` is the UNION of the `released` blocks of every artifact the walk reads on this
run (the parent's, and the grandparent's if it carries one), not just the parent's, so that the skip
survives a second generation: S11's grandparent is S9, which carries the block, and S11's parent S10
does not. The union is taken from artifacts already read in this function; it opens no new file and
trusts no path the artifacts do not name.

**Why H17 is not a weakening, in one paragraph the reviewer of S9 should try to break.** The skip
fires only for a path that (a) appears in an ancestor artifact's `released` block, which only
`proposed()` can write, which only writes it for a path the spec declared `role: "released"`, which
`releaseRuling()` only admits when a RULED PM line on the chain branch names this package and that
exact path (B.2, steps 1 to 6), and (b) was a key of that ancestor's parent `product` map (B.2 step
6). The sha256 the seal stopped at is preserved twice over: in Git at the ancestor's commit, and
literally in the `released` block as `lastSealedSha256`. Nothing else in either walk changes; every
other grandparent pin is still asserted on disk AND in Git at HEAD by `:1830-:1831`.

**F.2 STOP-2 is amended by name to admit H17 and nothing else.** See F.2.

### B.4 The role of its own, and why the artifact needs a block of its own

Spec side (`packages/S9.json`):

```json
"rebuild/m3/w7-preview/today/preview.css": {
  "pre":  "7cf97598c2c2cb23...",     // the S8 pin, verbatim
  "post": null,                       // no post: this package does not stand this file anywhere
  "role": "released"
}
```

Artifact side: `proposed()` `:2796` must NOT put a released entry in `product` (`:2826`). It builds a
new top-level block:

```json
"released": {
  "rebuild/m3/w7-preview/today/preview.css": {
    "role": "released",
    "lastSealedSha256": "7cf97598c2c2cb23...",
    "sealedBy": "M2-S8-REAL-SHAPE",
    "rulingLine": 5xx,
    "rulingLineSha256": "<the token line's own sha256>"
  },
  "rebuild/m3/w7-preview/today/build.mjs": { ... }
}
```

and `ARTIFACT_KEYS` (`:2830`) gains `'released'`, so `keys(m, ARTIFACT_KEYS, ...)` at `:3020` still
closes the artifact's key set and `same(m, proposed(s, bound))` at `:3021` still refuses any artifact
that is not exactly what the spec, the runner and the pins recompute. (`ARTIFACT_KEYS` today closes
twenty-one keys, ending `product`, `carrierSuccessor`, `witnessFlips`, `protectedSurfaces`,
`children`, `artifact`, `executionPins`; I read them out of `acceptance-s8-real-shape.json` itself.)

The literal `"role": "released"` on every entry is R1 N1, accepted: `DECISIONS:536` (3) says the
runner must record each released path "with a role of its own", and an entry that carries the role
as a fact matches the ruling's words as well as its intent. It is one key and no behaviour change,
and it makes the artifact readable without the reader having to know which block implies which role.
`proposed()` writes it as a constant, so `same(m, proposed(s, bound))` (`:3021`) still closes it.

**Why a separate block and not a role inside `product`:** `product()`'s completeness check at `:1975`
walks the PARENT artifact's `product` map. If S9's artifact carried the released path inside its own
`product`, S10 would find it parent-pinned, would be forced to declare it (`:1975`), and its declared
`pre` would be checked against the parent pin at `:1893`. That is inheritance, and the ruling forbids
it. Moving the entry into `released` makes S10's `pmap` and `epins` both miss the path, so S10 may
declare it `new`/`pinned-unchanged` or not declare it at all. **Not inherited, by construction, and
visible in the artifact forever.**

That argument is correct for S10's `product()` and it is exactly what misled v1 about `pins()`:
removing the path from `product` stops `product()` inheriting it and does NOT stop `pins()`
re-asserting it from the grandparent. Both are needed; the block is what H17 reads to know which
paths to skip, so the block and the hunk are one design, not two.

### B.5 Every runner hunk I expect

| # | function / constant | line | change | reason |
|---|---|---|---|---|
| H1 | `PRODUCT_ROLES` | `:351` | add `'released'` as the sixth | W7: the vocabulary is fixed here and nowhere else |
| H2 | `RELEASE_GRANT`, `RELEASE_GRANT_SHAPE` | beside `:932-:933` | new | the token's grammar, fixed in the runner |
| H3 | `releaseRuling(s)` | new, beside `supersessionRuling()` `:1189` | new function | B.2 steps 1 to 6; no cache, unique sha, RULED terminal, package-named |
| H4 | `spec()` product loop | `:1517-:1531` | `released` requires `pre !== null`, `post === null`; refuse `post` non-null | a released file has no post-image in this package |
| H5 | `spec()` | after `:1531` | `release` block key closure + `SPEC_KEYS` (`:1071`) gains `'release'` | closed keys |
| H6 | `product()` parent branch | `:1894` | admit `'released'` beside `carried`/`edited` | the only place a parent pin's role is judged |
| H7 | `product()` | **ONE placement: immediately before `const disk = diskSha(file)` at `:1952`**, plus the bucket initialiser at `:1888` | `if (pin.role === 'released') { at.released.push(file); continue; }` on its own line directly above **`:1952`** (v1 said `:1961`, a comment; R1 N2 corrected it to `:1952`; **R2 N3 is right that v2 then named TWO placements, and this row now names one**). The same hunk adds `released: []` to the seven-array `at` initialiser at `:1888` (R1 N8) | **Why `:1952` and not "after `:1895`" (R2 N3, FIXED):** the two placements are 57 lines apart and skip different code, and the narrower one is the right one. Between `:1895` and `:1951` a released pin passes every assert on its own merits and none of them is a no-op by accident: `:1915-:1916` (`PRODUCT-PINNED-UNCHANGED-IS-A-PARENT-PIN`) passes because the role is not `pinned-unchanged`; `:1943-:1949` (`PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE`) passes because `noChange` at `:1943` is `pin.pre !== null && pin.pre === pin.post`, which is false when `post === null`. Skipping from `:1895` would put those two asserts out of reach of a released pin for no gain; skipping at `:1952` keeps them live and removes only the disk hash and the bucket ladder, which is the whole of what the hunk needs. Exact precedent one line above: `:1951` already does this for a `new` pin with `post === null`. A released path is therefore never hashed by fidelity and can never reach `:1970` drift |
| H8 | `product()` terminal | **`:1983-:1987`** say() | new clause: `N released under DECISIONS:<at>, each at the sha256 <parent> sealed it at, not hashed here` | said out loud on every run. **Cite corrected (R2 N4, CONFIRMED):** v2 said `:1966`; `:1966` is the comment "package produced none of it - that separation is the whole of F1's correction", and the `say('PRODUCT ' + phase ...)` runs `:1983` to `:1987`. Re-read in the farm |
| H9 | `product()` | `:1889` loop entry | assert the released set equals `releaseRuling().granted` | ledger and spec cannot drift apart |
| H10 | `proposed()` | `:2826` | `product` excludes released entries; new `released` block built from `s.product` + the ruling | B.4 |
| H11 | `ARTIFACT_KEYS` | `:2830` | add `'released'` | closed artifact keys |
| H12 | `writeSealedRunReceipt()` | `:2993` | skip `pin.role === 'released'` when building `product` | B.6 |
| H13 | `sealedRunReceipt()` | `:2970`, `:2972` | both directions skip released paths | B.6 |
| H14 | `IDS` | `:173` | `'S9'` behind `'S8'` | section E |
| H15 | `NO_REGISTER_IDS` | `:316` | `'S9'` | section E |
| H16 | `CHILD_ROOTS` | `:405` | see section E | section E |
| **H17** | `pins()`, the GRANDPARENT walk | `:1852`, **and the terminal say at `:1855-:1858`** | a second `continue` for any path in `releasedAncestry(a)`; **and the say's `gkept` clause gains ` (plus N skipped as released by an ancestor artifact's released block)`** | **B.3. Without it the release lasts exactly one generation and then re-seals itself at the S8 pin with no ledger line.** R1 BLOCKING-1. **The say clause is R2 N2, FIXED and CONFIRMED in the farm:** `:1856` prints `gkept` as "N un-superseded grandparent pin(s)", and H17's skip lowers that number by the number of released paths. The document holds H13 to exactly this standard for the `:3191` count, and H8 to it for the product say; H17 gets the same clause, so no count in this runner ever moves in silence |
| **H18** | `today/test/package.test.cjs` (a sealed cell, not the runner) | new cell in the file | its own literal list of the 26 `rebuild/m3/w7-preview/today/**` entries of `build.mjs`'s `REQUIRED_INPUTS` (of 48, not 51: A.4, R2 N6), asserted both against `build.REQUIRED_INPUTS` and against `result.inputs` | **A.4. Six of the seven build laws are already asserted by sealed cells' own literals; `REQUIRED_INPUTS`' today half is asserted by nothing outside the file being released.** R1 BLOCKING-3, ratified by PM-R2 |
| **H19** | `rebuild/lanes/c/ui-port/pack-pin.test.mjs` | new cell | **PACK-PIN** (C.5.1): the WHOLE owner-approved pack pinned by a literal, sorted `(path, sha256)` list read from the WORKING TREE, `README.md` and `quality/**` INCLUDED, plus its `rebuild.yml` step | **C.5.1, PM-R6'(i).** A lane C cell like the D.2 fence, declared by S9. **R3 BLOCKING-F and N5 are what changed it**: one composite sha cannot name a path, and a value taken at a fixed commit cannot be read on a CI runner. **COPY-BIND is GONE from this row: see H19b** |
| **H19b** | `rebuild/lanes/c/ui-port/approved-pin.test.mjs` (or the same file as H19) | new cell | **APPROVED-PIN** (C.5.3): whatever files `design.APPROVED` names at the S9 head are pinned by content, PARAMETRICALLY, because C-UI-1's final state is not yet known | **C.5.3, PM-R6'(i) second half.** It is a sibling of PACK-PIN, not a second design |
| ~~H19c~~ | ~~`copy-bind.test.mjs`~~ | **WITHDRAWN** | **COPY-BIND IS WITHDRAWN FROM S9 BY PM-R6'(ii).** R3 BLOCKING-E proved by execution that it asserts nothing `assertDesignBinding` already asserts from inside the seal, and that it cannot see a sentence leaving the array and the template together | **C.5.2 and C.6.** The gap is stated as it is and the lock becomes a NAMED PRECONDITION OF S10 |

**Eighteen hunks in force, plus one withdrawn.** H14 to H16 are the ordinary reseal-child three
that S8 also had (`S8-PREP-AUTHOR-REPORT.md:60-73`). The release mechanism is H1 to H13 plus
**H17**, and **R1, R2 and R3 all accept it; v4 does not touch one character of H1 to H13, H17, B.2,
B.3, B.4, B.6 or B.7.** **H18** is the price of the second path in the closed list and is a test
cell, not a runner change. **H19 and H19b** are PM-R6'(i)'s pack pins and touch no runner line
either. H17 and H18 are v2, from R1; H19 is v3 rebuilt in v4 on PM-R6'(i); H19c is v3's COPY-BIND,
withdrawn in v4 by PM-R6'(ii).

### B.6 What happens to every other guarantee

| guarantee | where | effect of a release | why it is still honest |
|---|---|---|---|
| unlisted drift in a sealed file | `product()` `:1970`, `:1972` | unchanged | H7 removes released paths from the loop body only; every other declared file still buckets and still refuses |
| a parent-pinned file dropped from the inventory | `:1975` | unchanged | a released file is STILL declared in `s.product`; the completeness walk still finds it |
| `UNLISTED-SOURCE-CHANGE` | `fidelity()` `:2005-:2011` | unchanged | the diff roots are `rebuild/engine`, `rebuild/conform`, `rebuild/m4/spec`, `rebuild/lanes/b/tooling` (`:2005`). `rebuild/m3` was never in it. Nothing is loosened; nothing is tightened either. See D. |
| parent pin re-assertion, PARENT walk | `pins()` `:1837-:1839` | unchanged, B.3 walk 1 | the released path is checked in Git at `sourceBase` by `held()` `:1829`, and counted in `base` |
| parent pin re-assertion, GRANDPARENT walk | `pins()` `:1851-:1853`, skip at `:1852` | **CHANGED by H17** (v1 said "unchanged"; that was wrong, R1 BLOCKING-1) | without H17 the S8 pin is re-asserted against S10 and both `held()` branches are red the first time lane C edits a released file. With H17 the path is skipped by name out of an ancestor `released` block, and every other grandparent pin still gets `:1830` and `:1831` |
| the `--full` byte-identity re-verify | `sealedRunReceipt()` `:2970`/`:2972` | released paths excluded (H13) | otherwise a legitimate lane C edit to `preview.css` after the seal would print `SEALED-RUN-RECEIPT-VOID` and force a full run for ever. **The sentence to amend is at `:3190-:3194`, not `:3170`** (`:3170` is the PROTECTED SURFACES echo; R1 N3, corrected). It prints `Object.keys(s.product).length`, so H13 must change the COUNT too or it over-counts by the number of released paths: it should read "all N pinned product file(s), plus 2 released and not re-verified" |
| the historical audit | `historical()` `:3113`, list filter `:3118` | untouched | it walks `rebuild/engine/**` and `rebuild/conform/v4/*.cjs` only. No `m3` path can reach it |
| a child needle that executes a released file | `children()` `:2190`, `childArgv()` `:637`, roots `:405` | **a released path must not be a child argv target** | `proposed()` `:2800` puts every child argv target into `executionPins`. A released file that a child executes would be re-pinned by the back door. The runner must assert `released` and `childArgv` targets are disjoint. This is why the today test cells stay out of the list (section C) |
| F6 / F7 | `tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs` | F6 takes `IDS` of thirteen and `NO_REGISTER_IDS` of nine; F7 takes `CHILD_ROOTS` of its new length | the S8 shape, `S8-PREP-AUTHOR-REPORT.md:73-76` |
| superseded-by-child | `product()` `:1902` | unchanged | that role is for parent EXECUTION pins (`DECISIONS:109`); a release is a different question and gets a different word |

### B.7 Re-sealing a released path later

Stays possible and needs no new machinery. A later child declares the path `role: "new"` with
`pre` = whatever it stands at and a real `post`: at `:1909` the path is in neither the parent's
`product` nor its `executionPins`, so `new` is exactly the honest role, and from that child on it is
a parent pin again. The only thing that never comes back is the byte history between the release and
the re-seal, and the `released` block names the last sealed sha256 so a reader can measure the gap.

**H17 does not get in the way of a re-seal (v2).** The re-sealing child declares the path, so the
FIRST test at `:1852` (`Object.hasOwn(a.product, file)`) already skips it in that child's own
descendants; and `releasedAncestry()` reads only the artifacts this walk reads, which are the parent
and the grandparent, so an old `released` block falls out of scope two generations after the
release. A path can therefore be released, edited freely by lane C, and re-sealed at new bytes, each
step on its own RULED line, with the runner asserting the truth at every hop.

### B.8 New tooling cells, red first

| cell | red-first plan (it must fail on the runner as it stands today) |
|---|---|
| `tooling/test/release-from-seal.test.cjs` (new) | (1) a spec declaring `role: "released"` refuses with `PRODUCT-ROLE-NOT-IN-THE-CLOSED-VOCABULARY` today; (2) with H1 only, it refuses at `:1894` `PARENT-PRODUCT-PIN-NOT-DECLARED-CARRIED-OR-EDITED`; (3) with H6 only, a byte moved in the released file still refuses at `:1970` (proves H7 is needed); (4) a released path with no token line refuses `RELEASE-NOT-RULED`; (5) a token line naming another package refuses; (6) a token line not ending ` RULED` refuses; (7) a spec releasing a path the token does not name, and a token naming a path the spec does not release, both refuse; (8) a released path that is also a child argv target refuses; (9) the artifact recomputation `:3021` refuses an artifact whose `released` block is not what `proposed()` builds; (10) the sealed-run receipt does not carry a released path, and moving that file's bytes does NOT void the receipt; **(11) THE GRANDPARENT CELL (v2, R1 BLOCKING-1): a synthetic S10 spec over a synthetic S9 artifact that carries a `released` block, with the released file's bytes moved on disk and in Git, must PASS `pins()` (it refuses `GRANDPARENT-PIN-BROKEN` on today's runner, which is the red); and in the SAME fixture a DIFFERENT grandparent-pinned file whose bytes moved must still refuse `GRANDPARENT-PIN-BROKEN`, so the cell proves the skip is narrow and not a hole; (12) a `released` block naming a path the grandparent artifact never pinned changes nothing (the skip is a no-op, not an admission)** |
| `today/test/package.test.cjs` (H18, a SEALED cell edited inside S9) | the 26-entry literal list: with the cell added and one `today/` entry deleted from `build.mjs`'s `REQUIRED_INPUTS`, the cell FAILS naming that path; with the entry restored it passes; and the same deletion on today's tree, before H18, is green in every cell under `w7-preview/**/test/` (that is the red the hunk exists for) |
| `tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs` (F6/F7, edited) | `PRODUCT_ROLES` of six by literal and `deepEqual`; `IDS` of thirteen; `NO_REGISTER_IDS` of nine; `CHILD_ROOTS` of its new length in both the whole-list literal and the `slice(8)` literal (the S8 shape, `S8-PREP-AUTHOR-REPORT.md:73`) |
| `tooling/test/seal-tip-and-byte-identity.test.cjs` (edited) | the receipt's product map excludes released paths in both directions |
| `rebuild/lanes/c/ui-port/pack-pin.test.mjs` (H19, new; **REBUILT in v4 on PM-R6'(i), R3 BLOCKING-F and R3 N5**) | Six red-first rows, one per way of moving the pack, each asserting the REFUSAL NAMES THE PATH: (1) **a board moved** (`ref/ink-board.png`) FAILS `PACK-PIN MISMATCH ref/ink-board.png`; (2) **an app file moved** (`app/states-today.js`) FAILS `PACK-PIN MISMATCH app/states-today.js`; (3) **a gate script moved** (`quality/gate.py`) FAILS `PACK-PIN MISMATCH quality/gate.py`, which is the row that would have passed under v3's exclusion and is the whole point of PM-R6'(i); (4) **a baseline moved** (`quality/baseline/states/C-02-dawn.json`) FAILS naming it; (5) **a file added** (`quality/baseline/states/C-99-dawn.json`) FAILS `PACK-PIN ADDED` naming it; (6) **a file removed** (`states/STATE-INVENTORY-DRAFT.md`) FAILS `PACK-PIN MISSING` naming it. A seventh row is the green control: an untracked file written under `quality/run/` changes nothing. (8) on today's tree, before the cell, every one of (1) to (6) is green everywhere: that is the red the cell exists for |
| `rebuild/lanes/c/ui-port/approved-pin.test.mjs` (H19b, new) | (1) the cell reads `design.APPROVED` for its FILE LIST at run time and FAILS `APPROVED-PIN LIST-EMPTY` if it is empty; (2) each named file's working-tree bytes must equal the cell's own literal sha256, else `APPROVED-PIN MISMATCH <path>`; (3) a file `design.APPROVED` names that does not exist FAILS `APPROVED-PIN MISSING <path>` rather than skipping; (4) **the red-first pair that makes it worth having**: change an approved reference's bytes AND `design.cjs`'s matching sha256 constant in one fixture, and this cell FAILS while `design.test.cjs:15-:20` and `readApproved` (`design.cjs:338-:341`) both pass, which is exactly the coordinated edit R1 BLOCKING-4 found and nothing in the tree catches today |
| ~~`rebuild/lanes/c/ui-port/copy-bind.test.mjs`~~ | **WITHDRAWN (PM-R6'(ii)).** R3 BLOCKING-E is right about this row twice over. Its rule (3) as v3 wrote it ("removing one sentence from BOTH `design.cjs` and the reference file still FAILS, because `product()` `:1967` refuses the byte move first") describes a refusal that comes from the `pinned-unchanged` DECLARATION and not from the cell, so it was never a red-first plan for the cell at all. That declaration is kept (E fact 17); the cell is not built |

The first and third and fourth rows are `rebuild/lanes/b/tooling/test/` cells, already in
`TOOLING_FILES` (`:355`) for the existing five; the new file must be ADDED to `TOOLING_FILES` in the
same hunk or `fidelity()` `:2010-:2011` calls it `UNLISTED-SOURCE-CHANGE`. **That is the easiest
hunk in this list to forget.** The H18 row is different: `today/test/package.test.cjs` is a SEALED
product file and execution pin (`1a29e3e0...`), so it is edited as an S9 declaration with
`role: "edited"` and a real post, not as a tooling file. The two H19 rows are different again: they
are LANE C cells under `rebuild/lanes/c/ui-port/`, declared `new` by S9 and NOT in `TOOLING_FILES`,
for the same reason the D.2 fence is not (Q5, PM-R4): a cell that audits the sealed set must not be
exempt from it.

---

## C. THE BYTE-PIN CELLS OVER RELEASED FILES

### C.1 Census: every cell in the tree that pins a candidate file by sha256

Measured by reading every `createHash(` site under `rebuild/m3/w7-preview/` and
`rebuild/lanes/{c,d}/`.

| cell | line | what it pins by sha256 | touches a RELEASED path? |
|---|---|---|---|
| `today/test/design.test.cjs` | `:20` | the two approved reference HTML files, via `design.APPROVED` | no |
| `today/test/design.test.cjs` | `:58` | the two woff2 typefaces, against `fonts/SOURCES.json` | no |
| `today/test/food.test.mjs` | `:838` (N1.18) | `m3/w6/local/today-bindings.mjs` + the four `PAGE_PINS` files (`today-entry.mjs`, `gym-host.mjs`, `reading-host.mjs`, `checkin-host.mjs`) | no |
| `today/test/machine-settings-ui.test.mjs` | `:683` (S10) | the same four `PAGE_PINS` files | no |
| `today/test/problem.test.mjs` | `:1606` (N2-08) | the four `checkin-*` files + `today-bindings.mjs` + `PAGE_PINS` | no |
| `today/test/setup.test.mjs` | `:2391` (re-pin 1) | every file the B-NTC artifact pins, against the declaring-spec chain | **indirectly: `preview.css` and `build.mjs` are not B-NTC pins, so no** |
| `today/test/setup.test.mjs` | `:2402` (re-pin 2) | `today-bindings.mjs`, `local-today-journey.test.mjs`, `today-entry.mjs` | no |
| `today/test/catalogue.test.mjs` | `:489`, `:500` | a credit list and a skeleton string, not a file | no |
| `today/test/package.test.cjs` | `:222` | `preview.MOCK_SHA256`, a fixture constant | no |
| `measure/test/boundary.test.mjs` | `:128` (P-MEASURE (g)) | **every file `packages/S4.json` pins, by post-image** | **YES: `preview.css` and `build.mjs` are named explicitly in `P3_IMPORT_UI_2_UNSEALED` at `:179-:180`** (v1 said `:181-:183`; `:181` is the `MINE` drift assert and `:183` the sealed-set `deepEqual`. R1 N4, corrected, re-read on the PC) |

### C.2 The ruling, cell by cell

**Exactly ONE cell pins a released file**, and it does not pin it as a sealed byte; it pins it as a
file that is explicitly NOT sealed and must stand where a declaring spec says.

| cell | ruling | why |
|---|---|---|
| `measure/test/boundary.test.mjs` `:179-:180` `P3_IMPORT_UI_2_UNSEALED = ['.../preview.css', '.../build.mjs']`, used by the loop at `:185-:190` | **ONLY `:188-:189` GOES. The constant `:179-:180`, the loop `:185-:190` and the `Object.hasOwn` assert `:186-:187` all STAY** (v2 removed the whole loop; **R2 N9 is right and this is FIXED, ratified by PM-R7**) | the loop asserts (a) `Object.hasOwn(product, f) === false` (`:186-:187`) and (b) `shaOf(f) === declaredPost(f)` (`:188-:189`). (a) is a LIVE GUARD that stays TRUE after the release and gets stronger, not weaker: it says these two paths are not in `S4.product`, and after S9 it is the cell's own statement that a released path did not creep back into an older seal's inventory. v2 deleted it along with (b) while saying in the same row that it "needs no change", which is exactly the kind of quiet loss this document is written against. (b) goes red the first time lane C edits either file, because `declaredPost` only accepts a spec whose `post` is a string and S9 declares `post: null`. `:188-:189` is therefore a byte pin over a released file and is the only part that must go. S9 deletes those two lines, leaves the rest of the loop standing, and writes one comment line in their place naming both paths as RELEASED by `DECISIONS:<token line>`. The BEHAVIOUR these two files owe is then asserted where it always was: the build laws in `today/test/copy.test.mjs` and `today/test/package.test.cjs` (with H18), both SEALED |
| `measure/test/boundary.test.mjs` `:128-:178` (the S4-drift walk itself) | **KEPT, unchanged** | it walks `S4.product`. `preview.css` and `build.mjs` are not in `S4.product` (that is what `:186-:187` asserts). Nothing in the walk touches a released path |
| every cell in C.1 other than `boundary.test.mjs` | **KEPT, unchanged** | none of them names `preview.css` or `build.mjs`. The five red-then-green cells of `DECISIONS:523` pin `today-bindings.mjs` and `workout-host.mjs`, both SEALED and both outside this release |
| the sealed `today/test/*` cells (12 product-pinned, 13 execution-pinned) | **KEPT, all of them, and NOT released** | see C.3 |

Nothing is "kept over a released file", so there is no cell that makes the release a fiction.

**Scope of the census, widened in v2.** v1 measured `createHash(` sites under
`rebuild/m3/w7-preview/` and `rebuild/lanes/{c,d}/`. R1 ran a repository-wide search for both
released paths and found no second byte pin: the other hits are prose, package or receipt JSON, or
consumers. `import/test/refusal-route.test.mjs:257` reads `preview.css` as TEXT (not a hash),
`today/test/setup.test.mjs:934` names `build.mjs` inside a failure message,
`.github/workflows/shared-preflight.yml:46` lists it in a historical commit-to-files map, and
`rebuild/slice/pwa/build-pwa.mjs:19` imports it (A.5, R1 N6). The conclusion holds on the wider
search, and the wider search is the one the S9 brief should cite.

### C.3 The today test cells that "pin only rendering": I recommend releasing NONE of them

`DECISIONS:536` names "the today test cells that pin only rendering" as candidates. Measured:

| cell | S8 role | indexedDB refs | `save(`/`logSet` | what it really guards |
|---|---|---|---|---|
| `today/test/copy.test.mjs` | carried + execution pin | 7 | 0 | **the no-dash rule** (20 tests, `:92`-`:836`), the Node-globals guard (`:207`), the launch/attribution guard (`:264`, `:303`), the build's refusal to emit a dash (`:395`, `:405`) |
| `today/test/design.test.cjs` | carried + execution pin | 0 | 0 | **the design-of-record sha256 pins** (`:15`, `:31` one-byte tamper must fail), **the font pins** (`:52`), the template-to-approved binding (`:70`) |
| `today/test/view.test.mjs` | carried + execution pin | 5 | 0 | boots `today-entry.mjs` over a fault database and renders every Today state |
| `today/test/package.test.cjs` | carried + execution pin | 0 | 0 | the built package's shape, the approved-design pin at build time (`:47`) |
| `today/test/gym.test.mjs` | carried + execution pin | 10 | 5 | the RIR lock: `EFFORT_CHOICES` at `:59`, `:331`, `:338` |
| `today/test/ntc-h6-delta.test.mjs` | carried + execution pin | 2 | 1 | the RIR lock again, `:60`, `:111`, and the `rir` field at `:399`-`:433` |
| the other six | carried + execution pin | many | many | writers and stores |

Recommendation: **release none**. Two independent reasons, either sufficient:

1. **The owner's own trade.** `DECISIONS:536` says in the owner's words that "the design of record
   stays pinned by sha256 in `design.cjs`; the copy locks stay as tests". `design.cjs` is not sealed
   (section 0), so the ONLY thing that makes "pinned by sha256 in design.cjs" a guarantee rather
   than a sentence is `design.test.cjs` executing it from inside the seal. Release `design.test.cjs`
   and the owner's stated condition is void the same day.
2. **The mechanism.** A released path must not be a child argv target (B.6), because
   `proposed()` `:2800` re-pins every child argv target into `executionPins`. All THIRTEEN today
   cells ARE child argv targets and execution pins today. Releasing one means also removing it as a
   declared child, which by `DECISIONS:487` stop 7 and `DECISIONS:186 (3)` means a cell with no
   declared executor. That is the hole the last three reseal children were spent closing.

**Twelve or thirteen (R1 N5, accepted, re-measured).** Under `rebuild/m3/w7-preview/today/test/` the
S8 artifact carries **12 product pins and 13 execution pins**: `test/catalogue.test.mjs`
(`a586e3eb...`) is an execution pin and a declared child argv target with NO product pin. So "the
twelve sealed today test cells" is right about `product` and one short about `executionPins`, and
the sentence above must say thirteen. It does not change the recommendation: release none of them.

### C.4 What keeps guarding the copy after the release, and where it runs

| lock | implemented in | executed by | CI home | OS |
|---|---|---|---|---|
| the no-dash rule | `today/plain-copy.cjs` (**`assertNoAiDashesInAssets` is implemented at `plain-copy.cjs:288` and exported `:305`; `build.mjs:31` destructures it and `build.mjs:501` calls it. R3 N6, FIXED**), `today/dash-check.mjs` | `today/test/copy.test.mjs` (20 tests) | the A1/A2/A3/A4 step, `.github/workflows/rebuild.yml:231` (its `- name:` line; v1 said `:232`), 17 cells named by exact path | ubuntu + windows (`rebuild.yml:22` `os: [ubuntu-latest, windows-latest]`, `:24` `runs-on`) |
| the verbatim copy locks | `design.cjs:65` `PREVIEW_COPY`, `:77` `APPROVED_COPY`, `:112` `RUNTIME_COPY`, `:125` `CHECKIN_RUNTIME_COPY`, `:145` `PREVIEW_RUNTIME_COPY`; asserted by `design.assertDesignBinding` **`design.cjs:527-:570`, whose copy rules are `:538-:556` in THREE loops** (`:538-:541` template-to-approved, `:542-:545` `APPROVED_COPY`, `:547-:555` runtime and preview-owned; **re-read in v4 for R3 BLOCKING-E**) | `today/test/design.test.cjs:70` (the `test(` line; the call is `:72`); and at BUILD time by `build.mjs:472` | same step, plus every build | both. **But see C.5.2: all three loops iterate a declared list, so a sentence leaving the ARRAY and the template together passes every one of them** |
| the design-of-record sha256 pins | `design.cjs:43-:47` `APPROVED`, checked in `readApproved` `design.cjs:338-:341` (`APPROVED-PIN FAIL`) | `today/test/design.test.cjs:15` and `:31` (one-byte tamper must throw) | same step | both |
| the font pins | `design.cjs:54` `FONTS` + `rebuild/m4/workout/fonts/SOURCES.json`, `readFonts` `design.cjs:351-:361` | `today/test/design.test.cjs:52` | same step | both |
| `headlineVocabulary` | `design.cjs:588-:599` (reads the engine's own title literals) | `today/test/copy.test.mjs:149`; and on a real browser by `browser-check.mjs:60` | copy.test.mjs in the same step; `browser-check.mjs` has **no CI step** and is stale-red at the tip (`DECISIONS:535`) | both / none |
| the RIR lock (`BRIEF-RIR-DISPLAY`) | `today/gym-model.mjs:27`-`:34` `EFFORT_CHOICES`, `:227`/`:251` the `rir` field | `today/test/gym.test.mjs:59`, `today/test/ntc-h6-delta.test.mjs:60`, `today/test/machine-settings-ui.test.mjs:49`, `today/test/problem.test.mjs:475` | same step | both |

**What a lane C ticket can and cannot silently drop: the measurement, replacing v2's reassurance
(R2 BLOCKING-B, CONFIRMED and re-measured here).**

v2 closed C.4 with "all six rows are executed by cells that stay in the S8/S9 sealed inventory AND
in `executionPins`, so a lane C branch that edits one of those cells moves a sealed byte". That is
true **of the cells** and false **of what the cells read**, and it is the same species of sentence
R1 BLOCKING-4 blocked one row below it. Withdrawn, and replaced by what is true:

| what | sealed today? | measured how |
|---|---|---|
| the thirteen `today/test/*` cells | **YES**, 12 product pins and 13 execution pins | parsed out of `acceptance-s8-real-shape.json` |
| `today/design.cjs`, which holds all five copy arrays | **NO**, in no package's `product` and in no `executionPins` | the same parse |
| `today/screens.template.html`, the template the copy must stay in | **NO** | the same parse |
| the two approved reference HTML files `design.APPROVED` names | **NO**; ZERO paths under `rebuild/m1/` are in either map | the same parse |

So the three sides of the copy lock (`design.cjs`'s arrays, the template, the approved references)
are all lane C's to edit, in one commit, exactly as BLOCKING-4's coordinated edit was. Two of the
cells make that worse rather than better, and both are worth naming: `design.test.cjs:74-:75`
asserts `report.copy` equals the SUM of the five array lengths, and both sides of that equation are
`design.cjs`'s own arrays, so deleting an entry lowers both by one and the cell stays green; and
`design.assertDesignBinding` (**`design.cjs:527-:570`**) compares the unsealed template against the
unsealed approved HTML using the unsealed `APPROVED_COPY` list (`design.cjs:77`).

**R2 quantified the hole and I re-measured it in the farm and got the same number.** The five
declared arrays hold **218 strings** (confirmed exactly: `PREVIEW_COPY` 3, `APPROVED_COPY` 60,
`RUNTIME_COPY` 21, `CHECKIN_RUNTIME_COPY` 18, `PREVIEW_RUNTIME_COPY` 116; 200 of the 218 are
distinct, because `APPROVED_COPY` and `CHECKIN_RUNTIME_COPY` share 18). **R2's count stands: 79
appear verbatim in the thirteen sealed `today/test/*` cells and 139 do not**, and several of the 79
are single words (`Low`, `New`, `Today`) that match by accident. The sentences really locked by a
sealed cell's own literal are a handful: `design.test.cjs:111` ("Your plan for today"), `:113`
("Eat about"), `:115` ("Weight trend"), `:101`, and `view.test.mjs:100`/`:501`. For the other 139,
a lane C commit that removes the sentence from `screens.template.html` AND from `APPROVED_COPY` in
`design.cjs` is green in CI, green under `--ci --package S8`, and green under the D.2 fence, because
the fence knows only the sealed inventory and none of the three files is in it.

The `browser-check.mjs` row is a separate exception and it is already broken: it is unsealed, unrun
by any workflow, and stale-red. **PM-R3 rules it: no CI home, run on the PC before each seal, the
result recorded in the VERDICT.** That is now written down rather than asked.

**C.5 is the fix for the rest of it**, and PM-R6 is the ruling that decides its shape.

### C.5 What pins the design of record and the copy: the measurement, not the reassurance (v2 from R1 BLOCKING-4; REBUILT in v3 on PM-R6 and R2 BLOCKING-B)

v1 ended C.4 by saying the design-of-record pins are "enforced by `design.test.cjs` (a sealed,
CI-homed, both-OS cell)". R1 BLOCKING-4 says that reads as a reassurance the tree does not support.
**I re-measured it and R1 is right. The sentence is withdrawn and replaced by what is true.**

What `design.test.cjs` actually asserts, read at the line
(`rebuild/m3/w7-preview/today/test/design.test.cjs:15-:20`):

```
15| test("both approved references are pinned by sha256 and read byte-for-byte", () => {
16|   const approved = design.readApproved();
...
19|     const bytes = fs.readFileSync(path.join(design.ROOT, entry.file));
20|     assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256, entry.file);
```

`entry.sha256` comes from `design.APPROVED` inside `design.cjs`. So the cell asserts
**file-matches-constant where BOTH sides are unsealed**. I confirmed the seal side by parsing
`rebuild/m4/spec/acceptance-s8-real-shape.json` directly:

| path | in S8 `product`? | in S8 `executionPins`? |
|---|---|---|
| anything under `rebuild/m1/` | **NO. Zero paths.** | NO |
| `rebuild/m3/w7-preview/today/design.cjs` | **NO** | NO |
| `rebuild/m3/w7-preview/today/test/design.test.cjs` | YES, `carried` `0db62ca9...` | YES, `0db62ca9...` |

So the cell is sealed and the two things it compares are not. A branch that edits
`rebuild/m1/approved-2026-09-08/Earned-refinement-A.html` and updates `design.cjs:45` in the same
commit is green: green in CI, green under `--ci --package S8`, and green under the D.2 fence, which
only knows the sealed inventory. The only cross-check anywhere is `design.test.cjs:175-:188`, which
binds `design.APPROVED[1].sha256` to line 9 of
`rebuild/m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md` (`:184`) and reads two lines of
`rebuild/m1/MOCK.md` (`:186-:187`) - and those two files are unsealed as well, so all three move
together. `APPROVED[0]`, the Refinement A reference, has NO cross-check of any kind.

**Plainly, then:** `DECISIONS:536`'s trade says "the design of record stays pinned by sha256 in
`design.cjs`". As the tree stands, that sentence describes an intention, not a guarantee the seal
holds. This is not created by S9 and S9 is not obliged to fix it, but the S9 spec was asked this
exact question and must not answer it with a comfort.

**THE RULING IS PM-R6, AND IT CHANGES v2's ANSWER.** v2 proposed sealing `design.cjs` itself with
four `rebuild/m1/` files, role `pinned-unchanged`. The PM has ruled that direction OUT, with a
reason v2 did not weigh and R2 N8 raised: **the design lane edits `design.cjs` in most tickets**
(`PREVIEW_CLASSES`, `RUNTIME_CLASSES`, `APPROVED_COPY` `design.cjs:77`), so sealing it would put
every look ticket back inside a reseal child and undo the release the same package grants. v2's own
A.5 row said "`design.cjs`, ticket 1 only", and the spec's Appendix point 8 admits the C-UI ticket
bodies were never re-read, so that row could not carry the weight v2 put on it. **PM-R6 stands and
v2's Q7 recommendation is withdrawn.**

**AND PM-R6 IS NOW REVISED, AFTER R3.** R3 REJECTED v3's pair of cells on two blocking findings,
both inside C.5, and said in terms that the ruling's own wording was the cause. The PM has read R3
and revised. **The revision, in one paragraph, so a reader of v3 knows exactly what moved:**
PACK-PIN survives and is made much wider and much more concrete (`PM-R6'(i)`); **COPY-BIND is
withdrawn from S9 altogether** (`PM-R6'(ii)`), because R3 proved by execution that it asserts
nothing the sealed `design.test.cjs:72` does not already assert; the gap COPY-BIND was meant to
close is stated as it is, in C.5.2, and the real lock becomes a **named precondition of S10**, in
C.6. v3's four `pinned-unchanged` declarations are KEPT unchanged (E fact 17): R3 checked the role
at the line and confirmed it, and they are the part of C.5 that already makes `DECISIONS:536`'s
first promise true.

In its place, **two sibling pack cells that do not seal `design.cjs`**. Both are lane C cells under
`rebuild/lanes/c/ui-port/`, declared by S9 (hunks H19 and H19b).

#### C.5.1 PACK-PIN: the WHOLE owner-approved pack, pinned by a literal list read from the working tree (REBUILT in v4 on PM-R6'(i))

`DECISIONS:530` records the design of record as `rebuild/m1/approved-2026-09-18/` as committed at
`5f4cad0a2b11baa9794d9d8c5538db76a1bf8162` on `rebuild/c-ui-port` (pack tree
`6d7710467408f69e61a2917c583540fc2336a3fa`). **PM-R12 answers OQ-1 on the ledger: the tree id
`6d771046` is confirmed exact and is the binding identity; the `README.md sha256` cited beside it
(`c151a79d...`) is not reproducible and the blob is `e4e9effd...`. The spec need only cite the tree
id, and does.** PACK-PIN pins the pack by CONTENT, so a pack file and its fingerprint in `design.cjs`
can no longer move together unseen.

| property | design (PM-R6'(i)) |
|---|---|
| WHAT IS PINNED | **THE ENTIRE owner-approved pack `rebuild/m1/approved-2026-09-18/` as it stands at the S9 head: every git-tracked file, `README.md` and `quality/**` INCLUDED** - the gate code, the per-platform screen baselines and the state records. **No exclusion except untracked run output.** v3 excluded `quality/**` and `README.md`; the PM has reversed that |
| WHY, and this is the reason to put in the spec | **after S9 the acceptance of every lane C look ticket IS the design gates being green** (`DECISIONS:536` (4)). A gate that judges a ticket must not be editable by the ticket it judges, so the gate code and its baselines have to be inside the pin, not outside it. And the pinned **state records** (`quality/baseline/states/*.json`, whose `text` field is the exact on-screen wording per state) are what the new look's copy lock will rest on: C.6 |
| WHAT THE CELL READS | **THE WORKING TREE AT RUN TIME**, which on CI is the `actions/checkout` working tree of the branch being pushed. **Never an object at a fixed commit** (R3 BLOCKING-F: at a fixed commit the value can never change, red-first rows (1) and (3) are unreachable by construction, and on a runner the object is not even present, because `actions/checkout` fetches the pushed ref and `5f4cad0a` is on an unmerged lane branch) |
| WHAT THE CELL HOLDS | **the FULL sorted list of `(path, sha256)` lines, as its literal** - not one composite sha256 (R3 N5: "a single composite sha256 over the whole serialisation can only say `different`"). Holding the list is what lets a mismatch NAME THE PATH, and what lets a MISSING file and an ADDED file each be named too |
| the exact serialisation | for each file, one line `<path relative to the pack root> <space> <64-hex sha256 of the file's bytes> <newline>`; sorted by path bytes ascending; compared line by line against the literal. `.gitattributes` sets `* text=auto eol=lf` for the whole repository with `*.png`, `*.jpg`, `*.woff2` and the rest marked `binary`, so **the working tree and the git blob are the same bytes on both OS** and the literal can be generated from git and matched against the checkout. R3 verified this independently and it is not load bearing: if someone ever changed `.gitattributes`, the cell would go red loudly, naming every text file, which is the correct behaviour and not a hole |
| the three refusals | `PACK-PIN MISMATCH <path>` (a line's sha differs), `PACK-PIN MISSING <path>` (a literal line has no file), `PACK-PIN ADDED <path>` (a file has no literal line). All three name the path, which is what R3 N5 required and what v3's single value could not do |
| THE ONLY EXCLUSION, and how the cell ignores it | **untracked run output.** `.gitignore` on the lane branch carries `rebuild/m1/approved-2026-09-18/quality/run/` (line 7) and `__pycache__/` (line 8), so the gate's own output and Python caches are never committed but ARE present in a working tree the gates have been run in. Since the cell reads the working tree, it must skip them or every local run would read as ADDED. **The cell holds its OWN literal ignore list** - a pack-root-relative path is skipped when it begins `quality/run/` or contains a `__pycache__/` segment - **and does NOT read `.gitignore` to decide**, because `.gitignore` is in neither S8 map (measured) and a branch that could widen the ignore file could widen the pin. The ignore list is inside a cell S9 declares `role: "new"`, so from S9 on widening it is a sealed byte move that `product()` `:1970`/`:1972` refuses |
| EXCLUSIONS ARE ANCHORED AT THE PACK ROOT (R3 N5, second half) | the two prefixes are matched against the path relative to `rebuild/m1/approved-2026-09-18/`, from its first character. On an unanchored segment match a file placed at `app/quality/run/x.js` would leave the pin; anchored, it cannot |
| what it does NOT cover, said out loud | nothing, except the untracked run output named above. That sentence is the whole change from v3 |

**WHEN THE LITERAL IS MEASURED, and why that is safe.** `DECISIONS:531` already rules the
precondition: **C-UI-1 seals only after C-UI-0 is accepted by the second teeth audit.** So by the
time the S9 re-measure happens, the pack is stable: C-UI-0 has finished moving the gates and the
baselines, and C-UI-1's own changes to the pack (if any) are in the same checkout. **The literal is
therefore measured THEN, at the S9 head, by the seal generator or by hand - never copied out of this
document.** That is the same rule E fact 9 applies to every `pre`/`post`, and it is why v4 publishes
a PROCEDURE and no value.

**THE EXACT PROCEDURE, for the S9 integrator, on the day of the re-measure:**

```
ROOT=rebuild/m1/approved-2026-09-18
1. git ls-tree -r --name-only HEAD -- $ROOT/          # git-tracked files only, so run/ and
                                                     # __pycache__/ cannot appear
2. for each path: sha256 over `git cat-file blob HEAD:<path>`
3. emit one line `<path minus "$ROOT/"> <space> <64-hex>`; sort by path bytes ascending
4. paste the sorted lines into pack-pin.test.mjs as its literal
5. re-run the cell against the WORKING TREE and require zero MISMATCH, MISSING and ADDED
```

Step 5 is not ceremony: it is what proves the literal a git walk produced matches what a working-tree
walk reads, which is the whole of the `.gitattributes` argument taken as a measurement rather than
as an assurance.

**WHAT THE INTEGRATOR SHOULD EXPECT TO SEE, measured in the farm so the size is not a surprise.**
At `ecbef86a` (the head of `rebuild/c-ui-0-gates`, the youngest pack state that exists today) the
whole pack holds **904 git-tracked files**: 850 under `quality/` (844 `baseline/`, plus
`STANDARD.md`, `common.py`, `gate.py`, `phonesheet.py`, `statesheet.py`, `teeth.py`), 42 under
`app/`, 8 under `ref/`, 3 under `states/`, and `README.md`. The `baseline/` half is 419 `.json`
state records, 424 `.png` screens, 7 files under `baseline/linux/` and one `ENV.txt`.
**The serialisation is 904 lines and about 90 KB**, and the longest pack-root-relative path is 43
characters. **These are the shape, not the value**: the pack at the S9 head will differ, and any
hand rebuilding H19 must re-measure rather than copy. v3's 53-file, `quality`-excluded value
(`6121aa91...` at `5f4cad0a`) is **superseded and must not be used**; it is named here only so a
reader of v3 does not carry it forward by accident.

**Also measured, and it is what the exclusion reversal buys.** At `5f4cad0a` the pack held 75 files
and at `ecbef86a` it holds 904; **851 of those 904 are exactly the files v3's PACK-PIN excluded.**
Under v3, C-UI-0 could move 850 gate and baseline files and the pin would not notice - which is to
say the gates that judge every post-S9 look ticket were outside the thing that guards them. Under
PM-R6'(i) they are inside it. That is the single largest correction this round makes, and the cost
is that C-UI-0 and C-UI-1 must be FINISHED with the pack before the literal is taken, which
`DECISIONS:531` already requires.

**The cost to lane C, said plainly rather than assumed away.** After the literal is taken, ANY
further pack change - a re-baselined screen, a gate script fix, a new state record - moves the pin
and must ride a reseal child, exactly as a sealed source byte does. That is the intended price of
"the gates are the acceptance". If it turns out to be the wrong price, it is a PM decision and not
an author's, and **F.2 STOP-9 is the place the round stops and says so**.

#### C.5.2 THE COPY GAP AS IT IS: COPY-BIND is WITHDRAWN, and the hole is stated rather than covered (PM-R6'(ii))

**PM-R6'(ii) withdraws COPY-BIND from S9. R3 BLOCKING-E is upheld in full, and it was proved by
execution rather than by reading, which is the standard this document asks of itself.** v3 specified
a sealed cell asserting (1) that every APPROVED-DERIVED string occurs in the files `design.APPROVED`
names and (2) that no PREVIEW-OWNED string does. R3 measured that those are **already in the tree**,
word for word, inside `assertDesignBinding`, which a sealed cell runs:

| v3's COPY-BIND rule | where it already lives | who already runs it |
|---|---|---|
| every `APPROVED_COPY` string is in the approved references | `design.cjs:543` `assert(approvedText.includes(line), 'COPY-BINDING FAIL: declared approved copy missing upstream')` | `design.test.cjs:72`, a cell sealed in BOTH maps (`0db62ca9...`), CI-homed on ubuntu AND windows at `rebuild.yml:231-:232`; and `build.mjs:472` on every build |
| every `RUNTIME_COPY` and `CHECKIN_RUNTIME_COPY` string likewise | `design.cjs:548` | same |
| no `PREVIEW_RUNTIME_COPY` string is in them | `design.cjs:552` `assert(!approvedText.includes(line), ...)` | same |

**One correction to R3, which makes its finding stronger and not weaker.** R3's block quote numbers
those lines `:541`, `:542`, `:543`, `:546`, `:547`, `:550`, `:551`; re-read in the farm at
`023b99f4` they are `:542`, `:543`, `:544`, `:547`, `:548`, `:551`, `:552`, each one line lower than
R3 gives - the same class of off-by-one R2 N4 and R3 N6 both caught in this document, now caught in
the review. And R3 quoted two loops where there are **three**: `design.cjs:538-:541` iterates the
TEMPLATE and requires every text line of `screens.template.html` to be in the approved references.
That third loop does not save the finding, and it is worth saying why: it catches a sentence ADDED
to the template that the approved design does not carry, and R3's fixture removed the sentence from
the template and the array TOGETHER, so the loop had nothing left to look at. **The finding stands
exactly as written, at corrected cites: `assertDesignBinding` runs `:527-:570`, the copy rules are
`:538-:556`, and a coordinated deletion passes all three loops.**

**THE GAP, STATED AS IT IS.** These are the sentences the S9 brief and the verdict must carry, and
none of them is softened:

1. **`design.cjs`, `screens.template.html` and the five approved-copy arrays were NEVER sealed.**
   Measured by parsing `acceptance-s8-real-shape.json`: `design.cjs` is in neither map,
   `screens.template.html` is in neither map, and ZERO paths under `rebuild/m1/` are in either.
2. **A coordinated deletion passes every check in the tree today.** Remove one sentence from
   `screens.template.html` and from `APPROVED_COPY` in the same commit and it is green: green in CI,
   green under `--ci --package S8` and `--package S9`, green under the D.2 fence (which knows only
   the sealed inventory, and none of the three files is in it), and green under
   `design.test.cjs:74-:75`, whose count compares `design.cjs`'s arrays against their own lengths so
   both sides fall by one. R3 executed this against the real function with the real references.
3. **S9 NEITHER WIDENS NOR CLOSES IT.** S9 releases no file that carries on-screen copy.
   **Measured, not asserted:** I loaded `design.cjs` in the farm and searched both released files for
   all 200 distinct declared copy strings. `preview.css` (6310 bytes) contains two of them and
   `build.mjs` (30974 bytes) four; **outside comments, `preview.css` contains ZERO**, and `build.mjs`
   contains only `"Today"` (in the function name `buildToday`, in an `IMPORT-ROUTE FAIL` diagnostic
   at `:248` and in a build log line at `:344`) and `" of "` (in sixteen `for (... of ...)` loops).
   The two remaining comment hits in `build.mjs` are `"Report a problem"` at `:142` and `" recorded"`
   at `:168`, both inside the `REQUIRED_INPUTS` comment prose that R2 N6 already identified as prose.
   **Neither released file emits a single string that reaches the screen.** The files that DO carry
   on-screen copy - `screens.template.html`, `design.cjs`, `today-app.cjs` and the other five
   `VIEW_SOURCES` - are every one of them either already free or still sealed, and none of them is on
   A.6's closed list.
4. **So the copy lock is not S9's to close, and S9 must not claim it is.** v3's C.5.2, its R2
   section and its TOLD-3 each claimed the two cells made the copy locks real. **All three claims are
   withdrawn in v4.** What replaces them is C.6: a named precondition of S10.

**THE CENSUS IS KEPT, because S10's design needs it.** Everything below this line is v3's
measurement, unchanged and re-confirmed by R3 figure for figure. It is no longer the justification
for a cell; it is the input to C.6.

**Measurement 1, the whole population.** The five arrays hold **218 strings** (200 distinct).
Against the pinned half of the 09-18 pack (its 18 text files, `quality/**` and `README.md`
excluded): **139 of 218 occur verbatim, 79 do not.**

| array | strings | verbatim in the pinned 09-18 pack | in `app/*.html` and `app/*.js` only | verbatim in the two files `design.APPROVED` names |
|---|---|---|---|---|
| `PREVIEW_COPY` | 3 | 1 | 1 | 0 |
| `APPROVED_COPY` | 60 | 14 | 11 | **60** |
| `RUNTIME_COPY` | 21 | 21 | 18 | **21** |
| `CHECKIN_RUNTIME_COPY` | 18 | **0** | 0 | **18** |
| `PREVIEW_RUNTIME_COPY` | 116 | 103 | 78 | **0** |
| total | **218** | **139** | 108 | 99 of 99, and 0 of 119 |

The 139 are carried by 17 pack files, led by `states/STATE-INVENTORY-DRAFT.md` (130),
`app/states-today.js` (70), `app/states-workout.js` (41), `app/states-coach.js` (15) and
`app/states-index.js` (14).

**Measurement 2, the same 218 split by the rule each array actually carries.** `design.cjs` does not
declare one rule over 218 strings. It declares two opposite rules over two populations, and its own
comments say so: `design.cjs:76` "Static copy that MUST come from the approved references", and
`design.cjs:136-:137`, where the preview-runtime list is "checked to be ABSENT from the approved
references" so that it "can never be used to smuggle in approved-looking words" (repeated at
`:173`, `:200` and `:231`):

| population | strings | rule design.cjs declares | verbatim in the files `design.APPROVED` names | verbatim in the 09-18 pack |
|---|---|---|---|---|
| APPROVED-DERIVED: `APPROVED_COPY` + `RUNTIME_COPY` + `CHECKIN_RUNTIME_COPY` | 99 (81 distinct) | MUST occur in the approved references | **99 of 99** | 35 of 99 |
| PREVIEW-OWNED: `PREVIEW_COPY` + `PREVIEW_RUNTIME_COPY` | 119 | MUST NOT occur in the approved references | **0 of 119** | 104 of 119 |

**Why the 64-of-99 wall exists, in one sentence with the number attached** (v3 wrote this to show
that PM-R6's literal wording could not be built; it is kept because it is the content of OQ-2, which
PM-R12 has now sent to lane C-UI): `design.APPROVED` today
names the two files of the OLDER pack `rebuild/m1/approved-2026-09-08/`, and `DECISIONS:530` says in
terms that `design.cjs`'s pins move to the 09-18 pack only "when C-UI-1 seals"; the 09-18 prototype
draws Today, Workout and Coach and draws **no check-in sheet at all**, which is why
`CHECKIN_RUNTIME_COPY` binds **0 of 18** against it and `APPROVED_COPY` binds 14 of 60. Binding the
approved-derived strings to the 09-18 pack today would put **64 of 99 red on the first run**, which
is not a rule anybody could keep, and bending it (substring rules, allowlists, a tolerance) is
exactly what PM-R6 forbade.

**WHAT THE MEASUREMENT IS FOR NOW.** v3 used it to justify pointing COPY-BIND at
`design.APPROVED`'s own files instead of at the pack, where the two populations measure 99 of 99 and
0 of 119. R3 showed that a cell built that way asserts nothing `design.cjs:543`, `:548` and `:552`
do not already assert from inside the seal, so **the cell is not built and the numbers stay as
numbers.** They are the input to two things: C.6's design questions, and **OQ-2, which PM-R12 has
now sent to lane C-UI** - on the day C-UI-1 moves `design.APPROVED` to the 09-18 pack, 64 of the 99
approved-derived strings stop occurring in the corpus, because the 09-18 prototype draws no check-in
sheet (`CHECKIN_RUNTIME_COPY` binds 0 of 18 against it). That is still the most useful thing this
measurement produced; it is simply not a reason to write a cell. **The S9 integrator must have lane
C-UI's answer to OQ-2 in hand before the re-measure**, because it decides whether the four
`pinned-unchanged` paths of E fact 17 are still the right four (C.5.3).

**And the seal underneath it, which is KEPT.** A cell is only worth what the things it reads are worth, which is
the whole lesson of R1 BLOCKING-4. So S9 declares **four** paths `pinned-unchanged` with
`pre === post`, and `design.cjs` is NOT among them (PM-R6):

```
rebuild/m1/approved-2026-09-08/Earned-refinement-A.html
rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html
rebuild/m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md
rebuild/m1/MOCK.md
```

`pinned-unchanged` is the correct role by `product()` **`:1909`** (v2 cited `:1908`, which is the
comment above it; **R2 N4, FIXED**, and R2 N5 independently checked the refusal it would otherwise
hit) and `:1967`: the parent pins none of them, S9 does not write them, and S9 declares, runs over
and leaves them alone. `new` would be refused at `:1945-:1949` for a file with `pre === post` that
this package does not move. The fourth, `MOCK.md`, is the v2 author's own addition and it stands:
`design.test.cjs:185-:187` reads it as part of the same cross-check.

With those four sealed and `design.cjs` free, the coordinated edit BLOCKING-4 found is dead in both
halves: change an approved reference and `product()` `:1967` refuses the byte move
(`PRODUCT-PINNED-UNCHANGED-BYTES-MOVED`); change `design.cjs`'s sha256 constant to match, and the
reference has not moved, so `readApproved` (`design.cjs:338-:341`) throws `APPROVED-PIN FAIL` on
every build and in `design.test.cjs:15`. Neither half can move alone and the pair can no longer
move together. **This adds `rebuild/m1/` to the sealed inventory for the first time, so the S9 brief
must say so by name.** R3 re-checked the role for all six paths at `:1909`, `:1915-:1916`, `:1967`
and `:1945-:1949` and confirmed it, and called these four declarations "the part of C.5 that
actually makes `DECISIONS:536`'s first promise true". **v4 changes nothing here except the caveat in
C.5.3 step 3: the four are right for the list `design.APPROVED` names TODAY, and the integrator
re-decides them against the list at the S9 head.**

**And if `design.cjs` itself were ever released:** it is not sealed today and PM-R6 rules it stays
that way, so the question is moot as a release question. What matters is that the pins it holds are
worth something, and after C.5 they are: the files they point at are sealed bytes, and PACK-PIN
holds the pack the owner actually approved. The build-time re-enforcement in `build.mjs:472` becomes
lane C's to edit after the release (that is the cost named in A.4 row 6), so the cell side is the
only side that can be relied on, and C.5 is what makes the cell side worth relying on.

#### C.5.3 APPROVED-PIN: whatever `design.APPROVED` names at the S9 head, pinned parametrically (PM-R6'(i), second half)

PM-R6'(i) asks that the files `design.APPROVED` names be pinned as well as the pack, and asks for it
**parametrically, because C-UI-1's final state is not yet known.** That is right, and R3 BLOCKING-F
is the reason: on the day C-UI-1 seals inside this package, `design.APPROVED` may still name the two
09-08 references or may have moved to the 09-18 pack, and the four `pinned-unchanged` paths of E
fact 17 would then pin four files nothing reads any more.

| property | design |
|---|---|
| the file list | read from `design.APPROVED` **at run time, on every run, never cached and never copied into the cell** - the same rule as `CHAIN_REF` at `b-package.cjs:1201` |
| the expected sha256s | the cell's OWN literal, one per file, measured at the S9 head. It never reads `design.APPROVED[n].sha256`, so it cannot be satisfied by editing a constant |
| what it refuses | `APPROVED-PIN MISMATCH <path>`, `APPROVED-PIN MISSING <path>`, `APPROVED-PIN LIST-EMPTY` |
| what it closes that nothing closes today | `design.test.cjs:15-:20` compares each file to `design.APPROVED`'s own sha256, so BOTH sides are unsealed and move together. APPROVED-PIN supplies the third, sealed side |
| relation to PACK-PIN | if `design.APPROVED` has moved INTO `rebuild/m1/approved-2026-09-18/` by the S9 head, PACK-PIN already covers those bytes and APPROVED-PIN becomes a second, narrower statement of the same fact. That is not waste: it is what turns a silent pin move into a named one |

**WHAT THE S9 INTEGRATOR MUST MEASURE ON THE DAY**, in one list, because this is the part that
cannot be decided in advance:

1. read `design.APPROVED` at the S9 head and write down the file list. Today it is
   `rebuild/m1/approved-2026-09-08/Earned-refinement-A.html` and
   `.../Earned-additions-C-approved.html` (`design.cjs:43-:48`).
2. take a sha256 of each named file from Git at the S9 head; those are APPROVED-PIN's literals.
3. **re-decide E fact 17's four `pinned-unchanged` paths against that list**, adding the two files
   `design.test.cjs`'s own cross-check reads by hard-coded path (`ADDITIONS-C-APPROVED-HANDOFF.md`
   at `:181-:182` and `rebuild/m1/MOCK.md` at `:185`). If the list has moved to the 09-18 pack, the
   09-08 paths leave the declaration and the 09-18 ones do not need to join it, because PACK-PIN
   covers them.
4. **record whether C-UI-1 had to edit `design.test.cjs`, and name the hunks.** This is R3
   BLOCKING-F point 3, confirmed at the line and re-cited: `design.test.cjs:17` asserts
   `approved.length === 2`; **`:25` and `:26`** (R3 cited `:23-:24`, which is the comment above them)
   assert `approved[0].file` matches `/Earned-refinement-A\.html$/` and `approved[1].file` matches
   `/Earned-additions-C-approved\.html$/`; and `:184` asserts that line 9 of
   `ADDITIONS-C-APPROVED-HANDOFF.md` contains `design.APPROVED[1].sha256`. **Those names exist
   nowhere in the 09-18 pack.** So if C-UI-1 moves the pins inside this package, it must edit a
   SEALED cell (`design.test.cjs`, `0db62ca9...`, both maps) and S9 must declare that cell
   `role: "edited"` with a real post and move its execution pin. **That is a hunk, and it belongs in
   the S9 declaration list the day it is known.**
5. take lane C-UI's answer to **OQ-2** before doing any of the above. If the arrays move with the
   pins, step 3's answer changes.

**AND THE SCHEDULING CONSEQUENCE, which is R3 BLOCKING-F's real content.** R3 is right that v3
scheduled H19 on day 1-2 while its own dependencies said otherwise, and right that E.2's
"depends on C-UI-1?" column answered "no" where the measurement says yes. **v4 splits the answer
rather than arguing with it:**

| piece | can it be written before C-UI-1? | where it sits in E.2 |
|---|---|---|
| PACK-PIN's CODE (the walk, the ignore list, the three refusals, the six red-first rows against a throwaway fixture pack) | **YES**, and it should be, because none of it depends on the literal | **NOW, day 1-2** |
| PACK-PIN's LITERAL (904-odd lines) | **NO.** It is measured at the S9 head, after C-UI-0's teeth audit and C-UI-1's seal (`DECISIONS:531`) | **ONE RE-MEASURE**, with every other pre/post |
| APPROVED-PIN's CODE | **YES** | **NOW, day 1-2** |
| APPROVED-PIN's LITERALS, and E fact 17's re-decided path list | **NO**, and OQ-2 must be answered first | **WAIT**, then the re-measure |
| the `design.test.cjs` edit, if C-UI-1 moves the pins | **NO**, and it may be zero hunks or two | **WAIT**; F.2 gains STOP-10 for it |

So H19 and H19b are **half NOW and half WAIT**, and the round says so rather than scheduling the
whole of them on day 1-2. R3 asked for exactly this and I do not dispute any part of it.

### C.6 What S10 must have before it releases a file that carries copy (PM-R6'(ii))

**This section names a precondition. It does not design the lock, and S9 does not build it.**
The lock is a joint design by lane C-UI and lane B, and S9's only obligation is that the obligation
exists in writing before anybody needs it.

**WHY S10 AND NOT LATER.** `DECISIONS:543` (A) rules that `today-app.cjs` is RELEASED by S10 through
the role S9 builds. `today-app.cjs` is **the first released file that carries on-screen copy**: it
is one of the six `design.VIEW_SOURCES` (`design.cjs:607`), its bytes are what `appSource()`
(`design.cjs:619`) concatenates, and its own copy block near `:49-:86` is byte-pinned today only
because the whole file is. S9's two released files carry none (C.5.2 item 3, measured). **So the
line S10 crosses is not "one more file"; it is the first time a file whose words the athlete reads
leaves the seal.** Before that release a real lock must exist.

**THE DIRECTION, NAMED ONLY.** The pieces are already in the tree and PM-R6'(ii) points at them:

| piece | what it is | measured |
|---|---|---|
| the corpus | `quality/baseline/states/*.json` in the approved pack: each record carries the exact on-screen `text` for one state in one theme | **419 records over 210 distinct state ids; for all 210 the `text` is IDENTICAL across the dawn and ink themes; 201 distinct text blocks.** So "text identical per state" is not an aspiration, it is what the pack already holds, and it is a corpus with no theme ambiguity in it |
| the pin | **PACK-PIN** (C.5.1) now covers those 419 records, because PM-R6'(i) stopped excluding `quality/**` | this is the second reason the exclusion was reversed, and it is why C.6 can be written at all |
| the enforcement | the **state sheet** (`quality/statesheet.py` in the pack) run in CI against the CLIENT BUILD, so the text the built page renders per state is compared against the pinned record | not measured by me: I did not read or run the gate scripts, and their teeth are `DECISIONS:531`'s audit, not mine |
| the residue | a rule for **old-look screens not yet ported**, which have no state record in the 09-18 pack. This is the same hole OQ-2 measures from the other side: 64 of the 99 approved-derived strings, led by all 18 of `CHECKIN_RUNTIME_COPY` | 0 of 18 check-in strings occur in the 09-18 pack, because the prototype draws no check-in sheet |
| the shape to copy | **A.4 law 7.** `plain-copy.cjs` is unsealed and its rule is still held, because `copy.test.mjs:395`/`:405` plant a dash in a COPY of the tree and assert the BUILD's refusal. A copy lock built that way - a sealed cell asserting what the BUILD renders, against a pinned corpus - is held even though every file it judges is free | this is the one pattern in the tree that already solves the problem C.6 states |

**THE QUESTIONS THE DESIGN MUST ANSWER**, written so lane C-UI and lane B can divide them:

1. **What is the unit of comparison?** The record's whole `text` field, or its `els` array line by
   line? The `els` form names the element, which would let a refusal say which line moved; the
   `text` form is one string per state and cannot.
2. **What produces the observed side?** The state sheet rendering the client build, or the client
   build's own emitted assets read statically? The first catches a binding that stopped firing; the
   second runs on any runner with no browser, which matters because `browser-check.mjs` has no CI
   home and never will (PM-R3).
3. **Which states are in scope on day one?** The 210 with records, or all of them? A lock over a
   subset must say which subset and why, or it becomes the next "139 of 218 are asserted by nothing".
4. **What is the rule for a screen with no record yet?** Refuse the release of any file that carries
   its copy; or admit it against an explicit, PINNED allowlist of un-ported states that shrinks with
   each look ticket. The second is the only one that does not stop C-UI-2.
5. **What happens when a look ticket legitimately changes the words?** The record moves, which moves
   PACK-PIN, which is a reseal child. Is that the intended price, and if not, what is the narrower
   pin that still refuses an unannounced change?
6. **Where does `design.cjs`'s array census fit?** The five arrays and the template are still
   unsealed and PM-R6 rules they stay that way. Does the state-record lock make the arrays redundant,
   or must both exist? C.5.2's census (218, 200 distinct, 99 approved-derived, 119 preview-owned) is
   the input to that answer.
7. **What is red first?** The fixture R3 executed: remove one sentence from `screens.template.html`
   AND from `APPROVED_COPY` in the same commit. **The lock is only real when that fixture FAILS
   naming the sentence.** Nothing shorter is a lock, and this document has now claimed otherwise
   twice.

**WHAT S9 OWES C.6, and it is only this:** the whole-pack PACK-PIN (so the corpus exists as a pinned
thing), the released role itself (so S10 has a mechanism to release `today-app.cjs` through), and
this section, so that S10's author reads a named precondition instead of discovering a gap. **S9
claims nothing else about the copy, and the brief, the verdict and TOLD-3 all say so.**

---

## D. WHAT GUARDS A RELEASED FILE INSTEAD, AND THE FENCE

### D.1 The hole, measured

"Lane C touched only released paths" is today a promise, not a check. Measured:

| guard | what it actually covers | what it misses |
|---|---|---|
| `fidelity()` `b-package.cjs:2005` | `git diff --name-only sourceBase HEAD` restricted to `rebuild/engine`, `rebuild/conform`, `rebuild/m4/spec`, `rebuild/lanes/b/tooling` | **all of `rebuild/m3`**. A lane C branch can move any `m3` byte and `UNLISTED-SOURCE-CHANGE` (`:2011`) never fires |
| `product()` `:1970`-`:1972` | every file the SPEC declares | it only runs when somebody runs `b-package.cjs --ci --package S8`. `rebuild.yml:150` does run it on every push to `rebuild/**`, so this is the real teeth today |
| `measure/test/boundary.test.mjs:128` | every file `packages/S4.json` pins | S4's inventory, not S8's. It is two generations stale as a fence, by design (`boundary.test.mjs:99-:116`) |

So there IS a fence today and it is `rebuild.yml:150`: any push to a `rebuild/**` branch runs
`--ci --package S8`, `product()` hashes all 224 declared files, and a moved sealed byte is
`UNLISTED-PRODUCT-DRIFT`. **This is the guard the ruling assumes and it already exists.** What it
does NOT do is say WHICH paths lane C was allowed to touch, and it will not know about the released
two until S9 seals.

### D.2 The cell

`rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs` (new, lane C root, S9 declares it).

| property | design |
|---|---|
| what it asks | of every path in `git diff --name-status <merge-base with origin/rebuild/t2-client-core> HEAD` (**`--name-status`, not `--name-only`; R3 N3**, because the skip row below needs the status letter and one diff should serve both), is any path a key of the CURRENT sealed inventory and NOT in that inventory's `released` block? A deletion (status `D`) of a sealed path counts as touching it |
| how it learns the inventory | **v2, R1 BLOCKING-2: OUT OF GIT AT THE CHAIN REF, never from the worktree.** `git show refs/remotes/origin/rebuild/t2-client-core:rebuild/m4/spec/acceptance-s<N>-*.json`, the same ref the runner fixes at `b-package.cjs:189` (`CHAIN_REF`) and re-reads on every call with NO CACHE for exactly this reason (the r10 F4 lesson, `:1195-:1200`, and the read itself at `:1201`). Which N: **parse the integer after `acceptance-s` in the file name and take the numeric maximum** (a lexical walk puts `s10` before `s9`; R1 N9); if two artifacts carry the same N the cell FAILS `FENCE-AMBIGUOUS-INVENTORY` naming both, rather than picking one. It reads `product`, `executionPins` and `released`. It carries no hash and no path list of its own, so it cannot go stale the way `boundary.test.mjs` did |
| why not the worktree (the R1 finding, restated so nobody re-introduces it) | v1 said "the youngest sealed artifact present in the tree". The tree is the lane C branch's own worktree, so a branch that wanted to touch a sealed path could add that path to the artifact's `released` block, or edit its `product` map, and the fence would measure the change against an inventory the change itself wrote. Nothing else catches it: the artifact is NOT a key of its own `product` map (an artifact does not pin itself, confirmed by parsing `packages/S8.json`), so `product()` never hashes it; `fidelity()` `:2010` explicitly exempts `f === ARTIFACT` from `UNLISTED-SOURCE-CHANGE`; and the only thing that notices, `sealedRunReceipt()` `:2963`, does not fail the run - it reports `SEALED-RUN-RECEIPT-VOID` at `:3196-:3198` and asks for a FULL run. A fence whose fenceposts move with the animal is not a fence |
| the artifact-tamper check | the cell ALSO refuses when the artifact it reads at the chain ref and the artifact of the same path in the worktree differ: `FENCE-INVENTORY-DIFFERS-FROM-CHAIN`. A branch legitimately changing a sealed artifact is a reseal child, which the skip row below already handles, so the two rules do not collide |
| what it does on a reseal child branch | **v3, R2 BLOCKING-A, PM-R4: THE SKIP IS DERIVED FROM THE CHAIN, NOT FROM THE DIFF, and the default is FAIL.** v2 said "a branch whose diff contains `rebuild/lanes/b/tooling/packages/S<N+1>.json` is a reseal child and the cell SKIPS". Nothing verified that claim, so a lane C branch that wanted to touch `today-app.cjs` could add an empty `packages/S10.json` and the fence would stand aside: BLOCKING-2's own sentence ("a fence whose fenceposts move with the animal is not a fence") applied to the gate instead of the map. The cell now SKIPS only when ALL FIVE of these hold, and otherwise FAILS **`FENCE-RESEAL-CHILD-UNVERIFIED`** naming the one that did not: (1) **the diff, built with `git diff --name-status` and NOT `--name-only` (R3 N3, FIXED)**, contains EXACTLY ONE `rebuild/lanes/b/tooling/packages/<ID>.json` **at status `A`**, and it parses as JSON with the runner's own `SPEC_KEYS` (`:1071`) key closure. **Why the word matters, with the number:** `--name-only` cannot tell an added file from a modified one, and E fact 7 re-pins the runner sha in `packages/H3.json`, `S3`, `S4`, `S5`, `S6`, `S7` and `S8`, so a REAL reseal child's diff carries **eight** `packages/*.json` paths, one added and seven modified. Under `--name-only` the condition reads eight and refuses S9's own diff. Only status `A` counts, and status `M` on an ancestor spec is expected and ignored; (2) its `parent.chosen` option's `artifact` is the EXACT path of the artifact the fence just read at `CHAIN_REF`, and that option's `sha256` equals the sha256 the FENCE ITSELF measures over that artifact's bytes at `CHAIN_REF` (never the value the spec file carries, and never a value read from the worktree); (3) `<ID>` is NOT an id `IDS` carries at `CHAIN_REF` (a new child, not a re-run of a sealed one); (4) the diff ALSO contains `rebuild/lanes/b/tooling/b-package.cjs`, and the branch's copy of it carries `<ID>` in `IDS`, which is the one runner hunk no reseal child can skip; (5) the spec's `sourceBase` is an ancestor of `HEAD` (`git merge-base --is-ancestor`). The skip then PRINTS the id, the artifact and its measured sha256, so the CI log names what stood aside and on whose authority |
| **WHAT ACTUALLY HOLDS THIS GATE, said in one sentence so no reader mistakes it (R3 N4, FIXED)** | **the SEAL behind the fence holds it, not the fence.** Conditions (1), (2) and (5) are all values a forging branch can copy out of the chain, because the artifact path and its sha256 at `CHAIN_REF` are public; condition (3) is a fact about the chain, not a cost. **The only condition that COSTS anything is (4)**: the branch must add its id to `IDS` in `b-package.cjs`, which is a SEALED byte, caught by `fidelity()` (`:2005`'s diff roots include `rebuild/lanes/b/tooling`) and by the runner pin at `:2012` on the same CI run. That is a real bar and this spec asks for no more, but a reader of the row above would otherwise think the fence holds the gate when what holds it is the seal behind the fence. R3 is right and the sentence is now in the document |
| **condition (3) after the merge, and it is one clause (R3 N4, second half, FIXED)** | condition (3) requires `<ID>` to be ABSENT from `IDS` at `CHAIN_REF`, which stops being true the moment the child merges to the chain. A later push to the same lane branch would then fail `FENCE-RESEAL-CHILD-UNVERIFIED` for a branch that had done nothing wrong. **The clause: condition (3) is satisfied EITHER when `<ID>` is absent from `IDS` at `CHAIN_REF` (an unmerged new child) OR when `<ID>` is present at `CHAIN_REF` AND the artifact the fence read at `CHAIN_REF` is that child's own** (it has merged, and the fence is now reading the inventory this branch itself sealed). Harmless in practice, as R3 says, and worth the clause because the alternative is a red nobody can explain |
| one clause of R2 BLOCKING-A I could not build, and why | R2 asks the cell to "require its `packageId` to be an id `IDS` carries at `CHAIN_REF`". Measured: `IDS` at `b-package.cjs:173` on the chain tip is `['B-NTC','H3','S3','S4','S5','S6','S7','S8','B1','B2','B4','B3']`. A reseal child's own id is added to `IDS` BY THAT CHILD'S OWN BRANCH (fact 1 of section E does exactly this for `'S9'`), so at `CHAIN_REF` a genuine new child's id is always ABSENT. The clause as written would refuse every legitimate reseal child, S9 included. Condition (3) INVERTS it (the id must be absent at the chain ref) and condition (4) supplies the teeth R2 wanted from it (the id must be present in `IDS` on the branch). This is a partial DISPUTE of BLOCKING-A, recorded with its measurement in the R2 section; the finding itself is CONFIRMED and fixed |
| what it does with no network | `git merge-base` against `refs/remotes/origin/rebuild/t2-client-core`; if that ref is absent (a shallow clone) the cell FAILS with `FENCE-CHAIN-REF-ABSENT` rather than passing vacuously. `rebuild.yml:35` already sets `fetch-depth: 0` |
| red first | (1) a branch touching `today/today-app.cjs` FAILS naming that path; (2) a branch touching `today/preview.css` PASSES after S9 and FAILS before it; (3) a branch touching `today/screens.template.html` PASSES (never sealed); (4) a deleted `origin/rebuild/t2-client-core` ref FAILS, not passes; (5) a reseal-child branch SKIPS with its reason printed; **(6) v2, R1 BLOCKING-2: a branch that edits the sealed artifact IN ITS WORKTREE to widen `released` (or to drop a path out of `product`) and then touches that path FAILS, both because the inventory is read at the chain ref and because the worktree artifact differs from it. This is the cell that proves the fence is not self-certifying, and it is the one to write first**; **(7) two artifacts with the same N present at the chain ref FAIL `FENCE-AMBIGUOUS-INVENTORY`; `acceptance-s10-*.json` beside `acceptance-s9-*.json` selects s10, not s9 (the numeric-max rule, R1 N9)**; **(8) v3, R2 BLOCKING-A, PM-R4, AND IT IS WRITTEN FIRST, BEFORE THE SKIP HAS A HAPPY PATH AT ALL: a branch that adds a `rebuild/lanes/b/tooling/packages/S10.json` it did not earn must FAIL `FENCE-RESEAL-CHILD-UNVERIFIED`, not skip. Four sub-rows, one per way of not earning it: an empty or non-spec JSON file; a spec whose `parent.chosen` option names a different artifact than the one the fence read at `CHAIN_REF`; a spec that names the right artifact but a sha256 that is not the one the fence measures at `CHAIN_REF`; and a spec whose id is not in `IDS` in the branch's own `b-package.cjs`. A fifth sub-row is the green control: the real S10 preparation branch SKIPS and prints its id, its artifact and the measured sha256** |
| where it runs | a new `rebuild.yml` step beside the A1/A2/A3/A4 step (`rebuild.yml:231`), named by exact path, never globbed (`DECISIONS:117 (4)`, `:186 (3)`). `rebuild.yml` is a sealed path (it is in `acceptance-s8-real-shape.json`), so the step lands inside S9 and nowhere else |
| what it is NOT | it is not a replacement for `--ci --package S<N>` at `rebuild.yml:150`. That step proves BYTES; this one proves INTENT, in one sentence a human can read in the CI log: "this change touched 3 sealed paths: ...". **And it is NOT a check that lane C touched nothing that matters (R2 N1, FIXED).** What it actually asks is "did lane C touch a path that is IN the sealed inventory", and three files that WRITE ATHLETE STATE stand outside that inventory today: `today-model.cjs:378` (`weighIn` through `:395`), `gym-model.mjs:502` (`logSet`) and `checkin-app.mjs:150` (`model.save()`). After PM-R3, S9 declares two of the three (`gym-model.mjs`, `checkin-app.mjs`, E fact 17), which brings them inside the fence; `today-model.cjs` stays outside until TODAY-SPLIT, so **until then this fence passes a lane C branch that rewrites the weigh-in admission bounds**, and the S9 brief must say so in those words. D.4 is the cell that closes the general form of this gap |

### D.3 Why this belongs in S9 and not later

`rebuild.yml` is sealed. Adding a step to it is a sealed-byte move, so it happens in a reseal child
or not at all. S9 is the reseal child that releases the paths; shipping the release without the
fence would leave one round in which "lane C touched only released paths" is enforced by nothing but
the PM reading a diff. The fence and the release are one change.

### D.4 THE WRITER-FENCE, referenced and NOT specified here (PM-R4)

**The inventory fence of D.2 does not catch a writer added to an unsealed file.** That is its shape,
not a defect in it: it asks whether a touched path is IN the sealed inventory, and a file outside the
inventory is outside its question by construction. The general form of R2 N1 is therefore:

> after the release, and much more so after TODAY-SPLIT creates a set of new unsealed view modules,
> nothing in CI refuses a lane C commit that adds `await host.save(...)`, `logSet(...)` or an
> `indexedDB` handle to a file the seal does not hold.

A second cell answers that, and **TODAY-SPLIT defines it, not S9.** This section REFERENCES it so
that the two specs cannot both assume the other has it:

| | |
|---|---|
| name | **WRITER-FENCE** |
| owner | the TODAY-SPLIT spec (`rebuild/lanes/c/TODAY-SPLIT-SPEC.md`), which is where the view/writer boundary is defined and therefore where the list of "files that may not write" is defined. `DECISIONS:542` (C) and `:543` (A) both name it as that lane's cell |
| what it would ask | **UNDER PM-R10 the question sharpens.** `DECISIONS:543` (A) states the rule the fence enforces: "no released file calls, imports or holds a writer". So: of every RELEASED file and of every unsealed file under `rebuild/m3/w7-preview/today/`, does the source contain a durable write - a call to `logSet`, a `.save(`, a `readings.` writer, an `indexedDB` reference, or an import of a host module |
| what S9 owes it | its `CHILD_ROOTS` entry and its `rebuild.yml` step, **IF** TODAY-SPLIT lands in S9's window - which under PM-R10 it does not, because `:543` (A) makes S10 the carrier. So in the expected case S9 owes it **nothing but this section**. Nothing else: S9 does not specify its rule, its refusal names or its red-first rows |
| **why it matters MORE after PM-R10** | under v1 of the split the released files were new view modules nobody had ever sealed. Under `:543` the released file is `today-app.cjs` itself, which held five IndexedDB lane openers and three durable writers last week. **A released `today-app.cjs` with no WRITER-FENCE is a file that can silently regrow the exact thing that kept it sealed.** S10 must not release it without one, and that is a sentence for S10's spec, not a hunk for S9 |
| what S9 does NOT claim | S9 does not claim the WRITER-FENCE exists. Until it does, the honest sentence for the brief and the verdict is the one D.2's "what it is NOT" row carries: the fence proves which SEALED paths were touched, and it proves nothing about a writer added to an unsealed one |

---

## E. THE S9 TOOLING FACT LIST, mirroring S8-PREP

Shape taken from `S8-PREP-AUTHOR-REPORT.md:60-117` and `S8-REAL-SHAPE-BRIEF.md:290-360`.

| # | fact | evidence / predicted refusal without it |
|---|---|---|
| 1 | `IDS` (`b-package.cjs:173`) gains `'S9'`, directly behind `'S8'` and still ahead of `'B1'`; thirteen ids | without it the argv gate refuses the id outright (R01), `S8-PREP-AUTHOR-REPORT.md:66` |
| 2 | `NO_REGISTER_IDS` (`:316`) gains `'S9'`; nine ids | an S- id is admitted without a by-name PM ruling, as S3 to S8 were (`:310` shape assert) |
| 3 | `CHILD_ROOTS` (`:405`) gains `rebuild/lanes/d/p3-layout-v2/` (`DECISIONS:524` N1, the carried note), `rebuild/lanes/c/p3-today-hotfix/` (the S1 cell of `DECISIONS:535`), `rebuild/lanes/c/ui-port/` (C-UI-1's cells and D.2's fence), `rebuild/lanes/c/passphrase-normalize/` **if** that lane has a cell directory | without a root, `CHILD-ARGV-TARGET` refuses the declared child and the Y1 own-child obligation is unreachable, not merely unmet (`:405` note) |
| 4 | NONE of the new roots is added to `PUBLIC_TAIL_ROOTS` (`:483`) except `rebuild/lanes/c/ui-port/`, whose suites render fixtures and touch no owner data | a child root says a suite may be EXECUTED; that list says its output may be PRINTED (`S8-PREP-AUTHOR-REPORT.md:70`) |
| 5 | The six `s9-supersede-*` / `s9-engine-files-differential` cells under `rebuild/m4/workout/test/`, each a BYTE-EXACT copy of its `s8-*` sibling plus the mechanical substitution set: package `M2-S8-REAL-SHAPE`/`S8`/`s8-` -> `M2-S9-UI-PINS`/`S9`/`s9-`; parent `M2-S7-PORT-ADMISSION` -> `M2-S8-REAL-SHAPE`; parent token line `DECISIONS:514` -> `DECISIONS:527`; spec `packages/S8.json` -> `packages/S9.json`; generation SIXTH -> SEVENTH | the shape `S8-PREP-AUTHOR-REPORT.md:83-99` names. No assertion, threshold, regex, red control or mutation control changes in any of the six |
| 6 | F6 / F7 in `tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs`: F6 takes `IDS` of thirteen, `NO_REGISTER_IDS` of nine and **`PRODUCT_ROLES` of six** by literal and by `deepEqual`; F7 takes `CHILD_ROOTS` of its new length in the whole-list literal AND in the `slice(8)` literal, title moved with it | `S8-PREP-AUTHOR-REPORT.md:73-76` |
| 7 | The runner sha is re-pinned in `packages/H3.json`, `S3`, `S4`, `S5`, `S6`, `S7`, **`S8`**, one byte range each, `tooling.runnerSha256` only; neither spec's own product pin for the runner is re-targeted | `S8-PREP-AUTHOR-REPORT.md:113-116`; S8 joins the list because S8 is now an ancestor |
| 8 | `packages/S8.json` gains role `superseded-by-child` where S9 supersedes its execution pins; `packages/S9.json` is S8's child by the artifact sha256 `3b1b8b91...`? **NO** - by the ARTIFACT sha `acceptance-s8-real-shape.json`, which must be re-measured from Git, not copied from a report. The receipt sha `3b1b8b91dd5a6ff049dffd721ec723b9fe550b0b71ba78e37574cfc96210d409` (`DECISIONS:529`) is the RECEIPT, not the artifact | `S8.json`'s own parent block cites the S7 ARTIFACT `350f5688...` (`DECISIONS:527`). Copying the wrong one is the single most likely error in this round |
| 9 | Every pre/post in `packages/S9.json` measured FROM GIT at the declared `sourceBase`, never copied from a report | `S8-PREP-AUTHOR-REPORT.md:117` ("MEASURED, never guessed and never copied from a report") |
| 10 | The standing CI step becomes `node rebuild/lanes/b/tooling/b-package.cjs --ci --package S9`, named INSIDE S9's own post before `proposed()` (rule (a), `VERDICT-S6.md`, `DECISIONS:498`), and the step NAME moves with it | `S8-PREP-AUTHOR-REPORT.md:105-108`; `rebuild.yml:149-150` today |
| 11 | The revision cells read the SEALING WINDOW (rule (b)): S8's receipt `3b1b8b91...` stands while `receipts/S9.json` is absent | `DECISIONS:523` ("the revision cells reading the sealing window") |
| 12 | The five `CHILD_SPECS` cells (`measure/test/boundary.test.mjs:117`, `today/test/food.test.mjs:827`, `machine-settings-ui.test.mjs`, `problem.test.mjs:1604`, `setup.test.mjs`) gain `'S9'` as the youngest, +12/-1 each in the S8 comment's shape | `S8-PREP-AUTHOR-REPORT.md:100-105` |
| 13 | H1 to H13 **and H17** of section B.5, the release mechanism itself, plus the new `tooling/test/release-from-seal.test.cjs` (twelve red-first cells now, including the grandparent cell) added to `TOOLING_FILES` (`:355`) in the same hunk | section B |
| 14 | The D.2 fence cell and its `rebuild.yml` step, reading the inventory **out of Git at `CHAIN_REF`** | section D |
| 15 | The `released` block appears in `rebuild/m4/spec/acceptance-s9-ui-pins.json` with both paths, each with `role: "released"`, `lastSealedSha256`, `sealedBy: "M2-S8-REAL-SHAPE"` and the token line's sha256 | section B.4 |
| **16** | **H18**: `today/test/package.test.cjs` declared `role: "edited"` with a real post, carrying the 26-entry `REQUIRED_INPUTS` literal for `rebuild/m3/w7-preview/today/**` (26 of 48, not of 51: A.4, R2 N6); its execution pin moves with it | A.4, R1 BLOCKING-3, PM-R2 |
| **17** | **SIX paths declared `role: "pinned-unchanged"`, `pre === post`, and `design.cjs` is NOT one of them (PM-R6, changed from v2).** Four for the design of record: `rebuild/m1/approved-2026-09-08/Earned-refinement-A.html`, `.../Earned-additions-C-approved.html`, `.../ADDITIONS-C-APPROVED-HANDOFF.md`, `rebuild/m1/MOCK.md`. Two for the writers that stand outside the seal (PM-R3): `rebuild/m3/w7-preview/today/gym-model.mjs` and `.../checkin-app.mjs`. This adds `rebuild/m1/` to the sealed inventory for the first time, so the S9 brief must say so by name | C.5 and A.5; R1 BLOCKING-4, R2 BLOCKING-B, PM-R3, PM-R6 |
| **18** | **H19 and H19b, REBUILT in v4**: the two pack cells under `rebuild/lanes/c/ui-port/`, **`pack-pin.test.mjs`** (the WHOLE pack, `README.md` and `quality/**` included, a literal sorted `(path, sha256)` list read against the WORKING TREE, measured at the S9 head by the procedure in C.5.1 and **never copied from this document**) and **`approved-pin.test.mjs`** (whatever `design.APPROVED` names at the S9 head, parametrically), both declared `role: "new"`, with their `rebuild.yml` step beside the fence's. **`copy-bind.test.mjs` is WITHDRAWN** | C.5.1, C.5.3, PM-R6'(i) and PM-R6'(ii) |
| **19** | `rebuild/m3/w7-preview/today/today-model.cjs` is **NOT declared by this spec** and is carried OUT LOUD in the brief as a named exception until TODAY-SPLIT seals its writer; `browser-check.mjs` is **NOT declared and has NO CI home**, run on the PC before each seal and recorded in the VERDICT | A.5, PM-R3 |
| **20** | **S9-TODAY-CARRY's FOUR declarations, named (PM-R11, R3 N8).** `DECISIONS:542` (D) measured them after v2 was written and said "FOUR, not the three the ticket named": **`rebuild/m3/w7-preview/today/today-app.cjs`** (role `edited`, the one binding line at `:869`), **`rebuild/m3/w7-preview/today/test/view.test.mjs`** (`edited`, product AND execution pin), **`rebuild/m3/w7-preview/today/test/adapter.test.mjs`** (`edited`, product AND execution pin) and **`.github/workflows/rebuild.yml`** (`edited`, product pin; the two lane C cells get their CI home in it). I confirmed all four seal statuses by parsing the S8 artifact, and confirmed at `c26081ad` that the lane's other moved files (`design.cjs`, `today-model.cjs`, `rebuild/lanes/c/s9-today-carry/plan-sentence.test.mjs`, `rebuild/lanes/c/p3-today-hotfix/today-headline.test.mjs`, the three reports) are in NEITHER S8 map and are therefore not declarations. **`today-app.cjs` is one of the four, which is why A.2.1 says its `edited` role is true whatever TODAY-SPLIT does** | `DECISIONS:542` (D); the branch at `c26081ad` |
| **21** | **PASSPHRASE-NORMALIZE's declarations, named (PM-R11).** `DECISIONS:543` (B) states them: **`rebuild/m3/w6/local/import-bundle.mjs`** (`edited`, product pin), **`rebuild/m3/w7-preview/import/import-screen.mjs`** (`edited`, product pin), **`rebuild/m3/w7-preview/import/test/page-bundle.test.mjs`** (`edited`, product AND execution pin, its two measured module counts re-measured 142 to 143 and 20 to 21 with the reason beside them, which both reviewers and the PM decline to overrule); **`rebuild/m3/setup/port/passphrase.cjs` role `new` and SEALED** (it decides key material on the phone); **the three lane cells** `rebuild/lanes/c/passphrase-normalize/{helper,route,unlock-forms}.test.mjs` with a CI STEP and a CHILD ROOT (R2 of that lane: the step is the guard that keeps every sealed bundle valid, not a convenience). I confirmed the four seal statuses by parsing the S8 artifact and the three cell names at `ba04c07f` | `DECISIONS:543` (B) |
| **22** | **S9 gives `rebuild/m3/w6/test/local-import.test.mjs` a CI HOME** (`DECISIONS:543` (B), raised three times). Measured: the file exists at the chain tip and `rebuild.yml` names it **zero** times, so it pins the phone's five seal constants against the PC's and runs in no workflow. Its root `rebuild/m3/w6/test/` is **already** in `CHILD_ROOTS` (`b-package.cjs:405`), so this costs a `rebuild.yml` step and a declared child and no `CHILD_ROOTS` hunk | `DECISIONS:543` (B); `rebuild.yml`, `b-package.cjs:405` |

### E.1 What S9 carries besides the release (context, not this round's build)

C-UI-1 from `rebuild/c-ui-port`; the Today carry lane `rebuild/c-s9-today-carry` (the S2 sentence
fix, the hotfix cell's CI home, the `adapter.test.mjs` identity lines, `DECISIONS:535`); the
passphrase normalisation lane `rebuild/c-passphrase-normalize` (import path, stays SEALED); the
`rebuild/lanes/d/p3-layout-v2` root and its two cells (`layout-v2.test.mjs`,
`projector-parity.test.mjs`, `DECISIONS:524` N1); and this release.

**Both carried lanes are now FABLE FINAL ACCEPT and both have their declaration lists measured, so
E.1 is no longer context only (PM-R11).** S9-TODAY-CARRY is accepted at `DECISIONS:542` (D) and its
four declarations are **E fact 20**; PASSPHRASE-NORMALIZE is accepted at `DECISIONS:543` (B) and its
declarations are **E fact 21**, with the `local-import.test.mjs` CI home at **E fact 22**. That is
eleven more declared paths, three more lane cells, two more `rebuild.yml` steps and one more child
root than v3's E carried, and all of them are MEASURED facts rather than reservations. **What they
do NOT change: the closed list is still two, the mechanism is still H1 to H13 plus H17, and no
carried lane touches the release.** `today-app.cjs` appears in fact 20 as an `edited` declaration,
which is the ordinary reseal-child treatment and not a release.

**TODAY-SPLIT is NOT in this list.** Under `DECISIONS:543` (A) its carrier is S10. S9 carries
neither its spec nor its build, and A.2.1 is the whole of what S9 says about it.

### E.2 THE ORDER OF WORK, so S9 preparation starts NOW

C-UI-1 is not PR-READY (`DECISIONS:531` blocks its seal until the gates are fixed and re-audited).
Preparation does not have to wait, because **nothing in the release depends on C-UI-1's bytes**: the
release names paths, not contents.

**And the generator changes the order as well as the cost (PM-R9).** `rebuild/b-seal-gen` is pushed
(`5bad0dc8`) and I read `rebuild/lanes/b/tooling/gen/README.md` in the farm. It generates facts 1 to
9 and 12 of section E, measures every `pre`/`post` from a git blob, measures the needles by running
each child, and drafts the token lines with their sha256s; its replay proof reports **791 of 800
mechanical facts identical to the committed S8 preparation, 4 of 15 generated files byte-identical,
in 21 seconds**. It already reads this spec's `released` role: `new-child.cjs --released <path>`
declares the role, takes `pre` from the parent's own post and `post: null`, puts the ruling line in
`TODO.md`, and refuses to propose the role on its own. **So the mechanical half of the round is no
longer hand work, and the hand work moves to the front.** F.3 restates the estimate on that basis.

| phase | work | depends on C-UI-1? |
|---|---|---|
| **NOW, day 1** | this spec accepted; the PM writes the `RELEASE-FROM-SEAL` token line (B.2) and the THEME line for `M2-S9-UI-PINS` | no |
| **NOW, day 1** | run `new-child.cjs` for S9 with `--released` for the two paths, into a scratch `--out` folder, and READ its `TODO.md` before any hand work starts. It has no `--write`, so this is a proposal to review, not a change | no |
| **NOW, day 1-2** | runner hunks H1 to H13 **and H17** (section B.5), red first, with `release-from-seal.test.cjs` failing on today's runner before any hunk lands. **H17 and its grandparent cell (11) are written in the SAME sitting as H10**, because H10 is what creates the hole H17 closes | no |
| **NOW, day 1-2** | the D.2 fence cell, red first, **starting with red-first row (6)** (the worktree-artifact tamper), and its `rebuild.yml` step drafted | no |
| **NOW, day 1-2** | **H18**: the 26-entry `REQUIRED_INPUTS` literal in `today/test/package.test.cjs`, red first by deleting one entry from `build.mjs` and watching every existing cell stay green | no |
| **NOW, day 1-2** | **H19 and H19b, THE CODE ONLY, red first** (v4, R3 BLOCKING-F): `pack-pin.test.mjs`'s walk, its anchored ignore list, its three path-naming refusals and its six red-first rows against a THROWAWAY FIXTURE pack; `approved-pin.test.mjs`'s run-time read of `design.APPROVED` and its three refusals. **None of this needs the real pack or the real literal** | no |
| **WAIT** | **H19's and H19b's LITERALS**, and E fact 17's re-decided path list. The pack literal is measured at the S9 head after C-UI-0's second teeth audit and C-UI-1's seal (`DECISIONS:531`); APPROVED-PIN's literals need lane C-UI's answer to OQ-2 first. **v3 put this in the day 1-2 column and R3 BLOCKING-F was right to refuse that** | **yes** |
| **WAIT** | the `design.test.cjs` hunks, **if** C-UI-1 moves `design.APPROVED` to the 09-18 pack: `:17`'s `approved.length === 2`, `:25` and `:26`'s two filename regexes, and `:184`'s handoff-line-9 bind. It may be zero hunks or three, and it is a SEALED cell either way (C.5.3 step 4, F.2 STOP-10) | **yes** |
| **NOW, day 2** | the SIX `pinned-unchanged` declarations of E fact 17 (four design-of-record files, `gym-model.mjs`, `checkin-app.mjs`). They are pins measured from Git; no code. **The generator measures them** | no |
| **NOW, day 2, mostly GENERATED** | facts 1 to 7 and 12 of E (IDS, NO_REGISTER_IDS, CHILD_ROOTS, the six `s9-*` cells, F6/F7, the ancestor re-pins, the five `CHILD_SPECS` cells). All are name-for-name mirrors of S8 and depend on nothing lane C does. **What stays hand work here is the reading: every mirrored ordinal (the generator does not shift them, by design), the product story inside a mirrored comment, and which candidate paths are declared** | no |
| **NOW, day 2** | `boundary.test.mjs`: delete `:188-:189` only, keep the loop and `:186-:187` (C.2, PM-R7), red first | no |
| **NOW, day 2** | **the CARRIED LANES' declarations, E facts 20, 21 and 22** (S9-TODAY-CARRY's four; PASSPHRASE-NORMALIZE's four plus three lane cells, a CI step and a child root; `local-import.test.mjs`'s CI home). Both lanes are FABLE FINAL ACCEPT and their branches are pushed at `c26081ad` and `ba04c07f`, so every path is measurable today | no |
| ~~WHEN TODAY-SPLIT IS ACCEPTED~~ | **ROW DELETED in v4 (PM-R10).** `DECISIONS:543` (A) makes **S10** TODAY-SPLIT's carrier, so there is no S9 column for it at all. What replaced this row is A.2.1.2, which is a list of things S9 must NOT do rather than a list of things it might have to | - |
| **NOW, day 2-3** | the S9 brief `rebuild/lanes/b/S9-UI-PINS-BRIEF.md` written with every declaration list EXCEPT the C-UI-1 file set; one independent review of the mechanism and of the closed list | no |
| **WAIT** | `packages/S9.json`'s `product` map: the pre/post of every file C-UI-1 moves, and the needle table (each needle MEASURED by running each child) | **yes** |
| **WAIT** | the `--ci --package S9` walk to its predicted refusal, and the artifact through `proposed()` | yes, it hashes the C-UI-1 bytes |
| **ONE RE-MEASURE when C-UI-1 lands** | re-measure every pre/post from Git, re-measure the needles, re-take the spec sha256, re-take the brief sha256, re-run `--ci` | this is the single re-measure the round is designed around |

The re-measure is mechanical (it moves hashes, not design) and is the reason the mechanism work can
be reviewed before C-UI-1 exists: an independent reviewer can judge H1 to H13, H17, H18, the token
grammar, the closed list and the fence against the runner as it stands today, and none of those
judgements changes when C-UI-1's bytes arrive.

---

## F. RISKS, STOP CONDITIONS, ESTIMATE, OPEN QUESTIONS

### F.1 Risks

| # | risk | how it shows | mitigation in this design |
|---|---|---|---|
| R1 | the release buys almost nothing, because six of seven remaining tickets still touch `today-app.cjs` | C-UI-2 opens a PR, `--ci --package S9` refuses `UNLISTED-PRODUCT-DRIFT`, the ticket needs S10 | A.2.1 names the split and TODAY-SPLIT is its own reviewed lane (PM-R1); F's TOLD-1 tells the owner what the release frees and what it does not (PM-R8) |
| R2 | a released path re-enters `executionPins` through a child argv target | `proposed()` `:2800` silently re-pins it; the next child inherits it and nobody notices for a generation | B.6 makes it an assertion in H9's neighbourhood; cell (8) of `release-from-seal.test.cjs` is red-first for it |
| R3 | the byte-identity `--full` re-verify voids for ever | `SEALED-RUN-RECEIPT-VOID rebuild/m3/w7-preview/today/preview.css` on every authorized rerun after lane C's first stylesheet edit; every rerun becomes a FULL run with the private census | H12 and H13; cell (10) is red-first for it. **If this is missed, the seal chain silently loses its cheap re-verify step** |
| R4 | the new tooling cell is not added to `TOOLING_FILES` (`:355`) | `fidelity()` `:2011` calls it `UNLISTED-SOURCE-CHANGE` on the first `--ci` run | said in B.8; it is one line and it is the easiest to forget |
| R5 | the artifact recomputation `:3021` refuses because `proposed()` and the hand-written artifact disagree about the `released` block's key order or shape | `SEALED-PROFILE-RECOMPUTATION` | the artifact is never hand-written; it is `proposed()`'s output |
| R6 | fact 8: the S8 RECEIPT sha (`3b1b8b91...`, `DECISIONS:529`) is cited where the S8 ARTIFACT sha belongs | the parent block is wrong and `parent()` refuses late, after a long run | fact 8 names the trap; the artifact sha must be re-measured from Git in the round, never copied |
| R7 | `browser-check.mjs` is stale-red and unrun (`DECISIONS:535`), so `headlineVocabulary` has no browser-side enforcement | a copy regression reaches the phone and only `copy.test.mjs`'s jsdom render catches it | **PM-R3 rules it and does not close it**: no CI home, run on the PC before each seal, recorded in the VERDICT. The risk stands and is now named where the owner's verdict will see it |
| R8 | timing flake on an 8-core PC shared with other lanes and the design chat | a suite that is green twice and red once | ONE re-run, reported as such. Never "fixed" by loosening anything |
| **R9** (v2) | H17 is built but its skip is written too WIDE (for example keyed on the file name, or on any artifact found on disk rather than the ones `pins()` reads) | nothing shows. The chain stays green and a grandparent pin stops being asserted for a path nobody released | cell (11)'s second half: in the same fixture, a DIFFERENT grandparent pin whose bytes moved must still refuse. A widened skip turns that cell red |
| **R10** (v2) | the fence is built to read the artifact from the worktree after all, because it is easier | the fence passes on exactly the branch it exists to stop | D.2 red-first row (6) is written FIRST, before the fence has a happy path at all |
| **R11** (v2, CLOSED for the DESIGN half by PM-R6'(i), and OPEN for the COPY half by PM-R6'(ii)) | the design-of-record hole is recorded and then forgotten | the new look lands, a reference HTML and `design.cjs` move together, and nobody notices for a generation | **DESIGN half: retired.** PACK-PIN over the WHOLE pack, APPROVED-PIN over whatever `design.APPROVED` names, and the four `pinned-unchanged` declarations. **COPY half: NOT retired, and v3 wrongly said it was.** It is carried as a named precondition of S10 in C.6, with seven questions the design must answer, and it is the one place this document tells the owner that something is still open (TOLD-3) |
| **R12** (v3, **REPOINTED in v4**) | **APPROVED-PIN** is written against a fixed path instead of against `design.APPROVED`, so C-UI-1 moving the pins silently takes the cell out of the loop | the cell stays green over two files nothing points at any more | C.5.3: the cell reads `design.APPROVED` for the file list on every run and never caches it, the same rule as `CHAIN_REF` at `:1201`, and FAILS `APPROVED-PIN LIST-EMPTY` rather than passing on an empty list |
| **R13** (v3, **NO LONGER A CELL RISK**) | C-UI-1 moves `design.APPROVED` to the 09-18 pack and **64 of the 99 approved-derived strings stop occurring in the corpus** (C.5.2's measurement) | under v3 a cell would have gone red; under v4 there is no such cell, so the risk is that the fact is simply LOST | **PM-R12 has sent it to lane C-UI as OQ-2**, and C.5.3 step 5 makes the answer an input the S9 integrator must hold before the re-measure. It is measured HERE, before C-UI-1 is written, and named in the brief |
| **R15** (v4) | **PACK-PIN's literal is copied out of this document instead of measured at the S9 head** | the cell is green against a pack that no longer exists, or red on its first run against the real one, and either way the number in the sealed cell is a number nobody took | C.5.1 publishes a PROCEDURE and no value, says in terms that v3's `6121aa91...` is superseded and must not be used, and E fact 9's rule ("measured from Git, never copied from a report") is applied to it by name. The generator measures it (F.3) |
| **R16** (v4) | **PACK-PIN reads `.gitignore` to decide what to skip** | a lane C branch widens `.gitignore` and files leave the pin with no refusal. `.gitignore` is in NEITHER S8 map (measured), so nothing would notice | C.5.1: the cell holds its OWN anchored ignore list, inside a cell S9 declares `role: "new"`, so widening it is a sealed byte `product()` `:1970`/`:1972` refuses |
| **R17** (v4) | **the whole-pack pin is built and then quietly narrowed** the first time C-UI-0 needs to re-baseline a screen | the gates go back outside the thing that guards them, which is the hole PM-R6'(i) reversed | F.2 STOP-9 as rewritten: a narrowing is a PM decision on the record, not an author's convenience, and the round stops and says so |
| **R18** (v4) | **S10 releases `today-app.cjs` and nobody re-homes `boundary.test.mjs` P-MEASURE (g)** | the first lane C edit after the release turns a SEALED cell red at `:137-:139`, for a file no spec declares a post for; it reads as a mystery failure two packages downstream | A.2.1.1 names the cell, the lines and the fix, and A.2.1.2 makes "C.2's general rule stated as a rule" one of the things S9 must leave in place. **This is the single most useful thing round 4 tells the PM** |
| **R14** (v3) | the SEAL-AUTOMATION generator produces a fact that is one generation stale (a mirrored ordinal, a parent's product story) and it is committed unread | a comment in the sealed package tells the PARENT's story, and the reviewer believes it | the generator's own `TODO.md` lists every one of them on every run, and F.3's estimate keeps the reading hours rather than the typing hours. The generator has no `--write` |

### F.2 STOP conditions (the round stops and reports rather than proceeding)

1. The `RELEASE-FROM-SEAL` token line does not exist on `rebuild/t2-client-core`, or hashes to more
   than one line, or does not end in ` RULED`. No release without it; `DECISIONS:536` (2) requires it.
2. **AMENDED IN v2 and RATIFIED BY THE PM IN v3 (PM-R7). The amendment is now a ruling, not an
   author's judgement, and Q8 is closed.** Narrowed rather than loosened (R1 BLOCKING-1). Any hunk would
   have to touch `held()` (`:1828-:1833`), the drift assert (`:1972`) or the completeness walk
   (`:1975`) to make the release work. Those three are the seal; if the design needs them moved, the
   design is wrong and the PM hears that instead. **`pins()` (`:1834`) is admitted for H17 and for
   H17 only:** ONE `continue` at `:1852`, in the grandparent walk, keyed on a path that appears in
   an ancestor artifact's `released` block, which only a RULED PM token line can put there. No
   assertion inside `held()` changes, the parent walk `:1837-:1839` is untouched, and every
   grandparent pin not named in a `released` block still gets `:1830` and `:1831`. **One further
   change inside `pins()` is admitted and it asserts nothing: the terminal `say` at `:1855-:1858`
   gains a clause naming how many grandparent pins the skip stood aside for (R2 N2), because a
   count that moves in silence is the thing this document refuses everywhere else. Any OTHER change
   to `pins()` stops the round.** v1's STOP-2 as written would have stopped this spec by its
   own rule; saying so in the amendment is the point of amending it by name rather than quietly.
3. `--ci --package S9` refuses for a reason the brief did not predict. That is a finding, not a fix.
4. A cell over a released file cannot be re-homed honestly (C.2). Then the file is not released and
   the closed list shrinks.
5. **(REWRITTEN in v3 by PM-R8, which decided it.)** TODAY-SPLIT is rejected or shelved AND the
   about-one-week figure is still held out. Those two are incompatible and the PM is told so in one
   sentence: the figure assumed a split nobody had measured, and without the split six of the seven
   remaining look tickets each ride a reseal child. This is no longer an owner question; it is a
   sentence the PM owes whoever quotes the figure next.
6. **(v2)** H18 cannot be written so that it goes red on a deleted `REQUIRED_INPUTS` entry, or the
   PM drops it. Then `build.mjs` leaves the closed list, the list is one path, and the token line is
   rewritten before it is ever written. The release does not ship with a law whose only guard is the
   released file itself.
7. **(v2)** The fence cannot read the sealed artifact out of Git at `CHAIN_REF` on a GitHub runner
   (for example the checkout leaves no `refs/remotes/origin/...`). Then the fence is not shipped as
   a passing cell: it either fails loudly with `FENCE-CHAIN-REF-ABSENT`, which is the designed
   behaviour, or the round reports that the fence cannot be built honestly and the PM decides. A
   fence that reads the branch it is fencing is worse than no fence, because it reads as one.
8. **(v3, PM-R4)** The D.2 skip cannot be derived from the chain on a GitHub runner, so the only
   way to ship the fence is with a branch-declared skip. Then the fence is not shipped with a skip
   at all: a reseal child's own CI run is allowed to fail the fence and the PM reads the failure,
   which is honest, rather than a gate any branch can open.
9. **(v3, REWRITTEN in v4 by PM-R6'(i) and PM-R6'(ii)).** Two halves, because v3's STOP-9 bundled
   a cell that is now withdrawn with one that is now wider.
   **(a) PACK-PIN cannot be built to name the path.** If the cell cannot be made to fail with
   `PACK-PIN MISMATCH <path>`, `PACK-PIN MISSING <path>` and `PACK-PIN ADDED <path>` on the six
   red-first rows of B.8, it is not shipped, and the S9 verdict says in one sentence that the design
   of record remains a convention. A single composite value that can only say "different" is NOT an
   acceptable fallback: that is exactly what R3 N5 refused.
   **(b) THE WHOLE PACK CANNOT BE PINNED, and somebody proposes narrowing it.** If it turns out that
   C-UI-0 or C-UI-1 must keep moving `quality/**` after the literal is taken, **the round STOPS and
   the PM decides**, on the record, whether to narrow the pin or to re-sequence the tickets.
   **An author may not re-introduce v3's exclusion**, because PM-R6'(i) reversed it for a stated
   reason (the gates are the acceptance of every look ticket after S9, so they must not be editable
   by the ticket they judge) and that reason does not weaken because the pin is inconvenient.
   `DECISIONS:531` already sequences it so this should not arise.
10. **(v4, PM-R6'(i) second half and R3 BLOCKING-F)** On the day C-UI-1 seals inside this package,
    `design.APPROVED` has moved and `design.test.cjs` must be edited to follow it (`:17`'s
    `approved.length === 2`, `:25` and `:26`'s two filename regexes, `:184`'s handoff-line-9 bind),
    **and that edit cannot be made honestly** - for example because the 09-18 pack has no file that
    answers to `approved[1]`, or because the handoff line pins a sha that no longer exists. Then S9
    does NOT invent a substitute: the round reports that C-UI-1 cannot seal inside this package as
    specified, and the PM decides whether C-UI-1 moves to S10 or the pins move in two steps. **A
    sealed cell edited to make a red go away is the one thing this document exists to prevent.**
11. **(v4, PM-R6'(ii))** Anyone proposes to ship S9 with a sentence saying the copy locks are now
    real. They are not, C.5.2 measures exactly how they are not, and C.6 is the precondition that
    closes them. The round stops and the sentence is struck. This has now been claimed and withdrawn
    twice, in v2 and in v3, which is why it is a STOP and not a note.

### F.3 Estimate for the S9 PREPARATION round (lane B, one author, one independent review, one fix round)

**RESTATED IN v3 ON PM-R9's TERMS: assuming the SEAL-AUTOMATION generator (`rebuild/b-seal-gen`,
`5bad0dc8`) produces the S8-mirror facts, the ancestor re-pins, the needles and the token line
sha256s.** I synced that branch into the farm and read
`rebuild/lanes/b/tooling/gen/README.md`; it is pushed and its replay proof is stated there
(791 of 800 mechanical facts, 4 of 15 files byte-identical, 21 seconds). I did not run it.

| work | v2 hours | v3 hours with the generator | why |
|---|---|---|---|
| H1 to H13 runner hunks, red first | 4 | **4** | judgement, not mirroring. Unchanged |
| H17, the grandparent skip, with `releasedAncestry()` | 1 | **1** | unchanged |
| H17's say clause at `:1855-:1858` (R2 N2) | - | **0** | one line inside the same hunk |
| `release-from-seal.test.cjs` (12 red-first cells) | 4 | **4** | unchanged |
| H18, the 26-entry `REQUIRED_INPUTS` literal | 1 | **1** | unchanged |
| the D.2 fence cell + its `rebuild.yml` step | 4 | **4** | unchanged |
| **D.2's chain-derived reseal-child skip and red-first row (8)** (v3, PM-R4) | - | **+1** | five conditions and five sub-rows |
| D.2's `--name-status` fix and the two clauses R3 N4 asked for | - | **0** | three sentences inside the same hunk |
| **H19: `pack-pin.test.mjs`, the CODE** (v4, PM-R6'(i)) | 1 | **+2** | a working-tree walk, an anchored ignore list, three path-naming refusals, six red-first rows against a fixture pack. It is more than v3's cell because it must name the path, and it is not more than 2 because the walk is twenty lines |
| **H19's LITERAL, about 904 lines** (v4) | - | **+0.5, and it moves to the RE-MEASURE** | **GENERATED**: it is exactly the generator's row e (`pre`/`post` from a git blob) applied to a directory instead of a file, and the 0.5 is reading the diff when it is re-taken |
| **H19b: `approved-pin.test.mjs`** (v4, PM-R6'(i) second half) | - | **+1** | parametric, three refusals, one red-first pair |
| ~~`copy-bind.test.mjs`~~ (v3) | 1 | **-1, REMOVED** | **WITHDRAWN by PM-R6'(ii).** v3 costed it at 1 hour inside the H19 row and R3 added an hour for a literal corpus; v4 spends neither, because the cell is not built |
| **C.6, the S10 precondition** (v4, PM-R6'(ii)) | - | **+1** | it is document work: the corpus measurement, the seven questions and the direction. No code |
| the SIX `pinned-unchanged` declarations (E fact 17) | (in the 1 above) | **0** | **GENERATED** (README row e: every `pre`/`post` from a git blob) |
| facts 1 to 7 and 12 (IDS, NO_REGISTER_IDS, CHILD_ROOTS, six `s9-*` mirrors, F6/F7, seven ancestor re-pins, five `CHILD_SPECS` cells) | 4 | **1** | **GENERATED** (README rows a, b, c, d, f). The 1 hour left is READING: every mirrored ordinal, the product story in each mirrored comment, and the `TODO.md` |
| `boundary.test.mjs` `:188-:189` deletion (C.2, PM-R7) | 1 | **0.5** | two lines now, not a loop |
| `packages/S9.json` + needle table | 5 | **1.5** | **GENERATED** (rows e and g: the needles are MEASURED by running each child). The 1.5 is reading the diff and the `TODO.md`, and deciding which candidate paths are declared, which the generator refuses to decide |
| `S9-UI-PINS-BRIEF.md` + the three token line texts with their sha256 | 3 | **2.5** | **the sha256s are GENERATED** (row i), the THEME sentence and the brief are not (README, "What stays human, always") |
| `--ci --package S9` to its predicted refusal, plus the author report | 3 | **3** | unchanged |
| independent review + one fix round | 6 | **6** | unchanged, and not for trade |
| the carried lanes' declarations, E facts 20, 21 and 22 (eleven paths, three cells, two CI steps, one child root) | - | **+1** | **GENERATED for the pins** (row e); the 1 hour is reading two accepted lanes' hunk lists and deciding nothing |
| the re-measure when C-UI-1 lands | 2 | **0.5** | **GENERATED**: the re-measure is exactly rows e, f and g run again |
| **total** | **39** | **v3 said 32. v4 says 37.5 hours, about 4.5 to 5 working days of lane B time** | |

**PM-R13, the estimate restated without COPY-BIND and with the whole-pack pin.** The arithmetic,
stated so the PM can see exactly which way each item moved:

| | hours |
|---|---|
| v3's total | 32.0 |
| minus `copy-bind.test.mjs` | -1.0 |
| minus the hour R3 would have added to it for a literal corpus | (never spent) |
| plus PACK-PIN's code, widened to name the path over the whole pack | +2.0 |
| plus PACK-PIN's literal, generated, read at the re-measure | +0.5 |
| plus APPROVED-PIN | +1.0 |
| plus C.6, document work | +1.0 |
| plus the carried lanes' declarations, E facts 20 to 22 | +1.0 |
| plus D.2's `--name-status` and R3 N4's two clauses | 0.0 |
| **v4 total** | **37.5** |

**The cost of PM-R6' is +4.5 hours net, and what it buys is stated rather than assumed:** the gate
code and 844 baselines that judge every post-S9 look ticket come inside the pin; a mismatch names
the path instead of saying "different"; the cell reads a tree it can actually reach on a runner;
and the copy lock stops being claimed and starts being scheduled. **The 37.5 is still less than v2's
39 without the generator**, and the generator still takes the same 7 hours of typing.

**What the SEAL GENERATOR does and does not take, re-stated for the two new cells (PM-R9 and
PM-R13).** `rebuild/b-seal-gen` is at `5bad0dc8`; I read `gen/README.md` in the farm and did not run
it. It measures every `pre`/`post` from a git blob (row e), which is exactly what PACK-PIN's literal
is, one directory at a time - **so the 904-line literal is generated, not typed**. It does NOT write
a cell, does not decide an ignore list, and has no `--write`. **The hand work in H19 and H19b is
the code and the red-first rows; the numbers are the generator's.**

**What remains hand work, in one list:** the runner hunks and their cells (H1 to H13, H17, H18,
H19, H19b, the fence); the reading of every generated ordinal and mirrored comment; the decision
about which candidate paths are declared; the brief and the THEME sentence; the `--ci` walk and the
author report; and the independent review. That is 30.5 of the 37.5, and the 7 the generator takes
are the 7 that were typing.

#### PM-R13: WHAT S9 PREPARATION CAN START TODAY, HUNK BY HUNK, WITHOUT WAITING FOR ROUND 4's REVIEW

**R1, R2 and R3 all accept sections B and D. Saying so explicitly is the point of this list, so the
PM can dispatch this half now and let the review argue only about C.** R3's own words: "the release
mechanism itself (H1 to H13, H17, the token grammar, the artifact `released` block, the receipt
skip, STOP-2 as amended) is now, in my reading, correct and I could not break it. H18 is right. The
fence's chain-derived skip is a real fix." R3's section 7 lists what it "would not re-litigate" and
it includes H1 to H13, H17, H18, the token grammar and its six binding steps, the artifact
`released` block, C.2 as PM-R7 ratified it, the fence's chain-ref read and its chain-derived skip,
D.4, the six `pinned-unchanged` declarations, TOLD-1 and TOLD-2. **v4 changes none of those.**

| hunk or piece | accepted by | can start today? | what v4 changed in it |
|---|---|---|---|
| **H1** `PRODUCT_ROLES` + `'released'` | R1, R2, R3 | **YES** | nothing |
| **H2** `RELEASE_GRANT` + `RELEASE_GRANT_SHAPE` | R1, R2, R3 (R3 re-read the regex and the token line and found them byte-identical to v2) | **YES** | nothing |
| **H3** `releaseRuling(s)`, B.2 steps 1 to 6 | R1, R2, R3 | **YES** | nothing |
| **H4, H5** `spec()` role rule and key closure | R1, R2, R3 | **YES** | nothing |
| **H6** `product()` `:1894` | R1, R2, R3 | **YES** | nothing |
| **H7** the single placement above `:1952`, plus `at.released` at `:1888` | R2 N3 asked for it, R3 re-derived it at the line and called it exact | **YES** | nothing |
| **H8** the `product()` say at `:1983-:1987` | R2 N4, R3 confirmed | **YES** | nothing |
| **H9** released set equals `releaseRuling().granted` | R1, R2, R3 | **YES** | **one clarification, not a change**: A.2.1.2 requires it to be an ASSERTION and never an enumerated list, so S10 can point it at `today-app.cjs` |
| **H10, H11** `proposed()`'s `released` block and `ARTIFACT_KEYS` | R1, R2, R3 (R3 checked the block, the literal role and the argument are unchanged from v2) | **YES** | nothing |
| **H12, H13** the receipt skip and its count | R1 N3, R2, R3 | **YES** | nothing |
| **H17** the grandparent skip and its say clause | R1 BLOCKING-1, R2, R3 ("I re-derived the whole of `pins()` and B.3's S10 trace is exactly what the code does") | **YES** | nothing |
| **H18** the 26-entry `REQUIRED_INPUTS` literal | R1 BLOCKING-3, PM-R2, R2 N6, R3 | **YES** | **one clarification**: A.2.1.2 requires it to be phrased as a bundle-input law, never a byte pin |
| `release-from-seal.test.cjs`, all twelve red-first cells | R1, R2, R3 | **YES** | nothing |
| **the D.2 fence**, its chain-ref read, its worktree-tamper row, its numeric-max rule, its five skip conditions and red-first row (8) | R1 BLOCKING-2, R2 BLOCKING-A, PM-R4, R3 | **YES** | **`--name-status` instead of `--name-only` (R3 N3)**, plus two clauses R3 N4 asked for. All three are one-line edits to the same hunk and none changes the design |
| **C.2**, deleting `boundary.test.mjs:188-:189` only | R2 N9, PM-R7, R3 | **YES** | nothing |
| **E facts 1 to 16**, the S8 mirrors, the ancestor re-pins, the `CHILD_SPECS` cells | R1, R2, R3 | **YES**, and mostly generated | nothing |
| **E fact 17**, the six `pinned-unchanged` declarations | R1 BLOCKING-4, R2 N5, R3 ("the role is right for all six") | **YES** for the two writers; **the four design-of-record paths are re-decided at the S9 head** (C.5.3 step 3) | the caveat only |
| **E facts 20, 21, 22**, the carried lanes | new in v4, from `DECISIONS:542` (D) and `:543` (B), both FABLE FINAL ACCEPT | **YES**: both branches are pushed and every path is measurable today | new |
| **H19, H19b: the CODE** | new shape in v4 | **YES** | rebuilt |
| **H19, H19b: the LITERALS** | - | **NO**, and R3 BLOCKING-F was right to refuse the schedule that said otherwise | rebuilt |
| **C.6**, the S10 precondition | new in v4 | **YES**: it is document work and it blocks nobody | new |

**So the answer to PM-R13 is: everything except the two literals and the possible
`design.test.cjs` hunks can start today.** In hours that is about **31 of the 37.5**, and the 6.5
that wait are the ones that were always going to wait for C-UI-1's bytes.

**The order, unchanged from v3 except where noted:**

1. the PM's `RELEASE-FROM-SEAL` and THEME lines (B.2). Nothing else needs them, but everything
   downstream cites them.
2. `new-child.cjs --released <the two paths>` into a scratch `--out`, and READ its `TODO.md`. It
   has no `--write`; this is a proposal, and reading it first is what keeps R14 from happening.
3. in parallel, three hand jobs that share nothing: (a) H1 to H13 and H17 with
   `release-from-seal.test.cjs`, written red first, H17 in the same sitting as H10; (b) the D.2
   fence starting with red-first rows (6) and (8), before it has a happy path; (c) H18, and
   **H19 and H19b's CODE against a throwaway fixture pack** (v4: their literals wait).
4. then the carried lanes' declarations (E facts 20 to 22), then the brief, then one independent
   review of the mechanism and the closed list, both of which can happen before C-UI-1 exists.

Nothing in 1 to 4 waits on C-UI-1, on TODAY-SPLIT or on the second teeth audit. **What DOES wait on
the second teeth audit is PACK-PIN's literal, and `DECISIONS:531` already sequences it.**

This is preparation only. It excludes the PM's token lines, the `--full` with the private census,
the receipt, the chain merge and the slice deploy, which `DECISIONS:455` costs at roughly half a day
plus one FULL on the PC.

### F.4 The PM's rulings, carried out, and what is left open

**v2 asked eight questions. The PM has answered all eight in nine rulings, so F.4 is no longer a
question list.** Each ruling, and the section that now carries it:

| ruling | what it decided | carried out in |
|---|---|---|
| **PM-R1** (Q1) | the two-path closed list is ACCEPTED for the files that exist today; `:536` is NOT re-opened for `today-app.cjs`; TODAY-SPLIT is its own lane and S9 does not wait for it | section 0 (the PM-R1 paragraph), **A.2.1**, A.6, E.2's "WHEN TODAY-SPLIT IS ACCEPTED" row |
| **PM-R2** (Q2) | `build.mjs` is released ONLY with H18 in the same package; fix the 51 (it is 48) and the five laws (they are seven) | **A.4** (the seven-law table and the 48-path count), A.6, B.5 H18, E fact 16 |
| **PM-R3** (Q3, Q4, R2 N1) | `gym-model.mjs` and `checkin-app.mjs` declared `pinned-unchanged`; `today-model.cjs` NOT declared, carried out loud until TODAY-SPLIT; `browser-check.mjs` stays outside with no CI home, run on the PC, recorded in the VERDICT | **A.5** (three rows), E facts 17 and 19, D.2's "what it is NOT" row, F.1 R7 |
| **PM-R4** (Q5, BLOCKING-A) | the fence lives under `rebuild/lanes/c/ui-port/`; its reseal-child skip is derived from the chain, `FENCE-RESEAL-CHILD-UNVERIFIED` otherwise; red-first row (8); section D REFERENCES the WRITER-FENCE | **D.2** (two rewritten rows plus row (8)), **D.4** |
| **PM-R5** (Q6) | the `released` block records no post sha | B.4 (unchanged from v2, now ratified); B.7 |
| ~~**PM-R6**~~ (Q7, OWNER-3, BLOCKING-B) | do NOT seal `design.cjs`; two sealed cells instead, PACK-PIN and COPY-BIND, both measured before being specified | **SUPERSEDED by PM-R6'(i) and PM-R6'(ii) after R3.** Its first clause (do not seal `design.cjs`) stands unchanged |
| **PM-R6'(i)** (R3 BLOCKING-F, R3 N5) | PACK-PIN reads the WORKING TREE, holds the FULL sorted `(path, sha256)` list as its literal so a mismatch names the path, covers the ENTIRE pack with `README.md` and `quality/**` INCLUDED, anchors its one exclusion at the pack root, and is measured at the S9 head; and whatever `design.APPROVED` names is pinned too, parametrically | **C.5.1** (the whole section rebuilt, with the reason, the procedure and the measured shape), **C.5.3** (APPROVED-PIN and the integrator's five steps), B.5 H19 and H19b, B.8's two rewritten rows, E fact 18, E.2's split NOW/WAIT rows, F.1 R15 to R17, F.2 STOP-9 and STOP-10 |
| **PM-R6'(ii)** (R3 BLOCKING-E) | COPY-BIND is WITHDRAWN from S9; the gap is stated as it is; the copy lock becomes a named precondition of S10 | **C.5.2** (rebuilt: the three loops that already exist, the gap in four numbered sentences, and the measurement that S9 releases no file carrying on-screen copy), **C.6** (the S10 precondition and its seven questions), B.5 H19c struck, B.8's row struck, F.1 R11 and R13 repointed, F.2 STOP-11, **F.5 TOLD-3 rewritten** |
| **PM-R10** (R3 N1, `DECISIONS:543`) | the split's direction reversed: the WRITERS leave, and `today-app.cjs` and `gym-app.mjs` are RELEASED by S10 through the role S9 builds. S9 does not wait for the split and does not carry it. Measure whether any runner rule blocks releasing such a file | **A.2.1** rebuilt, **A.2.1.1** (the measurement: not an argv target; 11 sealed cells import it; no runner rule binds importers; `boundary.test.mjs` P-MEASURE (g) is the one thing that does block it), **A.2.1.2** (what S9 must leave in place), A.6, D.4, E.1, E.2's deleted row, F.1 R18 |
| **PM-R11** (R3 N2 to N8) | land every note | section 0 (N2), D.2 (N3, N4), A.4 and C.4 (N6), A.5 and A.2.1 (N7), Appendix 4 (N1), Appendix 8 (N7), Appendix 11 (section 4 item 4), E facts 20 to 22 (N8) |
| **PM-R12** (OQ-1, OQ-2) | OQ-1 is answered on the ledger: the tree id `6d771046` is exact and binding, the README sha is not reproducible, the blob is `e4e9effd`; cite the tree id. OQ-2 goes to lane C-UI now, and the spec records it as an input the S9 integrator must have before the re-measure | **C.5.1**'s opening paragraph, **C.5.3** step 5, F.4's open-question table |
| **PM-R13** (the estimate) | restate it without COPY-BIND and with the whole-pack pin, on the generator; and list what preparation can start TODAY, hunk by hunk, given that R1, R2 and R3 all accept sections B and D | **F.3**'s rebuilt table, its arithmetic table and the hunk-by-hunk "what can start today" table |
| **PM-R7** (Q8) | the amended STOP-2 is RATIFIED; fix R2 N2, N3, N4, N9 | **F.2 STOP-2**, B.5 H17 and H7 and H8, C.5.2, **C.2** |
| **PM-R8** (OWNER-1) | OWNER-1 is decided by the PM and replaced by a TOLD paragraph | **F.5 TOLD-1**, F.2 STOP-5, A.2's closing paragraph |
| **PM-R9** (the estimate) | restate the estimate assuming the SEAL-AUTOMATION generator; say what remains hand work and what starts today | **F.3** (the two-column table, the hand-work list and the four-step schedule), E.2's generator paragraph |

**The eight v2 questions, closed:** Q1 by PM-R1; Q2 by PM-R2; Q3 and Q4 by PM-R3; Q5 by PM-R4;
Q6 by PM-R5; Q7 by PM-R6 as revised by PM-R6'(i) and PM-R6'(ii); Q8 by PM-R7. **No question in this
document is open to the owner.**

**And v3's three open questions are now two answered and one closed (PM-R12, R3 N1):**

| v3's OQ | status in v4 |
|---|---|
| **OQ-1** (the unreproducible `README.md` sha at `DECISIONS:530`) | **ANSWERED BY THE PM ON THE LEDGER.** The tree id `6d771046` is confirmed exact and is the binding identity; the README sha `c151a79d...` is not reproducible and the blob is `e4e9effd...`. **C.5.1 now cites the tree id and nothing else.** It is also moot for the pin, in the opposite direction from v3: `README.md` is now INSIDE PACK-PIN, so its bytes are held by a value somebody took rather than by a value nobody can reproduce |
| **OQ-2** (64 of 99 approved-derived strings when C-UI-1 moves the pins) | **SENT BY THE PM TO LANE C-UI NOW.** It is no longer this spec's question. **The spec records it as an INPUT the S9 integrator must have before the re-measure** (C.5.3 step 5), because the answer decides E fact 17's four design-of-record paths |
| **OQ-3** (`rebuild/c-today-split` not on origin) | **CLOSED.** It is on origin and R3 read it. `DECISIONS:543` (A) then overruled its direction, so A.2.1 rests on the ruling rather than on either version of the spec, and Appendix 4 is corrected |

**What v4 leaves open, and it is two things, neither of which blocks the round:**

| # | open question | who decides | what happens if nobody does |
|---|---|---|---|
| **OQ-4** (v4) | **C.6's seven questions**: the unit of comparison, what produces the observed side, which states are in scope, the rule for an un-ported screen, the price of a legitimate wording change, whether `design.cjs`'s arrays stay, and the red-first fixture. | **lane C-UI and lane B jointly, and it is S10's precondition, not S9's work** | S10 releases `today-app.cjs`, the first released file that carries the athlete's own words, with the copy held by nothing. C.6 exists so that is a decision somebody makes rather than a thing that happens |
| **OQ-5** (v4) | **does round 2 of TODAY-SPLIT-SPEC match `DECISIONS:543` (A)?** A.2.1 is written from the ruling; the spec's round 2 is not pushed (`farm-sync.sh rebuild/c-today-split` still returns `14c87fa7`, v1). | the PM, when round 2 lands | A.2.1.2's list is a list of things S9 must NOT do, so a mismatch costs nothing in S9 and is caught when S10's spec is reviewed. Recorded so it is not assumed |

**Neither OQ-4 nor OQ-5 is an owner question, and neither blocks S9 preparation.** OQ-4 is TOLD to
the owner in TOLD-3, as an open thing rather than a solved one, which is the change R3 BLOCKING-E
forced and PM-R6'(ii) ruled.

### F.5 WHAT THE OWNER IS TOLD (nothing in this round asks him to decide)

**PM-R8 removed the only owner question this spec carried.** These four paragraphs are written to be
read on a phone by someone who does not code, and they are told, not asked.

**TOLD-1: what freeing the screen files actually buys.**
You approved freeing the "screen only" files so the new look could land faster. We went through the
eight files that were named and measured every one. Five of them were never locked in the first
place, so there was nothing to free. Of the three that were locked, one is the big file behind the
Today screen, and it does two jobs at once: it draws the screen, and it saves what you enter, your
weight, your food, your sleep. Your own rule says a file that does both stays locked until it is
split, so it stays locked.

That leaves two files: the stylesheet, and the small program that assembles the page. Freeing those
two frees the first look ticket and the last one. The other six still each need the slow locked
round.

The "about one week" figure that was quoted when you said yes assumed the big Today file would be
split. Nobody had measured that split at the time it was quoted. It has now been given its own job,
with its own build and its own independent review, running in parallel with everything else, so it
is being done properly rather than assumed. Your data protection is identical either way: the half
that saves your data stays locked, before the split and after it. Nothing here needs a decision
from you.

**TOLD-2: one thing about the page builder, in a sentence.**
One of the two files being freed is the small program that assembles the Today page. Besides
assembling it, that program enforces seven rules about what may and may not go into the page,
including "the part that saves your weight readings must be in the page". We checked each of the
seven against the locked tests. Five are fully re-checked by locked test files, so freeing the
program does not free them. One, the rule that the wording on screen matches your approved design,
is re-checked by a locked test, but the things that test compares were themselves not locked.
TOLD-3 says which half of that we are fixing this week and which half is honestly still open. One
was not checked anywhere else at all, and we found that this week.
We are adding that check to a locked test file in the same change. If for any reason it cannot be
added, we will free only the stylesheet and leave the page builder locked. You do not have to
decide anything here; this is recorded so that "we freed it safely" is a measurement and not a
claim.

**TOLD-3: the design you approved is being locked properly. Your wording on the screens is not
locked yet, and I want to be straight with you about that.**
When you approved the design pack, you said two things should stay protected: the approved design
stays pinned by its fingerprint, and the exact wording on the screens stays locked by tests. We
checked whether the machine really enforces those two promises. **One of them we are fixing this
week. The other we are not, and the last two write-ups of this said we were. That was wrong and
this paragraph corrects it.**

**The design pack: being locked, this week, and wider than we first planned.**
The approved design files and the file that holds their fingerprints were all outside the locked
set, so someone working on the design could change an approved file and update its fingerprint in
the same edit, and every check would still pass, because each was only being compared with the
other. We are fixing that in the same change that frees the stylesheet. We take a fingerprint of
every single file in your approved design pack and lock the whole list, so that changing any one of
them fails loudly and says which file changed.

We first planned to leave the design team's own testing tools and screen images out of that lock,
because those are the parts they work on every day. **We changed our minds and put them in**, for a
reason worth one sentence: after this change, "the design tests are green" IS how a new screen gets
accepted. A test that decides whether work is good must not be editable by the same piece of work.
So the tools, the 844 reference screen images and the record of what each screen says are all
inside the lock now. The price is that the design team has to finish tidying those tools before we
take the fingerprints, which is already the plan.

**Your wording: honestly still open, and here is what we are doing about it.**
Of the 218 sentences on the locked list, 139 are checked by nothing inside the locked set. A
sentence could be taken off a screen and off the list in one edit and nothing would notice. We
thought a small new test would close that. An independent reviewer proved, by actually running it,
that the test we designed would have asserted only things the machine already asserts, and would
not have caught that exact edit. **So we are not shipping it and calling the problem solved.**

What we are doing instead: nothing we free this week carries any of your on-screen words. We
checked both files sentence by sentence and neither contains one. The first file that carries your
words is the big Today screen file, and it is scheduled to be freed in the NEXT change, not this
one. **Before that happens, a real wording lock has to exist, and it is now written down as a
condition of that change rather than as a good intention.** The pack we are locking this week
already contains a record of exactly what each screen says, so the lock has something true to
compare against. The design team and the tooling side are designing it together now.

We are also deliberately NOT locking the one file the design team edits in almost every ticket.
Locking that would put the new look back inside the slow round, which is the opposite of what you
asked for.

One thing worth knowing for later: when the design work moves the fingerprints over to the newer
approved pack, 64 of those sentences will not be found there, because the newer pack does not draw
the daily check-in screens at all. We have told the design team now rather than letting them
discover it mid ticket. Nothing here touches your training data, and nothing here needs a decision
from you.

**TOLD-4: nothing else in this document needs your decision.** Every other choice here is
engineering inside the rules you already set. No guard is lowered beyond what you already granted,
the one place the lock itself is touched is a single narrow skip that the reviewer is told to
attack, and the two files being freed do not store, compute or touch anything about your training.

---

## Appendix: what I did NOT verify, stated so it is not assumed

1. I did not run `b-package.cjs` in any mode. This round authors one markdown file; no runner or
   suite was executed, so every predicted refusal in B.8, C.5 and D.2 is a prediction, not a
   measurement.
2. I did not measure C-UI-1's file set. It is not PR-READY (`DECISIONS:531`) and its branch was not
   read. The ticket text is the only source for "what the look will touch" in A.5.
3. I did not read `rebuild/conform/private`, `src/history.js`, any `ledger/`, `EarnedPort`, the
   protected soak or the private census, and no owner measurement entered this session.
4. **(v3, CORRECTED in v4; R3 N1 was right and the sentence was stale when R3 read it.)**
   `rebuild/c-today-split` **IS** on origin, at `14c87fa7`, carrying
   `rebuild/lanes/c/TODAY-SPLIT-SPEC.md` (853 lines). It was pushed five minutes before v3's commit,
   which is why v3's sentence was true when written and false when read. **What is still true in
   v4:** `14c87fa7` is **v1** of that spec, whose CUT `DECISIONS:543` (A) has since REVERSED, and
   round 2 is NOT pushed: a fresh `farm-sync.sh rebuild/c-today-split` today still returns
   `14c87fa7`. **So A.2.1 is written from the RULING (`:543` (A)) and not from either version of the
   spec, and I did not read v1 either.** That is OQ-5, and it is a narrower and more honest
   reservation than v3's.
5. The S8 ARTIFACT sha256 for fact 8 was not re-measured here; `DECISIONS:529` names the RECEIPT
   sha, and the two are different objects. The S9 round must take the artifact sha from Git.
6. `rebuild/lanes/d/p3-layout-v2/` was confirmed to hold `layout-v2.test.mjs` and
   `projector-parity.test.mjs`; I did not run them.
7. **(v2)** I re-measured every finding in R1 that I acted on, on the PC, by opening the file at
   the line. **(v3)** I re-measured every finding in R2 that I acted on, in the farm, by opening the
   file at the line or by running a read-only node script. I did NOT re-run anything: this round
   still authors exactly one file and executes no suite and no runner. Cells (11) and (12), H17,
   H18, H19 and the fence are designs, not observations.
8. **(CORRECTED in v4; R3 N7 is right and this was the untrue sentence.)** v2 and v3 both said "I
   did not re-read the C-UI ticket bodies", while A.2.1's table is headed "measured from the tickets
   (`git show origin/rebuild/c-ui-0-gates:rebuild/lanes/c/ui-port/C-UI-N.md`)" and quotes four of
   them. **R3 checked the four quotes and found them verbatim and correct**, so the tickets WERE
   read and this appendix point was the stale claim, not the table. **The true statement:** the
   ticket bodies were read at `origin/rebuild/c-ui-0-gates` for A.2.1's table; A.5's ticket column
   carried two slips, which R3 found and v4 takes (`screens.template.html` is 2,4 not 2,3,4;
   C-UI-7 names `food-host.mjs` not `food-*`). What remains true is the point R2 N8 made: PM-R6 does
   not rest on A.5's "`design.cjs`, ticket 1 only" row, and R3 measured that the row is in fact
   accurate (`design.cjs` is named in C-UI-1 only) while the RULING is better supported by
   `DECISIONS:542` (D), where S9-TODAY-CARRY edits `design.cjs` inside this very package. **I did
   not re-read the ticket bodies in v4 either, so the columns are v1's reading as R3 checked them,
   and that is now stated as the limit rather than as a denial.**
9. **(v3)** I did not run the SEAL-AUTOMATION generator. F.3's numbers assume the acceptance its
   own README reports (791 of 800, 4 of 15 byte-identical, 21 seconds). If its review round finds
   that number to be lower, F.3's 37.5 hours moves upward and nothing else in this spec changes.
10. **(v3, RESTATED in v4)** The C.5 measurements were taken in the cloud farm, from git blobs at
    `5f4cad0a` and `ecbef86a`, with `design.cjs` loaded from the chain tip; v4's were taken at
    `023b99f4`. They were not re-taken on the PC. **v4 publishes NO pack value at all, only the
    procedure and the shape** (904 files, about 90 KB at `ecbef86a`), precisely so that nothing here
    can be copied into a cell. Any hand building H19 or H19b must measure at the S9 head, which is
    the same rule E fact 9 applies to every pre/post.
11. **(v3, CORRECTED in v4; R3 section 4 item 4 re-counted it and R3 is right.)** The copy census
    is a verbatim substring search, so it is a LOWER bound on binding and an exact count of
    non-binding: a string that occurs in a file is not necessarily ASSERTED by it. v3 said "17 of
    the 99 approved-derived strings are six characters or fewer" and named eleven. **The measured
    figure is 14 occurrences over 13 distinct strings**: `Earned`, `Today`, `Low`, `High`, `None`,
    `Mild`, `Poor`, `Okay`, `Good`, `Pain` (twice, in two arrays), `New`, and the two fragments
    `" of "` and `" reps"`. Those are the ones most likely to match by accident. They are named here
    because C.6 question 1 has to decide what to do about them, and because a census that overstates
    its own weakness is no better than one that understates it.
12. **(v4)** I did not read or run the design gate scripts (`quality/gate.py`, `teeth.py`,
    `statesheet.py`, `phonesheet.py`, `common.py`) and I pass no judgement on their teeth; that is
    `DECISIONS:531`'s audit. C.6's "enforcement" row is a direction, not a measurement of those
    files.
13. **(v4)** I did not run the design gates, the state sheet or any build, and I did not open
    `%TEMP%\earned-split`, `%TEMP%\earned-s9carry`, `%TEMP%\earned-passphrase` or any worktree but
    `%TEMP%\earned-s9`. The S9-TODAY-CARRY and PASSPHRASE-NORMALIZE facts in E facts 20 to 22 come
    from `DECISIONS:542` (D) and `:543` (B) plus a seal-status parse of the S8 artifact and a
    directory listing of each lane's branch in the farm.
14. **(v4)** A.2.1.1's PM-R10 measurement is a reading of the runner and of the S8 spec, not an
    execution: I parsed `packages/S8.json`'s children, resolved import specifiers statically, and
    read every call site of `closure()`, `requiresOriginal()` and `ownChildren()`. **I did not run
    `boundary.test.mjs`**, so the prediction that P-MEASURE (g) goes red after S10 releases
    `today-app.cjs` is derived from `:117-:126`, `:137-:139` and `:181`, not observed.

---

## R3 findings: fixed or disputed

The review is `rebuild/lanes/b/S9-RELEASE-SPEC-REVIEW-R3.md` at `143a650a`. Verdict: REJECT, two
blocking findings and eight notes. **Two blocking: both FIXED. Eight notes: all eight FIXED.
NOTHING IS DISPUTED.** Three of R3's own cites are CORRECTED below, each time in a direction that
makes R3's finding stronger rather than weaker, and each time with the measurement beside it.

**A word about what R3 did, because it changed how this round was dispatched.** R3 re-took both of
v3's PM-R6 numbers before opening C.5 and both reproduced exactly, including the figures it
expected to have to correct. It then proved BLOCKING-E **by executing the real function** with one
array entry removed, rather than by reading it, and it proved BLOCKING-F by three tree
measurements. Having done that, it said plainly that eight of the nine PM rulings were carried out
faithfully, that round 3 broke nothing R1 and R2 had accepted, and that both blocking findings sat
inside the one ruling the author had been told to build. **The PM read that and revised PM-R6
rather than asking the author to build it again.** That is the shape of this round.

### The two blocking

| # | finding | verdict | what changed, and where |
|---|---|---|---|
| **BLOCKING-E** | COPY-BIND asserts nothing `assertDesignBinding` does not already assert from inside the seal, and does not close the hole it was built to close: a coordinated deletion from the template AND the array passes | **FIXED by WITHDRAWAL (PM-R6'(ii)), and the finding is upheld in full** | I re-read `assertDesignBinding` at the line and R3 is right. Its copy rules are `design.cjs:538-:556`, `design.test.cjs:72` runs the whole function with the real references from inside a cell sealed in both maps, and both of the loops COPY-BIND would have re-implemented iterate the ARRAY, so a string leaving the array is invisible to them whatever the corpus is. **`copy-bind.test.mjs` is not built**: B.5's H19c row and B.8's row are struck; the C.5.2 claim "it is stronger than the wording it replaces", the R2 section's "the copy locks and the sha256 pins now ride the same two cells" and TOLD-3's "your words are now actually locked" are all **withdrawn**, which is three sentences in three places and is the whole content of the finding. **C.5.2 is rebuilt as the gap stated as it is**, with R3's measurement, plus one measurement of my own R3 could not have taken: **S9 releases no file carrying on-screen copy** (`preview.css` zero outside comments; `build.mjs` only `buildToday`, an `IMPORT-ROUTE FAIL` diagnostic and sixteen `for ... of` loops). **C.6 makes the lock a named precondition of S10**, with the corpus measured (419 state records, 210 ids, text identical across themes for all 210) and seven questions the design must answer. **Estimate: -1 hour for the cell, +1 for C.6.** THREE CORRECTIONS TO R3, all of which strengthen it: (a) R3's block-quote line numbers are each one low (`:542`, `:543`, `:544`, `:547`, `:548`, `:551`, `:552` at `023b99f4`, not `:541`...`:551`); (b) there are THREE copy loops, not two - `:538-:541` iterates the TEMPLATE - and R3's fixture removed the sentence from the template too, so that loop had nothing to look at and the finding stands; (c) R3 is right that B.8 row (3) was never a red-first plan for the cell, and the row is struck rather than repaired |
| **BLOCKING-F** | PACK-PIN and COPY-BIND are specified against a tree state S9 itself removes, and the spec never says which tree the cells read; H19 has no tree it can run in; E.2 answers "no" in the "depends on C-UI-1?" column where the measurement says yes | **FIXED, and I dispute no part of it** | All three of R3's measurements re-checked and all three hold. **(a) WHICH TREE, in one sentence per cell:** C.5.1 now says PACK-PIN reads the **WORKING TREE at run time**, which on CI is the `actions/checkout` tree of the branch being pushed, never an object at a fixed commit - R3's reason is exactly right, an object at `5f4cad0a` is not present on a runner and a value that can never change makes red-first rows unreachable by construction. C.5.3 says APPROVED-PIN reads `design.APPROVED` at run time for its file list and the WORKING TREE for the bytes. **(b) WHAT IS TRUE ON THE DAY C-UI-1 SEALS:** C.5.3's five-step list for the integrator, including the re-decision of E fact 17's four paths, the OQ-2 input, and **the `design.test.cjs` edit NAMED AS A HUNK** - `:17`'s `approved.length === 2`, `:25` and `:26`'s two filename regexes and `:184`'s handoff bind, in a cell sealed in both maps, so S9 declares it `role: "edited"` if it moves. **(c) THE SCHEDULE:** H19 and H19b are split, CODE into day 1-2 and LITERALS into the WAIT column and the single re-measure, exactly as R3 asked; E.2 carries the split rows and F.2 gains **STOP-10**. **ONE CORRECTION TO R3:** its cite `design.test.cjs:23-:24` is the comment above the statements; the two `assert.match` calls are `:25` and `:26`, and `:17` carries the `length === 2` assert R3 did not name, which makes the finding wider. **AND ONE THING R3 DID NOT SAY THAT THE PM THEN RULED:** the exclusion itself was wrong. PM-R6'(i) puts `README.md` and all of `quality/**` INSIDE the pin - at `ecbef86a` that is **851 of the 904 files v3 excluded**, including the gate code and 844 baselines that after S9 ARE the acceptance of every look ticket |

### The eight notes

| # | R3 note | verdict | what changed |
|---|---|---|---|
| **N1** | A.2.1's "exactly four things and no new mechanism" is short in three ways, and the split spec it could not read is now on origin | **FIXED, and overtaken by PM-R10** | R3 is right on both counts and the ledger then moved: `DECISIONS:543` (A) REVERSES the cut v1 proposed, so re-writing v3's four items against v1 would have been re-writing them against an overruled design. **A.2.1 is replaced outright**: the writers leave, `today-app.cjs` and `gym-app.mjs` are released by S10 through S9's role, the carrier is S10, and the "if accepted in time" column is deleted from E.2 rather than re-worded. **A.2.1.1 answers the measurement the PM asked for** and **A.2.1.2 lists what S9 must leave in place.** R3's last sentence in N1 is taken as well: `today-app.cjs` role `edited` is true either way, because `DECISIONS:542` (D) requires it for S9-TODAY-CARRY, and that is now **E fact 20** |
| **N2** | section 0's candidate table names a file `:536` does not (`index.shell.html`) and drops one it does (the today test cells) | **FIXED** | Read line 536 again: `index.shell.html` is not in it. Section 0's headline is re-cut to R3's own honest form (four of the seven FILES the ruling names are already free, `today-app.cjs` fails its test, the eighth candidate is the test-cell category), the table gains a row for the category pointing at C.3, and `index.shell.html` stays as a marked row so a reader of v3 is not confused. **Nothing downstream moves; the closed list is still two.** R3 is right that both earlier reviews repeated this and it was the third round's to catch |
| **N3** | D.2's skip condition (1) will refuse S9's own diff unless it reads `--name-status` | **FIXED** | Both the "what it asks" row and skip condition (1) now say `--name-status`, condition (1) counts only status `A`, and the row carries R3's number: E fact 7 re-pins seven ancestor specs, so a real reseal child's diff is **eight** `packages/*.json` paths, one added and seven modified |
| **N4** | the chain-derived skip is backed by the seal, not by the fence, and condition (3) inverts after the merge | **FIXED, both halves, and R3's reasoning is adopted verbatim in one row each** | Two new D.2 rows. The first says in terms that (1), (2) and (5) are copyable out of the public chain and **condition (4) is the only one that costs anything**, because it requires a sealed byte in `b-package.cjs`, caught by `fidelity()` `:2005` and the runner pin `:2012`. The second adds the post-merge clause: (3) is satisfied either by absence at `CHAIN_REF` or by presence plus the fence reading that child's own artifact |
| **N5** | one sha256 cannot produce B.8's three refusal names, and the exclusion needs anchoring at the pack root | **FIXED, and this note is half of what PM-R6'(i) rebuilt** | The cell holds the **full sorted `(path, sha256)` list as its literal**, not one value, which is what lets `PACK-PIN MISMATCH`, `MISSING` and `ADDED` each name the path. The one remaining exclusion is **anchored at the pack root**, with R3's own attack named (`app/quality/run/x.js` cannot leave the pin). **And the exclusion R3 was asking to anchor is mostly gone**: PM-R6'(i) pins `quality/**` and `README.md`, leaving only untracked run output, which the cell skips by its OWN literal ignore list and never by reading `.gitignore` (which is in neither S8 map) |
| **N6** | `page-bundle.test.mjs`'s CI home is `:264-:265`, not `:232`; and `assertNoAiDashesInAssets` is implemented in `plain-copy.cjs`, not at `build.mjs:31` | **FIXED, both, re-read in the farm** | `rebuild.yml:231-:232` is the A1/A2/A3/A4 step and its 17 named cells carry no `import/` path; `:264-:265` is the P3 step and it names `page-bundle.test.mjs`. A.4 row 1 re-cited. `assertNoAiDashesInAssets` is implemented at **`plain-copy.cjs:288`**, exported `:305`, destructured at `build.mjs:31` and called at `build.mjs:501`: A.4 row 7 and C.4 row 1 re-cited. **One measurement added beside it**, because it strengthens the row: `plain-copy.cjs` and `dash-check.mjs` are in neither S8 map, and the law is held anyway because `copy.test.mjs:395`/`:405` assert the BUILD's refusal. That pattern is now C.6's model |
| **N7** | Appendix 8 and A.2.1 contradict each other about the C-UI ticket bodies; and A.5 carries two slips | **FIXED, and I take the credit R3 offered and the correction with it** | **Appendix 8 was the untrue sentence** and is rewritten: the tickets WERE read at `origin/rebuild/c-ui-0-gates`, R3 checked all four quotes and found them verbatim, and what is true is that v4 did not re-read them either. Both slips taken: `screens.template.html` is tickets **2,4** (C-UI-3 does not name it) and C-UI-7 names **`food-host.mjs`**, not `food-*` |
| **N8** | E could now name S9-TODAY-CARRY's four declarations | **FIXED, and widened** | **E fact 20** names all four (`today-app.cjs`, `test/view.test.mjs`, `test/adapter.test.mjs`, `.github/workflows/rebuild.yml`) with their seal statuses parsed from the S8 artifact, and records that the lane's other moved files are in neither map. **E facts 21 and 22 do the same for PASSPHRASE-NORMALIZE** from `DECISIONS:543` (B), which landed after R3 was written: four declarations, three lane cells with a CI step and a child root, and a CI home for `rebuild/m3/w6/test/local-import.test.mjs`, whose root is already in `CHILD_ROOTS` |

### What R3 tried to break and could not, carried forward

R3's section 4 lists eight attacks. **Five are carried forward unchanged and are stronger in v4:**
the pack pin over a moved board, app file, added file or removed file (v4's literal list names the
path instead of saying "different"); the line-ending attack, which fails because `.gitattributes`
forces LF in every working tree, and which v4 turns from a defence into a positive requirement,
since PM-R6'(i) makes the cell read the working tree; the exclusion-list attack, which is closed
because the ignore list lives inside a cell S9 seals; **the re-read of the released role, the token
line, H17 and the receipt skip, where R3 found round 3 had broken nothing R1 and R2 accepted and
v4 changes not one character**; and H7's single placement, re-derived at the line. **Two more
became findings and are answered above** (item 4's short strings, now measured at 14 and 13, and
item 8's "no NOW item needs C-UI-1's bytes except H19", which is BLOCKING-F). **One is now
answered differently**: item 5's exclusion-list attack matters less because there is almost no
exclusion list left to widen.

---

## R2 findings: fixed or disputed

**AMENDED IN v4 (PM-R6'(ii)).** BLOCKING-B's row below says "the copy locks and the sha256 pins now
ride the same two cells, which is what BLOCKING-B asked for". **That sentence is withdrawn.** R3
proved the copy half of it false by execution. What is true after v4: **the sha256 pins ride
PACK-PIN, APPROVED-PIN and the four `pinned-unchanged` declarations, and the COPY LOCKS ride
nothing yet and are a named precondition of S10** (C.5.2, C.6). The row is left standing below
rather than rewritten, so the record of what each round claimed is readable, and this paragraph is
the correction.

The review is `rebuild/lanes/b/S9-RELEASE-SPEC-REVIEW-R2.md` at `d859096`. Verdict: REJECT, two
blocking findings and ten notes. **Two blocking: both FIXED, one of them with a single clause
DISPUTED and re-derived. Ten notes: nine FIXED, one (N10) recorded as confirmation.** Where I
disputed, the measurement that disputes it is in the body, not here.

### The blocking two

| # | finding | verdict | what changed, and where |
|---|---|---|---|
| **BLOCKING-A** | the fence's reseal-child SKIP is declared by the branch being fenced: any branch can add an empty `packages/S10.json` and the fence stands aside | **FIXED, with one clause of the remedy DISPUTED and replaced by a stronger one** | The finding is exactly right and I re-derived it: v2 rewrote only the "how it learns the inventory" row, so BLOCKING-2's mechanism survived in the gate. **D.2's skip row is rewritten**: the default is now FAIL `FENCE-RESEAL-CHILD-UNVERIFIED`, and the skip needs five chain-anchored conditions, the load-bearing one being that the candidate spec's `parent.chosen` option must name the artifact the fence just read at `CHAIN_REF` **and the sha256 the fence itself measures over that artifact at `CHAIN_REF`**, never a value the branch supplies. **Red-first row (8) added with four failing sub-rows and one green control, and it is written before the skip has a happy path.** DISPUTED CLAUSE: R2 asks that the spec's `packageId` be "an id `IDS` carries at `CHAIN_REF`". Measured: `IDS` at `b-package.cjs:173` on the chain is `['B-NTC','H3','S3','S4','S5','S6','S7','S8','B1','B2','B4','B3']`, and a reseal child's id is added to `IDS` by that child's OWN branch (E fact 1 does this for `'S9'`), so at the chain ref a genuine child's id is always absent and the clause would refuse every reseal child including S9. Condition (3) inverts it and condition (4) supplies the teeth from the branch's own `b-package.cjs`. Estimate +1 |
| **BLOCKING-B** | C.4's copy-lock row makes the claim R1 blocked C.4's sha256 row for; the copy locks ride on the same answer as the sha256 pins and Q7 and OWNER-3 were framed as being about hashes | **FIXED, and the whole of C.5 is rebuilt on PM-R6 rather than on v2's answer** | Confirmed at the line: `design.cjs`, `screens.template.html` and both approved references are in no `product` and no `executionPins`; `design.test.cjs:74-:75` compares `design.cjs`'s arrays with their own lengths; `assertDesignBinding` compares three unsealed things. **I re-measured R2's count and it stands: 218 strings, 139 in no sealed cell.** C.4's "cannot silently drop them" paragraph is **withdrawn and replaced by the measurement**. PM-R6 then rules the remedy, and it is NOT v2's: `design.cjs` is not sealed (the design lane edits it in most tickets, R2 N8's point), and instead **C.5.1 PACK-PIN** pins the approved pack by content (value `6121aa91...` over 53 files, `quality/**` and `README.md` excluded, and the exclusion measured honest: 53 of 53 byte-identical between `5f4cad0a` and `ecbef86a`) and **C.5.2 COPY-BIND** binds the arrays to the files `design.APPROVED` names, with the whole census in the document. **The copy locks and the sha256 pins now ride the same two cells, which is what BLOCKING-B asked for.** Q7 is closed by PM-R6 and OWNER-3 is replaced by TOLD-3, which tells the owner about his copy as well as his design files |

### One part of PM-R6 that the measurement would not support, reported rather than bent

PM-R6 (ii) asks that all 218 strings bind to **the pinned pack's own copy sources**. Measured
before specifying, as the ruling required: **139 of 218 bind against the 09-18 pack**, which is more
than most and would pass the ruling's own threshold on its face. But split by the rule each array
actually carries, the population that matters binds far worse: the APPROVED-DERIVED arrays
(`APPROVED_COPY` + `RUNTIME_COPY` + `CHECKIN_RUNTIME_COPY`, 99 strings, the ones `design.cjs` says
"MUST come from the approved references") bind **35 of 99** against the 09-18 pack, and
`CHECKIN_RUNTIME_COPY` binds **0 of 18**, because `design.APPROVED` still names the 09-08 pack
(`DECISIONS:530`: the pins move "when C-UI-1 seals") and the 09-18 prototype draws no check-in
sheet. Shipping the literal wording would put 64 of 99 red on the first run.

So, per the ruling's own instruction not to bend the rule: **the literal wording is NOT shipped, the
numbers are reported here and in C.5.2, and the cell is specified against `design.APPROVED`'s own
files, where the same two populations measure 99 of 99 and 0 of 119.** That is the same law with the
corpus the strings are actually bound to, it is stronger (it survives the pins moving, and it turns
the move into a measured event), and it is flagged rather than substituted quietly. **If the PM
wants the literal wording instead, this is a STOP and the round reports 35 of 99.**

### The ten notes

| # | note | verdict | what changed |
|---|---|---|---|
| **N1** | D's cell is narrower than D's claim; the fence passes a branch that rewrites the weigh-in admission bounds | **FIXED** | D.2's "what it is NOT" row now names the three writers outside the inventory by file and line, says that PM-R3 brings two of them inside and `today-model.cjs` stays out until TODAY-SPLIT, and requires the S9 brief to say so. **D.4 added**, referencing the WRITER-FENCE that TODAY-SPLIT will define (PM-R4) |
| **N2** | H17 changes the `gkept` count printed at `:1855-:1858` and the spec does not say so | **FIXED, CONFIRMED in the farm** | `:1856` really does print `gkept` as "N un-superseded grandparent pin(s)". B.5 H17 now carries the say clause, and F.2 STOP-2 admits that one further non-asserting change to `pins()` by name |
| **N3** | H7 names two placements 57 lines apart that skip different code | **FIXED** | B.5 H7 now names **one**: immediately before `:1952`. The row says why the narrower one is right (between `:1895` and `:1951` a released pin passes `:1915-:1916` and `:1943-:1949` on its own merits, so skipping from `:1895` would put two live asserts out of reach for no gain) |
| **N4** | two cites land on the comment above the statement, in the round that swept N7 | **FIXED, CONFIRMED** | `:1966` is the comment and the `say('PRODUCT ' + phase ...)` is `:1983-:1987`: B.5 H8 re-cited. `:1908` is the comment and the `new`/`pinned-unchanged` assert is `:1909`: C.5 re-cited |
| **N5** | C.5's `pinned-unchanged` ruling is correct and the refusal it would otherwise hit was checked | **CONFIRMED, and the ruling is kept while its list changes** | The role is right for the four design-of-record files and for the two PM-R3 writers. `new` really is refused at `:1945-:1949` for `pre === post`. What changed is PM-R6 taking `design.cjs` off the list |
| **N6** | `REQUIRED_INPUTS` holds 48 paths, not 51 | **FIXED, and the error was mine** | Re-measured: a quoted-string count over `build.mjs:98-:201` returns 51, and three are prose inside the block's own comments. **48**, of which 26 under `today/`, 3 engine, 3 client, 1 coach, 8 `m4`, 7 other `m3`. A.4, B.5 H18 and E fact 16 all say 48 now, and the 26 are unchanged |
| **N7** | A.4's "five laws" is short by two, one of which is the owner's own rule | **FIXED, wider than asked (PM-R2)** | A.4 is rebuilt as **seven laws** with a column for the call site in `buildToday` and a column for the sealed cell that carries each, plus a named list of the four build hygiene asserts so the table is complete. `assertDesignBinding` `:472` is carried at its CALL SITE by `design.test.cjs:72` and `:109-:115` and at its CONTENT by nothing until C.5; `assertNoAiDashesInAssets` `:501` is carried by `copy.test.mjs:395`/`:405`, which build a planted copy of the tree, so the coverage survives a released call site exactly as R2 says. **One correction to the reviewer:** R2 cites `:470` for the template-slot assert; `:470` is `const chrome = design.chromeCss();` and the assert is `:471`. It does not change the finding |
| **N8** | OWNER-3 understates the option it recommends, because the five paths include the file the design lane edits constantly | **FIXED by PM-R6 deciding the other way** | The recommendation is withdrawn rather than re-worded: `design.cjs` is NOT sealed. TOLD-3 says in plain words that we are deliberately not locking the file the design team edits every day, and why |
| **N9** | C.2 deletes a live guard it says needs no change | **FIXED** | Re-read at the line: `:186-:187` is `Object.hasOwn(product, f) === false` and `:188-:189` is `shaOf(f) === declaredPost(f)`. C.2 now deletes **only `:188-:189`**, keeps the constant, the loop and `:186-:187`, and says why that guard is worth keeping. PM-R7 ratifies it |
| **N10** | no em or en dash anywhere in the spec | **CONFIRMED, and re-checked after every v3 edit** | zero U+2013 and zero U+2014, including in the quoted runner source and in the three new measurement sections |

### What R2 tried to break and could not, carried forward

R2 re-derived H17 and could not widen it (the skip is keyed on a `released` block only `proposed()`
writes, and `:1909` independently refuses `released` for a path the parent pins in neither map);
confirmed there is no third pin walk for a `released` block to miss; confirmed the release cannot be
spelled by pattern; found no writer hidden in either released file; found no second byte pin;
confirmed H12/H13 are necessary and sufficient for the `--full` re-verify; confirmed nothing is
loosened in `fidelity()` or the historical audit; and could not find a NOW item in E.2 that needs
C-UI-1's bytes. All of that is carried forward unchanged, and v3 adds nothing that touches it.

---

## R1 findings: fixed or disputed

**Kept from v2 and not rewritten in v3**, because this round continues the earlier authors' work
rather than discarding it. Two entries below are overtaken by later rulings and are marked where
they stand: BLOCKING-4's five-path remedy is superseded by **PM-R6** and C.5 (four paths, and
`design.cjs` is NOT among them), and N10's Q3 is superseded by **PM-R3** and A.5. R2 re-derived
every R1 finding independently and upheld all fourteen fixes.

The review is `rebuild/lanes/b/S9-RELEASE-SPEC-REVIEW-R1.md` at `f0dc366`. Verdict: REJECT, four
blocking findings and ten notes. **Every one is answered below. Four blocking: four FIXED. Ten
notes: ten FIXED.** Nothing is disputed. Two findings are fixed more widely than the reviewer asked
(BLOCKING-4 adds a fifth path; N10 changes a verdict as well as a cite), and one place is recorded
where the REVIEW itself was one line short, without that changing its conclusion.

### The blocking four

| # | finding | verdict | what changed, and where |
|---|---|---|---|
| **BLOCKING-1** | the release is undone one generation later by the GRANDPARENT pin re-assertion at `pins()` `:1851-:1853`; the skip at `:1852` knows nothing about a `released` block | **FIXED** | Re-derived on the PC: I read `pins()` `:1834-:1858` and `held()` `:1828-:1833` and the finding is exactly right. **B.3 is rewritten** as two walks, with the S10 trace and both red branches spelled out. **H17 added** to B.5 (the `releasedAncestry(a)` skip at `:1852`, union over the ancestors this walk reads). **B.1** and **B.6** rows corrected: "unchanged" is now true only of the parent walk. **F.2 STOP-2 amended BY NAME** and narrowed, admitting one `continue` in `pins()` for H17 and nothing else, with **Q8** added so the PM ratifies the narrowing rather than an author doing it alone. **Red-first cell (11)** added to B.8, and **(12)** beside it so a widened skip is caught. **R9** added to F.1 for the too-wide-skip failure mode. Estimate +1 for H17, +1 for the cells |
| **BLOCKING-2** | the D.2 fence learns the inventory from the branch it is fencing | **FIXED** | I confirmed each leg of the reviewer's argument: `fidelity()` `:2010` does exempt `f === ARTIFACT`; the artifact is not a key of its own `product` map; `sealedRunReceipt()` `:2963` reports `SEALED-RUN-RECEIPT-VOID` (`:3196-:3198`) rather than failing the run; and `CHAIN_REF` at `:189` with the no-cache re-read at `:1201` is the pattern to copy. **D.2's "how it learns the inventory" row is rewritten** to read the artifact out of Git at `CHAIN_REF`, with a new **"why not the worktree"** row so the mistake cannot be re-introduced by a later author, a new **artifact-tamper row** (`FENCE-INVENTORY-DIFFERS-FROM-CHAIN`), **red-first row (6)** (a branch that widens `released` in its own worktree must FAIL), and the numeric-N rule from N9. **STOP-7** added. **R10** added. Estimate +1 |
| **BLOCKING-3** | `build.mjs` is released on an under-evidenced claim; `REQUIRED_INPUTS`' 26 `today/` entries are asserted nowhere outside `build.mjs` | **FIXED, by option (a) as recommended** | Measured, not accepted: `REQUIRED_INPUTS` holds **51 entries, 26 under `today/`** (counted with a script over `build.mjs`), and a search of every cell under `w7-preview/{today,import,measure}/test/` finds no assertion of any of the 26 as a required bundle input. The cells import those modules; that is not the same law. **A.4 is rewritten** with a law-by-law evidence table re-cited to `package.test.cjs:59-:60`, `:72-:73`, `:76-:80`, `:84`, `:94-:107`, `:127-:138` and `page-bundle.test.mjs:54-:61` (the `STILL_FORBIDDEN` literal the reviewer noted the spec had missed), and the `copy.test.mjs` dash cites are no longer offered as evidence for the build laws they are not about. **H18 added.** **A.6** makes the second path CONDITIONAL on H18. **Q2 rewritten.** **STOP-6** added. Estimate +1 |
| **BLOCKING-4** | "the design of record stays pinned by sha256 in `design.cjs`" is not true of the tree, and C.4 says it is | **FIXED, and wider than asked** | I parsed the S8 artifact myself: **zero paths under `rebuild/m1/`**, and `design.cjs` in neither `product` nor `executionPins`; `design.test.cjs` IS sealed (`0db62ca9...`, both maps) but `design.test.cjs:15-:20` compares an unsealed file to an unsealed constant. **The v1 sentence is withdrawn** and **new section C.5** states the measurement, quotes the cell, tabulates the seal side, and rules: S9 declares the paths `pinned-unchanged`. I make it **five**, not four: `design.test.cjs:185-:187` also reads `rebuild/m1/MOCK.md` as part of the same cross-check, so sealing four of the five leaves the chain as strong as its weakest unsealed link. **E fact 17**, **Q7**, **R11** and **OWNER-3** (in plain words for the owner) all added |

### The ten notes

| # | note | verdict | what changed |
|---|---|---|---|
| **N1** | the `released` entry should carry a literal `role` | **FIXED** | `"role": "released"` added to the B.4 artifact block and to E fact 15, with the reason from `DECISIONS:536` (3) |
| **N2** | H7's cite `:1961` is a comment; `const disk = diskSha(file)` is `:1952` | **FIXED** | Confirmed with `findstr /n`: `:1952`. B.5 H7 re-cited, and the placement argument strengthened with the `:1951` precedent and what the `continue` skips (`:1912-:1916`, `:1943-:1949`) |
| **N3** | the receipt sentence is `:3190-:3194`, not `:3170`, and its count over-counts | **FIXED** | Confirmed by reading `:3186-:3200`. B.6 re-cited, and the row now says H13 must change the printed count, which prints `Object.keys(s.product).length` |
| **N4** | `boundary.test.mjs` line numbers are two off | **FIXED** | Confirmed by reading `:174-:194`: the constant is `:179-:180`, the loop `:185-:190`, `Object.hasOwn` at `:186`, `shaOf`/`declaredPost` at `:188`. C.1 and C.2 re-cited, and C.2 now states the `declaredPost`-takes-a-string reason the reviewer derived |
| **N5** | thirteen execution-pinned today cells, not twelve | **FIXED** | Confirmed by parsing the artifact: 12 product pins, 13 execution pins under `today/test/`; `catalogue.test.mjs` is exec-only. C.2 row and C.3 reason corrected, with a paragraph naming the file |
| **N6** | `build.mjs` has an unsealed production consumer the spec never names | **FIXED** | Confirmed: `rebuild/slice/pwa/build-pwa.mjs:19` imports `buildToday`, and `rebuild/slice/**` is in neither map. Said out loud in A.5's `slice/pwa` row, with the instruction that the S9 brief must state it |
| **N7** | cites that land on the comment above the statement (`:1200`, `:1207`, `:1194-:1198`) | **FIXED** | Confirmed with `findstr /n`: the chain read is `:1201`, the RULED assert `:1208`, the no-cache comment `:1195-:1200`. B.2 steps 2 and 3 re-cited, and `CHAIN_REF`'s own line `:189` added |
| **N8** | `at.released` needs adding to the bucket initialiser at `:1888` | **FIXED** | Confirmed: `:1888` builds `at` with seven named arrays. Folded into H7's row so it cannot be lost between the spec and the hunk list |
| **N9** | the fence's "largest N" must be numeric and needs a tie-break | **FIXED** | D.2 now says parse the integer after `acceptance-s` and take the numeric maximum, and FAIL `FENCE-AMBIGUOUS-INVENTORY` on a tie rather than choosing. Red-first row (7) covers both |
| **N10** | Q3 should be widened; `today-model.cjs` writes as well as computes, and `browser-check.mjs` is a fourth | **FIXED, and it changes a verdict, not just a cite** | Re-measured: `today-model.cjs:378` `async function weighIn(lb)` reaches `readings.weighIn` at `:395`, with `ALREADY_RECORDED` `:365`, `OUT_OF_RANGE` `:373` and `FORM_MIN`/`FORM_MAX` `:372`. v1's A.5 row called it "computes"; that was wrong and is corrected to "computes AND writes". **Q3 is rewritten as one question over four files** with one answer, as the reviewer asked |

### One correction to the review itself, which does not change any of its conclusions

R1 quotes `held()` as having "only two branches" (`:1828-:1830`). It has three asserts, `:1828-:1833`:
the `sourceBase` branch at `:1829`, the disk assert at `:1830`, and `assert.equal(gitSha('HEAD',
file), hash, code + '-GIT-DISK-DISAGREE ' + file)` at `:1831`. This makes BLOCKING-1 slightly
STRONGER, not weaker: the undeclared-path case is red twice over, on disk and in Git at HEAD. B.3
now quotes the whole function. Recorded because a spec that silently corrects its reviewer is as
bad as one that ignores it.

### What R1 tried to break and could not, carried forward

R1's section 4 re-derived six of this spec's load-bearing claims independently and could not break
them: no hidden writer in `preview.css` or `build.mjs`; no release by pattern or by a later child;
the `--full` byte-identity trap is real (R3); the historical audit cannot reach `rebuild/m3`;
`UNLISTED-SOURCE-CHANGE` is neither loosened nor tightened; and `proposed()` `:2800` really does
re-pin child argv targets, so R2 and cell (8) are real requirements. It also widened C.1's census to
the whole repository and found no second byte pin. Those results are folded into the body above and
are the reason the S9 brief can cite the wider search rather than v1's narrower one.
