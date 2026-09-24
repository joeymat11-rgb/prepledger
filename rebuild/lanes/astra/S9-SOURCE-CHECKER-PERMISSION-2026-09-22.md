# S9 protected-source check: review and pending permission
Status: Joe granted the five-file read-only check in this PM task on2026-09-22; DECISIONS:766.
This is a concrete reviewed source-custody check, not engine execution or final package acceptance.
Helper: %TEMP%/earned-s9-source-custody-checker-sol-20260921/s9-source-custody-check.cjs.
SHA256:1528b20a4f00c9e88834c3eed34c3540a3ce13e2bb087cf275cb2115e134d609.
Proposal SHA256:310b9f3d8a513a8c60371d8d2abdc53ba35802a8d2bab74a2043cb8d706c33d5.
Independent final static review: astra/reviews/S9-SOURCE-CHECKER-REVIEW-L3.md.
Review SHA256:2f78f457be74c584d66f197455d9c9607a2adc9ae8ec2f14bb516eb88a5a578f.
All three rounds retained; PM read whole code/proposal/reports and checked final hashes.
13,040-byte size accepted for clarity; no guard, test, pin or output rule was weakened.

## Current fixed inputs and preflight
Candidate5c62cb423848b72c260552dd1f425b2a31ca04c0.
SourceBase0cd07be7cf967dfbfea8c84947ba8477f58cfb5f.
PM ran the reviewed helper WITHOUT --allow-protected-five after static acceptance.
Only commit identity and the public parent artifact were read; protected bytes were not requested.
Terminal exit0: STAGE1 HELD pins=227 protected=5; VERDICT HELD.
This proves the no-permission path stops, not that source custody or full closure passes.
No local runtime remains occupied. Author/reviewer preparation claims predate this public preflight.

## Exact granted allowance
Only rebuild/engine/seed.cjs, migrate.cjs, merge.cjs, index.cjs and oracle-shim.cjs.
Local read/hash/static traversal for S9 using reviewed fixed snapshots; contents stay in memory.
No source text/values in reports or shared logs; output is bounded verdicts, counts and safe paths.
Other forbidden paths STOP before bytes; no repository module import, write or network call.
Only after Joe's word may the same invocation add --allow-protected-five.
Stage1 can then compare all227 parent/sourceBase pins; current Stage2 remains HELD because S9.json is absent.
A changed candidate/spec/helper needs a fresh bounded review before use; permission is not a source waiver.
Actual engine/child/exporter execution, private census, import, deployment and sealing remain separate.
After permission766, PM ran the identical reviewed helper with --allow-protected-five; session14502 terminal exit0.
STAGE1 PASS pins=227 protected=5; STAGE2 HELD reason=S9_SPEC_ABSENT targets=0; VERDICT HELD.
The sourceBase check is complete. Final actual-child closure is not yet proved.
Parent artifact bytes at fixed candidate5c62cb4 and current integration80082fa are identical (Git diff exit0).
No engine/repository module executed and no protected contents entered output.
