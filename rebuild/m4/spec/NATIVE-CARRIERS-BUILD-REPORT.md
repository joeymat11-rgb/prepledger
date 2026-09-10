# M2-NATIVE-CARRIERS — build report (B0)

Builder: cowork (Earned PM) · B0 builder. Branch `rebuild/fix-b0-native-carriers`,
base `189523bdb2fa37187ce9e08b93c4e6dc27d41efd` (`origin/rebuild/t2-client-core` ancestor).
Node `C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`
(v24.19.0), `TZ=America/New_York`, `MEASURED_TEST_NOW=2026-09-03`.
Nothing private was read or run; `--full` was **not** run; no install; nothing merged.

## 1. Profile facts

- `packageId` `M2-NATIVE-CARRIERS`; artifact `rebuild/m4/spec/acceptance-native-carriers.json`
  sha256 `aad93d4a8f562e623c22b934346dfcc7ad1d29dea07fd86d3f58fc136e224623`;
  review `rebuild/m4/spec/review-native-carriers.json` = `{version:1,status:"PENDING",receipt:null}`.
- `parent` = the accepted M2-LOAD-WRITES artifact `rebuild/m4/spec/acceptance-load-writes.json`
  sha256 `5073977b3f612f0e6212f4d47ddc5f45f044897f0dc51b1d81b4840f6b099d82` — **verified**, and its
  `review-load-writes.json` is ACCEPTED with a receipt verified through `L.verifyReceipt`
  (role `cowork`) against `rebuild/DECISIONS.md` **line 86**, whose exact text is pinned in the
  profile and contains both the artifact path and its sha.
- `sourceBase` `189523b…`; `requiredIds` `[]` — **no register defect is repaired by this package**.
- `matrix` and `gates` are inherited byte-equal from the parent (all 19 original gates).
- CHANGES: 48 exact literal carriers over 8 files + 2 whole-file adoptions (theme §1).
- Parent-pin discipline: `native-carriers-profile.cjs parent()` asserts **every** parent
  `product`/`executionPins` entry — unchanged files against the working tree, superseded files
  against the **sourceBase** git bytes. This mirrors how `load-write-profile.cjs` handled its own
  parent M2-STEP-EFFICACY (`candidateEngine` compared against `S.baseline(root)` at its BASE, and
  `rebuild/engine/*.cjs` exempted from the tree `publicPins` loop). The parent's files are byte-for-byte
  untouched.

### Authorization bindings

| slot | binding | why |
|---|---|---|
| `contract` | inherited byte-equal from the parent artifact (ledger line 49) | precedent: the successor inherits the gate contract |
| `owner` | `rebuild/DECISIONS.md` **line 92**, role **owner** — SLICE RATIFICATION, the owner's exact words with provenance — sha256 `0c2aed9fec3202b074256d0e25f5406c65f1bb3497b7db7ed4e21fda984be621` | PM judgement of 2026-09-10; the line names Track A0 = the native next-target carriers |
| `theme` | `rebuild/DECISIONS.md` **line 93**, role **cowork** — NATIVE-CARRIERS THEME ACCEPTED — sha256 `5fc93a7c4bf5ac60a4fe9a1819b51a6fd339c98c9f4dfc8f02d52d1d456c901d` | the accepted behaviour/delta contract; replaces the earlier THEME_PENDING sentinel |
| `review` | `{role:'cowork', prefix:'POSTFIX-ACCEPTANCE M2-NATIVE-CARRIERS', terminal:'ACCEPTED'}` | precedent |

Both lines stand on `origin/rebuild/t2-client-core` @ `cb900a62b70997b534de40d5329d8cd6e2dae769`
(ledger 93 lines). Their exact bytes are pinned in
`rebuild/m4/spec/native-carriers-authorizations.json` (sha256
`0409c6945e5455a4fb722379fdef90875b65a89bab6c4e173989d1f5043be872`). `verify()` requires the owner
line to contain `SLICE RATIFICATION` and the theme line to contain `M2-NATIVE-CARRIERS` and end
` · ACCEPTED`, and in the ACCEPTED branch re-verifies **both** at the receipt base through
`L.verifyReceipt` under their own roles, exactly as `load-write-profile.cjs` does. The earlier
delegation/speed pair (lines 26 + 88) is dropped on PM judgement.

