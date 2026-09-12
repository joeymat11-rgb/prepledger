# LANE B — TOOLING REVIEW r5 (independent, blind)

head reviewed: **85f7d564d4af9b3cacce8dad0e8e7d5d096de68b** (head of `rebuild/lane-b-tooling`)
base of the delta: **7748880701ef62246c8362c43f760ee10f86c2cc** (lane B's r4 fix)
chain branch used for every ancestry assertion:
`refs/remotes/origin/rebuild/t2-client-core` = `b19137ae71fa7072eacc8b62f0a81443aa984ab0`
worktree: `work/lane-b/rv-tool5` (detached, read-only except this file);
scratch: `work/lane-b/rv-tool5-scratch` (two isolated Git fixtures `bite/` @85f7d56 and
`bite2/` @7748880, built with `git archive` + an `objects/info/alternates` pointer).

**Reviewer statement.** I wrote none of this. I did not read or touch the sibling
worktrees `work/lane-b/tooling` or `work/lane-b/ntc`. Every number below comes from a
command I ran on this machine between 16:20 and 17:40 ET on 2026-09-11, with
`MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York` set in each process. Astra's
three reports and Astra-side reviews are treated as hypotheses; the PM has confirmed
(DECISIONS:112 (2)) that Astra's ledger lines and the "B-NTC-SUCCESSORS" theme bind
nothing. I never sought, opened, hashed or quoted private data; `rebuild/conform/private`
does not exist in this tree and `--full` terminated on the BLOCKED line, as it must.

## VERDICT: REJECT (for the two successor commits) — **NOT SAFE TO SEAL**

The delta is two different pieces of work.

* **`c7b7133` — ACCEPT.** `childArgv()` really is the single executable-target definition;
  I reproduced its regression 9/9 and executed both of its load-bearing behaviours myself.
* **`7748880` (r4's Y1–Y4) — CONFIRMED LANDED AND EFFECTIVE.** All four, each with a
  positive and a negative control I ran.
* **`7cd7a5b` + `85f7d56` — REJECT.** The successor mechanism binds admission to an
  authority the PM has ruled VOID, cannot express the one authority that was GRANTED
  (`MOVES_RULING=DECISIONS:112` appears **0 times** in the whole tooling), and has
  regressed B-NTC's own runner terminal from `REVIEW-PENDING` / exit 2 to an opaque
  `FAIL` / exit 1. It must not seal, and B-NTC cannot seal under it.

Nothing here is safe to seal: the only package the successor code exists for (B-NTC)
cannot complete a `--ci` run at this head on any tree I could construct.

## 0. Findings, ranked

| # | Severity | Finding | Where | Proof |
|---|---|---|---|---|
| F1 | **BLOCKING** | Successor admission is gated on a theme ledger line citing `B-NTC-SUCCESSORS 614717800602…` — the theme DECISIONS:112 (2) declares "not on the chain and bind[s] nothing". The GRANTED id `MOVES_RULING=DECISIONS:112` occurs **0 times** in `b-package.cjs`, in `b-ntc-successors.json`, in either test and in all six specs. | `b-package.cjs:669-673`, `:86-90` | §D.i, §E/E23 |
| F2 | **BLOCKING** | B-NTC's own `--ci` terminal regressed: exit **2** / `CI REVIEW-PENDING: 5 open obligation(s)` at 7748880 → exit **1** / `FAIL; required evidence missing or failed; local diagnostics withheld` at 85f7d56. The refusing assertion is `SUCCESSOR-CHILD-DECLARATIONS`. The package the code was written for can no longer run its gate. | `b-package.cjs:1040`, `:653-668` | §D.iv |
| F3 | **BLOCKING** | Nothing verifies that a successor child compiles or executes the **parent gate's own original body** (:112's core condition, r2 §E.3 (b)/(c)). The only evidence is a sha256 over Astra-authored child files. No sha against the parent's `executionPins`, none against the Git blob at the parent acceptance commit `b95ccca`, no `requiresOriginal()` call, no enumerated text substitution. | `b-package.cjs:653-668`, `:703-715` | §D.ii |
| F4 | HIGH | The successor verdicts are **weakened prefixes** of the accepted schedule's. `acceptedOriginalChildren()` requires `NATIVE SOURCE CARRIERS: 6/6 PASS;`; the successor policy requires only `NATIVE SOURCE CARRIERS:`. A successor printing `0/6 FAIL` satisfies `SUCCESSOR-EXECUTED-VERDICT`. | `b-ntc-successors.json:64-70` vs `b-package.cjs:693-699` | §D.ii |
| F5 | HIGH | `policy.sourceCommit` (`71fb2f1a…`) carries **no ancestry check at all** — not against `CHAIN_REF`, not against `HEAD`. X2's own rule ("resolved from Git refs and never from the spec") was not applied to the new code path. Measured: `71fb2f1a` is an ancestor of neither. | `b-package.cjs:653-668` | §D.iii |
| F6 | MEDIUM | Every refusal collapses to one line and one exit code. Twelve structurally different tampers produced byte-identical terminals; the runner never names the assertion locally. | `b-package.cjs:1071-1076` | §F |
| F7 | MEDIUM | `execution-targets.test.cjs` asserts `packages/B-NTC.json`'s `children.length === 5`. That file declares **5** here and **15** on `origin/rebuild/lane-b-ntc`. Test defect (this is r2's R8 by construction). | `test/execution-targets.test.cjs:108-109` | §C |
| F8 | MEDIUM | `successor-authority.test.cjs` is not self-contained: it reads `B_NTC_SOURCE_ROOT` defaulting to the sibling worktree `../astra-b-ntc`, and `git archive`s `71fb2f1a`, a commit on `origin/rebuild/lane-b-ntc` only. | `test/successor-authority.test.cjs:117-124` | §C |
| F9 | MEDIUM | The runner pins its own bytes on disk **and** in Git at HEAD; the package spec's bytes are pinned on disk only. An uncommitted spec edit runs clean. | `b-package.cjs:577-585` | §E/E10 |
| F10 | LOW | `TOOLING-REPORT.md` is untouched by all three commits. It still describes an 820-line / 65 367-byte runner; the head is **1077 lines / 85 080 bytes**, and the report says nothing about `b-ntc-successors.json` or successor authority. | `TOOLING-REPORT.md:992,1430` | §A |
| F11 | LOW | Y2's single-parent code is **unreachable for five of six packages**: only B-NTC has `parent.decided`. B1/B2/B3/B4/B-LOM return from `parent()` before the scan. | `b-package.cjs:433-440` | §B/E18 |
| F12 | LOW | The runner does not blank its **own** `NODE_OPTIONS`; an injected `--require` executes inside the runner process (it does not reach the children — those are sanitised). | `b-package.cjs:732-736`, `:800` | §E/E22 |

## A. Scope of the delta — clean

