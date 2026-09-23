# REVIEW N3-MACROS-DATA-SPEC, round 1 (independent reviewer, Fable 5.1, 2026-09-23)

Object: rebuild/lanes/c/N3-MACROS-DATA-SPEC.md at d3b9cbf2 (blob 6b987123; worktree earned-astra-25, read only).
Read blind first: DECISIONS lines on N3 (:471 owner words, :561 (6)(7), :593, :595, :605, :609, :612), then data A
at 7f81f209 (food-commands.cjs and food-model.cjs diffs), then the spec. Static reading of public code at d3b9cbf;
one Node witness under the runtime lock. No protected file, src/, soak, private or ledger dir was read.
S = spec line at d3b9cbf. T = rebuild/m3/w7-preview/today/.

## Verdict: ACCEPT WITH NAMED DEBTS (D1 to D5 are the paper's to fix before N3-B is briefed; Q1 to Q3 stay Joe's)

## Ground claims checked against code (all confirmed)
- S37-49: T/food-commands.cjs MEMBERS ["cal","pro"]; dayOf accepts either alone, pinned by name at
  T/test/food.test.mjs:204-209 ("N1.3 - at least one of cal or pro is required"); T/today-app.cjs:110 and
  T/design.cjs:205 carry "Either figure on its own is enough."; T/design.cjs:210 "Enter calories, protein, or both."
- S72: rebuild/engine/writers.cjs:2822-2853 writeDaily names exactly cal, pro, steps, sodium, alc; spreads prev row.
- S120: measure/measure-sources.mjs:157-170 counts a food day when cal OR pro is present, never fat or carbs.
- S88: w6/local/source-admission.mjs:508 admits food-day via Food.validate and copy(p.day); :526 issues
  LOCAL_SOURCE_DAILY_UNRESOLVED. Section 8 S8 statuses: today-app :786, build.mjs :686, food-host :691,
  food.test.mjs :746/:1609, package.test.cjs :766/:1613, source-admission :521, rebuild.yml :201 SEALED as stated;
  food-commands, food-model, screens.template.html, design.cjs, food-check.mjs, today-model.cjs absent, so FREE.
- Executed witness (node.exe, base files, invented figures): refusalFor({cal:'1500',pro:''}) = null;
  refusalFor({cal:'',pro:'120'}) = null; refusalFor({cal:'1500',pro:'120',fat:'40',carbs:'150'}) = null and
  dayFromEntry gives {cal:1500,pro:120} (fat dropped, S43); refusalFor({fat:'40'}) = "NOTHING";
  dayOf({cal:1500,pro:120,fat:40}) throws FOOD_INPUT_INVALID. Every section 2 statement I tested holds.

## Findings (DISAGREE where marked)
F1 DISAGREE with S46 "OWNER/CODE MISMATCH, not a new owner question". A calories-only save is ACCEPTED today
  (witness), promised in copy (design.cjs:205, :210), pinned by a sealed cell (food.test.mjs:204-209) and counted by
  adherence (measure-sources.mjs:167). S49, S166, S227 and S312-313 order that rule reversed on the word "stay" in
  :471, which can equally mean "remain the two primary figures". DECISIONS has no line ruling the either-alone copy
  (grep "Either figure", "on its own is enough": no hit). Removing a working entry path and rewriting a pinned cell
  needs a PM ruling or a fourth plain owner question; :595 parked it as N3-B, the paper must mark it OPEN. -> D1.
F2 S168-173 and row S331 ("N3 full backup round trip") bind acceptance to a surface that does not exist: git grep for
  exportBundle, downloadBackup, backup, .download= over w6, today and m4/import product code at d3b9cbf finds no code
  hit (two markdown mentions only). S172 calls its proof "a build acceptance condition" that no N3-B builder can meet.
  Reframe as a constraint on any future exporter and drop the row, or name the carrier. -> D2.
F3 Rows' home contradicts the build order. S282 marks food.test.mjs SEALED; S311 puts every Node row there; :593
  point 2 sent the data half off the sealed path, so N3-A landed 15 rows in a new free file with no CI home (:609).
  Say it: interim rows live in T/test/food-macros.test.mjs uncounted by CI; the reseal child moves or imports them
  into food.test.mjs (workflow SEALED, S295-296). -> D3.
F4 Old reader meets new fact (review A1 at :609; absent from the spec): after N3-B a source holding one macro day
  makes an older binary's import refuse WHOLE (source-admission.mjs:508 fails Food.validate on the unknown key, :526),
  and an old-reader correction drops fat and carbs from the winning record. S146 says only "older binaries reject
  unknown keys". Record it as a version-skew fact and an owner-visible limit. -> D4.
F5 Copy census not closed. Section 7 adds 15 strings but never names the strings that RETIRE: design.cjs:205 (lead),
  :209 (correction help), :210 (NOTHING refusal) all change meaning under S49 and Q1-A. A builder cannot tell whether
  the copy inventory moves by +15 or +15/-3. -> D5.
F6 Builder ambiguities, text fixes only: S324 "import cannot enable it" names no mechanism (say: a bundle or op
  carrying a trackMacros key is ignored and the preference DB untouched); S184 "one tap" fixes no control role
  (checkbox vs button) or accessible name; S178 the correction merge writes PRIOR macros into the NEW op, so the op's
  day is no longer only what he typed that time, which the spec should say plainly; S232-233 numstat base d19d38fb
  goes stale at rebase (acknowledged at S12 section).

## Red-first testability of section 9 (16 rows)
Red today by witness or by absent surface: required entry (F1 caveat), optional omission, gram domain, durable raw
macros, correction retains, preference isolation, preference failures, raw display, adverse outcomes, native import
retention, copy inventory, module census, narrow phone controls (food-check.mjs:171 asserts exactly two boxes).
Controls, green already and rightly labelled at S314: no advice or grade, adherence equivalence. Unbuildable: F2.

## Science and owner
No science claim: no floor, warning, target or inference (S24-26 faithful to :561 (6)); the 0..1000 g bounds mirror
protein's invented input bound (S39). Science audit U1-U7 not triggered; U7 ("no new health-data collection") is
touched only by owner order with optional fields, so a one-line U7 citation in section 12 suffices (S362 context).
Joe's three held questions (S348-350) are the right three; F1 adds a fourth or a PM ruling.

## What needs Joe versus what the paper fixes
Joe: Q1 keep-or-clear on correction, Q2 placement, Q3 words, plus F1 (may a calories-only day still be recorded?).
Paper: D1 mark F1 OPEN and hold the rule-reversal rows; D2 drop or name the backup carrier; D3 interim and final
home of the rows; D4 old-reader import consequence; D5 retiring strings; F6 wording.
Not done here: no suite or browser run (not asked); private research corpus not read (S362 says the spec did not either).
