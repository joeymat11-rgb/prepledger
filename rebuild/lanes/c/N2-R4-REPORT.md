# N2 sleep entry: R4 builder report
2026-09-13 · Lane C, Astra · READY FOR INDEPENDENT REVIEW; not PR-READY.
Contract: rebuild/lanes/d2/BRIEF-N2-SLEEP-ENTRY.md v1.0, accepted by DECISIONS167/178, with SOURCE-ERRATUM.
Contract SHA256: b0969edba4f55863ea3545ce4cebab751e37b019e84ae4c77f5babdb3208a517.
Base: 8771a51c535cd92b89b537230b857c8fa8fbc472 (accepted launch M plus coordination only).
Candidate: 582b4a381e442e599f602be3428489c9cd34581e; this report's following commit changes documentation only.
Branch: rebuild/astra-c-n2-r4; own worktree: work/pm-caretaker/c-n2-r4.
Old rejected 744c63c974626fe7c00a6e5807c6a6bfb1dbee7b and D2 R3 findings remain preserved.

Custody: 12 licensed paths, plus this report; no engine, client, m4, conform, workflow or frozen-app edit.
Today: build.mjs, design.cjs, preview.css, screens.template.html, today-app.cjs, today-model.cjs.
New Today modules: sleep-commands.cjs, sleep-host.mjs, sleep-model.cjs, sleep-check.mjs, test/sleep.test.mjs.
Companion: rebuild/coach/local-world.mjs. Entry, bindings, check-in sources and approved-design pins unchanged.
PM explicitly licensed only the sleep-entry input min-height:48px selector in preview.css, under accepted167.
Shared store/client.hostBindings uses the installation clock; no local H3 default or replacement clock.

R3 coach observations C1/C2/C3: actual tools refresh authenticated durable rows, including another same-store client.
An edited night refreshes confirmation; disabled/unreadable sleep cannot be confirmed. Other draft answers survive.
R3 reconciliation immediate/retry: historical equal hours cannot acknowledge a failed new save or clear its draft.
Reconciliation requires a new op, matching attempted night, predecessor revision and device; unknown saves stay fenced.
R3 dated display: selected historical night reads the following day's quality and provenance; selection survives save.
Earlier recovery opens a dated read-only view. Stale-editor refusal refreshes the record while retaining typed input.
Extra regressions cover rollover, source units, active Start/set preservation, abort/outbox durability and fresh H3 hosts.

Node22.23.2 required suite at b0ece6ab9c9dc78e79fea7dbf81b71e2bb5cf0db: 903 PASS, 0 fail/cancel/skip.
Command: node --test --test-reporter=tap --test-concurrency=1
  rebuild/m3/w7-preview/today/test/*.test.* rebuild/coach/test/*.test.cjs
  rebuild/m3/w6/test/local-today-journey.test.mjs rebuild/m3/w6/host/test/*.test.*
Counts: Today619 (including sleep66), coach201, local journey51, host32. Only the browser harness changed since that run.
Named N2-01..18 cells actually executed: 6/3/3/6/12/5/3/5/3/2/1/7/2/5/1/4/1/1 passing tests; zero skipped.
18 separate mutation edits each produced assertion failures, not parse errors; originals restored.
M01..06: open payload, blank answer, invented span, wrong night, removed revision check, oldest-wins replay.
M07..12: lost draft, wrong quality day, missing boot rebind, old gym basis, fresh NaN, removed coach refresh.
M13..18: discarded basis history, historical-equality acknowledgment, enabled no-store form, dash, false commit, width.
Controls ran on the R4 working tree before final CSS/harness changes; prior assertions remain, with N2-11 strengthened.
A new browser control failed on the original44px date input before the licensed48px correction; undersized font also fails.

Final browser: PASS, source 582b4a381e442e599f602be3428489c9cd34581e, fresh build immediately before execution.
Build: earned-2ead98c80d20, 113 pinned module inputs, 3 assets, approved design/font/copy gates PASS.
app.js SHA256: 7a0b0fff99f0b38e731247d9c699eb3c478e53d7876847fafeefacb81511fcb1.
styles.css SHA256: 567a3a3c4677aeed2dcb2090d5fbf4fc31a3a5b47680dabc7bee4f09f3b35cbb.
index.html SHA256: f691d5c31447047a02b50004e105f89d58469079fcf219ede146d4f2471b6f2d.
The module-only build tag is unchanged by the CSS correction; the source commit and asset hashes identify that change.
Browser bar: seven verified process kills, including before commit and after commit before acknowledgment.
Offline times save, hours correction, provenance, same-page recovery draft and gym return, and actual clock rollover.
390/320/375 widths, all five inputs across modes/disclosure, doubled text, Tab and reachable single Save; input48px/text16px.
Prior13e8c76 browser PASS measured44px; it is not credited for the corrected48px bar.
Retained harness failures:1ee/b0 CSP copying/fetch; fa9 lost enlargement on redraw. Fixed using build bytes and persistent CSSOM.
Production CSP and console/off-origin failure checks remain unchanged. Physical iPhone acceptance: NOT RUN.

CI/public engine-package execution and sleep.test.mjs enumeration belong to B's active B1+B2 under214; pending.
B must preserve all13 existing Today test files, add sleep, and provide exact-head green Windows and Ubuntu results.
No engine gate/receipt, H3 run, independent acceptance, integration, import, deployment or phone PASS is claimed.
Optional all-W6 diagnostic hit REAL-C2's repository-output refusal before a bundle; preserved, never rerun or bypassed.
PM212 excludes that separate cohort from N2's required local suites; it is not a missing N2 pass.
Logs stay in own .tmp: n2-required-b0ece6a.log; n2-proof-results.json; n2-cell-* / n2-mutant-*; n2-input48-red.log.
Browser logs: n2-browser-build-final.log / n2-browser-final.log; preceding failures and13e8c76/0d96f79 passes retained.
Next: D2 independent execution of this exact candidate, then B CI registration/results and third-role integration.
