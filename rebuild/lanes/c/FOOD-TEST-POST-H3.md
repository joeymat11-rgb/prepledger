# food.test.mjs and the today suite after H3 (lane C, for lane B's :177 variant (i))

**(a) DONE: N1.11 and D2.1 are engine-version-AWARE.** They probe `engine.proteinTarget()` for the clean-init athlete
himself, which throws before H3 and answers after it, then assert what that engine owes. The probe is deliberately not
`read()` or `loggedFood()`: those are what the cells assert, and a detector that is also the assertion proves nothing.
The invariant is unbranched: nothing may show a digit for an athlete who has declared no bodyweight (pre-H3 by printing
no macro row, on H3 by printing four rows all reading "Not prescribed"), and his intake is kept and read back either way.
**(b) DONE: the planter is fixed and the flakiness is gone.** `copy.test.mjs` used to write an em dash into the REAL
`today/today-app.cjs` and restore it in a `finally`. `node --test` gives each file its own process and runs them at once,
so any sibling suite reading or bundling those bytes in that window saw the plant: it surfaced as food N1.15/N1.17
failing intermittently and naming a dash present in no source file. `planted()` now copies this directory to a SIBLING
(`today-plant-<pid>`, same depth, so every relative import and ROOT-relative pin resolves identically), plants in the
copy, and runs the COPY's own `build.mjs` into its own dist and scratch: the accepted build, checking the accepted
things, on planted bytes. Assertions are unchanged, still RED (`AI_DASH_IN_BUILD`, offence naming `index.html` /
`app.js` + `today-app.cjs`) on the copy and GREEN on the real tree, which `planted()` now asserts explicitly.
**No tracked byte is written at any point.** Two constants that hard-coded this directory are now derived from the
file's own location, byte-identical on the real tree: `build.mjs` `SOURCE_REL` and `plain-copy.cjs` `OWNED`.
`buildToday()` also takes `{ dist, scratch }`, defaulting to the accepted paths.
**(c) jsdom is a NON-ISSUE:** a root devDependency installed by `rebuild.yml`'s own `npm ci --include=dev`, already
imported by the enumerated `checkin`, `gym` and `view` tests. The "No dependency, no lockfile" note belongs to the C5
coach step, not the today step.
**COUNTS, one `node --test` invocation, three runs each, on BOTH trees (tip `bcdea5d`, and that tip merged with H3
`e994c10`): whole today directory 546/546 x3. copy 36/36. food 56/56. build PASS.**
**The shared `.tmp/w7-today-dist` race is NOT reachable.** Five suites build (`copy`, `food`, `package`, `problem`,
`machine-settings-ui`); together in one invocation they are 178/178 three times, and the full directory is green three
times. The hazard is real but unobserved, so nothing is isolated for it; `buildToday({ dist, scratch })` is the seam.
**LANE B MAY NAME THE WHOLE DIRECTORY.** Every today test passes in one invocation, repeatedly, on both trees. The
minimum ask is adding `food.test.mjs` to the A1/A2/A3 step: that list plus `food.test.mjs` is 220/220 x3 on both trees.
There is no longer a file that must be held out.
