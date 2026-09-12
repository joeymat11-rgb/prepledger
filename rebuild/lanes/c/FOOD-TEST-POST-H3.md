# food.test.mjs after H3 (lane C, for lane B's :177 variant (i))

**(a) DONE: N1.11 and D2.1 are engine-version-AWARE. 56/56 on the tip (`6c6aca9`) AND 56/56 on that tip merged with H3 (`e994c10`).**
They probe `engine.proteinTarget()` for the clean-init athlete himself, which throws before H3 and answers after it, then assert what
that engine owes. The probe is deliberately not `read()` or `loggedFood()`: those are what the cells assert, and a detector that is also
the assertion proves nothing. The invariant is unbranched: nothing may show a digit for an athlete who has declared no bodyweight
(pre-H3 by printing no macro row, on H3 by printing four rows all reading "Not prescribed"), and his intake is kept and read back either way.
**(b) NOT a build-output race, and not H3's: the diagnosis was wrong.** `copy.test.mjs:218` writes an em dash into the real
`today/today-app.cjs` ON DISK to prove the dash guard fires, restoring it in a `finally`; any sibling suite reading or building those bytes
in that window sees the plant, which is why the failure names a dash present in no source file. It reproduces on the tip WITHOUT H3 and
without any change of mine (whole directory, 3 runs: 2/1/2 fails), hits only N1.15 and N1.17, and involves no output directory. It cannot
be fixed from `food.test.mjs`: making those cells tolerate a mutated source would disable the guard they exist to be. **The fix belongs in
`copy.test.mjs`: plant into a scratch copy, not the worktree.**

**(c) jsdom is a NON-ISSUE:** a root devDependency installed by `rebuild.yml`'s own `npm ci --include=dev`, already imported by the
enumerated `checkin`, `gym` and `view` tests. The "No dependency, no lockfile" note belongs to the C5 coach step, not the today step.
**LANE B: add `food.test.mjs` to the A1/A2/A3 step.** That step's exact list plus `food.test.mjs`, in ONE invocation, is **220/220 over
three runs on both trees**. Do NOT add `copy.test.mjs` (the planter), `problem.test.mjs` or `machine-settings-ui.test.mjs`: all three build
into the one shared `.tmp/w7-today-dist` beside `package.test.cjs`, a real and still latent output race.
