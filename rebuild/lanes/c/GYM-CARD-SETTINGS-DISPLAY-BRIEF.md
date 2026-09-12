# GYM CARD: MACHINE SETTINGS ON THE ACTIVE SET (display and capture)

Tier **screens** (`DECISIONS:88`): ONE independent reviewer, cross-model (`:159 (2)`), told to disagree, plus
CI green both OS. No engine byte. Authority `DECISIONS:154 (2)` (the fact class is approved; the gym-card
DISPLAY half queues after report-a-problem, **now after N1** per the PM's re-order) and `:140` (wave one:
settings "captured by voice or on the gym card, recalled by the coach, shown on the active set").

Base `8a4250953ebfe13fb28983ffd6e0da5049002377`. Builds under one-Today-build-at-a-time (`:116 (5)`), after
N1. EFFORT (`:119 (5)`): **builder MEDIUM**, **reviewer HIGH**, **integrator LOW**. This brief HIGH.

Every number and vocabulary carries a `file:line` source or is marked **INVENTED** (`:115`).

## 0. READ-LIST

`DECISIONS.md` 154 (2) (5), 140, 159 (2), 116 (5), 114 (1) · `rebuild/coach/machine-settings-commands.cjs`
(the producer and the whole shape) and `rebuild/coach/BRIEF-COACH-WAVE1-TEXT.md` section 3 ·
`rebuild/m3/w7-preview/today/gym-app.mjs` (`:9` and `:14` are its only page imports), `gym-model.mjs`
(`:87` `createGymModel`), `today-app.cjs`, `plain-copy.cjs`, `design.cjs`, `build.mjs` ·
`rebuild/m3/w7-preview/today/setup-host.mjs` (the pattern a new lane copies) and
`rebuild/m3/w6/local/local-client.mjs:395` (`client.hostBindings({ workoutCommands })`) ·
**`rebuild/m3/w6/test/local-today-journey.test.mjs:605-620`** (which files are pinned, section 1).

## 1. CUSTODY, read out of the pin list rather than assumed

`local-today-journey.test.mjs:614-619` `PAGE_PINS` names **exactly four** sha-pinned files:
`today-entry.mjs`, `gym-host.mjs`, `reading-host.mjs`, `checkin-host.mjs`. The comment above it (`:605-607`)
says the rest - `design.cjs`, `gym-app.mjs`, `gym-model.mjs`, `today-app.cjs`, `today-model.cjs` - are
**DRIVEN** by that suite, so drift in them turns it red on its own. So:

- **MAY be edited** under the `:135 (1)` standing licence: `gym-app.mjs`, `gym-model.mjs`, `today-app.cjs`,
  `screens.template.html`, `design.cjs`, `build.mjs`.
- **MUST NOT be edited**: `today-entry.mjs`, `gym-host.mjs`, `reading-host.mjs`, `checkin-host.mjs` and
  `rebuild/m3/w6/local/today-bindings.mjs` (pinned on disk by B-NTC, `DECISIONS:144`; the `:154 (5)` standing
  rule moves these to git-blob pins only AFTER H3 seals, so until then this brief works around the disk pin
  exactly as A4b did).
- **ADDS**: `today/machine-settings-host.mjs` (the durable lane), `today/machine-settings-view.mjs` (the
  active-set block and the capture affordance), `today/test/machine-settings-ui.test.mjs`,
  `today/machine-settings-check.mjs`.
- **OUT**: `rebuild/engine/**`, `rebuild/client/**`, `rebuild/m4/**`, `.github/**`, `rebuild/coach/**`
  except as a read-only import (section 2).

**Because `today-entry.mjs` is pinned, the lane cannot be threaded through `boot()`.**
`machine-settings-host.mjs` opens this device's installation ITSELF through
`client.hostBindings({ workoutCommands })`, the way `setup-host.mjs` does, and `gym-app.mjs` (unpinned) opens
it. That is the whole reason the new host is a new file rather than a parameter.

## 2. ONE WRITE PATH, NO SECOND SHAPE

The op is **`earned/machine-settings/v1`** exactly as `rebuild/coach/machine-settings-commands.cjs` defines
it: class `fact`, kind and payload `{ profile, machine }`, `machine = { exercise_id, settings?, cues? }`,
at least one of `settings`/`cues`, one op per change, **latest wins by exercise id**. The gym card
**imports that same producer** and adds it to `build.mjs`'s `REQUIRED_INPUTS` (a new pinned input); it does
**not** re-declare the shape. A second validator, a second profile or a "gym-card flavour" of the payload is
the defect this section exists to prevent, and mutant S6 is exactly that.

Read side: a small reader in `machine-settings-host.mjs` returns the LATEST op for an exercise id from the
same generation, as the coach's read tool does. **Nothing is interpreted**: the athlete's words are shown
back verbatim, in the order given.

## 3. THE SCREEN

**Display, on the active set.** Under the prescription and above the performed inputs, a block headed with
the approved vocabulary showing the latest stored settings for THIS exercise id, as `name value` pairs in
the order given, and the cue below them if one is stored.

