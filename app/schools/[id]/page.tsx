"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteShell } from "@/components/Footer";
import { StatusBadge } from "@/components/civic/StatusBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import { getSchool } from "@/lib/civic/directory";

export default function SchoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const school = getSchool(id);

  if (!school) {
    return (
      <SiteShell>
        <div className="px-4 py-16 text-center">School not found.</div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Link href="/schools" className="text-sm text-gray-600 hover:text-black">
          ← Schools
        </Link>
        <div className="relative mt-4 h-64 overflow-hidden rounded-2xl">
          <SafeImage
            src={school.images[0]}
            alt={school.name}
            fill
            className="object-cover"
            sizes="800px"
            fallbackSrc="/listings/school-1.jpg"
          />
        </div>
        <div className="mt-6 flex items-start justify-between gap-3">
          <h1 className="text-3xl font-bold text-black">{school.name}</h1>
          <StatusBadge status={school.verification} />
        </div>
        <p className="mt-2 text-gray-600">
          {school.city}, {school.state} · {school.level} · {school.ownership}
        </p>
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Schools are listed for government verification only. My App does not sell advertising on
          school pages.
        </div>
        <dl className="mt-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">Ministry number</dt>
            <dd className="font-medium">{school.moeNumber}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Enrolment (est.)</dt>
            <dd className="font-medium">{school.students.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Address</dt>
            <dd className="font-medium">{school.address}</dd>
          </div>
        </dl>
      </div>
    </SiteShell>
  );
}
