# D2 shared preflight successor, round 2

BOUNDED RUNTIME VERDICT: ACCEPT. R1 finding1 is closed; exact both-OS coverage and final composition acceptance remain pending.
Exact head: aab62dd38079b54db63fd690c908517e2c686167, rebuild/astra-preflight-comments; runtime1f4674fa851f00d88491016e03f124325dd4e66c.
Own existing tree: work/pm-caretaker/review-preflight-d2, branch rebuild/lane-d2-preflight-r2. Bar200 and R1 findings first, independent execution next, revised builder report last. No candidate edits.
Delta from rejected dae1fb2: lexical helper, existing test and report only; main checker unchanged172 lines, helper183, report53. No workflow, dependency, app, pin or private change.
The helper now locates the first ASCII-delimited matching raw-text end-tag prefix, then refuses noncanonical closing syntax before granting JS/CSS comment exemptions. It does not search past an earlier browser-recognized closing tag.
Exact suite:45/45, zero fail/cancel/skip. All8 source mutants produced one selected ERR_ASSERTION each, with restored controls and no runtime/syntax/import-error kill; the eighth reinstates the late-boundary search.
Independent actual-child controls:17/17. The same3 R1 witnesses now return UI-CUSTODY-SYNTAX;10 earlier controls remain correct;4 additional canonical mixed-case/ASCII-whitespace controls distinguish allowed comments from visible following text.
The committed suite independently executes20 malformed-closing cases across script/style/textarea/title plus4 canonical clean/visible assertions. R1's three Edge-rendered witnesses remain unchanged reference evidence; no duplicate browser run was needed for identical HTML strings.
The frozen real C fixture still reproduces26 raw hits, then classifies20 comments/6 regex lines and reaches only CI-UNVERIFIED. Genuine tracked/untracked copy, unknown syntax, custody/report/status/count and terminal/CI-id controls remain passing.
No new runtime finding within200. The lexer is deliberately conservative and measures raw dash characters; escaped-value/data-flow/rendered-output completeness is outside this bounded tool. P1 remains mandatory.
Executable independent annex: PREFLIGHT-COMMENT-REGEX-R2-PROBES.cjs; run from this exact checkout root. Public fixture creation/cleanup stays in its .tmp with resolved containment checks.
R1 finding2 remains an external evidence dependency: this exact head has no workflow command for the shared preflight test. B201 registration and actual exact-head Windows/Ubuntu execution are still required before integration. No fake successful CI id or full package/preflight PASS is claimed.
Next: PM coordinates the separately reviewed workflow and final composed candidate; execute the required composed-head gate/CI/preflight and app checks in the stable window. D runtime work can remain preserved at this head; no same-head rerun without a new concern.
