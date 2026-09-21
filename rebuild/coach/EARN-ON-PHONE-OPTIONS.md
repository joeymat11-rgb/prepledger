# Earn on phone: options, not a decision

## For Joe

"The phone earns weights" means your saved workouts can earn an offer to lift more.
Today, an ordinary earned one-rung step can queue by itself after the qualifying
workouts. Every option below would change that: the new weight would wait for
your yes. With A, you would also have to press Check before the offer appears.
The heavier weight appears when that lift is next allowed to move up.
Until then, your card stays as it was; a workout already started stays as it was.
You have ordered this after the look and before your trial. The choice is how.

A. Ask for a check: Finish saves your workout; a button lets you ask for the offer.
It takes the least added work, but if you forget the button, your weight stays put.

B. Offer after Finish: once your workout is saved, the app offers the earned weight.
It needs extra work to recover an unanswered offer; a failed offer must not hide a save.

C. Offer next time: Finish saves; the choice appears when you next open your workout.
It needs extra checks around starting and resuming; getting them wrong changes a workout underway.

D. Ask the coach: Finish saves; you ask for the offer and say yes in the conversation.
It adds a conversation and more connections to prove; an "accepted" reply could fail to reach your card.
With any choice, no yes means no newly accepted increase on the next card.

I recommend B because you see what you earned while the workout is still fresh.
It includes A's button to recover a missed offer, without making remembering it your job.
The coach route cannot be promised in that window on the evidence available here.

The separate fault could show and save an extra jump without your agreement, then lower it again.
You already ordered its repair; none of these choices asks you to approve that again.
As of 2026-09-21, that two-part repair has independent review with debts, but
its package is not accepted yet. There is also a separate workout-preparation
fault. When an untaken bigger offer sits beside an ordinary earned step for the
same lift, the phone can refuse to prepare that day's workout card. This happens
with or without the two-part repair, and the card stays unavailable until you
accept or decline the offer. This additional repair needs your word; it is not
included in the repair you already ordered.
Do you want to change today's automatic ordinary rung so every newly earned
weight waits for your yes, and if so which route do you want?
Do you authorize the separate workout-preparation repair described above?
If B cannot be ready and checked before the trial, would A be acceptable instead?

## Evidence and the owner's settled timing

Paper only; Astra authors, a Claude hand checks, PM4 judges. No option is
selected, built or authorized here. READ authority: DECISIONS.md:412,
:569 point 3, :613 and :631, read as selected lines from
refs/remotes/origin/rebuild/t2-client-core, without fetching.
READ revision head: a731f48393a1d7a79b0bb86afebfd8efca2d0ec3.
READ original evidence head: 89a9c4ccc9021ae9fb9efd4ef07f41863213f7fc.
The complete EARN-ON-PHONE-OPTIONS-CHECK.md at this worktree is the check.
Its measurements are attributed below; they are not reruns by this revision.
Original measurements retained below are explicitly attributed to the original
paper. All fixture inputs AND numerical outputs are INVENTED synthetic cases,
never Joe's measurements. READ labels source facts/constants; MEASURED labels
executed observations with their author; ESTIMATE labels proposed scope.
Citation lines, hashes, section/row/file IDs and milestone names are READ
identifiers, not measurements or estimates of delivery. A paragraph's label
applies to all its quantities; table quantities carry their own labels.

READ - :631 settles WHEN: the S9 seal and the look, then phone earning, then
trial day one. The split/Edit My Week follows; already-running work yields
hands, rather than becoming a prerequisite. It also orders the separate
untapped-entry repair now. Ordered is not landed: acceptance and seal completion
were not measured here. None of the options asks Joe to order that repair again.
The choices still need his word for their NEW engine behavior. No calendar
length for this window was supplied, so no day/hour completion claim follows.

## 2. What already exists and is proven

Original citations are relative to the repository and original evidence head.
Bare engine filenames in this paper mean rebuild/engine/.
READ describes inspected source, not a fresh gate pass. Proposed designs below
are conditional, not claims that missing functions already exist.

### The rule is more than hitting the card twice

READ - rebuild/engine/progression.cjs:482-491 tests the progression-bearing
prefix, not merely whether today's card targets were met. Exact predicates:
`if (r.length < pref9) return false;`
`return r[0] >= top9 && r.every((x, i) => x >= top9 - i);`
The prefix comes from progressionSetCount at :436-478; a maxed ladder uses the
moving delivered ceiling at :490. Meeting a lower card target is not an earn.

READ - rebuild/engine/earn.cjs:36-45 increments the same-load run and uses
`const confirmed = topRun >= 2 || bn.clear;` and
`if (openRir9 === 0 || ex.holdFlag)`.
The exact offer thresholds are `rirH9 >= 2` (:62),
`rirT9 >= 3` (:75, measured ladder required), and `rirT8 >= 2` (:96).
The confirmed ordinary branch mints a single-rung DEBUT (:88); the early,
hot-opener exception and two-rung alternatives are PROPOSED (:63, :80, :97).
An existing active non-PROPOSED debut blocks another (:23).
With no next load, the sighting still banks (:13-17).
These quoted numbers are SOURCE CONSTANTS, not invented athlete examples.

READ - rebuild/engine/constants.cjs:50 says exactly
`const PUBLISHED_SET_SEM = 0.9;`.
rebuild/engine/progression.cjs:581 requires `arr.length < 6` to return null;
:583 divides repeat-difference SD by `Math.SQRT2`; :589 uses that published
fallback. beatsNoise uses exactly
`const need = +(2 * Math.SQRT2 * te.reps * Math.sqrt(n)).toFixed(1);`
and `clear: margin >= need` (:603-604). The previous line must exist (:595);
earn.cjs:38 supplies it only when its load matches.
READ - rebuild/engine/writers.cjs:234-238 holds after the last two known opener
ratings are zero; `en.rir >= 1` releases the hold. :368 excludes the first
technique-era session from the generic earn. :338-349 separately adopts a
first/different logged scalar load; :261-268 lands a queued debut. A load can
therefore change by adoption rather than by earning. These are distinct acts.
READ - rebuild/engine/progression.cjs:359-370 (nextLoad) gets the next greater recorded
rung, otherwise the configured increment; missing load returns null. None of
the options below supplies its own increment, error band or effort threshold.

### Native evidence is already readable

READ - rebuild/engine/progression.cjs:608-653 derives unspent sightings in the
current load tenure and technique era, with EARNED feed lines spending them;
incomplete lines and off-top lines break the run (:643-645). This is a reader,
not a durable writer or an authorization. READ - rebuild/m4/workout/
engine-runtime.cjs:38-40, :68-78 exposes five readers, not deriveSighting,
earnWalk or completeSession. Composing a factory is not exposing a writer.

