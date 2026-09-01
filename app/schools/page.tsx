import { SiteShell } from "@/components/Footer";
import { SectorFacilityBrowser } from "@/components/ussap/SectorFacilityBrowser";
import { enrichedSchools } from "@/lib/civic/enrich";

export default function SchoolsPage() {
  const schools = enrichedSchools();

  return (
    <SiteShell>
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#0f1f35] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold text-white sm:text-5xl">Schools registry</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-white/90">
            Browse schools by state and local government area — government and private, registered
            and non-registered.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <SectorFacilityBrowser
          sectorId="education"
          kind="school"
          items={schools}
          detailBasePath="/ussap/schools"
        />
      </section>
    </SiteShell>
  );
}
