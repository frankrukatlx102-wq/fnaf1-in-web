/**
 * Five Nights at Freddy's - Save Data & Integrity Manager
 * Uses transparent SHA-256 checksums to verify save file integrity and prevent corruption.
 */

// Pure JavaScript SHA-256 implementation
function sha256(ascii) {
  function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  var mathPow = Math.pow, maxWord = mathPow(2, 32), lengthProperty = 'length', i, j, result = '', words = [];
  var asciiBitLength = ascii[lengthProperty] * 8, hash = [], k = [], primeCounter = 0, isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength);
  for (j = 0; j < words[lengthProperty];) {
    var w = words.slice(j, j += 16), oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      var w15 = w[i - 15], w2 = w[i - 2];
      var s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      var s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      var ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      var maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      var temp1 = hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0);
      var temp2 = (rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj;
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      var b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

function createSavePayload(night, stars, customUnlocked) {
  const n = Math.max(1, Math.min(7, parseInt(night) || 1));
  const s = Math.max(0, Math.min(3, parseInt(stars) || 0));
  const cu = Boolean(customUnlocked || s >= 2 || n >= 7);

  return {
    app: "FiveNightsAtFreddys",
    version: "1.0",
    night: n,
    stars: s,
    customUnlocked: cu,
    timestamp: new Date().toISOString()
  };
}

function createSaveEnvelope(night, stars, customUnlocked) {
  const payload = createSavePayload(night, stars, customUnlocked);
  const jsonStr = JSON.stringify(payload);
  const b64 = btoa(unescape(encodeURIComponent(jsonStr)));
  const checksum = sha256(b64);

  return [
    "-----BEGIN FAZBEAR SAVE DATA-----",
    "FORMAT: FSV-1.0-SHA256",
    "DATA: " + b64,
    "CHECKSUM: " + checksum,
    "-----END FAZBEAR SAVE DATA-----"
  ].join("\n");
}

// Backward compatibility alias
const createVaultSave = createSaveEnvelope;

function verifySaveEnvelope(saveStr) {
  if (!saveStr || typeof saveStr !== 'string') {
    return { valid: false, reason: "EMPTY_OR_NON_STRING" };
  }

  const isNew = saveStr.includes("-----BEGIN FAZBEAR SAVE DATA-----");
  const isLegacy = saveStr.includes("-----BEGIN FAZBEAR SECURE VAULT-----");

  if (!isNew && !isLegacy) {
    return { valid: false, reason: "INVALID_HEADER_UNKNOWN_FORMAT" };
  }

  const lines = saveStr.trim().split("\n");
  let b64 = "", checksum = "";

  for (const line of lines) {
    const l = line.trim();
    if (l.startsWith("DATA: ")) b64 = l.substring(6).trim();
    if (l.startsWith("CHECKSUM: ")) checksum = l.substring(10).trim();
    if (l.startsWith("SIGNATURE: ") && !checksum) checksum = l.substring(11).trim();
  }

  if (!b64) {
    return { valid: false, reason: "MISSING_DATA_FIELD" };
  }

  if (isNew) {
    if (!checksum) {
      return { valid: false, reason: "MISSING_CHECKSUM" };
    }
    const expectedChk = sha256(b64);
    if (expectedChk.toLowerCase() !== checksum.toLowerCase()) {
      return { valid: false, reason: "CHECKSUM_INTEGRITY_MISMATCH" };
    }
  }

  try {
    const jsonStr = decodeURIComponent(escape(atob(b64)));
    const obj = JSON.parse(jsonStr);
    const night = Math.max(1, Math.min(7, parseInt(obj.night) || 1));
    const stars = Math.max(0, Math.min(3, parseInt(obj.stars) || 0));
    const customUnlocked = Boolean(obj.customUnlocked || stars >= 2 || night >= 7);

    return {
      valid: true,
      data: {
        app: obj.app || "FiveNightsAtFreddys",
        version: obj.version || "1.0",
        night: night,
        stars: stars,
        customUnlocked: customUnlocked,
        timestamp: obj.timestamp || new Date().toISOString()
      }
    };
  } catch (e) {
    return { valid: false, reason: "PAYLOAD_DECODING_ERROR" };
  }
}

// Backward compatibility alias
const verifyVaultSave = verifySaveEnvelope;

function loadGameSave() {
  const stored = localStorage.getItem("fnaf_save_data") || localStorage.getItem("fnam_secure_save");
  if (!stored) {
    saveGameProgress(1, 0, false);
    return { night: 1, stars: 0, customUnlocked: false };
  }

  const res = verifySaveEnvelope(stored);
  if (!res.valid) {
    console.warn("[FAZBEAR SAVE] Integrity check failed:", res.reason);
    console.warn("[FAZBEAR SAVE] Corrupted save reset to Night 1.");
    saveGameProgress(1, 0, false);
    return { night: 1, stars: 0, customUnlocked: false, corrupted: true };
  }

  return res.data;
}

function saveGameProgress(night, stars, customUnlocked) {
  const envelope = createSaveEnvelope(night, stars, customUnlocked);
  localStorage.setItem("fnaf_save_data", envelope);
  localStorage.setItem("fnam_secure_save", envelope);

  try {
    fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: envelope
    }).catch(() => {});
  } catch (e) {}
}

function syncBackendSave() {
  try {
    fetch('/api/save')
      .then(r => r.text())
      .then(txt => {
        const v = verifySaveEnvelope(txt);
        if (v.valid && typeof G !== 'undefined' && G.saveData) {
          const localData = G.saveData;
          if (v.data.night > localData.night || v.data.stars > localData.stars) {
            localStorage.setItem("fnaf_save_data", txt);
            localStorage.setItem("fnam_secure_save", txt);
            G.saveData = v.data;
            G.currentNight = v.data.night;
          }
        }
      }).catch(() => {});
  } catch (e) {}
}
