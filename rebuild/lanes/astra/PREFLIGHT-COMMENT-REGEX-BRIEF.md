# Shared preflight: allowed comments and regex syntax

Prospective public-plumbing assignment under DECISIONS:200. Authority: owner rule114, accepted P1 brief lines9-12 and121/185, mechanical preflight135, Astra PM handover193. Author: D, in a new own worktree beneath work/pm-caretaker. Independent reviewer: D2 after its current launch candidate review. PM judges; a third role integrates only after required checks.

## Observed mismatch

On C candidate2b9b09a, shared preflight scans every raw source line in its declared UI files and fails on26 hits:20 comments and6 regex lines, all exact lines already on integration. PM and independent read-only audit verified this. P1 expressly excludes comments from user-facing copy and says not to churn them. Regex syntax used to detect/normalize forbidden characters is not itself rendered copy. The actual P1 build/render guards remain mandatory.

Keep the original C terminal FAIL on record. Do not omit files from declared UI custody, edit/escape application comments or guard literals just to clear this check, or pretend the current executable passed.

## Licensed change

Only `rebuild/lanes/tooling/preflight.cjs`, its existing `test/preflight.test.cjs`, optional new `preflight-dash-scan.cjs` in the same tooling directory if needed, and D's report/brief notes. Keep the preflight's current200-line cap and all six existing mechanical checks. Any helper must be small, bounded and included in the test fixture's actual child-process execution. No new dependency, app/engine/client/conform/m4 change, workflow edit, accepted artifact/pin/receipt edit or private/history/soak access. Report before extending these paths.

Correct only the comment/regex false positives. Recognize their actual lexical context; never strip a comment-looking sequence from a quoted string, template segment, HTML attribute or CSS content. Keep string/template/HTML/CSS text checks conservative and keep the existing P1 rendered-output guard as the authoritative final UI proof. This tool need not infer arbitrary data flow or claim complete rendered-text analysis. Ambiguous, unsupported or unterminated syntax must fail clearly rather than disappear into an exemption. Do not run candidate source code to classify it.

## Required independent evidence

1. Preserve a deterministic child-process reproduction of the original26-hit failure with all three runtime/UI files declared and the real candidate contents represented in an isolated public fixture. Record exact source/base identity and the comment/regex classification, not raw health or private content.
2. Positive controls: allowed JS line/block comments and actual regex syntax, with escaped delimiters and character classes; permitted HTML/CSS comments where supported; ordinary clean sources. The real C source scan must stop reporting these26 allowed lines.
3. Negative controls: genuine user-facing dash in tracked and untracked HTML, JS string/template text, attribute and CSS content; comment-looking strings, regex-looking strings and template interpolation boundaries. Preserve existing dash/no-custody disclosure, stray-file, report/count/status, CI-unverified/id-shape and exact terminal checks. Unknown syntax must not create PASS.
4. Every new exemption needs a source-mutation assertion failure plus a restored positive control. Run the actual preflight process, not a duplicate classifier that only the tests call. No skipped assertions or guessed sleeps.
5. Run `node --test rebuild/lanes/tooling/test/preflight.test.cjs` on the exact candidate. Identify the existing Windows/Ubuntu CI home and disclose any command-coverage gap; no workflow change is authorized here. Exact-head both-OS CI, independent execution and the current integration hold remain required before integration.
6. Do not supply a fake successful CI id to turn C's live preflight green. Until actual CI is green, an honest corrected scan may advance to `CI-UNVERIFIED`; that is not PR readiness. After final integration composition, rerun the real mechanical preflight with verified exact-head CI and all custody paths, plus C's P1 build/render negatives, B gate196 and D2's app review. A tooling-only test PASS is no package acceptance.

## Handoff

D publishes a separate `rebuild/astra-preflight-comments` candidate from the current integration, report<=60 lines with executed counts/limits and exact paths. C candidate stays frozen. D2 reviews this tooling candidate independently after completing its current C review; D never reviews its own change. B owns any necessary future CI registration/pin package. Product integration remains held by194 and the unresolved exact-candidate H3 failure. Preserve returning old-lane work and all prior reports.
