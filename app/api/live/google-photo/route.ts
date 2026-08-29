import { NextRequest, NextResponse } from "next/server";
import { getGooglePlacesApiKey } from "@/lib/live/google-places";

export const maxDuration = 30;

/** Proxy Google Places photos so the browser never needs the API key. */
export async function GET(request: NextRequest) {
  const name = request.nextUrl.searchParams.get("name");
  const key = getGooglePlacesApiKey();

  if (!name || !key) {
    return NextResponse.redirect(new URL("/listings/hotel-1.jpg", request.url));
  }

  const maxHeight = request.nextUrl.searchParams.get("h") || "800";
  const url = `https://places.googleapis.com/v1/${name}/media?maxHeightPx=${maxHeight}&skipHttpRedirect=false`;

  try {
    const res = await fetch(url, {
      headers: { "X-Goog-Api-Key": key },
      next: { revalidate: 86_400 },
    });

    if (!res.ok || !res.body) {
      return NextResponse.redirect(new URL("/listings/hotel-1.jpg", request.url));
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    return new NextResponse(res.body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.redirect(new URL("/listings/hotel-1.jpg", request.url));
  }
}
