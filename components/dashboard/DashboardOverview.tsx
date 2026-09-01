"use client";

import Link from "next/link";
import {
  getDashboardSectors,
  sectorHrefWithLocation,
} from "@/lib/ussap/dashboard-sectors";
import type { DashboardUser } from "./types";
import type { DashboardView } from "./DashboardShell";

const SECTOR_ICONS: Record<string, string> = {
  education: "🎓",
  health: "🏥",
  billboards: "📢",
  hospitality: "🏨",
  telecom: "📡",
  core: "🛡️",
};

type Props = {
  user: DashboardUser;
  listingCount: number;
  activeListings: number;
  propertyCount: number;
  onViewChange: (view: DashboardView) => void;
};

export function DashboardOverview({
  user,
  listingCount,
  activeListings,
  propertyCount,
  onViewChange,
}: Props) {
  const sectors = getDashboardSectors();

  const statCards = [
    {
      label: "My properties",
      value: String(propertyCount),
      hint: "Digital addresses linked to your account",
      action: () => onViewChange("property"),
    },
    {
      label: "Your location",
      value: user.lga && user.state ? user.lga : user.state || "Not set",
      hint: user.state ? (user.lga ? user.state : "Add LGA in account") : "Set at signup",
    },
    {
      label: "Active listings",
      value: String(activeListings),
      hint: `${listingCount} total in hospitality sector`,
    },
    {
      label: "USSAP sectors",
      value: "6 + Bastion",
      hint: "Education, health, billboards, hotels, telecom, field tools",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="mt-1 text-sm text-slate-600">
          Welcome back, {user.fullName}. Pick a sector from the sidebar or open a module below.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${
              card.action ? "cursor-pointer hover:border-[#1e3a5f]/30 hover:shadow-md" : ""
            }`}
            {...(card.action
              ? {
                  role: "button" as const,
                  tabIndex: 0,
                  onClick: card.action,
                  onKeyDown: (e: React.KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") card.action?.();
                  },
                }
              : {})}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className="mt-2 text-xl font-bold text-[#1e3a5f]">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-[#1e3a5f]/15 bg-[#1e3a5f]/5 px-4 py-3 text-sm text-slate-700">
        <strong>Core USSAP mission:</strong> check or register your property with a digital address
        under{" "}
        <button
          type="button"
          onClick={() => onViewChange("property")}
          className="cursor-pointer font-medium text-[#1e3a5f] underline"
        >
          My property
        </button>
        . Other owners&apos; confidential details stay private — only admin and government see
        everything.
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Sector modules</h2>
          <button
            type="button"
            onClick={() => onViewChange("map")}
            className="cursor-pointer text-sm font-medium text-[#3d7ea6] hover:underline"
          >
            Open live map →
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sectors.map((sector) => {
            const primary = sector.quickActions.find((a) => a.primary) ?? sector.quickActions[0];
            const href =
              user.state && ["/ussap/schools", "/ussap/health"].includes(primary.href)
                ? sectorHrefWithLocation(primary.href, user.state, user.lga)
                : primary.href;

            return (
              <article
                key={sector.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1e3a5f]/10 text-lg">
                    {SECTOR_ICONS[sector.id]}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3d7ea6]">
                      Sector {sector.number}
                    </p>
                    <h3 className="font-semibold text-[#1e3a5f]">{sector.shortTitle}</h3>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm text-slate-600 line-clamp-3">{sector.tagline}</p>
                <ul className="mt-3 space-y-1">
                  {sector.howToUse.slice(0, 2).map((item) => (
                    <li key={item} className="flex gap-2 text-xs text-slate-600">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#3d7ea6]" />
                      <span className="line-clamp-2">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={href}
                    className="rounded-lg bg-[#3d7ea6] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#326a8c]"
                  >
                    {primary.label}
                  </Link>
                  <button
                    type="button"
                    onClick={() => onViewChange(sector.id as DashboardView)}
                    className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Learn more
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
