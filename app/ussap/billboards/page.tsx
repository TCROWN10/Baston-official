"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BillboardCard } from "@/components/ussap/BillboardCard";
import { SectorModuleOverview } from "@/components/ussap/SectorModuleOverview";
import { UssapShell } from "@/components/ussap/UssapShell";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { BILLBOARDS } from "@/lib/civic/government";
import { buildLocationIndex } from "@/lib/civic/locations";
import { getSectorDefinition } from "@/lib/ussap/sector-modules";

export default function UssapBillboardsPage() {
  const sector = useMemo(() => getSectorDefinition("billboards"), []);
  const locationIndex = useMemo(
    () =>
      buildLocationIndex(
        BILLBOARDS.map((b) => ({ state: b.state, city: b.city, lga: b.lga || b.city })),
      ),
    [],
  );

  const [selectedState, setSelectedState] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");

  const areas = selectedState ? locationIndex.areasByState[selectedState] || [] : [];

  const filtered = useMemo(() => {
    return BILLBOARDS.filter((b) => {
      const area = b.lga || b.city;
      const matchState = !selectedState || b.state === selectedState;
      const matchArea = !selectedArea || area === selectedArea;
      const matchStatus = statusFilter === "all" || b.verification === statusFilter;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        b.location.toLowerCase().includes(q) ||
        b.operator.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q);
      return matchState && matchArea && matchStatus && matchQuery;
    });
  }, [selectedState, selectedArea, statusFilter, query]);

  return (
    <UssapShell>
      {sector ? <SectorModuleOverview sector={sector} showNumber={false} /> : null}

      <div className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Outdoor asset registry</h2>
            <p className="mt-1 text-sm text-slate-600">
              Real outdoor advertising structures — geo-tagged with permit status, operator, and
              photo inventory from field-style assets.
            </p>
          </div>
          <Link
            href="/government/billboards"
            className="text-sm font-medium text-[#1e3a5f] hover:underline"
          >
            Government verification →
          </Link>
        </div>

        <div className="mt-6 mb-5 grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          <CustomSelect
            value={selectedState}
            onChange={(state) => {
              setSelectedState(state);
              setSelectedArea("");
            }}
            ariaLabel="Select state"
            placeholder="Select state"
            options={[
              { value: "", label: `All Nigeria (${BILLBOARDS.length})` },
              ...locationIndex.states.map((state) => ({
                value: state,
                label: `${state} (${locationIndex.countByState[state]})`,
              })),
            ]}
          />
          <CustomSelect
            value={selectedArea}
            onChange={setSelectedArea}
            ariaLabel="Select local government area"
            placeholder={selectedState ? "Select LGA / area" : "Choose state first"}
            options={[
              {
                value: "",
                label: selectedState
                  ? `All areas (${locationIndex.countByState[selectedState] ?? 0})`
                  : "All areas",
              },
              ...areas.map((area) => ({
                value: area,
                label: `${area} (${locationIndex.countByArea[selectedState]?.[area] ?? 0})`,
              })),
            ]}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search location or operator…"
            className="field-control px-4 py-2.5 text-sm"
          />
          <CustomSelect
            value={statusFilter}
            onChange={setStatusFilter}
            ariaLabel="Filter by permit status"
            options={[
              { value: "all", label: "All statuses" },
              { value: "verified", label: "Verified" },
              { value: "pending", label: "Pending" },
              { value: "flagged", label: "Flagged" },
            ]}
          />
        </div>

        <p className="mb-5 text-sm text-slate-600">{filtered.length} billboards</p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
            <p className="font-medium text-slate-800">No billboards in this filter</p>
            <p className="mt-1 text-sm text-slate-600">Try another state, area, or clear search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {filtered.map((board) => (
              <BillboardCard key={board.id} board={board} href="/government/billboards" />
            ))}
          </div>
        )}
      </div>
    </UssapShell>
  );
}
