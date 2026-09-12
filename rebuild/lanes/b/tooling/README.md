# LANE B — closed-package tooling for B-NTC, B-LOM and B1..B4

Reusable machinery so each engine-fix package does **not** re-invent the closed-package
mechanism. Lane-B-owned (`rebuild/lanes/LANES.md`: lane B owns `rebuild/lanes/b/*`).

```
node rebuild/lanes/b/tooling/b-package.cjs --ci  --package B-NTC
node rebuild/lanes/b/tooling/b-package.cjs --full --package B1
```

Two modes, **no third**. Anything else refuses in one line with exit 1
(`B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B-NTC|B-LOM|H3|B1|B2|B3|B4`).

The id list is **case-exact and closed in the runner** — `b-ntc` refuses exactly as `B5`
does. `H3` is the newest member: `DECISIONS:124` rules `M2-H3-CLEAN-INIT` a package of its
own, child of `M2-B-NTC`, in the order `B-NTC → H3 → B1 → B2 → B4 → B3`. Its spec is a
SKELETON that declares no D-id, so every run of it refuses at
`REGISTER-D-ID-INVENTORY-EMPTY-AND-NOT-EXEMPT`, exit 1, until its own author fills it in.
Widening it is a reviewed change to `b-package.cjs`; a spec can never nominate its
own id, and the id on the command line must be the one the spec's `packageId` names
(`M2-<ID>-…`), so a spec filed as `B1.json` cannot claim B2's artifact path.

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

