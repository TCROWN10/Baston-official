"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SiteShell } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  BED_OPTIONS,
  LOCATION_OPTIONS,
  PRICE_OPTIONS,
  TYPE_OPTIONS,
  filterProperties,
} from "@/lib/listings";
import { useLiveProperties } from "@/lib/live/useLiveProperties";
import type { SearchFilters, SearchTab } from "@/lib/types";

function SearchInner() {
  const params = useSearchParams();
  const [tab, setTab] = useState<SearchTab>("shortlet");
  const { items, loading, liveCount } = useLiveProperties(tab);
  const [filters, setFilters] = useState<SearchFilters>({
    location: params.get("location") || "",
    propertyType: "",
    bedsBath: "",
    priceRange: "",
  });

  const results = useMemo(
    () => filterProperties(tab, filters, loading ? [] : items),
    [tab, filters, items, loading],
  );

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <h1 className="mb-1 text-2xl font-bold text-black sm:mb-2 sm:text-3xl">Search</h1>
        <p className="mb-4 text-sm text-gray-600 sm:mb-6">
          {loading
            ? "Loading live listings from OpenStreetMap…"
            : `${liveCount} live listings across Nigeria`}
        </p>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {(["buy", "rent", "shortlet"] as SearchTab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`cursor-pointer shrink-0 rounded-lg px-3 py-2 text-sm font-medium capitalize sm:px-4 ${
                tab === t ? "bg-[#1e3a5f]/10 text-black" : "bg-white text-black hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mb-6 grid gap-2.5 rounded-2xl bg-white p-3 shadow-sm sm:mb-8 sm:grid-cols-2 sm:gap-3 sm:p-4 lg:grid-cols-5">
          <CustomSelect
            ariaLabel="Location"
            value={filters.location}
            onChange={(location) => setFilters((f) => ({ ...f, location }))}
            options={LOCATION_OPTIONS}
          />
          <CustomSelect
            ariaLabel="Property type"
            value={filters.propertyType}
            onChange={(propertyType) => setFilters((f) => ({ ...f, propertyType }))}
            options={[...TYPE_OPTIONS[tab]]}
          />
          <CustomSelect
            ariaLabel="Beds"
            value={filters.bedsBath}
            onChange={(bedsBath) => setFilters((f) => ({ ...f, bedsBath }))}
            options={BED_OPTIONS}
          />
          <CustomSelect
            ariaLabel="Price"
            value={filters.priceRange}
            onChange={(priceRange) => setFilters((f) => ({ ...f, priceRange }))}
            options={[...PRICE_OPTIONS[tab]]}
          />
          <div className="flex items-center text-sm text-gray-600 sm:col-span-2 lg:col-span-1">
            {results.length} result{results.length === 1 ? "" : "s"}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1e3a5f] border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {results.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                variant={tab === "shortlet" ? "shortlet" : "sale"}
              />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <SiteShell>
          <div className="flex min-h-[40vh] items-center justify-center">Loading...</div>
        </SiteShell>
      }
    >
      <SearchInner />
    </Suspense>
  );
}
