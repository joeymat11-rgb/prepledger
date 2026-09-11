# LANE B — TOOLING REVIEW r2 (independent, blind)

- **Under review:** `rebuild/lanes/b/tooling/` — `b-package.cjs` (514 lines, 40,428 bytes,
  `f0d20e95c6b91948c06bf066bbf6990126445fbe8e7e26c961d3e565b0bf48ec`), `packages/B1–B4.json`,
  `README.md`, `TOOLING-REPORT.md`
- **Branch / commit:** `rebuild/lane-b-tooling` @ `e3da0938694ec5554ad31ef02e3a44ef733fe4cc`
  (base `acd3b6755404ab75e91087d179e48ed07467549a`; builder `53884bf` → r1 review `34dc8de`
  → fixer `e3da093`).
- **Reviewer:** lane-b-reviewer2 (LANE B, r2). Not the builder, not the r1 reviewer, not the
  fixer. Authored no byte under review and read the r1 verdict only after taking my own
  controls on W1–W7.
- **Method:** execution on the owner's Windows PC in the detached worktree
  `work/lane-b/review-tooling` at `origin/rebuild/lane-b-tooling`. Node `v24.19.0` at the
  pinned runtime path; `node_modules` already present, `package-lock.json` untouched. Shell
  `powershell.exe`, fresh per call, absolute paths. No other worktree touched. The two
  temporary envelopes the post-seal controls need were created and deleted inside the bite
  harness; `git status --porcelain --untracked-files=all` is **empty** afterwards.
- **Privacy:** nothing under `ledger/` or `rebuild/conform/private/` was opened.
  `rebuild/conform/private/` does not exist on this tree and was not created. No private
  value, count, hash or prose appears here — verdict only.
- **Date:** 2026-09-11

## VERDICT: ACCEPT WITH CHANGES

W1, W4, W5, W6 and W7 are **closed**, verified by my own controls rather than the fixer's.
W2 and W3 are closed for every case r1 named but **not for the class they belong to**: the
existence-only skip is gone, yet the gate matrix can still be emptied — `coverage.moves` is
unbounded, and the "declared child actually executed" test accepts a child that never runs
the file it names. One spec line plus one `argv` entry makes all 19 original gates
"covered" by `node --version`. That is `DECISIONS:97` F-PM-2 reconstituted through a
different door.

Nothing that ships today exploits it: all four specs carry `coverage.moves: {}` and five
children whose `argv` are plain file paths, and every one of my 30 bites refused or, where
it was accepted, still reached neither exit 0 nor a PASS word. That is why this is ACCEPT
WITH CHANGES and not REJECT. **`b-package.cjs` must not seal or claim PASS for any B
package whose `coverage.moves` is non-empty, or whose `children[].argv` carries any flag
outside `--test` / `--test-reporter=tap`, until N1–N3 below are closed and re-reviewed.**

## 1. Scope of the diff — clean

| check | command | outcome |
|---|---|---|
| fix scope | `git diff --name-status 34dc8de..e3da093` | 7 files, all `M`, **all** under `rebuild/lanes/b/tooling/` |
| stat | `git diff --stat 34dc8de..e3da093` | `7 files changed, 1371 insertions(+), 279 deletions(-)` |
| whole branch | `git diff --name-status acd3b67..e3da093` | 8 files, all `A`, under `rebuild/lanes/b/{reviews,tooling}/` only |
| immutable trees | same | **0** files under `rebuild/m4/spec`, `rebuild/conform`, `rebuild/engine`, `.github` |
| delivered bytes | sha256 of all 7 files | all 7 reproduce `TOOLING-REPORT.md` §r1.10 exactly |

## 2. Everything executable is REQUIRED, not copied

`node uses.cjs` over `b-package.cjs`: **five** `require(` sites, **zero** `createHash`,
**zero** `execFileSync`. `spawnSync` appears twice — the 45-law runner and the declared
children — which is exactly what `load-write-package.cjs` does. `JSON.parse` appears twice:
the `PIN_PATHS` extraction at L40 and the public oracle manifest at L436 (existence only).

| required from | symbol | what it provides | call sites |
|---|---|---|---|
| `conform/v4/postfix/run.cjs` | `R.GATES` | the 19 original gate descriptors (verified: 19) | L34, L460 |
| `conform/v4/postfix/run.cjs` | `R.gateRun` | the original gate executor | L462 |
| `conform/v4/postfix/legacy-gates.cjs` | `L.git` | the only git surface | L155, 248, 249, 255, 257, 422, 423, 424 |
| `conform/v4/postfix/legacy-gates.cjs` | `L.object` | bytes from Git at a named commit | L154, 416, 450 |
| `conform/v4/postfix/legacy-gates.cjs` | `L.verifyReceipt` | exact ledger line at a base, by role + mentions | L151, 196, 270, 408, 410 |
| `conform/v4/postfix/legacy-gates.cjs` | `L.checkSources` | `GIT-SOURCE-PIN` + `WORKTREE-SOURCE-PIN` over every pin | L421 |
| `conform/v4/postfix/legacy-gates.cjs` | `L.historicalAudit` | the pinned historical 45-law audit | L454 |
| `conform/v4/postfix/strict-json.cjs` | `J.parseExact` | canonical bytes + duplicate-decoded-key refusal | 8 sites |
| `conform/v4/postfix/target.cjs` | `sha` | the original sha256 | 11 sites |
| `m4/spec/native-carriers-errors.cjs` | `.codes` | the closed BLOCKED list, itself derived from `run.cjs` | L511 |
| `m4/spec/load-write-reference.cjs` | `.create` | the pinned public reference bundles | L487 |
| `conform/v4/postfix/run.cjs` (source) | `PIN_PATHS` | 18-path inventory, single-match regex + `assert.equal(m.length,1)` | L36–41 |

