# S9-RELEASE-SPEC - releasing the screen files from the sealed inventory

Lane B tooling, SPEC ONLY. Author: cowork (Earned lane hand), 2026-09-19, worktree `%TEMP%\earned-s9`
on `rebuild/b-s9-ui-pins`, cut from the chain tip `9e1ece8` (`rebuild/t2-client-core`).
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
| `rebuild/m3/w7-preview/today/preview.css` | `carried` | **RELEASED** | 122 lines of CSS; zero matches for `indexedDB`, `save(`, `logSet`, `localStorage`, `host.` | C-UI-1 (replaced by the pinned stylesheets) |
| `rebuild/m3/w7-preview/today/build.mjs` | `carried` | **RELEASED, at a cost named in A.4** | `buildToday` `build.mjs:465` reads shell/template/chrome and writes three assets at `build.mjs:507`; it stores nothing and computes nothing about the athlete | C-UI-1 (serve assets offline, honour review hooks) |
| `rebuild/m3/w7-preview/today/today-app.cjs` | `carried` | **SEALED** | see A.2 | C-UI-2, C-UI-3, C-UI-6, C-UI-7 |

### A.2 `today-app.cjs`, the hard case: read handler by handler

2626 lines, 151537 bytes. It is a view module that also OPENS and WRITES the encrypted local store.

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

Released, a lane C ticket can edit any of those five in the same PR as a stylesheet swap. Section D
is the answer: the five are also EXECUTED by `today/test/copy.test.mjs` (`:207` Node globals,
`:264` and `:303` the launch guard, `:395` and `:405` the dash refusals) and by
`today/test/package.test.cjs`, and BOTH cells stay SEALED. So the laws keep their teeth from the
cell side even when the file that implements them is free. That is the whole trade and it should be
said in the token line's own brief.

### A.5 Files the C-UI tickets touch that are NOT sealed today (no release needed, and one warning)

| path | ticket | already free? | note |
|---|---|---|---|
| `today/screens.template.html` | 2,3,4 | yes | markup only, 508 lines |
| `today/design.cjs` | 1 | yes | the design-of-record pins live here; section C |
| `today/browser-check.mjs` | 1 | yes | `browser-check.mjs:60` reads `design.headlineVocabulary()`; stale-red at the tip (`DECISIONS:535`) |
| `today/today-model.cjs` | - | yes | **computes** (`today-model.cjs:120` `planMove`, `:128` `projectionOf`); by :536's own test this is a SEALED-class file standing outside the seal. See F, Q3 |
| `today/gym-model.mjs` | 4 | yes | **`gym-model.mjs:502` `async function logSet(...)`**; by :536's own words ("any file that calls `logSet`") this is a SEALED-class file standing outside the seal. See F, Q3 |
| `today/machine-settings-view.mjs` | 5 | yes | render only (`:124`, `:154` are DOM appends) |
| `today/checkin-*.mjs` | 2 | yes | `checkin-app.mjs:150` `await model.save()`; SEALED-class, outside the seal. See F, Q3 |
| `today/food-model.cjs`, `food-commands.cjs`, `sleep-*` | 7 | yes | model and command layers, outside the seal |
| `rebuild/slice/pwa/**` | 8 | yes | `DECISIONS:536` says so |

### A.6 THE CLOSED LIST

```
rebuild/m3/w7-preview/today/preview.css
rebuild/m3/w7-preview/today/build.mjs
```

Two paths. Both are in the S8 sealed inventory; both are named verbatim in the S9 spec and in the
PM token line; neither is a pattern. Nothing else in `DECISIONS:536`'s candidate list is sealed, and
`today-app.cjs` fails the ruling's own test.

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
| parent pin re-assertion | `pins()` `:1834`, over `{...a.product, ...a.executionPins}` at `:1837`, through `held()` `:1828` | see B.3 |
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
2. the runner re-reads `rebuild/DECISIONS.md` out of Git at `CHAIN_REF` (`:1200`) on EVERY call, no
   cache (the r10 F4 lesson at `:1194-:1198`), and requires **exactly one** line on the chain branch
   whose own bytes hash to that sha (`:1202`);
