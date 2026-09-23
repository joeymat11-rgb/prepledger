# GSS annex G4/G5 repair author report

Status: CANDIDATE GREEN; independent and Claude review remain required.
Parent red: b5d1b4af175a8f100de0a21c47365153225ae68b.
Owned paths: gym-app.mjs, gss-annex-log-timing.test.mjs, this report.
G3 round-2 behavior and proof remain unchanged.

## Confirmed red
The immutable author G5 row failed GSS-G5-EDITOR-LOST-AFTER-LOG.
Independent L1 reproduced that failure; review SHA256:
a5ed9dcbd6f8c8e674cf8b046d4876574aafe7025d740385e32fe37cb2ddd6d8.
On Saved repaint, active-only context values became null. gym-app closed the
settings editor and erased its draft/carry before Ready for the next set.

## Repair
A matching Saved view now snapshots the current settings draft into the existing
weak carry, retires the old editor, and drops its local token and mutable draft.
The next active view in the same workout and lift clones that snapshot and opens
a fresh editor token through existing hooks. Other phases, workouts and lifts
clear carry. The active-only writer guard and writer API are unchanged.

## Focused proof
The G4 row retains its DOM plant, before/after-commit seams, exact submitted and
durable set identity, exact permitted refusal, full prior maps and outbox links.
G5 proves the original positive journey and its DOM-loss plant. It additionally
proves old input/Save controls cannot mutate or write, the fresh restored editor
saves Seat=four exactly once, and the combined maps survive reopen. A second G5
row rejects carry for both a different workout and a different lift.

Fixed MEASURED_TEST_NOW=2026-09-03 and TZ=America/New_York; pinned Node.
Final run root: C:/Users/joeym/AppData/Local/Temp/
earned-gss-g5-repair-green-77b274bc51704b7797b80b744b99e8a1/.
G4: exit 0, 1/1 pass; g4.log SHA256:
4d70ac7aa5536cdcc6c8376da2ac228d54a5abd7f14328410d28d78f1a0439b5.
G5: exit 0, 2/2 pass; g5.log SHA256:
14e418ce600f75887c05d1233c3993ca259e9f9ad30706965c5442011b792748.

Repair-removal used the exact parent product with the final proof and failed the
positive G5 row at GSS-G5-RETIRED-INPUT-MUTATED-FRESH-EDITOR; exit 1.
removal.log SHA256:
5ff9cdc7f6b4c34606284ebfa910d32c2fe66c0950ce4afeb09d75e2c8124dc9.
The exact candidate product bytes were restored after that terminal run.

## Instrument corrections
Three pre-repair harness runs remain non-product evidence: incomplete submitted
snapshot, wrong public draft effort shape, and wrong durable identity nesting.
The first repair run used a pre-Log shared-repository baseline; its legitimate
session-set caused GSS-G5-RETIRED-CONTROLS-WROTE. The next run counted the later
settings op as a second workout op. Final proof separates the post-Log workout
snapshot, exact settings +1, and reopened combined-map equality.

Candidate product SHA256:
d41d1e5c52a8850058485129de2eb8c357a6f38bb770c9f2b482ce2f7b528159.
Candidate proof SHA256:
cea1cd3f392d8ef679e0659eb2b8cf6c6b9742e23b343ab1927fb797d6fbb74b.
No model/store/schema/engine/writer file changed. G6-G8 remain unassigned.
Broad annex, CI, integration and acceptance remain open. Runtime was released.