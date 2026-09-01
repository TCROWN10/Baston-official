import { SCHOOLS } from "./directory";
import {
  DEFAULT_HEALTH_FALLBACK,
  DEFAULT_SCHOOL_FALLBACK,
  assignUniqueHealthImages,
  assignUniqueSchoolImages,
} from "./facility-images";
import { stableHash, normalizeArea } from "./locations";
import type { HealthRecord, SchoolRecord } from "./types";

const schoolImages = assignUniqueSchoolImages(
  SCHOOLS.map((s) => ({ id: s.id, name: s.name, slug: s.slug })),
);

function enrichSchool(s: SchoolRecord): SchoolRecord {
  const h = stableHash(s.id);
  const ratio = 14 + (h % 10);
  const teachers = s.teachers ?? Math.max(8, Math.round(s.students / ratio));
  const establishedYear = s.establishedYear ?? 1965 + (h % 50);
  const lga = s.lga ?? normalizeArea(s.city);
  const setting = s.setting ?? (h % 4 === 0 ? "Rural" : "Urban");
  const registered =
    s.registered ?? (s.verification === "verified" || s.verification === "pending");
  const image = schoolImages.get(s.id) ?? DEFAULT_SCHOOL_FALLBACK;

  return {
    ...s,
    teachers,
    establishedYear,
    lga,
    setting,
    registered,
    images: [image],
  };
}

function enrichHealth(f: HealthRecord): HealthRecord {
  const h = stableHash(f.id);
  const doctors = f.doctors ?? Math.max(2, Math.round(f.beds / (8 + (h % 6))));
  const nurses = f.nurses ?? Math.max(4, Math.round(f.beds / (4 + (h % 3))));
  const establishedYear = f.establishedYear ?? 1970 + (h % 45);
  const lga = f.lga ?? normalizeArea(f.city);
  const setting = f.setting ?? (h % 5 === 0 ? "Rural" : "Urban");
  const registered =
    f.registered ?? (f.verification === "verified" || f.verification === "pending");
  const image = healthImages.get(f.id) ?? DEFAULT_HEALTH_FALLBACK;

  return {
    ...f,
    doctors,
    nurses,
    establishedYear,
    lga,
    setting,
    registered,
    images: [image],
  };
}

/** Schools with derived teachers, LGA, establishment year, and setting. */
export function enrichedSchools(): SchoolRecord[] {
  return SCHOOLS.map(enrichSchool);
}

