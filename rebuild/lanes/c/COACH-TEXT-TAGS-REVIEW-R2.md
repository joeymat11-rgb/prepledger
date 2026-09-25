# COACH-TEXT-TAG-SWEEP - REVIEW R2 (narrow re-check of fix round 2)

Reviewer: cowork (Earned lane hand, Claude), told to disagree.
Head reviewed: 523a29c9 on rebuild/c-coach-text-tags, over base 24503919 (the R1
review commit). Build by Astra; committed and pushed by the PM as one commit.
Author report: rebuild/lanes/c/COACH-TEXT-TAGS-AUTHOR-REPORT.md (a hypothesis).
Prior review: rebuild/lanes/c/COACH-TEXT-TAGS-REVIEW-R1.md. Rulings: DECISIONS:576.

VERDICT: REJECT. Two blocking findings, B1 and B2 below. Everything else in the
round is sound and several parts of it are better than the ruling required; the
rollback in particular is correct under a 42 case drive. Nine notes follow.

---

## 0. THE BAR OF RECORD (owner's PC, %TEMP%\earned-astra-2, HEAD 523a29c9)

    git rev-parse HEAD                      523a29c97cf609c9bb8f5b9df04d003aed9b7b3c
    node --test rebuild/coach/test/*.test.cjs    tests 352  pass 352  fail 0
                                                 cancelled 0 skipped 0 todo 0
    node rebuild/t2/rig187.cjs                   rig187 => PASS
    node --test rebuild/client/test/*.test.cjs   tests 18   pass 18   fail 0
    git diff --numstat 24503919..HEAD --
      rebuild/engine rebuild/m3 rebuild/m4
      rebuild/client .github                     EMPTY

The 352 matches the count the PM measured. No sealed byte moved: the numstat
guard is empty, so the whole round is inside rebuild/coach and rebuild/lanes/c.
Changed files: tools.cjs, wave1-tools.cjs, onboarding-tools.cjs, memory-tools.cjs,
coach-text.cjs, wave1-text.cjs, onboarding-text.cjs, TOOL-CONTRACT.md,
BRIEF-C6-VOICE-ONBOARDING.md, four test files, the author report.

## 1. RED FIRST, RE-PROVED BY ME (Astra cannot commit a red state)

Farm scratch worktree at 24503919 with ONLY the four changed test files copied in
from 523a29c9 (memory.test.cjs, onboarding-closed-list.test.cjs,
text-tags.test.cjs, wave1-demo.test.cjs); product untouched at the base.

    text-tags + onboarding-closed-list + wave1-demo   tests 82  pass 46  fail 36
    memory.test.cjs                                   tests 70  pass 69  fail 1
    TOTAL RED AT THE BASE                             37 cells

Head, same four files, same scratch machinery: tests 152, pass 152, fail 0.

Every one of the 37 is a cell this round added or edited, and the 37 account for
the whole delta:

  - 31 of the 33 ADDED cells (the R1 B1/B2/B3/B4/F1/F2 block in text-tags.test.cjs)
  - 2 added cells are green at BOTH ends: "R1 B1 waveName/onboardingName ... for
    symbol". String(aSymbol) is legal, so the base already refused those two; the
    cells are honest additions, not red-first evidence. Astra does not claim them.
  - 4 explicitly edited cells: onboarding-closed-list.test.cjs x2, memory.test.cjs
    P-F1, wave1-demo.test.cjs W8 (D5, D6)
  - 2 transitively edited: text-tags TT3a and TT5a, red because the file's
    UNKNOWN_COPY constant on line 14 changed

33 added + 4 edited = 37 new cells; 319 base + 33 = 352. The arithmetic closes.

## 2. BLOCKING FINDINGS

### B1 (BLOCKING). B4's closed vocabulary destroys two legitimate, coded refusals that the SHIPPED check-in lane really returns.

tools.cjs writeCheckIn now gates the saved copy on

    const known = saved.code === undefined && fixed.includes(saved.copy);

with `fixed` built from the six constants of rebuild/m3/w7-preview/today/
checkin-model.mjs, and the comment "The sealed model returns NO refusal codes."

That comment is true of checkin-model.mjs. It is FALSE of the object the coach is
actually handed. `world.checkin` on every shipped path is not the model: it is the
wrapper built in rebuild/coach/local-world.mjs lines 315 to 338, whose own save()
returns, BEFORE it ever reaches model.save():

    { ok:false, code:'CHECKIN_SOURCE_UNAVAILABLE',
      copy:'The check-in could not be read on this device. Nothing was recorded.' }
    { ok:false, code:'SLEEP_NIGHT_CHANGED',
      copy:'This night changed while you were editing. Review the saved record
            before trying again. Nothing was recorded.' }

Both carry a code, so `saved.code === undefined` is false, so `known` is false,
so both are replaced. Measured on the real coach over the real check-in model,
at the head and at the base, same inputs:

    IN  code=CHECKIN_SOURCE_UNAVAILABLE
    base OUT code=CHECKIN_SOURCE_UNAVAILABLE
         reason="The check-in could not be read on this device. Nothing was recorded."
    head OUT code=CHECKIN_NOT_RECORDED
         reason="I could not record that check-in answer. Nothing was recorded."

    IN  code=SLEEP_NIGHT_CHANGED
    base OUT code=SLEEP_NIGHT_CHANGED
         reason="This night changed while you were editing. Review the saved
                 record before trying again. Nothing was recorded."
    head OUT code=CHECKIN_NOT_RECORDED
         reason="I could not record that check-in answer. Nothing was recorded."

All three renderers print the replacement, verbatim, for both.

This is a changed sentence for a legitimate refusal, which is exactly what R1 held
BLOCKING for submit, and it is worse than a lost adjective: SLEEP_NIGHT_CHANGED is
the only line in the tree that tells the athlete his sleep record moved under him
and asks him to review it before trying again. He is now told a flat "I could not
record that check-in answer" and given nothing to do. The CODE is lost too, so a
harness cannot recover the distinction either.

Reachability: CHECKIN_SOURCE_UNAVAILABLE fires when the lane's own refresh throws
(a store read failure, which the fault harness exists to produce) or after close();
SLEEP_NIGHT_CHANGED fires when the confirmed sleep night changes between opening
and saving. Neither is synthetic.

It also breaks a written rule. wave1-tools.cjs log_set, eleven lines below the
hunk, still says "THE ACCEPTED LAYER'S OWN WORDS ... its code and its sentence
travel verbatim", and model-adapter.md section 7 forbids rewording an engine or
client refusal for the same reason. The check-in lane is now the exception.

WHAT WOULD CLOSE IT. The gate has to be built over the object the coach is given,
not over the file Astra read. The narrow shape: keep the fixed-copy pass-through,
and add the wrapper's own two codes as a second closed pass-through list, so that
a REFUSAL THE COACH'S OWN COMPOSITION AUTHORED travels verbatim while a HOST
diagnostic joined into copy by the model still collapses. The leak the round was
fixing (the ' . ' join of result.copy with result.code, measured at the base as
"... and no part of it was recorded. . STATE_20") is genuinely closed by the
existing gate and must stay closed; I drove it and it collapses correctly.

### B2 (BLOCKING). COMPLETE_REFUSALS is seven times wider than the ruling, and the widening costs real copy on a reachable write refusal.

DECISIONS:576 B3 rules, in the PM's words: "the two TOOL_THREW codes get NO tail,
keyed on the CODE and never on a pattern over the sentence". The build put
FOURTEEN codes in COMPLETE_REFUSALS. Twelve of them were not ruled on, and the
suppression they buy is not free. Measured, the same envelope at both ends:

  CHECKIN_NOT_RECORDED carrying model.ALREADY_RECORDED
    base coach     "Today's check-in is already recorded on this device. Changing a
                    recorded answer needs the correction path, which is not wired
                    yet. Nothing changed."
    base wave1/onb same sentence + " Nothing was recorded."
    head all three same sentence, NO TAIL

  COACH_MACHINE_SETTINGS_INVALID carrying the machine-settings READ refusal
  (wave1-tools.cjs:139, "I need to know which machine you mean.")
    base all three  + " Nothing changed." / " Nothing was recorded."
    head all three  NO TAIL

  COACH_MACHINE_SETTINGS_INVALID carrying a host copy (wave1-tools.cjs:192,
  saved.code || MACHINE_SETTINGS_INVALID with saved.copy)
    drove copy "Your device would not accept that write."
    base all three  + a tail; head all three  NO TAIL

The ALREADY_RECORDED row is the blocking one. It is a WRITE refusal the athlete
reaches by speaking an answer after today's check-in is already on disk, it is
the ONE of the six model constants that does not end in its own ending, and
unlike a TOOL_THREW catch the coach here KNOWS nothing was recorded: model.save()
returns at its first line without touching the host. The ruling's whole reason for
suppressing a tail - "a catch-all around an arbitrary throw cannot know what was
written" - does not apply to it. A true, useful and previously printed claim was
removed from an athlete-facing line by a set entry the ruling did not authorise.

The machine-settings rows are NOTES, not blocking: the READ refusal makes no state
claim so losing its tail is harmless (arguably a fix), and the host-copy row needs
a host that returns ok:false with a copy and NO code, which neither
local-client.mjs's refusal() nor public-client.mjs's execute() does - both always
set code. It is latent, but it is latent only by accident, and the set's own
comment ("These refusal codes already carry their complete spoken line") is simply
untrue of two of the three reasons that travel under that code.

WHAT WOULD CLOSE IT. Reduce COMPLETE_REFUSALS to what was ruled: WAVE1_TOOL_THREW
and ONBOARDING_TOOL_THREW. The other twelve need no entry - I checked each one,
and every reason that travels under the remaining twelve already ends in its own
ending EXCEPT ALREADY_RECORDED (which needs its tail) and the two machine-settings
reasons above. See section 5 for the full enumeration.

## 3. THE RESIDUAL SENTENCE PATTERN (ruling B3, second half)

coach-text.cjs and onboarding-text.cjs gained, beside the code test:

    if (u.code === T.CODES.CONFIRMATION_REQUIRED && /nothing is recorded yet/i.test(said)) return said;

So a sentence pattern is still deciding a printed line, for COACH_CONFIRMATION_
REQUIRED. It exists because the new log_set reason "Nothing is recorded yet. Say
yes to confirm the weight and reps." does not match coach-text's own
/nothing chang/i, and would otherwise be printed as "... Nothing changed."

It does not reach the two codes the ruling named, so it does not break the letter
of B3, and it is narrowed by a code test rather than being a bare pattern. But it
is a pattern, it is undocumented in TOOL-CONTRACT.md (which claims "All three
renderers suppress tails by CODE"), and it is load-bearing: delete it and a real
line changes. NOTE N1.

Measured proof that it is load-bearing and that the OTHER confirmation sentence
still double-tails (pre-existing, identical at both ends, not this round's):

    COACH_CONFIRMATION_REQUIRED, coach's own needConfirm, coach-text.cjs
      "A fact is recorded only after you say yes. Nothing was recorded. Nothing changed."

## 4. state_unchanged: WHO READS THE ABSENCE

I grepped every .cjs, .mjs, .js and .md under rebuild/ for the member.

  - NO PRODUCT READER AT ALL. Not the three renderers (coach-text.cjs,
    wave1-text.cjs, onboarding-text.cjs), not runDemo, not any adapter code.
  - TOOL-CONTRACT.md: two pre-existing uses on OTHER envelopes, plus the new
    paragraph that declares "Absence means unknown, not a positive assertion that
    a write happened."
  - model-adapter.md: the member is NOT MENTIONED ANYWHERE. This is the document
    the language model's adapter is written against, and the envelope does travel
    to the model. The adapter is told nothing about how to read the absence.
    NOTE N2: model-adapter.md should gain the same sentence TOOL-CONTRACT.md did.
  - Tests only, and they read absence consistently as "no claim":
      memory.test.cjs:773 asserts state_unchanged === undefined for a COMMITTED
      write, with the message "a committed write claimed the state was unchanged".
      That is the precedent, it predates this round, and the new cells
      (text-tags.test.cjs:270, :275, Object.hasOwn === false) follow it exactly.

Nothing reads absence as true. Nothing reads absence as false. The removal is
sound, the contract paragraph is accurate, and I have no finding against it.

## 5. THE COMPLETE_REFUSALS ENUMERATION (14 codes, every reason under each)

Codes verified as literal strings against CODES (tools.cjs:355), W1_CODES
(wave1-tools.cjs:46), C6_CODES (onboarding-tools.cjs:56) and memory-tools.cjs:436.
All fourteen match a code that is really emitted; none is dead.

  1 WAVE1_TOOL_THREW       1 reason, "... I could not complete the request."  OK
  2 ONBOARDING_TOOL_THREW  same sentence                                      OK
  3 WAVE1_TOOL_NOT_IN_LIST      UNKNOWN_TOOL_COPY, ends "so I did nothing."   OK
  4 ONBOARDING_TOOL_NOT_IN_LIST UNKNOWN_TOOL_COPY                             OK
  5 MEMORY_TOOL_NOT_IN_LIST     UNKNOWN_TOOL_COPY                             OK
  6 CHECKIN_INPUT_INVALID   1 reason, ends "Nothing was recorded."            OK
  7 CHECKIN_NOT_RECORDED    7 reasons: the generic one (ends correctly) and
      the six model constants. NOTHING_ANSWERED, HOURS_OUT_OF_RANGE and
      DAYS_INVALID end "Nothing was recorded."; NO_STORE ends "so no check-in can
      be recorded here."; SAVE_REFUSED ends "and no part of it was recorded.";
      ALREADY_RECORDED ends "which is not wired yet."   <-- FAILS, see B2
  8 COACH_MACHINE_SETTINGS_INVALID  3 reasons:
      wave1-tools.cjs:186 "I could not keep that, and I have kept nothing."   OK
      wave1-tools.cjs:139 "I need to know which machine you mean."     <-- FAILS
      wave1-tools.cjs:192 saved.copy, an arbitrary host sentence       <-- FAILS
  9-14 SETUP_INPUT_INVALID and the five CLEAN_INIT_* codes: ALL SIX carry the one
      reason model.COPY.saveRefused, "Your week could not be recorded on this
      device, and no part of it was recorded."                                OK
      I checked setup-model.mjs:213: REFUSAL_SENTENCES has exactly those five
      keys, so the five CLEAN_INIT_* entries are complete and none is missing.
      This entry is also a REAL FIX: at the base, onboarding-text.cjs's regex
      /unchanged|nothing was recorded|not recorded/i does NOT match "no part of it
      was recorded", so submit printed a double tail. Measured and now gone.

## 6. B2, THE ROLLBACK - ATTACKED AND IT HELD

I read createCheckInDraft whole (checkin-model.mjs:101-198) and drove the rollback
rather than arguing it.

  - state() returns { ...choices }, { ...issues }, { ...fields } - genuine copies,
    not live references, so the snapshot is real.
  - draft() is `() => draft` on a closure, so the draft IS live and there is
    something to roll back. Confirmed.
  - There is NO await between the snapshot, the apply and the restore. apply is a
    synchronous arrow in all three callers and writeCheckIn does not await it.
  - The rollback runs in writeCheckIn, which is the ONE helper for all three
    callers: record_pain_or_soreness, time_away and answer_checkin (the sleep
    answers are inside answer_checkin). All three covered; I drove time_away
    separately and it restores.
  - choose() is a toggle, so restoring a null preimage by calling
    choose(group, after.choices[group]) toggles it back off. Restoring a non-null
    preimage sets it. Both correct for every reachable transition.
  - confirmSleep()/answerSleepHere() are toggles too, and the four-branch ladder
    is right for all six transitions including before=null.
  - Fields last is correct and necessary: choose(soreness) clears SORE_DETAIL,
    toggleIssue(off) clears ISSUE_DETAIL, answerSleepHere(off) clears sleep_hours.

MEASURED: 7 preimages x 6 throwing applies = 42 refusals driven over the real
model. 42 restored exactly (deepEqual on the whole state()). 0 failures. And
checkin.read() is byte-identical after a refused apply, so the rollback leaves no
observable trace - no message, no dirty flag, no cleared detail.

Can a setter throw DURING the rollback? Not with the real draft: choose() only
throws for an unknown group or an unknown label, and both come from the model's
own state; toggleIssue(), set(), confirmSleep() and answerSleepHere() cannot throw
for the model's own keys. I forced throws by monkey-patching set() and by handing
the coach a stub draft whose state() has no `choices`, and both escaped the catch
as a TypeError - but neither is reachable, because world.checkin is always
local-world.mjs's wrapper over the real model. NOTE N3 (hardening only):
writeCheckIn guards `typeof checkin.read === "function"` but not checkin.draft,
and the rollback assumes state() has choices/issues/fields.

This hunk is right and I could not break it. It is the best work in the round.

## 7. B4's NEW EDGE INTO m3, AND F1's NEW EDGE INTO m4

Does anything in the tree forbid or now have to list either edge? NO, and I looked
for the list rather than assuming there is none.

  - rebuild/m3/w7-preview/today/build.mjs FORBIDDEN (line 79) names
    rebuild/engine/seed.cjs, index.cjs, engine/test/*, authority/* except
    canonical, m3/w5/crypto.cjs, ledger/*, src/history.js and
    rebuild/m4/workout/engine-runtime.cjs. Neither new edge is on it.
  - That same build's REQUIRED_INPUTS ALREADY LISTS rebuild/m4/workout/
    edit-values.cjs. The file has no requires of its own, so the F1 edge adds
    nothing to any graph.
  - No coach bundle exists: build.mjs's page graph contains exactly one coach file
    (machine-settings-commands.cjs) and none of the tool modules.
  - The coach already reaches m3: coach-text.cjs:258 requires today-model.cjs, and
    local-world.mjs:33 statically imports checkin-model.mjs. The B4 edge is a
    second door onto a module the coach's own composition root already holds.
  - TOOL-CONTRACT.md was updated for both. Nothing else must now list them.

WHAT IF THE DYNAMIC IMPORT REJECTS. The `await import(...)` at tools.cjs:711 is
not inside a try. I measured it by pointing the specifier at a missing file in a
throwaway scratch:

    through coach.openTurn().call.answer_checkin   !! ESCAPES: Error: Cannot find module
    through wave1 dispatch                          WAVE1_TOOL_THREW,
                                                    "Something went wrong inside that
                                                     tool on this device...",
                                                    state_unchanged undefined

So a rejection turns a truthful "nothing was recorded" into either a thrown stack
past the caller or a refusal that deliberately claims nothing about state - when
in fact nothing WAS recorded and the coach knew it. NOT reachable on the shipped
path: local-world.mjs's static import means the module is already in the registry
and the dynamic import resolves from cache. NOTE N4: wrap it, or hoist the six
constants to a module-level require of the .cjs side, or pass them in.

## 8. THE QUESTION THAT MATTERS MOST (B4): every value save().copy can take

checkin-model.mjs save() (lines 284-303) returns, on !ok, exactly:

  ALREADY_RECORDED            (recorded already; code absent)   -> in `fixed`, passes
  built.copy                  -> HOURS_OUT_OF_RANGE | DAYS_INVALID | NOTHING_ANSWERED
                                 (draft.answers(); code absent) -> all in `fixed`, pass
  NO_STORE                    (no host; code absent)            -> in `fixed`, passes
  [result.copy, result.code].filter(...).join(' . ') || SAVE_REFUSED
                              (the host path; code ABSENT on the returned object)

and nothing else. Note that `code` is NEVER a member of save()'s return object on
any path, so `saved.code === undefined` is VACUOUSLY TRUE for the model: the only
real discriminator is fixed.includes(saved.copy). Astra's reading of the model is
correct, and for the MODEL alone the gate does exactly what the ruling asked: the
' . '-joined host diagnostic (the measured ZQPROBE/U+2014/777333 leak) collapses,
and the six fixed copies pass byte-identically. I verified all six by running the
coach over the real model; all six print unchanged through all three renderers.

THE COLLAPSE IS IN THE WRAPPER, NOT THE MODEL - see B1. That is the one legitimate
refusal the athlete used to read that now fails the equality. There is exactly one
other class: a host that returns ok:false with its OWN sentence and no code, where
the model joins nothing and copy is that sentence alone. Measured: it collapses to
the generic line. That one I do NOT call blocking - the generic line is true, and
the ruling's own words ("anything else selects one fixed sentence") cover it.

## 9. F1 - IS validValue's DOMAIN THE SAME DOMAIN gym.logSet ENFORCES?

Read: edit-values.cjs validValue/quantity, gym-model.mjs logSet (line 502), and
the accepted engine schema rebuild/m4/workout/schema.cjs validSet (line 72).

The engine's own predicates are:
    load = keys(['value','unit']) && Number.isFinite(v) && unit==='lb' && v > 0
    reps = same && Number.isSafeInteger(v) && v >= 0 && !Object.is(v,-0)
which is byte-for-byte what EditValues.validValue('load'|'reps', x, 2) computes.
So the coach's new gate IS the accepted layer's gate, at the stricter of the two
schema versions (the coach hardcodes the default version 2, so it can only ever be
stricter than a version-1 installation, never looser).

gym-model.logSet's OWN gate is only "not '' , not null, not undefined", and it then
does Number(load) / Number(reps) on WHATEVER it was given. So the two gates differ
in ONE place: coercion of non-strings.

MEASURED, driven through the real wave-one tools (coach result | what gym-model's
own gate would have passed on):

    "1e3"    -> confirms and writes 1000      | Number = 1000     SAME
    "0x10"   -> confirms and writes 16        | Number = 16       SAME
    " 8 "    -> confirms and writes 8         | Number = 8        SAME
    "8.0"    -> 8      "08" -> 8                                  SAME
    "1_000"  -> COACH_SET_NOT_RECORDED        | Number = NaN,   engine refuses  SAME
    "Infinity"-> COACH_SET_NOT_RECORDED       | Infinity,       engine refuses  SAME
    -0, "  ", 0 (load) -> refused             | 0,              engine refuses  SAME
    8.5 reps, MAX_SAFE_INTEGER+1 reps -> refused | engine refuses               SAME
    [8]      -> COACH_SET_NOT_RECORDED        | Number = 8,     ENGINE RECORDS 8 lb
    []       -> refused                       | 0,              engine refuses
    true     -> COACH_SET_NOT_RECORDED        | Number = 1,     ENGINE RECORDS 1 lb
    new String("8") -> refused                | Number = 8,     ENGINE RECORDS 8 lb
    {valueOf:()=>8} -> refused                | Number = 8,     ENGINE RECORDS 8 lb

ANSWER: the coach now refuses four value SHAPES that logSet would have recorded -
an array, a boolean, a boxed String and any object with valueOf - and it admits
NOTHING the accepted layer refuses. For every value a voice transcript can carry
(a string or a number) the two domains are identical. The narrowing is a
tightening in the direction B4 asked for and I have no finding against it. Named,
per the brief, rather than waved through.

One consequence worth recording: the coach now answers with ITS OWN sentence
("Tell me the weight and the reps you actually did.") for inputs the accepted
layer would have refused in ITS own words. The sentence's source line still cites
gym-model.mjs ENTER_PERFORMED, whose actual text is "Enter the weight and reps you
actually completed." That mismatch is PRE-EXISTING (unchanged at both ends) but
the change widens the set of inputs that take the coach's sentence instead of the
layer's. NOTE N5.

Also measured and good: the confirmation now displays the COERCED number, so
"1e3" is confirmed as "1000 lb", which is what will actually be stored.

## 10. THE PRODUCT POINT ON F1 - AND WHERE I DISAGREE WITH THE PM

Does any renderer, runDemo transcript or shipped surface TODAY let an athlete
confirm numbers that were never shown? I checked all three.

  - NO RENDERER READS `confirmation`. coach-text.cjs, wave1-text.cjs and
    onboarding-text.cjs each render only unavailable.reason. Grepped; the only
    non-test reader of a `confirmation` member anywhere is memory-tools.cjs's own.
  - runDemo (wave1-text.cjs:100-172) prints tpl.unavailable(r.unavailable) for a
    refused log_set and IGNORES r.confirmation entirely. I ran the real demo over
    the real local-era world at the head: its script's only log_set step carries
    yes:true, so the no-yes branch is never rendered in the transcript. Nobody
    confirms unseen numbers there today.
  - There is no shipped coach surface. DECISIONS:576 itself: "the coach surface is
    a stub until C-UI-6."

So: NOT BLOCKING. NOTE N6, with the sentence I think TOOL-CONTRACT.md must gain,
verbatim:

    Until C-UI-6 lands, nothing renders confirmation.text. Any surface that
    renders a COACH_CONFIRMATION_REQUIRED refusal from log_set MUST print
    confirmation.text.display verbatim and in full beside the refusal's own
    sentence, and MUST NOT accept a yes for that set until it has. A yes is a
    yes to these numbers; a surface that has not shown them has not been told
    them.

WHERE I DISAGREE WITH THE PM, plainly, as I am asked to.

I accept the MECHANISM without reservation. The numbers had to leave
unavailable.reason: reason goes through T.text(turn_id, ...), which is a TAGGED
value, and that tag is exactly what licensed 987654 and 3210 for the whole turn
(R1 F1, measured). Keeping the numbers in the reason and keeping them unlicensed
are not both possible. The ruling's :565 pattern is the right answer and Astra
built it correctly: licensed false, no turn_id, measured untraceable in both
directions.

What I disagree with is the SUFFICIENCY of the remedy. The ruling leaves the duty
in a brief and a contract paragraph, and a brief is a promise, not a guard. As of
this head, every renderer in the tree and the only end-to-end transcript in the
tree print a consent prompt that has lost its object: "Nothing is recorded yet.
Say yes to confirm the weight and reps." - which weight, which reps, it does not
say. DECISIONS and the W8 D6 cell say a yes must be a yes TO THESE NUMBERS, and
today the printed line cannot carry that meaning. I would want, in this round or
the next, a CELL that fails if a rendered COACH_CONFIRMATION_REQUIRED line from
log_set is produced without confirmation.text.display beside it, so that the duty
is enforced by the bar and not by a document. I do not think the round should be
held for it, and I would not block on it alone - but I record the disagreement.

Second, smaller disagreement, with the ruling AS WRITTEN rather than with its
intent. DECISIONS:576 B4 says "The closed set of codes the model's save() answers
with its own fixed copy passes through unchanged; anything else selects one fixed
sentence". Astra implemented that sentence exactly. The sentence's premise is that
the thing the coach calls save() on is the sealed model. It is not - it is
local-world.mjs's wrapper, which answers with codes and sentences of its own. The
ruling as written therefore orders the destruction of copy I do not believe the PM
meant to destroy. That is B1, and it is why B1 is a finding against the build
rather than only against the ruling: the build's own comment asserts a fact about
its runtime input that is false, and nothing measured it.

## 11. B1 - PROVENANCE AND THE typeof name GUARD, DRIVEN AT SIX SITES

Shapes driven at each of waveCatch, onboardingCatch, submitCatch, checkinCatch,
machineSettingsCatch, waveName and onboardingName: a Proxy whose get trap throws,
a getter that throws, a REVOKED Proxy, a boxed String, a 200000 character string,
a string carrying U+2028 and U+2029, an object whose toString throws, a Symbol,
and a null-prototype object.

GOOD, and measured at BOTH ends:

  - provenance() itself never threw, at any site, for any shape. Every conversion
    failure returned the fixed "(unprintable)".
  - The `typeof name !== "string"` guard is a REAL fix. At the base, a get-trap
    Proxy and a throwing-toString object passed as the tool name ESCAPED both
    wave1 and onboarding dispatch. At the head both are refused.
  - No athlete-facing member carried the marker at any site.

THREE RESIDUALS, all measured, none of them a regression this round introduced:

  N7. A THROW STILL ESCAPES A CATCH, at three of the five catch sites. Every site
  reads `error && error.message` AT THE CALL SITE and hands the RESULT to
  provenance(), so a `message` getter that throws propagates before provenance is
  ever entered. Measured, identical at 24503919 and 523a29c9:

      waveDispatchCatch     !! ESCAPED THE CATCH: Error: MSG GETTER
      onbDispatchCatch      !! ESCAPED THE CATCH: Error: MSG GETTER
      checkinApplyCatch     !! ESCAPED THE CATCH: Error: MSG GETTER
      submitPrepareCatch    refused (the outer dispatch catch contains it)
      machineSettingsCatch  refused (same reason)

  The ruling asked for "one provenance() helper whose own conversion cannot
  throw", and that is precisely what was delivered, so this is not a failure to
  obey the ruling and it is not a regression. It is one line from being closed:
  pass the whole error and read .message INSIDE provenance's try.

  N8. A REVOKED Proxy passed as the tool name still escapes wave1 and onboarding
  dispatch, at both ends - the new guard routes it to the refusal builder, but the
  builder puts the raw value in `tool` and assertNoLeak's walk then does
  Array.isArray on it and throws. TOOL-CONTRACT.md's new claim that "Non-string
  unknown names are refused before property-key coercion" is therefore only
  half true. And memory-tools.cjs got NO guard at all: all three hostile names
  still escape its dispatch. That asymmetry is worth naming because
  memory-tools.cjs WAS edited this round (for F2), so "it is an accepted file" is
  not the reason it was skipped. Neither is reachable from a real adapter, whose
  tool name is always a JSON string.

  N9. `tool` carries the raw value into the envelope: a boxed String, a 200000
  character string and a U+2028-bearing string all travel there, and
  unavailable.source is never truncated (measured srcLen 200026). The existing
  contract declares `tool` routing metadata and the test helper destructures it
  out by design, so this is a standing decision, not a new defect. I record it
  because "no athlete-facing member may carry the text" is only true under that
  declaration.

## 12. (f) THE MEMORY CATCH - INSIDE THE CLASS, NOT BLOCKING HERE

COACH_MEMORY_TOOL_THREW is measured, unchanged, at the head:

    reason "Something went wrong inside that on this device, so I have kept
            nothing and read nothing back. Try me again."
    state_unchanged true
    coach-text.cjs prints "... Try me again. Nothing changed."
    onboarding-text.cjs prints "... Try me again. Nothing was recorded."

Is it inside this defect class? YES, and squarely. It is the same construct as the
two TOOL_THREW refusals - a catch around ALL of the memory tools, including the
write ones - and it is a STRONGER overclaim than either of them, because it does
not merely assert state_unchanged:true, it says in words "I have kept nothing"
about an exception it cannot have inspected, and then two renderers add a tail on
top of that.

Is it BLOCKING here? NO. DECISIONS:565 accepted memory-tools.cjs's answer, and
DECISIONS:576 uses it deliberately as the FLOOR the two new refusals must not fall
below ("they claim nothing stronger than the accepted memory tools' own throw
answer, which is measured first"). The build measured it, pinned it as a control
cell, and disclosed it in the report. That is the right handling of an accepted
file. It is a NAMED FOLLOW-UP, and it should be ticketed rather than left as a
report line: the same reasoning that took state_unchanged off WAVE1_TOOL_THREW
applies to it word for word.

## 13. THE COPY TABLE - PRINTED BY ME, DIFFED CHARACTER FOR CHARACTER

I ran coach-text.cjs, wave1-text.cjs and onboarding-text.cjs over real envelopes
from the real tools and compared my lines to the report's table (lines 288-313).

EVERY ROW THE REPORT PRINTS IS CORRECT, character for character, including the two
rows where the renderers differ (COACH_SET_NOT_RECORDED) and the memory row.

The U+2019 in the ALREADY_RECORDED row is PRE-EXISTING AND SEALED: it is inside
checkin-model.mjs line 30 ("Today's check-in..." with a right single quotation
mark), rebuild/m3 shows EMPTY in the numstat guard, and the coach only forwards
the constant. The report's &#8217; encoding of it is honest. No U+2013 and no
U+2014 was added anywhere by this diff (checked on the added lines of the whole
diff); the author report itself contains zero of both.

TRUTH ON EVERY PATH THAT PRINTS IT: one row fails. The CHECKIN_NOT_RECORDED /
ALREADY_RECORDED line is printed on a path where the coach KNOWS nothing was
recorded and no longer says so - see B2.

THE TABLE IS INCOMPLETE. Four lines a renderer really prints today are missing
from it, and two of them are lines this round CHANGED:

  COACH_MACHINE_SETTINGS_INVALID | all three | I need to know which machine you mean.
      (wave1-tools.cjs:139, a READ refusal; had a tail at the base, none now)
  COACH_MACHINE_SETTINGS_INVALID | all three | <the host's own copy, verbatim>
      (wave1-tools.cjs:192; had a tail at the base, none now)
  COACH_EFFORT_REQUIRED | coach | Tell me how many clean reps you had left, or say
      you are unsure. Nothing changed.
  COACH_EFFORT_REQUIRED | wave1, onboarding | ... Nothing was recorded.
      (unchanged this round, but it is a log_set line the owner is ruling beside)

And the two lines B1 deletes are not shown as deletions anywhere: the owner cannot
rule on copy he is not told is being removed. NOTE N10.

## 14. THE SEVEN EDITED EXISTING ASSERTIONS

Verified each against the diff. None is a weakening:

  1-3 text-tags.test.cjs:14 (UNKNOWN_COPY) and its uses at TT3a/TT5a: a constant
      swap. Full equality on both reason members retained; the provenance,
      hostile-text and untraceable assertions around them are untouched.
  4   onboarding-closed-list.test.cjs:72 - literal swap, full equality kept, the
      exact source assertion kept.
  5   onboarding-closed-list.test.cjs:83 - same, plus code, allowed and
      state_unchanged assertions kept.
  6   memory.test.cjs P-F1 - an ADDED full-sentence equality. Strictly stronger;
      the includes(name)===false and no-digits assertions remain.
  7   wave1-demo.test.cjs W8 (D5, D6) - the three /110/, /8/ and
      /nothing is recorded yet/i matches MOVED from r.unavailable.reason to
      r.confirmation.text.display, and a new exact equality on the reason plus
      licensed===false and turn_id===undefined were ADDED. The durable
      "a log without a yes wrote an operation" assertion is untouched.
      Not weaker as a check that the numbers travel. It IS weaker as a check that
      the ATHLETE SEES them, which is the product point in section 10 and not a
      test defect.

NOTHING ELSE IN THE TREE READS THE OLD STRINGS. I grepped the whole worktree for
"That is not one of the coach's tools" and for "Say yes and I will log": outside
the four changed files the only hits are historical lane report markdown
(P4B-1-AUTHOR-REPORT.md, COACH-TEXT-TAGS-REVIEW-R1.md, WAVE1-TEXT-REVIEW-ANNEX.md
and this round's own report), which correctly record what was true when written.
No product file, no other test, no brief.

## 15. NOTES, COLLECTED

  N1  coach-text.cjs and onboarding-text.cjs still decide a printed line by a
      sentence pattern (/nothing is recorded yet/i) for COACH_CONFIRMATION_
      REQUIRED, and TOOL-CONTRACT.md claims all suppression is by code.
  N2  model-adapter.md never mentions state_unchanged, so the adapter is not told
      how to read its absence. It should gain TOOL-CONTRACT.md's new sentence.
  N3  writeCheckIn does not guard checkin.draft, and the rollback assumes
      state() has choices/issues/fields. Hardening only.
  N4  the dynamic import at tools.cjs:711 is not inside a try; a rejection turns a
      truthful refusal into a throw or into TOOL_THREW. Unreachable today.
  N5  log_set's own refusal sentence now covers more inputs while its source line
      still cites gym-model.mjs ENTER_PERFORMED, whose text differs. Pre-existing.
  N6  the TOOL-CONTRACT.md sentence in section 10, verbatim, plus the C-UI-6 duty.
  N7  a throwing `message` getter still escapes three catch sites, at both ends.
      One line from closed: read .message inside provenance's own try.
  N8  a revoked Proxy as a tool name still escapes wave1/onboarding dispatch, and
      memory-tools.cjs has no typeof-name guard at all though it was edited this
      round. Not reachable from a real adapter.
  N9  `tool` and `source` carry unbounded caller text (200000 chars measured,
      U+2028 measured). A standing decision, recorded for completeness.
  N10 the owner's copy table omits four lines the renderers really print, two of
      them changed by this round, and shows no deletions.

## 16. HOW TO READ THIS

Fix round 2 is good work. B1's provenance helper and the typeof-name guard are a
real fix, measured at both ends. B2's rollback is correct under a 42 case drive
and leaves no trace. B4 closes the exact diagnostic leak R1 measured. F1's
numeric gate is the accepted layer's own gate and admits nothing the engine
refuses. F2's one neutral sentence reaches all three dispatchers and removes a
double tail from submit that nobody had noticed. Red first is honest and the
arithmetic closes.

It is rejected on two findings only, and both are the same mistake in two places:
a closed list was written from the file that was READ rather than from the object
that is RUN, and a suppression that was ruled for two codes was applied to
fourteen. Both are narrow and both are fixable without touching a sealed byte.

Reviewer's file only. No product byte moved in this commit.
