"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  BED_OPTIONS,
  LOCATION_OPTIONS,
  PRICE_OPTIONS,
  TYPE_OPTIONS,
} from "@/lib/listings";
import {
  HERO_AUTOPLAY_MS,
  HERO_SLIDES,
  HERO_TRANSITION_MS,
} from "@/lib/hero-slides";
import type { SearchFilters, SearchTab } from "@/lib/types";

export function HeroCarousel({
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
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedsBath, setBedsBath] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const slideCount = HERO_SLIDES.length;
  const types = TYPE_OPTIONS[searchTab];
  const prices = PRICE_OPTIONS[searchTab];

  const goNext = useCallback(() => {
    setActive((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    setPropertyType("");
    setPriceRange("");
  }, [searchTab]);

  useEffect(() => {
    onFiltersChange({ location, propertyType, bedsBath, priceRange });
  }, [location, propertyType, bedsBath, priceRange, onFiltersChange]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(goNext, HERO_AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, goNext]);

  const current = HERO_SLIDES[active];

  return (
    <section
      className="relative min-h-[70vh] w-full overflow-hidden sm:min-h-[80vh] md:h-screen md:min-h-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      aria-roledescription="carousel"
      aria-label="Featured services"
    >
      <div
        className="flex h-full min-h-[inherit] ease-in-out"
        style={{
          width: `${slideCount * 100}%`,
          transform: `translateX(-${(active * 100) / slideCount}%)`,
          transition: `transform ${HERO_TRANSITION_MS}ms ease-in-out`,
        }}
      >
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className="relative min-h-[inherit] flex-shrink-0"
            style={{ width: `${100 / slideCount}%` }}
            aria-hidden={index !== active}
          >
            <Image
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              className="object-cover"
              src={slide.image}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/35" />
          </div>
        ))}
      </div>

      <div
        key={current.id}
        className="pointer-events-none absolute inset-x-0 top-[12%] z-20 animate-[heroFade_1.2s_ease-in-out] px-4 text-center sm:top-[18%] sm:px-6 md:top-1/4"
        aria-live="polite"
      >
        <h1 className="mx-auto mb-2 max-w-4xl text-2xl font-bold leading-tight text-white sm:mb-4 sm:text-4xl md:text-5xl lg:text-6xl">
          {current.title}
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-white/95 sm:text-base md:text-lg lg:text-xl">
          {current.description}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-4 z-30 px-3 sm:bottom-10 sm:px-6 md:bottom-16 lg:bottom-24">
        <div className="mx-auto w-full max-w-6xl">
          {current.type === "property" ? (
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
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
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
          ) : (
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:rounded-2xl sm:p-5">
                {current.ctaHref && current.ctaLabel ? (
                  <Link
                    href={current.ctaHref}
                    className="cursor-pointer w-full rounded-lg bg-[#3d7ea6] px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#326a8c] sm:w-auto"
                  >
                    {current.ctaLabel}
                  </Link>
                ) : null}
                {current.secondaryHref && current.secondaryLabel ? (
                  <Link
                    href={current.secondaryHref}
                    className="cursor-pointer w-full rounded-lg border border-[#1e3a5f] px-6 py-3 text-center text-sm font-semibold text-[#1e3a5f] transition-colors hover:bg-[#1e3a5f]/5 sm:w-auto"
                  >
                    {current.secondaryLabel}
                  </Link>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute inset-x-0 top-[6%] z-40 flex justify-center gap-2 sm:top-[8%]">
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to ${slide.label} slide`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => setActive(index)}
            className={`cursor-pointer rounded-full transition-all duration-500 ${
              index === active
                ? "h-2.5 w-8 bg-white"
                : "h-2.5 w-2.5 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}
