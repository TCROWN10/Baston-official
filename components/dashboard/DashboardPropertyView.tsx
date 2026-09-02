"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ResidentialPropertyPanel } from "@/components/ussap/ResidentialPropertyPanel";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  formatPropertyCode,
  lookupDigitalAddress,
  propertiesForUser,
  registerUserProperty,
} from "@/lib/ussap/user-properties";
import {
  privacyViewerFromUser,
  viewResidentialProperty,
} from "@/lib/ussap/property-privacy";
import { shareAddress } from "@/lib/ussap/geocode";
import type { DashboardUser } from "./types";
import type { ResidentialSite } from "@/lib/ussap/types";

const PROPERTY_TYPES = [
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "compound", label: "Compound" },
  { value: "estate_unit", label: "Estate unit" },
];

type Props = {
  user: DashboardUser;
};

export function DashboardPropertyView({ user }: Props) {
  const viewer = privacyViewerFromUser(user);
  const [lookupCode, setLookupCode] = useState("");
  const [lookupSite, setLookupSite] = useState<ResidentialSite | null | "missing">(null);
  const [tick, setTick] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    label: "",
    propertyType: "house",
    unitNo: "",
    addressLine: "",
    city: user.lga || "",
    state: user.state || "Lagos",
    lat: "6.5244",
    lng: "3.3792",
  });

  const myProperties = useMemo(() => {
    void tick;
    return propertiesForUser(user.id, user.email);
  }, [user.id, user.email, tick]);

  const lookupView = useMemo(() => {
    if (!lookupSite || lookupSite === "missing") return null;
    return viewResidentialProperty(lookupSite, viewer);
  }, [lookupSite, viewer]);

  const onLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const site = lookupDigitalAddress(lookupCode);
    setLookupSite(site ?? "missing");
  };

  const onRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const lat = Number(form.lat);
    const lng = Number(form.lng);
    if (!form.label.trim()) {
      setError("Give your property a name (e.g. Family home).");
      return;
    }
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError("Enter valid latitude and longitude.");
      return;
    }
    const site = registerUserProperty({
      userId: user.id,
      userEmail: user.email,
      userName: user.fullName,
      label: form.label.trim(),
      propertyType: form.propertyType as ResidentialSite["propertyType"],
      unitNo: form.unitNo || undefined,
      addressLine: form.addressLine || undefined,
      city: form.city || user.lga || "Unknown",
      state: form.state,
      lga: user.lga,
      lat,
      lng,
    });
    setSuccess(`Digital address ${formatPropertyCode(site.code)} registered — pending verification.`);
    setTick((t) => t + 1);
    setForm((f) => ({ ...f, label: "", unitNo: "", addressLine: "" }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My property</h1>
        <p className="mt-1 text-sm text-slate-600">
          Check any registered property or manage yours. You always see full details for your own
          properties; other owners&apos; confidential data stays private unless you are admin or
          government.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">Check a property</h2>
          <p className="mt-1 text-sm text-slate-600">
            Look up yours or another organisation&apos;s property — public facts only when it is not
            yours.
          </p>
          <form onSubmit={onLookup} className="mt-4 space-y-3">
            <input
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              placeholder="e.g. 6CFJ-8QRX"
              className="field-control w-full px-3 py-2 font-mono text-sm uppercase"
            />
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#152a45]"
            >
              Look up address
            </button>
          </form>

          {lookupSite === "missing" ? (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              No property found for that code. Register yours below or check the spelling.
            </p>
          ) : lookupView ? (
            <div className="mt-4">
              <ResidentialPropertyPanel view={lookupView} showMap={false} compact />
            </div>
          ) : null}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">Register your property</h2>
          <p className="mt-1 text-sm text-slate-600">
            Generate a shareable digital address for deliveries, utilities, and navigation.
          </p>
          {error ? (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {success}
            </p>
          ) : null}
          <form onSubmit={onRegister} className="mt-4 space-y-2">
            <input
              required
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="Property name"
              className="field-control w-full px-3 py-2 text-sm"
            />
            <CustomSelect
              value={form.propertyType}
              onChange={(v) => setForm((f) => ({ ...f, propertyType: v }))}
              options={PROPERTY_TYPES}
              ariaLabel="Property type"
              size="sm"
            />
            <input
              value={form.addressLine}
              onChange={(e) => setForm((f) => ({ ...f, addressLine: e.target.value }))}
              placeholder="Street / plot description"
              className="field-control w-full px-3 py-2 text-sm"
            />
            <input
              value={form.unitNo}
              onChange={(e) => setForm((f) => ({ ...f, unitNo: e.target.value }))}
              placeholder="Unit / plot number"
              className="field-control w-full px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                placeholder="Area / LGA"
                className="field-control px-3 py-2 text-sm"
              />
              <input
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                placeholder="State"
                className="field-control px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                value={form.lat}
                onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                placeholder="Latitude"
                className="field-control px-3 py-2 text-sm"
              />
              <input
                value={form.lng}
                onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                placeholder="Longitude"
                className="field-control px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer w-full rounded-lg bg-[#3d7ea6] py-2 text-sm font-medium text-white hover:bg-[#326a8c]"
            >
              Generate digital address
            </button>
          </form>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Your registered properties</h2>
          <p className="text-sm text-slate-600">{myProperties.length} linked to your account</p>
        </div>
        {myProperties.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-slate-600">
            No properties linked yet. Register your home or plot above to get a Bastion Technology digital address.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {myProperties.map((site) => {
              const ownView = viewResidentialProperty(site, viewer);
              return (
                <li key={site.code} className="px-5 py-4">
                  <ResidentialPropertyPanel view={ownView} showMap={false} compact />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard?.writeText(shareAddress(site.code, site.label))
                      }
                      className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Copy address
                    </button>
                    <Link
                      href={`/ussap/address/${site.code}`}
                      className="rounded-lg bg-[#1e3a5f] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#152a45]"
                    >
                      View full record
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
