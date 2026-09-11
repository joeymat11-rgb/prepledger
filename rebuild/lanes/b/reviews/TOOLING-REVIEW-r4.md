# LANE B — TOOLING REVIEW r4 (independent, blind)

Reviewer: lane-b-reviewer4. Not the builder, not the r1/r2/r3 reviewers, not any fixer.
Everything below was **executed on the owner's PC** (Windows, PowerShell, Node **v24.19.0**
at the full runtime path) against `rebuild/lane-b-tooling @ 477b0253d54f768103cea84983768b9a2f341761`,
worktree `work/lane-b/review-tooling` detached at that commit. The controls are **mine**: I
read the 820-line runner and the six specs first, designed my own probes from the code, and
ran them. Where a probe coincides with the fixer's or with r3's, the coincidence is in the
target, not in the method — and I rebuilt every forged artefact myself rather than reusing
theirs.

## VERDICT: ACCEPT WITH CHANGES

**Usable for sealing: YES** — for B1/B2/B3/B4 as it stands, and for **B-NTC / B-LOM once
Y1 below is in force** (Y1 is satisfiable by the lane without touching the runner; the PM
may also record it as a standing rule exactly as `DECISIONS:108 (d)` did with X1/X2).

X1, X2, X3 and X4 are **closed**, each re-verified by my own executed controls and each
refusal attributed to a *named* check rather than inferred from an exit code. The r3
fixer's self-caught regression — the `L.verifyReceipt` call on the **parent's** receipt
line — is **present** (`b-package.cjs:350`) and **bites** (control G11). The forged happy
path (R5, never executed before this round) now has an executed answer, in §6.

The changes are one blocking-at-seal rule (Y1) and three honesty/robustness items
(Y2–Y4). None of them is a path to a forged `POSTFIX PACKAGE PASS`; I looked for one and
did not find one.

## 1. Delivered bytes, and the scope of the diff — clean

| file | lines | bytes | sha256 (re-measured here) |
|---|---|---|---|
| `b-package.cjs` | 820 | 65367 | `6f69aa8ee6667f27b92166dd981ba9c15078f7e77fc2692130950a2ab8be2c3b` |
| `README.md` | 561 | 39112 | `f948ca4dec2c9c2fcdde3a3913519238f5c62b5335715befc818db6cb5899afe` |
| `TOOLING-REPORT.md` | 1396 | 99789 | `76fefb6deed363c331c1794263441944fa1bdb39c36f9c3db22bdca58192c54e` |
| `packages/B-NTC.json` | 259 | 21159 | `e1724ca697a202d73da5d18f216cbb2529a5ecd3aa1018f74014f4ab725a56e9` |
| `packages/B-LOM.json` | 89 | 12235 | `cd5950916af094fae957d00a5c76360a6c812a5c361180fbb5251dcdbe225871` |
| `packages/B1.json` | 392 | 24383 | `eef1885c8bfa5ccd90737747a524cec13b67f6fa997e93475b6f367745d7b2ae` |
| `packages/B2.json` | 377 | 25289 | `6b80bc0d69bc1c685a0d33c0eec991fbb50b4204d2dfc0302912d887816fa70c` |
| `packages/B3.json` | 274 | 19958 | `b504ecf37588dacfe329d226e77c78c5f1fd370fe04532da69409a3ea4acd76d` |
| `packages/B4.json` | 264 | 19369 | `506b380a2fbb2d22b9101cb73e72c5b140726ddf20f2fe863ab501619101f6cb` |

All nine sha256 reproduce `TOOLING-REPORT.md` §r3 exactly. (One cosmetic slip: that table
says the runner is **812** lines; it is **820** newline-terminated lines. Bytes and hash
agree, so nothing is bound to the wrong thing.)

**The merge is inert under `tooling/`, measured three ways.**

```
git diff --name-only 5b04f21 c0706d5 -- rebuild/lanes/b/tooling      (EMPTY)
git diff --name-status c0706d5 477b025                              9 files, all under
                                                                    rebuild/lanes/b/tooling
                                                                    (7 M, 2 A: B-NTC, B-LOM)
git rev-list --parents -n 1 c0706d5   c0706d5 5b04f21 e9c50e1       (the tip is the 2nd parent)
```

