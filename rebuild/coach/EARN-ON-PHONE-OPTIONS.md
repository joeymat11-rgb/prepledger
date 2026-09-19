# Earn on phone: options, not a decision

Evidence head: 89a9c4ccc9021ae9fb9efd4ef07f41863213f7fc.
Assignment: paper only. No option is approved or implemented by this paper.
READ means source inspection at that head. MEASURED means execution using
invented inputs at that head. All numerical examples are INVENTED.

## 1. The question in one screen

Today, hitting every rep twice on the phone does not earn a heavier load.
A lifter would expect the next workout to offer the next earned weight.
It still needs the other checks, and a change needs his yes.
One way: offer it when he finishes, then ask him to accept.
Another: offer it when he next opens his workout, then ask him to accept.
Another: let him ask for a check and accept the earned change there.
Another: let the coach offer it and apply it after his yes.
These are choices for Joe, not instructions to build.

The evidence for today is in section 2. The choices remain unapproved.

## 2. What already exists and is proven

All citations are relative to the repository and the evidence head above.
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
READ - rebuild/engine/progression.cjs:346-370 gets the next greater recorded
rung, otherwise the configured increment; missing load returns null. None of
the options below supplies its own increment, error band or effort threshold.

### Native evidence is already readable

READ - rebuild/engine/progression.cjs:608-653 derives unspent sightings in the
current load tenure and technique era, with EARNED feed lines spending them;
incomplete lines and off-top lines break the run (:643-645). This is a reader,
not a durable writer or an authorization. READ - rebuild/m4/workout/
engine-runtime.cjs:38-40, :68-78 exposes five readers, not deriveSighting,
earnWalk or completeSession. Composing a factory is not exposing a writer.

MEASURED - using the invented-only constructor printed at
rebuild/coach/EARN-ON-PHONE-GAP-MAP.md:136-165, executed again at this head:
INVENTED working load 100, rung list [90,95,100,105,110,115], set count 2,
window ceiling 12, two native sessions with loads [100,100], reps [12,11]
and exact reserve [2,0]. deriveSighting returned {topAt:100,topRun:2};
stored topRun stayed absent and queue length stayed 0. Accepted and browser
runtime cards agreed at load 100; input state stayed byte-identical.
Code exercised: progression.cjs:608-653; today.cjs:89-112; both runtime
compositions (rebuild/m4/workout/engine-runtime.cjs:53-69 and
rebuild/m3/w6/host/engine-runtime-host.cjs:97-114).
Every number in this paragraph is INVENTED fixture data or its measured result.

MEASURED - same INVENTED fixture with working load null: card load null,
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
Thus the shipped import merge can create a legacy joint earn; it is not just
a transport of pre-existing queue items. Native sightings alone do not meet
that old-entry lookup. Native observation admission expressly is not consent
to invoke completion/plan effects (rebuild/m4/import/replay-core.cjs:178-188).

### The consent-selection discrepancy is real

READ - pickStructural excludes PROPOSED (rebuild/engine/today.cjs:55).
genSession retains selected exercise IDs (:92-93), then finds the FIRST active
debut/unlock for that exercise without excluding PROPOSED (:97). It reads that
entry's newW (:98). Selection by exercise identity loses queue-entry identity.

MEASURED - all following loads and counts are INVENTED. Same native fixture,
queue order: debut/PROPOSED newW=110, then debut/DEBUT newW=105, both unfinished
and for the same active lift. pickStructural selected the latter, 105;
genSession prescribed 110. Reversing order prescribed 105. PROPOSED alone
selected no structural item and prescribed the unchanged 100. The defect
needs an eligible item for that same lift; an isolated PROPOSED is not enough.

MEASURED - earnWalk itself reproduced the dangerous ordering with INVENTED
w=100, topAt=100, topRun=1, reps=[12,11], previous same-load reps=[12,11],
exact opener reserve=2 and terminal reserve=3, and the INVENTED ladder above:
queue [{state:PROPOSED,newW:110},{state:DEBUT,newW:105}]; card load 110.
This executes earn.cjs:75-88 and today.cjs:92-98, not a native Finish writer.
It is stronger than merely hand-constructing a possible queue.

The paper does not repair it. Every viable option below budgets an authorized
engine correction and a row covering this exact order. Confirmation cannot be
claimed while an untapped alternative can supply the card's load.

## 3. The options

These are four proposed designs, not a build brief or a ranked decision.
A is the smallest complete product slice described here. D is the one I would
not pick as the first repair: it makes a basic workout capability depend on a
coach conversation. It remains a real design for a conversational product.

