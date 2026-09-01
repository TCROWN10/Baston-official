import pool from "./facility-image-pool.json";

const SCHOOL_POOL = [...pool.schools];
const HEALTH_POOL = [...pool.health];
const HOTEL_POOL = [...pool.hotels];
const BILLBOARD_POOL = [...pool.billboards];

/** Preferred real institution photos — claimed first so they stay unique. */
const SCHOOL_PREFERRED: [RegExp, string][] = [
  [/covenant/i, "/facilities/schools/covenant-university.jpg"],
  [/university of ibadan|\bui\b/i, "/facilities/schools/university-of-ibadan.jpg"],
  [/university of lagos|\bunilag\b/i, "/facilities/schools/unilag-gate.jpg"],
  [/ahmadu bello|\babu\b/i, "/facilities/schools/abu-gate.jpg"],
  [/university of nigeria|\bunn\b|nsukka/i, "/facilities/schools/unn-view.jpg"],
];

const HEALTH_PREFERRED: [RegExp, string][] = [
  [/university college hospital|\buch\b/i, "/facilities/health/uch-gate.jpg"],
  [/national hospital/i, "/facilities/health/national-abuja.jpg"],
  [/reddington/i, "/facilities/health/reddington-hospital.jpg"],
  [/lagos university teaching|\bluth\b/i, "/facilities/health/luth-surulere.jpg"],
  [/st\.?\s*nicholas/i, "/facilities/health/st-nicholas.jpg"],
  [/eko hospital/i, "/facilities/health/eko-hospital.jpg"],
  [/ahmadu bello university teaching|\babuth\b/i, "/facilities/health/abuth-zaria.jpg"],
  [/university of abuja teaching|uath/i, "/facilities/health/health-003.jpg"],
];

function takeUnique(poolList: string[], used: Set<string>): string {
  for (const src of poolList) {
    if (!used.has(src)) {
      used.add(src);
      return src;
    }
  }
  throw new Error("Facility image pool exhausted — add more unique images.");
}

const schoolUsed = new Set<string>();
const healthUsed = new Set<string>();
const hotelUsed = new Set<string>();
const billboardUsed = new Set<string>();

const schoolCache = new Map<string, string>();
const healthCache = new Map<string, string>();
const hotelCache = new Map<string, string>();
const billboardCache = new Map<string, string>();

let schoolsAssigned = false;
let healthAssigned = false;
let hotelsAssigned = false;

/**
 * Assign every school a distinct image. Preferred named matches claim first;
 * remaining ids receive the next unused pool photo in stable id order.
 */
export function assignUniqueSchoolImages(
  items: { id: string; name: string; slug: string }[],
): Map<string, string> {
  if (schoolsAssigned && schoolCache.size === items.length) return schoolCache;
  schoolUsed.clear();
  schoolCache.clear();

  for (const item of items) {
    for (const [pattern, src] of SCHOOL_PREFERRED) {
      if (pattern.test(item.name) || pattern.test(item.slug)) {
        if (!schoolUsed.has(src) && SCHOOL_POOL.includes(src)) {
          schoolUsed.add(src);
          schoolCache.set(item.id, src);
        }
        break;
      }
    }
  }

  const rest = items
    .filter((i) => !schoolCache.has(i.id))
    .sort((a, b) => a.id.localeCompare(b.id));
  for (const item of rest) {
    schoolCache.set(item.id, takeUnique(SCHOOL_POOL, schoolUsed));
  }
  schoolsAssigned = true;
  return schoolCache;
}

export function assignUniqueHealthImages(
  items: { id: string; name: string; slug: string }[],
): Map<string, string> {
  if (healthAssigned && healthCache.size === items.length) return healthCache;
  healthUsed.clear();
  healthCache.clear();

  for (const item of items) {
    for (const [pattern, src] of HEALTH_PREFERRED) {
      if (pattern.test(item.name) || pattern.test(item.slug)) {
        if (!healthUsed.has(src) && HEALTH_POOL.includes(src)) {
          healthUsed.add(src);
          healthCache.set(item.id, src);
        }
        break;
      }
    }
  }

  const rest = items
    .filter((i) => !healthCache.has(i.id))
    .sort((a, b) => a.id.localeCompare(b.id));
  for (const item of rest) {
    healthCache.set(item.id, takeUnique(HEALTH_POOL, healthUsed));
  }
  healthAssigned = true;
  return healthCache;
}

export function assignUniqueHotelImages(items: { id: string }[]): Map<string, string> {
  if (hotelsAssigned && hotelCache.size === items.length) return hotelCache;
  hotelUsed.clear();
  hotelCache.clear();
  const ordered = [...items].sort((a, b) => a.id.localeCompare(b.id));
  for (const item of ordered) {
    hotelCache.set(item.id, takeUnique(HOTEL_POOL, hotelUsed));
  }
  hotelsAssigned = true;
  return hotelCache;
}

export function resolveSchoolImage(input: {
  id: string;
  name: string;
  slug: string;
  level?: string;
}): string {
  const cached = schoolCache.get(input.id);
  if (cached) return cached;
  return takeUnique(SCHOOL_POOL, schoolUsed);
}

export function resolveHealthImage(input: {
  id: string;
  name: string;
  slug: string;
  facilityType?: string;
}): string {
  const cached = healthCache.get(input.id);
  if (cached) return cached;
  return takeUnique(HEALTH_POOL, healthUsed);
}

export function resolveHotelImage(id: string): string {
  const cached = hotelCache.get(id);
  if (cached) return cached;
  return takeUnique(HOTEL_POOL, hotelUsed);
}

export function resolveBillboardImage(id: string, existing?: string): string {
  if (existing && !billboardUsed.has(existing)) {
    billboardUsed.add(existing);
    billboardCache.set(id, existing);
    return existing;
  }
  const cached = billboardCache.get(id);
  if (cached) return cached;
  const src = takeUnique(BILLBOARD_POOL, billboardUsed);
  billboardCache.set(id, src);
  return src;
}

export const DEFAULT_SCHOOL_FALLBACK = SCHOOL_POOL[0];
export const DEFAULT_HEALTH_FALLBACK = HEALTH_POOL[0];
export const DEFAULT_HOTEL_FALLBACK = HOTEL_POOL[0];
export const DEFAULT_BILLBOARD_FALLBACK = BILLBOARD_POOL[0];
