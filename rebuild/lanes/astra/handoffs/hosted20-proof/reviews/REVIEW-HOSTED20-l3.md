# REVIEW-HOSTED20-l3 (round 3, final; independent reviewer claude-fable-5-1, 2026-09-22)
Packet: earned-h20/rebuild/lanes/astra/handoffs/hosted20-proof (7 files, still uncommitted `??`), worktree HEAD fe9f14b5a764efe0cc66fa0380a27b1e32d5672c.
All seven sha256 verified first (Get-FileHash): AUTHORIZATION f0250b22, INVENTORY 15042fbc (unchanged from l2), RUNNER 7a2f6f2b, WORKFLOW 84ec3ba4, SELFTEST ee74bc67, SELFTEST-RESULT 491681f1, REPORT 515dfe52 - all exact.
Nothing built, committed, dispatched or fixed. No real group, engine or repository module executed. No forbidden path opened (rebuild/DECISIONS.md and soak.yml not opened by me).

## Verdict: ACCEPT (no packet defect found; four residual limitations named below, none requiring a packet change)

## 1. D3b, attacked
- Runner diff vs the l2 runner (25+/6-, reviewed line by line): the authorization pin HOSTED20_AUTHORIZATION_SHA256 is required for the real kind and enforced for the synthetic kind whenever set; authorizedBy must be a plain object with exactly the keys {decisionsLine, ledger, ownerQuote}, ledger === 'rebuild/DECISIONS.md', decisionsLine a positive integer, ownerQuote a non-blank string <= 4000 chars with no C0/DEL control characters (newline and tab allowed); receipt adds pins {inventory, runner, authorization}, authorizedBy {ledger, decisionsLine, ownerQuoteSha256} and runnerEnvironment. The runner does not judge the quote's content (PM checks the ledger), as stated.
- Workflow: all three env pins are placeholders and each is checked with `sha256sum --check` before the bootstrap checkout is deleted; `node --version` and `pnpm --version` are asserted; `set -euo pipefail` everywhere; no upload/cache/retry. Exit 2 (HELD) still fails the job.
- Executed (my suite syn-selftest3.cjs on runner copy sha 7a2f6f2b, invented remote): matching pin -> PROBE OK; the same authorization with one extra grant swapped in under the reviewed pin -> STOP AUTHORIZATION_SHA256_NOT_PINNED; placeholder pin value -> STOP; real inventory with inventory+runner pins but no authorization pin -> STOP AUTHORIZATION_SHA256_NOT_PINNED; real packet with all three correct pins -> STOP NOT_AUTHORIZED; authorizedBy absent or null -> AUTHORIZED_BY_MISSING; 12 malformed variants (string, array, extra key, missing key, other ledger path, line 0, line as string, line 1.5, blank quote, control char, 4001-char quote, numeric quote) -> AUTHORIZED_BY_MALFORMED; a quote with newline and tab is accepted. Receipt: pins triple equals the sha256 of the three files handed in and the AUTHORIZATION value on the VERDICT line; authorizedBy carries ledger, line and sha256(quote) only, and my invented quote text appears nowhere in runner stdout/stderr/receipt.
- Author's F11/F12/F13-F15/A3/A5/A6/H14-H16 cover the same surface (read in SELFTEST.cjs.txt).

## 2. Pins, re-verified through the PC shell (network available; pins.cjs, 2026-09-22)
- `git ls-remote https://github.com/actions/checkout refs/tags/v4*`: refs/tags/v4 and refs/tags/v4.4.0 both 11d5960a326750d5838078e36cf38b85af677262 (lightweight, no ^{} lines). Matches the workflow.
- `git ls-remote https://github.com/actions/setup-node refs/tags/v4*`: refs/tags/v4 and v4.4.0 both 49933ea5288caeca8642d1e84afbd3f7d6820020. Matches the workflow and fe9f14b5:.github/workflows/shared-preflight.yml.
- https://nodejs.org/dist/index.json: newest v22.x = v22.23.2 (2026-07-28, lts Jod), 35 v22 releases listed. Matches node-version '22.23.2' and the `test "$(node --version)" = "v22.23.2"` assertion.
- https://registry.npmjs.org/pnpm: dist-tag latest-9 = 9.15.9, also the newest 9.x by semver; integrity sha512-aARhQYk8...lMQ== equals the value quoted in the workflow comment. Matches `pnpm@9.15.9` and its version assertion.
- ubuntu-24.04 image: not pinnable; identity recorded in the receipt (ImageOS, ImageVersion, uname -a, os type/release, arch). Accepted limitation, correctly stated. No OPEN_PINS remain and no value was invented.

