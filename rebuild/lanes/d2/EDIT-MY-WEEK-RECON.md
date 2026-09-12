# EDIT MY WEEK source recon, 2026-09-12

Source base 361ea25; probe executed on 284109e in the D2 edit-week worktree. Public synthetic inputs only. No private record, product build, live phone or authority endpoint was exercised. This is brief author reconnaissance, not independent review.

Five source observations passed under Node: changing a name changes a newly generated setup slug; clean init has unknown load, empty sessions, empty nights and the explicit empty priorities selection. The main omission risk is reusing first-run setup as an editor: setup-model.mjs:593 regenerates every ID and uses shared sets/hi; athlete-state.cjs:155 creates empty histories; setup-host.mjs:108 refuses repeated setup.

Reproduce from the repository root with `node --input-type=module`, passing this block on standard input. Every literal value below is INVENTED witness data, not a prescription or athlete fact.

```js
import assert from 'node:assert/strict';
import {slugOf,createCleanInitState} from './rebuild/m3/w7-preview/today/setup-model.mjs';
const e={id:'stable-id',n:'Press',mg:'chest',day:'U',sets:2,hi:8,inc:5,steps:[5,10]};
const s=createCleanInitState({setup:{athlete_label:'Synthetic',
  split:{from:'2026-09-12',map:{0:'REST',1:'U',2:'REST',3:'REST',4:'REST',5:'REST',6:'REST'}},
  exercises:[e],priority_muscles:[]}});
assert.notEqual(slugOf('Press',new Set()),slugOf('Chest press',new Set()));
assert.equal(s.exercises[0].w,null);
assert.deepEqual(s.sessionLog,{});
assert.deepEqual(s.sleep.nights,[]);
assert.deepEqual(s.priority_muscles,[]);
console.log('EW source recon: 5/5 synthetic observations; product acceptance NOT RUN.');
```

The source also exposes an ownership decision, not a demonstrated product failure: client/index.cjs:270 constructs planEdit, but w6/t2-stage.cjs:9 does not list that staged command. The injected workout producer at client/index.cjs:207-227 can supply a plan-shaped action. Neither observation proves a complete dated-week edit contract; the brief asks for an explicit validated command/projector/host companion, rather than prescribing an unnecessary stage allowlist change.

Machine settings already has a validated durable producer/host, but machine-settings-commands.cjs:48 rejects an empty settings list and requires at least one nonblank answer. Clearing the last note needs a separate contract; the proposed brief defers that control honestly. Name history already has an independent dated seam (engine/plan.cjs:59), so renaming is not a reason to reset a technique era.

The brief's next-day activation is a proposed product decision, not sourced physiology or a claim that current engine retirement is dated. The companion must prove future retirement/projection and preserve the basis of existing sessions before the editor can pass. No EW acceptance cells have been implemented or executed.
