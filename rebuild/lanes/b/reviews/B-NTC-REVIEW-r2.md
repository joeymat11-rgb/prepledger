# B-NTC — INDEPENDENT REVIEW r2 — **REJECT**

**Package:** B-NTC, the qualified `nativeTrendContext` provider — the PM-ruled FIRST lane-B
engine package and the S2 blocker (`DECISIONS:103` (1), `DECISIONS:102`, `DECISIONS:109`).
**Under review:** `rebuild/lane-b-ntc` @ `71fb2f1ae2bf48cc8f32ff3f9e905949e352914c`.
**Base for the whole delta judged here:** `68fbca4` (the head review r1 saw).
**Integration tip compared against:** `7b1678a` (`origin/rebuild/t2-client-core` is at
`e1bf685` = `7b1678a` + one docs commit).
**Reviewer:** independent, blind. Did not write any of this package. Every number below was
**executed on the owner's Windows PC** in a read-only detached worktree
(`…/work/lane-b/rv-ntc2`, node v24.18.0, `TZ=America/New_York`,
`MEASURED_TEST_NOW=2026-09-03`), with mutations confined to a disposable copy of the tree.
Builder claims — including every Astra report — were treated as hypotheses and re-measured.

**VERDICT: REJECT.**

Let the engineering be said first, because it is good and it is not what fails. **The
provider is sound and both `DECISIONS:109` obligations are discharged.** I drove the real
product entry point myself: the FRESH zero-night athlete conducts day+3 of the same lift
group end to end (ops 12 → 19), and the 28-night product athlete does too (ops 12 → 18).
Every r1 code finding is closed — F1's identity claim is gone and replaced by a real
`bindingDigest` re-check, F3's bind window now covers `readPrevious()`, F6 reads both pace
holders and refuses disagreement, F7's `bind(null)` refuses. Eighteen of my twenty-one
mutations turn the package red. The engine is byte-untouched, the 45 register laws are
unmoved, and the public census line is identical to base.

**What fails is the seal layer, and it fails hard and silently.** The package **cannot pass
its own runner in either mode**: `b-package.cjs --ci --package B-NTC` and
`--full --package B-NTC` both exit **1** with `B PACKAGE B-NTC FAIL; required evidence
missing or failed; local diagnostics withheld`. The cause, which I had to instrument the
process to see, is the package's own central new mechanism:
`INHERITED-COVERAGE-CHILD-IS-NOT-A-PARENT-PINNED-EXECUTABLE`. That is exactly the authority
`REQUESTS 09:05 STOP (1)` asked the PM to rule and **which has never been ruled**. And
`.github/workflows/rebuild.yml` at this head runs that very failing command as the CI gate,
having deleted two working steps to make room for it — so **CI is red on both runners**, and
the brief's "nothing hidden" table does not mention the deletions.

This is a REJECT of the **package as offered for sealing**, not of the provider. The
provider, its 39 cells, the H6 wiring and the seven delta cells are accept-worthy on the
evidence in §§B–D and should be re-offered once R1–R6 are closed.

---

## 0. Findings, ranked

| # | finding | severity |
|---|---|---|
| **R1** | **The package's own seal runner refuses it, in BOTH modes.** `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` → **exit 1**, terminal `B PACKAGE B-NTC FAIL; required evidence missing or failed; local diagnostics withheld`. `--full --package B-NTC` → the same line, the same exit 1. The expected `CI REVIEW-PENDING … exit 2` and the expected `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` are **never printed** — `coverage()` throws before `privateOracle()` is reached. Instrumented cause (§F.3): `INHERITED-COVERAGE-CHILD-IS-NOT-A-PARENT-PINNED-EXECUTABLE migrate-source source-carriers rebuild/m4/spec/b-ntc-source-carriers.cjs`. | **blocking** |
| **R2** | **CI is red at this head.** `.github/workflows/rebuild.yml` replaces the step `node rebuild/m4/spec/native-carriers-package.cjs --ci` with `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` — the command R1 measures at exit 1. Both runners fail that step. | **blocking** |
| **R3** | **The rebuild.yml change exceeds `DECISIONS:109` and is not disclosed.** :109 authorises an *enumeration* plus retiring the `# pass 19` child "together with its CI step". The diff also **deletes** the step `Synthetic Today projection, UI and preview package` (`rebuild/m3/w7-preview/test/{model,view,package}.test.cjs`) and **replaces the whole parent gate step**. The brief's §4 table "What else moved, and why — **nothing hidden**" records only "the A1/A2 step now enumerates seven files". Two removals, unnamed. | **blocking** |
| **R4** | **`rebuild/lanes/b/ntc/pass19-retirement.patch` does not apply.** `git apply --check` → **exit 1**, `error: patch failed: .github/workflows/rebuild.yml:76 … patch does not apply`. Brief §5 states "`git apply --check` exit 0" and "One command lands it". The `# pass 19` child is still live at `rebuild/m4/spec/native-carriers-package.cjs:65`. So :109's retirement half is neither applied nor landable, and the brief makes a false executable claim about it. | **blocking** |
| **R5** | **The successor mapping is unruled authority, and X1 is satisfied in form while being defeated in substance.** `coverage.moves` is `{}` (X1 clean) but `coverage.inherited` carries the nine gate→child pairs, and the runner prints `0 declared move(s) … moves are refused outright under this runner — TOOLING-REVIEW-r3 X1` while eleven `b-ntc-*` successors execute. `REQUESTS 09:05 (1)` asked the PM for a MOVES_RULING; no `DECISIONS` line grants it. Astra's own report concedes it "requires separately reviewed tooling and PM disposition". | must fix — authority |
| **R6** | **The brief on this head is not the brief of record.** `DECISIONS:108(a)` accepted the brief *by sha256* `0ba59cca…` (56 010 B at `68fbca4`, re-measured). At `71fb2f1` it is `89cc1c3a…`, **102 038 B** — it nearly doubled. The spec honestly records `brief.acceptedLedgerLine: null` and the brief's own line 1 says "**PROPOSED, NOT ACCEPTED**". A new acceptance line is required before any seal. | must fix — authority |
| **R7** | **The child re-pin makes every sibling lane-B package unsealable, and the BUILD-REPORT mis-states why.** Measured on this tree: `B1` and `B2` → `PARENT-PIN-BROKEN rebuild/m4/workout/engine-runtime.cjs`; `B3`, `B4`, `B-LOM` → `UNLISTED-SOURCE-CHANGE` naming all sixteen `b-ntc-*.cjs` files. BUILD-REPORT:146-147 says the FAIL "is also not B-NTC-specific: the control package `B1` fails identically on the same tree". B1 fails **because of** B-NTC, and for a *different* reason than B-NTC does. | must fix — claims |
| **R8** | **The tooling's own regression suite is RED on this tree.** `node --test rebuild/lanes/b/tooling/test/execution-targets.test.cjs` → **9 tests / 8 pass / 1 fail**, exit 1: `not ok 4 - inherited pinned original cannot become a trailing application argument`, `15 !== 5` at `execution-targets.test.cjs:103`. It pins `B-NTC.json.children.length === 5`; the spec declares **14** at `0876043`/`00aa51c` and **15** at `71fb2f1`. `TOOLING-FIX-ASTRA-REPORT.md` claims "**9 passed / 0 failed**, exit 0". Not reproducible at any commit in this range. It also has no CI home. | must fix — claims |
| **R9** | **BUILD-REPORT's headline figures are pre-merge and now wrong.** It states the provider cells at **36/36** (measured 39), the today suite at **123/123** and **129/129** (measured **163/163** over the seven enumerated files), and delta cell **G1 as "UNCHANGED … blocked / PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED"** when G1 now passes as "the wall is GONE". | should fix — claims |
| **R10** | **`b-ntc-successors.test.cjs` writes to tracked files in place** — `rebuild/m4/workout/engine-runtime.cjs`, `.github/workflows/rebuild.yml`, `rebuild/m4/workout/native-trend-context.cjs` — restoring only in a `finally`. A kill mid-run leaves corrupted tracked bytes in the checkout; run concurrently with anything else it produces false RED (I reproduced both: §H note). This gate is declared as a CI child. | should fix — code |
| **R11** | The `rirPlan` half of the H6 hunk is **unproven**. Removing its bind scoping leaves gym + delta + adapter + A0 journey at **109/109 pass** (bites M8, M16). One untested line inside the one-hunk licence. | note |
| **R12** | The successor rewrites **two original assertions** (`witnesses`' exposed-surface `deepEqual`, `cases`' mutant-detector target). `b-ntc-successors.cjs` is self-pinned by the spec it validates, so a *weakening* of either retarget cannot be caught by any gate — only by a reviewer. The retarget that exists does bite (bite M19 RED). | note |
| **R13** | Brief §4.2 still reads, verbatim, "Adding two names to `EXPOSED` turns `native-carriers --ci` RED. **Refused.**" — the opposite of what the head does. §v1.2's "read 'behind an option' as 'as the behaviour'" instruction covers it, but a reader of §4.2 alone is misled. | note |
| **R14** | `node rebuild/m3/w6/test/run-current-head.cjs --all` **does not run in this worktree**: `Error: Public source preparation failed: archive` at `run-current-head.cjs:9`, because line 11 runs `git archive` with `cwd` set to a sibling **R1** checkout that does not exist here. Pre-existing environment prerequisite, not B-NTC's. | note — tooling |

