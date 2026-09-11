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

> **Superseded by the section below.** Everything in §1–§8 describes the bytes the r1
> review examined (`53884bf`). The r1 review returned ACCEPT WITH CHANGES with seven
> weakenings, W1 and W2 blocking. **§post-review r1** is the fix pass: it restates the
> delivered bytes, the executed controls for W1–W7 and the re-executed bite list, and it
> is the section to read for the current behaviour.

---

# post-review r1 — W1–W7 closed

Everything above §8 describes the bytes the r1 review examined (`53884bf`). This section
is the fix pass on top of `34dc8de`, executed on the owner's PC in the same worktree
`work/lane-b/tooling`, branch `rebuild/lane-b-tooling`, Node `v24.19.0` at the pinned
runtime path, shell `powershell.exe`, absolute paths. `package-lock.json` untouched; no
other worktree touched; nothing written under `rebuild/m4/spec`, `rebuild/conform` or
`rebuild/engine` (the two temporary bite envelopes used for the receipt controls were
created and removed inside the harness, and `git status --porcelain --untracked-files=all
-- rebuild/m4/spec rebuild/conform rebuild/engine` is **empty** afterwards). Nothing under
`ledger/` or `rebuild/conform/private/` was opened; `rebuild/conform/private/` does not
exist on this tree.

**New runner sha256: `f0d20e95c6b91948c06bf066bbf6990126445fbe8e7e26c961d3e565b0bf48ec`**
(`rebuild/lanes/b/tooling/b-package.cjs`, 514 lines, 40,428 bytes, LF-only).

## r1.1 W1 — the substantive/thin split is inverted back

The review's finding: every substantive requirement was read from a spec that no receipt,
artifact or pin bound, and the runner's own bytes were in no pin list.

**What changed.** Three pins, in a chain where nothing pins itself:

| what | pinned by | control |
|---|---|---|
| `b-package.cjs` | `packages/<id>.json` → `tooling.runnerSha256` | `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER`, asserted in `spec()` before anything else |
| `packages/<id>.json` | `acceptance-<slug>.json` → `spec.sha256` | `SEALED-SPEC-BYTES-CHANGED` in `fidelity()`, and `same(m, proposed())` in `envelope()` |
| the whole artifact | the PM's `POSTFIX-ACCEPTANCE … <64-hex> ACCEPTED` ledger line | the exact-verdict regex, `L.object` at the reviewed commit, `L.checkSources` over every product and execution pin |

`envelope()` now recomputes the **entire** artifact from the spec and the bytes on disk
(`proposed()`) and asserts `same(m, proposed())`; on ACCEPTED it re-reads every pinned
product and execution byte from Git at the reviewed commit and from the worktree through
`legacy-gates.checkSources` — the original routine, not a copy. `fidelity()`'s change scan
now covers `rebuild/lanes/b/tooling` alongside `rebuild/engine`, `rebuild/conform` and
`rebuild/m4/spec`, and the tooling inventory it accepts is fixed in the runner.

**Executed control.**

| bite | command | outcome |
|---|---|---|
| B10 (was *accepted silently*) | inject `console.log('B PACKAGE RUNNER-EDIT injected line executed')` into `b-package.cjs`, then `--ci --package B4` | **exit 1** `B PACKAGE B4 FAIL; …` in 48 ms — refused at the first spec check |
| B9 (was *accepted silently*) | delete `rebuild/engine/dates.cjs` from `B1.product`, then `--ci --package B1` | **exit 1** `B PACKAGE B1 FAIL; …` (`UNLISTED-PRODUCT-DRIFT … pinned by the parent and is not in this product inventory`) |
| W1-spec (new) | seal a genuine artifact for B1, then append one note to `packages/B1.json` | **exit 1** — `SEALED-SPEC-BYTES-CHANGED` / `same(m, proposed())` |
| W1-runner (new) | seal a genuine artifact for B1, restore the spec, then inject a line into `b-package.cjs` | **exit 1** in 53 ms |

## r1.2 W2 — a gate is covered only by an executed child

`fs.existsSync` is gone from the coverage path entirely. `coverage.inherited` and
`coverage.moves` now map a gate to the **`name` of a declared `children[]` entry**;
`children()` executes every one of them in this process and returns the map of names that
exited 0 with their exact declared verdict matched; `coverage()` and `gates()` both assert
`ran.get(child).ok` for every covered gate. The inherited set must additionally be exactly
the parent artifact's own `coverage.byChild` gate set.

All four specs now declare the five accepted NATIVE-CARRIERS successor children and
therefore *earn* the nine inherited gates in every run:

```
B PACKAGE B1 CHILD source-carriers OBSERVED; exit 0 and exact declared verdict
B PACKAGE B1 CHILD inherited-carriers OBSERVED; exit 0 and exact declared verdict
B PACKAGE B1 CHILD defect-witnesses OBSERVED; exit 0 and exact declared verdict
B PACKAGE B1 CHILD writers-differential OBSERVED; exit 0 and exact declared verdict
B PACKAGE B1 CHILD second-gate OBSERVED; exit 0 and exact declared verdict
B PACKAGE B1 COVERAGE 9/19 original gate(s) covered by 5 executed child(ren) (9 inherited, 0 moved); 10 re-execute under --full
B PACKAGE B1 COVERAGE migrate-source <- child source-carriers executed in this run; exit 0 and exact declared verdict
…
```

`coverage.moves` is empty in all four specs: `legacy-b1-carriers.cjs` /
`legacy-b2-carriers.cjs` do not exist, so `witnesses-1`, `witnesses-3` and `witnesses-4`
stay in `run` and will re-execute under `--full`. The declared verdict is never echoed —
it contains the word `PASS`, and a REVIEW-PENDING run prints that word only inside its own
two negations.

**Executed control.**

