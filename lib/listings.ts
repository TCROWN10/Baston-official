import { PROPERTIES } from "./data";
import type {
  ListingCategory,
  Property,
  PropertyVerification,
  SearchFilters,
  SearchTab,
} from "./types";

const AREA_CITIES = [
  "lagos",
  "abuja",
  "lekki",
  "victoria island",
  "ikoyi",
  "maitama",
  "gwarinpa",
  "surulere",
  "wuse",
  "akure",
  "ibadan",
  "abia",
  "ekiti",
  "ado ekiti",
  "ikere",
];

function hashId(id: string): number {
  let n = 0;
  for (let i = 0; i < id.length; i++) n = (n + id.charCodeAt(i) * (i + 1)) % 997;
  return n;
}

/** Ensure every listing has verification / licensed / registered flags for display. */
export function withPropertyCompliance(property: Property): Property {
  if (
    property.verification &&
    typeof property.licensed === "boolean" &&
    typeof property.registered === "boolean"
  ) {
    return property;
  }

  const h = hashId(property.id);
  const cycle: PropertyVerification[] = [
    "verified",
    "verified",
    "verified",
    "pending",
    "flagged",
    "unregistered",
  ];
  const verification = property.verification ?? cycle[h % cycle.length];
  const registered =
    property.registered ??
    (verification === "verified" || (verification === "pending" && h % 2 === 0));
  const licensed =
    property.licensed ??
    (verification === "verified" &&
      (property.propertyType === "Hotel" || property.propertyType === "Resort" || h % 3 !== 0));

  return {
    ...property,
    verification,
    registered,
    licensed,
    registrationNo:
      property.registrationNo ??
      (registered ? `REG/${property.location.state.slice(0, 3).toUpperCase()}/${property.id}` : undefined),
    licenseNo:
      property.licenseNo ??
      (licensed ? `LIC/${property.location.state.slice(0, 3).toUpperCase()}/${property.id}` : undefined),
  };
}

export function categoryFromTab(tab: SearchTab): ListingCategory {
  if (tab === "buy") return "Buy";
  if (tab === "rent") return "Rent";
  return "Shortlet";
}

export function formatPrice(property: Property): string {
  const amount = `₦${property.price.toLocaleString()}`;
  if (property.listingCategory === "Shortlet") return `${amount}/Night`;
  if (property.listingCategory === "Rent") {
    return `${amount} / ${property.pricePer}`;
  }
  return amount;
}

export function formatLocation(property: Property): string {
  return `${property.location.city}, ${property.location.state}`.trim();
}

export function bedLabel(bedrooms: number): string {
  if (bedrooms === 0) return "Studio";
  if (bedrooms === 1) return "1 Bed";
  return `${bedrooms} Beds`;
}

export function getPropertyById(id: string): Property | undefined {
  return getAllProperties().find((p) => p.id === id || p.slug === id);
}

export function getAllProperties(): Property[] {
  const base =
    typeof window === "undefined"
      ? PROPERTIES
      : (() => {
          try {
            const raw = localStorage.getItem("myapp_user_listings");
            const extra: Property[] = raw ? JSON.parse(raw) : [];
            return [...extra, ...PROPERTIES];
          } catch {
            return PROPERTIES;
          }
        })();
  return base.map(withPropertyCompliance);
}

export function saveUserListing(property: Property) {
  const raw = localStorage.getItem("myapp_user_listings");
  const existing: Property[] = raw ? JSON.parse(raw) : [];
  localStorage.setItem(
    "myapp_user_listings",
    JSON.stringify([property, ...existing.filter((p) => p.id !== property.id)]),
  );
}

function matchesLocation(location: string, filter: string): boolean {
  if (!filter.trim()) return true;
  const needle = filter.trim().toLowerCase();
  const parts = location.split(",").map((p) => p.trim().toLowerCase());
  const hit = parts.some((p) => p === needle || p.includes(needle));
  if (!hit) return false;
  const otherAreas = AREA_CITIES.filter((c) => c !== needle);
  return !otherAreas.some((area) =>
    parts.some((p) => p === area || p.includes(area)),
  );
}

function matchesBeds(bedrooms: number, bedsBath: string): boolean {
  if (!bedsBath) return true;
  if (bedsBath === "Studio") return bedrooms === 0;
  if (bedsBath === "5+") return bedrooms >= 5;
  return bedrooms === Number(bedsBath);
}

