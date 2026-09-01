import Link from "next/link";
import { PropertyComplianceBadges } from "@/components/civic/StatusBadge";
import { SafeImage } from "@/components/ui/SafeImage";
import { DEFAULT_HEALTH_FALLBACK, DEFAULT_SCHOOL_FALLBACK } from "@/lib/civic/enrich";
import type { HealthRecord, SchoolRecord } from "@/lib/civic/types";
import { schoolOwnershipLabel } from "@/lib/civic/enrich";

function OwnershipBadge({ label }: { label: string }) {
  const isGov = label === "Government";
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
        isGov ? "bg-[#1e3a5f]/10 text-[#1e3a5f]" : "bg-violet-100 text-violet-800"
      }`}
    >
      {label}
    </span>
  );
}

function RegistrationBadge({ registered }: { registered: boolean }) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
        registered ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {registered ? "Registered" : "Non-registered"}
    </span>
  );
}

export function SchoolFacilityCard({
  school,
  href,
}: {
  school: SchoolRecord;
  href: string;
}) {
  const ownership = schoolOwnershipLabel(school);

  return (
    <Link
      href={href}
      className="group min-w-0 overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="relative h-44 sm:h-48">
        <SafeImage
          src={school.images[0]}
          alt={school.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          fallbackSrc={DEFAULT_SCHOOL_FALLBACK}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <OwnershipBadge label={ownership} />
          <RegistrationBadge registered={school.registered ?? false} />
        </div>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-bold text-black">{school.name}</h3>
        <PropertyComplianceBadges
          verification={school.verification}
          licensed={school.verification === "verified"}
          registered={school.registered ?? false}
          compact
        />
        <p className="text-sm text-gray-600">
          {school.lga}, {school.state} · {school.setting}
        </p>
        <p className="text-sm text-gray-600">
          {school.level} · Est. {school.establishedYear}
        </p>
        <dl className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Teachers</dt>
            <dd className="font-semibold text-slate-900">
              {(school.teachers ?? 0).toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Students</dt>
            <dd className="font-semibold text-slate-900">{school.students.toLocaleString()}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

export function HealthFacilityCard({
  facility,
  href,
}: {
  facility: HealthRecord;
  href: string;
}) {
  const ownership =
    facility.ownership === "Government" ? "Government" : facility.ownership;

  return (
    <Link
      href={href}
      className="group min-w-0 overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
    >
      <div className="relative h-44 sm:h-48">
        <SafeImage
          src={facility.images[0]}
          alt={facility.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          fallbackSrc={DEFAULT_HEALTH_FALLBACK}
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <OwnershipBadge label={ownership} />
          <RegistrationBadge registered={facility.registered ?? false} />
        </div>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-bold text-black">{facility.name}</h3>
        <PropertyComplianceBadges
          verification={facility.verification}
          licensed={facility.verification === "verified"}
          registered={facility.registered ?? false}
          compact
        />
        <p className="text-sm text-gray-600">
          {facility.lga}, {facility.state} · {facility.setting}
        </p>
        <p className="text-sm text-gray-600">
          {facility.facilityType} · Est. {facility.establishedYear}
        </p>
        <dl className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-2 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Doctors</dt>
            <dd className="font-semibold text-slate-900">{facility.doctors ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Nurses</dt>
            <dd className="font-semibold text-slate-900">{facility.nurses ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Beds</dt>
            <dd className="font-semibold text-slate-900">{facility.beds}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
