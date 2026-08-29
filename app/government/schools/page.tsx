"use client";

import { GovShell } from "@/components/civic/GovShell";
import { StatusBadge } from "@/components/civic/StatusBadge";
import { SCHOOLS } from "@/lib/civic/directory";
import { useVerificationMap } from "@/lib/civic/store";
import type { VerificationStatus } from "@/lib/civic/types";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { VERIFICATION_OPTIONS } from "@/lib/civic/options";

export default function GovSchoolsPage() {
  const { statusOf, setStatus } = useVerificationMap();

  return (
    <GovShell>
      <h1 className="text-2xl font-bold text-black">Schools registry</h1>
      <p className="mt-1 text-sm text-gray-600">
        Ministry of Education verification only. This platform does not sell school adverts.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">School</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Level / ownership</th>
              <th className="px-4 py-3">MOE number</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {SCHOOLS.map((s) => {
              const status = statusOf(s.id, s.verification);
              return (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3">{s.state}</td>
                  <td className="px-4 py-3">
                    {s.level} · {s.ownership}
                  </td>
                  <td className="px-4 py-3 text-xs">{s.moeNumber}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={status} />
                  </td>
                  <td className="px-4 py-3">
                    <CustomSelect
                      size="sm"
                      value={status}
                      onChange={(v) => setStatus(s.id, v as VerificationStatus)}
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
