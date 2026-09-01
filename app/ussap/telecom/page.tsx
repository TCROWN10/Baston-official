"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { UssapShell } from "@/components/ussap/UssapShell";
import { useAuth } from "@/lib/auth";
import { formatCode } from "@/lib/ussap/geocode";
import { canAccessSector, canViewSensitivity } from "@/lib/ussap/rbac";
import { getRegistry, sitesBySector } from "@/lib/ussap/registry";
import type { TelecomSite, UssapRole } from "@/lib/ussap/types";

function canManageTelecom(role?: UssapRole) {
  return role === "telecom" || role === "admin" || role === "government" || role === "field_agent";
}

export default function TelecomPage() {
  const { user } = useAuth();
  const role = user?.role as UssapRole | undefined;
  const sites = useMemo(() => sitesBySector("telecom", role) as TelecomSite[], [role]);

  const hiddenCount = useMemo(() => {
    const all = getRegistry().filter((s) => s.sector === "telecom");
    const visibleCodes = new Set(sites.map((s) => s.code));
    return all.filter((s) => !visibleCodes.has(s.code)).length;
  }, [sites]);

  const showFullDetail = (site: TelecomSite) =>
    site.sensitivity !== "public" ||
    (role ? canAccessSector(role, "telecom") && canViewSensitivity(role, site.sensitivity) : false);

  return (
    <UssapShell>
      <h1 className="text-2xl font-bold sm:text-3xl">Telecommunications module</h1>
      <p className="mt-1 text-sm text-slate-600">
        Browse tower sites with photos and USSAP digital addresses. Operators sign in to manage
        equipment specs, serial numbers, and maintenance routes on restricted sites.
      </p>

      {hiddenCount > 0 && !canManageTelecom(role) ? (
        <p className="mt-3 rounded-xl bg-[#1e3a5f]/10 px-3 py-3 text-sm text-[#0f1f35] sm:px-4">
          Showing <strong>{sites.length}</strong> public tower record{sites.length === 1 ? "" : "s"}.
          {hiddenCount} restricted site{hiddenCount === 1 ? "" : "s"} hidden —{" "}
          <Link href="/login" className="font-semibold text-[#1e3a5f] underline">
            sign in as a telecom operator
          </Link>{" "}
          to view full equipment and maintenance data.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 xl:grid-cols-3">
        {sites.map((site) => {
          const full = showFullDetail(site);
          const image = site.image || "/facilities/telecom/telecom-001.jpg";
          return (
            <article
              key={site.code}
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
            >
              <Link
                href={`/ussap/address/${encodeURIComponent(site.code)}`}
                className="relative block aspect-[16/10] bg-slate-200"
              >
                <Image
                  src={image}
                  alt={site.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <span
                  className={`absolute right-2 top-2 rounded-md px-2 py-1 text-[10px] font-semibold uppercase ${
                    site.sensitivity === "public"
                      ? "bg-emerald-100 text-emerald-800"
                      : site.sensitivity === "restricted"
                        ? "bg-violet-100 text-violet-800"
                        : "bg-slate-200 text-slate-800"
                  }`}
                >
                  {site.sensitivity}
                </span>
              </Link>

              <div className="p-4">
                <h2 className="text-base font-semibold text-slate-900">{site.label}</h2>
                <p className="mt-0.5 font-mono text-sm text-[#1e3a5f]">{formatCode(site.code)}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {site.towerId} · {site.operator} · {site.heightM}m · {site.technology.join(", ")}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {site.city}, {site.state}
                </p>

                {full ? (
                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                    <div>
                      <h3 className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Equipment
                      </h3>
                      <ul className="mt-1 space-y-0.5 text-xs text-slate-700">
                        {site.equipment.map((e) => (
                          <li key={e.name + (e.serial || "")}>
                            {e.name} — {e.model}
                            {e.serial ? ` (${e.serial})` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xs text-slate-600">
                      Route {site.maintenanceRouteId || "—"} · Last: {site.lastMaintenance || "—"} ·
                      Next: {site.nextMaintenance || "—"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 rounded-lg bg-slate-50 px-2.5 py-2 text-[11px] text-slate-600">
                    Public listing — location and operator only. Equipment details require operator
                    clearance.
                  </p>
                )}

                <Link
                  href={`/ussap/address/${encodeURIComponent(site.code)}`}
                  className="mt-3 inline-block text-xs font-semibold text-[#1e3a5f] hover:underline"
                >
                  Open digital address →
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {sites.length === 0 ? (
        <p className="mt-6 text-sm text-slate-600">No telecom sites in the registry yet.</p>
      ) : null}
    </UssapShell>
  );
}
