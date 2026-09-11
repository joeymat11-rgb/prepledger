# P1 · NO DASHES IN THE UI — copy sweep of the merged Today / gym card / check-in screens

Authority: DECISIONS:114 (1), owner verbatim "no ai dashes are allowed in the ui" (2026-09-11). Tier: screens
(one independent Opus reviewer, author ≠ reviewer, + CI green both OS; mechanical integration on ACCEPT).
Custody: rebuild/m3/w7-preview/today/** (+ its test/) and this brief's report rebuild/slice/P1-REPORT.md. Nothing else.
Base: origin/rebuild/t2-client-core at the time the builder starts (record the sha in the report). Branch: rebuild/polish-p1.

## The rule
No em dash (U+2014) and no en dash (U+2013) in ANY text an athlete can see: HTML templates, strings the JS renders
into the DOM (labels, hints, buttons, empty states, refusals, notes, aria-labels, placeholders, titles), CSS `content`,
the manifest/title strings the page owns. Code comments, test names, console output, report files and commit
messages are NOT user-facing and may keep their dashes (leave them alone; do not churn).

## How to rewrite (meaning must not change)
- Aside / apposition ("spike — damped in trend") → a colon or a new sentence ("spike: damped in trend").
- Range ("60–400 lb") → the word "to" ("60 to 400 lb").
- Label suffix ("Coach — not wired yet") → a colon or parentheses ("Coach: not wired yet").
- A dash used as a minus sign stays a real minus sign (U+2212) or a hyphen-minus, never an en dash.
- Text the ENGINE emits (rebuild/engine is frozen for this brief) that today/ renders verbatim: today/ normalises
  it at the render boundary with ONE small function (dash → ": " for asides, " to " for numeric ranges) that is
  unit-tested; the engine is not edited.

## Acceptance bar (written before the build; the reviewer executes every line)
1. New test rebuild/m3/w7-preview/today/test/copy.test.mjs: builds the page (build.mjs) and asserts ZERO U+2014/U+2013
   in every built HTML/JS/CSS asset, AND renders every screen state the existing browser/gym/checkin checks already
   produce (Today empty, Today with a reading, gym card active set, saved set, finish, recovery check-in each branch,
   refusals) and asserts zero dashes in the rendered DOM text. The test is enumerated in the same CI step as the
   other today tests (rebuild.yml is NOT in this brief's custody: put the file where the existing glob/enumeration
   picks it up, or record in the report that it needs the next re-seal and run it locally in the meantime).
2. Every existing today/gym/checkin test still passes with the same counts as the base (today 64 / gym 64 / checkin 28
   at :111, or whatever the base reports); native-carriers --ci PASS; A0 host 22/22 unchanged.
3. design.cjs's harvest of the approved 2026-09-08 design vocabulary: where the pinned reference itself contains a
   dash, the check compares DASH-NORMALISED (documented in one comment citing DECISIONS:114) so the owner's rule wins
   without weakening any other harvested word; the report lists each such term.
4. The report lists EVERY changed user-facing string as before → after, grouped by file, and states that no meaning
   changed; the reviewer spot-reads all of them and disagrees where a rewrite reads worse.
5. No file outside custody changed (git diff --stat proves it); no engine, conform, m4/spec, client, .github or pwa change.
6. Reviewer file rebuild/slice/P1-REVIEW.md with FINAL VERDICT ACCEPT / ACCEPT-WITH-FIXES / REJECT, own re-runs listed.

## Report
rebuild/slice/P1-REPORT.md per rebuild/t2/REPORT.txt: factual, short, every claim executed (commands + counts).
