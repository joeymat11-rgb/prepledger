# CLAUDE REVIEW: EOP-OPTIONS (EARN-ON-PHONE-OPTIONS, the owner's choice paper), round 1
Reviewer: Claude, the independent reviewer of DECISIONS:635 point 1. I am the author of f0a5eb1a (the EPP review
this paper cites), not of this paper, of its check (a731f483) or of its Astra reviews.
Asked at DECISIONS:652, class (a) paper proposing new engine and data-path work. Run on Joe's word "review".
Head 4918c1778b9b00ca9c8a752a6f4f1d2db7a7960a, base a731f48393a1d7a79b0bb86afebfd8efca2d0ec3. base..head: the paper
(842 lines at the head, read whole; scope as asked: choices and prerequisites, no engine re-audit) and a 35-line correction report (read whole).
NO product hunk (DECISIONS:439 has nothing to list). Paper sha256 re-measured on the PC:
ba9c2998faca2d5e36ca82750aaadadd7092c32602a670a8509c4e55b7b59840 (equal to :652). PC clock 2026-09-21 14:57 to 14:59 ET.
Astra L1 (cff4f8a8) and L2 (75d98668) read whole AFTER my own findings. No repository test or helper was run (:645).
## VERDICT
ACCEPT WITH NAMED DEBTS as the engineering paper. NOT YET FIT TO PUT IN FRONT OF JOE: section "For Joe" owes the
three corrections below first. They are small text changes; none changes an option, a count or the recommendation.
I carry L1's D-EOP-MANIFEST, -OWNER and -FINAL unchanged.
## WHAT I CHECKED MYSELF
1. THE INVENTORY. My own cell (%TEMP%\claude-epp\eop-check.cjs, reads the S8 acceptance file and tests each path
   against BOTH maps): all 23 file IDs carry the S or F the paper gives them, 0 mismatches; the six proposed new
   files are absent from the tree. Arithmetic re-done by hand: common 12 (FC01, FC03 to FC13); A 15, B 17, C 15,
   D 17 incremental; 17 / 19 / 17 / 19 inclusive; S8 keys 9 / 10 / 9 / 9 and 11 / 12 / 11 / 11; row families
   22 / 24 / 25 / 24. All as printed.
2. THE MISSING DURABLE YES. READ: respond exists at rebuild/client/index.cjs:349-371 and the word does not occur at
   all in m3/w6/t2-stage.cjs or m3/w6/local/local-client.mjs. The paper's claim that every option must first
   carry a yes through the durable client is right, and it is the real size of the work, whichever letter wins.
3. OWNER AUTHORITY. READ DECISIONS:631 whole: "Yes, yes, A, A" settles the repair, the live-app work, the timing
   and the second-file refusal. It does not touch how a newly earned weight is agreed to.
## NAMED DEBTS (mine), all in section "For Joe"
D-EOP-CONSENT THE QUESTION THE LEDGER SAYS IS HIS IS NOT PUT TO HIM. DECISIONS:605 records that this paper "names
  the contradiction the owner will have to rule: the legacy rule queues an ordinary earned debut with no tap, while
  the native repair is asked to change a load only on a yes." Section 6 item 3 still names it, and section 3 says
  the yes-only rule comes from "the assignment's locked rule", not from him. But "For Joe" says "you still say
  yes", as though that were how his weights move today. It is not: in the engine, which is copied from the app he trains with,
  two honest sessions at the top of the window queue the next rung by themselves (rebuild/engine/earn.cjs:88; the
  offer text at :80 says "the single-rung debut queues automatically either way"; I measured that producer in
  f0a5eb1a). Under A, B, C and D alike the ordinary rung would wait for a yes, and under A for a button press
  first. That may well be what he wants. It is a change to how he progresses, it is his to rule, and the page
  written for him hides it behind the word "still".
  OWED: one plain sentence in "For Joe" saying so, and the question put to him. PAYS: the next revision, before
  the PM asks him to choose.
D-EOP-ASK TWO QUESTIONS ASKED, THREE OWED. Section 4 says the owner-facing questions "are in the first section"
  and lists three: the route, the capture repair, the A fallback. "For Joe" ends with two. The capture repair is
  stated as a fact, never asked. OWED: ask it, in his section. PAYS: the next revision.
D-EOP-CAPTURE-WORDS WHAT CAPTURE REFUSES. "For Joe" says a separate part "still refuses the repaired result".
  What I measured is narrower, and older than the repair: when an untaken bigger offer sits beside an ordinary
  earned step for the same lift, the part that prepares the day's workout on the phone refuses the whole day,
  with or without the repair; after a tap it prepares it correctly. Say that, and what it costs him: no workout
  card that day until he taps or declines the offer. PAYS: the next revision.
## NOTES (not debts)
N1 IS THE CAPTURE FIX A BEFORE-TRIAL PREREQUISITE OF EVERY OPTION? The paper says so without argument. Under its own
   design the durable effect of a yes is ONE accepted debut, which capture accepts today (my probe: the tapped
   pair maps to its vector). The refusal needs a second open debut-kind entry for the same lift. So the
   dependency is real only if the new effect fold keeps an untaken two-rung offer in state.queue beside an accepted
   rung, or through the import merge, which mints the pair today (check section 6, case c). The second is reason
   enough to fix capture; the first is a design choice the brief must make on purpose. The build brief should say
   which, because it decides whether FC01 can be proved on the phone before the capture ruling.
N2 "ENGINE CHANGE". The paper's own legend marks E for files under rebuild/engine. engine-capture.cjs is under
   rebuild/m4/workout, and my cell finds it in NEITHER S8 map (F). Asking Joe for his word is the PM's reading of
   :578 and is the safe side; the page for him should call it what it is, the part that prepares the workout.
## WHAT I DID NOT DO
No engine re-audit, no review of NATIVE-LOAD-SPEC (264f76a9, not asked), no runtime, build, import, browser or phone.
I did not re-verify the section 2 READ citations beyond items 2 and 3 above and earn.cjs:80,88. No protected path,
private fixture, ledger directory, old-app source or real measurement was opened or reached by any process of mine.
