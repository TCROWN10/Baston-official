"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusBadge, naira } from "@/components/civic/StatusBadge";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { SafeImage } from "@/components/ui/SafeImage";
import { NIGERIA_STATES } from "@/lib/civic/directory";
import type { CompanyRecord, HotelRecord, SchoolRecord } from "@/lib/civic/types";

type Item = HotelRecord | SchoolRecord | CompanyRecord;

export function DirectoryGrid({
  items,
  kind,
  loading,
  source,
  liveCount,
  error,
  onRefresh,
}: {
  items: Item[];
  kind: "hotel" | "school" | "company";
  loading?: boolean;
  source?: string;
  liveCount?: number;
  error?: string | null;
  onRefresh?: () => void;
}) {
  const [q, setQ] = useState("");
  const [state, setState] = useState("");
  const stateOptions = useMemo(() => {
    const present = new Set(items.map((i) => i.state));
    const extras = Array.from(present)
      .filter((s) => !NIGERIA_STATES.includes(s))
      .sort();
    return [
      { value: "", label: "All states" },
      ...NIGERIA_STATES.map((s) => ({ value: s, label: s })),
      ...extras.map((s) => ({ value: s, label: s })),
    ];
  }, [items]);
  const filtered = items.filter((item) => {
    const hit =
      !q ||
      item.name.toLowerCase().includes(q.toLowerCase()) ||
      item.city.toLowerCase().includes(q.toLowerCase());
    return hit && (!state || item.state === state);
  });

  return (
    <div className="w-full min-w-0">
      {kind === "hotel" && (source || error) ? (
        <div className="mb-4 flex flex-col gap-3 rounded-xl bg-[#1e3a5f]/10 px-3 py-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <p className="min-w-0 break-words">
            {loading
              ? "Fetching live hotels from OpenStreetMap across Nigeria…"
              : error
                ? error
                : `${items.length} hotels · ${liveCount ?? 0} live from OpenStreetMap · source: ${source}`}
          </p>
          {onRefresh ? (
            <button
              type="button"
              onClick={onRefresh}
              disabled={loading}
              className="cursor-pointer shrink-0 rounded-lg bg-[#1e3a5f] px-3 py-2 text-xs font-medium text-white disabled:opacity-60 sm:py-1.5"
            >
              Refresh live data
            </button>
          ) : null}
        </div>
      ) : null}
      <div className="mb-5 grid gap-2.5 sm:mb-6 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={`Search ${kind}s...`}
          className="field-control px-4 py-2.5 text-sm"
        />
        <CustomSelect
          value={state}
          onChange={setState}
          ariaLabel="Filter by state"
          placeholder="All states"
          options={stateOptions}
        />
        <p className="flex items-center text-sm text-gray-600 sm:col-span-2 lg:col-span-1">
          {loading ? "Loading…" : `${filtered.length} records`}
          {!loading && kind === "hotel"
            ? " · OpenStreetMap + registry"
            : !loading
              ? " · directory"
              : ""}
        </p>
      </div>
      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center sm:min-h-[280px]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1e3a5f] border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/${kind === "company" ? "companies" : kind + "s"}/${item.id}`}
              className="group min-w-0 overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="relative h-44 sm:h-48">
                <SafeImage
                  src={item.images[0]}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  fallbackSrc={
                    kind === "school"
                      ? "/listings/school-1.jpg"
                      : kind === "company"
                        ? "/listings/company-1.jpg"
                        : "/listings/hotel-1.jpg"
                  }
                />
                {"live" in item && item.live ? (
                  <span className="absolute right-3 top-3 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                    Live
                  </span>
                ) : null}
                {"advertActive" in item && item.advertActive ? (
                  <span className="absolute left-3 top-3 rounded-md bg-[#1e3a5f] px-2.5 py-1 text-xs font-medium text-white">
                    Advert
                  </span>
                ) : null}
              </div>
              <div className="space-y-2 p-3 sm:p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 min-w-0 font-bold text-black">{item.name}</h3>
                  <div className="shrink-0">
                    <StatusBadge status={item.verification} />
                  </div>
                </div>
                <p className="truncate text-sm text-gray-600">
                  {item.city}, {item.state}
                </p>
                {kind === "hotel" && "nightlyFrom" in item ? (
                  <p className="text-sm font-medium text-black">
                    From {naira(item.nightlyFrom)} / night
                  </p>
                ) : null}
                {kind === "school" && "level" in item ? (
                  <p className="text-sm text-gray-600">
                    {item.level} · {item.ownership}
                  </p>
                ) : null}
                {kind === "company" && "sector" in item ? (
                  <p className="truncate text-sm text-gray-600">{item.sector}</p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
