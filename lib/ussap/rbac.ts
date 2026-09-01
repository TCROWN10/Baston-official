import type { SectorKind, Sensitivity, UssapRole } from "./types";

/** Role-based access for sensitive infrastructure (telecom / classified projects). */
const ROLE_SECTORS: Record<UssapRole, SectorKind[] | "*"> = {
  admin: "*",
  government: "*",
  telecom: ["telecom", "traffic"],
  education: ["school", "residential", "traffic"],
  project_manager: ["project", "residential", "traffic"],
  citizen: ["school", "residential", "traffic"],
  field_agent: ["telecom", "project", "traffic", "school", "residential"],
};

const SENSITIVITY_CLEARANCE: Record<UssapRole, Sensitivity[]> = {
  admin: ["public", "restricted", "classified"],
  government: ["public", "restricted", "classified"],
  telecom: ["public", "restricted", "classified"],
  education: ["public", "restricted"],
  project_manager: ["public", "restricted"],
  citizen: ["public"],
  field_agent: ["public", "restricted"],
};

/** Marketplace roles (agent/company/guest) are not USSAP RBAC roles — treat as public-only. */
const PUBLIC_SECTORS: SectorKind[] = ["school", "residential", "traffic"];

export function canAccessSector(
  role: UssapRole | string | null | undefined,
  sector: SectorKind,
): boolean {
  if (!role) return false;
  const allowed = ROLE_SECTORS[role as UssapRole];
  if (!allowed) return PUBLIC_SECTORS.includes(sector);
  return allowed === "*" || allowed.includes(sector);
}

export function canViewSensitivity(
  role: UssapRole | string | null | undefined,
  sensitivity: Sensitivity,
): boolean {
  if (!role) return sensitivity === "public";
  const clearance = SENSITIVITY_CLEARANCE[role as UssapRole];
  if (!clearance) return sensitivity === "public";
  return clearance.includes(sensitivity);
}

export function canEditSector(role: UssapRole, sector: SectorKind): boolean {
  if (role === "admin" || role === "government") return true;
  if (role === "telecom" && sector === "telecom") return true;
  if (role === "education" && sector === "school") return true;
  if (role === "project_manager" && sector === "project") return true;
  if (role === "citizen" && sector === "residential") return true;
  if (role === "field_agent") return true;
  return false;
}

export function dashboardPath(role: UssapRole | string): string {
  switch (role) {
    case "admin":
      return "/ussap/console";
    case "government":
      return "/government";
    case "telecom":
      return "/ussap/telecom";
    case "education":
      return "/ussap/schools";
    case "project_manager":
      return "/ussap/projects";
    case "field_agent":
      return "/ussap/field";
    case "citizen":
      return "/ussap/residential";
    case "agent":
      return "/dashboard";
    case "company":
      return "/dashboard";
    case "guest":
      return "/account";
    default:
      return "/";
  }
}

/** Human-readable role definitions for the product (not credentials). */
export const ROLE_DEFINITIONS: {
  role: UssapRole;
  title: string;
  audience: string;
  home: string;
}[] = [
  {
    role: "citizen",
    title: "Citizen / homeowner",
    audience: "Register and share residential digital addresses, browse public maps.",
    home: "/ussap/residential",
  },
  {
    role: "telecom",
    title: "Telecom operator",
    audience: "Manage tower sites, equipment, and maintenance routes (restricted data).",
    home: "/ussap/telecom",
  },
  {
    role: "project_manager",
    title: "Project manager",
    audience: "Track geo-tagged project progress and upload site media.",
    home: "/ussap/projects",
  },
  {
    role: "education",
    title: "School / education",
    audience: "Maintain verified school location profiles.",
    home: "/ussap/schools",
  },
  {
    role: "field_agent",
    title: "Field agent",
    audience: "Drop offline pins and sync digital addresses from the field.",
    home: "/ussap/field",
  },
  {
    role: "government",
    title: "Government / municipality",
    audience: "Civic oversight: hotels, taxes, CCTV, markets, projects — not the platform admin console.",
    home: "/government",
  },
  {
    role: "admin",
    title: "Platform administrator",
    audience: "USSAP system console only. Not for regular users or government officers.",
    home: "/ussap/console",
  },
];

/** Keep demo seeds in code for local testing — never show passwords on public UI. */
export const DEMO_ACCOUNTS = [
  { email: "admin@ussap.ng", password: "admin123", role: "admin" as const, name: "USSAP Admin" },
  { email: "gov@ussap.ng", password: "gov123", role: "government" as const, name: "Municipal Planner" },
  { email: "telecom@ussap.ng", password: "telecom123", role: "telecom" as const, name: "Telecom Operator" },
  { email: "pm@ussap.ng", password: "pm123", role: "project_manager" as const, name: "Project Manager" },
  { email: "school@ussap.ng", password: "school123", role: "education" as const, name: "School Admin" },
  { email: "citizen@ussap.ng", password: "citizen123", role: "citizen" as const, name: "Homeowner" },
  { email: "field@ussap.ng", password: "field123", role: "field_agent" as const, name: "Field Agent" },
];

export function canAccessAdminConsole(role?: string | null): boolean {
  return role === "admin";
}

export function canAccessGovernmentPortal(role?: string | null): boolean {
  return role === "government" || role === "admin";
}