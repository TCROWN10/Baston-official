"use client";

import Link from "next/link";
import { useMemo } from "react";
import { UssapShell } from "@/components/ussap/UssapShell";
import { SiteCard } from "@/components/ussap/SiteCard";
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
        Browse public tower locations and USSAP digital addresses. Operators sign in to manage
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

      <div className="mt-6 space-y-4 sm:mt-8">
        {sites.map((site) => {
          const full = showFullDetail(site);
          return (
            <article key={site.code} className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold sm:text-lg">{site.label}</h2>
                  <p className="font-mono text-sm text-[#1e3a5f]">{formatCode(site.code)}</p>
                  <p className="mt-1 break-words text-xs text-slate-500">
                    {site.towerId} · {site.operator} · {site.heightM}m · {site.technology.join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {site.city}, {site.state}
                  </p>
                </div>
                <span
                  className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase ${
                    site.sensitivity === "public"
                      ? "bg-emerald-100 text-emerald-800"
                      : site.sensitivity === "restricted"
                        ? "bg-violet-100 text-violet-800"
                        : "bg-slate-200 text-slate-800"
                  }`}
                >
                  {site.sensitivity}
                </span>
              </div>

              {full ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Equipment
                    </h3>
                    <ul className="mt-1 space-y-1 text-sm text-slate-700">
                      {site.equipment.map((e) => (
                        <li key={e.name + (e.serial || "")}>
                          {e.name} — {e.model}
                          {e.serial ? ` (${e.serial})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Maintenance route
                    </h3>
                    <p className="mt-1 text-sm text-slate-700">
                      Route {site.maintenanceRouteId || "—"}
                      <br />
                      Last: {site.lastMaintenance || "—"} · Next: {site.nextMaintenance || "—"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  Public listing — location and operator only. Equipment serials and maintenance
                  routes require operator clearance.
                </p>
              )}

              <div className="mt-4 max-w-sm">
                <SiteCard site={site} />
              </div>
            </article>
          );
        })}
        {sites.length === 0 ? (
          <p className="text-sm text-slate-600">No telecom sites in the registry yet.</p>
        ) : null}
      </div>
    </UssapShell>
  );
}
