# P4b-1 REMEMBER AND RECALL: the published probe set, as it survives in the record

## What this file is, and what it is not

The ruling's process (`rebuild/lanes/pm/P4B-1-CUSTODY-RULING.md` section 6) puts
the reviewer's probe set FIRST, before the build, and section 4 of the same file
makes running it part of the bar. The PM asked this round to commit that probe
set here.

**The probe set's own text was never committed to this repository.** It was
published in the first workflow and is not in any file this lane can read. So
this file does not claim to be the reviewer's wording, and it invents none: it is
the probe set as the AUTHOR'S REPORT records it, row by row, copied from
`P4B-1-AUTHOR-REPORT.md` section 4 (the assumed surface the probe set's section
0.2 fixed) and section 5 (the probe table, written with the probe document in
hand). Every probe id and every probe name below is that report's; the
"observable" column is the report's own note on what the probe measured.

Where a probe was re-pointed, or could not be taken literally, section 8 of that
report is the record, and this file points at it rather than paraphrasing it.
Anyone who needs the reviewer's exact words needs the first workflow's document,
not this file.

## 0. The assumed surface (report section 4)

The probe set's section 0.2 fixed an assumed surface and a re-pointing rule.
The report's finding was that almost nothing had to be re-pointed: the five
assumed modules and their named exports were all present, each with additions.
The one addition the probes reach for that the assumed surface did not name is
`world.memory.save(memory, { parents })`, because P02-06 needs a way to forge a
causal parent. The TOOL does not expose parents, because a causal parent is not
the model's to choose.

## 1. Section 1, M12: the fourteen adversarial texts

Shared block for all fourteen, as the report states it: store through the real
bound yes, close the world, reopen a WHOLE NEW WORLD over the same store, recall
on a new tools instance, then A to H.

| probe | name |
| --- | --- |
| P12-01 | an instruction-shaped memory |
| P12-02 | a fake tool call in JSON |
| P12-03 | a fake system message |
| P12-04 | a memory that names another tool |
| P12-05 | a memory that claims the owner's authority |
| P12-06 | a unit and a number |
| P12-07 | markup |
| P12-08 | exactly 400 characters |
| P12-09 | 401 characters |
| P12-10 | control characters |
| P12-11 | invisible format characters |
| P12-12 | imitates a source tag and a date |
| P12-13 | asks for the store id or a key |
| P12-14 | two languages |

## 2. Section 2, M02: the writes that must not happen

Every one reads the ops count, the outbox count and the JSON of both collections
BEFORE and AFTER, and every one ends with a legal write that lands.

| probe | name |
| --- | --- |
| P02-01 | no yes, five shapes |
| P02-02 | a cancelled yes |
| P02-03 | a yes bound to different text |
| P02-04 | a replayed yes |
| P02-05 | invalid shape, per member |
| P02-06 | forged cross-user parent |
| P02-07 | unqualified generation |
| P02-08 | the tier is not the model's to set |

## 3. Section 3, M01: the restart and the second installation

| probe | name |
| --- | --- |
| P01-01 | the orderly restart |
| P01-02 | stub-free on the path |
| P01-03 | force kill and reopen |
| P01-04 | a REAL second installation |

## 4. Section 4, M03: the failure injections

Faults at the IndexedDB API through `support.faultDatabase()`, outside product
code. No product file is patched and nothing under `rebuild/coach` is
monkey-patched.

| probe | name |
| --- | --- |
| P03-01 | quota before commit |
| P03-02 | held then aborted |
| P03-03 | commit lands, read-back fails |
| P03-04 | retry after an honest failure |
| P03-05 | the `:458` fold-in (the compensating write that itself fails) |

## 5. Section 5, M06: canonical truth wins

| probe | name |
| --- | --- |
| P06-01 | a machine setting |
| P06-02 | a setup priority |
| P06-03 | the effective programme |
| P06-04 | unknown applicability |
| P06-05 | a memory never becomes an observation |

## 6. Section 6, the recall bound and the standing rows of `:439`

| probe | name |
| --- | --- |
| PRB-01 | six facts on one topic |
| PRB-02 | a request with no topic |
| PRB-03 | a topic that does not exist |
| PRB-04 | never a scan of histories |
| PRB-05 | inside the existing context boundary |

| P39-01 | a moving clock, and never a second clock |
| P39-02 | the device timezone offset |
| P39-03 | local-midnight rollover |
| P39-04 | force kill and reopen |
| P39-05 | offline reload |
| P39-06 | today's real date |

## 7. Where the record is thinner than the probe set was

Three things about the original document are NOT recoverable here, and are said
rather than smoothed over:

1. **The probes' own wording.** Each row above is a name, not the reviewer's
   sentence. A reader who wants to know exactly what a probe asked for has to go
   to the first workflow's document.
2. **The pinned outcomes.** The report shows that at least two probes (P12-10 and
   P12-11) offered alternative outcomes and that the probe set pinned outcome (b).
   The full list of probes that offered alternatives is not in the report, so it
   is not in this file.
3. **Section 0.2's re-pointing rule in full.** The report states its effect (the
   assumed surface, and that almost nothing had to be re-pointed) but not the
   rule's text.

The deviations the author declared, probe by probe, are
`P4B-1-AUTHOR-REPORT.md` section 8, and they are the record of where a probe was
re-pointed or could not be taken literally.
