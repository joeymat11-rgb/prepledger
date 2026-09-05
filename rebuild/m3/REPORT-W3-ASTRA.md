# W3 — clock / lease continuity spike — ASTRA

Branch `rebuild/m3-w3-clock-spike`, from integration tip `3564e6957467c23fc4f100af406fca08ff3c018d`. Scope: new `rebuild/m3/clock-spike/` files plus this explicitly requested report. The frozen app, client, authority, conformance suite and seeded soak stub are unchanged. No deployment, account action, phone interaction, private-data access for the spike, or product-rule change was made. Repository gate preparation used the existing ignored private fixture under the mandated local-only process; no contents are reported.

## Findings

**W3 delivers an investigation and runnable probe, not a C11/iPhone PASS.** The browser evidence does not establish a lease clock across process kill, reboot or an old-state restore without trusting wall time. Persisted high-water marks prevent some regressions within an established lineage; they do not measure time while the process is absent or survive complete snapshot rollback as independent evidence.

The design note cites the runtime sheet and primary browser/time documentation. The Node model requires an explicitly supplied conservative elapsed-time bound, fresh P-256 signed challenge response, current device/athlete/lease/schema bindings, and separately established history reconciliation. No browser profile is certified. A signed response alone does not bound delay; an increasing `performance.timeOrigin + performance.now()` is not a reboot certificate.

**RED WITNESS `C1-C11-RESTART`:** two modeled histories can expose identical restored local state and post-restart browser observations, although one crosses expiry and the other does not. Refusing both in state 20 preserves C11 safety but leaves C1 offline cold-start writes unsatisfied. This proposed browser policy therefore triggers the sheet's native decision boundary; Cowork/the owner must carry that decision forward. W3 does not silently weaken C1, claim the target phone failed an executed test, select a native implementation, or reopen the seeded storage experiment. Native would also need a proven reboot/restore policy.

## Provable / unproved cases

All model verdicts below are synthetic. Target supplied: iPhone 17 Pro / iOS 26.6.1; physical execution **NOT RUN**.

| Case | What the spike establishes | Required outcome |
|---|---|---|
| Qualified uninterrupted elapsed model | Conservative upper time bound and atomic high-water/lease/op/outbox/sequence update | Save locally as state 1 only inside the time and sequence capability |
| Last valid / first invalid time | Equality at `not_after` is valid; +1 ms is invalid | 1 / 20; no new operation or consumed slot on refusal |
| Last valid / first invalid sequence, range exhaustion | Inclusive last slot; first outside either bound refused | 1 / 20; model face also shows exhaustion |
| ±24 h skew, rollback, roll-forward, DST, timezone | Untrusted wall observations cannot lower trusted time or reopen expiry | Valid existing proof may save; otherwise 20; actual DST remains a separate phone case |
| Process kill / new document / reboot | Data may survive; elapsed absence is not proved by stored numbers | Intact store/standing: 20; preserve existing outbox and entered value |
| Old coherent local restore | Checkpoint integrity does not establish recency or prevent sequence replay | 20 until authenticated time AND history/slot reconciliation; fresh time alone is insufficient |
| Unqualified timer, suspension, monotonic rollback | No known elapsed upper bound | 20, including apparently fresh replies measured by that source |
| Missing/corrupt required local storage | Missing records can be detected; whole erasure needs independent enrollment evidence | 18 before truth paint; never silently initialize a replacement |
| Session expiry alone | Still enrolled/decryptable with valid proof and capability | 11: save durably, pause sync |
| Known sign-out/revocation/closure/lost decryption or recovery | Standing outranks clock permission | 17: refuse, retain entry, require named recovery |
| Expiry or continuity loss during modeled commit | Recheck at synchronous cut, then rollback all staged records | 20; ordinary storage failure is 3 |
| Valid saved operation arrives after cutoff | Actual unchanged T3 accepts original operation and its replay once | Existing outbox may drain; no retroactive arrival-time expiry |
| Declared revocation | Actual unchanged T3 preserves accepted prefix and refuses beyond the barrier | Known local standing is 17; authenticated rejection is separate state-19 machinery |

## Delivered and why

- `CLOCK-CONTINUITY.md`: evidence, conditional signed-time bound, exact state mapping, C1/C11 red witness, and outstanding integration obligations.
- `continuity-model.mjs` and `test/continuity.test.mjs`: model preflight plus the real T2 `weighIn` committer. Its backend wrapper commits the complete signed lease and high-water with the actual operation/outbox/sequence transaction. It maps an explicitly identified clock refusal at that cut to 20 after T2 rollback. Ordinary storage failures remain 3. It is not installed into T2 or imported by the page.
- `test/core-witness.test.mjs`: five red witnesses against unchanged T2, and two actual T3 admission controls. Passing a witness means the gap was reproduced, not fixed.
- Standalone probe shell, manifest, worker, icons and storage code: explicit witnessed initialization; later opens append observations to the original run; full history/counter/high-water/digest commit and read back together. Missing/inconsistent data suppresses the old result. The page always labels intact observations state 20 because it has no authority or qualified clock.
- `README.md`: ten-asset deployment allowlist, separate-origin installation, off-device baseline custody, exact scheduled 15-minute tap script, late/unavailable cases marked NOT RUN, and separate actual-DST/old-restore work. `test/probe-browser.cjs` provides repeatable desktop boundary verification.

## Executed output

Node v24.19.0, Windows host. Commands run from repository root:

```text
node --test rebuild/m3/clock-spike/test/continuity.test.mjs rebuild/m3/clock-spike/test/core-witness.test.mjs
tests 39 · pass 39 · fail 0 · cancelled 0 · skipped 0 · todo 0
```

32 protocol-model tests plus 7 unchanged-core tests. The protocol set includes a C1/C11 red witness; the core set includes five red witnesses. Successful test exit does not make those obligations green.

```text
node rebuild/m3/clock-spike/test/probe-browser.cjs
PASS browser: explicit initialize, real IndexedDB commit/readback, counter2, narrow layout,16px controls
PASS browser: closed/reopened Chromium, offline shell, original baseline retained, counter3; zero server requests offline
PASS browser: mid-session tamper and reopen refuse state18; no silent initialization, no external app requests
PROBE-BROWSER PASS (desktop Chromium only; installed iPhone/Safari NOT RUN)
```

Used the bundled Playwright package via `CLOCK_PLAYWRIGHT_MODULE`, a new isolated Chrome profile and a loopback-only allowlisted server; no existing browser/athlete profile. Standalone detection was simulated. This does not prove Safari installation, iOS durability, process behavior or a trusted clock. Static syntax, DOM references, icon dimensions, manifest/precache assets and whitespace checks also passed.

Required repository gates ran with the pinned reference engines and mandated fixture/clock preparation; public oracle pins stayed unchanged. `run.cjs` and selftest used `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`; strict used its normal clock setup.

```text
node rebuild/conform/run.cjs
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
node rebuild/conform/run.cjs --selftest
SELFTEST PASS
node scripts/check.mjs --strict
PASS  engine outputs byte-identical to the frozen baseline (R15 freeze)
All checks passed. Safe to ship.
```

The last line is the existing strict runner's wording, not a claim that W3 is production-ready. New W3 tests run separately; the frozen suite was not expanded or edited.

## Retained red witnesses and review

| Witness in `test/core-witness.test.mjs` | Unchanged source and executed evidence |
|---|---|
| Wall rollback reopens expiry | `client/index.cjs:112`, `lease.cjs:24`: changing caller `clock.now()` from expired to earlier permits Saved despite increasing monotonic input |
| Restored continuity/high-water ignored | `client/index.cjs:49–75,112`: new boot accepts with supplied `continuityProven:false` and future high-water; those inputs are not lease checks |
| Whole local erasure becomes fresh | `client/store.cjs:83`, `index.cjs:52–55`: empty replacement backend permits reused sequence 1 instead of state 18 |
| Coherent old restore reuses a slot | `client/index.cjs:55`: restored local sequence generates an acknowledged operation that actual T3 rejects as `IDENTITY_COLLISION` |
| Exhaustion face disagrees with refusal | `client/index.cjs:129,136–138`, `face.cjs:25`: action refuses 20 while governing face remains 1 because its lease check omits next sequence |

These are required integration seams/witnesses, not permission to change product rules or retrofit fixes in this PR. Three same-family agents assisted with the design note, probe and bounded review; this does not replace Cowork's independent execution. Review found a new-model defect where caller mutation could extend a lease after the earlier signature check: the model now clones/freezes the supplied lease and has a passing final-cut mutation regression. No existing core behavior was changed.

## Seams and uncertainty

1. `upperElapsed` is a trusted synthetic provider, not `performance.now()` wrapped in a new name. Provider epoch/lifecycle changes must explicitly invalidate it or make the bound unavailable; the model does not discover OS boots. Document IDs and persisted booleans cannot certify continuity. Real drift/quantization/sleep and server error budgets remain unknown.
2. `historyReconciled` is an explicit trusted test prerequisite, not an implemented authenticated recovery protocol. Replaying an entire valid snapshot cannot be detected from that snapshot alone. The production app needs standing, keys, slot/history reconciliation and recovery before a fresh time anchor permits writes. T2's count checkpoint is not a full storage integrity or anti-rollback scheme.
3. The model uses a pinned ephemeral public verification key and a spike-only signed-byte domain. Real key epochs, public signature wire profile, fresh server endpoint and account bindings remain W5/W6. Existing T2/T3 HMAC keys in tests are invented fixtures and never placed in the probe.
4. The synchronous committer proof is not an asynchronous IndexedDB bridge. Recheck permission at the defined async commit cut and acknowledge only after completion. T2 also uses `clock.now()` for athlete effective time; a production adapter must separate trusted cutoff time from athlete-attested dates/time. The spike does not ship that integration.
5. The probe's stored maxima and counter are diagnostic, not trusted lease time/sequence. Its hash detects inconsistent data, not authentic history or coherent old restores. A failed capture conservatively shows unavailable-history state 18; it does not claim to reproduce all product save-error states. The independent receipt must survive loss of all origin storage.
6. No app API requests, telemetry, sync, polling or background recording. Initial static loading/precache needs same-origin asset requests; a browser can independently check a service-worker script for updates. Literal zero device traffic cannot be guaranteed by an installable webpage. Offline reopen was observed with zero server requests. The integrator must host only the ten approved assets on a new pinned origin; no deployment occurred here.
7. iPhone hand test, real DST, target OS sleep behavior, native feasibility, actual old-phone restore and complete asynchronous storage fault matrix remain NOT RUN. The 15-minute slot does not manufacture missing evidence. No result here changes or resets the owner's already seeded 30-day soak.