```
$ git diff --name-status 7748880 85f7d56
M  rebuild/lanes/b/tooling/README.md
A  rebuild/lanes/b/tooling/TOOLING-FIX-ASTRA-REPORT.md
A  rebuild/lanes/b/tooling/TOOLING-POLICY-FIX-ASTRA-REPORT.txt
A  rebuild/lanes/b/tooling/TOOLING-SUCCESSORS-ASTRA-REPORT.txt
A  rebuild/lanes/b/tooling/b-ntc-successors.json
M  rebuild/lanes/b/tooling/b-package.cjs
M  rebuild/lanes/b/tooling/packages/{B-LOM,B-NTC,B1,B2,B3,B4}.json
A  rebuild/lanes/b/tooling/test/execution-targets.test.cjs
A  rebuild/lanes/b/tooling/test/successor-authority.test.cjs
14 files changed, 1242 insertions(+), 44 deletions(-)
```

Fourteen paths, **all** under `rebuild/lanes/b/tooling/`. Nothing under `rebuild/engine`,
`rebuild/conform`, `rebuild/m4/spec` or `.github`. Each of the six spec diffs is
`2 files changed, 2 insertions(+), 2 deletions(-)`-shaped — one line, the
`tooling.runnerSha256` — which I re-derived: disk and Git at HEAD both give
`ca0419e61beac8ffe9c89971e11fd1f3cfb0913af1d2d5d05ddbdf12c057f484`, and that is the value
all six specs carry. **No product or engine byte moved. Scope passes.**

`git status --porcelain` in `rv-tool5` at the start of this review: empty. At the end:
this file only.

The three Astra reports are new files inside the tooling directory and are listed in the
runner's own `TOOLING_FILES` exemption (`b-package.cjs:117`) — i.e. the delta widened the
fixed exemption list to cover its own reports. That is how W7 is supposed to work (fixed
in the runner, not nominated by a spec), and I checked that no other path was added.

**F10.** `TOOLING-REPORT.md` — the report of record — was not touched by any of the three
commits. Its §r3 byte table still reads `| b-package.cjs | 820 | 65367 | 6f69aa8e… |`
(line 992) and line 1430 repeats "820 lines / 65 367 bytes … at r4's review commit". The
head is 1077 lines / 85 080 bytes / `ca0419e6…`. The report contains no description of
`b-ntc-successors.json`, `successorSupport()`, or the successor authority rule.

## B. r4 → 7748880: Y1–Y4 re-measured, each with a positive and a negative control

All four landed. All four are effective. Controls were run in the scratch fixture
`bite/` (a `git archive` of 85f7d56 with a shared object store), never in `rv-tool5`.

### Y1 — required own children for a no-D package (`b-package.cjs:952-963`, `:873-890`)

The code is where r4 asked for it (option (b)): `NO_REGISTER_IDS`, `MIN_OWN_CHILDREN = 1`
and `PRODUCT_ROLES` are all fixed in the runner (`:82`, `:100`, `:106`), `ownChildren()`
reads the spec's own `product[...].role === 'new'` (`:225-227`), the reporting half is
`noRegister()` and the refusing half is in `envelope()` before the ACCEPTED branch, with a
second `ran`-map assert for the execution half.

*Negative (as shipped).* `--ci --package B-LOM` → exit **2**, 11 open obligations, including

```
B PACKAGE B-LOM NO-REGISTER OBLIGATION B-LOM registers no D-id, so the 45-law accounting
  imposes nothing on it; in its place 0 of 0 declared child(ren) executing one of this
  package's own role:"new" product file(s) ran in this process … 1 required at the seal
B PACKAGE B-LOM OPEN no-register package: 0 of the 1 required child(ren) executing this
  package's own new product file(s) ran (TOOLING-REVIEW-r4 Y1; the seal refuses while this stands)
```

*Positive (E16).* I added to the B-LOM spec copy one `role:"new"` product file
(`rebuild/m4/spec/r5-lom-own.cjs`) and one child executing it. Result: exit 2, **9** open
obligations — the Y1 line and "package children not authored" both gone.

*Negative, sharper (E17).* A declared child that runs a file the package does **not** own
(`native-carriers-source-carriers.cjs`): exit 2, **10** open — the child is accepted, the
Y1 obligation stays open. The rule really is about the package's own new code.

*Seal half.* `execution-targets.test.cjs` exercises the seal block itself, lifted verbatim
out of the runner source; on my run it passed, including
`assert.throws(() => seal(noOwn, new Map()), /SEALED-WITHOUT-EXECUTING-ITS-OWN-PRODUCT/)`
and `/OWN-CHILD-DID-NOT-EXECUTE/`. **Y1 confirmed.**

### Y2 — sealed-sibling parent check read from Git (`b-package.cjs:443-471`)

Both halves exist and both fire. **But** (F11) the whole block sits after
`if (!s.parent.decided || !s.parent.chosen) { … return }`, and in this tree **only B-NTC
has a decided parent**. My first attempt (E18) mutated a sibling of B1 and the run passed
clean — not because Y2 is broken, but because B1 never reaches it. Re-run against B-NTC:

| bite | what I changed | refusal (from a diagnostic copy of the runner in scratch) |
|---|---|---|
| E18b | `packages/B1.json` **on disk** made to claim B-NTC's parent | `SINGLE-PARENT-CHAIN: rebuild/m4/spec/acceptance-native-carriers.json already claimed by B1 (packages/B1.json on disk)` |
| E19b | the same rival **committed**, then the disk copy restored to clean | `SINGLE-PARENT-CHAIN: … already claimed by B1 (rebuild/lanes/b/tooling/packages/B1.json in Git at HEAD)` |
| E20b | a sealed `rebuild/m4/spec/acceptance-r5-rival.json` naming the same parent, committed and `CHAIN_REF` moved onto it | `SINGLE-PARENT-CHAIN-SEALED: … is already named as the parent by the sealed rebuild/m4/spec/acceptance-r5-rival.json on refs/remotes/origin/rebuild/t2-client-core` |

E19b is exactly r4's G14 (the uncommitted-edit escape) closed, and E20b is the durable
half r4 asked for, read out of Git on the real chain branch. All three exited 1.
Restoration verified: `HEAD=85f7d564…`, `chain=b19137ae…`,
`packages/B1.json sha=0c13ba6f843f073ef6cd5bacf6d16d8a055f2a94d4633cfc3eca7ee59d57a57b`
before and after. **Y2 confirmed — with the caveat that it is live for one package.**

### Y3 — spec notes (text)

`PARENT RE-PINNED … parent.options NATIVE-CARRIERS …` now appears in **B-NTC, B1, B2
only** — the three specs that actually carry that option. It is gone from B3, B4 and
B-LOM. `PRE-IMAGE RE-VERIFICATION …` is gone from B-LOM (whose `product` is empty) and the
remaining five are worded to their own content. The `TOOLING-REPORT.md` §r3 byte table
now says 820 and carries an explicit "Corrected in r4 (Y3) … this table said 812"
paragraph at line 1002. **Y3 confirmed** (superseded by F10 for the current head).

### Y4 — the PIN_PATHS count (`b-package.cjs:596-598`)

