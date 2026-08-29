"use client";

import { GovShell } from "@/components/civic/GovShell";
import { StatusBadge, naira } from "@/components/civic/StatusBadge";
import { COMPANIES } from "@/lib/civic/directory";
import { useVerificationMap } from "@/lib/civic/store";
import type { VerificationStatus } from "@/lib/civic/types";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { VERIFICATION_OPTIONS } from "@/lib/civic/options";

export default function GovCompaniesPage() {
  const { statusOf, setStatus } = useVerificationMap();

  return (
    <GovShell>
      <h1 className="text-2xl font-bold text-black">Companies & private organisations</h1>
      <p className="mt-1 text-sm text-gray-600">
        Verify CAC registration and tax paid versus tax owed.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Organisation</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3">CAC / TIN</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Owed</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {COMPANIES.map((c) => {
              const status = statusOf(c.id, c.verification);
              return (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3">{c.sector}</td>
                  <td className="px-4 py-3 text-xs">
                    {c.cacNumber}
                    <br />
                    {c.tin}
                  </td>
                  <td className="px-4 py-3">{naira(c.taxPaid)}</td>
                  <td className="px-4 py-3 text-red-700">{naira(c.taxOwed)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-4 py-3">
                    <CustomSelect
                      size="sm"
                      value={status}
                      onChange={(v) => setStatus(c.id, v as VerificationStatus)}
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
