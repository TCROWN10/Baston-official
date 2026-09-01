"use client";

import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";

type Props = {
  listings: Property[];
};

export function DashboardListingsView({ listings }: Props) {
  const active = listings.filter((p) => p.status === "active").length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My listings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Hospitality sector — {active} active · {listings.length} total
          </p>
        </div>
        <Link
          href="/dashboard/listing"
          className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#152a45]"
        >
          Add listing
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total listings", value: listings.length },
          { label: "Active", value: active },
          { label: "Draft / other", value: listings.length - active },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-[#1e3a5f]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {listings.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-medium text-slate-800">No listings yet</p>
            <p className="mt-1 text-sm text-slate-600">
              Publish a hotel or short-stay advert from the hospitality sector.
            </p>
            <Link
              href="/dashboard/listing"
              className="mt-4 inline-block rounded-lg bg-[#3d7ea6] px-4 py-2 text-sm font-medium text-white hover:bg-[#326a8c]"
            >
              Create first listing
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {listings.map((listing) => (
              <li key={listing.id} className="flex items-center gap-4 px-5 py-4">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900">{listing.title}</p>
                  <p className="text-sm text-slate-500">
                    {listing.listingCategory} · {listing.location.city}, {listing.location.state} ·{" "}
                    {listing.status}
                  </p>
                </div>
                <Link
                  href={`/property/${listing.id}`}
                  className="shrink-0 text-sm font-medium text-[#1e3a5f] hover:underline"
                >
                  View
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
