"use client";

import { useSearchParams } from "next/navigation";
import { SectorFacilityBrowser } from "@/components/ussap/SectorFacilityBrowser";
import type { SchoolRecord } from "@/lib/civic/types";

export function SchoolsBrowser({ schools }: { schools: SchoolRecord[] }) {
  const params = useSearchParams();
  const initialState = params.get("state") ?? "";
  const initialLga = params.get("lga") ?? "";

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Education sector</h1>
        <p className="mt-1 text-sm text-slate-600 sm:text-base">
          Browse registered and non-registered schools by state and local government area — with
          photos, staff counts, and ownership type.
        </p>
      </div>
      <SectorFacilityBrowser
        sectorId="education"
        kind="school"
        items={schools}
        detailBasePath="/ussap/schools"
        initialState={initialState}
        initialLga={initialLga}
      />
    </>
  );
}
