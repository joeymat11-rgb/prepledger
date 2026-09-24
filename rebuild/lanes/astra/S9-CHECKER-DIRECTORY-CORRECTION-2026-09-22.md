# S9 source checker directory-reference correction

Status: OFF-REPO candidate for independent review; not run against integration.
Candidate fixed in helper: `a23c079b1bda934257cce944fc2763d914636956`.
Original helper SHA-256: `20ac3a95edde0134bd1f43f17c828843ac20f78d8ec12db2b16a02f793cda8b6`.
Original actual STOP receipt SHA-256: `f30f0460b68c028b86cd41bd70074ea917cec6632910fddd64dbe76b3761a6f9`.
Corrected helper SHA-256: `fb75b6a2b67b7e49776d920b23a505ccb5e87f0d211a2253eb2e1340e20f5ef7`.
Synthetic control SHA-256: `9fe2606472f3c6e09b8bdc00826d8832711343f6d7573770bfa0a275a826c998`.

The actual public target `local-real-day.test.mjs` resolves a directory URL to repository root `./`.
The original closure passed that directory spelling to `repoPath`, which refused it before checking type.
The correction changes only candidate iteration in `executedClosure`:
- preserve the normalized base's trailing slash as directory-reference syntax;
- canonicalize the unsuffixed direct candidate and apply unchanged path/Git metadata guards first;
- skip repository root, a real Git tree, or a missing direct entry; queue a regular blob conservatively;
- normalize each extension candidate before the unchanged path and Git-entry checks.
Therefore root `./.cjs` becomes `.cjs`, nested `dir/.cjs` stays nested, and `dir/` is not changed to `dir.cjs`.
Directory spellings in child argv remain refused by unchanged child-target extension/file checks.

Red PID 49312, exit 0: original helper produced the expected `PATH_REFUSED` witness.
Green PID 9060, exit 0: root/nested directory references and exact extension fallbacks passed.
Reviewer PID 57472 then found a slash-ended symlink was skipped before metadata. Author PID 25236 retained
that red (`PASS` instead of link refusal). Corrected PID 58240, exit 0, holds the directory behavior plus
forbidden, out-of-root, protected-case-alias, over-512, Git-link, slash-link, and direct-directory refusals.
An earlier intermediate control run only corrected the disposable forbidden fixture's relative depth.
Red log SHA-256: `9bbf198ded22a0c966ee007e0f231890374056651cc1c5ce27f95bdf035e25c1`.
Green log SHA-256: `ec7107839a0cfe7caac75479fbeef7c3c1b8e2b0bd35191d4c4dd7e87c227bd7`.
Slash-link red log SHA-256: `6e61bebf47eda4b3547377e0d67d8ff99a2bc4338ee79522ada952ebc4bc94a9`.
Final green log SHA-256: `88484c5225fa2cb13926e18f52cb612274dd5b78817d6c9fdcfad285c2752e69`.

No protected bytes, integration helper run, repository module, child, exporter, or package runner executed.
Independent static and synthetic acceptance is required before PM may rerun the actual checker.
