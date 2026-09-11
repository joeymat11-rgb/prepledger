# The port script — moving your history to the new app

This is the thing that carries your ledger across. It reads your history, walks
it forward to the shape the new app expects, checks the walk against the frozen
gate, and locks the result in one file with a six-word password. You then move
that one file to your phone yourself.

Nothing leaves this PC on its own. There is no upload, no server, no account.

## The rule about when this runs

**It only runs when you ask for it, in your own words, right before it happens.**
Not on a schedule, not "while we're here", not because a plan said so. If you
did not say "run the port now", it does not run. Anyone (or anything) proposing
to run it on your ledger without that sentence from you is out of bounds.

Everything below has already been tested on public practice files. Your real
ledger has never been opened by any of it.

## What it does, in order

1. **Reads your file and takes its fingerprint.** A sha256 hash — a long string
   that changes completely if even one character of the file changes.
2. **Walks it forward.** Your history is stored in a numbered format. The new
   app expects the latest number. The walk is done by the migrate/merge code
   that was accepted back in September, not by anything written for this script.
   Straight after the walk, a guard counts every class of record — readings,
   nights, food days, sessions, queue items, corrections — and refuses to go on
   if any count came out smaller. Nothing of yours is ever deleted or dropped.
3. **Runs the gate.** The port-oracle is the frozen exam the engine already
   passed. It runs again here, twice (once with the clock frozen, once with the
   normal clock), and **every law must come back GREEN**. One that does not, and
   the script stops and writes nothing at all.
4. **Seals it.** It invents a six-word password, and locks the bundle with it.
   Without the words the file is noise.
5. **Writes two files** and tells you where they are.

Every line it prints is a path, a count, a hash or PASS/FAIL. It never prints a
weight, a meal, a lift, a date from your log, or the password.

## Running it

Open PowerShell in the repository folder and run one line:

```powershell
$env:MEASURED_TEST_NOW='2026-09-03'; $env:TZ='America/New_York'
node rebuild/m3/setup/port/port.cjs --source "C:\path\to\ledger\state.json" --out "C:\Users\joeym\Desktop\earned-port"
```

(The two settings at the top are the clock the gate is pinned to. The script
sets them itself if you forget; it only refuses if you set them to something
else, because then the gate would be answering a different question.)

- `--source` — your ledger file.
- `--out` — a folder **outside the repository**. The script refuses anything
  inside it, so your history can never end up in a commit.
- `--local "C:\path\to\phone-export.json"` — optional. If you already put some
  history on the phone, this merges the two, keeping everything from both.

You get:

- `earned-port-YYYY-MM-DD.json` — the sealed bundle. Move this to the phone.
- `earned-port-YYYY-MM-DD-PASSPHRASE.txt` — the six words. **Keep this on the
  PC.** Open it when the phone asks.

The route to the phone does not matter — iCloud Drive, OneDrive, AirDrop,
e-mail to yourself. It is sealed. Someone who gets the file and not the words
has a block of noise.

When the phone says the import is in, delete both files, and the copy you
posted. Your original ledger is untouched — this script only ever read it.

## If it stops

- **`ORACLE FAIL`** — the gate said no. Nothing was written. That is the script
  doing its job: the engine, not the gate, is what needs fixing.
- **`IMPORT_SOURCE_JSON_INVALID`** — the source file is not valid JSON (or it has
  the same key twice). Nothing was written.
- **`IMPORT_MIGRATION_DATA_LOSS`** — the walk forward would have lost records.
  Refused. Nothing was written.
- **`refusing to overwrite ...`** — there is already a bundle for today in that
  folder. Move it aside or pick another folder; the script never writes over a
  bundle.

Exit code 0 means a bundle was written. Exit code 2 means a check failed and
nothing was written. Exit code 1 means you and it disagreed about the arguments.

## For whoever builds the phone side (C2b)

`unseal.cjs` is the reference decoder and the only place the parameters live:
PBKDF2-SHA-256, 600 000 iterations, 16-byte salt, 256-bit key; AES-GCM, 12-byte
IV, 128-bit tag appended to the ciphertext; additional authenticated data is the
UTF-8 of `JSON.stringify(["earned/local-import-bundle/v1", sourceSha256])`; the
passphrase is NFKD-normalised before it is used. Those map one-to-one onto
WebCrypto (`deriveBits` then `crypto.subtle.decrypt` with `additionalData`).

The payload carries the ORIGINAL source bytes as base64 alongside the migrated
state, so the phone's import-custody can keep the immutable original exactly as
its own profile requires. Every failure — wrong words, flipped byte, bundle
re-pointed at another source — raises the same `BUNDLE_AUTH_FAILED`.

## Tests

```powershell
node --test rebuild/m3/setup/port/test/seal.test.cjs rebuild/m3/setup/port/test/port.test.cjs
```

They use only the public fixtures in `rebuild/conform/fixtures/` and scratch
files under the OS temp folder. No network, and no private data anywhere.
