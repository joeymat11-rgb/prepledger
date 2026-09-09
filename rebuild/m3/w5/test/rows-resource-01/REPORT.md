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
away, and §"Narrow suspect" records what the code supports.

This is a **local rows-v3 server result only.** It is **not** an old-route (`/reconcile`) PASS, not client memory,
not complete staged-profile validation, not atomic activation, not current permission, not phone fit, and not
private recovery.

## Commands actually run

```
pnpm install --frozen-lockfile                                   # in rebuild/m3/w5; lock byte-unchanged
node test/rows-resource-01/rows-resource.cjs                     # the qualification run
node test/rows-resource-01/rows-resource.cjs --only-near-limit   # the isolation control (ordering only)
node --test test/rows-resource-01/rows-resource.test.cjs         # focused adapter tests — 7/7 pass
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
| **new** `test/rows-resource-01/rows-resource.cjs` | `713d9973ab97c817587d85f839ffc5a1b50f70cf00d341755685b5266aaa243c` |
| **new** `test/rows-resource-01/rows-resource.test.cjs` | `2f5f017889cfc73b0b5f45f9809ee8da30196eb82687e7402141c76625a3d2b8` |

Every existing product, runner, meter, fixture, conformance law, package lock and report byte is unchanged;
`git status` shows only the four new files under `test/rows-resource-01/`.

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
* The seven focused adapter tests cover the same paths without spinning workerd, including that `CEILINGS` still
  equals the original agreed values.

## Narrow suspect for the preserved failure

Stated narrowly and only as far as the code supports; **no product change was made and no speculative variants were
tried.**

`reconciliation/paged-bridge.cjs` bounds a chunk by `running_bytes <= 262144` **or** `position = 1`. That second
clause is a deliberate escape so a single oversized row can still be served — but it means the worst-case material
in one chunk is `P.LIMITS.row` (2,000,000 B), **7.6× the per-chunk byte budget**, and `P.LIMITS.response` permits
6,000,000 B. Base64 plus JSON plus signing over such a row multiplies that again: the observed 1.4 MB row produced a
3.2 MB response.

The one competing explanation — that the near-limit phase simply ran last, in an isolate with no forced collection —
was tested and **ruled out**. The `--only-near-limit` control runs that probe as the first measured phase in a fresh
runtime, changing only ordering (no ceiling, no formula, no workload change): it still peaked at **127,399,301 B**,
over the ceiling. The peak vector is dominated by committed heap and live data (`totalSize` 102,543,360 B,
`usedSize` 53,035,824 B), not by backing buffers alone.

So: **bounded SQL for ordinary rows does not bound a single supported near-limit row**, and that alone is sufficient
to breach the 96 MiB ceiling on this host. This is a finding about the limit constants and the `position = 1` escape,
not about the valid-account paging path, which stayed comfortably inside every ceiling.

## Verdict

| scope | verdict |
|---|---|
| rows-v3 on the complete valid cross-record account — 1 sequential + 2 overlapping complete attempts | **PASS** on this workload and host: all five ceilings held, all attempts reached a signed terminal finish, byte identity confirmed against an independent D1 read |
| rows-v3 on the generic near-row/key-limit probe | **FAIL** — 175,669,412 B (isolation control 127,399,301 B) against the 96 MiB ceiling |
| wrapper verdict as run | **FAIL** — one `OBSERVED_ALLOCATION_CEILING` violation, preserved |
| old profile (`/reconcile`) | **not re-qualified here.** Only the extra-byte `413` control was asserted. The five recorded old-profile FAILs in `RESOURCE-LIMITS.md` stand; nothing here is relabelled as an old-route PASS |

A rows-v3 server PASS does not establish client memory, complete staged-profile validation, atomic activation,
current permission, phone fit or private recovery.

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
* Three runs are not a peak distribution.

## One concrete next action

**Root reproduces the `--only-near-limit` isolation control on the deployment-representative host, and rules on the
limit constants** — whether `P.LIMITS.row` (2,000,000) should be brought toward the 262,144-byte per-chunk budget, or
the `position = 1` single-row escape separately bounded. The valid-account PASS above cannot be adopted into the R1
replacement-route cut while one supported row can breach the ceiling on its own. **No product edit was made here and
none should be made before that ruling.**

## Scope and process notes

Exclusive new files, all under `rebuild/m3/w5/test/rows-resource-01/`: `rows-resource.cjs`, `rows-resource.test.cjs`,
`EVIDENCE.json`, `REPORT.md` (plus the pre-committed `BRIEF.md`). No merge, deploy, provider/account/settings change,
paid overage or additional agent. No private gate was run and **no whole-repository acceptance is claimed.** Nothing
under `ledger/`, no private fixture, credential, signing secret or personal data was read or transmitted; all signing
and identity keys were generated locally per run, held only in memory, and no key material appears in any output.
Independent review of this output must be performed by someone else.
