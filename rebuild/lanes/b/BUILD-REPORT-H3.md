# BUILD REPORT — M2-H3-CLEAN-INIT (v1.4 — `DECISIONS:146` applied)

Branch `rebuild/lane-b-h3`, `sourceBase` `ce38aa3`. Parent: the sealed B-NTC artifact `87f4848c…`, acceptance commit `9ad2ecab…`, receipt `:141`. Merged this pass: chain tip **`dac3af9`** (`:146`; **docs-only since `ce38aa3`** — verified: `DECISIONS.md`, `REQUESTS.md`, `STATUS.md`, `STATUS-ARCHIVE.md` and nothing else) and `rebuild/lane-b-tooling` **`978d821`**, runner **`59ecc7f91f5f8f6d40c5c0f61267c6f71ca7edd7987b8022da39c5a04a1cce0d`**, re-pinned as `tooling.runnerSha256`. Brief v1.4. `git diff --check` clean; UTF-8, no BOM, LF.

## `:146` applied

**(3) F-B = OPTION B.** `applyRead` now reads `if (!sealed && !offW) s.trend = first ? w : +(s.trend + 0.3 * dCl).toFixed(1);` — one window test governs both branches. A late or sealed first reading is still recorded and is still his number; it writes no trend, exactly as it writes none for an athlete who already has one, and Today keeps "Not available yet" until an in-window reading arrives. **H3/12 flipped to assert B** (`FIRST_READ_ON_A_SET_ASIDE_ROW = false`) across in-window, late, sealed, the next morning's in-window read that does seed it, and the differential that shows the two athletes now agree.
**(2)** brief v1.3 `60567b60…` accepted by name; this revision is v1.4 and supersedes those bytes, so the lane's BRIEF-BY-SHA line must cite v1.4.
**(4)** seal-on-tip is ancestry (`:145`); `SEAL_TIP_RULE = 'ancestor'` in the merged runner; the tip is an ancestor of HEAD. Not rebased.

## Counts (all re-run at this head)

Cells **13/13, exit 0**. RED-first: **5/5** (H3/8–12) against the parent's `writers.cjs`+`constants.cjs`; **9/13** against the parent's `athlete-state.cjs`; H3/12 alone is RED against the pre-option-B `writers.cjs`, which is this revision's own red-first.

| Suite | H3 |
| --- | --- |
| the eight enumerated today files | **268/268 exit 0** (`setup.test.mjs` **104/104**) |
| A0 `journey` + `engine-equivalence` | **23/23 exit 0** |
| provider `native-trend-context` | **39/39 exit 0** |
| `local-host-journey` + `local-today-journey` | **68/68 exit 0** |
| the 45 register laws | `45 RED-frozen · 39 RED-candidate`, exit 1 — **unmoved** |

**Legacy differential — byte-identical.** 5 days × hours 8 and 23 plus a sealed run on a trend-carrying athlete: transcript sha256 **`df1ac1b9206d328057f317f2879dd5209b8f83c207abb0fb3d017f7d8bf61e6f`** under HEAD's `writers.cjs` and under the parent's, identical.
**Public census — byte-identical.** `rebuild/conform/run.cjs` with and without H3's `writers.cjs`+`constants.cjs`+`athlete-state.cjs`: same sha256 **`401706332af64b5cd2a78aae173b943f95aefc5b71a9897356a44ef7f6b55b5a`**.

