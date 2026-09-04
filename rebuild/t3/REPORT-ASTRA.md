# T3 authority — builder ASTRA

2026-09-04. Base: `rebuild/t2-client-core` at `c22ddc2`.
Branch: `rebuild/t3-authority-astra`. Built locally on Windows with Node 24.19.0.

## 1. Product and module map

998 lines across 11 CommonJS modules; zero npm dependencies. `node:crypto` is the
only platform import, isolated in crypto.cjs. Row storage and clock are injected.

| Module | Lines | Responsibility |
| --- | ---: | --- |
| canonical.cjs | 53 | Independent canonical-v1 encoding |
| crypto.cjs | 45 | Commitments; disposition, lease and time signatures |
| store.cjs | 73 | Copied rows, atomic staged writes, rollback, memory backend |
| validate.cjs | 66 | Envelope, units, required payloads, reclassification |
| admit.cjs | 112 | Replay, slots, ownership, dependencies, leases, atomic admission |
| plan.cjs | 195 | Causal/numeric lineage, conflict CAS, undo, suspension |
| issue.cjs | 175 | Issuance, shared instances, coverage, apply and current status |
| reduce.cjs | 24 | Contiguous watermark, receipts and pinned export |
| committer.cjs | 65 | Capability validation and monotonic clock continuity |
| transport.cjs | 19 | T2-compatible local send/pull |
| index.cjs | 71 | Composition and public API |

Also: README 105 lines; package.json 6; adapter 48; durability/admission rig 117;
interop/issuance rig 161. The README specifies the store and future D1 bridge.

## 2. Executed gates

Final `run.cjs`: September 3 clock, America/New_York, both pinned engine artifacts;
exit 0. Relevant output, followed by the complete SUMMARY block:

```text
OK   6 adapters laws/sheet-A-authority.cjs: family authority present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 34 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   6 adapters laws/soak.cjs: family authority present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 1 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   6 adapters laws/sheet-B-client.cjs: family client present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 35 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
```

```text
== SUMMARY
OK   0 clock and zone set and equal to the oracle manifest — run 2026-09-03/America/New_York manifest 2026-09-03/America/New_York
OK   0 engine artifacts present (main + fix4b) — a missing engine is BAD, never SKIP — {"main":"C:\\Users\\joeym\\Documents\\Codex\\2026-09-04\\read-rebuild-t3-brief-md-and\\work\\prepledger\\rebuild\\conform\\engines\\engine-main.cjs","fix4b":"C:\\Users\\joeym\\Documents\\Codex\\2026-09-04\\read-rebuild-t3-brief-md-and\\work\\prepledger\\rebuild\\conform\\engines\\engine-fix4b.cjs"}
OK   1 inventory laws/sheet-A-authority.cjs == frozen manifest (34 laws, family authority)
OK   1 inventory laws/sheet-B-client.cjs == frozen manifest (35 laws, family client)
OK   1 inventory laws/d13-d14.cjs == frozen manifest (20 laws, family policy)
OK   1 inventory laws/progression.cjs == frozen manifest (9 laws, family progression)
OK   1 inventory laws/soak.cjs == frozen manifest (1 laws, family authority)
OK   1 inventory global ids unique and total == frozen total — 99 vs frozen 99
OK   2 port oracle main-vs-main under the manifest — all GREEN and exactly the frozen PORT ids — 10 ids
OK   3 sensitivity: every leaf compared + semantic mutants DETECTED + fix4b-vs-main DETECTED, exactly the frozen PORT ids — 13 ids
OK   6 adapter loading: only an exact MODULE_NOT_FOUND counts as absent; any other load failure is HARNESS_ERROR — present: authority,client
OK   4 reference laws/sheet-A-authority.cjs: all GREEN — 34/34 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/sheet-A-authority.cjs: every law STRONG — 34 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/sheet-A-authority.cjs: family authority present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 34 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   4 reference laws/sheet-B-client.cjs: all GREEN — 35/35 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/sheet-B-client.cjs: every law STRONG — 35 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/sheet-B-client.cjs: family client present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 35 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   4 reference laws/d13-d14.cjs: all GREEN — 20/20 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/d13-d14.cjs: every law STRONG — 20 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/d13-d14.cjs: family policy absent → all RED(as specified), 0 DEFECT, 0 HARNESS_ERROR — 0 GREEN · 20 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   4 reference laws/progression.cjs: all GREEN — 9/9 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/progression.cjs: every law STRONG — 9 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/progression.cjs: family progression absent → all RED(as specified), 0 DEFECT, 0 HARNESS_ERROR — 0 GREEN · 9 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   4 reference laws/soak.cjs: all GREEN — 1/1 GREEN · 0 FAIL · 0 HARNESS_ERROR
OK   5 mutants laws/soak.cjs: every law STRONG — 1 STRONG · 0 WEAK · 0 NO_MUTANT · 0 REFERENCE_FAIL · 0 HARNESS_ERROR
OK   6 adapters laws/soak.cjs: family authority present → all GREEN, 0 DEFECT, 0 HARNESS_ERROR — 1 GREEN · 0 RED · 0 FAIL · 0 DEFECT · 0 HARNESS_ERROR
OK   7 privacy: every private-fixture law line in the log is verdict-only (detail withheld in code) — 14 private lines
OK   8 gate artifacts verified (files present, hashes match, results pass, clock matches) — 10 gates
OK   8 coverage: every TESTED section's ids exist, every law id is covered by a section, every gated section's gates verified — {"TESTED":26,"SEPARATELY_GATED":2,"DEFERRED":2}
INFO 9 engine-track rig185: W1 FAIL, W2 FAIL
SUITE CONSISTENT — 99 reference GREEN · 99 STRONG · 29 RED-first against absent families · 70 GREEN against present families
```

