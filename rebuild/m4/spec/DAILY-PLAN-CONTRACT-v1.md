# DAILY-PLAN-CONTRACT v1 — proposed producer/consumer boundary

APM disposition, 2026-09-09 UTC: released for bounded technical incorporation into the existing PR46. APM read the candidate and checked the actual scalar-member validator, live-versus-accepted plan projection, T2 stage view/history boundary, and runtime's separate owner/public policy passages. No independent execution or physiological qualification is claimed. U1–U5 remain open. The reference catalogue and field names are proposed design choices: reuse actual records and the smallest adequate composition; do not build a general framework just to satisfy the illustrative DTO. Preserve the four-field meanings and provenance/currentness obligations. Root reconciles changed W6 code at adoption, and retains existing review ownership. This closes APM handoff waiting, not product implementation.

Contract-only candidate for incorporation into the **same PR46 / M4 owner-workout brief**, before its daily-plan presenter. This document supplies a read representation and provenance/currentness obligations. It is not an accepted operation schema, nutrition formula, renderer, complete-macro availability claim or permission to bypass an existing gate.

## 1. Authority and scope

Exact inspected sources:

| Alias | Checkout / immutable pin | Relevant authority |
|---|---|---|
| M4 | `work/owner-workout-brief` / `cf8b73a030a26f8010d2f0b91a4313b6af65c0fc` | `rebuild/m4/BRIEF-OWNER-WORKOUT.md` v0.40, P1–P6 and Stage A; runtime sheet v1.7.38 / appendix v1.37 |
| W6 | `work/m3-w6-browser-bridge` / `72202d04a8af0d01c8f80ed5db7f0027f473642d` | Actual client plan/face/sync and durable public-client routes |
| R1 | `work/m3-w5-r1` / `60e073bb4c77d87c7179971d8f77e20655f5805b` | Actual authority transaction reduction, structural admission and authenticated scope |

Checkouts are under `C:/Users/joeym/Documents/Codex/2026-09-04/read-rebuild-t3-brief-md-and/`. APM `CURRENT-PRODUCT-DECISIONS.md` revision1 P1/P5 governs priority and meaning; the older blanket nutrition-later placement is superseded. NEXT then ROADMAP were read at M4. Completed RECOVERY-NUTRITION-01, especially candidate Stage A items2–3, is reused; no science search was repeated.

**Already adopted:** calories, protein, carbohydrate and fat all belong in the bounded daily-plan work; target/minimum/range/absence meanings must be truthful; no invented allowance; agreement and physiological qualification differ. Runtime A5 (R252–271) requires complete coupled groups in a predeclared disjoint conflict-domain partition. Runtime B1/B4/B5 governs local edits, conflict selection and suspension fallback. R186–190 requires source, basis and complete-group provenance. Appendix D13/D14 distinguishes operative action constraints from estimates and their uncertainty.

**Proposed here:** every field name/type below, the read-only producer entry point and the reference catalogue joining currently separate records. These do not change a signed operation, a frozen enum or a physiological rule. **Unresolved:** exact leased wire encoding/domain mapping and qualified producer joins named in §7. The read contract can be adopted while those implementation prerequisites remain explicitly open.

## 2. Boundary: one qualified projection, one consumer

Proposed entry point: `readDailyPlan()` inside the existing trusted W6/client composition, returning an immutable view from **one captured generation**. It accepts no caller-supplied athlete, transaction, policy, target or qualification flag. The eventual presenter receives this result through the same current/reopen/refusal boundary as other W6 views. This function does not exist at the inspected pins.

The producer binds the authenticated athlete/account context, verified accepted operations through contiguous W, permitted local pending operations, effective complete plan groups, explicit phase and semantic contracts. It applies the already-governing reducer and currentness rules. The consumer chooses layout and accessible wording only. It never picks a transaction, reevaluates a nutrition formula, fills a missing macro or calls the generic `receiveSnapshot` setter with a supposedly authoritative plan.

Concrete host placement: the proposed qualified client projection is attached as `view.dailyPlan` alongside the existing face fields in the **same** `createT2Stage` result. The proposed public read uses the existing guarded read/reopen/current path and returns that sidecar only while its parent face/context remains usable. `face_ref` binds that parent face; a presenter must not combine a dailyPlan from one read with labels or safety state from another. The existing bridge owns lifecycle and refusal handling. No separate polling loop, cache, transport or storage collection is introduced.