MEASURED by the original paper, not rerun here - using the invented-only constructor at
rebuild/coach/EARN-ON-PHONE-GAP-MAP.md:136-165, executed at the original evidence head:
INVENTED working load 100, rung list [90,95,100,105,110,115], set count 2,
window ceiling 12, two native sessions with loads [100,100], reps [12,11]
and exact reserve [2,0]. deriveSighting returned {topAt:100,topRun:2};
stored topRun stayed absent and queue length stayed 0. Accepted and browser
runtime cards agreed at load 100; input state stayed byte-identical.
Code exercised: progression.cjs:608-653; today.cjs:89-112; both runtime
compositions (rebuild/m4/workout/engine-runtime.cjs:53-69 and
rebuild/m3/w6/host/engine-runtime-host.cjs:97-114).
Every fixture value and output in this paragraph is INVENTED; citations are READ identifiers.

MEASURED by the original paper - same INVENTED fixture with working load null: card load null,
baselineAsk true, targets [0,0]. Changing the second INVENTED rep line to
[12,10] made deriveSighting return {topAt:null,topRun:0}. A typed EDITED entry
whose original load was 100 and current load 110 still produced a card at 100;
its actual-load match was false. This probes the reader representation, not
an edit UI transaction (same constructors and cited readers).

### The queue has several owners

READ - queue kind and queue state are different fields. A PROPOSED entry here
has kind debut. takeProposedDebut changes its state to DEBUT and supersedes
lower active debuts; it does not itself write exercise.w
(rebuild/engine/writers.cjs:187-198). Queued completion writes w and wSets and
marks ESTABLISH (:261-268); the card can prescribe newW before that landing
(rebuild/engine/today.cjs:95-98).

READ - the standing generic earn producer is earnWalk, called by the old
completeSession path (rebuild/engine/writers.cjs:376). Its births are debut /
DEBUT and debut / PROPOSED (rebuild/engine/earn.cjs:63,80,88,97).
Native clean initialization starts with queue: [] and every lift at w:null
(rebuild/m4/workout/athlete-state.cjs:136,329). READ -
Other completion branches mint standard/reclaim debuts and an information
flag (writers.cjs:280-305, :322-324). They are not native Finish callers.
The frozen seed carries debut, own, reclaim, ladder, info, phase and exit
kinds (rebuild/engine/seed.cjs:93-100,120-123); these are inherited seed
entries, not newly earned native events. No seed athlete values are reproduced
here. These are the observed birth owners of own/reclaim/ladder/phase/exit:
seed initialization, then carried source state; no standing native producer
was found in the engine factory search. The structural reader also recognizes
unlock (today.cjs:55); no unlock birth was found in the current engine .cjs
factories. A carried legacy unlock can still be read and landed
(writers.cjs:227,261-268).
Historical migration/import may carry entries; this is not an exhaustive
claim about every historical patch or external source.

READ - mergeState ends in reconcileSightings(out,{mint:true})
(rebuild/engine/merge.cjs:1096). _mintJointEarn calls the same earnWalk after
re-deriving the trace, but still finds the two entries in OLD sessionLog and
requires provisional/no-next-load receipts (rebuild/engine/migrate.cjs:35-74,
especially :51-62). Ordinary migration reconciles without mint (:2118).
READ - import preparation calls migrate(mergeState(...)) when local state
exists (rebuild/m4/import/replay-core.cjs:44-49).
Thus the shipped import merge can mint new queue items; it is not just
a transport of pre-existing queue items. Native sightings alone do not meet
that old-entry lookup. Native observation admission expressly is not consent
to invoke completion/plan effects (rebuild/m4/import/replay-core.cjs:178-188).

MEASURED BY THE CHECK, section 6 - the merge itself minted the same unsafe
PROPOSED-first pair when both invented replicas had empty queues. INVENTED
output: [PROPOSED 110, DEBUT 105], then card 110 with no tap. With each replica's
one-sighting offer still live, mint was blocked; a further qualifying completion
then minted the unsafe pair. Migration/reconciliation left entry order unchanged.
This proves a producer reachable through the shipped import preparation route;
it is not an end-to-end phone import or native Finish measurement.

### The consent-selection discrepancy is real

READ - pickStructural excludes PROPOSED (rebuild/engine/today.cjs:55).
genSession retains selected exercise IDs (:92-93), then finds the FIRST active
debut/unlock for that exercise without excluding PROPOSED (:97). It reads that
entry's newW (:98). Selection by exercise identity loses queue-entry identity.

MEASURED by the original paper - all following loads and counts are INVENTED. Same native fixture,
queue order: debut/PROPOSED newW=110, then debut/DEBUT newW=105, both unfinished
and for the same active lift. pickStructural selected the latter, 105;
genSession prescribed 110. Reversing order prescribed 105. PROPOSED alone
selected no structural item and prescribed the unchanged 100. The defect
needs an eligible item for that same lift; an isolated PROPOSED is not enough.

MEASURED by the original paper - earnWalk itself reproduced the dangerous ordering with INVENTED
w=100, topAt=100, topRun=1, reps=[12,11], previous same-load reps=[12,11],
exact opener reserve=2 and terminal reserve=3, and the INVENTED ladder above:
queue [{state:PROPOSED,newW:110},{state:DEBUT,newW:105}]; card load 110.
This executes earn.cjs:75-88 and today.cjs:92-98, not a native Finish writer.
It is stronger than merely hand-constructing a possible queue.

### Separate repair already ordered: shown AND written down

MEASURED BY THE CHECK, sections 2-5 - completeSession itself produced the
unsafe order. In its INVENTED ladder fixture, working load 100, reps [10,10],
window 8 to 10, opener reserve 2 and terminal reserve 3, the next card showed
110. Completing that card marked the UNTAPPED entry ESTABLISH and stored
ex.w=110 and ex.wSets=[110,110]. The leftover classic DEBUT then showed 105,
below stored 110, and its completion stored 105 with another ESTABLISH.
The INVENTED output sequence was 100 -> 110 -> 105: an unconsented increase,
a recorded regression without a deload/reset, and the same earn debuting twice.
A genuine tap correctly superseded the lower entry; the reversed-order control
also worked. The invariant is agreement between selected entry, card and store,
with no PROPOSED entry landing before its promised tap.

MEASURED BY THE CHECK, section 8 - changing only today.cjs gave INVENTED
card 105/store 110; changing only writers.cjs gave INVENTED card 110/store 105;
changing both gave INVENTED card 105/store 105. READ :631 orders exactly
2 clauses in 2 files: add `x.state !== "PROPOSED"` to today.cjs:97 and
writers.cjs:227, matching today.cjs:55. It does not authorize a broader
queue redesign. Both are sealed engine files (READ S8 keys :286 and :296).

MEASURED BY THE CHECK, section 7 - repaired public conformance reported
99 reference GREEN, 99 STRONG, 141 mutants detected, 70 adapter GREEN and
29 RED-as-specified, identical to baseline. No existing assertion row or golden
changed in its runs. This is not proof the defect was harmless: the public
progression laws use a reference model, not this card/writer lookup, and the
census reads targetsFor. The check reports 6 cells unable to load and 7 other
baseline failures, unchanged with repair; it is not a full green engine gate.
It did not run the port oracle, sensitivity pass or full selftest. Those owed
checks must be named and resolved under the repair's acceptance process.

