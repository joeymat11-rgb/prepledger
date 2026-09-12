# N2 source recon, 2026-09-12

Source base `5508ed3`; source-only probe executed on `11374eb` with Node, public synthetic literals only. No private file, live athlete record, network, product build, gate or phone was exercised. This is author reconnaissance, not independent review or acceptance.

Six assertions passed: fresh helper lookup sees an inserted night; an already-created check-in still holds null after refresh; ordinary midnight span uses the engine helper; equal times yield a full day; excessive awake minutes clamp to zero; A3 accepts explicitly entered zero hours. The synthetic values below are INVENTED witness inputs, not training facts or prescription values.

Reproduce by saving this block as `rebuild/lanes/d2/n2/source-probe.mjs` in a disposable D2 worktree and running `node rebuild/lanes/d2/n2/source-probe.mjs`. It imports only the named public modules and prints one count line.

```js
import assert from 'node:assert/strict';
import { createCheckInModel, createCheckInDraft, sleepNightFor } from '../../../m3/w7-preview/today/checkin-model.mjs';
import TodayEngine from '../../../m3/w7-preview/today/today-engine.cjs';
const E = TodayEngine.createTodayEngine({ clock: { today: () => '2026-09-12' } });
const state = { sleep: { nights: [] } };
const checkin = createCheckInModel({ day: '2026-09-12', engineState: state });
state.sleep.nights.push({ d: '2026-09-11', h: 8 });
await checkin.refresh();
assert.equal(sleepNightFor(state, '2026-09-12').hours, 8);
assert.equal(checkin.read().sleepRecord, null);
assert.equal(E.sleepSpanH('23:00', '07:00', 0), 8);
assert.equal(E.sleepSpanH('07:00', '07:00', 0), 24);
assert.equal(E.sleepSpanH('23:00', '07:00', 600), 0);
const draft = createCheckInDraft();
draft.set('sleep_hours', '0');
assert.deepEqual(draft.answers(), { ok: true, answers: { sleep_hours: 0, sleep_hours_source: 'entered' } });
console.log('N2 SOURCE RECON: 6/6 observations confirmed; synthetic only; product acceptance NOT RUN.');
```

The source also shows two composition gaps: `today-entry.mjs:66` captures check-in state once, while `:160` passes a snapshot to the workout host. `today-bindings.mjs:334` builds the native trend reader from that state; the public era facade at `:580` exposes named hosts, not the internal client. These require real composition proofs, not only projector unit tests.

The older N2 outline calls only `today-bindings.mjs` pinned; `DECISIONS:154 (5)` and the older A4b workaround also identify `today-entry.mjs`. H3 carries `sleep.needed` under `:154 (6)`. The proposed brief records both dependencies and requests the actual new-suite CI home, rather than claiming an inherited green run covers new tests.

No implementation verdict, acceptance line or merge was authored. This report is within the 60-line limit.
