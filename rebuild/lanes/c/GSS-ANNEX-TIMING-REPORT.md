# GSS annex timing proof: focused repair report

Status: CANDIDATE GREEN for the focused G1/G2 and ownership rows.
Base red: d7666445dc769410d90b51c3ced967b24d4290b4.
Scope: G1, ABA, G2, and seven bounded writer ownership controls.
Owned paths: gym-app.mjs, gym-settings-lane.mjs, and the two annex tests.

## Repair
The writer invokes readRaw exactly once and preserves the opaque editorToken.
After the released post-save repaint callback, it rechecks mount, context, current
editor, current binding identity, connected control, and phone containment.
Only the still-current binding can retire its editor and receive the saved outcome.
The UI records the submitted revision against the opaque token during that one read.
A newer same-editor draft makes the UI open a fresh editor token after old retirement.
The draft, its named error, and its monotonic revision survive that rebind.
An unchanged editor still closes after Save. Reservation and refusal behavior remain.

## Proof
The seven controls import the real writer. They require one raw capture, exact token
identity, stale-delivery refusal after replace/leave/dispose during the existing
post-save repaint, no nested writer, reservation release, and stale-token refusal.
The mounted G1 and ABA rows require the revised answer, named error, open editor, and
a live fresh Save binding after held delivery. G2 retains both independent variants.
Each mounted variant uses a fresh real host, checks all prior ops/outbox rows survive,
counts one new op and one linked outbox row, checks the submitted durable payload,
and reopens the host to check the latest machine. It does not compare full maps.
G1/G2 mounted plants still reach the same DOM capture seam and named failures.

## Measured evidence
Fixed environment: MEASURED_TEST_NOW=2026-09-03; TZ=America/New_York.
Pinned Node: C:/Users/joeym/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe.
Run root: C:/Users/joeym/AppData/Local/Temp/earned-gss-complete-fix-ea224aa957684e56a85c422a11f9c53a.
identity: exit 0, 7 tests, 7 pass, SHA256 2a4a14add54e532e05029b2d4163f9e76d94fb5fe0ffc4784742ef55965d168c.
G1: exit 0, 1 selected, 1 pass, SHA256 60c0f1e38bf2098d4364f98c524cafc25e496add9a67ce185bf2c65a2398366a.
ABA: exit 0, 1 selected, 1 pass, SHA256 9fc91a94d03973350bc834507306b26ada7a8df10df47c4de4f71378278804d9.
G2: exit 0, 1 selected, 1 pass, SHA256 86169e86115ff265454d6107513ae6429482ff4eae9c985a5d0221aaaacb334f.
Commands were serial: the identity file, then anchored ^D-GSS-G1:,
^D-GSS-G1-ABA:, and ^D-GSS-G2: with --test-concurrency=1.
An earlier repair run reached 5/7 before a new button-state proxy failed.
That test had manually enabled the button; product evidence was not inferred.
Retained log SHA256: 3adc90c6b635a5068444d413ddec41fee50db0f1f9408a638ae868e09e785ed6.
The corrected control directly proves a retired token cannot bind a second write.

## Safety and limits
Static manifest: C:/Users/joeym/AppData/Local/Temp/earned-gss-annex-static-04ea69e-g1g2/import-closure-effect-scan.txt.
Manifest SHA256: 31803a36079cfbda100757d5dbc9abd66472fcdae5b882d3b94264fca5db4a25.
It covers 130 repository files and ten named literal dynamic branches; package
internals and opaque dynamic branches remain outside its source-pattern claim.
No install, network, browser, server, subprocess, old API, private, or soak path.
The runtime is released. G3-G8, annex closure, acceptance, and integration remain open.