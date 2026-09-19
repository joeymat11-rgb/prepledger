# PASSPHRASE-NORMALIZE, CELLS ROUND 2 - INDEPENDENT REVIEW (R2, a Claude hand told to disagree)

Branch `rebuild/c-passphrase-normalize`, head **9482bc7f**, ONE commit on top of
ba04c07f, built by Astra under the PM's rulings P-PN-1 to P-PN-4 (DECISIONS:601
and :605). The builder's paper is
`rebuild/lanes/c/passphrase-normalize/CELLS-ROUND-2-REPORT.md`. I read it as a
hypothesis: every number below is one I took myself, and where mine differs from
the builder's I say so.

WHERE THE NUMBERS COME FROM. The owner's PC worktree `%TEMP%\earned-astra-41`,
clean at 9482bc7f, node **v24.19.0**, `MEASURED_TEST_NOW=2026-09-03`,
`TZ=America/New_York`. The cells' helper starts the real port CLI as a child
process; the only thing I know about the private fixture is what that CLI itself
printed, and I never listed the path:

    4. ORACLE     PASS  frozen 7/7  unfrozen 7/7  scope PUBLIC
       (2 public fixtures; rebuild/conform/private/live.json is absent)

Reading, the comment-strip proof and the Unicode enumeration were also done in
the cloud farm on node v22.22.2; the two nodes agree.

## VERDICT: ACCEPT WITH NOTES

No product defect, and no product behaviour moves: the two changed product lines
are comment text and one README sentence, and both are now exact. The nine new
rows each hold their own clause, measured by mutation and not argued. The notes
are one product comment the commit was not allowed to touch (the PM asked for
the exact replacement sentence; it is in section 2), one row TITLE in the cells
that the new C-PN-28 now contradicts, and three paper sentences that are either
understated or over-read against the rows they describe.

## 1. THE BAR, ON THE PC, AT THE HEAD

    node --test --test-isolation=none --test-reporter=tap \
      rebuild/lanes/c/passphrase-normalize/helper.test.mjs \
      rebuild/lanes/c/passphrase-normalize/unlock-forms.test.mjs \
      rebuild/lanes/c/passphrase-normalize/route.test.mjs
    # tests 29 | pass 29 | fail 0 | cancelled 0 | skipped 0 | duration_ms 6297.98

    node --test --test-isolation=none --test-reporter=tap \
      rebuild/m3/w7-preview/import/test/page-bundle.test.mjs
    # tests 7 | pass 7 | fail 0 | skipped 0 | duration_ms 1583.31

THE BUILDER'S TWO PAGE FAILURES DO NOT REPRODUCE OUTSIDE ITS SANDBOX, and I
correct its report on that point: P3-B2 and P3-B5 both PASS here at these bytes.
The builder reported `expected 143, actual 139` and `expected 21, actual 17` and
labelled them "sandbox-qualified counts"; on the unmodified worktree the graph
IS 143 modules and the route's cost IS 21. Seven rows, all named P3-B1..P3-B7,
none skipped. The count is the expected one, so I had no reason to look at the
node_modules junctions.

Scope, product paths only:

    git diff --numstat ba04c07f..HEAD -- rebuild/m3/setup/port/passphrase.cjs \
      rebuild/m3/setup/port/README.md rebuild/m3/setup/port/port.cjs \
      rebuild/m3/setup/port/unseal.cjs rebuild/m3/setup/port/wordlist.cjs \
      rebuild/m3/w6/local/import-bundle.mjs rebuild/m3/w6/repository.mjs \
      rebuild/m3/w7-preview/import/import-screen.mjs \
      rebuild/m3/w7-preview/import/test/page-bundle.test.mjs
    1  1  rebuild/m3/setup/port/README.md
    2  2  rebuild/m3/setup/port/passphrase.cjs

The whole commit touches seven files: those two, the four lane files under
`rebuild/lanes/c/` (three cells and the author paper) and the new builder report.
Nothing else. `rebuild/m3/setup/port/unseal.cjs`,
`rebuild/m3/w6/local/import-bundle.mjs`, `import-screen.mjs`, `port.cjs` and
`wordlist.cjs` are untouched, which I checked by name against the same diff.

## 2. COMMENT-ONLY, PROVED AGAIN, WITH MY OWN TOKENIZER - AND THE WORDS JUDGED

