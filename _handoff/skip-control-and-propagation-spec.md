# Spec — skip-control phantom banking + amend-propagation across the four instruments

**Status:** inbound requirement for a Claude Code build session. Read-only investigation is done; this file is the buildable requirement.
**Investigated against:** `origin/main` = **v7.11.1** (`git show origin/main:src/app.jsx`). Line numbers below are from that source (the un-minified `src/app.jsx`; the committed `app.js` build differs — anchor on the **symbol names**, then grep-verify, per CLAUDE.md).
**Version note:** the task briefing said "live is v7.4.1." `origin/main` is actually **v7.11.1**, and the working branch `fix/exlast-follows-log` already holds an uncommitted **v7.12.0**. Per `NEXT.md` ("v7.11.0 shipped; the repairs are blocked on the phone updating"), Joe's **phone is running an older build**, which is why the analyst's repro cases show behaviour already partly repaired in v7.11.1. This spec targets what is **still broken in `origin/main` v7.11.1** — do not assume the phone's symptoms and the live code are identical.
**Guardrails honoured:** read-only; no app edits, no build, no push were performed producing this file. Engine-owns-numbers and the keyed-union / refuse-to-shrink data-safety model are treated as hard constraints (see §5).

---

## 1. Problem statement

Two linked defects in the workout-logging / record layer of "Measured":

1. **Skip-control banks sets at target reps.** A lift the athlete did *not* perform can still be written into `sessionLog[date].entries` at its **target reps**, minting phantom progress. The analyst graded this a root-cause bug and attached a mechanism to case-law **CL-6**.
2. **Amendments don't reach every instrument.** The same lift reads differently across the app's four surfaces — **feed**, **session log**, **lift card**, **queue** — because an edit / skip / un-skip re-derives only *some* of the denormalised caches those surfaces read. The analyst opened watch **W-5**: *"do amendments reach every instrument?"*

### The three concrete repro cases (from the 2026-08-05 nightly brief, `e3dcf9f`)

- **A — Tuesday leg extension.** The **feed** shows leg extension un-skipped and logged **8,8** (Tue 8/4). The **session log**, **lift card**, and **queue** still read **July 31**. Consequence: a 10-day progression gate is sitting *unmeasurable* — the surfaces that drive progression never saw the amendment.
- **B — two 0-RIR openers set a `holdFlag`.** The lift cannot progress until an honest opener lands. **This is correct behaviour, not a bug** — see §4.2. It is listed because it *looks* like a stuck instrument and must be explicitly excluded from the fix so it isn't "repaired" away.
- **C — ham-curl top-of-window counter stale.** `exercises.ham` reads `topRun: 1` (one sighting) at load 120, banked off the **7/31 phantom** (`120 × 12,12`, which the note says was skipped — CL-6). An 8/4 real ham session at `120 × 10,10` is below the window and, by the app's own reset rule, should zero the counter — but `topRun` stays `1`. This is the **unreconciled cache**: a real ham repeat would then queue `125` off a half-real baseline (the unearned-bump shape of CL-2).

---

## 2. Architecture: one source of truth, five denormalised caches

**Canonical source of truth:** `s.sessionLog[iso]` — `{ entries:[{id,reps,rir,rirSets,w}], skipped:[{id}], note, niggles, dips, pace, corr? }`. `entries` and `skipped` **partition** the session (every lift lands in exactly one). This is the only place performance is *stored*.

Everything else is a **denormalised cache derived from replaying the log**, written imperatively by `completeSession` (`src/app.jsx` ~L1290) in a single forward pass. There are **five** such caches on each `exercises[]` entry, plus the queue:

| # | cache | written in `completeSession` | read by (instrument / engine) | reconciled on amend? | reconciled on load (`migrate`)? |
|---|---|---|---|---|---|
| 1 | `ex.lastMeta` | L1306 | lift card, `progressStep`, `liftCall`, analyst dossier | ✅ via `deriveLastMeta` | ✅ (indirectly) |
| 2 | `ex.last` | L1321/1335/1357/1370/1385 | `targetsFor` / `progressStep` (the target the card shows) | ✅ via `deriveLastMeta`→copy | ✅ `reconcileLiftCaches` (L7116) |
| 3 | `ex.topAt` / `ex.topRun` | L1398–1399, 1405, 1416 | earn/queue logic ("N sightings at this load") | ❌ **NO** | ❌ **NO** |
| 4 | `ex.holdFlag` / `ex.rirHist` | L1310–1314 | `progressStep` governor hold, `targetsFor` | ❌ **NO** | ❌ **NO** |
| 5 | `ex.own` / `ex.std` / `ex.reclaim` / `ex.ladder` | L1321,1328–1348,1355–1362,1367–1378 | progression standards, queue | ❌ **NO** | ❌ **NO** |
| — | `s.queue` (debut/own/earn items) | pushes at L1338,1362,1378,1408 | **queue** surface, `pickStructural` | ❌ **NO** | ❌ **NO** |

The v7.11.x work already brought caches **1 and 2** into line (commit `d0e05e7` — *"ex.last is the third denormalised cache, and it kept the phantom alive"*; `reconcileLiftCaches` at L7116, called from `migrate` L7132/7135). **Caches 3, 4, 5 and the queue are still unreconciled** — that is the whole of watch W-5.

### The four instruments — what each reads

- **Feed** — `s.feed[]` (append-only event log). Both amend handlers `unshift` a `RECORD AMENDED …` line, so the feed reflects an amendment **immediately**. This is why repro A shows the un-skip in the feed and nowhere else.
- **Session log** — `s.sessionLog[iso]` directly (the SESSION LOGGED card, L11201 `done.entries` / `done.skipped`). Amend handlers *do* mutate this record.
- **Lift card** — `ex.lastMeta` / `ex.last` (cache 1/2). Re-derived on amend → *should* update, but only these two.
- **Queue** — `s.queue[]` (cache "—"). **Never touched by an amend.** A debut earned off a phantom stays queued after the phantom is removed.

The single-source principle CLAUDE.md states as *"Lab readouts always need up-to-date relevant info"* is violated because the amend path patches a **subset** of the caches that the readouts read.

---

## 3. Root cause #1 — skip-control banks target reps (two finish paths, two skip-inferences)

There are **two** finish paths and they use **two different** "performed vs skipped" inferences:

### 3a. Gym Mode finish — CORRECT
`gymEntries(sessEx, st)` (`src/app.jsx` L12720). Uses the **TOUCHED** rule (TOUCH_NOTE, L12597; `skipOf` L12733–12740):
- *touched* = positive action recorded as it happens (a set banked, an RIR entered, the rep count moved off default) — stored in the draft's `touched` map.
- untouched + no skip-flag → **skipped** (the v7.6.0 "nothing banks at target" guarantee).
- `GymMode.finish` calls `gymEntries(sess.ex, { reps, rir, rirEnd, gskip, touched })` (L12843). Correct.

### 3b. TRAIN finish — BROKEN
`complete()` (L11150) → `mergeSessionDrafts(sessEx, trainDraft, gymDraft, {final:true})` (L12645). This merge **ignores the gym draft's `touched` map**. It reads `gskip`, `reps`, `idx` only, and re-infers a skip from the **gym index**:

```
// L12680
if (final && i > reached && gReps[ex.id] == null && (t.reps||{})[ex.id] == null) out.skipped[ex.id] = true;
```

`reached = gymDraft.idx` = the lift Gym Mode is *currently on*. This only marks lifts **ahead** of the cursor as skipped. A lift that was **reached** in Gym Mode (`i ≤ reached`) but **never touched** (no set, no RIR, reps still at default) is **not** inferred skipped. It then flows through:

```
// L11161
const entries = sess.ex.filter((ex) => !fin[ex.id])
  .map((ex) => ({ ..., reps: getReps(ex), ... }));   // getReps = reps[id] ?? ex.tgt.slice()  (L11151)
```

