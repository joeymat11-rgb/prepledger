# PASSPHRASE-NORMALIZE - INDEPENDENT REVIEW R2

Reviewer: cowork (Earned lane hand), security-minded, told to disagree. Second
round, a different reviewer from R1.
Head reviewed: `3cd05e3537b57268eb8cc588eec42793cb041eb0`, branch
`rebuild/c-passphrase-normalize`, base `9e1ece8`.
Worktree: `%TEMP%\earned-passphrase`. Scratch worktree for the red-first proof:
`%TEMP%\crev2-base`, detached at `9e1ece8`, removed at the end.

Method, in this order: the whole diff `9e1ece8..HEAD` was read first and a view
formed from it; then my own probes were written and run; then review R1 was
read; then the fix-round commit and the author report. Every number below was
measured on this PC by me. Where I repeat a figure R1 or the author states, I
say so and I state my own measurement beside it.

## VERDICT: ACCEPT WITH NOTES

R1's one blocking item is FIXED, and fixed in the way that matters: by
construction, not by a re-run. I reproduced the defect it named, reproduced its
probability from the wordlist, ran the replacement cells against the mutation
the author claims they catch, and ran the OLD cell against the same mutation to
check the claim that the replacement is strictly stronger. It is.

I attacked the product change again from scratch and could not break it. No
collision exists, no second derive path exists, the sealing side and the KDF are
byte for byte unmoved, and a bundle sealed by the PRE-CHANGE tool still opens.

## BLOCKING

None.

## 1. R1's findings, one by one

### B1 (BLOCKING in R1, two lane cells with a 1-in-17 false red) - FIXED

**The defect R1 named is real, and I measured it myself before reading either
document.** I rendered the refused Import screen and asked the wordlist which of
its 2048 words are substrings of that page:

    WORDLIST WORDS THAT ARE SUBSTRINGS OF THE REFUSED PAGE = 17
    can capital earn file hat hen history lock matter pass phrase six space
    story type unlock word
    JSON KEY NAMES THAT ARE WORDLIST WORDS = message code field detail (all four)
    OLD C-PN-16 false red per run = 4.88%
    OLD C-PN-13 false red per run = 1.17%
    OLD either, per CI run of the lane step = 5.99%

R1 measured 4.87 / 1.16 / 5.97 by Monte Carlo; I computed mine closed-form from
the counts (`1 - (1 - k/2048)^6`) on a page I rendered in this session. The two
agree. `space`, `capital` and `matter` are in that prose because of the helper
sentence this lane added, so the lane did make its own cell flakier. R1 was
right to block on it rather than note it.

**The replacements are not a loosening, and I checked that by mutation rather
than by reading.** I broke the product deliberately: in `wordsStep` I made the
helper paragraph print the FIRST CHARACTER of what was typed
(`COPY.wordsHelp + String(words).slice(0, 1)`), which is a one-character leak of
the passphrase onto the refused screen.

| cell run against that mutation | result |
| --- | --- |
| the NEW C-PN-16 (`3cd05e3`) | **RED**: "the refused screen is not the same screen for two different wrong passphrases", diff showing `...do not matter.z` against `...do not matter.r` |
| the OLD C-PN-16 (verbatim from `c6b3945`) | **GREEN, 1 of 1, exit 0** |

I took the old cell from the reviewed commit, ran it as a scratch file beside
the lane against the same mutated tree, and it passed. So the cell R1 reviewed
was blind to a leak of one character of the owner's passphrase, and its
replacement is not. That is the author's central claim in section 11 and it
holds when an independent hand runs it. `import-screen.mjs` was restored with
`git checkout --` immediately after; sha256 before and after are identical
(`50da6910761b5cec...`), the scratch cell was deleted, and `git status` is clean.

**And the lottery is gone by construction.** Measured, not argued: the six probe
words the new cells scan for (`zzzzzz`, `qqqqqq`, `xxxxxx`, `wwwwww`, `vvvvvv`,
`uuuuuu`) are not in the wordlist and are not substrings of any word in it; the
refusal surface the new C-PN-13 searches
(`BUNDLE_AUTH_FAILED BUNDLE_AUTH_FAILED`) contains no wordlist word and no
lower-case letter at all, and every wordlist word is `^[a-z]+$`. There is no
random input left in either assertion.