**No fail-open was found in the provider.** Every unprovable path I drove throws.

---

## A. Scope and fidelity — the engine untouched, the merge clean

```
$ git log --oneline 68fbca4..71fb2f1        → 71fb2f1 00aa51c 0876043 4e992b9 (+7748880…)
                                              9eb46bd (merge 7b1678a) a1d8252 56c79ac d78aff4 …
$ git diff --shortstat 68fbca4 71fb2f1       → 125 files changed, 33 423 insertions(+), 958 deletions(-)
$ git diff --name-status 7b1678a 71fb2f1     → total=48  M=7  A=41  D=0
$ git diff 7b1678a 71fb2f1 -- rebuild/engine    → (empty)   exit 0
$ git diff --name-status 7b1678a 71fb2f1 -- rebuild/conform → (empty)
$ git diff --name-status 68fbca4 71fb2f1 -- rebuild/engine rebuild/conform → (empty)
```

**Confirmed: `rebuild/engine/**` and `rebuild/conform/**` are byte-identical to the tip.**
The frozen laws, oracles, goldens and census runner are untouched by this whole range.

**Nothing hid inside the C4 merge resolution.** The diff against the tip is the complete
list, and of lane C's merged custody only three paths differ — each a declared B-NTC edit:

```
$ git diff --name-only 7b1678a 71fb2f1 -- rebuild/m3/w6/local rebuild/m3/w6/test \
      rebuild/m3/setup/port rebuild/lanes/c rebuild/m3/w7-preview/today
  rebuild/m3/w6/local/today-bindings.mjs          ← the H6 wiring (§D)
  rebuild/m3/w7-preview/today/test/gym.test.mjs   ← three A2 cells re-authored (:109)
  rebuild/m3/w7-preview/today/test/ntc-h6-delta.test.mjs  ← new, the seven delta cells
$ git diff --name-only 7b1678a 71fb2f1 -- rebuild/DECISIONS.md rebuild/lanes/STATUS.md \
      rebuild/lanes/REQUESTS.md                    → (empty)
$ git diff --name-only 7b1678a 71fb2f1 -- rebuild/m4/spec | grep -v b-ntc-   → (empty)
```

Every other lane C blob — `rebuild/m3/w6/local/**`, `w6/test/**`, `setup/port/**`,
`lanes/c/**`, the rest of `today/**` — equals the tip's bytes exactly. So does
`.github/workflows/slice-host.yml`. So do `acceptance-native-carriers.json`,
`review-native-carriers.json`, `NATIVE-CARRIERS-THEME.md` and `native-carriers-package.cjs`:
**this package re-pins the parent's artefacts from inside its own spec and edits none of
them**, which is what `DECISIONS:109` PATH A asks for.

**Files outside the brief's enumerated hunks, judged.** The 41 additions are: the three
`ntc/*.patch` files and five lane-B review/report docs (inert; but see R4 — all three patches
now fail `git apply --check`), the whole `rebuild/lanes/b/tooling/**` tree copied in at
`4e992b9` (six package specs, the runner, README, two reports, one test), and the sixteen
`rebuild/m4/spec/b-ntc-*` files plus `native-trend-context.cjs` and its test. The three
docs/ledger files are **identical to the tip**, which means the ledger carries no line for
any of the five Astra commits.

**The two ledger-visible re-pins, verified:**

| file | tip bytes | head bytes | ruled by |
|---|---|---|---|
| `rebuild/m4/workout/engine-runtime.cjs` | `9be21897…` | `c03732e8…` | `:109` PATH A (child re-pin) |
| `rebuild/m3/w6/host/engine-runtime-host.cjs` | `114411b1…` | `e210bfa0…` | mirror of the above |
| `.github/workflows/rebuild.yml` | `f57ced40…` | `3a8d46ce…` | `:109` enumeration — **but see R3** |

Both runtime files widen `EXPOSED` to `['genSession','rirPlan','dayWeather','cleanAtDate']`
and add two thin forwarders each; `E` itself still never leaves the factory. The mirror is
held to the accepted runtime by `engine-equivalence.test.cjs` — proven, not assumed: bite
**M12** (add a fifth name to the host mirror only) turns it RED.

---

## B. The provider — every r1 code finding closed, and I re-drove them

```
$ node --test --test-reporter=tap rebuild/m4/workout/test/native-trend-context.test.cjs
  # tests 39 · # suites 0 · # pass 39 · # fail 0 · # cancelled 0 · # skipped 0 · # todo 0
  EXIT=0
```

**39/39, exactly the builder's figure** (22 at r1's head → 36 at the first fix pass → 39).

### B.1 F1 — the identity claim is withdrawn, and what replaced it is enforced

`native-trend-context.cjs`'s header now opens the CORRESPONDENCE section with *"WHAT IS NOT
ENFORCEABLE, STATED FIRST (review r1, F1). Object IDENTITY across the engine seam is NOT
enforceable, and this module no longer claims it"*, cites `engine-capture.cjs:52`, and
replaces it with three re-checked-per-request properties: **scope** (a live reference held
only for the window), **`bindingDigest`** (a 64-bit two-lane FNV-style change detector over
exactly the members `resolve` reads — `profile · source_revision · sessions.length ·
per-session start_op_id, sorted effective tuple, own `pace` on session and on record), and
**value correspondence** (`source_revision` ===, exactly one matching `start_op_id`, whole
`effective` tuple by own-key count then key-by-key). `resolve` checks the digest **first**,
before reading anything out of the bound object (`native-trend-context.cjs:429-431`). The
digest is deliberately **not** echoed to the engine, so `performed.cjs:200-204`'s own
comparison is unaffected. The header states plainly that it "is NOT cryptographic and is not
described as a commitment".

Load-bearing, measured: bite **M1** deletes the digest line → **RED**. Bite **M7** makes
`resolve` answer outside the window instead of refusing `no_bound_source_facts` → **RED**.

### B.2 F6 and F7 — both closed, both tested

* `rushedOf` now collects declarations from **both** `session` and `session.record`, and
  refuses `session_pace_disagreement` when the two differ rather than resolving by
  precedence. Bite **M3** (delete the disagreement refusal) → **RED**.
* `bind(null)` / `bind(undefined)` now **throws** `…bind requires a facts object; use
  unbind() to clear` instead of silently unbinding. Bite **M2** (restore the silent unbind)
  → **RED**.
* `bound()` still hands out the live object; the header now says so and says the digest is
  what makes a write through it visible.

### B.3 The EXPOSED widening is exactly `{dayWeather, cleanAtDate}`, and nothing is re-implemented

```
$ git diff 7b1678a 71fb2f1 -- rebuild/m4/workout/engine-runtime.cjs
  -const EXPOSED=Object.freeze(['genSession','rirPlan']);
  +const EXPOSED=Object.freeze(['genSession','rirPlan','dayWeather','cleanAtDate']);
  +  dayWeather:(s,iso)=>E.dayWeather(s,iso),cleanAtDate:(s,iso)=>E.cleanAtDate(s,iso)});
