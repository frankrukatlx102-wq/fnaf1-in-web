#!/usr/bin/env bash
set -e

# Five Nights at Freddy's - GDevelop 5 Project Launcher

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GAME_JSON="$PROJECT_DIR/game.json"

echo "Five Nights at Freddy's - GDevelop 5 Launcher"
echo "Project file: $GAME_JSON"

if [ ! -f "$GAME_JSON" ]; then
    echo "game.json not found, generating with generate_fnaf.py..."
    python3 "$PROJECT_DIR/generate_fnaf.py"
fi

if [ -x "$HOME/.local/bin/gdevelop" ]; then
    echo "Launching GDevelop via local binary..."
    exec "$HOME/.local/bin/gdevelop" "$GAME_JSON" "$@"
fi

if command -v gdevelop &>/dev/null; then
    echo "Launching GDevelop via PATH..."
    exec gdevelop "$GAME_JSON" "$@"
fi

if command -v flatpak &>/dev/null && flatpak info io.gdevelop.ide &>/dev/null; then
    echo "Launching GDevelop via Flatpak..."
    exec flatpak run io.gdevelop.ide "$GAME_JSON" "$@"
fi

echo "Opening project with default handler..."
exec xdg-open "$GAME_JSON"
