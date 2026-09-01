"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PropertyComplianceBadges, hotelCompliance, naira } from "@/components/civic/StatusBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import { UssapShell } from "@/components/ussap/UssapShell";
import { getHotel } from "@/lib/civic/directory";
import { fetchLiveHotel } from "@/lib/live/useLiveProperties";
import type { HotelRecord } from "@/lib/civic/types";

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<HotelRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = getHotel(id);
      if (local) {
        if (!cancelled) {
          setHotel(local);
          setLoading(false);
        }
        return;
      }
      const live = await fetchLiveHotel(id);
      if (!cancelled) {
        setHotel(live);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <UssapShell>
        <div className="flex min-h-[40vh] items-center justify-center text-gray-600">
          Loading hotel…
        </div>
      </UssapShell>
    );
  }

  if (!hotel) {
    return (
      <UssapShell>
        <div className="px-4 py-16 text-center">Hotel not found.</div>
      </UssapShell>
    );
  }

  return (
    <UssapShell>
      <div>
        <Link href="/hotels" className="text-sm text-gray-600 hover:text-black">
          ← Hotels
        </Link>
        {hotel.source === "openstreetmap" || hotel.live ? (
          <p className="mt-2 inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
            OpenStreetMap · Verified / Registered
          </p>
        ) : null}
        <div className="relative mt-4 h-52 overflow-hidden rounded-xl sm:h-72 sm:rounded-2xl md:h-96">
          <SafeImage src={hotel.images[0]} alt={hotel.name} fill className="object-cover" priority sizes="1200px" />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-black sm:text-3xl">{hotel.name}</h1>
            <p className="mt-1 text-sm text-gray-600 sm:text-base">
              {hotel.address} · {hotel.city}, {hotel.state}
            </p>
          </div>
          <PropertyComplianceBadges {...hotelCompliance(hotel)} />
        </div>
        <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
            <p className="text-sm text-gray-700 sm:text-base">
              {hotel.stars}-star hotel with {hotel.rooms} rooms.
              {` Tourism board number ${hotel.tourismBoardNo}. This property is listed so guests can book and so government can confirm it is a registered hotel in Nigeria.`}
            </p>
            <dl className="mt-5 grid gap-3 text-sm sm:mt-6 sm:grid-cols-2">
              <div>
                <dt className="text-gray-500">Verification</dt>
                <dd className="font-medium capitalize">{hotel.verification}</dd>
              </div>
              <div>
                <dt className="text-gray-500">License (tourism board)</dt>
                <dd className="font-medium break-all">{hotel.tourismBoardNo}</dd>
              </div>
              <div>
                <dt className="text-gray-500">CAC / registration</dt>
                <dd className="font-medium break-all">{hotel.cacNumber}</dd>
              </div>
              <div>
                <dt className="text-gray-500">TIN</dt>
                <dd className="font-medium break-all">{hotel.tin}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Operator</dt>
                <dd className="font-medium">{hotel.ownerName}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Phone</dt>
                <dd className="font-medium">{hotel.phone}</dd>
              </div>
            </dl>
          </div>
          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-24">
            <p className="text-xl font-bold sm:text-2xl">{naira(hotel.nightlyFrom)} / night</p>
            {hotel.advertActive ? (
              <p className="mt-1 text-sm text-[#152a45]">Featured hotel advert</p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">Registered listing</p>
            )}
            <a
              href={`tel:${hotel.phone.replace(/\s/g, "")}`}
              className="mt-5 block rounded-lg bg-[#1e3a5f] px-4 py-3 text-center text-sm font-medium text-white sm:py-2.5"
            >
              Call hotel
            </a>
            <a
              href={`https://www.google.com/maps?q=${hotel.lat},${hotel.lon}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-medium sm:py-2.5"
            >
              Open map
            </a>
          </aside>
        </div>
      </div>
    </UssapShell>
  );
}