```

Two names, two forwarders, in both the accepted runtime and its host mirror. Nothing else on
the surface moved.

**No second implementation.** `createEnginePredicateDayFacts` is thirteen lines and every one
of them either calls `engine.dayWeather` / `engine.cleanAtDate` or refuses:

```js
try { weather = engine.dayWeather(state, iso); } catch (_) { unqualified('day_weather_unreadable', { day: iso }); }
if (!weather || typeof weather !== 'object' || typeof weather.hardSession !== 'boolean') unqualified('day_weather_not_boolean', …);
try { clean = engine.cleanAtDate(state, iso); }  catch (_) { unqualified('clean_at_date_unreadable', { day: iso }); }
if (typeof clean !== 'boolean') unqualified('clean_at_date_not_boolean', …);
return { hard: weather.hardSession, debt: !clean };
```

No halo, no three-night run, no threshold, no date arithmetic — the module restates nothing.
It is also **stricter than the legacy branch on purpose**, and says so: `progression.cjs:702,704`
wraps each predicate in `catch { …= false }`; this reader refuses instead, because
`PERFORMED-ENGINE-v1.md:254` forbids "caught exceptions interpreted as false". Bite **M5**
(restore the legacy `catch → {hard:false,debt:false}`) → **RED**.

`createDayFactsReader` takes **no flag** — the `DECISIONS:109` option is gone — and refuses
to compose at all against a runtime missing either predicate rather than downgrading to the
empty-history reader. Bite **M4** (make it downgrade silently) → **RED**. That is the right
place for the check: a silent downgrade would answer `hard:false, debt:false` while *looking*
like the mapped behaviour.

---

## C. The two `DECISIONS:109` obligations — **both discharged**, on my own probe

The package's own cells are `rebuild/m3/w7-preview/today/test/ntc-h6-delta.test.mjs`:

```
$ node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/ntc-h6-delta.test.mjs
  ok 1 - B-NTC G1 — OBLIGATION (ii): the product athlete's day+3 wall is GONE (was gym.test.mjs:621)
  ok 2 - B-NTC G2 — the days after the wall are ENGINE days now, not refusals (was gym.test.mjs:639)
  ok 3 - B-NTC G3 — the composed day reader reports the ENGINE's own predicates (was gym.test.mjs:657)
  ok 4 - B-NTC G4 — OBLIGATION (ii) CONDUCTED: the 28-night athlete trains day+3 end to end
  ok 5 - B-NTC G5 — OBLIGATION (i): a FRESH athlete's day+3 on the SAME lift group prepares and is conducted
  ok 6 - B-NTC G6 — previous performance survives the bind window on the day the provider opens
  ok 7 - B-NTC G7/O10 — C4 Last time reads the performed shape on the default qualified local-era path
  # tests 7 · # pass 7 · # fail 0
```

### C.1 My own probe — the real product entry point, both states

I did not take those cells on trust. I wrote my own probe
(`…/rv-ntc2-scratch/probe-c.mjs`, outside the repository), which composes
`createGymHost` + `createGymModel` — the same pair `today-entry.mjs` uses — over a real
`faultDatabase()` IndexedDB, conducts day+0 and day+1 on **separate page loads**, then reads
and conducts day+3, for both athlete states. Verbatim output:

```
--- FRESH zero-night | base=2026-09-04 | nights=0 events=0
   day+0 {"phase":"ready","closed":true,"settled":"finished","sets":5,"ops":7}
   day+1 {"phase":"ready","closed":true,"settled":"finished","sets":3,"ops":12}
   day+3 (day 4, same lift group) => {"phase":"ready","closed":true,"settled":"finished","sets":5,"ops":19}
--- PRODUCT 28-night | base=2030-02-04 | nights=28 events=0
   day+0 {"phase":"ready","closed":true,"settled":"finished","sets":4,"ops":6}
   day+1 {"phase":"ready","closed":true,"settled":"finished","sets":4,"ops":12}
   day+3 (day 4, same lift group) => {"phase":"ready","closed":true,"settled":"finished","sets":4,"ops":18}
```

* **Obligation (i)** — the FRESH zero-night athlete (`createCleanInitState`, `w` seeded from
  the lift's own declared steps): day+3 on the same lift group is **READY → Started → every
  set logged → closed**, ops 12 → 19. ✔
* **Obligation (ii)** — the 28-night product athlete
  (`createTodayModel({}).stateFromOps()`, `sleep.nights.length === 28`, `events.length === 0`,
  which I asserted directly): day+3 is **READY → Started → sets → closed**, ops 12 → 18. ✔
  This is the athlete `today-entry.mjs:26` actually passes, and it is the case review r1 F2
  proved was *not* moved at `68fbca4`. It is moved now.
* **One reader, both athletes** — as the header claims. I did not find a second path.

### C.2 Fail-closed per night — measured at the predicate boundary

Same probe, driving `createDayFactsReader` over the real composed runtime:

```
   per-night well-formed 28              => {"hard":false,"debt":false}
   per-night one DATED poisoned night among the 28
                                         => REFUSED NATIVE_TREND_CONTEXT_UNQUALIFIED / clean_at_date_unreadable
   per-night one night with a non-numeric h  => {"hard":false,"debt":true}
   per-night one night with a malformed date => {"hard":false,"debt":false}
   per-night nights not an array         => REFUSED NATIVE_TREND_CONTEXT_UNQUALIFIED / clean_at_date_unreadable
```

**A night the predicate cannot read refuses, and refuses by name — it is never skipped.**
That is `:109`'s "fail-closed on any night it cannot map", discharged.

The middle two rows are worth stating precisely so nobody over-reads the guarantee. A night
with a garbage `h` and a night with a garbage date are both **answered**, because the
engine's own `cleanAtDate` answers for them (`debt:true` for the first — the conservative
direction; `nightsBefore` filters the second out entirely). The provider defers completely,
which is exactly what PATH A requires. So the honest statement is: **fail-closed holds at the
predicate boundary, not at a semantic-validity boundary.** The provider refuses when the
engine cannot answer; it reports whatever the engine does answer. Nothing is guessed either
way, and I found no path where a refusal becomes a value.

---

## D. H6 after C4 — r1's F3 is closed **by construction**, and the suites are green

The wiring no longer lives in `gym-host.mjs` (C4 made that a thin wrapper). It is now in
lane C's `rebuild/m3/w6/local/today-bindings.mjs`, and the shape is the right one:

```js
const trendBinding = NativeTrend.createNativeTrendContextBinding({ dayFacts: iso => { … } });
const runtime = HostRuntime.createEngineRuntime({ clock: engineClockFor(day),
  nativeTrendContext: nativeTrendContext || trendBinding.resolve });
dayReader = NativeTrend.createDayFactsReader({ state: engineState, engine: runtime });
const scoped = (facts, run) => facts ? trendBinding.withFacts(facts, run) : run();
const engine = Object.freeze({
  genSession: (s, iso, slp) => scoped(s && s.workoutFacts, () => runtime.genSession(s, iso, slp)),
  rirPlan:    (s, ex, slp)  => scoped(s && s.workoutFacts, () => runtime.rirPlan(s, ex, slp)) });
```

**Every engine read opens its own re-entrant window over its own facts.** `readPrevious()`
runs after the producer returns and calls `engine.genSession` — which now gets a window from
`s.workoutFacts` rather than finding `bound === null`. r1's F3 ("the card silently shows no
previous performance on exactly the days B-NTC unblocks") is therefore not merely patched but
structurally removed: there is no "outside the window" genSession path left in this host.
Delta cell **G6** measures it, and passes. `createUnavailableNativeTrendContext` is no longer
imported at all; an explicitly injected resolver still wins, so a caller can still override.

Fail-closed if `s.workoutFacts` is absent: `scoped` runs unbound, and `resolve` refuses
`no_bound_source_facts`. Correct direction.

```
$ node --test --test-reporter=tap rebuild/m3/w7-preview/today/test/{adapter,checkin,design,gym,ntc-h6-delta,package,view}…
  # tests 163 · # suites 0 · # pass 163 · # fail 0 · # cancelled 0 · # skipped 0 · # todo 0   EXIT=0
```

Per file, measured separately: `adapter 20 · checkin 28 · design 11 · gym 64 ·
ntc-h6-delta 7 · package 10 · view 23`.

**Against the base figures `DECISIONS:111` records** ("today 64 / gym 64 / checkin 28"):
today = adapter 20 + design 11 + package 10 + view 23 = **64 unmoved**; gym = **64 unmoved**;
checkin = **28 unmoved**; + the 7 new delta cells = **163**. Not one accepted A2/A3 cell
count moved, and the three re-authored `gym.test.mjs` subtests are re-authored in place
(64 → 64), which is what `:109`'s "A2's spike table becomes delta cells" asks.

```
$ node --test --test-reporter=tap rebuild/m3/w6/host/test/journey.test.mjs \
                                   rebuild/m3/w6/host/test/engine-equivalence.test.cjs
  # tests 23 · # pass 23 · # fail 0      EXIT=0        (journey.test.mjs alone: 18; `await t.test(` = 17)
