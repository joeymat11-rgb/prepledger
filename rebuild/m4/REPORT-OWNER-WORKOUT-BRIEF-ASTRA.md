# ASTRA — owner workout contract preparation

2026-09-06 · branch `rebuild/owner-workout-brief` · exact integration base `213300c6c49f772dcb2ff859e1c1375dd571b837`. Two new documents only: this report and `BRIEF-OWNER-WORKOUT.md`. No product, accepted gate/artifact, queue/ledger, dependency/lockfile or soak changes. Proposed, not independently accepted; no release or private-import permission follows.

## Current amendment reconciliation — 2026-09-07

Owner-approved process-proportionality direction is applied to this existing proposal as v0.2; independent technical acceptance and integration remain PENDING. This is a substantive contract change, not editorial clearance. PR47 contains the exact governing-clause changes, minimal evidence-applicability helper and one-time45+15 dependency map. This PR still edits only its two existing documents, retains its original publication base and all prior execution evidence below.
No workout-wide defect exclusion was proved: D12/D33/D34/D35 remain accepted;41 remaining defect outcomes and15 fixed non-D obligations retain applicable joins. V4-STEP-OFFER-RECHECK and W7-PORT-IMPORTED-OFFER-TRUTH remain separate. No duplicate repair, new exclusion, changed expectation or owner-rule reapproval.
Only after the amendment is independently accepted and prerequisite controls/restore/rollback actually pass may first-owner use defer the actual charged-email proof and full alternate-operator qualification. Both stay DEFERRED/PENDING; no original D8/D9/HANDOFF/full M3 or beta PASS is claimed. C3/Gym and specific private-import approval remain unchanged.
The update permits risk-proportionate review and narrowly validated receipt reuse after acceptance; current mandatory checks remain effective meanwhile. Existing Opus preparation evidence and stopped Sonnet trial do not qualify a replacement reviewer. Keep the current coordinator, retained worktrees, model settings and paused continuation.
Amendment validation results and final NEXT are recorded at the end; historical outputs below are not new-run claims.

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
Reproduction uses a **real node_modules directory** with unchanged root dependencies, copied from the retained D30-brief worktree; no install/lockfile change. Run `node rebuild/m3/w0/scope-package.mjs`; build references with accepted `buildPublicEngines()` from `rebuild/m3/w0/public-oracle.mjs`; explicit ENGINE_MAIN/ENGINE_OLD at `.tmp/m3-w0-engines/engine-main.cjs`/`engine-old.cjs`, MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, EARNED_CLIENT_DIR set to this checkout's `rebuild/client`. Run unchanged `rebuild/conform/run.cjs` and `--selftest` after AGENTS local private preparation. Strict unsets MEASURED_TEST_NOW/PL_ENGINE/PL_LAWS_LIB.

## 5. Review corrections, custody and limits

Same-family challenge tightened full-value replay/ENVELOPE_MISMATCH preservation, distinct concurrent close facts, effort-question skip versus set skip, training-rule authority, complete inherited second-gate inventory and publication-based overlap. It also prompted direct rechecking of DECISIONS74 to avoid wrongly adding a local metric-repair prerequisite to the already specified hosted resource proof. None of this is C acceptance.
A required startup read of historical NEXT reached personal historical prose in tool output. Broad reads stopped; no such contents are included in either new document or a committed fixture. Future startup handling uses NEXT's rebuild pointer and targeted current contracts. Separate mandatory private fixture/golden preparation used the existing isolated mirror, emitted verdicts only and verified committed public manifests/goldens unchanged. No private-derived values or new private hashes are published here.
Stage A still needs exact field/error/commitment/legacy schemas and engine mapping of bounded/unknown reserve and early completion. Stage B needs the reviewed data-free assembly and complete reachable flows. R1/T1/K1/P1/W4, all45/15 closure, actual operational/phone/C3 proofs, owner import approval and review availability remain blockers. No new target date, completion claim, broad research or redesigned process is supplied.

## 6. Wall-clock and NEXT