3. that line must end in ` RULED` (`:1207`), so a lane cannot release anything by writing its own
   branch's ledger;
4. the line must carry at least one `RELEASE-FROM-SEAL` token (`:1211`) naming THIS `packageId`
   (`:1216`), and the granted path set is the union of that token's comma list;
5. every path the spec declares `role: "released"` must be in the granted set, and every granted
   path must be declared `released` (set equality, both directions, so the ledger and the spec
   cannot drift apart);
6. every granted path must be a key of the PARENT artifact's `product` map, and its declared `pre`
   must equal `parentPin(pmap[file], file)` (`:1816`) - you cannot release what the parent never
   sealed.

### B.3 Parent pin re-assertion for a file S9 releases

This is the question with the cleanest existing answer and it needs **no new code**.

`pins()` `:1837` walks the parent artifact's `product` and `executionPins` and calls `held()`
(`:1828`). `held()` has two branches:

```
if (Object.hasOwn(s.product, file)) { assert.equal(gitSha(s.sourceBase, file), hash, code + '-AT-SOURCEBASE ' + file); return false; }
assert.equal(diskSha(file), hash, code + ' ' + file);
```

A file THIS package declares is re-asserted **in Git at `sourceBase`**, not on disk at HEAD. S9's
`sourceBase` is the S8-sealed tip. So as long as a released path stays in `s.product` with its
parent pin as `pre`, S9 re-asserts S8's pin exactly as it re-asserts every other parent pin, and it
is counted in the run's `base` bucket ("superseded pin(s) preserved in Git at sourceBase", `:1854`).
That is the honest statement: **S8's pin is not broken, it is preserved in history and stops being
inherited.** No weakening, no exemption in `pins()`.

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
that is not exactly what the spec, the runner and the pins recompute.

**Why a separate block and not a role inside `product`:** `product()`'s completeness check at `:1975`
walks the PARENT artifact's `product` map. If S9's artifact carried the released path inside its own
`product`, S10 would find it parent-pinned, would be forced to declare it (`:1975`), and its declared
`pre` would be checked against the parent pin at `:1893`. That is inheritance, and the ruling forbids
it. Moving the entry into `released` makes S10's `pmap` and `epins` both miss the path, so S10 may
declare it `new`/`pinned-unchanged` or not declare it at all. **Not inherited, by construction, and
visible in the artifact forever.**

### B.5 Every runner hunk I expect

| # | function / constant | line | change | reason |
|---|---|---|---|---|
| H1 | `PRODUCT_ROLES` | `:351` | add `'released'` as the sixth | W7: the vocabulary is fixed here and nowhere else |
| H2 | `RELEASE_GRANT`, `RELEASE_GRANT_SHAPE` | beside `:932-:933` | new | the token's grammar, fixed in the runner |
| H3 | `releaseRuling(s)` | new, beside `supersessionRuling()` `:1189` | new function | B.2 steps 1 to 6; no cache, unique sha, RULED terminal, package-named |
| H4 | `spec()` product loop | `:1517-:1531` | `released` requires `pre !== null`, `post === null`; refuse `post` non-null | a released file has no post-image in this package |
| H5 | `spec()` | after `:1531` | `release` block key closure + `SPEC_KEYS` (`:1071`) gains `'release'` | closed keys |
| H6 | `product()` parent branch | `:1894` | admit `'released'` beside `carried`/`edited` | the only place a parent pin's role is judged |
| H7 | `product()` | after `:1895` | `if (pin.role === 'released') { at.released.push(file); continue; }` placed BEFORE `const disk = diskSha(file)` (`:1961`) | a released path is never hashed by fidelity; it can never reach `:1970` drift |
| H8 | `product()` terminal | `:1966` say() | new clause: `N released under DECISIONS:<at>, each at the sha256 <parent> sealed it at, not hashed here` | said out loud on every run |
| H9 | `product()` | `:1889` loop entry | assert the released set equals `releaseRuling().granted` | ledger and spec cannot drift apart |
| H10 | `proposed()` | `:2826` | `product` excludes released entries; new `released` block built from `s.product` + the ruling | B.4 |
| H11 | `ARTIFACT_KEYS` | `:2830` | add `'released'` | closed artifact keys |
| H12 | `writeSealedRunReceipt()` | `:2993` | skip `pin.role === 'released'` when building `product` | B.6 |
| H13 | `sealedRunReceipt()` | `:2970`, `:2972` | both directions skip released paths | B.6 |
| H14 | `IDS` | `:173` | `'S9'` behind `'S8'` | section E |
| H15 | `NO_REGISTER_IDS` | `:316` | `'S9'` | section E |
| H16 | `CHILD_ROOTS` | `:405` | see section E | section E |