## 2. Commands and totals (all on this branch)

| # | command | result |
|---|---|---|
| 1 | `node rebuild/m4/spec/native-carriers-profile.cjs --seal` | exit 0 — SEALED, owner line 92 + theme line 93 bound, review PENDING |
| 2 | `node rebuild/m4/spec/native-carriers-package.cjs --ci` | **exit 0 — PUBLIC CI EVIDENCE PASS** |
| 3 | ↳ child `focused` — the three adopted L tests | **15 pass / 0 fail / 1 skipped** |
| 4 | ↳ child `browser-package` — w7-preview model/view/package | **19 pass / 0 fail** |
| 5 | ↳ child `profile-refusals` | **7 pass / 0 fail** |
| 6 | ↳ child `traces` | 7/7 census laws GREEN on both clocks; 2/2 goldens byte-identical; W0 public-oracle 5/5 PASS lines incl. rig185 W1/W2; 6/6 helpers composed |
| 7 | ↳ child `direct` | **713/713** |
| 8 | ↳ child `legacy` | **9/9** legacy-only comparisons identical, 3 alarm branches; 6/6 ACCEPTED preimages recovered |
| 9 | ↳ child `witnesses` | 6/6 input/alarm branches; 30 delegates reached, 1 writer function reached, 90 composed-but-unreached; **0 lab/history reach** |
| 10 | ↳ child `cases` | **7/7 effective mutants**, one per carrier file, all restored |
| 11 | `node rebuild/m3/w0/scope-package.mjs` | exit 0 — FROZEN-PATHS PASS, OLD-PACKAGE PASS (18 files) |
| 12 | `node rebuild/m3/w0/public-conformance.cjs` | exit 0 — 99 reference GREEN, 99 STRONG (141 mutants), 70 adapter GREEN |
| 13 | `node rebuild/m3/w0/public-oracle.mjs` | exit 0 — 7/7 + 9/9 + candidate 7/7 frozen and native + ENGINE-TRACK |
| 14 | `node --test rebuild/m3/w0/test/public-conformance.test.cjs rebuild/m3/w0/test/scope-package.test.mjs` | exit 0 |
| 15 | `node rebuild/t2/rig187.cjs` | exit 0 |
| 16 | `node rebuild/m4/spec/native-carriers-reference.cjs` | exit 0 — 6/6 ACCEPTED preimages recovered and pin-verified; 14 retained import-engine files |
| 17 | **(C2)** `node rebuild/m3/w6/test/run-current-head.cjs . --all` (the **joined tree itself** as argv[2], at the package head) | **exit 0 — 435 tests / 435 pass / 0 fail / 0 skipped / 0 cancelled / 0 todo**, incl. `WORKOUT ACTUAL CLIENT/R1 HTTP PASS` |

Effective mutants (mutant → detector): `performed-hole-state`→focused,
`progression-governing-last`→focused, `plan-era-fresh-native`→focused,
`today-governing-prev`→focused, `writers-alarm-floor`→legacy-behaviour,
`sleep-alarm-signal`→focused, `index-performed-composition`→direct-behaviour.
The byte-level carrier check is **excluded** from mutant detection (`--behaviour` mode), so every
mutant above was refused by a behaviour check, not by noticing its own text.

