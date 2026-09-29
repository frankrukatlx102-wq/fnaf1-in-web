#!/usr/bin/env python3
"""
Fazbear Cryptographic Secure Vault (FCV-2) Manager
Provides HMAC-SHA256 signature verification and tamper detection for Five Nights at Maler.
"""
import sys
import os
import hmac
import hashlib
import base64
import json
import argparse
from datetime import datetime, timezone

SAVE_SALT = "FNAM_FAZBEAR_SECURITY_SALT_2026_ARCH_LINUX"
SAVE_SECRET = b"M4L3R_D4RK_S3CR3T_P1ZZ4_HMAC_K3Y_X992"
SAVE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".savedata")

def compute_checksum(night: int, stars: int) -> int:
    chk = (night * 31337 + stars * 7919) ^ 0xCAFEBABE
    # 32-bit signed integer representation matching JavaScript bitwise operators
    return (chk + 2**31) % 2**32 - 2**31

def create_vault_save(night: int, stars: int = 0, custom_unlocked: bool = False) -> str:
    nonce = hashlib.sha256(os.urandom(32)).hexdigest()[:20]
    checksum = compute_checksum(night, stars)
    payload = {
        "app": "FiveNightsAtMaler",
        "version": "2.0",
        "night": night,
        "stars": stars,
        "customUnlocked": custom_unlocked,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "nonce": nonce,
        "checksum": checksum
    }
    json_bytes = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    b64 = base64.b64encode(json_bytes).decode('ascii')
    msg = f"{SAVE_SALT}:{b64}:{nonce}".encode('utf-8')
    signature = hmac.new(SAVE_SECRET, msg, hashlib.sha256).hexdigest()
    
    vault_text = "\n".join([
        "-----BEGIN FAZBEAR SECURE VAULT-----",
        "FORMAT: FCV-2.0-HMAC-SHA256",
        f"NONCE: {nonce}",
        f"DATA: {b64}",
        f"SIGNATURE: {signature}",
        "-----END FAZBEAR SECURE VAULT-----"
    ])
    return vault_text

def verify_vault_save(vault_text: str):
    if not vault_text or "-----BEGIN FAZBEAR SECURE VAULT-----" not in vault_text:
        return False, "INVALID_HEADER_NON_SECURE_FORMAT", None
    
    nonce = ""
    data_b64 = ""
    signature = ""
    
    for line in vault_text.strip().splitlines():
        line = line.strip()
        if line.startswith("NONCE: "):
            nonce = line[7:].strip()
        elif line.startswith("DATA: "):
            data_b64 = line[6:].strip()
        elif line.startswith("SIGNATURE: "):
            signature = line[11:].strip()
            
    if not nonce or not data_b64 or not signature:
        return False, "MISSING_CRYPTOGRAPHIC_FIELDS", None
        
    msg = f"{SAVE_SALT}:{data_b64}:{nonce}".encode('utf-8')
    expected_sig = hmac.new(SAVE_SECRET, msg, hashlib.sha256).hexdigest()
    
    if not hmac.compare_digest(expected_sig.lower(), signature.lower()):
        return False, "TAMPER_DETECTED_HMAC_SIGNATURE_MISMATCH", None
        
    try:
        json_bytes = base64.b64decode(data_b64)
        payload = json.loads(json_bytes.decode('utf-8'))
        night = payload.get("night", 1)
        stars = payload.get("stars", 0)
        expected_chk = compute_checksum(night, stars)
        if payload.get("checksum") != expected_chk:
            return False, "CHECKSUM_INTEGRITY_COMPROMISED", None
        return True, "VALID", payload
    except Exception as e:
        return False, f"PAYLOAD_DECODING_ERROR: {e}", None

def main():
    parser = argparse.ArgumentParser(description="Fazbear Cryptographic Secure Save Manager")
    parser.add_argument("--read", action="store_true", help="Read and cryptographically verify .savedata")
    parser.add_argument("--set-night", type=int, help="Generate authenticated save for given night (1-7)")
    parser.add_argument("--stars", type=int, default=0, help="Stars count (0-3)")
    parser.add_argument("--custom", action="store_true", help="Unlock custom night")
    parser.add_argument("--output", type=str, default=SAVE_FILE, help="Path to save file")
    
    args = parser.parse_args()
    
    if args.set_night:
        vault = create_vault_save(args.set_night, args.stars, args.custom)
        with open(args.output, "w") as f:
            f.write(vault + "\n")
        print(f"[SECURITY] Generated signed cryptographic save for Night {args.set_night} (Stars: {args.stars}) -> {args.output}")
        print("[VAULT OUTPUT]:")
        print(vault)
        return

    # Default: read and verify
    if not os.path.exists(args.output):
        print(f"[INFO] Save file {args.output} does not exist. Initializing Night 1 default.")
        vault = create_vault_save(1, 0, False)
        with open(args.output, "w") as f:
            f.write(vault + "\n")
            
    with open(args.output, "r") as f:
        content = f.read()
        
    valid, reason, data = verify_vault_save(content)
    if valid:
        print("==================================================")
        print("       FAZBEAR VAULT: INTEGRITY VERIFIED          ")
        print("==================================================")
        print(f"Status:             AUTHENTIC & VALID")
        print(f"Current Night:      {data.get('night')}")
        print(f"Stars:              {data.get('stars')} ★")
        print(f"Custom Night:       {'UNLOCKED' if data.get('customUnlocked') else 'LOCKED'}")
        print(f"Timestamp:          {data.get('timestamp')}")
        print(f"Nonce:              {data.get('nonce')}")
        print(f"Checksum:           {data.get('checksum')}")
        print("==================================================")
    else:
        print("==================================================")
        print("       SECURITY ALERT: TAMPERING DETECTED!        ")
        print("==================================================")
        print(f"Status:             COMPROMISED / INVALID")
        print(f"Failure Reason:     {reason}")
        print("Action:             Data rejection & lockdown.")
        print("==================================================")
        sys.exit(1)

if __name__ == "__main__":
    main()
