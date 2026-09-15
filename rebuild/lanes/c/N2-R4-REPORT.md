# N2 sleep entry: R6 correction to save dates
2026-09-13 · Lane C, Astra · READY FOR SCOPED INDEPENDENT REVIEW; not PR-READY.
Branch: rebuild/astra-c-n2-r4 · draft PR54 · own worktree work/pm-caretaker/c-n2-r4.
Reviewed predecessor:19aa865e63c25b1541180a7dbdc0dd47690f5c92; its exact R5 report remains at this path in that commit.
Source/test successor:60e24a8b757007f6344c598d3c6c3ca7a895d529; the following report commit changes only this file.
Contract: accepted N2 v1.0,167/178, source erratum and PM's bounded producer/test correction instruction.
Contract SHA256:b0969edba4f55863ea3545ce4cebab751e37b019e84ae4c77f5babdb3208a517.
D2 final R5:720b317af8cf99972aadf5572786c0a31ca7c9b9, d2/reviews/N2-R5-REVIEW.md; one P2 caller-stamp finding.
Its ordinary host/UI date closure and prior R4/R3 evidence remain attributed to their exact reviewed heads.

Correction: prepare refuses request input.effective and no longer emits action.effective.
The client consequently supplies this sleep action's save-time envelope from the installation clock.
The R5 calendar-real/completed-night commit guard remains; the athlete still chooses the past-night label.
Every supplied override is refused, including a matching real-day stamp or a backdated stamp for a valid past night.
Delta versus19aa865: sleep-commands.cjs and test/sleep.test.mjs only,79 additions/7 deletions, plus this report update.
Host/UI/shared client/clock/payload/style/pins/browser harness/setup.test.mjs/engine/conform/workflow remain unchanged.

Six actual raw-client/encrypted-repository regressions were added:
Four override cases: current night/tomorrow stamp; future night/later stamp; previous night/matching stamp; late night/backdated stamp.
Each starts with a distinct existing explicit-zero observation, then asserts refusal, zero op/outbox growth and unchanged collection contents.
Healthy controls exercise raw past-night save, correction from zero hours to times, and an already-open client across midnight/correction.
The midnight case first refuses tonight, then admits it only after the real installation clock advances; both appended observations retain their dates.
Red on19aa865 product:6 tests,2 healthy controls PASS,4 ERR_ASSERTION failures,0 skipped.
Green with the correction:6/6,0 fail/cancel/skip; the existing71 tests remain.
Logs: .tmp/n2-r6-override-red.log and n2-r6-override-green.log.

Exact60e24a8 Node22.23.2 required suite:914/914 PASS,0 fail/cancel/skip; sleep77 included.
Command: node --test --test-reporter=tap --test-concurrency=1
  rebuild/m3/w7-preview/today/test/*.test.* rebuild/coach/test/*.test.cjs
  rebuild/m3/w6/test/local-today-journey.test.mjs rebuild/m3/w6/host/test/*.test.*
Counts: Today630 (sleep77), coach201, local journey51, A0 host32. Log: .tmp/n2-r6-required.log.

Fresh exact60e24a8 build and official sleep-check browser PASS;113 pinned module inputs,3 assets, earned-328bbbb598b5.
Seven verified profile-scoped process kills include before commit and after commit/before acknowledgment; offline save and actual rollover pass.
Both modes/correction, provenance, recovery draft/gym return,390/320/375, all five inputs48px/text16px and doubled text pass.
app.js SHA256:a55ca0530e6cc030f5264da4468f26c0663f2dccae80f184e445fa7b1483de56.
styles.css SHA256:567a3a3c4677aeed2dcb2090d5fbf4fc31a3a5b47680dabc7bee4f09f3b35cbb.
index.html SHA256:f691d5c31447047a02b50004e105f89d58469079fcf219ede146d4f2471b6f2d.
Logs: .tmp/n2-r6-browser-build.log and n2-r6-browser.log. Physical iPhone NOT RUN.

CI/admission: B owns sleep.test.mjs registration (now77) beside all13 prior Today files and admitted B1+B2 bothOS proof.
Prior19aa865 rebuild34749615036 failed bothOS at H3 step13 with later Today skipped; metadata does not establish its terminal cause.
Original bdbee8b chain-tip terminal remains attributed to B. No H3/REAL-C2/private run or blind CI rerun was performed.
Next: D2's scoped raw-producer/stamp verification, then PM disposition, B's admitted exact-head CI and third-role integration.
