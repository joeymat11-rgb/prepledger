# P3-IMPORT-RETRACT independent review, round 3 (Fable, final per DECISIONS:439)

VERDICT: ACCEPT

Subject: `eb1c0ba8d2eb697fa31e4185a2700f58f44f97f6` on `rebuild/d-p3-retract`, base `f7fe44d`, reviewed on a
detached worktree (`%TEMP%\earned-p3r-rv`) with my own cells under `%TEMP%\p3r-rv\rv.test.mjs` (10 cells) over
real fake-indexeddb stores and bundles sealed by the real port.cjs from the SYNTHETIC clean-init file
(support.mjs). No ledger, private fixture or owner data was opened or named. The stance asked for was adversarial
about anything that deletes, hides an admitted import, or lets a retracted file be treated as admitted; each of
those three was probed directly (RV-1/2/7 store keys and custody bytes, RV-3 admitted plus sibling, RV-8 held
review then retract). Nothing blocked.

## 1. Findings

BLOCKING: none.

MAJOR: none.

MINOR
1. Seeded import, then an operation, then retract: refuses `LOCAL_IMPORT_RETRACT_BASIS_UNPROVEN` and writes nothing
   (RV-10, proved: firstRun after a SEEDED carry gives ops=1, retract refuses, counts unchanged). Correct and honest,
   but it means a zero-op athlete who imports, logs one thing, and is THEN refused at review has no way back out of
   the seeded cache; the file's migrated state stays as derived.value under his ops. Out of this ticket's bar
   (stage -> refuse/cancel -> retract on an enrolled device) and refusing is the right shape, but the PM should
   know the case is unhandled rather than handled.
2. Author cells do not detect a register that drops its history: mutant M7 (`importRetractions = [record]`, i.e.
   the prior records lost on a second retract) leaves retract.test.mjs 10/10 GREEN; my RV-6 (retract, re-import,
   retract again, expect 2 records) turns it red. Append-only across TWO retracts is asserted only by my cell. A
   one-line addition to P3D-6 closes it; not required for acceptance since the code is correct.
3. The chain tip moved under the author: `origin/rebuild/t2-client-core` is now `0986dd8` (DECISIONS:476), so on the
   author's base `b-package --ci --package S5` prints `FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP` (exit 1) today. I
   cherry-picked eb1c0ba onto 0986dd8 on a scratch detached head (applies clean, same 5 files) and re-ran: `SEAL BASE
   ON THE TIP`, `PRODUCT IMPLEMENTED ... 0 unlisted drift`, 8 of 8 own children exit 0, `PUBLIC CI EVIDENCE PASS`.
   The branch needs the rebase or merge before it lands; nothing in the diff is affected.

NOTE
4. After retract `metadata.imports` is `[]` where the pre-stage generation had no key. Every consumer (importEntries,
   source-admission.mjs:64, plan-edit-model.cjs:31, local-source-basis) reads both as "no import"; my raw
   generation compare had to normalise that one key and nothing else. The retract register is the only other
   difference, by design.
5. Re-import of a DIFFERENT bundle for the same source (a re-port with --local) after a retract still refuses
   `LOCAL_IMPORT_NAME_TAKEN` at custody, because the custody record under the default name is immutable and kept.
   Pre-existing (review D2) and consistent with append-only; the caller passes a name. Worth a runbook line.
6. Three runtime files (`import-bundle.mjs`, `local-client.mjs`, `browser-entry.mjs`) are undeclared by S5 (S5 names
   only `w6/local/today-bindings.mjs`), so `--ci` stays green on them: the :473 custody hole, as the author says.
   S6 should declare them and add retract.test.mjs to rebuild.yml.
7. Dash census (U+2014 tip->head): import-bundle.mjs 41->52, local-client.mjs 16->17, browser-entry.mjs 3->3, all in
   comments in the file's existing style; 0 in string literals or code; test file 0; author report 8 (Markdown
   prose, not athlete-visible). U+2013 zero everywhere; CRLF zero in all five files.

## 2. What I proved (own cells, all GREEN at eb1c0ba; red side by mutant, each reverted, worktree clean)
- RV-1 stage -> refused at review (stranger bundle, `prepare`) -> retract; RV-2 stage -> cancel -> retract: one record
  of listImports, boot importRebaseRequired/derivedCode/derivedStale/derived, admittedLocalSourceBasis,
  PlanEdit.importPresentIn AND the raw generation minus importRetractions equals the pre-stage one; revision +1
  for the retract, entries 0, retractions 1, op count unchanged; generations-store KEYS identical before and
  after; custody source bytes byte-equal; the superseded entry rides verbatim inside the record.
