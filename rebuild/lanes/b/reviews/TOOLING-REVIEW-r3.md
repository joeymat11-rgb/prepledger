# LANE B - TOOLING REVIEW r3 (independent, blind)

Reviewer: lane-b-reviewer3. Not the builder, not the r1 reviewer, not the r2 reviewer, not
either fixer. Everything below was executed on the owner's PC against
`rebuild/lane-b-tooling @ 572a8c2741e2eec17fbc086dee734aed012f49d0`, runner
`b-package.cjs` sha256 `eaa731a143438dd0238925397c5ff3450fc8e1bafee5220f0332150a1460b81d`,
684 lines / 53683 bytes - all three re-measured here, all three agree with
`TOOLING-REPORT.md` r2.11. Node v24.19.0. Worktree
`work/lane-b/review-tooling`, detached at the reviewed commit.

The controls below are **mine**. I did not re-run the fixer's bite list; I read the runner
and designed 61 controls of my own, then executed them. Where a control coincides with one
of theirs the coincidence is in the target, not in the method.

## VERDICT: ACCEPT WITH CHANGES

W1-W7 are **closed** - every one re-verified by my own controls, and every refusal
attributed to the named check rather than inferred from an exit code. N2, N4 and N5 are
**closed**. N1 is closed for the accounting (the inherited map, the covered-set bound, the
one-gate-per-child rule) but its central claim - *"a move's child executes the gate's own
original"* - is a **text test, not an execution test**. N3 is closed for every short-circuit
form but its "real execution" evidence is **a byte count or a printable string**.

Composed, those two leave one live hole: **a declared child that never runs the gate's
original can carry a moved gate**, and the runner then prints that the gate is `MOVED,
carries <original>`. That is `DECISIONS:97` F-PM-2's defect class - gates reported covered
whose work never ran - reached through the move door instead of the skip door. I executed
it: exit 2, coverage 10/19, `migrate-full` counted, and under `--full` that gate would not
re-execute.

It is **much** narrower than what r2 found. It costs one authored file per gate under a
fixed root, a >=16-character reason, >=200 bytes of stdout with the declared verdict at
line start, and it is one gate per child - so "all 19 by one child" is refused, and ten
forged gates need ten files, ten moves and ten reasons, every one of which lands in the
sealed artifact's `children`/`coverage.moves`/`executionPins` and on the runner's own
output. It also cannot manufacture a `POSTFIX PACKAGE PASS` on its own: the PASS still
needs a real PM ledger line on `origin/rebuild/t2-client-core` naming the exact artifact
bytes.

And - decisively for the question the PM actually asked - **all four shipped specs carry
`coverage.moves: {}`**, with no argv flags and every child target under `rebuild/m4/spec/`
(the parent-pinned NATIVE-CARRIERS children). With `moves` empty the hole has **no reach at
all**: `coverage.inherited` must equal the parent artifact's `byChild` map byte-for-byte,
AND each inherited child's argv target must be a parent-pinned executable, so a wrapper
cannot become an inherited child. I verified both bounds by execution.

So: not a REJECT. **ACCEPT WITH CHANGES**, changes X1-X4 below, and **yes - safe to seal
B-NTC / B1 / B2** under X1 + X2.

## 1. Scope of the diff - clean

| check | command | outcome |
|---|---|---|
| fix scope | `git diff --name-status f385a78 572a8c2` | 7 files, all `M`, **all** under `rebuild/lanes/b/tooling/` |
| stat | `git diff --stat f385a78 572a8c2` | `7 files changed, 794 insertions(+), 75 deletions(-)` |
| immutable trees | same | **0** files under `rebuild/m4/spec`, `rebuild/conform`, `rebuild/engine`, `.github`, `rebuild/DECISIONS.md` |
| delivered bytes | sha256 of all 7 | `b-package.cjs eaa731a1`, `B1 ed2a59ab`, `B2 2005606f`, `B3 41bc9ce6`, `B4 06b4d367` - all five reproduce r2.11 exactly; README `1a9e129e`, TOOLING-REPORT `bde1e5c2` |

## 2. Everything executable is REQUIRED, never copied (confirmed)

