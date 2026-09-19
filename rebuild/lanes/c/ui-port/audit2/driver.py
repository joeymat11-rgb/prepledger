#!/usr/bin/env python3
"""By-hand mutation driver for the second C-UI gate teeth audit (audit 2).

It does NOT use quality/teeth.py. One row at a time, against a scratch COPY of the pack:
  1. sha256 of every file the row will touch
  2. apply exactly one mutation (a list of edits that belong to one row)
  3. print the unified diff that proves the mutation took effect, and refuse to run if it is empty
  4. run gate.py / statesheet.py / phonesheet.py with the venv python, with a timeout
  5. record exit code, summary line, every FAIL line, whether a report file was written
  6. revert in a finally block and prove by sha256 that the copy is byte identical again

  python driver.py --list
  python driver.py --pack <scratch pack> --dry-run --all      apply, diff, revert, prove, run nothing
  python driver.py --pack <scratch pack> --row a
  python driver.py --pack <scratch pack> --row h1 --runner sheet --only T-02
  python driver.py --pack <scratch pack> --row acc2 --env EARNED_APP=file:///...

Results: one JSON line per row appended to <this folder>/results.jsonl, plus a readable table.
It refuses any --pack that lies inside a git work tree.
Exit code: 0 the row ran and was recorded, 1 the row could not be set up, 2 the pack was refused.
"""
import argparse, difflib, hashlib, json, os, re, shutil, subprocess, sys, time

try:   # a Windows console or a redirected log must not choke on a dash or a zero width space
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from rows import ROWS, ROW_BY_ID   # noqa: E402

# audit 3 writes its own file so the 86 records of audit 2 are never appended to
RESULTS = os.path.join(HERE, os.environ.get('AUDIT_RESULTS', 'results.jsonl'))
DEFAULT_PY = os.path.join(os.environ.get('TEMP', HERE), 'cui-venv', 'Scripts', 'python.exe')

RUNNERS = {
    'gate': 'quality/gate.py',
    'sheet': 'quality/statesheet.py',
    'phone': 'quality/phonesheet.py',
    # audit 3: the pack's own mutation list is a runner too, so a row can measure whether one of
    # ITS rows still bites when one protection alone is reverted (judgment items 9, 10 and 14)
    'teeth': 'quality/teeth.py',
}


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 16), b''):
            h.update(chunk)
    return h.hexdigest()


def refuse(msg, code=2):
    print('AUDIT2 DRIVER: REFUSED. ' + msg)
    sys.exit(code)


def check_pack(pack):
    """The pack must be a real copy outside every git work tree."""
    if not os.path.isdir(os.path.join(pack, 'quality')) or not os.path.isdir(os.path.join(pack, 'app')):
        refuse(pack + ' is not a pack: it has no app/ and quality/')
    p = os.path.abspath(pack)
    while True:
        if os.path.exists(os.path.join(p, '.git')):
            refuse(p + ' is inside a git work tree (.git found); copy the pack out of the repo first')
        nxt = os.path.dirname(p)
        if nxt == p:
            break
        p = nxt
    try:
        r = subprocess.run(['git', 'rev-parse', '--is-inside-work-tree'], cwd=pack,
                           capture_output=True, text=True, timeout=30)
        if r.returncode == 0 and r.stdout.strip() == 'true':
            refuse(pack + ' is inside a git work tree (git says so); copy the pack out of the repo first')
    except Exception:
        pass   # no git on the path is not a reason to refuse a pack that has no .git above it


def touched_files(row):
    out = []
    for e in row['edits']:
        if e['file'] not in out:
            out.append(e['file'])
    return out


def fpath(pack, rel):
    return os.path.join(pack, rel.replace('/', os.sep))


