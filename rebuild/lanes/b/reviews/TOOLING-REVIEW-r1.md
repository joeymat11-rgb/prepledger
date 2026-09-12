# LANE B — TOOLING REVIEW r1 (independent, blind)

- **Under review:** `rebuild/lanes/b/tooling/` — `b-package.cjs`, `packages/B1–B4.json`,
  `README.md`, `TOOLING-REPORT.md`
- **Branch / commit:** `rebuild/lane-b-tooling` @ `53884bfe6b82b16476c866f56a4ab987933d742e`
  (base `acd3b6755404ab75e91087d179e48ed07467549a`, ledger line 100)
- **Reviewer:** lane-b-reviewer (LANE B, r1). Did not author any byte under review.
- **Method:** execution on the owner's Windows PC in an independent detached worktree
  `work/lane-b/review-tooling` created from `origin/rebuild/lane-b-tooling`.
  Node `v24.19.0` at the pinned runtime path. `npm ci --include=dev` once, exit 0,
  `package-lock.json` untouched. Shell `powershell.exe`, fresh per call, absolute paths.
- **Privacy:** nothing under `ledger/` or `rebuild/conform/private/` was opened.
  `rebuild/conform/private/` does not exist on this tree (`Test-Path` = False) and was
  not created. No private value, count, hash or prose is reproduced here — verdict only.
- **Date:** 2026-09-11

## VERDICT: ACCEPT WITH CHANGES

The committed bytes may stand on the branch. They refused every fail-closed bite I
threw at them, printed no PASS word in any run, and require — rather than copy — the
immutable machinery (`postfix/run.cjs` GATES + `gateRun`, `legacy-gates.cjs`,
`strict-json.cjs`, `target.cjs`, `native-carriers-errors.cjs`, `load-write-reference.cjs`).

They are **not** yet the same acceptance mechanism as the accepted packages. Two
weakenings are structural and **blocking before any lane-B artifact is sealed** — W1
and W2 below. Neither can bite today (no envelope exists, no children are authored, the
private fixture is absent), which is why this is ACCEPT WITH CHANGES and not REJECT.
`b-package.cjs` must not be used to seal or to claim PASS for B1–B4 until W1 and W2 are
closed and re-reviewed.

## 1. Scope of the diff — clean

| check | command | outcome |
|---|---|---|
| files added | `git diff --name-status acd3b67 53884bf` | 7 files, all `A`, all under `rebuild/lanes/b/tooling/` |
| nothing else touched | same | **0** files under `rebuild/m4/spec`, `rebuild/conform`, `rebuild/engine`, `.github` |
| stat | `git diff --stat acd3b67 53884bf` | `7 files changed, 1555 insertions(+)` |
| ancestry | `git rev-list --parents -n 1 53884bf` | single parent `acd3b675…` — a direct child, not a merge |
| history | `git log --oneline acd3b67..53884bf` | exactly one commit |

No grounds for rejection here.

## 2. Executed matrix on the unmodified tip

All run as `node rebuild/lanes/b/tooling/b-package.cjs <args>` from the worktree root.

| invocation | exit | terminal line | PASS word? |
|---|---|---|---|
| `--ci --package B1` | 2 | `CI REVIEW-PENDING: 5 open obligation(s); public evidence only; no PASS is claimed` | none |
| `--ci --package B2` | 2 | `CI REVIEW-PENDING: 5 open obligation(s); …` | none |
| `--ci --package B3` | 2 | `CI REVIEW-PENDING: 4 open obligation(s); …` | none |
| `--ci --package B4` | 2 | `CI REVIEW-PENDING: 4 open obligation(s); …` | none |
| `--full --package B1` | 2 | `B PACKAGE B1 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` | none |
| `--full --package B2` | 2 | `B PACKAGE B2 BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING` | none |
| (no args) | 1 | `B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B1|B2|B3|B4` | none |
| `--third --package B1` | 1 | same refusal — there is no third mode | none |
| `--ci --full --package B1` | 1 | same refusal | none |
| `--ci --package B9` | 1 | same refusal | none |
| `--ci --package b1` | 1 | same refusal (case-exact) | none |

`45/45` register laws executed with `0 HARNESS_ERROR` on all four packages:
`TOTAL 45 laws · 45 RED-frozen · 39 RED-candidate · 89 GREEN repair controls ·
97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL`.
The `AUDIT RED-FIRST FAIL` word is the honest state on this tree (six ids already
repaired) and the runner parses the 45 per-D rows instead of demanding exit 0 — correct.
The only occurrences of the string `PASS` in any run are the two negations
`no PASS word is available` and `no PASS is claimed`.

