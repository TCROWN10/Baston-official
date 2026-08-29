"use client";

import { SiteShell } from "@/components/Footer";
import { DirectoryGrid } from "@/components/civic/DirectoryGrid";
import { useLiveHotels } from "@/lib/live/useLiveHotels";

export default function HotelsPage() {
  const { items, loading, source, liveCount, error, refresh } = useLiveHotels();

  return (
    <SiteShell>
      <section className="bg-gradient-to-br from-[#1e3a5f] to-[#0f1f35] px-4 py-10 sm:px-6 sm:py-14 md:py-16">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-2xl font-bold text-white sm:text-4xl md:text-5xl">
            Hotels across Nigeria
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/90 sm:mt-3 sm:text-lg">
            Live hotel and guest-house listings pulled from OpenStreetMap across every state,
            merged with verified registry entries.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-10">
        <DirectoryGrid
          items={items}
          kind="hotel"
          loading={loading}
          source={source}
          liveCount={liveCount}
          error={error}
          onRefresh={refresh}
        />
      </section>
    </SiteShell>
  );
}
