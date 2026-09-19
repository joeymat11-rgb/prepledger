# S9-RELEASE-SPEC - releasing the screen files from the sealed inventory

**v2, fix round.** v1 (`4876fa9`) was REJECTED by `rebuild/lanes/b/S9-RELEASE-SPEC-REVIEW-R1.md`
(`f0dc366`) on four blocking findings and ten notes. This version answers every one of them by name
in the new section **R1**, at the end of the document, and carries the fixes into the body. The
second author re-measured each finding on the PC rather than taking the reviewer's word for it;
where a finding's substance held and only its evidence was short, that is said out loud.
Three findings are FIXED as asked, one is FIXED differently from the reviewer's recommendation with
the reason stated, and nothing is disputed away.

Lane B tooling, SPEC ONLY. Authors: cowork (Earned lane hand) v1, cowork (Earned lane hand) v2,
2026-09-19, worktree `%TEMP%\earned-s9` on `rebuild/b-s9-ui-pins`, cut from the chain tip `9e1ece8`
(`rebuild/t2-client-core`).
This round authors exactly one file: this one. No runner, package, test, workflow or product byte moves.

Rule of record: `DECISIONS:536` ("Yes, release the screen files"). Standing seal rule: `DECISIONS:455`.
Design of record: `DECISIONS:530`. Gate audit: `DECISIONS:531`. Hotfix pattern: `DECISIONS:535`.
Parent package: `M2-S8-REAL-SHAPE`, sealed and merged at `DECISIONS:529`.

This is a hypothesis for the PM and for one independent review, not evidence. Every claim below
carries a `file:line`. Where I could not measure a thing I say so by name.

---

## 0. THE MEASUREMENT THAT CHANGES THE SHAPE OF THE ROUND

`DECISIONS:536` names eight release candidates. **Five of the eight are not sealed today.**
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
| `today/index.shell.html` | NO (same) | already free; nothing to release |

So the CLOSED LIST the ruling asks for is not eight paths. It is at most three, and after reading
the files it is **two**. Everything else the ruling names is already outside the seal and lane C can
edit it today without a reseal child. That is the single most load-bearing fact in this document,
and it is the reason section E's order of work can start now.

The ruling's estimate ("about 1.5 to 2 weeks down to about 1 week") does not follow from a two-path
release on its own. What it follows from is section A's finding about `today-app.cjs`. See F, OWNER-1.

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

**The split that would release it later** (named, NOT performed in this round):

| new file | what moves into it | what stays in `today-app.cjs` |
|---|---|---|
| `today/today-view.cjs` (RELEASED) | every `render*` function, the `[data-go]` router (`:826`), the markup builders, the copy slots, the sheet layout, the `ARROW` glyph (`:37`) | nothing of these |
| `today-app.cjs` (stays SEALED) | the five lane openers (`:513`, `:596`, `:637`, `:2052`, the check-in lane at `:1416`), `recordIntake` (`:1278`), `recordSleep` (`:1807`), the weigh-in submit (`:1059`), `workoutRebinding` (`:363`), `rebase` (`:2501`) | the view is HANDED a callback table; it never sees a host |

The split is a real product change with a real behaviour risk (the handler wiring is what
`DECISIONS:454` round 2 found broken once already), so it is a lane D or lane C ticket with its own
review, not a tooling hunk. It is not S9's work and this spec does not propose it for S9.

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
release as ruled buys C-UI-1 and C-UI-8 their freedom and buys nobody else theirs. This is the
finding the PM most needs and it is why F carries OWNER-1.

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

`today/build.mjs` builds the page, so it is RELEASED by the ruling's working rule. It also carries
five laws that are not presentation:

| law | line | what it refuses |
|---|---|---|
| `FORBIDDEN` | `build.mjs:79` | modules the page may not pull into the bundle |
| `REQUIRED_INPUTS` | `build.mjs:98` | the bundle input inventory |
| `assertNoNetworkReference` | `build.mjs:209` | any remote origin in the emitted assets |
| `assertNoNodeOnlyGlobals` / `NODE_ONLY` | `build.mjs:244-249` | a bundle that only runs under Node |
| `assertImportRouteIsolation` | `build.mjs:384` | the Import route leaking into the Today entry |

Released, a lane C ticket can edit any of those five in the same PR as a stylesheet swap. So the
question is not "is the law in a released file" but "is the law ALSO asserted, by its own literals,
inside a cell that stays sealed". v1 answered yes for all five in one sentence. R1 BLOCKING-3
measured it and found four of five, not five. **Re-measured here on the PC, cell by cell:**

| law (`build.mjs`) | asserted by a SEALED cell's OWN literals? | where |
|---|---|---|
| `FORBIDDEN` `:78-:93` | YES | `today/test/package.test.cjs:76-:80` (`seed.cjs`, `index.cjs`, `engine/test/`, `authority/`, `ledger/`, `src/history.js` by literal), `:84` `assert.throws(build.assertBundleInputs([{path:'rebuild/engine/seed.cjs'}]))`; and independently `import/test/page-bundle.test.mjs:54-:61` `STILL_FORBIDDEN`, which carries its own copy including `src/history.js` and `rebuild/conform/*` |
| `assertImportRouteIsolation` `:384` | YES | `package.test.cjs:94-:107` plants an import-statement edge and requires `IMPORT-ROUTE FAIL` |
| `assertNoNetworkReference` `:209` | YES | `package.test.cjs:127-:138` (four bad literals, each must throw `NETWORK-REFERENCE FAIL`) |
| `assertNoNodeOnlyGlobals` `:244-:249` | YES | `copy.test.mjs:207`, `:264`, `:303` |
| `REQUIRED_INPUTS` `:98` | **NO, for 26 of its 51 entries** | `package.test.cjs:59-:60` names six entries by literal (`engine/today.cjs`, `energy.cjs`, `writers.cjs`, `client/index.cjs`, `ops.cjs`, `store.cjs`) and `:72-:73` counts the engine inputs at 15 and the client inputs at 12. There is NO count and NO literal for the `rebuild/m3/w7-preview/today/**` half |