**`PIN_PATHS`: 16 of 18, and the line says so (`TOOLING-REVIEW-r4` Y4, r3's residual R4).**
The whole 18-path inventory is handed to `git status`, so a path that appears later is
checked the day it appears — but two of them, `rebuild/conform/goldens` and
`rebuild/conform/manifest.json`, **do not exist in this tree**, and the old sentence
"18 PIN_PATHS byte-identical Git vs disk" therefore overstated by two. It now reads
`16 of 18 PIN_PATHS present in this tree and byte-identical Git vs disk; 2 not in this tree
and therefore vacuous (…)`, naming them. Note also what the inventory does **not** cover:
`rebuild/m4/spec` is not among the 18, so a dirty worktree there is caught only by the
artifact/review byte pins and by `L.checkSources` at the seal — which is why the
chain-branch reads in the parent check are load-bearing rather than decorative.

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
parent {id, artifact, sha256, review, reviewSha256, receiptLedgerLine, reviewedCommit},
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
   **in Git on the chain branch `refs/remotes/origin/rebuild/t2-client-core`
   (`CHAIN_REF`)** before the obligation closes — not at the parent's receipt base.
   The brief acceptance and the theme are THIS package's own lines: they are written
   after the parent was sealed, so at the parent's receipt base they can never be found
   and the obligation could never close. `owner` and `contract` stay at the parent's
   receipt base, where they always were. The anchor is a Git REF, never `HEAD` and never
   a spec's word: a line a lane writes into its own branch's `DECISIONS.md` is not on the
   chain and refuses (`b-package.cjs:911-916`). At the seal all four — owner, contract,
   theme and brief acceptance — are re-resolved at the **package's own receipt base**,
   which `envelope()` additionally asserts is an ancestor of `CHAIN_REF`
   (`b-package.cjs:1313-1328`), so the seal is no weaker than it was and this path is
   never stronger than the seal. A declared
   acceptance that is not in the ledger refuses the run; a `null` one simply leaves the
   obligation open. The open-obligation count is therefore evidence again: neither the
   brief nor the theme can be struck off it by declaration. The implication runs **both
   ways** since r3 X4: `status: "BRIEF-ACCEPTED"` with `acceptedLedgerLine: null` refuses
   (`BRIEF-ACCEPTED-WITHOUT-A-CITED-LEDGER-LINE`). It cleared nothing before, but a verdict
   file must not carry a word its own evidence denies.
2. **`dIds`** in package order; **`laws`** maps each D-id to its law id. The runner
   cross-checks every law id against the **executed** live inventory, not a table — a
   renamed or mistyped law id fails the run (control C3). `dIds` must be **non-empty** for
   a repair package; the only ids allowed an empty inventory are the ones the runner itself
   lists in `NO_REGISTER_IDS` (`B-NTC`, `B-LOM`), because `DECISIONS:93` rules that feature
   work under the ratified slice plan takes no register D-ID. Like every exemption, that
   list lives in `b-package.cjs` and nowhere else.

   **`TOOLING-REVIEW-r4` Y1 — a no-register package owes its OWN executed children.
   STANDING, beside X1 and X2 (`DECISIONS:108 (d)`).** For B1–B4 the substantive force of
   this runner is the 45-law accounting: a declared D-id reads `RED-frozen /
   GREEN-candidate` only because the repair is really in the engine. A package with an
   empty `dIds` inventory is owed **nothing** by that accounting — `want(d)` is `RED` for
   every un-carried id and `GREEN` for the six carried ones whether the package is empty or
   finished, so `LAWS DECLARED-STATE 45/45 rows agree` would have printed on the day
   `POSTFIX PACKAGE PASS` was claimed for a package none of whose own code had run (r4
   §5.1). In its place the runner requires the package's **own** children:

   * at least `MIN_OWN_CHILDREN` (**1**) declared `children[]` entries whose `argv`
     executes a file **this spec declares in `product` with role `new`** — its own new
     code, not the parent's successor cells;
   * each of them subject to the rule every child is already subject to: it runs **in this
     process**, exits 0, and prints its **exact declared needle at line start**
     (`CHILD-NEEDLE-NOT-A-TERMINAL-LINE`).

   Both numbers and the role vocabulary are fixed in `b-package.cjs` (W7), so a spec can no
   more declare its way past the replacement than it can grant itself the exemption. The
   runner prints `NO-REGISTER OBLIGATION <id> … n of m …` on every run and carries an
   **open obligation** while `n < MIN_OWN_CHILDREN`; at the seal it **refuses**
   (`NO-REGISTER-PACKAGE-SEALED-WITHOUT-EXECUTING-ITS-OWN-PRODUCT`), and the end-of-run
   re-evaluation re-takes the execution half against the map the run actually produced
   (`NO-REGISTER-PACKAGE-OWN-CHILD-DID-NOT-EXECUTE`). It lives at the seal and not in
   `spec()` for a reason: before the carrier lands the target file does not exist and
   `CHILD-ARGV-TARGET` refuses the declaration, so an earlier gate would block the lane
   instead of the forgery. **B-NTC and B-LOM cannot be sealed today** — both report
   `0 of 0` — and that is the intended state until each has a cell of its own that runs.
   `LAWS DECLARED-STATE` says so in its own sentence for these two ids rather than
   reporting the register baseline as agreement about the package.
3. **`product`** maps each file to `{pre, post, role}` and must list **every file the
   parent artifact pins in its own `product` map** — the repair files with role `edited`
   (or `new`), the rest with role `carried` (`pre === post`, byte-identical on disk).
   `pre` must **be** the parent's pin, not a self-declared value; `post` stays `null`
   until the repair exists. The runner hashes the bytes on disk and reports
   `NOT-IMPLEMENTED` / `PARTIAL` / `IMPLEMENTED` over the non-carried files. A byte that
   is neither `pre` nor `post`, a pre-image that is not the parent's pin, and a
   parent-pinned file **missing from the inventory** are all `UNLISTED-PRODUCT-DRIFT`
   and fail (controls C2, C6, C7).

   A file the parent never pinned must carry role `new` — *new to the pinned inventory*,
   which is not the same as "does not exist". Where it genuinely does not exist yet
   (`post: null`, absent on disk), its `pre` is the sha256 of the empty byte string,
   `e3b0c442…`, and the runner counts it at the pre-image without reading anything. Where
   it exists, `pre` is its real bytes at `sourceBase`. `B-NTC.json` uses both forms.

   **The fourth role, `superseded-by-child` (`TOOLING-REVIEW-r4` Y1 / r4 §5.4).** A parent
   pins files in two places: `product` and `executionPins`. `DECISIONS:109` rules that a
   child package **supersedes its parent's execution pins** inside its own seal — "exactly
   as NATIVE-CARRIERS superseded LOAD-WRITES" — and puts B-NTC's `rebuild.yml` enumeration
   and the retirement of the `# pass 19` child inside that seal. Before r4 the only role
   that admitted such a file was `new`, which is **false of a file the parent pins**, and
   it carried no pre-image equality at all: the `pin.pre === parent pin` check that binds a
   parent **product** pre-image simply did not reach it. The role now says what is true and
   the runner enforces it in both directions:

   * a file pinned in the parent's `executionPins` and declared in `product` **must** carry
     role `superseded-by-child` (`PARENT-EXECUTION-PIN-NOT-DECLARED-SUPERSEDED`) and its
     `pre` **must be that execution pin's byte** (`UNLISTED-PRODUCT-DRIFT pre-image is not
     the parent execution pin`);
   * a file pinned in the parent's `product` map may **not** carry it
     (`PRODUCT-ROLE-MISLABELLED`), nor may a file the parent pins nowhere
     (`SUPERSEDED-BY-CHILD-IS-NOT-A-PARENT-PIN`).

   `pins()` already preserves such a file the way the accepted original does — its parent
   byte must still stand **in Git at `sourceBase`** — so nothing is lost by declaring it,
   and the `PRODUCT` line now names the superseded files rather than hiding them among the
   new ones. `B-NTC.json` declares `.github/workflows/rebuild.yml` this way; any further
   parent execution pin B-NTC re-pins (`DECISIONS:109` also names `engine-runtime.cjs` and
   the EXPOSED set) is declared the same way at seal time.
4. **`parent`** carries `decided`, `chosen` and every documented `options` entry, each
   `{id, artifact, sha256, review, reviewSha256, receiptLedgerLine, note}`. An unsealed
   option carries `sha256: null` **and** `reviewSha256: null`. See the chain rule below.
5. **`coverage`** is `{inherited, moves}`, and **both halves are bounded** — the covered
   set is not something a spec can grow.

   **`coverage.inherited` must be the parent artifact's own `coverage.byChild` map
   byte-for-byte** — the gate ids *and* the child each one maps to
   (`INHERITED-COVERAGE-IS-NOT-THE-PARENT-COVERED-SET`). Re-pointing the parent's nine at
   a child of the spec's own choosing is refused, and every inherited child must execute a
   file the **parent artifact itself pins**
   (`INHERITED-COVERAGE-CHILD-IS-NOT-A-PARENT-PINNED-EXECUTABLE`).

   **`coverage.moves` must be `{}`.** `TOOLING-REVIEW-r3` X1 is blocking: the runner
   refuses any non-empty `moves` while its `MOVES_RULING` constant is `null`, in `spec()`
   and again at the seal in `envelope()`
   (`COVERAGE-MOVES-REFUSED-WITHOUT-A-PM-RULING`). `MOVES_RULING` is the PM ruling that
   would admit a move; it does not exist, and setting it is a reviewed change to
   `b-package.cjs`, not to a spec.

   **Why a flat refusal and not a tighter bound.** r3's residual **R3-A** is a composite: a
   declared child that never runs a gate's original could still satisfy the old evidence
   rule (a `require` specifier in the covering file's text, plus ≥ 200 bytes of stdout) and
   be reported as `MOVED, carries <original>` — `DECISIONS:97` F-PM-2's defect class reached
   through the move door. Every part of it enters through a non-empty `moves`. With `moves`
   refused the finding has **no reach at all** — not a narrower one, none — and "the sealer
   must re-check this line at seal time" becomes the runner's job instead of a human's.

   The move machinery below is **kept whole** and still checked, so it is reviewable and
   testable; it simply cannot be reached today. When a ruling does land, a move is accepted
   only when all of the following hold:
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
     (`COVERAGE-MOVE-CHILD-IS-AN-INHERITED-CHILD`);
   * **the moving child's own stdout carries that gate's own needle out of `R.GATES`**
     (`COVERAGE-MOVE-CHILD-DID-NOT-EMIT-THE-ORIGINAL-GATE-NEEDLE`), matched with
     `includes()` — the criterion `run.cjs`'s own `gateRun()` applies
     (`if(...||!result.stdout.includes(needle))fail('LEGACY-GATE-'+id)`). This is
     `TOOLING-REVIEW-r3` X3, and it replaces a **text** test with an **output** test: the
     old rule read the covering file's bytes for a `require` specifier, which says nothing
     about whether the specifier is reachable, let alone called. **For a moving child the
     ≥ 200-byte floor is not evidence at all** — r3's N3-05 (a fabricated verdict line
     printed before the `require`) and N3-07 (283 bytes of `z`) both cleared it while the
     original never ran; neither can print the gate's own needle, because only the gate's
     own code prints it. Non-moving children keep the floor: they cover nothing by
     themselves.

     *Correction to r3, recorded because a future reader will hit it:* X3 writes
     `R.GATES[i][2][0]`. That is one **character** of the needle (`"M"` for
     `migrate-source`); the needle is `g[2]`, and `[0]` would have weakened the check to
     almost nothing. The runner uses `g[2]`. r3's "at line start" is also not used: two of
     the nineteen needles stand mid-line in their own gate's output
     (`preserved writer defects;`, `PASS exact sync-laws source`), so a line-start rule
     would refuse gates that really ran.

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
   line bytes in `rebuild/DECISIONS.md` **in Git on the chain branch
   `refs/remotes/origin/rebuild/t2-client-core` (`CHAIN_REF`)**, under role
   `cowork`, mentioning this package id — the same anchor as the brief acceptance and for
   the same reason: both are this package's OWN lines, written after the parent was
   sealed, and neither can ever stand at the parent's receipt base. `owner` and
   `contract` are the two that stay there. An invented line — self-consistent, naming the
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
  -> acceptance-native-carriers.json e940359b... (receipt DECISIONS:104) <- head
```

The head was **re-sealed** by the PM's CI re-seal: `DECISIONS:104` (receipt base `b045e61`,
reviewed at `b95ccca`) supersedes `DECISIONS:96` / `295762f0…` for the same artifact path.
The product map did not change; three `executionPins` did
(`.github/workflows/rebuild.yml`, `NATIVE-CARRIERS-THEME.md`, `NATIVE-CARRIERS-BUILD-REPORT.md`).
Every spec here pins the new bytes. **A stale parent pin no longer passes quietly** — see
the chain-branch check below.

