# BRIEF-F2-TAG-PROJECTION v0.1

Status: BRIEF-READY for PM judgment; no acceptance or product licence claimed.
Author: Lane D (Astra), 2026-09-12. Recon base: F1 common candidate 2d50e88.
Branch: rebuild/lane-d-f2. Proposed package: M2-F2-TAG-PROJECTION.
Authority: DECISIONS:148(3b); A4b integration and remaining seam: :149.
Effort: engine author HIGH; independent engine reviewer MAX, arranged by PM; mechanics LOW.

## 1. Outcome and boundaries

A saved A4b exercise's primary region and secondary credits reach the same engine state used by Today and the gym, survive reload, and drive designed volume, recorded-volume accounting and the existing proposal budget consistently. The stored setup snapshot is the source. No lookup by the athlete's exercise name, slug, or the catalogue's current contents reconstructs an answer the operation already carries.

F2 applies to tagged U/L and F programmes. Legacy athletes without a tags snapshot remain byte-identical to the accepted parent, including no-F volume, frequency, labels and proposals. Requiring *tagged* U/L athletes to retain the old missing-tag answer would defeat F2; this distinction is part of the proposed behavior contract, for PM judgment. F2 changes neither calendar selection nor the F starter's set policy.

No schema bump, ninth stored exercise member, new operation, history rewrite, inferred tag, automatic plan change, or new volume band. An absent tag snapshot means unknown legacy metadata; an explicit empty secondary list means the athlete supplied no secondary credit. They must not collapse into one branch.

## 2. What the current product does (source recon, not executed proof)

Paths below are relative to `rebuild/`; citations refer to 2d50e88 and must be re-taken on the accepted parent before building/sealing.

| source | reached behavior and implication |
|---|---|
| m3/w7-preview/today/exercise-catalogue.mjs:74,78,85 | Catalogue id is not athlete id; records hold `head` and `secondary:[{mg,lend}]`. The half-credit convention is cited; assignment of helpers and quarter-credit are declared INVENTED (:25-32,84-90). |
| m3/w7-preview/today/setup-model.mjs:434,441,456,599 | Edits survive catalogue selection; `document()` keys tags by the final, unique exercise slug. Renaming a row is not a licence to infer its anatomy again. |
| m3/w7-preview/today/setup-commands.mjs:54,93,118 | `tagsOf` checks exact ids and shape, nonempty strings and finite `(0,1]` lends; it does not check muscle vocabulary, primary-region compatibility, duplicate helpers or self-credit. The durable payload is exactly `{profile,setup,tags}`. |
| m3/w7-preview/today/setup-host.mjs:45,62 | The C reader excludes rejected/tombstoned operations and preserves tags; pre-A4b absence returns null. |
| m3/w7-preview/today/today-entry.mjs:99,130,291,304 | Injected/local-era setup hosts can bypass the C wrapper. `athleteState()` passes only `rows[0].setup`. At this recon base boot still does not use that state; H3 owns that pending change. Constructor-only enrichment would not reach the live page. |
| m3/w7-preview/today/today-model.cjs:108,132; today-entry.mjs:160,164 | Today clones its supplied basis and replays readings; gym/current-day and abandoned-day hosts consume `stateFromOps()`. Enrich the shared basis once, before this fan-out. |
| engine/volume.cjs:36,42,77,83,154 | Primary counts use `head || mg`; indirect counts and weekly spillover still read `INDIRECT[exercise.id]`. Arbitrary A4b ids therefore lose secondary credits, while a custom id colliding with `press` could inherit someone else's mapping. |
| engine/constants.cjs:327,330,333; engine/writers.cjs:1302,1318 | Existing bands and cap remain the parent constants. Legacy INDIRECT has four fixed ids. F cap aggregates direct sets by head; the proposal chooser reads the volume rows and spillover budget. Labels for back regions are inherited from H3, not re-added here. |

The catalogue's current secondary data has a real ambiguity: `delts` appears for both a chest press (:85,94) and a face pull (:126); `back` appears for a Romanian deadlift (:174). The snapshot does not identify the secondary head. F2 may not turn every `delts` helper into `delts_front`, distribute one helper across every region, or use exercise names to guess. That legacy conversion stays on legacy inputs only.

