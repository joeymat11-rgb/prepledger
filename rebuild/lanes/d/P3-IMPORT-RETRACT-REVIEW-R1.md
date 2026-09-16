# P3-IMPORT-RETRACT — independent review R1 (Opus high)

VERDICT: ACCEPT — with 1 MAJOR and 2 MINOR to carry.

Subject `eb1c0ba8d2eb697fa31e4185a2700f58f44f97f6` over the tip `f7fe44d`, in a detached worktree
of its own. No product file was edited except under the mutation drill, which reverts and
re-verifies byte identity. Everything executed is SYNTHETIC: the bundle is sealed by the real
`port.cjs` from a file invented through the accepted clean-init constructor (w7-preview's
`import/test/support.mjs`). No ledger, private fixture or owner byte was read, named or
reachable; nothing written outside the OS temp folder.

## 1. What I executed

My own 11 cells (`%TEMP%\p3r-rv\rv-r1.test.mjs`) over the real fake-indexeddb store and real
webcrypto, no stub and no hand-built generation: **11/11**. They re-derive the whole bar
independently of the author's file — refused-at-review through the real controller, cancel,
admitted, twice, reload, re-import, importOriginal, append-only by raw store keys and custody
bytes, the reason alphabet, the fences, the seeded cache — plus probes RV-9/10/11 (findings 1-3).
The consumer record: `listImports`, `boot()`'s `importRebaseRequired`/`derivedCode`/`derivedStale`
and cache, `importRebasePending`/`importRebaseCode`, `admittedLocalSourceBasis` (the P2 join Today
adopts through), the op ids, `PlanEdit.importPresentIn` — `deepEqual` to pre-stage; revision +2.

## 2. Mutation drill — every bar item has a proven red side

Seven mutants of `import-bundle.mjs`, each applied, run, reverted, the file byte-identical
afterwards (`FINAL byte-identical=true`, `FINAL rerun red=false`):

    M1 the entry is not removed from metadata.imports  RED  RV-1 RV-2 RV-4 RV-5 RV-8
    M2 an ADMITTED import may be retracted             RED  RV-3
    M3 the seeded cache is not restored                RED  RV-8
    M4 a second retract is not named idempotent        RED  RV-4
    M5 importOriginal hands back a retracted entry     RED  RV-5
    M6 the reason accepts any string                   RED  RV-6
    M7 the retract record is appended twice            RED  RV-2 RV-4

M1 matters most: leave the entry as a tombstone and five cells go red at once — boot flag,
`importPresentIn` and `listImports` all keep reporting a file never adopted, so the author's
HIDING argument is executed, not asserted (raw readers: `source-admission.mjs:64`,
`plan-edit-model.cjs:31`). Nor could the retract be a `collections.ops` op: line 48 there demands
`Ops.KINDS.includes` and an outbox twin, while no validateGeneration whitelists metadata keys.

## 3. Findings

**1. MAJOR — retracting the older of two SEEDED imports wipes the cache the LIVE one seeded.**
`priorSidecar` restores from this entry's custody checkpoint and claims it "provably describes the
moment before this entry"; it checks zero ops then and now and no entry of THIS name in the
checkpoint, but never that nothing was staged AFTER. RV-9 (clean-init zero-op device, two bundles,
retract the first): `LOCAL_IMPORT_RETRACTED | entries: ["port:3168b55788f44ffa"] | cache === B
seeded: false | cache === clean-init: true`. A live entry remains and `importPresentIn` stays
true, so the companion demands an imported basis while Today paints clean-init — a state belonging
to no entry in the register: the guessed-cache class the header refuses at length. The header does
call two zero-op imports LAST-WINS and "not a workflow — there is one port", which is why this is
MAJOR, not blocking. Guard plus cell in R2: refuse `LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN` when any
OTHER live entry is itself `seeded(entry)`.

**2. MINOR — after a retract, a DIFFERENT file under the same name refuses a name `listImports`
no longer shows.** Custody is immutable and retract deletes nothing, so the record keeps the name.
RV-10: `false LOCAL_IMPORT_NAME_TAKEN | listImports: [] | retractions name: shared`. Honest, and
`listImportRetractions` carries the name so a host CAN explain it — but the header calls this case
ordinary (the `--local` re-port: same sha, same derived name) and the register is now empty where
the host used to find the entry. Name it there and to UI-2.

**3. MINOR — retract is a one-way door once anything is logged on a SEEDED import.** RV-11 (a
seeded import, one first-run operation, then retract): `LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN |
retracted: false | entries: ["port:b664f6e6308faa5c"] | bootFlag: false | companion: true`. That
refusal is defensible — his logged work now sits on the imported base, and there is no boot-flag
residue there — but `importPresentIn` stays true forever for a file he never adopted. Not a code
defect: a boundary the report should state, not leave to discovery.

**4-7. NOTES.** The ADMITTED refusal is real, not a fixture: RV-3 drives the real controller to an
admission, retract refuses on `entry.localSourceSelectionId` (`source-admission.mjs:194`) and
`durable()` is deepEqual after; M2 is its red side. The reason holds as a label: ten carriers
(weights, dates, a note, a colon, a dot, a digit, a space, 65 chars, empty, non-string) refuse and
write nothing, M6 red. MAPPING is out of scope: no mapping file and no `qualify()` byte in the
drift, so I assert nothing. `device()`'s `cleanInit` option is dead (`eraFor` does not take it).

## 4. Drift, seal and hygiene

`git diff --name-only f7fe44d HEAD`, each `findstr`'d against `packages/S5.json`: `w6/local/`
`import-bundle.mjs` (edit, 0 hits), `local-client.mjs` (edit, 0), `browser-entry.mjs` (edit, 0),
`lanes/d/import-retract/retract.test.mjs` (new, 0), the report (new, 0) — all UNDECLARED; control
`today-bindings.mjs` 1 hit, the only declared file there. So `--ci` stays green at 0 unlisted
drift: the DECISIONS:473 custody hole again, not a licence; S6 must declare the three runtime
files as product and add this suite to rebuild.yml. No `rebuild/engine/**` and no `today/**` byte
touched; no existing test file touched at all, so no assertion removed anywhere;
`import-custody.mjs` untouched as asked. Tree clean before and after the drill. LF only, 0 CRLF in
all five files, no non-ASCII beyond the house em dash; author report 39 lines.

## 5. Tails (verbatim, my own runs)

    lane cells (retract.test.mjs)        tests 10   pass 10   fail 0
    reviewer cells (rv-r1.test.mjs)      tests 11   pass 11   fail 0
    P3 import (15, TZ=America/New_York)  tests 15   pass 15   fail 0
    local-source-consumer                tests 6    pass 6    fail 0
    W6                                   tests 586  pass 586  fail 0
    today-17 (MEASURED_TEST_NOW=2026-09-03)  tests 666  pass 666  fail 0
    port                                 tests 65   pass 65   fail 0
    rig187                               rig187 ⇒ PASS
    b-package --ci --package S5          EXITCODE=0; PRODUCT IMPLEMENTED … 0 unlisted drift;
                                         10 of 10 children exit 0; PUBLIC CI EVIDENCE PASS
