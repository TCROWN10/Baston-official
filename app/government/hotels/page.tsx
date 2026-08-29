"use client";

import { GovShell } from "@/components/civic/GovShell";
import { StatusBadge, naira } from "@/components/civic/StatusBadge";
import { HOTELS } from "@/lib/civic/directory";
import { useVerificationMap } from "@/lib/civic/store";
import type { VerificationStatus } from "@/lib/civic/types";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { VERIFICATION_OPTIONS } from "@/lib/civic/options";

export default function GovHotelsPage() {
  const { statusOf, setStatus } = useVerificationMap();

  return (
    <GovShell>
      <h1 className="text-2xl font-bold text-black">Hotel verification</h1>
      <p className="mt-1 text-sm text-gray-600">
        Confirm NTDC / tourism-board registration, CAC, and tax standing. Verified hotels can run
        customer adverts on the public site.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Hotel</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">NTDC / CAC</th>
              <th className="px-4 py-3">Tax paid</th>
              <th className="px-4 py-3">Tax owed</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {HOTELS.map((h) => {
              const status = statusOf(h.id, h.verification);
              return (
                <tr key={h.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{h.name}</td>
                  <td className="px-4 py-3">{h.state}</td>
                  <td className="px-4 py-3 text-xs">
                    {h.tourismBoardNo}
                    <br />
                    {h.cacNumber}
                  </td>
                  <td className="px-4 py-3">{naira(h.taxPaid)}</td>
                  <td className="px-4 py-3 text-red-700">{naira(h.taxOwed)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-4 py-3">
                    <CustomSelect
                      size="sm"
                      value={status}
                      onChange={(v) => setStatus(h.id, v as VerificationStatus)}
                      options={VERIFICATION_OPTIONS}
                      className="min-w-[120px]"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GovShell>
  );
}
