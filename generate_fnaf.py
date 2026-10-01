import json, os, uuid

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))
SPRITES_DIR = os.path.join(PROJECT_DIR, "assets/sprites")
AUDIO_DIR = os.path.join(PROJECT_DIR, "assets/audio")
FONTS_DIR = os.path.join(PROJECT_DIR, "assets/fonts")

def uid():
    return str(uuid.uuid4())

# 1. Collect Resources
resources = []

for root, dirs, files in os.walk(SPRITES_DIR):
    for f in sorted(files):
        if f.endswith(".png"):
            rel_path = os.path.relpath(os.path.join(root, f), PROJECT_DIR)
            resources.append({
                "alwaysLoaded": False,
                "file": rel_path,
                "kind": "image",
                "metadata": "",
                "name": f,
                "smoothed": True,
                "userAdded": True
            })

for f in sorted(os.listdir(AUDIO_DIR)):
    if f.endswith(".ogg") or f.endswith(".wav") or f.endswith(".mp3"):
        resources.append({
            "alwaysLoaded": False,
            "file": f"assets/audio/{f}",
            "kind": "audio",
            "metadata": "",
            "name": f,
            "preloadAsMusic": False,
            "preloadAsSound": True,
            "preloadInCache": False,
            "userAdded": True
        })

for f in sorted(os.listdir(FONTS_DIR)):
    if f.endswith(".ttf"):
        resources.append({
            "alwaysLoaded": False,
            "file": f"assets/fonts/{f}",
            "kind": "font",
            "metadata": "",
            "name": f,
            "userAdded": True
        })

def make_sprite(name, anims):
    animations = []
    for anim in anims:
        anim_name = anim.get("name", "")
        loop = anim.get("loop", False)
        tbf = anim.get("time", 0.08)
        frames = anim.get("frames", [])
        sprites_list = []
        for frame in frames:
            sprites_list.append({
                "hasCustomCollisionMask": False,
                "image": frame,
                "points": [],
                "originPoint": {"name": "origine", "x": 0, "y": 0},
                "centerPoint": {"automatic": True, "name": "centre", "x": 0, "y": 0},
                "customCollisionMask": []
            })
        animations.append({
            "name": anim_name,
            "useMultipleDirections": False,
            "directions": [{
                "looping": loop,
                "timeBetweenFrames": tbf,
                "sprites": sprites_list
            }]
        })
    return {
        "adaptCollisionMaskAutomatically": False,
        "assetStoreId": "",
        "name": name,
        "tags": "",
        "type": "Sprite",
        "updateIfNotVisible": False,
        "variables": [],
        "effects": [],
        "behaviors": [],
        "animations": animations
    }

def make_text(name, string, size=48, font="VT323-Regular.ttf", color={"r":255,"g":255,"b":255}):
    return {
        "assetStoreId": "",
        "bold": True,
        "italic": False,
        "name": name,
        "smoothed": True,
        "tags": "",
        "type": "TextObject::Text",
        "underlined": False,
        "variables": [],
        "effects": [],
        "behaviors": [],
        "string": string,
        "font": font,
        "textAlignment": "left",
        "characterSize": size,
        "color": color
    }

