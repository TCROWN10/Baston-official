import { Suspense } from "react";
import { HealthBrowser } from "@/app/ussap/health/HealthBrowser";
import { UssapShell } from "@/components/ussap/UssapShell";
import { enrichedHealthFacilities } from "@/lib/civic/enrich";

export default function UssapHealthPage() {
  const facilities = enrichedHealthFacilities();

  return (
    <UssapShell>
      <Suspense fallback={<p className="text-sm text-slate-600">Loading health facilities…</p>}>
        <HealthBrowser facilities={facilities} />
      </Suspense>
    </UssapShell>
  );
}