`DECISIONS:103 (1)` then ruled the order: **B-NTC first** (it is the S2 blocker), then B1,
B2, B4, B3, with **B-LOM** behind B-NTC because the legacy order-mapping provider is not the
same seam. So `B-NTC.json` carries `decided: true, chosen: NATIVE-CARRIERS`.
`PLAN §2` and `DECISIONS:94` say "B2 ∥ B1"; `PLAN §4.3` proposes B2 -> B1. Those are
incompatible for the artifact chain, so **B1.json and B2.json each carry both options with
`decided: false`, and the PM names one.** The runner:

* verifies **every** sealed option — artifact bytes by sha256 on disk, **in Git at the
  commit that option's own receipt names as reviewed**, and **on the chain branch itself**;
  that commit an ancestor of HEAD and of the chain branch; review `ACCEPTED`; the receipt
  line by its own sha256 at its base; the line naming this artifact and hash and ending
  ` ACCEPTED` — and prints one line per option;
* **pins the option's review file by its own sha256** (`reviewSha256`) and resolves those
  bytes on the chain branch too, **and requires the receipt base that review names to be an
  ancestor of `refs/remotes/origin/rebuild/t2-client-core`**, a ref read from Git and never
  from the spec. That is `TOOLING-REVIEW-r3` X2, closing R3-B: the parent's review is where
  `receiptBase` comes from, and `receiptBase` is where every ledger obligation is resolved,
  so an unpinned review let a spec choose the ledger anchor. A review file written beside
  this runner and pointed at a local scratch commit now refuses three separate ways;
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
* once `chosen` is set, enforces the single parent **two ways** (`TOOLING-REVIEW-r4` Y2,
  closing r4 §5.2):

  1. **the sibling specs** — every other `packages/*.json`, read **from disk AND from Git
     at HEAD**, and `SINGLE-PARENT-CHAIN` if any of them resolves its own `chosen` to this
     same artifact. The disk half is the original control C1. The Git half is r4's: the
     tooling directory is not one of the `PIN_PATHS`, `fidelity()`'s change scan reads
     commits, and a seal pins only the sealing package's **own** spec bytes — so freeing a
     sibling's `chosen` in an **uncommitted** edit silenced the check entirely (r4's G14).
     Reading the siblings out of the reviewed history closes that: an uncommitted hand
     cannot reach Git at HEAD, and a committed one leaves the edit standing where the
     package's reviewer will diff it.
  2. **the sealed chain** — every `rebuild/m4/spec/acceptance-*.json` that already stands
     **on `refs/remotes/origin/rebuild/t2-client-core`**, read out of Git (never from
     disk, never named by a spec), and `SINGLE-PARENT-CHAIN-SEALED` if one of them names
     this same artifact in its own `parent.artifact`. This is the half that matters,
     because "two packages cannot claim the same parent" is a fact about the **chain**,
     not about whichever specs happen to sit in the worktree at run time, and a sealed
     artifact is the only place that fact is durably written down. Today the branch
     carries two: `acceptance-load-writes.json` (parent `acceptance-step-efficacy.json`)
     and `acceptance-native-carriers.json` (parent `acceptance-load-writes.json`) — so a
     spec naming **LOAD-WRITES** refuses on the real branch with no forgery at all, and
     B-NTC's claim on NATIVE-CARRIERS stands because nothing sealed names it yet;
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
| two packages claim one parent artifact **on disk** | FAIL exit 1 |
| two packages claim one parent artifact **in Git at HEAD**, whatever the disk copies say | FAIL exit 1 |
| a **sealed** `acceptance-*.json` on the chain branch already names this parent | FAIL exit 1 |
| a `NO_REGISTER_IDS` package is sealed with **no** declared child executing its own `role: "new"` product | FAIL exit 1 |
| a `NO_REGISTER_IDS` package is sealed and one of its own children did not execute in this run | FAIL exit 1 |
| a parent **execution** pin is declared in `product` with any role but `superseded-by-child` | FAIL exit 1 |
| a `superseded-by-child` pre-image is not the parent's execution-pin byte | FAIL exit 1 |
| a parent **product** pin, or a file the parent pins nowhere, is declared `superseded-by-child` | FAIL exit 1 |
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
| a **non-moving** child's stdout is under 200 bytes with no original gate terminal line | FAIL exit 1 |
| a **moving** child's stdout does not carry the moved gate's own `R.GATES` needle (the byte floor is not evidence here) | FAIL exit 1 |
| `coverage.moves` is non-empty and no PM ruling is recorded in the runner | FAIL exit 1 |
| a parent option carries no `reviewSha256`, or the review bytes are not the pinned bytes | FAIL exit 1 |
| a parent option's artifact or review bytes do not stand on the chain branch | FAIL exit 1 |
| a parent option's receipt base is not an ancestor of the chain branch | FAIL exit 1 |
| `status: BRIEF-ACCEPTED` with `brief.acceptedLedgerLine: null` | FAIL exit 1 |
| `packageId` is not `M2-<the id on the command line>-…` | FAIL exit 1 |
| `dIds` is empty for an id the runner does not list in `NO_REGISTER_IDS` | FAIL exit 1 |
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
  b-package.cjs        the generic runner (2 modes, 6 packages)
  README.md            this file
  TOOLING-REPORT.md    the executed proof that the runner runs
  TOOLING-FIX-r5-REPORT.md   lane B's r5 fix pass: the two withdrawn commits and Z1-Z11
  TOOLING-FIX-ASTRA-REPORT.md  a builder candidate report; provenance VOID (DECISIONS:112
                       (2)), every claim in it re-measured elsewhere - binds nothing
  test/execution-targets.test.cjs  the executed-target regression (9/9)
  test/successor-moves.test.cjs    the DECISIONS:113 successor regression (8/8)
  packages/B-NTC.json  PROPOSED, from BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md (chain first,
                       DECISIONS:103 (1); parent NATIVE-CARRIERS, decided)
  packages/B-LOM.json  SKELETON, the legacy order-mapping provider; parent = the ACCEPTED
                       B-NTC artifact, TBD
  packages/B1.json     PROPOSED, from BRIEF-B1-GRADING-TIME-WINDOW-v1.1.md
  packages/B2.json     PROPOSED, from BRIEF-B2-TARGETS-IDENTITY-ERA-v1.1.md
  packages/B3.json     SKELETON, from PLAN-TRACK-B-PACKAGES-v1.md §B3
  packages/B4.json     SKELETON, from PLAN-TRACK-B-PACKAGES-v1.md §B4
