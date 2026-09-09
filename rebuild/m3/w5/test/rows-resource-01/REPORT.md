# OPUS-RECOVERY-RESOURCE-01 — rows-v3 replacement-route resource qualification

**Assignment:** `rebuild/m3/w5/test/rows-resource-01/BRIEF.md` (brief commit `2bfa66ee8e67f453ba10bf7081c23bd76715ace2`).
**Product parent:** `734986a688366293349145e6feb80fd4130d3702` (PR43) — verified as `HEAD~1` of the working branch.
**Branch:** `codex/opus-recovery-resource-01` (the selected isolated branch; no shared branch and no `main` was written).
**Date:** 2026-09-09. **Platform:** Linux, Node v22.22.2, `CLK_TCK` 100 → 10 ms counter tick, CPU guard 20 ms (`2 × tick`).

## Answer to the concrete question

> *Does the implemented `/reconcile/rows` route meet the existing server resource budget on complete, valid
> synthetic recovery inventories, including sequential and overlapping attempts?*

**On the valid cross-record account: YES, on this workload and this host.** The one complete sequential attempt and
the two overlapping attempts each reached a signed terminal finish with byte-identical inventories, and every one of
the five ceilings held — peak observed allocation 51,213,841 B (sequential) and 74,684,730 B (overlapping) against
the unchanged 100,663,296 B ceiling.

**The wrapper's overall verdict is nonetheless `FAIL`,** because a separately-labelled generic near-row/key-limit
probe on the *same* route peaked at **175,669,412 B**, over the ceiling. That failure is preserved, not explained
away, and §"What the preserved failure does and does not establish" records exactly how far the evidence reaches.

This is a **local rows-v3 server result only.** It is **not** an old-route (`/reconcile`) PASS, not client memory,
not complete staged-profile validation, not atomic activation, not current permission, not phone fit, and not
private recovery.

## Commands actually run

```
pnpm install --frozen-lockfile                                   # in rebuild/m3/w5; lock byte-unchanged
node test/rows-resource-01/rows-resource.cjs                     # the qualification run
node test/rows-resource-01/rows-resource.cjs --only-near-limit   # the isolation control (ordering only)
node test/rows-resource-01/rows-resource.cjs --locate-peak        # the bounded peak-localization diagnostic
node --test test/rows-resource-01/rows-resource.test.cjs         # focused adapter tests — 17/17 pass
node --test test/r1-paged-http.test.cjs                          # pre-existing route test — 10/10 pass, undisturbed
```

Machine evidence is written to the ignored `rebuild/m3/w5/.generated/`; the sanitized committed extract is
`EVIDENCE.json` beside this report.

## Source and new-file pins (SHA-256)

| file | pin |
|---|---|
| `test/r1-workerd.cjs` | `314beed62e0ad7ecbc2798d6fd9e31a55792c25441bd8e6ecf12464b752f5347` |
| `test/r1-resource-meter.cjs` | `9081e9d46f923dd304ea494c2e879fa486e9661b8f8da1aa175fa198e05ccc8e` |
| `test/r1-resource-fixture.cjs` | `3235510964bc64fe6618221c2d7dc25df98683de2f762c10647952d363e8b0b4` |
| `test/r1-resource.test.cjs` | `c31f58f4f33ddf029dab2fae75cc92e7b369092c0af5eb24eca56769b783ba2a` |
| `test/r1-paged-http.test.cjs` | `02ffd4ba728c00fdc840bb83b903b0bead7104b1b123172e47ad1706c0d29388` |
| `reconciliation/paged-bridge.cjs` | `ede215943a08616197ab7d48cc573b075f269f6211a4bf18adee4a7454b70295` |
| `reconciliation/paged-codec.cjs` | `c02e947c0b6df6905a7cfb1fa43ed6aaa90b6cac2109165e6aab500f51fc2748` |
| `reconciliation/codec.cjs` | `2336594b9fab772c818834531122c639debd8977adee5c12fd5b3d92ba6bd192` |
| `storage/database.cjs` | `f0e89e738903abe5f0d19ff4e596507bd897068442f25b8f68564007d015fed7` |
| `worker.cjs` | `e10643f7dbdf3b429a52b559b16b8fcae255a07dcc8f3f0ceffadd099e003a5d` |
| **new** `test/rows-resource-01/rows-resource.cjs` | `4564fa133db37b89edf7887dedbdba3e2381c5feb8a1c250b6dc535e058f14bd` |
| **new** `test/rows-resource-01/rows-resource.test.cjs` | `ead6e03551405765ca422446175d263bd88cb84af6fd96948f67cb3bade8c6b1` |

