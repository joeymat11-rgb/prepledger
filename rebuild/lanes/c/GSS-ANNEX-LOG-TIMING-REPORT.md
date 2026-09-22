# GSS annex G4/G5 author report

Status: MEASURED RED; G4 passes and G5 has one valid product failure.
Base: 320d192542dec1fd340dcb2152df5c8816c0526c.
Owned proof: today/test/gss-annex-log-timing.test.mjs.
G3 round-2 product and accepted prior proof are unchanged.

## Proof contract
Both rows use the real mounted page, public model and encrypted synthetic hosts.
Expected set identity is captured from the public active view before Log.
The proof checks the exact submitted six-field snapshot, durable start/slot/lift,
load/reps/effort, returned operation link, outbox link, exact +1 rows and every
prior operation/outbox row unchanged.
Only WORKOUT_RESUME_REQUIRED is an allowed precommit refusal; it must write no
map change. Any throw, unnamed refusal or other named refusal stops the proof.

G4 changes load, reps and effort on the replacement editor during held Log.
Its plant clears the replacement DOM load and is caught by the named assertion.
The positive before-commit and after-commit seams retain the replacement DOM and
shared draft while proving the actual success or exact permitted refusal result.

G5 edits machine settings during held postcommit Log, then requires Saved/Undo,
one onChanged, clearing of only performed entry/effort, and settings retention on
the next active set. Its plant is only reached after the positive journey passes.

## Measured evidence
Frozen environment: MEASURED_TEST_NOW=2026-09-03; TZ=America/New_York.
Pinned Node, serial anchored rows, proof SHA before run:
e2d4ad42bed54ec9a3c1140d14c3d6c1470cd076fe7536bf3be3b1b26a0c6cc7.
Run root: C:/Users/joeym/AppData/Local/Temp/
earned-gss-g45-final2-3bf425b1b0604e77b2c215037a8a2d6d/.
G4: exit 0, 1/1 pass; plant and both positive seams completed.
g4.log SHA256 dd7353e0fd99927d64fcef4801ec5162291e23510f74473c76653935a8ab694a.
G5: exit 1, 0/1 pass; GSS-G5-EDITOR-LOST-AFTER-LOG, true versus false.
g5.log SHA256 d08b0b12c9b084045d8df60fe4fcdabf5734cd9eb385d94836ff5e23054ff626.
G5 stopped before its plant, as required after the valid positive-journey red.

Two earlier runs are retained as harness evidence, not product evidence.
The original 763644 proof rejected the incomplete submitted snapshot:
earned-gss-g45-red-9956b7c578494d2d85b0ce3507791286/g4.log,
SHA256 73cdeaf38ff471a67159438553494963d5158235d9d0ade22f065ab0b9f43049.
The six-field correction then expected the wrong public draft effort shape:
earned-gss-g45-corrected-648109e96b2541acae5812b5c2f54c2d/g4.log,
SHA256 41570b509a221e45c650214c22517fa467fcc9b356bceeaf4c7b4c5424d3b5f5.
The durable identity correction first used the wrong schema nesting:
earned-gss-g45-final-6e79fbdbbf3f4a5d96454209904082fe/g4.log,
SHA256 998ab109daedf89203a1d47bf9b86f7050ceb1b948598620a95a664fdacf5e4f.

## Mechanism and limits
On the Saved repaint, gym-app.mjs derives activeStart/activeLift as null and its
context guard closes the settings editor, clears its draft and clears carry.
Ready for the next set therefore has no settings editor to restore.
Existing G3 draftRef/carry metadata at the base is unrelated to this G5 failure.
No product file was changed. G6-G8 are unassigned. Broad annex, CI, integration,
independent review and acceptance remain open. Runtime was released at terminal.