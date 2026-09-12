# A4B REPORT

Branch `rebuild/lane-c-a4b`, base `origin/rebuild/t2-client-core` @ aa06544 (the
B-NTC merge is in). Rounds 1-4 all ACCEPT (e67fde6, bb2640c, 8e558ce - the owner
look `:133` - and 5ba2419). Detail and evidence: `A4B-REPORT-ANNEX.md`.

## RE-PIN ONTO THE B-NTC MERGE (DECISIONS:144)

Rebase onto the tip took NO conflict, and `today-bindings.mjs` is reverted anyway
- see below - so lane B's H6 wiring is the tip's, byte for byte. `rebuild.yml` and
`rebuild/m4/**` untouched; build pins **103**, A0 host **32**. Six mutants on the moved code, killed and restored.

**Tags handling moved off the pinned file.** The gate refused this branch
(`WORKTREE-SOURCE-PIN`): `legacy-gates.cjs:12-16` hashes each pinned file ON
DISK, and `packages/B-NTC.json` pins `today-bindings.mjs` (and
`local-today-journey.test.mjs`, which pins `today-entry.mjs` by sha in
`PAGE_PINS`). A4b modifies **none** of the three; all are byte-identical to the
tip. The `tags` travel instead as ONE argument, `{ setup, tags }`, which w6's
unchanged `save(setup)` forwards into lane C's own producer, where `envelopeOf`
in `setup-commands.mjs` takes them apart; `setup-host.mjs` adds the read-back and
an explicit two-argument `save`. w6's `createSetupHost` is still used, for
everything it already did.

Round 3 (owner look `:133`) is unchanged by the re-pin: `namedExercise()` gives `One exercise (unnamed)`, each gap is its own `p.gap` block and a whole sentence, `setsLine()` gives `3 sets · aim for 10 reps`, and `:132 (3)`'s apostrophe keeps `:125 (2)`'s words.

Round 4, C9 (test-only): mutants Y1 and Y4 masked each other, so dropping
`envelopeOf` from `prepare` alone left the suite green while breaking the path
the page takes. The new subtest drives `{setup, tags}` through **w6's OWN**
`createSetupHost().save()` and asserts the op's three payload members in order -
RED under Y1 at **156 pass / 1 fail** (`ok false`, nothing written), GREEN at
**157**. C8: w6's parameter is still named `setup` and now sometimes carries
`{setup, tags}`, and w6 cannot say so while pinned on disk - the rename rides
the lane lead's REQUESTS line to whoever next unpins it.

## COUNTS (Windows, on the rebased head)

today **64** / copy **36** / gym **64** / checkin **28** / setup **157** /
catalogue **43** / ntc-h6-delta **8** / W6 **552** / journey **51** (PAGE_PINS
unmoved) / A0 host **32** / w7 **19**, all 0 fail. Four msedge checks PASS.

    B PACKAGE B-NTC PUBLIC CI EVIDENCE PASS - public evidence only, NOT the
    package verdict; the 19 original gates, the private oracle and independent
    exact-artifact acceptance remain separate

    A1 TODAY BUILD PASS: 3 assets; 103 pinned inputs (13 engine, 12 client);
    approved design pinned; 68 bound classes; no em/en dash in any text the
    athlete can see

Informational, the gym card after B-NTC: no day+3 same-lift-group refusal appears in any of the four walks; `gym-check.mjs` reports `"Last time"` printing on day 1's active set from the engine's own comparison (C4d) and nothing on day 2's lifts, which have none on file. No walk puts a same-group lift three days apart, so that is an absence, not a proof.

## SERVED, AND PREFLIGHT (DECISIONS:135 (3), self-check)

http://127.0.0.1:4178/ , `serve.mjs` pid **54224**, rebuilt on this head;
`/app.js` **1445621 bytes** served and on disk. Diff inside custody **PASS**: 18
paths, all under `dad-first-run/` and `w7-preview/today/`, nothing under
`rebuild/m3/w6/` now; report <= 60 **PASS**; no U+2013/U+2014 in UI custody
**PASS**; counts present **PASS**. CI **green on both runners** at 5ba2419, the
verdict head - `rebuild` 34683662989, `pipeline` 34683662975 (and at 8f4e6af
before it). The one windows-only `b-ntc-journeys` failure was transient; annex.
