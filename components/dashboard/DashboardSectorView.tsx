"use client";

import Link from "next/link";
import {
  getDashboardSectors,
  sectorHrefWithLocation,
} from "@/lib/ussap/dashboard-sectors";
import type { DashboardView } from "./DashboardShell";
import type { DashboardUser } from "./types";

const SECTOR_ICONS: Record<string, string> = {
  education: "🎓",
  health: "🏥",
  billboards: "📢",
  hospitality: "🏨",
  telecom: "📡",
  core: "🛡️",
};

type Props = {
  sectorId: Exclude<DashboardView, "overview" | "property" | "map" | "listings">;
  user: DashboardUser;
  onViewChange?: (view: DashboardView) => void;
};

export function DashboardSectorView({ sectorId, user, onViewChange }: Props) {
  const sector = getDashboardSectors().find((s) => s.id === sectorId);
  if (!sector) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1e3a5f]/10 text-2xl">
          {SECTOR_ICONS[sector.id]}
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3d7ea6]">
            Sector {sector.number}
          </p>
          <h1 className="text-2xl font-bold text-slate-900">{sector.title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-600">{sector.tagline}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {sector.howToUse.map((item, index) => (
          <div
            key={item}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold text-[#3d7ea6]">Step {index + 1}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{item}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {sector.quickActions.map((action) => {
            const href =
              user.state && ["/ussap/schools", "/ussap/health"].includes(action.href)
                ? sectorHrefWithLocation(action.href, user.state, user.lga)
                : action.href;
            if (action.href === "/ussap/map" && onViewChange) {
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => onViewChange("map")}
                  className={
                    action.primary
                      ? "cursor-pointer rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#152a45]"
                      : "cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  }
                >
                  {action.label}
                </button>
              );
            }
            return (
              <Link
                key={action.label}
                href={href}
                className={
                  action.primary
                    ? "rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#152a45]"
                    : "rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                }
              >
                {action.label}
              </Link>
            );
          })}
          <Link
            href={`/ussap/sectors/${sector.id}`}
            className="rounded-lg border border-[#3d7ea6]/30 px-4 py-2 text-sm font-medium text-[#3d7ea6] hover:bg-[#3d7ea6]/5"
          >
            Full sector overview →
          </Link>
        </div>
      </div>

      {user.state ? (
        <div className="mt-4 rounded-xl border border-[#1e3a5f]/15 bg-[#1e3a5f]/5 px-4 py-3 text-sm text-slate-700">
          Your registered area:{" "}
          <strong>
            {user.lga ? `${user.lga}, ` : ""}
            {user.state}
          </strong>
          . Education and health links open filtered to this location when available.
        </div>
      ) : null}
    </div>
  );
}
