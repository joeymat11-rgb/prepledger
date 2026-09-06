@echo off
REM  Earned — DUMMY-ONLY self-test of store-secret (double-click). No real secret is involved.
REM  It writes a temporary variable named EARNED_SELFTEST_<random> with a dummy marker value into your
REM  Windows USER environment, reads it back, and removes it again. It prints one OK / FAIL line and
REM  never prints a value or a length. Quote that one line into the next report.
REM  The window stays open until you press a key so the line stays visible; the real exit code is returned.
setlocal
call "%~dp0store-secret.cmd" --selftest
set "RC=%ERRORLEVEL%"
echo.
echo store-secret-selftest: exit code %RC%  (0 = OK)
pause
endlocal & exit /b %RC%