I re-derived the inventory from the immutable source rather than from the runner:
`rebuild/conform/v4/postfix/run.cjs`'s `const PIN_PATHS=[…]` holds **18** paths; **16**
exist in this tree; the two that do not are `rebuild/conform/goldens` and
`rebuild/conform/manifest.json`. Every run prints exactly:
`16 of 18 PIN_PATHS present in this tree and byte-identical Git vs disk; 2 not in this
tree and therefore vacuous (rebuild/conform/goldens rebuild/conform/manifest.json)`.
**Y4 confirmed, counts true.**

## C. `c7b7133` — `childArgv()` as the single executable-target definition

`childArgv()` (`b-package.cjs:184-206`) is called by `spec()`, `ownChildren()`,
`children()`, `proposed()`, `fidelity()` and `inheritedExecutable()` — I checked every
call site; there is no second place that decides what a child executes. Its new line is

```js
assert(testMode || targets.length === 1,
  'CHILD-ARGV-BARE-SCRIPT-ARGUMENTS ' + c.name + '; extra positional files are not executed by Node');
```

**The regression, measured on THIS tree:**

```
$ node --test rebuild/lanes/b/tooling/test/execution-targets.test.cjs
# tests 9   # pass 9   # fail 0   duration_ms 596.6364          exit 0
```

**9 of 9.** r2 measured 8/9 on the ntc tree. The difference is not the runner. Line 108-109
of the test reads the *package spec* and asserts

```js
assert.equal(Object.keys(inherited.coverage.inherited).length, 9);
assert.equal(inherited.children.length, 5);
```

Measured `children.length`: **5** in `rv-tool5` (this branch), **15** in
`git show origin/rebuild/lane-b-ntc:rebuild/lanes/b/tooling/packages/B-NTC.json`. So the
suite is green on the branch that owns the test and red on the branch that owns the
package — and 15 is the *correct* number there, since `b-ntc-successors.json` itself
declares 15 children. **F7: this is a test defect**, not a finding about the ntc tree. A
component regression for `childArgv` must not assert a cross-branch package's inventory;
the fixture should be constructed in the test (as every other case in that file is), or
the assertion should be `>= 1` / derived from the file it just read.

**My own executions of the two behaviours (scratch fixture, real CLI, real children):**

* **E24 — bare script + extra positional.** Child `second-gate` re-declared as
  `["rebuild/m4/spec/r5-a.cjs", "rebuild/m4/spec/r5-b.cjs"]`, where `r5-b.cjs` throws if it
  ever runs. Refusal: `CHILD-ARGV-BARE-SCRIPT-ARGUMENTS second-gate; extra positional
  files are not executed by Node`; exit 1; `r5-b.cjs` never executed.
* **E25 — a real two-file `--test` run.** Same child as
  `["--test","--test-reporter=tap","rebuild/m4/spec/r5-a.cjs","rebuild/m4/spec/r5-b.cjs"]`,
  each file printing its own marker. The runner spawned it and its log shows
  `"R5 FILE A RAN"=true  "R5 FILE B RAN"=true  # pass 2` — **both files really executed**
  and `result.targets` carried both. (The run then correctly refused at
  `INHERITED-ACCEPTED-ARGV-VERDICT`, because a retargeted child is no longer the parent's
  accepted schedule. That is the right refusal.)

**c7b7133 is sound.** It is the one commit of the three I would keep as written.

## D. `7cd7a5b` + `85f7d56` — the successor mechanism

### The six packages and `--full`, as they stand (all executed now, exit codes measured)

| command | terminal line | exit |
|---|---|---|
| `--ci --package B1` | `B PACKAGE B1 CI REVIEW-PENDING: 5 open obligation(s); public evidence only; no PASS is claimed` | **2** |
| `--ci --package B2` | `B PACKAGE B2 CI REVIEW-PENDING: 5 open obligation(s); …` | **2** |
| `--ci --package B3` | `B PACKAGE B3 CI REVIEW-PENDING: 9 open obligation(s); …` | **2** |
| `--ci --package B4` | `B PACKAGE B4 CI REVIEW-PENDING: 9 open obligation(s); …` | **2** |
| `--ci --package B-NTC` | `B PACKAGE B-NTC FAIL; required evidence missing or failed; local diagnostics withheld` (stderr) | **1** |
| `--ci --package B-LOM` | `B PACKAGE B-LOM CI REVIEW-PENDING: 11 open obligation(s); …` | **2** |
| `--full --package B1` | `B PACKAGE B1 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` (stderr) | **2** |
| `--ci --package B5` / `--ci --package B1 --extra` | `B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B-NTC|B-LOM|B1|B2|B3|B4` | **1** |
| `node --test test/execution-targets.test.cjs` | `# tests 9 # pass 9 # fail 0` | **0** |
| `node --test test/successor-authority.test.cjs` | `# tests 10 # pass 10 # fail 0` (57.4 s) | **0** |

B-NTC stops after nine stdout lines, the last being `AUTHORITY OBSERVED … theme NULL;
brief acceptance NULL`. No PASS word is printed anywhere, and `--full` reaches the private
gate and stops there with the required BLOCKED code — the private oracle is never opened.

### (i) Does it admit successors only under a recorded PM ruling, and does X1 hold?

**X1 holds; the ruling requirement does not.** `MOVES_RULING` is still
`const MOVES_RULING = null;` (`:86`) and `coverage.moves` is `{}` in all six specs; the
refusal fires in `spec()` (`:321`) and again at the seal (`:940`). I broke it three ways
(E4, E5, E6) — including quoting the **real** id `MOVES_RULING=DECISIONS:112` in the move
reason and in `notes` — and every one produced the identical refusal
`COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING …; coverage.moves must be {} under this runner
(TOOLING-REVIEW-r3 X1)`. A spec cannot authorise its own move. Good.

**But `coverage.inherited` is a second door and it is not behind `MOVES_RULING` at all.**
For B-NTC the nine inherited pairs are admitted by `successorSupport()` →
`successorAuthorization()`, which consults a *theme ledger line*, never a ruling id:

```js
function successorAuthorization(s, bound) {
  assert(s.authorizations.theme, 'SUCCESSOR-PM-AUTHORITY-UNISSUED');
  return childLedger(s, bound, s.authorizations.theme, 'successor theme',
    [s.packageId, 'B-NTC-SUCCESSORS ' + SUCCESSOR_POLICY_SHA]);   // b-package.cjs:669-673
}
```

This is r2's R5 (form vs substance) reproduced in code: `moves` stays `{}` while the nine
inherited gates are re-pointed at fifteen brand-new child files, and the authority that
lets them through is a string, not the ruling.

### (ii) Does it verify the successor compiles the PARENT's own original body? — **No. F3, F4**

DECISIONS:112 grants successor children "each executing the parent gate's **OWN original**
against the child's bytes (no original copied, none skipped)". r2 §E.3 (b)/(c) asks for
that to be proved by sha against the parent's `executionPins` **and** the Git blob at the
parent's acceptance commit `b95ccca`, with any text substitution enumerated verbatim.

What `validateSuccessorDefinition()` (`:653-668`) actually does:

