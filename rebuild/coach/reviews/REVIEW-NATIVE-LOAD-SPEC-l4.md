# CLAUDE REVIEW: NATIVE-LOAD-SPEC R8 (governor event, D7b rule), round 4
Reviewer: Claude (claude-fable-5-1); reviewer of spec l1-l3, cells l1-l3, build l1-l2. Spec uncommitted in earned-astra-96, sha256
297bf999...2fcfd VERIFIED; git diff --numstat vs 6ddf7af = 13/8, exactly :91-93, :97, :135, :155-156, :196, :222, :266-267, :296-297,
every changed line read. Nothing modified. One probe run under the runtime lock on the c76670e scratch copy (five deleted).

## VERDICT: ACCEPT (one note, no debt)

## 'governor' event (:92, :135)
Minimal: a third event on the existing forwarder, decision=null, authority=null, spent=[], completion=null, anything else RECORD_INVALID;
  replays step 6's ONE internal function; returns state equal to input except each replayed lift's holdFlag; effect null; applied or
  unchanged by whether a flag moved. No new export, so N20's by-name absence check stands (:97 amended to say so).
I1-I7 hold: no load authorized (I1); no issuance needed (I2); w/wSets/captures untouched and capture already reads holdFlag through
  engine-capture.cjs:61 (I3); derived at every projection, never stored (I4); one canonical replay, tokens and rirHist stay inside (I5);
  legacy seed is the admitted base value (I6); both runtimes reach it through the same forwarder (I7). The case against an Evaluation
  member is sound: the fold sits outside E and would otherwise need a per-completion check to get a per-lift flag.
Seed: :135 seeds from the immutable base and runs once per projection before registration; FC08 always reloads the immutable base (I4),
  so a projection never sees its own output. I tested the worse case anyway, re-projecting FROM the projected flag with rirHist untouched
  (n23-probe.cjs, moved updateOpenerHold on the public writers factory): openers [0,0], [0,0,1], [0,null], [null,0], [1], [2] under
  legacy seeds {false,[]} and {true,[0,0]} give the same flag on the second replay every time, so the evaluator's own step-6 seed, which
  now reads the projected flag, converges too. NOTE (no debt): :135 could say so in one clause, so a builder does not fear a double replay.

## N23 (:266, :296), executed where feasible
Scratch replay on the public factories: openers 0,0 -> holdFlag true; +C3 opener exact 1 -> false (writers.cjs:236), equal to the seed so
  'unchanged' is right; C2 unknown -> false, 'unchanged'; a bound opener after two zeros releases (>=1 by coercion). Card effect: my build-l2
  b7-probe measured rirPlan [0] unprojected vs [2] projected for a one-set lift and [2,1,0] either way for three sets, so sets:1 and the
  expected [2] are the right, and only, observable case. "Evaluation keys stay five" and "rirHist unchanged" follow from :91-92. Correct.

## D7b (:156, :196) and N24 (:267, :297)
The rule is the one I proposed in build l2, tightened: base w/wSets/technique differs from the accepted effect's recorded base and no
  authenticated plan op orders the change (no causal ancestry, no same-source order) -> EFFECT_CONFLICT for THAT lift only, refs = the
  accept's response_refs, field 'load_basis'; neither applied nor dropped; spend and facts kept; other lifts project; identical under
  every revision and delivery order. Compensation stays reachable (dispatched before the refusal, as :153) and is retire-only, no w/wSets
  write, because the prior image is not provably current: better than my "restore" wording. A later authenticated plan choice also
  resolves it. N24's fixture (N02c accepted, base re-admitted at 102.5, no op, both orders, R1/R2) and outputs (conflict for fx-press
  only, Q neither landed nor dropped, compensation retires Q, w stays 102.5, conflict cleared) follow the rule exactly.

## Contradictions looked for: none
:91 "never carries holdFlag" agrees with :135; :92 accept/close unchanged; :97 names the exception; :198 "Changed working-weight ->
  PLAN_CHANGED" still governs the PROVEN plan-op case and :196 adds only the unprovable one; :153 ordering reused; FC12 range N01-N24
  at :222. Not done: no build byte exists for the event yet; N23's host/registrar path is the builder's to prove.
