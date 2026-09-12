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
prints its reason on the `COVERAGE <gate> <- child …` line.

> **Corrected in r3 (X4).** As written at r2 that line said `MOVED, carries <original>`,
> and r3's N3-05 showed the claim was false in the one configuration that mattered: the
> covering file *named* the original in a `require` specifier that stood after
> `process.exit(0)`, so the original never ran and the runner still said it was carried.
> The line now reads `MOVED, declared against <original> and observed emitting that gate's
> own needle`, and under X3 the second half is an executed fact, not a restatement of the
> first. See §r3.3. Under X1 no move is admitted at all, so today the line never prints.

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

> **Corrected in r3 (X4).** `each bound to its own original executable` said more than the
> runner had verified: at r2 the binding was a `require` **specifier** in the covering
> file's text, which does not establish that the specifier is reachable, let alone called.
> The clause now reads `each naming its own original executable in a relative require
> specifier and each proved by that gate's own needle out of R.GATES in the child's
> stdout`, and the same correction is made in the `SPEC OBSERVED` line. See §r3.3.

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

---

# post-review r3 — X1–X4 closed, the id list widened, the parent re-pinned

`TOOLING-REVIEW-r3.md` (lane-b-reviewer3, ACCEPT WITH CHANGES) found W1–W7 and N1–N5 closed
under 61 controls of its own, and required four changes: **X1** `coverage.moves` must be
`{}` at every seal; **X2** close R3-B, the unpinned parent review; **X3** prove a move by
the gate's own needle instead of by a `require` specifier; **X4** make two overstated
sentences say what was verified. This section is the executed proof for all four, plus the
two things the brief added on top: the id list widened to **B-NTC** and **B-LOM**, and every
spec re-pinned at the **DECISIONS:104** re-seal.

Everything below was executed on the owner's PC (Windows, PowerShell), worktree
`work/lane-b/tooling` on `rebuild/lane-b-tooling`, with
`C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
(**Node v24.19.0**). Outcomes are recorded as they happened.

**Delivered bytes at this revision** (measure these, don't trust them — r3's residual R1
says a sealed package is reviewed by *diffing* the runner and its spec, not by running them):

| file | lines | bytes | sha256 |
|---|---|---|---|
| `b-package.cjs` | 820 | 65367 | `6f69aa8ee6667f27b92166dd981ba9c15078f7e77fc2692130950a2ab8be2c3b` |
| `packages/B-NTC.json` | 259 | 21159 | `e1724ca697a202d73da5d18f216cbb2529a5ecd3aa1018f74014f4ab725a56e9` |
| `packages/B-LOM.json` | 89 | 12235 | `cd5950916af094fae957d00a5c76360a6c812a5c361180fbb5251dcdbe225871` |
| `packages/B1.json` | 392 | 24383 | `eef1885c8bfa5ccd90737747a524cec13b67f6fa997e93475b6f367745d7b2ae` |
| `packages/B2.json` | 377 | 25289 | `6b80bc0d69bc1c685a0d33c0eec991fbb50b4204d2dfc0302912d887816fa70c` |
| `packages/B3.json` | 274 | 19958 | `b504ecf37588dacfe329d226e77c78c5f1fd370fe04532da69409a3ea4acd76d` |
| `packages/B4.json` | 264 | 19369 | `506b380a2fbb2d22b9101cb73e72c5b140726ddf20f2fe863ab501619101f6cb` |

(The runner was `eaa731a1…`, 684 lines / 53 683 bytes at r3's review commit `572a8c2`.)

> **Corrected in r4 (Y3).** This table said the runner was **812** lines; it is **820**
> newline-terminated lines at `6f69aa8e…`. The bytes and the sha256 were right, so nothing
> was bound to the wrong thing — but a byte table is exactly the place a reader checks a
> claim against the file, and it must not be off by eight. r4's reviewer re-measured 820.

## r3.0 The base moved first, and it had to

The r3 review ran at `572a8c2` with `sourceBase 87eddad` and the **DECISIONS:96** seal
`295762f0…` on disk. Between then and now the PM re-sealed the same artifact for the
`rebuild.yml` execution pin:

| | old | new |
|---|---|---|
| `acceptance-native-carriers.json` | `295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1` | `e940359b684b90e2e92ae325a86c018f91a7aa27bec7c5466165116657c2201a` |
| `review-native-carriers.json` | `2de0203aa6443f7b83eb6be797dc5a3f236c6a8a30b2eca39824ae95b7c2cbfc` | `9b0918d6172d08d8f62336219bb4f91809a09705665839bc59c8b7a74a9526bb` |
| receipt | `DECISIONS:96`, base `f6aa4a2` | **`DECISIONS:104`**, base `b045e61` |
| reviewed at | `84d8f28` | `b95ccca` |

`rebuild/lane-b-tooling` had diverged from `rebuild/t2-client-core` at `acd3b67`, so the new
bytes were not on the branch at all. **The tip is therefore merged in first**
(`origin/rebuild/t2-client-core @ e9c50e1`, its own commit), because `option()` reads the
parent artifact from **disk** and `fidelity()` requires `sourceBase` to be an ancestor of
HEAD — a re-pin without the merge would have been a pin to bytes this branch does not have.
The merge is clean, brings **no** `package.json` / `package-lock.json` change, and after it

```
git diff --name-only e9c50e1 HEAD -- rebuild/engine rebuild/conform rebuild/m4/spec rebuild/lanes/b/tooling
  rebuild/lanes/b/tooling/{README.md, TOOLING-REPORT.md, b-package.cjs, packages/B1..B4.json}
