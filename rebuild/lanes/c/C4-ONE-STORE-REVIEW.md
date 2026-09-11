# C4 — ONE STORE: independent review

**Reviewer** independent (did not write the candidate) · **candidate** `d9891f0` ·
**base** `43470fe` · worktree `work/lane-c/review-today`, clean throughout
(`git status --porcelain` empty at the end; nothing committed, nothing installed).

## VERDICT — **ACCEPT WITH CONDITIONS**

The crux holds, the store is one store, and I could not produce a lost update in
175 concurrent write pairs or a two-factory race. **The patch works**: I applied
§5 verbatim to a disposable copy and A1/A2's own suite still passes 123/123, and
the patched `boot()` drives the real page over the local era end to end.

Three conditions, each executable:

**C1 — land evidence for the `boot()` hunk.** §5 has two hunks. Only the
`createWorkoutEntry` hunk is executed anywhere in the branch (block 8 of
`test/local-today-journey.test.mjs`). The `boot()` hunk is the larger and the
riskier one — it suppresses `openDeviceKeys` (`if (!hosts && !device && idb && web)`),
rewrites `lane`, and drops `lane` from the reading-host call
(`...(hosts ? {} : lane)`) — and **no test in this branch executes a single line of
it.** I executed it and it passes (see THE PATCH TRIAL), but the branch does not
carry that evidence. Either add a block-9 case that imports a patched copy of
`today-entry.mjs` and asserts `boot({ hosts: era })` yields
`failures.length === 0`, `era.ignored()` empty, and one generation; or hand the PM
the trial script so the evidence lands with the swap. As it stands §5's central
promise — "a page that passes no `hosts` gets exactly what it gets today" — is
asserted, not tested.

**C2 — complete the source pin.** §2 and block 7 claim `causalTips` /
`startOrderRefusalOf` are "pinned **by source**". `String(fn) === String(fn)`
covers only those two function bodies. Both call module-local helpers —
`graphOps` and `reachedFrom` — that **no assertion compares**
(`today-bindings.mjs:99-101,110-121` vs `gym-host.mjs:170-171,186-197`). They are
byte-identical today, so the gap is latent, not live; but a future edit to
`gym-host.mjs`'s `graphOps` would leave the pin green while the drop-in silently
diverged — which is the exact failure the pin exists to prevent. Fix: pin the two
helpers' source text as well (extract by regex from both files, as
`pin-gap.mjs` does), or export them from `gym-host.mjs` and pin them like the
other two.

**C3 — correct two sentences in the report.** §5 says the block-8 copy is
"verbatim ... with these three lines changed". It is not byte-equal to the patch
(single quotes vs double, `GymHost.createGymHost` vs `createGymHost`, the patch's
own comments dropped) and the patch changes four lines in `createWorkoutEntry`,
not three, plus five in `boot()`. Say instead: "a copy of `createWorkoutEntry`
with that hunk applied; the `boot()` hunk is not executed here." Separately, §2's
"returns **every member** `reading-host.mjs` returns" should read "every member
**name**" — `device` is deliberately `null` (residual 4), and the shape pin is
`typeof` only, so `typeof null === 'object'` lets a nulled member through.

None of these is a correctness defect in the drop-in. I found none.

## WHAT I EXECUTED

All on the owner's PC, node v24.19.0, Edge 152.0.4191.66. Probes under `$env:TEMP`.

| check | result |
|---|---|
| `git diff --stat 43470fe HEAD` | 7 files: `local/today-bindings.mjs` (+345), `local/today-browser-entry.mjs` (+21), `local/build.mjs` (+9, additive), 3 tests, the report. `git diff` scoped to `w7-preview/`, `w6/host/`, `client/`, `engine/`, `m4/`, `conform/`, `.github/` is **empty** |
| W6 suite `node --test test/*.test.mjs` | **530 / 530**, 0 fail, exit 0 |
| `local-today-journey.test.mjs` alone | **35 / 35**, exit 0 (495 + 35 = 530 confirmed) |
| today suite `w7-preview/today/test/*` | **123 / 123**, exit 0, files untouched |
| host suite `w6/host/test/*` | **22 / 22**, exit 0 |
| C1 bite `test/local-bite.cjs` | 4/4 DETECTED, `LOCAL BITE RESTORED PASS — 3bf8c01d7e2b28fd…`, exit 0 |
| bundle bytes | `local.js` **f4a85fcf62e0c1bb** (38 inputs), `host.js` **0380052e57a3226e** (97) — identical whether built through the edited `build.mjs` or by calling `buildBrowser` with the same entry points; `today.js` 16f8a6387e7cfa42 (103 inputs) |
| `test/local-today-browser.mjs` (real Edge) | **5/5**, killed 8 `msedge.exe` with `taskkill /F /T`, exit 0 |
| `test/local-host-browser.mjs` (C1b, real Edge) | **6/6**, exit 0 |
| `test/local-schema-probe.mjs` standalone | exit 0, reproduced line for line |

