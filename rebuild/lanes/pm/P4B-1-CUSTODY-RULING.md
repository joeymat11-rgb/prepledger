# P4b-1 REMEMBER AND RECALL: the PM's custody and slice ruling

PM4, 2026-09-19. This is the artifact that DECISIONS:204 held back and that section 4 of
`rebuild/lanes/e/COACHING-MEMORY-V1-IMPLEMENTATION-BRIEF.md` requires before code: "PM must publish
the exact released subset and author per file before code". The design is the accepted brief (:204,
by sha256). The scope is the owner's: approved at :202, narrowed to Option A in his words at :432
("Q6: Option A"). The final review is owner-ruled by name at :439: Fable, high effort, no exceptions.
Evidence for every measurement below: the read-only scout report of 2026-09-19 (PM seat, :540).

## 1. The slice

Option A ships in three slices. THIS ruling releases the first and only the first.

| Slice | Bar rows of the brief, section 5 | Released |
| --- | --- | --- |
| P4b-1 REMEMBER AND RECALL | M01, M02, M03, M06, M12 | YES, by this file |
| P4b-2 REVIEW AND CORRECT | M04, M05, M11 and the review surface | no: behind C-UI-6, or earlier as a conversation-only flow by a later ruling |
| P4b-3 WHY DID THIS CHANGE | M08, as a READER over the rows P4a already writes | no |

M07, M09 and M10 stay deferred (CRITICAL-PATH-2026-09-15.md:371). The brief's M2 section (one
committed decision operation, no client/index.cjs edit) describes a world P4a changed: :453 put the
reason on disk inside rebuild/client/index.cjs and :458 made accept_proposal write issuance first,
then the response, with a compensating write. Nobody rebuilds that writer. decision-commands.cjs and
decision-history.cjs are NOT in this slice.

What slice 1 is, in the owner's own sentence at Q6: remember a confirmed preference, and recall it in
a fresh session after a real restart, with its source and date. What it is not: a screen. The coach
surface on the phone is a stub until C-UI-6; this slice lands the memory underneath the coach's tools,
proven through the real durable client, and becomes visible when the coach screen does.

## 2. Custody: ONE author lane, lane C, for every file below

New files (all under rebuild/coach/, none pinned by rebuild/m4/spec/acceptance-s8-real-shape.json):
memory-commands.cjs, memory-model.cjs, memory-host.mjs, memory-tools.cjs, test/memory.test.cjs,
test/memory-journey.test.cjs.

Existing files the consumer join may edit (all under rebuild/coach/, none pinned): tools.cjs,
local-world.mjs, wave1-tools.cjs, TOOL-CONTRACT.md, model-adapter.md, test/tiers.test.cjs,
test/wave1-demo.test.cjs, test/no-dashes.test.cjs.

Folded in, because this is the "next coach touch" :458 ticketed it for: in tools.cjs the compensating
accepted:false write checks its own {stored} result, and the refusal copy says so when it fails.

Nothing else. No file under rebuild/m3, rebuild/m4, rebuild/engine, rebuild/client, rebuild/lanes/b,
no workflow file, no screen, no today route, no deploy. The existing CI line
`node --test "rebuild/coach/test/*.test.cjs"` already enumerates the two new test files; the reviewer
proves they really ran, with a nonzero count, at the exact head.

## 3. The design decisions this ruling fixes (from the brief's M1 and M5)

1. STORAGE SEAM: the one machine-settings-commands.cjs and local-world.mjs:150 already prove:
   client.hostBindings({workoutCommands}) over createDurablePublicClient, on the ALREADY OPEN
   installation. No second database, no second enrolment, no synthetic identity default, no widening
   of the stage whitelists (w6/t2-stage.cjs:9, w6/local/local-client.mjs:49 and :347).
2. PROFILE earned/coach-memory/v1, closed shape: kinds goal, preference, constraint, decision-note;
   a stable memory id; a declared topic; the exact confirmed text (at most 400 characters, the
   existing TEXT_MAX); identifiers at most 80; athlete identity, effective time and provenance from
   the existing envelope, never a second clock.
3. A MEMORY IS WRITTEN ONLY ON AN EXPLICIT, BOUND YES to that exact text, the same confirmation
   discipline accept_proposal uses. No yes, a cancelled yes, an invalid shape, a forged cross-user
   parent or an unqualified generation writes NOTHING: no operation, no outbox entry (M02).
4. RECALL is by explicit topic or subject, returns current facts with source and date, and is
   bounded: at most FIVE facts per turn, never a scan of histories, never the whole store. It rides
   inside model-adapter.md section 3 item 3 (tool results of this turn only); nothing else about what
   leaves the phone changes.
5. CANONICAL TRUTH WINS (M06): setup, machine settings, logged observations and the effective
   programme are read through their own owners and stay the truth; a contradicting memory is
   returned labelled as the athlete's preference beside the current canonical value. A memory never
   changes the programme, a target or a logged observation.
6. REMEMBERED TEXT IS DATA (M12): it is never a tool instruction or an authority grant, whatever it
   says; no key, store id, device id or transcript leaves with it.
7. HONEST FAILURE (M03): a transaction abort or quota failure before commit leaves no remembered
   claim; a commit followed by a failed read-back reports the truthful durable result and never
   writes twice.

## 4. The bar, preregistered

M01, M02, M03, M06 and M12 exactly as worded in the brief's section 5, each through the real product
boundary, plus the standing rows of :439: today's real date, a moving clock, the device timezone
offset on stamps, offline reload, force-kill and reopen, local-midnight rollover; a cell that claims
a path is stub-free on that path; the builder runs the reviewer's published probe set before
hand-off. M01's "a second user recalls none" is proven with a REAL second installation in the
harness, never with synthetic ids (local-world.mjs:195 and :265 forbid it). M12 is proven with
adversarial stored text written by the reviewer's side BEFORE the build, not asserted. One effective
source mutation is killed for each new refusal boundary, with positive controls restored; no
parse-error kills. The coach suite stays green at or above 234 plus the new cells; rig187 PASS;
zero U+2013 and U+2014 added; engine, m3, m4 and DECISIONS numstat EMPTY.

## 5. STOP conditions (stop and report, never improvise)

1. any touched path is pinned by acceptance-s8-real-shape.json; 2. the authority, projector or stage
validation refuses the new fact shape (report the exact refusal; never relax a boundary or widen a
whitelist); 3. the slice needs a second database, a second enrolment or a synthetic identity; 4. a
memory would change the programme, a target or an observation; 5. the work starts to need a screen or
a today route; 6. a reseal lands and ENGINE_REVISION goes red (hand back; the PM bumps it at
merge-forward); 7. twenty minutes on any mechanical problem (:431 point 16); 8. two consecutive
same-OS CI reds.

## 6. Process

Probe set first (the reviewer's side, before the build), author Opus high red-first, independent
reviewer Opus high told to disagree, one fix round with a re-check, then the PM's Fable final on every
product hunk, CI on both OS at the exact head, fast-forward merge, one ledger line. It rides no
reseal child. Branch rebuild/c-p4b-memory-1. Hands read in the farm and write on the PC (:544).
