"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PropertyComplianceBadges } from "@/components/civic/StatusBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import { UssapShell } from "@/components/ussap/UssapShell";
import { DEFAULT_HEALTH_FALLBACK } from "@/lib/civic/facility-images";
import { getEnrichedHealth } from "@/lib/civic/enrich";

export default function UssapHealthDetailPage() {
  const { id } = useParams<{ id: string }>();
  const facility = getEnrichedHealth(id);

  if (!facility) {
    return (
      <UssapShell>
        <div className="py-16 text-center">Health facility not found.</div>
      </UssapShell>
    );
  }

  const ownership =
    facility.ownership === "Government" ? "Government" : facility.ownership;

  return (
    <UssapShell>
      <div className="mx-auto max-w-4xl">
        <Link href="/ussap/health" className="text-sm text-slate-600 hover:text-[#1e3a5f]">
          ← Health directory
        </Link>
        <div className="relative mt-4 h-64 overflow-hidden rounded-2xl sm:h-80">
          <SafeImage
            src={facility.images[0]}
            alt={facility.name}
            fill
            className="object-cover"
            sizes="800px"
            fallbackSrc={DEFAULT_HEALTH_FALLBACK}
          />
          <div className="absolute left-4 top-4 flex gap-2">
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase ${
                ownership === "Government"
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-violet-600 text-white"
              }`}
            >
              {ownership}
            </span>
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase ${
                facility.registered ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
              }`}
            >
              {facility.registered ? "Registered" : "Non-registered"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{facility.name}</h1>
            <p className="mt-2 text-slate-600">
              {facility.lga}, {facility.state} · {facility.setting} · {facility.facilityType}
            </p>
          </div>
          <PropertyComplianceBadges
            verification={facility.verification}
            licensed={facility.verification === "verified"}
            registered={facility.registered ?? false}
          />
        </div>

        <dl className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-slate-500">Year opened</dt>
            <dd className="text-lg font-semibold text-slate-900">{facility.establishedYear}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Doctors</dt>
            <dd className="text-lg font-semibold text-slate-900">{facility.doctors}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Nurses</dt>
            <dd className="text-lg font-semibold text-slate-900">{facility.nurses}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Bed capacity</dt>
            <dd className="text-lg font-semibold text-slate-900">{facility.beds}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Tier</dt>
            <dd className="font-medium">{facility.tier}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Ownership</dt>
            <dd className="font-medium">{ownership}</dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <dt className="text-slate-500">Address</dt>
            <dd className="font-medium">{facility.address}</dd>
          </div>
        </dl>
      </div>
    </UssapShell>
  );
}
