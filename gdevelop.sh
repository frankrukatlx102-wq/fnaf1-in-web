#!/usr/bin/env bash
set -e

# =========================================================================
# Five Nights at Maler - GDevelop 5 Project Launcher
# =========================================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GAME_JSON="$PROJECT_DIR/game.json"

echo "========================================================="
echo "   FIVE NIGHTS AT MALER — GDEVELOP 5 PROJECT LAUNCHER"
echo "========================================================="
echo "Project file: $GAME_JSON"

if [ ! -f "$GAME_JSON" ]; then
    echo "[-] Error: game.json not found! Regenerating with generate_fnam.py..."
    python3 "$PROJECT_DIR/generate_fnam.py"
fi

# 1. Check local gdevelop binary
if [ -x "/home/yurist/.local/bin/gdevelop" ]; then
    echo "[+] Launching GDevelop via /home/yurist/.local/bin/gdevelop..."
    exec "/home/yurist/.local/bin/gdevelop" "$GAME_JSON" "$@"
fi

# 2. Check system PATH
if command -v gdevelop &>/dev/null; then
    echo "[+] Launching GDevelop via PATH..."
    exec gdevelop "$GAME_JSON" "$@"
fi

# 3. Check Flatpak
if command -v flatpak &>/dev/null && flatpak info io.gdevelop.ide &>/dev/null; then
    echo "[+] Launching GDevelop via Flatpak..."
    exec flatpak run io.gdevelop.ide "$GAME_JSON" "$@"
fi

# 4. Fallback to xdg-open
echo "[*] Fallback: opening with system default handler..."
exec xdg-open "$GAME_JSON"