Every existing product, runner, meter, fixture, conformance law, package lock and report byte is unchanged;
`git status` shows only the four new files under `test/rows-resource-01/`.

The two new-file pins above are **current**. The two **qualification** measurements were executed by the superseded
wrapper pin `713d9973ab97c817587d85f839ffc5a1b50f70cf00d341755685b5266aaa243c` and were **not** re-run for the
acceptance-gating, report or diagnostic changes. The **peak-localization diagnostic** was executed by pin `4564fa133db37b89edf7887dedbdba3e2381c5feb8a1c250b6dc535e058f14bd`.
`EVIDENCE.json` records the executed pin against every run; no earlier result or pin was overwritten.

## Workload mapping — old profile to rows-v3

The wrapper **reuses `test/r1-resource-fixture.cjs` `populate()` at `targetBytes = C.LIMITS.payload`** — the identical
construction the old `/reconcile` experiment measured — and then grows it.

| | old profile (`/reconcile`) | rows-v3 (`/reconcile/rows`) |
|---|---|---|
| unit of proof | the COMPLETE history materialized as one 1,048,576-byte signed payload | rows selected AT a checked cut, cursor-chained to a signed terminal finish |
| bound | whole-history cap; one extra byte is a typed `413` | per chunk: 32 rows **or** 262,144 stored bytes. **No whole-history cap** |
| completion | 32 fixed transport pages | 39 chunks for this account, terminating on an empty signed page |

Mapping decisions:

* The fixture's default raw `UPDATE` bypasses P1 sealing, which the storage trigger correctly refuses. The fixture's
  own `readLogicalRows` / `writeLogicalRow` hooks exist for exactly this; both are routed through the real storage
  codec, so the workload construction is unchanged and no product module is touched.
* The account was then **grown** through the real bridge `admit` path by 24 large (65,536 B padding) and 100 small
  (64 B padding) valid facts — **126 admitted synthetic facts, 638 rows, 3,760,588 row-value bytes**, i.e. 3.59× the
  old transport cap. Nothing was shrunk at any point to obtain a result.
* **Old-profile extra-byte refusal preserved as an old-profile requirement:** at exactly 1,048,577 payload bytes
  `/reconcile` still returns `413 RECONCILE_LIMIT`. It is recorded as an unmeasured semantic control. **No
  corresponding refusal is invented for rows-v3, which has no whole-history cap.**

## Measurement method — unchanged

Preserved verbatim: default pinned runtime (Wrangler 4.129.0, `compatibilityDate` 2026-09-03), the original
simultaneous `totalSize + embedderHeapUsedSize + backingStorageSize` formula and 96 MiB ceiling, CPU accounting and
calibration, 1,000 ms CPU, 1,000 statements, batches below 30 s, zero domain writes. **No** forced GC, heap limit,
per-page runtime restart, CPU-to-wall-time substitution, hidden warmup or changed sample formula. The wrapper asserts
the meter's own formula string before measuring.

**Fixture setup is separated from the measured workload** exactly as the existing meter justifies: population,
extension and near-limit writes all happen outside any `begin()`/`end()` observation window.

**The real application isolate is proven, not assumed.** The wrapper independently reads the inspector target list
and asserts that the meter's own selection rule (`title.includes(workerName)`) resolves to exactly one target,
`workerd: worker core:user:earned-r1-metered-application`. Eight setup/proxy isolates — `core:entry`, `d1:db`,
`d1:db:entry`, `cache:0`, `cache:cache`, `outbound:0`, `MINIFLARE_DEV_CONTROL`, `email:store` — are recorded as
rejected.

**Byte identity is checked independently of candidate output.** The oracle is a direct D1 read through the real
storage codec plus `validateRetained()`; the route's own response never feeds it. The driver consumes each chunk
realistically — every row is base64-decoded and UTF-8 validated, then folded into a length-framed running SHA-256 —
and **retains no rows**, so the check is neither an unbounded retention experiment nor a no-op consumer.

