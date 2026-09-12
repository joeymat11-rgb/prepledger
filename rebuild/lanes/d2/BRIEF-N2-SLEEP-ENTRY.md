# N2 SLEEP ENTRY: proposed build brief v1.0

2026-09-12. Author: Lane D2, Astra. Source base: `5508ed3`; recon run at `11374eb`. PROPOSED for PM judgment, not accepted or implemented. Follows Lane C's `N2-SLEEP-BRIEF.md` at `033fd3f`, with the corrections below; that older outline is provenance, not a second build contract. Authority: `rebuild/DECISIONS.md:143`, `:154`, `:159`; D2 writes the brief, Lane C builds after N1, PM judges. Builder MEDIUM, one independent implementation reviewer MAX (Astra for Claude-authored code; Claude if the PM reassigns the build to Astra), integrator LOW. PM judges this brief by name; no extra review chain is prescribed.

## Outcome and boundary

The athlete records a completed night from bed/wake times or an approximate duration, sees what was saved and where it came from, and can correct it. Today, the next workout preparation and the recovery check-in read that same durable night. Sleep quality stays in the check-in and is displayed here with its existing provenance. No sleep score, new restriction, target, nutrition prescription or physiology claim is introduced. Carry forward `research-brief.md:48`, `:433` (no new sleep progression gate; recorded inputs must reach their consumers) and the approved recovery notes at `:5` (absence is not zero); no new literature claim is made here.

## READ-LIST (line anchors at source base; re-locate by symbol after N1/H3)

| Read | Why it binds this build |
|---|---|
| `rebuild/DECISIONS.md:107`, `:109`, `:110`, `:121`, `:143`, `:154`, `:155`, `:159` | S2, engine-predicate mapping, unknown recovery, copy, queue, pin class and roles. |
| `rebuild/design/CLAUDE-DESIGN-BRIEF.md:27`, `:71`; `rebuild/m1/approved-2026-09-08/ADDITIONS-C-APPROVED-HANDOFF.md:17`; `RECOVERY-CHECKIN-C-NOTES.md:5`, `:11` in that same folder | Approved look, duration/quality separation, dated reuse. New sleep copy below is INVENTED, not an approved-prototype quotation. |
| `rebuild/lanes/c/N2-SLEEP-BRIEF.md` at `033fd3f`; `N1-NUTRITION-BRIEF.md` on the same branch | Carry the existing scope forward; reuse N1's implemented shared-store seam after rebase, not its unbuilt outline. |
| `rebuild/engine/writers.cjs:490`; `rebuild/engine/sleep.cjs:239`, `:576`, `:585`, `:1070`; `rebuild/m3/w7-preview/today/today-engine.cjs:30` | Exported `sleepSpanH`, `{d,h,bed,wake}` meaning, date ordering, timed-night readers, one composition. Read-only. |
| `rebuild/m3/w7-preview/today/checkin-model.mjs:79`, `:90`, `:150`, `:228`; `checkin-commands.cjs:42`, `:50`, `:57`, `:95`, `:137` beside it | Night date, explicit zero, quality choices, source record, frozen-at-construction sleep snapshot, producer validation. |
| `rebuild/m3/w7-preview/today/today-model.cjs:130`; `today-entry.mjs:49`, `:150`, `:303`; `setup-host.mjs:44` beside them | Reading replay, check-in/workout entry capture, actual boot, filtered durable read-back. |
| `rebuild/m3/w6/local/today-bindings.mjs:304`, `:334`, `:413`, `:580`; `local-client.mjs:395`; `host-bindings.mjs:229` beside it | One era, one repository, client clock and producer hook; the returned era does not publicly expose `client.hostBindings`. |
| `rebuild/client/ops.cjs:19`; `rebuild/m4/workout/native-trend-context.cjs:356`; `rebuild/coach/local-world.mjs:222` | Existing sleep/fact class, engine predicates, separate coach composition. Read-only except the named C companion. |
| `rebuild/m3/w7-preview/today/test/checkin.test.mjs:1`; `.github/workflows/rebuild.yml:82`, `:87`, `:97`, `:111` | Real encrypted-store test precedent and actual enumerated CI commands. |

