# P3-ADMIT-DECISION-BRIEF

DECISIONS:472. Lane D, author Opus high, docs only. Branch `rebuild/d-p3-admit-brief` off `origin/rebuild/c-p3-import-ui` af4c20af (tip 60cb6187 plus the
P3-IMPORT-UI evidence). **No product byte changes here.** The Fable FINAL (P3-IMPORT-UI-REVIEW-R3.md) is taken as fact and its constraints are cited as (i) to
(v). Every figure is my own run on this sha, TZ America/New_York, from a scratch harness under `rebuild/.p3-trial/` and `.tmp/p3-route-trial/`, both deleted
before this commit. Every row uses the SAME one line scratch entry, so the deltas are like for like; for scale, the shipped A1 asset at this sha is 1 660 910
bytes over 121 pinned inputs.

```
A  baseline (today-entry only)                          122 modules  1 660 762 B  law PASS
B  + m3/w6/local/import-bundle.mjs                      122 modules  1 660 783 B  law PASS
C  + m3/w6/local/browser-entry.mjs                      123 modules  1 660 907 B  law PASS
D  + source-admission.mjs unchanged (sweep stubbed)     159 modules  2 137 809 B  law REFUSE
E  ROUTE 1: engine-runtime swapped for the accepted
   host mirror, admission on Today                      133 modules  1 881 035 B  law REFUSE
F  ROUTE 2: the Import document alone                    82 modules  1 215 433 B  its own law
A5 site today: 13 files, 11 precached, 13 header rules, cache earned-slice-9fae5d08f01c2584b2e175324855b894
```

B closes Fable (iii): naming `import-bundle.mjs` costs **0 modules and 21 bytes**, because it is already an input of the shipped `app.js` through
`local-client.mjs` (confirmed in the baseline inventory); `browser-entry.mjs` is +1 module, +145 bytes. Custody is not a cost of any route below.

## 1. The blockers restated

**The page-bundle wall.** `m3/w6/local/source-admission.mjs:16-19` statically imports `m4/workout/engine-runtime.cjs`, `m4/import/local-source-profile.cjs`,
`m4/import/local-source-order.cjs` and `m4/import/browser-replay.mjs`. The first is FORBIDDEN by name at `m3/w7-preview/today/build.mjs:61` and the import lane
at `:52`, with A2's reason at `build.mjs:55-60`: `engine-runtime.cjs` composes twelve factories through ONE computed require, which esbuild answers by globbing
all of `rebuild/engine`, sweeping in `engine/test/**` and through it `rebuild/conform`. Row D is that wall with the sweep stubbed: 159 modules, +477 047 bytes,
and `assertBundleInputs` (`build.mjs:297`) still refuses. Row E is the finding that moves the ruling: swap that ONE import for the already accepted, already
S5-pinned mirror `m3/w6/host/engine-runtime-host.cjs` and the sweep, `engine/seed.cjs` and `engine/index.cjs` all leave the graph, with no stub plugin at all.
What remains is 133 modules and exactly **two** forbidden engine names, `engine/migrate.cjs` (184 433 B) and `engine/merge.cjs` (85 402 B), plus the
`m4/import/*` name ban over six files (`local-source-profile`, `local-source-order`, `daily-history`, `replay-core`, `engine-provider`, `browser-replay`).
`engine-provider.cjs:3` requires migrate and merge by literal path, to reproduce on the phone the walk port.cjs already did on the PC
(`SOURCE_PREPARATION_REPRODUCTION_MISMATCH`). The wall is not 38 modules wide; it is two engine files and one name ban.

**No production producer mapping.** `reviewSource` calls `producerRegistry.qualify({context, materialDigest})` (`source-admission.mjs:70`) and
`m4/import/local-source-profile.cjs:66-84` refuses `SOURCE_ENGINE_CONTEXT_UNPROVEN` unless exactly one reviewed mapping matches. Every `createProducerRegistry`
caller in the tree is a harness or a review annex: `m3/w6/test/local-source-admission.test.mjs:63`, `m3/w6/test/local-source-consumer.test.mjs:169`,
`m3/w6/test/p2-consumer-browser-entry.mjs:56`, `m3/w7-preview/import/test/support.mjs:207` (`id: 'TEST-ONLY-p3-mapping'`),
`m4/import/test/engine-provider.test.cjs:24`, `m4/import/test/s3/fixtures.mjs:74,159`, plus two `lanes/astra/reviews/*` annexes. On Joe's real bundle admission
refuses at the review step whichever route ships the screen. Route-independent.

