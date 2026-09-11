# LANE B — closed-package tooling: executed proof

Built and executed on the owner's PC in the lane-B worktree
`work/lane-b/tooling`, branch `rebuild/lane-b-tooling`, base
`origin/rebuild/t2-client-core` @ **`acd3b6755404ab75e91087d179e48ed07467549a`** (`acd3b67`,
ledger line 100). `npm ci --include=dev` local only; `package-lock.json` untouched
(`git status --porcelain` shows nothing but the new untracked `rebuild/lanes/b/tooling/`).
Node `v24.19.0` at the pinned runtime path. Nothing under `ledger/` or
`rebuild/conform/private/` was opened; `rebuild/conform/private/` does not exist on this
tree and must not.

`87eddad` (the base both v1.1 briefs are pinned to) is an **ancestor of HEAD**, and
`git diff --name-only 87eddad acd3b67 -- rebuild/engine rebuild/conform rebuild/m4/spec`
is **0 files** — so every pre-image sha256 the briefs published holds unchanged at HEAD.
Independently re-hashed on disk and matching the briefs: `dates.cjs 19e9ce7e…`,
`sleep.cjs 3dd34e11…`, `policy.cjs a1d21404…`, `today.cjs 397532ec…`, `plan.cjs 1b26c87f…`,
`progression.cjs 7031838d…`, `volume.cjs c32298e7…`, `energy.cjs 4dd7195e…`,
`merge.cjs b69dd11f…`, `migrate.cjs 60959d58…`, `earn.cjs 4b883880…`,
`writers.cjs 00291236…`, `acceptance-native-carriers.json 295762f0…`,
`acceptance-load-writes.json 5073977b…`, the three B1 witness files `557c12e7… / 833db043…
/ f5169beb…` and B2's fourth `c90ffeaa…`.

## 1. Exit-code matrix (executed)

| invocation | exit | terminal line |
|---|---|---|
| `--ci --package B1` | 2 | `B PACKAGE B1 CI REVIEW-PENDING: 5 open obligation(s); public evidence only; no PASS is claimed` |
| `--ci --package B2` | 2 | `B PACKAGE B2 CI REVIEW-PENDING: 5 open obligation(s); public evidence only; no PASS is claimed` |
| `--full --package B1` | 2 | `B PACKAGE B1 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` |
| `--full --package B2` | 2 | `B PACKAGE B2 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` |
| `--ci --package B3` | 2 | `B PACKAGE B3 CI REVIEW-PENDING: 4 open obligation(s); public evidence only; no PASS is claimed` |
| `--ci --package B4` | 2 | `B PACKAGE B4 CI REVIEW-PENDING: 4 open obligation(s); public evidence only; no PASS is claimed` |
| `--ci` (no package) | 1 | `B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B1|B2|B3|B4` |
| `--third --package B1` | 1 | same refusal — **there is no third mode** |
| `--ci --full --package B1` | 1 | same refusal |
| `--ci --package B9` | 1 | same refusal |

No run printed a PASS word. That is the point: no authorized envelope exists yet.

## 2. `--ci --package B1` — the whole output, verbatim

