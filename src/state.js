/**
 * Five Nights at Freddy's - Game State & Texture Loader
 * Holds the Canvas rendering context, preloaded visual assets, camera layouts, and runtime state.
 */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Visual Asset Preloader
const images = {};

function loadImg(name, path) {
  const img = new Image();
  img.src = path;
  images[name] = img;
  return img;
}

// 1. Menu Textures
loadImg('menu_freddy_0', 'assets/sprites/menu_freddy_0.png');
loadImg('menu_freddy_1', 'assets/sprites/menu_freddy_1.png');
loadImg('menu_freddy_2', 'assets/sprites/menu_freddy_2.png');
loadImg('menu_freddy_3', 'assets/sprites/menu_freddy_3.png');

// 2. Custom Night Portraits
loadImg('custom_freddy', 'assets/sprites/custom_freddy.png');
loadImg('custom_bonnie', 'assets/sprites/custom_bonnie.png');
loadImg('custom_chica', 'assets/sprites/custom_chica.png');
loadImg('custom_foxy', 'assets/sprites/custom_foxy.png');

// 3. Extra Menu Character Dossier Cards
loadImg('extra_freddy', 'assets/sprites/extra_freddy.png');
loadImg('extra_bonnie', 'assets/sprites/extra_bonnie.png');
loadImg('extra_chica', 'assets/sprites/extra_chica.png');
loadImg('extra_foxy', 'assets/sprites/extra_foxy.png');
loadImg('extra_golden_freddy', 'assets/sprites/extra_golden_freddy.png');

// 4. Office Variants & Panoramas
loadImg('office_default', 'assets/sprites/office_default.png');
loadImg('office_left_light', 'assets/sprites/office_left_light.png');
loadImg('office_karkas_window', 'assets/sprites/office_karkas_window.png');
loadImg('office_bonnie_window', 'assets/sprites/office_karkas_window.png');
loadImg('office_right_light', 'assets/sprites/office_right_light.png');
loadImg('office_plague_window', 'assets/sprites/office_plague_window.png');
loadImg('office_chica_window', 'assets/sprites/office_plague_window.png');
loadImg('office_powerout', 'assets/sprites/office_powerout.png');
loadImg('office_maler_eyes', 'assets/sprites/office_maler_eyes.png');
loadImg('office_freddy_eyes', 'assets/sprites/office_maler_eyes.png');
loadImg('office_maler_eyes_dim', 'assets/sprites/office_maler_eyes_dim.png');
loadImg('office_freddy_eyes_dim', 'assets/sprites/office_maler_eyes_dim.png');
loadImg('golden_freddy_office', 'assets/sprites/golden_freddy_office.png');
loadImg('bonnie_window_reflection', 'assets/sprites/bonnie_window_reflection.png');

// 5. Office Fan
loadImg('fan_1', 'assets/sprites/fan_1.png');
loadImg('fan_2', 'assets/sprites/fan_2.png');
loadImg('fan_3', 'assets/sprites/fan_3.png');

// 6. Tablet Flip Animation (11 frames)
for (let i = 1; i <= 11; i++) {
  const pad = (i < 10 ? '0' : '') + i;
  loadImg('tablet_' + pad, `assets/sprites/tablet_${pad}.png`);
}

// 7. Door Button Panels
loadImg('btn_left_off', 'assets/sprites/btn_left_off.png');
loadImg('btn_left_door', 'assets/sprites/btn_left_door.png');
loadImg('btn_left_light', 'assets/sprites/btn_left_light.png');
loadImg('btn_left_both', 'assets/sprites/btn_left_both.png');

loadImg('btn_right_off', 'assets/sprites/btn_right_off.png');
loadImg('btn_right_door', 'assets/sprites/btn_right_door.png');
loadImg('btn_right_light', 'assets/sprites/btn_right_light.png');
loadImg('btn_right_both', 'assets/sprites/btn_right_both.png');

// 8. Door Animation Frames (16 frames each)
for (let i = 0; i < 16; i++) {
  const pad = (i < 10 ? '0' : '') + i;
  loadImg('door_left_' + i, `assets/sprites/door_left_frame_${pad}.png`);
  loadImg('door_right_' + i, `assets/sprites/door_right_frame_${pad}.png`);
}

