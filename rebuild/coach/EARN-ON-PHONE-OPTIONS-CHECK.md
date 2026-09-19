# Earn on phone: a Claude check of the options paper and of the finding it produced

Reviewer: Cowork (Earned lane hand), told to disagree. Paper only: no engine byte,
no product byte and no test file is changed by this check.
Paper under review: rebuild/coach/EARN-ON-PHONE-OPTIONS.md at b42bc45e (764 lines,
written at its stated evidence head 89a9c4cc, which is that commit's parent).
Check head: b42bc45e, branch rebuild/c-earn-on-phone-options, clean worktree.
Clock MEASURED_TEST_NOW=2026-09-03, TZ=America/New_York, on the owner's PC.
EVERY number below is INVENTED. No measurement of the owner's was read, run or printed.

## PLAIN WORDS

1. The card can tell you to lift a weight you never agreed to lift.
2. Who: any lift with a rung ladder, after two top sessions with 3+ reps left.
3. How often: every time that happens, unless you tap the offer first.
4. Yes, it is stored: finishing writes that weight down as your working weight.
5. Then it goes backwards: the next card drops below it, and one earn debuts twice.
6. Tap the offer and everything is right. Only the untapped case is broken.
7. Fix: two words in two engine files. Costs nothing on screen, weakens no rule.
8. Astra's paper found the screen half, missed the stored half, is otherwise sound.

## VERDICT ON THE FINDING

CONFIRMED, and wider than stated.

Every claim in the PM's ledger line reproduced on this PC on my own cell. The part
the PM marked READ BY THE PM AND NOT EXECUTED is now EXECUTED and holds: the
completion writer does land the untapped entry, marks it ESTABLISH and stores its
load. Two facts are wider than the finding: the leftover classic entry afterwards
prescribes BELOW the stored load and establishes a second time, and the shipped
import merge can mint the same unsafe pair by itself.

## HOW THIS WAS MEASURED

One invented lift throughout: id "press", working load 100, rung ladder
[95,100,105,110,115], 2 sets, window 8 to 10, per-set vector [100,100]. Sessions are
invented: reps [10,10] at load 100, opener reserve 2, terminal-set reserve 3.
Cells written for this check and run on the owner's PC:
C:\Users\joeym\AppData\Local\Temp\epp38\epp38-probe-1.cjs (the finding),
epp38-probe-2.cjs (the repair on scratch copies), epp38-shim.cjs (loads a repaired
today.cjs and writers.cjs from memory so the worktree is never written).
The PM's own probe was not reused and not read as evidence.

## 1. THE CARD, ON BOTH RUNTIME COMPOSITIONS

rebuild/m4/workout/engine-runtime.cjs and rebuild/m3/w6/host/engine-runtime-host.cjs,
same state, hand-built queue, invented loads:

| queue for the lift | native card | host card | isDebutNow |
|---|---|---|---|
| PROPOSED 110 then DEBUT 105 | 110 | 110 | true |
| DEBUT 105 then PROPOSED 110 | 105 | 105 | true |
| PROPOSED 110 alone | 100 | 100 | false |
| DEBUT 105 alone | 105 | 105 | true |

Identical to the finding, on both compositions. The mechanism is exactly as cited:
today.cjs:55 pickStructural filters `q.state !== "PROPOSED"`; today.cjs:97 re-finds the
entry by exercise id only and today.cjs:98 reads its newW. Selection by lift identity
throws away the entry identity pickStructural just decided.

## 2. THE PRODUCER: earnWalk MINTS THE PAIR ITSELF, AND ONLY IN THE UNSAFE ORDER

Nothing here is hand-built. Two invented sessions through the engine's own
completeSession, which calls earnWalk at writers.cjs:376.

    after sighting 1 (2026-08-27)  topRun=1   queue ["PROPOSED 105"]
    after sighting 2 (2026-09-03)  THE EARN FIRES, queue as minted:
       [0] SUPERSEDED/done newW=105  id=q_press_105_2026-08-27_1s
       [1] PROPOSED        newW=110  id=q_press_110_2026-09-03_2r
       [2] DEBUT           newW=105  id=q_press_105_2026-09-03

Is there ANY path on which the engine mints the pair in the safe order? No.
earn.cjs:80 pushes the two-rung PROPOSED and earn.cjs:88 pushes the classic DEBUT,
in that order, unconditionally, in the one branch that can mint both. The standing
one-sighting offer from the first session is superseded at earn.cjs:79 before either
push, so it cannot survive to sit in front of them. Nothing later reorders the queue:
measured, neither reconcileDebutQueue nor migrate() changes the id order, and
reconcileDebutQueue (migrate.cjs:99-111) skips PROPOSED entries entirely.
The one public fixture that carries a PROPOSED entry is hand-written the other way
round (conform/oracle/make-synthetic.cjs:15-16, ESTABLISH 60 then PROPOSED 65), which
is the order the engine never produces.

## 3. THE LANDING, THROUGH THE SAME COMPLETION WRITER

Card generated for the next upper day (2026-09-07) off the state section 2 minted,
then that session completed at the prescribed load through completeSession.

    card 2026-09-07        native 110, host 110, isDebutNow true
                           (pickStructural had selected the 105 classic DEBUT)
    marked ESTABLISH       q_press_110_2026-09-03_2r   -- the entry nobody tapped
    STORED ex.w            110        ex.wSets [110,110]
    left OPEN in the queue DEBUT 105
    card 2026-09-10        105, isDebutNow true        -- BELOW the stored 110
    that session completed ex.w 105, ex.wSets [105,105], ESTABLISH count 2

So the untapped offer is not merely displayed: writers.cjs:227 finds it by the same
exercise-id-only lookup, writers.cjs:262 marks it done/ESTABLISH and writers.cjs:263
writes q.newW into ex.w and q.newWSets into ex.wSets. One earn then debuts twice and
the working weight walks 100 -> 110 -> 105. A load REGRESSION is written into the
record with no deload, no reset and no ruling.

## 4. THE TAP CONTROL: AFTER A REAL TAP THE PAIR IS CONSISTENT

takeProposedDebut (writers.cjs:187-198) on the same minted state:

    queue after the tap    [0] SUPERSEDED/done 105  [1] DEBUT 110  [2] SUPERSEDED/done 105
    card                   native 110, host 110
    after landing          ex.w 110, open entries 0
    next card              110, isDebutNow false

Correct end to end. The defect is exactly the untapped case, and the law that makes
the tapped case correct (supersede every lower standing debut) is the same law the
untapped read-path does not consult.

## 5. REVERSED-ORDER CONTROL

Same minted pair with the two live entries swapped:

    card 105  ->  ESTABLISH 105  ->  ex.w 105  ->  PROPOSED 110 still open, still untaken

Safe. This is the order the public fixture encodes and the order the engine never mints.

## 6. REACH ON THE PHONE BUILD

No native path calls completeSession or earnWalk. Both runtime compositions expose
exactly five readers (genSession, rirPlan, dayWeather, cleanAtDate, sessionMembership:
engine-runtime.cjs:40 and engine-runtime-host.cjs:54); writers.cjs is instantiated
privately only for rirPlan; seed.cjs, migrate.cjs and merge.cjs are declared forbidden
imports. A repository search outside rebuild/engine finds completeSession and earnWalk
only in rebuild/m4/spec cells, and rebuild/m4/import/replay-core.cjs:180 states in
terms that native observation admission is not consent to invoke completeSession.
DECISIONS:590 holds at this head.

Can the shipped import merge carry or MINT such a pair? Measured, three cases:

    (a) two replicas that each still hold their one-sighting offer
        merged queue ["PROPOSED 105","PROPOSED 105"], card 100
        the joint mint is blocked, because migrate.cjs:40 bails when ANY live debut
        exists for that lift, PROPOSED included
    (b) one further honest top-of-window session on that merged state
        queue ["PROPOSED 110","DEBUT 105"], card 110
    (c) two replicas whose queues are empty for that lift
        the MERGE ITSELF mints the pair: ["PROPOSED 110","DEBUT 105"], card 110

Case (c) is the new fact. mergeState ends at merge.cjs:1096 in
reconcileSightings(out,{mint:true}); _mintJointEarn (migrate.cjs:35-74) calls the same
earnWalk, so it mints the same PROPOSED-first pair. The shipped import preparation
reaches mergeState at replay-core.cjs:49 whenever local state exists.
Does any admission step reorder the queue? No: measured, migrate() and
reconcileDebutQueue both leave the id order byte-identical.

In one plain sentence: an athlete whose data was imported could open the app on day one
and be shown a double weight jump that nobody ever tapped, and finishing that session
would write that weight down as his working weight.

## 7. CONFORMANCE

Every public file under rebuild/conform carrying a PROPOSED entry (rebuild/conform/private
was never opened, listed or searched):

    fixtures/synthetic-pending-debut.json      one PROPOSED two-rung entry
    golden/synthetic-pending-debut.main.json   its census golden
    oracle/make-synthetic.cjs:15-16            the generator, classic first, PROPOSED second
    laws/progression.cjs                       P6 (both PROPOSED writers carry newWSets),
                                               P7 (taking supersedes lower), P8 (completion adopts)
    laws/manifest.json:228                     P6's frozen cite
    reference/progression.cjs:33,34,36         twoRung, oneSighting, takeProposedDebut
    README-suite.txt:52                        the fixture's cover line

Not one of them can see this defect, and the reason is structural rather than
accidental. The public runner rebuild/m3/w0/public-conformance.cjs requires only
conform/lib, conform/laws, conform/reference, conform/adapters and conform/coverage:
it loads no rebuild/engine module at all, and the progression family has no adapter, so
its 9 laws run RED-as-specified against the reference model only. The reference model
has no card and no lookup-by-lift: P7 and P8 build the queue as [classic, twoRung] and
complete a debut by explicit id. The census (oracle/census.cjs:37-52) reads targetsFor,
never genSession and never completeSession, so no golden leaf can move either.

Measured against a scratch-repaired engine (in-memory only; the worktree sha256s of
today.cjs and writers.cjs were re-hashed afterwards and are unchanged):

    public conformance, repaired: PASS, 99 reference GREEN, 99 STRONG
    (141 targeted mutants detected), 70 adapter GREEN, 29 RED-as-specified
    -- row for row identical to the baseline run

Engine cells touching today.cjs, earn.cjs and writers.cjs, baseline versus repaired,
all 17 under rebuild/engine/test plus rebuild/m4/spec/load-write*.test.cjs and
rebuild/m3/w6/host/test/engine-equivalence.test.cjs: EVERY exit code identical, and
the only textual differences anywhere are the shim's own frame inside Node stack traces
and per-run millisecond timings. No assertion, no row and no verdict changes.
Reported honestly, six of those cells cannot load at this head at all because
rebuild/conform/engines/engine-main.cjs is not in the tree (defect-witnesses-5, -6, -7,
writers-differential, merge-differential, migrate-differential), and seven more fail at
baseline for reasons that have nothing to do with this defect and fail identically with
the repair; rebuild/m4/spec/load-write.test.cjs is one of them, and its closed engine
file inventory is simply stale at this head (it does not know entered-load.cjs or
performed.cjs). Those baseline states are not my doing and I did not touch them.

EXACTLY WHICH ROWS CHANGE: none. No golden changes. There is therefore NO declared
departure from the frozen app in this repair, and the report does not claim one.
What is NOT measured here: the port oracle and the sensitivity pass, because
rebuild/conform/engines/engine-main.cjs and the rig174 engine artifact are absent on
this machine, and the private oracle is out of bounds. A future brief must run the
port oracle on the synthetic fixture before anyone calls the golden question closed.

## 8. THE REPAIR, AS PAPER ONLY

Nothing below is applied. rebuild/engine/** is sealed and every engine byte is reserved
to the owner's own word. This is a description of a diff, measured on scratch copies.

Two lines. Each adds the exclusion today.cjs:55 already uses, so the read path asks the
same question the structural picker asked.

    rebuild/engine/today.cjs:97   (genSession)
    -   const q = isDebutNow ? s.queue.find((x) => x.exId === e.id && !x.done && (x.kind === "debut" || x.kind === "unlock")) : null;
    +   const q = isDebutNow ? s.queue.find((x) => x.exId === e.id && !x.done && x.state !== "PROPOSED" && (x.kind === "debut" || x.kind === "unlock")) : null;

    rebuild/engine/writers.cjs:227   (completeSession)
    -   const q = qFind((x) => x.exId === ex.id && !x.done && (x.kind === "debut" || x.kind === "unlock"));
    +   const q = qFind((x) => x.exId === ex.id && !x.done && x.state !== "PROPOSED" && (x.kind === "debut" || x.kind === "unlock"));

Files it touches, and their status: rebuild/engine/today.cjs and
rebuild/engine/writers.cjs. BOTH are engine files, and BOTH are sealed S8 product keys
(rebuild/m4/spec/acceptance-s8-real-shape.json:286 and :296). Neither may move without
Joe's own word.

BOTH, not one. Measured on scratch copies:

| patched | card | stored ex.w | card and record agree |
|---|---|---|---|
| today.cjs only | 105 | 110 | NO |
| writers.cjs only | 110 | 105 | NO |
| both | 105 | 105 | yes |

Red-first rows, named, in the producer's own order:

    EPP-R1 PRODUCER-ORDER. completeSession twice at the top of the window with terminal
      reserve 3 on a laddered lift mints PROPOSED before the classic DEBUT. GREEN before
      and after. It exists so the rows below are never written against a hand-built queue.
    EPP-R2 CARD-TAKES-THE-SELECTED-ENTRY. The card load equals the newW of the entry
      pickStructural selected. RED before (110 against a selected 105). GREEN after.
    EPP-R3 NO-UNTAPPED-ENTRY-IS-EVER-ESTABLISHED. No queue entry whose state is PROPOSED
      is marked ESTABLISH or writes ex.w / ex.wSets. RED before. GREEN after.
    EPP-R4 NO-DOWN-PULL-AND-NO-DOUBLE-DEBUT. After a debut lands, the next card for that
      lift is not below the stored working weight, and one earn establishes at most one
      debut. RED before (105 after 110; two ESTABLISH). GREEN after.
    EPP-R5 TAP CONTROL. After takeProposedDebut the card, the stored load and the open
      queue all agree at the tapped load. GREEN before and after. It localizes the defect
      to the untapped case and must stay green, or the repair has taken consent away.
    EPP-R6 REVERSED-ORDER CONTROL. With the classic entry first, card, store and standing
      offer are byte-identical before and after. GREEN before and after.
    EPP-R7 HALF-REPAIR CONTROL. today.cjs alone and writers.cjs alone each leave card and
      record disagreeing. RED for each half. It exists so nobody ships half of it.

## 9. VERDICT ON THE PAPER

FIT WITH CORRECTIONS.

I sampled 26 of the paper's file-and-line claims in section 2 and every S8 key line in
its section 5 inventory against the code at b42bc45e. The hit rate is unusually high:
progression.cjs:482-491, :490, :436-478, :581, :583, :589, :595, :603-604, :608-653,
:643-645; constants.cjs:50; earn.cjs:13-17, :23, :36-45, :38, :62, :63, :75, :80, :88,
:96, :97; writers.cjs:187-198, :227, :234-238, :261-268, :280-305, :322-324, :338-349,
:368, :376; today.cjs:55, :92-93, :95-98; athlete-state.cjs:136, :329; seed.cjs:93-100,
:120-123; merge.cjs:1096; migrate.cjs:35-74, :51-62, :2118; replay-core.cjs:44-49,
:178-188. All exact or exact within the cited range. Every S8 key line in the file
inventory (:286, :996, :436, :506, :531, :521, :846, :686, :201, :791, :701, :301, :1601,
:3-4) is exact, and every file the paper classifies F is genuinely absent from both maps.
Its own self-checks hold too: the paper is ASCII only, section 1 has nine nonblank lines,
and its evidence head is the parent of the commit that carries it. Its statement that
"an isolated PROPOSED is not enough" is correct and my reversed-order control agrees.

Corrections, in the order they matter:

1. THE PAPER STOPS AT THE SCREEN. Section 2 and contradiction 4 describe a card that
   "can prescribe newW", and separately note that queued completion "writes w and wSets
   and marks ESTABLISH (:261-268)". It never joins them. MEASURED here: the untapped
   PROPOSED entry is what the completion writer lands, and its load is STORED as the
   working weight. The paper must say a weight is written down, not only shown.
2. THE COMPONENT INVENTORY IS ONE FILE SHORT. FC02 names rebuild/engine/today.cjs alone.
   MEASURED: today.cjs alone prescribes 105 and stores 110. rebuild/engine/writers.cjs
   must be in the inventory; it is an S8 product key at acceptance-s8-real-shape.json:296.
   The S8-key component counts in section 5 therefore become 11 / 12 / 11 / 11 rather
   than 10 / 11 / 10 / 10, and the component-file counts 17+R / 19+R / 17+R / 19+R rather
   than 16+R / 18+R / 16+R / 18+R.
3. THE KNOCK-ON IS MISSING. The leftover classic entry later prescribes BELOW the stored
   load and establishes a second time. A load regression written into the record is a
   separate harm from a single unconsented jump and the owner should see it named.
4. THE MERGE PARAGRAPH UNDERSTATES ITSELF. It says the shipped import merge "can create a
   legacy joint earn". MEASURED: the joint earn it creates is this same unsafe pair, and
   the card off the merged state is the untapped load. Name it.
5. Cosmetic: progression.cjs:346-370 spans loadRungs, debutDebit and nextLoad; the
   behaviour cited is nextLoad at :359-370.

None of these makes the paper unfit. Its options, obligations and refusals are the
owner's to rule on, and its evidence is good enough to rule from once corrected.

### Is contradiction 3 stated fairly?

Partly, and it needs one more sentence before Joe rules.

What it asserts is true and correctly cited: earn.cjs:66-89 does auto-queue an ordinary
one-rung DEBUT with no separate proposal tap, writers.cjs:338-349 does adopt a first or
different logged scalar load, and the paper is right not to claim those older mechanisms
already obey a yes-only rule or to silently extend a coach ruling over them.

What it leaves out changes the question the owner is being asked. The legacy no-tap
debut is a ONE-rung step under a published law (two sessions at the top of the rep
window, an honest opener, or a difference two standard errors clear of the noise), it
runs only when it wins the structural slot, and its own queue text says so. The PROPOSED
entry is a different promise in the engine's own words: "Rides only on your tap"
(earn.cjs:80 and :97). So the untapped case is not a legacy-versus-native tension about
consent policy at all. It is the legacy engine breaking a promise it wrote itself.
Framed only as "the legacy rule queues without a tap, the native repair is asked for a
yes", the owner could reasonably read this as a philosophical question about new
features and defer it. It is a defect, and it is live wherever a laddered lift earns
with three or more in reserve, with or without any native work.

Recommendation: the paper should add that distinction to contradiction 3, and the defect
should be separated from the four options entirely, so that ruling on the options is not
a precondition for repairing a stored weight the athlete never accepted.

## 10. WHAT I DID NOT VERIFY

I did not run the port oracle, the sensitivity pass, the full conformance selftest,
b-package, any sealing, any gate or any release check. I did not open, list or search
rebuild/conform/private, src/history.js, any ledger directory, EarnedPort, port-real.log
or the protected soak. I did not build or launch a browser, a phone or a bundle. I did
not measure how often the trigger conditions occur for any real athlete, because that
would require the owner's data; the conditions are stated instead. I did not exercise a
real import end to end, a durable restart, an undo, a second device, or the native
Finish UI. I applied no repair: the two diffs above were measured on scratch copies and
on an in-memory loader, and the worktree bytes of today.cjs and writers.cjs were
re-hashed afterwards and are unchanged.
