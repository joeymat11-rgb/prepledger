# LANE B — closed-package tooling for B1..B4

Reusable machinery so each engine-fix package does **not** re-invent the closed-package
mechanism. Lane-B-owned (`rebuild/lanes/LANES.md`: lane B owns `rebuild/lanes/b/*`).

```
node rebuild/lanes/b/tooling/b-package.cjs --ci  --package B1
node rebuild/lanes/b/tooling/b-package.cjs --full --package B1
```

Two modes, **no third**. Anything else refuses in one line with exit 1
(`B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B1|B2|B3|B4`).

## Where the final artifacts live — read this first

This directory holds **tooling and pre-package declarations only**.

At package time the **closed cumulative profile artifact and its review envelope still
live in `rebuild/m4/spec/`** — `acceptance-<pkg>.json` and `review-<pkg>.json`, exactly
where `acceptance-load-writes.json` and `acceptance-native-carriers.json` live — because
that is the PM-owned directory the accepted chain and the CI workflow already bind
(`rebuild/lanes/LANES.md` gives `rebuild/m4/spec` to the PM lane). Each spec names its
own future coordinates in its `artifact` block. **Nothing in `rebuild/m4/spec` is written
by this tooling, and lane B must not write there without the PM's ledger line.** The
same applies to the witness carrier successor, which belongs under
`rebuild/conform/v4/postfix/` next to `legacy-step-efficacy-carriers.cjs`.

## What `b-package.cjs` reuses rather than copies

| reused | from | used for |
|---|---|---|
| `GATES` (19 identities), `gateRun` | `rebuild/conform/v4/postfix/run.cjs` | the 19 original gates in `--full`, second gate included |
| `PIN_PATHS` (derived from the immutable source) | same file | Git-vs-disk fidelity at HEAD |
| `git`, `object`, `verifyReceipt`, `checkSources`, `historicalAudit` | `postfix/legacy-gates.cjs` | ancestry, exact ledger-line bytes, reviewed Git-and-worktree byte pins, the historical 45-law audit |
| `sha` | `postfix/target.cjs` | every byte pin |
| `parseExact` | `postfix/strict-json.cjs` | exact reviewed JSON bytes + duplicate-key refusal |
| `codes` (closed BLOCKED list) | `rebuild/m4/spec/native-carriers-errors.cjs` | BLOCKED vs FAIL classification |
| `create` (pinned public reference bundles) | `rebuild/m4/spec/load-write-reference.cjs` | `ENGINE_MAIN` / `ENGINE_OLD` |

No gate, law, oracle, golden or frozen input is re-implemented here.

## Which bytes bind which — the substantive/thin split

`BRIEF-IMPORT-GUARDS.md` §3 puts **all substantive requirements** in the hashed artifact
and leaves the runner's own bytes "bound externally by this hash/review". Lane B keeps
that split, in a chain where **nothing pins itself**:

```
packages/<id>.json   the substantive spec        pinned by  acceptance-<slug>.json  (spec.sha256)
b-package.cjs        the runner                  pinned by  packages/<id>.json      (tooling.runnerSha256)
                                                 and by     acceptance-<slug>.json  (runner.sha256)
acceptance-<slug>.json  the sealed artifact      pinned by  the PM's DECISIONS receipt line (64-hex)
```

* Before seal, an injected line in `b-package.cjs` refuses at the **first** spec check
  (`RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER`) — the spec carries the runner's sha256. The
  same pin is then resolved a second time against the runner's bytes **in Git at HEAD**
  (`RUNNER-BYTES-NOT-THE-REVIEWED-RUNNER-IN-GIT`), so the pre-seal co-edit — inject a line
  *and* re-take `tooling.runnerSha256` in the same hand — refuses too: disk, Git and the
  spec pin must be one byte string. Self-verification still only **detects**; the injected
  line has already run by the time the check is reached. A reviewer of a sealed B package
  diffs `b-package.cjs` and `packages/<id>.json`, and does not only run them.