`--full` stops at `privateOracle()`, which precedes `historical()` and `gates()`.
Existence only (`fs.existsSync` on the live blob and the manifest-named golden); the
blob is never opened, read, hashed or quoted. The BLOCKED-vs-FAIL classification and
the code string are taken from `native-carriers-errors.cjs`'s `codes` export, itself
derived from `run.cjs`'s own closed list — not re-typed. This satisfies the standing
rule at `DECISIONS:97`.

## 3. Weakening hunt

### What holds (verified, no weakening)

- **Authorization spine.** `merge-base --is-ancestor` throughout (`sourceBase`→HEAD,
  reviewed commit→HEAD, receipt base→`refs/remotes/origin/rebuild/t2-client-core`) —
  explicit ancestry, never merge-base equality, exactly as `BRIEF-IMPORT-GUARDS.md`
  §3 requires ("Replace v1's merge-base equality with explicit ancestry").
- **`REVIEW-PENDING` semantics.** `PENDING` iff `receipt === null`; a receipt supplied
  with `PENDING` fails; a third status fails; PENDING evidence exits 2 with no PASS word.
- **Exact-bytes receipt.** The verdict regex binds package id, artifact path and the
  full 64-hex hash of the artifact bytes read from disk, then re-reads the artifact from
  Git at the reviewed commit and requires byte equality.
- **19 gates.** `GATE_IDS` is derived from `R.GATES` (19, verified against `run.cjs`);
  `assert.deepEqual([...done].sort(), GATE_IDS.sort())` forbids a missing or extra gate;
  `PIN_PATHS` is extracted from `run.cjs`'s own single-line inventory with a
  `assert.equal(m.length, 1)` guard (18 paths, matches `run.cjs`) — no second copy.
- **Second gate** is inside `R.GATES` and is not special-cased out.
- **Single-parent chain.** Two packages naming the same parent refuse, both ways.

### W1 — BLOCKING. The substantive/thin split is inverted

`BRIEF-IMPORT-GUARDS.md` §3: *"Use `acceptance-import-guards.json` for ALL substantive
requirements … Runner reads substantive requirements ONLY from the artifact. Its own
bytes are bound externally by this hash/review; the thin envelope is
schema/receipt/ancestry checked."*

`b-package.cjs` does the reverse. Every substantive requirement — D-ids, law ids,
product pre/post map, coverage, carrier successor, witness flips, protected surfaces,
authorizations, children — is read from `rebuild/lanes/b/tooling/packages/<id>.json`,
which **no receipt, artifact or pin binds**. `envelope()` checks the acceptance artifact
for `artifact.packageId === s.packageId` and nothing else: no recomputation-equality
(`assert(same(m, proposed()))` in `native-carriers-profile.cjs`), no product or
`executionPins` re-verification at the reviewed commit, no `gates`/`coverage`/
`authorizations` content. The spec's sha256 is *printed* (`SPEC OBSERVED … <sha>`) and
never pinned. `fidelity()` diffs only `rebuild/engine`, `rebuild/conform`,
`rebuild/m4/spec`, so `rebuild/lanes/**` — the spec **and the runner** — is outside
every change check.

Executed proof:

| bite | command | outcome |
|---|---|---|
| B9 | delete `rebuild/engine/dates.cjs` from `B1.product`, then `--ci --package B1` | **accepted silently**: `3 declared product files`, `0 unlisted drift`, `FIDELITY OBSERVED … 0 engine/conform/m4-spec file(s) changed`, exit 2 with the usual 5 obligations — no refusal, no new obligation |
| B10 | inject `console.log('B PACKAGE RUNNER-EDIT injected line executed')` into `b-package.cjs`, then `--ci --package B4` | **injected line executed**, no refusal, exit 2. The runner's own bytes are in no pin list, where `native-carriers-profile.cjs` puts `native-carriers-package.cjs` and `-profile.cjs` into `executionPins` inside the hashed artifact |

Consequence: an ACCEPTED receipt would name the bytes of a near-empty artifact while the
checks the PASS run actually performed were governed by an unreviewed, freely editable
spec and an unpinned runner. **Required change:** the sealed artifact must carry the
substantive content (or, at minimum, pin the spec sha256 and the runner sha256 inside the
artifact and assert both at run time), and `envelope()` must re-verify product and
execution pins at the reviewed commit as `native-carriers-profile.cjs` does.

