# EARNED · THE VISUAL DESIGN OF RECORD (2026-09-18) AND THE UI PORT

This folder is the reconstruction the owner approved ("I love this exact design", 2026-09-17,
plus rulings 1 to 7 below): the two rendered boards, the working prototype of the six views,
all 209 drawn states, the UI standard, the two gates and the state inventory. It supersedes
`rebuild/m1/approved-2026-09-08/` for APPEARANCE only; the 2026-09-08 references stay the
reference for behaviour and copy where this pack is silent.

Filed by the design chat ("EARNED — MAIN PM — Fable 5.1"), which runs the UI port as lane C
(builders and one independent reviewer per ticket, Fable judging) on branch
`rebuild/c-ui-port`. The PM chat ("EARNED — PM3 — Fable 5.1") integrates: it records the
ledger line for this design of record, judges each PR-READY line in `rebuild/lanes/STATUS.md`,
and seals. The tickets are in `rebuild/lanes/c/ui-port/`. The owner is asked nothing unless a
builder hits one of the open questions in section 6, each of which has a default.

## 0. For the PM

1. Ledger line (`rebuild/DECISIONS.md`), in the owner's words: the two rendered boards plus
   this reconstruction are the VISUAL DESIGN OF RECORD (2026-09-17 "I love this exact
   design"; boards govern appearance, briefs and ledger govern behaviour; rulings 1 to 7 of
   2026-09-18 in section 2); `design.cjs`'s pins move to this pack when C-UI-1 seals.
2. Judge each `PR-READY · lane C · C-UI-n` line as it appears in STATUS.md; the review file
   is named in the line. Seal per the screens tier (LANES.md), except the workout files the
   S-series packages pin, which ride the next sealed child.

## 1. What is in the zip, and what governs what

| path | what it is | governs |
|---|---|---|
| `ref/ink-board.png`, `ref/dawn-board.png` | the owner's two rendered boards (1491 × 1055), Ink dark and Dawn light, three phones each over the mountain plate | APPEARANCE. The last word on how a screen looks. |
| `ref/*-native.png` | the six phone screens cut from the boards at 1:1 (340 × 734) | what the eye compares a render against; the gate's own comparison is against `quality/baseline/<platform>/` |
| `app/app.html`, `app/app.css`, `app/app.js` | the working prototype of the six views: markup, every token, every rule, the scene (plate, mist, embers, grain, surface), the chassis (scrolling body + fixed stack on every screen) | the IMPLEMENTATION REFERENCE. Classes and copy here are what the port binds to. |
| `app/states.js`, `app/states.css`, `app/states-today.js`, `app/states-workout.js`, `app/states-workout.css`, `app/states-coach.js`, `app/states-coach.css` | the state driver and all 209 drawn states (99 Today, 45 Workout, 65 Coach). Counted from `quality/baseline/states/INDEX.json`: 209 drawn states over 201 distinct base ids, because eight suffixed variants (T-40b to T-40h, and C-50b) share two base rows. The inventory below counts 205 nominal rows, four of which have nothing drawn (T-01, T-34, T-35, C-01), and 205 minus those four is the same 201: every refusal, every sub screen, the proposal card in its three honest states, the coach's structural states | every state the port must reach, with its exact copy |
| `app/states.html`, `app/states-index.js` | a browser for the states (`?screen&theme&state`) | how the owner and reviewers look at any state |
| `app/assets/plate-ink*.jpg`, `app/assets/plate-dawn*.jpg`, `mist.png`, `grain.png` | the two plates: the Ink photograph (the owner's chosen backdrop) and the same photograph graded light for Dawn (one scene, two lights: owner ruling 2026-09-18; the Dawn board's own background is a different photograph and is NOT the design), the mist texture, the grain | the scene assets, shipped as is |
| `app/fonts/earned-sans.woff2` (DM Sans), `app/fonts/earned-serif.woff2` (Liberation Serif) | the two typefaces | see the note under section 2 |
| `app/compare.html` + `app/compare/` | every deliberate departure from the boards, with the reason, in one running record | why the prototype differs from a board where it does |
| `quality/STANDARD.md` | the numbered UI standard (13 sections): layout, type, colour, scene, motion, copy, process, the chassis, the plates, and section 13, the full list of what the gates check | the ACCEPTANCE BAR for every screen and state |
| `quality/gate.py` | 33 distinct checks on the six views, 372 result rows across three phone sizes, two themes and three screens (errors, motion, transitions with motion allowed and refused, copy, generated content the sweep cannot read, the multiplication sign in every set string, targets, fit, thumb zone, columns, page margin, card inner edge, icon inset, bottom safe area, spacing, type scale, radii, pressed states, contrast in two tiers measured behind the text, the two fonts by sha256 and by face, serif versus sans, the RIR lock, seams, mist edges, visual regression against `quality/baseline/<platform>/`) | the gate the port must pass on the real client |
| `quality/statesheet.py` | renders every state in both themes, checks each (errors, copy, targets, primary in the first viewport, contrast in two tiers, label overflow, seams) and compares it to its committed record; 418 renders, exit 1 on any problem | the second gate |
| `quality/teeth.py` | the executable mutation list: 55 forbidden changes applied one at a time to a scratch copy, each run through the scratch copy's own gate and asserted to fail for the stated reason | what proves the two gates can still refuse |
| `quality/phonesheet.py` | phone-zoom contact sheets in thirds, of the three base screens or of any drawn state (`--state T-40`) | what the reviewer looks at |
| `quality/baseline/<platform>/*.png` and `ENV.txt` | the six accepted screen renders for the machine that drew them, and the OS, Python, playwright and Chromium versions of that machine and the launch list it used | what the regression check measures against |
| `quality/baseline/states/<ID>-<theme>.json` and `INDEX.json` | one shared record per state and theme: the visible text, every text bearing element's text, rect, colour, family and size; and the list of ids and themes, with the machine and launch list that wrote them | what the state sheet measures against, on any platform: measured at a worst edge of 0.04 px and 0.00 levels across two operating systems (section 3.1) |
| `quality/baseline/states/<platform>/*.png` and `ENV.txt` | one 1/16 scale greyscale thumbnail per state and theme for the machine that drew them, and that machine's own `ENV.txt` | the half of the record that is a raster, which a second machine sets with `--accept-thumbs` |
| `states/STATE-INVENTORY-DRAFT.md` | the derived state inventory (205 rows: T-01..T-95, W-01..W-45, C-01..C-65) with the verbatim copy the code already carries (section 4.1) and the owner's rulings 1 to 7 (section 6) | BEHAVIOUR and copy, together with the ledger |
| `states/TICKET-proposal-response.md` | the engine ticket that unlocks the proposal card's "Applied" state | lane B, when the PM schedules it |

