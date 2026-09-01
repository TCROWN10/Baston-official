/** Normalize city names into local-government / area labels for filtering. */
export function normalizeArea(city: string): string {
  return city
    .replace(/,\s*/g, " · ")
    .split(" ")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ")
    .trim();
}

export type LocationIndex = {
  states: string[];
  areasByState: Record<string, string[]>;
  countByState: Record<string, number>;
  countByArea: Record<string, Record<string, number>>;
};

export function buildLocationIndex(
  items: { state: string; city: string; lga?: string }[],
): LocationIndex {
  const countByArea: Record<string, Record<string, number>> = {};
  const areaSetByState: Record<string, Set<string>> = {};

  for (const item of items) {
    const area = item.lga || normalizeArea(item.city);
    if (!countByArea[item.state]) countByArea[item.state] = {};
    countByArea[item.state][area] = (countByArea[item.state][area] || 0) + 1;
    if (!areaSetByState[item.state]) areaSetByState[item.state] = new Set();
    areaSetByState[item.state].add(area);
  }

  const states = Object.keys(countByArea).sort((a, b) => a.localeCompare(b));
  const areasByState: Record<string, string[]> = {};
  const countByState: Record<string, number> = {};

  for (const state of states) {
    areasByState[state] = Array.from(areaSetByState[state] || []).sort((a, b) =>
      a.localeCompare(b),
    );
    countByState[state] = Object.values(countByArea[state]).reduce((a, b) => a + b, 0);
  }

  return { states, areasByState, countByState, countByArea };
}

export function stableHash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}