## `--ci --package H3` — every line, at this head

    B PACKAGE H3 SPEC OBSERVED packages/H3.json a15b4b09…; runner 59ecc7f9… byte-identical
    B PACKAGE H3 PARENT OPTION B-NTC …87f4848c… ACCEPTED
    B PACKAGE H3 PARENT BOUND B-NTC …; single-parent chain holds
    B PACKAGE H3 POSTFIX M2-H3-CLEAN-INIT REVIEW-PENDING mode=--ci
    B PACKAGE H3 ENVELOPE ABSENT; …acceptance-h3-clean-init.json is not sealed yet
    B PACKAGE H3 PARENT PINS RE-ASSERTED at run time; 1 pin + its 53 product pins
    B PACKAGE H3 PRODUCT IMPLEMENTED; 9 at the declared post-image / 0 at the pinned
      pre-image / 49 carried byte-identical / 0 declared role "pinned-unchanged"
    B PACKAGE H3 FIDELITY OBSERVED; sourceBase ce38aa3 ancestor of HEAD 5e6e7c9
    B PACKAGE H3 AUTHORITY OBSERVED owner DECISIONS:60 and contract DECISIONS:49
    B PACKAGE H3 PROTECTED SURFACES 2 declared  |  PRIVATE LIVE-TRIGGERED none
    B PACKAGE H3 LAWS 45/45 executed | TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate
    B PACKAGE H3 LAWS DECLARED-STATE 45/45 rows agree … this package declares NO D-id
    B PACKAGE H3 CARRIERS NONE DECLARED; 0 witness flip(s) declared
    B PACKAGE H3 FAIL; required evidence missing or failed; local diagnostics withheld   exit 1

`--full` stops at the same point and never reaches the BLOCKED line. The refusing assertion is unnamed, so no code is printed; it is the F-C child refusal, reproduced by running that child directly: `Unlisted parent pin drift rebuild/engine/writers.cjs`.

## OPEN — one item, and it is a BUILD