CURRENT READINESS CORRECTION, 2026-09-21 - this explicitly supersedes the
inherited check section 7 inference that unchanged rows and goldens meant no
departure from the frozen implementation. The two clauses deliberately change
observable card selection and working-load landing. Unchanged narrow public
totals do not discharge that behavioral departure or the owed oracle,
sensitivity, private, CI and seal obligations. Claude review f0a5eb1a reviewed
the two-clause core with named debts; the package itself is not accepted.

READ CURRENT CAPTURE PREREQUISITE - Claude review f0a5eb1a reports that
rebuild/m4/workout/engine-capture.cjs:69 refuses the producer-issued pair in
both the repair BASE and HEAD. The reviewed two-clause repair therefore does
not prove that pair can reach the shipped workout card through capture. A third
engine repair remains owner-held: it needs Joe's own word and is neither
included in the existing permission nor proved by the two-clause repair.

READ - :631 orders the check's EPP-R1 through EPP-R7 producer-order, card,
store, regression/double-debut, tap, reversed-order and half-repair witnesses.
The repair follows its own engine review and seal path; it rides S9 if ready,
otherwise S10, and the look never waits. Native earning must consume an
accepted repaired parent (or accepted repair carried into its chosen child).
That dependency is not another taste decision or permission request.

## 3. The options

These are proposed designs, not a build brief or an owner decision.
A is the smallest slice; B is my recommendation because the offer follows the
workout without a remembered request. D adds a conversation dependency. The
selected option must then be built, reviewed and sealed after the look and
before trial;
the separate defect repair is an accepted-parent dependency, not an option.

### Shared obligations, deliberately explicit

PROPOSED invariant, subject to Joe's answer above - Log/Finish save facts, never
authorize a new load.
A later qualified Close can land an ALREADY accepted debut on source projection.
Every new offer requires a separate yes; Finish itself is not that yes. Each
option also offers adoption of a first/different observed load as a separate,
clearly named choice, not as an earned increase.

READ - DECISIONS.md:89 and rebuild/coach/TOOL-CONTRACT.md:4-6,447-488 require
engine-issued numbers and a yes through consent for coach-issued plan changes.
They do not settle whether legacy automatic ordinary earning should change.
Joe's answer in the first section is required. Using an unchanged engine rule
to generate a candidate does not authorize its automatic apply under the
proposed routes.

PROPOSED - The common engine file native-load.cjs would contain:

- evaluateNativeLoad: a pure, basis-bound offer/refusal reader. It uses the
  actual native prefix and load vector, current technique/load tenure, exact
  known effort, previous comparable line, and already-spent evidence. It
  calls deriveSighting/_deriveSightingFull, atTopOfWindow, nextLoad,
  performedLine, performedLoadMatches, performedOriginalRirSets and effortIs unchanged.
  It calls unchanged earnWalk on an isolated scratch state ONLY to obtain
  canonical earn candidates/reasons; earnWalk itself is a mutator, not a pure
  function. The scratch run must be the run BEFORE the evaluated completion,
  not a count that already includes that completion. Its receipts and queue
  cannot escape as durable automatic effects. The completeSession scalar
  writer is not used to recast rich native facts into a second session log.
- applyNativeLoadDecision: a pure state transition from an authenticated,
  accepted, engine-issued decision plus any later qualified debut completion.
  For baseline/adoption, the yes establishes w and its vector. For an earned
  increase, the yes authorizes a pending debut; the heavier CARD comes from
  its newW only when the structural picker admits it. Working w lands when
  that accepted debut is normally completed at its offered vector. The fold
  reconstructs w/wSets, authority and spend together from that completion.
  Merely accepting an earn does not move w ahead of the structural queue.
  Its output is reconstructed by the durable host, not written by the model.
  This is NEW engine behavior, including the consent boundary. It needs Joe's
  own authorization, an accepted engine brief and the full engine gate.

READ dependencies: progression.cjs:482-491,608-653 and earn.cjs:11-100 under
rebuild/engine; typed-load readers are in rebuild/engine/performed.cjs:77-99,
218-253. These source functions are reusable ingredients, not proof of the
new composition. In particular deriveSighting alone does not decide offers,
release holds, establish a baseline or make a vector bridge lossless.

PROPOSED - The yes binds lift lineage, source coverage, completion/Set/edit
identities, plan/technique/load basis, offered vector and reason. At confirm,
re-evaluate: stale evidence cannot silently accept a different offer. A pending
choice is not consent; a cancelled or failed write changes nothing. An active
workout retains its captured prescription. An accepted increase takes effect
for a subsequent capture only when the existing structural slot permits it;
acceptance is not permission to debut every lift at once. Store base/target
vectors in the decision so repeated projection never adds the increment again.

PROPOSED - The sole durable truth is the accepted proposal-response carrying
its issuance, plus the later immutable Close for debut landing; the programme
is reconstructed from those facts on the next source projection. The
new native-load-effects.cjs validates and folds it at its source frontier,
alongside completed observations. Reopen/import may reproduce an accepted
effect but may not generate a yes or rerun completeSession. Same evidence has
one semantic spend identity even if two devices create different response op
IDs. Competing accepts/edits require a defined conflict result, never clock
order invented by this paper. Undo is a compensating decision with its own
basis, not deletion of a workout. This entire protocol still needs proof.

READ - the existing respond(proposalId,answer,issuance) validates an issuance
and commits a plan/proposal-response (rebuild/client/index.cjs:349-371).
That is a usable primitive, not a native load effect writer. The stage and
local command sets currently omit respond (rebuild/m3/w6/t2-stage.cjs:9,59-84;
rebuild/m3/w6/local/local-client.mjs:49). The designs below deliberately budget
that durable exposure and its guards; calling an in-memory client alone would
not be a complete solution. The bridge publishes after commit
(rebuild/m3/w6/bridge.mjs:17-49). The shared import path must learn the new
effect family: observation-only admission is insufficient
(rebuild/m4/import/replay-core.cjs:178-182).

### Edge behavior required of EACH option

This table is part of A, B, C and D; their timing differences follow below.
These are proposed outcomes, not newly approved rules.