### Shared obligations, deliberately explicit

PROPOSED - Every option saves facts on Log and Finish without changing the
working load. It offers a specific engine-issued change and applies it only
on a separate yes. Finish means the workout is finished, not yes to a heavier
weight. All four also offer adoption of a first/different observed load as a
separate, clearly named choice, not as an earned increase.

READ - this follows the assignment's locked rule and DECISIONS.md:89;
rebuild/coach/TOOL-CONTRACT.md:4-6,447-488 requires engine-issued numbers and a
yes through consent. It is NOT a claim that the legacy automatic DEBUT already
requires a yes. That conflict is retained in section 6. Using an unchanged
engine rule to generate a candidate does not authorize its automatic apply.

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

### A. Ask for the check, then accept (smallest)

(a) Athlete sentence: "Tap Check next weight when you want; if you have earned
a change, see why and tap Yes to use it in an eligible future workout."

(b) No writer runs on Log or Finish. A user request evaluates the whole
unspent completed native history on demand; the card is a transient offer.
On confirm, applyNativeLoadDecision projects an adoption into w or an earned
increase into the accepted queue. For the latter, w lands from the later
qualified native Close when the source projection next reads it. No counter or pending
offer needs a separate persistent store.

(c) A separate Yes is mandatory for increase and adoption. The model supplies
no number; the engine emits the offer. The automatic legacy branch can only
supply a candidate under this new native contract, never a silent apply.

(d) Proposed touched files: FC01-FC13 plus FA01-FA03 in the inventory below.
Every engine edit needs Joe's own word; every S8 key needs a successor seal.
No existing queue, consent or replay file is presumed safe merely because the
new button is small.

(e) Unchanged pure functions: the common readers above. New functions:
evaluateNativeLoad, applyNativeLoadDecision, foldNativeLoadDecisions and
requestNativeLoadCheck. The request function lives in the new panel/host;
the fold lives in FC03. No on-close adapter is needed.

(f) Every edge row in the table applies at the requested check and again at
Yes. An edit/late import between those moments makes the offer stale. A fresh
lift can use the same explicit check to confirm its baseline. A missed rep
gets an honest reason for staying put. Other-device evidence must be admitted
before it can count; the button does not fetch or assume unseen history.

(g) Risks: he never finds the button, so the load never moves (A01); a repeated
check spends a sighting twice (A02/N15); scalar projection turns a different
logged load into a top at the card's load (N09/N11); the queue bug changes an
untapped offer (N01). Each is an athlete-visible failure, not just a cache bug.

(h) Smallest new bar: N01-N20 plus A01-A02, all specified below, red first.
Existing engine/reseal and both-OS CI requirements also stand.

(i) New science numbers needed: NONE for this design. It reuses the quoted
rule, actual equipment increments, and exact source identity. No expiry,
reminder interval, calibration-session count or load tolerance is introduced.

### B. Offer immediately after Finish

(a) Athlete sentence: "After your workout is saved, see the weight you have
earned and say Yes if you want to take it next time."

(b) Finish first durably records Close. After that acknowledgement the host
computes an offer from that completed basis. The offer is recoverable by
re-derivation if the app closes; it is not a load write. Only the separate
confirm persists the accepted decision: adoption projects w then; an earn
authorizes the queued target and w lands from its later qualified native Close
on the next projection. Log never changes w.
Failure to calculate an offer cannot make the saved workout disappear or
turn Saved into a false statement.

(c) Finish and Yes are distinct controls/messages. The same engine-issued,
basis-bound consent applies; neither completion nor viewing a success screen
is implied yes. Existing automatic candidates are offered under that boundary.

(d) Proposed touched files: FC01-FC13, FA01-FA03, FB01-FB02. The extra Finish hook
is free in S8 but its gym host is sealed. See the full classification below.

(e) Reuses the same unchanged pure readers. Adds offerAfterDurableClose,
recoverFinishedOffer and the shared evaluator/effect fold. No new physiology
and no completeSession call inside a Close replay.

(f) The common edge table applies. Edits after Finish stale the offer; late
Close uses its source basis; fresh/different loads are labelled adoption, not
success. Missed reps still save. Another device's Close cannot be treated as
a second completion; re-entry recovers the same evidence identity.

(g) Risks: a crash hides an earned offer forever (B01); a failed offer makes
Finish appear unsaved (B02); the app applies a change just because Finish was
tapped (N05); retry/import double-earns (N06/N14/N15); noisy evidence jumps the
load (N03/N04/N12).