```

— seven files, every one already in the runner's own fixed `TOOLING_FILES` inventory, plus
the two new package specs. This branch authors nothing outside `rebuild/lanes/b/tooling`.

**What was re-taken, and what was not.** The two artifacts differ in **three**
`executionPins` and in nothing else: `.github/workflows/rebuild.yml`,
`NATIVE-CARRIERS-THEME.md`, `NATIVE-CARRIERS-BUILD-REPORT.md`. The parent `product` map is
byte-identical across the re-seal, so **B1's and B2's own product pre-images did not move**
and were not re-typed; they were re-verified — all 51 parent pins and all 23 un-superseded
grandparent pins resolve at `e9c50e1` **and** on disk, 0 mismatches. Those pre-images are
the parent's pins carried forward, not an independent measurement of either lane's work:
**B1 and B2 re-verify them, and re-take them if the engine moves under them, at seal time.**
B3's and B4's briefs arrived with the merge, so their `brief.sha256` — `null` until now —
is taken from the bytes on the branch (`17fb21e4…`, `325e7a23…`); had it been left `null`
the run would have failed on `Brief bytes`, because the file now exists to hash.

## r3.1 X1 — `coverage.moves` is `{}`, and the runner is what says so

The reviewer's own words: *"`coverage.moves` must be `{}` in every B package sealed until X3
lands … **The sealer must re-check this line at seal time, not trust it from here.**"* That
re-check is now mechanical. `MOVES_RULING` is a runner constant holding the PM ruling that
would admit a move; it is `null`, and a non-empty `moves` refuses in `spec()` — before any
output — and again in `envelope()` before the ACCEPTED branch.

**Why a flat refusal is the right answer to R3-A, and not a tighter bound.** r3's R3-A is a
composite: a declared child that never runs a gate's original could clear the old evidence
rule (a `require` specifier in the covering file's *text*, plus ≥ 200 bytes of stdout) and
still be reported `MOVED, carries <original>` — `DECISIONS:97` F-PM-2's defect class through
the move door. Every component of it enters through a non-empty `moves`. With `moves`
refused **the wrapper attack has no reach at all** — not a narrower reach, none — and the
reviewer's own summary already said so: *"With `moves` empty the hole has **no reach at
all**."* X1 turns that observation from a property of today's four specs into a property of
the runner. The move machinery is kept whole, is still checked, and is still exercised by
the controls below, so it stays reviewable; it simply cannot be reached.

| # | control | exit | fired |
|---|---|---|---|
| X1-1 | one well-formed move (`migrate-full` onto a new carrier) | **1** | `COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING migrate-full` |
| X1-2 | a move onto an **inherited** child | **1** | same |
| X1-3 | a move whose reason is five characters | **1** | same |
| X1-4 | a move declared as a bare string | **1** | same |
| X1-5 | two moves (`migrate-full` + `merge-laws`) onto ONE child | **1** | same, naming both |
| X1-6 | **all ten free gates onto ONE child** | **1** | same, naming all ten |
| X1-7 | the one `run.cjs`-grouped pair (`conformance` + `selftest`) through a child root that cannot reach `rebuild/conform/run.cjs` | **1** | `CHILD-ARGV-TARGET` (r3's B07e, still first) |
| X1-7b | the same pair through a wrapper under `rebuild/m4/workout/test/` that **does** `require` `run.cjs` | **1** | `COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING conformance selftest` |
| X1-8 | a gate both inherited **and** moved | **1** | `COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING migrate-source` |

X1-7b is the one that matters most: at r2 this exact configuration was **accepted** (exit 2)
because `run.cjs` itself groups those two gates on one executable. It is refused now. Every
one of r3's own N1 move controls is subsumed — the gate that fires is X1's, before theirs.

**The gate is the ruling flag, not a broken code path.** X3-a..d below run the same
machinery with `MOVES_RULING` temporarily set in a debug copy beside the runner; moves are
then admitted and the *specific* move checks decide. So X1 is a policy switch that a PM
ruling flips, not a dead branch.

## r3.2 X2 — the parent's review is byte-pinned and chain-anchored (R3-B closed)

R3-B, in r3's words: `option()` *"does **not** pin the parent's **review** file … and takes
`review.receipt.commit` as `receiptBase` — the very base `authority()` then uses."* Its
C-COMMIT-3 wrote a review file **inside the tooling directory**, pointed it at a local
scratch commit carrying forged theme and brief lines, and the runner cleared two obligations
and printed that those lines were *"found in Git"*.

Both halves of X2 are implemented, because they fail independently:

1. `parent.options[].reviewSha256` pins the review file **by bytes**, asserted against disk
   and against the bytes standing on `refs/remotes/origin/rebuild/t2-client-core`.
2. `L.git(root, ['merge-base','--is-ancestor', r.commit, CHAIN_REF])` — the receipt base
   must stand on the real chain branch. `CHAIN_REF` is a runner constant read from Git refs;
   **nothing the spec says can name it.**

Both are **additions**. The check that was already there — `L.verifyReceipt` finding the
parent's receipt line as exact bytes in `rebuild/DECISIONS.md` in Git at that base, under
role `cowork`, mentioning the artifact path and hash — is unchanged and still runs. X2
decides *where* the base may be; `L.verifyReceipt` decides *what must stand there*. Neither
substitutes for the other, and a reviewer diffing this revision should see both in
`option()`. (They nearly did not: the first draft of this fix rewrote `option()` whole and
dropped the `L.verifyReceipt` call. It was caught by diffing the runner against `5b04f21`
line by line before the push — which is precisely the reading residual R1 demands of a
reviewer, applied by the author to his own work, and it is recorded here rather than
quietly corrected.)

One implementation note a future reviewer should not rediscover as a finding: the review
file is authored **after** the commit its own receipt names as reviewed (it carries the
receipt of the line that accepts the artifact), so its bytes do **not** stand at that
commit — asking for them there fails on the genuine article. They are resolved on the chain
branch instead, which is the stronger anchor anyway. A side effect worth naming: a parent
pin that upstream has **superseded** now stops verifying rather than passing quietly. That
is exactly what `DECISIONS:104` did to the `:96` seal, and X2-4 executes it.

| # | control | exit | fired |
|---|---|---|---|
| X2-1 | `reviewSha256` present but wrong | **1** | `PARENT-REVIEW-BYTES-NOT-THE-PINNED-REVIEW NATIVE-CARRIERS` |
| X2-2 | `reviewSha256` key removed | **1** | `Parent option NATIVE-CARRIERS` (closed option keys) |
| X2-3 | an **unsealed** option carrying a review pin | **1** | `An unsealed parent option pins no review bytes B2` |
| X2-4 | the **stale** `:96` pin re-declared (`295762f0…`, line 96) | **1** | `Parent artifact bytes NATIVE-CARRIERS` |
| **X2-5** | **C-COMMIT-3 reproduced**: a dangling commit carrying forged theme + brief lines; a canonical review file in the tooling directory naming it as `receipt.commit`; `reviewSha256` set to that file's **real** bytes; both forged lines cited by the spec | **1** | `Command failed: git merge-base --is-ancestor debc7238a9311040293630849bab5e586a4b6d88 refs/remotes/origin/rebuild/t2-client-core` |
| X2-6 | the same forged review but with the **genuine on-chain** receipt base `b045e61` | **1** | `Command failed: git show refs/remotes/origin/rebuild/t2-client-core:rebuild/lanes/b/tooling/r3fix-review.json` |
| X2-7 | control on the control: the two forged lines really do stand at the scratch commit, and that commit really is off the chain | — | **2/2 found at `debc7238`; `on the chain branch? NO`** |

X2-7 is what makes X2-5 evidence rather than an accident: the forged lines are genuinely in
Git at that commit, so the refusal is the **ancestry check** firing and not a line that was
never written. X2-6 shows the byte-pin biting on its own with a perfectly valid base.

`debc7238a9311040293630849bab5e586a4b6d88` is reproducible: it is parented on the chain tip
`e9c50e1` (not on HEAD, so that its sha does not depend on the commit this file is part of),
with fixed author and committer dates of `2026-09-11T00:00:00 +0000`, and it was built with
`hash-object` / `read-tree` / `write-tree` / `commit-tree` against a **temporary index** —
**no branch was created, the worktree and the real index were never touched, and nothing was
pushed**. It is unreachable, and `git branch --list '*scratch*'` is empty. An earlier run of
the same control parented on HEAD refused identically.

## r3.3 X3 — a move is proved by the gate's own needle (and one correction to the review)

`R.GATES` carries each gate's expected output string, and `run.cjs`'s own `gateRun()` is the
authority on how to use it:

```
const [id,file,needle,arg]=gate;
…
if(result.error||result.status!==0||!result.stdout.includes(needle))fail('LEGACY-GATE-'+id);
```

`GATE_NEEDLE` is built from that same array and a moving child is held to that same test.
**For a moving child the ≥ 200-byte floor is no longer evidence at all**; non-moving children
keep it, because they cover nothing by themselves.

> **Two corrections to X3 as written, recorded deliberately.**
> 1. X3 says to build the map from `R.GATES[i][2][0]`. That is the **first character** of
>    the needle — `"M"` for `migrate-source`, `"P"` for `migrate-full` — and implementing it
>    literally would have *weakened* the check to almost nothing. The needle is `g[2]`. The
>    runner uses `g[2]`.
> 2. X3 says the needle must stand **at line start**. Two of the nineteen needles stand
>    mid-line in their own gate's output — `preserved writer defects;` (witnesses-7) and
>    `PASS exact sync-laws source` (merge-laws) — so a line-start rule would refuse gates
>    that really ran. The runner matches with `includes()`, the original's own criterion.

Executed with `MOVES_RULING` temporarily set to a test ruling in a debug copy beside the
runner (deleted afterwards), so that the move path is live and X3 is what decides:

| # | control | exit | outcome |
|---|---|---|---|
| **X3-a** | **r3's N3-05 verbatim**: the `require` of `migrate-full.cjs` stands **after** `process.exit(0)`, and a fabricated `LEGACY migrate-full PASS` verdict line is padded past 200 bytes | **1** | `COVERAGE-MOVE-CHILD-DID-NOT-EMIT-THE-ORIGINAL-GATE-NEEDLE r3fix-move migrate-full; 341 byte(s) of stdout without "PASS M2-5 full migration gate"` |
| **X3-b** | **r3's N3-07**: 283 bytes of `z`, declared needle at line start, no gate line | **1** | same refusal, `303 byte(s) of stdout without "PASS M2-5 full migration gate"` |
| X3-c | a wrapper that **prints the gate needle literally** and never runs the gate | **2** | **accepted** — see R3-C below |
| **X3-d** | **POSITIVE**: a wrapper that really `require`s and runs `rebuild/engine/test/defect-witnesses.cjs`, moving `witnesses-1` | **2** | **accepted**, 880 bytes, needle observed |

Both of r3's headline accepts are now refusals, and the positive control shows the rule is
not "refuse every move". X3-d's own lines, verbatim:

```
B PACKAGE B1 CHILD r3fix-move OBSERVED; exit 0, 880 bytes of stdout, exact declared verdict
  at line start; ran rebuild/m4/workout/test/r3fix-real.cjs; and emitted the original gate
  needle(s) witnesses-1