| Evidence or athlete action | A, B, C and D must do this | Acceptance row |
|---|---|---|
| EDITED working load (deliberate programme edit) | Respect the later athlete choice; invalidate older offers and their tenure. Re-evaluate against the new plan, never overwrite it from an old completion. | N07 |
| EDITED logged load (correction to a fact) | Preserve original and current values and edit identity; recompute unaccepted offers. An already accepted effect is not secretly rewritten; show a stale-basis repair/compensating choice. | N08 |
| Logged load differs from card | Save the actual value; do not count it as a repeat at the card's load. Offer adoption separately, with a yes; establish its own tenure. | N09 |
| Fresh lift finding working weight | Offer the completed observed numeric load as baseline, explicitly unearned. A blank, skipped, unresolved or nonnumeric observation cannot establish a numeric baseline. | N10 |
| Unequal per-set loads / changed set count | Preserve vector and original progression-bearing prefix. Never average, substitute card loads, compact a gap or use an added set as an original set. If the bridge cannot faithfully represent it, return a named limitation; closing that limitation is required before claiming general native earning. | N11 |
| Missed rep | A miss inside the progression-bearing prefix breaks a top run; a miss outside that prefix is judged by the existing prefix rule. Do not confuse meeting the card with topping the window. | N02,N11 |
| Unknown or bounded effort | Keep its typed meaning. Do not replace unknown by zero or infer exactness. A retained lower bound may prove a threshold through effortIs; the scalar earn bridge must preserve that predicate result without fabricating an exact rating. Reuse only justified branches. | N12 |
| Late log | Use witnessed source order and the plan/technique basis of the completed workout. Re-evaluate pending offers; do not reorder by local date or silently alter an active/newer plan. Refuse if governing order cannot be proved. | N13 |
| Another device / import overlap | Fold source coverage and accepted effects once. A duplicate session/yes cannot earn twice; an unproved conflict remains a named refusal. No timer or skew allowance resolves it. | N14,N15 |
| Accept / restart / undo | Commit one basis-bound yes and one effective change; restart reconstructs it, failed commit changes nothing, undo appends a compensation. | N05,N06,N16 |

A scalar-only first delivery is possible only if Joe accepts the visible
limitation on mixed-load lifts and the PM names the completion work. It must
not be called the general solution. All file/row estimates below budget the
vector obligation, not a silent scalar-only success.

### A. Ask for the check, then accept

SEE: Finish shows the saved workout; it does not offer a new weight by itself.
Check next weight shows the engine's offer/reason or why the load stays put.
After Yes, the next eligible new card shows the accepted target; before Yes
it keeps the prior authorized plan. An already-started workout stays fixed.
WRITE: Log/Finish save observations/Close. The check writes no plan effect.
Yes durably stores its issuance and response; adoption establishes working
load then, while an earn queues a target and establishes working load only
from the later qualifying completed debut. Restart reconstructs that effect.
BYTES/SEALS: new engine FC01 requires Joe's own word. From the accepted repair,
use FC03-FC13 and FA01-FA03; every S-marked file below needs the selected child
seal. Separate repair dependencies are FC02 and FC02b, never a new option choice.
RISK: he misses the button and never advances; stale evidence or duplicate
checks could apply the wrong increase. Inputs/outputs must satisfy the common
invariants and N01-N20 plus A01-A02 below.
SIZE: ESTIMATE 15 + R incremental component files, ESTIMATE 9 S8-key files + R,
ESTIMATE 22 named row families including inherited repair preservation N01.
WINDOW: the smallest credible fallback. It can fit only if the shared durable
writer/import protocol, exact parent manifest, full engine proof, independent
engine review, PM final, CI and phone restart/card witness fit before trial.
No automatic Finish/open integration is required, but a visible usable button
and recovery are required. Small UI does not make the common engine work small.

### B. Offer immediately after Finish (recommended)

SEE: Finish first confirms the workout is saved, then offers the earned weight
with a separate Yes; an ineligible workout gets a reason for staying put.
The next eligible new card changes only after Yes. A's button recovers an
unanswered still-valid offer if he leaves or the app closes.
WRITE: Close commits before evaluation; offer failure cannot revoke that save.
Only Yes persists the issued decision. Adoption establishes working load then;
an earn queues the target and working load lands from its later qualified
Close. Recovery derives the offer again without double-counting the workout.
BYTES/SEALS: new engine FC01 needs Joe's own word; FC03-FC13, FA01-FA03 and
FB01-FB02 follow the inventory's seal statuses. In addition to A's sealed
paths, gym-host.mjs is sealed. FC02/FC02b are the separate repaired dependency.
RISK: offer failure is mistaken for a lost workout, or double Finish earns
again; an unanswered offer can disappear. N01-N20, A01-A02 and B01-B02 cover
the shared obligations and saved-Close/recovery counterexamples.
SIZE: ESTIMATE 17 + R incremental component files, ESTIMATE 10 S8-key files + R,
ESTIMATE 24 named row families including inherited repair preservation N01.
WINDOW: credible only if A's whole common path is accepted in time and the
existing durable Finish acknowledgement can host the offer without waiting
for the Today split. Prove crash-after-save recovery and Saved-is-saved, then
full engine review, PM final, CI, seal and a phone Finish-to-card
witness before trial. If this does not fit, PM brings the concrete A fallback
to Joe; this paper does not silently substitute it or start a non-earning trial.

### C. Derive the offer on next open

SEE: Finish confirms save; the next fresh workout open shows any earned offer
before Start. Yes changes the next eligible new card. On resume, the active
card stays fixed and the offer clearly applies to a later workout.
WRITE: open/reload evaluates without a plan write. Yes commits the issued
response; adoption establishes working load then, while an earn queues its
target and working load lands from a later qualified Close. Start is not Yes.
BYTES/SEALS: new engine FC01 needs Joe's own word; FC03-FC13 and FA01-FA03 have
the same seal scope as A. FC02/FC02b remain the separately ordered dependency.
RISK: Start bypasses the choice; repeated open spends evidence again; a resumed
workout is silently changed. Require N01-N20, A01-A02 and C01-C03.
SIZE: ESTIMATE 15 + R incremental component files, ESTIMATE 9 S8-key files + R,
ESTIMATE 25 named row families including inherited repair preservation N01.
WINDOW: possible only if the common writer proof fits and the accepted current
open/Start composition can isolate new starts from resume without waiting for
the split. Review, seal and phone proof must include reload, import projection
and resume. Equal file count to A does not imply equal work or a faster window.

### D. Coach-mediated offer and yes

SEE: Finish confirms save; no offer appears until he asks the coach. The coach
reports the engine's current offer/refusal. A Yes bound to that offer changes
the next eligible new card; a conversational acknowledgement alone changes none.
WRITE: facts save independently. The accepted proposal's issuance and response
must reach the durable effect fold; adoption establishes working load then,
or an earn queues a target and later qualified Close establishes working load.
BYTES/SEALS: new engine FC01 needs Joe's own word; FC03-FC13, FA02 and FD01-FD04
are required. S-marked shared runtime/import/build paths need a child seal;
coach files being absent from S8 does not release their contracts or other pins.
FC02/FC02b remain the separate repair dependency.
RISK: he never asks; the coach invents a number, reuses an old yes, or reports
accepted while the card stays unchanged. Require N01-N20 and D01-D04 plus
existing coach grounding and consent checks through the actual durable host.
SIZE: ESTIMATE 17 + R incremental component files, ESTIMATE 9 S8-key files + R,
ESTIMATE 24 named row families including inherited repair preservation N01.
WINDOW: cannot credibly be the before-trial route on the evidence here. It adds
an unproved real coach request/issuance/yes/effect join to the common engine work.
Text-only could qualify only if that join is already built and independently
accepted in time, followed by full engine review, PM final, CI, child seal and
phone proof that the accepted answer survives restart and reaches the real card.
That prerequisite is not evidenced. Voice-dependent D cannot make this scoped
window without additional work outside this inventory; no voice readiness was
measured. This is a scope/dependency judgment, not a measured calendar impossibility.

