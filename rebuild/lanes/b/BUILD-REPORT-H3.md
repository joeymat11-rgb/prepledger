# BUILD REPORT — M2-H3-CLEAN-INIT

Branch `rebuild/lane-b-h3`, parent head `b8d5cc7` (B-NTC candidate). Brief `rebuild/lanes/b/BRIEF-H3-CLEAN-INIT.md` sha256 `73bbce7c7c1db4e2d022a45b0338a2f4065897001f7e9470ccb6ed6d1edfca1c`, 105 lines. `git diff b8d5cc7 -- rebuild/engine` **empty**; `git diff --check` clean; UTF-8, no BOM, LF.

| Path | Role | sha256 |
| --- | --- | --- |
| `rebuild/m4/workout/athlete-state.cjs` | edited (the product) | `dccc5fb5…` → `318357b199bb782d1714b2b1baa193bacfc10d37fb4ef081d9b6c42f394dd1cb` |
| `rebuild/m4/workout/test/h3-clean-init.test.cjs` | new (the cells) | `e3b0c442…` → on disk |
| `rebuild/m3/w6/host/test/journey.test.mjs` | edited — one cell moved (brief §4) | `228c076d…` → `aecb8fe4980ce65ebb6488310302458dffc9b15a30aeeae1238b8491287f1832` |
| `rebuild/lanes/b/{BRIEF-H3-CLEAN-INIT,BUILD-REPORT-H3}.md`, `tooling/packages/H3.json` | new / SKELETON→PROPOSED | — |

**Cells.** `node --test --test-reporter=tap rebuild/m4/workout/test/h3-clean-init.test.cjs` → **7/7 pass, 0 fail, exit 0**. Against the parent's `athlete-state.cjs` (stashed) → **RED 6/7**; only H3/6 (the gym card, day+0 and day+3) is green both sides, which is its point. Six named mutants M1–M6, each applied to a private compilation of a copy, each killed by a named cell; a mutation site not present exactly once refuses.

**Unmoved.**

| Suite | Parent | H3 |
| --- | --- | --- |
| the seven enumerated today files | 164/164 exit 0 | **164/164 exit 0** |
| A0 `journey` + `engine-equivalence` | 23/23 exit 0 | **23/23 exit 0** |
| B-NTC provider `native-trend-context` | 39/39 exit 0 | **39/39 exit 0** |
| `local-host-journey` · `local-today-journey` | 17/17 · 51/51 | **17/17 · 51/51** |
| the 45 register laws | `45 RED-frozen · 39 RED-candidate`, exit 1 | **identical line, exit 1** |
| public census | — | untouched, byte-identical; clean-init is not in it |
| B-NTC's nine own carriers | green | **refuse at one pin — F-C** |

## The runner

    $ node rebuild/lanes/b/tooling/b-package.cjs --ci --package H3
    B PACKAGE H3 FAIL REGISTER-D-ID-INVENTORY-EMPTY-AND-NOT-EXEMPT; required evidence
    missing or failed; local diagnostics withheld                              exit 1
    $ node rebuild/lanes/b/tooling/b-package.cjs --full --package H3
    (the same line)                                                            exit 1

H3 registers no D-id — `:124` rules it **engine-tier** beside H1/H2, and D1–D45 is the M2 audit register, none of which H3 repairs — while `NO_REGISTER_IDS` is fixed at `{B-NTC, B-LOM}` inside `b-package.cjs` (W7). **Finding F-D**, a runner limitation recorded for the tooling pass: one reviewed line, `'H3'` added to `NO_REGISTER_IDS`. **The runner was not edited.**

**REHEARSAL** (uncommitted, reverted; a probe *copy* of the runner, never the runner). With `'H3'` in `NO_REGISTER_IDS` and F-C's single re-pin applied on disk, the same committed spec reaches:

    B PACKAGE H3 CI REVIEW-PENDING: 9 open obligation(s); public evidence only;
    no PASS is claimed                                                         exit 2
    B PACKAGE H3 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING     (--full)     exit 2

with `PRODUCT IMPLEMENTED; 3 at the declared post-image / 0 at the pinned pre-image / 52 carried byte-identical / 0 unlisted drift`, `LAWS 45/45 executed`, **all 8 children OBSERVED exit 0** (`source-carriers`, `inherited-carriers`, `defect-witnesses`, `writers-differential`, `second-gate`, `h3-cells`, `a0-journeys`, `ntc-provider-cells`), `COVERAGE 9/19 gates by 5 executed children`, and `NO-REGISTER OBLIGATION H3 … 1 of 1 declared child(ren) executing one of this package's own role:"new" product file(s)` — Y1 satisfied by `h3-cells`.

The 9 OPEN obligations are all ledger-clearable: parent artifact not named by the PM · single-parent scan (Y2) not reached · no sealed chain head on disk · parent/grandparent pins not re-asserted · product inventory completeness unverified · theme ledger line null · brief not accepted by a PM ledger line · owner and contract lines not verified at a chain commit · closed cumulative profile not sealed.

## OPEN, with reasons

* **F-C, the principal one.** H3 cannot close the item without moving `journey.test.mjs:122`, whose assertion *is* the defect; B-NTC's spec and artifact pin that file and all nine B-NTC carriers share one `preflight()` over every pin. The single re-pin `228c076d… → aecb8fe4…` in `packages/B-NTC.json` and `acceptance-b-ntc-native-trend-context.json` was rehearsed and makes every carrier green again, so F-C is exactly one byte and nothing deeper. Taking it is the PM's call — or, more properly, an `h3-successors.cjs` carrier under `coverage.successors` with the substitution enumerated verbatim per `DECISIONS:113 (1)(c)`, the way B-NTC did it for NATIVE-CARRIERS. Not done here.
* **F-D** — the runner has no seat for H3 (above).
* **F-A / F-B** — two engine-tier findings measured in passing and routed, not closed: `proteinTarget` has no gated branch (`energy.cjs:116`), and `applyRead` has no first-read branch (`writers.cjs:451`), so a clean-init athlete's first weigh-in makes `trend` NaN. Neither is closable here: the engine stays byte-identical and any `trend` H3 wrote would be an invented bodyweight (H1).
* **parent pins** — `parent.decided` is `false`, both sha fields `null`: the runner resolves the chosen artifact at `CHAIN_REF` and B-NTC is not merged there yet. Per `:116 (3)` only pins move after B-NTC seals.

## Commits — author `lane-b-builder-h3 <builder-h3@earned.local>`, not pushed

`c602836` the change, the cells, the moved A0 cell, the brief, the spec · `f35c991` spec: parent stays UNDECIDED until B-NTC is on the chain ref · this report.