- RV-3 admitted (real controller, publish + reconcile) refuses by name AND by sourceSha256 with state 3 and no
  write; a staged stranger sibling still retracts and the admitted basis is untouched, boot flag false.
- RV-4 twice: `LOCAL_IMPORT_ALREADY_RETRACTED`, state null, counts unchanged; unknown name -> `LOCAL_IMPORT_UNKNOWN`.
- RV-5 reload (new era over the same IDBFactory) keeps imports [], flag false, register intact.
- RV-6 re-import stages fresh (`LOCAL_IMPORT_REBASE_REQUIRED`, same name, store keys identical = custody reused),
  flag honestly back; second retract appends a second record.
- RV-7 importOriginal -> `LOCAL_IMPORT_ENTRY_RETRACTED`; bytes still readable through custody.
- RV-8 a held reviewSource, then retract, then prepareSource -> `LOCAL_SOURCE_STALE`; a fresh reviewSource ->
  `LOCAL_SOURCE_IMPORT_REQUIRED`; basis null, companion false, applied false. A retracted file cannot be admitted.
- RV-9 one source under two hand-chosen names: sha selector -> `LOCAL_IMPORT_RETRACT_AMBIGUOUS`, no write; by name
  works; once one is gone the sha selects the survivor.
- RV-10 zero-op seeded import: retract restores the checkpointed clean-init cache exactly; see MINOR 1 for the
  after-op refusal.
- Mutants (author suite / mine): M1 keep entry in imports[] 2/10 / 0/10; M2 skip admitted refusal P3D-3 / RV-3
  red; M3 skip cache restore P3D-10 / RV-10 red; M4 skip importOriginal refusal P3D-8 / RV-7 red; M5 state 3 on
  ALREADY_RETRACTED P3D-4 / RV-4 red; M6 entry not verbatim P3D-7+8 / RV-1+2 red; M7 register drops history
  10/10 GREEN / RV-6 red (MINOR 2).

## 3. Code read
Same `dispatch`, same `refuseUnlessWritable` fence, same repository.commit compare-and-swap as importBundle;
no `collections.ops` op (validateGeneration would refuse a new kind); `import-custody.mjs` untouched, no remove
anywhere; admissionTrace takes the widest reading (entry.localSourceSelectionId, any selection by name or id,
localSourceApplication.source_digest, derived.localSource.basis.source_digest), which covers what prepareSource
writes at source-admission.mjs:193-196 and what rollback re-applies; priorSidecar reads only the custody
record's own authenticated checkpoint and refuses unless zero ops then and now and no entry of that name in it;
reason alphabet `/^[A-Za-z][A-Za-z_-]{0,63}$/`; no law, guard or assertion removed (2 deleted lines, both export
list reflow). Commit author cowork (Earned PM) joeymat11@gmail.com, Co-Authored-By Claude Opus, not pushed.

## 4. Drift and suites (my runs, TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03)
Drift `git diff --name-only f7fe44d HEAD`: m3/w6/local/{import-bundle,local-client,browser-entry}.mjs,
lanes/d/import-retract/retract.test.mjs (new), lanes/d/P3-IMPORT-RETRACT-AUTHOR-REPORT.md (new); each findstr'd
against lanes/b/tooling/packages/S5.json: undeclared, all five. Engine bytes 0, today/** bytes 0, m4 bytes 0.
```
lane cells (author):    tests 10  pass 10  fail 0     reviewer cells: tests 10  pass 10  fail 0
P3 import (15 files):   tests 15  pass 15  fail 0     local-source-consumer: tests 6 pass 6 fail 0
W6:                     tests 586 pass 586 fail 0     port: tests 65 pass 65 fail 0
today (13 files):       tests 645 pass 645 fail 0     measure (6 files): tests 32 pass 32 fail 0
rig187 => PASS
b-package --ci --package S5 at eb1c0ba (detached): FAIL SEAL-BASE-IS-NOT-THE-CHAIN-TIP, exit 1 (MINOR 3)
b-package --ci --package S5 at eb1c0ba cherry-picked onto 0986dd8: PUBLIC CI EVIDENCE PASS, 0 unlisted drift
```
