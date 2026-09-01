"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AccountShell } from "@/components/account/AccountShell";
import { useAuth } from "@/lib/auth";
import { BOOKINGS } from "@/lib/data";

export default function AccountTripsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"upcoming" | "past" | "canceled">("upcoming");
  const bookings = BOOKINGS.filter((b) => b.status === tab);

  return (
    <AccountShell requireAuth={false} wide>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">My Trips</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your upcoming stays and view past trips.
        </p>
        {user ? (
          <p className="mt-2 text-sm text-slate-600">
            Signed in as <span className="font-semibold text-slate-900">{user.fullName}</span>
          </p>
        ) : (
          <Link
            href="/login?redirect=/account/trips"
            className="mt-2 inline-block text-sm font-medium text-[#1e3a5f]"
          >
            Sign in to sync trips
          </Link>
        )}
      </div>

      <div className="mb-6 flex gap-2">
        {(["upcoming", "past", "canceled"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
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
    </AccountShell>
  );
}