Every claimed number in §3 reproduced. The §6 counts (324 / 20 / 637 / 181 / 55)
are non-blank line counts and are exact under that definition.

### The crux, reproduced independently

Confirmed by execution against `local-era.mjs LOCAL_ERA_SCHEMA_VERSION = 2`:

* public client at `schemaVersion: 2` → `weighIn` **refused**
  `OPERATION_SCHEMA_MISMATCH` / 20, nothing stored (`public-client.mjs:259-265`,
  read and confirmed: the candidate is compared against `lease.schema_version`
  **after** staging, before any durable write);
* public client at `schemaVersion: 1` → cannot even `reopen()`:
  `LEASE_PROOF_UNPROVEN` / 18 (`public-client.mjs:237`);
* C1's bridge → **acknowledged**, one op, `class: "reading"`,
  `schema_version: 1`, under the schema-2 `lease_id`.

The asymmetry is real and I read it in the source, not just the output:
`ops.cjs:17` `SCHEMA_VERSION = 1` and `ops.cjs:59`'s
`spec.schema_version == null ? SCHEMA_VERSION : …`; `index.cjs:226`
`schema_version: workout ? 2 : undefined`; and `index.cjs:206`
`if (workout && cfg.lease.schema_version !== 2)` — the gate names `workout`, so a
reading is never gated on the lease schema. The report's reading of all four
lines is accurate.

**So the two-write-path design is honest.** Two clients are forced, one store is
not. Both paths reach `repository.commit`, whose CAS is `repository.mjs:239`
(`STALE_REVISION`, retryable) and `:240` (`HEAD_CHANGED_WITHOUT_REVISION`),
checked **inside** the IndexedDB transaction; `bridge.mjs:4,15,51` retries a
retryable failure up to `maxAttempts = 4`. That is a real serialisation point,
not a convention.

## THE PATCH TRIAL — the swap works as a file replacement

Method: `robocopy` of the whole `rebuild/` tree to `$env:TEMP/c4rev/wt` (28 MB,
858 files), `node_modules` junctioned in, then §5's unified diff applied by
script to the copy's `today-entry.mjs`. **All six anchors matched exactly once**
(the script aborts on a non-unique anchor) — so the patch applies cleanly as
written, with no hand-fitting. 121 → 133 lines.

| trial | result |
|---|---|
| A1/A2 suite **with the patch applied** | **123 / 123**, exit 0 |
| patched `boot({ hosts: era })` | opened with `failures: []`; returned `readings` + `workout` + `api` |
| `era.ignored()` after boot | `[]` — the page minted no device keys and passed none down |
| which hosts were built | both handles report `deviceKeyCustody: "local-keys.mjs"` — the drop-in, not `reading-host.mjs` / `gym-host.mjs` |
| the whole product journey | "Log the scale" → weigh-in (Saved on this phone) → "Start UPPER BODY · TODAY" → card opens and auto-starts → 4 sets → finish → "Review today's workout" |
| the store afterwards | **7 ops in ONE generation** (`["reading","session"]`), one `lease_id`, `checkpoint.counts.ops === 7`, `schema_version` set `= [1,2]` |
| synthetic strings in sealed metadata | none of `IDENTITY_KEY`, `ENROLMENT_EVIDENCE`, `AUTHORITY_KID`, `synthetic-preview` |
| `localStorage` | `0` keys after the whole journey |
| **default preserved** — `boot()` with no `hosts` | `failures: []`, weigh-in still durable, and it still opens its **two** generations (`earned-today-preview-readings`, `earned-today-preview-workout`, plus `-device-keys`) |

So the patch is default-preserving in fact, not only by inspection. This is the
evidence condition C1 asks the branch to carry; it is not in the branch today.

## RACE RESULTS — no lost update