```
B PACKAGE B1 SPEC OBSERVED packages/B1.json a59fc8371d7a6f913befce0addd37c9aae6a87c6e9ec212baa6907493b88e196; status=PROPOSED; 10 D-ids D10>D8>D21>D19>D16>D17>D24>D25>D27>D23; 4 declared product files
B PACKAGE B1 POSTFIX M2-B1-GRADING-TIME-WINDOW REVIEW-PENDING mode=--ci
B PACKAGE B1 ENVELOPE ABSENT; rebuild/m4/spec/acceptance-b1-grading-time-window.json is not sealed yet — no PASS word is available
B PACKAGE B1 PARENT OPTION NATIVE-CARRIERS M2-NATIVE-CARRIERS rebuild/m4/spec/acceptance-native-carriers.json 295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1 ACCEPTED at f6aa4a2b692aca4431c5a69cf9a55d06a2054733 (DECISIONS:96)
B PACKAGE B1 PARENT OPTION B2 rebuild/m4/spec/acceptance-b2-targets-identity-era.json NOT-YET-SEALED (...)
B PACKAGE B1 PARENT UNDECIDED; 2 documented options; the PM names exactly one — a single-parent immutable chain cannot have two heads (PLAN-TRACK-B-PACKAGES-v1.md:146)
B PACKAGE B1 PRODUCT NOT-IMPLEMENTED; 0 at the declared post-image / 4 at the pinned pre-image / 0 unlisted drift
B PACKAGE B1 FIDELITY OBSERVED; sourceBase 87eddad ancestor of HEAD acd3b67; 0 engine/conform/m4-spec file(s) changed since sourceBase, all declared; 18 PIN_PATHS byte-identical Git vs disk
B PACKAGE B1 PROTECTED SURFACES 4 declared, verdict-only UNCHANGED: tools/engine-test.jsx:8790-8793 (second gate P6 cells, S6 = clP(SEED)) | the seeded set-one laboratory card (sleep.cjs labAnalytics2, the only setOneRead consumer) | rebuild/conform/goldens (public census and frozen goldens) | rebuild/conform/private/live.json and the private live.main golden (never opened, named-with-values, hashed or quoted)
B PACKAGE B1 PRIVATE LIVE-TRIGGERED D16; a census change on any other declared D-id is a RED stop for a reviewed successor cell, never a golden regeneration
B PACKAGE B1 LAWS 45/45 executed | TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
B PACKAGE B1 LAW D8 D-D8-stale-sleep-does-not-claim-current-debt RED-frozen / RED-candidate / mutant-DETECTED | declared RED-frozen / RED-candidate
B PACKAGE B1 LAW D10 E-D10-calendar-week-is-seven-calendar-dates RED-frozen / RED-candidate / mutant-DETECTED | declared RED-frozen / RED-candidate
B PACKAGE B1 LAW D16 E-D16-seven-day-forecast-does-not-grade-a-month-late-read RED-frozen / RED-candidate / mutant-DETECTED | declared RED-frozen / RED-candidate
B PACKAGE B1 LAW D17 E-D17-undone-adjustment-is-not-described-as-applied RED-frozen / RED-candidate / mutant-DETECTED | declared RED-frozen / RED-candidate
B PACKAGE B1 LAW D19 P-D19-inclusive-break-end-prose-agrees-with-active-day RED-frozen / RED-candidate / mutant-DETECTED | declared RED-frozen / RED-candidate
B PACKAGE B1 LAW D21 E-D21-sleep-cleanliness-includes-the-fall-back-calendar-date RED-frozen / RED-candidate / mutant-DETECTED | declared RED-frozen / RED-candidate
B PACKAGE B1 LAW D23 E-D23-scheduled-hack-debut-is-not-presented-as-a-rest-day RED-frozen / RED-candidate / mutant-DETECTED | declared RED-frozen / RED-candidate
B PACKAGE B1 LAW D24 E-D24-partial-yesterday-remains-owed-until-calories-are-present RED-frozen / RED-candidate / mutant-DETECTED | declared RED-frozen / RED-candidate
B PACKAGE B1 LAW D25 E-D25-zero-protein-successes-cannot-be-a-good-protein-read RED-frozen / RED-candidate / mutant-DETECTED | declared RED-frozen / RED-candidate
B PACKAGE B1 LAW D27 P-D27-maintenance-is-not-described-as-a-long-stalled-cut RED-frozen / RED-candidate / mutant-DETECTED | declared RED-frozen / RED-candidate
B PACKAGE B1 LAWS DECLARED-STATE 45/45 rows agree with the spec at product phase NOT-IMPLEMENTED; the package D-ids must be GREEN-candidate / RED-frozen before any receipt
B PACKAGE B1 CARRIERS PENDING rebuild/conform/v4/postfix/legacy-b1-carriers.cjs; successor of rebuild/conform/v4/postfix/legacy-step-efficacy-carriers.cjs; 18 exact expectation substitution(s) at 18 assertion site(s); 3 frozen witness file(s) byte-identical (never edited)
B PACKAGE B1 COVERAGE MOVE witnesses-1 run -> covered byChild b1-inherited-carriers; the frozen witness file stays byte-identical
B PACKAGE B1 COVERAGE MOVE witnesses-3 run -> covered byChild b1-inherited-carriers; the frozen witness file stays byte-identical
B PACKAGE B1 CHILDREN PENDING; the package declares no own children yet (source carriers, traces, direct cases, witnesses, mutants, bites, second gate)
B PACKAGE B1 OPEN brief rebuild/lanes/b/BRIEF-B1-GRADING-TIME-WINDOW-v1.1.md not accepted by a PM ledger line
B PACKAGE B1 OPEN closed cumulative profile not sealed
B PACKAGE B1 OPEN parent artifact not named by the PM
B PACKAGE B1 OPEN product NOT-IMPLEMENTED (4 declared file(s) still at the pinned pre-image)
B PACKAGE B1 OPEN carrier successor rebuild/conform/v4/postfix/legacy-b1-carriers.cjs not authored
B PACKAGE B1 OPEN package children not authored
B PACKAGE B1 CI REVIEW-PENDING: 5 open obligation(s); public evidence only; no PASS is claimed
```

