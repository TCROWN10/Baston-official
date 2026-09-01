"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { SiteShell } from "@/components/Footer";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ListingsSection } from "@/components/ListingsSection";
import {
  BlogCarousel,
  LocationGrid,
  PropertyTypeCarousel,
} from "@/components/HomeSections";
import { BastionServicesSection } from "@/components/ussap/BastionServicesSection";
import { SectorModulesHub } from "@/components/ussap/SectorModulesHub";
import { SiteCard } from "@/components/ussap/SiteCard";
import { BRAND, allSites } from "@/lib/ussap/data";
import { encodeGrid } from "@/lib/ussap/geocode";
import { ROLE_DEFINITIONS } from "@/lib/ussap/rbac";
import { SECTOR_NAV } from "@/lib/site-nav";
import type { SearchFilters, SearchTab } from "@/lib/types";
import { emptyFilters } from "@/components/HeroSearch";

const sample = encodeGrid(6.5244, 3.3792, 8);

const SECTOR_COPY: Record<string, string> = {
  "/ussap/map":
    "Cellular towers, BTS sites, and fibre nodes with uptime and maintenance tracking.",
  "/ussap/projects":
    "Geo-tagged photo/video uploads linked to a site address for progress verification.",
  "/ussap/traffic":
    "Cameras, congestion hot-spots, and accident zones with real-time status tags.",
  "/ussap/schools":
    "Registered vs. non-registered schools by tier, setting, and infrastructure audits.",
  "/ussap/health":
    "Hospital hierarchy from tertiary centres to RHCs with resource and equipment audits.",
  "/ussap/billboards":
    "Geo-tagged outdoor signage with permit compliance and revenue enforcement.",
  "/ussap/residential":
    "Shareable cloud addresses for deliveries, utilities, and navigation.",
  "/ussap/field":
    "Drop pins and retrieve digital addresses without connectivity — sync when online.",
};

const modules = SECTOR_NAV.filter((m) => m.href !== "/ussap/map").map((m) => ({
  href: m.href,
  title: m.label,
  body: SECTOR_COPY[m.href] || "",
}));

export default function HomePage() {
  const [searchTab, setSearchTab] = useState<SearchTab>("shortlet");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(emptyFilters);
  const listingsRef = useRef<HTMLElement>(null);
  const featured = allSites().slice(0, 6);

  const onFiltersChange = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
  }, []);

  const onSearch = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
    listingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <SiteShell>
      <HeroCarousel
        searchTab={searchTab}
        onSearchTabChange={setSearchTab}
        onFiltersChange={onFiltersChange}
        onSearch={onSearch}
      />

      <section id="listings" ref={listingsRef} className="scroll-mt-20">
        <ListingsSection listingTab={searchTab} searchFilters={searchFilters} />
      </section>

      <SectorModulesHub />

      <BastionServicesSection />

      <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl font-bold text-black sm:text-2xl lg:text-3xl">
              {BRAND.name}{" "}
              <span className="text-[#1e3a5f]">digital addressing</span>
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-gray-600 sm:text-base">
              {BRAND.tagline}. Precision geocoding issues unique 6–8 character digital codes
              paired with GPS for schools, telecom sites, projects, traffic posts, and homes.
            </p>
            <p className="mt-2 font-mono text-xs text-gray-500">
              Sample digital address · {sample} → Ikeja, Lagos
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {modules.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
              >
                <h3 className="font-semibold text-[#1e3a5f]">{m.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{m.body}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/ussap/map"
              className="rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#152a45]"
            >
              Open multi-layer map
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-black px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-white"
            >
              Sign in to your workspace
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-black sm:text-2xl lg:text-3xl">
                Registry <span className="text-[#1e3a5f]">snapshot</span>
              </h2>
              <p className="mt-1 text-sm text-gray-600 sm:text-base">
                Verified sites already on the USSAP address grid.
              </p>
            </div>
            <Link href="/ussap/map" className="text-sm font-medium text-[#1e3a5f] hover:underline">
              View on map →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {featured.map((site) => (
              <SiteCard key={site.code} site={site} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-bold text-black sm:text-2xl lg:text-3xl">
            Who uses <span className="text-[#1e3a5f]">USSAP</span>?
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-600 sm:text-base">
            Different account types open different workspaces. Regular users never share the
            platform admin console with administrators.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ROLE_DEFINITIONS.filter((r) => r.role !== "admin").map((r) => (
              <li
                key={r.role}
                className="rounded-lg border border-gray-200 bg-white px-4 py-4 shadow-sm"
              >
                <p className="font-semibold text-black">{r.title}</p>
                <p className="mt-1 text-sm text-gray-600">{r.audience}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LocationGrid />
      <PropertyTypeCarousel />
      <BlogCarousel />
    </SiteShell>
  );
}
