# GSS neutral repaint repair report

Status: AUTHOR GREEN; FINAL DATA-PATH CLAUDE REVIEW, CI, AND RESEAL OWED.

## Custody
- Branch: `rebuild/c-gss-g6-g8-proof`.
- Prior accepted candidate: `79d981a7cf96d65a7a125c680c7a9df05aca7fc1`.
- Original neutral-repaint red: `395bd581bc67e547909fc60bf6444e72d1523659`.
- Corrected immutable red: `669b467da215b57fa39076dca1f9daf78ec09ffd`.
- Corrected proof: `rebuild/m3/w7-preview/today/test/gss-annex-g6-g8.test.mjs`.
- Sole product change: `rebuild/m3/w7-preview/today/gym-settings-lane.mjs`.
- Node v24.19.0; `MEASURED_TEST_NOW=2026-09-03`; `TZ=America/New_York`.

## Red and oracle correction
- PID `45220`, unchanged parent lane: both neutral rows failed `GSS-G6-NEUTRAL-SAVED-SCREEN`.
- Before failing, both passively observed same-workout/lift advanced-slot mount reads and a replacement connected Log.
- Both also proved the exact submitted payload/identity, unchanged prior reopened maps, and one linked set/outbox write.
- The first repaired run, PID `47296`, reached Saved/Undo/Next but found prescribed next load `40`, not blank.
- Unchanged `gym-app.mjs` lines 388-389 correctly use next `view.entry` defaults when shared draft fields are null.
- The corrected proof derives exact next defaults from a new post-Next mount read, converts null to blank,
  requires load and reps each differ from submitted `45`/`11`, and compares the DOM exactly.
- Shared draft load/reps null, effort null, no pressed effort, Saved/Undo, one callback, and full maps remain required.

## Repair
- `continuedLogBinding` no longer requires a captured/current settings editor or equal editor tokens.
- It still requires successful Log result, live busy mount, captured/current active views, exact workout/lift,
  changed slot, and the current registered, non-revoked, connected Log control with exact live context.
- Refusals, retired mounts, foreign workout/lift, unchanged slot, stale/disconnected controls, and other actions remain barred.
- The comment now describes neutral repaint and current workout/lift instead of an editor-only settings-row case.

## Focused results
- PID `64136`, corrected neutral rows: 2 pass, 0 fail, 0 skip, exit 0.
- Their typed real results were successful; Saved/Undo, one callback, cleared performed draft, exact next defaults,
  no pressed effort, exact payload/op/outbox identity, and full reopened maps passed in both variants.
- PID `60188`, original G6/G7/G8: 3 pass, 0 fail, 0 skip, exit 0.
- PID `57576`, affected G4/G5 including foreign workout/lift carry: 3 pass, 0 fail, 0 skip, exit 0.
- PID `10744`, exact-parent removal: both neutral rows reproduced missing Saved, 0 pass, 2 fail, 0 skip, exit 1.
- No broader suite, CI, protected/private path, engine, schema, host, store, or second product file ran or changed.

## Evidence
- Proof SHA-256: `83f4c1db2e7e0216345e5f7478e88f2e5476dd941368ca67b2fd3877052b4a2c`.
- Lane SHA-256: `1de11798fff62eb5d4eba07798050db91ca1d2b5fa18dbd131bdff2f20d1ae6a`.
- Corrected red stdout: `3fa3757337d206c989dcd99b286a655c7b2dd8c4b19fc97d9fcd1d5cf5b36018`.
- Corrected green stdout: `918270991c9dcea3c708ff41655325f5a8ec293fa6a9271a99f7aeacdde97a38`.
- G6/G7/G8 stdout: `fde1d8689d161726ef58f87772456078aa40c2babd5b9d2e6235553738b0198a`.
- G4/G5 stdout: `9b02f8604c5b3984ff0056dd1e172deaf97c309f40969f436e001aa1f63602df`.
- Removal stdout: `7981d85b40b3c1c040a33362d3b9de533f83ef91b73d2595aa8de5e4f5a239ad`.
- Every stderr log was empty (`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`).
- Runtime was released immediately after the removal process terminated.