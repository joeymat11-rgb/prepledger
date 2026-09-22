# CUI font transport B4 author report

Status: LOCAL CANDIDATE GREEN. Independent review remains owed.
Base: 80fad72b62577900ce07a2910a9b6a1db47d7cca.
Branch: rebuild/c-cui-font-transport.
Scope: face_bytes transport only, one focused synthetic test, this report.

## Finding and proof
The approved design can supply data:font/woff2;base64 URLs.
gate.py face_bytes handles file: locally and routes every other URL through
the page's Playwright APIRequestContext.
The proof uses a real Playwright APIRequestContext, without a browser page.
It feeds both committed fonts through their data URLs and requires exact bytes
and the existing PINNED_FONTS hashes.
An altered final byte must fail the existing Earned Sans pin.
Malformed base64 and a non-base64 font data URI must refuse by stable names.
Committed font bytes also cross the existing file transport unchanged.
A loopback-only HTTP server proves the existing request transport unchanged.
No external network, selector, baseline, pack pin, or browser flow is involved.

## Static reachability and effects
The test imports only gate.py and its direct common.py dependency.
gate.py imports stdlib, numpy, PIL, playwright.async_api, and common.py.
Import reconfigures stdout/stderr, prepends quality/ to sys.path, computes
constants, and creates the ignored quality/run directory.
common.py imports stdlib, numpy and PIL.ImageFont and defines constants/helpers.
Neither module executes its guarded main during import.
Test top level loads gate and registers six unittest methods.
Each async row owns and disposes a real APIRequestContext.
The HTTP control binds only 127.0.0.1 on an OS-selected port.
The file control writes only under a fresh TemporaryDirectory.

## Executed red
From the candidate root, fixed environment and prior CUI venv:
$env:MEASURED_TEST_NOW='2026-09-03'; $env:TZ='America/New_York'; & 'C:/Users/joeym/AppData/Local/Temp/cui-venv/Scripts/python.exe' 'rebuild/lanes/c/ui-port/font_transport_test.py'
Result: six ran; file and loopback HTTP passed; four data rows errored.
Named mechanism: APIRequestContext.get refuses Protocol "data:" not supported.
Log: C:/Users/joeym/AppData/Local/Temp/earned-cui-font-red-4deb78debb3341ec8116862fdec42fd1/red.log
Log SHA256: 1fcd1340146f145030421ab9c901d2904051b5db05eaea439529c93c3db6bd30.
gate.py remained dea7763e163643084ce8cd8813a9fac87b4eb064b77274cc3fdb77b75320600a.

## Minimal repair and green
face_bytes now recognizes only data:font/woff2;base64, before file/http dispatch.
It decodes with base64 validation and refuses empty or malformed content by name.
It does not change the file branch or Playwright HTTP request branch.
The same command then ran six tests: six pass, zero fail, exit 0.
Green log: C:/Users/joeym/AppData/Local/Temp/earned-cui-font-green-0b4c3b8f4cb84e28882531f6b475c600/green.log
Green log SHA256: 9a973d65e71c9ba6db7db966f23d65fd059e281430c8dac4ba228fd6a792ebfb.
gate.py SHA256: a3dc60f8822be3823a52749a779319ec592430f3918df5338cc434b320a7b0f6.
Test SHA256: ee1f9ee28fee97c3fe8b30d5924c2b741ee975be7aa55856b95188815b9e4d0e.

## Limits
This is candidate preparation, not CUI0 acceptance or integration.
Independent review and applicable Claude review remain owed.