The `REQUIRED_INPUTS` gap, measured rather than argued: the constant holds **51 paths, 26 of them
under `rebuild/m3/w7-preview/today/`** (`today-model.cjs`, `today-app.cjs`, the three gym modules,
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

With H18, and only with H18, the sentence in the token line's brief is true: **all five build laws
keep their teeth from a sealed cell even though the file that implements them is free.** Without
H18 the honest list is one path, not two (R1's option (b)), and F.2 STOP-4 fires.

### A.5 Files the C-UI tickets touch that are NOT sealed today (no release needed, and one warning)

| path | ticket | already free? | note |
|---|---|---|---|
| `today/screens.template.html` | 2,3,4 | yes | markup only, 508 lines |
| `today/design.cjs` | 1 | yes | the design-of-record pins live here; section C |
| `today/browser-check.mjs` | 1 | yes | `browser-check.mjs:60` reads `design.headlineVocabulary()`; stale-red at the tip (`DECISIONS:535`) |
| `today/today-model.cjs` | - | yes | **computes AND writes** (v1 said only "computes"; R1 N10 is right and I re-measured it): `today-model.cjs:120` `planMove`, `:128` `projectionOf` compute; `:378` `async function weighIn(lb)` writes through `readings.weighIn(...)` at `:395`, behind the admission refusals `ALREADY_RECORDED` `:365` and `OUT_OF_RANGE` `:373` and the form bounds `FORM_MIN`/`FORM_MAX` `:372`. By :536's own words ("any file that calls `logSet` or writes state") it is a SEALED-class file standing outside the seal, in the SAME bucket as the next two rows. See F, Q3 |
| `today/gym-model.mjs` | 4 | yes | **`gym-model.mjs:502` `async function logSet(...)`**; by :536's own words ("any file that calls `logSet`") this is a SEALED-class file standing outside the seal. See F, Q3 |
| `today/machine-settings-view.mjs` | 5 | yes | render only (`:124`, `:154` are DOM appends) |
| `today/checkin-*.mjs` | 2 | yes | `checkin-app.mjs:150` `await model.save()`; SEALED-class, outside the seal. See F, Q3 |
| `today/food-model.cjs`, `food-commands.cjs`, `sleep-*` | 7 | yes | model and command layers, outside the seal |
| `rebuild/slice/pwa/**` | 8 | yes | `DECISIONS:536` says so. **Said out loud, per R1 N6:** `rebuild/slice/pwa/build-pwa.mjs:19` does `import { buildToday, DIST as A1_DIST, ROOT } from "../../m3/w7-preview/today/build.mjs"`, and nothing under `rebuild/slice/` is in `product` or `executionPins`. So releasing `build.mjs` makes the DEPLOYED PWA's build chain unsealed end to end. That is a consequence of the ruling, not a surprise inside it, and the S9 brief must state it in one sentence rather than let a later reader discover it |

### A.6 THE CLOSED LIST

```
rebuild/m3/w7-preview/today/preview.css
rebuild/m3/w7-preview/today/build.mjs
```

Two paths. Both are in the S8 sealed inventory; both are named verbatim in the S9 spec and in the
PM token line; neither is a pattern. Nothing else in `DECISIONS:536`'s candidate list is sealed, and
`today-app.cjs` fails the ruling's own test.

**The second path is CONDITIONAL, and the condition is code, not intent (v2, R1 BLOCKING-3).**
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
| H7 | `product()` | after `:1895`, and the bucket initialiser at `:1888` | `if (pin.role === 'released') { at.released.push(file); continue; }` placed BEFORE `const disk = diskSha(file)`, which is **`:1952`** (v1 said `:1961`; that is a comment line inside the nine-line block above `:1962`, R1 N2, corrected). The same hunk adds `released: []` to the seven-array `at` initialiser at `:1888` (R1 N8) | a released path is never hashed by fidelity; it can never reach `:1970` drift. Precedent for the `continue` one line above the cite: `:1951` already does exactly this for a `new` pin with `post === null`. It skips only `:1912-:1916` (`pinned-unchanged` mislabelling) and `:1943-:1949` (`PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE`, whose `noChange` is false when `post === null`), so it loses nothing for a released pin |
| H8 | `product()` terminal | `:1966` say() | new clause: `N released under DECISIONS:<at>, each at the sha256 <parent> sealed it at, not hashed here` | said out loud on every run |
| H9 | `product()` | `:1889` loop entry | assert the released set equals `releaseRuling().granted` | ledger and spec cannot drift apart |
| H10 | `proposed()` | `:2826` | `product` excludes released entries; new `released` block built from `s.product` + the ruling | B.4 |
| H11 | `ARTIFACT_KEYS` | `:2830` | add `'released'` | closed artifact keys |
| H12 | `writeSealedRunReceipt()` | `:2993` | skip `pin.role === 'released'` when building `product` | B.6 |
| H13 | `sealedRunReceipt()` | `:2970`, `:2972` | both directions skip released paths | B.6 |
| H14 | `IDS` | `:173` | `'S9'` behind `'S8'` | section E |
| H15 | `NO_REGISTER_IDS` | `:316` | `'S9'` | section E |
| H16 | `CHILD_ROOTS` | `:405` | see section E | section E |
| **H17** | `pins()`, the GRANDPARENT walk | `:1852` | a second `continue` for any path in `releasedAncestry(a)`, the union of the `released` blocks of the artifacts this walk already reads | **B.3. Without it the release lasts exactly one generation and then re-seals itself at the S8 pin with no ledger line.** R1 BLOCKING-1 |
| **H18** | `today/test/package.test.cjs` (a sealed cell, not the runner) | new cell in the file | its own literal list of the 26 `rebuild/m3/w7-preview/today/**` entries of `build.mjs`'s `REQUIRED_INPUTS`, asserted both against `build.REQUIRED_INPUTS` and against `result.inputs` | **A.4. Four of the five build laws are already asserted by sealed cells' own literals; `REQUIRED_INPUTS`' today half is asserted by nothing outside the file being released.** R1 BLOCKING-3 |

Eighteen hunks. H14 to H16 are the ordinary reseal-child three that S8 also had
(`S8-PREP-AUTHOR-REPORT.md:60-73`). The release mechanism is H1 to H13 plus **H17**; **H18** is the
price of the second path in the closed list and is a test cell, not a runner change. H17 and H18
are both v2, both from R1.

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

All but one of these are `rebuild/lanes/b/tooling/test/` cells, already in `TOOLING_FILES` (`:355`)
for the existing five; the new file must be ADDED to `TOOLING_FILES` in the same hunk or `fidelity()`
`:2010-:2011` calls it `UNLISTED-SOURCE-CHANGE`. **That is the easiest hunk in this list to forget.**
The exception is the H18 row: `today/test/package.test.cjs` is a SEALED product file and execution
pin (`1a29e3e0...`), so it is edited as an S9 declaration with `role: "edited"` and a real post, not
as a tooling file.

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
| `measure/test/boundary.test.mjs` `:179-:180` `P3_IMPORT_UI_2_UNSEALED = ['.../preview.css', '.../build.mjs']`, used by the loop at `:185-:190` | **RE-HOMED as a lane C behaviour cell, and the two names REMOVED from the S4-drift assertion in S9** | the loop asserts (a) `Object.hasOwn(product, f) === false` (`:186-:187`) and (b) `shaOf(f) === declaredPost(f)` (`:188-:189`). (a) stays TRUE after the release and needs no change. (b) goes red the first time lane C edits either file, because `declaredPost` only accepts a spec whose `post` is a string and S9 declares `post: null`. `:188` is therefore a byte pin over a released file and must go. S9 removes the loop `:185-:190` and the constant `:179-:180` and states in their place that both paths are RELEASED by `DECISIONS:<token line>`. The BEHAVIOUR these two files owe is then asserted where it always was: the build laws in `today/test/copy.test.mjs` and `today/test/package.test.cjs` (with H18), both SEALED |
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
| the no-dash rule | `today/plain-copy.cjs`, `today/dash-check.mjs`, `build.mjs` (`assertNoAiDashesInAssets`, `build.mjs:31`) | `today/test/copy.test.mjs` (20 tests) | the A1/A2/A3/A4 step, `.github/workflows/rebuild.yml:231` (its `- name:` line; v1 said `:232`), 17 cells named by exact path | ubuntu + windows (`rebuild.yml:22` `os: [ubuntu-latest, windows-latest]`, `:24` `runs-on`) |
| the verbatim copy locks | `design.cjs:65` `PREVIEW_COPY`, `:77` `APPROVED_COPY`, `:112` `RUNTIME_COPY`, `:125` `CHECKIN_RUNTIME_COPY`, `:145` `PREVIEW_RUNTIME_COPY`; asserted by `design.assertDesignBinding` `design.cjs:527-:554` | `today/test/design.test.cjs:70`; and at BUILD time by `build.mjs:472` | same step, plus every build | both |
| the design-of-record sha256 pins | `design.cjs:43-:47` `APPROVED`, checked in `readApproved` `design.cjs:338-:341` (`APPROVED-PIN FAIL`) | `today/test/design.test.cjs:15` and `:31` (one-byte tamper must throw) | same step | both |
| the font pins | `design.cjs:54` `FONTS` + `rebuild/m4/workout/fonts/SOURCES.json`, `readFonts` `design.cjs:351-:361` | `today/test/design.test.cjs:52` | same step | both |
| `headlineVocabulary` | `design.cjs:588-:599` (reads the engine's own title literals) | `today/test/copy.test.mjs:149`; and on a real browser by `browser-check.mjs:60` | copy.test.mjs in the same step; `browser-check.mjs` has **no CI step** and is stale-red at the tip (`DECISIONS:535`) | both / none |
| the RIR lock (`BRIEF-RIR-DISPLAY`) | `today/gym-model.mjs:27`-`:34` `EFFORT_CHOICES`, `:227`/`:251` the `rir` field | `today/test/gym.test.mjs:59`, `today/test/ntc-h6-delta.test.mjs:60`, `today/test/machine-settings-ui.test.mjs:49`, `today/test/problem.test.mjs:475` | same step | both |

**Why a lane C ticket cannot silently drop them:** all six rows are executed by cells that stay in
the S8/S9 sealed inventory AND in `executionPins`. A lane C branch that edits one of those cells
moves a sealed byte, so `product()` `:1970` buckets it as drift and `:1972` refuses; and the fence in
section D refuses the diff before CI even gets there. The `browser-check.mjs` row is the exception
and it is already broken: it is unsealed, unrun by any workflow, and stale-red. See F, Q4.

### C.5 What pins the design of record: the measurement, not the reassurance (v2, R1 BLOCKING-4)

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

**The ruling, and it is cheap.** S9 declares five more paths with role **`pinned-unchanged`** and
`pre === post` at the bytes they stand on. `pinned-unchanged` is the correct role by `product()`
`:1908` and `:1967`: the parent pins none of them, S9 does not write them, and S9 declares, runs
over and leaves them alone. (`new` would be refused by `:1943-:1949` for a file with `pre === post`
that this package does not move.)

```
rebuild/m3/w7-preview/today/design.cjs
rebuild/m1/approved-2026-09-08/Earned-refinement-A.html
rebuild/m1/approved-2026-09-08/Earned-additions-C-approved.html
rebuild/m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md
rebuild/m1/MOCK.md
```

The fifth, `MOCK.md`, is mine rather than R1's: `design.test.cjs:185-:187` reads it as part of the
same cross-check, so leaving it unsealed leaves one of the three files that "move together" free to
move. Seal all five or the cross-check is still only as strong as its weakest unsealed file.

That is five lines in `packages/S9.json` and no new mechanism: it makes `design.cjs` and the two
references sealed bytes, so `product()` `:1970` refuses a coordinated edit of the file and its
constant, which is what makes the owner's sentence true rather than hopeful. It is a SCOPE decision,
so it is Q7 for the PM with my recommendation attached, and if the PM prefers zero scope growth it
goes to the owner beside OWNER-1 in the words OWNER-3 uses.

Note the direction: this SEALS five paths in the same package that RELEASES two. That is not a
contradiction; it is the ruling working as intended. Presentation leaves the seal, and the thing the
owner said must stay pinned actually becomes pinned.

**And if `design.cjs` itself were ever released:** then nothing would pin the design of record, since
the pins ARE `design.cjs`'s constants. The answer to the assignment's question is therefore: do not
release `design.cjs`; seal it. The build-time re-enforcement in `build.mjs:472` becomes lane C's to
edit after the release (that is the cost named in A.4), so the cell side is the only side that can
be relied on, and the cell side is only worth anything if what it reads is sealed too.

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
| what it asks | of every path in `git diff --name-only <merge-base with origin/rebuild/t2-client-core> HEAD`, is any path a key of the CURRENT sealed inventory and NOT in that inventory's `released` block? |
| how it learns the inventory | **v2, R1 BLOCKING-2: OUT OF GIT AT THE CHAIN REF, never from the worktree.** `git show refs/remotes/origin/rebuild/t2-client-core:rebuild/m4/spec/acceptance-s<N>-*.json`, the same ref the runner fixes at `b-package.cjs:189` (`CHAIN_REF`) and re-reads on every call with NO CACHE for exactly this reason (the r10 F4 lesson, `:1195-:1200`, and the read itself at `:1201`). Which N: **parse the integer after `acceptance-s` in the file name and take the numeric maximum** (a lexical walk puts `s10` before `s9`; R1 N9); if two artifacts carry the same N the cell FAILS `FENCE-AMBIGUOUS-INVENTORY` naming both, rather than picking one. It reads `product`, `executionPins` and `released`. It carries no hash and no path list of its own, so it cannot go stale the way `boundary.test.mjs` did |
| why not the worktree (the R1 finding, restated so nobody re-introduces it) | v1 said "the youngest sealed artifact present in the tree". The tree is the lane C branch's own worktree, so a branch that wanted to touch a sealed path could add that path to the artifact's `released` block, or edit its `product` map, and the fence would measure the change against an inventory the change itself wrote. Nothing else catches it: the artifact is NOT a key of its own `product` map (an artifact does not pin itself, confirmed by parsing `packages/S8.json`), so `product()` never hashes it; `fidelity()` `:2010` explicitly exempts `f === ARTIFACT` from `UNLISTED-SOURCE-CHANGE`; and the only thing that notices, `sealedRunReceipt()` `:2963`, does not fail the run - it reports `SEALED-RUN-RECEIPT-VOID` at `:3196-:3198` and asks for a FULL run. A fence whose fenceposts move with the animal is not a fence |
| the artifact-tamper check | the cell ALSO refuses when the artifact it reads at the chain ref and the artifact of the same path in the worktree differ: `FENCE-INVENTORY-DIFFERS-FROM-CHAIN`. A branch legitimately changing a sealed artifact is a reseal child, which the skip row below already handles, so the two rules do not collide |
| what it does on a reseal child branch | a branch whose diff contains `rebuild/lanes/b/tooling/packages/S<N+1>.json` is a reseal child and the cell SKIPS with a printed reason. A reseal child is exactly the thing allowed to move sealed bytes |
| what it does with no network | `git merge-base` against `refs/remotes/origin/rebuild/t2-client-core`; if that ref is absent (a shallow clone) the cell FAILS with `FENCE-CHAIN-REF-ABSENT` rather than passing vacuously. `rebuild.yml:35` already sets `fetch-depth: 0` |
| red first | (1) a branch touching `today/today-app.cjs` FAILS naming that path; (2) a branch touching `today/preview.css` PASSES after S9 and FAILS before it; (3) a branch touching `today/screens.template.html` PASSES (never sealed); (4) a deleted `origin/rebuild/t2-client-core` ref FAILS, not passes; (5) a reseal-child branch SKIPS with its reason printed; **(6) v2, R1 BLOCKING-2: a branch that edits the sealed artifact IN ITS WORKTREE to widen `released` (or to drop a path out of `product`) and then touches that path FAILS, both because the inventory is read at the chain ref and because the worktree artifact differs from it. This is the cell that proves the fence is not self-certifying, and it is the one to write first**; **(7) two artifacts with the same N present at the chain ref FAIL `FENCE-AMBIGUOUS-INVENTORY`; `acceptance-s10-*.json` beside `acceptance-s9-*.json` selects s10, not s9 (the numeric-max rule, R1 N9)** |
| where it runs | a new `rebuild.yml` step beside the A1/A2/A3/A4 step (`rebuild.yml:231`), named by exact path, never globbed (`DECISIONS:117 (4)`, `:186 (3)`). `rebuild.yml` is a sealed path (it is in `acceptance-s8-real-shape.json`), so the step lands inside S9 and nowhere else |
| what it is NOT | it is not a replacement for `--ci --package S<N>` at `rebuild.yml:150`. That step proves BYTES; this one proves INTENT, in one sentence a human can read in the CI log: "this change touched 3 sealed paths: ..." |

### D.3 Why this belongs in S9 and not later

`rebuild.yml` is sealed. Adding a step to it is a sealed-byte move, so it happens in a reseal child
or not at all. S9 is the reseal child that releases the paths; shipping the release without the
fence would leave one round in which "lane C touched only released paths" is enforced by nothing but
the PM reading a diff. The fence and the release are one change.

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
| **16** | **H18**: `today/test/package.test.cjs` declared `role: "edited"` with a real post, carrying the 26-entry `REQUIRED_INPUTS` literal for `rebuild/m3/w7-preview/today/**`; its execution pin moves with it | A.4, R1 BLOCKING-3 |
| **17** | **The five design-of-record paths** declared `role: "pinned-unchanged"`, `pre === post`: `today/design.cjs` and the four `rebuild/m1/` files (two approved references, the handoff, `MOCK.md`). This adds `rebuild/m1/` to the sealed inventory for the first time, so expect the S9 brief to say so by name | C.5, R1 BLOCKING-4, subject to Q7 |

### E.1 What S9 carries besides the release (context, not this round's build)

C-UI-1 from `rebuild/c-ui-port`; the Today carry lane `rebuild/c-s9-today-carry` (the S2 sentence
fix, the hotfix cell's CI home, the `adapter.test.mjs` identity lines, `DECISIONS:535`); the
passphrase normalisation lane `rebuild/c-passphrase-normalize` (import path, stays SEALED); the
`rebuild/lanes/d/p3-layout-v2` root and its two cells (`layout-v2.test.mjs`,
`projector-parity.test.mjs`, `DECISIONS:524` N1); and this release.

### E.2 THE ORDER OF WORK, so S9 preparation starts NOW

C-UI-1 is not PR-READY (`DECISIONS:531` blocks its seal until the gates are fixed and re-audited).
Preparation does not have to wait, because **nothing in the release depends on C-UI-1's bytes**: the
release names paths, not contents.

| phase | work | depends on C-UI-1? |
|---|---|---|
| **NOW, day 1** | this spec accepted; the PM writes the `RELEASE-FROM-SEAL` token line (B.2) and the THEME line for `M2-S9-UI-PINS` | no |
| **NOW, day 1-2** | runner hunks H1 to H13 **and H17** (section B.5), red first, with `release-from-seal.test.cjs` failing on today's runner before any hunk lands. **H17 and its grandparent cell (11) are written in the SAME sitting as H10**, because H10 is what creates the hole H17 closes | no |
| **NOW, day 1-2** | the D.2 fence cell, red first, **starting with red-first row (6)** (the worktree-artifact tamper), and its `rebuild.yml` step drafted | no |
| **NOW, day 1-2** | **H18**: the 26-entry `REQUIRED_INPUTS` literal in `today/test/package.test.cjs`, red first by deleting one entry from `build.mjs` and watching every existing cell stay green | no |
| **NOW, day 2** | the five design-of-record declarations (C.5), if the PM answers Q7 yes. They are `pinned-unchanged` pins measured from Git; no code | no |
| **NOW, day 2** | facts 1 to 7 and 12 of E (IDS, NO_REGISTER_IDS, CHILD_ROOTS, the six `s9-*` cells, F6/F7, the ancestor re-pins, the five `CHILD_SPECS` cells). All are name-for-name mirrors of S8 and depend on nothing lane C does | no |
| **NOW, day 2** | `boundary.test.mjs`'s `P3_IMPORT_UI_2_UNSEALED` removal (C.2), red first | no |
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
| R1 | the release buys almost nothing, because six of seven remaining tickets still touch `today-app.cjs` | C-UI-2 opens a PR, `--ci --package S9` refuses `UNLISTED-PRODUCT-DRIFT`, the ticket needs S10 | A.2 names the split; F OWNER-1 puts the choice in front of the owner before S9 preparation finishes |
| R2 | a released path re-enters `executionPins` through a child argv target | `proposed()` `:2800` silently re-pins it; the next child inherits it and nobody notices for a generation | B.6 makes it an assertion in H9's neighbourhood; cell (8) of `release-from-seal.test.cjs` is red-first for it |
| R3 | the byte-identity `--full` re-verify voids for ever | `SEALED-RUN-RECEIPT-VOID rebuild/m3/w7-preview/today/preview.css` on every authorized rerun after lane C's first stylesheet edit; every rerun becomes a FULL run with the private census | H12 and H13; cell (10) is red-first for it. **If this is missed, the seal chain silently loses its cheap re-verify step** |
| R4 | the new tooling cell is not added to `TOOLING_FILES` (`:355`) | `fidelity()` `:2011` calls it `UNLISTED-SOURCE-CHANGE` on the first `--ci` run | said in B.8; it is one line and it is the easiest to forget |
| R5 | the artifact recomputation `:3021` refuses because `proposed()` and the hand-written artifact disagree about the `released` block's key order or shape | `SEALED-PROFILE-RECOMPUTATION` | the artifact is never hand-written; it is `proposed()`'s output |
| R6 | fact 8: the S8 RECEIPT sha (`3b1b8b91...`, `DECISIONS:529`) is cited where the S8 ARTIFACT sha belongs | the parent block is wrong and `parent()` refuses late, after a long run | fact 8 names the trap; the artifact sha must be re-measured from Git in the round, never copied |
| R7 | `browser-check.mjs` is stale-red and unrun (`DECISIONS:535`), so `headlineVocabulary` has no browser-side enforcement | a copy regression reaches the phone and only `copy.test.mjs`'s jsdom render catches it | Q4 |
| R8 | timing flake on an 8-core PC shared with other lanes and the design chat | a suite that is green twice and red once | ONE re-run, reported as such. Never "fixed" by loosening anything |
| **R9** (v2) | H17 is built but its skip is written too WIDE (for example keyed on the file name, or on any artifact found on disk rather than the ones `pins()` reads) | nothing shows. The chain stays green and a grandparent pin stops being asserted for a path nobody released | cell (11)'s second half: in the same fixture, a DIFFERENT grandparent pin whose bytes moved must still refuse. A widened skip turns that cell red |
| **R10** (v2) | the fence is built to read the artifact from the worktree after all, because it is easier | the fence passes on exactly the branch it exists to stop | D.2 red-first row (6) is written FIRST, before the fence has a happy path at all |
| **R11** (v2) | Q7 is answered "no scope growth" and the design-of-record hole is recorded and then forgotten | the new look lands, a reference HTML and `design.cjs` move together, and nobody notices for a generation | C.5 is written so the PM must answer it, and OWNER-3 puts it in the owner's own words if the PM declines |

### F.2 STOP conditions (the round stops and reports rather than proceeding)

1. The `RELEASE-FROM-SEAL` token line does not exist on `rebuild/t2-client-core`, or hashes to more
   than one line, or does not end in ` RULED`. No release without it; `DECISIONS:536` (2) requires it.
2. **AMENDED IN v2, by name, and narrowed rather than loosened (R1 BLOCKING-1).** Any hunk would
   have to touch `held()` (`:1828-:1833`), the drift assert (`:1972`) or the completeness walk
   (`:1975`) to make the release work. Those three are the seal; if the design needs them moved, the
   design is wrong and the PM hears that instead. **`pins()` (`:1834`) is admitted for H17 and for
   H17 only:** ONE `continue` at `:1852`, in the grandparent walk, keyed on a path that appears in
   an ancestor artifact's `released` block, which only a RULED PM token line can put there. No
   assertion inside `held()` changes, the parent walk `:1837-:1839` is untouched, and every
   grandparent pin not named in a `released` block still gets `:1830` and `:1831`. **Any OTHER
   change to `pins()` stops the round.** v1's STOP-2 as written would have stopped this spec by its
   own rule; saying so in the amendment is the point of amending it by name rather than quietly.
3. `--ci --package S9` refuses for a reason the brief did not predict. That is a finding, not a fix.
4. A cell over a released file cannot be re-homed honestly (C.2). Then the file is not released and
   the closed list shrinks.
5. The owner's answer to OWNER-1 is "do not split `today-app.cjs`" AND the PM still wants the
   1-week estimate. Those two are incompatible and the PM is told so in one sentence.
6. **(v2)** H18 cannot be written so that it goes red on a deleted `REQUIRED_INPUTS` entry, or the
   PM drops it. Then `build.mjs` leaves the closed list, the list is one path, and the token line is
   rewritten before it is ever written. The release does not ship with a law whose only guard is the
   released file itself.
7. **(v2)** The fence cannot read the sealed artifact out of Git at `CHAIN_REF` on a GitHub runner
   (for example the checkout leaves no `refs/remotes/origin/...`). Then the fence is not shipped as
   a passing cell: it either fails loudly with `FENCE-CHAIN-REF-ABSENT`, which is the designed
   behaviour, or the round reports that the fence cannot be built honestly and the PM decides. A
   fence that reads the branch it is fencing is worse than no fence, because it reads as one.

### F.3 Estimate for the S9 PREPARATION round (lane B, one author, one independent review, one fix round)

| work | hours |
|---|---|
| H1 to H13 runner hunks, red first | 4 |
| **H17, the grandparent skip, with `releasedAncestry()`** (v2) | 1 |
| `release-from-seal.test.cjs` (12 red-first cells, including the two-artifact grandparent fixture) | 4 |
| **H18, the 26-entry `REQUIRED_INPUTS` literal in a sealed cell, red first** (v2) | 1 |
| the D.2 fence cell + its `rebuild.yml` step, red first, now reading the inventory out of Git at the chain ref and refusing a worktree artifact that differs | 4 |
| **the five design-of-record declarations (C.5), measured from Git** (v2, if Q7 is yes) | 1 |
| facts 1 to 7 and 12 (IDS, NO_REGISTER_IDS, CHILD_ROOTS, six `s9-*` mirrors, F6/F7, seven ancestor re-pins, five `CHILD_SPECS` cells) | 4 |
| `boundary.test.mjs` re-home (C.2) | 1 |
| `packages/S9.json` + needle table, measured by running each child | 5 |
| `S9-UI-PINS-BRIEF.md` + the three token line texts with their sha256 | 3 |
| `--ci --package S9` to its predicted refusal, plus the author report | 3 |
| independent review + one fix round | 6 |
| the re-measure when C-UI-1 lands | 2 |
| **total** | **39 hours, about 5 working days of lane B time** |

v1 costed this at 34 hours. v2 adds 5: one for H17, one for the two extra red-first cells in
`release-from-seal.test.cjs`, one for H18, one for the fence's chain-ref read and its tamper row,
and one for the five design-of-record declarations. R1 suggested "add two hours for H17 and its
cell"; I make it five across the four findings, because BLOCKING-2 and BLOCKING-3 each add work too
and a review round that found four blocking items deserves an estimate that admits them. If the PM
answers Q7 "no scope growth", subtract one hour and the figure is 38.

This is preparation only. It excludes the PM's token lines, the `--full` with the private census,
the receipt, the chain merge and the slice deploy, which `DECISIONS:455` costs at roughly half a day
plus one FULL on the PC.

### F.4 Open questions for the PM, each with a recommendation

| # | question | my recommendation |
|---|---|---|
| Q1 | The closed list is two paths (`preview.css`, `build.mjs`), not the eight `DECISIONS:536` names, because five are already unsealed and `today-app.cjs` fails the ruling's own test. Does the PM accept a two-path list, or re-open the list with the owner? | **Accept the two-path list and tell the owner plainly what it buys** (C-UI-1 and C-UI-8 ship as lane C; the rest do not). Re-opening the list without the A.2 split would mean releasing a file that writes to the athlete's store, which the owner's own ruling forbids. |
| Q2 | **REWRITTEN in v2.** Is `build.mjs` released, given it carries five build laws (A.4), of which FOUR are asserted by sealed cells' own literals and the fifth (`REQUIRED_INPUTS`, 26 of its 51 entries under `today/`) is asserted by nothing outside the released file itself? | **Yes, release it, but only with H18 in the same package.** H18 puts the 26 entries into `today/test/package.test.cjs` as that cell's own literals, and that cell stays sealed. Without H18 the honest answer is no: drop `build.mjs` and release one path. Either way, say which it is in the token line's brief so no later reader thinks the laws were given away. |
| Q3 | **WIDENED in v2 to FOUR files, one question with one answer (R1 N10).** Four files that write, or that prove writing, stand OUTSIDE the seal today: `today-model.cjs` (`:378` `weighIn` writing through `readings.weighIn` at `:395`, with the admission refusals at `:365` and `:373` - it writes as well as computes, which v1 got wrong), `gym-model.mjs` (`:502` `logSet`), `checkin-app.mjs` (`:150` `model.save()`), and `browser-check.mjs` (the ONLY proof in the tree that a reading survives a real `taskkill /F /T`, `:357-:409`, and that nothing of record sits in `localStorage`, `:291-:292`). By `DECISIONS:536`'s own vocabulary all four belong inside the seal. Does S9 seal them? | **Declare `gym-model.mjs` and `checkin-app.mjs` in S9 (role `pinned-unchanged`), and put `today-model.cjs` and `browser-check.mjs` to the PM as one decision with them rather than in a separate bucket.** My recommendation on the second pair is unchanged in substance but is now stated as a trade, not a technicality: `today-model.cjs` was deliberately taken out one week ago by the accepted hotfix (`DECISIONS:535` (a)) and re-sealing it in S9 re-closes a door the PM opened on purpose, so I would carry it as a note for S10 rather than reverse a week-old decision inside a release round; `browser-check.mjs` is stale-red and has no CI home, and sealing a stale-red file pins a broken byte, so it needs Q4 answered first. If the PM prefers zero scope growth on all four, record it as a carried note the way `DECISIONS:524` N1 was carried, and say in the S9 verdict that four writing files are outside the seal, because that sentence is the finding. |
| Q4 | `browser-check.mjs` is unsealed, has no CI step and is stale-red at the tip (`DECISIONS:535`), yet it is the only browser-side enforcement of `headlineVocabulary` and `assertNoDashOnScreen`. C-UI-1 will rewrite it. | **Give it a CI home in S9 or record out loud that it has none.** `DECISIONS:186 (3)`: a file with no CI home is a file nobody runs. It needs a real browser binary, which no GitHub runner has, so the honest answer is probably "no CI home, run on the PC before each seal, recorded in the verdict" rather than a step that cannot exist. |
| Q5 | Should the fence cell (D.2) live under `rebuild/lanes/c/ui-port/` (lane C owns it, lane C's CI) or `rebuild/lanes/b/tooling/test/` (lane B owns it, already in `TOOLING_FILES`)? | **`rebuild/lanes/c/ui-port/`.** It fences lane C, it must run on lane C's branches, and putting it in `TOOLING_FILES` would exempt it from the very inventory check it performs. It needs a new `CHILD_ROOTS` entry either way (fact 3). |
| Q6 | The `released` block records `lastSealedSha256`. Should it also record the sha256 the path stands at when S9 seals? | **No.** Recording a post-image is a pin by another name, and a reader who wants that can take it from Git at S9's own commit. The block should record where the SEAL stopped, not where the file happened to be. |
| **Q7** (v2, from R1 BLOCKING-4) | The design of record is currently pinned by nothing the seal holds: nothing under `rebuild/m1/` and not `design.cjs` is in S8's `product` or `executionPins`, so `design.test.cjs` compares one unsealed file against another unsealed constant. The owner's trade in `DECISIONS:536` assumes otherwise. Does S9 declare the five paths in C.5, or does this go to the owner? | **Declare the five (`design.cjs` and the four `rebuild/m1/` files) as `pinned-unchanged`.** It is five measured lines, no new mechanism, one hour, and it is the difference between the owner's sentence being true and being hopeful. It is also the right moment: it lands in the same package that frees the presentation files, which is exactly when the design lane starts moving fast. If the PM wants zero scope growth, OWNER-3 puts it to the owner in his words. |
| **Q8** (v2) | H17 admits a `continue` inside `pins()`, which v1's own STOP-2 forbade outright. The PM should ratify the amended STOP-2 (F.2) rather than let an author narrow a stop condition on their own judgement. | **Ratify it as written, or refuse the release.** Those are the only two coherent options: without the skip the release self-reverses at S10, and there is no way to build the release that leaves `pins()` completely untouched. If the PM is uncomfortable, the honest alternative is not a cleverer hunk; it is to tell the owner the release cannot be built under the current stop conditions. |

### F.5 OWNER calls

**OWNER-1: the Today screen file.**
Plain words: there is one big file behind the Today screen. It does two different jobs at once: it
draws the screen, and it saves what you enter (your weight, your food, your sleep). The new look
needs to change the drawing half in six of the seven remaining design tickets.

Because that one file also saves your data, the rule you set last night keeps it locked, so six of
the seven tickets still need the slow three-to-four-hour locked-package round each. The release you
approved frees the stylesheet and the page builder, and that frees the first ticket and the last
one. It does not free the other six.

There are two ways forward and only you can pick:

- **(a) Split the file first.** Someone separates "draws the screen" from "saves the data" into two
  files, with its own build and its own independent review. Cost: roughly one to two extra days
  before the look starts landing. Gain: after that, six tickets ship the fast way, and the saving
  half stays locked exactly as it is now. This is the option that makes the "about one week" figure
  real.
- **(b) Do not split.** The look still lands, but six tickets each ride a locked-package round.
  Cost: roughly the original one and a half to two weeks. Gain: nothing changes about how your data
  is protected, and nobody touches the saving code at all.

My recommendation: **(a)**, with the split done as its own small ticket with its own review, and
with a rule that the split moves drawing code only and not one line of saving code. Your data
protection is identical either way; the difference is speed and one extra review.

**OWNER-2: one thing about the page builder, in a sentence.**
Plain words: one of the two files being freed is the small program that assembles the Today page.
Besides assembling it, that program holds five rules about what may and may not go into the page,
including "the part that saves your weight readings must be in the page". Four of those five rules
are also checked by locked test files, so freeing the program does not free the rules. The fifth was
not checked anywhere else, and we found that this week. We are adding that check to a locked test
file in the same change. If for any reason that check cannot be added, we will free only the
stylesheet and leave the page builder locked. You do not have to decide anything here; this is
recorded so that "we freed it safely" is a measurement and not a claim.

**OWNER-3: the design you approved may not be locked the way you think.**
Plain words: you said the design of record stays pinned by its fingerprint, and it is: the
fingerprints are written down in a file on the design side. The thing we found is that BOTH the
approved design files AND the file holding their fingerprints are outside the locked set. So someone
working on the design lane could change an approved design file and update its fingerprint in the
same change, and every check would still pass, because each is only being compared against the
other.

Nothing suggests anyone has done this, and nothing about your training data is affected. But the new
look is about to start landing, which is exactly when a design file is most likely to be edited.

Two ways forward, and only you need to choose:

- **(a) Lock them now.** We add the approved design files and the fingerprint file to the locked set
  in the same change that frees the stylesheet. Cost: about an hour of work, and afterwards any
  change to an approved design file has to go through a locked-package round like everything else.
  Gain: the sentence "the design of record stays pinned" becomes something the machine enforces.
- **(b) Leave them unlocked for now.** The new look lands faster in the sense that nobody is ever
  blocked by a design-file lock. Cost: the approved design remains protected by convention rather
  than by the machine.

My recommendation: **(a)**. It is an hour, it is the moment the risk becomes real, and it makes a
promise you already made actually true.

**OWNER-4: nothing else in this spec needs your decision.** Every other choice here is engineering
inside the rules you already set. No guard is lowered beyond what `DECISIONS:536` already granted,
the one place the seal itself is touched is a single narrow skip that a reviewer is told to attack
(F.2, Q8), and the two files being released do not store, compute or touch anything about your
training.

---

## Appendix: what I did NOT verify, stated so it is not assumed

1. I did not run `b-package.cjs` in any mode. This round authors one markdown file; no runner or
   suite was executed, so every predicted refusal in B.8 and D.2 is a prediction, not a measurement.
2. I did not measure C-UI-1's file set. It is not PR-READY (`DECISIONS:531`) and its branch was not
   read. The ticket text is the only source for "what the look will touch" in A.5.
3. I did not read `rebuild/conform/private`, `src/history.js`, any `ledger/`, `EarnedPort`, the
   protected soak or the private census, and no owner measurement entered this session.
4. I did not verify that `rebuild/c-s9-today-carry` or `rebuild/c-passphrase-normalize` exist on the
   remote; E.1 repeats the dispatch's description of them.
5. The S8 ARTIFACT sha256 for fact 8 was not re-measured here; `DECISIONS:529` names the RECEIPT
   sha, and the two are different objects. The S9 round must take the artifact sha from Git.
6. `rebuild/lanes/d/p3-layout-v2/` was confirmed to hold `layout-v2.test.mjs` and
   `projector-parity.test.mjs`; I did not run them.
7. **(v2)** I re-measured every finding in R1 that I acted on, on the PC, by opening the file at
   the line. I did NOT re-run anything: this round still authors exactly one file and executes no
   suite and no runner. Cells (11) and (12), H17, H18 and the fence are designs, not observations.
8. **(v2)** I did not re-read the C-UI ticket bodies; A.2's and A.5's ticket columns are v1's
   reading of them, which R1 also did not check. If a later round needs that column to be load
   bearing, it must be re-read.
9. **(v2)** I did not measure the S8 ARTIFACT sha256 (point 5 still stands) and I did not open
   `rebuild/c-ui-port`, `rebuild/c-s9-today-carry` or `rebuild/c-passphrase-normalize`.

---

## R1 findings: fixed or disputed

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