# All Scene Objects (configured for 1920x1080)
scene_objects = [
    # Office with authentic dynamic lighting
    make_sprite("OfficeBackground", [
        {"name": "Default", "frames": ["office_default.png"]},
        {"name": "LeftLight", "frames": ["office_left_light.png"]},
        {"name": "LeftLight_Bonnie", "frames": ["office_bonnie_window.png"]},
        {"name": "RightLight", "frames": ["office_right_light.png"]},
        {"name": "RightLight_Chica", "frames": ["office_chica_window.png"]},
        {"name": "PowerOut", "frames": ["office_powerout.png"]},
        {"name": "FreddyEyes", "frames": ["office_freddy_eyes.png"]}
    ]),

    # Animated Office Desk Fan
    make_sprite("OfficeFan", [
        {"name": "Spin", "frames": ["fan_1.png", "fan_2.png", "fan_3.png"], "loop": True, "time": 0.03},
        {"name": "Off", "frames": ["fan_1.png"]}
    ]),

    # Left Door with 16-frame opening and closing animation
    make_sprite("DoorLeft", [
        {"name": "Open", "frames": ["power_bar_bg.png"]},
        {"name": "Closed", "frames": ["door_left_frame_15.png"]},
        {"name": "Closing", "frames": [f"door_left_frame_{i:02d}.png" for i in range(16)], "loop": False, "time": 0.025},
        {"name": "Opening", "frames": [f"door_left_frame_{i:02d}.png" for i in reversed(range(16))], "loop": False, "time": 0.025}
    ]),

    # Right Door with 16-frame opening and closing animation
    make_sprite("DoorRight", [
        {"name": "Open", "frames": ["power_bar_bg.png"]},
        {"name": "Closed", "frames": ["door_right_frame_15.png"]},
        {"name": "Closing", "frames": [f"door_right_frame_{i:02d}.png" for i in range(16)], "loop": False, "time": 0.025},
        {"name": "Opening", "frames": [f"door_right_frame_{i:02d}.png" for i in reversed(range(16))], "loop": False, "time": 0.025}
    ]),

    # Authentic Door Button Panels (Off, Door, Light, Both)
    make_sprite("DoorButtonsLeft", [
        {"name": "Off", "frames": ["btn_left_off.png"]},
        {"name": "Door", "frames": ["btn_left_door.png"]},
        {"name": "Light", "frames": ["btn_left_light.png"]},
        {"name": "Both", "frames": ["btn_left_both.png"]}
    ]),
    make_sprite("DoorButtonsRight", [
        {"name": "Off", "frames": ["btn_right_off.png"]},
        {"name": "Door", "frames": ["btn_right_door.png"]},
        {"name": "Light", "frames": ["btn_right_light.png"]},
        {"name": "Both", "frames": ["btn_right_both.png"]}
    ]),

    # Golden Freddy sitting
    make_sprite("GoldenFreddyOffice", [
        {"name": "Sitting", "frames": ["golden_freddy_office.png"]}
    ]),

    # Tablet Flip Animation (11 frames up and down)
    make_sprite("TabletAnimation", [
        {"name": "Hidden", "frames": ["power_bar_bg.png"]},
        {"name": "FlipUp", "frames": [f"tablet_{i:02d}.png" for i in range(1, 12)], "loop": False, "time": 0.025},
        {"name": "FlipDown", "frames": [f"tablet_{i:02d}.png" for i in reversed(range(1, 12))], "loop": False, "time": 0.025}
    ]),

    # Camera Feed with All 11 Authentic Rooms, enemy states!
    make_sprite("CameraFeed", [
        # CAM 1A: Show Stage
        {"name": "1A_All", "frames": ["stage-b-c-f.png"]},
        {"name": "1A_ChicaFreddy", "frames": ["stage-c-f.png"]},
        {"name": "1A_BonnieFreddy", "frames": ["stage-b-f.png"]},
        {"name": "1A_FreddyOnly", "frames": ["stage-f.png"]},
        {"name": "1A_Empty", "frames": ["stage.png"]},
        # CAM 1B: Dining Area
        {"name": "1B_All", "frames": ["dinningarea-b-c-f.png"]},
        {"name": "1B_BonnieChica", "frames": ["dinningarea-b-c.png"]},
        {"name": "1B_BonnieFreddy", "frames": ["dinningarea-b-f.png"]},
        {"name": "1B_ChicaFreddy", "frames": ["dinningarea-c-f.png"]},
        {"name": "1B_Bonnie", "frames": ["dinningarea-b.png"]},
        {"name": "1B_Chica", "frames": ["dinningarea-c.png"]},
        {"name": "1B_Freddy", "frames": ["dinningarea-f.png"]},
        {"name": "1B_Empty", "frames": ["dinningarea.png"]},
        # CAM 1C: Pirate Cove (Foxy)
        {"name": "1C_Stage1", "frames": ["pirate_cove.png"]},
        {"name": "1C_Stage2", "frames": ["pirate_cove-1.png"]},
        {"name": "1C_Stage3", "frames": ["pirate_cove-2.png"]},
        {"name": "1C_Stage4", "frames": ["pirate_cove-3.png"]},
        # CAM 2A: West Hall (leads directly to Left Door!)
        {"name": "2A_Empty", "frames": ["west_hall.png"]},
        {"name": "2A_Bonnie", "frames": ["west_hall-b.png"]},
        {"name": "2A_FoxySprint", "frames": [f"foxy_run_{i:02d}.png" for i in range(8)], "loop": True, "time": 0.06},
        # CAM 2B: West Hall Corner (Right outside Left Door Window!)
        {"name": "2B_Empty", "frames": ["whallcorner.png"]},
        {"name": "2B_Bonnie", "frames": ["whallcorner-b.png"]},
        # CAM 3: Supply Closet
        {"name": "3_Empty", "frames": ["supplyroom.png"]},
        {"name": "3_Bonnie", "frames": ["supplyroom-b.png"]},
        # CAM 4A: East Hall (leads directly to Right Door!)
        {"name": "4A_Empty", "frames": ["east_hall.png"]},
        {"name": "4A_Chica", "frames": ["east_hall-c.png"]},
        {"name": "4A_Freddy", "frames": ["east_hall-f.png"]},
        {"name": "4A_ChicaFreddy", "frames": ["east_hall-c-f.png"]},
        # CAM 4B: East Hall Corner (Right outside Right Door Window!)
        {"name": "4B_Empty", "frames": ["ehallcorner.png"]},
        {"name": "4B_Chica", "frames": ["ehallcorner-c.png"]},
        {"name": "4B_Freddy", "frames": ["ehallcorner-f.png"]},
        # CAM 5: Backstage
        {"name": "5_Empty", "frames": ["backstage.png"]},
        {"name": "5_Bonnie", "frames": ["backstage-b.png"]},
        # CAM 6: Kitchen (Audio Only!)
        {"name": "6_Kitchen", "frames": ["cam_6_kitchen.png"]},
        # CAM 7: Restrooms
        {"name": "7_Empty", "frames": ["restrooms.png"]},
        {"name": "7_Chica", "frames": ["restrooms-c.png"]},
        {"name": "7_Freddy", "frames": ["restrooms-f.png"]},
        {"name": "7_ChicaFreddy", "frames": ["restrooms-c-f.png"]}
    ]),

    # Map Overlay and Static Noise
    make_sprite("MapOverlay", [{"name": "Default", "frames": ["cam_map_clean.png"]}]),
    make_sprite("StaticOverlay", [
        {"name": "Noise", "frames": [f"static_{i}.png" for i in range(1, 7)], "loop": True, "time": 0.05}
    ]),

    # Camera Map Buttons (Authentic FNaF 1 Highlight Border Sprites)
    make_sprite("BtnCam1A", [{"name": "Off", "frames": ["cam_btn_normal_border.png"]}, {"name": "On", "frames": ["cam_btn_active_border.png"]}]),
    make_sprite("BtnCam1B", [{"name": "Off", "frames": ["cam_btn_normal_border.png"]}, {"name": "On", "frames": ["cam_btn_active_border.png"]}]),
    make_sprite("BtnCam1C", [{"name": "Off", "frames": ["cam_btn_normal_border.png"]}, {"name": "On", "frames": ["cam_btn_active_border.png"]}]),
    make_sprite("BtnCam2A", [{"name": "Off", "frames": ["cam_btn_normal_border.png"]}, {"name": "On", "frames": ["cam_btn_active_border.png"]}]),
    make_sprite("BtnCam2B", [{"name": "Off", "frames": ["cam_btn_normal_border.png"]}, {"name": "On", "frames": ["cam_btn_active_border.png"]}]),
    make_sprite("BtnCam3",  [{"name": "Off", "frames": ["cam_btn_normal_border.png"]}, {"name": "On", "frames": ["cam_btn_active_border.png"]}]),
    make_sprite("BtnCam4A", [{"name": "Off", "frames": ["cam_btn_normal_border.png"]}, {"name": "On", "frames": ["cam_btn_active_border.png"]}]),
    make_sprite("BtnCam4B", [{"name": "Off", "frames": ["cam_btn_normal_border.png"]}, {"name": "On", "frames": ["cam_btn_active_border.png"]}]),
    make_sprite("BtnCam5",  [{"name": "Off", "frames": ["cam_btn_normal_border.png"]}, {"name": "On", "frames": ["cam_btn_active_border.png"]}]),
    make_sprite("BtnCam6",  [{"name": "Off", "frames": ["cam_btn_normal_border.png"]}, {"name": "On", "frames": ["cam_btn_active_border.png"]}]),
    make_sprite("BtnCam7",  [{"name": "Off", "frames": ["cam_btn_normal_border.png"]}, {"name": "On", "frames": ["cam_btn_active_border.png"]}]),

    # UI Elements (1920x1080)
    make_sprite("PosterFreddyNose", [{"name": "Default", "frames": ["cam_btn_normal_border.png"]}]),
    make_sprite("MonitorFlipBar", [{"name": "Default", "frames": ["monitor_flip_bar.png"]}]),
    make_text("TimeText", "12 AM", 72, "VT323-Regular.ttf", {"r":255,"g":255,"b":255}),
    make_text("NightText", "Night 1", 42, "VT323-Regular.ttf", {"r":255,"g":255,"b":255}),
    make_text("PowerText", "Power left: 100%", 52, "VT323-Regular.ttf", {"r":255,"g":255,"b":255}),
    make_text("UsageText", "Usage: [I]", 44, "VT323-Regular.ttf", {"r":255,"g":255,"b":255}),
    make_text("CamLabelText", "CAM 1A - SHOW STAGE", 52, "VT323-Regular.ttf", {"r":255,"g":255,"b":255}),

    # Animated Jumpscare Objects
    make_sprite("FreddyJumpscare", [
        {"name": "Scare", "frames": [f"freddy_scare_{i:02d}.png" for i in range(7)], "loop": True, "time": 0.04},
        {"name": "Blackout", "frames": [f"freddy_scare_{i:02d}.png" for i in range(6)], "loop": True, "time": 0.05}
    ]),
    make_sprite("BonnieJumpscare", [
        {"name": "Scare", "frames": [f"bonnie_scare_{i:02d}.png" for i in range(7)], "loop": True, "time": 0.04}
    ]),
    make_sprite("ChicaJumpscare", [
        {"name": "Scare", "frames": [f"chica_scare_{i:02d}.png" for i in range(6)], "loop": True, "time": 0.04}
    ]),
    make_sprite("FoxyJumpscare", [
        {"name": "Scare", "frames": [f"foxy_scare_{i:02d}.png" for i in range(7)], "loop": True, "time": 0.04}
    ]),
    make_sprite("GoldenFreddyJumpscare", [
        {"name": "Scare", "frames": ["golden_freddy_scare.png"]}
    ]),

    make_text("GameOverText", "GAME OVER", 110, "Creepster-Regular.ttf", {"r":255,"g":20,"b":20}),
    make_text("VictoryText", "6:00 AM\nYOU SURVIVED!", 130, "VT323-Regular.ttf", {"r":255,"g":255,"b":255})
]