B PACKAGE B1 COVERAGE 10/19 original gate(s) covered by 6 executed child(ren) (9 inherited,
  the parent map byte-for-byte; 1 moved, each naming its own original executable in a
  relative require specifier and each proved by that gate's own needle out of R.GATES in
  the child's stdout); 9 re-execute under --full
B PACKAGE B1 COVERAGE witnesses-1 <- child r3fix-move executed in this run; exit 0 and exact
  declared verdict; MOVED, declared against rebuild/engine/test/defect-witnesses.cjs and
  observed emitting that gate's own needle — this package re-homes the witness gate onto its
  own successor carrier
```

Compare the same line in r3 §5's N3-05 transcript — `MOVED, carries
rebuild/engine/test/migrate-full.cjs` — on a run where `migrate-full.cjs` never executed.

## r3.4 X4 — the sentences, and the label defect

Three text changes, all of them now backed by the check they describe:

| was | is |
|---|---|
| `SPEC OBSERVED … N declared move(s), each bound to its own original executable` | `… each naming its own original executable in a relative require specifier` (plus `(moves are refused outright under this runner — TOOLING-REVIEW-r3 X1)` while `MOVES_RULING` is absent) |
| `COVERAGE … N moved, each bound to its own original executable` | `… each naming its own original executable in a relative require specifier and each proved by that gate's own needle out of R.GATES in the child's stdout` |
| `COVERAGE <gate> <- child <c> … MOVED, carries <original>` | `… MOVED, declared against <original> and observed emitting that gate's own needle` |

and the one `assert` r3 asked for:

| # | control | exit | fired |
|---|---|---|---|
| X4-e | `status: "BRIEF-ACCEPTED"` with `brief.acceptedLedgerLine: null` | **1** | `BRIEF-ACCEPTED-WITHOUT-A-CITED-LEDGER-LINE: status says the brief is accepted and brief.acceptedLedgerLine is null` |

It cleared nothing before — the implication was only checked line-implies-status — but a
verdict file must not carry a word its own evidence denies.

## r3.5 The id list: B-NTC and B-LOM

`DECISIONS:103 (1)` ruled the chain order: **B-NTC first** (the qualified
`nativeTrendContext` provider, the S2 blocker), then B1, B2, B4, B3, with **B-LOM** behind
B-NTC because the legacy order-mapping provider is *not* the same seam. Lane B's STATUS of
2026-09-11 05:50 ET recorded the consequence: `b-package --package B-NTC REFUSED (closed id
list) -> tooling fixer widens it`. The list is now
`--ci|--full --package B-NTC|B-LOM|B1|B2|B3|B4`, case-exact.

Two runner changes came with it, both fixed **in the runner** where every other exemption
lives (W7), so no spec can grant itself either:

* `NO_REGISTER_IDS = {B-NTC, B-LOM}` — the only ids allowed an empty `dIds`/`laws`
  inventory. `DECISIONS:93`: feature work under the ratified slice plan takes no register
  D-ID. Control **ID-2**: emptying `dIds` on B1 refuses (`D-id inventory`), exit 1.
* `packageId` must now be `M2-<the id on the command line>-…`, not merely `M2-B[1-4]-…`.
  Control **ID-1**: B1.json carrying `M2-B2-TARGETS-IDENTITY-ERA` refuses
  (`Package id shape`), exit 1 — so a spec cannot claim another package's artifact path.

`packages/B-NTC.json` — `PROPOSED`, parent `NATIVE-CARRIERS` **decided** (the PM has named
it), 24 product files, 5 declared children, `moves {}`. Its product is the 20 parent-pinned
files carried byte-identical, plus the four the package brings into the inventory: the
provider `rebuild/m4/workout/native-trend-context.cjs` and its 22-cell test
`rebuild/m4/workout/test/native-trend-context.test.cjs` (neither authored on this branch —
role `new`, `post: null`, pre-image `e3b0c442…`, the sha256 of the empty byte string), and
the two host wiring files the brief names, `rebuild/m3/w6/host/workout-host.mjs` and
`rebuild/m3/w6/host/test/journey.test.mjs` (present, pinned at their real bytes at
`sourceBase`, `post: null`). **Every `post` is null**, which is what makes the run read
`PRODUCT NOT-IMPLEMENTED`; the post-images are taken when the carrier lands. The bytes
authored on `rebuild/lane-b-ntc @ 68fbca4` are recorded in the spec's own notes **and
asserted by nothing** — they are a note for the re-take, not a claim.

`packages/B-LOM.json` — `SKELETON`. Parent = the ACCEPTED B-NTC artifact, `sha256: null`,
`reviewSha256: null`, `receiptLedgerLine: null`; empty `product`, empty `coverage.inherited`,
no children, no brief. Every coordinate is taken when B-NTC is sealed. It runs, and it is
open on everything — which is the honest state of a package nobody has written yet.

## r3.6 The tip demo — six ids, two modes, and the refusals

| run | exit | terminal line |
|---|---|---|
| `--ci --package B-NTC` | **2** | `CI REVIEW-PENDING: 4 open obligation(s); public evidence only; no PASS is claimed` |
| `--ci --package B-LOM` | **2** | same, **10** open |
| `--ci --package B1` | **2** | same, **5** open |
| `--ci --package B2` | **2** | same, **5** open |
| `--ci --package B3` | **2** | same, **9** open |
| `--ci --package B4` | **2** | same, **9** open |
| `--full --package <each of the six>` | **2** ×6 | `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` |
| no args / `--ci --package b-ntc` / `--ci --package B5` / `b1` / `--ci --full` / `--seal` / `--package B1` alone | **1** ×7 | `B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B-NTC|B-LOM|B1|B2|B3|B4` |

All twelve real runs executed **45/45** register laws with **0 HARNESS_ERROR**
(`TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls ·
97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL`) — identical to
the figure the B-NTC build report measured at `12cfdb9`, so the re-pin and the merge moved
no law.

**Bare `PASS` lines: 0.** Across all twelve logs the word appears on **24** lines and every
one is a negation — `… is not sealed yet — no PASS word is available` (12),
`theme NULL — no PASS word is available` (6), `no PASS is claimed` (6). No run reached
exit 0.

B3 and B4 dropped from 10 open obligations to 9: their briefs arrived with the merge and are
now pinned and present, so `brief … not authored` no longer stands. B-NTC's 4 are the
smallest count in the set because it carries no D-id and no carrier successor — brief not
authored on this branch, product NOT-IMPLEMENTED, theme null, brief not accepted.

B-NTC's parent lines, verbatim, are the clearest single view of X2:

```
B PACKAGE B-NTC PARENT OPTION NATIVE-CARRIERS M2-NATIVE-CARRIERS
  rebuild/m4/spec/acceptance-native-carriers.json
  e940359b684b90e2e92ae325a86c018f91a7aa27bec7c5466165116657c2201a ACCEPTED at
  b95ccca879e371b5ba225ad12cae612ec89469ba (DECISIONS:104); artifact byte-identical on disk,
  in Git at that commit and on refs/remotes/origin/rebuild/t2-client-core; review
  rebuild/m4/spec/review-native-carriers.json 9b0918d6172d byte-identical on disk and on
  that branch; receipt base b045e61 is an ancestor of it
B PACKAGE B-NTC PARENT BOUND NATIVE-CARRIERS … single-parent chain holds
```

## r3.7 The 68 controls, and where they refused

56 in part 1 + 12 in part 2, **68/68 at the expected exit**, each attributed to a named
check rather than inferred from an exit code. Attribution used a copy of the runner placed
**beside** it (`b-package-debug.cjs`, so `__dirname`, `root`, `SPEC_DIR` and the `RUNNER`
pin all still resolve to the real runner's bytes) differing only by one `console.error` in
the terminal catch — the same instrument r3 built, and deleted the same way.

| group | n | all refused at |
|---|---|---|
| W1-01..07 | 7 | runner bytes on disk / in Git at HEAD, tooling pin, closed keys, self-nominated artifact, non-canonical bytes, duplicate key |
| N1-08, N1-10, N1-11b | 3 | `INHERITED-COVERAGE-IS-NOT-THE-PARENT-COVERED-SET` ×2, `COVERAGE-CHILD-NOT-DECLARED` |
| W3-a/b/c | 3 | `CHILD-NEEDLE-EMPTY` |
| N2 (24 argv probes incl. one positive) | 24 | `CHILD-ARGV-INLINE-CODE` ×10, `…SHORT-CIRCUITS-EXECUTION` ×4, `…STDIN-OR-END-OF-OPTIONS` ×2, `…FLAG-NOT-ALLOWED` ×2, `…FLAG-AFTER-FILE`, `…TARGET` ×4; the positive `['--test','--test-reporter=tap',<pinned child>]` cleared `childArgv` and failed later on the needle |
| N4/N5 + X4-e | 5 | `RECEIPT-EXACT-LINE-MISSING` ×2, `Authorization claim brief acceptance`, `LEDGER-LINE-SHA256`, `BRIEF-ACCEPTED-WITHOUT-A-CITED-LEDGER-LINE` |
| N3-a/b/c | 3 | `CHILD-NEEDLE-NOT-A-TERMINAL-LINE`, `CHILD-DID-NOT-REALLY-EXECUTE`, and N3-07 **accepted as a non-moving child** (exit 2) — correct: it covers nothing |
| X1-1..8, X1-7b | 9 | `COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING` ×8, `CHILD-ARGV-TARGET` ×1 |
| X2-1..7 | 7 | the four pin/key/ancestry refusals, C-COMMIT-3, the on-chain-base variant, and the control on the control |
| X3-a..d | 4 | two `COVERAGE-MOVE-CHILD-DID-NOT-EMIT-THE-ORIGINAL-GATE-NEEDLE`, one honest accept (X3-c), one positive accept (X3-d) |
| ID-1, ID-2 | 2 | `Package id shape`, `D-id inventory` |

r3's W4/W5/W6 are observations rather than bites and are observed on every clean run: 31
parent + 23 grandparent pins re-asserted, `ENVELOPE-CHANGED-DURING-THE-RUN` evaluated twice
with `key` compared, owner `DECISIONS:60` and contract `DECISIONS:49` found as exact line
bytes — now at `b045e61`, the **new** receipt base, with the contract still byte-equal to
the parent artifact's.

## r3.8 Residual risks

1. **R1 (unchanged, and r3 scoped it correctly).** Pre-seal the runner and the spec can be
   co-edited and the Git-at-HEAD pin falls to anyone who can commit (r3's C-COMMIT-1). No
   PASS is reachable pre-seal. **A sealed B package must be reviewed by diffing
   `b-package.cjs` and `packages/<id>.json` at the reviewed commit, not merely by running
   them.** This is still the single most important thing a reviewer of a sealed package does.
2. **R3-A — CLOSED by removal of reach, not by narrowing.** `moves` cannot be non-empty.
   When a PM ruling lands, X3 is what guards it, and X3-a/X3-b show it refuses both of r3's
   headline configurations.
3. **R3-B — CLOSED.** X2-5, X2-6 and X2-7 executed.
4. **R3-C (new, this round, and it is the honest limit of X3).** X3 replaces a *text* test
   with an *output* test, and an output test is still a test on a **string**. X3-c executed
   it: a wrapper that never runs the gate but prints
   `PASS M2-5 full migration gate` on its own was **accepted** (exit 2). X3 is strictly
   stronger than the specifier test — a covering file can no longer name the original and
   never call it — but it does not prove execution, and no rule that reads only a child's
   stdout can. What would: run the gate through `R.gateRun` itself rather than accepting a
   child's transcript of it. That is a larger change to the coverage model and belongs with
   the first real `legacy-b<N>-carriers.cjs`, under a PM ruling that admits moves at all.
   **Until then X1 makes R3-C unreachable as well**, for exactly the same reason it makes
   R3-A unreachable.
5. **R3-D (new).** `CHAIN_REF` is a *moving* ref. Pinning the parent's artifact and review
   bytes on `refs/remotes/origin/rebuild/t2-client-core` means the pins must be re-taken
   whenever upstream re-seals — which is the point, and which is what X2-4 proves — but it
   also means **a run is only as correct as the last `git fetch`**. A stale remote-tracking
   ref can refuse a pin that is in fact current. The refusal direction is the safe one, and
   the fix is `git fetch origin` before a seal run; it is recorded so a future reviewer
   reads the refusal correctly.
6. **R4 (inherited from `run.cjs`, unchanged).** Two of the 18 `PIN_PATHS`
   (`rebuild/conform/goldens`, `rebuild/conform/manifest.json`) do not exist in this tree, so
   "18 PIN_PATHS byte-identical" is nominal; 16 live, 2 missing.
7. **R5 (unchanged, and it bounds this round too).** The ACCEPTED branch of `envelope()` has
   still never executed. The artifact path is derived as
   `rebuild/m4/spec/acceptance-<slug>.json` and this brief forbids writing there, so every
   post-seal check here is by reading. The PM's first `--full` on a sealed B package remains
   an unrehearsed first execution of `L.checkSources` end to end: **treat it as a rehearsal,
   and write the receipt after it, not before.**
8. **R6 (unchanged).** `gates()` and `historical()` are unexecuted on any machine without
   the private fixture (`DECISIONS:97`). The coverage accounting they consume runs on every
   `--ci`.
9. **R7 (unchanged).** `--ci` still is not wired into `.github/workflows/rebuild.yml`. That
   file is a NATIVE-CARRIERS execution pin and moved in the `:104` re-seal; the wiring
   belongs to the batched re-seal item `DECISIONS:103 (5)` names.
10. **R8 (unchanged from r2, with r3's narrowing recorded).** `fidelity()` still exempts
    every file a declared child executes. r3 also observed that two of the five `CHILD_ROOTS`
    (`rebuild/m4/workout/test/`, `rebuild/m3/w7-preview/test/`) sit outside `fidelity()`'s
    change scan entirely, so there the exemption is not even reached; and an untracked file
    beside the runner is invisible to `fidelity()` because `TOOLING_FILES` is a fixed list
    and the runner never enumerates its own directory. Both are still true. Both are why the
    debug copy and every wrapper built here were deleted and `git status
    --porcelain --untracked-files=all` was re-checked.
11. **`L.verifyBase` is still not used** (r3 §2). `envelope()` asserts
    `merge-base --is-ancestor r.commit CHAIN_REF` where the original pins
    `merge-base HEAD CHAIN_REF === expected` (`CANDIDATE-BASE-STALE`). Weaker, but anchored
    on the real remote branch — and X2 now applies the same anchor one level up, to the
    parent's receipt base, which is where r3 found it missing.

## r3.9 Restoration, verified

```
git status --porcelain --untracked-files=all                       (empty)
git status ... -- rebuild/m4 rebuild/conform rebuild/engine .github \
                  rebuild/m3 rebuild/DECISIONS.md                  (empty)
git branch --list 'r3fix*' / '*scratch*'                           (empty)
rebuild/m4/workout/test/r3fix-*                                    (none)
rebuild/lanes/b/tooling/{*debug*, r3fix-*}                         (none)
rebuild/conform/private/                                           absent, never created
rebuild/lanes/b/tooling/  9 files, no others
```

The scratch commit `debc7238` is dangling: no branch ever pointed at it, it was never pushed,
and it was built through `commit-tree` against a temporary index so the worktree and the
real index were never touched. `ledger/` and `rebuild/conform/private/` were never opened.
No `package.json` or `package-lock.json` change was made or committed.

The whole control set was run **twice**: once before the `L.verifyReceipt` restoration
described in §r3.2, and once after, on the bytes that ship. Both runs were 68/68.

---

# §r4 — closing Y1–Y4 from TOOLING-REVIEW-r4.md

Fixer: **lane-b-fixer4**. Not the builder, not any reviewer, not the r1/r2/r3 fixers.
Everything below was **executed on the owner's PC** (Windows, PowerShell, Node **v24.19.0**
at `C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`),
worktree `work/lane-b/tooling` on `rebuild/lane-b-tooling`, starting from
`636aeaa` (`git fetch origin && git reset --hard origin/rebuild/lane-b-tooling`).
Outcomes are recorded as they happened, including the two that failed first.

**Delivered bytes at this revision** (measure these, don't trust them — R1 says a sealed
package is reviewed by *diffing* the runner and its spec, not by running them):

| file | lines | bytes | sha256 |
|---|---|---|---|
| `b-package.cjs` | 966 | 77 756 | `cadde14fd93d2774a12909871d75e0907bd08814b5310fe231a0ea1737d5f92f` |
| `README.md` | 656 | 46 536 | `5bfe18ebad1aedb9dc9da796d052cb83c6d255136bf73e973ddfcfe67c951d0a` |
| `packages/B-NTC.json` | 265 | 23 996 | `5adb9c7a1248efe7873a26a177e01da545cee406984ea24a4261e3577421d6ee` |
| `packages/B-LOM.json` | 90 | 13 733 | `616f7794679f1d7ee17f766011f5e792090924a48c7ca07a2080b15bb68f641c` |
| `packages/B1.json` | 393 | 25 083 | `22b2941d62695bae3056dcf8720d51edd4715ee011fc2d7676ce93ccbfc95429` |
| `packages/B2.json` | 378 | 25 989 | `1e9af6784e5c4415d8a139a56416831352ec55f0ce7dc3710f2a8513ab829635` |
| `packages/B3.json` | 275 | 20 982 | `774b3b8ec7a35201fbd748e2d3a9519f9f6149d83cb51fbe80c286ad349eed48` |
| `packages/B4.json` | 265 | 20 449 | `7f6e0a188e87d79454a9578eb49aa010844997b076eee1305e89b99434193ac0` |

(This file is the ninth of the nine and is not in the table — a file cannot carry its own
hash; §r4.7 repeats the same eight rows as a plain block, generated from the bytes rather
than typed. The runner was **820** lines / 65 367 bytes / `6f69aa8e…` at r4's review commit
`477b025`.) The runner's sha256 is pinned by all six specs and re-resolved against Git at
HEAD on every run; each spec's sha256 is the one its own `SPEC OBSERVED` line prints.

## r4.1 What Y1 actually required, and where it had to live

The review's §5.1 is the one finding that could have produced a forged-looking
`POSTFIX PACKAGE PASS` without any forgery at all. For B1–B4 the substantive force of this
runner is the 45-law accounting. For a package in `NO_REGISTER_IDS` that accounting owes
**nothing**: `want(d)` is `RED` for every un-carried id and `GREEN` for the six carried ones
whether the package is empty or finished, so `LAWS DECLARED-STATE 45/45 rows agree` prints
either way. B-NTC's five declared children are the **parent's** NATIVE-CARRIERS successor
cells; its own provider test cell is in `product` and in no `children[]` entry, and nothing
required it to be. Seal that and the word prints on a run in which not one line of the new
provider executed.

The replacement obligation now in the runner, as `DECISIONS:108 (d)` recorded X1/X2 —
**standing, and mechanical**:

* `MIN_OWN_CHILDREN = 1` and `PRODUCT_ROLES` are constants in `b-package.cjs` (W7), so a
  spec can no more declare its way past the replacement than it can grant itself the
  `NO_REGISTER_IDS` exemption;
* `ownChildren(s)` = the declared children whose `argv` executes a file **this spec declares
  in `product` with role `new`**. Ownership is read out of the spec's own product roles,
  never declared;
* every one of those children is already subject to `children()`: it runs **in this
  process**, exits 0, and prints its **exact declared needle at line start**;
* `noRegister(s, ran)` prints `NO-REGISTER OBLIGATION <id> … n of m …` on every run and
  records an **open (`--ci` blocking) obligation** while `n < MIN_OWN_CHILDREN`;
* `envelope()` **refuses at the seal**, beside X1's re-assert and before the theme/brief
  asserts: `NO-REGISTER-PACKAGE-SEALED-WITHOUT-EXECUTING-ITS-OWN-PRODUCT`. The end-of-run
  re-evaluation is handed the `ran` map and re-takes the execution half as well
  (`NO-REGISTER-PACKAGE-OWN-CHILD-DID-NOT-EXECUTE`).

**Why the seal and not `spec()`.** The reviewer's reasoning is right and it is worth
restating because it is the difference between a gate and an obstruction: before the carrier
lands, `rebuild/m4/workout/test/native-trend-context.test.cjs` does not exist, and
`CHILD-ARGV-TARGET` refuses a declaration whose target is absent. A `spec()`-level rule
would refuse B-NTC and B-LOM outright today and block the lane instead of the forgery. At
the seal the files exist by definition. So the tip demo still reads `CI REVIEW-PENDING`
exit 2 for both ids — now with **one more open obligation each** (B-NTC 4 → 5, B-LOM
10 → 11), which is the honest reading of their state.

**And the sentence that overstated.** `LAWS DECLARED-STATE` now says, for these two ids
only, that the 45 rows are the **register baseline** and prove nothing about the package,
naming Y1 as what does. That is the same X4 standard applied to the one line §5.1 showed
was being read as more than it was.

## r4.2 Y1's second half — `superseded-by-child`, and a correction to §5.4

`DECISIONS:109` rules it in the PM's own words: *"a child package supersedes its parent's
execution pins exactly as NATIVE-CARRIERS superseded LOAD-WRITES"*, and *"Because B-NTC
re-pins rebuild.yml and the wrapper anyway, the remaining tooling items ride in THIS seal."*
Under the r3 runner such a file could enter a child's inventory only as role `new` — false
of a file the parent pins — and the `pin.pre === parent pin` equality that binds a parent
**product** pre-image did not reach it at all. `product()` now:

* requires role `superseded-by-child` for any file pinned in the parent's `executionPins`
  (`PARENT-EXECUTION-PIN-NOT-DECLARED-SUPERSEDED`), and requires `pin.pre` to **be** that
  execution pin's byte;
* refuses the role on a parent **product** pin (`PRODUCT-ROLE-MISLABELLED`) and on a file
  the parent pins nowhere (`SUPERSEDED-BY-CHILD-IS-NOT-A-PARENT-PIN`);
* names the superseded files in the `PRODUCT` line instead of hiding them among the new ones.

`B-NTC.json` declares `.github/workflows/rebuild.yml` this way,
`pre f57ced400231be9ed7167c6d76b7d04db827283543d556ec8e8bc97c647d7df8` — the parent's own
execution pin, byte-identical on disk, at `sourceBase e9c50e1` and at HEAD, measured before
the declaration was written. `pins()` needed no change: a file in `s.product` is already
preserved the way `native-carriers-profile.cjs:96` preserves it, in Git at `sourceBase`, so
the `PARENT PINS RE-ASSERTED` line moves it from the *kept* count to the *superseded* count
(30 + 21 where r4 measured 51 + 20, the same 51 pins).

**A correction to the review, made here rather than carried.** §5.4 says "B-NTC already uses
the same workaround for `workout-host.mjs` and `journey.test.mjs`". It does not:
`acceptance-native-carriers.json` pins **neither** of those — not in its 20-file `product`
map and not in its 31 `executionPins` (re-measured; the executionPins are listed in full in
the artifact). Those two really are outside the parent's pinned inventory and role `new` is
the correct label for them. The one genuine case in this package is `rebuild.yml`, which is
exactly the file `DECISIONS:109` names. Anything further B-NTC re-pins (`:109` also names
`engine-runtime.cjs` and the EXPOSED set) is declared with the new role at seal time — the
runner refuses `new` for it.

## r4.3 Y2 — the single-parent rule, read where it is durable

§5.2's finding has two halves and both are closed in `parent()`.

**The sibling specs are read from Git at HEAD as well as from disk.** r4's G14 freed the
sibling's `chosen` in an **uncommitted** edit and the check went silent: the tooling
directory is not one of the `PIN_PATHS`, `fidelity()`'s change scan reads commits, and a
seal pins only the sealing package's *own* spec bytes. Reading the siblings out of the
reviewed history closes it — an uncommitted hand cannot reach Git at HEAD, and a committed
one leaves the edit standing where the package's reviewer will diff it. The refusal now
names which copy caught it: `… already claimed by B-NTC (packages/B-NTC.json on disk)
B-NTC (rebuild/lanes/b/tooling/packages/B-NTC.json in Git at HEAD)`.

**The sealed artifacts on the chain branch are read from Git.** This is the half the review
called the one that actually matters: *"the durable fact — which artefact a sealed
`acceptance-*.json` names as its parent — is never consulted."* `parent()` now
`git ls-tree`s `rebuild/m4/spec/` on `CHAIN_REF`, parses every `acceptance-*.json` there
with `J.parseExact` out of Git, and refuses on a `parent.artifact` match that is not this
package's own artifact: `SINGLE-PARENT-CHAIN-SEALED`. `CHAIN_REF` is a runner constant
resolved from Git refs and nameable by no spec, exactly as X2 uses it.

Two properties worth naming because they are deliberate:

* **An unreadable sealed artifact refuses the run rather than being skipped.** A
  non-canonical `acceptance-*.json` on the chain branch dies at `JSON-NONCANONICAL-BYTES`
  (control Y2-a2). Skipping it would hand a forger the evasion — write the rival artifact
  with one space too many and the scan never sees it — so the fail-closed reading is the
  right one. It couples every package's run to every sealed artifact's bytes being
  canonical, which they are: the PM's integrator writes them and `parseExact` reads them
  everywhere else too.
* **The scan is bounded to `rebuild/m4/spec/`.** Every artifact a B package can name as a
  parent lives there (`ARTIFACT` is derived as `rebuild/m4/spec/acceptance-<slug>.json` from
  the package id), and so does every sealed child that could rival it. The grandparent
  `acceptance-step-efficacy.json` under `rebuild/conform/v4/postfix/` is outside the scan;
  no B spec can name it, and if the PM ever admits one, the bound moves with the option.

## r4.4 Y3 and Y4 — the text, and the counts

**Y3, three stale notes and one empty claim.** `B3.json`, `B4.json` and `B-LOM.json` each
carried *"parent.options NATIVE-CARRIERS now names the DECISIONS:104 CI re-seal …"* and
**none of the three has a NATIVE-CARRIERS option** (B3: `[B4, B2]`; B4: `[B2, B1]`; B-LOM:
`[B-NTC]`). The note was copy-pasted from B1/B2, where it is true. All three are now
`PARENT OPTIONS, CORRECTED (TOOLING-REVIEW-r4 Y3)` and say what their own bytes contain,
including where their pre-images actually came from (the NATIVE-CARRIERS map as it stands at
`sourceBase`, which is **not** a claim that NATIVE-CARRIERS is their parent) and that with
`chosen: null` the runner verifies them against disk and Git only. `B-LOM.json`'s
*"the product pre-images in this spec are the parent's own pins carried forward"* with
`product: {}` is replaced by `NO PRE-IMAGES TO RE-VERIFY`. `B-NTC.json`'s copy of the same
note is now exact: 21 of its 25 pre-images are the parent's (20 product + 1 executionPin),
four are its own new files. The r3 byte table's **812** is corrected to **820**, with the
correction marked in place rather than silently overwritten.

**Y4, the PIN_PATHS sentence.** It counted 18 where 16 exist. It now reads
`16 of 18 PIN_PATHS present in this tree and byte-identical Git vs disk; 2 not in this tree
and therefore vacuous (rebuild/conform/goldens rebuild/conform/manifest.json)` — the same
number in all twelve tip runs. The whole inventory is still handed to `git status`, so a
path that appears later is checked the day it appears; only the sentence changed.

## r4.5 The controls — 19 executed, each attributed to a named check

All mutation controls ran in a **scratch worktree of my own** (`AppData\Local\Temp\lb-fix4\wt`,
detached at the fix commit) so the delivery worktree was never dirtied; it and its debug
copies were removed afterwards (§r4.8). Attribution used a copy of the runner placed
**beside** it (`b-package-dbg.cjs`, one `console.error` in the terminal catch), so
`__dirname`, `root`, `SPEC_DIR` and the fixed `RUNNER` path still resolve to the **real**
runner's bytes and its spec pin still binds. **The real runner decides every exit code
below; the debug copy only says which check fired.**

### Y1 at the seal (the EXECUTE controls the brief names)

Reaching the ACCEPTED branch needs an artifact that **is** `proposed(s, bound)`
byte-for-byte, so the artifact was emitted by the debug copy and re-serialised into
`strict-json.cjs`'s canonical form (`JSON.stringify(parsed, null, 2) + '\n'` — the first
attempt used indent 1 and died at `JSON-NONCANONICAL-BYTES`, recorded because it happened),
then sealed with an `ACCEPTED` review. Both files existed only in the scratch worktree.

| # | control | exit | fired at |
|---|---|---|---|
| **Y1-1** | a `NO_REGISTER_IDS` spec with **zero** children, consistently sealed (`children: []`, `coverage.inherited: {}`, artifact = `proposed()`, review ACCEPTED) | **1** | `NO-REGISTER-PACKAGE-SEALED-WITHOUT-EXECUTING-ITS-OWN-PRODUCT B-NTC; 0 declared child(ren), 0 of them executing a role:"new" product file of this package, 1 required` |
| **Y1-2** | **B-NTC exactly as it ships** — five declared children, all the *parent's* successor cells, none of them its own — sealed the same way. This is §5.1's finding turned into a refusal | **1** | same check: `… 5 declared child(ren), 0 of them executing a role:"new" product file of this package, 1 required` |
| **Y1-3** | POSITIVE, sealed: the carrier lands (a real cell under `rebuild/m4/workout/test/`, its `pre` taken from its bytes) and one declared child runs it | **1** | **Y1 passed**; the run continued to the next named check, `THEME-AUTHORIZATION-UNAVAILABLE` — Y1 is not a blanket refusal |
| **Y1-4** | the execution half, unsealed: an own child declared whose **needle never appears** in its stdout | **1** | `CHILD-NEEDLE-NOT-A-TERMINAL-LINE ntc-provider-cell` |
| **Y1-5** | POSITIVE, unsealed: the same own child printing its needle | **2** | **accepted** — `CHILD ntc-provider-cell OBSERVED; exit 0, 817 bytes of stdout, exact declared verdict at line start`; `NO-REGISTER OBLIGATION … 1 of 1 …`; the Y1 open obligation **closes** and the count falls 5 → 4; `CI REVIEW-PENDING` exit 2, no PASS word |

### Y1's second half — the role

| # | control | exit | fired at |
|---|---|---|---|
| **Y1-r1** | `.github/workflows/rebuild.yml` declared `role: "new"` (the pre-r4 workaround) | **1** | `PARENT-EXECUTION-PIN-NOT-DECLARED-SUPERSEDED .github/workflows/rebuild.yml is pinned by the parent in executionPins; declare role "superseded-by-child" (DECISIONS:109), never "new"` |
| **Y1-r2** | declared `superseded-by-child` with a pre-image one hex off the parent's execution pin | **1** | `UNLISTED-PRODUCT-DRIFT pre-image is not the parent execution pin: .github/workflows/rebuild.yml` |
| **Y1-r3** | a parent **product** pin (`rebuild/engine/plan.cjs`) mislabelled `superseded-by-child` | **1** | `PRODUCT-ROLE-MISLABELLED rebuild/engine/plan.cjs is a parent PRODUCT pin, not an execution pin` |
| **Y1-r4** | an unknown role (`"superseded"`) | **1** | `Product role .github/workflows/rebuild.yml` (the closed `PRODUCT_ROLES` vocabulary) |

### Y2 — the single parent

| # | control | exit | fired at |
|---|---|---|---|
| **Y2-a** | **the brief's control**: a sealed-looking `acceptance-b-lom-legacy-order-mapping.json` **committed** on a scratch branch on top of the **real chain tip**, claiming NATIVE-CARRIERS while B-NTC's spec claims it; `CHAIN_REF` redirected at the constant in a debug copy, because a fixer cannot push to `origin/rebuild/t2-client-core` | **1** | `SINGLE-PARENT-CHAIN-SEALED: rebuild/m4/spec/acceptance-native-carriers.json is already named as the parent by the sealed rebuild/m4/spec/acceptance-b-lom-legacy-order-mapping.json on refs/heads/r4f-chain` |
| **Y2-a2** | the same rival written with **non-canonical** bytes | **1** | `JSON-NONCANONICAL-BYTES` — it is refused, not skipped (§r4.3) |
| **Y2-a3** | baseline: the **shipped** runner, **real** `CHAIN_REF`, B-NTC unmodified | **2** | no refusal — `PARENT BOUND NATIVE-CARRIERS …; single-parent chain holds — no sibling spec claims it on disk or in Git at HEAD, and no sealed artifact on refs/remotes/origin/rebuild/t2-client-core names it as parent` |
| **Y2-b** | **UNFORGED, on the real chain branch**: B-LOM names **LOAD-WRITES**, which the genuinely sealed `acceptance-native-carriers.json` already names as its parent. No scratch branch, no redirect, no debug constant — the rule bites on the real chain as it stands | **1** | `SINGLE-PARENT-CHAIN-SEALED: rebuild/m4/spec/acceptance-load-writes.json is already named as the parent by the sealed rebuild/m4/spec/acceptance-native-carriers.json on refs/remotes/origin/rebuild/t2-client-core` |
| **Y2-c** | **the r4 G14 repeat**: B-LOM claims NATIVE-CARRIERS and the sibling `B-NTC.json` has its `chosen` freed **on disk** | **1** | `SINGLE-PARENT-CHAIN: … already claimed by B-NTC (rebuild/lanes/b/tooling/packages/B-NTC.json in Git at HEAD)` — the disk scan is silent, the Git scan is not |
| **Y2-d** | the disk half still bites: the same claim with `B-NTC.json` untouched | **1** | `SINGLE-PARENT-CHAIN: … already claimed by B-NTC (packages/B-NTC.json on disk) B-NTC (… in Git at HEAD)` — both name it |

### r3's rules, re-checked against the r4 runner

| # | control | exit | fired at |
|---|---|---|---|
| **X1** | a non-empty `coverage.moves` on B1 | **1** | `COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING witnesses-1; coverage.moves must be {} under this runner (TOOLING-REVIEW-r3 X1)` |
| **X2** | B-NTC's parent `reviewSha256` off by one hex | **1** | `PARENT-REVIEW-BYTES-NOT-THE-PINNED-REVIEW NATIVE-CARRIERS` |
| **X4** | `status: BRIEF-ACCEPTED` with `acceptedLedgerLine: null` | **1** | `BRIEF-ACCEPTED-WITHOUT-A-CITED-LEDGER-LINE` |
| **W7** | B1 empties its own `dIds`/`laws` to self-grant the no-register exemption | **1** | `D-id inventory: unique, in range, never a already-repaired id` |

**19 controls: 17 refusals at exit 1 and 2 at exit 2 — Y1-5 and Y2-a3, the two that were
meant not to refuse.** (Y1-3 is a third positive in substance: it passes the Y1 assert and
then refuses at the *next* named check, which is what shows the assert is a gate and not a
wall.) Every refusal is attributed to a named check, not inferred from an exit code.

## r4.6 The tip demo — six ids, two modes, and the refusals

Twelve real runs plus seventeen malformed invocations on the unmodified delivery worktree,
on the fix commit, with `b-package.cjs` and all six `packages/*.json` at exactly the bytes
in the table above and `git status --porcelain --untracked-files=all` empty. (The demo was
run twice: once before this section was written and once on the committed bytes; only the
`FIDELITY` line's short HEAD differed. The one file edited after the second demo is
**this** one, `TOOLING-REPORT.md`, which no spec pins and the runner never reads — a
`--ci --package B-NTC` re-run on the final bytes reproduces `PARENT BOUND … single-parent
chain holds`, `NO-REGISTER OBLIGATION … 0 of 0 … 1 required at the seal` and
`CI REVIEW-PENDING: 5 open obligation(s)` at exit 2.)

| run | exit | terminal line |
|---|---|---|
| `--ci --package B-NTC` | **2** | `CI REVIEW-PENDING: 5 open obligation(s); public evidence only; no PASS is claimed` |
| `--ci --package B-LOM` | **2** | same, **11** open |
| `--ci --package B1` / `B2` | **2** ×2 | same, **5** open each |
| `--ci --package B3` / `B4` | **2** ×2 | same, **9** open each |
| `--full --package <each of the six>` | **2** ×6 | stderr `B PACKAGE <id> BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` |
| 17 malformed invocations | **1** ×17 | `B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B-NTC|B-LOM|B1|B2|B3|B4` |

The seventeen are: no args, `--ci` alone, `--full` alone, `--ci --package` (no id), `B5`,
`b1`, `b-ntc`, `B-ntc`, `BNTC`, `"B1 "` (trailing space), `--CI`, `--ci --full --package B1`,
`--seal --package B1`, `--package B1` alone, a fourth argument after a valid triple, a
repeated `--package`, and `-p` for `--package`.

**All twelve ran the register audit: `45/45` laws executed, `0 HARNESS_ERROR`,** and the
audit total line is **byte-identical in all twelve** —
`TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant
executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL` — the same line r3 and r4
measured, so nothing in this fix moved a law. The two no-register ids additionally print the
Y1 replacement (`NO-REGISTER OBLIGATION … 0 of 0 … 1 required at the seal`) and the
qualified `LAWS DECLARED-STATE` sentence. All twelve print
`16 of 18 PIN_PATHS present in this tree and byte-identical Git vs disk`.

**Bare `PASS` lines: 0.** Across the twelve logs the word stands on **24** lines and every
one of them is a negation: `… is not sealed yet — no PASS word is available`,
`theme NULL — no PASS word is available`, `no PASS is claimed`. **No run reached exit 0**,
in either mode, for any id.

**The open counts moved, and only where Y1 says they should:** B-NTC 4 → 5, B-LOM 10 → 11.
B1, B2 (5 each) and B3, B4 (9 each) are unchanged from r4's measurement.

## r4.7 Delivered bytes, measured after the last edit

The `MEASURED BYTES` block at the **end of this file** carries the same eight rows as the
table at the head of §r4, generated from the bytes rather than typed, so the two can be
checked against each other and against the files. Every sha256 there is reproducible with
`Get-FileHash -Algorithm SHA256` (or `sha256sum`) on the committed bytes; the runner's is
also the value all six specs pin in `tooling.runnerSha256` and the value every
`SPEC OBSERVED` line prints for the runner.

## r4.8 Residual risks carried forward, as r4 recorded them

1. **R1 (unchanged; the most important thing a reviewer of a sealed package does).**
   Pre-seal the runner and its spec can be co-edited and the Git-at-HEAD pin falls to anyone
   who can commit. No PASS is reachable pre-seal. **A sealed B package must be reviewed by
   *diffing* `b-package.cjs` and `packages/<id>.json` at the reviewed commit, not merely by
   running them** — r4 §6 makes this precise: the artifact is a pure function of those two
   files plus the bytes on disk, so reading them *is* reading the artifact. Y1 and Y2 do not
   change this and are not meant to.
2. **R3-A — closed by removal of reach** (X1; re-verified here as control X1).
3. **R3-B — closed** (X2; re-verified here as control X2).
4. **R3-C — open, correctly disclosed, unreachable.** A wrapper that prints a gate's needle
   without running the gate is accepted by the move path, and the runner's sentence
   (*"observed emitting that gate's own needle"*) is literally true of it. No rule that reads
   only a child's stdout can prove execution; the real fix is to run the gate through
   `R.gateRun`, and it belongs with the first real `legacy-b<N>-carriers.cjs` under the PM
   ruling that admits moves at all. Under X1 it has **no reach**: `MOVES_RULING` is `null`,
   so `coverage.moves` cannot be non-empty in `spec()` or at the seal.
5. **R3-D — live, and it moved TWICE inside this one fix.** `origin/rebuild/t2-client-core`
   was `9f68d0a` when r4 started, `e6b812e` when r4 finished, **`5dc9254`** when this fix
   fetched at `636aeaa`, and **`7ae4face`** by the time the last verification ran — twice in
   about half an hour, without my fetching it in between. This machine has other sessions.
   Every movement was checked rather than assumed: the parent artifact
   (`e940359b…`) and review (`9b0918d6…`) are byte-identical on the new tip and on disk, the
   sealed set is still exactly two (`acceptance-load-writes.json` → step-efficacy;
   `acceptance-native-carriers.json` → load-writes), and `--ci --package B-NTC` re-run at
   `7ae4face` still reads `PARENT BOUND … single-parent chain holds` and `CI REVIEW-PENDING:
   5 open obligation(s)` at exit 2. **A seal run must `git fetch origin` first, and a
   refusal on a pin that looks current should be read as a stale remote-tracking ref before
   anything else.** Y2 raises the stakes on this by name: the sealed-rival scan reads
   `CHAIN_REF`, so a stale ref can both miss a rival that was sealed upstream and refuse on
   an artifact that has since moved. It also means a sealer who does not fetch can be told
   the chain has one head when it has two.
6. **R4 — closed as a sentence, open as a fact (Y4).** 16 of 18 `PIN_PATHS` exist and the
   line now says so. The two absent paths stay in the inventory handed to `git status` so
   they bind the day they appear. `rebuild/m4/spec` is still **not** among the 18, so a
   dirty worktree there is caught only by the artifact/review byte pins and by
   `L.checkSources` at the seal.
7. **R5 — half discharged, and kept honest.** r4 executed the ACCEPTED branch of
   `envelope()` end to end on real bytes for the first time, including `L.checkSources` over
   28 pins in Git and on disk, and this round drove the same branch four more times (Y1-1,
   Y1-2, Y1-3, and the PENDING baseline) — so **the `--ci` envelope path is now exercised**,
   with the new Y1 assert sitting on it. **The `--full` ACCEPTED path still awaits a real
   receipt**: the PM's first `--full` on a sealed package is still the first execution of
   `gates()` and `historical()` on this tooling. Treat *those* as the rehearsal and write the
   receipt after them, not before.
8. **R6 — unchanged.** `gates()` and `historical()` are unexecuted on any machine without the
   private fixture (`DECISIONS:97`); `rebuild/conform/private/` does not exist on this PC and
   was never created here. `privateOracle()` reports existence only, and all six `--full`
   runs terminated on its BLOCKED line.
9. **R7 — unchanged.** `--ci` is still not wired into `.github/workflows/rebuild.yml`. That
   file is a NATIVE-CARRIERS execution pin, and `DECISIONS:109` puts its re-pin (plus the
   `checkin.test.mjs` enumeration and the retirement of the `# pass 19` child) **inside the
   B-NTC seal** — which is exactly why Y1's `superseded-by-child` role had to exist before
   that seal, and why `B-NTC.json` declares the file now rather than at the last minute.
10. **R8 — unchanged.** `fidelity()` still exempts every file a declared child executes; two
    of the five `CHILD_ROOTS` sit outside its change scan entirely; an untracked file beside
    the runner is invisible to it because `TOOLING_FILES` is a fixed list and the runner never
    enumerates its own directory. My own debug copies lived in exactly that blind spot for
    this whole round, unremarked, which is the demonstration rather than a complaint. They
    were deleted and `git status --porcelain --untracked-files=all` re-checked (§r4.9).
11. **`L.verifyBase` is still not used.** The accepted original pins
    `merge-base HEAD CHAIN_REF === expected` (`CANDIDATE-BASE-STALE`); this runner asserts
    ancestry instead, in three places, and Y2 adds a fourth read of `CHAIN_REF` that is a
    tree read rather than an ancestry assertion. Weaker than the original, anchored on the
    same branch, and r4 §6 shows it is the assertion the whole PASS hangs on.

**One new residual, from Y2 itself.** The sealed-rival scan parses **every**
`rebuild/m4/spec/acceptance-*.json` on the chain branch on every decided-parent run. That
couples any B package's run to those artifacts being canonical JSON and to `CHAIN_REF`
resolving — a non-canonical one refuses the run (deliberately; §r4.3), and an unfetched or
missing `CHAIN_REF` was already fatal before this change through X2's reads. It adds no new
network dependency: every read is from the local object store.

## r4.9 Restoration, verified

```
git -C work/lane-b/tooling status --porcelain --untracked-files=all   (empty)
git worktree list | grep lb-fix4                                      (empty — scratch removed)
git branch --list 'r4*'                                               (empty — scratch branch deleted)
rebuild/lanes/b/tooling/{*dbg*, *-chain*}                             (none)
rebuild/m4/workout/test/native-trend-context.test.cjs                 (absent, as it is on this branch)
rebuild/m4/spec/acceptance-b-ntc-*, review-b-ntc-*                    (never existed outside the scratch worktree)
rebuild/conform/private/                                              absent, and never created
origin/rebuild/t2-client-core                                         unchanged: 5dc9254 before and after
```

The scratch worktree (`AppData\Local\Temp\lb-fix4\wt`), its two debug copies, the scratch
branch `r4f-chain` and the two commits on it were **local only and never pushed**; the branch
was deleted with `git branch -D` and the commits are unreachable. The scratch worktree
carried a `node_modules` **junction** to the delivery worktree's (the audit needs esbuild);
it was removed as a reparse point only, and the target directory was counted before and after
(39 entries, unchanged) before the worktree was deleted. Nothing was written under
`rebuild/m4/spec`, `rebuild/conform` or `rebuild/engine` in the delivery worktree or on any
pushed branch — the forged artifact and review of Y1-1/Y1-2/Y1-3 existed only inside the
scratch worktree and were deleted with it. `ledger/` and `rebuild/conform/private/` were
never opened. No `package.json` or `package-lock.json` change was made or committed.

```
MEASURED BYTES (r4 fix, taken after the last edit; TOOLING-REPORT.md itself is not in the table —
a file cannot carry its own hash. Reproduce with Get-FileHash -Algorithm SHA256 on the committed bytes.)

b-package.cjs         966 lines   77756 bytes  cadde14fd93d2774a12909871d75e0907bd08814b5310fe231a0ea1737d5f92f
README.md             656 lines   46536 bytes  5bfe18ebad1aedb9dc9da796d052cb83c6d255136bf73e973ddfcfe67c951d0a
packages/B-NTC.json   265 lines   23996 bytes  5adb9c7a1248efe7873a26a177e01da545cee406984ea24a4261e3577421d6ee
packages/B-LOM.json    90 lines   13733 bytes  616f7794679f1d7ee17f766011f5e792090924a48c7ca07a2080b15bb68f641c
packages/B1.json      393 lines   25083 bytes  22b2941d62695bae3056dcf8720d51edd4715ee011fc2d7676ce93ccbfc95429
packages/B2.json      378 lines   25989 bytes  1e9af6784e5c4415d8a139a56416831352ec55f0ce7dc3710f2a8513ab829635
packages/B3.json      275 lines   20982 bytes  774b3b8ec7a35201fbd748e2d3a9519f9f6149d83cb51fbe80c286ad349eed48
packages/B4.json      265 lines   20449 bytes  7f6e0a188e87d79454a9578eb49aa010844997b076eee1305e89b99434193ac0
```

---

# §r5 — THE FIX PASS AFTER TOOLING-REVIEW-r5 (REJECT / NOT SAFE TO SEAL)

`TOOLING-REVIEW-r5.md` accepted `c7b7133` and confirmed r4's Y1–Y4 landed and effective, and
**REJECTED** `7cd7a5b` and `85f7d56`. Its F10 also recorded that this report was untouched by
all three commits and still described an 820-line runner. This section is the head of record.

## r5 §F10 — the delivered bytes at this head, measured

`TOOLING-REPORT.md` itself is not in the table; a file cannot carry its own hash. Reproduce
with `Get-FileHash -Algorithm SHA256` on the committed bytes.

**Re-measured at the r6-fix head** (TOOLING-REVIEW-r6 change 1; the figures that stood here
were r5's and the head had moved twice under them — F1):

| file | lines | bytes | sha256 |
|---|---|---|---|
| `b-package.cjs` | 1540 | 123 956 | `eedabccd5b8145bfb07fe653bfb14f9483af8ca52619e813c70bf699407dd612` |
| `README.md` | 774 | 55 302 | `ad6116e6eb6bcaac2f8bfddbcb9cfd16d25bdb371fe26a3a614259e9ebd7ac72` |
| `test/execution-targets.test.cjs` | 197 | 13 304 | `d36db094ed10df0ea2d9ca2eb81b2b88caafad179b28f47992dbf80b4ed39bf4` |
| `test/successor-moves.test.cjs` | 353 | 22 650 | `06f77b5a2cf8a611a673c761228132f00901fe476f6143097dc6c73ddcd6c97d` |
| `test/product-phase-and-ledger.test.cjs` | 221 | 14 186 | `b7a116af01e28a375e307906dc708539adacf5835e7b2cf5439d52c4558cf553` |

The **seven** package specs carry `eedabccd…` as `tooling.runnerSha256`, re-pinned
mechanically, and their own bytes are printed by `SPEC OBSERVED` on every run (and are
pinned in Git at HEAD from this revision — Z7). Their sizes at this head:
`B-NTC.json` 24 020 B, `B-LOM.json` 13 757 B, `H3.json` 11 706 B, `B1.json` 25 107 B,
`B2.json` 26 013 B, `B3.json` 21 006 B, `B4.json` 20 473 B — on `rebuild/lane-b-tooling`;
`B-NTC.json` is larger on `rebuild/lane-b-ntc`, where the package's own children and
successors are declared. `H3.json` is new at this revision: `DECISIONS:124` rules
`M2-H3-CLEAN-INIT` a package of its own, and the file is a SKELETON only — every run of it
refuses `REGISTER-D-ID-INVENTORY-EMPTY-AND-NOT-EXEMPT`, exit 1.

(For the record of what moved: r4's head was 966 lines / 77 756 bytes; the head r5 reviewed
was 1077 lines / 85 080 bytes / `ca0419e6…`, and **that head is withdrawn** — see below.)

There is **no** `b-ntc-successors.json` in this directory and no policy file of any kind: the
successor rule lives in `b-package.cjs` constants, where `DECISIONS:113 (1) (e)` puts it.
`b-ntc-successors.cjs` — the lane-authored successor module — lives in the PACKAGE, at
`rebuild/m4/spec/`, on `rebuild/lane-b-ntc`; this runner reads its substitution table without
executing it.

## The two commits are WITHDRAWN, not patched

```
$ git revert --no-edit 85f7d56 7cd7a5b
[rebuild/lane-b-tooling 02eb2e3] Revert "Require B-NTC policy and bind inherited gates to exact accepted schedules"
[rebuild/lane-b-tooling e8e2d61] Revert "Bind B-NTC successors to exact source policy and accepted-chain authority"
$ git grep -n -e '614717800602' -e 'B-NTC-SUCCESSORS' -- rebuild/lanes/b/tooling   → exit 0 (2 matches)
$ node --test rebuild/lanes/b/tooling/test/execution-targets.test.cjs             → # pass 9 · # fail 0  exit 0
```

**Corrected at r6 (change 1 / §Scope A).** That `git grep` exits **0**, not 1, and this
report said 1. Both needles survive — in the two REPORT files that quote the command, at
`TOOLING-FIX-r5-REPORT.md:48` and at this file's own line above. Nothing load-bearing
carries them: no digest, no policy file and no void theme is read by the runner or by any
spec, and the two reverts did take the code. The distinction matters because "exit 1" was
the claim that the strings were GONE, and they are not — they are quoted, which is a
different and weaker thing. Said plainly rather than re-grepped into looking true.

History stays honest: the r5 review commit stays on top of the commits it rejected, and two
revert commits stand above it. `c7b7133` (ACCEPT) is untouched. The Astra policy digest and
the void theme name are load-bearing nowhere in this directory; they survive only as the
quoted needles above.

## The two suites at this head

```
$ node --test --test-reporter=tap rebuild/lanes/b/tooling/test/execution-targets.test.cjs
  # tests 9 · # pass 9 · # fail 0   EXIT=0
$ node --test --test-reporter=tap rebuild/lanes/b/tooling/test/successor-moves.test.cjs
  # tests 9 · # pass 9 · # fail 0   EXIT=0
$ node --test --test-reporter=tap rebuild/lanes/b/tooling/test/product-phase-and-ledger.test.cjs
  # tests 7 · # pass 7 · # fail 0   EXIT=0
```

(There are **three** suites at the r6-fix head, 25 cases; the heading above says two because
the third landed with the self-clearing commit `8d3d362` and this section was written before
it. Re-measured at the r6-fix head: 9 + 9 + 7, all exit 0. The ninth successor-moves case is
r6 change 3's own control — a successor module rewritten to `require()` the original refuses
`SUCCESSOR-REQUIRES-THE-ORIGINAL-INSTEAD-OF-COMPILING-IT`, and is admitted again when the
require is removed.)

`execution-targets.test.cjs` is **Z8-fixed**: its inherited-map case built its expectation
from the real `packages/B-NTC.json` and asserted `children.length === 5`, which is true on
`rebuild/lane-b-tooling` and false (15) on `rebuild/lane-b-ntc` — r2's R8 by construction.
It now builds its own five-carrier / nine-gate fixture and is 9/9 on either branch.

`successor-moves.test.cjs` is **lane B's own (Z9)**, replacing the withdrawn
`successor-authority.test.cjs`, which read `B_NTC_SOURCE_ROOT` defaulting to a sibling
worktree and `git archive`d a commit on one lane branch only. The replacement builds its own
Git repository in a temp directory, commits into it, compiles the REAL runner against it with
exactly two constants re-pointed at that fixture (asserted to be the only two lines that
differ), and drives `successorProof` / `successorCoverage` directly. No sibling worktree, no
second branch, no accepted artifact, no receipt, no network. Its eight cases are the positive
control plus one named negative per rule: Z1 (only the ruling admits, and a carrier whose
closure does not reach the superseded support file drops out of the derived set), Z2 (the
original's two anchors; a lockstep re-pin still refused by the Git blob; a copy instead of a
load; a weakened table; a replacement outside the table; a missing table; a `from` absent from
the original), Z3 (a prefix needle and a `0/6` needle both refuse), Z5 (no policy
`sourceCommit` is read anywhere; the chain anchoring is a real Git ancestry question) and Z6
(the vocabulary, and that `failCode` returns the code alone and `null` for anything else).

## The moves rule, as it now stands

`MOVES_RULING` is still `null` and `coverage.moves` is still `{}` in all seven specs — **X1 is
not widened, for B-NTC or for anyone**, which is `DECISIONS:113 (1) (a)` in terms. What the
ruling admits is narrower: an inherited gate whose covering child is not a parent-pinned
executable, and only for the package ids `SUCCESSOR_PACKAGES` names, only for gates DERIVED
from the parent artifact's own `coverage.byChild` whose carrier closure reaches the superseded
support file, and only when the spec cites `MOVES_RULING=DECISIONS:113`. The four proofs each
successor must pass, and the refusal codes, are in `README.md` §"Successor carriers" and in
the runner's own header.

r5's Z1 was written before line 113 landed and reads `:112`'s earlier wording, under which the
nine would have been `coverage.moves`; r5 itself put that to the PM as its question 1, and
`:113` answered it the other way. The tooling follows the ruled text, and says so in the
header rather than leaving a reader to reconcile the two.

## r7 — the delivered bytes at THIS head, re-measured

The r6 table above is superseded: the head has moved and every figure in it was taken
before the r7 changes. Measured with `Get-FileHash -Algorithm SHA256` on the committed
bytes; `TOOLING-REPORT.md` is not in the table because a file cannot carry its own hash.

| file | lines | bytes | sha256 |
|---|---|---|---|
| `b-package.cjs` | 1970 | 158 238 | `769fd09e2baa8b5ea4a628d20b781a321bd2d13d4601ae3b17ecf04520962186` |
| `README.md` | 885 | 64 169 | `2f3d5e1b7d5e15c32a161e3790be0b8c274c41f92bc9885a1cc44c0ce56768d9` |
| `test/execution-targets.test.cjs` | 197 | 13 304 | `d36db094ed10df0ea2d9ca2eb81b2b88caafad179b28f47992dbf80b4ed39bf4` |
| `test/successor-moves.test.cjs` | 357 | 23 109 | `6da629fe608c9bf416fcc5947c0658053dc5f9343a3d3217a2ce300918ac8235` |
| `test/product-phase-and-ledger.test.cjs` | 224 | 14 492 | `5984aa2610fd13f33253b6b2089c9e7d251b12cb094ee82fa40b38d99dc10430` |
| `test/pinned-unchanged-and-ruled-substitutions.test.cjs` | 280 | 19 095 | `d692bf7b301beb2facc6ad9f76c974e63215d8f78b539229dbafd8317c6d1d2c` |
| `test/seal-tip-and-byte-identity.test.cjs` | 277 | 15 949 | `1ec47370f3c041348381e70dc5b976da20e6e3d52a33f96f5078678ea808c49f` |
| `../tooling/preflight.cjs` | 160 | 10 364 | `702115658d21a36af4d552ee1a1c025f8899caa243ea2f9466af222039ec36df` |
| `../tooling/test/preflight.test.cjs` | 175 | 9 415 | `637428b4a6420ef0103a6571ea34a7ac2e123dc9930466607ee2999d567c1001` |

The **seven** package specs carry `769fd09e…` as `tooling.runnerSha256`, re-pinned
mechanically, and their own bytes are printed by `SPEC OBSERVED` on every run. Sizes at this
head: `B-NTC.json` 24 020 B, `B-LOM.json` 13 757 B, `H3.json` 12 553 B, `B1.json` 25 107 B,
`B2.json` 26 013 B, `B3.json` 21 006 B, `B4.json` 20 473 B.

`H3.json` grew by its own notes, not by a pin: `NO_REGISTER_IDS` now contains `H3`, so the
sentence that said "every run of H3 refuses `REGISTER-D-ID-INVENTORY-EMPTY-AND-NOT-EXEMPT`"
is no longer true and no longer stands there. `--ci --package H3` on this branch reaches
`CI REVIEW-PENDING: 12 open obligation(s)`, exit 2.

`rebuild/lanes/tooling/` is a NEW directory and is deliberately outside `lanes/b/`: the
preflight is shared by every lane (`DECISIONS:135 (3)`, "small, plumbing tier"). It is
therefore also outside `fidelity()`'s change scope, which is `rebuild/engine`,
`rebuild/conform`, `rebuild/m4/spec` and `rebuild/lanes/b/tooling` — no package pins it and
no package's evidence rests on it, which is the whole of what "plumbing tier" means here.

`receipts/` is new and is EMPTY on this branch: nothing here has an ACCEPTED envelope, so no
seal step has run and no byte-identity receipt exists to read. The seven paths
`receipts/<ID>.json` are in `TOOLING_FILES` so that the day one is written and committed it
is inside the change check rather than an `UNLISTED-SOURCE-CHANGE`.

## r7 — the suites at this head

| suite | cases | exit |
|---|---|---|
| `test/product-phase-and-ledger.test.cjs` | 7/7 | 0 |
| `test/execution-targets.test.cjs` | 9/9 | 0 |
| `test/successor-moves.test.cjs` | 9/9 | 0 |
| `test/pinned-unchanged-and-ruled-substitutions.test.cjs` | 12/12 | 0 |
| `test/seal-tip-and-byte-identity.test.cjs` | 13/13 | 0 |
| `../tooling/test/preflight.test.cjs` | 8/8 | 0 |

**58 cases, 0 fail.** r6 measured 25 across three suites; the three new suites are r7's own
(F1/F2/F3/F6, `DECISIONS:135 (4)` + `:136 (3)`, and `DECISIONS:135 (3)`). Two existing cases
were EDITED and it is worth saying which and why, because both are behaviour changes and not
test repairs: `product-phase-and-ledger.test.cjs` case (a) declared its unchanged file role
`new` and now declares it `pinned-unchanged` — the case is the same, the honest name for it
is not; and `successor-moves.test.cjs` Z5 asserted the two `merge-base --is-ancestor` call
sites textually and now asserts the two NAMED `ancestor(...)` calls plus that there is
exactly one ancestry call site in the whole runner.

## r7 — terminals at this head

`--ci --package`, exit **2** and `CI REVIEW-PENDING; public evidence only; no PASS is
claimed` for all seven: B-NTC **5 open** · H3 **12** · B1 **6** · B2 **6** · B4 **10** ·
B3 **10** · B-LOM **12** (printed in `IDS` order, which is now the ruled one). Every count
except H3's equals r7 §3, so nothing in this pass moved an obligation. H3 was `FAIL
REGISTER-D-ID-INVENTORY-EMPTY-AND-NOT-EXEMPT`, exit 1, before this pass and is now a
REVIEW-PENDING with twelve named obligations — the change item 2 was for.

## r7 — what a reviewer should re-measure first

1. **The F1 grandfather is one-directional.** `product()` takes the SEALED artifact as its
   third argument and exempts only a role-`new` `pre === post` pin the sealed artifact
   carries with that same role and those same two shas. Everything else — including the same
   pin on a spec with no artifact — refuses. The mutant to fire is the r7 reviewer's own:
   a 32nd `new` file re-declared `pre === post === disk` on an unsealed spec.
2. **The F2 count.** `describes()` should admit exactly the substitutions the ruling's
   descriptions name. Fire a third substitution over `native-carriers-profile.cjs`: r6's
   predicate admits it (the suite measures that, it is not asserted), r7's does not.
3. **SUPERSEDED by `DECISIONS:145`: `:135 (4)` is ANCESTRY, not first-parent.** The PM ruled
   that the current chain tip being an ancestor of the branch head is the test, that a merge
   and a rebase both count, that a stale base does not, and that the FREEZE escape is kept;
   `SEAL_TIP_RULE` ships as `'ancestor'` and the suite measures both settings. The paragraph
   below is the r7 reading and is kept for the record of what changed.
4. **(r7, superseded) `:135 (4)` is stricter than ancestry, deliberately.** `git merge --no-ff <tip>` from the
   lane does NOT satisfy it. That is a real operational constraint on every lane and the PM
   should see it: the answer is a rebase, or a FREEZE line.
5. **The `:136 (3)` receipt can only ever SKIP work.** It is read after the `--ci` evidence,
   the pins, the ledger and the ACCEPTED envelope have all been re-taken on that same run.
   A forged receipt buys a shorter run, not a PASS.

## r7 — B-NTC compatibility, measured in a throwaway clone

`rebuild/lane-b-ntc` seals on runner `eedabccd…`, spec `05a5aa1f…`, artifact `87f4848c…`.
Three probes in `git clone --shared` fixtures (the ntc worktree was never opened or written,
and the chain ref was set to this worktree's `origin/rebuild/t2-client-core`):

| probe | what | terminal | exit |
|---|---|---|---|
| A | the r7 runner dropped in, spec untouched | `FAIL RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER` | 1 |
| B | spec re-pinned to the r7 runner | `FAIL SUCCESSOR-BLOCK-KEYS-NOT-CLOSED` | 1 |
| E | re-pinned and carrying `rulingLineSha256` | `FAIL SEALED-PROFILE-RECOMPUTATION` | 1 |

Probe E is the durable answer and it is structural, not a defect: the sealed artifact pins
the spec's sha256, and re-pinning the runner moves the spec's bytes. **Any** runner change
does this to **any** sealed artifact. So the sealed B-NTC keeps the runner it sealed with,
and these changes must land AFTER its merge and be taken up at its next re-seal.

The BASELINE control — the sealed bytes with their own sealed runner, on the real chain tip —
reproduces `ENVELOPE PENDING artifact=87f4848c… spec=05a5aa1f… runner=eedabccd…`,
`PRODUCT IMPLEMENTED; 33 at the declared post-image / 0 at the pinned pre-image / 20 carried`
and `LAWS 45/45 executed`, then stops in the clone's own `node_modules`
(`Cannot find module '@noble/hashes/sha2.js'`), which is a fixture gap and not a runner rule.
`PUBLIC CI EVIDENCE PASS` was therefore NOT re-reached in the clone, and is not claimed here.

## r7b and r8-fix — the delivered bytes at THIS head, re-measured

The r7 table above is superseded: it was taken before the **r7b** pass (the two defects the
H3 builder found) and before the **r8-fix** pass (TOOLING-REVIEW-r8's five changes), and
`DECISIONS:119 (6)` asks that a report's figures be the head's own. Measured with
`Get-FileHash -Algorithm SHA256` on the committed bytes; `TOOLING-REPORT.md` is not in the
table because a file cannot carry its own hash.

| file | lines | bytes | sha256 |
|---|---|---|---|
| `b-package.cjs` | 2200 | 176 780 | `59ecc7f91f5f8f6d40c5c0f61267c6f71ca7edd7987b8022da39c5a04a1cce0d` |
| `README.md` | 940 | 68 626 | `3a24a464ebda251daca2316f5467d5b847239e7184d8275226c27bffde20b881` |
| `test/execution-targets.test.cjs` | 197 | 13 304 | `d36db094ed10df0ea2d9ca2eb81b2b88caafad179b28f47992dbf80b4ed39bf4` |
| `test/successor-moves.test.cjs` | 391 | 26 189 | `d561d8490f78b3a6c63a83178f456b45cd3a78946eaf43817b6b47ae28c8f628` |
| `test/product-phase-and-ledger.test.cjs` | 224 | 14 492 | `5984aa2610fd13f33253b6b2089c9e7d251b12cb094ee82fa40b38d99dc10430` |
| `test/pinned-unchanged-and-ruled-substitutions.test.cjs` | 280 | 19 095 | `d692bf7b301beb2facc6ad9f76c974e63215d8f78b539229dbafd8317c6d1d2c` |
| `test/seal-tip-and-byte-identity.test.cjs` | 404 | 24 011 | `acbb8add15ca78459345ad0e301e037f17c943f0321ebe29bdec2b1faa9f4b9b` |
| `test/parent-pin-shapes-and-spec-successors.test.cjs` | 248 | 16 577 | `08f832a90ae8ba07ce76da57923c311eed5702a3fc98139a95870e1247351175` |
| `../tooling/preflight.cjs` | 166 | 10 896 | `fff710f9fc9c3ab38d74eea1f58889d0b2ba09af86439bcbf22e2622fae08eae` |
| `../tooling/test/preflight.test.cjs` | 191 | 10 371 | `f80bc48697e38f27f342fac10ddbc5bc63f45b9156ad15b2a1cc6e91ea364748` |

The **seven** package specs carry `59ecc7f91f5f8f6d40c5c0f61267c6f71ca7edd7987b8022da39c5a04a1cce0d`
as `tooling.runnerSha256`, re-pinned mechanically. Their own bytes at this head:
`B-NTC.json` 24 020 B `f5dff4b1…` · `B-LOM.json` 13 757 B `dbf24d83…` ·
`H3.json` 12 553 B `79cc15e4…` · `B1.json` 25 107 B `b273527f…` ·
`B2.json` 26 013 B `4a811159…` · `B3.json` 21 006 B `5d45d146…` · `B4.json` 20 473 B `d1531f41…`.

**r7b** (runner `56aba344…`, superseded by the figures above) fixed the two defects the H3
builder found: **F-E**, the parent-artifact readers knew only the flat `product` shape and so
blocked every child of B-NTC; and **F-C**, the successor machinery was hard-coded to
B-NTC-as-child and could not read `DECISIONS:142`'s grant to M2-H3-CLEAN-INIT. **r8-fix**
then applied TOOLING-REVIEW-r8's five changes, of which change 1 is the load-bearing one:
the `:136 (3)` byte-identity receipt must be COMMITTED and its own sha256 must be NAMED in
the verdict file before the step may stand in for a FULL run. `README.md` §"r7b and r8"
carries the long form of all of it.

## r7b / r8-fix — the suites at this head

| suite | cases | exit |
|---|---|---|
| `test/product-phase-and-ledger.test.cjs` | 7/7 | 0 |
| `test/execution-targets.test.cjs` | 9/9 | 0 |
| `test/successor-moves.test.cjs` | 9/9 | 0 |
| `test/pinned-unchanged-and-ruled-substitutions.test.cjs` | 12/12 | 0 |
| `test/seal-tip-and-byte-identity.test.cjs` | 16/16 | 0 |
| `test/parent-pin-shapes-and-spec-successors.test.cjs` | 8/8 | 0 |
| `../tooling/test/preflight.test.cjs` | 9/9 | 0 |

**70 cases, 0 fail.** r7 measured 58 across six suites; r7b added the seventh
(`parent-pin-shapes-and-spec-successors`, 8) and r8-fix added four more cases — two for the
receipt's authenticity, one for `parentPin`'s falsy-post edge and one for the preflight's
untracked UI scan — plus the `SEAL_TIP_RULE` case that compiles the runner a second time
with the one word changed and measures BOTH settings on one repository.

Terminals at this head, `--ci --package`, exit **2** and `CI REVIEW-PENDING` for all seven:
B-NTC **5 open** · H3 **12** · B1 **6** · B2 **6** · B4 **10** · B3 **10** · B-LOM **12** —
every count equal to r7's, so neither pass moved an obligation.
