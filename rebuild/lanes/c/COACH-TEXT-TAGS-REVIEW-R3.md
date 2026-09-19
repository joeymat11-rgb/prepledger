# COACH-TEXT-TAG-SWEEP, narrow Claude check R3 of fix round 3

VERDICT: ACCEPT WITH NOTES.

Branch rebuild/c-coach-text-tags, head 9c42fd4e, one Astra commit on top of the
R2 review commit 00d006d4. Reviewed narrowly: the diff 00d006d4..9c42fd4e and
what DECISIONS:585 and :590 ordered. I am told to disagree where the evidence
lets me. Nothing blocking survived verification. Nine notes follow, three of
which are disagreements with sentences in the builder's own report.

The two copy tables the owner rules were regenerated from real envelopes by me,
independently of the builder's deleted capture script, and they agree with the
report character for character, with no omission. That was the blocking risk and
it is clear.

## 1. The bar, both systems

PC (%TEMP%\earned-astra-2 at 9c42fd4e, clean, pulled ff-only, outside the
builder's sandbox), MEASURED_TEST_NOW=2026-09-03 TZ=America/New_York:

    node --test "rebuild/coach/test/*.test.cjs"    tests 375  pass 375  fail 0
    node rebuild/t2/rig187.cjs                     rig187 PASS
    node --test "rebuild/client/test/*.test.cjs"   tests 18   pass 18   fail 0
    git diff --numstat 00d006d4..HEAD --
      rebuild/engine rebuild/m3 rebuild/m4 rebuild/client .github     EMPTY

Linux (farm scratch worktree at 9c42fd4e):

    node --test "rebuild/coach/test/*.test.cjs"    tests 375  pass 375  fail 0

Both numbers match the PM's. The changed files are exactly the thirteen in the
commit; nothing outside rebuild/coach and rebuild/lanes/c moved.

### The suite runs no git and no child process

The PM sent the first cut back because the new cells read the renderers at a
historical commit with git while the suite ran. That is gone.

- grep of rebuild/coach (product and test): the only occurrences of
  "child_process" are four source-deny assertions that name it as a forbidden
  TOKEN inside machine-settings.test.cjs, memory.test.cjs,
  onboarding-tools.test.cjs and wave1-demo.test.cjs. No require or import of
  node:child_process, no execSync, no spawn, no execFile, no git invocation.
- test/review-r2-support.cjs now requires only node:module and node:path and
  exports only fromSource. The atBase/baseLine helpers and the process import
  are gone, as the report says.
- Measured, not argued: in a scratch copy I ran the whole coach suite with the
  PATH stripped to a directory that contains nothing at all.

      cd <scratch worktree at 9c42fd4e>
      env -i HOME=$HOME PATH=/var/empty MEASURED_TEST_NOW=2026-09-03 \
        TZ=America/New_York /opt/node22/bin/node --test \
        "rebuild/coach/test/*.test.cjs"
      tests 375  pass 375  fail 0

  With no git on PATH and no shell utilities reachable, the suite is green. It
  executes nothing outside its own process.

## 2. Red first, re-proved

At 00d006d4 with ONLY the two test files from the head copied in
(rebuild/coach/test/text-tags.test.cjs, rebuild/coach/test/review-r2-support.cjs)
and the product untouched:

    node --test rebuild/coach/test/text-tags.test.cjs
    tests 64  pass 39  fail 25

The 25 red cells, every one of them a cell this round added or edited:

    6  R1 B4 accepted save copy stays byte-identical: <six model copies>  EDITED
    1  R1 B3 real refusal envelopes follow base endings and catch-all
       exceptions                                                        EDITED
    1  R2 memory catch after synthetic write makes no state claim or tail NEW
    2  R2 B1 real wrapper preserves <the two wrapper codes>               NEW
    3  R2 B2 base tails: already / machine read / machine host            NEW
    3  R2 N7 throwing message getter: wave / onb / checkinApply           NEW
    3  R2 N8 revoked Proxy name: wave / onboarding / memory               NEW
    4  R2 N4 check-in vocabulary import rejection is contained: <four>    NEW
    1  R2 N1 own ending is independent of confirmation code               NEW
    1  R2 N5 invalid set copy names its coach source                      NEW

Five cells this round added are GREEN at 00d006d4 and are controls, not red-first
evidence: the four "R2 B1 mismatched wrapper <code> <code|copy> collapses" cells
(the closed vocabulary at 00d006d4 collapses them too, which is the point) and
"R2 N4 tools source does not import local-world" (tools.cjs did not import it at
00d006d4 either; the import only existed in the unpublished first cut). I say so
because the count 25 should not be read as "every new cell was red".

Row arithmetic: the file went from 41 rows to 64 (+23); the suite went 352 to 375
(+23). No row was lost from the suite. One assertion group WAS lost from the file;
see note R3-N6.

## 3. B1 as corrected by :585: the wrapper's two coded refusals

The corrected rule is that the pass-through is built over the object that is RUN.
I drove the REAL wrapper, rebuild/coach/local-world.mjs openCoachWorld, into both
of its own refusals over a fault-injecting IndexedDB and real webcrypto keys, and
rendered the result through all three renderers.

Measured at the head (wrapper closed, and sleep night moved under a confirmed
draft), and byte-identical at 24503919 for the same two paths:

    CHECKIN_SOURCE_UNAVAILABLE
      coach-text      The check-in could not be read on this device. Nothing
                      was recorded. Nothing changed.
      wave1-text      The check-in could not be read on this device. Nothing
                      was recorded.
      onboarding-text The check-in could not be read on this device. Nothing
                      was recorded.
    SLEEP_NIGHT_CHANGED
      coach-text      This night changed while you were editing. Review the
                      saved record before trying again. Nothing was recorded.
                      Nothing changed.
      wave1-text      This night changed while you were editing. Review the
                      saved record before trying again. Nothing was recorded.
      onboarding-text This night changed while you were editing. Review the
                      saved record before trying again. Nothing was recorded.

Code and sentence both survive. At 00d006d4 both collapsed to
CHECKIN_NOT_RECORDED and "I could not record that check-in answer. Nothing was
recorded.", which was the defect. B1 is closed.

Right code with wrong copy, and right copy with wrong code, both collapse. Driven
by me with a marker carrying digits, all four combinations:

    {code: CHECKIN_SOURCE_UNAVAILABLE, copy: MARKER_987654} -> CHECKIN_NOT_RECORDED
    {code: MARKER_987654, copy: <the real sentence>}        -> CHECKIN_NOT_RECORDED
    {code: SLEEP_NIGHT_CHANGED,        copy: MARKER_987654} -> CHECKIN_NOT_RECORDED
    {code: MARKER_987654, copy: <the real sentence>}        -> CHECKIN_NOT_RECORDED

In all four the printed line is the generic "I could not record that check-in
answer. Nothing was recorded.", the marker reaches source only, and
untraceable("It was 987654.") still returns ["987654"]. The host-diagnostic
collapse R2 drove still collapses: a host copy of "Synthetic host refused.
987654" gets the generic line and leaves 987654 unlicensed.

### The leaf module and the failed model import

checkin-refusals.cjs requires nothing (grep for require in it returns nothing)
and exports two frozen pairs. local-world.mjs re-exports them under the same
names and returns those same objects. tools.cjs requires the leaf at the top with
a plain require and imports local-world.mjs NOWHERE (grep for local-world in
tools.cjs returns nothing; a cell asserts it too). The PM's objection in :590 is
answered.

I drove the model import failure myself rather than trusting the cell: I read
tools.cjs from disk, replaced the specifier
import("../m3/w7-preview/today/checkin-model.mjs") with a data: module that
throws, compiled that source as its own module, and ran both kinds of refusal
through it.

    BROKEN import | wrapper pair CHECKIN_SOURCE_UNAVAILABLE
       -> code CHECKIN_SOURCE_UNAVAILABLE, the wrapper's own sentence
    BROKEN import | wrapper pair SLEEP_NIGHT_CHANGED
       -> code SLEEP_NIGHT_CHANGED, the wrapper's own sentence
    BROKEN import | model copy ALREADY_RECORDED
       -> code CHECKIN_NOT_RECORDED, generic sentence,
          source "tools.cjs check-in vocabulary import: SYNTHETIC_IMPORT_FAILURE"
    REAL   import | model copy ALREADY_RECORDED
       -> code CHECKIN_NOT_RECORDED, the model's own sentence

A wrapper pair still passes and a model copy collapses. One failed import can no
longer erase eight legitimate sentences; it can erase the six model ones, which
is the honest answer when the vocabulary cannot be read.

### Is there any other object that can be world.checkin?

I searched every construction of a coach world in the tree, not only the tests:
grep for createCoachTools outside test files finds one shipped construction,
local-world.mjs, plus the demo in coach-text.cjs which passes only a today model
and no check-in at all. openCoachWorld builds the one frozen checkin wrapper
shown above; its save() has exactly two coded refusals and then delegates to the
sealed model. There is no third object and no third pair, so this vocabulary
destroys nothing else.

## 4. B2 as corrected: the no-tail set is exactly three codes

tools.cjs COMPLETE_REFUSALS now holds WAVE1_TOOL_THREW, ONBOARDING_TOOL_THREW and
COACH_MEMORY_TOOL_THREW, and nothing else. The fourteen-code set is gone.

To test the other half of the order - that no OTHER code's line drifted - I wrote
my own census, independent of the builder's deleted review-r2-copy.cjs. It drives
44 real refusal paths through the real modules and prints what each of the three
renderers actually produces, and I ran the SAME script unchanged inside four
worktrees: 9c42fd4e, 24503919, 6268e7f8 and 00d006d4. 44 paths x 3 renderers x 4
refs = 528 renderer executions. No envelope in it is hand-constructed.

Head versus 24503919, every difference, by path:

    checkin/host exception, host code, host copy   B4 (round 2), declared
    unknown/wave, unknown/onboarding, unknown/memory  F2 list-neutral, declared
    catch/wave, catch/onboarding                   B3 of :576, declared
    catch/memory read, catch/memory write          the memory catch of :585
    set/invalid                                    F1 numeric gate, declared
    confirmation/set                               F1 confirmation move, declared

That is 14 paths. The other 30 are byte-identical at head and at 24503919,
including all six sealed model copies, checkin/input, all five CLEAN_INIT codes,
SETUP_INPUT_INVALID, all three machine-settings reasons, both wrapper pairs,
memory/invalid input, set/effort absent, set/host copy, set/no host copy and
every other COACH_CONFIRMATION_REQUIRED reason. There is no difference that is not
one of the lane's declared copy changes. B2 is closed.

The three lines :585 named as wrongly stripped are back, measured:

    already-recorded    C: ...which is not wired yet. Nothing changed.
                        W,O: ...which is not wired yet. Nothing was recorded.
    machine read        C: I need to know which machine you mean. Nothing changed.
                        W,O: ...you mean. Nothing was recorded.
    machine host copy   C: Your device would not accept that write. Nothing changed.
                        W,O: ...that write. Nothing was recorded.

## 5. The memory catch, fixed in this round

memory-tools.cjs refuse() now omits state_unchanged when and only when the code
is MEMORY_CODES.MEMORY_TOOL_THREW, and the dispatch catch's sentence is the same
neutral one the other two catch-alls use.

Driven by me, both directions:

    write-then-throw  world.memory.save records the fact and THEN throws.
                      writes = [the fact], so a synthetic write DID complete.
                      code COACH_MEMORY_TOOL_THREW
                      state_unchanged ABSENT
                      all three renderers: "Something went wrong inside that
                      tool on this device. I could not complete the request."
                      (no tail)
    read-then-throw   world.memory.forTopic throws inside recall.
                      code COACH_MEMORY_TOOL_THREW
                      state_unchanged ABSENT
                      all three renderers: the same line, no tail.

Memory cells whose expectation changed, old and new, and whether any is weaker:

    1  reason equality
       old: exact equality with "Something went wrong inside that on this device,
            so I have kept nothing and read nothing back. Try me again."
       new: exact equality with the neutral sentence.
       Same strength: one exact string either way. NOT weaker.
    2  state claim
       old: assert.equal(r.state_unchanged, true)
       new: assert.equal(Object.hasOwn(r, "state_unchanged"), false)
       A different assertion, equally exact, and the one :585 ordered.
       NOT weaker.
    3  rendered line
       old: coach-text only, one line with " Nothing changed."
       new: all three renderers, exact equality with the neutral sentence.
       STRONGER (three renderers instead of one).
    4  the drive
       old: recall with a throwing forTopic (a READ).
       new: remember with a save that records and then throws (a WRITE), plus a
            new assert.deepEqual(writes, [fact]).
       Stronger on the write side; see note R3-N6 for what the read side lost.

None of the four is a weakening. I agree with the report on that point.

Does anything in rebuild/coach or its documents still promise the athlete that a
memory failure kept nothing? No. grep for "read nothing back" over rebuild/coach
and the rebuild docs returns nothing. The seven remaining "I have kept nothing"
sentences in memory-tools.cjs are all on DETERMINISTIC refusals where the layer
really did keep nothing (invalid input, no lane, no yes, cancelled, mismatched
words, the accepted layer's own ok:false), not on a catch-all.
TOOL-CONTRACT.md's old paragraph saying "The accepted memory catch and its
existing tail are unchanged; the author report records their overclaim for
separate review" is removed, correctly.

## 6. The notes as landed

N1  Both code-plus-pattern lines are gone. coach-text.cjs now tests
    /nothing chang|nothing is recorded yet/i and onboarding-text.cjs
    /unchanged|nothing was recorded|not recorded|nothing is recorded yet/i.
    wave1-text.cjs needed no edit: its pattern already held
    /nothing (is|was) recorded/. Measured: the confirmation line
    "Nothing is recorded yet. Say yes to confirm the weight and reps." prints
    with no tail in all three renderers, and a SYNTHETIC code with that reason
    also prints with no tail, so the ending is decided by the sentence and not by
    the code. The contract sentence "Every other refusal follows that renderer's
    own-ending pattern, including 'Nothing is recorded yet.'" is true as measured.
N2  model-adapter.md gains: "For a refusal envelope, absence of state_unchanged
    means unknown, never a claim that state was unchanged or that a write
    happened." Landed.
N4  The dynamic import is inside its own try, separate from the wrapper check.
    Landed and driven above.
N5  log_set's invalid-input source is now
    "wave1-tools.cjs log_set invalid-input refusal", not
    "gym-model.mjs ENTER_PERFORMED". Landed, and a cell pins it.
N6  The R2 contract paragraph landed VERBATIM. I compared it mechanically:
    the R2 file's indented block, whitespace-normalised, is character-for-
    character equal to the TOOL-CONTRACT.md line. MATCH.

N7  provenance(value) now reads .message INSIDE its own try. R2 named five catch
    sites; the new cell drives three of them, so I drove all five myself, plus
    the two memory sites the same fix touched, with
    { get message() { throw new Error("MSG GETTER"); } }:

      waveDispatchCatch      refused WAVE1_TOOL_THREW,        source (unprintable)
      onbDispatchCatch       refused ONBOARDING_TOOL_THREW,   source (unprintable)
      checkinApplyCatch      refused CHECKIN_INPUT_INVALID,   source (unprintable)
      submitPrepareCatch     refused SETUP_INPUT_INVALID,     source (unprintable)
      machineSettingsCatch   refused COACH_MACHINE_SETTINGS_INVALID, (unprintable)
      memoryDispatchCatch    refused COACH_MEMORY_TOOL_THREW, source (unprintable)
      memoryOfCatch          refused COACH_MEMORY_INPUT_INVALID

    Nothing escaped, and assertNoLeak passed on every one. I also threw a Symbol
    (source "Symbol(s)"), a null-prototype object and an object whose toString
    throws (both "(unprintable)") through the wave dispatch catch: all refused.
N8  A revoked Proxy as the tool name at all three dispatchers:

      wave        WAVE1_TOOL_NOT_IN_LIST        tool "(not a tool name)"
      onboarding  ONBOARDING_TOOL_NOT_IN_LIST   tool "(not a tool name)"
      memory      MEMORY_TOOL_NOT_IN_LIST       tool "(not a tool name)"

    source is "... TIERS: (unprintable)" in all three, the reason is the fixed
    neutral sentence, and assertNoLeak passes. memory-tools.cjs also no longer
    delegates a non-string name to coach.dispatch or coach.TOOLS, which was the
    asymmetry R2 named. Landed.

## 7. The tests' own mechanism, and the literals

The suite runs no git and no child process (section 1). That leaves the question
the PM asked: can a wrong literal hide behind the word "captured"?

I extracted all 72 BASE_LINES entries from text-tags.test.cjs and compared them
two ways.

(a) Against what the renderers at 24503919 print for the envelope THAT COMMIT
    produces for the same synthetic path: 18 of the 72 entries DIFFER. Examples:

      MEMORY_TOOL_NOT_IN_LIST, coach
        file: I cannot use that tool here, so I did nothing. Nothing changed.
        what 24503919 prints: That is not one of the coach's tools, so I did
                              nothing. Nothing changed.
      COACH_SET_NOT_RECORDED, coach, B3:14
        file: Tell me the weight and the reps you actually did. Nothing changed.
        what 24503919 prints: Say yes and I will log bad lb for 8 reps. Nothing
                              is recorded yet. Nothing changed.
        (and the code there is COACH_CONFIRMATION_REQUIRED, not
         COACH_SET_NOT_RECORDED)

(b) Against what the renderers at 24503919 print for the HEAD's refusal envelope,
    that is, this lane's code and reason rendered by the old renderer and the old
    refusalHasOwnEnding: 72 of 72 AGREE, zero mismatches.

Interpretation (b) is the right pin. What the cells must hold is "this lane's
sentence with the base's ENDING", because the sentences were changed on purpose
and the endings were not supposed to move. So the LITERALS ARE CORRECT and there
is no wrong expected line hiding anywhere. This is not a blocking finding.

What is wrong is the label. See R3-N1.

## 8. The two copy tables for the owner

Regenerated by me from real envelopes, with the report's own fixture markers
(SYNTHETIC_DIAGNOSTIC_777333, "Synthetic host refused.", STATE_20, load "bad"),
then compared cell by cell against the report after decoding its HTML entities
(&#8217; -> U+2019, &#183; -> U+00B7).

    Table "COPY FOR THE OWNER TO RULE" (report line 496):
      132 cells checked (line text and code name, per renderer, per path)
      0 mismatches
    Table "LINES THIS LANE CHANGES OR REMOVES" (report line 610):
      141 cells checked (old line, new line, old code, new code)
      0 mismatches

Three cells first appeared to disagree, all on the single row
"6268e7f / checkin/input", because my first pass used the hostile answer value
"INVALID" where the report used "SYNTHETIC_DIAGNOSTIC_777333" and that value is
echoed inside the old sentence. Re-driven with the report's own value:

    C: unknown answer SYNTHETIC_DIAGNOSTIC_777333 Nothing changed.
    W: unknown answer SYNTHETIC_DIAGNOSTIC_777333 Nothing was recorded.
    O: unknown answer SYNTHETIC_DIAGNOSTIC_777333 Nothing was recorded.

Exactly the report's three strings. So: 273 cells verified, 0 real mismatches.

COMPLETENESS, which matters as much as accuracy. I took every (base ref, path,
renderer) triple in my 528 measurements where the base line differs from the head
line, or the code differs, and asked whether the second table contains it.
OMISSIONS: 0. Nothing this lane changes or removes is missing from the table the
owner will rule.

Every NEW sentence in the tables, checked for truth on every path that prints it:

  "I cannot use that tool here, so I did nothing."  TRUE at all three unknown-tool
  dispatchers; it is list-neutral, which was F2's whole point, and unlike the old
  per-list sentence it is not false when the name belongs to a sibling list.
  Nothing is written on that path; state_unchanged is true there, measured.

  "I could not record that check-in answer. Nothing was recorded."  TRUE on
  checkin/input (the draft is restored, R2 measured 42 of 42 applies) and on the
  three CHECKIN_NOT_RECORDED host paths, where the sealed model refused and no
  operation was written.

  "Nothing is recorded yet. Say yes to confirm the weight and reps."  TRUE: the
  gym is not touched before a yes. The weight and the reps are in
  confirmation.text.display, unlicensed, and the N6 paragraph now binds any
  future surface to print it. Until C-UI-6 this line names no numbers, which R2
  disagreed with and :585 answered by making COACH-CONFIRM-SHOWN a C-UI-6
  acceptance row.

  "Tell me the weight and the reps you actually did."  TRUE: the numeric gate is
  the accepted edit-values.cjs domain and it refuses before any write.

  "Something went wrong inside that tool on this device. I could not complete the
  request."  See R3-N5. It is the sentence :585 ordered and the one the two
  accepted catch-alls already print, but its second clause is an assertion about
  completion that a catch-all cannot establish.

No U+2013 and no U+2014 are added anywhere by this commit (I scanned every added
line of the diff: zero).

## 9. Notes

R3-N1. THE BASE_LINES LABEL IS FALSE FOR 18 OF ITS 72 ENTRIES, and so is the
sentence in the report that defends it. The comment above the table reads
"Captured from 24503919 on 2026-09-19: these are the lines the owner was shown."
For 18 entries that is not so: 24503919 prints a different line for that path,
because this lane changed the SENTENCE as well as the ending (measured in section
7(a)). The report repeats the claim: "compared every entry with the existing
helper's renderer output at 24503919 for that captured synthetic envelope", where
the envelope is in fact the HEAD's. The literals are right and the cells are
strict; only the label misdescribes them, and it misdescribes them in exactly the
direction a reader checking the owner's copy would be misled. Proposed fix, one
comment line: "Each line is this head's refusal envelope rendered by the
24503919 renderer and its refusalHasOwnEnding: the lane's sentence with the
base's ending. It is not a transcript of what 24503919 printed." Not blocking,
but it should not survive to the PM's final read unchanged.

R3-N2. A NEW CONTRACT SENTENCE IS FALSE ON THE PATH THE SAME PARAGRAPH INTRODUCES.
TOOL-CONTRACT.md now says "Both saved.code and saved.copy travel in source via
provenance." Measured on the model-import-failure branch this round added:

    source = "tools.cjs check-in vocabulary import: SYNTHETIC_IMPORT_FAILURE"

saved.code and saved.copy do NOT travel there; the host's own refusal is lost
from the diagnostic entirely. Two sentences later the same paragraph describes
that branch. Under this lane's own N1 standard ("the contract says what is true")
that is a defect, a small one. Proposed fix: "Both saved.code and saved.copy
travel in source via provenance, except on a rejected model import, whose source
carries the import failure instead."

R3-N3. THE WRAPPER PASS-THROUGH MISATTRIBUTES ITS OWN SOURCE. Measured:

    code CHECKIN_SOURCE_UNAVAILABLE
    source "checkin-model.mjs save(): code=CHECKIN_SOURCE_UNAVAILABLE; copy=The
            check-in could not be read on this device. Nothing was recorded."

The value came from local-world.mjs's wrapper, not from checkin-model.mjs save().
Diagnostics are the one place this lane insists the truth be exact, and a future
reader chasing CHECKIN_SOURCE_UNAVAILABLE is sent to the sealed file that cannot
produce it. One ternary on the source prefix closes it.

R3-N4. AN UNDECLARED BEHAVIOUR CHANGE RIDES IN ON THE N7 FIX, at onboarding
submit. The site used to read `error && error.message` and hand the result to
provenance; it now hands the whole error. For a thrown Error nothing changes. For
a thrown raw STRING it does. Driven at both commits:

    commands.prepare throws the STRING "CLEAN_INIT_SETUP_REQUIRED"
      at 00d006d4 : code SETUP_INPUT_INVALID, source "... prepare(): undefined"
      at 9c42fd4e : code CLEAN_INIT_SETUP_REQUIRED,
                    source "... prepare(): CLEAN_INIT_SETUP_REQUIRED"

The athlete copy is identical either way (model.COPY.saveRefused), the published
code is still restricted to declared REFUSAL_SENTENCES keys, and the source line
got strictly better. I think the new behaviour is the more faithful one: a layer
that throws its own refusal name should be believed regardless of throw style.
But it is a change to what the coach publishes as a code, it is not in the
report's finding-to-evidence map, and no cell covers it - TT4b throws Errors
only. One row added to TT4b's loop (throw the bare string) would pin it either
way. I do not block on it; I want it named before the PM's final read so the
decision is made and not inherited.

R3-N5. THE NEUTRAL SENTENCE STILL MAKES ONE CLAIM A CATCH-ALL CANNOT MAKE, and
this round's own new cell demonstrates it. "I could not complete the request."
asserts the request did not complete. The cell "R2 memory catch after synthetic
write makes no state claim or tail" asserts writes deepEqual [the fact] - that is,
the write DID land - and then asserts the athlete is told "I could not complete
the request." The envelope is honest (state_unchanged is absent, claiming
nothing), but the sentence is not silent, it is negative.

This is not a defect of this round: :585 ordered "the same neutral sentence", and
WAVE1_TOOL_THREW and ONBOARDING_TOOL_THREW have printed it since :576 was built,
where log_set reads the gym again after logSet succeeds. The residual is
therefore three codes wide and older than this ticket. I record it because the
owner rules this copy next and should rule it knowingly. A sentence that claims
nothing either way, for example "Something went wrong inside that tool on this
device." with no second clause, would match what the envelope says. That is the
owner's call, not mine, and not a reason to hold the round.

R3-N6. THE MEMORY READ PATH LOST ITS ASSERTIONS, and I disagree with the report's
"No test row was removed." No suite ROW was lost, true. But the four assertions
the old control made on the READ path (code, reason, state_unchanged, rendered
line) were replaced by a cell that drives only the WRITE path. What remains for
the read side anywhere in the tree is memory.test.cjs, which asserts the CODE and
the absence of digits and nothing about state_unchanged or the printed line. I
measured the read path myself and it behaves identically (no tail, state_unchanged
ABSENT, the same sentence in all three renderers), so this is coverage, not a
defect. Two lines inside the existing cell - drive recall with a throwing
forTopic and repeat the same three assertions - would close it.

R3-N7. THE NO-TAIL CODE IS SPELLED TWICE. tools.cjs holds the string literal
"COACH_MEMORY_TOOL_THREW"; memory-tools.cjs holds
MEMORY_CODES.MEMORY_TOOL_THREW = "COACH_MEMORY_TOOL_THREW". Nothing pins them
equal. The B3 matrix would catch a drift only for codes it exercises, and the
memory catch is not in that matrix - it is asserted by one cell that also uses the
string literal, so a rename in memory-tools.cjs would fail that cell loudly.
Acceptable as it stands; worth a single assertion
(assert.ok(T.refusalHasOwnEnding(MT.MEMORY_CODES.MEMORY_TOOL_THREW))) so the two
files can never drift apart quietly.

R3-N8. COACH_EFFORT_REQUIRED IS IN THE OWNER'S TABLE BUT IN NO CELL. N10 added the
set/effort absent rows to the copy table (correctly; I measured them and the
report's strings are right). No cell asserts that code's rendered line, so if
COMPLETE_REFUSALS ever gained it the owner's table would go stale without a red
bar. One row in the B3 matrix fixes it. Small.

R3-N9. HOUSEKEEPING FOR WHOEVER HANDS THE OWNER THE TABLES. The report now holds
TWO sections headed "COPY FOR THE OWNER TO RULE". The first (report line 278) is
the round-2 one and still shows the OLD memory line, "Something went wrong inside
that on this device, so I have kept nothing and read nothing back. Try me again.
Nothing changed." The report does say the later section supersedes it, and the
first table says so too. It is still two tables under one title in one file, and
the owner must be handed the second pair (report lines 496 and 610). Not a defect;
a handling instruction.

## 10. Where I looked and found nothing to report

- memory-host.mjs still reads (error && error.message) at two sites, so a hostile
  message getter escapes THAT function. It is outside this round's diff and R2
  did not name it. I checked that it is contained: the escape lands in
  memory-tools dispatch's try and comes back as COACH_MEMORY_TOOL_THREW
  (measured). No finding.
- MEMORY_TOOL_NOT_IN_LIST is the one memory code without the COACH_ prefix its
  siblings carry. Pre-existing, not this round, no behavioural consequence.
- The removed codes (CHECKIN_INPUT_INVALID, CHECKIN_NOT_RECORDED,
  COACH_MACHINE_SETTINGS_INVALID, SETUP_INPUT_INVALID, the five CLEAN_INIT codes,
  the three TOOL_NOT_IN_LIST codes) all reach the renderers' patterns correctly;
  I measured every one of them at head and at 24503919 and none drifted.
- assertNoLeak passes on every envelope I produced, including the revoked-Proxy
  ones R2 said it threw on.
- The commit touches no sealed file: rebuild/m3, rebuild/m4, rebuild/engine,
  rebuild/client and .github are all untouched (numstat guard EMPTY on the PC).

## 11. What I did not verify

- The private conformance suite, the protected soak, the port, any phone or
  deployed surface. None was opened or run; none is in this lane.
- GitHub CI for this head (the both-OS evidence beyond my two runs) - the PM's
  to read after the push.
- I did not re-derive R2's own measurements (the 42 of 42 rollback, the numeric
  gate's equivalence to schema.cjs validSet). :585 accepted them and they are
  outside this round's diff.
- The builder's claim that the deleted review-r2-copy.cjs was untracked and
  removed: I can see it is absent from the tree at both 00d006d4 and 9c42fd4e,
  which is consistent, but I cannot verify what was deleted from a working tree
  I never saw. It does not matter: I regenerated both tables without it.

## 12. Recommendation

ACCEPT the round. The two blocking findings of R2 are closed as :585 corrected
them, the memory catch is fixed in this round as ordered, both of :590's two
send-backs are answered, the bar is green on both systems, and the owner's two
copy tables are accurate and complete as measured independently. R3-N1 and R3-N2
are two sentences that should be corrected before the PM's final read, because
both are places where a document in a lane about truthful sentences says
something that is not true. R3-N4 wants a decision recorded. The rest can ride.
