# Reconciliation reads scoped to the authenticated account — accepted contract

Status: **ACCEPTED WITH SEVEN AMENDMENTS; NOT IMPLEMENTED; NO RESOURCE ACCEPTANCE.** Source: C Message74 independent review, 2026-09-06. Binding publication: `rebuild/m3/BRIEF-W5-R1.md` v1.2 §3; product remains `777caa543a7bd34264580a65b4ff7d7266b81920`. No wire, cap or resource-metric revision is adopted here.
Purpose: remove unrelated accounts from reconciliation's read/parse cost while preserving complete own-account proofs and the existing authorization/commit boundary.

## Evidence and bounded scope

`bridge.cjs:119–121` currently loads all authority rows and subject bindings; `129–139` parses even foreign JSON before selecting the actor's standing rows.
One unchanged-product A/B pair completed 192 pages plus two typed oversize refusals. Own-only peaked at 165,864,407 bytes; adding exactly 9MiB foreign JSON raised that observed peak to 652,866,449 bytes. Both FAIL the unchanged 96MiB metric.
The own proof remained 1MiB with the same request/scope semantics; each arm pinned its fresh exact bytes. A single pair does not prove universal causality or a peak distribution.
Only `executeR1` with `action === 'reconcile'` may select a different read batch. Enrolment, renewal, recovery replay, invoke/invokeScoped and closeAccount retain full snapshots; historical resolution, waiting drains and synchronous core behavior remain unchanged.
Independent Linux reproduction reported by C Message74: own total-based/used-based peaks 225,479,258 / 136,203,486 bytes; foreign-populated 1,189,983,091 / 1,078,416,355 bytes; CPU 210 / 650ms; rows read 2,132 / 4,460. Both arms FAIL both 96MiB metrics. Selecting one host or a used-based metric would not rescue acceptance.

## Accepted read and guard contract

1. Validate the existing trusted principal/context inputs. Bind the verified principal's subject as a SQL parameter; never take an athlete identifier from the request or a prior independent lookup.
2. In one consistent three-statement `db.batch`, read the global revision, the matching subject binding, and every authority row selected through that same subject. Bind the captured verified subject twice; preserve the three named result positions. R1-D1 retains GLOBAL revision semantics.
3. Statements, all in that batch; execute planner witnesses on the actual tracked migration: old `SCAN authority_rows` versus proposed `SEARCH authority_rows USING INDEX sqlite_autoindex_authority_rows_1 (athlete=?)` plus the subject primary-key subquery:

```sql
SELECT revision FROM authority_revision WHERE id = 1;
SELECT subject, athlete FROM authority_subjects WHERE subject = ?;
SELECT athlete, collection, row_id, value FROM authority_rows
WHERE athlete = (SELECT athlete FROM authority_subjects WHERE subject = ?);
```

4. HTTP authentication runs first. Missing binding must select zero authority rows, then return `SCOPE_FORBIDDEN`403 with no authority-row read or fallback; malformed revision returns `UNAVAILABLE`503; malformed own rows return `RETAINED_INTEGRITY`500. Execute combined-condition precedence tests. Retain exact own JSON TEXT and the whole inventory.
5. Keep `I.registry`, `I.device`, current standing/lease verification, trusted issuer/origin scope binding, complete retained validation, payload digest and continuation checks (`bridge.cjs:143–147`). No additional time/freshness guarantee is introduced.
6. Keep the exact two-statement failing-constraint global revision assertion plus increment (`148–155`). Other writer guards at `76–84` and `291–299` assert and increment too; current subject changes are INSERT-only. No positive result precedes commit. Revisioned subject remap, revocation or closure between read and guard must reload and recheck or refuse; foreign writers still contend globally.
7. Foreign malformed/duplicate-key rows no longer deny own reconciliation ONLY. Existing full-snapshot writer refusal, including T03 enrolment, remains. `project.cjs:63` sorts kept rows by collection/row_id: execute exact old/new equality of complete payload, retained JSON bytes, unsigned bodies and digest despite changed SQL row order. Own malformed/incomplete rows still refuse.
8. Do not add partial snapshots, a projection cache, early positive responses, per-athlete revision semantics or a new stored-row quota as part of this change.