A reference (`Ref` below) is a nonempty identifier into that generation's **producer-owned read catalogue**, not a self-authenticating string. The catalogue is not a new ledger or public endpoint. Its underlying records retain their existing identifiers, commitments and original values; the producer establishes the bindings. Serializing this DTO does not transfer authority. A caller-crafted JSON object with identical fields is not a qualified producer result.

References are provenance links, not instructions for the renderer to load arbitrary records. Current labels/reasons come from the paired face and the producer's established presentation mapping; any expanded source detail must be supplied through the same scope/basis-bound read composition. A renderer cannot make a missing catalogue binding valid by looking up a newer policy or by assigning its own meaning to an opaque ID. The concrete catalogue access/binding is part of U2/U5, not claimed existing infrastructure.

## 3. Proposed exact read shape

All named object keys are required unless the union omits them. Objects are closed for v1; new spellings need a versioned contract. Four nutrition keys are always present. Null appears only where expressly allowed; it is never numeric zero. This is a read DTO, **not a payload to send as `plan-mutation.members[].value`**.

```ts
type Ref = string;
type Unit = "kcal/day" | "g/day";

type AgreedValue =
  | { kind: "target"; value: number; unit: Unit }
  | { kind: "minimum"; value: number; unit: Unit }
  | { kind: "range"; lower: number; upper: number; unit: Unit;
      lower_inclusive: boolean; upper_inclusive: boolean }
  | { kind: "not_prescribed" }
  | { kind: "unavailable"; reason_ref: Ref };

type Field = {
  agreed: AgreedValue;
  source_ref: Ref | null;
  meaning_ref: Ref | null;
  standing: "governing" | "historical" | "unavailable";
  advice: "qualified" | "not_qualified" | "suppressed";
  qualification_ref: Ref | null;
  reason_refs: Ref[];
  constraint_refs: Ref[];
  evidence_refs: Ref[];
};

type Phase =
  | { kind: "declared"; code: string; vocabulary_ref: Ref;
      source_ref: Ref; standing: "governing" | "historical" }
  | { kind: "unavailable"; reason_ref: Ref };

type DailyPlanRead =
  | { kind: "refused"; refusal_ref: Ref }
  | {
      kind: "daily_plan_view";
      contract: "earned.daily-plan.view";
      version: 1;
      scope_ref: Ref;
      basis_ref: Ref;
      face_ref: Ref;
      phase: Phase;
      fields: {
        calories: Field;
        protein: Field;
        carbohydrate: Field;
        fat: Field;
      };
    };
```

The catalogue records have the following mandatory meanings. Their exact wire/storage locations are prerequisites, not inferred from a convenient DTO property:

| Reference | Required bound content |
|---|---|
| `scope_ref` | Existing trusted namespace, athlete ID, device ID and session/observation context binding. Server account scope comes from authenticated principal→registered athlete/device resolution, not request text. Namespace alone is not account authentication. Do not place credentials in the view. |
| `basis_ref` | Captured repository revision; contiguous reduced-through W and its authenticated-history references; known authority frontier or explicit unknown; evaluation local date/zone and applicable semantic-contract versions. Preserve any existing full proposal/plan basis verbatim. This view introduces no replacement digest, TTL or requirement for a new network exchange on every read. |
| `face_ref` / `refusal_ref` | Actual current W6 face/refusal from the same generation/context, including existing state, labels, withdrawal and write permission. Do not manufacture new numbered states or suppress a real account/integrity refusal behind an empty nutrition card. |
| `source_ref` | Original source value(s)/member identities and units; selected complete group; domain ID and stable lineage; source operation ID; transaction identity and whether it is merely requested or actually committed/effective/received; complete BEFORE/AFTER/group commitments where required; complete-group provenance; per-member `athlete_edited`/`inherited`; effective date; accepted/local/fallback origin. For fallback, name suspended effect and the selected prior complete projection, retaining excluded inherited descendants as historical references. For conflicts, bind the reducer's chosen maximum, current alternatives and conflict basis. |
| `meaning_ref` | Accepted field/semantic-contract ID and version bound to the original agreement or an explicitly qualified legacy mapping; interpretation as target/minimum/range/not-prescribed; source-member mapping; nutrient quantity definition (including which carbohydrate measure is meant), units and display label; applicable plan/policy binding; authorized presentation/quantization/rounding/coherence rules or an explicit unresolved result. This supplies meaning; a field spelling such as `protein_g` does not. A mutable current policy registry cannot reinterpret the original agreed meaning. |
| `qualification_ref` | Producing implementation/policy identity and version; applicable population/phase decision; relevant input/source identities and dates; gate results and evaluated basis; evidence-scope/uncertainty limitations; operative constraint provenance. This is separate from authentication, schema validity, consent and code-test acceptance. A hand-filled `qualified: true` is insufficient. |
| `constraint_refs` | Separate applicable policy action constraints with original kind, operative value/interval, units, policy/version, grain and uncertainty rule. A calorie floor does not replace an agreed calorie target. A protein policy minimum does not automatically turn a larger agreed point target into a minimum. |
| `evidence_refs` | Separate estimate/display-point/evidence-range records with sources and uncertainty meaning. They cannot populate `agreed` or become an allowed intake band. |
| `reason_ref(s)` | Existing reason/code and resolution from the bound producer/face/semantic result. When the result is this contract's missing connection, identify the precise §7 dependency. Do not introduce a new clinical conclusion or silently map every failure to “not prescribed.” |

