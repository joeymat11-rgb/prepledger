# EN3-DIAG - P3-EN3 red at W11 (84f8421): a native-load "yes" is a plan write that local admission refuses

Static read only. No test or program was run. W = C:\Users\joeym\AppData\Local\Temp\earned-s11int.
Not opened: any src/ path, ledger, soak paths, rebuild/conform/private, EarnedPort, any built app.js,
and the five protected files (rebuild/client/index.cjs among them). Where a claim depends on
index.cjs it is marked INFERRED and the run that settles it is named.
Spec read with `git show 7ef8291:rebuild/coach/NATIVE-LOAD-SPEC.md` (R9.13, branch
rebuild/c-native-load-spec; not in W11's tree; cited below as SPEC:<line>).

## 0. Short answer

The cell is right. A real person who taps **Yes** on a native-load offer on the Today page
gets one durable operation `{class:'plan', kind:'proposal-response', payload:{proposal_id,
answer:'accept', issuance}}` in the installation's own log. If that person then imports the
old-app history on the Import screen, `prepareSource` reports `LOCAL_SOURCE_EFFECT_UNMAPPED` for
that op (source-admission.mjs:534). The import is refused and retracted. The spec already names
the missing piece: FC09 (a "native-load" family in source-admission.mjs). It is unbuilt and
recorded as debt D-R9-ADMISSION. This is a product gap, not a register/test-only fix.

## 1. The two call sites, end to end (genuine use)

UI to durable write, every hop in shipped modules:

1. today-entry.mjs:265-299 `paint()`: each offer card has a "Yes" button
   (`NATIVE_LOAD_COPY.yes`). today-entry.mjs:286 wires it to `api.accept(offer.proposalId)`.
2. today-entry.mjs:241-262 `answer()`: **today-entry.mjs:245 `h.respond({ handle, proposal_id,
   answer })`** (call site #2). `h` is the host from `hosts.createNativeLoadHost`
   (today-entry.mjs:389-397). This is the HOST's `respond`, not the durable client's, but it leads
   to the client's.
3. today-bindings.mjs:705-728, the host's `respond()`. A decline or cancel writes nothing
   (:706). An accept re-projects (:713) and requires the held issuance to equal a fresh offer
   (:718). It then issues a one-time ticket (:720) and calls
   `client.respondNativeLoad({ ticket })` (:722).
4. local-client.mjs:407-416 `respondNativeLoad` -> :412 `bridge.execute("respond", args)`.
5. local-client.mjs:220 `stage()` -> the real T2 stage, built at local-client.mjs:214-215 with
   the guarded capability.
6. t2-stage.cjs:81 (`command === "respond"`) -> `nativeRespond` (:27-35) -> **t2-stage.cjs:34
   `client.respond(owned.proposalId, "accept", clone(owned.issuance))`** (call site #1).
7. local-client.mjs:139-146 `respondFailure`, chained into `validateCommit` at :256-258: the batch
   must hold exactly ONE op, `class === "plan"`, `kind === "proposal-response"`, with a payload
   byte-equal to `{proposal_id, answer:"accept", issuance}` (:143).

**t2-stage.cjs is the shipped durable path, not a staging-only path.** The chain is
today-entry.mjs:532 `openTodayHosts` -> gym-host.mjs:53/67 `openTodayInstallation` ->
today-bindings.mjs:1052 `openTodayOverLocalEra` -> today-bindings.mjs:255-256
`openLocalDurableClient({..., nativeLoad: nativeTickets.capability})` -> local-client.mjs:214
`Stage.createT2Stage`. "T2 stage" is the name of the real write path: every weigh-in, set and
check-in commits through it. (host-bindings.mjs:261 builds another T2 stage with no nativeLoad,
so `respond` there refuses NATIVE_LOAD_CAPABILITY_REQUIRED.)

What is written, by collection:

- `ops`: +1 op, class `plan`, kind `proposal-response`, schema_version 1 (SPEC:101 "Use existing
  schema_version 1 plan/proposal-response envelope and existing respond, not a second consent
  record. Accept payload is exactly {proposal_id,answer:'accept',issuance}"). The issuance is
  `{producer, body, reason, revision, source, moment}`, and `source` is the null-import basis
  (today-bindings.mjs:633, :691).
- `outbox`: +1 entry for that op. `meta` (device, checkpoint) is updated. `derived` (sidecar) is
  rewritten (local-client.mjs:236-249).
- `plan`, `planTransactions`, `planTxns`, `planHistory`, `suspensions`, `issuances`: INFERRED
  to stay EMPTY. Evidence:
  - rebuild/client/README.md:42-43: "An action is acknowledged only after ONE durable
    transaction wrote the operation and its outbox entry". README.md:48-54: respond only READS a
    producer registered by `recordIssuance()`.
  - SPEC:36: respond "atomically records class plan/kind proposal-response".
  - The base client fixture rebuild/client/test/fixtures/base-index.cjs:271 gives `respond` no
    `also` writer. Compare `acceptInitialPlan` at :285, which writes `planTransactions` and `plan`.
  - `issuances` is written by `recordIssuance` (base-index.cjs:338; the coach path,
    rebuild/coach/test/accept-proposal-issuance.test.cjs:149-166). The native path never calls it.
  - `planTxns` is written only on authority dispositions (rebuild/client/sync.cjs:92-108). The
    local era installs no transport (t2-stage.cjs:74 `transport: undefined`).
  - SETTLE: on the PM seat, read rebuild/client/index.cjs `respond` (SPEC:36 cites :93-100 and
    :349-371) for any write other than ops/outbox/meta. Or run red-first cell T1 below, which
    asserts the non-empty collections after a real yes.
- Kinds the page can write: only `proposal-response` with answer `accept`. Decline writes nothing
  (today-bindings.mjs:706; SPEC:101). The NATIVE-LOAD "undo" is a compensating offer accepted the
  same way (today-entry.mjs:213-231 `intent: { compensate }`), so it is also a proposal-response.
  `planEdit`, `decision`, `undoRequest` and `acceptInitialPlan` still have no page caller: the EN3
  regex `\.\s*(planEdit|respond|decision|undoRequest|acceptInitialPlan)\s*\(` matches only these
  two modules, and `respondNativeLoad(` does not match `respond\s*\(`.
- P3-EN1 should stay green. Neither module builds a `{class, kind}` literal, and
  today-bindings.mjs:666 only READS `o.class === "plan"`. The write happens inside
  client/index.cjs, which the register already carries as `rebuild/client/index.cjs#plan`. Only
  EN3 (the proof that nothing calls a plan writer) goes red.

## 2. What local source admission does with such a store today: REFUSES

rebuild/m3/w6/local/source-admission.mjs:

- reviewSource (:174) -> validateGeneration (:176, defined :153-171). The op itself passes:
  schema_version 1 is allowed, `plan` is in Ops.CLASSES, the commitment is checked against the
  era identity key, and the outbox matches. The collection checks also pass if the plan
  collections stay empty (section 1):
  - :156 `if(Object.keys(c).some(k=>!COLLECTIONS.has(k)))fail('LOCAL_SOURCE_EFFECT_UNMAPPED');`
  - :170 `if(['plan','planTxns','planTransactions','planHistory','suspensions','issuances']
    .some(k=>Object.keys(c[k]||{}).length))fail('LOCAL_SOURCE_EFFECT_UNMAPPED');`
  If the PM's check of index.cjs shows respond DOES write one of those collections, the refusal
  moves earlier, to :170, thrown at reviewSource. The code is the same either way.
- prepareSource -> replay (:403; called at :777). In the per-op family loop, the plan op is not
  reading/session, not body-composition, not sleep, not food-day, not the setup/settings/check-in
  profile. It falls to the catch-all:
  - :534 `issue(op.class==='food-day'||op.class==='steps'?'LOCAL_SOURCE_DAILY_UNRESOLVED':
    op.class==='plan'?'LOCAL_SOURCE_EFFECT_UNMAPPED':'LOCAL_SOURCE_CONTEXT_UNRESOLVED',op.op_id);`
  - :777 `if(replayed.issues.length)return freeze({ready:false,pending:true,issues:...})`.
- Admission does not convert it, does not admit it through an existing family, and does not drop
  it. It refuses by name, as the register entry says. What changed is that a shipped screen now
  writes the op.
- Nothing in rebuild/m4/import that admission calls has a plan family. The portable
  accepted-receipt path, replay-core.cjs:168-182, would answer `ACCEPTED_ENGINE_CONTEXT_UNMAPPED`
  (:182). It runs over authority receipts, which the local era never has.

The spec names this exact gap:
- SPEC:45: "Shipped local admission dispatches families ... unknown plan operations get
  LOCAL_SOURCE_EFFECT_UNMAPPED. Both this path and portable replay need the SAME new family."
- SPEC:228: "FC09 rebuild/m3/w6/local/source-admission.mjs | ... NEW LOGIC: shared family before
  :526, historical cuts and folded output before :781; I4/I7; import either refuses every yes or
  drops it." (The spec's :526 is today's :534.)
- today-bindings.mjs:616-617 (host header): "Imported (string-lane) generations are refused
  SOURCE_FRONTIER_UNPROVEN here: their admission family (FC09/FC10) is not built."
- rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md:9 "FC09/FC10 not built"; :541 "D-R9-ADMISSION (the
  actual import path, FC09/FC10 unbuilt)".
- rebuild/lanes/astra/reviews/NATIVE-LOAD-BUILD-REVIEW-L11.md:77 "D-L10-1: FC09/FC10 remain
  unbuilt and native foreign admission stays shut".
- The only FC09 hunk that shipped is A-LEGACY-VECTOR (source-admission.mjs:840-863, called at
  :493). That hunk is not a plan family.

Existing tests: none admits a local source holding a native-load acceptance. Searched
rebuild/m3/w6/test, rebuild/m4/import/test, rebuild/m4/workout/test and rebuild/lanes/d for
`proposal-response`, `native-load`, `respondNativeLoad` and `class:'plan'`. The hits are:
- rebuild/m3/w6/test/local-source-admission.test.mjs:118-121 S3-Q-UNMAPPED: a plan op (kind
  `fact`) "withholds qualification", asserting `LOCAL_SOURCE_EFFECT_UNMAPPED`. This is the
  current behaviour, pinned.
- the same file :27-32 S3-Q-PLAN-COLLECTION: a non-empty `plan` collection refuses
  `LOCAL_SOURCE_EFFECT_UNMAPPED`.
- the same file :190-221 R913-ALV-*: A-LEGACY-VECTOR only, with no native record.
- rebuild/m3/w6/test/recovery-stage/suspension.test.mjs:28,37: authority-era proposal-response
  for the recovery stage, not local admission.
- rebuild/lanes/d/plan-edit/client-p6.test.cjs:49: plan-edit commands refuse the kind.
- rebuild/lanes/d/p3-replay-all/writer-order.test.mjs (runbook pre-check 8 cites it) covers
  F1-F8 and the gym card. It does not cover a native-load yes.
The native-load panel suite (rebuild/m3/w7-preview/today/test/native-load-panel.test.mjs:1550-2044)
tests only the HOST gate on a w5 `sourceImports` collection (NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN).
It never runs createLocalSourceController.

## 3. Who runs that admission in genuine use: the Import screen, so yes, a real person hits it

- The only shipped caller of createLocalSourceController is
  rebuild/m3/w7-preview/import/import-screen.mjs:433. That module is the Import route: the one
  dynamic edge from the Today boot graph (today/build.mjs:72 IMPORT_ENTRY; the "Import my
  history" link, on Today and on Measure per P3-RUNBOOK.md).
- Flow: identityYes (:424-448) -> importBundle -> `controller.reviewSource` (:438); then confirm
  (:456-) -> `controller.prepareSource(review, {identityConfirmed:true, prefixAnswer:true})`
  (:460). A not-ready result is shown as the bare code and the import is retracted
  (`fail(codes[0] ...)` then `retract(RETRACT_REASON.refused)` at :490). LOCAL_SOURCE_EFFECT_UNMAPPED has
  no sentence in REFUSAL_SENTENCE (:149-151), so the person reads the code alone. After a
  successful publish, `capability.reconcile()` (:494, source-admission.mjs:828-832) calls
  `reopen()`, which replays again.
- Moving to another device, or export/import of the new app's own store: there is no such flow
  in the shipped page. The bundle that importBundle/unsealBundle opens is the old-app port bundle
  (C2). No export or backup of the local era was found in w7-preview or w6/local. The Import
  screen is the one door.
- Concrete path to the refusal, every step ordinary use. Set up on the phone -> train on the gym
  card -> Close -> "Check next weight" -> "Yes" -> later tap "Import my history" -> the six words
  -> "Yes" to the identity question -> confirm -> LOCAL_SOURCE_EFFECT_UNMAPPED. Nothing is
  committed and the file is retracted. A workout recorded before the import is otherwise ADMITTED
  (runbook pre-check 8; local-capture-start-resume), so this is the only screen that now breaks
  "use any screen before the import".
- The other order: a yes AFTER an admitted import lands in the log too. The import admits no
  further replay except the reconcile's reopen, which runs right after publish, before any later
  yes. So the second order only bites on a later re-import or reopen of that source (SPEC:177
  requires those to reproduce). Not measured here.
- The host gate does not protect the person here. today-bindings.mjs:644-645 refuses only a
  non-empty w5 `sourceImports` collection. Before the import there is none, so the yes is offered
  and saved.

## 4. "The runbook": rebuild/lanes/c/P3-RUNBOOK.md, pre-check 8 (lines 78-107)

The register author report ties the two together (rebuild/lanes/d/P3-REPLAY-ALL-FAMILIES-
AUTHOR-REPORT.md:62-67, "## 5. The one writer that remains, and the runbook"). The runbook
currently says, with no exception for native-load:

> P3-RUNBOOK.md:78-86 "8. **ORDER OF USE BEFORE THE IMPORT: NO SCREEN IS OFF LIMITS.** ... Every
> writer the shipped page has now has a replay family, and each one was stood up on a real
> installation in both orders (`rebuild/lanes/d/p3-replay-all/writer-order.test.mjs`): the
> weigh-in (F1), the food day (F2), the first run and the machine note (F4), the recovery
> check-in (F5), Measure's day one, waist and markers (F7) and a recorded night (F8) may all be
> used before the import, in any order, and the import still admits."

> P3-RUNBOOK.md:89-95 "**THE GYM CARD IS NOW INCLUDED, AND NOTHING REMAINS.** ... There is NO
> ordering instruction left for him: he may use every screen, including the gym card, before or
> after the import."

With NATIVE-LOAD shipped, "nothing remains" is false. The cell's "the runbook must name it again"
means pre-check 8 must name the native-load "Yes" again: as an ordering instruction until the
family lands, or as an admitted writer (with its cell) once it does.

A stale paragraph to fix in the same edit, P3-RUNBOOK.md:143-152: "**Before step 2, do not open
Sleep on this phone.** ... `source-admission.mjs` replay() hands `reading`, `session`, the measure
family, `food-day`, `steps`, `plan`, the setup, settings and check-in profiles to a family
each". Sleep has had F8 since P3-REPLAY-ALL-FAMILIES, which contradicts pre-check 8. And `plan`
is NOT handed to a family: it goes to LOCAL_SOURCE_EFFECT_UNMAPPED (source-admission.mjs:534).

## 5. What the NATIVE-LOAD spec and reports say about replay and import of an accepted load

The spec is explicit: accepted native loads MUST come along on import, through a shared
"native-load" family (FC09 local, FC10 portable). Dropping them and refusing every one are both
named failures. Quotes (SPEC = git show 7ef8291:rebuild/coach/NATIVE-LOAD-SPEC.md):

- SPEC:11 "I4 TRUTH: accepted response plus issuance and later immutable Close are durable
  truth; every projection reconstructs at source frontiers; semantic evidence is spent once
  across imports/devices."
- SPEC:155 "FC03 runs on EVERY current projection: check; pre-commit respond; post-commit
  refresh; new capture; cold boot/cache rebuild; local source admission/reopen/rollback;
  portable import replay."
- SPEC:157 "ADMISSION GATE (binding now): a native plan record is admitted only if it was
  committed through this installation's guarded host (FC06/FC07/FC08) into its own authenticated
  local log. EXTERNAL PATHS, each gated: (1) portable or local import of a history carrying native
  records: FC09/FC10 are unbuilt and an imported generation refuses SOURCE_FRONTIER_UNPROVEN ...
  The gate is on the admission path, not on device ids already inside this installation's
  authenticated local log."
  -> The yes here IS this installation's own guarded-host record. The old-app file carries no
  native record. So by the spec it is admissible; the gate is not a reason to refuse it.
- SPEC:175 "The shared family is 'native-load', under existing class plan/proposal-response,
  owned by its producer/profile or a matching retained native proposal ID; it recognizes
  malformed native accepts and refuses NATIVE_LOAD_RECORD_INVALID rather than dropping them.
  Unrelated/unclassifiable plan records retain their existing refusal, not a catch-all no-effect
  admission."
- SPEC:176 "FC09 dispatches this family before its unknown-plan catch at :526 and invokes FC03
  after facts/correspondence are available, at each source cut. FC10 adds the same dispatch
  before ACCEPTED_ENGINE_CONTEXT_UNMAPPED and folds before state/coverage hashes/registration."
- SPEC:177 "Repeated import, both delivery orders and rollback/reopen must reproduce the same
  source fold or the same named conflict."
- SPEC:228 "FC09 rebuild/m3/w6/local/source-admission.mjs | ... | NEW LOGIC: shared family before
  :526, historical cuts and folded output before :781; I4/I7; import either refuses every yes or
  drops it." (the counterexample this FC exists to prevent, which is exactly W11's behaviour)
- SPEC:269 N14 IMPORT-JOINT: "Real synthetic import preparation with legacy provisional history
  plus native facts/response, both orderings and repeat import -> same programme or same explicit
  overlap refusal; native-only positive accepted response survives import." SPEC:306 gives its
  data row.
- SPEC:214: "Missing cut: SOURCE_FRONTIER_UNPROVEN applies to imported or foreign source
  frontiers (the admission gate); a local record whose cut is not reproducible goes to S1-S8 and
  DERIVABLE instead (R9.1)."
- DECISIONS.md:794 (PM ruling, 2026-09-23): "admission gate: only this installation's
  guarded-host records admitted, import refuses SOURCE_FRONTIER_UNPROVEN, attestation before
  import ships".
- Build report rebuild/lanes/e/NATIVE-LOAD-BUILD-REPORT.md:9 "Import (D-B-1): imported
  generations refuse NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN; FC09/FC10 not built." :541 lists
  "D-R9-ADMISSION (the actual import path, FC09/FC10 unbuilt)" as a named debt.
- S11 brief rebuild/lanes/b/S11-NATIVE-LOAD-BRIEF.md:240: "imported native sources stay refused
  by the admission gate (FC03, NATIVE_LOAD_SOURCE_FRONTIER_UNPROVEN, D:815; D-L12-ISSUANCE) and
  that limit is in the handoff." This limit covers IMPORTED native records only. It does not
  cover a local yes followed by a local import, which is the case EN3 caught. S11 brief :251
  makes "semantics outside grants (a)(c)(e)(f), D:819's FC09 rule and spec R9.13" a STOP, so a
  real FC09 is outside S11's grant.

No document found says that a local yes followed by an import is an accepted limit. The S11
handoff limit covers imported native records only. The register entry (replay-registry.cjs:
99-114) asserts the precondition that made the gap safe: "no shipped screen route reaches a plan
writer". NATIVE-LOAD removed that precondition.

## 6. Smallest correct fix: (B) product

(A) is ruled out. Admission does not handle these records: it refuses them (section 2), and the
spec calls that refusal the FC09 failure (SPEC:228). Editing only the register, the cell and the
runbook would leave a shipped screen that blocks the person's own import, which is the defect
class this cell exists to catch.

(B) The minimal product change, smallest first:

1. NEW reader module, e.g. rebuild/m4/import/native-load-replay.cjs, F9, shaped like
   measure-replay.cjs and sleep-replay.cjs: `createNativeLoadReplayFamily({...})` returns
   `{ owns(op), replay(rows, {readOperation, asOf}) -> {families, issues} }`.
   - owns(op): `op.class === 'plan' && op.kind === 'proposal-response'`, and the payload names the
     native-load producer (NativeLoadEffects producer/profile), or its proposal_id equals
     NativeLoadEffects.proposalDigest(producer, body, reason) (SPEC:175).
   - valid: schema_version 1; payload keys exactly {proposal_id, answer:'accept', issuance};
     issuance has exactly the six fields; the digest matches; effective day valid and <= asOf.
     Authenticity and ownership are already proven by validateGeneration (:160-168).
   - malformed (owned, invalid): refuse BY NAME and never drop it. EN2 requires the register rule
     to name `refuses LOCAL_SOURCE_[A-Z_]+`, so use a new code such as
     LOCAL_SOURCE_NATIVE_LOAD_UNRESOLVED, carrying NATIVE_LOAD_RECORD_INVALID as the issue's
     detail. SPEC:175 names NATIVE_LOAD_RECORD_INVALID itself, so the name needs a ruling (sec. 7).
   - EN4 constraint: the module must not contain `class:` in an object-literal property position
     (only `op.class === 'plan'`), or P3-EN4 reddens it as a writer.
2. source-admission.mjs replay(): dispatch `nativeLoadFamily.owns(op)` at the head of the per-op
   loop, beside bodyComposition/sleepFamily (:512-513), so it runs BEFORE the :534 catch-all. Run
   the family once after the loop and push its families/issues. Every other plan op keeps
   LOCAL_SOURCE_EFFECT_UNMAPPED at :534, and :170 stays as it is.
   What the family does with a valid yes is the product decision in section 7:
   - minimal: RETAINED (state 'retained', op_id). Admission projects nothing. After adoption the
     page's registered projection (today-bindings.mjs:520-551, FC03 foldNativeLoad over the
     admitted basis) folds it, and FC03's NO TRAP rules already turn a changed base into a named
     hold with Undo instead of a refusal (SPEC:156-158).
   - full spec: also invoke FC03 at the source cut and fold before the Q digests (SPEC:176), so
     the interpretation digest binds the effect.
   If the family throws inside the F3 try (:603-), add its code to KNOWN_REPLAY_CODES (:96-103).
3. replay-registry.cjs:99-114: the `rebuild/client/index.cjs#plan` entry becomes
   `disposition:'family', family:'F9'`, kinds ['proposal-response'] (the only kind a page writes).
   The rule opens with its evidence role ("programme evidence: ..." if FC03 folds it, or
   "no evidence role: ..." if retained) and names the malformed refusal code. Rewrite the comment
   block :99-107.
4. Test-side companions in the same change:
   - EN2 (writer-enumeration.test.mjs:239): `Registry.FAMILIES` gains 'F9', and admission must
     mention 'F9'.
   - EN3 (:243-266) is rewritten to keep its proof character. The ONLY plan-writer calls on the
     page are `respond`, reached through the guarded native path (t2-stage.cjs nativeRespond, and
     today-entry.mjs -> host respond). planEdit/decision/undoRequest/acceptInitialPlan still have
     no caller. EN3 should still fail on any new caller.
   - EN1 and EN5 should be unchanged.
5. FC10 (rebuild/m4/import/replay-core.cjs:168-182, the portable accepted-receipt path): needed by
   SPEC:176/229, but it cannot be reached in the local era (no receipts). The PM may split it off.
6. P3-RUNBOOK.md pre-check 8 names the native-load "Yes" with its cell. Fix the stale Sleep/plan
   paragraph at :143-152. Optional: an Import-screen sentence for the new code
   (import-screen.mjs:149 REFUSAL_SENTENCE). That is new copy and needs the owner's approval.

Red-first tests for the builder (each red at W11, green after):

- T1 YES-THEN-IMPORT (the defect): a real installation via openTodayInstallation over a fault
  database, as native-load-panel.test.mjs does (its `yesTo` helper). Steps: set up, train to an
  offer, Yes through createNativeLoadHost().respond. Assert the generation holds exactly one
  plan/proposal-response op, and that plan, planTransactions, planTxns, planHistory, suspensions
  and issuances are empty. This settles the INFERRED claim of section 1. Then importBundle a
  synthetic port bundle, reviewSource, and prepareSource({identityConfirmed:true,
  prefixAnswer:true}). Expect a qualification and a families row {family:'F9', op_id: yes.op_id}.
  At W11: ready:false, issues [{code:'LOCAL_SOURCE_EFFECT_UNMAPPED', op_id}].
- T2 BOTH ORDERS + REOPEN (SPEC:177): yes-before-import and import-then-yes, then
  capability.reconcile()/reopen. Both give the same families, issues and Q digests. Repeating the
  import gives byte-identical Q (cf. R913-ALV-IDEMPOTENT, local-source-admission.test.mjs:216).
- T3 MALFORMED NATIVE ACCEPT REFUSES BY NAME (SPEC:175): append owned-looking proposal-response
  ops with valid commitments (fixture `f.append`, as S3-Q-UNMAPPED does). Cases: a tampered
  reason (digest mismatch), answer 'decline' with an issuance, a missing issuance, an extra
  payload key. Each refuses with the new LOCAL_SOURCE_* code and its op_id, and none is silently
  dropped.
- T4 UNRELATED PLAN STILL UNMAPPED: S3-Q-UNMAPPED (:118-121) and S3-Q-PLAN-COLLECTION (:27-32)
  stay green unchanged. Add a coach-producer proposal-response variant that must still refuse
  LOCAL_SOURCE_EFFECT_UNMAPPED.
- T5 AFTER ADMISSION: on the admitted basis, the native-load host project() is ok, and the yes is
  applied, held (a labelled notice with Undo offered) or retired, exactly as ruled. The spend is
  not counted twice on repeat import (SPEC N14/N22).
- T6 WRITER-ORDER: add the native-load yes to rebuild/lanes/d/p3-replay-all/writer-order.test.mjs
  as a writer used before the import, in both orders, so the runbook's "any order" claim is
  measured again.
- T7 REGISTER CELLS: EN1/EN4/EN5 green; EN2 with F9; EN3 rewritten as in step 4 and shown red
  against a mutant that adds a page call to planEdit.

## 7. What needs a decision before anyone builds

Owner (Joe), in plain words:
- D1. "If you agree to a new weight on this phone and THEN import your old history, should that
  agreed weight carry over?" The spec says yes (SPEC:11 I4, :228, N14). But the yes was computed
  against the first-run numbers, and the import replaces them with the file's. The choices are:
  (a) carry it over and let the existing rules hold it, with Undo offered, when the base moved
  (spec default, SPEC:156-158); (b) carry it over as a record only, with no effect; (c) the import
  cancels it. Option (c) is listed in the spec as a failure (SPEC:228 "drops it"), so choosing it
  needs a ruling.
- D2. Until the family ships: is it acceptable to tell him "import your history before tapping
  Yes on a new weight"? That puts an ordering line back into runbook pre-check 8, which today
  says no ordering instruction is left.
- D3. Any new refusal sentence on the Import screen is new copy (COPY-LOCK) and needs approval.

PM:
- P1. Scope and grant. S11's brief makes FC09 semantics beyond A-LEGACY-VECTOR a STOP
  (S11-NATIVE-LOAD-BRIEF.md:251). The full fix is a new ticket (FC09, and FC10 if not split off)
  with its own grant. S11's handling of EN3 needs a ruling: block S11 on it, or carry it as a
  named, red, declared limit with the runbook line from D2. A cell must not be edited green
  without a family behind it.
- P2. The refusal code's name. SPEC:175 says NATIVE_LOAD_RECORD_INVALID. EN2's rule regex
  requires LOCAL_SOURCE_*. Pick one: a LOCAL_SOURCE_* code with a NATIVE_LOAD_RECORD_INVALID
  detail, or a ruled change to EN2.
- P3. Retained versus folded at admission (section 6, step 2). Retained is smaller. Folded
  matches SPEC:176 and binds the effect into the Q digests.

An interim (C) alternative is possible only by ruling. Keep `not-in-generation`, rewrite the
rule from "no shipped screen route reaches a plan writer" to "a guarded native-load accept is
refused LOCAL_SOURCE_EFFECT_UNMAPPED until FC09", re-point EN3 to pin that, and restore the
runbook ordering line. That makes the register honest, but it ships the defect class the cell
exists to stop, and the cell's own message asks for a family. Not recommended except as a
declared, time-boxed S11 limit.

## 8. Commands for the PM (not run here)

- Confirm the red and its exact callers:
  `node --test --test-reporter=tap rebuild/lanes/d/p3-replay-all/writer-enumeration.test.mjs`
  Expected: P3-EN3 `not ok`, with callers [rebuild/m3/w6/t2-stage.cjs,
  rebuild/m3/w7-preview/today/today-entry.mjs]. EN1, EN2, EN4 and EN5 `ok`.
- Settle section 1's INFERRED collection claim (PM seat; protected file): read
  rebuild/client/index.cjs `respond` (SPEC:36 cites :93-100 and :349-371) and confirm it stages
  no write to plan, planTransactions, planTxns, planHistory, suspensions or issuances. Or write
  T1 first; its first half measures it.
- Baseline for the admission cells (PM seat or hosted CI only; the fixture loads the protected
  migrate.cjs, STOP-R21B-1):
  `node --test --test-reporter=tap rebuild/m3/w6/test/local-source-admission.test.mjs`

## Verdict

A shipped Today control (native-load "Yes") writes plan/proposal-response into the local log.
Local admission refuses that op with LOCAL_SOURCE_EFFECT_UNMAPPED at source-admission.mjs:534, so
a person who taps Yes and then uses "Import my history" cannot import. The spec requires an FC09
native-load family, which is unbuilt (D-R9-ADMISSION). The fix is product work (new family F9
plus the register, EN2/EN3 and runbook companions), gated on owner decision D1 and PM rulings
P1-P3.

CLASS: B
