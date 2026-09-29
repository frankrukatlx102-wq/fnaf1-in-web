/**
 * Five Nights at Freddy's - Office & Infrastructure Mechanics
 * Controls office camera panning, door states, lights, power drain, blackout stages, and camera feeds.
 */

function triggerHallucinationFlash() {
  G.halluActive = true;
  G.halluTimer = 0.35;
  const list = [
    images.hallu_its_me_1,
    images.hallu_its_me_2,
    images.hallu_eyeless_bonnie,
    images.hallu_freddy
  ].filter(img => img && img.complete);

  if (list.length > 0) {
    G.halluImg = list[Math.floor(Math.random() * list.length)];
  }
}

function toggleMonitor() {
  if (G.tabletState === 'closed' || G.tabletState === 'closing') {
    G.tabletState = 'opening';
    G.tabletFrame = 1;
    playSound('cam_up');

    // Flipping tablet up banishes Golden Freddy
    if (G.goldenFreddy.active) {
      G.goldenFreddy.active = false;
      G.goldenFreddy.timer = 0;
    }

    if (G.selectedCam === '2B' && G.bonnie.pos !== 6) {
      const roll = Math.random();
      if (roll < 0.035) {
        G.cam2bPoster = 'golden';
        G.cam2bGoldenPoster = true;
      } else if (roll < 0.070) {
        G.cam2bPoster = 'ripping';
        G.cam2bGoldenPoster = false;
      }
    }

    if (G.selectedCam === '6' && (G.chica.pos === 4 || G.freddy.pos === 4)) {
      playSound('kitchen_rattle');
    }

    // Check office infiltration if door open while animatronic is in blindspot
    if (G.bonnie.pos === 7 && !G.doorLeftClosed) {
      G.bonnie.inOffice = true;
      G.leftButtonsJammed = true;
    }
    if (G.chica.pos === 7 && !G.doorRightClosed) {
      G.chica.inOffice = true;
      G.rightButtonsJammed = true;
    }

  } else if (G.tabletState === 'open' || G.tabletState === 'opening') {
    G.tabletState = 'closing';
    G.tabletFrame = 11;
    playSound('cam_down');
    if (sounds.kitchen_rattle) sounds.kitchen_rattle.pause();

    // If animatronic infiltrated office earlier, lowering monitor triggers jumpscare
    if (G.bonnie.inOffice) {
      triggerJumpscare('bonnie', 'Bonnie (Infiltrated Office)');
      return;
    }
    if (G.chica.inOffice) {
      triggerJumpscare('chica', 'Chica (Infiltrated Office)');
      return;
    }

    // Golden Freddy rare spawn or poster trigger
    if (G.cam2bPoster === 'golden' || G.cam2bGoldenPoster || (G.currentNight >= 5 && Math.random() < 0.001)) {
      G.goldenFreddy.active = true;
      G.goldenFreddy.timer = 0;
      G.cam2bPoster = 'normal';
      G.cam2bGoldenPoster = false;
      triggerHallucinationFlash();
      playSound('windowscare');
    } else {
      G.cam2bPoster = 'normal';
      G.cam2bGoldenPoster = false;
    }
  }
}

function updateOfficePanning(dt) {
  let target = -240;
  if (G.mouseX < 500) {
    const f = Math.max(0, (500 - G.mouseX) / 500);
    target = -240 + f * 240;
  } else if (G.mouseX > 1420) {
    const f = Math.max(0, (G.mouseX - 1420) / 500);
    target = -240 - f * 240;
  }
  G.panX += (target - G.panX) * Math.min(1, dt * 7);
}

function updateTabletAnimation(dt) {
  if (G.tabletState === 'opening') {
    G.tabletFrame += dt * 38;
    if (G.tabletFrame >= 11) {
      G.tabletFrame = 11;
      G.tabletState = 'open';
      G.monitorOpen = true;
    }
  } else if (G.tabletState === 'closing') {
    G.tabletFrame -= dt * 38;
    if (G.tabletFrame <= 1) {
      G.tabletFrame = 1;
      G.tabletState = 'closed';
      G.monitorOpen = false;
    }
  }
}

function updateDoorAnimations(dt) {
  if (G.doorLeftClosed && G.doorLeftFrame < 15) {
    G.doorLeftFrame = Math.min(15, G.doorLeftFrame + dt * 28);
  } else if (!G.doorLeftClosed && G.doorLeftFrame > 0) {
    G.doorLeftFrame = Math.max(0, G.doorLeftFrame - dt * 28);
  }

  if (G.doorRightClosed && G.doorRightFrame < 15) {
    G.doorRightFrame = Math.min(15, G.doorRightFrame + dt * 28);
  } else if (!G.doorRightClosed && G.doorRightFrame > 0) {
    G.doorRightFrame = Math.max(0, G.doorRightFrame - dt * 28);
  }
}

