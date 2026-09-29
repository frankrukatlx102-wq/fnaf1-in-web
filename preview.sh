#!/bin/bash
# Five Nights at Maler - Launcher & Preview Script
cd "$(dirname "$0")"

PORT=8080
echo "=========================================================="
echo "    FIVE NIGHTS AT MALER (GDevelop 5 Arch Linux Build)    "
echo "=========================================================="
echo ""
echo "[1] GDevelop Project File:  $(pwd)/game.json"
echo "[2] HTML5 Preview:          http://localhost:$PORT/"
echo ""

if [ "$1" == "--gdevelop" ] || [ "$1" == "-g" ]; then
    echo "Opening GDevelop 5 GUI..."
    ~/.local/bin/gdevelop "$(pwd)/game.json" &
    exit 0
fi

echo "Starting local preview server on port $PORT..."
echo "Press Ctrl+C to stop the preview server."

# Try opening default browser in background if xdg-open exists
if which xdg-open >/dev/null 2>&1; then
    (sleep 1 && xdg-open "http://localhost:$PORT/") &
fi

python3 server.py $PORT
