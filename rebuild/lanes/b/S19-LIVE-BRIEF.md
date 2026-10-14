# S19 LIVE - brief (M2-S19-LIVE)

Package: M2-S19-LIVE, an UNSEALED `--ci` child of the SEALED M2-S14-HOLD (artifact
rebuild/m4/spec/acceptance-s14-hold.json, receipt DECISIONS:932), the S12/S13/S15/S16/S17/S18 shape, on the
branch rebuild/c-live. It carries every byte M2-S18-OPENED declared, the CI and deploy change below, two
small product nits from UI check 6 and Coach v1 (the owner's "No-AI coach first", amended in place). It moves
one rebuild/engine file, energy.cjs (E1's floor fix and E2b, the owner's rulings DECISIONS:982 and :999), and declares
one gate supersession, GATE-SUPERSESSION M2-S19-LIVE (DECISIONS:1004, restating :989; E2b below); it declares no D-id; no seal, receipt
or VERDICT; the coach ENGINE_REVISION stays M2-S14-HOLD's.

## Why a new id, and why it is the last one for a while (PM ruling, 2026-10-12)
M2-S18-OPENED is released onto rebuild/t2-client-core (DECISIONS:957), so a later diff no longer adds packages/S18.json at
status A and the sealed-inventory fence would fence it as an ordinary branch (its F3 rule, row (8g)). S18 is
retired by supersession in the usual shape: S18.json stays as the record with its claim withdrawn (decided
false, chosen null, a note); 'S18' leaves b-package.cjs IDS and NO_REGISTER_IDS and 'S19' enters both (F6
pins moved red first); CHILD_SPECS in the five reading cells gain 'S19'; S19-REGEN and its test are the port
of S18-REGEN's; rebuild.yml's standing step runs `--package S19` and gains the S19-REGEN.test step.
S18-REGEN is dead.
S19 is the ROLLING child. From here on every later round amends S19 IN PLACE, on lanes branched from
rebuild/c-live: S19-REGEN re-measures packages/S19.json, and a new BRIEF ACCEPTED BY SHA line is written only
when this brief changes. There is no further per-release supersession. rebuild/c-live merges into the chain
only at milestones.

## The change: the waiting is cut, and the phone follows rebuild/c-live
- The package step runs beside the suites. rebuild.yml's one job `public-gates` ran the cumulative
  `b-package.cjs --ci` step and every other step in sequence (run 38266944642: 2452 s on windows, of which
  the package step 1238 s; 1657 s on ubuntu, 839 s). The package step now runs in its own job,
  `package-gates` ("rebuild-package (<os>)"), on the same two-OS matrix, with the same env and timeout and
  the same setup (checkout with full history, Node 22 with the npm cache, npm ci, pnpm 9, the frozen W6 and
  W5 installs); its name, argv and whole comment history move with it. `public-gates` keeps every other step,
  in its order, with every `if: ${{ !cancelled() }}` in place. Nothing is dropped: 46 of the old job's 47
  steps are present and equal as YAML, and the 47th is the standing step, whose name and `--package` id move
  S18 -> S19 as at every supersession. The one behaviour that moves: a `public-gates` step with no `if:`
  is no longer skipped when the package step fails, because it is no longer behind it; those steps run more,
  never less. Expected wall time: the longer of the two jobs, about the package step plus setup (roughly 23
  minutes on windows instead of 41, 15 instead of 28 on ubuntu).
- The pnpm content store is cached in both jobs, per OS and per pair of lockfiles (actions/cache). Both
  installs stay `--frozen-lockfile`, so the cache can supply only bytes the lockfiles already pin.
- The fence row. P-S9-5 (rebuild/lanes/c/ui-port/sealed-inventory-fence.test.mjs) required `public-gates`
  and `font-transport` to run on exactly ubuntu-latest and windows-latest. It now requires the job keys of
  rebuild.yml to be EXACTLY `font-transport`, `package-gates` and `public-gates`, each on both systems: the
  set is closed, so no step can sit in a job the row does not hold to both, and a job added later fails the
  row until it is named on purpose. Red on the S18 workflow, green on this one.
- The phone. slice-host.yml deploys on a push to rebuild/t2-client-core OR rebuild/c-live (the same site;
  c-live is the branch deployed from day to day); its paths, its refusal on main, its two-secret no-op and its
  two refusals of the frozen app's and the soak experiment's sites are unchanged. workflow.test.cjs's trigger
  row now requires exactly those two branches (and still no pull_request and never main), and the no-op line
  names both. Not changed: deploy.yml, soak.yml, the build, the folder or its checks.
- The scope. S19-REGEN's SCOPE keeps S18-REGEN's entries and adds four exact files: this helper and its test,
  .github/workflows/slice-host.yml and rebuild/slice/pwa/test/workflow.test.cjs, so S19.json declares the
  deploy trigger it moves; a sibling (deploy.yml, another slice file) stays outside and is refused by name.
- Admin, not in the tree: if branch protection lists required checks, "rebuild-package (ubuntu-latest)" and
  "rebuild-package (windows-latest)" have to be added there, or a failed package step would not block a merge.

## Two product nits from UI check 6 (PM, 2026-10-12)
- The heading of an adoption offer states the weight it sets: "Plank: make 25 lb your working weight" (PM-approved
  copy), from the offer's own loads when every set carries the same one (today-entry.mjs offerHeading; the lift name
  and the weight are data between the two new pieces ": make " and " your working weight"). An adoption whose sets
  differ, or hold no weight, keeps the approved ": set your working weight". The earned-weight heading ": next weight"
  and the undo heading are unchanged: the approved words "make ... your working weight" would misstate an earned
  weight, which is queued and becomes the working weight only when its debut is completed. No engine string moves:
  the heading is the page's copy, not native-load.cjs's. Copy lock: CL-S15-DELTA 44 -> 46, corpus re-measured.
- On an offer card "Not now" wrapped alone onto a second row under Why? and Yes: the C-UI-3 decision-button rule
  drew Why? as a third button in the card's two-column grid, outranking S18's quiet rule. preview.css S19 block: Why?
  takes a whole row as the quiet control S18 meant (no pill, the hit height kept), above the reason it opens, and Yes
  and Not now share the row below.

## Coach v1 (owner ruling 2026-10-12, DECISIONS:963: "No-AI coach first")
- The Coach screen answers on the device. Its tap-to-ask questions run the coach's existing tested tools
  (rebuild/coach) over the page's own Today model, gym card and check-in: "What am I hitting today?" (today_plan),
  "Why this weight?" (current_set), "What did I do last time?" (last_comparable_performance), "How is my weight
  going?" (weight_trend), "What did I say in my check in?" (today_checkin). One tap is one turn. The answer is the
  coach's template filled from that turn's tool results, and coach-intents.cjs ask() discards any sentence that
  carries a number the turn's results do not hold or a phrase the charter forbids; the screen then says "I cannot
  answer that from what the app holds." A question no open lane can answer is a refusal in the tool's own words.
  The board's example pill is hidden on the live screen; a review state (window.earnedStates) still paints the
  pack's own board.
- The free-text box and the mic stay and say "Typed and spoken questions come later. Tap a question above." with
  "Nothing changed."; nothing listens and nothing is fetched (no network, no microphone; the coach tests' bans stand).
- The Coach entry is back on Today (reversing DECISIONS:915 (3)): one quiet link after the trend link, below the
  workout, in the board's own Talk row words "Talk through today's plan" (typographic apostrophe, design.cjs
  APPROVED_COPY). The Talk row's second line and its marker stay off Today.
- The tool layer is the adapter seam. rebuild/coach/coach-intents.cjs holds the templates (moved byte for byte out
  of coach-text.cjs and wave1-text.cjs, which re-export them) and the page intents; rebuild/coach/page-coach.cjs is
  the page's one edge, ask(intent) over createWave1Tools, and hands out no dispatcher. A later model adapter calls the
  same createWave1Tools dispatcher and is held to the same untraceable() check.
- The page carries the coach's READS and none of its writers. tools.cjs's kernel (tags, traceability, charter,
  envelopes) and its seven TIER.READ tools moved byte for byte to rebuild/coach/tool-kernel.cjs and read-tools.cjs;
  tools.cjs re-exports every name it had (the same objects) and keeps the FACT and PROPOSAL tools, the cost cap and
  the opt-in. page-coach.cjs composes read-tools.cjs, never tools.cjs, so the consent path's respond and
  engine-revision.cjs stay off the Today boot graph (page-bundle P3-B4, writer-enumeration P3-EN3), and it hands the
  tools read-only wrappers of the Today model, gym card and check-in carrying only the reads those tools call, with
  no writer reachable (Fable D1). tools.cjs takes its one digest (a proposal id, the same value as before) through
  rebuild/coach/sha256.cjs, a byte-for-byte copy of rebuild/client/index.cjs's own, so it has no Node import.
- Not in v1: the machine seat question. The gym card keeps machine settings in its own sealed lane and the writer
  fence refuses a released edge to machine-settings-host.mjs, so machine_seat (tested in the tool layer) waits for a
  sealed read of that lane. The weekly review card (scope item 2) is the next piece.
- New strings (PM-approved short plain copy; design.cjs COACH_LIVE_APPROVED, held exactly and both ways by
  assertCoachLiveBinding): "Why this weight?", "What did I do last time?", "How is my weight going?", "What did I say
  in my check in?", "Typed and spoken questions come later. Tap a question above." Reused from the approved pack
  (COACH_COPY): "What am I hitting today?", "You asked: ", "From this device's encrypted local store.", "I cannot
  answer that from what the app holds."; from the board: "Talk through today's plan". The new binding's three
  refusal lines (COACH-LIVE-BINDING FAIL) are developer text.
- Re-measured, each said where it stands: the copy lock (CL-COACH-V1-DELTA lists the pieces above with their owners
  and lists and four existing pieces whose counts or owners move; beforeCoachV1 rebuilds the S19 corpus byte for
  byte, so the older deltas judge what they judged; corpus fadf6140... -> e61da75a...); the writer fence
  (today-app.cjs gains the edge require:../../../coach/page-coach.cjs; FENCE-MODEL-HELD 33 -> 34, the coach's
  world); package.test.cjs H18b/H18c, build.mjs REQUIRED_INPUTS 54 -> 59 path literals (the five rebuild/coach
  inputs page-coach, read-tools, tool-kernel, wave1-tools and coach-intents; the today/ half stays 32);
  page-bundle.test.mjs P3-B2 157 -> 162 and P3-B5 36 -> 41 (the same five, all boot; the route-only set unmoved at
  19), measured on the esbuild graph with every protected file held external on both sides (154 -> 159).
  view.test.mjs's unwired-entry cell pinned the board's "There is no live coach in this build." on the Coach
  screen; the coach is wired now, so the cell holds that a tapped question is answered and the screen says neither
  that nor "not wired yet", the way it holds the wired check-in.
- Outside S19-REGEN's SCOPE, as public-client.mjs was in S18 (only rebuild/coach/NATIVE-LOAD-SPEC.md is in it):
  rebuild/coach tools.cjs, coach-text.cjs, wave1-text.cjs, wave1-tools.cjs, the new coach-intents.cjs,
  page-coach.cjs, read-tools.cjs, tool-kernel.cjs and sha256.cjs, and the coach tests (new coach-intents, page-coach
  and sha256; file lists in no-dashes, cost-cap and wave1-demo).

## Coach v1, piece 2: the weekly review (PM ruling 2026-10-12, option A)
- On the first day of a training week (the engine's Monday) Today shows the review of the week just ended, below the
  workout and the proposal card, in the proposal card's own look; the Coach screen's sixth question, "How did my week
  go?", answers it any day (this week so far; on a Monday, the week just ended). It shows the workouts done against
  the workouts planned, each lift that finished a workout in the week, the open suggestion on Today and the trend.
- Each lift: an offer of a new weight says "ready for a new weight." with the engine's own offer reason behind Why?
  (native-load.cjs earnReason / adoptReason, unedited); a lift the engine does not raise says one plain sentence for
  its refusal code, each true to the line of rebuild/engine/native-load.cjs that raises it: TARGET_QUEUED (:232)
  "going up. The new weight you agreed to starts on a later workout."; DEBUT_LANDED (:235) "went up. This was your
  first workout at the new weight."; PROVISIONAL (:326, :368) "not raised yet. Not enough workouts yet to judge a
  change."; WINDOW_NOT_TOP (:327) "not raised yet. You have not reached the top of your rep range at this weight.";
  HELD_OR_HOT (:359, :367) "held. Your first set was taken to failure, or this weight is on hold, so it stays where it
  is."; NO_NEXT_LOAD (:366) "not raised. There is no heavier weight on file for this lift."; EFFORT_UNRESOLVED (:329)
  "not raised. The first set has no effort rating to judge from."; BODYWEIGHT_NO_WEIGHT (:281) the approved S14 R4
  line, word for word. Any other code says "no new weight from its latest workout.", which names no cause. A held
  lift (today-entry.mjs noticesOf) says "held. A workout behind your agreed weight was corrected, so this lift is
  paused." (disputed) or "held. Your working weight changed after you agreed to a new one, so this lift is paused."
  (conflict): plain rewrites of the two PROPOSED notices, used on the review only; today-entry.mjs's own notice
  strings are unchanged.
- Numbers only from tool results: ONE new READ tool, week_review (read-tools.cjs; tools.cjs unchanged), read in one
  turn with the trend it carries; coach-intents.cjs ask() checks every line and every reason, and the card is drawn
  only for a shipped, answered turn, each line through the page's no-dash boundary. A count is tagged "?" and said
  bare ("Workouts done: 3 of 4.", tool-kernel.cjs BARE_SPEAKABLE). No workout record, no review (the tool refuses in
  its own words and Today is unchanged); no lift read, "Your lifts could not be checked on this device."
- The smallest read seams, read wrappers only: today-model.cjs plannedDays(from, to) (the days engine
  sessionMembership plans a workout on); gym-model.mjs weekSessions(from, to) (the card's closed sessions in the
  window); today-entry.mjs weekLifts(from, to) on the next-weight controller (the same host's project() and check(),
  kept as data, no handle kept, nothing painted or answered). page-coach.cjs hands the tools those three reads and
  nothing else. No sealed host file moves: today-bindings.mjs is unchanged. today-entry.mjs is PAGE_PINS-pinned, so
  local-today-journey.test.mjs re-pins it, measured: dac88dd5 -> fbdcd96a.
- Page laws: no new module and no new edge; the esbuild graph (protected files held external) is the same 159 inputs
  as 9fb60ed, the route-only set unchanged, and P3-EN3's pattern reads only its known calls; the writer fence is
  unchanged and green (FENCE-MODEL-HELD stays 34). page-bundle P3-B2/B5 and REQUIRED_INPUTS do not move.
- New strings (PM-approved short plain copy, :913 (5)): "How did my week go?" (coach-app.mjs COACH_LIVE_COPY, bound by
  design.cjs COACH_LIVE_APPROVED; copy lock one more piece, corpus e61da75a -> 60411337); in coach-intents.cjs: "This
  week", "Last week", "Workouts done: ", " of ", "ready for a new weight.", "No lift finished a workout in this week.",
  "Your lifts could not be checked on this device.", "Suggestion waiting on Today: ", "No workout record is open on
  this device, so there is no week to review." (read-tools.cjs), the eight code sentences, the two hold sentences
  and the fallback above. "Why?" is the S18 word.

## Coach v1 polish (PM polish batch 2026-10-12, ui-pass7 shots 01 to 10)
- The weekly review is its own card in the Today feed, a sibling of the workout card right after it (never inside it,
  where the timeline line ran through it): the proposal card's look (tcard proposal, the feed's dot), headed "Last
  week" by the head's kind, its lines in the body text colour (the 09-08 .change green failed contrast), Why? a quiet
  control on a row of its own that opens the engine's reason inline beneath it. The bodyweight paragraph is gone: one
  short line, "Trend weight: <n> lb.", when the device holds a trend weight, and none without one.
- The Coach entry is a compact row in the feed after the food card, in its row look (tcard nav, dot, chevron), one
  line "Ask Coach" (preview-owned, design.cjs PREVIEW_COPY), so it sits above Start and nothing sits under Start. The
  board's Talk row words left Today with the old link (no longer in APPROVED_COPY); the Coach screen keeps its own
  "Talk through today's plan.".