```

Logs are written under `.tmp/b-package/<id>/` (local only, never forwarded).

**B-NTC** is the package `DECISIONS:103 (1)` ruled first: it turns the accepted open
boundary `PERFORMED_NATIVE_TREND_CONTEXT_REQUIRED` into a qualified provider, and it is the
S2 blocker. Its implementation is speculative and lives on `rebuild/lane-b-ntc @ 68fbca4`;
the spec here is the tooling side, authored so the runner admits the id — lane B's STATUS of
2026-09-11 05:50 ET recorded `--package B-NTC REFUSED (closed id list) -> tooling fixer
widens it`. **B-LOM** is a skeleton only: the legacy order-mapping provider is *not* the same
seam (B-NTC binds `performed.cjs:193`; B-LOM is data-fed at `performed.cjs:176-183`), so it
is its own package behind B-NTC, and every coordinate in it is taken when B-NTC is sealed.

B-NTC and B-LOM declare **no D-id and no law**, which the runner allows *only* because it
names them in its own `NO_REGISTER_IDS` set: `DECISIONS:93` rules that feature work under
the ratified slice plan takes no register D-ID. The exemption is fixed in `b-package.cjs`
like every other one — a repair package can never empty its own inventory.

B-NTC, B1, B2, B3 and B4 declare the **five accepted NATIVE-CARRIERS successor children**
(`source-carriers`, `inherited-carriers`, `defect-witnesses`, `writers-differential`,
`second-gate`) and inherit the nine gates those children cover. That is what makes the
coverage real: the children run in every `--ci` and every `--full`, and the nine gates are
counted only because of those executions. B-LOM declares none — its parent is not sealed,
so there is no `byChild` map to inherit and all nineteen gates re-execute under `--full`.

### Successor carriers — `coverage.successors` and `DECISIONS:113`

A **successor carrier** is a child of this package that carries one of the parent's
inherited gates by *loading the parent carrier's own original body* instead of executing
the parent's file directly. It exists for exactly one reason: `DECISIONS:109` PATH A lets a
child package supersede a parent **execution pin** (B-NTC re-pins
`rebuild/m4/workout/engine-runtime.cjs`), and once that byte moves the parent's own carrier
refuses it by design. The gate is still worth running — against the child's bytes.

`DECISIONS:113 (1)` ratified `MOVES_RULING B-NTC-INHERITED-1` as written in
`B-NTC-REVIEW-r2.md` §E.3, particularising `DECISIONS:112 (1)`. Its five conditions are
what this runner enforces, and the shape it fixes matters: **`coverage.moves` stays `{}`**
(condition a), so X1 is not widened for B-NTC or for anyone; the successors live in
`coverage.inherited`, the map that is already held byte-for-byte to the parent artifact's
own `coverage.byChild`. A successor changes **who executes a gate the parent already
covered**; it never claims a gate the parent did not.

The spec declares them in `coverage.successors` (`null` in five of the six packages):

```json
"successors": {
  "ruling": "MOVES_RULING=DECISIONS:113 B-NTC-INHERITED-1",
  "parentAcceptanceCommit": "b95ccca879e371b5ba225ad12cae612ec89469ba",
  "carriers": { "<parent child name>": { "successor": "<file>", "original": "<file>" } },
  "substitutions": [ { "original": "<file>", "from": "<exact text>", "to": "<exact text>",
                       "why": "<why the re-target is unavoidable>" } ]
}
```

Nothing in that block **admits** anything. `SUCCESSOR_RULING` is a constant in
`b-package.cjs` — `DECISIONS:113 (1) (e)` says in terms that the tooling records the id and
refuses a successor in any package that does not cite it — and `SUCCESSOR_PACKAGES` names
`B-NTC` and nothing else. The admitted gates are **derived** at run time from the parent
artifact's own `coverage.byChild` plus each parent carrier's own source closure: a gate
whose carrier does not reach the superseded support file is not in the set, and nine names
are never typed anywhere. Then, per gate, `successorCoverage()` proves a **relation**, not
an identity:

1. the original is the parent's own byte — equal to the parent artifact's `executionPins`
   entry **and** to the Git blob at the parent's acceptance commit, which is itself
   asserted to be on `CHAIN_REF` and behind `HEAD` (there is no policy `sourceCommit`
   anywhere; a commit a file names is never trusted for provenance);
2. the successor **names** that original and **does not contain it** — none of the
   original's own long lines may stand verbatim in the successor's source closure, so a
   successor that pastes the body instead of loading it refuses;
3. the successor's replacements are exactly the spec's enumerated list: the successor
   states them as one strict-JSON `SUBSTITUTIONS` literal, the runner deep-equals that
   table against the spec's, requires every `from` to stand exactly once in the original
   and `to` not at all, and requires every `replace()` call site in the closure to be
   driven by the table. A retarget silently turned into `assert.ok(true)` is a table entry
   the spec does not carry, and it refuses;
4. the successor's declared verdict is the **parent wrapper's own accepted string in
   full** — `NATIVE SOURCE CARRIERS: 6/6 PASS;`, never the prefix `NATIVE SOURCE CARRIERS:`
   — read out of the pinned `native-carriers-package.cjs` `verdicts` table, never re-typed.

What this does **not** prove is the successor's runtime semantics. It proves the body
compiled is the parent's body, that the differences are exactly the enumerated ones, and
that a reviewer who reads the substitution list in the spec has read all of them. That
residual is real and is recorded in `B-NTC-REVIEW-r2` R12.

`coverage.moves` is `{}` in **all six**, and under X1 it cannot be anything else. What the
runner would verify of a move if a PM ruling admitted one is listed in §5 above: a reason, a
relative `require` specifier naming the gate's own original, one gate per child unless
`run.cjs` groups them, not an inherited child — **and the gate's own needle in the child's
own stdout**. The evidence sentence the runner prints now says exactly that and no more:
`MOVED, declared against <original> and observed emitting that gate's own needle`, never
`MOVED, carries <original>` (`TOOLING-REVIEW-r3` X4).

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
* `TOOLING-REVIEW-r3.md` (ACCEPT WITH CHANGES) found W1–W7 and N1–N5 closed by its own 61
  controls, and required four changes. **X1**: `coverage.moves` must be `{}` at every seal —
  now refused outright behind the absent `MOVES_RULING`, which is what removes residual
  **R3-A** from reach entirely rather than bounding it. **X2**: the parent option's review
  file is byte-pinned (`reviewSha256`) and its receipt base must be an ancestor of the chain
  branch read from Git refs — closing **R3-B**, where a spec could choose the ledger anchor
  and have a verdict file report forged lines as "found in Git". **X3**: a move is proved by
  the original gate's own needle out of `R.GATES` in the moving child's stdout, and the
  byte floor is no longer evidence for a moving child. **X4**: the two overstated sentences
  now say what was verified, and `status: BRIEF-ACCEPTED` implies a cited ledger line.
  The same revision widens the id list to `B-NTC|B-LOM|B1|B2|B3|B4` and re-pins every spec
  at the `DECISIONS:104` re-seal. `TOOLING-REPORT.md` §r3 carries the executed proof.
