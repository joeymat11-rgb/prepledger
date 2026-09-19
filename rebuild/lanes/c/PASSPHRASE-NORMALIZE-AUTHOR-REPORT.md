# PASSPHRASE-NORMALIZE (lane C) - author report

**Branch** `rebuild/c-passphrase-normalize`, cut from the chain tip `9e1ece8`.
**Ticket** DECISIONS:520, the defect noted on the owner's own retry of 2026-09-17.
**Role** author. This report is a HYPOTHESIS. The reviewer is asked to disagree
wherever the evidence lets them, and in particular on section 7.

## 1. The defect, and the one sentence that fixes it

`port.cjs makePassphrase()` (:186) draws six words out of `wordlist.cjs` and
joins them with hyphens. That hyphen-joined string is what the PC prints on the
piece of paper. The phone derived the key from the TYPED string after NFKD and
nothing else (`import-bundle.mjs` deriveKey, and its Node twin `unseal.cjs`
deriveKey), while the screen said only "Type the six words from the PC". The
owner typed six words the way anybody types six words, with spaces, and his own
file answered BUNDLE_AUTH_FAILED. His father imports next.

The fix is one pure helper, stated once and read by both decoders:

    rebuild/m3/setup/port/passphrase.cjs  normalisePassphrase(typed)
      NFKD  ->  lower case  ->  every run of [whitespace, hyphen-minus,
      U+2010 to U+2015, U+2212, underscore, comma, full stop] becomes ONE
      hyphen-minus  ->  leading and trailing runs dropped  ->  NFKD again

The last NFKD is not decoration: lower-casing an NFKD string is not guaranteed
to leave it NFKD, and the derive sites hand the result straight to PBKDF2. On
this ASCII wordlist it is a no-op, which is exactly why it is safe.

## 2. Where it is applied, and where it deliberately is NOT

Applied at the two places a TYPED passphrase becomes key material on the way IN:

* `rebuild/m3/setup/port/unseal.cjs` `unseal()` - the Node reference decoder.
* `rebuild/m3/w6/local/import-bundle.mjs` `unsealBundle()` - the phone, on
  WebCrypto. `importBundle()` reaches the same call, so the screen's second
  pass through the words (identityYes) is covered by the same line.

NOT applied inside `deriveKey`. `port.cjs seal()` (:195) calls `unseal.cjs`'s
exported `deriveKey`, so a fold there would have changed what every FUTURE
bundle is sealed with, and the question "does a bundle sealed before the change
open after it" would stop having one answer. `deriveKey` is byte for byte what
it was: NFKD and nothing else. Cell C-PN-12 measures that against the
pre-change definition, for the canonical form and for three non-canonical ones.

So: the sealing side, the KDF, the iteration count, the salt handling and the
wordlist are untouched, and every bundle already sealed (the owner's own among
them) stays valid.

## 3. Every touched path, with its S8 pin status

Checked against `rebuild/m4/spec/acceptance-s8-real-shape.json` before the first
edit and again before the commit, by a script that asks `product` and
`executionPins` for the exact path.

| path | pin status | why it moved |
| --- | --- | --- |
| `rebuild/m3/setup/port/passphrase.cjs` | NOT pinned (new file) | the one canonical form |
| `rebuild/m3/setup/port/unseal.cjs` | NOT pinned | reads the helper; folds at `unseal()` |
| `rebuild/m3/w6/local/import-bundle.mjs` | **PINNED** `product`, role `carried` | reads the helper; folds at `unsealBundle()` |
| `rebuild/m3/w7-preview/import/import-screen.mjs` | **PINNED** `product`, role `edited` | `COPY.wordsHelp` plus one line in `wordsStep` |
| `rebuild/m3/w7-preview/import/test/page-bundle.test.mjs` | **PINNED** `product` role `edited`, AND an `executionPin` | two measured module counts re-measured; section 7 |
| `rebuild/lanes/c/passphrase-normalize/*.mjs` (3 new) | NOT pinned | the cells |
| `rebuild/lanes/c/PASSPHRASE-NORMALIZE-AUTHOR-REPORT.md` | NOT pinned | this file |

