# Five Nights at Freddy's 1 (Web & GDevelop)

A faithful fan recreation of the original **Five Nights at Freddy's 1**. It runs directly in your browser (HTML5 Canvas & Web Audio API) and can also be opened and edited in **GDevelop 5**.

Everything from the original game is here:
- **Campaign (Nights 1 to 5)** with Phone Guy's calls
- **Night 6** for an extra challenge
- **Custom Night** with 0–20 AI difficulty sliders (including the 20/20/20/20 challenge)
- **Extra Menu** with animatronic dossiers, signature soundboards, and a night selector
- **Star progression** saved locally (1 star for Night 5, 2 stars for Night 6, 3 stars for 20/20/20/20)
- **Data Integrity System** (transparent SHA-256 checksums on save envelopes)

---

## How to Play

### Windows
- Double-click **`launch_web.bat`** (or **`web.bat`**) to start the game in your default browser.
- If you have GDevelop 5 installed, double-click **`launch_gdevelop.bat`** (or **`gdevelop.bat`**) to open the project in the editor.

### Linux
- Run `./preview.sh` to start the local server and open `http://localhost:8080/`.
- Run `./gdevelop.sh` to open the game in GDevelop 5.

*(You can also just double-click `index.html` to open it directly via `file://` in any modern browser).*

---

## Controls & Mechanics

- **Mouse**: Move left/right to pan your office view. Click the red door button to close/open doors, and the white light button to check hallway blindspots.
- **Bottom Bar**: Hover or click the bottom bar to open/close the camera monitor.
- **Power**: You start with 100% battery each night. Every closed door, active light, or open camera drains battery faster. If you run out of power, the lights go out, Freddy plays the music box, and you're in trouble.
- **Cameras**: 11 rooms to monitor:
  - **Show Stage (CAM 1A)**: Where Freddy, Bonnie, and Chica start.
  - **Pirate Cove (CAM 1C)**: Where Foxy hides. Keep an eye on him to slow him down!
  - **West Hall & Corner (CAM 2A / 2B)**: Left side hallway leading to your office.
  - **East Hall & Corner (CAM 4A / 4B)**: Right side hallway leading to your office.
  - **Kitchen (CAM 6)**: Camera feed is broken, but you can hear audio cues (clattering pots when Chica is inside).
  - **Dining Area (CAM 1B), Backstage (CAM 5), Restrooms (CAM 7), Supply Closet (CAM 3)**.

---

## Animatronics Behavior

- **Freddy Fazbear**: Starts moving on Night 3. Sneaks through the dining area, restrooms, kitchen, and right hallway corner (CAM 4B). He only moves when the camera isn't looking at him, and laughs with every step. If you look at him on camera, he freezes.
- **Bonnie**: Roams the left side of the building. He can move unpredictably and will eventually show up in your left door window. Close the door when you see him; once the door is shut, he'll leave within a few seconds.
- **Chica**: Roams the right side and loves making noise in the kitchen. She appears in your right door window. Shut the door to make her walk away.
- **Foxy**: Hides behind the curtains in Pirate Cove. If you don't check the cameras often enough, he will peek out, leave the cove, and sprint down the west hall. Shut the left door immediately when you hear running footsteps!
- **Golden Freddy**: A rare supernatural manifestation. If he appears sitting in your office, flip your camera monitor up immediately to make him vanish.

---

## Project Structure & Modules

The web engine is split into clean, modular components inside `src/`:

- **`index.html`**: Lightweight HTML5 entry point. Configures the 16:9 responsive container, CRT shader overlay, and scripts.
- **`src/`**:
  - **`src/save.js`**: Save state persistence (`localStorage` + backend `/api/save`) and SHA-256 data integrity checks.
  - **`src/audio.js`**: Web Audio sound loader, looping background streams, and Phone Guy voice sequencer.
  - **`src/state.js`**: Canvas context, sprite preloader, camera map layouts, and global game state object (`G`).
  - **`src/ai.js`**: Scott Cawthon-style movement opportunity engine, hourly difficulty scaling, and animatronics roaming state machines.
  - **`src/office.js`**: Office edge panning, door and light mechanics, power consumption, 3-stage blackout protocol, and camera feed selector.
  - **`src/render.js`**: Complete Canvas 2D render loop (office, camera feeds, scanlines, menus, Custom Night, Extra dossiers, and jumpscares).
  - **`src/game.js`**: Shift lifecycles, mouse/keyboard input event handling, and main `requestAnimationFrame` update loop.
- **`game.json`**: The GDevelop 5 project file. You can import this into GDevelop to inspect scene structures or export desktop builds.
- **`download_hd_assets.py`**: Asset downloader and converter. Sourced from public game preservation repositories of the same format and structure, converting audio to low-latency OGG and WAV formats via ffmpeg.
- **`generate_fnaf.py`**: Automated generator that builds the complete 1920x1080 GDevelop 5 project (`game.json` and modular event files).
- **`server.py`**: Local Python HTTP server providing asset delivery and save synchronization.
- **`manage_save.py`**: CLI utility for inspecting, resetting, or verifying save data envelopes.
- **`preview.sh` / `gdevelop.sh`**: Linux helper launcher scripts.
- **`launch_web.bat` / `launch_gdevelop.bat`**: Windows helper launcher scripts (`web.bat` and `gdevelop.bat` provide quick aliases).
- **`IMPORTANT.md`**: Credits and legal copyright notice.
- **`MOVEMENT.md`**: Breakdown of AI tick intervals and movement probability.
- **`LICENSE`**: GNU General Public License v3.0 (GPLv3).

---

## Credits & License

- **Five Nights at Freddy's**, its characters, story, sounds, and original game mechanics were created by and belong to **Scott Cawthon**. This is a free, non-commercial fan recreation made for preservation and educational purposes.
- All visual and audio assets are from game preservation archives and open sources. No AI generation tools were used.
- The code is licensed under the **GNU General Public License v3.0 (GPLv3)**.