and the runner says so itself on every clean run: `FIDELITY OBSERVED; sourceBase e9c50e1
ancestor of HEAD 477b025; **9** engine/conform/m4-spec/lane-b-tooling file(s) changed since
sourceBase, all in the fixed inventory`. So the merge brought the chain tip (and with it the
`:104` artefact bytes, `DECISIONS` 101–106, the B3/B4 briefs) and touched **nothing** the
tooling owns; the fix commit touched **only** what the tooling owns. `git diff --name-only
5b04f21 477b025 -- ':(exclude)rebuild/lanes/b/tooling'` is exactly the merge's own 84 files
and nothing else.

## 2. The pins, re-derived from Git rather than read from the specs

| claim | re-derived | result |
|---|---|---|
| six specs pin `sourceBase e9c50e1…` | `git rev-list --parents -n 1 c0706d5` | **yes**, all six; it is the merge's 2nd parent and an ancestor of HEAD |
| parent artefact `e940359b…` | `git rev-parse <ref>:rebuild/m4/spec/acceptance-native-carriers.json` | blob `29340bd9` at **HEAD** and on **origin/rebuild/t2-client-core** — identical; sha256 `e940359b…` |
| parent review `9b0918d6…` | same | blob `9cd95066` at HEAD and on the chain branch — identical |
| runner pin in all six specs | `sha256` of disk **and** of `HEAD:…/b-package.cjs` | `6f69aa8e…` — one byte string, three places |
| `coverage.moves` | all six specs | `{}` in **all six** (`DECISIONS:108 (d)` holds today) |
| `parent.decided` | all six | only **B-NTC** is `decided: true, chosen: NATIVE-CARRIERS` — which `DECISIONS:108 (e)` now confirms by name |

`f6aa4a2` (the `:96` base) and `b045e61` (the `:104` base) are both ancestors of the chain
branch; `477b025` is **not** (lane-b-tooling is unmerged), which is what makes §6 decisive.

**R3-D is live and I watched it move.** `refs/remotes/origin/rebuild/t2-client-core` was
`9f68d0a` when I started and `e6b812e` (ledger line 109) an hour later, without my fetching
it — this machine has other sessions. The parent blobs were byte-identical across the move,
so nothing refused; but a seal run **must** `git fetch origin` first, and a refusal on a pin
that looks current should be read as a stale remote-tracking ref before anything else.

## 3. The tip demo — six ids, two modes, and the refusals

Twelve real runs plus fifteen malformed invocations, all on the unmodified tree.

| run | exit | terminal line |
|---|---|---|
| `--ci --package B-NTC` | **2** | `CI REVIEW-PENDING: 4 open obligation(s); public evidence only; no PASS is claimed` |
| `--ci --package B-LOM` | **2** | same, **10** open |
| `--ci --package B1` / `B2` | **2** ×2 | same, **5** open each |
| `--ci --package B3` / `B4` | **2** ×2 | same, **9** open each |
| `--full --package <each of the six>` | **2** ×6 | stderr `B PACKAGE <id> BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` |
| 15 malformed invocations | **1** ×15 | `B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B-NTC|B-LOM|B1|B2|B3|B4` |

The fifteen include no args, `--ci` alone, `--full` alone, `--ci --package` (no id), `B5`,
`b1`, `b-ntc`, `B-ntc`, `BNTC`, `"B1 "` (trailing space), `--CI`, `--ci --full --package B1`,
`--seal --package B1`, `--package B1` alone, and a fourth argument after a valid triple.

**All twelve ran the register audit: `45/45` laws executed, `0 HARNESS_ERROR`**, total line
identical in every one —
`TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls · 97/104 mutant
executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL`. So the merge and the re-pin
moved no law.

**Bare `PASS` lines: 0.** Across the twelve logs the word stands on 24 lines and every one is
a negation: `… is not sealed yet — no PASS word is available` (12), `theme NULL — no PASS
word is available` (6, inside the AUTHORITY line), `no PASS is claimed` (6). **No run reached
exit 0**, in either mode, for any id.

## 4. X1–X4 and the r3 fixer's self-caught regression — my own controls

Attribution used a copy of the runner placed **beside** it (`b-package-dbg.cjs`, one added
`console.error` in the terminal catch), so `__dirname`, `root`, `SPEC_DIR` and the fixed
`RUNNER` path all still resolve to the **real** runner's bytes and its pin still binds. All
mutation controls ran in a **scratch worktree of my own** (`work/lane-b/rv4r/wt`, detached at
`477b025`) so the review worktree was never dirtied; the scratch worktree and its branch were
removed afterwards (§8).