## 3. Proposed representation and validation

1. Add a pure, constructor-independent module `m4/workout/setup-tags.cjs`. Proposed factory: `createSetupTagProjector({taxonomy})`, returning `validateSetupTags(setup,tags)` and `projectSetupTags(state,{setup,tags,op_id,date})`. C binds one frozen taxonomy from its approved catalogue muscle/region exports, not from a setup operation or a duplicate authored label list. The caller first invokes the existing `createCleanInitState({setup})`; the projector returns a fresh frozen state. Keep the original closed setup and exercise contracts unchanged.
2. With absent/null snapshot, return the constructor state unchanged. With a snapshot, require exactly one tag for each setup exercise id and no others. State/record ids must agree; refuse by named `SETUP_TAGS_INVALID` before any enriched state is returned. Do not partially project or fall back to legacy credit on malformed input.
3. Tags retain exactly `{head,secondary}`. A head is null or a known region compatible with the exercise's `mg`. Secondary entries retain exactly `{mg,lend}`; allow known coarse muscles or named regions, finite `0 < lend <= 1`, unique target keys, and no direct-bucket self-credit. Reject duplicate helpers rather than silently adding/capping them. Reject unknown keys, bad prototypes/accessors and mismatched ids. These semantic checks supplement the current producer's shape check; C calls the same pure validator before a new operation commits.
4. Project `head`, a cloned `secondary` list, and a runtime-only provenance marker `volumeTags:{profile:'earned/setup-volume-tags/v1',op_id,date}` onto each corresponding engine exercise. These names/profile are PROPOSED implementation vocabulary, not stored schema. No other exercise field changes. Preserve ids, families, order, sets, loads, forks, native carriers, readings, sessionLog and every operation/outbox byte.
5. A tagged exercise always selects the snapshot branch, including `secondary:[]`. No fallback to fixed-id INDIRECT is allowed in that branch. An untagged exercise selects exactly the parent's legacy path. A mixed state must make that choice per exercise, without changing another exercise's totals.
6. The accepted initial setup snapshot is immutable and supplies tags only for its own exercise identities. F2 does not introduce tag editing after enrollment, or apply a new setup fact over imported/pre-setup history. Refuse a conflicting provenance context with a named error; designing dated tag revisions or classifying old imported exercises needs a later brief.

## 4. Engine accounting, including unresolved regions

Add source-owned helpers in `engine/volume.cjs` for primary bucket, snapshot secondary credit and the muscles a set change touches. Route designed volume, observed-volume secondary accounting and structural-move spillover through them. `writers.cjs` consumes these same classifications for eligibility and F cap consequences; it must not carry a second credit table. Neither module imports the screen catalogue.

For snapshot data, a known region is credited to itself and a muscle with no regional split keeps its coarse key. A coarse `back`/`delts` value remains explicitly region-unresolved. Proposed tagged row metadata: `qualified:false, qualification:'region-unspecified'`; show the aggregate only as an unqualified count, with no regional band, hypertrophy tier, growth verdict or adaptive set proposal. Fully specified rows use the parent's arithmetic/bands. Emit these extra fields only for tagged results; legacy output object keys/order stay unchanged.

Unresolved credit still spends the existing structural budget for that muscle family: a coarse back/delts helper marks the coarse key and its known regions as touched for that review window. This is a conservative budget match, not set allocation to each region. Never multiply the numerical volume by that list. A proposal cannot evade the budget by switching from a coarse helper to one of its heads.

Primary group-only custom back/shoulder exercises remain loggable, counted and visible as region-unresolved; their unknown split is not a reason to invent one or issue a regional verdict. Custom chest, arms/legs with specified region, and other fully specified targets follow the same snapshot rule as catalogue rows. `customEntry` currently produces explicit `secondary:[]` (exercise-catalogue.mjs:266-295); it means zero authored helper credit even when its final id happens to match a legacy key.

