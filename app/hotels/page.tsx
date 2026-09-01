"use client";

import { DirectoryGrid } from "@/components/civic/DirectoryGrid";
import { UssapShell } from "@/components/ussap/UssapShell";
import { useLiveHotels } from "@/lib/live/useLiveHotels";

export default function HotelsPage() {
  const { items, loading, source, liveCount, error, refresh } = useLiveHotels();

  return (
    <UssapShell>
      <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#0f1f35] px-5 py-8 sm:px-8 sm:py-10">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Hotels across Nigeria</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
          Live hotels from OpenStreetMap across Nigeria — with photos and verified / registered
          status on each card.
        </p>
      </div>
      <DirectoryGrid
        items={items}
        kind="hotel"
        loading={loading}
        source={source}
        liveCount={liveCount}
        error={error}
        onRefresh={refresh}
      />
    </UssapShell>
  );
}
