import Link from "next/link";
import { UssapShell } from "@/components/ussap/UssapShell";
import { SECTOR_DEFINITIONS } from "@/lib/ussap/sector-modules";

export default function SectorsIndexPage() {
  return (
    <UssapShell>
      <h1 className="text-3xl font-bold">Bastion Technology sector modules</h1>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">
        Six sector modules plus Bastion TECHNOLOGY cross-cutting services for monitoring,
        assessment, and data intelligence across Nigeria.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTOR_DEFINITIONS.map((sector) => (
          <Link
            key={sector.id}
            href={`/ussap/sectors/${sector.id}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-xs font-semibold text-[#3d7ea6]">Sector {sector.number}</p>
            <h2 className="mt-1 font-semibold text-[#1e3a5f]">{sector.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{sector.tagline}</p>
            <p className="mt-3 text-sm font-medium text-[#3d7ea6]">View modules →</p>
          </Link>
        ))}
      </div>
    </UssapShell>
  );
}
