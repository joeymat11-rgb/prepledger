# REVIEW S9 exporter v3 (l3, final) - Claude Fable 5.1, independent reviewer, 2026-09-23
Hashes verified first: v3 576fd22e (195 lines), harness-v3 4065a714 (229), results-v3 e0dc355d, report 92079d4b;
v1 7541ad0e and v2 70f2a92b unchanged. Harness-v3 re-run by me from a wrapper copy in %TEMP%/earned-s9x-review/h3
(harness-l3.cjs, cases-l3.js, results-v3.json there) under the runtime lock (created, run, removed); invented inputs
only. 25/25 cells: the builder's 19 (A, I, B1-B4, C, D, E, F, H4, H4b, H9, H8, H8c, SW, AU, SWf, G) plus my J1-J6.

## VERDICT: ACCEPT (one pre-run clean step for the PM; no exemption; no code debt)

## E1 closed - each channel, with the line and the cell that bites
git env (v3:52-54): GIT_* removed (/^GIT_/i), HOME and XDG_CONFIG_HOME replaced by a path INSIDE the not-yet-created
destination (48), GIT_CONFIG_NOSYSTEM=1, GIT_CONFIG_GLOBAL=NUL. Cells: H4 (XDG global), H4b (HOME global), J1
(xdg_config_home / home / git_config_global in odd case), J6 (HOME removed by the caller, HOMEDRIVE+HOMEPATH and
USERPROFILE pointing at a hiding .gitconfig): v1 and v2 export (red), v3 refuses. The absent-home path cannot be
pre-seeded: destination is asserted absent at 46 and again at 183 before mkdir (J5: pre-created destination refuses).
compile env (98-101): GIT_* and XDG_CONFIG_HOME deleted, exactly [GIT_CONFIG_GLOBAL, GIT_CONFIG_NOSYSTEM,
GIT_NO_REPLACE_OBJECTS] asserted before and after (101,106), restored in finally (188-191). HOME kept: safe, since
GIT_CONFIG_GLOBAL overrides ~/.gitconfig and the prefix's git verbs (rev-parse, show, merge-base, ls-tree) read no excludes.
cleanTree (60-65): `status --porcelain -z --untracked-files=all --ignored=matching`; every entry must be `!! ` and not
under rebuild/ or .github/ (guarded, 28, case-folded); then `ls-files -v -z` every entry `H `. Called at 73 and 179.
Flags override any config: H9 (.git/config status.showUntrackedFiles=no), J2 (.git/config core.excludesFile hiding an
untracked packages/*.json -> shown as !! under rebuild/, refused), H8 (.git/info/exclude), J4 (untracked file at the
root refuses: untracked anywhere is refused, ignored only outside scope, H8c). Index flags: SW (skip-worktree with a
modified sibling spec), AU (assume-unchanged), SWf (flag alone, unmodified) all refuse v3 while v1/v2 export. -z makes
a rename pair a second field that is not `!! `, so it refuses too. Could not break it: every hiding channel I know ends
in REFUSED; the H6-style ref flip stays the only residual (accepted in l2). Byte identity (I): v1, v2 and v3 on
identical clean inputs write byte-identical artifacts and envelopes; only argv arity, env hygiene, checks and stdout differ.

## False-refusal measurement on the real final root (names only, nothing opened)
C:\Users\joeym\AppData\Local\Temp\earned-s9int: branch rebuild/b-s9-integration, HEAD fe9f14b5a764efe0cc66fa0380a27b1e32d5672c,
origin/rebuild/t2-client-core there = d9464f20 (the PM tree holds 37a18d21; argv 6 pins whichever is reviewed).
`status --porcelain --ignored=matching --untracked-files=all -- rebuild .github`: 5 entries, all `!! `, 0 with a
forbidden name: rebuild/conform/engines/engine-main.cjs [file], rebuild/conform/engines/engine-old.cjs [file],
rebuild/conform/run.log [file], rebuild/m3/w5/node_modules/ [junction -> %TEMP%\earned-adm\rebuild\m3\w5\node_modules],
rebuild/m3/w6/node_modules/ [junction -> %TEMP%\earned-adm\rebuild\m3\w6\node_modules]. Whole tree: 7 ignored, 0
untracked/modified. `ls-files -v`: 5004 entries, 0 non-H. So v3 as written refuses this root today (J3 reproduces the
mechanism: an ignored junction under rebuild/ prints `!! rebuild/lanes/node_modules/` and refuses while v2 exports).
None of the five is on the export's read path: the compiled prefix requires only node: builtins and the 8 pinned
repo files (no bare specifier, so node_modules is never resolved), and the engine bundles / run.log belong to laws()
and Reference.create in main (b-package 3827-3847), which the exporter never reaches.

## Recommendation: a pre-run clean step the PM performs (exactly one of the three options)
Before the run: `rmdir` the two junctions (reparse points only; targets untouched), move the three ignored files out
of the worktree to a scratch folder, re-run the status command above and require zero entries; run; then restore.
Against an exemption: the junctions could be exempted by exact path + lstat isSymbolicLink + realpath equal to the
earned-adm targets without reopening H4/H8/skip-worktree, but the three ignored FILES cannot be exempted without
admitting arbitrary bytes under rebuild/, so a clean step is needed anyway; one mechanism beats two. The final S9
inputs are not fe9f14b yet (l1 D4): the PM repeats this 5-entry measurement on the final commit before running.
D5, D2, outputs unchanged from l2: toolchain unit green; leak checks secondary per PM ruling; mkdir + two `wx` files;
bare REFUSED on every failure; repo clean and main never ran after every cell.
