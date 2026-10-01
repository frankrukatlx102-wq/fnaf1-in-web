/**
 * Main game loop, player input controller, and shift lifecycle manager.
 */

function startShiftIntro() {
  playSound('switch_click');
  if (sounds.menu_music) sounds.menu_music.pause();
  G.gameState = 'shift_intro';
  G.shiftIntroTimer = 0;
}

function startShift() {
  G.gameState = 'playing';
  G.power = 100.0;
  G.usage = 1;
  G.doorLeftClosed = false;
  G.doorRightClosed = false;
  G.doorLeftFrame = 0;
  G.doorRightFrame = 0;
  G.lightLeftOn = false;
  G.lightRightOn = false;
  G.leftButtonsJammed = false;
  G.rightButtonsJammed = false;
  G.tabletState = 'closed';
  G.tabletFrame = 1;
  G.monitorOpen = false;
  G.selectedCam = '1A';
  G.timeSeconds = 0;
  G.hour = 12;
  G.nightWon = false;
  G.blackout = false;
  G.blackoutStage = 1;
  G.blackoutStageTimer = 0;
  G.blackoutFreddyFlickerTimer = 0;
  G.blackoutFreddyFlickerState = 0;
  G.is1987Crash = false;

  G.globalMovementCooldown = 0.0;
  G.initialGraceTimer = 16.0;
  G.freddy = { level: 0, pos: 1, tickTimer: 3.02, stallTimer: 0, doorTimer: 0 };
  G.bonnie = { level: 0, pos: 1, tickTimer: 4.97, inOffice: false, blindspotTimer: 0, retreatCooldown: 0, doorTimer: 0, officeTimer: 0 };
  G.chica  = { level: 0, pos: 1, tickTimer: 4.98, inOffice: false, blindspotTimer: 0, retreatCooldown: 0, doorTimer: 0, officeTimer: 0 };
  G.foxy   = { level: 0, stage: 1, tickTimer: 5.01, sprintTimer: 0, stallTimer: 0, drainCount: 0 };
  G.goldenFreddy = { active: false, timer: 0 };

  updateAILevelsForHour();

  G.cam4bEasterEgg = null;
  G.cam4aItsMe = false;
  G.cam2bPoster = 'normal';
  G.cam2bGoldenPoster = false;
  G.pirateCoveItsMe = false;
  G.winTimer = 0;
  G.winProcessed = false;

  G.gameOver = false;
  G.gameOverReason = '';
  G.jumpscareType = '';
  G.jumpscareFrame = 0;
  G.jumpscareTimer = 0;

  if (G.currentNight >= 1 && G.currentNight <= 5) {
    G.phoneCallActive = true;
    G.phoneCallTimer = 0;
    G.phoneCallMuted = false;
    G.phoneCallStarted = false;
    G.phoneCallEnded = false;
  } else {
    G.phoneCallActive = false;
    G.phoneCallStarted = false;
    G.phoneCallEnded = true;
  }

  if (sounds.ambience) {
    sounds.ambience.currentTime = 0;
    sounds.ambience.play().catch(() => {});
  }
}