### Proposed file inventory, applicable to the option IDs above

READ - the original paper's bounded query found no acceptance-s*.json under
rebuild/m2 and used acceptance-s8-real-shape.json under rebuild/m4/spec
(package identity :3-4). This revision rechecked the listed keys against BOTH
its product and executionPins maps. S means a literal key there; F means absent
from both maps, NOT exemption from review, another execution pin or future
sealing. E means engine byte: Joe's own word is needed even for a NEW file.
These are READ classifications, not a hash/gate pass or newer-parent discovery.

FC02/FC02b are READ ordered repair scope; all other touches are ESTIMATE.
They name future work, not edits authorized by this paper.
File IDs begin with F; behavior-row IDs below do not.
New file names are concrete design names, not files created in this assignment.
S8 line numbers in the last column are the key's location, not code evidence.

| ID | Proposed file | Engine? / S8 status | Proposed purpose / S8 key line |
|---|---|---|---|
| FC01 | rebuild/engine/native-load.cjs (new) | E / F | Native offer, hold/tenure qualification, accepted adoption and debut-landing transition; no new threshold |
| FC02 | rebuild/engine/today.cjs | E / S | SEPARATE ORDERED REPAIR: exclude PROPOSED at the lookup; :286 |
| FC02b | rebuild/engine/writers.cjs | E / S | SEPARATE ORDERED REPAIR: exclude PROPOSED at landing lookup; :296 |
| FC03 | rebuild/m4/workout/native-load-effects.cjs (new) | no / F | Validate source/consent/spend coverage and fold accepted effects; no scoring here |
| FC04 | rebuild/m4/workout/engine-runtime.cjs | no / S | Bind new engine reader/transition under explicit capability; :996 |
| FC05 | rebuild/m3/w6/host/engine-runtime-host.cjs | no / S | Browser mirror of that capability; :436 |
| FC06 | rebuild/m3/w6/t2-stage.cjs | no / F | Guarded staging of durable respond with issuance; preserve transaction proof |
| FC07 | rebuild/m3/w6/local/local-client.mjs | no / S | Expose that guarded staged command through durable client; :506 |
| FC08 | rebuild/m3/w6/local/today-bindings.mjs | no / S | Supply authenticated native evidence, effects and new host API; :531 |
| FC09 | rebuild/m3/w6/local/source-admission.mjs | no / S | Register native-load decision replay/coverage family; :521 |
| FC10 | rebuild/m4/import/replay-core.cjs | no / S | Reproduce authorized load effects at their source frontier, never mint on observation replay; :846 |
| FC11 | rebuild/m3/w7-preview/today/build.mjs | no / S | Include exact new modules in browser bundle/input inventory; :686 |
| FC12 | rebuild/m4/spec/native-load-options.test.cjs (new) | no / F | Common engine/host/import behavior rows and red witnesses |
| FC13 | .github/workflows/rebuild.yml | no / S | Run named rows and select accepted successor gate; :201 |
| FA01 | rebuild/m3/w7-preview/today/next-load-panel.mjs (new) | no / F | Offer, evidence, adoption distinction, yes/no and failure UI |
| FA02 | rebuild/m3/w7-preview/today/today-entry.mjs | no / S | Compose the chosen offer entry and its durable host; :791 |
| FA03 | rebuild/m3/w7-preview/today/native-load-panel.test.mjs (new) | no / F | Request/open/confirm entry rows |
| FB01 | rebuild/m3/w7-preview/today/gym-model.mjs | no / F | After-acknowledged-Close hook, never before save |
| FB02 | rebuild/m3/w7-preview/today/gym-host.mjs | no / S | Bind Finish offer/recovery to the host and panel; :701 |
| FD01 | rebuild/coach/tools.cjs | no / F | No-number native-load producer and grounded offer/yes dispatch |
| FD02 | rebuild/coach/local-world.mjs | no / F | Wire the same durable host/effect capability into the coach world |
| FD03 | rebuild/coach/TOOL-CONTRACT.md | no / F | Document new producer, basis-bound yes and effect result |
| FD04 | rebuild/coach/test/native-load.test.cjs (new) | no / F | Grounding, wrong-turn yes and durable real-card effect rows |

Option-only common scope is FC01 and FC03-FC13, consuming repaired FC02/FC02b.
A and C add FA01-FA03; B also adds FB01-FB02; D adds FA02 and FD01-FD04.
The inclusive dependency inventory counts FC02/FC02b separately from new work.
All runtime/adapter edits remain on the consequential engine path even when
the file's physical location is not rebuild/engine. F is not authority.

Seal work R is additional, common to all four. READ - S8's own spec names a
brief, parent artifact/review, runner and package
(rebuild/lanes/b/tooling/packages/S8.json:6-17,29-51), and its acceptance
artifact pins b-package.cjs in both maps
(rebuild/m4/spec/acceptance-s8-real-shape.json:301,1601). A complete future
brief must name these administrative/evidence files, not hide them in the
component estimate:

| R file | Classification and scope |
|---|---|
| rebuild/lanes/b/tooling/b-package.cjs | no / S (:301,1601); child registration/closed-profile wiring if required by the selected parent/tooling |
| rebuild/lanes/b/tooling/packages/<child>.json | no / new, F at this head; exact child ID belongs to PM, not this author |
| rebuild/lanes/b/<child>-NATIVE-LOAD-BRIEF.md | no / new, F; accepted custody and red-first contract |
| rebuild/m4/spec/acceptance-<child>-native-load.json | no / new, F before sealing; output artifact |
| rebuild/m4/spec/review-<child>-native-load.json | no / new, F before sealing; independent gate evidence |
| rebuild/lanes/b/tooling/receipts/<child>.json | no / new, F before sealing; receipt |
| rebuild/lanes/b/REPORT-<child>-NATIVE-LOAD.txt | no / new, F; one builder report plus separately named independent review evidence |

The angle-bracket paths are EXPLICIT UNBOUND NAMES, not files claimed to
exist. A child may also require ancestor carrier/supersede-cell re-pins and
coach engine-revision pins; the PM must enumerate those after choosing its
parent. I did not invent their names or claim an exact total. Therefore the
comparison counts component files plus R, not a falsely exact end-to-end
file count. No acceptance artifact or frozen law is to be edited to make an
option pass. A changed parent, the pending Today split or a discovered adapter
requirement changes this inventory and requires a revised brief before work.

### Smallest honest new behavior bar

These are proposed named ROW FAMILIES, not tests written or run in this job.
Variants within a family are necessary; the totals below count names, not
assertions or claims of coverage. Product red first means an executable
before/after witness at the real boundary; refusal-only/source-string cells
do not prove the positive effect. Where today's missing function cannot be
called, first drive the existing phone command/card boundary to show the
missing outcome. For preservation rows already green, a scoped fault variant
must turn the named row red before green is credited.