* After seal, `envelope()` recomputes the **whole artifact** from the spec and the bytes on
  disk (`same(m, proposed())`) and refuses on any difference: an edited spec, an edited
  runner, a changed product pin, a changed child, a changed coverage map.
* On an ACCEPTED envelope every pinned product and execution byte is additionally re-read
  **from Git at the reviewed commit** and compared with the worktree, through
  `legacy-gates.checkSources` — the original routine, not a copy.
* `fidelity()` scans `rebuild/lanes/b/tooling/**` alongside `rebuild/engine`,
  `rebuild/conform` and `rebuild/m4/spec`, and the tooling inventory it accepts is fixed
  **in the runner**, so a new file cannot be smuggled in beside the spec.

### What the sealed artifact contains

`acceptance-<slug>.json` is written by the PM's integrator (never by this tooling) as
canonical JSON with exactly these keys, in this order:

```
version, lanePackage, packageId, sourceBase,
parent {id, artifact, sha256, review, receiptLedgerLine, reviewedCommit},
spec {file, sha256}, runner {file, sha256},
dIds, laws, carriedAcceptedIds, privateLiveTriggered,
gates (the 19, sorted), coverage {covered, run, moves, byChild},
authorizations, product, carrierSuccessor, witnessFlips, protectedSurfaces, children,
artifact {file, review}, executionPins
```

`executionPins` is the runner, the spec, the brief, the carrier successor when it exists,
and every file a declared child executes. `product` is the spec's own `{pre, post, role}`
map. The runner computes the same object every run; if the sealed bytes differ by one
character the run refuses.

## How to instantiate a package

1. **Copy the nearest spec** in `packages/` and edit it. It is read with `parseExact`, so
   the bytes must be exactly `JSON.stringify(parsed, null, 2) + "\n"` — a duplicate key,
   an unknown key, a missing key or a stray space refuses the whole run (control C4).
   Keys are closed: `version, lanePackage, packageId, status, brief, sourceBase, dIds,
   laws, carriedAcceptedIds, privateLiveTriggered, parent, tooling, product, coverage,
   carrierSuccessor, witnessFlips, protectedSurfaces, authorizations, artifact, children,
   notes`.
1b. **`tooling`** is `{runner, runnerSha256}` — the runner path and the sha256 of the
   reviewed `b-package.cjs`. Re-take it whenever the runner changes, and re-review both
   together: the runner is not allowed to differ from the bytes the spec names **or from
   the bytes standing in Git at HEAD**. A runner edited on disk and re-pinned in the same
   breath refuses; the pin is only satisfied when disk, Git and the spec agree. The
   practical consequence is that the runner must be **committed** before any run.

1c. **`brief`** is `{file, sha256, acceptedLedgerLine}`. `acceptedLedgerLine` is `null`
   until the PM accepts the brief, and then it is a **ledger citation**
   `{ledgerLine, role: "cowork", line, lineSha256}` — the same shape as `owner`,
   `contract` and `theme`, never a bare line number. Its `line` must name this package id
   and this brief path and end in the **`ACCEPTED` terminal word**, `status` must be
   `BRIEF-ACCEPTED`, and the runner finds its exact bytes in `rebuild/DECISIONS.md`
   **in Git at the parent's receipt base** before the obligation closes. A declared
   acceptance that is not in the ledger refuses the run; a `null` one simply leaves the
   obligation open. The open-obligation count is therefore evidence again: neither the
   brief nor the theme can be struck off it by declaration.
2. **`dIds`** in package order; **`laws`** maps each D-id to its law id. The runner
   cross-checks every law id against the **executed** live inventory, not a table — a
   renamed or mistyped law id fails the run (control C3).
