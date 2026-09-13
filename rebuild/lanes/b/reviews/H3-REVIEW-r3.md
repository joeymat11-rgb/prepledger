# H3-REVIEW-r3 — M2-H3-CLEAN-INIT, blind delta review at MAX

**Scope.** Branch `rebuild/lane-b-h3-r3` @ `fffc668`; the delta `e994c10..fffc668` only — everything reviewed at r1/r2 is out of scope unless the delta breaks it. Fresh detached worktree `work/lane-b/rv-h3c` created off `origin/rebuild/lane-b-h3-r3` (the r3b worktree was dirty and at another head); `git status --porcelain` empty at start, node v24.18.0, `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, `node_modules` junctioned from the sibling worktrees, no install. Reviewer is not the author and not the integrator. No private fixture was opened — public evidence only; no private value, count or hash appears here. The bar below was executed before `BUILD-REPORT-H3.md` §r3 was read.

## 1 — The lane-B delta is exactly what it claims

`git diff --name-only b9d4008..fffc668` is five files and nothing else: `.github/workflows/rebuild.yml`, `rebuild/m4/workout/test/h3-clean-init.test.cjs`, `rebuild/lanes/b/tooling/packages/H3.json`, `rebuild/m4/spec/acceptance-h3-clean-init.json`, `rebuild/lanes/b/BUILD-REPORT-H3.md` (+90 / −35). `b9d4008` is a two-parent `--no-ff` merge of `e994c10` and `7cb2038`; `git diff --name-only e994c10..b9d4008` is lane C / lane D2 content only, so the merge touched no lane-B file. Commit shape is the declared one: `b9d4008` → `3edcc3f` → `24b7073` → `fffc668`. `BRIEF-H3-CLEAN-INIT.md` is untouched in the delta and still measures sha256 `67e95134…`, 34 208 B (`DECISIONS:169` intact). No engine file, no other cell, no ledger line, no `conform/private`.

## 2 — `rebuild.yml`, the today step

One `run:` line naming **11** paths by exact path — the eight it named before plus `catalogue.test.mjs`, `copy.test.mjs`, `problem.test.mjs`. No glob (`/[*?]/` absent from the line); every named path exists on the tree. The directory holds 12 `*.test.*` files; the twelfth, `food.test.mjs`, occurs in the workflow only on two `#` comment lines that carry its reason, and on no `run:` line in any of the five workflow files. `machine-settings-ui.test.mjs` is absent from this tree and is not named.

* step's exact 11-file argv from the repo root → **439 tests, 439 pass, 0 fail, exit 0**; `setup.test.mjs` alone **157/157**.
* `food.test.mjs` alone → 56 tests, **54 pass, 2 fail, exit 1** — `N1.11` and `D2.1`. The hold-out is substantiated on H3's bytes.
* 12-file argv (food included), three runs → 495 tests each, exit 1, **4 / 4 / 3** fails: `N1.11` and `D2.1` every time, plus `N1.17` (3×) and `N1.15` (2×). The race is real; its count is not fixed (F3).

## 3 — Cell `H3/13`

The cell reads the named set **off the step line itself** (`step.match(/rebuild\/m3\/w7-preview\/today\/test\/[A-Za-z0-9._-]+/g)`, de-duplicated) and retypes no hand list; it holds out exactly `['food.test.mjs']`, by name, with the reason in the assertion message; it asserts every named file exists on disk, that the directory equals named + held-out, that no `run:` line executes the hold-out, and that a comment names it. The cell id is kept and no other cell is touched (14 ids before and after: `H3/1…H3/7, H3/S1, H3/8…H3/13`).

**Red-first.** With `e994c10`'s `rebuild.yml` swapped in: **13 pass / 1 fail, exit 1 — exactly `H3/13`, 1 of 14**. Restored to `fffc668` bytes: **14/14, exit 0**.

**Mutation probes** (applied to the worktree, each restored, `git status --porcelain` empty after every one):

| probe | result | failing assertion |
|---|---|---|
| (i) drop `copy.test.mjs` from the step line | RED, 13/1 | directory ≠ named + held-out (`deepStrictEqual`) |
| (ii) add `ghost.test.mjs` to the step line | RED, 13/1 | "named in the today step but is not in the directory" |
| (iii) add a `run:` line executing `food.test.mjs` | RED, 13/1 | "held out, so no `run:` line … may execute it" |
| (iv) drop the current tip's `machine-settings-ui.test.mjs` into the directory | RED, 13/1 | directory ≠ named + held-out (see F1) |