```

`DECISIONS:111` records **host 22** at the tip; **23** here — the +1 is B-NTC's journey step.
This is the same 22-vs-23 accounting r1 flagged as F4; it is now consistent.

`node rebuild/m3/w6/test/run-current-head.cjs --all` — **NOT RUN, and I do not report it as
a pass.** It aborts before any test: `Error: Public source preparation failed: archive`
(`run-current-head.cjs:9`), because `:11` runs `git archive` with `cwd` set to a sibling R1
checkout absent from this worktree layout. `DECISIONS:111`'s base figure is
`run-current-head --all 552/552`; I could not reproduce or refute it here (R14).

**One gap (R11).** The `rirPlan` half of the hunk is not exercised by anything. Bite **M8**
(drop its scoping) leaves the delta cells green; bite **M16** widens the check to
`gym + ntc-h6-delta + adapter + journey` and still measures **109 tests / 109 pass / 0 fail,
exit 0**. The line may well be right — but it is unproven, and it sits inside a one-hunk PM
licence, where an unproven line is exactly what should not be.

**Custody note for the PM.** `DECISIONS:108(b)` lifted lane C's licence for **one hunk in
`gym-host.mjs`**. What landed is ~25 lines in `today-bindings.mjs` — a different file, in
lane C's `:111` custody. The change is a faithful consequence of C4 moving the composition,
and `gym-host.mjs` is byte-unchanged as `:111` promised; but the licence as written does not
name this file, and only the PM can say whether it stretches.

---

## E. The successor children — the mechanism is sound, the authority is missing

### E.1 What it actually does

`rebuild/m4/spec/b-ntc-successors.cjs` (131 lines) plus ten four-line wrappers
(`b-ntc-{traces,direct,legacy,witnesses,cases,source-carriers,inherited-carriers,
defect-witnesses,writers-differential,second-gate}.cjs`, each just
`require('./b-ntc-successors.cjs').run('<name>')`) and `b-ntc-profile-refusals.test.cjs`
— **eleven successors** over the parent's nine inherited gate→child pairs.

The mechanism is genuinely careful, and I traced it line by line:

* `manifest()` sha-checks `acceptance-native-carriers.json` against the immutable
  `e940359b…`.
* `original(file)` reads each parent gate body from disk, asserts its sha equals the
  parent's own `executionPins[file]`, **and** asserts the bytes equal the Git blob at
  `b95ccca…` — two independent anchors.
* `actualChild()` asserts every parent pin is byte-identical on disk except the two declared
  `superseded-by-child` overlay paths, and that each of those equals the spec's `post`.
* The originals are compiled into **private** `Module` instances with an injected `require`,
  so nothing enters `require.cache`; the only substitution is one exact string in
  `native-carriers-source.cjs` swapping the runtime SUPPORT pin for the child's.
* `profile.verify()` is stubbed to return `{...parent, accepted:false}` — child acceptance is
  never inherited. `b-ntc-successors.test.cjs` then asserts no global `fs`/`Module._load`
  hook survives.

```
$ node --test --test-reporter=tap rebuild/m4/spec/b-ntc-profile-refusals.test.cjs  → # tests 13 · # pass 13 · # fail 0  EXIT=0
$ node --test --test-reporter=tap rebuild/m4/spec/b-ntc-successors.test.cjs        → # tests 4  · # pass 4  · # fail 0  EXIT=0
$ node rebuild/m4/spec/b-ntc-focused.cjs   → B-NTC FOCUSED: 15/15 PASS; original assertions and actual child runtime   EXIT=0
$ node rebuild/m4/spec/b-ntc-journeys.cjs  → B-NTC DURABLE JOURNEYS: 237/237 PASS; Today, gym, check-in,
                                             default-provider multi-day, host equivalence and one-store joins  EXIT=0
```

(Both test files must be run **alone**: see R10. Run concurrently with anything else they
report 13/14 and 0/4 — I reproduced that false RED and then the true green serially.)

### E.2 Does a successor really execute the parent's own body against the child's bytes?

Yes — and I proved it in both directions rather than taking the wrapper's word.

* **Tamper the original → refused.** Bite **M13**: append `// inert reviewer comment` to
  `rebuild/m4/spec/native-carriers-witnesses.cjs` → `b-ntc-witnesses.cjs` **RED**,
  `AssertionError: Unlisted parent pin drift rebuild/m4/spec/native-carriers-witnesses.cjs`.
* **Tamper the child → refused.** Bite **M14**: append a comment to `engine-runtime.cjs` →
  **RED**, `AssertionError: Exact actual child supersession rebuild/m4/workout/engine-runtime.cjs`.
* **Forge the pin to hide the drift → still refused.** Bite **M18**: rewrite the spec's
  `post` to a zero hash → **RED**, same assertion.
* **The inherited assertion still bites against the child's bytes.** Bite **M19** is the one
  that matters: drop `cleanAtDate` from `EXPOSED` **and re-pin the spec's `post` in
  lockstep**, so preflight passes and the original gate body genuinely runs over the changed
  runtime → `b-ntc-witnesses.cjs` **RED, exit 1** (runtime `c03732e8…` → `8183ec89…`). The
  parent's own exposed-surface `deepEqual` is live, not decorative.

**Two original assertions are rewritten, and this must be stated plainly (R12).** `run()`
does exact text replacement in exactly two gates:

```
witnesses: assert.deepEqual(COMPOSITION.exposed.slice().sort(),['genSession','rirPlan'],…)
        →  assert.deepEqual(COMPOSITION.exposed.slice().sort(),['cleanAtDate','dayWeather','genSession','rirPlan'],…)
cases:     path.join(root,'rebuild/m4/workout/test/native-next-targets.test.cjs')
        →  path.join(root,'rebuild/m4/spec/b-ntc-native-next-targets.test.cjs')
```

Neither is *dropped* or *weakened* — the first is still an exact four-name `deepEqual`, the
second still a real mutant detector — and both retargets are unavoidable consequences of
`:109` PATH A. But `b-ntc-successors.cjs` is **itself pinned by the very spec it validates**
(bites **M15** and **M17**, which delete each retarget, both go RED with `Exact declared
child bytes rebuild/m4/spec/b-ntc-successors.cjs`). The pin is therefore circular with
respect to *semantics*: a future pass could turn either retarget into `assert.ok(true)` and,
as long as the spec's `post` is regenerated in the same commit, **no gate anywhere would
notice**. Only a reviewer reading those two strings can. The PM should know that this is the
one place in the mechanism where trust is human, not mechanical.

**The boundary of what the successors prove.** Bite **M20** scrambles the `MODULES`
composition order (`dates`↔`constants`) with the spec re-pinned in lockstep: the `witnesses`
successor is **GREEN** — it checks reachability, not order. Bite **M21** shows the order is
covered elsewhere: the same mutation against `rebuild/m3/w6/host/test/journey.test.mjs` gives
**18 tests / 16 pass / 2 fail**. So the surface is held, but by the A0 journey, not by the
inherited carriers.

### E.3 Is this the ruling `REQUESTS 09:05 STOP (1)` asked for? — **Yes, and it is missing (R5)**

The mapping declared in `rebuild/lanes/b/tooling/packages/B-NTC.json` is
`coverage.inherited`, and I verified byte-for-byte that its nine pairs are **identical to the
parent artifact's own `coverage.byChild`**:

```
$ node -e "…acceptance-native-carriers.json… / …B-NTC.json…"
parent coverage.byChild == child coverage.inherited ==
  migrate-source→source-carriers · merge-source→source-carriers · writers-source→source-carriers
  witnesses-2→inherited-carriers · witnesses-5→inherited-carriers · migrate-differential→inherited-carriers
  witnesses-7→defect-witnesses   · writers-differential→writers-differential · second-gate→second-gate
$ B-NTC.json coverage.moves → {}
```

So **no new gate id is claimed and X1 is literally satisfied** — and Astra's own report says
so ("`coverage.moves` … stays `{}`, MOVES_RULING stays null"), which is honest.

But look at what the runner prints for a PM skimming the line:

```
B PACKAGE B-NTC SPEC OBSERVED … 0 declared move(s), each naming its own original executable
in a relative require specifier (moves are refused outright under this runner — TOOLING-REVIEW-r3 X1)
```

"0 declared move(s) … refused outright under this runner" is true of the `moves` key and
false of the package: **eleven successor executables carry nine inherited originals.** The
ruling `REQUESTS 09:05 (1)` asked for — *"B-NTC may declare successor children for the gates
whose parent carrier reads engine-runtime.cjs, each executing the parent gate's own original
with the child's bytes"* — is precisely the authority this mechanism needs, and no
`DECISIONS` line grants it. The builder proceeded anyway, under a spec key the X1 rule does
not name.