3. **`product`** maps each file to `{pre, post, role}` and must list **every file the
   parent artifact pins in its own `product` map** — the repair files with role `edited`
   (or `new`), the rest with role `carried` (`pre === post`, byte-identical on disk).
   `pre` must **be** the parent's pin, not a self-declared value; `post` stays `null`
   until the repair exists. The runner hashes the bytes on disk and reports
   `NOT-IMPLEMENTED` / `PARTIAL` / `IMPLEMENTED` over the non-carried files. A byte that
   is neither `pre` nor `post`, a pre-image that is not the parent's pin, and a
   parent-pinned file **missing from the inventory** are all `UNLISTED-PRODUCT-DRIFT`
   and fail (controls C2, C6, C7).
4. **`parent`** carries `decided`, `chosen` and every documented `options` entry. See the
   chain rule below.
5. **`coverage`** is `{inherited, moves}`, and **both halves are bounded** — the covered
   set is not something a spec can grow.

   **`coverage.inherited` must be the parent artifact's own `coverage.byChild` map
   byte-for-byte** — the gate ids *and* the child each one maps to
   (`INHERITED-COVERAGE-IS-NOT-THE-PARENT-COVERED-SET`). Re-pointing the parent's nine at
   a child of the spec's own choosing is refused, and every inherited child must execute a
   file the **parent artifact itself pins**
   (`INHERITED-COVERAGE-CHILD-IS-NOT-A-PARENT-PINNED-EXECUTABLE`).

   **`coverage.moves` maps a gate to `{child, reason}`** — never a bare child name. A move
   is accepted only when all of the following hold:
   * `reason` is a stated, single-line, non-trivial sentence (`COVERAGE-MOVE-REASON-MISSING`);
   * the child's `argv` names **the gate's own original executable** as `run.cjs` records
     it in `GATES`, or a file whose **bytes** carry a `require`/`import` of that executable
     — resolved by reading the covering file and resolving each relative specifier against
     its own directory, never by declaration
     (`COVERAGE-MOVE-CHILD-DOES-NOT-EXECUTE-THE-ORIGINAL`);
   * the child carries **one** gate, unless `run.cjs` itself groups several on one
     executable — today the only such group is `conformance` + `selftest`, both on
     `rebuild/conform/run.cjs`
     (`COVERAGE-MOVE-CHILD-COVERS-MORE-GATES-THAN-run.cjs-GROUPS`);
   * the child is not also an inherited child
     (`COVERAGE-MOVE-CHILD-IS-AN-INHERITED-CHILD`).

   A gate is inherited-covered or moved, never both, and the total is asserted closed:
   `covered == parent byChild + declared moves` (`COVERED-SET-BOUND`) — the generic form of
   the accepted original's `assert.equal(m.coverage.covered.length, 9)`.

   **Every value is the `name` of an entry in `children[]`, and the gate counts as covered
   only because that child actually ran in this process, exit 0, with its exact declared
   verdict matched.** A covering name that is not a declared child refuses
   (`COVERAGE-CHILD-NOT-DECLARED`); a declared child that did not run refuses
   (`COVERAGE-CHILD-NOT-EXECUTED`). Nothing is ever covered because a file exists — that is
   the `DECISIONS:97` F-PM-2 defect — and nothing is covered by a child that did not
   execute the thing the gate is about.
6. **`carrierSuccessor`** + **`witnessFlips`**: one flip per assertion site, and every
   frozen witness file pinned by sha256 so it stays **byte-identical** — the established
   mechanism is in-memory `exactReplace` substitution by a named successor child
   (`legacy-step-efficacy-carriers.cjs:17-18`), never an edit to the witness file.