* `TOOLING-REVIEW-r4.md` (ACCEPT WITH CHANGES) required four: **Y1**, the replacement
  obligation for a package with no D-id — at least `MIN_OWN_CHILDREN` declared child(ren)
  executing one of the package's own `role:"new"` product files, open on every run and
  refusing at the seal, together with the fourth product role `superseded-by-child` for a
  file the parent pins in `executionPins`; **Y2**, the single-parent scan read from Git at
  HEAD as well as disk, plus the durable check against already-sealed artifacts on the
  chain branch; **Y3**, spec-note text; **Y4**, the `PIN_PATHS` sentence counts the paths
  that exist. All four landed at `7748880` and `TOOLING-REVIEW-r5` re-measured each with a
  positive and a negative control.
* `TOOLING-REVIEW-r5.md` (**REJECT** for the two successor commits, `c7b7133` ACCEPT)
  found the successor mechanism bound to a theme `DECISIONS:112 (2)` had declared void,
  unable to express the authority that had actually been granted, holding successors to
  weakened prefix needles, verifying no relation between a successor and the parent's
  original, and regressing B-NTC's own `--ci` from exit 2 to an opaque exit 1. Lane B
  **withdrew both commits by `git revert`** rather than patch them — the history stays
  honest — and re-authored the path in its own name under the ruling that has since been
  made, `DECISIONS:113 (1)`. **Z1** the ruling id is the only admission and is a runner
  constant; the admitted gates are derived from the parent artifact, never a hardcoded
  nine; `coverage.moves` stays `{}` and X1 is unwidened. **Z2** `successorCoverage()`
  proves the relation between successor and original (see the successor section above); a
  copy, a dropped assertion or an unenumerated replacement all refuse. **Z3** the accepted
  verdict is the parent wrapper's own string in full. **Z4** an authority that is merely
  not yet issued is an OPEN obligation, never an assert — B-NTC exits 2 like every other
  package. **Z5** there is no policy `sourceCommit`; pins are taken at HEAD and the
  parent's acceptance commit is anchored on `CHAIN_REF`. **Z6** the catch names the
  refusing assertion from a vocabulary derived from the runner's own source, on stderr,
  never child output and never anything from the private census; the BLOCKED terminal is
  unchanged. **Z7** the spec is pinned in Git at HEAD as the runner is. **Z8**
  `test/execution-targets.test.cjs` builds its own inherited-map fixture and is 9/9 on
  either lane branch. **Z9** the withdrawn Astra suite is gone; lane B's own
  `test/successor-moves.test.cjs` is self-contained (its own temp Git repository, no
  sibling worktree, no second branch) and is 8/8. **Z11** an UNDECIDED parent run now says
  out loud that Y2's single-parent scan did not run. `TOOLING-FIX-r5-REPORT.md` carries the
  executed proof for each.

