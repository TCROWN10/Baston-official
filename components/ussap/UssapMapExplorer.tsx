"use client";

import { useMemo, useState } from "react";
import { UssapMap } from "@/components/ussap/UssapMap";
import { ResidentialPropertyPanel } from "@/components/ussap/ResidentialPropertyPanel";
import { SiteCard } from "@/components/ussap/SiteCard";
import { formatCode } from "@/lib/ussap/geocode";
import { getVisibleSites } from "@/lib/ussap/registry";
import {
  viewResidentialProperty,
  type PrivacyViewer,
} from "@/lib/ussap/property-privacy";
import { lookupDigitalAddress } from "@/lib/ussap/user-properties";
import type { SectorKind, UssapRole, UssapSite } from "@/lib/ussap/types";

const LAYERS: { id: SectorKind; label: string }[] = [
  { id: "telecom", label: "Telecom" },
  { id: "project", label: "Projects" },
  { id: "traffic", label: "Traffic" },
  { id: "school", label: "Schools" },
  { id: "residential", label: "Residential" },
];

type Props = {
  role?: UssapRole | string | null;
  viewer?: PrivacyViewer;
  title?: string;
  description?: string;
  heightClass?: string;
  showSelectionPanel?: boolean;
  /** When true, site details stay in-panel (no navigation to /ussap/address). */
  embedded?: boolean;
};

function SelectedSiteSummary({ site }: { site: UssapSite }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">{site.label}</p>
      <p className="mt-1 font-mono text-xs text-[#1e3a5f]">{formatCode(site.code)}</p>
      <p className="mt-2 text-sm capitalize text-slate-600">
        {site.sector} · {site.city}, {site.state}
      </p>
      <p className="mt-1 text-xs capitalize text-slate-500">{site.verification}</p>
    </div>
  );
}

export function UssapMapExplorer({
  role,
  viewer,
  title = "Live map",
  description = "Multi-layer USSAP map with sector overlays. Privacy rules apply to residential records you do not own.",
  heightClass = "h-[320px] sm:h-[420px] md:h-[480px] lg:h-[560px]",
  showSelectionPanel = true,
  embedded = false,
}: Props) {
  const sites = useMemo(
    () => getVisibleSites(role as UssapRole | undefined),
    [role],
  );
  const [active, setActive] = useState<SectorKind[]>(LAYERS.map((l) => l.id));
  const [basemap, setBasemap] = useState<"osm" | "satellite">("osm");
  const [selected, setSelected] = useState<UssapSite | null>(null);

  const toggle = (id: SectorKind) => {
    setActive((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const residentialView = useMemo(() => {
    if (!selected || selected.sector !== "residential") return null;
    const site = lookupDigitalAddress(selected.code);
    if (!site) return null;
    return viewResidentialProperty(site, viewer ?? null);
  }, [selected, viewer]);

  return (
    <div>
      <div className={embedded ? "mb-4" : "mb-6"}>
        <h1
          className={
            embedded
              ? "text-2xl font-bold text-slate-900"
              : "text-2xl font-bold text-slate-900 sm:text-3xl"
          }
        >
          {title}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap">
        <button
          type="button"
          onClick={() => setBasemap("osm")}
          className={`cursor-pointer shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
            basemap === "osm"
              ? "bg-[#1e3a5f] text-white"
              : "bg-white text-slate-700 ring-1 ring-slate-200"
          }`}
        >
          OpenStreetMap
        </button>
        <button
          type="button"
          onClick={() => setBasemap("satellite")}
          className={`cursor-pointer shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
            basemap === "satellite"
              ? "bg-[#1e3a5f] text-white"
              : "bg-white text-slate-700 ring-1 ring-slate-200"
          }`}
        >
          Satellite
        </button>
        {LAYERS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => toggle(l.id)}
            className={`cursor-pointer shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
              active.includes(l.id)
                ? "bg-[#1e3a5f] text-white"
                : "bg-white text-slate-500 ring-1 ring-slate-200"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <UssapMap
          key={basemap}
          sites={sites}
          activeLayers={active}
          onSelect={setSelected}
          basemap={basemap}
          zoom={6}
          heightClass={heightClass}
        />
      </div>

      {showSelectionPanel && selected ? (
        embedded ? (
          <div className="mt-5 space-y-4">
            <SelectedSiteSummary site={selected} />
            {residentialView ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <ResidentialPropertyPanel
                  view={residentialView}
                  showMap={false}
                  compact
                  stayInDashboard={embedded}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,340px)_1fr]">
            <SiteCard site={selected} viewer={viewer} />
            {residentialView ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <ResidentialPropertyPanel
                  view={residentialView}
                  showMap={false}
                  compact
                  stayInDashboard={embedded}
                />
              </div>
            ) : (
              <SelectedSiteSummary site={selected} />
            )}
          </div>
        )
      ) : null}
    </div>
  );
}
