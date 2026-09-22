# GSS G6 repair and G7 completion report

Status: AUTHOR GREEN, INDEPENDENT REVIEW OWED. No package or final acceptance claim.

## Custody and scope
- Branch: `rebuild/c-gss-g6-g8-proof`.
- Immutable strengthened red proof: `bb21732538decf5bb2a47965edc2db0085e8cf10`.
- Repair head: `bd16baf4a98c5444361550039149adb4db0c03bb`.
- Product change: `rebuild/m3/w7-preview/today/gym-settings-lane.mjs` only.
- Proof: `rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs`.
- `gym-app.mjs`, model, host, stores, engine, schema, packages, and guards are unchanged.
- Fixed runtime: Node v24.19.0, `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`.

## Strengthened red
- G6 now runs the unplanted after-commit positive before its row-loss plant.
- G7 retains its three existing modes and adds distinct no-fault before-commit.
- PID `19796`, exact G6/G7 rows: 1 pass, 1 fail, 0 skip, exit 1.
- G7 all four modes passed; unplanted G6 failed `GSS-G6-SAVED-SCREEN`.
- Its acknowledged exact set/outbox already existed; Saved/Undo/callback were absent.
- This red head is the repair-removal witness: it has the same proof without the handoff.

## Repair mechanism
- Exact-context delivery remains the primary path.
- A successful pending Log may hand off only to the current connected Log binding when the
  same live mount, editor token, workout start, and lift remain and only the set slot advanced.
- Retired mount, changed editor/workout/lift, refusal, unchanged slot, disconnected control,
  and non-Log actions cannot use the handoff.
- The real model result drives Saved; no result, acknowledgement, or callback is fabricated.

## Focused outcomes
- PID `43208`, G6/G7: 2 pass, 0 fail, 0 skip, exit 0.
- G6 after-commit positive and planted repeat both acknowledged exactly one real set; Saved,
  Undo, one callback, cleared performed entry/effort, and both settings rows passed.
- G6 before-commit retained rows/current typed outcome and matched its write/callback branch;
  the runner output did not separately print success versus `WORKOUT_RESUME_REQUIRED`.
- G7 held quota and post-repaint quota returned `TRANSACTION_WRITE_FAILED`, retaining
  entry/effort/rows/current code with zero write/callback.
- Both G7 no-fault seams completed and matched typed outcome to full-map/callback facts;
  the runner output did not separately print their success/refusal branches.
- PID `60304`, existing G4/G5 plus foreign workout/lift carry: 3/3, exit 0.
- PID `42244`, G8 navigation because the repair reads mount ownership: 1/1, exit 0.
- All focused runs had zero skips; no broader suite ran.

## Evidence
- Proof SHA-256: `e2bd176f1a6a42bf1594b55eec152757d53132b74b155892b361200a9588b171`.
- Lane SHA-256: `c162a0badd47aaf38db30804499a98f19c727683f11a5ee774fcc1d4878f5289`.
- Red stdout SHA-256: `e391f48bcaac54904dc8deb75d3ef1e214516ecd5b2307b2c21f51a2da9ae1ef`.
- G6/G7 stdout SHA-256: `06e56165f830986cd06973ae9a952980a22b561e6a39c6b08d2ae717d8142d84`.
- G4/G5 stdout SHA-256: `a459e870358c8de0cbcd5d2eb152b34813eabf476d3bc1b56ca0a52f37472f6e`.
- G8 stdout SHA-256: `c8ae8a3abace7a6188808aebdbfc633974e11b56e67447eb3792e6d4283edc61`.
- All four stderr logs were empty; runtime was released before this report.
- Claude review, full CI, integration, and reseal remain owed.
