# P2 REVIEW - independent, blind

FINAL VERDICT: ACCEPT at `d5c140c7c6d13304fbf9e2eae2d069f251a1800b`

Brief: `rebuild/slice/P2-HOST-REQUESTS-BRIEF.md`. Authority: `rebuild/lanes/c/C1-REPORT.md`
"REQUEST TO PM"; DECISIONS:112 (5), :116, :117; LANES.md plumbing tier (one independent
reviewer, author != reviewer, + CI green on both runners).

Reviewer did not build this branch. The builder's `rebuild/slice/P2-REPORT.md` was read as a
HYPOTHESIS; every acceptance-bar line below was executed by the reviewer in a fresh detached
worktree, and every count in the report's table was reproduced independently on BOTH the base
and the head.

Environment: owner's Windows PC, Node v24.18.0, PowerShell.
Review worktree W = `work/pm-review-p2` (detached at `d5c140c`).
Base worktree B = `work/pm-review-p2-base` (detached at `origin/rebuild/t2-client-core` =
`5c6766eda6f74f638ff7e3b6f5d71a323341ac27`).
Dependencies: not installed. Junctions only, from `%LOCALAPPDATA%\Temp\earned-ci`, at
`node_modules`, `rebuild/m3/w6/node_modules`, `rebuild/m3/w5/node_modules` in each worktree.
`git status --porcelain` was empty in both after junctioning and is empty again at the end of
this review (every mutant was restored with `git checkout --`; `git diff --numstat` against the
base is identical to what it was before the first mutant).
Nothing under `ledger/`, `rebuild/conform/private/` or `src/history.js` was read, copied or
printed. No token or secret appears in this file; the CI token was never displayed.

---

## 1. Diff scope - PASS

```
$ git diff --numstat origin/rebuild/t2-client-core...HEAD
1       0       rebuild/lanes/STATUS.md
20      0       rebuild/m3/w6/host/host-entry.mjs
246     0       rebuild/m3/w6/host/test/host-seams.test.mjs
17      0       rebuild/m3/w6/host/workout-host.mjs
260     0       rebuild/slice/P2-REPORT.md
# 5 files changed, 544 insertions(+), 0 deletions
```