# 3. Instances placed in scene (1920x1080)
def make_inst(name, layer, x, y, z=1):
    return {
        "angle": 0,
        "customSize": False,
        "height": 0,
        "layer": layer,
        "name": name,
        "persistentUuid": uid(),
        "width": 0,
        "x": x,
        "y": y,
        "zOrder": z,
        "numberProperties": [],
        "stringProperties": [],
        "initialVariables": []
    }

scene_instances = [
    # Office Layer (X coordinates in 2400x1080 canvas)
    make_inst("OfficeBackground", "", 0, 0, 1),
    make_inst("OfficeFan", "", 1170, 455, 3),
    make_inst("DoorLeft", "", 108, 0, 2),
    make_inst("DoorRight", "", 1956, 0, 2),
    make_inst("DoorButtonsLeft", "", 37, 420, 5),
    make_inst("DoorButtonsRight", "", 2295, 420, 5),
    make_inst("GoldenFreddyOffice", "", 990, 420, 4),
    make_inst("PosterFreddyNose", "", 1016, 357, 6),

    # Camera Layer (1920x1080 fixed viewport)
    make_inst("CameraFeed", "CameraLayer", 0, 0, 10),
    make_inst("StaticOverlay", "CameraLayer", 0, 0, 20),
    make_inst("MapOverlay", "CameraLayer", 1300, 485, 30),
    make_inst("CamLabelText", "CameraLayer", 60, 50, 35),

    # Cam buttons on map (scaled for 1920x1080)
    make_inst("BtnCam1A", "CameraLayer", 1468, 528, 40),
    make_inst("BtnCam1B", "CameraLayer", 1446, 614, 40),
    make_inst("BtnCam1C", "CameraLayer", 1387, 720, 40),
    make_inst("BtnCam2A", "CameraLayer", 1465, 894, 40),
    make_inst("BtnCam2B", "CameraLayer", 1465, 958, 40),
    make_inst("BtnCam3",  "CameraLayer", 1364, 845, 40),
    make_inst("BtnCam4A", "CameraLayer", 1587, 894, 40),
    make_inst("BtnCam4B", "CameraLayer", 1587, 958, 40),
    make_inst("BtnCam5",  "CameraLayer", 1319, 653, 40),
    make_inst("BtnCam6",  "CameraLayer", 1749, 823, 40),
    make_inst("BtnCam7",  "CameraLayer", 1749, 634, 40),

    # Tablet flip layer
    make_inst("TabletAnimation", "UILayer", 0, 0, 45),

    # UI Layer
    make_inst("TimeText", "UILayer", 1850, 40, 50),
    make_inst("NightText", "UILayer", 1850, 115, 50),
    make_inst("PowerText", "UILayer", 50, 930, 50),
    make_inst("UsageText", "UILayer", 50, 990, 50),
    make_inst("MonitorFlipBar", "UILayer", 660, 1000, 60),

    # Jumpscare Layer
    make_inst("FreddyJumpscare", "JumpscareLayer", 0, 0, 100),
    make_inst("BonnieJumpscare", "JumpscareLayer", 0, 0, 100),
    make_inst("ChicaJumpscare", "JumpscareLayer", 0, 0, 100),
    make_inst("FoxyJumpscare", "JumpscareLayer", 0, 0, 100),
    make_inst("GoldenFreddyJumpscare", "JumpscareLayer", 0, 0, 100),
    make_inst("GameOverText", "JumpscareLayer", 650, 480, 101),
    make_inst("VictoryText", "VictoryLayer", 600, 420, 102)
]