**Corroboration, not proof.** Nine consecutive runs of the lane step on this tip
(the bar's own run plus eight more), each with a passphrase the real `port.cjs`
minted seconds earlier: 20 of 20, exit 0, every time. At the old 5.99% those
nine runs would have shown a red about 43% of the time. I agree with the author
that the argument from construction is the load-bearing one.

### N1 (invisible format characters refuse) - DISPUTE UPHELD, and better than before

Not taken, and I agree with not taking it. It fails CLOSED, so it is not a
security finding; it widens the accepted set, and the accepted set is the one
thing this ticket is careful about; and the widening deserves its own red-first
round and its own review. What changed is that the behaviour is now MEASURED
(C-PN-20) rather than unstated, including the part that matters most for the
follow-on: the directional-mark form is still SIX words, so the word-count
pre-check of section 7a would not catch it either. I reproduced the behaviour on
a real sealed bundle: ZWSP-glued and RLM-marked forms both refuse,
BUNDLE_AUTH_FAILED, on both decoders. Still open to the PM as R1's question 2.

### N2 (the exported separator class carried the `g` flag) - FIXED, red first

Measured on this tip:

    EXPORTS                    PASSPHRASE_SEPARATORS, normalisePassphrase, passphraseWordCount
    EXPORTED_CLASS_FLAGS       "u"        (was "gu")
    REPEATED .test() ON ONE INPUT   true, true, true, true
    lastIndex AFTER            0

The fold keeps a module-private global copy built from the same `source`, so the
class is still written once and still written as escapes, and C-PN-5 (which pins
that the helper carries this lane's stated class) still passes untouched. I
checked the fold is unchanged by this: every accepted form in my own probe table
below still folds to the PC's form.

One residual, and it is fine: `ENDS = /^-+|-+$/g` is still a module-level global
regex. It is private and it is only ever used with `String.replace`, which
resets `lastIndex` on entry and exit, so the trap class N2 named is closed.

### N3 (`passphraseWordCount` is exported and nothing calls it) - FIXED as asked

One line in the S9 notes (report section 12). I confirmed by `git grep` that no
product path calls it; only the cells do. It is the pre-check of 7a, one line
away if the PM wants it.

### N4 (`port/README.md:191` was stale) - FIXED

The README is not pinned in the S8 shape (I checked). The stale sentence is left
standing and corrected underneath, which is that file's convention. The
correction is accurate against the code: NFKD alone on the sealing side, the
fold at the import entries, and an instruction to whoever builds a third decoder
to read the helper rather than re-implement it.

### N5 (a `.cjs` helper entering the phone bundle) - AGREED, and stronger than R1 put it

R1 found one precedent. There are dozens: `source-admission.mjs`, which the page
bundle reaches, statically imports about twenty-five `.cjs` modules
(`ops.cjs`, `food-commands.cjs`, `capture.cjs`, `engine-runtime-host.cjs` and
the rest), and the page is built with esbuild, which resolves CommonJS. A `.cjs`
leaf with `module.exports` is the ordinary case in this tree, not a novelty.
Nothing to do.

### N6 (7c, the two re-measured integers in a pinned, execution-pinned cell) - AGREED

I re-ran `page-bundle.test.mjs` and the whole import corpus: 35 of 35. The two
checks that would catch a helper smuggled into the ROUTE rather than the boot
graph, `ROUTE_MODULES.length === 19` and P3-B4's name-for-name `deepEqual`, pass
untouched. Two integers in a file whose own assertion messages say "re-measure
and say so" were re-measured, with a paragraph beside each. Nothing was
weakened, removed or made conditional. Like R1, I would not overrule the author,
and like R1 I leave it flagged for the PM as the one judgement call in the lane.

---

## 2. WHAT I TRIED TO BREAK, INDEPENDENTLY OF R1

Every probe below was written by me and run on this PC. I did not read R1's
probe section until mine had run.

### P1. Two DIFFERENT valid passphrases that normalise to one string: NONE EXIST

Measured on `wordlist.cjs` and on the helper, not on the author's cell:

    WORDLIST_LEN              2048        WORDLIST_UNIQUE          2048
    NOT_LOWER_ASCII           []          WORDS_WITH_SEPARATOR     []
    WORDS_WITH_FORMAT_CHAR    []          WORDS_MOVED_BY_FOLD      []
    WORDS_MOVED_BY_NFKD       []          FOLD_COLLISIONS          []

No word contains a character in the separator class, so the hyphen-joined form
re-splits uniquely; the fold is the identity on every word, so it is injective
over the list; the join is therefore injective over six-word draws. By
execution as well as by argument: 200000 random six-word draws typed with
spaces, and

    DRAWS_THAT_DID_NOT_ROUND_TRIP        0
    DISTINCT CANONICALS IN 60000 DRAWS   60000

Entropy `log2(2048) * 6 = 66` bits, unchanged; work factor 600000 PBKDF2-SHA256
rounds, unchanged. The change widens the set of typed STRINGS that reach one
canonical form; it does not widen the set of canonical forms, which is what an
attacker has to guess.

**The specific trick the ticket named, a word that is two other words joined,
exists in this list and is harmless.** There are at least eleven:
`artwork = art + work`, `bargain = bar + gain`, `carpet = car + pet`,
`cupboard = cup + board`, `kitten = kit + ten`, `lawsuit = law + suit`,
`legend = leg + end`, `manage = man + age`, `network = net + work`,
`office = off + ice`, `runway = run + way`. It cannot produce a collision,
because a separator never VANISHES under this fold: a run of separators becomes
exactly one hyphen, so `art work` folds to `art-work` and can never reach
`artwork`. I verified that on the fold itself, not only on paper.

### P2. The Unicode surface, including the tricks NFKD can play

A sweep of every code point from U+0020 to U+2FFFF, asking what NFKD does:

    CHARS THAT BECOME A SEPARATOR ONLY AFTER NFKD   109
      (U+00A8, U+00AF, U+00B4, U+02D8 ... U+FF0D, U+FE63)
    CHARS THAT EXPAND INTO TWO OR MORE LETTERS      136
      (U+0132 -> ij, U+01C7 -> lj, U+01CA -> nj, the ligatures ...)

Neither can create a collision. The expansions land on strings that are not
wordlist words (P1 shows every word is already its own NFKD-and-lower-case
image), and the separator expansions only ever make a typed string reach a
canonical form it was already trying to reach. Note that the order in the helper
is NFKD FIRST and the fold second, which is what makes U+00A0, U+FF0D and U+FE63
work at all; reversing it would break them.

A 60000-string fuzz over a deliberately nasty alphabet (NBSP, ZWSP, soft hyphen,
directional marks, BOM, U+0130, U+1E9E, U+212A, the ligatures, U+2028, U+2029,
combining marks, the whole separator class):

    FUZZ_NOT_IDEMPOTENT      0        FUZZ_OUTPUT_NOT_NFKD     0

The output is always NFKD-stable, which matters because the derive sites hand it
straight to PBKDF2, and the fold is idempotent, which matters because it is the
property that lets a second code path apply it without moving the key.

### P3. RED FIRST, on the PRODUCT, and an already-sealed bundle

I created my own scratch worktree at `9e1ece8`, generated one synthetic legacy
state through the lane's own harness, and sealed it by spawning the **BASE
tree's** `port.cjs` (status 0, six words, hyphen-joined). I then opened THOSE
BYTES with three decoders: base `unseal.cjs`, head `unseal.cjs`, and the phone's
`import-bundle.mjs`.

| typed form | BASE (before) | HEAD | PHONE |
| --- | --- | --- | --- |
| hyphen form the PC wrote | OPENED | OPENED | OPENED |
| SPACES (what the owner typed) | **REFUSED** | OPENED | OPENED |
| CAPITALS with hyphens | **REFUSED** | OPENED | OPENED |
| autocapitalised with spaces | **REFUSED** | OPENED | OPENED |
| NBSP | **REFUSED** | OPENED | OPENED |
| en dash U+2013 | **REFUSED** | OPENED | OPENED |
| em dash U+2014 | **REFUSED** | OPENED | OPENED |
| minus sign U+2212 | **REFUSED** | OPENED | OPENED |
| fullwidth hyphen U+FF0D | OPENED | OPENED | OPENED |
| leading and trailing space | **REFUSED** | OPENED | OPENED |
| doubled separators | **REFUSED** | OPENED | OPENED |
| underscores | **REFUSED** | OPENED | OPENED |
| commas | **REFUSED** | OPENED | OPENED |
| ZWSP between words | REFUSED | REFUSED | REFUSED |
| RLM at the ends | REFUSED | REFUSED | REFUSED |
| five words | REFUSED | REFUSED | REFUSED |
| seven words | REFUSED | REFUSED | REFUSED |
| right words, wrong order | REFUSED | REFUSED | REFUSED |
| one wrong word | REFUSED | REFUSED | REFUSED |
| empty | REFUSED | REFUSED | REFUSED |
| separators only | REFUSED | REFUSED | REFUSED |

Every refusal above is `BUNDLE_AUTH_FAILED` with the message equal to the code,
on all three decoders, with no field, no index and no number. That single table
is the owner's 2026-09-17 refusal reproduced on the unchanged product, the
red-first proof taken on the PRODUCT rather than on the cells, and the answer to
"does a bundle sealed before the change still open after it": yes, and by the
hyphen form as well as by the new ones.

The one row worth a second look is U+FF0D, which opened at BASE too: NFKD alone
already turned the fullwidth hyphen into a hyphen-minus. That is not a change,
it is what the base already did.

### P4. The sealing side and the KDF: NOT MOVED

`port.cjs` is not in the diff at all, and `makePassphrase()` (:186) still joins
six `randomInt`-drawn words with hyphens, with no way to supply a passphrase of
your own from the CLI. `seal()` (:192) calls `deriveKey` imported from
`unseal.cjs`, and `deriveKey` is byte for byte unchanged: the diff to
`unseal.cjs` is one `require` and one call site inside `unseal()`. Measured
across the two trees rather than read:

    DERIVEKEY PHRASES THAT MOVED (5 phrases, base vs head)   0
    KDF BASE  {PBKDF2, SHA-256, 600000, salt 16, key 256}
    KDF HEAD  {PBKDF2, SHA-256, 600000, salt 16, key 256}

And from the other direction: a bundle sealed by the CHANGED tree still opens
with the UNCHANGED decoder (`HEAD_SEALED_OPENED_BY_BASE_DECODER = OPENED`), and
what the changed tree mints is still the hyphen form. So nobody holding an older
copy of the tool or the phone is stranded either way. No blocking finding.

### P5. A second code path still deriving from the RAW string: NONE

`git grep -E "pbkdf2|deriveBits|deriveKey"` over `rebuild`, ignoring this lane's
own files and the review prose, returns exactly three product sites:
`port.cjs:195` (seal, correctly untouched), `unseal.cjs:85` and
`import-bundle.mjs:321`. Both import-side sites call `normalisePassphrase`
exactly once, at the call site, and neither carries its own separator class or
its own `toLowerCase` (C-PN-6 pins that going forward, and it is the most
valuable cell in the lane).

The SCREEN has two places that hand the typed string onward,
`unsealBundle(bytes, words, ...)` at :403 and
`importBundle(..., { passphrase: words })` at :429. `importBundle` reaches
`unsealBundle`, which is the single derive site in that module, so the identity
step's second pass is folded by the same line. There is no third site and no
browser twin under `w7-preview/import/` (R1 said the same; the ticket's brief
was wrong about where the phone decoder lives).

### P6. A timing or error-message oracle: nothing that leaks the secret

No pre-check was wired in, so there is no new refusal code and no new branch on
the screen. Timed on a real sealed bundle at HEAD, three runs each:

    right words 59/59/58 ms      one wrong word 68/58/60 ms
    first word wrong 71/59/60    five words 66/59/60
    seven words 78/67/59         wrong order 74/59/58
    empty 0/0/0                  separators only 0/0/0

Only one behaviour changed, and R1 found it too: a string that folds to the
empty string now hits `deriveKey`'s existing `!passphrase` guard and skips
PBKDF2, so it refuses in under a millisecond where at base `" - - "` would have
paid the full derive. What an observer learns from that is "you typed no word
characters", which the typist already knows, which is independent of the bundle
and of the six words, and which arrives with the identical code and sentence.
Not a leak. Every wrong-word shape costs the same full derive as the right one.

### P7. A refusal that depends on what was typed: NONE, on either decoder

Three refusals, from three passphrases that share no word (one wrong word; six
nonsense words with spaces; six different nonsense words with hyphens): the
refused screen's rendered text is IDENTICAL character for character across all
three (250 characters), the refusal object is
`{ code: 'BUNDLE_AUTH_FAILED', detail: null }` in every case, and the step stays
`words`. The two decoders' refusal surfaces are identical to each other as well.

### P8. The invisible-character audit the author asks R2 to repeat

I scanned every file this lane authored or edited for every code point outside
printable ASCII, by code point and count, rather than by eye:

    lanes/c/passphrase-normalize/helper.test.mjs      U+00E9 x1  (the cafe control)
    lanes/c/passphrase-normalize/route.test.mjs       pure ASCII
    lanes/c/passphrase-normalize/unlock-forms.test.mjs U+00E9 x1
    m3/setup/port/passphrase.cjs                      pure ASCII
    m3/w7-preview/import/import-screen.mjs            pure ASCII
    m3/w7-preview/import/test/page-bundle.test.mjs    pure ASCII

No literal U+2010 to U+2015, no U+2212, no U+200B, no U+00AD, no BOM anywhere in
the lane's own files. The em dashes that exist in `unseal.cjs`,
`import-bundle.mjs` and `port/README.md` are all on lines this branch did not
write, which I checked line by line over the diff (below).

---

## 3. DID THE FIX ROUND BREAK ANYTHING?

The fix round (`3cd05e3`) touches six files and only one of them is product:
`passphrase.cjs`, which lost the `g` flag on the exported class and gained a
module-private global copy. I looked for what that could break and found
nothing: the fold's behaviour is identical on all 22 forms of P3 and on the
60000-string fuzz of P2, the class is still written once and still as escapes,
and C-PN-5's source pin still matches. `unseal.cjs`, `import-bundle.mjs`,
`import-screen.mjs` and `page-bundle.test.mjs` are byte for byte what R1
reviewed (`git show --stat 3cd05e3` lists neither), so the whole of R1's product
analysis carries over unchanged and I re-ran it anyway.

The two rewritten cells pin MORE than they did: C-PN-13 now fixes the entire
refusal surface of both decoders to one constant and compares two different
wrong passphrases to each other; C-PN-16 now compares two whole rendered
screens. Both are pins a future change can break honestly; neither is a
loosening. The two new cells (C-PN-19, C-PN-20) assert current behaviour and
state, in C-PN-20's own words, that it is not a pin on a defect.

Nothing in the fix round moved a pinned file: the three pinned files of the
lane are exactly the three from round one.

## 4. CONFIRMATIONS THE TICKET ASKED FOR

* **No engine, coach or DECISIONS byte.**
  `git diff --numstat 9e1ece8..HEAD -- rebuild/engine rebuild/coach rebuild/DECISIONS.md`
  is EMPTY. Confirmed.
* **`.github/workflows/rebuild.yml` untouched.**
  `git diff --name-only 9e1ece8..HEAD -- .github` is empty. Confirmed.
* **No literal U+2013 and no U+2014 added.** Scanned every ADDED line of the
  whole branch diff by code point: **1742 added lines, 0 carrying U+2013 or
  U+2014.** Confirmed.
* **Pinned files touched, checked against `rebuild/m4/spec/acceptance-s8-real-shape.json`
  by script (`product` and `executionPins` asked for the exact path):**

| path | pinned | needed |
| --- | --- | --- |
| `rebuild/m3/setup/port/passphrase.cjs` (new) | no | yes, the one canonical form |
| `rebuild/m3/setup/port/unseal.cjs` | no | yes, a derive site |
| `rebuild/m3/setup/port/README.md` | no | yes, N4 |
| `rebuild/m3/w6/local/import-bundle.mjs` | **PINNED** (`product`, carried) | yes, the other derive site |
| `rebuild/m3/w7-preview/import/import-screen.mjs` | **PINNED** (`product`, edited) | yes, the copy |
| `rebuild/m3/w7-preview/import/test/page-bundle.test.mjs` | **PINNED** (`product` edited + `executionPin`) | yes, the module count moved |
| `rebuild/lanes/c/passphrase-normalize/*.test.mjs` (3 new) | no | yes |
| `rebuild/lanes/c/PASSPHRASE-NORMALIZE-*.md` | no | yes |

  Three pinned files, each necessary, none touched beyond need. Nothing in
  `rebuild/lanes/b/tooling/**`, no `packages/*.json`, no receipt, no acceptance
  artifact. `b-package.cjs` was not run at all by me.

* **The byte-pin cells that go red BY DESIGN**, listed by hashing the files
  myself against the pin rather than by trusting the report. All three are
  `product` pins whose `post` matched the base tree exactly and no longer match:

| path | pin `post` | base tree | this tip |
| --- | --- | --- | --- |
| `rebuild/m3/w6/local/import-bundle.mjs` | `565ee5d84ac95c00...` | `565ee5d84ac95c00...` | `6a9432376346e375...` |
| `rebuild/m3/w7-preview/import/import-screen.mjs` | `ea4a178821ffad7f...` | `ea4a178821ffad7f...` | `50da6910761b5cec...` |
| `rebuild/m3/w7-preview/import/test/page-bundle.test.mjs` | `9b56ee6e22001296...` | `9b56ee6e22001296...` | `e7fe36724aef60d9...` |

  The third is also the whole of `executionPins` for that path. `unseal.cjs`,
  `passphrase.cjs`, `README.md` and the lane's own files carry no pin. The
  licence is S9's to mint, not this lane's.

* **The copy says the true thing and carries no dash.**
  `wordsHelp: 'You can type them with spaces or with hyphens, and capitals do not matter.'`
  Each clause is true BY EXECUTION on a bundle sealed by the pre-change tool
  (P3: spaces OPENED, hyphens OPENED, capitals OPENED). It is painted beside the
  box, before the refusal, which is the only moment it can save one. It is plain
  words with one hyphen inside "hyphens". C-PN-17 pins that no COPY value
  carries an en or em dash, and the input's `autocapitalize`, `autocorrect`,
  `autocomplete` and `spellcheck` all stay off (C-PN-18). The sentence is a
  truthful SUBSET: underscores, commas and full stops also work and are not
  advertised, which is the right way round.

## 5. THE BAR, RE-RUN BY ME, WHOLE

`MEASURED_TEST_NOW=2026-09-03` and `TZ=America/New_York`, each on its own line
of the runner script, node
`C:\Users\joeym\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`,
every file named by exact path, nothing globbed.

| group | files | counted | pass | fail |
| --- | --- | --- | --- | --- |
| lane C cells, `rebuild/lanes/c/passphrase-normalize/` | 3 | **20** | 20 | 0 |
| the import corpus, `w7-preview/import/test/` | 5 | 35 | 35 | 0 |
| `rebuild/m4/import/test/` | 7 | 90 | 90 | 0 |
| w6: local-source-admission, local-source-consumer, local-import, host-seams | 4 | 57 | 57 | 0 |
| the port seal suites: port, seal, port-harden | 3 | 65 | 65 | 0 |
| lane D: import-retract, p3-real-shape (6), p3-port-fix (3) | 10 | 104 | 104 | 0 |
| the today suite and measure (CI line 232) | 17 | **682** | 682 | 0 |
| **total** | **49** | **1053** | **1053** | **0** |

Every group is a FIRST run and every group is green. The author reports 1059
across 51 files; the difference is exactly `p3-layout-v2` (2 files, 6 tests),
which he includes in his lane D group and I ran as part of neither. Adding it
reconciles the two figures exactly, so I am not disputing his total.

* The import corpus is **35** and the `m4/import` children are **90**, which are
  the ticket's own expected numbers, so the files this lane moved still execute
  exactly as they did.
* The today suite is **682** on this tip, not the 661 the ticket quotes. R1 said
  so and the author said so; I measure 682 as well, and it did not move under
  this change. Someone's bar text is stale.
* `import-retract` is 13 within group 6, as the ticket expects.
* The today-17 measure journey, this lane's known residual flake, did not flake
  in my run. Nothing was re-run to reach a green.
* The lane step was then run **eight further times**, deliberately, for B1:
  20 of 20, exit 0, every time. Nine runs in total on this tip.

---

## 6. NOTES, not blocking

### R2-N1. The CI line is not a convenience, it is the guard, and nothing runs it yet

The two properties that make this change safe for every bundle already sealed
are "what `port.cjs` mints is ALREADY the canonical form" (C-PN-8) and
"`deriveKey` is NFKD and nothing else" (C-PN-12). Both live in
`rebuild/lanes/c/passphrase-normalize/unlock-forms.test.mjs`, which no workflow
runs. Until the S9 integrator adds the step in section 7, a future edit to
`makePassphrase()` (a different join character, a capitalised word) would break
every bundle sealed before it with nothing in CI to say so. This is not a
finding against the lane, which was told not to touch the workflow; it is the
reason the step must actually be added rather than deferred.

### R2-N2. The asymmetry is a standing rule for any FUTURE sealer

Seal derives from NFKD alone; import derives from the fold. They agree only
because the one sealer in the tree mints a string the fold leaves alone. Any new
code that seals with a passphrase of its own choosing, through the exported
`port.cjs seal()` or by calling PBKDF2 directly, must use a canonical passphrase
or its bundle will not open through the import path. There is one such caller
today and it is test-side: `rebuild/m3/w6/test/local-import.test.mjs:89`
(`reseal()`), which uses the port-minted hyphen form and passes. The helper's
own header and the README now say the rule; one sentence in the S9 notes would
put it where a future author will meet it.

### R2-N3. `local-import.test.mjs` is still run by no workflow

Raised by the author and by R1; I confirm it a third time and I think it matters
more on this ticket than on any other. It is the suite that pins the phone's
five seal constants against `unseal.cjs`, which is exactly the PC-versus-phone
drift that produced this defect. It passes in my group 4. Somebody should name
it in a CI step.

### R2-N4. Format characters, once more, for the follow-on

If the PM takes R1's open question 2, the change is one character class
(`\p{Cf}`) and C-PN-20 is the cell that will have to be edited deliberately to
take it. I checked the part that makes it safe: no wordlist word carries a
format character, so stripping them cannot merge two valid passphrases. I agree
it does not belong in this lane, which is about a refusal the owner actually
met, not one he might.

### R2-N5. Nobody has typed the real six words into the real phone

Everything in both rounds and in this review is synthetic, sealed by the real
`port.cjs` with passphrases the port minted seconds earlier. The owner's bundle
was never read, `C:\Users\joeym\EarnedPort` was never opened, no real
measurement entered this session, and `b-package.cjs --full` was never run.
Before the father imports, somebody should do the real thing once, on the real
file, with the owner watching. That is a product step, not a code finding.

## 7. THE CI LINE

I ran exactly this, nine times, and it is what the cells need. The author's line
is correct and I reproduce it unchanged for the S9 integrator:

      - name: C - the six words in every form the athlete can type them
        run: node --test rebuild/lanes/c/passphrase-normalize/helper.test.mjs rebuild/lanes/c/passphrase-normalize/unlock-forms.test.mjs rebuild/lanes/c/passphrase-normalize/route.test.mjs

It needs the job's existing `MEASURED_TEST_NOW=2026-09-03` and
`TZ=America/New_York`, each set on its own line. It is now 20 cells, not 18.
R1's caveat ("do not add this step until B1 is fixed") is discharged: B1 is
fixed by construction, and I verified the construction rather than the eight
runs. The step is safe to add.

## 8. OPEN QUESTIONS FOR THE PM

1. **Nothing blocks this.** My verdict is ACCEPT WITH NOTES, and the notes are
   all either about work outside the lane (the CI step, `local-import.test.mjs`)
   or about a follow-on the lane deliberately declined (format characters).
2. **7c is still the one place to overrule the author**, and two reviewers have
   now declined to. Two integers in a pinned, execution-pinned cell were
   re-measured in the file's own stated convention, with the route-versus-boot
   checks that would have caught a smuggled module still passing untouched. If
   the PM reads it the other way, the two integers revert and go to S9; nothing
   else in the lane depends on that choice.
3. **The pre-check (report 7a) is still not wired**, and I agree with both
   previous rounds. If the PM wants "that is five words" for the father, it is
   one line in the SCREEN, never in a decoder, and the count is safe to disclose
   (the wordlist is public; a per-word verdict would not be). Note that it would
   not catch the directional-mark case, which still reads as six words.
4. **The ticket's today-suite number, 661, is stale.** 682 on this tip, measured
   by three hands now.
5. **The S9 reseal must cover exactly three files**, listed with their hashes in
   section 4, and nothing else in this lane needs a licence.

---

Measured and written by the R2 reviewer on the owner's PC. This file is the only
file this review commits.