Sixteen hunks, of which H14 to H16 are the ordinary reseal-child three that S8 also had
(`S8-PREP-AUTHOR-REPORT.md:60-73`). The release itself is H1 to H13.

### B.6 What happens to every other guarantee

| guarantee | where | effect of a release | why it is still honest |
|---|---|---|---|
| unlisted drift in a sealed file | `product()` `:1970`, `:1972` | unchanged | H7 removes released paths from the loop body only; every other declared file still buckets and still refuses |
| a parent-pinned file dropped from the inventory | `:1975` | unchanged | a released file is STILL declared in `s.product`; the completeness walk still finds it |
| `UNLISTED-SOURCE-CHANGE` | `fidelity()` `:2005-:2011` | unchanged | the diff roots are `rebuild/engine`, `rebuild/conform`, `rebuild/m4/spec`, `rebuild/lanes/b/tooling` (`:2005`). `rebuild/m3` was never in it. Nothing is loosened; nothing is tightened either. See D. |
| parent pin re-assertion | `pins()` `:1837` | unchanged, B.3 | the released path is checked in Git at `sourceBase` |
| the `--full` byte-identity re-verify | `sealedRunReceipt()` `:2970`/`:2972` | released paths excluded (H13) | otherwise a legitimate lane C edit to `preview.css` after the seal would print `SEALED-RUN-RECEIPT-VOID` and force a full run for ever. The receipt's sentence at `:3170` must then say "over N pinned product file(s), 2 released and not re-verified" |
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

### B.8 New tooling cells, red first

| cell | red-first plan (it must fail on the runner as it stands today) |
|---|---|
| `tooling/test/release-from-seal.test.cjs` (new) | (1) a spec declaring `role: "released"` refuses with `PRODUCT-ROLE-NOT-IN-THE-CLOSED-VOCABULARY` today; (2) with H1 only, it refuses at `:1894` `PARENT-PRODUCT-PIN-NOT-DECLARED-CARRIED-OR-EDITED`; (3) with H6 only, a byte moved in the released file still refuses at `:1970` (proves H7 is needed); (4) a released path with no token line refuses `RELEASE-NOT-RULED`; (5) a token line naming another package refuses; (6) a token line not ending ` RULED` refuses; (7) a spec releasing a path the token does not name, and a token naming a path the spec does not release, both refuse; (8) a released path that is also a child argv target refuses; (9) the artifact recomputation `:3021` refuses an artifact whose `released` block is not what `proposed()` builds; (10) the sealed-run receipt does not carry a released path, and moving that file's bytes does NOT void the receipt |
| `tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs` (F6/F7, edited) | `PRODUCT_ROLES` of six by literal and `deepEqual`; `IDS` of thirteen; `NO_REGISTER_IDS` of nine; `CHILD_ROOTS` of its new length in both the whole-list literal and the `slice(8)` literal (the S8 shape, `S8-PREP-AUTHOR-REPORT.md:73`) |
| `tooling/test/seal-tip-and-byte-identity.test.cjs` (edited) | the receipt's product map excludes released paths in both directions |

Every one of these is a `rebuild/lanes/b/tooling/test/` cell, already in `TOOLING_FILES` (`:355`) for
the existing five; the new file must be ADDED to `TOOLING_FILES` in the same hunk or `fidelity()`
`:2011` calls it `UNLISTED-SOURCE-CHANGE`. **That is the easiest hunk in this list to forget.**

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
| `measure/test/boundary.test.mjs` | `:128` (P-MEASURE (g)) | **every file `packages/S4.json` pins, by post-image** | **YES: `preview.css` and `build.mjs` are named explicitly at `:181-:183`** |

### C.2 The ruling, cell by cell