Five non-stdlib `require(` sites, all to immutable originals, and **zero** re-implementation:

| original | what the runner takes from it | copied? |
|---|---|---|
| `rebuild/conform/v4/postfix/run.cjs` | `R.GATES` (x4), `R.gateRun` | no |
| `rebuild/conform/v4/postfix/legacy-gates.cjs` | `L.git` x8, `L.object` x4, `L.verifyReceipt` x6, `L.checkSources`, `L.historicalAudit` | no |
| `rebuild/conform/v4/postfix/strict-json.cjs` | `J.parseExact` x9 | no |
| `rebuild/conform/v4/postfix/target.cjs` | `sha` x12 | no |
| `rebuild/m4/spec/native-carriers-errors.cjs` | `.codes` (the closed BLOCKED list) | no |
| `rebuild/m4/spec/load-write-reference.cjs` | `Reference.create` (pinned public bundles) | no |

`createHash` **0**, `node:crypto` **0**, `execFileSync` **0**. `JSON.parse(` appears twice
and neither bypasses `parseExact` on reviewed bytes: once to decode `PIN_PATHS` **out of
`run.cjs`'s own source text** (a derivation, not a re-typing) and once for the oracle
manifest's path lookup. `GATE_FILE`, `GATE_GROUP` and `GATE_TERMINAL` are likewise derived
from `R.GATES`. Every `writeFileSync`/`mkdirSync`/`mkdtempSync` targets `.tmp/b-package/<ID>`
(gitignored); **nothing is written under `rebuild/m4/spec`** - the artifact is the PM
integrator's to write, as designed.

Original routines deliberately **not** used, which a future reviewer should know:
`R.validate`, `R.preflight`, `R.packagePending`, `R.parse`, `R.main`, `L.verifyBase`,
`L.assertions`, `L.exactDelta`, `L.faultRun`, `L.publicReferences`. The `L.verifyBase`
omission is a real divergence: the original pins `merge-base HEAD origin/rebuild/t2-client-core
=== expected` (`CANDIDATE-BASE-STALE`); `envelope()` instead asserts
`merge-base --is-ancestor r.commit origin/rebuild/t2-client-core`. Weaker, but still an
anchor on the real remote branch, and it is the check that defeats finding R3-B below.

## 3. The tip demo, re-executed - exit codes and 0 bare PASS

8 runs on the unmodified tree, plus 5 malformed invocations:

| run | exit | terminal line |
|---|---|---|
| `--ci --package B1` | **2** | `CI REVIEW-PENDING: 5 open obligation(s); public evidence only; no PASS is claimed` |
| `--ci --package B2` | **2** | same, 5 open |
| `--ci --package B3` | **2** | same, 10 open |
| `--ci --package B4` | **2** | same, 10 open |
| `--full --package B1..B4` | **2** x4 | `BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` |
| no args / `b1` / `--ci --full` / `--seal` / `B5` | **1** x5 | `B PACKAGE USAGE REFUSED` |

The `--full` BLOCKED terminal line is the standing report `DECISIONS:97` requires of every
package builder and reviewer running without the private fixture. `rebuild/conform/private/`
does not exist on this machine and was never created.

**Bare PASS: 0.** Every line containing the word across all 8 runs is one of three
negations - `... is not sealed yet - no PASS word is available`, `theme NULL - no PASS word
is available`, `no PASS is claimed`. Across the 8 demo runs **and** all 61 of my bites:
**0 bare PASS lines, and no run reached exit 0.** The 45-law total line reads
`AUDIT RED-FIRST FAIL` at this tip (39 RED-candidate, 97/104 mutants), so it carries no
PASS either; `historical()` and `gates()` both rewrite `PASS`->`OBSERVED` when unauthorized.

## 4. W1-W7, re-verified with my own controls