| Row | Observable result that must be proved; defect it catches |
|---|---|
| N01 REPAIR-PRESERVED | Inherit the separately ordered EPP-R1 through EPP-R7 proof and retain its behavior in the new composition: untapped entry neither shown nor stored; no down-pull/double debut; tap, reversed-order and half-repair controls. This is preservation, not a new repair decision. |
| N02 WINDOW-NOT-CARD | Hitting a lower card target is not topping the window; a miss in the progression prefix breaks the run. Stops false earns and stuck valid prefixes. |
| N03 NOISE-AND-EARLY | Ordinary first sighting stays provisional; clear-margin branch and terminal-qualified early offer follow exact existing predicates and still need Yes. Stops noise jumps. |
| N04 REPEAT-AND-HOLD | Repeated qualified tops offer the earned rung; hot opener/held state do not auto-advance; hold release follows native original opener evidence. Stops both unjustified jumps and permanent hold. |
| N05 YES-OR-NOTHING | Log, Finish, open, Start, no, cancel and failed consent never authorize a heavier card. Confirm authorizes only its issued vector; adoption and earn are distinct. |
| N06 COMMIT-RESTART | Kill before/after durable response commit, retry, rebuild cache and later qualified debut Close: one decision, one queued target, one eventual w landing, no lost facts. |
| N07 EDITED-PLAN-WINS | A deliberate working-load edit after offer creation prevents stale acceptance/replay from overriding it. Covers older imports and a changed plan generation. |
| N08 EDITED-FACT | Correct load/reps after an offer and after acceptance; pending offer invalidates, accepted effect requires explicit compensation, originals survive. |
| N09 ACTUAL-LOAD | Different actual load is preserved, does not count at card load, and only an explicitly accepted adoption changes working basis. |
| N10 FRESH-BASELINE | First qualified numeric completed load can be confirmed as baseline; blank/skipped/unresolved never becomes zero or a fabricated increment. Fresh lift can leave baselineAsk. |
| N11 VECTOR-PREFIX | Unequal loads, added/removed/skipped sets, changed set count and incomplete prefix cannot collapse into a scalar win; translated accepted vector lands correctly. |
| N12 EFFORT-VARIANTS | Exact, unknown, removed and lower-bound effort keep their meaning at all hot/early/two-rung thresholds; no invented exact reserve. |
| N13 LATE-AND-SAME-DAY | Distinct Starts on the same date survive; backdated admission follows source order, not date overwrite; unproved concurrency refuses without changing w. |
| N14 IMPORT-JOINT | Real import preparation/admission with INVENTED legacy provisional pair plus native history/consent; both merge orders and repeated import converge, legacy joint mint cannot double-spend native evidence. |
| N15 SPEND-ONCE | Same completion delivered twice and two device responses for the same offer produce one semantic effect; counting current completion in derive plus earnWalk cannot count it twice. |
| N16 DECLINE-UNDO | Decline retains facts and earns nothing; compensating undo restores the intended plan without erasing history or permitting an old yes to reapply. |
| N17 STRUCTURAL-AND-CAPTURE | Competing lifts, coApproved riders, queued debut completion and active capture: only the selected accepted queue item changes a new card; old captures and unselected lifts stay true. |
| N18 NO-NEXT-RUNG | Maxed/missing ladder banks valid sightings without inventing weight; later actual equipment information makes the existing evidence usable exactly once. |
| N19 ERA-AND-TENURE | First changed-technique session and load excursions cannot spend old-era/old-tenure sightings; renamed receipt identity still prevents duplicate earn. |
| N20 HOST-PARITY | Accepted runtime and shipped browser composition produce identical offers/refusals/effects from INVENTED inputs; no hidden old completion writer or seeded athlete fallback. |
| A01 FIND-AND-USE | Visible manual entry reaches a real eligible offer and a heavier next card after Yes; otherwise the smallest design is only a hidden API. |
| A02 REQUEST-REPEAT | Repeated checks are pure; changed evidence between check and Yes refuses the stale offer instead of silently changing its number. |
| B01 CLOSE-RECOVERY | Crash after saved Close but before offer paint: re-entry can recover that same eligible choice. |
| B02 SAVED-IS-SAVED | Offer calculation/refusal cannot undo or misreport durable Finish; double Finish does not duplicate the choice/effect. |
| C01 OPEN-TO-START | Fresh open shows the due choice before new Start; Start itself is not acceptance and cannot bypass required validation. |
| C02 OPEN-IS-READ | Repeated open/reload/import projection without Yes leaves durable plan effects unchanged. |
| C03 RESUME-FIXED | Resuming an existing capture does not replace its loads with a newly earned/adopted vector. |
| D01 COACH-ENTRY | Real text coach can request this producer and reports absence honestly; ordinary fact logging remains independent of conversation. |
| D02 NO-GUESSED-NUMBER | Caller/model quantities cannot enter native-load proposal; every spoken value is from this turn's engine result and unit. |
| D03 YES-BASIS | Wrong-turn, reused, stale-source and different-proposal yes cannot apply; correct current yes can. |
| D04 YES-TO-REAL-CARD | After a durable coach yes, restart/import yields the actual accepted debut card and later w landing, not merely an 'accepted' receipt. |

Each option also needs the existing full engine gate, unchanged-law conformance
and selftest obligations, second gate, parent/child fidelity and seal checks,
independent engine review, and CI on both supported operating systems.
The authorized team must do any protected-data proof in its authorized setting;
this paper neither runs it nor waives it. A phone witness of the selected
entry/yes/restart path remains necessary before claiming phone delivery.

### Numbers: reuse versus new policy

READ - the public research corpus already discusses confirmation and noise
(research-brief.md:37-46), but a discussion is not proof that every implementation
choice is scientifically validated. The exact implemented constants are quoted
in section 2. The science disposition leaves product repairs and choices open
(rebuild/lanes/astra/SCIENCE-AUDIT-PM-DISPOSITION.md:5,28-35).

PROPOSED - A, B, C and D need NO NEW scientific number. They are delivery and
consent designs using the current engine rule, not new training prescriptions.
Configured equipment rungs, actual performed values and source identities are
inputs, not science constants. The rows and file counts in this paper are
scope counts, not invented athlete data. No expiry age, device-skew tolerance,
new baseline-session requirement, percentage jump, confidence cutoff or weekly
earn cap has been smuggled in. Adding ANY would create a new-number obligation:
name it, locate its corpus support or state that support is absent, and obtain
the applicable ruling. This paper supplies no default number for those choices.

## 4. What the owner must rule, and what is already settled

READ :631 - timing is settled: after the seal and look, before his trial.
Repair authorization is settled only for the named clauses in FC02/FC02b.
Neither is reopened here. It does not authorize the separate
workout-preparation repair.
The owner-facing questions are in the first section: decide whether to replace
automatic ordinary earning with a yes and choose the route; authorize the
workout-preparation repair separately; name whether A is an acceptable fallback
if B cannot meet that sequence. PM must present the concrete engine scope with
that choice. A timing ruling alone does not approve FC01 or the third change.

The options preserve facts, require a separate yes for a newly issued native
change, distinguish adoption from earning, and retain the full vector/prefix
obligation. No mixed-load exclusion has been chosen. If the actual brief cannot
support those inputs, PM must return the visible limitation to Joe and name
its successor; the cost tables do not buy permission to call a scalar slice
general earning. No new scientific threshold is proposed.

