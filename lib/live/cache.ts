import type { HotelRecord } from "@/lib/civic/types";
import type { Property } from "@/lib/types";

const TTL_MS = 6 * 60 * 60 * 1000;

type Entry<T> = { data: T; fetchedAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __liveDataCache:
    | {
        hotels?: Entry<HotelRecord[]>;
        properties?: Entry<Property[]>;
      }
    | undefined;
}

function store() {
  if (!globalThis.__liveDataCache) globalThis.__liveDataCache = {};
  return globalThis.__liveDataCache;
}

export function readHotelCache(): HotelRecord[] | null {
  const entry = store().hotels;
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > TTL_MS) return null;
  return entry.data;
}

export function writeHotelCache(data: HotelRecord[]) {
  store().hotels = { data, fetchedAt: Date.now() };
}

export function readStaleHotelCache(): HotelRecord[] | null {
  return store().hotels?.data ?? null;
}

export function readPropertyCache(): Property[] | null {
  const entry = store().properties;
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > TTL_MS) return null;
  return entry.data;
}

export function writePropertyCache(data: Property[]) {
  store().properties = { data, fetchedAt: Date.now() };
}

export function readStalePropertyCache(): Property[] | null {
  return store().properties?.data ?? null;
}
