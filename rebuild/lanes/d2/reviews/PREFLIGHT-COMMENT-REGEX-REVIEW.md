# D2 shared preflight review, round 1

FINAL VERDICT: REJECT
Exact head: dae1fb24390915d23de16db09ae896c7b66a62f4, rebuild/astra-preflight-comments; codee03fbb5, base0e652ce213b56cd5d73a670e0a761cca8c94b6c3.
Own fresh tree: work/pm-caretaker/review-preflight-d2, branch rebuild/lane-d2-preflight-r1; resolved target containment checked before creation. Bar200 read before candidate; D report read after independent execution. No candidate edits.

1. P2, bar3: preflight-dash-scan.cjs:161 searches only a closing tag matching </name\s*>. Browsers also terminate script/style at end tags carrying attributes or a trailing solidus. The helper then treats visible HTML following that earlier close as an allowed JS/CSS comment.
Exact fixture: `<style>/* comment </style data-x><p>—</p> */</style>`. The actual preflight child reaches PREFLIGHT FAIL CI-UNVERIFIED, omitting the visible dash. Two other witnesses use </style/> and </script data-x> respectively. Real Edge renders a visible paragraph dash in all3; the style cases have no page error, the script case has an expected SyntaxError from its prematurely closed script.
Recognize the actual raw-text end boundary or refuse unsupported closing syntax before granting comment exemptions. Retain the known normal-end/comment positives and add these child-process negatives. This is visible-copy loss, not merely unsupported formatting or a demand for arbitrary data-flow analysis.
2. Required exact-head both-OS regression coverage remains unproved. Independent workflow search finds no command naming the shared preflight test in this head. B201 registration is separate; a green existing rebuild workflow cannot establish this43-test command ran on either OS. No workflow/pin change or fake CI id is authorized by this review.

Executed evidence:
- `node --test rebuild/lanes/tooling/test/preflight.test.cjs`:43/43, zero fail/cancel/skip. All7 declared mutations execute one selected ERR_ASSERTION each, with restored controls and no syntax/import/runtime-error kill.
- The actual public three-file C2b9b09a fixture preserves frozen26-hit refusal; corrected process classifies20 comment/6 regex lines and advances only to CI-UNVERIFIED. No successful CI id was supplied for that fixture.
- Ten additional actual-child controls passed: clean source; JS comments; escaped regex/class delimiters; comment-looking string; nested template boundary; invalid JS; HTML attribute; CSS string; HTML comment; CSS comment. Three additional malformed-closing witnesses incorrectly reached CI-UNVERIFIED.
- Independent Edge probe confirms the3 visible-dash outcomes over those exact synthetic HTML strings. This is separate browser evidence; it does not claim a rebuilt Earned app or physical iPhone behavior.
- All4 changed paths inspected: main172 lines, helper180 lines, existing test and D report. Existing six mechanical checks remain; candidate source is syntax-checked without evaluation. Tracked tree remains unchanged.
- D's report accurately discloses raw-character scope, unsupported syntax, the old26-hit FAIL and missing CI home. Its conservative-HTML claim is contradicted by finding1's actual browser boundary.

Executable annexes: PREFLIGHT-COMMENT-REGEX-PROBES.cjs and PREFLIGHT-COMMENT-REGEX-BROWSER.mjs. Run from the exact candidate root; the child fixture stays in its own .tmp and verifies cleanup containment. Browser annex uses the existing W6 Playwright dependency and W7_BROWSER_BIN; keep TEMP/TMP inside the review tree.
Next: D returns a narrow raw-text-boundary successor within200; B supplies201 coverage independently. Preserve this head/evidence and the original C preflight failure. No same-head rerun, package acceptance, integration or private/history read follows.
