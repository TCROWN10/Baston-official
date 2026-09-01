"use client";

import Link from "next/link";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { AppSidebarLayout } from "@/components/layout/AppSidebarLayout";
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
  | "profile"
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
        <span aria-hidden className="w-5 text-center text-xs">⌂</span>
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
        <span aria-hidden className="w-5 text-center text-xs">🏠</span>
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
          <span aria-hidden className="w-5 text-center text-xs">{item.icon}</span>
          {item.label}
        </button>
      ))}

      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        My account
      </p>
      <button
        type="button"
        onClick={() => onViewChange("profile")}
        className={linkClass(activeView === "profile")}
      >
        <span aria-hidden className="w-5 text-center text-xs">⚙</span>
        Profile settings
      </button>
      <Link href="/account/trips" className={linkClass(false)}>
        <span aria-hidden className="w-5 text-center text-xs">✈</span>
        My trips
      </Link>

      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        Workspace
      </p>
      <button
        type="button"
        onClick={() => onViewChange("listings")}
        className={linkClass(activeView === "listings")}
      >
        <span aria-hidden className="w-5 text-center text-xs">📋</span>
        My listings
      </button>
      <Link href="/dashboard/listing" className={linkClass(false)}>
        <span aria-hidden className="w-5 text-center text-xs">＋</span>
        Add listing
      </Link>
      <button
        type="button"
        onClick={() => onViewChange("map")}
        className={linkClass(activeView === "map")}
      >
        <span aria-hidden className="w-5 text-center text-xs">🗺</span>
        Live map
      </button>
      <Link href="/" className={linkClass(false)}>
        <span aria-hidden className="w-5 text-center text-xs">↗</span>
        Public site
      </Link>
    </nav>
  );
}

export function DashboardShell({ user, activeView, onViewChange, children }: Props) {
  const roleLabel =
    user.role === "company" ? "Organisation" : user.role === "agent" ? "Individual" : user.role;

  return (
    <AppSidebarLayout
      brandHref="/dashboard"
      brandTitle={BRAND.name}
      brandSubtitle="Member dashboard"
      nav={<SidebarNav activeView={activeView} onViewChange={onViewChange} />}
      headerRight={<UserAvatarMenu size="sm" />}
      footer={
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
      }
    >
      {children}
    </AppSidebarLayout>
  );
}
