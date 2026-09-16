# P3-IMPORT-UI - AUTHOR REPORT: **STOPPED, WITH THE WALL EXECUTED**

DECISIONS:470; owner Q1 at :469. Lane C, Opus high. Branch `rebuild/c-p3-import-ui`
off `origin/rebuild/t2-client-core` 7042576d51958078ea139665cfdbf991a02a0373.

## 1. Verdict
**The Import screen was not built, and I do not think an author may build it.**
Steps 3 and 4 (review, identity question, confirm) are
`rebuild/m3/w6/local/source-admission.mjs`. The shipped page's own accepted build
law refuses that module's graph, and every way through either edits a byte this
ticket forbids or deletes a named guard. "Never weaken a law, guard or test"
decided it. I did build, green, the one piece that is buildable and on the
critical path: **runbook pre-check 6 is discharged in code** (DECISIONS:454
finding 3, :469's plan) - the thing standing between Joe and his real port.

## 2. The wall, executed (`import/test/page-bundle.test.mjs`)
An Import route reaches `createLocalSourceController` ->
`m4/workout/engine-runtime.cjs` + `m4/import/*`; `m4/import/engine-provider.cjs`
then requires `engine/migrate.cjs` and `engine/merge.cjs` by literal path, to
REPRODUCE on the phone the walk port.cjs already did on the PC
(`SOURCE_PREPARATION_REPRODUCTION_MISMATCH`).
- Accepted bundler (`w6/build-browser.mjs`) **refuses outright**: 62 errors, all
  `rebuild/engine/test/**` and `rebuild/conform/**`. `engine-runtime.cjs`
  composes through one COMPUTED require and esbuild globs the directory - the
  exact failure build.mjs's own A2 comment predicts.
- Granted the stub plugin the P2 witness added for itself ("ONE addition this
  witness needs and the page build does not"), the graph still hits **six** named
  FORBIDDEN entries: `m4/workout/engine-runtime.cjs`, `m4/import/*`,
  `engine/migrate.cjs`, `engine/merge.cjs`, `engine/index.cjs`, `engine/seed.cjs`.
- Cost: 121 -> 159 modules, app.js 1 660 910 -> 2 177 580 bytes (+31%).

Deliberate on both sides: the page is a reader of an already-migrated state (the
walk is the PC's job, port README); admission re-runs the walk to prove the
bundle. A ruling, not a fix.

## 3. Three ways forward (PM's call; I started none)
1. **Page-safe mirror** of the admission stack under `m3/w6/host/`, as
   `engine-runtime-host.cjs` already mirrors `engine-runtime.cjs` (A2 pattern).
   Kills the sweep-in, but migrate/merge still ship: those two guards must be
   re-reasoned, not quietly dropped. Touches sealed `m3/w6/**` + `today/build.mjs`.
2. **Second same-origin document** with its own declared input law, linked from
   Today. No existing guard moves, A1 untouched, same IndexedDB so P2's boot-time
   consumer adopts on next open. Costs the single-page story, the A5 precache
   manifest, and the ticket's "no new navigation shell".
3. **Admission stays on the PC**: port.cjs emits a bundle already admitted for a
   named installation; the phone only takes custody. Smallest page, but moves an
   identity question off the device that holds the identity.

## 4. Built and green - `rebuild/m3/w7-preview/import/test/` (15 cells)
Test-only directory (measure/ pattern of S5); **no product module, because the
product module is what is blocked**. SYNTHETIC only: source invented in the OS
temp folder from the PUBLIC journey fixture through the ACCEPTED clean-init
constructor, as P2's witness invents its own; `--out` always outside every git
working tree; no private fixture, ledger or owner path read or named. Real
port.cjs seal, real encrypted repository over fake-indexeddb, real durable local
client, real setup lane, real C2b custody, real S3 controller. Nothing stubbed.
- `support.mjs` - harness. `durable()` measures revision/ops/outbox/imports/basis,
  so "nothing was written" is a comparison, never a claim.
- `live-clock.test.mjs` (5) - **pre-check 6.** L0 refuses to run outside
  America/New_York. L1: on 2026-09-16 the live clock stamps the first-run op
  `-04:00`. L2: reviewSource -> prepareSource -> publish -> reconcile -> view
  ADMITS on that real EDT day, zero issues, view carries the imported loads and
  session days. L3: P2's winter day (2026-11-20) still admits. L4: the frozen
  branch on the same summer day still refuses `LOCAL_SOURCE_CONTEXT_UNRESOLVED` -
  fenced, not avoided.
- `refusals.test.mjs` (6) - the codes a screen must show verbatim, each measured
  against the durable record either side. R1 wrong passphrase / R2 one flipped
  byte: `BUNDLE_AUTH_FAILED`, device unmoved. R3 right words: custody taken,
  `LOCAL_IMPORT_REBASE_REQUIRED`, no op, no basis. R4 another athlete's file:
  `LOCAL_SOURCE_PROGRAMME_UNRESOLVED`, no basis, no op. R5 repeat:
  `LOCAL_IMPORT_ALREADY_PRESENT`. R6 after admission: rebase cleared, basis once.
- `page-bundle.test.mjs` (4) - section 2, run. **Designed to go RED the day the
  wall comes down**, so whoever fixes it must come back here. Relaxes nothing.

## 5. Drift - **SEALED DRIFT: NONE**
`git diff --name-only 7042576 HEAD`: `lanes/c/P3-RUNBOOK.md` (modified),
`lanes/c/P3-IMPORT-UI-AUTHOR-REPORT.md` + the four `w7-preview/import/test/`
files (new). None matches `packages/S5.json`. `today-app.cjs`, `today-entry.mjs`,
`m3/w6/**`, `m4/**`, `engine/**`, `measure/**`, `rebuild.yml` and
`lanes/b/tooling/**` all untouched, so `b-package --ci --package S5` should be
**GREEN**, not the red the ticket anticipated. No S6 reseal work here. Note for
S6 anyway: `measure/**` IS pinned by S5 (fifteen files), so "No baseline yet
gains a link" would also have been sealed drift; the way round it, had the screen
been buildable, is `today-app.cjs`'s own `renderMeasure` finding
`[data-slot="measure-baseline-note"]` after each paint, which measure-view.mjs
publishes precisely so a caller can find it without editing it.

## 6. CI registration
Not hermetic (spawns port.cjs; needs fake-indexeddb and esbuild from
`m3/w6/node_modules`), so **not** `shared-preflight.yml`. For S6's `rebuild.yml`
today step, with `TZ=America/New_York`:
`node --test rebuild/m3/w7-preview/import/test/{live-clock,refusals,page-bundle}.test.mjs`.
`today/test` gained no file.

## 7. Verbatim tails
```
P3 import cells (TZ=America/New_York):  tests 15   pass 15   fail 0   duration_ms 1500.8876
port 65:                                tests 65   pass 65   fail 0   duration_ms 3040.224
today-17 (7 files):                     tests 276  pass 276  fail 0   duration_ms 15309.8617
today-17 (6 files):                     tests 369  pass 369  fail 0   duration_ms 5757.469
today-17 (4 measure page-stack):        tests 21   pass 21   fail 0   duration_ms 53475.4106
W6 586:                                 tests 586  pass 586  fail 0   duration_ms 9322.2337
A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-c41c7b74a73f; approved design pinned; 69 bound classes; 2 pinned typefaces inlined; no literal figure in the template; 3/3 assets scanned and free of any network reference; no em/en dash in any text the athlete can see (904 frozen-source strings carry one and reach the screen only through plainCopy; 1 harvested approved term(s) dash-normalised)
A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256; cache name earned-slice-9fae5d08f01c2584b2e175324855b894 derived from those bytes (no version constant); 13 exact header rules, no-store on sw.js; 10 credential shapes and 4 private roots refused across 13 files; theme #E7E1D4 / background #F4F0E8 read back from the approved design; no network reference in any shipped byte; no em/en dash in any text this build emits
```
Copy census on every file this ticket wrote: zero U+2013, zero U+2014, LF only.
The runbook's six remaining em dashes are all in sections the ticket kept intact.

## 8. Not run, and why
**BAR (j)** - no tap sequence exists to drive against the A1 dist; Edge would
prove nothing this ticket asked. **BAR (a), (b), (e), (g), (h)** - assertions
about a Today route with an Import screen on it. The machinery halves of (c), (d)
and (f) are in section 4; the screen halves are not, and were not faked.
**coach 231, client 18, rig187** - no byte reachable from this branch.

## 9. Open items
1. **Rule on section 3.** Nothing reaches Joe's phone until then.
2. **Joe's expectation.** Q1 told him the port happens. The PC half is ready and
   his ledger is untouched either way; the phone half is not. Someone should say
   so before he is handed a file he cannot open. The runbook now says it.
3. **There is no production producer mapping anywhere in the tree.** Every
   `createProducerRegistry` call in the repository is `TEST-ONLY-*`, P2's
   included. Whatever route section 3 takes, a reviewed execution calendar must
   be authored and committed or admission refuses
   `SOURCE_ENGINE_CONTEXT_UNPROVEN` on Joe's real bundle. Not in the ticket; I
   believe it is the second blocker behind the first.