- The live Coach screen is tap to ask only: its stack (the text box, "Use text mode", "I'll tap instead" and the mic)
  is hidden until a model coach exists, so the six questions and the answer have the screen; the questions carry no
  icon (the pack's one calendar said nothing about five of them). A review state still paints the pack's board.
- Plain answers. No engine code or engine shorthand reaches the screen: each page answer is built from the turn's
  tool values, one item per line, and a tool's refusal is said as the question's own plain sentence, never in the
  tool's or the engine's words. "What am I hitting today?" names the workout ("Today: Upper body.") and each
  exercise's set target ("<lift>: 3 sets of 10 reps at 100 lb.", uneven reps listed, a setting or bodyweight said as
  such, "<lift>: first time, find your weight." when the engine asks for a first weight), then the calorie band and
  the protein target only when the engine holds them; no marching order. "Why this weight?" is one plain line per
  exercise (first time: "Pick a weight you can control for about <top> reps; what you log becomes your starting
  point."; working weight, new weight, held, setting, bodyweight). "What did I do last time?" says "No earlier
  session of <lift> yet." as an answer, with the source line, or "<lift>. Last time: ...". The check-in names each
  core question left blank ("You left sleep blank.") and says "You have not checked in today." with nothing
  recorded. "How did my week go?" is one line per item. The number check is unchanged: ask() still discards a draft
  with any number its turn's tool results do not hold.
- One new READ seam and tool: today-model.cjs sessionPlan() (rebuild/engine/today.cjs genSession's own session name
  and cards, with the lift's hold flag and top of range from the replayed state; reads only) and read-tools.cjs
  today_session (tools.cjs unchanged); page-coach.cjs READS.today gains sessionPlan, and no writer is reachable (PC-5).
  A page question may read more than one tool, each a READ (today_plan reads today_session and today_plan; last_time
  reads current_set and last_comparable_performance).
- Safe area: a scrolled body's top fade now starts at the foot of the 47 px status band (or the device's own safe
  area when taller), so a heading or card line scrolled up never reads through the status bar (preview.css).
- New strings (PM-approved short plain copy, :913 (5)): "Ask Coach"; in coach-intents.cjs PLAIN, PLAIN_REFUSALS and
  WEEK_WORDS.trend "Trend weight: ", every sentence part above, the session names "Upper body" and "Lower body", and
  the refusals "Today's workout could not be prepared on this device.", "There is no workout open right now, so there
  is no lift to look back on.", "Your check-in could not be read on this device.", "No machine settings are kept for
  this lift yet.", "Your weight could not be read on this device." (the week refusal is piece 2's sentence).
- Red first: coach-intents.test.cjs CI-6 (each plain answer, word for word, over a session with every kind of card),
  CI-7 (over five worlds built to carry every engine code and engine phrase the tools can see, no page answer holds a
  code string, DEBUT, "baseline ask", "IS the line", "qualified comparable", "never none", "never zero", "engine",
  "RIR" or "governor") and CI-8 (no figure or dash in the plain words; the check-in's core labels are checkin-model's)
  fail on d664fdd's sources and pass on these, as do CI-2, CI-3, page-coach.test.cjs PC-2, PC-3, PC-5, PC-7 and PC-9
  (10 of 17 red there), coach.test.mjs CV1-1, CV1-3, CV1-5, CV1-8 and look-cui2's entry cell (5 of 25 red there;
  CV1-2, asked on the page and again through the tools, passes on both). The copy lock re-measured for exactly the
  polish delta (CL-COACH-POLISH-DELTA: "Ask Coach" in, the Talk row words out, "tcard proposal" today-app.cjs 1 -> 2;
  beforePolish rebuilds the piece 2 corpus byte for byte; corpus 60411337 -> 218da3dc). Seat-only: view.test.mjs
  SC-5 (the plan's figures are the Today model's and the session's own; the stack is hidden).
- At the builder seat: the today batch 630/651 (628/649 plus the two polish copy-lock rows, the same 21 seat-only
  build failures), the fences batch 2195/2197, the coach suite 394/394 without the seat-only engine-revision-gap file,
  the writer fence 404/404 (no edge, model count or binding moves), the 76 layout invariants and the deployed-shell
  probe (24 of 24) unchanged, and a Chromium probe of the live Coach screen at 390x844 and 430x932 (six questions, no
  icon, no stack, answers one item per line, the scrolled top fade from the status band's foot) 42 of 42.

## Coach v1, batch 2 (PM 2026-10-12, on 0ccc74d, rebuild/c-coach2)
- "What did I do last time?" covers every lift of today's workout, one line each, in the workout's order: "<lift>:
  last time 200 lb for 10, 10, 9 reps." (each set's weight when they differ), or "No earlier session of <lift> yet.";
  on a day with no workout, "No workout is planned today, so there is no lift to look back on." The sets are the gym
  card's own: gym-model.mjs lastTimes() reads card.prev off the same genSession call the card's "Last time" line reads,
  position by position through the same previousAt (original sets only, pounds only, the first hole ends the line). One
  new READ tool, last_times (read-tools.cjs; tools.cjs unchanged), and page-coach.cjs READS.gym gains lastTimes only.
- "Why this weight?" says each reason once: lifts whose reasons read the same share one line, named in the workout's
  order ("Plank, Leg press, Nordic curl: first time. Pick a weight you can control for about 10 reps; what you log
  becomes your starting point."); a different top of range or weight keeps its own line.
- Today's quiet links (Sleep, the trend link, Report a problem, Measure, Import my history, Change my routine) take the
  pack's protective cloud for a tertiary link over the art (app.css .links .link::before, the same shape, a little
  denser) and --text-soft, their quiet markers too; Today's bottom fade runs only in the band under the stack's edge,
  so no link above Start is drawn faded. Measured at the builder seat in Chromium (a foot probe over measure17's Today
  at 390x844 and 430x932, top and end of the scroll: each link's words against the brightest 5% of the pixels behind
  them): 34 of 40 on 0ccc74d (two links faded, four under 4.5:1, the lowest 3.33:1), 40 of 40 on this tree (the lowest
  4.77:1).
- The weekly card's Why? says the offer in plain words, from the offer's own facts (its kind, its day and its target and
  base weights, which today-entry.mjs weekLifts now carries beside the engine's reason): adopt-baseline "You did every
  set at 40 lb on Oct 6. Make 40 lb your working weight? This sets your starting point; it is not an increase. Nothing
  changes unless you say yes."; adopt-observed "... This sets your working weight to what you lifted; it is not an
  earned increase. Nothing changes unless you say yes."; earn "You reached the top of your rep range at 140 lb on Oct 1.
  Make 145 lb your working weight? Nothing changes unless you say yes; it then applies on a later workout."; weights
  that differ by set, or are not in pounds: "Your last workout here earned a new weight. Nothing changes unless you say
  yes." The day is said at the end of its clause ("... at 40 lb on Oct 6.") rather than first as in the PM's example,
  because the number check reads a figure by the words beside it: "On Oct 6 you did" would read 6 as a count of "you"
  and discard the line, and the check is not loosened. Every figure is a tool result of the turn (week_review tags the
  day as the text "Oct 6" and each weight "lb" only when every set carries it).
- Not built: "Where's my seat set?" (item 5). The machine settings live in the store only the sealed gym lane
  (gym-settings-lane.mjs) opens, lazily, while the workout card is mounted; the writer fence refuses any other module an
  edge to machine-settings-host.mjs and the page may not open that store a second time. A read for the Coach screen
  needs a sealed-file change or a ruling; the options are with the PM.
- New strings (PM-approved short plain copy, :913 (5)): coach-intents.cjs WEEK_WHY (the sentence parts above),
  PLAIN.noWorkoutLast, PLAIN.lastTime ": last time ", PLAIN.lbFor " lb for " (PLAIN.lastTime ". " is gone). No page
  string moves: the copy lock re-measures to the same corpus, 218da3dc.
- Pins, measured: PAGE_PINS today-entry.mjs fbdcd96a -> 2387a971 (local-today-journey.test.mjs; the one hunk in
  weekLifts). s12-look 72 -> 73 (look-cui2's new quiet-links cell). No page module or edge is added; the writer fence's
  edges, model count and bindings do not move.
- Red first: on 0ccc74d's sources (coach-intents.cjs, read-tools.cjs, page-coach.cjs, gym-model.mjs, today-entry.mjs,
  preview.css) 8 of 45 rows fail and pass on these: coach-intents.test.cjs CI-6 (every lift's last time), CI-9 (shared
  reasons share a line) and CI-10 (the plain Why?, every figure through the number check, and a planted day the turn
  did not read is discarded); page-coach.test.cjs PC-5 and PC-7; coach.test.mjs CV1-3 and CV1-8; look-cui2's
  quiet-links cell.
- At the builder seat: the today batch 631/652 (630/651 plus look-cui2's quiet-links cell, the same 21 seat-only build
  failures), the fences batch 2195/2197 (the writer fence in it unchanged), the coach suite 396/396 without the
  seat-only engine-revision-gap file, the 76 layout invariants and the deployed-shell probe (24 of 24) unchanged, the
  live Coach screen probe 42 of 42 over the real booted page (its last-time answer now one line per lift), and the
  foot probe 40 of 40.

## Coach v1, the seat read (PM ruling 2026-10-12, option A; on 11262f8, rebuild/c-seat)
DECLARING SPEC for the one change to a sealed module this amend makes. The sealed gym lane,
rebuild/m3/w7-preview/today/gym-settings-lane.mjs, gains exactly one read and nothing else:
- One store handle. The machine-settings store is opened in exactly one place in the lane, openSharedHost (one
  dynamic import of ./machine-settings-host.mjs, one createMachineSettingsHost call), keyed by the device's IndexedDB
  factory and the day. The lane's own open (openSettingsLane) goes through it, and so does the read below, so the
  store is never opened a second time on a page: a second card mounted on the page, or the Coach, reuses the handle
  the first opened. If the card has not mounted, the read opens it lazily, by the same function, and the card then
  reuses it. An open that fails is forgotten, so a later ask may try again. Nothing in the open writes beyond what the
  lane's own open already did.
- One read. export async function readSavedSettings(view, day, liftIds): for each lift id, the host's own read,
  latest(), and nothing else; it returns frozen detached rows { ok, rows: [{ lift, latest }] } and never the handle.
  It is the lane's fourth export (machineFromDraft, acceptable and createGymSettingsLane are unchanged, and so is the
  default export).
- One edge. Exactly one module outside the card's own pair (gym-app.mjs, machine-settings-view.mjs) imports the lane:
  today-entry.mjs, which imports readSavedSettings and nothing else, and hands the workout lane one accessor,
  seatSettings(view, liftIds). today-app.cjs gives the coach that accessor over the page's own window (doc.defaultView,
  the store the lane itself opens); page-coach.cjs READS gains seats: ["read"]; read-tools.cjs gains one READ tool,
  seat_settings (tools.cjs unchanged). No writer gains reach: the lane's writers, its frozen interfaces, its api.lane
  mapping, its listeners and every released file's writers, edges and bindings are unchanged.
- The writer fence admits exactly that and nothing wider (rebuild/lanes/c/today-split/writer-fence.test.mjs):
  FENCE-SEAT-READ holds the lane's shape (its four named exports and its unchanged default export, one
  createMachineSettingsHost call, one dynamic host import, three openSharedHost spellings: its definition, the lane's
  open and the read; inside the read the handle is declared, assigned and used by .latest( only, never returned, and
  the read names neither the lane's own handle nor the shared table, nor any save or close); FENCE-SEAT-EDGE holds the
  importers of the lane across the WHOLE repository (Fable c88a3fe9 D2: every .mjs, .cjs and .js file, its import,
  export-from, require and dynamic import specifiers resolved; test files, node_modules, .git, the build output, src/,
  ledger folders, rebuild/conform/private, soak paths, the five protected engine files and links are not read) to exactly
  gym-app.mjs { createGymSettingsLane }, machine-settings-view.mjs { machineFromDraft, acceptable } and today-entry.mjs
  { readSavedSettings }. Eleven RED rows plant each widening and fail: a write through the read's handle, the handle handed out, a second export, a second
  open of the store, the lane opening outside the shared handle, the read reaching the lane's own handle, a second
  importer of the read (today-app.cjs), the reader importing the writer lane too, a namespace import of the seal, an
  importer in rebuild/coach (page-coach.cjs) and a named import in rebuild/lanes (b-package.cjs). The lane's header
  comment states the shared handle's lifetime (Fable c88a3fe9 D1): one per device store and day, never closed by the
  lane or the read, alive as long as the page.
  Every earlier fence row is unchanged (FENCE-VIEW-IMPORT still reads one dynamic host edge and one static import;
  GSS-NO-HOST-LEAK, GSS-API-PARITY and FENCE-COPY-IN-SEAL hold as they were).
- The question. "Where's my seat set?" is the seventh Coach question (coach-app.mjs COACH_LIVE_COPY, design.cjs
  COACH_LIVE_APPROVED): one line per lift of today's workout, in its order, the settings as the athlete saved them,
  then his cue: "Leg press: seat 4; back pad 2." The settings are joined by semicolons, not commas, because the number
  check reads a figure by the word after it, and "seat 4, back pad 2" would read 4 as a count of "back" and discard the
  line; the check is not loosened. Nothing saved: "No machine settings saved for Leg press yet."; no workout today: "No
  workout is planned today, so there are no machine settings to look up."; no store to read: "Your machine settings
  could not be read on this device."
- Fable 4713c98f D2: the batch-2 CSS block lists its four quiet links as plain selectors, one per link, with no :is()
  list (look-cui2's quiet-links cell now holds that).
- New strings (PM-approved short plain copy, :913 (5)): "Where's my seat set?" (copy lock CL-COACH-SEAT-DELTA, corpus
  218da3dc -> 5bdf2c2e); in coach-intents.cjs PLAIN.noWorkoutSeat, PLAIN.noSeat "No machine settings saved for ",
  PLAIN.noSeatTail " yet.", and PLAIN_REFUSALS.machine_seat (was "No machine settings are kept for this lift yet.").
- Pins and needles, measured: copy lock 218da3dc -> 5bdf2c2e (CL-COACH-SEAT-DELTA, CL-COACH-SEAT-APPROVAL; beforeSeat
  rebuilds the polish corpus byte for byte and beforePolish starts from it); PAGE_PINS today-entry.mjs 2387a971 -> 57782256
  (local-today-journey.test.mjs); needles s10-copy-lock 23 -> 25, s12-look 73 -> 74 (coach.test.mjs
  CV1-9), today-split-fence 404 -> 417 (the two seat rows and eleven RED rows) and today-17 850 -> 852
  (machine-settings-ui.test.mjs MS-SEAT-1, MS-SEAT-2), the last OBSERVED at the PM seat.
- Red first: on 11262f8's sources (coach-intents.cjs, read-tools.cjs, page-coach.cjs, gym-settings-lane.mjs,
  today-entry.mjs, today-app.cjs, coach-app.mjs, design.cjs, preview.css) 15 rows fail and pass on these:
  coach-intents.test.cjs CI-11, page-coach.test.cjs PC-5, coach.test.mjs CV1-1 and CV1-9, look-cui2's quiet-links
  cell, the writer fence's FENCE-SEAT-READ, FENCE-SEAT-EDGE and the RED rows whose plant needs the read's own lines,
  and machine-settings-ui.test.mjs (MS-SEAT-1: the read reads what the lane saved through the lane's handle and opens
  nothing; MS-SEAT-2: with no card mounted the read opens the store lazily, and the lane and a second card reuse that
  one handle, counted at the IndexedDB factory).
- At the builder seat: the today batch 636/657 (631/652 plus CV1-9, MS-SEAT-1, MS-SEAT-2 and the two seat copy-lock
  rows; the same 21 seat-only build failures), the fences batch 2206/2208 (the writer fence then 415/415, and 417/417 with
  Fable c88a3fe9 D2's two RED rows; the same two
  seat-only failures, P-MEASURE (g) among them, failing at this seat before and after), the coach suite 397/397 without
  the seat-only engine-revision-gap file, the 76 layout invariants, the deployed-shell probe (24 of 24), the foot probe
  (40 of 40) and the live Coach screen probe over the real booted page (42 of 42: seven questions, the seventh
  reachable by scrolling, its answer read through the real lane's read, opened lazily).

## Coach v1, polish 3 (PM 2026-10-12, ui-pass9 shots 01 to 08; on 9e2227a, rebuild/c-polish3)
- The live Coach screen fits its seven questions at 390x844: only the live screen (its questions carry data-intent; a
  review state still paints the pack's board at the pack's sizes) draws the orb block and the heading smaller and
  closer (orb 110 -> 72 px, rings 160/200 -> 104/132, title 50 -> 40 px, tighter margins). Every question keeps the
  pack's 60 px row and gap; no tap target or type size moves. Measured in Chromium over the real booted page: the
  seventh question's foot at 757 px against the 802 px where the bottom fade starts (857 on 9e2227a, below the fold).
- "Why this weight?" says "first time" only for a lift with NO earlier session, read from the gym card's own last sets,
  the same read "What did I do last time?" answers from (why_weight now reads today_session and last_times). A lift
  with an earlier session but no working weight, or whose history could not be read, says "<lift>: no working weight
  set yet. Pick a weight you can control for about 10 reps; what you log becomes your starting point." Lifts that
  share a reason still share a line.
- The machine-settings form takes the dark theme: its boxes the routine editor's own field look (the card surface,
  the text colour, the pack's line, 8 px corners), still 16 px type and 44 px high, focus marked in the text colour;
  "Add another setting" reads in --text-soft, not the 09-08 link green. The gym card's machine row keeps "Machine
  settings" as its title and puts what is saved ("Seat 4.") on the line below it, where the reading, empty and
  unreadable sentences already sit (the board's W-06 drew the stored setting as the title). No word changes. None of
  this is in a sealed file: preview.css, gym-app.mjs (released) and the tests only; gym-settings-lane.mjs and
  machine-settings-view.mjs are unchanged.
- The weekly card's Why? text reads in --text-soft, not the pack's --muted grey.
- Today's six quiet links share one rhythm: each the same 44 px row with 8 px above it (the first keeps 16 px from the
  sentence above), so every gap between them is 8 px (they were 60 px apart, then 44). Measured: pitches 52, 52, 52,
  52, 52 at 390x844 and 430x932 (60, 60, 44, 44, 44 on 9e2227a); the foot probe's contrast and fade checks still 40 of
  40, and the deployed-shell probe 24 of 24.
- New strings (PM-approved short plain copy, :913 (5)): coach-intents.cjs PLAIN.noWorking ": no working weight set
  yet. Pick a weight you can control for about " and PLAIN.noWorkingNoTop. No page string moves: the copy lock
  re-measures to the same corpus, 5bdf2c2e.
- Pins and needles, measured: s12-look 74 -> 75 (look-cui2's polish 3 cell). No PAGE_PINS file moves (today-entry.mjs
  is unchanged), and the writer fence is unchanged.
- Red first: on 9e2227a's sources (coach-intents.cjs, gym-app.mjs, preview.css) 13 rows fail and pass on these:
  coach-intents.test.cjs CI-12 (first time only with no earlier session; last time agrees lift by lift; unknown
  history is never called a first time), look-cui2's polish 3 cell, workout-look.test.mjs C-UI-4 F3 (the row's title
  and sub line) and ten machine-settings-ui.test.mjs cells whose shown-settings reading now takes the sub line (S2,
  S3, S4 twice, S5, S6d, S7, S8, S9, and S2's "four" cell).
- At the builder seat: the today batch 637/658 (the same 21 seat-only build failures), the fences batch 2208/2210
  (the same two seat-only failures, P-MEASURE (g) among them), the writer fence 417/417, the coach suite 398/398
  without the seat-only engine-revision-gap file, the 76 layout invariants, the deployed-shell probe (24 of 24), the
  foot probe (40 of 40), the coach-screen probe (46 of 46) and the quiet-link rhythm probe (6 of 6).

## Coach v1, polish 4 (PM 2026-10-12, the owner's 7-lift Upper/Lower week; on 469eb7b, rebuild/c-polish4)
- The weekly review opens COLLAPSED on every open, and remembers nothing (no storage): the "Last week" label, one summary
  line ("Workouts done: 2 of 4. 1 lift ready for a new weight.", "2 lifts ready...", "All lifts held steady." when no
  lift is ready and none has news of its own, "No lift ready for a new weight." when one has, or the no-lift and
  could-not-check sentences as before) and "See details" on a row of its own; open, it reads "Hide details". The summary
  keeps "Workouts done: N of M" because the number check reads a bare count there; "2 of 4 workouts done" would ask
  for a unit no tool declares.
- Open, the details are grouped: each lift ready for a new weight on its own line with its Why?, as before; a lift with
  news of its own (a new weight agreed or just landed, native-load.cjs TARGET_QUEUED and DEBUT_LANDED, or a paused
  hold, today-entry.mjs noticesOf) on its own line, as before; every other lift named on ONE line, "Holding steady:
  Lateral machine, Press, Machine fly, Pulldown, and 6 more." (five or fewer are all named), where "and 6 more" is a
  real button that shows every name on that line and reads "Show fewer" until it puts the short line back; the open
  suggestion as one short count, "1 suggestion waiting on Today.", never its sentence; and the trend line, as before.
  No lift says a per-lift "not raised" sentence: the six refusal sentences and the fallback ("no new weight from its
  latest workout.") are gone from coach-intents.cjs, and only the two news codes keep their words.
- The Coach answer to "How did my week go?" is the same grouping, one item per line: the heading, the summary, the
  ready lifts, any news, one "Holding steady:" line, the suggestion count and the trend (six lines for PC-10's one
  ready lift and ten held, where the same week said fifteen).
- The number check is unchanged. read-tools.cjs week_review (still a READ, still writing nothing) tags each lift's
  group and the three counts the review says, each in the noun it is said with: the ready count and the "and N more"
  count in "lift", the suggestion count in its own word through the kernel's own unknownNoun, so "1 suggestion" is
  licensed and nothing else is. Over the same turn's results without those counts, the owner's answer is refused for
  exactly its three counts (page-coach.test.cjs PC-10).
- Every control on the card is a real button with aria-expanded and aria-controls (See details / Hide details, and 6
  more / Show fewer, Why?), each a 44 px row of its own at secondary-text contrast (preview.css polish 4 block, the
  Why? rule's own shape); no type size, input or tap target moves.
- Measured in Chromium over the real booted page (a 7-exercise Lower day on a Monday; the native-load host's own read
  given ten lifts finished last week, one offered a new weight and nine not raised): collapsed at 390x844 the workout
  card ends at 175 px, the weekly card at 305 px and the row after it (the weigh-in card) at 377 px, all above the Start
  bar at 673 px; the card is 122 px, its label over three lines of body text (the two-line summary and the See details
  row). On 469eb7b the same world drew a 611 px card ending at 794 px and the weigh-in card at 866 px, under the bar;
  at 430x932, 305 px against 761 px (it was 755 px and 827 px).
- New strings (PM-approved short plain copy, :913 (5)): on the card (today-app.cjs WEEK_REVIEW_WORDS, copy-locked)
  "See details", "Hide details", "Show fewer"; in coach-intents.cjs WEEK_WORDS " lift ready for a new weight.",
  " lifts ready for a new weight.", "All lifts held steady.", "No lift ready for a new weight.", "Holding steady: ",
  "and ", " more", " suggestion waiting on Today." (it was "Suggestion waiting on Today: "). The copy lock
  re-measures for exactly the three card words (CL-WEEK-POLISH4-DELTA, CL-WEEK-POLISH4-APPROVAL; corpus 5bdf2c2e ->
  0f7f06de).
- Pins and needles, measured: s10-copy-lock 25 -> 27 (the two copy-lock cells), s12-look 75 -> 77 (coach.test.mjs
  CV1-10, look-cui2's polish 4 cell). No PAGE_PINS file moves (today-entry.mjs is unchanged), and the writer fence is
  unchanged (417).
- Red first: on 469eb7b's sources (coach-intents.cjs, read-tools.cjs, today-app.cjs, preview.css and the copy-lock
  corpus) 9 rows fail and pass on these: page-coach.test.cjs PC-7, PC-8, PC-9 and PC-10, coach.test.mjs CV1-8 (rewritten
  for the collapsed card, its assertions kept) and CV1-10, look-cui2's polish 4 cell, copy-lock CL-PIN and
  CL-WEEK-POLISH4-DELTA. coach-intents.test.cjs CI-7 now lists the native-load refusal codes itself (every one the
  review had words for), so its world still carries each of them. The week probe reads 7 of 12 on 469eb7b's sources
  and 18 of 18 on these.
- At the builder seat: the today batch 641/662 (the same 21 seat-only build failures), the fences batch 2208/2210
  (the same two seat-only failures, P-MEASURE (g) among them), the writer fence 417/417, the coach suite 399/399
  without the seat-only engine-revision-gap file, the week probe (18 of 18), the 76 layout invariants, the
  deployed-shell probe (24 of 24), the foot probe (40 of 40), the coach-screen probe (46 of 46) and the quiet-link
  rhythm probe (6 of 6).

## Coach v1, polish 5 (PM 2026-10-12, the owner's 7-lift world, ui-pass11; on df7ad22, rebuild/c-polish5)
- The set screen (item 1). Under the lift name is ONE short plain line from the set's own figures and the "Last time"
  line the gym model composes for that position (gym-app.mjs plainSetLine, mapped the way the coach's PLAIN table maps
  tool values): "Same as last time: 95 lb for 10.", "Up one rep from last time.", "Up 2 reps from last time.",
  "Down one rep from last time.", "Up to 100 lb from 95 lb last time.", "Down to 90 lb from 95 lb last time.", "Same
  weight as last time: 95 lb.", "First time: find your weight.", "First time: 40 lb for 12."; a set it cannot say
  plainly draws no line rather than a guess. PM RULING: Why? (now aria-expanded) opens a plain rewrite of the same
  figures, never the engine's reason text (gym-app.mjs plainSetWhy: "Last time you did 95 lb for 10, and today repeats
  it.", "... Today keeps the weight and asks for one more rep.", "... Today moves the weight up to 100 lb.", the first
  time's own two sentences), and a set those figures do not describe says "This is the weight your recent sets
  support."; the engine's prescription reason is drawn nowhere on this screen. W-13's reveal is the active set
  screen's alone: the saved-set screen draws no reason line and no Why? at all.
  workout-look.test.mjs W-07 fails if any run of three words of an engine reason, or any code string, reaches the set
  screen, Why? opened or not (and the copy itself carries none: "Choose a weight that stays steady" where the engine
  says "pick a load you can control"). FABLE D1: a figure is said as planned only when the engine specified the load:
  gym-model.mjs activeView gains one field, prescription.loadSpecified, and gym-app.mjs passes it to plainSetLine and
  plainSetWhy. A load in the box that nobody planned (the S15 prefill, a debut lift's set 2 at the load just logged; the
  S14 R1 hold card at the last real load) is said as his own: the line is "First time: find your weight." with no
  earlier set and "Choose your weight for this set." with one, and Why? says "Your plan does not set a weight for this
  set. The box starts at 25 lb from your recent sets; change it to what you lift." (gym.test.mjs P5-D1 on the real
  stack, the debut set 1 and set 2, the hold card and a planned control; W-07's table). None of this is a sealed file:
  gym-app.mjs is released, gym-model.mjs is not sealed (one added field). On df7ad22 the same screen led with the
  engine's "DEBUT: find the working weight: ..." (builder-seat world) and "chase 10,10,9: ..." (the owner's).
- The RIR panel (item 2). The set screen keeps 56 px under its last row (the 20 px bottom fade, its 20 px inset and
  16 px clear), on both mounts alike, so at the end of the scroll "How are you feeling today?" ends above the fade and
  the panel: 536 px against a fade from 552 px at 390x844 (572 px, inside the fade, on df7ad22).
- "Check next weight" (item 3). Each offer's Yes says what it does: "Use 45 lb" for a new weight that is one weight
  for every set, "Undo" for the undo of an agreed weight, the approved "Yes" for an offer whose sets differ; the undo is
  the quieter button (no fill, the pack's line, the secondary text colour). Same button, same click, same record
  (native-load-panel.test.mjs P5-NL-VERBS). today-entry.mjs is not sealed (the writer fence's sealed files are
  today-readings.cjs, gym-settings-lane.mjs and today-lanes.cjs); PAGE_PINS re-pins it 57782256 -> 4c6b553a.
- The transient "cannot open" (item 4). ROOT CAUSE: on an enrolled device the workout lane's first dry preparation runs
  at boot over the host the page opened BEFORE his own state is adopted. Adoption (today-lanes.cjs adoptAthleteState)
  adopts the basis, then rebases the gym host and refreshes; every repaint of Today in that window drew the boot answer.
  For an athlete whose record holds imported history, that answer is PERFORMED_LEGACY_ORDER_MAPPING_REQUIRED
  (performed.cjs:180, :183): the pre-adoption basis has no order mapping for the imported order, which only his adopted
  basis carries; after the rebase the same preparation succeeds (2.5 s to 4.9 s in the PM's timing). Today now draws
  that boot answer as loading ("7 exercises . Your set targets are loading", Start held) until the adoption settles
  (today-lanes.cjs facade adoptionSettled), then repaints; a refusal read after adoption is drawn as before, with its
  code, as review B1 requires (problem.test.mjs P5-BOOT). Whether a persistent refusal should still print its code is
  the PM's call; nothing here changes it.
- The weekly card (item 5). WHY IT WAS SLOW: every repaint of Today replaced the workout card the review was waiting to
  sit beside, so the review in flight was dropped and a new coach turn began its reads again (the native-load host's
  projection and one engine check per lift finished last week, queued behind the lane's other native-load work); only
  the read begun by the last boot repaint landed. Measured in the builder-seat week probe: 4 reads begun on df7ad22's
  sources, 2 now (one per workout summary: the boot one, and the one after the native-load reconcile). NOW the review
  is read once per day and workout summary and a landed review repaints in place at once (coach.test.mjs CV1-11), and
  until it lands a quiet placeholder of the collapsed card's own shape (its heading, two lines, the toggle's row,
  aria-busy) holds the place: 122 px held and 122 px landed, the next card at 313 px before and after (week probe, 390
  and 430). A review that cannot be drawn removes its placeholder.
- The weekly details (item 6). "and 5 more" continues its line inline, with no comma before it and no full stop after
  its chevron (week probe, a Lower Monday: "Holding steady: Leg curl, Calf raise, Hip thrust, Lateral machine and 5
  more"), still a 44 px tap row wholly inside the card; names are listed with no comma before "and". The toggles are the
  accent (--gold) with a small chevron that turns when they open. The lifts are in plan order, today's first
  (read-tools.cjs planOrder: today's session in the engine's order, then the plan's; the probe's three Lower lifts lead
  its Upper one). A device with fewer than two workouts before the week reviewed says "No lift ready for a new weight
  yet." where it said "All lifts held steady." (read-tools.cjs firstWeeks, page-coach.test.cjs PC-11).
- The sentence under Ask Coach (item 7) is NOT removed: it is the C-UI-2 status line, the prototype's own words for
  each Today state (pack README C-UI-2, DECISIONS:820 (2); here T-19 " today. Your calorie range is not available
  yet."), held by look-cui2.test.mjs C-UI-2 R3 ("the status line says the prototype's words for each state") and
  look-cui3.test.mjs C-UI-3 T-40. Removing it needs a ruling on those.
- "Weight trend ... Why this plan?" (item 8) is two rows: the trend is a line of its own (a div, the quiet links' 44 px
  row and 8 px rhythm and their protective cloud), and "Why this plan?" (the approved words) is the one control on the
  row under it (problem.test.mjs P5-TREND; the rhythm probe reads seven rows 52 px apart).
- The Coach (items 9, 10). A tapped question's answer is brought into view (scrollIntoView, nearest) and takes focus
  (tabindex -1); its source line says "From your data on this phone." (design.cjs COACH_LIVE_APPROVED), and the pack's
  "From this device's encrypted local store." leaves the live coach.
- New strings (PM-approved short plain copy, :913 (5)): gym-app.mjs SET_PLAIN ("First time: find your weight.", "First
  time: ", "Same as last time: ", " lb for ", "Same weight as last time: ", " lb.", "Up one rep from last time.", "Down
  one rep from last time.", "Up ", "Down ", " reps from last time.", "Up to ", "Down to ", " lb from ", " lb last
  time."), and SET_WHY for Why? ("There is no earlier set of this lift on this device. Choose a weight that stays steady
  for every set; what you log becomes your starting point.", "There is no earlier set of this lift on this device, so
  today starts at the planned ", "Last time you did ", ", and today repeats it.", ". Today keeps ", ". Today keeps the
  weight and asks for one more rep.", ". Today keeps the weight and asks for ", " more reps.", ". Today keeps the weight
  with one rep fewer.", ". Today keeps the weight with ", " fewer reps.", ". Today moves the weight up to ", ". Today
  moves the weight down to ", "This is the weight your recent sets support.", and for D1 "Choose your weight for this
  set.", "Your plan does not set a weight for this set.", " The box starts at ", " lb from your recent sets; change it
  to what you lift."); today-entry.mjs NATIVE_LOAD_VERB ("Use ", "Undo"); today-app.cjs "Your set targets are loading" and "Why this
  plan?" (already approved, now also its own row); coach-app.mjs "From your data on this phone."; coach-intents.cjs
  "No lift ready for a new weight yet." (not copy-locked). The copy lock re-measures for exactly these, the two pieces
  that leave and the five mounted gym states (the plain line in, the fixture reason drawn nowhere) (CL-POLISH5-DELTA,
  CL-POLISH5-APPROVAL; corpus 0f7f06de -> e63812ae).
- Pins and needles, measured: s10-copy-lock 27 -> 29, s12-look 77 -> 80 (coach.test.mjs CV1-11, look-cui2's polish 5
  cell, workout-look's polish 5 W-07 cell), today-17 852 -> 856 expected (native-load-panel P5-NL-VERBS, problem.test
  P5-BOOT and P5-TREND, gym.test P5-D1; observed at the PM seat); PAGE_PINS today-entry.mjs 57782256 -> 4c6b553a; the writer fence is
  unchanged (417; the new code in today-app.cjs names none of today-lanes.cjs's factory bindings, and reads the
  adoption's settling through the facade's own adoptionSettled()).
- Not run here (seat-only): view.test.mjs (edited statically for the trend row: three assertions now read
  "Weight trend <n> lb"), copy.test.mjs (loads a protected engine file), page-bundle, writer-enumeration, package.test,
  scene C-UI-1, browser-check, engine-revision-gap.
- Red first: on df7ad22's sources (coach-intents.cjs, read-tools.cjs, page-coach.cjs, gym-app.mjs, today-app.cjs,
  today-entry.mjs, preview.css, screens.template.html, coach-app.mjs, design.cjs, the copy-lock corpus) 17 rows fail and
  pass on these: page-coach.test.cjs PC-7, PC-10 and PC-11; coach.test.mjs CV1-2, CV1-3, CV1-8, CV1-9, CV1-10 and CV1-11;
  workout-look's polish 5 W-07 cell; look-cui2's polish 5 cell; copy-lock CL-PIN and CL-POLISH5-DELTA; native-load-panel
  P5-NL-VERBS; problem.test.mjs P5-BOOT and P5-TREND; and N2-08 (the PAGE_PINS today-entry.mjs pin). Fable D1's
  gym.test.mjs P5-D1 fails on df7ad22's gym-app.mjs and gym-model.mjs and on the polish 5 bytes before D1 (set 2 of a
  debut lift drew no "find your weight" line; Why? said "the planned 25 lb"), and passes on these. The week probe
  reads 22 of 30 on df7ad22's sources (the engine's DEBUT line under the lift name, the last row inside the fade, no
  held place, and N more off its line) and 42 of 42 on these.
- At the builder seat: the today batch 650/671 (the same 21 seat-only build failures), the fences batch 2208/2210
  (the same two seat-only failures, P-MEASURE (g) among them), the writer fence 417/417, the coach suite 400/400
  without the seat-only engine-revision-gap file, the copy lock 29/29, the week probe (42 of 42), the 76 layout
  invariants, the deployed-shell probe (24 of 24), the foot probe (44 of 44, the trend line among its rows), the
  coach-screen probe (46 of 46) and the quiet-link rhythm probe (6 of 6).

## Coach v1, polish 6 (PM 2026-10-13, ui-pass12; on 4ba1ce5, rebuild/c-polish6)
- Start at boot (item 1). ROOT CAUSE: on an enrolled device Today paints before his own state is adopted, and in
  that window the Today model still stands on the record the page opened with (today-model.cjs holds exerciseCount
  null, and its next-workout title is not his day); polish 5 held only a REFUSAL read in that window, so the bar was
  drawn "Start " + that title. Measured in the builder-seat boot probe (a real enrolled installation, Lower on
  Monday): on 4ba1ce5 the first frame's bar, card title and status line named the Upper day ("No session is scheduled
  today." on the card, T-12's line on the status row), 1 wrong-day frame; now 0. Until the adoption settles
  (today-lanes.cjs facade adoptionSettled, read as polish 5 reads it) Start shows the loading state ("Your set targets
  are loading", the card line's own words) and is held; while the model is still the pre-adoption one the card draws
  no title, its line says the loading state, and the status line says the board's own T-03 words ("Your record is
  opening. Nothing here is measured yet.", which closes the recorded departure F4 on the page; statusLine itself is
  unchanged); once his state is adopted the card and line are his while Start still waits for the gym card; once the
  adoption settles Start is his workout and live (problem.test.mjs P6-BOOT). P0B.8's first-frame assertion moves with
  it: it held that frame's line to "No session is scheduled today." (a claim about his day that may be false); it now
  holds the loading state there and the absence of that sentence, its count and figure checks unchanged.
- The coach answer (item 2). askLive's "nearest" scroll put the card's foot on the body's edge, inside the 20 px
  bottom fade over its 22 px inset, so the source line was masked at 390 and 430 (coach-scroll probe on 4ba1ce5: 19 of
  24, every 390 answer and the 430 plan answer inside the band). The card now keeps that band as scroll room
  (scroll-margin-bottom: the fade over the inset; scroll-margin-top: the scrolled top fade's band), so the scroll stops
  above the band or at the end of the scroll, where nothing is faded: 30 of 30 at 390 and 430, a six-line answer
  included, the source line drawn and whole each time.
- Undo cards (item 3). "Not now" on an undo card takes polish 5's quiet look, so the card has no primary: both
  buttons are unfilled, the pack's line, the secondary text, the same 44 px row; a new weight's card keeps its pair as
  it was (undo probe over the real region: 2 of 8 on 4ba1ce5, 8 of 8 now).
- "Show fewer" (item 4). The inline control took the pack .link's flex gap and spread (12 px plus the chevron's 7 px:
  26 px from words to chevron against Hide details' 14 px); it now has no gap, and once open it is a 44 px row of its
  own under the names, at the line's start, at every width (week-more probe: 1 of 6 on 4ba1ce5, 6 of 6 now; at 430
  "Show fewer" sat on the names' last line before).
- The debut hint (item 5). When the engine leaves the load to be found (gym-model.mjs prescription.loadOpen: the load
  cell is not specified, a debut's "Find a working load") and the plain line already says so ("First time: find your
  weight." or "Choose your weight for this set."), the cells' own line under the numerals is not drawn; the empty boxes
  and Log ask for the rest. A configuration (a hold, a bodyweight marker) is specified, and keeps its line
  (gym.test.mjs P6-DEBUT: debut sets 1 and 2, and a hold with no earlier real load as the control).
- New strings: one, the board's own T-03 line (app/states-today.js T-03; the C-UI-2 status-line words, DECISIONS:820
  (2)), owned by today-app.cjs's status-line block and declared in design.cjs RUNTIME_COPY beside Today's other
  borrowed board status words (Fable D1, 6d2d4c34); no other word is new (the bar's loading state is polish 5's line).
  The copy lock re-measures for exactly that piece (CL-POLISH6-DELTA, CL-POLISH6-APPROVAL; corpus e63812ae ->
  a4374f49).
- Pins and needles, measured: s10-copy-lock 29 -> 31 (CL-POLISH6-DELTA, CL-POLISH6-APPROVAL), s12-look 80 -> 81
  (look-cui2's polish 6 cell), today-17 856 -> 858 expected (problem.test P6-BOOT, gym.test P6-DEBUT; observed at the
  PM seat); the writer fence is unchanged (417); PAGE_PINS unchanged (today-entry.mjs is not touched).
- Red first: on 4ba1ce5's sources (today-app.cjs, gym-app.mjs, gym-model.mjs, preview.css, the copy-lock corpus)
  6 rows fail and pass on these: problem.test.mjs P6-BOOT and P0B.8 (as moved), gym.test.mjs P6-DEBUT, look-cui2's
  polish 6 cell, copy-lock CL-PIN and CL-POLISH6-DELTA; and the four probes above read 1 wrong-day frame, 19 of 24,
  2 of 8 and 1 of 6 on them.
- At the builder seat: the today batch 655/676 (the same 21 seat-only build failures), the fences batch 2208/2210
  (the same two seat-only failures, P-MEASURE (g) among them), the writer fence 417/417, the copy lock 31/31, the boot
  probe (0 wrong-day frames), the coach-scroll probe (30 of 30), the undo probe (8 of 8), the week-more probe (6 of 6),
  the week probe (42 of 42), the 76 layout invariants, the deployed-shell probe (24 of 24), the foot probe (44 of 44),
  the coach-screen probe (46 of 46) and the quiet-link rhythm probe (6 of 6).

## Nutri 1: the labelled estimate (owner ruling DECISIONS:980, "Labelled estimate"; on aa81776, rebuild/c-nutri1)
- The ruling, as put to the owner: "show the estimated range now, clearly marked Estimate; switches to your measured
  range once you've logged enough; no change to how the calories are calculated". No engine file changes and none of
  the protected five: the band is the engine's own (rebuild/engine/energy.cjs calorieTarget). While gated it returns
  its labelled "mass-estimate" branch (measured bodyweight at a labelled convention, his own band taken off it, lo and
  hi included), reachable through the page's existing composition (today-engine.cjs); Today used to hide every gated
  band (today-app.cjs calorieBand).
- The food card (today-app.cjs calorieEstimate): while the band is that estimate, the card's title is "Estimate: " and
  the engine's own lo and hi ("Estimate: 2,050 to 2,250 kcal"), and the line under it says what will make it measured
  (calorieGateLine): "Log food for 8 more days and weigh in 10 more times to measure yours.", "Log food for 1 more day
  to measure yours.", "Weigh in 1 more time to measure yours."; an estimate whose two ends are one figure (the engine's
  calorie floor binding both) is said as one figure, "Estimate: about 1,700 kcal" (PM ruling on N1); any other gated
  band (no bodyweight yet, a record still opening) is T-19 as before, and a measured band reads exactly as before. The
  nutrition screen's Energy row says the same estimate.
- The counts (today-model.cjs calorieGateOf, on the view as calorieGate) are the engine's own gate inputs, counted
  with its own filters and thresholds: weigh-ins as currentRate's regression reads them (10 of the last 28 readings
  that are not sealed, not off-window and carry a weight, energy.cjs:229-230; currentRate's own `measured` says when
  that is met); days with calories logged as observedTDEE reads them (8, inside the rate's window or else since 21
  days ago, energy.cjs:392-404); a blackout (energy.cjs:370) says no count. They move as he logs. problem.test.mjs
  N1-GATE holds them to the engine itself: over the fixture athlete through the page's engine, adding exactly the
  days and weigh-ins left turns the engine's band measured, and one fewer leaves it gated, in seven worlds.
- The Coach (read-tools.cjs today_plan, coach-intents.cjs PAGE_TEMPLATES.plan): "What am I hitting today?" says the
  estimate as one ("Estimate: eat between 2050 and 2250 calories.", or "Estimate: eat about 1700 calories.") and the
  same gate line; today_plan tags the
  estimate flag (energy.cjs calorieTarget, from) and the two counts ("day"; weigh-ins as the kernel's unknownNoun
  "time"/"times"), so the number check passes and each count is licensed only by its own tag
  (page-coach.test.cjs PC-12). Before this the coach said the gated estimate as "Eat between ...", unmarked.
- The status line (PM ruling under DECISIONS:980): while the band is the engine's labelled estimate the C-UI-2 status
  line says "<session> today. Your calorie range is an estimate for now." (today-app.cjs STATUS_CALORIE_ESTIMATE, its
  declaration citing :980); a gated band that is not that estimate keeps T-19's words, and an open proposal still
  stands ahead of it. look-cui2.test.mjs C-UI-2 R3 and look-cui3.test.mjs C-UI-3 T-40 assert the new words state by
  state, and no looser: the ruling's words must equal the declared constant, carry the :980 citation and be absent from
  the prototype; every other row still holds the prototype's own words.
- The design laws the ruling supersedes for the gated state (DECISIONS:980): the
  coaching rule N05 (rebuild/m1/approved-2026-09-18/states/COACHING-RULES-INVENTORY-v1-notes.md:15, "N05 LIVE (Today
  shows 'not available' when gated)"); the board's T-19 "Gated calorie band" (app/states-today.js:106-108, its card
  title "A calorie range is not available yet."; STATE-INVENTORY-DRAFT.md:109 "Calorie headline is blank"); and the
  coach's C-12 "Answer, no calorie band" (states-coach.js:279), with T-19's status-line words.
- New strings (approved under DECISIONS:980): today-app.cjs "Estimate: ", "Estimate: about ", "Log food for ",
  "Weigh in ", " and weigh in ", " more day", " more days", " more time", " more times", " to measure yours." and
  " today. Your calorie range is an estimate for now."; coach-intents.cjs "Estimate: eat between ", "Estimate: eat
  about " and the same gate words (not copy-locked). The copy lock re-measures for exactly these and
  the estimate's own " to " and " kcal" (CL-NUTRI1-DELTA, CL-NUTRI1-APPROVAL citing DECISIONS:980; corpus a4374f49 ->
  e8193158).
- Pins and needles, measured: s10-copy-lock 31 -> 33 (CL-NUTRI1-DELTA, CL-NUTRI1-APPROVAL), today-17 858 -> 860
  expected (problem.test N1-GATE, N1-CARD; observed at the PM seat); s12-look 81 unchanged (C-UI-2 R3 and C-UI-3 T-40
  gain rows inside existing cells); the writer fence unchanged
  (417); PAGE_PINS unchanged. The coach suite gains PC-12 (400 -> 401 here, without the seat-only
  engine-revision-gap file).
- Red first: on aa81776's sources (today-app.cjs, today-model.cjs, read-tools.cjs, coach-intents.cjs, the copy-lock
  corpus) 7 rows fail and pass on these: problem.test.mjs N1-GATE and N1-CARD, page-coach.test.cjs PC-12, copy-lock
  CL-PIN and CL-NUTRI1-DELTA, look-cui2.test.mjs C-UI-2 R3 (the status line) and look-cui3.test.mjs C-UI-3 T-40.
- At the builder seat: the today batch 659/680 (the same 21 seat-only build failures), the fences batch 2208/2210
  (the same two seat-only failures, P-MEASURE (g) among them), the writer fence 417/417, the copy lock 33/33, the coach
  suite 401/401 without the seat-only engine-revision-gap file, the estimate probe (38 of 38: the estimate title, one
  figure and a band, and its line inside the food card, unclipped, at 390 and 430, a measured world the control), the week probe (42 of 42),
  the 76 layout invariants, the deployed-shell probe (24 of 24), the foot probe (44 of 44), the coach-screen probe
  (46 of 46) and the quiet-link rhythm probe (6 of 6).

## UI-pass13 fix-forward (PM, on f4bd98c, rebuild/c-nutri1)
- ui-pass13 (the real built page, the synthetic 7-lift world) found five problems. Items 2 to 5 are fixed here; item 1
  is held for its own engine package. No rebuild/engine file and none of the protected five; no sealed file
  (today-readings.cjs, today-lanes.cjs and gym-settings-lane.mjs are untouched); today-entry.mjs and today-bindings.mjs
  are untouched, so PAGE_PINS stand.
- Item 1, the estimate never shows (HELD, not fixed). Measured on the page's own path (boot over a real store, the
  in-page first run, one weigh-in): energy.cjs calorieTarget's mass-estimate branch returns its tdee and band but lo
  and hi NaN, because calorieFloor(s).floor is NaN for an athlete with no lean-mass estimate yet and the branch takes
  Math.max(floor, ...). Nutri 1's probe passed on the fixture athlete, whose floor is finite. The card, the status line
  and the Energy row rightly refuse a non-finite band (calorieEstimate), so NUTRI 1'S ESTIMATE STAYS INERT, saying "not
  available", until the engine floor fix lands in its own engine package (the owner authorised it at DECISIONS:982; it
  is not in this batch); no engine file is changed here and nothing prices a calorie outside the engine. The
  built-page cell (UP13-ESTIMATE: boot, first run, weigh-in, the estimate on the card, the status line and the Energy
  row) is written and held outside the repository, red for exactly that reason.