def apply_edits(pack, row):
    """Apply one row's edits. Returns {rel: (before_bytes, after_bytes)}. Raises on a bad anchor."""
    changed = {}
    for e in row['edits']:
        path = fpath(pack, e['file'])
        op = e.get('op', 'sub')
        if not os.path.exists(path) and op != 'write':
            raise AssertionError(e['file'] + ' is not in the pack')
        before = changed[e['file']][0] if e['file'] in changed else (
            open(path, 'rb').read() if os.path.exists(path) else b'')
        cur = open(path, 'rb').read() if os.path.exists(path) else b''
        if op == 'sub':
            s = cur.decode('utf-8')
            n = s.count(e['find'])
            want = e.get('count', 1)
            if n != want:
                raise AssertionError('%s: the anchor matched %d times, expected %d: %r'
                                     % (e['file'], n, want, e['find'][:70]))
            new = s.replace(e['find'], e['replace']).encode('utf-8')
        elif op == 'append':
            new = cur + e['text'].encode('utf-8')
        elif op == 'append_bytes':
            new = cur + bytes(e['bytes'])
        elif op == 'write':
            new = e['text'].encode('utf-8')
        elif op == 'copy_from':
            # one file of the pack copied over another (teeth.py p4 copies the other platform's
            # thumbnails). The source is read from the same scratch copy and is never modified.
            src = fpath(pack, e['from'])
            if not os.path.exists(src):
                raise AssertionError(e['from'] + ' is not in the pack')
            new = open(src, 'rb').read()
        elif op == 'delete':
            new = None
        else:
            raise AssertionError('unknown op ' + op)
        if new is None:
            os.remove(path)
        else:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, 'wb') as f:
                f.write(new)
        changed[e['file']] = (before, new if new is not None else b'')
    return changed


def unified(rel, before, after):
    """A readable diff. Binary files are reported by size and digest instead."""
    try:
        a = before.decode('utf-8').splitlines(True)
        b = after.decode('utf-8').splitlines(True)
    except UnicodeDecodeError:
        return ('binary %s: %d bytes %s -> %d bytes %s\n'
                % (rel, len(before), hashlib.sha256(before).hexdigest()[:12],
                   len(after), hashlib.sha256(after).hexdigest()[:12]))
    return ''.join(difflib.unified_diff(a, b, 'a/' + rel, 'b/' + rel, n=1))


def trim_diff(text, keep=26):
    lines = text.splitlines(True)
    if len(lines) <= keep:
        return text
    return ''.join(lines[:keep]) + '... (%d more diff lines)\n' % (len(lines) - keep)


def read_report(pack, runner, only):
    """What the run wrote down, if anything."""
    run = os.path.join(pack, 'quality', 'run')
    out = {'report_written': False, 'report_paths': [], 'fail_lines': []}
    names = []
    if runner == 'gate':
        names = ['report.txt', 'report.json']
    elif runner == 'sheet':
        names = ['states-report' + ('-' + only.rstrip('-') if only else '') + '.txt']
    for n in names:
        p = os.path.join(run, n)
        if os.path.exists(p):
            out['report_written'] = True
            out['report_paths'].append('quality/run/' + n)
    jp = os.path.join(run, 'report.json')
    if runner == 'gate' and os.path.exists(jp):
        try:
            with open(jp, encoding='utf-8') as f:
                rowsj = json.load(f)
            out['fail_lines'] = ['%s | %s | %s' % (r[1], r[2], r[3]) for r in rowsj if r[0] == 'FAIL']
            out['warn_lines'] = ['%s | %s | %s' % (r[1], r[2], r[3]) for r in rowsj if r[0] == 'WARN']
            out['set_lines'] = ['%s | %s' % (r[1], r[2]) for r in rowsj if r[0] == 'SET']
        except Exception as ex:
            out['fail_lines'] = ['report.json could not be read: %s' % type(ex).__name__]
    return out


SUMMARY_RE = re.compile(r'^(EARNED UI GATE:|STATE SHEET:|PHONE SHEET:|ACCEPT RUN:|TEETH:).*$', re.M)