| # | my control | exit | fired at |
|---|---|---|---|
| **G1** | X1: one **well-formed** move (`migrate-full` → a new declared carrier, 40-char reason) | **1** | `COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING migrate-full; coverage.moves must be {} under this runner` — in `spec()`, before any output |
| **G17** | X1 **at the seal**: same move, artefact regenerated to match, and the *spec-level* assert neutered in a debug copy so the seal-level one must decide | **1** | `COVERAGE-MOVES-REFUSED-AT-SEAL-WITHOUT-A-PM-RULING migrate-full` |
| **G2** | X4: `status: "BRIEF-ACCEPTED"` with `brief.acceptedLedgerLine: null` | **1** | `BRIEF-ACCEPTED-WITHOUT-A-CITED-LEDGER-LINE` |
| **G6** | X2: the **stale `:96` pin** (`295762f0…`, line 96) re-declared, current bytes on disk | **1** | `Parent artifact bytes NATIVE-CARRIERS` (disk) |
| **G7** | X2, the stronger form: the same stale pin **with the `:96` artefact and review bytes restored on disk** so the disk pins agree | **1** | `PARENT-ARTIFACT-BYTES-NOT-ON-THE-CHAIN-BRANCH NATIVE-CARRIERS` |
| **G8** | X2: `reviewSha256` off by one hex | **1** | `PARENT-REVIEW-BYTES-NOT-THE-PINNED-REVIEW NATIVE-CARRIERS` |
| **G9** | X2: parent review repointed at a file I wrote in the tooling directory, `receipt.commit` = a **dangling** commit I built with `commit-tree` against a temporary index, parented on the chain tip and carrying a forged theme line | **1** | `Command failed: git merge-base --is-ancestor 67813ae4… refs/remotes/origin/rebuild/t2-client-core` |
| **G10** | the same forged review but `receipt.commit` = the **genuine on-chain** `b045e61` | **1** | `Command failed: git show refs/remotes/origin/rebuild/t2-client-core:rebuild/lanes/b/tooling/r4-review.json` |
| **G11** | **the regression control**: forged review at the genuine on-chain base carrying a **near-miss** receipt line (the real `:104` text with `2026-09-11`→`2026-09-12`, self-consistent `lineSha256`) — a line that satisfies the `RECEIPT` regex and every content mention but does **not** stand in `DECISIONS.md` at that commit | **1** | `RECEIPT-EXACT-LINE-MISSING`, `code=RECEIPT-EXACT-LINE-MISSING` |
| **X3-1** | r3's N3-05 verbatim: the `require` of `migrate-full.cjs` stands **after** `process.exit(0)`, a fabricated `LEGACY migrate-full PASS \| …` line padded past 200 bytes, declared needle at line start (`MOVES_RULING` temporarily set in a debug copy so the move path is live) | **1** | `COVERAGE-MOVE-CHILD-DID-NOT-EMIT-THE-ORIGINAL-GATE-NEEDLE r4x3-neg migrate-full; 311 byte(s) of stdout without "PASS M2-5 full migration gate" — the byte floor is not evidence for a moving child` |
| **X3-3** | POSITIVE: a wrapper that really `require`s and runs `rebuild/engine/test/defect-witnesses.cjs`, moving `witnesses-1` | **2** | **accepted**, 882 bytes, `and emitted the original gate needle(s) witnesses-1` |
| **X3-2** | R3-C reproduced: a wrapper that **never** runs `merge-laws.cjs` but prints `PASS exact sync-laws source` on its own | **2** | **accepted** — see R3-C below |
| **G3** | id widening: `B1.json` carrying `M2-B2-TARGETS-IDENTITY-ERA` + B2's artefact block | **1** | `Package id shape` |
| **G5** | id widening, the new pair: `B-NTC.json` carrying `M2-B-LOM-LEGACY-ORDER-MAPPING` + B-LOM's artefact block | **1** | `Package id shape` |
| **G4** | `NO_REGISTER_IDS` cannot be self-granted: B1 empties its own `dIds`/`laws` | **1** | `D-id inventory: unique, in range, never a already-repaired id` |
| **G12** | single parent: B1 claims `NATIVE-CARRIERS` while B-NTC also claims it | **1** | `SINGLE-PARENT-CHAIN: rebuild/m4/spec/acceptance-native-carriers.json already claimed by B-NTC` |
| **G13** | **the brief's question**: B-LOM adds `NATIVE-CARRIERS` as an option and chooses it instead of the B-NTC artefact | **1** | same `SINGLE-PARENT-CHAIN` refusal |
| **G14** | the same, after freeing the sibling's `chosen` **on disk only** | **1** | got **past** the parent check (`PARENT PINS RE-ASSERTED … 51 pin(s)`) and died later on `UNLISTED-PRODUCT-DRIFT` — see **Y2** |

