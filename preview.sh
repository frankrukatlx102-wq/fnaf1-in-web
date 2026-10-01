#!/bin/bash
# Five Nights at Freddy's - Web Preview Launcher
cd "$(dirname "$0")"

PORT=8080
echo "Five Nights at Freddy's (HTML5 Web Engine)"
echo "Game URL: http://localhost:$PORT/"
echo "Starting local preview server... (Press Ctrl+C to exit)"
echo ""

if which xdg-open >/dev/null 2>&1; then
    (sleep 1 && xdg-open "http://localhost:$PORT/") &
fi

exec python3 server.py $PORT
