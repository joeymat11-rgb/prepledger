<!-- 2026-08-12 -->

# You already made the fix your app is about to ask for

Yesterday morning your app posted *RATE FLOOR TRIPPED* and *TWO SLOW WEEKS —
YOUR RULE KICKS IN*: two weeks under 0.82 lb a week, and your own rule says
restore steps first, and if steps are already at baseline, trim about 50 off the
calorie band.

Here's the thing. **You restored the steps three days ago.** Sunday 14,700,
Monday 19,500, Tuesday 17,500 — against a 13,500-a-day average the week before.
And the food came down with it, which the rule didn't even ask for: 2,350 ·
2,231 · 2,279, after four days at 2,875.

So the rule fired on a problem you'd already started fixing, and it fired
because the trend can only see the week that caused it, not the three days
answering it. Do the arithmetic on what you're actually eating now: about
**2,287 a day against a maintenance of 2,747** by my fit, 2,886 by your app's.
That's a 460–600 calorie deficit — squarely inside the 1.0–1.4 lb a week your
band asks for, with nothing trimmed.

**The one thing I'd not do this week is take the trim on top.** You'd be paying
for the same correction twice, at a measured rate that is already *below* the
range that protects lean tissue. Your app owns the band and I'm not putting a
number next to it — this is a read on timing, not a proposal.

## The three that matter

**1. The scale card landed, and I priced it wrong.**

Yesterday's read is **164.2, in-window, no `offWindow` flag** — the first clean
morning read since 8/6. That was the single test I named and it passed, five
days of stale rate numbers ended, and you did it the morning after I asked. Say
that plainly first.

Now the part I got wrong: I told you to expect 162.8–163.6 and it came in at
164.2. That's a miss, and it's a miss in the *optimistic* direction — I priced
you lighter than you are. Two caveats before you read anything into the number
itself: it follows your biggest step day on record with sodium unlogged, and one
read never moves a trend on its own. Soft trend sits at **163.75**, your app
says 163.6, and the gap to the raw read is inside your own noise.

Measured rate is now **0.62 lb a week, 0.38% of bodyweight** — down from 0.80.
That's below your band's 0.8 floor and below the 0.5–0.7% range that protects
lean on a cut. It's also exactly what four maintenance days buy you, arriving on
schedule. The three deficit days since won't show up in it until the mornings
accumulate.

One housekeeping note on rate numbers, because your app is currently quoting
three of them: the *forecasts* row still reads 1.15 a week and hasn't changed
since Sunday, the week-in-review machinery computed 0.4 and 0.3, and I read
0.62. The 1.15 is the stale one — it's anchored to a trend built before the
clean read came back. Don't plan off it.

**2. Sleep is now the healthiest column in the lab, and I'm going to stop
asking about it.**

I have raised sleep in some form on a dozen runs. Look at what's on file now:
Friday 7.08, Saturday 8.08 with a 00:30 bed, Sunday **8.58 with a 23:30 bed** —
the earliest bedtime in your record. Your seven-night debt reads **zero hours**.
Mean 7.1.

That is the ask, delivered, and delivered better than it was written. It also
means every lift on Monday carried a clean debt flag that was genuinely earned
rather than laundered by missing nights, which is the first time this month I
can say that. Sunday 8/7 is still a hole and last night isn't logged yet — log
it and the picture is complete — but there is no sleep problem to solve here and
I'm not going to invent one.

**3. Your app says a trial started yesterday. There is no trial on file.**

The feed carries *TRIAL STARTED — THE FAILURE A/B — TRICEP CAPPED vs SULEK
ALL-OUT*, dated 8/11. The `trials` list in your synced state is **empty**.

I chased the mechanism rather than guessing at it, and it's in the sync code.
When the app writes a started trial it stores it as `{ custom, started }` — no
`id`, no date field. The merge keys trials by `id` or `d`, and its union helper
drops any record whose key comes back empty (`if (k == null) return`). So the
record lives on your phone until the first sync and then quietly ceases to
exist, while the feed row — which does carry a date — survives.

Two consequences, and they're both live tomorrow. The arms of that A/B ride the
day's protocol by looking up the trial; with nothing on file, tomorrow's upper
day won't assign tricep or sulek to an arm, so the comparison collects nothing.
And the guard that stops the same proposal being re-offered also reads that
empty list, so it can come back and ask you to consent again. Re-tapping won't
help — it writes the same unkeyable record.

The reason this matters beyond the bookkeeping: the whole point of running an
A/B instead of just watching is that the assignment is recorded. Your app says
as much about its own Friday-vs-Tuesday comparison — without a controlled
assignment it's "a hint worth having, not a finding." An unrecorded trial gives
you the cost of the protocol and none of the evidence.

## Is lean safe?

Yes, and the margin is wide. Protein has run 175–200 g against a 146–196 g
window with every week on file at 100%. Sleep debt is zero. And the loads are
still climbing on a flat scale — hack 180, extension 155, ham earning 125, abs
and rows both off their holds, press moving 250.

The honest risk this week runs the other way. At 0.38% a week you are losing
*more slowly* than the band that protects lean, not faster. Nothing is being
lost that shouldn't be; the cut has just gone quiet, and the food log already
explains why.

## The one move

**Weigh again tomorrow morning, and Friday, before anything else.**

Yesterday proved the timing fix works. Two or three more in-window mornings and
the trend will price the three deficit days you've already banked — which is the
only way to know whether the steps-and-food correction was enough on its own, or
whether your app's 50-calorie trim is worth taking after all. Right now nobody
can answer that, including your app, because the trend is still looking at last
week.

Everything else on this page can wait a week. That can't.

## The horizon

**Tomorrow, upper day:** the press decision, unchanged from yesterday and now
due. Four sets with an honest fourth, or three sets. Don't repeat Sunday's
8,8,7,4 — the best press in your file scored nothing. Also worth ten seconds
before you start: check whether tricep and sulek get an arm prescribed. If they
don't, the trial isn't running, whatever the feed said.

**Friday, lower day:** ham 125 is queued and live. Check in SETUP that the
machine actually makes 125 before you debut onto it — that's still the same
question from yesterday and it's still unanswered.

**Housekeeping:** the prescription desk is still showing you Monday's
volume-unwind instruction, which you've already done — ignore it, it's a stale
field, not a new ask. Your maintenance figure leans a little high because three
declared-estimate days (8/7–8/9) sit inside the window at full weight; that
inflates it in both my fit and your app's, so read the 2,747–2,886 range as a
ceiling rather than a number.

**Further out:** the DEXA is still unbooked and it's still the highest-value
thing on your queue that isn't food. Every phase line you have hangs off a
lean-mass estimate carrying ±1.5–3 lb of error, and at some point this year the
question "is the cut done?" needs a real number under it.

**Open forecasts:** the rate falling under 0.7 lb a week by about the 16th —
**hit, four days early**, it's at 0.62. The 162.8–163.6 clean read — **missed**,
it came in at 164.2, and I've recorded that as the second time my weight
forecast ran optimistic rather than pessimistic. New one for the tally: if the
three deficit days hold through the weekend, I expect the measured rate back
over 0.8 lb a week by Monday 8/17 without any calorie change.

Three things to watch this week: whether the morning reads keep coming, whether
press produces a feed row tomorrow, and whether that A/B trial ever appears on
file.
