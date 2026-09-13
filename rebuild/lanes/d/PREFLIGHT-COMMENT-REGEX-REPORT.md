# Shared preflight comment/regex correction

Lane D builder report under DECISIONS:200. Branch rebuild/astra-preflight-comments; runtime/test commit e03fbb5.
Base: 0e652ce213b56cd5d73a670e0a761cca8c94b6c3. Own fresh work/pm-caretaker/preflight-comments; companion74920fb unchanged.
No independent verdict, PR readiness, package acceptance or integration claimed here.

## Change and custody

Only preflight.cjs, new preflight-dash-scan.cjs, existing test/preflight.test.cjs and this D report change.
Main preflight is172 lines (cap200); helper180 lines (test-enforced cap220). No new dependency or code evaluation.
The scanner distinguishes JS comments/regex from strings, template segments and interpolation; HTML attributes/RCDATA remain checked.
Supported HTML/CSS comments are excluded; inline script/style reuse the same lexical handling. CSS URL content is never a comment exemption.
Node --check validates JS grammar without evaluating it. Ambiguous/unsupported/unterminated syntax returns one UI-CUSTODY-SYNTAX failure.
Tracked/untracked custody, report/count/status bounds, no-UI disclosure, CI-unverified/id shape and one-line terminal checks remain intact.
Only raw U+2013/U+2014 are measured. This is not escape decoding, arbitrary data-flow inference or a complete HTML/CSS/rendered-text proof.
Conservative refusals include JSX/TS, regex v/nested sets, ambiguous slash goals, escaped JS identifiers and unsupported HTML/CSS forms.
P1's actual build/render guard stays authoritative; application comments, guard regexes, UI paths and their pinned bytes are not edited.

## Executed evidence

Command: node --test rebuild/lanes/tooling/test/preflight.test.cjs. Result43/43, zero fail/cancel/skip.
Seven source mutations each execute one selected assertion failure in a separate real test/preflight child process; restored controls pass.
Five remove individual exemptions; one wrongly exempts strings; one ignores the JavaScript syntax-check result. Zero empty/syntax/import kills.
Tests cover comment-looking/regex-looking strings, escaped quotes, division/postfix/property keywords, nested templates and Unicode line terminators.
HTML text/attributes/RCDATA/script/style, CSS content/URLs, tracked/untracked negatives and unsupported grammar remain refusing.
All synthetic Git fixtures and logs stay in this worktree's .tmp; recursive fixture cleanup verifies the resolved own-worktree boundary.
Logs: .tmp/preflight-real-red.tap, preflight-final.tap and preflight-mutant-*.tap. git diff --check passes.

## Exact public inputs and CI handoff

Current checkout inputs: the three tooling files named above; Node and Git only. No package install, runtime import or source execution is required.
Historical source: 2b9b09a564531d415df847cd668ea357233687b2 and base0e652ce213b56cd5d73a670e0a761cca8c94b6c3.
Closed public blob paths under rebuild/m3/w7-preview/today/: build.mjs, gym-app.mjs, plain-copy.cjs; also the old preflight.cjs at base0e652ce.
These exact Git objects must be available; missing inputs fail, never skip. Sparse CI need only materialize the tooling files, not the UI or private trees.
The real three-file C fixture preserves all26 old raw hits:8build+7gym+11plain-copy, byte-identical offending lines at the named integration base.
The frozen executable returns UI-CUSTODY-EN-OR-EM-DASH (26); corrected executable classifies20comment/6regex lines and returns CI-UNVERIFIED.
No successful CI id is passed for that candidate fixture; correcting the scanner never supplies the missing CI fact.
Own runtime head e03fbb5 also reaches CI-UNVERIFIED with all three current-base UI paths declared:20comment/6regex exemptions; .tmp/preflight-own-no-ci.log.
Existing rebuild.yml has a Windows/Ubuntu matrix but does not invoke this regression command; no exact-head both-OS proof exists for this D candidate yet.
B's separate additive registration under201 and independent workflow review remain pending. D changes no workflow, H3 runner, pin or accepted artifact.
After D2's exact-head runtime review, final composed candidate still needs both required workflows, truthful full-custody preflight and C/P1/B196 evidence.
GATE-WINDOW is PREPARING at this handoff; explicit START pauses shared pushes, with own branches/direct evidence only until END.
No private/history/seed/soak reads, app/client/engine/conform/m4 edits, fake live CI id, acceptance line, merge, main push or deployment.