# 4. Global Variables
game_variables = [
    {"name": "Power", "type": "number", "value": 100.0},
    {"name": "Usage", "type": "number", "value": 1},
    {"name": "TimeSeconds", "type": "number", "value": 0.0},
    {"name": "Hour", "type": "number", "value": 0},
    {"name": "HourString", "type": "string", "value": "12 AM"},
    {"name": "Night", "type": "number", "value": 1},
    {"name": "NightWon", "type": "number", "value": 0},
    {"name": "Blackout", "type": "number", "value": 0},
    {"name": "BlackoutTimer", "type": "number", "value": 0.0},
    {"name": "DoorLeft_Closed", "type": "number", "value": 0},
    {"name": "DoorRight_Closed", "type": "number", "value": 0},
    {"name": "LightLeft_On", "type": "number", "value": 0},
    {"name": "LightRight_On", "type": "number", "value": 0},
    {"name": "Monitor_Open", "type": "number", "value": 0},
    {"name": "SelectedCam", "type": "string", "value": "1A"},
    {"name": "OfficePanX", "type": "number", "value": -240.0},
    {"name": "AI_TickTimer", "type": "number", "value": 0.0},
    {"name": "Freddy_Level", "type": "number", "value": 0},
    {"name": "Freddy_Pos", "type": "number", "value": 1},
    {"name": "Bonnie_Level", "type": "number", "value": 3},
    {"name": "Bonnie_Pos", "type": "number", "value": 1},
    {"name": "Bonnie_BlindspotTimer", "type": "number", "value": 0.0},
    {"name": "Chica_Level", "type": "number", "value": 2},
    {"name": "Chica_Pos", "type": "number", "value": 1},
    {"name": "Chica_BlindspotTimer", "type": "number", "value": 0.0},
    {"name": "Foxy_Level", "type": "number", "value": 2},
    {"name": "Foxy_Stage", "type": "number", "value": 1},
    {"name": "Foxy_SprintTimer", "type": "number", "value": 0.0},
    {"name": "GoldenFreddy_InOffice", "type": "number", "value": 0},
    {"name": "GoldenFreddy_Timer", "type": "number", "value": 0.0},
    {"name": "GameOver", "type": "number", "value": 0},
    {"name": "GameOverJumpscare", "type": "string", "value": ""}
]

# 5. Layers
layers = [
    {
        "name": "",
        "visibility": True,
        "cameras": [{"defaultSize": True, "defaultViewport": True, "height": 0, "viewportBottom": 1, "viewportLeft": 0, "viewportRight": 1, "viewportTop": 0, "width": 0}],
        "effects": []
    },
    {
        "name": "CameraLayer",
        "visibility": False,
        "cameras": [{"defaultSize": True, "defaultViewport": True, "height": 0, "viewportBottom": 1, "viewportLeft": 0, "viewportRight": 1, "viewportTop": 0, "width": 0}],
        "effects": []
    },
    {
        "name": "UILayer",
        "visibility": True,
        "cameras": [{"defaultSize": True, "defaultViewport": True, "height": 0, "viewportBottom": 1, "viewportLeft": 0, "viewportRight": 1, "viewportTop": 0, "width": 0}],
        "effects": []
    },
    {
        "name": "JumpscareLayer",
        "visibility": False,
        "cameras": [{"defaultSize": True, "defaultViewport": True, "height": 0, "viewportBottom": 1, "viewportLeft": 0, "viewportRight": 1, "viewportTop": 0, "width": 0}],
        "effects": []
    },
    {
        "name": "VictoryLayer",
        "visibility": False,
        "cameras": [{"defaultSize": True, "defaultViewport": True, "height": 0, "viewportBottom": 1, "viewportLeft": 0, "viewportRight": 1, "viewportTop": 0, "width": 0}],
        "effects": []
    }
]

# 6. Event Helpers
def act_set_pos_x(obj, val): return {"type": {"value": "MettreX"}, "parameters": [obj, "=", str(val)]}
def act_set_opacity(obj, val): return {"type": {"value": "Opacity"}, "parameters": [obj, "=", str(val)]}
def act_set_anim(obj, anim): return {"type": {"value": "SetAnimationName"}, "parameters": [obj, f'"{anim}"']}
def act_play_sound(res, loop="no", vol="100", pitch="1"): return {"type": {"value": "PlaySound"}, "parameters": ["", res, loop, vol, pitch]}
def act_play_music(res, loop="yes", vol="100", pitch="1"): return {"type": {"value": "PlayMusic"}, "parameters": ["", res, loop, vol, pitch]}
def act_mod_var(var, op, val): return {"type": {"value": "ModVarGlobal"}, "parameters": [var, op, str(val)]}
def act_show_layer(layer): return {"type": {"value": "ShowLayer"}, "parameters": ["", f'"{layer}"']}
def act_hide_layer(layer): return {"type": {"value": "HideLayer"}, "parameters": ["", f'"{layer}"']}
def cond_cursor_on(obj): return {"type": {"value": "SourisSurObjet"}, "parameters": [obj, "", "", ""]}
def cond_mouse_pressed(btn="Left"): return {"type": {"value": "MouseButtonPressed"}, "parameters": [btn]}
def cond_var(var, op, val): return {"type": {"value": "VarGlobal"}, "parameters": [var, op, str(val)]}

