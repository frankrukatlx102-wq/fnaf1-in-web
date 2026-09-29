# Animatronic Movement & Opportunity System

Documentation for animatronic tick rates, state machines, and movement mechanics in Five Nights at Freddy's HD Engine.

---

## 1. Core Mechanics Overview

The movement engine replicates Scott Cawthon's classic FNaF 1 system:
1. Each animatronic operates on an **independent timer (tick cadence)**.
2. When the timer elapses, the engine rolls a **Movement Opportunity**.
3. If successful, the character steps along a designated path or executes a state change.

```
       Tick Timer Expires (e.g. every 4.97s)
                       │
                       ▼
         Roll Random Integer R in [1, 20]
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
    R <= Effective_AI     R > Effective_AI
       [SUCCESS]              [FAILURE]
           │                      │
  Advance position or      Reset timer and
  perform door action       wait next tick
```

---

## 2. Mathematical Parameters & Cadence

| Character | Cadence (Seconds) | Starting Room | Attack Vector | Special Condition |
| :--- | :--- | :--- | :--- | :--- |
| **Freddy Fazbear** | `3.02s` | CAM 1A (Show Stage) | Right Door (CAM 4B) | Stalled while camera room is watched; silent footsteps with laugh |
| **Bonnie** | `4.97s` | CAM 1A (Show Stage) | Left Door Window | Erratic backward/forward wandering; jams buttons if ignored |
| **Chica** | `4.98s` | CAM 1A (Show Stage) | Right Door Window | Kitchen pot clattering; jams buttons if ignored |
| **Foxy** | `5.01s` | CAM 1C (Pirate Cove) | Left Hallway Sprint | 4 Cove stages; stalled by any camera view; drains power on door hit |
| **Golden Freddy** | Event-based | Office (Direct) | Inside Office | Banished by raising camera within 1.2s; triggered by CAM 2B poster |

### Movement Opportunity Formula:
```javascript
function checkMovementOpportunity(level) {
  if (level <= 0) return false;
  if (G.initialGraceTimer > 0) return false;
  if (G.globalMovementCooldown > 0) return false;

  // Fair scaling for lower levels (< 15)
  const effectiveLevel = (level < 15) ? Math.max(1, Math.floor(level * 0.40)) : level;
  const roll = Math.floor(Math.random() * 20) + 1;
  return roll <= effectiveLevel;
}
```

### Safety & Anti-Clumping Timers:
- **Initial Grace Timer (`16.0s`)**: No animatronic can advance during the first 16 seconds of a shift, giving the player time to check cameras and prepare.
- **Global Movement Lockout (`1.2s`)**: Once any animatronic successfully moves, a brief 1.2-second global pause prevents multiple simultaneous door breaches.

---

## 3. Character Behaviors & Routes

### Freddy Fazbear (The Leader)
- **Path**:
  `CAM 1A (Stage)` $\to$ `CAM 1B (Dining)` $\to$ `CAM 7 (Restrooms)` $\to$ `CAM 6 (Kitchen)` $\to$ `CAM 4A (East Hall)` $\to$ `CAM 4B (Corner)` $\to$ `Office`
- **Camera Stall**: Freddy will **never** move while the player's monitor is actively looking at the room he currently occupies. Watching him on CAM 4B completely prevents him from entering the office.
- **Right Door Corner Breach**: If Freddy is at CAM 4B and the player lowers the monitor while the right door is open, Freddy attacks. If the right door is closed, Freddy knocks on the door and retreats back to CAM 4A with a 14-second stall.
- **Blackout Protocol**: When office battery reaches 0%, Freddy executes a 3-stage power-out sequence:
  - *Stage 1*: Pitch black darkness (random check every 5s, 20% advance chance).
  - *Stage 2*: Toreador March music box with flickering eyes in the left doorway.
  - *Stage 3*: Footsteps in darkness leading to the complete 21-frame blackout jumpscare.

---

### Bonnie (The Left Corridor Prowler)
- **Path**:
  `CAM 1A (Stage)` $\to$ `CAM 1B (Dining)` or `CAM 5 (Backstage)` $\to$ `CAM 2A (West Hall)` $\to$ `CAM 3 (Supply Closet)` $\to$ `CAM 2B (Corner)` $\to$ `Left Door Window`
- **Wandering Logic**: Bonnie has a 35–45% chance to wander backward (e.g. from West Hall back to Dining, or from Corner back to Supply Closet), creating unpredictable pacing.
- **Door Blindspot**:
  - When reaching position 7, Bonnie disappears from CAM 2B and stands outside the left office window.
  - Turning on the left hallway light reveals him.
  - If the door is closed, he retreats to Dining or Backstage with an 18–26s cooldown.
  - If the door is left open, he slips into the office, permanently jamming the left door and light switches. Lowering the monitor triggers an immediate jumpscare.

