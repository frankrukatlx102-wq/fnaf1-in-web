"""
Asset downloader and converter for Five Nights at Freddy's.
Downloads authentic textures and audio from public game preservation repositories of the same format and structure.
Converts audio assets into low-latency OGG and WAV formats using ffmpeg.
"""

import os
import sys
import urllib.request
import urllib.parse
import json
import subprocess
from concurrent.futures import ThreadPoolExecutor

BASE_REPO = "https://raw.githubusercontent.com/LuizLee1125/FNAF-1-in-Web/main/frontend"
PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
SPRITES_DIR = os.path.join(PROJECT_DIR, "assets", "sprites")
AUDIO_DIR = os.path.join(PROJECT_DIR, "assets", "audio")
TMP_DIR = "/tmp/fnaf_hd_download"

os.makedirs(SPRITES_DIR, exist_ok=True)
os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(TMP_DIR, exist_ok=True)

downloads = []

# Office backgrounds and character states
downloads.extend([
    (f"{BASE_REPO}/textures/office/default.png", f"{SPRITES_DIR}/office_default.png"),
    (f"{BASE_REPO}/textures/office/left%20light%20open.png", f"{SPRITES_DIR}/office_left_light.png"),
    (f"{BASE_REPO}/textures/office/bonnie%20visible.png", f"{SPRITES_DIR}/office_bonnie_window.png"),
    (f"{BASE_REPO}/textures/office/right%20light%20open.png", f"{SPRITES_DIR}/office_right_light.png"),
    (f"{BASE_REPO}/textures/office/chica%20visible.png", f"{SPRITES_DIR}/office_chica_window.png"),
    (f"{BASE_REPO}/textures/office/power%20out.png", f"{SPRITES_DIR}/office_powerout.png"),
    (f"{BASE_REPO}/textures/office/freddy%20music%20box.png", f"{SPRITES_DIR}/office_freddy_eyes.png"),
    (f"{BASE_REPO}/textures/office/misc/golden%20freddy%20sprite.png", f"{SPRITES_DIR}/golden_freddy_slumped.png")
])

# Door Buttons
downloads.extend([
    (f"{BASE_REPO}/textures/doors/left/buttons/off%20all.png", f"{SPRITES_DIR}/btn_left_off.png"),
    (f"{BASE_REPO}/textures/doors/left/buttons/door%20on.png", f"{SPRITES_DIR}/btn_left_door.png"),
    (f"{BASE_REPO}/textures/doors/left/buttons/light%20on.png", f"{SPRITES_DIR}/btn_left_light.png"),
    (f"{BASE_REPO}/textures/doors/left/buttons/on%20all.png", f"{SPRITES_DIR}/btn_left_both.png"),
    (f"{BASE_REPO}/textures/doors/right/buttons/off%20all.png", f"{SPRITES_DIR}/btn_right_off.png"),
    (f"{BASE_REPO}/textures/doors/right/buttons/door%20on.png", f"{SPRITES_DIR}/btn_right_door.png"),
    (f"{BASE_REPO}/textures/doors/right/buttons/light%20on.png", f"{SPRITES_DIR}/btn_right_light.png"),
    (f"{BASE_REPO}/textures/doors/right/buttons/on%20all.png", f"{SPRITES_DIR}/btn_right_both.png"),
])

# Door animation frames
left_door_frames = [86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102]
for idx, num in enumerate(left_door_frames):
    downloads.append((f"{BASE_REPO}/textures/doors/left/{num}.png", f"{SPRITES_DIR}/door_left_frame_{idx:02d}.png"))

right_door_frames = [103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118]
for idx, num in enumerate(right_door_frames):
    downloads.append((f"{BASE_REPO}/textures/doors/right/{num}.png", f"{SPRITES_DIR}/door_right_frame_{idx:02d}.png"))

# Security cameras
cam_files = [
    ("1A all.png", "cam_1a_all.png"),
    ("1A bonnie.png", "cam_1a_bonnie.png"),
    ("1A chica.png", "cam_1a_chica.png"),
    ("1A.png", "cam_1a_empty.png"),
    ("1B.png", "cam_1b_empty.png"),
    ("1B bonnie_a.png", "cam_1b_bonnie.png"),
    ("1B chica_a.png", "cam_1b_chica.png"),
    ("1B freddy.png", "cam_1b_freddy.png"),
    ("1C.png", "cam_1c_stage1.png"),
    ("1C stage_1.png", "cam_1c_stage2.png"),
    ("1C stage_2.png", "cam_1c_stage3.png"),
    ("1C stage_3.png", "cam_1c_stage4.png"),
    ("2A.png", "cam_2a_empty.png"),
    ("2A bonnie.png", "cam_2a_bonnie.png"),
    ("2B.png", "cam_2b_empty.png"),
    ("2B bonnie.png", "cam_2b_bonnie.png"),
    ("3.png", "cam_3_empty.png"),
    ("3 bonnie.png", "cam_3_bonnie.png"),
    ("4A.png", "cam_4a_empty.png"),
    ("4A chica_a.png", "cam_4a_chica.png"),
    ("4A freddy.png", "cam_4a_freddy.png"),
    ("4B.png", "cam_4b_empty.png"),
    ("4B chica.png", "cam_4b_chica.png"),
    ("4B freddy.png", "cam_4b_freddy.png"),
    ("5.png", "cam_5_empty.png"),
    ("5 bonnie_a.png", "cam_5_bonnie.png"),
    ("7.png", "cam_7_empty.png"),
    ("7 chica_a.png", "cam_7_chica.png"),
    ("7 freddy.png", "cam_7_freddy.png")
]
for src, dst in cam_files:
    enc_src = urllib.parse.quote(src)
    downloads.append((f"{BASE_REPO}/textures/camera/{enc_src}", f"{SPRITES_DIR}/{dst}"))

