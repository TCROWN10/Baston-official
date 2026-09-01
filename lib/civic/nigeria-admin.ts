import lgasRaw from "./nigeria-lgas.json";

/** Map external dataset labels to USSAP state names used elsewhere in the app. */
const STATE_ALIASES: Record<string, string> = {
  "Federal Capital Territory": "FCT",
};

const LGAS_BY_STATE: Record<string, string[]> = {};

for (const [rawState, lgas] of Object.entries(lgasRaw as Record<string, string[]>)) {
  const state = STATE_ALIASES[rawState] ?? rawState;
  LGAS_BY_STATE[state] = [...lgas].sort((a, b) => a.localeCompare(b));
}

export const NIGERIA_STATES = Object.keys(LGAS_BY_STATE).sort((a, b) => a.localeCompare(b));

export function lgasForState(state: string): string[] {
  return LGAS_BY_STATE[state] ?? [];
}
