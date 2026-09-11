# P2 REPORT — the two host/ requests from lane C's C1-REPORT

Brief: `rebuild/slice/P2-HOST-REQUESTS-BRIEF.md`. Authority: `rebuild/lanes/c/C1-REPORT.md`
"REQUEST TO PM" (two items, non-blocking), carried in DECISIONS:112 (5).
Branch: `rebuild/polish-p2`. Base: `origin/rebuild/t2-client-core` @
`5c6766eda6f74f638ff7e3b6f5d71a323341ac27`. Build commit: `2f88ed8`.
Worktree: `work/pm-p2` on the owner's PC, Node v24.18.0, Windows.
Dependencies: not installed — the CI-faithful trees at
`%LOCALAPPDATA%\Temp\earned-ci` are junctioned in at `node_modules`,
`rebuild/m3/w6/node_modules`, `rebuild/m3/w5/node_modules`; `git status
--porcelain` was empty after junctioning, and `package-lock.json` is untouched.

Custody honoured: the only files changed are `rebuild/m3/w6/host/workout-host.mjs`,
`rebuild/m3/w6/host/host-entry.mjs`, the new `rebuild/m3/w6/host/test/host-seams.test.mjs`,
this report, and one line appended to `rebuild/lanes/STATUS.md`.
`rebuild/m3/w6/host/engine-runtime-host.cjs` is byte-identical (it does not appear in
`git diff --stat`, below). Nothing under `ledger/`, `rebuild/conform/private/` or
`src/history.js` was read, copied or printed. No token or secret appears anywhere.

---

## 1. The two items, as built

### (1) `composeWorkoutHost` passes `subtle` through to `createDurablePublicClient`

`rebuild/m3/w5/public-client.cjs:43` is `createPublicVerifier({ keys, subtle = globalThis.crypto
&& globalThis.crypto.subtle })`, and `rebuild/m3/w6/public-client.mjs:20-26` already destructures
`subtle` and hands it straight to that verifier. Only `composeWorkoutHost` did not name it, so the
injected `crypto` was never the thing that verified the authority lease. It is named now and
forwarded unchanged.

Absent, the value is `undefined` in the destructure and `undefined` in the forwarded object literal
— the same absent value `createDurablePublicClient` already destructures when no caller names the
key — so `createPublicVerifier`'s own default still applies and the default path cannot move. The
22/22 host suite below is the executed proof.

### (2) `host-entry.mjs` re-exports the local factory surface

C1-REPORT names them precisely: `openLocalDurableClient` and `localHostBindings`. Read on the base
commit: `rebuild/m3/w6/local/local-client.mjs` exports `openLocalDurableClient`;
`rebuild/m3/w6/local/host-bindings.mjs` exports `localHostBindings` (C1-REPORT writes it
"`localHostBindings`"; the brief's shorthand "hostBindings" is the method on the open client,
`client.hostBindings(options)`, which `localHostBindings` itself calls). Both are re-exported from
`host-entry.mjs` as **re-export bindings** — no wrapper, no new factory, no module-level state.

Confirmed against C4 / DECISIONS:111 that this creates **no second path to the store**:
`rebuild/m3/w6/local/today-bindings.mjs:55` imports `openLocalDurableClient` from the same
`./local-client.mjs`, and lane C's two entries (`local/host-browser-entry.mjs:13-16`,
`local/today-browser-entry.mjs:13-14`) export the same two names explicitly, which in ESM shadows
the `export *` these re-exports become visible through rather than colliding with it. Executed as
object-identity assertions (test 2 below), not asserted from reading.

---

## 2. The exact hunks

`git diff --stat` on the build commit:

```
 rebuild/m3/w6/host/host-entry.mjs   | 20 ++++++++++++++++++++
 rebuild/m3/w6/host/workout-host.mjs | 17 +++++++++++++++++
 2 files changed, 37 insertions(+)
```

37 insertions, **0 deletions**: no line was removed or reordered in either file.
`rebuild/m3/w6/host/test/host-seams.test.mjs` is new (246 lines).

### `rebuild/m3/w6/host/workout-host.mjs` — three additive hunks