## 4 — Pins, artifact, runner, children

`H3.json` diff is exactly two pin changes — `.github/workflows/rebuild.yml` post `cf4b83c1…` → `3cdc1ab8…` and `h3-clean-init.test.cjs` post `fe247d2d…` → `69e20eb4…`; both recomputed from the tree and **matching** (9 283 B / 50 409 B). The `today-suites` child is unchanged at its 8-file argv and `# pass 321` needle, and that argv measures **321/321, exit 0** here. Artifact `acceptance-h3-clean-init.json` recomputes to **`d7af7525…`, 36 069 B**; its diff against `e994c10` (whose bytes recompute to `61bd6d3f…`, also 36 069 B) is **five lines and nothing else** — spec sha `8e04aec3…` → `0bcc14fb…` twice, plus the two posts; parent B-NTC `87f4848c…` unchanged. `H3.json` recomputes to `0bcc14fb…` and `b-package.cjs` to `4482bb8a…`, matching the artifact. `review-h3-clean-init.json` is `{version:1, status:"PENDING", receipt:null}`.

Runner `node rebuild/lanes/b/tooling/b-package.cjs --ci --package H3` → **exit 0**, 10 of 10 declared children `OBSERVED; exit 0`, and verbatim: `B PACKAGE H3 OPEN independent exact-artifact acceptance PENDING` / `B PACKAGE H3 PUBLIC CI EVIDENCE PASS — public evidence only, NOT the package verdict; the 19 original gates, the private oracle and independent exact-artifact acceptance remain separate, and POSTFIX PACKAGE PASS is unavailable on this mode at any time`. Children run directly: `h3-sup-source-carriers` 4, `-inherited-carriers` 3, `-defect-witnesses` 3, `-writers-differential` 3, `-second-gate` 3 (all 0 fail, exit 0); `h3-engine-files-differential.cjs` exit 0 with its 27-file verdict line; `h3-clean-init.test.cjs` 14/14. All as claimed.

**Seal base.** `7cb2038` is an ancestor of `fffc668`. `refs/remotes/origin/rebuild/t2-client-core` has since moved to **`6c6aca9`** (18 commits ahead of `7cb2038`) and is **not** an ancestor of `fffc668`. Per the bar this is not a finding against the delta, but see F1.

## 5 — Findings

1. **F1 — NON-BLOCKING, but merge-gating.** The current tip `6c6aca9` adds `rebuild/m3/w7-preview/today/test/machine-settings-ui.test.mjs` (at `c4c38a5`) and names it in no workflow. Probe (iv) measured it: dropping that one file into the directory turns `H3/13` RED, 13/1 — the exact failure that refused the `:172`/`:173` rerun. `DECISIONS:177 (1)` names that file explicitly as one of the four to be named. The seal on `7cb2038` therefore cannot be merged onto today's tip as it stands; it must be re-sealed on a tip that carries that file, with the name added.
2. **F2 — NON-BLOCKING (authority, disclosed).** `DECISIONS:177 (1)` assigns the `rebuild.yml` naming edit to **lane C**, with lane D2 as reviewer, merged by lane C's integrator; `:177 (2)` gives lane B only the re-pin and re-seal "to that tip". Here lane B authored the hunk (on the `:112` reasoning that a re-pinning engine package must carry a `.github` edit, which is sound on its own terms) and held `food.test.mjs` out — variant (i), which `:177 (1)` does not provide for. Both are disclosed in §r3 and in the step comment, and the hold-out is well justified by §2's measurements, but the departure from the ruling's text is the PM's to confirm, not this review's to grant.
3. **F3 — NON-BLOCKING (report accuracy).** §r3 states "the 12-file argv measures 495 tests, 5 fail" as a flat measurement. 495 tests reproduces; 5 fails does not — three runs here gave 4, 4, 3. Since the claim is a race, a fixed count is the wrong shape: state the by-design pair plus a varying 1–3 build-cell fails.
4. **F4 — NON-BLOCKING (documentation, lane B).** `rebuild/lanes/b/VERDICT-H3.md` still names the superseded artifact `61bd6d3f…` and spec `8e04aec3…` in three places (lines 14, 28 and the draft receipt line 53). Confirmed as the builder disclosed. It must not be the document a receipt is cut from.
5. **F5 — NON-BLOCKING (minor).** §r3 says the PM's confirming word "is asked in `REQUESTS.md`", but `REQUESTS.md` at `fffc668` ends at the 18:20 entry — the lane-B 19:05 request is not on this branch, so the citation does not resolve here. Separately (pre-existing, untouched by the delta) `H3.json`'s `notes` still cites `:166` for the brief pin where `:169` now re-pins the same bytes.

