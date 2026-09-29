/**
 * Five Nights at Freddy's - Animatronic AI System
 * Implements Scott Cawthon's movement opportunity checks, hourly difficulty scaling,
 * camera stalling, blindspot window lingering, and fair retreat timeouts.
 */

function checkMovementOpportunity(level) {
  if (level <= 0) return false;
  if (G.initialGraceTimer > 0) return false;
  if (G.globalMovementCooldown > 0) return false;

  // Gentle difficulty curve for lower AI levels to prevent early rush
  const effectiveLevel = (level < 15) ? Math.max(1, Math.round(level * 0.70)) : level;
  const roll = Math.floor(Math.random() * 20) + 1;
  return roll <= effectiveLevel;
}

function updateAILevelsForHour() {
  const n = G.currentNight;
  const h = G.hour;

  if (n === 7) {
    // Custom Night (values set in custom AI menu)
    G.freddy.level = G.customAI.freddy;
    G.bonnie.level = G.customAI.bonnie;
    G.chica.level  = G.customAI.chica;
    G.foxy.level   = G.customAI.foxy;
    return;
  }

  if (n === 1) {
    G.freddy.level = 0;
    G.foxy.level = 0;
    if (h < 3) {
      G.bonnie.level = 0;
      G.chica.level = 0;
    } else if (h < 4) {
      G.bonnie.level = 1;
      G.chica.level = 0;
    } else {
      G.bonnie.level = 2;
      G.chica.level = 1;
    }
  } else if (n === 2) {
    G.freddy.level = 0;
    G.foxy.level   = (h >= 4) ? 2 : (h >= 3 ? 1 : 0);
    G.bonnie.level = (h >= 4) ? 3 : (h >= 3 ? 2 : 1);
    G.chica.level  = (h >= 4) ? 2 : (h >= 3 ? 1 : 0);
  } else if (n === 3) {
    G.freddy.level = (h >= 4) ? 1 : 0;
    G.foxy.level   = (h >= 4) ? 3 : (h >= 3 ? 2 : 1);
    G.bonnie.level = (h >= 4) ? 3 : (h >= 3 ? 2 : 2);
    G.chica.level  = (h >= 4) ? 3 : (h >= 3 ? 2 : 1);
  } else if (n === 4) {
    G.freddy.level = (h >= 4) ? 2 : (h >= 3 ? 1 : 1);
    G.foxy.level   = (h >= 4) ? 4 : (h >= 3 ? 3 : 2);
    G.bonnie.level = (h >= 4) ? 5 : (h >= 3 ? 4 : 3);
    G.chica.level  = (h >= 4) ? 5 : (h >= 3 ? 4 : 3);
  } else if (n === 5) {
    G.freddy.level = (h >= 4) ? 4 : (h >= 3 ? 3 : 2);
    G.foxy.level   = (h >= 4) ? 6 : (h >= 3 ? 5 : 4);
    G.bonnie.level = (h >= 4) ? 7 : (h >= 3 ? 6 : 5);
    G.chica.level  = (h >= 4) ? 7 : (h >= 3 ? 6 : 5);
  } else {
    // Night 6 (Nightmare)
    G.freddy.level = (h >= 4) ? 5 : (h >= 2 ? 4 : 3);
    G.foxy.level   = (h >= 4) ? 7 : (h >= 2 ? 6 : 5);
    G.bonnie.level = (h >= 4) ? 9 : (h >= 2 ? 7 : 6);
    G.chica.level  = (h >= 4) ? 9 : (h >= 2 ? 7 : 6);
  }
}

