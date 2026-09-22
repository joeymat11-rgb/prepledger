# S9 font transport CI home author report

Status: LOCAL CANDIDATE GREEN. Independent review and exact-head CI remain owed.
Base: `04baabc1a2fbb16e69d24e8deeae274df6331e6e`.
Branch: `rebuild/b-s9-font-home`.
Owned paths: `.github/workflows/rebuild.yml` and this report only.

## Accepted input and red witness
Claude C-UI-0 round 3 accepted font source `0e5e1942501b333d71fd8822532a9e18f36f26ba`
and required `font_transport_test.py` to gain an explicit S9 execution home with the font rows.
The test and `quality/gate.py` here match that source by Git blob: `999967e73d65b86846cddff9dc79d410678e43d4`
and `b988ffa0911731c53c9909333bd035fc615a91ff`.

Before the patch, a targeted assertion read the workflow from immutable base with `git show`.
It exited 1 and named three absences: `font-transport:`, `python-version: '3.14.6'`, and
`python rebuild/lanes/c/ui-port/font_transport_test.py`. No accepted audit was repeated.

## Minimal wiring
One independent `font-transport` job uses the workflow's two OS labels, has no `needs`, and runs
even when expected-red S9 package/pin steps fail in `public-gates`. It has no skip, fallback,
`continue-on-error`, or `|| true`. Each matrix leg therefore has its own attributable conclusion.
It sets exact CPython 3.14.6 x64, installs the six-package closure with exact versions and
`--no-deps`, then runs the unchanged accepted file. Nonzero setup, install, or unittest status
fails that OS leg. It does not install a browser because the test uses only APIRequestContext.

Exact command: `python rebuild/lanes/c/ui-port/font_transport_test.py`

## Prerequisite evidence
GitHub's current runner inventory maps `ubuntu-latest` to Ubuntu 24.04 x64 and
`windows-latest` to Windows Server 2025 x64:
https://github.com/actions/runner-images/blob/main/README.md

The official manifest marks 3.14.6 stable and supplies Linux 24.04 x64 and Windows x64 bundles:
https://raw.githubusercontent.com/actions/python-versions/main/versions-manifest.json

Official PyPI JSON shows matching CPython 3.14 or universal wheels for all six exact releases:
https://pypi.org/pypi/numpy/2.5.3/json ; https://pypi.org/pypi/pillow/12.3.0/json
https://pypi.org/pypi/playwright/1.62.0/json ; https://pypi.org/pypi/greenlet/3.5.4/json
https://pypi.org/pypi/pyee/13.0.1/json ; https://pypi.org/pypi/typing-extensions/4.16.0/json

The accepted author's report binds its green six-test run to `%TEMP%/cui-venv` at lines 34/46.
That venv's `pyvenv.cfg` records Python 3.14.6 and inherited system packages. Its local dist-info
records numpy 2.5.3 and Pillow 12.3.0; Python's system dist-info records Playwright 1.62.0,
greenlet 3.5.4, pyee 13.0.1, and typing-extensions 4.16.0. The report records the environment
path and result; surviving metadata records exact versions.

## Import effects and containment
The test imports `gate.py`, which imports `common.py`, numpy, Pillow, and Playwright. `common.py`
defines helpers/constants and writes nothing at import. `gate.py` reconfigures console encoding,
prepends its own quality directory to `sys.path`, computes constants, and creates ignored
`quality/run/`; its browser-driving main is guarded and does not execute on import. Test effects
are two committed font reads, one fresh temporary file, and a 127.0.0.1 server on an OS-selected
port. No external request or browser launch occurs.
## Bounded local execution
After explicit grant, only the exact accepted test ran with the existing `cui-venv` Python.
PID 25440 ended: six tests, six pass, zero fail, zero skip, exit 0; no browser was installed.
Logs: `%TEMP%/earned-s9-font-home-run-16f78fdd51e44d3c846edceca1fae8a0/`.
stdout sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;
stderr sha256 `a5dccbdd880ebb6bebd6f4cc0a6261b4d7ea59d2faf8bab80eb696471b9cd15c`.
Both exact-head CI legs still owe six pass, zero skip. Full S9 primary jobs remain required.