function updatePowerAndBlackout(dt) {
  if (!G.blackout) {
    G.usage = 1 +
      (G.doorLeftClosed ? 1 : 0) +
      (G.doorRightClosed ? 1 : 0) +
      (G.lightLeftOn ? 1 : 0) +
      (G.lightRightOn ? 1 : 0) +
      (G.monitorOpen ? 1 : 0);

    G.power -= 0.1 * G.usage * dt;
    if (G.power <= 0) {
      G.power = 0;
      G.blackout = true;
      G.blackoutStage = 1;
      G.blackoutStageTimer = 0;
      G.blackoutCheckTimer = 0;
      G.blackoutFreddyFlickerTimer = 0;
      G.blackoutFreddyFlickerState = 0;
      G.doorLeftClosed = false;
      G.doorRightClosed = false;
      G.lightLeftOn = false;
      G.lightRightOn = false;
      G.tabletState = 'closed';
      G.monitorOpen = false;
      stopAllShiftSounds();
      playSound('powerdown');
    }
  } else {
    // 3-Stage Blackout Protocol
    G.blackoutStageTimer += dt;
    G.blackoutCheckTimer += dt;

    if (G.blackoutStage === 1) {
      // Stage 1: Pitch black darkness. Every 5s, 20% roll to advance to Stage 2 (or max 20s)
      if (G.blackoutCheckTimer >= 5.0) {
        G.blackoutCheckTimer = 0;
        if (Math.random() < 0.20 || G.blackoutStageTimer >= 20.0) {
          G.blackoutStage = 2;
          G.blackoutStageTimer = 0;
          G.blackoutCheckTimer = 0;
          if (sounds.toreador_march) {
            sounds.toreador_march.currentTime = 0;
            sounds.toreador_march.play().catch(() => {});
          }
        }
      } else if (G.blackoutStageTimer >= 20.0) {
        G.blackoutStage = 2;
        G.blackoutStageTimer = 0;
        G.blackoutCheckTimer = 0;
        if (sounds.toreador_march) {
          sounds.toreador_march.currentTime = 0;
          sounds.toreador_march.play().catch(() => {});
        }
      }
    } else if (G.blackoutStage === 2) {
      // Stage 2: Toreador March music box + Freddy face flickering in left doorway
      G.blackoutFreddyFlickerTimer += dt;
      if (G.blackoutFreddyFlickerTimer >= 0.18) {
        G.blackoutFreddyFlickerTimer = 0;
        const rnd = Math.random();
        G.blackoutFreddyFlickerState = (rnd < 0.45) ? 0 : ((rnd < 0.75) ? 1 : 2);
      }

      if (G.blackoutCheckTimer >= 5.0) {
        G.blackoutCheckTimer = 0;
        if (Math.random() < 0.20 || G.blackoutStageTimer >= 20.0) {
          G.blackoutStage = 3;
          G.blackoutStageTimer = 0;
          G.blackoutCheckTimer = 0;
          if (sounds.toreador_march) sounds.toreador_march.pause();
          playSound('metallic_footsteps');
        }
      } else if (G.blackoutStageTimer >= 20.0) {
        G.blackoutStage = 3;
        G.blackoutStageTimer = 0;
        G.blackoutCheckTimer = 0;
        if (sounds.toreador_march) sounds.toreador_march.pause();
        playSound('metallic_footsteps');
      }
    } else if (G.blackoutStage === 3) {
      // Stage 3: Footsteps in darkness. Every 2s, 20% roll to jumpscare (or max 20s)
      if (G.blackoutCheckTimer >= 2.0) {
        G.blackoutCheckTimer = 0;
        if (Math.random() < 0.20 || G.blackoutStageTimer >= 20.0) {
          if (sounds.toreador_march) sounds.toreador_march.pause();
          triggerJumpscare('freddy_blackout', 'Freddy Fazbear (Blackout Power Loss)');
          return;
        }
      } else if (G.blackoutStageTimer >= 20.0) {
        if (sounds.toreador_march) sounds.toreador_march.pause();
        triggerJumpscare('freddy_blackout', 'Freddy Fazbear (Blackout Power Loss)');
        return;
      }
    }

    updateOfficePanning(dt);
  }
}

