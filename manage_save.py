#!/usr/bin/env python3
"""
Fazbear Save Data Integrity Manager
Provides SHA-256 data integrity verification and corruption detection for Five Nights at Freddy's.
Save files are stored with a transparent SHA-256 checksum to prevent accidental file corruption
and incomplete writes while keeping the format open, inspectable, and editable.
"""
import sys
import os
import hashlib
import base64
import json
import argparse
from datetime import datetime, timezone

SAVE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".savedata")

def compute_checksum(data_str: str) -> str:
    """Compute SHA-256 checksum of base64 data string."""
    return hashlib.sha256(data_str.encode('ascii')).hexdigest()

def create_save_data(night: int, stars: int = 0, custom_unlocked: bool = False) -> str:
    """Generate a clean, checksummed save data envelope."""
    n = max(1, min(7, int(night)))
    s = max(0, min(3, int(stars)))
    cu = bool(custom_unlocked or s >= 2 or n >= 7)

    payload = {
        "app": "FiveNightsAtFreddys",
        "version": "1.0",
        "night": n,
        "stars": s,
        "customUnlocked": cu,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

    json_bytes = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    b64 = base64.b64encode(json_bytes).decode('ascii')
    checksum = compute_checksum(b64)

    envelope = "\n".join([
        "-----BEGIN FAZBEAR SAVE DATA-----",
        "FORMAT: FSV-1.0-SHA256",
        f"DATA: {b64}",
        f"CHECKSUM: {checksum}",
        "-----END FAZBEAR SAVE DATA-----"
    ])
    return envelope

# Backward compatibility alias
create_vault_save = create_save_data

def verify_save_data(save_text: str):
    """Verify integrity of save data envelope and parse payload."""
    if not save_text or not isinstance(save_text, str):
        return False, "EMPTY_OR_NON_STRING", None

    # Support current envelope and legacy vault format for compatibility
    is_new = "-----BEGIN FAZBEAR SAVE DATA-----" in save_text
    is_legacy = "-----BEGIN FAZBEAR SECURE VAULT-----" in save_text

    if not is_new and not is_legacy:
        return False, "INVALID_HEADER_UNKNOWN_FORMAT", None

    data_b64 = ""
    checksum = ""

    for line in save_text.strip().splitlines():
        line = line.strip()
        if line.startswith("DATA: "):
            data_b64 = line[6:].strip()
        elif line.startswith("CHECKSUM: "):
            checksum = line[10:].strip()
        elif line.startswith("SIGNATURE: ") and not checksum:
            checksum = line[11:].strip()

    if not data_b64:
        return False, "MISSING_DATA_FIELD", None

    # If new format, verify SHA-256 checksum
    if is_new:
        if not checksum:
            return False, "MISSING_CHECKSUM", None
        expected_chk = compute_checksum(data_b64)
        if expected_chk.lower() != checksum.lower():
            return False, "CHECKSUM_INTEGRITY_MISMATCH", None

    try:
        json_bytes = base64.b64decode(data_b64)
        payload = json.loads(json_bytes.decode('utf-8'))
        night = int(payload.get("night", 1))
        stars = int(payload.get("stars", 0))
        custom_unlocked = bool(payload.get("customUnlocked", False))

        normalized = {
            "app": payload.get("app", "FiveNightsAtFreddys"),
            "version": payload.get("version", "1.0"),
            "night": max(1, min(7, night)),
            "stars": max(0, min(3, stars)),
            "customUnlocked": custom_unlocked,
            "timestamp": payload.get("timestamp", datetime.now(timezone.utc).isoformat())
        }
        return True, "VALID", normalized
    except Exception as e:
        return False, f"PAYLOAD_DECODING_ERROR: {e}", None

# Backward compatibility alias
verify_vault_save = verify_save_data

def main():
    parser = argparse.ArgumentParser(description="Fazbear Save Data Integrity Manager")
    parser.add_argument("--read", action="store_true", help="Read and verify .savedata integrity")
    parser.add_argument("--set-night", type=int, help="Generate save for given night (1-7)")
    parser.add_argument("--stars", type=int, default=0, help="Stars count (0-3)")
    parser.add_argument("--custom", action="store_true", help="Unlock custom night")
    parser.add_argument("--output", type=str, default=SAVE_FILE, help="Path to save file")

    args = parser.parse_args()

    if args.set_night:
        save_envelope = create_save_data(args.set_night, args.stars, args.custom)
        with open(args.output, "w") as f:
            f.write(save_envelope + "\n")
        print(f"[SAVE] Generated verified save for Night {args.set_night} (Stars: {args.stars}) -> {args.output}")
        print("[ENVELOPE OUTPUT]:")
        print(save_envelope)
        return

    # Default: read and verify
    if not os.path.exists(args.output):
        print(f"[INFO] Save file {args.output} does not exist. Initializing Night 1 default.")
        save_envelope = create_save_data(1, 0, False)
        with open(args.output, "w") as f:
            f.write(save_envelope + "\n")

    with open(args.output, "r") as f:
        content = f.read()

    if valid:
        print(f"Fazbear Save: Verified authentic")
        print(f"Current Night: {data.get('night')}")
        print(f"Stars: {data.get('stars')} ★")
        print(f"Custom Night: {'Unlocked' if data.get('customUnlocked') else 'Locked'}")
        print(f"Timestamp: {data.get('timestamp')}")
    else:
        print(f"Integrity alert: Save data invalid or corrupted")
        print(f"Reason: {reason}")
        print("Reset recommended.")
        sys.exit(1)

if __name__ == "__main__":
    main()