**On the regression (G11).** This is the one control designed specifically to distinguish
"the call is there" from "the call is live". If `L.verifyReceipt` had been dropped from
`option()` — the fixer's own §r3.2 admission — a near-miss receipt line would sail through
the `RECEIPT` regex (it matches) and the artefact/hash content checks (they match) and die
later, at `PARENT-ARTIFACT-BYTES-NOT-ON-THE-CHAIN-BRANCH` or at `git show`. It dies **at
`RECEIPT-EXACT-LINE-MISSING`** instead, with `legacy-gates.cjs`'s own error code. The
restoration is real, and the two halves of X2 are genuinely independent of it: G9 fires on
ancestry with a *genuine* line, G10 fires on the chain-branch byte read with a *genuine*
base, G11 fires on the line bytes with a genuine base and a genuine path. Three doors, three
different keys.

**On X3.** X3-1 turns r3's headline accept into a refusal, and X3-3 shows the rule is not
"refuse every move". The fixer's two corrections to X3 as written are **right**: `R.GATES`
entries are `[id, file, needle, arg?]`, so `g[2][0]` would have been one character (`"P"`,
`"M"`), and two of the nineteen needles (`preserved writer defects;`, `PASS exact sync-laws
source`) stand mid-line in their own gate's output, so a line-start rule would refuse gates
that really ran. `gateRun()` itself uses `result.stdout.includes(needle)`; the runner uses
the same criterion on the same array. That is the correct reading and it is load-bearing.

## 5. Hunt for NEW weakenings from the id widening and the merge

Four, none of them a forged PASS; the first is the only one I would hold a seal for.

### 5.1 `NO_REGISTER_IDS` removes the only behavioural obligation the runner imposes (→ **Y1**)

For B1–B4 the substantive force in this runner is the 45-law accounting: each declared D-id
must read `RED-frozen / GREEN-candidate` before a receipt, and a law only goes GREEN because
the repair is really in the engine. `NO_REGISTER_IDS = {B-NTC, B-LOM}` removes that force
entirely and puts **nothing** in its place:

* `dIds` and `laws` are empty, so `want(d)` is `RED` for every un-carried id and `GREEN` for
  the six carried ones — which is exactly the tip's state. B-NTC's run prints `LAWS
  DECLARED-STATE 45/45 rows agree` and records **no** open obligation from the audit. It
  will print that on the day the package is finished too, having proved nothing about it.
* Nothing requires a package to declare a child of its **own**. `children()` records `package
  children not authored` only when `s.children.length === 0`, and B-NTC declares five —
  the **parent's** NATIVE-CARRIERS children, which are what cover the nine inherited gates.
  Its own 22-cell test `rebuild/m4/workout/test/native-trend-context.test.cjs` is in
  `product` (role `new`) and in **no** `children[]` entry, and the runner has no rule that it
  must be. B-NTC's own notes say so plainly, to the lane's credit.
* So B-NTC's four open obligations are: brief not authored, product NOT-IMPLEMENTED, theme
  null, brief not accepted. Author the brief, take the post-images, get the two PM lines and
  seal, and **`POSTFIX PACKAGE PASS M2-B-NTC-NATIVE-TREND-CONTEXT` prints on a run in which
  not one line of the new provider executed.** The `--full` half re-runs the ten free
  originals, none of which knows the provider exists.

