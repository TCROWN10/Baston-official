"use client";

import Link from "next/link";
import { useState } from "react";
import { SECTOR_DEFINITIONS, type SectorModuleId } from "@/lib/ussap/sector-modules";

export function SectorModulesHub() {
  const [active, setActive] = useState<SectorModuleId>("education");
  const sector = SECTOR_DEFINITIONS.find((s) => s.id === active)!;

  return (
    <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl font-bold text-black sm:text-2xl lg:text-3xl">
            <span className="text-[#1e3a5f]">Bastion Technology</span> sector modules
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-600 sm:text-base">
            Six integrated sectors plus Bastion TECHNOLOGY cross-cutting tools — each with
            dedicated directories, field inspections, and compliance workflows.
          </p>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:gap-2">
          {SECTOR_DEFINITIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActive(s.id)}
              className={`cursor-pointer shrink-0 rounded-lg px-3 py-2 text-xs font-medium sm:text-sm ${
                active === s.id
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {s.title.replace(" Sector", "").replace("Cross-Cutting Core Modules: Monitoring, Assessment, & Data", "Bastion")}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3d7ea6]">
            Sector {sector.number}
          </p>
          <h3 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{sector.title}</h3>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">{sector.tagline}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {sector.modules.map((block) => (
              <article
                key={block.title}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <h4 className="font-semibold text-[#1e3a5f]">{block.title}</h4>
                <ul className="mt-2 space-y-1.5">
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

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={sector.primaryHref}
              className="rounded-lg bg-[#3d7ea6] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#326a8c]"
            >
              {sector.primaryLabel}
            </Link>
            <Link
              href={`/ussap/sectors/${sector.id}`}
              className="rounded-lg border border-[#1e3a5f] px-5 py-2.5 text-sm font-medium text-[#1e3a5f] transition-colors hover:bg-[#1e3a5f]/5"
            >
              Full sector overview →
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SECTOR_DEFINITIONS.map((s) => (
            <Link
              key={s.id}
              href={`/ussap/sectors/${s.id}`}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
            >
              <p className="text-xs font-semibold text-[#3d7ea6]">Sector {s.number}</p>
              <h3 className="mt-1 font-semibold text-[#1e3a5f]">{s.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-600">{s.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
