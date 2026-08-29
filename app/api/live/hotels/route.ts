import { NextRequest, NextResponse } from "next/server";
import { HOTELS } from "@/lib/civic/directory";
import type { HotelRecord } from "@/lib/civic/types";
import {
  readHotelCache,
  readStaleHotelCache,
  writeHotelCache,
} from "@/lib/live/cache";
import { fetchLiveHotelsNationwide } from "@/lib/live/osm";
import { dedupeHotels, osmToHotel } from "@/lib/live/transform";

export const maxDuration = 300;

async function loadHotels(refresh: boolean): Promise<{
  data: HotelRecord[];
  source: string;
  liveCount: number;
}> {
  if (!refresh) {
    const cached = readHotelCache();
    if (cached?.length) {
      return {
        data: cached,
        source: "cache",
        liveCount: cached.filter((h) => h.live).length,
      };
    }
  }

  try {
    const elements = await fetchLiveHotelsNationwide(45);
    const live = elements
      .map((el) => osmToHotel(el, el.tags?._queryState))
      .filter(Boolean) as HotelRecord[];
    const merged = dedupeHotels([
      ...live,
      ...HOTELS.filter((h) => h.source === "registry"),
    ]);
    writeHotelCache(merged);
    return { data: merged, source: "openstreetmap", liveCount: live.length };
  } catch {
    const stale = readStaleHotelCache();
    if (stale?.length) {
      return {
        data: stale,
        source: "stale-cache",
        liveCount: stale.filter((h) => h.live).length,
      };
    }
    return { data: HOTELS, source: "local", liveCount: 0 };
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const refresh = request.nextUrl.searchParams.get("refresh") === "1";
  const state = request.nextUrl.searchParams.get("state") || "";

  const { data, source, liveCount } = await loadHotels(refresh);

  if (id) {
    const hit = data.find((h) => h.id === id || h.slug === id);
    if (!hit) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }
    return NextResponse.json({ source, hotel: hit });
  }

  const filtered = state ? data.filter((h) => h.state === state) : data;

  return NextResponse.json({
    source,
    liveCount,
    count: filtered.length,
    data: filtered,
    provider: "openstreetmap",
  });
}
