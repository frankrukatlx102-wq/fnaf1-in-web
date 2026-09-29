# Five Nights at Freddy's (Authentic FNaF 1 HD Engine)

A faithful, high-definition recreation of Scott Cawthon's classic survival horror game built from scratch without third-party game frameworks. Includes both a standalone browser engine (`index.html`) and an exportable GDevelop 5 project structure (`game.json`).

Licensed under the **GNU General Public License v3.0 (GPLv3)**.

**Strict Non-Generative Asset Policy**: 100% of visual and audio assets are authentic public domain, Creative Commons, and original preservation dumps. Zero generative AI media was used. All original intellectual property and character rights belong to **Scott Cawthon**.

---

## Repository File Structure & Component Breakdown

Each file in this repository serves a specific, isolated role in the project architecture:

### Core Game Engines & Project Files
- **[`index.html`](index.html)**: **The Primary Web Engine**. A standalone, single-file Full HD (1920x1080) game engine. Contains the complete Canvas 2D hardware-accelerated rendering pipeline, analog CRT scanline and animated static noise filters, Web Audio API sound mixer, state machines, animatronic movement opportunity loops, campaign progression (Nights 1–6), Custom Night, Extra archive, and the Neverlose-style developer debug suite. Zero external npm or framework dependencies.
- **[`game.json`](game.json)**: **GDevelop 5 Project Specification**. Full native JSON project tree containing scenes, objects, layers, sprite animation definitions, fonts, sound mappings, and events. Can be directly opened, edited, and exported into desktop binaries (Windows/Linux/Mac) through GDevelop 5.

### Server & Save Infrastructure
- **[`server.py`](server.py)**: **HTTP Server & Secure Vault**. Lightweight Python server with a built-in cryptographic HMAC-SHA256 save vault on port 8080. Handles static asset delivery and synchronizes campaign progress between the client and disk storage.
- **[`manage_save.py`](manage_save.py)**: **CLI Save Management Tool**. Terminal utility for inspecting cryptographic checksums, resetting shift progress, or unlocking custom night and campaign stars for testing.

### Automated Tooling & Asset Generators
- **[`generate_fnam.py`](generate_fnam.py)**: **GDevelop Project Compiler**. A Python script that scans the `/assets/` directory (sprites, sounds, fonts) and compiles a validated, cleanly structured `game.json` project for GDevelop 5.
- **[`download_hd_assets.py`](download_hd_assets.py)**: **Asset Acquisition Tool**. Utility script to fetch and verify high-definition sprites, full animation sequences (including the complete 21-frame blackout jumpscare), and audio stingers from preservation repositories.

### Cross-Platform Launchers
- **[`preview.sh`](preview.sh)**: **Linux Web Preview Launcher**. Bash script that launches the local Python preview server on port 8080 and automatically opens the game in your default browser.
- **[`gdevelop.sh`](gdevelop.sh)**: **Linux GDevelop 5 Launcher**. Bash script that locates the GDevelop 5 binary (local directory, system PATH, or Flatpak) and launches `game.json`.
- **[`launch_web.bat`](launch_web.bat)** / **[`web.bat`](web.bat)**: **Windows Web Launcher**. Batch scripts that detect Python/Py, start the local server, and launch the browser. If Python is absent, opens `index.html` directly in the default browser.
- **[`launch_gdevelop.bat`](launch_gdevelop.bat)** / **[`gdevelop.bat`](gdevelop.bat)**: **Windows GDevelop Launcher**. Batch scripts that scan standard Windows paths (`%LOCALAPPDATA%`, `%ProgramFiles%`, `%ProgramFiles(x86)%`, `PATH`) and launch `game.json` in GDevelop 5.

### Documentation & Legal
- **[`README.md`](README.md)**: **Project Overview**. Complete architectural summary, component breakdown, gameplay features, and multiplatform setup guide.
- **[`IMPORTANT.md`](IMPORTANT.md)**: **Open Source Notice & Legal Credits**. Details on the 100% open-source nature of the project, freedom for community modification, asset preservation policies, and formal copyright attribution to Scott Cawthon.
- **[`MOVEMENT.md`](MOVEMENT.md)**: **AI & Movement Opportunity Guide**. Exhaustive mathematical and timing reference covering tick intervals, movement opportunity formulas ($R \in [1, 20] \le \text{Level}$), character routes, camera stalling, and door blindspot mechanics.
- **[`LICENSE`](LICENSE)**: **GNU General Public License v3.0**. Copyleft license ensuring all source code remains free and open for the community.
- **[`.gitignore`](.gitignore)**: **Git Ignore Rules**. Prevents local caches, environment files, and temporary artifacts from polluting the repository.

