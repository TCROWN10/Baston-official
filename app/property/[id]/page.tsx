"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SiteShell } from "@/components/Footer";
import { PropertyComplianceBadges } from "@/components/civic/StatusBadge";
import { PropertyPrivacyBanner } from "@/components/ussap/PropertyPrivacyBanner";
import { useAuth } from "@/lib/auth";
import { viewListingProperty } from "@/lib/listings-privacy";
import { getPropertyById, formatPrice, bedLabel, withPropertyCompliance } from "@/lib/listings";
import { fetchLiveProperty } from "@/lib/live/useLiveProperties";
import { privacyViewerFromUser } from "@/lib/ussap/property-privacy";
import { HOME_HREF } from "@/lib/site-nav";
import { isSaved, toggleSavedHome } from "@/lib/saved";
import type { Property } from "@/lib/types";

export default function PropertyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = getPropertyById(params.id);
      if (local) {
        if (!cancelled) {
          setProperty(withPropertyCompliance(local));
          setSaved(isSaved(local.id));
          setLoading(false);
        }
        return;
      }
      const live = await fetchLiveProperty(params.id);
      if (!cancelled) {
        setProperty(live ? withPropertyCompliance(live) : null);
        if (live) setSaved(isSaved(live.id));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const listingView = useMemo(
    () => (property ? viewListingProperty(property, privacyViewerFromUser(user)) : null),
    [property, user],
  );

  const location = useMemo(
    () => (listingView ? listingView.location.display : ""),
    [listingView],
  );
  const price = useMemo(() => (property ? formatPrice(property) : ""), [property]);

  if (loading) {
    return (
      <SiteShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-600">Loading property...</p>
        </div>
      </SiteShell>
    );
  }

  if (!property || !listingView) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-black">Failed to load property</h1>
          <button
            type="button"
            onClick={() => router.push(HOME_HREF)}
            className="mt-6 rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white"
          >
            Back home
          </button>
        </div>
      </SiteShell>
    );
  }

  const amenities = showAllAmenities
    ? property.amenities
    : property.amenities.slice(0, 4);
  const { contact, compliance, isRedacted } = listingView;

  return (
    <SiteShell>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back
        </button>

        <PropertyPrivacyBanner
          mode={listingView.mode === "public" ? "public" : listingView.mode === "full" ? "full" : "owner"}
          redactedFields={listingView.redactedFields}
          className="mb-4"
        />

        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-black sm:text-3xl">{property.title}</h1>
            <p className="mt-1 text-gray-600">{location}</p>
            <div className="mt-3">
              <PropertyComplianceBadges
                verification={property.verification}
                licensed={property.licensed}
                registered={property.registered}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              setSaved(
                toggleSavedHome({
                  id: property.id,
                  title: property.title,
                  location,
                  image: property.images[0],
                  price,
                  details: `${bedLabel(property.bedrooms)} · ${property.rating.toFixed(1)} Rating`,
                }),
              )
            }
            className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              saved
                ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {saved ? "Remove from saved homes" : "Save to Saved Homes"}
          </button>
        </div>

        <div className="mb-8 grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:col-span-2 sm:row-span-2 sm:aspect-auto sm:min-h-[360px]">
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 50vw"
              priority
            />
          </div>
          {property.images.slice(1, 5).map((img, idx) => (
            <div
              key={img}
              className="relative hidden aspect-[4/3] overflow-hidden rounded-xl sm:block"
            >
              <Image
                src={img}
                alt={`${property.title} ${idx + 2}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-black">
                {property.propertyType}
              </span>
              <span>{property.listingCategory}</span>
              {property.bedrooms > 0 ? <span>{bedLabel(property.bedrooms)}</span> : <span>Studio</span>}
              <span>{property.bathrooms} Baths</span>
              <span>{property.maxGuests} Guests</span>
              <span className="flex items-center gap-1">
                <span className="text-yellow-400">☆</span>
                {property.rating.toFixed(1)}
              </span>
            </div>

            <h2 className="mb-2 text-lg font-semibold text-black">About this place</h2>
            <p className={`text-gray-700 ${showMore ? "" : "line-clamp-4"}`}>
              {property.description}
            </p>
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="mt-2 text-sm font-medium text-[#1e3a5f]"
            >
              {showMore ? "Show less" : "Show More ▾"}
            </button>

            <h2 className="mb-3 mt-8 text-lg font-semibold text-black">
              Verification & registration
            </h2>
            <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
              <PropertyComplianceBadges
                verification={property.verification}
                licensed={property.licensed}
                registered={property.registered}
              />
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-gray-500">Government verification</dt>
                  <dd className="font-medium capitalize text-black">{compliance.verification}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Operating license</dt>
                  <dd className="font-medium text-black">
                    {compliance.licensed
                      ? compliance.licenseDetail || "Licensed"
                      : "Not licensed / not confirmed"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Registry registration</dt>
                  <dd className="font-medium text-black">
                    {compliance.registered
                      ? compliance.registrationDetail || "Registered"
                      : "Not registered / not confirmed"}
                  </dd>
                </div>
                {isRedacted ? (
                  <div className="sm:col-span-2 text-xs text-slate-500">
                    License and registration numbers are only visible to the listing owner, admin,
                    and government.
                  </div>
                ) : null}
                {property.live ? (
                  <div>
                    <dt className="text-gray-500">Data source</dt>
                    <dd className="font-medium text-black">
                      Live map listing — confirm paperwork with the operator
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <h2 className="mb-3 mt-8 text-lg font-semibold text-black">Amenities</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {amenities.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-[#1e3a5f]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            {property.amenities.length > 4 ? (
              <button
                type="button"
                onClick={() => setShowAllAmenities((v) => !v)}
                className="mt-3 text-sm font-medium text-[#1e3a5f]"
              >
                {showAllAmenities
                  ? "Show fewer amenities"
                  : `Show all ${property.amenities.length} amenities`}
              </button>
            ) : null}
          </div>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
            <p className="text-2xl font-bold text-black">{price}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
              <span className="text-yellow-400">☆</span>
              {property.rating.toFixed(1)} · {property.reviewsCount} reviews
            </p>

            <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e3a5f] text-sm font-bold text-white">
                {contact.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-black">{contact.name}</p>
                <p className="text-xs text-gray-500">{contact.companyLabel}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              {contact.showContactActions && contact.phone && contact.email ? (
                <>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="rounded-lg bg-[#1e3a5f] px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#152a45]"
                  >
                    Call agent
                  </a>
                  <a
                    href={`mailto:${contact.email}?subject=${encodeURIComponent(property.title)}&body=${encodeURIComponent(`Hi, I'm interested in ${property.title}`)}`}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
                  >
                    Email agent
                  </a>
                  {contact.whatsapp ? (
                    <a
                      href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${property.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-green-600 px-4 py-2.5 text-center text-sm font-medium text-green-700 transition-colors hover:bg-green-50"
                    >
                      Chat on WhatsApp
                    </a>
                  ) : null}
                </>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
                  {contact.phone ? (
                    <p className="font-medium text-slate-800">{contact.phone}</p>
                  ) : null}
                  <p className="mt-1">
                    Direct contact details are protected. Sign in as the listing owner, or use an
                    admin / government account for full access.
                  </p>
                  <Link
                    href="/login"
                    className="mt-2 inline-block text-sm font-medium text-[#1e3a5f] hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/signup"
              className="mt-4 block text-center text-xs text-gray-500 hover:text-[#1e3a5f]"
            >
              Are you an agent? List your property
            </Link>
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}