(h) Smallest new bar: N01-N20, A01-A02, B01-B02. A's explicit check remains
as recovery/discoverability entry. Red first; full engine/reseal bar stands.

(i) New science numbers needed: NONE. No extra "successful workout" score,
rest interval or grace count. Recovery is driven by fact identity, not a timer.

### C. Derive the offer on next open

(a) Athlete sentence: "When you next open your workout, see any earned weight
change and choose Yes before the new workout uses it."

(b) On open, evaluate completed evidence as a pure projection; keep no durable
sighting/offer cache. Open itself writes no w. Confirm commits the accepted
decision: adoption reconstructs w then; an earn authorizes a queued debut,
whose later qualified Close establishes w on the next projection. A resumed
active capture remains fixed; the offer explicitly applies after it.

(c) Opening, scrolling, or tapping Start cannot count as Yes. The coach may
explain the engine's result but cannot create it. This is not persistent
replay of completeSession on every open.

(d) Proposed touched files: FC01-FC13, FA01-FA03. Same proposed file count as A,
but the boot/open path is more consequential and needs additional behavior
rows. No shortcut past sealed today-bindings or import replay.

(e) Reuses unchanged common readers. Adds deriveOpenLoadOffer and
revalidateBeforeStart, with the shared evaluator/effect fold. An accepted
effect is replayed once by identity, not earned again from its observations.

(f) Common edge table at open and confirm. Late logs/corrections received
between visits naturally change the unaccepted offer; edited plan authority
still wins. Fresh-lift baseline adoption appears on the next open. Missed
prefix reps remove an unaccepted earn. A second device needs the same
admitted facts/consent set to derive the same answer.

(g) Risks: a previously earned load never moves because Start bypasses the
offer (C01); merely reopening mutates the plan (C02); a corrected past session
rewrites a completed or active capture (C03/N08); import makes an already spent
pair earn again (N14/N15). The exact PROPOSED-order defect still needs N01.

(h) Smallest new bar: N01-N20, A01-A02, C01-C03, red first; full gate stands.

(i) New science numbers needed: NONE. There is no lookback expiry, minimum
elapsed time or "fresh enough" cutoff; causal admissibility is not a number.

### D. Coach-mediated offer and yes (not my first repair)

(a) Athlete sentence: "Ask the coach about your next weight; it explains the
earned change, and changes it only after you say Yes."

(b) A dedicated no-number request asks evaluateNativeLoad for the completed
evidence. The coach reads its exact result in the same turn. accept_proposal
must durably carry the issuance into the shared effect fold; on that yes the
engine projects adoption into w or authorizes the earned debut. Earned w lands
from the later qualified native Close on the next projection. No free-form
coach sentence, Log, or unconfirmed Finish authorizes that change.
Text can deliver this design before voice; voice is not an excuse to postpone
the underlying writer proof.

(c) Yes is tied to this offer, this turn and this current basis. Confirming a
fact is not accepting a plan change; a generic conversational "yes" cannot
be recycled. This directly follows the locked coach rule, but requires a NEW
native-load producer and effect join. READ - the currently documented replan
producers are volume, phase and ladder, not native earning
(rebuild/coach/TOOL-CONTRACT.md:449-475).

(d) Proposed touched files: FC01-FC13, FA02, FD01-FD04. The new coach paths are
absent from S8's two maps, but they are not released from their own contracts,
CI or future sealing. This option still edits engine and sealed import paths.

(e) Reuses unchanged pure readers and the existing proposal digest/response
primitive. New functions: requestNativeLoadProposal plus the common evaluator,
transition and effect fold; tool dispatch binds request, proposal and yes.
The model is never a numerical adapter.

(f) Common edge table; any EDITED load, new fact or late import invalidates a
conversation's old basis. Fresh/different loads get an explicit adoption
offer. Misses/unknowns get engine refusals, not a motivational increase.
Another device cannot reuse a conversation handle as consent on a new basis.

(g) Risks: no conversation means the load never moves (D01); ungrounded coach
numbers alter it (D02); a stale/wrong-turn yes accepts a different proposal
(D03); "accepted" is saved without changing the real card after restart
(D04/N06). Imported evidence can still double-earn (N14/N15).

(h) Smallest new bar: N01-N20 plus D01-D04, red first; the existing coach
traceability/consent cells and full engine/reseal bar also stand.

(i) New science numbers needed: NONE. No conversational confidence threshold,
new load increment or remembered-number shortcut. If the product adds timed
nudges or stale-offer expiry, that would need a new number and a separate
source/decision; it is not part of this option.

### Proposed file inventory, applicable to the option IDs above

