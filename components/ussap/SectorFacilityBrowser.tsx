"use client";

import { useMemo, useState } from "react";
import { HealthFacilityCard, SchoolFacilityCard } from "@/components/ussap/FacilityCard";
import { CustomSelect } from "@/components/ui/CustomSelect";
import type { OwnershipFilter } from "@/lib/civic/enrich";
import {
  matchesOwnershipHealth,
  matchesOwnershipSchool,
} from "@/lib/civic/enrich";
import { buildLocationIndex } from "@/lib/civic/locations";
import { getSectorDefinition, type SectorModuleId } from "@/lib/ussap/sector-modules";
import type { HealthRecord, SchoolRecord } from "@/lib/civic/types";

type SchoolBrowserProps = {
  kind: "school";
  items: SchoolRecord[];
  detailBasePath: string;
};

type HealthBrowserProps = {
  kind: "health";
  items: HealthRecord[];
  detailBasePath: string;
};

type Props = (SchoolBrowserProps | HealthBrowserProps) & {
  sectorId: SectorModuleId;
  initialState?: string;
  initialLga?: string;
};

const OWNERSHIP_OPTIONS = [
  { value: "all", label: "All ownership" },
  { value: "government", label: "Government / Public" },
  { value: "private", label: "Private" },
];

export function SectorFacilityBrowser(props: Props) {
  const { sectorId, kind, items, detailBasePath, initialState = "", initialLga = "" } = props;
  const sector = getSectorDefinition(sectorId);

  const locationIndex = useMemo(
    () => buildLocationIndex(items.map((i) => ({ state: i.state, city: i.city, lga: i.lga }))),
    [items],
  );

  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedArea, setSelectedArea] = useState(initialLga);
  const [ownership, setOwnership] = useState<OwnershipFilter>("all");
  const [query, setQuery] = useState("");
  const [showServices, setShowServices] = useState(true);

  const areas = selectedState ? locationIndex.areasByState[selectedState] || [] : [];

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const area = item.lga || item.city;
      const matchState = !selectedState || item.state === selectedState;
      const matchArea = !selectedArea || area === selectedArea;
      const matchQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        area.toLowerCase().includes(query.toLowerCase());
      const matchOwnership =
        kind === "school"
          ? matchesOwnershipSchool(item as SchoolRecord, ownership)
          : matchesOwnershipHealth(item as HealthRecord, ownership);
      return matchState && matchArea && matchQuery && matchOwnership;
    });
  }, [items, selectedState, selectedArea, query, ownership, kind]);

  const govCount = filtered.filter((i) =>
    kind === "school"
      ? (i as SchoolRecord).ownership === "Public"
      : (i as HealthRecord).ownership === "Government",
  ).length;
  const privateCount = filtered.length - govCount;

  return (
    <div className="w-full min-w-0">
      {sector ? (
        <div className="mb-8 rounded-2xl border border-[#1e3a5f]/15 bg-[#1e3a5f]/5">
          <button
            type="button"
            onClick={() => setShowServices((v) => !v)}
            className="cursor-pointer flex w-full items-center justify-between px-4 py-4 text-left sm:px-5"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3d7ea6]">
                Services we render
              </p>
              <h2 className="mt-0.5 text-lg font-bold text-[#1e3a5f]">{sector.title}</h2>
            </div>
            <span className="text-sm text-slate-600">{showServices ? "Hide ▲" : "Show ▼"}</span>
          </button>
          {showServices ? (
            <div className="grid gap-3 border-t border-[#1e3a5f]/10 px-4 pb-4 pt-3 sm:grid-cols-2 sm:px-5 lg:grid-cols-3">
              {sector.modules.map((m) => (
                <div key={m.title} className="rounded-xl bg-white p-3 shadow-sm">
                  <h3 className="text-sm font-semibold text-[#1e3a5f]">{m.title}</h3>
                  <ul className="mt-2 space-y-1">
                    {m.items.slice(0, 2).map((line) => (
                      <li key={line} className="text-xs text-slate-600">
                        · {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Select location & local government area
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Choose a state, then an LGA or area to see all{" "}
          {kind === "school" ? "schools" : "health facilities"} in that zone.
        </p>
      </div>

      <div className="mb-5 grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
        <CustomSelect
          value={selectedState}
          onChange={(state) => {
            setSelectedState(state);
            setSelectedArea("");
          }}
          ariaLabel="Select state"
          placeholder="Select state"
          options={[
            { value: "", label: `All Nigeria (${items.length})` },
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
          placeholder={`Search ${kind === "school" ? "schools" : "hospitals"}…`}
          className="field-control px-4 py-2.5 text-sm"
        />
        <CustomSelect
          value={ownership}
          onChange={(v) => setOwnership(v as OwnershipFilter)}
          ariaLabel="Filter by ownership"
          options={OWNERSHIP_OPTIONS}
        />
      </div>

      <p className="mb-5 text-sm text-slate-600">
        {filtered.length} results · Gov {govCount} · Private {privateCount}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <p className="font-medium text-slate-800">No facilities in this area yet</p>
          <p className="mt-1 text-sm text-slate-600">
            Try another state or LGA, or clear filters to browse all of Nigeria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {filtered.map((item) =>
            kind === "school" ? (
              <SchoolFacilityCard
                key={item.id}
                school={item as SchoolRecord}
                href={`${detailBasePath}/${item.id}`}
              />
            ) : (
              <HealthFacilityCard
                key={item.id}
                facility={item as HealthRecord}
                href={`${detailBasePath}/${item.id}`}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