→ the untouched lift is kept in `entries` and **banked at its TARGET reps**. This is the surviving phantom-rep path and the exact shape of the phantom ham `120 × 12,12` (12,12 = the ham's target/window top).

Additionally, when **no gym draft exists at all** (pure-TRAIN session), `mergeSessionDrafts` returns early (`if (!g) return out;`, L12655) and *no* skip inference runs, so any lift the athlete forgot to toggle `skip` on is banked at target via the same `getReps` default.

**Root cause, one sentence:** the app has two skip-inferences; `gymEntries` knows about `touched`, `mergeSessionDrafts` does not — so the TRAIN finish path (and the "left Gym Mode mid-session, finished on TRAIN" path) banks reached-but-untouched lifts at target reps. Existing tests already flag the smell (engine-test.jsx L3601–3603 assert the current, wrong "zero-tap confirms target" behaviour; L3597–3599 assert the Gym path is right).

---

## 4. Root cause #2 — amendments reach only caches 1–2, feed, and the log; not 3/4/5/queue

Both amend controls live in the SESSION LOGGED card:

- **✕ skip-out** (L11205): moves an entry `entries → skipped`, `_stampCorr(rec)`, then re-derives **only** `lastMeta` + `last` via `deriveLastMeta`, then `feed.unshift(...)`.
- **↩ un-skip** (L11225): prompts for hand-entered reps, moves `skipped → entries`, `_stampCorr(rec)`, re-derives **only** `lastMeta` + `last`, then `feed.unshift(...)`.

Neither handler re-derives caches **3** (`topAt`/`topRun`), **4** (`holdFlag`/`rirHist`), **5** (`own`/`std`/`reclaim`/`ladder`), or reconciles **`s.queue`**. So after an amend:

- **Repro C** — the phantom ham that set `topRun:1` at 120 is removed, `lastMeta`/`last` fall back to the real prior session, but `topRun` stays `1`. The counter is a stale cache-3. (The reset at L1416 only runs *inside* `completeSession`; an amend never runs `completeSession`, so the reset never fires for an amended session.)
- **Repro A** — un-skipping leg extension on Tue re-derives `lastMeta`/`last` to Tue 8/4, so the **lift card** *should* update on `origin/main`. That it reads 7/31 on the **phone** is the pre-v7.11 build where even `lastMeta` wasn't re-derived. But on `origin/main` the **queue** still reads 7/31-era state (cache 5 / queue never re-derived), and any `own`/`std` gate that should have re-opened from the Tue session did not — which is the "10-day gate unmeasurable." Fixing this fully requires re-deriving caches 3/4/5 and reconciling the queue, not just `lastMeta`/`last`.

### 4.1 A queue item earned off a phantom cannot be un-queued by deletion (data-safety trap — see §5)
The queue merges by `_queueRank` (done is terminal). An auto-earned debut is **not done**, so if you splice it out locally, a stale device still holding it re-adds it on the next sync (union never drops). **You cannot retract a phantom-earned queue item by removing it.** It must be marked **terminal** (`done:true`, `state:"WITHDRAWN"`) so the merge keeps the withdrawn copy.

### 4.2 `holdFlag` from two 0-RIR openers is CORRECT — do not "fix" it (repro B)
`holdFlag` set by two consecutive RIR-0 openers (L1313) and released by one RIR≥1 opener (L1311) is **intended** progression-governor behaviour, matching the CONSTITUTION. It is derived from the log's `rir` history and is only stale if the **underlying openers are amended**. Scope: the fix must *re-derive* `holdFlag`/`rirHist` from the amended log (so an amended opener flips it correctly), **not** remove the hold semantics. Existing tests pin this (engine-test.jsx L439, L2204–2208, L2300, L2315) — keep them green.

---

## 5. Data-safety judgement (keyed-union / refuse-to-shrink / `dataLossGuard`)

This fix **does** intersect the sync model. Constraints Claude Code must respect:

- **`dataLossGuard`** (L8091, counts via `recordCounts` L8074) guards **record counts** (`sessionLog` day count, `reads`, `nights`, `feed`, `adjustments`, …). It does **not** see entry-level changes inside a session, so moving a lift between `entries`/`skipped` is invisible to it — good, but it means correctness rests entirely on the merge rules below.
- **`_richerSession` / `_stampCorr` / `_corrOf` (CORRECTION_MERGE, L8143–8175).** A correction *shrinks* a record and would lose refuse-to-shrink unless it carries a `corr` stamp. **Every path that mutates a `sessionLog` record MUST call `_stampCorr(rec)`** (both existing handlers do; any new amend logic must too).
- **Exercise object merges by `_exDate`** (L~8230; newest `lastMeta.d` wins) — the *whole* `exercises[]` entry is picked, **not** field-merged. Therefore the counter caches (3/4/5) ride along with whichever exercise copy wins. If a correction makes `lastMeta.d` **older** (e.g. removing a lift's newest session), the corrected exercise scores **lower** and a stale device can revert it — the CORRECTION_MERGE hole, reproduced at the exercise level.
- **Queue merges by `_queueRank`** (done terminal) — see §4.1.

### Verdict: the root fix is BOTH prevention **and** derive-don't-cache on load — not propagate-on-amend alone
Patching each amend handler to also fix caches 3/4/5 is fragile (it is the third attempt at this class) and still loses to the exercise-object merge above. The robust, data-safe shape is:

1. **Prevent** the phantom at the source (§3): unify the two finish paths on the TOUCHED rule so a phantom is never written. A phantom that never exists never needs reconciling and never earns a queue item.
2. **Derive-don't-cache on load:** extend `reconcileLiftCaches` (L7116, already run every load from `migrate`) to **recompute caches 3 and 4 from the log** (`topAt`/`topRun`/`holdFlag`/`rirHist`), the same way it already recomputes `last` from `lastMeta`. Because it runs on **every load**, a stale cache **self-heals regardless of which copy won the merge** — this is exactly why it sidesteps the exercise-merge hole. This is *not* a schema patch (no `SCHEMA_V` bump; additive, idempotent — the `pace` precedent).
3. **Amend handlers** additionally call a single shared re-derivation (see §6) so the surfaces update *immediately* (before the next reload), and mark any phantom-earned queue item **terminal** (`done:true`,`state:"WITHDRAWN"`) rather than splicing it.

Caches 3 and 4 are cleanly derivable from the log (topRun/topAt = replay `atTopOfWindow` sightings at the current load; rirHist/holdFlag = replay the last openers). Cache 5 (`own`/`std`/`reclaim`/`ladder`) and queue debut items are **path-dependent** (they mutate as a *sequence* of sessions and depend on prior queue state) and cannot be cheaply recomputed from the log alone — for these, prevention (step 1) plus terminal-withdrawal (step 3) is the correct, bounded fix; do **not** attempt a full progression replay-from-seed (large, risky, out of scope).

---

## 6. Proposed fix (smallest correct change)

### Fix 1 — one skip-inference (prevention). *Primary.*
- Thread the gym draft's `touched` map into `mergeSessionDrafts` and apply the **TOUCHED** rule instead of the `i > reached` index heuristic. Concretely: in `mergeSessionDrafts` (L12645), read `g.touched`; a lift with `g.touched[id]` falsy (and no TRAIN reps typed and no `gReps`) is **skipped**, regardless of index; drop the `i > reached` clause (L12680). Preserve the pre-touched-draft fallback (`if (!touched) …`) exactly as `gymEntries` does (L12733), so an old draft with no `touched` map degrades to `gskip`-only rather than guessing.
- Best form: **have `complete()` (L11150) call `gymEntries` for the merged draft** so there is exactly **one** function that decides performed-vs-skipped. `mergeSessionDrafts` then only *unifies the two drafts' raw fields* and hands off to `gymEntries` for the partition. One skip decision = single source of truth for "performed."
- Leave `getReps`/`getR` (L11151/12724/12788) as-is: default-to-target is correct **for a touched lift** (the zero-tap confirm path Gym Mode is built around, engine-test.jsx L3603). The bug was never the default; it was letting an *untouched* lift reach the default.

### Fix 2 — one re-derivation function (propagation + self-heal).
- Extend `reconcileLiftCaches(s)` (L7116) — or add a sibling `rederiveLiftFromLog(s, exId)` it calls per lift — to also recompute, from `s.sessionLog` in **date order** (reuse `deriveLastMeta`'s date-sort, L1176 — *insertion order ≠ date order*, the documented trap):
  - `ex.last` ← `lastMeta.reps` (already done),
  - `ex.topAt` / `ex.topRun` ← replay `atTopOfWindow(reps, ex)` (L1092) over performed sessions at the **current** `ex.w`, applying the same reset rule as L1416 (a below-window session at the same load zeros `topRun`),
  - `ex.rirHist` / `ex.holdFlag` ← replay the last two openers' `rir` (rule at L1310–1314).
- Keep it **narrow and non-inventing** exactly as the current `reconcileLiftCaches` doc demands (only on real, non-empty log data; never fabricate; a lift with no performed session leaves caches untouched/null). It is called from `migrate` on every load (already wired, L7132/7135) **and** from both amend handlers so surfaces update without a reload.
- **Both amend handlers** (L11205 ✕, L11225 ↩): after the existing `_stampCorr` + `deriveLastMeta` block, call the shared re-derivation for the amended lift. For any **not-done** queue item whose `gate` was earned by the now-removed session (auto `kind:"debut"` with `exId` == amended lift), mark it `done:true, state:"WITHDRAWN"` (terminal → survives union) and `feed.unshift` a line naming the withdrawal. **Do not splice it.**

### Why this is engine-owns-numbers-safe
No new number is introduced. The re-derivation **recomputes existing caches from the existing log using existing predicates** (`atTopOfWindow`, the RIR-history rule, `deriveLastMeta`). The UI still formats; nothing computes a second rate/target/band. A withdrawn queue item removes an *unearned* proposal — it never invents one.

### Why this is data-safe
`_stampCorr` is preserved on every record mutation (refuse-to-shrink CORRECTION_MERGE intact). Counter caches are made **derived-on-load**, so they never need to win a merge (self-heal via `migrate`). Queue retraction uses the **terminal** `done` rank the merge already honours, so a stale device cannot resurrect a withdrawn item. No `ledger/state.json` counts are written down; `recordCounts` fields only grow. **No `SCHEMA_V` bump** (additive/idempotent, `pace` precedent) — but if any migration-time backfill is added, gate the `SEED.v === SCHEMA_V` assertions per CLAUDE.md.

### One-time reconciliation of the *current* stale ham counter (repro C)
No migration needed if Fix 2 lands: the extended `reconcileLiftCaches` runs on the next load and recomputes `ham.topRun`/`topAt` from the log (the 7/31 phantom, once CL-6-corrected, and the 8/4 `10,10` below-window session, will zero it). If the phantom `120×12,12` is still in `sessionLog["2026-07-31"].entries` (brief says it is), it must first be moved to `skipped[]` via the ✕ control (or the pending `sug_2026-08-01_hamlog` card) — that is athlete-initiated per CL-6, not an automatic write. **Never auto-delete ledger data.**

---

## 7. Edge cases to cover

1. **Un-skip after a gap.** ↩ on a lift whose only other session is weeks old: `deriveLastMeta` must fall to the correct prior real session; counters re-derive from the amended log; the queue must not double-earn.
2. **Skip-out the last remaining entry.** Already refused visibly (L11205 alert) — keep that refusal.
3. **0-RIR openers / `holdFlag` (repro B).** Re-derive, do **not** remove. Amending an opener to RIR≥1 must release the hold; amending back to 0,0 must re-arm it.
4. **Round-trip ✕ then ↩.** Must return `entries` to the reps the athlete re-enters, and must **not** restore an RIR that was never captured (engine-test.jsx L3652–3656 pins this — keep green).
5. **Below-window session at same load** must zero `topRun` (the C reset).
6. **New-load weight edit** sets `ex.last = null` on purpose (to re-seed targets) — `reconcileLiftCaches` must preserve that null (existing guard, L7118 "only when `ex.last` is NON-NULL").
7. **Pure-TRAIN finish, no gym draft** (§3b tail) — an untouched, un-toggled lift must not bank at target.
8. **Two devices correcting the same lift** — the exercise-merge hole (§5). Self-heal via derive-on-load covers eventual consistency; document that simultaneous same-lift corrections still resolve by newest `lastMeta.d` (known limitation, mirror of the session-merge one at L8130).

---

## 8. Acceptance criteria (gate assertions + render QA)

Add assertions to **`tools/engine-test.jsx`** and raise `MIN_ASSERTIONS` in `scripts/test.mjs` (currently **1300**, L26) by the number added. Gate must be green (`npm run check`, `--strict`) before any commit. Ship from a **branch**; never `main`.

**Skip-control / phantom (Fix 1):**
- A lift **reached in the gym but never touched** (no set, no RIR, reps at default), when the session is finished via the **TRAIN** path (`complete` / `mergeSessionDrafts`), lands in `skipped[]` and emits **no entry** — parity with `gymEntries`. (New assertion; complements L3597–3603 which currently assert the *wrong* behaviour and must be updated.)
- `mergeSessionDrafts` and `gymEntries` **cannot disagree** on the partition for the same draft (assert equality of `{entries,skipped}` id-sets across both, for touched/untouched/skip-flagged fixtures).
- Pure-TRAIN finish with an untouched un-toggled lift → that lift is `skipped`, not banked at target.
- Invariant restated as a gate: **no finish path emits an entry for an untouched lift.**

**Propagation / caches (Fix 2):**
- After ✕ removes a top-of-window phantom, `ex.topRun`/`ex.topAt` re-derive from the log (phantom's sighting gone). Direct analog of the C fixture; extend the existing `deriveLastMeta` block (engine-test.jsx L3607–3656).
- After ↩ un-skip (repro A fixture), **feed, session log, lift card (`lastMeta`/`last`), and the derived target all read the amended date** — assert all four agree.
- `reconcileLiftCaches` (extended) recomputes `topRun`/`topAt`/`holdFlag`/`rirHist` from a hand-built log and **leaves a `null` `ex.last` null** (weight-edit guard).
- Amending an opener flips `holdFlag` correctly in both directions (re-derive, not remove).
- A **not-done queue debut earned off a removed session is marked terminal (`done:true`,`state:"WITHDRAWN"`)**, and a `_unionKeyed` merge with a stale device still holding the not-done copy keeps it **withdrawn** (assert via `mergeState` that the terminal copy wins — mirrors the `_queueRank` tests).
- `_stampCorr` still present on every amended record after the new logic (refuse-to-shrink preserved); a `mergeState` round-trip does not revert the correction.

**Render QA (layer 2 smoke — every tab, three states, no `undefined`/`NaN`/empty):**
- SESSION LOGGED card renders after ✕ and after ↩ without error.
- TRAIN lift card for the amended lift shows the amended `lastMeta`, not the pre-amend one.
- Queue surface no longer shows the withdrawn debut as live.

**The three repro cases resolve:**
- **A** — leg-extension un-skip reads identically across feed / session log / lift card / queue; the 10-day gate becomes measurable.
- **B** — `holdFlag` still holds (unchanged), and releases only on an honest opener; not "fixed" away.
- **C** — ham `topRun` reconciles to the log; no `125` queues off a half-real baseline.

**Suggested final verification step:** run `npm run check` (strict gate + render + committed-`app.js` DOM smoke), then diff-read the two amend handlers and `mergeSessionDrafts`/`gymEntries` to confirm exactly one skip-inference remains and grep-count each cache write to confirm no rogue duplicate landed (CLAUDE.md string-surgery rule).

---

## 9. Quick file:line index (origin/main v7.11.1, `src/app.jsx`)

- `completeSession` L1290; cache writes: `lastMeta` 1306, `last` 1321/1335/1357/1370/1385, `topAt/topRun` 1398–1399/1405/1416, `holdFlag/rirHist` 1310–1314; queue pushes 1338/1362/1378/1408.
- `atTopOfWindow` L1092 · `deriveLastMeta` L1173 · `progressStep` L801 · `targetsFor` L855 · `liftCall` L590.
- TRAIN `complete()` L11150; `getReps` L11151; ✕ skip-out L11205; ↩ un-skip L11225.
- `mergeSessionDrafts` L12645 (index heuristic L12680; early-return L12655) · `gymEntries` L12720 (`skipOf`/TOUCHED L12733) · `GymMode.finish` call L12843 · `getR` L12724/12788.
- `reconcileLiftCaches` L7116 (called `migrate` L7132/7135).
- Data-safety: `recordCounts` L8074 · `dataLossGuard` L8091 · CORRECTION_MERGE `_stampCorr`/`_corrOf`/`_richerSession` L8143–8175 · `_unionKeyed`/`_exDate`/`_queueRank` ~L8215–8240 · `mergeState` L8352.
- Tests: `tools/engine-test.jsx` (gymEntries/deriveLastMeta/TOUCHED L3588–3665; `topRun` sighting L2449; holdFlag L439/2204/2300) · `scripts/test.mjs` `MIN_ASSERTIONS` L26.
