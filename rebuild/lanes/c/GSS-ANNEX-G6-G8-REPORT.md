# GSS G6-G8 bounded evidence report

Status: VALID PRODUCT RED. G7 and G8 pass their bounded rows; G6 is not accepted.

## Composition and ownership
- Base: `b5d1b4af175a8f100de0a21c47365153225ae68b`.
- Accepted G5 repair `588c84082753696facc902890047c190c49f7318` is composed unchanged.
- Branch: `rebuild/c-gss-g6-g8-proof`; executed correction head: `b09398eba9cf66f156dbf8212b299c67bc938cc8`.
- Authored files only: this report and `gss-annex-g6-g8.test.mjs`; no product file changed.

## Safe graph and setup
- Imports/setup match accepted G4/G5: current public hosts/models/mount, `faultDatabase`,
  JSDOM, WebCrypto, `TodayModel`, and `design`.
- Novel effects: existing fault mode, public settings `latest`, actual DOM controls/callbacks,
  and reopened encrypted full `ops`/`outbox` maps.
- Protected seed, migrate, merge, index, and oracle-shim files were not opened or traversed.
- Owned working bytes matched committed LF blobs before execution.
- Node: pinned `v24.19.0`; `MEASURED_TEST_NOW=2026-09-03`; `TZ=America/New_York`.
- Existing dependencies were exposed by local ignored junctions; nothing was installed or written there.

## Commands and process evidence
- Full: `node --test-concurrency=1 --test rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs`.
- Full PID `62048`, exit `1`: 3 tests, 1 pass, 2 fail, 0 skipped.
- Mechanical G7 correction moved its post-repaint hold before preparation so quota actually executes.
- G7-only: same file with `--test-name-pattern=D-GSS-G7`.
- G7 PID `58516`, exit `0`: 1 test, 1 pass, 0 fail, 0 skipped.
- Earlier PIDs `58168`, `61136`, `54856` exited during dependency loading before any row ran.

## Outcomes
- G6 RED: after actual acknowledged set plus settings add/edit repaint, the current screen did
  not become Saved. It failed `GSS-G6-SAVED-SCREEN` before the row-loss plant oracle.
- Therefore G6 after-commit positive, row-loss plant verdict, and separate precommit case are
  explicitly unreached; no G6 proof is claimed.
- G7 PASS on corrected head: held actual quota result, quota armed after repaint, and no-fault
  pre-prepare control all retained entry/effort/rows and matched current code/write/callback facts.
- G7 error plant failed the intended `GSS-G7-CURRENT-ERROR` assertion inside the passing row.
- G8 PASS on the full run: actual settings result stayed pending across real Log and Back;
  ownership/destination, exact +1 set, zero settings write, and zero stale callback held.
- G8 destination plant failed its intended assertion inside the passing row.

## Immutable evidence
- Proof SHA-256: `d781069dcb0921e62d132116b0c199fb7b0dc2665682d91c5e626c38a4c3080b`.
- Full stdout: `%TEMP%/earned-gss-g6-g8-c6de54d-run4.stdout.log`, SHA-256
  `8151de75402f73334cdb39c0e6badad5aa5579d6a25f9bb978bd81a861171e6d`.
- G7 stdout: `%TEMP%/earned-gss-g6-g8-b09398e-g7.stdout.log`, SHA-256
  `97c8283a2b6859774423c11e6c18b2c1c0493c1aced254342288c4b3a845a83c`.
- Both stderr files are empty, SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- Runtime slot was released immediately after PID `58516` terminated. No broader test ran.