### W2 — BLOCKING. A gate is counted as covered without an executed child

`gates()` skips a gate listed in `coverage.inherited` / `coverage.moves` on
`fs.existsSync(path.join(root, 'rebuild/m4/spec/' + child + '.cjs'))` **alone**. Nothing
ties the covering `child` string to the `children[]` array that is actually spawned with
an exact verdict needle. In the accepted original the nine covered gates were covered
*because* `source-carriers`, `inherited-carriers`, `defect-witnesses`,
`writers-differential` and `second-gate` ran in the same process, each asserted against
its exact declared verdict, and each was pinned in `executionPins`.

This is the same defect class the ledger already records against the PM's own earlier
work: `DECISIONS:97`, *"F-PM-2 nine frozen-source originals uncovered"*.

Executed proof:

| bite | command | outcome |
|---|---|---|
| B5 | rewrite `B4.coverage.inherited` so all **19** gates map to one unrelated existing file (`native-carriers-source`), then `--ci --package B4` | **accepted silently** — no refusal, still `4 open obligation(s)`, exit 2. Nothing objects to 19/19 gates being declared covered by a file that is never executed |
| B5b | add a covered gate id that is not one of the 19 | `FAIL` exit 1 — the gate-id membership check does hold |

The shipped specs already lean on this: all four declare 9 gates `inherited`-covered by
`native-carriers-*` children of the **parent** package, which `b-package.cjs` never runs.
Since `privateOracle()` precedes `gates()`, only `migrate-full`'s private precheck
survives such a declaration; the other 18 would be skipped. Aggravating details: `child`
is an unvalidated path fragment (no package-id prefix requirement, no traversal guard),
and the covered count is unbounded where the original pins `covered.length === 9`.

**Required change:** every gate in `coverage.*` must resolve to an entry in `children[]`
that ran to exit 0 with its exact declared verdict in this same process, and the covering
child's bytes must be pinned in the artifact.

### W3 — a declared child can be a no-op

`children[]` is unvalidated spec data: `keys(child, ['name','argv','needle'])` only. No
type, non-empty or path constraint.

| bite | command | outcome |
|---|---|---|
| B8 | `B4.children = [{name:'trivial', argv:['-e','0'], needle:''}]`, then `--ci --package B4` | `CHILD trivial OBSERVED; exit 0 and exact declared verdict` and the open count drops **4 → 3**. A no-op closes the "package children not authored" obligation |

`''` satisfies `stdout.includes(needle)` unconditionally. The originals hard-code argv and
non-empty verdict strings in immutable code. **Required change:** non-empty needle, and
the child inventory bound by the artifact rather than by the spec.

### W4 — parent pins are never re-asserted in this tree

`parent()` verifies the parent artifact's bytes, its review status `ACCEPTED`, its
receipt (role `cowork`, line content, ledger line) — and stops. It never walks the
parent's `product` / `executionPins`, nor the grandparent's `baseline.publicPins`, the
way `native-carriers-profile.cjs` does ("Every parent pin still holds"). The substitute,
`fidelity()`, diffs only three trees since `sourceBase`, so a committed change to any
other pinned path — `src/`, `tools/`, `scripts/`, `app.js`, `index.html`, `sw.js`,
`manifest.webmanifest`, `.github/workflows/rebuild.yml`, `rebuild/m3/w7-preview/*` — is
invisible between `sourceBase` and HEAD. The accompanying
`git status --porcelain -- <PIN_PATHS>` check is working-tree-vs-HEAD cleanliness, not
byte equality against the pins; the printed claim "18 PIN_PATHS byte-identical Git vs
disk" is accurate as worded but is not `checkSources()`.

### W5 / W6 / W7 — smaller

- **W5.** `envelope()` runs once, first. Both accepted runners call `Profile.verify()`
  again after the gate matrix. Nothing here detects an artifact or review swap mid-run.
- **W6.** `authorizations.contract` is key-listed and then never verified or used; `B1`
  and `B4` even carry an extra `inheritFromParent` key that no `keys()` call rejects.
  Owner and theme claims are verified without `mentions`, so their content is bound only
  by `lineSha256` + role, where the accepted profile also binds `SLICE RATIFICATION` /
  the package id / the terminal ` · ACCEPTED`.
- **W7.** `artifact.file` and `artifact.review` are self-declared exemptions from
  `UNLISTED-SOURCE-CHANGE`; the only constraint is the `acceptance-` / `review-` prefix
  under `rebuild/m4/spec/`.