## Results — qualification run, 2026-09-09T15:42:54Z

**All four attempts completed to a signed terminal finish; all four matched the independent D1 read byte-for-byte.**

| attempt | chunks | rows | row-value bytes | inventory digest | terminal finish |
|---|---:|---:|---:|---|---|
| sequential | 39 | 638 | 3,760,588 | `paKQn7thXST7…` | yes |
| overlap-a | 39 | 638 | 3,760,588 | `paKQn7thXST7…` | yes |
| overlap-b | 39 | 638 | 3,760,588 | `paKQn7thXST7…` | yes |
| near-limit *(generic probe)* | 42 | 640 | 6,360,674 | `RuzQsrr4qvqs…` | yes |

### Peak measured allocation, against the unchanged 100,663,296 B ceiling

| phase | requests | peak observed allocation | verdict |
|---|---:|---:|---|
| instrument-calibration | 3 | 30,979,993 B | within |
| **rows-v3 sequential complete attempt** | 39 | **51,213,841 B** | **within** |
| **rows-v3 two overlapping complete attempts** | 78 | **74,684,730 B** | **within** |
| rows-v3 near-row/key-limit attempt *(generic)* | 42 | **175,669,412 B** | **EXCEEDS** |

Run-to-run, across the three runs performed: sequential 51.2 / 56.3 MB, overlapping 74.7 / 74.4 MB, near-limit
175.7 / 151.3 MB and 127.4 MB in the isolation control. The valid-account phases stayed inside the ceiling in every
run; the near-limit phase exceeded it in every run.

**Run attribution.** The qualification run (51.2 / 74.7 / 175.7 MB) and the isolation control (127.4 MB) were both
executed by wrapper pin `713d9973ab97c817587d85f839ffc5a1b50f70cf00d341755685b5266aaa243c`, and both are recorded in
`EVIDENCE.json` under that pin. The third figures (56.3 / 74.4 / 151.3 MB) come from an **earlier, superseded**
wrapper revision that predates the ordering control; its source hash was not retained, so it is reported here as
variance context only and is deliberately **excluded** from `EVIDENCE.json`. The acceptance-gating and report
corrections in this commit changed the wrapper pin; **no measurement was re-run for them**, so every recorded number
remains attributable to the version that produced it.

### CPU and SQL — 159 measured requests

| metric | observed | ceiling |
|---|---:|---:|
| guarded CPU, maximum | 700 ms | 1,000 ms |
| guarded CPU, p95 | 110 ms | — |
| D1 statements, maximum per request | 6 | 1,000 |
| batch wall time, maximum | 51 ms | < 30,000 ms |
| **reconciliation domain writes** | **0** | 0 |
| D1 rows read | 376,190 | — |
| revision-control rows written | 159 | *(not domain writes)* |
| D1 query duration, summed | 405 ms | — |

One caution, stated because it is a near-miss rather than a pass: in the isolation control a single request reached
**exactly 1,000 ms** guarded CPU — at the ceiling, not over it, so not a violation under the unchanged `> ceiling`
test. CPU here is the process-wide owned-workerd delta and includes first-phase JIT and competing D1/inspector work.

### Row/page boundary coverage — observed, not asserted by construction

For the valid account: 12 chunks were **row-count bound** (exactly 32 rows), 26 were **byte-budget bound**, the
largest single stored row was 66,812 B and no chunk needed the single-row-over-budget escape. The near-limit probe
produced **2 single-row-over-budget chunks**, a 1,400,041-byte page and a 3,202,414-byte response.

### Negative calibration

* **An exceeded limit is detected, not passed.** Replaying the *real* measured samples against deliberately
  unreachable ceilings raised `CPU_CEILING`, `STATEMENT_CEILING`, `BATCH_CEILING`, `DOMAIN_WRITE` and
  `OBSERVED_ALLOCATION_CEILING`, verdict `FAIL`. The agreed ceilings were never altered for the verdict.