I did not trust §6's single interleaving. My own harness, over the drop-in and
the page's real `gym-model`:

| probe | firings | result |
|---|---|---|
| weigh-in ‖ Start / ‖ set, one installation, 32 page loads | **40 concurrent pairs** | every acknowledged `op_id` on disk; checkpoint `ops`/`outbox` = actual at **every** step; `meta.device.seq` = op count; no duplicate `device_seq`; one `lease_id` |
| two **independent** `openTodayOverLocalEra` factories, one IndexedDB, racing weigh-ins | **60 pairs** | A 60 ok, B 60 ok, **zero refusals**, 120 ops, all present after reopen |
| same, harder, with explicit contiguity | **75 pairs** | 150 ops, `device_seq` **contiguous 1..150**, **0 `op_id` collisions**, checkpoint `{ops:150,outbox:150}`, `meta.device.seq` 150, one lease |
| reopen through a new factory after part 1 | — | 52 ops, all 52 acknowledged ids present, `boot()` op count = actual |

**175 concurrent pairs. Zero lost updates, zero broken invariants, zero
duplicate sequences.** The `op_id` is `"op-" + deviceId + "-" + seq`, so two
writers allocating the same sequence would silently overwrite one another via
`t.put("ops", op.op_id, op)`. It never happened, because the losing writer's
commit is refused on revision and the retry re-derives the sequence from the
reloaded generation. That is the specific mechanism I set out to break.

Refusal codes observed, all by name and all writing nothing:
`START:WORKOUT_PREPARATION_STALE` ×2, `SET:WORKOUT_RESUME_STALE` ×8. **F1 and F2
reproduced independently.** Each was followed by a re-read and a retry that
landed, and the set count after refusal-plus-retry was always exactly +1.

A control run of the same 32-day loop with **no** concurrency produced
`WORKOUT_HISTORY_RECONCILIATION_REQUIRED` ×31 — proving the other engine codes my
first harness threw (`ENGINE_CAPTURE_NO_WORKOUT`,
`PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED`) were my fixture reusing one stale
`engineState` across 32 days, not the drop-in. I am naming this because a
reviewer's own harness bugs are otherwise indistinguishable from findings.

## WHERE I DISAGREE

**Two hypotheses I formed against the report and could not sustain.** Both are
recorded because a reviewer who only prints the hits is not showing his work.

1. **`engine-order.cjs` and the cross-lane parent.** F1 puts a *reading* on the
   causal frontier, so a `session-start`'s `causal_parents` now names a reading —
   a shape that could not exist in A2's two stores. `engine-order.cjs:74` is
   `else stack.push(...ops[parent].causal_parents)` with **no guard**, so I
   expected a pruned reading to produce an unnamed `TypeError` instead of a
   refusal. **It does not.** Executed both ways: with the reading present the
   resolver returns `{profile:"earned/workout-order/v1",frontier:0,start_ids:[…]}`;
   with the reading pruned it fails by name, `WORKOUT_ORDER_CAUSAL_INPUT_UNPROVEN`
   — because the colour-walk at `:59-65` validates every reachable node *before*
   the dependency walk at `:70-76` can dereference one. The report's F1 is safe,
   for a reason it does not state. Worth stating.

2. **`workout.recover()` is not covered by the "paint() re-prepares" argument.**
   §4 defends the product path by `gym-app.mjs:289-298` — `paint()` calls
   `model.read()` (re-preparing) and then `model.start()`. That argument does not
   reach `today-app.cjs:235` → `workout.recover()` → `gym.closeUnfinished(summary.unfinished)`,
   which acts on a `summary` taken at the last `refresh()`. I drove exactly the
   sequence the report's second hunk is about: abandon day 1, boot day 2, **weigh
   in**, then tap recover **without** an intervening `refresh()`. It **succeeds** —
   one reading and exactly one `session-close` written — because `closeUnfinished`
   builds a fresh transient host through `hostForDay`, with a fresh preparation.
   No staleness on that path either.

**Where the report genuinely overclaims** is narrow and is C1–C3 above: "verbatim
... three lines", "pinned by source" (helpers uncovered), "every member", and the
unexecuted `boot()` hunk. I also think §4's "§6 is the executed proof" of no lost
update is thin on one interleaving; it is true, but it is earned by my 175 pairs,
not by theirs.