### 2a. The strip

The builder used `/\*[\s\S]*?\*/` in PowerShell, which is not a proof: this file
holds a regex literal and string literals, and a naive strip is only right by
luck. I wrote my own scanner instead (a state machine over the characters, with
states for `//`, block comments, single- and double-quoted strings and template
literals with their backslash escapes, and regex literals told apart from
division by the last significant token). It leaves the code and deletes only
comments; the stripped text still contains the separator regex and both
`normalize('NFKD')` calls, which is the check that the strip did not eat code.

Measured on the two versions of `rebuild/m3/setup/port/passphrase.cjs`:

| what | ba04c07f | 9482bc7f |
|---|---|---|
| file sha256 | `04688413163a1a987596185a280bad654fc11aa7c101e5ab97c63df4f1df540b` | `a56786d3ac04e1e5cd7e8dd40ff8c40fd92c17e0d8215880bada83fa9b26a352` |
| comments stripped, sha256 | `6ddb91319bd93b1660072f5493bff953498608bb82f40b9ffecfa2764a616b4e` | same, 643 bytes |
| stripped and blank lines collapsed | `86a0b3382854c97c2308ec1d637b43af411f10610e6b58330a3fac36b79150c0` | same, 629 bytes |

Both file hashes are the builder's. The remaining bytes are EQUAL, so the change
is comment text and nothing else. My stripper and the builder's regex happen to
agree byte for byte here, which is expected once you know the file has no `/*`
inside any string or regex; the point is that mine did not have to assume it.

The same holds for the other three changed lines: README:200 and the author
paper at :21 and :139 are prose, and the four lane cell files are the cells.

### 2b. Is "ECMAScript \s (U+FEFF in, U+0085 out)" EXACTLY the class the code applies?

YES, and I enumerated it rather than quoting the spec. I walked every code point
from 0 to 0x10FFFF (skipping the surrogate block) on the PC's node v24.19.0 and
again on node v22.22.2, testing each against `/\s/u`, against
`/\p{White_Space}/u`, and against the product's own exported
`PASSPHRASE_SEPARATORS` (read out of `passphrase.cjs`, which prints as a class
over `\s` plus the escapes for U+2010 to U+2015, U+2212, underscore, comma, full
stop and hyphen-minus, flags `u`). Both nodes report Unicode 17.0 and identical
sets:

* `/\s/u` has exactly **25** members: U+0009, U+000A, U+000B, U+000C, U+000D,
  U+0020, U+00A0, U+1680, U+2000 to U+200A, U+2028, U+2029, U+202F, U+205F,
  U+3000, U+FEFF.
* Unicode `White_Space` has exactly 25 members: the same list with U+0085
  instead of U+FEFF.
* Difference, both ways, in full: **U+FEFF is in `\s` and is not White_Space;
  U+0085 is White_Space and is not in `\s`. There is no third character.** So
  "U+FEFF in, U+0085 out" is not a pair of examples, it is the whole delta, and
  U+0085 is the ONLY other White_Space character the old wording promised.
* `/\s/` and `/\s/u` agree on every code point, so the `u` flag on the product's
  regex neither widens nor narrows `\s`. The 11 members of the product's class
  outside `\s` are exactly U+002C, U+002D, U+002E, U+005F, U+2010, U+2011,
  U+2012, U+2013, U+2014, U+2015, U+2212 - the ones the same comment names.

So the corrected words at `passphrase.cjs:22` and `:46` and at README:200 are
exact. This is the first sentence in this lane's paper that is true of the code
character for character rather than nearly true.

### 2c. The sentence the commit was not allowed to touch: passphrase.cjs:25-26

It still reads, as the tail of the separator-runs item:

    hyphen-minus. That is every character a keyboard, a
    paste or smart punctuation can put between two words.

It is FALSE, and now demonstrably so from this lane's own rows. A keyboard can
put U+0085 between two words (C-PN-26 and C-PN-27 measure that it refuses); a
paste can put U+200B, U+2060 or U+00AD there (C-PN-20 measures that all three
refuse and glue the six words into one); a phone keyboard can put a slash, a
colon or a semicolon there, and iOS smart punctuation produces U+2019, none of
which is in the class. The sentence promises a closed set that the code does not
deliver, in the one file that is about to be sealed.

