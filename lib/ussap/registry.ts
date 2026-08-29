import type { SectorKind, Sensitivity, UssapRole, UssapSite } from "./types";
import { canAccessSector, canViewSensitivity } from "./rbac";
import { allSites, findByCode } from "./data";

const STORE_KEY = "ussap_site_overrides";

function readOverrides(): UssapSite[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as UssapSite[]) : [];
  } catch {
    return [];
  }
}

function writeOverrides(sites: UssapSite[]) {
  localStorage.setItem(STORE_KEY, JSON.stringify(sites));
}

export function getRegistry(): UssapSite[] {
  const overrides = typeof window !== "undefined" ? readOverrides() : [];
  const byCode = new Map(allSites().map((s) => [s.code, s]));
  for (const o of overrides) byCode.set(o.code, o);
  return Array.from(byCode.values());
}

export function getVisibleSites(role: UssapRole | null | undefined): UssapSite[] {
  const sites = getRegistry();
  return sites.filter((s) => {
    // Public registry entries are visible to everyone (including guests).
    if (s.sensitivity === "public") return true;
    if (!role) return false;
    return canAccessSector(role, s.sector) && canViewSensitivity(role, s.sensitivity);
  });
}

export function getSite(code: string, role?: UssapRole | null): UssapSite | undefined {
  const site = findByCode(code) || getRegistry().find((s) => s.code === code);
  if (!site) return undefined;
  if (!role) return site.sensitivity === "public" ? site : undefined;
  if (!canAccessSector(role, site.sector) || !canViewSensitivity(role, site.sensitivity)) {
    return undefined;
  }
  return site;
}

export function upsertSite(site: UssapSite) {
  const overrides = readOverrides().filter((s) => s.code !== site.code);
  overrides.unshift(site);
  writeOverrides(overrides);
}

export function sitesBySector(sector: SectorKind, role?: UssapRole | null): UssapSite[] {
  return getVisibleSites(role).filter((s) => s.sector === sector);
}

export function filterBySensitivity(
  sites: UssapSite[],
  sensitivity: Sensitivity | "all",
): UssapSite[] {
  if (sensitivity === "all") return sites;
  return sites.filter((s) => s.sensitivity === sensitivity);
}