* `SUCCESSOR-POLICY-BYTES` / `-GIT-BYTES` / `-DEFINITION` — the policy file's own sha256;
* `SUCCESSOR-PARENT-*` / `-ORIGIN` / `-DEFINITION` — the parent artifact's coordinates;
* `SUCCESSOR-COVERAGE-MAPPING` / `-CHILD-DECLARATIONS` / `-PRODUCT-CLOSURE` — `deepEqual`
  between the spec and the policy;
* `L.checkSources(root, p.sourceCommit, p.sourcePins)` and the same at `HEAD` — 82 byte
  pins, which do include both the parent originals (`native-carriers-*.cjs`) and the
  successor children (`b-ntc-*.cjs`).

Every one of those is an **identity** check. Not one of them is a **relation** between the
child and the original. There is no `requiresOriginal()` call on a successor child (the
function exists and is used only on the dead `moves` path, `:335-336`); no comparison of
any child's embedded original against `bound.acceptance.executionPins`; no read of the
blob at `b95ccca`; no enumeration of substitutions. The comment at `:644-647` asserts "a
different file that only prints its needle cannot satisfy these source checks" — true, but
only because the bytes differ. **The runner cannot tell a faithful successor from a
successor that silently drops an assertion; it can only tell "these bytes" from "other
bytes", and the bytes it trusts were authored by Astra**, whose authority DECISIONS:112
(2) voided. That is precisely the gap the ruling's "none skipped" clause was written to
close. I could not construct a "successor that skips one assertion" bite on this tree
because none of the fifteen successor files exists here (see below) — and that inability
*is* the finding: there is nothing in the runner such a bite could trip.

**F4, a concrete weakening I can show from the two files side by side.** The accepted
legacy schedule the runner builds for every *other* package (`acceptedOriginalChildren()`,
`:693-699`) requires full verdicts:

```
'source-carriers'      : 'NATIVE SOURCE CARRIERS: 6/6 PASS;'
'inherited-carriers'   : 'NATIVE INHERITED CARRIERS: 6/6 PASS;'
'defect-witnesses'     : 'NATIVE DEFECT WITNESSES: 10/10 complete comparisons PASS;'
'writers-differential' : 'NATIVE WRITERS DIFFERENTIAL: 3/3 Date/trap modes PASS;'
```

`b-ntc-successors.json` requires, for the same five inherited names, only the prefixes
`"NATIVE SOURCE CARRIERS:"`, `"NATIVE INHERITED CARRIERS:"`, `"NATIVE DEFECT WITNESSES:"`,
`"NATIVE WRITERS DIFFERENTIAL:"` (lines 64-99). `inheritedExecutable()` then asserts
`result.needle === exact.needle` — the *policy's* needle. A successor that prints
`NATIVE SOURCE CARRIERS: 0/6 PASS;` satisfies `SUCCESSOR-EXECUTED-VERDICT` and
`CHILD-NEEDLE-NOT-A-TERMINAL-LINE` alike. The successor route is held to a **weaker**
output test than the route it supersedes.

### (iii) Does it depend on the VOID Astra digests / the "B-NTC-SUCCESSORS" theme? — **Yes. F1, F5**

Measured on the shipped runner (E23, a straight count over the file):

```
occurrences of "DECISIONS:112"      in b-package.cjs : 0
occurrences of "B-NTC-SUCCESSORS"   in b-package.cjs : 1
const MOVES_RULING = null;
const SUCCESSOR_POLICY_SHA = '614717800602ce09f792b77a2ef04f191a9d156573b572b772aa1854afae17ee';
```

and across the whole tooling directory (runner, policy, both tests, all six specs, README,
TOOLING-REPORT, the three Astra reports): **`DECISIONS:112` appears nowhere.**
`614717800602…` is one of the digests the brief names as void. `b-ntc-successors.json`
itself is titled by it and `README.md`'s new section states the requirement in plain words:

> Recognition also requires a real theme citation containing
> `B-NTC-SUCCESSORS 614717800602ce09f792b77a2ef04f191a9d156573b572b772aa1854afae17ee`,
> verified at the permitted chain anchor. It remains unissued in this candidate.

So the mechanism's admission condition is a PM theme line naming a theme the PM has ruled
"not on the chain and bind[s] nothing", while the authority actually GRANTED —
`MOVES_RULING=DECISIONS:112`, which names `coverage.moves` and
`b-ntc-inherited-carriers.cjs` as the record of the move — is unrepresentable. **This is a
blocking authority defect**, and it is not cured by the mechanism being fail-closed: a
gate whose only key is a key that will never be cut is not a gate, it is a wall, and the
wall is in front of the one package the PM has just cleared to proceed.

Two supporting measurements:

* **F5.** `p.sourceCommit = 71fb2f1ae2bf48cc8f32ff3f9e905949e352914c` is used for
  `L.object()` and `L.checkSources()` with **no ancestry assertion of any kind**. Measured:
  `git merge-base --is-ancestor 71fb2f1a refs/remotes/origin/rebuild/t2-client-core` → exit
  **1**; `… 71fb2f1a HEAD` → exit **1**. It is reachable only from
  `origin/rebuild/lane-b-ntc` and eleven local `codex/astra-*` branches. X2's whole point
  was that a commit a *spec* names must be resolved against the real chain; the new path
  takes a commit a *policy file* names and checks nothing about where it sits. The bytes
  are still cross-checked at `HEAD`, so I could not turn this into a byte substitution —
  it is a provenance hole, not (yet) an evidence hole.
* The theme line cannot be forged locally. **E14**: I wrote a well-formed theme claim into
  the B-NTC spec citing exactly `B-NTC-SUCCESSORS 614717800602…` and ending
  ` · ACCEPTED`, with a correct `lineSha256`. Refusal: `RECEIPT-EXACT-LINE-MISSING`,
  exit 1. `childLedger()`'s three `merge-base --is-ancestor` calls plus
  `L.verifyReceipt` hold. The authority *plumbing* is sound; the authority *name* is void.

### (iv) Does it change the exit-code / terminal-wording contract? — **Yes, for B-NTC. F2**

The generic contract is intact: exit 2 for `REVIEW-PENDING` without PASS, exit 0 only for
an AUTHORIZED PASS (unreachable — no artifact is sealed), the BLOCKED line for `--full`
without the private preparation (exit 2), exit 1 for usage. I verified each above, and the
`PUBLIC CI EVIDENCE PASS` sentence still carries its own two negations.

What changed is **which branch B-NTC lands on**. `successorSupport()` is called
unconditionally for `ID === 'B-NTC'` in the main sequence (`:1040`), before the campaign,
and again from `coverage()`, `proposed()` and `envelope()`. It is an `assert`, not a
`note()`, so it leaves the run through the `catch` at `:1071`:

```
             at 7748880 (r4 fix)                        at 85f7d56 (this head)
  B-NTC  →   CI REVIEW-PENDING: 5 open obligation(s)    FAIL; required evidence missing or
             exit 2                                     failed; local diagnostics withheld
                                                        exit 1
```