## 3. Regressions
- Author's SELFTEST.cjs.txt (sha ee74bc67) run byte-for-byte from my scratch against packet copies: exit 0, 62/62 PASS, git 2.55.0.windows.3, node v24.19.0, runner 7a2f6f2b, inventory 15042fbc, authorization f0250b22 - identical to the packet's SELFTEST-RESULT.json.
- My suite adapted to round 3 (authorizedBy added to derived authorizations; one l2 expectation renamed because two pins now stop at the third pin instead of NOT_AUTHORIZED): 65/65 PASS = the 42 round-1/round-2 checks (lazy-fetch red control, GIT_NO_LAZY_FETCH guard, post-seal unreadability without the env var and from a git-spawning child, exact materialization, pair mismatch STOP, forged `# pass 1` escaped by Node, planted secret only in raw files, raw hashes == receipt, RAW_DIR_EXISTS, HELD never spawned and never PASS, budget exhaustion RED) plus 23 new D3b checks. Run dir syn-1790121380584. Nothing proved in rounds 1 or 2 weakened.
- Inventory: byte-identical to the l2 bytes I verified (1044/1044 blob claims, 529 trees, argv canonical, protected flags on exactly the five engine files).

## 4. Round-3 search scope
Checkable evidence: the round-3 changes draw only on external public sources (two ls-remote calls, nodejs.org, registry.npmjs.org) and the repo's shared-preflight.yml; no packet file cites a new forbidden-glob path as a source (grep of the seven files for soak|ledger|history.js|conform/private|EarnedPort|port-real|astra-job finds only the pre-existing forbidden-probe lists, the authorizedBy ledger field 'rebuild/DECISIONS.md' (not under ledger/, not a glob match), invented self-test names, and the round-2 disclosure). The author's shell history is not observable to me; the statement "no round-3 search touched such a path" is consistent with everything in the packet but rests on the author's disclosure.

## Residual limitations (not defects; travel with the packet)
- R1 `npm install --global pnpm@9.15.9` pins the version (asserted) but not the tarball integrity; the sha512 is only a comment. A registry-side substitution would not be caught. Cheap to harden later; not blocking.
- R2 `uname -a` in the public receipt includes the ephemeral runner's hostname and kernel string. Harmless on a hosted runner; noted because the receipt is the only public output.
- R3 The three pins, the workflow and the controls live on the same proof branch, so the pins are drift/accountability controls (the receipt triple lets the PM verify), not protection against a branch writer. Understood and now explicit.
- R4 Inherent and disclosed (author Q1-Q7): hosted GitHub blob-OID `want` behaviour unmeasured until dispatch; esbuild under --ignore-scripts may go RED; HELD_INCOMPLETE proves 19 groups until Joe rules on soak-stub; the runner does not verify the quote against DECISIONS (PM step, author Q7 order is right).

## Read / ran
Read: all 7 packet files (REPORT.md last), runner diff and new sections, workflow in full, SELFTEST.cjs.txt new checks. Ran (C:\Users\joeym\AppData\Local\Temp\earned-h20-review): hash2.ps1, pins.cjs (ls-remote x2, nodejs.org, npm registry), run-selftest.ps1 (author's suite, 62/62), syn-selftest3.cjs (mine, 65/65). Not run: any real group, hosted GitHub dispatch, engine modules.
