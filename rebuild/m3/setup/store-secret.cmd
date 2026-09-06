@echo off
REM ============================================================================
REM  Earned — store a secret as a Windows USER environment variable, with no terminal typing.
REM
REM  Double-click this file. A small window asks WHICH secret (CLOUDFLARE_API_TOKEN or
REM  CLERK_SECRET_KEY) and then asks for the value in a masked box (dots, never letters).
REM  The value is written ONLY to the current Windows user's environment variables
REM  (HKCU\Environment) — never to this repo, never to a file, never to the screen. That store is
REM  your Windows profile, not an encrypted vault. Programs started FRESH afterwards (from the Start
REM  menu / taskbar) see it as %CLOUDFLARE_API_TOKEN%; a window opened from an already-running
REM  program keeps the old environment.
REM
REM  This wrapper is DESIGNED to be run by the OWNER by double-clicking. Its -ExecutionPolicy Bypass
REM  is process-scoped (this one PowerShell process only) and changes no machine or user policy.
REM
REM  Dummy-only self-test (no real secret):  double-click store-secret-selftest.cmd
REM                                          (or from a terminal:  store-secret.cmd --selftest)
REM  Pick the variable up front:             store-secret.cmd --name CLERK_SECRET_KEY
REM  Every argument is forwarded to the PowerShell helper unchanged; its exit code is returned.
REM  Exit codes: 0 stored/ok · 1 failed/unverified · 2 cancelled · 3 refused name · 4 empty · 5 unknown argument
REM ============================================================================
setlocal
set "HERE=%~dp0"
set "ARGS=%*"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%HERE%store-secret.ps1" %*
set "RC=%ERRORLEVEL%"
echo.
echo store-secret: exit code %RC%
if not "%RC%"=="0" pause
if "%ARGS%"=="" pause
endlocal & exit /b %RC%
