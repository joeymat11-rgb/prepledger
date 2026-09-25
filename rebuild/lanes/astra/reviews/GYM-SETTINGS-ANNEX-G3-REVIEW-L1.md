# GSS annex G3 independent review L1
Verdict: REJECT, two measured ownership defects; no source repair performed.
Candidate: 1d582091a7596f49f7f5ae02ee675634f6ebdfb9.
Prior accepted narrow repair: caec51782aa694a37cc185bca89b8a06618dc834.
Immutable G3 red: 6b6fbb1db01e72b5f93bf76dd6077ee3c4c08af8; its app equals prior repair.
Exact product/test delta read blind before the 50-line author report.
Scope: G3 remount and carry ownership only. Prior 23/23 evidence preserved, not rerun.

G3-L1-1: retired Cancel can erase the current carry
Source: gym-app.mjs:145, 295-301. clearSettingsCarry deletes by shared draft alone.
The old Cancel listener still matches its old local draft/token after Back retires its mount.
Real quota refusal -> same-draft replacement -> detached old Cancel -> another remount
loses the restored editor, although the replacement still displayed the draft before leaving.
Named failure: INDEPENDENT-G3-RETIRED-CANCEL-CARRY-EDITOR, actual hidden true, expected false.
The identical three-mount control without the retired click passes, including error restoration.
Smallest correction: only the current owner may clear the carry; fresh Cancel must still clear it.

G3-L1-2: retired input can change carry before restoration copies it
Source: gym-app.mjs:146-151 stores settingsDraft by reference; 248-258 clones only on restore.
The old input listener in machine-settings-view.mjs:121 still mutates its captured row.
After real quota refusal and Back, hold the replacement's initial latest() response.
A detached old input event during that hold changes the eventual restored draft.
Named failure: INDEPENDENT-G3-DELAYED-RESTORE-DRAFT. The no-event held-read control passes.
This measured draft mutation precedes any new Save; no durable corruption is claimed here.
Smallest correction: carry a detached snapshot before a retired callback can mutate its source.
Both findings contradict G3 restoration and retired-control isolation; no new lifecycle API is needed.

Measured controls
Single serial command, session 53266, terminal c338e7, exit 1: 15 tests, 13 pass, 2 fail.
No skipped/cancelled rows. Original five G3 rows pass; ten reviewer rows yield eight pass/two fail.
Fresh remount Save writes once; fresh Cancel writes nothing and clears the next remount.
Retired Save clicks write nothing. Independent start-only, lift-only and draft-only isolation pass.
Each reviewer fixture seeds a nonempty prior operation/outbox map and uses the real encrypted host.
Complete maps survive quota/Cancel; fresh Save preserves prior rows and adds one linked pair.
Checks close the host, reopen it and compare complete operation/outbox objects.
After-restore clone control passes through actual fresh Save and reopened durable payload.
An isolated copy-to-alias source mutant fails that same payload assertion by exact name:
INDEPENDENT-G3-ALIAS-PERSISTENCE; the test requires ERR_ASSERTION and that message.
This independently validates the clone's limited protection, not the author's reconstructed history.

Retained evidence and containment
Root: C:/Users/joeym/AppData/Local/Temp/gss-g3-review-1d58209-3642a34748f3486abf0634cd4f14368d/
Script g3-independent.test.mjs SHA256: 027cc7945c474a7fce3800e03b0b4a11810f3f52f22e95af7efcb2c3266f3c8c.
Alias alias-mutant-app.mjs SHA256: 221df4d679b29650f59a667da15700c4e0d6a5fc66cb23c7504bd3ab12dfbb2a.
Log run.log SHA256: b8033ee8a72da1d445a7892977207bdf8c4c046c192989ce9e93cca3f327faf8.
Index evidence-index.json SHA256: efd6199ebb7bcdeb456f28ff2957449eb10326d0ebd3f0b149b286e1dc119194.
source-custody.json binds exact product/test blobs; hashes remained unchanged after execution.
Inspected faultDatabase/helper imports and top-level effects; all 82 safe dependency blobs unchanged.
No private/old-source reach, browser, external network, product edit, commit, push or fetch.
Candidate tracked tree was clean at post-run custody check. Runtime released immediately at terminal.
G4-G8, full annex closure, final Claude review and integration remain outside this verdict.