7. **`authorizations`**: `owner` = `DECISIONS:60`, `contract` = `DECISIONS:49`, `theme` =
   the PM's line accepting *this* brief, `review` =
   `{cowork, "POSTFIX-ACCEPTANCE <packageId>", ACCEPTED}`. `owner`, `contract` and `theme`
   are `{ledgerLine, role, line, lineSha256}` and carry the **full line text**, whose
   sha256 must be the `lineSha256` they name. Every run verifies `owner` and `contract`
   as exact line bytes in `rebuild/DECISIONS.md` at the parent's receipt base, under their
   own roles and with content mentions, and requires `contract.lineSha256` to equal the
   parent artifact's own contract line (`INHERITED-CONTRACT-AUTHORIZATION`). `theme` stays
   `null` until the brief is accepted, and the runner refuses PASS while it is null
   (`THEME-AUTHORIZATION-UNAVAILABLE`); on an ACCEPTED envelope all four are re-verified
   at the package's own receipt base.

   **`theme` is held to exactly the same standard as `owner` and `contract` on every run,
   not only inside an ACCEPTED envelope.** When it is non-null the runner finds its exact
   line bytes in `rebuild/DECISIONS.md` **in Git at the parent's receipt base**, under role
   `cowork`, mentioning this package id. An invented line — self-consistent, naming the
   package, ending ` · ACCEPTED`, and standing in no ledger — refuses the run; it does not
   quietly close an obligation. When it is `null` the obligation simply stays open. There
   is no third outcome, and a `theme` declared with no sealed parent to anchor it at
   refuses (`THEME-AUTHORIZATION-UNVERIFIABLE`) rather than counting.
8. **`children`**: `{name, argv, needle}` per package child. `name` is
   `[a-z0-9][a-z0-9-]{1,39}` and unique; `needle` is a single-line verdict of at least 8
   non-blank characters.

   **`argv` is an allow-list, not a deny-list.** The only flags a child may pass are the
   two the accepted originals ever pass — `--test` and `--test-reporter=tap`
   (`load-write-package.cjs`, `native-carriers-package.cjs`) — and they may stand only
   *before* the file. Then the **first non-flag token must be an existing repo-relative
   file** under `rebuild/m4/spec/`, `rebuild/conform/v4/postfix/`, `rebuild/engine/test/`,
   `rebuild/m4/workout/test/` or `rebuild/m3/w7-preview/test/`, and every token after it
   must be another such file. Consequences, each with its own refusal:
   * every inline-code form refuses, in both its bare and its `=<code>` spelling —
     `-e`, `--eval`, `--eval=`, `-p`, `--print`, `--print=`, `--input-type`,
     `--input-type=`, `-r`, `--require`, `--require=`, `--import`, `--import=`,
     `--loader`, `--experimental-loader` (`CHILD-ARGV-INLINE-CODE`);
   * every form that makes node print and exit without running the file refuses —
     any token beginning `--version`, `-v`, `--help`, `-h`
     (`CHILD-ARGV-SHORT-CIRCUITS-EXECUTION`);
   * `-` and `--` refuse, so a child can never be fed on stdin
     (`CHILD-ARGV-STDIN-OR-END-OF-OPTIONS`);
   * a flag standing **after** the file refuses, so `node pinned.cjs --version` is
     rejected as surely as `node --version pinned.cjs` (`CHILD-ARGV-FLAG-AFTER-FILE`);
   * an argv with no file at all refuses (`CHILD-ARGV-EXECUTES-NO-FILE`).

   **And the child must have really executed.** Exit 0 with the needle somewhere in stdout
   is not enough. The needle must stand at the **head of its own line**
   (`CHILD-NEEDLE-NOT-A-TERMINAL-LINE`) — a needle buried inside a longer sentence, or
   inside a negation, does not count — and stdout must be **at least 200 bytes**, or else
   carry one of the original gates' own terminal lines (`LEGACY <gate> PASS | …`, the line
   `run.cjs`'s `gateRun` emits), or the run refuses
   (`CHILD-DID-NOT-REALLY-EXECUTE`). `node --version` exits 0 and prints eight characters
   at line start; it is the case this floor exists to refuse.

   Empty until authored — an open obligation, and then no gate can be covered at all.
