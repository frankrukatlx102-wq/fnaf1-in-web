# Open Source Notice & Legal Credits

---

## 🔓 100% Open Source & Ready for Modification

- **Complete Openness**: The source code of this project (**Five Nights at Freddy's: Authentic FNaF 1 HD Engine**) is 100% open source, unminified, unobfuscated, and cleanly structured for study and modification.
- **Freedom to Customize**: You are completely free to modify, expand, rebalance difficulty, add custom nights, replace audio or sprites, and port the engine to any platform (Electron, Tauri, Cordova, Android, Steam, etc.).
- **License**: The engine codebase and implementation scripts are released under open-source MIT / Public Domain principles.

---

## 🎨 Open Data & Strict Non-Generative Asset Policy

- **All Data from Open Sources**: All textures, sprites, audio cues, ambient sounds, jumpscares, and typography used in this project were gathered exclusively from open public preservation repositories, Creative Commons libraries, and public domain retro fonts.
- **Zero Generative Content**: Absolutely no generative imagery or synthetic audio was utilized. Everything adheres to strict authentic game preservation standards.

---

## ⚖️ Original Rights & Intellectual Property

> **All original intellectual property, trademarks, lore, characters (Freddy Fazbear, Bonnie, Chica, Foxy, Golden Freddy, Phone Guy), world design, and original gameplay mechanics belong solely to Scott Cawthon.**
>
> This project is a non-commercial, open-source community preservation tribute and engine recreation made for developers, educators, and fans of classic survival horror.

---

## 🛠️ Engine Architecture Overview

1. **Standalone Single-File Web Engine (`index.html`)**:
   - Hardware-accelerated Canvas 2D rendering at 1920x1080 (Full HD @ 60 FPS).
   - Dynamic 16:9 aspect preservation with automatic centering.
   - Dual-layer CRT scanline overlay with dynamic television static grain.
   - Web Audio API low-latency mixer for ambient hums, footsteps, door motors, and stingers.

2. **Faithful Movement Opportunity & Cadence System**:
   - Independent tick timers: Freddy (3.02s), Bonnie (4.97s), Chica (4.98s), Foxy (5.01s).
   - Authentic random movement roll $R \in [1, 20] \le \text{Effective\_Level}$.
   - Corner stalling, camera monitoring delays, door blindspot windows, and complete 21-frame blackout sequence.

3. **Cryptographic Save Vault (FCV-2)**:
   - Tamper-proof HMAC-SHA256 authenticated save file format with nonce validation to protect campaign and custom night star achievements.

4. **In-Game Developer & Diagnostic Panel (`[C]` key)**:
   - Live character level adjustments, radar ESP, battery manipulation, time controls, and direct easter egg spawns.

---

## 🚀 Cross-Platform Launchers

### On Linux:
- **Web Browser**: `python3 server.py` (open `http://localhost:8080/`) or `./preview.sh`
- **GDevelop 5**: `./gdevelop.sh`

### On Windows:
- **Web Browser**: Double-click `launch_web.bat` or `web.bat`
- **GDevelop 5**: Double-click `launch_gdevelop.bat` or `gdevelop.bat`