- **Honest empty state**: `No settings saved yet.` (dash-free, through `plain-copy.cjs`). Never a zero,
  never a borrowed setting from another lift, never a guess.
- **No number is invented**: every digit on the block is one the athlete typed or said. The block is
  exempt from nothing: the existing "no figure the layer did not supply" gym cell covers it.

**Capture, from the gym card.** A small affordance on the active set (`Machine settings`, exact copy pinned
by the reviewer from `design.cjs`'s harvest) opens an inline editor: rows of `name` and `value` text inputs
(add and remove a row), plus one cue field. Saving writes ONE op through the producer of section 2. It is
never required to log a set, it never blocks the primary action, and cancelling writes nothing.

Both halves are `>= 44px` targets with `>= 16px` inputs, render at 390x844 and 320px without horizontal
scroll, and the active set keeps exactly one primary action.

## 4. ACCEPTANCE BAR

`test/machine-settings-ui.test.mjs` **>= 28 subtests**; `machine-settings-check.mjs` drives it on msedge with
a real `taskkill`. Every cell RED first.

| id | check |
|---|---|
| S1 | With nothing stored, the active set shows `No settings saved yet.` and no figure at all |
| S2 | With settings stored for this exercise id, they render verbatim and in the stored order, with the cue below |
| S3 | Settings stored for ANOTHER exercise id never appear on this one; two lifts in one session show their own or nothing |
| S4 | Latest wins: three captures for one lift leave three ops and the block shows the third |
| S5 | Capture writes ONE op through `rebuild/coach/machine-settings-commands.cjs` and its outbox entry in one transaction; a storage fault writes no part of it |
| S6 | **One shape**: the op the gym card writes is byte-identical to the op the coach's tool writes for the same answer, asserted by comparing payloads; no second profile, validator or payload shape exists anywhere in `today/**` |
| S7 | Every producer refusal is honoured in the page's own words and records nothing: neither `settings` nor `cues`, an empty name or value, over the caps, a 13th row |
| S8 | Cancelling writes nothing; capture never blocks logging a set; the primary action is unmoved |
| S9 | Durability: the block survives a reload, a new host over the same store and a real process kill |
| S10 | **Custody proved**: `today-entry.mjs`, `gym-host.mjs`, `reading-host.mjs`, `checkin-host.mjs` and `today-bindings.mjs` are sha-identical before and after, printed in the report; `PAGE_PINS` is untouched and `local-today-journey.test.mjs` stays green |
| S11 | No dashes: zero U+2013/U+2014 in new source, template and rendered DOM; the build refuses a planted one (P1's mechanism) |
| S12 | Design fidelity: every class is a selector in the approved stylesheets, every static sentence harvested, the build refusing an omission |
| S13 | 390x844 and 320px; inputs >= 16px; targets >= 44px; one primary action on the active set |
| S14 | No network; the CSP unchanged; `build.mjs` pins the new inputs and the count moves by exactly the files added |
| S15 | Zero regressions, counts executed on this base: gym **64**, today **64**, copy **36**, checkin **28**, setup **104**, ntc-h6-delta **8**, coach **64**, W6 **552**, A0 host **31**, `--ci` **PASS**, `build.mjs` **PASS** |

**Mutants**: S-M1 render a setting from another exercise id (S3) · S-M2 show `0` or a dash for an empty
block (S1) · S-M3 return the FIRST capture (S4) · S-M4 write through a new local validator (S6) · S-M5 add a
`machine-settings` profile string in `today/**` (S6) · S-M6 make capture required before logging (S8) ·
S-M7 edit `gym-host.mjs` to thread the lane (S10) · S-M8 normalise `four` to `4` on save (S7, nothing is
interpreted) · S-M9 skip the outbox entry (S5) · S-M10 an em dash in the empty state (S11).

**Reviewer**: ONE, effort HIGH, blind, cross-model, told to disagree; runs S1 to S15 itself, re-reads
`PAGE_PINS` to check the custody claim rather than trusting section 1, drives both halves in a real browser
with a verified kill, and tries S-M1 to S-M10. Verdict
`rebuild/lanes/c/GYM-CARD-SETTINGS-DISPLAY-REVIEW.md`.

**CI residual**: `test/machine-settings-ui.test.mjs` and the check are not in `rebuild.yml`'s enumerated
today step; `.github` is editable only inside a re-pinning engine package (`:112`), so they ride the next
re-seal. Say so on the ledger line.

## 5. OUT OF SCOPE

- **Voice capture of settings**: the coach's wave-one text path already has it
  (`BRIEF-COACH-WAVE1-TEXT.md` section 3); this brief adds the gym-card half of the same op.
- **H2 / `e.setup`**: the engine's own per-exercise setup member. This fact class claims none (`:117 (2)`).
- **Reading settings into any engine number**: nothing derives from them; they are shown and recalled only.
- **N1, N2 and the phone voice session**: their own briefs and their own turn in the queue.
