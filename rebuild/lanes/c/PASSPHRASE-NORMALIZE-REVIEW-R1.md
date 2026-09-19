# PASSPHRASE-NORMALIZE - INDEPENDENT REVIEW R1

Reviewer: cowork (Earned lane hand), security-minded, told to disagree.
Head reviewed: `c6b3945469b04dbbd81b2e38f314f723f73b5f43`, branch
`rebuild/c-passphrase-normalize`, base `9e1ece8`.
Worktree: `%TEMP%\earned-passphrase`. Scratch worktree for the red-first proof:
`%TEMP%\crev-base`, detached at `9e1ece8`, removed at the end.

Method: the diff was read first and a view formed from it, then the probes below
were run, and only then was the author report read. Every number here was
measured on this PC by this reviewer, not copied from the report.

## VERDICT: REJECT

One blocking item, in two of the lane's own new test files. **The product change
itself is correct, and I could not break it.** The fix is one line in each of
two unpinned, lane-owned cells; nothing about the design, the helper, the two
derive sites or the copy needs rethinking. I am rejecting rather than accepting
with notes because the lane's own cell suite went red in front of me on the
first full run, and it will go red in CI about once in every seventeen runs,
with a message that reads like a security leak.

---

## BLOCKING

### B1. Two new cells fail at random, about 1 CI run in 17, with a message that impersonates a security finding

Both cells assert that none of the six minted words appears in a haystack that
the cells themselves fill with English prose, using `String.includes` (substring,
not word boundary). The six words are minted fresh by the real `port.cjs` on
every run, so this is a lottery, not a timing flake, and re-running is not a
legitimate answer to it.

**Site 1 - `unlock-forms.test.mjs` C-PN-13** (line 139 area):

    const seen = JSON.stringify({ message: refusal.message, code: refusal.code,
      field: refusal.field ?? null, detail: refusal.detail ?? null });
    ...
    for (const word of [...SIX, 'zzzzzz'])
      assert.equal(seen.includes(word), false, 'the refusal carries the word ' + word);

`JSON.stringify` writes the KEY NAMES into the haystack. All four of
`message`, `code`, `field` and `detail` are words in
`rebuild/m3/setup/port/wordlist.cjs`. So whenever the port mints any one of
those four, the cell reports that the refusal "carries the word", when the
refusal carries nothing of the sort.

**Site 2 - `route.test.mjs` C-PN-16** (line 86 area):

    for (const word of SIX)
      assert.equal(run.text.includes(word), false, 'the screen printed the word ' + word);

`run.text` is `textOf(kit.doc)`: the whole rendered words step, prose included.
I captured it exactly as the cell sees it, in the refused state:

    "Import my historyBackBUNDLE_AUTH_FAILED That passphrase or file did not
     unlock. Check the six words and the file.earned-port-2026-09-16.jsonType
     the six words from the PCYou can type them with spaces or with hyphens,
     and capitals do not matter.Unlock"

Seventeen wordlist words are substrings of that string:
`can, capital, earn, file, hat, hen, history, lock, matter, pass, phrase, six,
space, story, type, unlock, word`.
Three of them (`space`, `capital`, `matter`) are contributed by the helper
sentence **this lane added**, so the change made its own cell measurably flakier.
`hat` comes out of "That", `hen` out of "hyphens", `phrase` out of "passphrase".

**Measured, not estimated.** Monte Carlo over the real `makePassphrase`,
N = 200000 draws:

| cell | false red per run |
|---|---|
| C-PN-16 (route) | 4.87% |
| C-PN-13 (unlock-forms) | 1.16% |
| either, per CI run of the lane step | **5.97%, about 1 in 17** |

**Observed.** Four independent runs of the lane step on this tip, three red:

| run | exit | failure |
|---|---|---|
| bar G1 | 1 | `the refusal carries the word detail` (C-PN-13) |
| rerun A | 0 | clean, 18 of 18 |
| rerun B | 1 | `the screen printed the word matter` (C-PN-16) |
| rerun C | 1 | `the refusal carries the word message` (C-PN-13) |