**Exactly ONE cell pins a released file**, and it does not pin it as a sealed byte; it pins it as a
file that is explicitly NOT sealed and must stand where a declaring spec says.

| cell | ruling | why |
|---|---|---|
| `measure/test/boundary.test.mjs` `:181-:190` `P3_IMPORT_UI_2_UNSEALED = ['.../preview.css', '.../build.mjs']` | **RE-HOMED as a lane C behaviour cell, and the two names REMOVED from the S4-drift assertion in S9** | the cell asserts (a) `Object.hasOwn(S4.product, f) === false` and (b) `shaOf(f) === declaredPost(f)`. (a) stays TRUE after the release and needs no change. (b) becomes FALSE the day lane C edits either file, because no spec will declare their post any more. `:183` is therefore a byte pin over a released file and must go. S9 removes the `P3_IMPORT_UI_2_UNSEALED` loop (`:185-:190`) and states in its place that both paths are RELEASED by `DECISIONS:<token line>`. The BEHAVIOUR these two files owe is then asserted where it always was: the build laws in `today/test/copy.test.mjs` and `today/test/package.test.cjs`, both SEALED |
| `measure/test/boundary.test.mjs` `:128-:180` (the S4-drift walk itself) | **KEPT, unchanged** | it walks `S4.product`. `preview.css` and `build.mjs` are not in `S4.product` (that is what `:185-:187` asserts). Nothing in the walk touches a released path |
| every cell in C.1 other than `boundary.test.mjs` | **KEPT, unchanged** | none of them names `preview.css` or `build.mjs`. The five red-then-green cells of `DECISIONS:523` pin `today-bindings.mjs` and `workout-host.mjs`, both SEALED and both outside this release |
| the twelve sealed `today/test/*` cells | **KEPT, all twelve, and NOT released** | see C.3 |

Nothing is "kept over a released file", so there is no cell that makes the release a fiction.

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
   `proposed()` `:2800` re-pins every child argv target into `executionPins`. All twelve today cells
   ARE child argv targets and execution pins today. Releasing one means also removing it as a
   declared child, which by `DECISIONS:487` stop 7 and `DECISIONS:186 (3)` means a cell with no
   declared executor. That is the hole the last three reseal children were spent closing.

### C.4 What keeps guarding the copy after the release, and where it runs

| lock | implemented in | executed by | CI home | OS |
|---|---|---|---|---|
| the no-dash rule | `today/plain-copy.cjs`, `today/dash-check.mjs`, `build.mjs` (`assertNoAiDashesInAssets`, `build.mjs:31`) | `today/test/copy.test.mjs` (20 tests) | `.github/workflows/rebuild.yml:232`, step "A1/A2/A3/A4" | ubuntu + windows (`rebuild.yml:23`) |
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