* **F-C.** `:146 (1)` extends the grant and its line sha256 is **`3dc537652cdf8f6b9c012ac88096f8f8cc7d9156ce5dbbd3453a3936c2b9c2c0`** (line 146 on `origin/rebuild/t2-client-core`; all four runner predicates verified — it names `M2-H3-CLEAN-INIT`, uses SUCCESSOR, stands on `:113`, names all three support paths). The admitted gate set is **measured**: `successorGates()` admits a gate only when the carrier's source closure contains the support path as a literal, and `writers.cjs` reaches all five inherited carriers while `constants.cjs` reaches none and `journey.test.mjs` reaches only `b-ntc-journeys.cjs` (not a `byChild` gate). So `support = rebuild/engine/writers.cjs`, five gates, five carriers.
  **Why it is not declared here.** Each parent carrier is an eight-line wrapper whose only statement is `require('./b-ntc-successors.cjs').run('<name>');`, and the refusal is raised inside `b-ntc-successors.cjs`'s shared `preflight()` — which is **not** a parent execution pin and so cannot be a substitution target. The successor is five thin `rebuild/m4/spec/h3-<name>.cjs` files **plus an H3-owned support module** reproducing that machinery against H3's own spec (B-NTC's equivalent is 241 lines and had its own review round), plus five verbatim substitutions `require('./b-ntc-successors.cjs').run('<name>');` → `require('./h3-successors.cjs').run('<name>');`. `coverage.successors` is **`null`**: a partial block refuses and a fabricated one would be worse than an honest null. The runner was not edited and `packages/B-NTC.json`'s posts were not rewritten to H3's bytes.
* **The two ledger lines** (`:135 (2)`) — theme + BRIEF-BY-SHA, the latter citing **v1.4**, not the accepted v1.3 bytes. Until they stand on the chain, `brief.acceptedLedgerLine` is `null` and `status` stays `PROPOSED`.

## Commits — author `lane-b-builder-h3 <builder-h3@earned.local>`, not pushed

`…9a01d6b` (v1.3) · merge `dac3af9` · merge `978d821` · `5e6e7c9` option B + runner re-pin · this brief v1.4 and report.

---

# FIX r2 — H3-REVIEW-r2 APPLIED, AND THE ONE BLOCKER THAT REMAINS

Branch `rebuild/lane-b-h3`, author `lane-b-builder-h3c`, nothing pushed. Runner of record `4482bb8aa344b4aa090a01cbcf2164f9834320d71ce24a24bcc0154b0c037db3` (`rebuild/lane-b-tooling` @ `17341d5`). Brief of record v1.9, sha256 `67e95134b2c48f0c175f3481575854e03e685f6ce50fbf97efe041a459f5b301`, 34,208 bytes, 175 lines. Review of record `rebuild/lanes/b/reviews/H3-REVIEW-r2.md` (ACCEPT WITH CHANGES), sha256 `a9b4854ffe88db70261e1aa31fbc6945764e9d4019b33d0aa71314091a625de3`, 16,465 bytes, committed here under `lane-b-reviewer-h3 <reviewer-h3@earned.local>`.

`origin/rebuild/t2-client-core` is merged `--no-ff` and **is an ancestor of HEAD** (`git merge-base --is-ancestor` exits 0), so `DECISIONS:145`'s ancestry rule holds. The tip carries `DECISIONS:165` (THEME) and `:166` (BRIEF ACCEPTED BY SHA) for this package. **The spec does not cite them, and cannot** — §r2-1.

## r2-1 · THE BLOCKER: `:165` AND `:166` CANNOT BE CITED BY THIS RUNNER

Both lines were located on the chain branch by their own bytes:

| Line | sha256 of its exact bytes | terminal | role segment |
| --- | --- | --- | --- |
| `DECISIONS:165` THEME | `48496d9fe6907f845933af72151dc15e09f17e10702081dc96470c03fcea5dd3` | `· ACCEPTED` ✓ | `· cowork (lane B, per DECISIONS:135 (2)) ·` |
| `DECISIONS:166` BRIEF-BY-SHA | `4816ca9b3ed613f4130802fb11613a1d92cee144fd648d8f3ba4fd261cf60a21` | `· ACCEPTED` ✓ | `· cowork (lane B, per DECISIONS:135 (2)) ·` |

`:166` carries this brief's path, the binding sha256 `67e95134…` and the byte count 34208 — all three checked against the spec's own pin before anything else was attempted.

**Why they refuse.** `rebuild/conform/v4/postfix/legacy-gates.cjs:24` reads `if(role&&!new RegExp(' · '+role+' · ').test(found[0]))fail('RECEIPT-ROLE');` — the located line must carry the declared role **between two `·` separators, as the whole of that clause**. The role a spec may declare is not free: `b-package.cjs:1385` is `claim(s.authorizations.theme, 'cowork', 'theme')`, `:1220` is `claim(s.brief.acceptedLedgerLine, 'cowork', 'brief acceptance')`, and `claim()` (`:828`) asserts `v.role === role`. So the spec must say `cowork` and the line must read `· cowork ·`. These two read `· cowork (lane B, per DECISIONS:135 (2)) ·`.

**Measured, both ways.** With both citations written into the spec in exactly `packages/B-NTC.json`'s shape — `{ledgerLine, role, line, lineSha256}`, the line taken verbatim out of Git on the chain branch and the sha computed from those bytes, never retyped — `--ci` fails **`B PACKAGE H3 FAIL RECEIPT-ROLE`, exit 1**, which is strictly worse than leaving them out. Declaring `role: 'cowork (lane B, per DECISIONS:135 (2))'` instead is refused by `claim()` before the line is read. B-NTC's own `:122`/`:126` read `· cowork ·` and pass, and **80 other lines** of `rebuild/DECISIONS.md` use the bare form: these two are the deviation. This is **not** a runner defect (the runner is doing what every other citation in the tree satisfies) and **not** a spec-truth problem lane B can fix (the bytes are the PM's).

**THE FIX, one clause in each line.** Re-write the role segment of `:165` and `:166` as bare `· cowork ·` and move the qualification into the prose, exactly as `:122`/`:126` do — e.g. `- 2026-09-12 · cowork · THEME M2-H3-CLEAN-INIT (lane B, per DECISIONS:135 (2)) — …`. Nothing else in either line changes, and **`:166`'s binding sha256 is unaffected because the brief is not touched**. Lane B has therefore left `authorizations.theme` and `brief.acceptedLedgerLine` at **`null`** with `status` `PROPOSED`, so `--ci` stands at `CI REVIEW-PENDING: 2 open obligation(s)`, exit 2 — the two being exactly theme and brief. Once the lines are re-written, citing them is a three-field spec edit and the package reaches `PUBLIC CI EVIDENCE PASS`.

*Recorded for the sealer, measured:* with a citeable `:166`, `status` must also move to `BRIEF-ACCEPTED` or `b-package.cjs:1221` refuses `BRIEF-ACCEPTANCE-STATUS`.

## r2-2 · ERRATA AGAINST THE BRIEF — r2's DOC CORRECTIONS, RECORDED HERE BECAUSE `:166` PINS THE BRIEF'S BYTES

`:166` accepts the brief **by sha256 `67e95134…`**; editing the file would void that citation and need a fresh PM line. All five corrections are documentation-only — **not one changes a measurement, a pin, a cell or a verdict.**

1. **The four self-version strings are stale BY CONSTRUCTION.** The text calls itself v1.6/v1.7/v1.8 in four places, including `§9`'s "so the BRIEF-BY-SHA line must cite v1.8", which should read **v1.9**. A document whose bytes are pinned by a line accepting those bytes cannot correct its own version string without changing the sha just accepted. **Read every self-reference as v1.9**; the header line is authoritative and does say v1.9.
2. **`§9`'s runner shas** mention the earlier runners `c609cf71…` / `c8dfdd49…`. The runner of record is **`4482bb8a…`** (`17341d5`) — what `packages/H3.json` pins and what every run quoted here used.
3. **`h3-supersede-inherited-carriers.test.cjs`'s header promise.** It says the cell proves "(a) … **and** (b) the two it does declare are held to a DIFFERENTIAL", which reads as two differentials in one file. The file has **three** cells: H3/SUP-5 the unchanged-prior-module half over the real inventory; H3/SUP-6 the **constants** differential (exactly one exported key moves, four keys added, no existing gloss touched); H3/SUP-7 that no producer on the tree sets those four keys. The **writers** differential lives in `h3-supersede-writers-differential.test.cjs` (H3/SUP-8/9/10). Read (b) as "the constants file it declares is held to a differential, and the writers file to its own carrier's". No assertion is affected.
4. **`§7`'s red-first count.** The brief says "**RED at the parent: 1 pass / 13 fail**". Re-measured on this head with the parent's `athlete-state.cjs` **and** both engine files: **2 pass / 12 fail** — H3/6 (the gym card) and H3/13 (the CI-line guard) pass and neither is red-first by design. r2 is right. With **only** `athlete-state.cjs` reverted it is **4 pass / 10 fail** (H3/10 and H3/11, the F2 LABEL cells, also pass because `constants.cjs` is still H3's).
5. **The sibling note's athlete-state sha.** It cites `e1e05a63…` as B1's pre-image for `rebuild/m4/workout/athlete-state.cjs`; that was v1.8's post and the `sleep.needed` fold moved it. The post of record — declared by `packages/H3.json` and on disk — is **`d0e26f7401f6d04f44aef808eaca3c05e658f9c1ebd25a45ad9d2b3a3e69601c`**, so **B1's pre-image for that file is `d0e26f74…`**.

**IF THE SEALER OR THE PM PREFERS A RE-PIN**, lane B will issue v1.10 with all five corrected in place; that needs one new BRIEF-BY-SHA line carrying the new sha256, superseding `:166`. Lane B does not choose: the errata route costs no ledger line, the re-pin route costs one and leaves no stale strings.

## r2-3 · THE RUN, ON THE REAL CHAIN

`--ci --package H3` → **exit 2**. After `LAWS 45/45 executed | TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL` and `LAWS DECLARED-STATE 45/45 …`: `CARRIERS NONE DECLARED`; all **ten** declared children `OBSERVED; exit 0`; `COVERAGE 0/19 original gate(s) covered by 0 executed child(ren) (0 inherited…); 9 SUPERSEDED`; `SUPERSESSIONS 5 byte-identity carrier(s) of B-NTC SUPERSEDED over 9 gate(s) under DECISIONS:160, located on refs/remotes/origin/rebuild/t2-client-core BY ITS OWN SHA256 3746ff573af4`; five `SUPERSEDED <carrier> <- <gates>` and five `SUPERSEDED EVIDENCE` lines, each naming `engine-files differential engine-files-differential over 27 file(s)`; `NO-REGISTER OBLIGATION … 8 of 8 declared child(ren)`; then

```
B PACKAGE H3 OPEN theme ledger line accepting this brief is null (THEME-AUTHORIZATION-UNAVAILABLE before any receipt)
B PACKAGE H3 OPEN brief rebuild/lanes/b/BRIEF-H3-CLEAN-INIT.md not accepted by a PM ledger line
B PACKAGE H3 OPEN closed cumulative profile not sealed
B PACKAGE H3 CI REVIEW-PENDING: 2 open obligation(s); public evidence only; no PASS is claimed
```

`--full --package H3` → **`B PACKAGE H3 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING`, exit 2**.

## r2-4 · COUNTS, RE-RUN ON THIS HEAD

`h3-clean-init.test.cjs` **14/14** · the five `h3-supersede-*.test.cjs` **16/16** (4 · 3 · 3 · 3 · 3; RED on the parent's engine bytes 3 · 3 · 2 · 2 · 1) · `h3-engine-files-differential.cjs` exit 0, 27 files, 3,048 bytes · the eight enumerated today files **321/321** (`setup.test.mjs` **157/157**) · A0 **23/23** · B-NTC provider **39/39** · `local-host-journey` + `local-today-journey` **68/68** · `copy.test.mjs` **36/36** · the 45 register laws `45 RED-frozen · 39 RED-candidate` · public census 81 lines, 10,587 bytes raw, sha256 `189cbcc56381157e660be8b7a25bb64b24999256690a1bf62eef5952567e6e84`, unchanged.

## r2-5 · STILL OPEN

* **The seal**, and behind it the two citations of §r2-1 — the only thing between this package and `PUBLIC CI EVIDENCE PASS`.
* **F-G** `sleep.cleanH`: two engine-stated defaults (`|| 7.5` at `sleep.cjs:1071`, `|| 8` at `sleep.cjs:925`), so a clean-night run stays 0 however well he sleeps. Held open by an assertion in H3/S1; not on Today's projection; needs a ruling.
* **F-H**: the tip's `catalogue.test.mjs` and `problem.test.mjs` are named nowhere in `.github/workflows/rebuild.yml` — 2 of the 11 files under that directory run nowhere in CI. Beyond `DECISIONS:142 (2)(b)`, so not lane B's to apply; cell H3/13 asserts the exact state.
* **F-A** unchanged: `energy.cjs:117 proteinTarget` has no gate of its own; the view layer's `Number.isFinite` keeps the figure off the screen.
* **H3-CORE** stands at `rebuild/lane-b-h3-core` @ `b9a5850` as the `DECISIONS:147` contingency fallback, unchanged.

---

# §r3 — `DECISIONS:177 (A)` APPLIED ON THE NEW TIP

Branch `rebuild/lane-b-h3-r3` — a side branch; `rebuild/lane-b-h3` @ `e994c10` is untouched and stays the fallback. Chain tip **`7cb2038`** merged `--no-ff` at **`b9d4008`**, no conflict. Runner of record unchanged (`4482bb8a…`); the brief is not touched, so its bytes `67e95134…` and with them `:168`/`:169` still hold and no new BRIEF-BY-SHA line is needed.

**Why.** `:171` merged lane C's N1 and with it a new `rebuild/m3/w7-preview/today/test/food.test.mjs`, which `.github/workflows/rebuild.yml` did not name; H3/13 asserts that directory against the CI-named set and went RED on the merged tree, so the authorized rerun refused at `CHILD-REQUIRED-EXIT-ZERO`. `:177` rules option (A); `:112` is the licence — only a re-pinning engine package may edit `.github`, so the hunk rides H3's seal exactly as `:109`, `:117 (4)` and `:142 (2)(b)` did before it.

**`rebuild.yml`, the A1/A2/A3/A4 today step** — one invocation, both matrix runners, still no glob. Added by exact path: `catalogue.test.mjs`, `copy.test.mjs`, `problem.test.mjs`. Measured at this head: 11 files, **439 tests, 439 pass, 0 fail, exit 0** (`setup.test.mjs` 157/157). `machine-settings-ui.test.mjs` is not on this tree and is therefore not named.

**A finding, corrected in place.** `copy.test.mjs` was named in **no workflow in this repo at all** — measured across all five files under `.github/workflows/`. The r2 cell's comment supposed lane C enumerated it elsewhere; it did not.

**ONE HOLD-OUT, NAMED IN THE OPEN.** `food.test.mjs` is **not** added. Two of its cells execute the PRE-H3 engine as their own expectation — `N1.11` ("the engine cannot produce a plan for a clean-init athlete yet", `food.test.mjs:574-583`, which the file itself calls "the fact H3 will change") and `D2.1` ("the engine holds no figure for him yet") — so they are RED by design on any tree carrying H3; and its build cells `N1.15`/`N1.17` race `view.test.mjs`'s `R3` over one build output inside a shared `node --test` invocation (the 12-file argv measures 495 tests, 5 fail). Naming it would ship a red step. Lane C updates those cells and H3 then names the file; H3 does not edit another lane's test. The step comment carries the reason in full, and the PM's confirming word is asked in `REQUESTS.md`.

**H3/13**, id kept, one cell touched and no other. Old: two hand-typed lists — the eight enumerated names plus three "unenumerated" ones — asserting the exact unenumerated state as a standing finding. New: it reads the named set off the step line itself and asserts the directory equals that set **plus exactly one hold-out, `food.test.mjs`, named in the assertion message with its reason**, so any other unnamed file, or a second hold-out, is red; it also asserts every named file exists, that no `run:` line anywhere executes the hold-out, and that a comment names it. **Red-first, measured:** with `e994c10`'s `rebuild.yml` restored in place (`cf4b83c1…`, the byte `H3.json` pinned as `post` before r3) the cell fails on the directory/named-set assertion — 1 of 14 fail, exit 1; on the r3 bytes it is 14/14, exit 0.

**Re-pinned in `packages/H3.json`** — the only two files whose bytes moved: `.github/workflows/rebuild.yml` `cf4b83c1…` → `3cdc1ab8…`, and `rebuild/m4/workout/test/h3-clean-init.test.cjs` `fe247d2d…` → `69e20eb4…`. The `today-suites` child is unchanged at its eight-file argv and `# pass 321` needle: the runner keys a needle to the child's own argv, not to `rebuild.yml`, and that argv still measures 321/321 exit 0 here. All ten declared children green.

**The artifact**, in its own commit `24b7073`: `rebuild/m4/spec/acceptance-h3-clean-init.json` sha256 **`d7af7525f9ff5a6c680ca804d2bea07c34dbf56f78fcc224083b43e4a9a47de4`**, 36,069 B, parent B-NTC `87f4848c…` unchanged. It differs from the superseded `61bd6d3f…` in five hashes and nothing else: the spec (`8e04aec3…` → `0bcc14fb…`, twice) and the two posts above. `review-h3-clean-init.json` stays `{version:1, status:"PENDING", receipt:null}` — `:172`'s receipt names the superseded artifact, so these bytes need a new receipt line, which is the PM's.

**The runs.** `node rebuild/lanes/b/tooling/b-package.cjs --ci --package H3` → `B PACKAGE H3 ENVELOPE PENDING artifact=d7af7525… spec=0bcc14fb… runner=4482bb8a…`, all ten children `OBSERVED; exit 0`, one `B PACKAGE H3 OPEN independent exact-artifact acceptance PENDING`, then `B PACKAGE H3 PUBLIC CI EVIDENCE PASS — public evidence only, NOT the package verdict; …`, **exit 0**. `--full --package H3` with the private fixture in place → `PRIVATE ORACLE PRESENT`, `FULL EVIDENCE: 10 of the 19 original gates re-executed, 0 carried by successor children … and 9 SUPERSEDED under DECISIONS:160`, `B PACKAGE H3 POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation(s); independent exact-artifact acceptance required`, **exit 2** — the same gate matrix as the `e994c10` seal. No private value, count or hash is recorded here.
