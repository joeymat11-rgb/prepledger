# The port script — moving your history to the new app

This is the thing that carries your ledger across. It reads your history, walks
it forward to the shape the new app expects, checks the walk three ways, and
locks the result in one file with a six-word password. You then move that one
file to your phone yourself.

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
3. **Checks the walk twice, two different ways.**
   - The engine's own guard (`dataLossGuard`) compares record counts and record
     identities before and after. It covers readings, sleep nights, food days,
     session days, individual sets, waist, photos, the correction log, the
     decision log and the learned series.
   - A second, separate count — using the port-oracle's own `counts()` — covers
     the classes the first one does **not** look at: **exercises, the queue,
     earned lines, debuts and events**. If any of those came out smaller than it
     went in, the script stops.

   Between them those two cover every class the port-oracle's counts law checks.
   What they promise is precise: **no class of record comes out of the walk
   smaller than it went in.** That is not the same as "nothing can ever change" —
   some counts legitimately go *up* (the migration files corrections and can mint
   queue entries), and the feed is deduplicated, so it can go down. Every number
   is printed, before and after, so you can see exactly what moved.
4. **Runs the gate.** The port-oracle is the frozen exam the engine already
   passed. It runs again here, twice (once with the clock frozen, once with the
   normal clock), and **every law must come back GREEN**. One that does not, and
   the script stops and writes nothing at all.
5. **Seals it.** It invents a six-word password and locks the bundle with it.
   Without the words the file is noise.
6. **Writes two files** and tells you where they are.

Every line it prints is a path, a count, a hash or PASS/FAIL. It never prints a
weight, a meal, a lift, a date from your log, or the password.

## Running it

Open PowerShell in the repository folder and run one line:

```powershell
node rebuild/m3/setup/port/port.cjs --source "C:\path\to\ledger\state.json" --out "C:\Users\joeym\Desktop\earned-port"
```

- `--source` — your ledger file.
- `--out` — where to put the results. It must be an ordinary folder: the script
  refuses anything that really lives inside this repository, inside any git
  working tree, or in a folder called `rebuild`. "Really" is the point — it
  follows shortcuts (junctions) and old-style short names (`DOCUME~1`) back to
  the true folder first, because an earlier version of this check did not, and a
  reviewer used exactly those two tricks to land the bundle — and the password
  file beside it — inside a folder that gets committed to a **public**
  repository. Your Desktop or Documents is the right kind of place.
- `--engine` — optional, for testing. Leave it alone.

You get:

- `earned-port-YYYY-MM-DD.json` — the sealed bundle. Move this to the phone.
- `earned-port-YYYY-MM-DD-PASSPHRASE.txt` — the six words. **Keep this on the
  PC.** Open it when the phone asks.

The route to the phone does not matter — iCloud Drive, OneDrive, AirDrop,
e-mail to yourself. It is sealed. Someone who gets the file and not the words
has a block of noise.

When the phone says the import is in, delete both files, and the copy you
posted. Your original ledger is untouched — this script only ever read it.

## Merging a second file (`--local`)

If you already put some history on the phone, `--local` merges that export into
the port so nothing from either side is lost. Because picking the wrong file
here would invent a history that never happened, it takes two steps.

**Step one — look at the file:**

```powershell
node rebuild/m3/setup/port/port.cjs --source "...\state.json" --local "...\phone-export.json" --local-inspect
```

That writes nothing. It tells you the file's fingerprint, its format number, and
**how many readings it has in common with your main file**. If that number is
zero, the script refuses the merge outright (`LOCAL_UNRELATED`) — that is the
wrong-file accident, caught.

**Step two — confirm and merge.** The inspect step prints the eight characters
to hand back:

```powershell
node ... --source "...\state.json" --local "...\phone-export.json" --local-confirm a1b2c3d4 --out "...\earned-port"
```

Without `--local-confirm`, a merge does not run at all.

**An honest limit.** This checks whether two files look like *the same ledger*,
by finding a reading with the same date and the same weight in both. It cannot
check whether they belong to the *same person*, because the state carries no
name, no account and no device id — there is nothing to compare. So treat it as
a guard against reaching for the wrong file, which is the mistake that actually
happens, not as proof of identity.

## If it stops

- **`COUNTS FAIL … SHRANK`** — a class of record came out of the walk smaller
  than it went in. Nothing was written. The line names the class and both
  numbers.
- **`ORACLE FAIL`** — the gate said no. Nothing was written. That is the script
  doing its job: the engine, not the gate, is what needs fixing.
- **`LOCAL_UNRELATED`** — the `--local` file has no reading in common with your
  main file. Almost certainly the wrong file. Nothing was written.
- **`IMPORT_SOURCE_JSON_INVALID`** — the source file is not valid JSON (or it has
  the same key twice). Nothing was written.
- **`IMPORT_MIGRATION_DATA_LOSS`** — the engine's own guard refused the walk.
  Nothing was written.
- **`--out is inside …`** — pick an ordinary folder, as above. Nothing was
  written.
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
its own profile requires. It also carries the counts, the gate verdict and the
relatedness result, so the phone can show what was proved rather than assert it.
Every failure — wrong words, flipped byte, bundle re-pointed at another source —
raises the same `BUNDLE_AUTH_FAILED`.

## Tests

```powershell
node --test rebuild/m3/setup/port/test/seal.test.cjs rebuild/m3/setup/port/test/port.test.cjs
```

They use only the public fixtures in `rebuild/conform/fixtures/` and scratch
files under the OS temp folder. No network, and no private data anywhere. The
two Windows bypass cases (junction and short name) create their probe under the
temp folder, assert nothing landed in the repository, and clean up after
themselves.
