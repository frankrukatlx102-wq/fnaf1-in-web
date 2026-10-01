# Five Nights at Freddy's 1 (Web Edition)

A faithful fan recreation of the original **Five Nights at Freddy's 1**, running directly in your browser via HTML5 Canvas and Web Audio API.

Everything from the original game is here:
- **Campaign (Nights 1 to 5)** with Phone Guy's calls
- **Night 6** for an extra challenge
- **Custom Night** with 0–20 AI difficulty sliders (including the 20/20/20/20 challenge)
- **Extra Menu** with animatronics gallery, sound tests, and night selector
- **Star progression** saved locally (1 star for Night 5, 2 stars for Night 6, 3 stars for 20/20/20/20)
- **Data Integrity System** (transparent SHA-256 checksums on save envelopes)

---

## How to Play

### Linux / macOS
- Run `./preview.sh` to start the local server and open `http://localhost:8080/`.

### Windows
- Double-click **`launch_web.bat`** (or **`web.bat`**) to start the game in your default browser.

*(You can also double-click `index.html` to open it directly via `file://` in any modern browser).*

---

## Controls & Mechanics

- **Mouse**: Move left/right to pan your office view. Click the red door button to close/open doors, and the white light button to check hallway blindspots.
- **Bottom Bar**: Hover or click the bottom bar to open/close the camera monitor.
- **Power**: You start with 100% battery each night. Every closed door, active light, or open camera drains battery faster. If power runs out, Freddy plays the music box during a 3-stage blackout sequence.
- **Cameras**: 11 rooms to monitor:
  - **Show Stage (CAM 1A)**: Where Freddy, Bonnie, and Chica start.
  - **Pirate Cove (CAM 1C)**: Where Foxy hides. Keep an eye on him to slow him down!
  - **West Hall & Corner (CAM 2A / 2B)**: Left side hallway leading to your office.
  - **East Hall & Corner (CAM 4A / 4B)**: Right side hallway leading to your office.
  - **Kitchen (CAM 6)**: Camera feed is audio only (clattering pots when Chica is inside).
  - **Dining Area (CAM 1B), Backstage (CAM 5), Restrooms (CAM 7), Supply Closet (CAM 3)**.

---

## Animatronics Behavior

- **Freddy Fazbear**: Moves on later nights. Sneaks through dining, restrooms, kitchen, and right hallway corner (CAM 4B). He freezes while watched on camera and laughs with every step.
- **Bonnie**: Roams the left side of the pizzeria. Appears in the left door window. Shut the door to make him retreat back down the hall.
- **Chica**: Roams the right side and lingers in the kitchen. Appears in the right door window. Shut the door to make her walk away.
- **Foxy**: Hides behind the curtains in Pirate Cove. If unwatched, he will peek out, leave the cove, and sprint down the west hall. Shut the left door when you hear footsteps!
- **Golden Freddy**: A rare supernatural manifestation. If he appears sitting in your office, flip your camera monitor up immediately to make him vanish.

---

## Project Structure & Modules

The web engine is split into clean, modular components inside `src/`:

- **`index.html`**: HTML5 entry point with responsive 16:9 canvas and CRT scanline overlay.
- **`src/`**:
  - **`src/save.js`**: Save state persistence (`localStorage` + backend `/api/save`) and SHA-256 data integrity checks.
  - **`src/audio.js`**: Web Audio sound loader, looping background streams, and Phone Guy voice sequencer.
  - **`src/state.js`**: Canvas context, sprite preloader, camera map layouts, and global game state object (`G`).
  - **`src/ai.js`**: Scott Cawthon-style movement opportunity engine, hourly difficulty scaling, and animatronics roaming state machines.
  - **`src/office.js`**: Office edge panning, door and light mechanics, power consumption, 3-stage blackout protocol, and camera feed selector.
  - **`src/render.js`**: Canvas 2D render loop (office, camera feeds, scanlines, menus, Custom Night, Extra gallery, and jumpscares).
  - **`src/game.js`**: Shift lifecycles, mouse/keyboard input event handling, and main `requestAnimationFrame` update loop.
- **`server.py`**: Local Python HTTP server providing asset delivery and save synchronization.
- **`preview.sh`**: Linux helper launcher script.
- **`launch_web.bat` / `web.bat`**: Windows helper launcher scripts.
- **`download_hd_assets.py`**: Asset downloader and converter that fetches textures and audio from public game preservation repositories of the same format and structure, converting audio to low-latency OGG and WAV formats via ffmpeg.
- **`manage_save.py`**: CLI utility for inspecting, resetting, or verifying save data envelopes.
- **`IMPORTANT.md`**: Credits and legal copyright notice.
- **`MOVEMENT.md`**: Breakdown of AI tick intervals and movement probability.
- **`LICENSE`**: GNU General Public License v3.0 (GPLv3).

---

## Credits & License

- **Five Nights at Freddy's**, its characters, story, sounds, and original game mechanics were created by and belong to **Scott Cawthon**. This is a free, non-commercial fan recreation made for preservation and educational purposes.
- All visual and audio assets are from game preservation archives and open sources. No AI generation tools were used.
- The code is licensed under the **GNU General Public License v3.0 (GPLv3)**.
