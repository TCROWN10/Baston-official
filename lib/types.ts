export type ListingCategory = "Buy" | "Rent" | "Shortlet";

export type PropertyType =
  | "Hotel"
  | "Apartment"
  | "Serviced"
  | "Resort"
  | "House"
  | "Villa"
  | "Penthouse"
  | "Land"
  | "Studio";

export type SearchTab = "buy" | "rent" | "shortlet";

export type UserRole =
  | "agent"
  | "guest"
  | "admin"
  | "company"
  | "government"
  | "telecom"
  | "education"
  | "project_manager"
  | "citizen"
  | "field_agent";

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface PropertyOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  companyName?: string;
}

/** Government / marketplace compliance for a listing. */
export type PropertyVerification = "verified" | "pending" | "flagged" | "unregistered";

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  listingCategory: ListingCategory;
  price: number;
  pricePer: "night" | "month" | "year" | "total";
  images: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  location: PropertyLocation;
  owner: PropertyOwner;
  rating: number;
  reviewsCount: number;
  hasHourlyReservation: boolean;
  whatsappNumber?: string;
  contactEmail?: string;
  status: "active" | "draft";
  createdAt: string;
  /** Government verification of the listing / operator */
  verification?: PropertyVerification;
  /** Holds a valid operating / tourism / state license */
  licensed?: boolean;
  /** Registered with CAC / local housing registry */
  registered?: boolean;
  registrationNo?: string;
  licenseNo?: string;
  /** Optional marker for remote-sourced listings when a backend is connected later */
  live?: boolean;
  osmId?: number;
  lat?: number;
  lng?: number;
}

export interface SearchFilters {
  location: string;
  propertyType: string;
  bedsBath: string;
  priceRange: string;
}

export interface SavedHome {
  id: string;
  title: string;
  location: string;
  image: string;
  price: string;
  details: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  state?: string;
  lga?: string;
  role: UserRole;
  companyName?: string;
  password: string;
  createdAt?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  content: string[];
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  image: string;
  location: string;
  checkIn: string;
  checkOut: string;
  status: "upcoming" | "past" | "canceled";
  total: string;
}
