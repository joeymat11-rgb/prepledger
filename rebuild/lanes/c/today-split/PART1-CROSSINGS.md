# PART 1 CROSSINGS - what the two small cuts stranded, and what carries each row

R1's closing note: "A regenerated `CROSSINGS.md` on the build's own output would be worth
more than the prose." This is that table. The dispositions of part 1 lived in section 6 of
the build report as sentences; here they are a row per crossing, beside the machine's own
measurement of it, so a reviewer checks the interface against the census instead of against
an author's paragraph.

**Why this table is taken with `--no-replace`, which is new.** The census over the PRODUCT
output is **0 crossings**, and that number says only that the interface carries everything;
it cannot say WHAT it carries, because the replaced released lines already call through
`facade` and `hooks` and a member access on a local resolves locally. So `cut.cjs` gained a
MEASUREMENT mode, `--no-replace`: it witnesses every `replace` region exactly as usual and
then leaves its released lines where they are instead of swapping in the declared call. The
census over that output is the answer to "what did the cut strand BEFORE the interface
carried it", which is the table worth committing. `--no-replace` refuses to combine with
`--product`, so it can never write a product file.

Measured in a farm scratch, at the build's base ref `s9`
(`da9f86839d69a67dfa8c6a59b727aa518bc1164f`, `rebuild/b-s9-ui-pins`), sources read with
`git show`:

```
node cut.cjs    --root <s9 tree> --out pre  --only today-model.cjs,gym-app.mjs --no-replace
node census.cjs --root <s9 tree> --out pre  --md PART1-CROSSINGS.md
```

| | |
|---|---|
| crossings before the interface | **20 references, 13 distinct direction+name** |
| released reads a sealed binding | 16 |
| released calls a sealed function | 3 |
| RELEASED ASSIGNS A SEALED BINDING | **1** (`settingsSaving` at `gym-app.mjs:279`) |
| the instrument's own residue | **0** |
| crossings on the PRODUCT output (the bytes that ship) | **0** |

---

## THE GYM PAIR: `gym-app.mjs` -> `gym-settings-lane.mjs`

Fourteen rows. Every one is carried by a NAMED entry of the frozen interface, and the
disposition column is the entry that carries it.

| name | kind | source | sits in | declared in | DISPOSITION |
|---|---|---|---|---|---|
| `settingsLane` | read | `gym-app.mjs:246` | `GA-R01` | `GA-S01` | `facade.lane()` |
| `settingsLane` | read | `gym-app.mjs:305` | `GA-M01` | `GA-S01` | `facade.lane()` |
| `settingsLane` | read | `gym-app.mjs:572` | `GA-R06` | `GA-S01` | `facade.lane()` |
| `settingsOpening` | read | `gym-app.mjs:571` | `GA-R06` | `GA-S01` | `facade.ready()` |
| `settingsSaving` | **write** | `gym-app.mjs:279` | `GA-R03` | `GA-S01` | `hooks.saving(p)`, the ONE released assignment of a sealed binding in these two files, and the row B.9 never had |
| `settingsSaving` | read | `gym-app.mjs:570` | `GA-R06` | `GA-S01` | `facade.pending()` |
| `settingsRead` | read | `gym-app.mjs:251` | `GA-R02` | `GA-S02` | `facade.hasRead(liftId)` |
| `settingsRead` | read | `gym-app.mjs:252` | `GA-R02` | `GA-S02` | `facade.entryFor(liftId)` |
| `settingsRead` | read | `gym-app.mjs:316` | `GA-M01` | `GA-S02` | `hooks.dropRead(id)` |
| `settingsRead` | read | `gym-app.mjs:576` | `GA-R06` | `GA-S02` | `facade.stateFor(liftId)` |
| `settingsReading` | read | `gym-app.mjs:575` | `GA-R06` | `GA-S02` | `facade.reading()` |
| `openSettingsLane` | call | `gym-app.mjs:246` | `GA-R01` | `GA-S04` | `hooks.open()` |
| `startSettingsRead` | call | `gym-app.mjs:251` | `GA-R02` | `GA-S03` | `hooks.startRead(liftId)` |
| `startSettingsRead` | call | `gym-app.mjs:317` | `GA-M01` | `GA-S03` | `hooks.startRead(view.lift.id)` |

**The interface is exactly seven facade entries and four hooks, and nothing is unused.** All
seven `facade` entries (`lane`, `pending`, `ready`, `reading`, `hasRead`, `entryFor`,
`stateFor`) and all four `hooks` entries (`open`, `startRead`, `dropRead`, `saving`) appear
in the disposition column above. An entry with no row is an interface nobody needed.

**Two SEALED -> RELEASED rows do not appear here and this says why.** The seal's two `paint`
calls at `:154` and `:167` are disposed of by the declared SUBSTITUTIONS `W7a` and `W7b`
(`paint()` becomes `painter.repaint()`), and substitutions are applied in this mode, so the
census no longer sees them cross. They are carried by `painter`, the third interface name,
and the writer fence asserts that handle is a frozen one-entry object.

## THE TODAY-MODEL PAIR: `today-model.cjs` -> `today-readings.cjs`

Six rows, all RELEASED reads of sealed bindings, all disposed of by ONE destructuring
composition at `today-model.cjs:412`.

| name | kind | source | declared in | DISPOSITION |
|---|---|---|---|---|
| `weighIn` | read | `today-model.cjs:458` | `TM-S02` | destructured from `createReadingsWriter({...})` |
| `reopen` | read | `today-model.cjs:458` | `TM-S03` | destructured from `createReadingsWriter({...})` |
| `ALREADY_RECORDED` | read | `today-model.cjs:487` | `TM-S01` | destructured (S-R22 refusal constant) |
| `OUT_OF_RANGE` | read | `today-model.cjs:487` | `TM-S01` | destructured (S-R22 refusal constant) |
| `FORM_MIN` | read | `today-model.cjs:487` | `TM-S01` | destructured (S-R22 refusal constant) |
| `FORM_MAX` | read | `today-model.cjs:487` | `TM-S01` | destructured (S-R22 refusal constant) |

The SEVEN INJECTIONS in the other direction (`day`, `readings`, `adoptedRead`,
`stateFromOps`, `NO_STORE`, `setMessage`, `read`) are not crossings in this table: the census
measures references the cut STRANDED, and the injections are the parameters that stop them
being stranded. The seventh, `read`, is the spike's own correction to F.1 (c)'s six, because
`reopen` calls the released `read()`.

## WHAT THIS TABLE DOES NOT SAY

**Zero crossings on the product output means the interface carries everything the cut
stranded, and it means nothing more than that.** A census over a built interface goes quiet
by construction. It is `capture.cjs` (0 name captures over 1243 references on bytes proven
identical to the shipped ones) and the writer fence, not this census, that judge whether the
interface is a GOOD one.

**`GA-M01` (SEAM G1, `recordSettings`) is not disposed of by an interface entry.** Its
released half still decides what is stored: it validates through
`MachineSettingsView.machineFromDraft` and calls `facade.lane().save(machine)`. That is the
S-R17 (g) STOP the build report declares, it is pre-existing, and B.9's `editSeq` token
protocol that would close it is part 2. Three of the rows above (`:305`, `:316`, `:317`) sit
inside it.
