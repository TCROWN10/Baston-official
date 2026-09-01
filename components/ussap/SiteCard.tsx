"use client";

import Link from "next/link";
import { formatCode } from "@/lib/ussap/geocode";
import {
  approximateCoordinate,
  getResidentialAccessMode,
  type PrivacyViewer,
} from "@/lib/ussap/property-privacy";
import type { ResidentialSite, UssapSite } from "@/lib/ussap/types";
import { SECTOR_COLOR } from "./UssapMap";

export function SiteCard({ site, viewer }: { site: UssapSite; viewer?: PrivacyViewer }) {
  const isResidential = site.sector === "residential";
  const mode = isResidential
    ? getResidentialAccessMode(site as ResidentialSite, viewer ?? null)
    : "public";
  const isRedacted = site.sector === "residential" && mode === "public";
  const lat = isRedacted ? approximateCoordinate(site.lat) : site.lat;
  const lng = isRedacted ? approximateCoordinate(site.lng) : site.lng;

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
        {site.city}, {site.state}
        {isRedacted ? " · approx. area" : ` · ${lat.toFixed(5)}, ${lng.toFixed(5)}`}
      </p>
      <p className="mt-1 text-[11px] capitalize text-slate-500">
        {site.verification}
        {!isRedacted ? ` · ${site.sensitivity}` : " · privacy protected"}
      </p>
    </Link>
  );
}