**The identity guard gap (i).** `prepareSource` refuses `LOCAL_SOURCE_IDENTITY_CONFIRMATION_REQUIRED` unless `identityConfirmed === true`
(`source-admission.mjs:168,171`). `programme()` (`:83`) compares split, exercise id/day/mg/sets/hi/inc/steps, head and secondary tags and `priority_muscles`
against the installation's own setup op, and nothing else. The bundle carries no athlete identity at all: `port.cjs:711-729` seals profile, createdAt, engine,
source bytes, migrated state, oracle, dataLoss, census, and for a merge a relatedness note whose own words are "the state carries no athlete identity". The port
README says it again about `--local`: it "cannot check whether they belong to the same person, because the state carries no name, no account and no device id".
A bundle differing only by athlete label ADMITS, and the only guard in the stack is Joe's own tap.

**Custody commits before review (ii).** `reviewSource(name)` reads its material from custody (`source-admission.mjs:66`), so `importBundle` must commit first:
`import-bundle.mjs:507-508` stages the original and sets `rebaseRequired = basis.opCount > 0`, true on Joe's phone. A refused or cancelled review leaves an
entry in `metadata.imports` with `rebaseRequired: true`; `local-client.mjs:314-318` then reports `derivedCode: IMPORT_REBASE_REQUIRED` on every boot, and
`m3/w6/import-custody.mjs:120-142` exports `stage` and `load` and no remove. `rollback(selectionId)` (`source-admission.mjs:205`) does not help: it refuses
`LOCAL_SOURCE_ROLLBACK_UNPROVEN` unless a selection already exists, which means an import that already succeeded. Only `unsealBundle` is write-free.

## 2. ROUTE 1: the page-safe mirror under m3/w6/host

**Modules to mirror: exactly one, and it already exists.** `engine-runtime-host.cjs` is the accepted A2 mirror of `engine-runtime.cjs`, is S5-pinned, exposes
`sessionMembership` (the only Runtime name `source-admission.mjs` uses, in `resolveCapturedLayout`), and `m3/w6/host/test/engine-equivalence.test.cjs` already
fails on drift between the two. The change is one import line at `source-admission.mjs:16`, a file pinned by no package. The six `m4/import` modules need no
mirror: row E measures them entering a browser graph cleanly once the computed require is gone.

**FORBIDDEN entries that still ship, and why.** `engine/migrate.cjs` and `engine/merge.cjs`, because `engine-provider.cjs:3` requires them to REPRODUCE the PC
walk and refuse a bundle whose migrated state does not reproduce; plus the `m4/import/*` name ban over the six files. `engine/seed.cjs`, `engine/index.cjs` and
every `engine/test/**` harness do NOT ship (measured, row E).

**Guards to re-reason in build.mjs.** Three names come off FORBIDDEN at `build.mjs:45,46,52`. The recorded reason for migrate and merge is not in build.mjs; it
is `engine-runtime-host.cjs:13-16`, "which carry, or reach, one athlete's personal history and must never enter the phone bundle". Row E disproves the "reach"
half for these two under literal requires: seed and index do not follow them. The "carry" half is what the ticket must answer with a cell, not a paragraph: both
are frozen factory closures taking state as an argument, so a bar is a red-first cell proving neither carries an athlete literal. `today/build.mjs` is itself
pinned by no package, so striking the names costs no reseal; it costs the reasoning and a reviewer who agrees with it.

**Sealed bytes touched (S5 product map, by name).** `m3/w7-preview/today/today-app.cjs` and `today-entry.mjs`, for the route and its two entry points. Nothing
else: `today/build.mjs`, `m3/w6/local/source-admission.mjs`, `m3/w6/local/import-bundle.mjs`, `m3/w6/import-custody.mjs`, `m4/import/**` and `rebuild/slice/**`
appear nowhere in `lanes/b/tooling/packages/S5.json`. `engine/migrate.cjs` and `engine/merge.cjs` ARE S5-pinned, but are bundled, not edited.

