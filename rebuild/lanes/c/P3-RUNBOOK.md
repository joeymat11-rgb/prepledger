# P3 RUNBOOK — Joe's real port (owner act, PC + phone)

Rehearsed on invented bundles only (`rebuild/lanes/c/P3-STAGE-REPORT.md`, and
for the phone half `rebuild/lanes/c/P3-IMPORT-UI-2-AUTHOR-REPORT.md`). The
script for the real day. Nothing runs until Joe says the sentence in step 0,
his own words, right before it happens (README's own rule).

## Pre-checks (all before Joe says anything)

1. Worktree at the tip: `git rev-parse origin/rebuild/t2-client-core` matches
   the worktree's `git rev-parse HEAD`; re-run `git worktree add --detach
   <dir> origin/rebuild/t2-client-core` if not.
2. `node_modules` present (worktree root, `rebuild/m3/w6`, `rebuild/m3/w5` —
   junctions or a real install); `node --test
   rebuild/m3/setup/port/test/*.test.cjs` must exit 0 first.
3. Disk space: the sealed bundle roughly doubles the source file's size;
   confirm free space on the PC out-drive and on the phone.
4. `--out` is a plain folder Joe controls (Desktop/Documents), outside the
   repo, outside any git working tree, not named/nested `rebuild`, and not
   inside a synced folder (OneDrive, Dropbox, Google Drive, iCloud Drive,
   Box) - the code now refuses all of these (P3-HARDEN, DECISIONS:454, closed
   STAGE-REPORT finding 2). Joe still picks the folder deliberately; this is
   a second layer, not a reason to stop checking.
5. Phone reachable, unlocked, Home-Screen build, network for the chosen
   route, free space for the bundle.
6. **DISCHARGED, AND THE CAVEAT IS LIFTED (P3-IMPORT-UI-2).** The caveat below
   was "every admitting cell qualifies through a TEST-ONLY mapping". It is
   lifted, because the shipped Import screen binds
   `rebuild/m4/import/production-mapping.cjs`
   `createProductionProducerRegistry({ hash })` and nothing else
   (`import-screen.mjs` identityYes; `rebuild/m3/w7-preview/today/build.mjs`
   REQUIRED_INPUTS names the module, so a build that lost it is refused). The
   live clock is now proved ON the page, by real taps: `route.test.mjs` P3-U1
   admits on 2026-09-16 with the device's own `-04:00` on the installation's
   first-run operation, P3-U2 does the same on 2026-11-20 at `-05:00`, and
   `edge-route.mjs` runs the whole sequence in real headless Edge against the
   A1 dist on the real clock. This item is now an ordinary confirmation made on
   the device and needs no separate proof on the day.

   **DISCHARGED IN CODE (P3-IMPORT-UI), the original item.** The question was whether the phone's
   IMPORT screen writes its own setup/session operations with the **live**
   device clock rather than a frozen day - `today-bindings.mjs:197
   clientClockFor`'s non-live branch hardcodes tz "-05:00" year-round
   (STAGE-REPORT finding 3), so a real EDT day (mid-Mar to early Nov) on that
   branch makes review refuse `LOCAL_SOURCE_CONTEXT_UNRESOLVED`. It is now
   answered by execution rather than by inspection, in
   `rebuild/m3/w7-preview/import/test/live-clock.test.mjs`:
   - P3-L1/L2: on a real EDT day (2026-09-16) the live clock stamps the
     installation's own first-run operation `-04:00`, and the whole admission
     sequence (reviewSource, prepareSource, publish, reconcile) admits with no
     issue at all.
   - P3-L3: P2's winter day (2026-11-20) still admits on the same path.
   - P3-L4: the frozen branch on that same summer day still refuses
     `LOCAL_SOURCE_CONTEXT_UNRESOLVED`, so the finding is fenced, not merely
     avoided.

   Run it with `TZ=America/New_York`; it refuses to run in any other zone
   rather than measuring nothing.

   **That caveat is closed** by item 6's own first paragraph: the route is on
   the page and the mapping it binds is the production one.

7. **The phone must be standing in America/New_York when the import is
   admitted.** The production execution calendar is the New York calendar.
   `rebuild/m4/import/production-mapping.cjs` reads the DEVICE's own resolved
   time zone into the calendar it presents, and
   `rebuild/m4/import/local-source-profile.cjs` refuses unless that zone is the
   calendar's zone and the calendar's zone is the sealed oracle gate's, which
   is `America/New_York` by law. So a phone resolving to America/Los_Angeles,
   to America/Toronto (which keeps New York's exact offsets and still refuses)
   or to UTC refuses `SOURCE_ENGINE_CONTEXT_UNPROVEN` end to end, before
   anything is written. Executed in four real zones by the mapping's own final
   review (P3-PRODUCER-MAPPING-REVIEW-R3, MINOR 4) and pinned by
   `rebuild/m4/import/test/production-mapping.test.cjs` P3-M15. Check the time
   zone ON the phone, not from the PC: a phone travelling, or with its zone set
   by hand, is a NO-GO until it is back in America/New_York.

8. **ORDER OF USE BEFORE THE IMPORT: NO SCREEN IS OFF LIMITS.** The temporary
   instruction that said "do not open Measure before importing" (P3-IMPORT-UI-2
   open item 1) and the one P3-REPLAY-MEASURE-FAMILY asked for for Sleep are
   both WITHDRAWN. Every writer the shipped page has now has a replay family,
   and each one was stood up on a real installation in both orders
   (`rebuild/lanes/d/p3-replay-all/writer-order.test.mjs`): the weigh-in (F1),
   the food day (F2), the first run and the machine note (F4), the recovery
   check-in (F5), Measure's day one, waist and markers (F7) and a recorded
   night (F8) may all be used before the import, in any order, and the import
   still admits.

   **THE GYM CARD IS NOW INCLUDED, AND NOTHING REMAINS.** The instruction that
   said "do not start a workout before importing" is WITHDRAWN too:
   `local-capture-start-resume` landed, the admitted basis declares nothing
   pending, and a workout recorded before the import is projected after the
   imported history when Joe answers YES to the identity question on the Import
   screen. There is NO ordering instruction left for him: he may use every
   screen, including the gym card, before or after the import.

   **THE ONE THING THAT STILL MATTERS IS THE ANSWER, and it is a question he is
   asked rather than an instruction to remember.** "Did every workout in this
   file happen before this first Earned workout, with none already recorded in
   Earned?" If that is not true of the file he picked, that is, if the PC file
   already contains the workout he did on the phone or a later one, the answer
   is NO, and the import refuses `LOCAL_SOURCE_WORKOUT_UNRESOLVED` and commits
   nothing either way: a YES that his own records contradict is checked, not
   taken at its word, and refuses by the same name. The file stays in custody
   and can be taken back with the retract path. Proved on a real installation,
   both orders, EST and EDT, in
   `rebuild/lanes/d/p3-capture-start/capture-start.test.mjs` and
   `rebuild/lanes/d/p3-replay-all/writer-order.test.mjs`.

## Step 0 — Joe's own words

Joe says, unprompted, something equivalent to: **"Run the port now, on my real
ledger."** Nothing below starts before that sentence.

## The real run (PC)

```
cd <worktree at the tip>
node rebuild/m3/setup/port/port.cjs --source "<REAL_LEDGER_STATE_JSON_PATH>" --out "<REAL_OUT_FOLDER>"
```

Read the six numbered lines: SOURCE, PREPARE, COUNTS, ORACLE, SEAL, WRITE must
all say PASS; ORACLE must show `10/10` in both `frozen` and `unfrozen` modes,
`scope FULL` (private blob present). Anything else: STOP, do not move the
file, and report the exact line — see "If it stops" in the README.

## Move + unseal (phone): the real taps

Every label below is quoted from the SERVED page: `edge-route.mjs` runs this
exact sequence in real headless Edge against the A1 dist on the real clock and
prints the labels it read (P3-IMPORT-UI-2 bar item j).

**MEASURE IS NO LONGER A PRE-CHECK.** This paragraph used to read "do not open
Measure on this phone", because the first render of that screen writes two
`earned/measure-trial-start/v1` operations into the very record admission
replays and the S3 replay had no family for that class, so every later import
refused `LOCAL_SOURCE_CONTEXT_UNRESOLVED`. **That is fixed and the caution is
withdrawn:** `P3-REPLAY-MEASURE-FAMILY` landed the F7 family
(`rebuild/m4/import/measure-replay.cjs`), and a phone that has already opened
Measure - and answered its markers pick - now ADMITS. Executed on one store,
from the Measure link itself, by `refusal-route.test.mjs` P3-X9.

**Before step 2, do not open Sleep on this phone.** The sleep lane writes its
nights with `class: "sleep"` (`today/sleep-commands.cjs` `OP_CLASS`), and that
class is exactly where Measure's was: `source-admission.mjs` replay() hands
`reading`, `session`, the measure family, `food-day`, `steps`, `plan`, the
setup, settings and check-in profiles to a family each, and answers everything
else `LOCAL_SOURCE_CONTEXT_UNRESOLVED`. So a night recorded before the import
refuses it the same way Measure used to. A family for it is in flight in lane
D; until it lands, import first and record sleep after. Nothing is lost if it
happens - a refused import retracts itself and writes nothing - but the history
cannot be admitted on that phone until the family lands. (This one is a reading
of the two files named, not an executed cell: no cell in this lane records a
sleep night before an import. Said plainly so nobody takes it for proof.)

1. Move only `earned-port-<date>.json` to the phone (any route - sealed).
   Keep `earned-port-<date>-PASSPHRASE.txt` on the PC.
2. Open Earned and tap **"Import my history"**. It is in two places and EITHER
   works: on the Today screen, below the "Measure" button, and on the Measure
   screen beside the "No baseline yet" line (the entry DECISIONS:470 asked
   for). Both appear only on an installation whose first run has been saved -
   before that there is no entry anywhere, because the import could only refuse.
   Once a history is admitted the link reads **"History imported"** and opens a
   read-only summary instead.
3. Step 1 of the screen, **"Choose the earned-port file"**: the file picker
   accepts `.json`. Pick the bundle you just moved. Nothing is read yet.
4. Step 2, **"Type the six words from the PC"**: type them exactly
   (`<REAL_PASSPHRASE_PLACEHOLDER>`), then tap **"Unlock"**. This is still
   write-free: the screen says **"Unlocked. Nothing has been written to this
   phone yet."** and shows the PC's own sealed figures (sealed-at time, the PC
   oracle verdict, `dataLossGuard safe` and `lost`, the engine schema version
   and sha256, the file sha256).
   - Wrong words or a damaged file: **`BUNDLE_AUTH_FAILED`** and, beneath it,
     "That passphrase or file did not unlock. Check the six words and the
     file." Nothing was written, on either cause: the screen keeps the file and
     what was typed so the six words can be RETYPED in place. STOP after two
     tries at the words.
   - If the FILE is the problem rather than the words, pick another file: tap
     **"Back"**, then the entry link again. The screen comes back on step 1
     with the chooser, no refusal standing over it and the old file dropped.
     (No reload, and nothing durable happened; `refusal-route.test.mjs`
     P3-X10.) Move the bundle to the phone again and re-pick it.
5. Step 3, the question, asked before anything is written:
   **"Did every workout in this file happen before this first Earned workout,
   with none already recorded in Earned?"** Joe answers, not the PM.
   - **"No"** cancels and writes nothing at all.
   - **"Yes"** takes custody and shows the review: the same question with his
     answer beside it, how many workout days the file holds and which, how many
     workouts Earned already has, the file size, the day the phone is standing
     on, and **"Checked against engine revision …"** (the production mapping's
     own `ENGINE_REVISION`; on the branch this runbook was rewritten on it read
     `M2-S5-TODAY-CHILD@0df73b01f3d2d935`). Read the engine revision aloud and
     check it against the S5 receipt before confirming.
6. Tap **"Import this history"**. That is the explicit confirm and the only
   control that admits anything.
   - Any refusal here is the machinery's own code, shown verbatim and once
     (`LOCAL_SOURCE_*`, `LOCAL_IMPORT_REBASE_REQUIRED`,
     `SOURCE_ENGINE_CONTEXT_UNPROVEN`). WHAT THE SCREEN ACTUALLY PAINTS, so
     nobody waits for a sentence that is not coming: the code alone, in the
     error line, with no explanation beside it and no "Working." note left
     standing; the screen returns to step 1; and the file appears under
     **"Files you took back"**, which IS the receipt that it was taken back out
     of custody. The one refusal that carries a sentence is
     `BUNDLE_AUTH_FAILED` (step 4). If the take-back itself is refused the
     screen says "That file could not be taken back on its own. It is still
     listed below." and the entry stays in **"Your import"**. Report the code
     and STOP - see "Go / no-go".
   - Tapping **"Back"** on the review does the same thing deliberately, and
     that one DOES say so: "That file was taken back. Nothing on this phone was
     changed."
7. The screen reads **"Imported. Today and your gym card now use it."** with
   **"Your import"** beneath it (and **"Files you took back"** if anything was
   ever retracted). Confirm his history on Today and on the gym card, and that
   Measure's baseline column has stopped reading "No baseline yet".
8. Save one new set on top, force-kill the app, reopen. Confirm both the
   imported history and the new set are still there.

Proved on the real machinery over a SYNTHETIC bundle before this script was
written (`rebuild/m3/w7-preview/import/test/`): the whole tap sequence above on
a summer and a winter day, in jsdom over the real store and once in real Edge
against the A1 dist; a wrong word or one flipped byte refuses
`BUNDLE_AUTH_FAILED` and writes nothing; "No" writes nothing; a cancel after
custody retracts and every consumer reads the record it read before; another
athlete's file refuses `LOCAL_SOURCE_PROGRAMME_UNRESOLVED`, retracts and leaves
nothing behind; a damaged file refuses and the very next thing the athlete does
is pick a good one and admit, in one page session with no reload (P3-X10); a
phone that opened Measure first still admits (P3-X9); after admission the route
opens no second import door at all, on that page session or a fresh one (P3-U3,
which also records what the MACHINERY answers behind that door: a repeat is
`LOCAL_IMPORT_ALREADY_PRESENT`, a re-port under the same name is
`LOCAL_IMPORT_NAME_TAKEN`, a different file is `LOCAL_IMPORT_REBASE_REQUIRED`);
and no fetch, XHR, share, download, createObjectURL or window.open ever fires
on the route.

## Go / no-go (what the PM reads before proceeding)

- GO only if every PC line above is PASS with ORACLE `10/10 x 2` FULL scope,
  and the phone shows history + the new set surviving the kill/reopen.
- NO-GO on any FAIL line, any `LOCAL_SOURCE_*` refusal at admission, or if the
  pre-check in item 6 above cannot be confirmed for a live EDT day.
- On NO-GO: stop, do not retry with a different `--out` or a relaxed check to
  force a pass. Report the exact code and hand it to Lane C/D, not around them.

## Reporting

**Verdict only.** No counts, hashes, or any value from the private blob or the
real ledger in chat, in a ticket, or in this runbook's own history. "PASS" or
"FAIL <code>" is the whole report.

## Rollback

Nothing is deleted. The port script only ever reads `ledger/state.json`; it
never writes to it. The old (frozen) app stays untouched and keeps working, PC
and phone, whatever the verdict. To undo a phone import, clear that item from
the phone's history (or its site data, C3-HAND-PROOF row 7, throwaway builds
only) — the PC ledger is never touched either way.
