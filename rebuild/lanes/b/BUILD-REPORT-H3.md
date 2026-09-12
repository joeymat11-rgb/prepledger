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