**`design.cjs` is not released because it is not sealed.** What pins the design of record is
therefore: the sha256 constants inside `design.cjs` (an unsealed file), enforced by
`design.test.cjs` (a sealed, CI-homed, both-OS cell) and re-enforced at build time by `build.mjs`.
After S9 releases `build.mjs`, the build-time enforcement is lane C's to edit; the cell-side
enforcement is not. That asymmetry is the honest answer to "if design.cjs itself is released, what
then pins the design of record", and it is worth one sentence in the S9 brief.

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
| how it learns the inventory | it reads the YOUNGEST sealed artifact present in the tree by walking the same ruled id order the byte-pin cells already use (`boundary.test.mjs:117` `CHILD_SPECS`): `rebuild/m4/spec/acceptance-s<N>-*.json` for the largest N that exists. It reads `product`, `executionPins` and `released`. It never carries a hash of its own and it never carries a path list of its own, so it cannot go stale the way `boundary.test.mjs` did |
| what it does on a reseal child branch | a branch whose diff contains `rebuild/lanes/b/tooling/packages/S<N+1>.json` is a reseal child and the cell SKIPS with a printed reason. A reseal child is exactly the thing allowed to move sealed bytes |
| what it does with no network | `git merge-base` against `refs/remotes/origin/rebuild/t2-client-core`; if that ref is absent (a shallow clone) the cell FAILS with `FENCE-CHAIN-REF-ABSENT` rather than passing vacuously. `rebuild.yml:35` already sets `fetch-depth: 0` |
| red first | (1) a branch touching `today/today-app.cjs` FAILS naming that path; (2) a branch touching `today/preview.css` PASSES after S9 and FAILS before it; (3) a branch touching `today/screens.template.html` PASSES (never sealed); (4) a deleted `origin/rebuild/t2-client-core` ref FAILS, not passes; (5) a reseal-child branch SKIPS with its reason printed |
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
| 13 | H1 to H13 of section B.5, the release mechanism itself, plus the new `tooling/test/release-from-seal.test.cjs` added to `TOOLING_FILES` (`:355`) in the same hunk | section B |
| 14 | The D.2 fence cell and its `rebuild.yml` step | section D |
| 15 | The `released` block appears in `rebuild/m4/spec/acceptance-s9-ui-pins.json` with both paths, each with `lastSealedSha256`, `sealedBy: "M2-S8-REAL-SHAPE"` and the token line's sha256 | section B.4 |

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
| **NOW, day 1-2** | runner hunks H1 to H13 (section B.5), red first, with `release-from-seal.test.cjs` failing on today's runner before any hunk lands | no |
| **NOW, day 1-2** | the D.2 fence cell, red first, and its `rebuild.yml` step drafted | no |
| **NOW, day 2** | facts 1 to 7 and 12 of E (IDS, NO_REGISTER_IDS, CHILD_ROOTS, the six `s9-*` cells, F6/F7, the ancestor re-pins, the five `CHILD_SPECS` cells). All are name-for-name mirrors of S8 and depend on nothing lane C does | no |
| **NOW, day 2** | `boundary.test.mjs`'s `P3_IMPORT_UI_2_UNSEALED` removal (C.2), red first | no |
| **NOW, day 2-3** | the S9 brief `rebuild/lanes/b/S9-UI-PINS-BRIEF.md` written with every declaration list EXCEPT the C-UI-1 file set; one independent review of the mechanism and of the closed list | no |
| **WAIT** | `packages/S9.json`'s `product` map: the pre/post of every file C-UI-1 moves, and the needle table (each needle MEASURED by running each child) | **yes** |
| **WAIT** | the `--ci --package S9` walk to its predicted refusal, and the artifact through `proposed()` | yes, it hashes the C-UI-1 bytes |
| **ONE RE-MEASURE when C-UI-1 lands** | re-measure every pre/post from Git, re-measure the needles, re-take the spec sha256, re-take the brief sha256, re-run `--ci` | this is the single re-measure the round is designed around |

The re-measure is mechanical (it moves hashes, not design) and is the reason the mechanism work can
be reviewed before C-UI-1 exists: an independent reviewer can judge H1 to H13, the token grammar,
the closed list and the fence against the runner as it stands today, and none of those judgements
changes when C-UI-1's bytes arrive.

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

### F.2 STOP conditions (the round stops and reports rather than proceeding)

1. The `RELEASE-FROM-SEAL` token line does not exist on `rebuild/t2-client-core`, or hashes to more
   than one line, or does not end in ` RULED`. No release without it; `DECISIONS:536` (2) requires it.
2. Any hunk would have to touch `held()` (`:1828`), `pins()` (`:1834`), the drift assert
   (`:1972`) or the completeness walk (`:1975`) to make the release work. Those four are the seal;
   if the design needs them moved, the design is wrong and the PM hears that instead.
3. `--ci --package S9` refuses for a reason the brief did not predict. That is a finding, not a fix.
4. A cell over a released file cannot be re-homed honestly (C.2). Then the file is not released and
   the closed list shrinks.
5. The owner's answer to OWNER-1 is "do not split `today-app.cjs`" AND the PM still wants the
   1-week estimate. Those two are incompatible and the PM is told so in one sentence.

### F.3 Estimate for the S9 PREPARATION round (lane B, one author, one independent review, one fix round)