READ - there is no acceptance-s*.json in rebuild/m2 at this head (bounded
directory query). The highest numbered matching artifact under rebuild/m4/spec
is acceptance-s8-real-shape.json, whose package identity is at :3-4. I parsed
BOTH its product and executionPins maps, rather than assuming a directory is
sealed. S below means a literal key there; F means absent from both maps at
this head, NOT exemption from review, an execution pin elsewhere, or future
sealing. E means engine byte: Joe's own word is needed even for a NEW file.
These classifications are READ; this was a key query, not a hash/gate run.

Every listed component is a PROPOSED touch, not an instruction to edit it.
File IDs begin with F; behavior-row IDs below do not.
New file names are concrete design names, not files created in this assignment.
S8 line numbers in the last column are the key's location, not code evidence.

| ID | Proposed file | Engine? / S8 status | Proposed purpose / S8 key line |
|---|---|---|---|
| FC01 | rebuild/engine/native-load.cjs (new) | E / F | Native offer, hold/tenure qualification, accepted adoption and debut-landing transition; no new threshold |
| FC02 | rebuild/engine/today.cjs | E / S | Retain exact selected queue item, preventing untapped-load selection; :286 |
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

A adds FA01-FA03 to FC01-FC13. B adds FA01-FA03 and FB01-FB02. C adds FA01-FA03.
D adds FA02 and FD01-FD04; the real page-to-coach composition is included.
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
| N01 PROPOSED-ORDER | The measured proposed-before-automatic queue, its reversed order and proposed-alone control; no untapped target ever appears. Red witness is section 2. |
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
independent Claude challenge, and CI on both supported operating systems.
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

## 4. What the owner must rule

These are the product choices to put in front of Joe, not questions answered
by this paper. They are separate from his still-pending answer about WHEN.

| Option | Plain yes/no or A/B product questions |
|---|---|
| A | "Is a Check next weight button enough for the first delivery: yes or no?" "For a first or different weight, should the app ask 'Use this next time?': yes or no?" |
| B | "Show the offer just after I finish, or wait until my next workout?" "If I leave without answering, should the same still-valid choice be available next time: yes or no?" |
| C | "Show the offer when I next open the workout: yes or no?" "If I am resuming a workout, offer the change for the following workout, or wait to ask until this one is finished?" |
| D | "May the first repair require asking the coach: yes or no?" "Start with text, or wait for voice?" |

Cross-option taste questions, if needed for the chosen brief: "Offer a separate
choice to use a different weight I logged, or keep my planned weight until I
ask?" "Must the first delivery support different weights across sets, or may
it clearly say that this case still needs a manual plan choice?" A limited
first slice needs a visible limitation and an assigned successor, not another
unowned O1. None of these choices approves new scientific thresholds.

What the PM can decide: delivery order within Joe's timing answer; which
accepted parent the work follows; lane/custody and exact file names; source
coverage, effect identity and conflict protocol; whether safe existing helpers
can remain unchanged; test parameterization, package registration and reviewer
assignment. Those choices must satisfy the existing laws and cannot weaken
consent, invent a dose or authorize engine bytes on Joe's behalf. The PM also
resolves the provisional R inventory into an exact build manifest before work.

What needs no new taste decision: facts stay saved; a changed offer needs a new
yes; the coach cannot make up a number; a replay is not consent; a retry is not
a second earned increase; source evidence and actual loads are retained; an
active capture does not change under the lifter. These are the shared design
constraints under the assignment and TOOL-CONTRACT, not optional shortcuts.

Separate authorization, not a taste poll: every option here contains engine
bytes. Joe's own word is required for that concrete scoped package. This
assignment grants PAPER ONLY. It cannot supply that authorization, a seal
ruling, a release date or a product decision. The PM must also resolve the
legacy automatic-queue/locked-consent discrepancy before an implementation
brief calls this policy settled (section 6).

## 5. Comparison

Counts are the PROPOSED component inventory and named new row families above;
R is the explicitly unbound seal/evidence work, not zero extra files. All
figures here describe proposed scope, not executed test totals or athlete data.
A and C tie in component files; A is smaller in automatic lifecycle integration
and in named behavior obligations. This is not a time/cost estimate.