**This is not a hypothetical objection: the runner itself agrees with me.** It refuses the
mapping (§F.3). So the package is in the position of having built the mechanism, asked for
the authority, not received it, shipped regardless, and been refused by its own gate.

**The ruling text that would make it legitimate under X1** (my recommendation — the PM should
ratify it as written or not at all):

> **MOVES_RULING B-NTC-INHERITED-1.** For M2-B-NTC only, and for the nine gate ids the
> accepted parent artifact `acceptance-native-carriers.json` `e940359b…` already records in
> `coverage.byChild`, the child may declare `coverage.inherited` naming a **successor
> executable** for each parent child name, on the conditions that (a) `coverage.moves` stays
> `{}`; (b) each successor compiles the parent gate's own original body, sha-verified against
> the parent's `executionPins` **and** against the Git blob at the parent's acceptance commit
> `b95ccca…`, in a private module that never enters `require.cache`; (c) the only text
> substitution permitted is a pin re-target made necessary by a declared
> `superseded-by-child` product path, and **every such substitution is enumerated verbatim in
> the package spec and in the review** — at this head there are exactly two, the
> `witnesses` exposed-surface `deepEqual` and the `cases` mutant-detector target; (d) the
> child never inherits the parent's `accepted` boolean; and (e) the tooling records this
> ruling id and refuses `coverage.inherited` in any package that does not cite it. The
> successor mechanism is a **cumulative-profile supersession, not a coverage move**, and this
> ruling does not widen X1 for any other package.

Nothing less will do, because without (c) the retarget list is unbounded and, as E.2 shows,
unenforceable by machine.

---

## F. The engine gate — laws unmoved, census unmoved, **both package gates refuse**

### F.1 The register — unmoved, exactly as required of a package with no D-id

```
$ node rebuild/conform/v4/run-defect-laws.cjs        (ENGINE_MAIN/ENGINE_OLD from rebuild/conform/engines/)
TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls ·
97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
```

**45 RED-frozen / 39 RED-candidate — identical to the base figure review r1 measured.** The
tooling runner reports the same row independently: `B PACKAGE B-NTC LAWS 45/45 executed | …
45 RED-frozen · 39 RED-candidate … 0 HARNESS_ERROR`, and correctly adds `this package
declares NO D-id, so these rows are the register BASELINE and prove nothing about it`.
`AUDIT RED-FIRST FAIL` is the pristine terminal on this tree.

### F.2 The public census — byte-identical

```
$ node rebuild/conform/run.cjs
SUITE INCONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families
                     · 70 GREEN against present families                        (exit 1)
```

Character-for-character the line r1 measured on the base tree. It could not have moved:
`rebuild/conform/**` and `rebuild/engine/**` are byte-identical to the tip (§A).

### F.3 The parent gate refuses by design — reproduced, and the exact line

```
$ node rebuild/m4/spec/native-carriers-package.cjs --ci
NATIVE CARRIERS PACKAGE FAIL; required evidence missing or failed; local diagnostics withheld
EXIT=1
```

That single line is the *entire* output. To establish **why** — the gate withholds its
diagnostics by design — I ran a read-only probe outside the repository that calls
`native-carriers-profile.verify()` directly:

```
PROFILE VERIFY THREW
  message: Adopted support bytes: rebuild/m4/workout/engine-runtime.cjs
    + actual   'c03732e896a9596a06edd304bb8f23f2340c29b5e036043a4205f225916be936'
    - expected '9be218975e39d84465f6c337d48b60c5009f268eb68d7b9808871ad867c61b23'
  public line: NATIVE CARRIERS PACKAGE FAIL; … withheld   exit=1
```

**The builder's claim here is CONFIRMED.** The parent M2-NATIVE-CARRIERS profile keeps its
own execution pin and refuses on the child's bytes, exactly as `DECISIONS:109` says it
should ("that refusal is the child's to supersede, and no separate parent re-seal is wanted").
This is by design and is not a finding on its own.

### F.4 But the child's gate refuses too — **and this is R1**

```
$ node rebuild/lanes/b/tooling/b-package.cjs --ci B-NTC
B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B-NTC|B-LOM|B1|B2|B3|B4     EXIT=1
$ node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
… POSTFIX M2-B-NTC-NATIVE-TREND-CONTEXT REVIEW-PENDING mode=--ci
… ENVELOPE ABSENT; rebuild/m4/spec/acceptance-b-ntc-native-trend-context.json is not sealed yet — no PASS word is available
… PARENT PINS RE-ASSERTED … 29 pin(s) … 23 un-superseded grandparent pin(s) … byte-identical on disk AND in Git at HEAD
… PRODUCT PARTIAL; 26 at the declared post-image / 7 at the pinned pre-image / 20 carried byte-identical
    from the parent / 0 unlisted drift … 2 declared role "superseded-by-child"
… FIDELITY OBSERVED; sourceBase 7b1678a ancestor of HEAD 71fb2f1 … 16 of 18 PIN_PATHS present and byte-identical
… AUTHORITY OBSERVED … theme NULL — no PASS word is available; brief acceptance NULL — the obligation stays open
… LAWS 45/45 executed | … 45 RED-frozen · 39 RED-candidate … 0 HARNESS_ERROR
… CHILD traces / direct / legacy / witnesses / cases / source-carriers / inherited-carriers /
    defect-witnesses / writers-differential / second-gate / ntc-provider-cells / focused /
    durable-journeys / profile-refusals / child-pin-refusals    — all 15 OBSERVED; exit 0, exact declared verdict
B PACKAGE B-NTC FAIL; required evidence missing or failed; local diagnostics withheld       EXIT=1
```

**The terminal line is `FAIL`, exit 1 — not the expected `CI REVIEW-PENDING … exit 2`.** No
`PASS` word appears anywhere, which is correct; but neither does a reviewable verdict.

`--full` is the same:

```
$ node rebuild/lanes/b/tooling/b-package.cjs --full --package B-NTC
… the same 15 children OBSERVED …
B PACKAGE B-NTC FAIL; required evidence missing or failed; local diagnostics withheld       EXIT=1
```

**The BLOCKED private line is never produced.** `b-package.cjs:884-891` would throw
`REQUIRED-PRIVATE-PREPARATION-MISSING` (a code on the closed BLOCKED list, exit 2) at
`privateOracle()`, but `coverage()` at line 946 throws first. So the standing
`DECISIONS:97` blocked-private terminal remains unproducible for this package id — open item
O4 is *still* open, for a new reason. **I never sought the private fixture;
`rebuild/conform/private` does not exist on this tree and was never opened.**

**The cause**, obtained by preloading a read-only `node:assert/strict` tracer that logs a
refusal before the runner's catch discards it (no repository byte touched):

```
TRACE-ASSERT: INHERITED-COVERAGE-CHILD-IS-NOT-A-PARENT-PINNED-EXECUTABLE
              migrate-source source-carriers rebuild/m4/spec/b-ntc-source-carriers.cjs
B PACKAGE B-NTC FAIL; required evidence missing or failed; local diagnostics withheld
TRACE-EXIT code=1
```

The runner requires an inherited-coverage child to be a **parent-pinned** executable.
`b-ntc-source-carriers.cjs` is a new file. **The tooling refuses the successor mechanism —
which is exactly the authority `REQUESTS 09:05 (1)` asked the PM to grant (§E.3).**

### F.5 Every sibling lane-B package now fails too, and the BUILD-REPORT mis-diagnoses it (R7)

Same tracer, same tree, `--ci` for each id:

```
B1     → PARENT-PIN-BROKEN rebuild/m4/workout/engine-runtime.cjs                     exit 1
B2     → PARENT-PIN-BROKEN rebuild/m4/workout/engine-runtime.cjs                     exit 1
B3     → UNLISTED-SOURCE-CHANGE  rebuild/m4/spec/b-ntc-cases.cjs … (all 16 b-ntc-* files)  exit 1
B4     → UNLISTED-SOURCE-CHANGE  (the same 16)                                        exit 1
B-LOM  → UNLISTED-SOURCE-CHANGE  (the same 16)                                        exit 1
```

