# Coaching policy: phone reach, independent source trace
Reviewer: Astra (Codex), commissioned by PM4 under DECISIONS:412 and :569; independent trace
Head read: 7a6ffa4557f64edf4ed3dd4954d0a8bb10c22e17

(a) FALSE. The eleven named calls exist, but are not exhaustive: rebuild/m4/workout/engine-capture.cjs:61 calls rirPlan; rebuild/m4/workout/native-trend-context.cjs:321,326 calls dayWeather/cleanAtDate; rebuild/m3/w6/local/source-admission.mjs:696 calls sessionMembership. Import preparation also calls migrate, mergeState and dataLossGuard (rebuild/m4/import/replay-core.cjs:48,49,58). The browser ships the host mirror, not engine-runtime.cjs itself (rebuild/m3/w7-preview/today/build.mjs:93,180; rebuild/m3/w6/host/engine-runtime-host.cjs:54).
(b) PARTLY. No product caller of completeSession was found under rebuild/m3, rebuild/m4 or rebuild/client; native Finish records a close operation (rebuild/m3/w7-preview/today/gym-model.mjs:538-543; rebuild/m3/w6/public-client.mjs:383-387). The two-opener hold writes are in rebuild/engine/writers.cjs:236,238. But completeSession is NOT the only route to sightings/earn: rebuild/engine/migrate.cjs:83-88 recomputes topRun; rebuild/engine/merge.cjs:1096 reaches _mintJointEarn -> earnWalk (rebuild/engine/migrate.cjs:35-62), which queues a heavier debut at rebuild/engine/earn.cjs:88. The shipped import route reaches this merge; measured below.
(c) TRUE for the traced phone composition. No product invocation of the engine's sweepStalls or applyProposal was found, including the reached writers' callees and import facade (rebuild/m4/import/engine-provider.cjs:55). The workout facade only exposes readers (rebuild/m3/w6/host/engine-runtime-host.cjs:112-114). The matching setup-model method is an exercise-list editor, not calorie acceptance (rebuild/m3/w7-preview/today/setup-model.mjs:409-423). The engine definitions remain rebuild/engine/writers.cjs:1534,2120.
(d) PARTLY. Rep/calorie guidance is reached (rebuild/engine/progression.cjs:274; rebuild/m3/w7-preview/today/today-model.cjs:135). Native sessions do not newly earn load or sets, but "NOTHING ELSE" is false: rirPlan changes effort after hot openers (rebuild/engine/writers.cjs:822-838). Existing eligible queue entries change load and a pending third-set unlock adds a set (rebuild/engine/today.cjs:98,114), both measured below. Sightings can move during import. The claimed phone-visible "two sightings" line is also overstated: genSession produces runway at rebuild/engine/today.cjs:191, but the phone capture omits runway (rebuild/m4/workout/engine-capture.cjs:93,100).
(e) FALSE. The prescription does not adopt the latest native logged/edited load: genSession selects queue.newW or exercise.w (rebuild/engine/today.cjs:98); native performed loads are compared with that prescription, not assigned to it (rebuild/engine/progression.cjs:80-85; rebuild/engine/performed.cjs:244-253). A synthetic edit to 110 left the card at 100; an import-created queue changed it to 105 without any different recorded load. Saved/previous-performance labels show recorded facts separately (rebuild/m3/w7-preview/today/gym-model.mjs:258-283,458).

For a lift already trained, the card uses a selected queued weight if present, otherwise its stored working weight, with per-set weights supplied by the queue or exercise when available and inconsistent mappings refused (rebuild/engine/today.cjs:98; rebuild/m4/workout/engine-capture.cjs:69-82; rebuild/m3/w7-preview/today/gym-model.mjs:68-76).

What the checker missed
1. Import is an actual shipped alternate engine path, not merely bundled unused writer bodies.
   REQUIRED_INPUTS includes import-screen and production-mapping (rebuild/m3/w7-preview/today/build.mjs:199-200).
   import-screen imports source-admission (rebuild/m3/w7-preview/import/import-screen.mjs:41-44).
   Its replay invokes createImportPreparation with source/local bytes (rebuild/m3/w6/local/source-admission.mjs:410-415).
   Preparation migrates, optionally merges, and migrates again (rebuild/m4/import/replay-core.cjs:48-49).
   Migration alone recomputes sightings without minting; merge can mint when the two legacy top sessions also carry the required provisional/no-next-load receipts (rebuild/engine/migrate.cjs:48-62,2118).
   Synthetic execution used the real production registry, source replay engine and import preparation, then the browser runtime.
   Each synthetic legacy snapshot had one 100-pound [12,11] session, opener RIR 2, and its own provisional receipt; no completeSession call.
   Output:
   ```text
import/migrate {"topRun":1,"queue":0}
import/merge {"topRun":0,"queued":[{"newW":105,"state":"DEBUT"}]}
import/preparation {"w":105,"reps":[11,10],"topRun":0,"queued":[{"newW":105,"state":"DEBUT"}]}
```
   This proves the preparation path's behavior, not completion of every sealed-bundle admission check on a phone.

