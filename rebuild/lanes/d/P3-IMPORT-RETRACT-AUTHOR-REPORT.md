# P3-IMPORT-RETRACT — author report (lane D, size S, Opus high)

DECISIONS:475 (2), branch `rebuild/d-p3-retract` over the tip `f7fe44d`. Every cell ran on the PC over the real fake-indexeddb store with a bundle sealed by the real `port.cjs` from a SYNTHETIC file built through the accepted clean-init constructor; no ledger, private fixture or owner data is read, named or reachable from here, and `--out` is the OS temp folder only.

## 1. API

    retractImport(target, entryId | sourceSha256, reason)
      -> { retracted, code, state, name, durableRevision, reason, retractedAt }
    listImportRetractions(target) -> [{name, sourceSha256, reason, retractedAt, importedAt}]
    importRetractions / importRetractionSummaries / importRetracted(generation[, name])
    LOCAL_IMPORT_RETRACT_PROFILE = "earned/local-import-retract/v1"

In `import-bundle.mjs`, through the same `dispatch` as the other three, exported by `browser-entry.mjs`, on the client as `retractImport` / `retractions`. ONE durable commit behind the same fence as `importBundle` (client open, boot() ready, lease alive) — same sealed generation, same device key, same compare-and-swap: that is "authenticated like the others". It writes NO `collections.ops` operation, because a new kind there would fail `source-admission.mjs` validateGeneration (LOCAL_SOURCE_ORIGINAL_INVALID); the retract op is an import-lane record of its own kind in the metadata.

Codes: LOCAL_IMPORT_RETRACTED; ALREADY_RETRACTED (state null, a named no-op); RETRACT_REFUSED_ADMITTED; ENTRY_RETRACTED (importOriginal); UNKNOWN; RETRACT_AMBIGUOUS; RETRACT_REASON_INVALID; RETRACT_BASIS_UNPROVEN.

## 2. Append-only, and why listImports HIDES the entry

`import-custody.mjs` is NOT edited and gains no remove (the brief's "paired remove" is deliberately not built): the original bytes, candidate, local file and provenance stay under the same name and device key. The retract writes one record into `metadata.importRetractions[]` carrying the superseded entry VERBATIM, and the entry leaves `metadata.imports[]` in the same commit.

The consumer contract forces that shape. Two consumers read that array raw and cannot be taught a status field without moving sealed bytes: `source-admission.mjs:64` (an entry there is a file offered for review) and `plan-edit-model.cjs:31` `importPresentIn` (non-empty means "an import is present", so a tombstone would keep the companion refusing a clean-init basis for a file that was never adopted). A retracted entry must read as NEVER STAGED. Nothing is lost: register + custody is a complete account, `importOriginal` refuses BY NAME instead of pretending the bytes are gone, and a re-import reuses the identical custody record and stages fresh.

An ADMITTED import is refused outright on the widest reading (the entry's `localSourceSelectionId`, any `localSources` selection naming it, the `localSourceApplication` marker, or the committed `derived.localSource` basis). `reason` is a LABEL by alphabet — `/^[A-Za-z][A-Za-z_-]{0,63}$/`, no digits, dots, colons or spaces — so no weight, date or note can ride out of his history on a durable string. One case touches the cache: on a ZERO-OP generation `importBundle` seeds `derived.value`, and retracting THAT restores the sidecar from the checkpoint the CUSTODY RECORD took at stage time (the only authenticated copy of the pre-stage cache in the store), and only when it provably describes that moment — otherwise RETRACT_BASIS_UNPROVEN, never a guessed cache.

## 3. Bar, cell by cell — `rebuild/lanes/d/import-retract/retract.test.mjs`, 10/10

P3D-1 stage -> refused at review -> retract; P3D-2 stage -> cancel -> retract; P3D-3 admitted refuses; P3D-4 twice, idempotent and named; P3D-5 reload keeps it; P3D-6 re-import stages fresh (not ALREADY_PRESENT); P3D-7 nothing deleted; P3D-8 importOriginal refuses while the bytes stay; P3D-9 selector, reason (eight carriers red) and fences; P3D-10 the seeded cache.

P3D-1/2 compare ONE record taken before the stage and after the retract: `listImports`, `boot().importRebaseRequired`, `derivedCode`, `derivedStale`, the cache, `admittedLocalSourceBasis` (the P2 join Today adopts through), `PlanEdit.importPresentIn` and the op ids — and the revision moves by exactly 2, one commit per operation. P3D-7 measures append-only three ways: the raw generations-store keys are identical, the custody source bytes are equal, and retractions grow by exactly one in exactly one commit with the superseded entry inside the record.

## 4. Tails

lane 10/10; P3 import 15/15; local-source-consumer 6/6; W6 586/586; today-17 666/666 (MEASURED_TEST_NOW=2026-09-03, TZ America/New_York); port 65/65; rig187 PASS; `b-package --ci --package S5` PRODUCT IMPLEMENTED 0 unlisted drift, 10/10 children exit 0, PUBLIC CI EVIDENCE PASS.

## 5. Drift and stops

Drift vs `f7fe44d`: `rebuild/m3/w6/local/import-bundle.mjs`, `local-client.mjs`, `browser-entry.mjs` (edits), plus the new `rebuild/lanes/d/import-retract/retract.test.mjs` and this report. None is declared by `packages/S5.json` (from that folder only `today-bindings.mjs` is), so S5 --ci stays green — the custody hole :473 ruled on. S6 should declare the three runtime files as product and add this suite to rebuild.yml. No engine byte and no `today/**` byte is touched; no law, guard or test was weakened.

Open: the owner-ruled path out of an ADMITTED history is still unwritten (its own ticket); P3-IMPORT-UI-2 should render `listImportRetractions` rather than invent its own copy.