Refusal attribution note: the production runner deliberately withholds diagnostics, so I
built an attribution-only copy **beside** it (`b-package-debug.cjs`, same directory, so
`__dirname`, `root`, `SPEC_DIR` and the `RUNNER` pin - a fixed repo-relative path - all
still resolve to the **real** runner's bytes). Its only difference is one added
`console.error` in the terminal catch. Every control under test is byte-identical. It was
deleted afterwards; final `git status` is empty.

| # | my control | exit | fired |
|---|---|---|---|
| W1-01 | inject a line into `b-package.cjs`, disk only | 1 | `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER` |
| W1-02 | inject **and** re-take `tooling.runnerSha256` on disk | 1 | `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER-IN-GIT` |
| W1-03 | `tooling.runner` names another file | 1 | `Tooling pin names this runner` |
| W1-04 | spec adds an extra key | 1 | `Closed package-spec keys` |
| W1-05 | spec self-nominates the artifact path | 1 | `Artifact path is the one this package id determines` |
| W1-06 | one extra space in the spec JSON | 1 | `JSON-NONCANONICAL-BYTES` |
| W1-07 | duplicate decoded key | 1 | `JSON-DUPLICATE-KEY` |
| W2/N1-08 | the parent's nine gate ids kept, all re-pointed at one declared child | 1 | `INHERITED-COVERAGE-IS-NOT-THE-PARENT-COVERED-SET` (after all five children ran) |
| W2/N1-09 | a gate both inherited and moved | 1 | `A gate is inherited-covered or moved, never both` |
| W2/N1-10 | coverage names a child absent from `children[]` | 1 | `COVERAGE-CHILD-NOT-DECLARED` |
| W3 | empty / 7-char / newline-bearing needle | 1 x3 | `CHILD-NEEDLE-EMPTY` |
| W4 | parent + grandparent pins | - | 31 parent + 23 un-superseded grandparent pins re-asserted **on disk AND in Git at HEAD**, 20 superseded preserved in Git at `sourceBase 87eddad`; observed on every clean run |
| W5 | - | - | `envelope()` is evaluated twice and `key` compared; the `ENVELOPE-CHANGED-DURING-THE-RUN` equality is present and reached on every run |
| W6 | owner + contract | - | both found as exact line bytes at `f6aa4a2` under role `cowork`; contract asserted byte-equal to the parent artifact's |
| W7 | spec adds an exemption key / nominates its own artifact path | 1 x2 | W1-04 / W1-05 above |

**W1 residual R1, stated precisely.** W1-01 and W1-02 both printed my injected line
**before** refusing: self-verification detects, it does not prevent. And I tested the r2
fixer's new Git anchor directly - **C-COMMIT-1**: tamper the runner, re-take the spec pin,
and **commit both** on a local scratch branch. Result: `exit=2`, my injected line is the
**first line of stdout**, and the runner reports
`runner 35eb4779... byte-identical on disk and in Git at HEAD`, then proceeds to its normal
`CI REVIEW-PENDING: 5 open obligation(s)`.

So, to answer the question directly: **"hash from Git at HEAD" does not defeat an attacker
who can commit.** It defeats a *dirty worktree*, which is a real and worthwhile
improvement over r1, and nothing more. **The real anchor is the sealed artifact's own
`runner.sha256`, re-read from Git at the commit the PM's receipt line names** - `envelope()`
puts the runner and the spec into `executionPins` and hands them to `L.checkSources(root,
reviewedCommit, ...)`, which compares Git **and** disk. **Pre-seal edits are acceptable by
design**: before a seal there is no artifact, no receipt and therefore no reachable PASS -
every pre-seal run ends REVIEW-PENDING at exit 2. The obligation this creates is on the
human: **a reviewer of a sealed B package must diff `b-package.cjs` and `packages/<id>.json`
at the reviewed commit, not merely run them.** The runner's own `TOOLING-REPORT.md` r2.12(2)
says this; I confirm it is the correct reading and that it is load-bearing.

## 5. N1-N5 with my own controls

### N2 - CLOSED. 24 argv probes, 23 refusals, each attributed

`--eval=console.log(1)` -> `CHILD-ARGV-INLINE-CODE`. Same for `-e`, `-p`, `--print=`,
`--input-type=`, `-r`, `--require=`, `--import=`, `--loader=`, `--experimental-loader=`.
`--version`/`-v`/`--help`/`-h` -> `CHILD-ARGV-SHORT-CIRCUITS-EXECUTION`.
`-` and `--` -> `CHILD-ARGV-STDIN-OR-END-OF-OPTIONS`.
`--test-reporter=spec` and `--experimental-vm-modules` -> `CHILD-ARGV-FLAG-NOT-ALLOWED`
(the allow-list, not the deny-list, is what refuses them - the deny-list would not have).
`[file, '--test']` -> `CHILD-ARGV-FLAG-AFTER-FILE`.
Absolute path / `..` traversal / outside the five roots / absent under a root ->
`CHILD-ARGV-TARGET` x4.
**Positive control:** `['--test','--test-reporter=tap', <pinned child>]` passed `childArgv`
and reached the spawn, failing only later on the needle - so the allow-list admits exactly
the two flags the accepted originals use and nothing else.

### N4, N5 - CLOSED as against declaration and against a commit at HEAD

| my control | exit | fired |
|---|---|---|
| invented theme line, self-consistent sha256, absent from `DECISIONS.md` | 1 | `RECEIPT-EXACT-LINE-MISSING` |
| invented brief-acceptance line, same | 1 | `RECEIPT-EXACT-LINE-MISSING` |
| brief acceptance as a **bare integer** (the r2 shape) | 1 | `Authorization claim brief acceptance` |
| brief claim whose `lineSha256` does not hash its `line` | 1 | `LEDGER-LINE-SHA256 brief acceptance` |
| **C-COMMIT-2: forged theme + brief lines COMMITTED at HEAD** on a scratch branch and cited by the spec | **1** | `RECEIPT-EXACT-LINE-MISSING` |

C-COMMIT-2 is the control the brief asked for, and the runner passes it: the obligations are
bound at **the parent's receipt base** (`f6aa4a2`), not at HEAD, so a scratch commit at HEAD
buys nothing. `L.verifyReceipt` reads `rebuild/DECISIONS.md` out of Git at that base and
requires exactly one line hashing to `lineSha256`, byte-equal, under ` . <role> . `, with
the content mentions. Correct, and correctly anchored.

One cosmetic gap: `status: 'BRIEF-ACCEPTED'` with `acceptedLedgerLine: null` is **accepted**
(exit 2, same 5 obligations). The status field is only checked in the direction
line-implies-status, not status-implies-line. It clears nothing, so it is a label defect,
not a weakening. Worth one `assert` at the next touch.

### N1 - accounting CLOSED; "executes the original" is a TEXT test

| my control | exit | fired |
|---|---|---|
| move onto an **inherited** child | 1 | `COVERAGE-MOVE-CHILD-IS-AN-INHERITED-CHILD` |
| move onto a new child running an unrelated pinned file | 1 | `COVERAGE-MOVE-CHILD-DOES-NOT-EXECUTE-THE-ORIGINAL` |
| move reason 5 characters | 1 | `COVERAGE-MOVE-REASON-MISSING` |
| move declared as a bare string | 1 | `COVERAGE-MOVE-UNDECLARED` |
| **two moves (`migrate-full` + `merge-laws`) onto ONE child** | 1 | `COVERAGE-MOVE-CHILD-COVERS-MORE-GATES-THAN-run.cjs-GROUPS` |
| **all 10 free gates onto ONE child** | 1 | same |
| a gate both inherited and moved | 1 | `A gate is inherited-covered or moved, never both` |
| two moves (`conformance` + `selftest`) onto ONE child | **2** | **accepted, correctly** - `run.cjs` itself groups those two on `rebuild/conform/run.cjs`; `GATE_GROUP` is derived from `R.GATES`, not re-typed |

That bound is real and it is the right one. What is not verified is the word "executes".
`requiresOriginal()` reads the covering file's **bytes** and returns true if any relative
`require`/`import` **specifier** resolves to the gate's original. It does not check that the
specifier is reachable, let alone called.

### N3 - CLOSED for short-circuits; the execution evidence is a byte count or a string

| my control | exit | outcome |
|---|---|---|
| needle mid-line, not at line start | 1 | `CHILD-NEEDLE-NOT-A-TERMINAL-LINE` |
| wrapper printing 22 bytes, needle at line start, no gate terminal line | 1 | `CHILD-DID-NOT-REALLY-EXECUTE r3-wrapper; 22 byte(s) of stdout and no original gate terminal line` |
| **N3-07: wrapper printing 283 bytes of `z`, needle at line start, NO gate terminal line** | **2** | **accepted** - the >=200-byte floor alone is sufficient |
| **N3-05 (HEADLINE): wrapper whose `require` of the original is AFTER `process.exit(0)`, printing a fabricated `LEGACY migrate-full PASS \| ...` line padded past 200 bytes** | **2** | **accepted** |

N3-05 verbatim, from my run:

```
B PACKAGE B1 CHILD r3-wrapper OBSERVED; exit 0, 281 bytes of stdout, exact declared
  verdict at line start; ran rebuild/m4/workout/test/r3-wrapper.cjs
B PACKAGE B1 COVERAGE 10/19 original gate(s) covered by 6 executed child(ren)
  (9 inherited, the parent map byte-for-byte; 1 moved, each bound to its own original
  executable); 9 re-execute under --full
B PACKAGE B1 COVERAGE migrate-full <- child r3-wrapper executed in this run; exit 0 and
  exact declared verdict; MOVED, carries rebuild/engine/test/migrate-full.cjs - B1 re-homes
  the full migration gate onto its own successor carrier
```

`migrate-full.cjs` never ran. Two sentences on that output are false as written: *"each
bound to its own original executable"* and *"carries
rebuild/engine/test/migrate-full.cjs"*. Under `--full`, `gates()` skips every gate in
`covered`, so `migrate-full` would not re-execute either (read from the code; I could not
execute `gates()` on this machine, and by `DECISIONS:97` I should not).

Two further notes from the same control, both new:

- The wrapper lived in `rebuild/m4/workout/test/` - a `CHILD_ROOT` that is **not inside
  `fidelity()`'s change scan** (`rebuild/engine`, `rebuild/conform`, `rebuild/m4/spec`,
  the tooling dir). So it raised no `UNLISTED-SOURCE-CHANGE` and needed no exemption. r2's
  R8 is therefore narrower than stated for two of the five roots: there the exemption is
  not even reached.
