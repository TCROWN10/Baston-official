"use client";

import { useMemo, useState } from "react";
import { GovShell } from "@/components/civic/GovShell";
import { StatusBadge, naira } from "@/components/civic/StatusBadge";
import { VEHICLES, lookupPlate, papersExpired } from "@/lib/civic/government";

export default function GovVehiclesPage() {
  const [plate, setPlate] = useState("");
  const hit = useMemo(() => (plate.trim() ? lookupPlate(plate) : undefined), [plate]);

  return (
    <GovShell>
      <h1 className="text-2xl font-bold text-black">Vehicles & plate numbers</h1>
      <p className="mt-1 text-sm text-gray-600">
        Match plates from CCTV / traffic cameras against government vehicle papers (licence,
        insurance, roadworthiness) and tax standing.
      </p>

      <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <label className="text-sm font-medium text-black">Plate lookup</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value.toUpperCase())}
            placeholder="e.g. ABC-193-FG"
            className="field-control flex-1 px-4 py-2.5 text-sm"
          />
        </div>
        {plate && !hit ? (
          <p className="mt-3 text-sm text-red-600">No vehicle found for this plate in the demo registry.</p>
        ) : null}
        {hit ? (
          <div className="mt-4 grid gap-3 rounded-xl border border-gray-100 bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <p>
              <span className="text-gray-500">Vehicle:</span> {hit.make} {hit.model} ({hit.year})
            </p>
            <p>
              <span className="text-gray-500">Owner:</span> {hit.ownerName}
            </p>
            <p>
              <span className="text-gray-500">Status:</span> <StatusBadge status={hit.status} />
            </p>
            <p>
              <span className="text-gray-500">Tax owed:</span>{" "}
              <span className="text-red-700">{naira(hit.taxOwed)}</span>
            </p>
            {Object.entries(papersExpired(hit)).map(([k, expired]) => (
              <p key={k}>
                <span className="capitalize text-gray-500">{k}:</span>{" "}
                {expired ? (
                  <span className="font-semibold text-red-700">EXPIRED</span>
                ) : (
                  <span className="text-emerald-700">valid</span>
                )}
              </p>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Plate</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Licence</th>
              <th className="px-4 py-3">Insurance</th>
              <th className="px-4 py-3">Roadworthy</th>
              <th className="px-4 py-3">Tax owed</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {VEHICLES.map((v) => {
              const papers = papersExpired(v);
              return (
                <tr key={v.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-mono font-semibold">{v.plate}</td>
                  <td className="px-4 py-3">
                    {v.make} {v.model}
                  </td>
                  <td className="px-4 py-3">{v.ownerName}</td>
                  <td className={`px-4 py-3 ${papers.licence ? "text-red-700" : ""}`}>
                    {v.licenceExpiry}
                  </td>
                  <td className={`px-4 py-3 ${papers.insurance ? "text-red-700" : ""}`}>
                    {v.insuranceExpiry}
                  </td>
                  <td className={`px-4 py-3 ${papers.roadworthiness ? "text-red-700" : ""}`}>
                    {v.roadworthinessExpiry}
                  </td>
                  <td className="px-4 py-3 text-red-700">{naira(v.taxOwed)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={v.status} />
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