`@@ -67,6 +67,15 @@` — the destructured parameter, after `keys, crypto,`:

```
   keys, crypto,
+  // P2 / C1-REPORT "REQUEST TO PM" (1). OPTIONAL WebCrypto SubtleCrypto. A host
+  // whose WebCrypto does not live at globalThis.crypto.subtle supplies it here,
+  // and it is then the injected one that VERIFIES the authority lease, rather
+  // than a globalThis read the phone path cannot control. Not supplied, nothing
+  // changes: the value stays undefined the whole way to
+  // rebuild/m3/w5/public-client.cjs createPublicVerifier's own
+  // `subtle = globalThis.crypto && globalThis.crypto.subtle` default, which is
+  // exactly what every existing caller already gets.
+  subtle,
   // --- constructors, injected so this module imports no product graph ---
```

`@@ -98,6 +107,11 @@` — the guard, after the `crypto` guard:

```
   if (!crypto || typeof crypto.getRandomValues !== 'function') need('crypto');
+  // `subtle` is optional, so its ABSENCE is never a refusal. A supplied one that
+  // cannot verify is refused here, by name, in the same shape as the optional
+  // string-lane registrar below — never silently replaced by globalThis.
+  if (subtle !== undefined && typeof subtle?.verify !== 'function')
+    throw new TypeError('composeWorkoutHost requires a WebCrypto SubtleCrypto when subtle is supplied');
   if (typeof createDurablePublicClient !== 'function') need('createDurablePublicClient');
```

`@@ -173,6 +187,9 @@` — the forward, inside the `createDurablePublicClient({…})` call:

```
     keys, crypto, schemaVersion: 2,
+    // Forwarded, not defaulted: undefined here is the same absent value
+    // createDurablePublicClient already destructures when no caller names it.
+    subtle,
     prescriptionCapture, workoutProducerIdentity, resolveWorkoutBasis,
```

**One judgment call, flagged for the reviewer.** C1 asked for "one line each"; the guard is a third
hunk the request did not ask for. It is here because this module's own header says "a missing one is
a specific TypeError naming it, never a substitute", and without it a supplied-but-wrong `subtle`
(e.g. `{}`) passes `createPublicVerifier`'s truthiness check and fails much later, inside
verification. The guard cannot touch the default path: `undefined` short-circuits it. If the reviewer
judges it out of scope, deleting those four lines is self-contained and leaves items (1) and (2)
intact — test `1.d` is the only assertion that depends on it.

### `rebuild/m3/w6/host/host-entry.mjs` — one additive hunk

`@@ -23,3 +23,23 @@` — appended after the last existing export; the two new statements are:

```
+export { openLocalDurableClient } from '../local/local-client.mjs';
+export { localHostBindings } from '../local/host-bindings.mjs';
```

(preceded by an 18-line comment recording why this is a re-export and not a second factory).

---

## 3. Commands and counts, before and after

Every line below was executed in `work/pm-p2`. BEFORE = base `5c6766e`, no edit applied.
AFTER = build commit `2f88ed8`. Verbatim `# pass` / `# fail` lines are the `node --test`
summary lines `ℹ pass N` / `ℹ fail N`.

| command | BEFORE | AFTER |
|---|---|---|
| `node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs` | `tests 22` · `pass 22` · `fail 0` | `tests 22` · `pass 22` · `fail 0` |
| `node --test rebuild/m3/w6/test/local-host-journey.test.mjs` | `tests 17` · `pass 17` · `fail 0` | `tests 17` · `pass 17` · `fail 0` |
| the W6 node suite in place — `node --test test/*.test.mjs` from `rebuild/m3/w6` (the `test` script in `rebuild/m3/w6/package.json`) | `tests 552` · `pass 552` · `fail 0` | `tests 552` · `pass 552` · `fail 0` |
| `node rebuild/m3/w6/test/run-current-head.cjs <retained-R1> --all` | `tests 552` · `pass 552` · `fail 0` | `tests 552` · `pass 552` · `fail 0` |
| `node --test rebuild/m3/w7-preview/today/test/gym.test.mjs` | `tests 64` · `pass 64` · `fail 0` | `tests 64` · `pass 64` · `fail 0` |
| `node rebuild/m4/spec/native-carriers-package.cjs --ci` | `NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`, exit 0 | `NATIVE CARRIERS PUBLIC CI EVIDENCE PASS`, exit 0 |
| `node rebuild/m3/w6/host/build-host.mjs` | `W6 HOST BUILD PASS — 91 pinned inputs`; 13 engine inputs | `W6 HOST BUILD PASS — 96 pinned inputs`; 13 engine inputs |
| `node --test rebuild/m3/w6/host/test/host-seams.test.mjs` (new) | n/a | `tests 9` · `pass 9` · `fail 0` |

