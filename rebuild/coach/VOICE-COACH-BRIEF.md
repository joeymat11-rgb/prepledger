# EARNED — VOICE COACH (GPT-Live-1) — owner ruling 2026-09-10 "Queue it"

Queue position: the FIRST item after the vertical slice (owner speed ruling 2026-09-10). Nothing in this brief may displace or delay the slice. The PM places it in rebuild/QUEUE.md with that dependency.

## What the owner ruled
- A live voice coach for two named users only — Joe and Dad. Private feature; explicit opt-in for each user; not a public-launch commitment.
- Model: OpenAI GPT-Live-1 (API launch 2026-09-10; full-duplex — listens while speaking; native tool calling; front-end voice layer that delegates reasoning to a backend; $0.05/min voice layer at launch; stock voices — custom voice is sales-only).
- Sequencing: TEXT-FIRST (same tool contract, cheaper, every answer is verifiable as text), then the voice layer on top. Hard spending cap on the API account before the first real conversation.

## Architecture rule (binding): voice is the mouth, the engine is the brain
- Every number the coach says (load, reps, effort, calories, protein, trend, rest) MUST come from an engine tool result in the same turn. The model never authors a prescription, target or adjustment from its own head. "The coach that never guesses" is not relaxed for voice.
- The coach reads from a fixed, minimal set of tools: today's plan, current/next set, last comparable performance, weight trend, today's check-in, the reason behind the current instruction. Send only what the question needs — never the whole ledger.

## Change-with-confirmation — three tiers (owner ruling)
1. FACTS — recorded on the spot after a quick spoken confirmation: pain / soreness (with the check-in's follow-ups), equipment unavailable today, set corrections ("8 not 9"), time away, check-in answers. Chat attestation is accepted authority for record corrections (standing precedent). Blank / unknown / cleared semantics of the recovery check-in apply unchanged (blank = unknown, never normal; cleared details never become facts).
2. PLAN CHANGES — only as ENGINE-ISSUED PROPOSALS: the coach passes the new facts/request to the engine; the engine re-plans and returns the proposal WITH ITS REASON; the coach voices both and asks; on the user's yes the proposal is accepted through the existing proposal-issuance + consent path and recorded with the reason. No yes → nothing changes. The model may never construct the proposal's numbers itself and then ask for confirmation (a confirm is not an undo; confirmation of a model guess is still a guess).
3. NEVER VIA THE COACH — phase (detector output, never user choice), calorie / protein floors (D13/D14), progression rules, consent policy. These change only in settings by owner decision, never mid-conversation. The coach may explain them and may say it cannot change them.

## Charter constraints that carry over unchanged
- No urgency, streaks, gamification, nudging or dark patterns in the coach's voice; misses are stated plainly, never softened or dramatized.
- "This conversation doesn't change your plan" stays literally true for tier 3 and for any tier-2 exchange that ends without a yes.
- After a real save, the coach states the actual plan consequence (or "unchanged, because …"); a "saved" alone is not evidence the engine used the answer.
- Privacy: conversation audio/text leaves the phone to OpenAI's API (API traffic is not used for training by default, but it is not on-device). Explicit opt-in screen per user naming this; minimal context per request; no third user until a separate owner ruling.

## Acceptance (two-tier rigor: screens/plumbing tier — ONE independent reviewer + CI)
- Tool-contract test: for a fixed set of scripted questions, every numeric token in the coach's transcript is traceable to a tool result in the same turn (fail-closed if the model emits an untraceable number).
- Tier-2 test: a plan-change request without a recorded yes leaves the plan byte-identical; with a yes, the accepted proposal equals the engine's proposal exactly and the reason is stored.
- Tier-3 test: requests to change phase / floors / rules are refused and explained; state unchanged.
- Cost cap present and verified on the account before the first live session.
- Dad hand test on the phone (5 minutes, no explanation) after Joe's own week of use.

## Not decided (bring to the owner only if it blocks)
- Which backend the voice layer delegates free-form questions to (engine-only tools vs. a text model reading the same tools). Default: engine-only tools first.
- Whether the coach is reachable during an active set or only between sets. Default: between sets.