## Corrections to the earlier outline

1. Byte-unchanged A3 is not the bar. `createCheckInEntry` captures `model.stateFromOps()` once; `createCheckInModel.refresh()` reads saved check-ins, not new nights. N2 needs a refresh/rebind at route entry, preserving unrelated draft answers. Reopening a page is not a substitute for the same-page journey.
2. The gym host also receives a captured state; updating only Today's numbers leaves B-NTC reading old nights. Refresh the host's input through a supported binding or rebuild its idle handle, preserving the active-set draft and recorded prescription. Do not change the engine or retrospectively rewrite a Start/set.
3. `sleepSpanH` wraps equal times to a full day and clamps excessive awake minutes to zero. Validate before invoking it. Explicit `0` hours is a legitimate entered answer in A3; a blank must not become `0`.
4. `today-entry.mjs` AND `today-bindings.mjs` are disk-pinned, not just the latter. The pin-class change is assigned after H3 by `:154 (5)`. Authoring can proceed, but no N2 PR-READY with failing pins or an invented alternate clock/store.
5. `sleep.needed` is assigned to H3 (`:154 (6)`), not an unanswered N2 permission question. N2 starts without waiting; integrated fresh-athlete tests must exercise the actual H3 constructor. No local default repairs it.
6. There is no previously approved Sleep screen to harvest verbatim. Bind its controls to the approved styles, and register the exact new copy separately; never change a design checksum to make invented text look owner-approved.

## Durable contract (proposed and disclosed, per :135)

Use the existing producer hook: class `sleep`, kind `fact`, schema version from the existing producer contract. Profile `earned/sleep-night/v1` is INVENTED. Closed payload `{profile, night}`; `night` has `date` and exactly one of `{hours}` or `{bed,wake,awake_min?}`. Optional `from_checkin_op_id` is allowed only with `hours` copied from an explicitly confirmed, authenticated check-in for the following day. No quality member.

`date` is the NIGHT LABEL, matching `dayBefore(checkinDay)`, not the save date or a guessed bedtime calendar date. Label it `Night of {date}`. Default to the previous local calendar day using the page's clock; calendar-valid completed dates through that label are allowed. Keep the client's real save-time envelope separate. Late entry retains the chosen night date. Crossing midnight while a draft is open requires the athlete to confirm that date before saving; it never silently moves the draft.

`hours` is finite, from `0` to `24` inclusive, at most two decimal places. These are INVENTED input bounds, following A3's `0..24` precedent and `sleepSpanH`'s decimal precision; they are not health thresholds. Preserve an entered value exactly, with bed/wake absent. Blank, whitespace-only, null, non-finite, strings in the command payload and unknown members refuse without writes.

Times are strict `HH:MM` clock values. Both are required in times mode and must differ. `awake_min`, if supplied, is an integer from zero through the time span in minutes; compare against the engine span converted back to whole minutes, avoiding decimal-hour rounding errors. No guessed awake minutes are stored when omitted. The preview/result `h` comes ONLY from `E.sleepSpanH(bed,wake,awake_min)`; an omitted awake value uses that function's existing default, and the copy says it is an estimate from clock times. Invalid subtraction is refused, never accepted through the helper's clamp. For equal times or a clock-change night, offer the hours mode; do not implement a new timezone duration engine.

Each deliberate save appends one op plus its outbox entry through one accepted transaction. Corrections append a complete replacement observation; prior ops and the imported basis remain intact. On this one-device local era, choose the highest authenticated device sequence for each night, not insertion order or wall-clock time. Ignore rejected/tombstoned records and other profiles. A correction carries a precondition on the current night op/revision so a stale editor or double submit cannot replace a newer save. Reconcile a committed result before offering retry after an uncertain acknowledgment. Multiple unordered devices contributing the same night are an explicit conflict, never an invented latest; preserve/show both and report that future sync seam.

