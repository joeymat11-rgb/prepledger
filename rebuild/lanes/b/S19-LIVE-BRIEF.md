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

## Not changed
No product source but today-entry.mjs and preview.css (the two nits) and the Coach v1 files above, no
rebuild/engine file and none of the protected five; no child or argv; needles move only to measured values,
s15-routine 25 -> 27 (RT-26, RT-27), and with Coach v1 s10-copy-lock 19 -> 21 and s12-look 64 -> 71; the fence and workflow
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

## Acceptance
At the exact head: the fence's real row reports FENCE-RESEAL-CHILD S19 (skip); `node
rebuild/lanes/b/tooling/b-package.cjs --ci --package S19` reports PUBLIC CI EVIDENCE PASS; hosted rebuild
green on ubuntu and windows in both jobs (rebuild-package and rebuild-public) and font transport.