| bite | command | outcome |
|---|---|---|
| B5 (was *accepted silently*) | rewrite `B4.coverage.inherited` so all **19** gates map to one unrelated existing file (`native-carriers-source`) | **exit 1** `COVERAGE-CHILD-NOT-DECLARED` |
| B5b | a covered gate id that is not one of the 19 | **exit 1** (unchanged from r1) |
| B8 (was *accepted silently*) | add `{name:'trivial', argv:['-e','0'], needle:''}` to `B4.children` | **exit 1** `CHILD-NEEDLE-EMPTY` (and `-e` is in the runner's inline-code refusal set) |

## r1.3 W3 — `children[]` is validated

`name` is `[a-z0-9][a-z0-9-]{1,39}` and unique; `needle` is a string with at least 8
non-blank characters; `argv` is a non-empty array of non-empty strings, none of which may
be `-e`, `--eval`, `-p`, `--print`, `--input-type`, `-r`, `--require` or `--import`; every
non-flag element must be a relative, traversal-free, **existing** file under one of the
five allowed roots (`rebuild/m4/spec/`, `rebuild/conform/v4/postfix/`,
`rebuild/engine/test/`, `rebuild/m4/workout/test/`, `rebuild/m3/w7-preview/test/`); and at
least one non-flag element must exist, so `argv:['-e','0']` refuses as
`CHILD-ARGV-EXECUTES-NO-FILE` even with a non-empty needle. **Control: bite B8, exit 1.**

## r1.4 W4 — parent and grandparent pins are re-asserted at run time

`option()` now also reads the parent artifact **from Git at the commit its own receipt
names as reviewed** and requires byte equality with the disk copy and with the declared
sha256, plus `merge-base --is-ancestor <reviewed commit> HEAD`. `pins()` then walks
`{...parent.product, ...parent.executionPins}` (skipping the files this spec declares,
which `product()` owns) and `{...grandparent.product, ...grandparent.executionPins}` minus
everything the parent superseded, and verifies the grandparent's artifact bytes, its
ACCEPTED envelope and its receipt.

**Control (executed, honest run):**

```
B PACKAGE B1 PARENT OPTION NATIVE-CARRIERS M2-NATIVE-CARRIERS rebuild/m4/spec/acceptance-native-carriers.json 295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1 ACCEPTED at 84d8f28892973b6cf68f37d2fe5ce80d97b1d165 (DECISIONS:96); bytes identical on disk and in Git
B PACKAGE B1 PARENT PINS RE-ASSERTED at run time; 31 pin(s) from rebuild/m4/spec/acceptance-native-carriers.json plus its 20 product pins through the inventory below, and 23 un-superseded grandparent pin(s) from rebuild/m4/spec/acceptance-load-writes.json, byte-identical on disk; parent artifact byte-identical in Git at 84d8f28892973b6cf68f37d2fe5ce80d97b1d165
```

That is 51 parent pins (20 product + 31 execution) and 23 grandparent pins live-checked on
every run. The eight grandparent product pins and one execution pin that NATIVE-CARRIERS
superseded (`plan`, `progression`, `sleep`, `today`, `writers`, `index`, `browser-engine`,
`build.mjs`, `.github/workflows/rebuild.yml`) are correctly skipped, because the parent's
own pin governs them and is itself checked.

`B1.product` and the three other specs therefore now carry **all 20** parent-pinned product
files: the repair files with role `edited` over the parent's pin, the rest with role
`carried` (`pre === post`). Dropping one is bite B9, above.

## r1.5 W5 — the envelope is evaluated after the gates

`envelope()` returns a `key` identifying everything the evaluation depended on (`ABSENT`,
`PENDING:<artifact sha>` or `ACCEPTED:<artifact sha>:<reviewed commit>:<receipt base>`).
The first evaluation happens before the evidence for one reason only — to choose the
header word and hand `fidelity()` the sealed pins. The evaluation that **decides** the
terminal word and the exit code runs **after `privateOracle()`, `historical()` and all 19
gates**, and `assert.equal(last.key, first.key)` refuses an artifact, review, receipt,
spec or runner swapped mid-run (`ENVELOPE-CHANGED-DURING-THE-RUN`). This is strictly
stronger than the accepted originals, which call `Profile.verify()` twice without
comparing the two results.

## r1.6 W6 — `authorizations.contract` is verified by exact ledger bytes

`owner`, `contract` and `theme` are now `{ledgerLine, role, line, lineSha256}` with the
**full line text**, and `claim()` requires `sha256(line) === lineSha256`. Every run
(`--ci` and `--full`, sealed or not) verifies `owner` and `contract` through
`legacy-gates.verifyReceipt` against `rebuild/DECISIONS.md` **at the parent's receipt
base**, under their own roles, with content mentions (`M2-RULE` for the owner line,
`POSTFIX-GATE BRIEF` for the contract line), and asserts
`contract.lineSha256 === parent.authorizations.contract.lineSha256`. The stray
`inheritFromParent` key is gone — `claim()` closes the key set.

**Control (executed, honest run):**

```
B PACKAGE B1 AUTHORITY OBSERVED owner DECISIONS:60 and contract DECISIONS:49 present as exact ledger line bytes at f6aa4a2 under their own roles; contract inherited byte-equal from the parent; theme NULL — no PASS word is available
```

On an ACCEPTED envelope all three lines are re-verified at the package's own receipt base,
the receipt itself is checked with `mentions: [packageId, artifactPath, artifactSha256]`,
and the theme line must contain the package id. Bites B4a–B4d are the executed negatives.

## r1.7 W7 — no self-declared exemptions

`ARTIFACT` and `REVIEW` are **derived in the runner** from the package id
(`rebuild/m4/spec/acceptance-<packageId minus "M2-" lowercased>.json` and
`review-….json`); `spec()` asserts that `s.artifact.file` and `s.artifact.review` agree
with them, so a spec can only confirm the paths, never choose them. The old
`rebuild/m4/spec/<id.toLowerCase()>-*` wildcard is gone; the `UNLISTED-SOURCE-CHANGE`
allow-list is exactly: the declared product files, those two derived paths, the fixed
`TOOLING_FILES` inventory, the declared carrier successor, and the files a declared child
executes. `CHILD_ROOTS`, `TOOLING_FILES` and `NO_INLINE` are all constants in the runner.

## r1.8 The reviewer's 22 bites, re-executed

All 22 refuse. Spec bytes, runner bytes and temporary envelopes were restored after each
group; `git status --porcelain` afterwards shows only the five intended lane-B tooling
files, and nothing untracked under `rebuild/m4/spec`, `rebuild/conform` or
`rebuild/engine`. No run printed a PASS word outside the two negations
(`no PASS word is available`, `no PASS is claimed`).

| # | bite | r1 | now |
|---|---|---|---|
| 1 | no args | exit 1 | **exit 1** `B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B1|B2|B3|B4` |
| 2 | `--third --package B1` | exit 1 | **exit 1** same refusal |
| 3 | `--ci --full --package B1` | exit 1 | **exit 1** same refusal |
| 4 | `--ci --package B9` | exit 1 | **exit 1** same refusal |
| 5 | `--ci --package b1` (case-exact) | exit 1 | **exit 1** same refusal |
| 6 | B1 `laws.D10` → a law id that does not exist | exit 1 | **exit 1** after the 45-law run |
| 7 | B2 both B1 and B2 claim `NATIVE-CARRIERS`, running B1 | exit 1 | **exit 1** SINGLE-PARENT-CHAIN |
| 8 | B2 the same, running B2 | exit 1 | **exit 1** SINGLE-PARENT-CHAIN |
| 9 | B3 `B4.product['rebuild/engine/energy.cjs'].pre` → wrong sha256 | exit 1 | **exit 1** UNLISTED-PRODUCT-DRIFT (now: *pre-image is not the parent pin*) |
| 10 | B4a a genuine `M2-NATIVE-CARRIERS` receipt reused as the B1 acceptance | exit 1 | **exit 1** (receipt content mentions) |
| 11 | B4b forged ACCEPTED receipt, **wrong** artifact hash | exit 1 | **exit 1** |
| 12 | B4c forged ACCEPTED receipt, **correct** artifact hash | exit 1 | **exit 1** (the line is not in the ledger at its base) |
| 13 | B4d the same forgery with `authorizations.theme` null | exit 1 | **exit 1** THEME-AUTHORIZATION-UNAVAILABLE |
| 14 | B4e PENDING envelope, `receipt: null` | exit 2, no PASS | **exit 2**, `ENVELOPE PENDING artifact=… spec=… runner=…`, `CI REVIEW-PENDING: 4 open obligation(s)`, no PASS word |
| 15 | B4f PENDING envelope carrying a receipt | exit 1 | **exit 1** |
| 16 | B5 all 19 gates covered by one unrelated existing file | **accepted silently** | **exit 1** COVERAGE-CHILD-NOT-DECLARED |
| 17 | B5b a covered gate id that is not one of the 19 | exit 1 | **exit 1** |
| 18 | B6a carried `D33` smuggled into `dIds` | exit 1 | **exit 1** |
| 19 | B6b out-of-range `D46` in `dIds` | exit 1 | **exit 1** |
| 20 | B7 one extra space inside the spec JSON | exit 1 | **exit 1** non-canonical bytes |
| 21 | B8 declared child with empty needle and no-op argv | **accepted, closed an obligation** | **exit 1** CHILD-NEEDLE-EMPTY |
| 22 | B9 one product file deleted from the spec inventory | **accepted silently** | **exit 1** UNLISTED-PRODUCT-DRIFT |
| 23 | B10 `b-package.cjs` itself edited | **injected line executed, no refusal** | **exit 1** RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER |
| +2 | W1-spec / W1-runner: spec or runner edited **after seal** | not tested in r1 | **exit 1** each |

(Rows 1–5 are the r1 §2 usage refusals, rows 6–23 the r1 §4 table; B2 counts once as a
bite and twice as a run, which is why the table has 23 rows for 22 bites. The four bites
r1 recorded as *accepted silently* are rows 16, 21, 22, 23.)

## r1.9 The tip demo

| invocation | exit | terminal line |
|---|---|---|
| `--ci --package B1` | **2** | `B PACKAGE B1 CI REVIEW-PENDING: 5 open obligation(s); public evidence only; no PASS is claimed` |
| `--ci --package B2` | **2** | `B PACKAGE B2 CI REVIEW-PENDING: 5 open obligation(s); public evidence only; no PASS is claimed` |
| `--ci --package B3` | **2** | `B PACKAGE B3 CI REVIEW-PENDING: 10 open obligation(s); public evidence only; no PASS is claimed` |
| `--ci --package B4` | **2** | `B PACKAGE B4 CI REVIEW-PENDING: 10 open obligation(s); public evidence only; no PASS is claimed` |
| `--full --package B1` | **2** | `B PACKAGE B1 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` |
| `--full --package B2` | **2** | `B PACKAGE B2 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` |

All six ran `45/45` register laws with `0 HARNESS_ERROR`:
`TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls ·
97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL`, and
`LAWS DECLARED-STATE 45/45 rows agree with the spec at product phase NOT-IMPLEMENTED`. All
six executed the five children and reported `COVERAGE 9/19 original gate(s) covered by 5
executed child(ren)`. `--full` still stops at the private-oracle existence check
(`DECISIONS:97`); the blob is never opened, read, hashed or quoted.

B3 and B4 report **10** open obligations rather than 4 because they document no sealed
parent option at all, and the new checks refuse to pretend otherwise — each of
`no single sealed chain head on disk`, `parent and grandparent artifact pins not
re-asserted`, `product inventory completeness unverified`, `owner and contract ledger lines
not verified at a chain commit` and `inherited coverage unverified against a parent
artifact` is recorded as its own obligation instead of being skipped silently. B1 and B2
keep 5, with `package children not authored` replaced by the theme obligation.

### `--ci --package B1`, verbatim

```
B PACKAGE B1 SPEC OBSERVED packages/B1.json 26590872127bc2efec65af69f6287c551ccead14ef62a998aea87b386d57afd2; runner f0d20e95c6b91948c06bf066bbf6990126445fbe8e7e26c961d3e565b0bf48ec; status=PROPOSED; 10 D-ids D10>D8>D21>D19>D16>D17>D24>D25>D27>D23; 20 declared product files; 5 declared child(ren)
B PACKAGE B1 PARENT OPTION NATIVE-CARRIERS M2-NATIVE-CARRIERS rebuild/m4/spec/acceptance-native-carriers.json 295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1 ACCEPTED at 84d8f28892973b6cf68f37d2fe5ce80d97b1d165 (DECISIONS:96); bytes identical on disk and in Git
B PACKAGE B1 PARENT OPTION B2 rebuild/m4/spec/acceptance-b2-targets-identity-era.json NOT-YET-SEALED (...)
B PACKAGE B1 PARENT UNDECIDED; 2 documented options; the PM names exactly one — a single-parent immutable chain cannot have two heads (PLAN-TRACK-B-PACKAGES-v1.md:146)
B PACKAGE B1 PARENT PROVISIONAL NATIVE-CARRIERS; the one sealed chain head on disk carries the pins re-asserted below — it is NOT a claim on the chain
B PACKAGE B1 POSTFIX M2-B1-GRADING-TIME-WINDOW REVIEW-PENDING mode=--ci
B PACKAGE B1 ENVELOPE ABSENT; rebuild/m4/spec/acceptance-b1-grading-time-window.json is not sealed yet — no PASS word is available
B PACKAGE B1 PARENT PINS RE-ASSERTED at run time; 31 pin(s) from rebuild/m4/spec/acceptance-native-carriers.json plus its 20 product pins through the inventory below, and 23 un-superseded grandparent pin(s) from rebuild/m4/spec/acceptance-load-writes.json, byte-identical on disk; parent artifact byte-identical in Git at 84d8f28892973b6cf68f37d2fe5ce80d97b1d165
B PACKAGE B1 PRODUCT NOT-IMPLEMENTED; 0 at the declared post-image / 4 at the pinned pre-image / 16 carried byte-identical from the parent / 0 unlisted drift; the inventory covers all 20 parent-pinned product files
B PACKAGE B1 FIDELITY OBSERVED; sourceBase 87eddad ancestor of HEAD 34dc8de; 7 engine/conform/m4-spec/lane-b-tooling file(s) changed since sourceBase, all in the fixed inventory; runner f0d20e95c6b9 and spec 26590872127b pinned (artifact not sealed yet); 18 PIN_PATHS byte-identical Git vs disk
B PACKAGE B1 AUTHORITY OBSERVED owner DECISIONS:60 and contract DECISIONS:49 present as exact ledger line bytes at f6aa4a2 under their own roles; contract inherited byte-equal from the parent; theme NULL — no PASS word is available
B PACKAGE B1 PROTECTED SURFACES 4 declared, verdict-only UNCHANGED: ...
B PACKAGE B1 PRIVATE LIVE-TRIGGERED D16; a census change on any other declared D-id is a RED stop for a reviewed successor cell, never a golden regeneration
B PACKAGE B1 LAWS 45/45 executed | TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL
B PACKAGE B1 LAW D8 ... (ten declared rows, each RED-frozen / RED-candidate / mutant-DETECTED, matching the declaration)
B PACKAGE B1 LAWS DECLARED-STATE 45/45 rows agree with the spec at product phase NOT-IMPLEMENTED; the package D-ids must be GREEN-candidate / RED-frozen before any receipt
B PACKAGE B1 CARRIERS PENDING rebuild/conform/v4/postfix/legacy-b1-carriers.cjs; successor of rebuild/conform/v4/postfix/legacy-step-efficacy-carriers.cjs; 18 exact expectation substitution(s) at 18 assertion site(s); 3 frozen witness file(s) byte-identical (never edited)
B PACKAGE B1 CHILD source-carriers OBSERVED; exit 0 and exact declared verdict
B PACKAGE B1 CHILD inherited-carriers OBSERVED; exit 0 and exact declared verdict
B PACKAGE B1 CHILD defect-witnesses OBSERVED; exit 0 and exact declared verdict
B PACKAGE B1 CHILD writers-differential OBSERVED; exit 0 and exact declared verdict
B PACKAGE B1 CHILD second-gate OBSERVED; exit 0 and exact declared verdict
B PACKAGE B1 COVERAGE 9/19 original gate(s) covered by 5 executed child(ren) (9 inherited, 0 moved); 10 re-execute under --full
B PACKAGE B1 COVERAGE migrate-source <- child source-carriers executed in this run; exit 0 and exact declared verdict
B PACKAGE B1 COVERAGE merge-source <- child source-carriers executed in this run; exit 0 and exact declared verdict
B PACKAGE B1 COVERAGE writers-source <- child source-carriers executed in this run; exit 0 and exact declared verdict
B PACKAGE B1 COVERAGE witnesses-2 <- child inherited-carriers executed in this run; exit 0 and exact declared verdict
B PACKAGE B1 COVERAGE witnesses-5 <- child inherited-carriers executed in this run; exit 0 and exact declared verdict
B PACKAGE B1 COVERAGE migrate-differential <- child inherited-carriers executed in this run; exit 0 and exact declared verdict
B PACKAGE B1 COVERAGE witnesses-7 <- child defect-witnesses executed in this run; exit 0 and exact declared verdict
B PACKAGE B1 COVERAGE writers-differential <- child writers-differential executed in this run; exit 0 and exact declared verdict
B PACKAGE B1 COVERAGE second-gate <- child second-gate executed in this run; exit 0 and exact declared verdict
B PACKAGE B1 OPEN brief rebuild/lanes/b/BRIEF-B1-GRADING-TIME-WINDOW-v1.1.md not accepted by a PM ledger line
B PACKAGE B1 OPEN parent artifact not named by the PM
B PACKAGE B1 OPEN product NOT-IMPLEMENTED (4 declared file(s) still at the pinned pre-image)
B PACKAGE B1 OPEN theme ledger line accepting this brief is null (THEME-AUTHORIZATION-UNAVAILABLE before any receipt)
B PACKAGE B1 OPEN carrier successor rebuild/conform/v4/postfix/legacy-b1-carriers.cjs not authored
B PACKAGE B1 OPEN closed cumulative profile not sealed
B PACKAGE B1 CI REVIEW-PENDING: 5 open obligation(s); public evidence only; no PASS is claimed
```

## r1.10 Delivered bytes after the fix

| file (under `rebuild/lanes/b/tooling/`) | lines | bytes | sha256 |
|---|---|---|---|
| `b-package.cjs` | 514 | 40428 | `f0d20e95c6b91948c06bf066bbf6990126445fbe8e7e26c961d3e565b0bf48ec` |
| `README.md` | 323 | 20922 | `f9e6649b8a16e310d5cdaa6ee8f384487bbc7638d622c7277c297fec0292c307` |
| `packages/B1.json` | 386 | 22590 | `26590872127bc2efec65af69f6287c551ccead14ef62a998aea87b386d57afd2` |
| `packages/B2.json` | 371 | 23501 | `17748626a428cd1028a4702b4978bed77ca2aaf477b6d3717c6fea65217b216b` |
| `packages/B3.json` | 268 | 18450 | `c5985d1793ee34b35b17884b99a8a95252536989a5bb3084ea55d08521ffca44` |
| `packages/B4.json` | 258 | 17861 | `58950ea284880bf762100269dfdade744ddc214375741aaf678f57612c21584a` |

All four specs remain byte-canonical JSON (`JSON.stringify(parsed, null, 2) + "\n"`) and
every file is LF-only. **The four spec files each pin the runner sha256 above; changing
`b-package.cjs` without re-taking `tooling.runnerSha256` in all four is a refusal, by
design.**

## r1.11 What is still open — stated, not hidden

1. **The runner is 514 lines, not the ~450 the fix brief asked for.** Nothing is copied
   from the originals — `GATES`/`gateRun`, `PIN_PATHS`, `git`/`object`/`verifyReceipt`/
   `checkSources`/`historicalAudit`, `sha`, `parseExact`, the BLOCKED `codes` list and the
   reference bundles are all **required**. The growth is the four new mechanisms W1, W2,
   W4 and W6 demand: `proposed()` + the artifact recomputation, the executed-child
   coverage map, the parent/grandparent pin walk, and the ledger-citation binding. Cutting
   further would mean cutting a control or a comment, not a copy.
2. **`coverage.moves` is empty in all four specs.** The moves B1 and B2 intend
   (`witnesses-1`, `witnesses-3`, `witnesses-4`) become real only when
   `legacy-b<N>-carriers.cjs` exists and is declared in `children[]`; until then those
   gates re-execute under `--full`, which is the fail-closed direction. Recorded in each
   spec's `notes`.
3. **B3 and B4 document no sealed parent option**, so their parent pins, product-inventory
   completeness, ledger citations and inherited coverage are unverifiable today. Each is
   an explicit open obligation rather than a silent skip, and all four resolve the moment
   the PM names the chain.
4. **The nine inherited gates are still covered by the PARENT's children.** That is
   correct for the first B package in the chain (it is exactly what
   `native-carriers-package.cjs` does with the M2-LOAD-WRITES successors), but whichever
   package is *second* must re-take its inherited set from the first package's artifact —
   the runner already asserts that equality whenever a parent is bound.
5. **The ACCEPTED happy path is still untested by a genuine receipt**, because no PM
   ledger line for a B package exists. Every negative around it is executed (bites B4a–B4f
   plus the two new post-seal controls); the positive needs the PM.
6. **`--ci` still cannot be wired into `.github/workflows/rebuild.yml`** — unchanged from
   §6 item 5; that file is pinned by the accepted NATIVE-CARRIERS artifact and belongs to
   the one batched re-seal at B1 (`DECISIONS:99`).
7. **The 19-gate `--full` path past `privateOracle()` remains unexecuted here** by design:
   the private fixture is absent on this machine and must stay absent (`DECISIONS:97`).
   W2's coverage accounting, however, is no longer dead code — it now executes in **every**
   `--ci` run, because the covering children run there.

# post-review r2 — N1–N5 closed

Everything above describes the bytes r1 and r2 examined. This section is the **second** fix
pass, on top of the r2 review `f385a78`, executed on the owner's PC in the worktree
`work/lane-b/tooling`, branch `rebuild/lane-b-tooling`, Node `v24.19.0` at the pinned
runtime path, shell `powershell.exe`, absolute paths, fresh process per call.
`package-lock.json` untouched; no other worktree touched; **nothing committed under
`rebuild/m4/spec`, `rebuild/conform`, `rebuild/engine` or `.github`**. The bite harness
mutates files under those trees and restores the exact bytes in a `finally`;
`git status --porcelain --untracked-files=all` is **empty** afterwards, and so is the same
command scoped to `rebuild/m4/spec rebuild/conform rebuild/engine .github rebuild/lanes
rebuild/DECISIONS.md rebuild/m3`. Nothing under `ledger/` or `rebuild/conform/private/`
was opened; `rebuild/conform/private/` does not exist on this tree and was not created.

**New runner sha256: `eaa731a143438dd0238925397c5ff3450fc8e1bafee5220f0332150a1460b81d`**
(`rebuild/lanes/b/tooling/b-package.cjs`, 684 lines, 53,683 bytes, LF-only).

The r2 verdict's standing condition was: *"`b-package.cjs` must not seal or claim PASS for
any B package whose `coverage.moves` is non-empty, or whose `children[].argv` carries any
flag outside `--test` / `--test-reporter=tap`, until N1–N3 below are closed."* Both halves
are now enforced **in the runner** rather than held by convention.

## r2.1 N1 — `coverage.moves` is bounded, and so is `coverage.inherited`

The finding: `coverage.moves` was "bounded by nothing at all: any of the remaining ten
original gates, mapped to any declared child", and `covered.size` was printed but never
asserted where the accepted original pins `assert.equal(m.coverage.covered.length, 9)`.

**What changed.** Four bounds, all read out of the originals rather than re-typed:

| bound | how | refusal |
|---|---|---|
| the inherited map is the parent's, **gate and child** | `assert.deepEqual(s.coverage.inherited, byChild)` — the whole map, not its key set | `INHERITED-COVERAGE-IS-NOT-THE-PARENT-COVERED-SET` |
| an inherited child executes a **parent-pinned** file | its argv target must be in the parent artifact's `executionPins` or `product` — the generic form of the original's `assert(m.executionPins['…-'+child+'.cjs'])` | `INHERITED-COVERAGE-CHILD-IS-NOT-A-PARENT-PINNED-EXECUTABLE` |
| a move is **declared with a reason** | `moves[gate]` is `{child, reason}`, reason single-line and ≥ 16 non-blank characters | `COVERAGE-MOVE-REASON-MISSING` |
| a move's child **executes the gate's own original** | `GATE_FILE` is built from `R.GATES`; the child's argv must name that file, or a file whose **bytes** require it — every relative `require`/`import` specifier is resolved against its own directory and compared | `COVERAGE-MOVE-CHILD-DOES-NOT-EXECUTE-THE-ORIGINAL` |
| **one gate per child**, unless `run.cjs` groups them | `GATE_GROUP` is derived from `R.GATES` by executable; the only group is `conformance` + `selftest` on `rebuild/conform/run.cjs` | `COVERAGE-MOVE-CHILD-COVERS-MORE-GATES-THAN-run.cjs-GROUPS` |
| the covered set is **closed** | `covered == parent byChild + declared moves` | `COVERED-SET-BOUND` |

A move's child may also not be one of the inherited children
(`COVERAGE-MOVE-CHILD-IS-AN-INHERITED-CHILD`), so a package cannot re-use the parent's
carriers to absorb gates they never ran.

**Executed.**

| bite | what | exit | fired in |
|---|---|---|---|
| B07 | the other ten gates into `moves`, all on one declared child (r2's own bite) | **1** | `spec()`, before any output |
| B07b | the same ten, now `{child, reason}`-shaped so the schema alone cannot refuse | **1** | `spec()` |
| B07c | one move to a NEW child running a real pinned file that does not require the gate original | **1** | `spec()` |
| B07e | the one `run.cjs`-grouped pair moved to a child that cannot reach `rebuild/conform/run.cjs` (outside the child roots) | **1** | `spec()` |
| B08 | one gate dropped from `inherited` | **1** | — |
| B08b | the parent's nine gate ids kept, every one re-pointed at one declared child | **1** | `coverage()`, **after** all five children had run |
| **B30** | **the composite: all 19 gates, nine as `inherited` and ten as `moves`, on ONE `node --version` child** | **1** | `spec()` |
| **B07d** | **POSITIVE CONTROL: a move whose child argv IS `rebuild/engine/test/defect-witnesses.cjs`, the gate's own original executable** | **2** | accepted — `CI REVIEW-PENDING: 5 open obligation(s)`, no PASS |

B07d is the control that matters as much as the refusals: the bound is not "refuse every
move", it is "a move must carry the gate's own work". A legitimate move is accepted and
prints its reason on the `COVERAGE <gate> <- child … MOVED, carries <original>` line.

## r2.2 N2 — every inline-code form refuses, by allow-list

The finding: `NO_INLINE` was an **anchored exact match**, so `--eval=…` (and `--print=`,
`--input-type=`, `--require=`) passed straight through and the child's stdout became
whatever the spec wrote.

**What changed.** The deny-list is replaced by an **allow-list**, exactly as r2 required:
the only flags a child may pass are `--test` and `--test-reporter=tap` — the only two the
accepted originals ever pass (`load-write-package.cjs:38-41`,
`native-carriers-package.cjs:64-70`) — and only *before* the file. `NO_INLINE` survives as
a named backstop, now matched on the flag **prefix** (`(?:=|$)`) so the bare and `=<code>`
spellings are one rule, and `NO_RUN` names the short-circuit forms separately.

**Executed — 19 argv probes, every one exit 1:**

| probe | argv form | refusal |
|---|---|---|
| B11 | `['-e','0']` | `CHILD-ARGV-INLINE-CODE` |
| B16 | `['--eval=console.log("NATIVE SECOND GATE: forged…")', <pinned child>]` (r2's own bite) | `CHILD-ARGV-INLINE-CODE` |
| N2a–N2m | `-e`, `--eval`, `--eval=…`, `-p`, `--print`, `--print=1`, `--input-type`, `--input-type=module`, `-r`, `--require`, `--require=<allowed root file>`, `--import`, `--import=…` | `CHILD-ARGV-INLINE-CODE` |
| N2n–N2p | `-v`, `--help`, `-h` | `CHILD-ARGV-SHORT-CIRCUITS-EXECUTION` |
| N2q | `['-']` — stdin only, no file | `CHILD-ARGV-STDIN-OR-END-OF-OPTIONS` |
| N2r | `['--', <pinned child>]` | `CHILD-ARGV-STDIN-OR-END-OF-OPTIONS` |
| N2s | `['--test','--experimental-loader=./x.mjs', <pinned child>]` — a smuggled flag behind an allow-listed one | `CHILD-ARGV-INLINE-CODE` |
| B12/B13/B14 | target outside the roots / absent / traversing out | `CHILD-ARGV-TARGET` |

Note `-r`/`--require` of an **allowed** root also refuses. The originals never use it, so
the allow-list does not carry it; widening it would be a reviewed change to this file.

## r2.3 N3 — a needle is satisfied only by a real execution

The finding: `node --version` "prints 8 characters and exits 0 without running the named
file", and `stdout.includes(needle)` accepted it.

**What changed.** Three conditions, all of which must hold:

1. **argv is file-first.** The first non-flag token must be an existing file under one of
   the five fixed roots, and **no token may stand after it that begins with `-`**. So
   `node --version pinned.cjs` and `node pinned.cjs --version` both refuse, the first as
   `CHILD-ARGV-SHORT-CIRCUITS-EXECUTION`, the second additionally as
   `CHILD-ARGV-FLAG-AFTER-FILE`.
2. **The needle is a terminal line, not a substring.** It must match at the **head of a
   line** of stdout (`CHILD-NEEDLE-NOT-A-TERMINAL-LINE`), which closes r2's "a child that
   prints the needle inside any longer text, or inside a `NOT OBSERVED: …` sentence".
3. **The output floor.** stdout must be **≥ 200 bytes**, or carry one of the original
   gates' own terminal lines — `GATE_TERMINAL`, built from `R.GATES`' ids as
   `^LEGACY (<id>|…) PASS \| `, the line `run.cjs`'s `gateRun` emits
   (`CHILD-DID-NOT-REALLY-EXECUTE`).

`node --version` fails (1) *and* (3): ten bytes of stdout, no gate terminal line. The five
real children clear the floor by a wide margin — 926, 815, 480, 1068 and 227 bytes — and
every one of them prints its declared verdict at line start.

**Executed.**

| bite | what | exit |
|---|---|---|
| **B15** | `argv: ['--version', <pinned child>]`, needle `v24.19.0` (r2's own bite) | **1** |
| B15b | `argv: [<pinned child>, '--version']` — the flag after the file | **1** |
| B09 / B10 | empty needle / seven-character needle | **1** / **1** |

And the floor in isolation, with the argv held **legal** throughout, so nothing but the
execution rule can be doing the refusing — each probe declares a sixth child running a real
file under a child root and varies only what it prints:

| probe | stdout | exit | which rule |
|---|---|---|---|
| FLOOR-A | needle at line start, **26 bytes**, no gate terminal line | **1** | the 200-byte floor |
| FLOOR-B | **over 200 bytes**, needle present only MID-line | **1** | needle-at-line-start |
| FLOOR-C | **77 bytes**, needle at line start **plus** a genuine `LEGACY second-gate PASS \| …` line | **2** | the OR branch — accepted, `5 open obligation(s)`, no PASS |

## r2.4 N4 — the brief acceptance is a verified ledger line

The finding: `status: 'BRIEF-ACCEPTED'` plus `brief.acceptedLedgerLine: <any truthy>`
cleared a blocking obligation; "the number is never resolved to a line".

**What changed.** `brief.acceptedLedgerLine` is now `null` **or** a `claim()`-shaped
citation `{ledgerLine, role: 'cowork', line, lineSha256}` — the same shape owner, contract
and theme carry. `spec()` checks the shape, that `sha256(line) === lineSha256`, that
`status` is `BRIEF-ACCEPTED`, that the line names this package id **and** this brief path,
and that it ends in the **`ACCEPTED` terminal word**. `authority()` then resolves it the
way the originals resolve every other citation: `L.verifyReceipt` reads
`rebuild/DECISIONS.md` **out of Git at the parent's receipt base** and requires the exact
line bytes, under role `cowork`, exactly once. The ACCEPTED branch of `envelope()`
re-verifies it at the package's own receipt base alongside owner, contract and theme, and
refuses PASS outright without it (`BRIEF-ACCEPTANCE-UNAVAILABLE`).

| bite | what | exit | fired in |
|---|---|---|---|
| **B29** | `status: 'BRIEF-ACCEPTED'` + `acceptedLedgerLine: 101` (r2's own bite — it used to drop 5 opens to 4) | **1** | `spec()` — the claim shape |
| **B29b** | a **self-consistent invented claim**: correct sha256, names the package and the brief, ends ` · ACCEPTED`, stands in no ledger | **1** | `authority()`, after `FIDELITY OBSERVED` — the Git lookup |

With `acceptedLedgerLine: null` (all four specs today) the obligation simply stays open —
`OPEN brief rebuild/lanes/b/BRIEF-B1-… not accepted by a PM ledger line`. There is no third
outcome, and a claim made with no sealed parent to anchor it at refuses
(`BRIEF-ACCEPTANCE-UNVERIFIABLE`) rather than counting.

## r2.5 N5 — the theme is verified on every run, not only inside an ACCEPTED envelope

The finding: `authority()` verified owner and contract against Git but `theme` "only inside
the ACCEPTED branch of `envelope()`", so pre-seal an invented line "removes a blocking
obligation and prints as though it had been observed".

**What changed.** `authority()` now runs the theme through the identical
`L.verifyReceipt` path as owner and contract — exact line bytes in Git at the parent's
receipt base, role `cowork`, mentioning this package id.

| bite | what | exit | fired in |
|---|---|---|---|
| **B31** | an entirely invented theme line — self-consistent sha256, contains the package id, ends ` · ACCEPTED`, exists in no ledger (r2's own bite — it used to drop 5 opens to 4) | **1** | `authority()`, after `FIDELITY OBSERVED` |

The `AUTHORITY OBSERVED` line now says which of the two it is:
`theme NULL — no PASS word is available; brief acceptance NULL — the obligation stays open`,
or `theme DECISIONS:<n> found in Git at that base`.

**Consequence for the whole report: the open-obligation count is evidence again.** r2's
closing point 3 was that "two of the five can be removed by declaration". Neither can now.

## r2.6 Residual R1 — the runner is bound in Git, not only on disk

r2's R1: *"a tampered runner executes its injected line before it checks its own hash"*, and
*"inject a line into `b-package.cjs`, re-take `tooling.runnerSha256`, and the run proceeds
normally"* (B02, accepted pre-seal at r2).

**What changed.** The spec's runner pin is resolved **twice**: against the bytes on disk
(`RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER`, unchanged, still the first check in `spec()`) and
against the bytes standing in **Git at HEAD**
(`RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER-IN-GIT`). Disk, Git and the spec pin must be one
byte string, and `fidelity()` re-asserts both mid-run. The hand that edits the runner
cannot also rewrite the reviewed history without committing.

| bite | what | exit |
|---|---|---|
| B01 | runner injected line, spec pin untouched | **1** (disk pin) |
| **B02** | **runner injected line AND `tooling.runnerSha256` re-taken — the co-edit r2 recorded as accepted** | **1** (Git pin) |

Stated plainly, because it is the honest half: **this detects, it does not prevent.** The
attribution pass shows B02's stdout beginning with the injected line
`B PACKAGE RUNNER-EDIT injected line executed` before the refusal. Self-verification cannot
be otherwise. What changed is that the co-edit no longer survives detection. The operative
consequence for practice is unchanged from r2's R1: **a reviewer of a sealed B package
diffs `b-package.cjs` and `packages/<id>.json`; running them is not a substitute.** A
second consequence is new and worth naming: the runner must be **committed** before any
run, because an uncommitted edit is exactly what this check refuses.

## r2.7 Residual R3 — parent pins re-asserted from Git as the original does

r2's R3: the pins were re-asserted "from **disk only**", where the accepted original "also
reads each superseded file from Git at `sourceBase`", and `git status` over the 18
`PIN_PATHS` does not reach `rebuild/m4/spec`, `rebuild/m3` or `.github`, "where 28 of the
31 parent pins and all 23 grandparent pins live".

**What changed.** One helper, `held()`, resolves every parent and grandparent pin the way
`native-carriers-profile.cjs:94-98` resolves it:

* a file **this package supersedes** (is in its own `product`) must still carry the
  parent's pinned bytes **in Git at `sourceBase`** — `PARENT-PIN-BROKEN-AT-SOURCEBASE` /
  `GRANDPARENT-PIN-BROKEN-AT-SOURCEBASE`;
* a file it does **not** supersede must be byte-identical on disk **and** in Git at HEAD —
  `PARENT-PIN-BROKEN` / `…-GIT-DISK-DISAGREE`.

The grandparent walk no longer skips files this spec supersedes; they are routed to the
`sourceBase` check instead of being ignored. The honest run now reports all three counts:

```
PARENT PINS RE-ASSERTED at run time; 31 pin(s) from rebuild/m4/spec/acceptance-native-carriers.json
plus its 20 product pins through the inventory below, and 23 un-superseded grandparent pin(s)
from rebuild/m4/spec/acceptance-load-writes.json, byte-identical on disk AND in Git at HEAD;
20 superseded pin(s) preserved in Git at sourceBase 87eddad; parent artifact byte-identical in
Git at 84d8f28892973b6cf68f37d2fe5ce80d97b1d165
```

B19 (a parent execution pin edited: `.github/workflows/rebuild.yml`), B20 (a grandparent
pin edited: `rebuild/m4/spec/load-write-traces.cjs`) and B21 (parent artifact bytes edited)
all refuse, exit 1.

## r2.8 The two honesty points from r2 §5

* The runner header claimed *"No PASS word without an ACCEPTED envelope"* while `--ci`
  prints `PUBLIC CI EVIDENCE PASS` at exit 0 with no artifact and no receipt. The header
  now says **`POSTFIX PACKAGE PASS`** specifically, and the `--ci` success line itself now
  reads `PUBLIC CI EVIDENCE PASS — public evidence only, NOT the package verdict; … and
  POSTFIX PACKAGE PASS is unavailable on this mode at any time`.
* `PROTECTED SURFACES … verdict-only UNCHANGED` read as an observation while asserting
  nothing. It now reads `… declared by the spec and echoed here, asserted by nothing in
  this line`, and names what does hold those surfaces.

## r2.9 The r2 reviewer's bite list, re-executed against the fixed runner

All 39 executions r2 reports (B01–B31 with the a/b/c variants, plus PS0–PS4), re-run here,
**plus 20 new probes** for the N-controls — 59 bite executions and 6 post-seal controls, 65
in all. Spec bytes, runner bytes, ledger bytes, parent/grandparent pins and the two
temporary envelopes are restored by the harness's `finally` after **every** bite.

```
bites run    : 59      refused (exit 1) : 57
accepted-2   : 1       B07d, the N1 positive control (a real move) — CI REVIEW-PENDING, no PASS
no-effect-2  : 1       B23, the Git-bound control (a worktree ledger edit is invisible)
bare PASS    : 0       across all 59
post-seal    : 6       PS0 accepted-2 (the independent recomputation), PS1-PS4 + B28 exit 1
```

| # | bite | r2 | now |
|---|---|---|---|
| B01 | runner injected line | 1 | **1** |
| B02 | runner injected line + spec re-pinned | **2, accepted** | **1** |
| B03–B06 | runner path / exemption key / self-nominated artifact / 19 gates on an undeclared file | 1 | **1** ×4 |
| **B07** | ten gates into `coverage.moves` | **2, ACCEPTED — N1** | **1** |
| B07b/c/e | reason-shaped moves, a move that does not run the original, the grouped pair out of root | — | **1** ×3 |
| **B07d** | a move that DOES run the original (positive control) | — | **2, accepted, no PASS** |
| B08 | inherited ≠ the parent covered set | 1 | **1** |
| B08b | the parent's gates re-pointed at one child | — | **1** |
| B09–B14 | needle and argv schema | 1 ×6 | **1** ×6 |
| **B15** | `['--version', <pinned child>]` | **2, ACCEPTED — N3** | **1** |
| B15b | `[<pinned child>, '--version']` | — | **1** |
| **B16** | `['--eval=…', <pinned child>]` | **2, ACCEPTED — N2** | **1** |
| N2a–N2s | 19 further inline / short-circuit / stdin / smuggled-flag forms | — | **1** ×19 |
| B17–B21 | product inventory, pre-image, parent pin, grandparent pin, parent artifact | 1 ×5 | **1** ×5 |
| B22a/b/c | contract ledger line tampered three ways | 1 ×3 | **1** ×3 |
| B23 | control: `DECISIONS.md` tampered in the worktree | 2, no effect | **2, no effect** |
| B24, B25a/b, B26, B27 | law id, single-parent chain ×2, carried id, non-canonical JSON | 1 ×5 | **1** ×5 |
| B28 | artifact written mid-run | 1 | **1** |
| **B29** | brief obligation cleared by declaration | **2, ACCEPTED — N4** | **1** |
| B29b | an invented self-consistent brief-acceptance claim | — | **1** |
| **B30** | composite: all 19 gates, one `--version` child | **2, ACCEPTED — N1+N3** | **1** |
| **B31** | invented theme ledger line | **2, ACCEPTED — N5** | **1** |
| PS0 | seal by independent recomputation | accepted | **2, accepted** |
| PS1–PS4 | spec edited / runner co-edited / artifact pin altered / forged receipt, all post-seal | 1 ×4 | **1** ×4 |

**Every bite r2 recorded as ACCEPTED now refuses.** The four that were the finding — B07,
B15, B16, B30 — plus B29 and B31, and B02 which r2 recorded as accepted pre-seal.

**PS0 still works.** The artifact is rebuilt in the harness from the spec and the bytes on
disk, with no help from the runner, and `same(m, proposed())` accepts it:

```
ENVELOPE PENDING artifact=b85f3f6600f512fc0d3e29048b7c84f357ec1898047ecb84fce8eda99cd3f067
  spec=f3f658b8f181d58ac8110e361aea646819b475cc8de064604971068e74c1f1a0
  runner=eaa731a143438dd0238925397c5ff3450fc8e1bafee5220f0332150a1460b81d
CI REVIEW-PENDING: 4 open obligation(s); public evidence only; no PASS is claimed   (exit 2)
```

That is the load-bearing control for the new artifact shape: `coverage` now carries
`{covered, run, moves, byChild}`, and an independently built artifact with that shape is
accepted while PS1/PS2/PS3 show the binding is total.

### Where each N-control fires (attribution)

The runner withholds diagnostics by design, so the control that fired is identified by how
far the run got before refusing:

| bite | stdout lines before refusal | control |
|---|---|---|
| B07 / B07b / B07c | 0 | `spec()` — the bounded-moves schema, before any output |
| B08b | 31 — last line `CHILD second-gate OBSERVED` | `coverage()` — the parent-map equality, after all five children ran |
| B16 | 0 | `spec()` — `CHILD-ARGV-INLINE-CODE` |
| B15 / B15b | 0 | `spec()` — short-circuit / flag-after-file |
| FLOOR-A / FLOOR-B | 30 | `children()` — the execution floor and the line-start rule |
| B29 | 0 | `spec()` — the claim shape |
| B29b / B31 | 10 — last line `FIDELITY OBSERVED` | `authority()` — the Git lookup at the parent's receipt base |
| B02 | 1 — the injected line itself | `spec()` — the Git-at-HEAD pin, after the injected line had run |

## r2.10 The tip demo, re-executed

All run as `node rebuild/lanes/b/tooling/b-package.cjs <args>` from the worktree root.

| invocation | exit | terminal line |
|---|---|---|
| `--ci --package B1` | **2** | `CI REVIEW-PENDING: 5 open obligation(s); public evidence only; no PASS is claimed` |
| `--ci --package B2` | **2** | `CI REVIEW-PENDING: 5 open obligation(s); …` |
| `--ci --package B3` | **2** | `CI REVIEW-PENDING: 10 open obligation(s); …` |
| `--ci --package B4` | **2** | `CI REVIEW-PENDING: 10 open obligation(s); …` |
| `--full --package B1` | **2** | `B PACKAGE B1 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` |
| `--full --package B2` | **2** | `B PACKAGE B2 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` |
| (no args) | **1** | `B PACKAGE USAGE REFUSED; exactly: --ci\|--full --package B1\|B2\|B3\|B4` |
| `--third --package B1` | **1** | same refusal |
| `--ci --full --package B1` | **1** | same refusal |
| `--ci --package B9` | **1** | same refusal |
| `--ci --package b1` | **1** | same refusal (case-exact) |
| `--ci` alone | **1** | same refusal |
| `--package B1` alone | **1** | same refusal |

All six real runs executed `45/45` register laws with **0 HARNESS_ERROR**
(`TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls ·
97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL`), all five
declared children, and

```
COVERAGE 9/19 original gate(s) covered by 5 executed child(ren)
  (9 inherited, the parent map byte-for-byte; 0 moved, each bound to its own original
   executable); 10 re-execute under --full
```

(`9 inherited, unverified` on B3/B4, which document no sealed parent). The open counts are
unchanged from r2 at 5/5/10/10 — the two obligations N4 and N5 concern are still open,
and now they cannot be closed by declaration. **0 lines containing a bare `PASS` in any of
the 13 runs**; the only occurrences of the word are the two negations and the qualified
`PUBLIC CI EVIDENCE PASS`, which no run reached.

The five children each print their declared verdict at line start, and the runner now says
how much they printed and which file they ran:

```
CHILD source-carriers     OBSERVED; exit 0, 926 bytes of stdout, exact declared verdict at line start; ran rebuild/m4/spec/native-carriers-source-carriers.cjs
CHILD inherited-carriers  OBSERVED; exit 0, 815 bytes …
CHILD defect-witnesses    OBSERVED; exit 0, 480 bytes …
CHILD writers-differential OBSERVED; exit 0, 1068 bytes …
CHILD second-gate         OBSERVED; exit 0, 227 bytes …
```

## r2.11 Delivered bytes after the r2 fix

| file (under `rebuild/lanes/b/tooling/`) | lines | bytes | sha256 |
|---|---|---|---|
| `b-package.cjs` | 684 | 53683 | `eaa731a143438dd0238925397c5ff3450fc8e1bafee5220f0332150a1460b81d` |
| `packages/B1.json` | 386 | 22590 | `ed2a59ab07c299fb56fbe3a639edf9ca72d2a1d5374180a1db801aa23b098bf0` |
| `packages/B2.json` | 371 | 23501 | `2005606f43df4dbe597ba9bd8f9233d169d05afb3b85ab2ae3cc9ea52ae4eae2` |
| `packages/B3.json` | 268 | 18450 | `41bc9ce615590496675720cece3fb46b3bbd22094e978d60d2a77ba1b0088a33` |
| `packages/B4.json` | 258 | 17861 | `06b4d367d2339f48c2f50cfaef5621bb598346f14f92657e1bcb17fcc75101bd` |

The only change to the four specs is `tooling.runnerSha256`, re-taken from the new runner
bytes; all four remain byte-canonical JSON and LF-only. `README.md` and this file changed
with the mechanism. **`package-lock.json` is untouched.**

## r2.12 What is still open after r2 — stated, not hidden

1. **The runner is 684 lines.** Still nothing copied: `GATES`/`gateRun`, `PIN_PATHS`,
   `git`/`object`/`verifyReceipt`/`checkSources`/`historicalAudit`, `sha`, `parseExact`,
   the BLOCKED `codes` list and the reference bundles are all **required**, and the two new
   derivations — `GATE_FILE`/`GATE_GROUP` and `GATE_TERMINAL` — are read out of `R.GATES`
   rather than re-typed. The growth over r1's 514 is the five N-controls.
2. **The pre-seal spec is still editable.** R1 is closed on the **runner**; the spec is not
   bound in Git the same way, deliberately — binding it would make every fail-closed bite
   refuse for the same generic reason and destroy the attribution this report depends on.
   The spec's real anchors remain the reviewed commit (a human diff) and, from the seal on,
   the artifact (PS1 refuses a post-seal spec edit). **A reviewer must diff the spec.**
3. **The N3 floor's OR branch is a string a child could print.** A child that prints a
   fabricated `LEGACY <gate> PASS | …` line clears the floor with under 200 bytes
   (FLOOR-C). It is bounded — that child is a real file under a fixed root, pinned in the
   artifact and reviewed — but it is a string test, not a proof of execution. The stronger
   rule would compare the child's stdout against the original gate's own declared needle
   from `R.GATES`; that requires each move to declare which gate's needle it carries, which
   is a spec-shape change and belongs with the first real `legacy-b<N>-carriers.cjs`.
4. **R4 is unchanged and inherited from `run.cjs`**: two `PIN_PATHS` entries
   (`rebuild/conform/goldens`, `rebuild/conform/manifest.json`) do not exist in this tree,
   so "18 PIN_PATHS byte-identical" is nominal, not 18 live paths.
5. **R5 is unchanged: the ACCEPTED happy path is still untested by a genuine receipt.**
   Every negative around it is executed (PS4, B28 and r1's B4a–B4f); the positive needs a
   PM ledger line. N1–N3 are now closed *before* that run rather than diagnosed by it,
   which was r2's requirement.
6. **R6 is unchanged: `gates()` and `historical()` remain unexecuted** on any machine
   without the private fixture, by design (`DECISIONS:97`). The coverage accounting they
   depend on does run, in every `--ci`.
7. **R7 is unchanged: `--ci` still cannot be wired into `.github/workflows/rebuild.yml`**,
   which is a NATIVE-CARRIERS execution pin and belongs to the one batched re-seal at B1
   (`DECISIONS:99`).
8. **R8 is narrowed but not gone.** `fidelity()` still exempts every file a declared child
   executes from `UNLISTED-SOURCE-CHANGE`. With N2/N3 closed a spec can no longer name a
   file it never executes — the child must run it, file-first, and clear the output floor —
   so the exemption now costs a real execution. It is still an exemption a spec chooses.
9. **Everything in r2 §10 that the PM must name is unchanged**, except that items 2 and 3
   ("N1, N2 and N3 as blocking pre-seal conditions" and "N4 and N5, or an explicit ruling")
   are answered by this fix rather than by a ruling. The single parent, the brief
   acceptance lines, the theme lines, H1, and who runs and judges the FULL gate all remain
   open and are the PM's.