The `PIN_PATHS` derivation is not a `require` but it is not a copy either: it is the same
technique `native-carriers-errors.cjs` uses on the same file, and it refuses if `run.cjs`
ever carries a second inventory. I verified independently that `R.GATES.length === 19` and
that the extracted list is the 18 paths in `run.cjs:8`.

## 3. The tip demo, re-executed on the unmodified tree

All run as `node rebuild/lanes/b/tooling/b-package.cjs <args>` from the worktree root.

| invocation | exit | terminal line |
|---|---|---|
| `--ci --package B1` | **2** | `CI REVIEW-PENDING: 5 open obligation(s); public evidence only; no PASS is claimed` |
| `--ci --package B2` | **2** | `CI REVIEW-PENDING: 5 open obligation(s); …` |
| `--ci --package B3` | **2** | `CI REVIEW-PENDING: 10 open obligation(s); …` |
| `--ci --package B4` | **2** | `CI REVIEW-PENDING: 10 open obligation(s); …` |
| `--full --package B1` | **2** | `B PACKAGE B1 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` |
| `--full --package B2` | **2** | `B PACKAGE B2 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` |
| (no args) | **1** | `B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B1|B2|B3|B4` |
| `--third --package B1` | **1** | same refusal |
| `--ci --full --package B1` | **1** | same refusal |
| `--ci --package B9` | **1** | same refusal |
| `--ci --package b1` | **1** | same refusal (case-exact) |
| `--ci` alone | **1** | same refusal |
| `--package B1` alone | **1** | same refusal |

All six real runs executed `45/45` register laws with **0 HARNESS_ERROR**
(`TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls ·
97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL`), all five
declared children, and `COVERAGE 9/19 original gate(s) covered by 5 executed child(ren)
(9 inherited, 0 moved); 10 re-execute under --full`. `LAWS DECLARED-STATE 45/45 rows
agree with the spec at product phase NOT-IMPLEMENTED` in every run.

B3 and B4 report **10** open obligations, not the 4 r1 saw: with no sealed parent option on
disk, `parent()` now returns null and every dependent check is declared unverifiable
instead of silently skipped. That is an honesty improvement, not a regression.

`--full` no longer stops *before* the evidence: `privateOracle()` now runs after the laws,
the carriers and the children, so a BLOCKED `--full` still produces the whole public
matrix. `gates()` and `historical()` remain unexecuted on any machine without the private
fixture — unchanged, and correct under `DECISIONS:97`.

## 4. Each W re-verified with my own controls

### W1 — CLOSED. The runner and the spec are bound, in a chain where nothing pins itself

| # | my control | outcome |
|---|---|---|
| B01 | inject `console.log('B PACKAGE RUNNER-EDIT injected line executed')` into `b-package.cjs` | **exit 1** `FAIL` — `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER`, the first check in `spec()` |
| B02 | the same injection **plus** re-take `B1.tooling.runnerSha256` | **exit 2**, normal run, the injected line executes — pre-seal the two can be co-edited (see residual R1) |
| B03 | `B1.tooling.runner` → `README.md` | **exit 1** |
| B17 | delete `rebuild/engine/dates.cjs` from `B1.product` | **exit 1** `UNLISTED-PRODUCT-DRIFT … pinned by the parent and is not in this product inventory` |
| B18 | `B1.product['rebuild/engine/energy.cjs'].pre` → a wrong sha256 | **exit 1** (pre-image is not the parent pin) |
| B27 | one extra space inside the spec JSON | **exit 1** `JSON-NONCANONICAL-BYTES` |
| PS0 | seal `acceptance-b1-…json` by **independently recomputing** `proposed()` from the spec and the bytes on disk, review `PENDING` | **accepted**: `ENVELOPE PENDING artifact=77dd88e1… spec=a5c430c1… runner=f0d20e95…`, exit 2, 4 opens, no PASS |
| PS1 | after that seal, append one line to `B1.notes` (a field `proposed()` never reads) | **exit 1** — the artifact's `spec.sha256` binds the **whole** spec bytes |
| PS2 | after that seal, repeat B02 exactly (runner edited **and** spec re-pinned) | **exit 1** — the co-edit that passes pre-seal is refused once the artifact exists |
| PS3 | after that seal, alter one `executionPins` entry inside the artifact | **exit 1** `SEALED-PROFILE-RECOMPUTATION` |
| PS4 | flip the review to `ACCEPTED` with a self-consistent forged receipt naming the real artifact hash | **exit 1** — the line is not in `rebuild/DECISIONS.md` at its base |