# Build Modules
def build_modules():
    core_events = [
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [{"type": {"value": "DepartScene"}, "parameters": [""]}],
            "actions": [
                act_play_music("office_ambience.ogg", "yes", "60", "1"),
                act_set_opacity("GoldenFreddyOffice", 0),
                act_set_opacity("PosterFreddyNose", 0),
                act_hide_layer("CameraLayer"),
                act_hide_layer("JumpscareLayer"),
                act_hide_layer("VictoryLayer"),
                act_mod_var("Power", "=", 100),
                act_mod_var("Usage", "=", 1),
                act_mod_var("TimeSeconds", "=", 0)
            ]
        },
        # Phone Guy Calls (Nights 1 to 5)
        {"type": "BuiltinCommonInstructions::Standard", "conditions": [{"type": {"value": "DepartScene"}, "parameters": [""]}, cond_var("CurrentNight", "=", 1)], "actions": [act_play_sound("phone_guy_night1.ogg", "no", "100", "1")]},
        {"type": "BuiltinCommonInstructions::Standard", "conditions": [{"type": {"value": "DepartScene"}, "parameters": [""]}, cond_var("CurrentNight", "=", 2)], "actions": [act_play_sound("phone_guy_night2.ogg", "no", "100", "1")]},
        {"type": "BuiltinCommonInstructions::Standard", "conditions": [{"type": {"value": "DepartScene"}, "parameters": [""]}, cond_var("CurrentNight", "=", 3)], "actions": [act_play_sound("phone_guy_night3.ogg", "no", "100", "1")]},
        {"type": "BuiltinCommonInstructions::Standard", "conditions": [{"type": {"value": "DepartScene"}, "parameters": [""]}, cond_var("CurrentNight", "=", 4)], "actions": [act_play_sound("phone_guy_night4.ogg", "no", "100", "1")]},
        {"type": "BuiltinCommonInstructions::Standard", "conditions": [{"type": {"value": "DepartScene"}, "parameters": [""]}, cond_var("CurrentNight", "=", 5)], "actions": [act_play_sound("phone_guy_night5.ogg", "no", "100", "1")]},
        # Clock progression
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("GameOver", "=", 0), cond_var("NightWon", "=", 0)],
            "actions": [act_mod_var("TimeSeconds", "+", "TimeDelta()")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("TimeSeconds", ">=", 60), cond_var("TimeSeconds", "<", 120), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("Hour", "=", 1), act_mod_var("HourString", "=", '"1 AM"')]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("TimeSeconds", ">=", 120), cond_var("TimeSeconds", "<", 180), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("Hour", "=", 2), act_mod_var("HourString", "=", '"2 AM"'), act_mod_var("Bonnie_Level", "+", 1), act_mod_var("Chica_Level", "+", 1)]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("TimeSeconds", ">=", 180), cond_var("TimeSeconds", "<", 240), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("Hour", "=", 3), act_mod_var("HourString", "=", '"3 AM"'), act_mod_var("Foxy_Level", "+", 1)]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("TimeSeconds", ">=", 240), cond_var("TimeSeconds", "<", 300), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("Hour", "=", 4), act_mod_var("HourString", "=", '"4 AM"'), act_mod_var("Freddy_Level", "=", 1), act_mod_var("Bonnie_Level", "+", 1)]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("TimeSeconds", ">=", 300), cond_var("TimeSeconds", "<", 360), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("Hour", "=", 5), act_mod_var("HourString", "=", '"5 AM"'), act_mod_var("Freddy_Level", "+", 1)]
        },
        # 6 AM
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("TimeSeconds", ">=", 360), cond_var("NightWon", "=", 0), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [
                act_mod_var("NightWon", "=", 1),
                act_mod_var("HourString", "=", '"6 AM"'),
                act_show_layer("VictoryLayer"),
                act_hide_layer("CameraLayer"),
                act_play_sound("win_chime_cheer.ogg", "no", "100", "1")
            ]
        },
        # Power drain
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("GameOver", "=", 0), cond_var("Blackout", "=", 0)],
            "actions": [
                act_mod_var("Usage", "=", "1 + GlobalVariable(DoorLeft_Closed) + GlobalVariable(DoorRight_Closed) + GlobalVariable(LightLeft_On) + GlobalVariable(LightRight_On) + GlobalVariable(Monitor_Open)"),
                act_mod_var("Power", "-", "0.1 * GlobalVariable(Usage) * TimeDelta()")
            ]
        },
        # Power Out
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Power", "<=", 0), cond_var("Blackout", "=", 0), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [
                act_mod_var("Power", "=", 0),
                act_mod_var("Blackout", "=", 1),
                act_mod_var("DoorLeft_Closed", "=", 0),
                act_mod_var("DoorRight_Closed", "=", 0),
                act_mod_var("LightLeft_On", "=", 0),
                act_mod_var("LightRight_On", "=", 0),
                act_mod_var("Monitor_Open", "=", 0),
                act_set_anim("OfficeBackground", "PowerOut"),
                act_set_anim("DoorLeft", "Open"),
                act_set_anim("DoorRight", "Open"),
                act_set_anim("OfficeFan", "Off"),
                act_hide_layer("CameraLayer"),
                act_play_sound("powerdown.ogg", "no", "100", "1")
            ]
        },
        # Blackout sequence
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Blackout", "=", 1), cond_var("GameOver", "=", 0)],
            "actions": [act_mod_var("BlackoutTimer", "+", "TimeDelta()")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Blackout", "=", 1), cond_var("BlackoutTimer", ">=", 3.0), cond_var("BlackoutTimer", "<", 7.0), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [
                act_set_anim("OfficeBackground", "FreddyEyes"),
                act_play_music("music_box.ogg", "no", "80", "1")
            ]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Blackout", "=", 1), cond_var("BlackoutTimer", ">=", 7.5), cond_var("GameOver", "=", 0)],
            "actions": [
                act_mod_var("GameOver", "=", 1),
                act_show_layer("JumpscareLayer"),
                act_set_anim("FreddyJumpscare", "Blackout"),
                act_play_sound("jumpscare_screamer.ogg", "no", "100", "1")
            ]
        }
    ]

    office_events = [
        # Mouse panning in 1920x1080 (Office is 2400x1080, margin 480)
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Monitor_Open", "=", 0), cond_var("GameOver", "=", 0)],
            "actions": [
                act_mod_var("OfficePanX", "=", "GlobalVariable(OfficePanX) + (Clamp(960 - MouseX(), -240, 240) - GlobalVariable(OfficePanX)) * 0.08"),
                act_set_pos_x("OfficeBackground", "GlobalVariable(OfficePanX) - 240"),
                act_set_pos_x("OfficeFan", "GlobalVariable(OfficePanX) + 930"),
                act_set_pos_x("DoorLeft", "GlobalVariable(OfficePanX) - 132"),
                act_set_pos_x("DoorRight", "GlobalVariable(OfficePanX) + 1716"),
                act_set_pos_x("DoorButtonsLeft", "GlobalVariable(OfficePanX) - 203"),
                act_set_pos_x("DoorButtonsRight", "GlobalVariable(OfficePanX) + 2055"),
                act_set_pos_x("GoldenFreddyOffice", "GlobalVariable(OfficePanX) + 750"),
                act_set_pos_x("PosterFreddyNose", "GlobalVariable(OfficePanX) + 776")
            ]
        },
        # Freddy Nose Easter Egg (Honk)
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [
                cond_cursor_on("PosterFreddyNose"),
                cond_mouse_pressed("Left"),
                cond_var("Blackout", "=", 0),
                cond_var("Monitor_Open", "=", 0),
                {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}
            ],
            "actions": [
                act_play_sound("freddy_nose.ogg", "no", "100", "1")
            ]
        },
        # Office Dynamic Lighting states
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Blackout", "=", 0), cond_var("LightLeft_On", "=", 0), cond_var("LightRight_On", "=", 0)],
            "actions": [act_set_anim("OfficeBackground", "Default")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Blackout", "=", 0), cond_var("LightLeft_On", "=", 1), cond_var("Bonnie_Pos", "!=", 6)],
            "actions": [act_set_anim("OfficeBackground", "LeftLight")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Blackout", "=", 0), cond_var("LightLeft_On", "=", 1), cond_var("Bonnie_Pos", "=", 6)],
            "actions": [act_set_anim("OfficeBackground", "LeftLight_Bonnie")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Blackout", "=", 0), cond_var("LightRight_On", "=", 1), cond_var("Chica_Pos", "!=", 7)],
            "actions": [act_set_anim("OfficeBackground", "RightLight")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Blackout", "=", 0), cond_var("LightRight_On", "=", 1), cond_var("Chica_Pos", "=", 7)],
            "actions": [act_set_anim("OfficeBackground", "RightLight_Chica")]
        },

        # Left Door Button Click
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("DoorButtonsLeft"), cond_mouse_pressed("Left"), cond_var("Blackout", "=", 0), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [
                act_mod_var("DoorLeft_Closed", "=", "1 - GlobalVariable(DoorLeft_Closed)"),
                act_play_sound("door_toggle.ogg", "no", "100", "1")
            ]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("DoorLeft_Closed", "=", 1)],
            "actions": [act_set_anim("DoorLeft", "Closed"), act_set_anim("DoorButtonsLeft", "Door")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("DoorLeft_Closed", "=", 0)],
            "actions": [act_set_anim("DoorLeft", "Open"), act_set_anim("DoorButtonsLeft", "Off")]
        },

        # Right Door Button Click
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("DoorButtonsRight"), cond_mouse_pressed("Left"), cond_var("Blackout", "=", 0), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [
                act_mod_var("DoorRight_Closed", "=", "1 - GlobalVariable(DoorRight_Closed)"),
                act_play_sound("door_toggle.ogg", "no", "100", "1")
            ]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("DoorRight_Closed", "=", 1)],
            "actions": [act_set_anim("DoorRight", "Closed"), act_set_anim("DoorButtonsRight", "Door")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("DoorRight_Closed", "=", 0)],
            "actions": [act_set_anim("DoorRight", "Open"), act_set_anim("DoorButtonsRight", "Off")]
        },

        # Monitor Flip with 11-frame tablet animation
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("MonitorFlipBar"), cond_var("Blackout", "=", 0), cond_var("GameOver", "=", 0), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("Monitor_Open", "=", "1 - GlobalVariable(Monitor_Open)")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Monitor_Open", "=", 1), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [
                act_show_layer("CameraLayer"),
                act_play_sound("camera_up.ogg", "no", "100", "1"),
                act_set_anim("TabletAnimation", "FlipUp"),
                act_mod_var("GoldenFreddy_InOffice", "=", 0),
                act_set_opacity("GoldenFreddyOffice", 0)
            ]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Monitor_Open", "=", 0), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [
                act_hide_layer("CameraLayer"),
                act_play_sound("camera_down.ogg", "no", "100", "1"),
                act_set_anim("TabletAnimation", "FlipDown")
            ]
        }
    ]

    cam_events = [
        # Camera buttons
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("BtnCam1A"), cond_mouse_pressed("Left"), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("SelectedCam", "=", '"1A"'), act_set_anim("CameraFeed", "1A_All"), act_play_sound("switch_click.ogg", "no", "100", "1")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("BtnCam1B"), cond_mouse_pressed("Left"), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("SelectedCam", "=", '"1B"'), act_play_sound("switch_click.ogg", "no", "100", "1")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("BtnCam1C"), cond_mouse_pressed("Left"), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("SelectedCam", "=", '"1C"'), act_play_sound("switch_click.ogg", "no", "100", "1")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("BtnCam2A"), cond_mouse_pressed("Left"), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("SelectedCam", "=", '"2A"'), act_play_sound("switch_click.ogg", "no", "100", "1")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("BtnCam2B"), cond_mouse_pressed("Left"), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("SelectedCam", "=", '"2B"'), act_play_sound("switch_click.ogg", "no", "100", "1")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("BtnCam3"), cond_mouse_pressed("Left"), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("SelectedCam", "=", '"3"'), act_set_anim("CameraFeed", "3_Empty"), act_play_sound("switch_click.ogg", "no", "100", "1")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("BtnCam4A"), cond_mouse_pressed("Left"), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("SelectedCam", "=", '"4A"'), act_play_sound("switch_click.ogg", "no", "100", "1")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("BtnCam4B"), cond_mouse_pressed("Left"), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("SelectedCam", "=", '"4B"'), act_play_sound("switch_click.ogg", "no", "100", "1")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("BtnCam5"), cond_mouse_pressed("Left"), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("SelectedCam", "=", '"5"'), act_set_anim("CameraFeed", "5_Empty"), act_play_sound("switch_click.ogg", "no", "100", "1")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("BtnCam6"), cond_mouse_pressed("Left"), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("SelectedCam", "=", '"6"'), act_set_anim("CameraFeed", "6_Kitchen"), act_play_sound("switch_click.ogg", "no", "100", "1")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_cursor_on("BtnCam7"), cond_mouse_pressed("Left"), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_mod_var("SelectedCam", "=", '"7"'), act_set_anim("CameraFeed", "7_Empty"), act_play_sound("switch_click.ogg", "no", "100", "1")]
        },

        # Cam 2A West Hall Sprint
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"2A"'), cond_var("Foxy_Stage", "=", 4)],
            "actions": [act_set_anim("CameraFeed", "2A_FoxySprint")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"2A"'), cond_var("Foxy_Stage", "!=", 4)],
            "actions": [act_set_anim("CameraFeed", "2A_Empty")]
        },

        # Cam 1A Show Stage States
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"1A"'), cond_var("Bonnie_Pos", "=", 1), cond_var("Chica_Pos", "=", 1), cond_var("Freddy_Pos", "=", 1)],
            "actions": [act_set_anim("CameraFeed", "1A_All")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"1A"'), cond_var("Bonnie_Pos", "!=", 1), cond_var("Chica_Pos", "=", 1), cond_var("Freddy_Pos", "=", 1)],
            "actions": [act_set_anim("CameraFeed", "1A_ChicaFreddy")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"1A"'), cond_var("Bonnie_Pos", "=", 1), cond_var("Chica_Pos", "!=", 1), cond_var("Freddy_Pos", "=", 1)],
            "actions": [act_set_anim("CameraFeed", "1A_BonnieFreddy")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"1A"'), cond_var("Bonnie_Pos", "!=", 1), cond_var("Chica_Pos", "!=", 1), cond_var("Freddy_Pos", "=", 1)],
            "actions": [act_set_anim("CameraFeed", "1A_FreddyOnly")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"1A"'), cond_var("Freddy_Pos", "!=", 1)],
            "actions": [act_set_anim("CameraFeed", "1A_Empty")]
        },

        # Cam 2B West Hall Corner (Bonnie outside left door)
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"2B"'), cond_var("Bonnie_Pos", "=", 6)],
            "actions": [act_set_anim("CameraFeed", "2B_Bonnie")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"2B"'), cond_var("Bonnie_Pos", "!=", 6)],
            "actions": [act_set_anim("CameraFeed", "2B_Empty")]
        },

        # Cam 4B East Hall Corner (Chica/Freddy outside right door)
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"4B"'), cond_var("Chica_Pos", "=", 6)],
            "actions": [act_set_anim("CameraFeed", "4B_Chica")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"4B"'), cond_var("Freddy_Pos", "=", 6)],
            "actions": [act_set_anim("CameraFeed", "4B_Freddy")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"4B"'), cond_var("Chica_Pos", "!=", 6), cond_var("Freddy_Pos", "!=", 6)],
            "actions": [act_set_anim("CameraFeed", "4B_Empty")]
        },

        # Cam 5 Backstage States
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"5"'), cond_var("Bonnie_Pos", "=", 3)],
            "actions": [act_set_anim("CameraFeed", "5_Bonnie")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("SelectedCam", "=", '"5"'), cond_var("Bonnie_Pos", "!=", 3)],
            "actions": [act_set_anim("CameraFeed", "5_Empty")]
        }
    ]

    ai_events = [
        # AI Tick Cadence (Scott Cawthon FNaF 1 Cadence)
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("GameOver", "=", 0), cond_var("NightWon", "=", 0)],
            "actions": [act_mod_var("AI_TickTimer", "+", "TimeDelta()")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("AI_TickTimer", ">=", 4.97)],
            "actions": [
                act_mod_var("AI_TickTimer", "=", 0),
                act_mod_var("Bonnie_Pos", "+", "RandomInRange(1, 20) <= GlobalVariable(Bonnie_Level) ? 1 : 0"),
                act_mod_var("Chica_Pos", "+", "RandomInRange(1, 20) <= GlobalVariable(Chica_Level) ? 1 : 0"),
                act_mod_var("Freddy_Pos", "+", "(RandomInRange(1, 20) <= GlobalVariable(Freddy_Level) && (GlobalVariable(Monitor_Open) == 0 || GlobalVariable(SelectedCam) != '1A')) ? 1 : 0")
            ]
        },

        # Foxy Pirate Cove Stalling
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [
                cond_var("SelectedCam", "!=", '"1C"'),
                cond_var("AI_TickTimer", "=", 0),
                cond_var("Foxy_Stage", "<", 4)
            ],
            "actions": [act_mod_var("Foxy_Stage", "+", "RandomInRange(1, 20) <= GlobalVariable(Foxy_Level) ? 1 : 0")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Foxy_Stage", "=", 4), {"type": {"value": "BuiltinCommonInstructions::Once"}, "parameters": [""]}],
            "actions": [act_play_sound("foxy_sprint.ogg", "no", "100", "1")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Foxy_Stage", "=", 4)],
            "actions": [act_mod_var("Foxy_SprintTimer", "+", "TimeDelta()")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Foxy_Stage", "=", 4), cond_var("Foxy_SprintTimer", ">=", 2.5), cond_var("DoorLeft_Closed", "=", 1)],
            "actions": [
                act_play_sound("door_pound.ogg", "no", "100", "1"),
                act_mod_var("Power", "-", 5),
                act_mod_var("Foxy_Stage", "=", 1),
                act_mod_var("Foxy_SprintTimer", "=", 0)
            ]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Foxy_Stage", "=", 4), cond_var("Foxy_SprintTimer", ">=", 2.5), cond_var("DoorLeft_Closed", "=", 0), cond_var("GameOver", "=", 0)],
            "actions": [
                act_mod_var("GameOver", "=", 1),
                act_show_layer("JumpscareLayer"),
                act_set_anim("FoxyJumpscare", "Scare"),
                act_play_sound("jumpscare_screamer.ogg", "no", "100", "1")
            ]
        },

        # Bonnie at Left Blindspot
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Bonnie_Pos", "=", 6), cond_var("DoorLeft_Closed", "=", 1)],
            "actions": [
                act_play_sound("door_pound.ogg", "no", "100", "1"),
                act_mod_var("Bonnie_Pos", "=", 2),
                act_mod_var("Bonnie_BlindspotTimer", "=", 0)
            ]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Bonnie_Pos", "=", 6), cond_var("DoorLeft_Closed", "=", 0)],
            "actions": [act_mod_var("Bonnie_BlindspotTimer", "+", "TimeDelta()")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Bonnie_Pos", "=", 6), cond_var("DoorLeft_Closed", "=", 0), cond_var("Bonnie_BlindspotTimer", ">=", 5.0), cond_var("GameOver", "=", 0)],
            "actions": [
                act_mod_var("GameOver", "=", 1),
                act_show_layer("JumpscareLayer"),
                act_set_anim("BonnieJumpscare", "Scare"),
                act_play_sound("jumpscare_screamer.ogg", "no", "100", "1")
            ]
        },

        # Chica at Right Blindspot
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Chica_Pos", "=", 7), cond_var("DoorRight_Closed", "=", 1)],
            "actions": [
                act_play_sound("door_pound.ogg", "no", "100", "1"),
                act_mod_var("Chica_Pos", "=", 2),
                act_mod_var("Chica_BlindspotTimer", "=", 0)
            ]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Chica_Pos", "=", 7), cond_var("DoorRight_Closed", "=", 0)],
            "actions": [act_mod_var("Chica_BlindspotTimer", "+", "TimeDelta()")]
        },
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [cond_var("Chica_Pos", "=", 7), cond_var("DoorRight_Closed", "=", 0), cond_var("Chica_BlindspotTimer", ">=", 5.0), cond_var("GameOver", "=", 0)],
            "actions": [
                act_mod_var("GameOver", "=", 1),
                act_show_layer("JumpscareLayer"),
                act_set_anim("ChicaJumpscare", "Scare"),
                act_play_sound("jumpscare_screamer.ogg", "no", "100", "1")
            ]
        },

        # Freddy corner sneak (Pos 6 -> Office)
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [
                cond_var("Freddy_Pos", "=", 6),
                cond_var("Monitor_Open", "=", 0),
                cond_var("DoorRight_Closed", "=", 0),
                cond_var("GameOver", "=", 0)
            ],
            "actions": [
                act_mod_var("GameOver", "=", 1),
                act_show_layer("JumpscareLayer"),
                act_set_anim("FreddyJumpscare", "Scare"),
                act_play_sound("jumpscare_screamer.ogg", "no", "100", "1")
            ]
        }
    ]

    audio_ui_events = [
        {
            "type": "BuiltinCommonInstructions::Standard",
            "conditions": [{"type": {"value": "BuiltinCommonInstructions::Always"}, "parameters": [""]}],
            "actions": [
                {"type": {"value": "TextObject::String"}, "parameters": ["TimeText", "=", 'GlobalVariableString(HourString)']},
                {"type": {"value": "TextObject::String"}, "parameters": ["PowerText", "=", '"Power left: " + ToString(round(GlobalVariable(Power))) + "%"']},
                {"type": {"value": "TextObject::String"}, "parameters": ["UsageText", "=", '"Usage: " + SubStr("[I] [II] [III] [IIII] [IIIII]", 0, GlobalVariable(Usage) * 6)']},
                {"type": {"value": "TextObject::String"}, "parameters": ["CamLabelText", "=", '"CAM " + GlobalVariableString(SelectedCam)']}
            ]
        }
    ]

    return core_events, office_events, cam_events, ai_events, audio_ui_events

