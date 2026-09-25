# GSS annex repair independent review L1
Verdict: REJECT two measured contract defects; no package acceptance.
Candidate: 46af1b846801cbbf67f6ac8ef1e582038a133f9f.
Red: 7931f57fa469e14cde260a73a8599fa3a381fea9; prior source: 04ea69e6.
Brief eca353a, existing mapping and accepted 6fe4d12c contract read first.
All changed product/test hunks read blind; author report read after source findings.
Scope: G1 newer input, G1 ABA revision, G2 unchanged-editor closure, new callback boundary.
Evidence: %TEMP%/gss-annex-review-46af1b8/; exact source snapshots retained.
evidence-index.json SHA256:
b0e2fc234ea39a5795102d2994a91bc579608893af23bea65a9e59a386747110.

F1: gym-settings-lane.mjs:247 clones outcome.editorToken when editorRevised is true.
The opaque token loses identity; gym-app.mjs:271 rejects the delivered saved result.
Accepted contract B explicitly says tokens preserve identity and must not be cloned.
Measured GSS-REVISED-TOKEN-IDENTITY fails strict identity; unchanged-token control passes.
The three authored DOM rows still pass because rejecting the notification leaves input open.
Their pass cannot prove that the revised-success mapper receives the right token.
Fix must preserve the exact opaque token in the frozen enriched result; retain ABA behavior.

F2: lane:243 invokes released readRaw again after the saved ownership test.
No ownership/binding recheck follows before retireEditor at245 and onOutcome at248.
Measured second-read replace, leave and disposer each still deliver one stale success,
where the respective GSS-POSTREAD-*-STALE-DELIVERY assertion requires zero.
Replacement during that call can also become retireEditor's target by exact source flow.
Accepted B requires lifecycle/binding checks after released callbacks and before delivery.
Keep the post-save metadata observation safe against replacement, leave and disposal;
reconcile the second readRaw with B's single command-payload capture contract.
No additional command entry, retry-on-notification-failure or broader authority is allowed.

Independent identity-reentrancy.test.mjs/log: terminal c19c22 exit1, 3pass/4fail.
Failures are the four named assertion errors, not setup, timeout or dependency failures.
Passing controls: unchanged token, synchronous nested-dispatch/pending exclusion,
and post-save raw rejection releasing the reservation without repeating the write.
These controls inject a synthetic host; they make no durable-store claim.
Original G1/G2/ABA exact test replay: terminal d3fc90 exit0, 3/3, no skips/cancels.
G2 includes both entry-fields and stepper-effort; all real-host rows reopen storage.
Source copies alter import URLs only; test original SHA256 matches026daa0f... .
82 real-host/helper blobs independently match prior inspected closure; remaining
previously inspected focused graph has no change outside the two reviewed product files.
No forbidden reach, host opening in the minimal lane controls, or unknown import found.
Pinned Node; MEASURED_TEST_NOW=2026-09-03; TZ=America/New_York. Runtime RELEASED.

Revision input listener checks token/draft/connected phone; row add/remove checks token/draft.
Revision stays outside producer payload; pending reservation and finally paths remain held.
Original proof plants alter observed DOM, so they do not detect either new boundary defect.
Author says full serialized maps compared; actual helper checks prior rows, new counts,
payload/link and reopened latest, not full postcommit-versus-reopened serialized equality.
Do not describe this as an independent rerun of all Section E or all 17 groups.
G3-G8, remaining annex debt, Claude repair review, full CI and integration/seal stay open.
Only this report and synthetic scratch written; no product edits, commits, pushes or fetches.