If a required reference cannot be established, its affected interpreted field is unavailable or record-only as permitted by the existing face. Original stored facts remain intact. Cross-account or unproved-history failures obey the host refusal; they never return another person's plan. Generation or session changes retire the view through existing W6 behavior.

Numeric and `not_prescribed` variants require non-null `source_ref` and `meaning_ref`. `advice: qualified` requires `standing: governing`, a non-null verified `qualification_ref`, and a passing applicable current basis; no unavailable field qualifies. `not_qualified` or `suppressed` carries the actual reason(s). An unavailable field may retain references to its unresolved original source; with no source at all its source/meaning references are null. Transport as-of time, a plan's effective date and today's evaluation date remain distinct.

### Quantity and presentation invariants

- `calories` uses `kcal/day`; the other three use `g/day`. These are daily plan amounts, not today's consumed totals or per-meal amounts. Source-unit conversion belongs to a qualified producer mapping; the presenter does none.
- Numbers must be finite and match the producer's resolved agreed value. No numeric strings, rounding, clamping, averaging or parse-and-default behavior in the presenter. Historical source representation is retained by `source_ref`; this DTO does not rewrite its bytes. Physiological bounds and accepted precision come from the named policy, not new schema constants here.
- `target` is a point action target, with no implied tolerance. “Eat about” is available only where the bound meaning/presentation contract authorizes that wording. It creates no numerical allowance.
- `minimum` carries the **operative** lower bound established by the producing contract. Display its minimum meaning. Do not substitute a display point or raw unquantized coefficient result. Policy handling of an exclusive raw floor and representable operative value remains upstream.
- `range` is an agreed action interval. Its endpoints and inclusivity must be established; the UI cannot assume them, choose its midpoint or borrow an evidence interval. Lower must not exceed upper; an equal pair with an excluded endpoint is empty and cannot stand as a valid interval. Missing bound semantics are unavailable. These are representation requirements, not nutritional bounds.
- `not_prescribed` requires positive evidence that the governing plan prescribes no value for this field. It does not mean zero and does not mean the nutrient is unnecessary. `unavailable` means no recoverable qualified interpretation/connection; absence in a legacy record never establishes not-prescribed.
- An agreed MAXIMUM or other action kind outside this v1 union is not relabeled as a target/minimum/range. Preserve its source and report the unsupported meaning; a later representational extension must be explicit. Separate constraint references may retain their policy's own existing kinds.
- A finite explicit zero remains a recorded zero, distinct from either absence state; its admissibility as advice remains the policy's decision. Missing kcal or macros are never derived from one another. No calorie–macro residual calculation, default ratio, coherence tolerance or new rounding rule is introduced.
- `standing` and `advice` are independent. A governing athlete-authored plan can be shown as **their recorded plan** while physiological qualification is unavailable; it must not be labelled a qualified machine prescription. Conversely, scientific support for a candidate does not make it the agreed plan. An unavailable or historical field cannot have `advice: qualified` for a current instruction; suppressed advice retains its allowed historical evidence.
- A complete coupled plan group changes atomically. The four fields cannot be assembled from independently preferred alternatives. An explicit not-prescribed macro can be part of a semantically complete plan; an unavailable macro is an incomplete interpretation. Do not call a calorie/protein-only connection full macro delivery.

