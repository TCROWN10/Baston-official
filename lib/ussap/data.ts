import { encodeGrid } from "./geocode";
import type {
  ProjectSite,
  ResidentialSite,
  SchoolSite,
  TelecomSite,
  TrafficSite,
  UssapSite,
} from "./types";

const now = "2026-08-26T10:00:00.000Z";

function base(
  lat: number,
  lng: number,
  label: string,
  state: string,
  city: string,
  extra: Partial<UssapSite> = {},
) {
  return {
    code: encodeGrid(lat, lng, 8),
    lat,
    lng,
    label,
    state,
    city,
    verification: "verified" as const,
    sensitivity: "public" as const,
    createdAt: now,
    updatedAt: now,
    ...extra,
  };
}

export const TELECOM_SITES: TelecomSite[] = [
  {
    ...base(6.4474, 3.4722, "9mobile Lekki Cell Site", "Lagos", "Lekki"),
    sector: "telecom",
    towerId: "9MO-LAG-LEK-088",
    operator: "9mobile",
    technology: ["4G"],
    heightM: 32,
    equipment: [{ name: "RRU", model: "Ericsson Radio" }],
    lastMaintenance: "2026-05-20",
    nextMaintenance: "2026-08-20",
    maintenanceRouteId: "ROUTE-LAG-EAST-B",
  },
  {
    ...base(6.4282, 3.4219, "MTN Victoria Island Rooftop", "Lagos", "Victoria Island"),
    sector: "telecom",
    towerId: "MTN-LAG-VI-022",
    operator: "MTN Nigeria",
    technology: ["4G", "5G"],
    heightM: 28,
    equipment: [{ name: "Small cell", model: "Nokia Flexi" }],
    lastMaintenance: "2026-07-01",
    nextMaintenance: "2026-10-01",
    maintenanceRouteId: "ROUTE-LAG-ISLAND",
  },
  {
    ...base(9.0579, 7.4951, "Airtel Maitama Macro Site", "FCT", "Maitama"),
    sector: "telecom",
    towerId: "AIR-FCT-MAI-011",
    operator: "Airtel Nigeria",
    technology: ["4G"],
    heightM: 40,
    equipment: [{ name: "Antenna", model: "Kathrein 800" }],
    lastMaintenance: "2026-06-15",
    nextMaintenance: "2026-09-15",
    maintenanceRouteId: "ROUTE-FCT-MAITAMA",
  },
  {
    ...base(6.5244, 3.3792, "MTN Ikeja Macro Tower", "Lagos", "Ikeja", {
      sensitivity: "restricted",
      ownerOrg: "MTN Nigeria",
    }),
    sector: "telecom",
    towerId: "MTN-LAG-IKJ-014",
    operator: "MTN Nigeria",
    technology: ["4G", "5G"],
    heightM: 45,
    equipment: [
      { name: "RRU", model: "Huawei 5900", serial: "HW-5900-014" },
      { name: "Antenna", model: "Kathrein 80010692" },
    ],
    lastMaintenance: "2026-07-12",
    nextMaintenance: "2026-10-12",
    maintenanceRouteId: "ROUTE-LAG-WEST-A",
  },
  {
    ...base(9.0765, 7.3986, "Airtel Abuja CBD Tower", "FCT", "Central Business District", {
      sensitivity: "restricted",
      ownerOrg: "Airtel Nigeria",
    }),
    sector: "telecom",
    towerId: "AIR-FCT-CBD-003",
    operator: "Airtel Nigeria",
    technology: ["4G", "5G"],
    heightM: 52,
    equipment: [{ name: "BBU", model: "Nokia AirScale", serial: "NK-AS-003" }],
    lastMaintenance: "2026-06-01",
    nextMaintenance: "2026-09-01",
    maintenanceRouteId: "ROUTE-FCT-CENTRAL",
  },
  {
    ...base(4.8156, 7.0498, "Glo Port Harcourt Fibre Hub", "Rivers", "Port Harcourt", {
      sensitivity: "classified",
      ownerOrg: "Globacom",
    }),
    sector: "telecom",
    towerId: "GLO-RIV-PH-021",
    operator: "Globacom",
    technology: ["Fibre", "4G"],
    heightM: 38,
    equipment: [{ name: "OLT", model: "ZTE C600" }],
    lastMaintenance: "2026-08-01",
    nextMaintenance: "2026-11-01",
  },
];