core_evs, office_evs, cam_evs, ai_evs, audio_evs = build_modules()

# Modular json files
with open(os.path.join(PROJECT_DIR, "CoreGameLoop.json"), "w", encoding="utf-8") as f:
    json.dump({"name": "CoreGameLoop", "associatedLayout": "OfficeNight", "events": core_evs}, f, indent=2)

with open(os.path.join(PROJECT_DIR, "OfficeInteraction.json"), "w", encoding="utf-8") as f:
    json.dump({"name": "OfficeInteraction", "associatedLayout": "OfficeNight", "events": office_evs}, f, indent=2)

with open(os.path.join(PROJECT_DIR, "CameraSystem.json"), "w", encoding="utf-8") as f:
    json.dump({"name": "CameraSystem", "associatedLayout": "OfficeNight", "events": cam_evs}, f, indent=2)

with open(os.path.join(PROJECT_DIR, "EnemyAI.json"), "w", encoding="utf-8") as f:
    json.dump({"name": "EnemyAI", "associatedLayout": "OfficeNight", "events": ai_evs}, f, indent=2)

with open(os.path.join(PROJECT_DIR, "AudioEngine.json"), "w", encoding="utf-8") as f:
    json.dump({"name": "AudioEngine", "associatedLayout": "OfficeNight", "events": audio_evs}, f, indent=2)