One pure projector clones the supplied athlete state and overlays each winning night as `{d,h,bed?,wake?,awakeMin?}`; keep other dates and unrelated row fields, remove obsolete bed/wake/awake fields when the athlete deliberately switches to hours-only, and sort by `d` ascending. All source observations remain in the op log/basis. An empty sleep-op set leaves an existing basis unchanged; only a fresh constructor begins with no nights. Replay is deterministic and idempotent. Project sleep before any reading/food replay that consumes sleep, then prove the composed Today/gym outputs against the same engine and source state; N1/H3 determine the final shared entry hook.

Quality uses only the check-in for the day after the selected night, its stored `sleep_quality` string and provenance; no fresh quality input here. With no quality, show a link to that check-in. A check-in's entered duration is offered as a dated suggestion via `Use these hours`, never silently promoted into a sleep night; the source op/date/unit/value must be revalidated in the commit's generation. When a night already exists, it owns the duration display; show any differing historical check-in answer as an older answer with its date, never rewrite it. A3 confirmation remains `existing-record` with the night date. Saving a night does not write a check-in or confirm one automatically.

## Exact copy and states to draw

Every string in this table is INVENTED except the existing quality choices `Poor`, `Okay`, `Good` (`checkin-commands.cjs:42`). Braced values are typed, escaped record values; no raw error text. Existing client refusal copy passes through `plainCopy`. No em/en dashes, emoji or exclamation marks.

| State | Exact copy and controls |
|---|---|
| Entry / empty | `Sleep`; `Night of {date}`; `No sleep recorded for this night.`; `Bed and wake times`; `Hours asleep`; `Back to Today`. Inputs start blank; mode selection is not a fact. |
| Times selected | `Bed time`; `Wake time`; disclosure `Time awake`; `Minutes awake`; `Estimate from clock times: {h} h`; `Time awake was not recorded.` when omitted; `For a clock-change night, enter hours asleep.` |
| Hours selected | `About how many hours did you sleep?`; `Hours`; `Entered as an approximate duration.` Mode changes keep unsaved text locally but submit only the visible mode. |
| Check-in reuse | `From your check-in on {date}: {h} h`; `Use these hours`; `Quality: {choice}`; `From your check-in on {date}.` Absent quality: `Quality not recorded.` and `Open recovery check-in`. |
| Ready / saving / saved | `Save sleep`; `Saving sleep...`; `Sleep saved on this device.`; `Recorded {saveDate} at {saveTime}.` Only claim the timestamp actually on the op; if absent: `Save time not recorded.` |
| Recorded / correction | `{h} h`; `From bed and wake times.` or `Entered as an approximate duration.` or `Confirmed from your check-in on {date}.`; `Change sleep`; `Save correction`; `Cancel`. Keep the existing saved value visible until commit succeeds. |
| Invalid | `Choose times or hours asleep.`; `Enter both times.`; `Enter valid times.`; `For matching times, enter hours asleep instead.`; `Enter whole minutes awake within the time in bed.`; `Enter hours from 0 to 24, with up to two decimal places.`; `Choose a completed night.`; each followed by `Nothing was recorded.` |
| Rollover / changed source | `The date changed. Check which night this is for.` and `Keep this night`; `This night changed while you were editing. Review the saved record before trying again.`; `The check-in changed. Review its hours again.` |
| Store / uncertain / conflict | Client's actual refusal; fallback `Sleep could not be saved on this device.`; uncertain `Checking whether sleep was saved.`; `Two records for this night need review.`; truthful post-commit read failure `Sleep was saved. The screen could not refresh. Open it again.` Never say nothing saved after a commit. |

