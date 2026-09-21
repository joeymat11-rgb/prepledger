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

- M: exact 23-line helper/comment span moved view -> lane; accepted-source SHA256
  824e9dba46a288110190b4bac497e53484a955f86ce2fa158655d86f13dd33ff.
- R: producer/helper import/export custody, constructor/API/listener/action calls,
  six exact paint returns, and fence anchors/counts.
- N: sealed lifecycle, detached reads, editor identity, depth-zero binders,
  pending serialization, typed outcomes, and their regression rows.
- Baseline -> candidate equalities: gym raw sites 6 -> 1 Start exception;
  direct card listeners 19 -> 0; interface tables 3 -> 4; static lane imports
  0 -> 1; dynamic host edge 1 -> 1; painter entries 1 -> 1.
- Fence denominator 409 -> 401: nine obsolete facade.lane subtests removed
  (three spellings x RED repetition/GREEN unrelated/GREEN reformat), replaced
  by one API token-shape row with four independent leak plants. Net -8.

## Verification

- Red proof used the required Node/env serially; no full Today step ran.
- First unaccepted candidate run: gss-candidate-b35a48e3.
- gym.test 65/65; machine-settings-ui 59/60; writer-fence 394/401.
- The eight failures were one stale producer-owner expectation and seven fence
  anchor/count defects: binding collision, two missed plants, stale custody hash,
  API multiplicity, after-read anchor and a function-definition paint match.
- Static reconciliation now uses measured exact anchors/counts; diff-check passes.
- Product correctness is not inferred from assertion reconciliation.
- Still required: exact-head focused rerun, all 17 groups and clause mutants,
  real operation/outbox/reopen parity, and all 13 D2 cells plus 2 supports.
- Status: UNACCEPTED author checkpoint; independent review remains mandatory.
