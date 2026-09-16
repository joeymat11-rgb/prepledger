# P3-ADMIT-DECISION-BRIEF REVIEW (independent, Opus high)

VERDICT: ACCEPT

Reviewed a2488fb73fe7120586816eaf1d4190d5f02124e5 in a detached worktree at that sha (w5/w6 pnpm trees
junctioned in, no install). I re-measured every route with my own harness (one wrapper entry per row,
buildBrowser + assertBundleInputs), ran the A5 build, and checked every file:line citation. Module
counts and the A5 manifest reproduce EXACTLY; two byte rows do not. Nothing moves the ranking.

## My measurements (same sha, TZ America/New_York, wrapper entry `import * as M from ...`)

```
A  today-entry only                     122 modules  1 660 843 B  law PASS
B  + local/import-bundle.mjs            122 modules  1 662 783 B  law PASS   (+0 modules)
C  + local/browser-entry.mjs            123 modules  1 663 770 B  law PASS   (+1 module)
E  ROUTE 1, host mirror swapped in      133 modules  1 920 927 B  law REFUSE (+11 modules)
F  Import document alone                 82 modules  1 358 961 B  law REFUSE
A5 run: 13 files, 11 precached, 13 header rules, cache earned-slice-9fae5d08f01c2584b2e175324855b894;
shipped A1 app.js 1 660 911 B; migrate.cjs 184 433 B; merge.cjs 85 402 B
```

