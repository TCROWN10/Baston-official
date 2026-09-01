"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { PROPERTIES } from "@/lib/data";

export default function AdminPage() {
  return (
    <AdminShell>
      <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
      <p className="mt-1 text-sm text-slate-600">Marketplace admin snapshot for listings and content.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Properties", value: PROPERTIES.length },
          {
            label: "Active listings",
            value: PROPERTIES.filter((p) => p.status === "active").length,
          },
          { label: "Categories", value: 3 },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-black">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-black">Recent listings</h2>
        <ul className="mt-4 divide-y divide-gray-100">
          {PROPERTIES.slice(0, 6).map((p) => (
            <li key={p.id} className="flex items-center justify-between py-3 text-sm">
              <span className="font-medium text-black">{p.title}</span>
              <span className="text-gray-500">{p.listingCategory}</span>
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  );
}
