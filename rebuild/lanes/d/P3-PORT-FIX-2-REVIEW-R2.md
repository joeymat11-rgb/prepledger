# P3-PORT-FIX-2 - INDEPENDENT REVIEW R2 (after the fix round)

VERDICT: **ACCEPT.** The fix round changed only what R1's notes asked for, every
note it claims to have fixed is fixed, the fix is red-first on my own run
through the real machinery, no assertion anywhere was weakened, and the full
nine-row bar re-runs at **323 pass / 0 fail** on my own run, which is the
author's number exactly.

Reviewed at `16a4c6d198ad3ea726b1cd5d3fd50f1854dccc41`, previous review at
`eecb0c3`, base `94f298d`. Worktree clean before and after everything below.

## 1. THE ORIGINAL FINDINGS, ONE LINE EACH

**R1 raised NO BLOCKING FINDINGS.** Nothing was reproduced against the author
and nothing was disputed by him, so there is no blocking line to close. The
seven NOTES R1 left for the PM and for the next author are where the fix round
did its work, and each is answered here.

| R1 note | status at `16a4c6d` |
|---------|---------------------|
| NOTE 1 - the sentence was chosen by the first KNOWN token anywhere in the joined detail, so a refusal leading with `split.map` printed the CAPTURE sentence | **RESOLVED.** Keyed on the FIRST issue's field; reproduced red and verified green by me, in the machinery and by direct probe |
| NOTE 2 - a `setup_document` refusal makes every capture refuse too | **RECORDED, unchanged by design.** Still true, still unreachable with a real recorded workout, still the right sentence (`setup_document` leads); untouched |
| NOTE 3 - provenance is proved by shape, not by a signature | **RESOLVED as asked (comment only).** The argument is now written at the check; the executable line is byte-identical |
| NOTE 4 - Edit My Week leaves a residual owner path that still refuses | **CARRIED TO THE PM** as author-report open question 8. Correct disposition: it is a ruling, not a build fault |
| NOTE 5 - the PM-gate trip-wire warning no longer sat on a cell that measures a refusal | **RESOLVED.** The warning now sits on `D-PF-f5` and on `D-PF-n4`, the two cells that still measure one |
| NOTE 6 - cost of the bound probe | **RECORDED.** No change, none asked for |
| NOTE 7 - DECISIONS:509 is not in this worktree | **RECORDED.** Unchanged; the ledger and this lane are on different tips |

**STILL OPEN: none.** Two items are open questions for the PM by design (NOTE 1's
precedence ruling, now moot for the build, and NOTE 4), not open defects.

## 2. WHAT THE FIX ROUND TOUCHED

`git diff eecb0c3..HEAD --numstat` is seven files and nothing else:

    167   1  rebuild/lanes/d/P3-PORT-FIX-2-AUTHOR-REPORT.md
     89   3  rebuild/lanes/d/p3-port-fix/capture-codes.test.mjs
      9   4  rebuild/lanes/d/p3-port-fix/owner-route.test.mjs
      8   1  rebuild/lanes/d/p3-port-fix/programme-rule.test.mjs
     12   1  rebuild/m3/w6/local/source-admission.mjs
     45  13  rebuild/m3/w7-preview/import/import-screen.mjs
     10   2  rebuild/m3/w7-preview/import/test/refusal-route.test.mjs

Product diff is still only `source-admission.mjs` and `import-screen.mjs`, as
the ticket requires. The lockdown numstat `94f298d..HEAD` over `authority`,
`client`, `engine`, `coach`, `port`, `DECISIONS.md`, `replay-core.cjs`,
`athlete-state.cjs` and `plan-edit-model.cjs` is EMPTY. I read the whole
product diff and the whole test diff of the fix round, line by line.

### The `source-admission.mjs` change is comment only

The twelve added lines are inside the block comment that already stood above
the check; the executable line is unchanged and still reads

    for(const [id,count]of counts)if(documentSets.get(id)!==count)fail(...)

so everything R1 verified about R1's ruling and all of R3 stands untouched.
The added paragraph says what R1's NOTE 3 asked: the word "provenance" here
means "it came from a programme this phone had", never "it is authenticated".
That is the honest reading, and it is the one I verified in R1 section 3.

### The `import-screen.mjs` change is the smallest one that closes NOTE 1

