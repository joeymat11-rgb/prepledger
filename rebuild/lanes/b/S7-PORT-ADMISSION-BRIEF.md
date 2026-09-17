# M2-S7-PORT-ADMISSION - the reseal that lets the owner's own history in

**STATUS: READY FOR ACCEPTANCE BY NAME.** Lane B, ENGINE-TIER PACKAGE PROCESS, child of
`M2-S6-TODAY-CHILD` (`rebuild/lanes/b/tooling/b-package.cjs`), size S. Parent artifact
`rebuild/m4/spec/acceptance-s6-today-child.json` sha256
`0e52357ed62249d4ee94b473e2dde20220b0a82c3737414bba0603fa76bf040f` (80625 B; receipt `DECISIONS:500`,
merge `:501`). Walked on the accepted head `004e45d4a5ee7277d48fdb66084acdb2e2aaa1f5` (lane D
`rebuild/d-p3-port-fix`, the FIX + FIX-2 tip) with the chain tip `origin/rebuild/t2-client-core`
`0af16b7de63a65b027e3eb0ce420c75f26595148` MERGED in, never rebased. Every sha below is measured from
Git on that merge, not carried from a report.

## 1. Why

On 2026-09-17 the owner ran the real port. The PC half sealed and passed (`DECISIONS:502`, `:503`:
six lines PASS, ORACLE 10/10 scope FULL, the bundle written and moved to the phone with its six
words). The phone half **refused**: the Import screen painted `LOCAL_SOURCE_PROGRAMME_UNRESOLVED`,
the route retracted cleanly and nothing on his installation was written (`:504`). The diagnosis
(`:506`, lane D brief plus an independent review that refuted part of it) found the cause and two
hands confirmed it: `rebuild/m3/w6/local/source-admission.mjs` compared the file's programme against
a clean init state built from THIS phone's own setup op, and `setup-model.mjs` always writes the
split's `from` as the setup day, so a fresh-start owner could never satisfy it. Classification (b),
PRODUCT DEFECT: no setup answer he could give would admit his history.

The owner then answered the one question the fix was sized on (`:507`): his old programme carries
different set counts and different rep targets per lift, and after import he expects to train on
that exact programme. The spec of record `rebuild/lanes/d/P3-PORT-FIX-SPEC.md` v2 (at `1dec0410`,
1235 lines) was accepted by name at `:508` and rewrote the rule: PROVED by shape (every split
period's map equals the phone's week, the lift id multiset, each lift's day and muscle group, the
exercise count), BOUNDED (every period `from` a valid day not after one hoisted read of the device
local day, at least one period in force, every period closed over `{from,map}`), RETAINED (sets, hi,
inc, steps, head and secondary tags, priority_muscles land from the FILE), and OPT-3 (the issue
carries the field and the lift, `REFUSAL_SENTENCE` gets a plain sentence, the `:289` catch keeps the
four inner capture codes). The build landed in two accepted rounds: P3-PORT-FIX at `94f298d0`
(`:509`, Fable final ACCEPT) and P3-PORT-FIX-2 at `004e45d4` (`:510`, Fable final ACCEPT), which
closed the retry gate `:509` left open - a phone that recorded an Earned workout BEFORE importing
now proves that capture against the setup document that PRODUCED it, so the owner's real path
admits, the pre-import session rides in as recorded, and the next morning's card opens on his real
programme.

**Every one of the four product files that change is pinned in `packages/S6.json`.** Under
`DECISIONS:455` a byte moved on a sealed pin fails `SEALED-PROFILE-RECOMPUTATION` on its own branch,
so this change reaches the tip only inside a lane B reseal child. That is the whole of S7's reason
for existing. `:508` said so when it dispatched the build ("the change RIDES S7") and `:510`
dispatched this package.

**S7 adds no behaviour of its own.** Its product delta is exactly the accepted FIX + FIX-2 diff and
nothing else. If a reviewer finds a byte here that no accepted lane D round produced, that is a
finding, not a description.

What the athlete gets: his history admits against the phone he set up this week, with his own
per-lift numbers; a session he logged before importing rides in as logged; the next morning's card
opens on his real programme; any refusal names the field and the lift in a sentence that is true.

## 2. The declaration list, walked

