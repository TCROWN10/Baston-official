"use client";

import Link from "next/link";
import { useState } from "react";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { BRAND } from "@/lib/ussap/data";
import type { DashboardUser } from "./types";

const SECTOR_NAV = [
  { id: "education" as const, label: "Education", icon: "🎓" },
  { id: "health" as const, label: "Health", icon: "🏥" },
  { id: "billboards" as const, label: "Billboards", icon: "📢" },
  { id: "hospitality" as const, label: "Hotels", icon: "🏨" },
  { id: "telecom" as const, label: "Telecom", icon: "📡" },
  { id: "core" as const, label: "Bastion", icon: "🛡️" },
];

export type DashboardView =
  | "overview"
  | "property"
  | "map"
  | "education"
  | "health"
  | "billboards"
  | "hospitality"
  | "telecom"
  | "core"
  | "listings";

type Props = {
  user: DashboardUser;
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  children: React.ReactNode;
};

function SidebarNav({
  activeView,
  onViewChange,
}: {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}) {
  const linkClass = (active: boolean) =>
    `flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
      active
        ? "bg-white/15 text-white"
        : "text-white/75 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <nav className="space-y-1">
      <button type="button" onClick={() => onViewChange("overview")} className={linkClass(activeView === "overview")}>
        <span aria-hidden>⌂</span>
        Overview
      </button>

      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        Your USSAP
      </p>
      <button
        type="button"
        onClick={() => onViewChange("property")}
        className={linkClass(activeView === "property")}
      >
        <span aria-hidden>🏠</span>
        My property
      </button>

      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        Sectors
      </p>
      {SECTOR_NAV.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onViewChange(item.id)}
          className={linkClass(activeView === item.id)}
        >
          <span aria-hidden>{item.icon}</span>
          {item.label}
        </button>
      ))}

      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        Workspace
      </p>
      <button
        type="button"
        onClick={() => onViewChange("listings")}
        className={linkClass(activeView === "listings")}
      >
        <span aria-hidden>📋</span>
        My listings
      </button>
      <Link href="/dashboard/listing" className={linkClass(false)}>
        <span aria-hidden>＋</span>
        Add listing
      </Link>
      <button
        type="button"
        onClick={() => onViewChange("map")}
        className={linkClass(activeView === "map")}
      >
        <span aria-hidden>🗺</span>
        Live map
      </button>
      <Link href="/account" className={linkClass(false)}>
        <span aria-hidden>⚙</span>
        Account
      </Link>
      <Link href="/" className={linkClass(false)}>
        <span aria-hidden>↗</span>
        Public site
      </Link>
    </nav>
  );
}

export function DashboardShell({ user, activeView, onViewChange, children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const roleLabel =
    user.role === "company" ? "Organisation" : user.role === "agent" ? "Individual" : user.role;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700"
        >
          Menu
        </button>
        <span className="text-sm font-bold tracking-[0.1em] text-[#1e3a5f]">{BRAND.name}</span>
        <UserAvatarMenu size="sm" />
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        {/* Sidebar — desktop */}
        <aside className="hidden w-60 shrink-0 flex-col bg-[#1e3a5f] lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto">
          <div className="border-b border-white/10 px-5 py-5">
            <Link href="/dashboard" className="text-base font-bold tracking-[0.12em] text-white">
              {BRAND.name}
            </Link>
            <p className="mt-1 text-xs text-white/60">Member dashboard</p>
          </div>

          <div className="flex-1 px-3 py-4">
            <SidebarNav activeView={activeView} onViewChange={onViewChange} />
          </div>

          <div className="border-t border-white/10 px-4 py-4">
            <div className="flex items-center gap-3">
              <UserAvatarMenu size="sm" align="left" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{user.fullName}</p>
                <p className="truncate text-xs text-white/55">{user.email}</p>
                <p className="mt-0.5 text-xs text-white/45">{roleLabel}</p>
                {user.state ? (
                  <p className="truncate text-xs text-white/45">
                    {user.lga ? `${user.lga}, ` : ""}
                    {user.state}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative flex h-full w-72 flex-col bg-[#1e3a5f] shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                <span className="font-bold tracking-[0.1em] text-white">{BRAND.name}</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="text-white/80"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4">
                <SidebarNav
                  activeView={activeView}
                  onViewChange={(view) => {
                    onViewChange(view);
                    setMobileOpen(false);
                  }}
                />
              </div>
            </aside>
          </div>
        ) : null}

        {/* Main */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
