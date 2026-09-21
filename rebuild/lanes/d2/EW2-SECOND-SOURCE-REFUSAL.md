# EW2 addendum: second-source refusal
Author: Astra (Codex), a named assignment under DECISIONS:412, :569 point 3 and :613; high effort; no product byte and no existing test changed
Measured head: 99fab1426184ab5ce879bd16d9237acb264e25e3

D1/D2 correction measured from 5626eef50237b74bdd2f13f75babe8435334d78b
after independent review cff2c578cdfb718cddbc6fc2d547edfae0cae2e3. The
inherited ew2c seal route was unsafe because it reached the real port oracle.
The inherited cells were not executed during this D1/D2 correction; the original
addendum records earlier real-port runs, whose read safety is not established
here. The corrected cells use their own invented envelope helper and label
oracle/count metadata and producer evidence synthetic.

Authority: `refs/remotes/origin/rebuild/t2-client-core:rebuild/DECISIONS.md`, lines
621, 630 and 631 only, read by line filter. Owner :631 answer 3 rules:
"A SECOND, DIFFERENT HISTORY FILE ON ONE PHONE IS REFUSED FOR NOW, BY NAME,
WITH A CLEAR REASON." This lifts E-R46 on the refusal branch, not the build-base
or seal dependencies in :630. This is paper plus executable measurements only.

## A. Current inputs, guards and published output

Path aliases below are exact paths at the measured head:
- A = `rebuild/m3/w6/local/source-admission.mjs`
- I = `rebuild/m3/w6/local/import-bundle.mjs`
- U = `rebuild/m3/w7-preview/import/import-screen.mjs`
- C = `rebuild/m3/w6/import-custody.mjs`
- R = `rebuild/m3/w6/repository.mjs`
- T = `rebuild/m3/w7-preview/today/today-app.cjs`
- L = `rebuild/m3/w7-preview/today/local-source-basis.mjs`
- M = `rebuild/lanes/d2/spike/ew2c-guard-measure.mjs`
- P = `rebuild/lanes/d2/spike/ew2c-second-source-refusal.mjs`

The road, including its guards (source inspection; executions distinguished below):
1. T:691-719 mounts U with the installation, live day, admitted flag and adoption
   callback. U:284-288 queues taps. U:538-575 picks a file and takes its words;
   U:390-409 unseals/qualifies, asks identity first, and writes nothing for No.
2. I:171-200,221-244,270-283,301-333 validates the envelope/KDF, authenticated
   decryption, payload shape and hashes, oracle PASS and no recorded data loss.
   U:421-431 then carries through importBundle, obtains host bindings and uses
   the production producer registry for review; U:432-440 checks the question.
3. I:428-433 requires alive, booted, unexpired local custody. I:542-548 checks
   name and clock; :551-568 checks existing names and the whole import identity.
   SAME file: `LOCAL_IMPORT_ALREADY_PRESENT`, built at I:511 and returned at
   :567, before staging. Same name with changed identity: `LOCAL_IMPORT_NAME_TAKEN`.
   I:466-492 also checks all material when reusing an inactive original.
4. C:121-152 stages/loads immutable originals with a checkpoint; C:13-18,34-78,
   98-108,123-136 checks context, input, authenticated shape, identity and CAS.
   I:569-589 records custody with a guarded commit/retry. No existing-admission
   guard exists here. With zero operations it can seed derived state (:581-582).
5. A:143-152 checks controller dependencies, lifecycle/semantic/day stamp and
   revision/token currency. A:153-170 validates scope, allowed collections,
   no authority context, authenticated operations, causal graph, targets,
   sequences/predecessors and exact outbox coverage; unsupported effects refuse.
6. A:174-193 requires one import entry, loads custody, preserves checkpoint AND
   earlier selections' originals, verifies material hashes/engine/schema,
   qualifies producer context and day, then constructs the identity/order review.
   Earlier selections are inspected for integrity, not used to refuse a new one.
