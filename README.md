# Five Nights at Maler (FNaF 1 Clone in GDevelop 5)

Scott Cawthon style survival horror game foundation built from scratch for GDevelop 5 on Arch Linux.
**Strict Non-Generative Asset Policy**: 100% of visual and audio assets are authentic Creative Commons, Open Source, and public domain game preservation assets.

---

## Technical Specifications

- **Native Resolution**: **1920x1080 (Full HD @ 60 FPS)**
- **Target Engine**: GDevelop 5 (Native JSON format `game.json` + modular event sheets)
- **Standalone Web Engine**: HTML5 / Canvas 2D + Web Audio API (`index.html`)
- **OS**: Arch Linux (verified with `gdevelop`, `node`, `imagemagick`, `ffmpeg`)

---

## Project Structure

```
five-nights-at-maler/
├── game.json                 # Validated GDevelop 5 Full HD Project (1920x1080)
├── CoreGameLoop.json         # Clock (12 AM - 6 AM), Power drain, Blackout sequence
├── OfficeInteraction.json    # Mouse panning, Doors, Hallway lights, Tablet flip
├── CameraSystem.json         # 11 Camera feeds, Static CRT overlay, Minimap
├── EnemyAI.json              # 4.97s Tick cadence, 1-20 roll, 5 Animatronics AI
├── AudioEngine.json          # Sound mixer, spatial cues & stingers
├── index.html                # Standalone Full HD 1080p playable build
├── preview.sh                # One-click preview & launcher script
├── generate_fnam.py          # Automated GDevelop 5 project generator
└── assets/
    ├── audio/                # 40+ Sound effects (.ogg & .wav) including Phone Guy
    ├── fonts/                # TTF horror/brutalist fonts (VT323, Creepster, Special Elite)
    └── sprites/              # 180+ HD textures, camera states, animations, jumpscares & UI
```

---

## Core Systems & New Features

### 1. Authentic Phone Guy (Фонгай)
- **Full Night 1 Phone Call**: Original message from Phone Guy ("Hello, hello? Uh, I wanted to record a message for you...") starts after 2.5 seconds at 12:00 AM (`phone_guy_night1.ogg`).
- **Interactive "MUTE CALL" Button**: Authentic red/white Mute Call button (`mute_call.png`) appears at the top-left of the screen during the call. Clicking it immediately silences Phone Guy.

### 2. Canonical FNaF 1 AI Progression per Night
- **Night 1 (Canonical Balance)**:
  - **Maler (Freddy)**: Level 0 (stays on stage all night, attacks only if power goes out).
  - **Dash (Foxy)**: Level 0 (stays dormant behind Pirate Cove curtain all night).
  - **Karkas (Bonnie)**: Starts at Level 0 (12 AM - 2 AM), rises to Level 1 at 2 AM, Level 2 at 3 AM, Level 3 at 4 AM.
  - **Plague (Chica)**: Starts at Level 0 (12 AM - 3 AM), rises to Level 1 at 3 AM.
- **Subsequent Nights**: Full difficulty curve with active Foxy and Freddy movement, night continuation, and hourly boosts (+1 difficulty at 2 AM, 3 AM, 4 AM).

### 3. Fair Door, Corner & Blindspot System
- **Corner Stage (CAM 2B & 4B)**: Animatronics are visible at the corner outside the hallway door.
- **Blindspot Stage (Doorway Window)**:
  - When moving from the corner, they step into the **Blindspot** and disappear from CAM 2B / 4B!
  - They are only visible by turning on the Door Light, triggering `windowscare.ogg`.
  - **Fair Retreat Timer**: If the player shuts the door, after 2.5 seconds they pound the door (`door_pound.ogg`) and retreat to the dining area.
  - **Office Infiltration & Jammed Buttons**: If the door is left open for 5.5 seconds (or if the monitor is flipped up while they are in the blindspot), they slip inside and jam the door buttons. Lowering the monitor triggers the jumpscare!

### 4. Visual Perfection, Authentic Typography & Hitbox
- **Official Desk Fan Animation**: Replaced glitchy frames with the authentic 3-frame animation from The Spriters Resource (`fan_1..3.png`), spinning smoothly at 55ms/frame at exact desk coordinates `(ox + 1170, 455, 207, 294)`. Zero seams, zero flickering.
- **Authentic FNaF 1 White Typography**: HUD fonts for time ("12 AM"), night indicator ("Night 1"), "Power left: 100%", and "Usage: " are crisp authentic white (`#ffffff`). The usage meter displays color-coded energy blocks (green -> yellow -> red), and the monitor flip bar features an authentic white/gray border and text.
- **Canonical FNaF 1 Minimap (No Elevator)**: Completely eliminated custom/fan maps with elevators. Uses the authentic FNaF 1 `complete_map.png` floorplan with all 11 rooms mapped directly to interactive buttons. Inactive buttons seamlessly blend into the map while selected buttons highlight with bright green.
- **Spammable Freddy Nose Easter Egg**: Centered at `(ox + 1016, 357)` with an expanded 60px hitbox and instant audio rewind (`freddy_nose.ogg`), enabling rapid "honk honk" spamming.

### 5. Backstage (CAM 5) Variations & Easter Eggs
- **Normal Backstage**: Authentic room with spare heads and endoskeleton facing away (`backstage.png`).
- **Bonnie in Backstage**: Bonnie standing in the room (`backstage-b.png`), with a chance to stare close-up into the camera lens (`backstage_bonnie_stare.png`).
- **Staring Heads Hallucination**: Rare chance when CAM 5 is empty for all the heads and endoskeleton to turn and stare directly into the camera (`backstage_heads_stare.png`).
- **High-Definition Canonical Sparky Hoax**: Displays the exact viral hoax screenshot (`https://i.imgur.com/L9Csk64.png`) unblurred and scaled to Full HD 1920x1080 (`cam_5_sparky.png`), accessible as an easter egg on CAM 5 when Bonnie is elsewhere.

---

## How to Run

### 1. Standalone HTML5 Browser Preview
To test and play the game immediately in your browser:
```bash
/home/yurist/five-nights-at-maler/preview.sh
```
Then open `http://localhost:8080/`.

### 2. In GDevelop 5 GUI
To open and edit the project visually in GDevelop 5:
```bash
~/.local/bin/gdevelop /home/yurist/five-nights-at-maler/game.json
```
or run:
```bash
/home/yurist/five-nights-at-maler/preview.sh --gdevelop
```