`refusalLines(code, detail, leadField)`. When `leadField` is PASSED, it alone
decides, and it only decides when it is a non-empty string the map names
(`Object.hasOwn`, so no prototype key can match); anything else falls to
`REFUSAL_SENTENCE[code]`. When it is OMITTED the old token scan runs, for a
caller holding only a rendered string. `confirm()` hands in
`prepared.issues[0].field`, and `codes[0]` beside it is `issues[0].code`
(`[...new Set(issues.map(i => i.code))]`), so the two halves of the box come
from the SAME issue by construction, not by coincidence. The render passes
`refusal.field || null` ALWAYS, so the shipped screen never reaches the scan.
`REFUSAL_FIELD_SENTENCE`, `REFUSAL_SENTENCE`, `codeLine` and both of the PM's
sentences are byte untouched. `refusalLines` has exactly one product call site
(`import-screen.mjs:506`); I searched the whole `rebuild` tree for others.

`fail()` adds `field` to the refusal object only when there is one, so a
refusal that never carried a field is the same object it was.

## 3. RED FIRST, REPRODUCED BY ME

I checked the two PRODUCT files out at `eecb0c3` (the pre-fix product), left
every cell in place, ran the three lane files plus `refusal-route` and `route`,
then restored to `HEAD` (`git status` clean afterwards). Log `%TEMP%\r2-red.log`:
`tests 48, pass 44, fail 4`.

The four are `D-PF-f6`, `D-PF-g1`, `D-PF-g2` and `P3-X11`. `D-PF-f6` failed
with exactly the untruth NOTE 1 named, printed by the real machinery:

    LOCAL_SOURCE_PROGRAMME_UNRESOLVED (split.map capture_sets db-bench)
    A workout you already recorded on this phone has a different number of
    sets than this file has for that lift. Nothing on this phone was changed.

expected: "This file was written by a different training week than the one you
set up on this phone." The capture sentence under a week-leading code line.
NOTE 1 is real, it is reproduced through the machinery, and it is now fixed.