`.github/workflows/rebuild.yml`: the single cumulative step now runs
`node rebuild/m4/spec/native-carriers-package.cjs --ci` (named "Cumulative extracted-engine
native-carrier and legacy-census evidence"), replacing the M2-LOAD-WRITES entry exactly as that
package replaced M2-STEP-EFFICACY's. No other step changed.

## 3. Reconstructed prerequisites (builder acts — review these)

The three adopted L tests name two immutable inputs this repository does not carry.
`rebuild/m4/spec/native-carriers-reference.cjs` materialises both, and the package runner removes
them again before exiting.

1. **`EARNED_NATIVE_PACKET_ROOT/inputs/accepted-generated/…`** — the ACCEPTED preimage the
   candidate's `source-delta.cjs` was constructed over. It is **recovered by inversion**: every
   edit in `source-delta.cjs` is a unique literal replacement, so applying each `(after → before)`
   in reverse to the adopted text inverts the construction. The recovery is accepted only when it
   hashes to source-delta's **own published ACCEPTED pin** for all six files *and* `construct()`
   over it reproduces the adopted bytes exactly. Both hold (6/6). The edit list is enumerated by
   executing the pinned `source-delta.cjs` edit region with a recording `edit` (34 edits); the file
   is sha-pinned before it is read.
2. **`<root>/test-support/import-engine`** — the retained public engine the test-only importer
   assembly composes. Its 14 files are read from git at `sourceBase` and pinned. This choice
   ("retained, immutable, not the candidate") matches the module's own comment but was **not**
   supplied by the packet; it is my reconstruction and is unproven against the L author's original.
   It must stay transient: a committed top-level `test-support/` fails the W0 frozen-path gate
   (observed: `W0 SCOPE/PACKAGE FAIL`), so it is created and removed inside the run.

## 4. Limits and disclosures

1. **`node rebuild/m4/spec/load-write-package.cjs --ci` FAILS on this branch (exit 1).** This is
   unavoidable and was independently found before me: `rebuild/slice-a0`'s `engine-root.cjs` states
   it in terms — `load-write-source.cjs verify()` asserts a **closed** `rebuild/engine` inventory and
   exact bytes for plan/progression/sleep/today/writers, so adding `performed.cjs`/`entered-load.cjs`
   or changing those five necessarily breaks it. That profile is not ours to edit and has **not**
   been edited; the parent's pins are instead preserved at `sourceBase` by the successor, and the CI
   entry is replaced — the same supersession M2-LOAD-WRITES applied to M2-STEP-EFFICACY. Requirement
   "keep the parent's `--ci` PASS" is therefore **not met and cannot be met**; the reviewer should
   rule on the supersession rather than on that command.
2. **(C2) RESOLVED — `run-current-head.cjs . --all` is 435/435 at the package head.** My first
   attempt pointed argv[2] at a separate R1 worktree, whose `rebuild/m4/workout/schema.cjs`
   (`6038b32e…`) differs from the joined tip (`9d18cce9…`), so it refused before any engine code
   loaded; the untouched base failed identically. Run the way the JOIN reviewer ran it — with the
   **joined tree itself** as argv[2] — it is 435 tests / 435 pass / 0 fail / 0 skipped on this
   branch, unchanged from the JOIN's own 435/435 at `189523b`.
3. The `legacy` differential is 9 comparisons over one synthetic profile and three alarm branches.
   It is real but thin; a wider legacy corpus is the obvious strengthening.
4. `direct` covers the carriers' structure exhaustively and their behaviour only where it can be
   exercised without a durable client. The deep native-lane behaviour rests on the three adopted L
   tests (15 pass), which are author tests, not independent acceptance.
5. One subtest of `native-next-targets-correction.test.cjs` is SKIPPED (no static extension capture
   in this root), matching the L author's own native-root result.
6. The parent's `second`-gate and `parent-cases` children were **not** re-implemented: they load
   `load-write-profile.cjs`, which now refuses (limit 1). Their obligations are carried by the
   inherited 19-gate matrix, which runs in `--full` only. `--full` has **not** been run by me.
7. `nativeTrendContext` remains a declared test assumption; N175-1, N175-2, the unbuilt host
   assembly and the string-lane echo are unchanged open boundaries (theme §6).
8. Two carriers (`index.cjs`, `browser-engine.cjs`/`build.mjs`) are **not** L bytes. They are
   required composition edits without which the legacy census and the preview package do not even
   run (theme §2). They are disclosed as mine, not as accepted candidate bytes.
9. The `today.cjs:92` `e.id === "hack"` special case is reported and deliberately left unchanged
   (theme §5); it pre-exists at `sourceBase`.
