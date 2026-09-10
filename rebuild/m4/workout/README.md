# Recorded workout history — read-only integration candidate

This is the first presentation consumer of the retained signed legacy-observation
profile in `../spec/LEGACY-WORKOUT-PROJECTION.md`, published at PR46 `3b88b52`.
It helps complete truthful history for the private pilot. It does not implement
logging, syncing, prescription generation, session resolution or the private port.
No production entry point imports it yet; no first-use acceptance is claimed.

`createHistoryPanel({document, root, projection})` requires a trusted projection
constructed with the authenticated R1 reader. `open(rawProofInput)` calls that
projection before painting. Do not supply request-controlled `verified` flags or
a production adapter that merely returns fixture data. The renderer is not an
authentication boundary; the composed reader provides that boundary. R1 remains
pinned at `003c816e695fce7e77e17665f25d8cdcc2435211` for these tests.

The view shows corrected per-set quantities and separate original entries.
Removed entries retain their original history; unresolved edits show no guessed
current value. Unknown effort/basis and the captured-snapshot limit are visible.
It does not group a day or device into a resolved workout, infer a completed
session or show prescription readiness. Missing/uninterpretable history is not
an empty first-use ledger. Untrusted record labels/reasons are text nodes only.
Per-entry Record context preserves joined view/reader issues. A class-mixed legacy
set remains visible as unsupported with its original entry; unknown START
references and additional uninterpreted fields appear on their own cards.

Every open clears old truth before awaiting verification. A local request
generation prevents a late older response from repainting after a newer request,
`clear()` or `dispose()`. The future account/lifecycle owner MUST call clear or
dispose on context loss and construct a new trusted reader for a new account.
These methods do not detect sign-out themselves, fence a durable write, prove
knowledge-loss recovery or qualify W6 state handling. `open`'s `verified` result
describes signature verification only; it never authorizes a workout decision.

## Reproduce from repository root

Use Node24, installed root dependencies (JSDOM), and the exact R1 checkout's
separate W5 dependencies described in `../spec/R1-HISTORY-READER.md`. Outputs
contain only the tracked synthetic test cases; choose a new output directory.

```text
node rebuild/m4/workout/test/history-panel.test.cjs <R1-checkout> <new-output-dir>
node rebuild/m4/workout/test/history-browser.cjs <output-dir> <installed-W6-package-dir> <Chromium-executable>
```

The first command runs the committed 23-case signed-history test in
memory with one explicit appended UI probe before its final source-pin checks.
It does not edit the source or replace any original assertion. Actual T2 writers,
P256 core, signed projector/verifier and projection execute, with the existing
synthetic registry/genesis and memory-only limits. Fifteen additional DOM checks
cover corrected/original/removed/unresolved values, unknowns, refusal, mutation
isolation, stale response suppression and clear/dispose. The asynchronous
lifecycle and hostile-text tests use explicitly labeled presentation stubs;
they are not claimed as account or signature proofs.

The browser command uses retained W6's pinned playwright-core, a fresh headless
Chromium context and blocked network. Four checks cover 390/320px layout,
keyboard-operated native details and 200% text with details open. It produces
`preview.html`, evidence JSON and a screenshot. This is desktop Chromium, not
iOS Safari, VoiceOver, installation, on-device storage or physical acceptance.
The preview itself has no scripts, requests, storage or input forms.

An actual 320px/200% text check initially failed (scroll width332): long words
overflowed the narrow heading/change list. `overflow-wrap:anywhere` fixes the
text flow without hiding content. Original failure and pre-fix files are retained
with the coordinator. Re-run through the published paths: history23/23, DOM15/15,
browser4/4 PASS. The accepted reader stays unchanged; projection/view now carry
the three reviewed consumer repairs, with original verdict/source preserved.
This UI and those repairs still need their applicable independent review
and the complete-workout/schema/storage/phone composition before use.
