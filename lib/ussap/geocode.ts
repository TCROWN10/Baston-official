/**
 * USSAP Precision Geocoding — Open Location Code–style 6–8 char grid codes.
 * Paired always with GPS latitude / longitude.
 */

const ALPHABET = "23456789CFGHJMPQRVWX";
const BASE = ALPHABET.length; // 20
const LAT_MAX = 90;
const LNG_MAX = 180;

function clip(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Encode lat/lng to a short alphanumeric digital address (length 6 or 8). */
export function encodeGrid(lat: number, lng: number, codeLength: 6 | 8 = 8): string {
  let latitude = clip(lat, -LAT_MAX, LAT_MAX);
  let longitude = clip(lng, -LNG_MAX, LNG_MAX);
  // Avoid pole overflow
  if (latitude === 90) latitude -= 1e-10;

  let latVal = latitude + LAT_MAX;
  let lngVal = longitude + LNG_MAX;

  let code = "";
  let latRange = LAT_MAX * 2;
  let lngRange = LNG_MAX * 2;

  for (let i = 0; i < codeLength; ) {
    latRange /= BASE;
    lngRange /= BASE;
    const latDigit = Math.min(BASE - 1, Math.floor(latVal / latRange));
    const lngDigit = Math.min(BASE - 1, Math.floor(lngVal / lngRange));
    latVal -= latDigit * latRange;
    lngVal -= lngDigit * lngRange;
    code += ALPHABET[latDigit] + ALPHABET[lngDigit];
    i += 2;
  }

  return formatCode(code);
}

/** Format as XXXX-XXXX (8) or XXX-XXX (6). */
export function formatCode(raw: string): string {
  const clean = raw.replace(/[^0-9A-Z]/gi, "").toUpperCase();
  if (clean.length <= 6) {
    return `${clean.slice(0, 3)}-${clean.slice(3)}`;
  }
  return `${clean.slice(0, 4)}-${clean.slice(4, 8)}`;
}

export function normalizeCode(code: string): string {
  return code.replace(/[^0-9A-Z]/gi, "").toUpperCase();
}

/** Decode grid code back to approximate centre lat/lng. */
export function decodeGrid(code: string): { lat: number; lng: number; precisionM: number } {
  const clean = normalizeCode(code);
  if (clean.length < 6 || clean.length % 2 !== 0) {
    throw new Error("Invalid USSAP digital address");
  }

  let latVal = 0;
  let lngVal = 0;
  let latRange = LAT_MAX * 2;
  let lngRange = LNG_MAX * 2;

  for (let i = 0; i < clean.length; i += 2) {
    const latDigit = ALPHABET.indexOf(clean[i]);
    const lngDigit = ALPHABET.indexOf(clean[i + 1]);
    if (latDigit < 0 || lngDigit < 0) throw new Error("Invalid characters in digital address");
    latRange /= BASE;
    lngRange /= BASE;
    latVal += latDigit * latRange;
    lngVal += lngDigit * lngRange;
  }

  const lat = latVal + latRange / 2 - LAT_MAX;
  const lng = lngVal + lngRange / 2 - LNG_MAX;
  // Rough ground resolution near equator for half-cell
  const precisionM = latRange * 111_320;
  return { lat, lng, precisionM };
}

export function assertValidCode(code: string): boolean {
  const clean = normalizeCode(code);
  return (clean.length === 6 || clean.length === 8) && [...clean].every((c) => ALPHABET.includes(c));
}

/** Human-readable share string */
export function shareAddress(code: string, label?: string): string {
  const formatted = formatCode(normalizeCode(code));
  return label ? `${label} · USSAP ${formatted}` : `USSAP ${formatted}`;
}