### Game Assets (`/assets/`)
- **`assets/audio/`**: 40+ low-latency `.ogg` and `.wav` sound files: metallic footsteps, camera flip switch, door motor hums, Phone Guy messages (Nights 1–5), Toreador March, jumpscare screams, and 6 AM chimes.
- **`assets/fonts/`**: Authentic TTF typography including VT323, Special Elite, Creepster, and Inconsolata.
- **`assets/sprites/`**: 180+ HD textures (1920x1080 and 1600x720): 11 camera room feeds, office variants, 3-frame animated desk fan, 16-frame door transitions, 21-frame blackout jumpscare sequence, radar icons, and easter egg posters (Golden Freddy and Freddy tearing his head off).

---

## Technical Specifications

- **Native Resolution**: 1920x1080 (Full HD @ 60 FPS) with dynamic 16:9 aspect preservation
- **Audio Pipeline**: Web Audio API low-latency spatial mixer
- **Save Integrity**: Cryptographic HMAC-SHA256 authenticated save format (FCV-2)
- **Developer Suite**: Built-in Neverlose-style debug and cheat panel (`[C]` key / `[🛠️ DEV]` button)

---

## Key Gameplay Systems

### 1. Authentic Movement Opportunity & Cadence
- **Freddy Fazbear**: 3.02s tick cadence. Freezes when watched through cameras (Camera Stall). Sneaks into the office from CAM 4B corner when the monitor is lowered and the right door is open. Depleting battery triggers the 3-stage blackout sequence with music box and full 21-frame jumpscare.
- **Bonnie**: 4.97s tick cadence. Wanders unpredictably through the dining area, backstage, and supply closet before approaching the left door. Disappears from CAM 2B into the window blindspot. If left unaddressed, slips inside and permanently jams the left door buttons.
- **Chica**: 4.98s tick cadence. Lingers in the Kitchen (CAM 6) creating audio clattering cues. Approaches the right door blindspot window and jams controls if ignored.
- **Foxy**: 5.01s tick cadence. Progresses through 4 Pirate Cove stages. Opening the monitor stalls his countdown; directly viewing CAM 1C adds heavy delays (8–14s). Sprints down West Hall CAM 2A, requiring the left door to be shut within 3.5 seconds.
- **Golden Freddy**: Rare supernatural manifestation triggered via the CAM 2B poster or low-chance roll on Nights 5+. Must flip the monitor back up within 1.2 seconds to banish him, or face a 9.35-second fatal crash screen.

### 2. Campaign & Custom Night
- **Nights 1–5**: Canonical progression with Phone Guy calls on all five nights.
- **Night 6 (Nightmare Shift)**: High-speed aggressive challenge (unlocks 1st star).
- **Custom Night (Night 7)**: Full AI level adjustment (0–20) for all four main animatronics with presets (20/20/20/20, 10/10/10/10, pacifist), unlocking the 2nd and 3rd stars.
- **Extra Menu**: Character dossiers, audio player, and custom shift selector.

### 3. Integrated Developer & Diagnostic Suite (`[C]` key)
- Live AI level adjustments and presets
- Real-time radar ESP overlay with door warnings
- Instant power replenishment and infinite power toggle
- Force-spawn easter eggs: Golden Freddy, CAM 2B posters, CAM 4B newspaper clippings, "IT'S ME" hallucination flashes

---

## Quickstart & Launching

### On Linux:
```bash
# Start local preview server (opens http://localhost:8080/):
./preview.sh

# Or open in GDevelop 5:
./gdevelop.sh
```

### On Windows:
- Double-click **`launch_web.bat`** (or `web.bat`) to run the browser version.
- Double-click **`launch_gdevelop.bat`** (or `gdevelop.bat`) to open in GDevelop 5.

---

## Legal & Licensing

- **Code License**: This project is licensed under the [GNU General Public License v3.0](LICENSE).
- **Intellectual Property**: All original characters, names, settings, audio motifs, and lore belong exclusively to **Scott Cawthon**. This project is a non-commercial, open-source preservation and educational recreation.
