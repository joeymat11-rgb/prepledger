# ASTRA — owner workout contract preparation

2026-09-06 · branch `rebuild/owner-workout-brief` · exact integration base `213300c6c49f772dcb2ff859e1c1375dd571b837`. Two new documents only: this report and `BRIEF-OWNER-WORKOUT.md`. No product, accepted gate/artifact, queue/ledger, dependency/lockfile or soak changes. Proposed, not independently accepted; no release or private-import permission follows.

## 1. What and why

The owner prioritized a complete usable workout-logging app through the existing coordinator. The brief brings the ratified Gym/set/effort/skip/finish/history/consent/conflict/safety scope into one concrete delivery slice, preserving M2 closure, applicable M4 machinery, operational/physical/C3 gates, M5 and OPEN-M1. Today remains supporting work. It creates no new maintained plan, dispatcher, schedule, model change or third implementation stream.
Three bounded same-family checks identified exact current command gaps, existing law/runner coverage, and reusable public mock surfaces. This is preparation, not independent acceptance. The existing C and I tasks reported exhausted usage credits; neither returned a verdict on this proposal. Their requests/worktrees remain, and no retry, new reviewer, purchase or model switch was used.

## 2. Findings verified against source

| Finding | Evidence / implication |
|---|---|
| Current set shortcuts cannot carry the whole ratified set | `client/index.cjs:151–168`, `ops.cjs:51–76`; runtime159–164/213–214/232–235. Required envelope identities and reserve are not represented by these shortcuts; the witness below confirms stored output. An API extension/schema mapping is required before binding the full workout form. |
| Unit scope must be explicit | The current helper encodes pounds and ignores an extra unit argument. A fixed pounds schema is permitted by runtime157–158; this is not proof of a current supported-API unit bug or a requirement to build kilogram entry. The new form must stay within declared units or refuse unsupported ones. |
| Effort semantics are richer than one number | Public mock409–421/468–476: 0/1/2/3+/Not sure, first/last question only, skip assumes nothing. The runtime names reserve but supplies no closed enum/range/null encoding. Proposed tags preserve those distinctions and remain subject to technical review; training eligibility cannot be invented by a spelling choice. |
| Early finish cannot use the static completed summary | Public mock784–815/948–949 preserves logged facts and unlogged work but its demo transition reaches the all-complete summary. The brief requires actual completed/skipped/unlogged projection and distinguishes identical retry from distinct concurrent close facts. |
| Preview is not a full browser engine | `m3/w7-preview/browser-engine.cjs:3–5` excludes seed/migrate/merge/writers because seed embeds personal history. A reviewed data-free actual-engine composition and authenticated athlete projection are prerequisites, not a full-entry-point import. |
| Existing green counts do not certify workouts | Manifest:34 authority/35 client/20 policy/9 progression/1 soak; policy/progression adapters are absent. Existing99 reference/99 strong/70 adapter green and29 expected RED do not prove the missing full UI→store→HTTP→projection path or phone use. |
| R1 next evidence is already specified | DECISIONS74 preserves local v1 failures and rejects v2; deployed synthetic provider-side resource evidence is required, unavailable evidence BLOCKED. The brief retains local functional/error-order/regression gates and separate byte-preflight work; it does not demand another unsupported local heap-limit experiment or accept HTTP success as memory proof. |

The retained W6 draft at `6f62455` stages only weighIn/logSet/logSession/finishSession. The brief enumerates the required correction/undo/offer/partition/safety/history additions and requires a closed source/schema amendment before editing accepted client/authority boundaries. It does not implement those additions here.

## 3. Executed synthetic boundary witness

Windows/Node24.19.0; accepted client at the base above, in-memory synthetic setup from `rebuild/t2/rig187.cjs:11–15`. No private input, real credential, HTTP, production write or phone was involved. Reproduce from the repo root by feeding this JavaScript to Node's stdin; it prints booleans only. Test-only keys are read from the existing synthetic fixture module, never printed or copied into this report.

```js
// WORKOUT-DTO-WITNESS: executable report snippet; not a formal v4 law.
const assert = require('node:assert/strict');
const req = require('node:module').createRequire(require('node:path').join(process.cwd(), 'package.json'));
const C = req('./rebuild/client/index.cjs'), O = req('./rebuild/conform/lib/ops.cjs');
function fresh() {
  const backend = C.memoryBackend({sync:{snapshot:{plan:{},reads:['2026-09-04']},frontier:{W:0,authorityW:0}}});
  const clock = {now:()=> '2026-09-04T00:00:00Z',today:()=> '2026-09-04',tz:'-04:00',monotonicMs:()=>0};
  const client = C.createClient({deviceId:'dev-A',athleteId:'ath-1',identityKey:O.K_IDENTITY,
    authorityKey:O.AUTH_KEY,backend,clock,lease:O.lease('dev-A'),online:false,
    transport:{send:()=>undefined,pull:()=>({receipts:[]})},contract:{client:'1',required:'1'},
    standing:'enrolled',signInRequired:false});
  client.boot(); return {client,backend};
}
const set = {lift:'synthetic-press',slot:1,load:40,unit:'kg',reps:8,reserve:2};
const a=fresh(), b=fresh();
const one=a.client.logSet({...set}), batch=b.client.logSession({date:'2026-09-04',sets:[{...set}]});
const ops=s=>s.backend.keys('ops').map(id=>s.backend.get('ops',id));
const sets=[...ops(a),...ops(b)].filter(o=>o.kind==='session-set');
const starts=ops(b).filter(o=>o.kind==='session-start');
assert.equal(sets.length,2); assert.equal(starts.length,1);
const result={ACKNOWLEDGED_LOCAL_SAVES:one.acknowledged===true&&batch.acknowledged===true,
  ENTERED_RESERVE_PRESERVED:sets.every(o=>o.payload.reserve===set.reserve),
  NON_POUND_ARGUMENT_HONOURED:sets.every(o=>o.payload.load.unit===set.unit),
  REQUIRED_SESSION_ENVELOPE_IDENTITIES_PRESENT:sets.every(o=>Object.hasOwn(o,'session_start_op_id')&&
    Object.hasOwn(o,'logical_set_slot'))&&starts.every(o=>Object.hasOwn(o,'plan_basis'))};
assert.deepEqual(Object.values(result),[true,false,false,false]);
for(const [label,value] of Object.entries(result)) console.log(label+'='+value);
```