PM4 chooses the accepted parent, exact file ownership and seal manifest,
builder/reviewer assignments and source/effect conflict protocol consistent
with the invariants. A later edit must not lose to an older offer; failed
consent writes nothing; replay is not consent; an active capture stays fixed.
An unresolved case must refuse visibly, retain facts and stay named work.
The PM cannot authorize engine bytes on Joe's behalf or waive the full gate.
The remaining legacy/native consent-policy scope is discussed below; the
untapped-entry defect is not a philosophical question left for that discussion.
The build brief must explicitly decide whether an untaken two-rung offer remains
beside an accepted rung and how import-merged pairs are represented. This paper
does not assume either queue design.

## 5. Comparison and before-trial dependencies

ESTIMATE - numbers count proposed component files and named row families,
not changed source lines, executed tests, hours or elapsed days. R is additional
seal/evidence administration, unbound until PM selects the accepted parent.
S8 is the READ map used for this inventory, not a claim it is the delivery parent.

| Option | Inclusive files + R (ordered repair counted) | Inclusive S8 keys + R | Incremental files + R (historical accepted-repair assumption) | Incremental S8 keys + R | Named option row families |
|---|---|---|---|---|---|
| A | ESTIMATE 17 + R | ESTIMATE 11 + R | ESTIMATE 15 + R | ESTIMATE 9 + R | ESTIMATE 22 |
| B | ESTIMATE 19 + R | ESTIMATE 12 + R | ESTIMATE 17 + R | ESTIMATE 10 + R | ESTIMATE 24 |
| C | ESTIMATE 17 + R | ESTIMATE 11 + R | ESTIMATE 15 + R | ESTIMATE 9 + R | ESTIMATE 25 |
| D | ESTIMATE 19 + R | ESTIMATE 11 + R | ESTIMATE 17 + R | ESTIMATE 9 + R | ESTIMATE 24 |

The inclusive columns land the check's missing-writer correction exactly.
The incremental columns remove BOTH repair files from the work these choices
must commission. They do not remove the repaired behavior from acceptance.
ESTIMATE row accounting: common N01-N20 = 20 families; A adds 2, B adds 4,
C adds 5 and D adds 4. N01 preserves the separately commissioned repair's
READ 7 EPP families, not another repair implementation. Excluding inherited
N01 leaves ESTIMATE 21 / 23 / 24 / 23 new option-specific/common families.
These are behavior rows, not a bound on parameterized cases or source-code
rows. Changed source-line counts were NOT measured or estimated: no prototype
or accepted implementation manifest exists. R also covers evidence for repair
carriage if it has not already landed in the selected parent; no double charge
for an already accepted repair is intended.

CURRENT UNRESOLVED SCOPE - the estimates above preserve the historical-parent
inventory and do not include a guessed workout-preparation repair. The refusal
currently observed at rebuild/m4/workout/engine-capture.cjs:69 is a separate
named prerequisite.
Its exact files, rows and seal impact remain unbound until Joe authorizes that
third engine change and PM supplies its accepted scope. The inventory is not an
exhaustive before-trial total while that prerequisite remains unresolved.

Shared readiness inputs: Joe's scoped engine word, an accepted repaired parent,
a separately authorized and accepted workout-preparation repair, a complete
source/consent/spend protocol, concrete R manifest, available author and independent reviewer,
full engine gate and owed repair checks accounted for, PM final, CI, successor
seal, and phone proof on the same accepted candidate.
Output required before trial: a saved native workout can actually earn a
basis-bound offer; Yes survives restart; the real next eligible card uses the
accepted target; the later qualified debut writes the agreed working load.
A receipt saying accepted alone is a counterexample, not completion.

READ :631 moves earning ahead of the split/Edit My Week. Existing S9 screen
release does not release engine/import/data writers; pending split work must
not become an assumed dependency. PM selects a conflict-free accepted parent
and updates the S8-based inventory against it before building. Each option's
WINDOW block names its extra conditions. A is the least integration work;
B adds post-save recovery; C adds open/Start/resume proof. D's full coach-first
scope cannot be credibly committed to this window without the unproved join
already becoming accepted. No option is measured ready and no gate is waived
by the owner's urgency. If the window slips, PM reports the unmet dependency
and returns the fallback choice; the trial must not silently start without earning.

## 6. Contradictions and open facts, not resolved here

1. READ - the original assignment named rebuild/m2/acceptance-s*.json. None was found
   there. The actual bounded-query result is S8 in rebuild/m4/spec; its maps
   drive this paper. Whether a newer off-branch child changes this inventory
   is unverified. An old path must not become a false "free file" conclusion.
2. READ - native open item O1 explicitly asks who writes w and when
   (rebuild/lanes/b/BRIEF-B-NTC-NATIVE-TREND-CONTEXT.md:1642-1646). Native Finish
   sends a session-close (rebuild/m3/w7-preview/today/gym-model.mjs:538-546),
   while the accepted runtime exposes readers (engine-runtime.cjs:38-40 under
   rebuild/m4/workout). The slice's "real engine writes" sentence
   (rebuild/slice/PLAN-SLICE-v1.md:8) and that bounded delivery do not establish
   an implemented writer join or give it an owner/date.
3. READ - DECISIONS.md:89 governs coach-issued plan changes by yes;
   TOOL-CONTRACT.md:447-488 under rebuild/coach enforces that architecture.
   The legacy rule explicitly auto-queues an ordinary DEBUT without a separate
   proposal tap (rebuild/engine/earn.cjs:66-89); the first/different scalar
   completion also adopts w (writers.cjs:338-349). All four proposed options
   would require a yes for a newly earned native change, but Joe has not yet
   ruled that policy change. I do not claim the older mechanisms already obey
   it or silently extend a historical coach ruling to all old/imported behavior.
   READ, also required by the check's "Is contradiction 3 stated fairly?":
   the ordinary no-tap DEBUT is a one-rung step under the published law
   (READ 2 qualified top sessions with an honest opener, or a difference
   2 standard errors clear of noise), and runs only when it wins the structural
   slot. PROPOSED explicitly promises "Rides only on your tap" (earn.cjs:80,97).
   The untapped defect therefore breaks the legacy engine's OWN promise; it
   is not a disagreement between old and new consent philosophy. Its repair
   is already ordered. Scope the new native yes policy, the chosen queue
   coexistence behavior and preservation of legitimate imported legacy
   decisions in the option brief, separately.
4. MEASURED BY THE CHECK - the unsafe producer order reaches both the card
   AND stored working load, then the lower leftover debut and repeated
   establishment. Import merge can mint it too. The separately ordered repair
   covers today.cjs AND writers.cjs; its accepted behavior is required by every
   option. As of 2026-09-21, Claude f0a5eb1a reviewed that two-clause core with
   named debts, but the package is not accepted. That review reports the
   separate capture consumer still refuses the producer-issued pair in BASE
   and HEAD; repairing it is a third owner-held engine change. This paper
   applies no clause.