## 4. Currentness and selection mapping

The producer follows existing rules, with no new refresh deadline:

| Condition | Required daily-plan result |
|---|---|
| Governing accepted complete group, semantic mapping and current qualification present | Values remain tied to that transaction/group. `standing: governing`; current advice can be qualified. Display its actual action kind and phase. |
| Local durable direct edit | The complete athlete-authored live group governs that domain under B1; label its real local/not-yet-synced state. Do not keep the superseded last-sync value as the current plan or call the edit Applied. Preserve per-member flags; do not require blanket reconfirmation of every inherited field outside the existing applicable authorship/conflict rule. Machine advice may only withdraw based on touched dependencies. |
| Pending proposal response, or ACCEPTED operation without effective received plan transaction | No new plan effect from that response. Preserve the governing prior group, current answer label and any existing suppression. Saved, Synced and Applied remain distinct. |
| Local intake/weight/other fact changes an estimate | Do not alter agreed amounts. If the fact touches a declared machine-output dependency, withdraw its current instruction/action locus immediately; retain allowed as-of evidence. Unrelated facts do not suppress unaffected outputs. |
| Ordinary plan conflict (state4) | Use the authority/qualified reducer's deterministic effective maximum and show actual alternatives. Conflict does not universally mean “no plan.” The consumer does not choose latest timestamp, preferred device or a nicer macro combination. A stale conflict-selection cannot switch the group. |
| Proposal-response conflict/suspended effect (state5) | Use the applicable domain's prior effective **complete** projection, excluding values introduced solely by the suspended effect and inherited descendants. With no complete predecessor, no accepted plan. A later partial edit does not resolve that conflict by itself. |
| Obsolete machine contract; sync lag/offline; D7/Re-entry; current safety guard | Preserve the actual face distinction between retained agreed/athlete-authored values and current derived advice. Apply only the relevant existing dependency and ladder rules. An as-of label cannot revive withdrawn advice. D7 is not a new universal expiry date for every agreed macro field. |
| Missing/future/stale/conflicting policy input or unresolved phase required by that policy | Preserve permitted agreed/history records; return the policy's abstention/suppression for affected new advice. Do not infer phase from weight/performance regime or replace an old agreement with a new estimate. |
| Scope, integrity, standing or generation refusal | Return/retain the existing host refusal and its paint limits. Never bypass `current()`/`reopen()` with a raw cached `acceptedPlan`. |

Phase carries its declaration's vocabulary/version and source. Public policy uses declared deficit/maintenance/surplus; legacy engine labels need an explicit accepted crosswalk before interpretation. An observed regime is not a declaration. No profile or policy is inferred merely because the display name is Joe or Dad.

## 5. Exact existing entry points and missing seams

