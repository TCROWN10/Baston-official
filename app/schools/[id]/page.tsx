"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteShell } from "@/components/Footer";
import { PropertyComplianceBadges } from "@/components/civic/StatusBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import { DEFAULT_SCHOOL_FALLBACK } from "@/lib/civic/facility-images";
import { getEnrichedSchool, schoolOwnershipLabel } from "@/lib/civic/enrich";

export default function SchoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const school = getEnrichedSchool(id);

  if (!school) {
    return (
      <SiteShell>
        <div className="px-4 py-16 text-center">School not found.</div>
      </SiteShell>
    );
  }

  const ownership = schoolOwnershipLabel(school);

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link href="/ussap/schools" className="text-sm text-gray-600 hover:text-black">
          ← Education directory
        </Link>
        <div className="relative mt-4 h-64 overflow-hidden rounded-2xl">
          <SafeImage
            src={school.images[0]}
            alt={school.name}
            fill
            className="object-cover"
            sizes="800px"
            fallbackSrc={DEFAULT_SCHOOL_FALLBACK}
          />
        </div>
        <div className="mt-6 flex items-start justify-between gap-3">
          <h1 className="text-3xl font-bold text-black">{school.name}</h1>
          <PropertyComplianceBadges
            verification={school.verification}
            licensed={school.verification === "verified"}
            registered={school.registered ?? false}
          />
        </div>
        <p className="mt-2 text-gray-600">
          {school.lga}, {school.state} · {school.level} · {ownership}
        </p>
        <dl className="mt-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Year opened</dt>
            <dd className="font-medium">{school.establishedYear}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Teachers</dt>
            <dd className="font-medium">{(school.teachers ?? 0).toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Students</dt>
            <dd className="font-medium">{school.students.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Ministry number</dt>
            <dd className="font-medium">{school.moeNumber}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-gray-500">Address</dt>
            <dd className="font-medium">{school.address}</dd>
          </div>
        </dl>
      </div>
    </SiteShell>
  );
}