- An **untracked** file beside the runner under `rebuild/lanes/b/tooling/` is invisible to
  `fidelity()` as well (`git diff sourceBase HEAD` sees commits only, and the tooling dir is
  not a `PIN_PATH`). My `b-package-debug.cjs` sat there through 40 bites unremarked. It is
  inert - `TOOLING_FILES` is a fixed list and the runner never enumerates its directory - so
  this is a note, not a finding.

## 6. New finding R3-B: the parent's review file is byte-unpinned, so the ledger anchor moves

`option()` verifies the parent **artifact** by `sha256` and re-reads it from Git at the
reviewed commit. It does **not** pin the parent's **review** file: the spec supplies
`parent.options[].review` as a free path, `option()` reads it with no root restriction and no
hash, and takes `review.receipt.commit` as `receiptBase` - the very base `authority()` then
uses for the theme and brief-acceptance lines. Nor is `receiptBase` required to be an
ancestor of anything (`envelope()` requires that of the package's **own** receipt; `option()`
requires it only of the *reviewed* commit).

**C-COMMIT-3** - executed, touching nothing under `rebuild/m4/spec`: commit forged theme and
brief lines on a scratch branch, write a review file **inside the tooling directory** whose
`receipt.commit` is that scratch commit and whose `receipt.line` is the genuine
`DECISIONS:96` NATIVE-CARRIERS receipt (present at my commit because it descends from HEAD),
and point `parent.options[0].review` at it. Result, verbatim:

```
B PACKAGE B1 AUTHORITY OBSERVED owner DECISIONS:60 and contract DECISIONS:49 present as
  exact ledger line bytes at 38c8ce0 under their own roles; contract inherited byte-equal
  from the parent; theme DECISIONS:101 found in Git at that base; brief acceptance
  DECISIONS:102 found in Git at that base
...
B PACKAGE B1 CI REVIEW-PENDING: 3 open obligation(s); public evidence only; no PASS is claimed
```

Two invented obligations cleared, 5 -> 3, and a verdict file that states forged lines were
"found in Git". **It cannot reach `POSTFIX PACKAGE PASS`**: `envelope()` re-verifies all four
cited lines at the package's *own* receipt commit and requires
`merge-base --is-ancestor <that commit> refs/remotes/origin/rebuild/t2-client-core`, which a
local scratch commit fails. But the PM has said they will **read verdict files rather than
re-run every gate**, and this makes a verdict file lie. It also removes the open-obligation
**count** as evidence - the same objection r2 raised at N4/N5, reconstituted one level up.

## 7. Hunt for a path to PASS or exit 0 without a genuine receipt - none found

- **One `catch`, and no branch of it reaches 0**: `process.exitCode = blocked ? 2 : 1`.
- **`POSTFIX PACKAGE PASS`** needs `last.authorized && !open.length`, and `authorized`
  needs, all together: the artifact byte-equal to `proposed()` (so the artifact is a pure
  function of the spec and the bytes on disk - it cannot carry a claim of its own); a review
  `ACCEPTED` with a receipt; a non-null theme **and** brief-acceptance line; `L.verifyReceipt`
  finding a real `cowork` line in Git at the receipt base mentioning packageId + artifact
  path + artifact hash; a verdict regex binding this package id, this artifact path and this
  exact hash; `L.object` reproducing the artifact bytes at the reviewed commit;
  `L.checkSources` over every product and execution pin in Git **and** on disk; and three
  ancestry assertions including `r.commit` on `origin/rebuild/t2-client-core`. Then the whole
  envelope is re-evaluated after the gates and `key` compared.
