# REVIEW S9 exporter v2 (l2) - Claude Fable 5.1, independent reviewer, 2026-09-23
Hashes verified before reading: v2 70f2a92b (173 lines), v1 still 7541ad0e (102), EXPORTER-V2-REPORT.md 4fd86806,
harness.cjs cbf520d6, results.json 497643a0. Runner facts re-read at fe9f14b:rebuild/lanes/b/tooling/b-package.cjs.
Harness re-run by me from a wrapper copy under %TEMP%/earned-s9x-review/h (harness-l2.cjs 818492ea, cases-l2.js
9d133c04, results.json 80050739) with the runtime lock held and released; invented inputs only; 18/18 cells as predicted.

## VERDICT: ACCEPT WITH NAMED DEBTS (E1 one-line fix recommended before the final run; E2/E3 rulings, not code)

## D1 chain sha (CLOSED, residual E3)
6th argv 40-hex (v2:32-33); asserted against `rev-parse refs/remotes/origin/rebuild/t2-client-core` at start (57),
after compile (106) and before the write (155); the ref is re-resolved each time (105,154), so a ref that STAYS moved
refuses (B1/B2/B4 pass; my H2 odd-case env also refuses the decoy). Claim verified: fe9f14b:3697 `keys(review,
['version','status','receipt'])` and 3694/3695 close ARTIFACT_KEYS and require artifact === proposed(), so neither
output file may carry the chain sha; stdout is the only lawful place (v2:142-144, regex-asserted). E3 residual: my H6
(runner moves the ref to HEAD and back inside the compile) EXPORTS; only in-process reads would catch it. Accept as is.

## D3 env, toplevel, import pins, cache allowlist (CLOSED for GIT_*, gap E1 for the non-GIT_ channel)
Scrub: `/^GIT_/i` (23) filters the git child env (46-48) and process.env during compile (85-88, asserted 89 and 95),
restored in finally (163-166). H2 (git_dir, Git_Work_Tree, gIt_InDeX_fIlE) and H3 (GIT_CONFIG_COUNT/KEY/VALUE hiding
an untracked packages/*.json) both: v1 exports (red), v2 refuses. show-toplevel (50-51) realpath-compared: H5 junction
alias exports, sub-directory root refuses. The 8 imports (15-18 = my l1 list; transitive set re-confirmed) are pinned
disk == `git show HEAD:` BEFORE any require (66-71): D (skip-worktree tamper) refuses before the tampered code runs.
require.cache allowlist (97-101): post-hoc by nature (a 9th module has already run when checked) but with the 8 pinned
first it can only be reached by an edited pinned file, which 66-71 refuses; F passes. path.relative on win32 is
case-insensitive, so drive-letter case cannot dodge it.
E1 (LOW, fix): git config still reaches the exporter through NON-GIT_ variables and untracked state. H4: XDG_CONFIG_HOME
-> git/config `status.showUntrackedFiles=no` hides an untracked packages/*.json and v2 EXPORTS; H8: the same file listed
in .git/info/exclude also exports. The real parent() (fe9f14b:2175-2177) parses every packages/*.json on disk and
executedClosure (783) reads any relative require it finds, so hidden files can shape those reads (added refusals, or a
false PRODUCT-PINNED-UNCHANGED pass); pinned targets stay safe because 128-133 hash them against HEAD. One-line fix:
gitEnv.GIT_CONFIG_NOSYSTEM='1', gitEnv.GIT_CONFIG_GLOBAL='NUL' (also during compile), and
`status --porcelain --untracked-files=all --ignored=matching`; optionally refuse any `git ls-files -v` entry not
starting with 'H' (assume-unchanged/skip-worktree on files outside the pin set, e.g. sibling specs).

## D5 toolchain (CLOSED)
toolchainOk (26): node major exactly 24, git >= 2.44 with the windows suffix admitted; installed v24.19.0 /
2.55.0.windows.3 pass; G's 11-row unit table re-run green. View on 2.44.1: harmless, and fine to adopt, but the
May-2024 fixes concern clone/hooks/submodules, none of which rev-parse/show/status/ls-tree touch; the value that
matters is the exact node= and git= recorded on stdout (143), which the acceptance line can quote. Do not spend a round.

## D2 leak checks (PARTIAL by design - E2)
Guard walk (128-137): under a protected-five KEY only 64-hex / role-token / null / boolean leaves. Line check: every
trimmed protected line >= 40 chars must be absent from all artifact strings + both output byte strings. Token check:
every artifact string >= 24 chars that is not hex and not /^[\w.@\/-]+$/ must be absent from protected text. E refuses
a whole-file copy. False PASS (H7): a 56-char `[\w-]+` token copied verbatim from the index-slot stand-in under a
non-protected key EXPORTS (path-like exemption; line check needs a full line). Numbers and short constants (Joe
measurements are numeric) are never checked. False REFUSE: possible only if a protected file holds a valid JS line
that is byte-equal to an artifact JSON line >= 40 chars (e.g. `"artifact": "rebuild/m4/spec/...json",`) or a >= 24-char
free-text spec string verbatim; improbable for engine sources, and the refusal is silent (bare REFUSED). "Fails
closed" is true for whole lines and free text only; the primary control remains PM review of the spec strings.
Note: `sealedBy` under a released protected-five key would refuse (packageId is not a role token) - S9 releases none.

## Behaviour (CONFIRMED)
H1: v1 and v2 on identical clean inputs produce byte-identical artifacts (sha aff8e289...b187) and the same review
envelope; v2 changes only argv arity, env, pre-checks and the stdout line. Outputs still mkdir + two `wx` files
(157-161); catch still emits only REFUSED (162). Nothing under root is written (no MAIN-RAN, status clean after
every cell). Rules kept: nothing executed outside the invented repo; no protected, private, src or ledger path opened.