Quarter-credit and the catalogue's anatomy assignments become numerically active for the first time. They remain declared programming estimates, not newly validated science. This brief proposes consuming the athlete's saved values verbatim after validation. PM must judge that activation and the unresolved-region policy before acceptance; Lane D supplies no new physiological claim. A later catalogue correction changes future setup snapshots only.

Designed sets remain `configured sets * exposure` from the accepted F1/B2 calendar. Observed sets remain only actual recorded sets from the parent's accepted history view. Do not manufacture native or legacy entries to make a volume check pass. If the accepted history projection cannot supply a required row, report that seam instead of treating a synthetic legacy-log proof as native proof.

Synthetic arithmetic (INVENTED proof values): on two F days, a renamed upper-back row with 3 sets and biceps 0.5 yields upper_back 6 and biceps 3; a custom same-name exercise with secondary [] contributes no biceps. Recording only one 2-set appearance contributes upper_back 2 and biceps 1 to observed volume, not the designed 6/3. A face-pull snapshot with `delts:0.5` contributes an unresolved delt count, never an asserted front/rear count.

## 5. C companion and pinned-surface boundary

C owns the entry work. Request either its implementation companion or explicit PM custody for the narrowly named files below. Keep `m3/w6/local/today-bindings.mjs` byte-identical: do not widen its signature, change its `all()` shape, mutate its returned rows to smuggle tags, or write metadata into `setup`.

In C's `setup-host.mjs`, expose one read helper over the already-open handle's repository using the existing `setupsIn`; it returns the exact setup snapshot plus tags for either the injected/local-era path or the standalone path. In `today-entry.mjs`, the accepted setup-state path uses that helper, the existing constructor, then the pure projector. Both enrollment and state selection continue to name the same accepted setup operation. No second store, enrollment, client or lookup authority is created. Preserve selection/rejection/tombstone behavior; an unavailable tagged read is a named refusal, not an untagged fallback.

Build this after H3's real fresh-state basis binding lands; at 2d50e88 that binding is absent. Re-read H3's accepted code instead of transplanting this base's stale boot comment. C's existing shared-page serialization and H3/F1 pins apply. If a named entry/build/test file is still pinned, B declares the specifically permitted successor before any edit/seal; a screens licence alone does not defeat a byte pin.

The setup summary must distinguish its direct design arithmetic from the runtime's fractional result. C either renders the engine result including unresolved rows, or labels the displayed count as direct sets only; it cannot reuse a tag-only regional band as an engine verdict. F1's coming-soon sentence clears only after the real companion journey and this agreement are proved, not when this brief or a label table lands.

## 6. Proposed custody and READ-LIST

