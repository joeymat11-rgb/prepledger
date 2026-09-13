# N2 sleep entry: R5 completed-night correction
2026-09-13 · Lane C, Astra · READY FOR SCOPED INDEPENDENT REVIEW; not PR-READY.
Branch: rebuild/astra-c-n2-r4 · draft PR54 · own worktree work/pm-caretaker/c-n2-r4.
Reviewed predecessor: bdbee8b455b0530143c9df34d065c1204f70ee0f; its exact R4 report remains at this path in that commit.
Source/test successor: 80614ebacaaefae63c649965b080d9a49bd0067b; the following report commit changes only this file.
Contract: accepted d2/BRIEF-N2-SLEEP-ENTRY.md v1.0,167/178, erratum; PM's bounded post-review correction instruction.
Contract SHA256: b0969edba4f55863ea3545ce4cebab751e37b019e84ae4c77f5babdb3208a517.
D2 final R4: aefc06fefb43f50a5443d293331ca41c1468827d, d2/reviews/N2-R4-REVIEW.md, one P2 producer finding.
D2 closed all six R3 observations at bdbee8b; its independent903/18cells/18mutants/browser evidence and old744c63c remain historical evidence.

Delta from bdbee8b: only sleep-commands.cjs and test/sleep.test.mjs,63 additions/4 deletions, plus this report update.
The producer rejects night.date >= the calendar-real effective.local_date on the envelope the client built for this commit.
It uses the installation clock's actual save day, including after midnight; the chosen past-night label is retained.
The host already routes writes through this validator, so no host, UI, clock, payload shape or shared binding edit was needed.
Three N2-01 shape fixtures now carry a valid next-day envelope, keeping their existing positive/negative shape assertions isolated.
No change to setup.test.mjs (B's reserved successor-lookup hunk), browser harness, approved style/pins, engine/client/m4/conform/workflow.

New actual-host regression controls (public durable client plus encrypted repository):
Previous2030-02-03 and late2030-01-30 on save day2030-02-04 each append one op/outbox and retain the correct night/save dates.
Same-day2030-02-04 and future2030-02-05 refuse with zero op/outbox growth and unchanged collection contents.
An already-open host first refuses tonight, then admits that same night after the installation clock advances to2030-02-05.
That rollover then refuses the new current/future nights, preserving the accepted row and its outbox.
Red on bdbee8b product:5 tests,2 valid controls PASS,3 ERR_ASSERTION failures,0 skipped.
Green with the guard:5/5,0 fail/cancel/skip. Logs: .tmp/n2-r5-date-red.log and n2-r5-date-green.log.

Exact80614eb Node22.23.2 required suite:908/908 PASS,0 fail/cancel/skip; sleep71 included.
Command: node --test --test-reporter=tap --test-concurrency=1
  rebuild/m3/w7-preview/today/test/*.test.* rebuild/coach/test/*.test.cjs
  rebuild/m3/w6/test/local-today-journey.test.mjs rebuild/m3/w6/host/test/*.test.*
Counts: Today624 (sleep71), coach201, local journey51, A0 host32. Log: .tmp/n2-r5-required.log.

Fresh80614eb build and official sleep-check browser PASS;113 pinned module inputs,3 assets, earned-06b4c2a34775.
Seven verified profile-scoped process kills, including before commit and after commit/before acknowledgment; offline save and actual rollover pass.
Both modes/correction, provenance, recovery draft and gym return,390/320/375, all five inputs48px/text16px and doubled text pass.
app.js SHA256:4f13f7b2423d14298d6d40ef4f40f80c59b93a7040f8f2f11947f4ec10358ad3.
styles.css SHA256:567a3a3c4677aeed2dcb2090d5fbf4fc31a3a5b47680dabc7bee4f09f3b35cbb.
index.html SHA256:f691d5c31447047a02b50004e105f89d58469079fcf219ede146d4f2471b6f2d.
Logs: .tmp/n2-r5-browser-build.log and n2-r5-browser.log. Physical iPhone NOT RUN.

CI/admission remains separate: B owns sleep.test.mjs registration (now71) beside all13 prior Today files and B1+B2 bothOS proof.
Original bdbee8b rebuild34748446936 bothOS stopped at H3 SEAL-BASE-IS-NOT-THE-CHAIN-TIP before children; no N2 product verdict.
No H3/REAL-C2/private run or blind CI rerun was performed. Original refusals and prior harness failures remain at their exact evidence heads.
Next: D2 scoped independent date-boundary verification of this successor, then B's admitted exact-head CI composition and third-role integration.