5. READ - native deriveSighting already works through _loadTenure's native
   branch (rebuild/engine/progression.cjs:188-201,608-653), but _mintJointEarn
   still reads legacy sessionLog (rebuild/engine/migrate.cjs:51-54). Neither
   supports claiming that new native consent/spend identity converges under
   the shipped import merge. The common effect protocol is new work.
6. READ - the public research explanation describes a session-total error
   test (research-brief.md:45-46); the current code explicitly uses the error
   of the new-minus-old difference (rebuild/engine/progression.cjs:598-604).
   That source also names unmodeled covariance. The public narrative and
   engine comments give differing published-error descriptions
   (research-brief.md:37 versus rebuild/engine/earn.cjs:25-29). I preserved the
   exact code constants; I did not adjudicate the science or replace them.
7. READ - typed effort can preserve lower bounds and answer named predicates
   (rebuild/engine/performed.cjs:88-99); earnWalk expects scalar fields
   (rebuild/engine/earn.cjs:44,61,74,95). A native adapter cannot merely cast a
   bound to an exact rating. The proposed evaluator must prove that seam,
   original-set governor behavior and vector-sensitive noise comparisons.
   Reusing the existing functions does not make these obligations disappear.
8. READ - the old completion writer adopts first/different loads and can land
   queued loads (rebuild/engine/writers.cjs:261-268,338-349). Native facts have
   actual vectors and separate edit provenance
   (rebuild/engine/performed.cjs:218-253). For a new mixed-load lift the scalar
   w/vector relationship and adoption basis are not supplied by this paper.
   General delivery requires that lossless rule; a visibly limited scalar
   slice requires Joe's taste ruling. No averaged baseline is proposed.
9. READ - the coach contract cites an older respond/recordIssuance shape
   (rebuild/coach/TOOL-CONTRACT.md:481-485); the current client has an issuance-
   carrying atomic respond (rebuild/client/index.cjs:349-371). Both being
   present does not prove a durable native load effect after a coach yes.
   D must demonstrate the final card and later w landing, not only a receipt.
10. Open design facts: disposition of a corrected basis AFTER an accepted
    debut; simultaneous incompatible plan edits/accepts; undo after later
    training; source coverage when legacy joint earn and native earning meet;
    and a newly discovered rung after a maxed stack. The proposed rows name
    the boundaries but do not choose a conflict or training policy. An
    unresolved case must refuse honestly and remain named work.
11. A good first implementation must not leave "not supported" as permanent
    silence for edited/vector/late cases. These options give visible refusal
    and test obligations, not a ruling that those lifters may never advance.
    A smallest slice and a general solution must be labelled separately.

## 7. What I did not measure

This revision ran no Node process, synthetic runtime probe, test suite, build,
seal, gate, browser, phone, deployment or import. It wrote only this paper.
It did not inspect private/protected data, auth files, the protected soak or
live main source; it made no commit, push, fetch or other repository mutation
beyond the authorized uncommitted paper edit. No scratch folder was needed.

READ in this revision: the full check, the original paper, selected authority
lines and named public source/map excerpts. The original native-reader and
queue-order measurements are retained with their original attribution.
The check independently measured the writer landing, regression/double debut,
tap/reversed-order controls, merge producer and scratch half/full repairs.
Those results are MEASURED BY THE CHECK, not freshly executed by Astra here.
All their fixture loads, reps, effort ratings, dates, counts and outputs are
INVENTED. None describes the owner's weights or how often he encounters the fault.

No end-to-end native Finish/yes, durable restart, full import admission,
second-device conflict, undo or new effect convergence was measured here.
The check did not establish those outcomes either. Its completion-writer
landing must not be reported as a shipped native Finish writer: native runtime
still exposes readers. Import producer reach is stronger than a hypothetical
transport but weaker than a real phone import/Finish journey.

MEASURED in this revision by static enumeration: the inventory matches the
S8 product/executionPins key maps; inclusive files are 17 / 19 / 17 / 19 and
sealed keys 11 / 12 / 11 / 11 in A/B/C/D order. Future touch counts stay ESTIMATE.

No option's implementation time, changed code rows, reviewer availability,
current coach host readiness, newer seal parent, pending branch integration
or actual before-trial calendar duration was measured. All future file/row
budgets are ESTIMATE and exclude unbound R administration and relocations.
The inclusive map is a dependency inventory; the incremental map assumes the
separate repair is accepted. Neither is a complete accepted build manifest.
The recommendations compare dependencies, not measured days-to-delivery.

The check's public-conformance result is not a port-oracle, sensitivity,
selftest or complete engine-gate PASS. This paper does not close those debts,
rewrite frozen laws or authorize access to restricted evidence. The authorized
repair team must handle its owed checks in its allowed setting.

A Claude hand checked the original paper and ordered corrections. A later
Claude review at f0a5eb1a reviewed the two-clause repair core with debts, not
the whole package. Oracle, sensitivity, private, CI and seal obligations remain.
This readiness correction still needs its independent check and the current
PM's judgment.
No option, additional workout-preparation repair, new engine bytes, calendar promise or release
is approved by this paper.

## Revision 2: landed or disputed

READ - all six corrections are LANDED in this paper; none is DISPUTED.
"Landed" here means text corrected, never a product repair or an accepted seal.

| Check order | Disposition and location |
|---|---|
| Section 9 correction 1 | LANDED: separate-repair evidence and contradiction 4 join the card to the untapped ESTABLISH and stored w/wSets. Measurements attributed to the check. |
| Section 9 correction 2 | LANDED: FC02b adds writers.cjs and its S8 key :296; comparison gives corrected inclusive ESTIMATE 11 / 12 / 11 / 11 sealed keys and ESTIMATE 17 / 19 / 17 / 19 files + R. Incremental option costs remove both already-ordered repair files. |
| Section 9 correction 3 | LANDED: owner section, separate-repair evidence and contradiction 4 name the recorded regression and double debut. |
| Section 9 correction 4 | LANDED: import evidence explicitly names the merge-minted unsafe pair and untapped card; no native Finish or end-to-end import claim is added. |
| Section 9 correction 5 | LANDED: nextLoad citation is READ progression.cjs:359-370, re-read here. |
| "Is contradiction 3 stated fairly?" | LANDED: contradiction 3 distinguishes the lawful automatic ordinary rung from the explicit tap promise; the ordered defect repair is outside the options decision. |

READ :631 is incorporated separately: repair already ordered, timing settled,
option-specific before-trial conditions explicit, coach dependency not presumed
ready. No measurement contradicting the check was found or claimed.

## Revision 3: current readiness correction

READ current state on 2026-09-21 - the two-clause core has Claude review
f0a5eb1a with named debts; the package is not accepted. Its card and landing
changes deliberately depart from the frozen implementation despite unchanged
narrow public totals. Owed oracle, sensitivity, private, CI and seal gates stay
open. Claude f0a5eb1a reports capture at rebuild/m4/workout/engine-capture.cjs:69
refuses the producer-issued pair in BASE and HEAD. That third engine repair
remains owner-held and outside the existing permission, proof and historical-
parent estimates.
