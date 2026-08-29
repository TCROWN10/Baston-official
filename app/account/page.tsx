"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/Footer";
import { useAuth } from "@/lib/auth";
import { BOOKINGS } from "@/lib/data";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"upcoming" | "past" | "canceled">("upcoming");

  useEffect(() => {
    if (!loading && !user) {
      // allow browsing trips UI as guest demo
    }
  }, [loading, user]);

  const bookings = BOOKINGS.filter((b) => b.status === tab);

  return (
    <SiteShell>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-black">My Trips</h1>
            <p className="mt-1 text-gray-600">
              Manage your upcoming stays and view past trips.
            </p>
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-semibold text-black">{user.fullName}</p>
                <p className="text-xs text-gray-500">Customer Account</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link href="/login?redirect=/account" className="text-sm font-medium text-[#1e3a5f]">
              Sign in
            </Link>
          )}
        </div>

        <div className="mb-6 flex gap-2">
          {(["upcoming", "past", "canceled"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                tab === item
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-white text-gray-700 hover:bg-slate-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-600">
            No {tab} bookings.
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white sm:flex-row"
              >
                <div className="relative h-40 w-full sm:h-auto sm:w-56">
                  <Image
                    src={booking.image}
                    alt={booking.propertyTitle}
                    fill
                    className="object-cover"
                    sizes="224px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="text-lg font-bold text-black">{booking.propertyTitle}</h3>
                    <p className="mt-1 text-sm text-gray-600">{booking.location}</p>
                    <p className="mt-2 text-sm text-gray-700">
                      {booking.checkIn} → {booking.checkOut}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-semibold text-black">{booking.total}</span>
                    <Link
                      href={`/property/${booking.propertyId}`}
                      className="text-sm font-medium text-[#1e3a5f]"
                    >
                      View property
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