* **Incomplete or invalid recovery is refused, not reported successful.** Short cumulative counts against the
  manifest, a dropped row, a wrong byte count and a tampered digest each raise their own typed refusal. Live over
  HTTP: a forged cursor returns `400` with no page, and a foreign subject reusing a signed actor-bound continuation
  returns `403` state 17.
* The seventeen focused adapter tests cover the same paths without spinning workerd, including that `CEILINGS` still
  equals the original agreed values and that no diagnostic or relaxed configuration can earn `resourceAcceptance`.

## What the preserved failure does and does not establish

Stated only as far as the evidence supports. **No product change was made, and none is proposed here.**

**Established.** The generic near-row/key-limit workload exceeds the 96 MiB observed-allocation ceiling, in every run
of it (175,669,412 B and 151,260,366 B in full runs; 127,399,301 B in the `--only-near-limit` control). In that
control the breach occurs **without the preceding sequential and overlapping traversals** — so those two traversals
are not required to produce it. At that peak the vector is dominated by committed heap and live data
(`totalSize` 102,543,360 B, `usedSize` 53,035,824 B) rather than backing buffers alone.

**Not established, and previously overstated in this report.** The control is not a single-row experiment and does
not isolate one cause. `--only-near-limit` still runs the instrument calibration, builds the **complete** fixture
(populate at `C.LIMITS.payload`, the old-route extra-byte refusal, then all 126 admitted facts), inserts **both** a
1,200,024-byte key row **and** a 1,400,018-byte value row, and then traverses the **entire** account — 42 chunks,
640 rows, 6,360,674 row-value bytes. Therefore:

* it does **not** show that one row alone is sufficient or causal;
* it does **not** rule out accumulation or setup effects, since calibration, fixture growth and the old-route
  refusal all precede it inside the same isolate;
* **"no forced GC" does not mean no collection occurs** — the runtime may collect on its own schedule, and this
  experiment observes neither collections nor their absence.

**Where the code is relevant, as context rather than as a diagnosis.** `reconciliation/paged-bridge.cjs` bounds a
chunk by `running_bytes <= 262144` **or** `position = 1`, and `P.LIMITS.row` is 2,000,000 B with
`P.LIMITS.response` at 6,000,000 B — so a chunk carrying one large row can exceed the ordinary per-chunk budget, and
the observed 1.4 MB row produced a 3.2 MB response. That describes the shape of the workload the route is being
asked to serve. It is **not** evidence that the limits are the fault, and **shrinking the supported row or history
limits is not proposed**: the currently supported records are preserved, and any protocol or limit change belongs in
a separate review, not in a resource qualification.

The measurement as it stands cannot attribute the peak to a specific request: the meter samples periodically on a
5 ms timer and its samples carry no request correlation. That is the gap the next action closes.

## Verdict

| scope | verdict |
|---|---|
| rows-v3 on the complete valid cross-record account — 1 sequential + 2 overlapping complete attempts | **PASS** on this workload and host: all five ceilings held, all attempts reached a signed terminal finish, byte identity confirmed against an independent D1 read |
| rows-v3 on the generic near-row/key-limit probe | **FAIL** — 175,669,412 B (isolation control 127,399,301 B) against the 96 MiB ceiling |
| wrapper verdict as run | **FAIL** — one `OBSERVED_ALLOCATION_CEILING` violation, preserved |
| `resourceAcceptance` flag | **false**, and now gated: see "Acceptance gating" below |
| old profile (`/reconcile`) | **not re-qualified here.** Only the extra-byte `413` control was asserted. The five recorded old-profile FAILs in `RESOURCE-LIMITS.md` stand; nothing here is relabelled as an old-route PASS |

A rows-v3 server PASS does not establish client memory, complete staged-profile validation, atomic activation,
current permission, phone fit or private recovery.

### Acceptance gating

A green verdict is necessary but **not sufficient** for `resourceAcceptance`. The wrapper previously set the flag
from `verdict === 'PASS'` alone, which meant a diagnostic, partial or relaxed configuration — `--only-near-limit`,
altered ceilings, non-default workload counts — could in principle have carried it over a workload that was never
the qualification workload. The recorded runs were both `FAIL`, so **no mislabelled result was ever emitted**; the
defect was latent, and it is now closed.

