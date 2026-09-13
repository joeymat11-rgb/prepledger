# Memory lifecycle foundation: independent D2 review
2026-09-13 · Lane D2, Astra MAX · REJECT: two coupled-draft completion failures. PM remains the judge.
Exact candidate1316639e71cc8b23b24570bb6aa0e7508da90032; source/testsaec118c4c23eb55e32e29ffdf8be60cfb30f28d0; baseline0c744cbd2d53c3be738320f726004a4e1871cce5.
Bar read first: PM270 dispatch efdbab9777cc2fba44278ac6495ccc44b92b0fd6, MEMORY-LIFECYCLE-GROUNDWORK-GO.md266, E0f57c99c lifecycle addendum and owner268. This reviews only isolated C groundwork.
C's MEMORY-LIFECYCLE-FOUNDATION-REPORT.md remains UNREAD at this independent verdict. Commit/send this verdict and evidence before report-last reconciliation.

1. [P1] Machine-editor input hides an acknowledged set log: T/gym-app.mjs437–452, particularly the shared-revision return at442.
The genuine active-set handler submits to the real client; while that write is paused, change only the machine-setting value, then allow the real commit/acknowledgement. The model returns saved and operations/outbox each grow by exactly1, but the same owning screen still shows Log, lacks Saved/Undo, retains effort2 and calls onChanged0 times. All activity counts have settled to0.
Cause: editor input at282 calls changed121, incrementing the revision captured by the independent set submission at437. The return at442 discards the valid success path, including performed-input/effort clearing, Saved rendering and caller notification. The editor remains newer, but the submitted set draft was not edited.
Expected: preserve the new editor answer while handling the confirmed set exactly once through the existing success path. Use submission-specific draft validity while retaining mount ownership protection; do not erase the editor or change write/receipt semantics.
Executable witness: memory-lifecycle-foundation-annex/d2-lifecycle-extra.test.mjs, test named D2 independent editor edits do not hide an acknowledged set log or suppress successful-log clearing. d2-lifecycle-race-log.json records saved/visibleUndo=false/visibleLog=true/changedCalls0 and the1→2 operation count.

2. [P2] Performed-input edits prevent confirmed settings Save from resolving its unchanged editor: T/gym-app.mjs301–326 plus380–408.
Save Seat=four through the real settings handler; pause it, change only performed load/reps to deliberate empty strings and choose effort, then let the real Save acknowledge. Exactly1 operation/outbox is added; the independent set draft is retained correctly, but the unchanged saved settings editor remains open/non-null.
Cause: those input/effort handlers increment the same global revision used by stillSubmitted302. The confirmed-Save clearing at326 is skipped even though the editor's own answer, lift and owning mount did not change.
Expected: confirmed Save resolves the unchanged editor while preserving the independently edited set draft. Still protect a truly newer editor and a replacement mount. Do not weaken the shared lifecycle epoch's observation role to repair this per-action decision.
Executable witness: the same annex file, test named D2 independent entry edits do not prevent confirmed settings Save clearing its unchanged editor; d2-lifecycle-race-settings.json preserves the separate draft values and actual operation counts.

Actual proof on the unchanged candidate:
The two literal266 entries pass137/137 tests,0 fail/cancel/skip/todo: T/test/gym.test.mjs and T/test/machine-settings-ui.test.mjs. The unchanged embedded S14 build and S10 PAGE_PINS/B-NTC metadata checks actually execute.
Independent extra file:37 discovered/executed,35 PASS/2 intended product failures,0 cancel/skip/todo and no asynchronous activity after final teardown. These counts are observed, not copied from C's report.
Thirty cases exercise all five actual gym-model writes across confirmed, raw unknown, separately stored/durable/committed-but-unacknowledged, and real IndexedDB quota-abort outcomes. Finish first logs every actual set. Post-commit envelope loss is explicitly injected only after a genuine acknowledgement, not used as a counterfeit durable fact.
Original prepared/resume/edit handle identities remain observable; synchronous counts rise before awaits and settle after success/refusal; frozen snapshots stay fixed; unknown state survives later reads/forget. Every prior operation/outbox remains exact, with the actual expected additions. The read case covers both delayed success and thrown failure without invented writes.
Four other UI cases pass: actual late acknowledged log versus a replacement mount on the same phone; newer editor retention after settings Save; normal logging while optional settings reads remain pending with ownership surrendered inside navigation; actual settings transaction failure/error retained on same-phone remount and explicit Cancel.
Original137 supplies normal successful-log and confirmed-Save controls, draft/effort remount, settings read/open/promise settlement, earlier-session and original write behavior. Neither old N2 evidence nor future full-memory expectations substitutes for this stage.

Source/build custody:
Fresh own work/pm-caretaker/d2-memory-lifecycle-foundation, branch rebuild/lane-d2-memory-lifecycle-foundation. Exact five-file base diff: two runtime/two tests plus unread C report; product/test bytes equal aec118c. All four baseline blobs match266.
Static before-read closure:109 public modules, no warning or denied read. All134 inspected public source/metadata files are Git=disk=source, equal before/after; only the four authorized paths differ from base. No added import/provider graph. S10 reads public metadata only.
Fresh own locked root/W6/W5 dependencies; own Node22.23.2/pnpm9.15.9, America/New_York and contained TEMP/TMP; no Node/coverage injection. Tool-only runtime is reused from D2, not another lane's dependencies.
S14 embedded build only: earned-4f9ca7cfba90,110 pinned build inputs/3 assets, all input hashes rechecked. app.js1515906bytes SHA2563be89d7e57802e150eeeb79192d37d0494e890625139f6c1e99d3269de73aa29.
index.html SHA25636d3db58318b3fceba62d2b8bd66007a36d398ef88daf6abd3a9f45798219fa0; styles.css SHA25621cb79d65a1b5a548071afa8c97bbfb64820d4048daefa6c0bf84b416d0a3664. This emitted build was not separately served or browser-tested.
No source mutations or repairs were introduced; source-fault credit0. The unmodified candidate already fails the two intended production-path assertions. Exact byte preservation is recorded; no restoration or new fault-kill result is invented.

Preserved attempts, artifacts and handoff:
First extra run34/37 had the same two product failures plus a harness assumption that an old resumed write would commit after another continuation preparation. Final replacement-mount test delays acknowledgement after the real commit instead. First teardown also closed the DOM before Cancel repaint settled, causing an asynchronous missing-template error. Both originals remain uncredited.
After correcting only that seam/teardown,35/37 with the same two product failures and no late activity. A final same-result replay records the two synthetic observation JSONs before the unchanged failing assertions.
MEMORY-LIFECYCLE-FOUNDATION-EVIDENCE.json SHA2560d53c117f52719092156e24decdfef19e84087ea45f7bc77b844bc40764ac894 contains source/build identities, exact test names/counts, command arguments, failures and log hashes. The annex contains byte-exact executable source and observations; raw logs stay in D2's owned ignored .tmp.
Local review artifacts go through sole PM writer; no shared or candidate/ancestry push. No private/seed/history/soak/native/H3/FULL/package/currentCI/provider/controller/host-swap/entry/world/browser/deploy/import/phone proof or acceptance line.
Next: PM routes both concrete fixes to C. Preserve this candidate/evidence, keep actual ownership/newer-draft controls, then review the exact successor. Stable host swap and complete memory remain separate, unbuilt obligations.
