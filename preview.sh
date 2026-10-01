#!/bin/bash
# Five Nights at Freddy's - Launcher & Preview Script
cd "$(dirname "$0")"

PORT=8080
echo "Five Nights at Freddy's (FNaF 1 HD Engine Build)"
echo "GDevelop Project File: $(pwd)/game.json"
echo "HTML5 Preview:         http://localhost:$PORT/"
echo ""

if [ "$1" == "--gdevelop" ] || [ "$1" == "-g" ]; then
    echo "Opening GDevelop 5 GUI..."
    ~/.local/bin/gdevelop "$(pwd)/game.json" &
    exit 0
fi

echo "Starting local preview server on port $PORT..."
echo "Press Ctrl+C to stop the preview server."

if which xdg-open >/dev/null 2>&1; then
    (sleep 1 && xdg-open "http://localhost:$PORT/") &
fi

python3 server.py $PORT
