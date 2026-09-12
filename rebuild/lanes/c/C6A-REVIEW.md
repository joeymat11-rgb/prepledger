# C6A-REVIEW - C6 Part A, onboarding text rehearsal: INDEPENDENT REVIEW (round 1)

Independent reviewer, did not write the candidate, told to disagree and execute. Head `6058dbd`, base `8e558ce`
(`rebuild/lane-c-a4b`). Bar: `BRIEF-C6-VOICE-ONBOARDING.md` Part A, A1-A14 + C1-C10. Evidence and every executed
command: `C6A-REVIEW-ANNEX.md`.

## VERDICT: ACCEPT WITH CONDITIONS
The central claim is TRUE and I proved it with my own code: my own tap driver, my own voice driver over raw
`dispatch`, my own comparison. All six completing fixtures are byte-equal on `JSON.stringify(payload)` and on the
read-back document, `validate()` true for both envelopes. On the real durable path I ran **all six** (the lane's test
runs two) through two `createSetupHost` installations each: stored bytes identical every time, one row each, second
save refused `SETUP_ALREADY_RECORDED`; the blocked two refuse on both paths with the same gap codes, zero ops.
Closedness holds against twelve unknown names including `__proto__`, `constructor` and `hasOwnProperty`; no write path
to `sets`/`hi`/day kind exists (the only general setter is bounded by a literal `["first","inc","rungs"]` loop) and
seven smuggles left `sets=3`, `hi=10` and day kinds untouched. All four conditions below are test-quality, not
behaviour, and none blocks a merge.
- **C1 NON-BLOCKING** - the brief's own mutant C1 SURVIVES in faithful form (hand-built payload, key order preserved:
suite fully green), so A1 proves byte equality, not producer identity; `setupOf`/`tagsOf` are a no-op on `document()`
output and nothing observes that `prepare` was called. *Fix:* a counting spy on `commands.prepare`, asserted called
once per `submit`.
- **C2 NON-BLOCKING** - A2 durable runs `COMPLETE.slice(0, 2)`; brief 2.3 step 4 says "for each of at least six". I
ran all six and all six pass. *Fix:* drop the slice.
- **C3 NON-BLOCKING** - A2 equality is still two separate stringifies (`setup`, then `tags`), the shape the builder's
own C2 finding removed from A1, though a combined `storedPayload` helper already exists.
- **C4 NON-BLOCKING** - two report figures: "C1-C10 10/10 KILLED" should say C1 dies only in its clumsy form, and "145
= 64 + 81" should be 65 + 80 (A10 took `no-dashes` from 6 to 7).

## Counts, custody, mutants
`git diff 8e558ce..6058dbd -- rebuild/m3 rebuild/engine rebuild/client rebuild/m4 rebuild/conform .github` is
**empty**; all 12 changed files sit under `rebuild/coach/**` or `rebuild/lanes/c/C6*`. Coach **145/145** (traceability
16, tiers 13, local-era 9, cost-cap 12, charter 8, no-dashes 7, onboarding-tools 41, parity 26, closed-list 13);
floors 41>=30, 26>=18, 13>=10 met. setup 150/150, w6 552/552, `build.mjs` PASS, annex file table **8/8** sha256 + line
counts. Mine: 6/6 payload bytes, 2/2 blocked, 6/6 durable, A9 78 turns 0 untraceable, 0 dashes, no
network/key/dependency; A6 six tier-1 tools refuse unconfirmed, A7 `unknown:true` with first/inc/rungs supplied wrote
nothing and `missing()` names it, A8 nine tier-3 topics refuse with state byte-unchanged. **`--ci` PASSES and the
builder's diagnosis is wrong**: not "a false FAIL under load" but a cold worktree - the FIRST run fails
deterministically while the harness materialises `test-support/import-engine/**`; runs 2, 3 and 4 all reach `PUBLIC CI
EVIDENCE PASS`. A `rebuild/m4` hermeticity issue outside C6's custody, worth a REQUESTS line. **Mutants 13 run, 12
killed, 1 survived**: C2-C10 killed (fail 6, 3, 5, 2, 7, 3, 1, 1, 1); three of mine killed - `submit` skipping the
`document()` completeness re-read (3), a catalogue id not in the catalogue accepted (1), tags written without the
setup document (19). C1 survived, above. Both modules restored byte-identical by sha256, tree clean, 145/145 on the
restored tree.

## The override judgment
**The builder's reading is right: an override is the standard STEP, never a day kind. Not a defect, no brief amendment
needed.** `DECISIONS:129 (3)` says "the athlete may override any day"; `:134` makes the six screens the live
transcript, correctable by tap at any moment, "I'll tap instead" losing nothing, so the override right is intact,
exercised by tap. The voice list is a deliberate strict subset: C6 "is not a second way to build a week", and a day
kind is not one of the six questions but Earned's derived output, which `:89` says the coach reads back and never
authors. The reconciliation is in the product: the `day_kind` tier-3 sentence ends "Changing one is a tap on that
day", naming the surface that works. The same line licenses `inc`, an answer field on screen 4: the coach writes
exactly the screens' answer fields, and `sets`, `hi` and the day kind have none.

## Residuals
Base is A4b `8e558ce`, not the tip (disclosed), so C6A cannot merge before A4b and must be re-run at its merge sha.
`setupOnLocalEra: false`: `setup-host.mjs` mints its own installation, the shape C5's check-in lane disclosed.
`driveByTap` is a hand-written mirror of the screens' setters, not their event handlers: fair, but a mistake shared
with a tool body would pass parity, and Part C's V1 closes it. Coach suites still not in `rebuild.yml` (`.github`
untouched). No model, voice, relay or cap on any account.
