# P0-C AUTHOR REPORT

Ticket P0-C. Lane C, screens/plumbing. Sonnet / medium. Branch `rebuild/c-p0c`
on `rebuild/t2-client-core` tip `e5be7321`. Three narrow items from
P-INSTALL-VERIFY-REPORT.md.

## Files : hunks
* `today-app.cjs` - (a) the boot-only gate/adopt block is now
  `canAdoptAthleteState()`/`armAdoptionGate()`/`adoptAthleteState()`, called
  at boot AND from the setup `done` callback (arms the gate, paints Today,
  runs and returns the SAME chain so today-entry.mjs's `await done()` waits);
  `ready` is `let`, exposed as `get ready()`. (b) the owed primary label shows
  `marchingOrder.thenText` only when `kind === "weight"`; any other owed head
  (e.g. kind "night", "log last night") falls back to "Log this morning's
  weight", what the click opens.
* `preflight.html` / `preflight.js` - (c) rewrote the two pinned em-dash lines
  (colon; two sentences); no other visible dash was found.
* `build-pwa.mjs` - item (c): new exported `assertNoAiDashesInSite(entries,
  {exempt})`, the same posture as build.mjs's own guard, called in
  `composeSite()` before a byte is written, over index.html/preflight
  html+js/manifest/_headers (app.js exempt - A1's build.mjs already vets it,
  and a bare regex literal in the bundle is not athlete-facing prose).
* `test/package.test.cjs`, `test/pwa.test.cjs` - the two dash counts these
  files PINNED as exceptions (P1's ruling) now expect zero; added P0C.3 to
  package.test.cjs (has the real `build`/`site` fixtures already).
* `test/problem.test.mjs` - P0C.1, P0C.2 (below).

## Cells
P0C.1 - completes setup in jsdom (`boot()`), no reload: asserts the FIRST Today
frame after "Start using Earned" (post `api.ready`) has the setup-note hidden
and none of the fixture strings, athlete_label is his own, and gym/check-in
read his adopted state (PASS).
P0C.2 - the primary label equals marching-order words when the owed head IS
the weigh-in (view.test.mjs's own contract, kept); falls back to "Log this
morning's weight" for any other owed head (wrapped read() reproducing the
live "log last night" state); either way the click opens WEIGHT; after a
weigh-in the label names the workout and opens it (PASS).
P0C.3 - `assertNoAiDashesInSite` throws on a planted dash outside a comment,
is silent inside one or on a skipped binary/exempt asset, and the real built
folder passes it (PASS, in `rebuild/slice/pwa/test/package.test.cjs`).

## Suites (verbatim tails)
today suite, 13 files: `tests 645 / pass 645 / fail 0 / cancelled 0 / skipped 0
/ todo 0` (tip 643 + 2 new cells).
`build.mjs`: `A1 TODAY BUILD PASS: 3 assets; ... no em/en dash in any text the
athlete can see (904 frozen-source strings ...)`.
`build-pwa.mjs`: `A5 PWA BUILD PASS: 13 files ...; no network reference in any
shipped byte; no em/en dash in any text this build emits`.
`node --test` pwa suites (package/pwa/workflow): `tests 56 / pass 56 / fail 0`.
`b-package.cjs --ci --package S3`: `PRODUCT IMPLEMENTED ... 0 unlisted drift`;
`PUBLIC CI EVIDENCE PASS`. `rig187.cjs`: `rig187 => PASS - SUITE GAP: ...`
(pre-existing gap, unrelated).

## Disposition
(a) FIXED - the in-page transition now runs the same adoption chain a fresh
mount does. (b) FIXED - label agrees with the click in every case, including
the live "log last night" mismatch, without touching the pinned "Log the
scale" contract. (c) FIXED - dash rewritten in both lines, plus a build-time
refusal (`rebuild/slice/pwa` confirmed unpinned via findstr against
S3.json/H3.json). Nothing was impossible as written.