`AUDIT RED-FIRST FAIL` in the TOTAL line is **the correct state on this tree**, not a
harness error: six D-ids (D12, D33, D34, D35, D41, D43) are already repaired and GREEN on
the candidate, so the original 45/45-RED audit runner cannot pass. The runner therefore
parses the 45 per-D rows and checks each against the spec's declared state instead of
demanding exit 0. Every number reproduces the B1 v1.1 brief §0.1 item 4 exactly:
`45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions
DETECTED · 0 HARNESS_ERROR`.

## 3. `--ci --package B2` — the differences

Same shape; the 14 B2 D-ids all `RED-frozen / RED-candidate / mutant-DETECTED`, declared
`RED-candidate`, `45/45 rows agree`. Product `NOT-IMPLEMENTED`, 3 files at the pinned
pre-image (`plan.cjs`, `progression.cjs`, `volume.cjs`), 0 drift. Carrier successor
`legacy-b2-carriers.cjs` PENDING with 14 substitutions at 14 assertion sites and the three
frozen witness files (`defect-witnesses`, `-2`, `-4`) byte-identical. Coverage moves
`witnesses-1` and `witnesses-4` from `run` to `covered`. `PRIVATE LIVE-TRIGGERED D30`.
Terminal `CI REVIEW-PENDING: 5 open obligation(s)`, exit 2.

## 4. `--full` — the BLOCKED terminal line

`--full --package B1` and `--full --package B2` reproduce every `--ci` stage and then stop
at the private-oracle requirement:

```
B PACKAGE B1 CHILDREN PENDING; the package declares no own children yet (...)
B PACKAGE B1 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING
```

exit **2**. `rebuild/conform/private/live.json` does not exist on this tree; the runner
tests existence only and never opens, reads, hashes or quotes the blob. This is the
standing-rule line at `DECISIONS:97`: "every engine-package builder and reviewer runs
`--full` WITHOUT the private fixture and reports the BLOCKED
REQUIRED-PRIVATE-PREPARATION-MISSING terminal line." The code string and the
BLOCKED-vs-FAIL classification are both taken from the immutable original — the code list
comes from `native-carriers-errors.cjs`'s `codes` export, which derives it from
`postfix/run.cjs`'s own closed list.