Focused preparation began approximately23:00UTC; final local checks completed23:18UTC, reusing the owner's handoff and existing checkpoint. Publication follows; independent-review waiting is separate. Attributable token/cost baseline is unavailable; the operational savings pilot has no measured20% claim. Model settings, retained streams and mandatory independent acceptance are unchanged.
NEXT: retain this proposal for the existing C task's review when capacity returns; do not retry its quota prompt. The already delivered D30 brief/PR45 and retained R1 remain the implementation owners' next dependencies. Resume the same I preparation request and continuation on availability, never a duplicate task/schedule. Update only the existing compact checkpoint; workout implementation starts from accepted authority and sufficiently closed published contracts within the existing two streams.

## Amendment validation and current NEXT — 2026-09-07T03:00:07.639Z

This v0.2 is prepared locally against retained PR46 headbbbdc026, not published or independently accepted. Same-family QA removed an unnecessary Stage A dependency on executed C3 qualification: schema review must declare the intended storage/configuration contract; actual C3 remains a Stage C/OWNER-WORKOUT gate. Governing plan readback wording is reconciled in PR47 to at least30 idle days from last recorded interaction, not an assumed seed clock. No soak interaction or qualification claim.
Fresh conformance/rig185 and SELFTEST passed with explicit references/client/gate date/TZ; direct FROZEN-PATHS and actual18-file ZIP checks passed. The initial nested scope invocation returned a generic failure and remains disclosed. Strict, with its test clock/PL overrides unset, failed with filesystem access denied; a direct reproduction failed identically. No old strict/CI result is reused or gate weakened. This is not a green release candidate.
The same environment cannot write common Git metadata and its HTTPS helper is unavailable; publication/updated-head CI remain pending. Exact public changes are retained in one patch bundle for existing PR46/PR47, with current bases and hashes. PR47's final70/70 selector tests and complete45+15 mapping are preparation evidence, not workout or independent acceptance.
NEXT: existing authorized integrator/reviewer applies to the verified retained heads, completes strict and both-OS CI and reviews the actual substantive contract set. Current gates remain effective until accepted/integrated. Then advance closed Stage A command/legacy/projection work in the existing stream and actual-storage/authority increments under reviewed interfaces. No new owner approval, role/model change, schedule or speculative implementation is requested.

## Basic-session contract preparation — 2026-09-07, v0.3

The preceding readiness check was too narrow: it established that no **implementation under a closed accepted interface** was ready, not that all useful work had stopped. The owner's adopted handoff §4 already authorizes preparing missing technical contracts while independent review is unavailable. This continuation adds the concrete basic-session appendix to the same two PR46 documents. It changes no product/rule, adds no implementation stream, and does not claim independent acceptance or publication.
The appendix proposes exact start/set/skip/close field placement, optional closed effort variants, separate lossless legacy views and a specific prospective source-function amendment. It records actual version forwarding, session selection/history and class-hardcoded correction seams. It expressly leaves version allocation/negotiation, reps domain, slot allocation, correction/offer/partition commitments and the full engine bridge OPEN. No new owner training decision has been established. Current control-state precedence and privacy/review/operational/physical gates remain.

The new executable public attachment `proposed-session-contract.cjs` runs against the retained product at `bbbdc0266ad1342066c106d267dbc8f61bd0e611` (unchanged from integration base213300c for these modules). It checks all four input-module SHA256 pins before loading the actual client builder, authority shape validator and both canonical encoders. It creates per-run synthetic commitment material without writing or printing it. It does not invoke complete local commands or authority admission, and never loads private fixtures, seed or engine entry points.

```text
SESSION-CONTRACT-PROPOSAL 45/45 PASS | proposed valid 14 | current/proposed differences 29 (20 sheet-required; 9 proposed-profile) | canonical parity 45/45 | synthetic compatibility examples 3/3
```