| work | hours |
|---|---|
| H1 to H13 runner hunks, red first | 4 |
| `release-from-seal.test.cjs` (10 red-first cells) | 3 |
| the D.2 fence cell + its `rebuild.yml` step, red first | 3 |
| facts 1 to 7 and 12 (IDS, NO_REGISTER_IDS, CHILD_ROOTS, six `s9-*` mirrors, F6/F7, seven ancestor re-pins, five `CHILD_SPECS` cells) | 4 |
| `boundary.test.mjs` re-home (C.2) | 1 |
| `packages/S9.json` + needle table, measured by running each child | 5 |
| `S9-UI-PINS-BRIEF.md` + the three token line texts with their sha256 | 3 |
| `--ci --package S9` to its predicted refusal, plus the author report | 3 |
| independent review + one fix round | 6 |
| the re-measure when C-UI-1 lands | 2 |
| **total** | **34 hours, about 4 to 5 working days of lane B time** |

This is preparation only. It excludes the PM's token lines, the `--full` with the private census,
the receipt, the chain merge and the slice deploy, which `DECISIONS:455` costs at roughly half a day
plus one FULL on the PC.

### F.4 Open questions for the PM, each with a recommendation

| # | question | my recommendation |
|---|---|---|
| Q1 | The closed list is two paths (`preview.css`, `build.mjs`), not the eight `DECISIONS:536` names, because five are already unsealed and `today-app.cjs` fails the ruling's own test. Does the PM accept a two-path list, or re-open the list with the owner? | **Accept the two-path list and tell the owner plainly what it buys** (C-UI-1 and C-UI-8 ship as lane C; the rest do not). Re-opening the list without the A.2 split would mean releasing a file that writes to the athlete's store, which the owner's own ruling forbids. |
| Q2 | Is `build.mjs` released, given it carries five build laws (A.4)? | **Yes, release it.** All five laws are also executed from `copy.test.mjs` and `package.test.cjs`, which stay sealed, so the teeth survive. Say this explicitly in the token line's brief so no later reader thinks the laws were given away. |
| Q3 | Three SEALED-class files stand OUTSIDE the seal today: `today-model.cjs` (computes, `:120`, `:128`), `gym-model.mjs` (calls `logSet`, `:502`), `checkin-app.mjs` (`model.save()`, `:150`). By `DECISIONS:536`'s own vocabulary they should be sealed. Does S9 seal them? | **Declare `gym-model.mjs` and `checkin-app.mjs` in S9 (role `new`), and leave `today-model.cjs` out.** The first two write; that is the line the owner drew. `today-model.cjs` was deliberately taken out one week ago by the accepted hotfix (`DECISIONS:535` (a)) and re-sealing it now would re-close a door the PM opened on purpose. This is +2 declarations, not a new round. If the PM prefers zero scope growth, record it as a carried note for S10 the way `DECISIONS:524` N1 was carried. |
| Q4 | `browser-check.mjs` is unsealed, has no CI step and is stale-red at the tip (`DECISIONS:535`), yet it is the only browser-side enforcement of `headlineVocabulary` and `assertNoDashOnScreen`. C-UI-1 will rewrite it. | **Give it a CI home in S9 or record out loud that it has none.** `DECISIONS:186 (3)`: a file with no CI home is a file nobody runs. It needs a real browser binary, which no GitHub runner has, so the honest answer is probably "no CI home, run on the PC before each seal, recorded in the verdict" rather than a step that cannot exist. |
| Q5 | Should the fence cell (D.2) live under `rebuild/lanes/c/ui-port/` (lane C owns it, lane C's CI) or `rebuild/lanes/b/tooling/test/` (lane B owns it, already in `TOOLING_FILES`)? | **`rebuild/lanes/c/ui-port/`.** It fences lane C, it must run on lane C's branches, and putting it in `TOOLING_FILES` would exempt it from the very inventory check it performs. It needs a new `CHILD_ROOTS` entry either way (fact 3). |
| Q6 | The `released` block records `lastSealedSha256`. Should it also record the sha256 the path stands at when S9 seals? | **No.** Recording a post-image is a pin by another name, and a reader who wants that can take it from Git at S9's own commit. The block should record where the SEAL stopped, not where the file happened to be. |

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

**OWNER-2: nothing else in this spec needs your decision.** Every other choice here is engineering
inside the rules you already set. No guard is lowered beyond what `DECISIONS:536` already granted,
and the two files being released do not store, compute or touch anything about your training.

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
