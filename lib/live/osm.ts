import { PRIORITY_STATES, STATE_ISO, inferStateFromTags } from "./nigeria-states";

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

export type OsmElement = {
  id: number;
  type: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

export async function overpassQuery(query: string, timeoutMs = 120_000): Promise<OsmElement[]> {
  let lastError: Error | null = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "USSAP-LiveDirectory/1.0 (Nigeria hotels & properties)",
        },
        body: new URLSearchParams({ data: query }),
        signal: controller.signal,
        next: { revalidate: 21_600 },
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`Overpass ${res.status}`);
      const json = (await res.json()) as { elements?: OsmElement[] };
      return json.elements ?? [];
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }
  throw lastError ?? new Error("Overpass unavailable");
}

function coords(el: OsmElement): { lat: number; lon: number } | null {
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (lat == null || lon == null) return null;
  return { lat, lon };
}

export async function fetchLiveHotelsNationwide(limitPerState = 40): Promise<OsmElement[]> {
  const batches: string[][] = [];
  for (let i = 0; i < PRIORITY_STATES.length; i += 4) {
    batches.push(PRIORITY_STATES.slice(i, i + 4));
  }

  const all: OsmElement[] = [];
  const seen = new Set<number>();

  for (const batch of batches) {
    const results = await Promise.all(
      batch.map(async (state) => {
        const iso = STATE_ISO[state];
        if (!iso) return [] as OsmElement[];
        const query = `[out:json][timeout:55];
area["ISO3166-2"="${iso}"]->.a;
(
  nwr["tourism"~"hotel|guest_house|motel|hostel"](area.a);
);
out center tags ${limitPerState};`;
        try {
          return await overpassQuery(query, 70_000);
        } catch {
          return [] as OsmElement[];
        }
      }),
    );
    for (let i = 0; i < results.length; i++) {
      const state = batch[i];
      for (const el of results[i]) {
        if (!el.tags?.name || seen.has(el.id)) continue;
        seen.add(el.id);
        all.push({ ...el, tags: { ...el.tags, _queryState: state } });
      }
    }
    await sleep(1200);
  }

  return all;
}

export async function fetchLivePropertiesNationwide(limitPerState = 35): Promise<OsmElement[]> {
  const batches: string[][] = [];
  for (let i = 0; i < PRIORITY_STATES.length; i += 4) {
    batches.push(PRIORITY_STATES.slice(i, i + 4));
  }

  const all: OsmElement[] = [];
  const seen = new Set<number>();

  for (const batch of batches) {
    const results = await Promise.all(
      batch.map(async (state) => {
        const iso = STATE_ISO[state];
        if (!iso) return [] as OsmElement[];
        const query = `[out:json][timeout:55];
area["ISO3166-2"="${iso}"]->.a;
(
  nwr["tourism"~"apartment|guest_house|chalet|hotel"](area.a);
  nwr["building"~"apartment|residential|house|detached|terrace|bungalow"]["name"](area.a);
  nwr["landuse"="residential"]["name"](area.a);
);
out center tags ${limitPerState};`;
        try {
          return await overpassQuery(query, 70_000);
        } catch {
          return [] as OsmElement[];
        }
      }),
    );
    for (let i = 0; i < results.length; i++) {
      const state = batch[i];
      for (const el of results[i]) {
        if (!el.tags?.name || seen.has(el.id)) continue;
        seen.add(el.id);
        all.push({
          ...el,
          tags: { ...el.tags, _queryState: state },
        });
      }
    }
    await sleep(1200);
  }

  return all;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export { coords, inferStateFromTags };
