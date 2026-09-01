"use client";

import Link from "next/link";
import { GovShell } from "@/components/civic/GovShell";
import { StatusBadge, naira } from "@/components/civic/StatusBadge";
import { COMPANIES, HOTELS, SCHOOLS } from "@/lib/civic/directory";
import { BILLBOARDS, CCTV_CAMERAS, MARKETS, PROJECTS, VEHICLES } from "@/lib/civic/government";

export default function GovernmentHomePage() {
  const hotelOwed = HOTELS.reduce((s, h) => s + h.taxOwed, 0);
  const companyOwed = COMPANIES.reduce((s, c) => s + c.taxOwed, 0);
  const expiredPlates = VEHICLES.filter((v) => v.status !== "compliant").length;

  const cards = [
    { label: "Hotels on register", value: HOTELS.length.toString() },
    { label: "Companies / organisations", value: COMPANIES.length.toString() },
    { label: "Schools (no adverts)", value: SCHOOLS.length.toString() },
    { label: "CCTV cameras", value: `${CCTV_CAMERAS.filter((c) => c.online).length}/${CCTV_CAMERAS.length}` },
    { label: "Vehicles with expired papers", value: expiredPlates.toString() },
    { label: "Hotel tax owed", value: naira(hotelOwed) },
    { label: "Company tax owed", value: naira(companyOwed) },
    { label: "Billboards · Markets · Projects", value: `${BILLBOARDS.length} · ${MARKETS.length} · ${PROJECTS.length}` },
  ];

  return (
    <GovShell>
      <h1 className="text-2xl font-bold text-black">National operations overview</h1>
      <p className="mt-1 text-sm text-gray-600">
        Partner console for hotel verification, organisation registry, plate/CCTV checks, tax
        standing, billboards, markets and public projects.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-black">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-black">Registered accounts</h2>
            <p className="mt-1 text-sm text-gray-600">
              Track every USSAP user — location, role, and linked properties.
            </p>
          </div>
          <Link
            href="/government/accounts"
            className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#152a45]"
          >
            View all accounts →
          </Link>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-black">Attention queue</h2>
        <ul className="mt-4 divide-y divide-gray-100 text-sm">
          {HOTELS.filter((h) => h.verification !== "verified")
            .slice(0, 4)
            .map((h) => (
              <li key={h.id} className="flex items-center justify-between py-3">
                <span>{h.name}</span>
                <StatusBadge status={h.verification} />
              </li>
            ))}
          {VEHICLES.filter((v) => v.status !== "compliant")
            .slice(0, 3)
            .map((v) => (
              <li key={v.id} className="flex items-center justify-between py-3">
                <span>
                  {v.plate} · {v.ownerName}
                </span>
                <StatusBadge status={v.status} />
              </li>
            ))}
        </ul>
      </div>
    </GovShell>
  );
}
