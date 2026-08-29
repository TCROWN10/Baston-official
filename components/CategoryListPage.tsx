"use client";

import { useMemo } from "react";
import { SiteShell } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { emptyFilters } from "@/components/HeroSearch";
import { filterProperties } from "@/lib/listings";
import { useLiveProperties } from "@/lib/live/useLiveProperties";
import type { SearchTab } from "@/lib/types";

const COPY: Record<
  SearchTab,
  { title: string; subtitle: string; heading: string }
> = {
  buy: {
    title: "Buy Your Dream Home",
    subtitle:
      "Live property listings from OpenStreetMap across Nigeria, merged with verified agent adverts.",
    heading: "Properties for sale",
  },
  rent: {
    title: "Rent a Home You'll Love",
    subtitle:
      "Live rentals and apartments mapped across Nigeria — browse and contact agents directly.",
    heading: "Rental properties",
  },
  shortlet: {
    title: "Shortlet adverts",
    subtitle:
      "Live short-stay apartments, guest houses, and serviced flats from OpenStreetMap nationwide.",
    heading: "Shortlet properties",
  },
};

export function CategoryListPage({ tab }: { tab: SearchTab }) {
  const { items, loading, source, liveCount, error, refresh } = useLiveProperties(tab);
  const copy = COPY[tab];

  const properties = useMemo(() => {
    if (loading) return [];
    return filterProperties(tab, emptyFilters, items);
  }, [tab, items, loading]);

  return (
    <SiteShell>
      <section className="relative bg-gradient-to-br from-[#1e3a5f] to-[#0f1f35] px-4 py-10 sm:px-6 sm:py-14 md:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="mb-2 text-2xl font-bold text-white sm:mb-3 sm:text-4xl md:text-5xl">
            {copy.title}
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/90 sm:text-lg md:text-xl">{copy.subtitle}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <h2 className="text-lg font-bold text-black sm:text-xl md:text-2xl">{copy.heading}</h2>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="cursor-pointer w-full rounded-lg bg-[#1e3a5f] px-3 py-2.5 text-xs font-medium text-white disabled:opacity-60 sm:w-auto sm:py-1.5"
          >
            Refresh live data
          </button>
        </div>
        <div className="mb-5 rounded-xl bg-[#1e3a5f]/10 px-3 py-3 text-sm text-slate-700 sm:mb-6 sm:px-4">
          {loading
            ? "Fetching live properties from OpenStreetMap across Nigeria… (first load may take a minute)"
            : error
              ? error
              : `${properties.length} listings · ${liveCount} live from OpenStreetMap · source: ${source}`}
        </div>
        {loading ? (
          <div className="flex min-h-[240px] items-center justify-center sm:min-h-[280px]">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[#1e3a5f]" />
              <p className="mt-4 text-gray-600">Loading live properties...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                variant={tab === "shortlet" ? "shortlet" : "sale"}
              />
            ))}
            {properties.length === 0 ? (
              <p className="text-sm text-gray-600 sm:col-span-2 lg:col-span-3">
                No listings matched this category yet. Try refresh or check back shortly.
              </p>
            ) : null}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
