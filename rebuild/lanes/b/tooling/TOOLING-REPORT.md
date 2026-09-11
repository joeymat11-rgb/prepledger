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