def summary_lines(out):
    return SUMMARY_RE.findall(out) and [m.group(0) for m in SUMMARY_RE.finditer(out)] or []


def stdout_fail_lines(out):
    return [ln.rstrip() for ln in out.splitlines() if ln.startswith('FAIL ')]


def run_one(pack, row, runner, only, extra_env, py, timeout, dry):
    """Apply, prove, run, revert, prove. Returns the result record."""
    started = time.time()
    rel_files = touched_files(row)
    before_sha = {}
    for rel in rel_files:
        p = fpath(pack, rel)
        before_sha[rel] = sha256_file(p) if os.path.exists(p) else None
    rec = {'row': row['id'], 'source': row['source'], 'what': row['what'],
           'runner': runner, 'only': only, 'dry_run': bool(dry),
           'files': rel_files, 'sha_before': before_sha,
           'expect_exit': row.get('expect_exit'), 'expect_kind': row.get('expect_kind'),
           'expect_catcher': row.get('expect_catcher'), 'expect_words': row.get('expect_words'),
           'expect_no_fail': row.get('expect_no_fail'), 'head': row.get('head'),
           'hand': row.get('hand'), 'when': time.strftime('%Y-%m-%dT%H:%M:%S')}
    changed = None
    try:
        changed = apply_edits(pack, row)
        diff = ''.join(unified(rel, b, a) for rel, (b, a) in changed.items())
        if not diff.strip():
            rec['status'] = 'VOID'
            rec['note'] = 'the mutation produced an empty diff: the pack already carries it, or the anchor is wrong'
            return rec
        rec['diff'] = trim_diff(diff)
        print('---- row %s: %s' % (row['id'], row['what']))
        print(rec['diff'])
        if dry:
            rec['status'] = 'DRY-OK'
            return rec
        run = os.path.join(pack, 'quality', 'run')
        if os.path.isdir(run):
            shutil.rmtree(run, ignore_errors=True)   # a stale report must not be read as this row's
        cmd = [py, RUNNERS[runner]] + list(row.get('args') or [])
        if only and runner == 'sheet' and '--only' not in cmd:
            cmd += ['--only', only]
        env = dict(os.environ)
        env.pop('EARNED_APP', None)
        for k, v in (row.get('env') or {}).items():
            env[k] = v.replace('<PACK>', pack.replace(os.sep, '/'))
        for k, v in (extra_env or {}).items():
            env[k] = v
        rec['cmd'] = ' '.join(cmd[1:])
        rec['env_set'] = {k: env[k] for k in ('EARNED_APP',) if k in env}
        t0 = time.time()
        try:
            # a row may shorten the timeout: one of them names a defect whose shape is that the
            # run does NOT refuse and starts working through a whole list instead (audit 3 y9c)
            proc = subprocess.run(cmd, cwd=pack, env=env, capture_output=True, text=True,
                                  encoding='utf-8', errors='replace',
                                  timeout=row.get('timeout') or timeout)
            out = (proc.stdout or '') + (proc.stderr or '')
            rec['exit'] = proc.returncode
            rec['timed_out'] = False
        except subprocess.TimeoutExpired as ex:
            out = (ex.stdout or '') + (ex.stderr or '') if isinstance(ex.stdout, str) else ''
            rec['exit'] = None
            rec['timed_out'] = True
        rec['seconds'] = round(time.time() - t0, 1)
        rec['summary'] = summary_lines(out)
        rec['traceback'] = 'Traceback' in out
        rec['refused_line'] = next((ln.strip() for ln in out.splitlines() if 'REFUSED' in ln), None)
        rec.update(read_report(pack, runner, only))
        if not rec.get('fail_lines'):
            rec['fail_lines'] = stdout_fail_lines(out)
        rec['stdout_tail'] = '\n'.join(out.splitlines()[-40:])
        rec['status'] = judge(rec, row)
        return rec
    except AssertionError as ex:
        rec['status'] = 'VOID'
        rec['note'] = str(ex)
        return rec
    finally:
        # revert whatever was written, then prove the copy is byte identical again
        if changed:
            for rel, (before, _after) in changed.items():
                p = fpath(pack, rel)
                if before == b'' and before_sha.get(rel) is None:
                    if os.path.exists(p):
                        os.remove(p)
                else:
                    with open(p, 'wb') as f:
                        f.write(before)
        after_sha = {}
        for rel in rel_files:
            p = fpath(pack, rel)
            after_sha[rel] = sha256_file(p) if os.path.exists(p) else None
        rec['sha_after_revert'] = after_sha
        rec['reverted_clean'] = (after_sha == before_sha)
        rec['total_seconds'] = round(time.time() - started, 1)
        if not rec['reverted_clean']:
            rec['status'] = 'DIRTY'
            rec['note'] = 'REVERT FAILED: ' + ', '.join(
                r for r in rel_files if after_sha.get(r) != before_sha.get(r))
        with open(RESULTS, 'a', encoding='utf-8') as f:
            f.write(json.dumps(rec, ensure_ascii=True) + '\n')


