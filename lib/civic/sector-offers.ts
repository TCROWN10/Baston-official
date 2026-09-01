import { PROPERTIES } from "@/lib/data";
import { BILLBOARDS } from "@/lib/civic/government";
import { HOTELS } from "@/lib/civic/directory";
import { enrichedHealthFacilities, enrichedSchools } from "@/lib/civic/enrich";
import { DEFAULT_BILLBOARD_FALLBACK } from "@/lib/civic/facility-images";
import {
  DEFAULT_HEALTH_FALLBACK,
  DEFAULT_SCHOOL_FALLBACK,
} from "@/lib/civic/facility-images";
import { TELECOM_SITES } from "@/lib/ussap/data";
import type { VerificationStatus } from "@/lib/civic/types";

export type SectorOfferKind =
  | "hotel"
  | "school"
  | "health"
  | "billboard"
  | "telecom"
  | "shortlet";

export type SectorOffer = {
  id: string;
  kind: SectorOfferKind;
  title: string;
  location: string;
  image: string;
  href: string;
  sectorLabel: string;
  dealText?: string;
  meta?: string;
  verification: VerificationStatus;
};

const SECTOR_LABELS: Record<SectorOfferKind, string> = {
  hotel: "Hotels",
  school: "Education",
  health: "Health",
  billboard: "Billboards",
  telecom: "Telecom",
  shortlet: "Shortlet",
};

function interleave<T>(groups: T[][]): T[] {
  const out: T[] = [];
  const max = Math.max(0, ...groups.map((g) => g.length));
  for (let i = 0; i < max; i++) {
    for (const group of groups) {
      if (group[i]) out.push(group[i]);
    }
  }
  return out;
}

function hotelOffers(): SectorOffer[] {
  return HOTELS.filter((h) => h.verification === "verified")
    .sort((a, b) => b.stars - a.stars || b.nightlyFrom - a.nightlyFrom)
    .slice(0, 4)
    .map((h) => ({
      id: `hotel-${h.id}`,
      kind: "hotel" as const,
      title: h.name,
      location: `${h.city}, ${h.state}`,
      image: h.images[0] || "/listings/hotel-1.jpg",
      href: `/hotels/${h.slug}`,
      sectorLabel: SECTOR_LABELS.hotel,
      dealText: h.advertActive ? `From ₦${h.nightlyFrom.toLocaleString()}/night` : undefined,
      meta: `${h.stars}★ · ${h.rooms} rooms`,
      verification: h.verification,
    }));
}

function schoolOffers(): SectorOffer[] {
  return enrichedSchools()
    .filter((s) => s.verification === "verified")
    .sort((a, b) => b.students - a.students)
    .slice(0, 4)
    .map((s) => ({
      id: `school-${s.id}`,
      kind: "school" as const,
      title: s.name,
      location: `${s.lga || s.city}, ${s.state}`,
      image: s.images[0] || DEFAULT_SCHOOL_FALLBACK,
      href: `/ussap/schools/${s.slug}`,
      sectorLabel: SECTOR_LABELS.school,
      dealText: s.registered ? "Registered institution" : undefined,
      meta: `${s.level} · ${s.ownership}`,
      verification: s.verification,
    }));
}

function healthOffers(): SectorOffer[] {
  return enrichedHealthFacilities()
    .filter((h) => h.verification === "verified")
    .sort((a, b) => b.beds - a.beds)
    .slice(0, 4)
    .map((h) => ({
      id: `health-${h.id}`,
      kind: "health" as const,
      title: h.name,
      location: `${h.lga || h.city}, ${h.state}`,
      image: h.images[0] || DEFAULT_HEALTH_FALLBACK,
      href: `/ussap/health/${h.slug}`,
      sectorLabel: SECTOR_LABELS.health,
      dealText: h.tier === "Tertiary" ? "Tertiary care" : undefined,
      meta: `${h.facilityType} · ${h.beds} beds`,
      verification: h.verification,
    }));
}

function billboardOffers(): SectorOffer[] {
  return BILLBOARDS.filter((b) => b.verification === "verified")
    .slice(0, 3)
    .map((b) => ({
      id: `billboard-${b.id}`,
      kind: "billboard" as const,
      title: b.location,
      location: `${b.lga || b.city}, ${b.state}`,
      image: b.image || DEFAULT_BILLBOARD_FALLBACK,
      href: "/ussap/billboards",
      sectorLabel: SECTOR_LABELS.billboard,
      dealText: "Permit verified",
      meta: `Operator: ${b.operator}`,
      verification: b.verification,
    }));
}

function telecomOffers(): SectorOffer[] {
  return TELECOM_SITES.slice(0, 3).map((site) => ({
    id: `telecom-${site.code}`,
    kind: "telecom" as const,
    title: site.label,
    location: `${site.city}, ${site.state}`,
    image: site.image || "/facilities/telecom/telecom-001.jpg",
    href: `/ussap/address/${encodeURIComponent(site.code)}`,
    sectorLabel: SECTOR_LABELS.telecom,
    dealText: site.operator,
    meta: site.technology?.join(" · ") || "Tower site",
    verification:
      site.verification === "verified" ||
      site.verification === "pending" ||
      site.verification === "flagged"
        ? site.verification
        : "verified",
  }));
}

function shortletOffers(): SectorOffer[] {
  return PROPERTIES.filter((p) => p.listingCategory === "Shortlet")
    .slice(0, 2)
    .map((p) => ({
      id: `shortlet-${p.id}`,
      kind: "shortlet" as const,
      title: p.title,
      location: `${p.location.city}, ${p.location.state}`,
      image: p.images[0] || "/listings/stay-1.jpg",
      href: `/property/${p.id}`,
      sectorLabel: SECTOR_LABELS.shortlet,
      dealText: `₦${p.price.toLocaleString()}/night`,
      meta: `${p.propertyType} · ${p.maxGuests} guests`,
      verification: p.verification ?? "verified",
    }));
}

/** Curated, interleaved highlights across USSAP sectors for the landing page. */
export function getSectorOffers(): SectorOffer[] {
  return interleave([
    hotelOffers(),
    schoolOffers(),
    healthOffers(),
    billboardOffers(),
    telecomOffers(),
    shortletOffers(),
  ]);
}
