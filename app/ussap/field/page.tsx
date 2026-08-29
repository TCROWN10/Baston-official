"use client";

import { useEffect, useMemo, useState } from "react";
import { UssapShell } from "@/components/ussap/UssapShell";
import { UssapMap } from "@/components/ussap/UssapMap";
import { CustomSelect } from "@/components/ui/CustomSelect";
import {
  dropOfflinePin,
  listOfflinePins,
  syncOfflinePins,
} from "@/lib/ussap/offline";
import { formatCode } from "@/lib/ussap/geocode";
import type { OfflinePin, SectorKind } from "@/lib/ussap/types";
import { allSites } from "@/lib/ussap/data";

export default function FieldPage() {
  const [online, setOnline] = useState(true);
  const [pins, setPins] = useState<OfflinePin[]>([]);
  const [label, setLabel] = useState("");
  const [sector, setSector] = useState<SectorKind>("residential");
  const [notes, setNotes] = useState("");
  const [pendingDrop, setPendingDrop] = useState<{ lat: number; lng: number } | null>(null);
  const [syncMsg, setSyncMsg] = useState("");

  const refresh = () => setPins(listOfflinePins());

  useEffect(() => {
    refresh();
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const mapSites = useMemo(() => allSites().slice(0, 8), []);

  const confirmDrop = () => {
    if (!pendingDrop || !label.trim()) return;
    dropOfflinePin({
      lat: pendingDrop.lat,
      lng: pendingDrop.lng,
      label: label.trim(),
      sector,
      notes,
    });
    setPendingDrop(null);
    setLabel("");
    setNotes("");
    refresh();
  };

  const onSync = async () => {
    const res = await syncOfflinePins();
    setSyncMsg(
      online
        ? `Synced ${res.synced} pin(s) to cloud registry.`
        : `Offline — ${res.failed} pin(s) waiting to sync.`,
    );
    refresh();
  };

  return (
    <UssapShell>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold sm:text-3xl">Field agent · Offline mode</h1>
          <p className="mt-1 text-sm text-slate-600">
            Drop pins, view cached map context, and retrieve digital addresses without active
            internet. Data syncs when reconnected.
          </p>
        </div>
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            online ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
          }`}
        >
          {online ? "Online" : "Offline — local store active"}
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-medium text-slate-500">
            Tap the map to drop a pin (works offline via local device storage).
          </p>
          <UssapMap
            sites={mapSites}
            dropMode
            onDrop={(lat, lng) => setPendingDrop({ lat, lng })}
            zoom={6}
            heightClass="h-[280px] sm:h-[360px] md:h-[420px]"
          />
        </div>

        <div className="space-y-4">
          {pendingDrop ? (
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold">New pin</h2>
              <p className="mt-1 break-all font-mono text-xs text-slate-500">
                {pendingDrop.lat.toFixed(6)}, {pendingDrop.lng.toFixed(6)}
              </p>
              <input
                className="field-control mt-3 px-3 py-2 text-sm"
                placeholder="Site label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
              <div className="mt-2">
                <CustomSelect
                  value={sector}
                  onChange={(v) => setSector(v as SectorKind)}
                  options={[
                    { value: "telecom", label: "Telecom" },
                    { value: "project", label: "Project" },
                    { value: "traffic", label: "Traffic" },
                    { value: "school", label: "School" },
                    { value: "residential", label: "Residential" },
                  ]}
                />
              </div>
              <textarea
                className="field-control mt-2 px-3 py-2 text-sm"
                rows={3}
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={confirmDrop}
                  className="cursor-pointer rounded-lg bg-[#1e3a5f] px-3 py-2.5 text-xs font-medium text-white sm:py-2"
                >
                  Save offline + generate code
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDrop(null)}
                  className="cursor-pointer rounded-lg bg-slate-100 px-3 py-2.5 text-xs font-medium sm:py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Local pin vault</h2>
              <button
                type="button"
                onClick={onSync}
                className="cursor-pointer rounded-lg bg-[#1e3a5f] px-3 py-1.5 text-xs font-medium text-white"
              >
                Sync now
              </button>
            </div>
            {syncMsg ? <p className="mt-2 text-xs text-emerald-700">{syncMsg}</p> : null}
            <ul className="mt-3 max-h-64 space-y-2 overflow-auto sm:max-h-80">
              {pins.map((p) => (
                <li key={p.id} className="rounded-xl bg-slate-50 px-3 py-2 text-xs">
                  <p className="font-semibold text-slate-900">{p.label}</p>
                  <p className="font-mono text-[#1e3a5f]">{p.code ? formatCode(p.code) : "—"}</p>
                  <p className="text-slate-500">
                    {p.sector} · {p.synced ? "synced" : "pending sync"}
                  </p>
                </li>
              ))}
              {pins.length === 0 ? (
                <li className="text-slate-500">No offline pins yet.</li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </UssapShell>
  );
}