PS0 is the load-bearing control: an artifact I built myself, with no help from the runner,
is accepted by `same(m, proposed())` — so the recomputation is exactly what the header
claims, and PS1/PS2/PS3 then show it is total.

**Is the runner's own sha256 checked from Git at the reviewed commit, or only from disk?**
Both, but on different paths. Pre-seal it is disk-only, against the pin the spec carries
(B01 refuses, B02 does not). Once a receipt exists, `envelope()` builds
`reviewed = {...m.executionPins, ...product post/pre}` — `executionPins` contains **both**
`b-package.cjs` and `packages/<id>.json` — and hands it to `L.checkSources(root, <reviewed
commit>, reviewed)`, the original routine, which fails `GIT-SOURCE-PIN` on the Git object
at that commit and `WORKTREE-SOURCE-PIN` on disk. I verified this by reading
`legacy-gates.cjs:13–19`; the ACCEPTED path itself is untested for want of a PM receipt
(residual R5).

### W2 — PARTLY CLOSED. The skip is gone; the accounting is still forgeable

What holds. `fs.existsSync` is out of the coverage path entirely; a covered gate must name a
`children[]` entry **by name**, that child must have run in this process with exit 0 and its
needle matched, and `coverage()` **and** `gates()` both re-assert it.

| # | my control | outcome |
|---|---|---|
| B06 | all 19 gates → `'native-carriers-source'`, an existing file that is not a declared child | **exit 1** `COVERAGE-CHILD-NOT-DECLARED` |
| B08 | drop `second-gate` from `B1.coverage.inherited` | **exit 1** `INHERITED-COVERAGE-IS-NOT-THE-PARENT-COVERED-SET` — the inherited set is pinned to the parent artifact's own `byChild` keys |
| B09 | `children[4].needle` → `''` | **exit 1** `CHILD-NEEDLE-EMPTY` |
| B11 | `children = [{name:'trivial', argv:['-e','0'], needle:'NATIVE SECOND GATE:'}]` | **exit 1** (`-e` is in `NO_INLINE`; `CHILD-ARGV-EXECUTES-NO-FILE`) |
| B17 | a product file deleted from the spec | **exit 1** `UNLISTED-PRODUCT-DRIFT` (above) |

**What does not hold — this is the finding.** `coverage.inherited` is bounded by the
parent's nine. `coverage.moves` is bounded by nothing at all: any of the remaining ten
original gates, mapped to any declared child.

| # | my control | outcome |
|---|---|---|
| **B07** | leave `inherited` alone; add the other **ten** gates to `B1.coverage.moves`, all mapped to the already-declared `second-gate` child | **ACCEPTED** — `COVERAGE 19/19 original gate(s) covered by 5 executed child(ren) (9 inherited, 10 moved); 0 re-execute under --full`, exit 2, same 5 opens |

And the "executed child" test is `r.status === 0 && r.stdout.includes(c.needle)` on an
`argv` whose flags are unvalidated. `NO_INLINE` is an **anchored exact match**, so it stops
`-e` and `--eval` but not `--eval=…`; and `argvFiles()` drops everything beginning with `-`,
so a flag that makes node never execute the named file is invisible.

| # | my control | outcome |
|---|---|---|
| **B15** | `argv: ['--version', 'rebuild/m4/spec/native-carriers-second-gate.cjs']`, `needle: 'v24.19.0'` | **ACCEPTED** — `CHILD second-gate OBSERVED; exit 0 and exact declared verdict`, gate covered. Child log: **10 bytes**, `"v24.19.0\r\n"`. The pinned file never ran |
| **B16** | `argv: ['--eval=console.log("NATIVE SECOND GATE: forged by the reviewer")', '…second-gate.cjs']`, the spec's real needle | **ACCEPTED** — same line. Child log: **43 bytes** of my own text. The pinned file never ran |
| **B30** | the composite: **one** child `{argv:['--version', …], needle:'v24.19.0'}`, `inherited` = the parent's nine mapped to it, `moves` = the other ten mapped to it | **ACCEPTED** — `COVERAGE 19/19 original gate(s) covered by 1 executed child(ren) (9 inherited, 10 moved); 0 re-execute under --full`, exit 2 |

B30 is `DECISIONS:97` F-PM-2 — *"nine frozen-source originals uncovered"* — restored and
widened to nineteen. Under a sealed, genuinely ACCEPTED envelope the PM's own FULL run would
print `POSTFIX PACKAGE PASS` having re-executed **zero** of the 19 original gates. The
accepted original pins `assert.equal(m.coverage.covered.length, 9)` and hard-codes every
child's `argv` in immutable code; this runner does neither.

