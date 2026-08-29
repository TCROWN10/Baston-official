"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { UssapShell } from "@/components/ussap/UssapShell";
import { UssapMap } from "@/components/ussap/UssapMap";
import { useAuth } from "@/lib/auth";
import { decodeGrid, formatCode, shareAddress } from "@/lib/ussap/geocode";
import { getSite } from "@/lib/ussap/registry";
import type { UssapRole } from "@/lib/ussap/types";

export default function AddressDetailPage() {
  const { code } = useParams<{ code: string }>();
  const { user } = useAuth();
  const decoded = decodeURIComponent(code || "");
  const site = getSite(decoded, user?.role as UssapRole | undefined);

  if (!site) {
    return (
      <UssapShell>
        <h1 className="text-2xl font-bold">Address not found or restricted</h1>
        <p className="mt-2 text-sm text-slate-600">
          This digital address is missing, or your role cannot view its sensitivity level.
        </p>
        <Link href="/ussap/map" className="mt-4 inline-block text-sm text-[#1e3a5f]">
          ← Back to map
        </Link>
      </UssapShell>
    );
  }

  let precision = 0;
  try {
    precision = decodeGrid(site.code).precisionM;
  } catch {
    precision = 0;
  }

  return (
    <UssapShell>
      <Link href="/ussap/map" className="text-sm text-slate-600 hover:text-[#1e3a5f]">
        ← Map
      </Link>
      <h1 className="mt-3 text-3xl font-bold">{site.label}</h1>
      <p className="mt-1 font-mono text-lg text-[#1e3a5f]">{formatCode(site.code)}</p>
      <p className="mt-2 text-sm text-slate-600">
        {site.city}, {site.state} · {site.lat.toFixed(6)}, {site.lng.toFixed(6)}
        {precision ? ` · ~${Math.round(precision)} m cell` : ""}
      </p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="rounded-md bg-slate-900 px-2 py-1 capitalize text-white">{site.sector}</span>
        <span className="rounded-md bg-emerald-100 px-2 py-1 capitalize text-emerald-800">
          {site.verification}
        </span>
        <span className="rounded-md bg-[#1e3a5f]/10 px-2 py-1 capitalize text-[#1e3a5f]">
          {site.sensitivity}
        </span>
      </div>

      <button
        type="button"
        className="mt-4 cursor-pointer rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white"
        onClick={() => navigator.clipboard?.writeText(shareAddress(site.code, site.label))}
      >
        Copy shareable digital address
      </button>

      <div className="mt-6">
        <UssapMap
          sites={[site]}
          center={[site.lat, site.lng]}
          zoom={15}
          heightClass="h-[360px]"
        />
      </div>
    </UssapShell>
  );
}
