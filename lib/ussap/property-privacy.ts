import type { UserRole } from "@/lib/types";
import type { ResidentialSite } from "./types";

/** Who is viewing a property record. */
export type PrivacyViewer = {
  id?: string;
  email?: string;
  role?: UserRole | string;
} | null;

export type PropertyAccessMode = "full" | "owner" | "public";

/** Fields withheld from non-owners (admin & government see all). */
export const CONFIDENTIAL_RESIDENTIAL_FIELDS = [
  "Exact GPS coordinates",
  "Owner email & account ID",
  "Street / plot address",
  "Unit or plot number",
  "Utility meter ID",
  "Delivery instructions",
  "Internal tags & metadata",
  "Sensitivity classification",
  "Registration timestamps",
] as const;

export function hasPrivilegedPropertyAccess(viewer: PrivacyViewer): boolean {
  return viewer?.role === "admin" || viewer?.role === "government";
}

export function isResidentialOwner(site: ResidentialSite, viewer: PrivacyViewer): boolean {
  if (!viewer) return false;
  if (site.ownerUserId && viewer.id && site.ownerUserId === viewer.id) return true;
  if (
    site.ownerEmail &&
    viewer.email &&
    site.ownerEmail.toLowerCase() === viewer.email.toLowerCase()
  ) {
    return true;
  }
  return false;
}

export function getResidentialAccessMode(
  site: ResidentialSite,
  viewer: PrivacyViewer,
): PropertyAccessMode {
  if (hasPrivilegedPropertyAccess(viewer)) return "full";
  if (isResidentialOwner(site, viewer)) return "owner";
  return "public";
}

/** Approximate coordinates (~1 km) for public map display. */
export function approximateCoordinate(value: number): number {
  return Math.round(value * 100) / 100;
}

export type ResidentialPropertyView =
  | { mode: "full" | "owner"; site: ResidentialSite; isRedacted: false }
  | {
      mode: "public";
      site: ResidentialSite;
      isRedacted: true;
      display: PublicResidentialDisplay;
      redactedFields: readonly string[];
    };

export type PublicResidentialDisplay = {
  label: string;
  code: string;
  city: string;
  state: string;
  propertyType: string;
  verification: string;
  sector: string;
  ownerLabel: string;
  latApprox: number;
  lngApprox: number;
};

function buildPublicDisplay(site: ResidentialSite): PublicResidentialDisplay {
  return {
    label: site.label,
    code: site.code,
    city: site.city,
    state: site.state,
    propertyType: site.propertyType,
    verification: site.verification,
    sector: site.sector,
    ownerLabel: site.ownerOrg ? "Registered organisation" : "Private owner",
    latApprox: approximateCoordinate(site.lat),
    lngApprox: approximateCoordinate(site.lng),
  };
}

/** Resolve a residential property view with privacy rules applied. */
export function viewResidentialProperty(
  site: ResidentialSite,
  viewer: PrivacyViewer,
): ResidentialPropertyView {
  const mode = getResidentialAccessMode(site, viewer);
  if (mode === "full" || mode === "owner") {
    return { mode, site, isRedacted: false };
  }
  return {
    mode: "public",
    site,
    isRedacted: true,
    display: buildPublicDisplay(site),
    redactedFields: CONFIDENTIAL_RESIDENTIAL_FIELDS,
  };
}

export function privacyViewerFromUser(user: {
  id?: string;
  email?: string;
  role?: string;
} | null): PrivacyViewer {
  if (!user) return null;
  return { id: user.id, email: user.email, role: user.role };
}
