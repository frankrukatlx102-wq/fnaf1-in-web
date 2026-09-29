/**
 * Five Nights at Freddy's - Render Engine
 * Canvas 2D rendering pipeline (1920x1080 native resolution).
 * Handles CRT scanlines, main menu, Custom Night, Extra dossiers, office pan, doors, cameras, and jumpscares.
 */

function render() {
  ctx.clearRect(0, 0, 1920, 1080);

  // ---------------------------------------------------------------------------
  // 1. MAIN MENU
  // ---------------------------------------------------------------------------
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

    // Stars display (★)
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

    // Dynamic Menu Items
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
    ctx.fillText('v 2.1 (Modular Engine & SHA-256 Data Integrity)', 80, 1040);
    ctx.textAlign = 'right';
    ctx.fillText('© Scott Cawthon / Fazbear Entertainment', 1840, 1040);
    return;
  }

  // ---------------------------------------------------------------------------
  // 2. CUSTOM NIGHT (NIGHT 7)
  // ---------------------------------------------------------------------------
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

    ctx.font = '32px VT323, monospace';
    ctx.fillStyle = '#888888';
    ctx.fillText('НАСТРОЙКА УРОВНЕЙ ИСКУССТВЕННОГО ИНТЕЛЛЕКТА (0 - 20)', 960, 145);

    const cards = [
      { key: 'freddy', name: 'Freddy Fazbear', sub: 'Show Stage Leader',   img: images.custom_freddy, x: 140,  color: '#c28544' },
      { key: 'bonnie', name: 'Bonnie',         sub: 'Left Hall Prowler',    img: images.custom_bonnie, x: 540,  color: '#6866b8' },
      { key: 'chica',  name: 'Chica',          sub: 'Right Hall Stalker',   img: images.custom_chica,  x: 940,  color: '#cccc33' },
      { key: 'foxy',   name: 'Foxy',           sub: 'Pirate Cove Sprinter', img: images.custom_foxy,   x: 1340, color: '#c23333' }
    ];

    for (const c of cards) {
      ctx.fillStyle = 'rgba(20, 20, 25, 0.85)';
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
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;
      ctx.strokeRect(c.x + 70, 220, 200, 200);

      ctx.textAlign = 'center';
      ctx.font = '46px SpecialElite, monospace';
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

    // Presets Row
    const presets = [
      { name: '20 / 20 / 20 / 20', desc: 'Кошмар (Nightmare)', x: 140, w: 260 },
      { name: '10 / 10 / 10 / 10', desc: 'Сложно (Hard)',       x: 440, w: 260 },
      { name: '5 / 5 / 5 / 5',     desc: 'Средне (Normal)',     x: 740, w: 260 },
      { name: '0 / 0 / 0 / 0',     desc: 'Пацифист (Safe)',     x: 1040, w: 260 }
    ];

    for (const p of presets) {
      const hover = (G.mouseX >= p.x && G.mouseX <= p.x + p.w && G.mouseY >= 760 && G.mouseY <= 820);
      ctx.fillStyle = hover ? '#2a2a35' : '#14141c';
      ctx.fillRect(p.x, 760, p.w, 60);
      ctx.strokeStyle = hover ? '#00ddff' : '#444455';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.x, 760, p.w, 60);

      ctx.textAlign = 'center';
      ctx.font = '32px VT323, monospace';
      ctx.fillStyle = hover ? '#00ddff' : '#ffffff';
      ctx.fillText(p.name, p.x + p.w / 2, 795);
      ctx.font = '20px VT323, monospace';
      ctx.fillStyle = '#777777';
      ctx.fillText(p.desc, p.x + p.w / 2, 814);
    }

    // Ready / Start Shift Button
    const hoverReady = (G.mouseX >= 1380 && G.mouseX <= 1740 && G.mouseY >= 740 && G.mouseY <= 830);
    ctx.fillStyle = hoverReady ? '#005522' : '#003314';
    ctx.fillRect(1380, 740, 360, 90);
    ctx.strokeStyle = hoverReady ? '#00ff66' : '#00aa44';
    ctx.lineWidth = 4;
    ctx.strokeRect(1380, 740, 360, 90);

    ctx.textAlign = 'center';
    ctx.font = '54px VT323, monospace';
    ctx.fillStyle = '#00ff66';
    ctx.fillText('READY / СТАРТ', 1560, 802);

    // Back to Menu Button
    const hoverBack = (G.mouseX >= 140 && G.mouseX <= 460 && G.mouseY >= 880 && G.mouseY <= 950);
    ctx.fillStyle = hoverBack ? '#2a2a35' : '#14141c';
    ctx.fillRect(140, 880, 320, 70);
    ctx.strokeStyle = hoverBack ? '#ffffff' : '#444455';
    ctx.lineWidth = 2;
    ctx.strokeRect(140, 880, 320, 70);

    ctx.textAlign = 'center';
    ctx.font = '36px VT323, monospace';
    ctx.fillStyle = hoverBack ? '#ffffff' : '#888888';
    ctx.fillText('<< В ГЛАВНОЕ МЕНЮ', 300, 925);
    return;
  }

  // ---------------------------------------------------------------------------
  // 3. EXTRA DOSSIER & ARCHIVE
  // ---------------------------------------------------------------------------
  if (G.gameState === 'extra') {
    ctx.fillStyle = '#06060a';
    ctx.fillRect(0, 0, 1920, 1080);

    const sImg = images['static' + G.staticFrame];
    if (sImg && sImg.complete) {
      ctx.globalAlpha = 0.20 + Math.random() * 0.06;
      ctx.drawImage(sImg, 0, 0, 1920, 1080);
      ctx.globalAlpha = 1.0;
    }

    ctx.textAlign = 'left';
    ctx.font = '50px SpecialElite, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('АРХИВ ЭКСТРА / EXTRA MENU — ДОСЬЕ АНИМАТРОНИКОВ', 120, 65);

    ctx.font = '24px VT323, monospace';
    ctx.fillStyle = '#88aacc';
    ctx.fillText('Досье аниматроников, звуковой архив и быстрый выбор смен', 120, 102);

    const hoverBackExtra = (G.mouseX >= 1520 && G.mouseX <= 1800 && G.mouseY >= 50 && G.mouseY <= 105);
    ctx.fillStyle = hoverBackExtra ? '#282835' : '#121218';
    ctx.fillRect(1520, 50, 280, 55);
    ctx.strokeStyle = hoverBackExtra ? '#ffffff' : '#444455';
    ctx.lineWidth = 2;
    ctx.strokeRect(1520, 50, 280, 55);
    ctx.textAlign = 'center';
    ctx.font = '32px VT323, monospace';
    ctx.fillStyle = hoverBackExtra ? '#ffffff' : '#888888';
    ctx.fillText('<< В ГЛАВНОЕ МЕНЮ', 1660, 88);

    const rosterList = [
      { id: 0, name: 'Фредди Фазбер', color: '#c28544' },
      { id: 1, name: 'Бонни', color: '#6866b8' },
      { id: 2, name: 'Чика',  color: '#cccc33' },
      { id: 3, name: 'Фокси', color: '#c23333' },
      { id: 4, name: 'Золотой Фредди', color: '#ffd700' },
      { id: 5, name: '🌙 ВЫБОР СМЕНЫ (НОЧИ)', color: '#00ff88' }
    ];

    for (let i = 0; i < 6; i++) {
      const item = rosterList[i];
      const bx = 120 + i * 280;
      const isSel = (G.extraSelectedAnim === i);
      const isHover = (G.mouseX >= bx && G.mouseX <= bx + 265 && G.mouseY >= 130 && G.mouseY <= 185);
      ctx.fillStyle = isSel ? '#202535' : (isHover ? '#151924' : '#0e1118');
      ctx.fillRect(bx, 130, 265, 55);
      ctx.strokeStyle = isSel ? item.color : (isHover ? '#445566' : '#252a38');
      ctx.lineWidth = isSel ? 3 : 1;
      ctx.strokeRect(bx, 130, 265, 55);

      ctx.textAlign = 'center';
      ctx.font = '26px VT323, monospace';
      ctx.fillStyle = isSel ? '#ffffff' : (isHover ? '#ccddee' : '#778899');
      ctx.fillText(item.name, bx + 132, 168);
    }

    if (G.extraSelectedAnim === 5) {
      // Night Selector Submenu
      ctx.fillStyle = '#0b0d14';
      ctx.fillRect(120, 210, 1680, 800);
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.strokeRect(120, 210, 1680, 800);

      ctx.textAlign = 'center';
      ctx.font = '40px SpecialElite, monospace';
      ctx.fillStyle = '#00ff88';
      ctx.fillText('СЕЛЕКТОР СМЕНЫ / NIGHT SELECTOR (НОЧИ 1 - 5, 6 И КАСТОМ)', 960, 260);

      ctx.font = '24px VT323, monospace';
      ctx.fillStyle = '#88aacc';
      ctx.fillText('Выберите любую смену для быстрого запуска', 960, 295);

      const nightCardsRow1 = [
        { night: 1, title: 'СМЕНА 1 / NIGHT 1', subtitle: 'Ознакомительный цикл', desc: 'Фредди и Фокси неактивны. Бонни и Чика начинают медленно бродить ближе к 3 AM. Отличное время освоиться с дверьми и камерами.', color: '#44aa88' },
        { night: 2, title: 'СМЕНА 2 / NIGHT 2', subtitle: 'Умеренная активность', desc: 'Фокси начинает выглядывать из Пиратской бухты. Бонни и Чика перемещаются чаще. Регулярно проверяйте свет в коридорах.', color: '#4488cc' },
        { night: 3, title: 'СМЕНА 3 / NIGHT 3', subtitle: 'Сбалансированная охота', desc: 'Фредди начинает красться в темноте. Бонни активно проверяет левую дверь, а Фокси готов выбежать из бухты.', color: '#9977dd' },
        { night: 4, title: 'СМЕНА 4 / NIGHT 4', subtitle: 'Высокая угроза', desc: 'Фредди смеется при каждом шаге и подкрадывается к правой двери. Чика гремит посудой на кухне. Экономьте энергию!', color: '#dd8833' }
      ];

      for (let i = 0; i < 4; i++) {
        const c = nightCardsRow1[i];
        const cx = 140 + i * 420;
        const cy = 320, cw = 380, ch = 240;

        ctx.fillStyle = '#10141f';
        ctx.fillRect(cx, cy, cw, ch);
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(cx, cy, cw, ch);

        ctx.textAlign = 'center';
        ctx.font = '30px SpecialElite, monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(c.title, cx + cw / 2, cy + 38);

        ctx.font = '20px VT323, monospace';
        ctx.fillStyle = c.color;
        ctx.fillText(c.subtitle, cx + cw / 2, cy + 65);

        ctx.textAlign = 'left';
        ctx.font = '18px VT323, monospace';
        ctx.fillStyle = '#aaaaaa';
        const words = c.desc.split(' ');
        let line = '';
        let ty = cy + 95;
        for (let w = 0; w < words.length; w++) {
          const test = line + words[w] + ' ';
          if (ctx.measureText(test).width > cw - 30 && w > 0) {
            ctx.fillText(line, cx + 15, ty);
            line = words[w] + ' ';
            ty += 20;
          } else {
            line = test;
          }
        }
        ctx.fillText(line, cx + 15, ty);

        const btnHover = (G.mouseX >= cx + 20 && G.mouseX <= cx + cw - 20 && G.mouseY >= cy + ch - 50 && G.mouseY <= cy + ch - 10);
        ctx.fillStyle = btnHover ? '#006633' : '#003318';
        ctx.fillRect(cx + 20, cy + ch - 50, cw - 40, 40);
        ctx.strokeStyle = btnHover ? '#00ff88' : '#00aa55';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx + 20, cy + ch - 50, cw - 40, 40);

        ctx.textAlign = 'center';
        ctx.font = '24px VT323, monospace';
        ctx.fillStyle = btnHover ? '#ffffff' : '#00ff88';
        ctx.fillText(`▶ ЗАПУСТИТЬ СМЕНУ ${c.night}`, cx + cw / 2, cy + ch - 24);
      }

      // Row 2: Night 5, Night 6, Custom Night
      const nightCardsRow2 = [
        { night: 5, title: 'СМЕНА 5 / NIGHT 5', subtitle: 'ФИНАЛ РАБОЧЕЙ НЕДЕЛИ', desc: 'Предельное напряжение. Все 4 аниматроника атакуют с максимальным давлением. Появление Золотого Фредди. Награда за победу: ★ Первая Звезда.', color: '#dd3333' },
        { night: 6, title: 'СМЕНА 6 / NIGHT 6', subtitle: 'КОШМАРНАЯ СВЕРХУРОЧНАЯ', desc: 'Усиленный ИИ кошмара. Экстремальный расход энергии, частые заклинивания и атаки Фокси. Награда за победу: ★★ Вторая Звезда.', color: '#cc2266' },
        { night: 7, title: 'CUSTOM NIGHT / ЭКСТРА', subtitle: 'ПОЛНЫЙ КОНТРОЛЬ НАД ИИ', desc: 'Индивидуальная настройка уровней ИИ от 0 до 20 для каждого робота. Испытание 20/20/20/20. Награда за победу: ★★★ Третья Звезда.', color: '#ffd700' }
      ];

      for (let j = 0; j < 3; j++) {
        const c = nightCardsRow2[j];
        const cx = 220 + j * 510;
        const cy = 590, cw = 460, ch = 380;

        ctx.fillStyle = '#10141f';
        ctx.fillRect(cx, cy, cw, ch);
        ctx.strokeStyle = c.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(cx, cy, cw, ch);

        ctx.textAlign = 'center';
        ctx.font = '34px SpecialElite, monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(c.title, cx + cw / 2, cy + 45);

        ctx.font = '22px VT323, monospace';
        ctx.fillStyle = c.color;
        ctx.fillText(c.subtitle, cx + cw / 2, cy + 78);

        ctx.textAlign = 'left';
        ctx.font = '22px VT323, monospace';
        ctx.fillStyle = '#cccccc';
        const words = c.desc.split(' ');
        let line = '';
        let ty = cy + 125;
        for (let w = 0; w < words.length; w++) {
          const test = line + words[w] + ' ';
          if (ctx.measureText(test).width > cw - 40 && w > 0) {
            ctx.fillText(line, cx + 20, ty);
            line = words[w] + ' ';
            ty += 28;
          } else {
            line = test;
          }
        }
        ctx.fillText(line, cx + 20, ty);

        const btnHover = (G.mouseX >= cx + 30 && G.mouseX <= cx + cw - 30 && G.mouseY >= cy + ch - 65 && G.mouseY <= cy + ch - 15);
        ctx.fillStyle = btnHover ? '#006633' : '#003318';
        ctx.fillRect(cx + 30, cy + ch - 65, cw - 60, 50);
        ctx.strokeStyle = btnHover ? '#00ff88' : '#00aa55';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx + 30, cy + ch - 65, cw - 60, 50);

        ctx.textAlign = 'center';
        ctx.font = '28px VT323, monospace';
        ctx.fillStyle = btnHover ? '#ffffff' : '#00ff88';
        ctx.fillText((c.night === 7) ? '⚙️ ОТКРЫТЬ CUSTOM NIGHT' : `▶ ЗАПУСТИТЬ СМЕНУ ${c.night}`, cx + cw / 2, cy + ch - 32);
      }
      return;
    }

    // Character Dossier View
    const animDetails = [
      {
        img: images.extra_freddy,
        title: 'FREDDY FAZBEAR (ФРЕДДИ ФАЗБЕР) — ТАКТИЧЕСКИЙ ЛИДЕР',
        cadence: '3.02 секунды (активируется с 3-й ночи, в темноте атакует мгновенно)',
        route: 'CAM 1A (Сцена) -> CAM 1B (Зал) -> CAM 7 (Туалеты) -> CAM 6 (Кухня [Аудио]) -> CAM 4A (Вост. холл) -> CAM 4B (Угол) -> Офис',
        behavior: 'Перемещается исключительно тогда, когда камера НЕ направлена на него. При каждом шаге издает зловещий низкий смех. Подглядывание за ним через монитор полностью сковывает его движения (эффект Camera Stall). Если игрок опустит монитор, когда Фредди в углу CAM 4B, и правая дверь открыта — атака неминуема.',
        tactics: 'Постоянно держите камеру на CAM 4B (угол правого коридора) — это полностью блокирует его вход в офис даже при открытой двери! При истощении энергии Фредди начинает медленную осаду под мелодию Тореадора из темноты.'
      },
      {
        img: images.extra_bonnie,
        title: 'BONNIE (БОННИ) — НЕУТОМИМЫЙ ОХОТНИК СЛЕПОЙ ЗОНЫ',
        cadence: '4.97 секунды (активен с 1-й ночи, крайне высокая частота тиков)',
        route: 'CAM 1A (Сцена) -> CAM 1B (Зал) / CAM 5 (Закулисье) -> CAM 2A (Зап. холл) -> CAM 3 (Кладовка) -> CAM 2B (Угол) -> Левая дверь офиса',
        behavior: 'Атакует строго с левого фланга. Обладает нелинейным блужданием: способен возвращаться в обеденный зал или заглядывать в кладовую. Оказавшись у двери (слепая зона), виден в свете дверного прожектора. Если игрок не закроет дверь вовремя, Бонни проникает в офис и необратимо блокирует кнопки двери и света.',
        tactics: 'Регулярно проверяйте левый дверной свет короткими нажатиями. При обнаружении Бонни у окна немедленно закройте левую дверь — постояв около 3 секунд у закрытой двери, он развернется и отступит назад.'
      },
      {
        img: images.extra_chica,
        title: 'CHICA (ЧИКА) — КУХОННЫЙ СТАЛКЕР ПРАВОГО ФЛАНГА',
        cadence: '4.98 секунды (активна с 1-2 ночи, оказывает тяжелое психологическое давление)',
        route: 'CAM 1A (Сцена) -> CAM 1B (Зал) -> CAM 7 (Туалеты) -> CAM 6 (Кухня [Грохот посуды]) -> CAM 4A (Вост. холл) -> CAM 4B (Угол) -> Правая дверь',
        behavior: 'Охотится по правому коридору. Обожает часами задерживаться на кухне (CAM 6), где видеопоток отсутствует, но слышен характерный лязг кастрюль и сковородок. Заглядывает в окно правой двери, вытягивая шею. При задержке игрока проникает в офис и заклинивает правую панель управления.',
        tactics: 'Ориентируйтесь по звукам кухни: пока гремит посуда — Чика там. Если звон стих, проверьте правый свет. Закрывайте дверь при ее появлении в окне — через 3 секунды она уйдет обратно.'
      },
      {
        img: images.extra_foxy,
        title: 'FOXY THE PIRATE (ФОКСИ) — СВЕРХСКОРОСТНОЙ СПРИНТЕР ПИРАТСКОЙ БУХТЫ',
        cadence: '5.01 секунды (активен со 2-й ночи, реакция на недостаток внимания)',
        route: 'CAM 1C (Пиратская бухта) -> CAM 2A (Западный холл: Спринт) -> Левая дверь Офиса',
        behavior: 'Скрывается за занавесками Пиратской бухты. Проходит 4 строгие фазы: 1) Скрыт; 2) Выглядывает наружу; 3) Вышел из бухты; 4) Бухта пуста — спринт по западному холлу! Игрок обязан мониторить бухту, чтобы сбивать его таймер подготовки. При ударе о закрытую дверь отнимает 1-6% драгоценной энергии батареи.',
        tactics: 'Открытие любого монитора сбивает его таймер на 1.5с, а прямой взгляд на CAM 1C замораживает его на 8-14 секунд. Услышав топот шагов или надпись IT\'S ME в бухте, мгновенно захлопывайте левую дверь!'
      },
      {
        img: images.extra_golden_freddy,
        title: 'GOLDEN FREDDY (ЗОЛОТОЙ ФРЕДДИ) — ТЕЛЕПОРТИРУЮЩИЙСЯ ПРИЗРАК',
        cadence: 'Случайный спавн при опускании монитора (ночи 5-7) или через постер CAM 2B',
        route: 'CAM 2B (Постер искажается) -> Мгновенная материализация прямо в кабинете охранника',
        behavior: 'Потусторонний фантом. Появляется прямо на полу офиса в неестественной позе, вызывая слуховые галлюцинации и вспышки психоделических надписей "IT\'S ME". Игнорирует закрытые двери. Если игрок задержится более чем на 1.2 секунды — вызывает фатальный скример и крушение охранной системы.',
        tactics: 'ЕДИНСТВЕННАЯ КОНТРМЕРА: Мгновенно поднять планшет монитора обратно! Поднятие монитора немедленно изгоняет призрака из офиса.'
      }
    ];

    const selAnim = animDetails[G.extraSelectedAnim];

    ctx.fillStyle = '#0b0d14';
    ctx.fillRect(120, 230, 600, 780);
    ctx.strokeStyle = '#232838';
    ctx.lineWidth = 2;
    ctx.strokeRect(120, 230, 600, 780);

    if (selAnim.img && selAnim.img.complete) {
      const iw = selAnim.img.width;
      const ih = selAnim.img.height;
      const scale = Math.min(520 / iw, 620 / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = 120 + (600 - dw) / 2;
      const dy = 245 + (630 - dh) / 2;
      ctx.drawImage(selAnim.img, dx, dy, dw, dh);
    }
    ctx.strokeStyle = '#353c50';
    ctx.strokeRect(150, 245, 540, 630);

    const hoverAudio = (G.mouseX >= 150 && G.mouseX <= 690 && G.mouseY >= 920 && G.mouseY <= 985);
    ctx.fillStyle = hoverAudio ? '#1e3828' : '#0f2016';
    ctx.fillRect(150, 920, 540, 65);
    ctx.strokeStyle = hoverAudio ? '#00ff88' : '#00aa55';
    ctx.lineWidth = 2;
    ctx.strokeRect(150, 920, 540, 65);

    ctx.textAlign = 'center';
    ctx.font = '36px VT323, monospace';
    ctx.fillStyle = '#00ff88';
    ctx.fillText('▶ ВОСПРОИЗВЕСТИ СИГНАТУРНЫЙ ЗВУК', 420, 963);

    ctx.fillStyle = '#0a0c13';
    ctx.fillRect(750, 230, 1050, 780);
    ctx.strokeStyle = '#232838';
    ctx.lineWidth = 2;
    ctx.strokeRect(750, 230, 1050, 780);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '36px SpecialElite, monospace';
    ctx.fillText(selAnim.title, 780, 280);

    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(780, 300);
    ctx.lineTo(1760, 300);
    ctx.stroke();

    function wrapText(text, x, y, maxWidth, lineHeight, font, fillStyle) {
      ctx.font = font;
      ctx.fillStyle = fillStyle;
      const words = text.split(' ');
      let line = '';
      let curY = y;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, curY);
          line = words[n] + ' ';
          curY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, curY);
      return curY + lineHeight;
    }

    let textY = 345;
    ctx.font = '28px VT323, monospace';
    ctx.fillStyle = '#00e5ff';
    ctx.fillText('[КАДЕНЦИЯ И ТАЙМИНГ ПРОВЕРОК]', 780, textY);
    textY = wrapText(selAnim.cadence, 780, textY + 35, 980, 32, '26px VT323, monospace', '#cccccc');

    textY += 15;
    ctx.font = '28px VT323, monospace';
    ctx.fillStyle = '#ffd700';
    ctx.fillText('[МАРШРУТ ПЕРЕМЕЩЕНИЯ]', 780, textY);
    textY = wrapText(selAnim.route, 780, textY + 35, 980, 32, '26px VT323, monospace', '#cccccc');

    textY += 15;
    ctx.font = '28px VT323, monospace';
    ctx.fillStyle = '#ff5577';
    ctx.fillText('[ПОВЕДЕНИЕ И AI ШАБЛОН]', 780, textY);
    textY = wrapText(selAnim.behavior, 780, textY + 35, 980, 32, '26px VT323, monospace', '#cccccc');

    textY += 15;
    ctx.font = '28px VT323, monospace';
    ctx.fillStyle = '#55ff77';
    ctx.fillText('[КОНТРМЕРЫ И СТРАТЕГИЯ ВЫЖИВАНИЯ]', 780, textY);
    wrapText(selAnim.tactics, 780, textY + 35, 980, 32, '26px VT323, monospace', '#cccccc');
    return;
  }

  // ---------------------------------------------------------------------------
  // 4. SHIFT INTRO (12:00 AM)
  // ---------------------------------------------------------------------------
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
    if (G.currentNight === 7) {
      ctx.font = '40px SpecialElite, monospace';
      ctx.fillStyle = '#ff4444';
      ctx.fillText('CUSTOM NIGHT CHALLENGE', 960, 660);
    }
    return;
  }

  // ---------------------------------------------------------------------------
  // 5. GAME OVER & JUMPSCARE
  // ---------------------------------------------------------------------------
  if (G.gameState === 'gameover') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 1920, 1080);

    const maxScareTime = (G.jumpscareType === 'golden_freddy' || G.jumpscareType === 'entity5') ? 9.35 : 1.4;
    if (G.jumpscareTimer < maxScareTime) {
      let scareImg = null;
      if (G.jumpscareType === 'freddy' || G.jumpscareType === 'maler') {
        const idx = Math.min(6, G.jumpscareFrame);
        scareImg = images['freddy_scare_' + idx];
      } else if (G.jumpscareType === 'freddy_blackout' || G.jumpscareType === 'maler_blackout') {
        const idx = Math.min(20, G.jumpscareFrame);
        scareImg = images['freddy_blackout_' + idx];
      } else if (G.jumpscareType === 'bonnie' || G.jumpscareType === 'karkas') {
        const idx = Math.min(6, G.jumpscareFrame);
        scareImg = images['bonnie_scare_' + idx];
      } else if (G.jumpscareType === 'chica' || G.jumpscareType === 'plague') {
        const idx = Math.min(5, G.jumpscareFrame);
        scareImg = images['chica_scare_' + idx];
      } else if (G.jumpscareType === 'foxy' || G.jumpscareType === 'dash') {
        const idx = Math.min(6, G.jumpscareFrame);
        scareImg = images['foxy_scare_' + idx];
      } else if (G.jumpscareType === 'golden_freddy' || G.jumpscareType === 'entity5') {
        scareImg = images['golden_freddy_scare'];
      }

      if (scareImg && scareImg.complete) {
        ctx.drawImage(scareImg, 0, 0, 1920, 1080);
      }
    }
    return;
  }

  // ---------------------------------------------------------------------------
  // 6. CRASHED (1987 EASTER EGG)
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // 7. VICTORY (6:00 AM)
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // 8. OFFICE VIEW (WHEN MONITOR IS DOWN)
  // ---------------------------------------------------------------------------
  if (G.tabletState !== 'open') {
    const ox = G.panX;

    let bg = images.office_default;
    if (G.blackout) {
      if (G.blackoutStage === 1 || G.blackoutStage === 3) {
        bg = images.office_powerout;
      } else if (G.blackoutStage === 2) {
        if (G.blackoutFreddyFlickerState === 0) {
          bg = images.office_freddy_eyes || images.office_maler_eyes;
        } else if (G.blackoutFreddyFlickerState === 1) {
          bg = images.office_freddy_eyes_dim || images.office_maler_eyes_dim;
        } else {
          bg = images.office_powerout;
        }
      }
    } else if (G.lightLeftOn) {
      bg = (G.bonnie.pos === 7) ? images.office_karkas_window : images.office_left_light;
    } else if (G.lightRightOn) {
      bg = (G.chica.pos === 7) ? images.office_plague_window : images.office_right_light;
    }

    if (bg && bg.complete) {
      ctx.drawImage(bg, ox, 0, 2400, 1080);
    }

    // Desk Fan (3 frames)
    if (!G.blackout) {
      const fanIdx = (Math.floor(performance.now() / 55) % 3) + 1;
      const fanImg = images['fan_' + fanIdx];
      if (fanImg && fanImg.complete) {
        ctx.drawImage(fanImg, ox + 1170, 455, 207, 294);
      }
    }

    // Left Door (16 frames)
    const lFrame = Math.round(G.doorLeftFrame);
    if (lFrame > 0) {
      const dImg = images['door_left_' + lFrame];
      if (dImg && dImg.complete) {
        ctx.drawImage(dImg, ox + 108, 0, 335, 1080);
      }
    }

    // Bonnie Window Reflection
    if (G.doorLeftClosed && G.lightLeftOn && G.bonnie.pos === 7) {
      const refImg = images.bonnie_window_reflection;
      if (refImg && refImg.complete) {
        ctx.save();
        ctx.globalAlpha = 0.88;
        ctx.drawImage(refImg, ox + 450, 210, 330, 630);
        ctx.restore();
      }
    }

    // Right Door (16 frames)
    const rFrame = Math.round(G.doorRightFrame);
    if (rFrame > 0) {
      const dImg = images['door_right_' + rFrame];
      if (dImg && dImg.complete) {
        ctx.drawImage(dImg, ox + 1956, 0, 372, 1080);
      }
    }

    // Left Door Button Panel (x = 65, y = 380, w = 150, h = 340)
    let lBtn = images.btn_left_off;
    if (G.doorLeftClosed && G.lightLeftOn) lBtn = images.btn_left_both;
    else if (G.doorLeftClosed) lBtn = images.btn_left_door;
    else if (G.lightLeftOn) lBtn = images.btn_left_light;
    if (lBtn && lBtn.complete) {
      ctx.drawImage(lBtn, ox + 65, 380, 150, 340);
    }

    // Right Door Button Panel (x = 2210, y = 380, w = 150, h = 340)
    let rBtn = images.btn_right_off;
    if (G.doorRightClosed && G.lightRightOn) rBtn = images.btn_right_both;
    else if (G.doorRightClosed) rBtn = images.btn_right_door;
    else if (G.lightRightOn) rBtn = images.btn_right_light;
    if (rBtn && rBtn.complete) {
      ctx.drawImage(rBtn, ox + 2210, 380, 150, 340);
    }

    // Golden Freddy Slumped on Floor
    if (G.goldenFreddy.active && images.golden_freddy_office && images.golden_freddy_office.complete) {
      ctx.drawImage(images.golden_freddy_office, ox + 840, 380, 630, 630);
    }
  }

  // ---------------------------------------------------------------------------
  // 9. CAMERA SYSTEM (WHEN MONITOR IS UP)
  // ---------------------------------------------------------------------------
  if (G.tabletState === 'open') {
    const feedImg = getCameraFeedImage();
    if (feedImg && feedImg.complete) {
      ctx.drawImage(feedImg, 0, 0, 1920, 1080);
    }

    // Static Noise Overlay
    const staticImg = images['static' + G.staticFrame];
    if (staticImg && staticImg.complete) {
      ctx.globalAlpha = 0.28;
      ctx.drawImage(staticImg, 0, 0, 1920, 1080);
      ctx.globalAlpha = 1.0;
    }

    // Floorplan Minimap
    const mapImg = images.cam_map_clean;
    if (mapImg && mapImg.complete) {
      ctx.drawImage(mapImg, 1300, 485, 580, 580);
    }

    // Camera Buttons
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

    // Camera Header & Blinking REC Dot
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

  // ---------------------------------------------------------------------------
  // 10. TABLET FLIP TRANSITION
  // ---------------------------------------------------------------------------
  if (G.tabletState === 'opening' || G.tabletState === 'closing') {
    const frameNum = Math.max(1, Math.min(11, Math.round(G.tabletFrame)));
    const pad = (frameNum < 10 ? '0' : '') + frameNum;
    const tabImg = images['tablet_' + pad];
    if (tabImg && tabImg.complete) {
      ctx.drawImage(tabImg, 0, 0, 1920, 1080);
    }
  }

  // ---------------------------------------------------------------------------
  // 11. HALLUCINATION OVERLAY
  // ---------------------------------------------------------------------------
  if (G.halluActive && G.halluImg && G.halluImg.complete) {
    ctx.drawImage(G.halluImg, 0, 0, 1920, 1080);
  }

  // ---------------------------------------------------------------------------
  // 12. HEADS-UP DISPLAY (IN-GAME HUD)
  // ---------------------------------------------------------------------------
  if (G.gameState === 'playing') {
    // Mute Call Button
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

    // Clock & Night
    ctx.font = '72px VT323, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.fillText((G.hour === 0 ? 12 : G.hour) + ' AM', 1860, 70);

    ctx.font = '40px VT323, monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Night ${G.currentNight}`, 1860, 120);

    // Power Left & Usage Meter
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

    // Monitor Toggle Chevron Bar (Bottom Screen)
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
