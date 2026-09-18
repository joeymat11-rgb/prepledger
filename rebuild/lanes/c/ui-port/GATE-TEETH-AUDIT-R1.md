# C-UI gate teeth audit R1

Independent auditor (Opus, HIGH effort), 2026-09-18. Scope: do the two automatic gates in
`rebuild/m1/approved-2026-09-18/quality/` actually refuse what the design of record forbids?
Method: run both gates on the pack's own prototype, then make one forbidden change at a time
in the working tree, re-run, record the refusal line, revert. Every row below was executed on
the owner's Windows PC unless it says "by reading".

## VERDICT: HOLES FOUND

Seven of the checks the README and STANDARD.md call automatic are not enforced by the code.
Three of them let a thing the owner's standing rules forbid pass green. Two acceptance
criteria written into C-UI-1 and C-UI-2 (font pins by sha256; every state within tolerance of
the prototype's render) have no implementation at all in the pack.

## 1. Baseline (the gates on their own prototype)

    cd rebuild/m1/approved-2026-09-18
    python quality/gate.py              exit 0   0 FAIL, 6 WARN, 137 PASS
    python quality/statesheet.py        exit 1   CRASH before any report is written

The gate is green by its own exit-code rule but NOT green as recorded. All six WARN are the
visual regression check against `quality/baseline/`:

    WARN  visual regression vs baseline  ink-today 393x852   6.38% of pixels changed, mean shift 4.66
    WARN  visual regression vs baseline  dawn-today 393x852  5.97% of pixels changed, mean shift 3.98
    (four more: ink/dawn coach and workout, 2.35% to 3.32%, mean shift 1.82 to 2.24)

README section 3 states the tolerance as "mean shift under 0.5, fewer than 10 levels on 1% of
pixels". The pack's own prototype misses that by a factor of four to nine on a second machine.
It does not fail, because the check can only WARN (`quality/gate.py:200`).

`quality/statesheet.py` cannot run on Windows at all: `quality/statesheet.py:73` hardcodes
`/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf`. It crashes with `OSError: cannot open
resource` AFTER the render and check loop and BEFORE the report is written, so on Windows the
second gate yields exit 1 and no `states-report.txt` whether the states are clean or not.
`quality/phonesheet.py:14` has the same hardcoded path. LANES.md's screens tier requires
"CI green both OS"; as shipped that is not reachable.

## 2. The mutation table

One change at a time in the working tree, gate re-run, then `git checkout -- <file>`.
"HOLE" means the design of record forbids the thing and the gate let it through.

| # | mutation | expected | observed | refusal line |
|---|---|---|---|---|
| a | U+2014 inserted into Today's status sentence (`app/app.html`) | FAIL | FAIL, exit 1 | `FAIL  copy: no dashes, readiness words, vendor names  ink-today 393x852  '<U+2014>'` (also dawn-today) |
| b1 | readiness word: "Train today." becomes "Ready to train today." | FAIL | **PASS, exit 0, 0 FAIL** | none. **HOLE** |
| b2 | vendor name: "Train today with Claude." | FAIL | FAIL, exit 1 | `FAIL  copy: no dashes, readiness words, vendor names  ink-today 393x852  'claude'` |
| c | the sans face pointed at `fonts/earned-serif.woff2` | FAIL | **PASS, exit 0, 0 FAIL** | none. **HOLE** |
| d-1 | `#start` pushed 620 px down at 393x852 | FAIL | **CRASH, exit 1, no report** | `playwright._impl._errors.Error: Page.screenshot: Clipped area is either empty or outside the resulting image` |
| d-2 | `#start` pushed 200 px down at 375x812 and 360x780 only | FAIL | FAIL, exit 1 | `FAIL  primary action in first viewport  ink-today 375x812  #start bottom 851 > 812` (four rows) |
| e1 | Today's titles and status line recoloured to #8a8378 (under 4.5:1, over 3.0:1) | FAIL per STANDARD 3 | **PASS, exit 0, no FAIL and no WARN** | none. **HOLE** |
| e2 | the same text recoloured to #4a463f (under 3.0:1) | FAIL | FAIL, exit 1 | `FAIL  contrast (measured behind the text)  ink-today 393x852  status-line:Upper body today.  2.1, title:Weigh in before br 2.0, ...` |
| f | a keyframe animation on `#start`, live under prefers-reduced-motion | FAIL | FAIL, exit 1, four checks fired | `FAIL  no transitions or animations outside the embers  ink-today 393x852  animation start` and `FAIL  nothing moves under reduced motion  ink-today  20277 px moved` |
| g | one word of T-02's copy ("Sample data." becomes "Example data.") | state sheet catches it | **0 problems, exit 0** | none. **HOLE** |
| g2 | U+2014 inside the same state copy string | state sheet catches it | reported, **but exit 0** | `T-02    ink   LIVE  Preview before setup, sample marked  copy: '<U+2014>'` |
| h1 | T-02's status line shifted 3 px | within tolerance | **0 problems, exit 0** | none (no comparison exists) |
| h2 | T-02's status line shifted 60 px | outside tolerance, FAIL | **0 problems, exit 0** | none. **HOLE** |
| i | `quality/baseline/ink-today.png` deleted | FAIL, or at least refuse to pass | **exit 0, 138 PASS / 5 WARN**, i.e. one more PASS and one fewer WARN than the clean run | `PASS  visual regression vs baseline  ink-today 393x852  baseline set`. **HOLE** |
| j1 | `EARNED_APP` at an empty folder | clean refusal | **CRASH, exit 1, no report** | `playwright._impl._errors.Error: Page.evaluate: TypeError: Cannot read properties of null (reading 'querySelector')` |
| j2 | `EARNED_APP` at `app/compare.html` (a real page of the pack) | clean refusal | **CRASH, exit 1, no report** | same TypeError |

Score over the 16 rows: 5 refused for the right reason with a non zero exit (a, b2, d-2, e2, f);
1 named the problem but still exited 0 (g2); 7 passed green (b1, c, e1, g, h1, h2, i);
3 crashed instead of reporting (d-1, j1, j2).

## 3. Silent-pass paths in the gate code (file:line)

1. **`quality/gate.py:106` the readiness sweep can never match.** The pattern is built with
   `re.search(r'\\b' + w + r'\\b', low)`. In a raw string `r'\\b'` is backslash, backslash, b,
   so the regex looks for a literal backslash followed by "bready\\b", not a word boundary.
   Executed proof: the same text matched by the state sheet's correct `r'\b'` form
   (`quality/statesheet.py:19` and `:59`) returns `['ready', 'recovered']`, while the gate's
   form returns `[]`. Mutation b1 confirms it end to end. The dash list and the vendor list are
   plain substring tests and do work, which is why a, b2 and g2 fired. Note that README
   section 4 says `browser-check.mjs` "gains the readiness-word and vendor-name sweeps from the
   gate": copying this line forward propagates the bug into the client.
2. **`quality/gate.py:200` the visual regression can only WARN.**
   `rec('PASS' if (changed < 0.05 and tone < 0.5) else 'WARN', ...)`. There is no FAIL branch
   except a size change at `:193`. STANDARD.md section 7 item 5 says "any pixel change outside
   the intended area fails the run". It does not. This is also the only check standing behind
   STANDARD.md section 4's "registration check against the baseline".
3. **`quality/gate.py:201` a missing baseline is silently manufactured.**
   `else: cur.save(bp); rec('PASS', ..., 'baseline set')`. Deleting a baseline makes the run
   greener (mutation i: 138 PASS / 5 WARN against the clean 137 PASS / 6 WARN). A port that
   starts with an empty `quality/baseline/` therefore passes regression vacuously on the first
   run and pins whatever it drew as the truth.
4. **`quality/run/report.txt` records a run that compared nothing.** Its header ends with
   "(baseline accepted)", i.e. it was produced by `gate.py --accept`, which takes the `:201`
   branch for all six screens. `quality/run/ink-today.png` and `quality/baseline/ink-today.png`
   are byte identical (sha256 8d9e0b74b7ba24b7dc2b05197331108209a3d55e61e1873874ce8b98bb158719
   for both). The "143 PASS" line in README section 1 includes six regression rows that were
   the run compared against itself.
5. **`quality/gate.py:175-177` the 4.5:1 rule is unreachable.** `need = 3.0 if (bx['muted'] or
   bx['size'] >= 24) else 4.5`, then FAIL only when `ratio < 3.0` and WARN when
   `ratio < need`. `muted` is set at `:172` as `cs.color!==getComputedStyle(document.body).color`,
   which is true for almost every styled element, so `need` is 3.0 almost everywhere and the
   WARN branch is dead code for those elements. Mutation e1 (Today's titles and status line at
   #8a8378) produced neither FAIL nor WARN. `quality/statesheet.py:54` has no 4.5 tier at all.
6. **`quality/statesheet.py` never compares a render to anything.** There is no baseline
   directory, no image diff and no tolerance in the file. README section 3 and the ACCEPTANCE
   clause of C-UI-2, C-UI-3, C-UI-4, C-UI-5, C-UI-6 and C-UI-7 ("each within tolerance of the
   prototype's render") have no implementation. Measured on this machine: re-rendering T-02
   twice with nothing changed is byte identical (0.00% of pixels, mean shift 0.00), so a
   comparison would be meaningful; a 3 px shift moves 7.06% of pixels at mean shift 6.79 and a
   60 px shift moves 10.01% at mean shift 11.94, and the sheet says "0 with problems" for both.
7. **`quality/statesheet.py` never calls `sys.exit`.** It ends at `:93` writing the report. Any
   number of problems exits 0 (mutation g2 printed the refusal and exited 0). "The two gates
   green" cannot be read from this gate's exit code, so a CI step that only checks the exit
   status will call a broken state sheet green.

8. **No font check exists in either gate.** `sha256`, `woff2` and `font-family` appear nowhere
   in `quality/*.py` (searched). `hashlib` is imported at `quality/gate.py:9` and used only for
   the md5 of a pressed-state screenshot at `:164`. Mutation c replaced the whole sans face
   with the serif file and the gate stayed at 0 FAIL.
9. **Rules marked *gate* in STANDARD.md with no code behind them.** Page margin 22 px
   (section 1), the 14 px card inner edge and the 13 to 14 px icon inset (section 1), the
   bottom safe area (section 1: `quality/gate.py:88` reads `pad: getComputedStyle(ui).paddingBottom`
   into `r` and never asserts on it), serif for names and numbers versus sans for the rest
   (section 2), and the "x" rule (section 2), which is tested only on `#log-label` at
   `quality/gate.py:109`.
10. **Unguarded calls abort the run before anything is reported.** The pressed-state block
    (`quality/gate.py:159-165`) takes a clipped screenshot with no try/except, so an element
    pushed off screen kills the run (mutation d-1). All three PRIMARY selectors are also in
    PRESSABLE (`quality/gate.py:36`), so any real "primary below the fold" defect at 393x852
    crashes rather than reports. The first `pg.evaluate` (`:85`) dereferences
    `document.querySelector('.screen.is-active .ui')` with no null check, so a wrong
    `EARNED_APP` gives a TypeError and no report (mutations j1, j2).
11. **Coverage gaps.** Only `:86` (primary in first viewport) and `:100` (touch targets) run at
    375x812 and 360x780; `quality/gate.py:96` (`if (W, H) != (393, 852): continue`) sends
    everything else, including copy, contrast, seams and regression, down one viewport only.
    `quality/statesheet.py:24` fixes the sheet at 393x852 with no second size. Both themes are
    covered in both tools. The moving-pixels motion check (`quality/gate.py:213`) runs on
    `ink-today` and `dawn-coach` only, and the CSS animation check (`:111`) runs inside a
    `reduced_motion='reduce'` context (`:81`), so a transition that is correctly disabled under
    reduced motion but plays otherwise is invisible to both, against STANDARD.md section 5
    ("No transitions, no pulsing, no parallax", unconditional).
12. **`quality/statesheet.py:69` the primary-in-first-viewport check is double conditioned.**
    `if info['scroll'] > info['client'] + 2 and info.get('primBelow')`. A state whose body does
    not scroll is skipped even when its primary is below 852, and `primBelow` is `false` when no
    element matches the selector list at `:36`, so a state that renders no primary at all passes.

## 4. The tolerance, as actually measured

- `quality/statesheet.py`: there is none. 3 px and 60 px shifts both report "0 with problems".
- `quality/gate.py`: PASS when under 0.05% of pixels differ by more than 10 levels AND the mean
  shift is under 0.5; anything worse is a WARN and never a FAIL (`:198-200`). README section 3
  describes this as "fewer than 10 levels on 1% of pixels", which is twenty times looser than
  the code, and calls it the acceptance bar, which the code does not enforce.
- Reproducibility: identical renders on one machine are byte identical (0.00%), but the pack's
  shipped baselines reproduce at 2.35% to 6.38% with mean shift 1.82 to 4.66 on this Windows
  PC. Whatever tolerance is chosen has to be written against a pinned rendering environment, or
  the check is noise everywhere except the machine that made the baselines.

## 5. BLOCKING for sealing C-UI-1

Each of these lets a forbidden thing through, or names an acceptance the pack cannot perform.

- **B1. The readiness-word sweep is dead (`quality/gate.py:106`).** An owner standing rule
  ("no readiness words") is unenforced, and README section 4 asserts "the gate refuses them".
  Fix the pattern, add the same three words to a fixture the gate refuses, and do not copy the
  broken line into `browser-check.mjs`.
- **B2. No font check anywhere.** C-UI-1's ACCEPTANCE says "gate.py pointed at it passes its
  scene, motion, copy and font checks; the fonts are DM Sans and Liberation Serif by sha256".
  There is no font check in the pack to pass. Either the check is written (sha256 of the two
  woff2 files plus the computed `font-family` on a serif element and a sans element), or the
  acceptance line is rewritten to name what actually runs.
- **B3. The state sheet has no comparison and no exit code.** C-UI-2 onwards accept "each
  within tolerance of the prototype's render". Nothing compares. A one-word copy change and a
  60 px layout shift both pass. Until the sheet writes and diffs per-state baselines and exits
  non zero on problems, "statesheet green" is an unfalsifiable claim.
- **B4. Regression is WARN-only and self-healing (`quality/gate.py:200-201`).** A port can
  delete or never create the baselines and pass. This is the only check standing between the
  port and "the range sits where it was approved".

Not blocking, but fix before C-UI-8 (the slice deploy is reviewed on a phone from the sheets):

- **N1.** `quality/statesheet.py:73` and `quality/phonesheet.py:14` hardcode a Linux font path;
  neither runs on Windows. LANES.md's screens tier wants CI green on both OS.
- **N2.** Three crash paths (`gate.py:85`, `gate.py:159-165`) turn a real defect or a wrong
  `EARNED_APP` into a stack trace with no report. A gate that is run unattended should refuse
  in words.
- **N3.** The 4.5:1 contrast rule is unreachable (`gate.py:172-177`).
- **N4.** Everything but two checks runs at one viewport; the state sheet runs at one viewport.
- **N5.** Neither gate checks the BRIEF-RIR-DISPLAY lock. The prototype does honour it
  (`app/app.html:176-180` carries exactly 0, 1, 2, 3+, Unsure), but a port could drop or rename
  a chip and both gates would stay green. A cheap assertion on the five chip values and their
  `data-rir` attributes would close it.

## 6. Notes on the README and STANDARD.md (recorded, not fixed)

- README section 1 calls `gate.py` "143 automatic checks". It is 23 distinct checks producing
  143 result rows across sizes, themes and screens. Six of those rows are the regression rows
  that the recorded run never actually compared.
- README section 1 lists `quality/run/report.txt` and `states-report.txt` as "the last green
  runs (143 PASS; 418 renders, 0 problems)". The gate report's own header says
  "(baseline accepted)". A run made with `--accept` cannot be evidence of regression.
- README section 3's tolerance sentence does not match `gate.py` (1% of pixels versus the
  code's 0.05%) and describes a FAIL the code does not have.
- README section 7 promises the owner a phone-zoom sheet of a ticket's screens at PR-READY.
  `quality/phonesheet.py:9` renders only the three base screens with no state parameter, and
  the script does not run on Windows.
- No contradiction found between the pack and the standing locks themselves: the five RIR
  choices are present and unchanged, the prototype's shipped copy carries no dash, no readiness
  word and no vendor name (the dash and vendor sweeps are green and honest), and nothing in the
  pack touches `logSet` storage. The contradictions are all between what the README says the
  gate does and what the gate does.

## 7. The exact commands used

Scratch worktree (nothing was committed to the main worktree, and no pack file is modified by
this commit; every mutation was reverted with `git checkout -- <file>` before the next run):

    git fetch origin rebuild/c-ui-port
    git worktree add -b rebuild/r-cui-gate-audit %TEMP%\earned-cui-audit origin/rebuild/c-ui-port

Runtime (numpy and Pillow were absent from the system Python 3.14.6; playwright and its
Chromium were already installed, so one venv was made with system site packages):

    python -m venv --system-site-packages %TEMP%\cui-venv
    %TEMP%\cui-venv\Scripts\python.exe -m pip install numpy pillow

The gates, run from `rebuild/m1/approved-2026-09-18`:

    %TEMP%\cui-venv\Scripts\python.exe quality\gate.py
    %TEMP%\cui-venv\Scripts\python.exe quality\statesheet.py --only T-02

`statesheet.py` cannot start on Windows, so its checks were measured through an untracked shim
that only patches `PIL.ImageFont.truetype` to fall back to a Windows font and then executes
`quality/statesheet.py` unmodified. The shim was deleted before this commit; no line of
`statesheet.py` was changed.

Mutations were driven by three scratch scripts outside the repo
(`%TEMP%\cui-mutate.py`, `%TEMP%\cui-tolerance.py`, `%TEMP%\cui-probe4.py`), each of which
applies one edit, runs the gate with `subprocess`, records the report, and reverts in a
`finally` block. Logs: `%TEMP%\cui-mut.log`, `%TEMP%\cui-tol.log`, `%TEMP%\cui-probe4.log`.

The `EARNED_APP` cases were run by setting the variable for one child process only:

    set EARNED_APP=file:///C:/Users/.../cui-empty/        then quality\gate.py
    set EARNED_APP=file:///.../approved-2026-09-18/app/compare.html    then quality\gate.py

Baseline identity was checked with `certutil -hashfile <png> SHA256` on
`quality/run/ink-today.png` and `quality/baseline/ink-today.png`.

## 8. What I could not execute, and why

- `quality/phonesheet.py` was not run: the same hardcoded Linux font path as the state sheet,
  and it produces nothing the two gates do not. Finding N1 for it is by reading, not executed.
- The gates were not pointed at a real client preview build. C-UI-1 has not landed, so there is
  no preview build to point `EARNED_APP` at yet; everything above is measured against the
  pack's own prototype, which is the reference target the README names.
- The full 418-render state sheet was not run; the state-sheet mutations were measured on T-02
  with `--only`. The findings are structural (no comparison code exists, no exit code exists),
  so they do not depend on which state is rendered.
- Mutation d could not be made to FAIL cleanly at 393x852: any primary pushed below that
  viewport crashes the pressed-state block first. The check itself is sound and was proved at
  375x812 and 360x780 (row d-2).
