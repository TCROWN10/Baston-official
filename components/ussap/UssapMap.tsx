"use client";

import { useEffect, useMemo, useState } from "react";
import type { SectorKind, UssapSite } from "@/lib/ussap/types";
import { formatCode } from "@/lib/ussap/geocode";

export const SECTOR_COLOR: Record<SectorKind, string> = {
  telecom: "#7c3aed",
  project: "#ea580c",
  traffic: "#dc2626",
  school: "#2563eb",
  residential: "#059669",
};

type Props = {
  sites: UssapSite[];
  center?: [number, number];
  zoom?: number;
  activeLayers?: SectorKind[];
  onSelect?: (site: UssapSite) => void;
  dropMode?: boolean;
  onDrop?: (lat: number, lng: number) => void;
  heightClass?: string;
  basemap?: "osm" | "satellite";
};

export function UssapMap(props: Props) {
  const [Ready, setReady] = useState<React.ComponentType<Props> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      await import("leaflet/dist/leaflet.css");
      const rl = await import("react-leaflet");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } = rl;

      function DropHandler({
        enabled,
        onDropPin,
      }: {
        enabled?: boolean;
        onDropPin?: Props["onDrop"];
      }) {
        useMapEvents({
          click(e) {
            if (enabled && onDropPin) onDropPin(e.latlng.lat, e.latlng.lng);
          },
        });
        return null;
      }

      function Inner(p: Props) {
        const visible = useMemo(() => {
          if (!p.activeLayers?.length) return p.sites;
          return p.sites.filter((s) => p.activeLayers!.includes(s.sector));
        }, [p.sites, p.activeLayers]);

        const tile =
          p.basemap === "satellite"
            ? {
                url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                attribution: "Tiles &copy; Esri",
              }
            : {
                url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                attribution:
                  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
              };

        return (
          <MapContainer
            center={p.center || [9.082, 8.6753]}
            zoom={p.zoom ?? 6}
            className={`z-0 w-full rounded-xl sm:rounded-2xl ${p.heightClass || "h-[320px] sm:h-[420px] md:h-[480px]"}`}
            scrollWheelZoom
            dragging
            touchZoom
            doubleClickZoom
          >
            <TileLayer attribution={tile.attribution} url={tile.url} />
            <DropHandler enabled={p.dropMode} onDropPin={p.onDrop} />
            {visible.map((site) => (
              <CircleMarker
                key={site.code}
                center={[site.lat, site.lng]}
                radius={9}
                pathOptions={{
                  color: "#fff",
                  weight: 2,
                  fillColor: SECTOR_COLOR[site.sector],
                  fillOpacity: 0.9,
                }}
                eventHandlers={{ click: () => p.onSelect?.(site) }}
              >
                <Popup>
                  <div className="min-w-[160px] text-sm">
                    <p className="font-semibold text-slate-900">{site.label}</p>
                    <p className="font-mono text-xs text-[#1e3a5f]">{formatCode(site.code)}</p>
                    <p className="mt-1 capitalize text-slate-600">
                      {site.sector} · {site.city}, {site.state}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        );
      }

      if (!cancelled) setReady(() => Inner);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!Ready) {
    return (
      <div
        className={`flex w-full items-center justify-center rounded-2xl bg-slate-200 text-sm text-slate-600 ${props.heightClass || "h-[480px]"}`}
      >
        Loading map engine…
      </div>
    );
  }

  return <Ready {...props} />;
}