Verbatim summary blocks for the two suites the acceptance bar names by count:

```
node --test rebuild/m3/w6/host/test/journey.test.mjs rebuild/m3/w6/host/test/engine-equivalence.test.cjs
ℹ tests 22
ℹ suites 0
ℹ pass 22
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
```

```
node --test rebuild/m3/w6/host/test/host-seams.test.mjs
▶ P2 (1) — composeWorkoutHost accepts subtle and forwards it to createDurablePublicClient
  ✔ a. the injected subtle reaches the client scope by identity, and nothing else moves
  ✔ b. the injected subtle is the one that VERIFIES — a real Start goes through it
  ✔ c. a subtle that refuses makes the client refuse — globalThis is not consulted behind it
  ✔ d. a supplied non-WebCrypto subtle is refused by name; an absent one never is
▶ P2 (2) — host-entry re-exports the local factory surface, same object identity
  ✔ a. the two names are the local modules' own bindings, not copies or wrappers
  ✔ b. no second path to the store: lane C's own entries expose the SAME functions
  ✔ c. host-entry still adds no store of its own
ℹ tests 9
ℹ suites 0
ℹ pass 9
ℹ fail 0
```

**`run-current-head.cjs` argv[2].** The harness takes a RETAINED R1 repository as `argv[2]` and
sha-checks its `rebuild/m4/workout/*` shared-edit sources against `test/shared-edit-source-pins.json`
`r1`. On this base, `.` (the joined tree) refuses at that gate — `Retained R1 shared edit source
differs: rebuild/m4/workout/schema.cjs (9d18cce9… vs declared 6038b32e…)` — because the joined tree
carries the candidate sha, not R1's. The retained R1 worktree
`work/m3-w5-r1` has `schema.cjs` = `6038b32e70…`, matching the pin, and was used as `argv[2]` for
both the BEFORE and the AFTER run. The 552/552 above is that harness, `--all`.