## FINAL VERDICT

No finding contradicts a measured claim of §r3 other than F3 — §2/§3/§4 reconcile with §r3 line for line, including the red-first result, the two pin moves, the artifact sha and size, the parent sha and both runner verdict lines; the `--full` run and its exit 2 are not verifiable here and are neither confirmed nor doubted, as no private fixture was opened. The workmanship is sound: the delta is minimal and correctly scoped, `H3/13` is a real law that now derives its expectation from the artefact it guards, red-first proven and surviving four independent mutations, the pins and the artifact are exact, and the runner passes on public evidence. What is not yet right is the tree it was sealed against, and two documents.

**FINAL VERDICT: ACCEPT WITH CHANGES**

Changes required before this is merged or a receipt is cut against it:

1. Re-seal on a chain tip that carries `machine-settings-ui.test.mjs`, naming it in the today step (F1) — `DECISIONS:177 (1)` names it, and `H3/13` is measured RED without it.
2. Obtain the PM's word on the `food.test.mjs` hold-out and on lane B carrying an edit `:177 (1)` assigns to lane C (F2), or an amended ruling; nothing else in this package should move for it.
3. Correct §r3's "5 fail" to the varying count the race actually produces (F3).
4. Update `rebuild/lanes/b/VERDICT-H3.md` to `d7af7525…` / `0bcc14fb…` in all three places (F4), and fix the §r3 `REQUESTS.md` citation (F5).

## r3b addendum — same reviewer, delta `3bb7612..e43a6a0`

Re-measured in the same worktree, detached at `e43a6a0`, tree clean before and after; no private fixture opened.

1. **Delta.** `git diff --stat 0633099..e43a6a0` is five lane-B files and nothing else: `rebuild.yml`, `BUILD-REPORT-H3.md`, `VERDICT-H3.md`, `packages/H3.json`, `acceptance-h3-clean-init.json` (+53 / −24). `0633099` is a two-parent `--no-ff` merge of `3bb7612` and tip `c5552f5`, and introduces nothing under `.github`, `rebuild/m4` or `rebuild/lanes/b`. `h3-clean-init.test.cjs` is byte-unchanged at `69e20eb4…` (50 409 B) — the cell needed no logic change, as claimed. Commit shape as declared (`0633099` → `cb5905c` → `521a004` → `e43a6a0`).
2. **Step and cells.** The today step names **12** paths, no glob, all present; the directory holds 13 and `food.test.mjs` is the one hold-out, on no `run:` line in any workflow. The exact 12-file argv: **490 tests, 490 pass, 0 fail, exit 0 — three consecutive runs**, no variance. `H3/13` at `e43a6a0`: **14/14, exit 0**; with `machine-settings-ui.test.mjs` removed from the step line and nothing else touched: **13 pass / 1 fail, exit 1**, failing `H3/13` on the directory ≠ named + held-out assertion; restored: **14/14**. F1 is closed.
3. **Bytes.** Recomputed from the tree: `rebuild.yml` **`61fb1a86…`**, 10 010 B; artifact **`2b6e579eec4fadc2165e6edadd7f7a3a2ab18ae76950063634596598a2825262`**, **36 069 B**; spec `H3.json` `1a57a770…` — all three matching the claims and the artifact's own pins. Artifact diff vs `d7af7525…` is **three hashes only** (spec sha ×2, the `rebuild.yml` post); parent B-NTC `87f4848c…` unchanged. `review-h3-clean-init.json` is `{version:1, status:"PENDING", receipt:null}`.
4. **Runner.** `--ci --package H3` → **exit 0**, `ENVELOPE PENDING artifact=2b6e579e… spec=1a57a770… runner=4482bb8a…`, 10 of 10 children `OBSERVED; exit 0`, `OPEN independent exact-artifact acceptance PENDING`, `PUBLIC CI EVIDENCE PASS`. `origin/rebuild/t2-client-core` is **`c5552f5`** and **is** an ancestor of `e43a6a0` — the tip has not moved since the merge.
5. **My findings.** F1 applied (2 above). F2 answered by the PM at `DECISIONS:178`, not by lane B. F3 corrected in §r3 to the measured non-deterministic 3–5, citing both parties' runs. F5 corrected in §r3 (the `REQUESTS.md` 19:05 entry is named with its chain-branch commits and marked absent here) and in `H3.json`'s `notes` (`:166` → `:169`). F4 applied: `VERDICT-H3.md` is 58 lines and carries `2b6e579e…` / `1a57a770…` / `521a004` / `e43a6a0` throughout; its one remaining `61bd6d3f…` is the deliberate warning that `:172`'s receipt is two artifacts stale. Nothing in the r3b delta disturbs anything accepted at r1/r2 or measured at r3.