function resetToMenu() {
  G.gameState = 'menu';
  G.winProcessed = false;
  G.gameOver = false;
  G.gameOverReason = '';
  G.jumpscareType = '';
  G.jumpscareFrame = 0;
  G.jumpscareTimer = 0;
  G.doorLeftClosed = false;
  G.doorRightClosed = false;
  G.doorLeftFrame = 0;
  G.doorRightFrame = 0;
  G.lightLeftOn = false;
  G.lightRightOn = false;
  G.leftButtonsJammed = false;
  G.rightButtonsJammed = false;
  G.tabletState = 'closed';
  G.tabletFrame = 1;
  G.monitorOpen = false;
  G.blackout = false;
  G.blackoutStage = 1;
  G.blackoutStageTimer = 0;
  G.blackoutFreddyFlickerTimer = 0;
  G.blackoutFreddyFlickerState = 0;
  G.is1987Crash = false;
  G.phoneCallActive = false;
  G.phoneCallStarted = false;
  G.phoneCallEnded = true;
  G.globalMovementCooldown = 0.0;
  G.initialGraceTimer = 16.0;

  G.freddy = { level: 0, pos: 1, tickTimer: 3.02, stallTimer: 0, doorTimer: 0 };
  G.bonnie = { level: 0, pos: 1, tickTimer: 4.97, inOffice: false, blindspotTimer: 0, retreatCooldown: 0, doorTimer: 0, officeTimer: 0 };
  G.chica  = { level: 0, pos: 1, tickTimer: 4.98, inOffice: false, blindspotTimer: 0, retreatCooldown: 0, doorTimer: 0, officeTimer: 0 };
  G.foxy   = { level: 0, stage: 1, tickTimer: 5.01, sprintTimer: 0, stallTimer: 0, drainCount: 0 };
  G.goldenFreddy = { active: false, timer: 0 };

  stopAllShiftSounds();
  if (sounds.menu_music) {
    sounds.menu_music.currentTime = 0;
    sounds.menu_music.play().catch(() => {});
  }
}

function completeWinNight() {
  if (G.winProcessed) return;
  G.winProcessed = true;
  let currentN = G.currentNight;
  let curStars = G.saveData.stars || 0;
  let customUnl = G.saveData.customUnlocked || false;
  let nextN = G.saveData.night || 1;

  if (currentN === 5) {
    if (curStars < 1) curStars = 1;
    nextN = Math.max(nextN, 6);
  } else if (currentN === 6) {
    if (curStars < 2) curStars = 2;
    customUnl = true;
    nextN = Math.max(nextN, 7);
  } else if (currentN === 7) {
    if (curStars < 3) curStars = 3;
    customUnl = true;
  } else {
    nextN = Math.max(nextN, currentN + 1);
  }

  saveGameProgress(nextN, curStars, customUnl);
  G.saveData.night = nextN;
  G.saveData.stars = curStars;
  G.saveData.customUnlocked = customUnl;
  G.currentNight = nextN;
  resetToMenu();
}