This is the runner's own governing principle ("a gate counts as COVERED only when a DECLARED
child actually executed in this process") failing to reach the one kind of package that has
no laws to stand in for it. It is visible to a reader of the sealed artefact (`children` and
`executionPins` would not name the provider's test) and to B-NTC's independent reviewer — but
so was R3-A, and X1 was still the right answer.

### 5.2 The single-parent rule is enforced against sibling **specs**, not against sealed artefacts (→ **Y2**)

`parent()` reads the other `packages/*.json` **from disk** and refuses when one of them has
`parent.chosen` resolving to the same artefact. G13 shows it working — B-LOM cannot take
NATIVE-CARRIERS while B-NTC holds it. G14 shows its reach: free the sibling's `chosen` **on
disk, uncommitted**, and the check is silent. Nothing catches that edit — the tooling
directory is not one of the 18 `PIN_PATHS`, `fidelity()`'s change scan reads `git diff
sourceBase HEAD` (commits only), and a seal pins only the sealing package's **own** spec
bytes, never a sibling's. Nor is a *committed* sibling edit any harder: `TOOLING_FILES` are
exempt from `UNLISTED-SOURCE-CHANGE` by design. So "two packages cannot claim the same
parent" (README, *The chain rule*) is true of the specs as they stand at run time and not of
the chain as sealed. The durable fact — which artefact a sealed `acceptance-*.json` names as
its parent — is never consulted.

### 5.3 Three of the six specs carry a note their own content denies (→ **Y3**)

An X4-class defect reintroduced by copy-paste in the widening round. `B3.json`, `B4.json` and
`B-LOM.json` all carry *"PARENT RE-PINNED … `parent.options` NATIVE-CARRIERS now names the
DECISIONS:104 CI re-seal e940359b… in place of the DECISIONS:96 seal …"* — and **none of the
three has a NATIVE-CARRIERS option** (B3: `[B4, B2]`; B4: `[B2, B1]`; B-LOM: `[B-NTC]`).
`B-LOM.json` additionally carries *"the product pre-images **in this spec** are the parent's
own pins carried forward"* with `product: {}`. The notes assert nothing mechanically, but the
spec bytes are sealed into the artefact and `DECISIONS:103 (4)` says the PM will read verdict
files rather than re-run gates, so a spec must not say what its own bytes deny. (B1's and
B2's copies of the same note are true.)

### 5.4 A parent **execution** pin cannot be superseded honestly (→ **Y4**, and a heads-up for `DECISIONS:109`)

`DECISIONS:109` puts the `rebuild.yml` re-pin and the retirement of the `# pass 19` child
**inside the B-NTC seal**. Under this runner a file the parent pinned in `executionPins`
(rather than in `product`) can only enter a child's inventory through `product`, and
`product()` compares only against `bound.acceptance.product`:

```
else assert(pin.role === 'new' || !pmap, 'UNLISTED-PRODUCT-DRIFT ' + file +
            ' is not parent-pinned and is not declared new');
```

so `.github/workflows/rebuild.yml` must be declared `role: "new"` — a false label for a file
the parent pins — or the run refuses. Nothing is lost mechanically (`pins()`/`held()` still
re-assert the parent's byte for it at `sourceBase`, and the child artefact then carries it
forward in `product`), and B-NTC already uses the same workaround for `workout-host.mjs` and
`journey.test.mjs`. But the label is wrong and the `pin.pre === parent pin` equality that
`product()` enforces for parent-**product** files is simply not enforced for these. Comparing
against `{...a.product, ...a.executionPins}`, or adding a `superseded-pin` role, fixes both.

## 6. The forged happy path — R5 executed, and which check stops it

r3 and both fixers recorded that the ACCEPTED branch of `envelope()` had **never run**. It
has now. In a scratch worktree on a scratch branch (never pushed, deleted afterwards) I built
a **fully consistent** fake seal for B1 and drove it through, twice:

1. `packages/B1.json` edited to `status: BRIEF-ACCEPTED`, with a forged theme claim and a
   forged brief-acceptance claim (both well-formed: the right role, the packageId and brief
   path mentioned, ending in the terminal word, `lineSha256` genuinely hashing the line), and
   `parent.decided: true, chosen: NATIVE-CARRIERS` (with B-NTC's claim released on disk, per
   §5.2, so the single-parent check would not mask the rest).
2. `rebuild/m4/spec/acceptance-b1-grading-time-window.json` produced as **exactly**
   `proposed(s, bound)` — canonical bytes, keys in construction order — by instrumenting a
   copy of the runner beside it. **`same(m, proposed())` accepted it**, which is the proof
   that the artefact is a pure function of the spec and the bytes on disk: a forger can
   always produce byte-exact artefact bytes, so the artefact carries no authority of its own.
3. Commit **A** = artefact + review + spec. Commit **B** (child of A) = three lines appended
   to `rebuild/DECISIONS.md`: the theme line, the brief-acceptance line, and
   `- 2026-09-11 · cowork · POSTFIX-ACCEPTANCE M2-B1-GRADING-TIME-WINDOW <A> rebuild/m4/spec/acceptance-b1-grading-time-window.json <artefact sha256> ACCEPTED`.
4. `review-b1-grading-time-window.json` = `{version:1, status:"ACCEPTED", receipt:{commit, path, line, lineSha256}}`.

| run | receipt base | exit | the check that refused |
|---|---|---|---|
| control: review still `PENDING` | — | **1** | `RECEIPT-EXACT-LINE-MISSING` — in `authority()`, looking for the theme and brief lines at the **parent's** on-chain receipt base `b045e61`, where my commits do not reach |
| **V1** `ACCEPTED` | my commit **B** (off-chain) | **1** | **`git merge-base --is-ancestor b376402b… refs/remotes/origin/rebuild/t2-client-core`** |
| V1 again, with the **shipped** runner | same | **1** | same, reported as `B PACKAGE B1 FAIL; required evidence missing or failed; local diagnostics withheld` — no header, no PASS word, nothing printed after `PARENT BOUND` |
| **V2** `ACCEPTED` | genuine on-chain `b045e61` | **1** | `RECEIPT-EXACT-LINE-MISSING` — the forged line is not in `DECISIONS.md` at that commit |

**Which check stops a forged happy path: the chain-branch ancestry of the receipt commit,**
`L.git(root, ['merge-base','--is-ancestor', r.commit, CHAIN_REF])` at `b-package.cjs:726`,
with `CHAIN_REF` a runner constant read from Git refs and nameable by no spec — backed by
`L.verifyReceipt` (line 710), which requires the exact line bytes to stand in
`rebuild/DECISIONS.md` **in Git at that same commit**. The two doors are mutually exclusive
and both are shut: put the line in a commit you control and the ancestry refuses; point at a
commit already on the branch and the line is not there.

**Is a check missing?** No — and the interesting part is what V1 proves by *passing*.
Before it refused, V1 got through, on real bytes, for the first time in this tooling's life:
the closed artefact key set; `same(m, proposed())`; the X1 seal assert; the theme and brief
non-null asserts; `L.verifyReceipt` at the receipt commit; all four cited ledger lines
re-verified there; the verdict regex binding packageId, artefact path and the exact 64-hex;
`L.object(v[1], ARTIFACT).equals(raw)`; **`L.checkSources(root, v[1], reviewed)` over B1's 20
product pins and 8 execution pins, in Git at the reviewed commit *and* in the worktree**; and
`merge-base --is-ancestor v[1] HEAD`. Every one of those is locally satisfiable — I satisfied
them all — which is the point: **the entire weight of `POSTFIX PACKAGE PASS` rests on a
`DECISIONS` line naming these exact artefact bytes standing in Git at a commit that is
already on `origin/rebuild/t2-client-core`.** That is the design, and it is the honest bound:
the tooling is exactly as strong as write access to that branch. Nothing weaker can produce
the word, and I found no third door.

Two further observations from the same run, both reassuring. The theme and brief-acceptance
obligations are anchored at the **parent's** on-chain receipt base, not at HEAD and not at
the package's own receipt, so they refuse a local commit *before* the envelope is even
`ACCEPTED` (the PENDING control). And `--ci`'s `PUBLIC CI EVIDENCE PASS` (the only exit-0 in
the program) needs **zero blocking obligations** and therefore needs those same two on-chain
lines plus a genuinely GREEN law set — so it cannot be reached by forgery either, and its
sentence still disclaims the package verdict.

