# S19 LIVE - brief (M2-S19-LIVE)

Package: M2-S19-LIVE, an UNSEALED `--ci` child of the SEALED M2-S14-HOLD (artifact
rebuild/m4/spec/acceptance-s14-hold.json, receipt DECISIONS:932), the S12/S13/S15/S16/S17/S18 shape, on the
branch rebuild/c-live. It carries every byte M2-S18-OPENED declared, the CI and deploy change below and two
small product nits from UI check 6. It moves no rebuild/engine byte, declares no D-id and no gate supersession; no seal,
receipt or VERDICT; the coach ENGINE_REVISION stays M2-S14-HOLD's.

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

## Not changed
No product source but today-entry.mjs and preview.css (the two nits), no rebuild/engine file and none of the
protected five; no child or argv; one needle moves, s15-routine 25 -> 27 (RT-26, RT-27); the fence and workflow
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

## Acceptance
At the exact head: the fence's real row reports FENCE-RESEAL-CHILD S19 (skip); `node
rebuild/lanes/b/tooling/b-package.cjs --ci --package S19` reports PUBLIC CI EVIDENCE PASS; hosted rebuild
green on ubuntu and windows in both jobs (rebuild-package and rebuild-public) and font transport.