/** Health facilities across Nigeria (seed registry). */
const HEALTH_SEED: Omit<HealthRecord, "images" | "live">[] = [
  {
    id: "health-1",
    source: "registry",
    name: "Lagos University Teaching Hospital",
    slug: "lagos-university-teaching-hospital",
    city: "Surulere",
    state: "Lagos",
    lga: "Surulere",
    address: "Akerele Road, Surulere, Lagos",
    lat: 6.4969,
    lon: 3.3587,
    facilityType: "Tertiary Hospital",
    ownership: "Government",
    tier: "Tertiary",
    beds: 780,
    verification: "verified",
  },
  {
    id: "health-2",
    source: "registry",
    name: "Reddington Hospital",
    slug: "reddington-hospital",
    city: "Victoria Island",
    state: "Lagos",
    lga: "Eti-Osa",
    address: "12 Idowu Martins, Victoria Island, Lagos",
    lat: 6.4281,
    lon: 3.4219,
    facilityType: "Private Hospital",
    ownership: "Private",
    tier: "Secondary",
    beds: 120,
    verification: "verified",
  },
  {
    id: "health-3",
    source: "registry",
    name: "National Hospital Abuja",
    slug: "national-hospital-abuja",
    city: "Central Area",
    state: "FCT",
    lga: "Abuja Municipal",
    address: "Central Area, Abuja",
    lat: 9.0579,
    lon: 7.4951,
    facilityType: "Tertiary Hospital",
    ownership: "Government",
    tier: "Tertiary",
    beds: 650,
    verification: "verified",
  },
  {
    id: "health-4",
    source: "registry",
    name: "Ahmadu Bello University Teaching Hospital",
    slug: "abuth-zaria",
    city: "Zaria",
    state: "Kaduna",
    lga: "Zaria",
    address: "Samaru, Zaria, Kaduna",
    lat: 11.151,
    lon: 7.655,
    facilityType: "Tertiary Hospital",
    ownership: "Government",
    tier: "Tertiary",
    beds: 920,
    verification: "verified",
  },
  {
    id: "health-5",
    source: "registry",
    name: "University College Hospital Ibadan",
    slug: "uch-ibadan",
    city: "Ibadan",
    state: "Oyo",
    lga: "Ibadan North",
    address: "Queen Elizabeth Road, Ibadan",
    lat: 7.401,
    lon: 3.899,
    facilityType: "Tertiary Hospital",
    ownership: "Government",
    tier: "Tertiary",
    beds: 850,
    verification: "verified",
  },
  {
    id: "health-6",
    source: "registry",
    name: "Biu Rural Health Centre",
    slug: "biu-rhc",
    city: "Biu",
    state: "Borno",
    lga: "Biu",
    address: "Hospital Road, Biu, Borno",
    lat: 10.612,
    lon: 12.194,
    facilityType: "Rural Health Centre",
    ownership: "Government",
    tier: "Primary",
    beds: 24,
    verification: "pending",
  },
  {
    id: "health-7",
    source: "registry",
    name: "St. Nicholas Hospital",
    slug: "st-nicholas-hospital",
    city: "Lagos Island",
    state: "Lagos",
    lga: "Lagos Island",
    address: "57 Campbell Street, Lagos Island",
    lat: 6.4541,
    lon: 3.3947,
    facilityType: "Private Hospital",
    ownership: "Private",
    tier: "Secondary",
    beds: 95,
    verification: "verified",
  },
  {
    id: "health-8",
    source: "registry",
    name: "Port Harcourt Military Hospital",
    slug: "ph-military-hospital",
    city: "Port Harcourt",
    state: "Rivers",
    lga: "Port Harcourt",
    address: "Rumuomasi, Port Harcourt",
    lat: 4.8156,
    lon: 7.0498,
    facilityType: "General Hospital",
    ownership: "Government",
    tier: "Secondary",
    beds: 310,
    verification: "verified",
  },
  {
    id: "health-9",
    source: "registry",
    name: "Eko Hospital",
    slug: "eko-hospital",
    city: "Ikeja",
    state: "Lagos",
    lga: "Ikeja",
    address: "31 Mobolaji Bank Anthony Way, Ikeja",
    lat: 6.5833,
    lon: 3.3667,
    facilityType: "Private Hospital",
    ownership: "Private",
    tier: "Secondary",
    beds: 140,
    verification: "verified",
  },
  {
    id: "health-10",
    source: "registry",
    name: "Kano Specialist Hospital",
    slug: "kano-specialist",
    city: "Kano",
    state: "Kano",
    lga: "Kano Municipal",
    address: "Independence Way, Kano",
    lat: 12.0022,
    lon: 8.592,
    facilityType: "Specialist",
    ownership: "Government",
    tier: "Secondary",
    beds: 420,
    verification: "verified",
  },
  {
    id: "health-11",
    source: "registry",
    name: "Enugu State University Teaching Hospital",
    slug: "esuth-enugu",
    city: "Enugu",
    state: "Enugu",
    lga: "Enugu North",
    address: "Parklane, Enugu",
    lat: 6.4527,
    lon: 7.5103,
    facilityType: "Tertiary Hospital",
    ownership: "Government",
    tier: "Tertiary",
    beds: 540,
    verification: "verified",
  },
  {
    id: "health-12",
    source: "registry",
    name: "Faith Medical Centre",
    slug: "faith-medical-centre",
    city: "Benin City",
    state: "Edo",
    lga: "Oredo",
    address: "Sapele Road, Benin City",
    lat: 6.335,
    lon: 5.627,
    facilityType: "Private Hospital",
    ownership: "Mission",
    tier: "Primary",
    beds: 60,
    verification: "pending",
  },
  {
    id: "health-13",
    source: "registry",
    name: "Owerri General Hospital",
    slug: "owerri-general",
    city: "Owerri",
    state: "Imo",
    lga: "Owerri Municipal",
    address: "Douglas Road, Owerri",
    lat: 5.485,
    lon: 7.033,
    facilityType: "General Hospital",
    ownership: "Government",
    tier: "Secondary",
    beds: 280,
    verification: "verified",
  },
  {
    id: "health-14",
    source: "registry",
    name: "Jos University Teaching Hospital",
    slug: "juth-jos",
    city: "Jos",
    state: "Plateau",
    lga: "Jos North",
    address: "Lamingo, Jos",
    lat: 9.8965,
    lon: 8.8583,
    facilityType: "Tertiary Hospital",
    ownership: "Government",
    tier: "Tertiary",
    beds: 620,
    verification: "verified",
  },
  {
    id: "health-15",
    source: "registry",
    name: "Asokoro District Hospital",
    slug: "asokoro-district",
    city: "Asokoro",
    state: "FCT",
    lga: "Abuja Municipal",
    address: "Asokoro, Abuja",
    lat: 9.041,
    lon: 7.532,
    facilityType: "General Hospital",
    ownership: "Government",
    tier: "Secondary",
    beds: 200,
    verification: "verified",
  },
  {
    id: "health-16",
    source: "registry",
    name: "Garki Community Health Centre",
    slug: "garki-chc",
    city: "Garki",
    state: "FCT",
    lga: "Abuja Municipal",
    address: "Area 1, Garki, Abuja",
    lat: 9.032,
    lon: 7.489,
    facilityType: "Community Health Centre",
    ownership: "Government",
    tier: "Primary",
    beds: 18,
    verification: "verified",
  },
  {
    id: "health-17",
    source: "registry",
    name: "Lekki Phase 1 Clinic",
    slug: "lekki-clinic",
    city: "Lekki",
    state: "Lagos",
    lga: "Eti-Osa",
    address: "Admiralty Way, Lekki Phase 1",
    lat: 6.4474,
    lon: 3.4738,
    facilityType: "Clinic",
    ownership: "Private",
    tier: "Primary",
    beds: 12,
    verification: "pending",
  },
  {
    id: "health-18",
    source: "registry",
    name: "Maiduguri Specialist Hospital",
    slug: "maiduguri-specialist",
    city: "Maiduguri",
    state: "Borno",
    lga: "Maiduguri",
    address: "Baga Road, Maiduguri",
    lat: 11.831,
    lon: 13.151,
    facilityType: "General Hospital",
    ownership: "Government",
    tier: "Secondary",
    beds: 350,
    verification: "flagged",
  },
];

