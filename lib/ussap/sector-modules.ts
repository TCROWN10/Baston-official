export type SectorModuleId =
  | "education"
  | "health"
  | "billboards"
  | "hospitality"
  | "telecom"
  | "core";

export type SectorModuleBlock = {
  title: string;
  items: string[];
};

export type SectorDefinition = {
  id: SectorModuleId;
  number: number;
  title: string;
  tagline: string;
  modules: SectorModuleBlock[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  govHref?: string;
  govLabel?: string;
};

/** Bastion TECHNOLOGY — cross-cutting platform services. */
export const BASTION_SERVICES = {
  name: "Bastion TECHNOLOGY",
  title: "Cross-Cutting Core Modules: Monitoring, Assessment, & Data",
  tagline:
    "Bastion TECHNOLOGY cuts across every sector — powering field data collection and project lifecycle monitoring from one platform.",
  modules: [
    {
      title: "Universal Data Gathering Engine",
      items: [
        "Drag-and-drop form builder supporting GPS coordinate tagging",
        "Offline data collection with sync when online",
        "Media uploads (photos/videos), timestamps, and digital signatures",
      ],
    },
    {
      title: "Project Monitoring Workflows",
      items: [
        "Lifecycle tracker for public or private capital projects from conception to completion",
        "Milestone approvals and contractor accountability",
        "Visual progress verification with geo-tagged media",
      ],
    },
  ],
} as const;

export const SECTOR_DEFINITIONS: SectorDefinition[] = [
  {
    id: "education",
    number: 1,
    title: "Education Sector",
    tagline:
      "Registered and non-registered institutions mapped by tier, setting, infrastructure, and learning outcomes.",
    primaryHref: "/ussap/schools",
    primaryLabel: "Open schools registry",
    secondaryHref: "/schools",
    secondaryLabel: "Public directory",
    govHref: "/government/schools",
    govLabel: "Government verification",
    modules: [
      {
        title: "Categorization & Directory",
        items: [
          "Dynamic database dividing entries into Registered vs. Non-Registered institutions",
          "Mapped by tier: Primary, Secondary, and Tertiary",
          "Ownership split: Private, State, and Federal",
        ],
      },
      {
        title: "Geospatial & Setting Filters",
        items: [
          "Granular filtering to separate urban vs. rural access",
          "Density analysis for school placement and catchment planning",
          "Funding allocation views tied to location and setting",
        ],
      },
      {
        title: "Infrastructure & Facility Assessment",
        items: [
          "Digital inspection modules tracking classroom capacity",
          "Water and sanitation access logging",
          "Power availability and structural integrity photo audit trails",
        ],
      },
      {
        title: "Teacher–Student Assessment",
        items: [
          "Student-to-teacher ratio metrics",
          "Attendance tracking and textbook availability",
          "Standardized performance outcomes mapped against building conditions",
        ],
      },
    ],
  },
  {
    id: "health",
    number: 2,
    title: "Health Sector",
    tagline:
      "End-to-end facility hierarchy from tertiary hospitals to rural health centres, with field services and resource audits.",
    primaryHref: "/ussap/health",
    primaryLabel: "Open health module",
    secondaryHref: "/ussap/map",
    secondaryLabel: "View on map",
    modules: [
      {
        title: "Facility Hierarchy Mapping",
        items: [
          "Government General and Tertiary Hospitals",
          "Private Hospitals and specialist clinics",
          "Rural Health Centres (RHCs) and Community Centres",
        ],
      },
      {
        title: "Specialized Care & Field Services",
        items: [
          "Mobile health team deployment tracking",
          "Midwifery deployment and maternal/child health indexes",
          "Immunization cold-chain monitoring",
        ],
      },
      {
        title: "Infrastructure & Resource Audits",
        items: [
          "Equipment availability: diagnostic machines, hospital beds",
          "Pharmaceutical stock level logging",
          "Electricity/solar reliability and geo-tagged asset condition reporting",
        ],
      },
    ],
  },
  {
    id: "billboards",
    number: 3,
    title: "Billboards & Outdoor Advertising Sector",
    tagline:
      "Geo-tagged outdoor signage inventory with permit compliance and revenue enforcement workflows.",
    primaryHref: "/ussap/billboards",
    primaryLabel: "Open billboard registry",
    secondaryHref: "/government/billboards",
    secondaryLabel: "Permit verification",
    modules: [
      {
        title: "Digital Inventory & Mapping",
        items: [
          "Geo-tagged asset registry for legal vs. unauthorized signage",
          "Urban and transit corridor coverage mapping",
          "Digital addresses linked to each outdoor asset",
        ],
      },
      {
        title: "Compliance & Revenue Enforcement",
        items: [
          "Automated expiry tracking for permits",
          "Size and dimension verification via photo uploads",
          "Structural stability audits and levy tracking",
        ],
      },
    ],
  },
  {
    id: "hospitality",
    number: 4,
    title: "Hotels & Hospitality Sector",
    tagline:
      "Complete hospitality directory with tier classification, compliance checklists, and quality control inspections.",
    primaryHref: "/hotels",
    primaryLabel: "Browse hotels",
    secondaryHref: "/government/hotels",
    secondaryLabel: "Compliance registry",
    modules: [
      {
        title: "Registry & Classification",
        items: [
          "Complete directory of hospitality providers",
          "Categorization by tier, capacity, and operational status",
          "Geo-tagged digital addresses for every listed property",
        ],
      },
      {
        title: "Compliance & Quality Control",
        items: [
          "Automated digital inspection checklists for hygiene ratings",
          "Fire safety protocol verification",
          "Structural compliance and tourist tax auditing",
        ],
      },
    ],
  },
  {
    id: "telecom",
    number: 5,
    title: "Telecoms Sector",
    tagline:
      "Comprehensive tower and fibre inventory with performance tracking and remote site maintenance verification.",
    primaryHref: "/ussap/telecom",
    primaryLabel: "Open telecom registry",
    secondaryHref: "/ussap/map",
    secondaryLabel: "Tower map",
    modules: [
      {
        title: "Infrastructure Inventory",
        items: [
          "Cellular towers and base transceiver stations (BTS)",
          "Fibre routing nodes and power installations",
          "Geo-tagged registry with operator and sensitivity tags",
        ],
      },
      {
        title: "Performance & Maintenance Tracking",
        items: [
          "Signal footprint logging and uptime analytics",
          "Remote mast site monitoring and access control",
          "Photographic verification of scheduled maintenance",
        ],
      },
    ],
  },
  {
    id: "core",
    number: 6,
    title: BASTION_SERVICES.title,
    tagline: BASTION_SERVICES.tagline,
    primaryHref: "/ussap/field",
    primaryLabel: "Field data collection",
    secondaryHref: "/ussap/projects",
    secondaryLabel: "Project monitoring",
    govHref: "/ussap/sectors/core",
    govLabel: "Full overview",
    modules: BASTION_SERVICES.modules.map((m) => ({
      title: m.title,
      items: [...m.items],
    })),
  },
];

export function getSectorDefinition(id: SectorModuleId): SectorDefinition | undefined {
  return SECTOR_DEFINITIONS.find((s) => s.id === id);
}
