import { NextRequest, NextResponse } from "next/server";
import { COMPANIES, HOTELS, NIGERIA_STATES, SCHOOLS } from "@/lib/civic/directory";

type Kind = "hotel" | "school" | "company";

const OVERPASS = "https://overpass-api.de/api/interpreter";

const STATE_ISO: Record<string, string> = {
  Lagos: "NG-LA",
  FCT: "NG-FC",
  Kano: "NG-KN",
  Rivers: "NG-RI",
  Oyo: "NG-OY",
  Kaduna: "NG-KD",
  Edo: "NG-ED",
  Enugu: "NG-EN",
  Ogun: "NG-OG",
  Anambra: "NG-AN",
};

function filters(kind: Kind) {
  if (kind === "hotel") return 'nwr["tourism"~"hotel|guest_house|motel"](area.a);';
  if (kind === "school") return 'nwr["amenity"~"school|university|college"](area.a);';
  return 'nwr["office"](area.a); nwr["amenity"="bank"](area.a);';
}

export async function GET(request: NextRequest) {
  const kind = (request.nextUrl.searchParams.get("type") || "hotel") as Kind;
  const state = request.nextUrl.searchParams.get("state") || "";
  const live = request.nextUrl.searchParams.get("live") === "1";

  const local =
    kind === "hotel" ? HOTELS : kind === "school" ? SCHOOLS : COMPANIES;
  const filtered = state ? local.filter((row) => row.state === state) : local;

  if (!live) {
    return NextResponse.json({
      source: "cache",
      count: filtered.length,
      states: NIGERIA_STATES,
      data: filtered,
    });
  }

  const iso = STATE_ISO[state];
  if (!iso) {
    return NextResponse.json({
      source: "cache",
      note: "Live fetch is available for major mapped states. Showing the national cache.",
      count: filtered.length,
      data: filtered,
    });
  }

  const query = `[out:json][timeout:40];
area["ISO3166-2"="${iso}"]->.a;
(${filters(kind)});
out center tags 60;`;

  try {
    const res = await fetch(OVERPASS, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ data: query }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`Overpass ${res.status}`);
    const json = (await res.json()) as {
      elements: Array<{
        id: number;
        lat?: number;
        lon?: number;
        center?: { lat: number; lon: number };
        tags?: Record<string, string>;
      }>;
    };
    const data = json.elements
      .filter((el) => el.tags?.name)
      .map((el) => ({
        id: `${kind}-live-${el.id}`,
        source: "openstreetmap",
        osmId: el.id,
        name: el.tags!.name,
        city: el.tags!["addr:city"] || el.tags!["addr:suburb"] || state,
        state,
        address: el.tags!["addr:full"] || el.tags!["addr:street"] || `${state}, Nigeria`,
        lat: el.lat ?? el.center?.lat,
        lon: el.lon ?? el.center?.lon,
        live: true,
      }));
    return NextResponse.json({ source: "openstreetmap", count: data.length, data });
  } catch {
    return NextResponse.json({
      source: "cache",
      note: "Live map service was busy. Showing the verified national cache.",
      count: filtered.length,
      data: filtered,
    });
  }
}