9. **`artifact`** is `{file, review}` and must equal the paths the **package id** implies
   (`rebuild/m4/spec/acceptance-<packageId minus M2- lowercased>.json` and
   `review-…json`). Those two are the only paths exempt from `UNLISTED-SOURCE-CHANGE`, and
   the exemption is computed in the runner — a spec cannot nominate its own.

## The chain rule (single parent, immutable)

A closed cumulative profile binds **one** immediately preceding **accepted** artifact as
its immutable parent. Two packages cannot claim the same parent — the chain has one head
(`PLAN-TRACK-B-PACKAGES-v1.md:146`). The chain on disk today is

```
acceptance-import-guards.json -> acceptance-step-efficacy.json ff164b86...
  -> acceptance-load-writes.json 5073977b...   (receipt DECISIONS:86)
  -> acceptance-native-carriers.json 295762f0... (receipt DECISIONS:96)  <- head
```

`PLAN §2` and `DECISIONS:94` say "B2 ∥ B1"; `PLAN §4.3` proposes B2 -> B1. Those are
incompatible for the artifact chain, so **B1.json and B2.json each carry both options with
`decided: false`, and the PM names one.** The runner:

* verifies **every** sealed option (artifact bytes by sha256 on disk **and in Git at the
  commit that option's own receipt names as reviewed**, that commit an ancestor of HEAD,
  review `ACCEPTED`, the receipt line by its own sha256 at its base, the line naming this
  artifact and hash and ending ` ACCEPTED`) and prints one line per option;