7. U:449-487 passes explicit identity/prefix Yes to prepare. A:749-780 checks
   review ownership, currency, identity, reopen/rollback order evidence, replay
   issues and mixed-history order confirmation/restoration before qualification.
   Replay's guards are A:410-422 (coverage, reproduction, operation clocks),
   :217-390 (one valid setup, label, split periods/map, lift ids/names/day/muscle,
   retained sets/hi/inc/steps validity and correspondence collisions), :489-551
   (reading, food, measure, sleep, settings/check-in and unknown-family outcomes),
   :589-743 (prefix chronology, capture producer/lift/sets/membership, stored
   workout projection and unresolved slots), :746 (calculation). Any issue blocks.
8. A:813-820 copies a selection into `metadata.localSources.selections`, moves
   `active`, stamps its import entry/application, and replaces
   `collections.derived.localSource`. Its owned capability publishes one generation.
   A:139-142 checks capability ownership; R:215-261 checks active integrity,
   revision/token, synchronous validator and transaction completion/abort.
   A:821-828 reconciles the exact marker/basis/revision, then internally reopens.
9. U:501-503 retracts pending custody after refusal. U:369-387 preserves the
   refusal unless retraction itself fails. Success calls T's adoption callback;
   L:32-62 checks completed marker/active selection, ready view, three equal
   bases, installation, state shape and label. T:2482-2488 adopts or falls back.

Counterexample through the real machinery after envelope creation: P seals
invented A/B/C with its dedicated AES-GCM helper and drives the actual encrypted
repository, custody/review/prepare/publish/reconcile path. Its oracle PASS/count
metadata and producer evidence are synthetic declarations, never oracle or
provenance proof. At this head B and C are admitted. M independently finds two
retained selections, changed derived digest, unchanged operations/outbox.

Do not confuse that execution with a normal second tap on an adopted screen:
U:626-627 already shows only a summary when done/admitted. T:2488 supplies the
admitted flag from the basis read. M:103-121 mounts U and proves admitted=true
removes the chooser. That presentation guard supplies no named admission refusal.

Claude's source review found the real-screen reach that this paper had omitted.
A selection can be committed while the basis read doubts the marker, three
bases, installation, state shape or label. Today then paints clean-init: the
import link is visible but the original imported history is absent. Picking the
same file says `LOCAL_IMPORT_ALREADY_PRESENT`; picking a different file reaches
the proposed refusal. The selection is real, but the screen does not show its
history, so the refusal must be shown to Joe with that adoption-doubt context.

## B. Smallest complete guard, alternative, durable witness and cost

RECOMMENDED: prepare, immediately after A:752, before replay or any qualification:
```js
if(!existingSelection&&Object.keys(held.generation.metadata.localSources?.selections||{}).length)fail('LOCAL_SOURCE_SECOND_ADMISSION_REFUSED');
```
Invariant: once a committed selection exists, a public prepare cannot mint
another selection. The record is `metadata.localSources.selections`, not custody's
`metadata.imports` or a transient screen flag. A:814-820 writes it only with the
published generation. The private internal `existingSelection` permits reopen
and rollback of recorded evidence; public prepare cannot supply that parameter
(A:827-829). Same-file custody still refuses first with its existing name.
The new code uses the existing `LOCAL_SOURCE_*` admission vocabulary. It is thrown
outside replay's catch, so no replay allowlist or editor-code mapping changes.

M:151-191 measures the witness and retry against the scratch guard:
| Input | Output/invariant |
|---|---|
| First review, identity=false | LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED; no selection/application/derivation |
| Retract that failed first attempt, reload, carry same file | Retry reaches qualification; no false admission marker |
| Abort actual IDB transaction after active write request succeeds | TRANSACTION_ABORTED; entire generation equals pre-publish |
| Reload after abort, review same custody and publish | First admission succeeds; one selection |
| Reload after success | Same persisted selection; internal reopen ready |
| Controller rollback to first selection | Ready; two retained selections of ONE file; second different file still refused |
| Lost publish acknowledgement (M:224-231) | Selection remains; reconcile succeeds |

Transaction rollback and `controller.rollback(id)` are different inputs. The
latter appends reselection evidence (A:813,828), not an undo to no admission.
Thus it correctly leaves the guard armed. A lost reply also is not a failed commit.
Custody can outlive an abort: retry reviews that custody; the screen can retract
an unadmitted attempt before carrying it again. Successful custody alone is no ban.