Both measured, by building a second isolated fixture `bite2/` at 7748880 and running the
same command. At this head the refusing assertion is `SUCCESSOR-CHILD-DECLARATIONS`: the
spec declares 5 children, the policy declares 15, and `assert.deepEqual(s.children,
p.children)` cannot be satisfied on this branch. On `origin/rebuild/lane-b-ntc` the spec
declares 15 and that assert would pass — and the run would then stop one line later at
`SUCCESSOR-PM-AUTHORITY-UNISSUED`, because `authorizations.theme` is `null` there too
(measured: `git show origin/rebuild/lane-b-ntc:…/packages/B-NTC.json` → `children=15
inherited=9 moves=0 theme=null`).

**So B-NTC exits 1 on both branches, for two different reasons, and there is no tree on
which it can currently complete a `--ci` run.** An `OPEN` obligation is the runner's
designed way to say "not yet"; turning "the PM has not issued a theme naming a void theme"
into a hard `FAIL` converts a pending authorization into an indistinguishable crash. That
is the regression, and it is the reason B-NTC cannot be sealed under this head.

I also confirmed the `B-NTC` refusal is not a fixture artefact: `bite/` reproduces
`rv-tool5` byte-for-byte (same nine stdout lines, same terminal, exit 1), and
`git status --porcelain` in `bite/` shows only my own untracked diagnostic copy.

## E. Fail-closed bites — twenty-one, all in scratch copies

Method. Two isolated Git fixtures in `rv-tool5-scratch` (`bite/` @85f7d56, `bite2/`
@7748880), each `git init` + `objects/info/alternates` → the real object store +
`git archive` + `read-tree`, with `refs/remotes/origin/rebuild/t2-client-core` set to the
real chain head. Nothing in `rv-tool5` was ever written. Because the shipped runner
withholds diagnostics (§F), I also placed a **diagnostic copy** beside it in the fixture —
byte-identical except for one extra `console.error` in the final `catch` — which prints
`R5-DIAG <assertion>`. It reads the *original* runner for its own byte pin, so it does not
change any check. Both copies were run for the baseline and agreed on terminal and exit.

Every row: command was `node …/b-package.cjs --ci --package <pkg>` in the fixture; the
terminal was `B PACKAGE <pkg> FAIL; required evidence missing or failed; local diagnostics
withheld` and exit **1** unless stated; sha256 before/after is recorded for every file
touched and all matched.

| # | tamper | expected | observed refusal | exit | restored |
|---|---|---|---|---|---|
| E1 | forged child that only prints the needle (+300 bytes) replaces B1's `source-carriers` | refuse | `INHERITED-ACCEPTED-ARGV-VERDICT` | 1 | ✔ `B1.json 0c13ba6f…`, forge deleted |
| E3 | the parent original **copied** to a new path under an allowed root, child repointed | refuse | `INHERITED-ACCEPTED-ARGV-VERDICT` | 1 | ✔ |
| E4 | `coverage.moves` non-empty, no ruling anywhere | refuse | `COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING selftest; coverage.moves must be {} under this runner (TOOLING-REVIEW-r3 X1)` | 1 | ✔ |
| E5 | same + **fabricated** `MOVES_RULING=DECISIONS:999` in the reason and in `notes` | refuse | identical to E4 | 1 | ✔ |
| E6 | same + the **real** id `MOVES_RULING=DECISIONS:112`, on gate `conformance` whose carrier does not read `engine-runtime.cjs` | refuse | identical to E4 — the runner never reads the id | 1 | ✔ |
| E7 | inherited child executed, declared verdict altered to `0/6` | refuse | `CHILD-NEEDLE-NOT-A-TERMINAL-LINE source-carriers` | 1 | ✔ |
| E7b | inherited **original executable** rewritten to print the needle and nothing else | refuse | `PARENT-PIN-BROKEN rebuild/m4/spec/native-carriers-source-carriers.cjs` | 1 | ✔ `83254f0a…` |
| E9 | runner bytes edited on disk | refuse | `RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER` | 1 | ✔ `ca0419e6…` |
| **E10** | **package spec edited on disk after review** | refuse | **none — `CI REVIEW-PENDING: 5 open obligation(s)`, exit 2** | 2 | ✔ |
| E11 | `--eval=` in a child argv | refuse | `CHILD-ARGV-INLINE-CODE second-gate --eval=…` | 1 | ✔ |
| E12 | child declared under an unlisted root (`rebuild/engine/plan.cjs`) | refuse | `CHILD-ARGV-TARGET second-gate rebuild/engine/plan.cjs` | 1 | ✔ |
| E13 | one byte appended to `b-ntc-successors.json` | refuse | `SUCCESSOR-POLICY-BYTES` | 1 | ✔ `614717800602…` |
| E14 | fabricated theme claim citing the exact policy digest | refuse | `RECEIPT-EXACT-LINE-MISSING` | 1 | ✔ `cdb2e8af…` |
| E15 | B-NTC renames its own `lanePackage` to dodge the successor obligation | refuse | `SUCCESSOR-WRONG-PACKAGE` (reported by `assert.equal`) | 1 | ✔ |
| E16 | Y1 **positive**: B-LOM given one own `role:"new"` child | pass, obligation cleared | 11 → **9** open, Y1 line gone | 2 | ✔ |
| E17 | Y1 **negative**: B-LOM given a child running a file it does not own | obligation stays | **10** open, Y1 line present | 2 | ✔ |
| E18b | sibling spec **on disk** claims B-NTC's decided parent | refuse | `SINGLE-PARENT-CHAIN: … claimed by B1 (packages/B1.json on disk)` | 1 | ✔ |
| E19b | the rival exists **only in Git at HEAD** | refuse | `SINGLE-PARENT-CHAIN: … (rebuild/lanes/b/tooling/packages/B1.json in Git at HEAD)` | 1 | ✔ HEAD `85f7d564…` |
| E20b | a **sealed** rival artifact on the chain branch names the same parent | refuse | `SINGLE-PARENT-CHAIN-SEALED: … acceptance-r5-rival.json on refs/remotes/origin/rebuild/t2-client-core` | 1 | ✔ chain `b19137ae…` |
| E21c | **X2**: chain ref moved to `12cfdb9d…` so the parent receipt base `b045e612…` is no longer an ancestor | refuse | `Command failed: git merge-base --is-ancestor b045e612… refs/remotes/origin/rebuild/t2-client-core` (B-NTC **and** B1) | 1 | ✔ chain `b19137ae…` |
| E22 | `NODE_OPTIONS=--require=<file>` set on the runner's own process | children unaffected | injected line present in **no** declared child log; run completed `REVIEW-PENDING` | 2 | ✔ |
| E24 | bare-script child + extra positional (second file throws if run) | refuse | `CHILD-ARGV-BARE-SCRIPT-ARGUMENTS second-gate; extra positional files are not executed by Node` | 1 | ✔ |
| E25 | real `--test` two-file child | both execute | child log: `R5 FILE A RAN`=true, `R5 FILE B RAN`=true, `# pass 2`; then `INHERITED-ACCEPTED-ARGV-VERDICT` | 1 | ✔ |

### The three bites I could not run, and why

