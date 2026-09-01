/** Verified addresses, coordinates, and images for named institutions. */
import {
  ekitiBillboardOverride,
  ekitiHealthOverride,
  ekitiHotelOverride,
  ekitiSchoolOverride,
} from "./ekiti-overrides";

export type FacilityOverride = {
  address?: string;
  city?: string;
  lga?: string;
  lat?: number;
  lon?: number;
  image?: string;
};

const HEALTH: Record<string, FacilityOverride> = {
  "health-1": {
    address: "Akerele Road, Surulere, Lagos",
    city: "Surulere",
    lga: "Surulere",
    lat: 6.4969,
    lon: 3.3587,
    image: "/facilities/health/luth-surulere.jpg",
  },
  "health-2": {
    address: "12 Idowu Martins Street, beside Mega Plaza, Victoria Island, Lagos",
    city: "Victoria Island",
    lga: "Eti-Osa",
    lat: 6.4329787,
    lon: 3.4204157,
    image: "/facilities/health/reddington-hospital.jpg",
  },
  "health-3": {
    address: "Herbert Macaulay Way, Central Area, Abuja",
    city: "Central Area",
    lga: "Abuja Municipal",
    lat: 9.0579,
    lon: 7.4951,
    image: "/facilities/health/national-abuja.jpg",
  },
  "health-4": {
    address: "Samaru, Zaria, Kaduna",
    city: "Zaria",
    lga: "Zaria",
    lat: 11.151,
    lon: 7.655,
    image: "/facilities/health/abuth-zaria.jpg",
  },
  "health-5": {
    address: "Queen Elizabeth Road, Ibadan, Oyo",
    city: "Ibadan",
    lga: "Ibadan North",
    lat: 7.401,
    lon: 3.899,
    image: "/facilities/health/uch-gate.jpg",
  },
  "health-7": {
    address: "57 Campbell Street, Lagos Island, Lagos",
    city: "Lagos Island",
    lga: "Lagos Island",
    lat: 6.4541,
    lon: 3.3947,
    image: "/facilities/health/st-nicholas.jpg",
  },
  "health-9": {
    address: "31 Mobolaji Bank Anthony Way, Ikeja, Lagos",
    city: "Ikeja",
    lga: "Ikeja",
    lat: 6.5833,
    lon: 3.3667,
    image: "/facilities/health/eko-hospital.jpg",
  },
};

const SCHOOLS: Record<string, FacilityOverride> = {
  "school-reg-85": {
    address: "KM 10 Idiroko Road, Canaan Land, Ota, Ogun",
    city: "Ota",
    lga: "Ado-Odo/Ota",
    lat: 6.6715,
    lon: 3.1581,
    image: "/facilities/schools/covenant-university.jpg",
  },
  "school-reg-84": {
    address: "University of Nigeria, Nsukka, Enugu",
    city: "Nsukka",
    lga: "Nsukka",
    lat: 6.864,
    lon: 7.408,
    image: "/facilities/schools/unn-view.jpg",
  },
  "school-reg-83": {
    address: "Samaru, Zaria, Kaduna",
    city: "Zaria",
    lga: "Zaria",
    lat: 11.151,
    lon: 7.655,
    image: "/facilities/schools/abu-gate.jpg",
  },
  "school-reg-82": {
    address: "Queen Elizabeth Road, Ibadan, Oyo",
    city: "Ibadan",
    lga: "Ibadan North",
    lat: 7.4432,
    lon: 3.9003,
    image: "/facilities/schools/university-of-ibadan.jpg",
  },
  "school-reg-81": {
    address: "University Road, Akoka, Lagos",
    city: "Akoka",
    lga: "Shomolu",
    lat: 6.5158,
    lon: 3.3891,
    image: "/facilities/schools/unilag-gate.jpg",
  },
};

export function healthOverride(id: string): FacilityOverride | undefined {
  return HEALTH[id] ?? ekitiHealthOverride(id);
}

export function schoolOverride(id: string): FacilityOverride | undefined {
  return SCHOOLS[id] ?? ekitiSchoolOverride(id);
}

export function hotelOverride(id: string): FacilityOverride | undefined {
  return ekitiHotelOverride(id);
}

export function billboardOverride(id: string): FacilityOverride | undefined {
  return ekitiBillboardOverride(id);
}

export function applyOverride<T extends { address: string; city?: string; lga?: string; lat?: number; lon?: number; images?: string[] }>(
  record: T,
  override?: FacilityOverride,
): T {
  if (!override) return record;
  return {
    ...record,
    address: override.address ?? record.address,
    city: override.city ?? record.city,
    lga: override.lga ?? record.lga,
    lat: override.lat ?? record.lat,
    lon: override.lon ?? record.lon,
    images: override.image ? [override.image, ...(record.images ?? []).filter((i) => i !== override.image)] : record.images,
  };
}
