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
| `git`, `object`, `verifyReceipt`, `historicalAudit` | `postfix/legacy-gates.cjs` | ancestry, receipt lines, the historical 45-law audit |
| `sha` | `postfix/target.cjs` | every byte pin |
| `parseExact` | `postfix/strict-json.cjs` | exact reviewed JSON bytes + duplicate-key refusal |
| `codes` (closed BLOCKED list) | `rebuild/m4/spec/native-carriers-errors.cjs` | BLOCKED vs FAIL classification |
| `create` (pinned public reference bundles) | `rebuild/m4/spec/load-write-reference.cjs` | `ENGINE_MAIN` / `ENGINE_OLD` |

No gate, law, oracle, golden or frozen input is re-implemented here.

## How to instantiate a package

1. **Copy the nearest spec** in `packages/` and edit it. It is read with `parseExact`, so
   the bytes must be exactly `JSON.stringify(parsed, null, 2) + "\n"` — a duplicate key,
   an unknown key, a missing key or a stray space refuses the whole run (control C4).
   Keys are closed: `version, lanePackage, packageId, status, brief, sourceBase, dIds,
   laws, carriedAcceptedIds, privateLiveTriggered, parent, product, coverage,
   carrierSuccessor, witnessFlips, protectedSurfaces, authorizations, artifact, children,
   notes`.
2. **`dIds`** in package order; **`laws`** maps each D-id to its law id. The runner
   cross-checks every law id against the **executed** live inventory, not a table — a
   renamed or mistyped law id fails the run (control C3).
3. **`product`** maps each file to `{pre, post, role}`. `pre` is the pinned pre-image
   sha256 at `sourceBase`; `post` stays `null` until the repair exists. The runner hashes
   the bytes on disk and reports `NOT-IMPLEMENTED` / `PARTIAL` / `IMPLEMENTED`; a byte
   that is neither `pre` nor `post` is `UNLISTED-PRODUCT-DRIFT` and fails (control C2).
4. **`parent`** carries `decided`, `chosen` and every documented `options` entry. See the
   chain rule below.
5. **`coverage.inherited`** repeats the parent artifact's own `coverage.byChild`;
   **`coverage.moves`** lists the gates this package moves from `run` to `covered`, with
   the child that carries them. A gate is inherited-covered or moved, never both.
6. **`carrierSuccessor`** + **`witnessFlips`**: one flip per assertion site, and every
   frozen witness file pinned by sha256 so it stays **byte-identical** — the established
   mechanism is in-memory `exactReplace` substitution by a named successor child
   (`legacy-step-efficacy-carriers.cjs:17-18`), never an edit to the witness file.
7. **`authorizations`**: `owner` = `DECISIONS:60`, `contract` = `DECISIONS:49` (inherited
   byte-equal from the parent), `theme` = the PM's line accepting *this* brief, `review` =
   `{cowork, "POSTFIX-ACCEPTANCE <packageId>", ACCEPTED}`. `theme` stays `null` until the
   brief is accepted, and the runner refuses PASS while it is null
   (`THEME-AUTHORIZATION-UNAVAILABLE`). `owner`/`contract` carry `lineSha256` now; the
   full line text is bound at seal time in a sha-pinned citation file beside the artifact,
   as `native-carriers-authorizations.json` does.
8. **`children`**: `{name, argv, needle}` per package child. Each must exit 0 and print
   its exact declared verdict. Empty until authored — reported as an open obligation.

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

* verifies **every** sealed option (artifact bytes by sha256, review `ACCEPTED`, the
  receipt line by its own sha256 at its commit, the line naming the artifact and hash and
  ending ` ACCEPTED`) and prints one line per option;
* prints `PARENT UNDECIDED` and records an open obligation while `chosen` is null;
* once `chosen` is set, scans every other spec in `packages/` and **fails** if another
  package already claims that artifact (control C1);
* walks the chain to the artifact that still carries the audit `baseline` (the closed
  cumulative profiles do not; `acceptance-step-efficacy.json` does) for the historical
  audit snapshot.

Product merges may still be parallel. The **artifact chain** and the shared
`witnesses-1` carrier are what serialize (B1 §5.3, B2 §4/§7 Q4).

## Cloud vs the owner's PC

**Cloud / CI, both OS — `--ci` (public evidence only):** spec bytes and closed schema;
parent-chain verification; product pre/post state; fidelity (sourceBase ancestry, no
unlisted engine/conform/m4-spec change, PIN_PATHS Git-vs-disk); the 45 register laws
red-first with the pinned public reference bundles; the declared witness-flip and coverage
accounting; every declared package child. Exit 0 with
`PUBLIC CI EVIDENCE PASS` only when every non-envelope obligation is closed; otherwise
`CI REVIEW-PENDING`, exit 2, **no PASS word**.

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
2. **Implement**, then **seal** the artifact in `rebuild/m4/spec/` with
   `review-<pkg>.json` = `{version: 1, status: "PENDING", receipt: null}`.
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
| a declared law id is not the live executed law id | FAIL exit 1 |
| spec bytes are not canonical JSON | FAIL exit 1 |
| an unlisted engine/conform/m4-spec change since `sourceBase` | FAIL exit 1 |
| PIN_PATHS disagree between Git and disk | FAIL exit 1 |
| an ACCEPTED envelope with no bound theme line | FAIL exit 1 |
| the private fixture is absent under `--full` | BLOCKED exit 2 |
| evidence complete but acceptance PENDING | REVIEW-PENDING exit 2, no PASS word |

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
