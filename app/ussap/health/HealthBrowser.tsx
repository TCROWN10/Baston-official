"use client";

import { useSearchParams } from "next/navigation";
import { SectorFacilityBrowser } from "@/components/ussap/SectorFacilityBrowser";
import type { HealthRecord } from "@/lib/civic/types";

export function HealthBrowser({ facilities }: { facilities: HealthRecord[] }) {
  const params = useSearchParams();
  const initialState = params.get("state") ?? "";
  const initialLga = params.get("lga") ?? "";

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Health sector</h1>
        <p className="mt-1 text-sm text-slate-600 sm:text-base">
          Hospitals, clinics, and rural health centres by state and LGA — with bed capacity, staff
          counts, and government vs. private classification.
        </p>
      </div>
      <SectorFacilityBrowser
        sectorId="health"
        kind="health"
        items={facilities}
        detailBasePath="/ussap/health"
        initialState={initialState}
        initialLga={initialLga}
      />
    </>
  );
}