Claude executed the missing premise: an admission requires a setup operation,
so an installation with a committed selection is not zero-operation. A file
carried after admission therefore cannot take I:581-582's zero-operation seed
road into the derived cache. The refused carry and its retract leave the
admitted basis unchanged while appending their custody/retraction revisions.

ONE ALTERNATIVE: review, after A:177, using the same durable record:
```js
if(Object.values(held.generation.metadata.localSources?.selections||{}).some(s=>s.name!==name))fail('LOCAL_SOURCE_SECOND_ADMISSION_REFUSED');
```
M:198-221 measures first admission, second refusal, unchanged generation and
same-source reopen. It refuses earlier, but reasons by names and would also block
reopen/rollback when historical selections include a different file. Prepare
expresses the public-new-selection boundary directly and preserves internal reuse.
Neither guard depends on reaching custody again: a pre-carried B is refused by
both; baseline admits it. A custody-only guard would miss that measured input.
M:233-241 also qualifies A and B before either publishes: A wins, stale B publish
refuses `STALE_REVISION`; fresh review/prepare refuses the new name. No overwrite.
The stale capability retains the existing CAS vocabulary, not the new code.

COUNTED by M:22-50 using unique anchors and OS-temp `git diff --no-index --numstat`:
| Candidate touched path | Added | Removed | S8 product key | S8 execution pin |
|---|---:|---:|---|---|
| A, recommended guard | 1 | 0 | true | false |
| U, sentence map entry after :142 | 1 | 0 | true | false |
| A, alternative INSTEAD of recommended guard | 1 | 0 | true | false |

Recommended total: TWO additions, zero removals, two sealed product files.
Membership came from Node reading `rebuild/m4/spec/acceptance-s8-real-shape.json`;
only the two membership booleans per path were printed. No seal was edited/run.
Scratch: `%TEMP%/ew2c-i8jFSz`; `%TEMP%/ew2c-WhwhU8` supplies the six-journey
candidate run. Re-count at the build base; reseal cost is unmeasured. Ride EW2's seal child.

## C. Athlete output

PROPOSED copy, the owner's to overrule:
"This phone already uses one history file, so importing another is not available yet."
Add it at U:142 to `REFUSAL_SENTENCE` under `LOCAL_SOURCE_SECOND_ADMISSION_REFUSED`.
Today U:169-197 returns just that unknown code; U:525-532 draws the joined lines.
M:62-65 asserts the unknown code and a second novel code, then :103-121 executes
the real screen's file-read failure/catch/paint with the novel code injected.
Today's refusal box is exactly `LOCAL_SOURCE_SECOND_ADMISSION_REFUSED`.
The scratch copy-map renders the code plus the proposed sentence, once.
This is a renderer measurement, not a full production-registry second-import UI run.

The sentence remains PROPOSED. Joe must see it in the adoption-doubt scenario:
his first history is retained in the record but could not be opened on this
screen. He may keep the shorter sentence or choose a contextual alternative;
this paper does not invent his answer or approve either UI wording.

## D. Red-first pin and reproducible outcomes

P derives the original `ew2b-r39-second-admission.mjs` sequence and inputs.
Only J3/J5 expectations invert; their overwrite assertions become assertions that
selection/application/derived/ops/outbox do not change. J1/J2/J4 are preserved.
The original pin omitted J6 despite the brief's six-journey table; P carries it
unchanged from `ew2b-r39-probe.mjs`: B alone on a fresh installation is admitted.
P collects failures, so the first red cannot hide the after-reload counterexample.
For each named refusal, the complete loaded generation is equal before and after
prepare. The whole carry/refuse/retract journey is different: revision advances
twice, the pending import leaves the live array, one append-only retraction
remains, and custody remains. Admitted selections, application and collections
stay equal.
| Journey | Current product | Scratch prepare guard |
|---|---|---|
| 1 first A | PASS: admitted | PASS: admitted |
| 2 same A hot | PASS: LOCAL_IMPORT_ALREADY_PRESENT | same |
| 3 different B hot | RED: admitted, expected new refusal name | PASS: new refusal name |
| 4 same A cold | PASS: LOCAL_IMPORT_ALREADY_PRESENT | same |
| 5 never-carried C cold | RED: admitted, expected new refusal name | PASS: new refusal name |
| 6 B fresh | PASS: admitted | PASS: admitted |
Current P exits 1, RED journeys exactly 3,5. Guarded P exits 0 with 6/6.
M exits 0. A safe D2 counterexample that reports retraction success without
performing it exits 1 with J3/J5 red, proving the lifecycle assertions detect
the missing revision, pending-import removal and appended retraction.
PC runs were sequential; set each variable below before tests. Each Node process
completed before the next began.
```powershell
$env:MEASURED_TEST_NOW='2026-09-03'
$env:TZ='America/New_York'
& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' rebuild/lanes/d2/spike/ew2c-second-source-refusal.mjs
& 'C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' rebuild/lanes/d2/spike/ew2c-guard-measure.mjs
```
P optionally takes M's printed candidate file URL. M's wrong anchor indent and
data-slot instead of input id were corrected harness failures, not product faults.
Final M assertions all passed. The refusal leaves the entire post-carry loaded
generation equal through prepare. After retraction the encrypted custody record
is still readable, revision is +2, the pending import is gone, one retraction is
appended, and admitted state is equal. Product bytes compare equal.

