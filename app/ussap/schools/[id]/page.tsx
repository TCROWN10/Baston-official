"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PropertyComplianceBadges } from "@/components/civic/StatusBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import { UssapShell } from "@/components/ussap/UssapShell";
import { DEFAULT_HEALTH_FALLBACK, DEFAULT_SCHOOL_FALLBACK } from "@/lib/civic/facility-images";
import { getEnrichedSchool, schoolOwnershipLabel } from "@/lib/civic/enrich";

export default function UssapSchoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const school = getEnrichedSchool(id);

  if (!school) {
    return (
      <UssapShell>
        <div className="py-16 text-center">School not found.</div>
      </UssapShell>
    );
  }

  const ownership = schoolOwnershipLabel(school);

  return (
    <UssapShell>
      <div className="mx-auto max-w-4xl">
        <Link href="/ussap/schools" className="text-sm text-slate-600 hover:text-[#1e3a5f]">
          ← Education directory
        </Link>
        <div className="relative mt-4 h-64 overflow-hidden rounded-2xl sm:h-80">
          <SafeImage
            src={school.images[0]}
            alt={school.name}
            fill
            className="object-cover"
            sizes="800px"
            fallbackSrc={DEFAULT_SCHOOL_FALLBACK}
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
                school.registered ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
              }`}
            >
              {school.registered ? "Registered" : "Non-registered"}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{school.name}</h1>
            <p className="mt-2 text-slate-600">
              {school.lga}, {school.state} · {school.setting} · {school.level}
            </p>
          </div>
          <PropertyComplianceBadges
            verification={school.verification}
            licensed={school.verification === "verified"}
            registered={school.registered ?? false}
          />
        </div>

        <dl className="mt-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-slate-500">Year opened</dt>
            <dd className="text-lg font-semibold text-slate-900">{school.establishedYear}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Teachers</dt>
            <dd className="text-lg font-semibold text-slate-900">
              {(school.teachers ?? 0).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Students</dt>
            <dd className="text-lg font-semibold text-slate-900">
              {school.students.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Ownership</dt>
            <dd className="font-medium">{ownership} school</dd>
          </div>
          <div>
            <dt className="text-slate-500">Registration</dt>
            <dd className="font-medium capitalize">{school.verification}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Ministry number</dt>
            <dd className="font-medium">{school.moeNumber}</dd>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <dt className="text-slate-500">Address</dt>
            <dd className="font-medium">{school.address}</dd>
          </div>
        </dl>
      </div>
    </UssapShell>
  );
}
