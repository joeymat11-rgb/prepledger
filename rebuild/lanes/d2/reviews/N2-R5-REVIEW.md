# N2 R5 scoped independent review
2026-09-13 · Lane D2, Astra MAX · REJECT · One P2 producer finding remains; PM judges.
Exact candidate:19aa865e63c25b1541180a7dbdc0dd47690f5c92, rebuild/astra-c-n2-r4, draft PR54.
Source/test:80614ebacaaefae63c649965b080d9a49bd0067b. Reviewed predecessor:bdbee8b455b0530143c9df34d065c1204f70ee0f.
Bar first: accepted N2 v1.0 b0969edba4f55863ea3545ce4cebab751e37b019e84ae4c77f5babdb3208a517, source erratum, D2 aefc06f one-P2 bar and PM's scoped date/clock instruction.
Independent execution ended09:36 UTC; the updated43-line builder report at c/N2-R4-REPORT.md was read afterwards.

1. P2 · The producer still allows the caller to replace the save-time envelope.
C raised this additional concrete route while the fixed head was under review; D2 independently reproduced it through the actual exposed host.client.execute, public durable client and encrypted repository.
sleep-commands.cjs:115 permits input.effective; :131-135 copies it into action.effective. The new :228 date guard compares the night with that caller-supplied date, not necessarily the installation clock.
With actual host.today()2030-02-04, a raw sleep-night request for2030-02-04 supplies effective2030-02-05 and is acknowledged; one op and one outbox entry are added, with recorded save date2030-02-05.
A2030-02-05 future night with supplied effective2030-02-06 likewise acknowledges and writes once. Both installation clocks remain2030-02-04. The ordinary raw previous-night control records correctly with no override.
Own N2-R5-EFFECTIVE.test.mjs:3 tests,1 valid control PASS,2 ERR_ASSERTION failures,0 skipped; observed acknowledgment, op/outbox growth, installation day and recorded save date are all checked.
This violates the existing completed-night/client-owned save-stamp contract. Normal host.save and UI date refusals work; no normal-screen escape or security claim is made.
Refuse request-level effective overrides for this producer and let the client supply the save-time envelope. Prove zero writes through the raw client for supplied overrides, retaining valid past-night, correction and actual rollover behavior; no shared client/new clock/pin change is needed by this finding.

What the scoped correction does close:
The original unmodified R4 three-case witness now passes3/3 (its executed source SHA256 is unchanged602886d230f7d1bdd8596b51ed9c9695115229ae48d819c0b297ab31a6643268).
Current/future host.save calls refuse; valid previous/late nights keep distinct night and save dates. An already-open host uses the advanced installation clock, with old rows and outbox entries intact.
Own7 additional controls cover normal/month/year/leap boundaries, both hours and times refusal over an existing explicit-zero record, open-host clock advance and malformed save-calendar validation.
Exact-head scoped command:71 current sleep tests +3 unchanged R4 controls +7 independent controls =81/81,0 fail/cancel/skip. The separate raw-override contract test above remains RED.
Four independent source-load mutants produced6 ERR_ASSERTION failures in total: removed date guard, same-day permitted, save-calendar syntax-only, and frozen construction day. Each original control passed; no candidate source bytes changed.

Fresh exact19aa865 build and official Edge sleep-check PASS:
earned-06b4c2a34775,113 pinned inputs,3 assets,69 bound classes,2 fonts; all asset SHA256 values match the builder's report.
Seven verified profile-scoped process kills include actual before-commit and after-commit/before-acknowledgment boundaries. Both modes/correction, offline save, provenance, recovery draft, gym return and actual rollover passed.
390/320/375 widths, all5 input identities at48px/16px minimum, persistent doubled text, focus/Tab, primary reachability and no horizontal overflow passed. Physical iPhone NOT RUN.

Custody and reuse:
Exactly3 changed paths versusbdbee8b: sleep-commands.cjs, test/sleep.test.mjs and the builder report.19aa865 differs from80614eb only in that report.
The production delta validates calendar-real effective dates and adds the completed-night comparison. Five new actual-host tests and three corrected shape-fixture envelope dates are the only test changes; prior assertions remain.
Host, UI, browser harness, payload, setup.test.mjs, approved style/pins, engine/client/m4/conform/workflow are unchanged. B's reserved setup lookup hunk remains outside C custody.
R4's unrelated903-suite/18-cell/18-mutant/8-adverse results and all R3 closures remain attributed tobdbee8b/aefc06f; they are not relabelled as fresh R5 executions. Current sleep71 reruns its existing R3/R4 regressions.
C reports908/908 at80614eb; D2 did not replay that broad suite under this scoped instruction. Its identities and3 asset hashes reconcile, but the report's general client-clock claim is limited by finding1.

Hosted boundary:
Own public metadata: exact19aa865 automatic push rebuild34749615036 attempt1 FAIL, Ubuntu103703593598 and Windows103703593815 at H3 step13; later A0/Today/coach steps skipped.
Shared34749615089 succeeds on bothOS; pipeline34749615203 succeeds for suite/preview, production skipped. No rerun was requested or performed; these runs do not prove sleep registration.
B owns admitted71-test registration beside all13 prior Today files and the B1+B2 successor's bothOS evidence under178/186/232. The deferred admission is not another product finding.
No D2 H3/private/REAL-C2 execution or private-log read. The earlier bdbee8b chain-tip terminal remains attributed to B; current failed-step metadata alone does not establish the R5 terminal cause.
Next: C's bounded raw-producer correction and exact successor for scoped review; then PM's named disposition and B's admitted composition. No authority acceptance, seal, merge, deployment, import or phone PASS by D2.
