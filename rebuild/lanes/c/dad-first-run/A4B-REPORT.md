# A4B REPORT

Branch `rebuild/lane-c-a4b`, base `origin/rebuild/t2-client-core` @ aa06544 (the
B-NTC merge is in). Rounds 1-3 all ACCEPT (e67fde6, bb2640c, 8e558ce; the third
was the owner look `:133`). Detail and evidence: `A4B-REPORT-ANNEX.md`.

## RE-PIN ONTO THE B-NTC MERGE (DECISIONS:144)

Rebase onto the tip took NO conflict. `today-bindings.mjs`: lane B's H6 wiring
(`trendBinding`, `scoped`, `genSession`/`rirPlan`) and A4b's `createSetupHost`
changes sit in different functions, so git merged them; verified by reading the
file and by diffing it against the tip, where A4b's delta is exactly its three
hunks, +11/-2, and none of lane B's is touched. No licensed non-test file moved
beyond that, so mutants were not re-run; `rebuild.yml` and `rebuild/m4/**` are
untouched. Build pins **103**, A0 host **32** (B-NTC added one of each).

## BLOCKER - THE B-NTC GATE REFUSES ANY LICENSED EDIT TO A FILE IT PINS

`node rebuild/lanes/b/tooling/b-package.cjs --ci --package B-NTC` (rebuild.yml's
gate, line 82) ends **`B PACKAGE B-NTC FAIL WORKTREE-SOURCE-PIN`**, and the cause
is exact, not a mistake in this branch. `legacy-gates.cjs:12-16` checks each
pinned file twice: as a git object at the pinned commit, and **as the bytes on
disk**. `packages/B-NTC.json:228` pins `rebuild/m3/w6/local/today-bindings.mjs`
at post `95315f7a...`, the TIP's bytes; A4b's licensed +11/-2 makes the working
copy `20650a88...`, so `GIT-SOURCE-PIN` passes and `WORKTREE-SOURCE-PIN` fails.
CI checks out this branch, so the same step fails there. Every way out is outside
custody - `rebuild.yml`, `packages/B-NTC.json` and `rebuild/m4/**` are named OUT,
and reverting the delta leaves `tags` unable to reach the producer. PM ruling.

Round 3 (owner look `:133`) is unchanged by the re-pin: one predicate decides
whether an exercise has a name, `namedExercise()` gives `One exercise (unnamed)`,
each gap is its own `p.gap` block and a whole sentence, `setsLine()` gives `3
sets · aim for 10 reps`, and `:132 (3)`'s apostrophe keeps `:125 (2)`'s words.

## COUNTS (Windows, on the rebased head)

today **64** / copy **36** / gym **64** / checkin **28** / setup **150** /
catalogue **43** / ntc-h6-delta **8** / W6 **552** / journey **51** / A0 host
**32** / w7 **19**, all 0 fail; rebuild.yml's today step as written **164/164**.
Four msedge checks PASS. `b-package --ci` **FAIL**, above.

    A1 TODAY BUILD PASS: 3 assets; 103 pinned inputs (13 engine, 12 client);
    approved design pinned; 68 bound classes; no em/en dash in any text the
    athlete can see

Informational, the gym card after B-NTC: no day+3 same-lift-group refusal appears
in any of the four walks, and `gym-check.mjs` reports `"Last time" prints on day
1's active set from the engine's own comparison (C4d), and day 2's lifts, which
have none on file, print nothing rather than an invented one`. No walk puts a
same-group lift three days apart, so that is an absence, not a proof.

## SERVED, AND PREFLIGHT (DECISIONS:135 (3), self-check)

http://127.0.0.1:4178/ , `serve.mjs` pid **11600**, rebuilt on this head;
`/app.js` **1443195 bytes** served and on disk. Diff inside custody **PASS** (20
paths, nothing under engine / client / conform / m4 / w6-host / .github / src /
ledger); report <= 60 lines **PASS**; no U+2013 or U+2014 in UI custody **PASS**;
counts present **PASS**; CI green at the exact head **FAIL**, the B-NTC gate
above, run id in the annex.