* **"a successor that skips one assertion."** None of the fifteen successor files
  (`rebuild/m4/spec/b-ntc-*.cjs`, `rebuild/m4/workout/native-trend-context.cjs`) exists in
  this tree, on disk or in Git at HEAD — I checked each. More to the point, there is no
  check such a bite could trip: see F3. The runner compares bytes, so *any* edit to a
  successor child refuses with `WORKTREE-SOURCE-PIN`, and *no* edit is distinguished from
  any other. A skipped assertion and a corrected typo are the same event to this runner.
* **"a successor whose parent original is a copy rather than the parent's blob."** Same
  reason. E3 is the closest I could get, on the generic (non-B-NTC) route, where it
  refuses correctly.
* **"a spec citing DECISIONS:112 for a gate whose parent carrier does not read
  `engine-runtime.cjs`."** Run as E6 and it refuses — but not for the reason the bite was
  designed to test. The runner has no representation of the ruling, of the nine carriers,
  or of "reads `engine-runtime.cjs`". It refuses because `moves` is non-empty at all. The
  ruling's own scoping condition is unenforced because the ruling is unimplemented.

**E10 in full, since it is the one bite that did not refuse.** I appended a line to
`packages/B1.json`'s `notes` on disk without committing. The run completed normally,
`REVIEW-PENDING`, 5 open, exit 2. `fidelity()` pins the runner **twice** — `diskSha(RUNNER)`
and `gitSha('HEAD', RUNNER)` (`:583-584`) — and pins the spec **once**, on disk
(`sha(specRaw)`), with the Git comparison reached only via `sealed.spec.sha256` inside an
ACCEPTED envelope. Pre-seal (which is every package today) an uncommitted spec edit is
invisible: it can add or remove children, change `coverage.inherited`, change `dIds`, and
the run will report the edited facts as observed. r4's residual R1 named the co-edit
problem for the *runner*; this is the same problem for the *spec*, and it is one line to
close (`assert.equal(gitSha('HEAD', SPEC_PATH), sha(specRaw), …)`).

## F. The opaque terminal (r2 "what the PM must rule", item 7)

**Measured: the runner never prints the refusing assertion, anywhere, in any mode.** The
whole failure path is three lines (`b-package.cjs:1071-1076`):

```js
} catch (error) {
  const blocked = BLOCKED.includes(error && error.code);
  console.error(blocked ? 'B PACKAGE ' + ID + ' BLOCKED ' + error.code
                        : 'B PACKAGE ' + ID + ' FAIL; required evidence missing or failed; local diagnostics withheld');
  process.exitCode = blocked ? 2 : 1;
}
```

There is no log file, no `--verbose`, no `logDir` dump of the error: `logDir` holds child
stdout only. Seventeen of my twenty-one bites — a forged child, an `--eval` bypass, an
edited runner, a broken chain ref, a fabricated authorization, a byte in the policy file,
an unlisted root — produced **the same single line and the same exit code 1**. The only
information a reader gets is "something, somewhere". That made the shipped runner unusable
for this review; I had to author a diagnostic copy to learn anything, which is exactly the
capability a reviewer should not have to invent.

**What an `--explain` mode should print.** The refusing assertion's own message — the
identifiers this codebase already types carefully (`INHERITED-ACCEPTED-ARGV-VERDICT`,
`SINGLE-PARENT-CHAIN-SEALED`, `SUCCESSOR-POLICY-BYTES`, `PARENT-PIN-BROKEN <path>`) — plus
the stage it fired in, plus the public coordinates it already prints on the happy path:
file paths under `rebuild/`, sha256 of public bytes, commit SHAs, gate ids, child names,
declared needles, counts of open obligations. All of that is already on stdout for a
passing run; withholding it on the failing run protects nothing.

**What it must never print**, and what today's blanket silence is presumably guarding:
anything derived from `rebuild/conform/private/live.json` or the private `live.main`
golden — no private census row, count, id, date, value, hash or prose; no private file
path beyond the existence check `privateOracle()` already makes; and no stdout or stderr
of any child that could carry them. The safe rule is a whitelist, not a blackout: an
`--explain` that prints the assertion message and nothing captured from a child process
satisfies both. Note that `privateOracle()` already models this correctly — it throws a
**typed** code (`REQUIRED-PRIVATE-PREPARATION-MISSING`) which the same catch is willing to
name, and the sky does not fall. Every other refusal deserves the same treatment: give the
assertions codes and print the code.

**My recommendation to the PM on r2's item 7:** rule that the runner must name its
refusing assertion identifier on stderr (a fixed vocabulary, no interpolated child output),
keeping exit 1, and keep the current blanket line only for an error with no identifier.

## G. Astra's reports — reproduced, and not

**Reproduced exactly.**

| Astra claim | my measurement |
|---|---|
| `execution-targets.test.cjs` → 9 pass / 0 fail | 9 / 9, exit 0 |
| `successor-authority.test.cjs` → 10 pass / 0 fail | 10 / 10, exit 0, 57.4 s |
| "`moves={}` / `MOVES_RULING=null` remain" | true in all six specs and at `b-package.cjs:86` |
| "Six specs change ONLY `runnerSha256`, mechanically to `ca0419e6…`" | true; the six spec diffs are one line each and the value matches disk and Git |
| "Policy `614717800602…` and all 82 source pins are byte-unchanged" | policy sha matches; `sourcePins` has 82 entries |
| "A needle-only replacement can exit 0 but fails source-policy verification" | true — and it is the *byte* pin that fails, not a behavioural check (F3) |
| "No PM policy authority is issued by this candidate" / "It remains unissued" | true, and stated plainly in `README.md` |

**Not reproduced / not disclosed.**

1. **The B-NTC terminal regression (F2) appears in no Astra report.** All three "EXECUTED
   DELTA" sections run only the two component test files. None of them runs
   `b-package.cjs --ci --package <id>` on any package. A candidate that changes the gate
   for six packages and never executes the gate has not been tested against its own
   contract; had it been run once, exit 1 on B-NTC would have been unmissable.
2. `TOOLING-SUCCESSORS-ASTRA-REPORT.txt` states the mechanism's requirement in its own
   words — *"Existing theme authority must name the exact B-NTC-SUCCESSORS policy digest
   before the successor campaign starts and again at coverage/seal"* — and treats that as a
   pending step. Under DECISIONS:112 (2) it is not pending; it is void. I could not
   reproduce any reading under which this design is compatible with the granted ruling.
3. `TOOLING-SUCCESSORS-ASTRA-REPORT.txt` reports `successor-authority.test.cjs` at **8**
   pass (at 7cd7a5b) and `TOOLING-POLICY-FIX-ASTRA-REPORT.txt` at **10** (at 85f7d56). I
   measured 10 at the head; I did not re-measure the intermediate commit.
4. Neither report mentions that `successor-authority.test.cjs` reaches outside the
   repository (`B_NTC_SOURCE_ROOT`, default `../astra-b-ntc`) — the README does, to its
   credit — or that its fixture `git archive`s `71fb2f1a`, a commit on
   `origin/rebuild/lane-b-ntc` and eleven local `codex/astra-*` branches only. On this
   machine both happened to work (the sibling worktree is absent, so no dependency link was
   made, and the children ran anyway). **I did not verify this suite on a clean clone**,
   and I would expect it to fail at module load on one that fetched only the tooling branch.