`D-PF-g1` and `D-PF-g2` are red pre-fix too (their `deepEqual` now pins the new
`field` member), and `P3-X11` failed with `the screen did not carry the leading
issue's field`. **ONE ACCURACY NOTE, NOT A DEFECT:** the author's red-first
table (report 12.2) lists two red cells, `D-PF-f6` and `P3-X11`, on a 42-test
run; the true red set on the full five files is FOUR. He declares `g1`/`g2` in
the paragraph right under that table ("changed shape because the refusal object
gained `field`"), so nothing is hidden - the table is simply a subset of its own
run. The direction is in the build's favour (more cells were red, not fewer).

## 4. THE FULL BAR, RE-RUN BY ME

All nine rows through `pf-run.bat` (`TZ=America/New_York`) at `16a4c6d`.

| row | pass | fail | my log |
|-----|------|------|--------|
| lane cells (programme-rule + owner-route + capture-codes) | 31 | 0 | `%TEMP%\rv3-lane.log` |
| plan-edit `model.test.cjs` | 54 | 0 | `%TEMP%\rv3-planedit.log` |
| import corpus (route, refusals, refusal-route, live-clock, page-bundle) | 35 | 0 | `%TEMP%\rv3-corpus.log` |
| w6 `local-source-admission.test.mjs` | 19 | 0 | `%TEMP%\rv3-w6admit.log` |
| `import-retract/retract.test.mjs` | 13 | 0 | `%TEMP%\rv3-retract.log` |
| m4/import S6 children (7 files) | 90 | 0 | `%TEMP%\rv3-m4import.log` |
| w6 `local-source-consumer.test.mjs` | 7 | 0 | `%TEMP%\rv3-consumer.log` |
| SUBTOTAL | 249 | 0 | |
| durable-host + browser-build | 32 | 0 | `%TEMP%\rv3-planedit-extra.log` |
| w6 commit + local-import + import-custody | 42 | 0 | `%TEMP%\rv3-w6extra.log` |
| **GRAND TOTAL** | **323** | **0** | |

`cancelled 0`, `skipped 0`, `todo 0` in every one of the nine logs. Row for row
this is the author's table. The lane row moved `30 -> 31` and nothing else
moved, so `322 -> 323` is `D-PF-f6` and only `D-PF-f6`, as he says.

## 5. MY OWN PROBES OF THE FIX

Written outside the worktree (`%TEMP%\rv3probe\probe.test.mjs`, synthetic
strings only, nothing committed), run through `pf-run.bat`; log
`%TEMP%\rv3-probe.log`: `tests 8, pass 8, fail 0`. These ask the question from
the other side, so a fix that only satisfied `D-PF-f6` would fail here.

- **A** lead `split.map` with `capture_sets` behind it in the detail: the WEEK
  sentence, the capture sentence absent from the whole box. Fixed.
- **B** lead `capture_sets`: the PM's capture sentence. Not over-fixed.
- **C** lead `setup_document`: the PM's setup sentence. The P3-U5 path stands.
- **D** lead `null` with `capture_sets` sitting in the detail: the CODE's
  sentence. A refusal the machinery gave no field for can no longer borrow a
  field sentence out of a lift id or a second issue. This is the case the old
  code got wrong and the one a careless fix would still get wrong.
- **E** `__proto__`, `constructor`, `toString`, `hasOwnProperty` as the lead
  field: the code's sentence every time. No prototype key can speak to him.
- **F** the TWO argument call still behaves as it did, so no caller outside
  this screen changed meaning under it.
- **G** a known-but-unruled field (`sets`, `day`): the code's sentence, which is
  what the PM ruled for "every other field".
- **H** no U+2013 and no U+2014 in either PM sentence.

## 6. NOTHING WEAKENED

I read all 205 lines of the fix round's test diff. Every removal is a line
replaced by a stronger one:

- `D-PF-g1`, `D-PF-g2`: `deepEqual` gained the `field` member and the render
  call gained the third argument. Assertions GAINED; the verbatim box assertion
  is untouched in both.
- `P3-X11`: gained an assertion that the screen carries the leading field, and
  its box assertion now goes through the same three-argument call the screen
  makes. Nothing removed but the two-argument form of that one call.
- `D-PF-f5`: gained the trip-wire paragraph, gained an assertion that the
  capture IS the leading issue, and now renders the way the screen renders. Its
  no-digit, no-dash and no-value-rides-out block is intact.
- `D-PF-n4`: comment only (the trip-wire warning, plus the standing instruction
  that the `sets: 40` half must not be turned into a refusal without a ruling).
- `D-PF-f6`: new, 66 lines, with two "or this cell proves nothing" guards.

No cell was deleted, no assertion was deleted, and there is no `.skip(`,
`.todo(` or `.only(` in any changed file. `D-PF-f6`'s fixture is not
hand-written: the swapped week is read off the phone's own `split.map`.

## 7. DASH SCAN

Zero U+2013 and zero U+2014 in `capture-codes.test.mjs`, `owner-route.test.mjs`,
`programme-rule.test.mjs`, `source-admission.mjs`, `import-screen.mjs`,
`route.test.mjs` and the author report. `refusal-route.test.mjs` holds exactly
2, which are the two characters of the pre-existing dash-DETECTOR regex at
`:240` (`const dash = /[..]/;`, the cell that asserts no `Screen.COPY` value
carries one - so it covers the new sentences too). `git diff 94f298d..HEAD -U0`
on that file is two hunks, both inside `P3-X11` at `:478` and `:487`; the
detector line is byte-identical to `94f298d`. The author's claim checks out.

## 8. WHAT I STILL COULD NOT VERIFY

Unchanged from R1 and not made worse by the fix round:

- That R1's widening is safe across MANY pre-import sessions over several
  weeks; `D-PF-f4` and my R1 PROBE A each measure one recorded session.
- Whether the Edit My Week order (R1 NOTE 4) is reachable in the shipped route.
- The two suites the author excludes (`import-custody/engine-join.test.mjs`,
  `recovery-stage/source-import.test.mjs`): they need `EARNED_*_ROOT` and their
  own runner, as P3-PORT-FIX already recorded.
- Anything about the owner's real data. Synthetic fixtures only; nothing under
  the private paths was read.

## 9. VERDICT

**ACCEPT** at `16a4c6d198ad3ea726b1cd5d3fd50f1854dccc41`. 323 pass / 0 fail on
my own nine-row run, red-first reproduced at 48/4, no assertion weakened, the
product diff inside the two allowed files, the lockdown set byte-identical to
`94f298d`, and the only untruth R1 found is closed with the smallest change
that closes it. The two open questions belong to the PM, not to another round.