Method, repeated rather than trusted: for every one of the 196 paths `packages/S6.json` declares,
the bytes at the package base `3d002174ed23738bafa50ed4a163f174f8f0ad70` were read from Git and
hashed, and compared with S6's own recorded `post`. **All 196 agree, 0 mismatches** - so
`3d002174` is exactly the state S6 sealed and every `pre` below is S6's own post, measured and not
typed. The same 196 were then hashed at this branch's head. Eleven moved. The three first
declarations were hashed the same way and have `pre: null`, because they did not exist at the base.

**Counts.** 196 carried forward from S6 + 3 first declarations = **199 declared paths**:
**12 edited** (11 of S6's pins that this change moves, plus `.github/workflows/rebuild.yml`),
**3 new**, **184 carried** (`pre === post`). There is **no** `superseded-by-child` entry and that is
a measured fact rather than an omission: that role is Y1's second half, for a file the PARENT pins in
`executionPins` and this package supersedes inside its own seal, and the runner refuses it unless
`pre !== post`. `rebuild/lanes/b/tooling/b-package.cjs` does not move in this package as it stands, so
`rebuild/lanes/b/tooling/packages/S6.json` does not have to be re-pinned and stays a parent execution
pin that is simply held. Section 5.1 is where that stops being true: the moment the runner registers
the id `S7`, `S6.json` becomes `superseded-by-child` and `H3.json`, `S3.json` and `S4.json` become
`edited`, exactly as S6 did to its own ancestors.

**2.1 The four product files, role `edited`.** These are the spec's own four and the only four.

| path | pre (S6 post) | post |
| --- | --- | --- |
| `rebuild/m3/w6/local/source-admission.mjs` | `9b33c7c15282fe3b290ae87da4d227185944dfff8bc3235e8c0841829f8f6c39` | `d0c30f8c5ad2314b0225c92d0a8f24c8ef64cfe3d4c90527719a1a15759069b1` |
| `rebuild/m3/w7-preview/import/import-screen.mjs` | `28de17a33bbe710346b0d10afae676aeb07e26af6db0025be81d4ccc8dacccc4` | `637ef3bbfd9d73e3e0236449ef596f78e76c39517b9aed73fa28bd2ed5920c3d` |
| `rebuild/m4/import/replay-registry.cjs` | `33e29943291d31c5f36469a7d4d5b142e77b2045531ab72f34a81a2c643f96b1` | `e8f6af5d123c47b079e682cc43b0b263d9aa0a18b397e1d57bfa42c9499b8521` |
| `rebuild/m4/workout/plan-edit-model.cjs` | `76af2fd39e65719d8aaca6424738720c853dcd863b65a35d1b8a1722f6d0bbcd` | `ccaa90bb98b134ebda14e6f1a5a3c0a7688b9dfe9c0a8e6836a27e1855d89a5b` |

`source-admission.mjs` carries the rule itself (`+97/-14` at FIX, `+120/-4` again at FIX-2);
`import-screen.mjs` carries OPT-3's copy (`+34/-8`, then `+78/-6`); `replay-registry.cjs` carries the
F4 evidence-rule text (`+9/-3`); `plan-edit-model.cjs` carries spec section 1.6, the Edit My Week
companion's local-source predicate moved under the same seal as the admission rule (`+45/-11`), which
review R1 of the spec found BLOCKING and which is the reason the companion is in this package at
all: without it the import would ADMIT and the companion would then refuse
`PLAN_EDIT_ORIGIN_UNPROVEN` on the owner's phone.

**2.2 The seven test files S6 already declares, role `edited`.**

| path | pre (S6 post) | post |
| --- | --- | --- |
| `rebuild/m3/w6/test/local-source-admission.test.mjs` | `93f596a6e44210a7373e4ffbe393174b35b95d1cbc72974bf55dc41765b9f3ca` | `6144c7863991654da3b47215ce6d2ce04f9f335c77ceb643706a3603e9ce9491` |
| `rebuild/m3/w7-preview/import/test/support.mjs` | `05d0f0065bb25e0c849847563225f8a4b19998ce38bcf35178041e5987874a0a` | `34e6a7591a85cf66419ee1a9ea7b2fd25734f13ebe72bc3f775efe8954a9c359` |
| `rebuild/m3/w7-preview/import/test/route.test.mjs` | `16629715a2a2e549ac94a5bee26d765d852c8abc0baca33da355aea7a2c4cecc` | `4726474ef8931f937c7a18a79f6bb024a7dda50d25fcabdfaf8d47f21d887133` |
| `rebuild/m3/w7-preview/import/test/refusals.test.mjs` | `1ba66e1eee798488f00f979068bcef73e2a422857163bf6209213769101a3e19` | `5d12a328d09b42a8a5525f4f18e31161f0826e236efe4f583af9059fa5a220e3` |
| `rebuild/m3/w7-preview/import/test/refusal-route.test.mjs` | `a7982a5162b213f41554194353b911c7ed1f99fb845285742549ca65caa48598` | `e0c4bc1a84e37127fd91b103a863675a1aa725ecee82f57cb7e7e54f1f2356a6` |
| `rebuild/lanes/d/plan-edit/model.test.cjs` | `11fc507ddee632b324bdd54277e142bd1d4034d7eeb73f9debb4c9fdf99ca69b` | `3338be39b58e384d19d4f2501c2fa7809c9233b9a0f15012c056d1dfff8e7338` |
| `rebuild/lanes/d/import-retract/retract.test.mjs` | `77b9a3cdb5792c23d21e68839bcee298ddbccff06751520b0f162e32cef6fdb4` | `1f1f3feb6a7d6cb4c14ffeafb19c22b49a2692cf6e4d4584364886bbd188612e` |

`plan-edit/model.test.cjs` carries binding correction B-1 of spec review R2 (the companion's live
field list narrowed under one name, the trip-wire at `:388-389` retargeted and named CHANGED);
`support.mjs` carries section 4.4's `STRANGER_WEEK_SETUP` and the never-replace ruling on the shared
`STRANGER_SETUP` fixture. The other five carry the cells the two rounds' bars name.

**2.3 The standing CI step, role `edited`.** `.github/workflows/rebuild.yml`, pre
`8f1d5ba2b0872e693c3abb6a614ac9f850bfecd0df757dea2b27f32256b04c13` (21280 B). Section 5, rule (a).

**2.4 Three first declarations, role `new`, all `pre: null`.** The lane cells the two accepted rounds
wrote. They stand under `rebuild/lanes/d/p3-port-fix/` and are declared under the `DECISIONS:487`
stop-7 ruling that a `lanes/d` test file a declared child EXECUTES is itself declared product.

| path | post | bytes |
| --- | --- | --- |
| `rebuild/lanes/d/p3-port-fix/programme-rule.test.mjs` | `845d28d62ab9565d3dd1f722ff20850bf79d795d1abd8c1f75a7b7b6a4e693a7` | 26855 |
| `rebuild/lanes/d/p3-port-fix/owner-route.test.mjs` | `f9a1cc02eb159b4a7132fe8cc6248c0bb3178f7f275f05e89103f8c5150e0f1c` | 14950 |
| `rebuild/lanes/d/p3-port-fix/capture-codes.test.mjs` | `45b435343a7b74a7db977bbbfc792db4af3d3d25b3f81d08954ca9280731830f` | 24020 |

**2.5 NOT declared, named so the omission is a decision.** The diagnosis lane
`rebuild/lanes/d/p3-port-refusal/` (`owner-route.test.mjs`, `programme-bracket.test.mjs`) is NOT on
this branch: it lives on `rebuild/d-p3-port-refusal` and was never merged to the chain. It is not
S7's to declare and no path of this package resolves into it. The ten lane D and lane C **documents**
this branch adds (`P3-PORT-FIX-SPEC.md`, its two spec reviews, the two author reports, the four build
reviews, and `rebuild/lanes/c/BRIEF-RIR-DISPLAY.md` which arrives with the tip) are Markdown, declared
by no package in the chain, and are not declared here either. `NEXT.md` and `rebuild/DECISIONS.md`
move with the tip merge and are outside every package's product map by the same standing practice.

**2.6 Everything else is CARRIED byte-identical.** 183 paths, `pre === post`, re-pinned at S6's own
post. That includes all 45 tracked `rebuild/engine` files, the whole of `rebuild/m3/w7-preview/today/**`
that S4, S5 and S6 sealed, `rebuild/coach/engine-revision.cjs`, `rebuild/m3/setup/port/**` and
`rebuild/m4/import/replay-core.cjs`, which both FIX reviewers measured byte-identical. If the
runner's recomputation finds a 184th path moved, that is a finding and it comes back to the PM; it is
not absorbed into this list.

## 3. The bar

**3.1 The nine suites of the P3-PORT-FIX-2 author report, reproduced independently by author and
reviewer and spot-checked by the PM (`DECISIONS:510`).** Run with `TZ=America/New_York` and
`MEASURED_TEST_NOW=2026-09-03`:

| suite | count |
| --- | --- |
| `rebuild/lanes/d/p3-port-fix/` (the three cells) | 31 / 0 |
| `rebuild/lanes/d/plan-edit/model.test.cjs` | 54 / 0 |
| the import corpus (`m3/w7-preview/import/test/`) | 35 / 0 |
| `rebuild/m3/w6/test/local-source-admission.test.mjs` | 19 / 0 |
| `rebuild/lanes/d/import-retract/retract.test.mjs` | 13 / 0 |
| the `m4/import` children | 90 / 0 |
| `rebuild/m3/w6/test/local-source-consumer.test.mjs` | 7 / 0 |
| **subtotal** | **249 / 0** |
| `plan-edit` durable-host + browser-build | 32 / 0 |
| w6 commit + local-import + import-custody | 42 / 0 |
| **total** | **323 / 0** |

Red-first is proved and is not a claim: cell (a) is red on exactly
`LOCAL_SOURCE_PROGRAMME_UNRESOLVED` against the unchanged product on a document the shipped reducer
writes, and cell (k) is red pre-fix even with the new `programme()` alone, which is what makes the
companion move a finding rather than a description (`:509`). FIX-2's own red sides are the
sentence-precedence matrix (8 / 0 on the reviewer's eight probes) and the three capture cells
D-PF-f1 / f2 / f3.

**3.2 The S6 children, re-executed.** All 23 children `packages/S6.json` declares are re-declared by
S7 and must be OBSERVED exit 0 at their needles under `--ci`. Six of them execute a file this package
MOVES, so their needles are the ones to watch and are RECOMPUTED on this head rather than copied:
`w6-local-source` (`local-source-admission.test.mjs` + consumer), `w7-import` (four of the five files
moved), `d-plan-edit` (`model.test.cjs`), `d-import-retract` (`retract.test.mjs`), `m4-import` and
`m4-import-production` (over the moved `replay-registry.cjs`). Any needle that moves is re-measured
on this head and the difference is stated in the author report.

**3.3 The package's own child.** `d-port-admission`, argv the three cells of 2.4, needle recomputed on
this head. It is the Y1 own-child obligation (`MIN_OWN_CHILDREN = 1`): at least one declared child
must execute a file this spec declares with role `new`, and these three are the only role `new` files
S7 has. Section 5 records what the runner needs before that child can be declared at all.

**3.4 `--ci --package S7` prints `PUBLIC CI EVIDENCE PASS` at the current tip**, and the artifact is
re-proposed through the runner's own `proposed()` path, never hand-written. Run on the PC at the
package's base first and explain any difference from GitHub Actions before the FULL
(`DECISIONS:485`, and S6 bar row 25).

## 4. What does not move

- **No `rebuild/engine` byte.** All 45 tracked files stand at S6's own post; the
  `engine-files-differential` child measures it and the runner recomputes the same comparison itself.
- **The coach constant does not move in this ticket.** `rebuild/coach/engine-revision.cjs` reads
  `ENGINE_REVISION = "M2-S6-TODAY-CHILD@5bff018d56223d98"` and it stays there for the whole of the
  build, the review and the first authorized `--full`. It moves ONCE, after the sealed run writes
  `rebuild/lanes/b/tooling/receipts/S7.json`, to `M2-S7-PORT-ADMISSION@<first 16 hex of the sha256 over
  that receipt's raw bytes>`, by the PM, in the commit after the seal - `DECISIONS:465-467`'s order,
  as `:501` executed it for S6.
- **Nothing the lockdown numstat covers.** `:509` and `:510` both record it EMPTY over
  `rebuild/authority`, the client, `rebuild/engine`, `rebuild/coach`, `rebuild/m3/setup/port`,
  `rebuild/m3/w6/host`, `rebuild/m3/w7-preview/today` and `rebuild/DECISIONS.md`. That is the same
  statement as 2.6 taken from the other side, and both hands measured it.
- **`replay-core.cjs`, `athlete-state.cjs` and `plan-edit-model.cjs` between FIX and FIX-2** are
  byte-identical to `94f298d0`; only `source-admission.mjs` and `import-screen.mjs` moved in the
  second round.
- **Zero U+2013 and zero U+2014** on any line either round added, measured by both authors.
- **The sealed bundle and the six words are unchanged.** `sha256 17216d9c...`, 643364 B, already with
  the owner. The retry after S7 is live needs nothing new from him.

## 5. The two reseal rules of VERDICT-S6.md, applied

**Rule (a) - the standing CI step names the new package INSIDE the package's own post, before
`proposed()`, never at the fast-forward.** `.github/workflows/rebuild.yml:127` becomes
`node rebuild/lanes/b/tooling/b-package.cjs --ci --package S7` in this branch, and the file's post sha
in `packages/S7.json` is measured AFTER that edit. `DECISIONS:498` is why: the S6 PM flipped it after
the seal and the byte-identity `--full` refused `WORKTREE-SOURCE-PIN`, because `rebuild.yml` is a
declared product file whose post the sealed run pinned. The same hunk corrects the step NAME, which
`:501` carried out of S6 as cosmetic and which would otherwise still read S5 under an S7 seal, and
adds the CI home for 2.4's three cells (`DECISIONS:117 (4)`, `:186 (3)`). The C5 trip-wire behaves as
it did at S6 and the author report must say so in advance: from the moment this branch names
`--package S7`, `rebuild/coach/test/engine-revision.test.cjs` reads that flag and looks for
`receipts/S7.json`, which does not exist until the seal, so the rebuild job is RED at C5 on both OS
while `B PACKAGE S7 PUBLIC CI EVIDENCE PASS` prints on both. That is the `:456` trip-wire working,
under the sealing-window rule below.

**Rule (b) - a cell that recomputes the engine revision from the standing package's receipt reads the
SEALING WINDOW (the parent seal while the standing receipt does not yet exist).** Landed at
`DECISIONS:499` as ENGINE-REVISION-SEAL-WINDOW: one function `standingSeal(repoRoot)` with
`REVISION_RULE` quoted in every refusal, duplicated verbatim in
`rebuild/m4/import/test/production-mapping.test.cjs` (cell P3-M3) and
`rebuild/coach/test/engine-revision.test.cjs`. If `receipts/<standing>.json` exists the constant must
equal `<its packageId>@<sha16 of that file>`; if it does not, `packages/<standing>.json` must exist, be
`BRIEF-ACCEPTED` and name a `parent.chosen` whose receipt exists, and the constant must equal
`<PARENT packageId>@<sha16 of the parent receipt>`. Anything else fails by name, never by ENOENT.
**Read against S7 that is: standing `S7`, `receipts/S7.json` ABSENT, so the window branch applies;
`packages/S7.json` exists and is `BRIEF-ACCEPTED`; its `parent.chosen` is `S6`, whose
`receipts/S6.json` exists at sha256 `5bff018d56223d9876c6e5600616e7c52550343daded088bc2dd95fdae7ba4c1`;
so the constant must equal `M2-S6-TODAY-CHILD@5bff018d56223d98`, which is exactly where the coach
constant stands and where section 4 keeps it.** `P3-P6-SEAL-WINDOW` (`:499`) derives bar row 23's
expected constant through the same rule, so it is green in the window too. Both cells stay GREEN for
the whole S7 window and become trip-wires again the moment `receipts/S7.json` lands, which is the
same sharpness, not less. **Neither cell is edited by this package.**

**5.1 What the runner needed before any of this could run, and the round that landed it.**
The seven facts below were named here before the first run, and the lane B tooling ticket
S7-TOOLING (`DECISIONS:511`) has since landed every one of them on this branch. The refusal chain
is recorded verbatim, with exit codes and log paths, in
`rebuild/lanes/b/S7-TOOLING-AUTHOR-REPORT.md`; the runner now stands at sha256 `a07df1e0...`
(`8d9a94c2...` before the round). Each fact is written as it was found, then as it now is.
(1) `IDS` (`b-package.cjs:165`) was `['B-NTC','H3','S3','S4','S5','S6','B1','B2','B4','B3']` and the
argv gate at `:557` refused any other id outright - `--package S7` printed
`B PACKAGE USAGE REFUSED; exactly: --ci|--full --package B-NTC|H3|S3|S4|S5|S6|B1|B2|B4|B3` and exited 1
before a byte of any spec was read; `'S7'` now stands directly behind `'S6'`. (2) `NO_REGISTER_IDS`
(`:292`) gains `'S7'`; without it the run refused
`REGISTER-D-ID-INVENTORY-EMPTY-AND-NOT-EXEMPT`. (3) `CHILD_ROOTS` (`:381`) gains
`rebuild/lanes/d/p3-port-fix/` as its nineteenth root; without it the child of 3.3 was refused
`CHILD-ARGV-TARGET` and the Y1 own-child obligation could not be met at all. (4) the five
`s6-supersede-*.test.cjs` cells each read `packages/S6.json` by path and assert against S6's own
parent and sourceBase, so this package now carries its own `s7-supersede-*` family beside them and
`s7-engine-files-differential.cjs` with it, each mirrored byte for byte from its S6 sibling with
the package, parent and generation named for S7 and no assertion weakened; the six are role `new`
and the five suites measure 4 + 3 + 3 + 3 + 3. (5) moving `b-package.cjs` moves
`tooling.runnerSha256`, so `packages/H3.json`, `S3.json`, `S4.json` and `S5.json` are re-pinned
role `edited` and `S6.json` role `superseded-by-child` over the parent EXECUTION pin - S5.json is
in that list because S6 re-pinned all four of ITS ancestors the same way (commit `7e5fcca`), and
leaving it would have left the chain one generation stale. (6) `F6` and `F7` in
`rebuild/lanes/b/tooling/test/pinned-unchanged-and-ruled-substitutions.test.cjs` take the new
lists by literal and by `deepEqual`: `IDS` of eleven, `NO_REGISTER_IDS` of seven, `CHILD_ROOTS` of
nineteen. (7) the four `CHILD_SPECS` cells (`measure/test/boundary.test.mjs`,
`today/test/food.test.mjs`, `today/test/machine-settings-ui.test.mjs`, `today/test/setup.test.mjs`)
and the fifth at `today/test/problem.test.mjs` gain the `'S7'` literal; without it the `today-17`
child went red on exactly two cells (`P-MEASURE (g)` on `rebuild.yml` and `b-package.cjs`, and
`re-pin` on `rebuild.yml`) because moves this package declares read there as undeclared drift.

**The declaration list after the round.** 206 declared paths: **23 edited**, **9 new**,
**173 carried** and **1 superseded-by-child** (`packages/S6.json`). The eleven of 2.1 to 2.3 and
the three of 2.4 are unchanged; the round adds `b-package.cjs`, the four ancestor specs, the
tooling cell of (6), the five `CHILD_SPECS` cells of (7) and the six `s7-*` cells of (4), and
moves `packages/S6.json` out of "held parent execution pin" into `superseded-by-child`, which is
the sentence 2 said would stop being true here. **The needles were re-measured, not carried.**
Every one of the 24 children was run the way `children()` runs it, on this head, with
`TZ=America/New_York` and `MEASURED_TEST_NOW=2026-09-03`: 23 of 24 stand exactly where S6 left
them, including `d-port-admission` at `# pass 31`, which `DECISIONS:510` reported and which is now
measured rather than copied. One moved: `d-plan-edit` from `# pass 68` to `# pass 89`, because
`plan-edit/model.test.cjs` carries binding correction B-1 and the FIX-2 cells. `today-17` reads
`# pass 682` unchanged once (7) has landed.

## 6. The flow, in S6's order with S7's names

1. **Brief accepted by name** - a PM line naming `rebuild/lanes/b/S7-PORT-ADMISSION-BRIEF.md`.
2. **Three token lines on the tip**, in order: THEME `M2-S7-PORT-ADMISSION`; BRIEF-BY-SHA with the
   sha256 of the accepted bytes and the byte count; GATE-SUPERSESSION in `:490`'s exact shape. The
   runner locates the third by its own sha256 as a UNIQUE line of `rebuild/DECISIONS.md` on
   `refs/remotes/origin/rebuild/t2-client-core`, hashing the line's bytes as the file splits them on
   `/\r?\n/` - the leading `- ` included, the trailing newline excluded - and requires the line to
   end in the terminal word `RULED` and to carry the token
   `GATE-SUPERSESSION <packageId> <carrier>[,<carrier>]` alone in its own `·`-delimited clause.
3. **The author cites all three in `packages/S7.json`** (`theme.acceptedLedgerLine`,
   `brief.acceptedLedgerLine`, `coverage.superseded.rulingLineSha256`), each a sha256 over the exact
   line bytes with no trailing newline, the method validated first against S6's own `:488`/`:489`/`:490`
   before it is trusted on S7's. A null `rulingLineSha256` is a HARD refusal:
   `GATE-SUPERSESSION-RULING-NOT-CITED`, exit 1, before the theme and brief obligations are reached.
4. **`--ci --package S7` prints `PUBLIC CI EVIDENCE PASS`**, with the artifact re-proposed through
   `proposed()`.
5. **Fable final review** over the sealed candidate (`DECISIONS:439`), independent of the build's own
   reviewers, high effort.
6. **PM `--full` with the private census on the PC**: `PRIVATE ORACLE PRESENT` verdict-only,
   `HISTORICAL TOTAL 45 laws`, `104/104 DETECTED`, `0 HARNESS_ERROR`, LEGACY gates OBSERVED, nine
   SUPERSEDED, `POSTFIX PACKAGE REVIEW-PENDING: 1 open obligation`, exit 2.
7. **The receipt line** (`POSTFIX-ACCEPTANCE M2-S7-PORT-ADMISSION <commit> rebuild/m4/spec/acceptance-s7-port-admission.json <sha256> ACCEPTED`)
   discharges that obligation.
8. **`rebuild/m4/spec/review-s7-port-admission.json`**, `{status: "ACCEPTED", receipt: {commit, path,
   line, lineSha256}}`, citing the receipt line.
9. **MERGE the tip into the reviewed head. NEVER rebase** (`:467` note 1, `:493` (8)).
10. **Authorized `--full`**: `AUTHORIZED mode=--full`, `SEAL BASE ON THE TIP`, `ENVELOPE AUTHORIZED`,
    `PARENT PINS RE-ASSERTED`, `SEALED RUN RECORDED receipts/S7.json`,
    `POSTFIX PACKAGE PASS M2-S7-PORT-ADMISSION` exit 0; `VERDICT-S7.md` names the receipt sha.
11. **The coach constant**, once (section 4). 12. **Second authorized `--full`:
    `AUTHORIZED STEP BYTE-IDENTITY RE-VERIFY`.** 13. **CI green on both OS.** 14. **Fast-forward.**
15. **The port retry**, with the same bundle and the same six words (`DECISIONS:503`, `:510`).

## 7. Carries recorded, not adopted

`TODAY-TREE-CUSTODY` (`:482` as `:501` widened it to `rebuild/m3/w6/test`, 105 tracked files a
declared child executes that no package declares) stays its own ticket. So do the lane B tooling
carries of `:501` (the `executedClosure` blind spot on a computed specifier, a runner role for
pinned-but-unexecuted product, the child diagnostic tail carrying the failing cell's name),
`HOST-DAY-AGREEMENT` (`:485`), `PWA-SPLIT` (`:480`), `fakeRoot()`'s temp dirs, and P3-P6's `typeof`
pin (`:495`). From `:510`, declared and not blocking here: the many-session widening measured on one
pre-import session; head, secondary and priority_muscles unbounded because the document constructor
bounds them not at all; an Edit My Week amendment that moves a set count leaving a later capture to
refuse `capture_sets` (reachability open, Edit My Week part 2); and `:472` BLOCKER 2, the test-only
producer mapping on the controller cells - the real retry is its measurement.
