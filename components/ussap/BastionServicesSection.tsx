"use client";

import Link from "next/link";
import { BASTION_SERVICES } from "@/lib/ussap/sector-modules";

export function BastionServicesSection() {
  return (
    <section className="bg-gradient-to-br from-[#0c1929] via-[#1e3a5f] to-[#152a45] px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3d7ea6]">
          Our services
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          {BASTION_SERVICES.name}
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-white/90 sm:text-base">
          {BASTION_SERVICES.tagline}
        </p>
        <p className="mt-2 max-w-3xl text-sm font-medium text-white/80">
          {BASTION_SERVICES.title}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {BASTION_SERVICES.modules.map((module) => (
            <article
              key={module.title}
              className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur sm:p-6"
            >
              <h3 className="text-lg font-semibold text-white">{module.title}</h3>
              <ul className="mt-4 space-y-2">
                {module.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-white/90">
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
            href="/ussap/field"
            className="rounded-lg bg-[#3d7ea6] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#326a8c]"
          >
            Field data collection
          </Link>
          <Link
            href="/ussap/projects"
            className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Project monitoring
          </Link>
          <Link
            href="/ussap/sectors/core"
            className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Full Bastion overview →
          </Link>
        </div>
      </div>
    </section>
  );
}