**Bundle bytes.** 122 to 133 modules, 1 660 762 to 1 881 035 bytes: **+11 modules, +220 273 bytes, +13.3%** on the one page, against +477 047 for the unmirrored
graph.

**Risk to the frozen-behaviour laws.** The mirror is a binding, not a reimplementation, and its equivalence test is S5-pinned. The real risk is that two frozen
engine files now execute in a browser realm on the athlete's device. The P2 witness already ran that graph in a browser, and the S3 native-Date capability
(`local-source-profile.cjs:44-65`, `engine-provider.cjs:19-37`) exists precisely so `merge.cjs`'s date seam is proved rather than assumed; a Route 1 ticket
inherits that evidence rather than reopening it.

**What Joe taps.** Today, Measure, "No baseline yet" to Import; pick the file; type six words (Unlock, write-free); **the identity question, before anything is
written**; then the review screen and Confirm.

**How (ii) is handled.** By ordering, and it is free. `unsealBundle` writes nothing, so the identity question and a cancel both land BEFORE `importBundle`.
Residue then exists only for a bundle Joe has already said is his and that the machinery then refuses (`LOCAL_SOURCE_PROGRAMME_UNRESOLVED`), which is exactly
where a durable named record is defensible. For that case one size S ticket adds a reviewed `retractImport(name)` to `import-bundle.mjs` and a paired remove to
`import-custody.mjs` (neither pinned), so the boot flag clears honestly instead of through `markImportRebased`, a false acknowledgement.

## 3. ROUTE 2: a second same-origin Import document under rebuild/slice/pwa

**Files.** A new entry (`m3/w7-preview/import/import-entry.mjs` plus app and model), its own `import-build.mjs` declaring its OWN input law, and in
`rebuild/slice/pwa`: `build-pwa.mjs:77-127` (a second read/names/files set), `shell.cjs:49,76,127` (`headerRules`, `assertHeaderRules`, `installableHtml` for a
second document) and `sw-source.js:26,88`, where `const SHELL = "index.html"` and every navigation is network-first falling back to that one shell, so offline
`/import.html` would render Today. That last one is a correctness change, not a config line.

**How the law is declared and pinned.** The second law is `assertBundleInputs` with its own FORBIDDEN and REQUIRED lists: migrate, merge and `m4/import/*` are
ALLOWED there; `seed.cjs`, `index.cjs`, `engine/test/**`, `authority/*`, `ledger/*` and `src/history.js` stay refused. Today's law is untouched, which is the
point of the route. It is pinned as Today's is: its own build asserts it, and the package that seals the new files pins it.

**A5 manifest.** Measured today: 13 files, 11 precached, 13 header rules, cache `earned-slice-9fae5d08f01c2584b2e175324855b894`. The precache is derived
(`build-pwa.mjs:111`, every file key sorted and hashed), so two more files make it 15 files, 13 precached, 15 header rules and a NEW cache name: one extra full
re-download for every installed athlete on that deploy.

**Links from Today.** Same as Route 1 and the same cost: `today-app.cjs:594` `renderMeasure` finds `[data-slot="measure-baseline-note"]` (published by the
S5-pinned `measure/measure-view.mjs:183`) after each paint, plus the setup end. This route also edits the sealed `today-app.cjs`; it does not avoid S6. P2's
consumer adopts unchanged and free: same origin, same IndexedDB, and `today-app.cjs:2200` already calls `admittedLocalSourceState(setup)` from
`local-source-basis.mjs` at boot, so Joe closes Import, opens Today, and the baseline is there.

**Bundle bytes.** The Import document is 82 modules and 1 215 433 bytes on its own; Today stays at 1 660 762. Two documents, 2 876 468 bytes served and
precached, against 1 881 035 for Route 1: **+995 433 bytes of duplicated client, engine and crypto**, since the documents share no bytes.