2. Native facts advance the rep read, but do not update exercise.w, topRun, holdFlag or queue.
   athlete-state constructs w:null and empty queue (rebuild/m4/workout/athlete-state.cjs:136,329).
   The registrar clones state/facts separately; capture attaches facts without adopting loads (rebuild/m4/workout/source-projection.cjs:50-58; rebuild/m4/workout/engine-capture.cjs:45-52).
   today-bindings only attaches legacy ordering metadata (rebuild/m3/w6/local/today-bindings.mjs:454-463).
   Commands/edits retain recorded facts (rebuild/m4/workout/commands.cjs:60-72; rebuild/m4/workout/edit-values.cjs:27-45); replay does not complete native sessions (rebuild/m4/import/replay-core.cjs:178-188).
   Synthetic drive: real athlete-state constructor; a cloned synthetic stored baseline of 100; two completed native v2 sessions at [12,11], the top of a hi=12 window; synthetic non-rushed trend context.
   Accepted engine-runtime and the browser host mirror produced the same following fields; every read preserved its input byte-for-byte.
   Output from the browser mirror (null topRun means absent, not a stored zero):
```text
browser/before {"w":100,"reps":[10,10],"sets":2,"effort":[2,0],"topRun":null,"queue":0,"baselineAsk":false}
browser/top-sessions-1 {"w":100,"reps":[12,11],"sets":2,"effort":[2,0],"topRun":null,"queue":0,"baselineAsk":false}
browser/top-sessions-2 {"w":100,"reps":[12,11],"sets":2,"effort":[2,0],"topRun":null,"queue":0,"baselineAsk":false}
browser/edit-latest-load-110 {"w":100,"reps":[12,11],"sets":2,"effort":[2,0],"topRun":null,"queue":0,"baselineAsk":false}
browser/clean-init-after-two {"w":null,"reps":[0,0],"sets":2,"effort":[2,0],"topRun":null,"queue":0,"baselineAsk":true}
browser/three-hot-openers {"w":100,"reps":[12,11],"sets":2,"effort":[3,0],"topRun":null,"queue":0,"baselineAsk":false}
browser/preexisting-queue {"w":105,"reps":[11,10],"sets":2,"effort":[2,0],"topRun":null,"queue":1,"baselineAsk":false}
browser/preexisting-unlock {"configuredSets":2,"cardSets":3,"w":100,"reps":[11,10,9]}
```
   The last case used a synthetic lift with the engine's hack identifier and an already stored pendingThird/unlock.
   Thus both "logging a different weight changes the prescription" and "a fresh lift adopts its first load" are unproved assumptions contradicted by this module drive.

3. The phone card captures note/live/effort and session structural text, not the full runway string (rebuild/m4/workout/engine-capture.cjs:93,100); Today retains only session count/name (rebuild/m3/w7-preview/today/today-model.cjs:247-249).
   The PWA wraps the same app.js, adding preflight and sw.js (rebuild/slice/pwa/build-pwa.mjs:80-114; rebuild/slice/pwa/shell.cjs:162-163).
   Preflight registers that worker; the worker handles asset caching/status only, with no engine import or background coaching/sync handler (rebuild/slice/pwa/preflight.js:75; rebuild/slice/pwa/sw-source.js:33-112).
   No separate coaching bundle or native-session earning call was found in the traced page/client paths.

What I did not verify
The exact deployed/cached build on the owner's phone, any athlete's state, or full browser/IndexedDB session capture and sealed-import admission.
This is source reach at the stated HEAD plus module execution on synthetic records; the import fixture is not an assertion about the owner's imported queue or receipts.
I did not rebuild assets, inspect node_modules/auth files, run the conformance/private gate, access protected data or services, or evaluate coaching science.
Commands set MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York on separate lines; execution used C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe.
Drivers ran via stdin from newly created OS-temp scratch directories; no fixture/script files were written. Only this report was written; no tracked file was edited and no commit was made.