The proposal's positive cases cover both start variants, optional absent effort, all seven effort variants, both skips and both closes. Its negatives include required identity/load/reps omissions, blank identities, misplaced fields, missing/unknown completion, zero load, unsupported proposed unit and invalid effort variants. Two existing refusals check missing unit and nonfinite load. Twenty differences isolate sheet-required shape failures; nine are only proposed profile differences and are not assigned new defect IDs. These45 cases are unrelated to the separate D1–D45 register. Canonical identity examples distinguish absence/null/zero and bound/exact; a separate synthetic copy preserves original bytes while moving a legacy alias into an envelope changes its commitment. They do not certify an implemented compatibility reader, correct schema activation, inference of a missing legacy identity or full workout eligibility.
Reuse the prior `work/workout-schema-prep` seven-red/11-control diagnostic as historical full-memory-admission evidence; its assumptions include an earlier clean docs head and it was not rerun or silently repinned. The new attachment independently pins only the four actual modules it loads. Both source code and complete sanitized output accompany the review package; run `node proposed-session-contract.cjs <verified-repo-root>`. Exit0 means proposal-example checks agree; exit3 means a harness/source/control failure. A future product gate must separately become GREEN on implemented boundaries and detect effective mutants.
Targeted same-family source review found that `buildRirSets`/`rirSetsOf` copy and pad effort while `deriveLastMeta` carries scalar load and effort; neither proves bounded3+→exact3 safe. This preparation therefore selects no lossy engine transform. QA also required pre-load canonical pins, added missing/blank basic-field controls, and separated proposed-profile differences and synthetic compatibility examples from ratified failures/implemented behavior. These corrections are incorporated; same-family QA is not C acceptance.
Fresh focused run and two-document whitespace/scope checks PASS. Product/frozen/suite/soak files unchanged. No fresh full suite, strict, browser, CI, independent review or release claim is made for v0.3; all mandatory candidate/integration gates remain pending through the existing authorized route. The recorded direct strict filesystem failure is unchanged and was not retried. The sealed process-amendment ZIP remains intact; the new cumulative PR46 patch supersedes only that ZIP's older PR46 patch, not its PR47 changes. Do not apply both PR46 patches.
Wall-clock: the complete continuation was not separately instrumented; the review manifest records its final packaging UTC time. Work included source reconciliation, the executable proposal, bounded same-family review, documentation and packaging. No exact elapsed-time or usage/cost saving claim is made.
NEXT: this is an additional review-ready input for the retained PR46, not a new queue item or accepted product. Continue narrow preparation of its named open schema/version/projection joins as useful work permits. C reviews the actual proposed contract/attachment when the existing route is available; I publishes the retained edits and completes current mandatory gates/CI before integrating accepted revisions. Keep W6/R1 ownership, coordinator, models and existing paused continuation; no extra schedule or owner relay.
# v0.4 continuation — conflict and capability transition, 2026-09-07

Same retained PR46/base and TWO local documents; no product files changed in this branch. The concrete conflict/schema transition appendix now names proposed fields, complete partition/decision coverage, causal ownership dependencies, canonicalization and immutable old-capability handling. It does not select a schema version, amend training rules, implement a reducer or claim private-use readiness.
New `session-boundary-diagnostic.cjs` verifies23 retained client/authority source pins before loading actual T2/T3. Per-run keys, synthetic accounts and memory stores only; no operation or receipt bodies are emitted. Output:

```text
VALID-READING-CONTROL PASS
OLD-LEASE-LATE-ARRIVAL-CONTROL PASS
NEW-LEASE-OLD-CLIENT-SCHEMA REQUIREMENT_RED
MATCHED-SCHEMA-CONTROL PASS
WORKOUT-RESOLUTION-SAVED-THEN-REJECTED REQUIREMENT_RED
RESOLUTION-GENERATION-SHAPE-CONTROL PASS
NAIVE-LEASE-REPLACEMENT-STRANDS-PENDING REJECTED_DESIGN
TERMINAL-REJECTION-IS-NOT-REPAIRABLE-BY-LEASE-ROLLBACK PASS
SESSION-BOUNDARY DIAGNOSTIC: 5/5 controls PASS; 2/2 existing requirement witnesses RED; 1/1 naive lease-upgrade design REJECTED
```