Two boards, one prototype, one standard, two gates with a mutation list behind them, one
inventory. If the prototype and a board disagree, `app/compare.html` says why; if it does not,
the board wins. `quality/run/` is where both gates write; it is not committed. The evidence that
a run was green is the PR-READY line in `rebuild/lanes/STATUS.md` and the reviewer's own run of
the two gates, never a report file in the tree.

## 2. The owner's rulings (all recorded in the inventory, section 6)

1. The "98 states" figure is unsourced; the derived inventory is the record.
2. The coach's structural states are designed now; its ~50 answer variants are copy on one
   answer card.
3. The proposal card has a real accept path: one card for every proposal kind; three honest
   states, open ("One call needs you"), recorded ("Your call": "You said yes. It applies when
   your plan is next built." / "You said no. Nothing changes.", with "Change my answer"),
   applied ("Applied", only once the engine has stored the answer: needs the lane-B ticket);
   no timed expiry; "Change my answer" until the plan is next built.
4. Every screen is a chassis: a scrolling body and a fixed stack at the bottom, at the height
   the board draws it; the body fades 20 px into the stack and 32 px under the status bar only
   while there is more to see. Today's stack is Start, Recovery, Talk. Workout's is the effort
   row, Log and Edit, the bottom link. Coach's is the text input, the two links, the mic.
5. The weigh-in stays the board's inline card (no sheet).
6. "Skip this set" is dropped until a skip exists in the engine (W-29 stays drawn, NOT WIRED).
7. The five small calls: DM Sans is the sans of record; "I'll tap instead" stays on Workout
   and Coach; the bare "+" on "Plans changed?" stays with its label tappable; the bench
   proposal keeps "Use 105 / Keep 115" and every other kind uses "Yes, add it / No, keep it as
   is"; Dawn is the same mountains as Ink, lighter (the Dawn board's own photograph is not
   the design); the "example" pill stays until real data is wired.

Standing rules from the owner (2026-09-17): no dashes in UI copy (no en or em dash; a colon,
a full stop or the word "to"); no readiness words (ready, readiness, recovered, fatigued);
no vendor or model names; everything offline; only the embers and the mist may animate and
both are still under reduced motion; the plate is never directly behind text; every target
is 44 px; the primary action sits in the first viewport; Log stays in the thumb zone.

**Typeface note.** The prototype's sans is DM Sans (ruled). Its serif is Liberation Serif,
a metric stand-in matched to the boards by eye; the boards' own serif is unnamed. It reads
right against the boards and is free to ship (SIL licence). Treat Liberation Serif as the
serif of record unless the owner names the face; the client currently pins Instrument Sans
and Instrument Serif, which the port replaces.

## 3. How the port works (the mechanism the client already has)

The client binds to its design of record by pin: `rebuild/m3/w7-preview/today/design.cjs`
holds the sha256 of each approved reference, copies the approved stylesheet into the page
byte for byte, and requires every class the page renders to be a selector in that
stylesheet and every static sentence to occur verbatim in the approved HTML. That is the
right mechanism here too. The port therefore is:

- `design.cjs` pins move to this pack: `app/app.css` + `app/states.css` +
  `app/states-workout.css` + `app/states-coach.css` become the pinned stylesheets;
  `app/app.html` (and the copy tables in the `states-*.js` files, exported to one
  `copy.json` by the build) become the approved HTML and copy; the two fonts and the scene
  assets are pinned by sha256 and inlined or served offline.
- `screens.template.html` is rebuilt to the prototype's markup, screen by screen, with the
  same class names and the same slots bound at runtime (nothing carries a number).
- The scene (plate, mist canvas, embers, grain, surface, chassis) is lifted from `app.js`
  and `app.css` as one module; the state driver is not shipped (it is a review tool), but
  the review hooks are: `?theme=ink|dawn`, `?screen=`, `?chrome=1`, `?date=board`,
  `?state=<ID>` on the preview build, so the same two gates run on the real client.
