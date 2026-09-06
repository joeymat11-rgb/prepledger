@echo off
REM  Earned — ARM the fresh-process proof (double-click). DUMMY ONLY: no real secret is involved.
REM  Writes a temporary variable named EARNED_FRESHPROOF_<random> with a dummy value into your Windows USER
REM  environment and prints its NAME (never a value, never a length). The dummy value is derived from the NAME,
REM  so the NAME is all anyone needs to verify or clean up.
REM  Then: CLOSE every Claude Code window and terminal, open Claude Code FRESH from the Start menu, and the
REM  integrator runs   store-secret.cmd --verify-fresh-proof NAME   there (NAME may be omitted when only one is
REM  armed). Clean up afterwards by double-clicking store-secret-freshproof-cleanup.cmd.
REM  The window stays open until you press a key so the NAME stays visible; the real exit code is returned.
setlocal
call "%~dp0store-secret.cmd" --arm-fresh-proof
set "RC=%ERRORLEVEL%"
echo.
echo store-secret-freshproof-arm: exit code %RC%  (0 = armed)
pause
endlocal & exit /b %RC%
