# B1+B2 synthetic helper: one code-only interface inspection

2026-09-13, Astra PM under214/216. The permitted synthetic evidence helper initially omitted E.exById, an executable interface supplied by the real seed factory. B reported that missing dependency and stopped affected execution credit without reading seed.cjs. Earlier incomplete-helper setup failures, including possibly swallowed lookup errors, are not frozen behavioral failures, mutant kills or D23 proof.

PM granted B alone one narrow static inspection of exact M100820aa47a4f8729642033499eaec0f0ee282e1:rebuild/engine/seed.cjs: the exById signature/body and name-only keys of the returned export object. This is the sole explicit exception to216's seed-path prohibition. No module/factory import, require, eval or invocation; no raw seed copy/output or SEED/HISTORY/default/preset/athlete values; no unrelated body. The extractor must refuse ambiguity and stop without printing data if the requested body itself contains private literals or calls an uninspected helper.

B reported a syntax-aware AST extraction at M. Its first form safely refused an arrow-variable binding; the bounded binding-aware extractor returned exactly this non-data contract:

```js
const exById = (s, id) => s.exercises.find((e) => e.id === id);
```

Only Array.find and its strict-identity callback occur; no embedded athlete/default values or other helper call. B also obtained export names only, never their values. No raw source or private gate output was requested by PM. This completes the specific interface inspection, not a general seed read licence.

The already licensed helper may reproduce this exact behavior, preserving original input errors and undefined for an absent ID. Do not add coercion, fallback selection, empty-data substitution or stubs for the real downstream consumers. Other seed exports remain uninspected; a further executable dependency requires its own named scope request.

Re-establish affected frozen/current/candidate controls after assembly completion, then diagnose any remaining D23 behavioral result separately. Preserve first extractor refusal and initial incomplete-harness outcomes in the evidence chronology; none counts as an assertion-killed product defect. The full public closure, source/assembly boundaries, same explicit synthetic fixture and successor pins required by216 still apply. No private/FULL/seal run, production-seed equivalence, runtime-source expansion or integration is granted.