function getCameraFeedImage() {
  const freddyAt = (r) => {
    if (r === '1A') return G.freddy.pos === 1;
    if (r === '1B') return G.freddy.pos === 2;
    if (r === '7')  return G.freddy.pos === 3;
    if (r === '6')  return G.freddy.pos === 4;
    if (r === '4A') return G.freddy.pos === 5;
    if (r === '4B') return G.freddy.pos === 6;
    return false;
  };

  const bonnieAt = (r) => {
    if (r === '1A') return G.bonnie.pos === 1;
    if (r === '1B') return G.bonnie.pos === 2;
    if (r === '5')  return G.bonnie.pos === 3;
    if (r === '2A') return G.bonnie.pos === 4;
    if (r === '3')  return G.bonnie.pos === 5;
    if (r === '2B') return G.bonnie.pos === 6;
    return false;
  };

  const chicaAt = (r) => {
    if (r === '1A') return G.chica.pos === 1;
    if (r === '1B') return G.chica.pos === 2;
    if (r === '7')  return G.chica.pos === 3;
    if (r === '6')  return G.chica.pos === 4;
    if (r === '4A') return G.chica.pos === 5;
    if (r === '4B') return G.chica.pos === 6;
    return false;
  };

  const cam = G.selectedCam;

  // CAM 1A: Show Stage
  if (cam === '1A') {
    const b = bonnieAt('1A'), c = chicaAt('1A'), f = freddyAt('1A');
    if (b && c && f) return images['stage-b-c-f'];
    if (c && f) return images['stage-c-f'];
    if (b && f) return images['stage-b-f'];
    if (f) return images['stage-f'];
    return images['stage'];
  }

  // CAM 1B: Dining Area
  if (cam === '1B') {
    const b = bonnieAt('1B'), c = chicaAt('1B'), f = freddyAt('1B');
    if (b && c && f) return images['dinningarea-b-c-f'];
    if (b && c) return images['dinningarea-b-c'];
    if (b && f) return images['dinningarea-b-f'];
    if (c && f) return images['dinningarea-c-f'];
    if (b) return images['dinningarea-b'];
    if (c) return images['dinningarea-c'];
    if (f) return images['dinningarea-f'];
    return images['dinningarea'];
  }

  // CAM 1C: Pirate Cove
  if (cam === '1C') {
    if (G.foxy.stage === 1) return images['pirate_cove'];
    if (G.foxy.stage === 2) return images['pirate_cove-1'];
    if (G.foxy.stage === 3) return images['pirate_cove-2'];
    if (G.pirateCoveItsMe && images['pirate_cove_itsme']) {
      return images['pirate_cove_itsme'];
    }
    return images['pirate_cove-3'];
  }

  // CAM 2A: West Hall
  if (cam === '2A') {
    if (G.foxy.stage === 4) {
      if (G.foxy.sprintTimer < 1.6) {
        const idx = Math.min(7, Math.floor((G.foxy.sprintTimer / 1.6) * 8));
        return images['foxy_run_' + idx] || images['dash_run_' + idx];
      }
      return images['west_hall'];
    }
    if (bonnieAt('2A')) return images['west_hall-b'];
    return images['west_hall'];
  }

  // CAM 2B: West Hall Corner
  if (cam === '2B') {
    if (bonnieAt('2B')) return images['whallcorner-b'];
    if ((G.cam2bPoster === 'golden' || G.cam2bGoldenPoster) && images['cam_2b_golden']) {
      return images['cam_2b_golden'];
    }
    if (G.cam2bPoster === 'ripping' && images['cam_2b_ripping']) {
      return images['cam_2b_ripping'];
    }
    return images['whallcorner'];
  }

  // CAM 3: Supply Closet
  if (cam === '3') {
    if (bonnieAt('3')) return images['supplyroom-b'];
    return images['supplyroom'];
  }

  // CAM 4A: East Hall
  if (cam === '4A') {
    const c = chicaAt('4A'), f = freddyAt('4A');
    if (c && f) return images['east_hall-c-f'];
    if (c) return images['east_hall-c'];
    if (f) return images['east_hall-f'];
    if (G.cam4aItsMe && images['east_hall_itsme']) {
      return images['east_hall_itsme'];
    }
    return images['east_hall_normal'] || images['east_hall'];
  }

  // CAM 4B: East Hall Corner
  if (cam === '4B') {
    if (chicaAt('4B')) return images['ehallcorner-c'];
    if (freddyAt('4B')) return images['ehallcorner-f'];
    if (G.cam4bEasterEgg && images['ehallcorner_news' + G.cam4bEasterEgg]) {
      return images['ehallcorner_news' + G.cam4bEasterEgg];
    }
    return images['ehallcorner_rules'] || images['ehallcorner'];
  }

  // CAM 5: Backstage
  if (cam === '5') {
    if (bonnieAt('5')) {
      if (G.bonnieStareCam5 && images['backstage_bonnie_stare']) {
        return images['backstage_bonnie_stare'];
      }
      return images['backstage-b'];
    }
    if (G.backstageHeadsStare && images['backstage_heads_stare']) {
      return images['backstage_heads_stare'];
    }
    return images['backstage'];
  }

  // CAM 6: Kitchen (Audio Only)
  if (cam === '6') {
    return images['cam_6_kitchen'];
  }

  // CAM 7: Restrooms
  if (cam === '7') {
    const c = chicaAt('7'), f = freddyAt('7');
    if (c && f) return images['restrooms-c-f'];
    if (c) return images['restrooms-c'];
    if (f) return images['restrooms-f'];
    return images['restrooms'];
  }

  return images['stage-b-c-f'] || images['stage'];
}
