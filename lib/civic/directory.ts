import directory from "./directory.json";
import { assignUniqueHotelImages } from "./facility-images";
import type { CompanyRecord, HotelRecord, SchoolRecord } from "./types";

const rawHotels = directory.hotels as HotelRecord[];
const hotelImages = assignUniqueHotelImages(rawHotels.map((h) => ({ id: h.id })));

export const HOTELS: HotelRecord[] = rawHotels.map((h) => ({
  ...h,
  images: [hotelImages.get(h.id) ?? h.images?.[0]].filter(Boolean) as string[],
}));

export const SCHOOLS = directory.schools as SchoolRecord[];
export const COMPANIES = directory.companies as CompanyRecord[];

export function naira(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export function getHotel(id: string) {
  return HOTELS.find((h) => h.id === id || h.slug === id);
}

export function getSchool(id: string) {
  return SCHOOLS.find((s) => s.id === id || s.slug === id);
}

export function getCompany(id: string) {
  return COMPANIES.find((c) => c.id === id || c.slug === id);
}

export const NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];
