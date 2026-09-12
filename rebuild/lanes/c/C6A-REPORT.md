# C6 PART A - VOICE ONBOARDING, TEXT REHEARSAL (BUILDER REPORT)

Lane C, branch `rebuild/lane-c-c6`. Annex, with the file table and the executed commands: `C6A-ANNEX.md`.

**REBASE ONTO :149.** Built on `origin/rebuild/lane-c-a4b` @ `8e558ce`, because Part A's parity needs A4b's
catalogue, its `{profile, setup, tags}` payload and `createSetupHost`. A4b has since merged (ledger
`:149`), so the commits are replayed cleanly onto `origin/rebuild/t2-client-core` @ `964f183`, which
carries A4b and the B-NTC merge (`:144`). The brief's open question 7.2 is closed by that merge.

**THE PARITY RE-CHECK, and one real correction.** A4b merged in a different final form from the one this
was built against: tags handling moved off `today-bindings.mjs` into the producer
(`today/setup-commands.mjs`, `envelopeOf`) and `today/setup-host.mjs`, and `setup-app.mjs:524` now calls
`onDone({ setup, tags })` - ONE argument, an envelope - forwarded verbatim to `host.save()` by
`today-entry.mjs:141`. **This driver was on the old two-argument `save(setup, tags)`, on both sides, and
that is now fixed** in `onboarding-tools.cjs` submit and in the A2 tap path. It mattered although nothing
failed: `envelopeOf` accepts both spellings, so the old call still produced identical bytes, and with
submit reverted **30 of 31 parity tests still passed** - every byte and durable check - only the new
argument-shape test failing. The argument list is now pinned too: one argument, keys `["setup","tags"]`.

**Custody held.** The diff against the tip is `rebuild/coach/**` plus `rebuild/lanes/c/{C6A-*,WAVE1-*}`:
`rebuild/m3` (`today-bindings.mjs`, which the B-NTC gate pins on disk, included), `rebuild/engine`,
`rebuild/client`, `rebuild/m4`, `rebuild/conform` and `.github` are byte-untouched.

## Counts (A14)

| suite | base | now |
|---|---|---|
| coach `rebuild/coach/test/*.test.cjs` | 65 | **201**, 0 fail; the split is 65 C5 + 85 C6A + 51 wave one |
| the three new files: tools / parity / closed-list | - | **41 / 31 / 13** (floors 30 / 18 / 10) |
| setup 157 · catalogue 43 · gym 64 · checkin 28 · copy 36 · view 23 · adapter 20 · design 11 | same | **unmoved**, 0 fail |
| B-NTC gate alone (clean tree either side) · `native-carriers-package.cjs --ci` · `build.mjs` | PASS | **PASS** |

## The parity evidence, as counts

| claim | measured |
|---|---|
| A1 op bytes equal, `JSON.stringify(opVoice.payload) === JSON.stringify(opTap.payload)` | **6 / 6** |
| A1 whole envelope equal (a reordered `effective` caught too) and the read-back document equal | **6 / 6** |
| A7 blocked fixtures: both paths refuse and name the SAME gaps | **2 / 2** |
| A2 durable: two `createSetupHost` installations, stored bytes equal as ONE stringify | **6 / 6** |
| A12 one op per complete transcript, zero per blocked or abandoned one | **8 / 8** |
| A1 producer identity (`prepare` called once per submit, counting spy) and the SCREEN's one-argument call | **6 / 6**, **1 / 1** |
| mutants C1 to C10 | **12 / 13 with the faithful C1 killed after the fix**, files restored byte-identical |

Review round 1, all four applied. **C1** the reviewer's faithful mutant C1 SURVIVED - byte equality proved
the bytes, not the producer - so a counting spy on `commands.prepare` makes producer identity observable;
re-run with that mutant in place, **fail 6**, killed. **C2** the `COMPLETE.slice(0, 2)` is dropped, all six
fixtures write durably. **C3** A2 equality is ONE stringify. **C4** the figures above. The annex's table is
refreshed here (WAVE1 C2). Fixtures are 8 on a floor of 6; the two blocked ones prove A7. Part A only ADDS.

## Residuals

1. **The branch name.** `rebuild/lane-c-c6` is checked out in `work/lane-c/dad`, so this builds on
   `rebuild/lane-c-c6-build`, pushed to `refs/heads/rebuild/lane-c-c6`.
2. **"An override" is the STANDARD STEP, not a day kind:** `inc_override` overrides the standard 5 lb step,
   which a tool may do; a spoken day-kind change is refused by `cannot_set_via_coach`, and tested.
3. **`setupOnLocalEra: false`** - `setup-host.mjs` opens its own installation, as `checkin-host.mjs` does.
4. **CI now RUNS these suites, and the earlier residual saying it does not is withdrawn.** The B-NTC merge
   carried `DECISIONS:117 (4)`'s step into `rebuild.yml` (`C5`, `node --test "rebuild/coach/test/*.test.cjs"`).
   Its comment still reads "64 tests" from seal time; the count is now 201 and the step is a glob, so it
   needs no edit - which is as well, since `rebuild.yml` is outside lane C's custody.
5. **No model, no network, no key, no audio**, asserted by source scan over both new modules (A11).