5. Astra's reports are author-side documents by a continuation the PM has ruled out of
   authority. I treated every line as a hypothesis and took none of them as evidence.

## The exact changes

**Z1 — BLOCKING. Bind the successor path to `MOVES_RULING=DECISIONS:112` and delete the
`B-NTC-SUCCESSORS` digest condition.** `b-package.cjs:86` and `:669-673`.
Set `const MOVES_RULING = 'DECISIONS:112';` and make it the *only* thing that admits a
successor: replace the `'B-NTC-SUCCESSORS ' + SUCCESSOR_POLICY_SHA` mention with the
ruling id, and record it where the ruling says to record it — `coverage.moves`, per
":112 … lane B authors `b-ntc-inherited-carriers.cjs` and `coverage.moves` records this
id". That means X1's blanket `moves === {}` becomes `moves` admitted **only** for the nine
gates whose parent carrier reads `engine-runtime.cjs`, each with `reason` naming
`MOVES_RULING=DECISIONS:112`, and refused everywhere else — which is what X1 was a
placeholder for. *Proof assertion:* a B-NTC spec with the nine successor moves and the
ruling id reaches `CI REVIEW-PENDING` (not `FAIL`); the same spec with any other id, with
a tenth gate, or with a gate whose carrier does not read `engine-runtime.cjs`, refuses with
a named code. **Until Z1 lands, `614717800602…` must not appear in the runner at all.**

**Z2 — BLOCKING. Prove the successor executes the parent gate's OWN original.**
`b-package.cjs:653-668`, new assertions in `validateSuccessorDefinition()`.
For each of the nine inherited gates: read the successor child's bytes, resolve its
relative require/import specifiers (`requiresOriginal()` already does this, `:210-220`) and
require that it reaches the parent's original executable for that gate; then assert that
original's sha256 equals `bound.acceptance.executionPins[original]` **and** equals
`sha(L.object(root, 'b95ccca879e371b5ba225ad12cae612ec89469ba', original))`. Any text
substitution the successor performs on the original body must be enumerated verbatim in
`b-ntc-successors.json` and re-applied by the runner before the comparison. *Proof
assertion:* a successor child whose body is a copy of the original rather than a load of
it refuses; a successor that drops one of the original's assertions refuses.

**Z3 — BLOCKING. Restore the full accepted verdicts for the inherited five.**
`b-ntc-successors.json:64-99`. Replace the prefix needles with the exact strings
`acceptedOriginalChildren()` uses (`b-package.cjs:693-699`): `NATIVE SOURCE CARRIERS: 6/6
PASS;`, `NATIVE INHERITED CARRIERS: 6/6 PASS;`, `NATIVE DEFECT WITNESSES: 10/10 complete
comparisons PASS;`, `NATIVE WRITERS DIFFERENTIAL: 3/3 Date/trap modes PASS;`. *Proof
assertion:* a successor printing `0/6` refuses at `SUCCESSOR-EXECUTED-VERDICT`.

**Z4 — BLOCKING. B-NTC must not `FAIL` for an unissued authorization.**
`b-package.cjs:1040`, `:834`, `:893`. `successorSupport()` must `note()` (an `--ci`-blocking
OPEN obligation) when the authority is simply not yet issued, and `assert` only when
something is *wrong* — changed policy bytes, a mismatched declaration, a forged citation.
*Proof assertion:* `--ci --package B-NTC` with `theme: null` prints
`OPEN successor authority not issued` and exits **2**, matching every other package;
`--ci --package B-NTC` with a tampered policy file still exits 1.

**Z5 — HIGH. Anchor `policy.sourceCommit` on the chain, as X2 requires of every other
commit a file names.** `b-package.cjs:653-668`. Add
`L.git(root, ['merge-base','--is-ancestor', p.sourceCommit, CHAIN_REF])` and the same
against `HEAD`, or drop `sourceCommit` entirely and verify the pins at `HEAD` only.
*Proof assertion:* the current value `71fb2f1a…` refuses today (measured: it is an ancestor
of neither), which is the honest answer — it is an Astra lane commit, not chain history.

**Z6 — HIGH. Give the refusals a public vocabulary and print it.** `b-package.cjs:1071-1076`.
Attach a `code` to each named assertion and let the catch print it (`B PACKAGE <ID> FAIL
<CODE>`), or add `--explain` per §F. Never interpolate child stdout/stderr; never touch
`rebuild/conform/private`. *Proof assertion:* the twenty-one bites in §E produce
twenty-one distinguishable stderr lines, and the private-oracle path still prints only
`BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING`.

**Z7 — MEDIUM. Pin the spec in Git at HEAD as the runner is pinned.**
`b-package.cjs:583-584`, one line beside the runner pins:
`assert.equal(gitSha('HEAD', TOOLING + '/packages/' + ID + '.json'), sha(specRaw),
'SPEC-BYTES-NOT-THE-REVIEWED-SPEC-IN-GIT');`
*Proof assertion:* my E10 (an uncommitted `notes` append) refuses instead of exiting 2.

**Z8 — MEDIUM. Decouple `execution-targets.test.cjs` from `packages/B-NTC.json`.**
`test/execution-targets.test.cjs:108-109`. Build the inherited-map fixture in the test the
way every other case in that file is built, or derive the expected counts from the file
just read rather than asserting 9 and 5. *Proof assertion:* the suite is 9/9 on
`rebuild/lane-b-tooling` **and** on `rebuild/lane-b-ntc` (measured: `children.length` is 5
and 15 respectively).

**Z9 — MEDIUM. Make `successor-authority.test.cjs` self-contained.**
`test/successor-authority.test.cjs:117-124`. Remove the `../astra-b-ntc` default, and skip
(not fail) when `policy.sourceCommit` is unreachable, naming the commit. *Proof assertion:*
the suite runs to a deterministic result on a fresh single-branch clone.

**Z10 — LOW. Bring `TOOLING-REPORT.md` up to the head.** It describes an 820-line runner;
the head is 1077 lines / 85 080 bytes / `ca0419e61bea…`, with a 491-line policy file and
two suites the report never mentions.

**Z11 — LOW. Say that Y2 is currently live for one package.** `b-package.cjs:433-440`.
Either hoist the sibling/sealed scan above the `decided` early return (it is meaningful
for a provisional parent too), or have the UNDECIDED branch `note()` that the
single-parent scan did not run. *Proof assertion:* my E18 — a rival sibling claiming B1's
parent — currently passes clean, and it should at least be said out loud.

## What the PM must rule (only what DECISIONS:112 does not already settle)

1. **Does `MOVES_RULING=DECISIONS:112` govern `coverage.inherited` as well as
   `coverage.moves`?** :112 says "`coverage.moves` records this id", which reads as: the
   nine successor children are *moves*, and the inherited map should shrink to the gates
   still carried by the parent's own originals. The runner as built does the opposite —
   `moves` stays `{}` and the nine stay in `inherited` under a separate authority. Z1
   assumes the ruling's plain reading. One line confirming it would close the question.
