"use client";

import { GovShell } from "@/components/civic/GovShell";
import { StatusBadge, naira } from "@/components/civic/StatusBadge";
import { MARKETS } from "@/lib/civic/government";
import { useVerificationMap } from "@/lib/civic/store";
import type { VerificationStatus } from "@/lib/civic/types";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { VERIFICATION_OPTIONS } from "@/lib/civic/options";

export default function GovMarketsPage() {
  const { statusOf, setStatus } = useVerificationMap();
  return (
    <GovShell>
      <h1 className="text-2xl font-bold text-black">Markets</h1>
      <p className="mt-1 text-sm text-gray-600">
        Market boards, stall levies, and CCTV coverage for major trading centres.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Market</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Stalls</th>
              <th className="px-4 py-3">Levy paid</th>
              <th className="px-4 py-3">Levy owed</th>
              <th className="px-4 py-3">CCTV</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {MARKETS.map((m) => {
              const status = statusOf(m.id, m.verification);
              return (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{m.name}</td>
                  <td className="px-4 py-3">
                    {m.city}, {m.state}
                  </td>
                  <td className="px-4 py-3">{m.stalls.toLocaleString()}</td>
                  <td className="px-4 py-3">{naira(m.levyPaid)}</td>
                  <td className="px-4 py-3 text-red-700">{naira(m.levyOwed)}</td>
                  <td className="px-4 py-3">{m.hasCctv ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-4 py-3">
                    <CustomSelect
                      size="sm"
                      value={status}
                      onChange={(v) => setStatus(m.id, v as VerificationStatus)}
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