**What Joe taps, and what the single-page story loses.** The same taps, with one page load between "No baseline yet" and the file picker and one back to Today
at the end. The app stops being one document: every future screen must answer which document it belongs to, the service worker has two shells, an offline
install has two things to keep warm, and the "no new navigation shell" line of the P3-IMPORT-UI ticket is spent. **(ii)** is handled exactly as in Route 1, by
ordering; the route buys nothing there.

## 4. ROUTE 3: admission on the PC

**What port.cjs would additionally need.** Two things it cannot get. First the installation identity: the controller validates `metadata.namespace ===
namespace`, `lease.athlete_id === athleteId` and `lease.device_id === deviceId` (`source-admission.mjs:43`), and those live only inside the phone's encrypted
repository under the local era. Second, and worse, the phone's CURRENT operations: `order.review({... operations: currentOps ...})` (`:77`) and all of
`replay()` run against `held.generation.collections.ops`, and `programme()` resolves the installation's own setup op out of them. Admission is a statement about
the phone's present state, not about the file. **How they would leave the phone, honestly: they would not.** `browser-entry.mjs` exports `importOriginal` (the
bundle's own bytes back out) and nothing else that emits a generation; there is no page-safe export of the installation's ops or era anywhere in the surface.
**Without one this route is not viable.** Building one means exporting the athlete's operations in the clear onto a PC, a larger and more dangerous piece of
work than the wall this brief exists to get round, and it would need its own owner ruling.

**The identity question as an owner line, and the phone screen.** Joe answering in the PM chat is a real answer and would be recorded as :469 was. It is also
answered about a file he has not opened, on a machine he is not holding, by a PM reading verdict lines; Fable (i) requires that be said plainly, so: this design
answers the identity question for him, off the device that holds the identity. The phone screen is then custody only (pick, six words, Unlock, "kept"), measured
at 0 modules and 21 bytes (row B), so the page cost really is near zero. But custody without admission writes an import entry, shows Joe nothing and sets
`IMPORT_REBASE_REQUIRED` on every boot, which is worse than no door. **Privacy consequence, plainly:** this route moves the one identity question in the system
off the only device that holds the identity, and to pay for it wants the athlete's operations exported to a PC. Both halves point the wrong way.

## 5. The execution calendar and the production producer mapping

`qualify()` (`local-source-profile.cjs:68-84`) checks, so a production mapping must pin: `profile: 'earned/source-producer-mapping/v1'`; `construction:
'oracle-shim-default/v1'`; `public_factory_digest` equal to `PUBLIC_FACTORY_DIGEST` (`65be42aa...`); `source_pins` byte-equal to the frozen `SOURCE_PINS` map
(`:5-18`: port.cjs, unseal.cjs, oracle-shim.cjs, engine/index.cjs, merge.cjs, today.cjs, m4/workout/engine-runtime.cjs, tools/_fixed-now.mjs); `engine.schemaV
=== 60`, `engine.path === 'rebuild/engine/oracle-shim.cjs'` and `engine.sha256` equal to that pin; `gate.clock === '2026-09-03'`, `gate.tz ===
'America/New_York'`; a non-empty mapping id; and one execution row with an id, a `material_digest`, and a calendar of profile
`earned/native-date-compatibility/v1` carrying a compatibility id, the zone, a from/to range and a dated list whose every entry's noon ISO and offset are
re-derived and checked (`:81`), plus the reviewed native-Date parse and constructor vectors (`:44-65`). So: the engine is pinned by BYTE, not by the S5 receipt
id, through `SOURCE_PINS` and the oracle-shim sha; producer and execution ids are free labels; the reproduction walk's inputs enter as `material_digest`.

**The scheduling fact.** `qualify` matches `m.executions.some(e => e.material_digest === materialDigest)`, and `materialDigest` is `digest(hash,
'earned/local-source-material/v1', raw)` over the four custody strings of the ACTUAL bundle (`source-admission.mjs:70`). **The execution row cannot be authored
before Joe's bundle exists.** So the mapping splits: the skeleton (profile, construction, factory digest, source pins, engine, gate, calendar range, dated list,
native-date vectors) is route-independent and can be authored, reviewed and sealed NOW; the execution row is one short reviewed addition made the day port.cjs
writes the file, from that bundle's own digest.

