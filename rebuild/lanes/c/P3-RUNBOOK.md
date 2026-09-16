# P3 RUNBOOK — Joe's real port (owner act, PC + phone)

Rehearsed on invented bundles only (`rebuild/lanes/c/P3-STAGE-REPORT.md`). The
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
6. **DISCHARGED IN CODE (P3-IMPORT-UI).** The question was whether the phone's
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

   **What is still open here, and when it lifts.** The caveat on item 6 is not
   the clock any more; it is that the phone has no Import screen to run that
   clock on, so the answer is proved off the page (DECISIONS:472). It lifts
   when P3-IMPORT-UI-2 wires `rebuild/m4/import/production-mapping.cjs` into
   the shipped page and the Import route lands: from then on this is an
   ordinary confirmation made on the device, and the "Go / no-go" line that
   quotes it below is discharged with it.

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

## Move + unseal (phone) — **BLOCKED: THERE IS NO IMPORT SCREEN YET**

**Do not start the real run for the phone half.** Steps 2 to 5 below describe a
screen the shipped build does not have, and P3-IMPORT-UI could not build it:
the review and the confirm are `rebuild/m3/w6/local/source-admission.mjs`, and
the page's own accepted build law refuses that module's graph. The evidence is
executed in `rebuild/m3/w7-preview/import/test/page-bundle.test.mjs` and written
up in `rebuild/lanes/c/P3-IMPORT-UI-AUTHOR-REPORT.md`; it needs a PM ruling, not
an author's fix. Until that ruling lands, the phone cannot admit a bundle and
this section is a plan, not a script.

Sealing on the PC is unaffected and still runs on Joe's word (step 0 above); the
bundle simply waits. Nothing about his ledger changes either way.

1. Move only `earned-port-<date>.json` to the phone (any route - sealed).
   Keep `earned-port-<date>-PASSPHRASE.txt` on the PC.
2. Earned -> IMPORT -> pick the bundle -> type the six words exactly
   (`<REAL_PASSPHRASE_PLACEHOLDER>`). **No such route exists yet.**
3. Confirm the review screen's identity question, then confirm admission.
4. Confirm history visible on Today and on the gym card.
5. Save one new set on top, force-kill the app, reopen. Confirm both the
   imported history and the new set are still there.

What IS proved today, on the real machinery over a synthetic bundle
(`rebuild/m3/w7-preview/import/test/`): the six words open the seal and take
custody on the device; a wrong word or one flipped byte refuses
`BUNDLE_AUTH_FAILED` and writes nothing; another athlete's file refuses
`LOCAL_SOURCE_PROGRAMME_UNRESOLVED` and commits no basis; a repeat is
`LOCAL_IMPORT_ALREADY_PRESENT`; and on both a summer and a winter day the full
admission sequence makes the imported history this athlete's own basis. All of
it runs off the page, which is exactly the gap.

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
