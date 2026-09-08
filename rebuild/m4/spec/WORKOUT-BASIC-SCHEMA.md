# Workout basic shape — candidate shared boundary v1

ASTRA, September8, base ebba693859d23e3420f6799a8c5d794f56b95b4d. Technical acceptance requested before implementation. This closes the pure basic-workout shape interface, not full Stage A, capability activation, semantic admission, a training policy or the resume-capture protocol. No existing signed operation changes.

## 1. Scope and selected version

Implement one shared, side-effect-free `rebuild/m4/workout/schema.cjs` for phone and authority composition. Export `validateWorkoutShape(op)` returning `{valid:boolean, errors:string[], references:string[]}`. Valid returns empty errors and the references below; invalid returns empty references and one tag: INVALID_JSON_SHAPE, UNSUPPORTED_PROFILE, INVALID_COMMON, INVALID_FIELDS or INVALID_PAYLOAD. These are LOCAL DIAGNOSTIC tags, not HTTP/disposition/state codes. References are the complete declared target/start IDs needed by the existing semantic ownership/dependency validator; extracting them does not prove those checks. Return fresh arrays on every call; never echo input values in errors.

The function accepts ONLY proposed schema_version2, class `session`, and the six kinds below. Anything else returns invalid/UNSUPPORTED_PROFILE. It must never validate version1 by reinterpretation or silently delegate an unknown kind. A future selected-version dispatcher routes unchanged version1 bytes to their original validator; this function does not implement that dispatcher. Number2 remains reserved preparation, not a registered/issued capability. The complete version2 manifest, all other supported actions and transition tests must close before any issuer enables it; adding this module alone cannot extend an issued immutable schema.

The module is not yet imported by production client/authority/W6 or a shipped bundle. It is intended implementation code with a closed unit contract, not another behavioral oracle. Integration must compose it with actual common authentication/identity, issuance, relationships, permission and durability checks. Existing 34/35 family GREEN cannot substitute for that integration.

## 2. Exact shape

All objects below are JSON data maps with own fields only, no unknown keys; arrays are dense JSON arrays. Reject accessors, symbols, non-enumerable extra fields, custom prototypes and non-JSON values without invoking getters. Normal JSON objects and null-prototype maps are permitted. No normalization, mutation, default insertion, key sorting or canonical encoding occurs here. Transport size/depth limits remain separate and must precede unbounded input work in the actual boundary.

Common required envelope keys: `op_id, athlete_id, device_id, device_seq, device_predecessor_op_id, causal_parents, class, kind, effective, schema_version, lease_id, payload, canonical_content_commitment`. Each identity/commitment is a nonblank string; shape does not verify a signature/commitment or invent an ID format. `device_seq` is a positive safe integer; predecessor is null or nonblank string; parents are a duplicate-free array of nonblank strings. `effective` has exactly nonblank `local_date, local_time, utc_offset`; offset matches the existing signed-HH:MM shape. Calendar semantics/attestation are not established here; the actual boundary must prove its required checks before activation, rather than this module inventing a date parser.

| Kind | Additional required envelope keys | Exact payload |
|---|---|---|
| session-start | planned_split_slot_id, plan_basis | `{}` |
| session-set | session_start_op_id, logical_set_slot, lift_lineage_id | `{load,reps,reserve?}` |
| session-skip | session_start_op_id, lift_lineage_id, skip_scope; logical_set_slot REQUIRED for set scope, FORBIDDEN for lift scope | `{}` or `{reason}` |
| session-close | session_start_op_id | `{completion_kind:"normal"|"early"}` |
| correction | target_op_id, lift_lineage_id | `{replacement_fields}` with a nonempty subset of load,reps,reserve |
| tombstone | target_op_id, lift_lineage_id | `{reason}` |

All additional IDs are nonblank strings. Start's `planned_split_slot_id` may be the explicitly selected `AD_HOC`; `plan_basis` may be explicit `NO_ACCEPTED_PLAN`. Shape never supplies either value. Those reserved spellings must be excluded from real planned-slot/basis IDs by their future registry contract; shape alone cannot authenticate a plan basis. A missing legacy basis stays missing, never this sentinel. No capture field is smuggled into the ratified empty start payload.

Load is exactly `{value,unit:"lb"}`, finite value >0. This retains the brief's numeric-pound basic profile; it does not resolve nonnumeric/bodyweight lift mapping or claim the owner's entire workout is supported. Unsupported load kinds must not be approximated or silently excluded from the eventual full workout.

