"use client";

import Link from "next/link";
import { UssapMap } from "@/components/ussap/UssapMap";
import { PropertyPrivacyBanner } from "@/components/ussap/PropertyPrivacyBanner";
import { decodeGrid, formatCode, shareAddress } from "@/lib/ussap/geocode";
import type { ResidentialPropertyView } from "@/lib/ussap/property-privacy";
import type { ResidentialSite } from "@/lib/ussap/types";

type Props = {
  view: ResidentialPropertyView;
  showMap?: boolean;
  compact?: boolean;
  stayInDashboard?: boolean;
};

export function ResidentialPropertyPanel({
  view,
  showMap = true,
  compact = false,
  stayInDashboard = false,
}: Props) {
  const site = view.site;
  const isFull = !view.isRedacted;
  const display = view.isRedacted ? view.display : null;

  let precision = 0;
  try {
    precision = decodeGrid(site.code).precisionM;
  } catch {
    precision = 0;
  }

  const mapLat = isFull ? site.lat : display!.latApprox;
  const mapLng = isFull ? site.lng : display!.lngApprox;
  const mapZoom = isFull ? 15 : 12;

  return (
    <div className={compact ? "" : "space-y-4"}>
      <PropertyPrivacyBanner
        mode={view.mode}
        redactedFields={view.isRedacted ? view.redactedFields : undefined}
      />

      <div className={compact ? "mt-3" : ""}>
        <h2 className={compact ? "font-semibold text-slate-900" : "text-2xl font-bold text-slate-900"}>
          {site.label}
        </h2>
        <p className="mt-1 font-mono text-sm text-[#1e3a5f]">{formatCode(site.code)}</p>

        {isFull ? (
          <>
            <p className="mt-2 text-sm text-slate-600">
              {site.city}, {site.state} · {site.lat.toFixed(6)}, {site.lng.toFixed(6)}
              {precision ? ` · ~${Math.round(precision)} m cell` : ""}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-md bg-slate-900 px-2 py-1 capitalize text-white">
                {site.sector}
              </span>
              <span className="rounded-md bg-emerald-100 px-2 py-1 capitalize text-emerald-800">
                {site.verification}
              </span>
              <span className="rounded-md bg-[#1e3a5f]/10 px-2 py-1 capitalize text-[#1e3a5f]">
                {site.sensitivity}
              </span>
            </div>
            {site.unitNo ? (
              <p className="mt-2 text-sm text-slate-600">Unit / plot: {site.unitNo}</p>
            ) : null}
            {site.deliveryNotes || site.description ? (
              <p className="mt-2 text-sm text-slate-600">
                {site.deliveryNotes || site.description}
              </p>
            ) : null}
            {site.ownerOrg ? (
              <p className="mt-2 text-sm text-slate-600">Registered to: {site.ownerOrg}</p>
            ) : null}
            {site.ownerEmail && (view.mode === "full" || view.mode === "owner") ? (
              <p className="mt-1 text-xs text-slate-500">Owner account: {site.ownerEmail}</p>
            ) : null}
            {site.utilityMeterId ? (
              <p className="mt-1 text-xs text-slate-500">Meter: {site.utilityMeterId}</p>
            ) : null}
            {site.shareable ? (
              <button
                type="button"
                className="mt-3 cursor-pointer rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white"
                onClick={() => navigator.clipboard?.writeText(shareAddress(site.code, site.label))}
              >
                Copy shareable digital address
              </button>
            ) : null}
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-slate-600">
              {display!.city}, {display!.state} · Approx. area only
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Type: {display!.propertyType} · {display!.ownerLabel}
            </p>
            <p className="mt-1 text-xs capitalize text-slate-500">
              Verification: {display!.verification}
            </p>
            {!stayInDashboard ? (
              <Link
                href={`/ussap/address/${site.code}`}
                className="mt-3 inline-block text-sm font-medium text-[#1e3a5f] hover:underline"
              >
                Open property record →
              </Link>
            ) : null}
          </>
        )}
      </div>

      {showMap ? (
        <div className={compact ? "mt-4" : "mt-6"}>
          {!isFull ? (
            <p className="mb-2 text-xs text-slate-500">
              Map shows approximate location only — exact GPS is confidential.
            </p>
          ) : null}
          <UssapMap
            sites={[{ ...(site as ResidentialSite), lat: mapLat, lng: mapLng }]}
            center={[mapLat, mapLng]}
            zoom={mapZoom}
            heightClass={compact ? "h-[220px]" : "h-[360px]"}
          />
        </div>
      ) : null}
    </div>
  );
}