Recorded Node exit2 is deliberate diagnostic RED, not a passed product gate. A first scratch syntax error was corrected before any evidence credit. Schema2 is an invented future-capability example; direct lease replacement is an intentionally rejected test design, not a production renewal API. The generation-removal control isolates validation only; it is not proposed as the fix. Existing45-case basic-session examples remain unchanged, not rerun as new progress. The attached source/result/pins/output allow the existing reviewer to reproduce these findings from the exact retained public product.
The W6 implementation stream separately added an actual emitted-schema guard to its existing public-client boundary under A2, with132 local tests and4 effective bites; that unaccepted local fix is not claimed on this docs branch and does not solve new-schema activation. This stream's additional research is limited to RFC8785 serialization and RFC6902 patch semantics, cited in the brief, plus the existing source-backed conflict/legacy mapping. Canonical-v1 is not silently replaced with JCS and correction is not converted to generic JSON Patch.
Independent review remains required. Current retained Opus trial evidence is preparation only and has no acceptance-role activation; no failed/refused trial was restarted. The new user objective prioritizes the qualified workout/private-port result. It does not itself establish real account/storage/recovery/phone proof or authorize author self-acceptance. Scope/patch verification remains local; strict/build/publication/CI and C/I acceptance are not newly claimed. Final packaging UTC is recorded in the manifest; no separately instrumented full-continuation duration or cost savings claim.
NEXT: review this concrete appendix in the existing contract set; close the remaining schema/commitment/reducer fixtures and production joins, while retaining current W6/R1 ownership. No new queue, schedule, reviewer trial or owner relay.

## v0.5 — reusable workout-view preparation

Same retained PR46 at bbbdc026, TWO document changes only. Actual engine/public mock/W7 sources were checked unchanged; one source check initially ran from the projectless root and failed before comparison, then passed from the retained repository. No engine, accepted core, dependency, frozen suite or seeded-soak changes. The preceding goal turn completed the W6 schema guard; this turn did not rerun or claim new credit for its132-test package.
Owner handoff§5 authorizes early synthetic UI/projection preparation. New review-only code outside the repository (`work/workout-presentation-prep`) implements a G14 projector/renderer using the actual accepted read composition and whole `genSession` result. A source-pinned harness compares against the full engine only as a local oracle. The generated HTML contains six labelled synthetic examples, no executable scripts/external resources/input forms/storage actions, and only local fragment links. Nine actual read factories are verified loaded; the full engine/seed is excluded from this generation path. This is a static preparation artifact, not an alternative compiler or production build.

```text
WORKOUT-PRESENTATION PREPARATION: 22/22 exact genSession parity; 22/22 DOM cases; native+frozen Date; read composition excludes seed
WORKOUT-PRESENTATION BITES:3/3 EFFECTIVE — scalar flatten / baseline zero / unsafe markup; literal restoration PASS
STATIC-WORKOUT-PREVIEW PASS — 6 actual-engine examples; 9 read factories; no scripts/network/storage/private seed loaded
```

Same-family QA found the two important limits now in the brief: the scalar genSession DTO omits a per-set load vector, and an active queued debut may change the derived target without this viewer establishing accepted-plan provenance. Both now have executed synthetic cases; no global queue/consent filtering or engine repair was invented. Renderer withholds an unresolved scalar load, shows baseline open slots, uses textContent for athlete-provided strings, and removes the mock's false Logged/Current labels. Full per-set and accepted-plan mapping remain required before real workout use. This is preparation QA, not independent acceptance.
Browser navigation was denied by the browser permission system. Visual, responsive, keyboard and physical-device verdicts remain NOT RUN; no alternate browser or indirect rendering route was used. The temporary helper had closed stdin and management-interface reads were denied; its exact listener and Node process were subsequently verified through a narrow native listener lookup and stopped, with terminal exit confirmed. A historical NEXT search was too broad; its content was not included in artifacts, and subsequent reads were confined to the rebuild sources. No private fixtures were inputs to this work.
The bounded K1 source review confirmed that pre-arming is already proposed for controlled observations. It does not close sign-out intent learned before a failed arm, unsolicited standing loss, final permission samples, overlapping callbacks or old restored markers. No duplicate fence experiment or CLOCK claim was added; the current partial frame mechanics and unimplemented closure contract remain.
The raw artifact and manifest record code/input hashes and final package time. Full-continuation cost/time were not separately instrumented; no speed saving or app-date promise follows. New candidate/integration gates, independent review, exact publication/CI and owner/private-use proofs remain required. Earlier sealed W6/process/workout artifacts remain unchanged.
NEXT: use this reusable component and its compatibility witnesses when reviewing the existing workout contract. Close the actual per-set/accepted-plan and command/correction/version joins; do not mistake static output for a logging app. Preserve the same coordinator, retained streams and model settings; no new queue, schedule or reviewer trial.

