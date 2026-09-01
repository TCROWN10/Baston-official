"use client";

import { useEffect, useMemo, useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { SectorOfferCard } from "@/components/SectorOfferCard";
import { filterProperties } from "@/lib/listings";
import { getSectorOffers } from "@/lib/civic/sector-offers";
import type { SearchFilters, SearchTab } from "@/lib/types";

export function ListingsSection({
  listingTab,
  searchFilters,
}: {
  listingTab: SearchTab;
  searchFilters: SearchFilters;
}) {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setReady(true);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, [listingTab, searchFilters]);

  useEffect(() => {
    setPage(1);
  }, [listingTab, searchFilters]);

  const sectorOffers = useMemo(() => getSectorOffers(), []);

  const filtered = useMemo(() => {
    if (!ready) return [];
    return filterProperties(listingTab, searchFilters);
  }, [listingTab, searchFilters, ready]);

  const isSectorMix = listingTab === "shortlet";
  const sectorSlice = sectorOffers.slice((page - 1) * 6, page * 6);
  const propertySlice = filtered.slice((page - 1) * 6, page * 6);
  const displayCount = isSectorMix ? sectorOffers.length : filtered.length;
  const pages = Math.ceil(displayCount / 6) || 1;

  useEffect(() => {
    if (page > pages) setPage(Math.max(1, pages));
  }, [page, pages]);

  const title =
    listingTab === "shortlet"
      ? "Special Offers & Deals This Week"
      : listingTab === "buy"
        ? "Properties for sale"
        : "Rental properties";
  const subtitle =
    listingTab === "shortlet"
      ? "Save up to 34% · Hotels, schools, health, telecom & more"
      : listingTab === "buy"
        ? "Verified homes for sale"
        : "Verified rentals";

  const emptyMessage =
    listingTab === "shortlet"
      ? "No sector highlights available right now."
      : listingTab === "buy"
        ? "No properties for sale match your filters. Try adjusting location, property type, or price."
        : "No rentals match your filters. Try adjusting location, property type, or price.";

  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-black sm:text-2xl lg:text-3xl">{title}</h2>
            <p className="mt-1 text-base text-gray-600 sm:text-lg">{subtitle}</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[#1e3a5f]" />
              <p className="mt-4 text-gray-600">
                {isSectorMix ? "Loading sector highlights..." : "Loading properties..."}
              </p>
            </div>
          </div>
        ) : (isSectorMix ? sectorSlice.length : propertySlice.length) > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {isSectorMix
              ? sectorSlice.map((offer) => <SectorOfferCard key={offer.id} offer={offer} />)
              : propertySlice.map((property) => (
                  <PropertyCard key={property.id} property={property} variant="sale" />
                ))}
          </div>
        ) : (
          <p className="py-12 text-center text-gray-600">{emptyMessage}</p>
        )}

        {!loading && displayCount > 0 ? (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              aria-label="Previous page"
              className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium shadow-sm transition-colors ${
                  page === n
                    ? "bg-[#1e3a5f] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === pages}
              aria-label="Next page"
              className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ChevronLeft() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