- **`PUBLIC CI EVIDENCE PASS` (exit 0)** needs zero blocking obligations and no receipt. It
  is qualified in its own sentence and the r2 honesty point is now addressed: the header
  scopes its claim to `POSTFIX PACKAGE PASS`. R3-B removes two obligations by declaration;
  the rest (parent named, product IMPLEMENTED, carrier authored, artifact sealed) cannot be
  faked at this tip. **No bite reached exit 0.**
- **`protectedSurfaces`** is now printed as *"declared by the spec and echoed here, asserted
  by nothing in this line"* - the r2 honesty point, correctly and plainly fixed.

## 8. Changes required (exact)

**X1 - BLOCKING FOR EVERY SEAL UNDER THIS RUNNER; no code change.**
`coverage.moves` must be `{}` in every B package sealed until X3 lands. This holds in all
four specs today (B1/B2 `PROPOSED`, B3/B4 `SKELETON`; 9 inherited, 5 children, no argv flags,
every target under `rebuild/m4/spec/`). With `moves` empty I verified by execution that the
coverage accounting is genuinely bound: `coverage.inherited` must equal the parent's
`byChild` **gate and child**, and each inherited child's argv target must be in the parent
artifact's `executionPins` or `product` - a wrapper cannot become an inherited child. **The
sealer must re-check this line at seal time, not trust it from here.**

**X2 - BEFORE THE FIRST RECEIPT; one line.** Close R3-B. Either add `reviewSha256` to the
parent option and assert it beside `sha256`, or - simpler and stronger - assert in
`option()` the same ancestry `envelope()` already demands of the package's own receipt:
`L.git(root, ['merge-base','--is-ancestor', r.commit, 'refs/remotes/origin/rebuild/t2-client-core'])`.
Either one makes the ledger anchor unmovable by a spec.

**X3 - BEFORE ANY PACKAGE DECLARES A MOVE.** Replace the text test with an output test taken
from the immutable original. `R.GATES[i][2][0]` already carries each gate's own expected
terminal string. Build `GATE_NEEDLE = new Map(R.GATES.map(g => [g[0], g[2][0]]))` and require
a moved child's stdout to carry the **moved gate's own needle at line start**, in addition to
the child's declared needle - and drop the bare `>=200 bytes` branch as sufficient evidence
on its own (keep it only for non-moving children). This is the change `TOOLING-REPORT.md`
r2.12(3) already names as "the stronger rule"; it does not need a spec-shape change, because
the gate id in `coverage.moves` already says which needle applies.

