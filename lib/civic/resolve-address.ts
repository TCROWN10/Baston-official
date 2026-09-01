import osmAddressCache from "./osm-address-cache.json";

type CachedAddress = {
  address: string;
  city?: string;
  lga?: string;
};

const cache = osmAddressCache as Record<string, CachedAddress>;

const VAGUE_ADDRESS =
  /^(Lagos|Rivers|Oyo|Kaduna|Enugu|Ogun|FCT|Abuja|Kano|Edo|Imo|Plateau|Borno),?\s*Nigeria$/i;

/** True when the stored address is too generic to show users. */
export function isVagueAddress(address: string | undefined): boolean {
  if (!address) return true;
  const trimmed = address.trim();
  if (trimmed === "Lagos, Nigeria") return true;
  if (VAGUE_ADDRESS.test(trimmed)) return true;
  const parts = trimmed.split(",").map((p) => p.trim());
  return parts.length <= 3 && trimmed.endsWith("Nigeria");
}

/** Resolve a better street-level address from the OSM reverse-geocode cache. */
export function resolveCachedAddress(id: string): CachedAddress | undefined {
  return cache[id];
}

export function resolveFacilityAddress(input: {
  id: string;
  name: string;
  address: string;
  city?: string;
  lga?: string;
}): { address: string; city?: string; lga?: string } {
  const cached = resolveCachedAddress(input.id);
  if (cached?.address && isVagueAddress(input.address)) {
    return {
      address: cached.address,
      city: cached.city ?? input.city,
      lga: cached.lga ?? input.lga,
    };
  }
  return { address: input.address, city: input.city, lga: input.lga };
}
