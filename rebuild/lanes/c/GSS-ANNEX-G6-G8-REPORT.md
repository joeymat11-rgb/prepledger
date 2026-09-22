# GSS G6-G8 proof harness candidate

Status: STATIC ONLY, UNEXECUTED. This report makes no proof or CI claim.

## Base and ownership
- Immutable base: `b5d1b4af175a8f100de0a21c47365153225ae68b`.
- Branch: `rebuild/c-gss-g6-g8-proof`.
- Owned additions only: this report and `rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs`.
- Accepted G5 repair `588c84082753696facc902890047c190c49f7318` is composed as `6e4731b`; it is not authored here.
- No product, engine, model, store, guard, existing test, package, or workflow file changed.

## Static graph preflight
- Harness imports the already-proven public stack: `faultDatabase`, `createGymHost`,
  `createGymModel`, `mountGym`, `createMachineSettingsHost`, `TodayModel`, and `design`.
- `mountGym` composes `gym-settings-lane.mjs` and `machine-settings-view.mjs`.
- The lane imports only the public machine-settings command surface.
- The workout/settings hosts share one real encrypted synthetic repository and full maps.
- `today-model.cjs` reaches `today-engine.cjs`, whose import graph then reaches the prohibited
  engine writer boundary. Inspection stopped at that import; no prohibited engine file was read.
- `today-bindings.mjs` also reaches the public client/local era graph; no prohibited source was read.
- All waits are bounded. Reopen reads compare full `ops` and `outbox` maps.

## Candidate proof rows
- G6 holds the actual set result before delivery, adds a settings row, edits both rows through
  repaint, then requires Saved, Undo, one callback, exact submitted set bytes, and exact +1 op/outbox.
- G6 separately holds before commit. It accepts only the actual typed success or the named
  `WORKOUT_RESUME_REQUIRED` refusal and matches persistence/callback assertions to that result.
- G7 first obtains the real quota envelope (`TRANSACTION_WRITE_FAILED`), holds its delivery,
  adds/edits a row through repaint, then requires the current error and no write/callback.
- G7 separately arms quota only after the repaint, plus a no-fault precommit control whose
  persistence expectation follows its actual typed outcome rather than assuming success.
- G8 keeps the optional settings read pending, obtains a real acknowledged set, presses Back,
  releases both operations, and requires retired ownership, intact destination, exact +1 set,
  zero settings write, and zero stale callback.
- Each row includes a targeted negative plant executed after its named seam is reached.

## Narrow runtime plan after composition grant
1. Confirm the composed accepted G5 repair and this harness are the exact runtime head.
2. Run only `node --test rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs`.
3. Require 3 tests, 0 failures, 0 skips; record PID, command, exit, head, and file hashes.
4. If red, report the exact seam/outcome. Do not change product under this proof ownership.
5. Independent review must confirm the plants fail for the intended assertion.

## Current uncertainty
- Runtime is intentionally deferred pending PM grant on the composed static head.
- Static inspection predicts the held quota delivery may expose a detached-root error repaint;
  only the bounded run can decide it, and this branch does not repair that mechanism.