- Acceptance is mechanical: `quality/gate.py` and `quality/statesheet.py` pointed at the
  real client's preview build (set the environment variable `EARNED_APP` to its URL or
  `file://` path; the scripts default to the prototype) must come back with no FAIL, and
  every state must match the record committed for that state and theme.

### 3.1 The two comparisons, and what they will refuse

Both gates run the same way on Windows and on Linux: `python quality/gate.py` and
`python quality/statesheet.py` from this folder. Exit 0 is green, exit 1 means at least one
FAIL, exit 2 means the run refused (it says in one line which URL it was pointed at and what
was missing, and writes no green report). WARN is used by two checks only, the type scale and
the spacing scale, which STANDARD.md calls advisory in its own words.

**The screen comparison (`gate.py`).** Six renders, Ink and Dawn on the three screens, at
393x852 with the phone chrome drawn, against
`quality/baseline/<sys.platform>/<theme>-<screen>.png`. Baselines are per platform because a
render is a property of the machine: the same page drew 2.35% to 6.38% different pixels on the
owner's Windows PC and on the machine that set the first baselines. `ENV.txt` beside them
records the OS, Python, playwright and Chromium versions that drew them, and the launch list they
were drawn with, because a render is a property of the arguments as well as of the machine. The
tolerance:

> The gate fails a screen when more than 0.1% of its pixels differ from the baseline by more
> than 10 levels in any channel, or when the mean absolute shift exceeds 0.5 levels.

A missing baseline for the current platform is a FAIL that names the path and the remedy. It is
never set silently. The only way to write baselines is `python quality/gate.py --accept`, which
records each screen as SET rather than PASS and puts `ACCEPT RUN: regression compared nothing`
on the report's first line, so an accept run can never be read as evidence. `--accept` refuses
to run with `--screens` or `--sizes`, so a partial set cannot be written. The Linux baselines in
this pack were set on the builder's machine; the win32 set is written on the owner's PC.

**The state comparison (`statesheet.py`).** Every state, both themes, against
`quality/baseline/states/<ID>-<theme>.json` and `quality/baseline/states/<sys.platform>/<ID>-<theme>.png`.
The record holds every text bearing
element the athlete can actually see, in document order, with its own text, its rounded rect, its
computed colour, its first font family and its font size, then the visible text of those elements
in element order with whitespace normalised (element order, not reading order: a word wrapped in a
span sits beside its sentence rather than inside it, which the element list already catches),
and a 1/16 scale greyscale thumbnail of the render. The tolerance:

> A state fails when its visible text differs at all, when an element moves more than 3 px on
> any edge, when its colour moves more than 3 levels in any channel, when its font family
> changes or its size moves more than 0.5 px, or when its thumbnail mean absolute shift reaches
> 2.0 levels or 1% of the thumbnail pixels differ by more than 24 levels.

**The two halves of a record, and which of them is this machine's.** The JSON half (the text, the
rects, the colours, the families, the sizes) is one shared set, read on every platform. A rect is
not free of rasterisation: an element's width is the sum of the glyph advances the text stack
hands back, and headless Chromium on Linux hints glyphs by default, which snaps every advance to
a whole pixel. A line then comes out a few pixels wider or narrower than the same line on
Windows, on macOS or on a phone, and now and then it wraps on a different word. So every script
launches the browser with `quality/common.py`'s `LAUNCH_ARGS`, whose second argument turns
hinting off, and the advances are the font's own fractional ones on every machine.

Measured 2026-09-19 against the records this pack first committed, which a hinted Linux run had
written. The owner's Windows PC (Python 3.14.6, playwright 1.62.0, Chromium 151.0.7922.34) failed
254 of 418 renders: worst rect edge 170 px against a tolerance of 3 (T-84 ink, element 10,
"Nothing was recorded.", left) and worst thumbnail mean shift 3.53 of 2.00 (T-14 ink). A Linux
run launched with `LAUNCH_ARGS` failed the same 254 renders with the same 254 report lines, word
for word and number for number, its worst thumbnail 3.03. On Windows the argument changes
nothing: 372 PASS there against screen baselines drawn without it. That is the platform claim
this section used to make and the code did not implement.

The records were then written again by `--accept` on the owner's PC and judged by a full run in
the builder's Linux sandbox (Python 3.11.15, playwright 1.56.0, Chromium 141.0.7390.37), both
launched with `LAUNCH_ARGS`: 418 renders, the worst rect edge in the whole set moved 0.04 px of
the 3 allowed (W-05 ink, element 22, "Unsure", left) and every colour 0.00 levels of 3. The only two problems in the whole set were T-88 in each
theme, `targets: link 44x44`, which both machines reported in the same words: one real defect in
the prototype, taken up below. Two operating systems, two text stacks, two Chromium versions.
That is the claim measured rather than asserted.

The thumbnail half does not travel. It is a raster, and between those same two machines
rasterisation alone costs up to 1.26 levels of the 2.00 level budget (C-63 ink), which is most of
the headroom the 3 px rect tolerance needs: the shift `teeth.py` row h1 must PASS measures
1.66 of 2.00 at 3 px on the machine that drew the thumbnails, where review R2 measured 1.67
against the shared thumbnails this round replaced. h1 is a 2 px shift now, off that boundary. So thumbnails are filed per platform, at
`quality/baseline/states/<sys.platform>/<ID>-<theme>.png`, the way the screen baselines already
are, with an `ENV.txt` beside them in the form `gate.py` writes, the `launch:` line included. A
missing thumbnail for the current platform is a FAIL that names the path and the remedy, never a
silent set, and a missing shared record has its own line and its own remedy, so each names the
file that is actually absent.