| owner/files | proposed work | estimated changed/additional lines |
|---|---|---:|
| D: m4/workout/setup-tags.cjs (new) | pure validation and enrichment; no constructor/engine import | 130-190 |
| D: engine/volume.cjs, writers.cjs | snapshot credit, qualification, observed/design/budget consistency | 90-150 |
| D: lanes/d/f2/** | public fixtures, product proofs, mutants, report | 300-500 |
| C: today/setup-host.mjs, setup-commands.mjs | same-store tag reader; shared semantic validator at new-write gate | 20-45 |
| C: today/today-entry.mjs, build.mjs | accepted-basis binding and explicit new build input | 10-30 |
| C: today/setup-app.mjs or its accepted summary helper (only if required) | direct/engine/unqualified count wording; no redesign | measure after companion recon |
| B: tooling/package spec and granted successor carriers; workflow child step | closed cumulative admission/private FULL/seal | B measures |

Three D product modules (one new), estimated 220-340 product lines; companion estimates separate. No changes proposed to constants, progression, migrations, merge, native-history carriers, source payloads, client, or frozen laws. This table is a request, not custody already held. Measured scope replaces estimates at PR-READY.

READ-LIST: AGENTS READ FIRST; LANES/CHARTER; DECISIONS:148-149 and PM-cited later grants; this brief; F1 product at 2d50e88, F1-CANDIDATE-REPORT.md at 7371879 and its eventual accepted artifact; accepted H3 basis/labels and B2 date-window successor. Public source: today/{exercise-catalogue.mjs,setup-model.mjs,setup-commands.mjs,setup-host.mjs,today-entry.mjs,today-model.cjs,build.mjs}; m4/workout/{athlete-state.cjs,setup-tags.cjs}; engine/{plan.cjs,volume.cjs,writers.cjs,constants.cjs:327-360}. Named proof dependencies after custody confirmation: public host journey fixture/runtime/engine-history projector, C's accepted setup journey and summary renderer, B runner README/current predecessor package. Any additional file needs a named request. Never read seed.cjs, ledger/, conform/private/, src/history.js or protected soak data; no cloud checkout.

## 7. RED-first cells and decisive mutants

| id | required product proof (candidate GREEN, unchanged parent RED for new behavior) |
|---|---|
| F2-01 | Real saved A4b tags reach shared Today/gym state after close/reopen on both local-era and standalone setup paths; same operation id and exact snapshot. |
| F2-02 | Exact id/shape/known-vocabulary/compatible-head validation; malformed, duplicate and self-credit cases named-refuse before commit or projection; operations, outbox and state unchanged. |
| F2-03 | Absent legacy tags and explicit empty tags diverge correctly; custom id `press` with [] gains no legacy helpers; renamed catalogue row retains its authored helpers. |
| F2-04 | All catalogue snapshots and permitted custom endpoints project deterministically without current-catalogue lookup; unknown strings are refused, group-only endpoints remain unknown. |
| F2-05 | Synthetic direct/fractional arithmetic agrees for tagged U/L, F-only and mixed weeks; exercise sets, target lengths, native last/next targets and history bytes do not change. |
| F2-06 | Partial real recorded session uses actual sets only; designed and observed counts remain distinct, including retirement, native history and unchanged legacy records. |
| F2-07 | Coarse delts/back stay unresolved; no front-delt guess, no cloned credit to every region, no regional band or adaptive offer from unresolved totals. |
| F2-08 | A performed set-change touches both direct and snapshot helper targets; coarse spillover blocks its regional budget without duplicating sets; indirect-only rows remain ineligible. |
| F2-09 | F cap sums direct sets for the correct tagged bucket across both families; secondary credits never become additional performed/direct sets. |
| F2-10 | Setup summary, runtime rows and displayed qualifications agree; catalogue edit after enrollment cannot rewrite an existing snapshot; save refusal retains setup/history/outbox. |
| F2-C | Tagless U/L public differential is byte-identical on constructor/session/volume/proposal outputs, absent/unsorted/date-edge splits and retired lifts; private verdict supplied only by B. |

Mutants must kill: drop tags at W6-entry seam; attach by array index; lookup current catalogue by name; [] falls back to legacy id; remove primary head; duplicate a helper; double credit in F; scheduled sets substituted for actual; delts always maps to front; coarse credit distributed across heads; omit spillover budget; leak one enriched state before a validation refusal. A named assertion must kill each, not a syntax error or the existing F1/B2 dependency failure.

## 8. Package and handoff

Build after the F1 product candidate, as :148 directs, but seal only on the accepted immediate predecessor after H3 -> B1+B2 -> B4+B3 -> F1 unless PM changes the order. Re-take source citations/preimages, inherit all accepted F1 and 45-register laws, all 19 gates, public differential, second gate, own bites and mutants. No private reads by D. B supplies F2 admission, closed cumulative package, granted successor substitutions, private FULL verdict and sealing service on the PC; no full-run claim exists at this brief stage.

PM supplies the independent engine reviewer and judges the final package. C's companion keeps its independent screens/plumbing review and both-OS CI; those do not substitute for engine review. Every byte pin follows the reviewed successor process, ancestry/tip and receipt rules. Lane D writes no acceptance, ruling, theme, brief-by-sha or receipt lines and never merges/deploys.

PM asks before implementation: confirm snapshot-first semantics including explicit-empty override; judge activation of the declared catalogue credits and unresolved-region handling; arrange the C companion/custody and required B successor path. Evidence now: source recon only. Product tests, FULL/private run and real phone journey: NOT RUN for F2.
