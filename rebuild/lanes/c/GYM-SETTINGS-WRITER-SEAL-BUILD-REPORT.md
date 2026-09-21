# Gym settings writer seal build report

Builder: Sol
Base: b35a48e35a1f3e3c278c377934794a32b632535b
Authority: accepted specification at 6fe4d12c; no acceptance claimed here

## Baseline anchors

- All six existing owned paths equal c38ed5fb byte for byte.
- Versus e08bc11c, only writer-fence differs: +216/-1, 2123 lines.
- gym-app anchors: 99, 108, 133-139, 171, 217-288, 353, 386-480, 511-550.
- lane anchors: 32, 34-100; view helper/comment move: 36-58 including blank.
- UI test anchors: 81-120, 390-413, 455-581, 599-630, 765-784, 901.
- gym test drive anchors: 499, 505, 506.
- fence anchors: 202-210, 882-899, 958-989, 1388 onward,
  1755-1789 and 1821-1911.
- Counts: gym sites 6; direct listeners 19; interface freezes 3;
  static lane imports 0; dynamic host edge 1; painter entries 1.
- No substantive paper disagreement; named line drift is already accounted for.

## Red checkpoint

- Run: gss-red-b35a48e3, exact accepted base with test changes only.
- gym.test: 65/65 baseline green.
- machine-settings-ui: 54 pass, 6 intended GSS failures; all prior rows pass.
- writer-fence: 405 pass, 4 intended GSS failures; all prior rows pass.
- The static after-read/after-start defect-plant row passes by landing both plants.
- machine-settings-ui syntax check passes.
- Logs: %TEMP%/gss-red-b35a48e3/*.log.
- Required 17 groups and every specified defect plant remain in final scope.

## Implementation accounting

- M: pending.
- R: pending.
- N: pending.

## Verification

- Red proof used the required Node/env serially; no full Today step ran.
- Final proof will name focused cells, D2 annex cells, mutants and retained scratch.