`qualificationEligibility()` requires, all together: the original ceilings unmodified, the default workload counts,
one complete sequential attempt and exactly two complete overlapping attempts — each reaching a signed terminal
finish **and** independent byte identity — and no ceiling violation. Anything else records typed reasons
(`VALID_ACCOUNT_ATTEMPTS_SKIPPED`, `CEILINGS_NOT_ORIGINAL`, `WORKLOAD_COUNTS_NOT_DEFAULT`,
`SEQUENTIAL_ATTEMPT_INCOMPLETE`, `OVERLAPPING_ATTEMPTS_INCOMPLETE`, `VERDICT_NOT_PASS`) and leaves the flag false.

The gate is a pure exported function and is regressed by the focused adapter tests, including **a near-only
configuration with a `PASS` verdict and zero violations, which is asserted ineligible.** Its wiring into `run()` was
previously reviewed by reading only; **the peak-localization diagnostic has since executed it end to end**, printing
`resourceAcceptance=false — NOT an eligible qualification run: VALID_ACCOUNT_ATTEMPTS_SKIPPED,
BOUNDARY_OBSERVATION_ENABLED, SEQUENTIAL_ATTEMPT_INCOMPLETE, OVERLAPPING_ATTEMPTS_INCOMPLETE, VERDICT_NOT_PASS`.
That limitation is closed.

## Limitations

* CPU is the owned-workerd process user+kernel delta, inclusive of D1, inspector and overlapping requests.
* Memory is the maximum observed simultaneous inspector allocation vector; sampling can miss a peak, and these
  fields do not cover every native allocation.
* Local observations do not establish remote provider performance, spending limits, T1, K1 or P1. Cloudflare's
  memory limit is per isolate across concurrent requests; local success is not a remote deployment verdict.
* The independent byte-identity oracle materializes the inventory in the Node harness, outside the measured isolate;
  it does not enter the memory metric.
* The near-limit fixture is deliberately a **generic** extreme key/row inventory shape, not a profile-valid history
  event; it is kept distinct from the valid cross-record account and `validateRetained()` is deliberately not run
  against it.
* **No forced collection does not mean no collection.** The runtime may collect on its own schedule; these runs
  observe neither collections nor their absence, and draw no conclusion about collectible memory.
* Three runs are not a peak distribution, and no run isolates a single variable.

## Bounded diagnostic — peak localization (DIAGNOSTIC, `resourceAcceptance` = false)

Released scope: one bounded diagnostic, correlating the near-only failure with requests and chunks using the
**unchanged** meter. No meter, product, source, limit or workload edit; no forced GC; no new isolate connection; no
per-page restart. This run does **not** replace the original qualification evidence.

**Method.** The meter already exposes `observe(label)` and returns ordered sample vectors from `end()`. The wrapper
now takes a default-off `observeBoundaries` option that calls `observe('before:<label>')` and `observe('after:<label>')`
at each request edge, **outside** `meter.measure()` so the inspector round-trip is not charged to the request's own
CPU delta. Those labelled samples partition the ordered periodic samples, so each sample is attributable to the
interval it fell in. Run once as `node test/rows-resource-01/rows-resource.cjs --locate-peak`.

**Disclosed overhead and ambiguity.** Samples carry order only — **never timestamps** — so interval *duration* is
unknown and nothing can be placed in time within an interval. The extra observations and round-trips occur inside
the measured window and can only **raise** the observed peak, so this run's numbers are **not comparable** with the
uninstrumented runs. Boundary observation is now itself an ineligibility reason (`BOUNDARY_OBSERVATION_ENABLED`), so
an instrumented run can never carry the acceptance flag.

**Result: the peak is attributable.** Global peak 144,745,729 B at sample 86 of 211, a periodic sample lying between
`before:near-limit-chunk-15` and `after:near-limit-chunk-15` — **within** that request. Its vector is
`usedSize` 53,069,736 / `totalSize` 119,889,920 / `embedderHeapUsedSize` 644,840 / `backingStorageSize` 24,210,969.

**But the peak request is not where the allocation arrives.** Chunk 15 is an *ordinary* chunk — 2 rows, 132,430
row-value bytes, 178,947 response bytes. The ordered per-interval trajectory shows the step changes happening
earlier, at the two extreme-row requests, and never unwinding:

| request | page rows | row-value bytes | response bytes | interval peak |
|---|---:|---:|---:|---:|
| chunk-0 … chunk-4 | 32 / 32 / 32 / 32 / 1 | ≤ 17,380 | ≤ 27,307 | 23.5–29.5 MB |
| **chunk-5** (generic extreme **key**) | 1 | 1,200,045 | 3,202,414 | **79,472,936 B** |
| **chunk-6** (generic extreme **value**) | 1 | 1,400,041 | 1,869,075 | **123,331,466 B** — first breach |
| chunk-7 … chunk-31 (ordinary) | 2–22 | ≤ 147,280 | ≤ 199,795 | 89–145 MB, never back to baseline |
| **chunk-15** (peak sample) | 2 | 132,430 | 178,947 | **144,745,729 B** |

So the allocation steps up **at** the two extreme-row requests, crosses the ceiling at the second of them, and then
stays in a 89–145 MB band across ordinary chunks that individually carry ~132 KB. This **corrects the framing this
report carried before the diagnostic**: the largest *sample* is not in a large-row request at all.

**What this does and does not show.** It identifies the requests at which the observed allocation steps up, and the
request containing the largest sample. It does **not** establish causation: `observedAllocation` includes
`totalSize`, which is committed heap and a high-water quantity, so a sustained band after chunk-6 is equally
consistent with committed heap simply not being returned as with fresh allocation in each later chunk — and at the
peak, live `usedSize` (53 MB) is well under half of `totalSize` (120 MB). No forced GC was used and **no conclusion
is drawn about whether collection occurred**. A second, instrumentation-only observation: one request
(`near-limit-chunk-6`, the extreme-value row) recorded 1,050 ms guarded CPU, over the 1,000 ms ceiling — but the
uninstrumented runs measured 700 ms and 1,000 ms maxima, so this may be observation overhead and is **not** reported
as a CPU finding.

**Code-backed lead, by reading, not measured.** On the large-row response path the same row's bytes are materialized
repeatedly and concurrently: `codec.open` produces a decrypted buffer and a plaintext string; `makePage` calls
`C.encode64(row.value)`, which copies via `TextEncoder` and then builds a base64 string (4/3 inflation); `rows()`
validation immediately decodes that base64 back to a fresh `Uint8Array` and `C.text()`s it to a fresh string;
`hash('batch',…)` JSON-encodes the whole row array and re-`bytes()` it; `sign()` encodes the whole page including
those rows; `page()` re-validates, decoding every row again; `parseResponse(C.encode(result))` encodes and re-parses
the entire result; and the Worker's `reply()` `JSON.stringify`s it once more. For a 1.4 MB row that is several
simultaneous multi-megabyte strings and buffers per request. **This is read-supported only — it has not been
measured, and it is offered as where to look, not as a diagnosis.**

## One concrete next action

**Count the simultaneous copies on the large-row response path and reduce them**, starting at the two requests the
diagnostic named — `near-limit-chunk-5` and `near-limit-chunk-6`, the generic extreme key and value rows, where the
observed allocation steps from 23.5 MB to 79.5 MB to 123.3 MB. The read above lists the candidate materializations
(encode64 copy, validation round-trip decode, batch-hash encode, signature encode, page re-validation,
`parseResponse` re-encode, `reply` stringify); measuring which of those are live simultaneously is the next
concrete step, and it needs no product edit to perform.

**Not proposed:** any whole-history or row-limit reduction. The currently supported records stay supported, and any
protocol or limit change is a separate review under root ownership — no product fix should be made before that.

## Scope and process notes

Exclusive new files, all under `rebuild/m3/w5/test/rows-resource-01/`: `rows-resource.cjs`, `rows-resource.test.cjs`,
`EVIDENCE.json`, `REPORT.md` (plus the pre-committed `BRIEF.md`). No merge, deploy, provider/account/settings change,
paid overage or additional agent. No private gate was run and **no whole-repository acceptance is claimed.** Nothing
under `ledger/`, no private fixture, credential, signing secret or personal data was read or transmitted; all signing
and identity keys were generated locally per run, held only in memory, and no key material appears in any output.
Independent review of this output must be performed by someone else.
