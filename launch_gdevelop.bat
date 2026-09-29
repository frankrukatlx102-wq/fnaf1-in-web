@echo off
title Five Nights at Freddy's - GDevelop 5 Project Launcher
cd /d "%~dp0"

echo ==========================================================
echo    FIVE NIGHTS AT FREDDY'S - GDEVELOP 5 PROJECT LAUNCHER
echo ==========================================================
echo.

set GAME_JSON=%~dp0game.json

if not exist "%GAME_JSON%" (
    echo [-] Error: game.json not found!
    pause
    exit /b 1
)

echo Looking for GDevelop 5 installation...

if exist "%LOCALAPPDATA%\Programs\gdevelop\GDevelop 5.exe" (
    echo [+] Found GDevelop 5 in Local AppData. Launching...
    start "" "%LOCALAPPDATA%\Programs\gdevelop\GDevelop 5.exe" "%GAME_JSON%"
    exit /b 0
)

if exist "%ProgramFiles%\GDevelop 5\GDevelop 5.exe" (
    echo [+] Found GDevelop 5 in Program Files. Launching...
    start "" "%ProgramFiles%\GDevelop 5\GDevelop 5.exe" "%GAME_JSON%"
    exit /b 0
)

if exist "%ProgramFiles(x86)%\GDevelop 5\GDevelop 5.exe" (
    echo [+] Found GDevelop 5 in Program Files (x86). Launching...
    start "" "%ProgramFiles(x86)%\GDevelop 5\GDevelop 5.exe" "%GAME_JSON%"
    exit /b 0
)

where gdevelop >nul 2>nul
if %errorlevel% equ 0 (
    echo [+] Found GDevelop in PATH. Launching...
    start "" gdevelop "%GAME_JSON%"
    exit /b 0
)

echo [*] GDevelop not found in standard paths. Opening game.json with default application...
start "" "%GAME_JSON%"
echo If GDevelop 5 is not installed, download it for free from: https://gdevelop.io/download
echo.
pause