Only `rebuild/m3/w6/host/**` (+ its `test/`), `rebuild/slice/P2-REPORT.md` and exactly one
appended STATUS line. Zero deletions anywhere, so acceptance-bar 4 ("additive; no line removed
or reordered") is proved by the numstat itself, not asserted.

`rebuild/m3/w6/host/engine-runtime-host.cjs` does not appear in the diff, and its blob is
byte-identical to the base:

```
$ git hash-object rebuild/m3/w6/host/engine-runtime-host.cjs
583f247cebbc6412807ebcef40278bc671a4b1e5
$ git rev-parse origin/rebuild/t2-client-core:rebuild/m3/w6/host/engine-runtime-host.cjs
583f247cebbc6412807ebcef40278bc671a4b1e5
```

Commits on the branch: `2f88ed8` (the two items), `f51f6ac` (report), `d5c140c` (STATUS).
Merge-base with the base branch is the base commit itself, so the three-dot diff is the whole
delta.

---

## 2. Counts, re-run by the reviewer on BOTH trees - PASS, table reproduced exactly

`# pass` / `# fail` here are the `node --test` summary lines (`tests N` / `pass N` / `fail N`)
and the process exit code. BEFORE was run in B, AFTER in W.

| command | BEFORE (base `5c6766e`) | AFTER (head `d5c140c`) |
|---|---|---|
| `node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs` | `tests 22` `pass 22` `fail 0`, exit 0 | `tests 22` `pass 22` `fail 0`, exit 0 |
| `node --test rebuild/m3/w6/test/local-host-journey.test.mjs` | `tests 17` `pass 17` `fail 0`, exit 0 | `tests 17` `pass 17` `fail 0`, exit 0 |
| W6 suite in place (`node --test test/*.test.mjs` from `rebuild/m3/w6`) | `tests 552` `pass 552` `fail 0`, exit 0 | `tests 552` `pass 552` `fail 0`, exit 0 |
| `node rebuild/m3/w6/test/run-current-head.cjs work/m3-w5-r1 --all` | `tests 552` `pass 552` `fail 0`, exit 0 | `tests 552` `pass 552` `fail 0`, exit 0 |
| `node --test rebuild/m3/w7-preview/today/test/gym.test.mjs` | `tests 64` `pass 64` `fail 0`, exit 0 | `tests 64` `pass 64` `fail 0`, exit 0 |
| `node rebuild/m4/spec/native-carriers-package.cjs --ci` | `NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`, exit 0 | `NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`, exit 0 |
| `node rebuild/m3/w6/host/build-host.mjs` | `W6 HOST BUILD PASS - 91 pinned inputs`; 13 engine inputs, exit 0 | `W6 HOST BUILD PASS - 96 pinned inputs`; 13 engine inputs, exit 0 |
| `node --test rebuild/m3/w6/host/test/host-seams.test.mjs` | n/a (file does not exist on the base) | `tests 9` `pass 9` `fail 0`, exit 0 |
| `node rebuild/m3/w6/local/build.mjs` (extra, reviewer) | `38` local + `97` local-host pinned inputs, PASS | `38` local + `97` local-host pinned inputs, PASS |

Every number in the builder's table is confirmed. Two notes the reviewer adds:

* **`run-current-head.cjs` argv[2].** Reproduced the builder's call exactly, with the retained
  R1 worktree `work/m3-w5-r1` as `argv[2]`. Confirmed by reading the harness that `argv[2]` is
  the retained R1 repository whose `rebuild/m4/workout/*` shared-edit sources are sha-checked
  against `test/shared-edit-source-pins.json`, which is why the joined tree cannot be passed.
  552/552 on both trees, exit 0.
* **`native-carriers --ci` false alarm, and its cause.** The reviewer's first two attempts
  reported `NATIVE CARRIERS PACKAGE FAIL; ... local diagnostics withheld`, exit 1. Root cause
  found and it is NOT the branch: a disconnected earlier shell had left a concurrent run of the
  same gate alive in the SAME worktree root, and the gate materialises a transient top-level
  `test-support/` via `native-carriers-reference.cjs` and writes shared logs under
  `.tmp/native-carriers-package/`. Two runs in one root collide. Run serially it is PASS, exit 0,
  on both trees (`base-nc`, `nc-run4` transcripts). This gate is not concurrency-safe within a
  root - worth knowing, unrelated to P2.

Final state of W after all mutants were restored:
`node --test host/test/journey.test.mjs host/test/engine-equivalence.test.cjs host/test/host-seams.test.mjs`
-> `tests 31` `pass 31` `fail 0`, exit 0; `git status --porcelain` empty.

---

## 3. Item 1 (`subtle`) - the byte-identical-default claim, re-derived - UPHELD

The reviewer did not take the builder's reasoning. The chain was read and then probed with a
throw-away script in a gitignored `.tmp/probe/` directory (deleted afterwards; `git status`
empty).

Read: `rebuild/m3/w6/host/workout-host.mjs:78` destructures `subtle` with **no default** and
`:192` forwards it into the `createDurablePublicClient({...})` object literal.
`rebuild/m3/w6/public-client.mjs:21` destructures `subtle` with **no default** and passes
`{ keys, subtle }` to `W5.createPublicVerifier` (`:26`) and to `W5.createPublicBoundary`
(`:501`). `rebuild/m3/w5/public-client.cjs:44` is
`createPublicVerifier({ keys, subtle = globalThis.crypto && globalThis.crypto.subtle } = {})`.

A destructuring default in JS fires on the **value** `undefined`, not on key absence. So an own
key `subtle: undefined` is indistinguishable from an absent key at every hop. The probe executed
this rather than asserting it:

```
PROBE lang/absent: DEFAULT                 # (({subtle='DEFAULT'}={})=>subtle)({})
PROBE lang/undefined-key: DEFAULT          # ... ({subtle: undefined})
PROBE w5/absent-verifies: true             # W5.createPublicVerifier({keys}).verifyLease(lease)
PROBE w5/undefined-key-verifies: true      # W5.createPublicVerifier({keys, subtle: undefined})...
PROBE scope/keycount: 20                   # head: the scope composeWorkoutHost hands the client
PROBE scope/hasOwn-subtle: true
PROBE scope/subtle-value: undefined
PROBE real/as-composed: {"hasOwn":true,"acknowledged":true,"code":null,"ops":1}
PROBE real/key-deleted: {"hasOwn":false,"acknowledged":true,"code":null,"ops":1}
PROBE injected/acknowledged: true
PROBE injected/calls: importKey,verify,verify
```

The same probe on the BASE tree:

```
PROBE scope/keycount: 19
PROBE scope/hasOwn-subtle: false
PROBE real/as-composed: {"hasOwn":false,"acknowledged":true,"code":null,"ops":1}
PROBE injected/calls: (none)
```

Two things are proved. (a) `real/as-composed` vs `real/key-deleted` is a REAL client, a real
repository and a real Start run twice - once with the own `subtle: undefined` key present and
once with the key deleted from the very same scope. Identical durable outcome (`acknowledged`,
`code`, one stored op). So nothing in the client reflects over the key's presence; the default
path cannot move. (b) `injected/calls` is the differential that matters: on the base an injected
`subtle` is observed **zero** times (the ambient `globalThis.crypto.subtle` verified the lease);
on the head the injected one is the thing that performs `importKey` and `verify`. The request is
actually delivered, not merely wired.

### Judgment on the third hunk (the guard) - IN SCOPE, keep it

C1 asked for "one line each". The guard at `workout-host.mjs:113-114` is a third hunk C1 did not
ask for. The reviewer keeps it, for reasons the reviewer executed:

* Every other injected dependency in `composeWorkoutHost` is refused **by name** if it is wrong;
  the module's own header says "a missing one is a specific TypeError naming it, never a
  substitute". An unvalidated optional would have been the only injected value in the function
  that can be wrong without a named refusal.
* Without the guard the failure is silent, not loud. `W5.createPublicVerifier` accepts any
  truthy `subtle` (`if (!subtle || ...)`) and `verifyRecord` wraps everything in
  `try { ... } catch (_) { return false; }`. A misconfigured `subtle` therefore presents at
  runtime as an **unproven lease**, indistinguishable from a forged one. Executed:
  `W5.createPublicVerifier({keys, subtle:{verify: async()=>true}}).verifyLease(lease)` -> `false`.
* It provably cannot touch the default path: `subtle !== undefined` short-circuits, and probe
  section (a) above is the end-to-end proof.
* Cost is 2 code lines and 3 comment lines. Mutant M4 shows it is load-bearing.

See finding F1 for the one way in which the guard is narrower than its own comment claims.

---

## 4. Item 2 (re-export) - identity reproduced; no second path; the 91 -> 96 consequence weighed

**Identity reproduced.** `node --test rebuild/m3/w6/host/test/host-seams.test.mjs` -> 9/9, and
mutant M3 (below) proves those assertions are the ones doing the work: replacing the two
re-export bindings with forwarding wrappers turns 9/9 into 5 pass / 4 fail.

**No second path to the store, checked against C4.** `rebuild/m3/w6/local/today-bindings.mjs:55`
imports `openLocalDurableClient` from the same `./local-client.mjs`. Lane C's two entries
(`local/host-browser-entry.mjs:12-16`, `local/today-browser-entry.mjs:12-14`) do
`export * from '../host/host-entry.mjs'` and then export the same two names explicitly, which in
ESM shadows the star rather than colliding with it. The reviewer confirmed this is not just
source reading: `git grep` shows `host-entry.mjs` has exactly three consumers -
`host/build-host.mjs` and those two local entries - and lane C's own bundles are unchanged in
size by this branch (`local/build.mjs`: 38 and 97 pinned inputs on base AND head). The
re-export adds nothing to lane C's bundles because those entries already carried the names.

**The 91 -> 96 consequence, derived independently.** The reviewer did not trust the report's list.
A scratch script called `buildBrowser` on `host/host-entry.mjs` in each tree and diffed the
inventories:

```
before 91 inputs / after 96 inputs; Compare-Object ->
  => rebuild/m3/w6/local/host-bindings.mjs
  => rebuild/m3/w6/local/import-bundle.mjs
  => rebuild/m3/w6/local/local-client.mjs
  => rebuild/m3/w6/local/local-era.mjs
  => rebuild/m3/w6/local/local-keys.mjs
```

Exactly five additions, zero removals - the five the report names, nothing else. `build-host.mjs`
still reports PASS with **nothing forbidden**: no `rebuild/engine/{seed,migrate,merge,index}.cjs`,
no `rebuild/authority/*` except `canonical.cjs`, no `rebuild/m3/w5/crypto.cjs`, no
`rebuild/m4/import/*` (note `local/import-bundle.mjs` is a W6 local module, not `m4/import`), no
`rebuild/engine/test/*`, and not `m4/workout/engine-runtime.cjs`. The 13 `rebuild/engine` inputs
are byte-for-byte the same list before and after, so the engine boundary this build exists to
police is unmoved.

**Is this what C1's request intended?** Yes. C1-REPORT:862-868 asks for exactly this, with the
stated purpose "If the PM wants the host page itself to boot on a phone, `host-entry.mjs`
re-exporting `openLocalDurableClient` / `localHostBindings` would make
`rebuild/m3/w6/local/host-browser-entry.mjs` unnecessary". The five inputs ARE the local store;
a host entry that names the local factory and does not carry it would be useless. The growth is
the request, and it lands only in the PM's own host-page bundle.

**Does it change the phone bundle the PWA builds? No - but the PWA bundle does change, for the
OTHER item.** `rebuild/slice/pwa/build-pwa.mjs` consumes `rebuild/m3/w7-preview/today/build.mjs`,
whose entry is `today/today-entry.mjs`; `host-entry.mjs` is not in that graph at all. But
`today-entry.mjs -> gym-host.mjs -> w6/local/today-bindings.mjs -> w6/host/workout-host.mjs`, so
item 1 IS in the shipped PWA. Reviewer built the PWA on both trees and diffed the emitted
`app.*.js`:

```
base app.a10763e9be3225df.js  1330447 bytes / 23108 lines
head app.f2c8502e1b10faa7.js  1331368 bytes / 23122 lines
Compare-Object -> 14 differences, ALL "=>" (added), 0 removed:
  the 8 comment lines of the P2 (1) parameter block, "subtle,",
  the 2 guard lines, the 2 forward-comment lines, "subtle,"
```

So the deployed PWA bundle grows by exactly the 14 additive lines of `workout-host.mjs` (about
920 bytes, mostly comment - this bundle is not minified) and by nothing else; no local module
enters it. Behaviour is unchanged: `today-bindings.mjs:338` composes the host without a `subtle`
key, so the new guard can never fire there and the default path is the probed byte-identical one.
The one operational consequence: the service-worker cache name is derived from the built bytes,
so it moves (`earned-slice-ea7ced11...` -> `earned-slice-de01a97e...`) and every installed client
re-downloads the precache on the next deploy. That is by design (no version constant) and is not
a defect, but the PM should expect it.

PWA suites on the head, as asked:

```
node --test rebuild/slice/pwa/test/pwa.test.cjs rebuild/slice/pwa/test/workflow.test.cjs
  tests 43  pass 43  fail 0   exit 0
node --test rebuild/slice/pwa/test/package.test.cjs        (the built-folder test)
  tests 10  pass 10  fail 0   exit 0
node rebuild/slice/pwa/build-pwa.mjs
  A5 PWA BUILD PASS: 13 files; 11 precached and pinned by sha256; 13 exact header rules;
  10 credential shapes and 4 private roots refused across 13 files; no network reference
  exit 0
```

---

## 5. The `registerHooks` shim in `host-seams.test.mjs` - verified, and mutated

The shim is `host-seams.test.mjs:38-45`. It rewrites a load only when
`/\.(woff2?|ttf|otf|txt|css|svg|png)$/` matches `new URL(url).pathname`; `.js`, `.mjs` and `.cjs`
cannot match that alternation, and `pathname` strips any query so a `foo.mjs?x=.txt` specifier
still reads as `/foo.mjs`. That is the static argument. The reviewer then executed it: the hook
was temporarily instrumented to print every URL it saw and which branch it took.

```
SHIM-REWROTE /.../rebuild/m4/workout/fonts/InstrumentSans-Variable.woff2
SHIM-REWROTE /.../rebuild/m4/workout/fonts/InstrumentSerif-Regular.woff2
SHIM-REWROTE /.../rebuild/m4/workout/fonts/OFL-InstrumentSans.txt
SHIM-REWROTE /.../rebuild/m4/workout/fonts/OFL-InstrumentSerif.txt
(SHIM-PASSED, unique: 53 modules)
```

Four pinned font assets rewritten; 53 JavaScript modules passed through to `nextLoad` untouched.
No product byte is replaced.

The shim's necessity is real and predates this branch. Executed on the BASE worktree:

```
node --input-type=module -e "import('file:///.../pm-review-p2-base/rebuild/m3/w6/host/host-entry.mjs')..."
-> BASE-IMPORT-ERROR ERR_UNKNOWN_FILE_EXTENSION
```

Two mutants bound the shim from both sides (M5, M6 in the table). Adding `mjs` to the alternation
does NOT silently pass - it fails loudly, 5 pass / 4 fail, exit 1 - so a shim that masked a JS
module could not hide inside this file. Removing `woff2?|txt` reproduces
`ERR_UNKNOWN_FILE_EXTENSION` and the file dies at import, which is what the shim is there for.
Verdict: the shim rewrites only non-JS asset extensions, cannot mask a JS module, and is the
minimum needed to import a bundle entry in Node.

---

## 6. Mutants - 9 applied, 9 caught, tree restored byte-identical

Each mutant was applied to the head tree, `node --test rebuild/m3/w6/host/test/host-seams.test.mjs`
was run, then the file was restored with `git checkout --` and `git status --porcelain` confirmed
empty. Baseline for every row is `tests 9  pass 9  fail 0  exit 0`.

| # | mutant | file | observed | caught |
|---|---|---|---|---|
| M1 | drop the `subtle` forwarding from the `createDurablePublicClient({...})` call | `host/workout-host.mjs` | `tests 9 pass 5 fail 4` exit 1 (1.a, 1.b, 1.c + parent) | YES |
| M2 | forward a SUBSTITUTE: `subtle: globalThis.crypto && globalThis.crypto.subtle` | `host/workout-host.mjs` | `tests 9 pass 5 fail 4` exit 1 | YES |
| M3 | break the re-export identity: `export const openLocalDurableClient = (...a) => _olc(...a)` and the same for `localHostBindings` | `host/host-entry.mjs` | `tests 9 pass 5 fail 4` exit 1 (2.a, 2.b, 2.c + parent) | YES |
| M4 | remove the guard (both code lines) | `host/workout-host.mjs` | `tests 9 pass 7 fail 2` exit 1 (1.d + parent) | YES |
| M5 | drop `subtle` from the destructured parameter list, keep the forward | `host/workout-host.mjs` | `tests 9 pass 4 fail 5` exit 1 | YES |
| M6 | shim regex extended to rewrite `.mjs` too | `host/test/host-seams.test.mjs` | `tests 9 pass 5 fail 4` exit 1 - fails LOUDLY, never silently | YES |
| M7 | shim regex narrowed to drop `woff2?`/`txt` | `host/test/host-seams.test.mjs` | `ERR_UNKNOWN_FILE_EXTENSION ".woff2"`, `tests 1`, exit 1 | YES |
| M8 | test 1.a's key assertion `assert.equal(withSubtle.subtle, subtle)` weakened to `assert.ok(...)`, THEN M2 re-applied | test + product | `tests 9 pass 5 fail 4` exit 1 - the substitute is still caught behaviourally by 1.b/1.c | YES (redundant cover, good) |
| M9 | test 1.d's `assert.throws(...)` refusal loop removed, THEN M4 re-applied | test + product | `tests 9 pass 9 fail 0` exit 0 - the guard mutant ESCAPES | YES (by design: 1.d is the single load-bearing assertion for the guard, exactly as the report states) |

M8 and M9 are the "remove each new test's key assertion" pair. M8 shows the subtle-forwarding
claim is covered by more than one assertion (weakening the identity check does not let a
substitute through). M9 shows the opposite and confirms the builder's own disclosure: the guard
has exactly one assertion behind it, so if the guard is ever widened, 1.d must be widened with it
(see F1).

Restoration proof after the last mutant: `git status --porcelain` empty,
`git diff --numstat origin/rebuild/t2-client-core...HEAD` identical to section 1, and
`node --test host/test/journey.test.mjs host/test/engine-equivalence.test.cjs host/test/host-seams.test.mjs`
-> `tests 31  pass 31  fail 0`, exit 0.

---

## 7. CI - both workflows completed/success at the exact head sha

```
$ node work/lane-c/tools/ci-status.js rebuild/polish-p2 d5c140c7c6d13304fbf9e2eae2d069f251a1800b
d5c140c pipeline   completed  success  34654368858  2026-09-11T22:31:23Z
d5c140c rebuild    completed  success  34654368870  2026-09-11T22:31:23Z
exit 0
```

Run ids: **pipeline `34654368858`**, **rebuild `34654368870`**, both at `d5c140c`.
`.github/workflows/rebuild.yml:17-23` runs `public-gates` as a matrix over
`[ubuntu-latest, windows-latest]`, so "green on both OS" is satisfied by the `rebuild`
conclusion. The token was read by the tool from the git credential helper and was never printed
by the tool or by this reviewer.

---

## 8. Findings

None of the four below blocks the merge. None is a regression against the base. They are listed
as executable proof obligations for whoever takes them; the reviewer did not fix any of them, and
did not edit a single product or test byte in this branch.

### F1 (minor, correctness of the new guard) - the guard is narrower than its own comment

`workout-host.mjs:110-114` says a supplied `subtle` that "cannot verify is refused here, by name
... never silently replaced by globalThis". It checks only
`typeof subtle?.verify !== 'function'`. `W5.createPublicVerifier` also calls
`subtle.importKey`, so a `subtle` whose `verify` is a function but which has no usable
`importKey` passes the guard and then fails exactly the silent way the guard exists to prevent.
Executed on the head, through the real host:

```
PROBE half-subtle/compose: COMPOSED               # subtle = { verify: async () => true }
PROBE half-subtle/acknowledged: false
PROBE half-subtle/code: LEASE_PROOF_UNPROVEN
W5 half-subtle verifyLease -> false
```

Test 1.d's bad-value list is `[{}, null, 'globalThis.crypto.subtle', 7, {verify:'no'}]` - it does
not include a `verify`-is-a-function case, which is why the gap survived.

PROOF OBLIGATION (one line + one list entry, `host/**` custody):
1. `workout-host.mjs`: `if (subtle !== undefined && (typeof subtle?.verify !== 'function' || typeof subtle?.importKey !== 'function')) throw new TypeError(...)`.
2. `host-seams.test.mjs` 1.d: add `{ verify: async () => true }` to the bad list.
3. Re-run `node --test rebuild/m3/w6/host/test/host-seams.test.mjs` -> expect `tests 9 pass 9 fail 0`.
4. Re-run `node rebuild/m3/w6/host/build-host.mjs` -> expect `PASS - 96 pinned inputs`, 13 engine inputs.

### F2 (disclosure, already raised by the builder; confirmed independently) - the 9 new tests do not run in CI

Confirmed by reading the workflows, not by trusting the report:
`.github/workflows/rebuild.yml:87` is the only step that names host tests and it names exactly
`rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs`.
`git grep -n "host/test" -- .github/workflows` returns that one line and nothing else. So
`host/test/host-seams.test.mjs` runs on neither runner; the green `rebuild` run above contains no
evidence from it. The builder correctly refused to touch `.github` (outside custody;
DECISIONS:112/:113 allow `rebuild.yml` on a lane branch only inside a re-pinning engine package)
and registered the request. Until it is enumerated, the only execution of these 9 tests is this
reviewer's, on Windows, Node v24.18.0.

PROOF OBLIGATION (PM, at the next re-seal that legitimately carries `rebuild.yml`):
1. Append ` rebuild/m3/w6/host/test/host-seams.test.mjs` to the "A0" step at `rebuild.yml:87`.
2. Confirm green on BOTH matrix legs at that sha with `tools/ci-status.js`.
3. Note the Node floor while doing it: `module.registerHooks` landed in Node v22.15.0 and the
   workflow pins `node-version: '22'` (floating). The test asserts the function exists rather
   than skipping, so a pinned-back 22.x would fail loudly, not silently pass - acceptable, but it
   is a real coupling between this file and the runner's Node minor.

### F3 (scope, PM decision) - C1's literal ask was a `crypto.subtle` DEFAULT, not a pass-through

C1-REPORT:857-861 asks to add `subtle` "defaulting to `crypto.subtle` when not supplied", and
gives as the reason "it makes the injected `crypto` actually the one that verifies, and **removes
a `globalThis` read from the phone path**". The delivered change forwards `undefined` and leaves
`W5`'s own `globalThis.crypto && globalThis.crypto.subtle` default in place, so a caller that
injects a non-global `crypto` but no `subtle` still verifies through `globalThis`. The globalThis
read is removed only for callers that explicitly pass `subtle`.

This is NOT a builder defect: `P2-HOST-REQUESTS-BRIEF.md:11` overrides C1 with "Default behaviour
byte-identical when not supplied", and acceptance-bar 1 asks only that a fake `subtle` be observed
by the client. The builder followed the governing brief, and the reviewer agrees the brief's
choice is the safer one for a plumbing-tier change (a `subtle = crypto?.subtle` default would
silently change which object verifies for every existing caller, which is not byte-identical and
would need its own evidence). Recorded so the PM can tell lane C that half of C1's stated
motivation is deliberately deferred, and so nobody later reads C1 as satisfied in full.

PROOF OBLIGATION, only if the PM wants C1's version as well (separate slice, not this one):
1. Change `:78` to `subtle = crypto && crypto.subtle`.
2. Add an assertion that with `crypto` injected and `subtle` omitted, the INJECTED crypto's
   subtle performs `importKey`/`verify` and `globalThis.crypto.subtle` is never touched.
3. Re-run host 22/22, local-host-journey 17/17, W6 552/552, run-current-head --all 552/552, gym
   64/64 and prove each is still at its count.

### F4 (environmental, unrelated to P2) - two tools are hostile on this PC

Recorded so the next reviewer does not lose the time. (a)
`node rebuild/conform/engines/build-engines.mjs <root>` fails on Windows with
`ERR_UNSUPPORTED_ESM_URL_SCHEME`: it does `await import(path.join(root, "node_modules/esbuild/lib/main.js"))`
with a bare `C:\...` path instead of a `file://` URL. It was not needed for anything in this
review. (b) `rebuild/m4/spec/native-carriers-package.cjs` is not concurrency-safe within one
worktree root (shared `.tmp/native-carriers-package/` logs and a transient top-level
`test-support/`); two simultaneous runs produce a spurious
`NATIVE CARRIERS PACKAGE FAIL; ... local diagnostics withheld`. Run it serially per root.

---

## 9. Acceptance bar, line by line

| bar | verdict |
|---|---|
| 1. host `journey` + `engine-equivalence` at base counts; one new test per item | PASS - 22/22 on base AND head; `host-seams.test.mjs` has both (subtle observed by the client: 1.a/1.b/1.c; re-export object identity: 2.a/2.b/2.c); 9/9 |
| 2. lane C suites green at base counts + `run-current-head --all` | PASS - local-host-journey 17/17, W6 in place 552/552, run-current-head --all 552/552, all identical before and after |
| 3. `native-carriers --ci` PASS on the branch; gym unchanged and green | PASS - `NATIVE CARRIERS PUBLIC CI EVIDENCE PASS` exit 0 on both trees; gym 64/64 on both |
| 4. `workout-host.mjs` additive; exact hunks shown; `engine-runtime-host.cjs` untouched | PASS - numstat `17 0`, zero deletions in the whole diff; hunks in the report match the diff; engine-runtime-host blob identical (`583f247c...`) |
| 5. no file outside custody changed | PASS - 5 files, all in custody, plus the one STATUS line the brief allows |
| 6. reviewer file with FINAL VERDICT and own re-runs | this file |
| plumbing tier: one independent reviewer + CI green both OS | PASS - author != reviewer; `rebuild` and `pipeline` completed/success at `d5c140c`, `rebuild` over `[ubuntu-latest, windows-latest]` |

FINAL VERDICT: **ACCEPT at `d5c140c7c6d13304fbf9e2eae2d069f251a1800b`**. F1, F2 and F3 are
non-blocking follow-ups, each with an executable proof obligation above; the reviewer applied
none of them.