A platform's thumbnails are drawn on that platform and never copied: a committed thumbnail that
is byte identical to the same named file under another platform's directory is a FAIL naming both
files. Not one of the committed pairs is byte identical, because every drawn state carries text
and two text stacks never rasterise text to the same bytes. What that guard does NOT catch: a set
honestly drawn on the wrong machine, or re-encoded, still fits inside the tolerance, because the
two committed sets differ by at most 1.26 of the 2.00 mean budget (0.85 on T-02) and by none of
the 1% over 24 levels; nothing reads an `ENV.txt`, which is documentation rather than a check; and
the detector that would notice is `teeth.py` row h1, which disagreed against the other platform's
thumbnails in this round's first hours. That is open question Q11 in the ticket's package.

**What the worst measured block's rows mean.** The first four are this platform against its own
records, and they are the tolerance. The rows marked advisory are this platform against the other
platforms' committed thumbnails, one pair of rows per platform directory: they are not a
tolerance, nothing fails on them, the exit code never sees them, and they print even when nothing
moved here. They exist so the cross platform raster distance is measured on every run rather than
computed by hand once, which is what review R3 had to do to find the 1.26. One more advisory line
says when the pack's `app/` no longer matches the digest the records were written against: the
index's `env` carries an `app` digest, the sha256 of the sorted lines "<path> <sha256>" for every
file under `app/`, written by `--accept`. It is advisory because a `teeth.py` row's whole job is
to change `app/` in a scratch copy, and the row that must PASS still has to exit 0. What pins the
records to the design of record is not that line: it is that a full run against the pack's own
prototype FAILs on any drawn difference, and that ticket S9 pins the whole pack by content.

**Why the JSON records sit outside the platform directories, and why win32 wrote them.** Because
they are platform independent and that is measured, not assumed: 418 renders, every rect edge
a worst edge of 0.04 px of 3 and every colour 0.00 of 3 across two operating systems, two text
stacks and two Chromium versions. Either machine could have written them; the owner's PC did, and the index says
so in its `env`.

`python quality/statesheet.py --accept` writes the shared records, the index and this platform's
thumbnails; it refuses `--only` and says on its first line that it compared nothing. Both accept
paths refuse to run with `EARNED_APP` set, because the records of record are drawn from the pack's
own prototype. `--only` matches a prefix, so `--only T-0` selects T-02 and every T-0x, and `--only T-4` selects
T-40 and T-40h alike; it narrows
the run and the index comparison with it while someone iterates, and only a full run is evidence.
`--accept-thumbs` is the tool for the second platform: it compares every render against the
shared record exactly as an ordinary run does and compares no thumbnail, then writes this
platform's thumbnails and `ENV.txt` only if every render came back clean, and otherwise writes
nothing at all, reports the problems and exits 1. It refuses `--only` and refuses to be combined
with `--accept`. Neither is evidence of a green run, and the first line of each says which it is:
an accept run compared nothing, an accept-thumbs run wrote half of every record it just judged.
Every run ends with a "worst measured" block, the largest thumbnail mean shift, rect move and
colour move it saw, each with the state and element that produced it, so a run on a second
machine reports its headroom in numbers rather than a bare verdict.

**The one line under `app/`, which the owner ratified.** The state sheet found a real defect in
the prototype while this was being settled. Laid out unhinted, which is how every real device lays
it out, T-88's Cancel link is 43.73 px wide by 44 px high, under the owner's standing rule that
every target is 44 px; hinted Linux had rounded it to 44, which is the only reason review R2 saw
the sheet green. The target line prints the failing number now, so that render reads
`targets: link 43.73x44` rather than `link 44x44`.

Ticket item 16 asks for the boards, and review R3 was right that a lane lead's ruling is not that.
The owner was asked on 2026-09-19 at about 08:55 ET, in these words: "On the 'Sleep correcting'
screen the Cancel link's tap area is 43.7 px wide, and your rule is 44 px. One line of CSS makes
it 44. Nothing you can see moves (0.3 px), and all 418 screens were re-checked with it. OK to make
that change?" The owner answered: "Yes, make it 44". The package's `locked` object records that
exchange.

So `app/app.css` line 202, the `.link` rule, carries `min-width: var(--hit);` beside its
`min-height: var(--hit);`. It widens that one box by 0.27 px and nothing either gate records
moves. That line is the only change under `app/` on this branch.

The run also compares the two lists of states. `--accept` writes
`quality/baseline/states/INDEX.json`, the ids and themes it recorded; an ordinary run reads it and
FAILs naming every id that is in the index and no longer in the build, and every id in the build
with no entry in the index. A state quietly dropped from a port is the case a port actually
produces, and without this the sheet would simply render one fewer screen and stay green. Under
`--only` the comparison is restricted to the ids the run selected, so a narrowed run still refuses
a state that has left the build. The index also carries an `env` object, the machine and the
launch list the shared records were written on; it is provenance and no comparison reads it.

The thumbnail is 1/16 and not 1/8 so that the two halves agree: at 1/8 a 3 px shift, which the
rect tolerance allows, already moves the thumbnail 3.5 levels. Contrast is measured on the
rendered screenshot in two tiers, on both gates, in the same words:

> Primary text needs 4.5:1 against what is actually behind it; muted text, a disabled control's
> label, the state colour where it is marking a state and text 24 px or larger need 3.0:1.

Text nobody can see is not measured and is not recorded: `display: none`, `visibility: hidden`,
an effective `opacity` of 0 walked up the ancestors, a rect with no area or wholly outside the
viewport, a `clip-path: inset()` that leaves no area, and a `text-indent` at or below minus 1000
px. That list names the mechanisms the gates check, not every way a line can be hidden. The
legacy `clip` property is not on it, and one place reads it: the touch target walk skips a box
that is positioned `absolute` or `fixed` AND clipped to nothing that way, because the pack hides
an assistive label at `app/app.css:150` with exactly that pair and nobody can aim a finger at it.
Both conditions are required, because `clip` has no effect on an element that is not positioned:
its computed value is still the declared rect while the box is drawn in full. That is the target walk alone. The record and the copy sweeps
still hold such an element, which is right: its text is read aloud, so it is interface copy.

The lower tier is read from the pack's own stylesheets, not guessed: the element's computed
colour equals the theme's `--muted`, `--faint` or `--gold` token, or it carries one of the
classes `app.css`, `states.css`, `states-workout.css` and `states-coach.css` paint muted (the
list and the line numbers are in `quality/common.py`), or it is a disabled control's label,
which STANDARD.md section 10 already calls a muted label. `--gold` is the one state colour
(STANDARD.md section 10), and it earns the label tier only where it is doing that job: the
element carries a marker or eyebrow class, or its text is shorter than 24 characters. Gold on a
paragraph is body copy and keeps 4.5:1. In Dawn the gold measures about 3.4:1 on the card, which
is above 3.0 and below 4.5; that is recorded as an open question in
`rebuild/lanes/c/ui-port/packages/C-UI-0.json` rather than changed here, because the Dawn token
is the boards' call. Text at `opacity: 0` or `visibility: hidden` is not measured at all: a
colour nobody is shown has no contrast to judge.

**Which check runs at which size.** Copy, the multiplication sign, the type scale, the radii,
the contrast, the face check, the page margin, the card inner edge, the icon inset, the
bottom safe area, the serif versus sans assignment, the touch targets, the primary in the first
viewport and the RIR lock run at 393x852, 375x812 and 360x780. The seam detector, the visual
regression, the three column checks, the spacing scale, the pressed states, the fit and the
thumb zone run at 393x852. The sha256 pin runs once for the build, not per size. The mist edge
checks run at 393x852 at three times scale. The CSS
transition and animation sweep runs under reduced motion at all three sizes and again with
motion allowed at 393x852, so a transition that is correctly disabled under reduced motion and
plays otherwise is still caught. The sweep reads each element and its `::before` and `::after`,
because a pseudo element moves as visibly as its host and the pack already draws with them. The motion check runs on every theme and screen with reduced
motion off (the embers hidden, nothing else may move) and on (nothing may move at all).

**The machines of record.** The win32 machine of record is the owner's PC and the linux one is
the sandbox image the builder runs in; each is described by the `ENV.txt` beside the baselines it
drew, down to the launch list. A CI workflow that runs the two gates on a hosted runner lives
outside this pack and can be added without touching it. Whether a runner's render matches these
baselines is a thing to measure when someone adds one, not a thing to assume: until it is
measured, a runner is not evidence, and the honest shapes are for it to set its own platform
directory or to run the checks that do not compare a render.

**What these checks sample rather than sweep.** Several of the standard's rules are held over a
named list and not over every element that could break them: the pressed state over three named
surfaces per screen, the radii over one corner of each named class with no pill measured, the
page margin over the named blocks and cards, and the contrast walk over the text of elements the
shared visibility test passes, which leaves out a single character, a box under 8 px on a side,
an input's own value, a placeholder and text drawn by `::before` or `::after`. STANDARD.md
section 13 names each sample beside its check. Widening any of them is ticket C-UI-GATES-2, which
also carries making `--accept` transactional and a permanent teeth row for the state sheet's
refusal branch. Until then the honest reading is the one written down: a green run says the
sample passed, not that nothing on the screen could break the rule.

**Two known limits of the accept path.** An accept run exits 0 when the checks beside it are
green, so an exit code alone does not say whether a baseline was written; and a full accept is
not transactional, so `gate.py --accept` and `statesheet.py --accept` write every baseline and
record they reach even when other checks failed in the same run. `--accept-thumbs` is the
exception and writes only when every render was clean. The rule that follows: a baseline or a
record is only ever accepted from a run whose ordinary twin was green.

**What a baseline does not carry.** Nothing checks that a platform's baselines were drawn by that
platform, by `--accept`, or from an unmutated tree; a hand written `quality/baseline/win32/` would
simply sit there unread on a Linux run. The guard is that an accept run labels its own report, that
no report is committed, and that a reviewer reads the baseline diff in the pull request.