Why this blocks rather than being a note: the wording of the failure is
`the refusal carries the word <w>` and `the screen printed the word <w>`. Anyone
who meets that in CI will read it as the import screen leaking a word of the
owner's passphrase, on the owner's data path, days before his father imports.
A cell whose false alarm is indistinguishable from the real alarm it exists to
raise is worse than no cell. It also cannot be honestly cleared by a re-run: the
lane's own rule says a red is fixed or reported, never re-rolled.

**The remedy, which does not weaken either assertion.** Search the VALUES, not a
serialised object, and not the page's prose:

* C-PN-13: build the haystack from the values alone, for example
  `[refusal.message, refusal.code, refusal.field, refusal.detail].map(v => v ?? '').join(' ')`.
  The assertion keeps its full force: a refusal that actually carried a word
  would carry it in a value.
* C-PN-16: assert against the refusal sentence and the words-step text that the
  screen adds, minus the fixed COPY it is known to paint, or compare the rendered
  text to the same render performed with a DIFFERENT six words and assert the two
  are identical. The second form is strictly stronger than what is there now and
  has no lottery in it at all.

Neither remedy loosens anything, and neither touches a pinned file.

---

## WHAT I TRIED TO BREAK AND COULD NOT

Every probe below was written by me and run on this PC.

### P1. Two different valid passphrases that normalise to one string: NONE EXIST

Measured on `wordlist.cjs` directly, independently of the author's C-PN-7:

    WORDLIST_LEN 2048
    WORDS_NOT_ALREADY_CANONICAL 0
    WORDS_THAT_SPLIT 0
    FOLD_COLLISIONS 0
    NON_ASCII_WORDS 0
    RAW_DUPES 0

No word contains a character in the separator class, so the hyphen-joined form
re-splits uniquely; no word is changed by NFKD, by lower case, or by the fold;
no two words fold together; no word is a duplicate. The fold is therefore
injective on words and the join is injective on sequences, so it is injective on
six-word draws. The entropy is unchanged at `log2(2048) * 6 = 66` bits, and the
work factor is unchanged at 600000 PBKDF2-SHA256 rounds. I agree with the
author's security reasoning and reproduce it independently.

I also checked the specific trick the ticket named: a word that is two other
words joined. It is irrelevant here, because a separator never VANISHES under
this fold - a run of separators becomes exactly one hyphen - so `ab cd` maps to
`ab-cd` and can never reach `abcd`.

### P2. The Unicode surface, 32 typed forms