**Where I agree against my own prior.** I went looking for the named failure mode
— a proof that passes without running the PM's code. It is not here. The journey
imports `today-model.cjs`, `gym-model.mjs`, `gym-app.mjs`, `today-app.cjs`,
`design.cjs`, `gym-host.mjs` and `reading-host.mjs` unmodified; a grep for
`stub|mock|shim|fake` (excluding `fake-indexeddb`) and for local redefinitions of
`createGymModel` / `mountGym` / `createGymHost` / `createTodayModel` returns
**nothing**. The one re-statement in the file — `patchedCreateWorkoutEntry` — is
declared as such in its own header. The host is the accepted `composeWorkoutHost`
over `client.hostBindings()`, not a re-implementation.

## DEFECTS

**No correctness defect found in `today-bindings.mjs`, the tests, or the patch.**
The three below are evidence-coverage and wording, and are the ACCEPT conditions.

**D1 — the `boot()` hunk of §5 is executed nowhere in the branch.**
*Repro:* `Select-String -Path rebuild/m3/w6/test/*.mjs -Pattern 'boot\('` finds
only `client.boot()` / `era.installation`; block 8 copies `createWorkoutEntry`
only. *Impact:* the claim "a page that passes no `hosts` gets exactly what it
gets today" rests on inspection. *Status:* I executed it — both branches pass
(THE PATCH TRIAL). *Fix:* C1.

**D2 — the source pin cannot see a changed helper.**
*Repro:* executed. `String(causalTips) === String(GymHost.causalTips)` is `true`;
`graphOps` and `reachedFrom` extracted from both files are byte-identical **and
nothing asserts it**. Demonstration that the pin is blind to it: two functions
built from identical source text over different closed-over helpers satisfy
`String(fA) === String(fB)` while `fA(0) === 1` and `fB(0) === 2`. *Fix:* C2.

**D3 — three sentences overstate.** "verbatim ... these three lines" (it is four,
in one of two hunks, and not byte-equal); "returns every member" (`device` is
`null`, and the shape pin is `typeof`, so `typeof null === 'object'` passes).
*Fix:* C3.

## RESIDUALS CONFIRMED

All seven of §7 reproduced as stated. Additionally verified by execution:

* **Partial erasure is restore-required, on all three signals.** Erasing the
  enrollment marker → `ENROLLMENT_MARKER_MISSING`/18; the device key →
  `KEY_MISSING`/18; the whole generation → `STORE_MISSING`/18. Every one throws
  and writes nothing; `enroll: false` changes nothing. The contrast in the
  candidate's block 5 is real — `reading-host.mjs` re-enrols over the same
  erasure with `openedRefusal === null` and an empty history.
* **Nothing synthetic reaches the disk, and neither does the athlete.** Dumping
  **every raw IndexedDB record** across all three databases: the generation rows
  are `{format, namespace, revision, iv:<bytes:12>, ciphertext:<ab:8064>}`, the
  key row serialises to `{}` (non-extractable `CryptoKey`), the marker row is
  `{at}`. No `IDENTITY_KEY`, no `ENROLMENT_EVIDENCE`, no `AUTHORITY_KID`, no
  `synthetic-preview`; and no `179.4`, no `session-start`, no `"lb"` in plaintext.
  Only `namespace` is legible, which is not identity material.
* **`localStorage` is empty** after the full journey, in jsdom and in real Edge.
* **Residual 4 is understated, slightly.** `device: null` passes the block-7
  shape pin only because `typeof null === 'object'`. Nothing in `today/**` reads
  `.device` (grepped), so the residual is correct; the pin just cannot enforce it.
* **Residual 6 stands.** I did not run `rebuild.yml --ci`, the native-carriers
  package gate, `run-current-head` or the A5 suites either.
* **No iOS.** Chromium-family only, and both browser runners say so in their own
  output. C3's job, unchanged.
* Synthetic data only throughout. `ledger/` and `rebuild/conform/private` were
  not read, by me or by anything I ran.

## FILES REVIEWED (sha256, first 16)

