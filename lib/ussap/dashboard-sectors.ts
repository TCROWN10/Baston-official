import type { SectorModuleId } from "./sector-modules";
import { SECTOR_DEFINITIONS } from "./sector-modules";

export type SectorQuickAction = {
  label: string;
  href: string;
  primary?: boolean;
};

export type SectorUserGuide = {
  id: SectorModuleId;
  howToUse: string[];
  quickActions: SectorQuickAction[];
};

/** Practical ways registered users can engage with each USSAP sector. */
export const SECTOR_USER_GUIDES: SectorUserGuide[] = [
  {
    id: "education",
    howToUse: [
      "Browse registered and unregistered schools filtered by your state and LGA.",
      "Review teacher–student ratios, infrastructure photos, and ownership (public vs private).",
      "Open a school profile to verify location, tier, and facility audit trails.",
    ],
    quickActions: [
      { label: "Browse schools", href: "/ussap/schools", primary: true },
      { label: "Sector overview", href: "/ussap/sectors/education" },
    ],
  },
  {
    id: "health",
    howToUse: [
      "Find hospitals, clinics, and rural health centres in your local government area.",
      "Compare bed capacity, doctors, nurses, and equipment availability.",
      "Use the live map to see facility density across your state.",
    ],
    quickActions: [
      { label: "Browse health facilities", href: "/ussap/health", primary: true },
      { label: "View on map", href: "/ussap/map" },
    ],
  },
  {
    id: "billboards",
    howToUse: [
      "Explore geo-tagged outdoor advertising inventory in urban and transit corridors.",
      "Check permit status, dimensions, and structural compliance records.",
      "Link billboard assets to digital addresses for enforcement and revenue tracking.",
    ],
    quickActions: [
      { label: "Open billboard registry", href: "/ussap/billboards", primary: true },
      { label: "Sector overview", href: "/ussap/sectors/billboards" },
    ],
  },
  {
    id: "hospitality",
    howToUse: [
      "Browse verified hotels and short-stay listings across Nigeria.",
      "Publish your own hospitality or property listing from your dashboard.",
      "Cross-reference compliance checklists for hygiene, fire safety, and licensing.",
    ],
    quickActions: [
      { label: "Browse hotels", href: "/hotels", primary: true },
      { label: "Add a listing", href: "/dashboard/listing" },
    ],
  },
  {
    id: "telecom",
    howToUse: [
      "View cellular towers, BTS sites, and fibre nodes on the infrastructure map.",
      "Track uptime, maintenance schedules, and operator assignments.",
      "Use geo-tagged registry entries for site access and field verification.",
    ],
    quickActions: [
      { label: "Telecom registry", href: "/ussap/telecom", primary: true },
      { label: "Tower map", href: "/ussap/map" },
    ],
  },
  {
    id: "core",
    howToUse: [
      "Collect field data offline with GPS-tagged forms — sync when you reconnect.",
      "Upload geo-tagged photos and videos for project progress verification.",
      "Monitor capital projects from conception to completion with milestone tracking.",
    ],
    quickActions: [
      { label: "Field data collection", href: "/ussap/field", primary: true },
      { label: "Project monitoring", href: "/ussap/projects" },
      { label: "Bastion overview", href: "/ussap/sectors/core" },
    ],
  },
];

export type DashboardSector = {
  id: SectorModuleId;
  number: number;
  title: string;
  shortTitle: string;
  tagline: string;
  howToUse: string[];
  quickActions: SectorQuickAction[];
};

export function getDashboardSectors(): DashboardSector[] {
  return SECTOR_DEFINITIONS.map((sector) => {
    const guide = SECTOR_USER_GUIDES.find((g) => g.id === sector.id)!;
    const shortTitle =
      sector.id === "core"
        ? "Bastion TECHNOLOGY"
        : sector.title.replace(" Sector", "").replace("Billboards & Outdoor Advertising", "Billboards");
    return {
      id: sector.id,
      number: sector.number,
      title: sector.title,
      shortTitle,
      tagline: sector.tagline,
      howToUse: guide.howToUse,
      quickActions: guide.quickActions,
    };
  });
}

export function sectorHrefWithLocation(
  baseHref: string,
  state?: string,
  lga?: string,
): string {
  if (!state) return baseHref;
  const params = new URLSearchParams({ state });
  if (lga) params.set("lga", lga);
  return `${baseHref}?${params.toString()}`;
}