Row E's flagged inputs, measured: migrate.cjs, merge.cjs and exactly six m4/import files
(local-source-profile, local-source-order, daily-history, replay-core, engine-provider, browser-replay);
seed.cjs, index.cjs, engine/test/** and engine-runtime.cjs are ALL gone, with no stub plugin. The
central finding is confirmed; the 38 it corrects is real (P3-IMPORT-UI-AUTHOR-REPORT.md:30).

## Findings

1. [MEDIUM] Rows B and C's BYTES do not reproduce and contradict evidence already on this branch. The
   brief claims +21 B for import-bundle.mjs and +145 B for browser-entry.mjs; I measure +1 940 B and
   +2 927 B, and P3-IMPORT-UI-REVIEW-R1.md:31,33 measured those rows at 1 662 891 B and 1 663 918 B,
   within ~130 B of mine. The MODULE counts (122, 122, 123) reproduce exactly, so Fable (iii) stands and
   custody costs no new module; but 1 660 783 / 1 660 907 and the cell "+0 modules, +21 B (custody
   only)" should read about +2 kB and +3 kB.

2. [MEDIUM] Route 1's delta is understated and harness sensitive: +260 084 B (+15.7%) on my run, not
   +220 273 B (+13.3%), from the identical module set (a namespace import retains exports tree shaking
   drops). The honest row is "+11 modules, of order +220 to +260 kB"; the +11 and the set are exact.

3. [MEDIUM] The sealed bytes row omits rebuild/m3/w6/local/today-bindings.mjs, which IS pinned by B-NTC,
   H3, S3, S4 and S5 (line 228 of each package json) and which GATE-AUDIT-SPEC-P2 answer 4 names as "a
   plausible landing spot for the consumer work, so the consumer wiring must avoid it or ride the next
   re-pin". The row survives only on a precedent the brief never cites, local-source-basis.mjs:15:
   "today-bindings.mjs is pinned and is not edited". The Route 1 ticket carries that constraint.

4. [MINOR] Seven citations sit one to four lines early: build.mjs FORBIDDEN migrate :47 (brief :45),
   merge :48 (:46), m4/import/* :53 (:52), engine-runtime :62 (:61), A2's reason :56-61 (:55-60);
   source-admission qualify :74 (:70), order.review :78 (:77). Everything else is on the byte:
   source-admission :16-19, :43, :66, :80, :83, :168, :171, :205; import-bundle :508, unsealBundle :257;
   local-client :318; import-custody stage :121, load :142, NO remove; engine-provider :3;
   local-source-order :27; engine-runtime-host :13-16; port.cjs :711-713, :728; measure-view.mjs :183
   (under w7-preview/measure/); sw-source.js :26, :88; shell.cjs :49, :76, :127; build-pwa :111.

5. [MINOR] Route 2's totals do not add: 1 660 762 + 1 215 433 is 2 876 195, not 2 876 468; the derived
   +995 433 B is that total minus Route 1's 1 881 035, so it is the gap between the routes, not
   "duplicated bytes". My F run reproduces 82 modules exactly. Separately, "renderMeasure finds
   [data-slot=measure-baseline-note] after each paint" is a proposal in the present tense: the selector
   is nowhere in today-app.cjs. The slot does exist (measure-view.mjs:183), so the design works.

6. [MINOR] Counting slips: the m4/import lane holds eight modules plus test/, not six (prepare.cjs and
   reading-replay.cjs never enter the graph; the body's "six files" is right, the summary is not); the
   astra annexes are three files, not two; and sessionMembership is not "the only Runtime name
   source-admission.mjs uses", since the runtime goes whole to EngineCapture at :143. The mirror still
   substitutes, because it publishes the same frozen five name facade (engine-runtime-host.cjs:54).

7. Producer mapping, checked and agreed. All eight createProducerRegistry sites are harnesses or review
   annexes (w6/test x3; import/test/support.mjs:207, id TEST-ONLY-p3-mapping at :198; m4/import/test
   x3; lanes/astra/reviews x3): no production mapping exists and it is route independent. The pin list
   matches qualify() field for field (local-source-profile.cjs:69-80), SOURCE_PINS :5-18, native-Date
   vectors :48-65. Unnamed: clockAt (:36) refuses unless the calendar zone equals the DEVICE's resolved
   timezone, so the zone is a runtime condition on Joe's phone too.

8. Constraints (i) and (ii), checked. The identity question matches source-admission.mjs:80 character
   for character; identityConfirmed is a bare boolean, so the screen does author the whole identity
   check, and Route 3 says plainly that it answers that question off the device that holds the identity:
   (i) is not papered over. For (ii), unsealBundle (:257) takes bytes, a passphrase and crypto and never
   reaches a repository target, while importBundle, listImports, importOriginal and markImportRebased go
   through dispatch(target, ...) at :593-596: the ordering argument is sound, and the residue case is
   costed as a separate size S retract ticket.

9. Route 3, verified not viable. browser-entry.mjs (lines 6 to 20) exports no generation and no ops;
   importOriginal returns the bundle's own bytes and the boot payload exposes an ops COUNT only
   (local-client.mjs:305-318), while admission needs the phone's current ops (:78) and era scope (:43).

10. Working days: real evidence, thinner than the column suggests. S4 (:438, :440, :447, :448, :449,
    :450) and S5 (:459, :465, :466, :467) each ran author to merge inside ONE day, 2026-09-16, at four
    and two rounds, and answer 6 does cost a REJECT 2 to 4 days. Since every round landed the same day,
    3 versus 3.5 is a cushion, not a measurement, and carries no weight here.

## Does the recommendation follow, and is an owner decision needed

Yes, and no. Route 2 buys a second input law, a second shell, a service worker that must tell two
documents apart (sw-source.js:26 SHELL is index.html, :88 sends every navigation to it), a new A5 cache
name and a full re-download for every installed athlete, and close to a megabyte more served, for an
answer to (i) and (ii) identical to Route 1's; Route 3 fails on a verified fact, not a preference. So
Route 1 minimal is right, and the producer mapping really is the blocker that sets the date. No owner
decision is needed for Routes 1 or 2: the one open judgement is a REVIEWER's, whether migrate.cjs and
merge.cjs may run in a browser realm on Joe's phone inside the proved native-Date capability, and the
brief hands it to the ticket with a red first cell attached, which is its right place.
