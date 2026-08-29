"use client";

import { useEffect, useState } from "react";
import { GovShell } from "@/components/civic/GovShell";
import { StatusBadge } from "@/components/civic/StatusBadge";
import {
  CCTV_CAMERAS,
  VEHICLES,
  lookupPlate,
  papersExpired,
} from "@/lib/civic/government";
import type { PlateEvent } from "@/lib/civic/types";

export default function GovCctvPage() {
  const [events, setEvents] = useState<PlateEvent[]>([]);

  useEffect(() => {
    const online = CCTV_CAMERAS.filter((c) => c.online);
    const push = () => {
      const camera = online[Math.floor(Math.random() * online.length)];
      const vehicle = VEHICLES[Math.floor(Math.random() * VEHICLES.length)];
      const papers = papersExpired(vehicle);
      const flags = Object.entries(papers)
        .filter(([, expired]) => expired)
        .map(([k]) => `${k} expired`);
      if (vehicle.taxOwed > 0) flags.push("tax owed");
      const event: PlateEvent = {
        id: `evt-${Date.now()}`,
        cameraId: camera.id,
        plate: vehicle.plate,
        detectedAt: new Date().toISOString(),
        confidence: 0.88 + Math.random() * 0.1,
        papersExpired: flags.length > 0,
        flags,
      };
      setEvents((prev) => [event, ...prev].slice(0, 25));
    };
    push();
    const t = setInterval(push, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <GovShell>
      <h1 className="text-2xl font-bold text-black">CCTV & traffic management</h1>
      <p className="mt-1 text-sm text-gray-600">
        Cameras operated by state traffic agencies, markets boards, and partner organisations. Live
        plate detections are matched to government vehicle papers in real time (demo stream).
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-black">Camera network</h2>
          <ul className="mt-4 max-h-[420px] space-y-3 overflow-y-auto">
            {CCTV_CAMERAS.map((cam) => (
              <li key={cam.id} className="rounded-xl border border-gray-100 px-3 py-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-black">{cam.name}</p>
                  <StatusBadge status={cam.online ? "online" : "offline"} />
                </div>
                <p className="mt-1 text-gray-600">
                  {cam.city}, {cam.state} · {cam.operator}
                </p>
                <p className="text-xs capitalize text-gray-500">{cam.type}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-black">Live plate detections</h2>
          <ul className="mt-4 max-h-[420px] space-y-3 overflow-y-auto">
            {events.map((evt) => {
              const cam = CCTV_CAMERAS.find((c) => c.id === evt.cameraId);
              const vehicle = lookupPlate(evt.plate);
              return (
                <li
                  key={evt.id}
                  className={`rounded-xl border px-3 py-3 text-sm ${
                    evt.papersExpired ? "border-red-200 bg-red-50" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-base font-bold">{evt.plate}</p>
                    <span className="text-xs text-gray-500">
                      {(evt.confidence * 100).toFixed(0)}% ·{" "}
                      {new Date(evt.detectedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-600">{cam?.name}</p>
                  {vehicle ? (
                    <p className="text-gray-700">
                      {vehicle.make} {vehicle.model} · {vehicle.ownerName}
                    </p>
                  ) : null}
                  {evt.flags.length ? (
                    <p className="mt-1 font-medium text-red-700">{evt.flags.join(" · ")}</p>
                  ) : (
                    <p className="mt-1 text-emerald-700">Papers compliant</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </GovShell>
  );
}