## TOOLING-REVIEW r7 — what changed, and the two PM rulings that landed with it

- **A fifth product role, `pinned-unchanged`.** r6 change 5 refused `pre === post` for
  `edited` and `superseded-by-child` and exempted `new` outright. r7 F1 measured the cost of
  that exemption on the sealed spec: **7 of B-NTC's 31 `new` files carry `pre === post`** and
  stand at their own `sourceBase` bytes, so 7 of the "33 at the declared post-image" are
  files the package did not write a byte of. The case is real and had no name: a package
  DECLARES a file, PINS it by bytes, a declared child EXECUTES it, and the package changes
  nothing in it. That case is now `pinned-unchanged` — `pre === post`, both real, the file
  NOT parent-pinned (a parent-pinned unchanged file is `carried`), and a declared child's
  argv must name it or reach it through a relative require (`executedClosure`, read never
  executed, bounded at 512 files and the bound is reported rather than silent). It is
  counted in its OWN bucket and never among "at the declared post-image", because this
  package produced none of it. With the name available, role `new` means what it says:
  `pre === null` (the file did not exist) or `pre !== post` (this package moved it).
  **The one exception, bounded in one direction only:** a spec whose artifact is ALREADY
  SEALED, and whose sealed artifact carries that same file with that same role and those
  same two shas, keeps its declaration — refusing retroactively would make an accepted
  package unrunnable without improving the run that sealed it. The grandfathered files are
  NAMED on every run (`PRODUCT DECLARED-UNCHANGED-UNDER-ROLE-NEW …`) and carry a
  non-blocking OPEN obligation to re-declare at the next seal. An UNSEALED spec refuses:
  `PRODUCT-CHANGE-ROLE-DECLARES-NO-CHANGE`.