// 9. Minimap & Camera Layout Controls
loadImg('cam_map_clean', 'assets/sprites/cam_map_clean.png');
loadImg('cam_btn_normal', 'assets/sprites/cam_btn_normal_border.png');
loadImg('cam_btn_active', 'assets/sprites/cam_btn_active_border.png');
loadImg('monitor_bar', 'assets/sprites/monitor_flip_bar.png');
loadImg('mute_call', 'assets/sprites/mute_call.png');

// Camera button text plates
const plates = ['1a', '1b', '1c', '2a', '2b', '3', '4a', '4b', '5', '6', '7'];
for (const p of plates) {
  loadImg('plate_' + p, `assets/sprites/${p}.png`);
}

// 10. Easter Eggs & Hallucinations
loadImg('east_hall_normal', 'assets/sprites/east_hall_normal.png');
loadImg('east_hall_itsme', 'assets/sprites/east_hall_itsme.png');
loadImg('ehallcorner_rules', 'assets/sprites/ehallcorner_rules.png');
loadImg('pirate_cove_itsme', 'assets/sprites/pirate_cove_itsme.png');
loadImg('golden_freddy_face', 'assets/sprites/golden_freddy_face.png');
loadImg('cam_2b_golden', 'assets/sprites/cam_2b_golden.png');
loadImg('cam_2b_ripping', 'assets/sprites/cam_2b_ripping.png');
loadImg('poster_freddy_ripping', 'assets/sprites/poster_freddy_ripping.png');
loadImg('hallu_its_me_1', 'assets/sprites/hallu_its_me_1.png');
loadImg('hallu_its_me_2', 'assets/sprites/hallu_its_me_2.png');
loadImg('hallu_bonnie', 'assets/sprites/hallu_bonnie.png');
loadImg('hallu_eyeless_bonnie', 'assets/sprites/hallu_eyeless_bonnie.png');
loadImg('hallu_freddy', 'assets/sprites/hallu_freddy.png');

// East Hall Corner Wall Newspaper Clippings (Missing Children Incident)
for (let i = 1; i <= 4; i++) {
  loadImg('ehallcorner_news' + i, `assets/sprites/ehallcorner_news${i}.png`);
}

// 11. Authentic 6:00 AM Victory Animation Sequence (45 frames)
for (let i = 0; i < 45; i++) {
  const pad = (i < 10 ? '0' : '') + i;
  loadImg('win_' + pad, `assets/sprites/victory_frames/win_${pad}.png`);
}

// 12. Camera Feeds Matrix
const camTextures = [
  'stage-b-c-f', 'stage-c-f', 'stage-b-f', 'stage-f', 'stage',
  'dinningarea-b-c-f', 'dinningarea-b-c', 'dinningarea-b-f', 'dinningarea-c-f',
  'dinningarea-b', 'dinningarea-c', 'dinningarea-f', 'dinningarea',
  'pirate_cove', 'pirate_cove-1', 'pirate_cove-2', 'pirate_cove-3',
  'west_hall-b', 'west_hall',
  'whallcorner-b', 'whallcorner',
  'supplyroom-b', 'supplyroom',
  'east_hall-c-f', 'east_hall-c', 'east_hall-f', 'east_hall',
  'ehallcorner-c', 'ehallcorner-f', 'ehallcorner',
  'restrooms-c-f', 'restrooms-c', 'restrooms-f', 'restrooms',
  'backstage', 'backstage-b', 'backstage_bonnie_stare', 'backstage_heads_stare',
  'cam_6_kitchen'
];
for (const c of camTextures) {
  loadImg(c, `assets/sprites/${c}.png`);
}

// 13. Foxy Sprint Sequence
for (let i = 0; i < 8; i++) {
  loadImg('foxy_run_' + i, `assets/sprites/dash_run_0${i}.png`);
  loadImg('dash_run_' + i, `assets/sprites/dash_run_0${i}.png`);
}

