# P4a / P6: reason on disk (round 2)

Ticket P4a-P6 r2, closing REVIEW-P4a-P6.md REJECT. Base origin/rebuild/t2-client-core @
d3d2a16 (BASE_SHA). Branch rebuild/polish-p6. Author only, Sonnet medium.

## Findings closed

- B1 (BLOCKING): `respond(id, answer, issuance)` now recomputes
  `prop-sha256("earned/coach/proposal/v1"+JSON.stringify({producer,body,reason}))` (the exact
  digest `rebuild/coach/tools.cjs:770` derives) from the supplied issuance and refuses the
  whole write unless it equals `id`, and unless producer/revision agree with whatever this
  device already registered via `recordIssuance()` for that id. `node:crypto` is unavailable
  in the browser bundle, so the digest uses a dependency-free SHA-256 in `index.cjs`,
  verified byte-for-byte against `node:crypto` for empty/ascii/unicode/long inputs.
- B2 (BLOCKING): no constant date. `reasonFor()` derives "not recorded before <date>" from
  this store's own earliest issuance-bearing record's `moment`; a record older than that
  cutover gets `notRecordedBefore`, a record not older gets its own `recordDate` instead.
- M1: a later plain two-arg accept of the same id cannot erase a recorded reason —
  `reasonFor()` prefers the latest record (by device_seq) that actually carries an issuance.
- M2 (CI home): `packages/S4.json` does not exist; `packages/S3.json`'s product map does not
  list `rebuild/client/**` or `shared-preflight.yml`. Wired: `.github/workflows/
  shared-preflight.yml` (not pinned, not owned by S3) now materializes the 15
  `rebuild/client/**` files and runs `reason-on-disk.test.cjs` in its `regressions` step.
- M3: not wired. Follow-on call site: `rebuild/coach/tools.cjs:846`,
  `const answered = consent.respond(id, "accept");` needs a 3rd arg built from `record`.
- MINOR: a BigInt body refuses (state 3), no throw. Red-first replay is real cross-build
  parity: extracts `index.cjs`/`copy.cjs` at BASE_SHA via `git show` (confirmed by `git diff
  BASE_SHA --stat` that no other `rebuild/client` file moved) into a throwaway copy, runs a
  forged-issuance scenario in a fresh child process, asserts the REVERTED product accepts it.

## Bar cells (all in `rebuild/client/test/reason-on-disk.test.cjs`, 17/17 PASS)
1. B1 x4 (model-authored / one-number-changed / swapped-reason / disagreeing-revision all
   refused, byte-identical) + "the engine's own issuance ... byte-for-byte".
2. "bar-2: a pre-P6-shaped op log replays to a byte-identical projection across a real
   restart" (red-first) + both B2 cells (far-future cutover, post-cutover record).
3. "the engine's own issuance is accepted and read back byte-for-byte" (reasonFor read API).
4. "an issuance travels only with an accept; a decline ... refuses ... byte-identical" (no-yes).
5. rig187 PASS; suites below.

## Suite tails
```
reason-on-disk.test.cjs: pass 17 / fail 0
rig187 => PASS
rebuild/coach --test: pass 218 / fail 0
rebuild/m3/w6 --test: pass 552 / fail 0
today 13-by-name (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York): pass 321 / fail 0
A1 build: PASS (3 assets, build earned-d6dcd5e47bcd)
A5 build: PASS (13 files, cache earned-slice-41f5b2a9a0f7eb5286c815f79a6376bd)
```

## Impossible as written
`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S4`: refused by the runner itself
("USAGE REFUSED; exactly ... B-NTC|H3|S3|B1|B2|B4|B3|B-LOM") -- no S4 package is registered
and no `packages/S4.json` exists; `rebuild/lanes/b/tooling/**` is pinned, so it cannot be
added here. `--package S3` is not a substitute either (S3's product map excludes
`rebuild/client`), so this bar item is not executable against this ticket's custody as named.

## Files touched
`rebuild/client/index.cjs`, `copy.cjs`, `README.md`, `test/reason-on-disk.test.cjs`,
`.github/workflows/shared-preflight.yml`, `rebuild/slice/P6-REPORT.md`. Nothing under
`rebuild/coach/**`, `rebuild/engine/**` or any pinned path.
