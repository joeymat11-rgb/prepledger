# P2 S3 IMPORT JOIN - author report

Ticket P2 (CRITICAL-PATH-2026-09-15 section 4; DECISIONS:414 (2), :431 (c), :436).
Lanes D (import) + C (consumer). Size L. Model/effort: Opus, high. Author only; no
independent review, no PM judgment, nothing pushed.

Branch `rebuild/d-s3-import-join` over tip 0ce677c2. Every number below was executed on the PC
at the head of this branch, TZ=America/New_York, MEASURED_TEST_NOW=2026-09-03; Node 24.19.0 for
the product suites, Node 22.22.0 for the S3 harness (its own pin), real Edge 153 for browsers.

## 1. Files and hunks

Graft of the S3 core (0df6ad3f) + harness repair (f0b01d9): 29 paths under
`rebuild/m3/w6/{local,test}`, `rebuild/m4/import/**` and `rebuild/lanes/d`, applied file by
file, no conflict - none of them had changed on the tip since the candidate base 06c5b4a5.

Authored on top:
- `engine-provider.cjs` +26/-1: the instance-local native-Date adapter (`NativeDate` captured
  per instance, `capability()`, `civil()`, `covered()`, `SourceDate` + `SourceDate.parse`),
  handed to merge through `deps.nativeDate`.
- `local-source-profile.cjs` +34/-3: `nativeDateCapability()` under the execution calendar,
  `native` on the qualified context record, three re-qualified engine pins in `SOURCE_PINS`.
- `source-admission.mjs` +8/-3: `sessionMembership` in place of `genSession`, and
  `integration_pending` loses `today-gym-consumers`.
- `today-app.cjs` +20/-1: `athleteBasisState()` in front of the P0-B chain.
- `local-source-basis.mjs` (new, 71 lines): the admitted-import reader.
- `test/engine-provider.test.cjs` +90 (six cells), `test/s3/mutations.cjs` +32 (four mutants),
  `s3-portable-sources.json` re-qualified and moved, `local-source-consumer.test.mjs` (new, six
  cells) and `local-source-consumer-browser.mjs` + `p2-consumer-browser-entry.mjs`: the witness.

`git diff --stat 0ce677c2 HEAD` = 35 files, +4296/-503. Zero bytes differ under
`rebuild/engine`, `rebuild/conform`, `rebuild/m4/spec`, `rebuild/m4/workout`,
`rebuild/m3/w6/host`, `today-bindings.mjs`, `today-entry.mjs`, `.github/workflows/rebuild.yml`,
`local-today-journey.test.mjs` or `rebuild/lanes/b/tooling`.

## 2. Conflicts and how each was resolved

1. **No textual conflict** in the 29-path graft. The branch this ticket inherited had been
   rebased the other way round and was carrying a REVERT of the tip: DECISIONS lines :432-:436,
   `GATE-AUDIT-SPEC-P2.md`, `P0C-AUTHOR-REPORT.md`, P0-C's `today-app.cjs`/PWA work and the
   whole of `today/test/problem.test.mjs` (101 lines, the N2 + P0-B cells). That branch was
   discarded and the graft redone path by path onto the tip. Nothing of the tip is reverted here.
2. **`rebuild/m4/spec/s3-portable-sources.json`** - the candidate put its manifest inside a
   sealed tree. `b-package.cjs` fidelity() diffs `rebuild/engine`, `rebuild/conform`,
   `rebuild/m4/spec` and the tooling directory against the package's declared product list and
   refused it: `B PACKAGE S3 FAIL UNLISTED-SOURCE-CHANGE`. Resolved by moving it to
   `rebuild/m4/import/test/s3/s3-portable-sources.json` beside the harness that owns it, with
   all five resolvers updated. No pinned byte changes; S3 --ci then passes (section 4).
3. **Manifest pins for the merged companion.** `merge.cjs`, `today.cjs` and
   `engine-runtime.cjs` drifted by acceptance (P1). Re-qualified in three places: the manifest,
   `SOURCE_PINS`, and run.mjs's byte-bound engine-runtime loop pin (c03732e8 -> 95d0c675).
4. **`r3-missing-lift-admitted`** mutation needle re-bound to the membership guard that replaced
   the `genSession` line; its cell still kills it.
5. **`S3-HARNESS-*` control trees** created `rebuild/m4/spec` by hand; they now create the
   directory `MANIFEST` names.

## 3. Cells, per bar item (all executed at this head)

