"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  BED_OPTIONS,
  LOCATION_OPTIONS,
  PRICE_OPTIONS,
  TYPE_OPTIONS,
} from "@/lib/listings";
import type { SearchFilters, SearchTab } from "@/lib/types";

const empty: SearchFilters = {
  location: "",
  propertyType: "",
  bedsBath: "",
  priceRange: "",
};

export function HeroSearch({
  searchTab,
  onSearchTabChange,
  onFiltersChange,
  onSearch,
}: {
  searchTab: SearchTab;
  onSearchTabChange: (tab: SearchTab) => void;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: (filters: SearchFilters) => void;
}) {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedsBath, setBedsBath] = useState("");
  const [priceRange, setPriceRange] = useState("");

  useEffect(() => {
    setPropertyType("");
    setPriceRange("");
  }, [searchTab]);

  useEffect(() => {
    onFiltersChange({ location, propertyType, bedsBath, priceRange });
  }, [location, propertyType, bedsBath, priceRange, onFiltersChange]);

  const types = TYPE_OPTIONS[searchTab];
  const prices = PRICE_OPTIONS[searchTab];

  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden sm:min-h-[80vh] md:h-screen md:min-h-0">
      <div className="absolute inset-0">
        <Image
          alt="Hero background"
          fill
          priority
          className="object-cover"
          src="/Hero-Image.jpg"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      <div className="absolute inset-x-0 top-[12%] z-20 px-4 text-center sm:top-[18%] sm:px-6 md:top-1/4">
        <h1 className="mx-auto mb-2 max-w-4xl text-2xl font-bold leading-tight text-white sm:mb-4 sm:text-4xl md:text-5xl lg:text-6xl">
          Find a place to stay in minutes
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-white/95 sm:text-base md:text-lg lg:text-xl">
          Discover verified shortlets, rentals, and homes for sale — powered by USSAP digital
          addresses across Nigeria.
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-4 z-30 px-3 sm:bottom-10 sm:px-6 md:bottom-16 lg:bottom-24">
        <div className="mx-auto w-full max-w-6xl">
          <div className="rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur sm:rounded-2xl sm:p-5 md:p-6">
            <div className="mb-3 flex gap-1.5 overflow-x-auto scrollbar-hide sm:mb-4 sm:gap-2">
              {(["buy", "rent", "shortlet"] as SearchTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onSearchTabChange(tab)}
                  className={`cursor-pointer shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                    searchTab === tab
                      ? "bg-[#1e3a5f]/15 text-black"
                      : "bg-white text-black hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5">
              <CustomSelect
                ariaLabel="Location"
                value={location}
                onChange={setLocation}
                options={LOCATION_OPTIONS}
                className="w-full lg:col-span-1"
                leading={
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
              <CustomSelect
                ariaLabel="Property Type"
                value={propertyType}
                onChange={setPropertyType}
                options={[...types]}
                className="w-full"
              />
              <CustomSelect
                ariaLabel="Beds and Bath"
                value={bedsBath}
                onChange={setBedsBath}
                options={BED_OPTIONS}
                className="w-full"
              />
              <CustomSelect
                ariaLabel="Price Range"
                value={priceRange}
                onChange={setPriceRange}
                options={[...prices]}
                className="w-full"
              />
              <button
                type="button"
                onClick={() =>
                  onSearch({ location, propertyType, bedsBath, priceRange })
                }
                className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-lg bg-[#3d7ea6] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#326a8c] sm:col-span-2 lg:col-span-1"
              >
                <SearchIcon />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

export { empty as emptyFilters };