---

### Chica (The Right Corridor Stalker)
- **Path**:
  `CAM 1A (Stage)` $\to$ `CAM 1B (Dining)` $\to$ `CAM 7 (Restrooms)` $\to$ `CAM 6 (Kitchen)` $\to$ `CAM 4A (East Hall)` $\to$ `CAM 4B (Corner)` $\to$ `Right Door Window`
- **Kitchen Clatter**: While in CAM 6, video is unavailable, but audio cues of banging pots and pans play. Chica frequently lingers here.
- **Door Blindspot**:
  - Visible through the right door window when the right light is switched on.
  - If the right door is closed, she retreats back to the Kitchen or Restrooms with an 18–26s cooldown.
  - If left unaddressed, she infiltrates the office and jams the right door/light switches.

---

### Foxy (The Pirate Cove Sprinter)
- **Progression**:
  1. *Stage 1*: Completely hidden behind the Pirate Cove curtain (`CAM 1C`).
  2. *Stage 2*: Peeking out from the curtain.
  3. *Stage 3*: Fully emerged, preparing to run.
  4. *Stage 4*: Cove is empty — sprinting down `CAM 2A` towards the left door!
- **Stalling Mechanics**:
  - Simply flipping up the camera monitor stalls Foxy by `1.5s`.
  - Viewing `CAM 1C` (Pirate Cove) adds a massive `8.0s to 14.0s` stall timer.
- **Sprint Phase**:
  - Once Stage 4 begins, Foxy's footsteps sound in the hallway. The player has a fair `3.5-second` reaction window to close the left door.
  - If closed: Foxy bangs loudly on the door, resets to Stage 1, enters a 16-second cooldown, and drains battery power (1% on first impact, 6% on subsequent impacts).
  - If open: Jumpscare and instant game over.

---

### Golden Freddy (The Hallucination)
- **Trigger**: Viewing the Golden Freddy poster on `CAM 2B`, or a 0.1% random roll on Nights 5+.
- **Manifestation**: Appears slumped on the floor inside the office, accompanied by "IT'S ME" visual flashes and deep audio distortion.
- **Counter**: The player must **immediately flip the monitor back up** within 1.2 seconds.
- **Penalty**: Failure to raise the monitor results in a supernatural 9.35-second screech and a simulated fatal game crash.

---

## 4. Hourly AI Difficulty Scaling

During standard campaign shifts, difficulty levels scale upward every few in-game hours:

| Night | 12 AM - 1 AM | 2 AM | 3 AM | 4 AM - 5 AM |
| :--- | :--- | :--- | :--- | :--- |
| **Night 1** | Bonnie: 0, Chica: 0, Foxy: 0, Freddy: 0 | Bonnie: 0, Chica: 0 | Bonnie: 1, Chica: 0 | Bonnie: 2, Chica: 1 |
| **Night 2** | Bonnie: 1, Chica: 0, Foxy: 0, Freddy: 0 | Bonnie: 1, Chica: 0 | Bonnie: 2, Chica: 1, Foxy: 1 | Bonnie: 3, Chica: 2, Foxy: 2 |
| **Night 3** | Bonnie: 2, Chica: 1, Foxy: 1, Freddy: 0 | Bonnie: 2, Chica: 1 | Bonnie: 2, Chica: 2, Foxy: 2 | Bonnie: 3, Chica: 3, Foxy: 3, Freddy: 1 |
| **Night 4** | Bonnie: 3, Chica: 3, Foxy: 2, Freddy: 1 | Bonnie: 3, Chica: 3 | Bonnie: 4, Chica: 4, Foxy: 3 | Bonnie: 5, Chica: 5, Foxy: 4, Freddy: 2 |
| **Night 5** | Bonnie: 5, Chica: 5, Foxy: 4, Freddy: 2 | Bonnie: 5, Chica: 5 | Bonnie: 6, Chica: 6, Foxy: 5, Freddy: 3 | Bonnie: 7, Chica: 7, Foxy: 6, Freddy: 4 |
| **Night 6** | Bonnie: 6, Chica: 6, Foxy: 5, Freddy: 3 | Bonnie: 7, Chica: 7, Foxy: 6, Freddy: 4 | Bonnie: 7, Chica: 7 | Bonnie: 9, Chica: 9, Foxy: 7, Freddy: 5 |
| **Night 7** | Configured by player (0 to 20 per character) | — | — | — |
