# W7-PREVIEW — ASTRA report

## 1. Base and claim

Accepted integration base: `9a42b10eb3a66c238dba7b2ad28dc8afb9924709`. Branch: `rebuild/m3-w7-preview`. Start receipt/brief published in `ec1864d3805f4da44696a6d585a013ca897ad974`, 2026-09-06 05:19:51 UTC. This executes the queue's READY W7-PREVIEW slice, independent of unpublished W5 and unaccepted W6 contracts. It neither duplicates the reserved audit/W5 tasks nor imports PR26's code. Cowork acceptance and integration remain pending.

## 2. What and why

The ratified Today face now runs against explicit synthetic history and unchanged accepted engine readers. A morning entry changes the temporary model and recomputes Today and Why; reload discards it. There is no sign-in, athlete request, local persistence, service worker, server receipt or durable Saved/Synced claim. The separate preview banner says exactly what happens.

The full engine entry point also imports historical seeds. Shipping that entry point would defeat the public preview boundary. Instead, `browser-engine.cjs` composes nine unchanged reader modules with empty seed/history inputs; `fixtures.cjs` supplies every sample fact from scratch. Local tests compare its complete exposed projection with the full engine in both Date modes. The limited morning edit is compared against the actual `applyRead` writer's whole resulting state for ten synthetic weights. No engine file changes.

## 3. Mock mapping and substitutions

Pinned public artifact: `rebuild/m1/earned-mock.public.html`, SHA256 `e742d6b89cfc34d0a23004fd9257252136adb1f44e38a4a2a41aa9ba6f617563`, identified by `rebuild/m1/MOCK.md`. Build extracts exact T02 (morning), T01 (logged) and T08 (Why) template bytes and original styles; a changed artifact fails its pin. The private original was not used for this preview.

All displayed sample readings, trend/rate, calorie range, protein target, freshness and dependent explanations are replaced with model projections. Yesterday's plan uses its own as-of clock/snapshot. Why receives the actual engine's explanation and status cause, rather than the mock's example justification. Temporary-entry wording replaces Save/Saved; workout activation explicitly says that no workout starts. Preview controls sit outside the product face. Keyboard activation, modal focus/escape and heading semantics were added without changing product rules. Google Instrument fonts follow the mock; system fallbacks remain if unavailable. This is not an offline-font claim.

## 4. Focused verification

Reproduce from the repository root with Node 22/24 and a **real node_modules directory** installed from the unchanged root lockfile:

```text
node --test rebuild/m3/w7-preview/test/model.test.cjs rebuild/m3/w7-preview/test/view.test.cjs rebuild/m3/w7-preview/test/package.test.cjs
node rebuild/m3/w7-preview/build.mjs
node rebuild/m3/w7-preview/serve.mjs
```

Windows / Node 24.19.0 result:

```text
tests 19
pass 19
fail 0
W7-PREVIEW BUILD PASS: 3 allowlisted assets; 13 approved browser inputs; pinned T01/T02/T08
```

Eight model tests cover projection parity in both Date modes, whole-state writer parity, yesterday's basis, reset, invalid/duplicate refusal and defensive snapshots. Five view tests cover keyboard entry/cancel/back, truthful temporary status, engine-bound values/Why and deliberate template-binding mismatch. Six package tests cover exact artifact bytes, allowed inputs/assets, extra-file refusal, HTTP headers, traversal/source refusal and rejected writes. No account or private fixture is needed for these tests.

Chrome smoke on the running built package: morning → sample entry → recalculated Today → Why → back; reload restores the original morning example. Narrow viewport 320×740 and desktop 1280×900 had no document horizontal overflow, including the long Why text. Entry input computed font size exceeded 16px. No browser error logs were observed. A real Escape propagation bug found during verification was fixed; cancellation now returns focus without a second render. Final heading change passed all five view tests. This desktop smoke is not physical iPhone, VoiceOver, 200% text or cold-start evidence.

The existing Linux/Windows rebuild workflow now executes these 19 tests, retaining every previous step. CI results belong to the tested PR commit/run; no future CI or independent acceptance is claimed by this report.

## 5. Compatibility and package gates

Local full checks used AGENTS' private preparation with explicit ENGINE_MAIN/ENGINE_OLD, `MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York`; public paths were restored after private preparation. Strict ran with MEASURED_TEST_NOW unset. Private inputs/output stayed local; only the following verdicts are reported. Public-conformance used an explicitly pinned EARNED_CLIENT_DIR because PR26's requested fallback hardening is not on this base.