**PROPOSED REPLACEMENT, exact, for the integrator comment commit.** Two lines
replace two lines, same 23-space continuation indent, 76 and 75 characters, so
nothing else in the block moves:

    OLD
                           hyphen-minus. That is every character a keyboard, a
                           paste or smart punctuation can put between two words.

    NEW
                           hyphen-minus. Anything outside that class, U+0085 and
                           U+200B among them, stays part of a word and refuses.

Every claim in the new sentence is measured by a row of this lane: U+0085 by
C-PN-26, C-PN-27 and C-PN-28, U+200B by C-PN-20. It says the one thing the
athlete needs (a character outside the class is not a separator) without
promising a set nobody has enumerated for keyboards.

## 3. DOES EACH NEW ROW HOLD ITS CLAUSE ALONE? MEASURED, SEVEN MUTANTS

METHOD, and it writes nothing into the worktree. A harness registered with
`module.registerHooks` under `--import` rewrites the SOURCE TEXT of one named
module as it is loaded; the worktree files never change (`git status` stayed
clean throughout). The harness throws if an anchor is missing or matches a
number of times other than the one declared, and prints which file it patched,
so a mutant that silently failed to apply cannot be reported as a survivor. All
seven anchors were pre-checked against the real files: each hit exactly once.
Every run is the full 29-row bar.

| mutant | the exact change | rows that died | of 29 |
|---|---|---|---|
| M01 | the FIRST `.normalize('NFKD')` removed from `normalisePassphrase` | C-PN-22 | 28 pass, 1 fail |
| M16 | a strip of the U+D800 to U+DFFF range added before the separator fold | C-PN-23 | 28 pass, 1 fail |
| M18 | the node decoder's tag-failure throws an Error also carrying `typed` | C-PN-24 | 28 pass, 1 fail |
| M19 | the phone decoder's tag-failure fails with `{ typed: passphrase }` | C-PN-25 | 28 pass, 1 fail |
| N85 | a scratch normalizer whose class ADMITS U+0085 | C-PN-26, C-PN-27, C-PN-28 | 26 pass, 3 fail |
| NFEFF | a scratch normalizer that DROPS U+FEFF (every other `\s` member written out by hand) | C-PN-26, C-PN-27, C-PN-28 | 26 pass, 3 fail |
| RCLEAR | a scratch Import route whose refusal does `input.value = ''` | C-PN-29 | 28 pass, 1 fail |

Read that as: **each of M01, M16, M18, M19 and RCLEAR kills exactly one row, and
it is the row that claims it.** No other row moved, in either direction, under
any of the seven. The builder's claim on these four mutants reproduces outside
its sandbox, and the P-PN-4 negative control reproduces too.

THE P-PN-3 PAIR IS DIFFERENT, on purpose and worth saying out loud. Neither
scratch normalizer isolates ONE fact: C-PN-26 (node), C-PN-27 (phone) and
C-PN-28 (the helper) each assert BOTH halves, so admitting U+0085 and dropping
U+FEFF kill the same three rows. That is what P-PN-3 asked for - one row per
ENTRY POINT pinning both facts - and I am not asking for a fourth row. But see
note N5: for the U+FEFF half the diagnostic is a bare thrown
`BUNDLE_AUTH_FAILED` with no sentence, while the U+0085 half fails with its own
named message, so a reader in CI is told WHICH half moved in only one direction.

## 4. P-PN-1: THE HOISTED `wrongOrder`, THE EQUAL-FIRST-PAIR CASE, 50 FRESH PHRASES

### 4a. No evaluation order reaches `wrongOrder` before `assert` is bound

The argument. `wrongOrder` is a FUNCTION DECLARATION in module scope
(unlock-forms.test.mjs:184), so it is hoisted and fully initialised before the
first statement of the module body runs; the module-level `REFUSED` table
(:55-63) may therefore call it 126 lines above its text. `assert` is an ESM
IMPORT BINDING (`import assert from 'node:assert/strict'`, :17). Imported
bindings are created during linking and their module is evaluated before the
importing module's body, depth-first; the only way such a binding could still be
in the temporal dead zone at :58 is an import CYCLE back into this file, and
nothing in the graph imports a test file. `SIX` and `PC_FORM` are `const` at :34
and :35, above :58, so they are initialised too. There is no order in which
`REFUSED` reads `wrongOrder` before `assert` exists.