| sha256 | file |
|---|---|
| `ee1974bba0fbc2df` | `rebuild/lanes/c/C4-ONE-STORE-REPORT.md` |
| `9064e2953744212d` | `rebuild/m3/w6/local/today-bindings.mjs` |
| `633391e2b778e0b5` | `rebuild/m3/w6/local/today-browser-entry.mjs` |
| `c1650fc0bc0494a0` | `rebuild/m3/w6/local/build.mjs` |
| `feae62fc07361061` | `rebuild/m3/w6/test/local-today-journey.test.mjs` |
| `0cdccdb0e8ab30df` | `rebuild/m3/w6/test/local-today-browser.mjs` |
| `4d8032b1d63ce067` | `rebuild/m3/w6/test/local-schema-probe.mjs` |
| `fa313c14ef1a962a` | `rebuild/m3/w7-preview/today/today-entry.mjs` (unchanged) |
| `9b018f11ad889035` | `rebuild/m3/w7-preview/today/gym-host.mjs` (unchanged) |
| `c28273b8c5b41006` | `rebuild/m3/w7-preview/today/reading-host.mjs` (unchanged) |
| `230370a0c6465892` | `rebuild/m3/w6/public-client.mjs` (unchanged) |
| `f5e272c048191e6f` | `rebuild/client/index.cjs` (unchanged) |
| `4f0e2931d9d0d139` | `rebuild/client/ops.cjs` (unchanged) |

Also read, unchanged: `w6/local/local-client.mjs`, `local-era.mjs`,
`host-bindings.mjs`, `w6/repository.mjs`, `w6/bridge.mjs`, `w6/host/workout-host.mjs`,
`w7-preview/today/{gym-app.mjs, today-app.cjs}`, `m4/workout/engine-order.cjs`.

Review probes (disposable, under `$env:TEMP/c4rev/`, none in the repo):
`bytes.mjs`, `race.mjs`, `race-run.mjs`, `control.mjs`, `apply-patch.mjs`,
`boot-trial.mjs`, `raw-probe.mjs`, `pin-gap.mjs`, `order-probe.mjs`,
`recover-probe.mjs`, and the patched tree at `$env:TEMP/c4rev/wt/`.

---

# ROUND 2 — re-review at `6e1133a`

Builder closed D1–D3. I re-verified by execution and then attacked each fix by
mutation. Worktree `work/lane-c/review-today` at `6e1133a`; the only untracked
file at the end is this one.

## Scope — the fix is tests and prose, nothing else

`git diff --stat d9891f0 6e1133a` is **two files**: the report (+161/−43) and
`test/local-today-journey.test.mjs` (+329/−43). Confirmed by sha that the
product surface did not move a byte between rounds:

| file | sha256 (16) | round 1 | round 2 |
|---|---|---|---|
| `local/today-bindings.mjs` | `9064e2953744212d` | ✓ | **identical** |
| `local/build.mjs` | `c1650fc0bc0494a0` | ✓ | **identical** |
| `local/today-browser-entry.mjs` | `633391e2b778e0b5` | ✓ | **identical** |
| `test/local-today-browser.mjs` | `0cdccdb0e8ab30df` | ✓ | **identical** |
| `test/local-schema-probe.mjs` | `4d8032b1d63ce067` | ✓ | **identical** |
| `test/local-today-journey.test.mjs` | `feae62fc07361061` → `8de6c8ddea344c3d` | | changed |
| `C4-ONE-STORE-REPORT.md` | `ee1974bba0fbc2df` → `ec8dcea65f920bd1` | | changed |

`git diff --stat 43470fe HEAD` scoped to `w7-preview/`, `w6/host/`, `client/`,
`engine/`, `m4/`, `conform/`, `.github/` is still **empty**. Because the drop-in
is byte-identical, every round-1 product finding carries forward unchanged — I
did not have to take that on trust, and I re-ran the race work anyway (below).

## Re-verified by execution

| check | claimed | measured |
|---|---|---|
| W6 suite | 538/538 | **538 / 538**, 0 fail, exit 0 |
| journey alone | 43/43 | **43 / 43**, exit 0 (495 + 43 = 538) |
| today suite | 123/123 | **123 / 123**, exit 0 |
| `local-today-browser.mjs`, real Edge | 5/5 | **5 / 5**, 9 `msedge.exe` killed with `taskkill /F /T`, exit 0 |
| C1 bite | 4 detected + restore | 4/4 DETECTED, `LOCAL BITE RESTORED PASS — 3bf8c01d7e2b28fd…`, exit 0 |
| tree untouched after block 9 ran | — | `git status --porcelain` shows only this file; `today-entry.mjs` still `fa313c14…a92e9c98`, **exactly the PAGE_PINS value** |

