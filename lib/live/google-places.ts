/** Major Nigerian city hubs for Google Places searches. */
export const GOOGLE_CITY_HUBS = [
  { state: "Lagos", city: "Lagos", lat: 6.5244, lng: 3.3792 },
  { state: "Lagos", city: "Lekki", lat: 6.4698, lng: 3.5852 },
  { state: "Lagos", city: "Ikeja", lat: 6.6018, lng: 3.3515 },
  { state: "Lagos", city: "Victoria Island", lat: 6.4281, lng: 3.4219 },
  { state: "FCT", city: "Abuja", lat: 9.0765, lng: 7.3986 },
  { state: "Rivers", city: "Port Harcourt", lat: 4.8156, lng: 7.0498 },
  { state: "Oyo", city: "Ibadan", lat: 7.3775, lng: 3.947 },
  { state: "Kano", city: "Kano", lat: 12.0022, lng: 8.592 },
  { state: "Kaduna", city: "Kaduna", lat: 10.5105, lng: 7.4165 },
  { state: "Edo", city: "Benin City", lat: 6.335, lng: 5.6037 },
  { state: "Delta", city: "Warri", lat: 5.516, lng: 5.75 },
  { state: "Ogun", city: "Abeokuta", lat: 7.1475, lng: 3.3619 },
  { state: "Enugu", city: "Enugu", lat: 6.4584, lng: 7.5464 },
  { state: "Anambra", city: "Awka", lat: 6.2104, lng: 7.074 },
  { state: "Imo", city: "Owerri", lat: 5.484, lng: 7.035 },
  { state: "Abia", city: "Umuahia", lat: 5.532, lng: 7.486 },
  { state: "Akwa Ibom", city: "Uyo", lat: 5.0377, lng: 7.9128 },
  { state: "Cross River", city: "Calabar", lat: 4.9757, lng: 8.3417 },
  { state: "Kwara", city: "Ilorin", lat: 8.4799, lng: 4.5418 },
  { state: "Plateau", city: "Jos", lat: 9.8965, lng: 8.8583 },
  { state: "Ondo", city: "Akure", lat: 7.2571, lng: 5.2058 },
  { state: "Osun", city: "Osogbo", lat: 7.7827, lng: 4.5418 },
  { state: "Ekiti", city: "Ado Ekiti", lat: 7.6233, lng: 5.2209 },
  { state: "Benue", city: "Makurdi", lat: 7.7322, lng: 8.5391 },
] as const;

export type GooglePlace = {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  types?: string[];
  rating?: number;
  userRatingCount?: number;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  googleMapsUri?: string;
  businessStatus?: string;
  priceLevel?: string;
  photos?: { name: string; widthPx?: number; heightPx?: number }[];
  primaryType?: string;
};

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.location",
  "places.types",
  "places.rating",
  "places.userRatingCount",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.googleMapsUri",
  "places.businessStatus",
  "places.priceLevel",
  "places.photos",
  "places.primaryType",
].join(",");

export function getGooglePlacesApiKey(): string | null {
  return (
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    null
  );
}

export function hasGooglePlacesKey(): boolean {
  return Boolean(getGooglePlacesApiKey());
}

async function searchText(
  textQuery: string,
  center: { lat: number; lng: number },
  includedType?: string,
): Promise<GooglePlace[]> {
  const key = getGooglePlacesApiKey();
  if (!key) throw new Error("GOOGLE_PLACES_API_KEY is not set");

  const body: Record<string, unknown> = {
    textQuery,
    languageCode: "en",
    regionCode: "NG",
    pageSize: 20,
    locationBias: {
      circle: {
        center: { latitude: center.lat, longitude: center.lng },
        radius: 40000,
      },
    },
  };
  if (includedType) body.includedType = includedType;

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
    next: { revalidate: 21_600 },
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Google Places ${res.status}: ${errText.slice(0, 240)}`);
  }

  const json = (await res.json()) as { places?: GooglePlace[] };
  return json.places ?? [];
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Hotels / lodging listed on Google across Nigerian hubs. */
export async function fetchGoogleHotelsNationwide(): Promise<
  { place: GooglePlace; state: string; city: string }[]
> {
  const out: { place: GooglePlace; state: string; city: string }[] = [];
  const seen = new Set<string>();

  for (const hub of GOOGLE_CITY_HUBS) {
    for (const q of [`hotels in ${hub.city} Nigeria`, `guest house in ${hub.city} Nigeria`]) {
      try {
        const places = await searchText(q, hub, "lodging");
        for (const place of places) {
          if (!place.id || seen.has(place.id) || !place.displayName?.text) continue;
          if (place.businessStatus && place.businessStatus !== "OPERATIONAL") continue;
          seen.add(place.id);
          out.push({ place, state: hub.state, city: hub.city });
        }
      } catch {
        // continue other hubs
      }
      await sleep(80);
    }
  }

  return out;
}

/** Apartments / short-lets / rentals listed on Google. */
export async function fetchGooglePropertiesNationwide(): Promise<
  { place: GooglePlace; state: string; city: string; query: string }[]
> {
  const queries = [
    "hotels",
    "apartment for rent",
    "serviced apartment",
    "short let apartment",
    "guest house",
    "real estate for sale",
  ];
  const out: { place: GooglePlace; state: string; city: string; query: string }[] = [];
  const seen = new Set<string>();
  const hubs = GOOGLE_CITY_HUBS;

  for (const hub of hubs) {
    for (const q of queries) {
      try {
        const places = await searchText(`${q} in ${hub.city} Nigeria`, hub);
        for (const place of places) {
          if (!place.id || seen.has(place.id) || !place.displayName?.text) continue;
          if (place.businessStatus && place.businessStatus !== "OPERATIONAL") continue;
          seen.add(place.id);
          out.push({ place, state: hub.state, city: hub.city, query: q });
        }
      } catch {
        // continue
      }
      await sleep(70);
    }
  }

  return out;
}

export function googlePhotoProxyUrl(photoName?: string): string | null {
  if (!photoName) return null;
  return `/api/live/google-photo?name=${encodeURIComponent(photoName)}`;
}