The measurement, because an argument is not a proof. I forced the module-level
call onto the all-equal case (`wrongOrder(Array(6).fill(SIX[0]))`) through the
same load-time harness and ran the file:

    not ok 1 - rebuild\lanes\c\passphrase-normalize\unlock-forms.test.mjs
      error: 'C-PN-11: no unequal adjacent words to exchange'
      code: 'ERR_ASSERTION'
      name: 'AssertionError'
      stack: wrongOrder (...unlock-forms.test.mjs:187:10)
    # tests 1 | fail 1

An `AssertionError` naming C-PN-11, not a `ReferenceError`: `assert` was bound
at that point in evaluation. **The all-equal case fails loudly and by name, as
ruled.** One thing to know about it, which the builder does not say: because the
call is at module level, that failure is FILE-level - the TAP line is the file
name, `# tests 1`, and the other 12 rows of the file never run. It is loud, it
is named, and it needs six identical draws (one run in 2048^5), so I am not
asking for it to move.

### 4b. C-PN-11 over 50 FRESHLY sealed bundles

I sealed 50 NEW bundles through the real port CLI (50 real seals, one after
another, 47.4 s) and ran C-PN-11's whole REFUSED table against each of them on
BOTH decoders, with `wrongOrder` copied byte for byte out of the cell:

* 300 refusal rows measured (6 forms times 50 phrases), each on both decoders.
* Every one refused: node `code` and `message` both `BUNDLE_AUTH_FAILED`, phone
  `code` equal to `BUNDLE_FAILURE`. Zero openings.
* For all 50, the wrong-order form's canonical fold was never equal to the
  sealed phrase.
* Draws with the FIRST two words equal: **0 of 50**. Draws with ANY equal
  adjacent pair: **0 of 50**. (About 0.24% of phrases carry one, so roughly one
  batch of 50 in eight shows one; this batch did not.)

### 4c. What that leaves unheld, said plainly

No cell anywhere seals a bundle whose minted phrase repeats an adjacent word and
then opens the swapped phrase on the two decoders. C-PN-21 tests the
CONSTRUCTION alone, as the ruling allows, because `sealInventedBundle` has no
supplied-phrase option. The end-to-end case is held by COMPOSITION, not by a
measurement: C-PN-21 proves the constructed string is not the sealed phrase even
when the first pair repeats; C-PN-11 proves over 50 fresh phrases that a
different string refuses on both decoders; C-PN-7 proves no two valid
passphrases fold onto one canonical form. I am satisfied by that chain, and I
would REFUSE a fix that added a supplied-phrase option to the helper: that is a
product affordance built for a test, on the sealing path, days before the seal.
The honest statement for the paper is "the equal-first-pair shape is measured on
the construction; the decoders are not run on it", which is what the builder's
"What I did not verify" already says.

## 5. C-PN-24 AND C-PN-25: STRICT, OR FLAKY ON ANOTHER MACHINE?

The two rows compare the WHOLE `JSON.stringify(error)` with a literal. The
question the PM asked is whether any field of either refusal is legitimately
variable - a stack, a cause, a message - which would make them flaky rather than
strict. I printed every own property of both refusals with its enumerable flag:

    node   Error            own stack (accessor, enumerable=false)
                            own message (enumerable=false)
                            own code (enumerable=true)
                            Object.keys ["code"]
                            JSON.stringify {"code":"BUNDLE_AUTH_FAILED"}
                            'cause' in error: false
    phone  StorageFailure   own stack (accessor, enumerable=false)
                            own message (enumerable=false)
                            own name, code, state, retryable (enumerable=true)
                            Object.keys ["name","code","state","retryable"]
                            JSON.stringify {"name":"StorageFailure",
                              "code":"BUNDLE_AUTH_FAILED","state":3,
                              "retryable":false}
                            'cause' in error: false