| Producer/read route | What is actually present at its pin | Required connection for this contract |
|---|---|---|
| R1 `rebuild/m3/w5/worker.cjs:48,71–88`; W6 `m3/w6/public-client.mjs:15,50–69` | Authenticated principal scoping; request-supplied athlete/subject rejected; public verification binds athlete/device and receipt history. | Bind `scope_ref` to this trusted composition. DTO fields cannot establish scope. |
| R1 `authority/index.cjs:64`; `authority/plan.cjs:18,55,85` — `plan`, `planTransactions`, `planState`, `planOfDomain` | Accepted transaction reduction uses causal maxima, lineage keys, suspension and complete groups. `plan()` flattens values; `planState()` supplies selection/basis/alternatives; transaction rows retain more provenance. | Publish a qualified group+member projection to W6 that preserves these identities and semantic payloads together. A flat plan alone cannot populate the reference catalogue. Do not independently rerun selection in the renderer. |
| W6 `client/index.cjs:99–111,142–146,229–230` | Internal accepted plan combines snapshot/applied/local records; `livePlan()` overlays suspension fallback and local edits. `plan()` returns the live view. `acceptedPlanTransactions()` returns partial flattened records. | Extend the producing read seam to retain units, per-member origin, complete-group and semantic references. `acceptedPlan` is not synonymous with the current live/fallback group. The existing APIs alone do not establish the proposed rich catalogue. |
| W6 `client/sync.cjs:91–112,129` | Plan effect folding distinguishes committed/effective/received and reduced-through W; acknowledgement copy distinguishes Applied. | Carry the actual transaction state; never infer it from an ACCEPTED receipt alone. A generic caller-set transaction/snapshot is not a qualified delivery path. |
| W6 `client/face.cjs:46–75,84–99` | Two-layer withdrawal/currentness behavior; `face.acceptedPlan` exposes flattened values plus group-level version/provenance; live plan is elsewhere. | Bind field standing/advice and labels to the same face. Recover field-level provenance upstream, not from a flat value/version pair. |
| W6 `m3/w6/t2-stage.cjs:18–68`; `public-client.mjs:342–359` | Stage returns `client.face()`. W5 `@snapshot` is delivered as history receipts, explicitly **not** T2's derived product snapshot. Public `current()`/`reopen()` handle context/refusals. | Add the read-only daily projection at this existing stage/view seam after its producer is qualified; preserve generation and refusal behavior. No new HTTP service or second local store. |
| W6 `client/index.cjs:221`; `client/plan.cjs:15`; R1 `authority/validate.cjs:48–51` | Generic `planEdit` creates one scalar member; unit defaults cover calories/protein, not explicit fat/carbohydrate semantics. Authority plan members require finite scalar values. Stage command whitelist contains no planEdit. | Publish complete intake-domain encoding, range/absence representation, version normalization and real command path before enabling editing. A UI cannot send the DTO union as the current scalar member value or separately save coupled macro fields. |
| M4 `conform/reference/policy.cjs:38–68`; `engine/energy.cjs:117,493,684`; `engine/today.cjs:529` | Reference public constraints and legacy calculation/preview paths exist. Public reference is not product; existing Today eat output carries calories/protein, not full macros. | Bind an actual accepted policy output and agreed plan; do not use reference formulas, preview values or a fresh engine estimate as accepted nutrition fields. Fat/carbohydrate producer/semantic mapping remains absent. |

R1's generic `appendConsented` also has a synthetic default member when no members are supplied (`authority/plan.cjs:177–188`). That default is not an intake-plan producer and cannot fill a missing macro. Existing flattened/group-provenance shortcuts require an explicit mapping to the runtime's complete-group/per-member contract; do not relabel an inherited value as newly authored or consented.

## 6. Policy binding — what is already resolved, what is not

The prior assessment identified differing legacy/public numbers. The ratified sheet gives a more precise boundary: **separate policies are intentional**, not a renderer choice awaiting a new universal coefficient.

- M4 runtime sheet:774–778 retains customer #1's personal protein 2.5 g/kg FFM and calorie-floor 25 convention (30 soft) as personal rules, never the public defaults. R2269–2273 names `earned.protein.owner v1` separately and requires figure provenance. This contract does not select that policy for an account or assume its port/attestation is present.
- Public appendix D13 (`earned.protein.public v1`) uses phase/source-qualified MINIMUM branches, including the distinct lean-mass/body-mass formulas. D14 (`earned.floor.public v1`) uses the 30/high-lean-source policy and exercise-energy/input/quantization contract. Their ratified policy distinctions are retained. These appendix D13/D14 identifiers are not the similarly numbered extraction-audit defects.
- The producer must supply the explicit governing policy ID/version, its agreed applicability and current source/gate results. Missing policy binding cannot default to the public policy, owner policy or whichever calculation returns a number. Known original agreed amounts do not silently recalculate when those inputs change.
- Fat/carbohydrate target/range/minimum/not-prescribed meaning must come from the actual agreed semantic contract. This document selects no ratio, fat minimum, carbohydrate dose, energy conversion convention, rounding or tolerance. The calorie–macro coherence rule must be identified by the producer. No general “4/4/9 equals calories” validator or allowance is added here.

## 7. Precisely unresolved dependencies and adoption route