def judge(rec, row):
    """AS-EXPECTED only when the exit code, the catcher and the words all match the row.

    Anything else is recorded as DISAGREES with the reason; the auditor reads it and decides.
    A DISAGREES is a lead, not a verdict: the row may be wrong, not the gate.
    """
    why = []
    if rec.get('timed_out'):
        return 'TIMEOUT'
    if row.get('expect_exit') is not None and rec.get('exit') != row['expect_exit']:
        why.append('exit %s, the row expects %s' % (rec.get('exit'), row['expect_exit']))
    if rec.get('traceback'):
        why.append('it printed a traceback')
    kind = row.get('expect_kind')
    catcher = row.get('expect_catcher')
    # gate.py ends a run with "Passed everywhere: <every check name that passed>", so a naive
    # substring test against the whole output says the catcher is there when the catcher PASSED.
    # Measured on row x20: the contrast check passed and the row was still judged as expected.
    # That line is removed before the catcher and the needles are looked for (audit 2, 2026-09-19).
    tail = '\n'.join(ln for ln in (rec.get('stdout_tail') or '').splitlines()
                     if not ln.startswith('Passed everywhere'))
    blob = '\n'.join(rec.get('fail_lines') or []) + '\n' + tail
    names = [ln.split(' | ')[0] for ln in (rec.get('fail_lines') or [])]
    if kind == 'FAIL' and catcher:
        # judgment 4ecc1012: exact identity of the FAIL row's check name; a substring or the stdout tail is not a catch
        if catcher not in names:
            why.append('no FAIL whose check name is exactly %r (FAIL names seen: %s)' % (catcher, sorted(set(names)) or 'none'))
    for forbidden in (row.get('expect_no_fail') or []):
        # P-CUI-4: a POSITIVE control says which named check must NOT fail (an honest negative number is not a dash)
        if forbidden in names:
            why.append('the check %r FAILED and this row says it must not' % forbidden)
    if kind == 'WARN' and catcher:
        if catcher not in [ln.split(' | ')[0] for ln in (rec.get('warn_lines') or [])]:
            why.append('no WARN naming %r' % catcher)
    if kind == 'REFUSE' and not rec.get('refused_line'):
        why.append('no one line refusal was printed')
    for needle in (row.get('expect_needles') or []):
        if needle not in blob:
            why.append('%r is not in the output' % needle)
    if row.get('expect_report') and not rec.get('report_written'):
        why.append('no report file was written')
    rec['why'] = why
    return 'as expected' if not why else 'DISAGREES'


MANIFEST = os.path.join(HERE, 'pack-manifest.json')