`JSON.stringify` serialises own ENUMERABLE properties only. `message` is
non-enumerable because `Error`'s constructor installs it that way; `stack` is a
non-enumerable own accessor on V8; `cause` would be non-enumerable too, by spec,
and there is none. So none of the three things that could vary by machine, by
working directory or by node version can reach either literal. The four values
that DO reach it are product constants: `state` 3 and `retryable` false come
from `StorageFailure` (repository.mjs:16), and `name` is the string literal
`"StorageFailure"` assigned in that constructor, NOT `constructor.name` - so
even a minifier renaming the class could not move it. **The rows are strict, not
flaky. I could not find a field that varies.**

One caveat, and it fails CLOSED, so it is not a reason to loosen them: anything
that decorates thrown Errors with an own enumerable property (an instrumentation
agent injected through `NODE_OPTIONS` in some future CI image) would break both
rows. That is a refusal to investigate, not a false pass, and it is exactly the
behaviour F2 asked for.

## 6. THE PAPER, SENTENCE BY SENTENCE AGAINST THE CODE

| where | the corrected words | true of the code? |
|---|---|---|
| passphrase.cjs:22 | `any run of ECMAScript \s (U+FEFF in, U+0085 out; U+00A0, U+3000 ...)` | YES, exactly (section 2b) |
| passphrase.cjs:46 | `The class is, in order: ECMAScript \s (U+FEFF in, U+0085 out), U+2010 ...` | YES, and the order matches the literal |
| passphrase.cjs:25-26 | unchanged, still "every character a keyboard ... can put" | NO - note N1 |
| README:200 | `ECMAScript \s, including U+FEFF and excluding U+0085` | YES |
| AUTHOR-REPORT:21 | the pipeline line | YES |
| AUTHOR-REPORT:139 | `the whole class: ECMAScript \s, including U+FEFF and excluding U+0085, ...` | YES |
| AUTHOR-REPORT:369-374 | the narrowed screen claim | mostly - notes N3 and N4 |

THE NARROWED SCREEN CLAIM, against what C-PN-29 and C-PN-16 actually measure.

1. "The refusal prose does not echo the fixed nonsense probe words" - TRUE:
   C-PN-16 asserts `run.text` and `other.text` contain none of the six PROBE
   words, which the port can never draw.
2. "its textContent and refusal record are equal for the two wrong phrases
   tested" - true but **understated**, and now at odds with the cell's own
   unchanged comment. `run.text` is `textOf(kit.doc)`: the WHOLE rendered text
   of the page, and C-PN-16 compares the two character for character
   (`assert.equal(other.text, run.text, ...)`). route.test.mjs:93-98, which this
   commit did not touch, still says "the entire rendered text after a wrong-word
   refusal is compared, character for character". After the edit the paper reads
   as if only the refusal prose is compared. Note N3.
3. "C-PN-29 also measures equal refusal textContent and refusal records for a
   wrong phrase and a malformed phrase" - TRUE: `content(run)` is the
   textContent of `#phone` (falling back to `body`), compared for
   `[...SIX.slice(0,5),'zzzzzz'].join(' ')` and for `' - - '`, and both
   refusals deep-equal `{ code: 'BUNDLE_AUTH_FAILED', detail: null }`.
4. "Each editable input keeps exactly what the athlete typed" - **over-read**.
   C-PN-29 reads ONE box, `#import-passphrase`, on each of two pages, and
   asserts its `value` equals the string typed into that page. "Each editable
   input" promises a sweep of the screen's inputs that no row performs. Note N4.
5. "The input values differ, so these cells do not claim that the entire refused
   screen is identical" - TRUE, and it is the right fix for F4.

## FINDINGS, MOST SEVERE FIRST

**N1. `passphrase.cjs:25-26` is still false, in the file that is about to be
sealed.** Severity: the highest here, and it is the one the PM already expects.
Input: the comment claims the class is "every character a keyboard, a paste or
smart punctuation can put between two words". Output: U+0085 refuses (C-PN-26,
C-PN-27), U+200B, U+2060 and U+00AD refuse (C-PN-20), and a slash, a colon or
iOS's U+2019 are not in the class at all. The exact two-line replacement is in
section 2c. Apply it in the integrator comment commit; it is comment text, so
the stripped bytes stay equal and the proof of section 2a can be repeated.