**Who authors it, and how it is sealed.** Lane D, by precedent: `lanes/d/S3-R3-CONTEXT-CAPABILITY-PROPOSAL.md` point 22 is D updating "the actual
public-factory/context mapping identity" and the byte-bound pins, and `lanes/pm/GATE-AUDIT-SPEC-P2.md` finding 2 is the open MEDIUM that a cell must assert the
mapping is re-qualified, or refused, after a pinned engine byte changes; that cell belongs to this ticket. It is data, not behaviour, but it decides whether a
bundle admits, so it takes its own small package (S6-PRODUCER-MAPPING) or a child of S6, an independent Opus review and a Fable final per :439. It does **not**
depend on the route: the same mapping qualifies the same controller from Today, from a second document, or never. It can be authored now, and it is blocker two.

## 6. The identity guard

The machinery carries exactly ONE question string, `prefix_question` at `source-admission.mjs:80`, verbatim: "Did every workout in this file happen before this
first Earned workout, with none already recorded in Earned?" Per (iv) it is never exercised today: `prefix_required` is `legacy.length > 0 && native.length >
0`, false in every cell, and `m4/import/local-source-order.cjs:27` refuses any answer but `true` with `ORDER_EVIDENCE_REQUIRED`, so "No" is a stop and not a
branch. The screen must still carry it word for word for the day it fires, and must present "No" as a stop.

**The identity guard itself carries no text at all.** `identityConfirmed` is a boolean, so the screen AUTHORS the one sentence that is the entire identity check
in this system. It must never default to yes, never be a pre-ticked box, and never be satisfied by a "Continue". Proposed copy for the ticket to review, no dash
anywhere: "Is this your history? This file came from your own PC. Earned cannot tell whose history is inside it, so this is your word, not a check." Buttons:
"Yes, this is mine" / "Stop".

**A second confirmation is warranted and cheap.** The bundle carries `createdAt` and `source.sha256` (`port.cjs:711-713`), both already in the custody entry
(`import-bundle.mjs` `importEntryFor`), so the screen can show the real date: "Made on your PC on <date>. Is that the file you were sent?" Two facts he can
check against the message he received, at no cost in machinery. **A PC-side identity stamp belongs in a later port version**, and it should be Joe's own string,
not a derived one: `port.cjs --installation <label>` he types, sealed into the payload, compared with the label he types on the phone. That makes two
independent confirmations and still claims no proof of identity, which is the honest ceiling, because the ledger has no name in it. Not a blocker for this port,
and it must not delay it.

## 7. Comparison

Working days use the measured cycle: S4 (:438 r1+r2, :440 r3, :447 r4, :448 ACCEPTED, :449 postfix, :450 MERGED) and S5 (:459 r1, :465 FULL and final review,
:466 postfix, :467 MERGED) each ran author to merge inside ONE working day, 2026-09-16, at 4 and 2 review rounds. The serialising risk is the single PC and a
REJECT at final review, costed at 2 to 4 days by GATE-AUDIT-SPEC-P2 answer 6.

| | ROUTE 1 page-safe mirror | ROUTE 2 second document | ROUTE 3 admit on the PC |
|---|---|---|---|
| Working days (author + review + reseal) | 1 + 1 + 1 = **3** | 1.5 + 1 + 1 = **3.5** | not viable; 4+ and a new export ticket first |
| Sealed bytes (S5, by name) | today-app.cjs, today-entry.mjs | today-app.cjs, today-entry.mjs | today-app.cjs, today-entry.mjs |
| Guards re-reasoned | 3 names off build.mjs FORBIDDEN: engine/migrate.cjs, engine/merge.cjs, m4/import/* | none of Today's; one NEW law authored for the second document | none in the page; the port README "only when you ask" rule and the no-export rule |
| Bundle delta | +11 modules, **+220 273 B** (+13.3%) on one page | Import doc 82 modules 1 215 433 B; two documents 2 876 468 B, **+995 433 B** duplicated | +0 modules, +21 B (custody only) |
| A5 manifest | same file set, new hashes | 13 to 15 files, 11 to 13 precached, 13 to 15 header rules, new cache, sw shell routing | unchanged |
| Privacy | everything stays on the phone | everything stays on the phone | moves the identity question off the device; wants the athlete's ops on a PC |
| Handles (ii) how | identity question before importBundle (unseal is write-free) plus a size S retract ticket for the refused case | identical | identical, but the phone never reviews, so every bundle leaves residue |
| Owner decision needed | no | no | **yes** |

Route 3's owner question, in plain words, if the PM ever takes it: "Do you want the app to take your word once, here in this chat, that the file is yours,
instead of asking you on your phone when you open it, and do you want a copy of your phone's records put on the PC so the PC can do the checking?"

## 8. Recommendation

**ROUTE 1 in its minimal form, with the producer mapping started today.**

Reasoning. The wall was reported at 38 modules and it is not: row E puts it at eleven, and the difference is one import line swapped for a mirror the project
already accepted, already pinned and already proved equivalent. Route 1 keeps the single page, adds 13.3% to one asset, touches the two sealed files S6 was
going to carry anyway, and asks the reviewer for exactly one judgement: whether `migrate.cjs` and `merge.cjs` may run on the phone inside a proved native-Date
capability. That is a narrower question than Route 2's (design and prove a second document, a second law, a second shell and a service worker that can tell them
apart) for +995 433 bytes and no better answer. Route 3 is not viable: there is no page-safe export of the installation's ops, and inventing one points the
wrong way on the one axis this project does not trade. The blocker that sets the date is the producer mapping, not the wall: it is route-independent and
authorable now, and if it is not started the screen lands and refuses `SOURCE_ENGINE_CONTEXT_UNPROVEN` on Joe's real bundle.

Tickets to dispatch next:

1. **P3-PRODUCER-MAPPING** (lane D, author Opus high, reviewer Opus high, Fable FINAL per :439, size S). The reviewed mapping SKELETON and its cells, plus the
   GATE-AUDIT finding 2 re-qualification cell. Bars: qualifies a synthetic bundle; refuses on a mutated pinned engine byte; refuses a calendar that makes no
   native-Date claim; the execution row documented as the one field added on port day. Route-independent, start now.
2. **P3-IMPORT-UI-2** (lane C author Opus high, lane D co-author for the law, reviewer Opus high, Fable FINAL, size M). Route 1: the import swap at
   `source-admission.mjs:16`; three names off `build.mjs` FORBIDDEN with the reasoning written into the file; the red-first cell that migrate and merge carry no
   athlete literal; the Import route on Today; the identity question BEFORE `importBundle`; the order question verbatim from `:80`; refusals verbatim; and
   `page-bundle.test.mjs` rewritten by whoever brings the wall down, as it was designed to demand. Bars: a label-only bundle is ADMITTED and the screen says so
   in Joe's own words; `identityConfirmed:false` refuses; a cancel at the identity step leaves the durable record byte-identical; one real Edge run on a real
   EDT day.
3. **P3-IMPORT-RETRACT** (lane D, Opus high, size S). `retractImport(name)` in `import-bundle.mjs` and the paired remove in `import-custody.mjs`, so a refused
   bundle stops claiming `IMPORT_REBASE_REQUIRED` at every boot. Not on the critical path; needed before a second bundle ever exists.
4. **S6** carries ticket 2 and the `today-app.cjs` bytes, as :470 already ruled.

## 9. What can ship before the ruling, with no regret

1. **P3-PRODUCER-MAPPING skeleton and cells.** Needed by every route, blocked by none.
2. **The runbook corrections Fable named** (the identity sentence made true, the pre-check 6 caveat) and the three refusal cells (label-only admits,
   `identityConfirmed:false`, the `:80` question pinned).
3. **The identity screen copy**, written and reviewed as copy, dash-free, ready for whichever route lands.
4. **P3-IMPORT-RETRACT.** Touches no sealed byte and no route decision.
5. **Telling Joe** what :470 established: the port waits on a screen, his ledger is untouched, and nobody will hand him a file he cannot open. Report section 9
   item 2 is still open and is the only item here with a person waiting on it.