## 4. My own fail-closed bites — every one refused

Spec bytes and the runner restored after each; `git status --porcelain` clean after every
group; the runner re-hashed to `59916e1d33ce85d2203e0d3848726ea2195b3ae5403f385aefb5ee2a2a4cec63`.

| # | bite | outcome |
|---|---|---|
| B1 | `B1.laws.D10` → a law id that does not exist | `FAIL` **exit 1** after the 45-law run |
| B2 | `B1` and `B2` both `parent.decided=true, chosen=NATIVE-CARRIERS` | `FAIL` **exit 1** running B1 **and** running B2 (SINGLE-PARENT-CHAIN) |
| B3 | `B4.product['rebuild/engine/energy.cjs'].pre` → wrong sha256 | `FAIL` **exit 1** (UNLISTED-PRODUCT-DRIFT) |
| B4a | genuine `POSTFIX-ACCEPTANCE M2-NATIVE-CARRIERS` receipt (real commit, real ledger line, real `lineSha256`) reused as the B1 acceptance, with the real owner/theme claims bound in | `FAIL` **exit 1** — the verdict regex binds this package id and this artifact path |
| B4b | hand-written `ACCEPTED` envelope, forged ledger line, **wrong** artifact hash | `FAIL` **exit 1** |
| B4c | hand-written `ACCEPTED` envelope, forged ledger line, **correct** artifact hash | `FAIL` **exit 1** — the line is not in `rebuild/DECISIONS.md` at the receipt base |
| B4d | same forgery with `authorizations.theme` left null | `FAIL` **exit 1** (THEME-AUTHORIZATION-UNAVAILABLE) |
| B4e | `PENDING` envelope, `receipt: null` | `ENVELOPE PENDING`, `CI REVIEW-PENDING: 5 open obligation(s)`, **exit 2**, no PASS |
| B4f | `PENDING` envelope carrying a receipt | `FAIL` **exit 1** |
| B5 | all 19 gates declared covered by one unrelated existing child | **ACCEPTED SILENTLY** — see W2 |
| B5b | a covered gate id that is not one of the 19 | `FAIL` **exit 1** |
| B6a | carried `D33` smuggled into `dIds` | `FAIL` **exit 1** |
| B6b | out-of-range `D46` in `dIds` | `FAIL` **exit 1** |
| B7 | one extra space inside the spec JSON | `FAIL` **exit 1** (JSON-NONCANONICAL-BYTES) |
| B8 | declared child with empty needle and no-op argv | **ACCEPTED, closes an obligation** — see W3 |
| B9 | one product file deleted from the spec inventory | **ACCEPTED SILENTLY** — see W1 |
| B10 | `b-package.cjs` itself edited | **injected line executed, no refusal** — see W1 |

No bite reached a PASS word. No bite reached exit 0.

## 5. Cross-check of the builder's report

| claim | verdict |
|---|---|
| §1 exit-code matrix (10 rows) | **reproduces exactly**; I added `--ci --package b1` → also exit 1 |
| §2 verbatim `--ci --package B1` output | **reproduces line-for-line**, except the HEAD short sha (`acd3b67` in the report, `53884bf` here) — expected, the report predates its own commit |
| §4 `--full` BLOCKED line and exit 2 | **reproduces** for B1 and B2 |
| §5 controls C1–C4 | **reproduce** (my B2, B3, B1, B7) |
| §6 item 6 — "`acceptance-native-carriers.json` **is** already pinning `volume.cjs`" | **CORRECT.** Artifact sha256 `295762f0bfabf371e1e84b2c8e00a56fc46e7ed3f4e1a08afdebc9e86fb9c5d1`; `product['rebuild/engine/volume.cjs'] = c32298e7855da61f7584f89982ab50107a5fe2c41143d3af9f6569eddba2f9d4`, equal to the byte hash on disk. B2 supersedes an existing pin; it does not add a product file |
| §8 delivered bytes table (6 rows) | **all 6 sha256 and byte counts reproduce**; `b-package.cjs` 25032 bytes / `59916e1d…` |
| preamble: `87eddad` is an ancestor of HEAD | **true** (`merge-base --is-ancestor` exit 0) |
| preamble: `git diff --name-only 87eddad acd3b67 -- rebuild/engine rebuild/conform rebuild/m4/spec` is 0 files | **true**, 0 files |
| `DECISIONS:97` carries the "builders and reviewers run `--full` WITHOUT the private fixture" standing rule | **true**, verbatim on line 97 |
| `DECISIONS:96` is the receipt for `295762f0…` | **true**; line 95 is the superseded receipt for `12597632…` |
| `PLAN-TRACK-B-PACKAGES-v1.md:146` is the parent-chain serialization decision | **true** |

