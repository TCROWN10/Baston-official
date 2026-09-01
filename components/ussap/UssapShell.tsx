"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UserAvatarMenu } from "@/components/UserAvatarMenu";
import { useAuth } from "@/lib/auth";
import { BRAND } from "@/lib/ussap/data";
import { canAccessAdminConsole, canAccessGovernmentPortal } from "@/lib/ussap/rbac";

type NavItem = { href: string; label: string; icon: string; exact?: boolean };

const PRIMARY_NAV: NavItem[] = [
  { href: "/ussap/sectors", label: "All sectors", icon: "▦", exact: true },
  { href: "/ussap/map", label: "Live map", icon: "🗺" },
];

const SECTOR_NAV: NavItem[] = [
  { href: "/ussap/schools", label: "Education", icon: "🎓" },
  { href: "/ussap/health", label: "Health", icon: "🏥" },
  { href: "/ussap/billboards", label: "Billboards", icon: "📢" },
  { href: "/hotels", label: "Hotels", icon: "🏨" },
  { href: "/ussap/telecom", label: "Telecom", icon: "📡" },
  { href: "/ussap/projects", label: "Projects", icon: "🏗" },
  { href: "/ussap/traffic", label: "Traffic", icon: "🚦" },
  { href: "/ussap/residential", label: "Addresses", icon: "🏠" },
  { href: "/ussap/field", label: "Field", icon: "📍" },
  { href: "/ussap/sectors/core", label: "Bastion", icon: "🛡️" },
];

function isActive(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  if (item.href === "/ussap/sectors") {
    return pathname === "/ussap/sectors" || pathname.startsWith("/ussap/sectors/");
  }
  if (item.href === "/ussap/schools") {
    return pathname === "/ussap/schools" || pathname.startsWith("/ussap/schools/");
  }
  if (item.href === "/ussap/health") {
    return pathname === "/ussap/health" || pathname.startsWith("/ussap/health/");
  }
  if (item.href === "/hotels") {
    return pathname === "/hotels" || pathname.startsWith("/hotels/");
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavLink({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isActive(pathname, item);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-white/15 text-white"
          : "text-white/75 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span aria-hidden className="w-5 text-center text-xs">
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const showConsole = canAccessAdminConsole(user?.role);
  const showGov = canAccessGovernmentPortal(user?.role);

  return (
    <nav className="space-y-1">
      {PRIMARY_NAV.map((item) => (
        <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
      ))}

      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        Sectors
      </p>
      {SECTOR_NAV.map((item) => (
        <NavLink key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
      ))}

      <p className="px-3 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
        Workspace
      </p>
      <NavLink
        item={{ href: "/dashboard", label: "Dashboard", icon: "⌂" }}
        pathname={pathname}
        onNavigate={onNavigate}
      />
      <NavLink
        item={{ href: "/account", label: "Profile", icon: "⚙" }}
        pathname={pathname}
        onNavigate={onNavigate}
      />
      {showGov ? (
        <NavLink
          item={{ href: "/government", label: "Government", icon: "🏛" }}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ) : null}
      {showConsole ? (
        <NavLink
          item={{ href: "/ussap/console", label: "Admin console", icon: "🛠" }}
          pathname={pathname}
          onNavigate={onNavigate}
        />
      ) : null}
      <NavLink
        item={{ href: "/", label: "Public site", icon: "↗" }}
        pathname={pathname}
        onNavigate={onNavigate}
      />
    </nav>
  );
}

/** USSAP app chrome — navy sidebar shared by all sector pages. */
export function UssapShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700"
        >
          Menu
        </button>
        <Link href="/ussap/sectors" className="text-sm font-bold tracking-[0.1em] text-[#1e3a5f]">
          {BRAND.name}
        </Link>
        {user ? <UserAvatarMenu size="sm" /> : (
          <Link href="/login" className="text-sm font-medium text-[#1e3a5f]">
            Sign in
          </Link>
        )}
      </header>

      <div className="mx-auto flex max-w-[1440px]">
        <aside className="hidden w-60 shrink-0 flex-col bg-[#1e3a5f] lg:sticky lg:top-0 lg:flex lg:h-screen lg:overflow-y-auto">
          <div className="border-b border-white/10 px-5 py-5">
            <Link href="/ussap/sectors" className="text-base font-bold tracking-[0.12em] text-white">
              {BRAND.name}
            </Link>
            <p className="mt-1 text-xs text-white/60">Spatial sectors</p>
          </div>
          <div className="flex-1 px-3 py-4">
            <SidebarNav />
          </div>
          <div className="border-t border-white/10 px-4 py-4">
            {user ? (
              <div className="flex items-center gap-3">
                <UserAvatarMenu size="sm" align="left" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{user.fullName}</p>
                  <p className="truncate text-xs text-white/55">{user.email}</p>
                </div>
              </div>
            ) : (
              <Link
                href="/login?redirect=/ussap/sectors"
                className="block rounded-lg bg-white/10 px-3 py-2 text-center text-sm font-medium text-white hover:bg-white/15"
              >
                Sign in
              </Link>
            )}
          </div>
        </aside>

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
                  className="cursor-pointer text-white/80"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4">
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
              </div>
            </aside>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
