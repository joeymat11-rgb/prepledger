# P4a / P6: reason on disk (round 3)

Ticket P4a-P6 r3, closing REVIEW-P4a-P6-R2.md REJECT (8cda2cc). Base
origin/rebuild/t2-client-core @ 7b7400a4 (tip, post-rebase). Branch
rebuild/polish-p6. Author only, Sonnet medium.

## Round 3 dispositions

- BLOCKING 1 (registration test self-pin RED): that test is not pinned; its
  `current`/`command`/blob-count literals now include the 17 rebuild/client
  files (15 product + 2 fixtures) the workflow materializes, matching
  shared-preflight.yml. 67/67, every mutation and real-checkout cell included.
- BLOCKING 2 (cross-build cell needs full git history): no more `git show
  <old sha>`. Pre-P6 index.cjs/copy.cjs are frozen fixtures under
  `rebuild/client/test/fixtures/`, so the suite is hermetic and runs inside
  shared-preflight's single-commit checkout. Also removes the fragile
  `BASE_SHA` literal (MINOR 6, second half).
- MAJOR 3 (b-package.cjs claim false): confirmed - `packages/S4.json` lives
  at `rebuild/lanes/b/tooling/packages/S4.json`, not repo-root. `b-package.cjs
  --ci --package S4` runs clean: SEAL BASE ON THE TIP, 0 unlisted drift,
  PUBLIC CI EVIDENCE PASS, EXIT=0. Corrected below, not deleted: M2's actual
  conclusion (S4/S3 name neither rebuild/client nor the workflow) still holds.
  M3 follow-on (ticket P6-COACH-WIRE): rebuild/coach/tools.cjs:846 consent.respond(id, "accept") must pass the issuance, and recordIssuance({producer, revision}) at :852 must run BEFORE respond so revision/source/moment are digest-bound in production.
- MAJOR 4 (B2 mutant survives): added a cell where the store has NEVER
  recorded an issuance anywhere (only a pre-P6 plain accept); asserts
  notRecordedBefore is null and recordDate is the record's own date. The r1
  mutant (`return earliest || "2026-09-15"`) now fails this cell (checked by
  hand: mutant applied, cell reds; reverted, 18/18 green).
- MINOR 5 (report numbers): corrected below (W6 586, today 645, base sha).
- MINOR 6 (length / U+2014 / BASE_SHA): dash replaced with ASCII hyphen; file trimmed to the line bar; BASE_SHA removed (see BLOCKING 2).

## Bar cells
`rebuild/client/test/reason-on-disk.test.cjs`, 18/18 PASS: round 2's 17 cells
plus the no-issuance-anywhere B2 mutant-killer.

## Suite tails
```
reason-on-disk.test.cjs: pass 18 / fail 0 . rig187 => PASS
rebuild/coach --test: pass 218 / fail 0
rebuild/m3/w6 --test: pass 586 / fail 0
today 13-by-name (MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York): 645/645
shared-preflight-ci-registration + preflight: pass 67 / fail 0
b-package.cjs --ci --package S4: EXIT=0, SEAL BASE ON THE TIP, 0 unlisted
  drift, PUBLIC CI EVIDENCE PASS
A1 build: PASS (114 pinned inputs, earned-66d505d36b84)
A5 build: PASS (13 files, earned-slice-2467b0d6b6fddc0e42a352f3f59aeb13)
```

## S4/S3 product-map correction (was "Impossible as written")
`b-package.cjs --ci --package S4` is not impossible; it runs (tails above)
because its packages dir is `rebuild/lanes/b/tooling/packages/`, not
repo-root `packages/`. It still names neither rebuild/client nor
shared-preflight.yml, so it is not a CI home for this ticket either.
shared-preflight.yml remains that home, now closed against BLOCKING 1/2.

## Files touched (round 3, on top of round 2)
`rebuild/client/test/reason-on-disk.test.cjs`, new `test/fixtures/
base-index.cjs` + `base-copy.cjs`, `.github/workflows/shared-preflight.yml`,
`rebuild/lanes/tooling/test/shared-preflight-ci-registration.test.cjs`, this
file. Nothing under `rebuild/coach/**`, `rebuild/engine/**` or any pinned path.
