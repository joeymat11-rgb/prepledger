# GSS G5 repair independent review L2
VERDICT: ACCEPT for the bounded G5 repair; no package or final Claude acceptance.
Candidate: 588c84082753696facc902890047c190c49f7318.
Immutable parent red: b5d1b4af175a8f100de0a21c47365153225ae68b.
Prior independent red review published at 3eda17c remains evidence.
Reviewer is not author, PM or integrator. Source and own executions preceded author report.
Only gym-app, focused proof and author report change; no writer/model/store/schema change.

The repair retains a detached draft only across Saved with matching workout and lift.
It retires the old local editor/token; next active matching context clones the carry and
calls existing settingsEditOpened to obtain fresh authority. It does not reuse old tokens.
gym-settings-lane is byte-unchanged: installView still retires inactive editors, and
editorMatchesView/recordSettings continue to require active view and current token.

Static proof review confirms two distinct durable accounting boundaries:
before Log -> settingsBefore contains exactly one submitted set/op/outbox, with original
full rows unchanged and correct durable start/slot/lift/quantities/returned-op links.
Retired input/Save attempts must leave that entire post-Log snapshot unchanged.
settingsBefore -> settingsAfter requires exactly one additional settings op/outbox and
the expected machine settings for the next lift. Reopen must equal the full final maps.
Thus the settings operation is not counted as another set, nor Log as a stale write.

Pinned Node executable, fixed MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York.
Serial original anchored G4 then G5 in Temp/earned-gss-build; no other accepted rows.
G4 PID 25300: 1 pass, 0 fail; original plant and before/after commit journeys complete.
G5 PID 10276: 2 pass, 0 fail; original positive journey and named DOM-loss plant complete.
The restored editor actually saves once; stale input/Save cannot mutate or write.
Saved/Undo, one workout callback, cleared performed entry/effort and retained answers pass.
Both foreign public-view contexts, changed workout and changed lift, reject inherited carry;
opening their fresh editors does not inherit old answers or accept detached old input.
These are synthetic projected context checks, not separate real-athlete workouts.

Independent repair-removal: scratch ESM loader substitutes only gym-app at its original
module URL with exact immutable parent bytes; final candidate proof/imports stay intact.
Sentinel confirms SHA256 cd0baaaf99a43c45b46bd05ad35a1f4702f057c3af9d672b6cf31ecfd956228a.
PID 41996/test child 61724: 0 pass, 1 expected failure in the positive G5 journey.
Actual failure is GSS-G5-RETIRED-INPUT-MUTATED-FRESH-EDITOR at proof line262,
undefined versus expected answer: the fresh input is missing after the next-set transition.
This genuinely kills the repaired missing-editor behavior; it does NOT demonstrate stale
input mutating an existing editor. The older hidden-marker assertion is later and unrun.
No assertions were reordered. Loader warning is incidental; the failure is the named assertion.

All handles terminal; sole runtime RELEASED immediately, before this report.
Six scoped before/after source hashes and Git blobs equal candidate; checkout never edited.
Product SHA256 d41d1e5c52a8850058485129de2eb8c357a6f38bb770c9f2b482ce2f7b528159.
Proof SHA256 cea1cd3f392d8ef679e0659eb2b8cf6c6b9742e23b343ab1927fb797d6fbb74b.
Evidence: C:/Users/joeym/AppData/Local/Temp/astra-successor-gss-g5-repair-review/.
before.json = after.json SHA256 5049eab99bb4539566191637be9882291e32c896c0fdaf1253764bd959bd1d02
g4.stdout.txt SHA256 6c00862ef22b31c014914e3f33e160840073d2efe3395c32a9a0b5bbb47002ee
g5.stdout.txt SHA256 82dfba76c7daf167a897c34f0fa356685c7346677a33fe361c378db80beaef9a
removal.stdout.txt SHA256 0dda19e9e68e1cd4814fe4405be3a8b63e9ef0b3e716fe6f5440792311640782
remove-repair-loader.mjs SHA256 5f76db01871d42a7f8606e218c9e0297ae2a2ec7981fc55b46c639ac999a1857
Retained containment applies: imports unchanged; added helper effects are bounded.
No G3/23-row audit, broad engine/fence/package run, protected input, browser or source write.
Candidate author report read after independent judgment; bounded results agree.
G6-G8, final Claude/data-path review, exact-head CI and designated integration remain owed. done