| Dependency | Closure required in existing M4/Stage A work |
|---|---|
| **U1 — complete intake-domain wire/semantic manifest** | Name exact field spellings, stable domain/lineage and complete coupled member set; encode target/range/explicit-not-prescribed without abusing scalar values; distinguish explicit clearing from omitted legacy fields and an undo that restores prior absence. Preserve leased old versions under deterministic normalization. Include phase/policy selectors wherever the agreed invariants couple them. Do not invent a runtime-composed domain. |
| **U2 — qualified effective-group projection into W6** | Specify how verified accepted history and allowed local edits yield complete selected/fallback groups plus field units/provenance/semantic references. Existing flat face/transaction APIs and history-only snapshot delivery do not close this join. Reuse root's authority/recovery work; no duplicate implementation here. |
| **U3 — actual nutrition meanings and policy outputs** | Bind existing owner/public policy IDs explicitly where applicable. Supply the accepted fat/carbohydrate meanings, including the carbohydrate quantity definition (e.g. total versus another declared measure), mass versus percentage source mapping, and authoritative rounding/coherence rules. No implicit conversion among those measures is allowed. If a new numeric policy is proposed, it remains a separately named policy decision. A schema contract alone cannot qualify it. |
| **U4 — declared phase and source/currentness mapping** | Bind the declared phase vocabulary and basis, source eligibility/currentness and exact dependencies to the producing route. Publish any needed legacy-label crosswalk; never infer phase or absence. |
| **U5 — real read integration and focused acceptance** | Add the trusted read entry point to the existing W6 stage/current view, with the same-generation catalogue and real refusals. Show original agreed versus changed estimate, local edit versus pending response, deterministic conflict/fallback, and unknown versus explicit absence. Run required affected checks when actual retained code exists. |

Root can incorporate §§2–4 as the proposed missing read contract in PR46, with §§5–7 as its exact implementation prerequisites. Root then selects the actual producer/schema delta before the presenter consumes it. No new queue, reviewer request or retained edit was created here. The deliverable resolves representation and selection responsibilities; **it does not close U1–U5 or claim usable daily macro targets**.

## 8. Compact examples and evidence

These are **proposed, unexecuted field fragments**, not complete authenticated views, personal recommendations or simultaneous members of one diet. The surrounding field needs the bound references in §3 before use:

```json
{"kind":"minimum","value":150,"unit":"g/day"}
{"kind":"range","lower":200,"upper":250,"unit":"g/day","lower_inclusive":true,"upper_inclusive":true}
{"kind":"not_prescribed"}
{"kind":"unavailable","reason_ref":"U1:legacy-fat-meaning-unmapped"}
```

The minimum fragment cannot be rendered as a maximum or an exact target; the range cannot become a 225 g prescription. The explicit no-prescription fragment requires its source assertion. A missing legacy fat field gets the unavailable interpretation until its meaning is established, not zero/not-prescribed. These numbers assert no qualification or calorie–macro coherence.

Required refusal/transition examples, also unexecuted: a pending APPLY response cannot produce new accepted calories; a state4 conflict uses the actual selected complete group rather than refusing all nutrition; a state5 suspension selects its qualified complete fallback; a new local food fact can suppress affected machine advice while the original agreed amounts remain recorded; loss of account context produces the host refusal, not cached plan display.

**One executed source-isolated compatibility check:** loaded only R1 `authority/validate.cjs` at the exact pin into a Node VM, then called its existing `validShape` with one synthetic scalar plan-member control and range/not-prescribed object variants. Result: `PINNED_PLAN_MEMBER_SHAPE PASS`: scalar `true`; range object `false`; not-prescribed object `false`. Source SHA256 `8107bfd6fd3135ee5eef8b64bc1cfb70623005c184b5fb30eecead2ddd397f2b`. This proves the concrete structural encoding seam at the current predicate. It does not prove authenticated admission, a complete domain, persistence, macro semantics or nutrition qualification. No validator was invented, no source file changed and no fixture/seed/full-engine entry point was loaded.

All other work was pinned source/contract reading and this document. No science, conformance/backend/memory/CI rerun, private data, retained edits, agents, PR or direct root message.

Timing: started 2026-09-09 03:50:28 UTC; completed 2026-09-09 04:05:44 UTC. Approximately 15 minutes, within the allotted 20–30 minute ceiling; stopped when this contract and its named unclosed dependencies were concrete, rather than spending the balance on repeated assessment. Token/cost totals were not exposed. The helper is idle after handoff.