## v0.6 — correction and engine-carrier closure, 2026-09-07

This continuation addresses a concrete whole-workout dependency while the existing reviewer/integrator remains unavailable. Same retained PR46 headbbbdc026 and TWO documents; no accepted client/authority/engine, original suite/frozen app/soak, W6 source or ownership changes. The brief now gives a selected-version set-edit/removal field table, targeted validation and projection source delta, immutable-history/accepted-plan separation, and explicit remaining concurrency/clearing contracts. This is technical preparation, not schema acceptance or an implemented fix.
The new `workout-edit-diagnostic.cjs` checks23 source pins before loading actual unchanged synchronous T2/T3. It submits legacy synthetic session bytes, appends edits through the real public client API, admits them, verifies signed exact retries, delivers the dispositions, restarts and inspects actual initial-plan choice inputs and resume/offer behavior. Every accepted authority log row is compared with the unchanged client envelope. A first reply is serialized before replay; both signatures verify. This exercises the existing HMAC test boundary, not W5 P-256, real HTTP, D1, IndexedDB or a phone. Bootstrap intentionally uses the current incomplete legacy session shortcut; it is not a fully conforming new workout control.

```text
SESSION-APPEND-AND-CONSENT-CONTROL PASS
READING-CORRECTION-CONTROL PASS
READING-TOMBSTONE-CONTROL PASS
WORKOUT-REPS-CORRECTION-IGNORED REQUIREMENT_RED
WORKOUT-LOAD-CORRECTION-IGNORED REQUIREMENT_RED
WORKOUT-TOMBSTONE-IGNORED REQUIREMENT_RED
EMPTY-CORRECTION-SAVED-THEN-REJECTED REQUIREMENT_RED
EMPTY-TOMBSTONE-SAVED-THEN-REJECTED REQUIREMENT_RED
WORKOUT-EDIT DIAGNOSTIC: 3/3 controls PASS; 5/5 existing requirement witnesses RED; signed exact retries and immutable originals checked
```

The recorder observes native child exit2 and writes verdict-only output, runtime/source hash and elapsed time. The host shell initially displayed exit1; native exit2 was separately confirmed, rather than treating wrapper behavior as a product failure. The three workout projection witnesses concern already accepted corrections/removal, while the two empty-input witnesses directly meet A4's locally decidable validity rule. The actual plan examined is the new local operation after explicit choice; a remotely committed plan is not claimed. No new D-number, proposed generic last-writer-wins rule or owner-ledger trigger claim is assigned.
The companion `legacy-workout-diagnostic.cjs` exercises actual extracted `completeSession`, reconstructed `lastMeta`, following prescription fields and score on wholly invented state. Its positive control uses uniform loads and supported endpoint effort. Its negative compatibility probes demonstrate omitted entry load vectors; repeated exercise entries losing distinct loads/operation identity; a supplied middle effort replaced by null; and a retained bounded-effort object that is not the legacy numeric representation. These are tests of potential adapter representations, not assertions that those unadopted input shapes were previously supported. The bounded case checks the real getter plus a generic numeric-coercion probe; it does not execute every numeric consumer or select a training rule. D41/D43 and old prototype tests were not rerun as new progress.
All loaded engine modules are pinned before require and checked again after execution. The full local composition loads its seed module as code, but no SEED/HISTORY/private fixture supplies a test input or appears in output/artifacts. This is not the data-free browser assembly; that remains a separate mandatory implementation/package gate. The script is a scratch review attachment, not shipped application code.
Same-family QA independently reproduced the edit rows, required explicit legacy-bootstrap and authority-log qualifications, and reviewed the proposed contract. An initial replay-alias concern was withdrawn after checking the authority's copy semantics; capturing first reply bytes is a strengthening, not a newly discovered authority bug. No author/helper result is independent milestone acceptance. Test-source pins are fixed during normal reviewer runs; changed sources must refuse rather than silently repin.
Focused output and two-document whitespace/scope checks are the new evidence. Current mandatory build/browser/strict/publication/exact CI/independent gates remain outstanding; unchanged failed compiler setup was not retried, and no old full-suite result is presented as a fresh v0.6 candidate verdict. All earlier sealed artifacts and the current six-file W6 patch remain intact. The v0.6 cumulative PR46 patch supersedes earlier PR46 patches only.
Wall-clock: focused work began05:10UTC; the package manifest records completion time and each executable records its own measured runtime. No full-app deadline or measured cost-saving claim. NEXT: use these source-backed requirements to implement the complete edit/projection path after its existing designated contract acceptance; close lossless per-set/effort representation through the retained M2 process. Continue from the same coordinator and worktrees, without a new schedule, reviewer trial or owner relay.

