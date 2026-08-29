import { SiteShell } from "@/components/Footer";
import { DirectoryGrid } from "@/components/civic/DirectoryGrid";
import { COMPANIES } from "@/lib/civic/directory";

export default function CompaniesPage() {
  return (
    <SiteShell>
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#0f1f35] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold text-white sm:text-5xl">Companies & organisations</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-white/90">
            Live directory of companies and private organisations. Government partners use this
            register to verify CAC records and tax standing.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
        <DirectoryGrid items={COMPANIES} kind="company" />
      </section>
    </SiteShell>
  );
}
