# Gym-card settings independent review, round 2, D2, 2026-09-12

FINAL VERDICT: REJECT. Sole blocking condition: R2-1 below. This supersedes the round-1 verdict; it is a lane review, not PM acceptance or merge authority.

Exact Claude candidate rebuild/lane-c-settings @ 3c5d4c1be96f9dd107cbe936865f4318004d162a, base 05b73e2. Original GYM-CARD-SETTINGS-DISPLAY-BRIEF.md unchanged; C REQUESTS 14:41 supplies changed cells. Own sparse worktree work/lane-d2/review-settings, branch rebuild/lane-d2-review-settings-r2. Brief/bar and original findings before independent execution; builder report last. Effort MAX, no private input.

## Finding
R2-1. BLOCKING, P2, mount ownership: gym-app.mjs:136 always calls paint when a background settings read settles. That closure still owns the shared phone element after Back or check-in navigation. Independent real-workout probe: start a delayed read, await the now-visible log control, press the actual Back button, replace the phone content in onBack, then release the read. The old gym card replaces the destination screen. Exercise-keyed caching prevents one lift's settings appearing on another, but does not establish that the gym mount still owns the surface. Cancel or invalidate the mount/read work on exit, and guard both the delayed callback and any asynchronous repaint before replacing shared content. Test Back and check-in with deferred success/failure; the destination and its draft must survive. No pinned-entry edit is implicitly authorized.

## Round-1 closure
- Initial blocking render symptom FIXED: a pending settings read no longer delays the card, and real log-control tests execute while it is pending. The still-current-mount requirement from finding 1 is not closed; that is R2-1.
- Finding 2 CLOSED: pending, failed and confirmed-empty are distinct; failed reads retain the gym card and disable the replacement editor. Independent three-assertion failure probe passes.
- Finding 3 CLOSED: the real log handler is now tested without saved settings and with unsaved text. S-M6 variant requiring a cached saved record is killed by four tests.

## Independent evidence
- machine-settings-ui.test.mjs 48/48; serial combined today/coach/W6/host suites 1,272/1,272. All ten mutation variants killed; failed-test counts S-M1 through S-M10: 5,7,3,4,1,4,1,4,35,5. Tracked bytes restored and settings 48/48 rerun.
- Build PASS, 3 assets and 107 inputs. machine-settings-check.mjs PASS at this exact head, including three verified Edge process kills, real log-with-editor and both viewport checks. Five boundary files (bindings plus four PAGE_PINS) remain byte-identical to integration. No candidate engine/client/m4 edits.
- GitHub API verified CI 34712392062 at the full head: Windows and Ubuntu success; deploy/preview CI 34712392072 success, production skipped. The new settings suite remains outside the workflow's enumerated steps, as disclosed.
- Local B-NTC remains custody-blocked by the excluded src/history.js traces dependency established in round 1; not rerun or bypassed. Remote exact-head gate green. No raw logs, private input, deployment or authority acceptance.

The builder's late-answer claim holds for exercise identity, not navigation ownership. Return an exact head with the deferred-read navigation regression closed. Repro and commands are in GYM-CARD-SETTINGS-REVIEW-ANNEX.md.