## 7. Changes required (exact)

**Y1 — BLOCKING FOR THE B-NTC AND B-LOM SEALS.** A package in `NO_REGISTER_IDS` has no D-id
and therefore no law obligation, so its seal must not be reachable while none of its own new
code has executed in the run. Either (a) record it as a standing rule beside X1/X2 —
*"a package with an empty `dIds` inventory may not be sealed unless at least one declared
child executes one of its own `role: "new"` product files"* — and have the sealer check the
line, or (b) make it mechanical, one assert beside X1's at the seal, where the files exist:

```js
// in envelope(), next to the X1 re-assert, before the ACCEPTED branch continues
assert(!NO_REGISTER_IDS.has(ID) || s.children.some(c =>
  argvFiles(c.argv).some(f => Object.hasOwn(s.product, f) && s.product[f].role === 'new')),
  'NO-REGISTER-PACKAGE-SEALED-WITHOUT-EXECUTING-ITS-OWN-PRODUCT ' + ID);
```

(b) is the better answer for the same reason X1 was: it turns a property of today's specs
into a property of the runner, and it cannot be declared away by a spec because
`NO_REGISTER_IDS` and `role` are both fixed in `b-package.cjs` (W7). It cannot fire before
the carrier lands — the test file does not exist yet and `CHILD-ARGV-TARGET` would refuse the
declaration — which is exactly why it belongs at the seal and not in `spec()`.