## Required implementation checks — scoped implementation NOT RUN

| Case | Required witness |
|---|---|
| Planner, same bytes and complete own state | On the actual migration prove SCAN→named-index SEARCH plus subject-PK lookup; no binding returns zero rows. At fixed inputs/order variants compare complete payload, retained JSON, unsigned bodies, digest and outcomes; preserve every collection, old lease, initial plan and claim. |
| Foreign growth and invalid rows | Repeat own-only/+9MiB population cases; show SQL returns only own rows, growth does not change own bytes, and a foreign duplicate-key JSON row cannot deny own read. The same defect in own rows still refuses. |
| Scope, precedence and TOCTOU | Auth first; missing subject403/no authority rows, malformed revision503, own malformed500, including combined conditions. Wrong caller athlete/device and principal mismatch refuse. Revisioned remap, revocation or closure between read/guard forces reload/recheck or refusal. |
| Concurrent writers | Repeat the actual 100-invocation ownership/waiting-drain race, signed continuation mismatch and effective revision-assertion bite. Preserve other routes' complete-snapshot behavior. |
| Resource and regression | Original full 32+32+32/+1 workload, population A/B and oversized-own-account refusal on final pinned source, unchanged v1 ceilings/sampling; then full focused, original regression and complete effective bites. Functional or diagnostic success does not grant resource acceptance. |

## OPEN: own-account materialization bound

Scoping does not bound an oversized own account before all its rows enter the isolate. The current payload limit is enforced after projection (`project.cjs:73–77`); own-only already exceeded 96MiB. Scoped SQL alone is insufficient for acceptance.
The exact codec establishes a candidate lower bound: for each retained raw value with `n` UTF-8 bytes, unpadded base64url contributes `ceil(4*n/3)` ASCII bytes; the complete payload includes every such value at least once (`codec.cjs:24,27`; `project.cjs:9,64,76`). Therefore a valid complete proof has at least `sum(ceil(4*n/3))` bytes, even before keys, row IDs and duplicated accepted/history entries.
OPEN-BYTE-PREFLIGHT: a proposed SQL aggregate over `length(CAST(value AS BLOB))` could conditionally return no full rows when this lower bound exceeds the existing cap; this is derived from the codec, not a new quota. It is NOT yet a proved D1 implementation contract.
Before adopting it, prove D1 TEXT-to-JavaScript UTF-8 equivalence, Unicode/escape/whitespace and malformed-input behavior, exact overflow-safe accumulation, and actual conditional non-materialization. Preserve authorization/error precedence and revisioned refusal; boundary cases must never reject a valid fitting proof. Retain full post-projection checking when the lower bound fits because the bound is not sufficient for fit.
Until those witnesses and review exist, this remains OPEN; no early byte-refusal implementation or memory-bound claim is authorized by this note.

## OPEN: separately versioned metric question

The [CDP field definitions](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#method-getHeapUsage) distinguish used JS heap, allocated JS heap, used embedder heap and backing storage for array buffers/external strings. They do not establish equivalence with a hosted isolate's total memory limit.
OPEN-RESOURCE-V2: C may review a separate `resource-local/v2` definition using simultaneous `usedSize + embedderHeapUsedSize + backingStorageSize <= 96MiB`, while always recording the original simultaneous total-based metric and preserving all v1 FAILs. This is a question, not an adopted metric or waiver of the existing mandatory gate.
Any such proposal requires held-buffer and retained-heap negative controls, timely sampling evidence, unchanged default flags/no forced collection, and explicit omitted-native-allocation limits. The A/B used-based peaks were 91,858,687 / 563,481,621 bytes; one pair is not a universal bound. Keep the original runner and v1 results independently visible.

## Review decision and next boundary

C Message74 accepts only the scoped-read contract with the seven amendments incorporated in brief v1.2. OPEN-BYTE-PREFLIGHT and OPEN-RESOURCE-V2 remain unadopted. No scoped SQL is implemented or new experiment run here; original v1 resource, final focused/regression and effective bites remain required. R1-COMPLETE remains FAIL; W6, private import and phone acceptance receive no release permission.