With the private fixture present (the PM's PC session) the same run continues into the
historical 45-law audit against the pinned baseline snapshot and then the 19 original gates
through `run.cjs`'s own `gateRun`, second gate included, emitting `OBSERVED` until an
authorized envelope turns it into `PASS`.

## 5. Fail-closed controls (executed, then the spec bytes restored)

| control | result |
|---|---|
| C1 B1 and B2 both set `parent.chosen = NATIVE-CARRIERS` | `exit=1 B PACKAGE B1 FAIL; required evidence missing or failed; local diagnostics withheld` |
| C2 `energy.cjs` `pre` set to a wrong sha256 | `exit=1 B PACKAGE B4 FAIL; …` (UNLISTED-PRODUCT-DRIFT) |
| C3 `laws.D14` set to a law id that does not exist | `exit=1 B PACKAGE B4 FAIL; …` |
| C4 one extra space inside the spec JSON | `exit=1 B PACKAGE B4 FAIL; …` (non-canonical bytes) |
| C5 only B1 claims the sealed parent | `exit=2 … CI REVIEW-PENDING: 4 open obligation(s)` — one obligation closes, still no PASS |

`git status --porcelain` after the controls: clean apart from the new untracked
`rebuild/lanes/b/tooling/`. Control C5 is the positive: naming the parent is the single
PM decision that closes an obligation without touching any product byte.

## 6. Gaps against the existing package mechanism — stated, not hidden

1. **The artifact and its runner still have to be authored per package.** This tooling
   covers the spec, the chain, the product/fidelity/law/coverage accounting, the gate
   matrix, the private-oracle gate and the receipt→rerun semantics. It does **not**
   generate `acceptance-<pkg>.json`, a `--seal` path, the source-carrier construction
   (`native-carriers-source.cjs`'s literal `exactReplace` carriers), the direct/trace/
   witness/mutant children, or the `faultRun` mutant harness. Those stay per-package
   because their content is the package. A future `b-profile.cjs` could generate the
   artifact from the same spec; it is deliberately not guessed at here.
2. **`authorizations.owner` / `contract` carry `lineSha256` only, not the line text.** The
   accepted parents bind the full text (in `native-carriers-authorizations.json`, itself
   sha-pinned). A sealed B artifact must do the same; the runner's ACCEPTED branch already
   requires `claim.line` and will refuse a null.
3. **`coverage.inherited` is copied into the spec rather than read out of the parent
   artifact.** While `parent.chosen` is null there is no parent to read. Once the PM names
   one, the sealing step should derive `inherited` from that artifact's own
   `coverage.byChild` and assert equality with the spec — one line, worth adding then.
4. **The mutants column is reported, not asserted.** The runner records
   `mutant-DETECTED` / `AUDIT-FAIL` per row but only asserts the RED/GREEN status. On this
   tree D45 already reports `AUDIT-FAIL` in that column (part of the 97/104 shortfall),
   so asserting it now would fail honest evidence. The named **source** mutants are the
   package's real fault mutants anyway — B2 v1.1 §6 item 5 measured that the laws' own
   mutants go inert on a repaired candidate (97/104 → 83/104) and that D29's control is
   non-idempotent (89 → 88 GREEN controls). Both belong in the B2 artifact as recorded
   conditions, not in generic tooling.
5. **`--ci` cannot be wired into `.github/workflows/rebuild.yml` from here.** That file is
   pinned by the accepted NATIVE-CARRIERS artifact — a one-line change turns
   `native-carriers --ci` RED. Per `DECISIONS:99` the CI step additions are to be done in
   **one batched re-seal at the next engine package (B1)**, which also owes the A1 test
   step. Lane B must not touch the workflow before that re-seal.
6. **CORRECTION to BRIEF-B2 v1.1 §6:** `rebuild/engine/volume.cjs` **is** already in the
   accepted parent's `product` map (`acceptance-native-carriers.json` pins it at
   `c32298e7…`). B2 supersedes that pin rather than introducing a new product file.
   Recorded in `packages/B2.json` notes.
7. **The 19-gate `--full` path is unexecuted end to end on this machine** because the
   private fixture is absent by design; only the BLOCKED precheck was exercised. The gate
   loop itself is `run.cjs`'s own `gateRun`, unchanged and already executed by the PM's
   NATIVE-CARRIERS FULL run.

## 7. What this does not claim

No brief is accepted. No parent chain is chosen. No product byte is changed. No artifact is
sealed. No package child exists. No PASS word was printed. `rebuild/m4/spec` and
`rebuild/conform` were **read only** — nothing under them was written. Nothing under
`ledger/` or `rebuild/conform/private/` was opened.

## 8. Delivered bytes

| file (under `rebuild/lanes/b/tooling/`) | lines | bytes | sha256 |
|---|---|---|---|
| `b-package.cjs` | 359 | 25032 | `59916e1d33ce85d2203e0d3848726ea2195b3ae5403f385aefb5ee2a2a4cec63` |
| `README.md` | 204 | 12494 | `9c1b6ed70fa1c0a699a6b6db50ec042bd4abde66f358c8449917d7dfd8c703d3` |
| `packages/B1.json` | 268 | 10187 | `a59fc8371d7a6f913befce0addd37c9aae6a87c6e9ec212baa6907493b88e196` |
| `packages/B2.json` | 248 | 10875 | `4d16534534deff09c423cc1eab6f6bd50fb0d7c04ee85a3dd0a1a144202d3c03` |
| `packages/B3.json` | 148 | 6178 | `e7623371e3ce4231f5cc366d079dcd35cf0c6aabc208cf4beeeb6ea0a8a57271` |
| `packages/B4.json` | 133 | 5360 | `e9634f92cf0e213aef9fbb7d699e7a201210a227a20dd7030b4b0f4af8ee2ade` |

All four spec files are byte-canonical JSON (`JSON.stringify(parsed, null, 2) + "\n"`), all
files are LF-only, and the runner is 359 lines — under the ~400-line budget, with every
gate, law, receipt, ancestry and error-classification routine **required** from the
immutable originals rather than copied.