`BUILD-REPORT-B-NTC.md:146-147` says: *"No PASS word is claimed, and the FAIL is reported as
it happened. It is also not B-NTC-specific: the control package `B1` fails identically on the
same tree."* The first sentence is admirably honest. **The second is wrong twice over:** B1
does not fail *identically* (different assertion), and its failure is **caused by B-NTC** —
`PARENT-PIN-BROKEN` on the very file B-NTC re-pinned. B-NTC has, on this tree, made all five
sibling lane-B packages unsealable until each re-pins. That is a real and undisclosed cost of
the child re-pin, and `DECISIONS:103` (1) makes it immediate: B1 is the next package in the
ruled order.

---

## G. `rebuild.yml` — the enumeration is right; two deletions are not disclosed

```
$ git diff 7b1678a 71fb2f1 -- .github/workflows/rebuild.yml
-      - name: Synthetic Today projection, UI and preview package
-        run: node --test rebuild/m3/w7-preview/test/model.test.cjs …/view.test.cjs …/package.test.cjs
-      - name: Cumulative extracted-engine native-carrier and legacy-census evidence
-        run: node rebuild/m4/spec/native-carriers-package.cjs --ci
+      # B-NTC succeeds the memory-only preview with the executed durable Today,
+      # gym and check-in suites below. Historical preview tests remain in Git.
+      - name: Cumulative B-NTC native-carrier and legacy-census evidence
+        run: node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC
…
-      - name: A1/A2 — the rebound Today page and the gym card
-        run: node --test …/{adapter,design,gym,package,view}.test.mjs
+      - name: A1/A2/A3 — the rebound Today page, the gym card, the check-in and the B-NTC delta cells
+        run: node --test …/{adapter,checkin,design,gym,ntc-h6-delta,package,view}…
```

**The enumeration half is exactly right.** Seven files named, not globbed, `checkin.test.mjs`
and `ntc-h6-delta.test.mjs` added — precisely what `:109` rules rides this seal, and the
comment block explaining it is good work. I ran that exact set: **163/163, exit 0** (§D).

**The other two hunks are the problem.**

1. **The `# pass 19` memory-only step is deleted.** `:109` authorises retiring that child
   "together with its CI step, **with the successor evidence named**". The step is gone; the
   *child* is not (`native-carriers-package.cjs:65` still carries
   `child('browser-package', … 'rebuild/m3/w7-preview/test/'+n+'.test.cjs' …, '# pass 19')`);
   and the successor evidence is asserted in a YAML comment ("B-NTC succeeds the memory-only
   preview with the executed durable Today, gym and check-in suites below") rather than
   demonstrated. Those 19 memory-only tests now run **nowhere** in CI.
2. **The parent gate step is replaced, not retired.** `:109` says nothing about removing
   `node rebuild/m4/spec/native-carriers-package.cjs --ci` from CI, and the substitute is the
   command §F.4 measures at **exit 1**. So this hunk simultaneously removes a passing gate
   and installs a failing one (**R2**).

Neither deletion appears in the brief's §4 table headed *"What else moved, and why — nothing
hidden"*, which records only the enumeration. `REQUESTS 09:05 (2)` explicitly asked the PM to
"confirm, or say 'patch file only'" for `.github` — **unruled**, and the lane went further
than the thing it asked about.

### G.1 The retirement patch does not apply (R4)

```
$ git apply --check rebuild/lanes/b/ntc/pass19-retirement.patch
error: patch failed: .github/workflows/rebuild.yml:76
error: .github/workflows/rebuild.yml: patch does not apply             EXIT=1
$ git apply --stat  rebuild/lanes/b/ntc/pass19-retirement.patch
 .github/workflows/rebuild.yml               |    7 +++++--
 rebuild/m4/spec/native-carriers-package.cjs |    6 +++++-
 2 files changed, 10 insertions(+), 3 deletions(-)
```

**Not applied — and no longer appliable**, because `0876043` rewrote the very region at
`rebuild.yml:76`. The brief §5 states *"a real verified diff at
`rebuild/lanes/b/ntc/pass19-retirement.patch` (`git apply --check` exit 0) … One command
lands it."* That is false at this head. The same is true of the other two carried patches,
both superseded by C4 and by the fixer pass:

```
$ git apply --check rebuild/lanes/b/ntc/gym-host.wiring.patch        → exit 1 (gym-host.mjs:25)
$ git apply --check rebuild/lanes/b/ntc/gym-model.previousLine.patch → exit 1 (gym-model.mjs:139)
```

All three should be deleted or regenerated; as they stand they are three documents that
describe a tree that no longer exists, one of which the brief cites as executable evidence.

---

## H. The reviewer's own bites — 21 mutations, **18 RED / 3 GREEN**

Every mutation was applied to a **disposable copy** of the worktree
(`…/rv-ntc2-scratch/tree`, mirrored with `robocopy /MIR /XJD /XJF`, `node_modules`
re-junctioned, `git rev-parse HEAD` → `71fb2f1`), never to `rv-ntc2`. Each bite restores in a
`finally` and prints a sha256 comparison; **all 21 restored BYTE-IDENTICAL.**

| # | mutation (file) | command | expected | observed |
|---|---|---|---|---|
| M1 | delete the `bindingDigest(bound) !== digest` refusal (`native-trend-context.cjs`) | `--test native-trend-context.test.cjs` | RED | **RED** exit 1 · restore `f300f3f2855f` |
| M2 | `bind(null)` silently unbinds again (r1 F7 regression) | same | RED | **RED** exit 1 |
| M3 | `rushedOf` stops refusing `session_pace_disagreement` (r1 F6) | same | RED | **RED** exit 1 |
| M4 | `createDayFactsReader` downgrades to the empty-history reader | same | RED | **RED** exit 1 |
| M5 | day predicate throw read as `false` (the legacy `catch`) | same | RED | **RED** exit 1 |
| M6 | `sameEffective` drops the own-key-count check | same | RED | **RED** exit 1 |
| M7 | `resolve` answers outside the bind window instead of refusing | same | RED | **RED** exit 1 |
| M8 | `rirPlan` unscoped (r1 F3 regression, narrow check) | `--test ntc-h6-delta.test.mjs` | RED | **GREEN exit 0 — SURVIVED (R11)** |
| M9 | default provider replaced by a throwing resolver (`today-bindings.mjs`) | `--test ntc-h6-delta.test.mjs` | RED | **RED**, `not ok 1 - B-NTC G1` |
| M10 | day reader built on `createEmptyHistoryDayFacts` (the r1-F2 shape) | same | RED | **RED**, `not ok 1 - B-NTC G1` |
| M11 | `EXPOSED` loses `cleanAtDate` (`engine-runtime.cjs`) | `--test engine-equivalence.test.cjs` | RED | **RED** exit 1 |
| M12 | host mirror gains a fifth name (`engine-runtime-host.cjs`) | same | RED | **RED** exit 1 |
| M13 | inert comment on the ORIGINAL `native-carriers-witnesses.cjs` | `node b-ntc-witnesses.cjs` | RED | **RED**, `Unlisted parent pin drift …` |
| M14 | undeclared drift in the child's `engine-runtime.cjs` | same | RED | **RED**, `Exact actual child supersession …` |
| M15 | delete the `witnesses` retarget from `b-ntc-successors.cjs` | same | RED | **RED**, `Exact declared child bytes …` |
| M16 | `rirPlan` unscoped, widened to gym+delta+adapter+journey | `--test` 4 files | RED | **GREEN**, `# tests 109 · # pass 109 · # fail 0` (R11) |
| M17 | delete the `cases` retarget from `b-ntc-successors.cjs` | `node b-ntc-cases.cjs` | RED | **RED**, `Exact declared child bytes …` |
| M18 | forge the spec `post` pin to hide child drift (`B-NTC.json`) | `node b-ntc-witnesses.cjs` | RED | **RED**, `Exact actual child supersession …` |
| M19 | `EXPOSED` drops `cleanAtDate` **+ spec re-pinned in lockstep** | same | RED | **RED** exit 1 (`c03732e8…`→`8183ec89…`) |
| M20 | `MODULES` order scrambled **+ spec re-pinned in lockstep** | same | RED | **GREEN**, `NATIVE CARRIERS WITNESSES: 6/6 …` |
| M21 | the same `MODULES` scramble | `--test journey.test.mjs` | RED | **RED**, `# tests 18 · # pass 16 · # fail 2` |

**The three survivors are the honest result and they are why R11 and R12 exist.** M8/M16 say
the `rirPlan` bind scoping is unproven. M20/M21 together say the successor carriers do not
police the engine composition order — the A0 journey does.

**One incidental but serious observation (R10).** `b-ntc-successors.test.cjs` mutates
`rebuild/m4/workout/engine-runtime.cjs`, `.github/workflows/rebuild.yml` and
`rebuild/m4/workout/native-trend-context.cjs` **in the real checkout**, restoring only in a
`finally`. I first ran it while `b-package --full` was running and got `4 tests / 0 pass /
4 fail` and `13 pass / 1 fail` for `b-ntc-profile-refusals`; run alone both are fully green.
A gate that is order-dependent on the working tree and leaves tracked files corrupted if
killed should not be a CI child in that form.

---

## I. The Astra-side reports read as hypotheses — what I could and could not reproduce

**Reproduced (confirmed):**

* `ASTRA-B-NTC-REPORT.txt` §2: `b-ntc-profile-refusals.test.cjs` **13 pass / 0 fail** and
  `b-ntc-successors.test.cjs` **4 pass / 0 fail** — both confirmed, run serially.
* §2's own negative (inert comment on an original → nonzero, "Unlisted parent pin drift",
  restored byte-identically) — confirmed as my bite **M13**.
