@echo off
title Five Nights at Freddy's - Web Engine Launcher
cd /d "%~dp0"

echo Five Nights at Freddy's - Web Engine Launcher
echo.

where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Python detected. Launching local game server...
    start "" http://localhost:8080/
    python server.py 8080
    goto end
)

where py >nul 2>nul
if %errorlevel% equ 0 (
    echo Python launcher detected. Launching local game server...
    start "" http://localhost:8080/
    py server.py 8080
    goto end
)

echo Python not found in PATH. Opening index.html directly in your default browser...
start "" "%~dp0index.html"

:end
