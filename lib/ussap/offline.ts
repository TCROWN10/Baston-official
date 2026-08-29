"use client";

import type { OfflinePin, SectorKind } from "./types";
import { encodeGrid } from "./geocode";

const PINS_KEY = "ussap_offline_pins";
const QUEUE_KEY = "ussap_sync_queue";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Drop a pin offline — works without connectivity; syncs later. */
export function dropOfflinePin(input: {
  lat: number;
  lng: number;
  label: string;
  sector: SectorKind;
  notes?: string;
  mediaDataUrls?: string[];
}): OfflinePin {
  const pin: OfflinePin = {
    id: `pin_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    lat: input.lat,
    lng: input.lng,
    code: encodeGrid(input.lat, input.lng, 8),
    label: input.label,
    sector: input.sector,
    notes: input.notes,
    mediaDataUrls: input.mediaDataUrls,
    createdAt: new Date().toISOString(),
    synced: false,
  };
  const pins = read<OfflinePin[]>(PINS_KEY, []);
  pins.unshift(pin);
  write(PINS_KEY, pins);
  const queue = read<string[]>(QUEUE_KEY, []);
  queue.push(pin.id);
  write(QUEUE_KEY, queue);
  return pin;
}

export function listOfflinePins(): OfflinePin[] {
  return read<OfflinePin[]>(PINS_KEY, []);
}

export function getCachedAddresses(): OfflinePin[] {
  return listOfflinePins();
}

/** Mark pins synced when back online (demo: local flag + optional callback payload). */
export async function syncOfflinePins(): Promise<{ synced: number; failed: number }> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { synced: 0, failed: listOfflinePins().filter((p) => !p.synced).length };
  }
  const pins = listOfflinePins().filter((p) => !p.synced);
  try {
    await fetch("/api/ussap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pins: pins.map((p) => ({
          lat: p.lat,
          lng: p.lng,
          label: p.label,
          sector: p.sector,
        })),
      }),
    });
  } catch {
    return { synced: 0, failed: pins.length };
  }
  const all = listOfflinePins().map((p) => ({ ...p, synced: true }));
  write(PINS_KEY, all);
  write(QUEUE_KEY, []);
  return { synced: pins.length, failed: 0 };
}

export function clearSyncedPins() {
  write(
    PINS_KEY,
    listOfflinePins().filter((p) => !p.synced),
  );
}
