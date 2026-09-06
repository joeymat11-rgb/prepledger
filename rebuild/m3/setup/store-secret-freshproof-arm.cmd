@echo off
REM  Earned — ARM the fresh-process proof (double-click). DUMMY ONLY: no real secret is involved.
REM  Writes a temporary variable named EARNED_FRESHPROOF_<random> with a dummy marker value into your Windows
REM  USER environment and prints its NAME and the SHA-256 HASH of that value (never the value, never a length).
REM  Then: CLOSE every Claude Code window and terminal, open Claude Code FRESH from the Start menu, and the
REM  integrator runs   store-secret.cmd --verify-fresh-proof NAME HASH   there, followed by
REM                    store-secret.cmd --cleanup-fresh-proof NAME HASH   (removes it; exact-hash match only).
setlocal
call "%~dp0store-secret.cmd" --arm-fresh-proof
set "RC=%ERRORLEVEL%"
endlocal & exit /b %RC%
