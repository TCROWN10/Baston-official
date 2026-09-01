import type { Property } from "@/lib/types";
import type { PrivacyViewer } from "@/lib/ussap/property-privacy";
import { hasPrivilegedPropertyAccess } from "@/lib/ussap/property-privacy";

export const CONFIDENTIAL_LISTING_FIELDS = [
  "Agent phone number",
  "Agent email",
  "WhatsApp contact",
  "License document number",
  "Registry registration number",
  "Exact street address",
] as const;

export function isListingOwner(property: Property, viewer: PrivacyViewer): boolean {
  if (!viewer) return false;
  if (property.owner.id && viewer.id && property.owner.id === viewer.id) return true;
  if (
    property.owner.email &&
    viewer.email &&
    property.owner.email.toLowerCase() === viewer.email.toLowerCase()
  ) {
    return true;
  }
  return false;
}

export type ListingAccessMode = "full" | "owner" | "public";

export function getListingAccessMode(property: Property, viewer: PrivacyViewer): ListingAccessMode {
  if (hasPrivilegedPropertyAccess(viewer)) return "full";
  if (isListingOwner(property, viewer)) return "owner";
  return "public";
}

export type ListingContactView = {
  name: string;
  companyLabel: string;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  showContactActions: boolean;
};

export type ListingComplianceView = {
  verification: string;
  licensed: boolean;
  licenseDetail: string | null;
  registered: boolean;
  registrationDetail: string | null;
};

export type ListingLocationView = {
  display: string;
  city: string;
  state: string;
  addressLine: string | null;
};

export type ListingPropertyView = {
  mode: ListingAccessMode;
  isRedacted: boolean;
  contact: ListingContactView;
  compliance: ListingComplianceView;
  location: ListingLocationView;
  redactedFields: readonly string[];
};

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "Protected";
  return `${phone.slice(0, Math.min(8, phone.length))} ••••`;
}

export function viewListingProperty(
  property: Property,
  viewer: PrivacyViewer,
): ListingPropertyView {
  const mode = getListingAccessMode(property, viewer);
  const isRedacted = mode === "public";

  const ownerName = `${property.owner.firstName} ${property.owner.lastName}`.trim();

  if (!isRedacted) {
    return {
      mode,
      isRedacted: false,
      contact: {
        name: ownerName,
        companyLabel: property.owner.companyName || "Listed agent",
        phone: property.owner.phone,
        email: property.owner.email,
        whatsapp: property.whatsappNumber || property.owner.phone.replace(/\D/g, ""),
        showContactActions: true,
      },
      compliance: {
        verification: property.verification || "pending",
        licensed: Boolean(property.licensed),
        licenseDetail: property.licenseNo || (property.licensed ? "Licensed" : null),
        registered: Boolean(property.registered),
        registrationDetail:
          property.registrationNo || (property.registered ? "Registered" : null),
      },
      location: {
        display: `${property.location.address}, ${property.location.city}, ${property.location.state}`,
        city: property.location.city,
        state: property.location.state,
        addressLine: property.location.address,
      },
      redactedFields: [],
    };
  }

  return {
    mode: "public",
    isRedacted: true,
    contact: {
      name: property.owner.companyName || "Listed operator",
      companyLabel: "Contact protected",
      phone: property.owner.phone ? maskPhone(property.owner.phone) : null,
      email: null,
      whatsapp: null,
      showContactActions: false,
    },
    compliance: {
      verification: property.verification || "pending",
      licensed: Boolean(property.licensed),
      licenseDetail: null,
      registered: Boolean(property.registered),
      registrationDetail: null,
    },
    location: {
      display: `${property.location.city}, ${property.location.state}`,
      city: property.location.city,
      state: property.location.state,
      addressLine: null,
    },
    redactedFields: CONFIDENTIAL_LISTING_FIELDS,
  };
}
