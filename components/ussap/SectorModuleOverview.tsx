import Link from "next/link";
import type { SectorDefinition } from "@/lib/ussap/sector-modules";

export function SectorModuleOverview({
  sector,
  showNumber = true,
}: {
  sector: SectorDefinition;
  showNumber?: boolean;
}) {
  return (
    <div>
      <div className="max-w-3xl">
        {showNumber ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3d7ea6]">
            Sector {sector.number}
          </p>
        ) : null}
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">{sector.title}</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">{sector.tagline}</p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {sector.modules.map((block) => (
          <article
            key={block.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="font-semibold text-[#1e3a5f]">{block.title}</h2>
            <ul className="mt-3 space-y-2">
              {block.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3d7ea6]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={sector.primaryHref}
          className="rounded-lg bg-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#152a45]"
        >
          {sector.primaryLabel}
        </Link>
        {sector.secondaryHref && sector.secondaryLabel ? (
          <Link
            href={sector.secondaryHref}
            className="rounded-lg border border-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-[#1e3a5f] transition-colors hover:bg-[#1e3a5f]/5"
          >
            {sector.secondaryLabel}
          </Link>
        ) : null}
        {sector.govHref && sector.govLabel ? (
          <Link
            href={sector.govHref}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            {sector.govLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
