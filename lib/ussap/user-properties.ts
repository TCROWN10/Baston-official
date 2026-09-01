import { encodeGrid, formatCode, normalizeCode } from "./geocode";
import { findByCode } from "./data";
import { getRegistry, upsertSite } from "./registry";
import type { ResidentialSite, VerificationStatus } from "./types";

const LINKS_KEY = "ussap_user_property_links";

type PropertyLink = {
  userId: string;
  userEmail: string;
  code: string;
  registeredAt: string;
};

function readLinks(): PropertyLink[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    return raw ? (JSON.parse(raw) as PropertyLink[]) : [];
  } catch {
    return [];
  }
}

function writeLinks(links: PropertyLink[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

export function lookupDigitalAddress(code: string): ResidentialSite | undefined {
  const normalized = normalizeCode(code);
  const fromSeed = findByCode(normalized);
  if (fromSeed?.sector === "residential") return fromSeed as ResidentialSite;
  const fromRegistry = getRegistry().find(
    (s) => s.code === normalized && s.sector === "residential",
  );
  return fromRegistry as ResidentialSite | undefined;
}

export function propertiesForUser(userId: string, userEmail: string): ResidentialSite[] {
  const codes = new Set(
    readLinks()
      .filter((l) => l.userId === userId || l.userEmail.toLowerCase() === userEmail.toLowerCase())
      .map((l) => l.code),
  );
  return Array.from(codes)
    .map((code) => lookupDigitalAddress(code))
    .filter((s): s is ResidentialSite => Boolean(s));
}

export function countPropertiesForUser(userId: string, userEmail: string): number {
  return propertiesForUser(userId, userEmail).length;
}

export type RegisterPropertyInput = {
  userId: string;
  userEmail: string;
  userName: string;
  label: string;
  propertyType: ResidentialSite["propertyType"];
  unitNo?: string;
  addressLine?: string;
  city: string;
  state: string;
  lga?: string;
  lat: number;
  lng: number;
};

export function registerUserProperty(input: RegisterPropertyInput): ResidentialSite {
  const code = encodeGrid(input.lat, input.lng, 8);
  const now = new Date().toISOString();
  const site: ResidentialSite = {
    code,
    lat: input.lat,
    lng: input.lng,
    label: input.label,
    sector: "residential",
    state: input.state,
    city: input.city,
    description: input.addressLine,
    verification: "pending" as VerificationStatus,
    sensitivity: "public",
    createdAt: now,
    updatedAt: now,
    propertyType: input.propertyType,
    unitNo: input.unitNo,
    shareable: true,
    ownerOrg: input.userName,
    ownerUserId: input.userId,
    ownerEmail: input.userEmail,
    tags: input.lga ? [`lga:${input.lga}`] : undefined,
    deliveryNotes: input.addressLine,
  };

  upsertSite(site);

  const links = readLinks().filter((l) => l.code !== code);
  links.unshift({
    userId: input.userId,
    userEmail: input.userEmail,
    code,
    registeredAt: now,
  });
  writeLinks(links);

  return site;
}

export function formatPropertyCode(code: string): string {
  return formatCode(code);
}