`node run.cjs --selftest`: 10/10 checks, exit 0:

```text
SELFTEST PASS
```

Frozen-app `node scripts/check.mjs --strict`, with its own default July 29 clock:
2,951 engine assertions, all smoke checks, 17 sync laws/56 seeds, unchanged bundle
and frozen engine outputs; `All checks passed. Safe to ship.`, exit 0. An earlier
run incorrectly inherited the rebuild's September clock and failed the old date
fixtures; resetting that override restored the existing app gate without edits.

Windows preparation: the frozen engine builder fails with
`ERR_UNSUPPORTED_ESM_URL_SCHEME` on a Windows absolute path. A helper outside the
repository built the same commits with esbuild 0.28.1 and separate detached
checkouts; no frozen app sources were edited. Private input came directly from
`git show a0009c3:ledger/state.json`. The golden command was run and the committed
manifest/public goldens restored byte-for-byte. The omitted private golden was
reconstructed using its published provenance stamp and accepted only after its
**entire SHA256 matched the existing frozen pin**. The rebuilt engine then passed
the independent census comparison against it. No pins, laws or runner changed.

## 3. Independence

Executed:

```text
rg -n conform rebuild/authority
  README.md:5 only (prose)
rg -n reference rebuild/conform/adapters/authority.cjs
  no matches
require('<absolute repo>/rebuild/authority') from outside the repository
  createAuthority, Store, memoryBackend
git diff --exit-code before staging new files
  exit 0; every existing tracked file unchanged
```

Only relative product modules and node:crypto are imported by product code. The
adapter imports the permitted fixture constants. Canonical parity: 100,000 seeded
nested/random-double samples, zero mismatches; operation commitments and T2
disposition signatures also matched. Discovery exposed branch/file metadata
before the brief was located; no other candidate implementation or report was
opened or used. Development used independent module agents and a separate review.

## 4. Deliberate bite check

Temporarily changed product `verifyDisposition` to return true. Full gate exit 1:
`A-every-disposition-is-authority-signed-and-a-tampered-one-fails-verification`
failed; authority 33 GREEN / 1 FAIL, overall 69 product GREEN / INCONSISTENT.
Restored crypto.cjs byte-for-byte, SHA256
`c6c2571277a0d71be3ad99138228f4d1f10064a04e13ac96f1e75c99c09d3d21`.
Final unmutated gate passed after restoration and subsequent reviewed fixes.

## 5. Law-shaped seams

- **A5 crash and state-4 selection crash:** adapter wraps backend.put and throws
  on the relevant transaction row. The product stages log, head, transaction,
  disposition and slot together; Store rolls everything back. No product crash
  hook. Separate tests also fail commit itself and suspension persistence.
- **A2 athlete ownership/soak fixtures:** ATH() assigns dev-C to ath-2 but its
  default signed lease names ath-1. The adapter rebinds correctly signed fixture
  leases to their configured athlete and signs them again. Product admission and
  local commitment both enforce the signed athlete/device binding. Direct product
  tests reject wrongly bound signed leases.
- **A5 undo initial value 150:** the adapter supplies existing plan
  `{protein_g:150,steps:8000}`. Product initialization uses only the caller's plan;
  an empty account receives no fabricated prescription.
- **A2 local restore/time laws:** `advance`, `rollback`, `restore`, `snapshot`
  operate on an injected clock state. The law hands `syncedServerTime` a bare
  string; the adapter signs a time record. Product rejects unsigned/forged time.
  Clock persistence and freshness are responsibilities of the eventual client.