Block 9 writes its copy to `os.tmpdir()` and `rmSync`s it; I confirmed the real
`today-entry.mjs` is byte-identical before and after the suite runs, which is the
property that matters — the branch must not edit a PM-owned file to test it.

Re-ran my own round-1 probes against `6e1133a`: **175 concurrent write pairs**
again (40 reading‖workout over one installation; 60 + 75 racing two independent
factories on one IndexedDB). Identical results — 52/52 and 120/120 acknowledged
ops present after reopen, 150 ops with `device_seq` **contiguous 1..150**, **0
`op_id` collisions**, checkpoint `{ops:150,outbox:150}`, one lease. Refusals by
name only (`WORKOUT_PREPARATION_STALE` ×2, `WORKOUT_RESUME_STALE` ×8), each
writing nothing and each retry landing. **No lost update.** The 30 engine codes
my harness throws are still my own fixture (one stale `engineState` reused across
32 days); the no-concurrency control reproduces 31 of them.

## THE PATCH TRIAL — round 2 attacks the fix, not just the claim

Block 9 does what D1 asked and more: it carries `REQUEST_TO_PM_PATCH` as six
`{old,new}` hunks, asserts each matches **exactly once**, applies them to a copy
in `os.tmpdir()`, rewrites only the six relative import specifiers (and asserts
that rewrite is **exactly invertible**), imports the result, and runs it both
ways. I re-checked its two central facts independently:

* the six anchors match `[1,1,1,1,1,1]` against the real file — my own run, not
  the test's;
* the report's §5 unified diff and `REQUEST_TO_PM_PATCH` agree **in both
  directions**: 19 added lines and 7 removed lines on each side, with **zero**
  lines present in one and absent in the other. The PM would apply exactly what
  block 9 executes.

The `no hosts` default assertions are now genuinely strong: the patched `boot()`
with no `hosts` is asserted to mint its own device keys again
(`readings.device !== null`, `deviceKeyCustody === undefined`), to open all three
page databases, and — the part that actually proves two stores — to put the
reading in one generation at `lease.schema_version 1` and the `session-start` in
the other at `2`. The `hosts` path asserts both handles hold the **same
`repository` object** and that the page's own two databases are never created.

### Bite harness — eight mutations, eight detections

Every fix mutated in a disposable copy of the whole tree; journey must go red and
**name the right thing**. Restored byte-for-byte after each; journey green (43/43)
at the end.

| mutation | result |
|---|---|
| B1 one byte in `today-entry.mjs` | **DETECTED** — `rebuild/m3/w7-preview/today/today-entry.mjs has changed since C4 was written`, with expected and actual sha256 |
| B2 one byte in `gym-host.mjs` | **DETECTED** — names `gym-host.mjs` |
| B3 `graphOps` drifts in `today-bindings.mjs` (quote style — behaviour-neutral) | **DETECTED** — `today-bindings.mjs graphOps has diverged from gym-host.mjs` |
| B4 `reachedFrom` drifts (`,` → `;`, behaviour-neutral) | **DETECTED** — names `reachedFrom` |
| B5 drop-in nulls `lease` (a member that is not `device`) | **DETECTED** — `reading-host.lease is null where the page returns a value, and is not a declared exception` |
| B6 an anchor stops matching exactly once | **DETECTED** — `anchor did not match exactly once (0): if (!device && idb && web) {` |
| B7 report's diff drifts from the executed patch | **DETECTED** — `report is missing added line: …` |
| B8 default path stops minting keys | **DETECTED** — including `THE DEFAULT IS PRESERVED` and `patched boot({ hosts: era })` |

B3 and B4 are the exact latent drift D2 named, and they now bite on a one-character
behaviour-neutral change — which is the only kind that the old `String(fn)` pin
could never see.

**The helper extraction is not vacuous.** A pin that compared `'' === ''` would
pass every mutation too, so I ran `helperSource` myself against both files:
`graphOps` extracts **169 chars** (first line `const graphOps = generation => …`,
last line `.filter(op => … Array.isArray(op.causal_parents));`) and `reachedFrom`
**404 chars** (`function reachedFrom(generation, parents) {` … `}`), identical
across the two files. Real text, correctly bounded, on both sides.

## WHERE I DISAGREE — round 2