2. **Is `b-ntc-inherited-carriers.cjs` — the file :112 names lane B as the author of — the
   same thing as `b-ntc-successors.json`'s `inherited-carriers` child
   (`rebuild/m4/spec/b-ntc-inherited-carriers.cjs`)?** The ruling names a lane-authored
   carrier; the policy names an Astra-authored child at that path, pinned to
   `f5f8c275…` at a commit that is not on the chain. If they are the same artifact, lane B
   must re-author or re-adopt it in its own name; if not, the runner is pinning the wrong
   file. Either way Z2's "executes the parent's own original" check is what settles it.
3. **The opaque terminal (r2 item 7).** §F recommends: name the refusing assertion from a
   fixed vocabulary on stderr, keep exit 1, never print child output or anything derived
   from the private census. A ruling here is needed because the current silence is a
   deliberate design choice, not an oversight.
4. **Astra's `sourceCommit` `71fb2f1a…`.** It is on `origin/rebuild/lane-b-ntc` only. If
   any byte of B-NTC's successor evidence is to be pinned at a commit, the PM should say
   which branch counts as evidence-bearing for a package that has not merged, since the
   runner's own constant `CHAIN_REF` currently answers "none".

Nothing else requires a ruling. Y1, Y2, X1 and X2 are standing rules already
(DECISIONS:108 (d), :110 (1)) and the runner honours them.

## Residual risks

1. **Pre-seal co-editing (r4 R1, unchanged and now wider).** The runner is pinned on disk
   and in Git at HEAD; the spec is pinned on disk only (F9/Z7); the six specs' sole
   dependency on the runner is a sha they carry, so a hand that can commit can move both
   in one commit. No PASS is reachable pre-seal, so this is a review risk, not an
   acceptance risk — but a sealed B package must still be reviewed by *diffing* the
   runner, not by reading its output.
2. **Everything the successor route asserts is identity, not behaviour (F3).** Even with
   Z3 and Z5, until Z2 lands the PM is trusting 82 sha256 values authored under a voided
   authority. The fix is cheap and mechanical; the risk of shipping without it is that
   "executes the parent gate's own original" remains a sentence in a report rather than a
   check in a runner.
3. **B-NTC has never completed a run of its own gate.** Not on this branch (F2), not on
   `rebuild/lane-b-ntc` (theme null there too). No one — Astra, r2, or me — has seen this
   package reach a terminal line other than `FAIL`. Whatever the successor design becomes,
   the first acceptance criterion should be a complete `--ci` run, quoted.

4. **The 45-law campaign is not this review's object but it is not silent.** Every package
   prints `AUDIT RED-FIRST FAIL` inside its `LAWS` line (e.g. B-LOM:
   `TOTAL 45 laws × 45 RED-frozen × 39 RED-candidate × 89 GREEN repair controls × 97/104
   mutant executions DETECTED × 0 HARNESS_ERROR × AUDIT RED-FIRST FAIL`). The runner treats
   that as a declared-state report, not an obligation, for packages with D-ids. I did not
   investigate it and I make no claim about it; I record it so it is not mistaken for
   something r5 cleared.
5. **`NODE_OPTIONS` in the runner's own process (F12).** Children are sanitised
   (`NODE_OPTIONS: ''` in both `laws()`'s env and, through it, `children()`), and my E22
   injection reached no child log. The runner process itself is not sanitised. Anyone who
   can set it can also edit files, so this is a note, not a finding.

## Boundaries honoured

* I worked only in `work/lane-b/rv-tool5` (read-only; detached at 85f7d56) and my own
  scratch `work/lane-b/rv-tool5-scratch`. I never read, listed or executed anything under
  `work/lane-b/tooling` or `work/lane-b/ntc`.
* Every mutation was applied to a file inside a scratch fixture, never to `rv-tool5`.
  `git status --porcelain` in `rv-tool5` was empty before I started and now lists exactly
  one path: `rebuild/lanes/b/reviews/TOOLING-REVIEW-r5.md`. `git rev-parse HEAD` is
  unchanged at `85f7d564d4af9b3cacce8dad0e8e7d5d096de68b`.
* No commit, no push, no new worktree, no branch, no ref written in `rv-tool5`. The two
  fixture repositories are independent `git init` directories that borrow the object store
  read-only through `objects/info/alternates`; all ref moves I made were inside them and
  every one was restored and re-read (`chain=b19137ae71fa7072eacc8b62f0a81443aa984ab0`,
  `HEAD=85f7d564…` / `7748880701…`).
* `rebuild/conform/private` does not exist in this tree. I never looked for it beyond the
  existence check the runner itself makes, never opened, hashed, counted or quoted any
  private value, and `--full` terminated exactly where it must:
  `B PACKAGE B1 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING`, exit 2.
* No secrets, tokens, credentials or private census content appear anywhere in this file.
* `node` v24.18.0 was invoked directly; no `npm`, no `npx`, no install, no lockfile change,
  no dependency added. The only new files anywhere are in my scratch directory.

## Provenance

* `7748880` "lane B: tooling fix r4 — Y1 … Y2 … Y3/Y4" — lane B's fixer, answering r4.
  Re-measured here and **confirmed**; it is the base of the delta, not part of it.
* `c7b7133` "fix: account only for actually executed Node child targets" — **Astra**.
* `7cd7a5b` "Bind B-NTC successors to exact source policy and accepted-chain authority" —
  **Astra**.
* `85f7d56` "Require B-NTC policy and bind inherited gates to exact accepted schedules" —
  **Astra**.

All three Astra commits were authored by a GPT continuation operating without a legitimate
judge. Per **DECISIONS:112 (2)**, every ledger/acceptance line Astra wrote as a "temporary
sole PM", the BRIEF-B-NTC amendment `5fc945df…` and the "B-NTC-SUCCESSORS" theme are **not
on the chain and bind nothing**; Astra's code is adopted only as speculative builder
candidates with Astra as author, and Astra-side reviews do **not** count as the independent
review. I have treated `TOOLING-FIX-ASTRA-REPORT.md`,
`TOOLING-POLICY-FIX-ASTRA-REPORT.txt` and `TOOLING-SUCCESSORS-ASTRA-REPORT.txt` as
hypotheses throughout and re-measured every number I use (§G).

The only authority id in force for this work is **`MOVES_RULING=DECISIONS:112`**, which I
read in full from `git show origin/rebuild/t2-client-core:rebuild/DECISIONS.md` (line 112
of 112, 3852 characters). It grants M2-B-NTC successor children for the nine inherited
gates whose parent carrier reads `engine-runtime.cjs`, each executing the parent gate's own
original against the child's bytes, with lane B authoring `b-ntc-inherited-carriers.cjs`
and `coverage.moves` recording the id. **The runner under review contains that id zero
times and the void theme name once.** That single fact is why this review is a REJECT.

---

*r5, independent and blind. Head `85f7d564d4af9b3cacce8dad0e8e7d5d096de68b`;
base `7748880701ef62246c8362c43f760ee10f86c2cc`;
chain `refs/remotes/origin/rebuild/t2-client-core` = `b19137ae71fa7072eacc8b62f0a81443aa984ab0`.
No commit, no push. **NOT SAFE TO SEAL.***