const healthImages = assignUniqueHealthImages(
  HEALTH_SEED.map((f) => ({ id: f.id, name: f.name, slug: f.slug })),
);

export function enrichedHealthFacilities(): HealthRecord[] {
  return HEALTH_SEED.map((f) =>
    enrichHealth({
      ...f,
      images: [],
      live: true,
    }),
  );
}

export function getEnrichedSchool(id: string) {
  return enrichedSchools().find((s) => s.id === id || s.slug === id);
}

export function getEnrichedHealth(id: string) {
  return enrichedHealthFacilities().find((h) => h.id === id || h.slug === id);
}

export { DEFAULT_SCHOOL_FALLBACK, DEFAULT_HEALTH_FALLBACK } from "./facility-images";

export type OwnershipFilter = "all" | "government" | "private";

export function schoolOwnershipLabel(s: SchoolRecord): "Government" | "Private" {
  return s.ownership === "Public" ? "Government" : "Private";
}

export function matchesOwnershipSchool(s: SchoolRecord, filter: OwnershipFilter): boolean {
  if (filter === "all") return true;
  if (filter === "government") return s.ownership === "Public";
  return s.ownership === "Private";
}

export function matchesOwnershipHealth(h: HealthRecord, filter: OwnershipFilter): boolean {
  if (filter === "all") return true;
  if (filter === "government") return h.ownership === "Government";
  return h.ownership === "Private" || h.ownership === "Mission";
}