Draw empty, times, hours, reused check-in, recorded, correction, validation error, stale editor, saving, saved-but-refresh-failed, restore-required and clock rollover. Reuse the approved paper/ink styles and controls (`CLAUDE-DESIGN-BRIEF.md:27`); one primary save control. At the sourced `390x844` viewport it fits the base form; disclosures/errors may scroll, with the primary action reachable above fixed navigation. Test `375px` from `:96` and INVENTED stress width `320px`, keyboard focus/zoom, larger text, and the gym return path. Input text `16px`, input height `48px`, touch minimum `44px` are sourced at `:31`. No layout-frame rewrite or duplicate safe-area padding.

## Custody and size estimate

All quantities here are INVENTED planning estimates, not measured implementation sizes. D2 edits only this brief/recon and STATUS/REQUESTS. Lane C coordinates one Today build after N1. PM may narrow/reassign the companion scope when judging this brief.

| Owner | Proposed paths | Estimated change |
|---|---|---|
| C | `rebuild/m3/w7-preview/today/sleep-{commands.cjs,host.mjs,model.mjs,app.mjs,projection.cjs,check.mjs}`, `test/sleep.test.mjs` | Seven new files, roughly 900 to 1500 lines including tests. |
| C | `today-app.cjs`, `screens.template.html`, `design.cjs`, `build.mjs`, `today-model.cjs`, `today-entry.mjs` in that folder | Route, bindings, copy and replay; roughly 150 to 300 lines. |
| C | `checkin-model.mjs`, `checkin-app.mjs`, `test/checkin.test.mjs`, `test/gym.test.mjs` there; `rebuild/m3/w6/local/today-bindings.mjs`, `test/local-today-journey.test.mjs` in W6 | Fresh sleep context/producer handle through the same clock/store; roughly 100 to 200 lines plus tests. Preserve the check-in command's stored shape. |
| C | `rebuild/coach/local-world.mjs` and focused coach tests, if needed to consume the same projected state | Read-side companion only, roughly 50 to 100 lines; no new coach tool or live call. |
| B / PM | Pin-class tooling and CI enumeration, outside N2's product commit | Request exact `sleep.test.mjs` CI home on both OS; B owns the sealed wrapper, PM the workflow authority. D2/C never patch a pin to force green. |
| Outside this brief | `rebuild/engine/**`, `rebuild/client/**`, `rebuild/m4/**`, `rebuild/conform/**`, `.github/**`, private paths | Byte-unchanged by the N2 product builder. An exposed engine defect is a REQUESTS finding, not a screen repair. |

## Executable acceptance bar (future implementation, none claimed run)

Builder creates named subtests `N2-01` through `N2-18` in `test/sleep.test.mjs`; use `node --test --test-name-pattern=N2-XX rebuild/m3/w7-preview/today/test/sleep.test.mjs` for EACH matching row. Every row must execute assertions, not skip or pass from a source scan. The numbering is INVENTED organization, not a subtest-count floor. Use real public-client/encrypted-store fixtures, no private data. Fail the relevant row with a meaningful mutation before reporting it green.