def manifest(pack, mode):
    """Hash every file of the pack copy except quality/run, so a row that writes into the pack
    (an accept run) cannot go unnoticed."""
    got = {}
    for part in ('app', 'quality'):
        base = os.path.join(pack, part)
        for root, dirs, files in os.walk(base):
            dirs[:] = [d for d in dirs if d not in ('run', '__pycache__')]
            for fn in files:
                p = os.path.join(root, fn)
                got[os.path.relpath(p, pack).replace(os.sep, '/')] = sha256_file(p)
    if mode == 'write':
        with open(MANIFEST, 'w', encoding='utf-8') as f:
            json.dump(got, f, indent=0, sort_keys=True)
        print('MANIFEST written: %d files' % len(got))
        return 0
    if not os.path.exists(MANIFEST):
        print('MANIFEST missing: run --manifest write against a fresh copy first')
        return 1
    with open(MANIFEST, encoding='utf-8') as f:
        want = json.load(f)
    changed = sorted(k for k in set(want) | set(got) if want.get(k) != got.get(k))
    if changed:
        print('MANIFEST DIFFERS on %d files:\n  ' % len(changed) + '\n  '.join(changed[:40]))
        return 1
    print('MANIFEST clean: %d files byte identical' % len(got))
    return 0


def table(recs):
    w = ['%-6s %-9s %-58s %-12s %-6s %s' % ('row', 'source', 'mutation', 'verdict', 'exit', 'note')]
    for r in recs:
        note = r.get('note') or '; '.join(r.get('why') or []) or (r.get('summary') or [''])[0]
        w.append('%-6s %-9s %-58s %-12s %-6s %s'
                 % (r['row'], r['source'][:9], r['what'][:58], r.get('status', '?'),
                    str(r.get('exit', '')), note[:120]))
    return '\n'.join(w)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--pack')
    ap.add_argument('--row')
    ap.add_argument('--runner', choices=sorted(RUNNERS))
    ap.add_argument('--only')
    ap.add_argument('--env', action='append', default=[])
    ap.add_argument('--python', default=DEFAULT_PY)
    ap.add_argument('--timeout', type=int, default=900)
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--all', action='store_true')
    ap.add_argument('--manifest', choices=['write', 'check'])
    a = ap.parse_args()
    if a.manifest:
        if not a.pack:
            refuse('--manifest needs --pack')
        check_pack(a.pack)
        return manifest(a.pack, a.manifest)
    if not a.pack:
        for r in ROWS:
            print('%-6s %-9s %-8s %s' % (r['id'], r['source'], r['runner'], r['what']))
        print('\n%d rows. %d need hand work: %s'
              % (len(ROWS), sum(1 for r in ROWS if r.get('hand')),
                 ', '.join(r['id'] for r in ROWS if r.get('hand'))))
        return 0
    check_pack(a.pack)
    if not a.dry_run and not os.path.exists(a.python):
        refuse('no python at ' + a.python + ' (pass --python)')
    extra = dict(kv.split('=', 1) for kv in a.env)
    chosen = ROWS if (a.all or not a.row) else [ROW_BY_ID[x] for x in a.row.split(',')]
    recs = []
    voids = [r for r in chosen if r.get('void')]
    for r in voids:
        print('---- row %s is VOID and is not run: %s' % (r['id'], r['void']))
    chosen = [r for r in chosen if not r.get('void')]
    for row in chosen:
        if row.get('hand') and not a.dry_run:
            print('---- row %s is HAND WORK: %s' % (row['id'], row['hand']))
        runner = a.runner or row['runner']
        only = a.only or row.get('only')
        recs.append(run_one(a.pack, row, runner, only, extra, a.python, a.timeout, a.dry_run))
    print('\n' + table(recs))
    print('\n%d rows selected: %d run, %d VOID and not run (%s)'
          % (len(recs) + len(voids), len(recs), len(voids), ', '.join(r['id'] for r in voids) or 'none'))
    print('results appended to ' + RESULTS)
    bad = [r for r in recs if r.get('status') not in ('as expected', 'DRY-OK')]
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
