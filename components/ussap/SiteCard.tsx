"use client";

import Link from "next/link";
import { formatCode } from "@/lib/ussap/geocode";
import type { UssapSite } from "@/lib/ussap/types";
import { SECTOR_COLOR } from "./UssapMap";

export function SiteCard({ site }: { site: UssapSite }) {
  return (
    <Link
      href={`/ussap/address/${encodeURIComponent(site.code)}`}
      className="block rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{site.label}</p>
          <p className="mt-1 font-mono text-xs font-medium text-[#1e3a5f]">
            {formatCode(site.code)}
          </p>
        </div>
        <span
          className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
          style={{ background: SECTOR_COLOR[site.sector] }}
        >
          {site.sector}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-600">
        {site.city}, {site.state} · {site.lat.toFixed(5)}, {site.lng.toFixed(5)}
      </p>
      <p className="mt-1 text-[11px] capitalize text-slate-500">
        {site.verification} · {site.sensitivity}
      </p>
    </Link>
  );
}
