"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SectorFacilityBrowser } from "@/components/ussap/SectorFacilityBrowser";
import { UssapShell } from "@/components/ussap/UssapShell";
import { enrichedSchools } from "@/lib/civic/enrich";

function SchoolsContent() {
  const params = useSearchParams();
  const schools = useMemo(() => enrichedSchools(), []);
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

export default function UssapSchoolsPage() {
  return (
    <UssapShell>
      <Suspense fallback={<p className="text-sm text-slate-600">Loading schools…</p>}>
        <SchoolsContent />
      </Suspense>
    </UssapShell>
  );
}