`normalisePassphrase` behaves, on every form the ticket names and several it does
not. Accepted (all map to the PC's form): hyphens, spaces, capitals with hyphens,
capitals with spaces, NBSP U+00A0, ideographic space U+3000, en dash U+2013, em
dash U+2014, minus U+2212, fullwidth hyphen U+FF0D, small hyphen U+FE63,
underscore, comma, full stop, tab, newline, doubled separators, leading and
trailing space, leading and trailing dashes, leading BOM U+FEFF. Refused, as they
must be: five words, seven words, wrong order, one wrong word, separators only,
empty.

NFKD expanding a compatibility character into LETTERS (the ligature case, for
instance) cannot create a collision either, because it is applied before the fold
and no wordlist word is reachable that way - P1 shows every word is already its
own NFKD-and-lower-case image.

### P3. RED FIRST, and an already-sealed bundle, in one probe

This is the probe I most wanted, because it answers the author's claim by
execution rather than by argument. In the scratch worktree at `9e1ece8` I sealed
a synthetic bundle with the **pre-change** `port.cjs` and `makePassphrase`, then
opened that same bundle in both trees.

BASE, the product as it was:

    hyphen form the PC wrote      -> OPENED
    SPACES (what the owner typed) -> REFUSED BUNDLE_AUTH_FAILED
    CAPITALS + hyphens            -> REFUSED BUNDLE_AUTH_FAILED
    en dash U+2013                -> REFUSED BUNDLE_AUTH_FAILED
    NBSP                          -> REFUSED BUNDLE_AUTH_FAILED
    leading/trailing space        -> REFUSED BUNDLE_AUTH_FAILED
    one wrong word / wrong order / five words -> REFUSED BUNDLE_AUTH_FAILED

HEAD `c6b3945`, the SAME bytes, sealed before the change:

    hyphen form the PC wrote      -> OPENED
    SPACES (what the owner typed) -> OPENED
    CAPITALS + hyphens            -> OPENED
    en dash U+2013                -> OPENED
    NBSP                          -> OPENED
    leading/trailing space        -> OPENED
    one wrong word / wrong order / five words -> REFUSED BUNDLE_AUTH_FAILED

That is the owner's 2026-09-17 refusal reproduced on the unchanged product, and
it is also the direct answer to "does a bundle sealed before the change still
open after it": yes, and the hyphen form still opens it, and wrong words still
refuse with the identical code. Red-first is proved on the PRODUCT, which is
stronger evidence than the lane's cells failing to load at base.

### P4. The sealing side and the KDF: NOT MOVED. No blocking finding.

`rebuild/m3/setup/port/port.cjs` is not in the diff at all. `seal()` (port.cjs:192)
calls `deriveKey` imported from `unseal.cjs` (port.cjs:56), and `deriveKey` is
byte for byte unchanged: the diff to `unseal.cjs` is one `require` and one call
site inside `unseal()`. Iterations 600000, salt 16 bytes, SHA-256, AES-256-GCM,
the AAD binding and the wordlist are all untouched. P3 confirms this by
execution, from the other direction. The author's C-PN-12 pins it as well, and I
agree with that cell.

The fold is applied at the two IMPORT entries and nowhere else. Putting it inside
`deriveKey` would have changed what every FUTURE bundle is sealed with; it was
not put there. This is the single most important judgement in the ticket and the
author got it right.

### P5. A second code path still deriving from the RAW string: NONE

`git grep` for `pbkdf2|deriveKey|deriveBits` over `rebuild` returns exactly three
product sites: `port.cjs` (seal, correctly untouched), `unseal.cjs` and
`w6/local/import-bundle.mjs`. Both import-side sites call `normalisePassphrase`
exactly once, at the call site, and neither carries its own separator class or
its own `toLowerCase`. The ticket's brief pointed at a browser twin "under
`rebuild/m3/w7-preview/import/`"; no such file exists - the phone's decoder is
`rebuild/m3/w6/local/import-bundle.mjs`, which is the one the author changed.
There is no third site. C-PN-6 guards this going forward and I consider it the
most valuable cell in the lane.

### P6. A timing or error-message oracle: nothing that leaks the secret

No pre-check was wired in, so there is no new refusal code and no new branch on
the screen. One behaviour did change: when the typed string folds to the empty
string (whitespace or separators only), `deriveKey`'s existing
`if (... || !passphrase) fail(FAILURE)` now fires and PBKDF2 is skipped, so that
one input refuses fast. What an observer learns is "you typed no word
characters", which the typist already knows and which is independent of the
bundle and of the six words. The code and the sentence are identical to every
other refusal. Not a leak.

Refusal content: `BUNDLE_AUTH_FAILED` as both code and message, no `field`, no
index, no count, no word, on both decoders, for every wrong input in P2 and P3.
I agree with the author's decision in report section 7a to leave the word-count
pre-check out. My own reason for agreeing is narrower than his: a count is
genuinely safe to disclose, but it is a new user-facing code on an S8-pinned
screen on the owner's data path in the week his father imports, and the screen
now prevents the mistake before it happens, which is better than naming it after.

---

## CONFIRMATIONS THE TICKET ASKED FOR

* **No engine, coach or DECISIONS byte.**
  `git diff --numstat 9e1ece8..HEAD -- rebuild/engine rebuild/coach rebuild/DECISIONS.md`
  is EMPTY. Confirmed.
* **`.github/workflows/rebuild.yml` untouched.** `git diff --name-only 9e1ece8..HEAD -- .github`
  is empty. Confirmed.
* **No U+2013 or U+2014 added.** Scanned every ADDED line of the whole diff:
  zero literal en or em dashes. (Both characters exist in `unseal.cjs` and
  `import-bundle.mjs` on lines this branch did not write; the branch adds none.)
  The regex in `passphrase.cjs` uses `\u2010-\u2015` escapes as required.
  Confirmed.
* **Pinned files touched, checked against `rebuild/m4/spec/acceptance-s8-real-shape.json`:**

| path | pinned | needed |
|---|---|---|
| `rebuild/m3/setup/port/passphrase.cjs` (new) | no | yes |
| `rebuild/m3/setup/port/unseal.cjs` | no | yes, a derive site |
| `rebuild/m3/w6/local/import-bundle.mjs` | **PINNED** | yes, the other derive site |
| `rebuild/m3/w7-preview/import/import-screen.mjs` | **PINNED** | yes, the copy |
| `rebuild/m3/w7-preview/import/test/page-bundle.test.mjs` | **PINNED** | yes, the module count moved |
| `rebuild/lanes/c/passphrase-normalize/*.test.mjs` (new) | no | yes |
| `rebuild/lanes/c/PASSPHRASE-NORMALIZE-AUTHOR-REPORT.md` (new) | no | yes |

  Three pinned files, each one necessary, none touched beyond need. Nothing in
  `rebuild/lanes/b/tooling/**`, no `packages/*.json`, no receipt, no acceptance
  artifact. These go red against the S8 byte pins by design and are minted by the
  S9 tooling round, not here. I agree with the author's report section 7b list
  and add nothing to it.
* **The copy says the true thing and carries no dash.**
  `wordsHelp: 'You can type them with spaces or with hyphens, and capitals do not matter.'`
  Every clause is true and executed: spaces (C-PN-14, my P2, my P3), hyphens
  (the regression case), capitals (C-PN-15, P2, P3). Plain words, a hyphen in
  "hyphens" and nothing else. It is painted beside the box, before the refusal,
  which is the only moment it can save a refusal. C-PN-17 pins that no COPY value
  carries an en or em dash. The input's `autocapitalize`, `autocorrect`,
  `autocomplete` and `spellcheck` all stay off (C-PN-18). I agree with all of it.

---

## THE BAR, RE-RUN BY ME, WHOLE

`MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`, each on its own line of
the runner script, on this tip.

| group | exit | tests | pass | fail |
|---|---|---|---|---|
| lane C cells (helper, unlock-forms, route) | **1** | 18 | 17 | **1** |
| import corpus (`w7-preview/import/test`, 5 files) | 0 | 35 | 35 | 0 |
| `rebuild/m4/import` children (7 files) | 0 | 90 | 90 | 0 |
| w6 local-source-admission + consumer + local-import + host-seams | 0 | 57 | 57 | 0 |
| port seal tests (`port`, `seal`, `port-harden`) | 0 | 65 | 65 | 0 |
| import-retract + p3-real-shape + p3-port-fix | 0 | 104 | 104 | 0 |
| today + measure suite (17 files) | 0 | **682** | 682 | 0 |

Total 1051 tests, 1050 pass, 1 fail. The single failure is B1 and nothing else.
The import corpus at 35 and the `m4/import` children at 90 match the ticket's
expected counts exactly.

**The today suite is 682, not the 661 the ticket states.** The author flagged
this as his open question 4 and he is right: the ticket's number is stale and did
not move under this change. I measured 682 pass, 0 fail.

The lane C cells were re-run three further times after the bar; results in B1.
The today-17 measure journey, the lane's known residual flake, did not flake in
this run.

---

## NOTES, not blocking

### N1. Invisible characters refuse, and the refusal is undiagnosable

The fold handles every VISIBLE separator. It does not handle the Unicode format
characters a paste from a message app can carry, because none of them is in
`\s` and NFKD does not remove them. Measured:

    ZERO WIDTH SPACE U+200B between words -> refuses (folds to ONE word)
    WORD JOINER U+2060 between words      -> refuses (folds to ONE word)
    SOFT HYPHEN U+00AD between words      -> refuses (folds to ONE word)
    LEFT-TO-RIGHT MARK U+200E at the ends -> refuses (six words, both marked)
    RIGHT-TO-LEFT MARK U+200F between     -> refuses (six words, all marked)

This fails CLOSED, so it is not a security finding, and it is outside the
separator class the ticket enumerated. It is worth saying anyway because it is
the same SHAPE of defect this lane exists to kill: the screen looks right, the
words look right, and the file refuses. Note that the RLM and LRM cases still
count as six words, so even the word-count pre-check of section 7a would not
catch them. If the father is ever told his words over a messaging app rather than
reading them off paper, this is the next refusal. The remedy is one character
class: strip `\p{Cf}` (format characters) after NFKD. I did not treat this as
blocking because the named user types off paper from the PC, where none of these
characters can be produced.

### N2. `PASSPHRASE_SEPARATORS` is exported with the `g` flag

`const PASSPHRASE_SEPARATORS = /[\s\u2010-\u2015\u2212_,.-]+/gu;` is module-level,
mutable state (`lastIndex`), and it is exported. `String.replace` resets
`lastIndex`, so the helper itself is correct and I found no misuse today: the only
consumer, `helper.test.mjs:140`, reads the export NAME and never calls the regex.
But a future caller doing `PASSPHRASE_SEPARATORS.test(x)` would get alternating
answers on identical input, on the import path. Dropping the `g` from the exported
copy, or exporting the class as a string, removes the trap. Not blocking because
nothing today walks into it.

### N3. `passphraseWordCount` is exported product code that nothing calls

Consistent with the decision in report section 7a not to wire the pre-check, and
the cells do exercise it, so it is documented rather than dead. Worth one line in
the S9 notes so it is not mistaken later for a check that is running.

### N4. `rebuild/m3/setup/port/README.md:191` is now stale

It still says the passphrase "is NFKD-normalised before it is used", which was the
whole description of the import-side fold and is no longer the whole of it. Not in
scope, not touched by this branch, and the README is not pinned. Someone should
fold one sentence into it.

### N5. The `.cjs` helper entering the phone bundle

`import-bundle.mjs` is ESM and imports a `.cjs` file. This works, and there is
precedent already in the graph (`rebuild/m4/workout/legacy-order-mapping.cjs`,
B-LOM's), and the page bundler admitted it: `page-bundle.test.mjs` builds both
the admission graph and A1 green, and my own boot of the shipped page through the
route cells renders and unlocks. I looked for a problem here and did not find
one. Recorded because it is the kind of thing that is easy to assume and worth
having been checked.

### N6. I agree with report section 7c, the one place the author invited dissent

Two integers in a pinned, execution-pinned cell were re-measured, in a file whose
own assertion messages say "re-measure and say so", with a paragraph beside each
saying what moved and why. I re-ran that file and it is green, and the checks
that would have caught a helper smuggled into the ROUTE rather than the boot
graph - `ROUTE_MODULES.length === 19` and P3-B4's name-for-name `deepEqual` -
both still pass untouched. Nothing was weakened, removed or made conditional.
Leaving two knowingly-wrong integers red for the S9 integrator would have been
the worse choice. I would not overrule him.

---

## THE CI LINE

I ran exactly this and it is what the cells need. The author's line is correct
and I reproduce it unchanged, for the S9 integrator:

      - name: C - the six words in every form the athlete can type them
        run: node --test rebuild/lanes/c/passphrase-normalize/helper.test.mjs rebuild/lanes/c/passphrase-normalize/unlock-forms.test.mjs rebuild/lanes/c/passphrase-normalize/route.test.mjs

It needs the job's `MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York`, each
set on its own line. **Do not add this step until B1 is fixed**, or the workflow
inherits a 1-in-17 false red that accuses the import screen of leaking a word.

---

## OPEN QUESTIONS FOR THE PM

1. **B1 is the only thing standing between this and ACCEPT.** Two one-line
   changes in two unpinned, lane-owned cells. It needs an author pass and an
   R2 that re-runs the lane step several times, not once.
2. **N1: do we want `\p{Cf}` stripped as well?** It is one character class and it
   closes the last "it looks right and it refuses" case. My read is that it
   belongs in a follow-on and not in this lane, because it widens the accepted
   set and the accepted set is the thing this ticket is careful about.
3. **The ticket's today-suite number, 661, is stale.** It is 682 on this tip and
   it did not move under this change. Whoever maintains the bar text should
   correct it.
4. **`rebuild/m3/w6/test/local-import.test.mjs` is run by no workflow** and it is
   the suite that pins the phone's five seal constants against `unseal.cjs`. It
   passes here as part of my group 4. The author raised this and he is right that
   somebody should name it in a CI step. On this ticket in particular, that file
   is the guard that would catch the phone decoder drifting from the PC's seal
   contract, which is the class of defect this lane just fixed.
5. **Nobody has typed the real six words into the real phone.** Everything above
   is synthetic, sealed by the real `port.cjs` with passphrases the port minted
   seconds earlier. The owner's bundle was never read, `C:\Users\joeym\EarnedPort`
   was never opened, and no real measurement entered this session. Before the
   father imports, somebody should do the real thing once, on the real file, with
   the owner watching.
