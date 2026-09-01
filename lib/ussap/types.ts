/** USSAP — Unified Smart Spatial Addressing Platform */

export type UssapRole =
  | "admin"
  | "government"
  | "telecom"
  | "education"
  | "project_manager"
  | "citizen"
  | "field_agent";

export type SectorKind =
  | "telecom"
  | "project"
  | "traffic"
  | "school"
  | "residential";

export type VerificationStatus = "verified" | "pending" | "flagged" | "draft";

export type Sensitivity = "public" | "restricted" | "classified";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface DigitalAddress {
  /** Unique 6–8 character alphanumeric grid code */
  code: string;
  lat: number;
  lng: number;
  label: string;
  sector: SectorKind;
  state: string;
  city: string;
  description?: string;
  verification: VerificationStatus;
  sensitivity: Sensitivity;
  createdAt: string;
  updatedAt: string;
  ownerOrg?: string;
  ownerUserId?: string;
  ownerEmail?: string;
  tags?: string[];
}

export interface TelecomSite extends DigitalAddress {
  sector: "telecom";
  towerId: string;
  operator: string;
  technology: string[];
  heightM: number;
  equipment: { name: string; model: string; serial?: string }[];
  lastMaintenance?: string;
  nextMaintenance?: string;
  maintenanceRouteId?: string;
  /** Site / tower photo */
  image?: string;
}

export interface ProjectSite extends DigitalAddress {
  sector: "project";
  projectCode: string;
  ministry?: string;
  contractor: string;
  progress: number;
  status: "planned" | "active" | "delayed" | "completed";
  media: ProjectMedia[];
}

export interface ProjectMedia {
  id: string;
  type: "photo" | "video";
  url: string;
  caption?: string;
  lat: number;
  lng: number;
  capturedAt: string;
  uploadedBy: string;
  offlineId?: string;
}

export interface TrafficSite extends DigitalAddress {
  sector: "traffic";
  siteType: "camera" | "congestion" | "accident_zone" | "monitoring_post";
  operator: string;
  statusTag: "online" | "offline" | "congested" | "clear" | "incident";
  realtimeNote?: string;
}

export interface SchoolSite extends DigitalAddress {
  sector: "school";
  schoolType: "primary" | "secondary" | "tertiary" | "vocational";
  ownership: "public" | "private" | "mission";
  enrollment?: number;
  emergencyContact?: string;
}

export interface ResidentialSite extends DigitalAddress {
  sector: "residential";
  propertyType: "house" | "apartment" | "compound" | "estate_unit";
  unitNo?: string;
  utilityMeterId?: string;
  deliveryNotes?: string;
  shareable: boolean;
}

export type UssapSite =
  | TelecomSite
  | ProjectSite
  | TrafficSite
  | SchoolSite
  | ResidentialSite;

export interface OfflinePin {
  id: string;
  lat: number;
  lng: number;
  code?: string;
  label: string;
  sector: SectorKind;
  notes?: string;
  mediaDataUrls?: string[];
  createdAt: string;
  synced: boolean;
}

export interface MapLayerId {
  id: "osm" | "satellite" | "telecom" | "projects" | "traffic" | "schools" | "residential";
  label: string;
}
