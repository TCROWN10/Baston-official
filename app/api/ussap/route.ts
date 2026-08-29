import { NextResponse } from "next/server";
import { allSites } from "@/lib/ussap/data";
import { encodeGrid, decodeGrid, assertValidCode, normalizeCode } from "@/lib/ussap/geocode";

/** Cloud location API — encode, decode, and query the address registry. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const sector = searchParams.get("sector");

  if (lat && lng) {
    const la = Number(lat);
    const ln = Number(lng);
    const digital = encodeGrid(la, ln, 8);
    return NextResponse.json({
      code: digital,
      lat: la,
      lng: ln,
      decoded: decodeGrid(digital),
    });
  }

  if (code) {
    if (!assertValidCode(code)) {
      return NextResponse.json({ error: "Invalid digital address" }, { status: 400 });
    }
    const site = allSites().find(
      (s) => normalizeCode(s.code) === normalizeCode(code),
    );
    return NextResponse.json({
      code: normalizeCode(code),
      decoded: decodeGrid(code),
      site: site || null,
    });
  }

  let sites = allSites();
  if (sector) sites = sites.filter((s) => s.sector === sector);
  // Public payload only for unauthenticated API consumers
  sites = sites.filter((s) => s.sensitivity === "public");

  return NextResponse.json({
    count: sites.length,
    sites: sites.map((s) => ({
      code: s.code,
      label: s.label,
      sector: s.sector,
      lat: s.lat,
      lng: s.lng,
      city: s.city,
      state: s.state,
    })),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    pins?: { lat: number; lng: number; label: string; sector: string }[];
  };
  const synced =
    body.pins?.map((p) => ({
      ...p,
      code: encodeGrid(p.lat, p.lng, 8),
      syncedAt: new Date().toISOString(),
    })) || [];
  return NextResponse.json({ ok: true, synced: synced.length, items: synced });
}
