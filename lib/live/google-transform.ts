import type { HotelRecord } from "@/lib/civic/types";
import type { ListingCategory, Property, PropertyType } from "@/lib/types";
import { type GooglePlace, googlePhotoProxyUrl } from "./google-places";

const HOTEL_FALLBACKS = [
  "/listings/hotel-1.jpg",
  "/listings/hotel-2.jpg",
  "/listings/hotel-3.jpg",
  "/listings/hotel-4.jpg",
  "/listings/hotel-5.jpg",
  "/listings/hotel-6.jpg",
];

const STAY_FALLBACKS = [
  "/listings/stay-1.jpg",
  "/listings/stay-2.jpg",
  "/listings/stay-3.jpg",
  "/listings/stay-4.jpg",
];

function slugify(name: string, id: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  const short = id.replace(/[^a-zA-Z0-9]/g, "").slice(-8) || "g";
  return `${base || "place"}-${short}`;
}

function pick<T>(seed: string, arr: T[]): T {
  let n = 0;
  for (let i = 0; i < seed.length; i++) n += seed.charCodeAt(i);
  return arr[Math.abs(n) % arr.length];
}

function placeImages(place: GooglePlace, fallbacks: string[]): string[] {
  const photos = (place.photos ?? [])
    .slice(0, 4)
    .map((p) => googlePhotoProxyUrl(p.name))
    .filter(Boolean) as string[];
  if (photos.length) return photos;
  return [pick(place.id, fallbacks), pick(`${place.id}-b`, fallbacks)];
}

function parseCityState(address: string | undefined, fallbackCity: string, fallbackState: string) {
  if (!address) {
    return {
      city: fallbackCity,
      state: fallbackState,
      address: `${fallbackCity}, ${fallbackState}, Nigeria`,
    };
  }
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  const city = parts.length >= 2 ? parts[parts.length - 3] || parts[0] : fallbackCity;
  const stateGuess = parts.length >= 2 ? parts[parts.length - 2] : fallbackState;
  return {
    city: city || fallbackCity,
    state: /nigeria/i.test(stateGuess) ? fallbackState : stateGuess || fallbackState,
    address,
  };
}

function priceFromGoogle(place: GooglePlace, kind: "hotel" | "property", category?: ListingCategory) {
  const rating = place.rating ?? 3.5;
  const reviews = place.userRatingCount ?? 10;
  const seed = place.id.length + Math.round(rating * 10);
  if (kind === "hotel") return Math.round(18000 * rating + (reviews % 9) * 4000);
  if (category === "Buy") return 28_000_000 + seed * 250_000;
  if (category === "Rent") return 800_000 + seed * 45_000;
  return 35_000 + Math.round(rating * 12000) + (seed % 20) * 3000;
}

/** Public Google-listed businesses show as verified + registered on the site. */
function publicListingFlags(place: GooglePlace) {
  const listed = !place.businessStatus || place.businessStatus === "OPERATIONAL";
  return {
    verification: listed ? ("verified" as const) : ("unregistered" as const),
    licensed: listed,
    registered: listed,
  };
}

export function googleToHotel(
  place: GooglePlace,
  stateHint: string,
  cityHint: string,
): HotelRecord | null {
  const name = place.displayName?.text?.trim();
  const lat = place.location?.latitude;
  const lon = place.location?.longitude;
  if (!name || lat == null || lon == null) return null;

  const { city, state, address } = parseCityState(place.formattedAddress, cityHint, stateHint);
  const stars = Math.min(5, Math.max(1, Math.round(place.rating ?? 3)));
  const flags = publicListingFlags(place);

  return {
    id: `hotel-google-${place.id}`,
    source: "google",
    name,
    slug: slugify(name, place.id),
    city,
    state,
    address,
    lat,
    lon,
    images: placeImages(place, HOTEL_FALLBACKS),
    verification: flags.verification,
    live: true,
    stars,
    rooms: 20 + (place.id.length % 80),
    nightlyFrom: priceFromGoogle(place, "hotel"),
    advertActive: (place.userRatingCount ?? 0) > 40,
    tourismBoardNo: `GOOGLE/${state.slice(0, 3).toUpperCase()}/${place.id.slice(-6)}`,
    cacNumber: flags.registered
      ? `REG-GOOGLE/${place.id.slice(-8).toUpperCase()}`
      : "Pending verification",
    tin: flags.registered ? `TIN-G/${place.id.slice(-6)}` : "Pending",
    taxPaid: 0,
    taxOwed: 0,
    ownerName: name,
    phone: place.nationalPhoneNumber || place.internationalPhoneNumber || "+234 800 000 0000",
    website: place.websiteUri || place.googleMapsUri,
  };
}