scene_events = [
    {"type": "BuiltinCommonInstructions::Group", "name": "CoreGameLoop", "events": core_evs},
    {"type": "BuiltinCommonInstructions::Group", "name": "OfficeInteraction", "events": office_evs},
    {"type": "BuiltinCommonInstructions::Group", "name": "CameraSystem", "events": cam_evs},
    {"type": "BuiltinCommonInstructions::Group", "name": "EnemyAI", "events": ai_evs},
    {"type": "BuiltinCommonInstructions::Group", "name": "AudioEngine", "events": audio_evs}
]

layout = {
    "b": 0,
    "disableInputWhenNotFocused": True,
    "mangledName": "OfficeNight",
    "name": "OfficeNight",
    "r": 0,
    "standardSortMethod": True,
    "stopSoundsOnStartup": True,
    "title": "",
    "v": 0,
    "uiSettings": {
        "grid": False,
        "gridType": "isometric",
        "gridWidth": 32,
        "gridHeight": 32,
        "gridOffsetX": 0,
        "gridOffsetY": 0,
        "gridColor": 10401023,
        "gridAlpha": 0.8,
        "snapToGrid": False
    },
    "layers": layers,
    "objects": scene_objects,
    "instances": scene_instances,
    "events": scene_events,
    "variables": [],
    "behaviorsSharedData": [],
    "objectsGroups": []
}

