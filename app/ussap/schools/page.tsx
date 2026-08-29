"use client";

import { useMemo } from "react";
import { UssapShell } from "@/components/ussap/UssapShell";
import { SiteCard } from "@/components/ussap/SiteCard";
import { useAuth } from "@/lib/auth";
import { formatCode } from "@/lib/ussap/geocode";
import { sitesBySector } from "@/lib/ussap/registry";
import type { SchoolSite, UssapRole } from "@/lib/ussap/types";

export default function UssapSchoolsPage() {
  const { user } = useAuth();
  const role = user?.role as UssapRole | undefined;
  const sites = useMemo(() => sitesBySector("school", role) as SchoolSite[], [role]);

  return (
    <UssapShell>
      <h1 className="text-3xl font-bold">Schools module</h1>
      <p className="mt-1 text-sm text-slate-600">
        Verified, shareable school location profiles for emergency services, logistics, and
        accurate campus mapping.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <article key={site.code} className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold">{site.label}</h2>
            <p className="font-mono text-xs text-[#1e3a5f]">{formatCode(site.code)}</p>
            <p className="mt-2 text-xs capitalize text-slate-500">
              {site.schoolType} · {site.ownership}
              {site.enrollment ? ` · ${site.enrollment.toLocaleString()} students` : ""}
            </p>
            {site.emergencyContact ? (
              <p className="mt-2 text-sm text-slate-700">Emergency: {site.emergencyContact}</p>
            ) : null}
            <div className="mt-3">
              <SiteCard site={site} />
            </div>
          </article>
        ))}
      </div>
    </UssapShell>
  );
}