R3B VERDICT: CONFIRMED

## r3c addendum — same reviewer, delta `e43a6a0..16a3563`

Same worktree, detached at `16a3563`, clean before and after; no private fixture opened.

1. **Delta.** Five lane-B commits (`892209f`, `63c12b8`, `29a01db`, `5a5a965`, `16a3563`) touch only `.github/workflows/rebuild.yml`, `packages/H3.json`, `acceptance-h3-clean-init.json`, `review-h3-clean-init.json`, `tooling/receipts/H3.json`, `BUILD-REPORT-H3.md`, `VERDICT-H3.md` — nothing else. Both merges (`bb35990` of `bcdea5d`, `a5fa7d1` of `42c133a`) introduce **nothing** under `.github`, `rebuild/m4`, `rebuild/lanes/b` or `rebuild/engine`. `h3-clean-init.test.cjs` byte-unchanged at `69e20eb4…`; the today step is untouched — 12 names, `food.test.mjs` still the sole hold-out, on no `run:` line.
2. **The step retirement.** The `rebuild.yml` diff is **one `run:` line and its comment**: `--ci --package B-NTC` → `--ci --package H3`, same job, same matrix, same position, name updated in kind. The precedent holds exactly: `ce38aa3` replaced `node rebuild/m4/spec/native-carriers-package.cjs --ci` with `--ci --package B-NTC` in that same slot. `--package B-NTC` now appears on **no** line, `run:` or otherwise, in any of the five workflow files.
3. **Nothing newly red.** `rebuild/conform/v4/postfix/test/ci-second-gate.test.cjs` measured at both ends: `63c12b8` → 35 tests, **34 pass / 1 fail, exit 1**; `16a3563` → 35 tests, **34 pass / 1 fail, exit 1**. Same cell 35 ("workflow changes exactly one command and retains both OS jobs"), same `testCodeFailure` on the same whole-file expectation. The red is pre-existing and unchanged — r3c makes nothing newly red.
4. **Runs.** `--ci --package H3` → **exit 0**, `ENVELOPE PENDING artifact=d3c760c3… spec=0253fed8… runner=4482bb8a…`, 10 of 10 children `OBSERVED; exit 0`, `OPEN independent exact-artifact acceptance PENDING`, `PUBLIC CI EVIDENCE PASS`. Exact 12-file today argv **490/490, exit 0**; `h3-clean-init.test.cjs` **14/14, exit 0**.
5. **Bytes and the stale receipt.** `rebuild.yml` **`19e861df…`** (10 692 B); artifact **`d3c760c3862262beef5d10f6004a5a96e25f1219b23c8da98a653289c0a50cce`**, **36 069 B**; spec `0253fed8…` — all matching. The artifact differs from `2b6e579e…` in **three hashes only** (spec ×2, the `rebuild.yml` post); `review-h3-clean-init.json` is back to `{version:1, status:"PENDING", receipt:null}`. `tooling/receipts/H3.json` records the `2b6e579e…` run (`artifactSha256` and an `envelopeKey` that embeds it). Read at `b-package.cjs:2814-2828`: `sealedRunReceipt` is consulted only on a non-`--ci` run **and** an authorized envelope; a PENDING envelope yields `ENVELOPE-NOT-AUTHORIZED` → `AUTHORIZED STEP UNAVAILABLE … the FULL run with the private census is required`, and any byte drift on an authorized one yields `SEALED-RUN-RECEIPT-VOID` → full run. A stale sealed run is therefore UNAVAILABLE, never evidence — as `VERDICT-H3.md` states.
6. **Seal base.** `origin/rebuild/t2-client-core` has moved to **`fbe94b9`**, one commit past the merged `42c133a`, and is not an ancestor of `16a3563`. That commit touches only `rebuild/lanes/STATUS.md` and `REQUESTS.md` — no `.github`, `rebuild/m4`, `rebuild/lanes/b` or `rebuild/engine` path, and the today-test directory is unchanged at 13 files — so a re-merge moves no pinned byte and leaves `H3/13` green. Not a finding.

