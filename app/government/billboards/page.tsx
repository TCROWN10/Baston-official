"use client";

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
        Monitor outdoor advertising permits, expiry and levy payments by state.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Operator</th>
              <th className="px-4 py-3">Permit</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Paid / Owed</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {BILLBOARDS.map((b) => {
              const status = statusOf(b.id, b.verification);
              return (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">
                    {b.location}
                    <div className="text-xs text-gray-500">
                      {b.city}, {b.state}
                    </div>
                  </td>
                  <td className="px-4 py-3">{b.operator}</td>
                  <td className="px-4 py-3 text-xs">{b.permitNo}</td>
                  <td className="px-4 py-3">{b.permitExpiry}</td>
                  <td className="px-4 py-3">
                    {naira(b.taxPaid)} / <span className="text-red-700">{naira(b.taxOwed)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-4 py-3">
                    <CustomSelect
                      size="sm"
                      value={status}
                      onChange={(v) => setStatus(b.id, v as VerificationStatus)}
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
