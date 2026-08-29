"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { BRAND_NAME, LISTING_FEE_PER_WEEK_NGN } from "@/lib/data";
import { getAllProperties } from "@/lib/listings";
import type { Property } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<Property[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login?redirect=/dashboard");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const all = getAllProperties();
    setListings(
      all.filter(
        (p) =>
          p.owner.email === user.email ||
          p.owner.id === user.id ||
          user.role === "admin",
      ),
    );
  }, [user]);

  const stats = useMemo(
    () => ({
      listings: listings.length,
      views: listings.reduce((sum, p) => sum + p.reviewsCount * 3 + 12, 0),
      active: listings.filter((p) => p.status === "active").length,
    }),
    [listings],
  );

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1e3a5f]">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-black">{BRAND_NAME}</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/listing"
              className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#152a45]"
            >
              Add New Listing
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[240px_1fr] lg:px-10">
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {user.role === "guest" ? "Guest" : "Agent"}
          </p>
          <p className="mt-1 font-semibold text-black">{user.fullName}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <nav className="mt-6 space-y-1">
            <Link href="/dashboard" className="block rounded-lg bg-[#1e3a5f]/10 px-3 py-2 text-sm font-medium text-[#1e3a5f]">
              Dashboard
            </Link>
            <Link href="/dashboard/listing" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-slate-50">
              Add listing
            </Link>
            <Link href="/account" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-slate-50">
              Customer account
            </Link>
            <Link href="/" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-slate-50">
              Browse site
            </Link>
          </nav>
        </aside>

        <div>
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Listing display is billed at ₦{LISTING_FEE_PER_WEEK_NGN.toLocaleString()} per week when
            you publish.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Listings", value: stats.listings },
              { label: "Active", value: stats.active },
              { label: "Views", value: stats.views },
            ].map((card) => (
              <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="mt-2 text-3xl font-bold text-black">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="font-semibold text-black">Your listings</h2>
              <Link href="/dashboard/listing" className="text-sm font-medium text-[#1e3a5f]">
                Add New Listing
              </Link>
            </div>
            {listings.length === 0 ? (
              <div className="px-5 py-12 text-center text-gray-600">
                No listings yet. Publish your first advert to start getting calls.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {listings.map((listing) => (
                  <li key={listing.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="relative h-16 w-20 overflow-hidden rounded-lg">
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-black">{listing.title}</p>
                      <p className="text-sm text-gray-500">
                        {listing.listingCategory} · {listing.status}
                      </p>
                    </div>
                    <Link
                      href={`/property/${listing.id}`}
                      className="text-sm font-medium text-[#1e3a5f]"
                    >
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