* §3: "Nine inherited gate IDs and child names remain the parent's byte-identical map. No new
  gate IDs proposed for `coverage.moves`; it stays `{}`, MOVES_RULING stays null" — confirmed
  against both JSON files.
* §3: "All fifteen declared children and actual Node targets … executed sequentially" —
  confirmed; the runner reports all 15 OBSERVED before it refuses.
* `BUILD-REPORT-B-NTC.md:134-146`: the `B PACKAGE B-NTC FAIL … withheld` line, reported "as
  it happened" — confirmed, in both modes.
* `BUILD-REPORT` §0.4d: `45 RED-frozen · 39 RED-candidate · 0 HARNESS_ERROR` — confirmed.
* Brief §4 (v1.2): the three `gym.test.mjs` subtests re-authored with the count unchanged at
  64 — confirmed. The disclosure that the "second session on the same day" cell had been
  resting on a provider gap, and now asserts `WORKOUT_NOT_READY` instead, is candid and
  correct; I re-read the diff and re-ran the file.

**Not reproduced (contradicted):**

* `TOOLING-FIX-ASTRA-REPORT.md`: *"`node --test rebuild/lanes/b/tooling/test/execution-targets.test.cjs`
  **9 passed / 0 failed / 0 skipped**, exit 0."* → measured **9 tests / 8 pass / 1 fail**,
  exit 1, isolated and repeated: `not ok 4 - inherited pinned original cannot become a
  trailing application argument`, `15 !== 5` at `execution-targets.test.cjs:103`, which pins
  `B-NTC.json.children.length === 5`. That spec declares **14** children at `0876043` and
  `00aa51c` and **15** at `71fb2f1`. The claim was true on the tooling branch before the
  B-NTC children landed; it is false at every commit in this candidate range (**R8**).
* `BUILD-REPORT-B-NTC.md:146-147`: *"not B-NTC-specific: the control package `B1` fails
  identically"* → B1 fails with a **different** assertion (`PARENT-PIN-BROKEN
  rebuild/m4/workout/engine-runtime.cjs`) that B-NTC's own re-pin causes (**R7**).
* Brief §5: *"`git apply --check` exit 0"* for `pass19-retirement.patch` → **exit 1**
  (**R4**).
* `BUILD-REPORT` §0.4a/0.4c and the §0.7d rows: **36/36** provider cells, **123/123** and
  **129/129** today, and delta **G1 "UNCHANGED … blocked"** → measured **39/39**,
  **163/163**, and G1 green as "the wall is GONE" (**R9**). These are earlier-pass sections
  the final pass did not re-measure.

**Could not be run here:** `run-current-head.cjs --all` (R14) and anything browser- or
device-side. I ran no browser check and report none as a pass.

**A note on the layered documents.** Both the brief and the BUILD-REPORT are written as
strata — a v1.2 header that supersedes, over v1.1 text left standing with a reading
instruction ("where v1.1 said 'behind an option', read 'as the behaviour'"). That is honest
about its own method, but it leaves §4.2 stating verbatim *"Adding two names to `EXPOSED`
turns `native-carriers --ci` RED. **Refused.**"* — the exact opposite of what the head does
(**R13**). For a document the ledger accepts *by sha256*, strata are a hazard: the next
reader cannot tell which sentence is operative without reading all 1 459 lines.

---

## The exact changes

**Blocking — the package cannot be sealed until all six are closed.**

1. **Obtain the MOVES_RULING, or withdraw the successors.** The runner refuses at
   `rebuild/lanes/b/tooling/b-package.cjs` `coverage()` with
   `INHERITED-COVERAGE-CHILD-IS-NOT-A-PARENT-PINNED-EXECUTABLE migrate-source source-carriers
   rebuild/m4/spec/b-ntc-source-carriers.cjs`. Ratify the ruling text in §E.3 verbatim (or a
   PM edit of it), record its id in `rebuild/lanes/b/tooling/packages/B-NTC.json`
   `coverage`, and teach the runner to admit a successor executable **only** under that id.
   *Proof:* `node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` terminates
   `CI REVIEW-PENDING: N open obligation(s) … no PASS is claimed` with **exit 2**, and
   `--full --package B-NTC` terminates `B PACKAGE B-NTC BLOCKED
   REQUIRED-PRIVATE-PREPARATION-MISSING` with **exit 2**.
2. **Do not ship a red CI.** `.github/workflows/rebuild.yml:79-80` must not run a command
   that exits non-zero. Either close change 1 first, or revert this step to
   `node rebuild/m4/spec/native-carriers-package.cjs --ci` until the child gate can pass.
   *Proof:* every step of `rebuild.yml` exits 0 on both runners at the sealed head.
3. **Restore or justify the two deleted CI steps, in the brief.**
   `.github/workflows/rebuild.yml`: the `Synthetic Today projection, UI and preview package`
   step (`rebuild/m3/w7-preview/test/{model,view,package}.test.cjs`, 19 tests) and the
   parent-gate step were removed. `:109` authorises retiring the `# pass 19` child "with the
   successor evidence named" — name it as evidence, not as a YAML comment, or keep the step.
   *Proof:* the brief's §4 table lists all three rebuild.yml hunks, and either the 19 tests
   have a CI home or a named successor cell asserts what they asserted.
4. **Retire `# pass 19` from the wrapper, or say it is deferred.**
   `rebuild/m4/spec/native-carriers-package.cjs:65` still declares that child;
   `rebuild/lanes/b/ntc/pass19-retirement.patch` no longer applies (`git apply --check`
   exit 1). Regenerate the patch against `71fb2f1` and apply it, or delete it and record the
   deferral in `DECISIONS`. *Proof:* `git apply --check rebuild/lanes/b/ntc/pass19-retirement.patch`
   exit 0, or the file is gone and the brief §5 no longer claims exit 0.
5. **Correct brief §5's executable claim.** `BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md` §5
   ("`git apply --check` exit 0 … One command lands it") is false at this head.
   *Proof:* the sentence states the measured exit and the reason.
6. **Get a new brief-acceptance ledger line.** `DECISIONS:108(a)` accepted
   `0ba59cca…` (56 010 B); the head carries `89cc1c3a…` (102 038 B) and says "PROPOSED, NOT
   ACCEPTED". *Proof:* `B-NTC.json`'s `brief.acceptedLedgerLine` is non-null and the runner's
   AUTHORITY line stops saying `brief acceptance NULL — the obligation stays open`.

**Required before the seal, not blocking the review (7–10).**

7. **Own the sibling breakage.** `b-package --ci --package` now fails for **B1, B2**
   (`PARENT-PIN-BROKEN rebuild/m4/workout/engine-runtime.cjs`) and **B3, B4, B-LOM**
   (`UNLISTED-SOURCE-CHANGE`, all sixteen `b-ntc-*` files). Correct
   `BUILD-REPORT-B-NTC.md:146-147`, and say in the brief that each sibling spec must re-pin
   `engine-runtime.cjs` and list the `b-ntc-*` sources at its own rebase.
   *Proof:* the BUILD-REPORT quotes both distinct assertions, and `DECISIONS` records the
   re-pin obligation for B1 (the next package in the `:103` order).
8. **Fix the tooling regression.** `rebuild/lanes/b/tooling/test/execution-targets.test.cjs:103`
   asserts `children.length === 5`; the spec declares 15. Update the assertion (or the test's
   fixture), re-run, and correct `TOOLING-FIX-ASTRA-REPORT.md`'s "9 passed / 0 failed".
   *Proof:* `node --test rebuild/lanes/b/tooling/test/execution-targets.test.cjs` → `# pass 9
   · # fail 0`, exit 0 — and it gets a CI home.
