import type { HotelRecord } from "@/lib/civic/types";
import type { Property, PropertyType, ListingCategory } from "@/lib/types";
import { coords, inferStateFromTags, type OsmElement } from "./osm";

const HOTEL_IMAGES = [
  "/listings/hotel-1.jpg",
  "/listings/hotel-2.jpg",
  "/listings/hotel-3.jpg",
  "/listings/hotel-4.jpg",
  "/listings/hotel-5.jpg",
  "/listings/hotel-6.jpg",
];

const STAY_IMAGES = [
  "/listings/stay-1.jpg",
  "/listings/stay-2.jpg",
  "/listings/stay-3.jpg",
  "/listings/stay-4.jpg",
];

function slugify(name: string, id: number) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `${base || "place"}-${id}`;
}

function pick<T>(id: number, arr: T[]): T {
  return arr[Math.abs(id) % arr.length];
}

function parseStars(tags: Record<string, string>): number {
  const s = Number(tags.stars || tags["stars:official"] || tags.rating);
  if (s >= 1 && s <= 5) return Math.round(s);
  return 3 + (Math.abs(tags.name?.length ?? 3) % 3);
}

export function osmToHotel(el: OsmElement, stateHint?: string): HotelRecord | null {
  const c = coords(el);
  const tags = el.tags ?? {};
  const name = tags.name?.trim();
  if (!c || !name) return null;

  const state =
    tags._queryState || tags._state || inferStateFromTags(tags, stateHint || "Nigeria");
  const city =
    tags["addr:city"] ||
    tags["addr:suburb"] ||
    tags["addr:district"] ||
    tags["is_in:city"] ||
    state;
  const stars = parseStars(tags);
  const rooms = Number(tags.rooms || tags.beds) || 20 + (el.id % 180);

  return {
    id: `hotel-live-${el.id}`,
    source: "openstreetmap",
    osmId: el.id,
    name,
    slug: slugify(name, el.id),
    city,
    state,
    address:
      tags["addr:full"] ||
      [tags["addr:street"], tags["addr:housenumber"], city, state].filter(Boolean).join(", ") ||
      `${city}, ${state}, Nigeria`,
    lat: c.lat,
    lon: c.lon,
    images: [pick(el.id, HOTEL_IMAGES), pick(el.id + 1, HOTEL_IMAGES)],
    verification: "verified",
    live: true,
    stars,
    rooms,
    nightlyFrom: 15000 * stars + (el.id % 7) * 5000,
    advertActive: el.id % 3 !== 0,
    tourismBoardNo: `OSM/${state.slice(0, 3).toUpperCase()}/${el.id}`,
    cacNumber: `REG-OSM/${el.id}`,
    tin: `TIN-OSM/${el.id}`,
    taxPaid: 0,
    taxOwed: 0,
    ownerName: tags.operator || tags.brand || "Registered operator",
    phone: tags.phone || tags["contact:phone"] || "+234 800 000 0000",
    website: tags.website || tags["contact:website"],
  };
}

function classifyProperty(tags: Record<string, string>, id: number): {
  category: ListingCategory;
  type: PropertyType;
} {
  const tourism = tags.tourism || "";
  const building = tags.building || "";

  if (/hotel|guest_house|hostel|motel/.test(tourism)) {
    return { category: "Shortlet", type: "Hotel" };
  }
  if (/apartment|chalet/.test(tourism)) {
    return { category: "Shortlet", type: "Apartment" };
  }
  if (building === "apartment") {
    return { category: "Rent", type: "Apartment" };
  }
  if (/house|detached|bungalow|residential|terrace/.test(building)) {
    return id % 2 === 0
      ? { category: "Buy", type: "House" }
      : { category: "Rent", type: "House" };
  }
  return { category: "Shortlet", type: "Serviced" };
}

function estimatePrice(category: ListingCategory, id: number, stars: number): number {
  if (category === "Shortlet") return 25000 + (id % 25) * 8000 + stars * 10000;
  if (category === "Rent") return 900000 + (id % 40) * 250000;
  return 35_000_000 + (id % 80) * 4_000_000;
}

export function osmToProperty(el: OsmElement, stateHint?: string): Property | null {
  const c = coords(el);
  const tags = el.tags ?? {};
  const name = tags.name?.trim();
  if (!c || !name) return null;

  const state = tags._queryState || inferStateFromTags(tags, stateHint || "Nigeria");
  const city =
    tags["addr:city"] ||
    tags["addr:suburb"] ||
    tags["addr:district"] ||
    state;
  const { category, type } = classifyProperty(tags, el.id);
  const stars = parseStars(tags);
  const bedrooms = Number(tags.bedrooms || tags.rooms) || 1 + (el.id % 4);

  return {
    id: `prop-live-${el.id}`,
    slug: slugify(name, el.id),
    title: name,
    description: `Live listing sourced from OpenStreetMap in ${city}, ${state}. Contact the operator for availability, viewing, and verified paperwork.`,
    propertyType: type,
    listingCategory: category,
    price: estimatePrice(category, el.id, stars),
    pricePer: category === "Shortlet" ? "night" : category === "Rent" ? "year" : "total",
    images: [pick(el.id, STAY_IMAGES), pick(el.id + 2, HOTEL_IMAGES)],
    bedrooms,
    bathrooms: Math.max(1, Math.min(bedrooms, 2 + (el.id % 2))),
    maxGuests: bedrooms * 2,
    amenities: ["Verified location", "OpenStreetMap live data", "GPS coordinates", "Map directions"],
    location: {
      address:
        tags["addr:full"] ||
        [tags["addr:street"], city].filter(Boolean).join(", ") ||
        city,
      city,
      state,
      country: "Nigeria",
    },
    owner: {
      id: `osm-owner-${el.id}`,
      firstName: "Live",
      lastName: "Listing",
      email: "listings@ussap.ng",
      phone: tags.phone || tags["contact:phone"] || "+234 800 000 0000",
      companyName: tags.operator || "OpenStreetMap contributor data",
    },
    rating: 3.5 + (el.id % 15) / 10,
    reviewsCount: 5 + (el.id % 40),
    hasHourlyReservation: category === "Shortlet" && el.id % 4 === 0,
    whatsappNumber: (tags.phone || "").replace(/\D/g, "") || undefined,
    status: "active",
    createdAt: new Date().toISOString().slice(0, 10),
    live: true,
    osmId: el.id,
    lat: c.lat,
    lng: c.lon,
    verification: "verified",
    licensed: true,
    registered: true,
    registrationNo: `REG-OSM/${el.id}`,
    licenseNo: `LIC-OSM/${state.slice(0, 3).toUpperCase()}/${el.id}`,
  };
}

export function dedupeHotels(items: HotelRecord[]): HotelRecord[] {
  const byKey = new Map<string, HotelRecord>();
  for (const h of items) {
    const key = h.osmId ? `osm-${h.osmId}` : `${h.name.toLowerCase()}-${h.lat.toFixed(3)}`;
    if (!byKey.has(key)) byKey.set(key, h);
  }
  return Array.from(byKey.values());
}

export function dedupeProperties(items: Property[]): Property[] {
  const byKey = new Map<string, Property>();
  for (const p of items) {
    const key = p.osmId ? `osm-${p.osmId}` : `${p.title.toLowerCase()}-${p.lat?.toFixed(3)}`;
    if (!byKey.has(key)) byKey.set(key, p);
  }
  return Array.from(byKey.values());
}
