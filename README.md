# Five Nights at Freddy's 1 (Web & GDevelop)

A fan recreation of the original **Five Nights at Freddy's 1**. It runs right in your browser (HTML5 Canvas) and can also be opened and edited in **GDevelop 5**.

Everything from the original game is here:
- **Campaign (Nights 1 to 5)** with Phone Guy's calls
- **Night 6** for an extra challenge
- **Custom Night** with 0–20 AI difficulty sliders (including the 20/20/20/20 challenge)
- **Extra Menu** with animatronic descriptions and a quick night selector
- **Star progression** saved locally (1 star for Night 5, 2 stars for Night 6, 3 stars for 20/20/20/20)

---

## How to Play

### Windows
- Double-click **`launch_web.bat`** (or **`web.bat`**) to start the game in your default browser.
- If you have GDevelop 5 installed, double-click **`launch_gdevelop.bat`** (or **`gdevelop.bat`**) to open the project in the editor.

### Linux
- Run `./preview.sh` to start the local server and open `http://localhost:8080/`.
- Run `./gdevelop.sh` to open the game in GDevelop 5.

*(You can also just double-click `index.html` to open it directly in most modern browsers).*

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
- **Golden Freddy**: A rare hallucination. If he appears sitting in your office, flip your camera monitor up immediately to make him vanish.

---

## File Structure

Here is what every file in this repository does:

- **`index.html`**: The main game engine. Everything runs in this single file using HTML5 Canvas and the Web Audio API (game loop, graphics, sound effects, AI, menus). No external libraries or npm packages needed.
- **`game.json`**: The GDevelop 5 project file. You can import this into GDevelop to inspect the scene structure or build desktop packages.
- **`server.py`**: A simple local Python web server that serves the game files and handles progress saving.
- **`manage_save.py`**: A small CLI script to view, reset, or edit your save file (stars, nights unlocked).
- **`preview.sh`**: Linux helper script to run the local server and open your browser.
- **`gdevelop.sh`**: Linux helper script to launch GDevelop 5 with `game.json`.
- **`launch_web.bat` / `web.bat`**: Windows launcher for the web version.
- **`launch_gdevelop.bat` / `gdevelop.bat`**: Windows launcher for GDevelop 5.
- **`generate_fnam.py`**: Helper script to generate or update `game.json` based on the assets folder.
- **`download_hd_assets.py`**: Helper script used to download and set up image and sound files.
- **`assets/`**:
  - `assets/sprites/`: All textures (office rooms, camera views, fan animation, door animations, jumpscares).
  - `assets/audio/`: All sound effects (ambient office hum, footsteps, door motors, Phone Guy calls, jumpscares).
  - `assets/fonts/`: Retro fonts used in the interface.
- **`IMPORTANT.md`**: Legal notice and credits.
- **`MOVEMENT.md`**: Detailed breakdown of movement tick rates and timers.
- **`LICENSE`**: The GNU General Public License v3.0 text.
- **`.gitignore`**: Ignores temporary caches, OS files, and local logs.

---

## Credits & License

- **Five Nights at Freddy's**, its characters, story, sounds, and original game mechanics were created by and belong to **Scott Cawthon**. This is a free, non-commercial fan recreation made for fun and educational purposes.
- All visual and audio assets are from game preservation archives and open sources. No AI generation tools were used.
- The code is licensed under the **GNU General Public License v3.0 (GPLv3)**. Feel free to fork, study, or adapt the code.
