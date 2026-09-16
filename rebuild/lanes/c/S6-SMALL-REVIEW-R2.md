# S6-C SMALL ITEMS - INDEPENDENT REVIEW R2 (Opus high)

VERDICT: REJECT

Subject 185195a (rebuild/c-s6-small, parent c0a4e6c, tip 0ac72ea), verified in a detached worktree
at that sha: junctions only, no npm, Node 24, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York.
Every claim below was executed here. My own cells live outside the repo (%TEMP%\s6c-rv\rv.test.mjs,
rv7.test.mjs) and drive the real boot() over fake-indexeddb and the shipped template.

## BLOCKING

1. **A merged CI cell is red on this branch, and item 1 is what makes it red.**
   `rebuild/m3/w6/host/test/local-real-day.test.mjs:423` - `S4/8 - after two midnights the OLD
   mount cannot repaint and cannot date a record` - fails `'setup' !== 'today'` at line 449, whose
   own message is `and the live mount opened on Today`. The cell boots the LIVE path deliberately
   (line 434, `Entry.boot({ document, indexedDB: new IDBFactory(), crypto, now })`, no declared
   day) over a store nobody enrolled, because it is the real-day rollover suite; under setup-first
   that third mount opens on the setup screens. CAUSAL: the three files of the rebuild.yml:138
   step run `tests 38 / pass 37 / fail 1` at HEAD and `tests 38 / pass 38 / fail 0` with only the
   landing line reverted to `render(requestedScreen() || "today")`. That step is a plain
   `node --test` in the `rebuild` job, so this is a red CI job, not a sealed-package red, and it
   is outside the five declared reds. The author never ran the suite - it is in no tail - and the
   report states the opposite as fact: "every fixture, check and suite in the tree declares one
   [a day], so NO existing cell had to be amended and none was". The cell's purpose is the midnight
   re-boot, not the pre-setup preview, so the close is to give it the landing it means (enrol the
   store, or declare `setupFirst: false`, the ticket's "explicit option") and state the rule.

## MAJOR

2. **Item 3's CTA half has no red side at the screen, and the defect is reachable.** Mutant M6 -
   the pre-fix line restored in renderToday, `const action = resuming ? "Resume " +
   view.workout.title` - leaves problem.test.mjs plus my cells at `tests 136 / pass 136 / fail 0`.
   Nothing pins that renderToday CALLS `resumeLabel`; S6C.6b asserts resumeLabel's own branches,
   which the report calls "both CTA branches". Reachable, not theoretical: my RV7 starts a session
   on 2026-09-17 and mounts Today on 2026-09-16 with that same open session (the shape
   gym.test.mjs:606 already drives), and `[data-slot="primary-label"]` reads
   `Resume UPPER BODY · TOMORROW` under M6 and `Resume today’s workout` at HEAD. This is round 1's
   BLOCKING class: a helper asserted in isolation, the page's use of it unpinned. One cell over the
   rendered label closes it.

## MINOR

3. **The mechanism stated for item 3 is not what this tree executes.** today-entry.mjs:171-177,
   today-app.cjs:289-296 and the report say the client "prepares a session from the planned split
   slot whether or not the ENGINE schedules one that day, so on a day the engine calls REST the
   athlete logged the correct lift under a header that read UPPER BODY · TOMORROW". It does not:
   on 2026-09-16 `gym.read()` is `phase: 'blocked'` and `gym.start()` refuses
   `ENGINE_CAPTURE_NO_WORKOUT` (my RV5), so nothing is logged that day. What was wrong, printed by
   my M3 run, is the REFUSAL card's heading: `UPPER BODY · TOMORROW` before, `Today’s workout
   cannot open` now. The fix is right; the sentence should name the executed thing.
4. **S6C.6b's hour-independence line cannot fail for the reason given.** It builds the same model
   with the same day twice and varies no hour, under the comment "the same day at 23:59 and at
   14:00 reads the same". The real claim is S6C.6's and my RV4's. Round 1 MINOR 3's family.

## NOTE

5. R1-1 is genuinely closed, end to end rather than by slice: RV6 runs the BUILT bundle in a window
   over the shipped index.html and the page paints `Build 185195a`, equal to `git rev-parse
   --short HEAD` here. Under M4 (old predicate) that same real page paints `Build unknown` and
   S6C.7, S6C.7b and RV6 all go red.
6. R1-2 is closed: under M5 (`view.title || ''`) the rest-day refusal card's h1 is `""` with
   `hidden: true`; at HEAD it is `Today’s workout cannot open`, not hidden.
7. Red sides executed, each applied, run, reverted: M1 landing -> S6C.1, S6C.3, S6C.4, RV1, RV2
   (5); M2 `sampleNote` call removed -> S6C.5, S6C.5b, RV3 (3); M3 stamp unconditional -> S6C.6c,
   S6C.6d, RV4 and the N2-08 today-entry.mjs byte pin (4); M4 footer predicate -> S6C.7, S6C.7b,
   RV6 (3); M5 stub head -> S6C.6d, RV4 (2); M6 CTA -> NOTHING red, finding 2.
8. No assertion removed anywhere: every `-` line in the two test files is an import widened in
   place or a comment. The only deletions are `CHILD_SPECS` / `declaredPostIn`, which `git grep`
   confirms nothing imports, and the four live chain readers do sit at food.test.mjs:792,
   machine-settings-ui.test.mjs:709, setup.test.mjs:2315 and measure/boundary.test.mjs:83.
9. Hygiene over all 856 added lines of `git diff 0ac72ea HEAD`: 0 CRLF, 0 U+2013/U+2014.
   `git diff --name-only 0ac72ea HEAD -- rebuild/engine` is EMPTY. today/test holds 13 files. The
   A5 cache name moved with HEAD exactly as R1-4 predicts: accepted as stated, no regression.

## Drift, verified here (git diff --name-only 0ac72ea HEAD, each findstr'd vs packages/S5.json)

Eight paths. PINNED BY S5 (4): `rebuild/m3/w6/test/local-today-journey.test.mjs`;
`today/today-entry.mjs`; `today/today-app.cjs`; `today/test/problem.test.mjs`. NOT IN S5 (4):
`today/build.mjs`; `today/problem-report.cjs`; `today/gym-app.mjs`; this lane's reports - S5 pins
`rebuild/m3/w7-preview/build.mjs`, a different file, and names neither gym-app.mjs nor
problem-report.cjs. `b-package --ci --package S5` stays the expected red (:455/:467); finding 1
would add a fifth S5-pinned path.

## Tails (this worktree, at 185195a)

today-17, the 17 files rebuild.yml:199 names, in two runs: part A `tests 276 / pass 275 / fail 1`;
part B `tests 403 / pass 399 / fail 4` => `679 / 674 / 5`. The five are the declared-bytes guards,
reproduced by name: food N1.18; measure/boundary P-MEASURE (g), same four-name actual list;
machine-settings-ui S10; setup re-pin x2.
W6 `586 / 586 / 0`. coach `231 / 231 / 0`. client `18 / 18 / 0`. lane B tooling `91 / 91 / 0`.
measure hermetic (model, adherence) `11 / 11 / 0`. rig187 `rig187 ⇒ PASS`.
W6 HOST, the rebuild.yml:138 step: `tests 38 / pass 37 / fail 1` - FINDING 1.
A1 `A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build
earned-911ef8a63a78; commit 185195a; approved design pinned; 69 bound classes; 2 pinned typefaces
inlined; no literal figure in the template; 3/3 assets scanned and free of any network reference;
no em/en dash in any text the athlete can see`
A5 `A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256; cache
name earned-slice-0205a6f1be4601c4099f9869a5813735 derived from those bytes (no version constant)`
My cells at HEAD: RV1-RV6 `6 / 6 / 0`, RV7 `1 / 1 / 0`; with problem.test.mjs `136 / 136 / 0`.
