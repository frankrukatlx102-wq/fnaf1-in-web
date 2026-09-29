/**
 * Five Nights at Freddy's - Audio Engine
 * Handles sound preloading, looping streams, positional sound effects, and phone calls.
 */

const sounds = {};
const soundFiles = {
  menu_music: 'assets/audio/menu_music.ogg',
  ambience: 'assets/audio/office_ambience.ogg',
  cam_up: 'assets/audio/camera_up.ogg',
  cam_down: 'assets/audio/camera_down.ogg',
  door_toggle: 'assets/audio/door_toggle.ogg',
  switch_click: 'assets/audio/switch_click.ogg',
  lights_hum: 'assets/audio/lights_on.ogg',
  windowscare: 'assets/audio/windowscare.ogg',
  door_pound: 'assets/audio/door_pound.ogg',
  foxy_sprint: 'assets/audio/dash_sprint.ogg',
  dash_sprint: 'assets/audio/dash_sprint.ogg',
  music_box: 'assets/audio/music_box.ogg',
  freddy_laugh: 'assets/audio/maler_laugh.ogg',
  maler_laugh: 'assets/audio/maler_laugh.ogg',
  foxy_song: 'assets/audio/dash_pirate_song.ogg',
  dash_song: 'assets/audio/dash_pirate_song.ogg',
  screamer: 'assets/audio/jumpscare_screamer.ogg',
  kitchen_rattle: 'assets/audio/kitchen_rattle.ogg',
  powerdown: 'assets/audio/powerdown.ogg',
  win: 'assets/audio/win_chime_cheer.ogg',
  freddy_nose: 'assets/audio/freddy_nose.ogg',
  phone_guy_1: 'assets/audio/phone_guy_night1.ogg',
  phone_guy_2: 'assets/audio/phone_guy_night2.ogg',
  phone_guy_3: 'assets/audio/phone_guy_night3.ogg',
  phone_guy_4: 'assets/audio/phone_guy_night4.ogg',
  phone_guy_5: 'assets/audio/phone_guy_night5.ogg',
  golden_freddy_scream: 'assets/audio/golden_freddy_scream.ogg',
  toreador_march: 'assets/audio/toreador_march.ogg'
};

const loopingSounds = new Set([
  'menu_music',
  'ambience',
  'lights_hum',
  'kitchen_rattle',
  'music_box',
  'toreador_march'
]);

for (const [key, path] of Object.entries(soundFiles)) {
  const audio = new Audio(path);
  if (loopingSounds.has(key)) {
    audio.loop = true;
  }
  sounds[key] = audio;
}

function playSound(key) {
  if (sounds[key]) {
    try {
      sounds[key].currentTime = 0;
      sounds[key].play().catch(() => {});
    } catch (e) {}
  }
}

function stopSound(key) {
  if (sounds[key]) {
    try {
      sounds[key].pause();
      sounds[key].currentTime = 0;
    } catch (e) {}
  }
}

function stopAllShiftSounds() {
  if (sounds.ambience) sounds.ambience.pause();
  if (sounds.lights_hum) sounds.lights_hum.pause();
  if (sounds.kitchen_rattle) sounds.kitchen_rattle.pause();
  if (sounds.music_box) sounds.music_box.pause();
  if (sounds.toreador_march) sounds.toreador_march.pause();

  if (sounds.foxy_sprint) {
    sounds.foxy_sprint.pause();
    sounds.foxy_sprint.currentTime = 0;
  }
  if (sounds.dash_sprint) {
    sounds.dash_sprint.pause();
    sounds.dash_sprint.currentTime = 0;
  }

  for (let i = 1; i <= 5; i++) {
    const pg = sounds['phone_guy_' + i];
    if (pg) {
      pg.pause();
      pg.currentTime = 0;
      pg.onended = null;
    }
  }
}