Reps are exactly `{value,unit:"rep"}`, value a nonnegative safe integer. This is the proposed count representation: explicit0 is a recorded zero completed repetitions, distinct from absent/unlogged/skipped; it is never fabricated for unfinished work. Reject negative/fractional/unsafe counts without truncation. No physiological maximum, efficacy score, completion/progression eligibility or training action follows from this representation. Already signed legacy values, including unsupported values, remain exact history. Reviewer must call out any conflicting ratified count requirement; this narrows the earlier finite-only proposal and is not claimed as an existing ruling.

Optional reserve: `{tag:"exact",value:0|1|2,unit:"rep"}`, `{tag:"at_least",value:3,unit:"rep"}`, or `{tag:"unknown"|"skipped"|"not_asked"}` with no numeric fields. Absence stays absent, null invalid, 3+ never becomes exact3. `skipped` refers to the effort question, not a skipped set. Shape cannot prove a question was/not asked or determine first/last eligibility; the actual prompt context remains mandatory at command creation. Reasons are nonblank strings. `skip_scope` is exactly set/lift.

Corrections/tombstones in this profile target SET facts only; the semantic validator must establish the authenticated same-athlete target, session class/kind, lift lineage and causal/dependency coverage before acceptance. It must validate the complete projected result after correction. A shape-only PASS cannot establish that an unknown target is a set. Clearing reserve, effective-time edits, correction-of-correction, skip/close/start removal and concurrent winner policies are not encoded by this basic sub-profile; the complete version manifest must implement the applicable wider brief contracts before activation. Never repurpose a rejected unsupported action as an accepted no-op.

For set/skip/close, references contains session_start_op_id. For correction/tombstone, it contains target_op_id. Start has no operation reference in this sub-profile; plan_basis belongs to its separate authenticated registry. Do not require all references to be direct causal parents: legitimate transitive coverage is checked by the existing semantic graph. No same-device target restriction.

## 3. Implementation and tests

Only new schema module and `workout/test/schema.test.cjs`, plus this contract and existing brief/report may change. Existing authority/client/engine/W6 source, original suite, private data, seeded soak and dependencies remain unchanged. No new PR/branch; retained PR46.

Tests build invented complete envelopes through the ACTUAL `client/ops.cjs` and compare the actual authority shape result with the candidate result; use per-run ephemeral HMAC material without printing/storing it. Pin the inspected source revision. Common-byte/authentication claims require real primitives: compare original operation bytes/commitment before/after validation and the actual client/authority canonical encoders. This comparison demonstrates shape differences, not complete admission or end-to-end saving.

Cover each kind/variant, all reserve tags and absence; missing/blank/misplaced fields; load/reps boundaries; optional absent/null/zero distinctions; all seven nonempty correction subsets; field/class/version confusion; exact references without a fake same-device or direct-parent restriction; malformed JSON-like objects/accessors; caller input preservation and independent output arrays. Exercise legacy version1 refusal by the new function while the actual original validator still sees identical bytes/results.

At least one effective disposable-copy mutation must make the test suite FAIL for wrongly accepting malformed required workout data; restore byte-for-byte and rerun. Report intended candidate differences separately from ratified current defects. Do not label all proposed-profile exclusions frozen-engine bugs.

Gate: focused module tests, original conformance CONSISTENT/rig185, SELFTEST, strict with test clock unset, scope/package and both-OS CI at the candidate publication; affected independent review. No original law edits. No private or phone evidence is claimed by this module.

## 4. Actual next join and acceptance limits

After this pure interface is independently accepted and implemented, compose it into selected-version client creation and authority validation with explicit source amendments, register the COMPLETE immutable schema, and prove issuance/renewal, old pending operations, exact retry and W6 atomic activation on the actual D1/HTTP/IndexedDB path. Do not activate just these six actions as if that were a complete workout schema.

In parallel within the same retained workout work, close prescription capture's P1 storage/recovery mapping. The empty start payload and existing private custody rules constrain that design. This document makes no local-only snapshot substitute for cross-device/reinstall truth. Current safety modifiers remain separate from historical instructions, as accepted in PR46v0.21. Actual full workout, scientific applicability, recovery, import, independent integration and Joe/Dad phones remain release requirements.
