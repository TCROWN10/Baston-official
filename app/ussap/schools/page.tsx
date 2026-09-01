import { Suspense } from "react";
import { SchoolsBrowser } from "@/app/ussap/schools/SchoolsBrowser";
import { UssapShell } from "@/components/ussap/UssapShell";
import { enrichedSchools } from "@/lib/civic/enrich";

export default function UssapSchoolsPage() {
  const schools = enrichedSchools();

  return (
    <UssapShell>
      <Suspense fallback={<p className="text-sm text-slate-600">Loading schools…</p>}>
        <SchoolsBrowser schools={schools} />
      </Suspense>
    </UssapShell>
  );
}
