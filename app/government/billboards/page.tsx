"use client";

import Image from "next/image";
import { GovShell } from "@/components/civic/GovShell";
import { StatusBadge, naira } from "@/components/civic/StatusBadge";
import { BILLBOARDS } from "@/lib/civic/government";
import { useVerificationMap } from "@/lib/civic/store";
import type { VerificationStatus } from "@/lib/civic/types";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { VERIFICATION_OPTIONS } from "@/lib/civic/options";

export default function GovBillboardsPage() {
  const { statusOf, setStatus } = useVerificationMap();
  return (
    <GovShell>
      <h1 className="text-2xl font-bold text-black">Billboards across Nigeria</h1>
      <p className="mt-1 text-sm text-gray-600">
        Monitor outdoor advertising permits, expiry and levy payments by state — with real asset
        photos.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {BILLBOARDS.map((b) => {
          const status = statusOf(b.id, b.verification);
          return (
            <article key={b.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="relative h-40">
                <Image
                  src={b.image || "/facilities/billboards/roadside-billboard-1.jpg"}
                  alt={b.location}
                  fill
                  className="object-cover"
                  sizes="(max-width:640px) 100vw, 33vw"
                />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-black">{b.location}</h2>
                    <p className="text-xs text-gray-500">
                      {b.lga || b.city}, {b.state}
                      {b.boardType ? ` · ${b.boardType}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={status} />
                </div>
                <p className="text-sm text-gray-700">{b.operator}</p>
                <p className="text-xs text-gray-500">
                  {b.permitNo} · expires {b.permitExpiry}
                </p>
                <p className="text-sm">
                  {naira(b.taxPaid)} paid /{" "}
                  <span className="text-red-700">{naira(b.taxOwed)} owed</span>
                </p>
                <CustomSelect
                  size="sm"
                  value={status}
                  onChange={(v) => setStatus(b.id, v as VerificationStatus)}
                  options={VERIFICATION_OPTIONS}
                  className="min-w-[120px]"
                />
              </div>
            </article>
          );
        })}
      </div>
    </GovShell>
  );
}