# Foxy hallway sprint frames
foxy_run_frames = [240, 244, 247, 280, 285, 290, 306, 337]
for idx, num in enumerate(foxy_run_frames):
    downloads.append((f"{BASE_REPO}/textures/camera/foxy%20run/{num}.png", f"{SPRITES_DIR}/foxy_run_{idx:02d}.png"))

# Animatronic jumpscare animations
bonnie_scare = [291, 293, 295, 297, 299, 301, 303]
for idx, num in enumerate(bonnie_scare):
    downloads.append((f"{BASE_REPO}/textures/jumpscares/bonnie/{num}.png", f"{SPRITES_DIR}/bonnie_scare_{idx:02d}.png"))

chica_scare = [216, 228, 230, 232, 234, 236, 238]
for idx, num in enumerate(chica_scare):
    downloads.append((f"{BASE_REPO}/textures/jumpscares/chica/{num}.png", f"{SPRITES_DIR}/chica_scare_{idx:02d}.png"))

foxy_scare = [240, 241, 242, 243, 396, 397, 398]
for idx, num in enumerate(foxy_scare):
    downloads.append((f"{BASE_REPO}/textures/jumpscares/foxy/{num}.png", f"{SPRITES_DIR}/foxy_scare_{idx:02d}.png"))

freddy_scare = [489, 490, 491, 493, 495, 497, 499]
for idx, num in enumerate(freddy_scare):
    downloads.append((f"{BASE_REPO}/textures/jumpscares/freddy/{num}.png", f"{SPRITES_DIR}/freddy_scare_{idx:02d}.png"))

downloads.append((f"{BASE_REPO}/textures/jumpscares/golden%20freddy/548.png", f"{SPRITES_DIR}/golden_freddy_scare.png"))

# Audio files
audio_downloads = [
    ("office ambience.mp3", "office_ambience.mp3"),
    ("lights on.mp3", "lights_on.mp3"),
    ("windowscare.wav", "windowscare.wav"),
    ("knock2.wav", "door_pound.wav"),
    ("running fast3.wav", "foxy_sprint.wav"),
    ("music box.wav", "music_box.wav"),
    ("Laugh_Giggle_Girl_1d.wav", "freddy_laugh.wav"),
    ("pirate song2.wav", "foxy_pirate_song.wav"),
    ("XSCREAM.wav", "jumpscare_screamer.wav"),
    ("win.mp3", "win_chime_cheer.mp3")
]
for src, dst in audio_downloads:
    enc_src = urllib.parse.quote(src)
    downloads.append((f"{BASE_REPO}/audio/{enc_src}", f"{TMP_DIR}/{dst}"))

print(f"Total assets queued: {len(downloads)}")

def fetch(item):
    url, path = item
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp, open(path, 'wb') as f:
            f.write(resp.read())
        return True
    except Exception as e:
        print(f"Failed {url}: {e}")
        return False

with ThreadPoolExecutor(max_workers=8) as ex:
    results = list(ex.map(fetch, downloads))

print(f"Downloaded {sum(results)} / {len(downloads)} files.")

# Convert audio to low-latency formats
print("Processing audio with ffmpeg...")
for src, dst in audio_downloads:
    tmp_path = os.path.join(TMP_DIR, dst)
    if os.path.exists(tmp_path):
        name = os.path.splitext(dst)[0]
        out_ogg = os.path.join(AUDIO_DIR, f"{name}.ogg")
        out_wav = os.path.join(AUDIO_DIR, f"{name}.wav")
        subprocess.run(["ffmpeg", "-y", "-i", tmp_path, "-c:a", "libvorbis", "-q:a", "4", out_ogg], capture_output=True)
        subprocess.run(["ffmpeg", "-y", "-i", tmp_path, "-ar", "44100", "-ac", "2", out_wav], capture_output=True)

print("Audio processing complete.")
