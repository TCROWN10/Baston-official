/** Nigeria ISO3166-2 codes for Overpass area queries */
export const STATE_ISO: Record<string, string> = {
  Abia: "NG-AB",
  Adamawa: "NG-AD",
  "Akwa Ibom": "NG-AK",
  Anambra: "NG-AN",
  Bauchi: "NG-BA",
  Bayelsa: "NG-BY",
  Benue: "NG-BE",
  Borno: "NG-BO",
  "Cross River": "NG-CR",
  Delta: "NG-DE",
  Ebonyi: "NG-EB",
  Edo: "NG-ED",
  Ekiti: "NG-EK",
  Enugu: "NG-EN",
  FCT: "NG-FC",
  Gombe: "NG-GO",
  Imo: "NG-IM",
  Jigawa: "NG-JI",
  Kaduna: "NG-KD",
  Kano: "NG-KN",
  Katsina: "NG-KT",
  Kebbi: "NG-KE",
  Kogi: "NG-KO",
  Kwara: "NG-KW",
  Lagos: "NG-LA",
  Nasarawa: "NG-NA",
  Niger: "NG-NI",
  Ogun: "NG-OG",
  Ondo: "NG-ON",
  Osun: "NG-OS",
  Oyo: "NG-OY",
  Plateau: "NG-PL",
  Rivers: "NG-RI",
  Sokoto: "NG-SO",
  Taraba: "NG-TA",
  Yobe: "NG-YO",
  Zamfara: "NG-ZA",
};

export const PRIORITY_STATES = [
  "Lagos",
  "FCT",
  "Rivers",
  "Oyo",
  "Kano",
  "Kaduna",
  "Edo",
  "Delta",
  "Ogun",
  "Enugu",
  "Anambra",
  "Imo",
  "Abia",
  "Akwa Ibom",
  "Cross River",
  "Kwara",
  "Plateau",
  "Benue",
  "Niger",
  "Osun",
  "Ondo",
  "Ekiti",
  "Bauchi",
  "Gombe",
  "Borno",
  "Adamawa",
  "Taraba",
  "Yobe",
  "Sokoto",
  "Kebbi",
  "Zamfara",
  "Katsina",
  "Jigawa",
  "Nasarawa",
  "Bayelsa",
  "Ebonyi",
];

export function inferStateFromTags(tags: Record<string, string>, fallback = "Nigeria"): string {
  const raw =
    tags["addr:state"] ||
    tags["is_in:state"] ||
    tags.state ||
    tags["addr:province"] ||
    "";
  if (!raw) return fallback;
  const hit = Object.keys(STATE_ISO).find(
    (s) => s.toLowerCase() === raw.toLowerCase() || raw.toLowerCase().includes(s.toLowerCase()),
  );
  if (hit) return hit;
  if (/abuja|fct/i.test(raw)) return "FCT";
  return raw;
}