**`quality/teeth.py`** keeps all of this honest: it copies the pack to a scratch directory,
applies one forbidden change at a time, runs the scratch copy's own gate against it and asserts
the exact refusal. Fifty five rows: every row of the audit's mutation table, plus a dropped RIR
chip, a serif element switched to sans and a card moved 6 px off the margin, plus the rows the
three review rounds added and the rows the PM's leads added. p1 takes the hinting argument out of
`LAUNCH_ARGS` and the state sheet must FAIL on a moved rect, judged on T-84 where that mutation
moves a rect 170 px; p3 runs the same mutation through the screen gate, which refuses far more
loudly. Headless Chromium hints only on Linux, so on Windows and macOS those two rows cannot fail,
and each is printed there with the reason in words and counted as expected rather than skipped in
silence. p2 deletes this platform's thumbnail for T-02, p4 copies another platform's over it, h1
and h3 hold the two sides of the 3 px rect tolerance at 2 px and 4 px, q1 to q6 are the PM's
leads (an unknown size, a listed word split by a soft hyphen, a horizontal bar and a hyphen
bullet, primary text tagged with a muted class and painted with the muted token, a state whose
apply throws, and `--accept` pointed at another build), q8 to q11 are review R4's and R5's (a
minus sign doing a dash's job, a spaced hyphen whose spaces are a tab and a no break space, a
visible target behind an inert clip, and a minus sign as a range and against a letter), and u1
to u9 are the second teeth audit's: a control positioned fixed that no walk could see, an
`inset(0 round 50%)` that insets nothing, a text indent read on an inline box, a fullwidth x in
a set string, "optional" written with a fullwidth letter, a primary pushed sideways, a primary
at opacity 0, an RIR chip at visibility hidden, and a right edge moved 6 px by two 3 px moves. It prints a table and exits 1 if any row slips through, and a
row whose anchor did not match is VOID, which is counted as disagreeing and never as a pass.

Rigor per LANES.md, screens tier: one independent Opus reviewer told to disagree (author is not
the reviewer), CI green on both OS, and the two gates green; the PM (Fable) judges. No ticket
self-accepts. The builder's cells pin every copy string they move.

## 4. What is LOCKED for every ticket

