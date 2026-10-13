# S19 LIVE - brief (M2-S19-LIVE)

Package: M2-S19-LIVE, an UNSEALED `--ci` child of the SEALED M2-S14-HOLD (artifact
rebuild/m4/spec/acceptance-s14-hold.json, receipt DECISIONS:932), the S12/S13/S15/S16/S17/S18 shape, on the
branch rebuild/c-live. It carries every byte M2-S18-OPENED declared, the CI and deploy change below, two
small product nits from UI check 6 and Coach v1 (the owner's "No-AI coach first", amended in place). It moves
no rebuild/engine byte, declares no D-id and no gate supersession; no seal, receipt or VERDICT; the coach
ENGINE_REVISION stays M2-S14-HOLD's.

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

## Not changed
No product source but today-entry.mjs and preview.css (the two nits) and the Coach v1 files above (the one sealed file,
gym-settings-lane.mjs, only as its declaring spec above says), no
rebuild/engine file and none of the protected five; no child or argv; needles move only to measured values,
s15-routine 25 -> 27 (RT-26, RT-27), and with Coach v1 s10-copy-lock 19 -> 21 -> 23 -> 25 -> 27 -> 29 -> 31 -> 33 -> 35 (the polish's CL-COACH-POLISH-DELTA
and CL-COACH-POLISH-APPROVAL; the seat read's CL-COACH-SEAT-DELTA and CL-COACH-SEAT-APPROVAL; polish 4's CL-WEEK-POLISH4-DELTA and
CL-WEEK-POLISH4-APPROVAL; polish 5's CL-POLISH5-DELTA and CL-POLISH5-APPROVAL; polish 6's CL-POLISH6-DELTA and CL-POLISH6-APPROVAL; nutri 1's CL-NUTRI1-DELTA and CL-NUTRI1-APPROVAL; the ui-pass13 fix-forward's CL-UP13-DELTA and CL-UP13-APPROVAL) and s12-look 64 -> 71 -> 72 -> 73 -> 74 -> 75 -> 77 -> 80 -> 81
(piece 2's CV1-8; the polish edits cells, adds none; batch 2's quiet-links cell; the seat read's CV1-9; polish 3's look-cui2 cell;
polish 4's CV1-10 and look-cui2 cell; polish 5's CV1-11, look-cui2 cell and workout-look W-07 cell; polish 6's look-cui2 cell), and with the
seat read today-split-fence 404 -> 417 and today-17 850 -> 852, and with polish 5 today-17 852 -> 856 (P5-NL-VERBS, P5-BOOT,
P5-TREND, P5-D1), and with polish 6 856 -> 858 (P6-BOOT, P6-DEBUT), and with nutri 1 858 -> 860 (N1-GATE, N1-CARD), and with the ui-pass13 fix-forward 860 -> 864 (UP13-COACH, UP13-SETTLE, UP13-CARBFAT, UP13-MARKER); the
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