### What the report got wrong

1. **§6 omits W1, W2, W3 and W4** — the four gaps that matter. Gap 3 touches coverage
   *provenance* ("copied into the spec rather than read out of the parent artifact") but
   not the fact that a covered gate never requires an executed child. That is precisely
   the `F-PM-2` defect the ledger records at `DECISIONS:97`, so it is not a new or
   subtle class in this repo.
2. **§6 item 7 understates itself.** It says the 19-gate `--full` path is "unexecuted end
   to end on this machine". It is unexecutable on *any* machine without the private
   fixture, because `privateOracle()` precedes `gates()` — so the coverage-skip logic in
   `gates()` has never been executed anywhere, by anyone.
3. **§8's "every gate, law, receipt, ancestry and error-classification routine required
   from the immutable originals rather than copied"** is true of the routines, but the
   *accounting* that decides which gates run is new code with no original behind it, and
   that is where W2 lives.

## 6. Residual risks

1. `gates()` and `historical()` are dead code on any machine without the private fixture.
   Their first real execution will be the PM's own FULL run, unrehearsed. W2 must be
   fixed before that run, not diagnosed by it.
2. `children[].argv` is arbitrary spawn arguments from a JSON file that no receipt binds.
   A reviewer of a sealed B package must diff the spec, not only the runner.
3. `coverage.*` child names are unvalidated path fragments interpolated into
   `'rebuild/m4/spec/' + child + '.cjs'` — no traversal guard, no package-id prefix rule.
4. Two `PIN_PATHS` entries inherited from `run.cjs` (`rebuild/conform/goldens`,
   `rebuild/conform/manifest.json`) do not exist in this tree; `git status --porcelain`
   tolerates non-matching pathspecs, so the "18 PIN_PATHS" count is nominal, not 18 live
   paths. Inherited from the original, not introduced here, but it means the count in the
   FIDELITY line is weaker evidence than it reads.
5. `envelope()`'s single up-front evaluation (W5) means the `authorized` flag that decides
   whether `gateRun` emits `PASS` or `OBSERVED` is computed before any gate runs.
6. All four specs carry `authorizations.theme: null` and `owner.line: null`, so the
   ACCEPTED branch has never been reached by a *valid* envelope — only by my forgeries,
   which refused. The happy path of `envelope()` past `verifyReceipt` is untested.
7. `.github/workflows/rebuild.yml` is pinned by the accepted NATIVE-CARRIERS artifact;
   lane B correctly did not touch it. Any `--ci` wiring must ride the one batched re-seal
   the report names, or it turns the parent package RED.

## 7. What the PM must still name

1. **The single parent — the one decision that unblocks all four packages.** Every spec
   ships `parent.decided: false, chosen: null` and refuses to bind. `B1` and `B2` each
   document `NATIVE-CARRIERS` (sealed, `295762f0…`, receipt `DECISIONS:96`) and each
   other; `B3` and `B4` document only unsealed options. `PLAN-TRACK-B-PACKAGES-v1.md:146`
   proposes `B2 → B1 → B4 → B3`; `BRIEF-B1 v1.1 §5.3` proposes
   `NATIVE-CARRIERS → B1 → B2 → B4 → B3`. **Name one chain and hold it.** Two packages
   naming the same parent refuse (verified, exit 1 both ways), so this cannot be deferred
   past the first seal. Whichever package is not first must re-take every pre-image
   sha256 at the new parent's accepted head.
2. **W1 and W2 as blocking pre-seal conditions**, or an explicit ruling that lane-B
   packages use a different authorization split from `BRIEF-IMPORT-GUARDS.md` §3 — in
   which case that ruling needs its own ledger line, because it changes the mechanism the
   four accepted packages were held to.
3. **Brief acceptance ledger lines** for B1–B4 (all four currently `OPEN brief … not
   accepted by a PM ledger line`) and the `theme` ledger line each spec leaves null.
4. **H1** (`today.cjs:92 e.id === "hack"`) — inside B1 or its own item (`DECISIONS:93` C3,
   `PLAN` §4 item 7). Unrelated to this tooling, but it gates B1's file list.
5. **Who reviews the engine tier** (`PLAN` §4 item 4): confirm the reviewer is not the
   author and that the PM's own FULL run is the acceptance.