function matchesPrice(property: Property, tab: SearchTab, range: string): boolean {
  if (!range) return true;
  const price = property.price;
  if (tab === "shortlet") {
    if (range === "under-50k") return price < 50000;
    if (range === "50k-150k") return price >= 50000 && price <= 150000;
    if (range === "150k-300k") return price >= 150000 && price <= 300000;
    if (range === "300k+") return price >= 300000;
  }
  if (tab === "buy") {
    if (range === "under-100m") return price < 100_000_000;
    if (range === "100m-300m") return price >= 100_000_000 && price <= 300_000_000;
    if (range === "300m-500m") return price >= 300_000_000 && price <= 500_000_000;
    if (range === "500m+") return price >= 500_000_000;
  }
  if (tab === "rent") {
    if (range === "under-2m") return price < 2_000_000;
    if (range === "2m-5m") return price >= 2_000_000 && price <= 5_000_000;
    if (range === "5m-10m") return price >= 5_000_000 && price <= 10_000_000;
    if (range === "10m+") return price >= 10_000_000;
  }
  return true;
}

export function filterProperties(
  tab: SearchTab,
  filters: SearchFilters,
  source?: Property[],
): Property[] {
  const list = (source ?? getAllProperties())
    .map(withPropertyCompliance)
    .filter((p) => p.listingCategory === categoryFromTab(tab) && p.status === "active");

  return list.filter((property) => {
    const location = formatLocation(property);
    const typeOk =
      !filters.propertyType ||
      property.propertyType
        .toLowerCase()
        .includes(filters.propertyType.toLowerCase()) ||
      property.title.toLowerCase().includes(filters.propertyType.toLowerCase());

    return (
      matchesLocation(location, filters.location) &&
      typeOk &&
      matchesBeds(property.bedrooms, filters.bedsBath) &&
      matchesPrice(property, tab, filters.priceRange)
    );
  });
}

export const LOCATION_OPTIONS = [
  { value: "", label: "Any location" },
  { value: "Lagos", label: "Lagos" },
  { value: "Abuja", label: "Abuja" },
  { value: "Ekiti", label: "Ekiti" },
  { value: "Ado Ekiti", label: "Ado Ekiti" },
  { value: "Lekki", label: "Lekki" },
  { value: "Victoria Island", label: "Victoria Island" },
  { value: "Ikoyi", label: "Ikoyi" },
  { value: "Maitama", label: "Maitama" },
  { value: "Gwarinpa", label: "Gwarinpa" },
  { value: "Surulere", label: "Surulere" },
  { value: "Wuse", label: "Wuse" },
  { value: "Akure", label: "Akure" },
  { value: "Ibadan", label: "Ibadan" },
];

export const TYPE_OPTIONS = {
  buy: [
    { value: "", label: "Any type" },
    { value: "House", label: "House" },
    { value: "Apartment", label: "Apartment" },
    { value: "Villa", label: "Villa" },
    { value: "Penthouse", label: "Penthouse" },
    { value: "Land", label: "Land" },
  ],
  rent: [
    { value: "", label: "Any type" },
    { value: "House", label: "House" },
    { value: "Apartment", label: "Apartment" },
    { value: "Studio", label: "Studio" },
    { value: "Serviced", label: "Serviced Apartment" },
  ],
  shortlet: [
    { value: "", label: "Any type" },
    { value: "Hotel", label: "Hotel" },
    { value: "Apartment", label: "Apartment" },
    { value: "Serviced", label: "Serviced flat" },
    { value: "Resort", label: "Resort" },
  ],
} as const;

export const BED_OPTIONS = [
  { value: "", label: "Any" },
  { value: "Studio", label: "Studio" },
  { value: "1", label: "1 Bed" },
  { value: "2", label: "2 Beds" },
  { value: "3", label: "3 Beds" },
  { value: "4", label: "4 Beds" },
  { value: "5+", label: "5+ Beds" },
];

export const PRICE_OPTIONS = {
  buy: [
    { value: "", label: "Any price" },
    { value: "under-100m", label: "Under ₦100M" },
    { value: "100m-300m", label: "₦100M – ₦300M" },
    { value: "300m-500m", label: "₦300M – ₦500M" },
    { value: "500m+", label: "₦500M+" },
  ],
  rent: [
    { value: "", label: "Any price" },
    { value: "under-2m", label: "Under ₦2M/year" },
    { value: "2m-5m", label: "₦2M – ₦5M/year" },
    { value: "5m-10m", label: "₦5M – ₦10M/year" },
    { value: "10m+", label: "₦10M+/year" },
  ],
  shortlet: [
    { value: "", label: "Any price" },
    { value: "under-50k", label: "Under ₦50k/night" },
    { value: "50k-150k", label: "₦50k – ₦150k/night" },
    { value: "150k-300k", label: "₦150k – ₦300k/night" },
    { value: "300k+", label: "₦300k+/night" },
  ],
} as const;
