/**
 * Canvas rendering pipeline for Five Nights at Freddy's.
 * Renders the office, cameras, CRT scanline atmosphere, jumpscares, and FNaF-style menus.
 */

function render() {
  ctx.clearRect(0, 0, 1920, 1080);

  // Main menu
  if (G.gameState === 'menu') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1920, 1080);

    const fImg = images['menu_freddy_' + G.menuFreddyFrame];
    if (fImg && fImg.complete) {
      let jx = 0;
      if (G.menuTwitchActive) jx = (Math.random() - 0.5) * 20;
      ctx.drawImage(fImg, jx, 0, 1920, 1080);
    }

    const sImg = images['static' + G.staticFrame];
    if (sImg && sImg.complete) {
      ctx.globalAlpha = 0.22 + (G.menuTwitchActive ? 0.25 : 0);
      ctx.drawImage(sImg, 0, 0, 1920, 1080);
      ctx.globalAlpha = 1.0;
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '84px SpecialElite, monospace';
    ctx.fillText('Five', 140, 200);
    ctx.fillText('Nights', 140, 290);
    ctx.fillText('at', 140, 380);
    ctx.fillStyle = '#ff2222';
    ctx.fillText("Freddy's", 140, 480);

    // Stars display
    if (G.saveData.stars > 0) {
      ctx.save();
      ctx.font = '48px Consolas, FnafConsolas, monospace';
      ctx.fillStyle = '#ffe066';
      ctx.shadowColor = '#ffbb00';
      ctx.shadowBlur = 14;
      for (let i = 0; i < G.saveData.stars; i++) {
        ctx.fillText('★', 140 + i * 55, 560);
      }
      ctx.restore();
    }

    // Menu options
    const menuItems = getAvailableMenuItems();
    for (let idx = 0; idx < menuItems.length; idx++) {
      const item = menuItems[idx];
      const isSelected = (G.selectedMenuOption === idx);
      const topY = 620 + idx * 75;

      ctx.font = '50px SpecialElite, monospace';
      if (isSelected) {
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`>> ${item.label}`, 120, topY + 45);
      } else {
        ctx.fillStyle = '#888888';
        ctx.fillText(`   ${item.label}`, 120, topY + 45);
      }

      ctx.font = '26px VT323, monospace';
      ctx.fillStyle = isSelected ? '#ff4444' : '#555555';
      ctx.fillText(`${item.sub}`, 460, topY + 40);
    }

    ctx.font = '26px VT323, monospace';
    ctx.fillStyle = '#555555';
    ctx.fillText('v 2.1 (Authentic FNaF 1 HD Engine)', 80, 1040);
    ctx.textAlign = 'right';
    ctx.fillText('© Scott Cawthon', 1840, 1040);
    return;
  }

  // Custom Night (Night 7)
  if (G.gameState === 'custom_night') {
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, 1920, 1080);

    const sImg = images['static' + G.staticFrame];
    if (sImg && sImg.complete) {
      ctx.globalAlpha = 0.20 + Math.random() * 0.06;
      ctx.drawImage(sImg, 0, 0, 1920, 1080);
      ctx.globalAlpha = 1.0;
    }

    ctx.textAlign = 'center';
    ctx.font = '72px SpecialElite, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('CUSTOM NIGHT', 960, 100);

    ctx.font = '28px VT323, monospace';
    ctx.fillStyle = '#888888';
    ctx.fillText('SET A.I. LEVELS (0 - 20)', 960, 145);

    const cards = [
      { key: 'freddy', name: 'Freddy Fazbear', sub: 'Show Stage',   img: images.custom_freddy, x: 140,  color: '#c28544' },
      { key: 'bonnie', name: 'Bonnie',         sub: 'Left Hall',    img: images.custom_bonnie, x: 540,  color: '#6866b8' },
      { key: 'chica',  name: 'Chica',          sub: 'Right Hall',   img: images.custom_chica,  x: 940,  color: '#cccc33' },
      { key: 'foxy',   name: 'Foxy',           sub: 'Pirate Cove',  img: images.custom_foxy,   x: 1340, color: '#c23333' }
    ];

    for (const c of cards) {
      ctx.fillStyle = 'rgba(15, 15, 20, 0.9)';
      ctx.fillRect(c.x, 190, 340, 520);
      ctx.strokeStyle = c.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(c.x, 190, 340, 520);

      if (c.img && c.img.complete) {
        ctx.drawImage(c.img, c.x + 70, 220, 200, 200);
      } else {
        ctx.fillStyle = '#111';
        ctx.fillRect(c.x + 70, 220, 200, 200);
      }
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(c.x + 70, 220, 200, 200);

      ctx.textAlign = 'center';
      ctx.font = '42px SpecialElite, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(c.name, c.x + 170, 470);

      ctx.font = '24px VT323, monospace';
      ctx.fillStyle = '#777777';
      ctx.fillText(c.sub, c.x + 170, 505);

      const lvl = G.customAI[c.key];
      const hoverLeft = (G.mouseX >= c.x + 35 && G.mouseX <= c.x + 95 && G.mouseY >= 560 && G.mouseY <= 620);
      const hoverRight = (G.mouseX >= c.x + 245 && G.mouseX <= c.x + 305 && G.mouseY >= 560 && G.mouseY <= 620);

      ctx.fillStyle = hoverLeft ? '#333344' : '#181820';
      ctx.fillRect(c.x + 35, 560, 60, 60);
      ctx.strokeStyle = hoverLeft ? '#ffffff' : '#666';
      ctx.lineWidth = 2;
      ctx.strokeRect(c.x + 35, 560, 60, 60);
      ctx.font = '42px VT323, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('<', c.x + 65, 602);

      ctx.font = '64px VT323, monospace';
      ctx.fillStyle = lvl === 20 ? '#ff2222' : (lvl === 0 ? '#44ff44' : '#ffffff');
      ctx.fillText(lvl, c.x + 170, 608);

      ctx.fillStyle = hoverRight ? '#333344' : '#181820';
      ctx.fillRect(c.x + 245, 560, 60, 60);
      ctx.strokeStyle = hoverRight ? '#ffffff' : '#666';
      ctx.lineWidth = 2;
      ctx.strokeRect(c.x + 245, 560, 60, 60);
      ctx.font = '42px VT323, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('>', c.x + 275, 602);

      ctx.font = '28px VT323, monospace';
      ctx.fillStyle = '#888888';
      ctx.fillText('A.I. LEVEL', c.x + 170, 670);
    }

    // Presets row
    const presets = [
      { name: '20 / 20 / 20 / 20', sub: 'Nightmare', x: 140, w: 260 },
      { name: '10 / 10 / 10 / 10', sub: 'Hard',      x: 440, w: 260 },
      { name: '5 / 5 / 5 / 5',     sub: 'Medium',    x: 740, w: 260 },
      { name: '0 / 0 / 0 / 0',     sub: 'Passive',   x: 1040, w: 260 }
    ];

    for (const p of presets) {
      const hover = (G.mouseX >= p.x && G.mouseX <= p.x + p.w && G.mouseY >= 760 && G.mouseY <= 820);
      ctx.fillStyle = hover ? '#252530' : '#121218';
      ctx.fillRect(p.x, 760, p.w, 60);
      ctx.strokeStyle = hover ? '#ffffff' : '#333344';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, 760, p.w, 60);

      ctx.textAlign = 'center';
      ctx.font = '30px VT323, monospace';
      ctx.fillStyle = hover ? '#ffffff' : '#cccccc';
      ctx.fillText(p.name, p.x + p.w / 2, 795);
      ctx.font = '20px VT323, monospace';
      ctx.fillStyle = '#777777';
      ctx.fillText(p.sub, p.x + p.w / 2, 814);
    }

    // Ready button
    const hoverReady = (G.mouseX >= 1380 && G.mouseX <= 1740 && G.mouseY >= 740 && G.mouseY <= 830);
    ctx.fillStyle = hoverReady ? '#1b4d24' : '#0e2b14';
    ctx.fillRect(1380, 740, 360, 90);
    ctx.strokeStyle = hoverReady ? '#44ff66' : '#22aa44';
    ctx.lineWidth = 3;
    ctx.strokeRect(1380, 740, 360, 90);

    ctx.textAlign = 'center';
    ctx.font = '50px VT323, monospace';
    ctx.fillStyle = hoverReady ? '#ffffff' : '#44ff66';
    ctx.fillText('READY', 1560, 800);

    // Back button
    const hoverBack = (G.mouseX >= 140 && G.mouseX <= 400 && G.mouseY >= 880 && G.mouseY <= 950);
    ctx.font = '36px SpecialElite, monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = hoverBack ? '#ffffff' : '#777777';
    ctx.fillText(hoverBack ? '>> BACK' : '   BACK', 140, 925);
    return;
  }

  // Extra menu (FNaF style)
  if (G.gameState === 'extra') {
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, 1920, 1080);

    const sImg = images['static' + G.staticFrame];
    if (sImg && sImg.complete) {
      ctx.globalAlpha = 0.20 + Math.random() * 0.05;
      ctx.drawImage(sImg, 0, 0, 1920, 1080);
      ctx.globalAlpha = 1.0;
    }

    ctx.textAlign = 'left';
    ctx.font = '64px SpecialElite, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('EXTRA', 120, 90);

    // Back button in top right
    const hoverBackExtra = (G.mouseX >= 1600 && G.mouseX <= 1800 && G.mouseY >= 50 && G.mouseY <= 100);
    ctx.font = '36px SpecialElite, monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = hoverBackExtra ? '#ffffff' : '#777777';
    ctx.fillText(hoverBackExtra ? '>> BACK' : '   BACK', 1800, 90);

    // Tabs: Freddy, Bonnie, Chica, Foxy, Golden Freddy, Night Select
    const rosterList = [
      { id: 0, label: 'FREDDY', color: '#c28544' },
      { id: 1, label: 'BONNIE', color: '#6866b8' },
      { id: 2, label: 'CHICA',  color: '#cccc33' },
      { id: 3, label: 'FOXY',   color: '#c23333' },
      { id: 4, label: 'GOLDEN FREDDY', color: '#ffd700' },
      { id: 5, label: 'NIGHTS', color: '#44ffaa' }
    ];

    for (let i = 0; i < 6; i++) {
      const item = rosterList[i];
      const bx = 120 + i * 280;
      const isSel = (G.extraSelectedAnim === i);
      const isHover = (G.mouseX >= bx && G.mouseX <= bx + 260 && G.mouseY >= 130 && G.mouseY <= 180);

      ctx.textAlign = 'center';
      ctx.font = '32px SpecialElite, monospace';
      if (isSel) {
        ctx.fillStyle = item.color;
        ctx.fillText(`[ ${item.label} ]`, bx + 130, 168);
      } else {
        ctx.fillStyle = isHover ? '#ffffff' : '#666666';
        ctx.fillText(item.label, bx + 130, 168);
      }
    }

    if (G.extraSelectedAnim === 5) {
      // Clean FNaF-style night selector (Nights 1 to 6 & Custom Night)
      ctx.textAlign = 'center';
      ctx.font = '40px SpecialElite, monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('SELECT NIGHT', 960, 270);

      const nightsList = [
        { night: 1, label: 'NIGHT 1', x: 260, y: 360 },
        { night: 2, label: 'NIGHT 2', x: 720, y: 360 },
        { night: 3, label: 'NIGHT 3', x: 1180, y: 360 },
        { night: 4, label: 'NIGHT 4', x: 1640, y: 360 },
        { night: 5, label: 'NIGHT 5', x: 490, y: 560 },
        { night: 6, label: 'NIGHT 6', x: 960, y: 560 },
        { night: 7, label: 'CUSTOM NIGHT', x: 1430, y: 560 }
      ];

      for (const n of nightsList) {
        const w = (n.night === 7) ? 360 : 280;
        const h = 80;
        const bx = n.x - w / 2;
        const by = n.y;
        const hover = (G.mouseX >= bx && G.mouseX <= bx + w && G.mouseY >= by && G.mouseY <= by + h);

        ctx.fillStyle = hover ? '#222230' : '#101018';
        ctx.fillRect(bx, by, w, h);
        ctx.strokeStyle = hover ? '#ffffff' : '#333344';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, w, h);

        ctx.textAlign = 'center';
        ctx.font = '36px SpecialElite, monospace';
        ctx.fillStyle = hover ? '#44ffaa' : '#ffffff';
        ctx.fillText(n.label, n.x, by + 50);
      }
      return;
    }

    // Animatronic showcase view
    const characters = [
      {
        name: 'FREDDY FAZBEAR',
        role: 'Band Leader & Main Attraction',
        start: 'CAM 1A (Show Stage)',
        sound: 'freddy_laugh',
        img: images.extra_freddy
      },
      {
        name: 'BONNIE',
        role: 'Guitarist & Hallway Prowler',
        start: 'CAM 1A (Show Stage)',
        sound: 'screamer',
        img: images.extra_bonnie
      },
      {
        name: 'CHICA',
        role: 'Backup Singer & Kitchen Lingerer',
        start: 'CAM 1A (Show Stage)',
        sound: 'kitchen_rattle',
        img: images.extra_chica
      },
      {
        name: 'FOXY THE PIRATE',
        role: 'Secluded Out-of-Order Entertainer',
        start: 'CAM 1C (Pirate Cove)',
        sound: 'foxy_song',
        img: images.extra_foxy
      },
      {
        name: 'GOLDEN FREDDY',
        role: 'Supernatural Hallucination',
        start: 'Unknown Manifestation',
        sound: 'golden_freddy_scream',
        img: images.extra_golden_freddy
      }
    ];

    const current = characters[G.extraSelectedAnim];

    // Character preview portrait
    if (current.img && current.img.complete) {
      const iw = current.img.width;
      const ih = current.img.height;
      const scale = Math.min(600 / iw, 720 / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = 200 + (600 - dw) / 2;
      const dy = 250 + (720 - dh) / 2;
      ctx.drawImage(current.img, dx, dy, dw, dh);
    }

    // Name and details
    ctx.textAlign = 'left';
    ctx.font = '54px SpecialElite, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(current.name, 900, 320);

    ctx.font = '32px VT323, monospace';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText(`LOCATION: ${current.start}`, 900, 380);
    ctx.fillText(`DESIGNATION: ${current.role}`, 900, 420);

    // Audio test button in FNaF style
    const hoverSound = (G.mouseX >= 900 && G.mouseX <= 1260 && G.mouseY >= 500 && G.mouseY <= 570);
    ctx.fillStyle = hoverSound ? '#222230' : '#101018';
    ctx.fillRect(900, 500, 360, 70);
    ctx.strokeStyle = hoverSound ? '#ffffff' : '#333344';
    ctx.lineWidth = 2;
    ctx.strokeRect(900, 500, 360, 70);

    ctx.textAlign = 'center';
    ctx.font = '32px SpecialElite, monospace';
    ctx.fillStyle = hoverSound ? '#ffffff' : '#888888';
    ctx.fillText('PLAY SOUND', 1080, 545);

    return;
  }

  // Shift Intro (12:00 AM)
  if (G.gameState === 'shift_intro') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1920, 1080);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '110px VT323, monospace';
    ctx.fillText('12:00 AM', 960, 480);

    ctx.font = '64px VT323, monospace';
    ctx.fillStyle = '#aaaaaa';
    const suffix = (G.currentNight === 1) ? '1st' : (G.currentNight === 2) ? '2nd' : (G.currentNight === 3) ? '3rd' : `${G.currentNight}th`;
    ctx.fillText(`${suffix} Night`, 960, 580);
    return;
  }

  // Game over / Jumpscare
  if (G.gameState === 'gameover') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1920, 1080);

    const maxScareTime = (G.jumpscareType === 'golden_freddy') ? 9.35 : 1.4;
    if (G.jumpscareTimer < maxScareTime) {
      let scareImg = null;
      if (G.jumpscareType === 'freddy') {
        const idx = Math.min(6, G.jumpscareFrame);
        scareImg = images['freddy_scare_' + idx];
      } else if (G.jumpscareType === 'freddy_blackout') {
        const idx = Math.min(20, G.jumpscareFrame);
        scareImg = images['freddy_blackout_' + idx];
      } else if (G.jumpscareType === 'bonnie') {
        const idx = Math.min(6, G.jumpscareFrame);
        scareImg = images['bonnie_scare_' + idx];
      } else if (G.jumpscareType === 'chica') {
        const idx = Math.min(5, G.jumpscareFrame);
        scareImg = images['chica_scare_' + idx];
      } else if (G.jumpscareType === 'foxy') {
        const idx = Math.min(6, G.jumpscareFrame);
        scareImg = images['foxy_scare_' + idx];
      } else if (G.jumpscareType === 'golden_freddy') {
        scareImg = images['golden_freddy_scare'];
      }

      if (scareImg && scareImg.complete) {
        ctx.drawImage(scareImg, 0, 0, 1920, 1080);
      }
    }
    return;
  }

  // 1987 Easter egg crash
  if (G.gameState === 'crashed') {
    ctx.fillStyle = '#05070a';
    ctx.fillRect(0, 0, 1920, 1080);

    const sImg = images['static' + G.staticFrame];
    if (sImg && sImg.complete) {
      ctx.globalAlpha = 0.08;
      ctx.drawImage(sImg, 0, 0, 1920, 1080);
      ctx.globalAlpha = 1.0;
    }

    const dw = 720, dh = 320;
    const dx = (1920 - dw) / 2;
    const dy = (1080 - dh) / 2;

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(dx, dy, dw, dh);
    ctx.strokeStyle = '#0055ea';
    ctx.lineWidth = 2;
    ctx.strokeRect(dx, dy, dw, dh);

    ctx.fillStyle = '#0055ea';
    ctx.fillRect(dx, dy, dw, 40);
    ctx.textAlign = 'left';
    ctx.font = 'bold 20px Consolas, FnafConsolas, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Fatal Application Error: FiveNightsAtFreddys.exe', dx + 15, dy + 27);

    ctx.fillStyle = '#e81123';
    ctx.fillRect(dx + dw - 40, dy, 40, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('×', dx + dw - 20, dy + 28);

    ctx.beginPath();
    ctx.arc(dx + 65, dy + 115, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#cc0000';
    ctx.fill();
    ctx.strokeStyle = '#990000';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('✕', dx + 65, dy + 127);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#111111';
    ctx.font = '19px Consolas, FnafConsolas, monospace';
    ctx.fillText('The instruction at 0x00419870 referenced memory at 0x00001987.', dx + 125, dy + 95);
    ctx.fillText('The memory could not be "read".', dx + 125, dy + 125);
    ctx.fillStyle = '#666666';
    ctx.font = '16px Consolas, FnafConsolas, monospace';
    ctx.fillText('(Exception Code: 0xC0000005 - STATUS_ACCESS_VIOLATION)', dx + 125, dy + 155);
    ctx.fillText('Click anywhere to terminate and restart the application.', dx + 125, dy + 185);

    const okHover = (G.mouseX >= dx + dw - 160 && G.mouseX <= dx + dw - 30 && G.mouseY >= dy + dh - 60 && G.mouseY <= dy + dh - 20);
    ctx.fillStyle = okHover ? '#e0e0e0' : '#ffffff';
    ctx.fillRect(dx + dw - 160, dy + dh - 60, 130, 40);
    ctx.strokeStyle = okHover ? '#0055ea' : '#707070';
    ctx.lineWidth = okHover ? 2 : 1;
    ctx.strokeRect(dx + dw - 160, dy + dh - 60, 130, 40);

    ctx.textAlign = 'center';
    ctx.font = '18px Consolas, FnafConsolas, monospace';
    ctx.fillStyle = '#000000';
    ctx.fillText('OK', dx + dw - 95, dy + dh - 34);
    return;
  }

  // 6:00 AM Victory sequence
  if (G.gameState === 'win') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1920, 1080);

    if (G.winTimer < 3.8) {
      const frameIdx = Math.min(44, Math.floor(G.winTimer * 12));
      const pad = (frameIdx < 10 ? '0' : '') + frameIdx;
      const winImg = images['win_' + pad];
      if (winImg && winImg.complete) {
        const w = 1000;
        const h = 436;
        const x = (1920 - w) / 2;
        const y = (1080 - h) / 2;
        ctx.drawImage(winImg, x, y, w, h);
      } else {
        ctx.textAlign = 'center';
        ctx.font = '140px VT323, monospace';
        ctx.fillStyle = '#00ff66';
        ctx.fillText('6:00 AM', 960, 540);
      }
    }
    return;
  }

  // Office view
  if (G.tabletState !== 'open') {
    const ox = G.panX;

    let bg = images.office_default;
    if (G.blackout) {
      if (G.blackoutStage === 1 || G.blackoutStage === 3) {
        bg = images.office_powerout;
      } else if (G.blackoutStage === 2) {
        if (G.blackoutFreddyFlickerState === 0) {
          bg = images.office_freddy_eyes;
        } else if (G.blackoutFreddyFlickerState === 1) {
          bg = images.office_freddy_eyes_dim;
        } else {
          bg = images.office_powerout;
        }
      }
    } else if (G.lightLeftOn) {
      bg = (G.bonnie.pos === 7) ? images.office_bonnie_window : images.office_left_light;
    } else if (G.lightRightOn) {
      bg = (G.chica.pos === 7) ? images.office_chica_window : images.office_right_light;
    }

    if (bg && bg.complete) {
      ctx.drawImage(bg, ox, 0, 2400, 1080);
    }

    // Desk fan
    if (!G.blackout) {
      const fanIdx = (Math.floor(performance.now() / 55) % 3) + 1;
      const fanImg = images['fan_' + fanIdx];
      if (fanImg && fanImg.complete) {
        ctx.drawImage(fanImg, ox + 1170, 455, 207, 294);
      }
    }

    // Left door
    const lFrame = Math.round(G.doorLeftFrame);
    if (lFrame > 0) {
      const dImg = images['door_left_' + lFrame];
      if (dImg && dImg.complete) {
        ctx.drawImage(dImg, ox + 108, 0, 335, 1080);
      }
    }

    // Bonnie window reflection
    if (G.doorLeftClosed && G.lightLeftOn && (G.bonnie.pos === 7 || G.bonnie.pos === 6)) {
      const refImg = images.bonnie_window_reflection;
      if (refImg && refImg.complete) {
        ctx.save();
        ctx.globalAlpha = 0.88;
        ctx.drawImage(refImg, ox + 450, 210, 330, 630);
        ctx.restore();
      }
    }

    // Right door
    const rFrame = Math.round(G.doorRightFrame);
    if (rFrame > 0) {
      const dImg = images['door_right_' + rFrame];
      if (dImg && dImg.complete) {
        ctx.drawImage(dImg, ox + 1956, 0, 372, 1080);
      }
    }

    // Left door buttons
    let lBtn = images.btn_left_off;
    if (G.doorLeftClosed && G.lightLeftOn) lBtn = images.btn_left_both;
    else if (G.doorLeftClosed) lBtn = images.btn_left_door;
    else if (G.lightLeftOn) lBtn = images.btn_left_light;
    if (lBtn && lBtn.complete) {
      ctx.drawImage(lBtn, ox + 65, 380, 150, 340);
    }

    // Right door buttons
    let rBtn = images.btn_right_off;
    if (G.doorRightClosed && G.lightRightOn) rBtn = images.btn_right_both;
    else if (G.doorRightClosed) rBtn = images.btn_right_door;
    else if (G.lightRightOn) rBtn = images.btn_right_light;
    if (rBtn && rBtn.complete) {
      ctx.drawImage(rBtn, ox + 2210, 380, 150, 340);
    }

    // Golden Freddy slumped in office
    if (G.goldenFreddy.active && images.golden_freddy_office && images.golden_freddy_office.complete) {
      ctx.drawImage(images.golden_freddy_office, ox + 840, 380, 630, 630);
    }
  }

  // Camera system
  if (G.tabletState === 'open') {
    const feedImg = getCameraFeedImage();
    if (feedImg && feedImg.complete) {
      ctx.drawImage(feedImg, 0, 0, 1920, 1080);
    }

    // Static overlay
    const staticImg = images['static' + G.staticFrame];
    if (staticImg && staticImg.complete) {
      ctx.globalAlpha = 0.28;
      ctx.drawImage(staticImg, 0, 0, 1920, 1080);
      ctx.globalAlpha = 1.0;
    }

    // Minimap
    const mapImg = images.cam_map_clean;
    if (mapImg && mapImg.complete) {
      ctx.drawImage(mapImg, 1300, 485, 580, 580);
    }

    // Camera buttons
    for (const b of camButtons) {
      const active = (G.selectedCam === b.id);
      const borderImg = active ? images.cam_btn_active : images.cam_btn_normal;
      if (borderImg && borderImg.complete) {
        ctx.drawImage(borderImg, b.x, b.y, b.w, b.h);
      }

      const plateImg = images['plate_' + b.plate];
      if (plateImg && plateImg.complete) {
        const px = b.x + Math.floor((b.w - plateImg.width) / 2);
        const py = b.y + Math.floor((b.h - plateImg.height) / 2);
        ctx.drawImage(plateImg, px, py);
      } else {
        ctx.font = '26px VT323, monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(b.id, b.x + b.w / 2, b.y + b.h - 14);
      }

      if (!active && G.mouseX >= b.x && G.mouseX <= b.x + b.w && G.mouseY >= b.y && G.mouseY <= b.y + b.h) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }
    }

    // Header and recording dot
    ctx.font = '50px VT323, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    const activeBtn = camButtons.find(b => b.id === G.selectedCam);
    ctx.fillText('CAM ' + G.selectedCam + ' - ' + (activeBtn ? activeBtn.name : ''), 60, 70);

    const blink = Math.floor(performance.now() / 450) % 2 === 0;
    if (blink) {
      ctx.fillStyle = '#ff1111';
      ctx.beginPath();
      ctx.arc(1830, 65, 16, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Tablet transition
  if (G.tabletState === 'opening' || G.tabletState === 'closing') {
    const frameNum = Math.max(1, Math.min(11, Math.round(G.tabletFrame)));
    const pad = (frameNum < 10 ? '0' : '') + frameNum;
    const tabImg = images['tablet_' + pad];
    if (tabImg && tabImg.complete) {
      ctx.drawImage(tabImg, 0, 0, 1920, 1080);
    }
  }

  // Hallucination overlay
  if (G.halluActive && G.halluImg && G.halluImg.complete) {
    ctx.drawImage(G.halluImg, 0, 0, 1920, 1080);
  }

  // In-game HUD
  if (G.gameState === 'playing') {
    if (G.phoneCallActive && !G.phoneCallMuted) {
      if (images.mute_call && images.mute_call.complete) {
        ctx.drawImage(images.mute_call, 60, 70, 180, 46);
      } else {
        ctx.fillStyle = 'rgba(200, 0, 0, 0.7)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.fillRect(60, 70, 180, 46);
        ctx.strokeRect(60, 70, 180, 46);
        ctx.font = '26px VT323, monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('MUTE CALL', 150, 102);
      }
    }

    ctx.font = '72px VT323, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText((G.hour === 0 ? 12 : G.hour) + ' AM', 1860, 70);

    ctx.font = '40px VT323, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Night ${G.currentNight}`, 1860, 120);

    ctx.textAlign = 'left';
    ctx.font = '48px VT323, monospace';
    ctx.fillStyle = (G.power > 15) ? '#ffffff' : '#ff2222';
    ctx.fillText('Power left: ' + Math.ceil(G.power) + '%', 60, 940);

    ctx.font = '38px VT323, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Usage: ', 60, 990);

    const usageStartX = 180;
    for (let i = 0; i < G.usage; i++) {
      let blockColor = '#00dd44';
      if (G.usage === 3 || G.usage === 4) blockColor = (i < 2) ? '#00dd44' : '#eedd00';
      if (G.usage >= 5) blockColor = (i < 2) ? '#00dd44' : ((i < 4) ? '#eedd00' : '#dd2222');
      ctx.fillStyle = blockColor;
      ctx.fillRect(usageStartX + i * 22, 966, 16, 26);
    }

    if (!G.blackout) {
      if (images.monitor_bar && images.monitor_bar.complete) {
        ctx.drawImage(images.monitor_bar, 660, 1000, 600, 70);
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.strokeStyle = '#888888';
        ctx.lineWidth = 2;
        ctx.fillRect(660, 1000, 600, 70);
        ctx.strokeRect(660, 1000, 600, 70);
      }
    }
  }
}
