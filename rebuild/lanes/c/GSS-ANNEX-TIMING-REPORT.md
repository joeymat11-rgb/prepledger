# GSS annex timing proof: G3 repair report

Status: G3 round-2 focused candidate GREEN; G4-G8 remain open.
Base repair: caec51782aa694a37cc185bca89b8a06618dc834.
Initial G3 red: 6b6fbb1db01e72b5f93bf76dd6077ee3c4c08af8.
First repair: 1d582091a7596f49f7f5ae02ee675634f6ebdfb9.
Round-2 test-only red: ff4613cb28e0dff5de2dddeb6fa7917bb541a34e.
Owned product/proof: today/gym-app.mjs and today/test/gss-annex-remount.test.mjs.

## Defects and repair
The initial real quota/remount journey retained entry, reps, effort and zero writes,
but lost the open settings editor. The first repair carried editable settings data,
revision and error beside the supplied public gym draft and minted a fresh token.
Independent review then found two stale-control defects on that immutable candidate.
A retired Cancel erased the shared carrier, so a third same-draft mount lost the editor.
A retired input could mutate the carried object while replacement read was delayed.
Both repo rows failed by their independent named assertions with product unchanged.
The round-2 fix requires current mount ownership before Cancel can clear the carrier.
Every remembered draft now snapshots rows/cues, so delayed restore has no old-DOM alias.
Live edits still refresh the snapshot; current Cancel and successful Save still clear it.
Workout/lift isolation, fresh token minting and durable behavior are unchanged.

## Teeth and focused controls
The original entry-loss plant and reconstructed restored-alias mutant remain preserved.
The old-DOM row covers disconnected input/add/remove after a replacement is mounted.
The new controls cover retired Cancel before a third remount and retired input while
replacement latest() is held. Both require the real quota error and complete unchanged
operation/outbox maps after reopen. Independent controls also cover no-event variants,
fresh Save/Cancel, alias persistence and start/lift/draft isolation.

## Measured evidence
Fixed environment: MEASURED_TEST_NOW=2026-09-03; TZ=America/New_York.
Pinned Node; serial execution; no browser, network or child worker.
Round-2 red root: C:/Users/joeym/AppData/Local/Temp/
earned-gss-g3-r2-red-dc84ec5946bf4d568abf34d5b81da662.
Retired Cancel red SHA256: 781941cb5e6107c517525ad2ed5aa5c66289fffb4020120905f49f0c28de2eac.
Delayed restore red SHA256: 0107ad5864e4649deff873c7421fab84a2dd2509c0b6e4e3c6cfcec6005d8edc.
Round-2 green root: C:/Users/joeym/AppData/Local/Temp/
earned-gss-g3-r2-green-d09e45ad7d8d401b89d5b7d5b83ab113.
Repo G3 result: 7/7; log SHA256
74528441c2a9baab5f99a0ebe848209aacd47787647403cbb4ad4ab0c9a889c4.
Reviewer-control replay: 10/10; log SHA256
28ed2d11072e93cb2996db3a523e72e746fc7af7fa7eeee884b91a4cf671d98f.
Product SHA256: cd0baaaf99a43c45b46bd05ad35a1f4702f057c3af9d672b6cf31ecfd956228a.
Proof SHA256: 20bf8172c24b495c47a9bdeab9711a3687606e7f29adcedc731df7bd61a1658c.
Runtime was released immediately after terminal completion.

## Limits
Earlier G1/ABA/G2 focused evidence is preserved and was not repeated in round 2.
This proves focused synthetic G3 journeys only; G4-G8 and annex closure remain open.
Integration, broad CI, acceptance and independent round-2 recheck remain owed.