function triggerJumpscare(type, reason) {
  G.gameOver = true;
  G.gameState = 'gameover';
  G.jumpscareType = type;
  G.gameOverReason = reason;
  G.jumpscareTimer = 0;
  G.jumpscareFrame = 0;

  if (G.foxy) {
    G.foxy.stage = 1;
    G.foxy.sprintTimer = 0;
  }

  stopAllShiftSounds();
  if (type === 'golden_freddy') {
    playSound('golden_freddy_scream');
  } else {
    playSound('screamer');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && (G.gameState === 'custom_night' || G.gameState === 'extra')) {
    G.gameState = 'menu';
    playSound('switch_click');
  }
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  G.mouseX = (e.clientX - rect.left) * (1920 / rect.width);
  G.mouseY = (e.clientY - rect.top) * (1080 / rect.height);

  if (sounds.menu_music && sounds.menu_music.paused && G.gameState === 'menu') {
    sounds.menu_music.play().catch(() => {});
  }

  if (G.gameState === 'menu') {
    const items = getAvailableMenuItems();
    if (G.mouseX > 120 && G.mouseX < 540) {
      for (let idx = 0; idx < items.length; idx++) {
        const topY = 620 + idx * 75;
        if (G.mouseY >= topY && G.mouseY <= topY + 65) {
          if (G.selectedMenuOption !== idx) {
            playSound('switch_click');
            G.selectedMenuOption = idx;
          }
          break;
        }
      }
    }
  }

  if (G.gameState === 'playing' && !G.gameOver && !G.nightWon && !G.blackout) {
    const now = performance.now();
    if (G.mouseY > 990 && G.mouseX > 660 && G.mouseX < 1260) {
      if (now - G.lastFlipToggleTime > 420) {
        G.lastFlipToggleTime = now;
        toggleMonitor();
      }
    }
  }
});

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (1920 / rect.width);
  const my = (e.clientY - rect.top) * (1080 / rect.height);
  G.mouseX = mx;
  G.mouseY = my;

  // Main menu clicks
  if (G.gameState === 'menu') {
    if (sounds.menu_music) sounds.menu_music.play().catch(() => {});
    const items = getAvailableMenuItems();
    if (mx > 120 && mx < 540) {
      for (let idx = 0; idx < items.length; idx++) {
        const topY = 620 + idx * 75;
        if (my >= topY && my <= topY + 65) {
          const item = items[idx];
          if (item.id === 'new_game') {
            G.currentNight = 1;
            saveGameProgress(1, G.saveData.stars, G.saveData.customUnlocked);
            startShiftIntro();
            return;
          } else if (item.id === 'continue') {
            G.currentNight = Math.min(5, G.saveData.night || 1);
            startShiftIntro();
            return;
          } else if (item.id === 'night_6') {
            G.currentNight = 6;
            startShiftIntro();
            return;
          } else if (item.id === 'custom_night') {
            playSound('switch_click');
            G.gameState = 'custom_night';
            return;
          } else if (item.id === 'extra') {
            playSound('switch_click');
            G.gameState = 'extra';
            G.extraSelectedAnim = 0;
            return;
          }
        }
      }
    }
    return;
  }

  // Custom Night clicks
  if (G.gameState === 'custom_night') {
    const animBoxes = [
      { key: 'freddy', x: 140 },
      { key: 'bonnie', x: 540 },
      { key: 'chica',  x: 940 },
      { key: 'foxy',   x: 1340 }
    ];

    for (const b of animBoxes) {
      if (mx >= b.x + 35 && mx <= b.x + 95 && my >= 560 && my <= 620) {
        G.customAI[b.key] = Math.max(0, G.customAI[b.key] - 1);
        playSound('switch_click');
        return;
      }
      if (mx >= b.x + 245 && mx <= b.x + 305 && my >= 560 && my <= 620) {
        G.customAI[b.key] = Math.min(20, G.customAI[b.key] + 1);
        playSound('switch_click');
        return;
      }
    }

    // Presets
    if (mx >= 140 && mx <= 400 && my >= 760 && my <= 820) {
      G.customAI.freddy = 20; G.customAI.bonnie = 20; G.customAI.chica = 20; G.customAI.foxy = 20;
      playSound('switch_click');
      return;
    }
    if (mx >= 440 && mx <= 700 && my >= 760 && my <= 820) {
      G.customAI.freddy = 10; G.customAI.bonnie = 10; G.customAI.chica = 10; G.customAI.foxy = 10;
      playSound('switch_click');
      return;
    }
    if (mx >= 740 && mx <= 1000 && my >= 760 && my <= 820) {
      G.customAI.freddy = 5; G.customAI.bonnie = 5; G.customAI.chica = 5; G.customAI.foxy = 5;
      playSound('switch_click');
      return;
    }
    if (mx >= 1040 && mx <= 1300 && my >= 760 && my <= 820) {
      G.customAI.freddy = 0; G.customAI.bonnie = 0; G.customAI.chica = 0; G.customAI.foxy = 0;
      playSound('switch_click');
      return;
    }

    // Ready button
    if (mx >= 1380 && mx <= 1740 && my >= 740 && my <= 830) {
      if (G.customAI.freddy === 1 && G.customAI.bonnie === 9 && G.customAI.chica === 8 && G.customAI.foxy === 7) {
        G.is1987Crash = true;
        triggerJumpscare('golden_freddy', 'Golden Freddy');
        return;
      }
      G.currentNight = 7;
      startShiftIntro();
      return;
    }

    // Back button
    if (mx >= 140 && mx <= 400 && my >= 880 && my <= 950) {
      resetToMenu();
      return;
    }
    return;
  }

  // Extra menu clicks
  if (G.gameState === 'extra') {
    // Back button
    if (mx >= 1600 && mx <= 1800 && my >= 50 && my <= 100) {
      resetToMenu();
      return;
    }

    // Tabs
    for (let i = 0; i < 6; i++) {
      const bx = 120 + i * 280;
      if (mx >= bx && mx <= bx + 260 && my >= 130 && my <= 180) {
        G.extraSelectedAnim = i;
        playSound('switch_click');
        return;
      }
    }

    // Night selector tab
    if (G.extraSelectedAnim === 5) {
      const nightsList = [
        { night: 1, x: 260, y: 360, w: 280 },
        { night: 2, x: 720, y: 360, w: 280 },
        { night: 3, x: 1180, y: 360, w: 280 },
        { night: 4, x: 1640, y: 360, w: 280 },
        { night: 5, x: 490, y: 560, w: 280 },
        { night: 6, x: 960, y: 560, w: 280 },
        { night: 7, x: 1430, y: 560, w: 360 }
      ];

      for (const n of nightsList) {
        const bx = n.x - n.w / 2;
        const by = n.y;
        if (mx >= bx && mx <= bx + n.w && my >= by && my <= by + 80) {
          if (n.night === 7) {
            G.gameState = 'custom_night';
            playSound('switch_click');
          } else {
            G.currentNight = n.night;
            startShiftIntro();
          }
          return;
        }
      }
      return;
    }

    // Play Sound button
    if (mx >= 900 && mx <= 1260 && my >= 500 && my <= 570) {
      if (G.extraSelectedAnim === 0) playSound('freddy_laugh');
      else if (G.extraSelectedAnim === 1) playSound('screamer');
      else if (G.extraSelectedAnim === 2) playSound('kitchen_rattle');
      else if (G.extraSelectedAnim === 3) playSound('foxy_song');
      else if (G.extraSelectedAnim === 4) playSound('golden_freddy_scream');
      return;
    }
    return;
  }

  // Crash / Game Over / Victory clicks
  if (G.gameState === 'crashed') {
    window.location.reload();
    return;
  }
  if (G.gameState === 'win') {
    if (G.winTimer >= 3.8) {
      completeWinNight();
    }
    return;
  }
  if (G.gameState === 'gameover') {
    const minClickSkip = (G.jumpscareType === 'golden_freddy') ? 9.35 : 1.2;
    if (G.jumpscareTimer >= minClickSkip) {
      resetToMenu();
    }
    return;
  }

  // Playing in-game clicks
  if (G.gameState === 'playing') {
    if (G.gameOver || G.nightWon) return;

    // Mute call
    if (G.phoneCallActive && !G.phoneCallMuted) {
      if (mx >= 60 && mx <= 240 && my >= 70 && my <= 120) {
        G.phoneCallMuted = true;
        G.phoneCallActive = false;
        G.phoneCallEnded = true;
        const curSound = sounds['phone_guy_' + G.currentNight];
        if (curSound) {
          curSound.pause();
          curSound.currentTime = 0;
          curSound.onended = null;
        }
        playSound('switch_click');
        return;
      }
    }

    // Monitor chevron flip
    if (my > 980 && mx > 620 && mx < 1300 && !G.blackout) {
      const now = performance.now();
      if (now - G.lastFlipToggleTime > 250) {
        G.lastFlipToggleTime = now;
        toggleMonitor();
      }
      return;
    }

    // Camera view
    if (G.tabletState === 'open') {
      for (const b of camButtons) {
        if (mx >= b.x && mx <= b.x + b.w && my >= b.y && my <= b.y + b.h) {
          if (G.selectedCam === b.id) return;
          G.selectedCam = b.id;
          playSound('switch_click');

          if (b.id === '1C') {
            G.pirateCoveItsMe = (G.foxy.stage === 4) && (Math.random() < 0.03);
          }

          if (b.id === '5') {
            if (G.bonnie.pos !== 3) {
              G.backstageHeadsStare = (Math.random() < 0.015);
            } else {
              G.backstageHeadsStare = false;
              G.bonnieStareCam5 = (Math.random() < 0.03);
            }
          }

          if (b.id === '4B') {
            if (G.chica.pos !== 6 && G.freddy.pos !== 6) {
              G.cam4bEasterEgg = (Math.random() < 0.02) ? (Math.floor(Math.random() * 4) + 1) : null;
            } else {
              G.cam4bEasterEgg = null;
            }
          }

          if (b.id === '4A') {
            G.cam4aItsMe = (G.chica.pos !== 5 && G.freddy.pos !== 5) && (Math.random() < 0.02);
          }

          if (b.id === '2B') {
            if (G.bonnie.pos !== 6) {
              const roll = Math.random();
              if (roll < 0.035) {
                G.cam2bPoster = 'golden';
                G.cam2bGoldenPoster = true;
              } else if (roll < 0.070) {
                G.cam2bPoster = 'ripping';
                G.cam2bGoldenPoster = false;
              } else {
                G.cam2bPoster = 'normal';
                G.cam2bGoldenPoster = false;
              }
            } else {
              G.cam2bPoster = 'normal';
              G.cam2bGoldenPoster = false;
            }
          }

          if (b.id === '6') {
            if (G.chica.pos === 4 || G.freddy.pos === 4) {
              if (sounds.kitchen_rattle) sounds.kitchen_rattle.play().catch(() => {});
            }
          } else {
            if (sounds.kitchen_rattle) sounds.kitchen_rattle.pause();
          }
          return;
        }
      }
      return;
    }

    // Office view
    if (G.tabletState === 'closed') {
      const ox = G.panX;

      // Freddy poster nose honk
      const noseScreenX = ox + 1016;
      const noseScreenY = 357;
      const distToNose = Math.hypot(mx - noseScreenX, my - noseScreenY);
      if (distToNose <= 60 && !G.blackout) {
        playSound('freddy_nose');
        return;
      }

      // Left door buttons
      const lPanelX = ox + 65;
      if (mx >= lPanelX && mx <= lPanelX + 150 && my >= 380 && my <= 720 && !G.blackout) {
        if (G.leftButtonsJammed) {
          playSound('switch_click');
          return;
        }
        if (my < 550) {
          G.doorLeftClosed = !G.doorLeftClosed;
          playSound('door_toggle');
        } else {
          G.lightLeftOn = !G.lightLeftOn;
          G.lightRightOn = false;
          if (sounds.lights_hum) sounds.lights_hum.pause();
          if (G.lightLeftOn) {
            playSound('lights_hum');
            if (G.bonnie.pos === 7) playSound('windowscare');
          }
        }
        return;
      }

      // Right door buttons
      const rPanelX = ox + 2210;
      if (mx >= rPanelX && mx <= rPanelX + 150 && my >= 380 && my <= 720 && !G.blackout) {
        if (G.rightButtonsJammed) {
          playSound('switch_click');
          return;
        }
        if (my < 550) {
          G.doorRightClosed = !G.doorRightClosed;
          playSound('door_toggle');
        } else {
          G.lightRightOn = !G.lightRightOn;
          G.lightLeftOn = false;
          if (sounds.lights_hum) sounds.lights_hum.pause();
          if (G.lightRightOn) {
            playSound('lights_hum');
            if (G.chica.pos === 7) playSound('windowscare');
          }
        }
        return;
      }
    }
  }
});

