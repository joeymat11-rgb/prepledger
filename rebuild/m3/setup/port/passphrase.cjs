'use strict';
/* rebuild/m3/setup/port/passphrase.cjs - THE ONE CANONICAL FORM OF THE SIX
   WORDS, and the only place it is computed.

   port.cjs mints six words out of wordlist.cjs and joins them with hyphens
   (makePassphrase, :186). That hyphen-joined string is what the PC writes on
   the piece of paper, and it is therefore THE form: everything here maps what
   was typed onto it and nothing here invents a new one.

   THE DEFECT THIS FILE EXISTS FOR (DECISIONS:520). The phone derived the key
   from the typed string after NFKD and nothing else, while the screen said
   "Type the six words from the PC" without saying with what between them. The
   owner typed them with spaces and got BUNDLE_AUTH_FAILED on his own file.

   WHAT IS FOLDED, AND WHY ONLY THIS.
     NFKD            - a phone keyboard can type a compatibility spelling of a
                       character the PC typed plainly. unseal.cjs already did
                       this and still does; it is kept first so every rule
                       below runs over one spelling.
     lower case      - the wordlist is lower case and iOS capitalises the first
                       word of a field whether or not it is asked to.
     separator runs  - any run of Unicode whitespace (space, tab, newline,
                       U+00A0, U+3000 ...), hyphen-minus, U+2010 to U+2015,
                       U+2212, underscore, comma or full stop becomes ONE
                       hyphen-minus. That is every character a keyboard, a
                       paste or smart punctuation can put between two words.
     the ends        - a leading or trailing run of the same characters goes.

   WHAT IS NOT FOLDED: the words themselves, their spelling, their accents and
   THEIR ORDER. The entropy is the six draws out of 2048 (66 bits) and none of
   it is here: no word in the list contains a separator character and no two
   words in the list fold together, so two DIFFERENT valid passphrases cannot
   land on the same canonical form. The lane cell C-PN-7 measures that on the
   list itself rather than asserting it here.

   WHERE IT IS USED: the two places a TYPED passphrase becomes key material on
   the way IN - unseal.cjs unseal() and the phone's twin in
   rebuild/m3/w6/local/import-bundle.mjs unsealBundle(). The SEALING side does
   not call it: deriveKey stays NFKD-only, so port.cjs seal() is byte for byte
   what it was and every bundle already sealed stays valid.

   PURE. No dependency, no I/O, no clock, no randomness: that is what lets one
   copy of it run in Node and inside the phone bundle. */

/* Written as escapes on purpose: no U+2013 or U+2014 as a character in this
   tree. The class is, in order: Unicode whitespace, U+2010 HYPHEN through
   U+2015 HORIZONTAL BAR, U+2212 MINUS SIGN, underscore, comma, full stop and
   hyphen-minus (last, so it is a literal and not a range). */
const PASSPHRASE_SEPARATORS = /[\s\u2010-\u2015\u2212_,.-]+/u;
/* FLAGLESS ABOVE, ON PURPOSE (fix round, review R1 note 2). A global regex
   carries lastIndex with it, so an EXPORTED one answers a repeated .test() on
   one input with true, false, true, false. Nothing calls it that way today,
   which is exactly when to close it: on the import path a trap that springs
   only for the next caller is still a trap. The fold needs a global copy to
   replace every run rather than the first, so it keeps its own and keeps it
   module-private. C-PN-19 is that claim, measured. */
const SEPARATOR_RUNS = new RegExp(PASSPHRASE_SEPARATORS.source, 'gu');
const ENDS = /^-+|-+$/g;

function normalisePassphrase(typed) {
  if (typeof typed !== 'string') return '';
  return typed
    .normalize('NFKD')
    .toLowerCase()
    .replace(SEPARATOR_RUNS, '-')
    .replace(ENDS, '')
    /* Lower-casing an NFKD string is not guaranteed to leave it NFKD, and the
       derive sites hand this straight to the KDF, so the last word is NFKD's.
       On the ASCII wordlist this is a no-op, which is the point: it cannot
       change what the PC already sealed. */
    .normalize('NFKD');
}

/* A COUNT, never a verdict on a word. The wordlist is public, so how many
   words were typed is worth nothing to anybody; which one is wrong would be
   worth 2048 to 1. Nothing in this file can say the second thing. */
function passphraseWordCount(typed) {
  const canonical = normalisePassphrase(typed);
  return canonical === '' ? 0 : canonical.split('-').length;
}

module.exports = { PASSPHRASE_SEPARATORS, normalisePassphrase, passphraseWordCount };