## v0.6 fresh local gates and review coordination — 2026-09-07

The owner approved the process-audit recommendations. PR46 and PR47 may share one review packet but require separate verdicts bound to each exact commit; neither is an all-or-nothing acceptance dependency. PR46 can proceed under the existing process. Conditional deferrals only take effect after the artifact authorizing them is independently accepted and integrated. No technical acceptance or private-use gate is waived.

Fresh execution used retained HEAD `bbbdc0266ad1342066c106d267dbc8f61bd0e611` plus the proposed two-document working changes, Node v24.19.0 on Windows and a real node_modules directory. Normal Git now works; no trust override or permission bypass was used. A scratch copy of the existing preparation helper removed only its historical `-c safe.directory=...` arguments; the original helper and earlier failed logs remain unchanged. Locally regenerated private gate inputs matched the required pins; private details are withheld and committed public oracle pins remained unchanged.
Conformance and SELFTEST used explicit ENGINE_MAIN/ENGINE_OLD from `work/m2-2-artifacts`, EARNED_CLIENT_DIR pinned to this checkout, MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York. PL_ENGINE/PL_LAWS_LIB were unset. Strict additionally unset MEASURED_TEST_NOW. The existing scope-package.mjs CLI verified both committed and working-copy frozen paths and constructed/inspected the actual old-app ZIP.

```text
FROZEN-PATHS PASS — pinned authorized base; committed and working copy
OLD-PACKAGE PASS — 18 allowlisted files; actual ZIP entries and bytes verified
INFO 9 engine-track rig185: W1 PASS, W2 PASS
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
SELFTEST PASS
PASS  engine suite — 3072 assertions passed
PASS  APP_V 7.56.0 === sw cache earned-v7.56.0
PASS  18 files ship; ledger/, src/, tools/, scripts/, docs/ and rebuild/ stay off the CDN
All checks passed. Safe to ship.
```

All five preparation/gate subprocesses exited0; their measured time totals78.642 seconds (conformance7.206; SELFTEST22.888; strict48.148). This is local verification time, not total development time or an app-delivery estimate. New logs are separate from the retained failures at `work/owner-workout-v06-gates-2026-09-07T17-20-19-263Z`; only verdicts are reported. Two-document whitespace/scope checks PASS. A preliminary lookup used the wrong scope-wrapper extension and was corrected before gate execution; it earned no verification credit.
These fresh results supersede the earlier local strict blockage for this candidate. The strict tool's closing line is its literal result, not authorization to deploy this proposed brief. Final new-PWA packaging, browser/physical evidence, production/storage/schema joins and all qualified private-use gates remain open. No source, suite, seeded stub, dependency, queue or ledger changed in this continuation.
NEXT: publish the updated existing PR46, obtain its exact-commit Windows/Linux CI and independent contract verdict, then let I integrate only its accepted revision and verify the combined result. PR47 receives its own exact-commit verdict even if reviewed in the same packet. Preserve the existing streams; no new owner relay, model change or self-acceptance.