- **A1/every-disposition:** the adapter supplies fixed fixture keys and a fixed
  clock. Product signs its own dispositions and independently rechecks operation
  and member-set commitments using injected keys. No test constants in product.
- **State 4/A5:** numeric lineage vectors, exact English conflict/undo copy, and
  effect/group/basis digest domains match the specified shapes. These reside in
  product reduction; the adapter performs no plan computation.
- **State 8:** fixtures supply trusted precomputed issuance members and reduced
  contract fields; missing domain/lineage defaults remain protein/lin-protein-1.
  `confirmBasis(...,boolean)` receives the caller's recomputation verdict. The
  engine, full consent-contract validation and HTTP trust boundary are not built.
- **State 16:** pending count/rejected appendix come from the exporting device;
  the authority cannot discover another device's unsent entries. Export states
  this and pins its actual received entries to contiguous W.
- **Canonical-v1:** product deliberately retains the required decimal defects.
  The adapter does not translate or replace encodings.

## 6. Unedited law/suite concerns

1. Canonical-v1 keeps exponent notation at large magnitudes, strips significant
   exponent zeros (`1.5e30` and `1.5e300` collide), and rounds tiny values to zero.
   This is compatibility, not a mathematically injective encoding; needs v2.
2. The second-athlete lease fixture is inconsistent, as described above.
3. The local restore law supplies unsigned time; a real capability validator must
   not trust that string directly. The adapter provides the authentication seam.
4. State-8 laws omit full issuance/consent fields and do not exercise invalid
   outcomes, future coverage watermarks, pre-issuance responses, causal successor
   decisions or lost replies after contradictory decisions. Executed additional
   tests cover these reduced-protocol cases. Historical apply rows stay immutable;
   replay has a current conflict/supersession overlay, satisfying sheet line 469's
   explicit prohibition on returning an old Applied after a concurrent decline.
5. The reference ignores unrelated proposal responses in coverage and treats all
   historical responses as current. Product includes every unrelated client op
   and reduces causal-maximal responses. Existing laws remain green.
6. The frozen runner's informational rig185 still prints W1 FAIL / W2 FAIL for the
   pinned old engine. These are not T3 adapter failures and do not fail the gate.

## 7. Not covered

No HTTP service, D1/SQLite backend, async D1 request bridge, account authentication,
key rotation/recovery, payload encryption/sealing, policy/progression engine, UI,
real network transport or calendar-duration soak. Memory snapshots demonstrate
restart by value, not durable disk storage. D1 needs atomic guarded publication
of the row batch after asynchronous reads; an unguarded batch is insufficient.

Full A6 consent validation, issued outcome contracts, decision-resolution
operations and the wider session schemas remain future work. This core supports
APPLY/KEEP/NO, trusted precomputed issuances and explicit initial plan snapshots.
Authority-generated issuances/effects occupy separate tables rather than extra
client receipt positions. The committer grants permission to save; its caller
must durably commit the operation/outbox/sequence/clock. Signed-time freshness
and persistent clock storage are not implemented.

## 8. Interoperability and additional execution

```sh
node rebuild/t3/interop-astra.cjs
node rebuild/t3/verify-astra.cjs
```

```text
INTEROP {"status":"PASS","twoDevices":[2,2],"secondAthlete":1,"acceptedWithForgedVerifier":"ACCEPTED","forgedOutboxRetained":1,"replayAddedRows":0,"reopenedFrontiers":[3,1],"issuanceEdges":"PASS"}
ASTRA durability/admission verification: 12/12 PASS
```

The rig asserts first weigh-in → sync → empty outbox → reduction → frontier 1,
then both devices at frontier 2, isolated second athlete at 1, and a wrong verifier
retaining its outbox despite server acceptance. Backend rows are serialized and
reopened. Issuance edges cover immediate atomic suspension/fallback, immutable
historical outcomes, current replay status, alias collisions, malformed outcomes,
causal successor Keep, changed basis, unrelated response coverage, future/invalid
watermarks, and preventing retroactive binding of pre-issuance answers.

Review defects were reproduced and fixed: unchecked member commitments/units,
transient key-store failures incorrectly becoming terminal rejections, a WAITING
retry stranded after a failed dependency drain, future issuance watermark bypass,
invalid outcomes suspending valid effects, and later issuances activating earlier
unknown responses. The committed rigs retain regression witnesses.

## 9. Time and delivery

Approximately 18 minutes to the final report, including discovery, implementation,
parallel review, build setup and all executed checks (about 20:11–20:29 UTC).
Exact model token usage is not exposed. Product, adapter, this report and the two
synthetic rigs are prepared for the requested branch and unmerged PR. No private
fixture, private golden or generated engine is included.