external_events = [
    {"name": "CoreGameLoop", "associatedLayout": "OfficeNight", "events": core_evs},
    {"name": "OfficeInteraction", "associatedLayout": "OfficeNight", "events": office_evs},
    {"name": "CameraSystem", "associatedLayout": "OfficeNight", "events": cam_evs},
    {"name": "EnemyAI", "associatedLayout": "OfficeNight", "events": ai_evs},
    {"name": "AudioEngine", "associatedLayout": "OfficeNight", "events": audio_evs}
]

project = {
    "firstLayout": "OfficeNight",
    "gdVersion": {"build": 99, "major": 4, "minor": 0, "revision": 0},
    "properties": {
        "adaptGameResolutionAtRuntime": True,
        "antialiasingMode": "MSAA",
        "antialisingEnabledOnMobile": False,
        "folderProject": False,
        "orientation": "landscape",
        "packageName": "com.yurist.fivenightsatfreddys",
        "pixelsRounding": False,
        "projectUuid": uid(),
        "scaleMode": "linear",
        "sizeOnStartupMode": "",
        "templateSlug": "",
        "useExternalSourceFiles": False,
        "version": "1.0.0",
        "name": "Five Nights at Freddy's",
        "description": "Authentic Scott Cawthon style FNaF 1 HD engine in GDevelop 5.",
        "author": "Open Source Community",
        "windowWidth": 1920,
        "windowHeight": 1080,
        "latestCompilationDirectory": "",
        "maxFPS": 60,
        "minFPS": 30,
        "verticalSync": False,
        "platformSpecificAssets": {},
        "loadingScreen": {
            "backgroundColor": 0,
            "backgroundFadeInDuration": 0.2,
            "backgroundImageResourceName": "",
            "gdevelopLogoStyle": "light",
            "logoAndProgressFadeInDuration": 0.2,
            "logoAndProgressLogoFadeInDelay": 0.2,
            "minDuration": 1.0,
            "progressBarColor": 16777215,
            "progressBarHeight": 20,
            "progressBarMaxWidth": 200,
            "progressBarMinWidth": 40,
            "progressBarWidthPercent": 30,
            "showGDevelopSplash": False,
            "showProgressBar": True
        },
        "watermark": {
            "placement": "bottom-left",
            "showWatermark": False
        },
        "authorIds": [],
        "authorUsernames": [],
        "categories": [],
        "playableDevices": [],
        "extensionProperties": [],
        "platforms": [{"name": "GDevelop JS platform"}],
        "currentPlatform": "GDevelop JS platform"
    },
    "resources": {"resources": resources},
    "objects": [],
    "objectsGroups": [],
    "variables": game_variables,
    "layouts": [layout],
    "externalEvents": external_events,
    "eventsFunctionsExtensions": [],
    "externalLayouts": [],
    "externalSourceFiles": []
}

with open(os.path.join(PROJECT_DIR, "game.json"), "w", encoding="utf-8") as f:
    json.dump(project, f, indent=2)

print("1920x1080 GDevelop project generated successfully!")
