@echo off
REM  Earned — runs the store-secret unit tests (double-click). IN-MEMORY facades only: nothing is written to
REM  your Windows environment, no window opens, no value is printed. Ends with "store-secret tests: N passed, 0 failed".
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0test\store-secret.tests.ps1"
set "RC=%ERRORLEVEL%"
echo.
echo store-secret-tests: exit code %RC%
pause
endlocal & exit /b %RC%