function update(dt) {
  G.staticFrame = (Math.floor(performance.now() / 45) % 6) + 1;

  if (G.gameState === 'menu') {
    G.menuTwitchTimer += dt;
    if (!G.menuTwitchActive) {
      if (G.menuTwitchTimer > 2.0 + Math.random() * 2.5) {
        G.menuTwitchActive = true;
        G.menuTwitchTimer = 0;
        G.menuTwitchDuration = 0.08 + Math.random() * 0.12;
        G.menuFreddyFrame = Math.floor(Math.random() * 3) + 1;
      }
    } else {
      if (G.menuTwitchTimer > G.menuTwitchDuration) {
        G.menuTwitchActive = false;
        G.menuTwitchTimer = 0;
        G.menuFreddyFrame = 0;
      }
    }
    return;
  }

  if (G.gameState === 'shift_intro') {
    G.shiftIntroTimer += dt;
    if (G.shiftIntroTimer >= 2.5) {
      startShift();
    }
    return;
  }

  if (G.gameState === 'gameover') {
    G.jumpscareTimer += dt;
    G.jumpscareFrame = Math.floor(G.jumpscareTimer * 20);
    if (G.is1987Crash && G.jumpscareTimer >= 2.0) {
      G.gameState = 'crashed';
      stopAllShiftSounds();
      try { window.close(); } catch (e) {}
      return;
    }
    const maxDuration = (G.jumpscareType === 'golden_freddy') ? 9.35 : 2.5;
    if (G.jumpscareTimer >= maxDuration) {
      resetToMenu();
    }
    return;
  }

  if (G.gameState === 'crashed') return;

  if (G.gameState === 'win') {
    G.winTimer += dt;
    if (G.winTimer >= 5.0) {
      completeWinNight();
    }
    return;
  }

  if (G.gameState !== 'playing') return;

  // In-game clock progression (60s = 1 hour)
  const hourDuration = 60.0;
  G.timeSeconds += dt;
  const oldHour = G.hour;
  const elapsedHours = Math.floor(G.timeSeconds / hourDuration);
  if (elapsedHours === 0) G.hour = 12;
  else if (elapsedHours === 1) G.hour = 1;
  else if (elapsedHours === 2) G.hour = 2;
  else if (elapsedHours === 3) G.hour = 3;
  else if (elapsedHours === 4) G.hour = 4;
  else if (elapsedHours === 5) G.hour = 5;
  else {
    G.nightWon = true;
    G.gameState = 'win';
    G.hour = 6;
    G.winTimer = 0;
    stopAllShiftSounds();
    playSound('win');
    return;
  }

  if (G.hour !== oldHour) {
    updateAILevelsForHour();
  }

  if (G.halluActive) {
    G.halluTimer -= dt;
    if (G.halluTimer <= 0) G.halluActive = false;
  } else {
    if (Math.random() < 0.00005) triggerHallucinationFlash();
  }

  if (G.phoneCallActive && !G.phoneCallMuted && !G.phoneCallEnded) {
    G.phoneCallTimer += dt;
    const curSound = sounds['phone_guy_' + G.currentNight];
    if (curSound && !G.phoneCallStarted && G.phoneCallTimer >= 2.0) {
      G.phoneCallStarted = true;
      curSound.loop = false;
      curSound.currentTime = 0;
      curSound.onended = () => {
        G.phoneCallActive = false;
        G.phoneCallEnded = true;
      };
      curSound.play().catch(() => {});
    }
  }

  updateTabletAnimation(dt);
  updateDoorAnimations(dt);
  updatePowerAndBlackout(dt);

  if (!G.blackout && G.tabletState === 'closed') {
    updateOfficePanning(dt);
  }

  if (G.goldenFreddy.active && G.tabletState === 'closed') {
    G.goldenFreddy.timer += dt;
    if (G.goldenFreddy.timer > 1.2) {
      triggerJumpscare('golden_freddy', 'Golden Freddy');
      return;
    }
  }

  updateAnimatronicsAI(dt);
}

let lastTime = performance.now();

function gameLoop(now) {
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  update(dt);
  render();
  requestAnimationFrame(gameLoop);
}

if (typeof syncBackendSave === 'function') {
  syncBackendSave();
}

requestAnimationFrame(gameLoop);
