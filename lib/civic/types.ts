export type VerificationStatus = "pending" | "verified" | "flagged" | "unregistered";

export interface DirectoryPlace {
  id: string;
  source: "openstreetmap" | "registry" | "local" | "google";
  osmId?: number;
  name: string;
  slug: string;
  city: string;
  state: string;
  address: string;
  lat: number;
  lon: number;
  images: string[];
  verification: VerificationStatus;
  live: boolean;
}

export interface HotelRecord extends DirectoryPlace {
  stars: number;
  rooms: number;
  nightlyFrom: number;
  advertActive: boolean;
  tourismBoardNo: string;
  cacNumber: string;
  tin: string;
  taxPaid: number;
  taxOwed: number;
  ownerName: string;
  phone: string;
  website?: string;
}

export interface SchoolRecord extends DirectoryPlace {
  level: "Primary" | "Secondary" | "Tertiary" | "Vocational" | string;
  ownership: "Public" | "Private";
  moeNumber: string;
  students: number;
  teachers?: number;
  establishedYear?: number;
  lga?: string;
  setting?: "Urban" | "Rural";
  registered?: boolean;
  advertising: false;
}

export interface HealthRecord extends DirectoryPlace {
  facilityType:
    | "General Hospital"
    | "Tertiary Hospital"
    | "Private Hospital"
    | "Rural Health Centre"
    | "Community Health Centre"
    | "Clinic"
    | "Specialist";
  ownership: "Government" | "Private" | "Mission";
  tier: "Primary" | "Secondary" | "Tertiary";
  beds: number;
  doctors?: number;
  nurses?: number;
  establishedYear?: number;
  lga?: string;
  setting?: "Urban" | "Rural";
  registered?: boolean;
}

export interface CompanyRecord extends DirectoryPlace {
  sector: string;
  cacNumber: string;
  tin: string;
  taxPaid: number;
  taxOwed: number;
  employees: number;
}

export interface VehicleRecord {
  id: string;
  plate: string;
  make: string;
  model: string;
  color: string;
  year: number;
  ownerName: string;
  ownerType: "individual" | "company" | "government";
  state: string;
  licenceExpiry: string;
  insuranceExpiry: string;
  roadworthinessExpiry: string;
  taxPaid: number;
  taxOwed: number;
  status: "compliant" | "expired" | "watchlist";
}

export interface CctvCamera {
  id: string;
  name: string;
  operator: string;
  state: string;
  city: string;
  lat: number;
  lon: number;
  type: "traffic" | "organization" | "market" | "highway";
  online: boolean;
}

export interface PlateEvent {
  id: string;
  cameraId: string;
  plate: string;
  detectedAt: string;
  confidence: number;
  papersExpired: boolean;
  flags: string[];
}

export interface BillboardRecord {
  id: string;
  location: string;
  state: string;
  city: string;
  lga?: string;
  operator: string;
  permitNo: string;
  permitExpiry: string;
  taxPaid: number;
  taxOwed: number;
  verification: VerificationStatus;
  /** Real outdoor advertising photo */
  image?: string;
  boardType?: "static" | "digital" | "unipole" | "rooftop" | "wallscape";
  sizeLabel?: string;
  lat?: number;
  lon?: number;
}

export interface MarketRecord {
  id: string;
  name: string;
  state: string;
  city: string;
  stalls: number;
  levyPaid: number;
  levyOwed: number;
  verification: VerificationStatus;
  hasCctv: boolean;
}

export interface ProjectRecord {
  id: string;
  title: string;
  ministry: string;
  state: string;
  budget: number;
  spent: number;
  progress: number;
  status: "on-track" | "delayed" | "completed" | "flagged";
  contractor: string;
}

export interface TaxLedgerRow {
  id: string;
  entityType: "hotel" | "company" | "vehicle" | "billboard" | "market";
  entityName: string;
  tin?: string;
  state: string;
  taxPaid: number;
  taxOwed: number;
  lastPayment: string;
}