| Cell | What execution must prove |
|---|---|
| N2-01 | Closed command/envelope; sleep/fact and existing schema read from their source. Reject unknown keys, foreign athlete/source, malformed units and a forged check-in reference with zero writes. |
| N2-02 | Both entry modes, zero hours explicitly entered, blank not zero; invalid dates, future night, numeric strings/null/NaN/infinity, mixed/lone times, equal times, excessive awake minutes and fractional minutes all handled by the exact contract. |
| N2-03 | Projected/preview hours equal direct `sleepSpanH` calls, including midnight, awake subtraction and short-minute precision; invalid subtraction cannot hide behind clamp. Typed hours unchanged; obsolete clock fields removed on mode correction. |
| N2-04 | Night label and save stamp remain distinct across late entry, month/year/leap boundaries and page rollover; clock-change notice/hours route; check-in finds the exact preceding night. |
| N2-05 | Real save adds one op and its outbox in one generation; abort injected at commit leaves neither. Double tap/stale preparation/uncertain acknowledgment cannot duplicate or overwrite a newer save. Distinguish commit failure from refresh failure. |
| N2-06 | Correction appends; original and unrelated records remain; reversed object insertion order gives the same sorted/idempotent projection. Rejected/tombstoned/foreign-profile facts excluded; unordered-device conflict displayed without fabricating a winner. |
| N2-07 | Boot Today, save N2, open A3 WITHOUT reload: updated hours/provenance and confirmation appear; no automatic confirm/check-in op. Save a correction and repeat; unrelated draft answers survive, a previously confirmed older value requires confirmation again. |
| N2-08 | A3-first duration and quality are read from the right date; explicit reuse appends a traceable sleep op; quality never asked/stored twice, no yesterday's answer becomes today's; existing recorded check-in remains byte-identical after night correction. |
| N2-09 | Actual page `boot()` uses the shared projector over its real generation, with and without an injected host; no alternate lease, keys, clock or store. N1 inputs and weigh-ins still compose into the same state. |
| N2-10 | N2 save/correction reaches the real gym preparation and B-NTC's `dayFacts` on the same page; compare to direct engine predicates over that projection. Fresh hosts/relaunch agree. Existing Start/set bytes and the half-entered set survive leaving and returning. |
| N2-11 | Fresh accepted H3 setup plus the first saved night paints truthful Today/gym/recovery, with no NaN/undefined/sample-athlete substitution. The inherited unknown-recovery case is named and routed to B1 if reachable, never locally changed to GREEN. |
| N2-12 | Coach read-side uses the same dated night/provenance on reopening and after a save; no new voice tool, network or tier rule; unqualified consumers refuse honestly. |
| N2-13 | Existing basis nights with zero native ops survive; a new date preserves every old row; same-date correction preserves source history and unrelated fields. No original object mutated. |
| N2-14 | Recorded, empty, busy, invalid, stale, failed and committed-but-unread states render the exact copy from current facts; zero is printed only from an explicit zero record. No duration-derived quality/score or new prescription. |
| N2-15 | First-run/no-store/restore-required/direct-link states do not enroll again or invent records; closed handles cannot save; navigation/cancel writes nothing. |
| N2-16 | Exact-head build and real browser reach Sleep from Today, use both modes and correction, preserve glyph/copy binding, no dashes/emoji/exclamation marks, offline/no off-origin requests; CSP unchanged. |
| N2-17 | Real browser reload, new page and verified process kill after save retain the night and provenance; separately kill before commit and after commit/before acknowledgment. No success inferred merely from closing a tab. |
| N2-18 | Render the stated widths and enlarged text, tab through controls, focus inputs with keyboard, reach primary action without horizontal overflow or navigation overlap, return to the gym draft. Real iPhone checks separately labelled NOT RUN until observed. |

Run the whole new file, all existing Today tests including N1, W6 local journey, A0 host tests, and coach tests with the checked-in dependency setup and commands at the candidate head. Run `node rebuild/m3/w7-preview/today/build.mjs`, the new `node rebuild/m3/w7-preview/today/sleep-check.mjs`, and the CURRENT public engine-package CI command from `rebuild.yml` (not a hardcoded retired package). Store detailed logs only inside the lane worktree; report counts, command paths and run IDs. The browser runner must bind port zero and use the existing permitted browser harness.

Before PR-READY: one independent implementation review, green Ubuntu AND Windows CI at the exact head with the new sleep suite actually enumerated, source custody verified, product report at most 60 lines, STATUS at most 400 characters, and no private reads. Missing CI enumeration/pin-class transition is BLOCKED with an owning-lane request, not a silent residual waiver. No engine seal, receipt, merge, release or owner phone PASS is awarded by this brief.
