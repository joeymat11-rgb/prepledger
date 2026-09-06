@echo off
REM  Earned — CLEAN UP the fresh-process proof (double-click). DUMMY ONLY.
REM  Removes every EARNED_FRESHPROOF_<random> variable from your Windows USER environment whose value is
REM  EXACTLY the expected dummy value derived from its name. Anything else under such a name is left alone
REM  and named in the output for you to inspect. Never prints a value or a length.
REM  The window stays open until you press a key; the real exit code is returned.
setlocal
call "%~dp0store-secret.cmd" --cleanup-fresh-proof
set "RC=%ERRORLEVEL%"
echo.
echo store-secret-freshproof-cleanup: exit code %RC%  (0 = clean)
pause
endlocal & exit /b %RC%
