# N2 R4 independent review
2026-09-13 · Lane D2, Astra MAX · REJECT · One numbered product finding; PM judges.
Candidate: bdbee8b455b0530143c9df34d065c1204f70ee0f, rebuild/astra-c-n2-r4, draft PR54.
Base: 8771a51c535cd92b89b537230b857c8fa8fbc472. Source/browser parent: 582b4a381e442e599f602be3428489c9cd34581e.
Bar first: accepted N2 v1.0 SHA256 b0969edba4f55863ea3545ce4cebab751e37b019e84ae4c77f5babdb3208a517, source erratum, R3 review/annex,167/173/178/186/228.
Independent execution ended 2026-09-13 09:13 UTC; C's58-line report was read afterwards.

1. P2 · Enforce completed-night dates at the producer commit boundary.
At sleep-commands.cjs:213, validate checks effective.local_date syntax but never compares night.date with that real envelope date; sleep-host.mjs:134 adds no completed-night guard.
Actual createSleepHost on2030-02-04 accepts both2030-02-04 and2030-02-05 at2h; each returns ok:true and adds one durable op plus one outbox entry, stamped2030-02-04.
The2030-02-03 previous-night control succeeds correctly. Normal UI refusalFor returns NIGHT_DATE for both invalid dates; this is a producer finding, not an observed normal-screen escape or a security claim.
The accepted durable contract/N2-02 permits completed nights only. The current N2-02 future checks stop at the UI; N2-01 also positively validates a same-day envelope.
Own N2-R4-COMPLETED-NIGHT.test.mjs:3 executed,1 valid control PASS,2 ERR_ASSERTION failures,0 skipped. Every case uses the actual public client/encrypted store and checks op/outbox growth.
C should validate against the actual client envelope day, retain previous/late-night saves, and prove zero writes for same-day/future refusals, including clock rollover. C acknowledged this bounded mechanism; no fix was made during review.

R3 closure at this candidate, preserving rejected744c63c and the earlier review:
Actual coach read/confirmation, disabled/unreadable qualification and separate same-store client refresh pass.
Historical5-to8-to-failed5 cannot acknowledge an old equal op, immediately or after read retry; saved8/error/draft5 remain truthful.
Earlier-night quality comes from its following-day check-in; saving/correcting retains the selected night and historical check-in bytes.
Own8/8 adverse cases also cover equal-hours/new-op reconfirmation and loss of read access. These are executed closures of R3, not retrospective green evidence for744c63c.

Independent evidence on exactbdbee8b, with candidate tracked bytes unchanged:
Node22.23.2 required public suite903/903: Today619 including sleep66, coach201, W6 local journey51, A0 host32;0 fail/cancel/skip.
All18 named cells executed:6/3/3/6/12/5/3/5/3/2/1/7/2/5/1/4/1/1; labels overlap and are not additive.
18 isolated source-load mutants each produced actual ERR_ASSERTION failures; corresponding unmutated controls passed and source hashes stayed unchanged. N2-09 uses its focused real-gym test for clean mutation attribution.
Preserved harness attempts earn no credit: initial Windows import-URL failure; broad09 secondary TypeError;10 reference-assertion reporter ambiguity;12 unreadable-strip survivor. The later named controls are separately recorded.
The first historical-date adverse setup error is preserved; correcting its overridden day produced8/8 without product edits.
Fresh build earned-2ead98c80d20:113 pinned inputs,3 assets,69 bound classes,2 fonts. All3 SHA256 values match C's final report; hashes/bytes are in N2-R4-EVIDENCE.json.
Fresh official Edge sleep-check passed7 verified profile-scoped process kills, including before the actual active-put commit and after commit/before acknowledgment; old rows preserved, committed night retained once.
Both modes/correction/provenance, offline save, same-page recovery note across revisits, gym return, actual rollover/Keep this night,390/320/375 widths and persistent doubled text passed.
All5 input identities were exercised at16px/48px minimum; actual doubled font sizes, keyboard focus/Tab, primary reachability, navigation and horizontal overflow were checked. Physical iPhone NOT RUN.
Actual Start/set bytes and half-typed gym draft, historical recovery read-only routing, source units and transaction abort were executed in the current66-test file.

Custody/report reconciliation:
Exact13-path delta is12 licensed source/test paths plus C's report. Entry/bindings, check-in sources, engine/client/m4/conform/workflows and approved-design pins are unchanged by this delta.
preview.css differs only by the228 scoped48px input rule and its attribution comment; no CSP/frame change. bdbee8b adds only the report to582b4a3.
C's903 run was atb0ece6a; only sleep-check changed through582b4a3. D2 ran903 atbdbee8b. Builder's earlier44px result and pre-final mutation runs are not substituted for D2's exact-head evidence.

CI dependency, separately bounded under178/186/214:
Own public metadata: exactbdbee8b push rebuild34748446936 attempt1 FAIL on Ubuntu103700531428 and Windows103700531723 at H3 step13; subsequent A0/Today/coach steps skipped.
B alone inspected hosted H3 logs: SEAL-BASE-IS-NOT-THE-CHAIN-TIP before any evidence child. This is not a measured N2 test failure; D2 read no H3/private log and executed no H3/REAL-C2 command.
Exact-head shared34748446955 bothOS succeeds; pipeline34748446966 suite/preview succeed, production skipped. These do not provide N2 registration evidence. No rerun occurred.
B owns exact sleep.test.mjs registration and the admitted B1+B2 successor's bothOS proof; the superseded immediate enumeration/pin hold is not revived as another product finding.
Next is C's corrected producer successor, then scoped independent review and B's admitted CI composition. No acceptance line, seal, merge, deployment, import or phone PASS is written by D2.