Mitigating, and stated plainly: the run says so out loud —
`COVERAGE 19/19 … 0 re-execute under --full` and `FULL EVIDENCE: 0 of the 19 original
gates re-executed` are printed, not hidden, unlike r1's silent B5. A PM reading the
terminal would see it. It is still asserted by nothing.

**And the substring question.** `stdout.includes(needle)` is a plain, unanchored substring
test. B16 is the demonstration: a child that prints the needle inside any longer text, or
inside a "NOT OBSERVED: …" sentence, satisfies it. The needle floor (`trim().length >= 8`)
does not make it a verdict.

### W3 — PARTLY CLOSED. The schema holds; "never inline code" does not

| # | my control | outcome |
|---|---|---|
| B09 | empty needle | **exit 1** |
| B10 | 7-character needle (`'NATIVE '`) | **exit 1** — the ≥ 8 floor holds |
| B11 | `argv:['-e','0']` | **exit 1** |
| B12 | argv target `rebuild/DECISIONS.md` (outside the five roots) | **exit 1** `CHILD-ARGV-TARGET` |
| B13 | argv target `rebuild/m4/spec/not-a-real-child.cjs` (under a root, absent) | **exit 1** |
| B14 | argv target `rebuild/m4/spec/../../DECISIONS.md` | **exit 1** |
| B15/B16 | a flag that suppresses the file, or supplies the needle itself | **ACCEPTED** — see W2 |

`children[].name` is `[a-z0-9][a-z0-9-]{1,39}`, unique; `argv` non-empty strings; at least
one non-flag element, relative, traversal-free, under one of the five `CHILD_ROOTS`, and
existing on disk. All of that is real. The guarantee the header states — *"a child never
runs inline code"* — is not.

### W4 — CLOSED. Parent and grandparent pins are re-asserted, from disk, every run