| Option | Athlete sees | Engine bytes | S8-key component files | New science numbers | Component files / named new rows | What waits on S9 or S10 |
|---|---|---|---|---|---|---|
| A: explicit check | Offer only when asked; separate Yes | Yes: FC01,FC02 | 10, plus R | None | 16 + R / 22 | Sealed host/build/import edits need a child; if integrated after Today split, FA02 must use that accepted composition. No existing S9/S10 assignment is assumed. |
| B: after Finish | Offer after durable save; separate Yes | Yes: FC01,FC02 | 11, plus R | None | 18 + R / 24 | Same child; gym host and Finish binding must follow the accepted split/writer boundary. Does not make a pure-move ticket carry new behavior. |
| C: next open | Re-derived offer before new workout; separate Yes | Yes: FC01,FC02 | 10, plus R | None | 16 + R / 25 | Boot/read/Start composition must match whichever S10 split lands; S9 release of views does not free load writers. |
| D: coach | Engine-backed conversation and a bound Yes | Yes: FC01,FC02 | 10, plus R | None | 18 + R / 24 | Same engine/import child plus the real coach host/effect join; no premise that S9 or S10 delivers that join or voice. |

READ - S9 is a release-of-screen-files/reseal path, not blanket freedom for
athlete-data writers (rebuild/DECISIONS.md:536,542-543). The S10 work described
at :564 and :574 carries the Today split, Edit My Week and tag work; the pure
move and the separate writer-seal repair are distinct. The relevant source
status here is S8; pending work on other branches was not fetched or measured.
There is no technical law that native earning must wait for a milestone named
S9 or S10. Queue placement and the conflict-free seal parent are PM decisions
under Joe's timing answer. This paper does not insert an option into either
milestone or declare their current queues to include it.

## 6. Contradictions and open facts, not resolved here

1. READ - the assignment names rebuild/m2/acceptance-s*.json. None was found
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
   completion also adopts w (writers.cjs:338-349). The assignment treats
   "a change happens only on a yes" as locked for this native repair. The
   options obey it; I do not claim those older mechanisms already obey it or
   silently extend a historical coach ruling to all old/imported behavior.
   Engine-authorized native consent handling and preservation of imported
   legacy decisions need an explicit scoped interpretation in the brief.
4. MEASURED - pickStructural and genSession disagree on which queue entry
   supplies the load (section 2). The canonical earn producer can create the
   failing order. This blocks an honest consent claim even if the new UI asks
   correctly. No engine fix or permission is delivered by this paper.
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

## 7. What I did not verify

I did not implement any option, create a test file, change an engine/product
byte, run the whole Today step, run a conformance/sealed package, install
anything, or make any git mutation. No protected/private/auth source or
protected soak was opened; no prohibited data location was listed or searched.
No network, deployment, real athlete measurement or external publication
verification was part of this assignment.

MEASURED scope only: the invented native-reader fixtures, input immutability,
accepted/browser runtime equality for those fixtures, deriveSighting,
missed-prefix control, the queue-order controls, and the canonical earnWalk
queue-order reproduction in section 2. The invocation reused only the
constructor at gap-map lines 136-165, passed code through stdin to the exact
Node binary in the assignment, and made no fixture/script file. All example
loads, counts, dates and effort values in those drives were INVENTED.

I did not exercise an actual phone, browser storage, Finish/edit/yes UI,
durable restart, full import admission, second device, earned-debut landing,
undo, or a new effect family's convergence. Queue selection is measured;
shipped import mint routing is READ, not a fresh import PASS. The prior map's
other result lines were not silently upgraded to fresh measurements.

The tests in section 3 are a proposed bar, not executed tests. File counts
exclude unresolved seal administration and future split-driven relocation,
which are explicitly disclosed. This is not a complete accepted build manifest,
a gate verdict, a science clearance or an estimate of hours to delivery.

The required next check is by a Claude hand, explicitly told to disagree with
this author, then PM4's judgment. That check has not occurred in this job.
Neither an answer about timing nor any of the product/engine rulings has been
assumed. Joe decides taste/authorization; PM4 decides delivery and acceptance.

## Final worktree checks

The last shell commands were the two git commands below, after setting the
required environment variables on separate lines. Their stdout is pasted
verbatim. The diff has no stdout because this new paper is untracked.
Git also emitted the same inaccessible-global-ignore warning twice:
`warning: unable to access 'C:\Users\joeym/.config/git/ignore': Permission denied`
No attempt was made to open that file. These results were appended to this
paper after the commands; no further shell command was run.

```text
$ git status --porcelain
?? rebuild/coach/EARN-ON-PHONE-OPTIONS.md
$ git diff --stat -- rebuild/coach/EARN-ON-PHONE-OPTIONS.md
```

Before these final commands, byte inspection found ASCII only and LF only;
section 1 had nine nonblank lines. The proposed component counts and S8-key
counts in the comparison were mechanically checked against the file table
and S8 maps. HEAD remained the evidence head printed at the top.
