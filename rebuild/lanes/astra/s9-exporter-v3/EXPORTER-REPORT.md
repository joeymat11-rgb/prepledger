# EXPORTER V2/V3 REPORT (builder claude-opus-5-5, 2026-09-23, round 3)
Status: v3 BUILT and SYNTHETIC-TESTED (19/19 cases pass). Never run against the real repo. Nothing committed.
v1 7541ad0e... and v2 70f2a92b... verified unchanged. Reviews read whole: l1 (D1-D5), l2 30b3c280 (ACCEPT WITH NAMED DEBTS E1-E3).

## Files (sha256)
- export-s9-profile-v3.cjs  576fd22ea385bbd3e0fb744526988161ebfc79f37b4b2b6015e961f374eea5a5 (195 lines; +35/-13 vs v2)
- export-s9-profile-v2.cjs  70f2a92ba983b95aa9c94466cf45ee599244e1b6e45c43b35601fc12861e7105 (kept; round 2)
- %TEMP%/earned-s9x-v2-test/harness-v3.cjs  4065a714cd76783538fc13afe242661d6078328d49ff6f0824e155f8d9b6de4f
- %TEMP%/earned-s9x-v2-test/results-v3.json e0dc355d6a94705f869d1bb15d2d872e491ffcaca719350acdc6bbe4efb846f1 (allPass true)
- round 2 kept: harness.cjs cbf520d6..., results.json 497643a0...
Invocation (v2 and v3): node <exporter> --execute-reviewed-export <root> <head> <runner-sha256> <s9-name> <chain-sha40>

## v2 over v1 (round 2; confirmed closed by l2)
D1 6th argv chain sha asserted at start/mid/end, recorded on stdout (the review envelope keys are closed at fe9f14b:3697).
D3 GIT_* scrubbed for git and during compile; show-toplevel == root; 8 imports pinned disk==git(HEAD) before compile and
in the pin loop; require.cache under root limited to the 8. D5 node major 24, git >= 2.44, both on stdout.
D2 hash-only kept; the protected-key leaf guard and the byte-range leak checks run before any write.

## v3 over v2 (round 3, E1)
- git child env: GIT_* scrubbed plus GIT_NO_REPLACE_OBJECTS=1, GIT_CONFIG_NOSYSTEM=1, GIT_CONFIG_GLOBAL=NUL. HOME and
  XDG_CONFIG_HOME are set to <destination>/absent-home, a path that does not exist until after the last git call.
- Compile env: every GIT_* and XDG_CONFIG_HOME removed, then the same three GIT_ keys set. The key set is asserted
  before and after the compile and restored in finally. HOME is deliberately left alone for the compile: it also drives
  os.homedir for non-git code. With GIT_CONFIG_GLOBAL set, git reads no HOME config, and the runner's git verbs (show,
  ls-tree, rev-parse, merge-base) never read excludes.
- cleanTree() replaces both `status --porcelain` checks (start and end). It runs `status --porcelain -z
  --untracked-files=all --ignored=matching`: any tracked or untracked entry anywhere refuses, and an ignored ('!!') entry
  refuses under rebuild/ or .github/. It then runs `ls-files -v -z`, and any entry not starting with 'H ' refuses
  (skip-worktree S, assume-unchanged h, unmerged, others). The CLI flags also override repo-local status config.
- Also asserts the destination is still absent just before mkdir. Everything else is byte-identical to v2.
- PM rulings recorded: E2, the D2 leak checks are a SECONDARY control and PM review of spec strings stays primary (noted
  in v3 source too). E3 is accepted as is (a ref moved and restored inside the compile is not caught). The git floor stays
  2.44, and the exact node= and git= appear on stdout.

## Harness v3 (invented repo only; test copies differ from sources in exactly the scratch-root line)
Regression against v3: A happy (exactly the 2 files; chain/node/git on stdout); I byte identity (v1 == v2 == v3
artifact 82319b07...); B1-B4 D1; C GIT_DIR/WORK_TREE/INDEX injection; D pinned-import tamper behind skip-worktree;
E protected leak; F 9th module; G toolchain unit. All pass, and each v1 red cell still exports.
New E1 cells (red first; each also checks that plain `git status` showed nothing under the attack):
- H4 XDG_CONFIG_HOME/git/config status.showUntrackedFiles=no over an untracked invented packages/S7-hidden.json.
  Control without the attack: v2 refuses. Under it: v1 exports, v2 exports (red), v3 refuses.
- H4b same via HOME/.gitconfig: v1/v2 export, v3 refuses. H9 same via repo .git/config: v1/v2 export, v3 refuses.
- H8 the file listed in .git/info/exclude: v1/v2 export, v3 refuses. H8c control: an ignored file at the repo root
  (outside rebuild/ and .github/) still lets v3 export.
- SW invented sibling packages/S8.json modified behind skip-worktree: v1/v2 export, v3 refuses. AU the same behind
  assume-unchanged. SWf the skip-worktree flag alone, file unmodified: v3 refuses.
Runtime lock taken and released around the run (another job's lock was present earlier and left untouched).

## Limits / risks for the final run
- NEW refusal surface: any ignored path under rebuild/ or .github/ in the final worktree makes v3 refuse. Examples are a
  gitignored rebuild/conform/private/, a node_modules junction or a .tmp/log directory. A sparse checkout also refuses,
  through the S flags. I did not probe the real worktree, because listing it would touch forbidden paths. The PM should
  confirm that the final worktree has none, or rule an exemption, before the run.
- Refusals are text-free, so each v3 refusal is attributed by a single-variable difference from the passing run.
- The synthetic runner mimics only the exporter's interface. The real runner on final inputs still needs containment
  review. D4 (fe9f14b S9.json not runnable) is untouched. The procedure doc needs the 6-arg call and the longer
  success line; that is for the PM or author to publish.
- The D5 live refusal branch is only unit-tested (no other node or git binary may be installed). GIT_CONFIG_NOSYSTEM
  was not red-tested (writing system config needs admin), but it is set and asserted.