## E. D1 and the ordered build

Once the refusal exists, :621 (2): "D1 narrows to the first admission plus native
edits, where the admission fold over a mixed history must resolve every saved
target to the same lift or refuse BY NAME BEFORE PUBLISHING."
Amend brief section 2 (:188-245), without editing that accepted brief:
- B0 retains its 28 selectable ids; register this refusal cell explicitly in the
  suite, without pretending it was already one of those ids.
- Insert B1a as the FIRST PRODUCT step: pin this red, build guard plus copy,
  turn it green, carry failure/abort/retry/reload/reopen and CAS controls. Its
  proposed D3 REAL-screen row starts with a committed selection whose adoption
  basis is doubted, then picks a different file, observes refusal, retracts and
  redraws. It separately proves the original retained state, pending cleanup,
  copy placement and recovery rather than treating one paint as all four.
- B1's existing mixed-history EW-21 admission row remains red-first before B8.
  It is now the first-admission plus native-edit obligation, not a second-source
  provenance design. Do not drop immutable operations, attribution or rollback proof.
- B2 extends EW-20 to the new code and literal proposed sentence. B8 still writes
  one correspondence; it may not begin translation work before B1a and B1 exist.
- Remove E-R39's unanswered-owner dependency throughout 2.1/2.2; retain actual
  build-base, Today split, C-UI-9, F2, S10 and reseal dependencies. Apply :630's
  existing B12/B13 rulings; this addendum does not reopen them. B16 remains last.
The refusal cell closes only the second-admission reachability arm, not all D1.
The pre-S10 suite may specify and pin that B1a/D3 row; the linked-screen product
work remains post-S10 D3. D4's mixed-history obligation remains a separate debt.

## F. Door left open: six requirements for allowing a second file later

1. Retain each selection's own basis, identity_review, order_input and order_map; M:198-216 proves they survive today (maps here are null).
2. Define immutable per-edit and per-note source/id-space provenance without rewriting saved operations.
3. Resolve correspondence per admitted source, beyond the singular derived cache A:818 replaces.
4. Prove mixed-history edits and notes preserve lift attribution across second selection, reload and rollback, or refuse before publish.
5. Revisit consent, displayed reason and the refusal pin under an owner ruling, then independently accept and reseal the wider path.
6. Reserve a retracted file's name: the same bytes may re-stage, but different
   bytes under that name still refuse `LOCAL_IMPORT_NAME_TAKEN`.

## G. Not measured

No real athlete input, protected fixture inspection, phone, native browser, Linux,
whole Today suite, conformance gate, full seal/reseal or production-registry UI
admission was run. No exhaustive malformed-record/family fault matrix was driven;
A's guard inventory above is source inspection, not a claim all arms ran here.
No mixed-edit admission fold, machine-note translation, second-source recovery of
old multi-source installations, crash/power-loss device durability, or new build
base was proved. IDB is fake-indexeddb with the real encrypted repository; its
transaction abort is executed, not a physical power failure. The earlier inherited
seal route could reach protected oracle and legacy inputs and was not executed in
this correction. The dedicated ew2c helper invokes neither port nor oracle. No
private fixture was listed, opened or created by these programs. No product
implementation is accepted here.