**One finding, latent, non-blocking.** The claim "the report's unified diff is
this same patch, **line for line**" is asserted **one-directionally**. The test
walks `REQUEST_TO_PM_PATCH` and requires every added line to appear in the report
as `+line` and every removed line as `-line`. It never walks the report. So the
report's diff may contain lines the executed patch does not — and the PM applies
the **report's** diff, which is the direction that matters.

*Reproduced:* injecting one extra added line into the report's fenced diff —
`+  if (hosts) delete options.deviceKeys;   /* NEVER EXECUTED BY ANY TEST */`,
placed inside the hunk, a line the PM would apply and nothing here would run —
leaves the journey **GREEN (43/43)**. An extra `-` line likewise. B7 bites only
because I mutated a line the patch *does* contain.

*Why this is not a condition:* I compared the two in both directions myself and
they agree exactly today (19/19 added, 7/7 removed, zero either way), and block 9
executes the patch it carries, so nothing unexecuted can reach the PM at this
commit. *Suggested hardening, one assertion:* extract the `+`/`-` lines from the
report's ```` ```diff ```` block and assert set equality against
`REQUEST_TO_PM_PATCH`, not containment.

**One wording point, not a defect.** The block-7 comment calls PAGE_PINS "the
sha256 of each whole `today/**` file this branch depends on". The branch imports
**seven** — `design.cjs`, `gym-app.mjs`, `gym-host.mjs`, `gym-model.mjs`,
`reading-host.mjs`, `today-app.cjs`, `today-model.cjs` — and pins **three**. The
three are the right minimal set and I am not asking for more: `gym-host.mjs` and
`reading-host.mjs` are the files the drop-in *replaces*, so their drift is
invisible to behaviour, and `today-entry.mjs` is the patch target. The other five
are *driven* by the journey, so drift there turns the suite red on its own.
Say "the three files whose drift this suite could not otherwise see", and the
sentence becomes true.

**What I could not break.** I went after the fixes rather than the claims: the
sha pins bite on one byte and name the file and both hashes; the helper pin bites
on a behaviour-neutral character and names the helper; `NULLED` rejects any nulled
member except the declared `device` and additionally asserts the page really does
return a key record there; the anchors bite at zero matches; the tree is provably
unedited after the suite runs; and the default path is now proved by two
generations at two schema versions rather than by inspection. D1, D2 and D3 are
closed as specified.

## DEFECTS

**None blocking.** One latent test-strength gap (the one-directional diff
comparison, reproduced above, with a one-assertion fix) and one inaccurate comment
(PAGE_PINS coverage). Neither touches product code, neither is reachable at this
commit, and both are hardening rather than correction. No correctness defect was
found in `today-bindings.mjs`, in the tests, or in the patch, in either round.

## FILES REVIEWED — round 2 (sha256, first 16)

| sha256 | file |
|---|---|
| `ec8dcea65f920bd1` | `rebuild/lanes/c/C4-ONE-STORE-REPORT.md` (changed) |
| `8de6c8ddea344c3d` | `rebuild/m3/w6/test/local-today-journey.test.mjs` (changed) |
| `9064e2953744212d` | `rebuild/m3/w6/local/today-bindings.mjs` (unchanged from round 1) |
| `c1650fc0bc0494a0` | `rebuild/m3/w6/local/build.mjs` (unchanged) |
| `633391e2b778e0b5` | `rebuild/m3/w6/local/today-browser-entry.mjs` (unchanged) |
| `0cdccdb0e8ab30df` | `rebuild/m3/w6/test/local-today-browser.mjs` (unchanged) |
| `4d8032b1d63ce067` | `rebuild/m3/w6/test/local-schema-probe.mjs` (unchanged) |
| `fa313c14ef1a962a` | `rebuild/m3/w7-preview/today/today-entry.mjs` (unchanged; = PAGE_PINS) |
| `9b018f11ad889035` | `rebuild/m3/w7-preview/today/gym-host.mjs` (unchanged; = PAGE_PINS) |
| `c28273b8c5b41006` | `rebuild/m3/w7-preview/today/reading-host.mjs` (unchanged; = PAGE_PINS) |

Round-2 probes (disposable, under `$env:TEMP/c4rev/`, none in the repo):
`bite2.mjs`, `bite2b.mjs`, `bite2c.mjs`, `diffcmp.mjs`, and the mutated tree copy
at `$env:TEMP/c4rev/wt2/`, restored and verified green before teardown.

**FINAL VERDICT: ACCEPT at 6e1133a**
