# N1 independent review, round 2, D2, 2026-09-12

FINAL VERDICT: REJECT. Sole blocking condition: R2-1 below. This supersedes the round-1 verdict at a7c91a1; it is a lane review, not PM acceptance or merge authority.

Exact Claude candidate rebuild/lane-c-n1 @ ae26fee2a9d5f37b196757c92d85b85008dc92ba, base 05b73e2. Original N1-NUTRITION-BRIEF.md unchanged; C REQUESTS 14:41 supplies changed cells. Own sparse worktree work/lane-d2/review-n1, branch rebuild/lane-d2-review-n1-r2. Bar/findings first, independent execution before builder report; effort MAX. No private input.

## Findings
R2-1. BLOCKING, P2, save/read-back failure: today-app.cjs:258-264 foodEntryFor.save awaits refresh AFTER host.save has acknowledged a durable operation. If that subsequent read fails, recordIntake at :708 only runs finally and lets its event promise reject. The committed intake receives neither saved feedback nor an actionable read-back failure. Independent host-backed probe reproduces one durable op, a rejected foodPending promise and empty food-error after a simulated refresh failure. Handle commit and refresh as separate outcomes: retain the known acknowledgment, show saved-but-read-back-unavailable guidance, keep the draft, and permit retrying the read without submitting another intake. If the save outcome itself is unknown, say unknown rather than asserting no part was stored. Add real-control tests for both boundaries. N1-REVIEW-ANNEX.md contains the same save/refresh sequence used by the product wrapper.

## Round-1 closure
- Finding 1 CLOSED: protein-only and calories+protein on clean init now remain durable and visible from the winning op; rejected engine projection is named. Independent additional probe: 8 assertions across those shapes. The writer is still the engine's; no target is fabricated. This is an explicit unavailable projection, not a claim the engine consumed that day.
- Finding 3 CLOSED for returned refusals and failed opening: the client's reason and next action render; entered values survive. The unrelated pinned unwired-plan sentence remains last, as disclosed; do not interpret this review as a pin waiver. R2-1 covers the separately thrown post-commit read failure, which those new tests omit.
- Finding 4 CLOSED: stored effective time/offset render after correction and reopen. Finding 2 remains withdrawn as an enrollment bypass; programme setup and device enrollment are distinct. The original browser gap is resolved.

## Independent evidence
- food.test.mjs 52/52; combined today/coach/W6/host suites serially 1,276/1,276. Twelve independent P1-P12 variants killed, restored tracked diff empty and food 52/52 again. Failed-test counts: 3,1,7,7,3,3,3,1,1,15,4,14.
- Build PASS, 3 assets and 107 inputs. food-check.mjs PASS at this exact head, including three verified Edge process kills and both 390x844/320px viewport checks. Five boundary files (bindings plus four PAGE_PINS) byte-identical to current integration; no candidate engine/client/m4 changes.
- GitHub API verified CI 34711340016 at the full head: Windows and Ubuntu success; deploy/preview CI 34711340026 success, production skipped. The new food suite still has no workflow step, as disclosed. CI is inherited-suite evidence, not N1 cell coverage on both OS.
- Local B-NTC is custody-blocked by its traces child's excluded src/history.js dependency, established in round 1; not rerun or bypassed. An authorized owner may run that gate. No raw logs, private records, deployment or authority acceptance in this report.

The builder correctly fixes the original protein, returned-refusal and provenance paths. Return an exact head closing R2-1; a successful save followed by a failed read must not become an unhandled result.