**N2. A row TITLE in the cells now contradicts a row added by this commit.**
`helper.test.mjs` C-PN-20 is titled "invisible FORMAT characters are not
separators: they refuse, they refuse closed, and this lane did not widen the
accepted set to them", and its last assertion is over `/\p{Cf}/u`. U+FEFF IS a
format character (general category Cf), and the new C-PN-28, 30 lines below in
the same file, measures that it IS a separator and that the six words joined
with it OPEN. Both rows pass, because C-PN-20's body tests U+200B, U+2060,
U+00AD and U+200E and never U+FEFF - but the two titles, read together, say
opposite things, and the title is what a reader meets in CI. Fix, in the same
comment-only spirit and in a CELL, so it is not sealed-file text: name the
exception in C-PN-20's title or first comment line ("every invisible FORMAT
character EXCEPT U+FEFF, which ECMAScript's `\s` includes"). Not blocking: no
assertion is wrong.

**N3. The paper now UNDERSTATES C-PN-16 and disagrees with the cell's own
comment.** AUTHOR-REPORT:370 says "its textContent ... equal for the two wrong
phrases tested"; the row compares `textOf(kit.doc)`, the whole rendered text of
the page, character for character, and route.test.mjs:93-98 (unchanged by this
commit) still says exactly that. Under-claiming is the safe direction, but a
paper and a cell that describe the same row differently is the thing this lane
keeps being burned by. Proposed: "the WHOLE rendered text of the refused page is
equal, character for character, for the two wrong phrases tested".

**N4. "Each editable input keeps exactly what the athlete typed" over-reads
C-PN-29.** AUTHOR-REPORT:372-373. The row reads ONE box, `#import-passphrase`,
on each of two pages. Proposed: "the passphrase box on each of the two refused
pages still holds exactly the string typed into it".

**N5. The U+FEFF half of C-PN-26, C-PN-27 and C-PN-28 fails without a
sentence.** Measured with the NFEFF scratch normalizer: the row dies at
`openNode(SIX.join(FEFF)).source.sha256`, which THROWS, so the TAP diagnostic is
a bare `error: 'BUNDLE_AUTH_FAILED'`. The U+0085 half fails with its own message
("node: U+0085 was admitted as a separator"). A one-argument change to each of
the three rows would name the half. Cosmetic, cells only, not blocking.

**N6. The three corrected paper lines break the local wrap.** Measured lengths
against their neighbours: README:200 is 108 characters where lines 194-204 run
75-79; AUTHOR-REPORT:139 is 179 where 133-142 run 31-79 and it collapsed a
two-line bullet into one; AUTHOR-REPORT:21 is 98 inside a pipeline block whose
other lines are 68-73 and which is meant to line up. In `passphrase.cjs` itself
line 46 is now **93 characters, the longest line in the file** (the longest at
ba04c07f was 85, and the comment block wraps at 71-76). Since the PM is going to
touch these files once more for N1, re-wrap them in the same commit; after the
seal the cheap moment is gone.

## WHAT I DID NOT VERIFY

* The other 13 mutants of the builder's table (M02-M15, M17, M20) and its claim
  that "no prior detection was lost" across all 20: I re-ran M01, M16, M18, M19,
  the two P-PN-3 normalizers and the P-PN-4 route control, and no others.
* Linux, GitHub CI, a real iPhone or Safari, the whole Today step, deployment.
  This review is one machine, node v24.19.0, Windows.
* The blind review's own census (96 generated phrases on both decoders, the
  4,194,304 word pairs, the base/head compatibility of 12 sealed bundles). I did
  not repeat it; my 50 fresh seals are a much smaller sample of the same claim.
* Anything about the owner's real file. No private fixture, no ledger, no
  `src/history.js`, no EarnedPort, no soak, no `rebuild/conform/private` was
  read, listed or grepped on either machine, and I created no junction. The
  private fixture's absence is known ONLY from the port CLI's own stdout.
* I did not run `b-package.cjs --full`, any seal generator, or anything that
  writes a receipt or an artifact into the tree.
* The equal-first-pair phrase END TO END on the two decoders: see section 4c. It
  is held by composition, not by a measurement, and I accept that.
* Whether `page-bundle.test.mjs` would still be 7/7 after the N1 comment commit:
  a comment in `passphrase.cjs` changes the module's bytes but not its graph, so
  I expect 7/7, and I did not measure it at bytes that do not exist yet.

Reviewer: cowork (Earned lane hand), on 2026-09-19. This file is the only thing
this review commits.
