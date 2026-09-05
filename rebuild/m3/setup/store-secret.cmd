@echo off
REM ============================================================================
REM  Earned — store a secret as a USER environment variable, with no terminal typing.
REM
REM  Double-click this file. A small window asks WHICH secret (CLOUDFLARE_API_TOKEN or
REM  CLERK_SECRET_KEY) and then asks for the value in a masked box (dots, never letters).
REM  The value is written ONLY to the current Windows user's environment variables
REM  (HKCU\Environment) — never to this repo, never to a file, never to the screen.
REM  Programs started AFTER this (Claude Code, wrangler) see it as $env:CLOUDFLARE_API_TOKEN.
REM
REM  Self-test (no real secret involved):   store-secret.cmd --selftest
REM  Pick the variable up front:            store-secret.cmd --name CLERK_SECRET_KEY
REM ============================================================================
setlocal
set "HERE=%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%HERE%store-secret.ps1" %*
set "RC=%ERRORLEVEL%"
if not "%RC%"=="0" (
  echo.
  echo store-secret: exit code %RC%
  pause
)
endlocal & exit /b %RC%
