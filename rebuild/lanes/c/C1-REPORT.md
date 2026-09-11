# C1 REPORT — durable local save wired to the client ops (W6 LOCAL half)

Branch `rebuild/lane-c-c1`, base `9aeb2cc`. Worktree
`work/lane-c/c1` on the owner's Windows PC, Node v24.19.0. Every command and
number below was executed there; nothing is quoted from another machine or from
a previous run of a different tree.

**No existing file was edited.** `git status --porcelain` after the work lists
only the new paths, and `git diff --stat HEAD` is empty. No additive export line
was needed in any existing W6 file. `rebuild/client/*`, `rebuild/engine/*`,
`rebuild/m3/w6/host/`, `pnpm-lock.yaml` and the root lock are untouched, and no
install of any kind was run.

## WHAT WAS BUILT

| file | sha256 | lines |
|---|---|---|
| `rebuild/m3/w6/local/local-keys.mjs` | `0a7feb8af70ea62cb688a6f1e42d25e7d055cc3280e50d05043e39649a10cbc2` | 117 |
| `rebuild/m3/w6/local/local-era.mjs` | `e578357aef3f110d6a9b83cd8c02fa8ea9fdcb734f6b91fc72c36d932851c3b1` | 80 |
| `rebuild/m3/w6/local/local-client.mjs` | `64b90bb9de840044eed6ccf4bfe1e737e6a562c9b93998d865dfe4a855aa45b2` | 271 |
| `rebuild/m3/w6/local/browser-entry.mjs` | `e1e78cc3d08e0dd4e1efe91ee8cc251359854ed4c4e0d18304104da8736c1f9e` | 11 |
| `rebuild/m3/w6/local/build.mjs` | `666de31c2c9dd63d1da669465432f8e0a0d0a13283098a1da1edc0f94ce24424` | 26 |
| `rebuild/m3/w6/test/local-client.test.mjs` | `ae9c71e865fb0b6cf17fca9f361a7cd7a5c9e981a574d5ea48cd975ff00cfcfb` | 371 |
| `rebuild/m3/w6/test/local-bite.cjs` | `c96404c06469f69367d0899fcd43dbda7e032fe7445b21aab40c97156c363638` | 76 |
| `rebuild/m3/w6/test/local-browser.mjs` | `c9b43f4a8b5b577b1349ac3b2e9df9a1193a8f6b8737acb1ae45aae48a1b1505` | 124 |

All files are LF-only (checked byte-wise, `crlf=false`), so the repo's
`.gitattributes` cannot rewrite them.

`openRepository`, `createBridge`, `createT2Stage` and `build-browser.mjs` are
used UNCHANGED. C1 supplies only the four collaborators every existing W6 test
injected synthetically — key provider, enrollment authorizer, lease source,
commit validator — plus the derived sidecar and the browser bundle entry.

## NON-GOALS RESTATED (from the brief — these are not gaps)

- **No hosted half.** No W5 wire, no Worker, no Clerk, no sync, no outbox drain.
  Outbox entries accumulate; in the local era that is correct, because there is
  nothing to drain them to.
- **No 24 h / 64-slot allowance.** The ruled budget (DECISIONS:24, BRIEF-W6
  v1.1) bounds offline writes RELATIVE TO THE LAST RECONCILED CONNECTION. The
  local era has no authority to reconcile with, so there is nothing to bound.
  Format 2 is not implemented; `frame-repository.mjs` stays opt-in/unwired per
  FRAME-IMPLEMENTATION-STATUS.md.
- **No knowledge fence (K1).** No hosted knowledge exists locally to lose.
- **No T2 (`rebuild/client`) edit, no engine edit, no host page, no import of
  Joe's data (C2), no phone proof (C3).**
- **"Saved" is not authority-accepted.** In the local era nothing can refuse an
  operation. Saved means DURABLY-COMMITTED-ON-THIS-PHONE. Every operation carries
  `lease_id = "local-era:<eraId>"` so a future hosted onboarding can identify
  local-era operations; that adoption is deferred with hosted sync
  (DECISIONS:88) and is not designed here.

## COMMANDS + RESULTS (Windows, this worktree)

`NODE` below is
`C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`
(v24.19.0). PowerShell blocks `npm.ps1`, so node is called directly; long output
was redirected to a file and read back, because the shell mangles `✔`/`ℹ`.

**Baseline, before any C1 file existed (same worktree):**

| command | result |
|---|---|
| `NODE --test rebuild/m3/w6/test/*.test.mjs` | `ℹ tests 435 · pass 435 · fail 0` |
| `NODE rebuild/m3/w6/build-browser.mjs` | `62 pinned local inputs`; `.tmp/browser/w6.js` = `b733c8309f4617f809b794edc39f0cf6842776d39e67fd0c26a2130e54b3143d`, `w6.js.meta.json` = `ffe65850dc0771d3982b2cc24899dff246670bafc0594e0f2706952011d9b00c` |

