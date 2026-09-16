# P3-IMPORT-UI - INDEPENDENT REVIEW, ROUND 3 (FINAL)

# VERDICT: REJECT

Reviewed sha 88d5e5450b37f921609bc1ba4a3b30ca69ee623d (+ ebc4f51c03f7d9a63e07465611e0ce98370af3a8),
branch rebuild/c-p3-import-ui off 7042576d51958078ea139665cfdbf991a02a0373: the SAME sha R1
(03957ee) accepted with two MAJORs, unchanged since, so both stand; this round's own cells
(%TEMP%\imp-rv\, never in the repo, synthetic bundles sealed by port.cjs from the author's
public-fixture harness) turn one R1 MINOR into the finding that decides the verdict.
The STOP is still sound and re-verified here: source-admission.mjs statically imports
rebuild/m4/import/* and m4/workout/engine-runtime.cjs, both FORBIDDEN by name in
today/build.mjs:45-64. Nothing is weakened (9 deletions, all runbook prose); no engine,
m3/w6, m4, measure, rebuild.yml or lanes/b/tooling byte moves. The REJECT is about the runbook
and report the PM will rule on, which misstate the identity question in the direction of
false safety. Every fix below is prose plus a test cell; no product byte.

## 1. Findings

**1. BLOCKING - the runbook says the machinery refuses another athlete's file. It does not.**
P3-RUNBOOK.md (this ticket's hunk): "another athlete's file refuses
LOCAL_SOURCE_PROGRAMME_UNRESOLVED and commits no basis". My cell RV3-1 seals a bundle that
differs from this installation's ONLY by `athlete_label` (same lifts, sets, split, tags) and
drives the author's own `admit()`: **admitted: true, basis committed, applied: true**
(revision 3 -> 5). source-admission.mjs `programme()` compares id/day/mg/sets/hi/inc/steps,
tags and priority_muscles; the bundle carries no athlete identity at all, and the ONLY
identity guard in the whole stack is the athlete's own `identityConfirmed: true`
(prepareSource:171, refusing LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED otherwise, RV3-2).
P3-R4 proves programme drift (R1 finding 5) under the title "ANOTHER ATHLETE'S FILE"; the
runbook repeats it as fact. The PM weighing section 3 option 3 ("moves an identity question
off the device") and a future screen author are told the door checks something it does not:
the misreport the ticket's "accept a wrong-identity bundle" bar exists to catch. Fix: state
the truth (a different programme is refused by name; the same programme is admitted on the
athlete's word alone, so the confirm control IS the guard and must never default to yes),
retitle P3-R4, and pin it with a label-only cell and an identityConfirmed:false cell.

**2. BLOCKING - pre-check 6 is still "DISCHARGED IN CODE" with no caveat (R1 MAJOR 2, open).**
Every admitting cell qualifies through `support.mjs:207` `id: 'TEST-ONLY-p3-mapping'`, a
producer mapping the harness authors for itself; the author's own report section 9.3 says no
production mapping exists in the tree and Joe's real bundle would refuse
SOURCE_ENGINE_CONTEXT_UNPROVEN. The runbook is the document the real run reads, and it
contradicts the report that explains it. One sentence fixes it.

**3. MAJOR - "nothing written" on a review-stage refusal or cancel is not something the
machinery can give, and the report does not say so.** reviewSource(name) reads from custody,
so importBundle (one durable commit: entry + original bytes + rebaseRequired) MUST run before
the review or the identity question can be shown. RV3-2/RV3-4: after a declined identity or a
programme refusal the record holds the stranger's entry, rebaseRequired: true, no basis;
local-client.mjs:314 then reports derivedCode IMPORT_REBASE_REQUIRED on every boot; there is
no remove/forget API (only markImportRebased, a false acknowledgement); today-app.cjs reads
none of derivedStale/derivedCode/imports, so the residue is silent. Bar (c)/(d)/(e) are thus
unsatisfiable under ANY section 3 option without a custody-removal or review-before-custody
path in m3/w6 (sealed). Belongs in section 3 as a constraint on every option and in section 9
as blocker 4. Only Unlock is write-free (RV3-3: unsealBundle, wrong words ->
BUNDLE_AUTH_FAILED, durable record byte-identical).

**4. MAJOR - the custody half is not "+2 modules", it is already shipped (R1 MAJOR 1, open
and understated).** The A1 dist at this sha carries `// rebuild/m3/w6/local/import-bundle.mjs`
with unsealBundle, qualifyBundle and importBundle in app.js (via local-client.mjs). Steps 1,
2, Unlock, every BUNDLE_* refusal and listImports cost the page nothing; only review/confirm
are walled. Section 3 still costs option 3 as if the page had none of it.

**5. MINOR - code names.** Custody answers `LOCAL_IMPORT_REBASE_REQUIRED` (import-bundle.mjs:522);
the boot flag is `IMPORT_REBASE_REQUIRED` (:65). The ticket names the second, the report only
the first; a screen's copy table needs both.

**6. MINOR - the prefix (order) question is never exercised.** Every cell has
`prefix_required` false (native_members 0, RV3-2) and `admit()` passes no prefixAnswer. A phone
with logged sessions has it true, and local-source-order.cjs:27 refuses any answer but `true`
with ORDER_EVIDENCE_REQUIRED: "No" is a refusal, not a branch. RV3-2 pins the question text to
source-admission.mjs:80 exactly; a repo cell should too (R1 finding 4).

**7. MINOR - S5 verdict predicted, not run, and wrong (R1 finding 3):** report says GREEN;
`b-package --ci --package S5` is `FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP` here, the ticket's
expected red, unrelated to drift. **8. MINOR -** coach/client/rig187 rows still missing from
the report (all green here). **9. MINOR -** report 126 lines vs 90 (disclosed).
**10. NOTE -** the edited heading "Move + unseal (phone) [U+2014] BLOCKED..." keeps one U+2014 in a
line this ticket wrote (PM doc, not athlete copy). **11. NOTE -** `--out` is
%TEMP%\imp-out-<random>\out, a sibling of the mandated %TEMP%\imp-out\ (outside every git
tree; privacy intent met). **12. NOTE -** RV3-5: the fall-back day itself (2026-11-01, noon
EST) admits on the live clock; both DST edges are in the harness calendar.

## 2. The door, in real Edge with the real clock
%TEMP%\imp-rv\edge-door.mjs served this sha's A1 dist on 127.0.0.1 and drove msedge
(playwright-core, w6 node_modules) at 390x844, real clock "Wed Sep 16 2026 12:31 GMT-0400
(Eastern Daylight Time)": Today's controls are "Your full nutrition plan", "How are you
feeling today?", "Log the scale", "Set up your week", "Ask your coach", "Report a problem",
"Measure"; `input[type=file]` count 0; the body never mentions import, history, bundle,
passphrase or earned-port; zero off-origin requests. Served import labels for the runbook:
none. Bar (a), (b), (e), (g), (h), (j) are unmet by necessity; neither the author nor I faked them.

## 3. Drift, census, suites (all my own runs on 88d5e54, TZ=America/New_York)
Drift: `git diff --name-only 7042576 HEAD` = lanes/c/P3-RUNBOOK.md, lanes/c/P3-IMPORT-UI-
AUTHOR-REPORT.md, m3/w7-preview/import/test/{support,live-clock.test,refusals.test,
page-bundle.test}.mjs; each findstr'd against lanes/b/tooling/packages/S5.json: not-in-S5,
all six. today-app.cjs and measure-view.mjs ARE pinned and untouched. SEALED DRIFT: NONE.
Census on the six files: zero U+2013, zero U+2014 except the six the runbook already carried
(one on an edited line, NOTE 10), zero CRLF.
```
P3 import cells:      tests 15   pass 15   fail 0   duration_ms 1519.4929
reviewer RV3 cells:   tests 5    pass 5    fail 0   duration_ms 1831.0453
today-17 (7 files):   tests 276  pass 276  fail 0   duration_ms 15390.4123
today-17 (6 files):   tests 369  pass 369  fail 0   duration_ms 5605.8704
today-17 (measure 4): tests 21   pass 21   fail 0   duration_ms 52085.4166
W6:                   tests 586  pass 586  fail 0   duration_ms 8699.2722
port:                 tests 65   pass 65   fail 0   duration_ms 2768.0262
coach:                tests 231  pass 231  fail 0
client:               tests 18   pass 18   fail 0
rig187 => PASS (5 OK rows, real and mutant)
A1 TODAY BUILD PASS: 3 assets; 121 pinned inputs (13 engine, 12 client); build earned-c41c7b74a73f; ... no em/en dash in any text the athlete can see
A5 PWA BUILD PASS: 13 files in .tmp\slice-pwa-dist; 11 precached and pinned by sha256; cache name earned-slice-9fae5d08f01c2584b2e175324855b894 ...
b-package --ci --package S5: FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP (expected red per ticket)
```

## 4. What closes this (no product byte)
1. Runbook: the identity sentence made true (finding 1); the producer-mapping caveat on
   pre-check 6 (finding 2). 2. refusals.test.mjs: retitle P3-R4; add a label-only-admits cell,
   an identityConfirmed:false cell and a prefix_question pin. 3. Report: custody-before-review
   as a constraint on every section 3 option and blocker 4 in section 9 (finding 3); the
   custody half already ships (finding 4); the S5 line and the three missing suite rows.
Then this reviewer would accept the stop, as R1 did.