function classifyFromGoogle(
  place: GooglePlace,
  query: string,
): { category: ListingCategory; type: PropertyType } {
  const types = (place.types || []).join(" ").toLowerCase();
  const primary = (place.primaryType || "").toLowerCase();
  const q = query.toLowerCase();

  if (types.includes("lodging") || primary.includes("hotel") || q.includes("hotel") || q.includes("guest")) {
    return { category: "Shortlet", type: "Hotel" };
  }
  if (q.includes("short let") || q.includes("serviced")) {
    return { category: "Shortlet", type: "Apartment" };
  }
  if (q.includes("for rent") || q.includes("apartment")) {
    return { category: "Rent", type: "Apartment" };
  }
  if (q.includes("for sale") || q.includes("real estate")) {
    return { category: "Buy", type: "House" };
  }
  return { category: "Shortlet", type: "Apartment" };
}

export function googleToProperty(
  place: GooglePlace,
  stateHint: string,
  cityHint: string,
  query: string,
): Property | null {
  const name = place.displayName?.text?.trim();
  const lat = place.location?.latitude;
  const lng = place.location?.longitude;
  if (!name || lat == null || lng == null) return null;

  const { city, state, address } = parseCityState(place.formattedAddress, cityHint, stateHint);
  const { category, type } = classifyFromGoogle(place, query);
  const bedrooms = 1 + (place.id.length % 4);
  const flags = publicListingFlags(place);

  return {
    id: `prop-google-${place.id}`,
    slug: slugify(name, place.id),
    title: name,
    description: `Listed on Google in ${city}, ${state}. Photos and details come from the public Google Places listing. Contact the operator to confirm availability.`,
    propertyType: type,
    listingCategory: category,
    price: priceFromGoogle(place, "property", category),
    pricePer: category === "Shortlet" ? "night" : category === "Rent" ? "year" : "total",
    images: placeImages(place, STAY_FALLBACKS),
    bedrooms,
    bathrooms: Math.max(1, Math.min(bedrooms, 2)),
    maxGuests: bedrooms * 2,
    amenities: [
      "Google Places photos",
      "Public listing",
      place.websiteUri ? "Website listed" : "Phone contact",
      "Map location",
    ],
    location: {
      address: address.split(",")[0] || city,
      city,
      state,
      country: "Nigeria",
    },
    owner: {
      id: `google-owner-${place.id}`,
      firstName: "Listed",
      lastName: "Operator",
      email: "listings@ussap.ng",
      phone: place.nationalPhoneNumber || place.internationalPhoneNumber || "+234 800 000 0000",
      companyName: name,
    },
    rating: place.rating ?? 4,
    reviewsCount: place.userRatingCount ?? 0,
    hasHourlyReservation: category === "Shortlet" && place.id.length % 5 === 0,
    whatsappNumber: (place.nationalPhoneNumber || "").replace(/\D/g, "") || undefined,
    status: "active",
    createdAt: new Date().toISOString().slice(0, 10),
    live: true,
    lat,
    lng,
    verification: flags.verification,
    licensed: flags.licensed,
    registered: flags.registered,
    registrationNo: flags.registered
      ? `REG-GOOGLE/${place.id.slice(-8).toUpperCase()}`
      : undefined,
    licenseNo: flags.licensed
      ? `LIC-GOOGLE/${state.slice(0, 3).toUpperCase()}/${place.id.slice(-6)}`
      : undefined,
  };
}