**`build-host.mjs` 91 → 96 inputs.** The five added inputs are exactly lane C's local modules the new
re-export pulls in (`local/local-client.mjs`, `local/host-bindings.mjs`, `local/local-era.mjs`,
`local/local-keys.mjs`, `local/import-bundle.mjs`); their own dependencies (`repository.mjs`,
`bridge.mjs`, `t2-stage.cjs`, `rebuild/client/index.cjs`, `rebuild/authority/canonical.cjs`) were
already in the host graph through `browser-entry.mjs`. The build still reports **PASS** with
**nothing forbidden** and the same 13 `rebuild/engine` inputs, so the engine boundary
`build-host.mjs` exists to police is unmoved. This growth is the point of the request ("a phone
bundle built from host-entry has one import for the real durable store"), but it is a real change to
what the host page ships and the reviewer should weigh it deliberately.

---

## 4. What the new tests actually observe

`rebuild/m3/w6/host/test/host-seams.test.mjs` composes the SAME real graph `journey.test.mjs` does:
real repository (AES-GCM over `fake-indexeddb`), real T2 stage, real `createDurablePublicClient`,
real v2 capture validator, the accepted registrar/reader/adapter and the accepted engine runtime.
Synthetic and labelled: the athlete setup, the identity, the signing key and lease, the guards.

* **1.a** — a capturing `createDurablePublicClient` double records the scope object from two
  compositions, one with a fake `subtle` and one without. `scope.subtle === subtle` (the caller's own
  object, unwrapped); without, `scope.subtle === undefined` and the key is still own-present, which is
  the absent value the client already destructures. Every other scope key is identical between the two.
* **1.b** — with the REAL client and a pass-through recording `subtle`, `prepareWorkout` +
  `startPreparedWorkout` succeed and one op is stored, and the recorder observed both `importKey` and
  `verify`. That is the fake `subtle` being the thing that verifies the lease.
* **1.c** — the same, with a `subtle` whose `verify` answers `false`. The client refuses
  `LEASE_PROOF_UNPROVEN` and the ops collection stays empty. With `globalThis.crypto.subtle` it would
  have succeeded, so this is the differential proof that the injected one is consulted and the
  ambient one is not.
* **1.d** — `{}`, `null`, a string, `7` and `{verify:'no'}` are each refused with a `TypeError`
  naming `subtle`; `undefined` and omission are not refused.
* **2.a/b/c** — object identity: `HostEntry.openLocalDurableClient ===
  LocalClientModule.openLocalDurableClient`, `HostEntry.localHostBindings ===
  HostBindingsModule.localHostBindings`, and the same two values again from
  `local/host-browser-entry.mjs` and `local/today-browser-entry.mjs` (the C4 entry). The set of names
  `host-entry` shares with those two local modules is exactly `{openLocalDurableClient,
  localHostBindings}`, and `openRepository` / `openFrameRepository` are still `browser-entry.mjs`'s own
  bindings, unchanged.

**One test-harness note the reviewer should check.** `host-entry.mjs` is a BUNDLE entry: through
`browser-entry.mjs` → `m4/workout/prepared-panel.mjs` → `m4/workout/typography.mjs` it imports the
pinned `.woff2` / `.txt` font assets that `rebuild/m3/w6/build-browser.mjs` loads as `binary`/`text`.
Node has no loader for those extensions, so importing the entry in a Node test throws
`ERR_UNKNOWN_FILE_EXTENSION` — **on the base commit too**; nothing this branch did caused it. The
test registers a `node:module` `registerHooks` load hook that turns ONLY non-JavaScript asset
extensions into an inert `export default ""`, then dynamically imports the three entries. It touches
no product byte and no JavaScript module. It is the only unusual thing in the file.

---

## 5. What I could not do

1. **The new test file is not enumerated in CI.** `.github/workflows/rebuild.yml:86-87` runs the A0
   step as two explicit paths (`host/test/journey.test.mjs host/test/engine-equivalence.test.cjs`), so
   `host/test/host-seams.test.mjs` will not run on either runner until that line names it. `.github` is
   outside this brief's custody and, under DECISIONS:112/:113, a lane branch may only carry
   `rebuild.yml` inside a re-pinning engine package — so I did not touch it. **Request to the PM:**
   add `rebuild/m3/w6/host/test/host-seams.test.mjs` to the A0 step at the next re-seal (lane B's
   B-NTC seal already carries `rebuild.yml` enumeration hunks). Until then the reviewer must run the
   file explicitly; I did, on Windows, 9/9.
2. **`registerHooks` availability on the CI runner.** `setup-node` pins `node-version: '22'`;
   `module.registerHooks` landed in v22.15.0. Current 22.x satisfies it, but the test asserts the
   function exists rather than skipping, so if a very old 22.x were ever pinned the file would fail
   loudly rather than silently pass. I could not verify this on a CI runner from here — only Node
   v24.18.0 on the PC.
3. **No browser run.** `rebuild/m3/w6/test/browser-check.mjs` was not run (it needs a browser binary
   and is recorded as environmental in A0-REPORT §5); the re-export is proved by module identity in
   Node and by `build-host.mjs` PASS, not by loading the page.
4. **CI on both OS** is not something a builder can execute; it is the reviewer's line per the
   standing rule in `rebuild/lanes/REQUESTS.md` (2026-09-11 01:07 ET, refined at DECISIONS:106).

## 6. Objections

None. No law, frozen file or accepted artifact was edited, and nothing was changed to make a test
pass. `engine-runtime-host.cjs` was not opened for edit; it is absent from `git diff --stat`, which
is the executed proof that the accepted engine artifact's pin still holds.