- Item 2, the coach's numbers (live since coach batch 2). "What am I hitting today?" said the Today model's own
  genSession targets (today-model.cjs sessionPlan), which stand on a state with no native workout history and no
  native-load spend, while the set screen says the capture the gym card prepares over the gym host's projection.
  Measured on native-load-panel.test.mjs's own world: after one session the coach said 11, 10 reps against the set
  screen's 12, 12, and after an accepted offer 40 lb against 45 lb. Now gym-model.mjs carries one more read,
  prescriptions() (the cells of the slots its own last read() prepared; it prepares and writes nothing), page-coach.cjs
  hands it to the coach (READS.gym + prescriptions), and read-tools.cjs today_session takes each lift's sets, reps,
  loads and first-time flag from it, the engine plan naming the session and the lifts and standing alone only on a
  device with no gym lane; coach-intents.cjs says unequal per-set loads set by set, in words it already had.
- Item 3, Today stuck loading after "Start using Earned" (live since polish 6). The polish 6 gate reads the adoption
  chain's settle, which today-lanes.cjs flips only after the whole chain answers, and the chain's own repaint runs
  before that; at boot a repaint follows the settle (today-app.cjs settleLoading), and the setup-to-Today transition
  armed a new chain with nothing after it. The transition now takes the same repaint after its own chain.