Executed output:

```text
ACKNOWLEDGED_LOCAL_SAVES=true
ENTERED_RESERVE_PRESERVED=false
NON_POUND_ARGUMENT_HONOURED=false
REQUIRED_SESSION_ENVELOPE_IDENTITIES_PRESENT=false
```

This proves current shortcut behavior, not a formal red-first law, all correction/conflict gaps, a phone defect or an observed owner-data loss. The extra kg argument deliberately probes unsupported scope; the brief permits pounds-only entry. No unknown enum was assumed in this witness. An initial scratch assertion mistakenly expected a payload start identity on a standalone set; it emitted HARNESS_ERROR, was corrected to the actual batched-session representation, and earned no defect credit. The final report snippet was executed independently of that scratch extractor.

## 4. Mandatory documentation checks

Local gate output on unchanged product bytes:

```text
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
SCOPE-FREEZE PENDING — new PWA archive, full private suite and final M3 implementation evidence remain release gates
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
PASS engine suite — 3072 assertions passed
PASS 18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
All checks passed. Safe to ship.
```

The old-app strict verdict is not a rebuild release authorization. Product-bite, workout runner, physical/remote/C3 and independent acceptance are NOT RUN; the brief names their future evidence and blockers explicitly. CI is pending at publication and must be linked to the exact PR revision before integration.
An initial strict log was accidentally written at the checkout root and counted as a nineteenth site file. It was moved outside the checkout; the final scope/strict checks above then confirmed18. No package was deployed. Conformance/selftest and the report's exact synthetic snippet passed; `git diff --check` and the two-document scope check passed.
Reproduction uses a **real node_modules directory** with unchanged root dependencies, copied from the retained D30-brief worktree; no install/lockfile change. Run `node rebuild/m3/w0/scope-package.mjs`; build references with accepted `buildPublicEngines()` from `m3/w0/public-oracle.mjs`; explicit ENGINE_MAIN/ENGINE_OLD at `.tmp/m3-w0-engines/engine-main.cjs`/`engine-old.cjs`, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, EARNED_CLIENT_DIR=this checkout/client. Run unchanged `rebuild/conform/run.cjs` and `--selftest` after AGENTS local private preparation. Strict unsets MEASURED_TEST_NOW/PL_ENGINE/PL_LAWS_LIB.

## 5. Review corrections, custody and limits

Same-family challenge tightened full-value replay/ENVELOPE_MISMATCH preservation, distinct concurrent close facts, effort-question skip versus set skip, training-rule authority, complete inherited second-gate inventory and publication-based overlap. It also prompted direct rechecking of DECISIONS74 to avoid wrongly adding a local metric-repair prerequisite to the already specified hosted resource proof. None of this is C acceptance.
A required startup read of historical NEXT reached personal historical prose in tool output. Broad reads stopped; no such contents are included in either new document or a committed fixture. Future startup handling uses NEXT's rebuild pointer and targeted current contracts. Separate mandatory private fixture/golden preparation used the existing isolated mirror, emitted verdicts only and verified committed public manifests/goldens unchanged. No private-derived values or new private hashes are published here.
Stage A still needs exact field/error/commitment/legacy schemas and engine mapping of bounded/unknown reserve and early completion. Stage B needs the reviewed data-free assembly and complete reachable flows. R1/T1/K1/P1/W4, all45/15 closure, actual operational/phone/C3 proofs, owner import approval and review availability remain blockers. No new target date, completion claim, broad research or redesigned process is supplied.

## 6. Wall-clock and NEXT

Focused preparation began approximately23:00UTC; final local checks completed23:18UTC, reusing the owner's handoff and existing checkpoint. Publication follows; independent-review waiting is separate. Attributable token/cost baseline is unavailable; the operational savings pilot has no measured20% claim. Model settings, retained streams and mandatory independent acceptance are unchanged.
NEXT: retain this proposal for the existing C task's review when capacity returns; do not retry its quota prompt. The already delivered D30 brief/PR45 and retained R1 remain the implementation owners' next dependencies. Resume the same I preparation request and continuation on availability, never a duplicate task/schedule. Update only the existing compact checkpoint; workout implementation starts from accepted authority and sufficiently closed published contracts within the existing two streams.