```text
FROZEN-PATHS PASS
OLD-PACKAGE PASS — 18 files; actual ZIP allowlist verified
PUBLIC-CONFORMANCE PASS: 99 reference GREEN; 99 STRONG (141 targeted mutants detected); 70 adapter GREEN; 29 RED-as-specified (policy/progression absent)
PUBLIC-ORACLE check PASS — 7/7 unchanged public oracle laws; private NOT RUN
PUBLIC-ORACLE sensitivity PASS — 9/9 unchanged public oracle laws; private NOT RUN
PUBLIC-CANDIDATE frozen PASS — 7/7 unchanged public oracle laws; private NOT RUN
PUBLIC-CANDIDATE native PASS — 7/7 unchanged public oracle laws; private NOT RUN
ENGINE-TRACK PASS — rig185 W1 PASS, W2 PASS on frozen engine; unchanged assertions
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
PASS  engine suite — 3072 assertions passed
PASS  18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
All checks passed. Safe to ship.
```

The PUBLIC lines deliberately describe their restricted runs; the separate full-suite/selftest followed local preparation. Strict's final phrase belongs to the unchanged old-app gate, not permission to ship M3. Final M3 SCOPE-FREEZE remains PENDING.

Build emits only index.html/styles.css/app.js under ignored `.tmp/w7-preview-dist/`. An explicit input allowlist refuses seed, full-engine entry point, migration/merge/writers, private paths and executable external dependencies; no source maps. Local server binds only 127.0.0.1, preloads three reviewed assets, refuses repository paths/traversal/writes, disallows application connections and workers, and uses no-store. Font requests are permitted; zero network traffic is not claimed. Dependencies, lockfiles, frozen app, engine, conformance suite and seeded soak are unchanged.

## 6. Seams

- This is a preview adapter, not the W6 committer: no operation/outbox/enrollment/lease/signature/receipt contract is implemented. W7 integration must replace memory state with accepted W5/W6 interfaces and operation history.
- Only the fasted, unsealed morning branch is modeled. Late/corrected reads, migration, other devices and provenance/consent paths are not supported. Empty historical inputs must never be reused for the owner's port.
- Nominal morning/logged screens and Why are implemented. Unusual sample weights can yield HOLDING/NEEDS YOU/unknown engine output; related proposal/consent flows and other ratified Today states remain unbuilt. Passing sample parity does not establish every Today flow.
- The server is PC-local and not installed on a phone. No I1-complete, PHONE-2, OWNER-TODAY, durable-storage, private-port or physical-device PASS is earned. W5/W6/W8/W9 and M2 close-out gates remain intact.
- QUEUE/DECISIONS changes record observed W0 acceptance, PR26 publication and this claim. They adopt no proposed budget or unmerged code; existing audit/W5 activity remains unconfirmed beyond previously observed local files.

## 7. Uncertainty and review

Cowork must re-execute the tests/build on Linux and compare the three bound views with the pinned public artifact. Physical iPhone 17 Pro/iOS 26.6.1 layout, VoiceOver/200% text and timing await W9. Font availability can alter wrapping. The preview bundle is an unoptimized development bundle; it makes no performance claim. W5's published wire table and W6 review/refinement remain inputs to real integration, not inferred fields here. A bounded same-family agent check found no further browser-bundle or projection blocker; it does not replace cowork's independent acceptance.

## 8. Wall-clock

Start receipt 05:19:51 UTC; local implementation/browser/gate work completed 05:33:34 UTC on 2026-09-06 (about 14 minutes). PR publication/CI and independent verification/integration are separate elapsed stages. This is measured work on this slice, not an estimate for the remaining app.

## 9. NEXT

W7-PREVIEW is published for cowork verification; no merge or self-acceptance. It supplies the synthetic face for **W7**, whose real binding remains blocked by published **W5-CONTRACT** and accepted **W6** interfaces. No other READY unclaimed Astra item is currently evidenced. Next action is **C-CLAIMS / W5-CONTRACT** progress recovery and PR26/this PR review; resume the existing W5/audit tasks without duplicates, then take W6 when its published inputs permit it. Owner account/phone steps remain the queue's separately prepared appointments, not a new coding task for the owner to choose.