function updateAnimatronicsAI(dt) {
  // Global cooldown and initial grace period
  if (G.globalMovementCooldown > 0) {
    G.globalMovementCooldown -= dt;
  }
  if (G.initialGraceTimer > 0) {
    G.initialGraceTimer -= dt;
  }

  // ---------------------------------------------------------------------------
  // 1. BONNIE THE BUNNY (Left Hallway & Door Blindspot)
  // ---------------------------------------------------------------------------
  if (G.bonnie.pos === 7) {
    G.bonnie.blindspotTimer = (G.bonnie.blindspotTimer || 0) + dt;
    if (G.doorLeftClosed) {
      // Door closed: Bonnie lingers 2.5-3.5s then retreats back down the hall
      if (G.bonnie.blindspotTimer >= 3.0) {
        G.bonnie.pos = (Math.random() < 0.60) ? 2 : 3; // Dining Area or Backstage
        G.bonnie.retreatCooldown = 10.0 + Math.random() * 6.0;
        G.bonnie.blindspotTimer = 0;
        G.globalMovementCooldown = 1.0;
      }
    } else {
      // Door open: Infiltrates office if monitor is open or player waits too long
      if ((G.monitorOpen && G.bonnie.blindspotTimer >= 0.8) || G.bonnie.blindspotTimer >= 3.8) {
        G.bonnie.inOffice = true;
        G.leftButtonsJammed = true;
        G.bonnie.pos = 0;
        G.bonnie.blindspotTimer = 0;
        G.bonnie.officeTimer = 0;
        playSound('switch_click');
      }
    }
  }

  if (G.bonnie.retreatCooldown > 0) {
    G.bonnie.retreatCooldown -= dt;
  }
  G.bonnie.tickTimer -= dt;
  if (G.bonnie.tickTimer <= 0) {
    G.bonnie.tickTimer = 4.97;
    if (G.bonnie.level > 0 && G.bonnie.retreatCooldown <= 0 && checkMovementOpportunity(G.bonnie.level)) {
      let moved = false;
      if (G.bonnie.pos === 1) {
        // Stage -> Dining (65%) or Backstage (35%)
        G.bonnie.pos = (Math.random() < 0.65) ? 2 : 3;
        moved = true;
      } else if (G.bonnie.pos === 2) {
        // Dining -> Backstage (35%), West Hall (35%), or stays (30%)
        const r = Math.random();
        if (r < 0.35) G.bonnie.pos = 3;
        else if (r < 0.70) G.bonnie.pos = 4;
        moved = true;
      } else if (G.bonnie.pos === 3) {
        // Backstage -> Dining (70%) or West Hall (30%)
        G.bonnie.pos = (Math.random() < 0.70) ? 2 : 4;
        moved = true;
      } else if (G.bonnie.pos === 4) {
        // West Hall -> Dining (40%), Supply Closet (35%), Corner (25%)
        const r = Math.random();
        if (r < 0.40) G.bonnie.pos = 2;
        else if (r < 0.75) G.bonnie.pos = 5;
        else G.bonnie.pos = 6;
        moved = true;
      } else if (G.bonnie.pos === 5) {
        // Supply Closet -> West Hall (60%) or Corner (40%)
        G.bonnie.pos = (Math.random() < 0.60) ? 4 : 6;
        moved = true;
      } else if (G.bonnie.pos === 6) {
        // Corner -> Wanders back (45%) or advances to Door Blindspot (55%)
        const r = Math.random();
        if (r < 0.45) {
          G.bonnie.pos = (Math.random() < 0.5) ? 4 : 5;
        } else {
          G.bonnie.pos = 7;
          G.bonnie.blindspotTimer = 0;
          if (G.lightLeftOn) {
            playSound('windowscare');
          }
        }
        moved = true;
      } else if (G.bonnie.pos === 7) {
        if (G.doorLeftClosed) {
          G.bonnie.pos = (Math.random() < 0.60) ? 2 : 3;
          G.bonnie.retreatCooldown = 10.0 + Math.random() * 6.0;
          G.bonnie.blindspotTimer = 0;
          moved = true;
        } else {
          G.bonnie.inOffice = true;
          G.leftButtonsJammed = true;
          G.bonnie.pos = 0;
          G.bonnie.blindspotTimer = 0;
          G.bonnie.officeTimer = 0;
          playSound('switch_click');
          moved = true;
        }
      }

      if (moved) {
        G.globalMovementCooldown = 1.0;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 2. CHICA THE CHICKEN (Right Hallway, Kitchen & Door Blindspot)
  // ---------------------------------------------------------------------------
  if (G.chica.pos === 7) {
    G.chica.blindspotTimer = (G.chica.blindspotTimer || 0) + dt;
    if (G.doorRightClosed) {
      if (G.chica.blindspotTimer >= 3.0) {
        G.chica.pos = (Math.random() < 0.55) ? 4 : 3; // Kitchen or Restrooms
        G.chica.retreatCooldown = 10.0 + Math.random() * 6.0;
        G.chica.blindspotTimer = 0;
        G.globalMovementCooldown = 1.0;
      }
    } else {
      if ((G.monitorOpen && G.chica.blindspotTimer >= 0.8) || G.chica.blindspotTimer >= 3.8) {
        G.chica.inOffice = true;
        G.rightButtonsJammed = true;
        G.chica.pos = 0;
        G.chica.blindspotTimer = 0;
        G.chica.officeTimer = 0;
        playSound('switch_click');
      }
    }
  }

  if (G.chica.retreatCooldown > 0) {
    G.chica.retreatCooldown -= dt;
  }
  G.chica.tickTimer -= dt;
  if (G.chica.tickTimer <= 0) {
    G.chica.tickTimer = 4.98;
    if (G.chica.level > 0 && G.chica.retreatCooldown <= 0 && checkMovementOpportunity(G.chica.level)) {
      let moved = false;
      if (G.chica.pos === 1) {
        // Stage -> Dining
        G.chica.pos = 2;
        moved = true;
      } else if (G.chica.pos === 2) {
        // Dining -> Kitchen (45%), Restrooms (35%), East Hall (20%)
        const r = Math.random();
        if (r < 0.45) G.chica.pos = 4;
        else if (r < 0.80) G.chica.pos = 3;
        else G.chica.pos = 5;
        moved = true;
      } else if (G.chica.pos === 3) {
        // Restrooms -> Kitchen (50%), Dining (30%), East Hall (20%)
        const r = Math.random();
        if (r < 0.50) G.chica.pos = 4;
        else if (r < 0.80) G.chica.pos = 2;
        else G.chica.pos = 5;
        moved = true;
      } else if (G.chica.pos === 4) {
        // Kitchen linger
        const r = Math.random();
        if (r < 0.55) {
          // Stays in Kitchen rattling pots
        } else if (r < 0.80) {
          G.chica.pos = 5; // East Hall
          moved = true;
        } else {
          G.chica.pos = 3; // Restrooms
          moved = true;
        }
      } else if (G.chica.pos === 5) {
        // East Hall -> Kitchen (40%), Dining (20%), Corner (40%)
        const r = Math.random();
        if (r < 0.40) G.chica.pos = 4;
        else if (r < 0.60) G.chica.pos = 2;
        else G.chica.pos = 6;
        moved = true;
      } else if (G.chica.pos === 6) {
        // Corner -> East Hall (45%) or Door Blindspot (55%)
        const r = Math.random();
        if (r < 0.45) {
          G.chica.pos = 5;
        } else {
          G.chica.pos = 7;
          G.chica.blindspotTimer = 0;
          if (G.lightRightOn) {
            playSound('windowscare');
          }
        }
        moved = true;
      } else if (G.chica.pos === 7) {
        if (G.doorRightClosed) {
          G.chica.pos = (Math.random() < 0.55) ? 4 : 3;
          G.chica.retreatCooldown = 10.0 + Math.random() * 6.0;
          G.chica.blindspotTimer = 0;
          moved = true;
        } else {
          G.chica.inOffice = true;
          G.rightButtonsJammed = true;
          G.chica.pos = 0;
          G.chica.blindspotTimer = 0;
          G.chica.officeTimer = 0;
          playSound('switch_click');
          moved = true;
        }
      }

      if (moved) {
        G.globalMovementCooldown = 1.0;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 3. FREDDY FAZBEAR (Show Stage Leader & Tactical Shadow)
  // ---------------------------------------------------------------------------
  G.freddy.tickTimer -= dt;
  if (G.freddy.stallTimer > 0) {
    G.freddy.stallTimer -= dt;
  }

  // Watching Freddy's current room freezes him
  const freddyCamWatched = G.monitorOpen && (
    (G.freddy.pos === 1 && G.selectedCam === '1A') ||
    (G.freddy.pos === 2 && G.selectedCam === '1B') ||
    (G.freddy.pos === 3 && G.selectedCam === '7')  ||
    (G.freddy.pos === 4 && G.selectedCam === '6')  ||
    (G.freddy.pos === 5 && G.selectedCam === '4A') ||
    (G.freddy.pos === 6 && G.selectedCam === '4B')
  );
  if (freddyCamWatched) {
    G.freddy.stallTimer = 2.0;
  }

  // Door interaction at CAM 4B corner
  if (G.freddy.pos === 6) {
    if (G.doorRightClosed) {
      G.freddy.doorTimer = (G.freddy.doorTimer || 0) + dt;
      if (G.freddy.doorTimer >= 3.5) {
        playSound('door_pound');
        G.freddy.pos = 5; // Retreats back to East Hall CAM 4A
        G.freddy.stallTimer = 12.0;
        G.freddy.doorTimer = 0;
        G.globalMovementCooldown = 1.0;
      }
    } else {
      G.freddy.doorTimer = 0;
    }
  }

  if (G.freddy.tickTimer <= 0) {
    G.freddy.tickTimer = 3.02;
    if (!freddyCamWatched && G.freddy.stallTimer <= 0 && G.freddy.level > 0 && checkMovementOpportunity(G.freddy.level)) {
      if (G.freddy.pos < 6) {
        G.freddy.pos++;
        playSound('freddy_laugh');
        G.globalMovementCooldown = 1.0;
      } else if (G.freddy.pos === 6) {
        if (G.doorRightClosed) {
          playSound('door_pound');
          G.freddy.pos = 5;
          G.freddy.stallTimer = 12.0;
          G.freddy.doorTimer = 0;
          G.globalMovementCooldown = 1.0;
        } else if (!G.monitorOpen) {
          triggerJumpscare('freddy', 'Freddy Fazbear (East Hall Corner Infiltration)');
          return;
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 4. FOXY THE PIRATE (Pirate Cove Sprinter)
  // ---------------------------------------------------------------------------
  G.foxy.tickTimer -= dt;
  if (G.foxy.stallTimer > 0) {
    G.foxy.stallTimer -= dt;
  }

  // Viewing monitor stalls Foxy
  if (G.monitorOpen) {
    if (G.selectedCam === '1C') {
      if (G.foxy.stallTimer < 8.0) G.foxy.stallTimer = 8.0 + Math.random() * 6.0;
    } else {
      if (G.foxy.stallTimer < 1.5) G.foxy.stallTimer = 1.5;
    }
  }

  if (G.foxy.tickTimer <= 0) {
    G.foxy.tickTimer = 5.01;
    if (G.foxy.stallTimer <= 0 && G.foxy.level > 0 && G.foxy.stage < 4 && checkMovementOpportunity(G.foxy.level)) {
      G.foxy.stage++;
      G.globalMovementCooldown = 1.2;
      if (G.foxy.stage === 4) {
        playSound('foxy_sprint');
        G.foxy.sprintTimer = 0;
      }
    }
  }

  // Sprinting down West Hall (3.5s reaction window)
  if (G.foxy.stage === 4) {
    G.foxy.sprintTimer += dt;
    if (G.foxy.sprintTimer >= 3.5) {
      if (G.doorLeftClosed) {
        playSound('door_pound');
        const drain = (G.foxy.drainCount ? 6 : 1);
        G.power = Math.max(0, G.power - drain);
        G.foxy.drainCount = (G.foxy.drainCount || 0) + 1;
        G.foxy.stage = 1;
        G.foxy.sprintTimer = 0;
        G.foxy.stallTimer = 16.0;
      } else {
        triggerJumpscare('foxy', 'Foxy (West Hallway Breach)');
        return;
      }
    }
  }

  // Infiltration Watchdog (animatronic entered office earlier while monitor was up)
  if (G.bonnie.inOffice) {
    G.bonnie.officeTimer = (G.bonnie.officeTimer || 0) + dt;
    if (G.bonnie.officeTimer >= 6.0 && G.tabletState === 'closed') {
      triggerJumpscare('bonnie', 'Bonnie (Infiltrated Office)');
      return;
    }
  }
  if (G.chica.inOffice) {
    G.chica.officeTimer = (G.chica.officeTimer || 0) + dt;
    if (G.chica.officeTimer >= 6.0 && G.tabletState === 'closed') {
      triggerJumpscare('chica', 'Chica (Infiltrated Office)');
      return;
    }
  }
}
