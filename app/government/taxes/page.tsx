"use client";

import { useMemo, useState } from "react";
import { GovShell } from "@/components/civic/GovShell";
import { naira } from "@/components/civic/StatusBadge";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { taxLedger } from "@/lib/civic/government";

export default function GovTaxesPage() {
  const [type, setType] = useState("all");
  const rows = useMemo(() => {
    const all = taxLedger();
    return type === "all" ? all : all.filter((r) => r.entityType === type);
  }, [type]);
  const paid = rows.reduce((s, r) => s + r.taxPaid, 0);
  const owed = rows.reduce((s, r) => s + r.taxOwed, 0);

  return (
    <GovShell>
      <h1 className="text-2xl font-bold text-black">Taxes paid / owed</h1>
      <p className="mt-1 text-sm text-gray-600">
        Consolidated ledger for hotels, companies, vehicles, billboards and markets.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Collected</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{naira(paid)}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-xs text-gray-500">Outstanding</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{naira(owed)}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <label className="text-xs text-gray-500">Filter</label>
          <CustomSelect
            value={type}
            onChange={setType}
            className="mt-1"
            options={[
              { value: "all", label: "All entities" },
              { value: "hotel", label: "Hotels" },
              { value: "company", label: "Companies" },
              { value: "vehicle", label: "Vehicles" },
              { value: "billboard", label: "Billboards" },
              { value: "market", label: "Markets" },
            ]}
          />
        </div>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">TIN</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Owed</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 120).map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{r.entityName}</td>
                <td className="px-4 py-3 capitalize">{r.entityType}</td>
                <td className="px-4 py-3">{r.state}</td>
                <td className="px-4 py-3 text-xs">{r.tin || "—"}</td>
                <td className="px-4 py-3 text-emerald-700">{naira(r.taxPaid)}</td>
                <td className="px-4 py-3 text-red-700">{naira(r.taxOwed)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GovShell>
  );
}