| # | my control | outcome |
|---|---|---|
| honest run | `--ci --package B1` | `PARENT PINS RE-ASSERTED at run time; 31 pin(s) from acceptance-native-carriers.json plus its 20 product pins through the inventory below, and 23 un-superseded grandparent pin(s) from acceptance-load-writes.json, byte-identical on disk; parent artifact byte-identical in Git at 84d8f28892973b6cf68f37d2fe5ce80d97b1d165` |
| independent count | my own walk of `{…product, …executionPins}` minus `B1.product` | **31** parent pins and **23** grandparent-only pins — reproduces exactly |
| B19 | append one comment to `.github/workflows/rebuild.yml` (a parent execution pin, **not** in any spec's product) | **exit 1** `PARENT-PIN-BROKEN` — r1's specific complaint about `rebuild.yml` is answered |
| B20 | append one comment to `rebuild/m4/spec/load-write-traces.cjs` (a grandparent pin the parent did not supersede) | **exit 1** `GRANDPARENT-PIN-BROKEN` |
| B21 | rewrite one product hash inside `acceptance-native-carriers.json` on disk | **exit 1** — parent artifact bytes |

**From disk AND from Git at 84d8f28?** The parent *artifact* — yes, both:
`option()` reads `L.object(root, 84d8f28…, 'rebuild/m4/spec/acceptance-native-carriers.json')`
and requires byte equality with the disk copy and the declared sha256, plus
`merge-base --is-ancestor 84d8f28… HEAD`. The parent and grandparent *pins* are re-asserted
from **disk only**. The accepted original additionally reads each superseded file from Git
at `sourceBase` (`native-carriers-profile.cjs:96`); this runner instead binds the declared
pre-image to the parent pin inside `product()`. Equivalent in effect on a clean tree,
weaker if the worktree and HEAD ever disagree — but `fidelity()`'s
`git status --porcelain -- <18 PIN_PATHS>` closes that for everything under those paths.
Recorded as residual R3, not as a W.

### W5 — CLOSED, and executed

| # | my control | outcome |
|---|---|---|
| **B28** | with `B1.parent` decided on NATIVE-CARRIERS and the artifact **absent** at start, write a genuine PENDING `acceptance-b1-…json` + review **9 s into the run**, during the 45-law phase | **exit 1**, 41 stdout lines: the run printed `ENVELOPE ABSENT` at the top, re-asserted the pins, ran the laws, ran all five children and printed all nine `COVERAGE <gate> <- child …` lines, then **FAILED immediately at the position of the second `envelope()`** — before any OPEN line and before any terminal word |

`first.key = 'ABSENT'`, `last.key = 'PENDING:<hash>'`, and
`assert.equal(last.key, first.key, 'ENVELOPE-CHANGED-DURING-THE-RUN')` refuses. This is
strictly stronger than both accepted originals, which call `Profile.verify()` a second time
without comparing the two results.

### W6 — CLOSED for owner and contract; the theme is not verified until ACCEPTED

| # | my control | outcome |
|---|---|---|
| B22a | change one byte of `authorizations.contract.line`, leave `lineSha256` | **exit 1** — `claim()`'s `sha256(line) === lineSha256` |
| B22b | change that byte **and** recompute `lineSha256` (self-consistent) | **exit 1**, refused in `authority()` after `FIDELITY OBSERVED` — `RECEIPT-EXACT-LINE-MISSING` |
| B22c | replace the contract claim with the **real, self-consistent owner line** | **exit 1** — `RECEIPT-CONTENT` (`POSTFIX-GATE BRIEF`) / `INHERITED-CONTRACT-AUTHORIZATION` |
| **B23** | control: tamper `rebuild/DECISIONS.md` **in the worktree** and change nothing else | **no effect at all** — exit 2, the same 5 opens, `AUTHORITY OBSERVED … at f6aa4a2` |

**How I tested a Git-bound line.** B23 is the answer to "alter one byte in a scratch copy of
the ledger path". The runner never reads `rebuild/DECISIONS.md` from disk:
`L.verifyReceipt` calls `L.object(root, f6aa4a2…, 'rebuild/DECISIONS.md')` and searches the
Git blob for the line whose sha256 matches. A worktree edit is invisible (B23); the only way
to move the check is to move the *claim*, which is what B22a/B22b/B22c do — and all three
refuse. The contract line bytes are therefore bound at the parent's receipt commit, exactly
as required.

| # | my control | outcome |
|---|---|---|
| **B31** | replace `B1.authorizations.theme: null` with an **entirely invented** cowork line (self-consistent sha256, contains the package id, ends ` · ACCEPTED`, exists in no ledger) | **ACCEPTED** — `AUTHORITY OBSERVED … theme DECISIONS:101`, and the blocking obligation drops 5 → 4 |

`authority()` verifies owner and contract against Git; `theme` is verified only inside the
ACCEPTED branch of `envelope()`. Pre-seal it is a self-declared string that removes a
blocking obligation and prints as though it had been observed.

### W7 — CLOSED. No self-declared exemptions

| # | my control | outcome |
|---|---|---|
| B04 | add an `exemptions` key to the spec | **exit 1** — `SPEC_KEYS` is a closed `deepEqual` |
| B05 | point `artifact.file` at `acceptance-native-carriers.json` | **exit 1** — `ARTIFACT`/`REVIEW` are derived in the runner from the package id; the spec may only agree |
| B03 | point `tooling.runner` elsewhere | **exit 1** |

`TOOLING_FILES`, `CHILD_ROOTS`, `NO_INLINE`, `CARRIED`, `PIN_PATHS` and `GATE_IDS` are all
fixed in the runner or derived from the originals. The `UNLISTED-SOURCE-CHANGE` allow-list
is the declared product, the two derived paths, the fixed tooling inventory, the declared
carrier successor, and the files a declared child executes — that last entry is how B15/B16
also widen the change check, which is worth naming when N2/N3 are fixed.

## 5. New weakenings the fix introduced

A 514-line runner has more surface than a 25 KB one. These are the five I found, all
executed, all absent from `TOOLING-REPORT.md` §r1.11.

| # | weakening | control | required change |
|---|---|---|---|
| **N1** | `coverage.moves` is unbounded — any original gate, any declared child. `covered.size` is printed, never asserted; the original pins `covered.length === 9` | B07, B30 | bound the covered set: `inherited` exactly the parent's `byChild` (already true) and every `moves` gate covered only by a child whose `argv` target is this package's own declared `carrierSuccessor.file` or a file in its `product`/`executionPins`; assert `covered.size === Object.keys(parent.byChild).length + Object.keys(s.coverage.moves).length` against a declared, reviewed bound |
| **N2** | `NO_INLINE` is an anchored exact match, so `--eval=<code>` (and `--print=`, `--input-type=`, `--require=`) pass; the child's stdout is then whatever the spec wrote | B16 | replace the deny-list with an **allow-list** of flags — the originals only ever use `--test` and `--test-reporter=tap` — and refuse anything else |
| **N3** | any node flag that short-circuits execution satisfies the needle: `--version` prints 8 characters and exits 0 without running the named file | B15, B30 | require `argv[0]` to be a non-flag file (after the allow-listed flags), and pin every child target inside the artifact **and** assert the child's own log is not trivially short / require the needle at line start |
| **N4** | `status: 'BRIEF-ACCEPTED'` + `brief.acceptedLedgerLine: <any truthy>` clears a blocking obligation. The number is never resolved to a line; owner/contract/theme are bound by `claim()` + sha256, the brief acceptance is a bare integer | B29 (5 → 4 opens) | make `brief` a `claim()`-shaped citation verified through `L.verifyReceipt` like the others |
| **N5** | `authorizations.theme` is unverified until an ACCEPTED envelope exists; an invented line clears the obligation and prints `AUTHORITY OBSERVED … theme DECISIONS:101` | B31 (5 → 4 opens) | verify the theme at the parent's receipt base in `authority()`, exactly as owner and contract are |

Two smaller honesty points, not weakenings of the mechanism:

- The runner header says *"No PASS word without an ACCEPTED envelope naming the exact
  artifact bytes (DECISIONS:86-87)"*. The `--ci` success branch prints
  `PUBLIC CI EVIDENCE PASS` at exit 0 **with no artifact and no receipt**. That is parity
  with `load-write-package.cjs` and the word is qualified in its own sentence, but the
  header's claim is about `POSTFIX PACKAGE PASS`, not about every PASS word, and should say so.
- `PROTECTED SURFACES 4 declared, verdict-only UNCHANGED: …` asserts nothing. `UNCHANGED`
  reads as an observation; `protectedSurfaces` is free-text the spec supplies and the runner
  only counts and echoes.

## 6. Hunt for a path to PASS or exit 0 without a genuine receipt — none found

- **Every `catch`.** There is exactly one, at L509–513. It sets `process.exitCode` to 2 for
  a code in the original `BLOCKED` list and to 1 otherwise. **No branch of it can reach 0**,
  and it prints no PASS word. No other `try`/`catch` exists; `historical()`'s `finally` only
  removes its own scratch directory behind a `startsWith(logDir + sep)` assert.
- **`POSTFIX PACKAGE PASS`** requires `last.authorized && !open.length` — `last.authorized`
  is only true after `L.verifyReceipt` finds a real cowork line in Git at its base, the
  exact-verdict regex binds this package id / this artifact path / this artifact hash,
  `L.object` reproduces the artifact bytes at the reviewed commit, and `L.checkSources`
  re-reads every pin from Git and disk. PS4 confirms a forgery refuses.
- **`PUBLIC CI EVIDENCE PASS` (exit 0)** needs zero blocking obligations and no receipt.
  N4 and N5 remove two of them by declaration. The rest cannot be faked at this tip:
  `product NOT-IMPLEMENTED` needs real post-images (all four B1 `edited` entries declare
  `post: null`, and a fabricated post is unreachable because `product()` matches `pre`
  first), and authoring `legacy-b1-carriers.cjs` under `rebuild/conform/v4` immediately
  dirties a `PIN_PATH` and trips `PIN-PATHS-GIT-DISK-DISAGREE`. **No bite reached exit 0.**
- **Checks keyed on a string the spec supplies.** `packageId` (shape-constrained, and it
  *determines* the artifact path and the receipt regex, so it cannot be moved), `status` and
  `brief.acceptedLedgerLine` (N4), `theme` (N5), `protectedSurfaces` and `notes` (echoed
  only), `parent.options[].receiptLedgerLine` (printed; the line *content* is verified).
  Everything else resolves to bytes.
- **Across all 39 bite executions and 13 clean runs: 0 lines containing a bare `PASS`.** The only
  occurrences of the word anywhere are the two negations `no PASS word is available` and
  `no PASS is claimed`.

## 7. The 22 bites + 2 post-seal controls

Spec bytes, runner bytes, ledger bytes, parent/grandparent pins and the two temporary
envelopes were restored after **every** bite by the harness's `finally`. Final state
verified below.

| # | bite | exit | verdict |
|---|---|---|---|
| B01 | runner injected line | 1 | refused |
| B02 | runner injected line + spec re-pinned | 2 | **accepted pre-seal** (residual R1; PS2 refuses it post-seal) |
| B03 | `tooling.runner` points elsewhere | 1 | refused |
| B04 | spec adds an exemption key | 1 | refused |
| B05 | spec self-nominates the artifact path | 1 | refused |
| B06 | 19 gates → one undeclared existing file | 1 | refused |
| B07 | 10 gates → `coverage.moves`, one declared child | 2 | **ACCEPTED — N1** |
| B08 | inherited ≠ the parent covered set | 1 | refused |
| B09 | empty needle | 1 | refused |
| B10 | 7-character needle | 1 | refused |
| B11 | `argv:['-e','0']` | 1 | refused |
| B12 | argv target outside the five roots | 1 | refused |
| B13 | argv target under a root but absent | 1 | refused |
| B14 | argv target traverses out | 1 | refused |
| B15 | `argv:['--version', <pinned child>]` | 2 | **ACCEPTED — N3** |
| B16 | `argv:['--eval=…', <pinned child>]` | 2 | **ACCEPTED — N2** |
| B17 | a product file dropped from the inventory | 1 | refused |
| B18 | wrong product pre-image | 1 | refused |
| B19 | parent execution pin edited (`rebuild.yml`) | 1 | refused |
| B20 | grandparent pin edited | 1 | refused |
| B21 | parent artifact bytes edited | 1 | refused |
| B22a/b/c | contract ledger line tampered three ways | 1 | refused ×3 |
| B23 | control: `DECISIONS.md` tampered in the worktree | 2 | no effect (Git-bound) |
| B24 | non-existent law id for a package D-id | 1 | refused, after the 45-law run |
| B25a/b | B1 and B2 both bind NATIVE-CARRIERS | 1 | `SINGLE-PARENT-CHAIN` both ways |
| B26 | carried `D33` smuggled into `dIds` | 1 | refused |
| B27 | one extra space in the spec JSON | 1 | refused |
| B28 | artifact written mid-run | 1 | `ENVELOPE-CHANGED-DURING-THE-RUN` |
| B29 | brief obligation cleared by declaration | 2 | **ACCEPTED — N4** |
| B30 | composite: all 19 gates, one `--version` child | 2 | **ACCEPTED — N1+N3** |
| B31 | invented theme ledger line | 2 | **ACCEPTED — N5** |
| **PS1** | spec edited **after** the seal | 1 | refused |
| **PS2** | runner edited + spec re-pinned **after** the seal | 1 | refused |

(PS0 and PS3/PS4 are the seal control and two extra post-seal negatives.)

### Restoration, verified

```
git rev-parse HEAD                                     e3da0938694ec5554ad31ef02e3a44ef733fe4cc
git status --porcelain --untracked-files=all           (empty)
git status --porcelain --untracked-files=all -- rebuild/m4/spec rebuild/conform \
  rebuild/engine .github rebuild/lanes rebuild/DECISIONS.md rebuild/m3   (empty)
```

All seven tooling files re-hash to their reviewed sha256
(`b-package.cjs f0d20e95…`, `B1 26590872…`, `B2 17748626…`, `B3 c5985d17…`,
`B4 58950ea2…`, `README f9e6649b…`, `TOOLING-REPORT 22d428b8…`).
`rebuild/m4/spec/acceptance-b1-grading-time-window.json` and its review: absent.
`rebuild/conform/private/`: absent, and never created.

## 8. Cross-check of the fixer's own report

| claim (`TOOLING-REPORT.md` §r1) | verdict |
|---|---|
| §r1.1 W1 — three pins, nothing pins itself; B10 and B9 now refuse | **reproduces** (my B01, B17), and PS0–PS3 extend it |
| §r1.2 W2 — `fs.existsSync` gone; B5 refuses `COVERAGE-CHILD-NOT-DECLARED` | **reproduces** (my B06, B08) — but the section's claim that a gate is covered *only* by a genuinely executed child is **defeated** by B15/B16/B30 |
| §r1.2 note "`coverage.moves` is empty in all four specs" | **true**, and it is the only reason N1 is not live today. The section does not say `moves` is unbounded |
| §r1.3 W3 — "a child never runs inline code"; "at least one non-flag element must exist, so `argv:['-e','0']` refuses" | the second half **reproduces** (B11). The first half is **false**: `--eval=…` is not in `NO_INLINE` (B16) |
| §r1.4 W4 — 31 + 20 parent pins and 23 grandparent pins; parent artifact from Git at `84d8f28…` | **reproduces exactly**; I recomputed both counts independently |
| §r1.5 W5 — the deciding evaluation runs after the gates; `ENVELOPE-CHANGED-DURING-THE-RUN` | **reproduces** (B28 — executed, not just read) |
| §r1.6 W6 — owner and contract as exact ledger bytes at the parent receipt base | **reproduces** (B22a/b/c, B23). The section does not mention that `theme` is unverified on this path (N5) |
| §r1.7 W7 — `ARTIFACT`/`REVIEW` derived in the runner | **reproduces** (B05) |
| §r1.8 "all 22 refuse" | **true for those 22**; four of my own are accepted (B07, B15/B16, B29/B31) |
| §r1.9 tip demo, six rows | **reproduces line-for-line**, including the 5/5/10/10 open counts |
| §r1.10 delivered bytes, six rows | **all six sha256 and byte counts reproduce** |
| §r1.11 item 5 "the ACCEPTED happy path is still untested" | **true and correctly disclosed** |
| §r1.11 item 7 "W2's coverage accounting is no longer dead code" | **true** — it executes in every `--ci` run, which is how I found N1/N3 |
| preamble "nothing written under `rebuild/m4/spec`, `rebuild/conform`, `rebuild/engine`" | **true at this tip** — `git diff --name-status acd3b67..e3da093` shows 0 files there |

What the report should have said and did not: N1–N5 above. §r1.11's seven open items are
honest about what is *unfinished*; none of them is about what is *forgeable*.

## 9. Residual risks

1. **R1 — pre-seal, the runner and the spec can be co-edited.** B02: inject a line into
   `b-package.cjs`, re-take `tooling.runnerSha256`, and the run proceeds normally with the
   injected code executing. Nothing binds the spec until an artifact is sealed. The real
   anchors are the reviewed commit (a human diff) and, from the seal on, the artifact
   (PS1/PS2). Also note B01: a tampered runner executes its injected line **before** it
   checks its own hash — self-verification detects, it does not prevent. A reviewer of a
   sealed B package must diff `b-package.cjs` and `packages/<id>.json`, not just run them.
2. **R2 — the whole gate matrix rests on `coverage.moves` staying empty and on `argv`
   staying flag-free.** Today both hold in all four specs. Neither is enforced. This is the
   one thing that must be re-reviewed on every future spec until N1–N3 land.
3. **R3 — parent/grandparent pins are re-asserted from disk only.** The accepted original
   also reads superseded files from Git at `sourceBase`. `git status --porcelain` over the
   18 `PIN_PATHS` covers `rebuild/engine`, `rebuild/conform/v4`, `src`, `tools`, `scripts`,
   `app.js`, `index.html`, `sw.js`, `manifest.webmanifest`, `package.json`,
   `package-lock.json` — but **not** `rebuild/m4/spec`, `rebuild/m3` or `.github`, where 28
   of the 31 parent pins and all 23 grandparent pins live. A Git/worktree disagreement there
   would be invisible to that check (the pin comparison itself would still catch a content
   change, which is why this is a residual and not a W).
4. **R4 — two `PIN_PATHS` entries do not exist in this tree** (`rebuild/conform/goldens`,
   `rebuild/conform/manifest.json`); `git status` tolerates non-matching pathspecs, so
   "18 PIN_PATHS byte-identical Git vs disk" is nominal, not 18 live paths. Inherited from
   `run.cjs`, not introduced here. Unchanged from r1.
5. **R5 — the ACCEPTED happy path is still entirely untested.** Every negative around it is
   executed (PS4 and r1's B4a–B4f); the positive needs a real PM ledger line. The first
   genuine execution of `envelope()`'s ACCEPTED branch — including the `L.checkSources`
   Git-and-disk walk over every product and execution pin, and the theme verification that
   only lives there — will be the PM's own FULL run, unrehearsed. N1–N3 must be fixed
   *before* that run, not diagnosed by it. This is the same shape as the four F-PM-1…F-PM-4
   defects `DECISIONS:97` records.
6. **R6 — `gates()` and `historical()` remain dead code on every machine without the private
   fixture**, because `privateOracle()` still precedes them. Improved from r1 (the laws, the
   carriers, the children and the coverage map now all run before the BLOCKED stop, so the
   coverage accounting is exercised), but the 19-gate matrix itself has never executed here.
7. **R7 — `--ci` cannot yet be wired into `.github/workflows/rebuild.yml`**: that file is a
   NATIVE-CARRIERS execution pin (B19 proves the runner now enforces it), so any CI step
   must ride the one batched re-seal at B1 named in `DECISIONS:99`.
8. **R8 — `children[].argv` targets widen the change check.** `fidelity()` exempts every
   file a declared child executes from `UNLISTED-SOURCE-CHANGE`. That is correct for real
   children, and it is a second reason to close N2/N3: a spec can currently name a file it
   never executes and thereby exempt it from the change scan.

## 10. What the PM must still name

1. **The single parent.** Unchanged and still the one decision that unblocks all four.
   Every spec ships `parent.decided: false, chosen: null`. B1/B2 document the sealed
   `M2-NATIVE-CARRIERS` (`295762f0…`, receipt `DECISIONS:96`, reviewed at `84d8f28…`);
   B3/B4 document only unsealed options, which is why they report 10 open obligations
   instead of 5. Two packages naming the same parent refuse, both ways (B25a/B25b), so this
   cannot be deferred past the first seal. Whichever package is not first must re-take every
   pre-image sha256 at the new parent's accepted head, and its `coverage.inherited` must
   become that package's `byChild` set, not NATIVE-CARRIERS'.
2. **N1, N2 and N3 as blocking pre-seal conditions.** Or an explicit ruling that lane-B
   packages may declare gates covered by children that do not execute the file they name —
   which would need its own ledger line, because it reverses `DECISIONS:97` F-PM-2.
   Minimum bar I would accept: `coverage.moves` bounded and tied to this package's own
   carrier successor, and `children[].argv` restricted to an allow-list of `--test` and
   `--test-reporter=tap` with `argv` otherwise file-first.
3. **N4 and N5**, or an explicit ruling that the brief-acceptance and theme obligations are
   the PM's to check by eye rather than the runner's to bind. Until then the open-obligation
   **count** is not evidence: two of the five can be removed by declaration.
4. **Brief acceptance ledger lines for B1–B4** (all four `acceptedLedgerLine: null`) and the
   `theme` ledger line each spec leaves null.
5. **H1** (`today.cjs:92 e.id === "hack"`, `DECISIONS:93` C3) — inside B1 or as its own item.
6. **Who runs the FULL gate and who judges it.** `DECISIONS:100` puts the FULL engine gate
   on the lane and the acceptance on the PM. Given R5, the first lane-B FULL run should be
   treated as a rehearsal of the ACCEPTED branch, with the artifact sealed and the receipt
   written only after that run has exercised `checkSources` end to end.

---

*Reviewer's note: `PLAN-TRACK-B-PACKAGES-v1.md:146` and `BRIEF-B1 v1.1 §5.3` still propose
two different chains (`B2 → B1 → B4 → B3` and `NATIVE-CARRIERS → B1 → B2 → B4 → B3`). Item
1 above is naming one of them, not choosing a new one.*