- Item 4, the nutrition screen's carbohydrate and fat rows: the two rows keep their "Not prescribed" figure and carry
  no sentence; one plain sentence, "No carb or fat target; protein and calories are what count." (today-app.cjs
  FOOD_NOT_PRESCRIBED, design.cjs PREVIEW_RUNTIME_COPY, approved under DECISIONS:913 (5)), is said once, under Fat; the
  three "The engine issues no ..." pieces are gone. A DEBT, recorded: FOOD_PLAN_UNWIRED ("... today's engine targets
  ...") still says "engine" on the no-store path; view.test.mjs is pinned on disk by B-NTC (DECISIONS:144) and asserts
  it, so it is left for now.
- Item 5, the food card's marker said "Not wired yet" for about 120 ms at boot while the food lane opened. While the
  lane opens it now says nothing, which is what it says once the lane is open with nothing logged (PM ruling); "Not
  wired yet" is said only when no lane can open on this device.
- Cells, each red first on f4bd98c's bytes of the files it names and green on these: native-load-panel.test.mjs
  UP13-COACH (the coach's line for every lift equals the set screen's cells, before history, after a session and after
  an accepted offer; red at the second world on f4bd98c's read-tools.cjs, gym-model.mjs, page-coach.cjs and
  coach-intents.cjs); problem.test.mjs UP13-SETTLE (setup to Today with no reload and no render of the cell's own:
  Start names his workout and is live; red on f4bd98c's today-app.cjs, the bar still loading); food.test.mjs
  UP13-CARBFAT (the sentence once, under Fat, and no "engine" on the screen) and UP13-MARKER (nothing while the lane
  opens, "Not wired yet" with no store). page-coach.test.cjs PC-5's fake gym card gains the new read (null: no
  prepared slots), so its READS.gym equality holds; no assertion moves.
- Copy lock: re-measured for exactly the one sentence in and the three out (CL-UP13-DELTA, CL-UP13-APPROVAL citing
  DECISIONS:913; corpus e8193158 -> f95b7915); beforeUp13 is idempotent, as the chain's older views are.
- Measured on the way: problem.test.mjs R5 ("enrolled after it") is intermittent on f4bd98c's own bytes (it failed in 2
  of 3 full-file runs at the builder seat) and is not moved by this change.
- Needles: today-17 860 -> 864 (UP13-COACH, UP13-SETTLE, UP13-CARBFAT, UP13-MARKER; expected, observed at the PM seat)
  and s10-copy-lock 33 -> 35 (CL-UP13-DELTA, CL-UP13-APPROVAL, measured).
- At the builder seat: the today batch 665/686 (the four UP13 cells and the two copy-lock rows added; the same 21 seat-only build failures), the fences batch 2208/2210 (the same two seat-only failures, P-MEASURE (g) among them), the copy lock 35/35, and the coach suite 401/401 without the seat-only engine-revision-gap file.

## N2 "Log today", Part A: the steps lane and its import admission (PM N2 brief; on 20c0b09, rebased from f4bd98c, rebuild/c-nutri2)
- Part A is the steps lane (commands, host, projection), the import-admission change in its own declared section
  below, and Fable's three N1 debts (D1 to D3). Part B (the Log today card and its sheet) follows after review. No
  rebuild/engine file and none of the protected five; no sealed file (today-readings.cjs, today-lanes.cjs and
  gym-settings-lane.mjs are untouched); today-entry.mjs and today-bindings.mjs are untouched, so PAGE_PINS stand.
- The command (today/steps-commands.cjs): one day's step count becomes ONE operation of rebuild/client's own
  envelope, kind "fact", class "steps" (both already in rebuild/client/ops.cjs KINDS and CLASSES), profile
  earned/steps-day/v1, payload {profile, day: {steps}}. A whole number from 0 to 100000, refused by name and never
  clamped; a correction is a NEW op for the date and the latest wins. food-commands.cjs's shape, member for member.