`rebuild/m3/setup/port/port.cjs` and `wordlist.cjs` are NOT pinned and are NOT
touched. No `rebuild/lanes/b/tooling/**`, no `packages/*.json`, no receipt and
no acceptance artifact is touched. The licence is minted by the S9 tooling
round, not here.

    git diff --numstat 9e1ece8..HEAD -- rebuild/engine rebuild/coach rebuild/DECISIONS.md
    (empty)

Zero U+2013 and zero U+2014 characters were added: every dash in a class, a
constant or a test is written `‐` to `―`, `−`. Audited by
counting the two code points in every file this lane authored: 0 and 0.

## 4. Red first

The three cells were written and run against the UNCHANGED product before the
helper existed. Log `%TEMP%\c-red.log`, exit 1.

* `helper.test.mjs` - did not load at all: `Cannot find module
  '../../../m3/setup/port/passphrase.cjs'`. Seven cells, none of which could run,
  because the thing they are about did not exist.
* `unlock-forms.test.mjs` - the same, for the same reason.
* `route.test.mjs` - loaded and ran: **7 counted, 2 pass, 5 fail**.
  * C-PN-14 FAILED with `{ code: 'BUNDLE_AUTH_FAILED', detail: null }` where
    `null` was expected. That is the owner's 2026-09-17 refusal, reproduced at
    route level on the shipped page, from his own six words typed with spaces.
  * C-PN-15 FAILED on capitals (`caps was refused by the screen`).
  * C-PN-17 FAILED: `the words step has no helper sentence`.
  * C-PN-16 and C-PN-18 PASSED red, and that is the point: the wrong-word
    refusal and the keyboard-helper attributes were already right, so the change
    must not move them.

## 5. THE BAR, with counts

All on the owner's PC, `MEASURED_TEST_NOW=2026-09-03`, `TZ=America/New_York`,
each variable set on its own line. Node
`C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`.

| suite | counted | pass | fail |
| --- | --- | --- | --- |
| `rebuild/lanes/c/passphrase-normalize/` (this lane, 3 files) | 18 | 18 | 0 |
| the import corpus, `w7-preview/import/test/` (5 files) | 35 | 35 | 0 |
| `rebuild/m4/import/test/` (7 files) | 90 | 90 | 0 |
| `w6/test/local-source-admission` + `local-source-consumer` | 26 | 26 | 0 |
| `w6/test/local-import.test.mjs` (the seal-contract suite) | 22 | 22 | 0 |
| `lanes/d/import-retract/retract.test.mjs` | 13 | 13 | 0 |
| `lanes/d/p3-port-fix/` (3 files) | 35 | 35 | 0 |
| `lanes/d/p3-real-shape/` (6) + `p3-layout-v2/` (2) | 62 | 62 | 0 |
| the today suite + measure (17 files, CI line 232) | 682 | 682 | 0 |
| **total** | **983** | **983** | **0** |

Notes on the numbers.

* The today suite is **682** on this tip, not the 661 the ticket quoted. It was
  682 before this change too: nothing here moved it.
* The import corpus was **33 of 35** on the first run, failing the two module
  counts in `page-bundle.test.mjs`. It is 35 of 35 after those two counts were
  re-measured; see section 7.
* `w6/test/local-import.test.mjs` is in the bar because it imports `unseal.cjs`
  and pins the five seal constants against `import-bundle.mjs`. **No workflow
  runs it.** That is not a finding of this lane, but the PM should know.
* No suite was re-run to get a green: every figure above is a first run, except
  the import corpus, which was run twice for the reason just given.

## 6. The security reasoning, and the collision finding

The entropy is the six draws, not the punctuation. `wordlist.cjs` holds **2048**
words, so six words with replacement is `log2(2048) * 6 = 66.000` bits exactly.
The fold removes none of it: it maps separator and case variants of ONE draw
onto the single form the PC already wrote, and it does not merge two draws.

**Can two DIFFERENT valid passphrases collide after normalisation? No.** Cell
C-PN-7 proves it on the list itself rather than asserting it here:

* 2048 words, **0 duplicates**.
* **0 words contain a separator character** (the whole class: Unicode
  whitespace, `-`, U+2010 to U+2015, U+2212, `_`, `,`, `.`). So the canonical
  hyphen-joined string re-splits into the same six words it was built from, and
  two different draws cannot spell one string.