- Nothing under `rebuild/engine/`, `rebuild/m4/`, `rebuild/m3/w6/local/`, `rebuild/conform/`.
- No new numbers in markup; every value binds at runtime, as today.
- No dashes, no readiness words, no vendor names. Both gates sweep one string: the active
  screen's `innerText`, plus every visible element's `placeholder`, `aria-label`, `title` and
  `alt`, plus a filled in field's value, plus any quoted string in `::before` or `::after`
  generated content, including one an `attr()` resolves to. Interface copy the athlete reads or
  is read out loud is not all inside `innerText`, and a rule that stops at `innerText` has a hole
  the width of a placeholder. What the sweep cannot resolve is a `counter()` or `counters()`: the
  computed value still carries the call and the number on the screen is not available to the
  gate, so a check of its own, "generated content the sweep cannot read", FAILs on it rather than
  letting it pass unswept. On the swept string:
  every character of Unicode category Pd except the plain hyphen U+002D, and the two characters
  Unicode files under Po that draw the same stroke, U+2043 HYPHEN BULLET and U+2053 SWUNG DASH;
  a hyphen with a space each side, tested on a string in which every character Python's
  `str.isspace()` calls whitespace, except the newline characters that separate the lines of the
  swept string, has been folded to an ordinary space, plus U+2060: `fold_spaces` folds every
  character `str.isspace()` calls whitespace except the line feed and the carriage return, which
  is category Zs (U+00A0, U+2007, U+2009, U+202F, U+3000 and the rest), U+2028 and U+2029, the
  tab and the other control whitespace. The newlines are kept as they are so the minus sign rule can still read a line that
  holds nothing but the sign; every character of Unicode category Cf, named by its code
  point, because a soft hyphen or a zero width space inside a word is drawn as nothing and
  interface copy has no honest use for one; then, on the string with those removed, NFKC
  normalised and casefolded, each word of the owner's
  word list as `re.search(r'\b' + word + r'\b', text)` (a real word boundary, so "Ready
  to train" matches and "already" does not), and each vendor name as a plain substring. U+2212
  MINUS SIGN is filed as a maths symbol rather than as punctuation, so it is swept by a rule of
  its own: it fails unless it is the sign of a negative number, which means a digit directly
  follows it, the character directly before it is a space, the start of the line or an opening
  bracket, and the nearest character before it that is not a space is not a digit; or it is the
  whole of its own line in the swept string, which is a control whose entire label is the sign. A
  digit on each side is a range and a letter in front of it is a word, and both of those are a
  dash. The prototype draws exactly
  that on a set's decrement button (`app/states.js:113`, `app/states-workout.js:270`); sweeping
  the character flatly made the state sheet `418 renders, 2 with problems` on W-18 alone, which
  is the measurement that shaped the rule. The one sweep that matters most had been written `r'\\b'`, which is a literal
  backslash, and could never match; it is `quality/common.py:copy_problems` now, shared by both
  gates so it cannot be half fixed. The gate also refuses a set written with the letter x
  anywhere on the screen, not only in the Log label.
- The RIR picker values and what `logSet` stores (BRIEF-RIR-DISPLAY's lock stands). The gate
  asserts the five chips in order with their `data-rir` values and their labels, all visible.
- The two faces are pinned by sha256 of the bytes each `@font-face` rule actually points at, so
  repointing a face at the other file fails as loudly as replacing the file would.
- Existing tests stay green; `browser-check.mjs`'s dash sweep stays and gains the word-list and
  vendor-name sweeps from `quality/common.py` (the fixed form, never the old line).
- One layout per screen: a drawn state and the live behaviour must produce the same element
  in the same place (STANDARD.md section 11).
- `app/` is the fixed target the gates are proved against, and exactly one line of it changed
  while C-UI-0 was built: `app/app.css` line 202, the `.link` rule, gained
  `min-width: var(--hit);` beside its `min-height: var(--hit);`, because the state sheet, laid
  out the way every real device lays text out, measured T-88's Cancel link at 43.73 px wide
  against the owner's standing 44 px rule. The owner was asked on 2026-09-19 and answered "Yes,
  make it 44"; section 3.1 above quotes the question and the answer, and the package's `locked`
  object records them. Anything else a gate finds in the prototype is an open question in the
  ticket's package, not an edit.

## 5. The tickets (lane C, screens tier), in order

Each is written the way lane C briefs are written: why, design of record, what the build
may change, locked, acceptance, sequencing. The PM copies each into
`rebuild/lanes/c/ui-port/C-UI-n.md` and dispatches it.

### C-UI-1 · Design pins, fonts, scene module, review hooks
- WHY: everything else binds to this. Until the pins move, no screen can change.
- DESIGN OF RECORD: `rebuild/m1/approved-2026-09-18/` (this pack), `quality/STANDARD.md`.
- MAY CHANGE: `rebuild/m3/w7-preview/today/design.cjs` (the pins, the fonts, the inlined
  stylesheets: app.css, states.css, states-workout.css, states-coach.css), a new
  `scene.mjs` lifted from `app/app.js` (plate geometry incl. the Dawn crop, occlusion mask,
  mist, embers, grain, chassis scroll fades), `preview.css` (replaced by the pinned
  stylesheets), the preview build (`build.mjs`) to serve the assets offline and to honour
  the review hooks, `browser-check.mjs` (sweeps).
- LOCKED: section 4. The old 2026-09-08 pins stay in git history; nothing else moves yet.
- ACCEPTANCE: the preview build opens offline in both themes with the scene drawn and no
  console error; `quality/gate.py` pointed at it passes its scene, motion, copy and font
  checks (the layout checks come green screen by screen in the tickets below); the fonts
  are DM Sans and Liberation Serif by sha256; reduced motion draws one still frame.
- SEQUENCING: first. Pins move in this ticket only.

### C-UI-2 · Today, the face (T-02..T-41 without the proposal states)
- WHY: the first screen he sees every day; the chassis (ruling 4) lives here.
- DESIGN OF RECORD: `ref/ink-today-native.png`, `ref/dawn-today-native.png`;
  `app/app.html` `#screen-today`; states T-02..T-39, T-41 in `app/states-today.js`.
- MAY CHANGE: `screens.template.html` (`t-today`), `today-app.cjs` (bindings only: the
  slots keep their names; new slots for the status pill, the note block, the timeline
  markers), `checkin-*` only where Today's Recovery row binds.
- LOCKED: the weigh-in stays inline (ruling 5); the stack is Start, Recovery, Talk and nothing
  else; the greeting and status line copy comes from the inventory's verbatim list.
- ACCEPTANCE: gate green for `today` at 393 × 852 (fits, primary in the first viewport, thumb
  zone, columns, spacing, contrast); statesheet green for every T state the ticket covers,
  each within tolerance of the prototype's render; the day scrolls under a fixed stack on a
  long day with the fades as ruled.
- SEQUENCING: after C-UI-1. Parallel with C-UI-4.

### C-UI-3 · Today, the proposal card (T-40, T-40b..T-40h) and the weigh-in states (T-42..T-52)
- WHY: ruling 3 (the accept path) and the inline weigh-in; the card is how the engine talks.
- DESIGN OF RECORD: `app/app.html` `#card-proposal`; `proposal()` in `states-today.js`;
  inventory section 6 ruling 3; `states/TICKET-proposal-response.md`.
- MAY CHANGE: `t-today`'s proposal card markup and `today-app.cjs`'s proposal binding
  (kind, lift, change, reason, decisions, recorded line, "Change my answer"); the weigh-in
  card's refusal placement and field flag.
- LOCKED: "Applied" is never shown until the engine stores the answer (lane B ticket); until
  then the card stops at "recorded". No expiry. The bench card keeps "Use 105 / Keep 115"
  (bound, never literal).
- ACCEPTANCE: T-40 family and T-42..T-52 green and within tolerance; a tap on a decision
  records and "Change my answer" restores; the gold edge only while open.
- SEQUENCING: after C-UI-2.

### C-UI-4 · Inside the workout, the set and rest screens (W-05..W-29, W-32, W-42, W-43)
- WHY: the one-handed gym screen; Log never moves (ruling 4, 6).
- DESIGN OF RECORD: `ref/*-workout-native.png`; `#screen-workout` in `app/app.html`; W
  states in `app/states-workout.js`.
- MAY CHANGE: `screens.template.html` (the gym card), `gym-app.mjs`, `gym-model.mjs`
  (display and the refusal placement only: the effort answer is required, W-20's refusal
  flags the RIR row, W-19's refusal sits under the numerals; the rest screen repaints in
  place with Log at the same edge).
- LOCKED: BRIEF-RIR-DISPLAY's locks; "Skip this set" is gone (ruling 6); no rest timer.
- ACCEPTANCE: gate green for `workout` (Log centre ≥ 70% of the height; label uses ×);
  statesheet green for the W states covered; a live tap on Log without an effort answer
  inserts the same element the drawn W-20 shows, and Log does not move.
- SEQUENCING: after C-UI-1. Parallel with C-UI-2.

### C-UI-5 · Workout panels: the stubs and the machine settings editor (W-01..W-04, W-30, W-31, W-33..W-41, W-44)
- WHY: every sub screen is a chassis with its action group at the parent's thumb edge (716).
- DESIGN OF RECORD: `panel()` in `app/states.js`, `states.css` (the panel chassis), the W
  panel states.
- MAY CHANGE: `machine-settings-view.mjs`, `machine-settings-host.mjs`, the gym stubs in
  `gym-app.mjs`.
- LOCKED: the editor's validation sentences are the inventory's verbatim (W-38..W-40).
- ACCEPTANCE: statesheet green for the states covered; the action group's bottom edge at 716
  in every panel; a malformed pair is drawn malformed with the field flagged (W-39).
- SEQUENCING: after C-UI-4.

### C-UI-6 · Coach, the structural states (C-02..C-09, C-35, C-38..C-40, C-43..C-65)
- WHY: the conversation view does not exist yet; ruling 2 designed its structure now.
- DESIGN OF RECORD: `ref/*-coach-native.png`; `#screen-coach`; `app/states-coach.js`;
  `rebuild/coach/COACH-EXPERIENCE-BRIEF.md` and `BRIEF-C6-VOICE-ONBOARDING.md` for
  behaviour; the coach's answer variants are copy on one card (C-10..C-37, C-41, C-42).
- MAY CHANGE: the coach stub in `today-app.cjs` becomes the coach screen; a new
  `coach-app.mjs` in `rebuild/m3/w7-preview/today/` for the view (the tool contract and
  `coach-text.cjs` are untouched); the orb, the mic, text mode, tap mode, the mic-off
  treatment, the answer card, the refusal card, the confirm row, the proposal card (the
  same component as Today's).
- LOCKED: no live adapter, no network, no audio in this lane (`tools.cjs` header); the
  "Answering" pill goes dark once a card is on screen; nothing is written until the athlete
  says yes (tier 1) and nothing changes until yes (tier 2).
- ACCEPTANCE: gate green for `coach`; statesheet green for the C states; the mic at 657 to
  770 in every state that shows it; in text and tap modes the stack shrinks and the input or
  links stay at the bottom edge.
- SEQUENCING: after C-UI-1; may start in parallel with C-UI-5.

### C-UI-7 · The entries: nutrition (T-58..T-71), sleep (T-72..T-95), Why this plan (T-53..T-57)
- WHY: the 43 sub screens behind Today; each a chassis with actions at 695.
- DESIGN OF RECORD: the T panel states; `panel()`; the entries' verbatim copy (inventory 4.1:
  "Calories eaten", "Protein eaten", "How do you want to record it?", the refusals).
- MAY CHANGE: `food-*`, `reading-host.mjs`, the sleep entry, the Why this plan view in
  `today-app.cjs`.
- LOCKED: sleep nights are dormant on the tip (inventory question 10 still open): draw the
  entry in full, wire what the tip can write.
- ACCEPTANCE: statesheet green for T-53..T-95; every refusal under the field it names with
  the field flagged; the action group at 695; long panels scroll with the fades.
- SEQUENCING: after C-UI-3.

### C-UI-8 · Seal: the PWA shell and the slice deploy
- WHY: the owner reviews on his phone at arm's length, from the slice.
- MAY CHANGE: `rebuild/slice/pwa/*` (shell, service worker asset list for the plates,
  fonts, mist, grain), `DEPLOYS.md`.
- ACCEPTANCE: both gates green on the deployed slice URL in both themes; offline launch
  with the scene; reduced motion still; the owner's phone screenshot matches the board.
- SEQUENCING: last.

## 6. What still needs the owner (only when a builder hits it)

- Inventory question 3: "Ask your coach" (code) vs "Talk to Earned" (briefs): which wording
  is of record for the Today entry? The prototype uses "Talk through today's plan" (the
  board's words). Default: the board.
- Question 7: a set-edit control on the gym card (the coach can correct a set; the card
  cannot). Default: not in this port.
- Question 8: the weigh-in correction path. Default: not in this port.
- Question 9: the Measure tile and the build footer. Default: hidden on the athlete's build.
- Question 10: sleep entry scope while sleep nights are dormant. Default: draw in full, wire
  what the tip can write.
- The serif (section 2 note). Default: Liberation Serif.

The PM proceeds on the defaults and asks only if a builder cannot.

## 7. How the owner sees progress

He reads one place: the PM chat's PROGRESS footer. Each ticket reports BRIEF-READY,
PR-READY (with the reviewer's file), SEALED, and the slice URL at C-UI-8. He is shown the
phone-zoom sheet of a ticket's screens once, at PR-READY, and answers only if he disagrees.

The sheet is `python quality/phonesheet.py`, which runs on Windows and on Linux (its labels use
whichever face the machine has, and the built in face when it has none). With no argument it
draws the three base screens in both themes, cut into thirds at three times scale. With
`--state T-40` it draws that drawn state instead, on the screen the state driver files it
under, so a ticket that only changes states still has a sheet: `python quality/phonesheet.py
--state T-40,W-20,C-05` draws one sheet per state plus the combined `phonesheet-all.png`. It
refuses in one line, exit 2, if the build it is pointed at carries no screen or no state
driver.
