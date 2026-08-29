import { NextRequest, NextResponse } from "next/server";
import { PROPERTIES } from "@/lib/data";
import { withPropertyCompliance } from "@/lib/listings";
import type { Property } from "@/lib/types";
import {
  readPropertyCache,
  readStalePropertyCache,
  writePropertyCache,
} from "@/lib/live/cache";
import { fetchLivePropertiesNationwide } from "@/lib/live/osm";
import { dedupeProperties, osmToProperty } from "@/lib/live/transform";

export const maxDuration = 300;

async function loadProperties(refresh: boolean): Promise<{
  data: Property[];
  source: string;
  liveCount: number;
}> {
  if (!refresh) {
    const cached = readPropertyCache();
    if (cached?.length) {
      return {
        data: cached,
        source: "cache",
        liveCount: cached.filter((p) => p.live).length,
      };
    }
  }

  try {
    const elements = await fetchLivePropertiesNationwide(40);
    const live = elements
      .map((el) => osmToProperty(el, el.tags?._queryState))
      .filter(Boolean) as Property[];
    const merged = dedupeProperties([...live, ...PROPERTIES]);
    writePropertyCache(merged);
    return { data: merged, source: "openstreetmap", liveCount: live.length };
  } catch {
    const stale = readStalePropertyCache();
    if (stale?.length) {
      return {
        data: stale,
        source: "stale-cache",
        liveCount: stale.filter((p) => p.live).length,
      };
    }
    return { data: PROPERTIES, source: "local", liveCount: 0 };
  }
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  const refresh = request.nextUrl.searchParams.get("refresh") === "1";
  const tab = request.nextUrl.searchParams.get("tab") as "buy" | "rent" | "shortlet" | null;

  const { data: raw, source, liveCount } = await loadProperties(refresh);
  const data = raw.map(withPropertyCompliance);

  if (id) {
    const hit = data.find((p) => p.id === id || p.slug === id);
    if (!hit) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    return NextResponse.json({ source, property: hit });
  }

  let filtered = data;
  if (tab === "buy") filtered = data.filter((p) => p.listingCategory === "Buy");
  if (tab === "rent") filtered = data.filter((p) => p.listingCategory === "Rent");
  if (tab === "shortlet") filtered = data.filter((p) => p.listingCategory === "Shortlet");

  return NextResponse.json({
    source,
    liveCount,
    count: filtered.length,
    data: filtered,
    provider: "openstreetmap",
  });
}
