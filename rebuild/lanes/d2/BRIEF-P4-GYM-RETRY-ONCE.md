# P4 GYM READ RETRY v1.0, proposed by Lane D2

Proposal for PM judgment under DECISIONS:116(5), :129(1), :159 and REQUESTS 2026-09-12 17:49. Source base f40d27b, with the reviewed settings candidate ea78c24 as an explicit prerequisite. No product change or review verdict is claimed.

## Outcome
When the gym card cannot read its workout, the athlete gets an honest error and one deliberate chance to read it again without leaving the card or losing a half-entered set. A retry never repeats Start, Log, Undo, Finish, a check-in or a machine-settings capture. Proposed interpretation of "retry-once": one user-triggered read retry per fault episode, not an automatic retry of an arbitrary paint or command. The PM judges this interpretation by name.

## READ-LIST
- rebuild/m3/w7-preview/today/gym-app.mjs:46, :195, :223, :282, :313 on f40d27b: mount/draft, Log, Finish, Undo and paint. A paint calls model.read, but a ready result immediately calls model.start and paints again; retrying paint wholesale is not a read-only operation.
- rebuild/m3/w7-preview/today/gym-model.mjs:314, :391, :412, :436, :448: read/prepare versus acknowledged mutations. read consumes the transient message; reopening the whole model would also discard transient context.
- rebuild/m3/w7-preview/today/gym-app.mjs:100, :192, :504 at ea78c24: leaveCard ownership and before/after-await checks. Keep these when settings is rebased and merged; older integration source lacks them.
- rebuild/lanes/d2/GYM-CARD-SETTINGS-REVIEW.md:7 and N1-REVIEW.md:7: late navigation and acknowledged-write/read-failure regressions already caught. Their fixes are requirements, not optional analogies.
- rebuild/m3/w7-preview/today/design.cjs:63, :525; plain-copy.cjs:1; test/copy.test.mjs:363: declared runtime copy and per-slot rendering guard.
- rebuild/m3/w6/test/local-today-journey.test.mjs PAGE_PINS; rebuild/DECISIONS.md:154(5), :173: honor the actual landed pin regime, not an assumed unpin.

## Contract and exact copy
Catch rejected model.read results at the view boundary. Keep the current valid card/draft when one exists; an initial read fault gets a neutral fallback with Back. A returned domain refusal remains its own code/copy and is not silently retried. Never turn restore-required, generation conflict or another explicit refusal into a fresh enrollment or a guessed programme.
Initial/read-only fault: "This workout could not be read." Action: "Try reading it again." Button: "Read again". While pending: "Reading the workout..." After that retry fails: "The workout still could not be read. Go back to Today and open it again." Button: "Back to Today". Proposed wording is INVENTED, dash-free and must be declared through the existing copy binding.
At most one retry is available until a successful read or a new deliberate mount; repeated taps while pending share one read. Successful recovery restores the same session/slot and draft. If the read says ready with no started session, show an explicit "Start workout" control for the normal guarded start path; the read retry itself must finish with zero new durable operations. This is a narrow recovery state, not a rewrite of ordinary entry behavior.
When a mutation acknowledged but its following read failed, retain its known acknowledgment and say "Recorded on this device. The workout could not be read back." When a command itself threw and its outcome is unproved, say "Earned could not confirm whether that action was recorded. Read the workout again before trying it again." Do not claim nothing was recorded, replay the command or clear its draft. Existing returned refusals keep their own reason. Catch paths release busy in finally without enabling a duplicate mutation while its outcome is unresolved.
Both the original attempt and retry are bound to this mount/session. Back/check-in relinquishes ownership before navigation; a late success/failure cannot restore the old card or move focus out of the destination. Read retries do not create another host, store, clock or device generation. No timed retry loop, exponential backoff or network behavior is added.

## States to draw
Initial read failure; existing active card plus read failure/draft; pending retry; recovered active/saved/complete state; read returns ready and offers explicit Start; retry exhausted; acknowledged action plus failed read-back; unknown command outcome; navigation while read pending. Each error keeps an accessible status and a usable Back control. Normal logging and settings states keep their existing single primary action.

## Executable acceptance bar
New cell IDs and retry budget are INVENTED requirements. Existing dimensions come from the original gym bar: 390x844/320px viewports, inputs >=16px and actions >=44px.
| Cell | Execute against real controls |
| --- | --- |
| P4-01 | Throw on first model.read; mount resolves to the error with Back and Read again, rather than an unhandled rejection/blank page. |
| P4-02 | First read fails, one retry succeeds: count reads; second rapid tap while pending adds none. Real-host operation and outbox counts do not change from the retry. |
| P4-03 | Both reads fail: only the original plus one retry execute, retry affordance is exhausted, Back works; no timer triggers more reads. |
| P4-04 | Seed a real started session and a half-entered set. Recovery preserves load/reps/effort and the session/slot; successful later Log writes only the deliberately requested set. |
| P4-05 | Read recovery returns ready without a session: no automatic Start from retry, explicit Start writes exactly once with the existing guard. |
| P4-06 | For Start/Log/Undo/Finish, inject thrown command and acknowledged-command/failed-following-read separately. Correct unknown/acknowledged copy, busy released, command call count unchanged by retry. Durability assertions use a real host, not just a mock counter. |
| P4-07 | Returned blocked/refusal DTO retains its code/copy and is never auto-retried. Include restore-required and stale-generation refusal controls. |
| P4-08 | Deferred success and failure after Back/check-in preserve the destination and draft. Repeat with the retry, not only initial read. |
| P4-09 | New copy is declared and render-dash-free; 390x844 and 320px, readable error, inputs >=16px, actions >=44px, no overflow, keyboard/focus remain usable. |
| P4-10 | Mutants caught: retry calls paint/autostarts; retry replays Log; unlimited retries; missing busy finally; claim unknown as unsaved; late repaint after leave; reset draft. |
| P4-11 | Proposed `node --test rebuild/m3/w7-preview/today/test/gym-retry.test.mjs`; run existing gym, settings, check-in, food, copy and local journey suites serially; build; extend gym-check.mjs with a deterministic failed-read recovery and real process kill/reopen. Report actual counts. |
| P4-12 | Exact-head Windows/Ubuntu CI green with this suite named explicitly under current PM custody; byte-verify PAGE_PINS/bindings against the landed base. Reviewer runs failure/retry probes before builder report. |

## Custody and estimate
| Files | Owner / boundary |
| --- | --- |
| gym-app.mjs, design.cjs, new gym-retry tests, gym-check.mjs; minimal screens.template.html only if needed | Lane C, after settings/N2 and PM dispatch; one Today build at a time |
| gym-model.mjs | Read only unless a specific small adapter change is named and justified before build; no mutation protocol change |
| today-entry, host wrappers, bindings, pinned suites, workflow registration | Existing owner/pin process; no implicit licence from P4 |
| engine, client, m4, private data, operation schemas | No changes |

Size: MEDIUM, INVENTED planning estimate because read recovery intersects all command outcomes. Do not ship a broad retry wrapper. Return exact head, state screenshots from synthetic data, test/mutant counts and CI IDs. D2 reviews Claude implementation; PM owns scope and integration authority.
