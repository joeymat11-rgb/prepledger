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