- The host (today/steps-host.mjs): food-host.mjs's shape. It opens through era.client.hostBindings({ workoutCommands })
  in the SAME store as every other lane and declares no clock of its own, so the installation's live clock stamps it
  (food-live-save.test.mjs FLS/5's census now names nine hosts; FLS/6 saves a count on a live era and reads it back,
  stamped on the page's day with the offset in force). Its read-back is a filter by class and profile, in the log's
  own order, rejected and tombstoned ops out.
- The projection (today/steps-model.cjs, today-model.cjs): the model replays the winning count per date after the
  food days (options.stepDays, settable as setStepDays, as the food lane is), into the engine's daily row
  dailyLogs[date].steps, which the engine's own readers read (energy.cjs stepTarget and the energy rollups). It goes
  through food-model.cjs dailyProjection, the page's ONE daily-log writer call: food.test.mjs N1.7 still finds the
  writer called only in food-model.cjs, and foodProjection is now dailyProjection with the food members, byte for byte
  the replay N1 measured. steps-model.cjs and steps-commands.cjs are on the Today boot graph (today-model.cjs requires
  them); steps-host.mjs is not on the page yet, and nothing opens the lane until Part B (it cannot be opened from the
  sealed today-lanes.cjs; Part B says where it is).

### Declared spec section: F11, the import admission of device steps (rebuild/m3/w6/local/source-admission.mjs)
- Before: every operation of class steps fell to admission's catch-all and refused the whole import
  LOCAL_SOURCE_DAILY_UNRESOLVED, so a step count recorded on the phone before an import would block the import.
- After: a steps operation of schema 2 that the steps producer's own validate() accepts is collected BEFORE the
  catch-all and answered by F11, F2's rule over the day's other member: the winning count per date is PROJECTED onto
  the replayed state through the page's own projector (engineFor(date, 12), after the food days); a date whose
  imported history already holds a count is not overwritten, and that operation refuses LOCAL_SOURCE_DAILY_UNRESOLVED
  by name; earlier counts for a date are retained on record; anything the producer refuses still reaches the
  catch-all and refuses LOCAL_SOURCE_DAILY_UNRESOLVED as before. Admission names the family ('F11'); the rule itself
  is steps-model.cjs admitStepRows, pure, so it is executed at the builder seat too.
- Nothing sealed is edited: source-admission.mjs is role edited in S19 and S4 does not pin it. The register
  (rebuild/m4/import/replay-registry.cjs) gains steps-commands.cjs#steps, family F11, because the producer is now in
  the page graph; writer-enumeration.test.mjs P3-EN2 re-pins FAMILIES to add 'F11' and asserts that F11's validator
  is the producer's, collected before the catch-all, and run by admission.
- Cells: food.test.mjs N2S.5 (the rule: winner projected, replaced count retained, a held count refused by name) and
  N2S.7 (the register and admission's text) run at the builder seat. Seat-only, because they load the engine's
  migration walk: local-source-admission.test.mjs S3-Q-N2-STEPS (a count projected into the imported day beside its
  food, a correction wins) and S3-Q-N2-STEPS-REFUSED (a count under a foreign profile still refuses by that code);
  writer-order.test.mjs P3-WO1 and P3-WO2 for the steps writer (both orders, through the real host); and
  writer-enumeration.test.mjs P3-EN1 and P3-EN2.

### Fable's N1 debts
- D1: in a blackout (energy.cjs observedTDEE's first line) the food card used to say nothing under the estimate,
  because today-model.cjs calorieGateOf returned null. It now returns the counts with blackoutUntil, and the line says
  the day the range is measured again in the date's own words (today-app.cjs dayLabel): "Your range is measured again
  on Sunday, February 10." alone, or after any count still left, "Log food for 3 more days to measure yours. Not
  before Sunday, February 10." The coach says the same (read-tools.cjs today_plan tags the day as text, measuredAgainOn;
  coach-intents.cjs gateLine).
- D2: the counts are as of today. calorieGateOf counts on the state the page replays for the day it stands on: the
  21-day fallback and the rate's window are measured back from today, so what the line says is left is as of today,
  and it moves as he logs and as the days pass.
- D3: ONE cell, problem.test.mjs N2-D3, holds the coach's gate line and Today's equal, world by world (seven worlds,
  each with and without a blackout): each is the line its own screen draws, read off that screen (the card's
  kcal-note; the coach's "What am I hitting today?" answer, every number traced), and 13 of the 14 draw one.
- Fable 86af076c D1 (on the ui-pass13 fix-forward, folded in here), and the PM's extension to every coach read of the
  card: "What am I hitting today?" took the card's sets by calling gym.read() and then prescriptions(), and the set,
  last-time and why-this-weight questions (read-tools.cjs gymView) and page-coach.cjs liftId called gym.read() too. A
  read is not free: it hands back and clears the card's one-shot message and re-prepares its preparedId, so a coach
  question ate a refusal the athlete had not yet seen. Now no coach read calls gym.read(): capturedSets() takes the
  card's last read's slots (gym-model.mjs prescriptions), and gymView and liftId take the view the card's own last
  read() returned (gym-model.mjs lastRead(), new: held when a read returns, cleared when one starts, and handed out as
  a deep, detached copy frozen at every depth, Fable 4a010467 D2; page-coach.cjs READS.gym + lastRead). Before the card has read once there is no snapshot: today's sets fall back
  to the plan's figures, as with no gym lane, and gymView answers WORKOUT_NOT_READY by code with no words of its own.
  native-load-panel.test.mjs N2-F1 asks every page question (today, why this weight, last time, the seat, the week and
  the rest) and the set questions' own tools (current_set, next_set, last_comparable_performance), each after a fresh
  refusal: the card's next read still says it every time, the coach read the card zero times, the snapshot is equal to
  what the card drew, a new copy per call, frozen at every depth and detached from the card's own, the set question answers
  from the last read, and the coach still says the set screen (UP13-COACH unchanged). Red on 20c0b09's read-tools.cjs
  and page-coach.cjs (the first question, today, eats the refusal) and on the first D1 fix alone (why this weight eats
  it, through last_times and gymView). The coach suites' fake gym cards answer lastRead() with the same view their
  read() returns, and two real-card cells (memory.test.cjs M06 P06-03 and P06-04) let the card read once, as the
  page draws it, before the coach is asked; no assertion changes, and the coach suite stands at 401.
- New strings (PM rulings on Part A: both D1 forms accepted, "Not before <date>" included, and approved under
  DECISIONS:980, because the blackout lines belong to the owner's estimate ruling): today-app.cjs "Your range is
  measured again on ", " Not before " and "." (CALORIE_GATE again, notBefore, end); coach-intents.cjs the same three
  words (gateAgain, gateNotBefore, gateEnd; not copy-locked); steps-host.mjs "createStepsHost requires day" (a
  developer TypeError, the food and sleep hosts' shape, never drawn). Codes, never shown: STEPS_INPUT_INVALID,
  STEPS_WRITE_REFUSED, NOTHING, STEPS_RANGE. The copy lock re-measures for exactly the steps lane's three files, these
  pieces and the two existing pieces they also carry (CL-NUTRI2A-DELTA, CL-NUTRI2A-APPROVAL citing DECISIONS:980;
  corpus f95b7915 -> 25eefea4; on f4bd98c it was e8193158 -> 66ade625).
- food-model.cjs, which no parent pins, is declared role new with pre null under DECISIONS:792 (PM ruling on Part A),
  as S19-REGEN declares every parent-unpinned path it finds changed.
- Re-pins, to measured values: page-bundle.test.mjs P3-B2 162 -> 164 and P3-B5 41 -> 43 (the builder's esbuild graph
  with every protected engine file held external, never read, on f4bd98c's bytes of the importing files and on this
  tree (20c0b09 adds no import to either graph, so the counts stand on the rebase): 160 -> 162 and 159 -> 161 non-protected inputs, steps-model.cjs and steps-commands.cjs added, none removed,
  the route-only set unchanged at 19); writer-enumeration.test.mjs P3-EN2 FAMILIES gains 'F11' (seat-only, derived
  from the register); writer-fence.test.mjs today-model.cjs's declared edges gain require:./steps-model.cjs (417
  unchanged). food-live-save.test.mjs's census and page-coach.test.cjs PC-5's writer list gain the new host and
  setStepDays.
- Needles: s10-copy-lock 35 -> 37 and food-live-save 6 -> 7, measured; today-17 864 -> 874 (N2S.1 to N2S.7, N2-D1,
  N2-D3, N2-F1), w6-local-source 31 -> 33 and d-replay-all 56 -> 58, expected, observed at the PM seat.
- Red first, re-measured on the rebase: on 20c0b09's bytes of today-model.cjs, today-app.cjs, food-model.cjs,
  read-tools.cjs, coach-intents.cjs, source-admission.mjs and replay-registry.cjs (the new files kept) 8 of the 10 new
  today cells fail and pass on these: food.test.mjs N2S.3 to N2S.7, problem.test.mjs N2-D1 and N2-D3, and
  native-load-panel.test.mjs N2-F1 (on 20c0b09's read-tools.cjs the card's next read has lost the refusal); N2S.1 and
  N2S.2 stand on files 20c0b09 does not have. The copy lock refused the new pieces and owners by name until the corpus was re-measured.
- At the builder seat: the today batch 677/698 (665/686 plus N2S.1 to N2S.7, N2-D1, N2-D3, N2-F1 and the two copy-lock rows; the same 21 seat-only build failures), the fences batch 2209/2211 (2208/2210 plus FLS/6; the same two seat-only failures, P-MEASURE (g) among them), the writer fence 417/417, the copy lock 37/37, food-live-save 7/7, the coach suite 401/401 without the seat-only engine-revision-gap file, and the estimate probe 58 of 58 (its 38, plus the two blackout lines inside the food card, unclipped, at 390 and 430; the longest wraps to three lines).

## N2 "Log today", Part B: the Log today card and its sheet (PM N2 brief; on 20c0b09 plus Part A's diff, rebased from f4bd98c, rebuild/c-nutri2b)
- Part B is one card near the top of Today and the one sheet it opens, the steps lane opened by the page and wired
  into the build, and Fable's three Part A debts (D1 to D3). No rebuild/engine file and none of the protected five; no
  sealed file (today-readings.cjs, today-lanes.cjs and gym-settings-lane.mjs are untouched); today-entry.mjs and
  today-bindings.mjs are untouched, so PAGE_PINS stand.
- The card (screens.template.html #card-log, in the feed after today's workout and above the proposal, the food card
  and Ask Coach): the food card's own look (tcard nav, the feed's dot, a chevron), a title, "Log today", and one line
  that names the five logs and ticks each one this device holds for today: "Weight . Food . Steps . Sleep . Check in"
  (the separator is the feed's middle dot, the tick a check mark after the name). Every tick is read from the record
  the screen behind it reads: the adopted morning reading, the projected food day, the winning steps op, the
  projected night and the check-in lane's own summary. On a record that did not verify the card is hidden.
- The sheet (screens.template.html t-log): the weigh-in sheet's panel (sheet-panel, a dialog over Today, Today inert
  under it, focus on its head, Escape and Done close it), one row per log with what this device holds for today:
  Weight, entered here through the page's ONE weigh-in write site (submitWeighIn, so model.weighIn is still called at
  one site; look-cui3 S12 R3 now holds the sheet to it as a third entry); Food, the projected day and "Enter food",
  which opens the nutrition screen; Steps, today's count and the new entry; Sleep, last night's hours and "Enter
  sleep", which opens the sleep screen; Check in, the check-in's own line and "Open recovery check-in", which opens
  the recovery screen. The food row routes rather than takes an entry because the food writer (recordIntake) is
  sealed in today-lanes.cjs (S10) and repaints the nutrition screen itself; a food entry inside the sheet needs a
  sealed edit, so it is not built. On a small phone the panel is held to the screen and scrolls inside itself
  (preview.css; measured in Chromium at 375x667 with a store: 758 px tall on the rebase (759 on f4bd98c), its head at -92 px before, on the screen
  after).
- The steps lane is opened by today-app.cjs (openStepsLane), lazily and failing closed, as N1's food lane was opened
  by the page and not by boot(): today-lanes.cjs is sealed, so the lane cannot be opened there. There is no injection
  point: a third read of the mount's options is what B.3's one-handoff rule forbids (writer fence FENCE-OPTIONS-HELD,
  2, unchanged), so the suites hand the jsdom window a real store and the page opens its own lane. The one new write
  is recordSteps's stepsHost.save, after steps-model.cjs's rule passes the box: refused is said as nothing recorded,
  a save that throws as unknown, a failed read-back after an acknowledged save as recorded but not read back.
- REQUIRED_INPUTS (build.mjs): steps-commands.cjs, steps-model.cjs and steps-host.mjs join it, after sleep-host.mjs.
  steps-host.mjs could not be required in Part A because nothing on the page imported it; today-app.cjs now does.

### The folds, and the C-UI laws that block them (PM rulings on Part B)
- The separate weight card is NOT folded (PM: it stays where it is; the C-UI laws hold it). README section 2 ruling 5 ("The weigh-in stays the board's inline card (no
  sheet)"), C-UI-2 LOCKED ("the weigh-in stays inline (ruling 5)") and C-UI-3 (the inline weigh-in's states T-42 to
  T-52) hold it on Today. The sheet's Weight row is a second way in to the SAME write site, as the Start sheet
  (openWeighIn) already is; the PM ruled that fine under ruling 5, and the inline card stays.
- The below-Start check-in row is NOT folded (PM: it stays where it is; the C-UI laws hold it). README section 2 ruling 4 ("Today's stack is Start, Recovery, Talk") and
  C-UI-2 LOCKED ("the stack is Start, Recovery, Talk and nothing else") hold it in the stack. The sheet's Check in
  row opens the same recovery screen.
- The bottom Sleep link IS folded into Log today (PM ruling). It was preview-owned (DECISIONS:167), the approved board has no sleep entry, and
  C-UI-7 governs the sleep screen behind it, which is unchanged; no C-UI law holds the link. The sheet's Sleep row
  says the same hours and opens the same screen.
- The card itself is a new row on Today that the approved board does not draw, so C-UI-2 ACCEPTANCE (Today's
  statesheet green within tolerance of the prototype) does not cover it; it is preview-owned, as Ask Coach is.

### Fable's Part A debts
- D1: when an import is refused because a device step count collides with one the imported history already holds,
  the refusal names the day. steps-model.cjs admitStepRows's issue carries field steps_day and the phone's own
  record's local date; source-admission.mjs passes both through (steps_day joins its closed field vocabulary); the
  import screen, when steps_day leads, says under the code line "This phone and this file both have a step count for
  Thursday, September 3. Nothing on this phone was changed." (import-screen.mjs dayWords: en-US weekday, month and
  day of the local date at noon; an unreal date falls back to the code's own line). NO drop-this-day offer: the
  existing refusal UI ends the work, retracts custody and returns to the first step, and it has no per-issue action
  to hang one on; offering one is a new import flow, and the PM ruled none for now.
- D2, the blackout words of record (Part A, approved under DECISIONS:980): on the food card, "Your range is measured
  again on <date>." alone, or after a count still left, "Log food for <n> more days to measure yours. Not before
  <date>." (today-app.cjs CALORIE_GATE again, notBefore, end), with <date> in dayLabel's words ("Sunday, February
  10"); the coach says the same words (coach-intents.cjs gateAgain, gateNotBefore, gateEnd).
- Fable 4a010467 (on the accepted Part B), D1: closing the sheet with Done or Escape hands focus back to the card that
  opened it (#card-log), as the weigh-in sheet's own close does; a row that opens another screen leaves focus to that
  screen (today-app.cjs closeLogToday; food.test.mjs N2B.8, red on the accepted today-app.cjs, where focus fell to the
  body). D3: a comment beside openStepsLane says that painting the Log today card opens the steps lane, and the food
  lane through nutritionState(), as a side effect of Today's first paint (one attempt per mount, failing closed).
- D3: the register entry (replay-registry.cjs steps-commands.cjs#steps) now says that the producer's validate checks
  only the SHAPE of local_date, and that admission checks every operation's local_time and utc_offset (the offset
  must be the zone's own at that instant) and refuses LOCAL_SOURCE_CONTEXT_UNRESOLVED; food.test.mjs N2S.7 holds the
  words.

### New strings (approved under DECISIONS:980 (2), PM ruling on Part B) and codes
- today-app.cjs, the card and the sheet: "Log today", "Weight", "Food", "Steps", "Check in" (with "Sleep", the sleep
  screen's existing title), the tick " " plus a check mark and the separator " . " with the middle dot, "Done",
  "Enter food", "Enter sleep", "Nothing logged yet.", "Steps today", "Save steps", " steps" (after the count);
  the steps lane's lines: "Steps cannot be recorded on this device yet. Earned could not open its encrypted store
  here, so there is nowhere to keep them.", "These steps could not be recorded on this device, and nothing was
  recorded.", "Earned could not tell whether these steps were recorded on this device. They may have been kept and
  they may not.", "Recorded on this device. Earned could not read today's record back just now.", "Enter today's
  steps. Nothing was recorded.", "Steps are recorded as a whole number between 0 and 100000. Nothing was recorded."
  The weight row reuses the board's "Your weight in pounds", "Your weight", "lb" and the inline form's Save words;
  the check-in row reuses "Open recovery check-in". design.cjs declares the fifteen that the approved references do
  not already carry as preview runtime copy.
- import-screen.mjs (D1): "This phone and this file both have a step count for " and ". Nothing on this phone was
  changed."
- The copy lock re-measures for exactly these pieces and three owner counts in today-app.cjs ("Your weight in pounds"
  and "Your weight" once each, a third "Escape") (CL-NUTRI2B-DELTA; corpus 25eefea4 -> 2b9c2568 on the rebased Part A;
  on f4bd98c it was 66ade625 -> b7993d9c); CL-NUTRI2B-APPROVAL cites DECISIONS:980 (2). Codes, never shown: steps_day (a field),
  NO_LOCAL_STORE, STEPS_LANE_UNAVAILABLE.

### Re-pins, cells and evidence
- Re-pins, to measured values: package.test.cjs H18 32 -> 35 and H18b 59 -> 62 (REQUIRED_INPUTS, read from
  build.mjs's own text; seat-only); writer-fence.test.mjs today-app.cjs's declared seams gain "stepsHost.save" (sites
  3 -> 4), its edges gain require:./steps-model.cjs and import:./steps-host.mjs, FENCE-MODEL-HELD 34 -> 42 (eight new
  names, each a read or the lane's hand-in, listed at the pin; the first draft's 46 lost three typeof guards and an
  injection point); page-bundle.test.mjs P3-B2 164 -> 165 and P3-B5 43 -> 44 (steps-host.mjs on the boot graph, the
  builder's esbuild graph with every protected engine file held external, never read: 162 -> 163 and 161 -> 162
  non-protected inputs against the rebased Part A's, steps-host.mjs added, none removed, the route-only set unchanged at 19);
  food.test.mjs N2S.5 now pins the refusal's field and date; look-cui2 R3's feed slice ends at the trend row, since
  the Sleep link's label it ended at is gone (the anchor is now asserted present); problem.test.mjs N2-15 reaches the
  sleep screen through the card and the sheet; sleep-check.mjs (browser, seat) reads Today's sleep line from the
  sheet's Sleep row and opens sleep through it. The register is unchanged in shape; reach.cjs's ADOPT list (a spike
  artifact) does not name setStepDays and is not edited.
- New cells: food.test.mjs N2B.1 to N2B.8 (the card and its ticks from the record and no Sleep link; one sheet over an
  inert Today, Done and Escape; Save steps writes one op through the page's own lane over a real store and ticks
  Steps, two refusals write nothing; a refused save and a thrown one; no store; the three rows open their screens and
  the weight row refuses an empty box in the client's words; no card on an unverified record; Done and Escape hand
  focus back to the card); look-cui2 "N2 LOG
  TODAY" (the card in the feed above Start, preview-owned, the weigh-in card and the stack held); look-cui3 S12 R3's
  third entry and its teeth. Seat-only: local-source-admission.test.mjs S3-Q-N2-STEPS-HELD (a count the imported
  history holds refuses the device op with field steps_day and the day) and refusal-route.test.mjs N2B-D1 (the day in
  words, an unreal day falls back, a date beside another leading field changes nothing; its pure half was executed at
  the builder seat by loading only the copy and the two functions).
- Red first, re-measured on the rebase: on the rebased Part A's bytes of today-app.cjs, screens.template.html, preview.css, design.cjs, build.mjs,
  steps-model.cjs, import-screen.mjs and replay-registry.cjs, all twelve named cells fail (N2B.1 to N2B.7, N2S.5,
  N2S.7, look-cui2 N2 LOG TODAY, look-cui3 S12 R3, problem.test N2-15) and pass on these; N2B-D1's pure half fails on
  Part A's import-screen.mjs (no dayWords).
- Measured on the way: on a store that holds no installation yet, the food, sleep and steps lanes the first Today
  paint opens race to create it and the steps lane lost with STALE_REVISION (one attempt per mount, the food and sleep
  lanes' rule); with the installation in place it opened 3 runs of 3. A phone's boot() opens the installation before
  Today mounts; the suites do the same.
- Needles: s12-look 81 -> 82 (look-cui2 N2 LOG TODAY), today-17 874 -> 882 (N2B.1 to N2B.8), w6-local-source 33 ->
  34 (S3-Q-N2-STEPS-HELD) and w7-import 35 -> 36 (N2B-D1), expected, observed at the PM seat (each child also runs
  files only the seat can run); s10-copy-lock 37 -> 39 (CL-NUTRI2B-DELTA, CL-NUTRI2B-APPROVAL), measured;
  today-split-fence 417 unchanged.
- At the builder seat: the today batch 688/709 (677/698 plus N2B.1 to N2B.8, look-cui2 N2 LOG TODAY and the two copy-lock rows; the same 21 seat-only build failures), the fences batch 2209/2211 (the same two seat-only failures, P-MEASURE (g) among them), the writer fence 417/417, the copy lock 39/39, food-live-save 7/7, the coach suite 401/401 without the seat-only engine-revision-gap file, and a Chromium probe of the card and the sheet over the invented fixture athlete, with and without a store, at 390x844, 430x932 and 375x667: 90 of 90 (the card in the feed above the coach row at the feed's title size, its ticks unclipped, the workout card above Start; the sheet inside the phone, no clipped word, every control at least 44 px tall, its head on the screen and the panel scrolling at 375x667).

## Fix-forward: Today's lanes open one at a time (hosted red on aded50a, rebuild/c-nutri2b)
- The red: food.test.mjs UP13-MARKER on hosted ubuntu (run 38414783359), "Not wired yet" where nothing was expected;
  green at the Windows seat. ROOT CAUSE, measured: on a store that holds no installation yet, two hosts opened
  together race to create it, and the one that starts second is refused STALE_REVISION, every time, in either order
  (food and steps hosts on a fresh store, 32 of 32 by start order). Part B made Today's first paint open the steps
  lane beside the food and sleep lanes, so three lanes raced, and which one was refused depended on which dynamic
  import resolved first, which differs between systems: on ubuntu the food lane lost, failed closed for the mount,
  and the marker said "Not wired yet". At the Windows seat on aded50a's today-app.cjs the race is lost by the sleep
  lane, 10 of 10 (N2B.9 below).
- The fix, in the product (today-app.cjs; today-lanes.cjs is sealed and untouched): the page opens its lanes in one
  order. The food lane opens first, exactly as before; the sleep lane opens once the food lane's opening has settled
  (openSleepLaneInTurn, used by Today's sleep line and the sleep screen); the steps lane opens once both have. Each
  lane is still one attempt per mount and fails closed; with no store each still refuses at once. The test API's
  sleepReady() answers the queued opening too. No wait was added to any test and no test was loosened.
- New cell: food.test.mjs N2B.9, on a store with no installation yet (UP13-MARKER's world), the food, sleep and steps
  lanes all open, and Today says nothing about food. Red first on aded50a's today-app.cjs (10 of 10: the sleep lane is
  refused), green here.
- Evidence at the builder seat: UP13-MARKER 20 of 20 green and N2B.9 20 of 20 green, each run as its own process;
  problem.test R5 ("the page reports first-run ...") stays intermittent at the same rate with and without the fix
  (9 of 10 here, 8 of 10 on aded50a's bytes), as measured before at f4bd98c, and is not touched.
- Needles: today-17 882 -> 883 (N2B.9; expected, observed at the PM seat).
- At the builder seat: the today batch 689/710 (688/709 plus N2B.9; the same 21 seat-only build failures), the fences batch 2209/2211 (the same two seat-only failures, P-MEASURE (g) among them), the writer fence 417/417, the copy lock 39/39 (corpus unchanged, 2b9c2568), food-live-save 7/7, and the card and sheet probe 90 of 90.

## Fix-forward: Why? opens inside its own click (hosted red on 75217c6, rebuild/c-nutri2c)
- The red: gym.test.mjs P5-D1 on hosted windows (run 38420278074), a deepStrictEqual; green on ubuntu and at the
  Windows seat. ROOT CAUSE, measured: a timing dependency in the set screen, not a real difference and not the lane
  order (P5-D1 mounts the gym card alone; Today's lanes are not opened). Why? called paint(), which re-reads storage
  (fake IndexedDB, the gym host) and only then drew the words behind Why?. P5-D1 clicks Why? and reads those words
  after a fixed 20 event-loop turns. At the seat the read takes 4 to 9 turns (64 screens, 16 runs at once: at most
  10), so it passes; on a runner where the read answers after more than 20 turns the words are not there yet and
  [line, whyShown, opened] is [..., true, []]. Reproduced at the seat on 75217c6's bytes by a probe copy of P5-D1
  (untracked, removed) whose model answers read() 25 turns late: red on exactly that deepStrictEqual ("set 1: find
  your weight"); with the fix it is green at 25 and at 200 turns.
- The fix, in the product (gym-app.mjs renderActive; gym-settings-lane.mjs is sealed and untouched): Why? only shows
  or hides words the card already has, from the view it was drawn from, so its click draws them (and aria-expanded)
  at once, then asks for the same neutral repaint as before, which still reads and redraws the whole card
  (D-GSS-NEUTRAL-REPAINT, which uses the Why? toggle as its neutral repaint, is unchanged and green). No wait was
  added to any test and no test was loosened; P5-D1, its 20 turns and every assertion are as they were.
- New cell: gym.test.mjs P5-D1-NOW, with the repaint's read held, Why? is open inside its own click and closed
  inside the next, and each click still asks for its repaint (one read each). Red first on 75217c6's gym-app.mjs
  (the words are absent until the read answers), green here.
- Needles: today-17 883 -> 884 (P5-D1-NOW; expected, observed at the PM seat).
- At the builder seat: the today batch 690/711 (689/710 plus P5-D1-NOW; the same 21 seat-only build failures; D-GSS-NEUTRAL-REPAINT and the copy lock green in it), the fences batch 2209/2211 (the same two seat-only failures, P-MEASURE (g) among them), the writer fence 417/417, the copy lock 39/39 (corpus unchanged), food-live-save 7/7, s12-look 81/82 (the same seat-only C-UI-1 build failure); P5-D1 20 of 20 and P5-D1-NOW 20 of 20 green, each run as its own process, and P5-D1-NOW 0 of 10 on 75217c6's gym-app.mjs.

## E1a: the gated estimate is never shown, the app half of E1 (PM ruling; DECISIONS:989; on c223d47, rebuild/c-e1a)
- Why E1 split: E1 (b99c5e6) moved rebuild/engine/energy.cjs, and the import pins the engine tree: production-mapping.cjs
  ENGINE.treeSha256 is port.cjs engineDigest() over every rebuild/engine/*.cjs, and the one production mapping qualifies
  only a bundle whose engine block equals it (local-source-profile.cjs qualify). Every bundle sealed on E1's tree was
  refused SOURCE_ENGINE_CONTEXT_UNPROVEN (refusal-route.test.mjs P3-X4, P3-X5, P3-X7, P3-X9 to P3-X11 at the PM seat;
  hosted run 38431017580, all four rebuild jobs). E1 did not ship; c223d47 shipped alone (DECISIONS:992). E1a carries
  E1's app, coach and test half only. The engine half moves to E2b with the no-body-fat floor: energy.cjs, the one
  treeSha256 re-pin (the S11, FC09 and S14 precedent), the S3 portable-sources re-pin, s19-energy-moves.cjs, the s19
  supersession children that replace children 30, 31 and 35, UP13-FLOOR, UP13-FLOOR-CONTROL and UP13-ESTIMATE.
- No rebuild/engine byte moves and no gate is superseded here. GATE-SUPERSESSION M2-S19-LIVE (DECISIONS:989; restated at :1004 for E2b) stays
  recorded on the ledger, unused until E2b: coverage.superseded is not declared, and children 30, 31 and 35 are S14's,
  as they were.
- THE GATED ESTIMATE IS NEVER SHOWN (Fable fd80cb84 D1; the PM's ruling, recorded at DECISIONS:989, reverses
  DECISIONS:980's estimate for the gated state): while the engine's band is gated the food card's title is T-19's "A
  calorie range is not available yet." (calorieBand), with the gate line under it ("Log food for N more days and weigh in
  M more times to measure yours.") and in a blackout the day it is measured again (calorieGateLine, unchanged); the Energy
  row says T-19's words; the status line says T-19's prototype words ("<session> today. Your calorie range is not
  available yet."); N1's estimate title, its one-figure form and its status line are withdrawn from today-app.cjs
  (CALORIE_ESTIMATE, CALORIE_ESTIMATE_ONE, calorieEstimate, STATUS_CALORIE_ESTIMATE). The coach: read-tools.cjs
  today_plan gives a gated band's two ends as blanks ("the band is gated, and a gated band is never shown") and flags it
  gated (kcalGated, in place of N1's kcalEstimate); "What am I hitting today?" (coach-intents.cjs plan) says only the
  gate line, Today's card's own line, and where no gate line applies (no bodyweight yet) T-19's sentence, "A calorie
  range is not available yet." (Fable 7143a722 D1). A measured range shows exactly as before, everywhere.
- The coach's floor topic (read-tools.cjs why_this_instruction "floor"): with no finite floor it carries a blank, "no
  lean-mass estimate yet, so no floor is measured" (approved under DECISIONS:982), instead of the floor's own sentence,
  which says "NaN". read-tools.cjs only; the engine's floor fix is E2b's.
- THE CASE THAT MATTERS NOW: for an athlete with a lean-mass estimate the engine's gated band is finite today, so only the
  never-shown rule keeps its figures off the screen, and the owner's imported record can carry a lean-mass anchor.
  problem.test.mjs E1-NOFIG holds exactly that case (two rows: one figure, and a band), every surface: the food card,
  the Energy row, the status line and every page question of the coach. Its no-lean-mass row holds the band as today's
  engine gives it (no finite end until the floor fix, DECISIONS:982, E2b) and no "NaN" on any surface; E2b turns that
  row to the finite band. The NaN sweep is its own assertion (Fable on E1a: \d never matches "NaN"), on every surface
  of every row, every coach answer and the no-gate-line answer; red first with "NaN" planted in the T-19 status line
  (green without the sweep, since that row's band ends are not numbers).
- The laws: look-cui2 C-UI-2 R3 and look-cui3 T-40's DECISIONS:980 rows for the estimate's status line revert to
  asserting the prototype's T-19 words, cited DECISIONS:989, and each cell also holds that STATUS_CALORIE_ESTIMATE and
  its words are gone; the gate-line rows stand.
- Copy: the copy lock re-measures for exactly the withdrawn pieces: "Estimate: ", "Estimate: about " and " today. Your
  calorie range is an estimate for now." out, today-app.cjs's " kcal" 4 -> 2 and " to " 2 -> 1 (CL-E1-DELTA and
  CL-E1-APPROVAL citing DECISIONS:989, a layer on top of N2 part B; corpus 2b9c2568 -> 975061da, E1's own measure, as
  E1a's today-app.cjs is E1's byte for byte). The two coach blank reasons above are tool blanks' reasons, carried from E1.
- Cells: problem.test.mjs N1-CARD (T-19's title, the gate line under it moving with the counts, no estimate figure on
  Today, the Energy row T-19) and page-coach.test.cjs PC-12 (the gate line only, no calorie figure, the band's ends blanks
  in the turn, the counts licensed by their own tags) amended as E1 amended them; E1-NOFIG new, with Fable 7143a722 D1's
  no-gate-line row. Red first on c223d47's today-app.cjs, read-tools.cjs and coach-intents.cjs: N1-CARD, E1-NOFIG (its
  first lean-mass row), PC-12, look-cui2 C-UI-2 R3's status-line cell and look-cui3 T-40's status-line cell fail, and pass
  on these.
- The seat list now carries the import suites, so a red of this kind cannot hide again: rebuild/m3/w7-preview/import/test
  (live-clock, page-bundle, refusal-route, refusals, route) and rebuild/m4/import/test/production-admission.test.mjs and
  production-mapping.test.cjs. They seal and admit real bundles through port.cjs and the import route, which read the
  protected engine files, so they run at the PM seat; at the builder seat the guard refuses each of them by name
  (S15_GUARD_PROTECTED, index.cjs and migrate.cjs) and they are run there only to show they are reached.
- Needles: today-17 884 -> 885 (E1-NOFIG; expected, observed at the PM seat); s10-copy-lock 39 -> 41 (CL-E1-DELTA,
  CL-E1-APPROVAL; measured).
- At the builder seat: the today batch 693/714 (690/711 plus E1-NOFIG, CL-E1-DELTA and CL-E1-APPROVAL; the same 21 seat-only build failures), the fences batch 2209/2211 (the same two seat-only failures, P-MEASURE (g) among them), the copy lock 41/41 (corpus 975061da), the writer fence 417/417, food-live-save 7/7, the coach suite 401/401 without the seat-only engine-revision-gap file, and the import suites reached and refused by the guard by name (0 of 7 files run: they read the protected engine, PM seat).

## Polish 7: the Log today sheet, its ticks, the sleep night and Start's edge (PM, ui-pass14; on c8e86e6, E1a, rebuild/c-polish7b)
- The sheet (shots 02, 02b, 03a): the weight and the steps entries are one row shape (the box, its unit and the pack's
  .save pill; "Save steps" on one line), and the row links stay text links; Done is the sheet's one primary action
  (.primary), in a foot that is held at the panel's foot (position sticky), so at 375x667 it is on the screen without
  scrolling (measured: Done at 595 to 647 of 667). A 44 px close control beside the title (its accessible name "Close")
  closes the sheet as Done and Escape do and hands focus back to the card. Today is dimmed under the sheet (the panel's
  own shadow, 60 per cent black; no element is added over the inert page). The title is a heading (h2, 24 px) over the
  15 px section labels. No class is added: preview.css binds the look by slot (POLISH 7).
- Steps: the box has the unit "steps", a number pad (inputmode numeric, pattern [0-9]*) and the weight box's width (158
  to 207 px at 375 to 430). A kept count is said ("8,432 steps") with Change, which opens the entry with the count in
  it; a second save is a correction, a second op. A save repaints Today under the sheet, so the card's Steps tick and the
  sheet's own row tick move while the sheet is open, and focus goes to Change (to the box when the count could not be
  read back).
- Ticks (shot 03b): on Today's card a done item reads in the text colour and its tick in gold, each in a span of its own
  (data-done, data-tick); the line's words are unchanged. Each row of the sheet carries the same gold tick beside its
  label when its log is done.
- The focus ring: one rule, 2 px of the text colour 2 px off every focusable control on every screen, over the legacy
  green ring and the workout screen's user-agent revert; the text colour on --surface and --card is 16.9:1 and 16.4:1
  in ink, 15.5:1 and 15.8:1 in dawn (WCAG non-text contrast needs 3:1); the gold tick on a card is 8.6:1 and 3.5:1. A
  heading the page focuses for the screen reader (tabindex -1) still draws none.
- Sleep (shot 04a): the heading names the night in plain words ("Night of Sunday, Feb 3"; today-app.cjs nightWords, the
  weekday, short month and day in en-US), and the date box shows the same words over the picker's own face, which is
  drawn transparent, so no numeric date is on the screen to be read either way round. The box is still the one control:
  its value, max, change and calendar are as they were. The words follow the box on every input as well as on change
  (Fable on P7, D1), so they never lag what the box holds.
- NAMED DEBT D-P7-BACKDROP (Fable on P7, D3, word for word): "the dimmed backdrop is the panel's box-shadow (100vmax),
  not an element; fine for inert pages, but it will not block pointer events outside the sheet on non-inert browsers
  (inert covers that where supported)." Recorded, not paid in this batch.
- The way back to the sheet (logReturn), the open steps entry and the focus hand-off are per-mount state, held in the
  mount's closure as the sheet itself is: dispose() and the midnight re-boot start from nothing (Fable on P7, D2).
- Back to the sheet (shot 04b): from the Food, the Sleep or the check-in screen reached from the sheet (the check-in by
  the PM's ruling on P7, for consistency), "Today" (or Escape) opens the sheet again, focus on its title; reached any
  other way, Today alone.
- Start's edge (shot 01a, "Why this plan?" showing its top above the loading Start bar): on Today the body's foot runs
  22 px under the stack (app.css .ui > .stack) and Start's top lies 12 px into the stack, 10 px above the body's foot.
  The bottom fade now runs over that 12 px band and is clear at Start's top, so a row the scroll leaves under Start
  fades out above it instead of showing a sliver; a row that ends above the band is drawn whole as before (COACH V1
  BATCH 2), and at the end of the scroll nothing is faded.
- Laws moved to the new words at equal strength: problem.test.mjs's two sleep-heading assertions now hold the exact plain
  label for the night (they matched the ISO date), and sleep-check.mjs (the browser check over the build) holds the plain
  label and that it names the box's night. No check is loosened and no test is skipped.
- New strings: "Close" (the close control's accessible name) and "Change" (the steps row), approved under DECISIONS:913
  (5), the short-plain-copy rule (the PM's ruling on P7). Both are already in the approved references, so neither is
  declared in design.cjs (the N2 part B rule); the copy lock re-measures for exactly them (CL-P7-DELTA, CL-P7-APPROVAL
  citing DECISIONS:913; corpus 975061da -> ae2b1609).
- New cells, red first on c8e86e6's today-app.cjs, screens.template.html and preview.css (6 of 6): food.test.mjs P7.1
  (the heading, the close control, Done the one primary in its foot, the one entry row shape, the steps unit and pad),
  P7.2 (Change, the correction, the ticks moving while the sheet is open), P7.3 (back to the sheet from Food and Sleep,
  and not otherwise), P7.4 (the night in plain words, heading and box, following the box on input and the night chosen; the input row red
  without the input listener), P7.5 (the stylesheet
  rules and the measured contrasts), P7.6 (back to the sheet from the check-in, and not otherwise; red also on the
  polish 7 bytes before the ruling).
- The Chromium probe at the builder seat (the invented fixture athlete, 390x844, 430x932 and 375x667: Done on the
  screen, Done filled, the title larger than the labels, a 44 px close, the backdrop, every control at least 44 px, the
  two saves one style, the steps unit and width, Change after a save, the gold tick, Today ticked under the open sheet,
  a done item brighter, the night in words over a transparent picker, the ring drawn, the fade clear at Start's top, no
  sideways scroll): 87 of 87.
- Needles: today-17 885 -> 891 (P7.1 to P7.6; expected, observed at the PM seat); s10-copy-lock 41 -> 43 (CL-P7-DELTA,
  CL-P7-APPROVAL; measured).
- At the builder seat (on c8e86e6): the today batch 701/722 (693/714 plus P7.1 to P7.6, CL-P7-DELTA and CL-P7-APPROVAL; the same 21 seat-only build failures), the fences batch 2209/2211 (the same two seat-only failures, P-MEASURE (g) among them), the writer fence 417/417, the copy lock 43/43 (corpus ae2b1609, unchanged by the move), food-live-save 7/7, s12-look 81/82 (the same seat-only C-UI-1 build failure), the import suites reached and refused by the guard by name (they read the protected engine, PM seat), and the P7 Chromium probe 87 of 87.

## Polish 8: Why this plan? while gated, the sheet's rows, the steps line, sleep's room and Start's cue (PM, ui-pass15; on 637521f, rebuild/c-polish8)
- Why this plan? (the priority): while the band is gated its calories section printed the engine's own why, which
  prices the estimate in kcal and names it an estimate, against the :989 rule that a gated band is never shown. While
  gated the section now says, in plain words, "Your calorie range is measured from your food logs and weigh-ins."
  followed by the card's own gate line ("Log food for N more days and weigh in M more times to measure yours.", or the
  blackout's day), and no figure; with no gate line to say, the sentence alone (today-app.cjs WHY_CALORIES_GATED). A
  measured band is explained by the engine as before (P8.5).
- The audit of every surface that prints an engine why or reason for calories or the floor: Today's card, the Energy
  row and the status line (E1a), the page coach's today_plan (E1a), Why this plan? (this batch), and the coach's
  why_this_instruction tool (read-tools.cjs), whose "calories" topic carried the engine's why and weekly why and whose
  "floor" topic the floor's own kcal sentence. While the band is gated both are blanks in the turn ("the band is gated,
  and a gated band is never shown") and the calories topic carries the gated flag, so the scripted why_calories answer
  says the same plain sentence (coach-intents.cjs PLAIN.measuredFrom). The other topics (instruction, protein,
  maintenance, levers, status) carry no kcal figure in the gated worlds. The page coach's own questions do not read
  why_this_instruction.
- Found by the sweep and fixed in the same tool, kept by the PM's ruling on P8 (the same never-show-junk rule): with too few food days the
  maintenance topic threw (observedTDEE is null; it now carries blanks, and why_maintenance says "Maintenance is not
  measured yet."), and with no lean-mass estimate the protein topic carried "NaN g today" (now a blank, as Why this
  plan? drops that section; the guard is on the engine's target being a number that is not finite, so an engine reason
  string still passes through verbatim, science-correction-contract.test.cjs).
- E1-NOFIG now sweeps Why this plan? (its calories paragraph exactly the plain sentence and the card's gate line, and no
  band figure, kcal figure or NaN on any row of the screen), every why_this_instruction topic and every scripted answer
  that reads it (no band figure, kcal figure or NaN; no "estimate" in the calories and floor topics, as the other
  topics name the weight rate an estimate by its own name), in the three gated worlds, and the bare gated world's Why
  this plan? says the sentence alone.
- The sheet: Food, Sleep and Check in are full-width chevron rows in the Ask Coach row's look (the pack's .tcard.nav
  title and .chev, no feed dot; 342 by 52 px at 390), not underlined links; their words and screens are unchanged. The
  weight and steps rows keep their inline Save. The stray gap under the Weight label is gone (the entry row's own .field
  took the sheet's .field top margin; 30 -> 12 px, the label's own spacing). A logged weight is said once: the row's gold
  tick and the value ("182.4 lb", and its note), not the morning card's "This morning" and a second tick. A kept steps
  count and its Change are one line, "8,432 steps", the sheet's middle dot (aria-hidden) and Change (a 44 px target).
  At 375x667 the last row ends 16 px above Done's pinned foot at the end of the scroll, and Done is on the screen.
- Steps focus: an entry row's focus is its underline (the text colour and a second pixel, 16.4:1 or more), not a box
  drawn round the input; the rule covers the sheet's weight and steps boxes and Today's weigh-in card.
- Sleep: room above "How do you want to record it?" (20 px), between and inside its two chips (12 px apart, 44 px tall,
  16 px of side room) and before the box labels (18 px), and 14 px between the bed and wake boxes.
- Today at rest: measured at 390x844 the problem entry and the Measure row sit under Start at first paint (at 430x932
  Measure; at 375x667 Ask Coach, Why this plan?, the problem entry and Measure). While the list continues under Start a
  small chevron sits 18 px above the bar (drawn by the stack, no element and no word); at the end of the scroll the last
  row ends 24 px above Start's top at every width and the cue is gone. The no-ring after a tapped Done is :focus-visible
  behaving as it should for pointer input; no change.
- New string: "Your calorie range is measured from your food logs and weigh-ins." (the PM's own wording in the P8
  request), in today-app.cjs and in coach-intents.cjs PLAIN; one more " lb" owner count in today-app.cjs (2 -> 3). The
  copy lock re-measures for exactly them (CL-P8-DELTA; corpus ae2b1609 -> 1f393735); the sentence is approved under
  DECISIONS:989, the never-shown ruling (the PM's ruling on P8; CL-P8-APPROVAL cites it).
- New cells, red first on 637521f's today-app.cjs, screens.template.html and preview.css (4 of 4): food.test.mjs P8.1
  (the chevron rows), P8.2 (the weight said once), P8.3 (the steps line), P8.4 (the stylesheet rules). E1-NOFIG red on
  637521f's today-app.cjs (Why this plan?'s figure), on its coach-intents.cjs (why_calories) and on its read-tools.cjs
  (the maintenance topic throws). P8.5 (a measured band keeps the engine's why) passes on both, by design.
- The Chromium probe at the builder seat (the invented fixture athlete, 390x844, 430x932 and 375x667: no sideways
  scroll, the cue at rest and the last row clear of Start at the end, the chevron rows full width and 52 px, the weight
  gap, the last row clear of Done's foot, Done on the screen, the steps line on one row, the underline on focus, the
  sleep spacing): 51 of 51.
- Needles: today-17 891 -> 896 (P8.1 to P8.5; expected, observed at the PM seat); s10-copy-lock 43 -> 45 (CL-P8-DELTA,
  CL-P8-APPROVAL; measured).
- At the builder seat (on 637521f): the today batch 708/729 (701/722 plus P8.1 to P8.5, CL-P8-DELTA and CL-P8-APPROVAL; the same 21 seat-only build failures), the coach suite 403/404 (the one failure the guard's refusal of rebuild/engine/index.cjs in engine-revision-gap R4, PM seat), the fences batch 2209/2211 (the same two seat-only failures, P-MEASURE (g) among them), the writer fence 417/417, the copy lock 45/45 (corpus 1f393735), food-live-save 7/7, s12-look 81/82 (the same seat-only C-UI-1 build failure), the import suites reached and refused by the guard by name (they read the protected engine, PM seat), and the P8 Chromium probe 51 of 51.

## E2a: the body-fat band, height and sex on Measure, admitted on import (PM, the E2 scope; on 3d13efe, rebuild/c-e2a; no engine change)
- Measure gains an About you section, after the waist entry and before the comparison, once the markers are picked.
  It is optional and never nags: an unanswered question is asked there and nowhere else (no Today entry is added),
  and an answer is said back with a Change control beside it ("Height: 5 ft 10 in . Change", "Sex: Male . Change",
  "Body fat: 12-15% (your estimate) . Change"), the Log today sheet's steps line. Change asks the question again with
  the answer held filled in and focused. The engine reads none of it (E2b); it is stored and said back on Measure.
- Answers are changeable (the PM's ruling 1 on E2a): each save is a NEW operation, never an edit, and the latest wins,
  as a step count does. "I don't know" is a first-class choice, stored like any band and said back as "Body fat: not
  known"; "Not now" is stored as an answer with neither height nor sex and said back as "Height and sex: not given".
  Neither question is asked again by itself, and both stay changeable through Change. Not now is offered only before
  a first answer.
- The body-fat band picker: the PM's bands, men 8-11, 12-15, 16-20, 21-25, 26 or more; women 15-19, 20-24, 25-29,
  30-34, 35 or more; each a full-width row with one plain line, and no picture guide (drawn images come later). A
  recorded male or female sex is offered that sex's table; with no sex recorded, or "Prefer not to say", both tables,
  each under its heading (ruling 2). Save with nothing chosen is refused in words and writes nothing.
- Height and sex: sex is Male, Female or Prefer not to say; height is entered in feet and inches only (ruling 3; the
  app has no unit setting: weight in pounds, waist in inches), from 3 ft to 8 ft, one decimal of an inch at most; both
  are optional. A height outside the range, or Save with nothing chosen, is refused in words and writes nothing.
- The records: class body-composition-source, kind fact, written by the measure lane's one producer
  (measure-commands.cjs), read back latest-wins from the durable record (measure-host.mjs). earned/body-fat-band/v1
  carries exactly { low, high, source, table }: a band (high null for the open top band) with source "self-estimate"
  and table "men" or "women", the table it was picked from, so E2b never infers a sex from a band (Fable on E2a,
  D1); or low, high and table null with source "unknown" for "I don't know" (ruling 4). The band need only be a row
  of the table it names: either table is accepted whatever sex the body profile records, since both are offered when
  none is and a recorded sex can change later (Fable D3, noted beside bandOf). Anything else refuses
  BODY_INPUT_INVALID, and the store's validate holds the payload to those five members.
  earned/body-profile/v1 carries { sex, height }: sex male, female, prefer-not-to-say or null; height { value, unit }
  in inches (36 to 96) or centimetres (91 to 244), one decimal at most, or null.
- Import: F7 (measure-replay.cjs) answers for both new profiles beside the waist, the markers pick and the trial
  start, every save RETAINED and never projected, dated by the day recorded (they are choices, as the markers pick
  is); the admission controller names both to F7 and to the shared class (source-admission.mjs), and the register
  names them (replay-registry.cjs). A malformed band or profile refuses LOCAL_SOURCE_MEASURE_UNRESOLVED. The import
  route now says that refusal, and the shared class's LOCAL_SOURCE_BODY_COMPOSITION_UNRESOLVED, in plain words beside
  the code (import-screen.mjs REFUSAL_SENTENCE), where both stood alone.
- The look (ruling 5), preview.css E2A block, in the page's existing patterns and with no new colour, type size or
  token: the said-back line is the sheet's steps line (the answer, the middle dot, Change as a 44 px text link); the
  band rows are the pack's card rows, full width, 52 px or more, the radio at the left, a chosen row drawn as a pressed
  answer; the sex answers are the sleep screen's 44 px chips; height is the sheet's underline weigh row, whose focus is
  its underline (POLISH 8); Save is the pack's pill with its 44 px hit area; the focus ring is POLISH 7's.
- Measure's own page, folded into E2a at the PM's ruling (both found by the first probe): (a) Measure takes the
  content page's chassis, as the Import screen does: the 09-08 page inset (23 px, and 18 px at 350 px and narrower),
  the safe-area top and bottom, and the protective text glow over the scene plate; (b) the comparison tables (eleven
  columns with three markers; the trial table measured 786 px in a 390 px screen before) no longer scroll the page
  sideways: each is its own horizontal scroller on the pack's card, its Week column pinned at the left edge, with a
  soft glow of the text colour at the right edge while more columns lie beyond it (hidden at the last column). CSS
  only: the rows and cells are the table's own, so the rendered table, the export and the P-MEASURE cells that read
  them are unchanged.
- The Chromium probe at the builder seat (the invented fixture athlete, the real jsdom route frozen with the composed
  approved styles; 390x844, 430x932 and 375x667; four states: both questions asked, all answered, the band being
  changed, Not now and I don't know): the whole Measure screen never scrolls the page sideways, Measure keeps the
  content page inset, nothing reaches past the inset, the trial table scrolls inside itself with its Week column
  pinned and the right-edge cue, no sideways scroll in About you, every control a 44 px target, nothing clipped at
  the edge, no text overflowing its row, each said-back line and its Change on one row, the band rows full width and
  52 px or more, the height box's focus its underline: 114 of 114.
- Fable on E2a: D1 above (the band's table; validateBand's five members; E2A.1, E2A.4, E2A-L1, E2A-J1 and E2A-MF7
  carry it, red on the pre-D1 producer); D2, a height is said back in the unit it was stored in, centimetres staying
  centimetres (E2A.3 rows "Height: 178 cm" and "Height: 182.5 cm"; confirmed, heightWords already did); D3, the note
  beside bandOf above.
- Fable's P8 debts, carried here: D2, the sheet's weight comment now says the value and its note (today-app.cjs,
  comment only); D3, the scroll cue's placement is pinned in look-cui2 (the cue 18 px above the stack's top, and the
  pack's stack a positioned box), red with the cue planted position: fixed.
- New strings (47 pieces and 5 owner counts, CL-E2A-DELTA; corpus 1f393735 -> fe891976), approved under DECISIONS:913
  (5) until the PM records an owner line for the bands (CL-E2A-APPROVAL cites DECISIONS:913); the PM signed off the
  wording as written, all of it.
- New cells, red first on 3d13efe's bytes: measure model.test.mjs E2A.1 to E2A.4 (the producer, the height boxes and
  the said-back words, F7, the class and the register; 4 of 4 red on measure-commands.cjs, measure-model.mjs,
  measure-view.mjs, measure-replay.cjs, replay-registry.cjs and source-admission.mjs), lane.test.mjs E2A-L1 and E2A-L2
  (one op per save, the latest wins, I don't know and Not now kept and changed; 2 of 2 red on measure-commands.cjs and
  measure-host.mjs), journey.test.mjs E2A-J1 and E2A-J2 (the real Measure route: asked, said back with Change,
  changed with the answer held filled in and focused, kept over a reload, Not now and I don't know never nagging and
  still changeable, refusals in words; 2 of 2 red on the five measure product files), look-cui2 D3 (red planted). At
  the PM seat only (the guard stops the protected engine these load): measure-family.test.mjs E2A-MF7 (both admit and
  are retained through the real controller; a malformed band refuses by F7's name) and refusal-route.test.mjs E2A-IR1
  (the two plain sentences); expected red on 3d13efe's bytes, not measured here.
- At the builder seat (on 3d13efe): the today batch 711/732 (708/729 plus CL-E2A-DELTA, CL-E2A-APPROVAL and the look-cui2 D3 cell; the same 21 seat-only build failures), the coach suite 403/404 (engine-revision-gap R4, the guard's refusal of rebuild/engine/index.cjs, PM seat), the fences batch 2209/2211 (the same two seat-only failures, P-MEASURE (g) among them), the writer fence 417/417, the copy lock 47/47 (corpus fe891976), food-live-save 7/7, s12-look 82/83 (the same seat-only C-UI-1 build failure), measure-hermetic 15/15, today-17 733 passing with the seat's guard and build refusals, the four E2A measure cells among the passes, the E2a Chromium probe 114 of 114, and the import suites, d-replay-measure, d-replay-all and w7-import reached and refused by the guard by name (they read the protected engine, PM seat).

## E2b: lean mass when the model has none, the engine floor, and the import's engine tree (the owner's ruling DECISIONS:999; :982; GATE-SUPERSESSION M2-S19-LIVE, DECISIONS:1004, restating :989; on c2d6db8, rebuild/c-e2b)
- The engine change: rebuild/engine/energy.cjs alone, none of the protected five and no sealed file, by its seventeen
  declared hunks, written out as literals in rebuild/m4/workout/test/s19-energy-moves.cjs (4dd7195e -> 39757cee).
  constants.cjs is NOT moved (the PM's ruling on E2b, option 1): the stand-in's three values, LEAN_BOER,
  ANCHOR_ERR_FORMULA and BF_BAND_OPEN_SPAN, are private to energy.cjs, so the composition gains no member and S14's
  children 32, 33 and 34 carry unchanged.
- E1's floor fix (DECISIONS:982), as E1 built it (b99c5e6): calorieTarget skips a calorie floor that is not a finite
  number. atFloor(x) = Number.isFinite(floor) ? Math.max(floor, x) : x at its six sites (hiG, loG, baseHi, baseLo, hi,
  lo); a finite floor binds exactly as before. A just-enrolled athlete's gated estimate has two finite ends again; it
  is still never shown (E1a, DECISIONS:989).
- Lean mass when the model has none (DECISIONS:999). bfEst takes a stand-in only when asked (LEAN_FALLBACK), and only
  calorieFloor, proteinTarget and energyAvailability ask; only when the model has no lean mass; in this order:
  (a) a body-fat band he picked on Measure: lean = trend x (1 - the band's LOW %), the band's own range the interval;
      the table ("men" or "women") is his answer's and is never inferred, so a sex is never read off a band;
  (b) else height and a sex of male or female: Boer's published lean-body-mass formula (Boer 1984; LEAN_BOER: men
      0.407 kg + 0.267 cm - 19.2, women 0.252 kg + 0.473 cm - 48.3), source "estimate", with its own wider error,
      plus or minus 5 body-fat points, a PM CONVENTION under DECISIONS:999; a result outside 0 < lean < bodyweight is
      refused;
  (c) else nothing: "Prefer not to say", "I don't know", height alone or sex alone price no stand-in; the floor stays
      not a number and is skipped, today's behaviour, byte for byte.
  PRECEDENCE (Fable on E2b, D2; the PM's ruling): the band wins over Boer. A band he picked prices lean mass even when
  height and sex are also recorded, and Boer is read only when no band (or "I don't know") is held. A one-line note
  saying so on Measure is copy for E2c, not this package.
- PM CONVENTIONS under DECISIONS:999 (the PM's ruling on E2b): an open top band (26% or more, 35% or more) runs to its
  low end + 4 (BF_BAND_OPEN_SPAN); Boer's estimate carries plus or minus 5 body-fat points (ANCHOR_ERR_FORMULA), wider
  than the coach's eye (3.5). Both are PM conventions, not measurements (Fable on E2b, D3).
- A STAND-IN NEVER MOVES A CALORIE RANGE. calorieTarget asks calorieFloor for no stand-in (calorieFloor(s, null), and
  calorieFloor hands that to energyAvailability), so the measured range and the gated estimate are byte-identical
  whatever he told Measure, energyBalanceTarget with them; no other reader of bfEst (the anchor band, the diet exit,
  the partition, the ETA, the header, energyDensity) sees it. It feeds the floor, protein and energy availability
  only. calorieFloor says it priced from a stand-in (fallback, leanSrc) and only then, so a lean-mass athlete's floor is
  byte-identical; the floor's, the protein target's and energy availability's sentences say "estimated (from the
  body-fat range you picked)" or "estimated (from your height and sex)" and never "measured".
- THE ENERGY-AVAILABILITY SENTINEL ON A STAND-IN, accepted (the PM's ruling on E2b): EA_SPARING stays as it is; with a
  stand-in, energy availability answers for an athlete with no lean-mass anchor and 8 logged days, and the phase
  supervisor's sentinel (policy.cjs, energy availability under the sparing line) can raise on a stand-in fat-free
  mass. The band is read at its LOW end, the larger fat-free mass, which makes the warning more likely, not less: it
  errs on the safe side.
- THE SCOPE OF "THE FLOOR, PROTEIN AND ENERGY AVAILABILITY" INCLUDES THEIR CONSUMERS (Fable on E2b, D1; accepted as
  intended by the PM's ruling): the stand-in reaches every engine reader of those three, unmoved, and each acts on it
  and errs toward caution: writers.cjs:1125 (the energy-availability nudge), policy.cjs:595 (the phase supervisor's
  energy-availability sentinel and its cut-floor vetoes), the sleep and feed lines that read energy availability and
  the protein target (sleep.cjs), and the rulebook's floor figure (writers.cjs, calorieFloor). A calorie range is
  never among them.
- NAMED DEBT (the PM's ruling on E2b): writers.cjs, unmoved, still says "his current measured X kg lean mass" in its
  coach prompt (writers.cjs:2546). No screen shows it; writers.cjs stays unmoved and the words are left for a later
  package.
- Plumbing, read only: today-model.cjs puts what he told Measure on the engine's state as one member,
  s.bodyProfile = { sex, heightCm, band: { low, high, source, table } } (a height kept in inches converted, one
  decimal; "I don't know" a band with no figures), after every replay and only when he has told Measure something;
  nothing in the engine writes it. today-app.cjs opens the measure lane (measure-host.mjs) the way it opens the steps
  lane: once the steps lane has settled, one attempt per mount, failing closed with no store, and READ ONLY (its two
  reads and close(); none of its writes, the Measure screen's own); Today repaints on its opening only when he has
  told Measure something (an unconditional repaint cleared a steps box mid-entry, N2B.4), and the answers are read
  again on the way back to Today from Measure. The writer fence admits the one edge
  (import:../measure/measure-host.mjs) and FENCE-MODEL-HELD 42 -> 45 (model.today, model.setBodyFacts,
  model.bodyProfile, each a read or a lane hand-in); the declared seams are unchanged.
- The import's engine tree: production-mapping.cjs ENGINE.treeSha256 155e2f1b -> 5664120d (the S11, FC09 and S14
  precedent): port.cjs engineDigest()'s own join over the 19 names, the 14 unprotected files hashed from this tree,
  the protected five by their sealed per-file sha256 from receipts/S11.json (never opened), unmoved by Git blob id
  since the S11 seal 7c79ef1; calibrated first (c2d6db8 gives 155e2f1b exactly, 7c79ef1 gives bc45ca73); P3-M1
  confirms it at the PM seat. The S3 portable sources re-pin energy.cjs to the bytes on disk, with a "repins" row
  (path, from, to, ruling, why), as E1's.
- An older file says so: a file the PC sealed from the tree before E2b refuses SOURCE_ENGINE_CONTEXT_UNPROVEN at the
  review, and the import route now says, beside the code: "This file was made by a different version of Earned than
  the one on this phone. Export your history again on the PC and import the new file. Nothing on this phone was
  changed." The sentence is keyed on the file's own sealed engine block (import-screen.mjs sealedByOtherEngine: the
  four fields production-mapping.cjs pins, the very comparison qualify() makes), never on the code alone, since the
  same code covers a phone whose calendar or timezone cannot be proved; that refusal keeps the bare code.
- The gate supersession (DECISIONS:153, the S14 shape; GATE-SUPERSESSION M2-S19-LIVE, RULED at DECISIONS:1004, which
  restates in the runner's shape the original grant at DECISIONS:989, under the owner's ruling at :982, and for E2b
  :999), E1's block ported: coverage.superseded names the five byte-identity
  carriers, each with its why and its own evidence (redFirst its child; the census the runner's live-triggered line;
  a0-journeys, today-17 and s19-engine-files-differential the three differentials); rulingLineSha256 is the :1004
  line's, 4b65dc3d... (:989 is the original grant; its recorded sha, c4fb0a62..., had included a UTF-8 BOM, and :989
  carries its token inside prose and ends RULED + RECORDED, so the runner reads the grant from :1004). Children 30, 31 and 35 are replaced by E1's own, ported and pointed at E2b's hunks:
  - 30, s19-sup-source-carriers: SUP-1 exactly energy.cjs moves from the S14 post, by its declared hunks only, nothing
    added, S14's native-load proof replayed; SUP-P two RED plants (a third moving file; an undeclared line in
    energy.cjs); SUP-2 the carrier's verifier refuses (six leavers, energy.cjs the sixth); SUP-3; SUP-4.
  - 31, s19-sup-inherited-carriers: SUP-5, SUP-6, SUP-P (two plants), SUP-7.
  - 35, s19-engine-files-differential: 27 outside the product byte-identical to the S14 parent; the two named files
    that have moved since the S11 seal, each by its declared hunks only (energy.cjs 17 against the S14 post;
    native-load.cjs 6 against the S11 post, carried); three RED plants.
  - 32, 33 and 34 (s14-sup-defect-witnesses, -writers-differential, -second-gate) are carried unchanged: constants.cjs
    is unmoved and no engine member is added, and the stand-in is read only from a state that carries a body profile,
    which the frozen SEED does not; the PM seat re-runs them on this patch.
- Cells, red first on c2d6db8's bytes:
  - food.test.mjs: UP13-FLOOR and UP13-FLOOR-CONTROL (E1's, byte for byte); E2B-BAND (the band at its low end, its
    own interval, the open top, a women's band beside a recorded male sex priced from the band, energy availability
    answering with the stand-in's fat-free mass and naming it); E2B-FORMULA (Boer, the male and the female
    coefficients, plus or minus 5); E2B-NEITHER (prefer not to say, I don't know, height alone, sex alone: the four
    readers byte-identical to nothing told); E2B-RANGE (calorieTarget, energyBalanceTarget and every other bfEst
    reader byte-identical across every case, for the gated estimate and a measured range, and a stand-in floor that
    sits above the estimate's two ends still moves nothing); E2B-LEAN (an athlete with a lean mass is byte-identical
    whatever he told Measure); E2B-PLUMB (today-model.cjs's member, inches to centimetres, nothing when nothing is
    told); E2B-APP (the page opens the measure lane, reads the answers again on the way back from Measure, and names
    no measure write). Red on c2d6db8: UP13-FLOOR, E2B-BAND, E2B-FORMULA, E2B-RANGE, E2B-PLUMB, E2B-APP; NEITHER, LEAN
    and UP13-FLOOR-CONTROL are controls and pass on both.
  - problem.test.mjs: UP13-ESTIMATE (E1's, byte for byte; red on c2d6db8, the band's ends not numbers); E1-NOFIG's
    no-lean-mass row turned to the finite band, as its note said E2b would (re-pointed: non-finite -> finite), and a
    fourth row, a band told on Measure: a stand-in floor, the range exactly the third row's, no figure said anywhere
    (red on c2d6db8).
  - refusal-route.test.mjs (PM seat): E2B-IR1 (sealedByOtherEngine and the sentence, the calendar case keeping the
    bare code) and E2B-IR2 (a real bundle sealed by port.cjs from the tree before E2b, energy.cjs put back by undoing
    its hunks: treeSha256 155e2f1b, the same shim; refused at the review with the sentence, retracted, nothing on the
    phone moved). Expected red on c2d6db8, not measured here.
  - The import suites with the re-pinned tree (PM seat): production-mapping P3-M1, production-admission P3-P1 to
    P3-P6, refusal-route and route; page-bundle P3-B2 and P3-B5 to be measured there (measure-host.mjs is now also
    reached by a dynamic import from today-app.cjs). The step-efficacy acceptance stays historical, as at E1 (PM
    ruling).
- Copy: the import route's one sentence, approved under DECISIONS:913 (5): 3 new pieces (CL-E2B-DELTA and
  CL-E2B-APPROVAL, a layer on top of E2a; corpus fe891976 -> f31847eb). The engine's sentence insertions ("estimated
  (from the body-fat range you picked)", "estimated (from your height and sex)", the energy-availability receipt's
  "Fat-free mass X kg, estimated from ...") and the stand-in's two why texts are approved under DECISIONS:999; they are
  in no scanned file.
- Needles: today-17 900 -> 910 (UP13-FLOOR, UP13-FLOOR-CONTROL, E2B-BAND, E2B-FORMULA, E2B-NEITHER, E2B-RANGE, E2B-LEAN,
  E2B-PLUMB, E2B-APP, UP13-ESTIMATE; expected, observed at the PM seat); s10-copy-lock 47 -> 49 (CL-E2B-DELTA,
  CL-E2B-APPROVAL; measured); w7-import 37 -> 39 (E2B-IR1, E2B-IR2; expected, PM seat); children 30 # pass 5, 31 # pass
  4 and 35 its line, expected, observed at the PM seat.
- The producer revision re-bind (D-B-2; FC12 row R2-REVISION; d60dae4 on 2f9ad07): energy.cjs is one of the fourteen
  producer files PRODUCER_REVISION digests (MODULES order, then native-load and entered-load), so moving it turned
  R2-REVISION red until the constant was re-bound. rebuild/m4/workout/native-load-effects.cjs moves by exactly one
  line, its PRODUCER_REVISION string ('earned/native-load/v1+sha256:' eb919485... -> cac26b47...), recomputed by the
  row's own recipe from the file bytes (the recipe gives eb919485 on 2f9ad07's parent and cac26b47 on 2f9ad07); no
  other byte of the file moves, no engine file moves, and the five protected files are not on the recipe's list. It
  is declared in packages/S19.json as an edited product file over its S14 post (40b9f882 -> eb39bf79; regenerated by
  S19-REGEN.cjs at d60dae4, one entry). A native-load record issued under the old revision is not re-evaluated: it is
  applied from its own body after the structural checks, with the non-blocking issue PRODUCER_REVISION_ABSENT_APPLIED
  (not in BLOCKING_CODES and not a hold), so it neither blocks the day, nor hides a lift, nor moves a load. No sealed
  child pins this file's bytes (only the sealed S11 and S14 artifacts, their receipts and the package specs do, as
  records), so the gate supersession is unchanged. FC12 (native-load-options.test.cjs) 491/491 at the builder seat.
- At the builder seat (on c2d6db8): the today batch 723/744 (711/732 plus the ten E2b cells, CL-E2B-DELTA and CL-E2B-APPROVAL; the same 21 seat-only build failures), the fences batch 2209/2211 (the same two seat-only failures, P-MEASURE (g) among them), the writer fence 417/417, the copy lock 49/49 (corpus f31847eb), food-live-save 7/7, s12-look 82/83 (the same seat-only C-UI-1 build failure), measure-hermetic 15/15, today-17 743 passing with the seat's guard and build refusals (733 plus the ten E2b cells), the coach suite 403/404 (the seat-only engine-revision-gap R4), s19-engine-files-differential's check and its three plants with the protected five held unread (27 outside the product, energy.cjs 17 and native-load.cjs 6 hunks, 3 plants RED; red on c2d6db8's energy.cjs), and the import suites, page-bundle and the s19 supersession children reached and refused by the guard by name (they read the protected engine, PM seat).

## P9: Today, the workout named once (the owner asked; the PM's ruling DECISIONS:1003; on 30683ee, rebuild/c-p9; no engine change)
The owner said Today repeats too much. The PM's calls, as built (today-app.cjs, screens.template.html, preview.css,
design.cjs; no engine, sealed or protected file):
- (1) The workout is named once: Start is the workout card's own primary (#card-train, the same #start and slots),
  labelled START_WORKOUT, "Start workout"; Resume names the tap on every day (resumeLabel, RESUME_TODAYS_WORKOUT) and
  Review already did; the card's title line names the session in the engine's words. The pinned Start bar is gone, so
  Today has no fixed stack: its chassis is keyed on its own headline (#greeting), never on the frame's screen class.
  Every card state stands: rest day, done, in progress, the loading gate and the refusal's Why route.
- (2) The pinned Recovery check in bar is gone. The check-in is Log today's Check in row (log-checkin-go), and wherever
  Log today is not on the page (a blocked record) the More sheet's FIRST row is the board's Recovery check in, opening
  the same recovery screen (today-app.cjs bindMoreRow; the title is declared again in design.cjs APPROVED_COPY under
  DECISIONS:820 (2), as it was; the invitation stays withdrawn).
- (3) The inline weight row shows until today's weight is saved; Log today then ticks Weight, and its sheet's Weight row
  says the kept value with the engine's note on it. The sheet's weight entry stays. Round 4 (Fable B3): a weight saved
  on the morning card's own row is confirmed on that card in its saved state (the reading and the engine's note, no
  box) for the rest of that Today visit (today-app.cjs weighSavedHere, cleared by render() when Today is left); the
  next fresh Today (re-entry from another screen, or a reload) draws no morning card. A weight saved through the Log
  today sheet never draws it: the sheet's Weight row is its confirmation.
- (4) The status sentence is not drawn on either kind of day (it stood under Ask Coach on a training day and only said
  what the cards say); its words per state are unchanged in its slot. A blocked record keeps it under its headline.
- (5) Weight trend is drawn only with a trend figure (trendFigure), as the same quiet line from the same slot.
- (6) The five quiet links are one quiet More row and a sheet in the Log today sheet's pattern, rows in the PM's order
  (Measure, Change my routine, Why this plan?, Import my history, Report a problem), each opening exactly what its link
  opened on the same gates; Import and Change my routine are put into an open sheet when the adoption chain answers,
  without repainting it, so an open report stays open.
- (7) A rest day takes the training day's card-first face (preview.css P9 item 5): no plan label and no large headline,
  the workout card first, the engine's advice (instruction-why, the same node, whole) a quiet line: the card's third
  line under its no-session line, in that line's own secondary style (the pack's .tcard .sub; round 3, the PM's style call),
  the weigh row one compact row as on a training day, and no second weigh-in button: the card's primary is not drawn
  while the morning card's own form is, whose Save is the one tap through the one write site (submitWeighIn).
- Dead CSS (item 4 of the round): POLISH 8 item 6, the scroll cue hung from Today's stack, matched nothing and is
  removed; the same cue is drawn from Today's positioned host in the P9 block. The C-UI-2 chassis rules stay: the coach
  and workout hosts still mount a direct stack.
- Copy (approved under DECISIONS:1003, which names More and Start workout under :913 (5)): 2 new pieces ("More",
  "Start workout"), 2 withdrawn ("Optional. How are you feeling?", and "Start ", the head of the old label), one owner
  count ("Resume ", today-app.cjs 1 -> 0; design.cjs RUNTIME_COPY still declares it). "Recovery check in" is locked as
  E2b sealed it. CL-P9-DELTA and CL-P9-APPROVAL (P9_COPY_APPROVAL = DECISIONS:1003), a layer on top of E2b; corpus
  f31847eb -> 8b6210cb. The More sheet's Escape shares the Log sheet's handler, so "Escape" stays 3.
- Law replacements (old -> new; each holds its promise on the new face, none deleted or loosened; paths under
  rebuild/m3/w7-preview/today/ unless named):
  - design.cjs:137-147 APPROVED_COPY (DECISIONS:820 (2)): both Recovery row lines declared -> the invitation withdrawn,
    the title declared, carried by the More sheet's first row.
  - test/look-cui2.test.mjs:111 C-UI-2 R3 (DECISIONS:820 (2)): both lines on the template and declared -> both off
    Today's face, the invitation undeclared, the title declared under :820 and the More sheet's first row, opening
    recovery; the check-in one tap from the face through log-checkin-go.
  - test/look-cui2.test.mjs:159 COACH V1 (owner ruling 2026-10-12): the entry "above Start's stack" -> no stack, Start on
    the workout card above the Coach row; :195 N2 LOG TODAY (ruling 4, C-UI-2 LOCKED): Start and #recovery in the stack
    -> one #start in #card-train before #card-log, no #recovery, the sheet routes Check in to closeLogToday("recovery").
  - test/look-cui2.test.mjs:422 polish 8 D3 (carried in E2a): the cue pinned from the positioned stack -> no stack cue
    anywhere on Today, the cue in POLISH 8's own values from Today's positioned host, nothing un-positions it.
  - test/look-cui2.test.mjs:448 P9 (new cell): Today's chassis without a stack, Start's C-UI-2 restorations on the card,
    the cue, one More row, the sheet's six rows (Recovery first, then the PM's five) in the Log sheet's values.
  - test/view.test.mjs:188 S12b R6 (DECISIONS:915 (4)): label "Start <title>" -> START_WORKOUT, the card's title is the
    workout, Start is that card's, the title not said twice; :476 (DECISIONS:915 (4)): "Resume <title>" ->
    RESUME_TODAYS_WORKOUT under the card's title; :330, :362 Why this plan? through More; :653 review D-2 (unwired notes in
    secondary text): the Recovery row's note -> the Log card's Check in, unticked, and the sheet's CHECKIN_NO_STORE_SHORT in
    small muted text; :864 the 16 px sweep through Log today and More; new cells :962, :977, :1000, :1022, :1054, :1080,
    :1098 (calls 1, 3, 4 with the rest day, 7 the rest day, 2 the blocked More row, 5, 6).
  - test/checkin.test.mjs:404, :521, :557 (A3): the check-in reached and reported on Today's Recovery row -> through the
    Log today card, its tick and its sheet's state (LOG_NOTHING_YET, then CHECKIN_RECORDED_TODAY); back returns through
    the sheet.
  - test/copy.test.mjs:473 (review F1): the morning card's note -> the card not drawn once saved and the note in the Log
    sheet's weight row, no dash; :487 Why this plan? through More.
  - test/food.test.mjs:1491 N2B.1: #recovery present -> none, no .stack, the ticks carry Check in; :1878 P7.6: the
    #recovery half -> (round 4, Fable A2, a real tap) the Log today card tapped, its Check in row, Back: the sheet again,
    Done: Today alone; and on a Today with no Log today card the More sheet's Recovery check in row tapped, Back: Today
    alone, no sheet; :1977 P8.4: the stack cue -> no dead stack cue, the host cue in P9.
  - test/problem.test.mjs:74 the control reached through More; :358 R10 and :383 R7 (DECISIONS:140 (3)): the control on
    Today -> in the More sheet, not on the face; :1109 P5-TREND: More under the trend, Why in the sheet; :1086 P6-BOOT,
    :1245 UP13-SETTLE, :1268 P0C.2 + S12b R6 (DECISIONS:915 (4)): "Start <his title>" -> START_WORKOUT and the card names
    his workout; :3692 S6C.6b (DECISIONS:452, :468 (d)): the stamp's words kept on the session's day -> the tap named on
    every day, never the title; :3745 S6C.6e: + the same open session on its own day, Resume names the tap and the card
    names the session once.
  - test/gym.test.mjs:930 S12b R9: "Start <title>" -> START_WORKOUT on the card that names it; an owed rest day's drawn
    weigh-in primary and T-12's drawn line -> no second weigh-in button, the morning row's Save drawn and live through
    the one write site (an empty box refused in words, nothing recorded), T-12's words in the undrawn slot, the card
    saying the day has no session.
  - test/routine.test.mjs:214 RT-04 the editor through More; :558 RT-12 (S15 round 5 polish): "a rest day keeps the
    order it had" -> the round 5 block still carries no rest rule, the rest day takes the training day's face rule for
    rule in the P9 block, and on a booted rest day the advice is the workout card's third line under its no-session line,
    in that line's own .sub class (the pack's .tcard .sub: 13 px, muted, unclamped), which no preview.css rule restyles,
    clamps or hides, with no status line; :615 RT-13: the three controls -> rows of the More sheet.
  - test/coach.test.mjs:500 CV1-1: entry before Start's stack -> Start in #card-train, the entry after it, no .stack.
  - test/copy-lock.test.mjs:104 CORPUS_SHA256 7dd7c887 (round 1) -> 8b6210cb; :1059 CL-P9-DELTA, :1091 CL-P9-APPROVAL.
  - rebuild/m3/w6/test/local-today-journey.test.mjs:937, :970, :1014 (S12b R6): /^Start / and /^Resume / ->
    START_WORKOUT and RESUME_TODAYS_WORKOUT exactly, with the card naming the session.
  - rebuild/m3/w6/host/test/local-real-day.test.mjs:487 S4/8 (S12b R9, the s4-real-day child; missed in rounds 1 to 4,
    red at the gate on a2b8d8a): "the live Today draws its primary action", and on the rest day with the weight owed
    that primary live and naming the weigh-in -> the live Today draws its day's action on every day, drawn, named and
    live: on that rest day (the day the two midnights stand on) the morning card drawn with its weigh-in form, its
    Save drawn, named and enabled, its label the weigh-in, and the primary not drawn beside it (no second weigh-in
    button, call 7); on any other day the primary drawn, as before. The cell's point is untouched: one Escape repaints
    nothing and moves neither old mount, the live mount stays on Today, and the one weigh-in through the card's form
    writes only the current local date.
  - import/test/route.test.mjs:112 and refusal-route.test.mjs:422 (P3-IMPORT-UI-2): the Today Import link -> the More
    sheet's import-entry; measure/test/support.mjs:289 Measure through More.
  - Browser walks: browser-check.mjs:163 (S12b R9 by kind of day, as gym.test above), checkin-check.mjs:218,
    setup-check.mjs:518, sleep-check.mjs:141, import/test/edge-route.mjs:118, gym-check.mjs:269 and
    rebuild/m3/w6/test/local-today-browser.mjs:202 (the session's title read off the card, not the label).
  - browser-check.mjs:372 review D-1: every engine title in the headline slot keeps the primary in the first viewport
    and the headline at 33 px or more -> the same bottom assertion for every title, written into the live slot (a
    title a repaint replaced is measured again), the headline not drawn on the card-first face, and the floor
    wherever it is drawn; :532 S12b R10 the rest day with the weight owed (the drawn weigh-in primary opening the
    sheet) -> the morning row's Save inside the first viewport, no second weigh-in button, no headline, label or
    status line drawn, the advice drawn whole as the workout card's third line under its no-session line, in that line's
    computed size, colour and line height, no sideways scroll; :140 the waits for
    a visible headline -> the slot attached and the workout card drawn; :595, :604, :626, :714, :756 the waits for a visible
    morning line -> the slot attached and Log today's Weight tick.
  - Harness repairs, no promise moved: checkin-check.mjs and setup-check.mjs open Today by name (?screen=today), as
    browser-check does, because the shipped plain URL opens a fresh installation on setup (setup-first) and both walks
    stopped at their first Today read; browser-check.mjs waits for Today to settle (its lanes' repaints) before typing
    or sweeping, and :473 counts the Coach entries with page.$ (page.$ returned one handle, never a count).
- Round 4 (Fable's named debts, no needle moved):
  - B3, call 3 above: view.test.mjs:977 keeps its sheet half (a weight saved through the sheet draws no morning card)
    and adds the card's own row: after an inline save the card is drawn with the saved words (the reading and the
    engine's note, plain) and no box, Log today ticks Weight; after render('today', true) from another screen the card
    is not drawn and the tick stands. Red on either half of the change (the flag never set; the flag never cleared).
    browser-check.mjs: after the inline save in Chromium the card stays drawn with no form and the tick; after the
    reload it is not drawn.
  - A2: food.test.mjs P7.6 above, by real taps only.
  - F: preview.css POLISH 7 item 5's comment describes the box Today has now (no stack, no Start bar; the fade over the
    body's own foot, the host's cue) and S17 item 6's comment says P9 item 2 now keeps the 34 px room; S17 item 6's rule
    (padding-bottom: 34px; --fade-bot-inset: 14px) stays, its text held by look-cui2.test.mjs:312 and
    routine.test.mjs:703, and its --fade-bot-inset still read by POLISH 6's scroll margin. No rule changed.
- Needles: today-17 910 -> 917 (view.test P9 calls 1, 3, 4, 5, 6, the rest day and the blocked More row); s12-look
  83 -> 84 (look-cui2 P9); s10-copy-lock 49 -> 51 (CL-P9-DELTA, CL-P9-APPROVAL; measured).
- Package: S19-REGEN.cjs --parent e4dd53ba --worktree --receipt-line 932 re-measured 24 entries over HEAD 30683ee on
  the uncommitted tree; checkin-check.mjs and setup-check.mjs, parent-unpinned, are declared new (DECISIONS:792).
  today-app.cjs and preview.css are released paths and stay undeclared. After the commit a dry run without --worktree
  must print "0 entr(ies) would change".
- At the builder seat (on 30683ee + the uncommitted P9 tree): view 31/31, problem 145/145, gym 78/78, look-cui2 13/13,
  food 94/94, routine 27/27, copy-lock 51/51 (corpus 8b6210cb), the w6 journey 51/51, checkin 28/28, copy 39/39,
  coach 23/23, the gss annexes 25/25, the misc batch 231/231, the import route suites 21/21, measure journey and
  boundary 12/12, the two fences 480/480, setup 159/159, pwa 47/47; the children s10-copy-lock 51/51, s12-look 84/84 and
  today-17 917/917 by their own argv. Browser walks (headless Chromium; Edge for edge-route): sleep-check, checkin-check
  and edge-route PASS; browser-check passes every Today state through the real process kill and stops at its later
  reduced-motion walk to ?screen=workout (the workout route, not moved by P9, re-booted on that URL before its lane
  opens); setup-check stops on setup screen 1 ("setup-name renders at 15px", the setup screen, not moved by P9).

## Not changed
No product source but today-entry.mjs and preview.css (the two nits) and the Coach v1 files above (the one sealed file,
gym-settings-lane.mjs, only as its declaring spec above says) and E2b's files above (native-load-effects.cjs by its
one PRODUCER_REVISION line, the re-bind above) and P9's files above (today-app.cjs, screens.template.html,
preview.css and design.cjs, DECISIONS:1003), no
rebuild/engine file but energy.cjs (E2b, DECISIONS:982 and :999) and none of the protected five; no
child or argv but E2b's three replacements (children 30, 31 and 35, under GATE-SUPERSESSION M2-S19-LIVE,
DECISIONS:1004, restating :989); needles move only to measured values,
s15-routine 25 -> 27 (RT-26, RT-27), and with Coach v1 s10-copy-lock 19 -> 21 -> 23 -> 25 -> 27 -> 29 -> 31 -> 33 -> 35 -> 37 -> 39 -> 41 -> 43 -> 45 -> 47 -> 49 -> 51 (the polish's CL-COACH-POLISH-DELTA
and CL-COACH-POLISH-APPROVAL; the seat read's CL-COACH-SEAT-DELTA and CL-COACH-SEAT-APPROVAL; polish 4's CL-WEEK-POLISH4-DELTA and
CL-WEEK-POLISH4-APPROVAL; polish 5's CL-POLISH5-DELTA and CL-POLISH5-APPROVAL; polish 6's CL-POLISH6-DELTA and CL-POLISH6-APPROVAL; nutri 1's CL-NUTRI1-DELTA and CL-NUTRI1-APPROVAL; the ui-pass13 fix-forward's CL-UP13-DELTA and CL-UP13-APPROVAL; N2 part A's CL-NUTRI2A-DELTA and CL-NUTRI2A-APPROVAL; N2 part B's CL-NUTRI2B-DELTA and CL-NUTRI2B-APPROVAL; E1a's CL-E1-DELTA and CL-E1-APPROVAL; polish 7's CL-P7-DELTA and CL-P7-APPROVAL; polish 8's CL-P8-DELTA and CL-P8-APPROVAL; E2a's CL-E2A-DELTA and CL-E2A-APPROVAL; E2b's CL-E2B-DELTA and CL-E2B-APPROVAL; P9's CL-P9-DELTA and CL-P9-APPROVAL) and s12-look 64 -> 71 -> 72 -> 73 -> 74 -> 75 -> 77 -> 80 -> 81 -> 82 -> 83 -> 84
(piece 2's CV1-8; the polish edits cells, adds none; batch 2's quiet-links cell; the seat read's CV1-9; polish 3's look-cui2 cell;
polish 4's CV1-10 and look-cui2 cell; polish 5's CV1-11, look-cui2 cell and workout-look W-07 cell; polish 6's look-cui2 cell; N2 part B's look-cui2 cell; polish 8's D3 look-cui2 cell, carried in E2a; P9's look-cui2 cell), and with the
seat read today-split-fence 404 -> 417 and today-17 850 -> 852, and with polish 5 today-17 852 -> 856 (P5-NL-VERBS, P5-BOOT,
P5-TREND, P5-D1), and with polish 6 856 -> 858 (P6-BOOT, P6-DEBUT), and with nutri 1 858 -> 860 (N1-GATE, N1-CARD), and with the ui-pass13 fix-forward 860 -> 864 (UP13-COACH, UP13-SETTLE, UP13-CARBFAT, UP13-MARKER), and with N2 part A 864 -> 874 (N2S.1 to N2S.7, N2-D1, N2-D3, N2-F1), food-live-save 6 -> 7 (FLS/6), w6-local-source 31 -> 33 (S3-Q-N2-STEPS, S3-Q-N2-STEPS-REFUSED) and d-replay-all 56 -> 58 (P3-WO1 and P3-WO2 for the steps writer), and with N2 part B 874 -> 882 (N2B.1 to N2B.8), w6-local-source 33 -> 34 (S3-Q-N2-STEPS-HELD) and w7-import 35 -> 36 (N2B-D1), and with the lane-order fix-forward today-17 882 -> 883 (N2B.9), and with the Why? fix-forward 883 -> 884 (P5-D1-NOW), and with E1a 884 -> 885 (E1-NOFIG), and with polish 7 885 -> 891 (P7.1 to P7.6), and with polish 8 891 -> 896 (P8.1 to P8.5), and with E2a 896 -> 900 (E2A-L1, E2A-L2, E2A-J1, E2A-J2), measure-hermetic 11 -> 15 (E2A.1 to E2A.4), d-replay-measure 9 -> 10 (E2A-MF7) and w7-import 36 -> 37 (E2A-IR1), and with E2b 900 -> 910 (UP13-FLOOR, UP13-FLOOR-CONTROL, UP13-ESTIMATE, E2B-BAND, E2B-FORMULA, E2B-NEITHER, E2B-RANGE, E2B-LEAN, E2B-PLUMB, E2B-APP) and w7-import 37 -> 39 (E2B-IR1, E2B-IR2), and with P9 today-17 910 -> 917 (the seven view.test P9 cells); the
fence and workflow
cells gain assertions inside existing tests, so their counts stand; no check, pattern,
pin or fence is loosened; no test is skipped or deleted. b-package.cjs moves only its IDS and NO_REGISTER_IDS
lines and their comments (no `--jobs` option). The duplicate suites (steps that re-run files a package child
also runs) are left as they are.

## Evidence
Red first: the fence's P-S9-5 row fails on the S18 rebuild.yml ("the workflow's jobs must be exactly the
required both-OS jobs: font-transport, public-gates") and passes on this one; workflow.test.cjs's trigger and
no-op rows fail on the S18 slice-host.yml (6 of 8) and pass on this one (8 of 8); the F6 pins fail on the S18
runner (16 of 17) and pass on this one; S19-REGEN.test.cjs is 223 of 223, and a copy of the helper without the
two slice files fails its SCOPE row and both admit rows. A YAML comparison against the S18 workflow reads
every step of the old job but the standing one unchanged in the new file, in its order, and font-transport and
the workflow's top level unchanged. The nits: routine.test.mjs RT-26 (over the real page and workout, each
adoption offer whose sets carry one weight is headed "<lift>: make <weight> your working weight", the earned weight
keeps ": next weight") and RT-27 (the S19 rule) fail on the S18 today-entry.mjs and preview.css and pass on these;
the copy lock refuses the two new pieces by name until the corpus is re-measured; a Chromium probe of the recorded
screen at 390x844 and 430x932 reads Yes and Not now on one row, Why? on its own row above and every action inside
its card: 8 of 20 on the S18 stylesheet, 20 of 20 on this one, with the 76 layout invariants and the deployed-shell
probe (24 of 24) unchanged. PAGE_PINS (local-today-journey.test.mjs) re-pins today-entry.mjs a15606e6 -> dac88dd5,
the measured value. At the builder seat: the today batch 618/639 (the seat's 616/637 plus RT-26 and
RT-27, the same 21 seat-only failures) and the fences batch 2195/2197, the seat's own baseline.

Coach v1, red first: coach.test.mjs CV1-1 to CV1-5 and CV1-7 fail on the S19 page (coach-app.mjs, today-app.cjs,
screens.template.html, design.cjs) and pass on this one; CV1-6 (a review state still paints the pack's board) is a
control that passes on both. CV1-2 asks each answered question on the page and again through the tools outside it
and requires the same sentence and an empty untraceable() list; CV1-4 plants a turn that forgets what it read and
the page shows the general refusal, never the figures. The copy lock fails on the S19 corpus (CL-PIN, CL-HOLDS,
CL-PLANTS, CL-CLOSURE, CL-COACH-V1-DELTA) and passes re-measured (21 of 21). The writer fence failed on the first
wiring (FENCE-RELEASED-MODULE-EDGE, FENCE-MODEL-HELD, FENCE-SEALED-BINDING-ASSIGNED on a binding named workout) and
passes on this one, 404 of 404. New: coach-intents.test.cjs CI-1 to CI-5, page-coach.test.cjs PC-1 to PC-4,
sha256.test.cjs SHA-1 to SHA-3. look-cui2's Talk row cell now holds the entry: one link, the board's words, no
second line and no marker. The 76 layout invariants and the deployed-shell probe (24 of 24) hold. At the builder
seat: the today batch 627/648 (618/639 plus CV1-1 to CV1-7 and two copy-lock rows, the same 21 seat-only build
failures), the fences batch 2195/2197 and the coach suite 388/389 (the seat-only engine-revision-gap R4).
Seat-only (they load a protected engine file or build the page): view.test.mjs SC-5 (now opens the Coach from
Today's link: five questions, no figure before asking, each figure in the answer the Today model's own, typing
says it comes later), package.test.cjs (H18b/H18c at 59), scene.test.mjs C-UI-1, browser-check.mjs and
engine-revision-gap R4.

Coach v1, the page laws (red first: the PM's seat and hosted run 38295648534 at 9e41ef3). With tools.cjs on the
page, writer-enumeration P3-EN3 found a third plan-writer call (tools.cjs accept_proposal's consent.respond), page-
bundle P3-B4 found engine-revision.cjs moved from the Import route to the Today boot graph, P3-B2/P3-B5 counted
modules their pins did not, and view.test.mjs's unwired-entry cell still pinned C-61. After the split, the builder's own
measurement of the esbuild graph (protected files held external, never read) over de259ca and this tree reads:
exactly five modules added, all boot (page-coach, read-tools, tool-kernel, wave1-tools, coach-intents); the
route-only set unchanged name for name, engine-revision.cjs in it; and P3-EN3's own pattern over every page input
reads exactly its KNOWN_CALLS (t2-stage.cjs respond 2, today-entry.mjs respond 1). page-coach.test.cjs PC-6 (the
coach's import closure holds no tools.cjs, engine revision, plan-writer call, engine file or import-lane file) fails
on 9e41ef3's page-coach.cjs and passes on this one; PC-5 (Fable D1: no writer reachable from the coach's world, none
called by any page question) passes on both. The coach suite is 390/391 at the seat (the seat-only R4). Seat-only:
the page-bundle and writer-enumeration cells themselves (they build the page).

Coach v1 piece 2, red first: on 9fb60ed's sources (page-coach.cjs, read-tools.cjs, coach-intents.cjs, today-app.cjs,
today-model.cjs, gym-model.mjs, today-entry.mjs, coach-app.mjs, design.cjs) seven rows fail and pass on these:
page-coach.test.cjs PC-7 (the review ships traced; Monday reviews the week just ended, midweek this week so far;
each lift's standing, the offer reason behind Why?, the unmapped code's fallback, the hold), PC-8 (every code
sentence names a refusal native-load.cjs really raises, no dash, no figure of its own; the bodyweight line is the
approved one), PC-9 (no workout record: refused, no card), PC-2 and PC-5 (the coach gets ask() and week() only, and
the three new reads with no writer reachable), coach-intents.test.cjs CI-2 (week_review is a READ), coach.test.mjs
CV1-8 (the card on the first day of a week, Why? toggling the engine's reason, and no card midweek or with no workout
record). The copy lock refuses "How did my week go?" by name until re-measured. At the seat: the coach suite 393/394
(the seat-only R4); the today batch 628/649 (the same 21 seat-only build failures) and the fences batch 2195/2197,
with the PAGE_PINS-reading cells (food.test.mjs N1.18, machine-settings-ui.test.mjs S10) green once S19.json declares
the journey suite's new post; the 76 layout invariants and the deployed-shell probe (24 of 24) hold. Seat-only:
view.test.mjs SC-5 (now six questions).

## Acceptance
At the exact head: the fence's real row reports FENCE-RESEAL-CHILD S19 (skip); `node
rebuild/lanes/b/tooling/b-package.cjs --ci --package S19` reports PUBLIC CI EVIDENCE PASS; hosted rebuild
green on ubuntu and windows in both jobs (rebuild-package and rebuild-public) and font transport.