* Every word is already its own canonical form, and **no two words fold
  together** under NFKD plus lower case: 2048 words to 2048 distinct folded
  words. (Every word also matches `^[a-z]+$` and is NFKD-stable, which is the
  belt to that braces.)

What the change DOES widen is the set of typed STRINGS that open one bundle: any
separator run and any casing. An attacker who was going to guess the six words
gains nothing from that, because they would type the canonical form anyway; the
work factor is still 2^66 draws times 600000 PBKDF2 rounds. What is NOT widened:
the words, their spelling, their accents and their ORDER. C-PN-3 executes
exactly that, including a control that an accented spelling stays a DIFFERENT
string after the fold, so this is normalisation and not ASCII-folding.

Refusals say nothing new. Both decoders still raise the one code
`BUNDLE_AUTH_FAILED` with the message equal to the code, no `field`, no index
and no number, for five words, seven words, the right words in the wrong order,
one wrong word, an empty string and separators only (C-PN-11, C-PN-13). The
screen still prints its one honest sentence and never prints a word (C-PN-16).

## 7. The pre-check decision, and the one pinned cell this lane re-measured

### 7a. The "that is not six words" pre-check: NOT TAKEN. Reasons, and the
counter-argument.

The ticket allows a pre-check before the expensive derive only if it leaks
nothing about WHICH word is wrong. A count does not leak: the wordlist is
public, the screen already prints "the six words", and the count is computed
from what the athlete typed on his own phone, not from the bundle. The helper
exports `passphraseWordCount()` and C-PN-4 proves it, so the check is one line
away. It is not wired in, for three reasons:

1. **It buys almost nothing now.** After this change the only way to reach it
   is a real mis-transcription, and the screen's existing sentence, "That
   passphrase or file did not unlock. Check the six words and the file.", is
   already the right instruction for that. The saving is roughly one second of
   PBKDF2, once, on one screen.
2. **It costs a new user-facing refusal code** in a vocabulary the admission
   machinery owns, on an S8-pinned screen, on the owner's data path, days before
   his father imports. A code no machinery raises is a surface the route's
   refusal cells, the code-line rendering and the S9 reseal all have to carry.
3. **The screen already says the thing that prevents the mistake** (section 8's
   copy). Adding a second, later message for the same mistake is two places to
   keep true.

The counter-argument the reviewer should weigh: the father is 70-odd and will
type this once off paper; "that is five words" is a kinder answer than "did not
unlock", and it is free of leak. If the PM wants it, the change is
`if (passphraseWordCount(words) !== 6) return fail('IMPORT_PASSPHRASE_WORD_COUNT')`
at the top of `unlock()` plus one COPY line, and it belongs in the SCREEN and
never in a decoder, so the decoders keep their one-code law.

### 7b. Byte-pin cells that go red BY DESIGN, listed and not edited

This lane rides the S9 reseal (precedent DECISIONS:508 to :510), so the S8
`product` byte pins over the files it edits will not verify until S9 reseals:

* `rebuild/m3/w6/local/import-bundle.mjs` (`role: carried`, pre == post)
* `rebuild/m3/w7-preview/import/import-screen.mjs` (`role: edited`)
* `rebuild/m3/w7-preview/import/test/page-bundle.test.mjs` (`role: edited`,
  also an `executionPin`)

Nothing in `rebuild/lanes/b/tooling/**`, no `packages/*.json`, no receipt and no
acceptance artifact was opened or changed. `b-package.cjs --full` was not run.

### 7c. The ONE measurement this lane re-measured, and why that is not a loosening

`page-bundle.test.mjs` failed TWO assertions on the first bar run, and both of
them say, in the file's own words, **"re-measure and say so"**. The graph grew
by exactly one module, the shared helper:

    the Import graph is 143 modules, not the measured 142 ... re-measure and say so
    the delta is 21 modules, not the measured 20 ... re-measure and say so

That file carries five prior tickets that each moved the number and wrote the
reason beside it rather than editing it quietly; this is the sixth, written the
same way. **No assertion was weakened, removed or made conditional**: two
measured integers were re-measured and two paragraphs explain what moved.