**After C1:**

| command | result |
|---|---|
| `NODE --test rebuild/m3/w6/test/local-client.test.mjs` | `ℹ tests 14 · pass 14 · fail 0` |
| `NODE --test rebuild/m3/w6/test/*.test.mjs` | `ℹ tests 449 · pass 449 · fail 0`, exit 0 — the 435 existing cases plus the 14 new ones, none changed |
| `NODE rebuild/m3/w6/build-browser.mjs` | `62 pinned local inputs`, exit 0; `w6.js` = `b733c830…3143d` and `w6.js.meta.json` = `ffe65850…9b00c` — **byte-identical to baseline** |
| `NODE rebuild/m3/w6/local/build.mjs` | `W6 LOCAL BROWSER BUILD PASS — 34 pinned local inputs`, exit 0; `.tmp/local/local.js` = `88ffeb64c588ec0be52340b22d1712c11c29362522d383f28f162e54e535e05e` |
| `NODE rebuild/m3/w6/test/local-bite.cjs` | see BITE RESULT, exit 0 |
| `set W6_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe` then `NODE rebuild/m3/w6/test/local-browser.mjs` | see BROWSER RESULT |

The 14 node cases, by what each proves:

1. first run → enroll → weighIn → **whole new factory on the same IndexedDB** →
   `boot()` shows the read at revision 2; a second `enroll()` is refused (state 18).
2. `enroll()` seals every collection in `rebuild/client/README.md` EMPTY, with
   `meta/checkpoint {counts:{ops:0,outbox:0}}`, `meta/device {device_id, athlete_id, seq:0}`,
   `derived {basis:{opCount:0,lastOpId:null}, value:<cleanInit>}`; every name
   survives the first operation.
3. the self-issued lease verifies under the **unchanged** `client/lease.cjs`
   (`check().valid === true`, `lease_id === "local-era:<eraId>"`,
   `schema_version 2`, `range [1, 2147483647]`), and is a real signature: another
   key does not verify it and another device_id is refused.
4. every stored operation carries `lease_id = local-era:<eraId>`; a 3-operation
   `logSession` commits atomically (4 ops, 4 outbox entries, `device.seq 4`,
   checkpoint `{ops:4,outbox:4}`, one revision); `resumeAfterKill()` reads
   "Last saved: Set 2 of squat." with `ghost:false`.
5. an unsupported command is refused (state 3, `LOCAL_COMMAND_UNSUPPORTED`) and
   the revision does not move.
6. **kill mid-transaction** (IDB-level delay, then abort): nothing published
   while the transaction is open, the typed input retained, result
   `acknowledged:false state:3`, the previous generation byte-exact
   (`deepEqual` of the whole loaded record), and a reopened factory shows no
   ghost set.
7. **quota abort**: state 3, the loaded record unchanged, and the next save still
   takes `op-dev-phone-A-2` — the aborted batch consumed no sequence.
8. two independent factories racing one revision: both acknowledged, revision 3,
   `device_seq [1,2]`, both payloads present, 2 outbox entries, predecessor chain
   intact.
9. **partial erasure** — generations record / device key / enrollment marker,
   each erased alone: `restore-required` with `STORE_MISSING` / `KEY_MISSING` /
   `ENROLLMENT_MARKER_MISSING`, `boot()` not ready, `enroll()` refused,
   `execute()` state 18, and exactly two of the three signals still present
   afterwards (no reseed, no re-key). Only all three gone reads as `first-run`.
10. a different `namespace` over the same database is `restore-required` /
    `STORED_INTEGRITY_UNPROVEN` and state 18, `enroll()` refused, and the
    original installation still loads at revision 2.
11. the derived sidecar: projector round-trip in the same commit,
    `derivedStale:false`; with no projector the cache is carried and reads
    `derivedStale:true`; a planted basis ahead of the ops is refused
    (`DERIVED_BASIS_AHEAD_OF_OPS`, state 3) with the revision and op count
    unchanged, and a projector then clears it.
12. the sidecar helpers as units (malformed, ahead, behind, `opsBasis` ordering).
13. presence probing with `indexedDB.databases()` **hidden**: still `first-run`,
    and the marker database was probed without being created.
14. no era key material (`identityKey`, `authorityKey`, lease signature) appears
    in anything the factory returns; `eraId` does.

## BITE RESULT

`NODE rebuild/m3/w6/test/local-bite.cjs`, exit 0, verbatim:

```
LOCAL BITE SOURCE — 64b90bb9de840044eed6ccf4bfe1e737e6a562c9b93998d865dfe4a855aa45b2
LOCAL BITE DETECTED — durability-gate removed; "kill mid-transaction" fails as designed
LOCAL BITE DETECTED — sidecar-validator removed; "derived sidecar rides the same commit" fails as designed
LOCAL BITE RESTORED PASS — 64b90bb9de840044eed6ccf4bfe1e737e6a562c9b93998d865dfe4a855aa45b2; full local client cases exit 0
```

Two guards, one at a time, on a disposable variant of `local/local-client.mjs`:

- **durability gate** — `execute()` made to return the T2 stage's OWN result
  instead of the bridge's post-commit result. That is exactly the defect the
  bridge exists to prevent (the real T2 acknowledges before the transaction
  completes — `storage.test.mjs`'s first case witnesses it). The mid-transaction
  case then went red at `assert.equal(result.acknowledged, false)`
  (`local-client.test.mjs:172`, `true !== false`): with the gate gone, an aborted
  transaction reported Saved.
- **sidecar validator** — the validator's `sidecarFailure(...)` return replaced
  with `null`; the planted-cache case went red, so a derived basis claiming
  operations the candidate does not have would have reached disk.

Source sha256 before and after are the same string above, and the restored file
was byte-compared (`Buffer.equals`) inside the `finally` before anything else ran.
The full 14 cases pass on the restored file (exit 0). The original bytes are also
copied to `.tmp/local-bite/local-client.mjs.orig` before the first mutation, so a
killed process still leaves a recoverable original.

## BROWSER RESULT

`W6_BROWSER_BIN=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`,
`NODE rebuild/m3/w6/test/local-browser.mjs`, verbatim:

```
W6 LOCAL-BROWSER PASS — 6/6 real IndexedDB cases; 152.0.4191.66; enroll + durable save, whole-context reopen, two-tab race, third-context read; 34 pinned bundle inputs
W6 iPhone / iOS Safari acceptance NOT RUN — Chromium-family evidence only (C3)
```

Real Microsoft Edge 152.0.4191.66, headless, launched through pinned
`playwright-core` 1.62.1 as a persistent context on a fresh profile directory,
with all non-origin requests aborted. The bundle is the one
`local/build.mjs` produces, served over 127.0.0.1 and imported as a module. The
six cases: enroll on a genuinely first-run profile; a durable weigh-in at
revision 2; **the whole browser context closed and a NEW one opened on the same
profile directory** — status `ready/LOCAL_PRESENT`, `boot()` at revision 2 with
the read, the era id and the clean-init `derived` intact; re-enrollment refused;
two tabs each with their own factory racing one revision, both acknowledged, 3
reads at revision 4; and a third context reading all three operations back with
`resumeAfterKill()` reporting no ghost.

Edge launched on the first attempt; nothing was skipped. Exit 2 (BLOCKED) is
reserved for a missing `playwright-core` or a missing/absent `W6_BROWSER_BIN`,
and is printed rather than passing silently.

## RESIDUALS

**What a browser cannot prove, and this evidence therefore does not:**

- **iOS Safari.** Every case above ran in Node's fake-indexeddb or in Chromium
  (Edge). Joe's phone is not a Chromium browser. Safari's IndexedDB has its own
  eviction and its own transaction behaviour; that is C3, and the runner says so
  in its own output rather than implying coverage.
- **Real eviction.** A scripted record delete is not the browser deciding to
  clear site data under pressure. The presence probe reports the SHAPE that
  results (partial → restore-required) — it cannot prevent eviction, cannot
  distinguish the browser's erasure from the athlete's, and cannot tell either
  from same-origin script that erased one database on purpose.
- **Real power loss.** `tx.abort()` after the write reaches IDB is the closest
  honest analogue; it is not a dead battery mid-`fsync`. The repository asks for
  `durability: "strict"` and reports `{requested, actual}`; whether the platform
  honoured it is the platform's claim, not ours.
- **Time.** The 400-day lease window and "a day's gap" are asserted with an
  injected clock. No case here has actually waited a day.

**Deferred, by design:**

- Hosted adoption of local-era operations (identified by `lease_id`, not
  designed) — with hosted sync, DECISIONS:88.
- The outbox drain. Entries accumulate; correct for the local era.
- **P1 production key custody/recovery stays BLOCKED.** Local-era custody means
  an evicted or wiped device key equals an unreadable installation: the recovery
  path is the PC port (C2), with the frozen app as the standing fallback. This is
  written into `local-keys.mjs`'s header as well, so it cannot be read as solved.
- Import of Joe's real data (C2); phone proof (C3); format 2 frames.
- `execute("workout", …)` is wired and the self-issued lease is
  `schema_version: 2`, so the command is reachable — but **no workout case is
  proven here.** The existing W6 workout suites cover that surface against their
  own collaborators.
- The clean-init `value` at `collections.derived` is carried verbatim and never
  interpreted. Whether the engine's `s` blob is the right shape is Track A's.

## DESIGN NOTES (every deviation from the brief, with its reason)

1. **Bundle output is `rebuild/m3/w6/.tmp/local/local.js`, not `dist/local.js`.**
   The brief asked for `dist/local.js` "gitignored like the existing bundle". The
   existing bundle is written to `rebuild/m3/w6/.tmp/browser/w6.js`, and `.tmp/`
   is already in both `.gitignore` files; `dist/` is in neither, so honouring the
   literal path would have meant editing `.gitignore` — a file C1 does not own.
   `buildLocalBrowser({ outfile })` takes any path, so a host can put it wherever
   it wants. Nothing about the bundle's content changes.
2. **The enrollment marker lives in a third database,
   `<databaseName>-local` (store `markers`, record `enrolled`).** The brief named
   the keys database and the generations store but not the marker's home. It
   cannot go in the generations database: `repository.mjs` opens that at format
   version 1 and creates only the `generations` store, so a second store there
   would need a version bump — and format 1 was to stay byte-untouched. Putting
   it in the keys database would have collapsed two of the three presence signals
   into one. A third database keeps them genuinely independent, which is what
   makes "any partial presence = restore-required" mean something.
3. **`projector` returns the sidecar's `value`; C1 computes `basis`.** The brief's
   "its return value is written to `collections.derived`" is ambiguous between the
   whole `{basis, value}` and just the value. Letting the host author `basis`
   would let a cache assert coverage it does not have — precisely what the
   validator is there to refuse. So the host owns `value` and only `value`.
4. **The sidecar check is directional.** A basis BEHIND the candidate's ops is
   legal: with no projector the cache is carried unchanged, and the honest report
   is `derivedStale: true` on boot, not a refusal. A basis AHEAD of the ops
   (higher `opCount`, or a `lastOpId` the candidate does not hold) is refused and
   never reaches disk. The bridge's validator context carries no collections, so
   the stage records the candidate's sidecar and basis for that attempt and the
   validator reads them; if that record is missing or belongs to an earlier
   attempt the validator fails closed (`LOCAL_SIDECAR_UNPROVEN`).
5. **The device key is persisted only AFTER revision 1 is sealed, and the marker
   last.** A failed `initialize` therefore leaves no key beside no generation —
   still a clean first run. A failed key persist leaves a generation with no key,
   which is state 18, never a second key and never a reseed. A failed marker write
   leaves generation + key without a marker, which reports `restore-required`
   rather than `first-run`: the conservative direction, because the alternative is
   reseeding over data that exists.
6. **`boot()` does not re-derive a restore-required verdict from whether the bytes
   decrypt.** This was found by the partial-erasure case, which initially went
   green on status and then red on boot: with the marker erased and the generation
   perfectly readable, `bridge.reopen()` succeeded and `boot()` reported ready.
   Fixed — a restore-required verdict from the presence probe stands, because the
   installation is no longer whole and C1 has no restore path (that is C2).
7. **The session epoch is instance-scoped.** No authority issues sessions in the
   local era, so it is a per-open random value and the validator's check proves a
   commit belongs to THIS open client — nothing about standing or sign-in.
8. **The lease's self-signature proves integrity, not authority.** The signing key
   lives inside the same sealed generation it authorizes. Its only job is to let
   the unchanged `lease.cjs` verify, so no client edit was needed. This is stated
   in `local-era.mjs`'s header too.
9. **`resumeAfterKill()` builds the unchanged client over the freshly loaded
   collections and never commits.** `t2-stage.cjs` exposes only `client.face()`,
   and adding a resume export to it would have meant editing an existing W6 file.
   A read-only `createClient` over `memoryBackend(loaded.collections)` gives the
   real resume face with no repository write and no sequence consumed.
10. **`status()` is synchronous** and reflects the last observation: the factory
    probes at open, and `enroll()` / `boot()` / `execute()` refresh it. A probe on
    every call would mean IDB round-trips in a getter a host will paint from.
11. **The presence probe never creates what it asks about.** `databases()` where
    available; otherwise it opens and aborts the `versionchange` transaction, so a
    database that did not exist still does not. A database present but missing the
    expected store also reads as absent, which is the safe answer for a half-made
    one. Case 13 hides `databases()` to exercise the fallback for real.
12. **The bite mutates the working file and restores it, rather than copying the
    tree.** `test/workout-bite.cjs` runs inside a temp tree it was handed;
    reproducing that here would mean copying a tree whose `node_modules` are
    junctions. The same contract is kept instead — unique needle, guaranteed
    `finally` restore, `Buffer.equals` byte check, sha256 printed before and after
    — plus a copy of the original in `.tmp/local-bite/` before the first mutation.
13. **No additive export line was needed anywhere.** Zero existing files changed.
