// Expo App entry stub — replace after `npx create-expo-app`.
// Shared algorithm: copy lib/ussap/geocode.ts into the mobile bundle.

import { encodeGrid, formatCode } from "../lib/ussap/geocode";

type OfflinePin = {
  id: string;
  lat: number;
  lng: number;
  code: string;
  label: string;
  synced: boolean;
};

const vault: OfflinePin[] = [];

/** Field agent: capture GPS and mint a USSAP digital address offline. */
export function dropPinOffline(lat: number, lng: number, label: string): OfflinePin {
  const pin: OfflinePin = {
    id: `m_${Date.now()}`,
    lat,
    lng,
    code: encodeGrid(lat, lng, 8),
    label,
    synced: false,
  };
  vault.unshift(pin);
  return pin;
}

export function listPins() {
  return vault.map((p) => ({ ...p, display: formatCode(p.code) }));
}

export async function syncWhenOnline(push: (pins: OfflinePin[]) => Promise<void>) {
  const pending = vault.filter((p) => !p.synced);
  if (!pending.length) return 0;
  await push(pending);
  for (const p of pending) p.synced = true;
  return pending.length;
}