**Y2 — BEFORE THE SECOND SEAL, not the first.** Close §5.2: in `parent()`, alongside the
sibling-spec scan, refuse when an already-sealed artefact in `rebuild/m4/spec` names the same
parent — read `acceptance-*.json`, compare `parent.artifact`, and refuse on a match that is
not this package's own artefact. The sibling-spec scan stays (it catches the pre-seal case);
this catches the case that actually matters, where the chain is already written down. Until
then, the sealer must confirm by hand that no sealed artefact already names the chosen
parent — and should not rely on the sibling specs' `chosen` fields, which nothing pins.

**Y3 — TEXT ONLY, at the next touch.** Remove or correct the `PARENT RE-PINNED …
parent.options NATIVE-CARRIERS …` note in `B3.json`, `B4.json` and `B-LOM.json` (none of them
has that option), and the `PRE-IMAGE RE-VERIFICATION … the product pre-images in this spec`
note in `B-LOM.json` (its `product` is empty). Also correct `TOOLING-REPORT.md` §r3's byte
table: `b-package.cjs` is **820** lines, not 812.

**Y4 — TEXT ONLY, one line of code.** The runner prints `18 PIN_PATHS byte-identical Git vs
disk` on every run; **16** of the 18 exist in this tree (`rebuild/conform/goldens` and
`rebuild/conform/manifest.json` do not), so two of them are vacuous and the sentence
overstates by two. r3 recorded this as R4 and it was carried unchanged; after X4 it is the
last sentence in the runner's own output that says more than was verified. Count the paths
that exist and say that number, or say `16 of 18 present`. (And consider §5.4's `role`
question in the same pass.)

## 8. Residual risks carried forward

1. **R1 (unchanged; the most important thing a reviewer of a sealed package does).** Pre-seal
   the runner and its spec can be co-edited and the Git-at-HEAD pin falls to anyone who can
   commit. No PASS is reachable pre-seal. **A sealed B package must be reviewed by *diffing*
   `b-package.cjs` and `packages/<id>.json` at the reviewed commit, not merely by running
   them.** §6 is what makes this precise: the artefact is a pure function of those two files
   plus the bytes on disk, so reading them *is* reading the artefact.
2. **R3-A — closed by removal of reach.** `moves` cannot be non-empty; G1 and G17 show both
   gates firing.
3. **R3-B — closed.** G7, G8, G9, G10, G11.
4. **R3-C — open, correctly disclosed, unreachable.** X3-2: a wrapper that prints
   `PASS exact sync-laws source` and never runs `merge-laws.cjs` is accepted, and the runner
   prints `MOVED, declared against … and observed emitting that gate's own needle`. That
   sentence is *literally true* — it did emit the string — which is the X4 standard met, but
   no rule that reads only a child's stdout can prove execution. The real fix is to run the
   gate through `R.gateRun` rather than accept a transcript of it; that belongs with the
   first real `legacy-b<N>-carriers.cjs`, under the PM ruling that admits moves at all.
   Under X1 it has no reach, exactly as R3-A has none.
5. **R3-D — live, and it moved during this review.** See §2. `git fetch origin` before any
   seal run; read a pin refusal as a stale ref first.
