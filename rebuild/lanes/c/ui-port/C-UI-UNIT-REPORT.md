# C-UI numeric sibling unit red report

Task: D-CUI-UNIT.
Base: cf14982050a8169c7f4848ec0bf1f69c2bb5759f.
Scope: teeth.py and this report in the static red phase.

## Invariant
Markup whitespace may separate two numeric sibling cells without making the
second signed value look like a range. A suffix keeps that exception only when
it is a real unit from the approved synthetic pack. Arbitrary words and
unapproved pack spellings do not turn prose into numeric cells.

## Durable rows
z14, z15 and z16 put U+2212 signed values in whitespace-separated spans with
the forbidden suffixes sets, reps and today. Each requires a named COPY_CHECK
failure containing U+2212.

z17 and z18 do the same with the unapproved pack spellings lbs and kgs. They
require the same named failure. The unchanged any-word regex accepts all five, so these are
static red before common.py changes.

z19 keeps bare signed values plus lb, kg, g, kcal, percent and seconds units.
It requires no U+2212 COPY_CHECK failure and a clean gate. Existing z4 remains
the owner-ratified positive control for the punctuated lb. suffix.

## Reachability and containment
teeth.py imports Python built-ins only. With --only it copies only this approved
pack's app and quality folders into a fresh OS-temp task directory. Each row
edits only its disposable app.html and launches that copy's gate.py narrowed to
Today at 375x812. gate.py imports common.py, numpy, Pillow and Playwright, opens
the copied app in headless Chromium, and writes the copy's quality/run. teeth.py
also writes its summary to the pack's ignored quality/run/teeth-report.txt.

The prior audit environment exists at:
C:/Users/joeym/AppData/Local/Temp/cui-venv/Scripts/python.exe
Its numpy, Pillow, Playwright and async_api imports were probed green by the PM.
Playwright Chromium exists under the normal Local/ms-playwright folder.

Executed command under runtime grant used that exact Python and:
`quality/teeth.py --only z4,z14,z15,z16,z17,z18,z19 --keep`
No manual deletion follows. teeth.py refreshes only its own disposable work copy
between rows, launches one child at a time, and leaves the final task folder.

Expected unchanged-source result: z4 and z19 agree; z14 to z18 disagree because
the gate returns clean instead of the required named COPY_CHECK failure. An
environmental refusal, traceback, VOID row or browser failure is not red proof.
## Runtime red
The first pinned-Python attempt is retained as environmental non-evidence at
%TEMP%/earned-cui-unit-red-log-6a72fa5f64ac413d8f11d417a8a0b1ce.
The prior-audit environment ran 7 rows: 7 launched, 0 skipped, 0 VOID, 5
disagreeing. z4 and z19 passed. z14 through z18 each exited 0 and produced no
named COPY_CHECK failure, exactly proving the unchanged any-word hole.
Raw log: %TEMP%/earned-cui-unit-valid-red-dda7293bd9314982a2a2bebc6362a1ae/selected-red.log.
Log sha256: dbbb773ad3771fc103544bdb9a6eb4bce91473d08fbd6761cd08e7faf7ecca7e.
Retained scratch: %TEMP%/earned-teeth-6okn1s8s; no process remains live.
common.py remains sha256 1d210887dc15a0dbcb9ba6c462c1fa5b35ae6f3987a9d6e959277e650544b2f7.
Product, baseline, workflow, runner, package, seal, ledger and status bytes are unchanged.