9. **Re-measure the BUILD-REPORT's counts at `71fb2f1`.** 36 → **39**; 123/129 → **163**
   (adapter 20 · checkin 28 · design 11 · gym 64 · ntc-h6-delta 7 · package 10 · view 23);
   A0 **23**; delta G1 is green, not "UNCHANGED". *Proof:* each row cites a command run at
   this head.
10. **Make `b-ntc-successors.test.cjs` safe.** It writes `engine-runtime.cjs`,
    `rebuild.yml` and `native-trend-context.cjs` in the live checkout. Copy the tree, or
    assert `git status --porcelain` is clean before and after and register a process-exit
    restore. *Proof:* killing the test mid-run leaves `git status --porcelain` empty.

**Recommended (11–13).**

11. **Cover the `rirPlan` bind window** with a cell, or drop the scoping from the hunk.
    *Proof:* a cell that goes red when `rirPlan` is unscoped (today M8/M16 do not).
12. **Enumerate the two original-assertion retargets** in `B-NTC.json` itself, as a declared
    list the runner asserts against `b-ntc-successors.cjs`'s actual replacement strings, so a
    future weakening cannot pass on a regenerated pin alone.
    *Proof:* a cell that goes red when a retarget is changed *and* the spec re-pinned.
13. **Collapse the brief's strata or annotate §4.2.** A document accepted by sha256 should
    not contain a live sentence saying the head's central change is "Refused".

---

## What the PM must rule

1. **The MOVES_RULING (or its refusal).** §E.3 gives the text I would ratify. Until it
   exists, B-NTC's own runner refuses B-NTC and there is nothing to seal. This is the single
   decision the package now hangs on.
2. **`.github` custody**, which `REQUESTS 09:05 (2)` asked for and which has not been
   answered. And specifically: may B-NTC's seal **remove** the
   `native-carriers-package.cjs --ci` step and the 19 memory-only preview tests from CI, or
   is `:109`'s authority limited to the enumeration plus the named `# pass 19` retirement?
   My reading is the latter.
3. **The pass-19 retirement**, which `REQUESTS 09:05` left as "your call whether it rides
   B-NTC's seal or the PM's wrapper". Whichever it is, the patch file must be regenerated or
   deleted — as shipped it does not apply.
4. **A new brief-acceptance line** at `89cc1c3a…`, since `:108(a)` accepted a different
   document.
5. **The H6 custody stretch**: `:108(b)` licensed one hunk in `gym-host.mjs`; the wiring
   landed as ~25 lines in lane C's `today-bindings.mjs` (`:111` custody). Confirm, or route
   it to lane C.
6. **The sibling re-pin obligation** (change 7) — who re-pins B1–B4/B-LOM, and when, given
   `:103`(1) puts B1 next.
7. **Whether an opaque terminal is acceptable at all.** Both package gates print
   `FAIL; required evidence missing or failed; local diagnostics withheld` and nothing else.
   I had to instrument the process to learn why either refused. For a public CI step that is
   defensible; for the seal runner on the owner's own PC it means a lane can spend a pass
   guessing. A `--explain` mode that prints the assertion message locally (never the private
   census) would have saved this review an hour and the lane a commit.

---

## Residual risks

1. **The provider is right and the package still cannot ship.** The engineering risk here is
   inverted from r1's: the code is the strongest part and the paperwork is the blocker. The
   temptation will be to seal on the strength of §§B–D. Do not: the runner refuses, and a
   seal recorded over a refusing runner is exactly the failure mode X1/Y1/W5 exist to prevent.
2. **The child re-pin is a one-way door for the lane.** Every sibling package is now red
   (§F.5). If B-NTC is not sealed soon, lane B has no runnable package at all.
3. **The successor retargets are trusted, not proven** (R12). Two exact strings decide which
   parent assertions survive, in a file pinned by the spec it validates.
4. **Nineteen memory-only preview tests now run nowhere** (R3), on an asserted rather than
   demonstrated succession.
5. **`rirPlan`'s scoping is unproven** (R11), inside a one-hunk licence.
6. **Fail-closed holds at the predicate boundary, not the semantic one** (§C.2): a
   syntactically corrupt night is *answered* by the engine's own predicate rather than
   refused. Correct under PATH A, but the PM should know the guarantee's exact shape.
7. **Every qualified answer this tree produces for the two athletes I drove was
   `{hard:false, rushed:false, debt:false}`** — 28 well-formed 8-hour nights and no events
   produce no debt and no hard day. The engine's `hard`/`debt` branches for native rows
   therefore still have no *varying* real path through the product. That is r1's residual 3,
   and it survives.
8. **No browser, no device, and `run-current-head --all` unrunnable here** (R14).
9. **`b-ntc-successors.test.cjs` can corrupt the checkout if killed** (R10), and produces
   false REDs under concurrency — which will mislead a future reviewer as it briefly misled
   this one.

---

## Boundaries honoured

`ledger/` was never opened. `rebuild/conform/private` **does not exist on this tree** and was
never sought, created or referred to beyond noting its absence; no private value, count, hash
or golden appears in this file. No frozen law, oracle, witness, golden or tool was edited —
`git diff 7b1678a 71fb2f1 -- rebuild/engine rebuild/conform` is empty and I added nothing.

**No tracked file in `rv-ntc2` was modified.** Every one of the 21 mutations ran in a
disposable mirror at `…/work/lane-b/rv-ntc2-scratch/tree`, and each restored byte-identically
with the sha256 printed. The two probes, the bite harnesses and the assert tracer live
entirely outside the repository, in `…/rv-ntc2-scratch/`. The `test-support/` and
`.tmp/` directories the gates create transiently were removed after the runs. No worktree was
created, moved or removed; no branch was pushed, merged or committed to; no other worktree was
touched. Final state of the tree under review:

```
$ git status --porcelain      → (empty, before this file was written)
$ git diff --stat HEAD        → (empty)   exit 0
```

**This review adds exactly one file: itself.** It is not committed.

---

## Provenance

Five of the commits in the range `68fbca4..71fb2f1` — **`9eb46bd`** (the C4 integration
merge), **`4e992b9`** (the lane-B tooling files copied in at `7748880`), **`0876043`**
("join C4 default provider and prepare exact-pin gate successors"), **`00aa51c`** (the
executed-child-targets tooling fix) and **`71fb2f1`** ("execute original thirteen
archived-parent profile controls") — were authored by a GPT "Astra" continuation that was
operating **without a legitimate judge**. Its self-reviews —
`ASTRA-B-NTC-JOIN-REVIEW`, `rebuild/lanes/b/ASTRA-B-NTC-REPORT.txt` and
`rebuild/lanes/b/tooling/TOOLING-FIX-ASTRA-REPORT.md` — carry no reviewer authority, and I
treated every sentence in them as a hypothesis to be re-measured rather than as evidence.
Lane B adopted these commits as speculative builder work only, and this review is the first
independent pass over them.

That treatment changed the outcome. Two Astra claims survived re-measurement in full (the
13/4 profile-refusal and successor counts, and the nine-pair inherited map being the parent's
own bytes), and the builder reports deserve credit for disclosing the `B PACKAGE B-NTC FAIL`
terminal rather than hiding it. But three claims did not survive: the tooling suite's
"9 passed / 0 failed" (**8/9** here), the brief's "`git apply --check` exit 0" for the
pass-19 patch (**exit 1** here), and the BUILD-REPORT's "not B-NTC-specific: `B1` fails
identically" (**a different assertion, caused by B-NTC** here). None of the three could have
been caught by reading; each needed the command run. The commits that most needed an
independent judge are precisely the ones that were written without one, and the findings this
review blocks on — R1, R2, R3, R4 and R8 — all originate inside that group.

The earlier commits in the range (`a701ac5 → d78aff4 → a1d8252`, the lane's own r1-fix
passes) are a different matter and I want the record to say so: the provider, the digest, the
two closed r1 findings, the PATH A day reader, the H6 wiring and the seven delta cells are
careful, honestly documented work that does what `DECISIONS:109` asked. They are not why this
is a REJECT.

---

**Reviewer:** lane-b-reviewer (independent, blind) · **r2** · verdict **REJECT**
(blocking changes 1–6; required-before-seal 7–10; recommended 11–13). The provider and its
evidence should be re-offered unchanged once the PM rulings in §"What the PM must rule" land.