R3C VERDICT: CONFIRMED

## r3d addendum — same reviewer, delta `27a4d92..5f0e276` (`DECISIONS:186 (2)`)

Same worktree, detached at `5f0e276`, clean before and after; no private fixture opened.

1. **Delta.** Four lane-B commits (`8b779a2` the `:183` rerun, `ca58190`, `5f0c378`, `5f0e276`) touch only `.github/workflows/rebuild.yml`, `h3-clean-init.test.cjs`, `packages/H3.json`, `acceptance-h3-clean-init.json`, `review-h3-clean-init.json`, `tooling/receipts/H3.json`, `BUILD-REPORT-H3.md`, `VERDICT-H3.md` — nothing else; both tip merges (`e07a5c4` of `8ec60ae`, `b111615` of `d028c54`) introduce nothing under `.github`, `rebuild/m4`, `rebuild/lanes/b` or `rebuild/engine`. The brief is untouched: `67e95134…`, 34 208 B. The test file's diff is **`H3/13` and its block comment only** — no `test(` line is added or removed, 14 cells, every id unchanged.
2. **The step and the cell.** The today step names **13** exact paths and the directory holds **13**; the two sets compare **equal**, no glob, and the only remaining `#` mentions of `food.test.mjs` say it is no longer held out. `H3/13` now asserts `deepEqual(onDisk, NAMED)` in both directions, keeping the read-off-the-step-line derivation, the no-glob and named-file-exists checks, and drops the hold-out list entirely.
3. **Runs.** Exact 13-file argv from the step line: **547 tests, 547 pass, 0 fail, exit 0 — three consecutive runs**, no variance (`food.test.mjs` no longer races: it is 57/57 inside the shared invocation). `h3-clean-init.test.cjs` **14/14, exit 0**. Red-first with `b111615`'s 12-name `rebuild.yml` swapped in: **13 pass / 1 fail, exit 1, exactly `H3/13`**; restored **14/14**. Mutation probes, each restored: drop `copy.test.mjs` from the step line → RED 13/1; add a non-existent `ghost.test.mjs` → RED 13/1; replace a name with a `*.test.mjs` glob → RED 13/1. Always `H3/13`, never another cell.
4. **Bytes.** Recomputed from the tree: `rebuild.yml` **`34bec65a…`** (10 610 B), `h3-clean-init.test.cjs` **`7eac2e17…`** (49 398 B), artifact **`b457b539a384d8c72531b880cd771e996c6b231f034a49272e899c1fba61e61f`**, **36 069 B**, spec `6c9eca87…` — all matching the claims and the artifact's own pins. The artifact differs from `d3c760c3…` in **five hashes only** (spec ×2, the two posts ×1 and ×2); parent B-NTC `87f4848c…` is present and unchanged; `review-h3-clean-init.json` is `{version:1, status:"PENDING", receipt:null}`.
5. **Runner and seal base.** `--ci --package H3` → **exit 0**, `ENVELOPE PENDING artifact=b457b539… spec=6c9eca87… runner=4482bb8a…`, 10 of 10 children `OBSERVED; exit 0`, `OPEN independent exact-artifact acceptance PENDING`, `PUBLIC CI EVIDENCE PASS`. `origin/rebuild/t2-client-core` is **`d028c54`** and **is** an ancestor of `5f0e276` — unmoved since the merge. `VERDICT-H3.md` is **64 lines**, names `b457b539…` and `5f0c378` throughout, and records `:172`/`:180` as void per `:184` and `:183` as superseded by `:186`, with the `d3c760c3…` sealed-run receipt kept as history and marked not evidence for these bytes.

R3D VERDICT: CONFIRMED