- **A ruled substitution is one the ruling's own DESCRIPTION names and quotes.** r6's branch
  (B) asked whether the last hyphen segment of the substituted module's basename stood
  anywhere in the `DECISIONS:113` line; measured, that admits one substitution each over
  **8 of the 17** `native-carriers-*.cjs` parent originals. The ruling describes **two**.
  `ruledDescriptions()` now parses the ruling's own enumeration — `(two at <commit>: <desc>
  and <desc>)` — and `describes()` requires (1) the module's distinguishing token to stand in
  THAT DESCRIPTION, not merely somewhere in a paragraph of prose, and (2) at least one other
  word of the description to stand in the substitution's own text and in no repository path
  — the word that says WHAT changed rather than WHERE. Descriptions are CONSUMED, so the
  ruling's count is the ceiling. Both of B-NTC's real non-re-target substitutions are still
  admitted and are re-measured in the suite.
- **The ruling is found by its own sha256, not by a line number.** r6 read line 113 of
  `rebuild/DECISIONS.md` on `CHAIN_REF`, which made every successor run a hard runtime
  coupling to a ledger line number. The spec now records `coverage.successors
  .rulingLineSha256`, the runner SEARCHES the chain branch's `DECISIONS.md` for the one line
  that hashes to it, and requires that line to carry `B-NTC-INHERITED-1`. A PM renumber moves
  nothing. The two halves a spec cannot forge — the BYTES and the ID — are the two r6 already
  required; only the way the line is LOCATED changed.
- **Named refusals for everything that printed a bare `FAIL`.** Every
  `merge-base --is-ancestor` now goes through one `ancestor(commit, of, code)` helper, so
  X2's chain-ancestry refusal says which ancestry it was; the theme-shape assert, the two
  coverage-map shape asserts and the successor-block key shape have their own names; and the
  FAIL_CODES harvest admits a name followed by a COLON, which is why six of this file's own
  names (`SEALED-PROFILE-RECOMPUTATION`, `SINGLE-PARENT-CHAIN`, `SINGLE-PARENT-CHAIN-SEALED`,
  `BRIEF-ACCEPTED-WITHOUT-A-CITED-LEDGER-LINE`, `THEME-AUTHORIZATION-UNVERIFIABLE`,
  `BRIEF-ACCEPTANCE-UNVERIFIABLE`) printed nothing before, for no reason but punctuation.
- **`IDS` carries the ruled order** — `B-NTC, H3, B1, B2, B4, B3` is `DECISIONS:124`'s
  sequence exactly, and `B-LOM` stands after it because no ruling puts it inside.
- **`NO_REGISTER_IDS` gains `H3`, under a rule that is written down and asserted.** EVERY
  H-/F- item is an ENGINE-TIER register item carrying no D-id (`DECISIONS:93` — feature work
  under the ratified slice plan takes no register D-ID); a B- package is exempt only where
  the PM ruled it so BY NAME (`DECISIONS:103 (1)` for B-NTC and B-LOM). `DECISIONS:124` makes
  `M2-H3-CLEAN-INIT` an engine-tier item beside H1/H2, so H3 enters under the H- half of the
  rule and not by anybody's discretion. What H3 owes instead is Y1's replacement obligation.

### `DECISIONS:135 (4)` — SEAL ON THE TIP, enforced

The ACCEPTED branch of `envelope()` — the same place X1 and Y1 are re-asserted — refuses
unless the chain branch's CURRENT tip stands in HEAD's own **first-parent chain**. Ancestry
is the weaker question and would admit a branch that merged the chain a week ago; the
first-parent chain says the lane head is BUILT ON the tip, which is the mechanic `:135`'s own
timeline names ("rebase + final round + seal each, on the tip"). **Operational consequence,
said out loud: `git merge --no-ff <tip>` run FROM THE LANE puts the tip on the SECOND parent
and does NOT satisfy this.** What does: rebasing onto the tip, branching afresh from it, or
fast-forwarding. The escape is the PM's alone — a FREEZE line in `rebuild/DECISIONS.md`
cited in `authorizations.freeze` (the one OPTIONAL authorization key) and matched the way
every other citation is matched, by the LINE'S OWN SHA256 found on the chain branch. The
line must say FREEZE, name this package, and name a commit that IS in this HEAD's
first-parent chain. Codes: `SEAL-BASE-IS-NOT-THE-CHAIN-TIP`,
`SEAL-FREEZE-LINE-NOT-ON-THE-CHAIN-BRANCH`, `SEAL-FREEZE-LINE-DOES-NOT-FREEZE-THIS-PACKAGE`,
`SEAL-FREEZE-LINE-DOES-NOT-NAME-A-BASE-IN-THIS-FIRST-PARENT-CHAIN`, `SEAL-FREEZE-LINE-SHAPE`.

### `DECISIONS:136 (3)` — the AUTHORIZED STEP is a byte-identity re-verify

The owner's amendment to the `:88`/`:103 (5)` rerun step. The FULL run that reaches
`POSTFIX PACKAGE PASS` — **the seal step** — writes `receipts/<ID>.json`: the artifact, spec
and runner sha256, the ACCEPTED envelope key, the verdict file coordinate, and every pinned
product file's bytes. That file is the only byte this runner writes outside `.tmp`, it lives
inside `fidelity()`'s own change check, and it is a RECEIPT and not evidence — it can only
ever cause the expensive matrix to be SKIPPED, never cause a PASS the `--ci` evidence, the
pins, the ledger and the ACCEPTED envelope have not already earned on that very run.

On a later `--full` with an ACCEPTED envelope, `sealedRunReceipt()` re-takes all of it from
disk. Identical → the private oracle, the historical audit and the 19 original gates are not
re-run, everything else is exactly the `--ci` path plus pin verification plus the receipt
check, and the terminal is `POSTFIX PACKAGE PASS` as before. **Any byte change voids the
receipt** (`SEALED-RUN-RECEIPT-VOID`, naming what moved) and the FULL run happens exactly as
today; so does a missing receipt (`SEALED-RUN-RECEIPT-ABSENT`) — which is what makes the
FIRST full run with the private census unchanged. `:136 (3)`'s "the verdict file names the
sealed run's evidence hashes" is checked literally: `rebuild/lanes/b/VERDICT-<ID>.md` (a
runner-derived coordinate, never a spec's word) must NAME the three hashes, or
`SEALED-RUN-VERDICT-DOES-NOT-NAME-THE-EVIDENCE-HASHES`.

### `DECISIONS:135 (3)` — the shared builder preflight

`rebuild/lanes/tooling/preflight.cjs` — **not** under `lanes/b/`, because every lane runs it;
plumbing tier, deciding nothing about any package's evidence. One line reaches stdout,
`PREFLIGHT PASS <head sha>` or `PREFLIGHT FAIL <code>`, so it can be pasted unedited.
Six checks: the diff against the chain branch (committed, uncommitted and untracked, with
`--untracked-files=all` so a stray file is named and not collapsed to its directory) lies
inside the custody globs; the report is ≤ 60 lines; the report carries counts (`<n>/<n>` or
`pass <n>`); the longest STATUS line is ≤ 400 code points; no U+2013/U+2014 in the declared
UI custody. The sixth, CI green at the exact head sha, is a GitHub API fact and is out of
reach offline — so it is NOT faked: the exact `gh run list --repo <slug> --commit <head>`
command and the commit URL are printed, `--ci-run <id>` must be supplied by the builder who
looked, and without it the preflight FAILS at `CI-UNVERIFIED` rather than passing quietly.
The id is recorded and explicitly NOT verified; what it buys is that a human looked and can
be asked which run they looked at.