| Bar item | Verdict | Cell / script |
| --- | --- | --- |
| Portable replay parity Node AND Edge on identical bytes | PASS | `run.mjs browser-core`: `S3 BROWSER PORTABLE ONLY 27 cells` (parity cells compare complete semantic output on one serialized vector) |
| Preserved 57 core / 41 import positives | PASS | `suite-core 66/66` (57 preserved + 3 R3 + 6 new P2), `suite-import 41/41` |
| 56 selected assertion kills, 7 baselines, 56 restored controls | PASS | `mutations-core`: prepare 10/10, reading-replay 20/20, core-0..4 9+7+10+5+2; 63 kills, 7 baseline groups, 63 restored controls, `RESTORED PASS` on each |
| 27 real Edge checks | PASS | `S3 BROWSER PORTABLE ONLY 27 cells; real WebCrypto/IndexedDB; owned force-kill/reopen` |
| 22 adapted boundary checks | **BLOCKED** | see section 5 (executed refusals, not an assumption) |
| Full-year context permits the reached March parse | PASS | `S3-PROVIDER-NATIVE-DATE-REACHED` |
| September-only context withholds it and stays poisoned | PASS | `S3-PROVIDER-NATIVE-DATE-WITHHELD` (and a later `dataLossGuard` still refuses) |
| Matched full-capture membership positives | PASS | `S3-Q-LAYOUT-COMPLETE`, `S3-Q-F3-LAYOUT` (19/19 admission cells) |
| Omitted-whole-lift refusal | PASS | `S3-Q-LAYOUT-COMPLETE` + mutant `r3-missing-lift-admitted` |
| Differing historical loads | PASS | `S3-Q-F3-LAYOUT` + mutant `captured-set-count-unchecked` |
| Skip / incomplete preservation | PASS | `S3-Q-LAYOUT-COMPLETE` (skipped slot keeps its op and no fact) |
| End-to-end witness, jsdom | PASS | `P2-W1`..`P2-W5` in `local-source-consumer.test.mjs` |
| End-to-end witness, Edge | PASS | `P2 CONSUMER-BROWSER PASS - 20 checks in real Edge` |
| New workout on top, force-kill, reopen | PASS | `P2-W3` (jsdom) and the Edge reopen after `taskkill /F /T` |
| Pin re-qualification + refusal (audit finding 2) | PASS | `S3-PROVIDER-ENGINE-PINS` |
| Consumer wiring (audit finding 1) | PASS | `P2-W2`, `P2-W4`; `today-gym-consumers` removed only there |

## 4. Suite tails (verbatim)

- Today 13 files: `tests 645 / pass 645 / fail 0`.
- W6 `node --test test/*.test.mjs`: `tests 586 / pass 586 / fail 0`.
- A0: `tests 23 / pass 23 / fail 0`. Coach: `tests 218 / pass 218 / fail 0`.
- `A1 TODAY BUILD PASS: 3 assets; 114 pinned inputs ... no em/en dash in any text the athlete can see`
- `A5 PWA BUILD PASS: 13 files ... no em/en dash in any text this build emits`
- `rig187 ⇒ PASS`
- `B PACKAGE S3 SEAL BASE ON THE TIP; ... 0 unlisted drift ...` and
  `B PACKAGE S3 PUBLIC CI EVIDENCE PASS — public evidence only, NOT the package verdict`.
  Its LAWS line carries `97/104 mutant executions DETECTED · 0 HARNESS_ERROR · AUDIT RED-FIRST FAIL`,
  which is the tooling's own standing diagnostic and not a verdict this branch changed.

## 5. Open items and stops

1. **22 adapted boundary checks - BLOCKED, reviewer-side.** Executed:
   `S3-R2-CALENDAR-EXTRA.mjs` under Node 22.22.0 refuses at its first line,
   `Exact reviewer Node22 tool actual 22.22.0 expected 22.23.2`; under the exact reviewer Node
   22.23.2 (installed for this check) it then refuses on the manifest path, which it hardcodes
   inside the sealed `rebuild/m4/spec` tree. Two further reasons stand in the code and cannot be
   author-fixed: it pins MANIFEST_SHA 5e5266c2 and the 111 source bytes, which include the three
   engine files P1 changed by acceptance, and its invented calendar carries no native-Date
   evidence, so a reached merge parse now refuses by the very rule this ticket implements.
   A re-adaptation would mean authoring new evidence into a reviewer's artifact; that is the
   reviewer's call, not this author's. Nothing in `rebuild/lanes/astra/reviews` was edited.
2. **A pinned file blocks a real case, and P3 walks into it.** `today-bindings.mjs`
   (PINNED) `clientClockFor` stamps every operation this installation writes at 13:00Z / -05:00.
   America/New_York is -04:00 from March to November, so on a summer day the offset a real
   operation records disagrees with the calendar's own offset for that date and admission
   refuses the installation's own setup operation. Executed as `P2-W6`, one code,
   `LOCAL_SOURCE_CONTEXT_UNRESOLVED`. The shipped page is unaffected today (its SYNTHETIC_DAY is
   2030-02-04, a winter day) and both witnesses run on 2026-11-20 for the same reason. **P3 runs
   in September on a real clock: it will hit this.** The fix is one line in a pinned file, so
   this ticket stops on it and reports it: `rebuild/m3/w6/local/today-bindings.mjs:166`.
3. The merge constructor site (`new nativeDate(nativeDate.parse(latest9)+1)`) is reached only on
   a LIVE act, and a source replay performs none, so no production call in this lane reaches it.
   It is evidenced by reviewed constructor vectors validated against the real native
   implementation at qualification (including the +1 boundary and a range-crossing epoch), not by
   a reached production call. Named here rather than claimed as reached.
4. An import whose state does not carry this installation's athlete label is not adopted and the
   athlete is told nothing; a worded refusal belongs on the import screen when it exists.
5. The three lane-D reports grafted in name the manifest's old path as history; left as written.
   `local-capture-start-resume` remains in `integration_pending`, untouched by this ticket.