// 14. Animatronic Jumpscares
for (let i = 0; i < 7; i++) {
  loadImg('freddy_scare_' + i, `assets/sprites/maler_scare_0${i}.png`);
  loadImg('maler_scare_' + i, `assets/sprites/maler_scare_0${i}.png`);
  loadImg('bonnie_scare_' + i, `assets/sprites/karkas_scare_0${i}.png`);
  loadImg('karkas_scare_' + i, `assets/sprites/karkas_scare_0${i}.png`);
  loadImg('foxy_scare_' + i, `assets/sprites/dash_scare_0${i}.png`);
  loadImg('dash_scare_' + i, `assets/sprites/dash_scare_0${i}.png`);
}
for (let i = 0; i < 6; i++) {
  loadImg('chica_scare_' + i, `assets/sprites/plague_scare_0${i}.png`);
  loadImg('plague_scare_' + i, `assets/sprites/plague_scare_0${i}.png`);
}
for (let i = 0; i < 21; i++) {
  const pad = (i < 10 ? '0' : '') + i;
  loadImg('freddy_blackout_' + i, `assets/sprites/freddy_blackout_${pad}.png`);
  loadImg('maler_blackout_' + i, `assets/sprites/freddy_blackout_${pad}.png`);
}
loadImg('golden_freddy_scare', 'assets/sprites/entity5_scare.png');
loadImg('entity5_scare', 'assets/sprites/entity5_scare.png');

// 15. CRT Static Noise
for (let i = 1; i <= 6; i++) {
  loadImg('static' + i, `assets/sprites/static_${i}.png`);
}

// Interactive Camera Map Layout
const camButtons = [
  { id: '1A', plate: '1a', name: 'Show Stage',           x: 1524, y: 549, w: 68, h: 46 },
  { id: '1B', plate: '1b', name: 'Dining Area',          x: 1525, y: 674, w: 68, h: 46 },
  { id: '1C', plate: '1c', name: 'Pirate Cove',          x: 1326, y: 731, w: 68, h: 46 },
  { id: '5',  plate: '5',  name: 'Backstage',            x: 1307, y: 624, w: 68, h: 46 },
  { id: '7',  plate: '7',  name: 'Restrooms',            x: 1736, y: 690, w: 68, h: 46 },
  { id: '6',  plate: '6',  name: 'Kitchen [Audio Only]', x: 1714, y: 844, w: 68, h: 46 },
  { id: '3',  plate: '3',  name: 'Supply Closet',        x: 1373, y: 861, w: 68, h: 46 },
  { id: '2A', plate: '2a', name: 'West Hall',            x: 1448, y: 845, w: 68, h: 46 },
  { id: '2B', plate: '2b', name: 'W. Hall Corner',       x: 1448, y: 949, w: 68, h: 46 },
  { id: '4A', plate: '4a', name: 'East Hall',            x: 1600, y: 845, w: 68, h: 46 },
  { id: '4B', plate: '4b', name: 'E. Hall Corner',       x: 1600, y: 949, w: 68, h: 46 }
];

// Initial Progress
const initialSave = (typeof loadGameSave === 'function')
  ? loadGameSave()
  : { night: 1, stars: 0, customUnlocked: false };

