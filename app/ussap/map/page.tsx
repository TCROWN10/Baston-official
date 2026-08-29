"use client";

import { useMemo, useState } from "react";
import { UssapShell } from "@/components/ussap/UssapShell";
import { UssapMap } from "@/components/ussap/UssapMap";
import { SiteCard } from "@/components/ussap/SiteCard";
import { useAuth } from "@/lib/auth";
import { getVisibleSites } from "@/lib/ussap/registry";
import type { SectorKind, UssapRole, UssapSite } from "@/lib/ussap/types";

const LAYERS: { id: SectorKind; label: string }[] = [
  { id: "telecom", label: "Telecom" },
  { id: "project", label: "Projects" },
  { id: "traffic", label: "Traffic" },
  { id: "school", label: "Schools" },
  { id: "residential", label: "Residential" },
];

export default function MapPage() {
  const { user } = useAuth();
  const role = user?.role as UssapRole | undefined;
  const sites = useMemo(() => getVisibleSites(role), [role]);
  const [active, setActive] = useState<SectorKind[]>(LAYERS.map((l) => l.id));
  const [basemap, setBasemap] = useState<"osm" | "satellite">("osm");
  const [selected, setSelected] = useState<UssapSite | null>(null);

  const toggle = (id: SectorKind) => {
    setActive((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <UssapShell>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Multi-layer map</h1>
      <p className="mt-1 text-sm text-slate-600">
        OpenStreetMap streets and Esri satellite imagery with sector overlays. Layer visibility
        respects RBAC
        {role ? ` (${role.replace("_", " ")})` : " (public only — sign in for restricted sites)"}.
      </p>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap">
        <button
          type="button"
          onClick={() => setBasemap("osm")}
          className={`cursor-pointer shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
            basemap === "osm" ? "bg-[#1e3a5f] text-white" : "bg-white text-slate-700"
          }`}
        >
          OpenStreetMap
        </button>
        <button
          type="button"
          onClick={() => setBasemap("satellite")}
          className={`cursor-pointer shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium ${
            basemap === "satellite" ? "bg-[#1e3a5f] text-white" : "bg-white text-slate-700"
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
              active.includes(l.id) ? "bg-[#1e3a5f] text-white" : "bg-white text-slate-500"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl shadow-sm sm:rounded-2xl">
        <UssapMap
          key={basemap}
          sites={sites}
          activeLayers={active}
          onSelect={setSelected}
          basemap={basemap}
          zoom={6}
          heightClass="h-[320px] sm:h-[420px] md:h-[480px] lg:h-[560px]"
        />
      </div>

      {selected ? (
        <div className="mt-5 max-w-md sm:mt-6">
          <SiteCard site={selected} />
        </div>
      ) : null}
    </UssapShell>
  );
}