* **re-asserts every parent pin and every un-superseded grandparent pin at run time** —
  the parent's `product` ∪ `executionPins` (the product half through the inventory above),
  then the grandparent artifact's own bytes, its ACCEPTED envelope and receipt, and its
  `product` ∪ `executionPins` minus everything the parent superseded. This is
  `native-carriers-profile.cjs`'s "Every parent pin still holds", which a three-tree diff
  since `sourceBase` cannot substitute for. Each pin is resolved the way the original
  resolves it: a file **this package supersedes** must still carry the parent's pinned
  bytes **in Git at `sourceBase`** (`native-carriers-profile.cjs:96`, "Parent product
  preserved at sourceBase"), and a file it does not supersede must be byte-identical **on
  disk and in Git at HEAD**. The second half matters because 28 of the 31 parent pins and
  all 23 grandparent pins live under `rebuild/m4/spec`, `rebuild/m3` and `.github`, which
  the 18-path `git status` check does not reach;
* prints `PARENT UNDECIDED` and records an open obligation while `chosen` is null — and,
  when exactly one option is sealed on disk, uses it **provisionally** for the pins,
  inventory and inherited-coverage checks while recording that it is not a claim on the
  chain. When no option is sealed (B3, B4 today) those three checks are impossible and
  each is recorded as its own open obligation instead of being skipped silently;
* once `chosen` is set, scans every other spec in `packages/` and **fails** if another
  package already claims that artifact (control C1);
* walks the chain to the artifact that still carries the audit `baseline` (the closed
  cumulative profiles do not; `acceptance-step-efficacy.json` does) for the historical
  audit snapshot.

Product merges may still be parallel. The **artifact chain** and the shared
`witnesses-1` carrier are what serialize (B1 §5.3, B2 §4/§7 Q4).

## Cloud vs the owner's PC

**Cloud / CI, both OS — `--ci` (public evidence only):** spec bytes and closed schema, with
the runner's own sha256; parent-chain verification and the parent/grandparent pin
re-assertion; product pre/post/carried state against the parent's product map; fidelity
(sourceBase ancestry, no unlisted engine/conform/m4-spec/lane-b-tooling change, the runner
and spec pins, PIN_PATHS Git-vs-disk); the owner and contract ledger lines as exact bytes;
the 45 register laws red-first with the pinned public reference bundles; the declared
witness-flip accounting; **every declared package child, executed**; the coverage map,
which counts only gates whose covering child just ran. Exit 0 with
`PUBLIC CI EVIDENCE PASS` only when every non-envelope obligation is closed; otherwise
`CI REVIEW-PENDING`, exit 2, **no PASS word**.

`PUBLIC CI EVIDENCE PASS` is the **only** PASS word `--ci` can ever print, it is qualified
in its own sentence (*"public evidence only, NOT the package verdict"*), and it carries no
artifact and no receipt. The claim "no PASS word without an ACCEPTED envelope" is about
`POSTFIX PACKAGE PASS`, which `--ci` cannot reach at all. This is parity with
`load-write-package.cjs`; it is stated here because r2 was right that the runner's own
header overclaimed it.

**Owner's PC only — `--full`:** everything `--ci` does, then the private-oracle
requirement, the historical 45-law audit against the pinned baseline snapshot, and the 19
original gates through `run.cjs`'s own `gateRun` (second gate included). Anything reaching
`rebuild/conform/private/live.json` is PC-only (`run.cjs:115-117`; `DECISIONS:92`, `:93`
C4). **Reporting is verdict-only: no private values, counts, hashes or prose.** The
private blob is never opened — only its existence is tested.

**Without the private fixture** (every cloud session, and every builder/reviewer run per
the standing rule at `DECISIONS:97`) `--full` prints exactly

```
B PACKAGE <id> BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING
```

and exits 2. The check is done up front so it costs seconds instead of the whole gate
matrix; `gateRun` still enforces it independently inside `migrate-full`.

## Receipt -> authorized rerun (mirrors DECISIONS:86-87)

1. **Brief** accepted by the PM as a ledger line; its sha256 goes into `brief` and the
   line into `authorizations.theme`.
2. **Implement**, then **seal** the artifact in `rebuild/m4/spec/` — the exact object
   described under *What the sealed artifact contains*, carrying `spec.sha256`,
   `runner.sha256`, the product map and the execution pins — with
   `review-<pkg>.json` = `{version: 1, status: "PENDING", receipt: null}`. From that point
   the spec and the runner are frozen: any edit to either voids the artifact.
3. **PENDING FULL run on the PC.** Complete evidence, no PASS word,
   `POSTFIX PACKAGE REVIEW-PENDING`, **exit 2**. Hand the PM the verdict file.
4. **PM receipt.** One `rebuild/DECISIONS.md` line naming the exact reviewed commit, the
   artifact path and the full 64-hex artifact hash, terminal ` ACCEPTED`:
   `- <date> · cowork · POSTFIX-ACCEPTANCE <packageId> <40-hex commit> rebuild/m4/spec/acceptance-<pkg>.json <64-hex> ACCEPTED`
5. **Incorporate that docs-only receipt base**, set `review-<pkg>.json` to
   `{status: "ACCEPTED", receipt: {commit, path, line, lineSha256}}` — only operational
   coordinates change, never the artifact bytes.
6. **AUTHORIZED FULL rerun** on the PC: `POSTFIX PACKAGE PASS <packageId>`, **exit 0**.
   The runner re-verifies the receipt line at its commit under role `cowork`, the owner and
   theme lines at the same base under their own roles, the reviewed artifact bytes from
   Git, and ancestry (`reviewed commit` and `sourceBase` ancestors of HEAD; `receipt base`
   an ancestor of freshly fetched `origin/rebuild/t2-client-core`).

Never reseal an accepted artifact. If the artifact bytes change, the receipt is void and
step 3 starts again (that is exactly what happened to NATIVE-CARRIERS at
`DECISIONS:95` -> `:96`).

## Fail-closed controls (executed; see TOOLING-REPORT.md)

| control | outcome |
|---|---|
| two packages claim one parent artifact | FAIL exit 1 |
| a product byte is neither the declared pre nor post image | FAIL exit 1 |
| a declared pre-image is not the parent artifact's pin | FAIL exit 1 |
| a parent-pinned product file is dropped from the inventory | FAIL exit 1 |
| a parent or grandparent pin no longer holds on disk | FAIL exit 1 |
| a declared law id is not the live executed law id | FAIL exit 1 |
| spec bytes are not canonical JSON | FAIL exit 1 |
| an unlisted engine/conform/m4-spec/lane-b-tooling change since `sourceBase` | FAIL exit 1 |
| `b-package.cjs` differs from the sha256 the reviewed spec pins | FAIL exit 1 |
| `b-package.cjs` on disk differs from its own bytes in Git at HEAD | FAIL exit 1 |
| the spec or the runner differs from the sealed artifact's pins | FAIL exit 1 |
| the sealed artifact is not what the spec and the bytes recompute to | FAIL exit 1 |
| a covered gate names a child that is not declared | FAIL exit 1 |
| a covered gate's child did not execute in this run | FAIL exit 1 |
| the inherited map is not the parent artifact's `byChild` map, gate **and** child | FAIL exit 1 |
| an inherited child does not execute a file the parent artifact pins | FAIL exit 1 |
| a move carries no stated reason | FAIL exit 1 |
| a move's child does not execute the gate's own original executable, or a file requiring it | FAIL exit 1 |
| a move's child carries more gates than `run.cjs` groups on one executable | FAIL exit 1 |
| the covered set is larger than parent `byChild` + declared moves | FAIL exit 1 |
| a declared child has an empty needle, or argv that executes no file | FAIL exit 1 |
| a child's argv carries any flag but `--test` / `--test-reporter=tap` | FAIL exit 1 |
| a child's argv carries inline code, a short-circuit flag, stdin, or a flag after the file | FAIL exit 1 |
| a child's needle is not at the head of a line of its stdout | FAIL exit 1 |
| a child's stdout is under 200 bytes with no original gate terminal line | FAIL exit 1 |
| an owner/contract/theme line is not exact bytes in the ledger at its base | FAIL exit 1 |
| a declared brief acceptance is not exact bytes in the ledger at its base | FAIL exit 1 |
| a theme or brief acceptance is declared with no sealed parent to anchor it at | FAIL exit 1 |
| a parent-superseded pin no longer holds in Git at `sourceBase` | FAIL exit 1 |
| an un-superseded parent/grandparent pin disagrees between Git at HEAD and disk | FAIL exit 1 |
| the contract line is not the parent artifact's contract line | FAIL exit 1 |
| PIN_PATHS disagree between Git and disk | FAIL exit 1 |
| an ACCEPTED envelope with no bound theme line | FAIL exit 1 |
| the artifact, review or receipt changes between the first and last evaluation | FAIL exit 1 |
| the private fixture is absent under `--full` | BLOCKED exit 2 |
| evidence complete but acceptance PENDING | REVIEW-PENDING exit 2, no PASS word |

The envelope is evaluated twice: once before the evidence, only to choose the header word
and hand `fidelity()` the sealed pins, and once **after every gate**, which is the
evaluation that decides the terminal word and the exit code. The two must agree on the
artifact hash, the reviewed commit and the receipt base, or the run refuses.

## The STATUS line lane B posts, per stage

One line per event, appended to `rebuild/lanes/STATUS.md`, in the format
`rebuild/lanes/LANES.md` fixes: `YYYY-MM-DD HH:MM ET · lane · <event> · <branch @ sha> · <next>`
with events `BRIEF-READY`, `PR-READY`, `BLOCKED`, `MERGED` (PM only). Lane B's per-stage
wording:

```
2026-09-11 14:05 ET · lane B · BRIEF-READY · rebuild/lane-b-b1 @ <sha> · B1 brief v1.1 (sha256 <64-hex>) awaits the PM ledger line; parent chain undecided
2026-09-11 18:40 ET · lane B · PR-READY · rebuild/lane-b-b1 @ <sha> · B1 implemented; --ci PUBLIC CI EVIDENCE PASS both OS; review rebuild/lanes/b/B1-REVIEW.md; next the PC PENDING --full
2026-09-11 21:10 ET · lane B · BLOCKED · rebuild/lane-b-b1 @ <sha> · --full BLOCKED REQUIRED-PRIVATE-PREPARATION-MISSING (private fixture, owner's PC only); who: lane B on the PC
2026-09-12 02:15 ET · lane B · PR-READY · rebuild/lane-b-b1 @ <sha> · B1 PENDING --full complete on the PC: POSTFIX PACKAGE REVIEW-PENDING exit 2, 10/10 D-ids GREEN-candidate / RED-frozen, 19/19 gates OBSERVED incl. the private oracle (verdict-only); verdict rebuild/lanes/b/B1-VERDICT.md; next the PM receipt for rebuild/m4/spec/acceptance-b1-grading-time-window.json <64-hex>
2026-09-12 09:30 ET · lane B · PR-READY · rebuild/lane-b-b1 @ <sha> · B1 AUTHORIZED --full on the PC: POSTFIX PACKAGE PASS M2-B1-GRADING-TIME-WINDOW exit 0; next the PM merges
```

Rules the wording obeys: the branch and sha are always present; a verdict line names the
artifact path and full 64-hex hash; a BLOCKED line names what and who; no PASS word
appears before an authorized envelope; no private value, count, hash or prose ever appears.
`MERGED` is the PM's line, never lane B's.

## Files

```
rebuild/lanes/b/tooling/
  b-package.cjs        the generic runner (2 modes, 4 packages)
  README.md            this file
  TOOLING-REPORT.md    the executed proof that the runner runs
  packages/B1.json     PROPOSED, from BRIEF-B1-GRADING-TIME-WINDOW-v1.1.md
  packages/B2.json     PROPOSED, from BRIEF-B2-TARGETS-IDENTITY-ERA-v1.1.md
  packages/B3.json     SKELETON, from PLAN-TRACK-B-PACKAGES-v1.md §B3
  packages/B4.json     SKELETON, from PLAN-TRACK-B-PACKAGES-v1.md §B4
```

Logs are written under `.tmp/b-package/<id>/` (local only, never forwarded).

All four specs currently declare the **five accepted NATIVE-CARRIERS successor children**
(`source-carriers`, `inherited-carriers`, `defect-witnesses`, `writers-differential`,
`second-gate`) and inherit the nine gates those children cover. That is what makes the
coverage real: the children run in every `--ci` and every `--full`, and the nine gates are
counted only because of those executions. `coverage.moves` is empty in all four — a move
becomes real when the package's own `legacy-b<N>-carriers.cjs` exists, is declared in
`children[]` with its own exact verdict, **and its argv executes the moved gate's own
original executable or a file whose bytes require it**, not before. The emptiness is no
longer what makes the gate matrix safe: the bound is enforced whether `moves` is empty or
not.

**Revision history.**

* `TOOLING-REVIEW-r1.md` (ACCEPT WITH CHANGES) named seven weakenings W1–W7; all seven are
  closed, and `TOOLING-REPORT.md` §"post-review r1" carries the executed proof for each.
* `TOOLING-REVIEW-r2.md` (ACCEPT WITH CHANGES) closed W1, W4–W7, found W2/W3 closed only
  for the cases r1 named, and recorded five new weakenings N1–N5: an unbounded
  `coverage.moves`, an anchored-exact `NO_INLINE` that missed `--eval=`, a needle any
  short-circuiting child could satisfy, and a brief acceptance and a theme line that
  cleared obligations by declaration. All five are closed in this revision, together with
  the r2 residual R1 (the runner is now bound in Git at HEAD, not only on disk) and R3
  (superseded pins re-read from Git at `sourceBase`, un-superseded ones from Git at HEAD).
  `TOOLING-REPORT.md` §"post-review r2" carries the executed proof, including the r2
  reviewer's own bite list re-run against the fixed runner.