// Global Runtime State
const G = {
  saveData: initialSave,
  gameState: 'menu', // 'menu', 'shift_intro', 'playing', 'gameover', 'win', 'custom_night', 'extra', 'crashed'
  currentNight: initialSave.night || 1,
  shiftIntroTimer: 0,
  selectedMenuOption: 0, // 0: New Game, 1: Continue, 2: Night 6, 3: Custom Night, 4: Extra

  // Menu Animation
  menuFreddyFrame: 0,
  menuTwitchTimer: 0,
  menuTwitchActive: false,
  menuTwitchDuration: 0,

  // Office Panning & Mouse Coordinates (1920x1080 native canvas space)
  panX: -240, // Range -480 to 0 (center -240)
  mouseX: 960,
  mouseY: 540,

  // Infrastructure & Power
  power: 100.0,
  usage: 1,
  doorLeftClosed: false,
  doorRightClosed: false,
  doorLeftFrame: 0,
  doorRightFrame: 0,
  lightLeftOn: false,
  lightRightOn: false,
  leftButtonsJammed: false,
  rightButtonsJammed: false,

  // Phone Guy Sequencer (Nights 1 to 5)
  phoneCallActive: false,
  phoneCallTimer: 0,
  phoneCallMuted: false,
  phoneCallStarted: false,
  phoneCallEnded: false,

  // Tablet & Camera System
  tabletState: 'closed', // 'closed', 'opening', 'open', 'closing'
  tabletFrame: 1,
  monitorOpen: false,
  selectedCam: '1A',
  lastFlipToggleTime: 0,

  // Easter Eggs & Hallucinations
  backstageHeadsStare: false,
  bonnieStareCam5: false,
  cam4bEasterEgg: null,
  cam4aItsMe: false,
  cam2bPoster: 'normal',
  cam2bGoldenPoster: false,
  pirateCoveItsMe: false,
  halluActive: false,
  halluTimer: 0,
  halluImg: null,

  // Custom Night (Night 7) & Extra Archive
  customAI: { freddy: 20, bonnie: 20, chica: 20, foxy: 20 },
  extraSelectedAnim: 0, // 0: Freddy, 1: Bonnie, 2: Chica, 3: Foxy, 4: Golden Freddy, 5: Night Selector

  // Clock Progression
  timeSeconds: 0,
  hour: 12,
  nightWon: false,
  winTimer: 0,
  winProcessed: false,

  // Blackout Protocol (3-Stage FNaF 1 sequence)
  blackout: false,
  blackoutTimer: 0,
  blackoutStage: 1, // 1: Silence/Darkness, 2: Toreador March + Flickering Eyes, 3: Darkness + Footsteps
  blackoutStageTimer: 0,
  blackoutCheckTimer: 0,
  blackoutFreddyFlickerTimer: 0,
  blackoutFreddyFlickerState: 0, // 0: bright, 1: dim, 2: off

  // 1987 Easter Egg Crash
  is1987Crash: false,

  // Animatronics AI State Machines
  globalMovementCooldown: 0.0,
  initialGraceTimer: 16.0,
  freddy: { level: 0, pos: 1, tickTimer: 3.02, stallTimer: 0, doorTimer: 0 },
  bonnie: { level: 0, pos: 1, tickTimer: 4.97, inOffice: false, blindspotTimer: 0, retreatCooldown: 0, officeTimer: 0 },
  chica:  { level: 0, pos: 1, tickTimer: 4.98, inOffice: false, blindspotTimer: 0, retreatCooldown: 0, officeTimer: 0 },
  foxy:   { level: 0, stage: 1, tickTimer: 5.01, sprintTimer: 0, stallTimer: 0, drainCount: 0 },
  goldenFreddy: { active: false, timer: 0 },

  // CRT & Jumpscare State
  staticFrame: 1,
  gameOver: false,
  gameOverReason: '',
  jumpscareType: '',
  jumpscareFrame: 0,
  jumpscareTimer: 0
};

// Aliases for compatibility
G.maler = G.freddy;
G.karkas = G.bonnie;
G.plague = G.chica;
G.dash = G.foxy;
G.entity5 = G.goldenFreddy;

// Proxy access for customAI legacy keys
Object.defineProperty(G.customAI, 'maler',  { get() { return G.customAI.freddy; }, set(v) { G.customAI.freddy = v; } });
Object.defineProperty(G.customAI, 'karkas', { get() { return G.customAI.bonnie; }, set(v) { G.customAI.bonnie = v; } });
Object.defineProperty(G.customAI, 'plague', { get() { return G.customAI.chica;  }, set(v) { G.customAI.chica = v; } });
Object.defineProperty(G.customAI, 'dash',   { get() { return G.customAI.foxy;   }, set(v) { G.customAI.foxy = v; } });

function getAvailableMenuItems() {
  const items = [
    { id: 'new_game', label: 'New Game', sub: 'Night 1' },
    { id: 'continue', label: 'Continue', sub: `Night ${Math.min(5, G.saveData.night || 1)}` }
  ];
  if (G.saveData.stars >= 1 || G.saveData.night >= 6) {
    items.push({ id: 'night_6', label: '6th Night', sub: 'Nightmare Shift' });
  }
  if (G.saveData.stars >= 2 || G.saveData.customUnlocked) {
    items.push({ id: 'custom_night', label: 'Custom Night', sub: '7th Night' });
    items.push({ id: 'extra', label: 'Extra', sub: 'Roster & Archives' });
  }
  return items;
}