6. **R4 — open, now quantified.** 16 of 18 `PIN_PATHS` exist (→ Y4). Note also that
   `rebuild/m4/spec` is **not** among them, so a dirty worktree there is caught only by the
   artefact/review byte pins and by `L.checkSources` at the seal — which is why G7's
   chain-branch read is load-bearing rather than decorative.
7. **R5 — largely discharged this round, for the `--ci` envelope path.** The ACCEPTED branch,
   including `L.checkSources` end to end over 28 pins in Git and on disk, has now executed on
   real bytes (§6). The PM's first `--full` on a sealed package is still the first execution
   of `gates()` and `historical()` — treat *those* as the rehearsal, and write the receipt
   after them, not before.
8. **R6 — unchanged.** `gates()` and `historical()` are unexecuted on any machine without the
   private fixture (`DECISIONS:97`); `rebuild/conform/private/` does not exist on this PC and
   was never created by me. `privateOracle()` reports existence only.
9. **R7 — unchanged.** `--ci` is still not wired into `.github/workflows/rebuild.yml`; that
   file is a NATIVE-CARRIERS execution pin and `DECISIONS:109` puts its re-pin inside the
   B-NTC seal (see §5.4).
10. **R8 — unchanged.** `fidelity()` exempts every file a declared child executes, two of the
    five `CHILD_ROOTS` sit outside its change scan entirely, and an untracked file beside the
    runner is invisible to it. My own debug copies and wrappers lived in exactly those blind
    spots, unremarked, for the whole round — which is the demonstration, not a complaint.
    They were deleted and `git status --porcelain --untracked-files=all` re-checked.
11. **`L.verifyBase` is still not used.** The original pins
    `merge-base HEAD origin/rebuild/t2-client-core === expected` (`CANDIDATE-BASE-STALE`);
    this runner asserts ancestry instead, in three places. Weaker, anchored on the same
    branch, and §6 shows it is the assertion the whole PASS hangs on.

## 9. Safe to seal?

**Yes.** B1, B2, B3 and B4 may be sealed with this tooling as it stands: their law
inventories carry the substantive force, X1 and X2 are now standing rules (`DECISIONS:108
(d)`) *and* mechanical, and every route I could find to a forged `POSTFIX PACKAGE PASS`
terminates on a `DECISIONS` line that only a push to `origin/rebuild/t2-client-core` can
create. **B-NTC and B-LOM may be sealed once Y1 is in force** — as a written rule the sealer
checks, or as the one assert above. Y2 should land before a second package claims a parent;
Y3 and Y4 are text.

Across this round: **12 tip runs + 15 usage refusals + 18 mutation runs (18 controls) + 4
forged-seal runs + 1 scratch baseline = 50 executions, 0 bare `PASS` lines, and no run
reached exit 0.** Every refusal is
attributed to a named check. Of the 18 controls, 16 refused at exit 1; the two that did not
were meant not to — X3-3 (the positive: a wrapper that really runs the gate) and X3-2 (R3-C,
the disclosed limit) — and both ended at exit 2 `CI REVIEW-PENDING` with no PASS word.

### Restoration, verified

```
git -C work/lane-b/review-tooling rev-parse HEAD    477b0253d54f768103cea84983768b9a2f341761
HEAD is detached                                    yes
git status --porcelain --untracked-files=all        (empty, before this file)
git worktree list | grep rv4r                       (empty — the scratch worktree was removed)
git branch --list 'r4*'                             (empty — the scratch branch was deleted)
rebuild/lanes/b/tooling/{*dbg*,*forge*,*x1*,r4x3-*,r4-*}   (none)
rebuild/m4/workout/test/r4x3-*                      (none)
rebuild/conform/private/                            absent, and never created
```

All nine tooling files re-hash to the sha256 in §1. The scratch worktree
(`work/lane-b/rv4r/wt`), its branch `r4-forge` and the two commits on it were local only and
were never pushed; the dangling commit `67813ae4…` of G9/G10/G11 was built with
`hash-object` / `read-tree` / `write-tree` / `commit-tree` against a temporary index, was
never pointed at by a branch, and is unreachable. Nothing was written under
`rebuild/m4/spec`, `rebuild/conform` or `rebuild/engine` in the review worktree or on any
pushed branch. `ledger/` and `rebuild/conform/private/` were never opened.
