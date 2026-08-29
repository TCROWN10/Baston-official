"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PropertyComplianceBadges } from "@/components/civic/StatusBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import { isSaved, toggleSavedHome } from "@/lib/saved";
import { bedLabel, formatLocation, formatPrice, withPropertyCompliance } from "@/lib/listings";
import type { Property } from "@/lib/types";

export function PropertyCard({
  property: raw,
  variant = "shortlet",
}: {
  property: Property;
  variant?: "shortlet" | "sale";
}) {
  const property = withPropertyCompliance(raw);
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const price = formatPrice(property);
  const location = formatLocation(property);
  const nights = "1 Night";
  const adults = `${property.maxGuests} Adult${property.maxGuests !== 1 ? "s" : ""}`;
  const rating = property.rating ? property.rating.toFixed(1) : "4.5";

  useEffect(() => {
    setSaved(isSaved(property.id));
  }, [property.id]);

  const onToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(
      toggleSavedHome({
        id: property.id,
        title: property.title,
        location,
        image: property.images[0],
        price,
        details:
          variant === "shortlet"
            ? `${nights}, ${adults} · ${rating} Rating`
            : `${rating} Rating`,
      }),
    );
  };

  const badges = (
    <PropertyComplianceBadges
      verification={property.verification}
      licensed={property.licensed}
      registered={property.registered}
      compact
    />
  );

  if (variant === "sale") {
    return (
      <article className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
        <Link href={`/property/${property.id}`} className="flex flex-1 flex-col">
          <div className="relative h-48 w-full overflow-hidden sm:h-56 md:h-64">
            <SafeImage
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width:768px) 100vw, 33vw"
            />
            <div className="absolute left-3 top-3 z-10 max-w-[85%]">{badges}</div>
            <button
              type="button"
              onClick={onToggle}
              aria-label={saved ? "Remove from saved homes" : "Save to favorites"}
              className={`cursor-pointer absolute bottom-3 left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white ${
                saved ? "text-red-500" : "text-gray-600 hover:text-red-500"
              }`}
            >
              <HeartIcon filled={saved} />
            </button>
            <div className="absolute bottom-3 right-3">
              <p className="text-lg font-bold text-white drop-shadow-lg">{price}</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
            <h3 className="line-clamp-2 text-base font-bold text-black sm:text-lg">{property.title}</h3>
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <PinIcon />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span className="text-yellow-400">☆</span>
              <span>{rating} Rating</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden sm:h-56 md:h-64">
        <SafeImage
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        <div className="absolute left-3 top-3 z-10 max-w-[90%]">
          {property.hasHourlyReservation ? (
            <div className="mb-1 rounded-md bg-white px-2.5 py-1 text-[10px] font-medium text-black sm:text-xs">
              Hourly Reservation Available
            </div>
          ) : null}
          {badges}
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-label={saved ? "Remove from saved homes" : "Add to favorites"}
          className={`cursor-pointer absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 transition hover:bg-white ${
            saved ? "text-red-500" : "text-gray-600 hover:text-red-500"
          }`}
        >
          <HeartIcon filled={saved} />
        </button>
        <div className="absolute bottom-3 right-3">
          <p className="text-lg font-bold text-white drop-shadow-lg">{price}</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:gap-3 sm:p-4">
        <h3 className="line-clamp-2 text-base font-bold text-black sm:text-lg">{property.title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <PinIcon />
          <span className="truncate">{location}</span>
        </div>
        <p className="text-sm text-gray-600">
          {nights}, {adults}
        </p>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <span className="text-yellow-400">☆</span>
          <span>{rating} Rating</span>
        </div>
        <p className="text-xs text-gray-500">
          {bedLabel(property.bedrooms)} · {property.propertyType}
        </p>
        <button
          type="button"
          onClick={() => router.push(`/property/${property.id}`)}
          className="cursor-pointer mt-2 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#152a45] sm:py-2.5"
        >
          View property
        </button>
      </div>
    </article>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="h-5 w-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  );
}