export const PROJECT_SITES: ProjectSite[] = [
  {
    ...base(6.508, 3.399, "Lagos Blue Line Extension Site", "Lagos", "Lagos Island", {
      ownerOrg: "LAMATA",
      sensitivity: "restricted",
    }),
    sector: "project",
    projectCode: "PRJ-LAG-BLU-EXT",
    ministry: "Ministry of Transportation",
    contractor: "CRCC / LAMATA partners",
    progress: 68,
    status: "active",
    media: [
      {
        id: "m1",
        type: "photo",
        url: "/listings/company-1.jpg",
        caption: "Track bed progress — pier 12",
        lat: 6.5081,
        lng: 3.3992,
        capturedAt: "2026-08-20T09:30:00.000Z",
        uploadedBy: "pm@ussap.ng",
      },
    ],
  },
  {
    ...base(9.057, 7.495, "Abuja CCTV Command Centre Upgrade", "FCT", "Central Area", {
      ownerOrg: "FCT Administration",
      sensitivity: "classified",
    }),
    sector: "project",
    projectCode: "PRJ-FCT-CCTV-01",
    ministry: "FCT Administration",
    contractor: "National Security Systems Ltd",
    progress: 44,
    status: "delayed",
    media: [],
  },
  {
    ...base(12.002, 8.592, "Kano–Kaduna Highway Rehab Segment", "Kano", "Kano", {
      ownerOrg: "Federal Ministry of Works",
    }),
    sector: "project",
    projectCode: "PRJ-KAN-HWY-09",
    ministry: "Federal Ministry of Works",
    contractor: "Julius Berger / FCC",
    progress: 39,
    status: "active",
    media: [],
  },
];

export const TRAFFIC_SITES: TrafficSite[] = [
  {
    ...base(6.508, 3.399, "Third Mainland Bridge NB Camera", "Lagos", "Lagos Island"),
    sector: "traffic",
    siteType: "camera",
    operator: "Lagos Traffic Management",
    statusTag: "online",
    realtimeNote: "Flow normal · 62 km/h avg",
  },
  {
    ...base(6.441, 3.528, "Lekki–Epe Toll Congestion Hotspot", "Lagos", "Lekki"),
    sector: "traffic",
    siteType: "congestion",
    operator: "Lagos Traffic Management",
    statusTag: "congested",
    realtimeNote: "Peak delay +28 min westbound",
  },
  {
    ...base(9.069, 7.465, "Wuse Market Approach Camera", "FCT", "Wuse"),
    sector: "traffic",
    siteType: "monitoring_post",
    operator: "FCT Traffic",
    statusTag: "clear",
  },
  {
    ...base(6.455, 3.389, "CMS Accident-Prone Zone", "Lagos", "Lagos Island"),
    sector: "traffic",
    siteType: "accident_zone",
    operator: "FRSC Lagos",
    statusTag: "incident",
    realtimeNote: "Historical blackspot · enhanced patrol",
  },
];

export const SCHOOL_SITES: SchoolSite[] = [
  {
    ...base(6.5244, 3.3792, "Lagos State Model College Ikeja", "Lagos", "Ikeja"),
    sector: "school",
    schoolType: "secondary",
    ownership: "public",
    enrollment: 2400,
    emergencyContact: "+234 801 200 1001",
  },
  {
    ...base(9.0579, 7.4951, "Government Secondary School Garki", "FCT", "Garki"),
    sector: "school",
    schoolType: "secondary",
    ownership: "public",
    enrollment: 1800,
    emergencyContact: "+234 809 300 2002",
  },
  {
    ...base(7.3775, 3.947, "University of Ibadan Main Gate", "Oyo", "Ibadan"),
    sector: "school",
    schoolType: "tertiary",
    ownership: "public",
    enrollment: 35000,
    emergencyContact: "+234 805 400 3003",
  },
];

export const RESIDENTIAL_SITES: ResidentialSite[] = [
  {
    ...base(6.4474, 3.4722, "Lekki Phase 1 Residence · Plot 14", "Lagos", "Lekki", {
      ownerOrg: "Private homeowner",
    }),
    sector: "residential",
    propertyType: "house",
    unitNo: "Plot 14",
    utilityMeterId: "EKEDC-LP1-88421",
    deliveryNotes: "Blue gate · ring twice",
    shareable: true,
  },
  {
    ...base(9.078, 7.483, "Maitama Avenue Apartment 5B", "FCT", "Maitama"),
    sector: "residential",
    propertyType: "apartment",
    unitNo: "5B",
    utilityMeterId: "AEDC-MAI-22109",
    deliveryNotes: "Use visitor lobby",
    shareable: true,
  },
  {
    ...base(6.5244, 3.3792, "Ikeja GRA Compound Unit C2", "Lagos", "Ikeja"),
    sector: "residential",
    propertyType: "compound",
    unitNo: "C2",
    shareable: false,
    verification: "pending",
  },
];

export function allSites(): UssapSite[] {
  return [
    ...TELECOM_SITES,
    ...PROJECT_SITES,
    ...TRAFFIC_SITES,
    ...SCHOOL_SITES,
    ...RESIDENTIAL_SITES,
  ];
}

export function findByCode(code: string): UssapSite | undefined {
  const n = code.replace(/[^0-9A-Z]/gi, "").toUpperCase();
  return allSites().find((s) => s.code.replace(/[^0-9A-Z]/gi, "") === n);
}

export const BRAND = {
  name: "USSAP",
  fullName: "Unified Smart Spatial Addressing Platform",
  tagline: "Precise digital addresses for Nigeria’s critical places",
};