**X4 - HONESTY, text only, at the next touch.** Until X3 lands, the two sentences that
overstate must say what was verified. `SPEC OBSERVED ... each bound to its own original
executable` -> `... each naming its own original executable in a relative require specifier`;
`COVERAGE <gate> <- child <c> ... MOVED, carries <original>` -> `... MOVED, declared against
<original>`. Also add the one `assert` that `status === 'BRIEF-ACCEPTED'` implies a non-null
`brief.acceptedLedgerLine`.

## 9. Residual risks carried forward

1. **R1 (unchanged, correctly scoped by the fixer).** Pre-seal the runner and spec can be
   co-edited, and the Git-at-HEAD pin falls to anyone who can commit (C-COMMIT-1). No PASS is
   reachable pre-seal. **A sealed package must be reviewed by diffing these two files.**
2. **R3-A (new, this round).** The move/needle composite of section 5. Bounded by X1 today.
3. **R3-B (new, this round).** The unpinned parent review of section 6. Closed by X2.
4. **R4 (inherited from `run.cjs`, unchanged).** Two of the 18 `PIN_PATHS`
   (`rebuild/conform/goldens`, `rebuild/conform/manifest.json`) do not exist in this tree, so
   "18 PIN_PATHS byte-identical" is nominal. I re-measured: 16 live, 2 missing.
5. **R5 (unchanged, and it now bounds my own review).** The ACCEPTED branch of `envelope()`
   has still never executed. I could not exercise it either: the artifact path is derived as
   `rebuild/m4/spec/acceptance-<slug>.json` and my brief forbids writing there, so **every
   post-seal control in this round is by reading, not by execution.** I confirm the logic by
   inspection and I rely on r2's executed PS1/PS2/PS4 for the rest. The PM's first `--full`
   on a sealed B package remains an unrehearsed first execution of `L.checkSources` end to
   end; treat it as a rehearsal, and write the receipt after it, not before.
6. **R6 (unchanged).** `gates()` and `historical()` are unexecuted on any machine without the
   private fixture. The coverage accounting they consume does run on every `--ci`.
7. **`L.verifyBase` is not used** (section 2). Not a hole, but a divergence from the accepted
   original that a future reviewer should not rediscover as a finding.

## 10. Safe to seal?

**Yes - B-NTC, B1 and B2 may be sealed with this tooling**, provided X1 holds at seal time
(it holds today, in all four specs) and X2 lands before the first receipt. The chain that
produces `POSTFIX PACKAGE PASS` is anchored end to end on bytes and on a PM ledger line on
the real remote branch; 50 of my 54 spec-level bites refused, each at its intended check; the
4 that did not refuse reached neither exit 0 nor any PASS word; and across 61 executions
there were **0 bare PASS lines**.

What remains is not a forged PASS. It is a runner that, in one narrow configuration, would
*describe* gate coverage more strongly than it verified it - and a verdict file that, in one
other, would report ledger lines as "found in Git" when the base was chosen by the spec.
Both are visible to a reader of the sealed artifact; neither is invisible to a reader of the
runner's own output once it says what it means. X1 removes the first from reach today, X3
removes it permanently, X2 removes the second, X4 makes the output honest in the interim.

### Restoration, verified

```
git rev-parse HEAD                              572a8c2741e2eec17fbc086dee734aed012f49d0
HEAD is detached                                yes
git status --porcelain --untracked-files=all    (empty, before this file)
git status ... -- rebuild/m4 rebuild/conform rebuild/engine .github rebuild/m3 \
                  rebuild/DECISIONS.md rebuild/lanes                        (empty)
git branch --list 'r3-scratch*'                 (empty)
rebuild/m4/workout/test/r3-*                    (none)
rebuild/lanes/b/tooling/{*debug*,r3-*}          (none)
rebuild/conform/private/                        absent, and never created
```

All seven tooling files re-hash to their reviewed sha256. Both scratch branches were local
only and were never pushed. `ledger/` was never opened.
