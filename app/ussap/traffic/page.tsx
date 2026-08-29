"use client";

import { useMemo } from "react";
import { UssapShell } from "@/components/ussap/UssapShell";
import { SiteCard } from "@/components/ussap/SiteCard";
import { useAuth } from "@/lib/auth";
import { formatCode } from "@/lib/ussap/geocode";
import { sitesBySector } from "@/lib/ussap/registry";
import type { TrafficSite, UssapRole } from "@/lib/ussap/types";

const STATUS: Record<TrafficSite["statusTag"], string> = {
  online: "bg-emerald-100 text-emerald-800",
  offline: "bg-slate-200 text-slate-700",
  congested: "bg-[#1e3a5f]/10 text-[#1e3a5f]",
  clear: "bg-[#1e3a5f]/10 text-[#152a45]",
  incident: "bg-red-100 text-red-800",
};

export default function TrafficPage() {
  const { user } = useAuth();
  const role = user?.role as UssapRole | undefined;
  const sites = useMemo(() => sitesBySector("traffic", role) as TrafficSite[], [role]);

  return (
    <UssapShell>
      <h1 className="text-3xl font-bold">Traffic sites module</h1>
      <p className="mt-1 text-sm text-slate-600">
        Map traffic monitoring cameras, congestion hot-spots, and accident-prone zones with
        real-time status tags for urban planning and emergency response.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sites.map((site) => (
          <article key={site.code} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="font-semibold">{site.label}</h2>
                <p className="font-mono text-xs text-[#1e3a5f]">{formatCode(site.code)}</p>
              </div>
              <span className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase ${STATUS[site.statusTag]}`}>
                {site.statusTag}
              </span>
            </div>
            <p className="mt-2 text-xs capitalize text-slate-500">
              {site.siteType.replace("_", " ")} · {site.operator}
            </p>
            {site.realtimeNote ? (
              <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {site.realtimeNote}
              </p>
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
