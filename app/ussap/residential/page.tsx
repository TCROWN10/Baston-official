"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { UssapShell } from "@/components/ussap/UssapShell";
import { SiteCard } from "@/components/ussap/SiteCard";
import { useAuth } from "@/lib/auth";
import { encodeGrid, formatCode, shareAddress } from "@/lib/ussap/geocode";
import { privacyViewerFromUser } from "@/lib/ussap/property-privacy";
import { sitesBySector, upsertSite } from "@/lib/ussap/registry";
import type { ResidentialSite, UssapRole } from "@/lib/ussap/types";

export default function ResidentialPage() {
  const { user } = useAuth();
  const viewer = privacyViewerFromUser(user);
  const role = user?.role as UssapRole | undefined;
  const [tick, setTick] = useState(0);
  const [form, setForm] = useState({
    label: "",
    lat: "6.4474",
    lng: "3.4722",
    city: "Lekki",
    state: "Lagos",
    unitNo: "",
  });

  const sites = useMemo(() => {
    void tick;
    return sitesBySector("residential", role) as ResidentialSite[];
  }, [role, tick]);

  const canRegister = Boolean(
    user &&
      (user.role === "citizen" ||
        user.role === "admin" ||
        user.role === "government" ||
        user.role === "field_agent" ||
        user.role === "agent" ||
        user.role === "company"),
  );

  const register = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canRegister) return;
    const lat = Number(form.lat);
    const lng = Number(form.lng);
    const code = encodeGrid(lat, lng, 8);
    const site: ResidentialSite = {
      code,
      lat,
      lng,
      label: form.label || `Residence ${formatCode(code)}`,
      sector: "residential",
      state: form.state,
      city: form.city,
      verification: "pending",
      sensitivity: "public",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      propertyType: "house",
      unitNo: form.unitNo,
      shareable: true,
      ownerOrg: user?.fullName,
    };
    upsertSite(site);
    setTick((t) => t + 1);
    setForm((f) => ({ ...f, label: "", unitNo: "" }));
  };

  return (
    <UssapShell>
      <h1 className="text-3xl font-bold">Residential module</h1>
        <p className="mt-1 text-sm text-slate-600">
          Reliable residential cloud addressing for deliveries, utility billing, and navigation.
          Looking to buy or rent?{" "}
          <Link href="/buy" className="font-medium text-[#1e3a5f] hover:underline">
            Browse property listings →
          </Link>
        </p>

      {canRegister ? (
        <form onSubmit={register} className="mt-6 grid gap-3 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
          <h2 className="sm:col-span-2 lg:col-span-3 text-sm font-semibold">Register a home address</h2>
          <input
            className="field-control px-3 py-2 text-sm"
            placeholder="Label (e.g. Family home)"
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            required
          />
          <input
            className="field-control px-3 py-2 text-sm"
            placeholder="Latitude"
            value={form.lat}
            onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
            required
          />
          <input
            className="field-control px-3 py-2 text-sm"
            placeholder="Longitude"
            value={form.lng}
            onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
            required
          />
          <input
            className="field-control px-3 py-2 text-sm"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          />
          <input
            className="field-control px-3 py-2 text-sm"
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
          />
          <input
            className="field-control px-3 py-2 text-sm"
            placeholder="Unit / plot"
            value={form.unitNo}
            onChange={(e) => setForm((f) => ({ ...f, unitNo: e.target.value }))}
          />
          <button type="submit" className="cursor-pointer rounded-xl bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white sm:col-span-2 lg:col-span-3">
            Generate digital address
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-slate-600">
          <Link href="/login" className="font-medium text-[#1e3a5f] hover:underline">
            Sign in
          </Link>{" "}
          to register a home address, or use{" "}
          <Link href="/dashboard" className="font-medium text-[#1e3a5f] hover:underline">
            My property
          </Link>{" "}
          on your dashboard.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => (
          <article key={site.code} className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="font-semibold">{site.label}</h2>
            <p className="font-mono text-xs text-[#1e3a5f]">{formatCode(site.code)}</p>
            <p className="mt-2 text-xs text-slate-500">
              {site.propertyType}
              {site.unitNo ? ` · ${site.unitNo}` : ""}
              {site.utilityMeterId ? ` · Meter ${site.utilityMeterId}` : ""}
            </p>
            {site.deliveryNotes ? (
              <p className="mt-2 text-sm text-slate-700">{site.deliveryNotes}</p>
            ) : null}
            {site.shareable ? (
              <button
                type="button"
                className="mt-3 cursor-pointer text-xs font-medium text-[#152a45]"
                onClick={() => navigator.clipboard?.writeText(shareAddress(site.code, site.label))}
              >
                Copy shareable address
              </button>
            ) : (
              <p className="mt-3 text-xs text-slate-400">Private — not shareable</p>
            )}
            <div className="mt-3">
              <SiteCard site={site} viewer={viewer} />
            </div>
          </article>
        ))}
      </div>
    </UssapShell>
  );
}