The fact worth keeping is in those paragraphs. `passphrase.cjs` lands on the
**BOOT** side, not in the route: `import-bundle.mjs` is reached from
`local-client.mjs`, which `today-bindings.mjs` reaches on boot. So the Today
boot graph goes 122 to 123 and the ROUTE-ONLY set is **unmoved at 19** - P3-B4's
name-for-name `deepEqual` and `ROUTE_MODULES.length === 19` both still pass
untouched, which is the check that would have caught a helper smuggled into the
route. This is the second ticket after B-LOM to move the boot graph.

**The reviewer should disagree here if they can.** The alternative was to leave
those two counts red for the S9 integrator. I judged a re-measurement written in
the file's own convention to be the honest move and a red CI to be the dishonest
one, but it IS an edit to a pinned, execution-pinned cell, and the PM can revert
the two integers and hand them to S9 if they read it the other way.

## 8. The copy

`.github/workflows/rebuild.yml` was NOT touched: another lane is editing it and
the S9 integrator adds the step. The copy that changed is one new COPY key and
one line in `wordsStep`, beside the box he types into rather than under a
refusal, because that is the only moment it can save him one:

    wordsLabel: 'Type the six words from the PC'            (unchanged)
    wordsHelp:  'You can type them with spaces or with hyphens, and capitals
                 do not matter.'

Plain words, no dashes, three facts and no more: the separator, the other
separator, and the capital the phone keyboard puts on the first word whether he
wants it or not. The input's own helpers stay off - `autocapitalize`,
`autocorrect`, `autocomplete` and `spellcheck` are all still off (C-PN-18) -
because the right posture is to ask the keyboard not to interfere AND to survive
it when it does anyway.

## 9. THE CI LINE

Add this step to `.github/workflows/rebuild.yml`, beside the other lane steps,
named by exact path and never globbed:

      - name: C - the six words in every form the athlete can type them
        run: node --test rebuild/lanes/c/passphrase-normalize/helper.test.mjs rebuild/lanes/c/passphrase-normalize/unlock-forms.test.mjs rebuild/lanes/c/passphrase-normalize/route.test.mjs

It needs the job's existing `MEASURED_TEST_NOW=2026-09-03` and
`TZ=America/New_York`. `unlock-forms.test.mjs` and `route.test.mjs` each seal
ONE bundle through the real `port.cjs`, which is the same cost the import corpus
already pays; `helper.test.mjs` seals nothing and costs milliseconds.

## 10. Open questions for the PM

1. **The pre-check (7a).** Not taken. If you want "that is five words", say so
   and it is one line plus one sentence of copy, in the screen only.
2. **7c is the one place to overrule me.** Two integers in a pinned,
   execution-pinned cell were re-measured rather than left red for S9.
3. **`w6/test/local-import.test.mjs` is run by no workflow** and it is the suite
   that pins the phone's five seal constants against `unseal.cjs`. It passes
   here, 22 of 22. It should be named in a CI step by somebody.
4. **The today suite is 682 on this tip, not 661.** Somebody's bar text is
   stale; the number did not move under this change.
5. **The worktree's `node_modules` junctions were dangling** when this lane
   started: `%TEMP%\earned-passphrase\node_modules`, `rebuild/m3/w5/node_modules`
   and `rebuild/m3/w6/node_modules` all pointed through
   `%TEMP%\earned-realshape` at `%TEMP%\earned-ci`, which no longer exists, so
   nothing that needs `@noble/hashes` or `fake-indexeddb` could run. I repointed
   the three links at the same sources the newest worktree uses
   (`prepledger-dev\node_modules`, `work\m3-w5-r1\...\w5\node_modules`,
   `work\m3-w6-browser-bridge\...\w6\node_modules`). Nothing was installed and
   no package was changed. Other lanes cut from `earned-realshape` will have the
   same dead links.
6. **Nobody has typed the real six words into the real phone since the change.**
   Everything above is synthetic, sealed by the real `port.cjs` with passphrases
   the port itself minted one second earlier. The owner's bundle was never read
   and `C:\Users\joeym\EarnedPort` was never opened.
